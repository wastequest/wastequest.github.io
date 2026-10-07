/* Myth or Fact? — swipe cards (the old "Yes or No" game, improved). Drag left = Myth, right = Fact,
   or use the buttons or ←/→ keys. Rounds of 10 (5 myths + 5 facts) chosen for the current audience. */
// SOURCES:
// - Malaysian waste data (39,078 t/day 2024, 1.17 kg/person/day, ~19,000 t/day 2005, household composition incl. food 30.6%,
//   plastic 21.9%, paper 15.3%, diapers 8.2%, glass 2.7%, face masks 0.7%), SWCorp bin colours, Act 672 adopting states:
//   SWCorp via The Star, 2 Jan 2024 (see SPEC.md).
// - Resin identification codes 1–7: ASTM D7611. PET (1) and HDPE (2) most widely recycled: US EPA, "Plastics: Material-Specific Data".
// - PLA needs industrial composting (EN 13432, ~58 °C): European Bioplastics, "Bioplastics – facts and figures".
// - Mechanical recycling shortens polymer chains (downcycling): Schyns & Shaver (2021), Macromol. Rapid Commun. 42:2000415.
// - Compost >55 °C for several days reduces pathogens and weed seeds: US EPA 40 CFR Part 503, Appendix B (PFRP).
// - Methane GWP100 ≈ 27–30 × CO2: IPCC AR6 WG1 (2021), Table 7.15.
// - Eco-enzyme 1:3:10, ~3 months: Arun & Sivashanmugam (2015), Process Saf. Environ. Prot. 94:471–478. No peer-reviewed evidence
//   that eco-enzyme cures disease or cleans rivers; adding sugary organic liquid raises biochemical oxygen demand (BOD).
// - Aluminium recycling saves ~95% of the energy of primary production: The Aluminum Association.
// - Paper fibres recycled ~5–7 times: US EPA / American Forest & Paper Association (also used in sort.js).
// - Biodiesel from used cooking oil by transesterification: standard chemistry (e.g. IEA Bioenergy).
// - Waste hierarchy (prevent > reuse > recycle > recover > dispose): EU Waste Framework Directive 2008/98/EC, Art. 4.
(() => {
const T={
 en:{myth:"Myth",fact:"Fact",hint:"Drag the card left for Myth or right for Fact. You can also use the buttons or the ← → keys.",
  good:["Correct!","Well done!","You got it!","Spot on!"],bad:"Not quite!",itsF:"It's a FACT",itsM:"It's a MYTH",next:"Next →",see:"See my score",
  endT:"Round complete!",endS:s=>`You got ${s} out of 10 right.`,goal:"Get 8 or more to earn the Myth Buster badge!",review:"Review the cards",
  you:"You said",again:"Play again",map:"All games",best:"Best",
  tip:"Teaching tip: before each swipe, the class votes with thumbs left (myth) or right (fact). Discuss the explanation before moving on."},
 bm:{myth:"Mitos",fact:"Fakta",hint:"Seret kad ke kiri untuk Mitos atau ke kanan untuk Fakta. Anda juga boleh guna butang atau kekunci ← →.",
  good:["Betul!","Syabas!","Tepat sekali!","Hebat!"],bad:"Belum tepat!",itsF:"Ini FAKTA",itsM:"Ini MITOS",next:"Seterusnya →",see:"Lihat markah saya",
  endT:"Pusingan tamat!",endS:s=>`Anda betul ${s} daripada 10.`,goal:"Dapatkan 8 atau lebih untuk lencana Pembongkar Mitos!",review:"Ulang kaji kad",
  you:"Jawapan anda",again:"Main lagi",map:"Semua permainan",best:"Terbaik",
  tip:"Tip pengajaran: sebelum setiap leretan, kelas mengundi dengan ibu jari ke kiri (mitos) atau ke kanan (fakta). Bincangkan penerangan sebelum meneruskan."}
};
// [audiences k/t/a, emoji, 1=fact 0=myth, statement en, statement bm, why en, why bm]
const S=[
 ["kta","🗑️",1,"In Malaysia, the blue recycling bin is for paper.","Di Malaysia, tong kitar semula biru adalah untuk kertas.",
  "SWCorp bins: blue for paper, orange for plastic and aluminium or other metal, brown for glass.","Tong SWCorp: biru untuk kertas, oren untuk plastik dan aluminium atau logam lain, coklat untuk kaca."],
 ["kt","🫙",0,"Glass bottles go in the orange bin.","Botol kaca dimasukkan ke dalam tong oren.",
  "Glass goes in the brown bin. The orange bin is for plastic and aluminium or other metal.","Kaca dimasukkan ke dalam tong coklat. Tong oren adalah untuk plastik dan aluminium atau logam lain."],
 ["kta","🍕",0,"A greasy pizza box can go into the paper recycling bin as it is.","Kotak piza yang berminyak boleh terus dimasukkan ke dalam tong kitar semula kertas.",
  "Oil and food spoil paper recycling. Tear off the clean parts for the blue bin; the greasy parts go in general waste.","Minyak dan makanan merosakkan kitar semula kertas. Koyakkan bahagian yang bersih untuk tong biru; bahagian berminyak dibuang sebagai sisa am."],
 ["k","🔋",0,"Old batteries can go in the normal rubbish bin.","Bateri lama boleh dibuang ke dalam tong sampah biasa.",
  "Batteries contain harmful metals and chemicals. Take them to an e-waste collection point.","Bateri mengandungi logam dan bahan kimia berbahaya. Hantar ke pusat kutipan e-sisa."],
 ["kt","🚿",1,"Rinsing bottles and cans before recycling them helps.","Membilas botol dan tin sebelum dikitar semula membantu.",
  "Food and drink left inside make other recyclables dirty and smelly. A quick rinse is enough.","Sisa makanan dan minuman di dalamnya mengotorkan bahan kitar semula lain dan menyebabkan bau. Bilas sekejap sudah memadai."],
 ["ta","⚖️",0,"Under Act 672, separating waste at source is compulsory in every Malaysian state.","Di bawah Akta 672, pengasingan sisa di punca diwajibkan di semua negeri di Malaysia.",
  "It is compulsory only where Act 672 was adopted: Johor, Melaka, Negeri Sembilan, Pahang, Perlis, Kedah, Kuala Lumpur and Putrajaya. Selangor is working towards adopting the Act in phases; the start date is not yet confirmed, so check your council's rules.","Ia hanya wajib di kawasan yang menerima pakai Akta 672: Johor, Melaka, Negeri Sembilan, Pahang, Perlis, Kedah, Kuala Lumpur dan Putrajaya. Selangor sedang berusaha menerima pakai Akta ini secara berperingkat; tarikh mula belum disahkan, jadi semak peraturan pihak berkuasa tempatan anda."],
 ["kta","🍚",1,"Food is the biggest part of Malaysian household waste.","Makanan ialah bahagian terbesar sisa domestik Malaysia.",
  "Food makes up 30.6% of household waste, more than plastic (21.9%) or paper (15.3%) (SWCorp, 2024).","Makanan merangkumi 30.6% sisa domestik, lebih banyak daripada plastik (21.9%) atau kertas (15.3%) (SWCorp, 2024)."],
 ["ta","📈",1,"Malaysia generates about 39,000 tonnes of solid waste every day.","Malaysia menghasilkan kira-kira 39,000 tan sisa pepejal setiap hari.",
  "About 39,078 tonnes a day in 2024, or about 1.17 kg per person per day (SWCorp).","Kira-kira 39,078 tan sehari pada tahun 2024, atau kira-kira 1.17 kg seorang sehari (SWCorp)."],
 ["k","🧍",1,"Each person in Malaysia throws away more than 1 kg of rubbish every day.","Setiap orang di Malaysia membuang lebih daripada 1 kg sampah setiap hari.",
  "It is about 1.17 kg per person per day. In a week, that is more than a 5 kg bag of rice!","Kira-kira 1.17 kg seorang sehari. Dalam seminggu, itu lebih berat daripada sekampit beras 5 kg!"],
 ["ta","📊",1,"Malaysia's daily solid waste has roughly doubled since 2005.","Sisa pepejal harian Malaysia meningkat kira-kira dua kali ganda sejak tahun 2005.",
  "It rose from about 19,000 tonnes a day in 2005 to more than 39,000 tonnes a day in 2024 (SWCorp).","Ia meningkat daripada kira-kira 19,000 tan sehari pada tahun 2005 kepada lebih 39,000 tan sehari pada tahun 2024 (SWCorp)."],
 ["ta","👶",1,"Disposable diapers make up a bigger share of Malaysian household waste than glass does.","Lampin pakai buang merangkumi bahagian sisa domestik Malaysia yang lebih besar daripada kaca.",
  "Diapers are 8.2% of household waste; glass is only 2.7% (SWCorp, 2024).","Lampin merangkumi 8.2% sisa domestik; kaca hanya 2.7% (SWCorp, 2024)."],
 ["kt","🪞",0,"A broken mirror goes in the brown glass bin.","Cermin pecah dimasukkan ke dalam tong kaca coklat.",
  "Mirror glass has a coating, so it is not recycled with bottles and jars. Wrap it safely and put it in general waste.","Kaca cermin bersalut, jadi ia tidak dikitar bersama botol dan balang. Balut dengan selamat dan buang sebagai sisa am."],
 ["kta","🍳",0,"Used cooking oil can be poured down the sink.","Minyak masak terpakai boleh dituang ke dalam sinki.",
  "Oil blocks drains and pollutes rivers. Collect it in a bottle for a used-oil collector, or turn it into candles with an adult.","Minyak menyumbat longkang dan mencemarkan sungai. Kumpulkan dalam botol untuk pengumpul minyak terpakai, atau jadikan lilin dengan bantuan orang dewasa."],
 ["kt","🧴",0,"A plastic bottle rots away in a few weeks, just like a banana peel.","Botol plastik reput dalam beberapa minggu, sama seperti kulit pisang.",
  "Plastic does not rot like food. It slowly breaks into tiny pieces called microplastics that can stay in nature for a very long time.","Plastik tidak reput seperti makanan. Ia perlahan-lahan pecah menjadi kepingan kecil yang dipanggil mikroplastik yang boleh kekal dalam alam sekitar untuk masa yang sangat lama."],
 ["ta","♻️",1,"The number in the recycling triangle on plastic tells you the type of plastic, not that it will be recycled.","Nombor dalam segi tiga kitar semula pada plastik menunjukkan jenis plastik, bukan bahawa ia pasti dikitar semula.",
  "It is the resin identification code (1 to 7). Whether an item is recycled depends on local collection and buyers.","Ia ialah kod pengenalan resin (1 hingga 7). Sama ada barang itu dikitar semula bergantung pada kutipan dan pembeli tempatan."],
 ["ta","💧",1,"Most bottled-water bottles are made of PET, resin code 1.","Kebanyakan botol air mineral diperbuat daripada PET, kod resin 1.",
  "PET (polyethylene terephthalate) is light and clear, and it is one of the most widely recycled plastics.","PET (polietilena tereftalat) ringan dan jernih, dan ia antara plastik yang paling banyak dikitar semula."],
 ["t","🧪",0,"PVC (resin code 3) is the easiest plastic to recycle.","PVC (kod resin 3) ialah plastik yang paling mudah dikitar semula.",
  "PET (1) and HDPE (2) are the most widely recycled. PVC contains chlorine and many additives, so it is rarely recycled.","PET (1) dan HDPE (2) paling banyak dikitar semula. PVC mengandungi klorin dan banyak bahan tambah, jadi ia jarang dikitar semula."],
 ["kt","🛍️",1,"Bringing your own bag is even better than recycling plastic bags.","Membawa beg sendiri lebih baik daripada mengitar semula beg plastik.",
  "Reduce and reuse come before recycling. The best waste is the waste you never make.","Kurangkan dan guna semula didahulukan sebelum kitar semula. Sisa terbaik ialah sisa yang tidak dihasilkan langsung."],
 ["ta","🌽",0,"All bioplastics break down quickly in a home compost bin or in the sea.","Semua bioplastik terurai dengan cepat dalam tong kompos rumah atau di laut.",
  "Many bioplastics, such as PLA, need industrial composting at high temperatures. Some plant-based plastics do not biodegrade at all.","Banyak bioplastik, seperti PLA, memerlukan pengkomposan industri pada suhu tinggi. Sesetengah plastik berasaskan tumbuhan tidak terbiodegradasi langsung."],
 ["ta","🔁",0,"Plastic can be recycled again and again forever without losing quality.","Plastik boleh dikitar semula berulang kali selama-lamanya tanpa hilang kualiti.",
  "Each round of mechanical recycling shortens the polymer chains, so plastic is usually downcycled after a few rounds. Glass and metal hold up much better.","Setiap pusingan kitar semula mekanikal memendekkan rantai polimer, jadi plastik biasanya menjadi produk bermutu lebih rendah selepas beberapa pusingan. Kaca dan logam jauh lebih tahan."],
 ["kt","🪱",1,"Worms can help turn food scraps into compost.","Cacing boleh membantu menukar sisa makanan menjadi kompos.",
  "Composting worms eat food scraps and leave behind rich worm castings. This is called vermicomposting.","Cacing kompos memakan sisa makanan dan menghasilkan tahi cacing yang subur. Ini dipanggil vermikompos."],
 ["kta","🍖",0,"Meat and fish scraps are best put in an open compost heap at home.","Sisa daging dan ikan paling sesuai dimasukkan ke dalam timbunan kompos terbuka di rumah.",
  "They smell and attract rats, flies and stray animals. Keep open heaps to fruit, vegetable and garden waste. Fish waste can become pet food instead.","Ia berbau dan menarik tikus, lalat dan haiwan liar. Timbunan terbuka hanya untuk sisa buah, sayur dan taman. Sisa ikan boleh dijadikan makanan haiwan peliharaan."],
 ["kt","🍂",1,"Compost needs both 'greens' like food scraps and 'browns' like dry leaves.","Kompos memerlukan bahan 'hijau' seperti sisa makanan dan bahan 'perang' seperti daun kering.",
  "Greens give nitrogen and browns give carbon. A good mix keeps the microbes healthy and stops bad smells.","Bahan hijau membekalkan nitrogen dan bahan perang membekalkan karbon. Campuran yang baik memastikan mikrob sihat dan mengelakkan bau busuk."],
 ["ta","🌡️",1,"A well-built compost heap can heat itself up to 55 °C or more.","Timbunan kompos yang dibina dengan baik boleh menjadi panas sendiri hingga 55 °C atau lebih.",
  "Heat-loving (thermophilic) microbes release heat as they work. Several days above 55 °C helps kill weed seeds and germs.","Mikrob termofilik (suka haba) membebaskan haba semasa bekerja. Beberapa hari melebihi 55 °C membantu membunuh biji rumpai dan kuman."],
 ["ta","🏔️",0,"Food rotting in a landfill is harmless because it is natural.","Makanan yang reput di tapak pelupusan tidak berbahaya kerana ia semula jadi.",
  "Without oxygen, rotting food makes methane, a greenhouse gas about 27 to 30 times stronger than CO₂ over 100 years, plus polluted leachate.","Tanpa oksigen, makanan yang reput menghasilkan metana, gas rumah hijau kira-kira 27 hingga 30 kali lebih kuat daripada CO₂ dalam tempoh 100 tahun, serta larut resap yang tercemar."],
 ["kta","🍊",1,"Eco-enzyme is made from fruit or vegetable peels, sugar and water.","Eko-enzim dibuat daripada kulit buah atau sayur, gula dan air.",
  "The usual recipe is 1 part brown sugar, 3 parts peels and 10 parts water, fermented for about 3 months.","Resipi biasa ialah 1 bahagian gula perang, 3 bahagian kulit dan 10 bahagian air, ditapai selama kira-kira 3 bulan."],
 ["k","🥤",0,"You can drink eco-enzyme like a fruit juice.","Eko-enzim boleh diminum seperti jus buah.",
  "Eco-enzyme is for cleaning and gardening only. Never drink it.","Eko-enzim hanya untuk membersih dan berkebun. Jangan sekali-kali meminumnya."],
 ["ta","💊",0,"Eco-enzyme is a proven medicine that can cure diseases.","Eko-enzim ialah ubat yang terbukti boleh menyembuhkan penyakit.",
  "There is no scientific evidence for this. Use eco-enzyme only as a diluted cleaner or garden liquid, and never drink it.","Tiada bukti saintifik untuk dakwaan ini. Gunakan eko-enzim hanya sebagai pembersih atau cecair taman yang dicairkan, dan jangan sekali-kali meminumnya."],
 ["ta","🏞️",0,"Pouring lots of eco-enzyme into a polluted river will clean the whole river.","Menuang banyak eko-enzim ke dalam sungai yang tercemar akan membersihkan seluruh sungai.",
  "There is little scientific evidence for this. Large amounts of sugary, acidic liquid can even use up the oxygen that fish need. Stopping pollution at the source works better.","Bukti saintifik untuk dakwaan ini sangat sedikit. Cecair berasid dan bergula dalam jumlah besar boleh menghabiskan oksigen yang diperlukan ikan. Menghentikan pencemaran di punca lebih berkesan."],
 ["kt","💨",1,"A new eco-enzyme bottle needs its lid opened now and then in the first month.","Botol eko-enzim yang baharu perlu dibuka penutupnya sekali-sekala pada bulan pertama.",
  "Fermentation makes gas. Let it out carefully, with an adult's help, so the bottle does not bulge or burst.","Penapaian menghasilkan gas. Lepaskan gas dengan berhati-hati, dengan bantuan orang dewasa, supaya botol tidak mengembung atau pecah."],
 ["kt","🥬",1,"Red cabbage juice can tell you if something is an acid or an alkali.","Jus kubis ungu boleh menunjukkan sama ada sesuatu bahan berasid atau beralkali.",
  "It turns pink in acids like vinegar and green-blue in alkalis like soapy water.","Ia bertukar merah jambu dalam asid seperti cuka dan hijau kebiruan dalam alkali seperti air sabun."],
 ["t","🧂",0,"Vinegar is an alkali.","Cuka ialah alkali.",
  "Vinegar is an acid. It contains acetic acid and has a pH of around 2 to 3.","Cuka ialah asid. Ia mengandungi asid asetik dan mempunyai pH sekitar 2 hingga 3."],
 ["ta","⚗️",1,"A pH of 7 is neutral: neither acidic nor alkaline.","pH 7 adalah neutral: tidak berasid dan tidak beralkali.",
  "Below 7 is acidic and above 7 is alkaline. Pure water at 25 °C has a pH of 7.","Bawah 7 berasid dan atas 7 beralkali. Air tulen pada 25 °C mempunyai pH 7."],
 ["kta","☕",1,"Dried coffee grounds can be used to absorb bad smells.","Hampas kopi kering boleh digunakan untuk menyerap bau busuk.",
  "Dry them fully first so they don't grow mould, then put them in a cloth bag in the fridge or in shoes.","Keringkan sepenuhnya dahulu supaya tidak berkulat, kemudian masukkan ke dalam uncang kain di dalam peti sejuk atau kasut."],
 ["a","🔄",0,"In a circular economy, recycling is the first and best option.","Dalam ekonomi kitaran, kitar semula ialah pilihan pertama dan terbaik.",
  "Designing out waste, reducing and reusing come first. Recycling is valuable but sits lower in the waste hierarchy because it still uses energy and loses material.","Mereka bentuk tanpa sisa, mengurangkan dan mengguna semula didahulukan. Kitar semula bernilai tetapi berada lebih rendah dalam hierarki sisa kerana ia masih menggunakan tenaga dan kehilangan bahan."],
 ["a","🏷️",0,"A label that says 'eco-friendly' proves a product is better for the environment.","Label 'mesra alam' membuktikan sesuatu produk lebih baik untuk alam sekitar.",
  "Vague claims with no evidence can be greenwashing. Look for specific, checkable claims and recognised certification.","Dakwaan kabur tanpa bukti boleh menjadi 'greenwashing' (dakwaan hijau palsu). Cari dakwaan yang khusus dan boleh disemak serta pensijilan yang diiktiraf."],
 ["a","🎭",1,"Greenwashing means making a product or company seem greener than it really is.","'Greenwashing' bermaksud menjadikan sesuatu produk atau syarikat kelihatan lebih mesra alam daripada yang sebenarnya.",
  "Examples: vague words like 'natural', a small green feature hiding a big impact, or leaf images with no evidence.","Contohnya: perkataan kabur seperti 'semula jadi', ciri hijau yang kecil untuk menutup kesan yang besar, atau gambar daun tanpa bukti."],
 ["ta","📦",0,"If a package is made of 'recyclable' material, it will definitely be recycled.","Jika bungkusan diperbuat daripada bahan 'boleh dikitar semula', ia pasti akan dikitar semula.",
  "Recyclable is not the same as recycled. It must also be sorted, collected clean and bought by a recycler.","Boleh dikitar semula tidak sama dengan telah dikitar semula. Ia juga perlu diasingkan, dikutip dalam keadaan bersih dan dibeli oleh pengitar semula."],
 ["ta","⛽",1,"Used cooking oil can be made into biodiesel.","Minyak masak terpakai boleh dijadikan biodiesel.",
  "A chemical reaction called transesterification turns waste oil into fuel. That gives used oil real market value.","Tindak balas kimia yang dipanggil transesterifikasi menukar minyak sisa menjadi bahan api. Ini memberi minyak terpakai nilai pasaran sebenar."],
 ["ta","🥫",1,"Aluminium cans can be recycled again and again without losing quality.","Tin aluminium boleh dikitar semula berulang kali tanpa hilang kualiti.",
  "And recycling aluminium uses about 95% less energy than making new aluminium from ore.","Malah, mengitar semula aluminium menggunakan kira-kira 95% kurang tenaga berbanding menghasilkan aluminium baharu daripada bijih."],
 ["k","📰",0,"Paper can be recycled forever.","Kertas boleh dikitar semula selama-lamanya.",
  "Each time paper is recycled, its fibres get shorter. It can be recycled about 5 to 7 times.","Setiap kali kertas dikitar semula, seratnya menjadi lebih pendek. Ia boleh dikitar semula kira-kira 5 hingga 7 kali."],
 ["kta","😷",0,"Used face masks can go in the recycling bin.","Pelitup muka terpakai boleh dimasukkan ke dalam tong kitar semula.",
  "Masks are made of mixed materials and are unhygienic, so they go in general waste. They make up 0.7% of Malaysian household waste (SWCorp, 2024).","Pelitup muka diperbuat daripada bahan campuran dan tidak bersih, jadi ia dibuang sebagai sisa am. Ia merangkumi 0.7% sisa domestik Malaysia (SWCorp, 2024)."],
 ["k","🍌",0,"A banana peel can be thrown on the ground because it rots anyway.","Kulit pisang boleh dibuang di atas tanah kerana ia akan reput juga.",
  "It is still litter! Peels can take a long time to rot, look messy and attract pests. Put them in the compost or the bin.","Ia tetap sampah! Kulit pisang boleh mengambil masa yang lama untuk reput, kelihatan kotor dan menarik serangga perosak. Masukkan ke dalam kompos atau tong sampah."],
 ["kt","🧺",1,"Separating waste at home makes recycling easier and cleaner.","Mengasingkan sisa di rumah memudahkan kitar semula dan menjadikannya lebih bersih.",
  "Clean, sorted paper, plastic, metal and glass are worth more to recyclers, and less ends up in landfill.","Kertas, plastik, logam dan kaca yang bersih dan diasingkan lebih bernilai kepada pengitar semula, dan kurang sisa berakhir di tapak pelupusan."],
 ["a","💼",1,"Waste-to-wealth can turn a cost (waste disposal) into income.","Sisa kepada kekayaan boleh menukar kos (pelupusan sisa) menjadi pendapatan.",
  "Selling products such as compost, candles or collected used oil earns money, and less waste also means lower disposal costs.","Menjual produk seperti kompos, lilin atau minyak terpakai yang dikumpul menjana wang, dan kurang sisa bermakna kos pelupusan lebih rendah."],
 ["a","🏭",0,"Burning waste for energy is the same as recycling it.","Membakar sisa untuk tenaga adalah sama dengan mengitar semulanya.",
  "Waste-to-energy recovers heat, but the material is lost. In the waste hierarchy, energy recovery ranks below reuse and recycling.","Sisa kepada tenaga memulihkan haba, tetapi bahannya hilang. Dalam hierarki sisa, pemulihan tenaga berada di bawah guna semula dan kitar semula."]
];
const ROUND=10;
let deck=[], idx=0, score=0, ans=[], phase="ask", done=false, flyT=null;

WQ.css("myth",`
.my-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:4px 0 12px}
.my-meter{flex:1;min-width:120px;max-width:340px}
.my-stage{position:relative;max-width:440px;margin:0 auto;min-height:300px;display:grid}
.my-stage:before{content:"";position:absolute;inset:12px -6px -8px;background:#fff;border-radius:26px;opacity:.55;transform:rotate(-3deg);box-shadow:var(--shadow)}
.my-card{position:relative;z-index:2;background:#fff;border-radius:26px;box-shadow:var(--shadow);padding:30px 24px 26px;text-align:center;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab;border:4px solid transparent;display:flex;flex-direction:column;justify-content:center;gap:10px;min-height:300px}
.my-card.drag{cursor:grabbing;transition:none}.my-card.snap{transition:transform .3s,border-color .3s}
.my-card.fly{transition:transform .32s ease-in,opacity .32s}
.my-card.lf{border-color:var(--grass)}.my-card.lm{border-color:var(--red)}
.my-em{font-size:3.6rem;line-height:1}
.my-s{font-family:"Baloo 2";font-weight:800;font-size:clamp(1.2rem,3.2vw,1.55rem);line-height:1.25;margin:0}
.my-stamp{position:absolute;top:16px;font-family:"Baloo 2";font-weight:800;font-size:1.4rem;padding:2px 12px;border:4px solid;border-radius:10px;opacity:0;text-transform:uppercase;pointer-events:none}
.my-stamp.m{right:16px;color:var(--red);transform:rotate(12deg)}.my-stamp.f{left:16px;color:var(--grass-d);transform:rotate(-12deg)}
.my-btns{justify-content:center;margin:18px 0 6px}.my-btns .btn{min-width:150px;font-size:1.15rem;padding:13px 22px}
.my-hint{text-align:center;color:var(--muted);font-weight:600;font-size:.92rem;margin:6px auto;max-width:520px}
.my-why{cursor:default;touch-action:auto}.my-why.ok{border-color:var(--grass);background:#f2fcef}.my-why.no{border-color:var(--red);background:#fff4f5}
.my-why h2{font-size:1.6rem}.my-why .tag{font-size:.95rem;padding:4px 12px;align-self:center}
.my-why p{margin:0;font-weight:600}.my-why .my-q{color:var(--muted);font-style:italic;font-weight:600}
.my-end{max-width:760px;margin:0 auto;text-align:center}.my-stars{font-size:3rem;letter-spacing:6px}
.my-rev{display:grid;gap:10px;text-align:left;margin:14px 0;padding:0;list-style:none}
.my-rev li{background:var(--soft);border-radius:14px;padding:10px 14px;border-left:6px solid var(--grass)}.my-rev li.no{border-left-color:var(--red)}
.my-rev b{display:block}.my-rev p{margin:4px 0 0;font-size:.92rem}
`);

WQ.registerGame("myth",{order:5,kind:"game",icon:"🕵️",ages:"7+",
  title:{en:"Myth or Fact?",bm:"Mitos atau Fakta?"},
  desc:{en:"Swipe each card: is it a myth or a fact? Learn the real story behind each one.",bm:"Leret setiap kad: mitos atau fakta? Ketahui cerita sebenar di sebaliknya."},
  badge:{icon:"🕵️",name:{en:"Myth Buster",bm:"Pembongkar Mitos"},desc:{en:"Score 8/10 or more in Myth or Fact?",bm:"Dapatkan 8/10 atau lebih dalam Mitos atau Fakta?"}},
  mount(el,{relang}){
    const L=()=>T[WQ.lang], $=s=>el.querySelector(s), bm=WQ.lang==="bm";
    const st=i=>bm?S[i][4]:S[i][3], why=i=>bm?S[i][6]:S[i][5];
    el.innerHTML=WQ.head("🕵️",this.title,this.desc)+`${WQ.aud==="teacher"?`<p class="note small">${L().tip}</p>`:""}
      <div class="my-bar"><span class="pill">🃏 <span id="myProg"></span></span><div class="meter my-meter"><i id="myMeter"></i></div><span class="spacer"></span><span class="pill">✅ <span id="myScore"></span></span></div>
      <div id="myPlay"><div class="my-stage" id="myStage"></div><div id="myCtl"></div></div><div id="myEnd" hidden></div>`;
    function start(){
      const a=WQ.aud==="kids"?"k":WQ.aud==="teens"?"t":"a", pool=S.map((s,i)=>i).filter(i=>S[i][0].includes(a));
      const half=f=>WQ.shuffle(pool.filter(i=>S[i][2]===f)).slice(0,ROUND/2);
      deck=WQ.shuffle(half(1).concat(half(0)));idx=0;score=0;ans=[];phase="ask";done=false;clearTimeout(flyT);flyT=null;render();
    }
    function render(){
      $("#myPlay").hidden=done;$("#myEnd").hidden=!done;
      $("#myProg").textContent=`${Math.min(idx+1,deck.length)}/${deck.length}`;$("#myScore").textContent=score;
      $("#myMeter").style.width=(idx+(phase==="why"?1:0))/deck.length*100+"%";
      if(done) return showEnd();
      const i=deck[idx], l=L();
      if(phase==="ask"){
        $("#myStage").innerHTML=`<div class="my-card" id="myCard" role="group" aria-label="${WQ.esc(st(i))}"><span class="my-stamp f" id="myStF">${l.fact}</span><span class="my-stamp m" id="myStM">${l.myth}</span>
          <div class="my-em" aria-hidden="true">${S[i][1]}</div><p class="my-s">${WQ.esc(st(i))}</p></div>`;
        $("#myCtl").innerHTML=`<div class="row my-btns"><button class="btn red" id="myM">👈 ${l.myth}</button><button class="btn" id="myF">${l.fact} 👉</button></div><p class="my-hint">${l.hint}</p>`;
        $("#myM").onclick=()=>answer(0);$("#myF").onclick=()=>answer(1);
        drag($("#myCard"));
      }else{
        const ok=ans[idx]===S[i][2], g=l.good;
        $("#myStage").innerHTML=`<div class="my-card my-why ${ok?"ok":"no"}" role="status" aria-live="polite"><h2>${ok?"✅ "+g[idx%g.length]:"❌ "+l.bad}</h2>
          <span class="tag ${S[i][2]?"go":"red"}">${S[i][2]?l.itsF:l.itsM}</span><p class="my-q">“${WQ.esc(st(i))}”</p><p>${WQ.esc(why(i))}</p></div>`;
        $("#myCtl").innerHTML=`<div class="row my-btns"><button class="btn blue" id="myN">${idx+1<deck.length?l.next:l.see}</button></div>`;
        $("#myN").onclick=next;$("#myN").focus({preventScroll:true});
      }
    }
    function answer(f){
      if(phase!=="ask"||done||flyT) return;
      const i=deck[idx], ok=f===S[i][2], c=$("#myCard");
      ans[idx]=f; if(ok) score++; phase="why"; WQ.beep(ok);
      if(c){c.classList.remove("drag","snap");c.classList.add("fly",f?"lf":"lm");c.style.transform=`translateX(${f?130:-130}%) rotate(${f?24:-24}deg)`;c.style.opacity="0";}
      flyT=setTimeout(()=>{flyT=null;if(el.isConnected)render();},c?300:0);
    }
    function next(){
      if(phase!=="why") return; idx++; phase="ask";
      if(idx>=deck.length){done=true;WQ.best("myth",score);if(score>=8){if(!WQ.award("myth"))WQ.confetti();}}
      render();
    }
    function showEnd(){
      const l=L(), stars=score>=9?3:score>=7?2:1;
      $("#myEnd").innerHTML=`<div class="card my-end"><h2>${l.endT}</h2><div class="my-stars" aria-label="${stars}/3">${"⭐".repeat(stars)}${"☆".repeat(3-stars)}</div>
        <p><b>${l.endS(score)}</b> ${l.best}: ${WQ.best("myth")}/10</p>${score<8?`<p class="note warn">${l.goal}</p>`:""}
        <h3 style="margin-top:14px">${l.review}</h3><ul class="my-rev">${deck.map((i,k)=>{const ok=ans[k]===S[i][2];
          return `<li class="${ok?"":"no"}"><b>${ok?"✅":"❌"} ${S[i][1]} ${WQ.esc(st(i))}</b><p><span class="tag ${S[i][2]?"go":"red"}">${S[i][2]?l.itsF:l.itsM}</span> ${WQ.esc(why(i))}</p>${ok?"":`<p class="small muted">${l.you}: ${ans[k]?l.fact:l.myth}</p>`}</li>`;}).join("")}</ul>
        <div class="row" style="justify-content:center"><button class="btn" id="myA">${l.again}</button><a class="btn alt" href="#/games">${l.map}</a></div></div>`;
      $("#myA").onclick=start;
    }
    // swipe with Pointer Events: tilt + coloured border + stamp while dragging; release past the threshold to answer
    function drag(c){
      let sx=0, on=false, dx=0;
      const set=()=>{const p=Math.max(-1,Math.min(1,dx/110));c.style.transform=`translateX(${dx}px) rotate(${dx/16}deg)`;
        $("#myStF").style.opacity=Math.max(0,p);$("#myStM").style.opacity=Math.max(0,-p);c.classList.toggle("lf",p>.3);c.classList.toggle("lm",p<-.3);};
      c.addEventListener("pointerdown",e=>{if(phase!=="ask")return;on=true;sx=e.clientX;dx=0;try{c.setPointerCapture(e.pointerId);}catch(er){}c.classList.add("drag");c.classList.remove("snap");});
      c.addEventListener("pointermove",e=>{if(!on)return;dx=e.clientX-sx;set();});
      const end=()=>{if(!on)return;on=false;c.classList.remove("drag");
        if(Math.abs(dx)>Math.min(110,c.offsetWidth*.28)) answer(dx>0?1:0);
        else{c.classList.add("snap");dx=0;set();}};
      c.addEventListener("pointerup",end);c.addEventListener("pointercancel",end);
    }
    const key=e=>{if(phase!=="ask"||done||e.target.closest&&e.target.closest("input,textarea,select"))return;
      if(e.key==="ArrowLeft"){e.preventDefault();answer(0);}else if(e.key==="ArrowRight"){e.preventDefault();answer(1);}};
    document.addEventListener("keydown",key);
    if(relang&&deck.length) render(); else start();
    return ()=>{document.removeEventListener("keydown",key);if(flyT){clearTimeout(flyT);flyT=null;}};
  }});
})();
