// SOURCES:
//  - TensorFlow.js (Apache-2.0) https://github.com/tensorflow/tfjs ; MobileNet model package (Apache-2.0)
//    https://github.com/tensorflow/tfjs-models/tree/master/mobilenet (general ImageNet classes, NOT a waste model).
//  - SWCorp / PLANMalaysia recycling colours: blue = paper, orange = plastic & aluminium/metal, brown = glass (SPEC.md; research/v2/10_innovation.md §1.5).
//  - Design rules (suggest + player corrects, "I may be wrong", no upload, no stored images, manual fallback,
//    hazardous never decided by AI, local rules differ): research/v2/10_innovation.md §1.1, §1.4, §1.5.
// Route: #/scan. Emits WQ.emit("scan", material). Logs WQ.data.log("scan", {material, ai, fixed, src}) if present.
// Privacy: camera frames and chosen photos stay in memory on this device only; nothing is uploaded or stored.
(() => {
  if (typeof WQ === "undefined") return;
  const L = (en, bm) => ({ en, bm });
  const T = {
    title: L("Scan & Sort", "Imbas & Asing"),
    sub: L("Show the camera a piece of rubbish. I'll guess what it's made of, you check, then we find the right bin.",
           "Tunjukkan sampah kepada kamera. Saya teka bahan apa, anda semak, kemudian kita cari tong yang betul."),
    kid: L("Ask an adult before using the camera. Only scan clean, empty things. Never touch broken glass, sharp items, batteries or chemicals.",
           "Minta izin orang dewasa sebelum guna kamera. Imbas barang yang bersih dan kosong sahaja. Jangan sentuh kaca pecah, barang tajam, bateri atau bahan kimia."),
    priv: L("Pictures stay on this device. Nothing is uploaded or saved. Only the material you pick is counted (coded, no names).",
            "Gambar kekal dalam peranti ini. Tiada yang dimuat naik atau disimpan. Hanya bahan yang anda pilih dikira (berkod, tanpa nama)."),
    cam: L("📷 Open camera", "📷 Buka kamera"), photo: L("🖼️ Pick from photo", "🖼️ Pilih daripada foto"),
    self: L("✋ Choose myself", "✋ Pilih sendiri"), snap: L("🔍 Scan", "🔍 Imbas"), close: L("✖ Close camera", "✖ Tutup kamera"),
    load: L("Getting the scanner ready (first time downloads a few MB)…", "Menyediakan pengimbas (kali pertama memuat turun beberapa MB)…"),
    look: L("Looking…", "Sedang melihat…"),
    noCam: L("Camera not available or not allowed. That's fine: pick a photo or choose yourself.",
             "Kamera tiada atau tidak dibenarkan. Tidak mengapa: pilih foto atau pilih sendiri."),
    noAI: L("The scanner could not load (maybe offline). You can still choose yourself.",
            "Pengimbas tidak dapat dimuatkan (mungkin luar talian). Anda masih boleh pilih sendiri."),
    guess: L("I think it's", "Saya rasa ia"), maybe: L("or maybe", "atau mungkin"),
    wrong: L("I may be wrong! Is it right? Tap the correct material.", "Saya mungkin tersilap! Betulkah? Tekan bahan yang betul."),
    unsure: L("I'm not sure what this is. Please choose yourself.", "Saya tidak pasti apa ini. Sila pilih sendiri."),
    sure: { hi: L("fairly sure", "agak pasti"), mid: L("a little sure", "kurang pasti"), lo: L("just guessing", "hanya meneka") },
    pick: L("What is it made of?", "Diperbuat daripada apa?"),
    again: L("🔁 Scan another", "🔁 Imbas lagi"),
    local: L("Bin rules can differ by council; check your local rules.", "Peraturan tong boleh berbeza mengikut majlis; semak peraturan tempatan anda."),
    clean: L("Empty it and give it a quick rinse first. Dirty or greasy items can spoil a whole bin of recycling.",
             "Kosongkan dan bilas sedikit dahulu. Barang kotor atau berminyak boleh merosakkan satu tong kitar semula."),
  };
  // material -> label, icon, bin advice
  const M = {
    paper:   { i: "📄", n: L("Paper & cardboard", "Kertas & kadbod"), bin: "blue", rec: 1 },
    plastic: { i: "🧴", n: L("Plastic", "Plastik"), bin: "orange", rec: 1 },
    metal:   { i: "🥫", n: L("Metal / aluminium can", "Logam / tin aluminium"), bin: "orange", rec: 1 },
    glass:   { i: "🍾", n: L("Glass", "Kaca"), bin: "brown", rec: 1 },
    food:    { i: "🍌", n: L("Food waste", "Sisa makanan"), bin: "food" },
    garden:  { i: "🍂", n: L("Garden waste", "Sisa kebun"), bin: "food" },
    textile: { i: "👕", n: L("Clothes & fabric", "Pakaian & kain"), bin: "textile" },
    ewaste:  { i: "📱", n: L("E-waste (electronics)", "E-sisa (elektronik)"), bin: "special" },
    hazardous: { i: "⚠️", n: L("Hazardous (batteries, medicine, chemicals)", "Berbahaya (bateri, ubat, bahan kimia)"), bin: "special" },
    mixed:   { i: "❓", n: L("Not sure / mixed", "Tidak pasti / campuran"), bin: "general" },
  };
  const BIN = {
    blue:   { c: "#0098dc", h: L("Blue recycling bin", "Tong kitar semula BIRU"), d: L("Paper, newspaper, boxes and cardboard. Flatten boxes; keep them dry.", "Kertas, surat khabar, kotak dan kadbod. Leperkan kotak; pastikan kering.") },
    orange: { c: "#f68a2b", h: L("Orange recycling bin", "Tong kitar semula OREN"), d: L("Plastic bottles and containers, aluminium and metal cans.", "Botol dan bekas plastik, tin aluminium dan logam.") },
    brown:  { c: "#8a4836", h: L("Brown recycling bin", "Tong kitar semula PERANG"), d: L("Glass bottles and jars. Never put broken glass in by hand: ask an adult to wrap it.", "Botol dan balang kaca. Jangan masukkan kaca pecah dengan tangan: minta orang dewasa membalutnya.") },
    food:   { c: "#5ac54f", h: L("Compost it, don't bin it", "Kompos, jangan buang"), d: L("Fruit and vegetable scraps, peels and leaves can become compost or eco-enzyme instead of rotting in a landfill.", "Sisa buah dan sayur, kulit dan daun boleh dijadikan kompos atau eko-enzim, bukan reput di tapak pelupusan."),
              links: [["lab/compost", L("🪱 Compost lab", "🪱 Makmal kompos")], ["lab/enzyme", L("🍊 Eco-enzyme lab", "🍊 Makmal eko-enzim")], ["game/compost", L("🌱 Compost Farm sim", "🌱 Simulasi Ladang Kompos")]] },
    textile:{ c: "#b55088", h: L("Reuse, repair or donate", "Guna semula, baiki atau derma"), d: L("Clothes in good condition can be donated; old fabric can be upcycled. Some areas have textile collection bins.", "Pakaian yang elok boleh didermakan; kain lama boleh dikitar naik. Sesetengah kawasan ada tong kutipan tekstil."),
              links: [["lab/sleepbag", L("🛌 Sleeping-bag lab", "🛌 Makmal beg tidur")], ["lab/fused", L("☂️ Fused-plastic lab", "☂️ Makmal plastik cantum")]] },
    special:{ c: "#e43b44", h: L("Special collection: NOT in any household bin", "Kutipan khas: BUKAN dalam mana-mana tong rumah"), d: L("Ask an adult. Take it to an e-waste or hazardous-waste collection point or a shop take-back scheme. Never burn it, break it or put it in the rubbish or recycling bins.", "Minta bantuan orang dewasa. Bawa ke pusat kutipan e-sisa atau sisa berbahaya, atau skim pulangan kedai. Jangan bakar, pecahkan atau masukkan ke dalam tong sampah atau tong kitar semula.") },
    general:{ c: "#5d5d73", h: L("General waste (if you really can't sort it)", "Sisa am (jika memang tidak dapat diasingkan)"), d: L("Check if it can be reused first. Mixed or dirty items usually go in the normal rubbish bin.", "Semak dahulu jika boleh diguna semula. Barang campuran atau kotor biasanya masuk ke tong sampah biasa.") },
  };
  // ImageNet class name (lower-case) keyword -> material. First match wins, so specific words come first.
  const MAP = [
    [/beer bottle|wine bottle|beer glass|goblet|red wine|vase|perfume|whiskey jug|cocktail shaker|wine/, "glass"],
    [/pill bottle|syringe|lighter|band aid|hair spray|lotion|sunscreen/, "hazardous"],
    [/water bottle|pop bottle|soda bottle|plastic bag|water jug|bucket|pail|shower cap|soap dispenser|tray|ladle|toothbrush|swab|crate|packet/, "plastic"],
    [/\bcan\b|tin|milk can|frying pan|wok|caldron|dutch oven|spatula|strainer|teapot|coffeepot|chain|nail|screw|padlock|safety pin|spoon/, "metal"],
    [/carton|envelope|paper|tissue|book|comic|menu|crossword|notebook|binder|cardboard|bag|newspaper|jigsaw|carton|toilet/, "paper"],
    [/cellular|telephone|laptop|ipod|remote control|mouse|keyboard|monitor|screen|desktop|computer|modem|hard disc|television|radio|loudspeaker|joystick|printer|digital|charger|switch|cassette|camera|calculator|hair dryer|iron/, "ewaste"],
    [/jersey|t-shirt|sweatshirt|jean|sock|cardigan|wool|pajama|skirt|apron|towel|dishrag|quilt|sleeping bag|shirt|suit|gown|kimono|cloak|stole|sarong|bib|velvet|handkerchief/, "textile"],
    [/daisy|leaf|hay|acorn|buckeye|rapeseed|pot|flowerpot|corn|bearb|mushroom|agaric|bolete|hip|rose|sunflower/, "garden"],
    [/banana|orange|lemon|granny smith|apple|strawberry|pineapple|fig|pomegranate|jackfruit|custard apple|cabbage|broccoli|cauliflower|cucumber|zucchini|squash|pepper|bagel|pretzel|loaf|pizza|hotdog|burger|meat|carbonara|guacamole|potpie|burrito|egg|dough|mashed|trifle|ice cream|consomme|soup|melon|artichoke|cardoon|chocolate|espresso/, "food"],
  ];
  const toMat = name => { const s = name.toLowerCase(); for (const [re, m] of MAP) if (re.test(s)) return m; return null; };

  const CSS = `.sc-wrap{max-width:820px;margin:0 auto;display:grid;gap:14px}
.sc-p{background:#f9e6cf;border:3px solid #1a1932;box-shadow:4px 4px 0 rgba(26,25,50,.35);padding:14px;color:#1a1932;font-size:17px}
.sc-p h2,.sc-p h3{font-family:"Pixelify Sans",system-ui,sans-serif;margin:0 0 8px}
.sc-btns{display:flex;flex-wrap:wrap;gap:10px}
.sc-b{font:600 17px "Pixelify Sans",system-ui,sans-serif;background:#1a1932;color:#fff;border:3px solid #1a1932;padding:10px 14px;cursor:pointer;min-height:48px;text-decoration:none;display:inline-flex;align-items:center}
.sc-b.lt{background:#f9e6cf;color:#1a1932}.sc-b:focus-visible,.sc-m:focus-visible{outline:3px solid #0098dc;outline-offset:2px}
.sc-b[disabled]{opacity:.5;cursor:wait}
.sc-vid{width:100%;max-height:60vh;background:#1a1932;border:3px solid #1a1932;display:block;object-fit:cover}
.sc-mats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.sc-m{background:#fff;border:3px solid #1a1932;padding:10px;min-height:64px;display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700;text-align:left;cursor:pointer;color:#1a1932}
.sc-m .i{font-size:28px}.sc-m[aria-pressed=true]{background:#ffeb57;box-shadow:inset 0 0 0 3px #1a1932}
.sc-bin{display:flex;gap:14px;align-items:flex-start}
.sc-can{flex:0 0 64px;height:80px;border:3px solid #1a1932;position:relative}
.sc-can:before{content:"";position:absolute;left:-7px;right:-7px;top:-12px;height:9px;background:inherit;border:3px solid #1a1932}
.sc-warn{border-left:8px solid #e43b44}.sc-kid{border-left:8px solid #ffeb57}
.sc-small{font-size:15px;opacity:.85}`;

  let tfP = null;
  const addScript = src => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const model = () => tfP = tfP || (async () => {
    if (!window.tf) await addScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
    if (!window.mobilenet) await addScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js");
    return window.mobilenet.load({ version: 2, alpha: 1.0 });
  })().catch(e => { tfP = null; throw e; });

  WQ.registerPage("scan", { mount(el) {
    WQ.css("scan", CSS);
    const t = WQ.t, e = WQ.esc;
    let stream = null, ai = null, aiTop = null, src = "manual";
    el.innerHTML = WQ.head("📷", T.title, T.sub) + `<div class="sc-wrap">
      <div class="sc-p sc-kid" role="note">🧑‍🤝‍🧑 ${e(t(T.kid))}</div>
      <div class="sc-p"><div class="sc-btns">
        <button class="sc-b" id="scCam">${t(T.cam)}</button>
        <label class="sc-b lt" for="scFile">${t(T.photo)}</label><input type="file" id="scFile" accept="image/*" hidden>
        <button class="sc-b lt" id="scSelf">${t(T.self)}</button></div>
        <p class="sc-small">🔒 ${e(t(T.priv))}</p></div>
      <div class="sc-p" id="scCamBox" hidden><video class="sc-vid" id="scVid" playsinline muted autoplay aria-label="${e(t(T.title))}"></video>
        <div class="sc-btns" style="margin-top:10px"><button class="sc-b" id="scSnap" disabled>${t(T.snap)}</button><button class="sc-b lt" id="scClose">${t(T.close)}</button></div></div>
      <div id="scMsg" class="sc-p" aria-live="polite" hidden></div>
      <div class="sc-p" id="scPick" hidden><h2>${t(T.pick)}</h2><div class="sc-mats" role="group" aria-label="${e(t(T.pick))}">${
        Object.entries(M).map(([k, m]) => `<button class="sc-m" data-m="${k}" aria-pressed="false"><span class="i" aria-hidden="true">${m.i}</span>${e(t(m.n))}</button>`).join("")}</div></div>
      <div id="scRes" aria-live="polite"></div></div>`;
    const $ = s => el.querySelector(s), msg = (h, show = true) => { $("#scMsg").hidden = !show; $("#scMsg").innerHTML = h; };
    const stop = () => { if (stream) stream.getTracks().forEach(tr => tr.stop()); stream = null; $("#scCamBox").hidden = true; };
    const showPick = () => { $("#scPick").hidden = false; };
    const loadAI = async () => { if (ai) return ai; msg("⏳ " + e(t(T.load))); try { ai = await model(); msg("", false); return ai; } catch (er) { msg("⚠️ " + e(t(T.noAI))); showPick(); return null; } };

    const classify = async img => {
      const m = await loadAI(); if (!m) return;
      msg("🔍 " + e(t(T.look)));
      let preds = [];
      try { preds = await m.classify(img, 10); } catch (er) { msg("⚠️ " + e(t(T.noAI))); showPick(); return; }
      const score = {};
      preds.forEach(p => { const k = toMat(p.className); if (k) score[k] = (score[k] || 0) + p.probability; });
      const top = Object.entries(score).sort((a, b) => b[1] - a[1]);
      showPick(); $("#scRes").innerHTML = "";
      el.querySelectorAll(".sc-m").forEach(b => b.setAttribute("aria-pressed", "false"));
      if (!top.length || top[0][1] < .12) { aiTop = null; msg("🤔 " + e(t(T.unsure))); return; }
      const [k, p] = top[0], w = p > .6 ? T.sure.hi : p > .3 ? T.sure.mid : T.sure.lo;
      aiTop = k; el.querySelector(`.sc-m[data-m="${k}"]`).setAttribute("aria-pressed", "true");
      msg(`<h3>${t(T.guess)}: ${M[k].i} ${e(t(M[k].n))} <span class="sc-small">(${e(t(w))})</span></h3>` +
        (top[1] ? `<p>${t(T.maybe)} ${M[top[1][0]].i} ${e(t(M[top[1][0]].n))}</p>` : "") + `<p><b>${e(t(T.wrong))}</b></p>`);
    };

    const choose = k => {
      el.querySelectorAll(".sc-m").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.m === k)));
      const m = M[k], b = BIN[m.bin], links = (b.links || []).map(([h, l]) => `<a class="sc-b lt" href="#/${h}">${e(t(l))}</a>`).join("");
      $("#scRes").innerHTML = `<div class="sc-p ${m.bin === "special" ? "sc-warn" : ""}"><div class="sc-bin">
        <div class="sc-can" style="background:${b.c}" aria-hidden="true"></div><div>
        <h2>${m.i} ${e(t(m.n))} → ${e(t(b.h))}</h2><p>${e(t(b.d))}</p>${m.rec ? `<p>🚿 ${e(t(T.clean))}</p>` : ""}
        ${links ? `<div class="sc-btns">${links}</div>` : ""}<p class="sc-small">ℹ️ ${e(t(T.local))}</p>
        <div class="sc-btns"><button class="sc-b" id="scAgain">${t(T.again)}</button></div></div></div></div>`;
      $("#scAgain").onclick = () => { $("#scRes").innerHTML = ""; msg("", false); aiTop = null; scrollTo(0, 0); };
      WQ.emit("scan", k);
      try { WQ.data && WQ.data.log && WQ.data.log("scan", { material: k, ai: aiTop, fixed: !!aiTop && aiTop !== k, src }); } catch (er) {}
      $("#scRes").scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    el.querySelectorAll(".sc-m").forEach(b => b.onclick = () => choose(b.dataset.m));

    $("#scSelf").onclick = () => { stop(); src = "manual"; aiTop = null; msg("", false); showPick(); $("#scPick button").focus(); };
    $("#scCam").onclick = async () => {
      src = "camera";
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        const v = $("#scVid"); v.srcObject = stream; $("#scCamBox").hidden = false; await v.play().catch(() => {});
        $("#scSnap").disabled = !(await loadAI());
      } catch (er) { stop(); msg("📵 " + e(t(T.noCam))); showPick(); }
    };
    $("#scSnap").onclick = async () => { const s = $("#scSnap"); s.disabled = true; await classify($("#scVid")); s.disabled = false; };
    $("#scClose").onclick = stop;
    $("#scFile").onchange = ev => {
      const f = ev.target.files && ev.target.files[0]; if (!f) return;
      src = "photo"; stop();
      const url = URL.createObjectURL(f), img = new Image();
      img.onload = async () => { await classify(img); URL.revokeObjectURL(url); ev.target.value = ""; };
      img.onerror = () => { URL.revokeObjectURL(url); msg("⚠️ " + e(t(T.noAI))); showPick(); };
      img.src = url;
    };
    const vis = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", vis);
    return () => { stop(); document.removeEventListener("visibilitychange", vis); };
  } });
})();
