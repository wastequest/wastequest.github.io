/* Eco-Enzyme Mixer: solve the 1:3:10 ratio for a chosen container (≤60% full), then scrub through the 3-month ferment.
// SOURCES:
//  - Recipe 1 : 3 : 10 (brown sugar/molasses : fruit & vegetable peels : water, by mass), 3 months fermentation:
//    the "garbage enzyme" method popularised by Dr Rosukon Poompanvong (Thailand); widely used by Malaysian community groups.
//  - Final pH roughly 3–4 and the organic-acid / fermentation chemistry: e.g. Arun C. & Sivashanmugam P. (2015)
//    Process Safety and Environmental Protection 94:471–478 ("garbage enzyme"); Rasit N. et al. (2019) J. Sustainability
//    Science and Management 14(5) (eco-enzyme from fruit waste, pH ~3–4).
//  - Volume increase from dissolved sucrose ≈ 0.62 mL per g (partial specific volume of sucrose in water, ~0.62–0.63 mL/g).
//  - Organic matter released into rivers raises biochemical oxygen demand (BOD) and lowers dissolved oxygen: standard
//    water-quality science (e.g. DOE Malaysia Water Quality Index uses BOD and DO as parameters).
*/
(() => {
const tx = o => WQ.t(o), adv = () => WQ.aud !== "kids";
const BOT = { // volume mL, slider [max, step] for sugar (g), peels (g), water (mL)
 "1.5":{V:1500,s:[200,10],p:[600,10],w:[1500,50]},
 "5":{V:5000,s:[700,10],p:[2000,20],w:[5000,100]},
 "10":{V:10000,s:[1200,20],p:[4000,50],w:[10000,100]}
};
const vol = (s, p, w) => w + p + 0.62 * s; // mL
let bot = "1.5", sug = 0, peel = 0, wat = 0, solved = false, day = 0, harvested = false, hint = false, msg = null;

// timeline events: [fromDay, toDay, icon, en, bm, kind]
const EV = [
 [0,0,"🏷️","Day 0: mix everything, close the lid and write today's date on the bottle.","Hari 0: campurkan semua bahan, tutup penutup dan tulis tarikh hari ini pada botol.",""],
 [1,13,"🫧","Weeks 1–2: lots of bubbles! Yeasts are making carbon dioxide gas. Open the lid for a moment EVERY DAY to let the gas out, then close it. Push floating peels back under the liquid.","Minggu 1–2: banyak buih! Yis menghasilkan gas karbon dioksida. Buka penutup sebentar SETIAP HARI untuk melepaskan gas, kemudian tutup semula. Tekan kulit buah yang terapung ke bawah cecair.","warn"],
 [14,30,"💨","Weeks 2–4: still release the gas daily until the end of the first month. A sweet-sour, fruity smell is a good sign.","Minggu 2–4: terus lepaskan gas setiap hari hingga akhir bulan pertama. Bau masam manis seperti buah ialah tanda yang baik.","warn"],
 [31,59,"⚪","Month 2: gas slows down, so open the lid only about once a week. A thin white film on top is normal (harmless yeast). Leave it. The smell turns vinegar-like.","Bulan 2: gas berkurang, jadi buka penutup kira-kira seminggu sekali sahaja. Lapisan putih nipis di atas adalah normal (yis yang tidak berbahaya). Biarkan. Baunya menjadi seperti cuka.","ok"],
 [60,89,"🟤","Month 3: the peels sink and the liquid turns a clear dark brown. Keep it in a cool, shady place. Almost there!","Bulan 3: kulit buah tenggelam dan cecair menjadi perang gelap jernih. Simpan di tempat sejuk dan teduh. Hampir siap!","ok"],
 [90,90,"🎉","Day 90: harvest time! Filter it through a cloth or sieve.","Hari 90: masa menuai! Tapis dengan kain atau penapis.","ok"]
];

WQ.css("enzyme", `
.ez-bots{display:grid;gap:10px;grid-template-columns:repeat(3,1fr)}
.ez-bot{background:#fff;border:3px solid var(--line);border-radius:18px;padding:10px 6px;font-weight:800;text-align:center}
.ez-bot[aria-pressed=true]{border-color:var(--grass);background:#f1fbec}.ez-bot svg{vertical-align:bottom}
.ez-wrap{display:grid;gap:16px;grid-template-columns:minmax(0,1fr) 220px;align-items:start}
@media (max-width:640px){.ez-wrap{grid-template-columns:1fr}.ez-vis{order:-1}}
.ez-sl label{display:flex;justify-content:space-between;font-weight:800;margin-top:10px;gap:8px}
.ez-sl input{width:100%;accent-color:var(--orange)}
.ez-vis{text-align:center}.ez-vis svg{width:100%;max-width:220px;height:auto}
.ez-ratio{display:flex;height:26px;border-radius:8px;overflow:hidden;font-size:.75rem;font-weight:800;color:#fff}
.ez-ratio i{display:grid;place-items:center;font-style:normal;min-width:0;overflow:hidden;white-space:nowrap}
.ez-tl input{width:100%;accent-color:var(--brown)}
.ez-ticks{position:relative;height:22px;font-size:.75rem;font-weight:800;color:var(--muted)}.ez-ticks span{position:absolute;transform:translateX(-50%);white-space:nowrap}.ez-ticks span:first-child{transform:none}.ez-ticks span:last-child{transform:translateX(-100%)}
.ez-ev{display:flex;gap:12px;align-items:flex-start}.ez-ev .i{font-size:2rem;line-height:1}
.ez-eq{font-family:ui-monospace,Consolas,monospace;background:var(--soft);border-radius:10px;padding:8px 12px;overflow-x:auto;white-space:nowrap;font-size:.9rem}
@media (max-width:560px){.ez-cl tr{display:block;border-bottom:1px solid var(--line);padding:6px 0}.ez-cl td{display:block;border:0;padding:2px 4px}.ez-cl tr:first-child{display:none}}
@keyframes ezBub{0%{transform:translateY(0);opacity:0}20%{opacity:.9}100%{transform:translateY(-70px);opacity:0}}
.ez-bub{animation:ezBub 2.2s linear infinite}
`);

WQ.registerGame("enzyme", { order: 12, kind: "sim", icon: "🍊", ages: "7+",
  title: {en:"Eco-Enzyme Mixer",bm:"Pengadun Eko-Enzim"},
  desc: {en:"Solve the 1:3:10 recipe for your bottle, then fast-forward 3 months of fermentation.",bm:"Selesaikan resipi 1:3:10 untuk botol anda, kemudian percepatkan 3 bulan penapaian."},
  badge: {icon:"🍊",name:{en:"Enzyme Brewer",bm:"Pembuat Enzim"},desc:{en:"Solved the ratio and harvested eco-enzyme",bm:"Menyelesaikan nisbah dan menuai eko-enzim"}},
  mount(el) {
    const $ = s => el.querySelector(s);
    el.innerHTML = WQ.head("🍊", this.title, this.desc) + `
      <div class="note danger">⚠️ ${tx({en:"Adult supervision: ask an adult to cut the peels. Fermentation makes gas that can swell or burst a container: use a plastic bottle (never a sealed glass jar) and release the gas. Eco-enzyme is not a drink.",bm:"Pengawasan orang dewasa: minta orang dewasa memotong kulit buah. Penapaian menghasilkan gas yang boleh membengkakkan atau memecahkan bekas: gunakan botol plastik (jangan balang kaca tertutup) dan lepaskan gas. Eko-enzim bukan minuman."})}</div>
      <div class="card stack" style="margin-top:16px" id="ezMix"></div>
      <div class="card stack" id="ezTime"></div>
      <div id="ezAdv"></div>
      <p class="row" style="margin-top:16px"><a class="btn blue" href="#/lab/enzyme">🧪 ${tx({en:"Make it for real (lab)",bm:"Buat yang sebenar (makmal)"})}</a><a class="btn alt" href="#/games">${tx({en:"All games",bm:"Semua permainan"})}</a></p>`;

    function bottleSVG(fillFrac, opt = {}) {
      const top = 60, bot0 = 250, H = bot0 - top, y = bot0 - Math.min(1.05, fillFrac) * H, d = opt.day ?? 0;
      const liq = opt.liq || (sug ? mix("#f3e3b5", "#d9a85a", Math.min(1, sug / Math.max(1, wat) * 8)) : "#e6f3fb");
      const peels = Array.from({ length: Math.min(14, Math.round((opt.peelN ?? peel / BOT[bot].p[0] * 30))) }, (_, k) => {
        const sink = d > 45, py = sink ? bot0 - 14 - (k % 3) * 10 : y + 8 + (k % 3) * 9, px = 48 + (k * 37) % 104;
        return `<ellipse cx="${px}" cy="${py}" rx="9" ry="5" fill="${["#f28b1d", "#f5c400", "#7cb342"][k % 3]}" transform="rotate(${k * 29} ${px} ${py})" opacity=".9"/>`; }).join("");
      const gas = d >= 1 && d <= 40 ? Math.round(8 * (d < 14 ? 1 : (40 - d) / 26)) : 0;
      const bubbles = Array.from({ length: gas }, (_, k) => `<circle class="ez-bub" style="animation-delay:${(k * .27).toFixed(2)}s" cx="${52 + (k * 23) % 96}" cy="${bot0 - 10 - (k % 4) * 18}" r="${3 + k % 3}" fill="#fff" opacity=".8"/>`).join("");
      const film = d >= 20 && d <= 75 ? `<rect x="42" y="${y - 2}" width="116" height="5" rx="2" fill="#fbfbf5" stroke="#ddd"/>` : "";
      return `<svg viewBox="0 0 200 270" role="img" aria-label="${WQ.esc(tx({en:"Container",bm:"Bekas"}))} ${Math.round(fillFrac * 100)}%">
        <defs><clipPath id="ezClip"><path d="M40 60h120v180a12 12 0 0 1-12 12H52a12 12 0 0 1-12-12z"/></clipPath></defs>
        <rect x="76" y="18" width="48" height="16" rx="4" fill="${opt.open ? "#9fd98f" : "#2e7d23"}" transform="${opt.open ? "rotate(-25 76 34) translate(-6 -10)" : ""}"/>
        <path d="M84 32h32v14l44 14v180a12 12 0 0 1-12 12H52a12 12 0 0 1-12-12V60l44-14z" fill="#f6fbff" stroke="#9fb3c8" stroke-width="4"/>
        <g clip-path="url(#ezClip)"><rect x="40" y="${y}" width="120" height="${bot0 + 10 - y}" fill="${liq}" style="transition:y .3s,height .3s,fill .6s"/>${peels}${bubbles}${film}</g>
        <line x1="34" x2="166" y1="${bot0 - 0.6 * H}" y2="${bot0 - 0.6 * H}" stroke="#d62839" stroke-width="3" stroke-dasharray="7 5"/>
        <text x="168" y="${bot0 - 0.6 * H + 4}" font-size="13" font-weight="800" fill="#d62839">60%</text>
        <text x="100" y="${bot0 + 18}" text-anchor="middle" font-size="13" font-weight="800" fill="#55657a">${Math.round(fillFrac * 100)}% ${tx({en:"full",bm:"penuh"})}</text></svg>`;
    }
    function mixPanel() {
      const B = BOT[bot], v = vol(sug, peel, wat), f = v / B.V, tot = sug + peel + wat;
      const seg = (n, c, lbl) => `<i style="flex:${n || 0.0001};background:${c}">${n / tot > 0.08 ? lbl : ""}</i>`;
      return `<h2>1. ${tx({en:"Mix the recipe",bm:"Adun resipi"})}</h2>
        <p>${tx({en:"Recipe by mass: <b>1</b> part brown sugar (or molasses / gula merah) : <b>3</b> parts fruit & vegetable peels : <b>10</b> parts water. Fill the container to between 40% and 60%, leaving space for gas.",bm:"Resipi mengikut jisim: <b>1</b> bahagian gula perang (atau molases / gula merah) : <b>3</b> bahagian kulit buah & sayur : <b>10</b> bahagian air. Isikan bekas antara 40% hingga 60%, tinggalkan ruang untuk gas."})}</p>
        <div class="ez-bots" role="group">${["1.5", "5", "10"].map((k, n) => `<button class="ez-bot" data-b="${k}" aria-pressed="${k === bot}"><svg viewBox="0 0 40 60" width="${22 + n * 10}" height="${34 + n * 13}" aria-hidden="true"><path d="M15 4h10v8l9 6v36a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V18l9-6z" fill="#e6f3fb" stroke="#1f6fd1" stroke-width="3"/></svg><br>${k} L</button>`).join("")}</div>
        <div class="ez-wrap"><div class="ez-sl">
          ${[["s", "🟤", {en:"Brown sugar",bm:"Gula perang"}, sug, B.s, "g"], ["p", "🍊", {en:"Fruit & veg peels",bm:"Kulit buah & sayur"}, peel, B.p, "g"], ["w", "💧", {en:"Water",bm:"Air"}, wat, B.w, "mL"]]
            .map(([k, i, n, v, [mx, st], u]) => `<label for="ez-${k}"><span>${i} ${tx(n)}</span><span id="ezv-${k}">${v} ${u}</span></label><input type="range" id="ez-${k}" min="0" max="${mx}" step="${st}" value="${v}">`).join("")}
          <p class="small muted" style="margin:8px 0 2px">${tx({en:"Your ratio (by mass)",bm:"Nisbah anda (mengikut jisim)"})}</p>
          <div class="ez-ratio" id="ezRatio">${tot ? seg(sug, "#8a5a2b", "1") + seg(peel, "#f28b1d", (peel / Math.max(1, sug)).toFixed(1)) + seg(wat, "#1f6fd1", (wat / Math.max(1, sug)).toFixed(1)) : `<i style="flex:1;background:#e8eef4;color:var(--muted)">–</i>`}</div>
          <p class="small" id="ezRtxt">${sug ? `1 : ${(peel / sug).toFixed(1)} : ${(wat / sug).toFixed(1)}` : ""} ${adv() && tot ? ` · ${tx({en:"volume",bm:"isi padu"})} ≈ ${(v / 1000).toFixed(2)} L ${tx({en:"of",bm:"daripada"})} ${B.V / 1000} L` : ""}</p>
          <div class="row"><button class="btn" id="ezCheck">✅ ${tx({en:"Check my mix",bm:"Semak adunan saya"})}</button>${!solved ? `<button class="btn alt" id="ezHint">💡 ${tx({en:"Hint",bm:"Petunjuk"})}</button>` : ""}</div>
          <div aria-live="polite">${msg ? `<div class="note ${msg.c}" style="margin-top:10px">${tx(msg.t)}</div>` : ""}
          ${hint ? `<div class="note" style="margin-top:10px">${adv()
            ? tx({en:`Let sugar = s grams. Volume ≈ 10s (water) + 3s (peels) + 0.62s (dissolved sugar) = 13.6s mL. Keep it ≤ 60% of ${B.V} mL: s ≤ ${Math.floor(0.6 * B.V / 13.62)} g. Pick a round number below that, then multiply by 3 and by 10.`,bm:`Katakan gula = s gram. Isi padu ≈ 10s (air) + 3s (kulit) + 0.62s (gula larut) = 13.6s mL. Pastikan ≤ 60% daripada ${B.V} mL: s ≤ ${Math.floor(0.6 * B.V / 13.62)} g. Pilih nombor bulat di bawahnya, kemudian darab dengan 3 dan dengan 10.`})
            : tx({en:"Example for the 1.5 L bottle: 50 g sugar, then 3 × 50 = 150 g peels, then 10 × 50 = 500 mL water. Can you make a bit more and still stay under the red line?",bm:"Contoh untuk botol 1.5 L: 50 g gula, kemudian 3 × 50 = 150 g kulit, kemudian 10 × 50 = 500 mL air. Bolehkah anda buat lebih sedikit dan masih di bawah garisan merah?"})}</div>` : ""}</div>
        </div><div class="ez-vis" id="ezVis">${bottleSVG(f)}</div></div>`;
    }
    function check() {
      const v = vol(sug, peel, wat), f = v / BOT[bot].V, rp = peel / sug, rw = wat / sug;
      if (!sug || !peel || !wat) msg = {c:"warn",t:{en:"You need all three: sugar, peels and water.",bm:"Anda perlukan ketiga-tiganya: gula, kulit buah dan air."}};
      else if (rp < 2.7 || rp > 3.3) msg = {c:"warn",t:{en:`Peels should be 3 × the sugar. You have ${rp.toFixed(1)} ×. Try ${3 * sug} g of peels.`,bm:`Kulit buah patut 3 × gula. Anda ada ${rp.toFixed(1)} ×. Cuba ${3 * sug} g kulit buah.`}};
      else if (rw < 9 || rw > 11) msg = {c:"warn",t:{en:`Water should be 10 × the sugar. You have ${rw.toFixed(1)} ×. Try ${10 * sug} mL of water.`,bm:`Air patut 10 × gula. Anda ada ${rw.toFixed(1)} ×. Cuba ${10 * sug} mL air.`}};
      else if (f > 0.62) msg = {c:"danger",t:{en:`Ratio correct, but the container is ${Math.round(f * 100)}% full. Gas needs space or the bottle may burst! Make less.`,bm:`Nisbah betul, tetapi bekas ${Math.round(f * 100)}% penuh. Gas perlukan ruang atau botol boleh pecah! Kurangkan.`}};
      else if (f < 0.4) msg = {c:"warn",t:{en:`Ratio correct, but only ${Math.round(f * 100)}% full. You can make more: aim for 40–60%.`,bm:`Nisbah betul, tetapi hanya ${Math.round(f * 100)}% penuh. Anda boleh buat lebih: sasarkan 40–60%.`}};
      else { msg = {c:"ok",t:{en:`Perfect! 1 : ${rp.toFixed(1)} : ${rw.toFixed(1)}, ${Math.round(f * 100)}% full. Close the lid and start the clock below.`,bm:`Sempurna! 1 : ${rp.toFixed(1)} : ${rw.toFixed(1)}, ${Math.round(f * 100)}% penuh. Tutup penutup dan mulakan masa di bawah.`}}; if (!solved) { solved = true; WQ.beep(true); WQ.anim($("#ezMix"), "pop"); } }
      if (msg.c !== "ok") { WQ.beep(false); }
    }
    function timePanel() {
      if (!solved) return `<h2>2. ${tx({en:"Ferment for 3 months",bm:"Tapai selama 3 bulan"})}</h2><p class="muted">🔒 ${tx({en:"Solve the recipe first.",bm:"Selesaikan resipi dahulu."})}</p>`;
      return `<h2>2. ${tx({en:"Ferment for 3 months",bm:"Tapai selama 3 bulan"})}</h2>
        <div class="ez-wrap"><div class="stack ez-tl">
          <label for="ezDay" style="font-weight:800" id="ezDayL"></label>
          <input type="range" id="ezDay" min="0" max="90" step="1" value="${day}">
          <div class="ez-ticks" aria-hidden="true">${[[0, "0"], [30, tx({en:"1 month",bm:"1 bulan"})], [60, tx({en:"2 months",bm:"2 bulan"})], [90, tx({en:"3 months",bm:"3 bulan"})]].map(([d, l]) => `<span style="left:${d / 90 * 100}%">${l}</span>`).join("")}</div>
          <div id="ezTLb" class="stack"></div>
        </div><div class="ez-vis" id="ezTLv"></div></div>`;
    }
    function timeUpdate() { // fills the parts that change with the day, leaving the slider in place
      if (!solved) return;
      const ev = EV.find(e => day >= e[0] && day <= e[1]), f = vol(sug, peel, wat) / BOT[bot].V, open = day >= 1 && day <= 30;
      $("#ezDayL").innerHTML = `📅 ${tx({en:"Day",bm:"Hari"})} ${day} / 90 · ${tx({en:"Week",bm:"Minggu"})} ${Math.min(13, Math.floor(day / 7) + 1)}`;
      $("#ezTLb").innerHTML = `<div class="note ${ev[5]} ez-ev" aria-live="polite"><span class="i">${ev[2]}</span><div>${WQ.lang === "bm" ? ev[4] : ev[3]}${open ? `<br><b>🔓 ${tx({en:"Today: open the lid to release gas.",bm:"Hari ini: buka penutup untuk melepaskan gas."})}</b>` : ""}</div></div>
          ${day >= 14 ? `<div class="note warn small"><b>🚩 ${tx({en:"Signs of trouble",bm:"Tanda masalah"})}:</b> ${tx({en:"a rotten or sewage smell, or fuzzy black, green or blue mould. Usual causes: too little sugar, cooked or oily food in the mix, or peels left above the liquid. Common fix: add a little more brown sugar, push the peels down and wait. If it still smells rotten, put it in the compost and start again.",bm:"bau busuk atau bau kumbahan, atau kulat berbulu hitam, hijau atau biru. Punca biasa: gula terlalu sedikit, makanan bermasak atau berminyak dalam campuran, atau kulit buah di atas cecair. Penyelesaian biasa: tambah sedikit gula perang, tekan kulit buah ke bawah dan tunggu. Jika masih berbau busuk, masukkan ke dalam kompos dan mula semula."})}</div>` : ""}
          ${day >= 90 ? (harvested
            ? `<div class="note ok"><b>🍯 ${tx({en:"Harvested!",bm:"Sudah dituai!"})}</b> ${tx({en:"Store the liquid in labelled plastic bottles away from sunlight. Always dilute before use (community guides suggest about 1:100 for cleaning and 1:500–1:1000 for watering plants). The leftover peels go into the compost bin, or start your next batch.",bm:"Simpan cecair dalam botol plastik berlabel, jauh dari cahaya matahari. Sentiasa cairkan sebelum digunakan (panduan komuniti mencadangkan kira-kira 1:100 untuk mencuci dan 1:500–1:1000 untuk menyiram pokok). Sisa kulit buah dimasukkan ke dalam tong kompos, atau mulakan kelompok baharu."})} <a href="#/game/compost">🌱 ${tx({en:"Compost Master",bm:"Pakar Kompos"})}</a></div>`
            : `<button class="btn" id="ezHarv">🧺 ${tx({en:"Filter and harvest",bm:"Tapis dan tuai"})}</button>`) : ""}`;
      $("#ezTLv").innerHTML = harvested && day >= 90 ? harvestSVG() : bottleSVG(f, { day, liq: mix("#e8c27a", "#6b4220", day / 90), open, peelN: Math.round(peel / BOT[bot].p[0] * 30) });
      if ($("#ezHarv")) $("#ezHarv").onclick = () => { harvested = true; WQ.beep(true); WQ.award("enzyme"); timeUpdate(); };
    }
    function harvestSVG() {
      return `<svg viewBox="0 0 200 270" role="img" aria-label="${WQ.esc(tx({en:"Filtering the eco-enzyme",bm:"Menapis eko-enzim"}))}">
        <path d="M30 40h140l-50 70v20H80v-20z" fill="#f6fbff" stroke="#9fb3c8" stroke-width="4"/><path d="M40 46h120l-40 55H80z" fill="#fff" stroke="#c9b28a" stroke-dasharray="4 3"/>
        ${[60, 85, 110, 135, 98, 72, 122].map((x, k) => `<ellipse cx="${x}" cy="${56 + (k % 3) * 9}" rx="9" ry="5" fill="#7a5530" opacity=".85"/>`).join("")}
        <path d="M100 132v20" stroke="#6b4220" stroke-width="4" stroke-dasharray="4 4"/>
        <path d="M70 160h60v84a10 10 0 0 1-10 10H80a10 10 0 0 1-10-10z" fill="#f6fbff" stroke="#9fb3c8" stroke-width="4"/><rect x="73" y="185" width="54" height="66" rx="7" fill="#6b4220"/>
        <text x="100" y="225" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">ECO</text><text x="160" y="70" font-size="24">🌱</text><text x="150" y="98" font-size="11" font-weight="800" fill="#3a9a2c">${tx({en:"residue",bm:"sisa"})}</text></svg>`;
    }
    function advPanel() {
      if (!adv()) return "";
      return `<div class="card stack"><h2>⚗️ ${tx({en:"What is happening inside?",bm:"Apa yang berlaku di dalam?"})}</h2>
        <p>${tx({en:"Wild yeasts and bacteria living on the peels do the work, in stages:",bm:"Yis dan bakteria liar pada kulit buah melakukan kerja, secara berperingkat:"})}</p>
        <ol class="stack" style="padding-left:20px">
          <li>${tx({en:"Sucrose is split into glucose and fructose (by the enzyme invertase):",bm:"Sukrosa dipecahkan kepada glukosa dan fruktosa (oleh enzim invertase):"})}<div class="ez-eq">C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ + C₆H₁₂O₆</div></li>
          <li>${tx({en:"Yeasts ferment the sugars to ethanol and carbon dioxide: this is the gas you release in month 1.",bm:"Yis menapai gula kepada etanol dan karbon dioksida: inilah gas yang anda lepaskan pada bulan 1."})}<div class="ez-eq">C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂</div></li>
          <li>${tx({en:"Acetic acid bacteria use oxygen in the headspace to oxidise ethanol to acetic acid (vinegar):",bm:"Bakteria asid asetik menggunakan oksigen di ruang atas untuk mengoksidakan etanol kepada asid asetik (cuka):"})}<div class="ez-eq">C₂H₅OH + O₂ → CH₃COOH + H₂O</div></li>
          <li>${tx({en:"Lactic acid bacteria also turn some sugar into lactic acid. The organic acids bring the final pH down to roughly 3–4, which preserves the liquid.",bm:"Bakteria asid laktik juga menukar sebahagian gula kepada asid laktik. Asid organik menurunkan pH akhir kepada kira-kira 3–4, yang mengawet cecair."})}<div class="ez-eq">C₆H₁₂O₆ → 2 CH₃CH(OH)COOH</div></li>
        </ol>
        <p class="small">${tx({en:"Why ≤ 60% full? Every 180 g of glucose fermented releases 88 g of CO₂, about 49 L of gas at 30 °C. The headspace and daily venting stop the pressure building up.",bm:"Mengapa ≤ 60% penuh? Setiap 180 g glukosa yang ditapai membebaskan 88 g CO₂, kira-kira 49 L gas pada 30 °C. Ruang kosong dan pelepasan gas harian menghalang tekanan meningkat."})}</p></div>
      <div class="card stack"><h2>🔎 ${tx({en:"Claims vs evidence",bm:"Dakwaan vs bukti"})}</h2>
        <div class="tablewrap"><table class="tbl small ez-cl"><tr><th>${tx({en:"Claim",bm:"Dakwaan"})}</th><th>${tx({en:"Verdict",bm:"Penilaian"})}</th><th>${tx({en:"Why",bm:"Sebab"})}</th></tr>
          ${[["✅",{en:"Diluted, it works as a mild household cleaner",bm:"Dicairkan, ia berfungsi sebagai pencuci rumah yang ringan"},{en:"Reasonable",bm:"Munasabah"},{en:"It is an acidic liquid with organic acids (like a weak vinegar) that loosen grime and limit some microbes.",bm:"Ia cecair berasid dengan asid organik (seperti cuka lemah) yang menanggalkan kotoran dan menghadkan sesetengah mikrob."}],
             ["✅",{en:"Diluted, it can be a liquid plant fertiliser",bm:"Dicairkan, ia boleh menjadi baja cecair untuk pokok"},{en:"Some support",bm:"Ada sokongan"},{en:"It carries small amounts of nutrients and organic matter. Studies are small; never use it undiluted (pH 3–4 harms roots).",bm:"Ia mengandungi sedikit nutrien dan bahan organik. Kajian masih kecil; jangan guna tanpa dicairkan (pH 3–4 merosakkan akar)."}],
             ["✅",{en:"It keeps peels out of landfill",bm:"Ia mengelakkan kulit buah ke tapak pelupusan"},{en:"True",bm:"Benar"},{en:"Food waste is the largest part (30.6%) of Malaysian household waste.",bm:"Sisa makanan ialah komponen terbesar (30.6%) sisa domestik Malaysia."}],
             ["❌",{en:"Pouring it into rivers or lakes cleans them",bm:"Menuang ke dalam sungai atau tasik membersihkannya"},{en:"Not supported",bm:"Tidak disokong"},{en:"It is extra organic matter. Microbes that break it down use up dissolved oxygen (higher BOD), which can harm fish. Clean rivers need pollution stopped at source and proper treatment.",bm:"Ia bahan organik tambahan. Mikrob yang menguraikannya menggunakan oksigen terlarut (BOD lebih tinggi), yang boleh membahayakan ikan. Sungai bersih memerlukan pencemaran dihentikan di punca dan rawatan yang betul."}],
             ["❌",{en:"It produces ozone or repairs the ozone layer",bm:"Ia menghasilkan ozon atau membaiki lapisan ozon"},{en:"Not supported",bm:"Tidak disokong"},{en:"Fermentation releases CO₂, not ozone (O₃). No measurements show ozone being produced.",bm:"Penapaian membebaskan CO₂, bukan ozon (O₃). Tiada pengukuran menunjukkan ozon dihasilkan."}],
             ["❌",{en:"It is a medicine or health drink",bm:"Ia ubat atau minuman kesihatan"},{en:"No",bm:"Tidak"},{en:"It is not made under food-safe conditions. Never drink it or put it in eyes.",bm:"Ia tidak dibuat dalam keadaan selamat makanan. Jangan minum atau masukkan ke mata."}]]
            .map(([i, c, v, w]) => `<tr><td>${tx(c)}</td><td><b>${i} ${tx(v)}</b></td><td>${tx(w)}</td></tr>`).join("")}</table></div>
        <p class="small muted">${tx({en:"Good science habit: ask \"how was it measured, and compared with what?\"",bm:"Tabiat sains yang baik: tanya \"bagaimana ia diukur, dan dibandingkan dengan apa?\""})}</p></div>
      ${WQ.aud === "teacher" ? `<div class="note small">🧑‍🏫 ${tx({en:"Teaching note: start a real class batch on the same day as this sim, and let students log smell, gas and colour weekly against the timeline. Use the claims table for a critical-thinking discussion.",bm:"Nota pengajaran: mulakan kelompok sebenar kelas pada hari yang sama dengan simulasi ini, dan minta murid merekod bau, gas dan warna setiap minggu berbanding garis masa. Gunakan jadual dakwaan untuk perbincangan pemikiran kritis."})}</div>` : ""}`;
    }
    function render() {
      $("#ezMix").innerHTML = mixPanel(); $("#ezTime").innerHTML = timePanel(); $("#ezAdv").innerHTML = advPanel(); bind(); timeUpdate();
    }
    function liveMix() { // slider moved: update numbers + picture without rebuilding the sliders
      const B = BOT[bot], v = vol(sug, peel, wat), tot = sug + peel + wat;
      $("#ezv-s").textContent = sug + " g"; $("#ezv-p").textContent = peel + " g"; $("#ezv-w").textContent = wat + " mL";
      $("#ezVis").innerHTML = bottleSVG(v / B.V);
      const seg = (n, c, lbl) => `<i style="flex:${n || 0.0001};background:${c}">${n / tot > 0.08 ? lbl : ""}</i>`;
      $("#ezRatio").innerHTML = tot ? seg(sug, "#8a5a2b", "1") + seg(peel, "#f28b1d", (peel / Math.max(1, sug)).toFixed(1)) + seg(wat, "#1f6fd1", (wat / Math.max(1, sug)).toFixed(1)) : "";
      $("#ezRtxt").textContent = (sug ? `1 : ${(peel / sug).toFixed(1)} : ${(wat / sug).toFixed(1)}` : "") + (adv() && tot ? ` · ${tx({en:"volume",bm:"isi padu"})} ≈ ${(v / 1000).toFixed(2)} L / ${B.V / 1000} L` : "");
    }
    function bind() {
      el.querySelectorAll("[data-b]").forEach(b => b.onclick = () => { if (bot === b.dataset.b) return; bot = b.dataset.b; sug = peel = wat = 0; msg = null; solved = harvested = false; day = 0; render(); });
      [["s", v => sug = v], ["p", v => peel = v], ["w", v => wat = v]].forEach(([k, set]) => $("#ez-" + k).oninput = e => { set(+e.target.value); msg = null; liveMix(); });
      $("#ezCheck").onclick = () => { check(); render(); };
      if ($("#ezHint")) $("#ezHint").onclick = () => { hint = !hint; render(); };
      if ($("#ezDay")) $("#ezDay").oninput = e => { day = +e.target.value; timeUpdate(); };
    }
    render();
  }});

function mix(a, b, f) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, f))).toString(16).padStart(2, "0")).join("");
}
})();
