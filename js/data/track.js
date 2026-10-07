/* WasteQuest v2 data tracking: WQ.data (coded player records, offline queue, batched upload),
   start profile, privacy notice + opt-out (#/privacy), 5-question pre/post check and 1-minute survey (#/check/...).
   Public API (other modules call it only if present: WQ.data && WQ.data.log(...)):
     WQ.data.log(type, {module, item, answer, score, max, secs, value, ...extra})  -> queue one event
     WQ.data.flush()                       -> try to upload now (returns a promise)
     WQ.data.PROFILE / setProfile(k, v) / profile()   start profile (age, utype, area)
     WQ.data.consent("yes"|"no") / consentState() / noticeHTML()   privacy notice + opt-out
     WQ.data.preDone()                     -> true once the pre-check was done or skipped
   Store keys (prefix wq-): trk-pid trk-first trk-visits trk-profile trk-consent trk-q trk-pre trk-post trk-survey trk-postoffer
   Events stay in the browser until the server acknowledges their ids. Opt-out = nothing queued or sent.
   SOURCES: pre/post items and survey wording from research/v2/07_pilot_evaluation.md sections 3 and 4
   (answer keys: 3R/waste hierarchy and composting basics as cited there; SWCorp sorting basics per SPEC.md);
   notice content from research/v2/05_legal_ethics.md section 6; transport design from research/v2/06_data_tech.md sections 2-4. */
(() => {
  if (typeof WQ === "undefined") return;
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbxgVar7Topthgj1WRVLbNxczOqMuSw-FuKVxCJiKBT9M9it0LJC18yUjUPOq1QBN-Cu/exec";            // Apps Script ingest URL (".../exec"). Empty = keep queueing, send nothing.
  const SCHEMA = 1, BATCH = 20, CAP = 2000, KEEP = /^(pre|post|survey|profile|consent)/;
  const S = WQ.store, t = o => WQ.t(o), e = s => WQ.esc(s);
  const qs = (k) => { try { return new URLSearchParams(location.search).get(k); } catch (er) { return null; } };
  const endpoint = () => qs("wqend") || ENDPOINT;
  const rid = n => { try { const a = new Uint8Array(n); crypto.getRandomValues(a); return [...a].map(b => (b % 36).toString(36)).join(""); }
    catch (er) { return Math.random().toString(36).slice(2, 2 + n).padEnd(n, "0"); } };

  /* ---------- identity ---------- */
  let pid = S.get("trk-pid");
  if (!pid) { pid = rid(10); S.set("trk-pid", pid); }
  const sid = rid(8), today = () => new Date().toISOString().slice(0, 10);
  if (!S.get("trk-first")) S.set("trk-first", today());
  const visits = +(S.get("trk-visits") || 0) + 1; S.set("trk-visits", visits);
  let seq = 0;

  /* ---------- start profile ---------- */
  const PROFILE = [
    { k: "age", q: { en: "How old are you?", bm: "Berapakah umur anda?" }, opts: [
      ["7-9", { en: "7–9", bm: "7–9" }], ["10-12", { en: "10–12", bm: "10–12" }], ["13-17", { en: "13–17", bm: "13–17" }],
      ["18-24", { en: "18–24", bm: "18–24" }], ["25-59", { en: "25–59", bm: "25–59" }], ["60+", { en: "60+", bm: "60+" }]] },
    { k: "utype", q: { en: "Who are you?", bm: "Siapakah anda?" }, opts: [
      ["student", { en: "Student", bm: "Pelajar" }], ["teacher", { en: "Teacher", bm: "Guru" }],
      ["resident", { en: "Parent / resident", bm: "Ibu bapa / penduduk" }], ["staff", { en: "Staff / ESG", bm: "Kakitangan / ESG" }],
      ["visitor", { en: "Event visitor", bm: "Pengunjung acara" }], ["other", { en: "Other", bm: "Lain-lain" }]] },
    { k: "area", q: { en: "Where do you live?", bm: "Di manakah anda tinggal?" }, opts: [
      ["selangor", { en: "Selangor", bm: "Selangor" }], ["klpj", { en: "KL & Putrajaya", bm: "KL & Putrajaya" }],
      ["north", { en: "Perlis, Kedah, Penang, Perak", bm: "Perlis, Kedah, P. Pinang, Perak" }], ["south", { en: "N. Sembilan, Melaka, Johor", bm: "N. Sembilan, Melaka, Johor" }],
      ["east", { en: "Pahang, Terengganu, Kelantan", bm: "Pahang, Terengganu, Kelantan" }], ["sabah", { en: "Sabah & Labuan", bm: "Sabah & Labuan" }],
      ["sarawak", { en: "Sarawak", bm: "Sarawak" }], ["abroad", { en: "Outside Malaysia", bm: "Luar Malaysia" }],
      ["na", { en: "Prefer not to say", bm: "Tidak mahu nyatakan" }]] }];
  const profile = () => S.getJSON("trk-profile", {});
  const audFor = p => p.utype === "teacher" ? "teacher" : /^(7-9|10-12)$/.test(p.age) ? "kids" : p.age === "13-17" ? "teens" : p.age ? "adults" : null;
  function setProfile(k, v) {
    const p = profile(); p[k] = v; S.setJSON("trk-profile", p);
    const a = audFor(p); if (a) { WQ.aud = a; S.set("aud", a); }    // caller re-renders (WQ.setAud would re-route mid-dialog)
    log("profile", { item: k, answer: v });
  }

  /* ---------- consent / opt-out ---------- */
  const consentState = () => S.get("trk-consent") || "";          // "" undecided | yes | no
  let mem = [];                                                    // events made before the notice was answered
  function consent(v) {
    S.set("trk-consent", v); hideBar();
    if (v === "no") { mem = []; S.setJSON("trk-q", []); return; }
    const q = load(); q.push(...mem); mem = []; save(q); log("consent", { answer: "yes" }); schedule(2000);
  }

  /* ---------- queue ---------- */
  const load = () => { const q = S.getJSON("trk-q", []); return Array.isArray(q) ? q : []; };
  function save(q) {
    if (q.length > CAP) {                                         // drop oldest telemetry first, never tests/survey unless unavoidable
      let over = q.length - CAP; q = q.filter(ev => over > 0 && !KEEP.test(ev.type) ? (over--, false) : true);
      if (q.length > CAP) q = q.slice(q.length - CAP);
    }
    S.setJSON("trk-q", q);
  }
  const FIELDS = ["module", "item", "answer", "score", "max", "secs", "value"];
  function log(type, payload = {}) {
    if (consentState() === "no") return null;
    const p = profile(), ev = { id: pid + "-" + sid + "-" + (++seq), player: pid, session: sid, time: new Date().toISOString(), seq,
      type: /^[a-z0-9_]{1,24}$/.test(type) ? type : "other", lang: WQ.lang, aud: WQ.aud, age: p.age || "", utype: p.utype || "", area: p.area || "" }, x = {};
    Object.entries(payload || {}).forEach(([k, v]) => { if (FIELDS.includes(k)) ev[k] = typeof v === "number" ? v : String(v ?? "").slice(0, 80); else x[k] = v; });
    if (Object.keys(x).length) { try { ev.extra = JSON.stringify(x).slice(0, 300); } catch (er) {} }
    if (!consentState()) { if (mem.length < 300) mem.push(ev); return ev; }
    const q = load(); q.push(ev); save(q);
    if (q.length >= BATCH) schedule(1000);
    return ev;
  }

  /* ---------- upload: one request in flight, delete only acknowledged ids, backoff with jitter ---------- */
  let busy = false, fails = 0, timer = 0;
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(flush, ms); }
  async function flush() {
    const url = endpoint();
    if (busy || !url || consentState() !== "yes" || (typeof navigator !== "undefined" && navigator.onLine === false)) return false;
    const batch = load().slice(0, BATCH); if (!batch.length) return true;
    busy = true;
    try {
      const r = await fetch(url, { method: "POST", body: JSON.stringify({ v: SCHEMA, b: rid(10), e: batch }), headers: { "Content-Type": "text/plain;charset=utf-8" } });
      const j = await r.json(), ack = new Set((j && j.ack) || []);
      if (!j || !j.ok) throw new Error("not ok");
      save(load().filter(ev => !ack.has(ev.id))); fails = 0; busy = false;
      if (load().length) schedule(500 + Math.random() * 1500); else schedule(120000 + Math.random() * 60000);
      return true;
    } catch (er) {
      busy = false; fails++; schedule(Math.min(300000, 5000 * 2 ** Math.min(fails, 6)) * (0.5 + Math.random()));
      return false;
    }
  }
  function beacon() {          // best effort at pagehide; events stay queued, server dedupes ids if they arrive twice
    const url = endpoint(), batch = load().slice(0, BATCH);
    if (!url || !batch.length || consentState() !== "yes" || !navigator.sendBeacon) return;
    try { navigator.sendBeacon(url, JSON.stringify({ v: SCHEMA, b: rid(10), e: batch })); } catch (er) {}
  }

  /* ---------- automatic events: views, active time, starts, finishes, answers, badges, exit, returns ---------- */
  let cur = null, active = 0, lastInput = Date.now(), lang = WQ.lang;
  const keyOf = (v, a) => v + (a && a[0] ? "/" + a[0] : "");
  const leave = type => { if (cur) log(type, { module: cur, secs: active }); active = 0; };
  WQ.on("route", (view, args, relang) => {
    if (WQ.lang !== lang) { lang = WQ.lang; log("lang", { answer: lang }); }
    if (relang) return;
    leave("leave"); cur = keyOf(view, args); log("view", { module: cur });
    if (view === "game" && args[0]) log("start", { module: "game/" + args[0] });
    else if (view === "lab" && args[0]) log("start", { module: "lab/" + args[0] });
    maybeBar(view);
  });
  WQ.on("finish", (key, score) => log("finish", { module: "game/" + key, score: +score || 0 }));
  WQ.on("answer", (ok, v) => log("answer", { module: v, answer: ok ? 1 : 0 }));
  WQ.on("award", id => { log("badge", { item: id }); maybeOfferPost(); });
  try {
    const days = Math.round((Date.parse(today()) - Date.parse(S.get("trk-first"))) / 864e5) || 0;
    log("session", { value: days, item: "visit" + visits });
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach(ev => addEventListener(ev, () => { lastInput = Date.now(); }, { passive: true }));
    setInterval(() => { if (!document.hidden && Date.now() - lastInput < 60000) active += 5; }, 5000);
    addEventListener("pagehide", () => { leave("exit"); beacon(); });
    addEventListener("online", () => schedule(Math.random() * 30000));
    document.addEventListener("visibilitychange", () => { if (document.hidden) beacon(); else schedule(1000 + Math.random() * 4000); });
    schedule(3000 + Math.random() * 7000);
  } catch (er) {}

  /* ---------- UI strings ---------- */
  const T = {
    privT: { en: "Privacy", bm: "Privasi" },
    short: { en: "We record a coded player number, no names.", bm: "Kami merekod nombor pemain berkod, tanpa nama." },
    privS: { en: "What WasteQuest records, and your choice.", bm: "Apa yang direkodkan oleh WasteQuest, dan pilihan anda." },
    nT: { en: "Your information", bm: "Maklumat anda" },
    n1: { en: "To improve WasteQuest, we record a random player code (no names), your age group, user type and area if you choose them, which pages you open, time spent, and quiz and survey answers.",
          bm: "Untuk menambah baik WasteQuest, kami merekodkan kod pemain rawak (tanpa nama), kumpulan umur, jenis pengguna dan kawasan jika anda memilihnya, halaman yang dibuka, masa yang digunakan, serta jawapan kuiz dan soal selidik." },
    n2: { en: "The records are coded, not anonymous. Only the UPM WasteQuest team sees them; anyone else sees grouped totals only. We use Google Sheets, so Google may process them outside Malaysia.",
          bm: "Rekod ini berkod, bukan tanpa nama. Hanya pasukan WasteQuest UPM boleh melihatnya; pihak lain hanya melihat jumlah berkumpulan. Kami menggunakan Google Sheets, jadi Google mungkin memprosesnya di luar Malaysia." },
    n3: { en: "Never type your name, address or phone number. Under 18? Ask your parent or teacher first. You can play fully without being tracked.",
          bm: "Jangan taip nama, alamat atau nombor telefon anda. Bawah 18 tahun? Tanya ibu bapa atau guru dahulu. Anda boleh bermain sepenuhnya tanpa dijejak." },
    ok: { en: "OK", bm: "OK" }, no: { en: "Don't track me", bm: "Jangan jejak saya" }, more: { en: "More", bm: "Lagi" },
    stOn: { en: "Tracking is ON (coded records).", bm: "Penjejakan HIDUP (rekod berkod)." },
    stOff: { en: "Tracking is OFF. Nothing is recorded or sent.", bm: "Penjejakan MATI. Tiada apa-apa direkod atau dihantar." },
    code: { en: "Your player code (keep it if you want to ask us to delete your records):", bm: "Kod pemain anda (simpan jika anda mahu meminta kami memadam rekod anda):" },
    waiting: { en: "events waiting to send", bm: "rekod menunggu untuk dihantar" },
    newP: { en: "New player on this device", bm: "Pemain baharu pada peranti ini" },
    newPq: { en: "Start as a new player? Your badges stay; your profile and checks reset.", bm: "Mula sebagai pemain baharu? Lencana kekal; profil dan semakan anda ditetapkan semula." },
    chkT: { en: "Quick checks", bm: "Semakan ringkas" }, chkS: { en: "5 questions before and after playing, plus a 1-minute survey. Not marked, no right or wrong shown.", bm: "5 soalan sebelum dan selepas bermain, serta tinjauan 1 minit. Tidak dimarkah, betul atau salah tidak ditunjukkan." },
    pre: { en: "Start check (before playing)", bm: "Semakan awal (sebelum bermain)" }, post: { en: "Final check (after playing)", bm: "Semakan akhir (selepas bermain)" },
    survey: { en: "1-minute survey", bm: "Tinjauan 1 minit" }, done: { en: "done", bm: "selesai" },
    qOf: { en: "Question", bm: "Soalan" }, of: { en: "of", bm: "daripada" }, skipQ: { en: "Skip this question", bm: "Langkau soalan ini" },
    stop: { en: "Stop", bm: "Berhenti" }, thanks: { en: "Thank you!", bm: "Terima kasih!" },
    thanksS: { en: "Your answers are saved. Now let's clean up the town!", bm: "Jawapan anda disimpan. Jom bersihkan bandar!" },
    toTown: { en: "Back to town ▶", bm: "Kembali ke bandar ▶" }, toSurvey: { en: "1-minute survey ▶", bm: "Tinjauan 1 minit ▶" },
    preNote: { en: "Just answer what you think. We won't show right or wrong now.", bm: "Jawab sahaja apa yang anda fikir. Kami tidak akan tunjuk betul atau salah sekarang." },
    send: { en: "Send answers", bm: "Hantar jawapan" }, skipS: { en: "Skip", bm: "Langkau" },
    survI: { en: "There are no right answers. You may skip any question.", bm: "Tiada jawapan betul atau salah. Anda boleh melangkau mana-mana soalan." },
    offerT: { en: "Great work! Ready for the 5-question final check?", bm: "Syabas! Sedia untuk semakan akhir 5 soalan?" },
    start: { en: "Start", bm: "Mula" }, later: { en: "Later", bm: "Nanti" },
    off: { en: "Tracking is off, so answers are not recorded. You can still try it.", bm: "Penjejakan dimatikan, jadi jawapan tidak direkodkan. Anda masih boleh mencubanya." },
  };
  function noticeHTML() { return `<p>${e(t(T.n1))}</p><p>${e(t(T.n2))}</p><p>${e(t(T.n3))}</p>`; }

  /* ---------- 5-question checks (same items before and after; per age form) ---------- */
  const Q = (id, q, a, c) => ({ id, q, a, c });
  const FORMS = {
    kids: [
      Q("K1", { en: "A bin says “Paper”. Which item belongs there?", bm: "Sebuah tong berlabel “Kertas”. Barang manakah yang sesuai dimasukkan ke dalamnya?" },
        [{ en: "A banana peel", bm: "Kulit pisang" }, { en: "A clean sheet of paper", bm: "Sehelai kertas bersih" }, { en: "A glass bottle", bm: "Botol kaca" }], 1),
      Q("K2", { en: "Your can still has some drink in it. What should you do before putting it in a bin that takes empty cans?", bm: "Masih ada minuman di dalam tin anda. Apakah yang perlu dilakukan sebelum memasukkannya ke dalam tong yang menerima tin kosong?" },
        [{ en: "Empty the can", bm: "Kosongkan tin" }, { en: "Wrap the can in paper", bm: "Balut tin dengan kertas" }, { en: "Put the can in with the drink", bm: "Masukkan tin bersama minuman" }], 0),
      Q("K3", { en: "You need drinking water at school. Which choice means fewer throwaway bottles?", bm: "Anda memerlukan air minuman di sekolah. Pilihan manakah mengurangkan botol yang dibuang selepas digunakan?" },
        [{ en: "Bring two throwaway bottles", bm: "Bawa dua botol pakai buang" }, { en: "Buy a new bottle each day", bm: "Beli botol baharu setiap hari" }, { en: "Refill your reusable bottle", bm: "Isi semula botol guna semula anda" }], 2),
      Q("K4", { en: "You use an empty jam jar to keep pencils. Which 3R action is this?", bm: "Anda menggunakan balang jem kosong untuk menyimpan pensel. Apakah amalan 3R ini?" },
        [{ en: "Reduce", bm: "Kurangkan" }, { en: "Reuse", bm: "Guna semula" }, { en: "Recycle", bm: "Kitar semula" }], 1),
      Q("K5", { en: "Fruit peels are turned into compost for plants. What useful thing is made?", bm: "Kulit buah diproses menjadi kompos untuk tanaman. Apakah hasil yang berguna?" },
        [{ en: "Something that makes soil better", bm: "Bahan untuk memperbaik tanah" }, { en: "A glass container", bm: "Bekas kaca" }, { en: "A metal tool", bm: "Alat logam" }], 0)],
    teens: [
      Q("T1", { en: "A collection point accepts clean paper. Which item matches this rule?", bm: "Sebuah pusat pengumpulan menerima kertas bersih. Barang manakah memenuhi syarat ini?" },
        [{ en: "A paper plate with curry on it", bm: "Pinggan kertas yang masih bersisa kari" }, { en: "A plastic-lined snack packet", bm: "Bungkusan snek berlapik plastik" }, { en: "A clean used worksheet", bm: "Lembaran kerja terpakai yang bersih" }], 2),
      Q("T2", { en: "You are unsure whether a plastic tray is accepted for recycling where you live. What should you do first?", bm: "Anda tidak pasti sama ada dulang plastik diterima untuk kitar semula di kawasan anda. Apakah tindakan pertama?" },
        [{ en: "Check the local collection instructions", bm: "Semak arahan pengumpulan setempat" }, { en: "Put it with paper recycling", bm: "Masukkan bersama kertas kitar semula" }, { en: "Put it in because it is plastic", bm: "Masukkan kerana bahan itu plastik" }], 0),
      Q("T3", { en: "A club prints a new handout for every meeting. Which change reduces paper use at source?", bm: "Sebuah kelab mencetak edaran baharu untuk setiap mesyuarat. Perubahan manakah mengurangkan penggunaan kertas di punca?" },
        [{ en: "Collect printed copies for recycling", bm: "Kumpulkan salinan bercetak untuk kitar semula" }, { en: "Share the handout digitally", bm: "Kongsi edaran secara digital" }, { en: "Use printed sheets for craft", bm: "Gunakan helaian bercetak untuk kraf" }], 1),
      Q("T4", { en: "A club uses old banners as bags without melting them. Which description fits best?", bm: "Sebuah kelab menggunakan kain rentang lama sebagai beg tanpa meleburkannya. Huraian manakah paling sesuai?" },
        [{ en: "Composting the material", bm: "Mengkompos bahan" }, { en: "Landfilling the material", bm: "Melupuskan bahan di tapak pelupusan" }, { en: "Reusing the material for a new purpose", bm: "Menggunakan semula bahan untuk tujuan baharu" }], 2),
      Q("T5", { en: "A compost pile is too wet and tightly packed. Which change helps the oxygen-needing microorganisms break down the scraps?", bm: "Timbunan kompos terlalu basah dan padat. Perubahan manakah membantu mikroorganisma yang memerlukan oksigen menguraikan sisa?" },
        [{ en: "Turn the pile and mix in dry leaves", bm: "Balikkan timbunan dan campurkan daun kering" }, { en: "Cover the pile tightly and add more water", bm: "Tutup timbunan dengan rapat dan tambah air" }, { en: "Press the pile down and add fresh scraps", bm: "Padatkan timbunan dan tambah sisa segar" }], 0)],
    adults: [
      Q("A1", { en: "A local collector accepts empty aluminium cans. What should happen to a can containing food?", bm: "Pengumpul setempat menerima tin aluminium kosong. Apakah tindakan bagi tin yang mengandungi makanan?" },
        [{ en: "Seal the food inside the can", bm: "Tutup tin bersama makanan" }, { en: "Remove the food before collection", bm: "Keluarkan makanan sebelum pengumpulan" }, { en: "Wrap the can in used paper", bm: "Balut tin dengan kertas terpakai" }], 1),
      Q("A2", { en: "An unfamiliar pack shows a recycling symbol. What is the best first step before putting it in the local recycling stream?", bm: "Bungkusan yang kurang dikenali memaparkan simbol kitar semula. Apakah tindakan pertama sebelum memasukkannya ke dalam aliran kitar semula setempat?" },
        [{ en: "Assume the symbol guarantees acceptance", bm: "Anggap simbol menjamin penerimaan" }, { en: "Send it with food scraps", bm: "Hantar bersama sisa makanan" }, { en: "Check the collector's accepted-material list", bm: "Semak senarai bahan yang diterima oleh pengumpul" }], 2),
      Q("A3", { en: "An office wants to prevent disposable cup waste. Which action comes earliest in the waste hierarchy?", bm: "Sebuah pejabat mahu mencegah sisa cawan pakai buang. Tindakan manakah paling awal dalam hierarki sisa?" },
        [{ en: "Provide reusable mugs instead", bm: "Sediakan cawan guna semula sebagai ganti" }, { en: "Add bins for accepted disposable cups", bm: "Tambah tong bagi cawan pakai buang yang diterima" }, { en: "Arrange more frequent rubbish collection", bm: "Atur kutipan sampah yang lebih kerap" }], 0),
      Q("A4", { en: "A community donates usable furniture for another household to use. Which 3R action is this?", bm: "Komuniti menyumbangkan perabot yang masih boleh digunakan kepada isi rumah lain. Apakah amalan 3R ini?" },
        [{ en: "Material recycling", bm: "Kitar semula bahan" }, { en: "Reuse", bm: "Guna semula" }, { en: "Source reduction during manufacture", bm: "Pengurangan di punca semasa pembuatan" }], 1),
      Q("A5", { en: "Which process creates a useful product from suitable organic waste?", bm: "Proses manakah menghasilkan produk berguna daripada sisa organik yang sesuai?" },
        [{ en: "Mixing it into glass recycling", bm: "Mencampurkannya dengan kaca kitar semula" }, { en: "Storing it with metal scrap", bm: "Menyimpannya bersama besi buruk" }, { en: "Composting it for use in soil", bm: "Mengkomposkannya untuk kegunaan tanah" }], 2)]
  };
  const formFor = () => { const pre = S.getJSON("trk-pre", null); if (pre && pre.form) return pre.form;
    const a = audFor(profile()) || WQ.aud; return a === "kids" ? "kids" : a === "teens" ? "teens" : "adults"; };
  const preDone = () => !!S.getJSON("trk-pre", null);

  const SCALE = {
    kids: [{ en: "No", bm: "Tidak" }, { en: "Maybe not", bm: "Mungkin tidak" }, { en: "Not sure", bm: "Tidak pasti" }, { en: "Maybe yes", bm: "Mungkin ya" }, { en: "Yes!", bm: "Ya!" }],
    agree: [{ en: "Strongly disagree", bm: "Sangat tidak setuju" }, { en: "Disagree", bm: "Tidak setuju" }, { en: "Neutral", bm: "Berkecuali" }, { en: "Agree", bm: "Setuju" }, { en: "Strongly agree", bm: "Sangat setuju" }],
    fun: [{ en: "Not at all", bm: "Langsung tidak" }, { en: "A little", bm: "Sedikit" }, { en: "Somewhat", bm: "Agak seronok" }, { en: "A lot", bm: "Seronok" }, { en: "Very much", bm: "Sangat seronok" }],
    ease: [{ en: "Very hard", bm: "Sangat sukar" }, { en: "Hard", bm: "Sukar" }, { en: "Neither", bm: "Sederhana" }, { en: "Easy", bm: "Mudah" }, { en: "Very easy", bm: "Sangat mudah" }]
  };
  const FACES = ["😞", "🙁", "😐", "🙂", "😄"];
  const SURVEY = [
    { id: "S1", q: { kids: { en: "This week, will you help separate your waste at home?", bm: "Minggu ini, adakah anda akan membantu mengasingkan sisa di rumah?" },
      adults: { en: "I will separate my waste at home this week.", bm: "Saya akan mengasingkan sisa di rumah minggu ini." } }, sc: "intent" },
    { id: "S2", q: { kids: { en: "Will you try one waste-to-wealth activity (like compost or a lab)?", bm: "Adakah anda akan mencuba satu aktiviti sisa kepada kekayaan (seperti kompos atau makmal)?" },
      adults: { en: "I will try one waste-to-wealth activity (such as composting or a lab).", bm: "Saya akan mencuba satu aktiviti sisa kepada kekayaan (seperti pengkomposan atau makmal)." } }, sc: "intent" },
    { id: "S3", q: { kids: { en: "How much did you enjoy WasteQuest today?", bm: "Sejauh manakah anda seronok menggunakan WasteQuest hari ini?" } }, sc: "fun", faces: true },
    { id: "S4", q: { kids: { en: "How easy was WasteQuest to use today?", bm: "Sejauh manakah WasteQuest mudah digunakan hari ini?" } }, sc: "ease" }];

  WQ.css("trk", `
.dt-wrap{max-width:720px;margin:0 auto}
.dt-p{padding:16px;margin:0 0 16px}
.dt-p h2{font:700 1.35rem "Pixelify Sans",monospace;margin:0 0 8px}
.dt-p p{font-size:1.05rem;line-height:1.5;margin:0 0 10px}
.dt-opts{display:grid;gap:8px;margin:10px 0}
.dt-opts .tw-btn{justify-content:flex-start;text-align:left;font:600 1.05rem Nunito,system-ui,sans-serif;padding:8px 12px;min-height:48px;white-space:normal}
.dt-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between;margin-top:10px}
.dt-scale{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:8px 0}
.dt-scale .tw-btn{flex-direction:column;padding:6px 2px;font:600 .8rem Nunito,system-ui,sans-serif;white-space:normal;min-height:56px;line-height:1.15}
.dt-scale .f{font-size:1.6rem}
.dt-code{font:700 1.2rem "Pixelify Sans",monospace;background:#fff;border:3px solid #1a1932;padding:2px 8px;display:inline-block}
.dt-bar{position:fixed;left:6px;right:6px;bottom:6px;z-index:50;max-width:760px;margin:0 auto;padding:6px 8px;font-size:.9rem;line-height:1.25;display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;justify-content:space-between}
.dt-bar .b{display:flex;gap:6px;align-items:center}.dt-bar a{color:#1a1932;font-weight:800}
.dt-bar .tw-btn{min-height:36px;padding:0 10px;font-size:.9rem;box-shadow:2px 2px 0 #5d6a7c}
.dt-bar p{margin:0 0 6px;line-height:1.4}
.dt-st{font-weight:800}
@media (max-width:420px){.dt-scale{grid-template-columns:1fr}.dt-scale .tw-btn{flex-direction:row;gap:8px;justify-content:flex-start;padding:6px 10px;font-size:.95rem;min-height:44px}.dt-scale .f{font-size:1.3rem}}
`);

  /* ---------- non-home first visit: slim notice bar (home shows it inside the welcome dialog) ---------- */
  let bar = null;
  function hideBar() { if (bar) { bar.remove(); bar = null; } }
  // shown once per device; moving on without answering = notice given (opt-out stays in #/privacy)
  function maybeBar(view) {
    if (bar && !consentState()) return consent("yes");
    if (consentState() || S.get("trk-bar") || view === "home" || view === "privacy" || view === "event") return hideBar();
    S.set("trk-bar", "1");
    bar = document.createElement("div"); bar.className = "dt-bar tw-px"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", t(T.privT));
    bar.innerHTML = `<span>${e(t(T.short))}</span><span class="b"><a href="#/privacy">${e(t(T.more))}</a>
      <button type="button" class="tw-btn alt" data-c="no">${e(t(T.no))}</button><button type="button" class="tw-btn" data-c="yes">${e(t(T.ok))}</button></span>`;
    bar.querySelectorAll("[data-c]").forEach(b => b.onclick = () => consent(b.dataset.c));
    document.body.appendChild(bar);
  }

  /* ---------- post-check offer after the 3rd badge (once) ---------- */
  function maybeOfferPost() {
    if (!preDone() || S.getJSON("trk-post", null) || S.get("trk-postoffer") || Object.keys(WQ.earned()).length < 3 || consentState() === "no") return;
    S.set("trk-postoffer", "1");
    const d = document.createElement("div"); d.className = "dt-bar tw-px"; d.setAttribute("role", "status");
    d.innerHTML = `<b>${e(t(T.offerT))}</b><span class="b"><button type="button" class="tw-btn alt">${e(t(T.later))}</button><a class="tw-btn" href="#/check/post">${e(t(T.start))}</a></span>`;
    d.querySelector("button").onclick = () => d.remove(); d.querySelector("a").onclick = () => d.remove();
    setTimeout(() => document.body.appendChild(d), 3500);
  }

  /* ---------- pages ---------- */
  WQ.registerPage("privacy", { mount(el) {
    const draw = () => { const on = consentState() !== "no";
      el.innerHTML = WQ.head("🔒", T.privT, T.privS) + `<div class="dt-wrap"><section class="dt-p tw-px"><h2>${e(t(T.nT))}</h2>${noticeHTML()}
        <p class="dt-st" aria-live="polite">${e(t(on ? T.stOn : T.stOff))}</p>
        <div class="dt-row"><button type="button" class="tw-btn alt" id="dtOff" aria-pressed="${!on}">${e(t(T.no))}</button>
        ${consentState() === "" ? `<button type="button" class="tw-btn" id="dtOk">${e(t(T.ok))}</button>` : ""}</div></section>
        <section class="dt-p tw-px"><p>${e(t(T.code))} <span class="dt-code">${e(pid)}</span></p>
        <p class="small">${load().length} ${e(t(T.waiting))}</p>
        <button type="button" class="tw-btn alt" id="dtNew">${e(t(T.newP))}</button></section>
        <section class="dt-p tw-px"><h2>${e(t(T.chkT))}</h2><p>${e(t(T.chkS))}</p><p><a href="#/check">${e(t(T.chkT))} ▶</a></p></section></div>`;
      el.querySelector("#dtOff").onclick = () => { consent(on ? "no" : "yes"); draw(); el.querySelector("#dtOff").focus(); };
      const ok = el.querySelector("#dtOk"); if (ok) ok.onclick = () => { consent("yes"); draw(); };
      el.querySelector("#dtNew").onclick = () => { if (!confirm(t(T.newPq))) return;
        ["trk-pid", "trk-profile", "trk-pre", "trk-post", "trk-survey", "trk-postoffer", "trk-first", "trk-visits"].forEach(k => { try { localStorage.removeItem("wq-" + k); } catch (er) {} });
        location.reload(); };
    };
    draw();
  } });

  let run = null;                       // in-progress check state survives language re-mount
  WQ.registerPage("check", { mount(el, { args, relang }) {
    const kind = args[0] || "", rec = k => S.getJSON("trk-" + k, null);
    if (!/^(pre|post|survey)$/.test(kind)) {
      el.innerHTML = WQ.head("📝", T.chkT, T.chkS) + `<div class="dt-wrap"><div class="dt-opts">${["pre", "post", "survey"].map(k =>
        `<a class="tw-btn alt" href="#/check/${k}">${e(t(T[k]))}${rec(k) ? ` ✓ ${e(t(T.done))}` : ""}</a>`).join("")}</div></div>`;
      return;
    }
    const offNote = consentState() === "no" ? `<p class="small">${e(t(T.off))}</p>` : "";
    if (kind === "survey") return survey(el, offNote);
    const form = formFor(), items = FORMS[form];
    if (!run || run.kind !== kind || (!relang && run.i === 99)) run = { kind, i: 0, score: 0, answered: 0, order: items.map(() => WQ.shuffle([0, 1, 2])) };
    const finish = () => { S.setJSON("trk-" + kind, { form, score: run.score, n: run.answered, at: today() });
      log(kind + "_done", { module: "check/" + form, score: run.score, max: 5, value: run.answered }); run.i = 99; draw(); };
    const next = () => { run.i++; if (run.i >= items.length) finish(); else draw(); };
    const draw = () => {
      if (run.i >= items.length) {
        el.innerHTML = `<div class="dt-wrap"><section class="dt-p tw-px"><h2>${e(t(T.thanks))}</h2><p>${e(t(T.thanksS))}</p>
          <div class="dt-row">${kind === "post" ? `<a class="tw-btn alt" href="#/check/survey">${e(t(T.toSurvey))}</a>` : "<span></span>"}<a class="tw-btn" href="#/home">${e(t(T.toTown))}</a></div></section></div>`;
        el.querySelector("a.tw-btn").focus(); return;
      }
      const it = items[run.i];
      el.innerHTML = WQ.head("📝", kind === "pre" ? T.pre : T.post, T.preNote) + `<div class="dt-wrap"><section class="dt-p tw-px" aria-labelledby="dtQ">
        <p class="small">${e(t(T.qOf))} ${run.i + 1} ${e(t(T.of))} ${items.length}</p><h2 id="dtQ">${e(t(it.q))}</h2>
        <div class="dt-opts" role="group" aria-labelledby="dtQ">${run.order[run.i].map(o => `<button type="button" class="tw-btn alt" data-o="${o}">${e(t(it.a[o]))}</button>`).join("")}</div>
        <div class="dt-row"><button type="button" class="tw-btn alt" data-k="stop">${e(t(T.stop))}</button><button type="button" class="tw-btn alt" data-k="skip">${e(t(T.skipQ))}</button></div>${offNote}</section></div>`;
      el.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { const o = +b.dataset.o, ok = o === it.c ? 1 : 0;
        log(kind, { module: "check/" + form, item: it.id, answer: o, score: ok }); run.score += ok; run.answered++; next(); });
      el.querySelector("[data-k=skip]").onclick = () => { log(kind, { module: "check/" + form, item: it.id, answer: "skip" }); next(); };
      el.querySelector("[data-k=stop]").onclick = finish;
      el.querySelector("#dtQ").setAttribute("tabindex", "-1"); el.querySelector("#dtQ").focus();
    };
    draw();
  } });

  function survey(el, offNote) {
    const kid = (audFor(profile()) || WQ.aud) === "kids", ans = {};
    const scaleOf = s => s.sc === "intent" ? (kid ? SCALE.kids : SCALE.agree) : SCALE[s.sc];
    el.innerHTML = WQ.head("📋", T.survey, T.survI) + `<div class="dt-wrap">${SURVEY.map(s => `<section class="dt-p tw-px" role="group" aria-labelledby="dt${s.id}">
      <h2 id="dt${s.id}">${e(t(kid || !s.q.adults ? s.q.kids : s.q.adults))}</h2><div class="dt-scale">${scaleOf(s).map((l, i) =>
        `<button type="button" class="tw-btn alt" data-s="${s.id}" data-v="${i + 1}" aria-pressed="false">${s.faces ? `<span class="f" aria-hidden="true">${FACES[i]}</span>` : `<span class="f" aria-hidden="true" style="font:700 1.1rem 'Pixelify Sans',monospace">${i + 1}</span>`}<span>${e(t(l))}</span></button>`).join("")}</div></section>`).join("")}
      <div class="dt-row"><a class="tw-btn alt" href="#/home">${e(t(T.skipS))}</a><button type="button" class="tw-btn" id="dtSend">${e(t(T.send))}</button></div>${offNote}</div>`;
    el.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { ans[b.dataset.s] = +b.dataset.v;
      el.querySelectorAll(`[data-s=${b.dataset.s}]`).forEach(x => x.setAttribute("aria-pressed", x === b)); });
    el.querySelector("#dtSend").onclick = () => {
      Object.entries(ans).forEach(([id, v]) => log("survey", { module: kid ? "survey/kids" : "survey/main", item: id, value: v }));
      S.setJSON("trk-survey", { at: today(), n: Object.keys(ans).length });
      el.innerHTML = `<div class="dt-wrap"><section class="dt-p tw-px"><h2>${e(t(T.thanks))}</h2><div class="dt-row"><span></span><a class="tw-btn" href="#/home">${e(t(T.toTown))}</a></div></section></div>`;
      el.querySelector("a").focus(); flush();
    };
  }

  WQ.data = { log, flush, pid, sid, PROFILE, profile, setProfile, consent, consentState, noticeHTML, preDone,
    queued: () => load().length, T };
})();
