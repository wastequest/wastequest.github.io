/* WasteQuest v2 town art: procedural isometric pixel-art eco-city (Endesga 64 palette).
   Exposes WQ.townArt (contract in BRIEF_stage1.md). Pure fillRect on integer pixels, no smoothing. */
(() => {
  if (typeof WQ === "undefined") return;
  const W = 400, H = 300, O = "#1a1932";
  const DISTRICTS = ["academy", "recycle", "compost", "maker", "market", "arena"];
  let c = null, trk = null;

  /* ---------- pixel primitives ---------- */
  const R = (x, y, w, h, col) => {
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    if (w <= 0 || h <= 0) return;
    c.fillStyle = col; c.fillRect(x, y, w, h);
    if (trk) { trk.x0 = Math.min(trk.x0, x); trk.y0 = Math.min(trk.y0, y); trk.x1 = Math.max(trk.x1, x + w); trk.y1 = Math.max(trk.y1, y + h); }
  };
  const P = (x, y, col) => R(x, y, 1, 1, col);
  function line(x0, y0, x1, y1, col) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (;;) { P(x0, y0, col); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
  }
  function poly(pts, col) {
    let y0 = 1e9, y1 = -1e9;
    for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
      const sy = y + 0.5, xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= sy && by > sy) || (by <= sy && ay > sy)) xs.push(ax + (sy - ay) * (bx - ax) / (by - ay));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) R(Math.round(xs[i]), y, Math.round(xs[i + 1]) - Math.round(xs[i]) + 1, 1, col);
    }
  }
  const stroke = (pts, col = O) => pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; line(p[0], p[1], q[0], q[1], col); });
  function ell(cx, cy, rx, ry, col) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / ((ry + 0.5) * (ry + 0.5)))));
      R(cx - w, cy + dy, 2 * w + 1, 1, col);
    }
  }
  // shaded blob with outline: cols = [dark, mid, light]
  function blob(cx, cy, rx, ry, cols, outline = O) {
    ell(cx, cy, rx + 1, ry + 1, outline);
    ell(cx, cy, rx, ry, cols[0]);
    ell(cx - 1, cy - 1, Math.max(0, rx - 1), Math.max(0, ry - 1), cols[1]);
    if (cols[2]) ell(cx - Math.ceil(rx / 3), cy - Math.ceil(ry / 3), Math.max(0, (rx >> 1) - 1), Math.max(0, (ry >> 1) - 1), cols[2]);
  }
  // draw a small string-map sprite; map chars -> colours ('.' = empty)
  function sprite(x, y, rows, pal) {
    rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const col = pal[r[i]]; if (col) P(x + i, y + j, col); } });
  }

  /* ---------- isometric helpers (2:1) ---------- */
  const G = (u, v, z = 0) => [200 - 2 * u + 2 * v, 325 - u - v - z];
  function topFace(fx, fy, a, b, z, col) {
    const Lx = fx - 2 * a, Ly = fy - a, Ty = fy - a - b;
    for (let k = 0; k <= 2 * (a + b); k++) {
      const top = k <= 2 * b ? Ly - (k >> 1) : Ty + ((k - 2 * b) >> 1);
      const bot = k <= 2 * a ? Ly + (k >> 1) : fy - ((k - 2 * a) >> 1);
      R(Lx + k, top - z, 1, bot - top + 1, col);
    }
  }
  const ground = (u, v, a, b, col, z = 0) => { const [fx, fy] = G(u, v); topFace(fx, fy, a, b, z, col); };
  // iso box. cols = {top,left,right,rim?}. returns face handles for details
  function box(u, v, a, b, h, cols, z0 = 0) {
    const [fx, fy] = G(u, v, z0), Lx = fx - 2 * a, Ly = fy - a, Rx = fx + 2 * b, Ry = fy - b;
    for (let k = 0; k <= 2 * a; k++) R(Lx + k, Ly + (k >> 1) - h, 1, h + 1, cols.left);
    for (let k = 0; k <= 2 * b; k++) R(fx + k, fy - (k >> 1) - h, 1, h + 1, cols.right);
    if (cols.top) {
      topFace(fx, fy, a, b, h, cols.top);
      if (cols.rim) { for (let k = 1; k < 2 * a; k++) P(Lx + k, Ly + (k >> 1) - h, cols.rim); for (let k = 1; k < 2 * b; k++) P(fx + k, fy - (k >> 1) - h, cols.rim); }
      const Ty = fy - a - b;
      for (let k = 0; k <= 2 * (a + b); k++) P(Lx + k, (k <= 2 * b ? Ly - (k >> 1) : Ty + ((k - 2 * b) >> 1)) - h, O);
    }
    R(Lx, Ly - h, 1, h + 1, O); R(Rx, Ry - h, 1, h + 1, O);
    if (cols.edge) R(fx, fy - h + 1, 1, h - 1, cols.edge);
    for (let k = 0; k <= 2 * a; k++) P(Lx + k, Ly + (k >> 1), O);
    for (let k = 0; k <= 2 * b; k++) P(fx + k, fy - (k >> 1), O);
    return { L: { x: Lx, y: Ly, d: 1, n: 2 * a }, R: { x: fx, y: fy, d: -1, n: 2 * b }, fx, fy, h };
  }
  // rectangle painted on a box face: k = px along face from its left end, z = height of bottom row
  function fr(f, k0, z0, w, hh, col) { for (let k = k0; k < k0 + w; k++) R(f.x + k, f.y + f.d * (k >> 1) - z0 - hh + 1, 1, hh, col); }
  function win(f, k, z, w, hh, lit, frame = O) {
    fr(f, k - 1, z - 1, w + 2, hh + 2, frame);
    fr(f, k, z, w, hh, lit ? "#ffeb57" : "#2a2f4e");
    fr(f, k, z + hh - 1, w, 1, lit ? "#fffbd0" : "#424c6e");
    if (lit) fr(f, k, z, w, 1, "#ffc825");
  }
  // gable roof on box (u,v,a,b,h). axis "u": ridge parallel to u (left face side is the long slope)
  function roof(u, v, a, b, h, rh, axis, cols, o = 1) {
    const Q = (uu, vv, zz) => G(u + uu, v + vv, zz), Hh = h + rh;
    let back, front, gable;
    if (axis === "u") {
      back = [Q(-o, b + o, h), Q(a + o, b + o, h), Q(a + o, b / 2, Hh), Q(-o, b / 2, Hh)];
      front = [Q(-o, -o, h), Q(a + o, -o, h), Q(a + o, b / 2, Hh), Q(-o, b / 2, Hh)];
      gable = [Q(0, 0, h), Q(0, b, h), Q(0, b / 2, Hh)];
      poly(back, cols.mid); poly(gable, cols.wall); stroke(gable);
      poly(front, cols.light);
      for (let i = 1; i < rh; i += 2) { const t = i / rh; line(...Q(-o, -o + (b / 2 + o) * t, h + rh * t), ...Q(a + o, -o + (b / 2 + o) * t, h + rh * t), cols.mid); }
      stroke(front); stroke(back);
      line(...Q(-o, -o, h), ...Q(-o, b / 2, Hh), O);
    } else {
      back = [Q(a + o, -o, h), Q(a + o, b + o, h), Q(a / 2, b + o, Hh), Q(a / 2, -o, Hh)];
      front = [Q(-o, -o, h), Q(-o, b + o, h), Q(a / 2, b + o, Hh), Q(a / 2, -o, Hh)];
      gable = [Q(0, 0, h), Q(a, 0, h), Q(a / 2, 0, Hh)];
      poly(back, cols.light); stroke(back);
      poly(front, cols.mid);
      for (let i = 1; i < rh; i += 2) { const t = i / rh; line(...Q(-o + (a / 2 + o) * t, -o, h + rh * t), ...Q(-o + (a / 2 + o) * t, b + o, h + rh * t), cols.dark); }
      stroke(front);
      poly(gable, cols.wall); stroke(gable);
    }
    return { Q, Hh };
  }
  // flat solar array on a flat surface at height z
  function solar(u, v, a, b, z) {
    const [fx, fy] = G(u, v, z);
    topFace(fx, fy, a, b, 0, "#00396d");
    for (let i = 1; i < a; i += 2) line(...G(u + i, v, z), ...G(u + i, v + b, z), "#0098dc");
    const Lx = fx - 2 * a, Ly = fy - a;
    for (let k = 0; k <= 2 * a; k++) P(Lx + k, Ly + (k >> 1), O);
    for (let k = 0; k <= 2 * b; k++) P(fx + k, fy - (k >> 1), O);
    for (let k = 0; k <= 2 * a; k++) P(Lx + k, Ly + (k >> 1) + 1, "#5d5d5d");
  }
  // solar strip lying on a pitched roof slope: corners via roof.Q
  function slopeSolar(Q, pts) { const p = pts.map(q => Q(...q)); poly(p, "#00396d"); stroke(p); line(...p[0].map((x, i) => Math.round((x + p[3][i]) / 2)), ...p[1].map((x, i) => Math.round((x + p[2][i]) / 2)), "#0098dc"); }

  /* ---------- props ---------- */
  const GRN = ["#1e6f50", "#5ac54f", "#99e65f"], DRY = ["#5d2c28", "#8a4836", "#bf6f4a"];
  function shrub(x, y, r = 3, cols = GRN) { blob(x, y - r, r + 1, r, cols); }
  function flowers(x, y) {
    shrub(x, y, 3);
    [[-3, -4, "#f389f5"], [1, -6, "#c85086"], [2, -3, "#f389f5"], [-1, -2, "#ffeb57"], [-2, -6, "#ffffff"], [4, -5, "#c85086"]].forEach(([dx, dy, col]) => P(x + dx, y + dy, col));
  }
  function bougain(x, y) {
    blob(x, y - 5, 5, 4, ["#1e6f50", "#33984b", "#5ac54f"]);
    [[-4, -7], [-1, -9], [2, -8], [4, -5], [-3, -4], [1, -5], [3, -2], [-5, -3], [0, -3]].forEach(([dx, dy], i) => { P(x + dx, y + dy, i % 2 ? "#c85086" : "#f389f5"); if (i % 3 === 0) P(x + dx + 1, y + dy, "#f389f5"); });
  }
  function wilted(x, y) {
    R(x - 3, y - 4, 7, 5, O); R(x - 2, y - 3, 5, 3, "#c64524"); R(x - 2, y - 3, 5, 1, "#e07438");
    line(x, y - 4, x - 1, y - 8, DRY[1]); line(x - 1, y - 8, x - 4, y - 6, DRY[2]); line(x, y - 6, x + 3, y - 5, DRY[1]); P(x + 3, y - 4, DRY[2]); P(x - 4, y - 5, DRY[2]);
  }
  function potShrub(x, y) { R(x - 3, y - 4, 7, 5, O); R(x - 2, y - 3, 5, 3, "#c64524"); R(x - 2, y - 3, 5, 1, "#e07438"); blob(x, y - 7, 3, 2, GRN); }
  function palm(x, y, h = 22, dull = false) {
    const g = dull ? ["#33984b", "#5d6b3a", "#8a4836"] : ["#1e6f50", "#33984b", "#5ac54f"];
    let tx = x;
    for (let i = 0; i < h; i++) {
      tx = x + Math.round(Math.sin(i / h * 1.4) * 4);
      R(tx - 1, y - i, 3, 1, O); P(tx, y - i, i % 3 === 0 ? "#5d2c28" : "#8a4836");
    }
    const top = y - h;
    const fronds = [[-11, 3], [-8, -3], [-2, -6], [5, -5], [10, -1], [12, 4], [-6, 6], [7, 6]];
    fronds.forEach(([dx, dy], i) => {
      const mx = tx + dx / 2, my = top + Math.min(dy, 0) - 3;
      line(tx, top, mx, my, O); line(mx, my, tx + dx, top + dy + 2, O);
      line(tx, top - 1, mx, my - 1, g[i % 2 ? 1 : 2]); line(mx, my - 1, tx + dx, top + dy + 1, g[i % 2 ? 0 : 1]); line(tx, top - 2, mx, my - 2, O); line(mx, my - 2, tx + dx, top + dy, O); line(tx, top - 1, mx, my - 1, g[i % 2 ? 1 : 2]);
    });
    R(tx - 2, top, 2, 2, O); R(tx + 1, top + 1, 2, 2, O); P(tx - 1, top, "#bf6f4a"); P(tx + 1, top + 1, "#bf6f4a");
  }
  function rainTree(x, y, dull = false) {
    const g = dull ? ["#33984b", "#5d6b3a", "#8a7a4a"] : GRN;
    R(x - 1, y - 12, 3, 12, O); R(x, y - 12, 1, 12, "#8a4836"); line(x, y - 8, x - 5, y - 12, O); line(x, y - 8, x + 5, y - 12, O);
    blob(x - 7, y - 15, 6, 4, g); blob(x + 7, y - 15, 6, 4, g); blob(x, y - 18, 9, 5, g);
    if (!dull) { P(x - 3, y - 21, "#d3fc7e"); P(x + 2, y - 20, "#d3fc7e"); P(x - 9, y - 17, "#d3fc7e"); }
  }
  function banana(x, y) {
    R(x - 1, y - 8, 3, 8, O); R(x, y - 8, 1, 8, "#33984b");
    [[-7, -12], [6, -13], [-5, -16], [4, -17], [0, -18]].forEach(([dx, dy], i) => {
      line(x, y - 8, x + dx, y + dy, O); line(x + (dx > 0 ? 1 : -1), y - 8, x + dx, y + dy + 2, O);
      line(x, y - 9, x + dx, y + dy + 1, i % 2 ? "#5ac54f" : "#99e65f");
    });
  }
  function lamp(x, y, lit) {
    R(x - 1, y - 16, 3, 17, O); R(x, y - 15, 1, 15, "#424c6e"); R(x - 1, y - 1, 3, 1, "#2a2f4e");
    R(x - 2, y - 19, 5, 4, O); R(x - 1, y - 18, 3, 2, lit ? "#ffeb57" : "#657392");
    if (lit) { P(x - 2, y - 15, "#ffeb57"); P(x + 2, y - 15, "#ffeb57"); }
  }
  function litter(x, y, n = 0) {
    // mound of mixed rubbish: dark bag, white bag, bottle, can, paper scraps
    ell(x, y - 1, 7, 2, O); ell(x, y - 1, 6, 1, "#5d5d5d");
    blob(x - 2, y - 4, 3, 2, ["#0e071b", "#2a2f4e", "#424c6e"]); P(x - 2, y - 7, O); P(x - 3, y - 8, "#424c6e");
    blob(x + 3, y - 3, 2, 2, ["#92a1b9", "#c7cfdd", "#ffffff"]); P(x + 3, y - 6, O);
    R(x - 7, y - 3, 2, 4, O); P(x - 7, y - 2, "#0cf1ff"); P(x - 7, y - 1, "#94fdff"); P(x - 6, y - 4, "#ea323c");
    R(x + 5, y - 1, 3, 2, O); R(x + 5, y - 1, 2, 1, n % 2 ? "#ffa214" : "#ea323c"); P(x + 6, y, "#c7cfdd");
    P(x - 4, y + 1, "#ffffff"); P(x + 1, y + 1, "#ffeb57"); P(x + 8, y - 2, "#ffffff"); P(x - 9, y, "#f9e6cf");
  }
  function smog(x, y) {
    const s = ["#5d5d5d", "#858585", "#b4b4b4"];
    c.globalAlpha = 0.85;
    blob(x - 8, y + 1, 6, 4, s, "#3d3d3d"); blob(x + 8, y + 2, 6, 3, s, "#3d3d3d"); blob(x, y - 3, 8, 5, s, "#3d3d3d"); blob(x + 4, y - 9, 4, 3, s, "#3d3d3d");
    c.globalAlpha = 1;
  }
  const butterfly = (x, y, col = "#f389f5") => { P(x, y, O); P(x - 1, y - 1, col); P(x + 1, y - 1, col); P(x - 1, y, col); P(x + 1, y, "#ffeb57"); };
  const sparkle = (x, y) => { P(x, y, "#ffffff"); P(x - 1, y, "#ffeb57"); P(x + 1, y, "#ffeb57"); P(x, y - 1, "#ffeb57"); P(x, y + 1, "#ffeb57"); };
  function cracks(u, v, a, b) {
    for (let i = 0; i < 3; i++) {
      const [x, y] = G(u + a * (0.25 + i * 0.25), v + b * (0.7 - i * 0.2));
      line(x - 3, y, x, y + 1, "#3d3d3d"); line(x, y + 1, x + 2, y - 1, "#3d3d3d"); P(x + 3, y - 1, "#3d3d3d");
    }
  }
  // iso bin with lid + optional pictogram label (no words)
  function bin(u, v, col, dark, glyph, labelled, overflow) {
    const f = box(u, v, 4, 4, 11, { left: col, right: dark, top: dark });
    const [lx, ly] = G(u, v, 11); topFace(lx, ly, 4, 4, 1, "#2a2f4e"); for (let k = 0; k <= 8; k++) P(lx - 8 + k, ly - 4 + (k >> 1) - 1, O);
    if (labelled) {
      fr(f.L, 2, 3, 5, 5, "#ffffff");
      const gx = f.L.x + 3, gy = f.L.y + 1 - 3 - 3;
      if (glyph === "paper") { R(gx, gy, 2, 3, "#92a1b9"); }
      if (glyph === "bottle") { R(gx + 1, gy - 1, 1, 1, "#ea323c"); R(gx, gy, 2, 3, "#0098dc"); }
      if (glyph === "jar") { R(gx, gy, 2, 3, "#5ac54f"); P(gx, gy, "#1e6f50"); }
    }
    if (overflow) { const [x, y] = G(u + 2, v + 2, 12); blob(x, y - 1, 3, 2, ["#0e071b", "#2a2f4e", "#424c6e"]); P(x + 3, y - 3, "#0cf1ff"); P(x - 3, y - 2, "#ffffff"); }
    return f;
  }
  // signboard on posts, glyph = small icon fn; crooked = hanging tilt
  function signboard(x, y, w, bg, glyph, crooked) {
    R(x - (w >> 1) + 1, y - 10, 1, 10, O); R(x + (w >> 1) - 2, y - 10, 1, 10, O);
    if (crooked) {
      const p = [[x - (w >> 1), y - 15], [x + (w >> 1), y - 12], [x + (w >> 1), y - 6], [x - (w >> 1), y - 9]];
      poly(p, "#858585"); stroke(p); line(x - 2, y - 11, x + 3, y - 9, "#5d5d5d");
    } else {
      R(x - (w >> 1), y - 17, w, 9, O); R(x - (w >> 1) + 1, y - 16, w - 2, 7, bg); R(x - (w >> 1) + 1, y - 16, w - 2, 1, "#ffffff");
      glyph && glyph(x, y - 13);
    }
  }
  const leafGlyph = (x, y) => { R(x - 2, y - 1, 4, 3, "#1e6f50"); P(x - 2, y - 1, "#f9e6cf"); P(x + 1, y + 1, "#f9e6cf"); P(x + 2, y + 1, "#1e6f50"); };
  const recycleGlyph = (x, y) => { R(x - 2, y - 1, 2, 1, "#1e6f50"); R(x + 1, y - 1, 1, 2, "#1e6f50"); R(x - 1, y + 1, 2, 1, "#1e6f50"); P(x - 2, y, "#1e6f50"); P(x, y - 2, "#1e6f50"); };
  const gearGlyph = (x, y, col = "#424c6e") => { R(x - 2, y - 2, 5, 5, col); P(x, y - 3, col); P(x, y + 3, col); P(x - 3, y, col); P(x + 3, y, col); P(x, y, "#f9e6cf"); };
  const sproutGlyph = (x, y) => { R(x, y - 1, 1, 3, "#1e6f50"); P(x - 1, y - 1, "#5ac54f"); P(x + 1, y - 2, "#5ac54f"); P(x - 2, y - 2, "#5ac54f"); };

  /* ---------- palette sets per state ---------- */
  const dullWall = (st, bright, dull, dirty) => st >= 2 ? bright : st === 1 ? dull : dirty;

  /* ---------- buildings (each draws its whole lot: ground details, building, props) ---------- */
  function lotPave(u, v, a, b, st, col = "#c7cfdd", dark = "#92a1b9") {
    ground(u, v, a, b, st >= 2 ? col : "#92a1b9");
    for (let i = 2; i < a; i += 4) line(...G(u + i, v), ...G(u + i, v + b), st >= 2 ? dark : "#858585");
    if (st === 0) cracks(u, v, a, b);
  }

  function academy(st) {
    lotPave(92, 54, 8, 22, st);
    trk = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    const wall = dullWall(st, ["#ffffff", "#c7cfdd"], ["#c7cfdd", "#92a1b9"], ["#b4b4b4", "#858585"]);
    const f = box(98, 60, 18, 12, 24, { left: wall[0], right: wall[1] });
    // floor band + plinth
    fr(f.L, 1, 12, f.L.n - 1, 1, wall[1]); fr(f.R, 1, 12, f.R.n - 1, 1, "#92a1b9");
    fr(f.L, 1, 1, f.L.n - 1, 2, "#657392"); fr(f.R, 1, 1, f.R.n - 1, 2, "#424c6e");
    const lit = st >= 2;
    for (let i = 0; i < 5; i++) { if (i !== 2) win(f.L, 4 + i * 7, 4, 4, 6, lit, "#0069aa"); win(f.L, 4 + i * 7, 16, 4, 5, lit, "#0069aa"); }
    // door
    fr(f.L, 17, 1, 6, 9, O); fr(f.L, 18, 1, 4, 8, st >= 2 ? "#0098dc" : "#424c6e"); fr(f.L, 20, 1, 1, 8, O);
    for (let i = 0; i < 3; i++) { win(f.R, 4 + i * 7, 4, 3, 6, lit && i !== 1, "#0069aa"); win(f.R, 4 + i * 7, 16, 3, 5, lit, "#0069aa"); }
    if (st === 0) { fr(f.L, 30, 15, 2, 3, "#858585"); fr(f.L, 6, 5, 3, 2, "#657392"); P(f.L.x + 9, f.L.y - 20, "#5d5d5d"); }
    const rf = roof(98, 60, 18, 12, 24, 7, "u", st >= 1 ? { light: "#0098dc", mid: "#0069aa", dark: "#00396d", wall: wall[1] } : { light: "#657392", mid: "#424c6e", dark: "#2a2f4e", wall: wall[1] });
    // ridge cap + clock block
    line(...rf.Q(-1, 6, 31), ...rf.Q(19, 6, 31), st >= 1 ? "#00cdf9" : "#92a1b9");
    if (st === 3) slopeSolar(rf.Q, [[3, 0, 25], [15, 0, 25], [15, 4, 29], [3, 4, 29]]);
    // entrance canopy sign
    const [sx, sy] = G(104, 60, 26);
    R(sx - 7, sy - 4, 14, 6, O); R(sx - 6, sy - 3, 12, 4, st >= 2 ? "#5ac54f" : "#858585");
    if (st >= 2) { leafGlyph(sx - 2, sy - 1); R(sx + 2, sy - 2, 3, 1, "#f9e6cf"); R(sx + 2, sy, 3, 1, "#f9e6cf"); }
    // flagpole
    const [px, py] = G(93, 57);
    R(px, py - 30, 1, 30, O); R(px - 1, py - 31, 3, 1, "#ffc825");
    if (st === 0) { R(px + 1, py - 18, 4, 5, "#858585"); P(px + 5, py - 17, "#858585"); P(px + 2, py - 13, "#5d5d5d"); }
    else { R(px + 1, py - 29, 11, 7, O); R(px + 1, py - 28, 10, 5, st >= 2 ? "#5ac54f" : "#33984b"); leafGlyph(px + 6, py - 26); }
    trk.done = 1;
    hot.academy = trk; trk = null;
    // noticeboard
    const [nx, ny] = G(94, 68);
    R(nx - 6, ny - 13, 1, 13, O); R(nx + 5, ny - 13, 1, 13, O);
    R(nx - 7, ny - 15, 14, 9, O); R(nx - 6, ny - 14, 12, 7, "#bf6f4a");
    if (st >= 1) { R(nx - 5, ny - 13, 3, 4, "#ffffff"); R(nx - 1, ny - 12, 3, 3, "#ffeb57"); R(nx + 3, ny - 13, 2, 4, "#94fdff"); }
    else { R(nx - 4, ny - 12, 3, 2, "#c7cfdd"); }
    props(st, { litter: [[89, 64], [92, 74], [95, 58]], smog: G(106, 66, 40), wilt: [G(92, 62)], shrub: [G(92, 62), G(90, 72)], flower: [G(92, 66), G(91, 59)], tree: G(110, 56), fly: G(94, 64, 22) });
  }

  function recycle(st) {
    lotPave(88, 90, 12, 24, st);
    trk = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    // chimney (behind)
    const ch = box(112, 108, 3, 3, 40, { left: "#c7cfdd", right: "#92a1b9", top: "#5d5d5d" });
    fr(ch.L, 0, 30, 7, 3, "#ea323c"); fr(ch.R, 0, 30, 7, 3, "#c42430"); fr(ch.L, 0, 22, 7, 3, "#ea323c"); fr(ch.R, 0, 22, 7, 3, "#c42430");
    const wall = dullWall(st, ["#5ac54f", "#33984b"], ["#92a1b9", "#657392"], ["#858585", "#5d5d5d"]);
    const f = box(100, 92, 14, 20, 20, { left: wall[0], right: wall[1] });
    // corrugation
    for (let k = 2; k < f.L.n; k += 3) fr(f.L, k, 1, 1, 19, st >= 2 ? "#99e65f" : "#b4b4b4");
    for (let k = 2; k < f.R.n; k += 3) fr(f.R, k, 1, 1, 19, st >= 2 ? "#1e6f50" : "#424c6e");
    // roller door on left face
    fr(f.L, 6, 1, 16, 14, O); fr(f.L, 7, 1, 14, 13, st >= 2 ? "#c7cfdd" : "#657392");
    for (let z = 3; z < 14; z += 2) fr(f.L, 7, z, 14, 1, st >= 2 ? "#92a1b9" : "#424c6e");
    if (st === 0) fr(f.L, 7, 1, 14, 3, "#2a2f4e");
    // window strip right face
    for (let i = 0; i < 4; i++) win(f.R, 4 + i * 9, 12, 5, 4, st >= 2, "#1e6f50");
    const rf = roof(100, 92, 14, 20, 20, 6, "v", st >= 1 ? { light: "#c7cfdd", mid: "#92a1b9", dark: "#657392", wall: wall[0] } : { light: "#92a1b9", mid: "#657392", dark: "#424c6e", wall: wall[0] });
    if (st === 3) { slopeSolar(rf.Q, [[13, 2, 21], [13, 18, 21], [9, 18, 24], [9, 2, 24]]); }
    // sign on gable
    const [gx, gy] = G(107, 92, 22);
    if (st >= 2) { R(gx - 5, gy - 4, 11, 7, O); R(gx - 4, gy - 3, 9, 5, "#f9e6cf"); recycleGlyph(gx, gy - 1); }
    else if (st === 1) { R(gx - 5, gy - 3, 11, 7, O); R(gx - 4, gy - 2, 9, 5, "#b4b4b4"); }
    else { const p = [[gx - 5, gy - 5], [gx + 5, gy - 1], [gx + 4, gy + 4], [gx - 6, gy]]; poly(p, "#858585"); stroke(p); }
    // conveyor out of right face
    const cv = box(94, 104, 6, 3, 6, { left: "#424c6e", right: "#2a2f4e", top: "#3d3d3d" });
    for (let i = 0; i < 6; i += 2) { const [x, y] = G(95 + i, 105.5, 7); P(x, y - 1, ["#0098dc", "#ffa214", "#bf6f4a"][i / 2 % 3]); P(x + 1, y - 1, O); }
    fr(cv.L, 2, 1, 1, 4, O); fr(cv.L, 9, 1, 1, 4, O);
    // three big bins: blue paper, orange plastic & metal, brown glass
    const lab = st >= 2, over = st === 0;
    bin(89, 91, "#0098dc", "#0069aa", "paper", lab, over);
    bin(89, 97, "#ffa214", "#ed7614", "bottle", lab, over);
    bin(89, 103, "#bf6f4a", "#8a4836", "jar", lab, over);
    hot.recycle = trk; trk = null;
    props(st, { litter: [[88, 96], [87, 104], [96, 88]], smog: G(113, 110, 48), wilt: [G(88, 110)], shrub: [G(88, 110), G(96, 89)], flower: [G(88, 108), G(98, 89)], tree: G(89, 113), fly: G(92, 100, 16) });
  }

  function compost(st) {
    lotPave(52, 88, 28, 6, st, "#bf6f4a", "#8a4836");
    trk = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    // greenhouse
    const gl = st >= 2 ? ["#94fdff", "#0cf1ff"] : st === 1 ? ["#c7cfdd", "#92a1b9"] : ["#b4b4b4", "#858585"];
    const f = box(68, 100, 12, 14, 12, { left: gl[0], right: gl[1] });
    for (let k = 4; k < f.L.n; k += 6) fr(f.L, k, 1, 1, 11, "#ffffff");
    for (let k = 4; k < f.R.n; k += 6) fr(f.R, k, 1, 1, 11, "#c7cfdd");
    fr(f.L, 1, 6, f.L.n - 1, 1, "#ffffff"); fr(f.R, 1, 6, f.R.n - 1, 1, "#c7cfdd");
    if (st >= 1) { for (let k = 2; k < f.L.n - 2; k += 4) fr(f.L, k, 1, 2, 3, "#33984b"); }
    if (st >= 2) { for (let k = 3; k < f.L.n - 2; k += 4) fr(f.L, k, 4, 1, 1, "#ea323c"); }
    if (st === 0) { fr(f.L, 8, 7, 3, 3, "#424c6e"); fr(f.R, 12, 2, 4, 3, "#424c6e"); }
    roof(68, 100, 12, 14, 12, 6, "v", { light: "#ffffff", mid: gl[0], dark: gl[1], wall: gl[0] }, 0);
    if (st === 3) { const [x, y] = G(74, 107, 19); R(x - 1, y - 2, 3, 3, O); P(x, y - 1, "#ffeb57"); }
    // sign
    const [sx, sy] = G(66, 98);
    signboard(sx - 4, sy + 2, 12, "#f9e6cf", sproutGlyph, st === 0);
    // compost bays (open wooden boxes)
    for (let i = 0; i < 3; i++) {
      const b = box(57 + i * 5, 92, 4, 4, 5, { left: "#8a4836", right: "#5d2c28", top: st >= 1 ? "#391f21" : "#3d3d3d", rim: "#bf6f4a" });
      fr(b.L, 2, 2, 5, 1, "#5d2c28");
      const [x, y] = G(59 + i * 5, 94, 6);
      if (st >= 1) { P(x - 1, y, "#5ac54f"); P(x + 2, y - 1, "#e69c69"); } else { P(x, y - 1, "#ffffff"); P(x + 1, y, "#0cf1ff"); }
    }
    // veggie beds
    for (let j = 0; j < 2; j++) {
      box(54, 102 + j * 6, 10, 3, 2, { left: "#8a4836", right: "#5d2c28", top: "#5d2c28", rim: "#bf6f4a" });
      for (let i = 1; i < 10; i += 2) {
        const [x, y] = G(54 + i, 103.5 + j * 6, 3);
        if (st >= 2) { P(x, y - 1, "#5ac54f"); P(x - 1, y - 2, "#99e65f"); P(x + 1, y - 2, "#5ac54f"); if (st === 3 && i % 4 === 1) P(x, y - 3, "#ea323c"); }
        else if (st === 1) P(x, y - 1, "#33984b");
        else { P(x, y - 1, "#8a4836"); P(x + 1, y, "#bf6f4a"); }
      }
    }
    hot.compost = trk; trk = null;
    props(st, { litter: [[54, 97], [62, 89], [52, 113]], smog: G(76, 108, 30), wilt: [G(52, 100)], shrub: [G(52, 100), G(64, 90)], flower: [G(53, 98), G(66, 90)], tree: G(78, 114), fly: G(60, 105, 10) });
  }

  function maker(st) {
    lotPave(52, 20, 10, 20, st);
    trk = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    const wall = dullWall(st, ["#ffa214", "#ed7614"], ["#b4b4b4", "#858585"], ["#858585", "#5d5d5d"]);
    const f = box(62, 24, 16, 14, 22, { left: wall[0], right: wall[1], top: st >= 1 ? "#5d5d5d" : "#3d3d3d" });
    // brick courses
    for (let z = 4; z < 22; z += 4) { fr(f.L, 1, z, f.L.n - 1, 1, st >= 2 ? "#ed7614" : "#5d5d5d"); fr(f.R, 1, z, f.R.n - 1, 1, st >= 2 ? "#c64524" : "#424c6e"); }
    // big garage door
    fr(f.L, 5, 1, 20, 16, O); fr(f.L, 6, 1, 18, 15, st >= 2 ? "#ffeb57" : "#424c6e");
    if (st >= 2) { fr(f.L, 6, 1, 18, 6, "#424c6e"); for (let k = 8; k < 24; k += 4) fr(f.L, k, 2, 2, 4, "#657392"); fr(f.L, 6, 7, 18, 1, "#ed7614"); fr(f.L, 6, 8, 18, 8, "#ffeb57"); for (let z = 9; z < 16; z += 2) fr(f.L, 6, z, 18, 1, "#ffc825"); }
    else for (let z = 2; z < 16; z += 2) fr(f.L, 6, z, 18, 1, "#2a2f4e");
    win(f.R, 5, 8, 6, 6, st >= 2, O); win(f.R, 17, 8, 6, 6, st >= 2, O);
    // parapet
    box(62, 24, 16, 14, 2, { left: "#c7cfdd", right: "#92a1b9", top: "#5d5d5d" }, 22);
    if (st === 3) solar(66, 28, 9, 8, 24);
    // gear sign on roof
    const [gx, gy] = G(70, 26, 24);
    R(gx, gy - 4, 1, 4, O);
    if (st >= 2) { blob(gx, gy - 10, 5, 5, ["#424c6e", "#657392", "#92a1b9"]); [[0, -7], [0, 7], [-7, 0], [7, 0], [-5, -5], [5, -5], [-5, 5], [5, 5]].forEach(([dx, dy]) => R(gx + dx - 1, gy - 10 + dy - 1, 3, 3, O)); [[0, -7], [0, 7], [-7, 0], [7, 0]].forEach(([dx, dy]) => P(gx + dx, gy - 10 + dy, "#657392")); R(gx - 1, gy - 11, 3, 3, "#ffc825"); }
    else { const p = [[gx - 6, gy - 13], [gx + 6, gy - 9], [gx + 6, gy - 4], [gx - 6, gy - 8]]; poly(p, "#858585"); stroke(p); }
    hot.maker = trk; trk = null;
    // workbench
    const wb = box(55, 30, 4, 7, 5, { left: "#8a4836", right: "#5d2c28", top: "#bf6f4a" });
    fr(wb.L, 1, 1, 6, 3, "#391f21");
    const [bx, by] = G(57, 33, 6);
    if (st >= 1) { R(bx - 3, by - 2, 4, 1, "#c7cfdd"); R(bx + 2, by - 3, 1, 3, "#ea323c"); R(bx + 4, by - 1, 3, 1, "#0098dc"); }
    else { R(bx - 2, by - 2, 3, 2, "#5d5d5d"); P(bx + 3, by - 1, "#ffffff"); }
    props(st, { litter: [[54, 22], [58, 40], [53, 36]], smog: G(70, 31, 38), wilt: [G(54, 24)], shrub: [G(54, 24), G(60, 40)], flower: [G(54, 26), G(61, 41)], tree: G(78, 20), fly: G(56, 26, 16) });
  }

  function market(st) {
    lotPave(16, 52, 18, 26, st);
    trk = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    // shophouse (facade = right face, facing the plaza road)
    const pal = st >= 2 ? [["#fdd2ed", "#f68187"], ["#94fdff", "#00cdf9"], ["#f9e6cf", "#e69c69"]] : st === 1 ? [["#c7cfdd", "#92a1b9"], ["#b4b4b4", "#858585"], ["#c7cfdd", "#92a1b9"]] : [["#b4b4b4", "#858585"], ["#858585", "#5d5d5d"], ["#b4b4b4", "#858585"]];
    const f = box(34, 54, 8, 24, 24, { left: pal[0][0], right: pal[0][1] });
    const shut = st >= 2 ? ["#1e6f50", "#0069aa", "#c42430"] : ["#5d5d5d", "#424c6e", "#5d5d5d"];
    for (let i = 0; i < 3; i++) {
      const k0 = i * 16;
      fr(f.R, k0 + 1, 1, 15, 23, pal[i][1]);
      fr(f.R, k0, 1, 1, 23, O);
      // five-foot-way arch
      fr(f.R, k0 + 4, 1, 9, 9, O); fr(f.R, k0 + 5, 1, 7, 8, st >= 2 ? "#5d2c28" : "#2a2f4e"); fr(f.R, k0 + 5, 8, 1, 1, O); fr(f.R, k0 + 11, 8, 1, 1, O);
      if (st >= 2) fr(f.R, k0 + 6, 1, 5, 5, "#ffc825");
      // upper windows with shutters
      fr(f.R, k0 + 3, 13, 11, 8, O); fr(f.R, k0 + 4, 14, 2, 6, shut[i]); fr(f.R, k0 + 11, 14, 2, 6, shut[i]);
      fr(f.R, k0 + 6, 14, 5, 6, st >= 2 ? "#ffeb57" : "#2a2f4e"); fr(f.R, k0 + 8, 14, 1, 6, O);
      fr(f.R, k0 + 1, 11, 15, 1, "#f9e6cf");
      // little signboard band (glyph only)
      fr(f.R, k0 + 3, 22, 11, 1, st === 0 && i === 1 ? pal[i][1] : "#ffffff");
    }
    for (let k = 1; k < f.L.n; k += 4) fr(f.L, k, 2, 2, 3, "#92a1b9");
    const rf = roof(34, 54, 8, 24, 24, 5, "v", st >= 1 ? { light: "#e07438", mid: "#c64524", dark: "#8e251d", wall: pal[0][0] } : { light: "#bf6f4a", mid: "#8a4836", dark: "#5d2c28", wall: pal[0][0] });
    if (st === 3) slopeSolar(rf.Q, [[1, 3, 25], [1, 21, 25], [3, 21, 27], [3, 3, 27]]);
    // stalls with striped awnings
    const aw = [["#ea323c", "#ffffff"], ["#5ac54f", "#ffffff"], ["#ffa214", "#ffffff"]];
    for (let i = 0; i < 3; i++) {
      const v = 56 + i * 8, s = box(23, v, 4, 6, 5, { left: "#8a4836", right: "#5d2c28", top: "#bf6f4a" });
      const goods = st >= 1 ? [["#ea323c", "#ffc825", "#5ac54f"], ["#99e65f", "#5ac54f", "#ffa214"], ["#ffeb57", "#ea323c", "#f68187"]][i] : ["#5d5d5d", "#858585", "#424c6e"];
      for (let j = 0; j < 5; j++) { const [x, y] = G(25, v + 1 + j, 6); P(x, y - 1, goods[j % 3]); P(x - 1, y, goods[(j + 1) % 3]); }
      // poles + awning
      const [p1x, p1y] = G(23, v); const [p2x, p2y] = G(23, v + 6);
      R(p1x, p1y - 14, 1, 14, O); R(p2x, p2y - 14, 1, 14, O);
      const A = [G(22, v - 0.5, 13), G(22, v + 6.5, 13), G(28, v + 6.5, 17), G(28, v - 0.5, 17)];
      if (st === 0 && i !== 0) { const t = [A[0], A[1], G(24, v + 4, 14)]; poly(t, "#858585"); stroke(t); continue; }
      poly(A, st >= 1 ? aw[i][1] : "#c7cfdd");
      for (let j = 0; j < 7; j += 2) poly([G(22, v - 0.5 + j, 13), G(22, v + 0.5 + j, 13), G(28, v + 0.5 + j, 17), G(28, v - 0.5 + j, 17)], st >= 1 ? aw[i][0] : "#858585");
      stroke(A);
      for (let j = 0; j < 7; j += 2) { const [x, y] = G(22, v + j, 13); R(x, y, 2, 2, st >= 1 ? aw[i][0] : "#858585"); P(x, y + 2, O); }
    }
    hot.market = trk; trk = null;
    props(st, { litter: [[18, 60], [20, 74], [30, 52]], smog: G(40, 66, 36), wilt: [G(19, 52)], shrub: [G(19, 52), G(30, 80)], flower: [G(18, 54), G(28, 80)], tree: G(16, 80), fly: G(20, 66, 20) });
  }

  function arena(st) {
    trk = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    // bleachers along the back (u high side)
    for (let s = 0; s < 3; s++) box(36 + s * 2, 18, 2, 22, 3 + s * 3, { left: st >= 2 ? ["#0098dc", "#00cdf9", "#0098dc"][s] : "#92a1b9", right: "#424c6e", top: st >= 2 ? "#c7cfdd" : "#b4b4b4", rim: "#ffffff" });
    // court
    box(16, 16, 20, 24, 1, { left: "#5d5d5d", right: "#3d3d3d", top: st >= 2 ? "#33984b" : st === 1 ? "#5d6b3a" : "#8a7a4a" });
    const lc = st >= 2 ? "#ffffff" : "#c7cfdd";
    const Lx = (u, v, u2, v2) => line(...G(u, v, 1), ...G(u2, v2, 1), lc);
    Lx(18, 18, 34, 18); Lx(34, 18, 34, 38); Lx(34, 38, 18, 38); Lx(18, 38, 18, 18); Lx(26, 18, 26, 38);
    const [cx, cy] = G(26, 28, 1); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; P(cx + Math.round(Math.cos(a) * 6), cy + Math.round(Math.sin(a) * 3), lc); }
    if (st === 0) { ground(20, 30, 4, 3, "#858585", 1); ground(28, 20, 3, 4, "#5d5d5d", 1); cracks(18, 20, 14, 16); }
    // goals
    for (const u of [17, 35]) {
      const [x1, y1] = G(u, 25, 1), [x2, y2] = G(u, 31, 1);
      R(x1, y1 - 6, 1, 6, O); R(x2, y2 - 6, 1, 6, O); line(x1, y1 - 6, x2, y2 - 6, "#ffffff"); line(x1, y1 - 7, x2, y2 - 7, O);
    }
    // scoreboard on posts at back corner
    const [sx, sy] = G(42, 29);
    R(sx - 8, sy - 18, 1, 18, O); R(sx + 7, sy - 18, 1, 18, O);
    R(sx - 11, sy - 28, 22, 12, O); R(sx - 10, sy - 27, 20, 10, "#2a2f4e");
    const seg = st >= 2 ? "#ffeb57" : "#424c6e";
    R(sx - 8, sy - 25, 3, 6, seg); R(sx - 7, sy - 24, 1, 1, "#2a2f4e"); R(sx - 7, sy - 21, 1, 1, "#2a2f4e"); P(sx - 1, sy - 24, seg); P(sx - 1, sy - 21, seg);
    R(sx + 4, sy - 25, 3, 6, seg); R(sx + 4, sy - 24, 2, 4, "#2a2f4e");
    if (st >= 2) { R(sx - 10, sy - 28, 20, 1, "#ea323c"); }
    if (st === 0) { line(sx - 10, sy - 27, sx - 2, sy - 18, "#5d5d5d"); }
    if (st === 3) { R(sx - 10, sy - 32, 20, 3, O); R(sx - 9, sy - 31, 18, 1, "#00396d"); P(sx - 6, sy - 31, "#0098dc"); P(sx + 3, sy - 31, "#0098dc"); }
    // bunting at state 3
    if (st === 3) { for (let i = 0; i < 11; i++) { const [x, y] = G(41.5, 18 + i * 2, 14); P(x, y, ["#ea323c", "#ffeb57", "#0098dc", "#5ac54f"][i % 4]); P(x, y + 1, ["#ea323c", "#ffeb57", "#0098dc", "#5ac54f"][i % 4]); } }
    hot.arena = trk; trk = null;
    props(st, { litter: [[22, 22], [30, 34], [14, 30]], smog: G(30, 30, 30), wilt: [G(15, 14)], shrub: [G(15, 14), G(14, 40)], flower: [G(14, 18), G(14, 36)], tree: G(40, 14), fly: G(30, 26, 14) });
  }

  // shared state props. spots: litter [[u,v]], smog [x,y], wilt [[x,y]], shrub [[x,y]], flower [[x,y]], tree [x,y], fly [x,y]
  function props(st, s) {
    if (st === 0) { s.litter.forEach(([u, v], i) => { const [x, y] = G(u, v); litter(x, y, i); }); }
    if (st <= 1) s.wilt.forEach(([x, y]) => (st === 0 ? wilted(x, y) : potShrub(x, y)));
    if (st === 2) s.shrub.forEach(([x, y]) => shrub(x, y));
    if (st === 3) { s.flower.forEach(([x, y], i) => (i % 2 ? flowers(x, y) : bougain(x, y))); rainTree(s.tree[0], s.tree[1]); butterfly(s.fly[0], s.fly[1]); butterfly(s.fly[0] + 9, s.fly[1] + 4, "#ffeb57"); sparkle(s.fly[0] - 8, s.fly[1] - 6); }
    if (st === 0) smog(s.smog[0], s.smog[1]);
  }

  /* ---------- decor lots ---------- */
  function shophouseRow(avg) {
    const good = avg >= 2, ok = avg >= 1;
    // covered walkway (five-foot way) in front
    const walls = ok ? [["#fdd2ed", "#c85086"], ["#d3fc7e", "#5ac54f"], ["#f9e6cf", "#e69c69"], ["#94fdff", "#00cdf9"]] : [["#c7cfdd", "#92a1b9"], ["#b4b4b4", "#858585"], ["#c7cfdd", "#92a1b9"], ["#b4b4b4", "#858585"]];
    const f = box(90, 30, 28, 8, 26, { left: walls[0][0], right: walls[3][1] });
    const shut = ["#1e6f50", "#0069aa", "#c42430", "#1e6f50"];
    for (let i = 0; i < 4; i++) {
      const k0 = i * 14;
      fr(f.L, k0 + 1, 1, 13, 25, walls[i][0]); fr(f.L, k0, 1, 1, 25, O);
      fr(f.L, k0 + 3, 1, 9, 10, O); fr(f.L, k0 + 4, 1, 7, 9, "#5d2c28"); if (good) fr(f.L, k0 + 5, 1, 5, 6, "#ffc825");
      fr(f.L, k0 + 3, 15, 9, 8, O); fr(f.L, k0 + 4, 16, 2, 6, ok ? shut[i] : "#5d5d5d"); fr(f.L, k0 + 9, 16, 2, 6, ok ? shut[i] : "#5d5d5d"); fr(f.L, k0 + 6, 16, 3, 6, good ? "#ffeb57" : "#2a2f4e");
      fr(f.L, k0 + 1, 13, 13, 1, "#ffffff"); fr(f.L, k0 + 1, 24, 13, 2, walls[i][1]);
    }
    roof(90, 30, 28, 8, 26, 5, "u", ok ? { light: "#e07438", mid: "#c64524", dark: "#8e251d", wall: walls[3][1] } : { light: "#bf6f4a", mid: "#8a4836", dark: "#5d2c28", wall: walls[3][1] });
    // walkway canopy on posts
    for (let i = 0; i <= 28; i += 7) { const [x, y] = G(90 + i, 27); R(x, y - 10, 1, 10, O); P(x + 1, y - 9, "#c7cfdd"); }
    box(90, 27, 28, 3, 2, { left: ok ? "#0069aa" : "#657392", right: "#00396d", top: ok ? "#0098dc" : "#92a1b9", rim: ok ? "#00cdf9" : "#c7cfdd" }, 10);
    // lamp + bougainvillea
    lamp(...G(88, 22), good);
    if (avg >= 2) bougain(...G(89, 32));
    if (avg < 1) { const [x, y] = G(92, 20); litter(x, y, 1); }
  }
  function park(avg) {
    const dull = avg < 1;
    // bus stop shelter by the road
    const bs = box(14, 90, 3, 10, 12, { left: "#0098dc", right: "#0069aa" });
    fr(bs.R, 1, 1, bs.R.n - 1, 11, "#94fdff"); fr(bs.R, 1, 1, bs.R.n - 1, 3, "#c7cfdd");
    box(13, 89, 5, 12, 2, { left: "#ea323c", right: "#c42430", top: "#f5555d", rim: "#f68187" }, 12);
    const [px, py] = G(13, 104); R(px, py - 16, 1, 16, O); R(px - 3, py - 21, 7, 6, O); R(px - 2, py - 20, 5, 4, "#ffffff"); R(px - 1, py - 19, 3, 2, "#0098dc");
    palm(...G(24, 96), 24, dull); palm(...G(36, 110), 20, dull); rainTree(...G(30, 92), dull);
    if (!dull) { banana(...G(18, 112)); bougain(...G(40, 94)); }
    else { const [x, y] = G(26, 104); litter(x, y, 0); wilted(...G(20, 110)); }
  }
  function plaza(avg) {
    ground(52, 52, 26, 26, "#c7cfdd");
    for (let i = 52; i < 78; i += 4) { line(...G(i, 52), ...G(i, 78), "#92a1b9"); line(...G(52, i), ...G(78, i), "#92a1b9"); }
    ground(60, 60, 10, 10, avg >= 1 ? "#e69c69" : "#b4b4b4");
    for (let i = 61; i < 70; i += 2) { line(...G(i, 60), ...G(i, 70), avg >= 1 ? "#f6ca9f" : "#c7cfdd"); }
    if (avg < 1) cracks(54, 54, 20, 20);
    // planters with trees at the back corners
    [[76, 56], [56, 76], [76, 76]].forEach(([u, v]) => {
      box(u - 1, v - 1, 3, 3, 3, { left: "#8a4836", right: "#5d2c28", top: avg >= 1 ? "#391f21" : "#5d5d5d", rim: "#bf6f4a" });
      const [x, y] = G(u + 0.5, v + 0.5, 3);
      if (avg >= 1) { R(x, y - 6, 1, 6, "#5d2c28"); blob(x, y - 10, 5, 4, GRN); } else wilted(x, y + 1);
    });
    lamp(...G(51, 51), avg >= 2); lamp(...G(79, 51), avg >= 2); lamp(...G(51, 79), avg >= 2);
  }

  /* ---------- placeable decorations (shop items; fixed free spots, drawn over the island) ---------- */
  function fountain(u, v) {
    const [x, y] = G(u, v);
    ell(x, y, 12, 6, O); ell(x, y - 1, 11, 5, "#92a1b9"); ell(x, y - 3, 11, 5, O); ell(x, y - 3, 10, 4, "#c7cfdd");
    ell(x, y - 3, 8, 3, "#0098dc"); ell(x - 2, y - 4, 4, 1, "#00cdf9");
    R(x - 2, y - 13, 5, 11, O); R(x - 1, y - 12, 3, 10, "#c7cfdd"); R(x - 1, y - 12, 1, 10, "#ffffff");
    ell(x, y - 14, 5, 2, O); ell(x, y - 14, 4, 1, "#92a1b9");
    for (const s of [-1, 1]) for (let i = 0; i < 6; i++) P(x + s * (i + 1), y - 17 + Math.round(i * i / 4), i < 4 ? "#94fdff" : "#00cdf9");
    R(x, y - 20, 1, 4, "#94fdff"); P(x, y - 21, "#ffffff"); P(x - 6, y - 4, "#ffffff"); P(x + 5, y - 2, "#ffffff");
  }
  function mural(u, v) {
    const f = box(u, v, 2, 14, 16, { left: "#c7cfdd", right: "#f9e6cf", top: "#92a1b9" });
    ["#0098dc", "#5ac54f", "#ffeb57", "#f68187"].forEach((col, i) => fr(f.R, 2 + i * 6, 2, 6, 12, col));
    // painted recycling loop + leaf (no words)
    fr(f.R, 6, 6, 16, 2, "#ffffff"); fr(f.R, 6, 10, 16, 2, "#ffffff"); fr(f.R, 5, 7, 2, 4, "#ffffff"); fr(f.R, 21, 7, 2, 4, "#ffffff");
    fr(f.R, 12, 8, 4, 2, "#1e6f50"); fr(f.R, 2, 14, 24, 1, "#1e6f50");
  }
  function bike(x, y, col) {
    for (const wx of [-4, 4]) { ell(x + wx, y - 3, 3, 3, O); ell(x + wx, y - 3, 2, 2, "#c7cfdd"); P(x + wx, y - 3, O); }
    line(x - 4, y - 3, x, y - 7, col); line(x, y - 7, x + 4, y - 3, col); line(x - 4, y - 3, x + 1, y - 3, col); line(x - 1, y - 7, x + 3, y - 7, col);
    R(x - 2, y - 9, 3, 1, O); R(x + 3, y - 9, 1, 2, O); R(x + 2, y - 10, 3, 1, O);
  }
  function bikerack(u, v) {
    const [x, y] = G(u, v);
    R(x - 13, y - 1, 27, 2, "#657392");
    for (let i = -10; i <= 10; i += 5) { R(x + i - 1, y - 7, 4, 7, O); R(x + i, y - 6, 2, 6, "#92a1b9"); R(x + i, y - 6, 2, 1, "#c7cfdd"); }
    bike(x - 6, y + 1, "#ea323c"); bike(x + 7, y + 2, "#0098dc");
  }
  function raingarden(u, v) {
    ground(u - 1, v - 1, 10, 9, O); ground(u, v, 8, 7, "#5d2c28");
    ground(u + 2, v + 2, 4, 3, "#0069aa"); ground(u + 3, v + 2, 2, 2, "#00cdf9");
    [[u + 5, v + 1], [u + 1, v + 4]].forEach(([a, b]) => { const [x, y] = G(a, b); R(x - 2, y - 2, 4, 3, O); R(x - 1, y - 2, 2, 2, "#b4b4b4"); });
    [[u + 1, v + 1], [u + 7, v + 2], [u + 2, v + 6], [u + 6, v + 6]].forEach(([a, b], i) => { const [x, y] = G(a, b); i % 2 ? flowers(x, y) : shrub(x, y, 3); });
    const [rx, ry] = G(u + 7, v + 6); for (let i = 0; i < 3; i++) { R(rx - 2 + i * 2, ry - 9 + i, 1, 9 - i, "#1e6f50"); P(rx - 2 + i * 2, ry - 10 + i, "#8a4836"); }
  }
  function solarLamp(x, y) {
    R(x - 1, y - 16, 3, 17, O); R(x, y - 15, 1, 15, "#657392");
    R(x - 4, y - 21, 9, 4, O); R(x - 3, y - 20, 7, 2, "#00396d"); P(x - 1, y - 20, "#0098dc"); P(x + 2, y - 20, "#0098dc");
    R(x - 2, y - 17, 5, 3, O); R(x - 1, y - 16, 3, 1, "#ffeb57"); P(x - 2, y - 13, "#fffbd0"); P(x + 2, y - 13, "#fffbd0");
  }
  function gazebo(u, v) {
    // wakaf: timber platform on short stilts, open sides, steep gable roof
    const C = [[0, 0], [8, 0], [0, 8], [8, 8]];
    for (const [a, b] of C) { const [x, y] = G(u + a, v + b); R(x - 1, y - 5, 3, 5, O); P(x, y - 4, "#5d2c28"); }
    box(u, v, 8, 8, 2, { left: "#8a4836", right: "#5d2c28", top: "#bf6f4a", rim: "#e69c69" }, 4);
    for (let i = 2; i < 8; i += 2) line(...G(u + i, v, 6), ...G(u + i, v + 8, 6), "#8a4836");
    for (const [a, b] of C) { const [x, y] = G(u + a, v + b, 6); R(x - 1, y - 12, 3, 12, O); R(x, y - 11, 1, 10, "#bf6f4a"); }
    roof(u, v, 8, 8, 18, 9, "v", { light: "#e07438", mid: "#c64524", dark: "#8e251d", wall: "#bf6f4a" }, 2);
  }
  const DECO = {
    fountain: () => fountain(68, 56),
    mural: () => mural(121, 54),
    bikerack: () => bikerack(124, 100),
    raingarden: () => raingarden(62, 6),
    solarlamps: () => [[96, 124], [102, 124], [108, 124]].forEach(([u, v]) => solarLamp(...G(u, v))),
    gazebo: () => gazebo(64, 116),
  };
  const DECO_IDS = Object.keys(DECO);
  const decoList = d => (Array.isArray(d) ? d : []).filter(id => DECO[id]).sort();

  /* ---------- whole island ---------- */
  function island(states, avg) {
    const good = avg >= 2, mid = avg >= 1;
    // island block + sand/stone edge
    box(0, 0, 130, 130, 8, { left: "#e69c69", right: "#bf6f4a" }, -8);
    for (let k = 3; k < 260; k += 9) { const [x, y] = G(130 - k / 2, 0, -3); R(x, y, 3, 2, "#bf6f4a"); const [x2, y2] = G(0, k / 2, -4); R(x2, y2, 3, 2, "#8a4836"); }
    ground(0, 0, 130, 130, good ? "#5ac54f" : mid ? "#33984b" : "#5d6b3a");
    // grass texture
    for (let u = 3; u < 130; u += 6) for (let v = 4; v < 130; v += 7) { const [x, y] = G(u + (v % 3), v); P(x, y, good ? "#99e65f" : mid ? "#5ac54f" : "#8a7a4a"); if (!mid && (u + v) % 4 === 1) R(x - 1, y + 1, 3, 1, "#8a4836"); }
    // sidewalks + roads
    for (const r of [43, 80]) { ground(r - 1, 0, 9, 130, "#b4b4b4"); ground(0, r - 1, 130, 9, "#b4b4b4"); }
    for (const r of [43, 80]) { ground(r, 0, 7, 130, "#3d3d3d"); ground(0, r, 130, 7, "#3d3d3d"); }
    const dash = mid ? "#ffeb57" : "#858585";
    for (const r of [46.5]) for (let i = 2; i < 130; i += 6) { if (Math.abs(i - 46) > 6 && Math.abs(i - 83) > 6) { line(...G(r, i), ...G(r, i + 2), dash); line(...G(i, r), ...G(i + 2, r), dash); } }
    for (const r of [83.5]) for (let i = 2; i < 130; i += 6) { if (Math.abs(i - 46) > 6 && Math.abs(i - 83) > 6) { line(...G(r, i), ...G(r, i + 2), dash); line(...G(i, r), ...G(i + 2, r), dash); } }
    // zebra crossing plaza <-> market road, and plaza <-> maker road
    for (let v = 59; v < 71; v += 2) ground(43, v, 7, 1, "#ffffff");
    for (let u = 59; u < 71; u += 2) ground(u, 43, 1, 7, "#ffffff");
    // cars / potholes
    if (!mid) { ground(10, 44, 2, 2, "#1a1932"); ground(100, 82, 2, 2, "#1a1932"); }
    // depth-ordered lots
    recycle(states.recycle);
    academy(states.academy); compost(states.compost);
    shophouseRow(avg); plaza(avg); park(avg);
    maker(states.maker); market(states.market);
    arena(states.arena);
  }

  /* ---------- sky / sea / clouds ---------- */
  function background(avg) {
    const hazy = avg < 1;
    const bands = hazy ? ["#657392", "#92a1b9", "#92a1b9", "#b4b4b4", "#c7cfdd"] : ["#0069aa", "#0098dc", "#0098dc", "#0098dc", "#00cdf9"];
    const ys = [0, 6, 14, 40, 52, 62];
    for (let i = 0; i < 5; i++) R(0, ys[i], W, ys[i + 1] - ys[i], bands[i]);
    // dither steps between bands
    for (let i = 1; i < 5; i++) for (let x = (i % 2); x < W; x += 2) P(x, ys[i], bands[i - 1]);
    if (hazy) { R(0, 44, W, 10, "#858585"); for (let x = 0; x < W; x += 2) { P(x, 43, "#858585"); P(x + 1, 54, "#858585"); } }
    // sea
    R(0, 62, W, H - 62, hazy ? "#424c6e" : "#0069aa");
    R(0, 62, W, 2, hazy ? "#657392" : "#00cdf9");
    for (let y = 70; y < H; y += 7) for (let x = (y * 7) % 23; x < W; x += 23) R(x, y, 4, 1, hazy ? "#657392" : "#0098dc");
    // far hills / mainland on horizon
    for (let x = 0; x < W; x++) { const h = Math.round(4 + 3 * Math.sin(x / 23) + 2 * Math.sin(x / 7)); if (x < 120 || x > 280) R(x, 62 - h, 1, h, hazy ? "#657392" : "#1e6f50"); }
    for (let x = 0; x < W; x++) { const h = Math.round(2 + 2 * Math.sin(x / 11 + 1)); if (x < 110 || x > 290) R(x, 62 - h, 1, h, hazy ? "#424c6e" : "#134c4c"); }
  }
  function cloud(x, y, w, hazy) {
    const m = hazy ? "#c7cfdd" : "#ffffff", s = hazy ? "#92a1b9" : "#c7cfdd";
    R(x, y, w, 6, m); R(x + 4, y - 4, w - 12, 4, m); R(x + 8, y - 8, Math.max(6, w - 26), 4, m); R(x + w - 14, y - 6, 8, 2, m);
    R(x, y + 6, w, 2, s); R(x + 2, y + 4, 4, 2, s);
  }

  /* ---------- caches + public draw ---------- */
  const hot = {};
  let bgKey = "", bg = null, fgKey = "", fg = null;
  function off() { const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const x = cv.getContext("2d"); x.imageSmoothingEnabled = false; return [cv, x]; }
  const norm = s => { const o = {}; DISTRICTS.forEach(d => { o[d] = Math.max(0, Math.min(3, (s && s[d]) | 0)); }); return o; };
  const avgOf = s => DISTRICTS.reduce((a, d) => a + s[d], 0) / DISTRICTS.length;

  function draw(ctx, opts = {}) {
    const st = norm(opts.states), avg = avgOf(st), t = opts.t || 0, hazy = avg < 1;
    const bk = hazy ? "h" : "c";
    if (bk !== bgKey) { const [cv, x] = off(); c = x; background(avg); bg = cv; bgKey = bk; }
    const dl = decoList(opts.deco), fk = JSON.stringify(st) + dl.join();
    if (fk !== fgKey) { const [cv, x] = off(); c = x; island(st, avg); dl.forEach(id => DECO[id]()); fg = cv; fgKey = fk; }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(bg, 0, 0);
    c = ctx;
    // drifting clouds (whole-pixel steps)
    [[20, 22, 54, 0.004], [170, 12, 40, 0.006], [290, 30, 62, 0.003], [110, 36, 30, 0.005]].forEach(([x0, y, w, sp]) => {
      const x = Math.round(((x0 + t * sp) % (W + 80)) - 70);
      cloud(x, y, w, hazy);
    });
    // sea glints
    if (!hazy) for (let i = 0; i < 6; i++) { const ph = Math.floor(t / 400 + i * 1.7) % 4; if (ph < 2) R((i * 67 + 13) % W, 80 + (i * 37) % 200, 2 + ph, 1, "#94fdff"); }
    ctx.drawImage(fg, 0, 0);
    c = null;
  }

  /* ---------- avatar + robot ---------- */
  const SKINS = ["#f6ca9f", "#e69c69", "#bf6f4a", "#8a4836", "#6e3a2c", "#4f2a24"];
  const SKIN_SH = ["#e69c69", "#bf6f4a", "#8a4836", "#5d2c28", "#4f2a24", "#391f21"];
  const OUTFITS = ["#0098dc", "#ea323c", "#5ac54f", "#ffc825", "#93388f", "#f68187"];
  const OUT_SH = ["#0069aa", "#c42430", "#33984b", "#ffa214", "#622461", "#c85086"];
  const HIJAB = [["#00396d", "#03193f"], ["#891e2b", "#571c27"], ["#1e6f50", "#134c4c"], ["#c64524", "#8e251d"], ["#622461", "#3b1443"], ["#c85086", "#93388f"]];
  const HAIRS = ["#1c121c", "#391f21", "#5d2c28", "#8a4836"];
  const HEADS = {
    none: [
      "....oooooo....",
      "...ohhhhhho...",
      "..ohhhhhhhho..",
      "..ohhhhhhhho..",
      "..ohssssssho..",
      "..ossessesso..",
      "..osrssssrso..",
      "...ossmmsso...",
      "....oSSSSo....",
      ".....osso.....",
    ],
    cap: [
      "....oooooo....",
      "...okkkkkko...",
      "..okkkwwkkko..",
      ".oKKKKKKKKKKo.",
      "..ohssssssho..",
      "..ossessesso..",
      "..osrssssrso..",
      "...ossmmsso...",
      "....oSSSSo....",
      ".....osso.....",
    ],
    hijab: [
      "....oooooo....",
      "...oHHHHHHo...",
      "..oHHHHHHHHo..",
      "..oHKssssKHo..",
      "..oHssssssHo..",
      "..oHsessesHo..",
      "..oHrssssrHo..",
      "..oHHsmmsHHo..",
      ".oHHHHHHHHHHo.",
      ".oHKHHHHHHKHo.",
    ],
  };
  const BODY = [
    "..occcssccco..",
    ".oCccccccccCo.",
    ".oCccccccccCo.",
    ".osCccccccCso.",
    "..oppppppppo..",
    "..oppppppppo..",
    "..opppoopppo..",
    "..oppo..oppo..",
    "..oppo..oppo..",
    "..oppo..oppo..",
    ".obbbo..obbbo.",
    ".ooooo..ooooo.",
  ];
  const BODY_HIJAB = [
    "oHHHHHHHHHHHHo",
    ".oHKHHHHHHKHo.",
    ".oCoHHHHHHoCo.",
    ".osCccccccCso.",
  ].concat(BODY.slice(4));
  function avatar(ctx, x, y, opts = {}, frame = 0) {
    const sk = Math.max(0, Math.min(5, opts.skin | 0)), of = Math.max(0, Math.min(5, opts.outfit | 0)), hr = Math.max(0, Math.min(3, opts.hair | 0));
    const head = HEADS[opts.head] ? opts.head : "none";
    const pal = { o: O, s: SKINS[sk], S: SKIN_SH[sk], r: sk < 3 ? "#f68187" : SKIN_SH[sk], e: O, m: sk < 3 ? "#c42430" : "#f5555d", h: HAIRS[hr], c: OUTFITS[of], C: OUT_SH[of], p: "#2a2f4e", b: "#ffffff", k: OUTFITS[of], K: OUT_SH[of], w: "#ffffff", H: HIJAB[of][0] };
    pal.K = head === "hijab" ? HIJAB[of][1] : OUT_SH[of];
    if (head === "hijab") pal.r = SKINS[sk];
    const body = head === "hijab" ? BODY_HIJAB : BODY;
    const prev = c; c = ctx; const tk = trk; trk = null;
    const x0 = Math.round(x) - 7, y0 = Math.round(y) - 21, bob = frame ? 1 : 0;
    // soft shadow
    R(x0 + 2, y0 + 21, 10, 1, "rgba(26,25,50,0.35)");
    const acc = opts.acc || {}, yb = y0 + bob;
    if (acc.back === "backpack") { R(x0 - 1, yb + 10, 16, 7, O); R(x0, yb + 11, 14, 5, "#bf6f4a"); R(x0, yb + 11, 14, 1, "#e69c69"); }
    sprite(x0, y0 + 16, body.slice(6), pal);
    sprite(x0, yb, HEADS[head].concat(body.slice(0, 6)), pal);
    if (acc.back === "backpack") { R(x0 + 3, yb + 10, 1, 4, "#8a4836"); R(x0 + 10, yb + 10, 1, 4, "#8a4836"); }
    const SC = { "scarf-red": ["#ea323c", "#c42430"], "scarf-blue": ["#0098dc", "#0069aa"], "scarf-green": ["#5ac54f", "#1e6f50"], "scarf-yellow": ["#ffeb57", "#ffc825"] }[acc.scarf];
    if (SC && head !== "hijab") { R(x0 + 2, yb + 9, 10, 3, O); R(x0 + 3, yb + 10, 8, 1, SC[0]); P(x0 + 5, yb + 10, SC[1]); P(x0 + 8, yb + 10, SC[1]); R(x0 + 8, yb + 11, 3, 4, O); R(x0 + 9, yb + 11, 1, 3, SC[0]); }
    if (acc.face === "glasses") for (const ex of [4, 7]) { R(x0 + ex, yb + 4, 3, 3, "#424c6e"); P(x0 + ex + 1, yb + 5, O); P(x0 + ex, yb + 4, "#94fdff"); }
    c = prev; trk = tk;
  }
  const ROBOT = [
    "........ll......",
    ".......lLl......",
    ".......a........",
    ".......a........",
    "....oooooooo....",
    "...oggggggggo...",
    "..ogddddddddGo..",
    "..ogdyyddyydGo..",
    "..ogdyyddyydGo..",
    "..ogdddyydddGo..",
    ".ooggggggggGGoo.",
    ".ogogggwwwggGogo",
    "..oggggggggGGo..",
    "...oggggggGGo...",
    "....oooooooo....",
  ];
  function robot(ctx, x, y, frame = 0) {
    const prev = c; c = ctx; const tk = trk; trk = null;
    const x0 = Math.round(x) - 8, bob = frame ? 1 : 0, y0 = Math.round(y) - 18 + bob;
    R(x0 + 4, Math.round(y), 8, 1, "rgba(26,25,50,0.35)");
    sprite(x0, y0, ROBOT, { o: O, l: "#5ac54f", L: "#99e65f", a: "#424c6e", g: "#c7cfdd", G: "#92a1b9", d: "#1a1932", y: "#0cf1ff", w: "#5ac54f" });
    // hover jets
    R(x0 + 5, y0 + 15, 2, 1 + (frame ? 0 : 1), "#ffa214"); R(x0 + 9, y0 + 15, 2, 1 + (frame ? 0 : 1), "#ffa214");
    P(x0 + 5, y0 + 15, "#ffeb57"); P(x0 + 10, y0 + 15, "#ffeb57");
    c = prev; trk = tk;
  }

  // hotspots from a one-off render of the all-3 scene (largest silhouettes)
  const hotspots = {};
  try {
    const [, x] = off(); c = x; island(norm({ academy: 3, recycle: 3, compost: 3, maker: 3, market: 3, arena: 3 }), 3); c = null;
    DISTRICTS.forEach(d => { const b = hot[d]; if (b) hotspots[d] = { x: b.x0, y: b.y0, w: b.x1 - b.x0, h: b.y1 - b.y0 }; });
  } catch (e) { c = null; }

  /* ---------- single building + section banner (stage 2) ---------- */
  const FN = { academy, recycle, compost, maker, market, arena };
  const bCache = {};
  // render one district lot off-screen once, crop to its pixels; origin later = bottom-centre
  function bSprite(id, st) {
    const k = id + st;
    if (bCache[k]) return bCache[k];
    const [cv, x] = off(); c = x; const keep = Object.assign({}, hot);
    try { FN[id](st); } finally { c = null; Object.assign(hot, keep); }
    const d = x.getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3]) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return (bCache[k] = { cv, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 });
  }
  function building(ctx, id, state, x, y) {
    if (!FN[id]) return;
    const s = bSprite(id, Math.max(0, Math.min(3, state | 0)));
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(s.cv, s.x0, s.y0, s.w, s.h, Math.round(x - s.w / 2), Math.round(y - s.h), s.w, s.h);
  }
  const BW = 400, BH = 120;
  function banner(canvas, id, state) {
    if (!canvas || !FN[id]) return;
    const st = Math.max(0, Math.min(3, state | 0)), hazy = st === 0;
    canvas.width = BW; canvas.height = BH;
    if (!canvas.style.imageRendering) canvas.style.imageRendering = "pixelated";
    const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
    c = ctx;
    try {
      // sky bands with dithered steps
      const bands = hazy ? ["#657392", "#92a1b9", "#b4b4b4", "#c7cfdd"] : ["#0069aa", "#0098dc", "#00cdf9", "#94fdff"];
      const ys = [0, 16, 52, 78, BH];
      for (let i = 0; i < 4; i++) R(0, ys[i], BW, ys[i + 1] - ys[i], bands[i]);
      for (let i = 1; i < 4; i++) for (let x = i % 2; x < BW; x += 2) P(x, ys[i], bands[i - 1]);
      if (!hazy) { R(352, 10, 14, 14, "#ffeb57"); R(354, 8, 10, 18, "#ffeb57"); R(350, 12, 18, 10, "#ffeb57"); R(355, 11, 5, 3, "#fffbd0"); }
      else { R(0, 60, BW, 8, "#858585"); for (let x = 0; x < BW; x += 2) P(x, 59, "#858585"); }
      cloud(24, 20, 50, hazy); cloud(150, 10, 36, hazy); cloud(300, 30, 56, hazy);
      // distant hills
      for (let x = 0; x < BW; x++) { const h = Math.round(10 + 5 * Math.sin(x / 31) + 3 * Math.sin(x / 9)); R(x, 96 - h, 1, h, hazy ? "#657392" : "#1e6f50"); }
      for (let x = 0; x < BW; x++) { const h = Math.round(5 + 3 * Math.sin(x / 17 + 2)); R(x, 96 - h, 1, h, hazy ? "#424c6e" : "#134c4c"); }
      // grass strip + edge
      const gr = st >= 2 ? ["#5ac54f", "#99e65f"] : st === 1 ? ["#33984b", "#5ac54f"] : ["#5d6b3a", "#8a7a4a"];
      R(0, 92, BW, BH - 92, gr[0]); R(0, 92, BW, 1, O);
      for (let y = 96; y < BH; y += 4) for (let x = (y * 5) % 11; x < BW; x += 11) { P(x, y, gr[1]); P(x + 1, y - 1, gr[1]); }
      if (hazy) for (let x = 7; x < BW; x += 23) R(x, 100 + (x % 13), 4, 1, "#8a4836");
      // building, scaled down by whole pixels only if it would not fit
      const s = bSprite(id, st), cx = 200, by = 114;
      const sc = s.h > 108 || s.w > 230 ? 0.5 : 1;   // ponytail: only 1x or 0.5x; all lots fit at 1x today
      c = ctx;
      ctx.drawImage(s.cv, s.x0, s.y0, s.w, s.h, Math.round(cx - s.w * sc / 2), Math.round(by - s.h * sc), Math.round(s.w * sc), Math.round(s.h * sc));
      // side props, mirrored-ish so the plot looks framed
      const L = cx - (s.w >> 1) - 18, Rr = cx + (s.w >> 1) + 18;
      if (st === 0) { litter(L + 6, 112, 0); litter(Rr - 4, 110, 1); wilted(L - 26, 108); smog(Rr + 40, 70); lamp(Rr + 14, 110, false); palm(L - 60, 112, 24, true); }
      else if (st === 1) { potShrub(L, 110); potShrub(Rr, 110); lamp(L - 18, 110, false); lamp(Rr + 18, 110, false); rainTree(L - 56, 112, true); palm(Rr + 60, 112, 24, true); }
      else {
        shrub(L, 112); shrub(Rr, 112); lamp(L - 18, 110, st === 3); lamp(Rr + 18, 110, st === 3);
        rainTree(L - 56, 112); palm(Rr + 60, 112, 26); banana(L - 96, 114); palm(Rr + 108, 114, 20);
        if (st === 3) { bougain(L - 30, 114); flowers(Rr + 34, 114); flowers(L + 4, 116); butterfly(L - 10, 74); butterfly(Rr + 24, 66, "#ffeb57"); sparkle(cx - 40, 30); sparkle(cx + 52, 22); }
      }
    } finally { c = null; }
  }

  // 32x32 shop icon of one decoration: render alone, crop, bottom-centre it
  function decoIcon(canvas, id) {
    if (!canvas || !DECO[id]) return false;
    const [cv, x] = off(); c = x;
    try { DECO[id](); } finally { c = null; }
    const d = x.getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3]) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const w = x1 - x0 + 1, h = y1 - y0 + 1, sc = Math.min(1, 31 / Math.max(w, h));   // ponytail: shrinks (nearest) only if a sprite outgrows 31px
    canvas.width = 32; canvas.height = 32;
    if (!canvas.style.imageRendering) canvas.style.imageRendering = "pixelated";
    const g = canvas.getContext("2d"); g.imageSmoothingEnabled = false;
    g.drawImage(cv, x0, y0, w, h, Math.round(16 - w * sc / 2), Math.round(31.5 - h * sc), Math.round(w * sc), Math.round(h * sc));
    return true;
  }

  WQ.townArt = { W, H, DISTRICTS, draw, hotspots, spawn: { x: 194, y: 204 }, avatar, SKINS, OUTFITS, HAIRS, robot, building, banner, decoIcon, DECO: DECO_IDS };
})();
