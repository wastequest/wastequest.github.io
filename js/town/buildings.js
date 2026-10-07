/* WasteQuest v2: section pages become town buildings.
   - On every route, inserts a building banner (WQ.townArt.banner when present) as the first child of #view.
   - Relabels the header nav links (data-b) with bilingual building names and highlights the current building.
   District states use the same badge rule as js/town/home.js (D table copied; keep in sync).
   SOURCES: no facts; names/badge lists copied from js/town/home.js. */
(() => {
  if (typeof WQ === "undefined") return;
  const D = {
    academy: { icon: "🏫", name: { en: "Academy", bm: "Akademi" }, badges: ["learn", "quiz", "cert-junior", "cert-champion", "cert-practitioner"] },
    recycle: { icon: "♻️", name: { en: "Recycling Plant", bm: "Loji Kitar Semula" }, badges: ["sort", "match", "myth", "wordsearch", "crossword"] },
    compost: { icon: "🌱", name: { en: "Compost Farm", bm: "Ladang Kompos" }, badges: ["compost", "enzyme", "ph", "lab-compost", "lab-enzyme", "lab-odour", "lab-watering", "lab-vgarden", "lab-hydro"] },
    maker: { icon: "🛠️", name: { en: "Maker Lab", bm: "Makmal Pereka" }, badges: ["lab-candle", "lab-petfood", "lab-treasure", "lab-litmus", "lab-ecobrick", "lab-bioplastic", "lab-fused", "lab-lifebuoy", "lab-sleepbag"] },
    market: { icon: "🏪", name: { en: "Market", bm: "Pasar" }, badges: ["cash", "footprint"] },
    arena: { icon: "🏟️", name: { en: "Arena", bm: "Arena" }, badges: ["class"] },
  };
  const T = {
    messy: { en: "Needs cleaning", bm: "Perlu dibersihkan" }, done: { en: "All clean", bm: "Bersih sepenuhnya" },
    lvl: { en: "Cleaning level", bm: "Tahap kebersihan" }, hint: { en: "Earn badges here to clean up this building.", bm: "Kumpul lencana di sini untuk membersihkan bangunan ini." },
  };
  const COMPOST_LABS = ["compost", "enzyme", "odour", "watering", "vgarden", "hydro"];
  const which = (view, a) => {
    if (view === "learn" || view === "cert") return "academy";
    if (view === "games") return "recycle";
    if (view === "game") return a[0] === "quiz" ? "academy" : ["compost", "enzyme", "ph"].includes(a[0]) ? "compost"
      : ["cash", "footprint"].includes(a[0]) ? "market" : WQ.games[a[0]] ? "recycle" : null;
    if (view === "labs") return "maker";
    if (view === "lab") return COMPOST_LABS.includes(a[0]) ? "compost" : "maker";
    if (view === "class") return "arena";  // #/event: no banner, big screen needs the space
    if (view === "scan") return "recycle";
    if (view === "shop") return "market";
    if (view === "missions" || view === "mission") return "academy";
    return null;
  };
  function state(id) {
    const m = /[?&]town=(0|1|2|3)\b/.exec(location.search);
    if (m) return +m[1];
    const e = WQ.earned(), b = D[id].badges, n = b.filter(x => e[x]).length;
    return n === 0 ? 0 : n >= b.length ? 3 : n >= b.length / 2 ? 2 : 1;
  }
  const t = WQ.t, esc = WQ.esc;

  function banner(view, args) {
    const el = document.getElementById("view"), id = which(view, args);
    if (!el || !id) return;
    const d = D[id], st = state(id);
    const mark = st === 0 ? `⚠ ${t(T.messy)}` : st === 3 ? `✓ ${t(T.done)}` : `${"★".repeat(st)}${"☆".repeat(3 - st)} ${t(T.lvl)} ${st}/3`;
    const box = document.createElement("div");
    box.className = "bld-banner bld-" + id;
    box.innerHTML = `<canvas width="400" height="120" aria-hidden="true"></canvas><div class="bld-txt"><b class="bld-name"><span aria-hidden="true">${d.icon}</span> ${esc(t(d.name))}</b><span class="bld-st">${esc(mark)}</span>${st < 3 ? `<span class="bld-hint">${esc(t(T.hint))}</span>` : ""}</div>`;
    const A = WQ.townArt;
    if (A && typeof A.banner === "function") { try { A.banner(box.querySelector("canvas"), id, st); } catch (e) { console.warn("townArt.banner", e); box.querySelector("canvas").remove(); } }
    else box.querySelector("canvas").remove();
    el.prepend(box);
  }

  function nav(view, args) {
    const cur = which(view, args);
    WQ.$$(".navlinks a[data-b]").forEach(a => {
      const d = D[a.dataset.b], lab = a.querySelector(".nl");
      if (lab) lab.textContent = t(d.name);
      a.classList.toggle("on", a.dataset.b === cur);
      if (a.dataset.b === cur) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const nv = WQ.$(".navlinks"), on = nv && WQ.$("a.on", nv);
    if (on && nv.scrollWidth > nv.clientWidth) nv.scrollLeft = on.offsetLeft - nv.offsetLeft - 8;
    WQ.$$(".navlinks a[data-s]").forEach(a => { const on = a.classList.contains("on"); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  }

  WQ.on("route", (view, args) => { banner(view, args || []); nav(view, args || []); });
})();
