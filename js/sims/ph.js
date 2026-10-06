/* Say No to Litmus! A virtual pH lab with natural indicators (red cabbage, bunga telang, kunyit).
// SOURCES:
//  - Anthocyanin colour forms (flavylium cation red < pH 3; carbinol pseudobase near-colourless ~pH 4–5; quinoidal base
//    violet ~pH 6–7; anionic quinoidal base blue ~pH 7–8; chalcone yellow at high pH): Brouillard R. (1982) in Markakis (ed.)
//    Anthocyanins as Food Colors; Castañeda-Ovando A. et al. (2009) Food Chemistry 113:859–871.
//  - Red cabbage indicator colour chart (red pH 1–2 → purple ~6–7 → blue ~8 → green ~9–12 → yellow 13+): standard school
//    chemistry practicals, e.g. Royal Society of Chemistry "Indicators from red cabbage".
//  - Butterfly pea (Clitoria ternatea) ternatins (polyacylated delphinidin glycosides): red/pink at low pH, purple ~pH 4–5,
//    blue ~pH 6–8, green at alkaline pH, yellow at very high pH: Oguis G.K. et al. (2019) Frontiers in Plant Science 10:645.
//  - Curcumin (turmeric) yellow in acid and neutral, orange-red to red-brown above ~pH 7.5–8.5: Priyadarsini K.I. (2014)
//    Molecules 19:20091–20112.
//  - Sample pH values are typical approximate values (they vary by brand and dilution): lemon/lime juice ~2–2.6,
//    vinegar ~2.4–3, fizzy soft drinks ~2.5–3.5, tomato ~4.2–4.9, cow's milk ~6.5–6.8, tap water ~6.5–8.5,
//    sodium bicarbonate solution ~8.3, toothpaste ~7–10, soap solution ~9–10, household ammonia cleaner ~11–12.
*/
(() => {
const tx = o => WQ.t(o), adv = () => WQ.aud !== "kids";
// colour at pH 1..14
const IND = {
 cabbage:{e:"🥬",name:{en:"Red cabbage",bm:"Kubis merah"},
  stops:["#d81b3c","#e0245e","#d6337a","#b03a8e","#8e3fa0","#7246a8","#5a4fb0","#3f62b8","#2c8aa8","#2a9d7a","#4caf50","#8bc34a","#cddc39","#f2d33a"],
  about:{en:"Anthocyanin pigments (cyanidin type). The widest colour range: red, purple, blue, green, yellow.",bm:"Pigmen antosianin (jenis sianidin). Julat warna paling luas: merah, ungu, biru, hijau, kuning."}},
 telang:{e:"🌸",name:{en:"Bunga telang (butterfly pea)",bm:"Bunga telang"},
  stops:["#c2185b","#c8287a","#b03597","#8e3ab0","#6a3fc0","#3f51c8","#2f5bd0","#2a6fd0","#2a8fb8","#2aa58a","#43a047","#7cb342","#c0ca33","#e0c030"],
  about:{en:"Ternatin anthocyanins (delphinidin type). The blue in nasi kerabu! Squeeze in lime juice and it turns purple-pink.",bm:"Antosianin ternatin (jenis delfinidin). Warna biru dalam nasi kerabu! Perah jus limau dan ia bertukar ungu-merah jambu."}},
 kunyit:{e:"🟡",name:{en:"Kunyit (turmeric)",bm:"Kunyit"},
  stops:["#f5c400","#f5c400","#f5c400","#f5c400","#f5c400","#f5c400","#f2bd00","#e8961a","#c9502a","#a8342a","#932c24","#8a2a22","#842820","#802620"],
  about:{en:"Curcumin. Yellow in acids AND neutral, red-brown in bases. It can find bases but cannot tell acid from neutral!",bm:"Kurkumin. Kuning dalam asid DAN neutral, perang kemerahan dalam bes. Ia boleh mengesan bes tetapi tidak dapat membezakan asid dengan neutral!"}}
};
// id, emoji, en, bm, pH, accepted answers, adults/teens only
const SAMPLES = [
 ["lemon","🍋","Lemon / lime juice","Jus lemon / limau nipis",2.2,["acid"]],
 ["vinegar","🍶","Vinegar","Cuka",2.5,["acid"]],
 ["soda","🥤","Fizzy soft drink","Minuman berkarbonat",3.0,["acid"]],
 ["tomato","🍅","Tomato juice","Jus tomato",4.3,["acid"]],
 ["milk","🥛","Fresh milk","Susu segar",6.7,["acid","neutral"]],
 ["tap","🚰","Tap water","Air paip",7.0,["neutral"]],
 ["bicarb","🧁","Baking soda solution","Larutan soda penaik",8.3,["base"]],
 ["tooth","🪥","Toothpaste in water","Ubat gigi dalam air",8.5,["base"]],
 ["soap","🧼","Soap solution","Larutan sabun",10,["base"]],
 ["ammonia","🧴","Ammonia glass cleaner","Pencuci kaca berasaskan ammonia",11.5,["base"],1]
].map(([id,e,en,bm,ph,ok,adultOnly])=>({id,e,name:{en,bm},ph,ok,adultOnly}));
const CLS = {acid:{e:"🍋",t:{en:"Acid",bm:"Asid"}},neutral:{e:"💧",t:{en:"Neutral",bm:"Neutral"}},base:{e:"🧼",t:{en:"Base (alkali)",bm:"Bes (alkali)"}}};
const cls = ph => ph < 6.5 ? "acid" : ph <= 7.5 ? "neutral" : "base";

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function col(ind, ph) {
  const s = IND[ind].stops, x = Math.max(1, Math.min(14, ph)) - 1, i = Math.min(12, Math.floor(x)), f = x - i, a = hex(s[i]), b = hex(s[i + 1]);
  return "#" + a.map((v, k) => Math.round(v + (b[k] - v) * f).toString(16).padStart(2, "0")).join("");
}
const pool = () => SAMPLES.filter(s => adv() || !s.adultOnly);

let ind = "cabbage", mode = "explore", tested = [], ch = null, mixB = 50, fresh = null;

function tube(c, label, sub, start) {
  return `<figure class="ph-tube"><svg viewBox="0 0 44 140" aria-hidden="true"><path d="M9 8h26v100a13 13 0 0 1-26 0z" fill="#f6fbff" stroke="#9fb3c8" stroke-width="3"/>
    <path class="ph-liq" d="M11.5 46h21v62a10.5 10.5 0 0 1-21 0z" style="fill:${start || c}" data-to="${c}"/><rect x="11.5" y="46" width="21" height="4" fill="#fff" opacity=".35"/>
    <rect x="5" y="3" width="34" height="7" rx="3.5" fill="#9fb3c8"/></svg><figcaption><b>${label}</b>${sub ? `<span>${sub}</span>` : ""}</figcaption></figure>`;
}
function hPlus(ph) { const e = Math.floor(-ph), m = Math.pow(10, -ph - e); return `${m.toFixed(1)} × 10<sup>${e}</sup>`; }
function mixPH(fb) { // 0.01 M HCl + 0.01 M NaOH, equal concentrations, fraction fb of base by volume
  const net = 0.01 * ((1 - fb) - fb), r = Math.sqrt(net * net + 4e-14);
  return net >= 0 ? -Math.log10((net + r) / 2) : 14 + Math.log10((-net + r) / 2);
}

WQ.css("ph", `
.ph-inds{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
.ph-ind{text-align:left;background:#fff;border:3px solid var(--line);border-radius:18px;padding:10px 12px;font-weight:700}
.ph-ind[aria-pressed=true]{border-color:var(--grass);background:#f1fbec}
.ph-ind b{font-family:"Baloo 2";font-size:1.1rem}
.ph-strip{display:flex;height:16px;border-radius:999px;overflow:hidden;margin:6px 0 4px}.ph-strip i{flex:1}
.ph-samples{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}
.ph-s{display:flex;gap:8px;align-items:center;text-align:left;background:#fff;border:3px solid var(--line);border-radius:16px;padding:8px 10px;font-weight:800;min-height:54px;line-height:1.15}
.ph-s:hover{border-color:var(--blue)}.ph-s .e{font-size:1.6rem}
.ph-s.done{border-style:dashed;opacity:.75}
.ph-rack{display:flex;flex-wrap:wrap;gap:6px 4px;align-items:flex-start;min-height:150px;padding:8px 8px 0;border-bottom:10px solid #c08a52;border-radius:4px}
.ph-tube{margin:0;width:68px;text-align:center}.ph-tube svg{width:44px;height:140px;display:block;margin:0 auto}
.ph-liq{transition:fill 1.6s ease}
.ph-tube figcaption{font-size:.74rem;line-height:1.15}.ph-tube figcaption b{display:block}.ph-tube figcaption span{color:var(--muted);font-weight:700}
.ph-tube.new svg{animation:phDrop .6s ease}
@keyframes phDrop{0%{transform:translateY(-24px);opacity:.3}60%{transform:translateY(4px)}}
.ph-chart{position:relative;margin:8px 0 54px}
.ph-chart .bar{display:flex;height:34px;border-radius:10px;overflow:hidden}.ph-chart .bar i{flex:1;display:grid;place-items:center;color:#fff;font-weight:800;font-style:normal;font-size:.8rem;text-shadow:0 1px 2px rgba(0,0,0,.4)}
.ph-chart .mk{position:absolute;top:36px;transform:translateX(-50%);font-size:1.25rem;line-height:1}
.ph-chart .mk:before{content:"";display:block;width:2px;height:6px;background:var(--ink);margin:0 auto}
.ph-chart .ax{display:flex;justify-content:space-between;font-size:.78rem;font-weight:800;color:var(--muted);margin-top:30px}
.ph-pred{display:grid;gap:8px;grid-template-columns:repeat(3,1fr)}
.ph-pred .choice{text-align:center;padding:10px 6px}.ph-pred .choice span{display:block;font-size:1.6rem}
.ph-big{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.ph-forms{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
.ph-forms div{border-radius:14px;padding:8px 10px;background:var(--soft);font-size:.85rem}
.ph-forms i{display:block;height:12px;border-radius:6px;margin-bottom:6px}
.ph-log{display:flex;align-items:flex-end;gap:6px;height:150px;margin:8px 0}.ph-log div{flex:1;text-align:center;font-size:.72rem;font-weight:800}
.ph-log b{display:block;background:var(--red);border-radius:6px 6px 0 0;margin:0 auto;width:70%;min-height:2px}
.ph-mix input{width:100%;accent-color:var(--purple)}
.ph-curve svg{width:100%;max-width:420px;height:auto}
`);

WQ.registerGame("ph", { order: 10, kind: "sim", icon: "🧪", ages: "7+",
  title: {en:"Say No to Litmus!",bm:"Tak Perlu Litmus!"},
  desc: {en:"Test kitchen liquids with natural indicators from cabbage, bunga telang and kunyit.",bm:"Uji cecair dapur dengan penunjuk semula jadi daripada kubis, bunga telang dan kunyit."},
  badge: {icon:"🧪",name:{en:"pH Detective",bm:"Detektif pH"},desc:{en:"80% or more in the pH challenge",bm:"80% atau lebih dalam cabaran pH"}},
  mount(el) {
    const $ = s => el.querySelector(s);
    const strip = k => `<div class="ph-strip" aria-hidden="true">${IND[k].stops.map(c => `<i style="background:${c}"></i>`).join("")}</div>`;
    el.innerHTML = WQ.head("🧪", this.title, this.desc) + `
      <div class="card stack"><h2>1. ${tx({en:"Pick a natural indicator",bm:"Pilih penunjuk semula jadi"})}</h2>
        <div class="ph-inds" role="group">${Object.entries(IND).map(([k, v]) => `<button class="ph-ind" data-ind="${k}"><b>${v.e} ${tx(v.name)}</b>${strip(k)}<span class="small muted">${tx(v.about)}</span></button>`).join("")}</div>
        <p class="small">${tx({en:"Why natural? Litmus paper only says acid or base. Plant indicators are cheap, safe, found in the kitchen, and some show many colours, so you can estimate the pH too.",bm:"Mengapa semula jadi? Kertas litmus hanya menunjukkan asid atau bes. Penunjuk tumbuhan murah, selamat, ada di dapur, dan sesetengahnya menunjukkan banyak warna, jadi anda boleh menganggar pH juga."})}
          <a href="#/lab/litmus">${tx({en:"How to make the extract (hands-on lab) →",bm:"Cara membuat ekstrak (makmal amali) →"})}</a></p>
      </div>
      <div class="card stack">
        <div class="row"><h2 style="flex:1">2. ${tx({en:"Test your samples",bm:"Uji sampel anda"})}</h2>
          <div class="row" role="group"><button class="btn alt" data-mode="explore">🔬 ${tx({en:"Explore",bm:"Teroka"})}</button><button class="btn alt" data-mode="challenge">🏆 ${tx({en:"Challenge",bm:"Cabaran"})}</button></div></div>
        <div id="phBody"></div>
      </div>
      <div id="phSci"></div>
      <p class="row" style="margin-top:16px"><a class="btn blue" href="#/lab/litmus">🧪 ${tx({en:"Try the real lab",bm:"Cuba makmal sebenar"})}</a><a class="btn alt" href="#/games">${tx({en:"All games",bm:"Semua permainan"})}</a></p>`;
    el.querySelectorAll("[data-ind]").forEach(b => b.onclick = () => { ind = b.dataset.ind; render(); });
    el.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => { mode = b.dataset.mode; if (mode === "challenge" && (!ch || ch.done)) newChallenge(); render(); });

    function newChallenge() { ch = { order: WQ.shuffle(pool().map(s => s.id)), i: 0, pred: null, score: 0, done: false }; }
    const S = id => SAMPLES.find(s => s.id === id);
    const sub = s => adv() ? `pH ≈ ${s.ph}` : tx(CLS[cls(s.ph)].t);
    function animate() { // run colour transitions for freshly poured tubes
      requestAnimationFrame(() => requestAnimationFrame(() => el.querySelectorAll(".ph-tube.new .ph-liq").forEach(p => p.style.fill = p.dataset.to)));
    }
    function chart(ids) {
      const mk = ids.map(id => S(id)).map((s, k) => `<span class="mk" style="left:${(s.ph - 0.5) / 14 * 100}%;top:${36 + (k % 3) * 22}px" title="${WQ.esc(tx(s.name))}">${s.e}</span>`).join("");
      return `<h3>📊 ${tx({en:"My pH colour chart",bm:"Carta warna pH saya"})} · ${tx(IND[ind].name)}</h3>
        <div class="row small" style="justify-content:space-between;font-weight:800;margin-top:6px"><span>⬅ ${tx({en:"more acidic",bm:"lebih berasid"})}</span><span>7 = ${tx({en:"neutral",bm:"neutral"})}</span><span>${tx({en:"more basic",bm:"lebih bes"})} ➡</span></div>
        <div class="ph-chart" style="margin-bottom:${ids.length > 2 ? 64 : 40}px"><div class="bar">${IND[ind].stops.map((c, i) => `<i style="background:${c}">${i + 1}</i>`).join("")}</div>${mk}</div>`;
    }
    function explore() {
      const p = pool();
      return `<p class="muted">${tx({en:"Tap a sample to pour it into a test tube of indicator.",bm:"Tekan sampel untuk menuangnya ke dalam tabung uji berisi penunjuk."})}</p>
        <div class="ph-samples">${p.map(s => `<button class="ph-s ${tested.includes(s.id) ? "done" : ""}" data-s="${s.id}"><span class="e">${s.e}</span>${tx(s.name)}</button>`).join("")}</div>
        ${p.find(s => s.adultOnly) ? `<div class="note danger small">⚠️ ${tx({en:"Ammonia cleaner: teacher demo only. Use gloves and goggles, ventilate, and NEVER mix ammonia with bleach (it releases toxic chloramine gas).",bm:"Pencuci ammonia: demonstrasi guru sahaja. Pakai sarung tangan dan gogal, pastikan pengudaraan, dan JANGAN sekali-kali campurkan ammonia dengan peluntur (ia membebaskan gas kloramina yang beracun)."})}</div>` : ""}
        <div class="ph-rack" aria-live="polite">${tested.length ? tested.map(id => { const s = S(id); return tube(col(ind, s.ph), `${s.e} ${tx(s.name)}`, sub(s), id === fresh ? col(ind, 6.5) : null).replace('class="ph-tube"', `class="ph-tube${id === fresh ? " new" : ""}"`); }).join("") : `<p class="muted">${tx({en:"Your test tube rack is empty.",bm:"Rak tabung uji anda kosong."})}</p>`}</div>
        ${tested.length ? `<div class="row"><button class="btn alt" id="phClr">🧽 ${tx({en:"Wash the tubes",bm:"Basuh tabung uji"})}</button></div>${chart(tested)}` : ""}`;
    }
    function challenge() {
      if (ch.done) {
        const n = ch.order.length, pct = Math.round(ch.score / n * 100);
        return `<div class="ph-big"><div style="font-size:3rem">${pct >= 80 ? "🏆" : "🔬"}</div><div><h3>${tx({en:"Challenge complete!",bm:"Cabaran selesai!"})}</h3>
          <p><b>${ch.score}/${n} (${pct}%)</b> · ${tx({en:"Best",bm:"Terbaik"})}: ${WQ.best("ph")}%</p>
          <p>${pct >= 80 ? tx({en:"Brilliant detective work!",bm:"Kerja detektif yang hebat!"}) : tx({en:"Score 80% or more to earn the pH Detective badge. Try again!",bm:"Dapatkan 80% atau lebih untuk lencana Detektif pH. Cuba lagi!"})}</p></div></div>
          ${chart(ch.order)}<div class="row"><button class="btn" id="phAgain">🔁 ${tx({en:"Play again",bm:"Main lagi"})}</button></div>`;
      }
      const s = S(ch.order[ch.i]), revealed = ch.pred != null, ok = revealed && s.ok.includes(ch.pred);
      return `<div class="row"><span class="pill">🧪 ${ch.i + 1}/${ch.order.length}</span><span class="pill">⭐ ${ch.score}</span></div>
        <div class="ph-big">${tube(revealed ? col(ind, s.ph) : col(ind, 6.5), "", "", revealed ? col(ind, 6.5) : null).replace('class="ph-tube"', `class="ph-tube${revealed ? " new" : ""}"`)}
          <div style="flex:1;min-width:220px"><h3 style="font-size:1.4rem">${s.e} ${tx(s.name)}</h3>
          <p>${revealed ? "" : tx({en:"Predict first: is it an acid, neutral or a base?",bm:"Ramal dahulu: adakah ia asid, neutral atau bes?"})}</p>
          <div class="ph-pred">${Object.entries(CLS).map(([k, c]) => `<button class="choice ${revealed ? (s.ok.includes(k) ? "right" : k === ch.pred ? "wrong" : "") : ""}" data-p="${k}" ${revealed ? "disabled" : ""}><span>${c.e}</span>${tx(c.t)}</button>`).join("")}</div></div></div>
        <div aria-live="polite">${revealed ? `<div class="note ${ok ? "ok" : "warn"}"><b>${ok ? "✅ " + tx({en:"Correct!",bm:"Betul!"}) : "🤔 " + tx({en:"Not quite.",bm:"Belum tepat."})}</b>
          ${tx({en:`${tx(s.name)} has a pH of about ${s.ph}, so it is ${tx(CLS[cls(s.ph)].t).toLowerCase()}.`,bm:`${tx(s.name)} mempunyai pH kira-kira ${s.ph}, jadi ia ${tx(CLS[cls(s.ph)].t).toLowerCase()}.`})}
          ${s.id === "milk" ? tx({en:" Milk is very slightly acidic, almost neutral, so both answers count.",bm:" Susu sangat sedikit berasid, hampir neutral, jadi kedua-dua jawapan diterima."}) : ""}
          ${ind === "kunyit" && cls(s.ph) !== "base" ? tx({en:" Notice kunyit stays yellow: it cannot tell acid from neutral.",bm:" Perhatikan kunyit kekal kuning: ia tidak dapat membezakan asid dengan neutral."}) : ""}
          ${s.adultOnly ? `<br><b>⚠️ ${tx({en:"Teacher demo only. Never mix ammonia with bleach.",bm:"Demonstrasi guru sahaja. Jangan campurkan ammonia dengan peluntur."})}</b>` : ""}</div>
          <p class="row" style="margin-top:10px"><button class="btn" id="phNext">${ch.i + 1 < ch.order.length ? tx({en:"Next sample →",bm:"Sampel seterusnya →"}) : tx({en:"See my results",bm:"Lihat keputusan"})}</button></p>` : ""}</div>`;
    }
    function science() {
      if (!adv()) return "";
      const lg = [2, 3, 4, 5, 6, 7].map(p => `<div><b style="height:${Math.max(2, 100 * Math.pow(10, 2 - p))}px"></b>pH ${p}<br>×${Math.pow(10, 7 - p).toLocaleString("en")}</div>`).join("");
      const ph = mixPH(mixB / 100);
      const pts = Array.from({ length: 101 }, (_, i) => `${i ? "L" : "M"}${(30 + i * 3.8).toFixed(1)} ${(10 + (14 - mixPH(i / 100)) / 14 * 160).toFixed(1)}`).join("");
      const forms = ind === "kunyit"
        ? `<div><i style="background:#f5c400"></i><b>${tx({en:"Neutral curcumin (keto-enol form)",bm:"Kurkumin neutral (bentuk keto-enol)"})}</b><br>${tx({en:"Yellow, from strong acid up to about pH 7.5",bm:"Kuning, daripada asid kuat hingga kira-kira pH 7.5"})}</div>
           <div><i style="background:#c9502a"></i><b>${tx({en:"Phenolate anion",bm:"Anion fenolat"})}</b><br>${tx({en:"Above ~pH 8 the phenolic –OH groups lose H⁺; the larger conjugated system absorbs green-blue light, so we see red-brown",bm:"Melebihi ~pH 8, kumpulan –OH fenolik kehilangan H⁺; sistem konjugat yang lebih besar menyerap cahaya hijau-biru, jadi kita nampak perang kemerahan"})}</div>`
        : [["#d81b3c",{en:"Flavylium cation (AH⁺)",bm:"Kation flavilium (AH⁺)"},{en:"Red, pH below ~3. Positively charged ring.",bm:"Merah, pH bawah ~3. Gelang bercas positif."}],
           ["#e9d6e4",{en:"Carbinol pseudobase (B)",bm:"Pseudobes karbinol (B)"},{en:"Nearly colourless, ~pH 4–5. Water adds to the ring; why the extract looks pale here.",bm:"Hampir tanpa warna, ~pH 4–5. Air bertambah pada gelang; sebab ekstrak kelihatan pucat di sini."}],
           ["#7246a8",{en:"Quinoidal base (A)",bm:"Bes kuinoid (A)"},{en:"Violet, ~pH 6–7. Lost one H⁺.",bm:"Ungu, ~pH 6–7. Kehilangan satu H⁺."}],
           ["#3f62b8",{en:"Anionic quinoidal base (A⁻)",bm:"Bes kuinoid anionik (A⁻)"},{en:"Blue, ~pH 7–8. Lost another H⁺.",bm:"Biru, ~pH 7–8. Kehilangan satu lagi H⁺."}],
           ["#f2d33a",{en:"Chalcone (C)",bm:"Kalkon (C)"},{en:"Yellow, high pH. The ring opens (slowly, and partly irreversibly). Green = blue + yellow forms mixed.",bm:"Kuning, pH tinggi. Gelang terbuka (perlahan, dan sebahagiannya tidak berbalik). Hijau = campuran bentuk biru + kuning."}]]
          .map(([c, n, d]) => `<div><i style="background:${c}"></i><b>${tx(n)}</b><br>${tx(d)}</div>`).join("");
      return `<div class="card stack"><h2>🔬 ${tx({en:"Why does the colour change?",bm:"Mengapa warna berubah?"})}</h2>
        <p>${ind === "kunyit" ? tx({en:"Curcumin's colour comes from its long chain of alternating single and double bonds (conjugation). Removing H⁺ in base extends the conjugation and shifts the absorbed light to longer wavelengths.",bm:"Warna kurkumin datang daripada rantai panjang ikatan tunggal dan ganda dua berselang-seli (konjugasi). Penyingkiran H⁺ dalam bes memanjangkan konjugasi dan mengalihkan cahaya yang diserap ke panjang gelombang lebih panjang."})
          : tx({en:"Anthocyanins change structure as pH changes. Each form gains or loses H⁺ (or adds water), which changes the conjugated double-bond system and therefore which wavelengths of light are absorbed. The colour we see is the light that is not absorbed.",bm:"Antosianin berubah struktur apabila pH berubah. Setiap bentuk menerima atau kehilangan H⁺ (atau menambah air), yang mengubah sistem ikatan ganda dua berkonjugat dan oleh itu panjang gelombang cahaya yang diserap. Warna yang kita lihat ialah cahaya yang tidak diserap."})}</p>
        <div class="ph-forms">${forms}</div></div>
      <div class="card stack"><h2>📐 ${tx({en:"pH is a log scale",bm:"pH ialah skala log"})}</h2>
        <p>pH = −log<sub>10</sub>[H⁺]. ${tx({en:"Each step of 1 pH unit is a 10× change in hydrogen-ion concentration: pH 3 is 10× more acidic than pH 4, and 100× more than pH 5.",bm:"Setiap langkah 1 unit pH ialah perubahan 10× dalam kepekatan ion hidrogen: pH 3 adalah 10× lebih berasid daripada pH 4, dan 100× lebih daripada pH 5."})}</p>
        <div class="ph-log" aria-hidden="true">${lg}</div>
        <p class="small muted">${tx({en:"Bars: [H⁺] relative to pure water (pH 7). Lemon juice at pH 2.2 has [H⁺] ≈ ",bm:"Bar: [H⁺] berbanding air tulen (pH 7). Jus lemon pada pH 2.2 mempunyai [H⁺] ≈ "})}${hPlus(2.2)} mol/L, ${tx({en:"about 63,000× more than pure water.",bm:"kira-kira 63,000× lebih daripada air tulen."})}</p></div>
      <div class="card stack ph-mix"><h2>⚗️ ${tx({en:"Mix an acid and a base",bm:"Campurkan asid dan bes"})}</h2>
        <p class="small">${tx({en:"Virtual mix of dilute hydrochloric acid (0.01 M, pH 2) and dilute sodium hydroxide (0.01 M, pH 12). Slide to change the proportions.",bm:"Campuran maya asid hidroklorik cair (0.01 M, pH 2) dan natrium hidroksida cair (0.01 M, pH 12). Luncurkan untuk mengubah perkadaran."})}</p>
        <div class="ph-big" id="phMixTube">${tube(col(ind, ph), `pH ${ph.toFixed(1)}`, tx(CLS[cls(ph)].t))}
          <div style="flex:1;min-width:220px"><label for="phMix" class="row" style="justify-content:space-between;font-weight:800"><span>🍋 ${tx({en:"acid",bm:"asid"})} <span id="phA">${100 - mixB}</span>%</span><span>${tx({en:"base",bm:"bes"})} <span id="phB">${mixB}</span>% 🧼</span></label>
          <input type="range" id="phMix" min="0" max="100" step="1" value="${mixB}" aria-label="${WQ.esc(tx({en:"Percentage of base",bm:"Peratus bes"}))}">
          <div class="ph-curve"><svg viewBox="0 0 420 200" aria-hidden="true"><rect x="30" y="10" width="380" height="160" fill="#f3f7fb"/>
            ${[0, 7, 14].map(v => `<text x="24" y="${14 + (14 - v) / 14 * 160}" text-anchor="end" font-size="11" fill="#55657a">${v}</text>`).join("")}
            <line x1="30" x2="410" y1="${10 + 80}" y2="${10 + 80}" stroke="#c9d3dd" stroke-dasharray="4 4"/>
            <path d="${pts}" fill="none" stroke="#7b4bc4" stroke-width="3"/><circle id="phDot" cx="${30 + mixB * 3.8}" cy="${10 + (14 - ph) / 14 * 160}" r="7" fill="${col(ind, ph)}" stroke="#1d3557" stroke-width="2"/>
            <text x="220" y="192" text-anchor="middle" font-size="12" fill="#1d3557" font-weight="700">% ${tx({en:"base",bm:"bes"})} →</text></svg></div></div></div>
        <p class="small">${tx({en:"See the cliff at 50:50? Near neutralisation one extra drop swings the pH by several units. That is the log scale at work, and why titrations need a careful last drop.",bm:"Nampak cerun curam pada 50:50? Berhampiran peneutralan, setitik tambahan mengubah pH beberapa unit. Itulah kesan skala log, dan sebab pentitratan memerlukan titisan terakhir yang berhati-hati."})}</p></div>
      ${WQ.aud === "teacher" ? `<div class="note small">🧑‍🏫 ${tx({en:"Teaching note: have pupils predict first (challenge mode) before the hands-on lab, then compare the virtual chart with their real test tubes. Extracts are made with hot water: adult supervision.",bm:"Nota pengajaran: minta murid meramal dahulu (mod cabaran) sebelum makmal amali, kemudian bandingkan carta maya dengan tabung uji sebenar. Ekstrak dibuat dengan air panas: perlu pengawasan orang dewasa."})}</div>` : ""}`;
    }
    function render() {
      el.querySelectorAll("[data-ind]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ind === ind));
      el.querySelectorAll("[data-mode]").forEach(b => { b.classList.toggle("alt", b.dataset.mode !== mode); b.setAttribute("aria-pressed", b.dataset.mode === mode); });
      $("#phBody").innerHTML = mode === "explore" ? explore() : challenge();
      $("#phSci").innerHTML = science();
      el.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { const id = b.dataset.s; tested = tested.filter(x => x !== id).concat(id); fresh = id; WQ.beep(true); render(); });
      if ($("#phClr")) $("#phClr").onclick = () => { tested = []; render(); };
      el.querySelectorAll("[data-p]").forEach(b => b.onclick = () => {
        const s = S(ch.order[ch.i]); ch.pred = b.dataset.p; const ok = s.ok.includes(ch.pred); if (ok) ch.score++; WQ.beep(ok); render(); });
      if ($("#phNext")) $("#phNext").onclick = () => {
        ch.i++; ch.pred = null;
        if (ch.i >= ch.order.length) { ch.done = true; const pct = Math.round(ch.score / ch.order.length * 100); WQ.best("ph", pct); if (pct >= 80) WQ.award("ph"); }
        render(); $("#phBody").scrollIntoView({ block: "nearest" }); };
      if ($("#phAgain")) $("#phAgain").onclick = () => { newChallenge(); render(); };
      if ($("#phMix")) $("#phMix").oninput = e => { // update in place so dragging is not interrupted
        mixB = +e.target.value; const ph = mixPH(mixB / 100), c = col(ind, ph), dot = $("#phDot");
        $("#phA").textContent = 100 - mixB; $("#phB").textContent = mixB;
        dot.setAttribute("cx", 30 + mixB * 3.8); dot.setAttribute("cy", 10 + (14 - ph) / 14 * 160); dot.setAttribute("fill", c);
        $("#phMixTube .ph-liq").style.fill = c; $("#phMixTube figcaption").innerHTML = `<b>pH ${ph.toFixed(1)}</b><span>${tx(CLS[cls(ph)].t)}</span>`; };
      animate(); fresh = null;
    }
    if (ch && ch.order.some(id => !pool().find(s => s.id === id))) newChallenge(); // audience changed
    render();
  }});
})();
