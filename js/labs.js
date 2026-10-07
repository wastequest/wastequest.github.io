/* Hands-on Labs: 15 real activity guides (adapted from UPM chemical engineering student projects, corrected) + labs gallery, single lab page,
   printable worksheet (#/lab/<id>/print) and WQ.renderLabPrint(el, id) for the PDF booklet.
   Poster transcriptions and every correction: assets/labs/_poster_notes.md
// SOURCES:
//  - Household waste composition (food 30.6%, plastic 21.9%, garden 2.9%, textiles 2.3%): SWCorp via The Star, 2 Jan 2024 (SPEC.md).
//  - Ecobrick minimum density 0.33 g/mL (600 mL >= 200 g, 1.5 L >= 500 g): Global Ecobrick Alliance, https://ecobricks.org/en/what
//  - Aedes egg to adult in about 7–10 days: US CDC, "Life Cycle of Aedes Mosquitoes", https://www.cdc.gov/mosquitoes/about/life-cycles/aedes.html
//  - Treats <= 10% of daily calories for cats and dogs: WSAVA "Feeding treats to your cat", https://wsava.org/wp-content/uploads/2024/06/Feeding-treats-to-your-cat-v2.pdf
//  - Eco-enzyme 1:3:10 product pH about 3.5–4: e.g. Jurnal Distilat (Polinema) eco-enzyme studies, https://jurnal.polinema.ac.id/index.php/distilat/article/download/4195/3419/18731
//  - NaOH SAP value of palm olein 0.138 g/g: soapmakingforum / soap-calculator tables, https://soapmakingforum.com/threads/palm-olein-vs-palm-oil-sap-value.40032
//  - Eudrilus eugeniae optimum about 25–30 °C, efficient tropical composting worm: FAO / USM TLSR 19(2) 2008, https://ejournal.usm.my/tlsr/article/download/tlsr_vol19-no-2-2008_6/pdf/1044
//  - Kratky non-circulating hydroponics: B.A. Kratky (2009), "Three non-circulating hydroponic methods for growing lettuce", Acta Horticulturae 843:65-72
//  - LDPE melts about 105-115 °C, HDPE about 130-137 °C; PVC gives off hydrogen chloride when heated: Britannica "polyethylene", "polyvinyl chloride"
//  - Lifebuoy must support 14.5 kg of iron in fresh water for 24 h: IMO Life-Saving Appliances (LSA) Code, ch. II 2.1.1
//  - Thermal conductivity: still air about 0.026 W/m·K, concrete about 1 W/m·K (engineering tables, e.g. engineeringtoolbox.com)
//  - Flood rules (stay out of floodwater, call 999) and "Reach or throw, don't go": NADMA / Bomba; Royal Life Saving Society
//  - Money plant (Epipremnum) toxic to cats and dogs: ASPCA toxic plant list
//  - Five labs adapted from the UPM ENG3104 2024 student projects ("Zero-Plastic Hero by ChemE (Presentation).pptx" slides 6-7); no student names or links shown (PLAN_v2.md)
//  - Shop prices (seen 7 Oct 2026, undated listings, vary by shop): research/v2/01_todo_prices_weights.md section 3: paraffin RM14-22/kg (shopee 1 kg listing; shop.bf-1.com), wicks RM5/10 (handmadesoapmalaysia.my),
//    fragrance RM25/10 mL (myhalalbasket.com), melt-and-pour base RM26/kg (handmadesoapmalaysia.my/shop/soap-base-transparent), cornstarch+corn syrup batch RM0.90-1.01 (jayaindahgrocer, greatocean.my, hoibaking.com),
//    Arduino parts RM32.35-56.68 (makerhub.my, my.cytron.io), brown sugar RM5.70-5.75/kg (jayagrocer, myaeon2go), bokashi bran RM8.09-14/kg (zerowasteearthstore.com, shopee), live worms RM380/kg Peninsular (vmsfarmgarden.easy.co),
//    potting mix RM7.50/7 L (homepro.com.my), seed packet RM5.90 (shop.eatsshootsandroots.org), AB mix listing RM16.90 pack unclear (toclanasia.com), baking paper RM5.27/5 m (hoibaking.com) - RM9.90/12 m (bakewithyen.my Feb 2025)
//  - Age/supervision gating: research/v2/02_todo_curriculum_credential.md A2 (heated oil/flames and plastic ironing = adult demonstration for primary pupils; float ring and sleeping bag are models only)
//  - Student figures (48 g:96 g candle, pet-food cost table, RM0.84 bioplastic pot, RM10.50 stool; historical student estimates): the posters and research/eng3104_and_videos.md
*/
(() => {
const L=(en,bm)=>({en,bm}), H=(en,bm)=>({h:{en,bm}});
const S=(en,bm,xen,xbm)=>xen?{en,bm,x:{en:xen,bm:xbm}}:{en,bm};
const D=(en,bm)=>({en,bm,lv:"danger"}), W=(en,bm)=>({en,bm,lv:"warn"});
const P=(src,en,bm)=>({src,cap:{en,bm}});

// labs with the 2026 narrated video (assets/videos/v2/<id>_<en|bm>.mp4 + <id>.jpg); add ids as new renders land
const V2=new Set("candle petfood treasure litmus odour watering enzyme ecobrick compost bioplastic hydro".split(" "));
const LABS=[
/* ---------------------------------------------------------------- 1 CANDLE */
{id:"candle",icon:"🕯️",min:10,mins:60,diff:2,sup:"adult",heat:true,sdgs:[6,12,13],video:"1dHTYvQAr7l-fZWAZLZ1TFl_Dmsw00Bt-",
 badge:{icon:"🕯️",name:L("Candle Crafter","Tukang Lilin")},
 title:L("Eco-Candles from Used Cooking Oil","Lilin Eko daripada Minyak Masak Terpakai"),
 hook:L("Turn the oil left in the wok into a glowing scented candle.","Tukar minyak lebihan dalam kuali menjadi lilin wangi yang bercahaya."),
 time:L("60 min + 2–4 h to set","60 min + 2–4 jam untuk mengeras"),
 cost:L("Low: the oil is free. Example shop prices (Oct 2026): paraffin wax RM 14–22 per kg, so the 96 g in this recipe is about RM 1.30–2.10; wicks about RM 0.50 each; fragrance extra (one 10 mL bottle was RM 25). Prices vary by shop.","Rendah: minyak percuma. Contoh harga kedai (Okt 2026): lilin parafin RM 14–22 sekilogram, jadi 96 g dalam resipi ini kira-kira RM 1.30–2.10; sumbu kira-kira RM 0.50 seutas; pewangi berasingan (sebotol 10 mL berharga RM 25). Harga berbeza mengikut kedai."),
 waste:L("Used cooking oil","Minyak masak terpakai"),product:L("Scented candles","Lilin beraroma"),
 why:{env:L("Oil poured down the sink sticks inside pipes, causes blockages and pollutes rivers. Every jar of oil you reuse stays out of the drain.","Minyak yang dituang ke dalam sinki melekat di dalam paip, menyebabkan sumbat dan mencemarkan sungai. Setiap balang minyak yang diguna semula tidak masuk ke longkang."),
  econ:L("A free waste becomes a product people buy as gifts. Used cooking oil also has cash value: some recycling centres and collection points buy it for biodiesel.","Sisa percuma menjadi produk yang dibeli orang sebagai hadiah. Minyak masak terpakai juga bernilai: sesetengah pusat kitar semula dan pusat kutipan membelinya untuk biodiesel."),
  soc:L("Candle-making is a simple home-business skill and a family activity that starts a conversation about how we throw away oil.","Membuat lilin ialah kemahiran perniagaan dari rumah yang mudah dan aktiviti keluarga yang membuka perbualan tentang cara kita membuang minyak.")},
 mats:[L("48 g used cooking oil, cooled and left to settle","48 g minyak masak terpakai, sudah sejuk dan dibiarkan mendap"),
  L("96 g paraffin wax (pellets or chips)","96 g lilin parafin (butiran atau kepingan)"),
  L("Candle wicks with metal tabs, one per candle","Sumbu lilin bertapak logam, satu bagi setiap lilin"),
  L("Moulds: small aluminium cups, clean tins or heat-proof glass jars","Acuan: cawan aluminium kecil, tin bersih atau balang kaca tahan panas"),
  L("Filter paper or a coffee filter, a funnel and a clean jar","Kertas turas atau penapis kopi, corong dan balang bersih"),
  L("Kitchen scale","Penimbang dapur"),
  L("Double boiler: a pot of water + a heat-proof jug or clean tin","Kaedah tim (double boiler): periuk berisi air + jag tahan panas atau tin bersih"),
  L("Wooden stick for stirring","Kayu pengacau"),
  L("Candle dye or wax-crayon shavings (not food colouring)","Pewarna lilin atau serutan krayon lilin (bukan pewarna makanan)"),
  L("Candle fragrance oil or essential oil, a few drops","Minyak wangian lilin atau minyak pati, beberapa titis"),
  L("Clothes pegs or chopsticks to hold the wicks straight","Penyepit baju atau penyepit makanan untuk menegakkan sumbu"),
  L("Oven gloves, apron, a damp cloth and a pot lid close by","Sarung tangan ketuhar, apron, kain lembap dan tudung periuk berdekatan")],
 steps:[S("Ask an adult for cooled used cooking oil. Let it stand for a day so crumbs sink to the bottom.","Minta minyak masak terpakai yang sudah sejuk daripada orang dewasa. Biarkan sehari supaya serbuk makanan mendap ke bawah."),
  S("Filter the oil through filter paper into a clean jar. Go slowly: it takes time!","Tapis minyak melalui kertas turas ke dalam balang bersih. Perlahan-lahan, ia mengambil masa!","Food bits left in the oil do not burn cleanly: they char on the wick, smoke and smell.","Serbuk makanan dalam minyak tidak terbakar dengan bersih: ia hangus pada sumbu, berasap dan berbau."),
  S("Weigh 48 g of filtered oil and 96 g of paraffin wax. That is 1 part oil to 2 parts wax.","Timbang 48 g minyak tertapis dan 96 g lilin parafin. Ini 1 bahagian minyak kepada 2 bahagian lilin.","Oil : wax = 48 : 96 = 1 : 2. Oil is liquid at room temperature, so too much oil gives a soft, greasy candle.","Minyak : lilin = 48 : 96 = 1 : 2. Minyak cecair pada suhu bilik, jadi terlalu banyak minyak menghasilkan lilin lembik dan berminyak."),
  S("Stand a wick in the middle of each mould. Hold it straight with a clothes peg or two chopsticks across the top.","Letakkan sumbu di tengah setiap acuan. Tegakkan dengan penyepit baju atau dua batang penyepit makanan di atas acuan."),
  S("ADULT: put a few cm of water in a pot and heat gently. Stand the jug with the wax and oil in the water. Never put wax straight on the flame.","ORANG DEWASA: isi beberapa cm air dalam periuk dan panaskan perlahan-lahan. Letakkan jag berisi lilin dan minyak di dalam air itu. Jangan sekali-kali letak lilin terus di atas api.","Water cannot get much hotter than 100 °C, so the wax stays far below the temperature at which it could catch fire.","Air tidak boleh menjadi lebih panas daripada kira-kira 100 °C, jadi lilin kekal jauh di bawah suhu yang boleh menyebabkannya terbakar."),
  S("ADULT: stir gently until everything is melted and clear.","ORANG DEWASA: kacau perlahan-lahan sehingga semuanya cair dan jernih."),
  S("Turn off the heat. Add a little candle dye or crayon shavings and stir.","Tutup api. Masukkan sedikit pewarna lilin atau serutan krayon, kemudian kacau."),
  S("Wait a minute, then add a few drops of fragrance oil and stir.","Tunggu seminit, kemudian titiskan beberapa titis minyak wangian dan kacau.","Fragrance evaporates from very hot wax; adding it just off the heat keeps more scent in the candle.","Wangian meruap daripada lilin yang terlalu panas; menambahnya selepas api ditutup mengekalkan lebih banyak bau dalam lilin."),
  S("ADULT: pour the wax slowly into the moulds, keeping each wick in the centre.","ORANG DEWASA: tuang lilin perlahan-lahan ke dalam acuan dan pastikan sumbu kekal di tengah."),
  S("Leave the candles for 2–4 hours until hard. Do not move them while they set.","Biarkan lilin selama 2–4 jam sehingga keras. Jangan alihkan semasa ia mengeras."),
  S("Trim the wick to about 5 mm. Label your candle with the date and \"made from used oil\".","Potong sumbu tinggal kira-kira 5 mm. Labelkan lilin dengan tarikh dan \"dibuat daripada minyak terpakai\".","Test-burn one candle with an adult, on a heat-proof plate in a ventilated room. Note any smoke or smell.","Uji bakar satu lilin bersama orang dewasa, di atas pinggan tahan panas dalam bilik yang berpengudaraan. Catat jika ada asap atau bau.")],
 safety:[D("Hot wax and hot oil cause serious burns. Only an adult heats and pours. Children stay an arm's length from the stove.","Lilin dan minyak panas boleh menyebabkan lecur teruk. Hanya orang dewasa memanaskan dan menuang. Kanak-kanak berada sedepa dari dapur."),
  D("Double boiler only. Never heat wax directly over a flame, and never leave melting wax unattended.","Guna kaedah tim sahaja. Jangan panaskan lilin terus di atas api dan jangan tinggalkan lilin yang sedang cair tanpa pengawasan."),
  D("If wax catches fire: turn off the heat and cover it with a pot lid. Never pour water on burning wax or oil.","Jika lilin terbakar: tutup api dan tutup bekas dengan tudung periuk. Jangan sekali-kali curah air pada lilin atau minyak yang terbakar."),
  W("For a burn: cool it under cool running water for 20 minutes and tell an adult.","Jika melecur: sejukkan di bawah air paip yang sejuk selama 20 minit dan beritahu orang dewasa."),
  W("Burn finished candles on a heat-proof plate, away from curtains. Never leave a lit candle alone.","Nyalakan lilin di atas pinggan tahan panas, jauh dari langsir. Jangan tinggalkan lilin yang menyala tanpa pengawasan.")],
 sci:{kids:L("Wax and oil are both fuels made of carbon and hydrogen. When you light the wick, the heat melts the wax. The melted wax climbs up the wick like water up a tissue, turns into a gas and burns. Oil is runny, so we mix it with harder wax to make a candle that stands up by itself.","Lilin dan minyak ialah bahan api yang diperbuat daripada karbon dan hidrogen. Apabila sumbu dinyalakan, haba mencairkan lilin. Lilin cair naik melalui sumbu seperti air naik pada tisu, bertukar menjadi gas dan terbakar. Minyak cair, jadi kita campurkan dengan lilin yang lebih keras supaya lilin boleh berdiri sendiri."),
  teens:L("Paraffin wax is a mixture of long-chain alkanes, solid at room temperature. Cooking oil is mostly triglycerides (glycerol joined to three fatty acids); the C=C \"kinks\" in unsaturated chains stop the molecules packing tightly, so it is liquid. A 1:2 oil-to-wax blend is softer and melts at a lower temperature than pure wax. In the flame, molten fuel rises up the wick by capillary action, vaporises and burns: hydrocarbon + O₂ → CO₂ + H₂O. With too little oxygen, combustion is incomplete and you get soot (carbon). Filtering matters because solid food particles cannot vaporise, so they char on the wick.","Lilin parafin ialah campuran alkana berantai panjang yang pepejal pada suhu bilik. Minyak masak kebanyakannya trigliserida (gliserol yang bergabung dengan tiga asid lemak); \"bengkok\" ikatan C=C dalam rantai tak tepu menghalang molekul tersusun rapat, jadi ia cecair. Campuran minyak dan lilin 1:2 lebih lembut dan melebur pada suhu lebih rendah daripada lilin tulen. Dalam nyalaan, bahan api cair naik melalui sumbu secara tindakan kapilari, mengewap dan terbakar: hidrokarbon + O₂ → CO₂ + H₂O. Jika oksigen tidak cukup, pembakaran tidak lengkap dan jelaga (karbon) terhasil. Penapisan penting kerana zarah makanan pepejal tidak boleh mengewap, jadi ia hangus pada sumbu."),
  adults:L("Fats, oils and grease (FOG) poured into drains solidify in sewers and cause blockages and overflows. Used cooking oil (UCO) has higher-value routes, especially collection for biodiesel, so a candle is best seen as a small upcycling and awareness product rather than the main solution. Be honest with buyers: paraffin is petroleum-derived (plant waxes can replace it at higher cost), and an oil-rich candle may smoke or smell slightly of cooking. Quality control (filtering, ratio, wick size) decides whether it is sellable.","Lemak, minyak dan gris (FOG) yang dituang ke longkang memejal dalam pembetung dan menyebabkan sumbat serta limpahan. Minyak masak terpakai (UCO) mempunyai laluan bernilai lebih tinggi, terutamanya kutipan untuk biodiesel, jadi lilin lebih sesuai dilihat sebagai produk kitar naik dan kesedaran berskala kecil, bukan penyelesaian utama. Jujur dengan pembeli: parafin berasal daripada petroleum (lilin tumbuhan boleh menggantikannya dengan kos lebih tinggi), dan lilin yang banyak minyak mungkin berasap atau berbau masakan. Kawalan kualiti (penapisan, nisbah, saiz sumbu) menentukan sama ada ia boleh dijual.")},
 teach:L("Filter the oil the day before: paper filtering is slow. One double-boiler station per adult. Pupils weigh, set wicks, choose colours and make labels; adults heat and pour.","Tapis minyak sehari sebelum kelas kerana penapisan dengan kertas lambat. Satu stesen kaedah tim bagi setiap orang dewasa. Murid menimbang, memasang sumbu, memilih warna dan membuat label; orang dewasa memanaskan dan menuang."),
 ext:[L("Make three mini-batches with oil : wax = 1:1, 1:2 and 1:3. Compare hardness, smoke and burn time. Which would you sell?","Buat tiga kelompok kecil dengan minyak : lilin = 1:1, 1:2 dan 1:3. Bandingkan kekerasan, asap dan tempoh menyala. Yang mana anda akan jual?"),
  L("Burn rate: weigh a candle, burn it for 1 hour with an adult, weigh again. Burn rate = mass lost ÷ time (g/h). How many hours will a full candle last?","Kadar pembakaran: timbang lilin, nyalakan selama 1 jam bersama orang dewasa, timbang semula. Kadar = jisim hilang ÷ masa (g/j). Berapa jam lilin penuh boleh bertahan?"),
  L("Costing: find real prices for wax, wicks and fragrance. Cost per candle = total cost ÷ number of candles. For a 40% margin, price = cost ÷ (1 − 0.40).","Kos: cari harga sebenar lilin, sumbu dan pewangi. Kos seunit = jumlah kos ÷ bilangan lilin. Untuk margin 40%, harga = kos ÷ (1 − 0.40).")],
 refl:[L("Where does used cooking oil go in your home now?","Ke mana minyak masak terpakai dibuang di rumah anda sekarang?"),
  L("Why should we never pour oil down the sink?","Mengapa kita tidak boleh menuang minyak ke dalam sinki?"),
  L("What would you change to make your candle better?","Apakah yang akan anda ubah untuk menjadikan lilin anda lebih baik?"),
  L("Is a candle the best use for used oil? What else could it become?","Adakah lilin kegunaan terbaik untuk minyak terpakai? Apa lagi yang boleh dihasilkan?")],
 posters:[P("assets/labs/candle-poster-1.jpg","Steps poster (BM)","Poster langkah (BM)")]},

/* ---------------------------------------------------------------- 2 PET FOOD */
{id:"petfood",icon:"🐟",min:10,mins:150,diff:3,sup:"adult",heat:true,sdgs:[12,14],video:"1whvpv4cOKyoWWrTDyCZW9fMfoSgThVS5",
 badge:{icon:"🐟",name:L("Pet Chef","Cef Haiwan")},
 title:L("Fish-Waste Pet Treats","Snek Haiwan Peliharaan daripada Sisa Ikan"),
 hook:L("Fish heads and scraps become crunchy baked treats for cats.","Kepala dan sisa ikan dijadikan snek bakar yang rangup untuk kucing."),
 time:L("About 2½ h (adult does the cooking)","Kira-kira 2½ jam (orang dewasa memasak)"),
 cost:L("About RM 1.50 a batch, or RM 4.80 with taurine (2025 student prices).","Kira-kira RM 1.50 sekumpulan, atau RM 4.80 dengan taurin (harga pelajar 2025)."),
 waste:L("Fish trimmings: heads, skin, flesh scraps","Sisa ikan: kepala, kulit, cebisan isi"),product:L("Baked cat treats","Snek kucing bakar"),
 why:{env:L("Fish heads and scraps are thrown away at markets and in kitchens, where they rot and smell. Food is the biggest part of Malaysian household waste (30.6%); using the scraps cuts it.","Kepala dan sisa ikan dibuang di pasar dan dapur, lalu reput dan berbau. Makanan ialah komponen terbesar sisa domestik Malaysia (30.6%); menggunakan sisa ini mengurangkannya."),
  econ:L("Free market leftovers become a product pet owners pay for. The cost table shows where the money goes: the optional taurine powder is most of the cost.","Sisa pasar yang percuma menjadi produk yang dibayar oleh pemilik haiwan. Jadual kos menunjukkan ke mana wang pergi: serbuk taurin (pilihan) ialah sebahagian besar kos."),
  soc:L("Community cat feeders and animal shelters need cheap, safe treats; this links food-waste reduction to animal welfare.","Penjaga kucing komuniti dan pusat perlindungan haiwan memerlukan snek yang murah dan selamat; ini menghubungkan pengurangan sisa makanan dengan kebajikan haiwan.")},
 table:{head:[L("Ingredient","Bahan"),L("Amount","Kuantiti"),L("Cost (RM)","Kos (RM)")],
  rows:[[L("Fish waste","Sisa ikan"),"283 g",L("Free","Percuma")],[L("Wheat flour","Tepung gandum"),"283 g","0.57"],[L("Egg","Telur"),L("1 (50 g)","1 biji (50 g)"),"0.70"],
   [L("Fresh cooking oil","Minyak masak baharu"),L("1 tbsp (14 g)","1 sudu besar (14 g)"),"0.23"],[L("Taurine (optional)","Taurin (pilihan)"),"11 g","3.30"],
   [L("Total","Jumlah"),"",L("4.80 (1.50 without taurine)","4.80 (1.50 tanpa taurin)")]],
  note:L("Prices from the 2025 student poster. The poster's total of RM 5.03 was an adding mistake: the items add up to RM 4.80.","Harga daripada poster pelajar 2025. Jumlah RM 5.03 dalam poster tersilap campur: jumlah sebenar item ialah RM 4.80.")},
 mats:[L("283 g fresh fish trimmings (heads, skin, flesh scraps), used the same day and kept cold","283 g sisa ikan segar (kepala, kulit, cebisan isi), diguna pada hari yang sama dan disimpan sejuk"),
  L("About 2 cups (283 g) wheat flour, plus a little for dusting","Kira-kira 2 cawan (283 g) tepung gandum, dan sedikit untuk ditabur"),
  L("1 egg","1 biji telur"),
  L("1 tbsp (14 g) fresh cooking oil, not used oil","1 sudu besar (14 g) minyak masak baharu, bukan minyak terpakai"),
  L("Taurine powder: optional, only if a vet advises","Serbuk taurin: pilihan, hanya jika disarankan oleh doktor haiwan"),
  L("Steamer, oven, blender, kitchen scale, baking tray and baking paper","Pengukus, ketuhar, pengisar, penimbang dapur, dulang pembakar dan kertas pembakar"),
  L("Rolling pin, small cutters or a knife, bowls and spoons","Penggelek, acuan kecil atau pisau, mangkuk dan sudu"),
  L("Gloves, a chopping board used only for raw fish, an airtight container","Sarung tangan, papan pemotong khas untuk ikan mentah, bekas kedap udara")],
 steps:[S("Wash your hands. Wearing gloves, rinse the fish trimmings well. ADULT removes the guts and gills (they spoil fastest).","Basuh tangan. Dengan memakai sarung tangan, bilas sisa ikan sehingga bersih. ORANG DEWASA membuang perut dan insang (bahagian ini paling cepat rosak).","Raw fish can carry bacteria: keep it cold and away from other food.","Ikan mentah boleh membawa bakteria: simpan sejuk dan asingkan daripada makanan lain."),
  S("ADULT: steam the fish for about 1 hour until fully cooked.","ORANG DEWASA: kukus ikan kira-kira 1 jam sehingga masak sepenuhnya.","Cooking kills germs and parasites and destroys thiaminase, an enzyme in some raw fish that breaks down vitamin B1.","Memasak membunuh kuman dan parasit serta memusnahkan tiaminase, enzim dalam sesetengah ikan mentah yang memecahkan vitamin B1."),
  S("Let it cool. Pick the flesh off and remove EVERY bone. Check twice with your fingers.","Biarkan sejuk. Ambil isinya dan buang SEMUA tulang. Periksa dua kali dengan jari."),
  S("Blend the boneless fish into a smooth paste (purée).","Kisar isi ikan tanpa tulang sehingga menjadi puri yang halus."),
  S("ADULT: spread the purée on a lined tray and dry it in the oven at about 117 °C for 15–20 minutes.","ORANG DEWASA: ratakan puri di atas dulang beralas dan keringkan dalam ketuhar pada kira-kira 117 °C selama 15–20 minit."),
  S("Mix the dried fish with the egg, flour and oil (and taurine only if a vet said so). Knead into a dough. No salt, onion, garlic or spices!","Gaul ikan kering dengan telur, tepung dan minyak (dan taurin hanya jika disarankan doktor haiwan). Uli menjadi doh. Jangan masukkan garam, bawang, bawang putih atau rempah!","Onion and garlic are toxic to cats and dogs, even when cooked.","Bawang dan bawang putih beracun kepada kucing dan anjing, walaupun sudah dimasak."),
  S("Dust with flour, roll the dough flat and cut tiny shapes (cat-bite size).","Tabur tepung, gelek doh sehingga leper dan potong bentuk kecil (saiz segigit kucing)."),
  S("ADULT: bake at 150 °C for about 20 minutes until firm and dry right through. Thicker pieces need longer.","ORANG DEWASA: bakar pada 150 °C kira-kira 20 minit sehingga keras dan kering sepenuhnya. Kepingan tebal memerlukan masa lebih lama."),
  S("Cool completely. Store in an airtight, labelled container in the fridge and use within about a week. Throw away anything that smells bad or grows mould.","Sejukkan sepenuhnya. Simpan dalam bekas kedap udara berlabel di dalam peti sejuk dan gunakan dalam masa kira-kira seminggu. Buang jika berbau busuk atau berkulat.","The 2025 student group saw no mould after 14 days, but home kitchens vary, so we play safe.","Kumpulan pelajar 2025 tidak menemui kulat selepas 14 hari, tetapi keadaan dapur berbeza, jadi kita berhati-hati."),
  S("Give only a few pieces a day, as a treat.","Beri beberapa keping sahaja sehari sebagai snek.","Vets advise that treats should be no more than 10% of a pet's daily calories.","Doktor haiwan menasihatkan snek tidak melebihi 10% daripada kalori harian haiwan.")],
 safety:[D("Steamer, oven, hot trays and knives: adults only.","Pengukus, ketuhar, dulang panas dan pisau: orang dewasa sahaja."),
  D("Hygiene: wash hands, boards and knives after touching raw fish. Keep raw fish cold until cooking.","Kebersihan: basuh tangan, papan dan pisau selepas memegang ikan mentah. Simpan ikan mentah sejuk sehingga dimasak."),
  W("This is a treat, not a complete diet, and not for humans. Ask a vet first, especially for kittens or pets with kidney problems or allergies.","Ini snek, bukan makanan lengkap, dan bukan untuk manusia. Tanya doktor haiwan dahulu, terutamanya untuk anak kucing atau haiwan yang ada masalah buah pinggang atau alahan."),
  W("Remove all bones: small bones can choke a pet or cut its mouth.","Buang semua tulang: tulang kecil boleh menyebabkan haiwan tercekik atau mulutnya luka."),
  W("Check pupils' allergies (fish, egg, wheat) before the class.","Semak alahan murid (ikan, telur, gandum) sebelum kelas.")],
 sci:{kids:L("Fish leftovers still have lots of protein, which helps pets build strong muscles. Cooking kills germs. Drying and baking take the water out, and germs and mould need water to grow, so dry treats keep longer.","Sisa ikan masih kaya dengan protein yang membantu haiwan membina otot yang kuat. Memasak membunuh kuman. Pengeringan dan pembakaran membuang air, dan kuman serta kulat memerlukan air untuk membiak, jadi snek kering tahan lebih lama."),
  teens:L("Microbes need available water. Drying and baking lower the treat's water activity, slowing bacteria and mould. Heat denatures proteins, killing pathogens and destroying thiaminase. Cats are obligate carnivores: they cannot make enough taurine themselves, and fish is a natural source of it. In the oven, egg proteins set and flour starch gelatinises to bind the dough, and the Maillard reaction between amino acids and sugars gives the brown colour and smell.","Mikrob memerlukan air yang tersedia. Pengeringan dan pembakaran merendahkan aktiviti air snek, lalu melambatkan bakteria dan kulat. Haba menyahasli protein, membunuh patogen dan memusnahkan tiaminase. Kucing ialah karnivor obligat: mereka tidak dapat menghasilkan taurin yang mencukupi sendiri, dan ikan ialah sumber semula jadi taurin. Dalam ketuhar, protein telur mengeras dan kanji tepung mengalami pengelatinan untuk mengikat doh, manakala tindak balas Maillard antara asid amino dan gula memberi warna perang dan aroma."),
  adults:L("Fish processing leaves large volumes of by-products (heads, frames, skin, viscera). Valorisation routes include fishmeal, fish oil, fish silage, fertiliser and pet food. A home-scale treat demonstrates the idea, but selling pet food brings legal duties (hygiene, labelling, registration): check with the Department of Veterinary Services (DVS) before any commercial step. Nutritionally, a homemade treat cannot replace a complete and balanced diet.","Pemprosesan ikan meninggalkan banyak hasil sampingan (kepala, rangka, kulit, isi perut). Laluan penambahan nilai termasuk tepung ikan, minyak ikan, silaj ikan, baja dan makanan haiwan. Snek buatan rumah menunjukkan idea ini, tetapi menjual makanan haiwan melibatkan tanggungjawab undang-undang (kebersihan, pelabelan, pendaftaran): rujuk Jabatan Perkhidmatan Veterinar (DVS) sebelum sebarang langkah komersial. Dari segi pemakanan, snek buatan rumah tidak boleh menggantikan diet yang lengkap dan seimbang.")},
 teach:L("If time is short, do steps 1–5 (raw fish, steaming, drying) before class; pupils mix, roll, cut and package. Use a separate board and knife for raw fish.","Jika masa terhad, lakukan langkah 1–5 (ikan mentah, mengukus, mengeringkan) sebelum kelas; murid menggaul, menggelek, memotong dan membungkus. Guna papan dan pisau berasingan untuk ikan mentah."),
 ext:[L("Cost per treat: count the treats in one batch. Cost per treat = batch cost ÷ number of treats. Compare with a shop-bought cat treat (RM per 100 g).","Kos sekeping: kira bilangan snek dalam satu kumpulan. Kos sekeping = kos kumpulan ÷ bilangan snek. Bandingkan dengan snek kucing di kedai (RM per 100 g)."),
  L("Moisture loss: weigh the purée before and after drying. % water removed = (wet − dry) ÷ wet × 100.","Kehilangan lembapan: timbang puri sebelum dan selepas dikeringkan. % air dibuang = (basah − kering) ÷ basah × 100."),
  L("Design a label: ingredients in order of weight, storage advice, \"treat only, not for humans\", and a use-by date.","Reka label: bahan mengikut susunan berat, cara penyimpanan, \"snek sahaja, bukan untuk manusia\" dan tarikh luput.")],
 refl:[L("Which parts of a fish are usually thrown away at the market?","Bahagian ikan yang manakah biasanya dibuang di pasar?"),
  L("Why do we dry and bake the treats instead of serving the fish paste?","Mengapa kita mengeringkan dan membakar snek dan bukan terus memberi puri ikan?"),
  L("Why must the treats never contain onion, garlic or salt?","Mengapa snek ini tidak boleh mengandungi bawang, bawang putih atau garam?"),
  L("Who in your community could use this idea?","Siapakah dalam komuniti anda yang boleh menggunakan idea ini?")],
 posters:[P("assets/labs/petfood-poster-1.jpg","Ingredients and steps 1–4 (BM)","Bahan dan langkah 1–4 (BM)"),P("assets/labs/petfood-poster-2.jpg","Steps 5–8, results and cost table (BM)","Langkah 5–8, hasil dan jadual kos (BM)")]},

/* ---------------------------------------------------------------- 3 TREASURE */
{id:"treasure",icon:"🎁",min:8,mins:90,diff:2,sup:"close",heat:true,sdgs:[4,6,12],video:null,
 badge:{icon:"🎁",name:L("Treasure Maker","Pembuat Harta")},
 title:L("Trash to Treasure: Soap, Tote & Toy Car","Sampah kepada Harta: Sabun, Beg Tote & Kereta Mainan"),
 hook:L("Three quick makes: used oil → soap, old T-shirt → bag, bottle caps → racing car.","Tiga projek pantas: minyak terpakai → sabun, baju-T lama → beg, penutup botol → kereta lumba."),
 time:L("3 activities × about 30 min","3 aktiviti × kira-kira 30 min"),
 cost:L("Very low: mostly waste. Example shop price (Oct 2026): melt-and-pour soap base RM 26 per kg, so 200 g is about RM 5.20. Glue, rubber bands and decorations extra. Prices vary.","Sangat rendah: kebanyakannya sisa. Contoh harga kedai (Okt 2026): bes sabun cair-dan-tuang RM 26 sekilogram, jadi 200 g kira-kira RM 5.20. Gam, getah dan hiasan berasingan. Harga berbeza-beza."),
 waste:L("Used cooking oil, old T-shirts, bottle caps, ice-cream sticks","Minyak masak terpakai, baju-T lama, penutup botol, batang aiskrim"),product:L("Soap, tote bag, toy car","Sabun, beg tote, kereta mainan"),
 why:{env:L("Textiles are 2.3% of Malaysian household waste, and oil in drains pollutes rivers. Reusing a T-shirt, oil or bottle caps keeps them out of landfill.","Tekstil ialah 2.3% daripada sisa domestik Malaysia, dan minyak dalam longkang mencemarkan sungai. Mengguna semula baju-T, minyak atau penutup botol menjauhkannya daripada tapak pelupusan."),
  econ:L("Upcycled soap and bags sell at school bazaars; toys from waste cost almost nothing.","Sabun dan beg kitar naik boleh dijual di bazar sekolah; mainan daripada sisa hampir tiada kos."),
  soc:L("Making things builds creativity, problem-solving and pride. Old T-shirts carry memories: \"every bag tells a story\".","Membuat sesuatu membina kreativiti, penyelesaian masalah dan rasa bangga. Baju-T lama menyimpan kenangan: \"setiap beg ada ceritanya\".")},
 mats:[H("Activity A: soap","Aktiviti A: sabun"),
  L("Children: 200 g glycerin melt-and-pour soap base (no lye)","Kanak-kanak: 200 g bes sabun gliserin \"cair dan tuang\" (tanpa alkali)"),
  L("Optional: 1 tsp dried used coffee grounds (scrub) and 1–2 drops essential oil","Pilihan: 1 sudu kecil hampas kopi kering (skrub) dan 1–2 titis minyak pati"),
  L("Moulds from waste: yogurt cups, cut milk cartons","Acuan daripada sisa: cawan yogurt, kotak susu yang dipotong"),
  L("Teacher demo only: 500 g filtered used palm cooking oil, 65 g sodium hydroxide (NaOH), 160 g cold distilled water, goggles, chemical gloves, long sleeves, stainless-steel or heat-proof PP plastic jugs, digital scale, stick blender, lined mould","Demonstrasi guru sahaja: 500 g minyak masak sawit terpakai yang ditapis, 65 g natrium hidroksida (NaOH), 160 g air suling sejuk, gogal, sarung tangan kimia, baju lengan panjang, jag keluli tahan karat atau plastik PP tahan panas, penimbang digital, pengisar tangan, acuan beralas"),
  H("Activity B: T-shirt tote","Aktiviti B: beg tote baju-T"),
  L("1 old T-shirt (thick cotton works best)","1 helai baju-T lama (kapas tebal paling sesuai)"),
  L("Sharp fabric scissors, a ruler and chalk or a marker","Gunting kain yang tajam, pembaris dan kapur atau pen penanda"),
  L("Optional: fabric paint or fabric markers","Pilihan: cat fabrik atau pen fabrik"),
  H("Activity C: toy car","Aktiviti C: kereta mainan"),
  L("4 bottle caps of the same size","4 penutup botol yang sama saiz"),
  L("2–3 ice-cream sticks and 1 drinking straw","2–3 batang aiskrim dan 1 straw minuman"),
  L("2 wooden skewers or long toothpicks (axles)","2 batang lidi sate atau pencungkil gigi panjang (gandar)"),
  L("1 rubber band and some glue","1 getah dan sedikit gam")],
 steps:[H("Activity A: soap","Aktiviti A: sabun"),
  S("CHILDREN: an adult cuts the soap base into cubes and melts it in short bursts in a microwave, or in a double boiler.","KANAK-KANAK: orang dewasa memotong bes sabun menjadi kiub dan mencairkannya sedikit demi sedikit dalam ketuhar gelombang mikro atau dengan kaedah tim."),
  S("Stir in a pinch of dried coffee grounds and 1–2 drops of essential oil.","Kacau bersama secubit hampas kopi kering dan 1–2 titis minyak pati."),
  S("ADULT pours it into the moulds. After about 1 hour, pop the soap out. Ready to use!","ORANG DEWASA menuang ke dalam acuan. Selepas kira-kira 1 jam, keluarkan sabun. Sedia untuk digunakan!"),
  S("TEACHER DEMO (adults only, full PPE): weigh 160 g cold distilled water into a heat-proof PP or stainless jug. Outdoors or by an open window, slowly add 65 g NaOH TO the water (never water to lye), stirring. It gets very hot and gives off fumes: stand back.","DEMONSTRASI GURU (orang dewasa sahaja, PPE lengkap): timbang 160 g air suling sejuk dalam jag PP tahan panas atau keluli tahan karat. Di luar atau di tepi tingkap terbuka, masukkan 65 g NaOH KE DALAM air perlahan-lahan (jangan tuang air ke atas alkali) sambil dikacau. Larutan menjadi sangat panas dan mengeluarkan wap: berdiri jauh.","Lye amount: 500 g × SAP value 0.138 (palm olein) ≈ 69 g; minus about 5% \"superfat\" so a little oil stays unreacted ≈ 65 g. Always re-check your actual oil in a lye calculator.","Jumlah alkali: 500 g × nilai SAP 0.138 (olein sawit) ≈ 69 g; tolak kira-kira 5% \"superfat\" supaya sedikit minyak tidak bertindak balas ≈ 65 g. Sentiasa semak semula minyak sebenar anda dengan kalkulator alkali."),
  S("TEACHER DEMO: when the lye solution and the filtered oil have both cooled to warm (about 40 °C), pour the lye into the oil and stick-blend until it thickens like custard (\"trace\"). Pour into the lined mould.","DEMONSTRASI GURU: apabila larutan alkali dan minyak tertapis sudah suam (kira-kira 40 °C), tuang alkali ke dalam minyak dan kisar dengan pengisar tangan sehingga pekat seperti kastard (\"trace\"). Tuang ke dalam acuan beralas."),
  S("TEACHER DEMO: cover and leave 24–48 h, unmould with gloves, then cure in an airy place for 4–6 weeks. Fresh lye soap is caustic: do not touch it or take it home until cured. Use UCO soap for laundry and cleaning, not skin.","DEMONSTRASI GURU: tutup dan biarkan 24–48 jam, keluarkan dengan sarung tangan, kemudian peramkan di tempat berangin selama 4–6 minggu. Sabun alkali yang baharu bersifat kaustik: jangan sentuh atau bawa pulang sebelum diperam. Guna sabun UCO untuk mencuci pakaian dan membersih, bukan untuk kulit.","Test the cured soap in the Litmus lab: bar soap is naturally alkaline, about pH 9–10.","Uji sabun yang sudah diperam dalam makmal Litmus: sabun buku bersifat alkali secara semula jadi, kira-kira pH 9–10."),
  H("Activity B: T-shirt tote","Aktiviti B: beg tote baju-T"),
  S("Lay the T-shirt flat. Cut off both sleeves just inside the seams.","Bentangkan baju-T. Gunting kedua-dua lengan betul-betul di dalam jahitan."),
  S("Cut a big scoop around the neck to make the bag opening. The shoulder parts become the handles.","Gunting bulatan besar di bahagian leher untuk bukaan beg. Bahagian bahu menjadi pemegang."),
  S("Turn the shirt inside out. Draw a line about 8 cm up from the bottom hem.","Terbalikkan baju (bahagian dalam ke luar). Lukis garisan kira-kira 8 cm dari kelim bawah."),
  S("Cut strips from the bottom up to the line, about 2–3 cm wide, through both layers.","Gunting jalur dari bawah hingga ke garisan, kira-kira 2–3 cm lebar, menembusi kedua-dua lapisan."),
  S("Tie each front strip to the back strip under it with a double knot.","Ikat setiap jalur depan dengan jalur belakang di bawahnya menggunakan simpulan mati berganda.","Then tie one strand of each pair to its neighbour's strand to close the small gaps.","Kemudian ikat satu helai daripada setiap pasangan dengan helai pasangan sebelahnya untuk menutup celah kecil."),
  S("Turn the bag right side out: the knots are hidden inside. Decorate it!","Terbalikkan semula beg: simpulan tersembunyi di dalam. Hiaskan!"),
  H("Activity C: toy car","Aktiviti C: kereta mainan"),
  S("Cut the straw into two pieces, a little wider than an ice-cream stick. Glue them across the stick, one near each end. These hold the axles.","Potong straw kepada dua, sedikit lebih lebar daripada batang aiskrim. Gamkan melintang pada batang, satu di setiap hujung. Ini pemegang gandar."),
  S("ADULT: make a small hole in the centre of each bottle cap with a bradawl or small drill.","ORANG DEWASA: tebuk lubang kecil di tengah setiap penutup botol dengan penebuk atau gerudi kecil."),
  S("Push a skewer through one straw and fix a cap on each end with a dab of glue. Repeat at the other end. Snip off the sharp tips.","Masukkan lidi melalui satu straw dan lekatkan penutup di setiap hujung dengan sedikit gam. Ulang di hujung satu lagi. Potong hujung lidi yang tajam."),
  S("Loop the rubber band over the front of the car and hook the other end around the back axle.","Sangkutkan getah pada bahagian depan kereta dan kaitkan hujung satu lagi pada gandar belakang."),
  S("Roll the car backwards to wind the band round the axle, put it down and let go. Vroom!","Gulingkan kereta ke belakang untuk menggulung getah pada gandar, letakkan dan lepaskan. Vroom!","Test, then improve: does it go straight? Do the wheels slip? A thin rubber-band \"tyre\" on the back wheels adds grip.","Uji, kemudian tambah baik: adakah ia bergerak lurus? Adakah roda tergelincir? \"Tayar\" getah nipis pada roda belakang menambah cengkaman.")],
 safety:[D("Lye (sodium hydroxide, NaOH) is corrosive: it burns skin and can blind. Teacher demo only, with goggles, chemical gloves, long sleeves and good ventilation; children watch from at least 2 metres away. Add lye to water, never water to lye. Never use aluminium containers (they react and make hydrogen gas).","Alkali (natrium hidroksida, NaOH) menghakis: ia melecurkan kulit dan boleh membutakan mata. Demonstrasi guru sahaja, dengan gogal, sarung tangan kimia, lengan panjang dan pengudaraan yang baik; kanak-kanak memerhati dari jarak sekurang-kurangnya 2 meter. Masukkan alkali ke dalam air, jangan sebaliknya. Jangan guna bekas aluminium (ia bertindak balas dan menghasilkan gas hidrogen)."),
  D("If lye touches skin or eyes: rinse with plenty of running water for at least 15 minutes. For eyes, get medical help immediately.","Jika alkali terkena kulit atau mata: bilas dengan banyak air mengalir sekurang-kurangnya 15 minit. Jika terkena mata, dapatkan rawatan perubatan segera."),
  D("Melted soap base is hot: an adult melts and pours it.","Bes sabun cair panas: orang dewasa yang mencairkan dan menuang."),
  W("Sharp tools: an adult makes the bottle-cap holes. Cut away from your body.","Alatan tajam: orang dewasa menebuk lubang penutup botol. Gunting menjauhi badan."),
  W("Bottle caps are a choking hazard: keep them away from children under 3.","Penutup botol boleh menyebabkan tercekik: jauhkan daripada kanak-kanak bawah 3 tahun.")],
 sci:{kids:L("Soap is made when oil meets a strong chemical called lye: they change into soap and glycerin. Soap has a head that loves water and a tail that loves oil, so it grabs grease and washes it away. Your car moves because a twisted rubber band stores energy and lets it go to spin the wheels.","Sabun terhasil apabila minyak bertemu bahan kimia kuat yang dipanggil alkali: kedua-duanya berubah menjadi sabun dan gliserin. Sabun ada kepala yang suka air dan ekor yang suka minyak, jadi ia menangkap gris dan menghanyutkannya. Kereta anda bergerak kerana getah yang dipulas menyimpan tenaga lalu melepaskannya untuk memusingkan roda."),
  teens:L("Saponification: triglyceride + 3 NaOH → glycerol + 3 sodium carboxylates (soap). A soap ion has a polar, hydrophilic head (–COO⁻ Na⁺) and a non-polar hydrocarbon tail; in water the tails cluster around grease to form micelles that rinse away. The lye amount uses the oil's SAP value (g NaOH per g oil), minus a small superfat so no free NaOH remains. Toy car: elastic potential energy in the band → rotational kinetic energy of the axle → kinetic energy of the car. Friction at the axles wastes energy; friction at the tyres gives grip.","Saponifikasi: trigliserida + 3 NaOH → gliserol + 3 natrium karboksilat (sabun). Ion sabun mempunyai kepala berkutub yang hidrofilik (–COO⁻ Na⁺) dan ekor hidrokarbon tak berkutub; dalam air, ekor berkumpul mengelilingi gris membentuk misel yang mudah dibilas. Jumlah alkali dikira daripada nilai SAP minyak (g NaOH per g minyak), ditolak sedikit \"superfat\" supaya tiada NaOH bebas. Kereta mainan: tenaga keupayaan kenyal dalam getah → tenaga kinetik putaran gandar → tenaga kinetik kereta. Geseran pada gandar membazir tenaga; geseran pada tayar memberi cengkaman."),
  adults:L("The trio shows three circular strategies: chemical conversion (UCO → soap), reuse and repurposing (T-shirt → bag, with no reprocessing energy) and creative reuse of low-value plastics (caps). Cold-process soap is a chemical process for trained adults; melt-and-pour keeps the session child-safe. Commercially, UCO soap is usually positioned as laundry or cleaning soap; soap sold for use on skin is treated as a cosmetic in Malaysia and needs notification with the NPRA, so check the rules before selling.","Tiga aktiviti ini menunjukkan tiga strategi kitaran: penukaran kimia (UCO → sabun), guna semula dan guna untuk tujuan baharu (baju-T → beg, tanpa tenaga pemprosesan semula) dan guna semula kreatif plastik bernilai rendah (penutup botol). Sabun proses sejuk ialah proses kimia untuk orang dewasa terlatih; kaedah cair dan tuang memastikan sesi selamat untuk kanak-kanak. Secara komersial, sabun UCO biasanya dipasarkan sebagai sabun dobi atau pembersih; sabun yang dijual untuk kulit dianggap kosmetik di Malaysia dan perlu dinotifikasikan kepada NPRA, jadi semak peraturan sebelum menjual.")},
 teach:L("Run the three activities as stations. Do the lye demo only if you are trained; otherwise do melt-and-pour. Collect T-shirts and bottle caps a week ahead.","Jalankan tiga aktiviti sebagai stesen. Buat demonstrasi alkali hanya jika anda terlatih; jika tidak, buat kaedah cair dan tuang. Kumpul baju-T dan penutup botol seminggu lebih awal."),
 ext:[L("Lye maths: with SAP = 0.138 g NaOH per g oil and 5% superfat, how much NaOH does 300 g of oil need? (300 × 0.138 × 0.95 ≈ 39 g)","Matematik alkali: dengan SAP = 0.138 g NaOH per g minyak dan 5% superfat, berapa NaOH diperlukan untuk 300 g minyak? (300 × 0.138 × 0.95 ≈ 39 g)"),
  L("Car race: measure the distance travelled for 1, 2 and 3 winds of the axle. Plot distance against winds. Is it a straight line?","Perlumbaan kereta: ukur jarak yang dilalui untuk 1, 2 dan 3 pusingan gandar. Plot jarak melawan bilangan pusingan. Adakah garisnya lurus?"),
  L("Market test: price a T-shirt tote for a school bazaar. What is your cost (materials + time)? What would buyers pay?","Uji pasaran: tetapkan harga beg tote baju-T untuk bazar sekolah. Berapa kos anda (bahan + masa)? Berapa pembeli sanggup bayar?")],
 refl:[L("Which activity saved the most waste? How do you know?","Aktiviti mana yang paling banyak menjimatkan sisa? Bagaimana anda tahu?"),
  L("Why is lye soap made only by trained adults?","Mengapa sabun alkali hanya dibuat oleh orang dewasa yang terlatih?"),
  L("What other old clothes or toys could you upcycle?","Pakaian atau mainan lama apa lagi yang boleh anda kitar naik?")],
 posters:[P("assets/labs/treasure-poster-1.jpg","Activity 1: used oil to soap","Aktiviti 1: minyak terpakai kepada sabun"),P("assets/labs/treasure-poster-2.jpg","Activities 2 and 3: T-shirt tote and toy car","Aktiviti 2 dan 3: beg tote baju-T dan kereta mainan")]},

/* ---------------------------------------------------------------- 4 LITMUS */
{id:"litmus",icon:"🌈",min:7,mins:45,diff:1,sup:"close",heat:false,sdgs:[4,6,14],video:"1mdCaIVPWCutRDiJYvLlSv7SRVYvwNSon",
 badge:{icon:"🌈",name:L("pH Detective","Detektif pH")},
 title:L("Say No to Litmus: Rainbow pH from Kitchen Waste","Katakan Tidak kepada Litmus: Pelangi pH daripada Sisa Dapur"),
 hook:L("Make your own pH indicator from cabbage leaves or bunga telang: no bought litmus paper needed.","Hasilkan penunjuk pH sendiri daripada daun kubis atau bunga telang: tidak perlu beli kertas litmus."),
 time:L("45 min","45 min"),
 cost:L("Almost free: household items.","Hampir percuma: barang dapur."),
 waste:L("Purple-cabbage outer leaves, wilted bunga telang flowers, scrap paper","Daun luar kubis ungu, bunga telang yang layu, kertas terpakai"),product:L("Natural pH indicator and test strips","Penunjuk pH semula jadi dan jalur ujian"),
 why:{env:L("Strong acids or bases poured down drains change the pH of rivers and harm fish and useful bacteria. Knowing pH helps us dispose of liquids safely.","Asid atau bes kuat yang dituang ke longkang mengubah pH sungai dan membahayakan ikan serta bakteria berguna. Memahami pH membantu kita membuang cecair dengan selamat."),
  econ:L("A free indicator from kitchen waste replaces bought litmus paper, saving school lab money.","Penunjuk percuma daripada sisa dapur menggantikan kertas litmus yang dibeli, lalu menjimatkan belanja makmal sekolah."),
  soc:L("Testing household liquids builds science confidence and helps families think about what they pour away.","Menguji cecair di rumah membina keyakinan sains dan membantu keluarga berfikir tentang apa yang mereka buang.")},
 mats:[L("3–4 purple-cabbage outer leaves, OR about 10 bunga telang (butterfly-pea) flowers","3–4 helai daun luar kubis ungu, ATAU kira-kira 10 kuntum bunga telang"),
  L("1 cup (250 mL) water","1 cawan (250 mL) air"),
  L("A blender, or a bowl and spoon to squash; a sieve or clean cloth","Pengisar, atau mangkuk dan sudu untuk menghancurkan; penapis atau kain bersih"),
  L("6–8 clear cups (or bottles cut in half), labelled","6–8 cawan lutsinar (atau botol yang dipotong dua), berlabel"),
  L("Samples: lime juice, vinegar, soda water, tap water, salt water, baking-soda water (1 tsp in ½ cup water), soapy water","Sampel: jus limau nipis, cuka, air soda, air paip, air garam, air soda penaik (1 sudu kecil dalam ½ cawan air), air sabun"),
  L("Spoons or droppers (washed medicine syringes work)","Sudu atau penitis (picagari ubat yang dibasuh boleh digunakan)"),
  L("Scrap paper or coffee filters for test strips","Kertas terpakai atau penapis kopi untuk jalur ujian"),
  L("Teacher: a pH meter or universal indicator paper to check","Guru: meter pH atau kertas penunjuk semesta untuk menyemak"),
  L("Safety glasses, if available","Cermin mata keselamatan, jika ada")],
 steps:[S("Tear the cabbage leaves (or flowers) into small bits. Blend or squash them with 1 cup of water for 2 minutes.","Carik daun kubis (atau bunga) kecil-kecil. Kisar atau lenyekkan bersama 1 cawan air selama 2 minit.","Warm water, added by an adult, pulls the colour out faster.","Air suam, dituang oleh orang dewasa, mengeluarkan warna dengan lebih cepat."),
  S("Strain the liquid through a sieve or cloth. You now have a purple (cabbage) or blue (bunga telang) indicator!","Tapis cecair melalui penapis atau kain. Kini anda ada penunjuk berwarna ungu (kubis) atau biru (bunga telang)!"),
  S("Pour a little of each sample into its own labelled cup.","Tuang sedikit setiap sampel ke dalam cawan berlabel masing-masing."),
  S("Guess first! Write \"acid\", \"neutral\" or \"base\" for each cup.","Teka dahulu! Tulis \"asid\", \"neutral\" atau \"bes\" bagi setiap cawan."),
  S("Add 2 spoons of indicator to each cup. Watch the colour change and write it down.","Masukkan 2 sudu penunjuk ke dalam setiap cawan. Perhatikan perubahan warna dan catatkan."),
  S("Line the cups up from red or pink (acid) through purple or blue (neutral) to green or yellow (base). You made a pH rainbow!","Susun cawan daripada merah atau merah jambu (asid), ungu atau biru (neutral), hingga hijau atau kuning (bes). Anda sudah membuat pelangi pH!","Roughly, red cabbage goes red (pH 1–2) → pink (3–4) → purple (5–7) → blue (8) → blue-green (9–10) → green (11–12) → yellow (13+). Bunga telang is pink-purple in acid, blue near neutral and green in base.","Secara kasar, kubis ungu berubah merah (pH 1–2) → merah jambu (3–4) → ungu (5–7) → biru (8) → biru kehijauan (9–10) → hijau (11–12) → kuning (13+). Bunga telang merah jambu keunguan dalam asid, biru hampir neutral dan hijau dalam bes."),
  S("Precision guess (the poster's game): the teacher hides the pH meter's screen. Guess each sample's pH number, then reveal. Who was closest?","Teka tepat (permainan poster): guru menyembunyikan skrin meter pH. Teka nombor pH setiap sampel, kemudian dedahkan. Siapa paling hampir?"),
  S("Mix it right! Put indicator in a cup of vinegar. Add baking-soda water a few drops at a time, stirring, until the colour turns back to purple or blue (neutral). Count the drops. Watch it fizz!","Campur dengan tepat! Masukkan penunjuk ke dalam secawan cuka. Titiskan air soda penaik sedikit demi sedikit sambil dikacau sehingga warna kembali ungu atau biru (neutral). Kira bilangan titis. Lihat buihnya!","The fizz is carbon dioxide: CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂.","Buih itu karbon dioksida: CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂."),
  S("Bonus: soak strips of scrap paper or coffee filter in the indicator and let them dry. Now you have your own \"litmus\" paper!","Bonus: rendam jalur kertas terpakai atau penapis kopi dalam penunjuk dan biarkan kering. Kini anda ada kertas \"litmus\" sendiri!"),
  S("Clean up: these household samples can go down the sink with plenty of water. Leftover cabbage goes to the compost.","Kemas: sampel dapur ini boleh dibuang ke sinki dengan banyak air. Baki kubis dimasukkan ke dalam kompos.")],
 safety:[W("Never taste or touch the test liquids: we look at the colour instead. (The old poster said acids \"taste sour\" and bases \"feel slippery\"; we never test that way.)","Jangan rasa atau sentuh cecair ujian: kita lihat warnanya. (Poster lama menyebut asid \"rasa masam\" dan bes \"terasa licin\"; kita tidak menguji dengan cara itu.)"),
  W("Lime juice and vinegar sting the eyes. Wear glasses if you have them, and rinse with clean water if splashed.","Jus limau dan cuka pedih jika terkena mata. Pakai cermin mata jika ada, dan bilas dengan air bersih jika terpercik."),
  W("Household samples only: no bleach, drain cleaner or toilet cleaner. Never mix cleaning products.","Sampel dapur sahaja: jangan guna peluntur, pembersih longkang atau pembersih tandas. Jangan campurkan bahan pencuci.")],
 sci:{kids:L("Purple cabbage and bunga telang contain a natural colour called anthocyanin. It changes colour when a liquid is an acid (like lime juice) or a base (like baking soda). The colour tells us what kind of liquid it is, like a colour detective!","Kubis ungu dan bunga telang mengandungi pewarna semula jadi yang dipanggil antosianin. Warnanya berubah apabila cecair itu asid (seperti jus limau) atau bes (seperti soda penaik). Warna itu memberitahu jenis cecair, seperti detektif warna!"),
  teens:L("pH = −log₁₀[H⁺]: each unit is a 10-fold change in hydrogen-ion concentration, so pH 3 is 100 times more acidic than pH 5. Anthocyanin molecules gain or lose H⁺ as the pH changes, and each form absorbs different wavelengths of light, so we see different colours. Neutralisation: acid + base → salt + water (plus CO₂ when the base is a carbonate or hydrogencarbonate). Counting drops to the colour change is a simple titration.","pH = −log₁₀[H⁺]: setiap unit ialah perubahan 10 kali ganda dalam kepekatan ion hidrogen, jadi pH 3 adalah 100 kali lebih berasid daripada pH 5. Molekul antosianin menerima atau kehilangan H⁺ apabila pH berubah, dan setiap bentuk menyerap panjang gelombang cahaya yang berbeza, jadi kita nampak warna berbeza. Peneutralan: asid + bes → garam + air (serta CO₂ jika bes ialah karbonat atau hidrogen karbonat). Mengira titisan hingga warna berubah ialah pentitratan ringkas."),
  adults:L("pH is a core parameter in waste management: landfill leachate, food-waste fermentation (eco-enzyme is about pH 3.5–4) and industrial effluent are all monitored for pH, and Malaysian effluent regulations set allowed pH ranges for discharges. A zero-cost indicator made from kitchen waste lets community groups screen liquids and teach the concept before investing in meters.","pH ialah parameter utama dalam pengurusan sisa: larut resap tapak pelupusan, penapaian sisa makanan (eko-enzim kira-kira pH 3.5–4) dan efluen industri semuanya dipantau pH-nya, dan peraturan efluen Malaysia menetapkan julat pH yang dibenarkan untuk pelepasan. Penunjuk tanpa kos daripada sisa dapur membolehkan kumpulan komuniti menyaring cecair dan mengajar konsep ini sebelum melabur dalam meter.")},
 teach:L("Make one big jug of indicator before class. Use the hidden-meter game with older pupils; for under-9s, stop at the colour rainbow. Link it to other labs: test the eco-enzyme and the cured soap.","Sediakan sejag besar penunjuk sebelum kelas. Guna permainan meter tersembunyi untuk murid lebih tua; untuk bawah 9 tahun, cukup sampai pelangi warna. Kaitkan dengan makmal lain: uji eko-enzim dan sabun yang sudah diperam."),
 ext:[L("Colour chart: measure samples with a pH meter and photograph the indicator colour at each pH value.","Carta warna: ukur sampel dengan meter pH dan ambil gambar warna penunjuk pada setiap nilai pH."),
  L("Cabbage vs bunga telang: which shows more colour steps? Which keeps its colour longer?","Kubis lawan bunga telang: yang mana menunjukkan lebih banyak peringkat warna? Yang mana warnanya tahan lebih lama?"),
  L("Titration: how many drops of baking-soda solution neutralise 10 mL of vinegar? Repeat 3 times and average. Predict, then test, what happens with 5 mL.","Pentitratan: berapa titis larutan soda penaik meneutralkan 10 mL cuka? Ulang 3 kali dan kira purata. Ramal, kemudian uji, apa berlaku dengan 5 mL.")],
 refl:[L("Which sample surprised you most?","Sampel mana yang paling mengejutkan anda?"),
  L("Are most foods acidic or basic? Look at your results!","Adakah kebanyakan makanan berasid atau bes? Lihat keputusan anda!"),
  L("Why is it dangerous to pour strong acids or bases down the drain?","Mengapa berbahaya menuang asid atau bes kuat ke dalam longkang?"),
  L("How did a \"waste\" cabbage leaf replace something we usually buy?","Bagaimana daun kubis \"sisa\" menggantikan barang yang biasanya kita beli?")],
 posters:[P("assets/labs/litmus-poster-1.jpg","pH journey poster","Poster perjalanan pH")]},

/* ---------------------------------------------------------------- 5 ODOUR */
{id:"odour",icon:"☕",min:7,mins:40,diff:1,sup:"light",heat:false,sdgs:[11,12],video:"1ayOz9OnR3WaoiAyGKFvYQ8f3CFhaNFEH",
 badge:{icon:"☕",name:L("Odour Hero","Wira Bau")},
 title:L("Kopi Wira Bau: Coffee-Ground Odour Absorbers","Kopi Wira Bau: Penyerap Bau daripada Hampas Kopi"),
 hook:L("Used coffee grounds become cute shapes that freshen shoes, cupboards and fridges.","Hampas kopi dijadikan bentuk comel yang menyegarkan rak kasut, almari dan peti sejuk."),
 time:L("40 min + 1–2 days drying","40 min + 1–2 hari pengeringan"),
 cost:L("Very low: the cornstarch and corn syrup for one batch cost about RM 0.90–1.00 (shop prices, Oct 2026). Add a little for cinnamon and fragrance. Prices vary.","Sangat rendah: tepung jagung dan sirap jagung untuk satu adunan berharga kira-kira RM 0.90–1.00 (harga kedai, Okt 2026). Tambah sedikit untuk kayu manis dan pewangi. Harga berbeza-beza."),
 waste:L("Used coffee grounds from cafés","Hampas kopi dari kedai kopi"),product:L("Odour-absorbing shapes","Bentuk penyerap bau"),
 why:{env:L("Cafés throw away coffee grounds every day; in landfill they rot. Reusing them keeps food waste out of the bin.","Kedai kopi membuang hampas kopi setiap hari; di tapak pelupusan ia reput. Mengguna semula hampas menjauhkan sisa makanan daripada tong sampah."),
  econ:L("A free waste becomes a gift or bazaar product that is cheaper than many shop-bought air fresheners.","Sisa percuma menjadi hadiah atau produk bazar yang lebih murah daripada kebanyakan penyegar udara di kedai."),
  soc:L("Pupils ask a local café for its grounds: a small partnership between school and business.","Murid meminta hampas daripada kedai kopi berdekatan: satu kerjasama kecil antara sekolah dan peniaga.")},
 mats:[L("1 cup used coffee grounds, completely dried","1 cawan hampas kopi, kering sepenuhnya"),
  L("½ cup cornstarch","½ cawan tepung jagung"),
  L("2 tbsp corn syrup (the binder)","2 sudu besar sirap jagung (pengikat)"),
  L("1 tsp ground cinnamon","1 sudu kecil serbuk kayu manis"),
  L("10–15 drops of fragrance or essential oil (an adult adds them)","10–15 titis pewangi atau minyak pati (ditambah oleh orang dewasa)"),
  L("A little water, only if needed","Sedikit air, jika perlu sahaja"),
  L("Tray, bowl and spoon","Dulang, mangkuk dan sudu"),
  L("Silicone moulds (chocolate or ice-cube shapes)","Acuan silikon (bentuk coklat atau ais)"),
  L("A small open container or cloth pouch (an old sock works!)","Bekas kecil terbuka atau uncang kain (stokin lama pun boleh!)")],
 steps:[S("Ask a nearby coffee shop for its used coffee grounds. Bring a clean container.","Minta hampas kopi daripada kedai kopi berdekatan. Bawa bekas yang bersih."),
  S("Spread the grounds thinly on a tray. Dry them for 1–2 days in the sun or an airy place, stirring sometimes. They must be completely dry.","Ratakan hampas nipis-nipis di atas dulang. Keringkan selama 1–2 hari di bawah matahari atau di tempat berangin, kacau sekali-sekala. Hampas mesti kering sepenuhnya.","Damp grounds go mouldy within a few days.","Hampas yang lembap akan berkulat dalam beberapa hari."),
  S("In a bowl, mix 1 cup dry grounds, ½ cup cornstarch and 1 tsp cinnamon.","Dalam mangkuk, gaul 1 cawan hampas kering, ½ cawan tepung jagung dan 1 sudu kecil kayu manis."),
  S("Add 2 tbsp corn syrup and the drops of fragrance (adult). Mix well with a spoon.","Masukkan 2 sudu besar sirap jagung dan titisan pewangi (orang dewasa). Gaul rata dengan sudu."),
  S("Squeeze a little in your hand. If it crumbles, add water one teaspoon at a time until it holds together.","Genggam sedikit adunan. Jika ia berderai, tambah air satu sudu kecil pada satu masa sehingga adunan melekat."),
  S("Press the mixture firmly into the silicone moulds.","Tekan adunan dengan kuat ke dalam acuan silikon."),
  S("Dry for 24–48 hours until hard, then pop them out.","Keringkan selama 24–48 jam sehingga keras, kemudian keluarkan."),
  S("Put them in a small open container or cloth pouch: shoe rack, wardrobe, fridge or bathroom.","Letakkan dalam bekas kecil terbuka atau uncang kain: rak kasut, almari pakaian, peti sejuk atau bilik mandi."),
  S("When the smell fades, dry them in the sun to refresh. Old ones can go into the compost.","Apabila baunya hilang, jemur di bawah matahari untuk menyegarkannya. Yang lama boleh dimasukkan ke dalam kompos.")],
 safety:[W("Keep away from pets and toddlers: coffee (caffeine) and essential oils are harmful to dogs and cats. Label them \"Not food\": they look like chocolate!","Jauhkan daripada haiwan peliharaan dan kanak-kanak kecil: kopi (kafein) dan minyak pati berbahaya kepada anjing dan kucing. Labelkan \"Bukan makanan\": ia nampak seperti coklat!"),
  W("Essential oils can irritate skin: an adult adds the drops. Wash hands afterwards.","Minyak pati boleh merengsakan kulit: orang dewasa yang menitiskannya. Basuh tangan selepas itu."),
  W("Throw away any shape that grows mould.","Buang mana-mana bentuk yang berkulat.")],
 sci:{kids:L("Coffee grounds are full of tiny holes, like a sponge. Smelly bits in the air get stuck in the holes. The coffee and cinnamon also smell nice, so the bad smell is harder to notice.","Hampas kopi penuh dengan lubang halus seperti span. Zarah berbau di udara tersangkut dalam lubang itu. Kopi dan kayu manis juga berbau wangi, jadi bau busuk kurang dihidu."),
  teens:L("Odour molecules are small, volatile compounds. Porous solids trap them by adsorption: molecules stick to a surface (unlike absorption, where something soaks into the bulk). Dried spent grounds have a large internal surface, but far less than activated carbon, which is made at high temperature to open a huge network of pores. So coffee shapes reduce and mask odours rather than neutralise all of them. Cornstarch and corn syrup are the glue: as they dry, sugar and starch molecules form hydrogen bonds and lock the grounds into shape.","Molekul bau ialah sebatian kecil yang mudah meruap. Pepejal berliang memerangkapnya secara penjerapan: molekul melekat pada permukaan (berbeza daripada penyerapan, apabila bahan meresap ke dalam). Hampas kopi kering mempunyai permukaan dalaman yang luas, tetapi jauh kurang daripada karbon teraktif yang dihasilkan pada suhu tinggi untuk membuka rangkaian liang yang sangat besar. Jadi bentuk kopi mengurangkan dan menutup bau, bukan meneutralkan semuanya. Tepung jagung dan sirap jagung ialah gamnya: apabila kering, molekul gula dan kanji membentuk ikatan hidrogen dan mengunci hampas dalam bentuknya."),
  adults:L("Spent coffee grounds are a steady, clean, single-source waste stream from cafés, ideal for small W2W products. Other proven uses are compost, mushroom-growing substrate and fuel pellets. Keep product claims precise: \"helps reduce and mask odours\" is honest; \"neutralises odours\" or \"antibacterial\" would need testing.","Hampas kopi ialah aliran sisa yang tetap, bersih dan dari satu sumber (kedai kopi), sesuai untuk produk W2W kecil. Kegunaan lain yang terbukti ialah kompos, media tanaman cendawan dan pelet bahan api. Pastikan dakwaan produk tepat: \"membantu mengurangkan dan menutup bau\" adalah jujur; \"meneutralkan bau\" atau \"antibakteria\" memerlukan ujian.")},
 teach:L("Collect and dry the grounds a week before class: drying decides success. One batch is enough for a small group; scale up by cups.","Kumpul dan keringkan hampas seminggu sebelum kelas: pengeringan menentukan kejayaan. Satu adunan cukup untuk satu kumpulan kecil; gandakan mengikut cawan."),
 ext:[L("Fair test: put half a cut onion in two closed boxes, one with a coffee shape and one without (try baking soda too). After a day, blind testers rate the smell from 1 to 5.","Ujian adil: letak separuh bawang yang dipotong dalam dua kotak tertutup, satu dengan bentuk kopi dan satu tanpa (cuba juga soda penaik). Selepas sehari, penguji yang tidak tahu menilai bau dari 1 hingga 5."),
  L("Drying: weigh the wet grounds and the dry grounds. What percentage was water?","Pengeringan: timbang hampas basah dan hampas kering. Berapa peratus air?"),
  L("Price it: cost per shape, then a selling price for a pack of 3 including packaging.","Tetapkan harga: kos sebiji, kemudian harga jualan untuk pek 3 biji termasuk pembungkusan.")],
 refl:[L("Where else could you use your Kopi Wira Bau?","Di mana lagi anda boleh guna Kopi Wira Bau?"),
  L("Why must the grounds be completely dry?","Mengapa hampas mesti kering sepenuhnya?"),
  L("Which other café wastes could become a product?","Sisa kedai kopi apa lagi yang boleh dijadikan produk?")],
 posters:[P("assets/labs/odour-poster-1.jpg","Materials","Bahan yang diperlukan"),P("assets/labs/odour-poster-2.jpg","Steps to make Kopi Wira Bau","Langkah membuat Kopi Wira Bau"),P("assets/labs/odour-poster-3.jpg","Where to use it","Di mana nak guna")]},

/* ---------------------------------------------------------------- 6 WATERING */
{id:"watering",icon:"🌱",min:7,mins:40,diff:2,sup:"close",heat:false,sdgs:[4,9,13,15],video:"1O-4GUvhsi0y4eIFr2oLfwY0EhfDiVULn",
 badge:{icon:"🌱",name:L("Green Engineer","Jurutera Hijau")},
 title:L("Self-Watering Bottle Garden","Taman Botol Siram Sendiri"),
 hook:L("A plastic bottle and a T-shirt strip water your plant for you. Teens can add an Arduino brain.","Botol plastik dan jalur baju-T menyiram pokok untuk anda. Remaja boleh menambah \"otak\" Arduino."),
 time:L("40 min (Arduino version: +2 h)","40 min (versi Arduino: +2 jam)"),
 cost:L("Wick version: almost free. Arduino version: example parts (Oct 2026: compatible board, moisture sensor, relay, small pump) add up to about RM 32–57, before wires, tubing and a power supply. Prices vary by shop.","Versi sumbu: hampir percuma. Versi Arduino: contoh komponen (Okt 2026: papan serasi, sensor kelembapan, geganti, pam kecil) berjumlah kira-kira RM 32–57, belum termasuk wayar, tiub dan bekalan kuasa. Harga berbeza mengikut kedai."),
 waste:L("PET bottles, old T-shirt","Botol PET, baju-T lama"),product:L("Self-watering planter (automatic watering for teens)","Pasu siram sendiri (siraman automatik untuk remaja)"),
 why:{env:L("Bottles are reused before they are recycled, and wick watering gives the plant only the water it needs, with less run-off.","Botol diguna semula sebelum dikitar semula, dan siraman sumbu memberi pokok air yang diperlukan sahaja, dengan kurang air terbuang."),
  econ:L("Free planters; automatic watering saves time and water for urban growers.","Pasu percuma; siraman automatik menjimatkan masa dan air bagi petani bandar."),
  soc:L("Small gardens fit flats and school corridors, adding green space where there is little (an idea from a 2024 student project).","Taman kecil muat di rumah pangsa dan koridor sekolah, menambah ruang hijau di tempat yang kurang (idea daripada projek pelajar 2024).")},
 mats:[H("Wick planter (everyone)","Pasu sumbu (semua)"),
  L("1 clean 1.5 L PET bottle, label removed","1 botol PET 1.5 L yang bersih, label ditanggalkan"),
  L("1 strip of old cotton T-shirt, about 2 cm × 25 cm (the wick)","1 jalur baju-T kapas lama, kira-kira 2 cm × 25 cm (sumbu)"),
  L("Potting soil mixed with some compost","Tanah pasu dicampur sedikit kompos"),
  L("Seeds or seedlings: kangkung, sawi, bayam or chilli","Biji benih atau anak pokok: kangkung, sawi, bayam atau cili"),
  L("Scissors or craft knife and a nail or bradawl (adult)","Gunting atau pisau kraf dan paku atau penebuk (orang dewasa)"),
  L("Paint or markers to decorate","Cat atau pen penanda untuk menghias"),
  H("Automatic version (teens)","Versi automatik (remaja)"),
  L("Arduino Uno or Nano + USB cable or 5 V power bank","Arduino Uno atau Nano + kabel USB atau bank kuasa 5 V"),
  L("Capacitive soil-moisture sensor (not a DHT11: that one measures air)","Penderia lembapan tanah kapasitif (bukan DHT11: itu untuk udara)"),
  L("5 V relay module","Modul geganti (relay) 5 V"),
  L("Small 3–5 V submersible pump with its own battery pack + 1 m silicone tube","Pam tenggelam kecil 3–5 V dengan pek bateri sendiri + 1 m tiub silikon"),
  L("Jumper wires and a covered water container","Wayar pelompat dan bekas air bertutup")],
 steps:[H("Wick planter","Pasu sumbu"),
  S("ADULT: cut the bottle in half, a little below the middle.","ORANG DEWASA: potong botol kepada dua, sedikit di bawah bahagian tengah."),
  S("ADULT: make a hole in the bottle cap with a nail or bradawl.","ORANG DEWASA: tebuk lubang pada penutup botol dengan paku atau penebuk."),
  S("Push the T-shirt strip through the cap hole and tie a knot so it can't slip out. About 10 cm hangs below the cap.","Masukkan jalur baju-T melalui lubang penutup dan buat simpulan supaya tidak terlepas. Kira-kira 10 cm tergantung di bawah penutup."),
  S("Wet the wick. Screw the cap on and turn the top half upside down (cap pointing down) into the bottom half.","Basahkan sumbu. Pasang penutup dan terbalikkan bahagian atas botol (penutup menghala ke bawah) ke dalam bahagian bawah."),
  S("Fill the top part with moist soil, spreading the wick inside the soil. Plant your seeds.","Isi bahagian atas dengan tanah lembap dan sebarkan sumbu di dalam tanah. Tanam biji benih."),
  S("Lift the top out, pour water into the bottom part, and put the top back. The wick must touch the water.","Angkat bahagian atas, tuang air ke dalam bahagian bawah, kemudian letak semula. Sumbu mesti mencecah air."),
  S("Decorate your planter and put it where it gets light. Check the water level every few days.","Hiaskan pasu dan letakkan di tempat yang mendapat cahaya. Periksa paras air setiap beberapa hari."),
  S("Every week: empty the reservoir, rinse it and refill. This stops Aedes mosquitoes breeding!","Setiap minggu: kosongkan takungan, bilas dan isi semula. Ini menghalang nyamuk Aedes membiak!"),
  H("Automatic version (teens)","Versi automatik (remaja)"),
  S("Wire it: sensor VCC → 5V, GND → GND, AOUT → A0. Relay IN → D7, VCC → 5V, GND → GND. The pump's battery pack is switched through the relay's COM and NO terminals.","Sambung: penderia VCC → 5V, GND → GND, AOUT → A0. Geganti IN → D7, VCC → 5V, GND → GND. Pek bateri pam disambung melalui terminal COM dan NO geganti."),
  S("Calibrate: open the Serial Monitor and note the reading in dry air and with the sensor tip in a glass of water. Set THRESHOLD between the two.","Kalibrasi: buka Serial Monitor dan catat bacaan di udara kering dan apabila hujung penderia dalam segelas air. Tetapkan THRESHOLD di antara kedua-duanya.","Most capacitive modules read higher when dry and lower when wet.","Kebanyakan modul kapasitif memberi bacaan tinggi apabila kering dan rendah apabila basah."),
  S("Upload the sketch below. Push the sensor into the soil (only up to its line) and test: dry soil → pump runs 2 seconds → waits → reads again.","Muat naik lakaran di bawah. Cucuk penderia ke dalam tanah (hingga garisannya sahaja) dan uji: tanah kering → pam hidup 2 saat → tunggu → baca semula."),
  S("Keep all electronics in a box above the water and log how often it waters.","Simpan semua komponen elektronik dalam kotak di atas paras air dan catat kekerapan siraman.")],
 code:`// WasteQuest self-watering: capacitive sensor on A0, relay on D7
const int SENSOR = A0, RELAY = 7;
int THRESHOLD = 450;          // set from YOUR dry/wet readings

void setup() {
  pinMode(RELAY, OUTPUT);
  digitalWrite(RELAY, LOW);   // pump off (active-LOW relay? swap HIGH/LOW)
  Serial.begin(9600);
}

void loop() {
  int v = analogRead(SENSOR);
  Serial.println(v);
  if (v > THRESHOLD) {        // higher reading = drier soil
    digitalWrite(RELAY, HIGH);  // pump on
    delay(2000);                // 2 s of water
    digitalWrite(RELAY, LOW);   // pump off
    delay(60000);               // let it soak in for 1 min
  }
  delay(1000);
}`,
 safety:[W("Cut bottle edges can be sharp: an adult cuts, and you can cover the edge with tape.","Tepi botol yang dipotong boleh tajam: orang dewasa yang memotong, dan tepinya boleh dibalut pita."),
  D("Electricity and water (Arduino version): use only low voltage (USB, power bank or AA batteries). Never use mains (230 V) power. Keep the electronics above and away from the water, touch wires only with dry hands, and never let the pump run dry.","Elektrik dan air (versi Arduino): guna voltan rendah sahaja (USB, bank kuasa atau bateri AA). Jangan sekali-kali guna bekalan elektrik utama (230 V). Letakkan elektronik di atas dan jauh dari air, sentuh wayar dengan tangan kering sahaja, dan jangan biarkan pam berjalan tanpa air."),
  W("Standing water breeds Aedes mosquitoes (dengue). Keep the reservoir covered and change the water at least once a week: mosquitoes grow from egg to adult in about 7–10 days.","Air bertakung menjadi tempat pembiakan nyamuk Aedes (denggi). Tutup takungan dan tukar air sekurang-kurangnya seminggu sekali: nyamuk membesar daripada telur menjadi dewasa dalam kira-kira 7–10 hari.")],
 sci:{kids:L("The T-shirt strip drinks water up like a tissue dipped in a drink. Water creeps up the tiny gaps between the threads into the soil, so the plant gets a drink whenever the soil is dry.","Jalur baju-T menyedut air seperti tisu yang dicelup ke dalam minuman. Air naik melalui celah halus antara benang ke dalam tanah, jadi pokok mendapat air setiap kali tanah kering."),
  teens:L("Capillary action: water molecules stick to the fibres (adhesion) and to each other (cohesion), so water climbs narrow gaps against gravity; the narrower the gap, the higher it rises (Jurin's law, h = 2γcosθ ⁄ ρgr). As the soil dries and leaves transpire, water keeps moving from the wet wick to the dry soil. In the Arduino version, a capacitive sensor measures the soil's dielectric permittivity: water (ε ≈ 80) raises it far above dry soil, so the reading tracks moisture. The code is a feedback loop: measure → compare with a threshold → act → wait → measure again.","Tindakan kapilari: molekul air melekat pada gentian (lekatan) dan sesama sendiri (lekitan), jadi air naik melalui celah sempit melawan graviti; lebih sempit celahnya, lebih tinggi air naik (hukum Jurin, h = 2γcosθ ⁄ ρgr). Apabila tanah kering dan daun bertranspirasi, air terus bergerak dari sumbu basah ke tanah kering. Dalam versi Arduino, penderia kapasitif mengukur ketelusan dielektrik tanah: air (ε ≈ 80) menaikkannya jauh melebihi tanah kering, jadi bacaan mengikut kelembapan. Kod itu ialah gelung suap balik: ukur → banding dengan nilai ambang → bertindak → tunggu → ukur semula."),
  adults:L("Sub-irrigation (wicking) cuts evaporation and run-off and suits small urban plots; sensor-driven irrigation adds data and saves labour. Costs scale quickly: one 2024 student proposal budgeted RM 51 per pot for a sensor-and-pump vertical garden, so the wick system is the low-cost entry point and automation suits demonstrations or high-value crops. In the waste hierarchy, reusing a bottle comes before recycling it.","Siraman bawah (sumbu) mengurangkan penyejatan dan air larian serta sesuai untuk plot bandar yang kecil; siraman berpenderia menambah data dan menjimatkan tenaga kerja. Kos meningkat dengan cepat: satu cadangan pelajar 2024 membajetkan RM 51 sepasu untuk taman menegak berpenderia dan pam, jadi sistem sumbu ialah pilihan permulaan berkos rendah dan automasi sesuai untuk demonstrasi atau tanaman bernilai tinggi. Dalam hierarki sisa, guna semula botol didahulukan sebelum kitar semula.")},
 teach:L("Cut the bottles before class for under-10s. Fast growers (kangkung, sawi) show results within about 2 weeks. Run the Arduino build as a teen club activity.","Potong botol sebelum kelas untuk murid bawah 10 tahun. Tanaman cepat tumbuh (kangkung, sawi) menunjukkan hasil dalam kira-kira 2 minggu. Jalankan binaan Arduino sebagai aktiviti kelab remaja."),
 ext:[L("Water use: mark the reservoir level every day. How many mL does the plant use per day? Compare a wick pot with a hand-watered pot.","Penggunaan air: tanda paras takungan setiap hari. Berapa mL air digunakan sehari? Bandingkan pasu sumbu dengan pasu yang disiram tangan."),
  L("Wick test: try cotton, polyester and a sponge strip. How high does coloured water rise in 10 minutes in each?","Ujian sumbu: cuba kapas, poliester dan jalur span. Setinggi mana air berwarna naik dalam 10 minit bagi setiap satu?"),
  L("Arduino: print a reading every 10 minutes and graph soil moisture over 3 days. Add a daily limit on pump time to the code.","Arduino: cetak bacaan setiap 10 minit dan graf kelembapan tanah selama 3 hari. Tambah had masa pam harian dalam kod.")],
 refl:[L("How does the water get from the bottle to the roots without you?","Bagaimana air sampai dari botol ke akar tanpa anda?"),
  L("Why must we change the water every week?","Mengapa kita mesti menukar air setiap minggu?"),
  L("What else could you grow in a bottle garden at school?","Apa lagi yang boleh ditanam dalam taman botol di sekolah?")],
 posters:[P("assets/labs/watering-poster-2.jpg","How the automatic system works, benefits","Cara sistem automatik berfungsi, kebaikan")]},

/* ---------------------------------------------------------------- 7 ENZYME */
{id:"enzyme",icon:"🍊",min:7,mins:30,diff:1,sup:"light",heat:false,sdgs:[6,12,13],video:null,
 badge:{icon:"🍊",name:L("Enzyme Brewer","Pembancuh Enzim")},
 title:L("Eco-Enzyme","Eko-Enzim"),
 hook:L("Fruit peels + brown sugar + water and a little patience make a natural cleaner.","Kulit buah + gula perang + air dan sedikit kesabaran menghasilkan pembersih semula jadi."),
 time:L("30 min + 3 months fermenting","30 min + 3 bulan penapaian"),
 cost:L("Very low: about RM 0.60 of brown sugar for a batch made with 1 L of water (shop prices, Oct 2026). How much liquid you get back varies.","Sangat rendah: kira-kira RM 0.60 gula perang untuk satu kelompok dengan 1 L air (harga kedai, Okt 2026). Jumlah cecair yang terhasil berbeza-beza."),
 waste:L("Fruit and vegetable peels","Kulit buah dan sayur"),product:L("Eco-enzyme liquid (mild cleaner, plant feed)","Cecair eko-enzim (pembersih lembut, baja tanaman)"),
 why:{env:L("Food is 30.6% of Malaysian household waste. Peels turned into eco-enzyme stay out of landfill, where they would rot and release methane.","Makanan ialah 30.6% daripada sisa domestik Malaysia. Kulit buah yang dijadikan eko-enzim tidak masuk ke tapak pelupusan, di mana ia akan reput dan membebaskan metana."),
  econ:L("A bag of sugar plus free peels makes litres of mild cleaner, and the leftover pulp becomes compost.","Sebungkus gula dan kulit buah percuma menghasilkan berliter-liter pembersih lembut, dan hampasnya menjadi kompos."),
  soc:L("Easy for every home and school; eco-enzyme groups are active in many Malaysian communities.","Mudah untuk setiap rumah dan sekolah; kumpulan eko-enzim aktif dalam banyak komuniti di Malaysia.")},
 mats:[L("100 g brown sugar, gula merah or molasses (1 part)","100 g gula perang, gula merah atau molases (1 bahagian)"),
  L("300 g fresh fruit and vegetable peels, cut small (3 parts): pineapple, orange, papaya, banana…","300 g kulit buah dan sayur yang segar, dipotong kecil (3 bahagian): nanas, oren, betik, pisang…"),
  L("1 litre (1,000 g) clean water (10 parts)","1 liter (1,000 g) air bersih (10 bahagian)"),
  L("A 1.5–2 L plastic bottle or container with a screw lid (not glass)","Botol atau bekas plastik 1.5–2 L dengan penutup berulir (bukan kaca)"),
  L("Kitchen scale, knife, chopping board and funnel","Penimbang dapur, pisau, papan pemotong dan corong"),
  L("Label and marker","Label dan pen penanda")],
 steps:[S("Wash and chop the peels into small pieces. No meat, oily food or mouldy fruit.","Basuh dan potong kulit buah kecil-kecil. Jangan masukkan daging, makanan berminyak atau buah berkulat."),
  S("Weigh 1 part sugar, 3 parts peels and 10 parts water: 100 g sugar, 300 g peels, 1,000 g (1 L) water.","Timbang 1 bahagian gula, 3 bahagian kulit buah dan 10 bahagian air: 100 g gula, 300 g kulit buah, 1,000 g (1 L) air.","The ratio is by weight. The 2025 poster scaled it up to 1 kg : 3 kg : 10 kg.","Nisbah ini mengikut berat. Poster 2025 menggandakannya kepada 1 kg : 3 kg : 10 kg."),
  S("Pour the water into the bottle, add the sugar and shake until it dissolves.","Tuang air ke dalam botol, masukkan gula dan goncang sehingga larut."),
  S("Add the peels. Leave at least a quarter of the bottle empty for the gas.","Masukkan kulit buah. Biarkan sekurang-kurangnya suku botol kosong untuk gas."),
  S("Close the lid. Label it with today's date and the ready date (3 months later).","Tutup penutup. Labelkan dengan tarikh hari ini dan tarikh siap (3 bulan kemudian)."),
  S("Keep it in a cool, shady place, out of direct sun.","Simpan di tempat yang sejuk dan teduh, jauh dari cahaya matahari terus."),
  S("For the first 2 weeks, open the lid a little every day to let the gas out, then close it. After that, once a week.","Dalam 2 minggu pertama, buka penutup sedikit setiap hari untuk melepaskan gas, kemudian tutup semula. Selepas itu, seminggu sekali.","The 2025 student group built a pressure-relief valve and an Arduino-driven stirrer to do this automatically.","Kumpulan pelajar 2025 membina injap pelega tekanan dan pengacau berkuasa Arduino untuk melakukannya secara automatik."),
  S("After 3 months, strain it. The brown liquid is eco-enzyme! Put the leftover pulp in compost or in your next batch.","Selepas 3 bulan, tapis. Cecair perang itu ialah eko-enzim! Masukkan hampas ke dalam kompos atau kelompok seterusnya."),
  S("Always dilute before use. Commonly used: about 1 part eco-enzyme to 10–20 parts water for wiping floors and tables, and much weaker (about 1 : 500–1,000) for watering plants.","Sentiasa cairkan sebelum digunakan. Lazimnya: kira-kira 1 bahagian eko-enzim kepada 10–20 bahagian air untuk mengelap lantai dan meja, dan jauh lebih cair (kira-kira 1 : 500–1,000) untuk menyiram tanaman.")],
 safety:[W("Gas builds up inside: release it daily at first or the bottle can bulge or burst. Never use glass bottles.","Gas terkumpul di dalam: lepaskan setiap hari pada awalnya atau botol boleh mengembung atau pecah. Jangan guna botol kaca."),
  W("Not for drinking. Keep it labelled and away from small children. It is acidic: rinse eyes with water if splashed.","Bukan untuk diminum. Labelkan dan jauhkan daripada kanak-kanak kecil. Ia berasid: bilas mata dengan air jika terpercik."),
  W("A thin white film on top is normal. If you see black mould or it smells rotten, add a little more sugar, close it and check again in a week; if it is still bad, compost it and start again.","Lapisan putih nipis di atas adalah normal. Jika ada kulat hitam atau berbau busuk, tambah sedikit gula, tutup dan periksa semula seminggu kemudian; jika masih teruk, jadikan kompos dan mula semula.")],
 sci:{kids:L("Tiny living things called yeast and bacteria live on the peels. They eat the sugar and make gas (the fizz) and a sour liquid. After 3 months the liquid is sour enough to help with cleaning.","Hidupan halus yang dipanggil yis dan bakteria hidup pada kulit buah. Mereka makan gula dan menghasilkan gas (buih) serta cecair masam. Selepas 3 bulan, cecair itu cukup masam untuk membantu membersih."),
  teens:L("This is fermentation. Yeasts turn sugar into ethanol and carbon dioxide (C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂): that is the gas you release. When air gets in, acetic acid bacteria oxidise ethanol to acetic acid, and lactic acid bacteria make lactic acid. These organic acids lower the pH: studies of 1:3:10 eco-enzyme report about pH 3.5–4. Like mild vinegar, the acids loosen grime and limescale.","Ini ialah penapaian. Yis menukar gula kepada etanol dan karbon dioksida (C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂): itulah gas yang anda lepaskan. Apabila udara masuk, bakteria asid asetik mengoksidakan etanol kepada asid asetik, dan bakteria asid laktik menghasilkan asid laktik. Asid organik ini menurunkan pH: kajian eko-enzim 1:3:10 melaporkan kira-kira pH 3.5–4. Seperti cuka lembut, asid ini menanggalkan kotoran dan kerak kapur."),
  adults:L("Eco-enzyme is a low-cost, low-tech way to divert fruit waste and engage communities. Be careful with claims: the name suggests strong enzyme activity, but its cleaning action comes mainly from organic acids. It is not a registered disinfectant, and claims that it purifies rivers or treats illness are not supported by solid evidence. Honest positioning (a mild acidic cleaner and a way to cut food waste) protects your credibility.","Eko-enzim ialah cara berkos rendah dan berteknologi rendah untuk mengalihkan sisa buah dan melibatkan komuniti. Berhati-hati dengan dakwaan: namanya membayangkan aktiviti enzim yang kuat, tetapi tindakan pembersihannya kebanyakannya daripada asid organik. Ia bukan nyahkuman berdaftar, dan dakwaan bahawa ia menjernihkan sungai atau merawat penyakit tidak disokong bukti kukuh. Kedudukan yang jujur (pembersih berasid lembut dan cara mengurangkan sisa makanan) menjaga kredibiliti anda.")},
 teach:L("Start a class batch early in the term so it is ready before the end. Set a rota for the daily gas release. Test the pH every month in the Litmus lab.","Mulakan kelompok kelas awal penggal supaya siap sebelum penggal tamat. Sediakan jadual giliran untuk melepaskan gas setiap hari. Uji pH setiap bulan dalam makmal Litmus."),
 ext:[L("Measure the pH every 2 weeks for 3 months and plot it. When does it level off?","Ukur pH setiap 2 minggu selama 3 bulan dan plotkan. Bilakah ia menjadi stabil?"),
  L("Fair test: one bottle with pineapple peel, one with banana peel. Compare smell, colour and final pH.","Ujian adil: satu botol dengan kulit nanas, satu dengan kulit pisang. Bandingkan bau, warna dan pH akhir."),
  L("Cost per litre: price of the sugar ÷ litres made. Compare with a shop floor cleaner (per litre of diluted cleaner).","Kos seliter: harga gula ÷ liter yang dihasilkan. Bandingkan dengan pencuci lantai di kedai (bagi setiap liter pencuci yang dicairkan).")],
 refl:[L("What made the gas inside the bottle?","Apakah yang menghasilkan gas di dalam botol?"),
  L("Why do we leave space at the top?","Mengapa kita membiarkan ruang kosong di atas?"),
  L("Which claims about eco-enzyme are true, and which need more evidence?","Dakwaan mana tentang eko-enzim yang benar, dan mana yang memerlukan lebih banyak bukti?")],
 posters:[P("assets/labs/enzyme-poster-2.jpg","Materials: eco-enzyme, soap and mixer","Bahan: eko-enzim, sabun dan pengacau"),P("assets/labs/enzyme-poster-3.jpg","Method: ratio 3 kg peels : 1 kg sugar : 10 kg water","Kaedah: nisbah 3 kg kulit buah : 1 kg gula : 10 kg air")]},

/* ---------------------------------------------------------------- 8 ECOBRICK */
{id:"ecobrick",icon:"🧱",min:7,mins:45,diff:1,sup:"light",heat:false,sdgs:[11,12,13,14,15],video:"10LjVG6AAdve3oxyZ_rpCBDIYJcBLaBYs",
 badge:{icon:"🧱",name:L("Brick Builder","Pembina Bata")},
 title:L("Eco-Bricks & Eco-Bags","Eko-Bata & Beg Eko"),
 hook:L("Pack soft plastic into a bottle-brick, and weave snack wrappers into a tough bag.","Padatkan plastik lembut ke dalam botol menjadi bata, dan anyam pembalut snek menjadi beg yang kuat."),
 time:L("45 min a session (one brick takes several sessions)","45 min setiap sesi (satu bata mengambil beberapa sesi)"),
 cost:L("Free: all waste, plus staples or tape.","Percuma: semuanya sisa, tambah stapler atau pita."),
 waste:L("Clean, dry soft plastics; PET bottles; foil-lined snack wrappers","Plastik lembut yang bersih dan kering; botol PET; pembalut snek berlapik kerajang"),product:L("Eco-bricks (benches, garden borders) and a woven wrapper tote","Eko-bata (bangku, sempadan taman) dan beg tote anyaman pembalut"),
 why:{env:L("Plastic is 21.9% of Malaysian household waste, and soft plastics like wrappers are hard to recycle. Packed into eco-bricks, they stay out of drains, rivers and open burning.","Plastik ialah 21.9% daripada sisa domestik Malaysia, dan plastik lembut seperti pembalut sukar dikitar semula. Apabila dipadatkan dalam eko-bata, ia tidak masuk ke longkang, sungai atau dibakar terbuka."),
  econ:L("Eco-bricks replace some bought materials for garden benches and borders; woven bags are durable, waterproof and unique.","Eko-bata menggantikan sebahagian bahan binaan yang dibeli untuk bangku dan sempadan taman; beg anyaman tahan lama, kalis air dan unik."),
  soc:L("Building a school bench together is a visible shared achievement (one 2024 student team gave bags to homeless people).","Membina bangku sekolah bersama ialah pencapaian bersama yang dapat dilihat (satu pasukan pelajar 2024 menghadiahkan beg kepada golongan gelandangan).")},
 table:{head:[L("Bottle","Botol"),L("Minimum mass","Jisim minimum"),L("Density","Ketumpatan")],
  rows:[["500 mL","167 g","0.33 g/mL"],["600 mL","200 g","0.33 g/mL"],["1.5 L","500 g","0.33 g/mL"]],
  note:L("Global Ecobrick Alliance minimum for building: 0.33 g/mL.","Minimum Global Ecobrick Alliance untuk binaan: 0.33 g/mL.")},
 mats:[H("Eco-brick","Eko-bata"),
  L("1 PET bottle (one size for the whole class, e.g. 600 mL or 1.5 L)","1 botol PET (satu saiz untuk seluruh kelas, cth. 600 mL atau 1.5 L)"),
  L("Soft plastics: wrappers, plastic bags, straws, all clean and completely dry","Plastik lembut: pembalut, beg plastik, straw, semuanya bersih dan kering sepenuhnya"),
  L("A packing stick (wooden spoon handle or bamboo stick)","Kayu pemadat (hulu sudu kayu atau batang buluh)"),
  L("Scissors and a kitchen scale","Gunting dan penimbang dapur"),
  H("Eco-bag (wrapper weave)","Beg eko (anyaman pembalut)"),
  L("Lots of foil-lined snack or coffee wrappers, washed and dried","Banyak pembalut snek atau kopi berlapik kerajang, dibasuh dan dikeringkan"),
  L("Ruler, pencil and scissors","Pembaris, pensel dan gunting"),
  L("Stapler or tape, and 2 long strips for handles","Stapler atau pita, dan 2 jalur panjang untuk pemegang")],
 steps:[H("Eco-brick","Eko-bata"),
  S("Wash and dry the plastics. No food, paper, glass, metal or anything sharp.","Basuh dan keringkan plastik. Jangan masukkan makanan, kertas, kaca, logam atau benda tajam."),
  S("Cut big pieces smaller. Push one coloured piece into the bottom first: it looks nice when you build.","Potong kepingan besar menjadi kecil. Masukkan satu kepingan berwarna di dasar dahulu: ia nampak cantik apabila dibina."),
  S("Add a little plastic at a time and press it down hard with the stick. Keep packing!","Masukkan sedikit plastik pada satu masa dan tekan kuat dengan kayu. Terus padatkan!"),
  S("Keep going until you can't push any more in. Squeeze the bottle: it should feel like a brick, not a balloon.","Teruskan sehingga tidak boleh dimasukkan lagi. Picit botol: ia patut terasa seperti bata, bukan belon."),
  S("Weigh it. Target: at least 0.33 g for every mL of bottle: 200 g for 600 mL, 500 g for 1.5 L.","Timbang. Sasaran: sekurang-kurangnya 0.33 g bagi setiap mL botol: 200 g untuk 600 mL, 500 g untuk 1.5 L.","Density = mass ÷ volume. 200 g ÷ 600 mL = 0.33 g/mL. Lighter bricks are too squishy to build with.","Ketumpatan = jisim ÷ isi padu. 200 g ÷ 600 mL = 0.33 g/mL. Bata yang lebih ringan terlalu lembik untuk binaan."),
  S("Close the cap and write the mass and date on the bottle.","Tutup botol dan tulis jisim serta tarikh padanya."),
  H("Eco-bag (wrapper weave)","Beg eko (anyaman pembalut)"),
  S("Cut the wrappers into rectangles 16 cm × 6 cm.","Gunting pembalut menjadi segi empat tepat 16 cm × 6 cm."),
  S("Fold each rectangle in half the long way, open it, fold both long edges to the middle line, then fold in half again. You get a long thin strip.","Lipat setiap segi empat dua memanjang, buka, lipat kedua-dua tepi panjang ke garisan tengah, kemudian lipat dua sekali lagi. Anda dapat jalur panjang yang nipis."),
  S("Fold the strip in half across the middle, then fold both ends in to the middle crease. You get a small V-shaped link.","Lipat jalur itu dua melintang, kemudian lipat kedua-dua hujung ke garisan lipatan tengah. Anda dapat sambungan kecil berbentuk V."),
  S("Slide the ends of one link into the pockets of another to make a zig-zag chain. Make many chains.","Masukkan hujung satu sambungan ke dalam poket sambungan lain untuk membentuk rantai zig-zag. Buat banyak rantai."),
  S("Join chains side by side with staples or tape to make two panels, then join the panels into a bag and add two handles.","Cantumkan rantai bersebelahan dengan stapler atau pita untuk membentuk dua panel, kemudian cantumkan panel menjadi beg dan pasang dua pemegang.","One 2024 student team filled small gaps with thin plastic strips. Put shiny sides out for a sparkly bag.","Satu pasukan pelajar 2024 mengisi celah kecil dengan jalur plastik nipis. Letakkan bahagian berkilat di luar untuk beg yang bergemerlapan.")],
 safety:[W("Clean and dry only: food leftovers make bricks mouldy and smelly.","Bersih dan kering sahaja: sisa makanan menjadikan bata berkulat dan berbau."),
  W("Scissors: cut away from your body. Staples are sharp.","Gunting: gunting menjauhi badan. Stapler tajam."),
  W("Eco-bricks are not for load-bearing walls. Keep them out of strong sun and away from fire: use them inside a frame, or covered with earth or cement, for benches and garden borders.","Eko-bata bukan untuk dinding galas beban. Jauhkan daripada cahaya matahari terik dan api: gunakan di dalam rangka, atau ditutup tanah atau simen, untuk bangku dan sempadan taman.")],
 sci:{kids:L("Air takes up space. When you press the plastic down hard, you squeeze out the air and fit more plastic in, so the bottle becomes hard and strong like a brick.","Udara memenuhi ruang. Apabila anda menekan plastik dengan kuat, anda menolak keluar udara dan memasukkan lebih banyak plastik, jadi botol menjadi keras dan kuat seperti bata."),
  teens:L("Density = mass ÷ volume. Polyethylene and polypropylene, the main soft plastics, have densities of about 0.9–1.0 g/cm³, so a brick at 0.33 g/mL is still roughly two-thirds air. Packing harder raises the density, stiffness and resistance to denting. Soft plastics are hard to recycle because they are thin, light, often dirty and often multi-layer (plastic + aluminium foil), which recyclers cannot separate.","Ketumpatan = jisim ÷ isi padu. Polietilena dan polipropilena, plastik lembut utama, mempunyai ketumpatan kira-kira 0.9–1.0 g/cm³, jadi bata pada 0.33 g/mL masih kira-kira dua pertiga udara. Pemadatan yang lebih kuat meningkatkan ketumpatan, kekakuan dan ketahanan daripada kemik. Plastik lembut sukar dikitar semula kerana nipis, ringan, selalunya kotor dan selalunya berbilang lapisan (plastik + kerajang aluminium) yang tidak dapat diasingkan oleh pengitar semula."),
  adults:L("Eco-bricks are plastic sequestration: they hold plastic out of the environment, but do not recycle it or reduce production. Treat them as the last step after refuse, reduce and reuse. The Global Ecobrick Alliance sets a minimum density of 0.33 g/mL for building use. The woven-wrapper bag (from a 2024 student proposal) upcycles multilayer packaging that has almost no recycling market.","Eko-bata ialah penyimpanan plastik: ia menahan plastik daripada alam sekitar, tetapi tidak mengitar semula atau mengurangkan pengeluarannya. Anggap ia langkah terakhir selepas tolak, kurangkan dan guna semula. Global Ecobrick Alliance menetapkan ketumpatan minimum 0.33 g/mL untuk binaan. Beg anyaman pembalut (daripada satu cadangan pelajar 2024) mengitar naik pembungkusan berbilang lapisan yang hampir tiada pasaran kitar semula.")},
 teach:L("Agree on ONE bottle size for the whole school so the bricks fit together. A 1.5 L brick takes several sessions: let pupils take bottles home. Keep a class log of the total plastic packed (kg).","Tetapkan SATU saiz botol untuk seluruh sekolah supaya bata sepadan. Bata 1.5 L mengambil beberapa sesi: benarkan murid membawa botol pulang. Simpan rekod kelas jumlah plastik yang dipadatkan (kg)."),
 ext:[L("Class total: add up the mass of all the eco-bricks. How many plastic bags is that? (Weigh 10 bags to find the mass of one.)","Jumlah kelas: tambah jisim semua eko-bata. Berapa beg plastik itu? (Timbang 10 beg untuk mengetahui jisim sebiji.)"),
  L("Design: sketch a bench made of 1.5 L eco-bricks. How many bricks do you need? How much plastic would it lock away?","Reka bentuk: lakar bangku daripada eko-bata 1.5 L. Berapa bata diperlukan? Berapa banyak plastik dapat disimpan?"),
  L("Check a real design: a 2024 student stool used 21 bottles of 1.5 L and 800 g of plastic in total. What was the density of each brick? Does it meet the 0.33 g/mL minimum? How much plastic would 21 proper bricks hold?","Semak reka bentuk sebenar: sebuah bangku pelajar 2024 menggunakan 21 botol 1.5 L dan 800 g plastik secara keseluruhan. Berapakah ketumpatan setiap bata? Adakah ia mencapai minimum 0.33 g/mL? Berapa banyak plastik yang boleh disimpan oleh 21 bata yang betul?"),
  L("Cost it like an engineer: A 2024 student team spent RM 10.50 on glue sticks and tape for each stool, plus a measuring tape (RM 12) and a glue gun (RM 8) bought once. They planned to sell at RM 25. What is the profit on the first stool? On the tenth?","Kira kos seperti jurutera: Satu pasukan pelajar 2024 membelanjakan RM 10.50 untuk gam silikon dan pita bagi setiap bangku, serta pita pengukur (RM 12) dan pistol gam (RM 8) yang dibeli sekali. Mereka merancang menjual pada RM 25. Berapakah untung bangku pertama? Bangku kesepuluh?"),
  L("Bag test: load your woven bag with books until it fails. Record the mass. Where did it break, and how could the design be stronger?","Ujian beg: isi beg anyaman dengan buku sehingga rosak. Catat jisimnya. Di mana ia koyak, dan bagaimana reka bentuknya boleh diperkuat?")],
 refl:[L("Which plastics in your home are hardest to recycle?","Plastik mana di rumah anda yang paling sukar dikitar semula?"),
  L("Is an eco-brick recycling? Why or why not?","Adakah eko-bata dikira kitar semula? Mengapa?"),
  L("How could your school use less soft plastic in the first place?","Bagaimana sekolah anda boleh mengurangkan penggunaan plastik lembut dari awal?")],
 posters:[P("assets/zph/ecobricks.jpg","Eco-brick stool and pillar made by students","Bangku dan tiang eko-bata buatan pelajar"),P("assets/zph/ecobrick-sketch.jpg","Stool sketch (21 × 1.5 L bottles)","Lakaran bangku (21 × botol 1.5 L)"),P("assets/zph/ecobrick-cost.jpg","Costing the stool","Pengiraan kos bangku")]},

/* ---------------------------------------------------------------- 9 COMPOST */
{id:"compost",icon:"🪱",min:7,mins:45,diff:2,sup:"light",heat:false,sdgs:[2,12,13,15],video:"1SOScJJ9-HIPY8lE52Z-aZTCm7TPebikd",
 badge:{icon:"🪱",name:L("Soil Maker","Pembuat Tanah")},
 title:L("Composting: Bokashi & Worms","Pengkomposan: Bokashi & Cacing"),
 hook:L("Feed food scraps to microbes and worms and get rich soil back.","Beri sisa makanan kepada mikrob dan cacing, dan dapatkan tanah yang subur."),
 time:L("45 min to set up; 2–8 weeks to finish","45 min untuk disediakan; 2–8 minggu untuk siap"),
 cost:L("Low: reuse old buckets. Example shop prices (Oct 2026): bokashi bran about RM 8–14 per kg. Composting worms are sold by the kilogram and cost much more (one seller: RM 380 per kg in Peninsular Malaysia); the price of a small starter amount varies.","Rendah: guna semula baldi lama. Contoh harga kedai (Okt 2026): dedak bokashi kira-kira RM 8–14 sekilogram. Cacing kompos dijual mengikut kilogram dan jauh lebih mahal (seorang penjual: RM 380 sekilogram di Semenanjung Malaysia); harga untuk jumlah permulaan yang kecil berbeza-beza."),
 waste:L("Food scraps, dry leaves, cardboard","Sisa makanan, daun kering, kadbod"),product:L("Compost, vermicast and liquid plant feed","Kompos, tahi cacing (vermikas) dan baja cecair"),
 why:{env:L("Food is 30.6% of Malaysian household waste. Buried in landfill without air, it rots into methane (a strong greenhouse gas) and dirty liquid called leachate. Composting turns it back into soil instead.","Makanan ialah 30.6% daripada sisa domestik Malaysia. Apabila tertimbus di tapak pelupusan tanpa udara, ia reput menjadi metana (gas rumah hijau yang kuat) dan cecair kotor yang dipanggil larut resap. Pengkomposan mengembalikannya menjadi tanah."),
  econ:L("Compost and worm castings replace some bought fertiliser and potting soil, and gardeners will buy them.","Kompos dan tahi cacing menggantikan sebahagian baja dan tanah pasu yang dibeli, dan pekebun sanggup membelinya."),
  soc:L("A school compost corner links the canteen, the garden and the classroom; vegetables grown with it can go back to the canteen.","Sudut kompos sekolah menghubungkan kantin, kebun dan bilik darjah; sayur yang ditanam dengannya boleh kembali ke kantin.")},
 mats:[H("Bokashi bin","Tong bokashi"),
  L("A bucket with a tight lid, ideally with a tap at the bottom (or two stacked buckets, the inner one with drainage holes drilled by an adult)","Baldi bertutup rapat, sebaiknya dengan paip di bawah (atau dua baldi bertindih, yang dalam ditebuk lubang saliran oleh orang dewasa)"),
  L("Bokashi bran: about a handful per layer","Dedak bokashi: kira-kira segenggam bagi setiap lapisan"),
  L("Food scraps cut small: fruit and vegetable scraps, cooked rice and noodles, a little cooked meat or fish","Sisa makanan dipotong kecil: sisa buah dan sayur, nasi dan mi yang dimasak, sedikit daging atau ikan yang dimasak"),
  L("A plate or a bag of sand to press the scraps down","Pinggan atau beg berisi pasir untuk menekan sisa"),
  L("A garden bed or compost heap for the finished bokashi","Batas kebun atau timbunan kompos untuk bokashi yang sudah siap"),
  H("Worm bin","Tong cacing"),
  L("A plastic box with a lid, raised on two bricks over a tray","Kotak plastik bertutup, diletakkan di atas dua bata dengan dulang di bawahnya"),
  L("Bedding: shredded newspaper or cardboard (not glossy), dry leaves, a handful of garden soil","Alas: kertas surat khabar atau kadbod yang dicarik (bukan berkilat), daun kering, segenggam tanah kebun"),
  L("Composting worms suited to the tropics, such as the African nightcrawler (Eudrilus eugeniae), from a vermicompost farm. Garden earthworms do not live well in bins.","Cacing kompos yang sesuai untuk kawasan tropika, seperti African nightcrawler (Eudrilus eugeniae), dari ladang vermikompos. Cacing tanah biasa dari kebun tidak hidup dengan baik dalam tong."),
  L("Fruit and vegetable scraps, crushed eggshells, used coffee grounds","Sisa buah dan sayur, kulit telur yang dihancurkan, hampas kopi"),
  L("A spray bottle of water and gloves","Botol semburan berisi air dan sarung tangan")],
 steps:[H("Bokashi bin","Tong bokashi"),
  S("Cut the food scraps into thumb-sized pieces and drain off any soup or liquid.","Potong sisa makanan sebesar ibu jari dan toskan kuah atau cecair."),
  S("Sprinkle a handful of bokashi bran over the bottom of the bucket.","Taburkan segenggam dedak bokashi di dasar baldi."),
  S("Add a layer of scraps, sprinkle bran on top, then press down hard to squeeze out the air.","Masukkan selapis sisa, taburkan dedak di atasnya, kemudian tekan kuat untuk mengeluarkan udara.","Bokashi microbes work without air; air pockets let mould and bad smells grow.","Mikrob bokashi bekerja tanpa udara; ruang udara membolehkan kulat dan bau busuk tumbuh."),
  S("Close the lid tightly every time. Repeat the layers until the bucket is full.","Tutup penutup dengan rapat setiap kali. Ulang lapisan sehingga baldi penuh."),
  S("Every 2–3 days, drain the liquid from the tap. Use it only diluted, at least 1:100 (10 mL in 1 litre of water), to water plants.","Setiap 2–3 hari, alirkan cecair dari paip. Gunakan hanya selepas dicairkan, sekurang-kurangnya 1:100 (10 mL dalam 1 liter air), untuk menyiram tanaman."),
  S("When full, keep it sealed for 2 weeks. It should smell sour, like pickles. White fluffy mould is fine; black or green mould or a rotten smell means air or too much water got in.","Apabila penuh, biarkan tertutup selama 2 minggu. Baunya patut masam seperti jeruk. Kulat putih gebu tidak mengapa; kulat hitam atau hijau atau bau busuk bermakna udara atau terlalu banyak air telah masuk."),
  S("Bury it in a trench about 20 cm deep, or mix it into a compost heap. After 2–4 weeks it has turned into soil.","Tanam dalam parit sedalam kira-kira 20 cm, atau gaulkan ke dalam timbunan kompos. Selepas 2–4 minggu, ia sudah menjadi tanah.","Bokashi is a fermented \"pre-compost\": it finishes breaking down in the soil.","Bokashi ialah \"pra-kompos\" yang ditapai: ia selesai terurai di dalam tanah."),
  H("Worm bin","Tong cacing"),
  S("ADULT: drill small air holes in the lid and sides and drainage holes in the bottom. Stand the box on bricks over a tray.","ORANG DEWASA: gerudi lubang udara kecil pada penutup dan sisi, dan lubang saliran di bawah. Letakkan kotak di atas bata dengan dulang di bawahnya."),
  S("Fill half the box with damp bedding plus a handful of soil. Squeeze it: it should feel like a wrung-out sponge.","Isi separuh kotak dengan alas yang lembap serta segenggam tanah. Picit: ia patut terasa seperti span yang sudah diperah."),
  S("Gently put the worms on top and leave them a day to settle in. Keep the bin in the shade, never in direct sun or rain.","Letakkan cacing di atas dengan perlahan dan biarkan sehari untuk menyesuaikan diri. Simpan tong di tempat teduh, jangan di bawah matahari terus atau hujan."),
  S("Feed a small amount of chopped scraps at a time, buried under the bedding in a different corner each time. Cover with a handful of dry leaves or paper.","Beri sedikit sisa yang dicincang pada satu masa, ditanam di bawah alas di sudut berbeza setiap kali. Tutup dengan segenggam daun kering atau kertas.","Aim for about 2–3 parts dry \"browns\" (leaves, paper) to 1 part wet \"greens\" (food scraps) by volume.","Sasarkan kira-kira 2–3 bahagian bahan \"perang\" yang kering (daun, kertas) kepada 1 bahagian bahan \"hijau\" yang basah (sisa makanan) mengikut isi padu."),
  S("Do not feed worms meat, fish, dairy, oily or salty food, or much citrus, onion, garlic or chilli.","Jangan beri cacing daging, ikan, tenusu, makanan berminyak atau masin, atau terlalu banyak limau, bawang, bawang putih atau cili."),
  S("After 1–2 months the bottom is dark, crumbly vermicast. Push everything to one side and put fresh bedding and food on the other. In 1–2 weeks the worms move across; scoop out the castings.","Selepas 1–2 bulan, bahagian bawah menjadi vermikas yang gelap dan rapuh. Tolak semuanya ke satu sisi dan letak alas serta makanan baharu di sisi lain. Dalam 1–2 minggu cacing akan berpindah; cedok keluar tahi cacing."),
  S("Mix a little vermicast into potting soil or sprinkle it around your plants.","Gaulkan sedikit vermikas ke dalam tanah pasu atau taburkan di sekeliling tanaman.")],
 safety:[W("Wear gloves or wash your hands well after touching compost, worms or bokashi. Cover any cuts.","Pakai sarung tangan atau basuh tangan dengan baik selepas menyentuh kompos, cacing atau bokashi. Tutup sebarang luka."),
  W("Bokashi liquid is sour and strong: always dilute it, never drink it, and keep lids shut so flies stay away.","Cecair bokashi masam dan pekat: sentiasa cairkan, jangan diminum, dan pastikan penutup rapat supaya lalat tidak datang."),
  W("Empty the worm-bin tray regularly: standing water breeds Aedes mosquitoes. An adult drills the holes.","Kosongkan dulang tong cacing selalu: air bertakung membiakkan nyamuk Aedes. Orang dewasa yang menggerudi lubang."),
  W("No pet poo, diseased plants or \"compostable\" plastic bags: most need hot industrial composting.","Jangan masukkan najis haiwan, tumbuhan berpenyakit atau beg plastik \"boleh kompos\": kebanyakannya memerlukan pengkomposan industri yang panas.")],
 sci:{kids:L("Tiny microbes and worms are nature's recyclers. They eat food scraps and turn them into dark, crumbly compost full of plant food. In bokashi, special microbes pickle the food with no air, a bit like making tempeh. Worms munch the scraps, and their poo (castings) is a super plant food!","Mikrob halus dan cacing ialah pengitar semula alam. Mereka makan sisa makanan dan mengubahnya menjadi kompos yang gelap, rapuh dan penuh makanan tumbuhan. Dalam bokashi, mikrob khas \"menjeruk\" makanan tanpa udara, sedikit seperti membuat tempe. Cacing mengunyah sisa, dan tahinya ialah makanan tumbuhan yang hebat!"),
  teens:L("Ordinary composting is aerobic: microbes use oxygen to break down food, releasing CO₂, water and heat. They need carbon for energy (\"browns\": leaves, paper) and nitrogen to build proteins (\"greens\": food scraps). About 2–3 browns to 1 green by volume gives roughly the carbon-to-nitrogen ratio of 25–30 : 1 that microbes like; too many greens makes it wet and smelly. Bokashi is anaerobic fermentation: lactic acid bacteria in the bran turn sugars into lactic acid, which makes the bin sour and stops rotting microbes, and the waste finishes breaking down once buried. Worms grind food in their gizzard, and microbes in their gut turn it into castings rich in nutrients that plants can absorb.","Pengkomposan biasa adalah aerobik: mikrob menggunakan oksigen untuk mengurai makanan, lalu membebaskan CO₂, air dan haba. Mereka memerlukan karbon untuk tenaga (bahan \"perang\": daun, kertas) dan nitrogen untuk membina protein (bahan \"hijau\": sisa makanan). Kira-kira 2–3 bahagian perang kepada 1 bahagian hijau mengikut isi padu memberi nisbah karbon kepada nitrogen sekitar 25–30 : 1 yang disukai mikrob; terlalu banyak bahan hijau menjadikannya basah dan berbau. Bokashi ialah penapaian anaerobik: bakteria asid laktik dalam dedak menukar gula kepada asid laktik, yang menjadikan tong masam dan menghalang mikrob pereput, dan sisa selesai terurai selepas ditanam. Cacing mengisar makanan dalam empedal, dan mikrob dalam ususnya mengubahnya menjadi tahi cacing yang kaya dengan nutrien yang boleh diserap tumbuhan."),
  adults:L("In landfill, food waste decomposes anaerobically and produces methane, a far more potent greenhouse gas than CO₂, plus leachate. Separating food waste at source and treating it at home, school or community level cuts collection costs and landfill load. Bokashi takes cooked food and small amounts of meat (which worm bins and open heaps should not), needs little space and suits flats; worm farms produce high-value vermicast. Note: the 2025 poster's \"1:3:2 NPK\" was replaced with a browns-to-greens guide, because NPK describes a fertiliser's nutrient content, not a mixing ratio.","Di tapak pelupusan, sisa makanan terurai secara anaerobik dan menghasilkan metana, gas rumah hijau yang jauh lebih kuat daripada CO₂, serta larut resap. Mengasingkan sisa makanan di punca dan merawatnya di peringkat rumah, sekolah atau komuniti mengurangkan kos kutipan dan beban tapak pelupusan. Bokashi menerima makanan yang dimasak dan sedikit daging (yang tidak sesuai untuk tong cacing dan timbunan terbuka), memerlukan sedikit ruang dan sesuai untuk rumah pangsa; ladang cacing menghasilkan vermikas yang bernilai tinggi. Nota: \"1:3:2 NPK\" dalam poster 2025 diganti dengan panduan perang kepada hijau, kerana NPK menerangkan kandungan nutrien baja, bukan nisbah campuran.")},
 teach:L("Set up both systems early in the term with a care rota. Buy worms from a local vermicompost farm. Compare after a month: which system handled the canteen waste better?","Sediakan kedua-dua sistem awal penggal dengan jadual giliran penjagaan. Beli cacing dari ladang vermikompos tempatan. Bandingkan selepas sebulan: sistem mana yang lebih baik mengendalikan sisa kantin?"),
 ext:[L("Weigh the food scraps your class adds every day for 2 weeks. How many kg would you keep out of landfill in a school year?","Timbang sisa makanan yang dimasukkan oleh kelas anda setiap hari selama 2 minggu. Berapa kg dapat dijauhkan daripada tapak pelupusan dalam satu tahun persekolahan?"),
  L("Fair test: grow two pots of kangkung, one with vermicast mixed in and one without. Measure the height every week.","Ujian adil: tanam dua pasu kangkung, satu dicampur vermikas dan satu tanpa. Ukur ketinggian setiap minggu."),
  L("Compare bokashi and worms: cost to set up, space, smell, speed and what each can accept. Which suits your home?","Bandingkan bokashi dan cacing: kos permulaan, ruang, bau, kelajuan dan apa yang boleh diterima. Mana yang sesuai untuk rumah anda?")],
 refl:[L("Which foods can go in bokashi but not in a worm bin?","Makanan apa boleh dimasukkan ke dalam bokashi tetapi tidak ke dalam tong cacing?"),
  L("Why does food buried in landfill make methane?","Mengapa makanan yang tertimbus di tapak pelupusan menghasilkan metana?"),
  L("How did it feel to look after living worms?","Bagaimana perasaan anda menjaga cacing yang hidup?")],
 posters:[P("assets/labs/compost-poster-1.jpg","Worm composting poster","Poster pengkomposan cacing"),P("assets/labs/compost-poster-2.jpg","Bokashi bin sketch","Lakaran tong bokashi")]},

/* ---------------------------------------------------------------- 10 BIOPLASTIC */
{id:"bioplastic",icon:"🌽",min:9,mins:60,diff:2,sup:"adult",heat:true,sdgs:[9,12,14],video:null,
 badge:{icon:"🌽",name:L("Bioplastic Inventor","Pencipta Bioplastik")},
 title:L("Cornstarch Bioplastic","Bioplastik Kanji Jagung"),
 hook:L("Cook starch, water, vinegar and glycerin into a plastic you can shape, then test whether it really is \"green\".","Masak kanji, air, cuka dan gliserin menjadi plastik yang boleh dibentuk, kemudian uji sama ada ia benar-benar \"hijau\"."),
 time:L("60 min + 2 days drying","60 min + 2 hari pengeringan"),
 cost:L("About RM 0.84 per small pot (2024 UPM student estimate; prices may have changed).","Kira-kira RM 0.84 bagi sebuah pasu kecil (anggaran pelajar UPM 2024; harga mungkin telah berubah)."),
 waste:L("Not a waste product: a plant-based swap for single-use plastic","Bukan produk sisa: pengganti berasaskan tumbuhan untuk plastik pakai buang"),product:L("Seedling pots, coasters and small shapes","Pasu semaian, alas cawan dan bentuk kecil"),
 why:{env:L("Plastic is 21.9% of Malaysian household waste, and most plastic is made from oil. Starch plastic comes from plants, but \"made from plants\" does not automatically mean it breaks down anywhere. This lab tests that honestly.","Plastik ialah 21.9% daripada sisa domestik Malaysia, dan kebanyakan plastik dibuat daripada minyak. Plastik kanji berasal daripada tumbuhan, tetapi \"dibuat daripada tumbuhan\" tidak semestinya bermaksud ia terurai di mana-mana. Makmal ini mengujinya dengan jujur."),
  econ:L("Starch, glycerin and vinegar are cheap. A 2024 UPM student team costed a seedling pot at about RM 0.84.","Kanji, gliserin dan cuka murah. Satu pasukan pelajar UPM 2024 menganggarkan kos sebuah pasu semaian kira-kira RM 0.84."),
  soc:L("Students act as materials engineers: they design, test and judge a \"green\" claim with evidence.","Pelajar bertindak sebagai jurutera bahan: mereka mereka bentuk, menguji dan menilai dakwaan \"hijau\" dengan bukti.")},
 mats:[L("15 g cornstarch (tepung jagung), about 2 tablespoons","15 g tepung jagung, kira-kira 2 sudu besar"),
  L("100 mL water","100 mL air"),
  L("10 mL (2 teaspoons) white vinegar","10 mL (2 sudu kecil) cuka putih"),
  L("5–10 mL (1–2 teaspoons) glycerin, from a pharmacy: more glycerin = bendier plastic","5–10 mL (1–2 sudu kecil) gliserin, dari farmasi: lebih banyak gliserin = plastik lebih lentur"),
  L("1–2 drops food colouring (optional)","1–2 titis pewarna makanan (pilihan)"),
  L("Small saucepan, heat-proof spatula, measuring spoons and jug","Periuk kecil, spatula tahan panas, sudu penyukat dan jag"),
  L("Baking paper on a tray, or a small cup or silicone mould to shape a pot","Kertas pembakar di atas dulang, atau cawan kecil atau acuan silikon untuk membentuk pasu"),
  L("Stove (adult) and labels","Dapur (orang dewasa) dan label")],
 steps:[S("Measure all the ingredients before any heat is turned on.","Sukat semua bahan sebelum api dihidupkan."),
  S("Put the water, cornstarch, vinegar, glycerin and colour into the cold saucepan. Stir until there are no lumps.","Masukkan air, tepung jagung, cuka, gliserin dan pewarna ke dalam periuk yang sejuk. Kacau sehingga tiada ketulan."),
  S("ADULT: heat on low, stirring all the time.","ORANG DEWASA: panaskan dengan api perlahan sambil dikacau tanpa henti."),
  S("Watch it change: milky white, then thick, clear and gel-like (about 5–15 minutes). Turn off the heat.","Perhatikan perubahannya: putih susu, kemudian pekat, jernih dan seperti gel (kira-kira 5–15 minit). Tutup api.","This change is gelatinisation: the starch grains swell, burst and release their long chains.","Perubahan ini ialah pengelatinan: butir kanji mengembang, pecah dan membebaskan rantai panjangnya."),
  S("ADULT: spread the hot gel on baking paper about 3–5 mm thick, or press it around the outside of a small cup to make a pot. It is very hot and sticky.","ORANG DEWASA: ratakan gel panas di atas kertas pembakar setebal kira-kira 3–5 mm, atau tekan di sekeliling bahagian luar cawan kecil untuk membuat pasu. Ia sangat panas dan melekit."),
  S("Pop any air bubbles with a spoon and smooth the top.","Pecahkan gelembung udara dengan sudu dan licinkan permukaannya."),
  S("Leave it to dry for at least 2 days in an airy place. Turn sheets over after the first day.","Biarkan kering sekurang-kurangnya 2 hari di tempat berangin. Terbalikkan kepingan selepas hari pertama."),
  S("Peel it off and test it: bend it, stretch it, and put a small piece in water for an hour. What happens?","Tanggalkan dan uji: lentur, regang, dan rendam secebis dalam air selama sejam. Apa yang berlaku?","Label each sample with its glycerin amount so you can compare.","Labelkan setiap sampel dengan jumlah gliserinnya supaya boleh dibandingkan.")],
 safety:[D("Hot starch gel sticks to skin and burns like hot porridge. Only an adult heats, spreads and moulds it; children mix the cold ingredients and do the testing.","Gel kanji panas melekat pada kulit dan melecurkan seperti bubur panas. Hanya orang dewasa memanaskan, meratakan dan membentuknya; kanak-kanak mencampur bahan sejuk dan membuat ujian."),
  W("For a burn: cool it under cool running water for 20 minutes and tell an adult.","Jika melecur: sejukkan di bawah air paip yang sejuk selama 20 minit dan beritahu orang dewasa."),
  W("Not food, even though the ingredients are: label it and do not eat it.","Bukan makanan walaupun bahannya makanan: labelkan dan jangan dimakan."),
  W("Do not put it in the plastic recycling bin: it contaminates real plastic recycling. Small pieces can go in the compost.","Jangan masukkan ke dalam tong kitar semula plastik: ia mencemarkan kitar semula plastik sebenar. Cebisan kecil boleh dimasukkan ke dalam kompos.")],
 sci:{kids:L("Starch is made of very long chains, like a necklace of sugar beads. Heating it in water unwinds the chains, and they tangle together. When it dries, the tangle becomes a bendy sheet: a plastic! Glycerin keeps it soft. Because it is made from plants and loves water, it goes soft when it gets wet.","Kanji terdiri daripada rantai yang sangat panjang, seperti rantai manik gula. Memanaskannya dalam air membuka rantai itu, lalu ia berselirat. Apabila kering, selirat itu menjadi kepingan yang lentur: plastik! Gliserin mengekalkannya lembut. Kerana ia dibuat daripada tumbuhan dan suka air, ia menjadi lembut apabila basah."),
  teens:L("Plastics are polymers: very long-chain molecules. Starch is a natural polymer of glucose made of amylose (mostly straight chains) and amylopectin (branched). Heating starch in water (gelatinisation, at roughly 60–70 °C for corn starch) lets water into the granules, which swell and burst; as the film dries, the released chains tangle and hydrogen-bond into a solid network. Glycerol is a plasticiser: its small molecules sit between the chains and reduce chain-to-chain hydrogen bonding, making the film flexible (too much makes it sticky). Vinegar's role is smaller than often claimed (acid may cut some amylopectin branches for a smoother film), so test with and without it.","Plastik ialah polimer: molekul berantai sangat panjang. Kanji ialah polimer semula jadi glukosa yang terdiri daripada amilosa (kebanyakannya rantai lurus) dan amilopektin (bercabang). Memanaskan kanji dalam air (pengelatinan, kira-kira 60–70 °C bagi kanji jagung) membolehkan air masuk ke dalam butir kanji, yang mengembang dan pecah; apabila filem kering, rantai yang terbebas berselirat dan membentuk ikatan hidrogen menjadi rangkaian pepejal. Gliserol ialah pemplastik: molekul kecilnya berada di antara rantai dan mengurangkan ikatan hidrogen antara rantai, menjadikan filem lentur (terlalu banyak menjadikannya melekit). Peranan cuka lebih kecil daripada yang sering didakwa (asid mungkin memotong sebahagian cabang amilopektin untuk filem yang lebih licin), jadi uji dengan dan tanpa cuka."),
  adults:L("\"Bioplastic\" mixes two separate ideas. Bio-based means made from plants; biodegradable means microbes break it down under stated conditions. They are independent: bio-based polyethylene is not biodegradable, while some fossil-based polyesters are. ASTM D6866 measures bio-based carbon content (by radiocarbon); it says nothing about biodegradability, which is certified under standards such as EN 13432 or ASTM D6400. Plain starch films are weak and water-sensitive, so they suit short-life uses such as seedling pots, not packaging for wet food. The 2024 student costing of RM 0.84 per pot is a good start; scaling would need consistent drying, moisture resistance and a real end-of-life route.","\"Bioplastik\" mencampurkan dua idea berbeza. Berasaskan bio bermaksud dibuat daripada tumbuhan; terbiodegradasi bermaksud mikrob mengurainya dalam keadaan yang dinyatakan. Kedua-duanya tidak bergantung antara satu sama lain: polietilena berasaskan bio tidak terbiodegradasi, manakala sesetengah poliester berasaskan fosil boleh terbiodegradasi. ASTM D6866 mengukur kandungan karbon berasaskan bio (melalui radiokarbon); ia tidak menyatakan apa-apa tentang biodegradasi, yang diperakui di bawah piawaian seperti EN 13432 atau ASTM D6400. Filem kanji biasa lemah dan sensitif kepada air, jadi ia sesuai untuk kegunaan jangka pendek seperti pasu semaian, bukan pembungkusan makanan basah. Anggaran kos pelajar 2024 sebanyak RM 0.84 sepasu ialah permulaan yang baik; untuk dikembangkan, ia memerlukan pengeringan yang konsisten, ketahanan lembapan dan laluan akhir hayat yang sebenar.")},
 teach:L("Pre-measure the dry ingredients into cups. One saucepan per adult. A microwave also works: heat in 20-second bursts, stirring between (adult only).","Sukat bahan kering ke dalam cawan lebih awal. Satu periuk bagi setiap orang dewasa. Ketuhar gelombang mikro juga boleh: panaskan 20 saat setiap kali dan kacau di antaranya (orang dewasa sahaja)."),
 ext:[L("Glycerin test: make films with 5, 10 and 15 mL glycerin. How far does each bend before it cracks? Which would make the best seedling pot?","Ujian gliserin: buat filem dengan 5, 10 dan 15 mL gliserin. Sejauh mana setiap satu boleh dilentur sebelum retak? Yang mana paling sesuai untuk pasu semaian?"),
  L("Breakdown test: bury one piece in soil, keep one in a jar of water and one dry. Photograph them every week for 4 weeks.","Ujian penguraian: tanam secebis dalam tanah, simpan secebis dalam balang air dan secebis kering. Ambil gambar setiap minggu selama 4 minggu."),
  L("Cost it: price one pot (starch + glycerin + vinegar) and compare with a plastic seedling pot. Would a plant nursery switch?","Kira kos: harga sebuah pasu (kanji + gliserin + cuka) dan bandingkan dengan pasu semaian plastik. Adakah tapak semaian akan bertukar?")],
 refl:[L("Is \"made from plants\" the same as \"breaks down in nature\"?","Adakah \"dibuat daripada tumbuhan\" sama dengan \"terurai secara semula jadi\"?"),
  L("What would you use your bioplastic for, and what should it never be used for?","Untuk apa anda akan gunakan bioplastik anda, dan untuk apa ia tidak patut digunakan?"),
  L("How could you make it stronger or more water-resistant?","Bagaimana anda boleh menjadikannya lebih kuat atau lebih tahan air?")],
 posters:[P("assets/zph/biopots.jpg","Bio-pots made by students","Bio-pasu buatan pelajar")]},

/* ================================================================ ZERO-PLASTIC HERO 2024 LABS (11–15) */
/* ---------------------------------------------------------------- 11 VERTICAL GARDEN */
{id:"vgarden",icon:"🪴",min:7,mins:60,diff:1,sup:"close",heat:false,sdgs:[2,11,12,13,15],video:"self",
 badge:{icon:"🪴",name:L("Green Wall Gardener","Pekebun Dinding Hijau")},
 title:L("Bottle Vertical Garden","Taman Menegak Botol"),
 hook:L("Hang a garden of plastic bottles on a wall or fence: water the top one and it drips down to the rest.","Gantung taman botol plastik pada dinding atau pagar: siram botol paling atas dan air menitis ke botol di bawahnya."),
 time:L("60 min to build, then water a little every day","60 min untuk membina, kemudian siram sedikit setiap hari"),
 cost:L("Almost free: used bottles and string. If you buy soil and seeds, example shop prices (Oct 2026): a 7 L bag of potting mix RM 7.50, a vegetable seed packet RM 5.90. Prices vary.","Hampir percuma: botol terpakai dan tali. Jika membeli tanah dan benih, contoh harga kedai (Okt 2026): sebungkus campuran tanah 7 L RM 7.50, sepaket benih sayur RM 5.90. Harga berbeza-beza."),
 waste:L("1.5 L PET bottles; compost from food waste","Botol PET 1.5 L; kompos daripada sisa makanan"),product:L("A hanging vertical garden and mini bottle pots","Taman menegak gantung dan pasu botol mini"),
 why:{env:L("Each bottle gets a second life before recycling, and plants on walls cool hot surfaces and give insects food.","Setiap botol mendapat hayat kedua sebelum dikitar semula, dan tumbuhan pada dinding menyejukkan permukaan panas serta memberi makanan kepada serangga."),
  econ:L("Grow kangkung, herbs or cuttings to use or sell, in a space too small for a normal garden.","Tanam kangkung, herba atau keratan untuk digunakan atau dijual, di ruang yang terlalu kecil untuk kebun biasa."),
  soc:L("A green wall makes a school corner or flat balcony nicer, and mini pots make easy gifts.","Dinding hijau menceriakan sudut sekolah atau balkoni rumah pangsa, dan pasu mini menjadi hadiah mudah.")},
 mats:[L("4–6 clear 1.5 L bottles with caps, washed, labels off","4–6 botol jernih 1.5 L bertutup, dibasuh, label ditanggalkan"),
  L("Strong string or nylon cord, and a frame, fence or grille to hang from","Tali kuat atau tali nilon, dan rangka, pagar atau gril untuk menggantung"),
  L("Soil mixed with compost (see the Compost lab)","Tanah dicampur kompos (lihat makmal Kompos)"),
  L("Plants: leafy seedlings (e.g. kangkung), herb cuttings, or money plant cuttings","Tumbuhan: anak benih sayur berdaun (cth. kangkung), keratan herba, atau keratan pokok duit-duit"),
  L("Craft knife or strong scissors (adult only), a skewer, tape and a marker","Pisau kraf atau gunting kuat (orang dewasa sahaja), lidi sate, pita dan pen penanda")],
 steps:[S("Lay a bottle on its side. Draw a window about 15 cm × 6 cm on the top side.","Baringkan botol. Lukis tingkap kira-kira 15 cm × 6 cm di bahagian atasnya."),
  S("ADULT: cut out the window and tape the cut edges so they are not sharp.","ORANG DEWASA: potong tingkap itu dan lekatkan pita pada tepi yang dipotong supaya tidak tajam."),
  S("ADULT: poke 3–4 small drainage holes on the bottom side with a skewer.","ORANG DEWASA: tebuk 3–4 lubang saliran kecil di bahagian bawah dengan lidi sate.","Without holes, water collects at the bottom and the roots rot because they cannot get air.","Tanpa lubang, air bertakung di dasar dan akar reput kerana tidak mendapat udara."),
  S("Tie string around both ends (near the neck and the base) to make a hanger. Do the same for every bottle.","Ikat tali di kedua-dua hujung (dekat leher dan dasar) untuk dijadikan penyangkut. Buat sama untuk setiap botol."),
  S("Hang the bottles one below another, about 25 cm apart, so water dripping from one falls into the next.","Gantung botol satu di bawah yang lain, kira-kira 25 cm jarak, supaya air yang menitis jatuh ke botol seterusnya."),
  S("Fill each bottle two-thirds full with the soil and compost mix.","Isi setiap botol dua pertiga penuh dengan campuran tanah dan kompos."),
  S("Plant your seedlings or cuttings and press the soil gently around them.","Tanam anak benih atau keratan dan tekan tanah perlahan-lahan di sekelilingnya."),
  S("Water the top bottle slowly and watch it trickle down. Place the garden where it gets a few hours of sun.","Siram botol paling atas perlahan-lahan dan perhatikan air mengalir ke bawah. Letakkan taman di tempat yang mendapat cahaya matahari beberapa jam."),
  S("Mini pots: cut the bottom 8 cm off spare bottles, poke holes, fill and plant. Tie a ribbon on for a gift.","Pasu mini: potong 8 cm bahagian bawah botol lebihan, tebuk lubang, isi dan tanam. Ikat reben untuk dijadikan hadiah.","The student team also built an Arduino soil sensor and pump to water the garden automatically: see the Smart Watering lab.","Pasukan pelajar itu juga membina sensor tanah Arduino dan pam untuk menyiram taman secara automatik: lihat makmal Penyiraman Pintar.")],
 safety:[W("Cut plastic edges are sharp: an adult cuts, then tape the edges.","Tepi plastik yang dipotong tajam: orang dewasa memotong, kemudian lekatkan pita pada tepinya."),
  W("Wet soil is heavy. Tie the bottles to a strong frame, not above where people walk or sit.","Tanah basah berat. Ikat botol pada rangka yang kuat, bukan di atas laluan atau tempat orang duduk."),
  W("No standing water: Aedes mosquitoes can breed in a cap or tray in about a week. Check and empty them weekly.","Tiada air bertakung: nyamuk Aedes boleh membiak dalam penutup botol atau dulang dalam kira-kira seminggu. Periksa dan kosongkan setiap minggu."),
  W("Money plant is for looking at only: it is poisonous to eat and harmful to cats and dogs. Wash hands after gardening.","Pokok duit-duit hanya untuk hiasan: ia beracun jika dimakan dan berbahaya kepada kucing dan anjing. Basuh tangan selepas berkebun.")],
 sci:{kids:L("Plants need light, water, air and food from the soil. Water always flows down, so one watering at the top feeds every bottle below.","Tumbuhan memerlukan cahaya, air, udara dan makanan daripada tanah. Air sentiasa mengalir ke bawah, jadi sekali siram di atas memberi air kepada setiap botol di bawah."),
  teens:L("Gravity moves water down the column; drainage holes stop waterlogging, because roots need oxygen for respiration. Leaves lose water by transpiration, which also cools the air around them. Growing upwards gives more plants per square metre of floor.","Graviti menggerakkan air ke bawah turus; lubang saliran mengelakkan tanah tepu air kerana akar memerlukan oksigen untuk respirasi. Daun kehilangan air melalui transpirasi, yang turut menyejukkan udara di sekelilingnya. Menanam secara menegak memberi lebih banyak tumbuhan bagi setiap meter persegi lantai."),
  adults:L("Green walls reduce surface temperatures and support urban biodiversity, and reusing PET keeps it in use longer before recycling. Sunlight slowly breaks down PET, so expect to replace bottles after some time outdoors, and recycle the old ones.","Dinding hijau mengurangkan suhu permukaan dan menyokong biodiversiti bandar, dan penggunaan semula PET memanjangkan hayatnya sebelum dikitar semula. Cahaya matahari perlahan-lahan merosakkan PET, jadi botol perlu diganti selepas beberapa lama di luar dan botol lama dikitar semula.")},
 teach:L("Prepare the cut bottles before class. Pupils fill, plant and hang. Make a watering rota and a weekly mosquito check. Pair it with the Compost lab for the soil and the Smart Watering lab for older pupils.","Sediakan botol yang telah dipotong sebelum kelas. Murid mengisi, menanam dan menggantung. Buat jadual menyiram dan semakan nyamuk mingguan. Gabungkan dengan makmal Kompos untuk tanah dan makmal Penyiraman Pintar untuk murid yang lebih tua."),
 ext:[L("Measure: how many mL of water do you pour at the top, and how many mL drip out of the bottom bottle? Where did the rest go?","Ukur: berapa mL air dituang di atas, dan berapa mL menitis keluar dari botol paling bawah? Ke mana perginya selebihnya?"),
  L("Grow the same seedling in a bottle and in the ground. Measure the height every 3 days for 3 weeks and draw a graph.","Tanam anak benih yang sama dalam botol dan di tanah. Ukur ketinggian setiap 3 hari selama 3 minggu dan lukis graf."),
  L("Count how many bottles a class garden of 20 bottles saves from the bin in a year if you replace them once.","Kira berapa botol yang diselamatkan daripada tong sampah oleh taman kelas 20 botol dalam setahun jika diganti sekali.")],
 refl:[L("Where at home or school could a bottle garden go?","Di mana di rumah atau sekolah taman botol boleh diletakkan?"),
  L("Is reusing a bottle better than recycling it? Why?","Adakah mengguna semula botol lebih baik daripada mengitar semulanya? Mengapa?"),
  L("What would you grow, and who would you give it to?","Apakah yang akan anda tanam, dan kepada siapa anda akan memberinya?")],
 posters:[P("assets/zph/vgarden-1.jpg","Seedlings in mini bottle pots","Anak benih dalam pasu botol mini"),P("assets/zph/vgarden-2.jpg","Money plant cuttings ready to give away","Keratan pokok duit-duit sedia untuk diberi")]},

/* ---------------------------------------------------------------- 12 HYDROPONICS */
{id:"hydro",icon:"🥬",min:9,mins:60,diff:2,sup:"close",heat:false,sdgs:[2,6,11,12],video:"self",
 badge:{icon:"🥬",name:L("Water Farmer","Petani Air")},
 title:L("Bottle Hydroponics","Hidroponik Botol"),
 hook:L("Grow leafy vegetables in water, with no soil and no pump, inside a cut plastic bottle.","Tanam sayur berdaun di dalam air, tanpa tanah dan tanpa pam, di dalam botol plastik yang dipotong."),
 time:L("60 min to set up; about 4–6 weeks to harvest","60 min untuk menyediakan; kira-kira 4–6 minggu untuk dituai"),
 cost:L("Bottles are free; hydroponic nutrient (AB mix) and seeds are bought. Example (Oct 2026): a vegetable seed packet RM 5.90; AB mix price varies by pack size (one listing showed RM 16.90).","Botol percuma; nutrien hidroponik (baja AB) dan benih perlu dibeli. Contoh (Okt 2026): sepaket benih sayur RM 5.90; harga baja AB berbeza mengikut saiz pek (satu senarai menunjukkan RM 16.90)."),
 waste:L("1.5 L PET bottles and caps; scrap wood and bubble wrap for the shelter","Botol PET 1.5 L dan penutupnya; kayu buangan dan balutan gelembung untuk teduhan"),product:L("A soil-free vegetable pot and a mini rain shelter","Pasu sayur tanpa tanah dan teduhan hujan mini"),
 why:{env:L("Bottles get reused, and a hydroponic pot with no pump uses no electricity. Plants take only the water they need.","Botol diguna semula, dan pasu hidroponik tanpa pam tidak menggunakan elektrik. Tumbuhan hanya mengambil air yang diperlukan."),
  econ:L("Fresh sawi or lettuce at home or in the school canteen, grown on a wall or a corridor with no garden land.","Sawi atau salad segar di rumah atau kantin sekolah, ditanam di dinding atau koridor tanpa tanah kebun."),
  soc:L("Flats and schools without land can still grow food. A 2024 student team designed a \"rain shelter house\" so the bottles keep working in the rainy season.","Rumah pangsa dan sekolah tanpa tanah masih boleh menanam makanan. Satu pasukan pelajar 2024 mereka bentuk \"rumah perlindungan hujan\" supaya botol terus berfungsi pada musim hujan.")},
 mats:[H("Bottle pot","Pasu botol"),
  L("1 clear 1.5 L bottle per plant, washed","1 botol jernih 1.5 L bagi setiap pokok, dibasuh"),
  L("Seeds of a leafy vegetable (sawi, lettuce or kangkung) and a kitchen sponge cut into 2 cm cubes","Benih sayur berdaun (sawi, salad atau kangkung) dan span dapur dipotong menjadi kiub 2 cm"),
  L("Hydroponic nutrient A and B (AB mix) and a measuring syringe or spoon","Nutrien hidroponik A dan B (baja AB) dan picagari atau sudu penyukat"),
  L("Black paper, foil or old cloth to cover the bottle; tape","Kertas hitam, kerajang atau kain lama untuk membalut botol; pita"),
  L("Craft knife (adult only) and a marker","Pisau kraf (orang dewasa sahaja) dan pen penanda"),
  H("Rain shelter (optional)","Teduhan hujan (pilihan)"),
  L("Scrap wood strips, nails and hammer; extra bottles; stapler; clear tape; bubble wrap","Jalur kayu buangan, paku dan tukul; botol tambahan; stapler; pita jernih; balutan gelembung")],
 steps:[H("Bottle pot (Kratky method)","Pasu botol (kaedah Kratky)"),
  S("Sow 1–2 seeds on each wet sponge cube. Keep them damp in a tray until roots and 2 small leaves appear (about a week).","Semai 1–2 biji benih pada setiap kiub span basah. Pastikan lembap dalam dulang sehingga akar dan 2 daun kecil muncul (kira-kira seminggu)."),
  S("ADULT: cut the bottle around one-third from the top. Tape the cut edges.","ORANG DEWASA: potong botol kira-kira satu pertiga dari atas. Lekatkan pita pada tepi yang dipotong."),
  S("Wrap the bottom part in black paper or foil, leaving a thin window to check the water level.","Balut bahagian bawah dengan kertas hitam atau kerajang, tinggalkan tingkap kecil untuk melihat paras air.","Light makes green algae grow in the water. Algae steal nutrients and oxygen from the roots.","Cahaya menyebabkan alga hijau tumbuh dalam air. Alga mencuri nutrien dan oksigen daripada akar."),
  S("ADULT: mix the AB nutrient into water exactly as the label says. Add A and B to the water separately, never to each other.","ORANG DEWASA: campurkan nutrien AB ke dalam air tepat seperti pada label. Masukkan A dan B ke dalam air secara berasingan, jangan dicampur sesama sendiri."),
  S("Pour the nutrient water into the bottom part. Turn the top part upside down (no cap) and sit it in the bottom like a funnel.","Tuang air nutrien ke bahagian bawah. Terbalikkan bahagian atas (tanpa penutup) dan letakkan di dalam bahagian bawah seperti corong."),
  S("Push the sponge with the seedling into the bottle neck so its base just touches the water.","Tolak span bersama anak benih ke dalam leher botol supaya dasarnya hanya menyentuh air."),
  S("Tape around the joint so no light, rain or mosquitoes can get in. Label the bottle \"Not for drinking\".","Lekatkan pita di sekeliling sambungan supaya cahaya, hujan atau nyamuk tidak boleh masuk. Labelkan botol \"Bukan untuk diminum\"."),
  S("Keep it in bright light but out of the rain. Do not refill to the top: as the roots grow, the water level drops and leaves an air gap.","Letakkan di tempat terang tetapi terlindung daripada hujan. Jangan isi semula sehingga penuh: apabila akar membesar, paras air turun dan meninggalkan ruang udara.","The top roots breathe from the air gap and the lower roots drink. If the water gets very low, top up only to about half.","Akar atas bernafas daripada ruang udara dan akar bawah menyerap air. Jika air terlalu rendah, tambah hanya sehingga kira-kira separuh."),
  S("Harvest the leaves in about 4–6 weeks. Pour leftover nutrient water onto garden plants, not into a drain.","Tuai daun dalam kira-kira 4–6 minggu. Tuang baki air nutrien pada tanaman kebun, bukan ke dalam longkang."),
  H("Rain shelter house","Rumah perlindungan hujan"),
  S("Build a small wooden frame to fit the bottles you collected. Nail each bottle cap to the wood, then screw the bottle into its cap so it stays steady.","Bina rangka kayu kecil mengikut saiz botol yang dikumpul. Pakukan setiap penutup botol pada kayu, kemudian pulas botol ke dalam penutupnya supaya kukuh."),
  S("For the roof, ADULT cuts the top and bottom off bottles and slits them open. Flatten, staple them together and tape the joins so rain cannot leak through.","Untuk bumbung, ORANG DEWASA memotong bahagian atas dan bawah botol serta membelahnya. Leperkan, stapler bersama dan lekatkan pita pada sambungan supaya hujan tidak bocor.","The student team used bubble wrap to fill gaps and save cost, and fixed the roof without glue.","Pasukan pelajar menggunakan balutan gelembung untuk menutup celah dan menjimatkan kos, serta memasang bumbung tanpa gam.")],
 safety:[W("Nutrient salts: an adult measures them. Do not drink or taste, wash hands after, and keep the packets away from small children.","Garam nutrien: orang dewasa yang menyukat. Jangan minum atau rasa, basuh tangan selepas itu dan jauhkan paket daripada kanak-kanak kecil."),
  W("Still water can breed Aedes mosquitoes in about a week. Seal every gap with tape and check for wrigglers weekly. If you see any, empty the bottle and start again.","Air yang tidak bergerak boleh membiakkan nyamuk Aedes dalam kira-kira seminggu. Tutup setiap celah dengan pita dan periksa jentik-jentik setiap minggu. Jika ada, kosongkan botol dan mulakan semula."),
  W("Cut bottle edges, nails and hammers: adults cut and hammer, learners wear covered shoes.","Tepi botol yang dipotong, paku dan tukul: orang dewasa memotong dan mengetuk, peserta memakai kasut bertutup.")],
 sci:{kids:L("Plants do not need soil. They need water, light, air and plant food. In hydroponics, the plant food is already mixed in the water.","Tumbuhan tidak memerlukan tanah. Ia memerlukan air, cahaya, udara dan makanan tumbuhan. Dalam hidroponik, makanan tumbuhan sudah dicampur dalam air."),
  teens:L("Roots take up nutrients as dissolved ions: nitrogen for leaves, phosphorus for roots, potassium for overall health, plus small amounts of others. Roots also need oxygen. In the Kratky method the water level falls as the plant drinks, so an air gap opens for the upper roots, with no pump needed.","Akar menyerap nutrien sebagai ion terlarut: nitrogen untuk daun, fosforus untuk akar, kalium untuk kesihatan keseluruhan, serta sedikit unsur lain. Akar juga memerlukan oksigen. Dalam kaedah Kratky, paras air turun apabila tumbuhan minum, jadi ruang udara terbuka untuk akar atas tanpa memerlukan pam."),
  adults:L("Non-circulating (Kratky) hydroponics was developed at the University of Hawaii for low-cost growing without electricity. It suits schools and flats, but nutrient solutions are fertiliser: spent solution should go on plants, not into drains, where it feeds algae blooms.","Hidroponik tanpa edaran (Kratky) dibangunkan di University of Hawaii untuk penanaman kos rendah tanpa elektrik. Ia sesuai untuk sekolah dan rumah pangsa, tetapi larutan nutrien ialah baja: larutan terpakai patut dituang pada tumbuhan, bukan ke longkang yang akan menyuburkan alga.")},
 teach:L("Sow the sponges a week before the lesson so pupils start with seedlings. One bottle per pair is enough. Keep a class table of the water level and leaf count each week.","Semai span seminggu sebelum pelajaran supaya murid bermula dengan anak benih. Satu botol bagi setiap pasangan sudah memadai. Simpan jadual kelas bagi paras air dan bilangan daun setiap minggu."),
 ext:[L("Grow two bottles: one wrapped in black paper, one clear. After two weeks, which has more algae? Which plant is bigger?","Tanam dua botol: satu dibalut kertas hitam, satu jernih. Selepas dua minggu, yang manakah lebih banyak alga? Pokok mana lebih besar?"),
  L("Mark the water level every 2 days. How many mL does one plant drink a day?","Tanda paras air setiap 2 hari. Berapa mL air yang diminum oleh satu pokok sehari?"),
  L("Design a rain shelter for 10 bottles on your school wall. Sketch it with measurements and list the waste materials you would use.","Reka teduhan hujan untuk 10 botol di dinding sekolah anda. Lakar dengan ukuran dan senaraikan bahan sisa yang akan digunakan.")],
 refl:[L("Why might hydroponics help people who live in flats?","Mengapakah hidroponik boleh membantu orang yang tinggal di rumah pangsa?"),
  L("What would happen to the roots if the bottle was filled to the top all the time?","Apakah yang akan berlaku kepada akar jika botol sentiasa diisi penuh?"),
  L("Why did the student team need a roof over their bottles?","Mengapakah pasukan pelajar memerlukan bumbung di atas botol mereka?")],
 posters:[P("assets/zph/hydro-1.jpg","A rain shelter house prototype","Prototaip rumah perlindungan hujan")]},

/* ---------------------------------------------------------------- 13 FUSED PLASTIC */
{id:"fused",icon:"☂️",min:9,mins:90,diff:2,sup:"adult",heat:true,sdgs:[12,14],video:"self",
 badge:{icon:"☂️",name:L("Plastic Tailor","Tukang Jahit Plastik")},
 title:L("Fused-Plastic Bags & Mini Umbrella","Beg & Payung Mini Plastik Cantum"),
 hook:L("Iron used plastic bags (between baking paper) into a tough new fabric, then make a drawstring bag, a tote or a working mini umbrella.","Seterika beg plastik terpakai (di antara kertas pembakar) menjadi fabrik baharu yang kuat, kemudian hasilkan beg serut, beg tote atau payung mini yang berfungsi."),
 time:L("90 min (the umbrella takes a second session)","90 min (payung memerlukan sesi kedua)"),
 cost:L("Almost free: used bags and straws, plus thread and string. Baking paper: example rolls from about RM 5.30 (30 cm × 5 m) to RM 9.90 (38 cm × 12 m); prices vary.","Hampir percuma: beg dan straw terpakai, serta benang dan tali. Kertas pembakar: contoh gulungan dari kira-kira RM 5.30 (30 cm × 5 m) hingga RM 9.90 (38 cm × 12 m); harga berbeza-beza."),
 waste:L("Thin plastic carrier bags (marked 2 HDPE or 4 LDPE); plastic straws","Beg plastik nipis (bertanda 2 HDPE atau 4 LDPE); straw plastik"),product:L("Fused plastic fabric: drawstring bag, tote bag, mini umbrella","Fabrik plastik cantum: beg serut, beg tote, payung mini"),
 why:{env:L("Carrier bags are light, blow into drains and are rarely recycled. Fusing them turns many weak bags into one strong, waterproof sheet.","Beg plastik ringan, mudah diterbangkan ke longkang dan jarang dikitar semula. Mencantumnya menukar banyak beg yang lemah menjadi satu kepingan yang kuat dan kalis air."),
  econ:L("Waterproof pouches and totes from free waste can be sold at school fairs.","Kantung dan beg tote kalis air daripada sisa percuma boleh dijual di karnival sekolah."),
  soc:L("Sewing and designing build real skills, and each bag carries a message about plastic.","Menjahit dan mereka bentuk membina kemahiran sebenar, dan setiap beg membawa mesej tentang plastik.")},
 mats:[L("5–10 used carrier bags, clean and dry (check the symbol: 2 or 4 only)","5–10 beg plastik terpakai, bersih dan kering (semak simbol: 2 atau 4 sahaja)"),
  L("Baking (parchment) paper, a clothes iron and an ironing board or towel-covered table","Kertas pembakar, seterika dan papan seterika atau meja beralas tuala"),
  L("Scissors, ruler and marker","Gunting, pembaris dan pen penanda"),
  L("Needle and thread or a sewing machine; buttons","Jarum dan benang atau mesin jahit; butang"),
  L("For the umbrella: about 10 plastic straws","Untuk payung: kira-kira 10 straw plastik")],
 steps:[H("Make the fabric (ADULT irons)","Hasilkan fabrik (ORANG DEWASA menyeterika)"),
  S("Cut off the handles and the bottom seam of each bag, then cut down one side so it opens into a flat sheet.","Potong pemegang dan jahitan bawah setiap beg, kemudian gunting satu sisi supaya terbuka menjadi kepingan rata."),
  S("Stack 4–6 layers of bag on baking paper and cover with another sheet of baking paper. Plastic must never touch the iron.","Susun 4–6 lapisan beg di atas kertas pembakar dan tutup dengan sehelai lagi kertas pembakar. Plastik tidak boleh menyentuh seterika."),
  S("ADULT: iron on a low-medium setting with no steam, keeping the iron moving for 15–20 seconds. Turn over and repeat.","ORANG DEWASA: seterika pada suhu rendah-sederhana tanpa wap, gerakkan seterika selama 15–20 saat. Terbalikkan dan ulang.","Too cool and the layers will not join (as one student team found); too hot and it shrinks, gets holes and smells. Stop if it smokes.","Terlalu sejuk, lapisan tidak bercantum (seperti yang didapati satu pasukan pelajar); terlalu panas, ia mengecut, berlubang dan berbau. Berhenti jika berasap."),
  S("Let it cool, then peel off the paper. The bags have shrunk into one stiff, waterproof sheet.","Biarkan sejuk, kemudian tanggalkan kertas. Beg-beg itu telah mengecut menjadi satu kepingan yang keras dan kalis air."),
  H("Drawstring bag","Beg serut"),
  S("Measure, mark and trim the fabric to two equal rectangles.","Ukur, tanda dan potong fabrik menjadi dua segi empat tepat yang sama besar."),
  S("Fold 2 cm over at the top edge, cover with baking paper and ADULT irons the fold to seal a tunnel. Then seal the sides and bottom the same way, or sew them.","Lipat 2 cm di tepi atas, tutup dengan kertas pembakar dan ORANG DEWASA menyeterika lipatan untuk menjadi terowong. Kemudian kedapkan sisi dan bawah dengan cara yang sama, atau jahit."),
  S("Make a plastic-bag cord: fold a bag 3 times, cut strips two fingers wide, open them out and cut in a zig-zag to get one long strip. Thread it through the tunnel and knot.","Buat tali beg plastik: lipat beg 3 kali, gunting jalur selebar dua jari, buka dan gunting secara zig-zag untuk mendapat satu jalur panjang. Masukkan ke dalam terowong dan simpul."),
  H("Tote bag","Beg tote"),
  S("Cut fabric pieces to the size you want (front, back, base, two handles). Sew them together by hand or machine and add a button.","Potong kepingan fabrik mengikut saiz yang dikehendaki (depan, belakang, dasar, dua pemegang). Jahit dengan tangan atau mesin dan pasang butang."),
  H("Mini umbrella","Payung mini"),
  S("ADULT irons straws flat between baking paper to make stiff strips. Cut each strip in half for 2 ribs, or in quarters for 4 stretchers.","ORANG DEWASA menyeterika straw sehingga leper di antara kertas pembakar untuk menghasilkan jalur keras. Potong setiap jalur dua untuk 2 rusuk, atau empat untuk 4 penyokong."),
  S("Bundle 4 straws as the shaft. Make 2 small holes at the ends of each rib and stretcher.","Ikat 4 straw sebagai batang. Buat 2 lubang kecil di hujung setiap rusuk dan penyokong."),
  S("Sew the stretchers to a short straw sleeve (the runner) with needle and thread, and the ribs to the top of the shaft. Add a stopper so the runner locks open.","Jahit penyokong pada lengan straw pendek (peluncur) dengan jarum dan benang, dan rusuk pada bahagian atas batang. Tambah penahan supaya peluncur terkunci apabila dibuka."),
  S("Open and close it to test, then cut a circle of fused fabric as the canopy and stitch it to the rib tips.","Buka dan tutup untuk menguji, kemudian gunting bulatan fabrik cantum sebagai kanopi dan jahit pada hujung rusuk.")],
 safety:[D("ADULT ONLY for all ironing. Open windows or use a fan, keep the iron on low-medium, always use baking paper on both sides, and stop at once if there is smoke or a sharp smell.","ORANG DEWASA SAHAJA untuk semua kerja menyeterika. Buka tingkap atau guna kipas, kekalkan seterika pada suhu rendah-sederhana, sentiasa guna kertas pembakar di kedua-dua belah, dan berhenti serta-merta jika berasap atau berbau tajam."),
  D("Use only bags marked 2 (HDPE) or 4 (LDPE). Never heat PVC (3), foil-lined wrappers or bags with metal print: they can give off toxic fumes.","Guna beg bertanda 2 (HDPE) atau 4 (LDPE) sahaja. Jangan panaskan PVC (3), pembalut berlapik kerajang atau beg bercetak logam: ia boleh membebaskan wasap toksik."),
  W("Hot plastic sticks to skin and burns. Let it cool before touching.","Plastik panas melekat pada kulit dan melecurkan. Biarkan sejuk sebelum disentuh."),
  W("Needles and scissors: count needles before and after, and keep fingers clear of the sewing-machine needle.","Jarum dan gunting: kira jarum sebelum dan selepas, dan jauhkan jari daripada jarum mesin jahit.")],
 sci:{kids:L("Some plastics go soft when they get warm. When the soft layers press together and cool down, they stick and become one strong sheet.","Sesetengah plastik menjadi lembut apabila panas. Apabila lapisan yang lembut ditekan bersama dan disejukkan, ia melekat dan menjadi satu kepingan yang kuat."),
  teens:L("Polyethylene is a thermoplastic: long chain molecules that slide past each other when warm. Under the iron, chains at the surfaces mix across the layers, and on cooling they lock together. LDPE softens and melts at a lower temperature than HDPE, which is why a low-medium iron is enough and a hot iron burns holes.","Polietilena ialah termoplastik: molekul rantai panjang yang boleh menggelongsor apabila panas. Di bawah seterika, rantai di permukaan bercampur merentasi lapisan, dan apabila sejuk ia terkunci bersama. LDPE melembut dan melebur pada suhu lebih rendah berbanding HDPE, sebab itu seterika rendah-sederhana sudah memadai dan seterika panas membakar lubang."),
  adults:L("Fusing is upcycling by heat, so the controls matter: thin PE melts at roughly 115–135 °C, well below the temperature at which it decomposes, but PVC releases hydrogen chloride when heated and printed or foil layers can release other fumes. Ventilate, keep temperatures low and sort by resin code first. Once fused and sewn, the product can still go back into PE recycling at end of life if no other materials are attached.","Pencantuman ialah kitar naik menggunakan haba, jadi kawalan penting: PE nipis melebur pada kira-kira 115–135 °C, jauh di bawah suhu penguraiannya, tetapi PVC membebaskan hidrogen klorida apabila dipanaskan dan lapisan bercetak atau kerajang boleh membebaskan wasap lain. Pastikan pengudaraan, kekalkan suhu rendah dan asingkan mengikut kod resin terlebih dahulu. Selepas dicantum dan dijahit, produk masih boleh dikitar semula sebagai PE pada akhir hayat jika tiada bahan lain dilekatkan.")},
 teach:L("The adult runs one ironing station by an open window; groups queue with their stacked bags and baking paper. Others cut, design and sew. Make the fabric in session 1 and the umbrella in session 2.","Orang dewasa mengendalikan satu stesen seterika di tepi tingkap yang terbuka; kumpulan beratur dengan beg yang telah disusun dan kertas pembakar. Yang lain menggunting, mereka bentuk dan menjahit. Hasilkan fabrik dalam sesi 1 dan payung dalam sesi 2."),
 ext:[L("Strength test: hang a bag of 1 layer, 4 layers and 8 layers from a hook and add water bottles until each tears. Plot layers vs. load.","Ujian kekuatan: gantung beg 1 lapisan, 4 lapisan dan 8 lapisan pada cangkuk dan tambah botol air sehingga setiap satu koyak. Plot lapisan lawan beban."),
  L("Waterproof test: pour 100 mL of water into your drawstring bag. Does any leak out in 5 minutes? Where?","Ujian kalis air: tuang 100 mL air ke dalam beg serut anda. Adakah air bocor dalam 5 minit? Di mana?"),
  L("Count how many carrier bags went into your product. How many would your whole class save in a term?","Kira berapa beg plastik digunakan untuk produk anda. Berapa banyak yang dapat diselamatkan oleh seluruh kelas dalam satu penggal?")],
 refl:[L("Why must plastic never touch the iron directly?","Mengapakah plastik tidak boleh menyentuh seterika secara terus?"),
  L("Is a fused-plastic bag better than refusing the carrier bag in the first place?","Adakah beg plastik cantum lebih baik daripada menolak beg plastik dari awal?"),
  L("What else could you make from the fabric?","Apa lagi yang boleh dibuat daripada fabrik ini?")],
 posters:[P("assets/zph/fused-umbrella.jpg","Mini umbrella frame made from ironed straws","Rangka payung mini daripada straw yang diseterika"),P("assets/zph/fused-pouch.jpg","A finished pouch with a button","Kantung siap dengan butang"),P("assets/zph/fused-drawstring.jpg","Drawstring bag: inserting the drawstring","Beg serut: memasukkan tali serut"),P("assets/zph/fused-plarn.jpg","Drawstring bag: cutting zig-zag plastic strips","Beg serut: menggunting jalur plastik zig-zag")]},

/* ---------------------------------------------------------------- 14 LIFEBUOY */
{id:"lifebuoy",icon:"🛟",min:7,mins:45,diff:1,sup:"close",heat:false,sdgs:[11,13,14],video:"self",
 badge:{icon:"🛟",name:L("Float Engineer","Jurutera Pelampung")},
 title:L("Bubble-Wrap Float Ring (Model)","Gelang Pelampung Balutan Gelembung (Model)"),
 hook:L("Roll parcel bubble wrap into a ring that floats, then test how much weight it can hold up in a basin.","Gulung balutan gelembung bungkusan menjadi gelang yang terapung, kemudian uji berapa banyak berat yang boleh ditampungnya dalam besen."),
 time:L("45 min","45 min"),
 cost:L("Free: parcel bubble wrap, a scrap of tarpaulin or a plastic bag, and tape.","Percuma: balutan gelembung bungkusan, sisa kanvas plastik atau beg plastik, dan pita."),
 waste:L("Bubble wrap from parcels; old PE tarpaulin or plastic bags","Balutan gelembung daripada bungkusan; kanvas PE atau beg plastik lama"),product:L("A model float ring for a buoyancy experiment","Model gelang pelampung untuk eksperimen keapungan"),
 why:{env:L("Online shopping produces lots of bubble wrap and plastic film. Kept in use, it stays out of drains, where plastic blocks water flow and makes flash floods worse.","Membeli-belah dalam talian menghasilkan banyak balutan gelembung dan filem plastik. Jika terus digunakan, ia tidak masuk ke longkang, tempat plastik menyekat aliran air dan memburukkan banjir kilat."),
  econ:L("Free materials make a full science experiment on floating and sinking.","Bahan percuma menghasilkan eksperimen sains lengkap tentang terapung dan tenggelam."),
  soc:L("Floods are Malaysia's most common natural disaster. Building a model opens a talk about flood safety: what to do, and what never to do.","Banjir ialah bencana alam paling kerap di Malaysia. Membina model membuka perbincangan tentang keselamatan banjir: apa yang perlu dibuat, dan apa yang tidak boleh sekali-kali dibuat.")},
 table:{head:[L("Students' full-size design","Reka bentuk saiz penuh pelajar"),L("Value","Nilai")],
  rows:[[L("For a child up to","Untuk kanak-kanak sehingga"),"30 kg"],[L("Inner radius","Jejari dalam"),"0.25 m"],[L("Outer radius","Jejari luar"),"0.57 m"],[L("Tube radius","Jejari tiub"),"0.16 m"],[L("Volume","Isi padu"),"≈ 0.2 m³"]],
  note:L("From the 2024 lifebuoy team's slides. A model, not a tested safety device.","Daripada slaid pasukan pelampung 2024. Model, bukan alat keselamatan yang diuji.")},
 mats:[L("A long piece of bubble wrap (about 1 m × 30 cm for a model)","Sehelai balutan gelembung panjang (kira-kira 1 m × 30 cm untuk model)"),
  L("Wide tape (packing or duct tape)","Pita lebar (pita bungkusan atau pita duct)"),
  L("An old PE tarpaulin scrap or 2 plastic bags for the cover","Sisa kanvas PE lama atau 2 beg plastik untuk penutup"),
  L("A basin or big tub of water, and weights: 500 mL water bottles, coins or marbles","Besen atau tab besar berisi air, dan pemberat: botol air 500 mL, syiling atau guli"),
  L("Kitchen scale and ruler","Penimbang dapur dan pembaris")],
 steps:[S("Lay 3 layers of bubble wrap on top of each other and tape them together into one thick sheet.","Susun 3 lapisan balutan gelembung dan lekatkan dengan pita menjadi satu kepingan tebal."),
  S("Roll the sheet tightly into a long tube and tape along its length.","Gulung kepingan itu dengan ketat menjadi tiub panjang dan lekatkan pita sepanjangnya."),
  S("Bend the tube into a ring and tape the two ends firmly together.","Bengkokkan tiub menjadi gelang dan lekatkan kedua-dua hujungnya dengan kuat."),
  S("Cover the ring with strips of tarpaulin or plastic bag and tape them down. This is your waterproof skin.","Balut gelang dengan jalur kanvas atau beg plastik dan lekatkan dengan pita. Ini ialah kulit kalis air."),
  S("Weigh the ring. Measure its outer and inner diameter and the thickness of the tube.","Timbang gelang. Ukur diameter luar dan dalam serta ketebalan tiub."),
  S("Float it in the basin. Add weights one at a time until water reaches the top of the ring. Record the total mass it held.","Apungkan dalam besen. Tambah pemberat satu demi satu sehingga air sampai ke bahagian atas gelang. Catat jumlah jisim yang ditampung.","1 litre of water has a mass of 1 kg. A ring that can push aside 2 litres of water can hold up about 2 kg, minus its own mass.","1 liter air berjisim 1 kg. Gelang yang boleh menolak 2 liter air boleh menampung kira-kira 2 kg, tolak jisimnya sendiri.")],
 safety:[D("This is a learning model, NOT a life-saving device. Never use it for swimming, in a flood or for a rescue. Only certified lifejackets and lifebuoys are safe.","Ini ialah model pembelajaran, BUKAN alat menyelamat nyawa. Jangan sekali-kali gunakannya untuk berenang, semasa banjir atau untuk menyelamat. Hanya jaket keselamatan dan pelampung yang diperakui selamat."),
  D("In a flood: stay out of the water, move to higher ground and call 999. If someone is in the water, REACH or THROW, don't GO in.","Semasa banjir: jauhi air, berpindah ke tempat tinggi dan hubungi 999. Jika seseorang di dalam air, HULUR atau BALING, jangan TERJUN."),
  W("An adult stays by the basin the whole time: young children can drown in a few centimetres of water. Empty it after use.","Orang dewasa berada di tepi besen sepanjang masa: kanak-kanak kecil boleh lemas dalam air beberapa sentimeter. Kosongkan selepas digunakan."),
  W("Keep bubble wrap and plastic bags away from babies and toddlers (suffocation).","Jauhkan balutan gelembung dan beg plastik daripada bayi dan kanak-kanak kecil (lemas).")],
 sci:{kids:L("Things float when they are light for their size. Bubble wrap is mostly air, so the ring pushes water out of the way and the water pushes back up.","Benda terapung apabila ringan bagi saiznya. Balutan gelembung kebanyakannya udara, jadi gelang menolak air ke tepi dan air menolak semula ke atas."),
  teens:L("Archimedes' principle: the upward force equals the weight of water pushed aside. A ring is a torus, with volume V = 2π²Rr², where R is the distance to the centre of the tube and r is the tube radius. Each litre under water gives about 1 kg of lift. For the students' design (R = 0.41 m, r = 0.16 m), V ≈ 0.2 m³ = 200 L.","Prinsip Archimedes: daya ke atas sama dengan berat air yang ditolak. Gelang ialah torus, dengan isi padu V = 2π²Rr², R ialah jarak ke pusat tiub dan r ialah jejari tiub. Setiap liter di bawah air memberi kira-kira 1 kg daya angkat. Bagi reka bentuk pelajar (R = 0.41 m, r = 0.16 m), V ≈ 0.2 m³ = 200 L."),
  adults:L("Volume is not the only test of a life-saving device. A certified ship's lifebuoy (IMO Life-Saving Appliances Code) must hold up at least 14.5 kg of iron in fresh water for 24 hours, survive a drop into water and resist fire, oil and sunlight. Bubbles can burst and seams can leak, which is why DIY floats stay as models. The real lesson is prevention: plastic kept out of drains reduces flood risk.","Isi padu bukan satu-satunya ujian bagi alat menyelamat nyawa. Pelampung kapal yang diperakui (Kod Peralatan Menyelamat Nyawa IMO) mesti menampung sekurang-kurangnya 14.5 kg besi dalam air tawar selama 24 jam, tahan dijatuhkan ke dalam air dan tahan api, minyak serta cahaya matahari. Gelembung boleh pecah dan sambungan boleh bocor, sebab itu pelampung DIY kekal sebagai model. Pengajaran sebenar ialah pencegahan: plastik yang dijauhkan dari longkang mengurangkan risiko banjir.")},
 teach:L("Run it as a fair test: groups change one thing (layers, tube thickness or ring size) and compare the mass held. Finish with the flood safety rules and \"Reach or throw, don't go\".","Jalankan sebagai ujian adil: kumpulan mengubah satu perkara (bilangan lapisan, ketebalan tiub atau saiz gelang) dan bandingkan jisim yang ditampung. Akhiri dengan peraturan keselamatan banjir dan \"Hulur atau baling, jangan terjun\"."),
 ext:[L("Use V = 2π²Rr² to predict how much your model should hold. Compare with your test. Why are they different?","Guna V = 2π²Rr² untuk meramal berapa banyak model anda patut tampung. Bandingkan dengan ujian anda. Mengapa berbeza?"),
  L("Check the students' numbers: with R = 0.41 m and r = 0.16 m, what volume do you get?","Semak nombor pelajar: dengan R = 0.41 m dan r = 0.16 m, berapakah isi padu yang anda dapat?"),
  L("Make a poster for your neighbourhood: \"Keep plastic out of drains\" and the flood safety rules.","Buat poster untuk kejiranan anda: \"Jauhkan plastik dari longkang\" dan peraturan keselamatan banjir.")],
 refl:[L("Why is a home-made float not safe for a real flood?","Mengapakah pelampung buatan sendiri tidak selamat untuk banjir sebenar?"),
  L("How does plastic in drains make floods worse?","Bagaimanakah plastik dalam longkang memburukkan banjir?"),
  L("What would you do if you saw someone in floodwater?","Apakah yang akan anda lakukan jika melihat seseorang di dalam air banjir?")],
 posters:[P("assets/zph/lifebuoy-steps.jpg","4 steps: layer, roll, join, cover","4 langkah: lapis, gulung, sambung, balut"),P("assets/zph/lifebuoy-1.jpg","A full-size student prototype, covered in red PE tarpaulin","Prototaip saiz penuh pelajar, dibalut kanvas PE merah")]},

/* ---------------------------------------------------------------- 15 SLEEPING BAG */
{id:"sleepbag",icon:"🛌",min:10,mins:120,diff:2,sup:"close",heat:false,sdgs:[1,3,11,12],video:null,
 badge:{icon:"🛌",name:L("Warm Hearts Maker","Pembuat Hati Hangat")},
 title:L("3-in-1 Bubble-Wrap Sleeping Bag","Beg Tidur 3-dalam-1 Balutan Gelembung"),
 hook:L("Sew squares of bubble wrap and old cloth into a mat that becomes a blanket or a buttoned sleeping bag.","Jahit petak balutan gelembung dan kain lama menjadi tikar yang boleh dijadikan selimut atau beg tidur berbutang."),
 time:L("About 2 hours, over 2–3 sessions","Kira-kira 2 jam, dalam 2–3 sesi"),
 cost:L("Almost free: bubble wrap from parcels and old cloth; thread and buttons.","Hampir percuma: balutan gelembung bungkusan dan kain lama; benang dan butang."),
 waste:L("Parcel bubble wrap; old bedsheets, curtains or T-shirts","Balutan gelembung bungkusan; cadar, langsir atau baju-T lama"),product:L("A 3-in-1 mat, blanket and sleeping bag","Tikar, selimut dan beg tidur 3-dalam-1"),
 why:{env:L("Bubble wrap from online shopping is light, bulky and rarely recycled. Here it gets a long second life with old cloth that would also be thrown away.","Balutan gelembung daripada membeli-belah dalam talian ringan, besar dan jarang dikitar semula. Di sini ia mendapat hayat kedua yang panjang bersama kain lama yang juga akan dibuang."),
  econ:L("Two free waste streams make a useful product for camping, school trips or flood relief centres.","Dua aliran sisa percuma menghasilkan produk berguna untuk perkhemahan, lawatan sekolah atau pusat pemindahan banjir."),
  soc:L("A 2024 student team designed it for people sleeping rough on cold, hard floors: a gift that shows care.","Satu pasukan pelajar 2024 mereka bentuknya untuk golongan yang tidur di lantai yang sejuk dan keras: hadiah yang menunjukkan keprihatinan.")},
 mats:[L("Bubble wrap, enough for 18 squares of 30 cm × 30 cm","Balutan gelembung, cukup untuk 18 petak 30 cm × 30 cm"),
  L("Old cloth (bedsheet, curtain or T-shirts) for 18 matching squares","Kain lama (cadar, langsir atau baju-T) untuk 18 petak yang sepadan"),
  L("Ruler, marker, scissors and pins","Pembaris, pen penanda, gunting dan pin"),
  L("Big needle and strong thread, or a sewing machine","Jarum besar dan benang kuat, atau mesin jahit"),
  L("About 10 buttons","Kira-kira 10 butang")],
 steps:[S("Cut 18 squares of bubble wrap and 18 squares of cloth, each 30 cm × 30 cm.","Gunting 18 petak balutan gelembung dan 18 petak kain, setiap satu 30 cm × 30 cm."),
  S("Pin a cloth square onto each bubble-wrap square, bubbles facing in.","Pinkan petak kain pada setiap petak balutan gelembung, gelembung menghadap ke dalam."),
  S("Sew the pairs into 6 rows of 3 squares.","Jahit pasangan petak menjadi 6 baris, setiap baris 3 petak."),
  S("Sew the 6 rows together into one sheet, about 90 cm × 180 cm.","Jahit 6 baris itu menjadi satu kepingan, kira-kira 90 cm × 180 cm.","The student team made theirs about 100 cm × 180 cm: big enough for an adult to lie on.","Pasukan pelajar itu membuat kira-kira 100 cm × 180 cm: cukup besar untuk orang dewasa berbaring."),
  S("Fold a strip of cloth over the edges and sew it down so no bubble wrap sticks out.","Lipat jalur kain di tepi dan jahit supaya tiada balutan gelembung terkeluar."),
  S("Sew buttons along one long side and the bottom. Cut small button holes (or sew loops) on the matching edges.","Jahit butang di sepanjang satu sisi panjang dan bahagian bawah. Buat lubang butang kecil (atau jahit gelung) di tepi yang sepadan."),
  S("Test all 3 ways: open flat as a mat (bubble side down), wrap as a blanket, or fold in half and button up as a sleeping bag.","Uji ketiga-tiga cara: buka rata sebagai tikar (bahagian gelembung ke bawah), balut sebagai selimut, atau lipat dua dan butangkan sebagai beg tidur.","The student team's next idea: velcro instead of buttons, so it is quicker to change.","Idea seterusnya pasukan pelajar itu: velcro sebagai ganti butang, supaya lebih cepat ditukar.")],
 safety:[D("Plastic over the face can stop breathing. Never let babies or toddlers use or play with it, and never cover the face.","Plastik di muka boleh menghentikan pernafasan. Jangan biarkan bayi atau kanak-kanak kecil menggunakan atau bermain dengannya, dan jangan tutup muka."),
  W("Plastic burns and melts easily: keep it away from candles, mosquito coils and stoves.","Plastik mudah terbakar dan cair: jauhkan daripada lilin, ubat nyamuk lingkar dan dapur."),
  W("Needles and pins: count them before and after. Keep fingers clear of a sewing-machine needle.","Jarum dan pin: kira sebelum dan selepas. Jauhkan jari daripada jarum mesin jahit.")],
 sci:{kids:L("A cold floor pulls heat out of your body. The air in the bubbles is very bad at carrying heat, so it keeps you warm, like a puffy jacket.","Lantai yang sejuk menarik haba keluar dari badan. Udara dalam gelembung sangat lemah membawa haba, jadi ia memastikan anda hangat, seperti jaket kembung."),
  teens:L("Heat moves by conduction, convection and radiation. Lying on a floor loses heat mainly by conduction. Still air conducts heat about 40 times less well than concrete, and sealed bubbles stop the air moving (no convection), so the bubble layer is a good insulator. The plastic also blocks damp from the ground.","Haba bergerak melalui konduksi, perolakan dan sinaran. Berbaring di lantai kehilangan haba terutamanya melalui konduksi. Udara pegun mengkonduksi haba kira-kira 40 kali lebih lemah daripada konkrit, dan gelembung tertutup menghalang udara bergerak (tiada perolakan), jadi lapisan gelembung ialah penebat yang baik. Plastik juga menghalang lembapan dari tanah."),
  adults:L("This combines two hard-to-recycle streams, LDPE film and mixed textiles, into a long-life product. Plastic does not breathe, so sweat can condense inside: the cloth layer faces the body. Design questions for a real relief product: washability, fire behaviour and how it is collected at end of life.","Ini menggabungkan dua aliran yang sukar dikitar semula, filem LDPE dan tekstil campuran, menjadi produk tahan lama. Plastik tidak telap udara, jadi peluh boleh terkondensasi di dalam: lapisan kain menghadap badan. Soalan reka bentuk bagi produk bantuan sebenar: boleh dibasuh, sifat terhadap api dan cara dikutip pada akhir hayat.")},
 teach:L("Split the class: cutters, pinners and sewers. Hand-sewing suits ages 10+; a teacher or older pupils use the machine. Two classes can make one bag each for a local shelter or relief centre (ask them first what they need).","Bahagikan kelas: penggunting, pengepin dan penjahit. Jahitan tangan sesuai untuk umur 10+; guru atau murid yang lebih tua menggunakan mesin. Dua kelas boleh membuat satu beg setiap satu untuk rumah perlindungan atau pusat bantuan tempatan (tanya dahulu apa yang mereka perlukan)."),
 ext:[L("Warmth test: put a cup of warm water on a square of bubble wrap and another on plain cloth on a cold floor. Measure the temperature every 5 minutes. Which cools faster?","Ujian kehangatan: letakkan secawan air suam di atas petak balutan gelembung dan secawan lagi di atas kain biasa di lantai sejuk. Ukur suhu setiap 5 minit. Yang mana lebih cepat sejuk?"),
  L("Area maths: how many 30 cm squares do you need for a 100 cm × 180 cm bag? (Remember the seams.)","Matematik luas: berapa petak 30 cm diperlukan untuk beg 100 cm × 180 cm? (Ingat jahitan.)"),
  L("Research plastic-bag sleeping mats crocheted from strips of hundreds of bags (the student team's inspiration). Compare time and materials with your bag.","Kaji tikar tidur daripada jalur ratusan beg plastik yang dikait (inspirasi pasukan pelajar itu). Bandingkan masa dan bahan dengan beg anda.")],
 refl:[L("Who in your community could use this, and how would you ask them?","Siapakah dalam komuniti anda yang boleh menggunakannya, dan bagaimana anda akan bertanya kepada mereka?"),
  L("Why is still air a good insulator?","Mengapakah udara pegun ialah penebat yang baik?"),
  L("What other waste could you use instead of bubble wrap?","Apakah sisa lain yang boleh digunakan selain balutan gelembung?")],
 posters:[P("assets/zph/sleepingbag.jpg","The rolled-up bubble-wrap sleeping bag","Beg tidur balutan gelembung yang digulung"),P("assets/zph/sleep-sew.jpg","Sewing the 30 cm squares","Menjahit petak 30 cm"),P("assets/zph/sleep-mat.jpg","Opened out as a mat","Dibuka sebagai tikar")]}
];

/* ================================================================= UI */
const T={
 labsT:L("Hands-on Labs","Makmal Amali"),labsS:L("Make real products from waste. Each lab earns a badge.","Hasilkan produk sebenar daripada sisa. Setiap makmal memberi lencana."),
 made:L("labs made","makmal disiapkan"),
 safeHint:L("Before any lab, read its Safety notes. Steps marked ADULT are for grown-ups only.","Sebelum mana-mana makmal, baca nota Keselamatan. Langkah bertanda ORANG DEWASA hanya untuk orang dewasa."),
 fAge:L("Age","Umur"),fTime:L("Time","Masa"),fHeat:L("Heat","Haba"),all:L("All","Semua"),any:L("Any","Semua"),
 a79:L("7–9","7–9"),a1012:L("10–12","10–12"),a13:L("13+","13+"),t45:L("≤ 45 min","≤ 45 min"),t90:L("≤ 90 min","≤ 90 min"),
 noHeat:L("No heat","Tanpa haba"),heat:L("Needs heat","Perlu haba"),none:L("No lab matches these filters.","Tiada makmal sepadan dengan penapis ini."),
 ages:L("Ages","Umur"),diff:L("Difficulty","Kesukaran"),of3:L("of 3","daripada 3"),
 sup:{light:L("Light supervision","Pengawasan ringan"),close:L("Close supervision","Pengawasan rapi"),adult:L("Adult does hot or sharp steps","Orang dewasa buat langkah panas atau tajam")},
 cost:L("Cost","Kos"),waste:L("Waste used","Sisa digunakan"),product:L("Product","Produk"),
 why:L("Why it matters","Mengapa ia penting"),env:L("Environment","Alam sekitar"),econ:L("Economy","Ekonomi"),soc:L("Society","Masyarakat"),
 video:L("Watch the demo","Tonton demonstrasi"),
soon:L("Video coming soon","Video akan datang"),
 vidLocal:L("Plays from this website, no Google Drive needed. In the offline pack it plays without internet.","Dimainkan dari laman web ini, tanpa Google Drive. Dalam pek luar talian ia dimainkan tanpa internet."),
vidLitmus:L("A 2025 student group built this digital pH meter (Arduino, pH probe and LCD screen) for their guessing game. The kitchen-waste indicator in this lab needs no electronics.","Kumpulan pelajar 2025 membina meter pH digital ini (Arduino, prob pH dan skrin LCD) untuk permainan meneka mereka. Penunjuk daripada sisa dapur dalam makmal ini tidak memerlukan elektronik."),
 vidMissing:L("This copy has no video file. Open the website or the offline pack to watch it.","Salinan ini tiada fail video. Buka laman web atau pek luar talian untuk menontonnya."),
 mats:L("You need","Anda perlukan"),steps:L("Steps","Langkah-langkah"),safety:L("Safety first","Keselamatan dahulu"),
 sci:L("The science","Sainsnya"),lvl:{kids:L("Kids level","Tahap kanak-kanak"),teens:L("Teens level","Tahap remaja"),adults:L("Adults level","Tahap dewasa")},
 lvlHint:L("Change the level on the Home page: \"Who's playing?\"","Tukar tahap di halaman Utama: \"Siapa yang bermain?\""),
 teach:L("Teacher tip","Tip guru"),ext:L("Challenge","Cabaran"),refl:L("Think about it","Fikirkan"),posters:L("Photos & posters","Foto & poster"),
 credit:L("Photos and posters: UPM chemical engineering students, Faculty of Engineering. Lab guides checked and corrected by the WasteQuest team.","Foto dan poster: pelajar kejuruteraan kimia UPM, Fakulti Kejuruteraan. Panduan makmal disemak dan dibetulkan oleh pasukan WasteQuest."),
 gate:L("Age and supervision","Umur dan pengawasan"),soonN:L("A new demo video for this lab is being made. Follow the steps and photos for now.","Video demonstrasi baharu untuk makmal ini sedang dihasilkan. Buat masa ini, ikut langkah dan foto."),
 code:L("Arduino sketch","Lakaran Arduino"),
 madeIt:L("I made it!","Saya berjaya buat!"),earned:L("Badge earned","Lencana diperoleh"),madeOn:L("You made this on","Anda membuatnya pada"),
 print:L("Print worksheet","Cetak lembaran kerja"),reset:L("Clear ticks","Kosongkan tanda"),
 prev:L("Previous lab","Makmal sebelum"),next:L("Next lab","Makmal seterusnya"),allLabs:L("All labs","Semua makmal"),
 close:L("Close","Tutup"),pImg:L("Previous poster","Poster sebelum"),nImg:L("Next poster","Poster seterusnya"),open:L("Open poster","Buka poster"),
 nf:L("Lab not found.","Makmal tidak dijumpai."),
 wsT:L("Worksheet","Lembaran Kerja"),name:L("Name","Nama"),cls:L("Class","Kelas"),date:L("Date","Tarikh"),
 result:L("My result: what I made and what I noticed","Hasil saya: apa yang saya buat dan apa yang saya perhatikan"),
 sign:L("Teacher sign-off","Pengesahan guru"),sSafe:L("Completed safely","Disiapkan dengan selamat"),sMade:L("Product made","Produk dihasilkan"),
 tName:L("Teacher's name","Nama guru"),sig:L("Signature","Tandatangan"),printNow:L("Print","Cetak"),backLab:L("Back to the lab","Kembali ke makmal"),
 vid:L("Video","Video"),teenL:L("Teens","Remaja"),adultL:L("Adults","Dewasa")
};

/* age/supervision gating (research/v2/02_todo_curriculum_credential.md A2) */
const GATE={
 candle:L("Primary pupils (up to 12): an adult does all the heating and pouring as a demonstration. Children filter cold oil, weigh and decorate.","Murid sekolah rendah (hingga 12 tahun): orang dewasa melakukan semua pemanasan dan penuangan sebagai demonstrasi. Kanak-kanak menapis minyak sejuk, menimbang dan menghias."),
 petfood:L("An adult handles raw fish, the steamer and the oven. These are occasional treats, not a tested complete pet food.","Orang dewasa mengendalikan ikan mentah, pengukus dan ketuhar. Ini snek sekali-sekala, bukan makanan haiwan lengkap yang telah diuji."),
 treasure:L("Soap made with lye (sodium hydroxide) is for adults only. Children use melt-and-pour soap base, with an adult doing the melting.","Sabun yang dibuat dengan alkali kuat (natrium hidroksida) hanya untuk orang dewasa. Kanak-kanak menggunakan bes sabun cair-dan-tuang, dengan orang dewasa mencairkannya."),
 watering:L("Arduino version: low-voltage parts only (USB or batteries), never mains electricity. An adult checks the wiring before power goes on.","Versi Arduino: komponen voltan rendah sahaja (USB atau bateri), jangan sekali-kali elektrik sesalur utama. Orang dewasa menyemak pendawaian sebelum kuasa dihidupkan."),
 bioplastic:L("An adult does the heating on the stove. Children measure, stir away from the heat and shape the cooled mixture.","Orang dewasa memanaskan campuran di atas dapur. Kanak-kanak menyukat, mengacau jauh dari api dan membentuk campuran yang telah sejuk."),
 fused:L("Primary pupils (up to 12): an adult does all the ironing as a demonstration, or brings ready-made fused sheets. Children cut, design and sew.","Murid sekolah rendah (hingga 12 tahun): orang dewasa melakukan semua kerja menyeterika sebagai demonstrasi, atau membawa kepingan plastik cantum yang siap. Kanak-kanak menggunting, mereka bentuk dan menjahit."),
 lifebuoy:L("This is a model for learning how things float. It is not a safety device: never use it in water to hold up a person.","Ini model untuk belajar cara benda terapung. Ia bukan alat keselamatan: jangan sekali-kali gunakannya di dalam air untuk menampung seseorang."),
 sleepbag:L("A learning prototype only: it has not been tested for outdoor or emergency use. An adult supervises needles and any sewing machine.","Prototaip pembelajaran sahaja: ia belum diuji untuk kegunaan luar atau kecemasan. Orang dewasa mengawasi penggunaan jarum dan mesin jahit.")
};
const t=WQ.t,E=WQ.esc,X=o=>E(t(o));
const get=id=>LABS.find(l=>l.id===id);
const stars=n=>"★".repeat(n)+"☆".repeat(3-n);
const supCls={light:"go",close:"warn",adult:"red"};
const tagList=(l,cls="tag")=>[
 `<span class="${cls}">${X(T.ages)} ${l.min}+</span>`,`<span class="${cls}">⏱ ${X(l.time)}</span>`,
 `<span class="${cls}" aria-label="${X(T.diff)} ${l.diff} ${X(T.of3)}">${X(T.diff)} ${stars(l.diff)}</span>`,
 `<span class="${cls} ${supCls[l.sup]}">${X(T.sup[l.sup])}</span>`,l.heat?`<span class="${cls} red">🔥 ${X(T.heat)}</span>`:"",
 ...l.sdgs.map(n=>`<span class="${cls} lb-sdg">SDG ${n}</span>`)].join(" ");
const costH=l=>X(l.cost);
const noteH=s=>`<div class="note ${s.lv}">${s.lv==="danger"?"⛔":"⚠️"} ${X(s)}</div>`;
const credit=()=>X(T.credit);
const gateH=l=>GATE[l.id]?`<p class="note warn lb-gate"><b>🧒 ${X(T.gate)}:</b> ${X(GATE[l.id])}</p>`:"";
/* pixel cover from WQ.labCovers (art agent); returns false when unavailable so the emoji stays */
const cover=(slot,id)=>{try{const c=document.createElement("canvas");if(!(WQ.labCovers&&WQ.labCovers.draw(c,id)))return;c.className="lb-cov";c.setAttribute("aria-hidden","true");slot.replaceWith(c);}catch(e){}};
const tbl=l=>l.table?`<div class="tablewrap lb-tbl"><table class="tbl"><thead><tr>${l.table.head.map(h=>`<th>${X(h)}</th>`).join("")}</tr></thead><tbody>${l.table.rows.map(r=>`<tr>${r.map(c=>`<td>${X(c)}</td>`).join("")}</tr>`).join("")}</tbody></table><p class="small muted">${X(l.table.note)}</p></div>`:"";

LABS.forEach(l=>{ l.ages=l.min+"+"; WQ.labs.push(l);
 WQ.addBadge("lab-"+l.id,{icon:l.badge.icon,name:l.badge.name,desc:{en:"Made: "+l.title.en,bm:"Siap: "+l.title.bm}}); });

/* ---------- gallery: #/labs */
const AGE={all:99,"79":9,"1012":12,"13":99};
WQ.registerPage("labs",{mount(el){
 const f=Object.assign({a:"all",t:"any",h:"any"},WQ.store.getJSON("labs-f",{}));
 const seg=(k,label,opts)=>`<div class="lb-seg" role="group" aria-label="${X(label)}"><b>${X(label)}</b>${opts.map(([v,o])=>`<button data-f="${k}" data-v="${v}" aria-pressed="${f[k]===v}">${X(o)}</button>`).join("")}</div>`;
 const render=focus=>{
  const show=LABS.filter(l=>l.min<=AGE[f.a]&&(f.t==="any"||l.mins<=+f.t)&&(f.h==="any"||(f.h==="yes")===l.heat));
  const got=LABS.filter(l=>WQ.has("lab-"+l.id)).length;
  el.innerHTML=WQ.head("🧪",T.labsT,T.labsS)+
   `<div class="progress lb-prog"><span class="pill">🏅 ${got}/${LABS.length} ${X(T.made)}</span><div class="meter"><i style="width:${got/LABS.length*100}%"></i></div></div>
   <p class="note warn small">${X(T.safeHint)}</p>
   <div class="lb-filters">${seg("a",T.fAge,[["all",T.all],["79",T.a79],["1012",T.a1012],["13",T.a13]])}${seg("t",T.fTime,[["any",T.any],["45",T.t45],["90",T.t90]])}${seg("h",T.fHeat,[["any",T.any],["no",T.noHeat],["yes",T.heat]])}</div>
   <h2 class="vh">${X(T.allLabs)}</h2><div class="grid">${show.map(l=>{const has=WQ.has("lab-"+l.id);return `<a class="card tile lb-card" href="#/lab/${l.id}">${has?`<span class="done" title="${X(T.earned)}">✅</span>`:""}<span class="ti" aria-hidden="true" data-cov="${l.id}">${l.icon}</span><h3>${X(l.title)}</h3><p>${X(l.hook)}</p>
    <span class="lb-tags"><span class="tag">${X(T.ages)} ${l.min}+</span><span class="tag">⏱ ${l.mins} min</span>${l.heat?`<span class="tag red">🔥 ${X(T.heat)}</span>`:""}<span class="tag ${has?"go":""}">${has?"✅":"🏅"} ${X(l.badge.name)}</span></span></a>`;}).join("")||`<p class="card">${X(T.none)}</p>`}</div>`;
  WQ.$$("[data-cov]",el).forEach(s=>cover(s,s.dataset.cov));
  WQ.$$("[data-f]",el).forEach(b=>b.onclick=()=>{f[b.dataset.f]=b.dataset.v;WQ.store.setJSON("labs-f",f);render(b.dataset.f+b.dataset.v);});
  if(focus){const b=WQ.$$("[data-f]",el).find(x=>x.dataset.f+x.dataset.v===focus);b&&b.focus();}
 };
 render();
}});

/* ---------- single lab: #/lab/<id>  and  #/lab/<id>/print */
let autoPrint=false;
const listH=(items,key,done,x)=>{let n=0;return `<ul class="lb-list">${items.map((it,i)=>it.h?`<li class="lb-h">${X(it.h)}</li>`:
 `<li><label class="lb-tick"><input type="checkbox" data-k="${key}" data-i="${i}"${done.includes(i)?" checked":""}>${key==="s"?`<span class="lb-n">${++n}</span>`:""}<span>${X(it)}${x&&it.x?`<span class="lb-x">${X(it.x)}</span>`:""}</span></label></li>`).join("")}</ul>`;};
const count=items=>items.filter(i=>!i.h).length;

WQ.registerPage("lab",{mount(el,{args}){
 const l=get(args[0]);
 if(!l){el.innerHTML=`<div class="card">${X(T.nf)} <a href="#/labs">${X(T.allLabs)}</a></div>`;return;}
 if(args[1]==="print") return worksheet(el,l);
 const key="lab-"+l.id, st=Object.assign({m:[],s:[]},WQ.store.getJSON(key,{})), x=WQ.aud!=="kids";
 const lvl=WQ.aud==="kids"?"kids":WQ.aud==="teens"?"teens":"adults";
 const i=LABS.indexOf(l), prev=LABS[i-1], next=LABS[i+1];
 const render=()=>{
  const when=WQ.earned()[key];
  el.innerHTML=WQ.head(l.icon,l.title,l.hook)+`<span data-cov="${l.id}" hidden></span><div class="lb-chips">${tagList(l)}</div>${gateH(l)}
  ${when?`<p class="note ok">🏅 ${X(T.madeOn)} ${E(new Date(when).toLocaleDateString(WQ.lang==="bm"?"ms-MY":"en-GB",{day:"numeric",month:"long",year:"numeric"}))}. ${l.badge.icon} ${X(l.badge.name)}</p>`:""}
  <section class="card"><dl class="lb-meta"><div><dt>${X(T.waste)}</dt><dd>${X(l.waste)}</dd></div><div><dt>${X(T.product)}</dt><dd>${X(l.product)}</dd></div><div><dt>${X(T.cost)}</dt><dd>${costH(l)}</dd></div></dl></section>
  <section class="card lb-sec"><h2>🌏 ${X(T.why)}</h2><div class="lb-why"><div><h3>🌍 ${X(T.env)}</h3><p>${X(l.why.env)}</p></div><div><h3>💰 ${X(T.econ)}</h3><p>${X(l.why.econ)}</p></div><div><h3>🤝 ${X(T.soc)}</h3><p>${X(l.why.soc)}</p></div></div></section>
  <section class="card lb-sec noprint"><h2>🎬 ${X(T.video)}</h2>${V2.has(l.id)?`<div class="lb-vid" id="lbVid"><video controls preload="none" playsinline poster="assets/videos/v2/${l.id}.jpg" src="assets/videos/v2/${l.id}_${WQ.lang==="bm"?"bm":"en"}.mp4" title="${X(l.title)}"></video></div>
   <p class="small muted">${X(T.vidLocal)}</p>`:l.video?`<div class="lb-vid" id="lbVid"><video controls preload="none" playsinline poster="assets/videos/${l.id}.jpg" src="assets/videos/${l.id}.mp4" title="${X(l.title)}"></video></div>
   <p class="small muted">${l.id==="litmus"?X(T.vidLitmus)+" ":""}${X(T.vidLocal)}</p>`:`<p>🎬 <b>${X(T.soon)}</b></p><p class="small muted">${X(T.soonN)}</p>`}</section>
  <section class="card lb-sec"><h2>🧺 ${X(T.mats)} <span class="lb-cnt muted" id="lbMc"></span></h2>${listH(l.mats,"m",st.m,x)}${tbl(l)}</section>
  <section class="card lb-sec"><h2>🪜 ${X(T.steps)} <span class="lb-cnt muted" id="lbSc"></span></h2>${listH(l.steps,"s",st.s,x)}
   ${l.code&&x?`<details class="lb-code"><summary>💻 ${X(T.code)}</summary><pre class="lb-pre">${E(l.code)}</pre></details>`:""}</section>
  <section class="card lb-sec"><h2>🦺 ${X(T.safety)}</h2><div class="lb-stack">${l.safety.map(noteH).join("")}</div></section>
  <section class="card lb-sec"><h2>🔬 ${X(T.sci)} <span class="tag">${X(T.lvl[lvl])}</span></h2><p>${X(WQ.pick(l.sci))}</p><p class="small muted noprint">${X(T.lvlHint)}</p></section>
  ${WQ.aud==="teacher"?`<section class="card lb-sec"><h2>🧑‍🏫 ${X(T.teach)}</h2><p>${X(l.teach)}</p></section>`:""}
  <section class="card lb-sec"><h2>🚀 ${X(T.ext)}</h2><ol>${l.ext.map(e=>`<li>${X(e)}</li>`).join("")}</ol></section>
  <section class="card lb-sec"><h2>💭 ${X(T.refl)}</h2><ul>${l.refl.map(e=>`<li>${X(e)}</li>`).join("")}</ul></section>
  <section class="card lb-sec"><h2>🖼️ ${X(T.posters)}</h2>${l.posters.length?`<div class="lb-posters">${l.posters.map((p,j)=>`<button class="lb-thumb" data-p="${j}" aria-label="${X(T.open)}: ${X(p.cap)}"><img src="${p.src}" alt="" loading="lazy"><span>${X(p.cap)}</span></button>`).join("")}</div>`:""}<p class="small muted">${credit(l)}</p></section>
  <div class="row noprint lb-actions"><button class="btn" id="lbMade"${when?" disabled":""}>${when?"✅ "+X(T.earned):"🎉 "+X(T.madeIt)}</button><button class="btn blue" id="lbPrint">🖨️ ${X(T.print)}</button><button class="btn alt" id="lbReset">↺ ${X(T.reset)}</button></div>
  <nav class="lb-nav noprint" aria-label="${X(T.allLabs)}">${prev?`<a class="btn alt" href="#/lab/${prev.id}">← ${X(T.prev)}: ${prev.icon}</a>`:"<span></span>"}<a class="btn alt" href="#/labs">🧪 ${X(T.allLabs)}</a>${next?`<a class="btn alt" href="#/lab/${next.id}">${X(T.next)}: ${next.icon} →</a>`:"<span></span>"}</nav>
  <dialog class="lb-dlg" id="lbDlg" aria-label="${X(T.posters)}"><figure><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption></figure>
   <div class="row lb-dlgbar"><button class="btn alt" data-d="-1" aria-label="${X(T.pImg)}">←</button><button class="btn alt" data-d="1" aria-label="${X(T.nImg)}">→</button><button class="btn" data-d="0">${X(T.close)}</button></div></dialog>`;
  const cs=WQ.$("[data-cov]",el);if(cs)cover(cs,l.id);
  const counts=()=>{WQ.$("#lbMc",el).textContent=`${st.m.length}/${count(l.mats)}`;WQ.$("#lbSc",el).textContent=`${st.s.length}/${count(l.steps)}`;};
  counts();
  WQ.$$("input[data-k]",el).forEach(c=>c.onchange=()=>{const a=st[c.dataset.k],n=+c.dataset.i,j=a.indexOf(n);
   if(c.checked&&j<0)a.push(n);else if(!c.checked&&j>=0)a.splice(j,1);WQ.store.setJSON(key,st);counts();});
  const vid=WQ.$("#lbVid video",el);
  if(vid)vid.addEventListener("play",()=>WQ.track("video/"+l.id),{once:true});
  if(vid)vid.addEventListener("error",()=>{WQ.$("#lbVid",el).outerHTML=`<p class="note warn">🎬 ${X(T.vidMissing)}</p>`;});
  WQ.$("#lbMade",el).onclick=()=>{if(WQ.award(key)){WQ.beep(true);render();}};
  WQ.$("#lbPrint",el).onclick=()=>{autoPrint=true;WQ.go(`lab/${l.id}/print`);};
  WQ.$("#lbReset",el).onclick=()=>{st.m=[];st.s=[];WQ.store.setJSON(key,st);render();};
  const dlg=WQ.$("#lbDlg",el);let cur=0;
  const show=j=>{cur=(j+l.posters.length)%l.posters.length;const p=l.posters[cur];WQ.$("#lbImg",el).src=p.src;WQ.$("#lbImg",el).alt=t(p.cap);WQ.$("#lbCap",el).textContent=`${t(p.cap)} (${cur+1}/${l.posters.length})`;};
  WQ.$$("[data-p]",el).forEach(b=>b.onclick=()=>{show(+b.dataset.p);dlg.showModal();});
  WQ.$$("[data-d]",dlg).forEach(b=>b.onclick=()=>{const d=+b.dataset.d;d?show(cur+d):dlg.close();});
  dlg.onclick=e=>{if(e.target===dlg)dlg.close();};
  dlg.onkeydown=e=>{if(e.key==="ArrowRight")show(cur+1);else if(e.key==="ArrowLeft")show(cur-1);};
 };
 render();
}});

/* printable worksheet for children (route #/lab/<id>/print) */
function worksheet(el,l){
 const x=WQ.aud!=="kids";let n=0;
 const blank=lbls=>`<div class="lb-wsf">${lbls.map(s=>`<span>${X(s)}:</span>`).join("")}</div>`;
 el.innerHTML=`<div class="row noprint lb-wsbar"><button class="btn" id="wsP">🖨️ ${X(T.printNow)}</button><a class="btn alt" href="#/lab/${l.id}">← ${X(T.backLab)}</a></div>
 <article class="lb-ws"><div class="lb-wsk">WasteQuest · ${X(T.wsT)}</div><h1>${l.icon} ${X(l.title)}</h1><p>${X(l.hook)}</p>
  ${blank([T.name,T.cls,T.date])}
  <p class="small">${X(T.ages)} ${l.min}+ · ⏱ ${X(l.time)} · ${X(T.sup[l.sup])}${l.heat?" · 🔥 "+X(T.heat):""}</p>${gateH(l)}
  <h2>🧺 ${X(T.mats)}</h2><ul class="lb-wsl">${l.mats.map(m=>m.h?`<li class="lb-h">${X(m.h)}</li>`:`<li>☐ ${X(m)}</li>`).join("")}</ul>
  <h2>🪜 ${X(T.steps)}</h2><ul class="lb-wsl">${l.steps.map(s=>s.h?`<li class="lb-h">${X(s.h)}</li>`:`<li>☐ <b>${++n}.</b> ${X(s)}${x&&s.x?`<span class="lb-x">${X(s.x)}</span>`:""}</li>`).join("")}</ul>
  <h2>🦺 ${X(T.safety)}</h2><div class="lb-stack">${l.safety.map(noteH).join("")}</div>
  <h2>💭 ${X(T.refl)}</h2>${l.refl.map(q=>`<div class="lb-q"><b>${X(q)}</b><div class="lb-ln"></div><div class="lb-ln"></div></div>`).join("")}
  <h2>✏️ ${X(T.result)}</h2><div class="lb-box"></div>
  <div class="lb-sign"><b>🧑‍🏫 ${X(T.sign)}</b><div>☐ ${X(T.sSafe)} &nbsp; ☐ ${X(T.sMade)}</div>${blank([T.tName,T.sig,T.date])}</div>
 </article>`;
 WQ.$("#wsP",el).onclick=()=>print();
 if(autoPrint){autoPrint=false;const id=setTimeout(()=>print(),400);return()=>clearTimeout(id);}
}

/* Zero-Plastic Hero showcase removed in v2 (no student groups/links; its 5 labs stay). Stub kept so booklet.html does not break. */
WQ.renderZphPrint=el=>{if(el)el.remove();};

/* static A4 version for the PDF booklet */
WQ.renderLabPrint=(el,id)=>{
 const l=get(id);if(!l||!el)return;let n=0;const p=l.posters[0];
 el.innerHTML=`<article class="lbp">
  <h2 class="lbp-t"><span aria-hidden="true">${l.icon}</span> ${X(l.title)}</h2><p class="lbp-hook">${X(l.hook)}</p>
  <div class="lbp-chips">${tagList(l,"lbp-c")}</div>${gateH(l)}
  <p class="lbp-meta"><b>${X(T.waste)}:</b> ${X(l.waste)} · <b>${X(T.product)}:</b> ${X(l.product)} · <b>${X(T.cost)}:</b> ${costH(l)}</p>
  ${p?`<figure class="lbp-fig"><img src="${p.src}" alt="${X(p.cap)}"><figcaption>${X(p.cap)}. ${credit(l)}</figcaption></figure>`:""}
  <h3>${X(T.why)}</h3><p><b>🌍 ${X(T.env)}:</b> ${X(l.why.env)}</p><p><b>💰 ${X(T.econ)}:</b> ${X(l.why.econ)}</p><p><b>🤝 ${X(T.soc)}:</b> ${X(l.why.soc)}</p>
  <h3>${X(T.mats)}</h3><ul>${l.mats.map(m=>m.h?`<li class="lbp-h">${X(m.h)}</li>`:`<li>${X(m)}</li>`).join("")}</ul>${tbl(l)}
  <h3>${X(T.steps)}</h3><ol class="lbp-steps">${l.steps.map(s=>s.h?`<li class="lbp-h">${X(s.h)}</li>`:`<li><span class="lbp-n">${++n}.</span><span>${X(s)}${s.x?`<span class="lbp-x">${X(s.x)}</span>`:""}</span></li>`).join("")}</ol>
  ${l.code?`<p><b>${X(T.code)} (${X(T.teenL)})</b></p><pre>${E(l.code)}</pre>`:""}
  <h3>${X(T.safety)}</h3>${l.safety.map(noteH).join("")}
  <h3>${X(T.sci)}</h3><p><b>${X(T.teenL)}:</b> ${X(l.sci.teens)}</p><p><b>${X(T.adultL)}:</b> ${X(l.sci.adults)}</p>
  <h3>${X(T.teach)}</h3><p>${X(l.teach)}</p>
  <h3>${X(T.ext)}</h3><ol>${l.ext.map(e=>`<li>${X(e)}</li>`).join("")}</ol>
  <h3>${X(T.refl)}</h3><ul>${l.refl.map(e=>`<li>${X(e)}</li>`).join("")}</ul>
  <p class="lbp-vid"><b>🎬 ${X(T.vid)}:</b> ${l.video||V2.has(l.id)?`wastequest.github.io/#/lab/${l.id}`:X(T.soon)}${p?"":` · ${credit(l)}`}</p>
 </article>`;
};

WQ.css("labs",`
.lbp-vid{overflow-wrap:anywhere}
.lb-prog{margin:-4px 0 12px}
.lb-cov{display:block;width:100%;height:auto;aspect-ratio:8/5;image-rendering:pixelated;border:3px solid #1a1932;background:#0098dc;margin:-4px 0 12px;max-width:480px}
.lb-card .lb-cov{margin:0 0 6px;max-width:none}
.lb-gate{margin:0 0 14px}
.card.lb-card{margin-top:0}
.lb-filters{display:flex;flex-wrap:wrap;gap:10px 22px;margin:12px 0 16px}
.lb-seg{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.lb-seg b{font-family:"Baloo 2";margin-right:2px}
.lb-seg button{background:#fff;border:3px solid transparent;border-radius:999px;padding:5px 12px;font-weight:800;box-shadow:var(--shadow)}
.lb-seg button[aria-pressed=true]{border-color:var(--grass);background:#eafbe4}
.lb-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:auto;padding-top:6px}
.lb-chips{display:flex;flex-wrap:wrap;gap:6px;margin:-6px 0 14px}
.lb-sdg{background:#e6f0ff;color:var(--blue)}
.lb-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:10px 20px;margin:0}
.lb-meta dt{font-weight:800;color:var(--muted);font-size:.85rem}
.lb-meta dd{margin:0}
.lb-sec h2{font-size:1.4rem;margin-bottom:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.lb-cnt{font-family:Nunito,sans-serif;font-size:.9rem;margin-left:auto}
.lb-why{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))}
.lb-why>div{background:var(--soft);border-radius:16px;padding:12px 14px}
.lb-why h3{font-size:1.1rem}
.lb-list{list-style:none;margin:0;padding:0}
.lb-list li+li{margin-top:6px}
.lb-h{font-family:"Baloo 2",sans-serif;font-weight:800;font-size:1.1rem;color:var(--grass-d);margin-top:14px!important}
.lb-tick{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:12px;background:var(--soft);cursor:pointer;overflow-wrap:anywhere}
.lb-tick input{width:22px;height:22px;flex:none;margin:2px 0 0;accent-color:var(--grass)}
.lb-tick:has(input:checked){background:#eafbe4}
.lb-tick:has(input:checked)>span:last-child{opacity:.6}
.lb-n{flex:none;width:26px;height:26px;border-radius:50%;background:#1e6f50;color:#fff;font-weight:800;display:grid;place-items:center;font-size:.9rem}
.lb-x{display:block;color:var(--muted);font-size:.9rem;margin-top:3px}
.lb-x:before{content:"🔬 "}
.lb-stack>*+*{margin-top:8px}
.lb-tbl{margin-top:12px}
.lb-code{margin-top:12px}
.lb-code summary{font-weight:800;cursor:pointer}
.lb-pre{background:#10243a;color:#e8f1ff;border-radius:12px;padding:12px;overflow-x:auto;font-size:.82rem;line-height:1.4}
.lb-vid{background:#000;border-radius:16px;overflow:hidden;max-width:720px}
.lb-vid video{display:block;width:100%;height:auto;max-height:75vh;background:#000}
.lb-posters{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));margin-bottom:8px}
.lb-thumb{display:flex;flex-direction:column;gap:4px;text-align:left;background:var(--soft);border-radius:14px;padding:6px;font-size:.85rem;font-weight:700}
.lb-thumb img{width:100%;height:150px;object-fit:cover;object-position:top;border-radius:10px}
.lb-actions{margin-top:18px}
.lb-nav{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:18px}
.lb-dlg{border:0;border-radius:18px;padding:12px;width:min(96vw,1100px);max-width:none;box-shadow:var(--shadow)}
.lb-dlg::backdrop{background:rgba(10,20,35,.78)}
.lb-dlg figure{margin:0}
.lb-dlg img{display:block;max-height:74vh;max-width:100%;margin:0 auto;border-radius:10px}
.lb-dlg figcaption{text-align:center;font-weight:700;margin:6px 0}
.lb-dlgbar{justify-content:center}
.lb-wsbar{margin-bottom:12px}
.lb-ws{background:#fff;border-radius:var(--radius);padding:20px 24px;box-shadow:var(--shadow);max-width:820px;margin:0 auto;overflow-wrap:anywhere}
.lb-ws h1{font-size:1.8rem}
.lb-ws h2{font-size:1.2rem;margin:16px 0 6px;border-bottom:2px solid var(--grass);padding-bottom:2px;break-after:avoid}
.lb-wsk{font-weight:800;color:var(--grass-d);text-transform:uppercase;font-size:.8rem;letter-spacing:.05em}
.lb-wsf{display:flex;flex-wrap:wrap;gap:8px 20px;margin:12px 0}
.lb-wsf span{flex:1 1 150px;border-bottom:1.5px solid #777;padding-top:16px;font-weight:700}
.lb-wsl{list-style:none;margin:0;padding:0}
.lb-wsl li{margin:4px 0;break-inside:avoid}
.lb-q{break-inside:avoid;margin:8px 0 14px}
.lb-ln{border-bottom:1px solid #999;height:2em}
.lb-box{border:1.5px solid #777;border-radius:10px;height:120px}
.lb-sign{border:2px solid var(--ink);border-radius:12px;padding:10px 14px;margin-top:18px;break-inside:avoid}
.lbp{font-size:10pt;line-height:1.42;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact;overflow-wrap:anywhere}
.lbp .lbp-t{font-size:19pt;color:var(--grass-d);border-bottom:3px solid var(--grass);padding-bottom:2px;margin:0 0 3px}
.lbp h3{font-size:12.5pt;margin:9px 0 3px;break-after:avoid}
.lbp p{margin:2px 0 4px}
.lbp-hook{font-style:italic;color:var(--muted)}
.lbp-chips{display:flex;flex-wrap:wrap;gap:3px 5px;margin:4px 0}
.lbp-c{border:1px solid #b8c4d0;border-radius:99px;padding:0 7px;font-size:8.5pt;font-weight:700}
.lbp-c.red{border-color:var(--red);color:var(--red)}.lbp-c.warn{border-color:var(--orange);color:#9a5b00}.lbp-c.go{border-color:var(--grass);color:var(--grass-d)}.lbp-c.lb-sdg{border-color:var(--blue);color:var(--blue);background:none}
.lbp-meta{font-size:9.3pt}
.lbp-fig{float:right;width:42%;margin:4px 0 6px 12px;break-inside:avoid}
.lbp-fig img{width:100%;border:1px solid var(--line);border-radius:6px}
.lbp-fig figcaption{font-size:7.5pt;color:var(--muted)}
.lbp ul,.lbp ol{margin:2px 0 4px;padding-left:18px}
.lbp li{margin:1px 0;break-inside:avoid}
.lbp .lbp-steps{list-style:none;padding-left:0}
.lbp-steps li{display:flex;gap:6px}
.lbp-n{flex:none;font-weight:800;color:var(--grass-d);min-width:18px}
.lbp .lbp-h{font-weight:800;color:var(--grass-d);margin-top:5px;list-style:none;margin-left:-18px}
.lbp-steps .lbp-h{margin-left:0}
.lbp-x{display:block;font-size:8.8pt;color:var(--muted)}
.lbp .note{padding:3px 8px;margin:3px 0;border-radius:6px;font-size:9.3pt;break-inside:avoid}
.lbp pre{font-size:7.5pt;border:1px solid var(--line);padding:6px;border-radius:6px;white-space:pre-wrap;break-inside:avoid}
.lbp .tbl{font-size:8.8pt;width:auto}.lbp .tbl th,.lbp .tbl td{padding:2px 8px}.lbp .tablewrap{overflow:visible}
.lbp-vid{margin-top:8px;font-size:9pt;border-top:1px solid var(--line);padding-top:4px;clear:both}
@media print{.lb-ws{box-shadow:none;padding:0;max-width:none;font-size:10.5pt;border-radius:0}.lb-ws .note,.lb-tick{-webkit-print-color-adjust:exact;print-color-adjust:exact}.lb-sec{break-inside:auto}}
`);
})();
