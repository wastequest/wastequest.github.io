/* WasteQuest v2 rewards: XP, levels, coins, cosmetics shop (#/shop), HUD, 8-bit sound, optional daily challenge.
   API: WQ.rw = { xp(), level(), coins(), add(n, reason, onceKey), sfxOn(), musicOn(), sfx(name), deco(), acc() }
   Emits: "xp"(amount, reason). Listens: core "answer" "finish" "award" "route"; module "mission"(id) "scan"(material).
   Store keys: rw-xp, rw-spent, rw-day (per-day anti-farming log), rw-dc (daily challenge), rw-seen (games/labs opened),
   rw-snd ({on,music,sfx}), rw-deco ({owned:[],placed:[]}), rw-acc ({owned:[],on:{slot:id}}).
   Rules (research 09 reward contract): finite awards, capped per day, no random loot, no payments, no decay,
   missing a day never removes anything, wrong answers never cost XP.
   SOURCES: research/v2/09_games_benchmark.md sections 4 ("Suggested reward contract") + Decisions [E4][E5][C2];
   all sounds and the chiptune are synthesised here in code (original, no samples). */
(() => {
  const W = typeof WQ !== "undefined" ? WQ : null; if (!W) return;
  const st = W.store, t = W.t, esc = W.esc;
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  const dayNum = () => { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); };
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- levels ---------- */
  const LV = [ // [xp needed, title]
    [0, { en: "Litter Picker", bm: "Pengutip Sampah" }], [100, { en: "Sorter", bm: "Pengasing Sisa" }],
    [250, { en: "Recycler", bm: "Pengitar Semula" }], [450, { en: "Composter", bm: "Pembuat Kompos" }],
    [700, { en: "Maker", bm: "Pereka Cipta" }], [1000, { en: "Eco-Hero", bm: "Wira Eko" }],
    [1400, { en: "Town Guardian", bm: "Penjaga Bandar" }]];
  const xp = () => +(st.get("rw-xp") || 0);
  const lvOf = x => { let i = 0; while (i + 1 < LV.length && x >= LV[i + 1][0]) i++; return i; };
  const coins = () => Math.floor(xp() / 5) - +(st.get("rw-spent") || 0);

  /* ---------- XP ---------- */
  const CAP = { answer: 20, scan: 10 };   // max counted per day (answers: 20 x 5 = 100 XP/day)
  const dayLog = () => { const d = st.getJSON("rw-day", {}); return d.day === today() ? d : { day: today(), n: {}, once: {} }; };
  function add(n, reason, onceKey) {
    const d = dayLog();
    if (onceKey) { if (d.once[onceKey]) return 0; d.once[onceKey] = 1; }
    if (CAP[reason]) { d.n[reason] = (d.n[reason] || 0) + 1; if (d.n[reason] > CAP[reason]) { st.setJSON("rw-day", d); return 0; } }
    st.setJSON("rw-day", d);
    const before = lvOf(xp()); st.set("rw-xp", xp() + n);
    W.emit("xp", n, reason);
    try { W.data && W.data.log && W.data.log("xp", { n, reason, total: xp() }); } catch (e) {}
    paintHud(n);
    if (lvOf(xp()) > before) levelUp(); else if (reason !== "answer") sfx("coin");
    return n;
  }

  /* ---------- daily challenge (optional; never punishes a missed day) ---------- */
  const DC = [
    { k: "ans", v: "game/sort", n: 5, en: "Get 5 right in Sort It Out!", bm: "Dapatkan 5 jawapan betul dalam Asingkan Sampah!" },
    { k: "ans", v: "game/quiz", n: 5, en: "Get 5 right in Eco Quiz Blast", bm: "Dapatkan 5 jawapan betul dalam Kuiz Kilat Eko" },
    { k: "ans", v: "game/myth", n: 3, en: "Spot 3 myths or facts correctly", bm: "Kenal pasti 3 mitos atau fakta dengan betul" },
    { k: "ans", v: "", n: 10, en: "Get 10 answers right anywhere", bm: "Dapatkan 10 jawapan betul di mana-mana" },
    { k: "fin", v: "quiz", n: 1, en: "Finish one quiz", bm: "Habiskan satu kuiz" },
    { k: "fin", v: "match", n: 1, en: "Finish a round of Eco-Match", bm: "Habiskan satu pusingan Padanan Eko" },
    { k: "fin", v: "sort", n: 1, en: "Finish a round of Sort It Out!", bm: "Habiskan satu pusingan Asingkan Sampah!" },
    { k: "fin", v: "myth", n: 1, en: "Finish Myth or Fact?", bm: "Habiskan Mitos atau Fakta?" },
    { k: "newlab", n: 1, en: "Open a lab you haven't tried", bm: "Buka makmal yang belum pernah anda cuba" },
    { k: "newgame", n: 1, en: "Play a game you haven't tried", bm: "Main permainan yang belum pernah anda cuba" },
    { k: "visit", v: "learn/", n: 1, en: "Read one Academy chapter", bm: "Baca satu bab di Akademi" },
    { k: "fin", v: "ph", n: 1, en: "Test something in the pH lab sim", bm: "Uji sesuatu dalam simulasi pH" },
    { k: "visit", v: "game/compost", n: 1, en: "Visit the compost simulator", bm: "Lawati simulasi kompos" },
    { k: "visit", v: "game/enzyme", n: 1, en: "Mix a batch in the Eco-Enzyme Mixer", bm: "Adun satu kelompok dalam Pengadun Eko-Enzim" },
    { k: "fin", v: "cash", n: 1, en: "Finish a round at the recycling Market", bm: "Habiskan satu pusingan di Pasar kitar semula" },
    { k: "visit", v: "game/footprint", n: 1, en: "Check My Waste Footprint", bm: "Semak Jejak Sisa Saya" },
    { k: "badge", n: 1, en: "Earn any new badge", bm: "Dapatkan mana-mana lencana baharu" },
    { k: "mission", n: 1, en: "Complete one home mission", bm: "Selesaikan satu misi di rumah" },
    { k: "scan", n: 3, en: "Scan and sort 3 items", bm: "Imbas dan asingkan 3 barang" },
    { k: "visit", v: "game/wordsearch", n: 1, en: "Try the word search", bm: "Cuba carian perkataan" }];
  const dc = () => { const s = st.getJSON("rw-dc", {}); return s.day === today() ? s : { day: today(), i: dayNum() % DC.length, p: 0, done: false }; };
  function dcTick(kind, v) {
    const s = dc(), c = DC[s.i]; if (s.done || c.k !== kind) return;
    if (c.v != null && !v.startsWith(c.v)) return;
    s.p++; if (s.p >= c.n) s.done = true; st.setJSON("rw-dc", s);
    if (s.done) { W.toast("✅ " + t({ en: "Daily challenge done! +40 XP", bm: "Cabaran harian selesai! +40 XP" })); add(40, "daily", "daily"); }
    paintPop();
  }

  /* ---------- sound (WebAudio, off by default) ---------- */
  let ac, master, musicGain, musicTimer = null, nextT = 0, step = 0, view = "home";
  const snd = () => ({ on: false, music: true, sfx: true, ...st.getJSON("rw-snd", {}) });
  const quietRoute = () => view === "class" || view === "event";
  const sfxOn = () => snd().on && snd().sfx && !quietRoute();
  const musicOn = () => snd().on && snd().music && !quietRoute() && !document.hidden;
  const actx = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = .5; master.connect(ac.destination); } catch (e) { return null; } } if (ac.state === "suspended") ac.resume().catch(() => {}); return ac; };
  function tone(f, at, dur, type = "square", vol = .12, dest) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, at);
    g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.0008, at + dur); o.connect(g).connect(dest || master); o.start(at); o.stop(at + dur + .02);
  }
  const SFX = {
    correct: [[660, 0, .08], [990, .08, .14]], wrong: [[196, 0, .12, "triangle"], [165, .1, .18, "triangle"]],
    coin: [[988, 0, .06], [1319, .06, .18]], click: [[880, 0, .03, "square", .06]],
    levelup: [[523, 0, .1], [659, .1, .1], [784, .2, .1], [1047, .3, .3]]
  };
  function sfx(name) { if (!sfxOn() || !actx()) return; const t0 = ac.currentTime + .01; (SFX[name] || []).forEach(([f, d, l, ty, v]) => tone(f, t0 + d, l, ty, v)); }
  /* original 8-bar loop, 100 bpm, C major pentatonic-ish; 8 eighth-notes per bar. 0 = rest */
  const N = n => n ? 440 * Math.pow(2, (n - 69) / 12) : 0;
  const LEAD = [72,0,76,79, 76,0,74,72, 74,0,76,0, 72,0,0,0, 69,0,72,74, 76,0,74,0, 72,74,72,69, 67,0,0,0,
                72,0,76,79, 81,0,79,76, 74,0,76,79, 76,0,74,0, 72,0,69,72, 74,0,76,74, 72,0,67,69, 72,0,0,0];
  const BASS = [48, 48, 45, 45, 41, 41, 43, 43, 48, 48, 45, 45, 41, 43, 48, 48]; // one per half-bar
  const EIGHTH = 60 / 100 / 2;
  function schedule() {
    if (!musicOn() || !ac) return stopMusic();
    while (nextT < ac.currentTime + .25) {
      const i = step % LEAD.length;
      if (LEAD[i]) tone(N(LEAD[i]), nextT, EIGHTH * .9, "square", .05, musicGain);
      if (i % 4 === 0) tone(N(BASS[(i / 4) % BASS.length]), nextT, EIGHTH * 3.6, "triangle", .09, musicGain);
      nextT += EIGHTH; step++;
    }
  }
  function startMusic() { if (musicTimer || !musicOn() || !actx()) return; musicGain = ac.createGain(); musicGain.gain.value = .6; musicGain.connect(master); nextT = ac.currentTime + .05; musicTimer = setInterval(schedule, 100); }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } if (musicGain) { try { musicGain.gain.setValueAtTime(0, ac.currentTime); musicGain.disconnect(); } catch (e) {} musicGain = null; } }
  const syncMusic = () => musicOn() ? startMusic() : stopMusic();
  const setSnd = p => { st.setJSON("rw-snd", { ...snd(), ...p }); syncMusic(); paintHud(); paintPop(); };

  /* ---------- level-up toast + pixel confetti ---------- */
  function levelUp() {
    const l = lvOf(xp());
    W.toast(`⭐ ${t({ en: "Level up!", bm: "Naik tahap!" })} ${l + 1} · ${t(LV[l][1])}`);
    sfx("levelup");
    if (reduced()) return;
    const cols = ["#0098dc", "#f68187", "#ffeb57", "#5ac54f", "#1e6f50", "#f9e6cf"];
    for (let i = 0; i < 48; i++) { const c = document.createElement("div"); c.className = "rw-px"; c.setAttribute("aria-hidden", "true");
      c.style.cssText = `left:${Math.random() * 100}vw;background:${cols[i % cols.length]};animation-duration:${1.6 + Math.random() * 1.6}s;animation-delay:${Math.random() * .5}s`;
      document.body.appendChild(c); setTimeout(() => c.remove(), 4000); }
  }

  /* ---------- shop catalogue ---------- */
  const DECO = [
    { id: "fountain", icon: "⛲", bg: "#0098dc", price: 60, name: { en: "Fountain", bm: "Air pancut" } },
    { id: "mural", icon: "🎨", bg: "#f68187", price: 50, name: { en: "Recycling mural", bm: "Mural kitar semula" } },
    { id: "bikerack", icon: "🚲", bg: "#ffeb57", price: 40, name: { en: "Bike rack", bm: "Rak basikal" } },
    { id: "raingarden", icon: "🌧️", bg: "#5ac54f", price: 70, name: { en: "Rain garden", bm: "Taman hujan" } },
    { id: "solarlamps", icon: "💡", bg: "#ffeb57", price: 80, name: { en: "Solar lamp row", bm: "Deretan lampu solar" } },
    { id: "gazebo", icon: "🛖", bg: "#1e6f50", price: 120, name: { en: "Kampung-style gazebo", bm: "Wakaf gaya kampung" } }];
  const ACC = [
    { id: "scarf-red", slot: "scarf", icon: "🧣", bg: "#e83b3b", price: 15, name: { en: "Red scarf", bm: "Skarf merah" } },
    { id: "scarf-blue", slot: "scarf", icon: "🧣", bg: "#0098dc", price: 15, name: { en: "Blue scarf", bm: "Skarf biru" } },
    { id: "scarf-green", slot: "scarf", icon: "🧣", bg: "#5ac54f", price: 15, name: { en: "Green scarf", bm: "Skarf hijau" } },
    { id: "scarf-yellow", slot: "scarf", icon: "🧣", bg: "#ffeb57", price: 15, name: { en: "Yellow scarf", bm: "Skarf kuning" } },
    { id: "backpack", slot: "back", icon: "🎒", bg: "#f68187", price: 30, name: { en: "Backpack", bm: "Beg galas" } },
    { id: "glasses", slot: "face", icon: "👓", bg: "#f9e6cf", price: 25, name: { en: "Glasses", bm: "Cermin mata" } }];
  const deco = () => ({ owned: [], placed: [], ...st.getJSON("rw-deco", {}) });
  const acc = () => ({ owned: [], on: {}, ...st.getJSON("rw-acc", {}) });

  function shop(el) {
    const card = (it, kind) => {
      const d = kind === "deco" ? deco() : acc(), own = d.owned.includes(it.id);
      const active = kind === "deco" ? d.placed.includes(it.id) : d.on[it.slot] === it.id;
      const btn = !own
        ? `<button class="rw-btn" data-buy="${it.id}" data-kind="${kind}" ${coins() < it.price ? "disabled" : ""}>${t({ en: "Buy", bm: "Beli" })} · 🪙 ${it.price}</button>`
        : `<button class="rw-btn rw-light" data-use="${it.id}" data-kind="${kind}" aria-pressed="${active}">${active ? "✔ " : ""}${t(kind === "deco" ? (active ? { en: "Placed", bm: "Diletak" } : { en: "Place in town", bm: "Letak di bandar" }) : (active ? { en: "Wearing", bm: "Dipakai" } : { en: "Wear", bm: "Pakai" }))}</button>`;
      return `<li class="rw-item"><div class="rw-prev" style="background:${it.bg}" aria-hidden="true">${kind === "deco" && W.townArt && W.townArt.decoIcon ? `<canvas data-ci="${it.id}" width="32" height="32" style="width:64px;height:64px;image-rendering:pixelated"></canvas>` : `<span>${it.icon}</span>`}</div>
        <div class="rw-iname">${esc(t(it.name))}</div><div class="rw-ist">${own ? t({ en: "Owned", bm: "Dimiliki" }) : ""}</div>${btn}</li>`;
    };
    const paint = () => {
      el.innerHTML = W.head("🛍️", { en: "Town Shop", bm: "Kedai Bandar" }, { en: "Spend coins you earned while learning. Decorations only — nothing here changes your score or unlocks lessons.", bm: "Belanjakan syiling yang anda kumpul semasa belajar. Hiasan sahaja — tiada apa di sini mengubah markah atau membuka pelajaran." }) +
        `<div class="rw-panel rw-wallet"><span class="rw-big">🪙 ${coins()}</span> <span>${t({ en: "coins", bm: "syiling" })}</span> · <span>${t({ en: "No real money. Coins are earned by playing only.", bm: "Tiada wang sebenar. Syiling hanya diperoleh dengan bermain." })}</span></div>
        <h2 class="rw-h">${t({ en: "Town decorations", bm: "Hiasan bandar" })}</h2><ul class="rw-grid">${DECO.map(i => card(i, "deco")).join("")}</ul>
        <h2 class="rw-h">${t({ en: "Avatar accessories", bm: "Aksesori avatar" })}</h2><ul class="rw-grid">${ACC.map(i => card(i, "acc")).join("")}</ul>
        <p class="rw-note">${t({ en: "Placed decorations appear in your town on the home screen.", bm: "Hiasan yang diletak muncul di bandar anda di skrin utama." })}</p>`;
      el.querySelectorAll("canvas[data-ci]").forEach(c => { try { W.townArt.decoIcon(c, c.dataset.ci); } catch (er) {} });
    };
    el.onclick = e => {
      const b = e.target.closest("button[data-kind]"); if (!b) return;
      const kind = b.dataset.kind, key = kind === "deco" ? "rw-deco" : "rw-acc", d = kind === "deco" ? deco() : acc();
      const it = (kind === "deco" ? DECO : ACC).find(x => x.id === (b.dataset.buy || b.dataset.use)); if (!it) return;
      if (b.dataset.buy) {
        if (coins() < it.price || d.owned.includes(it.id)) return;
        st.set("rw-spent", +(st.get("rw-spent") || 0) + it.price); d.owned.push(it.id); sfx("coin");
        W.toast(`${it.icon} ${t(it.name)} ✔`); try { W.data && W.data.log && W.data.log("shop", { id: it.id }); } catch (er) {}
      } else if (kind === "deco") d.placed = d.placed.includes(it.id) ? d.placed.filter(x => x !== it.id) : [...d.placed, it.id];
      else d.on[it.slot] = d.on[it.slot] === it.id ? null : it.id;
      if (!b.dataset.buy) sfx("click");
      st.setJSON(key, d); paint(); paintHud();
      const nb = el.querySelector(`button[data-use="${it.id}"]`); if (nb) nb.focus();
    };
    paint();
    return () => { el.onclick = null; };
  }
  W.registerPage("shop", { mount: shop });

  /* ---------- HUD + popover ---------- */
  let hud, pop;
  function paintHud(gain) {
    if (!hud) return;
    const x = xp(), l = lvOf(x), lo = LV[l][0], hi = LV[l + 1] ? LV[l + 1][0] : lo, pct = hi > lo ? Math.round((x - lo) / (hi - lo) * 100) : 100;
    const main = hud.querySelector(".rw-main");
    main.querySelector(".rw-lv").textContent = l + 1;
    main.querySelector(".rw-fill").style.width = pct + "%";
    main.querySelector(".rw-c").textContent = coins();
    main.setAttribute("aria-label", t({ en: `Level ${l + 1}, ${t(LV[l][1])}. ${x} XP${hi > lo ? `, ${hi - x} to next level` : ""}. ${coins()} coins. Open rewards`, bm: `Tahap ${l + 1}, ${t(LV[l][1])}. ${x} XP${hi > lo ? `, ${hi - x} lagi ke tahap seterusnya` : ""}. ${coins()} syiling. Buka ganjaran` }));
    main.title = t(LV[l][1]);
    const s = hud.querySelector(".rw-snd"), on = snd().on;
    s.textContent = on ? "🔊" : "🔇"; s.setAttribute("aria-pressed", on); s.setAttribute("aria-label", t({ en: "Sound", bm: "Bunyi" }));
    if (gain && !reduced()) { const f = document.createElement("span"); f.className = "rw-float"; f.setAttribute("aria-hidden", "true"); f.textContent = "+" + gain; main.appendChild(f); setTimeout(() => f.remove(), 900); }
  }
  function paintPop() {
    if (!pop || pop.hidden) return;
    const x = xp(), l = lvOf(x), s = dc(), c = DC[s.i], sn = snd();
    pop.setAttribute("aria-label", t({ en: "Rewards", bm: "Ganjaran" }));
    pop.innerHTML = `<div class="rw-ph">⭐ ${t({ en: "Level", bm: "Tahap" })} ${l + 1} · ${esc(t(LV[l][1]))}</div>
      <p class="rw-small">${x} XP${LV[l + 1] ? ` · ${LV[l + 1][0] - x} ${t({ en: "XP to", bm: "XP lagi ke" })} ${esc(t(LV[l + 1][1]))}` : ""} · 🪙 ${coins()}</p>
      <div class="rw-ph">📅 ${t({ en: "Today's optional challenge", bm: "Cabaran pilihan hari ini" })}</div>
      <p class="rw-dc"><span aria-hidden="true">${s.done ? "✅" : "⬜"}</span> ${esc(t(c))} <b class="rw-num">${Math.min(s.p, c.n)}/${c.n}</b>${s.done ? ` <span class="rw-sr">${t({ en: "done", bm: "selesai" })}</span>` : ""}</p>
      <p class="rw-small">${t({ en: "+40 XP. Skip any day — you never lose anything.", bm: "+40 XP. Boleh langkau mana-mana hari — anda tidak akan kehilangan apa-apa." })}</p>
      <div class="rw-ph">🔊 ${t({ en: "Sound", bm: "Bunyi" })}</div>
      <label class="rw-tg"><input type="checkbox" data-snd="on" ${sn.on ? "checked" : ""}> ${t({ en: "Sound on", bm: "Bunyi dihidupkan" })}</label>
      <label class="rw-tg"><input type="checkbox" data-snd="music" ${sn.music ? "checked" : ""} ${sn.on ? "" : "disabled"}> ${t({ en: "Music", bm: "Muzik" })}</label>
      <label class="rw-tg"><input type="checkbox" data-snd="sfx" ${sn.sfx ? "checked" : ""} ${sn.on ? "" : "disabled"}> ${t({ en: "Sound effects", bm: "Kesan bunyi" })}</label>
      ${quietRoute() ? `<p class="rw-small">${t({ en: "Sound is muted on class and event screens.", bm: "Bunyi disenyapkan pada skrin kelas dan acara." })}</p>` : ""}
      <a class="rw-btn rw-shoplink" href="#/shop">🛍️ ${t({ en: "Town Shop", bm: "Kedai Bandar" })}</a>`;
  }
  const togglePop = open => {
    open = open ?? pop.hidden; pop.hidden = !open; hud.querySelector(".rw-main").setAttribute("aria-expanded", open);
    if (open) { paintPop(); sfx("click"); }
  };
  function mountHud() {
    const top = document.querySelector("header.top"); if (!top || top.querySelector(".rw-hud")) return;
    hud = document.createElement("div"); hud.className = "rw-hud";
    hud.innerHTML = `<button class="rw-main" aria-expanded="false" aria-controls="rwPop"><span class="rw-lv"></span><span class="rw-meter" aria-hidden="true"><span class="rw-fill"></span></span><span class="rw-coin" aria-hidden="true">🪙<span class="rw-c"></span></span></button>
      <button class="rw-snd" aria-pressed="false"></button><div class="rw-pop" id="rwPop" role="dialog" aria-label="Rewards" hidden></div>`;
    const seg = top.querySelector(".seg"); seg ? seg.after(hud) : top.appendChild(hud);
    pop = hud.querySelector(".rw-pop");
    hud.querySelector(".rw-main").onclick = () => togglePop();
    hud.querySelector(".rw-snd").onclick = () => { setSnd({ on: !snd().on }); sfx("click"); };
    pop.onchange = e => { const k = e.target.dataset.snd; if (k) { setSnd({ [k]: e.target.checked }); const n = pop.querySelector(`[data-snd="${k}"]`); if (n) n.focus(); } };
    document.addEventListener("click", e => { if (!pop.hidden && !hud.contains(e.target)) togglePop(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !pop.hidden) { togglePop(false); hud.querySelector(".rw-main").focus(); } });
    paintHud();
  }

  W.css("rw", `
.rw-hud{position:relative;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.rw-hud button{font-family:"Pixelify Sans",monospace;cursor:pointer;border:3px solid #1a1932;border-radius:0;box-shadow:3px 3px 0 rgba(26,25,50,.35);min-height:40px}
.rw-main{display:flex;align-items:center;gap:6px;background:#f9e6cf;color:#1a1932;padding:2px 8px;font-size:16px;position:relative}
.rw-lv{background:#1a1932;color:#ffeb57;min-width:24px;padding:0 4px;text-align:center;line-height:24px}
.rw-meter{display:block;width:56px;height:10px;border:2px solid #1a1932;background:#fff}
.rw-fill{display:block;height:100%;background:#5ac54f;transition:width .4s steps(6)}
.rw-coin{white-space:nowrap}
.rw-snd{background:#1a1932;color:#fff;width:42px;font-size:18px;padding:0}
.rw-hud button:focus-visible{outline:3px solid #0098dc;outline-offset:2px}
.rw-float{position:absolute;right:4px;top:-6px;font-family:"Pixelify Sans",monospace;color:#1e6f50;font-weight:700;animation:rwUp .9s steps(6) forwards;pointer-events:none}
@keyframes rwUp{to{transform:translateY(-18px);opacity:0}}
.rw-pop{position:absolute;right:0;top:calc(100% + 8px);z-index:60;width:min(300px,calc(100vw - 24px));background:#f9e6cf;border:3px solid #1a1932;box-shadow:4px 4px 0 rgba(26,25,50,.35);padding:12px;font-family:Nunito,sans-serif;font-size:16px;color:#1a1932;text-align:left}
.rw-ph{font-family:"Pixelify Sans",monospace;font-size:17px;margin:8px 0 4px}
.rw-ph:first-child{margin-top:0}
.rw-small{font-size:14px;margin:2px 0 6px}
.rw-dc{margin:2px 0}.rw-num{font-family:"Pixelify Sans",monospace}
.rw-tg{display:flex;gap:8px;align-items:center;min-height:32px}
.rw-tg input{width:20px;height:20px;accent-color:#1e6f50}
.rw-btn{display:inline-block;font-family:"Pixelify Sans",monospace;font-size:16px;background:#1a1932;color:#fff;border:3px solid #1a1932;border-radius:0;padding:8px 12px;cursor:pointer;text-decoration:none;box-shadow:3px 3px 0 rgba(26,25,50,.35)}
.rw-btn.rw-light{background:#f9e6cf;color:#1a1932}.rw-btn[aria-pressed=true]{background:#5ac54f;color:#1a1932}
.rw-btn:disabled{opacity:.5;cursor:not-allowed}
.rw-shoplink{margin-top:8px}
.rw-panel{background:#f9e6cf;border:3px solid #1a1932;box-shadow:4px 4px 0 rgba(26,25,50,.35);padding:12px;margin:12px 0}
.rw-big{font-family:"Pixelify Sans",monospace;font-size:24px}
.rw-h{font-family:"Pixelify Sans",monospace;margin:18px 0 8px}
.rw-grid{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.rw-item{background:#f9e6cf;border:3px solid #1a1932;box-shadow:4px 4px 0 rgba(26,25,50,.35);padding:10px;display:flex;flex-direction:column;gap:6px}
.rw-prev{height:72px;border:3px solid #1a1932;display:grid;place-items:center}
.rw-prev span{font-size:36px;filter:drop-shadow(2px 2px 0 rgba(26,25,50,.4))}
.rw-iname{font-family:"Pixelify Sans",monospace;font-size:17px}.rw-ist{font-size:14px;min-height:1em}
.rw-note{font-size:15px;margin-top:14px}
.rw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.rw-px{position:fixed;top:-12px;width:10px;height:10px;z-index:90;pointer-events:none;border:2px solid #1a1932;animation:rwFall linear forwards}
@keyframes rwFall{to{transform:translateY(105vh)}}
@media (max-width:420px){.rw-meter{width:40px}}
@media print{.rw-hud,.rw-px{display:none!important}}`);
  /* preview tile: colored sky above, green ground below (inline bg colour is the sky) */
  W.css("rw2", `.rw-prev{position:relative;overflow:hidden}.rw-prev::after{content:"";position:absolute;left:0;right:0;bottom:0;height:22%;background:#1e6f50;border-top:3px solid #1a1932}.rw-prev span{position:relative;z-index:1}`);

  /* ---------- hooks ---------- */
  W.on("answer", (ok, v) => { if (!ok) return; add(5, "answer"); dcTick("ans", v || ""); });
  W.on("finish", key => { add(20, "finish", "f:" + key); dcTick("fin", String(key)); });
  W.on("award", id => { add(50, "badge", "b:" + id); dcTick("badge", ""); });
  W.on("mission", id => { add(80, "mission", "m:" + id); dcTick("mission", ""); });
  W.on("scan", () => { add(10, "scan"); dcTick("scan", ""); });
  W.on("route", (v, args, relang) => {
    view = v; syncMusic();
    if (hud) { paintHud(); if (pop && !pop.hidden) relang ? paintPop() : togglePop(false); }
    if (relang) return;
    const seen = st.getJSON("rw-seen", {}), key = v === "lab" ? "lab/" + args[0] : v === "game" ? "game/" + args[0] : null;
    if (key && args[0]) { const fresh = !seen[key]; if (fresh) { seen[key] = 1; st.setJSON("rw-seen", seen); dcTick(v === "lab" ? "newlab" : "newgame", ""); } }
    dcTick("visit", v + (args[0] ? "/" + args[0] : ""));
  });
  document.addEventListener("visibilitychange", () => { if (!ac) return; document.hidden ? (stopMusic(), ac.suspend().catch(() => {})) : (ac.resume().catch(() => {}), syncMusic()); });
  // browsers only allow audio after a gesture: start music on first interaction if it is switched on
  document.addEventListener("pointerdown", () => syncMusic(), { once: true });

  W.rw = { xp, level: () => lvOf(xp()) + 1, title: () => LV[lvOf(xp())][1], coins, add, sfx, sfxOn, musicOn, deco, acc, DECO, ACC, LEVELS: LV };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountHud); else mountHud();
})();
