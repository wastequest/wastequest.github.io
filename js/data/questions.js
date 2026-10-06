/* WasteQuest question bank → WQ.questions (format in SPEC.md). Read by quiz.js, cert.js and class.js.
   Authoring rule in this file: the FIRST answer listed is the correct one. At load time each question's
   answers are moved into a fixed (id-based) order and `c` is set, so every consumer sees varied positions.
   Tracks: k = kids, t = teens, a = adults. Run `node js/data/questions.js` to self-check the bank.

   SOURCES:
   - Malaysian waste figures (39,078 t/day, 1.17 kg/person/day, household composition, ~19,000 t/day in 2005):
     SWCorp via The Star, 2 Jan 2024 (as given in SPEC.md).
   - Act 672 states and SWCorp bin colours: SPEC.md (SWCorp).
   - Methane ≈ 28× CO2 over 100 years: IPCC Fifth Assessment Report (AR5), WG1 ch. 8, GWP100 for CH4 = 28.
   - Recycled aluminium saves up to ~95% of the energy of primary aluminium: The Aluminum Association / International Aluminium Institute.
   - Microplastics = pieces < 5 mm: US NOAA definition (2008 workshop).
   - SDG target 12.3 (halve per-capita global food waste at retail and consumer levels by 2030): UN SDG indicator framework.
   - Circular economy principles (eliminate waste and pollution; circulate products and materials; regenerate nature): Ellen MacArthur Foundation.
   - Open burning is an offence under s.29A Environmental Quality Act 1974 (Malaysia).
   - Bursa Malaysia Main Market Listing Requirements: listed issuers must include a sustainability statement in the annual report.
   - GHG Protocol Corporate Value Chain (Scope 3) Standard: "waste generated in operations" is Scope 3, category 5.
   - Eco-enzyme 1:3:10 sugar:peels:water, ~3 months, release gas: standard eco-enzyme method (Dr Rosukon Poompanvong); health/river-cleaning claims are not established by peer-reviewed evidence.
*/
(() => {
const W = typeof WQ !== "undefined" ? WQ : { questions: [] };
const TR = { k: "kids", t: "teens", a: "adults" };
// Q(id, tracks, topic, [q en, q bm], [[correct en, bm], [wrong en, bm], …], [why en, why bm])
const raw = [];
const Q = (id, tr, topic, q, a, why) => raw.push({ id, tr, topic, q, a, why });

/* ---------------- sorting, SWCorp bins, e-waste, hazardous ---------------- */
Q("s01","kt","sorting",["Which SWCorp recycling bin is for paper?","Tong kitar semula SWCorp yang manakah untuk kertas?"],
 [["Blue bin","Tong biru"],["Orange bin","Tong oren"],["Brown bin","Tong coklat"]],
 ["Blue is for paper. Orange is for plastic and metal. Brown is for glass.","Biru untuk kertas. Oren untuk plastik dan logam. Coklat untuk kaca."]);
Q("s02","kt","sorting",["Where does a clean, empty plastic bottle go?","Ke manakah botol plastik yang bersih dan kosong dibuang?"],
 [["Orange bin","Tong oren"],["Brown bin","Tong coklat"],["Blue bin","Tong biru"]],
 ["The orange bin is for plastic and metal, like bottles and cans.","Tong oren untuk plastik dan logam, seperti botol dan tin."]);
Q("s03","kt","sorting",["Which bin is for a glass jam jar?","Tong manakah untuk balang jem kaca?"],
 [["Brown bin","Tong coklat"],["Orange bin","Tong oren"],["Blue bin","Tong biru"]],
 ["Brown is for glass. Glass can be recycled again and again.","Coklat untuk kaca. Kaca boleh dikitar semula berulang kali."]);
Q("s04","kt","sorting",["An empty aluminium drink can goes into the…","Tin minuman aluminium yang kosong dimasukkan ke dalam…"],
 [["Orange bin","Tong oren"],["Brown bin","Tong coklat"],["Blue bin","Tong biru"]],
 ["Orange takes plastic AND metal, so cans go there too.","Tong oren menerima plastik DAN logam, jadi tin juga masuk ke situ."]);
Q("s05","k","sorting",["What should you do to a bottle before recycling it?","Apakah yang perlu dibuat pada botol sebelum dikitar semula?"],
 [["Empty it and rinse it","Kosongkan dan bilas"],["Fill it with sand","Isi dengan pasir"],["Break it into pieces","Pecahkan menjadi kepingan"]],
 ["Clean bottles keep other recycling clean too.","Botol yang bersih memastikan bahan kitar semula lain juga bersih."]);
Q("s06","kt","sorting",["Can used tissue paper go into the blue paper bin?","Bolehkah tisu terpakai dimasukkan ke dalam tong kertas biru?"],
 [["No: it is dirty and its fibres are too short","Tidak: ia kotor dan seratnya terlalu pendek"],["Yes: all paper can be recycled","Ya: semua kertas boleh dikitar semula"]],
 ["Used tissue is dirty, and its fibres are too short to make new paper. It goes in general waste.","Tisu terpakai kotor dan seratnya terlalu pendek untuk dijadikan kertas baharu. Ia dibuang sebagai sisa am."]);
Q("s07","kt","sorting",["Where should old batteries go?","Ke manakah bateri lama patut dihantar?"],
 [["A battery or e-waste collection point","Pusat kutipan bateri atau e-sisa"],["The normal rubbish bin at home","Tong sampah biasa di rumah"],["The compost heap in the garden","Timbunan kompos di kebun"]],
 ["Batteries have harmful metals inside, so they need a special collection point.","Bateri mengandungi logam berbahaya, jadi ia perlu dihantar ke pusat kutipan khas."]);
Q("s08","kt","sorting",["What should you do with expired medicine?","Apakah yang patut dibuat dengan ubat yang telah tamat tempoh?"],
 [["Return it to a pharmacy or clinic","Pulangkan ke farmasi atau klinik"],["Flush it down the toilet","Buang ke dalam tandas"],["Put it in the compost","Masukkan ke dalam kompos"]],
 ["Medicine in water can harm fish and people. Pharmacies and clinics dispose of it safely.","Ubat dalam air boleh membahayakan ikan dan manusia. Farmasi dan klinik melupuskannya dengan selamat."]);
Q("s09","kta","sorting",["Why is it important to separate waste at home?","Mengapakah penting untuk mengasingkan sisa di rumah?"],
 [["It keeps recyclables clean so they can really be recycled","Bahan kitar semula kekal bersih dan boleh benar-benar dikitar semula"],["It makes the rubbish heavier","Sampah menjadi lebih berat"],["It means rubbish lorries do not need to come","Lori sampah tidak perlu datang lagi"]],
 ["Mixed, dirty rubbish is hard to recycle. Sorting at home keeps paper, plastic, metal and glass clean.","Sampah bercampur dan kotor sukar dikitar semula. Mengasingkan di rumah memastikan kertas, plastik, logam dan kaca kekal bersih."]);
Q("s10","kt","sorting",["Where does a banana peel belong?","Ke manakah kulit pisang patut dibuang?"],
 [["Compost","Kompos"],["Blue paper bin","Tong kertas biru"],["Brown glass bin","Tong kaca coklat"]],
 ["Food scraps like banana peels rot down into compost, which feeds plants.","Sisa makanan seperti kulit pisang mereput menjadi kompos yang menyuburkan tanaman."]);
Q("s11","kt","sorting",["A mirror breaks. What is the right way to throw it away?","Cermin pecah. Apakah cara yang betul untuk membuangnya?"],
 [["Wrap it safely and put it in general waste","Balut dengan selamat dan buang sebagai sisa am"],["Put it in the brown bin with glass bottles","Masukkan ke dalam tong coklat bersama botol kaca"],["Put it in the compost","Masukkan ke dalam kompos"]],
 ["Mirror glass has a coating, so it is not recycled with bottles and jars. Wrap it so nobody gets cut.","Kaca cermin bersalut, jadi ia tidak dikitar bersama botol dan balang. Balutlah supaya tiada sesiapa terluka."]);
Q("s12","ta","sorting",["Why must lithium-ion batteries (phones, power banks) never go into general waste?","Mengapakah bateri litium-ion (telefon, power bank) tidak boleh dibuang sebagai sisa am?"],
 [["They can catch fire when crushed in lorries","Ia boleh terbakar apabila dihimpit dalam lori"],["They are too light for lorries to collect","Ia terlalu ringan untuk dikutip oleh lori"],["They melt harmlessly when it rains","Ia cair tanpa bahaya apabila hujan"]],
 ["Damaged lithium-ion cells can short-circuit and start fires. Take them to an e-waste collection point.","Sel litium-ion yang rosak boleh litar pintas dan mencetuskan kebakaran. Hantar ke pusat kutipan e-sisa."]);
Q("s13","ta","sorting",["Fluorescent lamps need special disposal because they contain…","Lampu kalimantang perlu dilupuskan secara khas kerana mengandungi…"],
 [["Mercury","Merkuri"],["Sugar","Gula"],["Salt","Garam"],["Iron","Besi"]],
 ["Mercury is toxic. A broken lamp releases mercury vapour, so lamps go to hazardous-waste collection.","Merkuri adalah toksik. Lampu yang pecah membebaskan wap merkuri, jadi lampu dihantar ke kutipan sisa berbahaya."]);
Q("s14","kt","sorting",["Old phones contain precious metals such as…","Telefon lama mengandungi logam berharga seperti…"],
 [["Gold and copper","Emas dan tembaga"],["Sand and salt","Pasir dan garam"],["Wood and paper","Kayu dan kertas"]],
 ["Phones have small amounts of gold, silver and copper. Recycling them saves these metals.","Telefon mengandungi sedikit emas, perak dan tembaga. Mengitar semulanya menjimatkan logam ini."]);
Q("s15","ta","sorting",["Which of these is household hazardous waste?","Antara berikut, yang manakah sisa berbahaya isi rumah?"],
 [["Paint thinner and pesticide containers","Pencair cat dan bekas racun perosak"],["Banana peels and other fruit scraps","Kulit pisang dan sisa buah lain"],["Old newspapers and magazines","Surat khabar dan majalah lama"],["Empty, rinsed glass jars","Balang kaca kosong yang dibilas"]],
 ["Chemicals such as solvents and pesticides can poison soil and water, so they need special handling.","Bahan kimia seperti pelarut dan racun perosak boleh mencemarkan tanah dan air, jadi ia perlu dikendalikan secara khas."]);
Q("s16","a","sorting",["What usually happens to a load of recyclables that is heavily contaminated with food?","Apakah yang biasanya berlaku kepada muatan bahan kitar semula yang sangat tercemar dengan sisa makanan?"],
 [["Much of it is rejected and ends up in landfill","Sebahagian besarnya ditolak dan berakhir di tapak pelupusan"],["It is recycled into higher-value products","Ia dikitar menjadi produk bernilai lebih tinggi"],["It turns into compost on its own","Ia bertukar menjadi kompos dengan sendiri"]],
 ["Contamination lowers the quality and price of recyclables; sorting facilities often reject dirty loads.","Pencemaran menurunkan kualiti dan harga bahan kitar semula; kemudahan pengasingan sering menolak muatan yang kotor."]);
Q("s17","ta","sorting",["What does “urban mining” mean?","Apakah maksud “perlombongan bandar” (urban mining)?"],
 [["Recovering metals from e-waste instead of mining ore","Mendapatkan semula logam daripada e-sisa dan bukannya melombong bijih"],["Digging new mines underneath big cities","Menggali lombong baharu di bawah bandar besar"],["Burying e-waste in city landfills to store it","Menanam e-sisa di tapak pelupusan bandar untuk disimpan"]],
 ["E-waste is a rich source of copper, gold and other metals that can be recovered by proper recyclers.","E-sisa merupakan sumber kaya kuprum, emas dan logam lain yang boleh diperoleh semula oleh pengitar semula yang sah."]);
Q("s18","ta","sorting",["Why is burning electrical cables at home to get the copper dangerous?","Mengapakah membakar kabel elektrik di rumah untuk mendapatkan kuprum berbahaya?"],
 [["The burning plastic gives off toxic fumes that harm health","Plastik yang terbakar membebaskan wasap toksik yang memudaratkan kesihatan"],["It is only dangerous because it is slow","Ia berbahaya hanya kerana lambat"],["Copper explodes when heated","Kuprum meletup apabila dipanaskan"]],
 ["Burning cable insulation releases toxic smoke (including dioxins). Licensed recyclers strip cables safely.","Pembakaran penebat kabel membebaskan asap toksik (termasuk dioksin). Pengitar semula berlesen menanggalkan kabel dengan selamat."]);
Q("s19","k","sorting",["Which of these is e-waste?","Antara berikut, yang manakah e-sisa?"],
 [["A broken phone charger","Pengecas telefon yang rosak"],["An apple core","Empulur epal"],["A cardboard box","Kotak kadbod"]],
 ["E-waste means old things that use electricity or batteries.","E-sisa bermaksud barang lama yang menggunakan elektrik atau bateri."]);

/* ---------------- waste-to-wealth ---------------- */
Q("w01","kta","w2w",["What does “Waste-to-Wealth” mean?","Apakah maksud “Sisa kepada Kekayaan”?"],
 [["Turning waste into useful, valuable things","Menukar sisa menjadi barang yang berguna dan bernilai"],["Burning all rubbish","Membakar semua sampah"],["Hiding rubbish underground","Menyembunyikan sampah di bawah tanah"]],
 ["Waste-to-Wealth (W2W) sees waste as a resource that can become new products, income and jobs.","Sisa kepada Kekayaan (W2W) melihat sisa sebagai sumber yang boleh dijadikan produk baharu, pendapatan dan pekerjaan."]);
Q("w02","ta","w2w",["Which of these is an ENVIRONMENTAL benefit of Waste-to-Wealth?","Antara berikut, yang manakah manfaat ALAM SEKITAR Sisa kepada Kekayaan?"],
 [["Less waste goes to landfill","Kurang sisa dihantar ke tapak pelupusan"],["A small business earns income","Perniagaan kecil memperoleh pendapatan"],["Neighbours learn new skills together","Jiran belajar kemahiran baharu bersama"]],
 ["Less landfill means less methane and pollution. Income is an economic benefit; learning together is a social benefit.","Kurang sisa ke tapak pelupusan bermakna kurang metana dan pencemaran. Pendapatan ialah manfaat ekonomi; belajar bersama ialah manfaat sosial."]);
Q("w03","ta","w2w",["Which of these is an ECONOMIC benefit of Waste-to-Wealth?","Antara berikut, yang manakah manfaat EKONOMI Sisa kepada Kekayaan?"],
 [["Selling waste-based products creates income and jobs","Menjual produk berasaskan sisa mewujudkan pendapatan dan pekerjaan"],["Less methane escapes from landfill sites into the air","Kurang metana terlepas dari tapak pelupusan ke udara"],["Neighbours learn new skills and work together","Jiran belajar kemahiran baharu dan bekerjasama"]],
 ["Economic benefits are about money: income, jobs and lower costs for raw materials and disposal.","Manfaat ekonomi berkaitan wang: pendapatan, pekerjaan dan kos bahan mentah serta pelupusan yang lebih rendah."]);
Q("w04","ta","w2w",["Which of these is a SOCIAL benefit of Waste-to-Wealth?","Antara berikut, yang manakah manfaat SOSIAL Sisa kepada Kekayaan?"],
 [["Community workshops build skills and bring people together","Bengkel komuniti membina kemahiran dan merapatkan masyarakat"],["Factories pay less for the raw materials they buy","Kilang membayar kurang untuk bahan mentah yang dibeli"],["Less leachate seeps from landfills into the soil","Kurang larut resap meresap dari tapak pelupusan ke dalam tanah"]],
 ["Social benefits are about people: skills, health, awareness and stronger communities.","Manfaat sosial berkaitan manusia: kemahiran, kesihatan, kesedaran dan komuniti yang lebih kukuh."]);
Q("w05","k","w2w",["Which of these is a Waste-to-Wealth product?","Antara berikut, yang manakah produk Sisa kepada Kekayaan?"],
 [["A candle made from used cooking oil","Lilin daripada minyak masak terpakai"],["A brand-new plastic bottle from a factory","Botol plastik baharu dari kilang"],["Rubbish burnt in the backyard","Sampah yang dibakar di belakang rumah"]],
 ["The candle gives old oil a new job instead of throwing it away.","Lilin itu memberi minyak lama kegunaan baharu dan bukannya dibuang."]);
Q("w06","kt","w2w",["Dried used coffee grounds can be made into…","Hampas kopi terpakai yang dikeringkan boleh dijadikan…"],
 [["An odour absorber","Penyerap bau"],["Drinking water","Air minuman"],["Glass","Kaca"]],
 ["Dry coffee grounds soak up smells, for example in a shoe cupboard or fridge.","Hampas kopi kering menyerap bau, contohnya dalam almari kasut atau peti sejuk."]);
Q("w07","a","w2w",["Turning old jeans into a bag worth more than the jeans is called…","Menukar seluar jean lama menjadi beg yang lebih bernilai dipanggil…"],
 [["Upcycling","Kitar naik (upcycling)"],["Downcycling","Kitar turun (downcycling)"],["Landfilling","Pelupusan di tapak pelupusan"],["Incineration","Pembakaran (insinerasi)"]],
 ["Upcycling raises the value of a material; downcycling turns it into something of lower quality or value.","Kitar naik meningkatkan nilai bahan; kitar turun menjadikannya sesuatu yang lebih rendah kualiti atau nilainya."]);
Q("w08","a","w2w",["Which of these is an example of downcycling?","Antara berikut, yang manakah contoh kitar turun?"],
 [["Turning white office paper into egg cartons","Menukar kertas pejabat putih menjadi bekas telur"],["Turning an old T-shirt into a tote bag","Menukar baju-T lama menjadi beg jinjing"],["Repairing a broken chair","Membaiki kerusi yang rosak"]],
 ["Office paper has long, high-grade fibres; egg cartons are a lower-grade product, so value is lost.","Kertas pejabat mempunyai serat panjang bergred tinggi; bekas telur ialah produk bergred rendah, jadi nilainya berkurang."]);
Q("w09","kt","w2w",["Fish waste such as heads and bones can be turned into…","Sisa ikan seperti kepala dan tulang boleh dijadikan…"],
 [["Pet food or fertiliser","Makanan haiwan peliharaan atau baja"],["Glass bottles or jars","Botol atau balang kaca"],["Batteries or wires","Bateri atau wayar"]],
 ["Fish waste is rich in protein and nutrients, so it can feed pets or plants instead of rotting in the bin.","Sisa ikan kaya dengan protein dan nutrien, jadi ia boleh menjadi makanan haiwan atau baja dan bukannya mereput dalam tong."]);
Q("w10","kta","w2w",["What can an old T-shirt become?","Baju-T lama boleh dijadikan apa?"],
 [["A tote bag","Beg jinjing"],["Petrol","Petrol"],["A glass jar","Balang kaca"]],
 ["Cut and tie an old T-shirt and it becomes a strong, washable shopping bag.","Potong dan ikat baju-T lama, dan ia menjadi beg membeli-belah yang kuat dan boleh dibasuh."]);

/* ---------------- circular economy, waste hierarchy, 5R ---------------- */
Q("c01","kta","circular",["A “linear economy” works like this:","“Ekonomi linear” berfungsi seperti ini:"],
 [["Take → make → throw away","Ambil → buat → buang"],["Make → use → reuse forever","Buat → guna → guna semula selama-lamanya"],["Grow → eat → compost","Tanam → makan → kompos"]],
 ["Linear means a straight line: things are made, used once and thrown away.","Linear bermaksud garis lurus: barang dibuat, diguna sekali dan dibuang."]);
Q("c02","kta","circular",["In a circular economy, materials are…","Dalam ekonomi kitaran, bahan-bahan…"],
 [["Kept in use for as long as possible","Terus digunakan selama mungkin"],["Used once, then thrown away","Diguna sekali, kemudian dibuang"],["Burnt for heat straight away","Terus dibakar untuk haba"]],
 ["Circular means things go round again: we reuse, repair, share and recycle.","Kitaran bermaksud barang berpusing semula: kita guna semula, baiki, kongsi dan kitar semula."]);
Q("c03","a","circular",["Which is NOT one of the three circular-economy principles of the Ellen MacArthur Foundation?","Antara berikut, yang manakah BUKAN salah satu daripada tiga prinsip ekonomi kitaran Ellen MacArthur Foundation?"],
 [["Maximise sales of single-use products","Memaksimumkan jualan produk sekali guna"],["Eliminate waste and pollution","Menghapuskan sisa dan pencemaran"],["Circulate products and materials","Mengedarkan semula produk dan bahan"],["Regenerate nature","Memulihkan alam semula jadi"]],
 ["The three principles are: eliminate waste and pollution, circulate products and materials at their highest value, and regenerate nature.","Tiga prinsip itu ialah: hapuskan sisa dan pencemaran, edarkan semula produk dan bahan pada nilai tertinggi, dan pulihkan alam semula jadi."]);
Q("c04","k","circular",["Which is BEST for the planet?","Yang manakah PALING BAIK untuk bumi?"],
 [["Not making the waste in the first place","Tidak menghasilkan sisa langsung"],["Throwing it in the rubbish bin quickly","Membuangnya ke dalam tong sampah dengan cepat"],["Burning it in the back garden","Membakarnya di belakang rumah"]],
 ["The best waste is the waste we never make!","Sisa yang paling baik ialah sisa yang tidak pernah kita hasilkan!"]);
Q("c05","ta","circular",["In the waste hierarchy, which option is MOST preferred?","Dalam hierarki pengurusan sisa, pilihan manakah yang PALING diutamakan?"],
 [["Prevention (reducing waste at source)","Pencegahan (mengurangkan sisa di punca)"],["Recycling (making new items from old)","Kitar semula (membuat barang baharu daripada lama)"],["Energy recovery (burning for power)","Pemulihan tenaga (membakar untuk tenaga)"],["Landfill (burying waste)","Tapak pelupusan (menanam sisa)"]],
 ["Order: prevent/reduce → reuse → recycle → recover energy → dispose. Avoiding waste saves the most resources.","Susunan: cegah/kurangkan → guna semula → kitar semula → pemulihan tenaga → pelupusan. Mengelakkan sisa menjimatkan sumber paling banyak."]);
Q("c06","ta","circular",["In the waste hierarchy, which option is LEAST preferred?","Dalam hierarki pengurusan sisa, pilihan manakah yang PALING KURANG diutamakan?"],
 [["Landfill (burying waste)","Tapak pelupusan (menanam sisa)"],["Reuse (using items again)","Guna semula (menggunakan barang sekali lagi)"],["Recycling (making new items)","Kitar semula (membuat barang baharu)"],["Reduce (making less waste)","Kurangkan (menghasilkan kurang sisa)"]],
 ["Landfill is the last resort: the material is lost, and rotting waste produces methane.","Tapak pelupusan ialah pilihan terakhir: bahan terbuang, dan sisa yang mereput menghasilkan metana."]);
Q("c07","a","circular",["Where does energy recovery (waste-to-energy) sit in the waste hierarchy?","Di manakah kedudukan pemulihan tenaga (sisa kepada tenaga) dalam hierarki sisa?"],
 [["Below recycling, but above landfill","Di bawah kitar semula, tetapi di atas tapak pelupusan"],["Above reduce and reuse","Di atas kurangkan dan guna semula"],["At the very top","Di bahagian paling atas"]],
 ["Recovering energy is better than burying waste, but recycling keeps materials in use, so it ranks higher.","Memulihkan tenaga lebih baik daripada menanam sisa, tetapi kitar semula mengekalkan bahan dalam penggunaan, jadi ia lebih tinggi."]);
Q("c08","kt","circular",["Saying “no thanks” to a plastic straw is an example of…","Menolak straw plastik ialah contoh…"],
 [["Refuse","Tolak (Refuse)"],["Recycle","Kitar semula"],["Landfill","Tapak pelupusan"]],
 ["Refuse means not taking things you don’t need, so no waste is made.","Tolak bermaksud tidak mengambil barang yang tidak diperlukan, jadi tiada sisa terhasil."]);
Q("c09","k","circular",["Using an old jam jar as a pencil holder means you…","Menggunakan balang jem lama sebagai bekas pensel bermaksud anda…"],
 [["Give it a new job (reuse it)","Memberinya kegunaan baharu (guna semula)"],["Throw it away (dispose of it)","Membuangnya (melupuskannya)"],["Melt it down (recycle it)","Meleburkannya (kitar semula)"]],
 ["Reusing gives things a second life, so we need fewer new things.","Guna semula memberi barang hayat kedua, jadi kita memerlukan kurang barang baharu."]);
Q("c10","t","circular",["Turning a jam jar into a pencil holder is best described as…","Menukar balang jem menjadi bekas pensel paling tepat digambarkan sebagai…"],
 [["Repurpose","Guna untuk tujuan lain (Repurpose)"],["Recycle","Kitar semula"],["Refuse","Tolak"]],
 ["Repurposing uses an item for a new purpose without breaking it down, so no energy is spent on reprocessing.","Repurpose menggunakan barang untuk tujuan baharu tanpa memprosesnya semula, jadi tiada tenaga digunakan untuk pemprosesan."]);
Q("c11","ta","circular",["In the 5R list (Refuse, Reduce, Reuse, Repurpose, Recycle), which should be the LAST choice?","Dalam senarai 5R (Tolak, Kurangkan, Guna Semula, Guna untuk Tujuan Lain, Kitar Semula), yang manakah pilihan TERAKHIR?"],
 [["Recycle","Kitar semula"],["Refuse","Tolak"],["Reduce","Kurangkan"]],
 ["Recycling still needs collection, energy and processing. Avoiding and reusing waste comes first.","Kitar semula masih memerlukan kutipan, tenaga dan pemprosesan. Mengelak dan menggunakan semula didahulukan."]);
Q("c12","kt","circular",["Fixing a broken toy instead of buying a new one…","Membaiki mainan yang rosak dan bukannya membeli yang baharu…"],
 [["Keeps it in use and saves resources","Mengekalkan penggunaannya dan menjimatkan sumber"],["Makes more rubbish for the bin","Menghasilkan lebih banyak sampah untuk tong"],["Uses up more of the planet’s resources","Menggunakan lebih banyak sumber bumi"]],
 ["Repairing means fewer new things are made and less is thrown away.","Membaiki bermakna kurang barang baharu dibuat dan kurang dibuang."]);
Q("c13","a","circular",["Which business model is the most circular?","Model perniagaan manakah yang paling berkonsepkan kitaran?"],
 [["Leasing products, then taking them back to refurbish (product-as-a-service)","Menyewakan produk, kemudian mengambilnya semula untuk dibaik pulih (produk-sebagai-perkhidmatan)"],["Selling cheaper single-use items in bigger volumes","Menjual barang sekali guna yang lebih murah dalam jumlah lebih besar"],["Adding more packaging to look premium","Menambah pembungkusan supaya nampak mewah"]],
 ["When the company keeps ownership, it profits from durable, repairable products instead of throwaway ones.","Apabila syarikat mengekalkan pemilikan, ia untung daripada produk yang tahan lama dan boleh dibaiki, bukan yang pakai buang."]);
Q("c14","a","circular",["“Design for disassembly” supports a circular economy because…","“Reka bentuk untuk dileraikan” menyokong ekonomi kitaran kerana…"],
 [["Products are easy to repair and to separate for recycling","Produk mudah dibaiki dan diasingkan untuk kitar semula"],["Products wear out faster, so people buy new ones","Produk lebih cepat haus, jadi orang membeli yang baharu"],["Parts are glued firmly so nothing comes loose","Bahagian dilekatkan kuat supaya tiada yang tertanggal"]],
 ["Screws instead of glue, and single materials instead of mixtures, make repair and recycling possible.","Skru dan bukannya gam, serta bahan tunggal dan bukannya campuran, membolehkan pembaikan dan kitar semula."]);
Q("c15","a","circular",["A life cycle assessment (LCA) measures…","Penilaian kitaran hayat (LCA) mengukur…"],
 [["Environmental impacts over a product’s whole life","Kesan alam sekitar sepanjang hayat produk"],["Only the factory’s energy bill in one year","Bil tenaga kilang dalam setahun sahaja"],["Only how long the product lasts before breaking","Berapa lama produk tahan sebelum rosak sahaja"]],
 ["An LCA stops “burden shifting”: a product that looks green at the shop may have a high impact in production or disposal.","LCA mengelakkan “peralihan beban”: produk yang nampak hijau di kedai mungkin berkesan tinggi semasa pengeluaran atau pelupusan."]);
Q("c16","a","circular",["A refill shop where customers bring back empty containers is an example of…","Kedai isi semula yang pelanggannya membawa balik bekas kosong ialah contoh…"],
 [["Reuse in a circular business model","Guna semula dalam model perniagaan kitaran"],["Recycling in a linear business model","Kitar semula dalam model perniagaan linear"],["Energy recovery through incineration","Pemulihan tenaga melalui insinerasi"]],
 ["Refill and take-back systems keep containers in use, which is higher in the hierarchy than recycling them.","Sistem isi semula dan pulangan mengekalkan penggunaan bekas, yang lebih tinggi dalam hierarki berbanding kitar semula."]);

/* ---------------- composting ---------------- */
Q("k01","k","compost",["Which one is a “green” for the compost bin?","Yang manakah bahan “hijau” untuk tong kompos?"],
 [["Vegetable scraps","Sisa sayur"],["Dry leaves","Daun kering"],["A plastic spoon","Sudu plastik"]],
 ["Greens are wet, fresh things like vegetable and fruit scraps.","Bahan hijau ialah bahan basah dan segar seperti sisa sayur dan buah."]);
Q("k02","k","compost",["Which one is a “brown” for the compost bin?","Yang manakah bahan “perang” untuk tong kompos?"],
 [["Dry leaves","Daun kering"],["Fresh grass","Rumput segar"],["A glass bottle","Botol kaca"]],
 ["Browns are dry things like dead leaves, twigs and cardboard.","Bahan perang ialah bahan kering seperti daun mati, ranting dan kadbod."]);
Q("k03","ta","compost",["In composting, “greens” are mainly a source of…","Dalam pengkomposan, bahan “hijau” terutamanya membekalkan…"],
 [["Nitrogen","Nitrogen"],["Carbon only","Karbon sahaja"],["Plastic","Plastik"]],
 ["Greens (food scraps, fresh grass) are nitrogen-rich; browns (dry leaves, cardboard) are carbon-rich.","Bahan hijau (sisa makanan, rumput segar) kaya nitrogen; bahan perang (daun kering, kadbod) kaya karbon."]);
Q("k04","ta","compost",["What is a good starting carbon-to-nitrogen (C:N) ratio for compost?","Apakah nisbah karbon kepada nitrogen (C:N) yang baik untuk memulakan kompos?"],
 [["About 25–30 : 1","Kira-kira 25–30 : 1"],["About 1 : 1","Kira-kira 1 : 1"],["About 5 : 1","Kira-kira 5 : 1"],["About 100 : 1","Kira-kira 100 : 1"]],
 ["Microbes need roughly 25–30 parts carbon for each part nitrogen. Too much nitrogen smells of ammonia; too much carbon is slow.","Mikrob memerlukan kira-kira 25–30 bahagian karbon bagi setiap bahagian nitrogen. Terlalu banyak nitrogen berbau ammonia; terlalu banyak karbon menjadi perlahan."]);
Q("k05","ta","compost",["How wet should a compost pile be?","Sebasah manakah timbunan kompos sepatutnya?"],
 [["Like a wrung-out sponge (about 40–60% moisture)","Seperti span yang telah diperah (kelembapan kira-kira 40–60%)"],["Completely dry","Kering sepenuhnya"],["Soaking, with water pooling at the bottom","Basah lencun, dengan air bertakung di bawah"]],
 ["Microbes need water, but too much fills the air spaces and the pile turns anaerobic and smelly.","Mikrob perlukan air, tetapi air berlebihan memenuhi ruang udara dan timbunan menjadi anaerobik serta berbau."]);
Q("k06","ta","compost",["A compost pile smells of rotten eggs. What is the most likely cause and fix?","Timbunan kompos berbau seperti telur busuk. Apakah punca dan penyelesaian yang paling mungkin?"],
 [["Too wet, not enough air: add browns and turn it","Terlalu basah, kurang udara: tambah bahan perang dan balikkan"],["Too dry, too much air: add water and sand","Terlalu kering, terlalu banyak udara: tambah air dan pasir"],["Too cold: cover it tightly with a plastic sheet","Terlalu sejuk: tutup rapat dengan kepingan plastik"]],
 ["The rotten-egg smell is hydrogen sulphide from anaerobic microbes. Dry browns and turning bring oxygen back.","Bau telur busuk ialah hidrogen sulfida daripada mikrob anaerobik. Bahan perang kering dan membalikkan timbunan memulihkan oksigen."]);
Q("k07","ta","compost",["Why is a “hot” compost pile (about 55–65 °C) useful?","Mengapakah timbunan kompos “panas” (kira-kira 55–65 °C) berguna?"],
 [["The heat kills many pathogens and weed seeds","Haba membunuh banyak patogen dan biji rumpai"],["The heat melts plastic into the compost","Haba mencairkan plastik ke dalam kompos"],["It turns compost into soil in one hour","Kompos menjadi tanah dalam satu jam"]],
 ["Busy microbes release heat. A few days in the thermophilic range sanitises the compost.","Mikrob yang aktif membebaskan haba. Beberapa hari pada julat termofilik membersihkan kompos daripada patogen."]);
Q("k08","kt","compost",["Who does most of the work in a compost pile?","Siapakah yang melakukan kebanyakan kerja dalam timbunan kompos?"],
 [["Tiny microbes like bacteria and fungi","Mikrob kecil seperti bakteria dan kulat"],["Magnets hidden in the soil","Magnet yang tersembunyi dalam tanah"],["Only the hot sun shining on it","Cahaya matahari panas sahaja"]],
 ["Bacteria and fungi (helped by worms and insects) eat the waste and turn it into compost.","Bakteria dan kulat (dibantu cacing dan serangga) memakan sisa dan menukarnya menjadi kompos."]);
Q("k09","kta","compost",["Which should NOT go into a simple home compost bin?","Yang manakah TIDAK patut dimasukkan ke dalam tong kompos rumah yang ringkas?"],
 [["Meat, bones and oily food","Daging, tulang dan makanan berminyak"],["Vegetable peels and tea leaves","Kulit sayur dan daun teh"],["Dry leaves and small twigs","Daun kering dan ranting kecil"]],
 ["Meat and oily food smell bad and attract rats and flies. (Bokashi can handle them.)","Daging dan makanan berminyak berbau busuk serta menarik tikus dan lalat. (Bokashi boleh memprosesnya.)"]);
Q("k10","ta","compost",["What is bokashi?","Apakah itu bokashi?"],
 [["Fermenting food waste in a sealed bucket with microbe bran","Menapai sisa makanan dalam baldi tertutup dengan dedak bermikrob"],["Burning dried food waste in a small stove for energy","Membakar sisa makanan kering dalam dapur kecil untuk tenaga"],["Composting food waste in an open pile using only worms","Mengkompos sisa makanan dalam timbunan terbuka dengan cacing sahaja"]],
 ["Bokashi is anaerobic fermentation. It can take cooked food and small amounts of meat.","Bokashi ialah penapaian anaerobik. Ia boleh menerima makanan bermasak dan sedikit daging."]);
Q("k11","a","compost",["What must be done with the fermented material from a bokashi bucket?","Apakah yang perlu dibuat dengan bahan tertapai daripada baldi bokashi?"],
 [["Bury it in soil or add it to a compost heap to finish breaking down","Tanam dalam tanah atau masukkan ke timbunan kompos untuk diuraikan sepenuhnya"],["Use it straight away as potting soil for seedlings","Terus gunakan sebagai tanah semaian anak benih"],["Send it to the blue recycling bin","Hantar ke tong kitar semula biru"]],
 ["Bokashi output is acidic “pre-compost”. It needs about two weeks or more in soil before planting.","Hasil bokashi ialah “pra-kompos” yang berasid. Ia perlu kira-kira dua minggu atau lebih dalam tanah sebelum ditanam."]);
Q("k12","k","compost",["Which animal helps make vermicompost?","Haiwan manakah yang membantu menghasilkan vermikompos?"],
 [["Earthworms","Cacing tanah"],["Ants","Semut"],["Cats","Kucing"]],
 ["Worms eat food scraps and leave behind rich castings that plants love.","Cacing memakan sisa makanan dan meninggalkan najis cacing yang kaya untuk tanaman."]);
Q("k13","ta","compost",["Vermicomposting usually uses…","Vermikompos biasanya menggunakan…"],
 [["Composting worms (red wigglers)","Cacing kompos (cacing merah)"],["Garden snails and slugs","Siput dan siput babi kebun"],["Soil ants and termites","Semut tanah dan anai-anai"]],
 ["Red wigglers live near the surface and eat large amounts of organic waste; their castings are a rich fertiliser.","Cacing merah hidup dekat permukaan dan memakan banyak sisa organik; najisnya ialah baja yang kaya."]);
Q("k14","ta","compost",["Why do we turn (mix) a compost pile?","Mengapakah kita membalikkan (menggaul) timbunan kompos?"],
 [["To add oxygen for the microbes","Untuk menambah oksigen bagi mikrob"],["To cool it down to freezing","Untuk menyejukkannya hingga beku"],["To remove all the nitrogen","Untuk membuang semua nitrogen"]],
 ["Aerobic microbes break waste down quickly and without bad smells, but they need oxygen.","Mikrob aerobik mengurai sisa dengan cepat tanpa bau busuk, tetapi memerlukan oksigen."]);
Q("k15","a","compost",["Your compost has lots of food scraps (C:N about 15:1). To move towards 30:1 you should add…","Kompos anda banyak sisa makanan (C:N kira-kira 15:1). Untuk menghampiri 30:1 anda patut menambah…"],
 [["Browns such as dry leaves or shredded cardboard","Bahan perang seperti daun kering atau kadbod dicarik"],["Greens such as fresh grass clippings","Bahan hijau seperti rumput yang baru dipotong"],["More fruit peels and vegetable scraps","Lebih banyak kulit buah dan sisa sayur"]],
 ["Food scraps are nitrogen-rich. Adding carbon raises the C:N ratio.","Sisa makanan kaya nitrogen. Menambah karbon meningkatkan nisbah C:N."]);
Q("k16","kt","compost",["Finished compost looks and smells…","Kompos yang sudah siap kelihatan dan berbau…"],
 [["Dark, crumbly and earthy","Gelap, rapuh dan berbau tanah"],["Bright and shiny","Terang dan berkilat"],["Like rotten eggs","Seperti telur busuk"]],
 ["Good compost looks like dark soil and smells like a forest floor.","Kompos yang baik seperti tanah gelap dan berbau seperti lantai hutan."]);

/* ---------------- eco-enzyme ---------------- */
Q("e01","k","enzyme",["Eco-enzyme is made from fruit peels, water and…","Eko-enzim dibuat daripada kulit buah, air dan…"],
 [["Brown sugar or molasses","Gula perang atau molases"],["Salt or baking soda","Garam atau soda penaik"],["Cooking oil or flour","Minyak masak atau tepung"]],
 ["Sugar feeds the tiny microbes that ferment the peels.","Gula menjadi makanan mikrob kecil yang menapai kulit buah."]);
Q("e02","ta","enzyme",["The usual eco-enzyme recipe ratio (by weight) of sugar : peels : water is…","Nisbah resipi eko-enzim yang biasa (mengikut berat) bagi gula : kulit buah : air ialah…"],
 [["1 : 3 : 10","1 : 3 : 10"],["3 : 1 : 10","3 : 1 : 10"],["10 : 3 : 1","10 : 3 : 1"],["1 : 1 : 1","1 : 1 : 1"]],
 ["One part sugar, three parts fruit and vegetable peels, ten parts water.","Satu bahagian gula, tiga bahagian kulit buah dan sayur, sepuluh bahagian air."]);
Q("e03","kta","enzyme",["How long does eco-enzyme usually ferment?","Berapa lamakah eko-enzim biasanya ditapai?"],
 [["About 3 months","Kira-kira 3 bulan"],["About 3 hours","Kira-kira 3 jam"],["About 3 days","Kira-kira 3 hari"]],
 ["It needs about three months. Be patient!","Ia memerlukan kira-kira tiga bulan. Bersabarlah!"]);
Q("e04","kt","enzyme",["Why do we open the eco-enzyme lid a little in the first weeks (with an adult)?","Mengapakah kita membuka sedikit penutup eko-enzim pada minggu-minggu awal (bersama orang dewasa)?"],
 [["To let out gas so it does not burst","Untuk membebaskan gas supaya ia tidak pecah"],["To let flies in to help it ferment","Untuk membenarkan lalat masuk membantu penapaian"],["To add sand to make it heavier","Untuk menambah pasir supaya lebih berat"]],
 ["Fermenting microbes make gas. Letting it out stops pressure building up.","Mikrob yang menapai menghasilkan gas. Membebaskannya menghalang tekanan meningkat."]);
Q("e05","ta","enzyme",["Which container is best for fermenting eco-enzyme?","Bekas manakah yang paling sesuai untuk menapai eko-enzim?"],
 [["A plastic container with space left at the top","Bekas plastik dengan ruang kosong di bahagian atas"],["A glass bottle filled to the brim and sealed tight","Botol kaca yang diisi penuh dan ditutup ketat"],["An open bowl","Mangkuk terbuka"]],
 ["Gas builds up during fermentation. Plastic flexes instead of shattering, and headspace gives room for gas.","Gas terkumpul semasa penapaian. Plastik melentur dan tidak pecah berderai, dan ruang kosong memberi tempat untuk gas."]);
Q("e06","ta","enzyme",["Which statement about eco-enzyme is honest?","Kenyataan manakah tentang eko-enzim yang jujur?"],
 [["A mild fermented cleaner; cure and river-cleaning claims are unproven","Pencuci tertapai yang ringan; dakwaan menyembuh penyakit dan membersih sungai belum terbukti"],["A proven medicine that cures many diseases when you drink it","Ubat terbukti yang menyembuhkan banyak penyakit apabila diminum"],["A powerful treatment that instantly cleans any polluted river","Rawatan berkesan yang serta-merta membersihkan mana-mana sungai tercemar"]],
 ["Eco-enzyme is a good way to reuse peels, but we should only claim what evidence supports.","Eko-enzim cara yang baik untuk menggunakan semula kulit buah, tetapi kita hanya patut mendakwa apa yang disokong bukti."]);
Q("e07","t","enzyme",["Finished eco-enzyme is acidic (low pH) mainly because…","Eko-enzim yang siap bersifat asid (pH rendah) terutamanya kerana…"],
 [["Fermentation makes organic acids such as acetic acid","Penapaian menghasilkan asid organik seperti asid asetik"],["The brown sugar itself is a strong acid","Gula perang itu sendiri ialah asid kuat"],["The peels release metals into the water","Kulit buah membebaskan logam ke dalam air"]],
 ["Microbes turn sugar into alcohol and organic acids, which lower the pH.","Mikrob menukar gula kepada alkohol dan asid organik, yang menurunkan pH."]);
Q("e08","kt","enzyme",["Which waste is good for making eco-enzyme?","Sisa manakah yang sesuai untuk membuat eko-enzim?"],
 [["Fruit and vegetable peels","Kulit buah dan sayur"],["Meat and fish bones","Daging dan tulang ikan"],["Plastic food wrappers","Pembalut makanan plastik"]],
 ["Fresh peels ferment well. Meat and fish would rot and smell bad.","Kulit yang segar mudah ditapai. Daging dan ikan akan reput dan berbau busuk."]);
Q("e09","a","enzyme",["Why should large amounts of eco-enzyme NOT be poured into rivers to “clean” them?","Mengapakah eko-enzim dalam jumlah besar TIDAK patut dituang ke sungai untuk “membersihkannya”?"],
 [["Its sugars use up the oxygen that fish need","Gulanya menghabiskan oksigen yang diperlukan ikan"],["It makes river water too cold for fish","Ia menjadikan air sungai terlalu sejuk untuk ikan"],["It turns the river water into plastic","Ia menukar air sungai menjadi plastik"]],
 ["Adding organic matter raises the river’s biochemical oxygen demand (BOD), which can harm aquatic life.","Menambah bahan organik meningkatkan keperluan oksigen biokimia (BOD) sungai, yang boleh membahayakan hidupan akuatik."]);
Q("e10","ta","enzyme",["Using the 1 : 3 : 10 ratio, how much peel and water go with 300 g of brown sugar?","Menggunakan nisbah 1 : 3 : 10, berapakah kulit buah dan air untuk 300 g gula perang?"],
 [["900 g peels and 3 kg (about 3 L) water","900 g kulit buah dan 3 kg (kira-kira 3 L) air"],["300 g peels and 300 g water","300 g kulit buah dan 300 g air"],["3 kg peels and 900 g water","3 kg kulit buah dan 900 g air"]],
 ["300 × 3 = 900 g peels and 300 × 10 = 3,000 g water (1 L of water weighs about 1 kg).","300 × 3 = 900 g kulit buah dan 300 × 10 = 3,000 g air (1 L air beratnya kira-kira 1 kg)."]);

/* ---------------- natural pH indicators ---------------- */
Q("p01","kt","ph",["A pH of 7 means the liquid is…","pH 7 bermaksud cecair itu…"],
 [["Neutral","Neutral"],["Very acidic","Sangat berasid"],["Very alkaline","Sangat beralkali"]],
 ["pH 7 is neutral, like pure water. Below 7 is acidic; above 7 is alkaline.","pH 7 adalah neutral, seperti air tulen. Bawah 7 berasid; atas 7 beralkali."]);
Q("p02","kt","ph",["Red (purple) cabbage juice turns pink-red when you add…","Jus kubis ungu bertukar merah jambu-merah apabila ditambah…"],
 [["Vinegar","Cuka"],["Soapy water","Air sabun"],["Plain water","Air biasa"]],
 ["Vinegar is an acid. Cabbage juice goes pink or red in acids.","Cuka ialah asid. Jus kubis menjadi merah jambu atau merah dalam asid."]);
Q("p03","kt","ph",["Blue bunga telang (butterfly pea) tea turns purple-pink when you add…","Teh bunga telang yang biru bertukar ungu-merah jambu apabila ditambah…"],
 [["Lime juice","Jus limau"],["Baking soda","Soda penaik"],["Salt","Garam"]],
 ["Lime juice is acidic, and the blue colour changes in acid.","Jus limau berasid, dan warna biru berubah dalam asid."]);
Q("p04","k","ph",["Red cabbage juice in baking soda water turns…","Jus kubis ungu dalam air soda penaik bertukar…"],
 [["Blue-green","Biru-hijau"],["Bright red","Merah terang"],["Stays exactly the same","Kekal sama"]],
 ["Baking soda is alkaline, so the juice turns blue or green.","Soda penaik bersifat alkali, jadi jus bertukar biru atau hijau."]);
Q("p05","t","ph",["Which natural pigment makes red cabbage and butterfly pea change colour with pH?","Pigmen semula jadi manakah yang menyebabkan kubis ungu dan bunga telang berubah warna mengikut pH?"],
 [["Anthocyanins","Antosianin"],["Chlorophyll","Klorofil"],["Starch","Kanji"],["Protein","Protein"]],
 ["Anthocyanin molecules change shape as pH changes, so they absorb different colours of light.","Molekul antosianin berubah bentuk apabila pH berubah, jadi ia menyerap warna cahaya yang berbeza."]);
Q("p06","t","ph",["Turmeric (kunyit) solution turns from yellow to reddish-brown in…","Larutan kunyit bertukar daripada kuning kepada perang kemerahan dalam…"],
 [["Alkaline solutions such as soapy water","Larutan alkali seperti air sabun"],["Acidic solutions such as vinegar","Larutan asid seperti cuka"],["Neutral liquids such as pure water","Cecair neutral seperti air tulen"]],
 ["Curcumin, the yellow pigment in turmeric, turns red-brown in alkaline conditions.","Kurkumin, pigmen kuning dalam kunyit, bertukar perang kemerahan dalam keadaan alkali."]);
Q("p07","kt","ph",["Which of these is acidic?","Antara berikut, yang manakah berasid?"],
 [["Lemon juice","Jus lemon"],["Soap","Sabun"],["Baking soda solution","Larutan soda penaik"]],
 ["Lemons taste sour because they contain citric acid.","Lemon terasa masam kerana mengandungi asid sitrik."]);
Q("p08","kt","ph",["Blue litmus paper turns red in…","Kertas litmus biru bertukar merah dalam…"],
 [["An acid","Asid"],["An alkali","Alkali"],["Pure water","Air tulen"]],
 ["Acids turn blue litmus red. Alkalis turn red litmus blue.","Asid menukar litmus biru kepada merah. Alkali menukar litmus merah kepada biru."]);
Q("p09","t","ph",["Compared with a solution at pH 5, a solution at pH 3 is…","Berbanding larutan pH 5, larutan pH 3 adalah…"],
 [["100 times more acidic","100 kali lebih berasid"],["2 times more acidic","2 kali lebih berasid"],["Less acidic","Kurang berasid"]],
 ["The pH scale is logarithmic: each step is 10×, so two steps is 10 × 10 = 100× more hydrogen ions.","Skala pH adalah logaritma: setiap langkah 10×, jadi dua langkah ialah 10 × 10 = 100× lebih ion hidrogen."]);
Q("p10","ta","ph",["Why make pH indicators from kitchen waste (e.g. cabbage leaves, flower petals) in class?","Mengapakah penunjuk pH dibuat daripada sisa dapur (cth. daun kubis, kelopak bunga) di dalam kelas?"],
 [["They are cheap, safe and reuse waste: a W2W science tool","Ia murah, selamat dan menggunakan semula sisa: alat sains W2W"],["They are more precise than a pH meter","Ia lebih tepat daripada meter pH"],["They only work at night","Ia hanya berfungsi pada waktu malam"]],
 ["Natural indicators show the approximate pH range only, but they make acid–base chemistry visible at almost no cost.","Penunjuk semula jadi hanya menunjukkan julat pH anggaran, tetapi ia menjadikan kimia asid–bes boleh dilihat hampir tanpa kos."]);

/* ---------------- plastics, microplastics, bioplastic ---------------- */
Q("l01","ta","plastics",["Resin code 1 (♳) on a drink bottle stands for…","Kod resin 1 (♳) pada botol minuman bermaksud…"],
 [["PET (polyethylene terephthalate)","PET (polietilena tereftalat)"],["PVC (polyvinyl chloride)","PVC (polivinil klorida)"],["PS (polystyrene)","PS (polistirena)"],["PP (polypropylene)","PP (polipropilena)"]],
 ["Code 1 is PET, used for clear drink bottles. It is one of the most widely recycled plastics.","Kod 1 ialah PET, digunakan untuk botol minuman jernih. Ia antara plastik yang paling banyak dikitar semula."]);
Q("l02","ta","plastics",["Which resin code is HDPE (e.g. shampoo and detergent bottles)?","Kod resin manakah HDPE (cth. botol syampu dan detergen)?"],
 [["2","2"],["4","4"],["6","6"],["7","7"]],
 ["Codes: 1 PET, 2 HDPE, 3 PVC, 4 LDPE, 5 PP, 6 PS, 7 Other.","Kod: 1 PET, 2 HDPE, 3 PVC, 4 LDPE, 5 PP, 6 PS, 7 Lain-lain."]);
Q("l03","ta","plastics",["Resin code 4 is LDPE. Which product is typically LDPE?","Kod resin 4 ialah LDPE. Produk manakah yang lazimnya LDPE?"],
 [["Plastic bags and cling film","Beg plastik dan pembalut plastik"],["Polystyrene food boxes","Kotak makanan polistirena"],["PVC water pipes","Paip air PVC"]],
 ["Low-density polyethylene is soft and flexible, so it is used for bags and films.","Polietilena berketumpatan rendah lembut dan fleksibel, jadi ia digunakan untuk beg dan filem."]);
Q("l04","ta","plastics",["Polystyrene (foam food boxes) has which resin code?","Polistirena (kotak makanan polistirena) mempunyai kod resin…"],
 [["6","6"],["1","1"],["2","2"],["5","5"]],
 ["Code 6 is PS. Foamed PS is bulky and light, so it is rarely worth collecting for recycling.","Kod 6 ialah PS. PS berbusa besar dan ringan, jadi ia jarang berbaloi dikutip untuk kitar semula."]);
Q("l05","ta","plastics",["Resin code 5 (PP) is commonly used for…","Kod resin 5 (PP) lazimnya digunakan untuk…"],
 [["Microwave-safe tubs and bottle caps","Bekas tahan ketuhar mikro dan penutup botol"],["Clear fizzy-drink and water bottles","Botol minuman berkarbonat dan air yang jernih"],["Foam takeaway boxes and cups","Kotak dan cawan polistirena bawa pulang"]],
 ["Polypropylene resists heat and chemicals, so it is used for microwaveable containers and caps.","Polipropilena tahan haba dan bahan kimia, jadi ia digunakan untuk bekas boleh-microwave dan penutup."]);
Q("l06","a","plastics",["Resin code 7 means…","Kod resin 7 bermaksud…"],
 [["“Other” plastics or mixtures, hard to recycle","Plastik “lain-lain” atau campuran, sukar dikitar"],["The easiest plastic of all to recycle","Plastik yang paling mudah dikitar semula"],["Clear PET drink bottles","Botol minuman PET yang jernih"]],
 ["Code 7 is a catch-all (e.g. polycarbonate, multilayer, some bioplastics). It is not a sign of recyclability.","Kod 7 ialah kategori umum (cth. polikarbonat, berbilang lapisan, sesetengah bioplastik). Ia bukan tanda boleh dikitar."]);
Q("l07","kta","plastics",["What are microplastics?","Apakah itu mikroplastik?"],
 [["Plastic pieces smaller than 5 mm","Cebisan plastik lebih kecil daripada 5 mm"],["Extra-strong, thin plastic film","Filem plastik nipis yang sangat kuat"],["Plastic made by tiny microbes","Plastik yang dihasilkan oleh mikrob kecil"]],
 ["Big plastic breaks into tiny bits that are hard to see and end up in water, soil and animals.","Plastik besar pecah menjadi cebisan kecil yang sukar dilihat dan berakhir di air, tanah dan dalam haiwan."]);
Q("l08","ta","plastics",["Which is a major source of microplastics in wastewater?","Yang manakah sumber utama mikroplastik dalam air sisa?"],
 [["Polyester clothes shedding fibres in the wash","Pakaian poliester yang melepaskan gentian semasa dibasuh"],["Glass bottles broken in recycling bins","Botol kaca yang pecah dalam tong kitar semula"],["Paper towels used to wipe kitchens","Tuala kertas yang digunakan untuk mengelap dapur"]],
 ["Every wash releases tiny polyester and nylon fibres; many pass through treatment plants.","Setiap basuhan melepaskan gentian poliester dan nilon yang halus; banyak yang terlepas melalui loji rawatan."]);
Q("l09","kt","plastics",["How long can a plastic bottle last in nature?","Berapa lamakah botol plastik boleh kekal di alam semula jadi?"],
 [["Hundreds of years, breaking into tiny bits","Ratusan tahun, pecah menjadi cebisan kecil"],["About one week, then it melts away","Kira-kira seminggu, kemudian ia cair"],["A few months, like a banana peel","Beberapa bulan, seperti kulit pisang"]],
 ["Plastic does not rot like food. It just breaks into smaller and smaller pieces.","Plastik tidak mereput seperti makanan. Ia cuma pecah menjadi cebisan yang semakin kecil."]);
Q("l10","kta","plastics",["What is the best way to cut plastic waste?","Apakah cara terbaik untuk mengurangkan sisa plastik?"],
 [["Refuse single-use plastic; bring a reusable bag","Tolak plastik sekali guna; bawa beg guna semula"],["Use more plastic straws but recycle them","Guna lebih banyak straw plastik tetapi kitar semula"],["Burn plastic at home to make it disappear","Bakar plastik di rumah supaya ia hilang"]],
 ["Not using it at all is better than recycling it later.","Tidak menggunakannya langsung lebih baik daripada mengitar semulanya kemudian."]);
Q("l11","ta","plastics",["Why is open burning of plastic waste harmful?","Mengapakah pembakaran terbuka sisa plastik memudaratkan?"],
 [["It releases toxic smoke (e.g. dioxins) and is illegal","Ia membebaskan asap toksik (cth. dioksin) dan menyalahi undang-undang"],["It is only harmful if you burn it in the daytime","Ia hanya berbahaya jika dibakar pada waktu siang"],["It makes the ash too heavy for rubbish lorries","Ia menjadikan abu terlalu berat untuk lori sampah"]],
 ["Burning plastic at low temperature releases harmful chemicals. Open burning is prohibited under the Environmental Quality Act 1974.","Membakar plastik pada suhu rendah membebaskan bahan kimia berbahaya. Pembakaran terbuka dilarang di bawah Akta Kualiti Alam Sekeliling 1974."]);
Q("l12","ta","plastics",["Which statement about “bio-based” plastics is correct?","Kenyataan manakah tentang plastik “berasaskan bio” yang betul?"],
 [["Bio-based means made from plants; it is not always biodegradable","Berasaskan bio bermaksud dibuat daripada tumbuhan; ia tidak semestinya terbiodegradasi"],["All bio-based plastics dissolve in the sea within days","Semua plastik berasaskan bio larut di laut dalam beberapa hari"],["Bio-based plastics are always made from petroleum","Plastik berasaskan bio sentiasa dibuat daripada petroleum"]],
 ["Bio-PE from sugarcane is chemically the same as normal PE and does not biodegrade. Source and end-of-life are different questions.","Bio-PE daripada tebu sama secara kimia dengan PE biasa dan tidak terbiodegradasi. Sumber bahan dan pengakhiran hayat ialah dua soalan berbeza."]);
Q("l13","ta","plastics",["PLA “compostable” cups break down properly mainly in…","Cawan PLA “boleh kompos” terurai dengan sempurna terutamanya di…"],
 [["Hot industrial composting facilities","Kemudahan pengkomposan industri yang panas"],["The cool, salty ocean","Lautan yang sejuk dan masin"],["A cool backyard compost heap","Timbunan kompos belakang rumah yang sejuk"]],
 ["PLA needs sustained high temperatures and moisture. In the sea or a cool home compost it lasts a long time.","PLA memerlukan suhu tinggi dan kelembapan yang berterusan. Di laut atau kompos rumah yang sejuk, ia kekal lama."]);
Q("l14","kt","plastics",["Which ingredients make a simple cornstarch bioplastic?","Bahan manakah yang menghasilkan bioplastik kanji jagung yang ringkas?"],
 [["Cornstarch, water, vinegar and glycerol","Kanji jagung, air, cuka dan gliserol"],["Cornstarch, sand, cement and salt","Kanji jagung, pasir, simen dan garam"],["Flour, petrol, salt and sugar","Tepung, petrol, garam dan gula"]],
 ["Heating starch with water, a little vinegar and glycerol makes a flexible bioplastic. Ask an adult to help with the stove.","Memanaskan kanji dengan air, sedikit cuka dan gliserol menghasilkan bioplastik yang fleksibel. Minta orang dewasa membantu di dapur."]);
Q("l15","t","plastics",["In cornstarch bioplastic, what does glycerol do?","Dalam bioplastik kanji jagung, apakah fungsi gliserol?"],
 [["It is a plasticiser that makes the film flexible","Ia pemplastik yang menjadikan filem fleksibel"],["It makes the film hard and brittle","Ia menjadikan filem keras dan rapuh"],["It is a dye that gives the film colour","Ia pewarna yang memberi warna kepada filem"]],
 ["Glycerol molecules sit between starch chains and stop them packing tightly, so the material bends.","Molekul gliserol berada di antara rantai kanji dan menghalangnya bersusun rapat, jadi bahan boleh dilentur."]);
Q("l16","ta","plastics",["Why are foil-lined snack packets hard to recycle?","Mengapakah paket makanan ringan berlapik kerajang sukar dikitar semula?"],
 [["Plastic and foil layers are glued together","Lapisan plastik dan kerajang dilekatkan bersama"],["Their bright inks poison recycling machines","Dakwat terangnya meracuni mesin kitar semula"],["They are made of thin sheets of glass","Ia diperbuat daripada kepingan kaca nipis"]],
 ["Multilayer packaging mixes materials. That is why reuse or upcycling ideas (e.g. weaving) are used for them.","Pembungkusan berbilang lapisan mencampurkan bahan. Itulah sebabnya idea guna semula atau kitar naik (cth. anyaman) digunakan."]);
Q("l17","kt","plastics",["Sea turtles sometimes eat plastic bags because…","Penyu kadang-kadang memakan beg plastik kerana…"],
 [["Floating bags look like jellyfish, their food","Beg yang terapung kelihatan seperti obor-obor, makanannya"],["Plastic tastes sweet","Plastik rasanya manis"],["Turtles collect plastic for nests","Penyu mengumpul plastik untuk sarang"]],
 ["A bag in the water looks like a jellyfish. Eating plastic can make turtles very sick.","Beg dalam air kelihatan seperti obor-obor. Memakan plastik boleh membuatkan penyu sakit teruk."]);
Q("l18","a","plastics",["Why can “compostable” plastic items cause problems in normal plastic recycling?","Mengapakah barang plastik “boleh kompos” boleh menimbulkan masalah dalam kitar semula plastik biasa?"],
 [["They contaminate the stream and weaken recycled plastic","Ia mencemarkan aliran dan melemahkan plastik kitar semula"],["They make recycled plastic too strong to mould","Ia menjadikan plastik kitar semula terlalu kuat untuk dibentuk"],["They turn the recycling plant into a compost site","Ia menukar loji kitar semula menjadi tapak kompos"]],
 ["Different polymers do not mix well. Compostables need their own collection and composting route.","Polimer berbeza tidak bercampur dengan baik. Bahan boleh kompos memerlukan laluan kutipan dan pengkomposan tersendiri."]);

/* ---------------- labs & used cooking oil ---------------- */
Q("b01","kta","labs",["Why shouldn’t used cooking oil be poured down the sink?","Mengapakah minyak masak terpakai tidak patut dituang ke dalam sinki?"],
 [["It hardens, blocks pipes and pollutes rivers","Ia mengeras, menyumbat paip dan mencemarkan sungai"],["It cleans the pipes and makes them shine","Ia membersihkan paip dan menjadikannya berkilat"],["It turns into clean water in the drain","Ia bertukar menjadi air bersih di dalam longkang"]],
 ["Oil sticks inside drains, blocks them and harms fish. Collect it in a bottle instead.","Minyak melekat dalam longkang, menyumbatnya dan membahayakan ikan. Kumpulkan dalam botol."]);
Q("b02","kta","labs",["Used cooking oil can be turned into…","Minyak masak terpakai boleh dijadikan…"],
 [["Candles, soap or biodiesel","Lilin, sabun atau biodiesel"],["Drinking water or juice","Air minuman atau jus"],["Glass jars or bottles","Balang atau botol kaca"]],
 ["Old oil can become useful products instead of pollution.","Minyak lama boleh menjadi produk berguna dan bukannya pencemaran."]);
Q("b03","kt","labs",["What is the first step before making a candle from used cooking oil?","Apakah langkah pertama sebelum membuat lilin daripada minyak masak terpakai?"],
 [["Filter out the food bits","Tapis cebisan makanan"],["Add cold water to it","Tambah air sejuk ke dalamnya"],["Freeze the oil solid","Bekukan minyak sehingga keras"]],
 ["Food bits would burn and smell, so we strain the cool oil first.","Cebisan makanan akan terbakar dan berbau, jadi kita menapis minyak yang sejuk dahulu."]);
Q("b04","k","labs",["A lab uses hot wax or a stove. Who should handle the hot parts?","Satu makmal menggunakan lilin panas atau dapur. Siapakah yang patut mengendalikan bahagian panas?"],
 [["An adult; children help with the cool steps","Orang dewasa; kanak-kanak membantu langkah yang sejuk"],["The youngest child, so they can learn","Kanak-kanak paling kecil, supaya mereka belajar"],["Anyone at all, with nobody watching","Sesiapa sahaja, tanpa diawasi"]],
 ["Hot oil and wax can burn badly. Grown-ups do the hot steps.","Minyak dan lilin panas boleh melecurkan teruk. Orang dewasa membuat langkah yang panas."]);
Q("b05","ta","labs",["Making soap from oil uses lye (sodium hydroxide, NaOH). What is the key safety rule?","Membuat sabun daripada minyak menggunakan soda kaustik (natrium hidroksida, NaOH). Apakah peraturan keselamatan utama?"],
 [["Adult supervision, gloves and goggles: lye burns skin","Pengawasan dewasa, sarung tangan dan gogal: soda kaustik melecurkan kulit"],["Taste a tiny drop to check its strength","Rasa setitik kecil untuk menguji kekuatannya"],["Stir it quickly with bare hands to save time","Kacau dengan cepat menggunakan tangan kosong"]],
 ["NaOH burns skin and eyes. Always add lye to water (never water to lye) in a ventilated space.","NaOH melecurkan kulit dan mata. Sentiasa masukkan soda kaustik ke dalam air (bukan air ke dalam soda kaustik) di ruang berpengudaraan."]);
Q("b06","ta","labs",["The reaction of oil or fat with sodium hydroxide to make soap is called…","Tindak balas minyak atau lemak dengan natrium hidroksida untuk menghasilkan sabun dipanggil…"],
 [["Saponification","Saponifikasi"],["Photosynthesis","Fotosintesis"],["Fermentation","Penapaian"],["Combustion","Pembakaran"]],
 ["Triglyceride + NaOH → soap (sodium salts of fatty acids) + glycerol.","Trigliserida + NaOH → sabun (garam natrium asid lemak) + gliserol."]);
Q("b07","ta","labs",["Biodiesel is made from used cooking oil by transesterification. The main by-product is…","Biodiesel dihasilkan daripada minyak masak terpakai melalui transesterifikasi. Hasil sampingan utamanya ialah…"],
 [["Glycerol","Gliserol"],["Petrol","Petrol"],["Salt water","Air garam"]],
 ["Oil reacts with an alcohol (usually methanol) and a catalyst, giving fatty-acid methyl esters (biodiesel) plus glycerol.","Minyak bertindak balas dengan alkohol (biasanya metanol) dan mangkin, menghasilkan ester metil asid lemak (biodiesel) serta gliserol."]);
Q("b08","ta","labs",["A candle recipe uses oil : wax = 1 : 2. You have 50 g of filtered oil. How much wax do you need?","Resipi lilin menggunakan minyak : lilin = 1 : 2. Anda ada 50 g minyak yang ditapis. Berapakah lilin yang diperlukan?"],
 [["100 g","100 g"],["25 g","25 g"],["50 g","50 g"]],
 ["Wax is twice the oil: 50 × 2 = 100 g.","Lilin ialah dua kali ganda minyak: 50 × 2 = 100 g."]);
Q("b09","kt","labs",["How does a self-watering plant pot made from a plastic bottle keep the soil moist?","Bagaimanakah pasu siram sendiri daripada botol plastik memastikan tanah lembap?"],
 [["A cloth wick pulls water up from below","Sumbu kain menarik air dari bawah"],["The plastic slowly turns into water","Plastik perlahan-lahan bertukar menjadi air"],["Sunlight pumps water up through the cap","Cahaya matahari mengepam air melalui penutup"]],
 ["Water climbs up the cloth by capillary action, like tea climbing up a biscuit.","Air naik melalui kain secara tindakan kapilari, seperti teh naik ke dalam biskut."]);
Q("b10","ta","labs",["What is an eco-brick?","Apakah itu bata eko (eco-brick)?"],
 [["A bottle packed hard with clean, dry plastic, used for building","Botol yang dipadatkan dengan plastik bersih dan kering, untuk binaan"],["A brick made by melting glass bottles in a kiln","Bata yang dibuat dengan meleburkan botol kaca dalam tanur"],["A block of dried compost pressed into a mould","Blok kompos kering yang dimampatkan dalam acuan"]],
 ["Eco-bricks lock away soft plastic that is hard to recycle and turn it into benches or garden walls.","Bata eko menyimpan plastik lembut yang sukar dikitar dan menjadikannya bangku atau dinding taman."]);
Q("b11","kt","labs",["Why must plastic stuffed into an eco-brick be clean and dry?","Mengapakah plastik yang dimasukkan ke dalam bata eko mesti bersih dan kering?"],
 [["Leftover food would rot, smell and grow germs","Sisa makanan akan reput, berbau dan membiakkan kuman"],["Wet plastic packs in tighter and stronger","Plastik basah lebih padat dan lebih kuat"],["Clean plastic makes the bottle lighter","Plastik bersih menjadikan botol lebih ringan"]],
 ["A sealed bottle with food inside becomes a smelly germ bottle.","Botol tertutup yang berisi makanan akan menjadi botol kuman yang berbau."]);
Q("b12","a","labs",["Why is collecting used cooking oil for biodiesel valued in a circular economy?","Mengapakah pengumpulan minyak masak terpakai untuk biodiesel dihargai dalam ekonomi kitaran?"],
 [["It turns polluting waste oil into a diesel substitute","Ia menukar sisa minyak yang mencemar menjadi pengganti diesel"],["It makes fresh cooking oil cheaper to produce","Ia menjadikan minyak masak baharu lebih murah dihasilkan"],["It sends more waste oil safely to landfill","Ia menghantar lebih banyak sisa minyak ke tapak pelupusan dengan selamat"]],
 ["A waste stream that blocks drains becomes a feedstock with a market value.","Aliran sisa yang menyumbat longkang menjadi bahan suapan yang mempunyai nilai pasaran."]);
Q("b13","t","labs",["Why should a home-made pet food from fish waste be cooked thoroughly (with an adult)?","Mengapakah makanan haiwan buatan sendiri daripada sisa ikan perlu dimasak sepenuhnya (bersama orang dewasa)?"],
 [["Heat kills harmful germs in raw fish waste","Haba membunuh kuman berbahaya dalam sisa ikan mentah"],["Cooking makes the food a nicer colour","Memasak menjadikan makanan berwarna lebih menarik"],["Raw fish waste is too light to measure","Sisa ikan mentah terlalu ringan untuk disukat"]],
 ["Raw fish spoils quickly. Proper cooking and cooling make it safer, and bones must be checked.","Ikan mentah cepat rosak. Memasak dan menyejukkan dengan betul menjadikannya lebih selamat, dan tulang mesti diperiksa."]);

Q("b14","kt","labs",["In a bottle vertical garden, why do the bottles need small holes underneath?","Dalam taman menegak botol, mengapakah botol memerlukan lubang kecil di bawah?"],
 [["So extra water drains and the roots get air","Supaya air berlebihan mengalir keluar dan akar mendapat udara"],["So insects can get in to eat the plants","Supaya serangga boleh masuk dan memakan tumbuhan"],["So the bottle is lighter to carry","Supaya botol lebih ringan untuk dibawa"]],
 ["Roots need oxygen. Waterlogged soil has no air, so the roots rot. The water that drains out also waters the bottle below.","Akar memerlukan oksigen. Tanah yang tepu air tiada udara, jadi akar reput. Air yang mengalir keluar juga menyiram botol di bawah."]);
Q("b15","ta","labs",["In the Kratky bottle hydroponics method, why should you NOT keep refilling the bottle to the top?","Dalam kaedah hidroponik botol Kratky, mengapakah anda TIDAK patut terus mengisi botol sehingga penuh?"],
 [["The upper roots need an air gap to get oxygen","Akar atas memerlukan ruang udara untuk mendapat oksigen"],["Plants can only drink from a half-empty bottle","Tumbuhan hanya boleh minum dari botol separuh kosong"],["Nutrients only dissolve in a small amount of water","Nutrien hanya larut dalam sedikit air"]],
 ["With no pump, the falling water level leaves moist air around the upper roots so they can breathe.","Tanpa pam, paras air yang turun meninggalkan udara lembap di sekeliling akar atas supaya akar boleh bernafas."]);
Q("b16","ta","labs",["Which plastic must NEVER be ironed or heated to make fused plastic fabric?","Plastik manakah yang TIDAK BOLEH sama sekali diseterika atau dipanaskan untuk membuat fabrik plastik cantum?"],
 [["PVC (resin code 3)","PVC (kod resin 3)"],["LDPE carrier bags (code 4)","Beg plastik LDPE (kod 4)"],["HDPE carrier bags (code 2)","Beg plastik HDPE (kod 2)"]],
 ["Heated PVC gives off hydrogen chloride and other toxic fumes. Only PE bags (2 or 4), ironed by an adult between baking paper.","PVC yang dipanaskan membebaskan hidrogen klorida dan wasap toksik lain. Hanya beg PE (2 atau 4), diseterika oleh orang dewasa di antara kertas pembakar."]);
Q("b17","kta","labs",["A bubble-wrap float ring holds up 2 kg in a basin. What is it safe to use it for?","Gelang pelampung balutan gelembung menampung 2 kg dalam besen. Untuk apakah ia selamat digunakan?"],
 [["Only as a science model, never for swimming or floods","Hanya sebagai model sains, bukan untuk berenang atau banjir"],["Rescuing a child in a flood","Menyelamatkan kanak-kanak semasa banjir"],["Swimming in the sea","Berenang di laut"]],
 ["Home-made floats are not tested and can burst or leak. In a flood, stay out of the water and call 999; to help someone, reach or throw, don't go.","Pelampung buatan sendiri tidak diuji dan boleh pecah atau bocor. Semasa banjir, jauhi air dan hubungi 999; untuk membantu seseorang, hulur atau baling, jangan terjun."]);
Q("b18","kt","labs",["Why does a bubble-wrap mat keep you warmer on a cold floor?","Mengapakah tikar balutan gelembung memastikan anda lebih hangat di atas lantai yang sejuk?"],
 [["The trapped air in the bubbles is bad at carrying heat","Udara yang terperangkap dalam gelembung lemah membawa haba"],["Plastic makes its own heat","Plastik menghasilkan habanya sendiri"],["The bubbles reflect all the cold away","Gelembung memantulkan semua kesejukan"]],
 ["Still air is a good insulator, so less body heat leaks into the floor.","Udara pegun ialah penebat yang baik, jadi kurang haba badan hilang ke lantai."]);

/* ---------------- Malaysian data and law ---------------- */
Q("m01","k","malaysia",["About how much rubbish does each person in Malaysia throw away every day?","Kira-kira berapa banyak sampah yang dibuang oleh setiap orang di Malaysia setiap hari?"],
 [["About 1 kg: like a 1-litre bottle of water","Kira-kira 1 kg: seperti sebotol air 1 liter"],["About 10 g: like a pencil","Kira-kira 10 g: seperti sebatang pensel"],["About 100 kg: like a fridge","Kira-kira 100 kg: seperti sebuah peti sejuk"]],
 ["Each Malaysian throws away about 1.17 kg of waste a day. That adds up fast!","Setiap rakyat Malaysia membuang kira-kira 1.17 kg sisa sehari. Jumlahnya cepat bertambah!"]);
Q("m02","ta","malaysia",["How much solid waste did Malaysia generate per day in 2024 (SWCorp)?","Berapakah sisa pepejal yang dijana Malaysia sehari pada tahun 2024 (SWCorp)?"],
 [["About 39,000 tonnes","Kira-kira 39,000 tan"],["About 3,900 tonnes","Kira-kira 3,900 tan"],["About 390,000 tonnes","Kira-kira 390,000 tan"]],
 ["SWCorp reported about 39,078 tonnes per day in 2024.","SWCorp melaporkan kira-kira 39,078 tan sehari pada tahun 2024."]);
Q("m03","ta","malaysia",["How much waste does the average Malaysian generate per day?","Berapakah sisa yang dijana oleh purata rakyat Malaysia sehari?"],
 [["About 1.17 kg","Kira-kira 1.17 kg"],["About 0.17 kg","Kira-kira 0.17 kg"],["About 11.7 kg","Kira-kira 11.7 kg"]],
 ["About 1.17 kg per person per day (SWCorp, 2024).","Kira-kira 1.17 kg seorang sehari (SWCorp, 2024)."]);
Q("m04","kta","malaysia",["What is the BIGGEST part of household rubbish in Malaysia?","Apakah bahagian TERBESAR sampah isi rumah di Malaysia?"],
 [["Food waste","Sisa makanan"],["Glass","Kaca"],["Metal","Logam"]],
 ["Food is about 30.6% of household waste, much more than glass (2.7%) or metal (2.4%).","Makanan ialah kira-kira 30.6% sisa isi rumah, jauh lebih banyak daripada kaca (2.7%) atau logam (2.4%)."]);
Q("m05","ta","malaysia",["What share of Malaysian household waste is food waste?","Berapakah peratusan sisa makanan dalam sisa isi rumah Malaysia?"],
 [["About 31%","Kira-kira 31%"],["About 3%","Kira-kira 3%"],["About 80%","Kira-kira 80%"]],
 ["Food waste is 30.6%: nearly one-third. Composting at home tackles the largest fraction.","Sisa makanan ialah 30.6%: hampir satu pertiga. Pengkomposan di rumah menangani bahagian terbesar."]);
Q("m06","ta","malaysia",["After food, which is the second-largest part of Malaysian household waste?","Selepas makanan, apakah bahagian kedua terbesar sisa isi rumah Malaysia?"],
 [["Plastic (about 22%)","Plastik (kira-kira 22%)"],["Glass (about 3%)","Kaca (kira-kira 3%)"],["Textiles (about 2%)","Tekstil (kira-kira 2%)"]],
 ["Plastic is 21.9%, then paper 15.3% and disposable diapers 8.2%.","Plastik ialah 21.9%, diikuti kertas 15.3% dan lampin pakai buang 8.2%."]);
Q("m07","ta","malaysia",["How did Malaysia’s daily solid waste change from 2005 to 2024?","Bagaimanakah sisa pepejal harian Malaysia berubah dari 2005 hingga 2024?"],
 [["It roughly doubled","Lebih kurang berganda"],["It roughly halved","Lebih kurang berkurang separuh"],["It stayed about the same","Kekal lebih kurang sama"]],
 ["Population growth and consumption doubled daily waste in under 20 years: about 19,000 to over 39,000 tonnes a day.","Pertambahan penduduk dan penggunaan menggandakan sisa harian dalam tempoh kurang 20 tahun: kira-kira 19,000 kepada lebih 39,000 tan sehari."]);
Q("m08","ta","malaysia",["What is Act 672?","Apakah Akta 672?"],
 [["Solid Waste and Public Cleansing Management Act 2007","Akta Pengurusan Sisa Pepejal dan Pembersihan Awam 2007"],["Environmental Quality Act 1974","Akta Kualiti Alam Sekeliling 1974"],["Street, Drainage and Building Act 1974","Akta Jalan, Parit dan Bangunan 1974"]],
 ["Act 672 governs household solid waste and public cleansing in the states that adopted it.","Akta 672 mengawal sisa pepejal isi rumah dan pembersihan awam di negeri yang menerima pakainya."]);
Q("m09","ta","malaysia",["In which of these places is household separation at source mandatory under Act 672?","Di manakah pengasingan sisa isi rumah di punca diwajibkan di bawah Akta 672?"],
 [["Johor","Johor"],["Selangor","Selangor"],["Pulau Pinang","Pulau Pinang"],["Sarawak","Sarawak"]],
 ["Adopting areas: Johor, Melaka, Negeri Sembilan, Pahang, Perlis, Kedah, Kuala Lumpur and Putrajaya.","Kawasan yang menerima pakai: Johor, Melaka, Negeri Sembilan, Pahang, Perlis, Kedah, Kuala Lumpur dan Putrajaya."]);
Q("m10","ta","malaysia",["Which item makes up a surprisingly large 8.2% of Malaysian household waste?","Barang manakah yang membentuk 8.2% sisa isi rumah Malaysia, satu jumlah yang mengejutkan?"],
 [["Disposable diapers","Lampin pakai buang"],["Face masks","Pelitup muka"],["Rubber","Getah"]],
 ["Diapers are 8.2%, far more than face masks (0.7%) or rubber (1.1%). Cloth diapers are one way to reduce this.","Lampin ialah 8.2%, jauh lebih banyak daripada pelitup muka (0.7%) atau getah (1.1%). Lampin kain ialah satu cara untuk mengurangkannya."]);
Q("m11","ta","malaysia",["A family throws away 10 kg of household waste a week. Using the national average, about how much is food?","Sebuah keluarga membuang 10 kg sisa isi rumah seminggu. Menggunakan purata nasional, berapakah anggaran sisa makanan?"],
 [["About 3 kg","Kira-kira 3 kg"],["About 1 kg","Kira-kira 1 kg"],["About 6 kg","Kira-kira 6 kg"]],
 ["30.6% of 10 kg ≈ 3 kg, which could go into a compost bin instead.","30.6% daripada 10 kg ≈ 3 kg, yang boleh dimasukkan ke dalam tong kompos."]);
Q("m12","a","malaysia",["A town of 10,000 people generates waste at the national average of 1.17 kg/person/day. How much per day?","Sebuah pekan dengan 10,000 penduduk menjana sisa pada purata nasional 1.17 kg/orang/hari. Berapa sehari?"],
 [["11.7 tonnes","11.7 tan"],["1.17 tonnes","1.17 tan"],["117 tonnes","117 tan"]],
 ["10,000 × 1.17 kg = 11,700 kg = 11.7 tonnes per day.","10,000 × 1.17 kg = 11,700 kg = 11.7 tan sehari."]);
Q("m13","a","malaysia",["At 1.17 kg per day, about how much waste does one person generate in a year?","Pada kadar 1.17 kg sehari, berapakah anggaran sisa yang dijana seorang dalam setahun?"],
 [["About 430 kg","Kira-kira 430 kg"],["About 43 kg","Kira-kira 43 kg"],["About 4.3 tonnes","Kira-kira 4.3 tan"]],
 ["1.17 × 365 ≈ 427 kg per person every year.","1.17 × 365 ≈ 427 kg setiap tahun bagi setiap orang."]);
Q("m14","ta","malaysia",["About what share of Malaysian household waste is hazardous household waste (batteries, chemicals and similar)?","Kira-kira berapakah bahagian sisa berbahaya isi rumah (bateri, bahan kimia dan seumpamanya) dalam sisa isi rumah Malaysia?"],
 [["About 4%","Kira-kira 4%"],["About 40%","Kira-kira 40%"],["About 0.04%","Kira-kira 0.04%"]],
 ["Hazardous household waste is 4.2%: small by weight, but it can poison soil and water if mixed with normal rubbish.","Sisa berbahaya isi rumah ialah 4.2%: kecil dari segi berat, tetapi boleh mencemarkan tanah dan air jika dicampur dengan sampah biasa."]);
Q("m15","kt","malaysia",["In Malaysia, what colour is the SWCorp recycling bin for glass?","Di Malaysia, apakah warna tong kitar semula SWCorp untuk kaca?"],
 [["Brown","Coklat"],["Blue","Biru"],["Orange","Oren"]],
 ["Remember: blue = paper, orange = plastic and metal, brown = glass.","Ingat: biru = kertas, oren = plastik dan logam, coklat = kaca."]);

/* ---------------- SDGs ---------------- */
Q("g01","kta","sdg",["SDG 12 is about…","SDG 12 berkaitan dengan…"],
 [["Responsible consumption and production","Penggunaan dan pengeluaran yang bertanggungjawab"],["Clean water and sanitation","Air bersih dan sanitasi"],["Industry, innovation and infrastructure","Industri, inovasi dan infrastruktur"]],
 ["SDG 12 means using things wisely and making less waste.","SDG 12 bermaksud menggunakan barang dengan bijak dan mengurangkan sisa."]);
Q("g02","kta","sdg",["SDG 13 is…","SDG 13 ialah…"],
 [["Climate action","Tindakan iklim"],["Quality education","Pendidikan berkualiti"],["Clean water and sanitation","Air bersih dan sanitasi"]],
 ["SDG 13 is about stopping climate change and coping with it.","SDG 13 berkaitan menghentikan perubahan iklim dan menghadapinya."]);
Q("g03","kta","sdg",["SDG 15 is…","SDG 15 ialah…"],
 [["Life on land","Kehidupan di darat"],["Life below water","Kehidupan di bawah air"],["Affordable and clean energy","Tenaga mampu milik dan bersih"]],
 ["SDG 15 protects forests, soil and animals on land.","SDG 15 melindungi hutan, tanah dan haiwan di darat."]);
Q("g04","kta","sdg",["How many Sustainable Development Goals (SDGs) are there?","Berapakah bilangan Matlamat Pembangunan Mampan (SDG)?"],
 [["17","17"],["10","10"],["25","25"]],
 ["There are 17 goals, agreed by the United Nations in 2015.","Terdapat 17 matlamat yang dipersetujui oleh Pertubuhan Bangsa-Bangsa Bersatu pada tahun 2015."]);
Q("g05","ta","sdg",["By which year are the SDGs meant to be achieved?","Menjelang tahun berapakah SDG sepatutnya dicapai?"],
 [["2030","2030"],["2050","2050"],["2025","2025"]],
 ["The 2030 Agenda for Sustainable Development sets 2030 as the target year.","Agenda 2030 bagi Pembangunan Mampan menetapkan 2030 sebagai tahun sasaran."]);
Q("g06","a","sdg",["SDG target 12.3 aims to…","Sasaran SDG 12.3 bertujuan untuk…"],
 [["Halve per-capita food waste at retail and consumer level by 2030","Mengurangkan separuh sisa makanan per kapita di peringkat runcit dan pengguna menjelang 2030"],["Ban all single-use plastics worldwide by 2030","Mengharamkan semua plastik sekali guna di seluruh dunia menjelang 2030"],["Double recycling rates for all household waste by 2030","Menggandakan kadar kitar semula semua sisa isi rumah menjelang 2030"]],
 ["Target 12.3 also aims to reduce food losses along production and supply chains.","Sasaran 12.3 juga bertujuan mengurangkan kehilangan makanan sepanjang rantaian pengeluaran dan bekalan."]);
Q("g07","ta","sdg",["Which SDG most directly covers plastic pollution in the ocean?","SDG manakah yang paling berkaitan secara langsung dengan pencemaran plastik di lautan?"],
 [["SDG 14 Life below water","SDG 14 Kehidupan di bawah air"],["SDG 4 Quality education","SDG 4 Pendidikan berkualiti"],["SDG 16 Peace and justice","SDG 16 Keamanan dan keadilan"]],
 ["SDG 14 includes a target to reduce marine pollution, including marine debris.","SDG 14 mengandungi sasaran mengurangkan pencemaran marin, termasuk sampah marin."]);
Q("g08","kt","sdg",["A school compost garden that makes the soil healthy supports which SDG?","Taman kompos sekolah yang menyuburkan tanah menyokong SDG yang mana?"],
 [["SDG 15 Life on land","SDG 15 Kehidupan di darat"],["SDG 1 No poverty","SDG 1 Tiada kemiskinan"],["SDG 16 Peace and justice","SDG 16 Keamanan dan keadilan"]],
 ["Healthy soil helps plants and animals on land.","Tanah yang subur membantu tumbuhan dan haiwan di darat."]);
Q("g09","a","sdg",["A W2W social enterprise that pays fair wages to local women making soap from used oil links most directly to…","Perusahaan sosial W2W yang membayar upah adil kepada wanita tempatan untuk membuat sabun daripada minyak terpakai paling berkaitan dengan…"],
 [["SDG 8 Decent work and economic growth","SDG 8 Pekerjaan wajar dan pertumbuhan ekonomi"],["SDG 14 Life below water","SDG 14 Kehidupan di bawah air"],["SDG 6 Clean water and sanitation","SDG 6 Air bersih dan sanitasi"]],
 ["Fair, paid work is the core of SDG 8. (The product itself also supports SDG 12.)","Pekerjaan yang adil dan berbayar ialah teras SDG 8. (Produk itu sendiri juga menyokong SDG 12.)"]);
Q("g10","ta","sdg",["Composting food waste instead of landfilling it cuts methane. Which SDG does this support most directly?","Mengkompos sisa makanan dan bukannya menghantarnya ke tapak pelupusan mengurangkan metana. SDG manakah yang paling disokong secara langsung?"],
 [["SDG 13 Climate action","SDG 13 Tindakan iklim"],["SDG 4 Quality education","SDG 4 Pendidikan berkualiti"],["SDG 16 Peace and justice","SDG 16 Keamanan dan keadilan"]],
 ["Methane is a strong greenhouse gas, so cutting it is climate action.","Metana ialah gas rumah hijau yang kuat, jadi mengurangkannya ialah tindakan iklim."]);

/* ---------------- greenhouse gases, landfill, energy ---------------- */
Q("n01","kta","energy",["Food rotting in a landfill makes which greenhouse gas?","Makanan yang mereput di tapak pelupusan menghasilkan gas rumah hijau yang mana?"],
 [["Methane","Metana"],["Oxygen","Oksigen"],["Helium","Helium"]],
 ["Buried food rots without air and gives off methane, a gas that heats up the planet.","Makanan yang tertanam mereput tanpa udara dan membebaskan metana, gas yang memanaskan bumi."]);
Q("n02","ta","energy",["Over 100 years, one tonne of methane warms the climate about how much more than one tonne of CO₂?","Dalam tempoh 100 tahun, satu tan metana memanaskan iklim kira-kira berapa kali lebih banyak daripada satu tan CO₂?"],
 [["About 28 times","Kira-kira 28 kali"],["The same","Sama"],["Half as much","Separuh sahaja"]],
 ["The IPCC (AR5) gives methane a 100-year global warming potential of about 28.","IPCC (AR5) memberikan metana potensi pemanasan global 100 tahun kira-kira 28."]);
Q("n03","ta","energy",["Why do landfills produce methane?","Mengapakah tapak pelupusan menghasilkan metana?"],
 [["Organic waste rots without oxygen (anaerobic)","Sisa organik reput tanpa oksigen (anaerobik)"],["Sunlight reacts with the plastic on top","Cahaya matahari bertindak balas dengan plastik di atas"],["Rainwater dissolves metals in the rubbish","Air hujan melarutkan logam dalam sampah"]],
 ["Deep in a landfill there is no oxygen, so methane-producing microbes take over.","Di dalam tapak pelupusan tiada oksigen, jadi mikrob penghasil metana mengambil alih."]);
Q("n04","a","energy",["What does landfill gas capture do?","Apakah fungsi pemerangkapan gas tapak pelupusan?"],
 [["Captures methane and burns it, often for electricity","Memerangkap metana dan membakarnya, selalunya untuk elektrik"],["Pumps fresh air in so the rubbish dries out","Mengepam udara segar supaya sampah menjadi kering"],["Releases the gas faster so the site settles sooner","Membebaskan gas lebih cepat supaya tapak cepat mendap"]],
 ["Burning methane turns it into CO₂, which has far lower warming impact, and the energy can be used.","Membakar metana menukarnya kepada CO₂ yang kesan pemanasannya jauh lebih rendah, dan tenaganya boleh digunakan."]);
Q("n05","kt","energy",["What does a greenhouse gas do?","Apakah yang dilakukan oleh gas rumah hijau?"],
 [["Traps heat, making the Earth warmer","Memerangkap haba, menjadikan bumi lebih panas"],["Blocks sunlight, making the Earth colder","Menghalang cahaya matahari, menjadikan bumi lebih sejuk"],["Turns leaves purple, making plants sick","Menjadikan daun ungu, membuatkan tumbuhan sakit"]],
 ["Greenhouse gases act like a blanket around the Earth. Too much makes the planet too hot.","Gas rumah hijau bertindak seperti selimut di sekeliling bumi. Terlalu banyak menjadikan bumi terlalu panas."]);
Q("n06","ta","energy",["Making a can from recycled aluminium saves up to about how much energy compared with new aluminium from ore?","Membuat tin daripada aluminium kitar semula menjimatkan sehingga kira-kira berapa banyak tenaga berbanding aluminium baharu daripada bijih?"],
 [["About 95%","Kira-kira 95%"],["About 5%","Kira-kira 5%"],["None","Tiada langsung"]],
 ["Extracting aluminium from bauxite needs huge amounts of electricity; remelting scrap needs only a small fraction.","Mengekstrak aluminium daripada bauksit memerlukan elektrik yang sangat banyak; meleburkan sekerap hanya memerlukan sebahagian kecil."]);
Q("n07","k","energy",["Which choice saves the most energy?","Pilihan manakah yang paling menjimatkan tenaga?"],
 [["Refilling the same water bottle every day","Mengisi semula botol air yang sama setiap hari"],["Buying a new bottle every day","Membeli botol baharu setiap hari"],["Throwing bottles in the drain","Membuang botol ke dalam longkang"]],
 ["Making new bottles uses energy. Reusing one bottle saves it.","Membuat botol baharu menggunakan tenaga. Menggunakan semula sebotol menjimatkannya."]);
Q("n08","ta","energy",["Biogas from the anaerobic digestion of food waste is mainly…","Biogas daripada penguraian anaerobik sisa makanan terutamanya terdiri daripada…"],
 [["Methane and carbon dioxide","Metana dan karbon dioksida"],["Oxygen and nitrogen","Oksigen dan nitrogen"],["Hydrogen and helium","Hidrogen dan helium"]],
 ["In a closed digester the methane is captured as fuel instead of escaping, and the leftover digestate is a fertiliser.","Dalam pencerna tertutup, metana diperangkap sebagai bahan api dan tidak terlepas, dan baki digestat menjadi baja."]);
Q("n09","a","energy",["Which is a real concern with waste-to-energy incineration?","Yang manakah kebimbangan sebenar tentang insinerasi sisa kepada tenaga?"],
 [["Long waste-supply contracts can discourage recycling, and emissions need strict control","Kontrak bekalan sisa jangka panjang boleh melemahkan kitar semula, dan pelepasan perlu dikawal ketat"],["It leaves no ash and releases no emissions, so it needs no pollution controls","Ia tidak meninggalkan abu dan tiada pelepasan, jadi tidak perlu kawalan pencemaran"],["It sits at the top of the waste hierarchy, above reduce and reuse","Ia berada di puncak hierarki sisa, di atas pengurangan dan guna semula"]],
 ["Incineration recovers energy but sits below recycling; it also produces ash and flue gases that must be treated.","Insinerasi memulihkan tenaga tetapi berada di bawah kitar semula; ia juga menghasilkan abu dan gas serombong yang perlu dirawat."]);
Q("n10","a","energy",["A product’s “carbon footprint” is…","“Jejak karbon” sesuatu produk ialah…"],
 [["Total greenhouse gases it causes, in CO₂-equivalent","Jumlah gas rumah hijau yang disebabkannya, dalam setara CO₂"],["How much carbon (graphite) is inside it","Berapa banyak karbon (grafit) di dalamnya"],["The weight of its packaging in kilograms","Berat pembungkusannya dalam kilogram"]],
 ["CO₂-equivalent converts gases like methane into the same warming units as CO₂ so they can be added up.","Setara CO₂ menukar gas seperti metana kepada unit pemanasan yang sama dengan CO₂ supaya boleh dijumlahkan."]);

/* ---------------- economy, ESG, greenwashing, EPR, W2W business maths ---------------- */
Q("x01","a","economy",["ESG stands for…","ESG bermaksud…"],
 [["Environmental, Social and Governance","Alam Sekitar, Sosial dan Tadbir Urus"],["Energy, Sales and Growth","Tenaga, Jualan dan Pertumbuhan"],["Eco, Safety and Green","Eko, Keselamatan dan Hijau"]],
 ["ESG is how investors and companies assess sustainability and ethical performance.","ESG ialah cara pelabur dan syarikat menilai prestasi kemampanan dan etika."]);
Q("x02","a","economy",["Which ESG pillar covers community programmes and worker safety?","Tonggak ESG manakah yang merangkumi program komuniti dan keselamatan pekerja?"],
 [["Social","Sosial"],["Environmental","Alam Sekitar"],["Governance","Tadbir Urus"]],
 ["“S” is about people: employees, communities, customers and supply-chain workers.","“S” berkaitan manusia: pekerja, komuniti, pelanggan dan pekerja rantaian bekalan."]);
Q("x03","a","economy",["Which is an example of the GOVERNANCE pillar of ESG?","Yang manakah contoh tonggak TADBIR URUS dalam ESG?"],
 [["Board oversight, business ethics and anti-corruption policies","Pengawasan lembaga pengarah, etika perniagaan dan dasar antirasuah"],["Measuring carbon emissions","Mengukur pelepasan karbon"],["Running community recycling workshops","Menganjurkan bengkel kitar semula komuniti"]],
 ["Governance is how a company is directed and controlled, including accountability for its ESG targets.","Tadbir urus ialah cara syarikat diarah dan dikawal, termasuk akauntabiliti terhadap sasaran ESG."]);
Q("x04","a","economy",["What is greenwashing?","Apakah itu greenwashing (dakwaan hijau palsu)?"],
 [["Misleading claims that something is greener than it is","Dakwaan mengelirukan bahawa sesuatu lebih hijau daripada sebenarnya"],["Washing products with plant-based green soap","Membasuh produk dengan sabun hijau berasaskan tumbuhan"],["Painting factories green so they blend with nature","Mengecat kilang hijau supaya sebati dengan alam"]],
 ["Greenwashing damages trust and can mislead consumers and investors.","Greenwashing merosakkan kepercayaan dan boleh mengelirukan pengguna serta pelabur."]);
Q("x05","a","economy",["Which is a red flag for greenwashing?","Yang manakah tanda amaran greenwashing?"],
 [["Vague words such as “eco-friendly” or “natural” with no evidence","Perkataan kabur seperti “mesra alam” atau “semula jadi” tanpa bukti"],["A clear percentage of recycled content with proof","Peratusan kandungan kitar semula yang jelas dengan bukti"],["An independent third-party certification","Pensijilan pihak ketiga yang bebas"]],
 ["Good claims are specific, measurable and verifiable.","Dakwaan yang baik adalah spesifik, boleh diukur dan boleh disahkan."]);
Q("x06","a","economy",["A brand labels its pouch “100% recyclable”, but no facility in Malaysia accepts that material. This claim is…","Satu jenama melabel pek pembungkusnya “100% boleh dikitar semula”, tetapi tiada kemudahan di Malaysia yang menerima bahan itu. Dakwaan ini…"],
 [["Misleading: recyclable in theory only","Mengelirukan: boleh dikitar secara teori sahaja"],["Honest: the material can be recycled somewhere","Jujur: bahan itu boleh dikitar di suatu tempat"],["An example of extended producer responsibility","Contoh tanggungjawab pengeluar lanjutan"]],
 ["A recyclability claim should reflect real collection and recycling routes where the product is sold.","Dakwaan boleh dikitar semula patut mencerminkan laluan kutipan dan kitar semula sebenar di tempat produk dijual."]);
Q("x07","a","economy",["What does Extended Producer Responsibility (EPR) mean?","Apakah maksud Tanggungjawab Pengeluar Lanjutan (EPR)?"],
 [["Producers pay for and manage their products after use","Pengeluar membayar dan mengurus produk mereka selepas digunakan"],["Consumers pay all waste collection and recycling costs","Pengguna membayar semua kos kutipan sisa dan kitar semula"],["The government bans packaging on all imported products","Kerajaan mengharamkan pembungkusan bagi semua produk import"]],
 ["EPR shifts collection and recycling costs towards the companies that put products on the market.","EPR mengalihkan kos kutipan dan kitar semula kepada syarikat yang memasarkan produk."]);
Q("x08","a","economy",["Why does EPR encourage better product design?","Mengapakah EPR menggalakkan reka bentuk produk yang lebih baik?"],
 [["Paying end-of-life costs rewards less material and easier recycling","Membayar kos akhir hayat memberi ganjaran kepada kurang bahan dan kitar semula yang lebih mudah"],["It requires all packaging to be heavier so it lasts longer","Ia mewajibkan semua pembungkusan lebih berat supaya lebih tahan lama"],["It shifts all recycling costs back to households and councils","Ia memindahkan semua kos kitar semula kembali kepada isi rumah dan majlis"]],
 ["Fees under EPR are often lower for packaging that is lighter and easier to recycle.","Yuran EPR selalunya lebih rendah bagi pembungkusan yang lebih ringan dan lebih mudah dikitar."]);
Q("x09","a","economy",["Bursa Malaysia requires listed companies to publish…","Bursa Malaysia mewajibkan syarikat tersenarai menerbitkan…"],
 [["A sustainability statement in their annual report","Penyata kemampanan dalam laporan tahunan"],["Their product recipes","Resipi produk mereka"],["Their employees’ home addresses","Alamat rumah pekerja mereka"]],
 ["Listed issuers must report on material economic, environmental and social risks and opportunities.","Penerbit tersenarai mesti melaporkan risiko dan peluang ekonomi, alam sekitar dan sosial yang material."]);
Q("x10","a","economy",["Emissions from a company’s waste sent to landfill are reported under…","Pelepasan daripada sisa syarikat yang dihantar ke tapak pelupusan dilaporkan di bawah…"],
 [["Scope 3 (value chain)","Skop 3 (rantaian nilai)"],["Scope 1 (own fuel burning)","Skop 1 (pembakaran bahan api sendiri)"],["Scope 2 (purchased electricity)","Skop 2 (elektrik yang dibeli)"]],
 ["Under the GHG Protocol, “waste generated in operations” is Scope 3, category 5. Diverting waste cuts it.","Di bawah Protokol GHG, “sisa yang dijana dalam operasi” ialah Skop 3, kategori 5. Mengalihkan sisa mengurangkannya."]);
Q("x11","a","economy",["The “triple bottom line” measures a business by…","“Garis bawah tiga” (triple bottom line) menilai perniagaan berdasarkan…"],
 [["People, planet and profit","Manusia, planet dan keuntungan"],["Price, place and promotion","Harga, tempat dan promosi"],["Plastic, paper and plates","Plastik, kertas dan pinggan"]],
 ["A W2W enterprise should show social, environmental and financial results, not just profit.","Perusahaan W2W patut menunjukkan hasil sosial, alam sekitar dan kewangan, bukan keuntungan sahaja."]);
Q("x12","ta","economy",["A used-oil candle costs RM3.00 to make and sells for RM5.00. What is the profit per candle?","Lilin minyak terpakai berkos RM3.00 untuk dibuat dan dijual pada RM5.00. Berapakah untung bagi setiap lilin?"],
 [["RM2.00","RM2.00"],["RM8.00","RM8.00"],["RM5.00","RM5.00"]],
 ["Profit = price − cost = 5.00 − 3.00 = RM2.00.","Untung = harga − kos = 5.00 − 3.00 = RM2.00."]);
Q("x13","a","economy",["Same candle: cost RM3.00, price RM5.00. What is the profit MARGIN (profit ÷ price)?","Lilin yang sama: kos RM3.00, harga RM5.00. Berapakah MARGIN keuntungan (untung ÷ harga)?"],
 [["40%","40%"],["67%","67%"],["60%","60%"],["2%","2%"]],
 ["Margin = 2.00 ÷ 5.00 = 40%. (67% is the markup on cost: 2.00 ÷ 3.00.)","Margin = 2.00 ÷ 5.00 = 40%. (67% ialah markup atas kos: 2.00 ÷ 3.00.)"]);
Q("x14","a","economy",["Same candle: cost RM3.00, price RM5.00. What is the MARKUP on cost (profit ÷ cost)?","Lilin yang sama: kos RM3.00, harga RM5.00. Berapakah MARKUP atas kos (untung ÷ kos)?"],
 [["About 67%","Kira-kira 67%"],["About 40%","Kira-kira 40%"],["About 167%","Kira-kira 167%"]],
 ["Markup = 2.00 ÷ 3.00 ≈ 67%. Margin is 2.00 ÷ 5.00 = 40%; the two are often confused when pricing.","Markup = 2.00 ÷ 3.00 ≈ 67%. Margin pula 2.00 ÷ 5.00 = 40%; kedua-duanya sering dikelirukan semasa menetapkan harga."]);
Q("x15","a","economy",["Moulds and tools cost RM200 (fixed). Each candle costs RM3 to make and sells for RM5. How many must you sell to break even?","Acuan dan alatan berkos RM200 (tetap). Setiap lilin berkos RM3 dan dijual RM5. Berapa lilin perlu dijual untuk pulang modal?"],
 [["100","100"],["40","40"],["67","67"],["200","200"]],
 ["Break-even = fixed cost ÷ profit per unit = 200 ÷ (5 − 3) = 100 candles.","Pulang modal = kos tetap ÷ untung seunit = 200 ÷ (5 − 3) = 100 lilin."]);
Q("x16","ta","economy",["A bar of used-oil soap needs RM1.20 of materials and RM0.30 of packaging. It sells for RM4.00. Profit per bar?","Sebuku sabun minyak terpakai memerlukan bahan RM1.20 dan pembungkusan RM0.30. Ia dijual RM4.00. Untung sebuku?"],
 [["RM2.50","RM2.50"],["RM2.80","RM2.80"],["RM1.50","RM1.50"],["RM4.00","RM4.00"]],
 ["Unit cost = 1.20 + 0.30 = RM1.50; profit = 4.00 − 1.50 = RM2.50.","Kos seunit = 1.20 + 0.30 = RM1.50; untung = 4.00 − 1.50 = RM2.50."]);
Q("x17","a","economy",["You sell 200 soap bars a month at RM2.50 profit each. Monthly profit?","Anda menjual 200 buku sabun sebulan dengan untung RM2.50 sebuku. Untung bulanan?"],
 [["RM500","RM500"],["RM250","RM250"],["RM50","RM50"],["RM5,000","RM5,000"]],
 ["200 × 2.50 = RM500 per month (before your own time and any fixed costs).","200 × 2.50 = RM500 sebulan (sebelum mengambil kira masa anda dan sebarang kos tetap)."]);
Q("x18","a","economy",["A batch of 20 candles uses RM30 of materials and RM10 of electricity and packaging. What is the unit cost?","Satu kelompok 20 lilin menggunakan bahan RM30 dan elektrik serta pembungkusan RM10. Berapakah kos seunit?"],
 [["RM2.00","RM2.00"],["RM1.50","RM1.50"],["RM0.50","RM0.50"],["RM40.00","RM40.00"]],
 ["Unit cost = total batch cost ÷ units = (30 + 10) ÷ 20 = RM2.00.","Kos seunit = jumlah kos kelompok ÷ bilangan unit = (30 + 10) ÷ 20 = RM2.00."]);
Q("x19","a","economy",["Each candle uses 50 g of used cooking oil. Making 400 candles a month diverts how much oil from drains?","Setiap lilin menggunakan 50 g minyak masak terpakai. Membuat 400 lilin sebulan mengalihkan berapa banyak minyak daripada longkang?"],
 [["20 kg","20 kg"],["2 kg","2 kg"],["200 kg","200 kg"]],
 ["400 × 50 g = 20,000 g = 20 kg per month: a measurable impact figure for a pitch.","400 × 50 g = 20,000 g = 20 kg sebulan: angka impak yang boleh diukur untuk pembentangan."]);
Q("x20","a","economy",["Which evidence best supports an honest environmental claim for a W2W product?","Bukti manakah yang paling menyokong dakwaan alam sekitar yang jujur bagi produk W2W?"],
 [["Records of kilograms of waste diverted each month","Rekod kilogram sisa yang dialihkan setiap bulan"],["A bold “Saves the planet!” slogan on the label","Slogan “Selamatkan bumi!” yang besar pada label"],["Green packaging with leaf and globe pictures","Pembungkusan hijau dengan gambar daun dan bumi"]],
 ["Measured, recorded data can be checked by others; slogans and colours cannot.","Data yang diukur dan direkod boleh disemak oleh orang lain; slogan dan warna tidak boleh."]);
Q("x21","a","economy",["Why can waste streams such as used oil or coffee grounds give a W2W business a cost advantage?","Mengapakah aliran sisa seperti minyak terpakai atau hampas kopi boleh memberi kelebihan kos kepada perniagaan W2W?"],
 [["They are low-cost inputs and suppliers avoid disposal fees","Ia input berkos rendah dan pembekal mengelak yuran pelupusan"],["Waste never needs cleaning, sorting or testing","Sisa tidak pernah perlu dibersihkan, diasingkan atau diuji"],["Products made from waste are exempt from safety rules","Produk daripada sisa dikecualikan daripada peraturan keselamatan"]],
 ["Cheap input is an advantage, but collection, cleaning, quality control and safety still cost money.","Input murah ialah kelebihan, tetapi kutipan, pembersihan, kawalan kualiti dan keselamatan masih memerlukan kos."]);
Q("x22","ta","economy",["Your eco-soap sells at RM4.00 but costs RM4.50 to make. What does this mean?","Sabun eko anda dijual pada RM4.00 tetapi kos membuatnya RM4.50. Apakah maksudnya?"],
 [["You lose RM0.50 per bar: cut costs or raise the price","Anda rugi RM0.50 sebuku: kurangkan kos atau naikkan harga"],["You make RM0.50 profit per bar: keep going","Anda untung RM0.50 sebuku: teruskan"],["You break even: costs and sales match","Anda pulang modal: kos dan jualan sama"]],
 ["4.00 − 4.50 = −0.50, a loss. Selling more would only increase the loss.","4.00 − 4.50 = −0.50, iaitu rugi. Menjual lebih banyak hanya menambah kerugian."]);

/* ---------------- build WQ.questions ---------------- */
// Correct answer is authored first; move it to a fixed, id-based slot so positions vary for every consumer.
const seed = id => [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const toObj = p => ({ en: p[0], bm: p[1] });
raw.forEach(r => {
  const a = r.a.map(toObj), right = a.shift(), c = seed(r.id) % (a.length + 1);
  a.splice(c, 0, right);
  W.questions.push({ id: r.id, tracks: [...r.tr].map(ch => TR[ch]), topic: r.topic, q: toObj(r.q), a, c, why: toObj(r.why) });
});
// Topic labels for quiz/cert/class menus.
W.questionTopics = {
  sorting:{en:"Sorting & bins",bm:"Pengasingan & tong"}, w2w:{en:"Waste-to-Wealth",bm:"Sisa kepada Kekayaan"},
  circular:{en:"Circular economy & 5R",bm:"Ekonomi kitaran & 5R"}, compost:{en:"Composting",bm:"Pengkomposan"},
  enzyme:{en:"Eco-enzyme",bm:"Eko-enzim"}, ph:{en:"Natural pH indicators",bm:"Penunjuk pH semula jadi"},
  plastics:{en:"Plastics & bioplastic",bm:"Plastik & bioplastik"}, labs:{en:"Labs & used cooking oil",bm:"Makmal & minyak masak terpakai"},
  malaysia:{en:"Malaysian data & law",bm:"Data & undang-undang Malaysia"}, sdg:{en:"SDGs",bm:"SDG"},
  energy:{en:"Greenhouse gases & energy",bm:"Gas rumah hijau & tenaga"}, economy:{en:"ESG & W2W business",bm:"ESG & perniagaan W2W"}
};

/* ---------------- self-check: node js/data/questions.js ---------------- */
if (typeof module !== "undefined" && typeof require !== "undefined" && require.main === module) {
  const assert = require("assert"), qs = W.questions, ids = new Set();
  const count = t => qs.filter(q => q.tracks.includes(t)).length;
  qs.forEach(q => {
    assert(!ids.has(q.id), "duplicate id " + q.id); ids.add(q.id);
    assert(W.questionTopics[q.topic], q.id + " bad topic");
    assert(q.tracks.length && q.tracks.every(t => ["kids","teens","adults"].includes(t)), q.id + " bad tracks");
    assert(q.a.length >= 2 && q.a.length <= 4, q.id + " needs 2-4 answers");
    assert(Number.isInteger(q.c) && q.c >= 0 && q.c < q.a.length, q.id + " bad c");
    [q.q, q.why, ...q.a].forEach(o => assert(o.en && o.bm && o.en.trim() && o.bm.trim(), q.id + " missing en/bm"));
    assert(new Set(q.a.map(o => o.en)).size === q.a.length, q.id + " duplicate answers");
  });
  const n = { total: qs.length, kids: count("kids"), teens: count("teens"), adults: count("adults") };
  assert(n.total >= 130 && n.kids >= 40 && n.teens >= 45 && n.adults >= 45, JSON.stringify(n));
  const pos = [0,1,2,3].map(i => qs.filter(q => q.c === i).length);
  const topics = {}; qs.forEach(q => topics[q.topic] = (topics[q.topic] || 0) + 1);
  console.log("OK", JSON.stringify(n), "correct-position spread", pos, JSON.stringify(topics));
}
})();
