/* WasteQuest core: language, audience, storage, router, badges, home + games list + badge wall.
   Modules register themselves with WQ.registerGame / WQ.registerPage / WQ.addBadge (see SPEC.md). */
const WQ = (() => {
  const store = {
    get(k){try{return localStorage.getItem("wq-"+k)}catch(e){return null}},
    set(k,v){try{localStorage.setItem("wq-"+k,v)}catch(e){}},
    getJSON(k,d){try{const v=localStorage.getItem("wq-"+k);return v?JSON.parse(v):d}catch(e){return d}},
    setJSON(k,v){try{localStorage.setItem("wq-"+k,JSON.stringify(v))}catch(e){}}
  };
  const W = {
    lang: store.get("lang") || "en",
    aud: store.get("aud") || "kids",        // kids | teens | adults | teacher
    games: {}, pages: {}, badges: {}, store,
    labs: [],                                // filled by js/labs.js
    questions: [],                           // filled by js/data/questions.js
  };
  const $ = (s, el=document) => el.querySelector(s);
  W.$ = $;
  W.$$ = (s, el=document) => [...el.querySelectorAll(s)];
  W.esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  /* t({en,bm}) -> current language; plain strings pass through */
  W.t = o => o == null ? "" : (typeof o === "string" || typeof o === "number") ? String(o) : (o[W.lang] ?? o.en ?? "");
  /* pick({kids,teens,adults}) -> value for the current audience (teacher uses adults, then teens) */
  W.pick = o => o[W.aud] ?? (W.aud === "teacher" ? (o.adults ?? o.teens) : undefined) ?? o.teens ?? o.kids ?? o.adults;
  W.shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  W.css = (id, text) => { if (document.getElementById("css-" + id)) return; const s = document.createElement("style"); s.id = "css-" + id; s.textContent = text; document.head.appendChild(s); };

  /* UI strings used by core */
  const S = {
    back:{en:"← Back",bm:"← Kembali"}, home:{en:"Home",bm:"Utama"}, learn:{en:"Learn",bm:"Belajar"}, gamesN:{en:"Games",bm:"Permainan"},
    labsN:{en:"Labs",bm:"Makmal"}, classN:{en:"Class",bm:"Kelas"}, certN:{en:"Certificate",bm:"Sijil"}, teacherN:{en:"Teachers",bm:"Guru"},
    heroT:{en:"Hi! I'm Kiki. Let's turn waste into wealth!",bm:"Hai! Saya Kiki. Jom tukar sisa jadi harta!"},
    heroS:{en:"Follow the quest map. Play, learn, make useful things from trash and earn badges and your own certificate.",bm:"Ikut peta misi. Main, belajar, hasilkan barang berguna daripada sampah dan kumpul lencana serta sijil anda sendiri."},
    who:{en:"Who's playing?",bm:"Siapa yang bermain?"},
    aud:{kids:{en:"Kids 7–12",bm:"Kanak-kanak 7–12"},teens:{en:"Teens 13–17",bm:"Remaja 13–17"},adults:{en:"Adults",bm:"Dewasa"},teacher:{en:"Teacher",bm:"Guru"}},
    badgesEarned:{en:"badges earned",bm:"lencana diperoleh"},
    s1:{en:"Learn: Waste-to-Wealth",bm:"Belajar: Sisa kepada Kekayaan"}, s1d:{en:"Where waste goes, the circular economy and why it matters.",bm:"Ke mana sisa pergi, ekonomi kitaran dan kepentingannya."},
    s2:{en:"Games & Simulations",bm:"Permainan & Simulasi"}, s2d:{en:"Sort, match, puzzle, quiz and run your own virtual labs.",bm:"Asing, padan, teka, kuiz dan jalankan makmal maya anda."},
    s3:{en:"Hands-on Labs",bm:"Makmal Amali"}, s3d:{en:"Make real products from waste: step by step, with videos.",bm:"Hasilkan produk sebenar daripada sisa: langkah demi langkah, dengan video."},
    s4:{en:"Class Battle",bm:"Pertandingan Kelas"}, s4d:{en:"Teacher hosts a live quiz, students join by phone.",bm:"Guru menganjurkan kuiz langsung, murid sertai guna telefon."},
    s5:{en:"Badges & Certificate",bm:"Lencana & Sijil"}, s5d:{en:"Collect badges, pass the final quest, print your certificate.",bm:"Kumpul lencana, lulus misi akhir, cetak sijil anda."},
    s6:{en:"Teacher Hub",bm:"Hab Guru"}, s6d:{en:"Lesson plans, micro-credential framework, rubrics and safety.",bm:"Rancangan pengajaran, rangka kerja mikro-kredensial, rubrik dan keselamatan."},
    gamesT:{en:"Games & Simulations",bm:"Permainan & Simulasi"}, gamesS:{en:"Pick a game. Each one earns a badge.",bm:"Pilih permainan. Setiap satu memberi lencana."},
    gamesH:{en:"Games",bm:"Permainan"}, simsH:{en:"Simulations: virtual labs",bm:"Simulasi: makmal maya"},
    badgesT:{en:"My Badges",bm:"Lencana Saya"}, badgesS:{en:"Badges are saved on this device.",bm:"Lencana disimpan pada peranti ini."},
    newBadge:{en:"New badge:",bm:"Lencana baharu:"}, notFound:{en:"Page not found.",bm:"Halaman tidak dijumpai."},
    ages:{en:"Ages",bm:"Umur"}, reset:{en:"Reset my progress",bm:"Set semula kemajuan saya"}, resetQ:{en:"Delete all badges and scores on this device?",bm:"Padam semua lencana dan markah pada peranti ini?"},
    foot:{en:"WasteQuest · Waste-to-Wealth Educational Module · Universiti Putra Malaysia, Faculty of Engineering · Wan Azlina Wan Ab Karim Ghani, Shafreeza Sobri, Izzudin Ismail, Nur Syakina Jamali, Mohd Faiz Gunam Rasul, Salmiaton Ali",
          bm:"WasteQuest · Modul Pendidikan Sisa kepada Kekayaan · Universiti Putra Malaysia, Fakulti Kejuruteraan · Wan Azlina Wan Ab Karim Ghani, Shafreeza Sobri, Izzudin Ismail, Nur Syakina Jamali, Mohd Faiz Gunam Rasul, Salmiaton Ali"}
  };
  W.S = S;

  /* ---------- registries ---------- */
  W.registerGame = (id, def) => { W.games[id] = { id, order: 99, kind: "game", ...def }; if (def.badge) W.addBadge(id, def.badge); };
  W.registerPage = (id, def) => { W.pages[id] = def; };
  W.addBadge = (id, b) => { W.badges[id] = b; };              // b = {icon, name:{en,bm}, desc?:{en,bm}}
  W.earned = () => store.getJSON("badges", {});
  W.has = id => !!W.earned()[id];
  W.award = id => {
    const e = W.earned(); if (e[id]) return false;
    e[id] = new Date().toISOString(); store.setJSON("badges", e); W.track("badge/" + id);
    const b = W.badges[id]; if (b) W.toast(`${b.icon} ${W.t(S.newBadge)} ${W.t(b.name)}`);
    W.confetti(); return true;
  };
  W.best = (key, score) => { const k = "best-" + key, b = Math.max(score ?? 0, +(store.get(k) || 0)); if (score != null) { store.set(k, b); W.track("finish/" + key); } return b; };
  /* usage counter: GoatCounter (script tag in index.html). No cookies, no names; counts only page opens + events below. */
  const tq = [], viewKey = () => (location.hash.replace(/^#\/?/, "") || "home").split("/").slice(0, 2).join("/");
  W.track = (path, page) => { const c = page ? { path, title: path } : { path, event: true }, g = window.goatcounter;
    if (g && g.count) g.count(c); else if (tq.length < 50) tq.push(c); };
  W.flushTrack = () => { while (tq.length) window.goatcounter.count(tq.shift()); };

  /* ---------- feedback ---------- */
  let ac;
  W.beep = ok => { const v = viewKey(); if (!/^(cert|lab)\b/.test(v)) W.track(`answer/${v}/${ok ? "right" : "wrong"}`);
    try { ac = ac || new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime; o.type = "triangle";
    (ok ? [660, 880] : [220, 180]).forEach((f, i) => o.frequency.setValueAtTime(f, t + i * .09));
    g.gain.setValueAtTime(.15, t); g.gain.exponentialRampToValueAtTime(.001, t + .25); o.connect(g).connect(ac.destination); o.start(); o.stop(t + .26); } catch (e) {} };
  W.confetti = () => { for (let i = 0; i < 40; i++) { const c = document.createElement("div"); c.className = "confetti"; c.textContent = ["♻️","⭐","🌱","🎉"][i % 4];
    c.style.left = Math.random() * 100 + "vw"; c.style.animationDuration = 2 + Math.random() * 2 + "s"; c.style.animationDelay = Math.random() * .6 + "s";
    document.body.appendChild(c); setTimeout(() => c.remove(), 5000); } };
  W.toast = msg => { const b = $("#toastbox"), t = document.createElement("div"); t.className = "t"; t.textContent = msg; b.appendChild(t); setTimeout(() => t.remove(), 3200); };
  W.anim = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  /* page header helper for modules */
  W.head = (icon, title, sub) => `<div class="pagehead"><span class="pi" aria-hidden="true">${icon}</span><div><h1>${W.esc(W.t(title))}</h1>${sub ? `<p>${W.esc(W.t(sub))}</p>` : ""}</div></div>`;

  /* ---------- router: #/view/arg1/arg2 ---------- */
  let cleanup = null, lastHash = null;
  W.go = h => { location.hash = "#/" + h; };
  W.route = () => {
    const parts = (location.hash.replace(/^#\/?/, "") || "home").split("/").map(decodeURIComponent);
    const [view, ...args] = parts, el = $("#view"), relang = lastHash === location.hash;
    lastHash = location.hash;
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    el.innerHTML = "";
    let r;
    if (view === "home") r = home(el);
    else if (view === "games") r = gamesList(el);
    else if (view === "badges") r = badgeWall(el);
    else if (view === "game" && W.games[args[0]]) r = W.games[args[0]].mount(el, { args: args.slice(1), relang });
    else if (W.pages[view]) r = W.pages[view].mount(el, { args, relang });
    else el.innerHTML = `<div class="card">${W.t(S.notFound)} <a href="#/home">${W.t(S.home)}</a></div>`;
    cleanup = typeof r === "function" ? r : null;
    $("#backBtn").hidden = view === "home";
    W.$$(".navlinks a").forEach(a => a.classList.toggle("on", a.dataset.v === view || (a.dataset.v === "games" && view === "game") || (a.dataset.v === "labs" && view === "lab")));
    if (!relang) { scrollTo(0, 0); W.track("/" + viewKey(), true); }
    document.title = "WasteQuest";
  };
  W.back = () => { const v = (location.hash.replace(/^#\/?/, "").split("/")[0]); if (v === "game") W.go("games"); else if (v === "lab") W.go("labs"); else W.go("home"); };

  /* ---------- chrome ---------- */
  const paintChrome = () => {
    document.documentElement.lang = W.lang === "bm" ? "ms" : "en";
    W.$$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === W.lang));
    W.$$("[data-s]").forEach(e => e.textContent = W.t(S[e.dataset.s]));
  };
  W.setLang = l => { W.lang = l; store.set("lang", l); W.track("lang/" + l); paintChrome(); W.route(); };
  W.setAud = a => { W.aud = a; store.set("aud", a); W.route(); };

  /* ---------- home ---------- */
  const MASCOT = `<svg class="mascot" viewBox="0 0 120 140" role="img" aria-label="Kiki"><rect x="18" y="34" width="84" height="98" rx="16" fill="#3a9a2c"/><rect x="10" y="22" width="100" height="18" rx="9" fill="#2e7d23"/><rect x="48" y="10" width="24" height="14" rx="6" fill="#2e7d23"/><circle cx="44" cy="70" r="11" fill="#fff"/><circle cx="76" cy="70" r="11" fill="#fff"/><circle cx="46" cy="72" r="5" fill="#1d3557"/><circle cx="78" cy="72" r="5" fill="#1d3557"/><path d="M44 94q16 14 32 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="32" cy="88" r="5" fill="#ff9aa2" opacity=".8"/><circle cx="88" cy="88" r="5" fill="#ff9aa2" opacity=".8"/><path d="M60 108l5 8h-3v6h-4v-6h-3z" fill="#fff" opacity=".9"/></svg>`;
  W.MASCOT = MASCOT;
  function home(el) {
    const total = Object.keys(W.badges).length, got = Object.keys(W.earned()).filter(k => W.badges[k]).length;
    const stops = [["learn","📘","s1","s1d"],["games","🎮","s2","s2d"],["labs","🧪","s3","s3d"],["class","📱","s4","s4d"],["cert","🏅","s5","s5d"],["teacher","🧑‍🏫","s6","s6d"]];
    el.innerHTML = `<div class="hero">${MASCOT}<div class="bubble"><h1>${W.t(S.heroT)}</h1><div>${W.t(S.heroS)}</div>
      <div class="progress"><span class="pill">🏅 ${got}/${total}</span><div class="meter"><i style="width:${total ? got / total * 100 : 0}%"></i></div><a href="#/badges" class="small">${W.t(S.badgesEarned)}</a></div></div></div>
      <div class="who" role="group" aria-label="${W.esc(W.t(S.who))}"><b>${W.t(S.who)}</b>${["kids","teens","adults","teacher"].map(a => `<button data-aud="${a}" aria-pressed="${W.aud === a}">${W.t(S.aud[a])}</button>`).join("")}</div>
      <nav class="map" aria-label="Quest map">${stops.map(([v, i, t, d], n) => `<a class="stop" href="#/${v}"><span class="num">${n + 1}</span><span class="ico">${i}</span><span><h3>${W.t(S[t])}</h3><p>${W.t(S[d])}</p></span></a>`).join("")}</nav>`;
    W.$$("[data-aud]", el).forEach(b => b.onclick = () => W.setAud(b.dataset.aud));
  }
  function tile(g) {
    return `<a class="card tile" href="#/game/${g.id}">${W.has(g.id) ? `<span class="done" title="badge">${g.badge?.icon || "✅"}</span>` : ""}<span class="ti">${g.icon}</span><h3>${W.esc(W.t(g.title))}</h3><p>${W.esc(W.t(g.desc))}</p><span><span class="tag">${W.t(S.ages)} ${g.ages || "7+"}</span></span></a>`;
  }
  function gamesList(el) {
    const all = Object.values(W.games).sort((a, b) => a.order - b.order);
    el.innerHTML = W.head("🎮", S.gamesT, S.gamesS) +
      `<h2 class="section-t">${W.t(S.gamesH)}</h2><div class="grid">${all.filter(g => g.kind === "game").map(tile).join("")}</div>` +
      `<h2 class="section-t">${W.t(S.simsH)}</h2><div class="grid">${all.filter(g => g.kind === "sim").map(tile).join("")}</div>`;
  }
  function badgeWall(el) {
    const e = W.earned();
    el.innerHTML = W.head("🏅", S.badgesT, S.badgesS) + `<div class="badgewall">${Object.entries(W.badges).map(([id, b]) =>
      `<div class="bdg ${e[id] ? "" : "off"}"><span class="bi">${b.icon}</span><b>${W.esc(W.t(b.name))}</b>${b.desc ? `<span class="small muted">${W.esc(W.t(b.desc))}</span>` : ""}</div>`).join("")}</div>
      <p style="margin-top:24px" class="row"><a class="btn" href="#/cert">🎓 ${W.t(S.certN)}</a><button class="btn alt" id="rst">${W.t(S.reset)}</button></p>`;
    $("#rst", el).onclick = () => { if (confirm(W.t(S.resetQ))) { try { Object.keys(localStorage).filter(k => k.startsWith("wq-") && !["wq-lang","wq-aud"].includes(k)).forEach(k => localStorage.removeItem(k)); } catch (er) {} W.route(); } };
  }

  W.start = () => {
    W.$$("[data-lang]").forEach(b => b.onclick = () => W.setLang(b.dataset.lang));
    $("#backBtn").onclick = W.back;
    window.addEventListener("hashchange", W.route);
    paintChrome(); W.route(); W.track("lang/" + W.lang);
  };
  return W;
})();
