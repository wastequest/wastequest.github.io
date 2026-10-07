/* WasteQuest v2 lab covers + material icons: original procedural pixel art (Endesga 64 palette, #1a1932 outline).
   WQ.labCovers.draw(canvas, labId) -> 160x100 logical cover; WQ.labCovers.icon(canvas, material) -> 16x16 icon.
   No faces, logos or words. SOURCES: own drawings; lab products per js/labs.js. */
(() => {
  if (typeof WQ === "undefined") return;
  const O = "#1a1932", CW = 160, CH = 100;
  let c = null;
  const R = (x, y, w, h, col) => { if (w > 0 && h > 0) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); } };
  const P = (x, y, col) => R(x, y, 1, 1, col);
  function ell(cx, cy, rx, ry, col) { for (let dy = -ry; dy <= ry; dy++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - dy * dy / ((ry + .5) * (ry + .5))))); R(cx - w, cy + dy, 2 * w + 1, 1, col); } }
  function blob(cx, cy, rx, ry, cols) { ell(cx, cy, rx + 1, ry + 1, O); ell(cx, cy, rx, ry, cols[0]); ell(cx - 1, cy - 1, Math.max(0, rx - 1), Math.max(0, ry - 1), cols[1]); if (cols[2]) ell(cx - Math.ceil(rx / 3), cy - Math.ceil(ry / 3), Math.max(0, (rx >> 1) - 1), Math.max(0, (ry >> 1) - 1), cols[2]); }
  // outlined box with left highlight + right shade: cols [shade, mid, light]
  function obox(x, y, w, h, cols) { R(x - 1, y - 1, w + 2, h + 2, O); R(x, y, w, h, cols[1]); R(x, y, 2, h, cols[2] || cols[1]); R(x + w - 2, y, 2, h, cols[0]); }
  function line(x0, y0, x1, y1, col) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) P(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), col); }
  const shadow = (cx, y, rx) => { c.globalAlpha = .35; ell(cx, y, rx, 2, O); c.globalAlpha = 1; };
  const GRN = ["#1e6f50", "#33984b", "#5ac54f"], LEAF = ["#33984b", "#5ac54f", "#99e65f"];

  // backdrop: wall (2 tones, dithered seam) + wooden table top with plank lines
  function scene(wall, wall2, table = ["#5d2c28", "#8a4836", "#bf6f4a"]) {
    R(0, 0, CW, 70, wall); R(0, 0, CW, 6, wall2);
    for (let x = 0; x < CW; x += 2) P(x, 6, wall2);
    for (let y = 14; y < 66; y += 12) for (let x = (y % 24 ? 6 : 0); x < CW; x += 24) P(x, y, wall2);
    R(0, 70, CW, 30, table[1]); R(0, 70, CW, 2, table[2]); R(0, 69, CW, 1, O);
    for (let y = 78; y < CH; y += 8) R(0, y, CW, 1, table[0]);
    for (let i = 0; i < 9; i++) P((i * 37 + 11) % CW, 74 + (i * 13) % 24, table[0]);
  }
  const frame = () => { R(0, 0, CW, 1, O); R(0, CH - 1, CW, 1, O); R(0, 0, 1, CH, O); R(CW - 1, 0, 1, CH, O); };
  const sparkle = (x, y) => { P(x, y, "#ffffff"); P(x - 1, y, "#ffeb57"); P(x + 1, y, "#ffeb57"); P(x, y - 1, "#ffeb57"); P(x, y + 1, "#ffeb57"); };
  function jar(x, y, w, h, fill, lid = "#ea323c") { // x,y = bottom-left
    R(x - 1, y - h - 1, w + 2, h + 2, O); R(x, y - h, w, h, "#c7cfdd"); R(x + 1, y - h + 3, w - 2, h - 4, fill);
    R(x + 1, y - h + 3, 1, h - 4, "#ffffff"); R(x - 1, y - h - 4, w + 2, 4, O); R(x, y - h - 3, w, 2, lid);
  }
  function bottle(x, y, w, h, body, cap) { // bottom-centre
    const L = x - (w >> 1);
    R(L - 1, y - h - 1, w + 2, h + 2, O); R(L, y - h, w, h, body); R(L + 1, y - h + 1, 1, h - 2, "#ffffff");
    R(x - 2, y - h - 6, 5, 6, O); R(x - 1, y - h - 5, 3, 5, body); R(x - 2, y - h - 9, 5, 4, O); R(x - 1, y - h - 8, 3, 2, cap);
  }
  function plant(x, y, s = 1, cols = LEAF) { line(x, y, x, y - 6 * s, "#1e6f50"); blob(x - 3 * s, y - 5 * s, 2 * s, s + 1, cols); blob(x + 3 * s, y - 7 * s, 2 * s, s + 1, cols); blob(x, y - 9 * s, 2 * s, s + 1, cols); }
  function warn(x, y) { // small heat/safety triangle (pictogram, no words)
    for (let i = 0; i < 7; i++) R(x - i, y - 7 + i, 2 * i + 1, 1, O);
    for (let i = 1; i < 6; i++) R(x - i + 1, y - 6 + i, 2 * i - 1, 1, "#ffeb57");
    R(x, y - 4, 1, 2, O); P(x, y - 1, O);
  }

  const COVERS = {
    candle() {
      scene("#424c6e", "#2a2f4e");
      // warm glow
      c.globalAlpha = .25; ell(80, 40, 46, 30, "#ffc825"); ell(80, 40, 28, 20, "#ffeb57"); c.globalAlpha = 1;
      [[48, 22, "#f68187"], [80, 34, "#ffeb57"], [112, 26, "#99e65f"]].forEach(([x, h, col], i) => {
        shadow(x, 84, 12);
        R(x - 11, 84 - 8, 22, 9, O); R(x - 10, 84 - 7, 20, 7, "#c7cfdd"); R(x - 10, 84 - 7, 20, 2, "#ffffff"); // glass tumbler base
        obox(x - 8, 84 - 7 - h, 16, h, [i === 1 ? "#ffc825" : col, col, "#ffffff"]);
        R(x - 8, 84 - 7 - h, 16, 2, "#fffbd0");
        R(x, 84 - 9 - h, 1, 3, O);
        blob(x, 84 - 14 - h, 2, 3, ["#ea323c", "#ffa214", "#ffeb57"]); P(x, 84 - 15 - h, "#ffffff");
      });
      // oil bottle
      bottle(140, 84, 10, 22, "#ffc825", "#1e6f50"); R(135, 70, 10, 5, "#ffeb57");
      warn(16, 90); frame();
    },
    petfood() {
      scene("#94fdff", "#0cf1ff", ["#92a1b9", "#c7cfdd", "#ffffff"]);
      // fish skeleton on tray
      R(16, 64, 60, 16, O); R(17, 65, 58, 14, "#c7cfdd"); R(17, 65, 58, 2, "#ffffff");
      line(24, 72, 62, 72, O); for (let x = 30; x <= 56; x += 5) { line(x, 72, x - 3, 68, "#ffffff"); line(x, 72, x - 3, 76, "#ffffff"); P(x, 72, O); }
      R(62, 69, 7, 7, O); R(63, 70, 5, 5, "#92a1b9"); line(18, 67, 24, 72, O); line(18, 77, 24, 72, O);
      // bowl of treats
      shadow(110, 90, 26);
      ell(110, 72, 24, 6, O); R(86, 72, 49, 12, O); ell(110, 84, 22, 4, O);
      R(87, 72, 47, 11, "#ea323c"); ell(110, 83, 21, 3, "#ea323c"); R(87, 72, 4, 11, "#f5555d"); R(128, 72, 6, 11, "#c42430");
      ell(110, 72, 22, 4, "#5d2c28");
      [[96, 70], [102, 68], [108, 70], [114, 67], [120, 70], [126, 72], [104, 73], [117, 73], [110, 66]].forEach(([x, y], i) => { R(x - 1, y - 1, 5, 4, O); R(x, y, 3, 2, i % 2 ? "#bf6f4a" : "#e69c69"); });
      // paw print
      R(20, 22, 8, 7, "#0098dc"); [[17, 17], [22, 14], [28, 17], [31, 22]].forEach(([x, y]) => R(x, y, 3, 3, "#0098dc"));
      warn(146, 22); frame();
    },
    treasure() {
      scene("#f9e6cf", "#e69c69");
      // soap bars
      [[18, 80, "#f68187"], [36, 82, "#99e65f"]].forEach(([x, y, col]) => { shadow(x + 7, y + 2, 9); obox(x, y - 8, 15, 8, ["#c85086", col, "#fdd2ed"]); });
      sparkle(26, 64); sparkle(46, 68);
      // tote bag
      R(60, 34, 2, 14, O); R(78, 34, 2, 14, O); R(60, 33, 20, 2, O);
      obox(54, 46, 32, 34, ["#0069aa", "#0098dc", "#00cdf9"]);
      R(62, 56, 16, 12, "#ffeb57"); blob(70, 61, 4, 3, GRN); line(66, 65, 74, 57, "#f9e6cf");
      // toy car from bottle
      shadow(124, 88, 22);
      ell(124, 74, 20, 7, O); ell(124, 74, 19, 6, "#5ac54f"); R(105, 72, 38, 2, "#99e65f"); R(140, 72, 6, 4, O); R(141, 73, 4, 2, "#ffa214");
      R(116, 62, 14, 6, O); R(117, 63, 12, 5, "#94fdff");
      [110, 138].forEach(x => { ell(x, 84, 5, 5, O); ell(x, 84, 4, 4, "#424c6e"); ell(x, 84, 1, 1, "#c7cfdd"); });
      warn(150, 22); frame();
    },
    litmus() {
      scene("#ffffff", "#c7cfdd", ["#92a1b9", "#c7cfdd", "#ffffff"]);
      const cols = [["#ea323c", "#f5555d"], ["#f68187", "#fdd2ed"], ["#93388f", "#c85086"], ["#0069aa", "#0098dc"], ["#1e6f50", "#5ac54f"], ["#ffc825", "#ffeb57"]];
      cols.forEach(([d, l], i) => {
        const x = 18 + i * 22;
        shadow(x + 6, 86, 8);
        R(x - 1, 46, 14, 41, O); R(x, 47, 12, 39, "#ffffff"); R(x + 1, 58, 10, 27, d); R(x + 1, 58, 10, 2, l); R(x + 2, 60, 1, 24, l); R(x - 2, 45, 16, 2, O);
      });
      // purple cabbage leaf
      blob(136, 26, 14, 10, ["#622461", "#93388f", "#c85086"]); line(126, 30, 146, 20, "#fdd2ed"); line(134, 26, 136, 34, "#fdd2ed");
      // dropper
      R(18, 14, 4, 14, O); R(19, 15, 2, 12, "#c7cfdd"); R(17, 10, 6, 5, O); R(18, 11, 4, 3, "#ea323c"); P(20, 30, "#93388f"); P(20, 33, "#93388f");
      frame();
    },
    odour() {
      scene("#bf6f4a", "#8a4836", ["#391f21", "#5d2c28", "#8a4836"]);
      // coffee-ground sachets (cloth pouches tied)
      [[40, "#f9e6cf", "#e69c69"], [80, "#99e65f", "#5ac54f"], [120, "#94fdff", "#0098dc"]].forEach(([x, l, d]) => {
        shadow(x, 88, 16);
        blob(x, 74, 14, 12, [d, l]); R(x - 4, 58, 9, 6, O); R(x - 3, 59, 7, 4, l);
        R(x - 6, 62, 13, 2, "#ea323c");
        for (let i = 0; i < 6; i++) P(x - 6 + (i * 5) % 13, 72 + (i * 3) % 8, "#5d2c28");
      });
      // fresh-air swirls rising
      [[30, 40], [80, 36], [118, 42]].forEach(([x, y]) => { for (let k = 0; k < 14; k++) P(x + Math.round(2 * Math.sin(k / 2.2)), y - k, "#ffffff"); });
      // coffee bean pile
      [[146, 30], [140, 24], [150, 22], [144, 16]].forEach(([x, y]) => { ell(x, y, 3, 2, O); ell(x, y, 2, 1, "#5d2c28"); P(x, y, O); });
      frame();
    },
    watering() {
      scene("#d3fc7e", "#99e65f");
      // upside-down cut bottle in bottle base with wick
      const x = 80;
      shadow(x, 92, 30);
      R(x - 24, 42, 48, 48, O); R(x - 23, 43, 46, 46, "#94fdff"); R(x - 23, 68, 46, 21, "#0098dc"); R(x - 23, 68, 46, 1, "#00cdf9"); R(x - 21, 44, 2, 44, "#ffffff");
      // inverted top with soil
      for (let i = 0; i < 14; i++) R(x - 22 + i, 32 + i, 44 - 2 * i, 1, O);
      R(x - 22, 22, 44, 12, O); R(x - 21, 23, 42, 10, "#94fdff");
      for (let i = 0; i < 12; i++) R(x - 20 + i, 33 + i, 40 - 2 * i, 1, "#5d2c28");
      R(x - 21, 28, 42, 5, "#5d2c28"); R(x - 21, 28, 42, 1, "#8a4836");
      R(x - 1, 46, 3, 26, "#f9e6cf"); R(x - 1, 46, 1, 26, "#ffffff");
      plant(x, 28, 2); plant(x - 14, 28, 1); plant(x + 14, 28, 1);
      // droplets
      [[30, 30], [128, 40], [134, 24]].forEach(([dx, dy]) => { R(dx - 1, dy, 3, 3, O); P(dx, dy + 1, "#0098dc"); P(dx, dy - 1, O); });
      frame();
    },
    enzyme() {
      scene("#ffeb57", "#ffc825");
      // big bottle with peels + liquid layers
      const x = 70;
      shadow(x, 92, 22);
      R(x - 20, 36, 40, 54, O); R(x - 19, 37, 38, 52, "#fffbd0");
      R(x - 19, 54, 38, 35, "#ffa214"); R(x - 19, 54, 38, 2, "#ffeb57"); R(x - 19, 76, 38, 13, "#ed7614");
      [[x - 10, 60, "#ffc825"], [x + 6, 64, "#5ac54f"], [x - 4, 70, "#ea323c"], [x + 10, 72, "#ffeb57"], [x - 12, 80, "#99e65f"]].forEach(([px, py, col]) => { R(px - 1, py - 1, 7, 4, O); R(px, py, 5, 2, col); });
      R(x - 17, 38, 2, 50, "#ffffff");
      R(x - 8, 24, 16, 13, O); R(x - 7, 25, 14, 12, "#fffbd0"); R(x - 9, 20, 18, 6, O); R(x - 8, 21, 16, 4, "#1e6f50");
      // bubbles
      [[x + 12, 46], [x + 4, 42], [x - 6, 48]].forEach(([bx, by]) => { R(bx - 1, by - 1, 3, 3, O); P(bx, by, "#ffffff"); });
      // orange + peel on table
      blob(124, 80, 9, 8, ["#c64524", "#ed7614", "#ffa214"]); R(124, 70, 1, 3, O); R(125, 69, 4, 2, "#5ac54f");
      for (let i = 0; i < 4; i++) { R(100 + i * 5, 90 - (i & 1) * 2, 5, 3, O); R(101 + i * 5, 91 - (i & 1) * 2, 3, 1, "#ffa214"); }
      // timeline marks (3 notches = months)
      [118, 130, 142].forEach(tx => { R(tx, 22, 8, 8, O); R(tx + 1, 23, 6, 6, "#f9e6cf"); R(tx + 3, 25, 2, 2, "#1e6f50"); });
      frame();
    },
    ecobrick() {
      scene("#c7cfdd", "#92a1b9");
      // stack of eco-bricks (bottles lying) forming a bench
      const cols = [["#ea323c", "#f5555d"], ["#0098dc", "#00cdf9"], ["#5ac54f", "#99e65f"], ["#ffa214", "#ffeb57"], ["#93388f", "#c85086"]];
      for (let row = 0; row < 3; row++) for (let i = 0; i < 4 - row; i++) {
        const x = 18 + row * 14 + i * 28, y = 86 - row * 14;
        R(x - 1, y - 12, 27, 13, O); R(x, y - 11, 22, 11, "#c7cfdd");
        for (let k = 0; k < 4; k++) R(x + 2 + k * 5, y - 9 + (k & 1) * 3, 4, 4, cols[(i + row + k) % 5][(k & 1)]);
        R(x, y - 11, 22, 2, "#ffffff"); R(x + 22, y - 9, 3, 7, O); R(x + 22, y - 8, 2, 5, cols[(i + row) % 5][0]);
      }
      // eco-bag woven from strips
      R(126, 38, 2, 12, O); R(146, 38, 2, 12, O); R(126, 37, 22, 2, O);
      obox(120, 48, 34, 38, ["#c64524", "#ea323c", "#f68187"]);
      for (let y = 52; y < 84; y += 6) R(120, y, 34, 2, "#ffeb57");
      for (let x = 126; x < 152; x += 8) R(x, 48, 2, 38, "#0098dc");
      frame();
    },
    compost() {
      scene("#99e65f", "#5ac54f", ["#391f21", "#5d2c28", "#8a4836"]);
      // bokashi bucket
      shadow(46, 92, 22);
      R(26, 44, 40, 47, O); R(27, 45, 38, 45, "#5ac54f"); R(27, 45, 4, 45, "#99e65f"); R(59, 45, 6, 45, "#1e6f50");
      R(24, 38, 44, 8, O); R(25, 39, 42, 5, "#33984b"); R(42, 34, 8, 5, O); R(43, 35, 6, 3, "#1e6f50");
      R(62, 80, 6, 4, O); R(64, 81, 3, 2, "#c7cfdd");
      // compost heap with worms + scraps
      blob(116, 80, 30, 14, ["#391f21", "#5d2c28", "#8a4836"]);
      [[100, 74, "#ffa214"], [114, 70, "#ea323c"], [126, 74, "#99e65f"], [134, 80, "#ffeb57"], [106, 82, "#f9e6cf"]].forEach(([x, y, col]) => { R(x - 1, y - 1, 6, 4, O); R(x, y, 4, 2, col); });
      [[96, 86], [120, 84], [138, 72]].forEach(([x, y]) => { R(x, y, 6, 2, O); R(x + 1, y, 4, 1, "#f68187"); R(x + 5, y - 2, 2, 3, O); P(x + 5, y - 1, "#f68187"); });
      plant(118, 62, 1);
      frame();
    },
    bioplastic() {
      scene("#fdd2ed", "#f68187");
      // corn cob
      blob(30, 58, 8, 22, ["#ffa214", "#ffc825", "#ffeb57"]);
      for (let y = 40; y < 78; y += 4) for (let x = 25; x < 36; x += 4) P(x, y, "#ed7614");
      line(18, 80, 28, 50, O); line(19, 80, 29, 52, "#5ac54f"); line(42, 80, 33, 50, O); line(41, 80, 32, 52, "#33984b");
      // pot on stove ring
      shadow(84, 90, 24);
      R(60, 86, 48, 4, O); R(62, 86, 44, 2, "#424c6e");
      R(64, 58, 40, 28, O); R(65, 59, 38, 26, "#92a1b9"); R(65, 59, 4, 26, "#c7cfdd"); R(97, 59, 6, 26, "#657392");
      R(58, 62, 7, 3, O); R(103, 62, 7, 3, O); ell(84, 59, 18, 3, "#fffbd0");
      [[76, 52], [88, 48], [82, 44]].forEach(([x, y]) => { line(x, y, x + 2, y - 3, "#ffffff"); line(x + 2, y - 3, x, y - 6, "#ffffff"); });
      // finished sheets
      [[118, 70, "#94fdff"], [124, 78, "#d3fc7e"], [130, 86, "#fdd2ed"]].forEach(([x, y, col]) => { R(x - 1, y - 9, 26, 10, O); R(x, y - 8, 24, 8, col); R(x + 1, y - 7, 8, 1, "#ffffff"); });
      warn(146, 22); frame();
    },
    vgarden() {
      scene("#f9e6cf", "#e69c69");
      // wall rope + hanging bottles
      [40, 120].forEach(x => R(x, 0, 1, 90, "#5d2c28"));
      for (let i = 0; i < 3; i++) {
        const y = 26 + i * 24;
        R(30, y - 6, 100, 18, O); R(31, y - 5, 98, 16, "#94fdff"); R(31, y + 4, 98, 7, "#5d2c28"); R(31, y + 4, 98, 1, "#8a4836"); R(31, y - 5, 98, 2, "#ffffff");
        R(126, y - 3, 6, 8, O); R(127, y - 2, 4, 6, "#94fdff"); R(132, y - 2, 3, 6, O); R(133, y - 1, 1, 4, ["#ea323c", "#0098dc", "#5ac54f"][i]);
        for (let k = 0; k < 4; k++) plant(44 + k * 22, y + 5, 1, k & 1 ? GRN : LEAF);
        if (i === 1) [60, 104].forEach(x => { R(x, y - 6, 3, 3, O); P(x + 1, y - 5, "#ea323c"); });
      }
      frame();
    },
    hydro() {
      scene("#0098dc", "#0069aa", ["#5d2c28", "#8a4836", "#bf6f4a"]);
      // nutrient bottles with net cups + lettuce
      [40, 80, 120].forEach((x, i) => {
        shadow(x, 92, 16);
        R(x - 14, 50, 28, 41, O); R(x - 13, 51, 26, 39, "#94fdff"); R(x - 13, 64, 26, 26, "#99e65f"); R(x - 13, 64, 26, 1, "#d3fc7e");
        // roots
        for (let k = -4; k <= 4; k += 4) line(x + k, 52, x + k + (k >> 1), 80, "#f9e6cf");
        R(x - 11, 52, 2, 36, "#ffffff");
        R(x - 7, 44, 14, 8, O); R(x - 6, 45, 12, 6, "#424c6e"); for (let k = -5; k < 6; k += 3) P(x + k, 47, "#657392");
        blob(x - 6, 38, 6, 5, LEAF); blob(x + 6, 38, 6, 5, LEAF); blob(x, 33, 7, 6, ["#33984b", "#99e65f", "#d3fc7e"]);
        if (i === 1) sparkle(x + 12, 24);
      });
      frame();
    },
    fused() {
      scene("#424c6e", "#2a2f4e", ["#5d2c28", "#8a4836", "#bf6f4a"]);
      // mini umbrella
      const x = 56;
      for (let i = 0; i < 22; i++) { const w = Math.round(Math.sqrt(1 - Math.pow((22 - i) / 22, 2)) * 34); R(x - w - 1, 18 + i, 2 * w + 3, 1, O); }
      const segs = ["#ea323c", "#ffeb57", "#0098dc", "#5ac54f", "#f68187"];
      for (let i = 1; i < 22; i++) { const w = Math.round(Math.sqrt(1 - Math.pow((22 - i) / 22, 2)) * 34); for (let k = -w; k <= w; k++) P(x + k, 18 + i, segs[Math.min(4, Math.floor((k + 34) / 14))]); }
      for (let k = -34; k <= 34; k += 6) R(x + k - 1, 40, 3, 2, O);
      R(x, 40, 2, 38, O); R(x - 6, 76, 8, 2, O); R(x - 6, 72, 2, 5, O);
      // fused-plastic bag
      R(112, 40, 2, 14, O); R(134, 40, 2, 14, O); R(112, 39, 24, 2, O);
      obox(104, 52, 40, 32, ["#93388f", "#c85086", "#fdd2ed"]);
      for (let i = 0; i < 6; i++) R(108 + (i * 13) % 32, 56 + (i * 7) % 24, 6, 3, segs[i % 5]);
      // iron (heat) + baking paper
      R(70, 82, 30, 10, "#ffffff"); R(70, 82, 30, 1, "#c7cfdd");
      warn(146, 22); frame();
    },
    lifebuoy() {
      scene("#00cdf9", "#0098dc", ["#0069aa", "#0098dc", "#00cdf9"]);
      // waves on the "table" = water
      for (let y = 76; y < 100; y += 6) for (let x = (y % 12); x < CW; x += 14) { R(x, y, 6, 1, "#94fdff"); P(x + 6, y + 1, "#94fdff"); }
      // ring: red/white segments
      const cx = 80, cy = 56;
      for (let dy = -26; dy <= 26; dy++) for (let dx = -32; dx <= 32; dx++) {
        const d = Math.sqrt(dx * dx / 1.0 + dy * dy * 1.6);
        if (d > 32 || d < 14) continue;
        const a = Math.atan2(dy, dx), seg = Math.floor((a + Math.PI) / (Math.PI / 4)) % 2;
        let col = d > 30.5 || d < 15.5 ? O : seg ? "#ea323c" : "#ffffff";
        if (col !== O && dy < -8 && dx < 0) col = seg ? "#f5555d" : "#ffffff";
        if (col !== O && dy > 8) col = seg ? "#c42430" : "#c7cfdd";
        P(cx + dx, cy + dy, col);
      }
      // bubble-wrap dots
      for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; P(cx + Math.round(Math.cos(a) * 23), cy + Math.round(Math.sin(a) * 18), "#94fdff"); }
      // rope
      for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; P(cx + Math.round(Math.cos(a) * 31), cy + Math.round(Math.sin(a) * 25), k & 1 ? "#ffeb57" : "#ffc825"); }
      sparkle(130, 20); sparkle(28, 30); frame();
    },
    sleepbag() {
      scene("#2a2f4e", "#1a1932", ["#424c6e", "#657392", "#92a1b9"]);
      // stars + moon
      [[14, 12], [40, 22], [70, 8], [120, 14], [146, 30], [100, 26]].forEach(([x, y]) => P(x, y, "#ffeb57"));
      blob(134, 16, 7, 7, ["#ffc825", "#ffeb57", "#fffbd0"]); ell(138, 13, 6, 6, "#2a2f4e");
      // rolled bag + open bag
      shadow(80, 92, 50);
      R(30, 54, 100, 34, O); R(31, 55, 98, 32, "#5ac54f"); R(31, 55, 98, 3, "#99e65f"); R(31, 80, 98, 7, "#1e6f50");
      for (let x = 36; x < 128; x += 6) for (let y = 62; y < 80; y += 6) R(x, y, 3, 3, "#99e65f");
      R(31, 55, 22, 32, "#f9e6cf"); R(31, 55, 22, 3, "#ffffff"); R(52, 55, 1, 32, O);
      // pillow pocket
      R(34, 60, 16, 10, O); R(35, 61, 14, 8, "#ffffff");
      // rolled bundle with strap
      ell(140, 80, 12, 9, O); ell(140, 80, 11, 8, "#0098dc"); ell(140, 80, 6, 4, "#00cdf9"); ell(140, 80, 2, 1, "#0069aa"); R(138, 70, 3, 19, "#ea323c");
      frame();
    },
  };

  /* ---------- 16x16 material icons (string maps) ---------- */
  const IC = {
    paper: ["....oooooooo....", "....owwwwwwoo...", "....owgggwwwoo..", "....owwwwwwwwo..", "....owgggggwwo..", "....owwwwwwwwo..", "....owgggggwwo..", "....owwwwwwwwo..", "....owggggwwwo..", "....owwwwwwwwo..", "....owgggggwwo..", "....owwwwwwwwo..", "....oooooooooo..", "................", "................", "................"],
    plastic: [".....oooo.......", ".....orro.......", ".....oooo.......", "....obbbbo......", "...obbbbbbo.....", "...owbbbbbo.....", "...owbbbbbo.....", "...oyyyyyyo.....", "...oyyyyyyo.....", "...owbbbbbo.....", "...owbbbbbo.....", "...owbbbbbo.....", "...oBbbbbBo.....", "....oooooo......", "................", "................"],
    metal: ["................", "....oooooooo....", "...osssssssso...", "...oSSSSSSSSo...", "...owgggggggo...", "...owgrrrrggo...", "...owgrrrrggo...", "...owgrrrrggo...", "...owgggggggo...", "...owgggggggo...", "...oSSSSSSSSo...", "...osssssssso...", "....oooooooo....", "................", "................", "................"],
    glass: ["......oooo......", "......okko......", "......oGGo......", "......oGGo......", ".....oGGGGo.....", "....oGwGGGGo....", "....oGwGGGGo....", "....oGwGGGGo....", "....oGwGGGGo....", "....oGGGGGGo....", "....oGGGGGGo....", "....oKGGGGKo....", ".....oooooo.....", "................", "................", "................"],
    food: ["........oo......", ".......olo......", "......oolo......", "....oooooooo....", "...orrrrrrrro...", "..orwrrrrrrRo...", "..orwrrrrrrRo...", "..orrrrrrrrRo...", "..orrrrrrrrRo...", "...orrrrrrRo....", "...oRrrrrRRo....", "....oRRRRRo.....", ".....ooooo......", "................", "................", "................"],
    garden: ["................", "......ooo.......", ".....ollLo......", "....ollLLLo.....", "...ollLLLLo..oo.", "...olllLLo..olo.", "....olllo..olLo.", ".....oxo..ollo..", ".....oxooolLo...", ".....oxxxoLo....", ".....oxo.oo.....", ".....oxo........", "...oooxooo......", "...oddddddo.....", "....oooooo......", "................"],
    hazardous: ["................", ".......oo.......", "......oyyo......", "......oyyo......", ".....oyyyyo.....", ".....oyooyo.....", "....oyyooyyo....", "....oyyooyyo....", "...oyyyooyyyo...", "...oyyyyyyyyo...", "..oyyyyooyyyyo..", "..oyyyyooyyyyo..", ".oyyyyyyyyyyyyo.", ".oooooooooooooo.", "................", "................"],
    textile: ["................", "...ooo....ooo...", "..obbbooooobbbo.", ".obbbbbbbbbbbbo.", ".obbbbbwwbbbbbbo", ".oooobbwwbbbooo.", "....obbbbbbbo...", "....obbbbbbbo...", "....obbbbbbbo...", "....oBBBBBBBo...", "....obbbbbbbo...", "....obbbbbbbo...", "....oBbbbbbBo...", "....ooooooooo...", "................", "................"],
    ewaste: ["................", "..oooooooooooo..", "..oSSSSSSSSSSo..", "..oSbbbbbbbbSo..", "..oSbwbbbbbbSo..", "..oSbbbbbbbbSo..", "..oSbbbbbbbbSo..", "..oSSSSSSSSSSo..", "..oooooooooooo..", ".......oo.......", ".....oooooo.....", "...ogggggggggo..", "...ogyggyggggo..", "...oooooooooo...", "................", "................"],
    mixed: ["................", "......oooo......", ".....oKKKKo.....", "..oooooooooooo..", "..oKKKKKKKKKKo..", "...oSSSSSSSSo...", "...oSkSkSkSSo...", "...oSkSkSkSSo...", "...oSkSkSkSSo...", "...oSkSkSkSSo...", "...oSkSkSkSSo...", "...oSSSSSSSSo...", "....oooooooo....", "................", "................", "................"],
  };
  const ICP = {
    paper: { w: "#ffffff", g: "#92a1b9" }, plastic: { r: "#ea323c", b: "#94fdff", B: "#00cdf9", w: "#ffffff", y: "#ffa214" },
    metal: { s: "#c7cfdd", S: "#92a1b9", g: "#ea323c", r: "#ffffff", w: "#f5555d" }, glass: { k: "#8a4836", G: "#5ac54f", K: "#1e6f50", w: "#d3fc7e" },
    food: { l: "#5d2c28", r: "#ea323c", R: "#c42430", w: "#f68187" }, garden: { l: "#5ac54f", L: "#33984b", x: "#8a4836", d: "#5d2c28" },
    hazardous: { y: "#ffeb57" }, textile: { b: "#0098dc", B: "#0069aa", w: "#ffffff" },
    ewaste: { S: "#424c6e", b: "#0098dc", w: "#94fdff", g: "#1e6f50", y: "#ffeb57" }, mixed: { K: "#424c6e", S: "#657392", k: "#2a2f4e" },
  };

  function draw(canvas, labId) {
    if (!canvas || !COVERS[labId]) return false;
    canvas.width = CW; canvas.height = CH;
    if (!canvas.style.imageRendering) canvas.style.imageRendering = "pixelated";
    c = canvas.getContext("2d"); c.imageSmoothingEnabled = false;
    try { COVERS[labId](); } finally { c = null; }
    return true;
  }
  function icon(canvas, material) {
    const m = IC[material]; if (!canvas || !m) return false;
    canvas.width = 16; canvas.height = 16;
    if (!canvas.style.imageRendering) canvas.style.imageRendering = "pixelated";
    const x = canvas.getContext("2d"), pal = Object.assign({ o: O }, ICP[material]);
    m.forEach((row, j) => { for (let i = 0; i < 16; i++) { const col = pal[row[i]]; if (col) { x.fillStyle = col; x.fillRect(i, j, 1, 1); } } });
    return true;
  }
  WQ.labCovers = { draw, icon, W: CW, H: CH, labs: Object.keys(COVERS), materials: Object.keys(IC) };
})();
