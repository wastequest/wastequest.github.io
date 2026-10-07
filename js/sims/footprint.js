/* My Waste Footprint: weekly item counts -> kg/week, kg/person/day vs Malaysian average, composition donut, 3 pledges, printable card.
SOURCES:
 - Malaysia 1.17 kg/person/day and household composition %: SWCorp, via The Star, 2 Jan 2024 (as given in SPEC.md).
 - SWCorp separation-at-source bins: blue = paper, orange = plastic & metal, brown = glass.
 - Item weights = rounded example values for named item types, not Malaysian averages (research/v2/01_todo_prices_weights.md s.4, seen 2026-10-07):
   500 mL PET drink bottle 25 g (ALPLA spec 21–28 g); 500 mL PP takeaway container + lid 22 g (Paras 21.64 g, Cosmo 27 g);
   HDPE carrier bag 8 g (UK government-hosted bag study 8.12 g); 330 mL aluminium can 12 g (Cambridge packaging study 12.28 g);
   small 250 mL glass jar 200 g (named jars 175–221 g); used baby diaper 200 g (industry summary 200–212 g);
   plate of leftovers 100 g (school-canteen study 107 g/day, rounded lesson scenario); kitchen scraps = a defined 200 g portion;
   paper = a 100 g bundle (about 20 A4 sheets at 80 gsm ≈5 g each).
*/
(() => {
const tx = o => WQ.t(o);
const MY = 1.17; // kg/person/day, SWCorp 2024
const CAT = {
  food:{c:"#5cbf4a",n:{en:"Food",bm:"Makanan"}}, plastic:{c:"#f28b1d",n:{en:"Plastic",bm:"Plastik"}}, paper:{c:"#1f6fd1",n:{en:"Paper",bm:"Kertas"}},
  metal:{c:"#7b8a99",n:{en:"Metal",bm:"Logam"}}, glass:{c:"#8a5a2b",n:{en:"Glass",bm:"Kaca"}}, diaper:{c:"#d62839",n:{en:"Diapers",bm:"Lampin"}}
};
// fate: rec = recyclable in a SWCorp bin, comp = compostable (bokashi for cooked food), hard = hard to recycle -> best reduced
const ITEMS = [
  {id:"bottle",e:"🧴",g:25,cat:"plastic",fate:"rec",bin:"orange",n:{en:"Plastic drink bottles (500 mL)",bm:"Botol minuman plastik (500 mL)"}},
  {id:"box",e:"🥡",g:22,cat:"plastic",fate:"hard",n:{en:"Plastic takeaway containers with lids",bm:"Bekas makanan bungkus plastik bertutup"}},
  {id:"bag",e:"🛍️",g:8,cat:"plastic",fate:"hard",n:{en:"Plastic bags",bm:"Beg plastik"}},
  {id:"left",e:"🍛",g:100,cat:"food",fate:"comp",n:{en:"Plates of leftover food",bm:"Pinggan sisa makanan"}},
  {id:"scrap",e:"🥕",g:200,cat:"food",fate:"comp",n:{en:"Portions of peels & kitchen scraps (200 g)",bm:"Bahagian kulit & sisa dapur (200 g)"}},
  {id:"paper",e:"📦",g:100,cat:"paper",fate:"rec",bin:"blue",n:{en:"Bundles of paper & boxes (100 g)",bm:"Ikatan kertas & kotak (100 g)"}},
  {id:"can",e:"🥫",g:12,cat:"metal",fate:"rec",bin:"orange",n:{en:"Aluminium drink cans (330 mL)",bm:"Tin minuman aluminium (330 mL)"}},
  {id:"glass",e:"🫙",g:200,cat:"glass",fate:"rec",bin:"brown",n:{en:"Small glass jars (250 mL)",bm:"Balang kaca kecil (250 mL)"}},
  {id:"diaper",e:"👶",g:200,cat:"diaper",fate:"hard",opt:true,n:{en:"Used disposable diapers",bm:"Lampin pakai buang terpakai"}}
];
// cut = fraction of that item avoided; divert = item kinds kept out of landfill (composted / recycled)
const PLEDGES = [
  {id:"bottle",e:"🚰",cut:{bottle:0.8},n:{en:"Carry my own water bottle",bm:"Bawa botol air sendiri"}},
  {id:"box",e:"🍱",cut:{box:0.8},n:{en:"Bring my own container for takeaway",bm:"Bawa bekas sendiri untuk bungkus makanan"}},
  {id:"bag",e:"👜",cut:{bag:0.9},n:{en:"Say no to plastic bags",bm:"Tolak beg plastik"}},
  {id:"plate",e:"🍽️",cut:{left:0.5},n:{en:"Take only what I can finish",bm:"Ambil hanya apa yang boleh dihabiskan"}},
  {id:"paper",e:"📄",cut:{paper:0.3},n:{en:"Reuse paper and choose e-bills",bm:"Guna semula kertas dan pilih bil-e"}},
  {id:"comp",e:"🌱",divert:"comp",n:{en:"Compost our food scraps",bm:"Kompos sisa makanan kami"}},
  {id:"sep",e:"♻️",divert:"rec",n:{en:"Separate recyclables into SWCorp bins",bm:"Asingkan bahan kitar semula ke tong SWCorp"}},
  {id:"cloth",e:"🧷",cut:{diaper:0.3},needs:"diaper",n:{en:"Use cloth diapers some of the time",bm:"Guna lampin kain sebahagian masa"}}
];
const S = { size: 4, diaper: false, cnt: { bottle:6, box:5, bag:10, left:4, scrap:7, paper:3, can:4, glass:1, diaper:0 }, pick: [], name: "", card: false };

const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100;
const items = () => ITEMS.filter(i => !i.opt || S.diaper);
const kg = i => S.cnt[i.id] * i.g / 1000;
function calc(pick) {
  const ps = PLEDGES.filter(p => pick.includes(p.id));
  let tot = 0, land = 0; const byCat = {}, fate = { rec: 0, comp: 0, hard: 0 };
  items().forEach(i => { const w = kg(i); tot += w; byCat[i.cat] = (byCat[i.cat] || 0) + w; fate[i.fate] += w;
    let a = w; ps.forEach(p => { if (p.cut && p.cut[i.id]) a *= 1 - p.cut[i.id]; });
    if (ps.some(p => p.divert === i.fate)) a = 0; land += a; });
  return { tot, byCat, fate, land, saved: tot - land };
}

WQ.css("footprint", `
.fp-cols{display:grid;gap:16px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
@media (max-width:820px){.fp-cols{grid-template-columns:1fr}}
.fp-cols>.card{margin:0}
.fp-it{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--line)}
.fp-it .lb{flex:1;min-width:0;line-height:1.2}.fp-it .lb small{color:var(--muted)}
.fp-step{display:flex;align-items:center;gap:4px;flex:none}
.fp-step button{width:38px;height:38px;border-radius:50%;background:var(--soft);border:2px solid var(--line);font-weight:800;font-size:1.2rem;line-height:1}
.fp-step input{width:52px;text-align:center;font-weight:800;font-size:1.05rem;border:2px solid var(--line);border-radius:10px;padding:5px 2px}
.fp-donut{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.fp-donut svg{width:170px;flex:none}
.fp-leg{display:grid;gap:3px;font-size:.88rem}.fp-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.fp-bar{height:22px;border-radius:999px;background:var(--soft);overflow:hidden;margin:3px 0 8px}.fp-bar i{display:block;height:100%;border-radius:999px;transition:width .4s}
.fp-big{font-family:"Baloo 2";font-size:1.7rem;font-weight:800;line-height:1.1}
.fp-pl{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
.fp-pl .choice{display:flex;gap:10px;align-items:center}.fp-pl .choice span{font-size:1.5rem}
.fp-pl .choice.on{border-color:var(--grass);background:#eafbe4}.fp-pl .choice:disabled{opacity:.5}
@media (max-width:480px){.fp-step button{width:34px;height:34px}.fp-step input{width:44px}.fp-it .lb{font-size:.9rem}}
.fp-card{border:4px dashed var(--grass);border-radius:22px;padding:18px;background:#fff;text-align:center;max-width:560px;margin:0 auto}
.fp-card .mascot{width:80px}.fp-card ul{text-align:left;display:inline-block;margin:8px 0;font-size:1.05rem}
.fp-card h2{font-size:1.6rem}
@media print{.fp-hide{display:none!important}.fp-card{border-color:#3a9a2c;margin-top:0}.fp-card .mascot{animation:none}}
`);

WQ.registerGame("footprint", { order: 14, kind: "sim", icon: "👣", ages: "7+",
  title: {en:"My Waste Footprint",bm:"Jejak Sisa Saya"},
  desc: {en:"Count a week of your family's waste, compare with Malaysia, then make a pledge card.",bm:"Kira sisa keluarga anda selama seminggu, bandingkan dengan Malaysia, kemudian buat kad ikrar."},
  badge: {icon:"👣",name:{en:"Footprint Pledger",bm:"Pengikrar Jejak Sisa"},desc:{en:"Made a 3-pledge waste reduction card",bm:"Membuat kad ikrar 3 langkah kurangkan sisa"}},
  mount(el) {
    const $ = s => el.querySelector(s), adv = WQ.aud !== "kids";
    el.innerHTML = `<div class="fp-hide">${WQ.head("👣", WQ.games.footprint.title, WQ.games.footprint.desc)}</div>
      <div class="fp-cols fp-hide"><div class="card"><h2>📝 ${tx({en:"One week at home",bm:"Seminggu di rumah"})}</h2>
        <div class="fp-it"><span style="font-size:1.5rem">👨‍👩‍👧</span><div class="lb"><b>${tx({en:"People at home",bm:"Bilangan orang di rumah"})}</b></div>${step("size", S.size, tx({en:"People at home",bm:"Bilangan orang di rumah"}))}</div>
        <div id="fpItems"></div>
        <label class="row small" style="margin-top:8px;gap:8px"><input type="checkbox" id="fpDia" ${S.diaper ? "checked" : ""} style="width:22px;height:22px"> ${tx({en:"We use disposable diapers",bm:"Kami guna lampin pakai buang"})}</label>
        <p class="small muted">${tx({en:"Weights are typical estimates (≈) for one item.",bm:"Berat ialah anggaran biasa (≈) bagi satu barang."})}</p></div>
        <div class="card stack" id="fpRes" aria-live="polite"></div></div>
      <div class="card stack fp-hide" id="fpPledge"></div>
      <div id="fpCardWrap"></div>`;
    function step(id, v, lab) { return `<div class="fp-step"><button data-dec="${id}" aria-label="−">−</button><input type="number" inputmode="numeric" min="${id === "size" ? 1 : 0}" max="${id === "size" ? 20 : 200}" value="${v}" data-in="${id}" aria-label="${WQ.esc(lab)}"><button data-inc="${id}" aria-label="+">+</button></div>`; }
    function itemsView() {
      $("#fpItems").innerHTML = items().map(i => `<div class="fp-it"><span style="font-size:1.5rem">${i.e}</span><div class="lb">${tx(i.n)}<br><small>≈${i.g} g ${tx({en:"each",bm:"sebiji"})}</small></div>${step(i.id, S.cnt[i.id], tx(i.n))}</div>`).join("");
    }
    function set(id, v) {
      const lo = id === "size" ? 1 : 0, hi = id === "size" ? 20 : 200; v = Math.max(lo, Math.min(hi, Math.round(+v || 0)));
      if (id === "size") S.size = v; else S.cnt[id] = v;
      const inp = el.querySelector(`[data-in="${id}"]`); if (inp && +inp.value !== v) inp.value = v;
      results(); pledges();
    }
    function donut(c) {
      const R = 60, C = 2 * Math.PI * R; let off = 0;
      const segs = Object.entries(c.byCat).filter(([, w]) => w > 0).map(([k, w]) => { const f = w / c.tot, s = `<circle r="${R}" cx="85" cy="85" fill="none" stroke="${CAT[k].c}" stroke-width="30" stroke-dasharray="${f * C} ${C}" stroke-dashoffset="${-off * C}" transform="rotate(-90 85 85)"><title>${tx(CAT[k].n)} ${Math.round(f * 100)}%</title></circle>`; off += f; return s; }).join("");
      return `<div class="fp-donut"><svg viewBox="0 0 170 170" role="img" aria-label="${tx({en:"Waste composition",bm:"Komposisi sisa"})}"><circle r="60" cx="85" cy="85" fill="none" stroke="#eef2f6" stroke-width="30"/>${segs}<text x="85" y="82" text-anchor="middle" font-weight="800" font-size="20" fill="#1d3557">${r1(c.tot)}</text><text x="85" y="102" text-anchor="middle" font-size="12" fill="#55657a">kg/${tx({en:"week",bm:"minggu"})}</text></svg>
        <div class="fp-leg">${Object.entries(c.byCat).filter(([, w]) => w > 0).sort((a, b) => b[1] - a[1]).map(([k, w]) => `<div><i style="background:${CAT[k].c}"></i>${tx(CAT[k].n)}: <b>${Math.round(w / c.tot * 100)}%</b> (${r2(w)} kg)</div>`).join("")}</div></div>`;
    }
    function results() {
      const c = calc([]), pp = c.tot / S.size / 7, max = Math.max(pp, MY);
      if (!c.tot) { $("#fpRes").innerHTML = `<h2>📊 ${tx({en:"Your results",bm:"Keputusan anda"})}</h2><p>${tx({en:"Add some items to see your footprint.",bm:"Tambah beberapa barang untuk melihat jejak anda."})}</p>`; return; }
      const sh = k => Math.round(c.fate[k] / c.tot * 100);
      $("#fpRes").innerHTML = `<h2>📊 ${tx({en:"Your results",bm:"Keputusan anda"})}</h2>
        <div class="row" style="gap:18px"><div>${tx({en:"Household per week",bm:"Isi rumah seminggu"})}<div class="fp-big">${r1(c.tot)} kg</div></div><div>${tx({en:"Per person per day",bm:"Seorang sehari"})}<div class="fp-big">${r2(pp)} kg</div></div></div>
        <div class="small"><b>${tx({en:"You (counted items)",bm:"Anda (barang dikira)"})}</b> ${r2(pp)} kg<div class="fp-bar"><i style="width:${pp / max * 100}%;background:var(--teal)"></i></div>
          <b>${tx({en:"Malaysian average",bm:"Purata Malaysia"})}</b> ${MY} kg<div class="fp-bar"><i style="width:${MY / max * 100}%;background:var(--orange)"></i></div></div>
        <p class="small muted">${tx({en:"Your number counts only the items listed, so your real total is higher. The national figure (SWCorp, 2024) covers all solid waste.",bm:"Nombor anda hanya mengira barang yang disenaraikan, jadi jumlah sebenar lebih tinggi. Angka nasional (SWCorp, 2024) merangkumi semua sisa pepejal."})}</p>
        ${donut(c)}
        <div class="small"><b>♻️ ${tx({en:"Recyclable",bm:"Boleh dikitar semula"})}: ${sh("rec")}%</b> · <b>🌱 ${tx({en:"Compostable",bm:"Boleh dikompos"})}: ${sh("comp")}%</b> · <b>🗑️ ${tx({en:"Hard to recycle",bm:"Sukar dikitar semula"})}: ${sh("hard")}%</b></div>
        <div class="note small">${tx({en:`Up to ${sh("rec") + sh("comp")}% of your counted waste could stay out of landfill: paper in the blue bin, plastic bottles and cans in the orange bin, glass in the brown bin, and food in compost.`,bm:`Sehingga ${sh("rec") + sh("comp")}% sisa yang dikira boleh dielakkan dari tapak pelupusan: kertas ke tong biru, botol plastik dan tin ke tong oren, kaca ke tong perang, dan makanan ke kompos.`})}</div>
        ${adv ? advView(c) : ""}`;
    }
    function advView(c) {
      const my = [["food",30.6],["plastic",21.9],["paper",15.3],["diaper",8.2],["glass",2.7],["metal",2.4]];
      return `<details><summary><b>🔍 ${tx({en:"Show the maths & compare with Malaysia",bm:"Tunjuk kiraan & banding dengan Malaysia"})}</b></summary>
        <div class="tablewrap"><table class="tbl small"><tr><th>${tx({en:"Item",bm:"Barang"})}</th><th>${tx({en:"Count",bm:"Bilangan"})}</th><th>g</th><th>kg</th></tr>${items().filter(i => S.cnt[i.id]).map(i => `<tr><td>${i.e} ${tx(i.n)}</td><td>${S.cnt[i.id]}</td><td>${i.g}</td><td>${r2(kg(i))}</td></tr>`).join("")}
        <tr><td colspan="3"><b>${tx({en:"Total ÷ people ÷ 7 days",bm:"Jumlah ÷ orang ÷ 7 hari"})}</b></td><td><b>${r1(c.tot)} ÷ ${S.size} ÷ 7 = ${r2(c.tot / S.size / 7)}</b></td></tr></table></div>
        <p class="small">${tx({en:"Malaysian household waste by weight (SWCorp, 2024) vs your counted items:",bm:"Sisa isi rumah Malaysia mengikut berat (SWCorp, 2024) berbanding barang anda:"})}</p>
        <div class="tablewrap"><table class="tbl small"><tr><th></th><th>Malaysia</th><th>${tx({en:"You",bm:"Anda"})}</th></tr>${my.map(([k, v]) => `<tr><td><i style="display:inline-block;width:10px;height:10px;background:${CAT[k].c};border-radius:2px"></i> ${tx(CAT[k].n)}</td><td>${v}%</td><td>${Math.round((c.byCat[k] || 0) / c.tot * 100)}%</td></tr>`).join("")}</table></div>
        <p class="small muted">${tx({en:"Malaysia's list also includes hazardous waste, garden waste, textiles, cartons, rubber, wood and face masks, which are not counted here. Light items like bags matter more by number and litter than by weight.",bm:"Senarai Malaysia juga termasuk sisa berbahaya, sisa taman, tekstil, karton, getah, kayu dan pelitup muka, yang tidak dikira di sini. Barang ringan seperti beg lebih penting dari segi bilangan dan sampah sarap berbanding berat."})}</p></details>`;
    }
    function pledges() {
      const avail = PLEDGES.filter(p => !p.needs || S.diaper);
      S.pick = S.pick.filter(id => avail.some(p => p.id === id));
      const c = calc(S.pick), full = S.pick.length === 3;
      $("#fpPledge").innerHTML = `<h2>🤝 ${tx({en:"Pick 3 pledges",bm:"Pilih 3 ikrar"})} <span class="pill">${S.pick.length}/3</span></h2>
        <div class="fp-pl">${avail.map(p => { const on = S.pick.includes(p.id), yr = calc([p.id]).saved * 52;
          return `<button class="choice ${on ? "on" : ""}" data-pl="${p.id}" aria-pressed="${on}" ${!on && full ? "disabled" : ""}><span>${p.e}</span><div>${tx(p.n)}<br><small class="muted">≈${r1(yr)} kg/${tx({en:"year",bm:"tahun"})}</small></div></button>`; }).join("")}</div>
        ${S.pick.length ? `<div class="note ok">${tx({en:`Your household could keep about <b>${r1(c.saved * 52)} kg</b> of waste out of landfill each year with these pledges.`,bm:`Isi rumah anda boleh mengelakkan kira-kira <b>${r1(c.saved * 52)} kg</b> sisa dari tapak pelupusan setiap tahun dengan ikrar ini.`})}</div>` : ""}
        ${full ? `<div class="row"><label class="stack" style="gap:4px;flex:1;min-width:200px">${tx({en:"Your name",bm:"Nama anda"})}<input id="fpName" maxlength="40" value="${WQ.esc(S.name)}" style="border:2px solid var(--line);border-radius:12px;padding:10px;font-size:1rem"></label><button class="btn" id="fpMake">🖊️ ${tx({en:"Make my pledge card",bm:"Buat kad ikrar saya"})}</button></div>` : `<p class="small muted">${tx({en:"Choose 3 to unlock your pledge card. Numbers use your inputs above.",bm:"Pilih 3 untuk membuka kad ikrar anda. Nombor menggunakan input anda di atas."})}</p>`}
        ${WQ.aud === "teacher" ? `<div class="note small">🧑‍🏫 ${tx({en:"Teaching note: set this as a one-week home audit. Pupils tally items daily, enter totals in class, then compare class results with the Malaysian average.",bm:"Nota pengajaran: jadikan ini audit rumah selama seminggu. Murid mengira barang setiap hari, masukkan jumlah dalam kelas, kemudian banding keputusan kelas dengan purata Malaysia."})}</div>` : ""}`;
      el.querySelectorAll("[data-pl]").forEach(b => b.onclick = () => { const id = b.dataset.pl, i = S.pick.indexOf(id); if (i >= 0) S.pick.splice(i, 1); else if (S.pick.length < 3) S.pick.push(id); S.card = false; pledges(); card(); });
      if ($("#fpName")) $("#fpName").oninput = e => { S.name = e.target.value; };
      if ($("#fpMake")) $("#fpMake").onclick = () => { S.name = $("#fpName").value.trim(); S.card = true; card(); WQ.award("footprint"); WQ.beep(true); $("#fpCardWrap").scrollIntoView({ behavior: "smooth" }); };
    }
    function card() {
      const w = $("#fpCardWrap"); if (!S.card || S.pick.length !== 3) { w.innerHTML = ""; return; }
      const c = calc(S.pick), d = new Date().toLocaleDateString(WQ.lang === "bm" ? "ms-MY" : "en-MY", { day: "numeric", month: "long", year: "numeric" });
      w.innerHTML = `<div class="card" style="margin-top:16px"><div class="fp-card">${WQ.MASCOT}
        <h2>${tx({en:"My Waste Pledge",bm:"Ikrar Sisa Saya"})}</h2>
        <p>${tx({en:"I,",bm:"Saya,"})} <b style="font-size:1.2rem">${WQ.esc(S.name) || "________________"}</b>, ${tx({en:"promise to:",bm:"berjanji untuk:"})}</p>
        <ul>${S.pick.map(id => { const p = PLEDGES.find(x => x.id === id); return `<li>${p.e} ${tx(p.n)}</li>`; }).join("")}</ul>
        <p>${tx({en:`Together we can keep about <b>${r1(c.saved * 52)} kg</b> of waste out of landfill in one year.`,bm:`Bersama kita boleh mengelakkan kira-kira <b>${r1(c.saved * 52)} kg</b> sisa dari tapak pelupusan dalam setahun.`})}</p>
        <p class="small muted">${d} · WasteQuest · ${tx({en:"Waste to Wealth",bm:"Sisa kepada Kekayaan"})}</p></div>
        <div class="row noprint" style="justify-content:center;margin-top:12px"><button class="btn blue" id="fpPrint">🖨️ ${tx({en:"Print my card",bm:"Cetak kad saya"})}</button><a class="btn alt" href="#/games">${tx({en:"All games",bm:"Semua permainan"})}</a></div></div>`;
      $("#fpPrint").onclick = () => window.print();
    }
    el.onclick = e => { const b = e.target.closest("[data-inc],[data-dec]"); if (!b) return; const id = b.dataset.inc || b.dataset.dec; set(id, (id === "size" ? S.size : S.cnt[id]) + (b.dataset.inc ? 1 : -1)); };
    el.onchange = e => { if (e.target.dataset.in) set(e.target.dataset.in, e.target.value); if (e.target.id === "fpDia") { S.diaper = e.target.checked; if (S.diaper && !S.cnt.diaper) S.cnt.diaper = 35; itemsView(); results(); pledges(); } };
    itemsView(); results(); pledges(); card();
  }});
})();
