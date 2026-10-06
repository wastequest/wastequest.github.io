/* Compost Master: build a compost bin, set water and turning, then simulate 8 weeks day by day.
   The model is a teaching model (not a research model): rate = k * substrate * f(C:N) * f(moisture) * f(O2) * f(T);
   heat raises temperature, heat loss pulls it back to ambient (30 °C, Malaysian outdoor average), turning restores oxygen.
// SOURCES:
//  - C:N, %N (dry basis) and moisture of ingredients: Rynk R. et al. (1992) On-Farm Composting Handbook, NRAES-54, Appendix A
//    (grass clippings C:N 9–25, leaves 40–80, sawdust 200–750, newsprint 398–852, corrugated cardboard ~560, fruit wastes 20–49),
//    and Cornell Waste Management Institute, "Science and Engineering of Composting" C/N table (vegetable produce 19, fruit wastes 35,
//    coffee grounds 20). The single values used below are typical mid-range values, rounded.
//  - Recommended conditions (C:N 20–40, preferred 25–30; moisture 40–65%, preferred 50–60%; O2 > 5%; preferred 54–60 °C):
//    Rynk et al. 1992, Table 2.1.
//  - Pathogen reduction: US EPA 40 CFR Part 503 (PFRP): ≥55 °C for 3 days (aerated static pile / in-vessel),
//    or ≥55 °C for 15 days with at least 5 turnings (windrow).
*/
(() => {
const tx = o => WQ.t(o), adv = () => WQ.aud !== "kids";
const PAIL = 2; // kg per tap ("one pail")
// id, emoji, green?, en, bm, moisture (wet basis), N % (dry), C:N, degradable fraction of dry matter (teaching estimate: lignin-rich = low)
const ING = [
 ["veg","🥬",1,"Vegetable scraps","Sisa sayur",0.85,2.5,19,0.75],
 ["fruit","🍌",1,"Fruit peels","Kulit buah",0.80,1.4,35,0.75],
 ["grass","🌿",1,"Grass clippings","Keratan rumput",0.80,2.4,17,0.65],
 ["coffee","☕",1,"Coffee grounds","Hampas kopi",0.60,2.3,20,0.55],
 ["leaves","🍂",0,"Dry leaves","Daun kering",0.15,0.9,55,0.45],
 ["card","📦",0,"Cardboard (torn)","Kadbod (dikoyak)",0.08,0.13,350,0.55],
 ["saw","🪵",0,"Sawdust","Habuk kayu",0.15,0.11,440,0.25],
 ["paper","📰",0,"Newspaper (shredded)","Surat khabar (dicarik)",0.08,0.09,500,0.40]
].map(([id,e,g,en,bm,mo,N,cn,deg])=>({id,e,g,name:{en,bm},mo,N,C:N*cn,cn,deg}));
const TURN = [[0,{en:"Never",bm:"Tidak pernah"}],[14,{en:"Every 2 weeks",bm:"Setiap 2 minggu"}],[7,{en:"Every week",bm:"Setiap minggu"}],[3,{en:"Every 3 days",bm:"Setiap 3 hari"}]];
const TA = 30, DAYS = 56, CAP = 30; // ambient °C, days simulated, max pails

let mix = {}, water = 0, turn = 7, res = null, shown = 0, timer = null;

function stats() {
  let wet = 0, dry = 0, C = 0, N = 0, h2o = water, S0 = 0, browns = 0;
  ING.forEach(i => { const kg = (mix[i.id] || 0) * PAIL, d = kg * (1 - i.mo); wet += kg; dry += d; h2o += kg * i.mo; C += d * i.C / 100; N += d * i.N / 100; S0 += d * i.deg; if (!i.g) browns += kg; });
  return { wet, dry, C, N, cn: N ? C / N : 0, m: wet ? h2o / (wet + water) : 0, h2o, S0, brownFrac: wet ? browns / wet : 0 };
}

function simulate() {
  const s = stats(), fMass = Math.min(1, s.wet / 40);
  let T = TA, S = s.S0, W = s.h2o, D = s.dry, O2 = 1, anaer = 0, wetDays = 0, maxT = TA, d55 = 0;
  const fCN = s.cn <= 35 ? 1 : Math.pow(35 / s.cn, 2), days = [];
  for (let d = 1; d <= DAYS; d++) {
    const turned = turn && d % turn === 0;
    if (turned) { O2 = 1; T -= 2.5; W *= 0.97; }
    const m = W / (W + D);
    const fM = m < 0.3 ? 0.1 : m < 0.4 ? 0.1 + 9 * (m - 0.3) : m <= 0.6 ? 1 : Math.max(0.5, 1 - 4 * (m - 0.6));
    const poro = (0.02 + 0.05 * Math.min(1, s.brownFrac / 0.5)) * (m > 0.6 ? Math.max(0.15, 1 - 6 * (m - 0.6)) : 1);
    const g = T <= 60 ? 0.35 + 0.65 * Math.max(0, T - 25) / 35 : Math.max(0.05, 1 - (T - 60) / 12);
    const fO2 = Math.min(1, O2 / 0.4);
    const pot = 0.12 * (S / s.S0) * fCN * fM * g;           // potential aerobic rate (fraction of S0 per day)
    const ra = pot * fO2, rn = pot * (1 - fO2) * 0.2;       // aerobic + slower anaerobic decay
    S -= 0.45 * (ra + rn) * s.S0; D -= 0.45 * (ra + rn) * s.S0;
    T += 105 * ra * fMass + 8 * rn - 0.15 * (T - TA);
    O2 = Math.max(0, Math.min(1, O2 + poro * (1 - O2) - 3 * ra));
    W *= 1 - (0.002 + 0.0006 * Math.max(0, T - TA));
    if (O2 < 0.15) anaer++; if (m > 0.65) wetDays++; if (T >= 55) d55++;
    maxT = Math.max(maxT, T);
    days.push({ d, T, O2, m, done: 1 - S / s.S0, turned });
  }
  const done = 1 - S / s.S0, first = days.findIndex(p => p.T >= 45), last = days.map(p => p.T >= 45).lastIndexOf(true);
  days.forEach((p, i) => p.ph = first < 0 || i < first ? "me" : i <= last ? "th" : p.T > 37 ? "co" : "cu");
  let out = "good";
  if (s.m > 0.66 || wetDays > 20) out = "wet";
  else if (anaer >= 18) out = "smelly";
  else if (done < 0.5 || s.cn > 45) out = s.m < 0.38 ? "dry" : "slow";
  else if (s.cn < 20) out = "ammonia";
  return { days, out, cn: s.cn, m0: s.m, maxT, d55, done, anaer, wet: s.wet };
}

const OUT = {
 good:{i:"🌟",c:"ok",t:{en:"Rich, crumbly compost!",bm:"Kompos subur dan rapuh!"},d:{en:"Dark brown, smells like forest soil. Your microbes had the right food, water and air.",bm:"Perang gelap, berbau seperti tanah hutan. Mikrob anda mendapat makanan, air dan udara yang betul."}},
 smelly:{i:"🤢",c:"danger",t:{en:"Smelly, anaerobic pile",bm:"Longgokan busuk (anaerobik)"},d:{en:"Oxygen ran out, so microbes that live without air took over. They make rotten-egg and sour smells (hydrogen sulfide, organic acids) and work slowly.",bm:"Oksigen habis, jadi mikrob yang hidup tanpa udara mengambil alih. Mereka menghasilkan bau telur busuk dan masam (hidrogen sulfida, asid organik) dan bekerja perlahan."}},
 wet:{i:"💦",c:"danger",t:{en:"Too wet: soggy and slimy",bm:"Terlalu basah: lembik dan berlendir"},d:{en:"Water filled the air spaces, so air could not get in. The pile turned slimy and smelly.",bm:"Air memenuhi ruang udara, jadi udara tidak dapat masuk. Longgokan menjadi berlendir dan berbau."}},
 dry:{i:"🏜️",c:"warn",t:{en:"Too dry: almost nothing happened",bm:"Terlalu kering: hampir tiada perubahan"},d:{en:"Microbes need water to live and move. Below about 40% moisture they slow right down.",bm:"Mikrob perlukan air untuk hidup dan bergerak. Di bawah kira-kira 40% kelembapan, mereka menjadi sangat perlahan."}},
 slow:{i:"🐌",c:"warn",t:{en:"Too slow: still mostly raw",bm:"Terlalu perlahan: masih banyak bahan mentah"},d:{en:"Too many browns and too little nitrogen, so the microbes are starving for protein. It will take many months.",bm:"Terlalu banyak bahan perang dan terlalu sedikit nitrogen, jadi mikrob kekurangan protein. Ia akan mengambil masa berbulan-bulan."}},
 ammonia:{i:"😷",c:"warn",t:{en:"Compost, but it smelled of ammonia",bm:"Jadi kompos, tetapi berbau ammonia"},d:{en:"Too many greens: extra nitrogen escaped as ammonia gas. That smell is lost fertiliser. Add more browns next time.",bm:"Terlalu banyak bahan hijau: nitrogen berlebihan terlepas sebagai gas ammonia. Bau itu ialah baja yang hilang. Tambah lebih banyak bahan perang lain kali."}}
};
const PH = {me:{c:"#f6d58b",t:{en:"Mesophilic",bm:"Mesofilik"}},th:{c:"#f4a08a",t:{en:"Thermophilic",bm:"Termofilik"}},co:{c:"#a9d2f0",t:{en:"Cooling",bm:"Penyejukan"}},cu:{c:"#b9dfa7",t:{en:"Curing",bm:"Pematangan"}}};

function tips(s) {
  const t = [];
  if (s.wet < 10) t.push({en:"Add at least 5 pails. Small piles lose heat too fast.",bm:"Tambah sekurang-kurangnya 5 baldi. Longgokan kecil cepat hilang haba."});
  else if (s.wet < 40) t.push({en:"Tip: a fuller bin (20+ pails) holds heat better and gets hotter.",bm:"Tip: tong yang lebih penuh (20+ baldi) lebih memerangkap haba dan menjadi lebih panas."});
  if (s.wet >= 10) {
    if (s.cn < 20) t.push({en:"Too many greens! Add browns (dry leaves, cardboard) or it will smell of ammonia.",bm:"Terlalu banyak bahan hijau! Tambah bahan perang (daun kering, kadbod) atau ia akan berbau ammonia."});
    else if (s.cn > 40) t.push({en:"Too many browns! Add greens (food scraps, grass, coffee grounds) to feed the microbes.",bm:"Terlalu banyak bahan perang! Tambah bahan hijau (sisa makanan, rumput, hampas kopi) untuk memberi makan mikrob."});
    else t.push({en:"Nice balance of greens and browns!",bm:"Imbangan bahan hijau dan perang yang bagus!"});
    if (s.m < 0.4) t.push({en:"Too dry. Add water until it feels like a wrung-out sponge.",bm:"Terlalu kering. Tambah air sehingga terasa seperti span yang diperah."});
    else if (s.m > 0.66) t.push({en:"Too wet. Add dry browns instead of water.",bm:"Terlalu basah. Tambah bahan perang kering, bukan air."});
    else if (s.m > 0.6) t.push({en:"A little wet. A handful of dry browns would help.",bm:"Agak basah. Segenggam bahan perang kering akan membantu."});
    else t.push({en:"Moisture is just right: like a wrung-out sponge.",bm:"Kelembapan tepat: seperti span yang diperah."});
    if (!turn) t.push({en:"Never turning? Oxygen will run out. Try turning every week.",bm:"Tidak pernah menggaul? Oksigen akan habis. Cuba gaul setiap minggu."});
  }
  return t;
}

WQ.css("compost", `
.cm-wrap{display:grid;gap:16px;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}
@media (max-width:760px){.cm-wrap{grid-template-columns:1fr}}
.cm-ings{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(132px,1fr))}
.cm-ing{position:relative;display:flex;align-items:center;gap:8px;background:#fff;border:3px solid var(--line);border-radius:16px;padding:8px 10px;font-weight:800;text-align:left;touch-action:none;user-select:none;min-height:56px;line-height:1.15}
.cm-ing.g{border-color:#9fd98f}.cm-ing.b{border-color:#d9b88f}
.cm-ing .e{font-size:1.7rem}.cm-ing .n{font-size:.9rem;flex:1}
.cm-ing .c{position:absolute;top:-8px;right:-6px;background:var(--ink);color:#fff;border-radius:999px;font-size:.75rem;padding:1px 7px}
.cm-ghost{position:fixed;z-index:70;font-size:2.4rem;pointer-events:none;transform:translate(-50%,-50%)}
.cm-bin{position:relative;text-align:center}
.cm-bin svg{width:100%;max-width:320px;height:auto}
.cm-bin.hover svg{transform:scale(1.04)}
.cm-meter{position:relative;height:16px;border-radius:999px;background:linear-gradient(90deg,#f2c14e 0,#f2c14e var(--a),#7bd36a var(--a),#7bd36a var(--b),#5aa8e6 var(--b))}
.cm-meter i{position:absolute;top:-5px;width:6px;height:26px;border-radius:3px;background:var(--ink);transform:translateX(-50%)}
.cm-lbl{display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);font-weight:700}
.cm-ctl label{font-weight:800;display:block;margin-top:10px}
.cm-ctl input[type=range]{width:100%;accent-color:var(--blue)}
.cm-seg{display:flex;flex-wrap:wrap;gap:6px}.cm-seg button{background:#fff;border:3px solid var(--line);border-radius:999px;padding:6px 12px;font-weight:800}
.cm-seg button[aria-pressed=true]{border-color:var(--blue);background:#eaf2ff}
.cm-chart svg{width:100%;height:auto;display:block}
.cm-leg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.85rem;font-weight:700}.cm-leg span:before{content:"";display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;background:var(--c);vertical-align:-1px}
.cm-kiki{display:flex;gap:12px;align-items:flex-start}.cm-kiki svg{width:62px;flex:none}
.cm-kiki ul{margin:0;padding-left:18px}
.cm-out{font-size:1.05rem}.cm-out .big{font-size:2.6rem;line-height:1}
@keyframes cmSteam{0%{opacity:0;transform:translateY(6px)}40%{opacity:.8}100%{opacity:0;transform:translateY(-16px)}}
.cm-steam{animation:cmSteam 1.8s ease-in-out infinite}
`);

WQ.registerGame("compost", { order: 11, kind: "sim", icon: "🌱", ages: "7+",
  title: {en:"Compost Master",bm:"Pakar Kompos"},
  desc: {en:"Build a compost bin, balance greens and browns, and simulate 8 weeks of hot composting.",bm:"Bina tong kompos, seimbangkan bahan hijau dan perang, dan simulasikan 8 minggu pengkomposan panas."},
  badge: {icon:"🌱",name:{en:"Compost Master",bm:"Pakar Kompos"},desc:{en:"Made rich compost in the simulator",bm:"Menghasilkan kompos subur dalam simulasi"}},
  sim: simulate, _set(m, w, t) { mix = m; water = w; turn = t; },  // used by the Node self-check only
  mount(el) {
    const $ = s => el.querySelector(s);
    if (timer) { clearInterval(timer); timer = null; }
    el.innerHTML = WQ.head("🌱", this.title, this.desc) + `
      <div class="cm-wrap">
        <div class="card stack">
          <h2>1. ${tx({en:"Fill your bin",bm:"Isi tong anda"})}</h2>
          <p class="small muted">${tx({en:`Tap or drag. One tap = one pail (about ${PAIL} kg).`,bm:`Tekan atau seret. Satu tekan = satu baldi (kira-kira ${PAIL} kg).`})}</p>
          <h3 class="small">🟩 ${tx({en:"Greens (nitrogen-rich)",bm:"Bahan hijau (kaya nitrogen)"})}</h3><div class="cm-ings" id="cmG"></div>
          <h3 class="small">🟫 ${tx({en:"Browns (carbon-rich)",bm:"Bahan perang (kaya karbon)"})}</h3><div class="cm-ings" id="cmB"></div>
          <div class="note warn small">🍗🧀 ${tx({en:"No meat, fish, bones, dairy or oily food in a home compost bin: they smell, attract rats, flies and stray animals, and can carry germs (such as Salmonella) that a small home pile may not get hot enough to kill. Bokashi can handle them (see below).",bm:"Jangan masukkan daging, ikan, tulang, tenusu atau makanan berminyak ke dalam tong kompos rumah: ia berbau, menarik tikus, lalat dan haiwan liar, serta boleh membawa kuman (seperti Salmonella) yang mungkin tidak terbunuh kerana longgokan kecil di rumah tidak cukup panas. Bokashi boleh mengendalikannya (lihat di bawah)."})}</div>
        </div>
        <div class="card stack cm-ctl">
          <div class="cm-bin" id="cmBin"></div>
          <div id="cmGauges"></div>
          <label for="cmW">💧 ${tx({en:"Water added",bm:"Air ditambah"})}: <span id="cmWv"></span> L</label>
          <input type="range" id="cmW" min="0" max="30" step="1">
          <label>🔄 ${tx({en:"Turn the pile",bm:"Gaul longgokan"})}</label>
          <div class="cm-seg" id="cmT" role="group" aria-label="${WQ.esc(tx({en:"Turning frequency",bm:"Kekerapan menggaul"}))}"></div>
          <div class="row"><button class="btn" id="cmGo">▶ ${tx({en:"Simulate 8 weeks",bm:"Simulasi 8 minggu"})}</button><button class="btn alt" id="cmClr">🗑️ ${tx({en:"Empty bin",bm:"Kosongkan tong"})}</button></div>
        </div>
      </div>
      <div class="card cm-kiki" id="cmKiki" aria-live="polite"></div>
      <div class="card stack" id="cmRes" hidden></div>
      <div id="cmAdv"></div>`;
    const ingBtn = i => `<button class="cm-ing ${i.g ? "g" : "b"}" data-ing="${i.id}"><span class="e" aria-hidden="true">${i.e}</span><span class="n">${tx(i.name)}</span><span class="c" id="cmc-${i.id}"></span></button>`;
    $("#cmG").innerHTML = ING.filter(i => i.g).map(ingBtn).join("");
    $("#cmB").innerHTML = ING.filter(i => !i.g).map(ingBtn).join("");
    $("#cmT").innerHTML = TURN.map(([v, n]) => `<button data-t="${v}">${tx(n)}</button>`).join("");
    $("#cmW").value = water;

    const add = id => { const tot = Object.values(mix).reduce((a, b) => a + b, 0); if (tot >= CAP) { WQ.toast(tx({en:"The bin is full!",bm:"Tong sudah penuh!"})); return; } mix[id] = (mix[id] || 0) + 1; res = null; WQ.anim($("#cmBin"), "pop"); refresh(); };
    // pointer: tap adds; drag onto the bin adds
    el.querySelectorAll(".cm-ing").forEach(b => {
      let sx, sy, ghost = null, moved = false;
      b.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; moved = false; b.setPointerCapture(e.pointerId); });
      b.addEventListener("pointermove", e => {
        if (sx == null) return;
        if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) { moved = true; ghost = document.createElement("div"); ghost.className = "cm-ghost"; ghost.textContent = b.querySelector(".e").textContent; document.body.appendChild(ghost); }
        if (ghost) { ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px"; const r = $("#cmBin").getBoundingClientRect(); $("#cmBin").classList.toggle("hover", e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom); }
      });
      const up = e => {
        if (sx == null) return; sx = null;
        if (ghost) { ghost.remove(); ghost = null; }
        const over = $("#cmBin").classList.contains("hover"); $("#cmBin").classList.remove("hover");
        if (e.type === "pointerup" && (!moved || over)) add(b.dataset.ing);
      };
      b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up);
      b.onclick = e => { if (e.detail === 0) add(b.dataset.ing); }; // keyboard / assistive tech
    });
    $("#cmW").oninput = e => { water = +e.target.value; res = null; refresh(); };
    el.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { turn = +b.dataset.t; res = null; refresh(); });
    $("#cmClr").onclick = () => { mix = {}; water = 0; res = null; $("#cmW").value = 0; stop(); refresh(); };
    $("#cmGo").onclick = () => {
      const s = stats(); if (s.wet < 10) { WQ.beep(false); WQ.anim($("#cmBin"), "shake"); refresh(); return; }
      res = simulate(); shown = 0; run();
    };
    const run = () => {
      stop();
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { shown = DAYS; finish(); return; }
      timer = setInterval(() => { if (!el.isConnected) return stop(); shown++; drawRes(); if (shown >= DAYS) { stop(); finish(); } }, 70);
      drawRes();
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const finish = () => { drawRes(); if (res.out === "good") { WQ.beep(true); WQ.award("compost"); } else WQ.beep(false); };

    function binSVG(s, day) {
      const fill = Math.min(1, s.wet / (CAP * PAIL)), h = 30 + fill * 110, top = 190 - h;
      const done = day ? day.done : 0, hotT = day ? day.T : TA;
      const col = done > 0.05 ? mixCol("#8a6a3a", "#3b2614", Math.min(1, done / 0.7)) : (s.wet ? mixCol("#7cae4a", "#b08850", s.brownFrac) : "#ddd");
      const emo = ING.flatMap(i => Array(Math.min(4, mix[i.id] || 0)).fill(i.e)).slice(0, 14);
      const steam = hotT > 50 ? [70, 110, 150].map((x, k) => `<path class="cm-steam" style="animation-delay:${k * .5}s" d="M${x} ${top - 6}q-8-10 0-20t0-20" stroke="#b9c7d4" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("") : "";
      const stink = day && day.O2 < 0.15 ? `<text x="180" y="${top - 6}" font-size="22">🤢</text><path d="M60 ${top - 4}q6-8 0-16t0-16M200 ${top - 4}q6-8 0-16t0-16" stroke="#8bb04a" stroke-width="4" fill="none"/>` : "";
      return `<svg viewBox="0 0 240 230" role="img" aria-label="${WQ.esc(tx({en:"Compost bin",bm:"Tong kompos"}))}">
        ${steam}${stink}
        <rect x="30" y="40" width="180" height="160" rx="14" fill="#e8f4e2" stroke="#3a9a2c" stroke-width="6"/>
        <rect x="36" y="${top}" width="168" height="${h}" rx="10" fill="${col}" style="transition:fill .6s,y .3s,height .3s"/>
        ${!day ? emo.map((e, k) => `<text x="${50 + (k % 7) * 22}" y="${top + 26 + Math.floor(k / 7) * 26}" font-size="20">${e}</text>`).join("") : ""}
        <rect x="20" y="30" width="200" height="16" rx="8" fill="#2e7d23"/>
        <g fill="#2e7d23">${[60, 100, 140, 180].map(x => `<circle cx="${x}" cy="215" r="5"/>`).join("")}</g>
        ${day ? `<g><rect x="214" y="70" width="14" height="110" rx="7" fill="#fff" stroke="#55657a" stroke-width="2"/><rect x="217" y="${178 - Math.min(104, (hotT - 20) * 2)}" width="8" height="${Math.min(104, (hotT - 20) * 2)}" rx="4" fill="#d62839"/><circle cx="221" cy="186" r="9" fill="#d62839"/></g>` : ""}
      </svg>`;
    }
    function gauges(s) {
      const cnPos = Math.max(0, Math.min(100, (Math.log10(Math.max(5, s.cn)) - Math.log10(5)) / (Math.log10(200) - Math.log10(5)) * 100));
      const cnA = (Math.log10(20) - Math.log10(5)) / (Math.log10(200) - Math.log10(5)) * 100, cnB = (Math.log10(40) - Math.log10(5)) / (Math.log10(200) - Math.log10(5)) * 100;
      return `<div class="stack small">
        <div><b>${tx({en:"Greens : browns balance (C:N)",bm:"Imbangan hijau : perang (C:N)"})}</b> ${s.wet ? (adv() ? `= ${s.cn.toFixed(0)} : 1` : "") : ""}
          <div class="cm-meter" style="--a:${cnA}%;--b:${cnB}%;background:linear-gradient(90deg,#7bbf5a 0,#7bbf5a var(--a),#6fcf5e var(--a),#2e9b47 var(--a),#2e9b47 var(--b),#c49a6c var(--b))">${s.wet ? `<i style="left:${cnPos}%"></i>` : ""}</div>
          <div class="cm-lbl"><span>🟩 ${tx({en:"too green",bm:"terlalu hijau"})}</span><span>✅ 20–40</span><span>${tx({en:"too brown",bm:"terlalu perang"})} 🟫</span></div></div>
        <div><b>${tx({en:"Moisture",bm:"Kelembapan"})}</b> ${s.wet ? `= ${(s.m * 100).toFixed(0)}%` : ""}
          <div class="cm-meter" style="--a:40%;--b:60%">${s.wet ? `<i style="left:${Math.min(100, s.m * 100)}%"></i>` : ""}</div>
          <div class="cm-lbl"><span>🏜️ ${tx({en:"dry",bm:"kering"})}</span><span>✅ 40–60%</span><span>${tx({en:"soggy",bm:"lembik"})} 💦</span></div></div>
        <div class="muted">⚖️ ${s.wet.toFixed(0)} kg · ${Object.values(mix).reduce((a, b) => a + b, 0)}/${CAP} ${tx({en:"pails",bm:"baldi"})}</div></div>`;
    }
    function chart(r, upto) {
      const W = 600, H = 270, L = 44, R = 10, Tp = 12, B = 40, x = d => L + (d / DAYS) * (W - L - R), y = T => Tp + (75 - T) / 55 * (H - Tp - B);
      const ds = r.days.slice(0, upto);
      let bands = "", start = 0;
      for (let i = 1; i <= ds.length; i++) if (i === ds.length || ds[i].ph !== ds[start].ph) { bands += `<rect x="${x(start)}" y="${Tp}" width="${x(i) - x(start)}" height="${H - Tp - B}" fill="${PH[ds[start].ph].c}" opacity=".55"/>`; start = i; }
      const path = ds.map((p, i) => `${i ? "L" : "M"}${x(p.d).toFixed(1)} ${y(Math.max(20, Math.min(75, p.T))).toFixed(1)}`).join("");
      const grid = [30, 40, 50, 60, 70].map(t => `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" stroke="#dde5ee"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end" font-size="12" fill="#55657a">${t}</text>`).join("");
      const weeks = Array.from({ length: 9 }, (_, w) => `<text x="${x(w * 7)}" y="${H - B + 16}" text-anchor="middle" font-size="12" fill="#55657a">${w}</text>`).join("");
      const turns = ds.filter(p => p.turned).map(p => `<text x="${x(p.d)}" y="${H - B - 4}" text-anchor="middle" font-size="13">🔄</text>`).join("");
      return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${WQ.esc(tx({en:"Temperature over 8 weeks",bm:"Suhu sepanjang 8 minggu"}))}">
        ${bands}${grid}
        <rect x="${L}" y="${y(65)}" width="${W - L - R}" height="${y(55) - y(65)}" fill="none" stroke="#d62839" stroke-dasharray="6 5" stroke-width="2"/>
        <text x="${W - R - 4}" y="${y(65) - 4}" text-anchor="end" font-size="12" fill="#d62839" font-weight="700">55–65 °C</text>
        <line x1="${L}" x2="${W - R}" y1="${y(TA)}" y2="${y(TA)}" stroke="#55657a" stroke-dasharray="2 4"/>
        <path d="${path}" fill="none" stroke="#d62839" stroke-width="3.5" stroke-linejoin="round"/>${turns}${weeks}
        <text x="${(L + W) / 2}" y="${H - 6}" text-anchor="middle" font-size="13" fill="#1d3557" font-weight="700">${tx({en:"Week",bm:"Minggu"})}</text>
        <text x="14" y="${(Tp + H - B) / 2}" text-anchor="middle" font-size="13" fill="#1d3557" font-weight="700" transform="rotate(-90 14 ${(Tp + H - B) / 2})">°C</text></svg>`;
    }
    function drawRes() {
      const box = $("#cmRes"); if (!res) { box.hidden = true; return; }
      box.hidden = false; const day = res.days[Math.max(0, shown - 1)], s = stats(), fin = shown >= DAYS, o = OUT[res.out];
      $("#cmBin").innerHTML = binSVG(s, day);
      box.innerHTML = `<h2>2. ${tx({en:"Inside your compost",bm:"Di dalam kompos anda"})}</h2>
        <div class="row"><span class="pill">📅 ${tx({en:"Day",bm:"Hari"})} ${day.d}/${DAYS}</span><span class="pill">🌡️ ${day.T.toFixed(0)} °C</span><span class="pill">💨 O₂ ${day.O2 < 0.15 ? tx({en:"very low",bm:"sangat rendah"}) : day.O2 < 0.5 ? tx({en:"low",bm:"rendah"}) : tx({en:"good",bm:"baik"})}</span><span class="pill">🍂→🟫 ${(day.done * 100).toFixed(0)}%</span><span class="pill">${PH[day.ph].t ? tx(PH[day.ph].t) : ""}</span></div>
        <div class="cm-chart">${chart(res, shown)}</div>
        <div class="cm-leg">${Object.values(PH).map(p => `<span style="--c:${p.c}">${tx(p.t)}</span>`).join("")}<span style="--c:#fff;border:0">🔄 ${tx({en:"turned",bm:"digaul"})}</span></div>
        <p class="small muted">${tx({en:"Mesophilic microbes (up to ~45 °C) start the work. Heat builds up and thermophilic microbes take over (55–65 °C kills most germs and weed seeds). As food runs out the pile cools, then cures for weeks into stable humus.",bm:"Mikrob mesofilik (sehingga ~45 °C) memulakan kerja. Haba terkumpul dan mikrob termofilik mengambil alih (55–65 °C membunuh kebanyakan kuman dan biji rumpai). Apabila makanan berkurang, longgokan menyejuk, kemudian matang selama beberapa minggu menjadi humus yang stabil."})}</p>
        ${fin ? `<div class="note ${o.c} cm-out row"><span class="big">${o.i}</span><div><b>${tx(o.t)}</b><br>${tx(o.d)}
          ${adv() ? `<div class="small">${tx({en:`Peak ${res.maxT.toFixed(0)} °C · ${res.d55} day(s) at ≥55 °C · ${(res.done * 100).toFixed(0)}% of degradable matter broken down · ${res.anaer} low-oxygen day(s).`,bm:`Puncak ${res.maxT.toFixed(0)} °C · ${res.d55} hari pada ≥55 °C · ${(res.done * 100).toFixed(0)}% bahan terurai · ${res.anaer} hari oksigen rendah.`})}
          ${res.out === "good" && res.d55 < 3 ? tx({en:" Note: it never held 55 °C for 3 days, so do not rely on it to kill pathogens or weed seeds.",bm:" Nota: ia tidak kekal 55 °C selama 3 hari, jadi jangan bergantung padanya untuk membunuh patogen atau biji rumpai."}) : ""}</div>` : ""}</div></div>
          <p class="small muted">${tx({en:"This is a simplified teaching model. Real piles vary with size, weather and particle size.",bm:"Ini model pengajaran yang dipermudah. Longgokan sebenar berbeza mengikut saiz, cuaca dan saiz zarah."})}</p>` : ""}`;
      kiki();
    }
    function kiki() {
      const s = stats(); let list = tips(s);
      if (res && shown >= DAYS) list = res.out === "good" ? [{en:"Brilliant! Sieve it and mix it into soil or pots. Your plants will love it.",bm:"Hebat! Ayak dan campurkan ke dalam tanah atau pasu. Pokok anda pasti suka."}]
        : res.out === "smelly" ? [{en:"Turn the pile more often and add browns to make air spaces.",bm:"Gaul lebih kerap dan tambah bahan perang untuk mewujudkan ruang udara."}]
        : res.out === "wet" ? [{en:"Use less water and more dry browns like cardboard or dry leaves.",bm:"Kurangkan air dan tambah bahan perang kering seperti kadbod atau daun kering."}]
        : res.out === "dry" ? [{en:"Add water: squeeze a handful, a few drops should come out.",bm:"Tambah air: genggam segenggam, beberapa titis air patut keluar."}]
        : res.out === "slow" ? [{en:"Add more greens such as vegetable scraps or coffee grounds.",bm:"Tambah bahan hijau seperti sisa sayur atau hampas kopi."}]
        : [{en:"Add more browns to lock in the nitrogen.",bm:"Tambah bahan perang untuk mengekalkan nitrogen."}];
      $("#cmKiki").innerHTML = `${WQ.MASCOT}<div><b>Kiki:</b><ul>${list.map(t => `<li>${tx(t)}</li>`).join("")}</ul></div>`;
    }
    function advPanel() {
      if (!adv()) return "";
      const s = stats(), rows = ING.filter(i => mix[i.id]).map(i => { const kg = mix[i.id] * PAIL, d = kg * (1 - i.mo); return `<tr><td>${i.e} ${tx(i.name)}</td><td>${kg}</td><td>${(i.mo * 100).toFixed(0)}</td><td>${d.toFixed(2)}</td><td>${i.C.toFixed(0)}</td><td>${i.N}</td><td>${(d * i.C / 100).toFixed(3)}</td><td>${(d * i.N / 100).toFixed(3)}</td></tr>`; }).join("");
      return `<div class="card stack"><h2>🧮 ${tx({en:"The C:N maths",bm:"Matematik C:N"})}</h2>
        <p>${tx({en:"Microbes use carbon (C) for energy and nitrogen (N) to build proteins. They work fastest at about 25–30 parts C to 1 part N. You cannot just average the ratios: each ingredient must be weighted by its dry mass and its carbon and nitrogen content.",bm:"Mikrob menggunakan karbon (C) untuk tenaga dan nitrogen (N) untuk membina protein. Mereka bekerja paling pantas pada kira-kira 25–30 bahagian C kepada 1 bahagian N. Anda tidak boleh sekadar mempuratakan nisbah: setiap bahan mesti diberi pemberat mengikut jisim kering serta kandungan karbon dan nitrogennya."})}</p>
        <p style="text-align:center;font-weight:800">C:N<sub>mix</sub> = Σ (m<sub>i</sub> × (1 − w<sub>i</sub>) × C<sub>i</sub>) ÷ Σ (m<sub>i</sub> × (1 − w<sub>i</sub>) × N<sub>i</sub>)</p>
        <p class="small muted">${tx({en:"m = wet mass, w = moisture fraction, C and N = % of dry mass. Values are typical mid-range figures from Rynk et al. (1992) On-Farm Composting Handbook and Cornell Waste Management Institute; real materials vary widely.",bm:"m = jisim basah, w = pecahan kelembapan, C dan N = % jisim kering. Nilai ialah angka sederhana tipikal daripada Rynk et al. (1992) On-Farm Composting Handbook dan Cornell Waste Management Institute; bahan sebenar sangat berbeza."})}</p>
        ${rows ? `<div class="tablewrap"><table class="tbl small"><tr><th>${tx({en:"Ingredient",bm:"Bahan"})}</th><th>kg</th><th>w %</th><th>${tx({en:"dry kg",bm:"kg kering"})}</th><th>C %</th><th>N %</th><th>C kg</th><th>N kg</th></tr>${rows}
          <tr><th colspan="3">${tx({en:"Total",bm:"Jumlah"})}</th><th>${s.dry.toFixed(2)}</th><th></th><th></th><th>${s.C.toFixed(3)}</th><th>${s.N.toFixed(3)}</th></tr></table></div>
          <p><b>C:N = ${s.C.toFixed(3)} ÷ ${s.N.toFixed(3)} = ${s.cn.toFixed(1)} : 1</b> · ${tx({en:"moisture",bm:"kelembapan"})} = ${(s.h2o).toFixed(1)} ÷ ${(s.wet + water).toFixed(1)} = ${(s.m * 100).toFixed(0)}%</p>` : `<p class="muted">${tx({en:"Add ingredients to see the calculation.",bm:"Tambah bahan untuk melihat pengiraan."})}</p>`}
        <p class="small">${tx({en:"Why it matters: below about 20:1 the surplus nitrogen is lost as ammonia (NH₃) gas; above about 40:1 microbes run short of nitrogen and decomposition crawls. Notice that 1 kg of wet vegetable scraps holds only about 0.15 kg of dry matter, while 1 kg of cardboard is over 0.9 kg dry: that is why a little cardboard shifts the ratio a lot.",bm:"Mengapa penting: di bawah kira-kira 20:1, nitrogen berlebihan hilang sebagai gas ammonia (NH₃); di atas kira-kira 40:1, mikrob kekurangan nitrogen dan penguraian menjadi sangat perlahan. Perhatikan bahawa 1 kg sisa sayur basah hanya mengandungi kira-kira 0.15 kg bahan kering, manakala 1 kg kadbod melebihi 0.9 kg kering: itulah sebabnya sedikit kadbod mengubah nisbah dengan banyak."})}</p></div>
      <div class="card stack"><h2>⚖️ ${tx({en:"Hot compost vs bokashi vs vermicompost",bm:"Kompos panas vs bokashi vs vermikompos"})}</h2>
        <div class="tablewrap"><table class="tbl small">
          <tr><th></th><th>🔥 ${tx({en:"Hot (aerobic) compost",bm:"Kompos panas (aerobik)"})}</th><th>🪣 Bokashi</th><th>🪱 ${tx({en:"Vermicompost",bm:"Vermikompos"})}</th></tr>
          <tr><th>${tx({en:"Process",bm:"Proses"})}</th><td>${tx({en:"Aerobic microbes; needs oxygen and turning",bm:"Mikrob aerobik; perlukan oksigen dan digaul"})}</td><td>${tx({en:"Anaerobic fermentation by lactic acid bacteria on inoculated bran, in a sealed bucket",bm:"Penapaian anaerobik oleh bakteria asid laktik pada dedak berinokulum, dalam baldi tertutup"})}</td><td>${tx({en:"Earthworms plus microbes; tropical species such as Eudrilus eugeniae",bm:"Cacing tanah dan mikrob; spesies tropika seperti Eudrilus eugeniae"})}</td></tr>
          <tr><th>${tx({en:"Temperature",bm:"Suhu"})}</th><td>55–65 °C</td><td>${tx({en:"Ambient",bm:"Suhu bilik"})}</td><td>${tx({en:"Must stay cool (worms die if the bedding overheats)",bm:"Mesti kekal sejuk (cacing mati jika media terlalu panas)"})}</td></tr>
          <tr><th>${tx({en:"Meat / dairy",bm:"Daging / tenusu"})}</th><td>${tx({en:"Not at home",bm:"Tidak untuk di rumah"})}</td><td>${tx({en:"Yes, small amounts",bm:"Ya, dalam jumlah kecil"})}</td><td>${tx({en:"No",bm:"Tidak"})}</td></tr>
          <tr><th>${tx({en:"Time",bm:"Masa"})}</th><td>${tx({en:"About 2–3 months, then curing",bm:"Kira-kira 2–3 bulan, kemudian pematangan"})}</td><td>${tx({en:"About 2 weeks in the bucket, then buried in soil for a few more weeks to finish",bm:"Kira-kira 2 minggu dalam baldi, kemudian ditanam dalam tanah beberapa minggu lagi untuk selesai"})}</td><td>${tx({en:"About 2–3 months",bm:"Kira-kira 2–3 bulan"})}</td></tr>
          <tr><th>${tx({en:"Kills weed seeds / pathogens?",bm:"Membunuh biji rumpai / patogen?"})}</th><td>${tx({en:"Yes, if ≥55 °C long enough",bm:"Ya, jika ≥55 °C cukup lama"})}</td><td>${tx({en:"Partly (acidic)",bm:"Sebahagian (berasid)"})}</td><td>${tx({en:"No heat step",bm:"Tiada peringkat haba"})}</td></tr>
          <tr><th>${tx({en:"Best for",bm:"Sesuai untuk"})}</th><td>${tx({en:"Gardens, schools, garden waste",bm:"Taman, sekolah, sisa taman"})}</td><td>${tx({en:"Flats and apartments with all kitchen waste",bm:"Rumah pangsa dan apartmen dengan semua sisa dapur"})}</td><td>${tx({en:"Kitchen scraps, very rich product",bm:"Sisa dapur, hasil sangat subur"})}</td></tr>
        </table></div>
        <p class="small muted">${tx({en:"Pathogen standard: the US EPA rule (40 CFR 503) requires ≥55 °C for 3 days in an aerated pile, or for 15 days with 5 turnings in a windrow.",bm:"Piawaian patogen: peraturan US EPA (40 CFR 503) memerlukan ≥55 °C selama 3 hari dalam longgokan beraerasi, atau 15 hari dengan 5 kali gaul dalam windrow."})}</p></div>
      ${WQ.aud === "teacher" ? `<div class="note small">🧑‍🏫 ${tx({en:"Teaching note: run three groups with the same ingredients but different turning (never / weekly / every 3 days) and compare the curves. Then link to the hands-on compost lab.",bm:"Nota pengajaran: jalankan tiga kumpulan dengan bahan yang sama tetapi kekerapan gaul berbeza (tidak pernah / mingguan / setiap 3 hari) dan bandingkan lengkung. Kemudian hubungkan dengan makmal kompos amali."})}</div>` : ""}`;
    }
    function refresh() {
      const s = stats();
      ING.forEach(i => { const c = $("#cmc-" + i.id); c.textContent = mix[i.id] || ""; c.hidden = !mix[i.id]; });
      $("#cmWv").textContent = water;
      el.querySelectorAll("[data-t]").forEach(b => b.setAttribute("aria-pressed", +b.dataset.t === turn));
      $("#cmGauges").innerHTML = gauges(s);
      $("#cmAdv").innerHTML = advPanel() + `<p class="row" style="margin-top:16px"><a class="btn blue" href="#/lab/compost">🧪 ${tx({en:"Try the real compost lab",bm:"Cuba makmal kompos sebenar"})}</a><a class="btn alt" href="#/games">${tx({en:"All games",bm:"Semua permainan"})}</a></p>`;
      if (res) drawRes(); else { $("#cmRes").hidden = true; $("#cmBin").innerHTML = binSVG(s); kiki(); }
    }
    refresh();
    if (res && shown < DAYS) run(); // language switched mid-run: carry on from the same day
    return stop;
  }});

function mixCol(a, b, f) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, f))).toString(16).padStart(2, "0")).join("");
}
})();
