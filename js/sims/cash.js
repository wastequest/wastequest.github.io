/* Trash-to-Cash Tycoon: 10-day waste-to-wealth (W2W) micro-business game.
   Each day neighbourhood waste arrives; choose up to 3 production batches; sell into a market with changing demand.
   CO2e is not calculated: avoided emissions depend on what each product replaces, and no single simple factor fits.
*/
(() => {
const tx = o => WQ.t(o), kidsMode = () => WQ.aud === "kids";

// ===================== EDIT HERE =====================
// SOURCES: product costs, prices and demand are invented game settings, not market data (research/v2/01_todo_prices_weights.md s.3, seen 2026-10-07).
//   Used cooking oil buy-back RM2.50–3.00/kg: MBSJ council minutes 27 Feb 2025 (RM2.50); Johor recycler list 11 Sep 2026 (RM2.50); MBIP event 7 Feb 2026 (RM3.00).
//   PET 500 mL bottle ≈25 g: ALPLA spec 21–28 g (same value as footprint.js).
// NOTE: EXAMPLE PRICES (RM) for teaching only, not market data.
// Dr Wan Azlina may adjust them. Change only this table: cost = bought materials per batch (RM),
// units = items made per batch, price = normal selling price per item (RM), demand = [min, max] items customers buy per day.
const PRODUCTS = [
 { id:"candle",  e:"🕯️", need:{oil:0.3},               cost:14, units:5,  price:8,  demand:[2,6],  kids:false, name:{en:"Scented candle",bm:"Lilin wangi"}, buy:{en:"wax, wicks, fragrance, tins",bm:"lilin, sumbu, pewangi, bekas tin"} },
 { id:"enzyme",  e:"🧴", need:{peels:1.5},             cost:7,  units:5,  price:6,  demand:[2,6],  kids:true, name:{en:"Eco-enzyme cleaner (500 mL)",bm:"Pencuci eko-enzim (500 mL)"}, note:{en:"Bottled from a batch that has fermented for 3 months; today's peels start the next batch.",bm:"Dibotolkan daripada kelompok yang telah ditapai 3 bulan; kulit hari ini memulakan kelompok seterusnya."}, buy:{en:"spray bottles, brown sugar",bm:"botol semburan, gula perang"} },
 { id:"coffee",  e:"☕", need:{coffee:0.5},            cost:6,  units:10, price:3,  demand:[4,12], kids:true,  name:{en:"Coffee deodoriser sachet",bm:"Uncang penyahbau kopi"}, buy:{en:"cloth pouches, ribbon",bm:"uncang kain, reben"} },
 { id:"planter", e:"🪴", need:{bottles:0.1},           cost:5,  units:3,  price:8,  demand:[1,4],  kids:true,  name:{en:"Self-watering planter",bm:"Pasu siram sendiri"}, buy:{en:"soil, seeds, cotton wick",bm:"tanah, benih, sumbu kapas"} },
 { id:"brick",   e:"🧱", need:{wrappers:0.6,bottles:0.07}, cost:0, units:2, price:2, demand:[0,3], kids:true,  name:{en:"Eco-brick",bm:"Eko-bata"}, buy:{en:"nothing",bm:"tiada"} },
 { id:"tote",    e:"👜", need:{shirts:0.4},            cost:1,  units:2,  price:12, demand:[1,4],  kids:true,  name:{en:"T-shirt tote bag",bm:"Beg tote baju-T"}, buy:{en:"thread",bm:"benang"} },
 { id:"compost", e:"🌱", need:{food:4},                cost:1,  units:2,  price:5,  demand:[1,4],  kids:true,  name:{en:"Compost (3 kg bag)",bm:"Kompos (beg 3 kg)"}, note:{en:"Bagged from a mature pile; today's scraps go into a new pile (compost takes weeks).",bm:"Dibungkus daripada timbunan matang; sisa hari ini masuk ke timbunan baharu (kompos mengambil masa berminggu-minggu)."}, buy:{en:"bags",bm:"beg"} }
];
const SETUP = 150;      // example one-off starter kit (RM): moulds, pot, scale, scissors, compost bin
const GOAL = { kids: 20, other: 35 }; // badge: finish with profit and at least this many kg diverted from landfill
// =====================================================

// waste types: daily arrival range (kg), perishable = rots by the end of the day if unused
const WASTE = {
 oil:{e:"🛢️",r:[0.2,0.8],per:false,name:{en:"Used cooking oil",bm:"Minyak masak terpakai"}},
 peels:{e:"🍊",r:[1,4],per:true,name:{en:"Fruit peels",bm:"Kulit buah"}},
 coffee:{e:"☕",r:[0.3,1.5],per:false,name:{en:"Coffee grounds (dried)",bm:"Hampas kopi (kering)"}},
 bottles:{e:"🧴",r:[0.1,0.4],per:false,name:{en:"Plastic bottles (500 mL, ≈25 g each)",bm:"Botol plastik (500 mL, ≈25 g sebiji)"}},
 wrappers:{e:"🍬",r:[0.2,1],per:false,name:{en:"Clean plastic wrappers",bm:"Pembalut plastik bersih"}},
 shirts:{e:"👕",r:[0,0.6],per:false,name:{en:"Old T-shirts (≈0.2 kg each)",bm:"Baju-T lama (≈0.2 kg sehelai)"}},
 food:{e:"🍚",r:[2,8],per:true,name:{en:"Food scraps (raw, no meat)",bm:"Sisa makanan (mentah, tanpa daging)"}}
};
const DAYS = 10, SLOTS = 3;
let G = null;

const rnd = (a, b) => a + Math.random() * (b - a), r1 = x => Math.round(x * 10) / 10, rm = x => (x < 0 ? "−" : "") + "RM " + Math.abs(x).toFixed(2);
const prods = () => PRODUCTS.filter(p => !G.kids || p.kids);
const goal = () => G.kids ? GOAL.kids : GOAL.other;
const P = id => PRODUCTS.find(p => p.id === id);

function newGame() {
  G = { kids: kidsMode(), day: 0, inv: {}, stock: {}, per: {}, rev: 0, cost: 0, div: 0, spoil: 0, phase: "plan", slots: [], last: null };
  PRODUCTS.forEach(p => { G.stock[p.id] = 0; G.per[p.id] = { b: 0, sold: 0, rev: 0, cost: 0, kg: 0 }; });
  Object.keys(WASTE).forEach(w => G.inv[w] = 0);
  nextDay();
}
function nextDay() {
  G.day++; G.slots = []; G.phase = "plan"; G.arrived = {};
  Object.entries(WASTE).forEach(([k, w]) => { const kg = r1(rnd(...w.r)); G.arrived[k] = kg; G.inv[k] = r1(G.inv[k] + kg); });
  G.market = {}; PRODUCTS.forEach(p => G.market[p.id] = { price: G.kids ? Math.round(p.price * rnd(0.8, 1.2)) : Math.round(p.price * rnd(0.8, 1.2) * 2) / 2, demand: Math.round(rnd(p.demand[0], p.demand[1])) });
}
function used(extra) { // waste committed by the planned slots (+ one more batch of `extra`)
  const u = {}; [...G.slots, ...(extra ? [extra] : [])].forEach(id => Object.entries(P(id).need).forEach(([k, kg]) => u[k] = (u[k] || 0) + kg)); return u;
}
const canMake = id => G.slots.length < SLOTS && Object.entries(used(id)).every(([k, kg]) => kg <= G.inv[k] + 1e-9);
function runDay() {
  const res = { made: {}, sold: {}, rev: 0, cost: 0, div: 0, spoil: 0 };
  G.slots.forEach(id => { const p = P(id), c = G.kids ? 0 : p.cost; res.made[id] = (res.made[id] || 0) + p.units; G.stock[id] += p.units; res.cost += c; G.per[id].b++; G.per[id].cost += c;
    Object.entries(p.need).forEach(([k, kg]) => { G.inv[k] = r1(G.inv[k] - kg); res.div += kg; G.per[id].kg += kg; }); });
  PRODUCTS.forEach(p => { const s = Math.min(G.stock[p.id], G.market[p.id].demand); if (s) { G.stock[p.id] -= s; res.sold[p.id] = s; const v = s * G.market[p.id].price; res.rev += v; G.per[p.id].sold += s; G.per[p.id].rev += v; } });
  Object.entries(WASTE).forEach(([k, w]) => { if (w.per && G.inv[k] > 0) { res.spoil += G.inv[k]; G.inv[k] = 0; } });
  G.rev += res.rev; G.cost += res.cost; G.div += res.div; G.spoil += res.spoil; G.last = res; G.phase = "result";
}

WQ.css("cash", `
.tc-top{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.tc-cols{display:grid;gap:16px;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)}
@media (max-width:800px){.tc-cols{grid-template-columns:1fr}}
.tc-inv{display:grid;gap:6px;grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
.tc-w{background:var(--soft);border-radius:12px;padding:6px 10px;font-size:.85rem;line-height:1.2}.tc-w b{font-size:1.05rem}
.tc-w .new{color:var(--grass-d);font-weight:800}.tc-w.per{outline:2px dashed #f2b25c}
.tc-prods{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
.tc-p{background:#fff;border:3px solid var(--line);border-radius:18px;padding:10px 12px;display:flex;flex-direction:column;gap:4px;font-size:.88rem}
.tc-p h3{font-size:1.05rem;display:flex;gap:6px;align-items:center}.tc-p h3 span{font-size:1.5rem}
.tc-p .btn{padding:8px 14px;font-size:.95rem;margin-top:auto}
.tc-p.off{opacity:.55}
.tc-slots{display:flex;gap:8px;flex-wrap:wrap}
.tc-slot{min-width:92px;min-height:64px;border:3px dashed var(--line);border-radius:16px;display:grid;place-items:center;font-weight:800;padding:6px 10px;text-align:center;background:#fff}
.tc-slot.on{border-style:solid;border-color:var(--orange);background:#fff5e6}
.tc-slot .x{font-size:.75rem;color:var(--red)}
.tc-kiki{display:flex;gap:10px;align-items:flex-start}.tc-kiki svg{width:48px;flex:none}
.tc-p .muted{font-size:.8rem}
.tc-cols>.card{margin:0}
.tc-big{font-family:"Baloo 2";font-size:1.45rem;white-space:nowrap;margin-top:4px;font-weight:800;line-height:1}
.tc-kpi{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(125px,1fr))}
.tc-kpi div{background:var(--soft);border-radius:14px;padding:10px 12px}
`);

WQ.registerGame("cash", { order: 13, kind: "sim", icon: "💰", ages: "7+",
  title: {en:"Trash-to-Cash Tycoon",bm:"Usahawan Sampah-ke-Wang"},
  desc: {en:"Run a 10-day waste-to-wealth business: turn neighbourhood waste into products and profit.",bm:"Jalankan perniagaan sisa kepada kekayaan selama 10 hari: tukar sisa kejiranan menjadi produk dan untung."},
  badge: {icon:"💰",name:{en:"Waste Tycoon",bm:"Usahawan Sisa"},desc:{en:"Finished with a profit and kept lots of waste out of landfill",bm:"Tamat dengan untung dan mengelakkan banyak sisa dari tapak pelupusan"}},
  mount(el) {
    const $ = s => el.querySelector(s);
    if (!G || G.kids !== kidsMode()) newGame();
    const money = x => G.kids ? `🪙 ${Math.round(x)}` : rm(x);
    function render() {
      const kpis = `<div class="tc-top"><span class="pill">📅 ${tx({en:"Day",bm:"Hari"})} ${Math.min(G.day, DAYS)}/${DAYS}</span><span class="pill">${G.kids ? "" : "💵 "}${money(G.rev - G.cost)}</span><span class="pill">♻️ ${r1(G.div)} kg ${tx({en:"diverted",bm:"dielakkan"})}</span><span class="pill">🗑️ ${r1(G.spoil)} kg ${tx({en:"rotted",bm:"reput"})}</span></div>`;
      el.innerHTML = WQ.head("💰", WQ.games.cash.title, WQ.games.cash.desc) + kpis + `<div id="tcBody"></div>`;
      const b = $("#tcBody");
      if (G.phase === "end") b.innerHTML = endView();
      else if (G.phase === "result") b.innerHTML = resultView();
      else b.innerHTML = planView();
      bind();
    }
    function invView() {
      return `<div class="tc-inv">${Object.entries(WASTE).filter(([k]) => prods().some(p => p.need[k])).map(([k, w]) => `<div class="tc-w ${w.per ? "per" : ""}"><span>${w.e} ${tx(w.name)}</span><br><b>${r1(G.inv[k])} kg</b> ${G.phase === "plan" && G.arrived[k] ? `<span class="new">+${G.arrived[k]}</span>` : ""}</div>`).join("")}</div>
        <p class="small muted">${tx({en:"Dashed = rots tonight if not used (goes to landfill).",bm:"Bergaris putus = reput malam ini jika tidak digunakan (ke tapak pelupusan)."})}</p>`;
    }
    function planView() {
      const u = used();
      return `<div class="tc-cols"><div class="card stack"><h2>🚚 ${tx({en:"Waste in your store",bm:"Sisa dalam stor anda"})}</h2>${invView()}
          ${G.day === 1 ? `<div class="note small">${tx({en:"Each day you have 3 time slots. Each slot makes one batch of a product. Products sell to today's customers; extras stay in stock for later days.",bm:"Setiap hari anda ada 3 slot masa. Setiap slot menghasilkan satu kelompok produk. Produk dijual kepada pelanggan hari ini; lebihan disimpan untuk hari berikutnya."})}</div>` : ""}
          <div class="note danger small">⚠️ ${G.kids ? tx({en:"Cutting bottles and cloth needs sharp tools: ask an adult to help with the real thing.",bm:"Memotong botol dan kain memerlukan alat tajam: minta orang dewasa membantu untuk kerja sebenar."}) : tx({en:"Candle-making uses heat and hot wax, and cutting needs sharp tools: adult supervision for the real thing.",bm:"Membuat lilin melibatkan haba dan lilin panas, dan memotong memerlukan alat tajam: perlu pengawasan orang dewasa untuk kerja sebenar."})}</div></div>
        <div class="card stack"><h2>🏭 ${tx({en:"Plan today's production",bm:"Rancang pengeluaran hari ini"})}</h2>
          <div class="tc-slots" aria-live="polite">${Array.from({ length: SLOTS }, (_, i) => { const id = G.slots[i]; return id ? `<button class="tc-slot on" data-rm="${i}" aria-label="${WQ.esc(tx({en:"Remove",bm:"Buang"}))} ${WQ.esc(tx(P(id).name))}"><span style="font-size:1.6rem">${P(id).e}</span><span class="x">✕ ${tx({en:"remove",bm:"buang"})}</span></button>` : `<div class="tc-slot">⏱️ ${tx({en:"free",bm:"kosong"})}</div>`; }).join("")}
            <button class="btn" id="tcRun">▶ ${tx({en:"Run the day",bm:"Jalankan hari"})}</button></div>
          <div class="tc-prods">${prods().map(p => { const m = G.market[p.id], ok = canMake(p.id);
            return `<div class="tc-p ${ok ? "" : "off"}"><h3><span>${p.e}</span>${tx(p.name)}</h3>${p.note ? `<div class="muted">${tx(p.note)}</div>` : ""}
              <div>🧺 ${tx({en:"Needs",bm:"Perlu"})}: ${Object.entries(p.need).map(([k, kg]) => `${WASTE[k].e} ${kg} kg`).join(" + ")}</div>
              ${G.kids ? "" : `<div>🛒 ${tx({en:"Buy",bm:"Beli"})}: ${rm(p.cost)} <span class="muted">(${tx(p.buy)})</span></div>`}
              <div>📦 ${tx({en:"Makes",bm:"Hasil"})} ${p.units} · ${G.kids ? "🪙" : "🏷️"} ${G.kids ? m.price : rm(m.price)} ${tx({en:"each",bm:"seunit"})}${m.price > p.price ? " 📈" : m.price < p.price ? " 📉" : ""}</div>
              <div>🙋 ${tx({en:"Customers today",bm:"Pelanggan hari ini"})}: <b>${m.demand}</b> · ${tx({en:"in stock",bm:"dalam stok"})}: ${G.stock[p.id]}</div>
              <button class="btn ${ok ? "" : "alt"}" data-add="${p.id}" ${ok ? "" : "disabled"}>＋ ${tx({en:"Make a batch",bm:"Buat satu kelompok"})}</button></div>`; }).join("")}</div>
        </div></div>`;
    }
    function resultView() {
      const r = G.last, lines = Object.keys({ ...r.made, ...r.sold }).map(id => `<tr><td>${P(id).e} ${tx(P(id).name)}</td><td>${r.made[id] || 0}</td><td>${r.sold[id] || 0}</td><td>${G.stock[id]}</td></tr>`).join("");
      const left = PRODUCTS.filter(p => G.stock[p.id] > 0 && (r.made[p.id] || 0) > (r.sold[p.id] || 0)).length;
      return `<div class="card stack"><h2>🌙 ${tx({en:"End of day",bm:"Akhir hari"})} ${G.day}</h2>
        ${lines ? `<div class="tablewrap"><table class="tbl"><tr><th>${tx({en:"Product",bm:"Produk"})}</th><th>${tx({en:"Made",bm:"Dibuat"})}</th><th>${tx({en:"Sold",bm:"Dijual"})}</th><th>${tx({en:"Stock left",bm:"Baki stok"})}</th></tr>${lines}</table></div>` : `<p class="muted">${tx({en:"Nothing made or sold today.",bm:"Tiada apa dibuat atau dijual hari ini."})}</p>`}
        <div class="tc-kpi"><div>${tx({en:"Sales",bm:"Jualan"})}<div class="tc-big">${money(r.rev)}</div></div>${G.kids ? "" : `<div>${tx({en:"Materials bought",bm:"Bahan dibeli"})}<div class="tc-big">${rm(r.cost)}</div></div><div>${tx({en:"Profit today",bm:"Untung hari ini"})}<div class="tc-big" style="color:${r.rev - r.cost >= 0 ? "var(--grass-d)" : "var(--red)"}">${rm(r.rev - r.cost)}</div></div>`}
          <div>♻️ ${tx({en:"Waste used",bm:"Sisa digunakan"})}<div class="tc-big">${r1(r.div)} kg</div></div><div>🗑️ ${tx({en:"Rotted → landfill",bm:"Reput → tapak pelupusan"})}<div class="tc-big">${r1(r.spoil)} kg</div></div></div>
        <div class="note tc-kiki">${WQ.MASCOT}<div><b>Kiki:</b> ${tx(r.spoil > 2 ? {en:"Food scraps and peels rot fast. Compost or eco-enzyme keeps them out of landfill.",bm:"Sisa makanan dan kulit buah cepat reput. Kompos atau eko-enzim mengelakkannya dari tapak pelupusan."}
          : left ? {en:"Some stock did not sell. Check how many customers there are before you make more.",bm:"Sebahagian stok tidak terjual. Semak bilangan pelanggan sebelum membuat lebih banyak."}
          : {en:"Nice planning! Watch prices: 📈 means a good day to sell.",bm:"Perancangan yang bagus! Perhatikan harga: 📈 bermaksud hari yang baik untuk menjual."})}</div></div>
        <div class="row"><button class="btn" id="tcNext">${G.day < DAYS ? tx({en:"Next day →",bm:"Hari seterusnya →"}) : tx({en:"See final results",bm:"Lihat keputusan akhir"})}</button></div></div>`;
    }
    function endView() {
      const profit = G.rev - G.cost, unsold = PRODUCTS.reduce((a, p) => a + G.stock[p.id], 0), win = profit > 0 && G.div >= goal();
      const rows = prods().filter(p => G.per[p.id].b).map(p => { const s = G.per[p.id], pr = s.rev - s.cost;
        return `<tr><td>${p.e} ${tx(p.name)}</td><td>${s.b}</td><td>${s.sold}/${s.b * p.units}</td><td>${money(s.rev)}</td>${G.kids ? "" : `<td>${rm(s.cost)}</td><td>${rm(pr)}</td><td>${s.rev ? Math.round(pr / s.rev * 100) + "%" : "–"}</td>`}<td>${r1(s.kg)}</td></tr>`; }).join("");
      const unit = !G.kids ? `<h3>📐 ${tx({en:"Unit economics (at normal prices)",bm:"Ekonomi unit (pada harga biasa)"})}</h3>
        <div class="tablewrap"><table class="tbl small"><tr><th>${tx({en:"Product",bm:"Produk"})}</th><th>${tx({en:"Revenue / batch",bm:"Hasil / kelompok"})}</th><th>${tx({en:"Materials / batch",bm:"Bahan / kelompok"})}</th><th>${tx({en:"Contribution margin",bm:"Margin sumbangan"})}</th><th>${tx({en:"Margin %",bm:"Margin %"})}</th><th>${tx({en:"RM per kg waste",bm:"RM sekg sisa"})}</th><th>${tx({en:`Batches to recover ${rm(SETUP)} setup`,bm:`Kelompok untuk pulang modal ${rm(SETUP)}`})}</th></tr>
        ${PRODUCTS.map(p => { const rv = p.units * p.price, cm = rv - p.cost, kg = Object.values(p.need).reduce((a, b) => a + b, 0);
          return `<tr><td>${p.e} ${tx(p.name)}</td><td>${rm(rv)}</td><td>${rm(p.cost)}</td><td><b>${rm(cm)}</b></td><td>${Math.round(cm / rv * 100)}%</td><td>${rm(cm / kg)}</td><td>${Math.ceil(SETUP / cm)}</td></tr>`; }).join("")}</table></div>
        <p class="small">${tx({en:`Break-even: a one-off starter kit (moulds, pot, scale, scissors, bin) of ${rm(SETUP)} is recovered when total contribution margin reaches ${rm(SETUP)}. Your 10 days earned ${rm(profit)}, so you ${profit >= SETUP ? "have" : "have not yet"} broken even. Labour time is not costed here; a real business must pay for it too.`,bm:`Titik pulang modal: kit permulaan sekali beli (acuan, periuk, penimbang, gunting, tong) bernilai ${rm(SETUP)} pulang modal apabila jumlah margin sumbangan mencapai ${rm(SETUP)}. 10 hari anda memperoleh ${rm(profit)}, jadi anda ${profit >= SETUP ? "sudah" : "belum"} pulang modal. Kos masa tenaga kerja tidak dikira di sini; perniagaan sebenar perlu membayarnya juga.`})}</p>` : "";
      return `<div class="card stack"><h2>${win ? "🏆" : "📊"} ${tx({en:"Your 10-day results",bm:"Keputusan 10 hari anda"})}</h2>
        <div class="tc-kpi"><div>${G.kids ? tx({en:"Coins earned",bm:"Syiling diperoleh"}) : tx({en:"Total profit",bm:"Jumlah untung"})}<div class="tc-big" style="color:${profit >= 0 ? "var(--grass-d)" : "var(--red)"}">${money(profit)}</div></div>
          ${G.kids ? "" : `<div>${tx({en:"Sales",bm:"Jualan"})}<div class="tc-big">${rm(G.rev)}</div></div><div>${tx({en:"Materials",bm:"Bahan"})}<div class="tc-big">${rm(G.cost)}</div></div>`}
          <div>♻️ ${tx({en:"Kept out of landfill",bm:"Dielakkan dari tapak pelupusan"})}<div class="tc-big">${r1(G.div)} kg</div></div><div>🗑️ ${tx({en:"Rotted → landfill",bm:"Reput → tapak pelupusan"})}<div class="tc-big">${r1(G.spoil)} kg</div></div><div>📦 ${tx({en:"Unsold items",bm:"Barang tidak terjual"})}<div class="tc-big">${unsold}</div></div></div>
        <div class="note ${win ? "ok" : "warn"}">${win ? tx({en:"You ran a profitable business AND kept waste out of landfill. That is waste-to-wealth!",bm:"Anda menjalankan perniagaan yang menguntungkan DAN mengelakkan sisa ke tapak pelupusan. Itulah sisa kepada kekayaan!"})
          : tx({en:`Badge goal: finish with ${G.kids ? "coins" : "a profit"} and at least ${goal()} kg diverted. Tip: compost uses the most kilograms.`,bm:`Sasaran lencana: tamat dengan ${G.kids ? "syiling" : "untung"} dan sekurang-kurangnya ${goal()} kg dielakkan. Tip: kompos menggunakan paling banyak kilogram.`})}</div>
        ${rows ? `<div class="tablewrap"><table class="tbl small"><tr><th>${tx({en:"Product",bm:"Produk"})}</th><th>${tx({en:"Batches",bm:"Kelompok"})}</th><th>${tx({en:"Sold",bm:"Dijual"})}</th><th>${tx({en:"Sales",bm:"Jualan"})}</th>${G.kids ? "" : `<th>${tx({en:"Materials",bm:"Bahan"})}</th><th>${tx({en:"Profit",bm:"Untung"})}</th><th>${tx({en:"Margin",bm:"Margin"})}</th>`}<th>kg</th></tr>${rows}</table></div>` : ""}
        ${unit}
        <h3>💡 ${tx({en:"Lessons",bm:"Pengajaran"})}</h3>
        <ul>${(G.kids ? [
          {en:"Turning trash into useful things gives it value.",bm:"Menukar sampah menjadi barang berguna memberinya nilai."},
          {en:"Only make what people want to buy.",bm:"Buat hanya apa yang orang mahu beli."},
          {en:"Some products earn lots of coins; others save lots of waste. Both matter!",bm:"Sesetengah produk memberi banyak syiling; yang lain menjimatkan banyak sisa. Kedua-duanya penting!"}] : [
          {en:"Cost vs price: profit = sales − costs. A high price means little if materials eat it up.",bm:"Kos vs harga: untung = jualan − kos. Harga tinggi tidak bermakna jika bahan menghabiskannya."},
          {en:"Demand: making more than customers want leaves unsold stock, which is money tied up.",bm:"Permintaan: membuat lebih daripada kehendak pelanggan meninggalkan stok tidak terjual, iaitu wang yang terikat."},
          {en:"Value-adding: a 0.4 kg T-shirt becomes a tote worth far more per kg than compost. But compost handles the heavy, perishable waste.",bm:"Nilai tambah: baju-T 0.4 kg menjadi beg tote yang jauh lebih bernilai sekilogram berbanding kompos. Tetapi kompos mengendalikan sisa berat yang mudah reput."},
          {en:"Perishable waste must be processed quickly or it is lost to landfill.",bm:"Sisa mudah reput mesti diproses dengan cepat atau ia hilang ke tapak pelupusan."}])
          .map(l => `<li>${tx(l)}</li>`).join("")}</ul>
        <p class="small muted">${tx({en:"Prices are example values for teaching, not market data. Real buy-back rates vary by buyer, place and date: for example, used cooking oil fetched about RM2.50–3.00/kg at Malaysian collection points in 2025–2026. CO₂ savings are not shown because they depend on what each product replaces.",bm:"Harga ialah nilai contoh untuk pengajaran, bukan data pasaran. Kadar belian semula sebenar berbeza mengikut pembeli, tempat dan tarikh: contohnya, minyak masak terpakai dibeli kira-kira RM2.50–3.00/kg di pusat kutipan di Malaysia pada 2025–2026. Penjimatan CO₂ tidak ditunjukkan kerana ia bergantung pada apa yang digantikan oleh setiap produk."})}</p>
        ${WQ.aud === "teacher" ? `<div class="note small">🧑‍🏫 ${tx({en:"Teaching note: let groups compete, then ask each to defend one product choice using the unit-economics table. Prices are in the PRODUCTS table at the top of js/sims/cash.js.",bm:"Nota pengajaran: biarkan kumpulan bertanding, kemudian minta setiap kumpulan mempertahankan satu pilihan produk menggunakan jadual ekonomi unit. Harga terdapat dalam jadual PRODUCTS di bahagian atas js/sims/cash.js."})}</div>` : ""}
        <div class="row"><button class="btn" id="tcNew">🔁 ${tx({en:"Play again",bm:"Main lagi"})}</button><a class="btn blue" href="#/labs">🧪 ${tx({en:"Make these for real",bm:"Buat yang sebenar"})}</a><a class="btn alt" href="#/games">${tx({en:"All games",bm:"Semua permainan"})}</a></div></div>`;
    }
    function bind() {
      el.querySelectorAll("[data-add]").forEach(b => b.onclick = () => { if (canMake(b.dataset.add)) { G.slots.push(b.dataset.add); WQ.beep(true); render(); } });
      el.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { G.slots.splice(+b.dataset.rm, 1); render(); });
      if ($("#tcRun")) $("#tcRun").onclick = () => { runDay(); render(); };
      if ($("#tcNext")) $("#tcNext").onclick = () => {
        if (G.day < DAYS) nextDay();
        else { G.phase = "end"; const profit = G.rev - G.cost; WQ.best("cash", Math.round(profit)); if (profit > 0 && G.div >= goal()) WQ.award("cash"); }
        render(); scrollTo(0, 0); };
      if ($("#tcNew")) $("#tcNew").onclick = () => { newGame(); render(); };
    }
    render();
  }});
})();
