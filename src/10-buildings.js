// ═════ 10-buildings.js ═════
// ───────────────────────── Buildings: each drawn once per kind, colour and zoom, then stamped ─────────────────────────
// Local units = world units. Origin = the middle of the footprint on the ground. The ground is squashed by TILT; height is not.
// The view is turned a little: the back of each building sits SIDE × its depth to the right, so we see its front and its shaded east wall.
// Walls and gates stay square to the view: they join into lines, and a turned piece would give the line a sawtooth top.
const STONE = '#a29d90', PLASTER = '#e2d6bb', PLANK = '#8a6644', MUD = '#c49a64', THATCH = '#b8954a', TILE = '#a8543a', SLATE = '#5d6470';
// the east wall and the top of a box whose front runs x0..x1 at yf, h tall and d deep (d already squashed): drawn before its front
function sides(x0, x1, yf, h, d, wall, top = true) {
  const k = d * SIDE; P_([[x1, yf], [x1 + k, yf - d], [x1 + k, yf - d - h], [x1, yf - h]], shade(wall, 0.58), INK, 0.5);
  if (top) P_([[x0, yf - h], [x1, yf - h], [x1 + k, yf - d - h], [x0 + k, yf - d - h]], shade(wall, 1.05), INK, 0.5);
  return k;
}
// Research shows on the building it belongs to: UP is 0 (none done), 1 (some) or 2 (half or more). 1 sets it on a stone footing; 2 adds corner stones and a gilded ridge.
let UP = 0;
const TECHAT = {}; for (const t of TECH) (TECHAT[t.at] = TECHAT[t.at] || []).push(t.id);
const upTier = (kind, p) => { const T = TECHAT[kind]; if (!T) return 0; let n = 0; for (const id of T) if (p.techs.has(id)) n++; return !n ? 0 : n * 2 >= T.length ? 2 : 1; };
// a block: footprint w × w, front wall of height h, a roof on top. Returns where the top is, the depth, and k, how far right the back sits
function block(w, h, wall, tex, roof, roofCol, roofH = w * 0.35, dd) {
  const d = (dd || w) * TILT, x0 = -w / 2, x1 = w / 2, yf = d / 2, yb = -d / 2, k = d * SIDE, m = k / 2, ry = -h - roofH, far = shade(roofCol || wall, 0.7);
  if (roof && roof !== 'flat') P_(roof === 'hip' ? [[x0 + k, yb - h], [x1 + k, yb - h], [x1 - w * 0.25 + m, ry], [x0 + w * 0.25 + m, ry]] : [[x0 - 1 + k, yb - h], [x1 + 1 + k, yb - h], [x1 + 1 + m, ry], [x0 - 1 + m, ry]], far, INK, 0.5);   // the far slope, where it shows over the ridge
  sides(x0, x1, yf, h, d, wall, roof === 'flat' || !roof);
  P_([[x0, yf], [x1, yf], [x1, yf - h], [x0, yf - h]], LG(x0, 0, x1, 0, [shade(wall, 0.95), shade(wall, 0.82), shade(wall, 0.68)]), INK, 0.6);   // front
  texture(tex, x0, yf - h, x1, yf, wall);
  if (UP >= 1) { P_([[x0, yf], [x1, yf], [x1, yf - 3], [x0, yf - 3]], STONE, INK, 0.4); P_([[x1, yf], [x1 + k, yf - d], [x1 + k, yf - d - 3], [x1, yf - 3]], shade(STONE, 0.6), INK, 0.4); }
  if (UP >= 2) for (let y = yf - 6; y > yf - h + 2; y -= 6) { P_([[x0, y], [x0 + 3.4, y], [x0 + 3.4, y - 3], [x0, y - 3]], shade(STONE, 1.1), INK, 0.3); P_([[x1 - 3.4, y], [x1, y], [x1, y - 3], [x1 - 3.4, y - 3]], shade(STONE, 1.1), INK, 0.3); }
  const r = { top: yb - h, d, h, k };
  if (roof === 'flat' || !roof) return r;
  const near = LG(0, ry, 0, yf - h, [shade(roofCol, 1.2), roofCol, shade(roofCol, 0.8)]);
  if (roof === 'gable') {   // ridge runs left to right: the near slope, and the gable end on the east wall
    P_([[x1, yf - h], [x1 + k, yb - h], [x1 + m, ry]], shade(wall, 0.66), INK, 0.5);
    P_([[x0 - 1, yf - h + 1], [x1 + 1, yf - h + 1], [x1 + 1 + m, ry], [x0 - 1 + m, ry]], near, INK, 0.6);
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 0.5; for (let t = 0.25; t < 1; t += 0.25) { const y = yf - h + 1 + (ry - (yf - h + 1)) * t; g.beginPath(); g.moveTo(x0 - 1 + m * t, y); g.lineTo(x1 + 1 + m * t, y); g.stroke(); }
    L_(x0 - 1 + m, ry, x1 + 1 + m, ry, UP >= 2 ? '#e6c75a' : shade(roofCol, 1.4), UP >= 2 ? 1.6 : 1);
    return { ...r, top: ry };
  }
  if (roof === 'hip') {   // the near slope, and the east hip in shade
    P_([[x1 + 1, yf - h + 1], [x1 + 1 + k, yb - h + 1], [x1 - w * 0.25 + m, ry]], shade(roofCol, 0.62), INK, 0.5);
    P_([[x0 - 1, yf - h + 1], [x1 + 1, yf - h + 1], [x1 - w * 0.25 + m, ry], [x0 + w * 0.25 + m, ry]], near, INK, 0.6); return { ...r, top: ry };
  }
  return r;
}
function texture(tex, x0, y0, x1, y1, wall) {
  g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip();
  if (tex === 'stone') { g.strokeStyle = 'rgba(40,36,30,.35)'; g.lineWidth = 0.35; for (let y = y1, r = 0; y > y0; y -= 2.6, r++) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); for (let x = x0 + (r % 2) * 2.2; x < x1; x += 4.4) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 2.6); g.stroke(); } } }
  if (tex === 'plank') { g.strokeStyle = 'rgba(40,24,10,.4)'; g.lineWidth = 0.35; for (let x = x0; x < x1; x += 2.2) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke(); } }
  if (tex === 'timber') { g.strokeStyle = '#4a3420'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(x0, y0 + 0.5); g.lineTo(x1, y0 + 0.5); g.moveTo(x0 + 0.5, y0); g.lineTo(x0 + 0.5, y1); g.moveTo(x1 - 0.5, y0); g.lineTo(x1 - 0.5, y1); g.moveTo(x0, (y0 + y1) / 2); g.lineTo(x1, (y0 + y1) / 2); g.moveTo(x0, y1); g.lineTo((x0 + x1) / 2, y0); g.stroke(); }
  if (tex === 'mud') { g.fillStyle = 'rgba(90,60,30,.18)'; for (let i = 0; i < 30; i++) g.fillRect(x0 + ((i * 7.3) % (x1 - x0)), y0 + ((i * 3.7) % (y1 - y0)), 1.2, 0.5); }
  g.restore();
}
const ridgeRoof = (x1, ye, ya, d, col) => { const k = d * SIDE; P_([[-x1, ye], [-x1 + k, ye - d], [k, ya - d], [0, ya]], shade(col, 1.08), INK, 0.5); P_([[x1, ye], [x1 + k, ye - d], [k, ya - d], [0, ya]], shade(col, 0.8), INK, 0.5); };   // a roof whose ridge runs front to back: eaves at ye, apex at ya; the pediment is drawn after
const door = (x, yf, w, h, col = '#3a2614') => { P_([[x - w / 2, yf], [x + w / 2, yf], [x + w / 2, yf - h + w / 2], [x, yf - h], [x - w / 2, yf - h + w / 2]], col, INK, 0.4); };
const win = (x, y, w = 2, h = 2.6, col = '#2a2014') => { P_([[x - w / 2, y], [x + w / 2, y], [x + w / 2, y - h], [x - w / 2, y - h]], col, '#1a120a', 0.3); };
const banner = (x, y, col, len = 9) => { L_(x, y, x, y - len - 4, '#3a2a1a', 0.7); P_([[x, y - len - 4], [x + 6, y - len - 2.6], [x, y - len - 1]], col, INK, 0.3); };
const crenels = (x0, x1, y, col) => { for (let x = x0; x < x1 - 0.5; x += 3) P_([[x, y], [x + 1.8, y], [x + 1.8, y - 2], [x, y - 2]], col, INK, 0.3); };
const column = (x, yb, yt, col = '#efe6d4') => { P_([[x - 0.9, yb], [x + 0.9, yb], [x + 0.9, yt], [x - 0.9, yt]], LG(x - 1, 0, x + 1, 0, [shade(col, 1.05), shade(col, 0.75)]), INK, 0.3); P_([[x - 1.4, yt], [x + 1.4, yt], [x + 1.4, yt - 0.8], [x - 1.4, yt - 0.8]], col, INK, 0.3); };
const smallTree = (x, y, s = 1, col = '#2f6a2f') => { L_(x, y, x, y - 3 * s, '#4c3a22', 0.8 * s); E_(x, y - 5 * s, 3 * s, 3.2 * s, LG(x - 3 * s, y - 8 * s, x + 3 * s, y - 2 * s, [shade(col, 1.25), col, shade(col, 0.75)]), INK, 0.3); };
// the art for each building kind. c = side colour, o = owner (for civ and research), w = width in world units
const ART = {
  keep(c, o, v) {   // the Town Center: a timber-framed hall on a stone base, with a bell tower and the town's banner
    const r = block(50, 22, PLASTER, 'timber', 'gable', TILE, 12); const d = r.d;
    P_([[-26, d / 2 + 1], [26, d / 2 + 1], [26, d / 2 - 4], [-26, d / 2 - 4]], STONE, INK, 0.5); texture('stone', -26, d / 2 - 4, 26, d / 2 + 1, STONE);
    g.save(); g.translate(15, d / 2 - 4); const tk = sides(-5, 5, 0, 40, 10 * TILT, STONE); P_([[-5, 0], [5, 0], [5, -40], [-5, -40]], LG(-5, 0, 5, 0, [shade(STONE, 0.95), shade(STONE, 0.72)]), INK, 0.5); texture('stone', -5, -40, 5, 0, STONE); P_([[-4, -30], [4, -30], [4, -36], [-4, -36]], '#14100c'); E_(0, -32.6, 1.6, 1.9, '#c9a227'); P_([[-6.5, -40], [6.5 + tk, -40 - 10 * TILT], [tk / 2, -52]], shade(TILE, 0.6), INK, 0.5); P_([[-6.5, -40], [6.5, -40], [tk / 2, -52]], TILE, INK, 0.5); g.restore();
    door(-6, d / 2 - 4, 8, 12, '#4a2e16'); for (const x of [-18, 4]) win(x, d / 2 - 11, 2.4, 3.4);
    banner(-22, d / 2 - 22, c, 12); L_(-25, d / 2 - 1, 25, d / 2 - 1, c, 1.4);
    if (v >= 2) { const bx = -27, by = d / 2 - 1; P_([[bx - 9, by - 1], [bx, by + 6], [bx + 9, by - 1], [bx + 9, by - 10], [bx, by - 4], [bx - 9, by - 10]], LG(bx - 9, 0, bx + 9, 0, [shade(STONE, 1.05), shade(STONE, 0.78)]), INK, 0.5); P_([[bx - 9, by - 10], [bx, by - 16], [bx + 9, by - 10], [bx, by - 4]], shade(STONE, 1.18), INK, 0.5); L_(bx - 1, by - 10.5, bx + 7, by - 12.5, '#3a3a40', 2.2); E_(bx + 7.6, by - 12.7, 1.2, 1.2, '#1a1a1c'); }   // Gunpowder: an angled stone bastion with a gun on it
  },
  town(c, o, v) { g.save(); g.scale(0.82, 0.82); ART.keep(c, o, v); g.restore(); },
  castle(c, o) {
    const w = 50, castle = true, d = w * TILT;
    block(w, 30, STONE, 'stone', 'flat'); crenels(-25, 25, d / 2 - 30, STONE);
    for (const sx of [-1, 1]) { g.save(); g.translate(sx * 20, d / 2 - 2); const tk = sides(-6, 6, 0, 42, 12 * TILT, STONE); P_([[-6, 0], [6, 0], [6, -42], [-6, -42]], LG(-6, 0, 6, 0, [shade(STONE, 0.95), shade(STONE, 0.7)]), INK, 0.6); texture('stone', -6, -42, 6, 0, STONE); crenels(-6, 6, -42, STONE); { P_([[-7, -44], [7 + tk, -44 - 12 * TILT], [tk / 2, -56]], shade(SLATE, 0.6), INK, 0.5); P_([[-7, -44], [7, -44], [tk / 2, -56]], SLATE, INK, 0.5); } win(0, -30, 1.6, 3.4, '#14100c'); g.restore(); }
    door(0, d / 2, 9, 14, '#4a2e16'); L_(-4.5, d / 2 - 9, 4.5, d / 2 - 9, '#2a1a0a', 0.6); win(-9, d / 2 - 18, 1.6, 3.4); win(9, d / 2 - 18, 1.6, 3.4);
    banner(0, d / 2 - 32, c, 14); L_(-25, d / 2 - 1, 25, d / 2 - 1, c, 1.4);
  },
  house(c) { const r = block(20, 13, PLASTER, 'timber', 'gable', THATCH, 8); door(-4, r.d / 2, 4, 7); win(4, r.d / 2 - 5); L_(-10, r.d / 2 - 0.5, 10, r.d / 2 - 0.5, c, 1.2); const m = r.k / 2; P_([[5 + m, -21], [7.4 + m, -21], [7.4 + m, -26], [5 + m, -26]], '#6a5a4a', INK, 0.3); },
  apartment(c) { const r = block(30, 34, '#cf9e6e', 'stone', 'hip', TILE, 8); for (let y = r.d / 2 - 6; y > r.d / 2 - 32; y -= 7) for (let x = -10; x <= 10; x += 6.6) win(x, y, 2.4, 3.4, '#3a2a1a'); door(0, r.d / 2, 5, 6); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  aqueduct(c) { const d = 30 * TILT; sides(-17, 17, d / 2, 28, 8 * TILT, STONE); P_([[-17, d / 2], [17, d / 2], [17, d / 2 - 28], [-17, d / 2 - 28]], LG(-17, 0, 17, 0, [shade(STONE, 0.95), shade(STONE, 0.72)]), INK, 0.6); texture('stone', -17, d / 2 - 28, 17, d / 2, STONE); for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 11 - 4, d / 2); g.lineTo(i * 11 - 4, d / 2 - 12); g.arc(i * 11, d / 2 - 12, 4, Math.PI, 0); g.lineTo(i * 11 + 4, d / 2); g.closePath(); g.fillStyle = '#2a3020'; g.fill(); } for (let i = -2; i <= 2; i++) { g.beginPath(); g.arc(i * 6.6, d / 2 - 21, 2, Math.PI, 0); g.fillStyle = '#2a3020'; g.fill(); } P_([[-18, d / 2 - 28], [18, d / 2 - 28], [18, d / 2 - 31], [-18, d / 2 - 31]], '#7aa6c8', INK, 0.4); L_(-17, d / 2 - 0.5, 17, d / 2 - 0.5, c, 1.2); },
  mill(c) { const r = block(30, 16, PLANK, 'plank', 'gable', THATCH, 9); door(0, r.d / 2, 5, 9); E_(-8, r.d / 2 - 3, 3, 2, '#d8c27a', INK, 0.3); E_(9, r.d / 2 - 3, 3, 2, '#d8c27a', INK, 0.3); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  lumber(c) { const r = block(30, 12, PLANK, 'plank', 'gable', '#7a5634', 6, 20); for (let i = 0; i < 4; i++) E_(-11 + i * 3, r.d / 2 + 2 - (i % 2) * 2, 1.6, 1.6, '#c89a68', '#6b4a2c', 0.4); for (let i = 0; i < 3; i++) E_(-9.4 + i * 3, r.d / 2 - 1.2, 1.6, 1.6, '#c89a68', '#6b4a2c', 0.4); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  mining(c) { const r = block(30, 12, STONE, 'stone', 'gable', SLATE, 6, 20); P_([[6, r.d / 2], [14, r.d / 2], [13, r.d / 2 - 4], [7, r.d / 2 - 4]], '#5a3a1c', INK, 0.4); E_(9, r.d / 2 - 4.6, 1.6, 1.2, '#f2cf55'); E_(11.4, r.d / 2 - 4.6, 1.6, 1.2, '#b4bbc0'); door(-6, r.d / 2, 6, 8, '#1a120a'); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  barracks(c) { const r = block(40, 18, PLANK, 'plank', 'gable', '#8a3a2a', 10); door(0, r.d / 2, 6, 11); for (const x of [-13, -9, 10, 14]) { L_(x, r.d / 2, x + 1.5, r.d / 2 - 11, '#8a6a3a', 0.6); P_([[x + 1.5, r.d / 2 - 11], [x + 2, r.d / 2 - 13], [x + 1, r.d / 2 - 11]], '#ddd'); } banner(-18, r.d / 2 - 18, c, 10); L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2); },
  range(c) { const r = block(40, 16, PLANK, 'plank', 'gable', '#5d6e3e', 9); door(-8, r.d / 2, 6, 10); E_(12, r.d / 2 - 6, 4, 4, '#e8dcc0', INK, 0.4); E_(12, r.d / 2 - 6, 2.6, 2.6, '#c33'); E_(12, r.d / 2 - 6, 1, 1, '#e8dcc0'); L_(12, r.d / 2 - 2, 12, r.d / 2, '#5a3a1c', 0.8); banner(-18, r.d / 2 - 16, c, 9); L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2); },
  stable(c) { const r = block(40, 16, PLANK, 'plank', 'gable', THATCH, 10); for (let i = -2; i <= 2; i++) { P_([[i * 7 - 2.4, r.d / 2], [i * 7 + 2.4, r.d / 2], [i * 7 + 2.4, r.d / 2 - 7], [i * 7 - 2.4, r.d / 2 - 7]], '#3a2614', INK, 0.3); E_(i * 7 + 0.6, r.d / 2 - 6.8, 1.2, 1.6, '#7a4e2c'); } banner(-18, r.d / 2 - 16, c, 9); L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2); },
  smith(c) { const r = block(30, 14, STONE, 'stone', 'gable', SLATE, 7); P_([[7 + r.k / 2, -18], [11 + r.k / 2, -18], [11 + r.k / 2, -28], [7 + r.k / 2, -28]], '#5a5550', INK, 0.4); P_([[-4, r.d / 2], [6, r.d / 2], [6, r.d / 2 - 9], [-4, r.d / 2 - 9]], '#1a120a', INK, 0.4); E_(1, r.d / 2 - 3, 3.4, 2.4, 'rgba(255,140,40,.85)'); P_([[-12, r.d / 2], [-6, r.d / 2], [-6.6, r.d / 2 - 2.6], [-13.4, r.d / 2 - 3.6], [-11, r.d / 2 - 2.6]], '#3a3a3a'); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  market(c) {
    const d = 30 * TILT; P_([[-15, d / 2], [15, d / 2], [15, -d / 2], [-15, -d / 2]], '#b59a72', INK, 0.4);
    for (const [x, y, col] of [[-8, -4, '#b2563a'], [8, -4, c], [-8, 6, c], [8, 6, '#c9a227']]) { L_(x - 6, y, x - 6, y - 9, WOOD, 0.7); L_(x + 6, y, x + 6, y - 9, WOOD, 0.7); for (let i = 0; i < 6; i++) P_([[x - 6.5 + i * 2.2, y - 9], [x - 4.3 + i * 2.2, y - 9], [x - 4.3 + i * 2.2, y - 12], [x - 6.5 + i * 2.2, y - 12]], i % 2 ? '#f0e6d0' : col, null); P_([[x - 6, y], [x + 6, y], [x + 6, y - 2.4], [x - 6, y - 2.4]], WOOD); E_(x - 2.4, y - 3.2, 1.4, 1, '#e0708a'); E_(x + 1, y - 3.2, 1.4, 1, '#f2cf55'); E_(x + 3.6, y - 3.2, 1.2, 1, '#9acd5a'); }
  },
  school(c) { const r = block(30, 16, PLASTER, null, 'gable', SLATE, 8); door(0, r.d / 2, 5, 9); win(-8, r.d / 2 - 5); win(8, r.d / 2 - 5); P_([[-1.4 + r.k / 2, -24], [1.4 + r.k / 2, -24], [1.4 + r.k / 2, -28], [-1.4 + r.k / 2, -28]], '#5a4a3a'); E_(r.k / 2, -26, 1, 1.2, '#e6c75a'); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  library(c, o) {
    const d = 40 * TILT, uni = G.P[o] && G.P[o].age >= 3; P_([[-21, d / 2 + 1], [21, d / 2 + 1], [21, d / 2 - 2], [-21, d / 2 - 2]], '#d8cdb4', INK, 0.5);
    block(40, 22, PLASTER, null, 'flat'); for (let x = -16; x <= 16; x += 6.4) column(x, d / 2 - 2, d / 2 - 21);
    const k = d * SIDE;
    if (uni) { P_([[20, d / 2 - 22], [20 + k, d / 2 - 22 - d], [14 + k / 2, d / 2 - 34 - d / 2]], shade(SLATE, 0.6), INK, 0.5); P_([[-20, d / 2 - 22], [20, d / 2 - 22], [14 + k / 2, d / 2 - 34 - d / 2], [-14 + k / 2, d / 2 - 34 - d / 2]], SLATE, INK, 0.6); P_([[-3, d / 2 - 34], [3, d / 2 - 34], [3, d / 2 - 44], [0, d / 2 - 48], [-3, d / 2 - 44]], STONE, INK, 0.5); }
    else ridgeRoof(21, d / 2 - 22, d / 2 - 31, d, '#efe6d4'), P_([[-21, d / 2 - 22], [21, d / 2 - 22], [0, d / 2 - 31]], LG(0, -30, 0, -20, ['#efe6d4', '#c8bca2']), INK, 0.6);
    L_(-20, d / 2 - 0.5, 20, d / 2 - 0.5, c, 1.2);
  },
  hospital(c) { const r = block(30, 16, '#efe8da', null, 'hip', TILE, 7); door(0, r.d / 2, 5, 9); P_([[-9.6, r.d / 2 - 11], [-6.4, r.d / 2 - 11], [-6.4, r.d / 2 - 3], [-9.6, r.d / 2 - 3]], '#c23a30'); P_([[-12, r.d / 2 - 8.6], [-4, r.d / 2 - 8.6], [-4, r.d / 2 - 5.4], [-12, r.d / 2 - 5.4]], '#c23a30'); win(8, r.d / 2 - 5); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  temple(c) {
    const d = 40 * TILT; for (let i = 0; i < 3; i++) P_([[-21 + i * 1.5, d / 2 - i * 1.6], [21 - i * 1.5, d / 2 - i * 1.6], [21 - i * 1.5, d / 2 - i * 1.6 - 1.6], [-21 + i * 1.5, d / 2 - i * 1.6 - 1.6]], '#d8cdb4', INK, 0.4);
    sides(-16, 16, d / 2 - 5, 22, d, '#c9bfa6'); P_([[-16, d / 2 - 5], [16, d / 2 - 5], [16, d / 2 - 27], [-16, d / 2 - 27]], '#c9bfa6', INK, 0.4);
    for (let x = -15; x <= 15; x += 5) column(x, d / 2 - 5, d / 2 - 27);
    ridgeRoof(19, d / 2 - 27, d / 2 - 38, d, '#c9a227'); P_([[-19, d / 2 - 27], [19, d / 2 - 27], [0, d / 2 - 38]], LG(0, -38, 0, -26, ['#f2d880', '#c9a227']), INK, 0.6); E_(0, d / 2 - 31, 2, 2, c);
  },
  courthouse(c) { const d = 30 * TILT; block(30, 20, '#d8d0c0', 'stone', 'flat'); for (let x = -12; x <= 12; x += 6) column(x, d / 2, d / 2 - 19); ridgeRoof(16, d / 2 - 20, d / 2 - 28, d, '#e8e0cc'); P_([[-16, d / 2 - 20], [16, d / 2 - 20], [0, d / 2 - 28]], '#e8e0cc', INK, 0.5); L_(-3, d / 2 - 24, 3, d / 2 - 24, '#c9a227', 0.6); L_(0, d / 2 - 26, 0, d / 2 - 22, '#c9a227', 0.6); L_(-15, d / 2 - 0.5, 15, d / 2 - 0.5, c, 1.2); },
  bakery(c) { const r = block(30, 12, '#e0c89a', 'mud', 'flat'); E_(-6 + r.k / 2, r.top + r.d / 2 + 1, 6, 5, MUD, INK, 0.5); E_(-6 + r.k / 2, r.top + r.d / 2 + 2, 2.2, 1.6, '#2a1a0a'); door(6, r.d / 2, 5, 8); for (let i = 0; i < 3; i++) E_(8 + i * 2.6, r.d / 2 + 1.2, 1.2, 0.8, '#d9a35a', INK, 0.2); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  siege(c) { const r = block(40, 18, PLANK, 'plank', 'gable', '#3a3634', 9); P_([[-3, r.d / 2], [12, r.d / 2], [12, r.d / 2 - 12], [-3, r.d / 2 - 12]], '#2a1a0a', INK, 0.4); wheel(4, r.d / 2 - 3, 3); L_(-16, r.d / 2, -10, -30, '#5a3a1c', 1); L_(-10, -30, 0, -26, '#5a3a1c', 0.8); L_(0, -26, 0, -20, '#9a8a6a', 0.4); banner(17, r.d / 2 - 18, c, 9); L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2); },
  amphi(c) {
    E_(0, 0, 25, 25 * TILT, '#c8bca2', INK, 0.6); g.save(); g.beginPath(); g.ellipse(0, 0, 25, 25 * TILT, 0, 0, Math.PI); g.lineTo(-25, -18); g.ellipse(0, -18, 25, 25 * TILT, 0, Math.PI, 0, true); g.closePath(); g.fillStyle = LG(-25, 0, 25, 0, ['#d8cdb4', '#b8ac92', '#9a8e76']); g.fill(); g.strokeStyle = INK; g.lineWidth = 0.6; g.stroke(); g.restore();
    E_(0, -18, 25, 25 * TILT, '#c8bca2', INK, 0.6); E_(0, -18, 15, 15 * TILT, '#c8a878', INK, 0.5);
    for (let a = 0.15; a < Math.PI; a += 0.26) { const x = Math.cos(a) * 25, y = Math.sin(a) * 25 * TILT; g.beginPath(); g.arc(x, y - 5, 1.6, Math.PI, 0); g.lineTo(x + 1.6, y - 1); g.lineTo(x - 1.6, y - 1); g.closePath(); g.fillStyle = '#4a3e2e'; g.fill(); g.beginPath(); g.arc(x, y - 13, 1.4, Math.PI, 0); g.lineTo(x + 1.4, y - 10); g.lineTo(x - 1.4, y - 10); g.closePath(); g.fill(); }
    banner(0, -18 - 25 * TILT, c, 8);
  },
  dock(c) { const d = 20 * TILT; P_([[-10, d / 2], [10, d / 2], [10, -d / 2], [-10, -d / 2]], LG(-10, 0, 10, 0, ['#a07c54', '#7a5a36']), INK, 0.5); for (let x = -8; x < 10; x += 4) L_(x, -d / 2, x, d / 2, 'rgba(40,24,10,.5)', 0.4); for (const [x, y] of [[-9, d / 2], [9, d / 2], [-9, -d / 2], [9, -d / 2]]) P_([[x - 1, y], [x + 1, y], [x + 1, y - 5], [x - 1, y - 5]], '#5a3a1c', INK, 0.3); banner(9, -d / 2 - 5, c, 6); },
  tower(c) { const d = 20 * TILT; sides(-8, 8, d / 2, 44, 16 * TILT, STONE); P_([[-8, d / 2], [8, d / 2], [8, d / 2 - 44], [-8, d / 2 - 44]], LG(-8, 0, 8, 0, [shade(STONE, 0.95), shade(STONE, 0.7)]), INK, 0.6); texture('stone', -8, d / 2 - 44, 8, d / 2, STONE); P_([[-9, d / 2 - 44], [9, d / 2 - 44], [9, d / 2 - 47], [-9, d / 2 - 47]], STONE, INK, 0.4); crenels(-9, 9, d / 2 - 47, STONE); win(0, d / 2 - 30, 1.2, 4, '#14100c'); win(0, d / 2 - 16, 1.2, 4, '#14100c'); banner(6, d / 2 - 47, c, 7); },
  wall(c) { const d = 10 * TILT; P_([[-5, d / 2], [5, d / 2], [5, d / 2 - 18], [-5, d / 2 - 18]], LG(-5, 0, 5, 0, [shade(STONE, 0.92), shade(STONE, 0.74)]), INK, 0.5); texture('stone', -5, d / 2 - 18, 5, d / 2, STONE); P_([[-5, d / 2 - 18], [5, d / 2 - 18], [5, -d / 2 - 18], [-5, -d / 2 - 18]], shade(STONE, 1.08), INK, 0.4); P_([[-5, d / 2 - 18], [-2, d / 2 - 18], [-2, d / 2 - 20.5], [-5, d / 2 - 20.5]], STONE, INK, 0.3); P_([[1, d / 2 - 18], [4, d / 2 - 18], [4, d / 2 - 20.5], [1, d / 2 - 20.5]], STONE, INK, 0.3); },
  gate(c) { const d = 10 * TILT; P_([[-5, d / 2], [5, d / 2], [5, d / 2 - 20], [-5, d / 2 - 20]], LG(-5, 0, 5, 0, ['#8a6a44', '#5a3a1c']), INK, 0.5); L_(-5, d / 2 - 6, 5, d / 2 - 6, '#2a1a0a', 0.7); L_(-5, d / 2 - 14, 5, d / 2 - 14, '#2a1a0a', 0.7); P_([[-2, d / 2 - 20], [2, d / 2 - 20], [2, d / 2 - 23], [-2, d / 2 - 23]], c); },
  farm(c, o, v) { field(30, '#6b5434', c, () => { const crop = { Spring: '#6f9a3a', Summer: '#86a83e', Autumn: '#cfa63e', Winter: '#8d8473' }[season().name]; const d = 30 * TILT; for (let i = 0; i < 6; i++) { const y = -d / 2 + 1 + i * (d - 2) / 6; P_([[-14, y + 0.6], [14, y + 0.6], [14, y + (d - 2) / 6 - 0.6], [-14, y + (d - 2) / 6 - 0.6]], crop); } }); },
  pasture(c, o, n) { field(30, '#86a050', c, () => { const d = 30 * TILT; for (let i = 0; i < (n || 0); i++) { const x = -11 + (i % 4) * 7 + ((i >> 2) % 2) * 2, y = -d / 2 + 3 + Math.floor(i / 4) * (d - 5) / 3; E_(x, y, 2.6, 1.7, '#ece5d3', '#8a8070', 0.3); E_(x + 2.2, y - 0.6, 0.9, 0.8, '#3a3430'); } }); for (let x = -15; x <= 15; x += 5) L_(x, 30 * TILT / 2, x, 30 * TILT / 2 - 3, '#7a5a34', 0.7); },
  weaver(c) { const r = block(30, 14, PLASTER, 'timber', 'gable', THATCH, 8); door(-6, r.d / 2, 5, 8); P_([[3, r.d / 2], [12, r.d / 2], [12, r.d / 2 - 8], [3, r.d / 2 - 8]], '#3a2614', INK, 0.4); for (let i = 0; i < 4; i++) L_(4 + i * 2.4, r.d / 2 - 7.6, 4 + i * 2.4, r.d / 2 - 0.6, ['#8fb0d8', '#c9a96a', '#b33a2e', '#ece5d3'][i], 0.8); E_(-12, r.d / 2 + 1.4, 2.4, 1.6, '#ece5d3', INK, 0.3); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  brewery(c) { const r = block(30, 16, '#c8a878', 'timber', 'gable', TILE, 8); door(0, r.d / 2, 5, 9); for (const x of [-11, -6.5, 8, 12.5]) { E_(x, r.d / 2 + 0.4, 2, 2.4, '#8a5d34', INK, 0.4); L_(x - 2, r.d / 2 + 0.4, x + 2, r.d / 2 + 0.4, '#3a2614', 0.4); } P_([[6 + r.k / 2, -21], [9 + r.k / 2, -21], [9 + r.k / 2, -28], [6 + r.k / 2, -28]], '#5a5550', INK, 0.4); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  bizc(c) { const r = block(40, 22, '#d8c8a2', 'stone', 'hip', TILE, 9); for (let x = -14; x <= 14; x += 7) column(x, r.d / 2, r.d / 2 - 16); door(0, r.d / 2, 6, 11); for (const [x, col] of [[-17, '#8a5d34'], [-13.5, '#c9a96a'], [15, '#8a5d34']]) P_([[x - 1.8, r.d / 2 + 3], [x + 1.8, r.d / 2 + 3], [x + 1.8, r.d / 2], [x - 1.8, r.d / 2]], col, INK, 0.3); banner(18, r.d / 2 - 22, c, 10); L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2); },
  council(c) { const r = block(30, 18, STONE, 'stone', 'hip', '#7a2e2a', 9); door(0, r.d / 2, 6, 10, '#4a2e16'); win(-9, r.d / 2 - 9, 2, 3.4); win(9, r.d / 2 - 9, 2, 3.4); for (const x of [-15, 15]) { L_(x - 3, r.d / 2 + 2, x + 3, r.d / 2 - 12, '#8a6a3a', 0.8); L_(x + 3, r.d / 2 + 2, x - 3, r.d / 2 - 12, '#8a6a3a', 0.8); } banner(-10, r.top + 2, c, 10); banner(10, r.top + 2, c, 10); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },
  tpost(c) { const d = 20 * TILT; block(20, 14, STONE, 'stone', 'flat'); P_([[-12, d / 2 - 12], [12, d / 2 - 12], [9, d / 2 - 18], [-9, d / 2 - 18]], '#b2563a', INK, 0.4); for (let i = 0; i < 5; i++) P_([[-11 + i * 4.6, d / 2 - 12], [-9 + i * 4.6, d / 2 - 12], [-9 + i * 4.6, d / 2 - 10.6], [-11 + i * 4.6, d / 2 - 10.6]], i % 2 ? '#f0e6d0' : c); door(0, d / 2, 5, 8); banner(8, d / 2 - 18, c, 10); },
  treefarm(c) { field(30, '#5a4a30', c, () => { const d = 30 * TILT; for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) smallTree(-11 + i * 7.3 + (j % 2) * 1.6, -d / 2 + 3 + j * (d - 4) / 2.4, 0.9); }); },
  throne(c, o) { g.save(); g.scale(1.25, 1.25); ART.castle(c, o); g.restore(); const d = 62 * TILT; P_([[-8, d / 2 - 52], [8, d / 2 - 52], [8, d / 2 - 66], [0, d / 2 - 74], [-8, d / 2 - 66]], LG(0, -74, 0, -52, ['#f2d880', '#b8902a']), INK, 0.6); E_(0, d / 2 - 60, 2.4, 2.4, '#8e1d14'); },   // the old citadel: a castle and a half, crowned in gold
  mint(c) { const r = block(30, 18, STONE, 'stone', 'hip', SLATE, 8); door(0, r.d / 2, 5, 9, '#2a1a0a'); for (const x of [-9, 9]) win(x, r.d / 2 - 8, 2, 3); for (let i = 0; i < 3; i++) E_(-10 + i * 4, r.d / 2 + 1.4, 1.5, 1.1, '#f2cf55', '#b8902a', 0.3); P_([[7 + r.k / 2, -22], [10 + r.k / 2, -22], [10 + r.k / 2, -29], [7 + r.k / 2, -29]], '#5a5550', INK, 0.4); E_(8.5 + r.k / 2, -30, 2.4, 1.4, 'rgba(255,140,40,.7)'); L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2); },   // a stone house with a furnace chimney and coins at the door
  wonder(c, o) { (WONDERART[G.P[o] && G.P[o].civ] || WONDERART.roman)(c); },
};
function field(w, soil, c, rows) { const d = w * TILT; P_([[-w / 2, d / 2], [w / 2, d / 2], [w / 2, -d / 2], [-w / 2, -d / 2]], soil, INK, 0.4); rows(); g.strokeStyle = '#7a5a34'; g.lineWidth = 0.6; g.strokeRect(-w / 2, -d / 2, w, d); for (let x = -w / 2; x <= w / 2; x += 5) L_(x, d / 2, x, d / 2 - 2.4, '#6b4a2c', 0.5); L_(-w / 2, d / 2 - 1.6, w / 2, d / 2 - 1.6, '#8a6a44', 0.5); L_(-w / 2, d / 2, w / 2, d / 2, c, 1); }
const WONDERART = {
  roman(c) { E_(0, 0, 30, 30 * TILT, '#c8bca2', INK, 0.6); for (let lv = 0; lv < 4; lv++) { const y0 = -lv * 10; g.save(); g.beginPath(); g.ellipse(0, y0, 30, 30 * TILT, 0, 0, Math.PI); g.lineTo(-30, y0 - 10); g.ellipse(0, y0 - 10, 30, 30 * TILT, 0, Math.PI, 0, true); g.closePath(); g.fillStyle = LG(-30, 0, 30, 0, ['#e6dcc2', '#c4b694', '#9a8e76']); g.fill(); g.strokeStyle = INK; g.lineWidth = 0.5; g.stroke(); g.restore(); if (lv < 3) for (let a = 0.12; a < Math.PI; a += 0.2) { const x = Math.cos(a) * 30, y = Math.sin(a) * 30 * TILT + y0; g.beginPath(); g.arc(x, y - 6, 1.5, Math.PI, 0); g.lineTo(x + 1.5, y - 2); g.lineTo(x - 1.5, y - 2); g.closePath(); g.fillStyle = '#4a3e2e'; g.fill(); } } E_(0, -40, 30, 30 * TILT, '#d8cdb4', INK, 0.5); E_(0, -40, 19, 19 * TILT, '#c8a878', INK, 0.5); banner(-24, -40, c, 8); banner(24, -40, c, 8); },
  han(c) { const d = 60 * TILT; sides(-30, 30, d / 2, 8, d, '#b8a47a'); P_([[-30, d / 2], [30, d / 2], [30, d / 2 - 8], [-30, d / 2 - 8]], '#9a8058', INK, 0.5); g.save(); g.translate(0, d / 2 - 8); for (let x = -18; x <= 18; x += 6) P_([[x - 1, 0], [x + 1, 0], [x + 1, -16], [x - 1, -16]], '#a8302a', INK, 0.3); P_([[-20, -16], [20, -16], [20, -18], [-20, -18]], '#3a2a20'); g.beginPath(); g.moveTo(-30, -15); g.quadraticCurveTo(-20, -20, -14, -32); g.lineTo(14, -32); g.quadraticCurveTo(20, -20, 30, -15); g.closePath(); g.fillStyle = LG(0, -32, 0, -15, ['#4a4a52', '#2f2f36']); g.fill(); g.strokeStyle = INK; g.lineWidth = 0.6; g.stroke(); g.beginPath(); g.moveTo(-20, -30); g.quadraticCurveTo(-12, -34, -8, -42); g.lineTo(8, -42); g.quadraticCurveTo(12, -34, 20, -30); g.closePath(); g.fill(); g.stroke(); L_(-9, -42, 9, -42, '#c9a227', 1); g.restore(); banner(-26, d / 2 - 8, c, 10); },
  persian(c) { const d = 60 * TILT; sides(-31, 31, d / 2, 6, d, '#bfae8a', false); P_([[-31, d / 2], [31, d / 2], [31, d / 2 - 6], [-31, d / 2 - 6]], '#bfae8a', INK, 0.5); for (let i = 0; i < 3; i++) P_([[-8 + i * 2, d / 2 + 0.2 - i * 2], [8 - i * 2, d / 2 + 0.2 - i * 2], [8 - i * 2, d / 2 - 2 - i * 2], [-8 + i * 2, d / 2 - 2 - i * 2]], '#d8c8a2', INK, 0.3); P_([[-28, d / 2 - 6], [28, d / 2 - 6], [28 + d * SIDE, -d / 2 - 6], [-28 + d * SIDE, -d / 2 - 6]], '#a89470', INK, 0.4); for (let row = 0; row < 3; row++) for (let x = -24; x <= 24; x += 8) { const yb = d / 2 - 6 - row * 6; column(x + (row % 2) * 4, yb, yb - 28, '#d8c8a2'); P_([[x + (row % 2) * 4 - 2.4, yb - 28], [x + (row % 2) * 4 + 2.4, yb - 28], [x + (row % 2) * 4 + 1.6, yb - 30.4], [x + (row % 2) * 4 - 1.6, yb - 30.4]], '#8a7a5a'); } P_([[-30, d / 2 - 46], [30, d / 2 - 46], [30, d / 2 - 49], [-30, d / 2 - 49]], '#7a6448', INK, 0.4); banner(26, d / 2 - 49, c, 10); },
  mongol(c) { const d = 60 * TILT; for (const [x, y] of [[-18, 6], [18, 4], [-6, -8], [10, -10]]) { E_(x, y, 9, 9 * TILT * 0.9, '#e8e0cc', INK, 0.5); P_([[x - 9, y], [x + 9, y], [x + 9, y - 7], [x - 9, y - 7]], LG(x - 9, 0, x + 9, 0, ['#f2ead8', '#c8bca2']), INK, 0.5); P_([[x - 9.4, y - 7], [x + 9.4, y - 7], [x, y - 13]], '#d8cdb4', INK, 0.5); L_(x - 9, y - 4, x + 9, y - 4, c, 0.8); door(x + 2, y, 3, 5, '#a8302a'); } L_(0, d / 2 - 2, 0, d / 2 - 30, '#c0c4c8', 1.2); for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4; L_(0, d / 2 - 22, Math.cos(a) * 9, d / 2 - 22 + Math.sin(a) * 9, '#d8dce0', 0.7); E_(Math.cos(a) * 9, d / 2 - 22 + Math.sin(a) * 9, 1.4, 1.4, '#e8ecf0', '#8a9098', 0.3); } E_(0, d / 2 - 32, 2.4, 2.4, '#e8ecf0', '#8a9098', 0.4); banner(-26, 8, c, 12); },
  maurya(c) { const d = 60 * TILT; P_([[-26, d / 2], [26, d / 2], [26, d / 2 - 6], [-26, d / 2 - 6]], '#c8b48a', INK, 0.5); g.beginPath(); g.moveTo(-22, d / 2 - 6); g.arc(0, d / 2 - 6, 22, Math.PI, 0); g.closePath(); g.fillStyle = LG(-22, -30, 22, 0, ['#efe4cc', '#c8b892', '#9a8a6a']); g.fill(); g.strokeStyle = INK; g.lineWidth = 0.6; g.stroke(); P_([[-4, d / 2 - 28], [4, d / 2 - 28], [4, d / 2 - 31], [-4, d / 2 - 31]], '#a89470', INK, 0.4); L_(0, d / 2 - 31, 0, d / 2 - 42, '#6b5a40', 0.8); for (let i = 0; i < 3; i++) E_(0, d / 2 - 35 - i * 3, 4 - i, 0.8, '#a89470', INK, 0.3); for (const x of [-27, 23]) { P_([[x, d / 2 + 2], [x + 1.6, d / 2 + 2], [x + 1.6, d / 2 - 16], [x, d / 2 - 16]], '#b8a47a', INK, 0.3); P_([[x + 2.4, d / 2 + 2], [x + 4, d / 2 + 2], [x + 4, d / 2 - 16], [x + 2.4, d / 2 - 16]], '#b8a47a', INK, 0.3); for (let k = 0; k < 3; k++) P_([[x - 1, d / 2 - 12 - k * 2.4], [x + 5, d / 2 - 12 - k * 2.4], [x + 5, d / 2 - 13.4 - k * 2.4], [x - 1, d / 2 - 13.4 - k * 2.4]], '#a8946a', INK, 0.3); } banner(16, d / 2 - 22, c, 8); },
  mali(c) { const d = 60 * TILT; sides(-28, 28, d / 2, 18, d, '#d4a470', false); P_([[-28, d / 2], [28, d / 2], [28, d / 2 - 18], [-28, d / 2 - 18]], LG(-28, 0, 28, 0, ['#d8a66c', '#c49060', '#9a6a40']), INK, 0.6); texture('mud', -28, d / 2 - 18, 28, d / 2, MUD); P_([[-28, d / 2 - 18], [28, d / 2 - 18], [28 + d * SIDE, -d / 2 - 18], [-28 + d * SIDE, -d / 2 - 18]], '#d4a470', INK, 0.4); for (let x = -26; x <= 26; x += 6.5) { P_([[x - 1.6, d / 2], [x + 1.6, d / 2], [x + 1.2, d / 2 - 22], [x - 1.2, d / 2 - 22]], '#c89460', INK, 0.3); L_(x - 2.4, d / 2 - 12, x + 2.4, d / 2 - 12, '#6b4a2c', 0.5); } P_([[8, -2], [20, -2], [17, -40], [11, -40]], LG(8, 0, 20, 0, ['#e0b078', '#a8784a']), INK, 0.6); for (let y = -8; y > -40; y -= 6) L_(9, y, 19, y, '#6b4a2c', 0.6); P_([[11, -40], [17, -40], [14, -46]], '#c89460', INK, 0.4); door(-10, d / 2, 6, 9, '#4a2e16'); banner(-24, d / 2 - 18, c, 9); },
};
// footprint box and how tall each kind may draw, for the cache canvas
const BLDTOP = { bizc: 46, castle: 66, town: 52, keep: 62, tower: 62, wonder: 72, library: 56, temple: 50, apartment: 46, aqueduct: 40, siege: 40, amphi: 48 };
const BSPR = new Map();
function bldSprite(b, s) {
  const o = b.owner, B = BLD[b.kind], col = G.P[o].color, w = B.fp * NAVC, var_ = b.kind === 'keep' ? (G.P[o].techs.has('castle') ? 1 : 0) + (G.P[o].age >= 4 ? 2 : 0) : b.kind === 'town' ? (G.P[o].age >= 4 ? 2 : 0) : b.kind === 'library' ? G.P[o].age >= 3 : b.kind === 'wonder' ? G.P[o].civ : b.kind === 'farm' ? season().name + (b.node ? b.node.type : '') : b.kind === 'pasture' ? (b.sheep || 0) : '';
  const up = upTier(b.kind, G.P[o]), key = b.kind + col + var_ + up + s; let c = BSPR.get(key); if (c) return c;
  const top = BLDTOP[b.kind] || 40, pad = 12, W = w + pad * 2 + 10 + 2 * w * TILT * SIDE, H = w * TILT / 2 + top + pad * 2;
  c = document.createElement('canvas'); c.width = Math.ceil(W * s); c.height = Math.ceil(H * s);
  g = c.getContext('2d'); g.scale(s, s); g.translate(W / 2, top + pad); g.lineJoin = 'round'; g.lineCap = 'round';
  UP = up; try { (ART[b.kind] || ART.house)(col, o, var_); } catch (e) { fault(e); } UP = 0;
  c.ax = W / 2 * s; c.ay = (top + pad) * s; g = null;
  trim(BSPR, 300);
  BSPR.set(key, c); return c;
}
// trees, bushes, rocks: a few variants each, cached the same way
const NSPR = new Map();
function nodeSprite(n, s) {
  const sn = season().name, v = n.kind === 'tree' ? n.id % 4 : 0, key = n.kind + v + (n.kind === 'tree' ? sn : '') + s; let c = NSPR.get(key); if (c) return c;
  const W = 30, H = 34; c = document.createElement('canvas'); c.width = Math.ceil(W * s); c.height = Math.ceil(H * s);
  g = c.getContext('2d'); g.scale(s, s); g.translate(W / 2, H - 4); g.lineJoin = 'round';
  if (n.kind === 'tree') {
    const TC = ['#244a22', '#2b5427', '#1f4320', '#33592a'][v], col = sn === 'Autumn' && v === 0 ? '#9a6224' : sn === 'Autumn' && v === 2 ? '#7a6a24' : TC;
    E_(3, 0.6, 9, 3, 'rgba(0,0,0,.25)');
    P_([[-1.4, 0], [1.4, 0], [1, -9], [-1, -9]], '#5b4128', INK, 0.3);
    if (v === 3) { for (let i = 0; i < 3; i++) P_([[-8 + i * 1.6, -6 - i * 6], [8 - i * 1.6, -6 - i * 6], [0, -16 - i * 6]], LG(-8, 0, 8, 0, [shade(col, 1.3), col, shade(col, 0.7)]), INK, 0.4); }
    else { E_(0, -15, 9, 8.6, LG(-9, -24, 9, -6, [shade(col, 1.35), col, shade(col, 0.7)]), INK, 0.4); E_(-3, -18, 5, 4.4, shade(col, 1.3)); E_(3.6, -12.6, 4, 3.4, shade(col, 0.85)); }
    if (sn === 'Winter') { E_(-2, -21, 5, 1.6, '#e8eef0'); E_(3, -17, 3, 1.1, '#e8eef0'); }
  } else if (n.kind === 'bush') {
    E_(0, -4, 8, 5.6, LG(-8, -10, 8, 0, ['#4a7a3a', '#2f5427']), INK, 0.4); g.fillStyle = RESOURCES.food.col; for (const [a, b] of [[-3, -6], [3, -4], [0, -2], [-4, -2], [4, -7]]) E_(a, b, 1.5, 1.5, RESOURCES.food.col);
  } else {
    const gold = n.kind === 'gold', iron = n.kind === 'iron', base = gold ? '#9a7a2a' : iron ? '#5a4a42' : '#7c8489', top = gold ? '#f2cf55' : iron ? '#8fa3b5' : '#b4bbc0';
    E_(2, 0.6, 11, 3.4, 'rgba(0,0,0,.25)');
    P_([[-10, 0], [-7, -8], [-1, -11], [6, -9], [10, -2], [6, 1]], LG(0, -11, 0, 1, [shade(base, 1.2), base, shade(base, 0.7)]), INK, 0.5);
    P_([[-7, -8], [-1, -11], [6, -9], [2, -4], [-5, -4]], top, INK, 0.3);
    if (gold) { E_(-1, -7, 0.9, 0.9, '#fff6c8'); E_(3, -5, 0.7, 0.7, '#fff6c8'); }
  }
  c.ax = W / 2 * s; c.ay = (H - 4) * s; g = null;
  trim(NSPR, 200);
  NSPR.set(key, c); return c;
}

