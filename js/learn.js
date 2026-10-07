/* Learn: a 7-chapter interactive journey (route #/learn/<chapter 1-7>). Also exposes WQ.renderLearnPrint(el) for the PDF booklet.
// SOURCES:
//  - Malaysian waste data (39,078 t/day, 1.17 kg/person/day, household composition, ~19,000 t/day in 2005): SWCorp via The Star, 2 Jan 2024 (as given in SPEC.md).
//  - Methane GWP100 = 28: IPCC AR5 WG1 (2013), Ch. 8 (Myhre et al.), Table 8.7.
//  - Landfill gas is roughly 50% methane, 50% carbon dioxide: US EPA Landfill Methane Outreach Program, "Basic Information about Landfill Gas".
//  - Recycling aluminium saves more than 90% of the energy of making new metal: The Aluminum Association.
//  - Circular economy principles (eliminate waste and pollution; circulate products and materials at their highest value; regenerate nature): Ellen MacArthur Foundation.
//  - EU waste hierarchy (prevention, preparing for re-use, recycling, other recovery, disposal): Directive 2008/98/EC, Article 4. "Refuse" step: Bea Johnson, Zero Waste Home (2013).
//  - EPR for packaging in Malaysia (KPKT): voluntary phase from 2026, mandatory by 2030; national recycling rate 37.9% in 2024: Bernama, 9 Sep 2025, "Malaysia hopes EPR will stem tide of plastic waste".
//  - GRI 306: Waste 2020 (Global Reporting Initiative) for corporate waste reporting.
//  - Malaysia's Roadmap Towards Zero Single-Use Plastics 2018-2030 (MESTECC, 2018).
//  - SDG targets 11.6, 12.3, 12.5, 13, 14.1, 15: United Nations, 2030 Agenda for Sustainable Development (A/RES/70/1).
//  - Student cost estimates: UPM ENG3104 proposals 2024 (G10 bioplastic pot RM0.84; G5 plastic-bag tote RM4.66), see research/eng3104_and_videos.md.
*/
(() => {
const t = o => WQ.t(o), P = o => WQ.t(WQ.pick(o)), E = s => WQ.esc(s);
const A = () => WQ.aud, SCI = () => A() !== "kids", BIZ = () => A() === "adults" || A() === "teacher", TCH = () => A() === "teacher";
const fmt = (n, d = 0) => Number(n).toLocaleString(WQ.lang === "bm" ? "ms-MY" : "en-MY", { maximumFractionDigits: d, minimumFractionDigits: d });

const U = {
  title: { en: "Learn: Waste-to-Wealth", bm: "Belajar: Sisa kepada Kekayaan" },
  sub: { en: "Seven short chapters. Finish each quick check to earn the Learn badge.", bm: "Tujuh bab ringkas. Selesaikan setiap semakan pantas untuk memperoleh lencana Belajar." },
  chap: { en: "Chapter", bm: "Bab" }, of: { en: "of", bm: "daripada" },
  prev: { en: "← Previous", bm: "← Sebelumnya" }, next: { en: "Next chapter →", bm: "Bab seterusnya →" },
  done: { en: "chapters complete", bm: "bab selesai" },
  qc: { en: "Quick check", bm: "Semakan pantas" },
  right: { en: "Correct!", bm: "Betul!" }, wrong: { en: "Not quite. Try again!", bm: "Belum tepat. Cuba lagi!" },
  chDone: { en: "Chapter complete! ✅", bm: "Bab selesai! ✅" },
  allDone: { en: "You finished every chapter. You are ready for the games, labs and certificate!", bm: "Anda telah menamatkan semua bab. Anda bersedia untuk permainan, makmal dan sijil!" },
  sci: { en: "🔬 The science", bm: "🔬 Sainsnya" }, biz: { en: "💼 ESG and business angle", bm: "💼 Sudut ESG dan perniagaan" },
  tnote: { en: "🧑‍🏫 Teaching note", bm: "🧑‍🏫 Nota pengajaran" },
  ans: { en: "Answer", bm: "Jawapan" }, try: { en: "Try it:", bm: "Cuba:" },
  play: { en: "Play", bm: "Main" }, lab: { en: "Lab", bm: "Makmal" }
};

/* ---------- reusable pieces ---------- */
const box = (cls, head, body) => `<div class="note ${cls} ln-box"><b>${t(head)}</b><div>${body}</div></div>`;
const sciBox = body => SCI() ? box("", U.sci, body) : "";
const bizBox = body => BIZ() ? box("ok", U.biz, body) : "";
const LABS = {
  candle: { i: "🕯️", w: { en: "Used cooking oil", bm: "Minyak masak terpakai" }, p: { en: "Scented candle", bm: "Lilin wangi" } },
  petfood: { i: "🐟", w: { en: "Fish waste", bm: "Sisa ikan" }, p: { en: "Pet food", bm: "Makanan haiwan" } },
  treasure: { i: "👜", w: { en: "Old clothes and plastic bags", bm: "Pakaian lama dan beg plastik" }, p: { en: "Tote bag", bm: "Beg tote" } },
  litmus: { i: "🧪", w: { en: "Coloured plant scraps", bm: "Sisa tumbuhan berwarna" }, p: { en: "Natural pH indicator paper", bm: "Kertas penunjuk pH semula jadi" } },
  odour: { i: "☕", w: { en: "Used coffee grounds", bm: "Hampas kopi" }, p: { en: "Odour absorber", bm: "Penyerap bau" } },
  watering: { i: "🪴", w: { en: "Plastic bottles", bm: "Botol plastik" }, p: { en: "Self-watering planter", bm: "Pasu siram sendiri" } },
  enzyme: { i: "🍊", w: { en: "Fruit and vegetable peels", bm: "Kulit buah dan sayur" }, p: { en: "Eco-enzyme cleaner", bm: "Pembersih eko-enzim" } },
  ecobrick: { i: "🧱", w: { en: "Soft plastic wrappers", bm: "Pembalut plastik lembut" }, p: { en: "Ecobricks", bm: "Bata eko" } },
  compost: { i: "🌱", w: { en: "Food and garden waste", bm: "Sisa makanan dan taman" }, p: { en: "Compost", bm: "Kompos" } },
  bioplastic: { i: "🌽", w: { en: "Plant starch (instead of plastic)", bm: "Kanji tumbuhan (ganti plastik)" }, p: { en: "Bioplastic pot", bm: "Pasu bioplastik" } },
  vgarden: { i: "🪴", w: { en: "Plastic bottles and compost", bm: "Botol plastik dan kompos" }, p: { en: "Vertical garden", bm: "Taman menegak" } },
  hydro: { i: "🥬", w: { en: "Plastic bottles", bm: "Botol plastik" }, p: { en: "Hydroponic vegetables", bm: "Sayur hidroponik" } },
  fused: { i: "☂️", w: { en: "Plastic bags and straws", bm: "Beg plastik dan straw" }, p: { en: "Bags and a mini umbrella", bm: "Beg dan payung mini" } },
  lifebuoy: { i: "🛟", w: { en: "Bubble wrap", bm: "Balutan gelembung" }, p: { en: "Float ring model", bm: "Model gelang pelampung" } },
  sleepbag: { i: "🛌", w: { en: "Bubble wrap and old cloth", bm: "Balutan gelembung dan kain lama" }, p: { en: "3-in-1 sleeping bag", bm: "Beg tidur 3-dalam-1" } }
};
const labName = id => { const L = (WQ.labs || []).find(l => l.id === id); return L && (L.title || L.name) ? t(L.title || L.name) : t(LABS[id].p); };
const labChip = id => `<a class="ln-chip" href="#/lab/${id}">${LABS[id].i} ${E(labName(id))}</a>`;
const GAMES = { sort: ["🗑️", { en: "Sort It Out!", bm: "Asingkan Sampah!" }], quiz: ["❓", { en: "Quiz", bm: "Kuiz" }], myth: ["🤔", { en: "Myth or Fact", bm: "Mitos atau Fakta" }], match: ["🃏", { en: "Memory Match", bm: "Padanan Memori" }],
  footprint: ["👣", { en: "Footprint", bm: "Jejak Karbon" }], cash: ["💰", { en: "Waste to Cash", bm: "Sisa jadi Wang" }], compost: ["🌱", { en: "Compost sim", bm: "Simulasi kompos" }], enzyme: ["🍊", { en: "Eco-enzyme sim", bm: "Simulasi eko-enzim" }], ph: ["🧪", { en: "pH lab", bm: "Makmal pH" }] };
const gameChip = id => { const g = WQ.games[id], d = GAMES[id] || ["🎮", { en: id, bm: id }]; return `<a class="ln-chip g" href="#/game/${id}">${g ? g.icon : d[0]} ${E(t(g ? g.title : d[1]))}</a>`; };

/* ---------- Chapter 1 data ---------- */
const COMP = [["🍲", 30.6, "Food waste", "Sisa makanan"], ["🧴", 21.9, "Plastic", "Plastik"], ["📄", 15.3, "Paper", "Kertas"], ["👶", 8.2, "Disposable diapers", "Lampin pakai buang"],
  ["⚠️", 4.2, "Hazardous household waste", "Sisa berbahaya isi rumah"], ["🗑️", 3.6, "Commingled (mixed)", "Sisa bercampur"], ["🍂", 2.9, "Garden waste", "Sisa taman"], ["🫙", 2.7, "Glass", "Kaca"],
  ["🥫", 2.4, "Metal", "Logam"], ["👕", 2.3, "Textiles", "Tekstil"], ["🧃", 1.7, "Beverage cartons", "Kotak minuman"], ["🛞", 1.1, "Rubber", "Getah"], ["🪵", 1.0, "Wood", "Kayu"], ["😷", 0.7, "Face masks", "Pelitup muka"]];
const COLORS = ["#3a9a2c", "#f28b1d", "#1f6fd1", "#7b4bc4", "#d62839", "#5f6b75", "#13a39b", "#8a5a2b", "#9aa5b1", "#e05a9c", "#c9a227", "#444", "#a0522d", "#6c8ebf"];
function compSVG(anim) {
  const rh = 34, w = 400, x0 = 4, bw = 300, max = 30.6, h = COMP.length * rh + 6;
  return `<svg class="ln-svg ${anim ? "anim" : ""}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${E(t({ en: "Household waste composition in Malaysia", bm: "Komposisi sisa isi rumah di Malaysia" }))}">${COMP.map((c, i) => {
    const y = i * rh, bl = Math.max(2, c[1] / max * bw);
    return `<text x="${x0}" y="${y + 13}" class="ln-svgt">${c[0]} ${E(WQ.lang === "bm" ? c[3] : c[2])}</text><rect class="ln-bar" style="animation-delay:${i * 60}ms" x="${x0}" y="${y + 17}" width="${bl}" height="11" rx="5" fill="${COLORS[i]}"/><text x="${x0 + bl + 6}" y="${y + 27}" class="ln-svgv">${fmt(c[1], 1)}%</text>`;
  }).join("")}</svg>`;
}
function stackSVG(anim) { // 1.17 kg split by the household mix
  const parts = [[COMP[0], 358], [COMP[1], 256], [COMP[2], 179], [COMP[3], 96], [["➕", 0, "Everything else", "Lain-lain"], 281]];
  let y = 300; const sc = 0.22, out = [];
  parts.forEach(([c, g], i) => { const hh = g * sc; y -= hh; out.push(`<g class="ln-layer" style="animation-delay:${i * 180}ms"><rect x="60" y="${y}" width="120" height="${hh - 2}" rx="8" fill="${i < 4 ? COLORS[i] : "#9aa5b1"}"/><text x="120" y="${y + hh / 2 + 5}" text-anchor="middle" class="ln-svgw">${c[0]} ${g} g</text><text x="190" y="${y + hh / 2 + 5}" class="ln-svgt">${E(WQ.lang === "bm" ? c[3] : c[2])}</text></g>`); });
  return `<svg class="ln-svg ln-stack ${anim ? "anim" : ""}" viewBox="0 0 330 310" role="img" aria-label="1.17 kg">${out.join("")}<line x1="40" y1="300" x2="200" y2="300" stroke="#1d3557" stroke-width="3"/><text x="120" y="${y - 10}" text-anchor="middle" class="ln-svgb">1.17 kg</text></svg>`;
}
function growthSVG(anim) {
  const H = 200, s = H / 40000, b1 = 19000 * s, b2 = 39078 * s;
  return `<svg class="ln-svg ln-grow ${anim ? "anim" : ""}" viewBox="0 0 300 260" role="img" aria-label="2005: 19,000 t; 2024: 39,078 t">
    <rect class="ln-col" x="50" y="${220 - b1}" width="70" height="${b1}" rx="8" fill="#9aa5b1"/><rect class="ln-col" style="animation-delay:300ms" x="180" y="${220 - b2}" width="70" height="${b2}" rx="8" fill="#d62839"/>
    <text x="85" y="${212 - b1}" text-anchor="middle" class="ln-svgb">~19,000 t</text><text x="215" y="${212 - b2}" text-anchor="middle" class="ln-svgb">39,078 t</text>
    <line x1="30" y1="220" x2="280" y2="220" stroke="#1d3557" stroke-width="3"/><text x="85" y="245" text-anchor="middle" class="ln-svgt">2005</text><text x="215" y="245" text-anchor="middle" class="ln-svgt">2024</text></svg>`;
}

/* ---------- Chapter 2 data: waste hierarchy ---------- */
const HIER = [
  { i: "🙅", c: "#2e7d23", n: { en: "Refuse", bm: "Tolak" }, d: { kids: { en: "Say “no thanks” to things you don't need.", bm: "Katakan “tidak, terima kasih” kepada barang yang tidak perlu." }, teens: { en: "Stop waste before it exists: turn down single-use items and freebies you will not use.", bm: "Hentikan sisa sebelum ia wujud: tolak barang guna sekali dan cenderahati yang tidak akan digunakan." } },
    ex: { en: "Plastic straws, extra plastic bags, flyers, free pens you will never use.", bm: "Straw plastik, beg plastik tambahan, risalah, pen percuma yang tidak akan digunakan." }, labs: ["bioplastic"] },
  { i: "📉", c: "#3a9a2c", n: { en: "Reduce", bm: "Kurangkan" }, d: { kids: { en: "Use less. Take only what you can finish.", bm: "Guna kurang. Ambil apa yang boleh dihabiskan sahaja." }, teens: { en: "Use fewer resources: buy less, choose less packaging and plan meals so food is not wasted.", bm: "Guna kurang sumber: beli kurang, pilih pembungkusan yang sedikit dan rancang hidangan supaya makanan tidak dibazirkan." } },
    ex: { en: "Refill bottles, print double-sided, buy in bulk, take smaller food portions.", bm: "Isi semula botol, cetak dua muka, beli secara pukal, ambil hidangan kecil." }, labs: [] },
  { i: "🔁", c: "#5cbf4a", n: { en: "Reuse", bm: "Guna semula" }, d: { kids: { en: "Use things again, or give them a new job.", bm: "Guna barang sekali lagi, atau beri ia tugas baharu." }, teens: { en: "Keep products in use for longer: repair, share, donate or repurpose them (upcycling).", bm: "Panjangkan hayat produk: baiki, kongsi, derma atau guna untuk tujuan baharu (kitar naik)." } },
    ex: { en: "Old T-shirt to tote bag, bottle to planter, jam jar to pencil holder.", bm: "Baju-T lama jadi beg tote, botol jadi pasu, balang jem jadi bekas pensel." }, labs: ["treasure", "watering", "ecobrick"] },
  { i: "♻️", c: "#f2b01d", n: { en: "Recycle", bm: "Kitar semula" }, d: { kids: { en: "Turn old things into new things. Food scraps can become compost!", bm: "Jadikan barang lama barang baharu. Sisa makanan boleh jadi kompos!" }, teens: { en: "Turn waste materials back into raw materials: paper, plastic, metal and glass go to the SWCorp bins; food waste can be composted or fermented.", bm: "Jadikan bahan sisa bahan mentah semula: kertas, plastik, logam dan kaca ke tong SWCorp; sisa makanan boleh dikompos atau ditapai." } },
    ex: { en: "Paper to new paper, cans to new cans, peels to compost or eco-enzyme, used cooking oil to candles.", bm: "Kertas jadi kertas baharu, tin jadi tin baharu, kulit buah jadi kompos atau eko-enzim, minyak masak terpakai jadi lilin." }, labs: ["compost", "enzyme", "candle", "petfood", "odour", "litmus"] },
  { i: "⚡", c: "#f28b1d", n: { en: "Recover", bm: "Pulih guna" }, d: { kids: { en: "Get energy from waste we cannot recycle.", bm: "Dapatkan tenaga daripada sisa yang tidak boleh dikitar." }, teens: { en: "Recover energy from what is left, for example biogas from food waste or electricity from waste-to-energy plants.", bm: "Pulih guna tenaga daripada baki sisa, contohnya biogas daripada sisa makanan atau elektrik daripada loji sisa-kepada-tenaga." } },
    ex: { en: "Biogas digesters, waste-to-energy plants.", bm: "Pencerna biogas, loji sisa-kepada-tenaga." }, labs: [] },
  { i: "🚮", c: "#d62839", n: { en: "Dispose", bm: "Lupus" }, d: { kids: { en: "Throwing away is the LAST choice.", bm: "Membuang ialah pilihan TERAKHIR." }, teens: { en: "Safe disposal in a sanitary landfill is the last resort: all the value in the material is lost.", bm: "Pelupusan selamat di tapak pelupusan sanitari ialah pilihan terakhir: semua nilai bahan itu hilang." } },
    ex: { en: "Used tissues, dirty masks, broken mirrors (wrapped safely).", bm: "Tisu terpakai, pelitup muka kotor, cermin pecah (dibalut dengan selamat)." }, labs: [] }
];
let hSel = 0, circ = false, flips = {}, binSel = "blue";

/* ---------- Chapter 3 diagrams ---------- */
function linearSVG() {
  const N = [["⛏️", { en: "Take", bm: "Ambil" }], ["🏭", { en: "Make", bm: "Buat" }], ["🛒", { en: "Use", bm: "Guna" }], ["🗑️", { en: "Throw away", bm: "Buang" }]];
  return `<svg class="ln-svg ln-cyc" viewBox="0 0 400 230" role="img" aria-label="${E(t({ en: "Linear economy: take, make, use, throw away", bm: "Ekonomi linear: ambil, buat, guna, buang" }))}">
   <defs><marker id="lnA" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1d3557"/></marker></defs>
   ${N.slice(0, 3).map((_, i) => `<line class="ln-flow" x1="${78 + i * 90}" y1="90" x2="${100 + i * 90}" y2="90" stroke="#1d3557" stroke-width="4" marker-end="url(#lnA)"/>`).join("")}
   ${N.map((n, i) => `<circle cx="${45 + i * 90}" cy="90" r="30" fill="${i === 3 ? "#fde3e6" : "#e3f7dc"}"/><text x="${45 + i * 90}" y="101" text-anchor="middle" font-size="28">${n[0]}</text><text x="${45 + i * 90}" y="142" text-anchor="middle" class="ln-svgb">${E(t(n[1]))}</text>`).join("")}
   <path class="ln-flow" d="M315 120 L315 185" stroke="#d62839" stroke-width="4" marker-end="url(#lnA)"/><text x="285" y="215" text-anchor="middle" class="ln-svgt">⛰️ ${E(t({ en: "landfill & pollution", bm: "tapak pelupusan & pencemaran" }))}</text></svg>`;
}
function circularSVG() {
  const N = [["✏️", { en: "Design", bm: "Reka" }], ["🏭", { en: "Make", bm: "Buat" }], ["🛒", { en: "Use", bm: "Guna" }], ["🔧", { en: "Repair & reuse", bm: "Baiki & guna semula" }], ["♻️", { en: "Recycle & compost", bm: "Kitar & kompos" }]];
  const cx = 200, cy = 125, r = 88, pt = k => { const a = -Math.PI / 2 + k * 2 * Math.PI / N.length; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const arcs = N.map((_, i) => { const a1 = -Math.PI / 2 + (i + .2) * 2 * Math.PI / N.length, a2 = -Math.PI / 2 + (i + .8) * 2 * Math.PI / N.length;
    return `<path class="ln-flow" d="M${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}" fill="none" stroke="#3a9a2c" stroke-width="4" marker-end="url(#lnB)"/>`; }).join("");
  return `<svg class="ln-svg ln-cyc" viewBox="0 0 400 262" role="img" aria-label="${E(t({ en: "Circular economy loop", bm: "Gelung ekonomi kitaran" }))}">
   <defs><marker id="lnB" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#3a9a2c"/></marker></defs>${arcs}
   <text x="${cx}" y="${cy - 2}" text-anchor="middle" class="ln-svgb">${E(t({ en: "Materials", bm: "Bahan" }))}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" class="ln-svgb">${E(t({ en: "stay in use", bm: "terus digunakan" }))}</text>
   ${N.map((n, i) => { const [x, y] = pt(i), lines = t(n[1]).split(/(?<=&) /), pos = [[x, y - 30, "middle"], [x + 28, y + 4, "start"], [x, y + 38, "middle"], [x, y + 38, "middle"], [x - 28, y - 4, "end"]][i];
     return `<circle cx="${x}" cy="${y}" r="22" fill="#e3f7dc" stroke="#3a9a2c" stroke-width="2"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-size="20">${n[0]}</text><text x="${pos[0]}" y="${pos[1]}" text-anchor="${pos[2]}" class="ln-svgt">${lines.map((l, k) => `<tspan x="${pos[0]}" dy="${k ? 15 : 0}">${E(l)}</tspan>`).join("")}</text>`; }).join("")}</svg>`;
}

/* ---------- Chapter 4: pillars ---------- */
const PILLARS = [
  { i: "🌍", c: "#3a9a2c", n: { en: "Environmental", bm: "Alam sekitar" }, b: [{ en: "Less pollution of air, rivers and sea", bm: "Kurang pencemaran udara, sungai dan laut" }, { en: "Lower greenhouse gas emissions (less methane from landfills)", bm: "Kurang pelepasan gas rumah hijau (kurang metana dari tapak pelupusan)" }, { en: "Conserves raw materials, water and energy", bm: "Memulihara bahan mentah, air dan tenaga" }] },
  { i: "💰", c: "#c9a227", n: { en: "Economic", bm: "Ekonomi" }, b: [{ en: "Value-added products made from cheap or free materials", bm: "Produk nilai tambah daripada bahan murah atau percuma" }, { en: "Green entrepreneurship and small businesses", bm: "Keusahawanan hijau dan perniagaan kecil" }, { en: "New jobs and income opportunities", bm: "Peluang pekerjaan dan pendapatan baharu" }] },
  { i: "🤝", c: "#1f6fd1", n: { en: "Social", bm: "Sosial" }, b: [{ en: "Greater awareness in schools and communities", bm: "Kesedaran yang lebih tinggi di sekolah dan komuniti" }, { en: "Sustainable lifestyles and habits", bm: "Gaya hidup dan tabiat lestari" }, { en: "Innovation, creativity and teamwork", bm: "Inovasi, kreativiti dan kerja berpasukan" }] }
];
/* ---------- Chapter 5: bins ---------- */
const BINS = {
  blue: { c: "#1f6fd1", i: "📄", n: { en: "Blue bin: paper", bm: "Tong biru: kertas" }, y: { en: "Newspapers, magazines, cardboard boxes (flattened), exercise books, envelopes, paper bags.", bm: "Surat khabar, majalah, kotak kadbod (dileperkan), buku latihan, sampul surat, beg kertas." }, n2: { en: "Used tissues, oily pizza boxes, wet or food-soiled paper.", bm: "Tisu terpakai, kotak piza berminyak, kertas basah atau bercampur makanan." } },
  orange: { c: "#f28b1d", i: "🥫", n: { en: "Orange bin: plastic & aluminium/metal", bm: "Tong oren: plastik & aluminium/logam" }, y: { en: "Rinsed plastic bottles and containers, aluminium drink cans, food tins, clean plastic bags.", bm: "Botol dan bekas plastik yang dibilas, tin minuman aluminium, tin makanan, beg plastik bersih." }, n2: { en: "Oily food boxes, used face masks, styrofoam with food left in it.", bm: "Bekas makanan berminyak, pelitup muka terpakai, polistirena berisi sisa makanan." } },
  brown: { c: "#8a5a2b", i: "🫙", n: { en: "Brown bin: glass", bm: "Tong coklat: kaca" }, y: { en: "Glass bottles and jars (rinsed, lids removed).", bm: "Botol dan balang kaca (dibilas, penutup ditanggalkan)." }, n2: { en: "Mirrors, window glass, light bulbs, ceramic plates. Wrap broken glass safely.", bm: "Cermin, kaca tingkap, mentol lampu, pinggan seramik. Balut kaca pecah dengan selamat." } }
};
const STATES = [["Johor", "Johor"], ["Melaka", "Melaka"], ["Negeri Sembilan", "Negeri Sembilan"], ["Pahang", "Pahang"], ["Perlis", "Perlis"], ["Kedah", "Kedah"], ["Kuala Lumpur", "Kuala Lumpur"], ["Putrajaya", "Putrajaya"]];
/* ---------- Chapter 6: SDGs ---------- */
const SDGS = [
  { n: 12, c: "#BF8B2E", t: { en: "Responsible consumption and production", bm: "Penggunaan dan pengeluaran bertanggungjawab" }, d: { kids: { en: "Use what we need and waste less.", bm: "Guna apa yang perlu dan kurangkan pembaziran." }, teens: { en: "Target 12.5: substantially reduce waste generation through prevention, reduction, recycling and reuse by 2030. Target 12.3: halve per-capita food waste.", bm: "Sasaran 12.5: kurangkan penjanaan sisa dengan ketara melalui pencegahan, pengurangan, kitar semula dan guna semula menjelang 2030. Sasaran 12.3: kurangkan separuh sisa makanan per kapita." } }, labs: ["compost", "enzyme", "treasure", "candle", "petfood", "odour"] },
  { n: 13, c: "#3F7E44", t: { en: "Climate action", bm: "Tindakan iklim" }, d: { kids: { en: "Rotting rubbish in landfills makes gases that heat up our planet.", bm: "Sampah yang reput di tapak pelupusan menghasilkan gas yang memanaskan bumi." }, teens: { en: "Keeping food waste out of landfills cuts methane, a strong greenhouse gas. Recycling saves the energy needed to make new materials.", bm: "Mengelakkan sisa makanan ke tapak pelupusan mengurangkan metana, gas rumah hijau yang kuat. Kitar semula menjimatkan tenaga untuk menghasilkan bahan baharu." } }, labs: ["compost", "enzyme", "bioplastic"] },
  { n: 15, c: "#56C02B", t: { en: "Life on land", bm: "Kehidupan di darat" }, d: { kids: { en: "Healthy soil and plants need less rubbish on the land.", bm: "Tanah dan tumbuhan yang sihat perlukan kurang sampah di darat." }, teens: { en: "Compost returns nutrients to soil; less landfill means less land cleared and less leachate polluting soil and groundwater.", bm: "Kompos mengembalikan nutrien kepada tanah; kurang tapak pelupusan bermakna kurang tanah diteroka dan kurang larut resap mencemari tanah serta air bawah tanah." } }, labs: ["compost", "watering", "litmus"] },
  { n: 11, c: "#FD9D24", t: { en: "Sustainable cities and communities", bm: "Bandar dan komuniti mampan" }, d: { kids: { en: "Clean, tidy towns where waste is sorted.", bm: "Bandar yang bersih dan kemas dengan sisa yang diasingkan." }, teens: { en: "Target 11.6: reduce the environmental impact of cities, including better municipal waste management.", bm: "Sasaran 11.6: kurangkan kesan alam sekitar bandar, termasuk pengurusan sisa perbandaran yang lebih baik." } }, labs: ["ecobrick"] },
  { n: 14, c: "#0A97D9", t: { en: "Life below water", bm: "Kehidupan di bawah air" }, d: { kids: { en: "Keep plastic out of rivers and the sea.", bm: "Jauhkan plastik daripada sungai dan laut." }, teens: { en: "Target 14.1: reduce marine pollution, much of which comes from land, such as plastic litter.", bm: "Sasaran 14.1: kurangkan pencemaran marin, kebanyakannya berpunca dari darat seperti sampah plastik." } }, labs: ["ecobrick", "treasure"] }
];
/* ---------- Chapter 7: pledges ---------- */
const PLEDGES = [
  ["Refuse", "Tolak", [{ en: "Say no to plastic straws and extra bags", bm: "Tolak straw plastik dan beg tambahan" }, { en: "Bring my own water bottle and food container", bm: "Bawa botol air dan bekas makanan sendiri" }]],
  ["Reduce", "Kurangkan", [{ en: "Take only the food I can finish", bm: "Ambil makanan secukupnya sahaja" }, { en: "Print on both sides of the paper", bm: "Cetak pada kedua-dua belah kertas" }]],
  ["Reuse", "Guna semula", [{ en: "Use a reusable shopping bag", bm: "Guna beg beli-belah guna semula" }, { en: "Give old clothes, toys and books a second life", bm: "Beri pakaian, mainan dan buku lama kehidupan kedua" }]],
  ["Recycle", "Kitar semula", [{ en: "Rinse and sort recyclables into the blue, orange and brown bins", bm: "Bilas dan asingkan bahan kitar semula ke tong biru, oren dan coklat" }, { en: "Start a compost bin or an eco-enzyme bottle", bm: "Mulakan tong kompos atau botol eko-enzim" }]],
  ["Share", "Kongsi", [{ en: "Teach my family how to sort waste", bm: "Ajar keluarga cara mengasingkan sisa" }, { en: "Join or start an Eco-Club", bm: "Sertai atau tubuhkan Kelab Eko" }]]
];

/* ---------- chapters ---------- */
const CH = [
 { id: "where", icon: "🗑️", title: { en: "Where does our waste go?", bm: "Ke mana sisa kita pergi?" },
   body: pr => `<p class="ln-lead">${P({ kids: { en: "Every day, Malaysians throw away a mountain of rubbish. Let's see what is inside our bins!", bm: "Setiap hari, rakyat Malaysia membuang segunung sampah. Jom lihat apa yang ada dalam tong sampah kita!" },
       teens: { en: "Malaysia generates about 39,078 tonnes of solid waste every day (SWCorp, 2024). Most of it still ends up in landfills, where it takes space, pollutes and releases greenhouse gases.", bm: "Malaysia menjana kira-kira 39,078 tan sisa pepejal setiap hari (SWCorp, 2024). Kebanyakannya masih berakhir di tapak pelupusan, mengambil ruang, mencemar dan membebaskan gas rumah hijau." } })}</p>
     <div class="ln-stats"><div class="ln-stat"><b>39,078 t</b><span>${t({ en: "of solid waste per day in Malaysia (2024)", bm: "sisa pepejal sehari di Malaysia (2024)" })}</span></div>
       <div class="ln-stat"><b>1.17 kg</b><span>${t({ en: "per person, per day", bm: "seorang, sehari" })}</span></div>
       <div class="ln-stat"><b>×2</b><span>${t({ en: "daily waste roughly doubled from 2005 to 2024", bm: "sisa harian hampir berganda dari 2005 hingga 2024" })}</span></div></div>
     <div class="ln-two"><div><h3>${t({ en: "What is in a Malaysian household bin?", bm: "Apa dalam tong sampah rumah di Malaysia?" })}</h3>${compSVG(!pr)}<p class="small muted">${t({ en: "Household waste composition, % by weight. Source: SWCorp via The Star, 2 Jan 2024.", bm: "Komposisi sisa isi rumah, % mengikut berat. Sumber: SWCorp melalui The Star, 2 Jan 2024." })}</p></div>
       <div><h3>${t({ en: "Your 1.17 kg a day, stacked up", bm: "1.17 kg sehari anda, disusun" })}</h3>${stackSVG(!pr)}<p class="small muted">${t({ en: "Rough split using the household mix above.", bm: "Pecahan anggaran menggunakan komposisi isi rumah di atas." })}</p></div></div>
     <div class="ln-two"><div><h3>${t({ en: "Daily waste: 2005 vs 2024", bm: "Sisa harian: 2005 berbanding 2024" })}</h3>${growthSVG(!pr)}</div>
       <div>${pr ? "" : `<h3>${t(U.try)} ${t({ en: "how much does your group throw away?", bm: "berapa banyak kumpulan anda buang?" })}</h3>
         <div class="ln-calc"><label>${t({ en: "Number of people (home, class or school)", bm: "Bilangan orang (rumah, kelas atau sekolah)" })}<input type="number" id="lnPeople" min="1" max="100000" value="4" inputmode="numeric"></label>
         <label>${t({ en: "Time", bm: "Tempoh" })}<select id="lnDays"><option value="1">${t({ en: "1 day", bm: "1 hari" })}</option><option value="7">${t({ en: "1 week", bm: "1 minggu" })}</option><option value="30">${t({ en: "1 month (30 days)", bm: "1 bulan (30 hari)" })}</option><option value="365" selected>${t({ en: "1 year", bm: "1 tahun" })}</option></select></label>
         <div class="ln-out" id="lnOut" aria-live="polite"></div></div>`}
         ${P({ kids: { en: "<p>💡 Food is the biggest part. We can turn it into <a href='#/lab/compost'>compost</a> or <a href='#/lab/enzyme'>eco-enzyme</a>!</p>", bm: "<p>💡 Makanan ialah bahagian terbesar. Kita boleh jadikan ia <a href='#/lab/compost'>kompos</a> atau <a href='#/lab/enzyme'>eko-enzim</a>!</p>" },
           teens: { en: "<p>💡 Food (30.6%), plastic (21.9%) and paper (15.3%) make up about two-thirds of household waste, and all three can be composted or recycled.</p>", bm: "<p>💡 Makanan (30.6%), plastik (21.9%) dan kertas (15.3%) membentuk kira-kira dua pertiga sisa isi rumah, dan ketiga-tiganya boleh dikompos atau dikitar semula.</p>" } })}</div></div>
     ${sciBox(t({ en: `<p>In a landfill, buried food waste has no oxygen. Anaerobic microbes break it down into <b>landfill gas</b>, roughly 50% methane (CH₄) and 50% carbon dioxide (US EPA). For sugar, a simplified equation is <b>C₆H₁₂O₆ → 3 CH₄ + 3 CO₂</b>.</p><p>Methane traps far more heat than CO₂: its global warming potential over 100 years is about <b>28</b> (IPCC AR5, 2013). So 1 kg of methane ≈ 28 kg CO₂-equivalent. Composting with air (aerobic) gives mainly CO₂ and water instead.</p><p>Maths: 1.17 kg × 365 days ≈ <b>427 kg</b> per person per year.</p>`,
       bm: `<p>Di tapak pelupusan, sisa makanan yang tertimbus tiada oksigen. Mikrob anaerobik menguraikannya menjadi <b>gas tapak pelupusan</b>, kira-kira 50% metana (CH₄) dan 50% karbon dioksida (US EPA). Bagi gula, persamaan ringkasnya ialah <b>C₆H₁₂O₆ → 3 CH₄ + 3 CO₂</b>.</p><p>Metana memerangkap haba jauh lebih banyak daripada CO₂: potensi pemanasan globalnya dalam tempoh 100 tahun ialah kira-kira <b>28</b> (IPCC AR5, 2013). Jadi 1 kg metana ≈ 28 kg setara CO₂. Pengkomposan dengan udara (aerobik) pula menghasilkan terutamanya CO₂ dan air.</p><p>Matematik: 1.17 kg × 365 hari ≈ <b>427 kg</b> seorang setahun.</p>` }))}
     ${bizBox(t({ en: "<p>Malaysia's national recycling rate was reported as 37.9% in 2024 (KPKT, via Bernama 2025); experts note this counts recyclables collected, not necessarily recycled. For organisations, waste is a standard ESG disclosure topic (e.g. GRI 306: Waste 2020): tonnes generated, diverted from disposal and sent to disposal.</p>",
       bm: "<p>Kadar kitar semula nasional Malaysia dilaporkan 37.9% pada 2024 (KPKT, melalui Bernama 2025); pakar menyatakan angka ini mengira bahan kitar semula yang dikutip, tidak semestinya yang benar-benar dikitar. Bagi organisasi, sisa ialah topik pendedahan ESG yang standard (cth. GRI 306: Waste 2020): tan dijana, dilencongkan daripada pelupusan dan dihantar untuk pelupusan.</p>" }))}`,
   wire(root) {
     const p = root.querySelector("#lnPeople"), d = root.querySelector("#lnDays"), o = root.querySelector("#lnOut"); if (!p) return;
     const calc = () => { const n = Math.min(100000, Math.max(1, +p.value || 1)), kg = n * 1.17 * +d.value;
       o.innerHTML = `<b>${kg >= 1000 ? fmt(kg / 1000, 1) + " " + t({ en: "tonnes", bm: "tan" }) : fmt(kg, 1) + " kg"}</b><span>≈ ${fmt(Math.max(kg / 10, 0.1), kg < 100 ? 1 : 0)} × 🍚 ${t({ en: "10 kg bags of rice", bm: "beg beras 10 kg" })}</span>`; };
     p.oninput = d.onchange = calc; calc();
   },
   qc: { kids: [{ q: { en: "What is the biggest part of Malaysian household waste?", bm: "Apakah bahagian terbesar sisa isi rumah di Malaysia?" }, a: [{ en: "Plastic", bm: "Plastik" }, { en: "Food waste", bm: "Sisa makanan" }, { en: "Glass", bm: "Kaca" }], c: 1, why: { en: "Food waste is 30.6%, the biggest part.", bm: "Sisa makanan ialah 30.6%, bahagian terbesar." } },
       { q: { en: "About how much waste does one person in Malaysia throw away each day?", bm: "Kira-kira berapa banyak sisa dibuang oleh seorang di Malaysia setiap hari?" }, a: [{ en: "1.17 kg", bm: "1.17 kg" }, { en: "10 g", bm: "10 g" }, { en: "50 kg", bm: "50 kg" }], c: 0, why: { en: "About 1.17 kg, a bit more than a 1-litre bottle of water.", bm: "Kira-kira 1.17 kg, lebih sedikit daripada sebotol air 1 liter." } }],
     teens: [{ q: { en: "Why is food waste in a landfill a climate problem?", bm: "Mengapa sisa makanan di tapak pelupusan menjadi masalah iklim?" }, a: [{ en: "It decomposes without oxygen and releases methane", bm: "Ia terurai tanpa oksigen dan membebaskan metana" }, { en: "It turns into plastic", bm: "Ia bertukar menjadi plastik" }, { en: "It absorbs carbon dioxide", bm: "Ia menyerap karbon dioksida" }], c: 0, why: { en: "Anaerobic decomposition releases methane, with a 100-year GWP of about 28 (IPCC AR5).", bm: "Penguraian anaerobik membebaskan metana, dengan GWP 100 tahun kira-kira 28 (IPCC AR5)." } },
       { q: { en: "Daily solid waste in Malaysia went from ~19,000 t (2005) to ~39,000 t (2024). That is an increase of about…", bm: "Sisa pepejal harian Malaysia meningkat daripada ~19,000 t (2005) kepada ~39,000 t (2024). Peningkatannya kira-kira…" }, a: [{ en: "20%", bm: "20%" }, { en: "50%", bm: "50%" }, { en: "100% (it doubled)", bm: "100% (berganda)" }], c: 2, why: { en: "(39,078 − 19,000) ÷ 19,000 ≈ 1.06, so just over 100%.", bm: "(39,078 − 19,000) ÷ 19,000 ≈ 1.06, iaitu lebih sedikit daripada 100%." } }] },
   note: { en: "15 min. Ask: “What did you throw away today?” before showing the chart. Let groups guess the top 3 materials, then reveal. Follow with Sort It Out (#/game/sort).", bm: "15 min. Tanya: “Apa yang anda buang hari ini?” sebelum menunjukkan carta. Biar kumpulan meneka 3 bahan teratas, kemudian dedahkan. Sambung dengan Asingkan Sampah (#/game/sort)." } },

 { id: "hierarchy", icon: "🔺", title: { en: "The waste hierarchy", bm: "Hierarki sisa" },
   body: pr => `<p class="ln-lead">${P({ kids: { en: "Some choices are better than others. The top of the pyramid is the best. Tap each layer!", bm: "Ada pilihan yang lebih baik daripada yang lain. Bahagian atas piramid ialah yang terbaik. Tekan setiap lapisan!" },
       teens: { en: "The waste hierarchy ranks options from most to least preferred. The higher the step, the more value we keep and the less energy and raw material we use.", bm: "Hierarki sisa menyusun pilihan daripada yang paling diutamakan kepada yang paling kurang. Lebih tinggi langkahnya, lebih banyak nilai disimpan dan lebih kurang tenaga serta bahan mentah digunakan." } })}</p>
     ${pr ? `<div class="ln-pyr">${HIER.map((h, i) => `<div class="ln-layer-s" style="--w:${100 - i * 11}%;background:${h.c}">${h.i} ${E(t(h.n))}</div>`).join("")}</div>
       <ol class="ln-hl">${HIER.map(h => `<li><b>${h.i} ${E(t(h.n))}:</b> ${E(P(h.d))} <i>${E(t(h.ex))}</i></li>`).join("")}</ol>`
     : `<div class="ln-two"><div class="ln-pyr" role="group" aria-label="${E(t(CH[1].title))}">${HIER.map((h, i) => `<button class="ln-layer-b" data-h="${i}" aria-pressed="${i === hSel}" style="--w:${100 - i * 11}%;background:${h.c}">${h.i} ${E(t(h.n))}</button>`).join("")}
       <p class="small muted ln-pyrlab"><span>⬆️ ${t({ en: "Best", bm: "Terbaik" })}</span><span>⬇️ ${t({ en: "Last choice", bm: "Pilihan terakhir" })}</span></p></div>
       <div class="card ln-hpanel" id="lnH" aria-live="polite"></div></div>`}
     ${sciBox(t({ en: "<p>Why is higher better? Each step down loses more of the energy and materials already invested. Example: recycling aluminium cans saves more than 90% of the energy needed to make new aluminium from bauxite ore (The Aluminum Association), but refusing the can saves 100%.</p><p>“Refuse” comes from the zero-waste movement (Bea Johnson, 2013); official hierarchies such as the EU Waste Framework Directive start at prevention.</p>",
       bm: "<p>Mengapa yang lebih tinggi lebih baik? Setiap langkah ke bawah kehilangan lebih banyak tenaga dan bahan yang telah dilaburkan. Contoh: kitar semula tin aluminium menjimatkan lebih 90% tenaga untuk menghasilkan aluminium baharu daripada bijih bauksit (The Aluminum Association), tetapi menolak tin itu menjimatkan 100%.</p><p>“Tolak” berasal daripada gerakan sifar sisa (Bea Johnson, 2013); hierarki rasmi seperti Arahan Rangka Kerja Sisa EU bermula dengan pencegahan.</p>" }))}
     ${bizBox(t({ en: "<p>Business translation: Refuse/Reduce = redesign packaging and processes; Reuse = refill and take-back schemes, repair services; Recycle = closed-loop material contracts; Recover = biogas or energy from residues. Moving up the hierarchy usually cuts disposal fees as well as emissions.</p>",
       bm: "<p>Terjemahan perniagaan: Tolak/Kurangkan = reka semula pembungkusan dan proses; Guna semula = skim isi semula dan pulangan, perkhidmatan pembaikan; Kitar semula = kontrak bahan gelung tertutup; Pulih guna = biogas atau tenaga daripada sisa baki. Bergerak ke atas hierarki biasanya mengurangkan kos pelupusan serta pelepasan.</p>" }))}`,
   wire(root) {
     const pan = root.querySelector("#lnH"); if (!pan) return;
     const show = () => { const h = HIER[hSel];
       root.querySelectorAll("[data-h]").forEach(b => b.setAttribute("aria-pressed", +b.dataset.h === hSel));
       pan.style.borderTop = `8px solid ${h.c}`;
       pan.innerHTML = `<h3>${h.i} ${hSel + 1}. ${E(t(h.n))}</h3><p>${E(P(h.d))}</p><p><b>${t({ en: "Examples:", bm: "Contoh:" })}</b> ${E(t(h.ex))}</p>${h.labs.length ? `<div class="ln-chips">${h.labs.map(labChip).join("")}</div>` : ""}`; };
     root.querySelectorAll("[data-h]").forEach(b => b.onclick = () => { hSel = +b.dataset.h; show(); WQ.anim(pan, "pop"); });
     show();
   },
   qc: { kids: [{ q: { en: "Which is the BEST choice for a plastic straw you don't need?", bm: "Apakah pilihan TERBAIK untuk straw plastik yang tidak diperlukan?" }, a: [{ en: "Recycle it after use", bm: "Kitar semula selepas guna" }, { en: "Say no to it (refuse)", bm: "Tolak (jangan ambil)" }, { en: "Throw it away", bm: "Buang" }], c: 1, why: { en: "Refusing is at the top: no waste is made at all!", bm: "Menolak berada di atas: langsung tiada sisa dihasilkan!" } },
       { q: { en: "Where is “Dispose” (throw away) in the pyramid?", bm: "Di manakah “Lupus” (buang) dalam piramid?" }, a: [{ en: "At the top: best choice", bm: "Di atas: pilihan terbaik" }, { en: "At the bottom: last choice", bm: "Di bawah: pilihan terakhir" }], c: 1, why: { en: "Throwing away is the last choice.", bm: "Membuang ialah pilihan terakhir." } }],
     teens: [{ q: { en: "Put in order, best first: Recycle, Reduce, Dispose", bm: "Susun, terbaik dahulu: Kitar semula, Kurangkan, Lupus" }, a: [{ en: "Recycle → Reduce → Dispose", bm: "Kitar semula → Kurangkan → Lupus" }, { en: "Reduce → Recycle → Dispose", bm: "Kurangkan → Kitar semula → Lupus" }, { en: "Dispose → Recycle → Reduce", bm: "Lupus → Kitar semula → Kurangkan" }], c: 1, why: { en: "Reducing avoids waste; recycling recovers material; disposal loses it.", bm: "Mengurangkan mengelak sisa; kitar semula memulih bahan; pelupusan menghilangkannya." } },
       { q: { en: "Turning an old T-shirt into a tote bag is an example of…", bm: "Menjadikan baju-T lama beg tote ialah contoh…" }, a: [{ en: "Reuse (upcycling)", bm: "Guna semula (kitar naik)" }, { en: "Recover", bm: "Pulih guna" }, { en: "Dispose", bm: "Lupus" }], c: 0, why: { en: "The product gets a new job without being broken down into raw material.", bm: "Produk diberi tugas baharu tanpa diurai menjadi bahan mentah." } }] },
   note: { en: "10 min. Give each group a waste item card and ask them to place it on the pyramid. Discuss: why is recycling not the top?", bm: "10 min. Beri setiap kumpulan kad barang sisa dan minta mereka letakkan pada piramid. Bincang: mengapa kitar semula bukan di atas?" } },

 { id: "circular", icon: "🔄", title: { en: "Linear vs circular economy", bm: "Ekonomi linear lwn kitaran" },
   body: pr => `<p class="ln-lead">${P({ kids: { en: "In a straight line, things end up as rubbish. In a circle, things come back again and again!", bm: "Dalam garis lurus, barang berakhir sebagai sampah. Dalam bulatan, barang kembali digunakan berulang kali!" },
       teens: { en: "A linear economy follows “take, make, use, throw away”. A circular economy designs waste out, keeps products and materials in use at their highest value, and regenerates nature (Ellen MacArthur Foundation).", bm: "Ekonomi linear mengikut “ambil, buat, guna, buang”. Ekonomi kitaran mereka bentuk supaya tiada sisa, mengekalkan produk dan bahan digunakan pada nilai tertinggi, dan memulihkan alam semula jadi (Ellen MacArthur Foundation)." } })}</p>
     ${pr ? `<div class="ln-two"><div><h3>${t({ en: "Linear", bm: "Linear" })}</h3>${linearSVG()}</div><div><h3>${t({ en: "Circular", bm: "Kitaran" })}</h3>${circularSVG()}</div></div>`
     : `<div class="ln-tog" role="group"><button data-c="0" aria-pressed="${!circ}">➡️ ${t({ en: "Linear", bm: "Linear" })}</button><button data-c="1" aria-pressed="${circ}">🔄 ${t({ en: "Circular", bm: "Kitaran" })}</button></div><div class="ln-diag" id="lnDiag" aria-live="polite"></div>`}
     <div class="tablewrap"><table class="tbl"><tr><th></th><th>➡️ ${t({ en: "Linear", bm: "Linear" })}</th><th>🔄 ${t({ en: "Circular", bm: "Kitaran" })}</th></tr>
       <tr><td><b>${t({ en: "Design", bm: "Reka bentuk" })}</b></td><td>${t({ en: "Cheap, single-use, hard to repair", bm: "Murah, guna sekali, sukar dibaiki" })}</td><td>${t({ en: "Durable, repairable, easy to take apart and recycle", bm: "Tahan lama, boleh dibaiki, mudah dileraikan dan dikitar" })}</td></tr>
       <tr><td><b>${t({ en: "End of life", bm: "Akhir hayat" })}</b></td><td>${t({ en: "Landfill or open burning", bm: "Tapak pelupusan atau pembakaran terbuka" })}</td><td>${t({ en: "Becomes a resource for a new product, or compost", bm: "Menjadi sumber untuk produk baharu, atau kompos" })}</td></tr>
       <tr><td><b>${t({ en: "Example", bm: "Contoh" })}</b></td><td>${t({ en: "Used cooking oil poured down the sink", bm: "Minyak masak terpakai dituang ke sinki" })}</td><td>${t({ en: "Used cooking oil made into candles", bm: "Minyak masak terpakai dijadikan lilin" })} (${labChip("candle")})</td></tr></table></div>
     ${sciBox(t({ en: "<p>Circular thinking uses two loops. The <b>biological cycle</b>: food and plant materials go back to the soil safely (composting, eco-enzyme). The <b>technical cycle</b>: metals, plastics and glass are kept in use by reuse, repair, remanufacture and recycling. Problems start when the two are mixed, such as food stuck to plastic.</p>",
       bm: "<p>Pemikiran kitaran menggunakan dua gelung. <b>Kitaran biologi</b>: bahan makanan dan tumbuhan kembali ke tanah dengan selamat (pengkomposan, eko-enzim). <b>Kitaran teknikal</b>: logam, plastik dan kaca terus digunakan melalui guna semula, pembaikan, pembuatan semula dan kitar semula. Masalah timbul apabila kedua-duanya bercampur, seperti makanan melekat pada plastik.</p>" }))}
     ${bizBox(t({ en: "<p>Circular business models: product-as-a-service (leasing), refill and reuse systems, take-back and remanufacture, and selling by-products. <b>Extended Producer Responsibility (EPR)</b> makes producers responsible for their packaging after use. In Malaysia, KPKT has announced a voluntary EPR phase for packaging from 2026, becoming mandatory by 2030 (Bernama, 2025).</p>",
       bm: "<p>Model perniagaan kitaran: produk-sebagai-perkhidmatan (pajakan), sistem isi semula dan guna semula, pulangan dan pembuatan semula, serta menjual hasil sampingan. <b>Tanggungjawab Pengeluar Lanjutan (EPR)</b> menjadikan pengeluar bertanggungjawab ke atas pembungkusan mereka selepas digunakan. Di Malaysia, KPKT telah mengumumkan fasa EPR sukarela bagi pembungkusan mulai 2026, dan menjadi wajib menjelang 2030 (Bernama, 2025).</p>" }))}`,
   wire(root) {
     const d = root.querySelector("#lnDiag"); if (!d) return;
     const show = () => { d.innerHTML = circ ? circularSVG() : linearSVG(); root.querySelectorAll("[data-c]").forEach(b => b.setAttribute("aria-pressed", (b.dataset.c === "1") === circ)); };
     root.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { circ = b.dataset.c === "1"; show(); WQ.anim(d, "pop"); });
     show();
   },
   qc: { kids: [{ q: { en: "In a circular economy, what happens to old things?", bm: "Dalam ekonomi kitaran, apa yang berlaku kepada barang lama?" }, a: [{ en: "They become useful again", bm: "Ia menjadi berguna semula" }, { en: "They go to the landfill", bm: "Ia dihantar ke tapak pelupusan" }], c: 0, why: { en: "In a circle, materials come back to be used again.", bm: "Dalam bulatan, bahan kembali untuk digunakan semula." } },
       { q: { en: "Which one is LINEAR?", bm: "Yang manakah LINEAR?" }, a: [{ en: "Composting fruit peels", bm: "Mengkompos kulit buah" }, { en: "Buy, use once, throw away", bm: "Beli, guna sekali, buang" }, { en: "Refilling a water bottle", bm: "Mengisi semula botol air" }], c: 1, why: { en: "A straight line ends in the bin.", bm: "Garis lurus berakhir di dalam tong sampah." } }],
     teens: [{ q: { en: "Which is one of the three circular economy principles?", bm: "Yang manakah salah satu daripada tiga prinsip ekonomi kitaran?" }, a: [{ en: "Make products cheaper to throw away", bm: "Jadikan produk lebih murah untuk dibuang" }, { en: "Keep products and materials in use", bm: "Kekalkan produk dan bahan terus digunakan" }, { en: "Burn all waste for energy", bm: "Bakar semua sisa untuk tenaga" }], c: 1, why: { en: "The three: eliminate waste and pollution, circulate products and materials, regenerate nature.", bm: "Tiga prinsip: hapuskan sisa dan pencemaran, edarkan produk dan bahan, pulihkan alam semula jadi." } },
       { q: { en: "Compost belongs to which loop?", bm: "Kompos tergolong dalam gelung yang mana?" }, a: [{ en: "Biological cycle", bm: "Kitaran biologi" }, { en: "Technical cycle", bm: "Kitaran teknikal" }], c: 0, why: { en: "Organic matter returns safely to the soil.", bm: "Bahan organik kembali ke tanah dengan selamat." } }],
     adults: [{ q: { en: "Extended Producer Responsibility (EPR) means…", bm: "Tanggungjawab Pengeluar Lanjutan (EPR) bermaksud…" }, a: [{ en: "Consumers pay all recycling costs", bm: "Pengguna menanggung semua kos kitar semula" }, { en: "Producers take responsibility for their products and packaging after use", bm: "Pengeluar bertanggungjawab ke atas produk dan pembungkusan mereka selepas digunakan" }, { en: "Local councils ban packaging", bm: "Pihak berkuasa tempatan mengharamkan pembungkusan" }], c: 1, why: { en: "In Malaysia, a voluntary phase for packaging is planned from 2026, mandatory by 2030.", bm: "Di Malaysia, fasa sukarela untuk pembungkusan dirancang mulai 2026, wajib menjelang 2030." } },
       { q: { en: "Which is a circular business model?", bm: "Yang manakah model perniagaan kitaran?" }, a: [{ en: "Refill and take-back scheme", bm: "Skim isi semula dan pulangan" }, { en: "Larger single-use packs", bm: "Pek guna sekali yang lebih besar" }, { en: "Planned obsolescence", bm: "Keusangan terancang" }], c: 0, why: { en: "Refill and take-back keep products and materials in use.", bm: "Isi semula dan pulangan mengekalkan produk dan bahan terus digunakan." } }] },
   note: { en: "10 min. Toggle the diagram on the projector. Ask learners to trace one product (a drink bottle) through both systems.", bm: "10 min. Tukar rajah pada projektor. Minta pelajar menjejak satu produk (botol minuman) melalui kedua-dua sistem." } },

 { id: "w2w", icon: "💎", title: { en: "Waste-to-Wealth (W2W)", bm: "Sisa kepada Kekayaan (W2W)" },
   body: pr => `<p class="ln-lead">${P({ kids: { en: "Waste-to-Wealth means turning rubbish into something useful or valuable. Rubbish can become treasure!", bm: "Sisa kepada Kekayaan bermaksud menukar sampah menjadi sesuatu yang berguna atau bernilai. Sampah boleh jadi harta!" },
       teens: { en: "Waste-to-Wealth (W2W) turns waste into products, materials or energy with value. It is the circular economy in action: it reduces, reuses, recycles and recovers, and extends the life of products.", bm: "Sisa kepada Kekayaan (W2W) menukar sisa menjadi produk, bahan atau tenaga yang bernilai. Ia ialah ekonomi kitaran dalam tindakan: mengurangkan, mengguna semula, mengitar semula dan memulih guna, serta memanjangkan hayat produk." } })}</p>
     <h3>${t({ en: "Three kinds of benefit", bm: "Tiga jenis manfaat" })} ${pr ? "" : `<span class="small muted">(${t({ en: "tap a card to flip it", bm: "tekan kad untuk terbalikkan" })})</span>`}</h3>
     <div class="ln-flips">${PILLARS.map((p, i) => pr ? `<div class="ln-pcard" style="border-color:${p.c}"><h4>${p.i} ${E(t(p.n))}</h4><ul>${p.b.map(b => `<li>${E(t(b))}</li>`).join("")}</ul></div>`
       : `<button class="ln-flip ${flips[i] ? "on" : ""}" data-f="${i}" aria-pressed="${!!flips[i]}"><span class="in"><span class="f" style="background:${p.c}"><span class="big">${p.i}</span>${E(t(p.n))}</span><span class="b" style="border-color:${p.c}"><b>${p.i} ${E(t(p.n))}</b>${p.b.map(b => `<span class="li">${E(t(b))}</span>`).join("")}</span></span></button>`).join("")}</div>
     <h3>${t({ en: `From waste to wealth: our ${Object.keys(LABS).length} labs`, bm: `Daripada sisa kepada kekayaan: ${Object.keys(LABS).length} makmal kami` })}</h3>
     <div class="ln-labs">${Object.keys(LABS).map(id => `<a class="ln-lab" href="#/lab/${id}"><span class="w">${E(t(LABS[id].w))}</span><span class="ar" aria-hidden="true">➜</span><span class="p">${LABS[id].i} ${E(labName(id))}</span></a>`).join("")}</div>
     ${sciBox(t({ en: "<p>Behind each product is real science: microbes turn food waste into compost (<a href='#/game/compost'>compost sim</a>); fermentation makes eco-enzyme acidic (<a href='#/game/enzyme'>eco-enzyme sim</a>); plant pigments called anthocyanins change colour with pH (<a href='#/game/ph'>pH lab</a>); glycerol acts as a plasticiser to make starch bioplastic flexible.</p>",
       bm: "<p>Di sebalik setiap produk ada sains sebenar: mikrob menukar sisa makanan menjadi kompos (<a href='#/game/compost'>simulasi kompos</a>); penapaian menjadikan eko-enzim berasid (<a href='#/game/enzyme'>simulasi eko-enzim</a>); pigmen tumbuhan yang dipanggil antosianin berubah warna mengikut pH (<a href='#/game/ph'>makmal pH</a>); gliserol bertindak sebagai pemplastik untuk menjadikan bioplastik kanji lentur.</p>" }))}
     ${bizBox(t({ en: "<p>Green entrepreneurship starts with cheap inputs. UPM ENG3104 student teams (2024) estimated a starch bioplastic pot at about RM0.84 in materials and a tote bag from used plastic bags at about RM4.66 (student estimates, not market prices). Test your own pricing in <a href='#/game/cash'>Waste to Cash</a>. A credible W2W business also needs a safe process, a steady waste supply, quality control and honest environmental claims.</p>",
       bm: "<p>Keusahawanan hijau bermula dengan input yang murah. Pasukan pelajar UPM ENG3104 (2024) menganggarkan pasu bioplastik kanji kira-kira RM0.84 untuk bahan dan beg tote daripada beg plastik terpakai kira-kira RM4.66 (anggaran pelajar, bukan harga pasaran). Uji harga anda sendiri dalam <a href='#/game/cash'>Sisa jadi Wang</a>. Perniagaan W2W yang kredibel juga memerlukan proses yang selamat, bekalan sisa yang tetap, kawalan kualiti dan dakwaan alam sekitar yang jujur.</p>" }))}`,
   wire(root) { root.querySelectorAll("[data-f]").forEach(b => b.onclick = () => { const i = +b.dataset.f; flips[i] = !flips[i]; b.classList.toggle("on", flips[i]); b.setAttribute("aria-pressed", flips[i]); }); },
   qc: { kids: [{ q: { en: "What does Waste-to-Wealth mean?", bm: "Apakah maksud Sisa kepada Kekayaan?" }, a: [{ en: "Turning rubbish into useful things", bm: "Menukar sampah menjadi barang berguna" }, { en: "Burying more rubbish", bm: "Menanam lebih banyak sampah" }, { en: "Buying new things every day", bm: "Membeli barang baharu setiap hari" }], c: 0, why: { en: "Rubbish can become treasure!", bm: "Sampah boleh jadi harta!" } },
       { q: { en: "Used coffee grounds can become…", bm: "Hampas kopi boleh dijadikan…" }, a: [{ en: "A toy car", bm: "Kereta mainan" }, { en: "An odour absorber", bm: "Penyerap bau" }, { en: "Glass", bm: "Kaca" }], c: 1, why: { en: "Dried coffee grounds soak up smells.", bm: "Hampas kopi kering menyerap bau." } }],
     teens: [{ q: { en: "Which is a SOCIAL benefit of W2W?", bm: "Yang manakah manfaat SOSIAL W2W?" }, a: [{ en: "Lower greenhouse gas emissions", bm: "Pelepasan gas rumah hijau lebih rendah" }, { en: "Greater community awareness and new skills", bm: "Kesedaran komuniti dan kemahiran baharu" }, { en: "Higher product prices", bm: "Harga produk lebih tinggi" }], c: 1, why: { en: "Awareness, lifestyles and creativity are social benefits.", bm: "Kesedaran, gaya hidup dan kreativiti ialah manfaat sosial." } },
       { q: { en: "Fruit peels + sugar + water, fermented, make…", bm: "Kulit buah + gula + air, ditapai, menghasilkan…" }, a: [{ en: "Eco-enzyme", bm: "Eko-enzim" }, { en: "Bioplastic", bm: "Bioplastik" }, { en: "Candles", bm: "Lilin" }], c: 0, why: { en: "Microbes ferment the sugars and the liquid becomes acidic.", bm: "Mikrob menapai gula dan cecair menjadi berasid." } }] },
   note: { en: "15 min. Flip the three cards with the class, then let each group choose the lab they will do in the hands-on session.", bm: "15 min. Terbalikkan tiga kad bersama kelas, kemudian biar setiap kumpulan memilih makmal untuk sesi amali." } },

 { id: "rules", icon: "🏛️", title: { en: "Malaysia's rules and bins", bm: "Peraturan dan tong di Malaysia" },
   body: pr => `<p class="ln-lead">${P({ kids: { en: "In Malaysia, we sort our rubbish at home. Remember the three colours: blue, orange and brown!", bm: "Di Malaysia, kita asingkan sampah di rumah. Ingat tiga warna: biru, oren dan coklat!" },
       teens: { en: "Under the Solid Waste and Public Cleansing Management Act 2007 (Act 672), separation at source is mandatory in the states and territories that adopted the Act. Recyclables are separated from other household waste for collection.", bm: "Di bawah Akta Pengurusan Sisa Pepejal dan Pembersihan Awam 2007 (Akta 672), pengasingan di punca adalah wajib di negeri dan wilayah yang menerima pakai Akta ini. Bahan kitar semula diasingkan daripada sisa isi rumah lain untuk dikutip." } })}</p>
     <p><b>${t({ en: "Where separation at source is mandatory (Act 672):", bm: "Kawasan pengasingan di punca adalah wajib (Akta 672):" })}</b></p><div class="ln-chips">${STATES.map(s => `<span class="tag go">${s[WQ.lang === "bm" ? 1 : 0]}</span>`).join(" ")}</div>
     <p class="small muted">${t({ en: "Other states run their own programmes. Selangor is working towards adopting the Act in phases; the start date is not yet confirmed, so check your council's rules.", bm: "Negeri lain mempunyai program sendiri. Selangor sedang berusaha menerima pakai Akta ini secara berperingkat; tarikh mula belum disahkan, jadi semak peraturan pihak berkuasa tempatan anda." })}</p>
     ${pr ? `<div class="ln-bins">${Object.values(BINS).map(b => `<div class="ln-binp" style="border-color:${b.c}"><h4 style="color:${b.c}">${b.i} ${E(t(b.n))}</h4><p>✅ ${E(t(b.y))}</p><p>❌ ${E(t(b.n2))}</p></div>`).join("")}</div>`
     : `<div class="ln-bins" role="group">${Object.entries(BINS).map(([k, b]) => `<button class="ln-bin" data-b="${k}" aria-pressed="${k === binSel}" style="background:${b.c}"><span class="bi">${b.i}</span>${E(t(b.n))}</button>`).join("")}</div><div class="card ln-binpanel" id="lnBin" aria-live="polite"></div>`}
     <div class="note ok ln-box"><b>${t({ en: "3 easy steps", bm: "3 langkah mudah" })}</b><div>1️⃣ ${t({ en: "Rinse", bm: "Bilas" })} · 2️⃣ ${t({ en: "Dry", bm: "Keringkan" })} · 3️⃣ ${t({ en: "Separate into the right bin", bm: "Asingkan ke tong yang betul" })}. ${t({ en: "Food waste and dirty items go with general waste, or better, into compost. Batteries, e-waste and medicine go to special collection points.", bm: "Sisa makanan dan barang kotor dimasukkan bersama sisa am, atau lebih baik, dijadikan kompos. Bateri, e-sisa dan ubat dihantar ke pusat kutipan khas." })}</div></div>
     <p class="row"><a class="btn" href="#/game/sort">🗑️ ${t(U.play)}: ${E(t(WQ.games.sort ? WQ.games.sort.title : GAMES.sort[1]))}</a></p>
     ${sciBox(t({ en: "<p>Why rinse? Food and oil left on packaging contaminate other recyclables: wet, greasy paper fibres cannot be pulped well, and dirty plastic lowers the quality of recycled pellets. Clean, dry, separated materials are worth more to recyclers.</p>",
       bm: "<p>Mengapa perlu bilas? Makanan dan minyak yang tertinggal pada pembungkusan mencemarkan bahan kitar semula lain: serat kertas yang basah dan berminyak sukar dipulpa, dan plastik kotor menurunkan kualiti pelet kitar semula. Bahan yang bersih, kering dan diasingkan lebih bernilai kepada pengitar semula.</p>" }))}
     ${bizBox(t({ en: "<p>Policy context for organisations: Act 672 (separation at source), Malaysia's Roadmap Towards Zero Single-Use Plastics 2018–2030, and the planned EPR scheme for packaging (voluntary from 2026, mandatory by 2030). Workplaces can mirror the household system with labelled blue, orange and brown bins plus a food-waste stream.</p>",
       bm: "<p>Konteks dasar untuk organisasi: Akta 672 (pengasingan di punca), Pelan Hala Tuju Malaysia Ke Arah Sifar Penggunaan Plastik Sekali Guna 2018–2030, dan skim EPR yang dirancang bagi pembungkusan (sukarela mulai 2026, wajib menjelang 2030). Tempat kerja boleh mencontohi sistem isi rumah dengan tong biru, oren dan coklat berlabel serta aliran sisa makanan.</p>" }))}`,
   wire(root) {
     const pan = root.querySelector("#lnBin"); if (!pan) return;
     const show = () => { const b = BINS[binSel]; root.querySelectorAll("[data-b]").forEach(x => x.setAttribute("aria-pressed", x.dataset.b === binSel));
       pan.style.borderTop = `8px solid ${b.c}`; pan.innerHTML = `<h3 style="color:${b.c}">${b.i} ${E(t(b.n))}</h3><p>✅ <b>${t({ en: "Yes:", bm: "Ya:" })}</b> ${E(t(b.y))}</p><p>❌ <b>${t({ en: "No:", bm: "Tidak:" })}</b> ${E(t(b.n2))}</p>`; };
     root.querySelectorAll("[data-b]").forEach(x => x.onclick = () => { binSel = x.dataset.b; show(); WQ.anim(pan, "pop"); });
     show();
   },
   qc: { kids: [{ q: { en: "Which bin is for paper?", bm: "Tong manakah untuk kertas?" }, a: [{ en: "Blue", bm: "Biru" }, { en: "Orange", bm: "Oren" }, { en: "Brown", bm: "Coklat" }], c: 0, why: { en: "Blue bin = paper.", bm: "Tong biru = kertas." } },
       { q: { en: "Where does a clean glass jam jar go?", bm: "Ke mana balang jem kaca yang bersih?" }, a: [{ en: "Orange bin", bm: "Tong oren" }, { en: "Brown bin", bm: "Tong coklat" }, { en: "Blue bin", bm: "Tong biru" }], c: 1, why: { en: "Brown bin = glass.", bm: "Tong coklat = kaca." } }],
     teens: [{ q: { en: "Which law makes separation at source mandatory in adopting states?", bm: "Undang-undang manakah mewajibkan pengasingan di punca di negeri yang menerima pakai?" }, a: [{ en: "Act 672 (2007)", bm: "Akta 672 (2007)" }, { en: "Environmental Quality Act 1974", bm: "Akta Kualiti Alam Sekeliling 1974" }, { en: "There is no such law", bm: "Tiada undang-undang sedemikian" }], c: 0, why: { en: "The Solid Waste and Public Cleansing Management Act 2007 (Act 672).", bm: "Akta Pengurusan Sisa Pepejal dan Pembersihan Awam 2007 (Akta 672)." } },
       { q: { en: "An aluminium drink can goes into the…", bm: "Tin minuman aluminium dimasukkan ke dalam…" }, a: [{ en: "Blue bin", bm: "Tong biru" }, { en: "Orange bin", bm: "Tong oren" }, { en: "Brown bin", bm: "Tong coklat" }], c: 1, why: { en: "Orange = plastic and aluminium/metal.", bm: "Oren = plastik dan aluminium/logam." } }] },
   note: { en: "10 min. Bring three coloured boxes and 10 real (clean) items. Then play Sort It Out on the projector, Level 1 then Level 2.", bm: "10 min. Bawa tiga kotak berwarna dan 10 barang sebenar (bersih). Kemudian main Asingkan Sampah pada projektor, Tahap 1 kemudian Tahap 2." } },

 { id: "sdg", icon: "🎯", title: { en: "The Sustainable Development Goals", bm: "Matlamat Pembangunan Mampan" },
   body: pr => `<p class="ln-lead">${P({ kids: { en: "The whole world has 17 goals for a better planet by 2030. WasteQuest helps with five of them!", bm: "Seluruh dunia mempunyai 17 matlamat untuk planet yang lebih baik menjelang 2030. WasteQuest membantu lima daripadanya!" },
       teens: { en: "In 2015, all UN member states, including Malaysia, adopted 17 Sustainable Development Goals (SDGs) for 2030. Waste-to-Wealth links most directly to SDGs 12, 13 and 15, and also to 11 and 14.", bm: "Pada 2015, semua negara anggota PBB termasuk Malaysia menerima pakai 17 Matlamat Pembangunan Mampan (SDG) untuk 2030. Sisa kepada Kekayaan paling berkait dengan SDG 12, 13 dan 15, serta juga 11 dan 14." } })}</p>
     <img class="ln-sdgimg" src="assets/sdg-strip.jpeg" alt="SDG 13 Climate Action, SDG 12 Responsible Consumption and Production, SDG 15 Life on Land">
     <div class="ln-sdgs">${SDGS.map(s => `<div class="ln-sdg" style="--c:${s.c}"><div class="num">${s.n}</div><div><h4>${E(t(s.t))}</h4><p>${E(P(s.d))}</p><div class="ln-chips">${s.labs.map(labChip).join("")}</div></div></div>`).join("")}</div>
     ${bizBox(t({ en: "<p>Organisations often map their ESG reports to the SDGs. A W2W project can report outputs (kg of waste diverted, products made) and link them to Target 12.5 (waste reduction) and Target 12.3 (food waste).</p>",
       bm: "<p>Organisasi sering memetakan laporan ESG mereka kepada SDG. Projek W2W boleh melaporkan output (kg sisa dilencongkan, produk dihasilkan) dan mengaitkannya dengan Sasaran 12.5 (pengurangan sisa) dan Sasaran 12.3 (sisa makanan).</p>" }))}`,
   qc: { kids: [{ q: { en: "Which SDG is about using things responsibly and wasting less?", bm: "SDG manakah tentang menggunakan barang secara bertanggungjawab dan kurang membazir?" }, a: [{ en: "SDG 12", bm: "SDG 12" }, { en: "SDG 3", bm: "SDG 3" }, { en: "SDG 7", bm: "SDG 7" }], c: 0, why: { en: "SDG 12: Responsible consumption and production.", bm: "SDG 12: Penggunaan dan pengeluaran bertanggungjawab." } },
       { q: { en: "Keeping plastic out of the sea helps which goal?", bm: "Menjauhkan plastik daripada laut membantu matlamat yang mana?" }, a: [{ en: "SDG 14 Life below water", bm: "SDG 14 Kehidupan di bawah air" }, { en: "SDG 4 Quality education", bm: "SDG 4 Pendidikan berkualiti" }], c: 0, why: { en: "SDG 14 protects life in the sea.", bm: "SDG 14 melindungi hidupan di laut." } }],
     teens: [{ q: { en: "Composting school food waste instead of landfilling it mainly supports…", bm: "Mengkompos sisa makanan sekolah dan bukan menghantarnya ke tapak pelupusan terutamanya menyokong…" }, a: [{ en: "SDG 12 and SDG 13", bm: "SDG 12 dan SDG 13" }, { en: "SDG 1 only", bm: "SDG 1 sahaja" }, { en: "SDG 9 only", bm: "SDG 9 sahaja" }], c: 0, why: { en: "Less waste (12) and less methane (13), plus better soil (15).", bm: "Kurang sisa (12) dan kurang metana (13), serta tanah lebih subur (15)." } },
       { q: { en: "SDG Target 12.3 aims to…", bm: "Sasaran SDG 12.3 bertujuan untuk…" }, a: [{ en: "Halve per-capita food waste", bm: "Mengurangkan separuh sisa makanan per kapita" }, { en: "Double plastic production", bm: "Menggandakan pengeluaran plastik" }, { en: "Build more landfills", bm: "Membina lebih banyak tapak pelupusan" }], c: 0, why: { en: "Target 12.3 is about food loss and waste.", bm: "Sasaran 12.3 berkaitan kehilangan dan pembaziran makanan." } }] },
   note: { en: "5–10 min. Ask each group to name which SDG their lab supports and why, then add it to their pitch poster.", bm: "5–10 min. Minta setiap kumpulan menamakan SDG yang disokong oleh makmal mereka dan sebabnya, kemudian tambahkan pada poster pembentangan." } },

 { id: "champion", icon: "🏆", title: { en: "Be a Zero-Waste Champion", bm: "Jadilah Juara Sifar Sisa" },
   body: pr => { const plan = WQ.store.getJSON("learn-plan", { name: "", p: [], own: "", start: "" });
     return `<p class="ln-lead">${P({ kids: { en: "Champions start small. Pick a few promises you can really keep!", bm: "Juara bermula dengan langkah kecil. Pilih beberapa janji yang benar-benar boleh ditunaikan!" },
       teens: { en: "Real change comes from habits. Choose 2–4 actions, start this week, and share your plan with someone who will check on you.", bm: "Perubahan sebenar datang daripada tabiat. Pilih 2–4 tindakan, mulakan minggu ini, dan kongsi rancangan anda dengan seseorang yang akan memantau anda." },
       adults: { en: "Build a personal (or team) action plan. Pick specific, measurable actions, set a start date and review after 30 days.", bm: "Bina pelan tindakan peribadi (atau pasukan). Pilih tindakan yang khusus dan boleh diukur, tetapkan tarikh mula dan semak selepas 30 hari." } })}</p>
     <div class="card ln-plan" id="lnPlan"><h3>📝 ${t({ en: "My Zero-Waste action plan", bm: "Pelan tindakan Sifar Sisa saya" })}</h3>
       <label class="ln-f">${t({ en: "Name", bm: "Nama" })} ${pr ? "<span class='ln-line'></span>" : `<input id="lnPName" maxlength="60" value="${E(plan.name)}">`}</label>
       ${PLEDGES.map(([en, bm, items], g) => `<fieldset><legend>${WQ.lang === "bm" ? bm : en}</legend>${items.map((it, j) => { const k = g + "-" + j;
         return `<label class="ln-chk"><input type="checkbox" ${pr ? "" : `data-k="${k}"`} ${!pr && plan.p.includes(k) ? "checked" : ""}> ${E(t(it))}</label>`; }).join("")}</fieldset>`).join("")}
       <label class="ln-f">${t({ en: "My own idea", bm: "Idea saya sendiri" })} ${pr ? "<span class='ln-line'></span>" : `<input id="lnPOwn" maxlength="140" value="${E(plan.own)}">`}</label>
       <label class="ln-f">${t({ en: "I will start on", bm: "Saya akan mula pada" })} ${pr ? "<span class='ln-line'></span>" : `<input type="date" id="lnPStart" value="${E(plan.start)}">`}</label>
       ${pr ? "" : `<p class="row noprint"><button class="btn blue" id="lnPrint">🖨️ ${t({ en: "Print my plan", bm: "Cetak pelan saya" })}</button><span class="small muted">${t({ en: "Saved on this device.", bm: "Disimpan pada peranti ini." })}</span></p>`}</div>
     <div class="note ok ln-box"><b>${t({ en: "What does a Zero-Waste Champion do?", bm: "Apa yang dilakukan oleh Juara Sifar Sisa?" })}</b><div>${P({ kids: { en: "Sorts waste, says no to things they don't need, makes cool things from trash, and helps friends do it too!", bm: "Mengasingkan sisa, menolak barang yang tidak perlu, membuat barang hebat daripada sampah, dan membantu kawan melakukannya juga!" },
       teens: { en: "Practises the waste hierarchy daily, leads by example in school, measures progress (e.g. weighs the class bin each week) and shares ideas in the community.", bm: "Mengamalkan hierarki sisa setiap hari, menjadi contoh di sekolah, mengukur kemajuan (cth. menimbang tong kelas setiap minggu) dan berkongsi idea dalam komuniti." } })}</div></div>
     <p class="row"><a class="btn" href="#/games">🎮 ${t({ en: "Games", bm: "Permainan" })}</a><a class="btn blue" href="#/labs">🧪 ${t({ en: "Labs", bm: "Makmal" })}</a><a class="btn alt" href="#/cert">🎓 ${t({ en: "Certificate", bm: "Sijil" })}</a></p>`; },
   wire(root) {
     const f = root.querySelector("#lnPlan"); if (!f || !root.querySelector("#lnPName")) return;
     const save = () => WQ.store.setJSON("learn-plan", { name: root.querySelector("#lnPName").value, own: root.querySelector("#lnPOwn").value, start: root.querySelector("#lnPStart").value, p: [...root.querySelectorAll("[data-k]:checked")].map(x => x.dataset.k) });
     f.addEventListener("input", save); f.addEventListener("change", save);
     root.querySelector("#lnPrint").onclick = () => { document.body.classList.add("ln-printplan"); window.print(); setTimeout(() => document.body.classList.remove("ln-printplan"), 500); };
   },
   qc: { kids: [{ q: { en: "What is the best way to start being a Zero-Waste Champion?", bm: "Apakah cara terbaik untuk mula menjadi Juara Sifar Sisa?" }, a: [{ en: "Do everything at once, then stop", bm: "Buat semuanya sekali gus, kemudian berhenti" }, { en: "Start with one small habit and keep it", bm: "Mulakan dengan satu tabiat kecil dan teruskan" }], c: 1, why: { en: "Small habits you keep make the biggest difference.", bm: "Tabiat kecil yang berterusan memberi kesan terbesar." } },
       { q: { en: "A champion also…", bm: "Seorang juara juga…" }, a: [{ en: "Helps family and friends reduce waste", bm: "Membantu keluarga dan kawan mengurangkan sisa" }, { en: "Keeps ideas secret", bm: "Merahsiakan idea" }], c: 0, why: { en: "Sharing spreads the change!", bm: "Berkongsi menyebarkan perubahan!" } }],
     teens: [{ q: { en: "Which goal is the most useful for an action plan?", bm: "Matlamat manakah paling berguna untuk pelan tindakan?" }, a: [{ en: "“Be greener”", bm: "“Jadi lebih hijau”" }, { en: "“Bring my own bottle every school day for 4 weeks”", bm: "“Bawa botol sendiri setiap hari persekolahan selama 4 minggu”" }], c: 1, why: { en: "Specific, measurable and time-bound goals are easier to keep and check.", bm: "Matlamat yang khusus, boleh diukur dan bertempoh lebih mudah ditunaikan dan disemak." } },
       { q: { en: "How can your class measure its progress?", bm: "Bagaimana kelas anda boleh mengukur kemajuan?" }, a: [{ en: "Weigh the general-waste bin every week", bm: "Timbang tong sisa am setiap minggu" }, { en: "Guess", bm: "Teka" }], c: 0, why: { en: "Data shows whether actions really reduce waste.", bm: "Data menunjukkan sama ada tindakan benar-benar mengurangkan sisa." } }] },
   note: { en: "10 min. Learners complete and print the plan as an exit ticket. Review the plans after 2–4 weeks (Eco-Club week 4).", bm: "10 min. Pelajar melengkapkan dan mencetak pelan sebagai tiket keluar. Semak pelan selepas 2–4 minggu (Kelab Eko minggu 4)." } }
];

WQ.addBadge("learn", { icon: "📘", name: { en: "Waste-Wise Scholar", bm: "Cendekia Bijak Sisa" }, desc: { en: "Finish all 7 Learn chapters", bm: "Tamatkan kesemua 7 bab Belajar" } });

WQ.css("learn", `
.ln-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px}
.ln-nav a{display:inline-flex;align-items:center;gap:6px;background:#f9e6cf;border:3px solid #1a1932;border-radius:0;padding:5px 10px 5px 5px;font-family:"Pixelify Sans",Nunito,sans-serif;font-weight:600;text-decoration:none;color:#1a1932;box-shadow:3px 3px 0 rgba(26,25,50,.35);font-size:.9rem}
.ln-nav a:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 rgba(26,25,50,.35)}
.ln-nav a[aria-current=page]{background:#1a1932;color:#fff}
.ln-nav .n{width:24px;height:24px;border:2px solid #1a1932;border-radius:0;background:#c9d3dd;color:#1a1932;display:grid;place-items:center;font-size:.8rem;flex:none}
.ln-nav a.done .n{background:#5ac54f}
.ln-check{margin-top:14px;background:#f9e6cf;border:3px solid #1a1932;border-radius:0;box-shadow:4px 4px 0 rgba(26,25,50,.35)}.ln-check h3{font-family:"Pixelify Sans",Nunito,sans-serif;margin:0 0 8px}
@media (prefers-reduced-motion:reduce){.ln-nav a:hover{transform:none}}
.ln-prog{display:flex;align-items:center;gap:10px;margin:0 0 14px}.ln-prog .meter{flex:1;max-width:340px}
.ln-chap h2{font-size:clamp(1.4rem,3.4vw,2rem);display:flex;gap:10px;align-items:center}
.ln-chap h3{font-size:1.15rem;margin:14px 0 6px}.ln-chap h4{margin:0 0 4px}
.ln-k{font-size:.8rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.ln-lead{font-size:1.08rem}
.ln-box{margin:14px 0}.ln-box>b{display:block;margin-bottom:2px}
.ln-stats{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin:12px 0}
.ln-stat{background:var(--soft);border-radius:16px;padding:12px 14px;display:flex;flex-direction:column}
.ln-stat b{font-family:"Baloo 2";font-size:1.9rem;line-height:1.1;color:var(--grass-d)}.ln-stat span{font-weight:600;color:var(--muted);font-size:.92rem}
.ln-two{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));align-items:start}
.ln-svg{width:100%;height:auto;max-width:560px;display:block}.ln-stack{max-width:330px}.ln-grow{max-width:320px}.ln-cyc{max-width:520px;margin:0 auto}
.ln-svgt{font:600 13px Nunito,sans-serif;fill:#1d3557}.ln-svgv{font:800 12px Nunito,sans-serif;fill:#55657a}.ln-svgb{font:800 15px "Baloo 2",Nunito,sans-serif;fill:#1d3557}.ln-svgw{font:800 13px Nunito,sans-serif;fill:#fff}
.ln-svg.anim .ln-bar{transform-box:fill-box;transform-origin:left;animation:lnGrowX .9s cubic-bezier(.2,.8,.2,1) both}
.ln-svg.anim .ln-col{transform-box:fill-box;transform-origin:bottom;animation:lnGrowY 1s cubic-bezier(.2,.8,.2,1) both}
.ln-svg.anim .ln-layer{animation:lnDrop .5s ease-out both}
.ln-flow{stroke-dasharray:8 6;animation:lnDash 1.2s linear infinite}
@keyframes lnGrowX{from{transform:scaleX(0)}}@keyframes lnGrowY{from{transform:scaleY(0)}}@keyframes lnDrop{from{transform:translateY(-60px);opacity:0}}@keyframes lnDash{to{stroke-dashoffset:-28}}
.ln-calc{display:grid;gap:10px;background:var(--soft);border-radius:16px;padding:12px 14px}
.ln-calc label{display:flex;flex-direction:column;font-weight:700;font-size:.92rem;gap:4px}
.ln-calc input,.ln-calc select,.ln-f input{border:2px solid var(--line);border-radius:12px;padding:8px 10px;background:#fff;max-width:100%}
.ln-out{display:flex;flex-direction:column}.ln-out b{font-family:"Baloo 2";font-size:1.8rem;color:var(--red);line-height:1.1}
.ln-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.ln-chip{display:inline-flex;align-items:center;gap:4px;background:#e3f7dc;color:var(--grass-d);border-radius:999px;padding:3px 10px;font-weight:800;font-size:.85rem;text-decoration:none}
.ln-chip.g{background:#e6efff;color:var(--blue)}
.ln-pyr{display:flex;flex-direction:column;align-items:center;gap:5px}
.ln-layer-b,.ln-layer-s{width:var(--w);min-height:46px;color:#fff;font-weight:800;font-size:1.05rem;clip-path:polygon(0 0,100% 0,calc(100% - 16px) 100%,16px 100%);display:flex;align-items:center;justify-content:center;gap:6px;text-shadow:0 1px 2px rgba(0,0,0,.35);transition:transform .15s,filter .15s}
.ln-layer-b[aria-pressed=true]{transform:scale(1.04);filter:brightness(1.1) drop-shadow(0 4px 0 rgba(0,0,0,.2))}
.ln-layer-b:hover{filter:brightness(1.08)}
.ln-pyrlab{display:flex;justify-content:space-between;width:100%;margin:2px 0 0}
.ln-hl li{margin:4px 0}
.ln-tog{display:inline-flex;background:#fff;border-radius:999px;padding:4px;box-shadow:var(--shadow);margin:6px 0 10px}
.ln-tog button{padding:8px 16px;border-radius:999px;font-weight:800}.ln-tog button[aria-pressed=true]{background:var(--ink);color:#fff}
.ln-diag{background:var(--soft);border-radius:18px;padding:10px;margin-bottom:12px}
.ln-flips{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
.ln-flip{perspective:900px;min-height:190px;padding:0;text-align:left}
.ln-flip .in{display:grid;height:100%;transition:transform .6s;transform-style:preserve-3d}
.ln-flip .f,.ln-flip .b{grid-area:1/1;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:18px;padding:14px;box-shadow:var(--shadow)}
.ln-flip .f{color:#fff;font-family:"Baloo 2";font-weight:800;font-size:1.4rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.ln-flip .f .big{font-size:3rem;line-height:1}
.ln-flip .b{background:#fff;border:4px solid;transform:rotateY(180deg);font-size:.95rem;display:flex;flex-direction:column;gap:4px}.ln-flip .b .li:before{content:"• ";color:var(--grass-d);font-weight:800}
.ln-flip.on .in{transform:rotateY(180deg)}
.ln-pcard{border:4px solid;border-radius:18px;padding:12px 14px}.ln-pcard ul{margin:4px 0 0;padding-left:18px}
.ln-labs{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}
.ln-lab{display:grid;grid-template-columns:1fr auto;gap:2px 8px;background:var(--soft);border-radius:14px;padding:10px 12px;text-decoration:none;color:var(--ink);transition:transform .15s}
.ln-lab:hover{transform:translateY(-2px)}.ln-lab .w{color:var(--muted);font-weight:600;font-size:.88rem}.ln-lab .ar{grid-row:1/3;grid-column:2;align-self:center;color:var(--grass-d);font-weight:800}.ln-lab .p{font-weight:800}
.ln-bins{display:grid;gap:12px;grid-template-columns:repeat(3,1fr);margin:12px 0}
.ln-bin{color:#fff;border-radius:16px 16px 24px 24px;padding:12px 8px;font-weight:800;line-height:1.15;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:inset 0 -8px 0 rgba(0,0,0,.15),var(--shadow);font-size:.95rem}
.ln-bin .bi{font-size:2rem}.ln-bin[aria-pressed=true]{outline:4px solid var(--gold);outline-offset:2px}
.ln-binp{border:4px solid;border-radius:16px;padding:10px 12px}
.ln-sdgimg{display:block;width:100%;max-width:520px;border-radius:12px;margin:8px 0 12px}
.ln-sdgs{display:grid;gap:12px}
.ln-sdg{display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:start;border-left:8px solid var(--c);background:var(--soft);border-radius:14px;padding:10px 12px}
.ln-sdg .num{background:var(--c);color:#fff;font-family:"Baloo 2";font-weight:800;font-size:1.8rem;border-radius:12px;display:grid;place-items:center;height:64px}
.ln-plan fieldset{border:2px solid var(--line);border-radius:14px;margin:10px 0;padding:6px 12px}
.ln-plan legend{font-weight:800;padding:0 6px}
.ln-chk{display:flex;gap:8px;align-items:flex-start;padding:4px 0}.ln-chk input{width:20px;height:20px;flex:none;margin-top:2px}
.ln-f{display:flex;flex-direction:column;font-weight:700;margin:8px 0;gap:4px}
.ln-line{display:block;border-bottom:1.5px solid #9aa5b1;height:26px}
.ln-qc{margin-top:18px;border-top:3px dashed var(--line);padding-top:12px}
.ln-qc h3{display:flex;align-items:center;gap:8px}
.ln-q{margin:10px 0 14px}.ln-q p{font-weight:800;margin:0 0 6px}.ln-q .choice{margin:6px 0}
.ln-fb{min-height:1.5em;font-weight:700;margin-top:4px}.ln-fb.ok{color:var(--grass-d)}.ln-fb.no{color:var(--red)}
.ln-foot{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:16px}
.ln-tn{margin-top:12px}
.ln-print .ln-chap{break-before:page;margin-bottom:12px}.ln-print .ln-chap:first-of-type{break-before:auto}
.ln-print .ln-ans{font-size:.85rem;color:var(--muted)}.ln-print ol.ln-opts{margin:4px 0;padding-left:22px}
.ln-print,.ln-print *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
@media (max-width:700px){.ln-nav .tt{display:none}.ln-nav a{padding:6px 10px 6px 6px}.ln-bins{grid-template-columns:repeat(3,1fr)}.ln-bin{font-size:.8rem}.ln-sdg{grid-template-columns:48px 1fr}.ln-sdg .num{height:48px;font-size:1.4rem}}
@media print{.ln-nav,.ln-prog,.ln-foot,.ln-qc button,.ln-print .btn{display:none!important}.ln-flow{animation:none}
 .ln-box,.ln-q,.ln-svg,.ln-sdg,.ln-binp,.ln-pcard,.ln-lab,.ln-stat,.ln-plan fieldset,.ln-hl li,.tbl tr,.ln-sdgimg{break-inside:avoid}.ln-chap h2,.ln-chap h3,.ln-qc h3{break-after:avoid}
 body.ln-printplan main>*:not(.ln-wrap){display:none!important}body.ln-printplan .ln-wrap>*:not(.ln-chap),body.ln-printplan .ln-chap>*:not(.ln-plan){display:none!important}}
`);

/* ---------- state ---------- */
const st = () => WQ.store.getJSON("learn", { done: {}, ok: {} });
const save = s => WQ.store.setJSON("learn", s);

function qcHTML(ch) {
  const s = st(), qs = WQ.pick(ch.qc);
  return `<div class="ln-qc"><h3>✅ ${t(U.qc)}</h3>${qs.map((q, i) => { const key = `${ch.id}-${A()}-${i}`, solved = s.ok[key];
    return `<div class="ln-q" data-q="${i}"><p>${i + 1}. ${E(t(q.q))}</p>${q.a.map((a, j) => `<button class="choice ${solved && j === q.c ? "right" : ""}" data-a="${j}" ${solved ? "disabled" : ""}>${E(t(a))}</button>`).join("")}
      <div class="ln-fb ${solved ? "ok" : ""}" role="status" aria-live="polite">${solved ? `${t(U.right)} ${E(t(q.why))}` : ""}</div></div>`; }).join("")}
    <div class="ln-chdone" aria-live="polite">${s.done[ch.id] ? `<div class="note ok">${t(U.chDone)}</div>` : ""}</div></div>`;
}

let cur = 0;
WQ.registerPage("learn", { mount(el, { args }) {
  if (args && args[0] && +args[0] >= 1 && +args[0] <= CH.length) cur = +args[0] - 1;
  const ch = CH[cur], s = st(), nDone = CH.filter(c => s.done[c.id]).length;
  el.innerHTML = `<div class="ln-wrap">${WQ.head("📘", U.title, U.sub)}
    <nav class="ln-nav" aria-label="${E(t(U.chap))}">${CH.map((c, i) => `<a href="#/learn/${i + 1}" class="${s.done[c.id] ? "done" : ""}" ${i === cur ? 'aria-current="page"' : ""}><span class="n">${s.done[c.id] ? "✓" : i + 1}</span><span aria-hidden="true">${c.icon}</span><span class="tt">${E(t(c.title))}</span></a>`).join("")}</nav>
    <div class="ln-prog"><span class="pill">📘 ${nDone}/${CH.length}</span><div class="meter"><i style="width:${nDone / CH.length * 100}%"></i></div><span class="small muted">${t(U.done)}</span></div>
    <article class="card ln-chap"><div class="ln-k">${t(U.chap)} ${cur + 1} ${t(U.of)} ${CH.length}</div><h2><span aria-hidden="true">${ch.icon}</span> ${E(t(ch.title))}</h2>
      ${ch.body(false)}
      ${TCH() ? box("warn ln-tn", U.tnote, E(t(ch.note))) : ""}
      ${qcHTML(ch)}
      <div class="ln-foot">${cur > 0 ? `<a class="btn alt" href="#/learn/${cur}">${t(U.prev)}</a>` : "<span></span>"}${cur < CH.length - 1 ? `<a class="btn" href="#/learn/${cur + 2}">${t(U.next)}</a>` : `<a class="btn" href="#/games">🎮 ${t({ en: "Go to the games", bm: "Ke permainan" })}</a>`}</div>
    </article>${nDone === CH.length ? `<div class="note ok" style="margin-top:14px">🏅 ${t(U.allDone)}</div>` : ""}
    <section class="card ln-check" aria-labelledby="lnCheckH"><h3 id="lnCheckH">📊 ${t({ en: "How much did you learn?", bm: "Berapa banyak yang anda pelajari?" })}</h3><div class="ln-chips"><a class="btn" href="#/check/post">${t({ en: "Take the after-play check", bm: "Ambil semakan selepas bermain" })}</a> <a class="btn alt" href="#/check/survey">${t({ en: "1-minute survey", bm: "Tinjauan 1 minit" })}</a></div></section></div>`;
  if (ch.wire) ch.wire(el);
  const qs = WQ.pick(ch.qc);
  el.querySelectorAll(".ln-q").forEach(qd => {
    const i = +qd.dataset.q, q = qs[i], fb = qd.querySelector(".ln-fb");
    qd.querySelectorAll("[data-a]").forEach(b => b.onclick = () => {
      if (+b.dataset.a === q.c) {
        WQ.beep(true); b.classList.add("right"); qd.querySelectorAll("[data-a]").forEach(x => x.disabled = true);
        fb.className = "ln-fb ok"; fb.textContent = `${t(U.right)} ${t(q.why)}`;
        const s2 = st(); s2.ok[`${ch.id}-${A()}-${i}`] = 1;
        if (qs.every((_, k) => s2.ok[`${ch.id}-${A()}-${k}`]) && !s2.done[ch.id]) {
          s2.done[ch.id] = new Date().toISOString(); save(s2);
          el.querySelector(".ln-chdone").innerHTML = `<div class="note ok pop">${t(U.chDone)}</div>`;
          const link = el.querySelector(`.ln-nav a[href="#/learn/${cur + 1}"]`); if (link) { link.classList.add("done"); link.querySelector(".n").textContent = "✓"; }
          const n = CH.filter(c => s2.done[c.id]).length; el.querySelector(".ln-prog .pill").textContent = `📘 ${n}/${CH.length}`; el.querySelector(".ln-prog .meter i").style.width = n / CH.length * 100 + "%";
          if (n === CH.length) WQ.award("learn"); else WQ.confetti();
        } else save(s2);
      } else { WQ.beep(false); b.classList.add("wrong"); b.disabled = true; WQ.anim(qd, "shake"); fb.className = "ln-fb no"; fb.textContent = t(U.wrong); }
    });
  });
}});

/* ---------- print booklet: all chapters expanded, static ---------- */
WQ.renderLearnPrint = el => {
  const L = "abcd";
  el.innerHTML = `<div class="ln-print">${CH.map((ch, n) => { const qs = WQ.pick(ch.qc);
    return `<section class="ln-chap"><div class="ln-k">${t(U.chap)} ${n + 1}</div><h2><span aria-hidden="true">${ch.icon}</span> ${E(t(ch.title))}</h2>${ch.body(true)}
      ${TCH() ? box("warn", U.tnote, E(t(ch.note))) : ""}
      <div class="ln-qc"><h3>✅ ${t(U.qc)}</h3>${qs.map((q, i) => `<div class="ln-q"><p>${i + 1}. ${E(t(q.q))}</p><ol class="ln-opts" type="a">${q.a.map(a => `<li>${E(t(a))}</li>`).join("")}</ol><div class="ln-ans">${t(U.ans)}: ${L[q.c]}. ${E(t(q.why))}</div></div>`).join("")}</div></section>`; }).join("")}</div>`;
};
})();
