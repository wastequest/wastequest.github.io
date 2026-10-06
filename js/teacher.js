/* Teacher Hub (route #/teacher/<section>, #/teacher/all = every section for printing). Also exposes WQ.renderTeacherPrint(el) for the PDF booklet.
// SOURCES:
//  - MQA, Guidelines to Good Practices: Micro-credentials (1st ed., 2020), issued with MQA Circular Letter No. 8/2020. Definition of micro-credentials as quoted in UPSI's guideline (s.1.1).
//  - MQA, GGP: Quality Verification of Stand-Alone Micro-credentials (2023), as summarised in Universiti Malaysia Sabah, "Garis Panduan Micro-Credential" (PPKA, n.d.):
//      application through an MQA-appointed Quality Verification Centre (QVC) using form SAMC-01; minimum 40 notional learning hours (1 credit), increments of 20 h (0.5 credit);
//      no more than 2 ILOs per credit; apply within 3 months before the course/cohort ends; verification valid 3 years. Same document lists QA aspects and certificate contents.
//  - UPSI, "Garis Panduan Micro-Credentials UPSI" (n.d.), s.6.1: minimum 40 h student learning time except stand-alone MCs not used for credit transfer.
//  - 1 credit = 40 notional learning hours: MQA, Malaysian Qualifications Framework, 2nd ed. (2017).
//  - Kolb, D. A. (1984). Experiential Learning. Prentice Hall. Anderson & Krathwohl (2001), revised Bloom's taxonomy.
//  - KSSM Sains Tingkatan 2 (Bab 2 Ekosistem, Bab 6 Asid dan Alkali); KSSM Reka Bentuk dan Teknologi Tingkatan 1 (Bab 3 Proses Reka Bentuk, Bab 4 Lakaran, Bab 5 Aplikasi Teknologi);
//    KSSM Elemen Merentas Kurikulum (incl. Kelestarian Alam Sekitar, Keusahawanan, Kreativiti dan Inovasi): KPM DSKP documents.
//  - EPR for packaging (KPKT): voluntary from 2026, mandatory by 2030: Bernama, 9 Sep 2025. Act 672 (Solid Waste and Public Cleansing Management Act 2007).
//  - Aedes mosquitoes breed in standing water: Ministry of Health Malaysia dengue guidance. Malaysia emergency number 999.
//  - Old module content: "WasteQuest: Waste-to-Wealth (W2W) Educational Module" (2025 PDF); student projects: UPM ENG3104 (research/eng3104_and_videos.md).
*/
(() => {
const t = o => WQ.t(o), E = s => WQ.esc(s), B = (en, bm) => WQ.lang === "bm" ? bm : en, b2 = p => B(p[0], p[1]);

/* ---------- links to the rest of WasteQuest ---------- */
const LABS = { candle: ["🕯️", "Scented candle", "Lilin wangi"], petfood: ["🐟", "Pet food", "Makanan haiwan"], treasure: ["👜", "Tote bag", "Beg tote"],
  litmus: ["🧪", "Natural pH indicator paper", "Kertas penunjuk pH semula jadi"], odour: ["☕", "Odour absorber", "Penyerap bau"], watering: ["🪴", "Self-watering planter", "Pasu siram sendiri"],
  enzyme: ["🍊", "Eco-enzyme cleaner", "Pembersih eko-enzim"], ecobrick: ["🧱", "Ecobricks", "Bata eko"], compost: ["🌱", "Compost", "Kompos"], bioplastic: ["🌽", "Bioplastic pot", "Pasu bioplastik"] };
const labName = id => { const L = (WQ.labs || []).find(l => l.id === id); return L && (L.title || L.name) ? t(L.title || L.name) : B(LABS[id][1], LABS[id][2]); };
const lab = id => `<a class="th-chip" href="#/lab/${id}">${LABS[id][0]} ${E(labName(id))}</a>`;
const GAMES = { sort: ["🗑️", "Sort It Out!", "Asingkan Sampah!"], match: ["🃏", "Memory Match", "Padanan Memori"], crossword: ["✏️", "Crossword", "Silang Kata"], wordsearch: ["🔎", "Word Search", "Cari Kata"],
  myth: ["🕵️", "Myth or Fact", "Mitos atau Fakta"], quiz: ["⚡", "Quiz", "Kuiz"], ph: ["🧪", "pH lab", "Makmal pH"], compost: ["🌱", "Compost sim", "Simulasi kompos"],
  enzyme: ["🍊", "Eco-enzyme sim", "Simulasi eko-enzim"], cash: ["💰", "Waste to Cash", "Sisa jadi Wang"], footprint: ["👣", "Footprint", "Jejak Karbon"] };
const game = id => { const g = WQ.games[id], d = GAMES[id]; return `<a class="th-chip g" href="#/game/${id}">${g ? g.icon : d[0]} ${E(g ? t(g.title) : B(d[1], d[2]))}</a>`; };
const pg = (h, i, en, bm) => `<a class="th-chip p" href="#/${h}">${i} ${B(en, bm)}</a>`;
const learn = (...n) => n.map(k => pg(`learn/${k}`, "📘", `Learn ${k}`, `Belajar ${k}`)).join(" ");
const CLASS = () => pg("class", "🏟️", "Class Battle", "Pertandingan Kelas"), CERT = () => pg("cert", "🏅", "Certificates", "Sijil"), PITCH = () => pg("cert/pitch", "🎤", "W2W pitch form", "Borang pembentangan W2W");
const sec = id => pg(`teacher/${id}`, "📎", SEC.find(s => s.id === id).en, SEC.find(s => s.id === id).bm);

/* ---------- building blocks ---------- */
const tbl = (head, rows, cls = "") => `<div class="tablewrap"><table class="tbl th-tbl ${cls}"><thead><tr>${head.map(h => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const todo = s => `<span class="todo">TODO: ${s}</span>`;
const note = (cls, html) => `<div class="note ${cls} th-note">${html}</div>`;
const danger = html => note("danger", `⚠️ ${html}`);
const ul = items => `<ul class="th-ul">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
const h3 = s => `<h3 class="th-h3">${s}</h3>`;
const lines = n => `<span class="th-line"></span>`.repeat(n);
const SUP = () => B("Adult supervision required", "Perlu pengawasan orang dewasa");

/* ---------- (a) overview ---------- */
const LOS = () => [
  ["LO1", ["Explain sustainability, the waste hierarchy, Waste-to-Wealth (W2W) and the circular economy, using Malaysian waste data.", "Menerangkan kelestarian, hierarki sisa, Sisa kepada Kekayaan (W2W) dan ekonomi kitaran menggunakan data sisa Malaysia."],
    ["Understand", "Memahami"], `${learn(1, 2, 3, 4)} ${game("myth")} ${game("crossword")}`, ["Learn quick checks; quiz", "Semakan pantas Belajar; kuiz"], "LO1"],
  ["LO2", ["Separate household waste correctly into the SWCorp blue, orange and brown bins and explain why separation at source matters.", "Mengasingkan sisa isi rumah dengan betul ke dalam tong biru, oren dan coklat SWCorp serta menerangkan kepentingan pengasingan di punca."],
    ["Apply", "Mengaplikasi"], `${learn(5)} ${game("sort")} ${game("match")} ${game("wordsearch")}`, ["Sort It Out score; quiz", "Skor Asingkan Sampah; kuiz"], "LO4"],
  ["LO3", ["Explain the science behind a waste conversion: composting, fermentation, natural pH indicators or bioplastics.", "Menerangkan sains di sebalik penukaran sisa: pengomposan, penapaian, penunjuk pH semula jadi atau bioplastik."],
    ["Understand, analyse", "Memahami, menganalisis"], `${game("compost")} ${game("enzyme")} ${game("ph")} ${lab("litmus")}`, ["Reflection worksheet; quiz", "Lembaran refleksi; kuiz"], "LO1"],
  ["LO4", ["Make a W2W product safely by following a method and its safety controls.", "Menghasilkan produk W2W dengan selamat dengan mengikut kaedah dan kawalan keselamatannya."],
    ["Apply (hands-on)", "Mengaplikasi (amali)"], `${pg("labs", "🔬", "All 10 labs", "Kesemua 10 makmal")}`, ["Product rubric; lab badge", "Rubrik produk; lencana makmal"], "LO2"],
  ["LO5", ["Evaluate the environmental, economic and social value of a W2W product, including its cost and price.", "Menilai nilai alam sekitar, ekonomi dan sosial sesuatu produk W2W, termasuk kos dan harganya."],
    ["Evaluate, create", "Menilai, mencipta"], `${game("cash")} ${game("footprint")} ${learn(4, 6)} ${PITCH()}`, ["W2W pitch rubric", "Rubrik pembentangan W2W"], "LO2"],
  ["LO6", ["Reflect on personal habits and promote zero-waste practices at home, in school and in the community.", "Membuat refleksi tentang tabiat sendiri dan mempromosikan amalan sifar sisa di rumah, sekolah dan komuniti."],
    ["Value (affective)", "Menghayati (afektif)"], `${learn(7)} ${CLASS()}`, ["Action plan; reflection rubric", "Pelan tindakan; rubrik refleksi"], "LO3, LO4"]
];
function overview() {
  return `<p class="th-lead">${B("WasteQuest turns waste education into a quest. Learners find out where Malaysia's waste goes, play games that build sorting and science skills, then make real products from waste in hands-on labs. The module combines gamification (points, badges and certificates), experiential learning, STEM and sustainability education. Its aim is to grow <b>Zero-Waste Champions</b>: people who reduce, sort and transform waste at home, at school and at work.",
    "WasteQuest menjadikan pendidikan sisa satu pengembaraan. Peserta meneroka ke mana perginya sisa di Malaysia, bermain permainan yang membina kemahiran mengasingkan sisa dan sains, kemudian menghasilkan produk sebenar daripada sisa dalam makmal amali. Modul ini menggabungkan gamifikasi (mata, lencana dan sijil), pembelajaran berasaskan pengalaman, STEM dan pendidikan kelestarian. Matlamatnya ialah melahirkan <b>Juara Sifar Sisa</b>: individu yang mengurangkan, mengasingkan dan mengubah sisa di rumah, di sekolah dan di tempat kerja.")}</p>
  ${note("ok", `<b>📥 ${B("Downloads", "Muat turun")}:</b> <a href="https://wastequest.github.io/downloads/WasteQuest_Booklet_EN.pdf" target="_blank" rel="noopener">${B("Booklet (English, PDF)", "Buku panduan (Inggeris, PDF)")}</a> · <a href="https://wastequest.github.io/downloads/WasteQuest_Booklet_BM.pdf" target="_blank" rel="noopener">${B("Booklet (BM, PDF)", "Buku panduan (BM, PDF)")}</a> · <a href="https://github.com/wastequest/wastequest.github.io/releases/latest/download/WasteQuest_offline_pack.zip">${B("Offline pack with videos (ZIP, 155 MB): unzip to a laptop or USB and open WasteQuest.html, no internet needed", "Pek luar talian dengan video (ZIP, 155 MB): nyahzip ke komputer riba atau USB dan buka WasteQuest.html, tanpa internet")}</a>`)}
  ${h3(B("What is new in the 2026 edition", "Apa yang baharu dalam edisi 2026"))}
  ${ul([B("A website that runs on phones, tablets and classroom projectors, in English and Bahasa Melayu.", "Laman web yang berfungsi pada telefon, tablet dan projektor kelas, dalam bahasa Inggeris dan Bahasa Melayu."),
    B("Four levels: kids (7–12), teens (13–17), adults, and a teacher view with teaching notes.", "Empat tahap: kanak-kanak (7–12), remaja (13–17), dewasa, dan paparan guru dengan nota pengajaran."),
    B("Games, science simulations, 10 hands-on labs with safety controls, a live Class Battle and three certificate tracks.", "Permainan, simulasi sains, 10 makmal amali dengan kawalan keselamatan, Pertandingan Kelas secara langsung dan tiga laluan sijil."),
    B("Science checked and corrected: unsafe or inaccurate methods from earlier student proposals are not used.", "Sains disemak dan diperbetulkan: kaedah yang tidak selamat atau tidak tepat daripada cadangan pelajar terdahulu tidak digunakan.")])}
  ${h3(B("Teaching approach", "Pendekatan pengajaran"))}
  <div class="th-grid4">${[["🎮", "Gamification", "Gamifikasi", "Points, badges, levels and certificates keep learners motivated and give instant feedback.", "Mata, lencana, tahap dan sijil mengekalkan motivasi serta memberi maklum balas segera."],
    ["🔁", "Experiential learning", "Pembelajaran berasaskan pengalaman", "Learners do, reflect, understand and try again (Kolb's cycle, below).", "Peserta melakukan, membuat refleksi, memahami dan mencuba semula (kitaran Kolb, di bawah)."],
    ["🔬", "STEM", "STEM", "Chemistry (pH, fermentation), biology (microbes, compost), maths (data, costing) and engineering design.", "Kimia (pH, penapaian), biologi (mikrob, kompos), matematik (data, kos) dan reka bentuk kejuruteraan."],
    ["🌏", "Sustainability and ESG", "Kelestarian dan ESG", "Malaysian waste data, the SDGs, Act 672 and Extended Producer Responsibility (EPR).", "Data sisa Malaysia, SDG, Akta 672 dan Tanggungjawab Pengeluar Lanjutan (EPR)."]]
    .map(p => `<div class="th-pillar"><span aria-hidden="true">${p[0]}</span><b>${B(p[1], p[2])}</b><span class="small">${B(p[3], p[4])}</span></div>`).join("")}</div>
  ${tbl([B("Kolb stage", "Peringkat Kolb"), B("What learners do in WasteQuest", "Apa yang peserta lakukan dalam WasteQuest")], [
    [B("1. Concrete experience", "1. Pengalaman konkrit"), B("Play a game; make a product in a lab.", "Bermain permainan; menghasilkan produk dalam makmal.")],
    [B("2. Reflective observation", "2. Pemerhatian reflektif"), B("Quick checks, class discussion, reflection worksheet.", "Semakan pantas, perbincangan kelas, lembaran refleksi.")],
    [B("3. Abstract conceptualisation", "3. Pengkonsepsian abstrak"), B("Learn chapters and science simulations explain why it works.", "Bab Belajar dan simulasi sains menerangkan mengapa ia berfungsi.")],
    [B("4. Active experimentation", "4. Eksperimen aktif"), B("Improve the product, write an action plan, pitch a W2W idea.", "Menambah baik produk, menulis pelan tindakan, membentangkan idea W2W.")]])}
  ${h3(B("Objectives", "Objektif"))}
  <ol class="th-ol">${[B("Raise awareness of Malaysia's waste challenge and the waste hierarchy through interactive activities.", "Meningkatkan kesedaran tentang cabaran sisa di Malaysia dan hierarki sisa melalui aktiviti interaktif."),
    B("Introduce Waste-to-Wealth and the circular economy through experiential, hands-on learning.", "Memperkenalkan konsep Sisa kepada Kekayaan dan ekonomi kitaran melalui pembelajaran amali berasaskan pengalaman."),
    B("Strengthen STEM learning through safe, science-based waste conversion projects.", "Mengukuhkan pembelajaran STEM melalui projek penukaran sisa yang selamat dan berasaskan sains."),
    B("Encourage sustainable lifestyles, environmental stewardship and green entrepreneurship in daily life.", "Menggalakkan gaya hidup lestari, penjagaan alam sekitar dan keusahawanan hijau dalam kehidupan seharian.")].map(x => `<li>${x}</li>`).join("")}</ol>
  ${h3(B("Learning outcomes, mapped to activities and assessment", "Hasil pembelajaran, dipetakan kepada aktiviti dan pentaksiran"))}
  <p class="small muted">${B("By the end of the module, learners will be able to… The last column shows which of the four 2025 learning outcomes each one extends.", "Pada akhir modul, peserta dapat… Lajur terakhir menunjukkan hasil pembelajaran 2025 yang diperluas.")}</p>
  ${tbl(["LO", B("Outcome", "Hasil"), B("Level", "Tahap"), B("Activities", "Aktiviti"), B("Assessment", "Pentaksiran"), B("2025 LO", "HP 2025")],
    LOS().map(l => [`<b>${l[0]}</b>`, b2(l[1]), b2(l[2]), l[3], b2(l[4]), l[5]]), "th-lo")}
  ${h3(B("Benefits of Waste-to-Wealth", "Manfaat Sisa kepada Kekayaan"))}
  ${tbl([B("🌿 Environmental", "🌿 Alam sekitar"), B("💰 Economic", "💰 Ekonomi"), B("🤝 Social", "🤝 Sosial")], [
    [B("Less pollution of air, rivers and sea", "Kurang pencemaran udara, sungai dan laut"), B("Value-added products from low-cost waste", "Produk nilai tambah daripada sisa berkos rendah"), B("Greater environmental awareness", "Kesedaran alam sekitar yang lebih tinggi")],
    [B("Lower greenhouse gas emissions, especially methane from landfills", "Pelepasan gas rumah hijau yang lebih rendah, terutamanya metana dari tapak pelupusan"), B("Green entrepreneurship and small businesses", "Keusahawanan hijau dan perniagaan kecil"), B("Sustainable lifestyles and habits", "Gaya hidup dan tabiat lestari")],
    [B("Conserves raw materials, water and energy", "Menjimatkan bahan mentah, air dan tenaga"), B("Lower disposal costs; new jobs", "Kos pelupusan lebih rendah; peluang pekerjaan baharu"), B("Creativity, innovation and teamwork", "Kreativiti, inovasi dan kerja berpasukan")]])}`;
}

/* ---------- (b) session plans ---------- */
const PLANS = () => [
  { icon: "⏱️", t: ["60-minute lesson", "Pelajaran 60 minit"], who: ["Kids 9–12 or teens · one class period (split into two if periods are 30–40 min)", "Kanak-kanak 9–12 atau remaja · satu waktu kelas (bahagikan kepada dua jika waktu 30–40 minit)"],
    mats: ["Projector; three boxes coloured blue, orange and brown; 10 clean waste items; natural pH indicator prepared by the teacher; small cups of safe test liquids (vinegar, lime juice, baking-soda water, soapy water); exit tickets.", "Projektor; tiga kotak berwarna biru, oren dan coklat; 10 bahan sisa yang bersih; penunjuk pH semula jadi yang disediakan oleh guru; cawan kecil cecair ujian yang selamat (cuka, jus limau, air soda penaik, air sabun); tiket keluar."],
    rows: [["0:00–0:05", ["Hook: “What did you throw away today?” Show the 1.17 kg stack.", "Cetusan minat: “Apa yang anda buang hari ini?” Tunjukkan timbunan 1.17 kg."], learn(1), ["“If each of us throws away about 1.17 kg a day, how much does our class throw away in a year?”", "“Jika setiap orang membuang kira-kira 1.17 kg sehari, berapa banyakkah sisa kelas kita dalam setahun?”"]],
      ["0:05–0:20", ["Learn chapters 1 and 5 on the projector; answer the quick checks by show of hands.", "Bab Belajar 1 dan 5 pada projektor; jawab semakan pantas dengan mengangkat tangan."], learn(1, 5), ["“Which bin is for paper? Why must food waste stay out of the recycling bins?”", "“Tong manakah untuk kertas? Mengapakah sisa makanan tidak boleh dimasukkan ke dalam tong kitar semula?”"]],
      ["0:20–0:35", ["Play Sort It Out in pairs, or a 10-question Class Battle.", "Main Asingkan Sampah secara berpasangan, atau Pertandingan Kelas 10 soalan."], `${game("sort")} ${CLASS()}`, ["“Before you drop it, say the bin and the reason.”", "“Sebelum lepaskan, sebut tong dan sebabnya.”"]],
      ["0:35–0:52", ["Hands-on demo: groups test safe liquids with the natural pH indicator and record the colours, then try the pH lab.", "Demo amali: kumpulan menguji cecair selamat dengan penunjuk pH semula jadi dan merekod warna, kemudian cuba makmal pH."], `${lab("litmus")} ${game("ph")}`, ["“Which liquids are acids? How can a plant scrap tell us?”", "“Cecair manakah asid? Bagaimanakah sisa tumbuhan boleh memberitahu kita?”"]],
      ["0:52–1:00", ["Exit ticket: one thing I learned and one action I will take.", "Tiket keluar: satu perkara yang saya pelajari dan satu tindakan yang akan saya ambil."], learn(7), ["“What will you refuse or reduce this week?”", "“Apakah yang akan anda tolak atau kurangkan minggu ini?”"]]],
    warn: ["The teacher prepares the indicator with hot water before class. Learners use only the safe liquids listed: never bleach, drain cleaner or oven cleaner. Do not taste anything.", "Guru menyediakan penunjuk dengan air panas sebelum kelas. Peserta hanya menggunakan cecair selamat yang disenaraikan: jangan sekali-kali guna peluntur, pembersih longkang atau pembersih ketuhar. Jangan rasa apa-apa."] },
  { icon: "🛠️", t: ["Workshop: 2 hours 20 minutes", "Bengkel: 2 jam 20 minit"], who: ["Teens, university students or community groups · the original 2025 module flow, improved", "Remaja, pelajar universiti atau kumpulan komuniti · aliran asal modul 2025, ditambah baik"],
    mats: ["Projector and internet (for Class Battle); devices for games (one per pair); lab materials from each lab page; printed product rubrics and reflection worksheets; first-aid kit; gloves, aprons, paper towels.", "Projektor dan internet (untuk Pertandingan Kelas); peranti untuk permainan (satu bagi setiap pasangan); bahan makmal daripada setiap halaman makmal; rubrik produk dan lembaran refleksi bercetak; peti pertolongan cemas; sarung tangan, apron, tuala kertas."],
    rows: [["0:00–0:15", ["Briefing: welcome and objectives; groups of 4–5 with roles (leader, materials, safety officer, recorder, presenter); safety briefing with the lab rules checklist.", "Taklimat: alu-aluan dan objektif; kumpulan 4–5 orang dengan peranan (ketua, bahan, pegawai keselamatan, pencatat, pembentang); taklimat keselamatan dengan senarai semak peraturan makmal."], sec("safety"), ["“Our safety officer can stop the group at any time if something looks unsafe.”", "“Pegawai keselamatan boleh menghentikan kumpulan pada bila-bila masa jika ada yang kelihatan tidak selamat.”"]],
      ["0:15–0:35", ["Presentation: waste in Malaysia, the waste hierarchy, circular economy and W2W.", "Pembentangan: sisa di Malaysia, hierarki sisa, ekonomi kitaran dan W2W."], learn(1, 2, 3, 4), ["“Where does most household waste in Malaysia end up? How could it become a resource?”", "“Ke manakah kebanyakan sisa isi rumah di Malaysia berakhir? Bagaimanakah ia boleh menjadi sumber?”"]],
      ["0:35–1:05", ["Quiz and games: station rotation (8 min each) of Sort It Out, Memory Match and Myth or Fact, then a 6-minute Class Battle.", "Kuiz dan permainan: putaran stesen (8 minit setiap satu) Asingkan Sampah, Padanan Memori dan Mitos atau Fakta, kemudian Pertandingan Kelas 6 minit."], `${game("sort")} ${game("match")} ${game("myth")} ${CLASS()}`, ["“Which myth surprised you the most?”", "“Mitos manakah yang paling mengejutkan anda?”"]],
      ["1:05–2:05", ["Hands-on: each group completes one lab and scores it with the product rubric. Low-heat choices: ecobricks, natural pH indicator paper, odour absorber. Candle or bioplastic only with an adult at each stove.", "Amali: setiap kumpulan menyiapkan satu makmal dan menilainya dengan rubrik produk. Pilihan tanpa haba tinggi: bata eko, kertas penunjuk pH semula jadi, penyerap bau. Lilin atau bioplastik hanya dengan seorang dewasa di setiap dapur."], `${lab("ecobrick")} ${lab("litmus")} ${lab("odour")} ${lab("candle")} ${lab("bioplastic")}`, ["“What waste did you use, what did you make, and what science made it work?”", "“Sisa apakah yang digunakan, apakah yang dihasilkan, dan sains apakah yang menjayakannya?”"]],
      ["2:05–2:20", ["Reflection and assessment: a 1-minute pitch per group, the reflection worksheet, and the quiz or certificate quest.", "Refleksi dan pentaksiran: pembentangan 1 minit bagi setiap kumpulan, lembaran refleksi, dan kuiz atau misi sijil."], `${game("quiz")} ${CERT()}`, ["“Who would use or buy your product, and how much waste could it save?”", "“Siapakah yang akan menggunakan atau membeli produk anda, dan berapa banyak sisa yang boleh dijimatkan?”"]]],
    warn: ["Heat (candle, bioplastic) and sharp tools need an adult at every station. Prepare materials and cut bottles before the session.", "Haba (lilin, bioplastik) dan alatan tajam memerlukan seorang dewasa di setiap stesen. Sediakan bahan dan potong botol sebelum sesi."] },
  { icon: "🌱", t: ["Eco-Club: 4 weeks", "Kelab Eko: 4 minggu"], who: ["Primary or secondary school club · one 60–90 minute meeting a week", "Kelab sekolah rendah atau menengah · satu pertemuan 60–90 minit seminggu"],
    mats: ["Gloves and a kitchen scale for the bin audit; a plastic bottle for eco-enzyme; a compost bin; lab materials; space for a small exhibition.", "Sarung tangan dan penimbang dapur untuk audit tong sampah; botol plastik untuk eko-enzim; tong kompos; bahan makmal; ruang untuk pameran kecil."],
    rows: [[B("Week 1", "Minggu 1"), ["Waste detectives: Learn 1–2; Sort It Out; audit one day of the class bin (weigh by type, gloves on); start an eco-enzyme bottle, which needs 3 months.", "Detektif sisa: Belajar 1–2; Asingkan Sampah; audit tong kelas selama sehari (timbang mengikut jenis, pakai sarung tangan); mulakan sebotol eko-enzim yang memerlukan 3 bulan."], `${learn(1, 2)} ${game("sort")} ${lab("enzyme")}`, ["“What surprised you in our bin? Which item could have been avoided?”", "“Apa yang mengejutkan anda dalam tong kita? Bahan manakah yang boleh dielakkan?”"]],
      [B("Week 2", "Minggu 2"), ["Science of change: Learn 3–4; compost, eco-enzyme and pH simulations; natural pH indicator lab; set up a compost bin.", "Sains perubahan: Belajar 3–4; simulasi kompos, eko-enzim dan pH; makmal penunjuk pH semula jadi; sediakan tong kompos."], `${learn(3, 4)} ${game("compost")} ${game("enzyme")} ${game("ph")} ${lab("litmus")} ${lab("compost")}`, ["“What do microbes need to break down food waste?”", "“Apakah yang diperlukan oleh mikrob untuk mengurai sisa makanan?”"]],
      [B("Week 3", "Minggu 3"), ["Makers: one product lab per group, then cost the product in Waste to Cash.", "Pembuat: satu makmal produk bagi setiap kumpulan, kemudian kira kos produk dalam Sisa jadi Wang."], `${lab("treasure")} ${lab("watering")} ${lab("bioplastic")} ${lab("candle")} ${game("cash")}`, ["“What does one item cost to make? Who would buy it, and for how much?”", "“Berapakah kos untuk menghasilkan satu unit? Siapakah yang akan membelinya, dan pada harga berapa?”"]],
      [B("Week 4", "Minggu 4"), ["Champions: Learn 5–7; action plans; Class Battle tournament; mini exhibition for parents or the school; certificate quests.", "Juara: Belajar 5–7; pelan tindakan; kejohanan Pertandingan Kelas; pameran mini untuk ibu bapa atau sekolah; misi sijil."], `${learn(5, 6, 7)} ${CLASS()} ${CERT()}`, ["“What will our club do next term to keep the change going?”", "“Apakah yang akan dilakukan oleh kelab kita pada penggal depan untuk meneruskan perubahan?”"]]],
    warn: ["Eco-enzyme bottles build up gas: use plastic bottles only, never sealed glass, and release the gas daily in the first month. Cover any standing water so Aedes mosquitoes cannot breed.", "Botol eko-enzim menghasilkan gas: guna botol plastik sahaja, jangan sekali-kali balang kaca yang tertutup rapat, dan lepaskan gas setiap hari pada bulan pertama. Tutup air bertakung supaya nyamuk Aedes tidak membiak."] },
  { icon: "💼", t: ["Adult / ESG half-day: 3.5 hours", "Separuh hari dewasa / ESG: 3.5 jam"], who: ["Staff, community leaders, CSR and sustainability teams · counts towards the proposed Practitioner micro-credential", "Kakitangan, pemimpin komuniti, pasukan CSR dan kelestarian · dikira untuk mikro-kredensial Pengamal yang dicadangkan"],
    mats: ["Projector and internet; one device per pair; lab materials for three labs; printed pitch rubric; aprons and gloves.", "Projektor dan internet; satu peranti bagi setiap pasangan; bahan untuk tiga makmal; rubrik pembentangan bercetak; apron dan sarung tangan."],
    rows: [["0:00–0:20", ["Opening: Malaysia's waste picture and why it matters to organisations (set the audience to Adults).", "Pembukaan: gambaran sisa Malaysia dan kepentingannya kepada organisasi (tetapkan audiens kepada Dewasa)."], learn(1), ["“What waste does your organisation produce, and who pays for it?”", "“Sisa apakah yang dihasilkan oleh organisasi anda, dan siapakah yang menanggung kosnya?”"]],
      ["0:20–0:50", ["Circular economy, the waste hierarchy and Extended Producer Responsibility (EPR).", "Ekonomi kitaran, hierarki sisa dan Tanggungjawab Pengeluar Lanjutan (EPR)."], learn(2, 3, 4), ["“Where on the hierarchy are your current practices? What would moving one step up take?”", "“Di manakah amalan semasa anda dalam hierarki? Apakah yang diperlukan untuk naik satu anak tangga?”"]],
      ["0:50–1:20", ["Simulations in pairs: carbon footprint and Waste to Cash costing.", "Simulasi berpasangan: jejak karbon dan pengiraan kos Sisa jadi Wang."], `${game("footprint")} ${game("cash")}`, ["“What price makes the product viable without overclaiming its green benefits?”", "“Harga berapakah yang menjadikan produk berdaya maju tanpa melebih-lebihkan manfaat hijaunya?”"]],
      ["1:20–1:35", ["Break", "Rehat"], "", ["", ""]],
      ["1:35–2:35", ["Hands-on lab: choose one of three.", "Makmal amali: pilih satu daripada tiga."], `${lab("candle")} ${lab("enzyme")} ${lab("bioplastic")}`, ["“What would it take to make 100 of these a month, safely?”", "“Apakah yang diperlukan untuk menghasilkan 100 unit sebulan dengan selamat?”"]],
      ["2:35–3:00", ["Pitch preparation with the W2W pitch form.", "Persediaan pembentangan dengan borang pembentangan W2W."], PITCH(), ["“State the waste stream, the customer, the unit cost and one SDG.”", "“Nyatakan aliran sisa, pelanggan, kos seunit dan satu SDG.”"]],
      ["3:00–3:20", ["Pitches (3 minutes each) with peer scoring on the pitch rubric. For more than 6 groups, run a gallery walk.", "Pembentangan (3 minit setiap satu) dengan penilaian rakan menggunakan rubrik pembentangan. Jika lebih daripada 6 kumpulan, adakan jelajah galeri."], sec("credential"), ["“What is the strongest point of this pitch, and one question you would ask an investor?”", "“Apakah kekuatan utama pembentangan ini, dan satu soalan yang akan anda tanya kepada pelabur?”"]],
      ["3:20–3:30", ["Close: Practitioner quest (20 questions) now or as follow-up; next steps.", "Penutup: misi Pengamal (20 soalan) sekarang atau sebagai susulan; langkah seterusnya."], CERT(), ["“What one change will your team make next month?”", "“Apakah satu perubahan yang akan dilakukan oleh pasukan anda bulan depan?”"]]],
    warn: ["Hot wax and hot starch mixtures cause burns: one facilitator per stove, long sleeves and closed shoes.", "Lilin panas dan campuran kanji panas boleh menyebabkan lecur: seorang fasilitator bagi setiap dapur, berlengan panjang dan berkasut tertutup."] }
];
function plans() {
  return `<p>${B("Four ready-to-run plans. Each activity links to the page you need; the right-hand column gives a question to ask. Adjust timings to your group.", "Empat rancangan sedia guna. Setiap aktiviti dipautkan ke halaman yang diperlukan; lajur kanan memberi soalan untuk ditanya. Ubah suai masa mengikut kumpulan anda.")}</p>` +
    PLANS().map(p => `<div class="th-plan"><h3 class="th-h3">${p.icon} ${b2(p.t)}</h3><p class="small muted">${b2(p.who)}</p>
      <p class="small"><b>${B("Materials", "Bahan")}:</b> ${b2(p.mats)}</p>
      ${tbl([B("Time", "Masa"), B("Activity", "Aktiviti"), B("Open", "Buka"), B("Facilitator prompt", "Soalan fasilitator")], p.rows.map(r => [`<b>${r[0]}</b>`, b2(r[1]), r[2], `<i>${b2(r[3])}</i>`]), "th-planT")}
      ${danger(`<b>${SUP()}.</b> ${b2(p.warn)}`)}</div>`).join("");
}

/* ---------- (c) credentials and micro-credential ---------- */
const TRACKS = [
  ["junior", "🌱", ["Junior Eco-Hero", "Wira Eko Junior"], ["Kids 7–12", "Kanak-kanak 7–12"], ["10 questions from the kids track", "10 soalan daripada laluan kanak-kanak"], "70%", ["Earn at least 3 game badges", "Peroleh sekurang-kurangnya 3 lencana permainan"]],
  ["champion", "🏆", ["Zero-Waste Champion", "Juara Sifar Sisa"], ["Teens 13–17", "Remaja 13–17"], ["15 questions from the teens track", "15 soalan daripada laluan remaja"], "75%", ["At least 5 badges, including at least 1 lab badge", "Sekurang-kurangnya 5 lencana, termasuk sekurang-kurangnya 1 lencana makmal"]],
  ["practitioner", "🎓", ["Waste-to-Wealth Practitioner (micro-credential, proposed)", "Pengamal Sisa kepada Kekayaan (mikro-kredensial, cadangan)"], ["Adults", "Dewasa"], ["20 questions from the adults track", "20 soalan daripada laluan dewasa"], "80%", ["At least 2 lab badges + W2W product pitch (portfolio, teacher-verified)", "Sekurang-kurangnya 2 lencana makmal + pembentangan produk W2W (portfolio, disahkan guru)"]]
];
const RUBRIC = [
  [["Problem and waste stream", "Masalah dan aliran sisa"], ["Waste stream unclear; no link to a real problem.", "Aliran sisa tidak jelas; tiada kaitan dengan masalah sebenar."], ["Waste stream named; problem described in general terms.", "Aliran sisa dinyatakan; masalah diterangkan secara umum."], ["Clear waste stream and local problem, with an estimate of kg diverted.", "Aliran sisa dan masalah setempat yang jelas, dengan anggaran kg sisa yang dialihkan."], ["As Proficient, plus sourced data and a realistic plan to collect the waste.", "Seperti Cekap, serta data bersumber dan pelan realistik untuk mengumpul sisa."]],
  [["Product and process", "Produk dan proses"], ["Product unclear or not made.", "Produk tidak jelas atau tidak dihasilkan."], ["Product made; steps incomplete.", "Produk dihasilkan; langkah tidak lengkap."], ["Working product; steps clear and repeatable; science explained.", "Produk berfungsi; langkah jelas dan boleh diulang; sains diterangkan."], ["As Proficient, plus tested and improved, with evidence (e.g. a second version).", "Seperti Cekap, serta diuji dan ditambah baik, dengan bukti (cth. versi kedua)."]],
  [["Safety and environmental impact", "Keselamatan dan kesan alam sekitar"], ["Hazards not identified.", "Bahaya tidak dikenal pasti."], ["Some hazards listed; controls incomplete.", "Sebahagian bahaya disenaraikan; kawalan tidak lengkap."], ["Hazards and controls complete; no new pollution created.", "Bahaya dan kawalan lengkap; tiada pencemaran baharu dihasilkan."], ["As Proficient, plus life-cycle thinking: energy, water and the product's end of life.", "Seperti Cekap, serta pemikiran kitar hayat: tenaga, air dan pengakhiran hayat produk."]],
  [["Value proposition and costing", "Cadangan nilai dan kos"], ["No customer or cost.", "Tiada pelanggan atau kos."], ["Customer named; cost or price incomplete.", "Pelanggan dinyatakan; kos atau harga tidak lengkap."], ["Unit cost, price and margin calculated; customer need explained.", "Kos seunit, harga dan margin dikira; keperluan pelanggan diterangkan."], ["As Proficient, plus scale-up or “what if costs rise” and comparison with an alternative product.", "Seperti Cekap, serta skala lebih besar atau “jika kos meningkat” dan perbandingan dengan produk alternatif."]],
  [["Social impact", "Kesan sosial"], ["Not considered.", "Tidak dipertimbangkan."], ["General benefit stated.", "Manfaat umum dinyatakan."], ["Specific community benefit (jobs, awareness, use in schools) linked to an SDG.", "Manfaat komuniti yang khusus (pekerjaan, kesedaran, kegunaan di sekolah) dikaitkan dengan SDG."], ["As Proficient, plus a plan to involve the community and measure the impact.", "Seperti Cekap, serta pelan untuk melibatkan komuniti dan mengukur kesannya."]],
  [["Communication", "Komunikasi"], ["Hard to follow.", "Sukar difahami."], ["Main points clear; over time or few visuals.", "Isi utama jelas; melebihi masa atau kurang bahan visual."], ["Clear, on time, answers questions well.", "Jelas, menepati masa, menjawab soalan dengan baik."], ["Persuasive and well structured; uses data and visuals; confident in Q&A.", "Meyakinkan dan tersusun; menggunakan data dan visual; yakin semasa soal jawab."]]
];
const LEVELS = () => [B("1 Beginning", "1 Permulaan"), B("2 Developing", "2 Berkembang"), B("3 Proficient", "3 Cekap"), B("4 Exemplary", "4 Cemerlang")];
function credential() {
  return `<p>${B("WasteQuest offers three certificate tracks. Learners complete them on this website at", "WasteQuest menawarkan tiga laluan sijil. Peserta melengkapkannya dalam laman web ini di")} ${CERT()}. ${B("Every certificate is a <b>Certificate of Completion</b> with a verification code.", "Setiap sijil ialah <b>Sijil Penyempurnaan</b> dengan kod pengesahan.")}</p>
  ${tbl([B("Track", "Laluan"), B("Audience", "Audiens"), B("Assessment", "Pentaksiran"), B("Pass mark", "Markah lulus"), B("Other requirement", "Syarat lain")],
    TRACKS.map(r => [`${r[1]} <b>${b2(r[2])}</b>`, b2(r[3]), b2(r[4]), `<b>${r[5]}</b>`, b2(r[6])]))}
  ${note("warn", `<b>${B("Proposed, not yet accredited.", "Cadangan, belum diakreditasi.")}</b> ${B("The Waste-to-Wealth Practitioner is a proposed micro-credential. It has not been accredited or quality-verified by the Malaysian Qualifications Agency (MQA) and carries no academic credit. Until it is, certificates are certificates of completion only.", "Pengamal Sisa kepada Kekayaan ialah mikro-kredensial yang dicadangkan. Ia belum diakreditasi atau disahkan kualitinya oleh Agensi Kelayakan Malaysia (MQA) dan tidak membawa kredit akademik. Sehingga itu, sijil yang dikeluarkan hanyalah sijil penyempurnaan.")}`)}
  ${h3(B("Practitioner design: 20 notional learning hours (0.5 credit)", "Reka bentuk Pengamal: 20 jam pembelajaran nosional (0.5 kredit)"))}
  <p>${B("In Malaysia, 1 credit = 40 notional learning hours (NLH): all the time a typical learner needs, including guided and independent learning and assessment. The Practitioner is designed with reference to the MQA <i>Guidelines to Good Practices: Micro-credentials</i> (2020).", "Di Malaysia, 1 kredit = 40 jam pembelajaran nosional (JPN): jumlah masa yang diperlukan oleh pelajar biasa, termasuk pembelajaran berpandu, pembelajaran kendiri dan pentaksiran. Pengamal direka bentuk dengan merujuk <i>Guidelines to Good Practices: Micro-credentials</i> MQA (2020).")}</p>
  ${tbl([B("Component", "Komponen"), B("Mode", "Mod"), "NLH", B("Evidence", "Bukti")], [
    [B("Online learning: Learn chapters 1–7 (adult view)", "Pembelajaran dalam talian: bab Belajar 1–7 (paparan dewasa)"), B("Independent", "Kendiri"), "4", B("All 7 quick checks complete (Learn badge)", "Kesemua 7 semakan pantas selesai (lencana Belajar)")],
    [B("Games and simulations (Footprint, Waste to Cash, pH, compost, eco-enzyme)", "Permainan dan simulasi (Jejak Karbon, Sisa jadi Wang, pH, kompos, eko-enzim)"), B("Independent or guided", "Kendiri atau berpandu"), "3", B("Game badges", "Lencana permainan")],
    [B("Hands-on labs (at least 2, incl. preparation and clean-up)", "Makmal amali (sekurang-kurangnya 2, termasuk persediaan dan pembersihan)"), B("Face-to-face, supervised", "Bersemuka, diawasi"), "6", B("Lab badges; product photos and notes", "Lencana makmal; foto dan catatan produk")],
    [B("Portfolio and W2W product pitch (research, costing, rehearsal)", "Portfolio dan pembentangan produk W2W (kajian, kos, latihan)"), B("Independent and group", "Kendiri dan berkumpulan"), "5", B("Completed pitch form", "Borang pembentangan lengkap")],
    [B("Assessment: final quest (20 questions) and pitch session", "Pentaksiran: misi akhir (20 soalan) dan sesi pembentangan"), B("Online and face-to-face", "Dalam talian dan bersemuka"), "2", B("Quest score; pitch rubric", "Skor misi; rubrik pembentangan")],
    [`<b>${B("Total", "Jumlah")}</b>`, "", "<b>20</b>", `<b>0.5 ${B("credit", "kredit")}</b>`]])}
  ${h3(B("Course learning outcomes (2) and assessment matrix", "Hasil pembelajaran kursus (2) dan matriks pentaksiran"))}
  <p class="small muted">${B("Two course learning outcomes (CLOs), each covering module LOs as sub-outcomes. This keeps within the MQA practice of no more than 2 ILOs per credit.", "Dua hasil pembelajaran kursus (HPK), setiap satu merangkumi HP modul sebagai sub-hasil. Ini mematuhi amalan MQA iaitu tidak lebih daripada 2 HPK bagi setiap kredit.")}</p>
  ${tbl(["CLO", B("Sub-outcomes", "Sub-hasil"), B("Activities", "Aktiviti"), B("Assessment", "Pentaksiran")], [
    [`<b>CLO1</b> ${B("Explain W2W, circular-economy and waste-management principles in the Malaysian context (Act 672, EPR, SDGs).", "Menerangkan prinsip W2W, ekonomi kitaran dan pengurusan sisa dalam konteks Malaysia (Akta 672, EPR, SDG).")}`, "LO1, LO2, LO3", `${learn(1, 2, 3, 4, 5, 6)} ${game("footprint")}`, B("Final quest, 20 questions (pass 80%)", "Misi akhir, 20 soalan (lulus 80%)")],
    [`<b>CLO2</b> ${B("Produce and pitch a safe, costed W2W product that adds environmental, economic and social value.", "Menghasilkan dan membentangkan produk W2W yang selamat dan dikira kosnya serta menambah nilai alam sekitar, ekonomi dan sosial.")}`, "LO4, LO5, LO6", `${pg("labs", "🔬", "Labs", "Makmal")} ${game("cash")} ${PITCH()}`, B("Lab portfolio (2 labs) and W2W pitch rubric", "Portfolio makmal (2 makmal) dan rubrik pembentangan W2W")]])}
  ${h3(B("Assessment weighting and completion rule", "Pemberat pentaksiran dan syarat lengkap"))}
  ${tbl([B("Assessment", "Pentaksiran"), B("Weight", "Pemberat"), B("Minimum to complete", "Minimum untuk lengkap")], [
    [B("Final quest (20 questions, adults track)", "Misi akhir (20 soalan, laluan dewasa)"), "30%", "80%"],
    [B("Lab portfolio (2 labs, product rubric)", "Portfolio makmal (2 makmal, rubrik produk)"), "30%", B("2 lab badges", "2 lencana makmal")],
    [B("W2W product pitch (rubric below)", "Pembentangan produk W2W (rubrik di bawah)"), "40%", B("No criterion at Level 1", "Tiada kriteria pada Tahap 1")]])}
  <p class="small">${B("Pitch score = total of the six criteria (each 1–4) ÷ 24 × 100. The website checks the quest score, lab badges and a complete pitch form; the facilitator verifies the pitch with this rubric and signs the portfolio sheet.", "Skor pembentangan = jumlah enam kriteria (setiap satu 1–4) ÷ 24 × 100. Laman web menyemak skor misi, lencana makmal dan borang pembentangan yang lengkap; fasilitator mengesahkan pembentangan dengan rubrik ini dan menandatangani helaian portfolio.")}</p>
  ${h3(B("W2W Product Pitch rubric", "Rubrik Pembentangan Produk W2W"))}
  ${tbl([B("Criterion", "Kriteria"), ...LEVELS()], RUBRIC.map(r => [`<b>${b2(r[0])}</b>`, b2(r[1]), b2(r[2]), b2(r[3]), b2(r[4])]), "th-rub")}
  ${h3(B("Quality assurance notes", "Nota jaminan kualiti"))}
  ${ul([B("MQA defines micro-credentials as certification of assessed knowledge, skills and competencies in a specific field, from accredited programme components or stand-alone courses (MQA, 2020).", "MQA mentakrifkan mikro-kredensial sebagai pensijilan pengetahuan, kemahiran dan kecekapan yang dinilai dalam bidang tertentu, daripada komponen program yang diakreditasi atau kursus mandiri (MQA, 2020)."),
    B("Stand-alone micro-credentials are quality-verified through an <b>MQA-appointed Quality Verification Centre (QVC)</b> using form SAMC-01. The minimum is <b>40 NLH (1 credit)</b>, in steps of 20 NLH; no more than 2 ILOs per credit; apply within 3 months before the course or cohort ends; verification lasts 3 years (MQA GGP QVSAMC 2023, as summarised in university guidelines).", "Mikro-kredensial mandiri disahkan kualitinya melalui <b>Pusat Pengesahan Kualiti (QVC) yang dilantik oleh MQA</b> menggunakan borang SAMC-01. Minimumnya <b>40 JPN (1 kredit)</b>, dengan gandaan 20 JPN; tidak lebih daripada 2 HPK bagi setiap kredit; mohon dalam tempoh 3 bulan sebelum kursus atau kohort tamat; pengesahan sah selama 3 tahun (MQA GGP QVSAMC 2023, seperti diringkaskan dalam garis panduan universiti)."),
    B("<b>What this means:</b> at 20 NLH, the Practitioner can run now as a non-credit certificate of completion. To seek quality verification, extend it to 40 NLH, for example by adding a 20-hour supervised community W2W project.", "<b>Maksudnya:</b> pada 20 JPN, Pengamal boleh dilaksanakan sekarang sebagai sijil penyempurnaan tanpa kredit. Untuk memohon pengesahan kualiti, panjangkan kepada 40 JPN, contohnya dengan menambah projek W2W komuniti diawasi selama 20 jam."),
    B("Before applying, document: market need; LOs aligned to the MQF level; assessment matched to the LOs (at least two methods); facilitator qualifications; and secure records so certificates cannot be forged.", "Sebelum memohon, dokumentasikan: keperluan pasaran; HP yang sejajar dengan tahap MQF; pentaksiran yang sepadan dengan HP (sekurang-kurangnya dua kaedah); kelayakan fasilitator; dan rekod selamat supaya sijil tidak boleh dipalsukan."),
    B("An official certificate usually also shows a serial number, learner ID, learning outcomes, language, total learning hours, assessment type, grade and an authorised signature. The WasteQuest certificate currently shows name, track, date, score and a verification code.", "Sijil rasmi biasanya turut memaparkan nombor siri, ID pelajar, hasil pembelajaran, bahasa, jumlah jam pembelajaran, jenis pentaksiran, gred dan tandatangan pegawai yang diberi kuasa. Sijil WasteQuest kini memaparkan nama, laluan, tarikh, skor dan kod pengesahan.")])}
  ${h3(B("Next steps (through UPM)", "Langkah seterusnya (melalui UPM)"))}
  <ol class="th-ol">${[B("Pilot the 20-NLH Practitioner with one adult cohort; collect quest scores, rubrics and feedback.", "Rintis Pengamal 20 JPN dengan satu kohort dewasa; kumpul skor misi, rubrik dan maklum balas."),
    B("Decide whether to extend to 40 NLH (1 credit) with a community project.", "Tentukan sama ada untuk memanjangkan kepada 40 JPN (1 kredit) dengan projek komuniti."),
    `${B("Submit through UPM's micro-credential office to an MQA-appointed QVC.", "Kemukakan melalui pejabat mikro-kredensial UPM kepada QVC yang dilantik oleh MQA.")} ${todo(B("confirm the UPM office responsible for micro-credentials", "sahkan pejabat UPM yang bertanggungjawab bagi mikro-kredensial"))}`,
    B("Only after verification, update certificates and this page to say so.", "Hanya selepas pengesahan, kemas kini sijil dan halaman ini.")].map(x => `<li>${x}</li>`).join("")}</ol>`;
}

/* ---------- (d) safety ---------- */
const RULES = [
  ["An adult supervises every lab. For heat or sharp-tool steps, one adult per group.", "Seorang dewasa mengawasi setiap makmal. Untuk langkah melibatkan haba atau alatan tajam, seorang dewasa bagi setiap kumpulan."],
  ["Safety briefing before starting; each group names a safety officer.", "Taklimat keselamatan sebelum bermula; setiap kumpulan melantik pegawai keselamatan."],
  ["Tie back long hair; closed shoes; apron. Goggles for hot liquids and pH tests.", "Ikat rambut panjang; berkasut tertutup; pakai apron. Gogal untuk cecair panas dan ujian pH."],
  ["Use only clean waste. No broken glass, needles, batteries, medicines or chemical containers.", "Guna sisa yang bersih sahaja. Tiada kaca pecah, jarum, bateri, ubat atau bekas bahan kimia."],
  ["Gloves for food scraps, fish waste and compost. Wash hands with soap afterwards.", "Pakai sarung tangan untuk sisa makanan, sisa ikan dan kompos. Basuh tangan dengan sabun selepas itu."],
  ["Never taste or eat anything in a lab, including the products.", "Jangan rasa atau makan apa-apa dalam makmal, termasuk produk."],
  ["Adults handle stoves, hot wax, hot water and irons. Never leave heat unattended. Never put water on a wax or oil fire: turn off the heat and cover it with a lid.", "Orang dewasa mengendalikan dapur, lilin panas, air panas dan seterika. Jangan tinggalkan haba tanpa pengawasan. Jangan sekali-kali curah air pada api lilin atau minyak: tutup api dan tutup dengan penutup."],
  ["Adults pre-cut bottles with craft knives; children use safety scissors.", "Orang dewasa memotong botol dengan pisau kraf terlebih dahulu; kanak-kanak menggunakan gunting keselamatan."],
  ["Never melt or burn plastic, and never heat plastic in oil.", "Jangan sekali-kali melebur atau membakar plastik, dan jangan memanaskan plastik dalam minyak."],
  ["No lye (sodium hydroxide) with children. Adult groups making soap follow chemical-safety rules.", "Tiada alkali kuat (natrium hidroksida) dengan kanak-kanak. Kumpulan dewasa yang membuat sabun mengikut peraturan keselamatan kimia."],
  ["Ask about allergies (fish, coffee, fragrance, latex gloves) before the lab.", "Tanya tentang alahan (ikan, kopi, pewangi, sarung tangan lateks) sebelum makmal."],
  ["Label every jar or bottle with contents, name and date.", "Labelkan setiap balang atau botol dengan kandungan, nama dan tarikh."],
  ["Electronics: low-voltage USB or battery only, kept away from water.", "Elektronik: voltan rendah USB atau bateri sahaja, dijauhkan daripada air."],
  ["First-aid kit ready; emergency number 999. Clean up and sort leftover waste into the right bins.", "Peti pertolongan cemas tersedia; nombor kecemasan 999. Bersihkan dan asingkan sisa berbaki ke dalam tong yang betul."]
];
const RISKS = [
  ["candle", ["Hot wax or oil; flame", "Lilin atau minyak panas; api"], "high", ["Adult melts wax in a double boiler, never over direct flame; learners add colour and fragrance away from the stove; no water on a wax fire (lid on); light candles only when set and supervised.", "Orang dewasa mencairkan lilin dalam dandang berkembar, bukan terus di atas api; peserta menambah warna dan pewangi jauh dari dapur; jangan curah air pada api lilin (tutup dengan penutup); nyalakan lilin hanya apabila sudah keras dan diawasi."], ["Adult does all heating", "Orang dewasa mengendalikan semua pemanasan"]],
  ["petfood", ["Raw fish (bacteria); knives; stove heat", "Ikan mentah (bakteria); pisau; haba dapur"], "med", ["Gloves; separate board; adult cuts and cooks thoroughly; wash hands and surfaces; keep chilled; check fish allergies.", "Sarung tangan; papan pemotong berasingan; orang dewasa memotong dan memasak sehingga masak; basuh tangan dan permukaan; simpan sejuk; semak alahan ikan."], ["Adult cuts and cooks", "Orang dewasa memotong dan memasak"]],
  ["treasure", ["Scissors and needles; hot iron and fumes if fusing plastic bags", "Gunting dan jarum; seterika panas dan wasap jika mencantum beg plastik"], "med", ["Safety scissors; needle count before and after; adult irons between baking paper on a low setting in a ventilated room; stop if it smokes.", "Gunting keselamatan; kira jarum sebelum dan selepas; orang dewasa menyeterika di antara kertas pembakar pada suhu rendah di bilik berpengudaraan; hentikan jika berasap."], ["Adult irons", "Orang dewasa menyeterika"]],
  ["litmus", ["Hot water for extraction; test liquids", "Air panas untuk pengekstrakan; cecair ujian"], "low", ["Adult pours hot water; use only food-safe liquids (vinegar, lime juice, baking-soda water, soapy water); never bleach, drain or oven cleaner; goggles; do not taste.", "Orang dewasa menuang air panas; guna cecair selamat sahaja (cuka, jus limau, air soda penaik, air sabun); jangan guna peluntur, pembersih longkang atau ketuhar; pakai gogal; jangan rasa."], ["Adult pours hot water", "Orang dewasa menuang air panas"]],
  ["odour", ["Mould on damp grounds; oven heat", "Kulat pada hampas lembap; haba ketuhar"], "low", ["Dry grounds fully (sun or adult-operated oven); throw away mouldy batches; use breathable bags.", "Keringkan hampas sepenuhnya (jemur atau ketuhar dikendalikan orang dewasa); buang kumpulan yang berkulat; guna beg yang telap udara."], ["Adult uses the oven", "Orang dewasa menggunakan ketuhar"]],
  ["watering", ["Cut bottle edges; standing water (Aedes mosquitoes); electricity in the sensor version", "Tepi botol yang dipotong; air bertakung (nyamuk Aedes); elektrik dalam versi sensor"], "med", ["Adult cuts with a craft knife and tapes edges; cover the reservoir and check it weekly; low-voltage electronics only, kept dry.", "Orang dewasa memotong dengan pisau kraf dan melekatkan pita pada tepi; tutup takungan dan periksa setiap minggu; elektronik voltan rendah sahaja, dipastikan kering."], ["Adult cuts; weekly check", "Orang dewasa memotong; pemeriksaan mingguan"]],
  ["enzyme", ["Gas pressure from fermentation; not drinkable; ants", "Tekanan gas daripada penapaian; tidak boleh diminum; semut"], "med", ["Plastic bottles only, never sealed glass; leave headspace; release gas daily in the first month; label “Not for drinking”; store out of reach; dilute before use and patch-test on skin.", "Botol plastik sahaja, jangan balang kaca yang tertutup rapat; tinggalkan ruang kosong; lepaskan gas setiap hari pada bulan pertama; labelkan “Bukan untuk diminum”; simpan jauh daripada capaian; cairkan sebelum digunakan dan uji pada kulit."], ["Adult checks weekly for 3 months", "Orang dewasa memeriksa setiap minggu selama 3 bulan"]],
  ["ecobrick", ["Sharp plastic pieces; packing stick", "Cebisan plastik tajam; kayu pemadat"], "low", ["Only clean, dry soft plastic (dirty plastic grows mould); use a blunt wooden stick; gloves optional.", "Hanya plastik lembut yang bersih dan kering (plastik kotor akan berkulat); guna kayu yang tumpul; sarung tangan pilihan."], ["Normal supervision", "Pengawasan biasa"]],
  ["compost", ["Microbes and fungal spores; pests; garden tools", "Mikrob dan spora kulat; perosak; alatan kebun"], "med", ["Gloves and handwashing; no meat, dairy or oily food (attracts pests); keep the bin covered; learners with asthma or weak immunity do not turn dry compost.", "Sarung tangan dan basuh tangan; tiada daging, tenusu atau makanan berminyak (menarik perosak); tutup tong; peserta yang menghidap asma atau berimuniti lemah tidak menggaul kompos kering."], ["Adult present when turning", "Orang dewasa hadir semasa menggaul"]],
  ["bioplastic", ["Stove heat; hot sticky mixture can spatter", "Haba dapur; campuran panas yang melekit boleh memercik"], "med", ["Adult heats on low and stirs with a long spoon; goggles; cool fully before shaping.", "Orang dewasa memanaskan pada api perlahan dan mengacau dengan sudu panjang; pakai gogal; sejukkan sepenuhnya sebelum dibentuk."], ["Adult does all heating", "Orang dewasa mengendalikan semua pemanasan"]]
];
const RISKLV = { high: ["tag red", "High", "Tinggi"], med: ["tag warn", "Medium", "Sederhana"], low: ["tag go", "Low", "Rendah"] };
function safety(pr) {
  return `${danger(`<b>${SUP()}.</b> ${B("Heat, sharp tools, fermentation gas and electricity are used in some labs. Read each lab page before the session and prepare materials in advance.", "Haba, alatan tajam, gas penapaian dan elektrik digunakan dalam sesetengah makmal. Baca setiap halaman makmal sebelum sesi dan sediakan bahan lebih awal.")}`)}
  ${h3(B("Lab rules checklist", "Senarai semak peraturan makmal"))}
  <ul class="th-check">${RULES.map((r, i) => pr ? `<li><span class="th-box" aria-hidden="true"></span>${b2(r)}</li>` : `<li><label><input type="checkbox" id="th-r${i}"> ${b2(r)}</label></li>`).join("")}</ul>
  ${note("danger", `🚫 <b>${B("Never use:", "Jangan sekali-kali guna:")}</b> ${B("the 2024 student method of melting plastic in hot engine oil. It gives off toxic fumes and is a serious fire risk.", "kaedah pelajar 2024 yang meleburkan plastik dalam minyak enjin panas. Ia membebaskan wasap toksik dan berisiko tinggi menyebabkan kebakaran.")}`)}
  ${h3(B("Risk table for the 10 labs", "Jadual risiko bagi 10 makmal"))}
  <p class="small muted">${B("Risk ratings are our guide for a typical school session with the controls in place. Review them for your own space and group.", "Penarafan risiko ialah panduan kami bagi sesi sekolah biasa dengan kawalan dilaksanakan. Semak semula mengikut ruang dan kumpulan anda.")}</p>
  ${tbl([B("Lab", "Makmal"), B("Hazard", "Bahaya"), B("Risk", "Risiko"), B("Control", "Kawalan"), B("Supervision", "Pengawasan")],
    RISKS.map(r => [lab(r[0]), b2(r[1]), `<span class="${RISKLV[r[2]][0]}">${B(RISKLV[r[2]][1], RISKLV[r[2]][2])}</span>`, b2(r[3]), b2(r[4])]), "th-risk")}`;
}

/* ---------- (e) rubrics and reflection ---------- */
function rubrics() {
  const KR = [[["Product", "Produk"], ["Not finished.", "Tidak siap."], ["Finished with a lot of help; some steps followed.", "Siap dengan banyak bantuan; sebahagian langkah diikuti."], ["Finished; all steps followed; works as planned.", "Siap; semua langkah diikuti; berfungsi seperti dirancang."], ["Works well and shows a creative improvement.", "Berfungsi dengan baik dan menunjukkan penambahbaikan kreatif."]],
    [["Teamwork and safety", "Kerja berpasukan dan keselamatan"], ["Works alone or off task.", "Bekerja sendirian atau tidak fokus."], ["Joins in when asked.", "Melibatkan diri apabila diminta."], ["Does own role, shares, follows safety rules.", "Menjalankan peranan, berkongsi, mematuhi peraturan keselamatan."], ["Helps others, includes everyone, leads safely.", "Membantu rakan, melibatkan semua, memimpin dengan selamat."]],
    [["Reflection", "Refleksi"], ["Says only what was made.", "Hanya menyebut apa yang dihasilkan."], ["Says what was made and from which waste.", "Menyebut apa yang dihasilkan dan daripada sisa apa."], ["Explains the science or why it helps the environment.", "Menerangkan sains atau mengapa ia membantu alam sekitar."], ["Also suggests an improvement and a real-life use.", "Turut mencadangkan penambahbaikan dan kegunaan sebenar."]]];
  const KIDS = [["I made my product safely.", "Saya menghasilkan produk dengan selamat."], ["I followed the steps.", "Saya mengikut langkah-langkah."], ["I helped my team.", "Saya membantu pasukan saya."], ["I can say what waste we used.", "Saya boleh menyebut sisa yang kami gunakan."], ["I can say how it helps the Earth.", "Saya boleh menyebut bagaimana ia membantu Bumi."]];
  const Q = [["Name / group / date", "Nama / kumpulan / tarikh", 1], ["What waste did we use, and where would it normally go?", "Sisa apakah yang kami gunakan, dan ke manakah ia biasanya dibuang?", 2], ["What did we make? Draw or describe it.", "Apakah yang kami hasilkan? Lukis atau terangkan.", 3],
    ["What science made it work? (e.g. microbes, acids and bases, heat)", "Sains apakah yang menjayakannya? (cth. mikrob, asid dan bes, haba)", 2], ["What went well? What would we change next time?", "Apakah yang berjalan lancar? Apakah yang akan kami ubah lain kali?", 2],
    ["How much waste could this save in a month? Show your working.", "Berapa banyakkah sisa yang boleh dijimatkan dalam sebulan? Tunjukkan jalan kira.", 2], ["Who could use or buy it?", "Siapakah yang boleh menggunakan atau membelinya?", 1], ["My zero-waste promise for this week:", "Janji sifar sisa saya untuk minggu ini:", 1]];
  return `<p>${B("For kids and teens doing a hands-on lab. Score each criterion 1–4 (total out of 12). Teens can also peer-assess another group.", "Untuk kanak-kanak dan remaja yang menjalankan makmal amali. Beri skor 1–4 bagi setiap kriteria (jumlah daripada 12). Remaja juga boleh menilai kumpulan lain.")}</p>
  ${h3(B("Hands-on rubric", "Rubrik amali"))}
  ${tbl([B("Criterion", "Kriteria"), ...LEVELS()], KR.map(r => [`<b>${b2(r[0])}</b>`, b2(r[1]), b2(r[2]), b2(r[3]), b2(r[4])]), "th-rub")}
  ${h3(B("Kids' star self-check", "Semakan kendiri bintang kanak-kanak"))}
  ${tbl([B("I can…", "Saya boleh…"), B("Colour the stars", "Warnakan bintang")], KIDS.map(k => [b2(k), `<span class="th-stars" aria-label="${B("0 to 3 stars", "0 hingga 3 bintang")}">☆ ☆ ☆</span>`]), "th-kids")}
  <div class="th-sheet">${h3(`📝 ${B("Reflection worksheet", "Lembaran refleksi")}`)}
  ${Q.map(q => `<div class="th-wq"><b>${B(q[0], q[1])}</b>${lines(q[2])}</div>`).join("")}</div>`;
}

/* ---------- (f) curriculum links ---------- */
function curriculum() {
  return `<p>${B("WasteQuest supports, but does not replace, the national curriculum. The links below are general; always check the current DSKP for your year and subject, because standards and chapter numbers are revised.", "WasteQuest menyokong, tetapi tidak menggantikan, kurikulum kebangsaan. Pautan di bawah adalah umum; sentiasa semak DSKP terkini bagi tahun dan mata pelajaran anda kerana standard dan nombor bab disemak semula dari semasa ke semasa.")}</p>
  ${tbl([B("Level", "Tahap"), B("Subject and topic", "Mata pelajaran dan topik"), B("WasteQuest activities", "Aktiviti WasteQuest")], [
    [B("Primary (KSSR)", "Rendah (KSSR)"), B("Science, upper primary: microorganisms, and preservation and conservation (Pemeliharaan dan Pemuliharaan) in Year 6. Check your DSKP.", "Sains, tahap dua: mikroorganisma, serta Pemeliharaan dan Pemuliharaan dalam Tahun 6. Semak DSKP anda."), `${game("compost")} ${lab("compost")} ${game("sort")}`],
    [B("Form 1 (KSSM)", "Tingkatan 1 (KSSM)"), B("Design and Technology (RBT): Ch 3 Design Process, Ch 4 Sketching, Ch 5 Technology Application.", "Reka Bentuk dan Teknologi (RBT): Bab 3 Proses Reka Bentuk, Bab 4 Lakaran, Bab 5 Aplikasi Teknologi."), `${lab("watering")} ${lab("treasure")} ${PITCH()}`],
    [B("Form 2 (KSSM)", "Tingkatan 2 (KSSM)"), B("Science: Ch 2 Ecosystems; Ch 6 Acids and Alkalis.", "Sains: Bab 2 Ekosistem; Bab 6 Asid dan Alkali."), `${game("compost")} ${game("ph")} ${lab("litmus")} ${lab("enzyme")}`],
    [B("Secondary (KSSM)", "Menengah (KSSM)"), B("Geography: environment and sustainability topics (check the DSKP for your form).", "Geografi: topik alam sekitar dan kelestarian (semak DSKP bagi tingkatan anda)."), `${learn(1, 6)} ${game("footprint")}`],
    [B("All KSSM subjects", "Semua mata pelajaran KSSM"), B("Cross-curricular elements (EMK): Environmental Sustainability, Entrepreneurship, Creativity and Innovation, Science and Technology.", "Elemen Merentas Kurikulum (EMK): Kelestarian Alam Sekitar, Keusahawanan, Kreativiti dan Inovasi, Sains dan Teknologi."), `${game("cash")} ${CLASS()}`],
    [B("University and adults", "Universiti dan dewasa"), B("Sustainability, engineering and society, ESG reporting (e.g. GRI 306: Waste), EPR, SDG 12.", "Kelestarian, kejuruteraan dan masyarakat, pelaporan ESG (cth. GRI 306: Waste), EPR, SDG 12."), `${learn(3, 4, 6)} ${PITCH()}`]])}
  <p class="small">${todo(B("Dr Wan Azlina to confirm any school-specific mappings before printing for schools.", "Dr Wan Azlina perlu mengesahkan pemetaan khusus sekolah sebelum dicetak untuk sekolah."))}</p>`;
}

/* ---------- (g) Class Battle ---------- */
function classBattle() {
  const S = [["Open WasteQuest on the computer connected to the projector and go to Class Battle.", "Buka WasteQuest pada komputer yang disambungkan ke projektor dan pergi ke Pertandingan Kelas."],
    ["Choose <b>Host a class</b>. Pick the level (kids, teens, adults), topic, number of questions and seconds per question.", "Pilih <b>Anjurkan kelas</b>. Pilih tahap (kanak-kanak, remaja, dewasa), topik, bilangan soalan dan saat bagi setiap soalan."],
    ["Students scan the QR code, or open WasteQuest → Class → Join a class and type the 5-character code. No app or login; nicknames only.", "Murid mengimbas kod QR, atau buka WasteQuest → Kelas → Sertai kelas dan taip kod 5 aksara. Tiada aplikasi atau log masuk; nama samaran sahaja."],
    ["When everyone is in, press <b>Start quiz</b>. Faster correct answers earn more points; the leaderboard shows after each question.", "Apabila semua sudah masuk, tekan <b>Mula kuiz</b>. Jawapan betul yang lebih pantas mendapat lebih banyak mata; papan markah dipaparkan selepas setiap soalan."],
    ["At the end, download the results (CSV). The “% correct” per question shows which topics to teach again.", "Pada akhir permainan, muat turun keputusan (CSV). “% betul” bagi setiap soalan menunjukkan topik yang perlu diajar semula."]];
  return `<p>${B("Class Battle is a live quiz for the whole class: the questions show on the projector and students answer on their phones.", "Pertandingan Kelas ialah kuiz langsung untuk seluruh kelas: soalan dipaparkan pada projektor dan murid menjawab menggunakan telefon.")} ${CLASS()}</p>
  ${h3(B("Steps", "Langkah"))}<ol class="th-ol">${S.map(s => `<li>${b2(s)}</li>`).join("")}</ol>
  ${note("warn", `<b>${B("Needs internet.", "Perlu internet.")}</b> ${B("Live mode links phones to the projector through a free online service (PeerJS). It does not work when WasteQuest is opened from a file or localhost: use the online site. School Wi-Fi may block it; a phone hotspot usually works.", "Mod langsung menghubungkan telefon dengan projektor melalui perkhidmatan dalam talian percuma (PeerJS). Ia tidak berfungsi jika WasteQuest dibuka daripada fail atau localhost: gunakan laman dalam talian. Wi-Fi sekolah mungkin menyekatnya; hotspot telefon biasanya berfungsi.")}`)}
  ${note("ok", `<b>${B("No phones or no internet?", "Tiada telefon atau internet?")}</b> ${B("Use <b>Team mode</b>: 2–4 teams play on the projector only, offline. After each question, tap every team that got it right (+100 points).", "Guna <b>Mod pasukan</b>: 2–4 pasukan bermain pada projektor sahaja, tanpa internet. Selepas setiap soalan, ketik setiap pasukan yang menjawab dengan betul (+100 mata).")}`)}
  ${h3(B("Teaching tips", "Tip pengajaran"))}
  ${ul([B("Warm-up: 5 questions at the start to find out what the class already knows.", "Memanaskan badan: 5 soalan pada permulaan untuk mengetahui apa yang sudah diketahui kelas."),
    B("Exit ticket: 5 questions at the end; reteach the question with the lowest % correct next lesson.", "Tiket keluar: 5 soalan pada akhir; ajar semula soalan dengan % betul paling rendah pada pelajaran seterusnya."),
    B("Remind students to use kind nicknames; remove any unsuitable name from the lobby.", "Ingatkan murid menggunakan nama samaran yang sopan; keluarkan nama yang tidak sesuai dari lobi."),
    B("Pause after each question to explain the answer: the discussion is where most learning happens.", "Berhenti seketika selepas setiap soalan untuk menerangkan jawapan: perbincangan ialah tempat kebanyakan pembelajaran berlaku.")])}`;
}

/* ---------- (h) who can use it ---------- */
function users() {
  return `${h3(B("Who can use WasteQuest", "Siapa yang boleh menggunakan WasteQuest"))}
  ${tbl([B("User", "Pengguna"), B("Typical use", "Kegunaan biasa"), B("Suggested plan", "Rancangan dicadangkan")], [
    [B("Primary and secondary schools", "Sekolah rendah dan menengah"), B("Science, RBT and Eco-Club lessons; school recycling drives", "Pelajaran Sains, RBT dan Kelab Eko; kempen kitar semula sekolah"), B("60-minute lesson; Eco-Club", "Pelajaran 60 minit; Kelab Eko")],
    [B("Universities and TVET", "Universiti dan TVET"), B("Sustainability and engineering-and-society courses; student outreach projects", "Kursus kelestarian serta kejuruteraan dan masyarakat; projek jangkauan pelajar"), B("Workshop; Practitioner", "Bengkel; Pengamal")],
    [B("Government agencies and local authorities", "Agensi kerajaan dan pihak berkuasa tempatan"), B("Public awareness on separation at source and recycling", "Kesedaran awam tentang pengasingan di punca dan kitar semula"), B("Workshop; community package", "Bengkel; pakej komuniti")],
    [B("NGOs and community learning centres", "NGO dan pusat pembelajaran komuniti"), B("Community workshops and W2W enterprise ideas", "Bengkel komuniti dan idea perusahaan W2W"), B("Workshop; Eco-Club", "Bengkel; Kelab Eko")],
    [B("Training providers", "Penyedia latihan"), B("Sustainability and ESG courses", "Kursus kelestarian dan ESG"), B("Adult half-day; Practitioner", "Separuh hari dewasa; Pengamal")],
    [B("Companies and green-technology organisations", "Syarikat dan organisasi teknologi hijau"), B("Staff ESG training; CSR programmes with schools", "Latihan ESG kakitangan; program CSR bersama sekolah"), B("Adult half-day; Practitioner", "Separuh hari dewasa; Pengamal")]])}
  ${h3(B("Packages", "Pakej"))}
  ${tbl([B("Package", "Pakej"), B("What it includes", "Kandungan")], [
    [B("📱 Interactive digital learning module", "📱 Modul pembelajaran digital interaktif"), B("This website: Learn chapters, games, simulations, labs, Class Battle, certificates.", "Laman web ini: bab Belajar, permainan, simulasi, makmal, Pertandingan Kelas, sijil.")],
    [B("🏫 School environmental education toolkit", "🏫 Kit pendidikan alam sekitar sekolah"), B("60-minute lesson, Eco-Club plan, rubrics, reflection worksheet, safety checklist.", "Pelajaran 60 minit, rancangan Kelab Eko, rubrik, lembaran refleksi, senarai semak keselamatan.")],
    [B("🎒 Sustainability educational package", "🎒 Pakej pendidikan kelestarian"), B("Workshop with facilitator, lab materials and certificates.", "Bengkel dengan fasilitator, bahan makmal dan sijil.")],
    [B("💼 ESG training module", "💼 Modul latihan ESG"), B("Adult half-day and the proposed 20-hour Practitioner micro-credential.", "Separuh hari dewasa dan mikro-kredensial Pengamal 20 jam yang dicadangkan.")],
    [B("🏘️ Community sustainability learning package", "🏘️ Pakej pembelajaran kelestarian komuniti"), B("Workshop plus community labs (compost, eco-enzyme, ecobricks).", "Bengkel serta makmal komuniti (kompos, eko-enzim, bata eko).")]])}
  <p class="small">${todo(B("prices, booking contact and terms for each package", "harga, hubungan tempahan dan terma bagi setiap pakej"))}</p>`;
}

/* ---------- (i) credits ---------- */
const AUTHORS = ["Wan Azlina Wan Ab Karim Ghani", "Shafreeza Sobri", "Izzudin Ismail", "Nur Syakina Jamali", "Mohd Faiz Gunam Rasul", "Salmiaton Ali"];
const REFS = [
  "Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). <i>A taxonomy for learning, teaching, and assessing</i>. Longman.",
  "Bernama. (2025, September 9). Malaysia hopes EPR will stem tide of plastic waste.",
  "Global Reporting Initiative. (2020). <i>GRI 306: Waste 2020</i>.",
  "Kementerian Pendidikan Malaysia. <i>Dokumen Standard Kurikulum dan Pentaksiran (DSKP)</i>: KSSR Sains; KSSM Sains Tingkatan 2; KSSM Reka Bentuk dan Teknologi Tingkatan 1.",
  "Kolb, D. A. (1984). <i>Experiential learning: Experience as the source of learning and development</i>. Prentice Hall.",
  "Malaysian Qualifications Agency. (2017). <i>Malaysian Qualifications Framework</i> (2nd ed.).",
  "Malaysian Qualifications Agency. (2020). <i>Guidelines to Good Practices: Micro-credentials</i>.",
  "Malaysian Qualifications Agency. (2023). <i>Guidelines to Good Practices: Quality Verification of Stand-Alone Micro-credentials</i>.",
  "Solid Waste and Public Cleansing Management Act 2007 (Act 672).",
  "The Star. (2024, January 2). SWCorp data on Malaysia's solid waste generation and composition.",
  "United Nations. (2015). <i>Transforming our world: the 2030 Agenda for Sustainable Development</i> (A/RES/70/1).",
  "Universiti Malaysia Sabah. (n.d.). <i>Garis Panduan Micro-Credential</i>. Pusat Pembangunan dan Kecemerlangan Akademik.",
  "Universiti Pendidikan Sultan Idris. (n.d.). <i>Garis Panduan Micro-Credentials UPSI</i>."
];
function credits() {
  const P24 = [["Group 1", "Eco-Elevate: Plastic's Green Revolution in Vertical Garden", "watering"], ["Group 2", "Transforming Plastic Waste into Wax Products (idea adapted; the engine-oil method is not used)", "candle"],
    ["Group 4", "Plastic is Valuable: tote bags and sleeping bags from used plastic bags and bubble wrap", "treasure"], ["Group 5", "“Orange Peel” bags", "treasure"],
    ["Group 7", "Sustainable umbrellas and tote bags from plastic waste", "treasure"], ["Group 10", "PLASTREE: When Plastics Come to Life!", "bioplastic"]];
  const P25 = [["Group 1", "EcoPlay & Glow: Grease to Greatness (scented candle from used cooking oil)", "candle"], ["—", "Ecobrick and tote bag prototype", "ecobrick"], ["Group 9", "Composting process", "compost"]];
  return `${h3(B("Authors", "Pengarang"))}
  <p><b>${AUTHORS.join(", ")}</b><br>${B("Faculty of Engineering, Universiti Putra Malaysia", "Fakulti Kejuruteraan, Universiti Putra Malaysia")}</p>
  ${h3(B("Acknowledgements", "Penghargaan"))}
  <p>${B("Many activities grew from projects by UPM students in ENG3104: proposals in 2024 and prototypes in 2025. Their ideas were checked, made safe and adapted for this module.", "Banyak aktiviti berkembang daripada projek pelajar UPM dalam ENG3104: cadangan pada 2024 dan prototaip pada 2025. Idea mereka telah disemak, dijadikan selamat dan disesuaikan untuk modul ini.")}</p>
  ${tbl([B("Cohort", "Kohort"), B("Project", "Projek"), B("Became", "Menjadi")], [...P24.map(p => [`2024 · ${p[0]}`, E(p[1]), lab(p[2])]), ...P25.map(p => [`2025 · ${p[0]}`, E(p[1]), lab(p[2])])])}
  <p class="small">${todo(B("add student names (with their consent), the 2024 Group 9 title and the remaining 2025 groups", "tambah nama pelajar (dengan kebenaran mereka), tajuk Kumpulan 9 2024 dan kumpulan 2025 yang lain"))}</p>
  ${h3(B("How to cite", "Cara memetik"))}
  <p class="th-cite">Wan Ab Karim Ghani, W. A., Sobri, S., Ismail, I., Jamali, N. S., Gunam Rasul, M. F., & Ali, S. (2026). <i>WasteQuest: Waste-to-Wealth (W2W) educational module</i> [Interactive web module]. Universiti Putra Malaysia, Faculty of Engineering. https://wastequest.github.io/</p>
  ${h3(B("References", "Rujukan"))}
  <ol class="th-refs">${REFS.map(r => `<li>${r}</li>`).join("")}</ol>`;
}

/* ---------- sections ---------- */
const SEC = [
  { id: "overview", icon: "📋", en: "Overview & outcomes", bm: "Gambaran & hasil", html: overview },
  { id: "plans", icon: "🗓️", en: "Session plans", bm: "Rancangan sesi", html: plans },
  { id: "credential", icon: "🎓", en: "Credentials", bm: "Kredensial", html: credential },
  { id: "safety", icon: "🦺", en: "Safety", bm: "Keselamatan", html: safety },
  { id: "rubrics", icon: "📝", en: "Rubrics & reflection", bm: "Rubrik & refleksi", html: rubrics },
  { id: "curriculum", icon: "🏫", en: "Curriculum links", bm: "Pautan kurikulum", html: curriculum },
  { id: "class", icon: "🏟️", en: "Running Class Battle", bm: "Mengendalikan Pertandingan Kelas", html: classBattle },
  { id: "users", icon: "🤝", en: "Who can use it", bm: "Siapa boleh guna", html: users },
  { id: "credits", icon: "🙏", en: "Credits & citation", bm: "Penghargaan & petikan", html: credits }
];
const TITLE = { en: "Teacher Hub", bm: "Hab Guru" }, SUB = { en: "Plans, outcomes, safety, rubrics and credentials for running WasteQuest.", bm: "Rancangan, hasil pembelajaran, keselamatan, rubrik dan kredensial untuk melaksanakan WasteQuest." };

WQ.css("teacher", `
.th-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}
.th-tabs a{display:inline-flex;align-items:center;gap:6px;background:#fff;border-radius:999px;padding:7px 14px;font-weight:800;text-decoration:none;color:var(--ink);box-shadow:var(--shadow);font-size:.95rem}
.th-tabs a[aria-current]{background:var(--ink);color:#fff}
.th-bar{margin:0 0 14px}
.th-sec h2,.th-psec h2{font-size:1.6rem;margin-bottom:8px}
.th-h3{font-size:1.2rem;margin:18px 0 8px}
.th-lead{font-size:1.05rem}
.th-note{margin:12px 0}
.th-tbl{font-size:.92rem}.th-tbl td:first-child{min-width:7em}
.th-rub td,.th-risk td{min-width:9em}.th-rub td:first-child{min-width:8em}
.th-chip{display:inline-block;margin:2px 3px 2px 0;padding:1px 8px;border-radius:999px;background:#e8f1fd;color:var(--blue);font-weight:800;font-size:.82rem;text-decoration:none}
.th-chip.g{background:#eafbe4;color:var(--grass-d)}.th-chip.p{background:#fff1d6;color:#9a5b00}
.th-grid4{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));margin:6px 0 14px}
.th-pillar{display:flex;flex-direction:column;gap:2px;background:var(--soft);border-radius:16px;padding:12px 14px}.th-pillar>span:first-child{font-size:1.8rem}
.th-ul,.th-ol{margin:6px 0;padding-left:1.4em}.th-ul li,.th-ol li{margin:4px 0}
.th-plan{border-top:2px dashed var(--line);padding-top:6px;margin-top:14px}.th-plan:first-of-type{border-top:0}
.th-check{list-style:none;padding:0;margin:6px 0;display:grid;gap:6px}
.th-check li{background:var(--soft);border-radius:12px;padding:8px 12px}.th-check label{display:flex;gap:10px;align-items:flex-start;cursor:pointer}
.th-check input{width:20px;height:20px;flex:none;margin-top:2px;accent-color:var(--grass-d)}
.th-box{display:inline-block;width:14px;height:14px;border:2px solid var(--ink);border-radius:3px;margin-right:10px;vertical-align:-2px}
.th-stars{font-size:1.5rem;letter-spacing:.2em;color:var(--gold)}
.th-sheet{border:2px solid var(--line);border-radius:16px;padding:6px 16px 14px;margin-top:18px}
.th-wq{margin:10px 0}.th-wq b{display:block}
.th-line{display:block;border-bottom:1px solid #9aa5b1;height:30px}
.th-cite{background:var(--soft);border-radius:12px;padding:10px 14px;font-size:.95rem}
.th-refs{font-size:.9rem;padding-left:1.4em}.th-refs li{margin:3px 0}
.th-foot{margin-top:14px}
.th-print .th-psec+.th-psec{break-before:page}
@media print{
  .th-sec{box-shadow:none;border:0;padding:0;break-inside:auto}
  .th-tbl{font-size:9.5pt}.tablewrap{overflow:visible}
  .th-tbl tr,.th-pillar,.th-note,.th-wq,.th-check li,.th-ol li{break-inside:avoid}
  .th-tbl thead{display:table-header-group}
  .th-h3,.th-sec h2,.th-psec h2{break-after:avoid}
  .th-chip{background:none;padding:0;color:var(--ink);border:0}
  .th-sheet{break-before:page;break-inside:avoid;border:0;padding:0}
  .th-print .th-sheet{break-before:auto}
  .th-line{height:26px}
}`);

/* ---------- page ---------- */
WQ.registerPage("teacher", { mount(el, { args }) {
  const id = args && args[0], all = id === "all", s = SEC.find(x => x.id === id) || SEC[0];
  const tabs = `<nav class="th-tabs noprint" aria-label="${B("Teacher Hub sections", "Bahagian Hab Guru")}">${SEC.map(x => `<a href="#/teacher/${x.id}" ${!all && x === s ? 'aria-current="page"' : ""}><span aria-hidden="true">${x.icon}</span> ${B(x.en, x.bm)}</a>`).join("")}<a href="#/teacher/all" ${all ? 'aria-current="page"' : ""}><span aria-hidden="true">📚</span> ${B("All sections", "Semua bahagian")}</a></nav>`;
  const bar = `<div class="row noprint th-bar"><button class="btn blue" data-print>🖨️ ${all ? B("Print the full guide", "Cetak panduan penuh") : B("Print this section", "Cetak bahagian ini")}</button>${all ? "" : `<a class="btn alt" href="#/teacher/all">📚 ${B("Show all sections", "Papar semua bahagian")}</a>`}</div>`;
  const aud = WQ.aud !== "teacher" ? `<p class="note small noprint">${B("Tip: choose <b>Teacher</b> on the home page to see teaching notes inside the Learn chapters.", "Tip: pilih <b>Guru</b> di halaman utama untuk melihat nota pengajaran dalam bab Belajar.")}</p>` : "";
  el.innerHTML = `<div class="th-wrap">${WQ.head("🧑‍🏫", TITLE, SUB)}${tabs}${aud}${bar}${all ? `<div class="th-allbox"></div>` : `<section class="card th-sec" aria-labelledby="th-h"><h2 id="th-h"><span aria-hidden="true">${s.icon}</span> ${B(s.en, s.bm)}</h2>${s.html(false)}</section>`}</div>`;
  if (all) WQ.renderTeacherPrint(el.querySelector(".th-allbox"));
  el.querySelector("[data-print]").onclick = () => window.print();
}});

/* ---------- print booklet: every section, static ---------- */
WQ.renderTeacherPrint = el => {
  el.innerHTML = `<div class="th-print">${SEC.map(s => `<section class="th-psec"><h2><span aria-hidden="true">${s.icon}</span> ${B(s.en, s.bm)}</h2>${s.html(true)}</section>`).join("")}</div>`;
};
})();
