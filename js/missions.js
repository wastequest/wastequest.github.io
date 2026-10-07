/* WasteQuest v2 — real-world home missions. Routes: #/missions, #/mission/<id>.
   SOURCES: SPEC.md (SWCorp bin colours: blue = paper, orange = plastic & aluminium/metal, brown = glass);
   research/v2/10_innovation.md §2 (evidence labels: self-report vs adult acknowledgement, no retained photos,
   once-per-mission reward, prevention/reuse first; MBSJ 5R guidance [S20]; UNICEF child guidance [S55]);
   js/labs.js (eco-enzyme + compost safety notes).
   Emits: "mission"(id) once per mission on completion. Calls WQ.data.log("mission", …) if present.
   Store: ms-state = {id:{s:[bool], n:{key:number}, adult:bool, done:iso}}. Photos are never stored. */
(() => {
  const W = WQ, L = (en, bm) => ({ en, bm });
  const T = {
    title: L("Home Missions", "Misi di Rumah"),
    sub: L("Real jobs to do at home, school or work. Tick the steps, then finish the mission to upgrade the town.", "Tugasan sebenar di rumah, sekolah atau tempat kerja. Tandakan langkah, kemudian selesaikan misi untuk menaik taraf bandar."),
    honest: L("Missions are on your honour: we trust you. Your ticks stay on this device; only a coded record (no names, no photos) may be counted.", "Misi ini berdasarkan kejujuran: kami percayakan anda. Tanda anda kekal pada peranti ini; hanya rekod berkod (tanpa nama, tanpa foto) mungkin dikira."),
    done: L("Done ✓", "Selesai ✓"), new: L("New", "Baharu"), prog: L("In progress", "Sedang dibuat"),
    steps: L("Steps", "Langkah"), tally: L("My numbers (optional)", "Nombor saya (pilihan)"),
    photo: L("Proof photo (optional)", "Foto bukti (pilihan)"),
    photoNote: L("The photo stays on this screen only. It is never uploaded or saved, and disappears when you leave this page. Don't photograph people.", "Foto hanya kekal pada skrin ini. Ia tidak dimuat naik atau disimpan, dan hilang apabila anda keluar dari halaman ini. Jangan ambil gambar orang."),
    photoBtn: L("📷 Add a photo", "📷 Tambah foto"), photoDel: L("Remove photo", "Buang foto"),
    adult: L("An adult or teacher checked this mission", "Orang dewasa atau guru telah menyemak misi ini"),
    adultNote: L("Optional. The adult just ticks the box; no names needed.", "Pilihan. Orang dewasa hanya tandakan kotak; tiada nama diperlukan."),
    finish: L("Finish mission", "Selesaikan misi"), needSteps: L("Tick every step first.", "Tandakan semua langkah dahulu."),
    finished: L("Mission complete! Thank you for helping the town.", "Misi selesai! Terima kasih kerana membantu bandar."),
    upgrade: L("Town upgrade:", "Naik taraf bandar:"), print: L("🖨️ Print mission card", "🖨️ Cetak kad misi"),
    all: L("← All missions", "← Semua misi"), safety: L("Safety", "Keselamatan"),
    redo: L("You can do it again any time; the town reward is given once.", "Anda boleh buat lagi bila-bila masa; ganjaran bandar diberi sekali sahaja."),
    pickLab: L("Pick a lab:", "Pilih makmal:"), of: L("of", "daripada"),
    cardDate: L("Date:", "Tarikh:"),
    cardAdult: L("Adult/teacher tick:", "Tanda dewasa/guru:"),
  };
  // town districts, matching js/town/buildings.js names
  const D = { plant: L("Recycling Plant", "Kilang Kitar Semula"), farm: L("Compost Farm", "Ladang Kompos"), maker: L("Maker Lab", "Makmal Pembuat"),
    market: L("Market", "Pasar"), academy: L("Academy", "Akademi") };
  const KIDS_HELP = L("Ask an adult to help you.", "Minta orang dewasa membantu anda.");

  /* steps: {kids:[...], teens:[...]} — adults/teachers fall back to teens via WQ.pick */
  const M = [
    { id: "sortweek", icon: "🗂️", town: "plant", up: L("a new sorting line opens at the Recycling Plant.", "barisan pengasingan baharu dibuka di Kilang Kitar Semula."),
      t: L("Sorting week", "Minggu mengasing"), d: L("Sort your home's waste for 7 days. Missed days are OK.", "Asingkan sisa rumah anda selama 7 hari. Tertinggal sehari pun tidak mengapa."),
      steps: { kids: [L("Find 3 boxes or bags: paper, plastic & cans, glass.", "Cari 3 kotak atau beg: kertas, plastik & tin, kaca."),
          L("Put a label on each one (blue = paper, orange = plastic & cans, brown = glass).", "Labelkan setiap satu (biru = kertas, oren = plastik & tin, perang = kaca)."),
          L("Rinse and dry bottles and cans before they go in.", "Bilas dan keringkan botol dan tin sebelum dimasukkan."),
          L("Each day you sort, tick a day below.", "Setiap hari anda mengasing, tandakan satu hari di bawah."),
          L("At the end, tell someone which box filled up fastest.", "Akhirnya, beritahu seseorang kotak mana yang paling cepat penuh.")],
        teens: [L("Set up 3 labelled containers: paper (blue), plastic & aluminium/metal (orange), glass (brown).", "Sediakan 3 bekas berlabel: kertas (biru), plastik & aluminium/logam (oren), kaca (perang)."),
          L("Rinse and dry items before sorting; greasy or food-soiled items go in general waste.", "Bilas dan keringkan barang sebelum diasingkan; barang berminyak atau kotor dengan makanan masuk sisa am."),
          L("Sort for up to 7 days and record how many days you managed.", "Asingkan sehingga 7 hari dan catat berapa hari anda berjaya."),
          L("Take the sorted items to a recycling point or collection (check your local council's rules).", "Bawa barang yang diasingkan ke pusat kitar semula atau kutipan (semak peraturan majlis tempatan anda)."),
          L("Reflect: what was the hardest item to sort, and why?", "Renung: barang apakah yang paling sukar diasingkan, dan mengapa?")] },
      n: [["days", L("Days I sorted (0–7)", "Hari saya mengasing (0–7)"), 7], ["bags", L("Bags or boxes filled", "Beg atau kotak yang penuh"), 99]] },
    { id: "audit", icon: "🔍", town: "academy", up: L("a waste data board goes up at the Academy.", "papan data sisa dipasang di Akademi."),
      t: L("Bin detective", "Detektif tong sampah"), d: L("Count what goes into your bin in one day.", "Kira apa yang masuk ke dalam tong sampah anda dalam satu hari."),
      steps: { kids: [L("With an adult, choose one day to be a bin detective.", "Bersama orang dewasa, pilih satu hari untuk menjadi detektif tong sampah."),
          L("Each time something is thrown away, count it in the right group below. Don't touch dirty waste: just look.", "Setiap kali sesuatu dibuang, kira dalam kumpulan yang betul di bawah. Jangan sentuh sisa kotor: lihat sahaja."),
          L("At bedtime, see which group is biggest.", "Sebelum tidur, lihat kumpulan mana yang paling banyak.")],
        teens: [L("Pick one ordinary day. Keep a tally sheet next to the bin.", "Pilih satu hari biasa. Letakkan helaian kiraan di sebelah tong sampah."),
          L("Count (or weigh, if you have a kitchen scale) each item by type. Wear gloves; never handle sharp or broken items.", "Kira (atau timbang, jika ada penimbang dapur) setiap barang mengikut jenis. Pakai sarung tangan; jangan pegang barang tajam atau pecah."),
          L("Find the biggest group and write one way to cut it next week.", "Cari kumpulan terbesar dan tulis satu cara untuk mengurangkannya minggu depan.")] },
      n: [["food", L("Food scraps", "Sisa makanan"), 999], ["paper", L("Paper & card", "Kertas & kadbod"), 999], ["plastic", L("Plastic", "Plastik"), 999],
        ["metal", L("Cans & metal", "Tin & logam"), 999], ["glass", L("Glass", "Kaca"), 999], ["other", L("Other", "Lain-lain"), 999]] },
    { id: "refuse", icon: "🙅", town: "market", up: L("the Market gets a refill station.", "Pasar mendapat stesen isi semula."),
      t: L("Say no thanks", "Kata tidak, terima kasih"), d: L("Refuse single-use items for 3 days.", "Tolak barang pakai buang selama 3 hari."),
      steps: { kids: [L("Learn the words: \"No straw, please\" and \"No plastic bag, thank you\".", "Belajar ayat: \"Tak nak straw, terima kasih\" dan \"Tak nak beg plastik, terima kasih\"."),
          L("For 3 days, say no to straws, plastic bags or plastic cutlery you don't need.", "Selama 3 hari, tolak straw, beg plastik atau sudu garpu plastik yang tidak perlu."),
          L("Count each time you said no.", "Kira setiap kali anda menolak.")],
        teens: [L("List the single-use items you usually get (straws, bags, cups, cutlery, sachets).", "Senaraikan barang pakai buang yang biasa anda terima (straw, beg, cawan, sudu garpu, paket)."),
          L("For 3 days, refuse them or bring your own alternative.", "Selama 3 hari, tolak atau bawa alternatif anda sendiri."),
          L("Count every item refused and note which one was hardest to avoid.", "Kira setiap barang yang ditolak dan catat yang paling sukar dielakkan.")] },
      n: [["no", L("Items I refused", "Barang yang saya tolak"), 999]] },
    { id: "kit", icon: "🎒", town: "market", up: L("a reusable-kit stall opens at the Market.", "gerai kit guna semula dibuka di Pasar."),
      t: L("Reusable kit week", "Minggu kit guna semula"), d: L("Carry a bottle, box and bag you already own for a week.", "Bawa botol, bekas dan beg yang sedia ada selama seminggu."),
      steps: { kids: [L("Pack a water bottle, food box and cloth bag you already have. No need to buy new ones.", "Sediakan botol air, bekas makanan dan beg kain yang sedia ada. Tidak perlu beli yang baharu."),
          L("Take your kit to school every day this week.", "Bawa kit anda ke sekolah setiap hari minggu ini."),
          L("Count the days you used it.", "Kira hari anda menggunakannya.")],
        teens: [L("Build a kit from things you already own: bottle, container, bag, cutlery.", "Sediakan kit daripada barang yang sedia ada: botol, bekas, beg, sudu garpu."),
          L("Use it at school, work or the mamak for 5–7 days.", "Gunakannya di sekolah, tempat kerja atau kedai mamak selama 5–7 hari."),
          L("Count the days and the single-use items it replaced.", "Kira hari dan barang pakai buang yang digantikannya.")] },
      n: [["days", L("Days I used my kit (0–7)", "Hari saya guna kit (0–7)"), 7], ["saved", L("Single-use items saved", "Barang pakai buang yang dijimatkan"), 999]] },
    { id: "food", icon: "🍚", town: "farm", up: L("new crops sprout at the Compost Farm.", "tanaman baharu tumbuh di Ladang Kompos."),
      t: L("Clean plate check", "Semak pinggan bersih"), d: L("Notice leftover food for 3 days and choose one fix.", "Perhatikan sisa makanan selama 3 hari dan pilih satu penyelesaian."),
      steps: { kids: [L("For 3 days, after meals, count the plates with food left on them.", "Selama 3 hari, selepas makan, kira pinggan yang ada sisa makanan."),
          L("Take only what you can finish. Ask for a small portion first.", "Ambil hanya apa yang boleh dihabiskan. Minta sedikit dahulu."),
          L("With an adult, choose one fix (smaller portions, keep leftovers in the fridge, compost the peels).", "Bersama orang dewasa, pilih satu penyelesaian (bahagian lebih kecil, simpan lebihan dalam peti sejuk, kompos kulit buah).")],
        teens: [L("For 3 days, count leftover portions after meals at home (no need to handle spoiled food).", "Selama 3 hari, kira bahagian sisa selepas makan di rumah (tidak perlu pegang makanan basi)."),
          L("Spot the cause: too much cooked, too much served, or food went off?", "Kenal pasti punca: masak terlalu banyak, hidang terlalu banyak, atau makanan rosak?"),
          L("Try one fix and say what changed.", "Cuba satu penyelesaian dan nyatakan apa yang berubah.")] },
      n: [["plates", L("Plates with leftovers (3 days)", "Pinggan bersisa (3 hari)"), 999]] },
    { id: "lab", icon: "🧪", town: "maker", up: L("your product goes on show in the Maker Lab.", "produk anda dipamerkan di Makmal Pembuat."), lab: true,
      t: L("Make it real", "Buat betul-betul"), d: L("Make one product from a WasteQuest lab.", "Hasilkan satu produk daripada makmal WasteQuest."),
      steps: { kids: [L("Pick a lab that suits your age (see below) and show it to an adult.", "Pilih makmal yang sesuai dengan umur anda (lihat di bawah) dan tunjukkan kepada orang dewasa."),
          L("Read the safety box together before you start.", "Baca kotak keselamatan bersama-sama sebelum mula."),
          L("Follow the steps with your adult helper.", "Ikut langkah bersama pembantu dewasa anda."),
          L("Show your finished product to your family or teacher.", "Tunjukkan produk siap kepada keluarga atau guru.")],
        teens: [L("Choose a lab and check its age and supervision level.", "Pilih makmal dan semak umur serta tahap penyeliaannya."),
          L("Read the safety notes; labs with heat or sharp tools need an adult present.", "Baca nota keselamatan; makmal yang melibatkan haba atau alat tajam memerlukan orang dewasa."),
          L("Use waste you already have; don't buy or create waste just for the mission.", "Gunakan sisa yang sedia ada; jangan beli atau hasilkan sisa semata-mata untuk misi."),
          L("Make the product and answer one reflection question from the lab.", "Hasilkan produk dan jawab satu soalan refleksi daripada makmal.")] },
      warn: L("Follow the safety notes on the lab page. Heat, sharp tools and chemicals always need an adult.", "Ikut nota keselamatan di halaman makmal. Haba, alat tajam dan bahan kimia sentiasa memerlukan orang dewasa.") },
    { id: "bottle", icon: "🍊", town: "farm", up: L("a compost bay is added to the Compost Farm.", "petak kompos ditambah di Ladang Kompos."),
      t: L("Peel power bottle", "Botol kuasa kulit buah"), d: L("Start a mini compost or eco-enzyme bottle with fruit peels.", "Mulakan botol kompos mini atau eko-enzim dengan kulit buah."),
      steps: { kids: [L("With an adult, choose: eco-enzyme or compost. Open that lab page.", "Bersama orang dewasa, pilih: eko-enzim atau kompos. Buka halaman makmal itu."),
          L("Collect clean fruit and vegetable peels (no meat or oily food).", "Kumpul kulit buah dan sayur yang bersih (tiada daging atau makanan berminyak)."),
          L("An adult does the cutting; you help measure and fill.", "Orang dewasa memotong; anda bantu menimbang dan mengisi."),
          L("Label it with today's date and keep it away from little children.", "Labelkan dengan tarikh hari ini dan jauhkan daripada kanak-kanak kecil.")],
        teens: [L("Choose eco-enzyme or compost and read that lab page fully.", "Pilih eko-enzim atau kompos dan baca halaman makmal itu sepenuhnya."),
          L("Use only clean peels/scraps you already have (no meat, oil or mouldy food).", "Guna hanya kulit buah/sisa bersih yang sedia ada (tiada daging, minyak atau makanan berkulat)."),
          L("Set it up as the lab shows, with a date label.", "Sediakan seperti yang ditunjukkan makmal, dengan label tarikh."),
          L("Put a reminder to check it (eco-enzyme: release gas daily for the first 2 weeks).", "Buat peringatan untuk menyemaknya (eko-enzim: lepaskan gas setiap hari untuk 2 minggu pertama).")] },
      links: [["enzyme", L("Eco-Enzyme lab", "Makmal Eko-Enzim")], ["compost", L("Compost lab", "Makmal Kompos")]],
      warn: L("Eco-enzyme makes gas: use a plastic bottle (never glass) and release the gas daily at first. Not for drinking; it is acidic. A knife is needed: adults cut.", "Eko-enzim menghasilkan gas: guna botol plastik (bukan kaca) dan lepaskan gas setiap hari pada awalnya. Bukan untuk diminum; ia berasid. Pisau diperlukan: orang dewasa yang memotong.") },
    { id: "repair", icon: "🧵", town: "market", up: L("a repair stall opens at the Market.", "gerai baiki dibuka di Pasar."),
      t: L("Fix it, don't toss it", "Baiki, jangan buang"), d: L("Repair or give new life to one item you already own.", "Baiki atau beri nafas baharu kepada satu barang yang sedia ada."),
      steps: { kids: [L("Find something broken or unused: a torn bag, a loose button, an old jar.", "Cari sesuatu yang rosak atau tidak digunakan: beg koyak, butang tertanggal, balang lama."),
          L("With an adult, decide: fix it or give it a new job (a jar becomes a pencil pot).", "Bersama orang dewasa, putuskan: baiki atau beri tugas baharu (balang jadi bekas pensel)."),
          L("Do it together. Needles and scissors: adult helps.", "Buat bersama-sama. Jarum dan gunting: orang dewasa membantu."),
          L("Use it again!", "Gunakannya semula!")],
        teens: [L("Choose one item you already own that is broken, worn or unused. Don't buy something new for this.", "Pilih satu barang sedia ada yang rosak, lusuh atau tidak digunakan. Jangan beli barang baharu untuk ini."),
          L("Find a fix (sew, glue, tighten) or an upcycle idea.", "Cari cara baiki (jahit, gam, ketatkan) atau idea kitar naik."),
          L("Do it safely: never open anything plugged in, battery-powered or with gas; take electrical items to a qualified repairer.", "Buat dengan selamat: jangan buka barang yang bersambung ke elektrik, berbateri atau bergas; bawa barang elektrik kepada tukang baiki bertauliah."),
          L("Use the item for at least a week.", "Gunakan barang itu sekurang-kurangnya seminggu.")] },
      warn: L("No repairs on electrical, battery or gas items at home. Sharp tools: adult supervision.", "Jangan baiki barang elektrik, berbateri atau bergas di rumah. Alat tajam: dengan pengawasan orang dewasa.") },
    { id: "teach", icon: "🗣️", town: "academy", up: L("a new classroom opens at the Academy.", "bilik darjah baharu dibuka di Akademi."),
      t: L("Be the teacher", "Jadi cikgu"), d: L("Teach someone at home the 3 recycling bin colours.", "Ajar seseorang di rumah 3 warna tong kitar semula."),
      steps: { kids: [L("Remember: blue = paper, orange = plastic & cans, brown = glass.", "Ingat: biru = kertas, oren = plastik & tin, perang = kaca."),
          L("Draw the 3 bins or print the mission card.", "Lukis 3 tong atau cetak kad misi."),
          L("Teach a family member, then quiz them with 3 real items.", "Ajar ahli keluarga, kemudian uji mereka dengan 3 barang sebenar.")],
        teens: [L("Recap the SWCorp colours: blue = paper, orange = plastic & aluminium/metal, brown = glass.", "Ulang kaji warna SWCorp: biru = kertas, oren = plastik & aluminium/logam, perang = kaca."),
          L("Teach one person and explain why rinsing matters.", "Ajar seorang dan terangkan mengapa membilas itu penting."),
          L("Quiz them with 3–5 real items; note how many they got right.", "Uji mereka dengan 3–5 barang sebenar; catat berapa yang betul.")] },
      n: [["people", L("People I taught", "Orang yang saya ajar"), 99], ["right", L("Items they sorted right", "Barang yang diasingkan dengan betul"), 99]],
      note: L("Bin rules can differ by council; check your local rules.", "Peraturan tong boleh berbeza mengikut majlis; semak peraturan tempatan anda.") },
  ];
  const byId = id => M.find(m => m.id === id);
  const state = () => W.store.getJSON("ms-state", {});
  const save = s => W.store.setJSON("ms-state", s);
  const ms = id => state()[id] || { s: [], n: {}, adult: false };
  const put = (id, v) => { const s = state(); s[id] = v; save(s); };
  const kidsAud = () => W.aud === "kids";

  W.css("missions", `
.ms-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.ms-tile,.ms-panel{background:#f9e6cf;border:3px solid #1a1932;border-radius:0;box-shadow:4px 4px 0 rgba(26,25,50,.35);padding:14px;color:#1a1932}
.ms-tile{display:flex;flex-direction:column;gap:6px;text-decoration:none}
.ms-tile:hover,.ms-tile:focus-visible{transform:translate(-2px,-2px);box-shadow:6px 6px 0 rgba(26,25,50,.35)}
.ms-tile .ic{font-size:2rem;line-height:1}
.ms-tile h2,.ms-panel h2,.ms-px{font-family:"Pixelify Sans",system-ui,sans-serif;margin:0}
.ms-tile h2{font-size:1.25rem}.ms-panel h2{font-size:1.2rem;margin-bottom:8px}
.ms-st{font-family:"Pixelify Sans",system-ui,sans-serif;font-size:.95rem;align-self:flex-start;border:2px solid #1a1932;padding:1px 8px;background:#fff}
.ms-st.done{background:#5ac54f}.ms-st.go{background:#ffeb57}
.ms-panel{margin:14px 0;font-size:17px}
.ms-steps{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.ms-steps label,.ms-chk{display:flex;gap:10px;align-items:flex-start;cursor:pointer}
.ms-steps input,.ms-chk input{width:24px;height:24px;flex:none;margin-top:1px;accent-color:#1e6f50}
.ms-n{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.ms-n label{display:flex;flex-direction:column;gap:4px;font-weight:700}
.ms-n input{font:inherit;padding:6px 8px;border:3px solid #1a1932;border-radius:0;width:100%;max-width:160px;box-sizing:border-box}
.ms-btn{font-family:"Pixelify Sans",system-ui,sans-serif;font-size:1.1rem;background:#1a1932;color:#fff;border:3px solid #1a1932;border-radius:0;padding:10px 16px;cursor:pointer;box-shadow:4px 4px 0 rgba(26,25,50,.35);text-decoration:none;display:inline-block}
.ms-btn.lt{background:#f9e6cf;color:#1a1932}
.ms-btn:focus-visible,.ms-tile:focus-visible{outline:3px solid #0098dc;outline-offset:2px}
.ms-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.ms-ph img{max-width:100%;max-height:260px;border:3px solid #1a1932;display:block;margin-top:8px}
.ms-warn{border-left:8px solid #f68187}
.ms-win{background:#5ac54f}
.ms-labs{display:flex;flex-wrap:wrap;gap:8px}
.ms-labs a{border:2px solid #1a1932;background:#fff;padding:4px 10px;color:#1a1932;text-decoration:none}
.ms-print{display:none}
@media (prefers-reduced-motion:reduce){.ms-tile:hover{transform:none}}
@media print{
 body:has(.ms-print) *{visibility:hidden!important}
 .ms-print,.ms-print *{visibility:visible!important}
 .ms-print{display:block!important;position:fixed;left:0;top:0;width:100%;color:#000;font:12pt/1.4 Nunito,Arial,sans-serif}
 .ms-print h1{font:700 20pt "Pixelify Sans",Arial,sans-serif;margin:0 0 6pt}
 .ms-print .bx{border:2pt solid #000;padding:10pt;margin-bottom:8pt}
 .ms-print li{margin:4pt 0}.ms-print .sq{display:inline-block;width:12pt;height:12pt;border:1.5pt solid #000;margin-right:6pt;vertical-align:-2pt}
 .ms-print .ln{border-bottom:1pt solid #000;display:inline-block;min-width:160pt;height:14pt}
}`);

  const status = m => { const s = ms(m.id); if (s.done) return ["done", W.t(T.done)];
    const n = (s.s || []).filter(Boolean).length; return n ? ["go", `${W.t(T.prog)} ${n}/${W.pick(m.steps).length}`] : ["", W.t(T.new)]; };

  W.registerPage("missions", { mount(el) {
    el.innerHTML = W.head("🏡", T.title, T.sub) + `<p class="ms-panel">${W.esc(W.t(T.honest))}</p><div class="ms-grid">` +
      M.map(m => { const [c, txt] = status(m); return `<a class="ms-tile" href="#/mission/${m.id}"><span class="ic" aria-hidden="true">${m.icon}</span>
        <h2>${W.esc(W.t(m.t))}</h2><span>${W.esc(W.t(m.d))}</span><span class="ms-st ${c}">${W.esc(txt)}</span></a>`; }).join("") + `</div>`;
  } });

  W.registerPage("mission", { mount(el, { args }) {
    const m = byId(args[0]);
    if (!m) { W.go("missions"); return; }
    const steps = W.pick(m.steps), s = ms(m.id); s.s = s.s || []; s.n = s.n || {};
    let url = null;
    const labs = m.lab ? (W.labs || []) : [];
    const kids = kidsAud();
    el.innerHTML = W.head(m.icon, m.t, m.d) +
      `<p><a href="#/missions">${W.esc(W.t(T.all))}</a></p>` +
      (kids ? `<p class="ms-panel ms-warn">👪 ${W.esc(W.t(KIDS_HELP))}</p>` : "") +
      (m.warn ? `<div class="ms-panel ms-warn" role="note"><h2>⚠️ ${W.esc(W.t(T.safety))}</h2><p>${W.esc(W.t(m.warn))}</p></div>` : "") +
      `<section class="ms-panel"><h2>${W.esc(W.t(T.steps))}</h2><ol class="ms-steps">` +
        steps.map((st, i) => `<li><label><input type="checkbox" data-i="${i}" ${s.s[i] ? "checked" : ""}><span><b class="ms-px">${i + 1}.</b> ${W.esc(W.t(st))}</span></label></li>`).join("") +
      `</ol><p class="ms-px" aria-live="polite" id="msCount"></p></section>` +
      (m.links ? `<div class="ms-panel ms-labs">${m.links.map(([id, n]) => `<a href="#/lab/${id}">${W.esc(W.t(n))} →</a>`).join("")}</div>` : "") +
      (labs.length ? `<div class="ms-panel"><h2>${W.esc(W.t(T.pickLab))}</h2><div class="ms-labs">${labs.map(l => `<a href="#/lab/${l.id}">${l.icon} ${W.esc(W.t(l.title))} (${W.esc(W.t(W.S.ages))} ${l.min}+)</a>`).join("")}</div></div>` : "") +
      (m.note ? `<p class="ms-panel">ℹ️ ${W.esc(W.t(m.note))}</p>` : "") +
      (m.n ? `<section class="ms-panel"><h2>${W.esc(W.t(T.tally))}</h2><div class="ms-n">` +
        m.n.map(([k, lab, max]) => `<label>${W.esc(W.t(lab))}<input type="number" inputmode="numeric" min="0" max="${max}" step="1" data-k="${k}" value="${s.n[k] ?? ""}"></label>`).join("") + `</div></section>` : "") +
      `<section class="ms-panel ms-ph"><h2>${W.esc(W.t(T.photo))}</h2><p>${W.esc(W.t(T.photoNote))}</p>
        <div class="ms-row"><label class="ms-btn lt" tabindex="0" role="button" id="msPhL">${W.esc(W.t(T.photoBtn))}<input type="file" accept="image/*" capture="environment" id="msPh" hidden></label>
        <button type="button" class="ms-btn lt" id="msPhX" hidden>${W.esc(W.t(T.photoDel))}</button></div><div id="msPhV"></div></section>` +
      `<section class="ms-panel"><label class="ms-chk"><input type="checkbox" id="msAdult" ${s.adult ? "checked" : ""}><span><b>${W.esc(W.t(T.adult))}</b><br><small>${W.esc(W.t(T.adultNote))}</small></span></label></section>` +
      `<div class="ms-row"><button type="button" class="ms-btn" id="msGo">${W.esc(W.t(T.finish))}</button>
        <button type="button" class="ms-btn lt" id="msPrint">${W.esc(W.t(T.print))}</button></div>
       <div id="msMsg" aria-live="polite"></div>` +
      `<div class="ms-print" aria-hidden="true"><h1>WasteQuest · ${m.icon} ${W.esc(W.t(m.t))}</h1><p>${W.esc(W.t(m.d))}</p>
        <div class="bx"><ol>${steps.map(st => `<li><span class="sq"></span>${W.esc(W.t(st))}</li>`).join("")}</ol></div>
        ${m.warn ? `<div class="bx"><b>⚠️ ${W.esc(W.t(T.safety))}:</b> ${W.esc(W.t(m.warn))}</div>` : ""}
        ${m.n ? `<div class="bx">${m.n.map(([, lab]) => `<p>${W.esc(W.t(lab))}: <span class="ln"></span></p>`).join("")}</div>` : ""}
        ${m.note ? `<p>${W.esc(W.t(m.note))}</p>` : ""}
        <p>${W.esc(W.t(T.cardDate))} <span class="ln" style="min-width:80pt"></span></p>
        <p>${W.esc(W.t(T.cardAdult))} <span class="sq"></span></p></div>`;

    const $ = q => el.querySelector(q), cnt = $("#msCount"), msg = $("#msMsg");
    const paint = () => { cnt.textContent = `${steps.filter((_, i) => s.s[i]).length} ${W.t(T.of)} ${steps.length} ✓`; };
    const showDone = () => { msg.innerHTML = `<div class="ms-panel ms-win" role="status"><h2>🏆 ${W.esc(W.t(T.finished))}</h2>
      <p><b>${W.esc(W.t(T.upgrade))}</b> ${W.esc(W.t(D[m.town]))}: ${W.esc(W.t(m.up))}</p><p><small>${W.esc(W.t(T.redo))}</small></p></div>`; };
    paint(); if (s.done) showDone();
    el.querySelectorAll(".ms-steps input").forEach(c => c.onchange = () => { s.s[+c.dataset.i] = c.checked; put(m.id, s); paint(); });
    el.querySelectorAll(".ms-n input").forEach(i => i.onchange = () => {
      const v = Math.floor(+i.value); if (i.value === "" || !isFinite(v) || v < 0) { delete s.n[i.dataset.k]; i.value = ""; }
      else { s.n[i.dataset.k] = Math.min(v, +i.max); i.value = s.n[i.dataset.k]; } put(m.id, s); });
    $("#msAdult").onchange = e => { s.adult = e.target.checked; put(m.id, s); };
    const ph = $("#msPh"), phx = $("#msPhX"), phv = $("#msPhV");
    const clearPh = () => { if (url) URL.revokeObjectURL(url); url = null; phv.innerHTML = ""; phx.hidden = true; ph.value = ""; };
    $("#msPhL").onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ph.click(); } };
    ph.onchange = () => { const f = ph.files && ph.files[0]; if (!f) return; if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(f); phv.innerHTML = `<img alt="${W.esc(W.t(T.photo))}" src="${url}">`; phx.hidden = false; };
    phx.onclick = clearPh;
    $("#msPrint").onclick = () => window.print();
    $("#msGo").onclick = () => {
      if (steps.some((_, i) => !s.s[i])) { msg.innerHTML = `<p class="ms-panel ms-warn" role="alert">${W.esc(W.t(T.needSteps))}</p>`; W.beep && W.beep(false); return; }
      const first = !s.done;
      if (first) { s.done = new Date().toISOString(); put(m.id, s); W.emit("mission", m.id); W.confetti(); }
      try { W.data && W.data.log && W.data.log("mission", { id: m.id, v: 1, first, evidence: s.adult ? "adult_acknowledgement" : "self_report", n: s.n }); } catch (e) {}
      showDone(); msg.focus && msg.scrollIntoView({ block: "nearest" });
    };
    return clearPh;
  } });

  W.missions = { list: M.map(m => m.id), done: () => Object.keys(state()).filter(k => state()[k].done) };
})();
