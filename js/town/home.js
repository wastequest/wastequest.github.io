/* WasteQuest v2 home: pixel eco-city town (art from js/town/art.js = WQ.townArt), HUD, guide robot tips,
   building list, audience chip and first-visit dialog (start profile + privacy notice from WQ.data in js/data/track.js,
   avatar, pre-check offer; falls back to the audience pick when WQ.data is missing).
   SOURCES: all facts from SPEC.md (SWCorp via The Star, 2 Jan 2024; SWCorp bin colours). */
(() => {
  if (typeof WQ === "undefined") return;
  const D = [
    { id: "academy", icon: "🏫", href: "#/learn", name: { en: "Academy", bm: "Akademi" },
      desc: { en: "Lessons, quiz and certificates.", bm: "Pelajaran, kuiz dan sijil." },
      badges: ["learn", "quiz", "cert-junior", "cert-champion", "cert-practitioner"] },
    { id: "recycle", icon: "♻️", href: "#/games", name: { en: "Recycling Plant", bm: "Loji Kitar Semula" },
      desc: { en: "Sorting, matching and word games.", bm: "Permainan asing, padan dan kata." },
      badges: ["sort", "match", "myth", "wordsearch", "crossword"] },
    { id: "compost", icon: "🌱", href: "#/game/compost", name: { en: "Compost Farm", bm: "Ladang Kompos" },
      desc: { en: "Compost, eco-enzyme and garden labs.", bm: "Kompos, eko-enzim dan makmal kebun." },
      badges: ["compost", "enzyme", "ph", "lab-compost", "lab-enzyme", "lab-odour", "lab-watering", "lab-vgarden", "lab-hydro"] },
    { id: "maker", icon: "🛠️", href: "#/labs", name: { en: "Maker Lab", bm: "Makmal Pereka" },
      desc: { en: "Hands-on labs: make useful things from waste.", bm: "Makmal amali: hasilkan barang berguna daripada sisa." },
      badges: ["lab-candle", "lab-petfood", "lab-treasure", "lab-litmus", "lab-ecobrick", "lab-bioplastic", "lab-fused", "lab-lifebuoy", "lab-sleepbag"] },
    { id: "market", icon: "🏪", href: "#/game/cash", name: { en: "Market", bm: "Pasar" },
      desc: { en: "Turn waste into cash and check your footprint.", bm: "Tukar sisa jadi wang dan semak jejak anda." },
      badges: ["cash", "footprint"] },
    { id: "arena", icon: "🏟️", href: "#/class", name: { en: "Arena", bm: "Arena" },
      desc: { en: "Live class quiz battle.", bm: "Pertandingan kuiz kelas secara langsung." },
      badges: ["class"] },
  ];
  const T = {
    sub: { en: "Clean up the town. Turn waste into wealth!", bm: "Bersihkan bandar. Tukar sisa jadi harta!" },
    clean: { en: "Town cleaned", bm: "Bandar bersih" },
    badges: { en: "My badges", bm: "Lencana saya" },
    myAv: { en: "Edit my player", bm: "Ubah pemain saya" },
    town: { en: "Town map. Tap a building to go inside.", bm: "Peta bandar. Ketik bangunan untuk masuk." },
    messy: { en: "messy", bm: "bersepah" }, done: { en: "all clean", bm: "bersih sepenuhnya" },
    stars: { en: "cleaning level", bm: "tahap kebersihan" },
    next: { en: "Next tip ▶", bm: "Tip seterusnya ▶" }, robotBtn: { en: "Kitar the robot: next tip", bm: "Robot Kitar: tip seterusnya" },
    places: { en: "Buildings", bm: "Bangunan" }, go: { en: "Go ▶", bm: "Pergi ▶" },
    cert: { en: "Certificate", bm: "Sijil" }, teacher: { en: "Teachers", bm: "Guru" }, live: { en: "Live class", bm: "Kelas langsung" },
    scan: { en: "Scan & sort", bm: "Imbas & asing" }, missions: { en: "Home missions", bm: "Misi di rumah" }, shop: { en: "Town shop", bm: "Kedai bandar" }, event: { en: "Event Town", bm: "Bandar Acara" },
    playing: { en: "Playing as:", bm: "Pemain:" },
    skip: { en: "Skip", bm: "Langkau" }, nextStep: { en: "Next ▶", bm: "Seterusnya ▶" }, save: { en: "Save", bm: "Simpan" },
    hi: { en: "Hi! I'm Kitar, your guide robot.", bm: "Hai! Saya Kitar, robot pemandu anda." },
    makeAv: { en: "Make your player", bm: "Reka pemain anda" },
    skin: { en: "Skin", bm: "Kulit" }, head: { en: "Headwear", bm: "Penutup kepala" }, hair: { en: "Hair colour", bm: "Warna rambut" }, outfit: { en: "Outfit", bm: "Pakaian" },
    heads: { none: { en: "None", bm: "Tiada" }, hijab: { en: "Hijab", bm: "Tudung" }, cap: { en: "Cap", bm: "Topi" } },
    ready: { en: "Let's clean up the town!", bm: "Jom bersihkan bandar!" },
    readyS: { en: "Every badge you earn cleans part of the town. Tap a building to start.", bm: "Setiap lencana yang anda peroleh membersihkan sebahagian bandar. Ketik bangunan untuk bermula." },
    skipAll: { en: "Skip all", bm: "Langkau semua" },
    preT: { en: "5 quick questions before you play?", bm: "5 soalan ringkas sebelum bermain?" },
    preS: { en: "It helps us see what you learn. No marks, and you can skip any question.", bm: "Ia membantu kami melihat apa yang anda pelajari. Tiada markah, dan anda boleh melangkau mana-mana soalan." },
    start: { en: "Start ▶", bm: "Mula ▶" }, later: { en: "Later", bm: "Nanti" },
    tone: { en: "tone", bm: "ton" }, colour: { en: "colour", bm: "warna" },
  };
  const TIPS = [
    { en: "Every badge you earn cleans part of the town. Clean all six buildings!", bm: "Setiap lencana yang anda peroleh membersihkan sebahagian bandar. Bersihkan keenam-enam bangunan!" },
    { en: "Blue bin = paper. Orange bin = plastic & metal. Brown bin = glass.", bm: "Tong biru = kertas. Tong oren = plastik & logam. Tong perang = kaca." },
    { en: "Food is the biggest part of Malaysian household waste (30.6%). The Compost Farm turns it into compost.", bm: "Makanan ialah bahagian terbesar sisa isi rumah di Malaysia (30.6%). Ladang Kompos menukarnya menjadi kompos." },
    { en: "Malaysia made about 39,000 tonnes of solid waste a day in 2024. That is about 1.17 kg per person!", bm: "Malaysia menghasilkan kira-kira 39,000 tan sisa pepejal sehari pada 2024. Itu kira-kira 1.17 kg seorang!" },
    { en: "At the Maker Lab you make useful things from waste. Ask an adult to help with hot or sharp steps.", bm: "Di Makmal Pereka anda menghasilkan barang berguna daripada sisa. Minta orang dewasa membantu untuk langkah yang panas atau tajam." },
    { en: "At the Arena, your teacher hosts a live quiz and you join by phone.", bm: "Di Arena, guru anda menganjurkan kuiz langsung dan anda sertai guna telefon." },
    { en: "Plastic is the second biggest part of household waste (21.9%). Rinse it and put it in the orange bin.", bm: "Plastik ialah bahagian kedua terbesar sisa isi rumah (21.9%). Bilas dan masukkan ke dalam tong oren." },
  ];
  const AUDS = ["kids", "teens", "adults", "teacher"], HEADS = ["none", "hijab", "cap"];
  const FB = { SKINS: ["#f4d3b5", "#e8b48f", "#d29a6c", "#b5764a", "#8d5533", "#5e3720"],
    OUTFITS: ["#0098dc", "#5ac54f", "#f68187", "#f9c22b", "#7a3045", "#7b4bc4"], HAIRS: ["#1a1932", "#5d3a1a", "#a0622d", "#c7cfdd"] };
  const FB_HOT = { academy: { x: 40, y: 60, w: 80, h: 70 }, recycle: { x: 160, y: 55, w: 85, h: 70 }, compost: { x: 285, y: 65, w: 80, h: 65 },
    maker: { x: 30, y: 170, w: 80, h: 70 }, market: { x: 280, y: 170, w: 85, h: 70 }, arena: { x: 160, y: 200, w: 90, h: 70 } };

  // module-level so a language switch (re-mount) keeps them
  let dlgStep = null, editOnly = false, tipIdx = 0, draft = null, firstDone = false;

  const art = () => WQ.townArt;
  const pal = k => (art() && Array.isArray(art()[k]) && art()[k].length ? art()[k] : FB[k]);
  const hot = id => (art() && art().hotspots && art().hotspots[id]) || FB_HOT[id];
  const spawn = () => (art() && art().spawn) || { x: 200, y: 160 };
  const rnd = n => Math.floor(Math.random() * n);
  const randAv = () => ({ skin: rnd(6), head: HEADS[rnd(3)], hair: rnd(4), outfit: rnd(6) });

  WQ.townStates = () => states();
  function states() {
    const m = /[?&]town=(0|1|2|3|mix)\b/.exec(location.search), s = {};
    if (m) { const mix = [0, 1, 2, 3, 1, 2]; D.forEach((d, i) => s[d.id] = m[1] === "mix" ? mix[i] : +m[1]); return s; }
    const e = WQ.earned();
    D.forEach(d => { const n = d.badges.filter(b => e[b]).length, tot = d.badges.length;
      s[d.id] = n === 0 ? 0 : n >= tot ? 3 : n >= tot / 2 ? 2 : 1; });
    return s;
  }
  const marker = st => st === 0 ? `⚠ ${WQ.t(T.messy)}` : st === 3 ? `✓ ${WQ.t(T.done)}` : `${"★".repeat(st)}`;
  const markerShort = st => st === 0 ? "⚠" : st === 3 ? "✓" : "★".repeat(st);
  const markerAria = st => st === 0 ? WQ.t(T.messy) : st === 3 ? WQ.t(T.done) : `${WQ.t(T.stars)} ${st}/3`;

  /* ---------- drawing (falls back to placeholders while art.js is missing) ---------- */
  function drawAvatar(ctx, x, y, av, f) {
    const A = art();
    if (A && typeof A.avatar === "function") { try { A.avatar(ctx, x, y, { ...av, acc: WQ.rw && WQ.rw.acc ? WQ.rw.acc().on : {} }, f); return; } catch (e) {} }
    const b = f ? 1 : 0; ctx.fillStyle = "#1a1932"; ctx.fillRect(x - 7, y - 22 - b, 14, 22);
    ctx.fillStyle = pal("OUTFITS")[av.outfit] || "#0098dc"; ctx.fillRect(x - 6, y - 12 - b, 12, 10);
    ctx.fillStyle = pal("SKINS")[av.skin] || "#e8b48f"; ctx.fillRect(x - 5, y - 20 - b, 10, 8);
  }
  function drawRobot(ctx, x, y, f) {
    const A = art();
    if (A && typeof A.robot === "function") { try { A.robot(ctx, x, y, f); return; } catch (e) {} }
    const b = f ? 1 : 0; ctx.fillStyle = "#1a1932"; ctx.fillRect(x - 8, y - 18 - b, 16, 16);
    ctx.fillStyle = "#c7cfdd"; ctx.fillRect(x - 7, y - 17 - b, 14, 14); ctx.fillStyle = "#5ac54f"; ctx.fillRect(x - 4, y - 13 - b, 2, 3); ctx.fillRect(x + 2, y - 13 - b, 2, 3);
  }
  function drawScene(ctx, st, t) {
    const A = art();
    if (A && typeof A.draw === "function") { try { A.draw(ctx, { states: st, t, deco: WQ.rw && WQ.rw.deco ? WQ.rw.deco().placed : [] }); return; } catch (e) { console.warn("townArt.draw", e); } }
    ctx.fillStyle = "#0098dc"; ctx.fillRect(0, 0, 400, 300); ctx.fillStyle = "#5ac54f"; ctx.fillRect(0, 140, 400, 160);
    D.forEach(d => { const h = hot(d.id); ctx.fillStyle = "#1a1932"; ctx.fillRect(h.x, h.y, h.w, h.h);
      ctx.fillStyle = ["#8b93af", "#c7cfdd", "#f9e6cf", "#99e65f"][st[d.id]]; ctx.fillRect(h.x + 2, h.y + 2, h.w - 4, h.h - 4); });
  }

  WQ.css("town", `
.tw-stage{background:#0098dc;border:3px solid #1a1932;margin-top:8px;padding:14px 12px 12px;box-shadow:0 6px 0 rgba(26,25,50,.25)}
.tw-stage.hazy{background:#6d8fa8}
.tw-title{margin:0;text-align:center;font-family:"Pixelify Sans",monospace;font-weight:700;font-size:clamp(2.6rem,9vw,4.6rem);line-height:1;letter-spacing:2px;color:#f68187;
  text-shadow:2px 0 0 #1a1932,-2px 0 0 #1a1932,0 2px 0 #1a1932,0 -2px 0 #1a1932,2px 2px 0 #1a1932,-2px -2px 0 #1a1932,2px -2px 0 #1a1932,-2px 2px 0 #1a1932,
  3px 3px 0 #ffeb57,4px 4px 0 #ffeb57,5px 5px 0 #f9c22b,6px 6px 0 #f9c22b,7px 7px 0 #f9c22b,8px 8px 0 #1a1932}
.tw-title span{display:inline-block}
.tw-sub{text-align:center;color:#fff;font-weight:800;margin:10px 0 12px;text-shadow:2px 2px 0 #1a1932;font-size:1.05rem}
.tw-px{background:#f9e6cf;color:#1a1932;border:3px solid #1a1932;border-radius:0;box-shadow:4px 4px 0 rgba(26,25,50,.35)}
.tw-hud{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;padding:6px 10px;margin:0 auto 12px;max-width:800px;font-family:"Pixelify Sans",monospace}
.tw-hud .lbl{font-weight:600;white-space:nowrap}
.tw-hud .pct{font-weight:700;font-size:1.25rem}
.tw-seg{display:flex;gap:2px;padding:2px;background:#1a1932;flex:1;min-width:110px;max-width:260px}
.tw-seg i{flex:1;height:14px;background:#5d6a7c}
.tw-seg i.on{background:#5ac54f}
.tw-hud a,.tw-hud button{display:inline-flex;align-items:center;gap:6px;min-height:44px;min-width:44px;padding:0 10px;color:#1a1932;font-weight:700;font-size:1.1rem;text-decoration:none;font-family:inherit}
.tw-hud a:hover,.tw-hud button:hover{background:#fff3e3;outline:2px solid #1a1932}
.tw-hud canvas{image-rendering:pixelated;width:32px;height:48px}
.tw-cl{display:flex;align-items:center;gap:8px;flex:1 1 220px}
.tw-town{position:relative;margin:0 auto;line-height:0}
.tw-crop{overflow:hidden;padding-bottom:16px;margin-bottom:-8px}
@media (max-width:600px){.tw-town{margin-top:-13%}}
.tw-say a{color:#124e9c;font-weight:800}
.tw-town canvas{display:block;width:100%;height:auto;image-rendering:pixelated;image-rendering:crisp-edges;border:3px solid #1a1932;box-sizing:content-box;margin-left:-3px}
.tw-hs{position:absolute;display:block;outline-offset:0}
.tw-hs:hover{outline:3px dashed #1a1932;outline-offset:-3px}
.tw-hs:focus-visible{outline:4px solid #ffeb57;outline-offset:0;box-shadow:0 0 0 7px #1a1932}
.tw-tag{position:absolute;left:50%;bottom:0;transform:translate(-50%,55%);white-space:nowrap;background:#1a1932;color:#fff;font:600 13px/1.2 "Pixelify Sans",monospace;padding:3px 6px;border:2px solid #fff;pointer-events:none}
.tw-tag .nm{margin-right:4px}
.tw-town.small .tw-tag .nm{display:none}
.tw-town.small .tw-tag{font-size:11px;padding:1px 4px}
.tw-rb{position:absolute;width:44px;height:44px;transform:translate(-50%,-80%);border-radius:0}
.tw-rb:hover{outline:3px dashed #1a1932}
.tw-say{display:flex;gap:10px;align-items:flex-start;max-width:800px;margin:16px auto 0;position:relative;padding:10px 12px}
.tw-say:before{content:"";position:absolute;top:-14px;left:40px;border:12px solid transparent;border-bottom-color:#1a1932;border-top:0}
.tw-say:after{content:"";position:absolute;top:-9px;left:43px;border:9px solid transparent;border-bottom-color:#f9e6cf;border-top:0}
.tw-say b{font-family:"Pixelify Sans",monospace}
.tw-say p{margin:2px 0 0;flex:1}
.tw-say .tx{flex:1}
.tw-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 14px;background:#1a1932;color:#fff;font:700 1rem "Pixelify Sans",monospace;border:3px solid #1a1932;border-radius:0;text-decoration:none;cursor:pointer;box-shadow:3px 3px 0 #5d6a7c}
.tw-btn:hover{background:#3b3a5e}
.tw-btn.alt{background:#fff;color:#1a1932}
.tw-btn.alt:hover{background:#f9e6cf}
.tw-btn[aria-pressed=true]{background:#5ac54f;color:#1a1932}
.tw-h2{font-family:"Pixelify Sans",monospace;font-weight:700;font-size:1.5rem;margin:22px 0 10px}
.tw-list{display:grid;grid-template-columns:1fr;gap:12px;padding:0;margin:0;list-style:none}
@media (min-width:700px){.tw-list{grid-template-columns:1fr 1fr}}
.tw-card{display:flex;align-items:center;gap:12px;padding:10px 12px;color:#1a1932;text-decoration:none;min-height:72px}
.tw-card:hover{background:#fff3e3}
.tw-card .ic{font-size:2rem;line-height:1}
.tw-card .tx{flex:1;min-width:0}
.tw-card h3{font:700 1.15rem "Pixelify Sans",monospace;margin:0}
.tw-card p{margin:0;font-size:.95rem}
.tw-card .mk{font-family:"Pixelify Sans",monospace;font-size:.9rem;font-weight:600}
.tw-card .go{font:700 1rem "Pixelify Sans",monospace;white-space:nowrap}
.tw-quick{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:800px;margin:0 auto 12px}
.tw-quick a{display:flex;align-items:center;justify-content:center;gap:8px;min-height:56px;padding:6px 8px;color:#1a1932;text-decoration:none;font:700 1.1rem "Pixelify Sans",monospace;text-align:center}
.tw-quick a span{font-size:1.6rem;line-height:1}
.tw-quick a:hover{background:#fff3e3;outline:2px solid #1a1932}
@media (max-width:699px){.tw-quick{grid-template-columns:1fr 1fr;gap:8px}.tw-quick a{font-size:1rem;min-height:52px}}
.tw-links{display:flex;flex-wrap:wrap;gap:4px 18px;margin:16px 0 0}
.tw-links a{display:inline-flex;align-items:center;min-height:44px;font-weight:700}
.tw-who{margin-top:14px}
.tw-who summary{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 12px;cursor:pointer;font-weight:700;list-style:none}
.tw-who summary::-webkit-details-marker{display:none}
.tw-who .opts{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.tw-dlg{max-width:min(520px,calc(100vw - 24px));width:100%;padding:16px;border:4px solid #1a1932;border-radius:0;background:#f9e6cf;color:#1a1932;box-shadow:8px 8px 0 rgba(26,25,50,.5)}
.tw-dlg::backdrop{background:rgba(26,25,50,.55)}
.tw-dlg h2{font:700 1.5rem "Pixelify Sans",monospace;margin:0 0 6px}
.tw-dlg .top{display:flex;gap:10px;align-items:center;margin-bottom:10px;padding:0;max-width:none}
.tw-dlg canvas{image-rendering:pixelated}
.tw-dlg .grid4{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tw-dlg fieldset{border:0;padding:0;margin:8px 0}
.tw-dlg legend{font-weight:800;padding:0;margin-bottom:4px}
.tw-sw{display:flex;flex-wrap:wrap;gap:6px}
.tw-sw button{width:44px;height:44px;border:3px solid #1a1932;border-radius:0;position:relative}
.tw-sw button[aria-pressed=true]{box-shadow:0 0 0 3px #f9e6cf,0 0 0 6px #1a1932}
.tw-sw button[aria-pressed=true]:after{content:"✓";position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-weight:900;text-shadow:0 0 2px #1a1932,1px 1px 0 #1a1932}
.tw-ed{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}
.tw-ed .pv{background:#0098dc;border:3px solid #1a1932;padding:4px}
.tw-ed .ctl{flex:1;min-width:220px}
.tw-row{display:flex;gap:8px;justify-content:space-between;align-items:center;margin-top:14px;flex-wrap:wrap}
@media (max-width:420px){.tw-title span{display:block}.tw-stage{padding:10px 6px 8px;border-left:0;border-right:0}.tw-hud{gap:4px 8px}}
`);

  function avCanvas(av, scale, cls) {
    const c = document.createElement("canvas"); c.width = 16; c.height = 24; if (cls) c.className = cls;
    c.style.width = 16 * scale + "px"; c.style.height = 24 * scale + "px"; c.setAttribute("aria-hidden", "true");
    const x = c.getContext("2d"); x.imageSmoothingEnabled = false; drawAvatar(x, 8, 23, av, 0); return c;
  }

  WQ.registerPage("home", {
    mount(el, { relang } = {}) {
      const savedAv = WQ.store.getJSON("avatar", null);
      if (!firstDone) { firstDone = true; if (!savedAv && dlgStep == null) { dlgStep = WQ.data ? "p0" : 1; editOnly = false; } }
      const st = states(), avg = D.reduce((s, d) => s + st[d.id], 0) / D.length, pct = Math.round(avg / 3 * 100);
      const total = Object.keys(WQ.badges).length, got = Object.keys(WQ.earned()).filter(k => WQ.badges[k]).length;
      const av = savedAv || draft || { skin: 2, head: "none", hair: 0, outfit: 0 };
      const least = D.reduce((a, d) => st[d.id] < st[a.id] ? d : a, D[0]);
      const t = WQ.t, e = WQ.esc;
      const seg = Array.from({ length: 12 }, (_, i) => `<i class="${i < Math.round(pct / 100 * 12) ? "on" : ""}"></i>`).join("");
      const tag = d => `<span class="tw-tag" aria-hidden="true"><span class="nm">${e(t(d.name))}</span>${markerShort(st[d.id])}</span>`;

      el.innerHTML = `<section class="tw-stage${avg < 1 ? " hazy" : ""}">
  <h1 class="tw-title"><span>Waste</span><span>Quest</span></h1>
  <p class="tw-sub">${e(t(T.sub))}</p>
  <div class="tw-hud tw-px">
    <div class="tw-cl"><span class="lbl">${e(t(T.clean))}</span> <span class="pct">${pct}%</span><span class="tw-seg" role="img" aria-label="${e(t(T.clean))} ${pct}%">${seg}</span></div>
    <a href="#/badges" aria-label="${e(t(T.badges))}: ${got} / ${total}">🏅 ${got}/${total}</a>
    <button type="button" id="twAv" aria-label="${e(t(T.myAv))}"></button>
  </div>
  <nav class="tw-quick" aria-label="${e(t({ en: "Quick play", bm: "Main pantas" }))}">${[["#/scan", "📷", T.scan], ["#/missions", "🏠", T.missions], ["#/shop", "🛍️", T.shop], ["#/event", "🎪", T.event]]
    .map(([h, i, l]) => `<a class="tw-px" href="${h}"><span aria-hidden="true">${i}</span>${e(t(l))}</a>`).join("")}</nav>
  <div class="tw-crop">
  <div class="tw-town" id="twTown" role="group" aria-label="${e(t(T.town))}">
    <canvas width="400" height="300" aria-hidden="true"></canvas>
    ${D.map(d => { const h = hot(d.id); return `<a class="tw-hs" href="${d.href}" style="left:${h.x / 4}%;top:${h.y / 3}%;width:${h.w / 4}%;height:${h.h / 3}%"
      aria-label="${e(t(d.name))}: ${e(t(d.desc))} (${e(markerAria(st[d.id]))})">${tag(d)}</a>`; }).join("")}
    <button type="button" class="tw-rb" id="twRobot" aria-label="${e(t(T.robotBtn))}" style="left:${(spawn().x + 20) / 4}%;top:${spawn().y / 3}%"></button>
  </div>
  </div>
</section>
<div class="tw-say tw-px" aria-live="polite"><div class="tx"><b>Kitar:</b> <p id="twTip"></p></div><button type="button" class="tw-btn" id="twNext">${e(t(T.next))}</button></div>
<h2 class="tw-h2">${e(t(T.places))}</h2>
<ul class="tw-list">${D.map(d => `<li><a class="tw-card tw-px" href="${d.href}"><span class="ic" aria-hidden="true">${d.icon}</span>
  <span class="tx"><h3>${e(t(d.name))}</h3><p>${e(t(d.desc))}</p><span class="mk">${e(marker(st[d.id]))}</span></span><span class="go">${e(t(T.go))}</span></a></li>`).join("")}</ul>
<p class="tw-links"><a href="#/cert">🎓 ${e(t(T.cert))}</a><a href="#/badges">🏅 ${e(t(T.badges))}</a><a class="ad-only" href="#/teacher">${e(t(T.teacher))}</a><a class="ad-only" href="#/class">📱 ${e(t(T.live))}</a></p>
<details class="tw-who"><summary class="tw-px">${e(t(T.playing))} <b>${e(t(WQ.S.aud[WQ.aud] || WQ.S.aud.kids))}</b> ▾</summary>
  <div class="opts" role="group" aria-label="${e(t(WQ.S.who))}">${AUDS.map(a => `<button type="button" class="tw-btn alt" data-aud="${a}" aria-pressed="${WQ.aud === a}">${e(t(WQ.S.aud[a]))}</button>`).join("")}</div></details>`;

      const $ = s => el.querySelector(s), town = $("#twTown"), cv = town.querySelector("canvas"), ctx = cv.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      $("#twAv").appendChild(avCanvas(av, 2));
      $("#twAv").onclick = () => { draft = { ...(WQ.store.getJSON("avatar", null) || av) }; editOnly = true; dlgStep = 2; openDlg(); };
      el.querySelectorAll("[data-aud]").forEach(b => b.onclick = () => WQ.setAud(b.dataset.aud));

      /* tips */
      const tips = [least && st[least.id] < 3
        ? { html: `${e(t({ en: "The messiest place is the", bm: "Tempat paling bersepah ialah" }))} <a href="${least.href}">${e(t(least.name))}</a>. ${e(t({ en: "Let's clean it up!", bm: "Jom bersihkan!" }))}` }
        : { html: e(t({ en: "Wow, the whole town is clean! You are an eco-hero.", bm: "Wah, seluruh bandar sudah bersih! Anda wira eko." })) },
        ...TIPS.map(x => ({ html: e(t(x)) }))];
      const showTip = () => { $("#twTip").innerHTML = tips[tipIdx % tips.length].html; };
      const nextTip = () => { tipIdx = (tipIdx + 1) % tips.length; showTip(); };
      showTip(); $("#twNext").onclick = nextTip; $("#twRobot").onclick = nextTip;

      /* canvas size: whole multiples of 400 px, else fit */
      const fit = () => { const cw = town.parentElement.clientWidth - 30, s = cw >= 400 ? Math.floor(cw / 400) : 0;
        town.style.width = s ? 400 * s + "px" : "100%"; town.classList.toggle("small", !s || window.innerWidth < 600); };
      fit(); const ro = new ResizeObserver(fit); ro.observe(town.parentElement);

      /* animation: only while visible, paused when hidden, single frame for reduced motion */
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, sp = spawn();
      let raf = 0, visible = true, lastF = -1;
      const frame = now => { raf = 0; const f = reduce ? 0 : Math.floor(now / 500) % 2;
        drawScene(ctx, st, now); drawAvatar(ctx, sp.x, sp.y, av, f); drawRobot(ctx, sp.x + 20, sp.y, f); lastF = f;
        if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame); };
      const kick = () => { if (!raf && el.isConnected && visible && !document.hidden) raf = requestAnimationFrame(frame); };
      const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; kick(); }); io.observe(cv);
      document.addEventListener("visibilitychange", kick);
      frame(0);

      /* first-visit / avatar dialog */
      let dlg = null;
      function closeDlg() { dlgStep = null; editOnly = false; draft = null; if (dlg) { const d = dlg; dlg = null; d.close(); d.remove(); } }
      function saveAv(a) { WQ.store.setJSON("avatar", a); const b = $("#twAv"); b.innerHTML = ""; b.appendChild(avCanvas(a, 2)); Object.assign(av, a); }
      const D2 = WQ.data;
      // re-route once so the page picks up the audience set by the profile; the dialog reopens at the new step
      const afterProfile = () => { dlgStep = D2 && !D2.consentState() ? "priv" : 2; WQ.setAud(WQ.aud); };
      function skip() {
        if (editOnly) return closeDlg();
        if (/^p\d$/.test(dlgStep)) return afterProfile();
        if (dlgStep === "priv") { dlgStep = 2; return renderDlg(); }
        if (dlgStep === "pre") { dlgStep = 3; return renderDlg(); }
        if (!WQ.store.getJSON("avatar", null)) saveAv(draft || randAv());
        closeDlg(); if (WQ.aud !== "kids" && !WQ.store.get("aud")) WQ.setAud("kids");
      }
      function openDlg() {
        if (!dlg) { dlg = document.createElement("dialog"); dlg.className = "tw-dlg"; dlg.setAttribute("aria-labelledby", "twDlgH");
          dlg.addEventListener("cancel", ev => { ev.preventDefault(); skip(); }); el.appendChild(dlg); }
        renderDlg(); if (!dlg.open) dlg.showModal();
      }
      function renderDlg() {
        const head = `<div class="top"><canvas width="20" height="22" style="width:60px;height:66px" aria-hidden="true" id="twDR"></canvas><span>${e(t(T.hi))}</span></div>`;
        const skipB = `<button type="button" class="tw-btn alt" data-k="skip">${e(t(T.skip))}</button>`;
        let body = "";
        if (dlgStep === 1) body = `<h2 id="twDlgH">${e(t(WQ.S.who))}</h2><div class="grid4">${AUDS.map(a =>
          `<button type="button" class="tw-btn alt" data-a="${a}" aria-pressed="${WQ.aud === a && !!WQ.store.get("aud")}">${e(t(WQ.S.aud[a]))}</button>`).join("")}</div><div class="tw-row">${skipB}</div>`;
        else if (/^p\d$/.test(dlgStep)) {
          const n = +dlgStep[1], P = D2.PROFILE[n], cur = D2.profile()[P.k];
          body = `<p class="small" style="margin:0">${n + 1} / ${D2.PROFILE.length}</p><h2 id="twDlgH">${e(t(P.q))}</h2><div class="grid4">${P.opts.map(([v, l]) =>
            `<button type="button" class="tw-btn alt" data-p="${v}" aria-pressed="${cur === v}">${e(t(l))}</button>`).join("")}</div>
            <div class="tw-row"><button type="button" class="tw-btn alt" data-k="skipall">${e(t(T.skipAll))}</button>${skipB}</div>`;
        } else if (dlgStep === "priv") body = `<h2 id="twDlgH">${e(t(D2.T.nT))}</h2>${D2.noticeHTML()}
            <div class="tw-row"><button type="button" class="tw-btn alt" data-c="no">${e(t(D2.T.no))}</button><button type="button" class="tw-btn" data-c="yes">${e(t(D2.T.ok))}</button></div>`;
        else if (dlgStep === "pre") body = `<h2 id="twDlgH">${e(t(T.preT))}</h2><p>${e(t(T.preS))}</p>
            <div class="tw-row"><button type="button" class="tw-btn alt" data-k="later">${e(t(T.later))}</button><button type="button" class="tw-btn" data-k="pre">${e(t(T.start))}</button></div>`;
        else if (dlgStep === 2) {
          draft = draft || randAv();
          const sw = (k, arr, lbl) => `<fieldset><legend>${e(t(lbl))}</legend><div class="tw-sw">${arr.map((c, i) =>
            `<button type="button" data-${k}="${i}" style="background:${c}" aria-pressed="${draft[k] === i}" aria-label="${e(t(lbl))} ${i + 1}"></button>`).join("")}</div></fieldset>`;
          body = `<h2 id="twDlgH">${e(t(T.makeAv))}</h2><div class="tw-ed"><div class="pv" id="twPv"></div><div class="ctl">
            ${sw("skin", pal("SKINS"), T.skin)}
            <fieldset><legend>${e(t(T.head))}</legend><div class="tw-row" style="margin:0;justify-content:flex-start">${HEADS.map(h =>
              `<button type="button" class="tw-btn alt" data-head="${h}" aria-pressed="${draft.head === h}">${e(t(T.heads[h]))}</button>`).join("")}</div></fieldset>
            ${draft.head === "none" ? sw("hair", pal("HAIRS"), T.hair) : ""}
            ${sw("outfit", pal("OUTFITS"), T.outfit)}</div></div>
            <div class="tw-row">${skipB}<button type="button" class="tw-btn" data-k="next">${e(t(editOnly ? T.save : T.nextStep))}</button></div>`;
        } else body = `<h2 id="twDlgH">${e(t(T.ready))}</h2><p>${e(t(T.readyS))}</p><div class="tw-row"><span></span><button type="button" class="tw-btn" data-k="close">${e(t(T.ready))} ▶</button></div>`;
        dlg.innerHTML = head + body;
        const r = dlg.querySelector("#twDR").getContext("2d"); r.imageSmoothingEnabled = false; drawRobot(r, 10, 21, 0);
        const pv = dlg.querySelector("#twPv"); if (pv) pv.appendChild(avCanvas(draft, 4));
        dlg.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { const n = +dlgStep[1]; D2.setProfile(D2.PROFILE[n].k, b.dataset.p);
          if (n + 1 < D2.PROFILE.length) { dlgStep = "p" + (n + 1); renderDlg(); } else afterProfile(); });
        dlg.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { D2.consent(b.dataset.c); dlgStep = 2; renderDlg(); });
        dlg.querySelectorAll("[data-a]").forEach(b => b.onclick = () => { dlgStep = 2; WQ.setAud(b.dataset.a); });
        ["skin", "hair", "outfit"].forEach(k => dlg.querySelectorAll(`[data-${k}]`).forEach(b => b.onclick = () => { draft[k] = +b.dataset[k]; rerender(`[data-${k}="${b.dataset[k]}"]`); }));
        dlg.querySelectorAll("[data-head]").forEach(b => b.onclick = () => { draft.head = b.dataset.head; rerender(`[data-head="${draft.head}"]`); });
        const k = s => dlg.querySelector(`[data-k=${s}]`);
        if (k("skip")) k("skip").onclick = /^p\d$/.test(dlgStep) && +dlgStep[1] + 1 < D2.PROFILE.length ? () => { dlgStep = "p" + (+dlgStep[1] + 1); renderDlg(); } : skip;
        if (k("skipall")) k("skipall").onclick = afterProfile;
        if (k("later")) k("later").onclick = () => { dlgStep = 3; renderDlg(); };
        if (k("pre")) k("pre").onclick = () => { closeDlg(); WQ.go("check/pre"); };
        if (k("next")) k("next").onclick = () => { saveAv({ ...draft }); if (editOnly) closeDlg(); else { dlgStep = D2 && !D2.preDone() ? "pre" : 3; renderDlg(); dlg.querySelector("button").focus(); } };
        if (k("close")) k("close").onclick = closeDlg;
        const f = dlg.querySelector("button"); if (f) f.focus();
      }
      const rerender = sel => { renderDlg(); const b = dlg.querySelector(sel); if (b) b.focus(); };
      if (dlgStep != null) openDlg();

      return () => { if (raf) cancelAnimationFrame(raf); raf = 0; io.disconnect(); ro.disconnect();
        document.removeEventListener("visibilitychange", kick); if (dlg && dlg.open) dlg.close(); };
    }
  });
})();
