/* WasteQuest v2 — #/share for teachers and partners: QR + link, embed snippet, Google Classroom links, downloads.
   Also handles ?embed=1 (hides the footer; language toggle stays). QR lib: qrcodejs 1.0.0 from cdnjs, loaded only on this page. */
(() => {
  const W = WQ, L = (en, bm) => ({ en, bm }), X = o => W.esc(W.t(o));
  if (new URLSearchParams(location.search).get("embed") === "1") {
    document.body.classList.add("wq-embed");
    document.head.insertAdjacentHTML("beforeend", "<style>body.wq-embed .v2foot{display:none}</style>");
  }
  const T = {
    title: L("Share WasteQuest", "Kongsi WasteQuest"),
    sub: L("For teachers and partners: a QR code, a website embed, Google Classroom links and downloads.", "Untuk guru dan rakan kongsi: kod QR, benaman laman web, pautan Google Classroom dan muat turun."),
    qr: L("QR code and link", "Kod QR dan pautan"),
    qrNote: L("Show this on a screen or print it. Scanning opens WasteQuest straight away; no sign-up.", "Paparkan pada skrin atau cetak. Imbasan terus membuka WasteQuest; tiada pendaftaran."),
    qrOff: L("The QR code needs internet to draw. Use the link below instead.", "Kod QR memerlukan internet untuk dilukis. Guna pautan di bawah."),
    copy: L("Copy", "Salin"), copied: L("Copied", "Disalin"), copyFail: L("Select the text and copy it by hand.", "Pilih teks dan salin secara manual."),
    embed: L("Put WasteQuest on your website", "Letak WasteQuest di laman web anda"),
    embedNote: L("Paste this code into your web page. It fits phones and laptops. Embed mode hides the footer; the language button stays.", "Tampal kod ini ke halaman web anda. Ia muat pada telefon dan komputer riba. Mod benaman menyembunyikan bahagian bawah; butang bahasa kekal."),
    cls: L("Google Classroom", "Google Classroom"),
    clsNote: L("Each button opens Google Classroom so you can post that activity to your class.", "Setiap butang membuka Google Classroom supaya anda boleh hantar aktiviti itu kepada kelas anda."),
    games: L("Games and quizzes", "Permainan dan kuiz"), labs: L("Hands-on labs", "Makmal amali"),
    toCls: L("Share to Classroom", "Kongsi ke Classroom"),
    dl: L("Downloads", "Muat turun"),
    dlNote: L("For places with weak internet. The offline file opens in any browser, even from a USB stick.", "Untuk tempat yang internetnya lemah. Fail luar talian dibuka dalam mana-mana pelayar, walaupun dari pemacu USB."),
    off: L("Offline file (one page)", "Fail luar talian (satu halaman)"), pack: L("Offline pack with lab videos (zip)", "Pek luar talian dengan video makmal (zip)"),
    bEN: L("Facilitator booklet (English, PDF)", "Buku panduan fasilitator (Inggeris, PDF)"), bBM: L("Facilitator booklet (Bahasa Melayu, PDF)", "Buku panduan fasilitator (Bahasa Melayu, PDF)"),
  };
  const base = () => location.origin + location.pathname;
  const copyBox = (id, text) => `<div class="sh-copy"><textarea id="${id}" aria-label="${X(T.copy)}: ${id === "shUrl" ? "link" : "embed code"}" readonly rows="${text.length > 90 ? 4 : 1}">${W.esc(text)}</textarea><button class="btn alt" data-copy="${id}">${X(T.copy)}</button></div>`;
  const clsLink = (hash, name) => `<li><span>${X(name)}</span><a class="btn alt" target="_blank" rel="noopener" href="https://classroom.google.com/share?url=${encodeURIComponent(base() + hash)}">${X(T.toCls)}</a></li>`;
  let qrLib = null;
  const loadQR = () => qrLib || (qrLib = new Promise((ok, no) => {
    if (window.QRCode) return ok();
    const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = ok; s.onerror = () => { qrLib = null; no(); }; document.head.appendChild(s);
  }));

  W.registerPage("share", { mount(el) {
    const url = base(), games = Object.values(W.games).sort((a, b) => a.order - b.order), labs = W.labs || [];
    const iframe = `<div style="position:relative;width:100%;max-width:1100px;aspect-ratio:4/5;max-height:90vh;margin:auto"><iframe src="${url}?embed=1#/home" title="WasteQuest" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:12px" allow="camera; fullscreen" loading="lazy"></iframe></div>`;
    el.innerHTML = `<style>.sh-copy{display:flex;gap:8px;align-items:flex-start;margin-top:8px}.sh-copy textarea{flex:1;min-width:0;font:13px/1.4 monospace;padding:8px;border:1px solid #c9d3dd;border-radius:8px;resize:vertical}
      .sh-qr{display:flex;justify-content:center;padding:12px;background:#fff;border-radius:12px;width:max-content;max-width:100%;margin:8px auto}.sh-qr img,.sh-qr canvas{max-width:100%;height:auto}
      .sh-list{list-style:none;padding:0;margin:8px 0}.sh-list li{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e6ecf1}.sh-list .btn{padding:6px 14px;font-size:.9rem;flex:none}
      .sh-dl{display:grid;gap:8px;padding-left:1.2em}</style>` +
      W.head("🔗", T.title, T.sub) +
      `<section class="card"><h2>${X(T.qr)}</h2><p class="small">${X(T.qrNote)}</p><div class="sh-qr" id="shQR" role="img" aria-label="QR code: ${W.esc(url)}"></div>${copyBox("shUrl", url)}</section>
      <section class="card"><h2>${X(T.embed)}</h2><p class="small">${X(T.embedNote)}</p>${copyBox("shEmbed", iframe)}</section>
      <section class="card"><h2>${X(T.cls)}</h2><p class="small">${X(T.clsNote)}</p>
        <h3>${X(T.games)}</h3><ul class="sh-list">${games.map(g => clsLink("#/game/" + g.id, g.title)).join("")}</ul>
        <h3>${X(T.labs)}</h3><ul class="sh-list">${labs.map(l => clsLink("#/lab/" + l.id, l.title)).join("")}</ul></section>
      <section class="card"><h2>${X(T.dl)}</h2><p class="small">${X(T.dlNote)}</p><ul class="sh-dl">
        <li><a href="dist/WasteQuest_offline.html" download>${X(T.off)}</a></li><li><a href="https://github.com/wastequest/wastequest.github.io/releases/download/v2026.1/WasteQuest_offline_pack.zip">${X(T.pack)}</a></li>
        <li><a href="dist/WasteQuest_Booklet_EN.pdf" target="_blank" rel="noopener">${X(T.bEN)}</a></li><li><a href="dist/WasteQuest_Booklet_BM.pdf" target="_blank" rel="noopener">${X(T.bBM)}</a></li></ul></section>`;
    W.$$("[data-copy]", el).forEach(b => b.onclick = async () => {
      const ta = W.$("#" + b.dataset.copy, el);
      try { await navigator.clipboard.writeText(ta.value); W.toast(W.t(T.copied)); } catch (er) { ta.select(); W.toast(W.t(T.copyFail)); }
    });
    const box = W.$("#shQR", el);
    loadQR().then(() => { if (box.isConnected) { new QRCode(box, { text: url, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M }); box.querySelectorAll("img,canvas").forEach(n => n.setAttribute("alt", "")); } })
      .catch(() => { box.textContent = W.t(T.qrOff); });
  } });
})();
