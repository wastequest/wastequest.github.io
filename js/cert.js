/* Badges & Certificate hub (#/cert).
   Routes: #/cert · #/cert/quest/<track> · #/cert/get/<track> · #/cert/pitch
   Tracks, pass marks and requirements match SPEC.md (shared with teacher.js). Everything is stored on this device only. */
(() => {
const TRACKS = {
  junior: { aud: "kids", icon: "🌱", color: "#2e8b22", n: 10, pass: 70,
    name: { en: "Junior Eco-Hero", bm: "Wira Eko Junior" }, short: { en: "Junior Eco-Hero", bm: "Wira Eko Junior" },
    who: { en: "Kids 7–12", bm: "Kanak-kanak 7–12" }, level: { en: "Primary level · ages 7–12", bm: "Tahap sekolah rendah · umur 7–12" } },
  champion: { aud: "teens", icon: "🏆", color: "#1f6fd1", n: 15, pass: 75,
    name: { en: "Zero-Waste Champion", bm: "Juara Sifar Sisa" }, short: { en: "Zero-Waste Champion", bm: "Juara Sifar Sisa" },
    who: { en: "Teens 13–17", bm: "Remaja 13–17" }, level: { en: "Secondary level · ages 13–17", bm: "Tahap sekolah menengah · umur 13–17" } },
  practitioner: { aud: "adults", icon: "🎓", color: "#a50d26", n: 20, pass: 80,
    name: { en: "Waste-to-Wealth Practitioner (micro-credential, proposed)", bm: "Pengamal Sisa kepada Kekayaan (mikro-kredensial, cadangan)" },
    short: { en: "Waste-to-Wealth Practitioner", bm: "Pengamal Sisa kepada Kekayaan" },
    who: { en: "Adults", bm: "Dewasa" }, level: { en: "Proposed micro-credential · 20 notional learning hours (0.5 credit)", bm: "Mikro-kredensial cadangan · 20 jam pembelajaran nosional (0.5 kredit)" } }
};
Object.entries(TRACKS).forEach(([id, t]) => WQ.addBadge("cert-" + id, { icon: t.icon, name: t.short,
  desc: { en: "Certificate earned", bm: "Sijil diperoleh" } }));

const SDGS = [["No poverty","Tiada kemiskinan"],["Zero hunger","Sifar kelaparan"],["Good health and well-being","Kesihatan dan kesejahteraan yang baik"],["Quality education","Pendidikan berkualiti"],
  ["Gender equality","Kesaksamaan gender"],["Clean water and sanitation","Air bersih dan sanitasi"],["Affordable and clean energy","Tenaga mampu milik dan bersih"],["Decent work and economic growth","Pekerjaan wajar dan pertumbuhan ekonomi"],
  ["Industry, innovation and infrastructure","Industri, inovasi dan infrastruktur"],["Reduced inequalities","Mengurangkan ketidaksamaan"],["Sustainable cities and communities","Bandar dan komuniti mampan"],["Responsible consumption and production","Penggunaan dan pengeluaran bertanggungjawab"],
  ["Climate action","Tindakan iklim"],["Life below water","Kehidupan di bawah air"],["Life on land","Kehidupan di darat"],["Peace, justice and strong institutions","Keamanan, keadilan dan institusi yang kukuh"],["Partnerships for the goals","Perkongsian untuk matlamat"]];

const T = {
 en:{title:"Badges & Certificate",sub:"Collect badges, pass the final quest and print your certificate.",device:"Progress and certificates are saved on this device only.",
  forYou:"For you",badges:"badges earned",seeBadges:"See all badges",
  rQuest:(n,p)=>`Final quest: ${n} questions, pass mark ${p}%`,rGame:"Game badges",rAll:"Badges (any)",rLab:"Lab badges",rPitch:"W2W product pitch (portfolio)",
  last:(p,d)=>`Last attempt: ${p}% on ${d}`,passed:(p,d)=>`Passed with ${p}% on ${d}`,notYet:"Not attempted yet",
  take:"Take the final quest",get:"🎓 Get my certificate",toGo:"Still to do",play:"Play games →",labs:"Go to labs →",pitch:"Open the pitch form →",retake:"Take the quest →",
  mc:"Proposed micro-credential: 20 notional learning hours (0.5 credit, where 1 Malaysian credit = 40 hours), designed with reference to the MQA Guidelines to Good Practices: Micro-credentials (2020). It is a pilot and not yet a formal qualification.",
  // quest
  qT:t=>`Final quest: ${t}`,qInfo:(n,p)=>`${n} questions · no timer · pass mark ${p}%. Each answer is locked once you choose it. You see the results and explanations at the end.`,
  qOf:(i,n)=>`Question ${i} of ${n}`,next:"Next ▶",finish:"Finish and see results ▶",locked:"Answer locked.",
  resT:"Your results",pass:"Passed! 🎉",fail:"Not passed yet",need:p=>`You need ${p}% to pass.`,again:"Try again",practise:"Practise in Eco Quiz Blast",hub:"Back to certificates",
  yours:"Your answer",correct:"Correct answer",all:"All questions",
  failMsg:{kids:"Good try! Every hero practises. Play the quiz game, then come back. You can do it! 💪",other:"Review the explanations below, practise in Eco Quiz Blast and try again. A fresh set of questions is drawn each time."},
  // get certificate
  noPass:"You haven’t passed the final quest for this track yet.",missT:"Almost there! Here’s what is still missing:",
  kidsCheer:n=>`You passed the quest. Brilliant! 🌟 Earn ${n} more game badge${n===1?"":"s"} and your certificate is yours. Try one of these:`,
  nameL:"Learner’s full name (as it should appear)",orgL:"School or organisation (optional)",make:"Create certificate",edit:"Change name",
  making:"Preparing your certificate…",dl:"⬇️ Download PNG",print:"🖨️ Print / Save PDF",code:"Verification code",
  noImg:"Logos could not be drawn (open the site through a web server to include them).",
  // pitch
  pT:"W2W Product Pitch",pS:"Practitioner portfolio · saved on this device",pName:"Your name",pProd:"Product name",pWaste:"Waste stream used",
  pKg:"Waste diverted per month (kg, estimate)",pCust:"Target customers",pCost:"Unit cost (RM)",pPrice:"Selling price (RM)",pMargin:"Profit and margin (auto)",
  pSdg:"SDG links (tick all that apply)",pSafe:"Safety considerations (hazards and how you control them)",
  perUnit:"profit per unit",margin:"margin",loss:"Selling below cost: every unit loses money. Raise the price or cut costs.",
  done:"✅ Complete: your pitch counts as submitted. Print the sheet and ask your facilitator to verify it.",left:n=>`${n} field${n===1?"":"s"} still empty. All fields are needed for the pitch to count as submitted.`,
  pPrint:"🖨️ Print portfolio sheet",perYear:"per year",fac:"Facilitator verification",facName:"Facilitator name",sign:"Signature",date:"Date",
  chk1:"Pitch presented",chk2:"Costs checked",chk3:"Safety reviewed",sheetT:"Waste-to-Wealth Practitioner · Portfolio sheet: W2W Product Pitch",
  // verify
  vT:"Verify a certificate",vS:"Type the details exactly as printed on the certificate.",vName:"Name",vTrack:"Track",vDate:"Date",vScore:"Score (%)",vCode:"Verification code",vBtn:"Check",
  vOk:"✅ The code matches these details.",vBad:"❌ The code does not match these details. Check the spelling, date and score.",
  vNote:"This check recomputes the code from the details. WasteQuest has no central register; for formal confirmation contact the module lead.",
  sigRole:"Module Lead, Faculty of Engineering, UPM"},
 bm:{title:"Lencana & Sijil",sub:"Kumpul lencana, lulus misi akhir dan cetak sijil anda.",device:"Kemajuan dan sijil disimpan pada peranti ini sahaja.",
  forYou:"Untuk anda",badges:"lencana diperoleh",seeBadges:"Lihat semua lencana",
  rQuest:(n,p)=>`Misi akhir: ${n} soalan, markah lulus ${p}%`,rGame:"Lencana permainan",rAll:"Lencana (apa-apa)",rLab:"Lencana makmal",rPitch:"Pembentangan produk W2W (portfolio)",
  last:(p,d)=>`Cubaan terakhir: ${p}% pada ${d}`,passed:(p,d)=>`Lulus dengan ${p}% pada ${d}`,notYet:"Belum dicuba",
  take:"Ambil misi akhir",get:"🎓 Dapatkan sijil saya",toGo:"Perlu diselesaikan",play:"Main permainan →",labs:"Ke makmal →",pitch:"Buka borang pembentangan →",retake:"Ambil misi →",
  mc:"Mikro-kredensial cadangan: 20 jam pembelajaran nosional (0.5 kredit, dengan 1 kredit Malaysia = 40 jam), direka bentuk dengan merujuk Garis Panduan Amalan Baik MQA: Mikro-kredensial (2020). Ia masih perintis dan belum menjadi kelayakan rasmi.",
  qT:t=>`Misi akhir: ${t}`,qInfo:(n,p)=>`${n} soalan · tiada had masa · markah lulus ${p}%. Jawapan dikunci sebaik sahaja dipilih. Keputusan dan penerangan dipaparkan di akhir.`,
  qOf:(i,n)=>`Soalan ${i} daripada ${n}`,next:"Seterusnya ▶",finish:"Tamat dan lihat keputusan ▶",locked:"Jawapan dikunci.",
  resT:"Keputusan anda",pass:"Lulus! 🎉",fail:"Belum lulus",need:p=>`Anda perlu ${p}% untuk lulus.`,again:"Cuba lagi",practise:"Berlatih dalam Kuiz Kilat Eko",hub:"Kembali ke sijil",
  yours:"Jawapan anda",correct:"Jawapan betul",all:"Semua soalan",
  failMsg:{kids:"Cubaan yang bagus! Setiap wira perlu berlatih. Main permainan kuiz, kemudian kembali. Anda boleh! 💪",other:"Semak penerangan di bawah, berlatih dalam Kuiz Kilat Eko dan cuba lagi. Set soalan baharu dipilih setiap kali."},
  noPass:"Anda belum lulus misi akhir bagi laluan ini.",missT:"Hampir berjaya! Ini yang masih belum lengkap:",
  kidsCheer:n=>`Anda lulus misi. Hebat! 🌟 Dapatkan ${n} lagi lencana permainan dan sijil itu milik anda. Cuba salah satu ini:`,
  nameL:"Nama penuh pelajar (seperti yang mahu dicetak)",orgL:"Sekolah atau organisasi (pilihan)",make:"Hasilkan sijil",edit:"Tukar nama",
  making:"Menyediakan sijil anda…",dl:"⬇️ Muat turun PNG",print:"🖨️ Cetak / Simpan PDF",code:"Kod pengesahan",
  noImg:"Logo tidak dapat dilukis (buka laman melalui pelayan web untuk memasukkannya).",
  pT:"Pembentangan Produk W2W",pS:"Portfolio pengamal · disimpan pada peranti ini",pName:"Nama anda",pProd:"Nama produk",pWaste:"Aliran sisa yang digunakan",
  pKg:"Sisa yang dialihkan sebulan (kg, anggaran)",pCust:"Pelanggan sasaran",pCost:"Kos seunit (RM)",pPrice:"Harga jualan (RM)",pMargin:"Untung dan margin (automatik)",
  pSdg:"Kaitan SDG (tandakan semua yang berkenaan)",pSafe:"Pertimbangan keselamatan (bahaya dan cara mengawalnya)",
  perUnit:"untung seunit",margin:"margin",loss:"Dijual bawah kos: setiap unit rugi. Naikkan harga atau kurangkan kos.",
  done:"✅ Lengkap: pembentangan anda dikira sebagai telah dihantar. Cetak helaian dan minta fasilitator mengesahkannya.",left:n=>`${n} ruangan masih kosong. Semua ruangan diperlukan supaya pembentangan dikira sebagai telah dihantar.`,
  pPrint:"🖨️ Cetak helaian portfolio",perYear:"setahun",fac:"Pengesahan fasilitator",facName:"Nama fasilitator",sign:"Tandatangan",date:"Tarikh",
  chk1:"Pembentangan dibuat",chk2:"Kos disemak",chk3:"Keselamatan disemak",sheetT:"Pengamal Sisa kepada Kekayaan · Helaian portfolio: Pembentangan Produk W2W",
  vT:"Sahkan sijil",vS:"Taip butiran tepat seperti yang dicetak pada sijil.",vName:"Nama",vTrack:"Laluan",vDate:"Tarikh",vScore:"Skor (%)",vCode:"Kod pengesahan",vBtn:"Semak",
  vOk:"✅ Kod sepadan dengan butiran ini.",vBad:"❌ Kod tidak sepadan dengan butiran ini. Semak ejaan, tarikh dan skor.",
  vNote:"Semakan ini mengira semula kod daripada butiran. WasteQuest tiada daftar pusat; untuk pengesahan rasmi hubungi ketua modul.",
  sigRole:"Ketua Modul, Fakulti Kejuruteraan, UPM"}
};
const C = { // certificate wording, both languages always available (primary = current language)
  en:{title:"CERTIFICATE OF COMPLETION",certify:"This is to certify that",done:"has completed the WasteQuest Waste-to-Wealth Educational Module learning track",
    score:(p,m,d)=>`Final quest score ${p}% (pass mark ${m}%) · ${d}`,code:"Verification code",
    foot:{practitioner:"Designed with reference to the MQA Guidelines to Good Practices: Micro-credentials (2020). Valid with the facilitator-verified W2W portfolio sheet.",
          other:"Issued through WasteQuest, Universiti Putra Malaysia. The code can be checked on the WasteQuest Certificate page."}},
  bm:{title:"SIJIL PENYEMPURNAAN",certify:"Dengan ini disahkan bahawa",done:"telah menamatkan laluan pembelajaran Modul Pendidikan Sisa kepada Kekayaan WasteQuest",
    score:(p,m,d)=>`Skor misi akhir ${p}% (markah lulus ${m}%) · ${d}`,code:"Kod pengesahan",
    foot:{practitioner:"Direka bentuk dengan merujuk Garis Panduan Amalan Baik MQA: Mikro-kredensial (2020). Sah bersama helaian portfolio W2W yang disahkan fasilitator.",
          other:"Dikeluarkan melalui WasteQuest, Universiti Putra Malaysia. Kod boleh disemak di halaman Sijil WasteQuest."}}
};
const SIGNER = "Prof. Ir. Dr. Wan Azlina Wan Ab Karim Ghani";

/* ---------- helpers ---------- */
const L = () => T[WQ.lang], S = WQ.store;
const pad = n => String(n).padStart(2, "0");
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fmtDate = (iso, lang = WQ.lang) => { const d = new Date(iso + "T00:00:00"); return isNaN(d) ? iso : d.toLocaleDateString(lang === "bm" ? "ms-MY" : "en-GB", { day: "numeric", month: "long", year: "numeric" }); };
const cyrb53 = (s, seed = 0) => { let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < s.length; i++) { const ch = s.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0); };
const normName = s => String(s || "").normalize("NFC").trim().replace(/\s+/g, " ").toUpperCase();
// Verification code = short hash of name|track|date|score (not a secret; it shows the printed details were not altered).
const certCode = (name, track, date, pct) => { const h = cyrb53(`${normName(name)}|${track}|${date}|${+pct}`).toString(36).toUpperCase().padStart(8, "0").slice(-8); return `WQ-${h.slice(0, 4)}-${h.slice(4)}`; };
WQ.certCode = certCode;

function status(id) {
  const t = TRACKS[id], keys = Object.keys(WQ.earned()), l = L();
  const games = keys.filter(k => WQ.games[k]).length, labs = keys.filter(k => k.startsWith("lab-")).length;
  const any = keys.filter(k => !k.startsWith("cert-") && (WQ.badges[k] || k.startsWith("lab-"))).length;
  const last = S.getJSON("cert-last-" + id, null), passRec = S.getJSON("cert-pass-" + id, null);
  const reqs = [{ key: "quest", ok: !!passRec, label: l.rQuest(t.n, t.pass), info: passRec ? l.passed(passRec.pct, fmtDate(passRec.date)) : last ? l.last(last.pct, fmtDate(last.date)) : l.notYet, link: `#/cert/quest/${id}`, go: l.retake }];
  if (id === "junior") reqs.push({ key: "games", ok: games >= 3, have: games, need: 3, label: l.rGame, link: "#/games", go: l.play });
  if (id === "champion") reqs.push({ key: "any", ok: any >= 5, have: any, need: 5, label: l.rAll, link: "#/games", go: l.play },
                                   { key: "labs", ok: labs >= 1, have: labs, need: 1, label: l.rLab, link: "#/labs", go: l.labs });
  if (id === "practitioner") reqs.push({ key: "labs", ok: labs >= 2, have: labs, need: 2, label: l.rLab, link: "#/labs", go: l.labs },
                                       { key: "pitch", ok: pitchMissing().length === 0, label: l.rPitch, link: "#/cert/pitch", go: l.pitch });
  return { reqs, passRec, last, ready: reqs.every(r => r.ok), other: reqs.filter(r => r.key !== "quest" && !r.ok), games };
}
const reqLine = r => `<li class="${r.ok ? "ok" : ""}"><span class="cr-ck" aria-hidden="true">${r.ok ? "✅" : "⬜"}</span><span><b>${WQ.esc(r.label)}</b>${r.need ? ` · ${Math.min(r.have, r.need)}/${r.need}<span class="meter cr-m"><i style="width:${Math.min(1, r.have / r.need) * 100}%"></i></span>` : ""}${r.info ? `<br><span class="small muted">${WQ.esc(r.info)}</span>` : ""}${r.ok ? "" : ` <a class="small" href="${r.link}">${r.go}</a>`}</span></li>`;

/* ---------- pitch data ---------- */
const PF = ["name", "product", "waste", "kg", "customers", "cost", "price", "safety"];
const getPitch = () => S.getJSON("cert-pitch", { sdgs: [] });
function pitchMissing(p = getPitch()) {
  const miss = PF.filter(k => ["kg", "cost", "price"].includes(k) ? !(+p[k] > 0) : !String(p[k] || "").trim());
  if (!(p.sdgs || []).length) miss.push("sdgs");
  return miss;
}
const money = n => "RM" + (Math.round(n * 100) / 100).toFixed(2);

/* ---------- printing: show only .cr-printable ---------- */
function printOnly(pageCss) {
  document.getElementById("cr-page")?.remove();
  const st = document.createElement("style"); st.id = "cr-page"; st.textContent = `@page{${pageCss}}`; document.head.appendChild(st);
  document.documentElement.classList.add("cr-p");
  const done = () => { st.remove(); document.documentElement.classList.remove("cr-p"); removeEventListener("afterprint", done); };
  addEventListener("afterprint", done);
  window.print();
}

WQ.css("cert", `
.cr-grid>.card.cr-card{margin:0}
.cr-grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.cr-card{display:flex;flex-direction:column;gap:10px;border-top:10px solid var(--c);position:relative}
.cr-card h3{font-size:1.3rem}.cr-card .ci{font-size:2.4rem;line-height:1}
.cr-card ul{list-style:none;padding:0;margin:0}.cr-card li{display:flex;gap:8px;margin:0 0 10px;align-items:flex-start}
.cr-ck{flex:none}.cr-m{display:block;height:8px;max-width:180px;margin-top:4px}
.cr-for{position:absolute;top:12px;right:14px}
.cr-card .row{margin-top:auto}
.cr-q{font-family:"Baloo 2";font-weight:800;font-size:clamp(1.25rem,3vw,1.7rem);line-height:1.2;margin:8px 0 14px}
.cr-ans{display:grid;gap:10px}.cr-ans .choice{display:flex;gap:10px;align-items:flex-start}
.cr-ans .choice b{flex:none;width:28px;height:28px;border-radius:50%;background:var(--soft);display:grid;place-items:center}
.cr-ans .choice.pick{border-color:var(--blue);background:#eef5ff}.cr-ans .choice[disabled]{cursor:default}
.cr-res li{margin:0 0 12px}
.cr-big{font-family:"Baloo 2";font-weight:800;font-size:3rem;line-height:1}
.cr-form label{display:block;font-weight:800;margin:12px 0 4px}
.cr-form input,.cr-form textarea,.cr-form select{width:100%;padding:10px 12px;border-radius:12px;border:3px solid var(--line);background:#fff}
.cr-form textarea{min-height:76px;resize:vertical}
.cr-two{display:grid;gap:0 16px;grid-template-columns:1fr 1fr}
.cr-sdgs{display:flex;flex-wrap:wrap;gap:6px}
.cr-sdgs label{display:inline-flex;align-items:center;gap:6px;margin:0;font-weight:700;font-size:.88rem;background:var(--soft);border-radius:999px;padding:5px 10px;cursor:pointer}
.cr-sdgs input{width:auto}
.cr-calc{background:var(--soft);border-radius:12px;padding:10px 12px;font-weight:700}
.cr-prev{background:#e9eef3;border-radius:16px;padding:10px}
.cr-prev img{display:block;width:100%;height:auto;border-radius:6px;box-shadow:0 4px 18px rgba(0,0,0,.18)}
.cr-sheet{display:none}
@media (max-width:560px){.cr-two{grid-template-columns:1fr}}
@media print{
  html.cr-p body{margin:0;min-height:0!important;background:#fff}
  html.cr-p body>:not(#view){display:none!important}
  html.cr-p #view{padding:0!important;margin:0!important;min-height:0!important;max-width:none!important}
  html.cr-p #view>:not(.cr-printable){display:none!important}
  html.cr-p .cr-printable{display:block!important}
  html.cr-p .cr-prev{margin:0!important;background:none;padding:5mm 0 0}
  html.cr-p .cr-prev img{width:auto;height:200mm;margin:0 auto;box-shadow:none;border-radius:0}
  html.cr-p .cr-noprint{display:none!important}
  .cr-sheet{font-size:11pt;color:#000}
  .cr-sheet h1{font-size:17pt;margin:0 0 2mm}.cr-sheet table{width:100%;border-collapse:collapse}
  .cr-sheet td,.cr-sheet th{border:1px solid #999;padding:2.2mm 3mm;text-align:left;vertical-align:top}
  .cr-sheet th{width:32%;background:#f2f5f8}
  .cr-sheet .fac{border:2px solid #000;margin-top:6mm;padding:4mm}
  .cr-sheet .fac div{display:flex;gap:6mm;margin-top:6mm}.cr-sheet .fac span{flex:1;border-bottom:1px solid #000;padding-top:9mm;font-size:9pt}
  .cr-sheet img{height:15mm}
}
`);

/* ---------- certificate drawing (A4 landscape, 300 dpi) ---------- */
const CW = 2480, CH = 1754;
const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const fontsReady = () => document.fonts ? Promise.race([Promise.all([document.fonts.load('800 100px "Baloo 2"'), document.fonts.load('700 40px Nunito'), document.fonts.load('400 40px Nunito')]), new Promise(r => setTimeout(r, 2500))]).catch(() => {}) : Promise.resolve();
function drawCert(cv, d, imgs) {
  const x = cv.getContext("2d"), t = TRACKS[d.track], P = C[WQ.lang], O = C[WQ.lang === "bm" ? "en" : "bm"], col = t.color, gold = "#c9a227", ink = "#1d3557", mid = CW / 2;
  const F = (w, s, fam = "Nunito") => `${w} ${s}px ${fam === "Baloo" ? '"Baloo 2", Nunito' : 'Nunito, "Segoe UI"'}, sans-serif`;
  const text = (s, X, Y, font, color = ink, align = "center", maxW = 2100) => { x.font = font; x.fillStyle = color; x.textAlign = align;
    let size = +font.match(/(\d+)px/)[1]; while (x.measureText(s).width > maxW && size > 18) { size -= 2; x.font = font.replace(/\d+px/, size + "px"); } x.fillText(s, X, Y); };
  x.clearRect(0, 0, CW, CH);
  x.fillStyle = "#fffdf7"; x.fillRect(0, 0, CW, CH);
  // soft corner swooshes in track colour
  x.globalAlpha = .07; x.fillStyle = col;
  [[0, 0], [CW, CH]].forEach(([cx, cy]) => { x.beginPath(); x.arc(cx, cy, 620, 0, Math.PI * 2); x.fill(); x.beginPath(); x.arc(cx, cy, 420, 0, Math.PI * 2); x.fill(); });
  x.globalAlpha = 1;
  // borders
  x.strokeStyle = col; x.lineWidth = 16; x.strokeRect(56, 56, CW - 112, CH - 112);
  x.strokeStyle = gold; x.lineWidth = 4; x.strokeRect(92, 92, CW - 184, CH - 184);
  x.fillStyle = gold; [[92, 92], [CW - 92, 92], [92, CH - 92], [CW - 92, CH - 92]].forEach(([a, b]) => { x.save(); x.translate(a, b); x.rotate(Math.PI / 4); x.fillRect(-20, -20, 40, 40); x.restore(); });
  // header: UPM logos (left) + WasteQuest wordmark (right)
  if (imgs.logo) { const h = 200, w = imgs.logo.width * h / imgs.logo.height; x.drawImage(imgs.logo, 170, 150, w, h); }
  x.font = F(800, 112, "Baloo"); x.textAlign = "left";
  const wx = CW - 170 - x.measureText("WasteQuest").width, ww = x.measureText("Waste").width;
  x.fillStyle = ink; x.fillText("Waste", wx, 290); x.fillStyle = "#3a9a2c"; x.fillText("Quest", wx + ww, 290);
  x.save(); x.translate(wx - 150, 190); x.fillStyle = "#5cbf4a"; x.beginPath(); x.arc(60, 60, 60, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#fff"; x.font = "800 74px sans-serif"; x.textAlign = "center"; x.fillText("♻", 60, 86); x.restore();
  // title
  if ("letterSpacing" in x) x.letterSpacing = "10px";
  text(P.title, mid, 520, F(800, 118, "Baloo"), ink);
  text(O.title, mid, 592, F(700, 48, "Baloo"), "#7a8797");
  if ("letterSpacing" in x) x.letterSpacing = "0px";
  text(P.certify, mid, 700, F("italic 400", 50));
  // name + gold rule
  text(d.name, mid, 860, F(800, 150, "Baloo"), col, "center", 1900);
  x.fillStyle = gold; x.fillRect(mid - 760, 892, 1520, 6);
  if (d.org) text(d.org, mid, 962, F(700, 50));
  text(P.done, mid, d.org ? 1040 : 1000, F(400, 48));
  // track
  text(t.short[WQ.lang], mid, 1150, F(800, 96, "Baloo"), col);
  text(t.level[WQ.lang] + "  ·  " + t.short[WQ.lang === "bm" ? "en" : "bm"], mid, 1216, F(700, 40), "#55657a");
  text(P.score(d.pct, t.pass, fmtDate(d.date)), mid, 1290, F(700, 44));
  // seal
  x.save(); x.translate(mid, 1470);
  x.fillStyle = gold; x.beginPath(); for (let i = 0; i < 48; i++) { const a = i * Math.PI / 24, r = i % 2 ? 128 : 142; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill();
  x.fillStyle = "#fff8dc"; x.beginPath(); x.arc(0, 0, 110, 0, Math.PI * 2); x.fill();
  x.strokeStyle = gold; x.lineWidth = 5; x.beginPath(); x.arc(0, 0, 96, 0, Math.PI * 2); x.stroke();
  x.font = '96px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(t.icon, 0, -6);
  x.textBaseline = "alphabetic"; x.font = F(800, 26, "Baloo"); x.fillStyle = "#8a6d00"; x.fillText("WASTEQUEST", 0, 78); x.restore();
  // signature (left)
  x.fillStyle = ink; x.fillRect(220, 1450, 760, 4);
  text(SIGNER, 600, 1508, F(800, 44), ink, "center", 860);
  text(T[WQ.lang].sigRole, 600, 1560, F(400, 36), "#55657a", "center", 860);
  // SDG strip + code (right)
  if (imgs.sdg) { const w = 700, h = imgs.sdg.height * w / imgs.sdg.width; x.drawImage(imgs.sdg, CW - 220 - w, 1330, w, h); }
  text(`${P.code}: ${d.code}`, CW - 220, 1560, F(800, 38), ink, "right", 760);
  // footnote
  text(P.foot[d.track === "practitioner" ? "practitioner" : "other"], mid, 1640, F(400, 30), "#55657a", "center", 2150);
}

/* ---------- quest state (module level: survives language switch) ---------- */
let quest = null;
function newQuest(id) {
  const t = TRACKS[id], byTopic = {};
  WQ.shuffle(WQ.questions.filter(q => q.tracks.includes(t.aud))).forEach(q => (byTopic[q.topic] = byTopic[q.topic] || []).push(q));
  const lists = WQ.shuffle(Object.values(byTopic)), pick = [];
  for (let r = 0; pick.length < t.n && lists.some(a => a.length > r); r++) lists.forEach(a => { if (a[r] && pick.length < t.n) pick.push(a[r]); });  // round-robin across topics
  quest = { id, deck: WQ.shuffle(pick).map(q => ({ q, order: q.a.length > 2 ? WQ.shuffle(q.a.map((_, i) => i)) : q.a.map((_, i) => i) })), picks: [], idx: 0, done: false, pct: 0 };
}

WQ.registerPage("cert", { mount(el, { args, relang }) {
  const [view, arg] = args, l = L(), $ = s => el.querySelector(s);
  if (view === "quest" && TRACKS[arg]) return questView(el, arg, relang);
  if (view === "get" && TRACKS[arg]) return getView(el, arg);
  if (view === "pitch") return pitchView(el);
  // ---- hub ----
  const mine = { kids: "junior", teens: "champion", adults: "practitioner", teacher: "practitioner" }[WQ.aud];
  const earned = Object.keys(WQ.earned()).filter(k => WQ.badges[k] || k.startsWith("lab-")).length;
  el.innerHTML = WQ.head("🏅", { en: T.en.title, bm: T.bm.title }, { en: T.en.sub, bm: T.bm.sub }) +
    `<p class="row"><span class="pill">🏅 ${earned} ${l.badges}</span><a href="#/badges" class="small">${l.seeBadges}</a><span class="small muted">${l.device}</span></p>
    <div class="cr-grid">${Object.entries(TRACKS).map(([id, t]) => { const s = status(id);
      return `<section class="card cr-card" style="--c:${t.color}" aria-labelledby="crh-${id}">${id === mine ? `<span class="tag go cr-for">${l.forYou}</span>` : ""}
        <span class="ci" aria-hidden="true">${t.icon}</span><div><h3 id="crh-${id}">${WQ.esc(WQ.t(t.name))}</h3><span class="tag">${WQ.esc(WQ.t(t.who))}</span></div>
        <ul>${s.reqs.map(reqLine).join("")}</ul>
        ${id === "practitioner" ? `<p class="small muted">${l.mc}</p>` : ""}
        <div class="row"><a class="btn ${s.passRec ? "alt" : ""}" href="#/cert/quest/${id}">${l.take}</a>${s.ready ? `<a class="btn blue" href="#/cert/get/${id}">${l.get}</a>` : ""}</div></section>`; }).join("")}</div>
    <section class="card cr-form" style="margin-top:22px" aria-labelledby="crv"><h2 id="crv">🔎 ${l.vT}</h2><p class="small muted">${l.vS}</p>
      <div class="cr-two"><div><label for="vN">${l.vName}</label><input id="vN" autocomplete="off"></div>
      <div><label for="vT">${l.vTrack}</label><select id="vT">${Object.entries(TRACKS).map(([id, t]) => `<option value="${id}">${WQ.esc(WQ.t(t.short))}</option>`).join("")}</select></div>
      <div><label for="vD">${l.vDate}</label><input id="vD" type="date"></div><div><label for="vS">${l.vScore}</label><input id="vS" type="number" min="0" max="100" inputmode="numeric"></div>
      <div><label for="vC">${l.vCode}</label><input id="vC" placeholder="WQ-XXXX-XXXX" autocomplete="off"></div></div>
      <p class="row" style="margin-top:12px"><button class="btn blue" id="vB">${l.vBtn}</button></p><div id="vR" aria-live="polite"></div><p class="small muted">${l.vNote}</p></section>`;
  $("#vB").onclick = () => {
    const v = id => $(id).value.trim(), code = v("#vC").toUpperCase().replace(/\s+/g, "");
    const ok = v("#vN") && v("#vD") && v("#vS") !== "" && code === certCode(v("#vN"), v("#vT"), v("#vD"), v("#vS"));
    $("#vR").innerHTML = `<p class="note ${ok ? "ok" : "danger"}">${ok ? l.vOk : l.vBad}</p>`;
  };
} });

/* ---------- final quest (assessment) ---------- */
function questView(el, id, relang) {
  const t = TRACKS[id], l = L();
  if (!relang && (!quest || quest.id !== id || quest.done)) newQuest(id);
  el.innerHTML = WQ.head(t.icon, { en: T.en.qT(t.short.en), bm: T.bm.qT(t.short.bm) }, { en: T.en.qInfo(t.n, t.pass), bm: T.bm.qInfo(t.n, t.pass) }) + `<div id="crQ"></div>`;
  const box = el.querySelector("#crQ");
  const render = () => {
    if (quest.done) return results();
    const n = quest.deck.length, d = quest.deck[quest.idx], pick = quest.picks[quest.idx], last = quest.idx === n - 1;
    box.innerHTML = `<div class="card"><div class="row"><span class="pill">${l.qOf(quest.idx + 1, n)}</span><div class="meter" style="flex:1;min-width:120px"><i style="width:${quest.idx / n * 100}%"></i></div></div>
      <p class="cr-q" id="crQq">${WQ.esc(WQ.t(d.q.q))}</p>
      <div class="cr-ans" role="group" aria-labelledby="crQq">${d.order.map((ai, i) => `<button class="choice ${pick === ai ? "pick" : ""}" data-a="${ai}" ${pick != null ? "disabled" : ""}><b>${"ABCD"[i]}</b><span>${WQ.esc(WQ.t(d.q.a[ai]))}</span></button>`).join("")}</div>
      <div class="row" style="justify-content:space-between;margin-top:14px"><span class="small muted" aria-live="polite">${pick != null ? "🔒 " + l.locked : ""}</span>
      <button class="btn ${last ? "blue" : ""}" id="crNx" ${pick == null ? "disabled" : ""}>${last ? l.finish : l.next}</button></div></div>`;
    box.querySelectorAll("[data-a]").forEach(b => b.onclick = () => { if (quest.picks[quest.idx] != null) return; quest.picks[quest.idx] = +b.dataset.a; render(); box.querySelector("#crNx").focus(); });
    box.querySelector("#crNx").onclick = () => { if (quest.picks[quest.idx] == null) return; if (last) grade(); else { quest.idx++; render(); } };
  };
  const grade = () => {
    const n = quest.deck.length, right = quest.deck.filter((d, i) => quest.picks[i] === d.q.c).length, pct = Math.round(right / n * 100), date = today();
    Object.assign(quest, { done: true, pct, right });
    S.setJSON("cert-last-" + id, { pct, right, n, date });
    const prev = S.getJSON("cert-pass-" + id, null);
    if (pct >= t.pass && (!prev || pct > prev.pct)) S.setJSON("cert-pass-" + id, { pct, date });
    WQ.beep(pct >= t.pass); WQ.track(`cert-test/${id}/${pct >= t.pass ? "pass" : "fail"}`); if (pct >= t.pass) WQ.confetti();
    results(); scrollTo(0, 0);
  };
  const results = () => {
    const pass = quest.pct >= t.pass, s = status(id), n = quest.deck.length;
    box.innerHTML = `<div class="card" style="text-align:center"><h2>${l.resT}</h2><div class="cr-big">${quest.pct}%</div><p>${quest.right}/${n} · <b>${pass ? l.pass : l.fail}</b>${pass ? "" : " · " + l.need(t.pass)}</p>
      ${pass ? (s.ready ? `<p><a class="btn blue" href="#/cert/get/${id}">${l.get}</a></p>` : missingBox(id, s)) : `<p class="note warn" style="text-align:left">${t.aud === "kids" ? l.failMsg.kids : l.failMsg.other}</p>`}
      <div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="crAg">${l.again}</button><a class="btn alt" href="#/game/quiz">${l.practise}</a><a class="btn alt" href="#/cert">${l.hub}</a></div></div>
      <div class="card cr-res"><h3>${l.all}</h3><ol>${quest.deck.map((d, i) => { const ok = quest.picks[i] === d.q.c; return `<li><b>${ok ? "✅" : "❌"} ${WQ.esc(WQ.t(d.q.q))}</b><br>
        ${ok ? "" : `<span class="tag red">${l.yours}</span> ${WQ.esc(WQ.t(d.q.a[quest.picks[i]]))}<br>`}<span class="tag go">${l.correct}</span> ${WQ.esc(WQ.t(d.q.a[d.q.c]))}<br><span class="small muted">💡 ${WQ.esc(WQ.t(d.q.why))}</span></li>`; }).join("")}</ol></div>`;
    box.querySelector("#crAg").onclick = () => { newQuest(id); render(); scrollTo(0, 0); };
  };
  render();
}

function missingBox(id, s) {
  const l = L();
  if (id === "junior" && s.other.length === 1 && s.other[0].key === "games") {
    const todo = Object.values(WQ.games).filter(g => !WQ.has(g.id)).sort((a, b) => a.order - b.order).slice(0, 4);
    return `<div class="note ok" style="text-align:left"><p>${l.kidsCheer(3 - s.games)}</p><div class="row">${todo.map(g => `<a class="btn alt" href="#/game/${g.id}">${g.icon} ${WQ.esc(WQ.t(g.title))}</a>`).join("")}</div></div>`;
  }
  return `<div class="note warn" style="text-align:left"><b>${l.missT}</b><ul style="list-style:none;padding:0;margin:8px 0 0">${s.other.map(reqLine).join("")}</ul></div>`;
}

/* ---------- certificate ---------- */
function getView(el, id) {
  const t = TRACKS[id], l = L(), s = status(id);
  el.innerHTML = WQ.head(t.icon, t.short, t.level) + `<div id="crG"></div>`;
  const box = el.querySelector("#crG");
  if (!s.passRec) { box.innerHTML = `<div class="card"><p>${l.noPass}</p><p><a class="btn" href="#/cert/quest/${id}">${l.take}</a></p></div>`; return; }
  if (!s.ready) { box.innerHTML = `<div class="card">${missingBox(id, s)}<p style="margin-top:12px"><a class="btn alt" href="#/cert">${l.hub}</a></p></div>`; return; }
  const form = () => {
    box.innerHTML = `<div class="card cr-form"><label for="crN">${l.nameL}</label><input id="crN" maxlength="60" autocomplete="name" value="${WQ.esc(S.get("cert-name") || "")}">
      <label for="crO">${l.orgL}</label><input id="crO" maxlength="80" value="${WQ.esc(S.get("cert-org") || "")}">
      <p class="row" style="margin-top:14px"><button class="btn" id="crMk">${l.make}</button></p></div>`;
    const go = () => { const n = box.querySelector("#crN").value.trim().replace(/\s+/g, " "); if (!n) { WQ.anim(box.querySelector("#crN"), "shake"); box.querySelector("#crN").focus(); return; }
      S.set("cert-name", n); S.set("cert-org", box.querySelector("#crO").value.trim()); show(); };
    box.querySelector("#crMk").onclick = go;
    box.querySelectorAll("input").forEach(i => i.onkeydown = e => { if (e.key === "Enter") go(); });
  };
  const show = async () => {
    const d = { name: S.get("cert-name"), org: S.get("cert-org") || "", track: id, date: s.passRec.date, pct: s.passRec.pct };
    d.code = certCode(d.name, id, d.date, d.pct);
    box.innerHTML = `<p class="muted" aria-live="polite">${l.making}</p>`;
    el.querySelector(".cr-printable")?.remove();
    const [logo, sdg] = await Promise.all([loadImg("assets/logos-upm.jpeg"), loadImg("assets/sdg-strip.jpeg"), fontsReady()]);
    if (!el.isConnected) return;
    const cv = document.createElement("canvas"); cv.width = CW; cv.height = CH;
    let url, noImg = false;
    drawCert(cv, d, { logo, sdg });
    try { url = cv.toDataURL("image/png"); } catch (e) { noImg = true; drawCert(cv, d, {}); url = cv.toDataURL("image/png"); }  // file:// taints canvas → redraw without logos
    WQ.award("cert-" + id);
    box.innerHTML = `<div class="card"><div class="row"><button class="btn" id="crDl">${l.dl}</button><button class="btn blue" id="crPr">${l.print}</button><button class="btn alt" id="crEd">${l.edit}</button></div>
      <p class="small" style="margin-top:10px">${l.code}: <b>${d.code}</b></p>${noImg || !logo ? `<p class="note warn small">${l.noImg}</p>` : ""}</div>`;
    const pv = document.createElement("div"); pv.className = "cr-printable cr-prev"; pv.style.marginTop = "16px";
    pv.innerHTML = `<img alt="${WQ.esc(`${WQ.t(C[WQ.lang].title)}: ${d.name}, ${WQ.t(t.short)}, ${d.pct}%`)}" src="${url}">`;
    el.appendChild(pv);
    box.querySelector("#crDl").onclick = () => { WQ.track("certificate/download/" + id); const a = document.createElement("a"); a.href = url; a.download = `WasteQuest-${id}-${d.name.replace(/[^\w]+/g, "_").slice(0, 40)}.png`; document.body.appendChild(a); a.click(); a.remove(); };
    box.querySelector("#crPr").onclick = () => WQ.track("certificate/print/" + id) || printOnly("size:A4 landscape;margin:0");
    box.querySelector("#crEd").onclick = () => { pv.remove(); form(); };
  };
  if (S.get("cert-name")) show(); else form();
}

/* ---------- practitioner portfolio: W2W product pitch ---------- */
function pitchView(el) {
  const l = L(), p = getPitch(), f = (k, lab, type = "text", extra = "") => `<div><label for="pf-${k}">${lab}</label>${type === "area"
    ? `<textarea id="pf-${k}" data-k="${k}" maxlength="600">${WQ.esc(p[k] || "")}</textarea>`
    : `<input id="pf-${k}" data-k="${k}" type="${type}" value="${WQ.esc(p[k] ?? "")}" ${extra}>`}</div>`;
  el.innerHTML = WQ.head("💼", { en: T.en.pT, bm: T.bm.pT }, { en: T.en.pS, bm: T.bm.pS }) + `
    <div class="card cr-form cr-noprint">
      <div class="cr-two">${f("name", l.pName, "text", 'maxlength="60" autocomplete="name"')}${f("product", l.pProd, "text", 'maxlength="80"')}</div>
      <div class="cr-two">${f("waste", l.pWaste, "text", 'maxlength="120" list="pf-wl"')}${f("kg", l.pKg, "number", 'min="0" step="0.1" inputmode="decimal"')}</div>
      <datalist id="pf-wl">${["Used cooking oil / Minyak masak terpakai","Coffee grounds / Hampas kopi","Fruit peels / Kulit buah","PET bottles / Botol PET","Plastic bags / Beg plastik","Old textiles / Tekstil lama","Food waste / Sisa makanan","Fish waste / Sisa ikan"].map(o => `<option value="${o}">`).join("")}</datalist>
      ${f("customers", l.pCust, "area")}
      <div class="cr-two">${f("cost", l.pCost, "number", 'min="0" step="0.01" inputmode="decimal"')}${f("price", l.pPrice, "number", 'min="0" step="0.01" inputmode="decimal"')}</div>
      <label>${l.pMargin}</label><div class="cr-calc" id="pfCalc" aria-live="polite"></div>
      <fieldset style="border:0;padding:0;margin:12px 0 0"><legend style="font-weight:800;margin-bottom:6px">${l.pSdg}</legend><div class="cr-sdgs">${SDGS.map((s, i) =>
        `<label><input type="checkbox" value="${i + 1}" ${(p.sdgs || []).includes(i + 1) ? "checked" : ""}> ${i + 1} · ${WQ.esc(s[WQ.lang === "bm" ? 1 : 0])}</label>`).join("")}</div></fieldset>
      ${f("safety", l.pSafe, "area")}
      <div id="pfState" style="margin-top:14px" aria-live="polite"></div>
      <p class="row" style="margin-top:12px"><button class="btn blue" id="pfPr">${l.pPrint}</button><a class="btn alt" href="#/cert">${l.hub}</a></p></div>
    <div class="cr-printable cr-sheet" id="pfSheet"></div>`;
  const calc = q => { const c = +q.cost, pr = +q.price; if (!(c > 0 && pr > 0)) return "—"; const pf = pr - c;
    return `${money(pf)} ${l.perUnit} · ${l.margin} ${Math.round(pf / pr * 1000) / 10}%${pf <= 0 ? `<br><span class="todo">${l.loss}</span>` : ""}`; };
  const sync = () => {
    const q = getPitch();
    el.querySelectorAll("[data-k]").forEach(i => q[i.dataset.k] = i.value);
    q.sdgs = [...el.querySelectorAll(".cr-sdgs input:checked")].map(i => +i.value);
    S.setJSON("cert-pitch", q);
    const miss = pitchMissing(q);
    el.querySelector("#pfCalc").innerHTML = calc(q);
    el.querySelector("#pfState").innerHTML = `<p class="note ${miss.length ? "warn" : "ok"}">${miss.length ? l.left(miss.length) : l.done}</p>`;
    const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`, e = s => WQ.esc(s || "").replace(/\n/g, "<br>"), kg = +q.kg || 0;
    el.querySelector("#pfSheet").innerHTML = `<img src="assets/logos-upm.jpeg" alt="UPM"><h1>${l.sheetT}</h1><p>WasteQuest · ${fmtDate(today())}</p><table>
      ${row(l.pName, e(q.name))}${row(l.pProd, e(q.product))}${row(l.pWaste, e(q.waste))}${row(l.pKg, kg ? `${kg} kg (≈ ${Math.round(kg * 12 * 10) / 10} kg ${l.perYear})` : "")}
      ${row(l.pCust, e(q.customers))}${row(l.pCost, +q.cost > 0 ? money(+q.cost) : "")}${row(l.pPrice, +q.price > 0 ? money(+q.price) : "")}${row(l.pMargin, calc(q))}
      ${row(l.pSdg.replace(/\s*\(.*\)/, ""), q.sdgs.map(n => `SDG ${n} ${WQ.esc(SDGS[n - 1][WQ.lang === "bm" ? 1 : 0])}`).join("; "))}${row(l.pSafe, e(q.safety))}</table>
      <div class="fac"><b>${l.fac}</b> &nbsp; ☐ ${l.chk1} &nbsp; ☐ ${l.chk2} &nbsp; ☐ ${l.chk3}<div><span>${l.facName}</span><span>${l.sign}</span><span>${l.date}</span></div></div>`;
  };
  el.querySelectorAll("input,textarea").forEach(i => i.addEventListener("input", sync));
  el.querySelectorAll(".cr-sdgs input").forEach(i => i.addEventListener("change", sync));
  el.querySelector("#pfPr").onclick = () => { sync(); printOnly("size:A4 portrait;margin:14mm"); };
  sync();
}
})();
