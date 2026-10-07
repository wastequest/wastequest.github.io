/* WasteQuest v2 — Event Town (#/event): one big screen, many phones, one shared pixel town.
   Routes: #/event (host setup + big screen) · #/event/join[/<code>] (player phone).
   Transport: PeerJS (WebRTC, free PeerServer Cloud, same CDN + approach as js/class.js). The host laptop is authoritative:
   it checks every answer, dedupes, and decides town upgrades. Phones only send a choice. Nothing is stored server-side;
   everything lives in the host page's memory and is wiped by "End event" (or closing the tab).
     phone → host: hello {pid,lang} · answer {r,i} · team {t} · nick {} · ping {}
     host → phone: st {ph,code,nick:[a,n],team,board, r,q,a,left,mine, c,why,ok,frac, rank,pts} · ping {}
   Town: each round's question topic maps to a district; the share of correct answers among those who answered
   raises that district (perfect round = +2 levels, max 3). The Arena rises with participation.
   Modes: phones (needs internet) or screen-only (host clicks the room's / the turn team's answer; works offline).
   Booth mode: short auto-advancing loop (5 rounds) + "Next visitor" reset. Player screens are silent (no WQ.beep).
   Emits: "answer"(ok,"event") on phones (no sound). Calls WQ.data.log("event", …) when present.
   SOURCES: questions come from WQ.questions (js/data/questions.js, sourced there). Capacity guidance from
   research/v2/10_innovation.md §3 (PeerJS FAQ: performance may degrade with many peers; team/wave play for big crowds).
   PeerJS (MIT) and qrcodejs (MIT) loaded from cdnjs/unpkg at runtime. */
(() => {
"use strict";
if (typeof WQ === "undefined") return;

const PFX = "wasteq-ev-";
const PEER_JS = ["https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js", "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"];
const QR_JS = ["https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"];
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const SHAPES = ["▲", "◆", "●", "■"];
const DIST = ["academy", "recycle", "compost", "maker", "market", "arena"];
const DNAME = { academy: { en: "Academy", bm: "Akademi" }, recycle: { en: "Recycling Plant", bm: "Loji Kitar Semula" }, compost: { en: "Compost Farm", bm: "Ladang Kompos" },
  maker: { en: "Maker Lab", bm: "Makmal Pereka" }, market: { en: "Market", bm: "Pasar" }, arena: { en: "Arena", bm: "Arena" } };
const DICON = { academy: "🏫", recycle: "♻️", compost: "🌱", maker: "🛠️", market: "🏪", arena: "🏟️" };
const TOPIC_D = { sorting: "recycle", plastics: "recycle", compost: "compost", enzyme: "compost", ph: "compost", labs: "maker", w2w: "maker",
  economy: "market", malaysia: "academy", circular: "academy", sdg: "academy", energy: "academy" };
const ROUND_D = ["recycle", "compost", "maker", "market", "academy"];
const TEAMS = [
  ["#0098dc", "#fff", { en: "Team Blue Bin", bm: "Pasukan Tong Biru" }], ["#ffa214", "#1a1932", { en: "Team Orange Bin", bm: "Pasukan Tong Oren" }],
  ["#8a4836", "#fff", { en: "Team Brown Bin", bm: "Pasukan Tong Perang" }], ["#5ac54f", "#1a1932", { en: "Team Green Leaf", bm: "Pasukan Daun Hijau" }],
  ["#f68187", "#1a1932", { en: "Team Pink Lotus", bm: "Pasukan Teratai Merah Jambu" }], ["#ffeb57", "#1a1932", { en: "Team Yellow Sun", bm: "Pasukan Matahari Kuning" }]];
const ADJ = [["Cheerful", "Ceria"], ["Brave", "Berani"], ["Clever", "Bijak"], ["Speedy", "Pantas"], ["Kind", "Baik Hati"], ["Mighty", "Perkasa"],
  ["Calm", "Tenang"], ["Jolly", "Riang"], ["Smart", "Cerdik"], ["Busy", "Rajin"], ["Gentle", "Lembut"], ["Bold", "Gagah"]];
const NOUN = [["Turtle", "Penyu"], ["Hornbill", "Enggang"], ["Tapir", "Tapir"], ["Orangutan", "Orang Utan"], ["Tiger", "Harimau"], ["Kingfisher", "Raja Udang"],
  ["Firefly", "Kelip-kelip"], ["Mangrove", "Bakau"], ["Hibiscus", "Bunga Raya"], ["Durian", "Durian"], ["Pandan", "Pandan"], ["Rambutan", "Rambutan"],
  ["Mousedeer", "Kancil"], ["Pangolin", "Tenggiling"]];
const nickTxt = n => { const a = ADJ[n[0]] || ADJ[0], b = NOUN[n[1]] || NOUN[0]; return WQ.lang === "bm" ? `${b[1]} ${a[1]}` : `${a[0]} ${b[0]}`; };
const tName = i => WQ.t((TEAMS[i] || TEAMS[0])[2]);

const S = {
  title: { en: "Event Town", bm: "Bandar Acara" },
  sub: { en: "Everyone's answers clean one shared town on the big screen.", bm: "Jawapan semua orang membersihkan satu bandar bersama pada skrin besar." },
  subJoin: { en: "Join the Event Town on the big screen.", bm: "Sertai Bandar Acara pada skrin besar." },
  setup: { en: "Set up the event", bm: "Sediakan acara" },
  modeL: { en: "How will people answer?", bm: "Bagaimana peserta menjawab?" },
  mPh: { en: "📱 Phones (needs internet)", bm: "📱 Telefon (perlu internet)" },
  mSc: { en: "🖥️ Screen only, no phones (works offline)", bm: "🖥️ Skrin sahaja, tanpa telefon (boleh tanpa internet)" },
  teamsN: { en: "Number of teams", bm: "Bilangan pasukan" }, level: { en: "Question level", bm: "Tahap soalan" },
  tracks: { kids: { en: "Kids 7–12", bm: "Kanak-kanak 7–12" }, teens: { en: "Teens 13–17", bm: "Remaja 13–17" }, adults: { en: "Adults", bm: "Dewasa" } },
  rounds: { en: "Rounds", bm: "Pusingan" }, secs: { en: "Seconds per question", bm: "Saat setiap soalan" },
  booth: { en: "Booth mode: short loop (5 rounds) that runs by itself, with a “Next visitor” reset", bm: "Mod reruai: pusingan pendek (5 pusingan) yang berjalan sendiri, dengan butang “Pelawat seterusnya”" },
  board: { en: "Show team scores (leaderboard). Off = only the town is shown.", bm: "Tunjukkan markah pasukan (papan pendahulu). Tutup = hanya bandar ditunjukkan." },
  go: { en: "Open the Event Town ▶", bm: "Buka Bandar Acara ▶" },
  helpT: { en: "Host help", bm: "Bantuan hos" },
  help: [
    { en: "Open this page on the laptop connected to the projector. You control the rounds; phones only send answers.", bm: "Buka halaman ini pada komputer riba yang disambungkan ke projektor. Anda mengawal pusingan; telefon hanya menghantar jawapan." },
    { en: "Plan for about 30–40 phones per host (free connection service). For bigger crowds, play in teams or waves: one phone per team, or groups taking turns.", bm: "Rancang untuk kira-kira 30–40 telefon bagi setiap hos (perkhidmatan sambungan percuma). Untuk orang ramai yang lebih besar, main secara pasukan atau berkumpulan: satu telefon setiap pasukan, atau kumpulan bergilir-gilir." },
    { en: "Players get a fun nickname (no real names) and are put into a team. Nothing is saved online; End event wipes all scores.", bm: "Pemain mendapat nama samaran yang menyeronokkan (bukan nama sebenar) dan dimasukkan ke dalam pasukan. Tiada apa yang disimpan dalam talian; Tamatkan acara memadam semua markah." },
    { en: "No internet or Wi-Fi blocked? Choose Screen only: you click the answer the room (or the team whose turn it is) calls out.", bm: "Tiada internet atau Wi-Fi disekat? Pilih Skrin sahaja: anda klik jawapan yang disebut oleh penonton (atau pasukan yang tiba gilirannya)." },
    { en: "Please rehearse at the venue first: school and hall Wi-Fi sometimes blocks live mode. A phone hotspot usually works.", bm: "Sila buat raptai di tempat acara dahulu: Wi-Fi sekolah dan dewan kadangkala menyekat mod langsung. Hotspot telefon biasanya berfungsi." }],
  starting: { en: "Starting… connecting to the free connection service.", bm: "Memulakan… menyambung ke perkhidmatan sambungan percuma." },
  fail: { en: "Could not start live mode (no internet or blocked network).", bm: "Tidak dapat memulakan mod langsung (tiada internet atau rangkaian disekat)." },
  toScreen: { en: "Use Screen only instead", bm: "Guna Skrin sahaja" }, retry: { en: "Try again", bm: "Cuba lagi" },
  codeL: { en: "Event code", bm: "Kod acara" },
  how: { en: "Scan the QR code, or open WasteQuest → Event Town → Join and type the code.", bm: "Imbas kod QR, atau buka WasteQuest → Bandar Acara → Sertai dan taip kod." },
  local: { en: "This page runs only on this computer (file or localhost), so other phones cannot open the link. Host from the online WasteQuest site.", bm: "Halaman ini hanya berjalan pada komputer ini (fail atau localhost), jadi telefon lain tidak dapat membuka pautan. Anjurkan daripada laman WasteQuest dalam talian." },
  lost: { en: "Lost contact with the connection service. Players already in can keep playing; new players may not join.", bm: "Terputus hubungan dengan perkhidmatan sambungan. Pemain yang sudah masuk boleh terus bermain; pemain baharu mungkin tidak dapat masuk." },
  players: { en: "players", bm: "pemain" }, start: { en: "Start round", bm: "Mula pusingan" },
  autoIn: { en: "Starting by itself in", bm: "Bermula sendiri dalam" },
  roundOf: { en: "Round", bm: "Pusingan" }, of: { en: "of", bm: "daripada" },
  forD: { en: "This round cleans:", bm: "Pusingan ini membersihkan:" },
  answered: { en: "answered", bm: "sudah jawab" },
  turn: { en: "Answering now:", bm: "Giliran menjawab:" },
  clickAns: { en: "Click the answer the room calls out.", bm: "Klik jawapan yang disebut oleh penonton." },
  reveal: { en: "Show answer", bm: "Tunjuk jawapan" }, next: { en: "Next round ▶", bm: "Pusingan seterusnya ▶" },
  finish: { en: "Finish", bm: "Tamat" },
  right: { en: "got it right", bm: "betul" },
  why: { en: "Why?", bm: "Kenapa?" },
  gain: { en: "cleaner!", bm: "lebih bersih!" },
  endT: { en: "The town is cleaner because of you all!", bm: "Bandar lebih bersih kerana anda semua!" },
  nextVis: { en: "Next visitor (reset town)", bm: "Pelawat seterusnya (set semula bandar)" },
  again: { en: "Play again (reset town)", bm: "Main lagi (set semula bandar)" },
  endEv: { en: "End event (wipe all scores)", bm: "Tamatkan acara (padam semua markah)" },
  endQ: { en: "End the event? All scores and players will be wiped.", bm: "Tamatkan acara? Semua markah dan pemain akan dipadam." },
  resetIn: { en: "Resetting for the next visitor in", bm: "Set semula untuk pelawat seterusnya dalam" },
  fs: { en: "⛶ Fullscreen", bm: "⛶ Skrin penuh" },
  teamsT: { en: "Teams", bm: "Pasukan" }, pts: { en: "pts", bm: "mata" },
  town: { en: "Shared town", bm: "Bandar bersama" },
  noQ: { en: "No questions loaded.", bm: "Tiada soalan dimuatkan." },
  stars: { en: ["messy", "★", "★★", "★★★ all clean"], bm: ["bersepah", "★", "★★", "★★★ bersih"] },
  // player
  code: { en: "Event code", bm: "Kod acara" }, join: { en: "Join", bm: "Sertai" },
  badCode: { en: "The code has 5 letters or numbers, for example K7P2Q.", bm: "Kod mempunyai 5 huruf atau nombor, contohnya K7P2Q." },
  noName: { en: "No name needed: you get a fun nickname.", bm: "Tidak perlu nama: anda akan dapat nama samaran." },
  conn: { en: "Connecting…", bm: "Menyambung…" },
  notFound: { en: "Event not found. Check the code on the big screen.", bm: "Acara tidak dijumpai. Semak kod pada skrin besar." },
  pFail: { en: "Could not connect. Check your internet and try again.", bm: "Tidak dapat menyambung. Semak internet anda dan cuba lagi." },
  reconn: { en: "Reconnecting… keep this page open.", bm: "Menyambung semula… biarkan halaman ini terbuka." },
  you: { en: "You are", bm: "Anda ialah" }, newNick: { en: "🎲 New nickname", bm: "🎲 Nama samaran baharu" },
  yourTeam: { en: "Your team", bm: "Pasukan anda" }, change: { en: "Change team", bm: "Tukar pasukan" },
  wait: { en: "You're in! Look at the big screen.", bm: "Anda sudah masuk! Lihat skrin besar." },
  sent: { en: "Answer sent! Look at the big screen.", bm: "Jawapan dihantar! Lihat skrin besar." },
  tUp: { en: "Time's up!", bm: "Masa tamat!" },
  ok: { en: "Correct! You cleaned the town.", bm: "Betul! Anda membersihkan bandar." },
  no: { en: "Not this time.", bm: "Bukan kali ini." }, noAns: { en: "No answer this round.", bm: "Tiada jawapan pusingan ini." },
  ansWas: { en: "The answer:", bm: "Jawapan:" },
  pEnd: { en: "Thanks for cleaning the town!", bm: "Terima kasih kerana membersihkan bandar!" },
  rank: { en: "Your team came", bm: "Pasukan anda di tempat" },
  gone: { en: "The event has ended. Thank you!", bm: "Acara telah tamat. Terima kasih!" },
  home: { en: "Home", bm: "Utama" },
};
const t = o => WQ.t(o), esc = WQ.esc, $ = WQ.$;
const rand = () => { try { return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32; } catch (e) { return Math.random(); } };
const ri = n => Math.floor(rand() * n);
const makeCode = () => Array.from({ length: 5 }, () => CODE_CHARS[ri(CODE_CHARS.length)]).join("");
const normCode = s => String(s ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const validCode = c => c.length === 5 && [...c].every(ch => CODE_CHARS.includes(ch));
const reduced = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
const log = (a, p) => { try { WQ.data && WQ.data.log && WQ.data.log("event", { a, ...p }); } catch (e) {} };
const peerClass = () => window.Peer || (window.peerjs && window.peerjs.Peer);
const loading = {};
const loadAny = (urls, ready) => loading[urls[0]] = loading[urls[0]] || new Promise((ok, no) => {   // same loader as class.js
  if (ready()) return ok();
  let i = 0;
  const next = () => {
    if (i >= urls.length) { delete loading[urls[0]]; return no(new Error("load failed")); }
    const s = document.createElement("script"); s.src = urls[i++]; s.async = true;
    const to = setTimeout(() => { s.onload = s.onerror = null; s.remove(); next(); }, 12000);
    s.onload = () => { clearTimeout(to); ready() ? ok() : next(); };
    s.onerror = () => { clearTimeout(to); s.remove(); next(); };
    document.head.appendChild(s);
  };
  next();
});
const send = (c, m) => { try { if (c && c.open) c.send(m); } catch (e) {} };

WQ.css("event", `
.ev{--o:#1a1932}
.ev-p{background:#f9e6cf;border:3px solid var(--o);box-shadow:4px 4px 0 rgba(26,25,50,.35);padding:14px;margin:0 0 14px;color:var(--o)}
.ev h2,.ev h3,.ev .px,.ev-code,.ev-tile .sh,.ev-clock{font-family:"Pixelify Sans",monospace}
.ev-b{font:600 17px "Pixelify Sans",monospace;background:var(--o);color:#fff;border:3px solid var(--o);padding:10px 16px;cursor:pointer;min-height:44px}
.ev-b.l{background:#f9e6cf;color:var(--o)} .ev-b:focus-visible,.ev-tile:focus-visible{outline:3px solid #0098dc;outline-offset:2px}
.ev-b:disabled{opacity:.5;cursor:default}
.ev-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.ev label{display:block;margin:8px 0;font-size:17px}
.ev select,.ev input[type=text]{font:inherit;font-size:18px;padding:8px;border:3px solid var(--o);background:#fff;max-width:100%}
.ev fieldset{border:0;padding:0;margin:0 0 8px} .ev legend{font:600 17px "Pixelify Sans",monospace;margin-bottom:4px}
.ev-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:16px;align-items:start}
@media(max-width:820px){.ev-grid{grid-template-columns:minmax(0,1fr)}}
.ev-town canvas{display:block;width:100%;height:auto;image-rendering:pixelated;border:3px solid var(--o);background:#0098dc}
.ev-dl{list-style:none;margin:8px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}
.ev-dl li{background:#fff;border:2px solid var(--o);padding:4px 8px;font-size:15px}
.ev-dl li.up{background:#ffeb57}
.ev-code{font-size:56px;letter-spacing:6px;line-height:1;margin:4px 0}
.ev-qr{background:#fff;padding:8px;display:inline-block;border:3px solid var(--o)} .ev-qr img,.ev-qr canvas{display:block;width:180px;height:180px}
.ev-team{display:flex;justify-content:space-between;gap:8px;border:3px solid var(--o);padding:6px 10px;margin:4px 0;font:600 18px "Pixelify Sans",monospace}
.ev-q{font-size:clamp(20px,2.6vw,32px);font-weight:800;margin:6px 0 10px}
.ev-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:520px){.ev-tiles{grid-template-columns:1fr}}
.ev-tile{display:flex;gap:10px;align-items:center;text-align:left;font:700 18px Nunito,sans-serif;border:3px solid var(--o);padding:12px;min-height:64px;background:#fff;color:var(--o);box-shadow:3px 3px 0 rgba(26,25,50,.35)}
button.ev-tile{cursor:pointer} .ev-tile .sh{font-size:26px}
.ev-tile{background:#f9e6cf}.ev-tile.t0 .sh{color:#ea323c}.ev-tile.t1 .sh{color:#93388f}.ev-tile.t2 .sh{color:#1e6f50}.ev-tile.t3 .sh{color:#1a1932}
.ev:fullscreen{background:#8fd3ff;overflow:auto;padding:16px}
body.ev-play header.top>:not(.logo):not(.seg),body.ev-play footer,body.ev-play .pagehead .pi,body.ev-play .pagehead p{display:none!important}
body.ev-play header.top{padding-top:4px;padding-bottom:4px;min-height:0}
body.ev-play .pagehead{padding:4px 10px;margin:0 0 8px} body.ev-play .pagehead h1{font-size:20px;margin:0}
body.ev-play .ev-p{padding:8px 10px;margin-bottom:8px} body.ev-play .ev-tile{min-height:48px;padding:8px;font-size:17px} body.ev-play .ev-tiles{gap:8px}
.ev-tile.ok{outline:4px solid #1e6f50;outline-offset:2px} .ev-tile.dim{opacity:.45} .ev-tile.mine{outline:4px dashed var(--o)}
.ev-clock{font-size:36px} .ev-meter{height:14px;border:3px solid var(--o);background:#fff;margin:6px 0} .ev-meter i{display:block;height:100%;background:#5ac54f}
.ev-big{font-size:24px;font-weight:800}
.ev-chip{display:inline-block;border:3px solid var(--o);padding:4px 10px;font:600 18px "Pixelify Sans",monospace}
.ev-warn{background:#ffeb57;border:3px solid var(--o);padding:8px;margin:8px 0}
.ev-help li{margin:4px 0}
@media(prefers-reduced-motion:no-preference){.ev-dl li.up{animation:evpop .6s steps(3) 2}}
@keyframes evpop{50%{transform:translateY(-4px)}}
`);

/* ---------------- shared town drawing ---------------- */
const stateOf = prog => { const s = {}; DIST.forEach(d => s[d] = Math.min(3, Math.floor(prog[d] || 0))); return s; };
let raf = 0;
function townLoop() {
  cancelAnimationFrame(raf);
  const cv = $("#evTown"); if (!cv || !H) return;
  const ctx = cv.getContext("2d"), A = WQ.townArt, st = stateOf(H.prog), still = reduced();
  const frame = tm => {
    if (!cv.isConnected) return;
    try {
      if (A && A.draw) A.draw(ctx, { states: st, t: still ? 0 : tm });
      else { ctx.fillStyle = "#0098dc"; ctx.fillRect(0, 0, 400, 300);
        DIST.forEach((d, i) => { ctx.fillStyle = ["#5d5d5d", "#8a8a5a", "#5ac54f", "#1e6f50"][st[d]]; ctx.fillRect(20 + (i % 3) * 125, 40 + Math.floor(i / 3) * 130, 110, 100); }); }
    } catch (e) {}
    if (!still && A) raf = requestAnimationFrame(frame);
  };
  frame(performance.now());
}
const distList = up => `<ul class="ev-dl">${DIST.map(d => { const s = Math.min(3, Math.floor(H.prog[d] || 0));
  return `<li class="${up && up.includes(d) ? "up" : ""}">${DICON[d]} ${esc(t(DNAME[d]))}: <b>${esc(t(S.stars)[s])}</b></li>`; }).join("")}</ul>`;

/* ---------------- host ---------------- */
let H = null, root = null;
const defSet = () => ({ mode: "phones", teams: 4, track: WQ.aud === "teens" ? "teens" : WQ.aud === "kids" ? "kids" : "adults", rounds: 10, secs: 20, booth: false, board: false });
const on = p => !!(p.conn && p.conn.open);
const joinURL = c => location.origin + location.pathname + "#/event/join/" + c;
const isLocal = () => location.protocol === "file:" || /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(location.hostname);
const freshTown = () => ({ prog: {}, teams: TEAMS.map(() => 0), r: -1, turn: 0, up: [] });

function pickQs(set) {
  const pool = {}; ROUND_D.forEach(d => pool[d] = WQ.shuffle(WQ.questions.filter(q => q.tracks.includes(set.track) && TOPIC_D[q.topic] === d && q.a.length <= 4)));
  const n = set.booth ? 5 : set.rounds, out = [];
  for (let k = 0, miss = 0; out.length < n && miss < ROUND_D.length; k++) {
    const q = pool[ROUND_D[k % ROUND_D.length]].pop(); if (q) { out.push(q); miss = 0; } else miss++;
  }
  return out;
}
function clearT() { if (!H) return; clearInterval(H.tick); clearTimeout(H.autoT); H.tick = H.autoT = 0; }
function teardown() {
  cancelAnimationFrame(raf);
  if (!H) return; clearT(); clearInterval(H.pingT);
  H.players.forEach(p => send(p.conn, { type: "st", ph: "gone" }));
  const pr = H.peer; setTimeout(() => { try { pr && pr.destroy(); } catch (e) {} }, 300);
  log("host-end", { rounds: H.r + 1, players: H.players.size });
  H = null;
}
function startHost(set) {
  H = { set, ...freshTown(), phase: set.mode === "phones" ? "boot" : "lobby", players: new Map(), qs: pickQs(set) };
  log("host-start", { mode: set.mode, booth: set.booth, track: set.track, teams: set.teams });
  if (set.mode === "phones") boot(H, 0); else if (set.booth) armAuto();
  render();
}
function boot(h, tries) {
  h.phase = "boot"; h.err = 0;
  loadAny(QR_JS, () => window.QRCode).catch(() => {}).then(() => H === h && drawQR());
  loadAny(PEER_JS, peerClass).then(() => {
    if (H !== h) return;
    const code = makeCode(); let peer;
    try { peer = new (peerClass())(PFX + code, { debug: 0 }); } catch (e) { h.phase = "error"; return render(); }
    h.peer = peer;
    const mine = () => H === h && h.peer === peer, to = setTimeout(() => { if (mine() && !h.code) { h.phase = "error"; render(); } }, 15000);
    peer.on("open", () => { if (!mine() || h.code) return; clearTimeout(to); h.code = code; h.phase = "lobby"; h.pingT = setInterval(ping, 3000); render(); });
    peer.on("connection", c => { if (!mine()) return; c.on("data", d => onData(c, d)); const drop = () => { const p = H && H.players.get(c.pid); if (p && p.conn === c) { p.conn = null; paintCount(); } }; c.on("close", drop); c.on("error", drop); });
    peer.on("error", e => {
      if (!mine()) return;
      if (e.type === "unavailable-id" && !h.code && tries < 5) { clearTimeout(to); try { peer.destroy(); } catch (x) {} return boot(h, tries + 1); }
      if (e.type === "peer-unavailable") return;
      if (h.code) { h.lost = true; const w = $("#evLost"); if (w) w.hidden = false; return; }
      clearTimeout(to); h.phase = "error"; render();
    });
  }).catch(() => { if (H === h) { h.phase = "error"; render(); } });
}
function ping() {
  if (!H) return; const now = Date.now();
  H.players.forEach(p => { if (!p.conn) return; if (now - p.seen > 10000) { try { p.conn.close(); } catch (e) {} p.conn = null; } else send(p.conn, { type: "ping" }); });
  const pr = H.peer, lost = !!(pr && pr.disconnected && !pr.destroyed); if (lost) try { pr.reconnect(); } catch (e) {}
  H.lost = lost; const w = $("#evLost"); if (w) w.hidden = !lost;
  paintCount();
}
function smallestTeam() { const n = Array(H.set.teams).fill(0); H.players.forEach(p => n[p.team]++); return n.indexOf(Math.min(...n)); }
function freshNick() {
  const used = new Set([...H.players.values()].map(p => p.nick.join()));
  for (let k = 0; k < 40; k++) { const n = [ri(ADJ.length), ri(NOUN.length)]; if (!used.has(n.join())) return n; }
  return [ri(ADJ.length), ri(NOUN.length)];
}
function onData(c, d) {
  if (!H || !d || typeof d !== "object") return;
  if (d.type === "hello") {
    const pid = String(d.pid || ""); if (!/^[a-z0-9]{12,40}$/.test(pid)) return;
    let p = H.players.get(pid);
    if (p) { if (p.conn && p.conn !== c) try { p.conn.close(); } catch (e) {} }
    else { if (H.players.size >= 200) return; p = { pid, nick: freshNick(), team: smallestTeam(), ans: {}, rerolls: 0 }; H.players.set(pid, p); }
    p.conn = c; c.pid = pid; p.seen = Date.now(); push(p); paintCount(); return;
  }
  const p = c.pid && H.players.get(c.pid); if (!p || p.conn !== c) return;
  p.seen = Date.now();
  if (d.type === "answer") {
    const q = H.qs[H.r], i = d.i;
    if (H.phase !== "question" || d.r !== H.r || p.ans[H.r] != null || !Number.isInteger(i) || i < 0 || i >= q.a.length) return;
    p.ans[H.r] = i; push(p); paintCount();
    const ps = [...H.players.values()].filter(on);
    if (ps.length && ps.every(x => x.ans[H.r] != null)) { clearTimeout(H.autoT); H.autoT = setTimeout(() => H && H.phase === "question" && reveal(), 700); }
  } else if (H.phase === "lobby" || H.phase === "end") {
    if (d.type === "team" && Number.isInteger(d.t) && d.t >= 0 && d.t < H.set.teams) { p.team = d.t; push(p); paintCount(); }
    if (d.type === "nick" && p.rerolls < 5) { p.rerolls++; p.nick = freshNick(); push(p); }
  }
}
function teamRanks() { const ts = [...Array(H.set.teams).keys()].sort((a, b) => H.teams[b] - H.teams[a]); return ts; }
function push(p) {
  if (!H || !p.conn) return;
  const m = { type: "st", ph: H.phase, code: H.code, nick: p.nick, team: p.team, teams: H.set.teams, board: H.set.board };
  const q = H.qs[H.r];
  if (H.phase === "question") Object.assign(m, { r: H.r, q: q.q, a: q.a, left: Math.max(0, H.end - Date.now()), mine: p.ans[H.r] });
  if (H.phase === "reveal") Object.assign(m, { r: H.r, q: q.q, a: q.a, c: q.c, why: q.why, mine: p.ans[H.r] });
  if (H.phase === "end" && H.set.board) Object.assign(m, { rank: 1 + H.teams.slice(0, H.set.teams).filter(x => x > H.teams[p.team]).length, pts: H.teams[p.team] });
  send(p.conn, m);
}
const pushAll = () => H && H.players.forEach(push);
function paintCount() {
  if (!H) return;
  const ps = [...H.players.values()], n = ps.filter(on).length, e = $("#evCount");
  if (e) e.textContent = H.phase === "question" ? `✋ ${ps.filter(p => p.ans[H.r] != null).length}/${n} ${t(S.answered)}` : `👥 ${n} ${t(S.players)}`;
  const tl = $("#evTeams"); if (tl) tl.innerHTML = teamsHTML();
}
function teamsHTML() {
  const cnt = Array(H.set.teams).fill(0); H.players.forEach(p => on(p) && cnt[p.team]++);
  const order = H.set.board ? teamRanks() : [...Array(H.set.teams).keys()];
  return order.map(i => `<div class="ev-team" style="background:${TEAMS[i][0]};color:${TEAMS[i][1]}"><span>${esc(tName(i))}</span><span>${H.set.mode === "phones" ? `👥 ${cnt[i]}` : ""}${H.set.board ? ` · ${H.teams[i]} ${t(S.pts)}` : ""}</span></div>`).join("");
}
function armAuto() {   // booth: lobby starts by itself after 20 s (screen mode waits for a click)
  clearT(); if (!H || !H.set.booth || H.phase !== "lobby" || H.set.mode !== "phones") return;
  H.autoAt = Date.now() + 20000;
  H.tick = setInterval(() => { if (!H) return; const s = Math.ceil((H.autoAt - Date.now()) / 1000), e = $("#evAuto");
    if ([...H.players.values()].some(on)) { if (e) e.textContent = `${t(S.autoIn)} ${s}s`; if (s <= 0) ask(); } else { H.autoAt = Date.now() + 20000; if (e) e.textContent = ""; } }, 500);
}
function ask() {
  clearT(); if (!H.qs.length) return;
  H.r++; H.phase = "question"; H.up = []; H.end = Date.now() + H.set.secs * 1000;
  render(); pushAll();
  H.tick = setInterval(() => {
    if (!H) return; const left = Math.max(0, H.end - Date.now()), c = $("#evClock"), b = $("#evBar");
    if (c) c.textContent = Math.ceil(left / 1000); if (b) b.style.width = left / (H.set.secs * 10) + "%";
    if (!left) reveal();
  }, 250);
}
function reveal(roomPick) {
  clearT(); if (!H || H.phase !== "question") return;
  const q = H.qs[H.r], d = TOPIC_D[q.topic] || "academy", ps = [...H.players.values()];
  let frac, part;
  if (roomPick != null) {   // screen-only (or no phones): host clicked the room's / turn team's answer
    const ok = roomPick === q.c; frac = ok ? 1 : 0; part = 1; H.roomPick = roomPick;
    if (ok) H.teams[H.turn % H.set.teams] += 10;
    H.turn++;
  } else {
    H.roomPick = null;
    const ans = ps.filter(p => p.ans[H.r] != null), okN = ans.filter(p => p.ans[H.r] === q.c);
    okN.forEach(p => H.teams[p.team] += 10);
    frac = ans.length ? okN.length / ans.length : 0; part = ps.length ? ans.length / Math.max(1, ps.filter(on).length) : 0;
  }
  const before = stateOf(H.prog);
  H.prog[d] = Math.min(3, (H.prog[d] || 0) + 2 * frac);
  H.prog.arena = Math.min(3, (H.prog.arena || 0) + 0.6 * Math.min(1, part));
  const after = stateOf(H.prog); H.up = DIST.filter(x => after[x] > before[x]); H.frac = frac;
  H.phase = "reveal"; render(); pushAll();
  log("round", { r: H.r, q: q.id, frac: Math.round(frac * 100) / 100, n: ps.length });
  if (H.set.booth) H.autoT = setTimeout(() => H && H.phase === "reveal" && nextStep(), 8000);
}
function nextStep() { if (!H) return; if (H.r + 1 < H.qs.length) ask(); else finish(); }
function finish() {
  clearT(); H.phase = "end"; render(); pushAll();
  if (H.set.booth) { H.autoAt = Date.now() + 25000;
    H.tick = setInterval(() => { const s = Math.ceil((H.autoAt - Date.now()) / 1000), e = $("#evAuto"); if (e) e.textContent = `${t(S.resetIn)} ${s}s`; if (s <= 0) resetTown(); }, 500); }
}
function resetTown() {   // next visitor / play again: wipe town + team scores, keep the room open
  clearT(); Object.assign(H, freshTown(), { phase: "lobby", qs: pickQs(H.set) });
  H.players.forEach(p => { p.ans = {}; if (!on(p)) H.players.delete(p.pid); });
  render(); pushAll(); armAuto();
}

function setupHTML() {
  const s = H && H.set || defSet();
  return `<div class="ev-grid"><form class="ev-p" id="evSet"><h2>⚙️ ${t(S.setup)}</h2>
    <fieldset><legend>${t(S.modeL)}</legend>
      <label><input type="radio" name="mode" value="phones" ${s.mode === "phones" ? "checked" : ""}> ${t(S.mPh)}</label>
      <label><input type="radio" name="mode" value="screen" ${s.mode === "screen" ? "checked" : ""}> ${t(S.mSc)}</label></fieldset>
    <label>${t(S.teamsN)} <select name="teams">${[2, 3, 4, 5, 6].map(n => `<option ${n === s.teams ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    <label>${t(S.level)} <select name="track">${["kids", "teens", "adults"].map(k => `<option value="${k}" ${k === s.track ? "selected" : ""}>${t(S.tracks[k])}</option>`).join("")}</select></label>
    <label>${t(S.rounds)} <select name="rounds">${[5, 10, 15].map(n => `<option ${n === s.rounds ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    <label>${t(S.secs)} <select name="secs">${[15, 20, 30].map(n => `<option ${n === s.secs ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    <label><input type="checkbox" name="booth" ${s.booth ? "checked" : ""}> ${t(S.booth)}</label>
    <label><input type="checkbox" name="board" ${s.board ? "checked" : ""}> ${t(S.board)}</label>
    <p><button class="ev-b">${t(S.go)}</button></p></form>
    <div class="ev-p ev-help"><h3>💡 ${t(S.helpT)}</h3><ul>${S.help.map(x => `<li>${esc(t(x))}</li>`).join("")}</ul></div></div>`;
}
function drawQR() {
  const box = $("#evQR"); if (!box || !H || !H.code) return;
  const url = joinURL(H.code); box.innerHTML = "";
  if (window.QRCode) for (const lv of ["M", "L"]) { try { new window.QRCode(box, { text: url, width: 256, height: 256, correctLevel: window.QRCode.CorrectLevel[lv] }); box.title = url; return; } catch (e) { box.innerHTML = ""; } }
  box.innerHTML = `<a href="${esc(url)}">${esc(url)}</a>`;
}
function stageHTML() {
  const q = H.qs[H.r], ph = H.phase, scr = H.set.mode === "screen" || ![...H.players.values()].some(on);
  const turnT = H.set.mode === "screen" ? `<p class="px">${t(S.turn)} <span class="ev-chip" style="background:${TEAMS[H.turn % H.set.teams][0]};color:${TEAMS[H.turn % H.set.teams][1]}">${esc(tName(H.turn % H.set.teams))}</span></p>` : "";
  const head = q ? `<p class="px">${t(S.roundOf)} ${H.r + 1} ${t(S.of)} ${H.qs.length} · ${t(S.forD)} ${DICON[TOPIC_D[q.topic]] || ""} ${esc(t(DNAME[TOPIC_D[q.topic]] || DNAME.academy))}</p>` : "";
  if (ph === "boot") return `<div class="ev-p"><p class="ev-big">⏳ ${t(S.starting)}</p></div>`;
  if (ph === "error") return `<div class="ev-p"><p class="ev-big">⚠️ ${t(S.fail)}</p><div class="ev-row"><button class="ev-b" data-act="retry">${t(S.retry)}</button><button class="ev-b l" data-act="screen">${t(S.toScreen)}</button></div></div>`;
  if (ph === "lobby") return `<div class="ev-p">${H.set.mode === "phones" ? `<p class="px">${t(S.codeL)}</p><div class="ev-code">${esc(H.code)}</div>
      <div class="ev-row"><div class="ev-qr" id="evQR"></div><p style="flex:1;min-width:180px">${t(S.how)}</p></div>
      ${isLocal() ? `<p class="ev-warn">${t(S.local)}</p>` : ""}<p class="ev-big" id="evCount" aria-live="polite"></p>` : ""}
      ${H.qs.length ? `<div class="ev-row"><button class="ev-b" data-act="start">▶ ${t(S.start)} 1</button><span id="evAuto" aria-live="polite"></span></div>` : `<p>${t(S.noQ)}</p>`}</div>`;
  if (ph === "question") return `<div class="ev-p">${head}${turnT}<div class="ev-row"><span class="ev-clock" id="evClock" role="timer">${H.set.secs}</span><span class="ev-big" id="evCount" aria-live="polite"></span></div>
      <div class="ev-meter"><i id="evBar" style="width:100%"></i></div><p class="ev-q">${esc(t(q.q))}</p>
      ${scr ? `<p>${t(S.clickAns)}</p>` : ""}<div class="ev-tiles">${q.a.map((a, i) => scr
        ? `<button class="ev-tile t${i}" data-pick="${i}"><span class="sh" aria-hidden="true">${SHAPES[i]}</span><span>${esc(t(a))}</span></button>`
        : `<div class="ev-tile t${i}"><span class="sh" aria-hidden="true">${SHAPES[i]}</span><span>${esc(t(a))}</span></div>`).join("")}</div>
      ${scr ? "" : `<p><button class="ev-b" data-act="reveal">${t(S.reveal)}</button></p>`}</div>`;
  if (ph === "reveal") { const last = H.r + 1 >= H.qs.length;
    return `<div class="ev-p">${head}<p class="ev-q">${esc(t(q.q))}</p><div class="ev-tiles">${q.a.map((a, i) => `<div class="ev-tile t${i} ${i === q.c ? "ok" : "dim"} ${i === H.roomPick ? "mine" : ""}"><span class="sh" aria-hidden="true">${i === q.c ? "✔" : SHAPES[i]}</span><span>${esc(t(a))}</span></div>`).join("")}</div>
      <p class="ev-big" aria-live="polite">${H.set.mode === "phones" && H.roomPick == null ? `${Math.round(H.frac * 100)}% ${t(S.right)}` : H.frac ? "✔" : "✖"}${H.up.length ? ` · ${H.up.map(d => DICON[d] + " " + esc(t(DNAME[d]))).join(", ")} ${t(S.gain)}` : ""}</p>
      ${q.why ? `<p><b>${t(S.why)}</b> ${esc(t(q.why))}</p>` : ""}<p><button class="ev-b" data-act="next">${last ? t(S.finish) : t(S.next)}</button></p></div>`; }
  return `<div class="ev-p"><h2>🎉 ${t(S.endT)}</h2><p id="evAuto" aria-live="polite"></p>
    <div class="ev-row"><button class="ev-b" data-act="reset">${t(H.set.booth ? S.nextVis : S.again)}</button><button class="ev-b l" data-act="end">${t(S.endEv)}</button></div></div>`;
}
function hostHTML() {
  const fs = document.fullscreenEnabled ? `<button class="ev-b l" data-act="fs">${t(S.fs)}</button>` : "";
  return `<div class="ev-grid"><div><div class="ev-p ev-town"><canvas id="evTown" width="400" height="300" role="img" aria-label="${esc(t(S.town))}"></canvas>${distList(H.up)}</div>
    <div class="ev-row">${fs}${H.phase !== "end" ? `<button class="ev-b l" data-act="end">${t(S.endEv)}</button>` : ""}</div></div>
    <div>${stageHTML()}<p class="ev-warn" id="evLost" ${H.lost ? "" : "hidden"}>${t(S.lost)}</p>
    <div class="ev-p"><h3>${t(S.teamsT)}</h3><div id="evTeams">${teamsHTML()}</div></div></div></div>`;
}
function render() {
  if (!root) return;
  if (!H) { root.innerHTML = WQ.head("🎪", S.title, S.sub) + setupHTML();
    $("#evSet", root).onsubmit = e => { e.preventDefault(); const f = new FormData(e.target);
      startHost({ mode: f.get("mode"), teams: +f.get("teams"), track: f.get("track"), rounds: +f.get("rounds"), secs: +f.get("secs"), booth: !!f.get("booth"), board: !!f.get("board") }); };
    return; }
  root.innerHTML = WQ.head("🎪", S.title, null) + hostHTML();
  root.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => reveal(+b.dataset.pick));
  root.querySelectorAll("[data-act]").forEach(b => b.onclick = () => {
    const a = b.dataset.act;
    if (a === "start") ask(); else if (a === "reveal") reveal(); else if (a === "next") nextStep(); else if (a === "reset") resetTown();
    else if (a === "retry") { const s = H.set; teardown(); startHost(s); }
    else if (a === "screen") { const s = { ...H.set, mode: "screen" }; teardown(); startHost(s); }
    else if (a === "end") { if (confirm(t(S.endQ))) { teardown(); render(); } }
    else if (a === "fs") { try { document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen(); } catch (e) {} }
  });
  paintCount(); drawQR(); townLoop();
  if (H.phase === "lobby" && H.set.booth && !H.tick) armAuto();
}

/* ---------------- player (phone) ---------------- */
let J = null;
const sget = k => { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } };
const sset = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const getPid = () => { let p = sget("wq-evt-pid"); if (typeof p !== "string" || !/^[a-z0-9]{12,40}$/.test(p)) { p = Array.from({ length: 16 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[ri(36)]).join(""); sset("wq-evt-pid", p); } return p; };
function killJ() { if (!J) return; clearTimeout(J.retryT); clearTimeout(J.openT); clearInterval(J.tick); const p = J.peer; J.peer = J.conn = null; try { p && p.destroy(); } catch (e) {} }
function startJoin(code) {
  killJ(); J = { code, st: "conn", pid: getPid(), tries: 0 }; renderJoin();
  loadAny(PEER_JS, peerClass).then(() => J && J.code === code && connect()).catch(() => { if (J) { J.st = "fail"; renderJoin(); } });
}
function connect() {
  const j = J; let peer; clearTimeout(j.openT); try { j.peer && j.peer.destroy(); } catch (e) {}
  try { peer = new (peerClass())({ debug: 0 }); } catch (e) { j.st = "fail"; return renderJoin(); }
  j.peer = peer; const mine = () => J === j && j.peer === peer;
  j.openT = setTimeout(() => mine() && jFail("timeout"), 15000);
  peer.on("open", () => { if (!mine()) return;
    const c = peer.connect(PFX + j.code, { reliable: true, serialization: "json" }); j.conn = c;
    c.on("open", () => { if (!mine()) return; clearTimeout(j.openT); if (!j.ever) log("join", {}); j.ever = true; j.tries = 0; send(c, { type: "hello", pid: j.pid, lang: WQ.lang }); });
    c.on("data", d => mine() && onJData(d)); c.on("close", () => mine() && jFail("close")); c.on("error", () => mine() && jFail("conn")); });
  peer.on("error", e => mine() && jFail(e.type));
}
function jFail(type) {
  if (!J || J.st === "gone") return; clearTimeout(J.openT); J.tries++;
  if (!J.ever) { if (type === "peer-unavailable") { J.st = "nf"; killJ(); return renderJoin(); } if (J.tries >= 3) { J.st = "fail"; killJ(); return renderJoin(); } }
  else if (!J.lost) { J.lost = true; renderJoin(); }
  J.retryT = setTimeout(() => J && connect(), Math.min(1000 * J.tries, 5000));
}
function onJData(d) {
  if (!J || !d || typeof d !== "object") return;
  if (d.type === "ping") { send(J.conn, { type: "ping" }); if (J.lost) { J.lost = false; renderJoin(); } return; }
  if (d.type !== "st") return;
  J.lost = false;
  if (d.ph === "gone") { J.st = "gone"; killJ(); return renderJoin(); }
  if (d.ph === "reveal" && J.lastRev !== d.r) { J.lastRev = d.r;   // silent: no WQ.beep on player screens
    if (d.mine != null) { WQ.emit("answer", d.mine === d.c, "event"); try { navigator.vibrate && navigator.vibrate(d.mine === d.c ? 60 : [60, 60, 60]); } catch (e) {} } }
  if (d.ph === "question") J.deadline = Date.now() + (+d.left || 0);
  J.s = d; J.st = "in"; renderJoin();
}
function joinFormHTML(code, err) {
  return `<form class="ev-p" id="evJoin"><label>${t(S.code)}<br><input type="text" name="code" id="evCode" value="${esc(code || "")}" maxlength="7" autocomplete="off" autocapitalize="characters" spellcheck="false" style="font-size:28px;letter-spacing:4px;width:9ch"></label>
    <p class="small">${t(S.noName)}</p>${err ? `<p class="ev-warn" role="alert">${t(err)}</p>` : ""}<button class="ev-b">${t(S.join)}</button></form>`;
}
function renderJoin() {
  if (!root) return;
  let h = "";
  if (!J || J.st === "form") h = joinFormHTML(J && J.code, J && J.err);
  else if (J.st === "conn") h = `<div class="ev-p"><p class="ev-big">⏳ ${t(S.conn)}</p></div>`;
  else if (J.st === "nf" || J.st === "fail") h = `<div class="ev-p"><p class="ev-warn" role="alert">${t(J.st === "nf" ? S.notFound : S.pFail)}</p><button class="ev-b" data-act="retry">${t(S.retry)}</button></div>` + joinFormHTML(J.code);
  else if (J.st === "gone") h = `<div class="ev-p"><p class="ev-big">👋 ${t(S.gone)}</p><a class="ev-b" href="#/home" style="display:inline-block;text-decoration:none">${t(S.home)}</a></div>`;
  else {
    const s = J.s, tm = TEAMS[s.team] || TEAMS[0];
    const me = `<div class="ev-p ev-row" style="background:${tm[0]};color:${tm[1]}"><span>${t(S.you)} <b class="px">${esc(nickTxt(s.nick))}</b></span><span class="px">· ${esc(tName(s.team))}</span></div>`;
    if (s.ph === "lobby" || s.ph === "boot") h = me + `<div class="ev-p"><p class="ev-big">✅ ${t(S.wait)}</p><div class="ev-row"><button class="ev-b l" data-act="nick">${t(S.newNick)}</button></div>
      <fieldset><legend>${t(S.change)}</legend><div class="ev-row">${[...Array(s.teams).keys()].map(i => `<button class="ev-b" data-team="${i}" aria-pressed="${i === s.team}" style="background:${TEAMS[i][0]};color:${TEAMS[i][1]}">${i === s.team ? "✔ " : ""}${esc(tName(i))}</button>`).join("")}</div></fieldset></div>`;
    else if (s.ph === "question") { const left = Math.max(0, J.deadline - Date.now()), done = s.mine != null;
      h = me + `<div class="ev-p"><p class="px">⏱ <span id="evPClock" role="timer">${Math.ceil(left / 1000)}</span></p><p class="ev-q" style="font-size:20px">${esc(t(s.q))}</p>
        ${done ? `<p class="ev-big" role="status">📨 ${t(S.sent)}</p>` : !left ? `<p class="ev-big" role="status">${t(S.tUp)}</p>` : ""}
        <div class="ev-tiles">${s.a.map((a, i) => `<button class="ev-tile t${i} ${done && i === s.mine ? "mine" : done ? "dim" : ""}" data-ans="${i}" ${done || !left ? "disabled" : ""}><span class="sh" aria-hidden="true">${SHAPES[i]}</span><span>${esc(t(a))}</span></button>`).join("")}</div></div>`; }
    else if (s.ph === "reveal") { const ok = s.mine === s.c;
      h = me + `<div class="ev-p" role="status"><p class="ev-big">${s.mine == null ? t(S.noAns) : ok ? "✔ " + t(S.ok) : "✖ " + t(S.no)}</p><p><b>${t(S.ansWas)}</b> ${SHAPES[s.c]} ${esc(t(s.a[s.c]))}</p>${s.why ? `<p><b>${t(S.why)}</b> ${esc(t(s.why))}</p>` : ""}</div>`; }
    else h = me + `<div class="ev-p" role="status"><p class="ev-big">🎉 ${t(S.pEnd)}</p>${s.rank ? `<p class="ev-big">${t(S.rank)} #${s.rank} · ${s.pts} ${t(S.pts)}</p>` : ""}</div>`;
    if (J.lost) h = `<p class="ev-warn" role="alert">${t(S.reconn)}</p>` + h;
  }
  root.innerHTML = WQ.head("🎪", S.title, S.subJoin) + `<div aria-live="polite">${h}</div>`;
  const f = $("#evJoin", root);
  if (f) f.onsubmit = e => { e.preventDefault(); const c = normCode($("#evCode", root).value);
    if (!validCode(c)) { J = { st: "form", code: c, err: S.badCode }; return renderJoin(); }
    location.hash.endsWith("/" + c) ? startJoin(c) : WQ.go("event/join/" + c); };
  root.querySelectorAll("[data-ans]").forEach(b => b.onclick = () => { if (!J.s || J.s.mine != null) return; J.s.mine = +b.dataset.ans; send(J.conn, { type: "answer", r: J.s.r, i: +b.dataset.ans }); renderJoin(); });
  root.querySelectorAll("[data-team]").forEach(b => b.onclick = () => send(J.conn, { type: "team", t: +b.dataset.team }));
  root.querySelectorAll("[data-act]").forEach(b => b.onclick = () => b.dataset.act === "nick" ? send(J.conn, { type: "nick" }) : startJoin(J.code));
  clearInterval(J && J.tick);
  if (J && J.s && J.s.ph === "question" && J.s.mine == null) J.tick = setInterval(() => { const c = $("#evPClock"), left = Math.max(0, J.deadline - Date.now());
    if (c) c.textContent = Math.ceil(left / 1000); if (!left) { clearInterval(J.tick); renderJoin(); } }, 250);
}

/* ---------------- routing ---------------- */
WQ.registerPage("event", { mount(el, { args }) {
  root = document.createElement("div"); root.className = "ev"; el.appendChild(root);
  document.body.classList.toggle("ev-play", args[0] === "join");
  if (args[0] === "join") {
    if (H) teardown();
    const c = normCode(args[1]);
    if (validCode(c)) { if (!J || J.code !== c) startJoin(c); else renderJoin(); }
    else { killJ(); J = null; renderJoin(); }
  } else { if (J) { killJ(); J = null; } render(); }
  return () => { cancelAnimationFrame(raf); root = null; };
} });
WQ.on("route", view => { if (view !== "event") { document.body.classList.remove("ev-play"); if (H) teardown(); if (J) { killJ(); J = null; } } });
addEventListener("beforeunload", e => { if (H && H.players.size && H.phase !== "end") { e.preventDefault(); e.returnValue = ""; } });
})();
