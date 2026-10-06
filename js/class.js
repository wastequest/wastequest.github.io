/* Class Battle (#/class): a live class quiz. The teacher hosts on the projector; students join on phones through
   PeerJS (WebRTC, needs internet). Team mode runs offline on the projector only.
   Routes: #/class · #/class/host · #/class/join[/<code>] · #/class/team
   Message protocol (JSON objects with a "type" field). The host is authoritative: it checks every answer and its timing
   and computes all scores; phones only send a choice.
     phone → host: hello {pid,name,lang} · answer {n,i} · ping {}
     host → phone: welcome {pid,name,code} · lobby {count} · question {n,total,q,a,secs,left,answered} · ack {n,i}
                   reveal {n,total,q,a,c,why,mine,ok,gained,score,streak,rank,count} · leaderboard {rank,count,score,top}
                   end {rank,count,score,correct,total,top} · kick {} · ping {}
   Question text travels bilingual ({en,bm}) so each phone shows its own language.
   The pure logic (codes, scoring, names, CSV) also runs in Node: `node js/class.js` runs its self-test. */
// SOURCES: the 8 built-in sample questions use only facts given in SPEC.md (SWCorp via The Star, 2 Jan 2024; SWCorp bin colours; Act 672 states).
(() => {
"use strict";

/* ---------------- pure logic ---------------- */
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";            // no I, L, O, 0, 1
const rand = () => { try { return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32; } catch (e) { return Math.random(); } };
const makeCode = (r = rand) => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(r() * CODE_CHARS.length)]).join("");
const normCode = s => String(s ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const validCode = c => typeof c === "string" && c.length === 5 && [...c].every(ch => CODE_CHARS.includes(ch));
/* correct = 500 + 500 × (time left / total) + streak bonus (100 per answer in a row after the first, max 500) */
const points = (ok, leftMs, totalMs, streak) => ok
  ? Math.round(500 + 500 * Math.min(1, Math.max(0, leftMs / totalMs))) + 100 * Math.min(5, Math.max(0, streak - 1)) : 0;
const cleanName = s => [...String(s ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, "")
  .replace(/\s+/g, " ").trim()].slice(0, 16).join("").trim() || "Player";
const uniqueName = (name, taken) => {
  const t = new Set(taken.map(x => x.toLowerCase())); let n = name;
  for (let k = 2; t.has(n.toLowerCase()); k++) n = [...name].slice(0, 15 - String(k).length).join("").trimEnd() + " " + k;
  return n;
};
const csvCell = v => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const ranked = ps => [...ps].sort((a, b) => b.score - a.score || a.joined - b.joined);

if (typeof module === "object" && module.exports) {
  module.exports = { CODE_CHARS, makeCode, normCode, validCode, points, cleanName, uniqueName, csvCell, ranked };
  if (require.main === module) {
    const A = require("assert");
    for (let i = 0; i < 2000; i++) A.ok(validCode(makeCode()));
    A.ok(!/[ILO01]/.test(CODE_CHARS));
    A.strictEqual(makeCode(() => 0), "AAAAA");
    A.strictEqual(makeCode(() => 0.999999), "99999");
    A.strictEqual(normCode(" k7p-2q "), "K7P2Q");
    A.ok(!validCode("K7P2O") && !validCode("K7P2") && !validCode("K7P2QQ") && validCode("K7P2Q"));
    A.strictEqual(points(false, 5000, 10000, 3), 0);
    A.strictEqual(points(true, 10000, 10000, 1), 1000);
    A.strictEqual(points(true, 0, 10000, 1), 500);
    A.strictEqual(points(true, 5000, 10000, 2), 850);
    A.strictEqual(points(true, 99999, 10000, 9), 1500);
    A.strictEqual(points(true, -50, 10000, 0), 500);
    const n = cleanName("  Ali\u0000\u202e  bin   Abu the very long name ");
    A.ok([...n].length <= 16 && !/[\u0000\u202e]/.test(n) && n.startsWith("Ali bin Abu"));
    A.strictEqual(cleanName("   "), "Player");
    A.strictEqual(uniqueName("Ali", ["ali", "Ali 2"]), "Ali 3");
    A.strictEqual(uniqueName("Ali", ["Abu"]), "Ali");
    A.strictEqual(uniqueName("Abcdefghijklmnop", ["abcdefghijklmnop"]), "Abcdefghijklmn 2");
    A.ok([...uniqueName("Abcdefghijklmnop", ["abcdefghijklmnop"])].length <= 16);
    A.strictEqual(csvCell('=HYPERLINK("x")'), `"'=HYPERLINK(""x"")"`);
    A.strictEqual(csvCell("a,b"), '"a,b"');
    A.strictEqual(csvCell(1500), "1500");
    A.deepStrictEqual(ranked([{ score: 5, joined: 2 }, { score: 9, joined: 3 }, { score: 5, joined: 1 }]).map(p => p.joined), [3, 1, 2]);
    console.log("class.js logic: all tests passed");
  }
  return;
}

/* ---------------- constants & text ---------------- */
const PFX = "wasteq-";
const PEER_JS = ["https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js", "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"];
const QR_JS = ["https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"];
const TILES = [["▲", "red"], ["◆", "blue"], ["●", "yellow"], ["■", "green"]];
const TITLE = { en: "Class Battle", bm: "Pertandingan Kelas" };
const TOPICS = {
  sorting: { en: "Sorting & recycling", bm: "Pengasingan & kitar semula" }, w2w: { en: "Waste-to-wealth", bm: "Sisa kepada kekayaan" },
  circular: { en: "Circular economy", bm: "Ekonomi kitaran" }, compost: { en: "Compost", bm: "Kompos" }, enzyme: { en: "Eco-enzyme", bm: "Eko-enzim" },
  ph: { en: "pH & chemistry", bm: "pH & kimia" }, plastics: { en: "Plastics", bm: "Plastik" }, malaysia: { en: "Malaysian waste facts", bm: "Fakta sisa Malaysia" },
  sdg: { en: "SDGs", bm: "Matlamat Pembangunan Mampan (SDG)" }, labs: { en: "Hands-on labs", bm: "Makmal amali" },
  energy: { en: "Energy from waste", bm: "Tenaga daripada sisa" }, economy: { en: "Economy & business", bm: "Ekonomi & perniagaan" }
};
const TEAM_DEF = [["🐯", { en: "Tigers", bm: "Harimau" }], ["🐢", { en: "Turtles", bm: "Penyu" }], ["🐘", { en: "Elephants", bm: "Gajah" }], ["🦧", { en: "Orangutans", bm: "Orang Utan" }]];
const T = {
 en: {
  sub: "A live quiz for the whole class.", subHost: "You are the host. Show this screen on the projector.",
  subJoin: "Join your teacher's live quiz.", subTeam: "Teams play on one screen. No phones or internet needed.",
  host: "Host a class (teacher)", hostD: "Show the quiz on the projector. Students answer on their phones.",
  join: "Join a class (student)", joinD: "Type the code your teacher shows, or scan the QR code.",
  team: "Team mode, no phones", teamD: "2–4 teams play together on the projector.",
  needNet: "Needs internet", offline: "Works offline", tipsT: "Tips for teachers",
  tips: ["Open this page on the computer connected to the projector and choose Host.",
    "Students scan the QR code or type the 5-character code on their phones. No app or login needed.",
    "School Wi-Fi sometimes blocks live mode. A phone hotspot usually works.", "No phones in class? Use Team mode."],
  starting: "Starting the class…", startingD: "Connecting to the free connection service. This needs internet.",
  codeL: "Class code",
  how: s => `Scan the QR code, or open <b>${s}</b> → <b>Class</b> → <b>Join a class</b> and type the code.`,
  localWarn: "This page is running only on this computer (a file or localhost), so phones cannot open the link or QR code. Put WasteQuest online (for example on GitHub Pages) and host from there.",
  srvWarn: "Lost contact with the connection service. Players already in can keep playing; new players may not be able to join until it comes back.",
  players: "Players", noPlayers: "Waiting for players to join…", kick: "Remove",
  start: "Start quiz", needOne: "At least one player must join first.",
  settings: "Settings", track: "Level", topic: "Topic", allTopics: "All topics", nq: "Questions", secs: "Seconds per question",
  tracks: { kids: "Kids 7–12", teens: "Teens 13–17", adults: "Adults" },
  onlyN: n => `Only ${n} questions are available for this choice, so the quiz will use ${n}.`, sample: "Using the 8 built-in sample questions.",
  qOf: (i, n) => `Question ${i} of ${n}`, answered: (a, n) => `✋ ${a}/${n} answered`,
  showAns: "Show answer", board: "Leaderboard", nextQ: "Next question", podium: "Show podium", endNow: "End game now",
  why: "Why?", dist: "Answers", pct: p => `${p}% got it right!`, nobody: "No players yet.",
  ended: "Game over!", kLobby: "Scan the code and join the battle! ♻️", kQ: "Think carefully!", kBoard: "Who will win? 🏆",
  kFinal: "Well played, everyone! Keep sorting your waste! ♻️",
  results: "Full results", nameCol: "Name", scoreCol: "Score", correctCol: "Correct", csv: "Download results (CSV)",
  again: "Play again (same players)", newClass: "New class", newQ: "Start a new class? Players will need the new code.",
  fs: "Fullscreen", exitFs: "Exit fullscreen", retry: "Try again", teamBtn: "Use Team mode",
  name: "Your nickname", nameH: "Up to 16 characters. Keep it kind!", code: "Class code", go: "Join",
  hiJoin: "Hi! Type your nickname and the class code.", needName: "Please type your nickname.",
  badCode: "The class code has 5 letters or numbers, for example K7P2Q.",
  connecting: "Connecting to your class…", inClass: n => `👥 ${n} in the class`,
  waitStart: "You're in! Look at the big screen. Waiting for the teacher to start…",
  reconn: "Reconnecting…", reconnD: "Connection lost. Trying again. Keep this page open.",
  notFound: "Class not found. Check the code with your teacher. The teacher's page must stay open.",
  change: "Change code", leave: "Leave class",
  locked: "Answer sent!", waitOthers: "Waiting for the others…", timeUp: "Time's up!",
  correct: "Correct!", wrong: "Wrong", noAns: "No answer", ansWas: "The answer:",
  rankOf: (r, n) => `You're #${r} of ${n}`, pts: "pts", streak: n => `🔥 ${n} in a row!`,
  youCame: (r, n) => `You finished #${r} of ${n}!`, correctOf: (c, n) => `${c} of ${n} correct`,
  kicked: "The teacher removed you from this class.", home: "Home", myBadges: "My badges",
  teamsN: "Number of teams", teamNames: "Team names", teamHint: "Teams: hold up your answer or call out the shape!",
  whoRight: "Tap every team that got it right (+100 points each):", award: "Add points", scores: "Scores",
  winner: "Winner!", tie: "It's a tie!", playAgain: "Play again", teamBack: "Change teams",
  csvRank: "Rank", csvQ: "Question", csvAns: "Correct answer", csvPct: "% correct", yes: "correct", no: "wrong"
 },
 bm: {
  sub: "Kuiz langsung untuk seluruh kelas.", subHost: "Anda ialah hos. Paparkan skrin ini pada projektor.",
  subJoin: "Sertai kuiz langsung guru anda.", subTeam: "Pasukan bermain pada satu skrin. Tidak perlu telefon atau internet.",
  host: "Anjurkan kelas (guru)", hostD: "Paparkan kuiz pada projektor. Murid menjawab menggunakan telefon.",
  join: "Sertai kelas (murid)", joinD: "Taip kod yang ditunjukkan oleh guru, atau imbas kod QR.",
  team: "Mod pasukan, tanpa telefon", teamD: "2–4 pasukan bermain bersama pada projektor.",
  needNet: "Perlu internet", offline: "Boleh tanpa internet", tipsT: "Tip untuk guru",
  tips: ["Buka halaman ini pada komputer yang disambungkan ke projektor dan pilih Anjurkan kelas.",
    "Murid mengimbas kod QR atau menaip kod 5 aksara pada telefon. Tidak perlu aplikasi atau log masuk.",
    "Wi-Fi sekolah kadangkala menyekat mod langsung. Hotspot telefon biasanya berfungsi.", "Tiada telefon dalam kelas? Gunakan Mod pasukan."],
  starting: "Memulakan kelas…", startingD: "Menyambung ke perkhidmatan sambungan percuma. Ini memerlukan internet.",
  codeL: "Kod kelas",
  how: s => `Imbas kod QR, atau buka <b>${s}</b> → <b>Kelas</b> → <b>Sertai kelas</b> dan taip kod.`,
  localWarn: "Halaman ini hanya berjalan pada komputer ini (fail atau localhost), jadi telefon tidak dapat membuka pautan atau kod QR. Letakkan WasteQuest dalam talian (contohnya di GitHub Pages) dan anjurkan dari situ.",
  srvWarn: "Hubungan dengan perkhidmatan sambungan terputus. Pemain yang sudah masuk boleh terus bermain; pemain baharu mungkin tidak dapat menyertai sehingga ia pulih.",
  players: "Pemain", noPlayers: "Menunggu pemain menyertai…", kick: "Keluarkan",
  start: "Mula kuiz", needOne: "Sekurang-kurangnya seorang pemain perlu menyertai dahulu.",
  settings: "Tetapan", track: "Tahap", topic: "Topik", allTopics: "Semua topik", nq: "Bilangan soalan", secs: "Saat bagi setiap soalan",
  tracks: { kids: "Kanak-kanak 7–12", teens: "Remaja 13–17", adults: "Dewasa" },
  onlyN: n => `Hanya ${n} soalan tersedia untuk pilihan ini, jadi kuiz akan menggunakan ${n} soalan.`, sample: "Menggunakan 8 soalan contoh terbina dalam.",
  qOf: (i, n) => `Soalan ${i} daripada ${n}`, answered: (a, n) => `✋ ${a}/${n} sudah menjawab`,
  showAns: "Tunjuk jawapan", board: "Papan pendahulu", nextQ: "Soalan seterusnya", podium: "Tunjuk podium", endNow: "Tamatkan permainan",
  why: "Mengapa?", dist: "Jawapan", pct: p => `${p}% menjawab dengan betul!`, nobody: "Belum ada pemain.",
  ended: "Permainan tamat!", kLobby: "Imbas kod dan sertai pertandingan! ♻️", kQ: "Fikir baik-baik!", kBoard: "Siapakah yang akan menang? 🏆",
  kFinal: "Syabas semua! Teruskan mengasingkan sisa! ♻️",
  results: "Keputusan penuh", nameCol: "Nama", scoreCol: "Markah", correctCol: "Betul", csv: "Muat turun keputusan (CSV)",
  again: "Main lagi (pemain sama)", newClass: "Kelas baharu", newQ: "Mulakan kelas baharu? Pemain perlu menggunakan kod baharu.",
  fs: "Skrin penuh", exitFs: "Keluar skrin penuh", retry: "Cuba lagi", teamBtn: "Guna Mod pasukan",
  name: "Nama samaran anda", nameH: "Maksimum 16 aksara. Gunakan nama yang sopan!", code: "Kod kelas", go: "Sertai",
  hiJoin: "Hai! Taip nama samaran dan kod kelas anda.", needName: "Sila taip nama samaran anda.",
  badCode: "Kod kelas mempunyai 5 huruf atau nombor, contohnya K7P2Q.",
  connecting: "Menyambung ke kelas anda…", inClass: n => `👥 ${n} orang dalam kelas`,
  waitStart: "Anda sudah masuk! Lihat skrin besar. Tunggu guru memulakan kuiz…",
  reconn: "Menyambung semula…", reconnD: "Sambungan terputus. Sedang mencuba lagi. Jangan tutup halaman ini.",
  notFound: "Kelas tidak dijumpai. Semak kod dengan guru anda. Halaman guru mesti kekal terbuka.",
  change: "Tukar kod", leave: "Keluar kelas",
  locked: "Jawapan dihantar!", waitOthers: "Tunggu rakan lain…", timeUp: "Masa tamat!",
  correct: "Betul!", wrong: "Salah", noAns: "Tiada jawapan", ansWas: "Jawapannya:",
  rankOf: (r, n) => `Anda di tempat ke-${r} daripada ${n}`, pts: "mata", streak: n => `🔥 ${n} betul berturut-turut!`,
  youCame: (r, n) => `Anda menduduki tempat ke-${r} daripada ${n}!`, correctOf: (c, n) => `${c} daripada ${n} betul`,
  kicked: "Guru telah mengeluarkan anda daripada kelas ini.", home: "Utama", myBadges: "Lencana saya",
  teamsN: "Bilangan pasukan", teamNames: "Nama pasukan", teamHint: "Pasukan: angkat jawapan anda atau sebut bentuknya!",
  whoRight: "Tekan setiap pasukan yang menjawab dengan betul (+100 mata setiap satu):", award: "Tambah mata", scores: "Markah",
  winner: "Pemenang!", tie: "Seri!", playAgain: "Main lagi", teamBack: "Tukar pasukan",
  csvRank: "Kedudukan", csvQ: "Soalan", csvAns: "Jawapan betul", csvPct: "% betul", yes: "betul", no: "salah"
 }
};
const HELP = {
 en: { t: "Live class mode can't connect", old: "This browser is too old for live mode. Please use an up-to-date Chrome, Edge, Safari or Firefox.",
   why: "Live mode needs internet. It links phones to this screen through a free online service (PeerJS).",
   tips: ["School Wi-Fi may block it. Try a phone hotspot for this device; students can use mobile data or the same hotspot.",
     "Check that this device is online, then press Try again.", "No internet? Use Team mode on the projector: no phones needed."] },
 bm: { t: "Mod kelas langsung tidak dapat disambungkan", old: "Pelayar ini terlalu lama untuk mod langsung. Sila gunakan Chrome, Edge, Safari atau Firefox terkini.",
   why: "Mod langsung memerlukan internet. Ia menghubungkan telefon dengan skrin ini melalui perkhidmatan dalam talian percuma (PeerJS).",
   tips: ["Wi-Fi sekolah mungkin menyekatnya. Cuba hotspot telefon untuk peranti ini; murid boleh guna data mudah alih atau hotspot yang sama.",
     "Pastikan peranti ini disambungkan ke internet, kemudian tekan Cuba lagi.", "Tiada internet? Gunakan Mod pasukan pada projektor: tidak perlu telefon."] }
};
const ALL = ["kids", "teens", "adults"];
const SAMPLE = [
 { id: "cs1", tracks: ALL, topic: "sorting", q: { en: "Which SWCorp recycling bin is for paper?", bm: "Tong kitar semula SWCorp yang manakah untuk kertas?" },
   a: [{ en: "Blue", bm: "Biru" }, { en: "Orange", bm: "Oren" }, { en: "Brown", bm: "Coklat" }, { en: "Red", bm: "Merah" }], c: 0,
   why: { en: "Blue is for paper, orange is for plastic and aluminium/metal, and brown is for glass.", bm: "Biru untuk kertas, oren untuk plastik dan aluminium/logam, dan coklat untuk kaca." } },
 { id: "cs2", tracks: ALL, topic: "sorting", q: { en: "Where does a clean glass bottle go?", bm: "Ke manakah botol kaca yang bersih dibuang?" },
   a: [{ en: "Orange bin", bm: "Tong oren" }, { en: "Blue bin", bm: "Tong biru" }, { en: "Brown bin", bm: "Tong coklat" }, { en: "General waste", bm: "Sisa am" }], c: 2,
   why: { en: "The brown bin is for glass. Rinse the bottle and remove the lid first.", bm: "Tong coklat untuk kaca. Bilas botol dan tanggalkan penutupnya dahulu." } },
 { id: "cs3", tracks: ALL, topic: "sorting", q: { en: "The orange bin is for…", bm: "Tong oren adalah untuk…" },
   a: [{ en: "Plastic and aluminium/metal", bm: "Plastik dan aluminium/logam" }, { en: "Paper", bm: "Kertas" }, { en: "Glass", bm: "Kaca" }, { en: "Food waste", bm: "Sisa makanan" }], c: 0,
   why: { en: "Orange is for plastic and aluminium/metal, such as rinsed bottles and drink cans.", bm: "Oren untuk plastik dan aluminium/logam, seperti botol yang telah dibilas dan tin minuman." } },
 { id: "cs4", tracks: ALL, topic: "malaysia", q: { en: "What is the biggest part of Malaysian household waste?", bm: "Apakah komponen terbesar dalam sisa isi rumah di Malaysia?" },
   a: [{ en: "Food waste", bm: "Sisa makanan" }, { en: "Plastic", bm: "Plastik" }, { en: "Paper", bm: "Kertas" }, { en: "Glass", bm: "Kaca" }], c: 0,
   why: { en: "Food waste is about 30.6%, then plastic (21.9%) and paper (15.3%) (SWCorp).", bm: "Sisa makanan kira-kira 30.6%, diikuti plastik (21.9%) dan kertas (15.3%) (SWCorp)." } },
 { id: "cs5", tracks: ALL, topic: "malaysia", q: { en: "About how much solid waste did Malaysia produce each day in 2024?", bm: "Berapakah anggaran sisa pepejal yang dihasilkan di Malaysia setiap hari pada tahun 2024?" },
   a: [{ en: "About 3,900 tonnes", bm: "Kira-kira 3,900 tan" }, { en: "About 39,000 tonnes", bm: "Kira-kira 39,000 tan" }, { en: "About 390,000 tonnes", bm: "Kira-kira 390,000 tan" }, { en: "About 3.9 million tonnes", bm: "Kira-kira 3.9 juta tan" }], c: 1,
   why: { en: "About 39,078 tonnes a day in 2024, more than double the ~19,000 tonnes a day in 2005 (SWCorp).", bm: "Kira-kira 39,078 tan sehari pada 2024, lebih dua kali ganda berbanding ~19,000 tan sehari pada 2005 (SWCorp)." } },
 { id: "cs6", tracks: ALL, topic: "malaysia", q: { en: "On average, how much waste does one person in Malaysia throw away each day?", bm: "Secara purata, berapa banyakkah sisa yang dibuang oleh seorang di Malaysia setiap hari?" },
   a: [{ en: "About 0.1 kg", bm: "Kira-kira 0.1 kg" }, { en: "About 1.17 kg", bm: "Kira-kira 1.17 kg" }, { en: "About 5 kg", bm: "Kira-kira 5 kg" }, { en: "About 12 kg", bm: "Kira-kira 12 kg" }], c: 1,
   why: { en: "About 1.17 kg per person per day (SWCorp, 2024).", bm: "Kira-kira 1.17 kg seorang sehari (SWCorp, 2024)." } },
 { id: "cs7", tracks: ALL, topic: "malaysia", q: { en: "Which law makes separating waste at source compulsory in the states that adopted it?", bm: "Undang-undang manakah yang mewajibkan pengasingan sisa di punca di negeri yang menerima pakainya?" },
   a: [{ en: "Act 672: Solid Waste and Public Cleansing Management Act 2007", bm: "Akta 672: Akta Pengurusan Sisa Pepejal dan Pembersihan Awam 2007" }, { en: "Road Transport Act", bm: "Akta Pengangkutan Jalan" }, { en: "Education Act", bm: "Akta Pendidikan" }, { en: "Copyright Act", bm: "Akta Hak Cipta" }], c: 0,
   why: { en: "Under Act 672, separation at source is compulsory in Johor, Melaka, Negeri Sembilan, Pahang, Perlis, Kedah, Kuala Lumpur and Putrajaya.", bm: "Di bawah Akta 672, pengasingan sisa di punca diwajibkan di Johor, Melaka, Negeri Sembilan, Pahang, Perlis, Kedah, Kuala Lumpur dan Putrajaya." } },
 { id: "cs8", tracks: ALL, topic: "enzyme", q: { en: "Fruit peels + sugar + water, left to ferment, make…", bm: "Kulit buah + gula + air, dibiarkan menapai, menghasilkan…" },
   a: [{ en: "Eco-enzyme", bm: "Eko-enzim" }, { en: "Plastic", bm: "Plastik" }, { en: "Glass", bm: "Kaca" }, { en: "Petrol", bm: "Petrol" }], c: 0,
   why: { en: "That's waste-to-wealth: fruit waste becomes eco-enzyme, a useful cleaning liquid. Make it with an adult: gas builds up in the bottle.", bm: "Itulah sisa kepada kekayaan: sisa buah menjadi eko-enzim, cecair pembersih yang berguna. Buat bersama orang dewasa: gas terkumpul dalam botol." } }
];

WQ.addBadge("class", { icon: "📱", name: { en: "Class Battler", bm: "Pejuang Kelas" }, desc: { en: "Finish a live class quiz", bm: "Tamatkan kuiz kelas langsung" } });

WQ.css("class", `
.cl-modes{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.cl-mode{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:inherit;transition:transform .15s}
.cl-mode:hover{transform:translateY(-3px)}.cl-mode .ti{font-size:3rem;line-height:1}.cl-mode h3{font-size:1.3rem}.cl-mode p{margin:0;color:var(--muted)}
.cl-tips{margin-top:18px}.cl-tips ul,.cl-help ul{margin:.3em 0;padding-left:1.3em}
.cl-help h3{font-size:1.2rem}.cl-help2{margin-top:10px;padding-top:10px;border-top:1px dashed #e8a0a8;font-size:.9rem;color:var(--muted)}
.cl-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 12px}
.cl-mono{font-family:"Baloo 2",monospace;letter-spacing:.08em}
.cl-lobby{display:grid;gap:18px;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start}
.cl-joinbox{text-align:center}.cl-codeL{font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.1em}
.cl-code{font-family:"Baloo 2";font-weight:800;font-size:clamp(3.2rem,11vw,7.5rem);letter-spacing:.14em;line-height:1;margin:4px 0 6px}
.cl-qr{display:grid;place-items:center;margin:8px auto;background:#fff;padding:10px;border-radius:12px;min-height:40px;max-width:100%}
.cl-qr img,.cl-qr canvas{width:min(260px,62vw);height:auto;image-rendering:pixelated}
.cl-how{font-size:clamp(.95rem,1.4vw,1.15rem);word-break:break-word}
.cl-h{font-size:1.3rem;display:flex;gap:8px;align-items:center;margin-bottom:10px}
.cl-set{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.cl-set label,.cl-lbl{display:flex;flex-direction:column;gap:4px;font-weight:800;text-align:left}
.cl-set select,.cl-in{border:3px solid var(--line);border-radius:12px;padding:9px 12px;background:#fff;width:100%;font-weight:700}
.cl-in:focus,.cl-set select:focus{border-color:var(--blue)}
.cl-codein{font-size:1.6rem;text-transform:uppercase;text-align:center}
.cl-players{display:flex;flex-wrap:wrap;gap:8px;min-height:44px;align-items:center}
.cl-chip{display:inline-flex;align-items:center;gap:6px;background:var(--soft);border-radius:999px;padding:4px 5px 4px 14px;font-weight:800;max-width:100%}
.cl-chip.off{opacity:.45}.cl-chip button{width:32px;height:32px;border-radius:50%;background:#fff;font-weight:800;color:var(--red);flex:none}
.cl-go{font-size:1.3rem;padding:14px 30px}
.cl-kiki{display:flex;align-items:center;gap:14px}.cl-kiki .mascot{width:96px;flex:none}.cl-kiki.sm .mascot{width:64px}
.cl-kiki .bubble{font-weight:800;font-size:clamp(1rem,1.6vw,1.35rem)}
.cl-timer{display:flex;align-items:center;gap:14px;margin-bottom:12px}
.cl-clock{flex:none;width:clamp(64px,8vw,104px);height:clamp(64px,8vw,104px);border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:"Baloo 2";font-weight:800;font-size:clamp(1.8rem,3.6vw,3.2rem);box-shadow:var(--shadow)}
.cl-clock.low{background:var(--red)}.cl-timer .meter{flex:1;height:18px}
.cl-q{text-align:center}.cl-q h2{font-size:clamp(1.35rem,3.2vw,2.7rem)}.cl-q.sm h2{font-size:clamp(1.15rem,2.2vw,1.8rem)}
.cl-tiles{display:grid;gap:12px;grid-template-columns:1fr 1fr;margin-top:14px}
.cl-tile{display:flex;align-items:center;gap:14px;border-radius:16px;padding:14px 18px;color:#fff;font-weight:800;font-size:clamp(1.05rem,2.1vw,1.85rem);line-height:1.2;min-height:clamp(64px,10vh,120px);box-shadow:inset 0 -6px 0 rgba(0,0,0,.18);text-align:left;width:100%;transition:opacity .3s}
.cl-tile .sh{font-size:1.5em;line-height:1;flex:none;width:1.2em;text-align:center}
.t-red{background:#d62839}.t-blue{background:#1f6fd1}.t-yellow{background:#ffc83d;color:#1d3557}.t-green{background:#2e8b23}
.cl-tile.dim{opacity:.28}.cl-tile.ok{outline:6px solid var(--ink);outline-offset:3px}
.cl-foot{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:16px}
.cl-chart{display:grid;grid-template-columns:repeat(var(--n),1fr);gap:14px;height:clamp(130px,24vh,240px);margin:14px auto;max-width:760px}
.cl-col{display:flex;flex-direction:column;gap:6px;min-width:0}.cl-col .bw{flex:1;position:relative}
.cl-col .bw i{position:absolute;left:0;right:0;bottom:0;border-radius:10px 10px 0 0;min-height:6px;transition:height .6s}
.cl-col .lab{border-radius:10px;text-align:center;font-weight:800;font-size:clamp(1rem,2vw,1.6rem);padding:2px 0}
.cl-why{margin-top:14px;font-size:clamp(1rem,1.7vw,1.4rem)}
.cl-title{text-align:center;font-size:clamp(1.8rem,4vw,3rem);margin:4px 0 14px}
.cl-board{list-style:none;padding:0;margin:0 auto;display:flex;flex-direction:column;gap:10px;max-width:820px}
.cl-row{display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:10px 18px;box-shadow:var(--shadow);font-weight:800;font-size:clamp(1.1rem,2.3vw,1.9rem)}
.cl-row .rk{width:1.8em;font-family:"Baloo 2";flex:none}.cl-row .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cl-row .ch{font-size:.75em;color:var(--muted);min-width:2.4em;text-align:center}.cl-row .ch.up{color:var(--grass-d)}.cl-row .ch.dn{color:var(--red)}
.cl-row .sw{width:22px;height:22px;border-radius:6px;flex:none}
.cl-podium{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-items:end;max-width:760px;margin:10px auto 18px}
.cl-pod{text-align:center;min-width:0}.cl-pod .nm{font-weight:800;font-size:clamp(1rem,2.4vw,1.9rem);word-break:break-word;line-height:1.15}
.cl-pod .sc{color:var(--muted);font-weight:800}
.cl-pod .blk{border-radius:16px 16px 0 0;font-size:clamp(2rem,5vw,3.6rem);display:grid;place-items:center;box-shadow:var(--shadow);margin-top:6px}
.cl-pod.p1 .blk{height:clamp(120px,22vh,210px);background:var(--gold)}.cl-pod.p2 .blk{height:clamp(90px,16vh,155px);background:#c4ced8}.cl-pod.p3 .blk{height:clamp(70px,12vh,115px);background:#dda36b}
.cl-phone{max-width:520px;margin:0 auto;text-align:center}.cl-phone .cl-kiki{justify-content:center;text-align:left}
.cl-me{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap}
.cl-pad{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.cl-pad .cl-tile{flex-direction:column;justify-content:center;text-align:center;min-height:128px;font-size:1rem;gap:6px;padding:10px 8px}
.cl-pad .cl-tile .sh{font-size:2.6rem;width:auto}.cl-pad .cl-tile:active{transform:scale(.97)}
.cl-pq{font-size:clamp(1.1rem,4.5vw,1.45rem);margin:8px 0 0}
.cl-big{font-family:"Baloo 2";font-weight:800;font-size:clamp(2rem,9vw,3.2rem);line-height:1.1}
.cl-res{border-radius:var(--radius);padding:22px 16px;color:#fff;box-shadow:var(--shadow)}.cl-res.good{background:var(--grass)}.cl-res.bad{background:var(--red)}.cl-res.none{background:var(--grey)}
.cl-chosen{max-width:280px;margin:16px auto;flex-direction:column;justify-content:center;text-align:center;min-height:140px}.cl-chosen .sh{font-size:3rem;width:auto}
.cl-lost{position:sticky;top:6px;z-index:20;background:var(--orange);color:#fff;font-weight:800;border-radius:14px;padding:10px 14px;margin:0 auto 12px;max-width:520px;text-align:center;box-shadow:var(--shadow)}
.cl-spin{width:52px;height:52px;border:7px solid var(--line);border-top-color:var(--grass);border-radius:50%;animation:clspin 1s linear infinite;margin:18px auto}
@keyframes clspin{to{transform:rotate(360deg)}}
.cl-mini{text-align:left;max-width:360px;margin:10px auto;padding-left:1.6em}
.cl-center{text-align:center}.cl-center .row,.cl-phone .row{justify-content:center}
.cl-tset{display:flex;flex-direction:column;gap:8px}.cl-trow{display:flex;gap:8px;align-items:center}.cl-trow .sw{font-size:1.6rem;width:46px;height:46px;border-radius:12px;display:grid;place-items:center;flex:none}
.cl-seg{display:flex;gap:8px;flex-wrap:wrap}.cl-seg button{background:#fff;border:3px solid var(--line);border-radius:999px;padding:6px 18px;font-weight:800}
.cl-seg button[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:#fff}
.tm0{background:var(--purple)}.tm1{background:var(--teal)}.tm2{background:var(--orange)}.tm3{background:#d6418a}
.cl-teams{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:10px}
.cl-tm{color:#fff;border-radius:18px;padding:14px;font-weight:800;font-size:clamp(1.05rem,2vw,1.6rem);opacity:.45;box-shadow:inset 0 -6px 0 rgba(0,0,0,.18);display:flex;gap:8px;align-items:center;justify-content:center}
.cl-tm[aria-pressed=true]{opacity:1;outline:5px solid var(--ink);outline-offset:3px}
.cl-tbar{flex:1;min-width:60px;height:22px;background:#e8eef4;border-radius:999px;overflow:hidden}.cl-tbar i{display:block;height:100%;border-radius:999px;transition:width .6s}
@media (max-width:860px){.cl-lobby{grid-template-columns:1fr}}
@media (max-width:600px){.cl-tiles{grid-template-columns:1fr}.cl-row{padding:8px 12px;gap:8px}.cl-chart{gap:8px}.cl-kiki .mascot{width:70px}}
`);

/* ---------------- shared helpers ---------------- */
let root = null, curMode = null, killT = null, H = null, J = null, TM = null, wake = null;
const L = () => T[WQ.lang] || T.en;
const $ = s => root && root.querySelector(s);
const esc = s => WQ.esc(s), tt = o => WQ.esc(WQ.t(o));
const fmt = n => Number(n || 0).toLocaleString("en-MY");
const main = (html, sub) => { const m = $("#clMain"); if (m) m.innerHTML = (sub ? WQ.head("📱", TITLE, sub) : "") + html; return m; };
const kiki = (msg, cls = "") => `<div class="cl-kiki ${cls}">${WQ.MASCOT}${msg ? `<div class="bubble">${msg}</div>` : ""}</div>`;
const tile = (a, i, cls = "") => `<div class="cl-tile t-${TILES[i][1]} ${cls}"><span class="sh" aria-hidden="true">${TILES[i][0]}</span><span>${tt(a)}</span></div>`;
const fsBtn = () => document.fullscreenEnabled ? `<button class="btn alt" data-act="fs">⛶ ${document.fullscreenElement ? L().exitFs : L().fs}</button>` : "";
const sget = k => { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } };
const sset = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const sdel = k => { try { sessionStorage.removeItem(k); } catch (e) {} };
const getPid = () => {
  let p = sget("wq-class-pid");
  if (typeof p !== "string" || !/^[a-z0-9]{12,40}$/.test(p)) { p = Array.from({ length: 16 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(rand() * 36)]).join(""); sset("wq-class-pid", p); }
  return p;
};
const peerClass = () => window.Peer || (window.peerjs && window.peerjs.Peer);
const loading = {};
const loadAny = (urls, ready) => loading[urls[0]] = loading[urls[0]] || new Promise((ok, no) => {
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
const keepAwake = async () => { try { if (!wake && navigator.wakeLock && document.visibilityState === "visible") { wake = await navigator.wakeLock.request("screen"); wake.addEventListener("release", () => { wake = null; }); } } catch (e) {} };
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && (H || (J && J.st !== "form"))) keepAwake(); });
document.addEventListener("fullscreenchange", () => { if (root) root.querySelectorAll("[data-act=fs]").forEach(b => b.textContent = "⛶ " + (document.fullscreenElement ? L().exitFs : L().fs)); });
const onUnload = e => { if (H && H.players.size && !["lobby", "final", "error"].includes(H.phase)) { e.preventDefault(); e.returnValue = ""; } };

/* question bank: WQ.questions (from questions.js), falling back to the built-in sample */
const validQ = q => q && q.q && Array.isArray(q.a) && q.a.length >= 2 && q.a.length <= 4 && Number.isInteger(q.c) && q.c >= 0 && q.c < q.a.length;
const usingSample = () => !(WQ.questions || []).some(validQ);
const forTrack = t => { const b = (usingSample() ? SAMPLE : WQ.questions.filter(validQ)).filter(q => !Array.isArray(q.tracks) || q.tracks.includes(t)); return b.length ? b : SAMPLE; };
const topicsOf = t => [...new Set(forTrack(t).map(q => q.topic).filter(Boolean))];
const poolOf = s => forTrack(s.track).filter(q => s.topic === "all" || q.topic === s.topic);
const deal = s => WQ.shuffle(poolOf(s)).slice(0, s.n);
const defSet = () => { const track = ALL.includes(WQ.aud) ? WQ.aud : "teens"; return { track, topic: "all", n: 10, secs: track === "kids" ? 30 : 20 }; };

function setHTML(s) {
  const l = L(), tops = topicsOf(s.track); if (s.topic !== "all" && !tops.includes(s.topic)) s.topic = "all";
  const avail = poolOf(s).length, opt = (v, lab, cur) => `<option value="${v}"${String(v) === String(cur) ? " selected" : ""}>${esc(lab)}</option>`;
  return `<div class="cl-set">
    <label>${l.track}<select data-k="track">${ALL.map(t => opt(t, l.tracks[t], s.track)).join("")}</select></label>
    <label>${l.topic}<select data-k="topic">${opt("all", l.allTopics, s.topic)}${tops.map(t => opt(t, TOPICS[t] ? WQ.t(TOPICS[t]) : t, s.topic)).join("")}</select></label>
    <label>${l.nq}<select data-k="n">${[5, 10, 15].map(n => opt(n, n, s.n)).join("")}</select></label>
    <label>${l.secs}<select data-k="secs">${[10, 20, 30].map(n => opt(n, n + " s", s.secs)).join("")}</select></label></div>
    ${avail < s.n ? `<p class="small muted">${l.onlyN(avail)}</p>` : ""}${usingSample() ? `<p class="small muted">${l.sample}</p>` : ""}`;
}
function bindSet(box, s) {
  if (!box) return;
  box.querySelectorAll("select[data-k]").forEach(sel => sel.onchange = () => {
    const k = sel.dataset.k; s[k] = k === "n" || k === "secs" ? +sel.value : sel.value;
    box.innerHTML = setHTML(s); bindSet(box, s); const f = box.querySelector(`[data-k="${k}"]`); if (f) f.focus();
  });
}
function helpBox(kind) {
  return `<div class="note danger cl-help" role="alert">${(WQ.lang === "bm" ? ["bm", "en"] : ["en", "bm"]).map((g, k) => { const h = HELP[g];
    return `<div lang="${g === "bm" ? "ms" : "en"}"${k ? ' class="cl-help2"' : ""}><h3>📶 ${h.t}</h3>${kind === "browser" ? `<p><b>${h.old}</b></p>` : ""}<p>${h.why}</p><ul>${h.tips.map(x => `<li>${x}</li>`).join("")}</ul></div>`; }).join("")}</div>`;
}
function paintClock(end, dur, id = "clClock") {
  const c = $("#" + id); if (!c) return;
  const left = Math.max(0, end - Date.now()), s = Math.ceil(left / 1000);
  c.textContent = s; c.classList.toggle("low", s <= 5);
  const b = $("#clBar"); if (b) b.style.width = (left / dur * 100) + "%";
}
const qStage = (q, btns) => `<div class="cl-timer"><div class="cl-clock" id="clClock" role="timer"></div><div class="meter"><i id="clBar"></i></div></div>
  <div class="card cl-q"><h2>${tt(q.q)}</h2></div><div class="cl-tiles">${q.a.map((a, i) => tile(a, i)).join("")}</div>
  <div class="cl-foot">${kiki(L().kQ, "sm")}<span class="spacer"></span>${btns}</div>`;
const revealTiles = q => `<div class="cl-tiles">${q.a.map((a, i) => tile(a, i, i === q.c ? "ok" : "dim")).join("")}</div>
  ${q.why ? `<div class="note ok cl-why"><b>${L().why}</b> ${tt(q.why)}</div>` : ""}`;

/* ---------------- menu ---------------- */
function renderMenu() {
  const l = L();
  main(`<div class="cl-modes">
    <a class="card cl-mode" href="#/class/host"><span class="ti">🧑\u200d🏫</span><h3>${l.host}</h3><p>${l.hostD}</p><span><span class="tag warn">📶 ${l.needNet}</span></span></a>
    <a class="card cl-mode" href="#/class/join"><span class="ti">📱</span><h3>${l.join}</h3><p>${l.joinD}</p><span><span class="tag warn">📶 ${l.needNet}</span></span></a>
    <a class="card cl-mode" href="#/class/team"><span class="ti">👥</span><h3>${l.team}</h3><p>${l.teamD}</p><span><span class="tag go">✅ ${l.offline}</span></span></a></div>
    <div class="card cl-tips"><h3>💡 ${l.tipsT}</h3><ul>${l.tips.map(x => `<li>${x}</li>`).join("")}</ul></div>`, l.sub);
}

/* ---------------- host (teacher, projector) ---------------- */
const joinURL = code => location.origin + location.pathname + "#/class/join/" + code;
const isLocal = () => location.protocol === "file:" || /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(location.hostname);
const isOn = p => !!(p.conn && p.conn.open);
const nOk = p => Object.values(p.ans).filter(a => a.ok).length;
const hsend = (p, m) => { try { if (m && p.conn && p.conn.open) p.conn.send(m); } catch (e) {} };

function startHost() {
  H = { phase: "boot", players: new Map(), kicked: new Set(), set: defSet(), qs: [], qi: -1, seq: 0, warn: false };
  const h = H; renderHost();
  window.addEventListener("beforeunload", onUnload);
  loadAny(PEER_JS, peerClass).then(() => { if (H === h) openHostPeer(h, 0); }).catch(() => { if (H === h) hostFail("net"); });
  loadAny(QR_JS, () => window.QRCode).then(drawQR).catch(() => { if (H === h) { h.qrFail = true; drawQR(); } });
}
function openHostPeer(h, tries) {
  const code = makeCode(); let peer;
  try { const P = peerClass(); peer = new P(PFX + code, { debug: 0 }); } catch (e) { return hostFail("browser"); }
  h.peer = peer;
  const mine = () => H === h && h.peer === peer;
  const to = setTimeout(() => { if (mine() && !h.code) hostFail("net"); }, 15000);
  peer.on("open", () => {
    if (!mine()) return; clearTimeout(to);
    if (!h.code) { h.code = code; h.phase = "lobby"; renderHost(); keepAwake(); WQ.track("class/host"); h.pingT = setInterval(hostPing, 3000); }
  });
  peer.on("connection", c => { if (mine()) hostConn(c); });
  peer.on("error", err => {
    if (!mine()) return;
    if (err.type === "unavailable-id" && !h.code && tries < 6) { clearTimeout(to); try { peer.destroy(); } catch (e) {} return openHostPeer(h, tries + 1); }
    if (err.type === "peer-unavailable") return;
    if (h.code) { h.warn = true; const w = $("#clWarn"); if (w) w.hidden = false; return; }   // already running: keep going, ping loop reconnects
    clearTimeout(to); hostFail(err.type === "browser-incompatible" ? "browser" : "net");
  });
}
function hostFail(kind) {
  if (!H) return;
  H.phase = "error"; H.err = kind; clearInterval(H.pingT);
  try { H.peer && H.peer.destroy(); } catch (e) {}
  renderHost();
}
function hostConn(c) {
  c.on("data", d => onHostData(c, d));
  const drop = () => { const p = H && c.pid && H.players.get(c.pid); if (p && p.conn === c) { p.conn = null; hostPlayersChanged(); } };
  c.on("close", drop); c.on("error", drop);
}
function onHostData(c, d) {
  if (!H || !d || typeof d !== "object" || typeof d.type !== "string") return;
  if (d.type === "hello") {
    const pid = String(d.pid || "");
    if (!/^[a-z0-9]{6,40}$/i.test(pid)) { try { c.close(); } catch (e) {} return; }
    if (H.kicked.has(pid)) { try { c.send({ type: "kick" }); } catch (e) {} setTimeout(() => { try { c.close(); } catch (e) {} }, 500); return; }
    let p = H.players.get(pid);
    if (p) { if (p.conn && p.conn !== c) try { p.conn.close(); } catch (e) {} }
    else { p = { pid, name: uniqueName(cleanName(d.name), [...H.players.values()].map(x => x.name)), score: 0, streak: 0, ans: {}, joined: ++H.seq, prev: 0, delta: 0 }; H.players.set(pid, p); }
    p.conn = c; c.pid = pid; p.lang = d.lang === "bm" ? "bm" : "en"; p.seen = Date.now();
    hsend(p, { type: "welcome", pid, name: p.name, code: H.code });
    if (H.phase === "lobby") hostBroadcast(); else hsend(p, stateFor(p, rankMap()));
    hostPlayersChanged(); return;
  }
  const p = c.pid && H.players.get(c.pid); if (!p || p.conn !== c) return;
  p.seen = Date.now();
  if (d.type === "answer") {
    const q = H.qs[H.qi], i = d.i;
    if (H.phase !== "question" || d.n !== H.qi || p.ans[H.qi] || !Number.isInteger(i) || i < 0 || i >= q.a.length) return;
    p.ans[H.qi] = { i, left: Math.max(0, H.end - Date.now()), ok: i === q.c, pts: 0 };
    hsend(p, { type: "ack", n: H.qi, i });
    hostPlayersChanged();
  }
}
function hostPing() {
  if (!H) return;
  const now = Date.now(); let ch = false;
  H.players.forEach(p => { if (!p.conn) return; if (now - p.seen > 10000) { try { p.conn.close(); } catch (e) {} p.conn = null; ch = true; } else hsend(p, { type: "ping" }); });
  if (ch) hostPlayersChanged();
  const pr = H.peer, w = !!(pr && pr.disconnected && !pr.destroyed);
  if (w) try { pr.reconnect(); } catch (e) {}
  if (w !== H.warn) { H.warn = w; const e = $("#clWarn"); if (e) e.hidden = !w; }
}
function hostPlayersChanged() {
  if (!H) return;
  if (H.phase === "lobby") paintPlayers();
  if (H.phase === "question") {
    const ps = [...H.players.values()], on = ps.filter(isOn), a = ps.filter(p => p.ans[H.qi]).length, e = $("#clAns");
    if (e) e.textContent = L().answered(a, Math.max(on.length, a));
    if (!H.autoT && on.length && on.every(p => p.ans[H.qi])) { const h = H; H.autoT = setTimeout(() => { if (H === h) { h.autoT = 0; hostReveal(); } }, 800); }
  }
}
const rankMap = () => new Map(ranked([...H.players.values()]).map((p, i) => [p.pid, i + 1]));
const topN = n => ranked([...H.players.values()]).slice(0, n).map(p => ({ name: p.name, score: p.score }));
function stateFor(p, rk) {
  const q = H.qs[H.qi], N = H.qs.length, count = H.players.size, rank = rk.get(p.pid), a = q && p.ans[H.qi];
  switch (H.phase) {
    case "lobby": return { type: "lobby", count };
    case "question": return { type: "question", n: H.qi, total: N, q: q.q, a: q.a, secs: H.set.secs, left: Math.max(0, H.end - Date.now()), answered: a ? a.i : null };
    case "reveal": return { type: "reveal", n: H.qi, total: N, q: q.q, a: q.a, c: q.c, why: q.why || null, mine: a ? a.i : null, ok: !!(a && a.ok), gained: a ? a.pts : 0, score: p.score, streak: p.streak, rank, count };
    case "board": return { type: "leaderboard", rank, count, score: p.score, top: topN(5) };
    case "final": return { type: "end", rank, count, score: p.score, correct: nOk(p), total: N, top: topN(3) };
  }
  return null;
}
function hostBroadcast() { const rk = rankMap(); H.players.forEach(p => hsend(p, stateFor(p, rk))); }
function hostAsk() {
  H.qi++; H.phase = "question"; H.dur = H.set.secs * 1000; H.end = Date.now() + H.dur; clearTimeout(H.autoT); H.autoT = 0;
  clearInterval(H.tick); H.tick = setInterval(() => { if (!H) return; paintClock(H.end, H.dur); if (Date.now() >= H.end) hostReveal(); }, 200);
  hostBroadcast(); renderHost();
}
function hostReveal() {
  if (!H || H.phase !== "question") return;
  clearInterval(H.tick); clearTimeout(H.autoT); H.autoT = 0;
  H.players.forEach(p => { const a = p.ans[H.qi]; if (a && a.ok) { p.streak++; a.pts = points(true, a.left, H.dur, p.streak); p.score += a.pts; } else p.streak = 0; });
  H.phase = "reveal"; hostBroadcast(); renderHost(); WQ.beep(true);
}
function hostEnd() {
  H.phase = "final"; clearInterval(H.tick); hostBroadcast(); renderHost();
  if (!WQ.award("class")) WQ.confetti();
}
function hostCSV() {
  const l = L(), qs = H.qs, ps = ranked([...H.players.values()]), rows = [[l.csvRank, l.nameCol, l.scoreCol, l.correctCol, l.nq, ...qs.map((q, i) => "Q" + (i + 1))]];
  ps.forEach((p, i) => rows.push([i + 1, p.name, p.score, nOk(p), qs.length, ...qs.map((q, k) => p.ans[k] ? (p.ans[k].ok ? l.yes : l.no) : "-")]));
  rows.push([], ["#", l.csvQ, l.csvAns, l.csvPct]);
  qs.forEach((q, k) => rows.push([k + 1, WQ.t(q.q), WQ.t(q.a[q.c]), ps.length ? Math.round(ps.filter(p => p.ans[k] && p.ans[k].ok).length / ps.length * 100) : 0]));
  const blob = new Blob(["\ufeff" + rows.map(r => r.map(csvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `wastequest-class-${H.code}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
function paintPlayers() {
  const box = $("#clPlayers"); if (!box) return;
  const l = L(), ps = [...H.players.values()], on = ps.filter(isOn).length;
  box.innerHTML = ps.length ? ps.map(p => `<span class="cl-chip${isOn(p) ? "" : " off"}">${esc(p.name)} <span class="tag">${p.lang.toUpperCase()}</span><button data-act="kick" data-pid="${p.pid}" aria-label="${l.kick}: ${esc(p.name)}" title="${l.kick}">✕</button></span>`).join("")
    : `<span class="muted">${l.noPlayers}</span>`;
  $("#clCount").textContent = on;
  $("#clStart").disabled = !on; $("#clNeed").textContent = on ? "" : l.needOne;
}
function drawQR() {
  const box = $("#clQR"); if (!box || !H || !H.code) return;
  const url = joinURL(H.code);
  if (window.QRCode) for (const lv of ["M", "L"]) {          // qrcodejs can throw "code length overflow" on some lengths: try another level
    box.innerHTML = ""; try { new window.QRCode(box, { text: url, width: 256, height: 256, correctLevel: window.QRCode.CorrectLevel[lv] }); box.title = url; return; } catch (e) {}
  }
  if (window.QRCode || H.qrFail) box.innerHTML = `<a class="small" href="${esc(url)}">${esc(url)}</a>`;
}
function hostBar(extra = "") {
  return `<div class="cl-bar">${H.code ? `<span class="pill">🔑 ${L().codeL}: <b class="cl-mono">${H.code}</b></span>` : ""}${extra}<span class="spacer"></span>${fsBtn()}</div>
    <div class="note warn small" id="clWarn" role="status"${H.warn ? "" : " hidden"}>${L().srvWarn}</div>`;
}
function renderHost() {
  if (!H) return;
  const l = L(), q = H.qs[H.qi], N = H.qs.length, qp = () => `<span class="pill">${l.qOf(H.qi + 1, N)}</span>`;
  switch (H.phase) {
    case "boot": return main(`<div class="card cl-center">${kiki(l.starting)}<div class="cl-spin" aria-hidden="true"></div><p class="muted">${l.startingD}</p></div>`, l.subHost);
    case "error": return main(helpBox(H.err) + `<div class="row" style="margin-top:14px"><button class="btn" data-act="hNew">🔁 ${l.retry}</button><a class="btn blue" href="#/class/team">👥 ${l.teamBtn}</a></div>`, l.subHost);
    case "lobby": {
      const site = (location.host + location.pathname).replace(/index\.html$/, "");
      main(hostBar() + `<div class="cl-lobby">
        <section class="card cl-joinbox"><div class="cl-codeL">${l.codeL}</div><div class="cl-code cl-mono" aria-label="${l.codeL}: ${[...H.code].join(" ")}">${H.code}</div>
          <div id="clQR" class="cl-qr"></div><p class="cl-how">${l.how(esc(site))}</p>${isLocal() ? `<p class="note warn small">${l.localWarn}</p>` : ""}</section>
        <div class="stack">
          <section class="card"><h2 class="cl-h">👥 ${l.players} <span class="pill" id="clCount">0</span></h2><div id="clPlayers" class="cl-players" aria-live="polite"></div></section>
          <section class="card"><h2 class="cl-h">⚙️ ${l.settings}</h2><div id="clSet">${setHTML(H.set)}</div></section>
          <div class="row"><button class="btn cl-go" data-act="hStart" data-next id="clStart">▶ ${l.start}</button><span class="small muted" id="clNeed"></span></div>
          ${kiki(l.kLobby)}</div></div>`, l.subHost);
      bindSet($("#clSet"), H.set); drawQR(); paintPlayers(); return;
    }
    case "question":
      main(hostBar(qp() + `<span class="pill" id="clAns"></span>`) + qStage(q, `<button class="btn blue" data-act="hShow" data-next>👁 ${l.showAns}</button>`));
      hostPlayersChanged(); paintClock(H.end, H.dur); return;
    case "reveal": {
      const ps = [...H.players.values()], cnt = q.a.map((_, i) => ps.filter(p => p.ans[H.qi] && p.ans[H.qi].i === i).length), max = Math.max(1, ...cnt);
      const pct = ps.length ? Math.round(cnt[q.c] / ps.length * 100) : 0;
      return main(hostBar(qp()) + `<div class="card cl-q sm"><h2>${tt(q.q)}</h2></div>
        <div class="cl-chart" style="--n:${q.a.length}" role="img" aria-label="${l.dist}: ${cnt.map((c, i) => TILES[i][0] + " " + c).join(", ")}">${cnt.map((c, i) =>
          `<div class="cl-col"><div class="bw"><i class="t-${TILES[i][1]}" style="height:${c / max * 100}%"></i></div><div class="lab t-${TILES[i][1]}">${TILES[i][0]} ${c}${i === q.c ? " ✔" : ""}</div></div>`).join("")}</div>
        ${revealTiles(q)}<div class="cl-foot">${kiki(ps.length ? l.pct(pct) : "")}<span class="spacer"></span><button class="btn" data-act="hNext" data-next>🏆 ${l.board} ▶</button></div>`);
    }
    case "board": {
      const list = ranked([...H.players.values()]), last = H.qi + 1 >= N;
      const chg = d => d > 0 ? `<span class="ch up">▲${d}</span>` : d < 0 ? `<span class="ch dn">▼${-d}</span>` : `<span class="ch">–</span>`;
      return main(hostBar(qp()) + `<h2 class="cl-title">🏆 ${l.board}</h2><ol class="cl-board">${list.length ? list.slice(0, 5).map((p, i) =>
          `<li class="cl-row"><span class="rk">${i + 1}</span><span class="nm">${esc(p.name)}</span>${chg(p.delta)}<span>${fmt(p.score)}</span></li>`).join("") : `<li class="muted">${l.nobody}</li>`}</ol>
        <div class="cl-foot">${kiki(l.kBoard, "sm")}<span class="spacer"></span>${last ? "" : `<button class="btn alt" data-act="hEnd">${l.endNow}</button>`}<button class="btn" data-act="hNext" data-next>${last ? "🏅 " + l.podium : l.nextQ} ▶</button></div>`);
    }
    case "final": {
      const list = ranked([...H.players.values()]);
      const pod = [1, 0, 2].map(k => list[k] ? `<div class="cl-pod p${k + 1}"><div class="nm">${esc(list[k].name)}</div><div class="sc">${fmt(list[k].score)} ${l.pts}</div><div class="blk">${["🥇", "🥈", "🥉"][k]}</div></div>` : "<div></div>").join("");
      return main(hostBar() + `<h2 class="cl-title">🎉 ${l.ended}</h2><div class="cl-podium">${pod}</div>
        <div class="cl-foot">${kiki(l.kFinal)}<span class="spacer"></span><button class="btn blue" data-act="hCsv">⬇ ${l.csv}</button><button class="btn" data-act="hAgain">🔁 ${l.again}</button><button class="btn alt" data-act="hNew">${l.newClass}</button></div>
        <section class="card" style="margin-top:16px"><h3>${l.results}</h3><div class="tablewrap"><table class="tbl"><thead><tr><th>#</th><th>${l.nameCol}</th><th>${l.scoreCol}</th><th>${l.correctCol}</th></tr></thead>
        <tbody>${list.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td>${fmt(p.score)}</td><td>${nOk(p)}/${N}</td></tr>`).join("")}</tbody></table></div></section>`);
    }
  }
}

/* ---------------- player (student phone) ---------------- */
function initJoin(code) {
  const c = normCode(code), sess = sget("wq-class-join");
  J = { code: validCode(c) ? c : "", name: sess && sess.name || "", st: "form", pid: getPid(), err: "", tries: 0, last: 0, score: 0 };
  if (J.code && sess && sess.code === J.code && sess.name) return joinGo();   // rejoin after a reload
  renderJoin();
}
function joinGo() {
  const j = J; clearTimeout(J.retryT); J.st = "connecting"; J.err = ""; J.tries = 0; J.everOpen = false; J.lost = false;
  sset("wq-class-join", { code: J.code, name: J.name }); renderJoin(); keepAwake();
  loadAny(PEER_JS, peerClass).then(() => { if (J === j) connect(); }).catch(() => { if (J === j) { J.st = "fail"; renderJoin(); } });
  clearInterval(J.wd); J.wd = setInterval(() => { if (J && J.conn && J.conn.open && Date.now() - J.last > 9000) jFail("stale"); }, 2000);
  clearInterval(J.tick); J.tick = setInterval(() => {
    if (!J || J.st !== "question") return;
    const left = J.deadline - Date.now(), c = $("#clJClock"); if (c) c.textContent = Math.max(0, Math.ceil(left / 1000));
    if (left <= 0) { J.st = "timeup"; renderJoin(); }
  }, 250);
}
function killPeer(o) { clearTimeout(o.openT); const p = o.peer; o.peer = null; o.conn = null; try { p && p.destroy(); } catch (e) {} }
function connect() {
  if (!J || J.dead) return;
  killPeer(J);
  let peer; try { const P = peerClass(); peer = new P({ debug: 0 }); } catch (e) { J.st = "fail"; J.err = "browser"; return renderJoin(); }
  J.peer = peer;
  const mine = () => J && !J.dead && J.peer === peer;
  J.openT = setTimeout(() => { if (mine()) jFail("timeout"); }, 15000);
  peer.on("open", () => {
    if (!mine()) return;
    const c = peer.connect(PFX + J.code, { reliable: true, serialization: "json" }); J.conn = c;
    c.on("open", () => { if (!mine()) return; clearTimeout(J.openT); if (!J.everOpen) WQ.track("class/join"); J.everOpen = true; J.tries = 0; J.last = Date.now(); c.send({ type: "hello", pid: J.pid, name: J.name, lang: WQ.lang }); });
    c.on("data", d => { if (mine()) onJoinData(d); });
    c.on("close", () => { if (mine()) jFail("close"); });
    c.on("error", () => { if (mine()) jFail("conn"); });
  });
  peer.on("error", e => { if (mine()) jFail(e.type); });
}
function jFail(type) {
  if (!J || J.dead) return;
  killPeer(J); clearTimeout(J.retryT);
  if (J.st === "kicked") return;
  if (type === "browser-incompatible") { J.st = "fail"; J.err = "browser"; return renderJoin(); }
  J.tries++;
  if (!J.everOpen) {
    if (type === "peer-unavailable") { J.st = "notfound"; return renderJoin(); }
    if (J.tries >= 3) { J.st = "fail"; return renderJoin(); }
  } else if (!J.lost) { J.lost = true; renderJoin(); }
  J.retryT = setTimeout(connect, Math.min(1000 * J.tries, 5000));
}
function onJoinData(d) {
  if (!J || !d || typeof d !== "object") return;
  J.last = Date.now();
  const wasLost = J.lost; J.lost = false;
  switch (d.type) {
    case "ping": try { J.conn.send({ type: "ping" }); } catch (e) {} if (wasLost) renderJoin(); return;
    case "welcome": J.name = String(d.name || J.name); sset("wq-class-join", { code: J.code, name: J.name }); if (J.st === "connecting") J.st = "lobby"; break;
    case "lobby": J.st = "lobby"; J.count = d.count; J.score = 0; J.beeped = null; break;
    case "question": J.q = d; J.deadline = Date.now() + (+d.left || 0); J.mine = d.answered;
      J.st = d.answered != null ? "answered" : d.left > 0 ? "question" : "timeup"; break;
    case "ack": if (J.q && d.n === J.q.n) { J.st = "answered"; J.mine = d.i; } break;
    case "reveal": J.r = d; J.score = d.score; J.st = "reveal";
      if (J.beeped !== d.n) { J.beeped = d.n; if (d.mine != null) WQ.beep(d.ok); try { navigator.vibrate && navigator.vibrate(d.ok ? 60 : [60, 60, 60]); } catch (e) {} }
      break;
    case "leaderboard": J.b = d; J.score = d.score; J.st = "board"; break;
    case "end": J.e = d; J.score = d.score; J.st = "end";
      if (!J.awarded) { J.awarded = true; if (!WQ.award("class") && d.rank <= 3) WQ.confetti(); }
      break;
    case "kick": J.st = "kicked"; sdel("wq-class-join"); killPeer(J); clearTimeout(J.retryT); break;
    default: if (!wasLost) return;
  }
  renderJoin();
}
function renderJoin() {
  if (!J) return;
  const l = L(), me = `<div class="cl-me"><span class="pill">👤 ${esc(J.name)}</span><span class="pill">⭐ ${fmt(J.score)}</span></div>`;
  let h = "", sub = null;
  switch (J.st) {
    case "form": sub = l.subJoin;
      h = `<form class="card stack" id="clForm" novalidate>${kiki(l.hiJoin)}
        <label class="cl-lbl">${l.name}<input class="cl-in" id="clName" maxlength="16" autocomplete="nickname" value="${esc(J.name)}"></label><div class="small muted">${l.nameH}</div>
        <label class="cl-lbl">${l.code}<input class="cl-in cl-mono cl-codein" id="clCode" maxlength="7" autocapitalize="characters" autocomplete="off" spellcheck="false" value="${esc(J.code)}"></label>
        <p class="note danger small" id="clErr" role="alert"${J.err ? "" : " hidden"}>${esc(J.err)}</p>
        <button class="btn cl-go" type="submit">${l.go} ▶</button></form>`; break;
    case "connecting": h = `<div class="card">${kiki(l.connecting)}<div class="cl-spin" aria-hidden="true"></div><span class="pill">🔑 <b class="cl-mono">${J.code}</b></span></div>`; break;
    case "lobby": h = me + `<div class="card stack">${kiki(l.waitStart)}${J.count ? `<p class="muted">${l.inClass(J.count)}</p>` : ""}<button class="btn alt" data-act="jLeave">${l.leave}</button></div>`; break;
    case "question": { const q = J.q;
      h = me + `<div class="row" style="justify-content:space-between"><span class="pill">${l.qOf(q.n + 1, q.total)}</span><span class="cl-clock" id="clJClock" role="timer">${Math.max(0, Math.ceil((J.deadline - Date.now()) / 1000))}</span></div>
        <h2 class="cl-pq">${tt(q.q)}</h2><div class="cl-pad">${q.a.map((a, i) => `<button class="cl-tile t-${TILES[i][1]}" data-act="ans" data-i="${i}"><span class="sh" aria-hidden="true">${TILES[i][0]}</span><span>${tt(a)}</span></button>`).join("")}</div>`; break; }
    case "answered": h = me + (J.q && J.mine != null && J.q.a[J.mine] ? tile(J.q.a[J.mine], J.mine, "cl-chosen") : "") + `<div class="cl-big">✅ ${l.locked}</div><p class="muted">${l.waitOthers}</p>`; break;
    case "timeup": h = me + `<div class="cl-res none"><div class="cl-big">⏰ ${l.timeUp}</div></div><p class="muted">${l.waitOthers}</p>`; break;
    case "reveal": { const r = J.r, cls = r.mine == null ? "none" : r.ok ? "good" : "bad";
      h = me + `<div class="cl-res ${cls}"><div class="cl-big">${r.mine == null ? "⏰ " + l.noAns : r.ok ? "✅ " + l.correct : "❌ " + l.wrong}</div>${r.ok ? `<div class="cl-big">+${fmt(r.gained)}</div>` : ""}${r.streak > 1 ? `<p><b>${l.streak(r.streak)}</b></p>` : ""}</div>
        <p style="margin-top:14px"><b>${l.ansWas}</b></p>${tile(r.a[r.c], r.c)}${r.why ? `<div class="note ok small" style="margin-top:10px;text-align:left">${tt(r.why)}</div>` : ""}
        <p class="row" style="margin-top:12px"><span class="pill">🏆 ${l.rankOf(r.rank, r.count)}</span></p>`; break; }
    case "board": { const b = J.b;
      h = me + `<div class="card"><div class="cl-big">#${b.rank}</div><p><b>${l.rankOf(b.rank, b.count)}</b></p><p class="pill">⭐ ${fmt(b.score)} ${l.pts}</p>
        <ol class="cl-mini">${(b.top || []).map(t => `<li>${esc(t.name)}: <b>${fmt(t.score)}</b></li>`).join("")}</ol></div>`; break; }
    case "end": { const e = J.e;
      h = `<div class="card stack"><div class="cl-big" style="font-size:4rem">${["🥇", "🥈", "🥉"][e.rank - 1] || "🎉"}</div><h2>${l.youCame(e.rank, e.count)}</h2>
        <p class="row"><span class="pill">⭐ ${fmt(e.score)} ${l.pts}</span><span class="pill">✅ ${l.correctOf(e.correct, e.total)}</span></p>
        ${kiki(l.kFinal)}<div class="row"><a class="btn" href="#/badges">🏅 ${l.myBadges}</a><a class="btn alt" href="#/home">${l.home}</a></div></div>`; break; }
    case "kicked": h = `<div class="card stack"><div class="note warn">${l.kicked}</div><div class="row"><a class="btn alt" href="#/home">${l.home}</a></div></div>`; break;
    case "notfound": h = `<div class="card stack"><div class="note warn">🔍 ${l.notFound}</div><span class="pill">🔑 <b class="cl-mono">${J.code}</b></span>
        <div class="row"><button class="btn" data-act="jRetry">🔁 ${l.retry}</button><button class="btn alt" data-act="jLeave">${l.change}</button></div></div>`; break;
    case "fail": h = helpBox(J.err) + `<div class="row" style="margin-top:14px"><button class="btn" data-act="jRetry">🔁 ${l.retry}</button><button class="btn alt" data-act="jLeave">${l.change}</button></div>`; break;
  }
  const lost = J.lost && J.st !== "end" ? `<div class="cl-lost" role="status">📶 ${l.reconn}<br><span class="small">${l.reconnD}</span></div>` : "";
  main(lost + `<div class="cl-phone">${h}</div>`, sub);
  const f = $("#clForm");
  if (f) {
    if (!J.name) $("#clName").focus();
    $("#clName").oninput = e => { J.name = e.target.value; }; $("#clCode").oninput = e => { J.code = e.target.value; };   // survive a language switch
    f.onsubmit = e => {
      e.preventDefault();
      const raw = $("#clName").value, c = normCode($("#clCode").value);
      J.err = !raw.trim() ? l.needName : !validCode(c) ? l.badCode : "";
      if (J.err) { const x = $("#clErr"); x.textContent = J.err; x.hidden = false; WQ.anim(x, "shake"); return; }
      J.name = cleanName(raw); J.code = c;
      if (location.hash !== "#/class/join/" + c) { sset("wq-class-join", { code: c, name: J.name }); location.hash = "#/class/join/" + c; }
      else joinGo();
    };
  }
}

/* ---------------- team mode (offline, projector only) ---------------- */
function initTeam() { TM = { phase: "setup", n: 2, teams: TEAM_DEF.map(([icon, name]) => ({ icon, name, score: 0, got: false })), set: defSet(), qs: [], qi: -1 }; renderTeam(); }
const teamsIn = () => TM.teams.slice(0, TM.n);
function teamAsk() {
  TM.qi++; TM.phase = "question"; TM.dur = TM.set.secs * 1000; TM.end = Date.now() + TM.dur;
  clearInterval(TM.tick); TM.tick = setInterval(() => { if (!TM) return; paintClock(TM.end, TM.dur); if (Date.now() >= TM.end) teamReveal(); }, 200);
  renderTeam();
}
function teamReveal() { if (!TM || TM.phase !== "question") return; clearInterval(TM.tick); TM.teams.forEach(t => t.got = false); TM.phase = "reveal"; renderTeam(); WQ.beep(true); }
function renderTeam() {
  if (!TM) return;
  const l = L(), q = TM.qs[TM.qi], N = TM.qs.length, ts = teamsIn();
  const bar = (extra = "") => `<div class="cl-bar">${extra}<span class="spacer"></span>${fsBtn()}</div>`, qp = `<span class="pill">${l.qOf(TM.qi + 1, N)}</span>`;
  const max = Math.max(100, ...ts.map(t => t.score));
  const scores = list => `<ol class="cl-board">${list.map((t, i) => `<li class="cl-row"><span class="rk">${i + 1}</span><span class="sw tm${TM.teams.indexOf(t)}"></span><span class="nm">${t.icon} ${tt(t.name)}</span>
    <span class="cl-tbar"><i class="tm${TM.teams.indexOf(t)}" style="width:${t.score / max * 100}%"></i></span><span>${fmt(t.score)}</span></li>`).join("")}</ol>`;
  const sorted = () => [...ts].sort((a, b) => b.score - a.score);
  switch (TM.phase) {
    case "setup":
      main(`<div class="cl-lobby"><section class="card stack"><h2 class="cl-h">👥 ${l.teamsN}</h2>
          <div class="cl-seg" role="group" aria-label="${l.teamsN}">${[2, 3, 4].map(n => `<button data-act="tNum" data-n="${n}" aria-pressed="${TM.n === n}">${n}</button>`).join("")}</div>
          <h3>${l.teamNames}</h3><div class="cl-tset">${ts.map((t, i) => `<label class="cl-trow"><span class="sw tm${i}" aria-hidden="true">${t.icon}</span><input class="cl-in" data-team="${i}" maxlength="20" aria-label="${l.teamNames} ${i + 1}" value="${tt(t.name)}"></label>`).join("")}</div></section>
        <div class="stack"><section class="card"><h2 class="cl-h">⚙️ ${l.settings}</h2><div id="clSet">${setHTML(TM.set)}</div></section>
          <div class="row"><button class="btn cl-go" data-act="tStart" data-next>▶ ${l.start}</button>${fsBtn()}</div>${kiki(l.teamHint)}</div></div>`, l.subTeam);
      bindSet($("#clSet"), TM.set);
      root.querySelectorAll("[data-team]").forEach(inp => inp.oninput = () => { const v = inp.value.trim(); TM.teams[+inp.dataset.team].name = v ? v.slice(0, 20) : TEAM_DEF[+inp.dataset.team][1]; });
      return;
    case "question":
      main(bar(qp) + qStage(q, `<button class="btn blue" data-act="tShow" data-next>👁 ${l.showAns}</button>`) + `<p class="muted cl-center">${l.teamHint}</p>`);
      paintClock(TM.end, TM.dur); return;
    case "reveal":
      return main(bar(qp) + `<div class="card cl-q sm"><h2>${tt(q.q)}</h2></div>${revealTiles(q)}
        <h3 style="margin-top:16px">${l.whoRight}</h3><div class="cl-teams">${ts.map((t, i) => `<button class="cl-tm tm${i}" data-act="tGot" data-i="${i}" aria-pressed="${t.got}">${t.got ? "✔" : "○"} ${t.icon} ${tt(t.name)}</button>`).join("")}</div>
        <div class="cl-foot"><span class="spacer"></span><button class="btn" data-act="tAward" data-next>➕ ${l.award} ▶</button></div>`);
    case "board": {
      const last = TM.qi + 1 >= N;
      return main(bar(qp) + `<h2 class="cl-title">🏆 ${l.scores}</h2>${scores(sorted())}
        <div class="cl-foot">${kiki(l.kBoard, "sm")}<span class="spacer"></span>${last ? "" : `<button class="btn alt" data-act="tEnd">${l.endNow}</button>`}<button class="btn" data-act="tNext" data-next>${last ? "🏅 " + l.podium : l.nextQ} ▶</button></div>`);
    }
    case "final": {
      const s = sorted(), win = s.filter(t => t.score === s[0].score);
      return main(bar() + `<h2 class="cl-title">🎉 ${win.length > 1 ? l.tie : l.winner}</h2>
        <div class="cl-center cl-big" style="margin-bottom:16px">🏆 ${win.map(t => `${t.icon} ${tt(t.name)}`).join(" · ")}</div>${scores(s)}
        <div class="cl-foot">${kiki(l.kFinal)}<span class="spacer"></span><button class="btn" data-act="tAgain">🔁 ${l.playAgain}</button><button class="btn alt" data-act="tSetup">${l.teamBack}</button></div>`);
    }
  }
}

/* ---------------- actions (one delegated click handler) ---------------- */
const ACT = {
  fs: () => { try { document.fullscreenElement ? document.exitFullscreen().catch(() => {}) : document.documentElement.requestFullscreen().catch(() => {}); } catch (e) {} },
  kick: b => { const p = H && H.players.get(b.dataset.pid); if (!p) return; H.kicked.add(p.pid); hsend(p, { type: "kick" }); const c = p.conn; setTimeout(() => { try { c && c.close(); } catch (e) {} }, 500); H.players.delete(p.pid); hostBroadcast(); hostPlayersChanged(); },
  hStart: () => {
    if (!H || H.phase !== "lobby" || ![...H.players.values()].some(isOn)) return;
    H.qs = deal(H.set); H.qi = -1; H.players.forEach(p => Object.assign(p, { score: 0, streak: 0, ans: {}, prev: 0, delta: 0 })); hostAsk();
  },
  hShow: () => hostReveal(),
  hNext: () => {
    if (!H) return;
    if (H.phase === "reveal") { ranked([...H.players.values()]).forEach((p, i) => { p.delta = p.prev ? p.prev - (i + 1) : 0; p.prev = i + 1; }); H.phase = "board"; hostBroadcast(); renderHost(); }
    else if (H.phase === "board") H.qi + 1 < H.qs.length ? hostAsk() : hostEnd();
  },
  hEnd: () => { if (H && H.phase === "board") hostEnd(); },
  hCsv: () => { if (H) hostCSV(); },
  hAgain: () => { if (!H) return; H.phase = "lobby"; H.players.forEach(p => Object.assign(p, { score: 0, streak: 0, ans: {}, prev: 0, delta: 0 })); hostBroadcast(); renderHost(); },
  hNew: () => { if (H && H.players.size && H.phase !== "error" && !confirm(L().newQ)) return; killAll(); startHost(); },
  ans: b => {
    if (!J || J.st !== "question") return;
    const i = +b.dataset.i; J.mine = i; J.st = "answered";
    try { J.conn.send({ type: "answer", n: J.q.n, i }); } catch (e) {}
    try { navigator.vibrate && navigator.vibrate(30); } catch (e) {}
    renderJoin();
  },
  jRetry: () => { if (J) joinGo(); },
  jLeave: () => { sset("wq-class-join", { code: "", name: J ? J.name : "" }); if (location.hash === "#/class/join") { killAll(); initJoin(); } else location.hash = "#/class/join"; },
  tNum: b => { TM.n = +b.dataset.n; renderTeam(); },
  tStart: () => { TM.qs = deal(TM.set); TM.qi = -1; TM.teams.forEach(t => t.score = 0); teamAsk(); },
  tShow: () => teamReveal(),
  tGot: b => { const t = TM.teams[+b.dataset.i]; t.got = !t.got; b.setAttribute("aria-pressed", t.got); b.textContent = `${t.got ? "✔" : "○"} ${t.icon} ${WQ.t(t.name)}`; },
  tAward: () => { if (TM.phase !== "reveal") return; teamsIn().forEach(t => { if (t.got) t.score += 100; }); TM.phase = "board"; renderTeam(); },
  tNext: () => { if (TM.phase !== "board") return; if (TM.qi + 1 < TM.qs.length) teamAsk(); else ACT.tEnd(); },
  tEnd: () => { TM.phase = "final"; clearInterval(TM.tick); renderTeam(); if (!WQ.award("class")) WQ.confetti(); },
  tAgain: () => ACT.tStart(),
  tSetup: () => { TM.phase = "setup"; renderTeam(); }
};
function onClick(e) { const b = e.target.closest("[data-act]"); if (!b || !root || !root.contains(b) || b.disabled) return; const f = ACT[b.dataset.act]; if (f) { e.preventDefault(); f(b); } }
/* projector clickers / keyboard: Space, Enter, → or PageDown press the main "next" button */
function onKey(e) {
  if (!root || e.altKey || e.ctrlKey || e.metaKey || ![" ", "Enter", "ArrowRight", "PageDown"].includes(e.key)) return;
  if (e.target.closest && e.target.closest("input,select,textarea,button,a")) return;
  const b = root.querySelector("[data-next]"); if (b && !b.disabled) { e.preventDefault(); b.click(); }
}
function killAll() {
  clearTimeout(killT); killT = null;
  if (H) { clearInterval(H.tick); clearInterval(H.pingT); clearTimeout(H.autoT); try { H.peer && H.peer.destroy(); } catch (e) {} H = null; }
  if (J) { J.dead = true; clearTimeout(J.retryT); clearInterval(J.wd); clearInterval(J.tick); killPeer(J); J = null; }
  if (TM) { clearInterval(TM.tick); TM = null; }
  if (wake) { try { wake.release(); } catch (e) {} wake = null; }
  window.removeEventListener("beforeunload", onUnload);
  if (document.fullscreenElement) try { document.exitFullscreen().catch(() => {}); } catch (e) {}
}

WQ.registerPage("class", {
  mount(el, { args, relang }) {
    clearTimeout(killT); killT = null;                       // a language switch re-mounts: keep the live session
    const mode = ["host", "join", "team"].includes(args[0]) ? args[0] : "";
    if (!relang || mode !== curMode) killAll();
    curMode = mode;
    el.innerHTML = `<div class="cl-root"><div id="clMain"></div></div>`;
    root = el.firstElementChild; root.addEventListener("click", onClick);
    if (mode === "host") H ? renderHost() : startHost();
    else if (mode === "join") J ? renderJoin() : initJoin(args[1]);
    else if (mode === "team") TM ? renderTeam() : initTeam();
    else renderMenu();
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); killT = setTimeout(killAll, 0); };
  }
});
})();
