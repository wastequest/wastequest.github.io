/* WasteQuest v2 creator page #/creator (not linked anywhere). Explains and links to the private Apps Script
   dashboard (Google sign-in, owner only). Never shows raw data itself. SOURCES: none (no facts). */
(() => {
  if (typeof WQ === "undefined") return;
  const DASH_URL = "https://script.google.com/macros/s/AKfycbzt65YEnfjxX9Pbg83-x2pnvMtgnQf9nblUsf5GZhe5fMG197U4Ab6zxbX8uJYY-qEY/exec?view=dashboard";   // Apps Script "Only myself" deployment URL + "?view=dashboard" (see data_backend/SETUP_GUIDE.md)
  const T = {
    h: { en: "Creator", bm: "Pencipta" }, s: { en: "For the WasteQuest team only.", bm: "Untuk pasukan WasteQuest sahaja." },
    p1: { en: "The dashboard shows totals only: players, visits, age bands, learning gain, completion, drop-off and survey results. Groups under 5 players are hidden.",
          bm: "Papan pemuka menunjukkan jumlah sahaja: pemain, lawatan, kumpulan umur, peningkatan pembelajaran, penyiapan, keciciran dan keputusan tinjauan. Kumpulan bawah 5 pemain disembunyikan." },
    p2: { en: "Google will ask you to sign in. Only the owner's account can open it. Raw records stay in the private Google Sheet.",
          bm: "Google akan meminta anda log masuk. Hanya akaun pemilik boleh membukanya. Rekod mentah kekal dalam Google Sheet peribadi." },
    open: { en: "Open dashboard (Google sign-in) ↗", bm: "Buka papan pemuka (log masuk Google) ↗" },
    none: { en: "Dashboard link not set yet. See data_backend/SETUP_GUIDE.md.", bm: "Pautan papan pemuka belum ditetapkan. Lihat data_backend/SETUP_GUIDE.md." },
    q: { en: "Events waiting on this device:", bm: "Rekod menunggu pada peranti ini:" }
  };
  WQ.registerPage("creator", { mount(el) {
    const t = o => WQ.esc(WQ.t(o));
    el.innerHTML = WQ.head("📊", T.h, T.s) + `<div class="dt-wrap"><section class="dt-p tw-px"><p>${t(T.p1)}</p><p>${t(T.p2)}</p>
      <p>${DASH_URL ? `<a class="tw-btn" href="${WQ.esc(DASH_URL)}" target="_blank" rel="noopener">${t(T.open)}</a>` : t(T.none)}</p>
      <p class="small">${t(T.q)} ${WQ.data ? WQ.data.queued() : 0}</p></section></div>`;
  } });
})();
