/* Eco Quiz Blast — Kahoot-style solo quiz on the shared question bank (WQ.questions).
   Setup (track / topic / length) → 20 s timed questions with speed points + streak bonus → results and review. */
(() => {
const COLORS = ["#e21b3c", "#1368ce", "#b7791f", "#26890c"], SHAPES = ["▲", "◆", "●", "■"], LIMIT = 20;
WQ.quizUI = { tileColors: COLORS, shapes: SHAPES };
const T = {
 en:{track:"Who is playing?",topic:"Topic",all:"All topics",len:"Questions",start:"Start quiz ▶",best:"Best score",
  only:n=>`Only ${n} questions in this topic for this level, so the quiz will use all ${n}.`,
  badgeHint:"Score 80% or more on at least 10 questions to earn the Quiz Whiz badge.",
  q:"Question",pts:"points",streak:"streak",right:["Correct!","Brilliant!","Spot on!","Yes!"],wrong:"Not quite.",timeout:"Time’s up!",
  ans:"Answer:",bonus:n=>`+${n} streak bonus 🔥`,next:"Next ▶",results:"See results ▶",secs:"seconds left",
  endT:"Quiz complete!",acc:"Accuracy",score:"Score",bestStreak:"Best streak",newBest:"New best score!",
  review:"Review the ones you missed",perfect:"Perfect! You got every question right. 🎉",yours:"Your answer",none:"No answer (time ran out)",correct:"Correct answer",
  again:"Play again",change:"Change settings",games:"All games",keys:"Tip: press 1–4 to answer."},
 bm:{track:"Siapa yang bermain?",topic:"Topik",all:"Semua topik",len:"Soalan",start:"Mula kuiz ▶",best:"Skor terbaik",
  only:n=>`Hanya ${n} soalan dalam topik ini untuk tahap ini, jadi kuiz akan menggunakan kesemua ${n}.`,
  badgeHint:"Dapatkan 80% atau lebih bagi sekurang-kurangnya 10 soalan untuk lencana Pakar Kuiz.",
  q:"Soalan",pts:"mata",streak:"berturut",right:["Betul!","Hebat!","Tepat sekali!","Ya!"],wrong:"Belum tepat.",timeout:"Masa tamat!",
  ans:"Jawapan:",bonus:n=>`+${n} bonus berturut-turut 🔥`,next:"Seterusnya ▶",results:"Lihat keputusan ▶",secs:"saat lagi",
  endT:"Kuiz tamat!",acc:"Ketepatan",score:"Skor",bestStreak:"Rentetan terbaik",newBest:"Skor terbaik baharu!",
  review:"Semak soalan yang tersilap",perfect:"Sempurna! Anda menjawab semua soalan dengan betul. 🎉",yours:"Jawapan anda",none:"Tiada jawapan (masa tamat)",correct:"Jawapan betul",
  again:"Main lagi",change:"Tukar tetapan",games:"Semua permainan",keys:"Petua: tekan 1–4 untuk menjawab."}
};
const TRACK_ICON = { kids: "🧒", teens: "🧑‍🎓", adults: "🧑‍💼" };
const defTrack = () => WQ.aud === "teacher" ? "adults" : (["kids","teens","adults"].includes(WQ.aud) ? WQ.aud : "kids");
const topicName = id => WQ.questionTopics?.[id] || { en: id, bm: id };

// game state (module-level so a language switch re-renders without resetting)
let ph = "setup", cfg = { track: null, topic: "all", len: 10 }, deck = [], idx = 0, score = 0, streak = 0, topStreak = 0,
    right = 0, log = [], chosen = null, gain = 0, bonus = 0, deadline = 0, isNewBest = false;

WQ.css("quiz", `
.qz-set{max-width:760px;margin:0 auto}
.qz-set h3{margin:14px 0 8px}
.qz-opts{display:flex;flex-wrap:wrap;gap:8px}
.qz-opts button{background:#fff;border:3px solid var(--line);border-radius:999px;padding:8px 16px;font-weight:800}
.qz-opts button[aria-pressed=true]{border-color:var(--grass);background:#eafbe4}
.qz-set select{width:100%;max-width:420px;padding:10px 12px;border-radius:14px;border:3px solid var(--line);background:#fff;font-weight:700}
.qz-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 12px}
.qz-qcard{display:flex;gap:16px;align-items:center;justify-content:space-between}
.qz-q{font-family:"Baloo 2";font-weight:800;font-size:clamp(1.3rem,3.2vw,2rem);line-height:1.2;margin:4px 0 0}
.qz-ring{flex:none;position:relative;width:76px;height:76px}
.qz-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.qz-ring circle{fill:none;stroke-width:8}
.qz-ring .bg{stroke:#e8eef4}.qz-ring .fg{stroke:var(--grass);stroke-linecap:round;transition:stroke-dashoffset .1s linear}
.qz-ring.low .fg{stroke:var(--red)}
.qz-ring b{position:absolute;inset:0;display:grid;place-items:center;font-family:"Baloo 2";font-size:1.6rem}
.qz-tiles{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
.qz-tile{display:flex;align-items:center;gap:12px;min-height:84px;border-radius:16px;padding:12px 16px;color:#fff;font-weight:800;font-size:clamp(1rem,2vw,1.2rem);text-align:left;box-shadow:inset 0 -6px 0 rgba(0,0,0,.18);transition:transform .1s,opacity .2s}
.qz-tile:hover:not([disabled]){transform:translateY(-2px)}
.qz-tile .sh{flex:none;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.22);display:grid;place-items:center;font-size:1.2rem}
.qz-tile .mk{margin-left:auto;font-size:1.5rem}
.qz-tile[disabled]{cursor:default}
.qz-tile.dim{opacity:.35}
.qz-tile.ok{outline:5px solid var(--gold);outline-offset:2px}
.qz-fb{margin-top:14px}
.qz-fb .row{justify-content:space-between}
.qz-fb h3{font-size:1.4rem}
.qz-end{max-width:760px;margin:0 auto;text-align:center}
.qz-big{font-family:"Baloo 2";font-weight:800;font-size:3rem;line-height:1}
.qz-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}
.qz-stats div{background:var(--soft);border-radius:16px;padding:10px}
.qz-stats b{display:block;font-family:"Baloo 2";font-size:1.6rem}
.qz-rev{text-align:left;margin-top:16px}
.qz-rev li{margin:0 0 12px}
@media (max-width:600px){.qz-tiles{grid-template-columns:1fr}.qz-tile{min-height:64px}.qz-ring{width:62px;height:62px}.qz-stats b{font-size:1.25rem}}
`);

WQ.registerGame("quiz", { order: 6, kind: "game", icon: "⚡", ages: "7+",
  title: { en: "Eco Quiz Blast", bm: "Kuiz Kilat Eko" },
  desc: { en: "Beat the 20-second clock! Fast answers score more points.", bm: "Kalahkan jam 20 saat! Jawapan pantas dapat lebih mata." },
  badge: { icon: "🧠", name: { en: "Quiz Whiz", bm: "Pakar Kuiz" }, desc: { en: "80% or more in Eco Quiz Blast", bm: "80% atau lebih dalam Kuiz Kilat Eko" } },
  mount(el, { relang }) {
    const L = () => T[WQ.lang], $ = s => el.querySelector(s);
    let tick = null;
    if (!cfg.track) cfg.track = defTrack();
    if (!relang && ph === "play") ph = "setup";      // leaving mid-quiz abandons it (the clock cannot pause fairly)
    const pool = (track, topic) => WQ.questions.filter(q => q.tracks.includes(track) && (topic === "all" || q.topic === topic));

    el.innerHTML = WQ.head("⚡", this.title, this.desc) + `<div id="qzBody"></div>`;
    const body = $("#qzBody");

    function setup() {
      const l = L(), counts = {};
      pool(cfg.track, "all").forEach(q => counts[q.topic] = (counts[q.topic] || 0) + 1);
      if (cfg.topic !== "all" && !counts[cfg.topic]) cfg.topic = "all";
      const n = pool(cfg.track, cfg.topic).length;
      body.innerHTML = `<div class="card qz-set">
        <h3>${l.track}</h3><div class="qz-opts" role="group" aria-label="${WQ.esc(l.track)}">${["kids","teens","adults"].map(t =>
          `<button data-t="${t}" aria-pressed="${cfg.track === t}">${TRACK_ICON[t]} ${WQ.esc(WQ.t(WQ.S.aud[t]))}</button>`).join("")}</div>
        <h3><label for="qzTopic">${l.topic}</label></h3><select id="qzTopic"><option value="all">${l.all} (${pool(cfg.track, "all").length})</option>${
          Object.keys(counts).map(id => `<option value="${id}" ${cfg.topic === id ? "selected" : ""}>${WQ.esc(WQ.t(topicName(id)))} (${counts[id]})</option>`).join("")}</select>
        <h3>${l.len}</h3><div class="qz-opts" role="group" aria-label="${WQ.esc(l.len)}">${[10, 15, 20].map(k =>
          `<button data-n="${k}" aria-pressed="${cfg.len === k}">${k}</button>`).join("")}</div>
        ${n < cfg.len ? `<p class="note warn small" style="margin-top:12px">${l.only(n)}</p>` : ""}
        <p class="small muted" style="margin-top:12px">🧠 ${l.badgeHint} · ${l.best}: <b>${WQ.best("quiz-" + cfg.track)}</b></p>
        <div class="row" style="margin-top:12px"><button class="btn" id="qzGo">${l.start}</button><span class="small muted">${l.keys}</span></div></div>`;
      body.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { cfg.track = b.dataset.t; setup(); });
      body.querySelectorAll("[data-n]").forEach(b => b.onclick = () => { cfg.len = +b.dataset.n; setup(); });
      $("#qzTopic").onchange = e => { cfg.topic = e.target.value; setup(); };
      $("#qzGo").onclick = start;
    }

    function start() {
      deck = WQ.shuffle(pool(cfg.track, cfg.topic)).slice(0, cfg.len).map(q => ({ q, order: q.a.length > 2 ? WQ.shuffle(q.a.map((_, i) => i)) : q.a.map((_, i) => i) }));
      idx = score = streak = topStreak = right = 0; log = []; isNewBest = false;
      ph = "play"; ask();
    }
    function ask() { chosen = null; gain = bonus = 0; deadline = Date.now() + LIMIT * 1000; play(); }

    function play() {
      const l = L(), d = deck[idx], q = d.q, C = 2 * Math.PI * 32, shown = chosen !== null, correctTile = d.order.indexOf(q.c);
      body.innerHTML = `<div class="qz-bar"><span class="pill">${l.q} ${idx + 1}/${deck.length}</span><span class="tag">${WQ.esc(WQ.t(topicName(q.topic)))}</span>
        <span class="spacer" style="flex:1"></span><span class="pill">⭐ ${score}</span><span class="pill" title="${l.streak}">🔥 ${streak}</span></div>
        <div class="card qz-qcard"><p class="qz-q" id="qzQ">${WQ.esc(WQ.t(q.q))}</p>
        <div class="qz-ring" id="qzRing" role="timer" aria-label="${l.secs}"><svg viewBox="0 0 76 76"><circle class="bg" cx="38" cy="38" r="32"/><circle class="fg" id="qzArc" cx="38" cy="38" r="32" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><b id="qzSec">${LIMIT}</b></div></div>
        <div class="qz-tiles" role="group" aria-labelledby="qzQ">${d.order.map((ai, i) => {
          const cls = !shown ? "" : i === correctTile ? "ok" : i === chosen ? "" : "dim";
          const mk = !shown ? "" : i === correctTile ? "✔" : i === chosen ? "✖" : "";
          return `<button class="qz-tile ${cls}" data-i="${i}" style="background:${COLORS[i]}" ${shown ? "disabled" : ""} aria-label="${i + 1}. ${WQ.esc(WQ.t(q.a[ai]))}"><span class="sh" aria-hidden="true">${SHAPES[i]}</span><span>${WQ.esc(WQ.t(q.a[ai]))}</span><span class="mk" aria-hidden="true">${mk}</span></button>`;
        }).join("")}</div>
        <div id="qzFb" class="qz-fb" aria-live="polite"></div>`;
      body.querySelectorAll(".qz-tile").forEach(b => b.onclick = () => answer(+b.dataset.i));
      if (shown) return reveal();
      const arc = $("#qzArc"), sec = $("#qzSec"), ring = $("#qzRing");
      clearInterval(tick);
      const upd = () => {
        if (!el.isConnected) return clearInterval(tick);
        const left = Math.max(0, deadline - Date.now()) / 1000;
        arc.setAttribute("stroke-dashoffset", C * (1 - left / LIMIT)); sec.textContent = Math.ceil(left); ring.classList.toggle("low", left <= 5);
        if (left <= 0) answer(-1);
      };
      upd(); tick = setInterval(upd, 100);
    }

    function answer(i) {
      if (ph !== "play" || chosen !== null) return;
      clearInterval(tick);
      const d = deck[idx], ok = i >= 0 && d.order[i] === d.q.c, left = Math.max(0, deadline - Date.now()) / 1000;
      chosen = i;
      if (ok) { right++; streak++; topStreak = Math.max(topStreak, streak); gain = Math.round(500 + 500 * left / LIMIT); bonus = Math.min(streak - 1, 5) * 100; score += gain + bonus; }
      else streak = 0;
      log.push({ q: d.q, pick: i >= 0 ? d.order[i] : -1, ok });
      WQ.beep(ok);
      play();
    }

    function reveal() {
      const l = L(), d = deck[idx], ok = chosen >= 0 && d.order[chosen] === d.q.c, last = idx >= deck.length - 1, fb = $("#qzFb");
      const head = ok ? l.right[idx % l.right.length] + ` +${gain} ${l.pts}` : chosen < 0 ? l.timeout : l.wrong;
      fb.innerHTML = `<div class="note ${ok ? "ok" : "danger"}"><div class="row"><h3>${ok ? "✅" : chosen < 0 ? "⏰" : "❌"} ${head}</h3>${ok && bonus ? `<span class="tag go">${l.bonus(bonus)}</span>` : ""}</div>
        ${ok ? "" : `<p><b>${l.ans}</b> ${WQ.esc(WQ.t(d.q.a[d.q.c]))}</p>`}<p>💡 ${WQ.esc(WQ.t(d.q.why))}</p>
        <div class="row" style="justify-content:flex-end"><button class="btn ${last ? "blue" : ""}" id="qzNext">${last ? l.results : l.next}</button></div></div>`;
      $("#qzRing").hidden = true;
      if (!ok) WQ.anim($("#qzQ").parentNode, "shake");
      const nx = $("#qzNext"); nx.focus({ preventScroll: true });
      nx.onclick = () => { if (last) finish(); else { idx++; ask(); } };
    }

    function finish() {
      ph = "end";
      const prev = WQ.best("quiz-" + cfg.track);
      WQ.best("quiz-" + cfg.track, score); isNewBest = score > prev;
      if (deck.length >= 10 && right / deck.length >= 0.8) WQ.award("quiz");
      end();
    }

    function end() {
      const l = L(), n = deck.length, pct = n ? Math.round(right / n * 100) : 0, missed = log.filter(r => !r.ok);
      body.innerHTML = `<div class="card qz-end"><h2>${l.endT}</h2><div class="qz-big" aria-label="${l.score}">⭐ ${score}</div>
        ${isNewBest ? `<p><span class="tag go">🏆 ${l.newBest}</span></p>` : ""}
        <div class="qz-stats"><div>${l.acc}<b>${right}/${n} · ${pct}%</b></div><div>${l.bestStreak}<b>🔥 ${topStreak}</b></div><div>${l.best}<b>${WQ.best("quiz-" + cfg.track)}</b></div></div>
        <div class="meter" aria-hidden="true"><i style="width:${pct}%"></i></div>
        ${n >= 10 && pct >= 80 ? `<p class="note ok" style="margin-top:12px">🧠 ${WQ.esc(WQ.t(WQ.badges.quiz.name))}!</p>` : `<p class="small muted" style="margin-top:12px">${l.badgeHint}</p>`}
        <div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="qzA">${l.again}</button><button class="btn blue" id="qzS">${l.change}</button><a class="btn alt" href="#/games">${l.games}</a></div>
        <div class="qz-rev">${missed.length ? `<h3>${l.review} (${missed.length})</h3><ol>${missed.map(r => `<li><b>${WQ.esc(WQ.t(r.q.q))}</b><br>
          <span class="tag red">${l.yours}</span> ${r.pick < 0 ? l.none : WQ.esc(WQ.t(r.q.a[r.pick]))}<br>
          <span class="tag go">${l.correct}</span> ${WQ.esc(WQ.t(r.q.a[r.q.c]))}<br><span class="small muted">💡 ${WQ.esc(WQ.t(r.q.why))}</span></li>`).join("")}</ol>`
          : `<p class="note ok">${l.perfect}</p>`}</div></div>`;
      $("#qzA").onclick = start;
      $("#qzS").onclick = () => { ph = "setup"; setup(); };
    }

    const key = e => {
      if (ph !== "play" || chosen !== null || e.target.closest?.("input,select,textarea")) return;
      const n = +e.key; if (n >= 1 && n <= deck[idx].order.length) answer(n - 1);
    };
    document.addEventListener("keydown", key);
    if (ph === "play") play(); else if (ph === "end") end(); else setup();
    return () => { clearInterval(tick); document.removeEventListener("keydown", key); };
  } });
})();
