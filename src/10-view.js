// ═════ 10-view.js ═════
// ───────────────────────── The view: a tilted table, seen from the south ─────────────────────────
const cv = $('cv'), ctx = cv.getContext('2d'), mini = $('mini'), mctx = mini.getContext('2d');
const cam = { x: 400, y: 1600, z: 0.9 };
const FIG = 0.55;   // figures are drawn at 0.55 world units per figure unit: a person stands about 12 tall
let cw = 0, ch = 0, dpr = 1, bg = null, bgK = 0.5, terrainMini = null, grassPat = null;
const grassM = new DOMMatrix();
// the ground remembers: where people fell, where buildings burned, where villagers walk a lot. A layer over the ground, cleared with each new game.
let scarCv = null, scarX = null; const TRODE = new Uint16Array((MAP / 20) ** 2);
function resetScars() { scarCv = document.createElement('canvas'); scarCv.width = scarCv.height = MAP * bgK; scarX = scarCv.getContext('2d'); scarX.scale(bgK, bgK); TRODE.fill(0); }
function scarFall(u) {
  const x = u.x, big = (LOOKBOX[UNIT[u.kind].look] || [26])[0] > 30;
  scarX.fillStyle = 'rgba(40,18,12,.22)'; scarX.beginPath(); scarX.ellipse(x, u.y, 4 + (big ? 3 : 0), 2.2, 0, 0, 7); scarX.fill();
  if (isSoldier(u)) { scarX.strokeStyle = 'rgba(60,45,30,.5)'; scarX.lineWidth = 0.7; scarX.beginPath(); scarX.moveTo(x - 4, u.y + 1); scarX.lineTo(x + 3, u.y - 1.5); scarX.stroke(); }
}
function scarBurn(b) {
  const h = halfOf(b); scarX.fillStyle = 'rgba(25,20,18,.38)'; scarX.beginPath(); scarX.ellipse(b.x, b.y, h * 1.05, h * 0.8, 0, 0, 7); scarX.fill();
  scarX.fillStyle = 'rgba(95,90,84,.55)'; for (let i = 0; i < 5; i++) { const a = i * 1.3 + b.id, r = h * 0.6 * ((i * 0.37) % 1 + 0.2); scarX.fillRect(b.x + Math.cos(a) * r - 1.5, b.y + Math.sin(a) * r * 0.7 - 1, 3, 2); }
}
function tread(u) {   // a villager's step: after enough of them on one patch the earth shows it
  const c = ((u.y / 20) | 0) * (MAP / 20) + ((u.x / 20) | 0);
  if (++TRODE[c] % 260 === 0 && TRODE[c] < 5000) { scarX.fillStyle = 'rgba(120,92,58,.07)'; scarX.beginPath(); scarX.ellipse(u.x, u.y, 5.5, 3, 0, 0, 7); scarX.fill(); }
}
function fit() { const r = cv.getBoundingClientRect(); dpr = LOW.n >= 2 ? 1 : Math.min(2, window.devicePixelRatio || 1); cw = r.width; ch = r.height; const W = Math.round(cw * dpr), H = Math.round(ch * dpr); if (cv.width !== W) cv.width = W; if (cv.height !== H) cv.height = H; cam.z = clamp(cam.z, minZ(), ZOOM_MAX); clampCam(); }
function clampCam() { const hw = cw / 2 / cam.z, hh = ch / 2 / (cam.z * TILT); cam.x = clamp(cam.x, Math.min(hw, MID), Math.max(MAP - hw, MID)); cam.y = clamp(cam.y, Math.min(hh - 50, MID), Math.max(MAP - hh + 30, MID)); }
const SX = x => (x - cam.x) * cam.z + cw / 2;
const SY = (y, h) => (y - cam.y) * cam.z * TILT + ch / 2 - (h || 0) * cam.z;
const toWorld = (sx, sy) => ({ x: (sx - cw / 2) / cam.z + cam.x, y: (sy - ch / 2) / (cam.z * TILT) + cam.y });
const minZ = () => Math.min(cw / MAP, ch / (MAP * TILT)) || 0.2;
function zoomAt(nz, sx, sy) { const w = toWorld(sx, sy); cam.z = clamp(nz, minZ(), ZOOM_MAX); cam.x = w.x - (sx - cw / 2) / cam.z; cam.y = w.y - (sy - ch / 2) / (cam.z * TILT); clampCam(); }
const quant = v => { for (const s of SCALES) if (s >= v) return s; return SCALES[SCALES.length - 1]; };
// the ground: one soft picture at half detail for the big shapes, a sharp grass texture over it when you are close
function makeBg() {
  const N = MAP * bgK; bg = document.createElement('canvas'); bg.width = bg.height = N; const b = bg.getContext('2d'); b.scale(bgK, bgK);
  const R = (a, z) => a + Math.random() * (z - a);
  b.fillStyle = '#4a6634'; b.fillRect(0, 0, MAP, MAP);
  const blot = (n, cols, r0, r1) => { for (let i = 0; i < n; i++) { b.fillStyle = cols[i % cols.length]; b.beginPath(); b.ellipse(Math.random() * MAP, Math.random() * MAP, R(r0, r1), R(r0, r1) * 0.7, R(0, 3), 0, 7); b.fill(); } };
  blot(1400, ['rgba(88,124,56,.22)', 'rgba(52,78,38,.22)', 'rgba(104,128,60,.16)'], 20, 90);
  blot(220, ['rgba(122,100,62,.16)', 'rgba(140,118,76,.12)'], 10, 34);
  for (let i = 0; i < 500; i++) { b.fillStyle = Math.random() < 0.5 ? 'rgba(230,220,120,.5)' : 'rgba(235,235,245,.45)'; b.beginPath(); b.arc(Math.random() * MAP, Math.random() * MAP, 2.4, 0, 7); b.fill(); }
  for (const L of G.lakes) {
    const sand = b.createRadialGradient(L.x, L.y, L.r - 4, L.x, L.y, L.r + 26);
    sand.addColorStop(0, 'rgba(206,190,138,1)'); sand.addColorStop(0.5, 'rgba(196,180,128,.85)'); sand.addColorStop(1, 'rgba(196,180,128,0)');
    b.fillStyle = sand; b.beginPath(); b.arc(L.x, L.y, L.r + 26, 0, 7); b.fill();
    const lg = b.createRadialGradient(L.x - L.r * 0.2, L.y - L.r * 0.2, 10, L.x, L.y, L.r + 2);
    lg.addColorStop(0, '#1b4466'); lg.addColorStop(0.7, '#2a6488'); lg.addColorStop(0.95, '#4e93ad'); lg.addColorStop(1, '#79b2bf');
    b.fillStyle = lg; b.beginPath(); b.arc(L.x, L.y, L.r + 2, 0, 7); b.fill();
  }
  terrainMini = document.createElement('canvas'); terrainMini.width = terrainMini.height = 172; terrainMini.getContext('2d').drawImage(bg, 0, 0, 172, 172);
  // a 64-unit square of grass blades, repeated
  const t = document.createElement('canvas'); t.width = t.height = 128; const q = t.getContext('2d'); q.lineCap = 'round';
  for (let i = 0; i < 260; i++) { const x = Math.random() * 128, y = Math.random() * 128; q.strokeStyle = Math.random() < 0.5 ? 'rgba(28,48,22,.42)' : 'rgba(140,170,90,.32)'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(x, y); q.lineTo(x + R(-2, 2), y - R(3, 7)); q.stroke(); }
  grassPat = ctx.createPattern(t, 'repeat');
}
let SPARKS = [], miniT = 0;
function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#0b0f0d'; ctx.fillRect(0, 0, cw, ch);
  const z = cam.z, x0 = SX(0), y0 = SY(0), sn = season();
  ctx.imageSmoothingEnabled = true;
  const layer = img => { const a = toWorld(0, 0), b2 = toWorld(cw, ch), sx0 = clamp(a.x, 0, MAP), sy0 = clamp(a.y, 0, MAP), sx1 = clamp(b2.x, 0, MAP), sy1 = clamp(b2.y, 0, MAP);
    if (sx1 > sx0 && sy1 > sy0) ctx.drawImage(img, sx0 * bgK, sy0 * bgK, (sx1 - sx0) * bgK, (sy1 - sy0) * bgK, SX(sx0), SY(sy0), (sx1 - sx0) * z, (sy1 - sy0) * z * TILT); };
  layer(bg);
  if (z > 1.1 && grassPat) { if (grassM.a !== z * 0.5 || grassM.e !== x0 || grassM.f !== y0) { grassM.a = z * 0.5; grassM.d = z * 0.5 * TILT; grassM.e = x0; grassM.f = y0; grassPat.setTransform(grassM); } ctx.globalAlpha = Math.min(1, (z - 1.1) * 1.5); ctx.fillStyle = grassPat; ctx.fillRect(Math.max(0, x0), Math.max(0, y0), Math.min(cw, MAP * z), Math.min(ch, MAP * z * TILT)); ctx.globalAlpha = 1; }
  layer(scarCv);
  if (!lessMotion) { ctx.strokeStyle = 'rgba(220,240,255,.28)'; ctx.lineWidth = 1.2; for (const L of G.lakes) { if (Math.abs(L.x - cam.x) > cw / cam.z / 2 + L.r || Math.abs(L.y - cam.y) > ch / cam.z / TILT / 2 + L.r) continue; for (let i = 0; i < 18; i++) { const a = i * 2.4 + G.t * 0.05, r = L.r * (0.25 + 0.6 * ((i * 0.37 + G.t * 0.02) % 1)); const lx = SX(L.x + Math.cos(a) * r), ly = SY(L.y + Math.sin(a) * r); ctx.beginPath(); ctx.moveTo(lx - 6 * z, ly); ctx.quadraticCurveTo(lx, ly - 2 * z, lx + 6 * z, ly); ctx.stroke(); } } }
  if (sn.tint) { ctx.fillStyle = sn.tint; ctx.fillRect(x0, y0, MAP * z, MAP * z * TILT); }
  if (G.wx === 'rain' && z > 1.2 && !lessMotion) {   // rain rings sit on the ground, fixed to the world, under buildings and people
    const t = performance.now() / 1000, C = 120, a0 = toWorld(0, 0), b0 = toWorld(cw, ch); ctx.strokeStyle = 'rgba(215,230,245,.30)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let gy = Math.floor(a0.y / C); gy <= Math.floor(b0.y / C); gy++) for (let gx = Math.floor(a0.x / C); gx <= Math.floor(b0.x / C); gx++) {
      const h = ((gx * 73856093) ^ (gy * 19349663)) >>> 0; if (h % 3) continue;
      const ph = (t * 1.6 + ((h >> 8) & 255) / 256) % 1, r = Math.min(10, (1 + ph * 4) * z), px = SX((gx + (h & 255) / 256) * C), py = SY((gy + ((h >> 16) & 255) / 256) * C);
      ctx.moveTo(px + r, py); ctx.ellipse(px, py, r, r * TILT, 0, 0, 7);
    }
    ctx.stroke();
  }
  // everything standing, back to front
  // what is on screen: margins in world units, wide enough for the widest building (its turned east wall) and the tallest (a wonder, standing just below the edge)
  const a0 = toWorld(0, 0), b0 = toWorld(cw, ch), mx = Math.max(80 / z, 44), wv = { x: a0.x - mx, y: a0.y - Math.max(120 / (z * TILT), 34) }, wv2 = { x: b0.x + mx, y: b0.y + Math.max(160 / (z * TILT), 115) }, inView = e => e.x > wv.x && e.x < wv2.x && e.y > wv.y && e.y < wv2.y;
  const list = [];
  for (const b of G.blds) if (inView(b)) list.push([BLD[b.kind].crop ? b.y - 60 : b.y + halfOf(b) * 0.4, 1, b]);
  const far = z < 0.55; if (far) layer(forestLayer());   // zoomed out, the forest is one picture; close in, each tree
  for (const f of G.finds) if (inView(f) && !(f.done && FINDS[f.kind].got)) list.push([f.y, 3, f]);
  for (const u of G.units) if (!u.inside && inView(u) && visibleTo0(u)) list.push([u.y, 2, u]);
  list.sort((a, b) => a[0] - b[0]);
  const N = viewNodes(wv, wv2, far), sB = quant(z * dpr), sU = quant(z * dpr * FIG);
  // the standing nodes (about 2,000 trees, bushes and rocks) are kept sorted until the view moves a step; the few moving things are merged in
  for (let i = 0, j = 0; i < N.length || j < list.length;) {
    const take = j >= list.length || (i < N.length && N[i].y < list[j][0]), e = take ? N[i++] : list[j][2], t = take ? 0 : list[j++][1];
    try { t === 0 ? drawNode(e, sB) : t === 1 ? drawBld(e, sB) : t === 2 ? drawUnit(e, sU) : drawFind(e); } catch (er) { fault(er); }   // one bad piece must never take the rest of the picture with it
  }
  sparkDraw(); ripDraw();
  if (G.rally0) flagAt(SX(G.rally0.x), SY(G.rally0.y), G.P[0].color, z);
  ctx.strokeStyle = 'rgba(255,238,200,.85)'; ctx.lineWidth = 1.2;
  for (const t of G.tracers) {   // a short streak along the curve: the head and a point just behind it
    const p = 1 - t.life / t.dur, q = Math.max(0, p - 0.12), at = f => [SX(t.x1 + (t.x2 - t.x1) * f), SY(t.y1 + (t.y2 - t.y1) * f, t.h1 + (6 - t.h1) * f + 4 * t.arc * f * (1 - f))];
    const [ax, ay] = at(q), [bx, by] = at(p); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  // the light: warm at dusk and dawn, blue at night, darker toward the edges
  const nt = G.night, dusk = 4 * nt * (1 - nt);
  if (dusk > 0.02) { ctx.fillStyle = `rgba(255,140,60,${0.13 * dusk})`; ctx.fillRect(0, 0, cw, ch); }
  if (nt > 0) { ctx.fillStyle = `rgba(10,18,48,${0.4 * nt})`; ctx.fillRect(0, 0, cw, ch); if (nt > 0.5) for (const b of G.blds) if (inView(b) && b.prog >= 1 && (b.kind === 'house' || b.kind === 'apartment' || b.kind === 'keep')) { ctx.fillStyle = 'rgba(255,200,110,.75)'; ctx.fillRect(SX(b.x) + 3 * z, SY(b.y + halfOf(b) * 0.9, 6), 2 * z, 2 * z); } }
  if (G.hitT !== undefined && G.t - G.hitT < 1.6) {   // something of yours was hit: a red glow round the edge, fading over a second and a half
    const wild = !!G.hitWild, H = wild ? 1 : 0;   // red for a rival, orange for bandits and animals
    if (!hg[H] || hg[H].w !== cw || hg[H].h !== ch) { const q = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.3, cw / 2, ch / 2, Math.max(cw, ch) * 0.72), c = wild ? '240,150,30' : '210,40,30'; q.addColorStop(0, `rgba(${c},0)`); q.addColorStop(1, `rgba(${c},.55)`); q.w = cw; q.h = ch; hg[H] = q; }
    ctx.globalAlpha = 1 - (G.t - G.hitT) / 1.6; ctx.fillStyle = hg[H]; ctx.fillRect(0, 0, cw, ch); ctx.globalAlpha = 1;
  }
  if (G.whiteT !== undefined && G.t - G.whiteT < 0.9) { ctx.globalAlpha = 0.55 * (1 - (G.t - G.whiteT) / 0.9); ctx.fillStyle = '#fff6dc'; ctx.fillRect(0, 0, cw, ch); ctx.globalAlpha = 1; }   // a new age, a wonder, a victory
  drawWeather();
  drawRadar(wv, wv2);
  { const seen = new Set(); ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(192,138,88,.6)'; ctx.lineWidth = 1.5;   // boxes of trees being cut
    for (const u of G.units) if (u.owner === 0 && u.patch && !seen.has(u.patch.x0)) { seen.add(u.patch.x0); const r = u.patch; ctx.strokeRect(SX(r.x0), SY(r.y0), (r.x1 - r.x0) * z, (r.y1 - r.y0) * z * TILT); }
    if (G.hold && performance.now() - G.hold.t > 90) { const f = Math.min(1, (performance.now() - G.hold.t) / HOLD_MS); ctx.strokeStyle = 'rgba(255,211,94,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(G.hold.x, G.hold.y, 26, -Math.PI / 2, -Math.PI / 2 + f * 6.2832); ctx.stroke(); }   // the ring fills: let go and it is a tap, hold and drag and it is a box
    if (G.box) { const b = G.box; ctx.fillStyle = 'rgba(255,211,94,.12)'; ctx.fillRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0)); ctx.strokeStyle = '#ffd35e'; ctx.lineWidth = 2; ctx.strokeRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0)); }
    ctx.setLineDash([]); }
  drawGhost();
  { const now = performance.now(); if (SET.mini && now - miniT > 150) { miniT = now; drawMini(); } }   // the map corner needs no more than seven looks a second
}
// Enemy soldiers close to your Town Center but off screen: a red marker on the edge, pointing at them. Tap it to look.
let RADAR = null;
function drawRadar(wv, wv2) {
  RADAR = null; const k = keepOf(0); if (!k || G.over) return;
  let near = null, nd = Infinity;   // the nearest foe within 520 of your Town Center, or any army marching on you, however far
  for (const u of G.sol || []) { if (u.owner === 0 || u.owner === WILD || u.hp <= 0 || u.inside || !atWar(0, u.owner)) continue; const d = dist(u, k); if ((d < 520 || (u.state === 'attack' && u.target === 0)) && d < nd && !(u.x > wv.x + 40 && u.x < wv2.x - 40 && u.y > wv.y + 40 && u.y < wv2.y - 40)) { nd = d; near = u; } }
  if (!near) return;
  let n = 0; for (const u of G.sol || []) if (u.owner === near.owner && u.hp > 0 && dist(u, near) < 150) n++;
  const px = SX(near.x), py = SY(near.y), dx = px - cw / 2, dy = py - ch / 2, m = 30, sc = Math.min((dx < 0 ? cw / 2 - m : cw / 2 - 84) / (Math.abs(dx) || 1), (dy < 0 ? ch / 2 - m - (dx > 0 ? 80 : 0) : ch / 2 - m - 40) / (Math.abs(dy) || 1)), rx = cw / 2 + dx * sc, ry = ch / 2 + dy * sc, a = Math.atan2(dy, dx), pulse = lessMotion ? 0 : Math.sin(G.t * 6) * 2;
  RADAR = { sx: rx, sy: ry, x: near.x, y: near.y };
  ctx.save(); ctx.translate(rx, ry); ctx.fillStyle = 'rgba(190,40,30,.92)'; ctx.strokeStyle = '#ffd9d0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, 15 + pulse, 0, 7); ctx.fill(); ctx.stroke();
  ctx.rotate(a); ctx.fillStyle = '#ffd9d0'; ctx.beginPath(); ctx.moveTo(24 + pulse, 0); ctx.lineTo(16, -6); ctx.lineTo(16, 6); ctx.closePath(); ctx.fill(); ctx.rotate(-a);
  ctx.fillStyle = '#fff'; ctx.font = '700 13px ' + fontF(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 0, 0); ctx.restore(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
}
const hg = [];
// an enemy spy shows only when something of yours is close enough to see it
const visibleTo0 = u => u.kind !== 'spy' || friendly(0, u.owner) || u.exposed;
function stamp(c, sx, sy, k, flip) { if (flip) { ctx.save(); ctx.translate(sx, sy); ctx.scale(-1, 1); ctx.drawImage(c, -c.ax * k, -c.ay * k, c.width * k, c.height * k); ctx.restore(); } else ctx.drawImage(c, sx - c.ax * k, sy - c.ay * k, c.width * k, c.height * k); }
function drawBld(b, s) {
  const z = cam.z, sx = SX(b.x), sy = SY(b.y), B = BLD[b.kind], c = bldSprite(b, s), k = z / s;
  if (!B.crop) { ctx.fillStyle = 'rgba(0,0,0,.25)'; const w = B.fp * NAVC * z; ctx.beginPath(); ctx.ellipse(sx + w * 0.12, sy + w * TILT * 0.18, w * 0.62, w * TILT * 0.5, 0, 0, 7); ctx.fill(); }
  if (b.prog < 1) {
    // a building site: the outline staked out, the walls rising with the work
    const w = B.fp * NAVC * z, d = w * TILT; ctx.strokeStyle = '#d8c79c'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.strokeRect(sx - w / 2, sy - d / 2, w, d); ctx.setLineDash([]);
    const top = c.ay * k, show = (0.15 + 0.85 * b.prog);
    ctx.save(); ctx.beginPath(); ctx.rect(sx - c.ax * k, sy + d / 2 - (top + d / 2) * show - 2, c.width * k, (top + d / 2) * show + c.height * k); ctx.clip(); ctx.globalAlpha = 0.85; stamp(c, sx, sy, k); ctx.restore(); ctx.globalAlpha = 1;
    ctx.strokeStyle = '#b8955a'; ctx.lineWidth = Math.max(1, z * 0.8); for (const fx of [-0.45, 0.45]) { ctx.beginPath(); ctx.moveTo(sx + w * fx, sy + d / 2); ctx.lineTo(sx + w * fx, sy + d / 2 - (top + d / 2) * show); ctx.stroke(); }
    bar(sx, sy - c.ay * k - 4, Math.min(60 * z, w), b.prog, '#e6b947');
    if (b.owner === 0 && !G.units.some(u => u.rep === b && u.job === 'repair')) idleMark(sx, sy - c.ay * k - 8, z * 1.2);
    return;
  }
  const fa = G.t - (b.doneT ?? -99);
  stamp(c, sx, sy, k * popC(fa / 0.6));
  if (fa < 8 && !lessMotion) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.32 * (1 - fa / 8); stamp(c, sx, sy, k); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }   // fresh buildings glow, then cool
  if (b.node && b.node.farm === b && b.owner === 0) {   // who works a field: a dot a place, filled when someone is there
    const n = b.node, slots = slotsOf(n), w = B.fp * NAVC * z, y = sy + w * TILT / 2 + 6 * z, r = Math.max(3, 3.4 * z), gap = r * 2.8;
    ctx.lineWidth = 1.2; for (let i = 0; i < slots; i++) { const x = sx + (i - (slots - 1) / 2) * gap; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = i < (n.wk || 0) ? '#f2e3b0' : 'rgba(18,23,21,.55)'; ctx.fill(); ctx.strokeStyle = 'rgba(18,23,21,.9)'; ctx.stroke(); }
  }
  if (b.owner === 0 && G.rdy && G.rdy.has(b.kind) && !b.q.some(j => j.tech)) { const r = Math.max(4, 4.6 * z) + (lessMotion ? 0 : Math.sin(G.t * 4) * 0.6), x = sx - B.fp * NAVC * z * 0.3, y = sy - (B.h * 1.2 + 6) * z - r; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = '#4fb06a'; ctx.fill(); ctx.strokeStyle = '#dcf5e8'; ctx.lineWidth = 1.4; ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1.4, 1.5 * z * 0.7); ctx.beginPath(); ctx.moveTo(x - r * 0.45, y + r * 0.1); ctx.lineTo(x, y - r * 0.45); ctx.lineTo(x + r * 0.45, y + r * 0.1); ctx.stroke(); }   // an arrow in a green dot: something to research here
  if (b.kind === 'mill' && !lessMotion) { ctx.strokeStyle = '#efe6cf'; ctx.lineWidth = 1.6 * z; const cx = sx, cy = sy - 26 * z, a = G.t; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a + i * 1.571) * 13 * z, cy + Math.sin(a + i * 1.571) * 13 * z); } ctx.stroke(); }
  if (CHIMNEY[b.kind]) { const [dx, h] = CHIMNEY[b.kind]; smoke(sx + dx * z, sy - h * z, b.id, z); }
  blaze(b, sx, sy, z);
  if (b.owner === 0 && B.crop && b.node && !(b.node.wk > 0)) idleMark(sx, sy, z * 1.2);
  const M = maxHpB(b.owner, b.kind);
  if (b.hp < M - 1) bar(sx, sy - c.ay * k - 4, Math.min(60 * z, B.fp * NAVC * z), b.hp / M, G.P[b.owner].color);
  if (G.wonder && G.wonder.id === b.id) { ctx.font = '700 ' + Math.max(12, 12 * z) + 'px ' + fontF(); ctx.fillStyle = '#ffd35e'; ctx.textAlign = 'center'; ctx.fillText(clock(Math.max(0, G.wonder.end - G.t)), sx, sy - c.ay * k - 10); ctx.textAlign = 'left'; }
}
const CHIMNEY = { house: [6.2, 26], smith: [9, 28], keep: [-20, 44], bakery: [-6, 16] };
function smoke(x, y, seed, z) {
  if (lessMotion) return;
  for (let i = 0; i < 3; i++) { const ph = (G.t * 0.35 + i / 3 + seed * 0.37) % 1, r = (2 + ph * 5) * z; ctx.fillStyle = `rgba(215,215,210,${0.3 * (1 - ph)})`; ctx.beginPath(); ctx.arc(x + ph * 7 * z, y - ph * 24 * z, r, 0, 7); ctx.fill(); }
}
// fire when a building is badly hurt, dark smoke when sabotage has stalled it
function blaze(b, x, y, z) {
  if (lessMotion) return;
  const low = b.hp < maxHpB(b.owner, b.kind) * 0.5 || b.fire > 0, stalled = (b.stall || 0) > G.t, w = BLD[b.kind].fp * NAVC * z;
  if (!low && !stalled) return;
  const top = y - (BLD[b.kind].h * 0.7) * z;
  if (low) for (let i = 0; i < 3; i++) { const ph = (G.t * 2.2 + i * 0.33 + b.id * 0.17) % 1, fx = x + (i - 1) * w * 0.25, r = (3.5 - ph * 2) * z + 1; ctx.fillStyle = `rgba(${ph < 0.5 ? '250,150,40' : '230,70,30'},${0.9 - ph * 0.6})`; ctx.beginPath(); ctx.arc(fx, top - ph * 9 * z, r, 0, 7); ctx.fill(); }
  for (let i = 0; i < 3; i++) { const ph = (G.t * 0.4 + i / 3 + b.id * 0.29) % 1; ctx.fillStyle = `rgba(60,58,56,${0.45 * (1 - ph)})`; ctx.beginPath(); ctx.arc(x + ph * 6 * z, top - 6 * z - ph * 26 * z, (2 + ph * 5) * z, 0, 7); ctx.fill(); }
}
const RIPS = [];
function ripple(x, y, col) { RIPS.push({ x, y, col, t: performance.now() }); }
// ── theatrics: one pop curve, three sizes of celebration. 1 a building is finished, 2 an upgrade rolls through an army, 3 a new age, a wonder or a victory.
const popC = a => a >= 1 || a < 0 ? 1 : 1 + 0.16 * Math.sin(a * Math.PI) * (1 - a);   // swell and settle; a runs 0 to 1
function celebrate(size, x, y, hit) {
  if (G.t - (G.celT ?? -9) < 0.34 && size < 3) return; G.celT = G.t;   // calm: never two in the same blink
  ripple(x, y, size === 1 ? '#ffd35e' : '#fff3c4');
  if (size === 2 && hit) { const L = G.units.filter(hit).sort((a, b) => a.x - b.x), step = Math.min(0.06, 1.2 / Math.max(1, L.length)); L.forEach((u, i) => { u.glowT = G.t + i * step; }); }
  if (size === 3) { G.whiteT = G.t; feel('crack'); }
}
function ripDraw() {
  const now = performance.now(), z = cam.z;
  for (let i = RIPS.length - 1; i >= 0; i--) { const a = (now - RIPS[i].t) / 600; if (a >= 1) { RIPS.splice(i, 1); continue; }
    ctx.strokeStyle = RIPS[i].col; ctx.globalAlpha = 1 - a; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(SX(RIPS[i].x), SY(RIPS[i].y), (6 + a * 18) * z, (6 + a * 18) * z * TILT, 0, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
}
function sparkDraw() {
  if (!SPARKS.length) return;
  const z = cam.z; SPARKS = SPARKS.filter(k => { const a = G.t - k.t; return a >= 0 && a < 0.3; });
  for (const k of SPARKS) {
    const a = (G.t - k.t) / 0.3, x = SX(k.x), y = SY(k.y) - 6 * z;
    ctx.strokeStyle = `rgba(255,${200 - a * 80 | 0},90,${1 - a})`; ctx.lineWidth = 1.4; ctx.beginPath();
    for (let i = 0; i < 5; i++) { const an = i * 1.26 + k.t * 7; ctx.moveTo(x + Math.cos(an) * 2 * z, y + Math.sin(an) * 2 * z); ctx.lineTo(x + Math.cos(an) * (3 + a * 6) * z, y + Math.sin(an) * (3 + a * 6) * z); }
    ctx.stroke();
  }
}
const NV = { ref: null, len: 0, key: '', arr: [] };
function viewNodes(a, b, far) {   // the nodes on screen, sorted back to front; rebuilt only when the view moves 40 units or a node comes or goes
  const q = v => Math.floor(v / 40), key = `${q(a.x)},${q(a.y)},${q(b.x)},${q(b.y)},${far}`;
  if (NV.ref !== G.nodes || NV.len !== G.nodes.length || NV.key !== key) {
    const x0 = q(a.x) * 40, y0 = q(a.y) * 40, x1 = (q(b.x) + 1) * 40, y1 = (q(b.y) + 1) * 40;
    NV.arr = G.nodes.filter(n => n.kind !== 'farm' && !(far && n.kind === 'tree') && n.x > x0 && n.x < x1 && n.y > y0 && n.y < y1).sort((p, r) => p.y - r.y);
    NV.ref = G.nodes; NV.len = G.nodes.length; NV.key = key;
  }
  return NV.arr;
}
function drawNode(n, s) {
  const z = cam.z, sx = SX(n.x), sy = SY(n.y);
  if (n.kind === 'fish') { if (lessMotion) return; const ph = (G.t * 0.5 + n.id * 0.13) % 1; ctx.strokeStyle = `rgba(225,242,255,${0.6 * (1 - ph)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx, sy, (3 + ph * 6) * z, (1.5 + ph * 3) * z * TILT, 0, 0, 7); ctx.stroke(); return; }
  if (n.kind === 'meat') { ctx.fillStyle = '#8a3a2a'; ctx.beginPath(); ctx.ellipse(sx, sy, 5 * z, 2.6 * z, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#e8d8c0'; ctx.fillRect(sx - 1 * z, sy - 3 * z, 2 * z, 3 * z); return; }
  const f = (0.6 + 0.4 * Math.min(1, n.amt / n.max)) * (n.kind === 'tree' ? 1.4 : 1), c = nodeSprite(n, s), k = z / s * f;   // trees drawn as wide as the ground they block
  stamp(c, sx, sy, k);
}
const workOf = u => u.job === 'repair' ? 5 : !u.node ? 0 : u.node.kind === 'fish' ? 4 : u.node.kind === 'bush' || u.node.kind === 'meat' ? 1 : u.node.kind === 'stone' || u.node.kind === 'gold' ? 2 : u.node.kind === 'farm' ? (u.node.type === 'wood' ? 0 : 3) : 0;   // which work a villager is doing: chop, forage, mine, farm, fish, mend
function drawUnit(u, s) {
  const z = cam.z, sx = SX(u.x), sy = SY(u.y), U = UNIT[u.kind], col = G.P[u.owner].color, st = u.owner === WILD ? null : stats(u.owner, u.kind);
  const moving = G.t - (u.mvT || -9) < 0.15, working = u.work && G.t - u.work < 0.25;
  const fr = G.t - (u.hitT || -9) < 0.25 ? 3 : moving ? 1 + (((G.t * 6) | 0) + u.id) % 2 : working ? (U.look === 'vil' ? 10 + workOf(u) * 2 + (((G.t * 2.5) | 0) + u.id) % 2 : 1 + (((G.t * 6) | 0) + u.id) % 2) : 0;
  if (z < 0.3) { const big = (LOOKBOX[U.look] || [26])[0]; ctx.fillStyle = u.owner === WILD ? '#c9b48a' : col; const r = Math.max(1.8, big * 0.07 * z * FIG); ctx.fillRect(sx - r, sy - r * 1.6, r * 2, r * 2); return; }   // seen from far away a person is a dot of their colour
  const c = sprite(U.look, col, st ? st.tier : 0, fr, s, st && U.tick === 'sol' && !hasTag(u.kind, 'siege') ? st.kit : 0), k = z * FIG / s, big = (LOOKBOX[U.look] || [26])[0];
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(sx, sy, big * 0.28 * z * FIG + 2, 2.4 * z + 1, 0, 0, 7); ctx.fill();
  if (u.owner === 0 && G.sel !== 'all' && u.bn === G.sel) { ctx.strokeStyle = '#ffd35e'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(sx, sy, 7 * z + 2, 3.4 * z + 1, 0, 0, 7); ctx.stroke(); }
  if (u.owner !== WILD) { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(sx, sy, 3.4 * z + 1, 1.6 * z + 0.6, 0, 0, 7); ctx.fill(); }
  stamp(c, sx, sy, k * popC((G.t - (u.bornT ?? -9)) / 0.4), (u.fx || 1) < 0);
  { const ga = G.t - (u.glowT ?? -9); if (ga >= 0 && ga < 0.6) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.7 * Math.sin(ga / 0.6 * Math.PI); stamp(c, sx, sy, k, (u.fx || 1) < 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; } }   // an upgrade rolling through the army
  if (G.t - (u.flashT || -9) < 0.12) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.55; stamp(c, sx, sy, k, (u.fx || 1) < 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  const top = sy - (U.look === 'stower' ? 32 : U.look === 'treb' ? 26 : U.look === 'elephant' ? 22 : big > 34 ? 18 : 13) * z;
  if (u.carry > 0) { ctx.fillStyle = (RESOURCES[u.carryType] || GOODS[u.carryType] || RESOURCES.food).col; ctx.beginPath(); ctx.arc(sx - 3 * z * ((u.fx || 1) < 0 ? -1 : 1), sy - 7 * z, 2 * z + 0.5, 0, 7); ctx.fill(); }
  if (u.zeal > G.t) { ctx.strokeStyle = 'rgba(244,206,90,.85)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(sx, sy - 6 * z, 8 * z, 9 * z, 0, 0, 7); ctx.stroke(); }
  if (u.hp < u.max - 0.5 && z > 0.45) bar(sx, top - 5, Math.max(12, 12 * z), u.hp / u.max, u.owner === WILD ? '#c9b48a' : col);
  if (u.owner === 0 && u.idle) idleMark(sx, top, z);
  if (u.sick > G.t) { ctx.fillStyle = u.plague ? '#7a3a8a' : '#7aa04a'; ctx.beginPath(); ctx.arc(sx - 5 * z, top - 2, 2 * z + 1, 0, 7); ctx.fill(); }
  if (u.kind === 'caravan' && u.goods) { const k = Object.keys(u.goods).find(k => u.goods[k] > 0); if (k) { ctx.fillStyle = GOODS[k].col; ctx.fillRect(sx - 4 * z, sy - 12 * z, 5 * z, 3 * z); } }
}
function drawFind(f) {
  const z = cam.z, x = SX(f.x), y = SY(f.y), F = FINDS[f.kind];
  if (G.contract && G.contract.fid === f.id && !lessMotion) { ctx.strokeStyle = 'rgba(255,211,94,' + (0.5 + 0.4 * Math.sin(G.t * 4)) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 22 * z, 22 * z * TILT, 0, 0, 7); ctx.stroke(); }   // the Fortress's job
  ctx.save(); ctx.translate(x, y); ctx.scale(z, z); g = ctx; ctx.lineJoin = 'round';
  if (f.kind === 'chest') { E_(0, 1, 7, 2.4, 'rgba(0,0,0,.3)'); P_([[-5, 0], [5, 0], [5, -5], [-5, -5]], '#7a4e24', INK, 0.5); P_([[-5, -5], [5, -5], [4, -8], [-4, -8]], '#8a5a2a', INK, 0.5); L_(-5, -3, 5, -3, '#c9a227', 0.8); E_(0, -4.4, 1, 1, '#f2cf55'); }
  else if (f.kind === 'ruins') { for (const [dx, h] of [[-10, 14], [-4, 8], [3, 16], [9, 5]]) { P_([[dx - 1.6, 0], [dx + 1.6, 0], [dx + 1.6, -h], [dx - 1.6, -h]], LG(dx - 2, 0, dx + 2, 0, ['#e0d8c4', '#a89e88']), INK, 0.4); } P_([[-12, -14], [5, -16.5], [5, -18], [-12, -15.6]], '#d0c8b2', INK, 0.4); P_([[-6, 1], [2, 1], [1, -2], [-5, -2]], '#b8b0a0', INK, 0.4); }
  else if (f.kind === 'cemetery') { for (let i = 0; i < 6; i++) { const dx = -12 + (i % 3) * 10, dy = -3 + Math.floor(i / 3) * 6; P_([[dx - 1.8, dy], [dx + 1.8, dy], [dx + 1.8, dy - 4], [dx, dy - 5.4], [dx - 1.8, dy - 4]], '#9a9890', INK, 0.4); } L_(-16, 6, 16, 6, '#3a3028', 0.6); for (let x = -16; x <= 16; x += 4) L_(x, 6, x, 2, '#3a3028', 0.6); }
  else if (f.kind === 'camp') { for (const [dx, col] of [[-9, '#7a6a50'], [8, '#6a5a44']]) P_([[dx - 6, 0], [dx + 6, 0], [dx, -9]], col, INK, 0.5); E_(0, 2, 3, 1.2, '#3a2a1a'); if (!lessMotion) { const ph = (G.t * 3) % 1; E_(0, 0, 1.6, 2.4 + ph, 'rgba(250,150,40,.85)'); } L_(14, 2, 14, -14, '#3a2a1a', 0.6); P_([[14, -14], [20, -12.6], [14, -11]], '#2a2a2a'); }
  else if (f.kind === 'den') { P_([[-12, 1], [-9, -8], [0, -12], [10, -7], [13, 1]], LG(0, -12, 0, 1, ['#8a8478', '#5a5650']), INK, 0.5); E_(0, -2, 4.4, 4, '#1a1612'); }
  else if (f.kind === 'shrine') { const oc = f.owner !== null ? G.P[f.owner].color : '#d8cdb4'; P_([[-6, 1], [6, 1], [6, -1], [-6, -1]], '#b8ac92', INK, 0.4); P_([[-4, -1], [4, -1], [4, -9], [-4, -9]], '#e0d6bc', INK, 0.4); P_([[-5.4, -9], [5.4, -9], [0, -14]], oc, INK, 0.4); if (!lessMotion) E_(0, -4, 1.4, 2 + Math.sin(G.t * 6) * 0.4, 'rgba(255,190,70,.9)'); if (f.cap) { const t = f.cap.t / F.capture; ctx.strokeStyle = G.P[f.cap.o].color; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, -6, 10, -Math.PI / 2, -Math.PI / 2 + t * 6.28); ctx.stroke(); } }
  else if (f.kind === 'stop') { if (!postAt(f)) { L_(0, 2, 0, -14, '#5a3a1c', 1); P_([[0, -14], [9, -12.5], [0, -11]], f.owner !== null ? G.P[f.owner].color : '#d8c79c', INK, 0.4); P_([[-9, 2], [-3, 2], [-3, -3], [-9, -3]], '#8a5d34', INK, 0.4); E_(4, 1, 2.6, 1.6, GOODS[f.want].col, INK, 0.3); } }
  else if (f.kind === 'vagabonds') { if (!f.done) { E_(0, 2, 3, 1.2, '#3a2a1a'); if (!lessMotion) E_(0, 0, 1.4, 2.2, 'rgba(250,150,40,.85)'); P_([[-10, 3], [-4, 3], [-4, 1], [-10, 1]], '#6b4a3a'); P_([[5, 4], [11, 4], [11, 2], [5, 2]], '#4a5a6a'); } }
  ctx.restore(); g = null;
}
function bar(x, y, w, f, col) { ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(x - w / 2, y, w, 4); ctx.fillStyle = col; ctx.fillRect(x - w / 2, y, w * clamp(f, 0, 1), 4); }
function flagAt(x, y, col, z) { ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 16 * z); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y - 16 * z); ctx.lineTo(x + 10 * z, y - 13 * z); ctx.lineTo(x, y - 10 * z); ctx.closePath(); ctx.fill(); }
let FONTF = null; const fontF = () => FONTF || (FONTF = getComputedStyle(document.body).fontFamily);
function idleMark(x, y, z) { ctx.font = '700 ' + Math.max(11, 9 * z) + 'px ' + fontF(); ctx.fillStyle = '#ffd35e'; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 2.5; ctx.strokeText('z', x + 4 * z, y); ctx.fillText('z', x + 4 * z, y); }
function tag(text, x, y) { ctx.font = '600 13px ' + fontF(); const w = ctx.measureText(text).width + 10; x = clamp(x, 4, cw - w - 4); ctx.fillStyle = 'rgba(18,23,21,.92)'; ctx.fillRect(x, y - 13, w, 19); ctx.fillStyle = '#fff'; ctx.fillText(text, x + 5, y + 1); }
// the building you are placing: its footprint green where it fits and red where it does not, and the reason
function drawGhost() {
  const pl = G.place; if (!pl || !pl.at) return;
  const z = cam.z, kind = pl.kind, B = BLD[kind];
  if (kind === 'wall') {
    const cells = pl.cells || [toCell(pl.at)]; let bad = 0;
    for (const c of cells) { const ok = !canPlace(0, 'wall', c.gx * NAVC + 5, c.gy * NAVC + 5); if (!ok) bad++; ctx.fillStyle = ok ? 'rgba(120,220,120,.55)' : 'rgba(222,90,68,.65)'; ctx.fillRect(SX(c.gx * NAVC), SY(c.gy * NAVC), NAVC * z, NAVC * z * TILT); }
    const last = cells[cells.length - 1]; pl.why = bad === cells.length ? 'blocked' : null;
    tag(`${cells.length} × ${B.cost.s} stone${bad ? ' · ' + bad + ' blocked' : ''}`, SX(last.gx * NAVC) + 12, SY(last.gy * NAVC) - 14);
    return;
  }
  const sp = pl.at, n = B.fp * NAVC, why = canPlace(0, kind, sp.x, sp.y), ok = !why; pl.why = why;
  ctx.fillStyle = ok ? 'rgba(110,210,110,.35)' : 'rgba(222,90,68,.38)'; ctx.fillRect(SX(sp.x - n / 2), SY(sp.y - n / 2), n * z, n * z * TILT);
  ctx.strokeStyle = ok ? '#7ee07e' : '#de5a44'; ctx.lineWidth = 2; ctx.strokeRect(SX(sp.x - n / 2), SY(sp.y - n / 2), n * z, n * z * TILT);
  const s = quant(z * dpr), c = bldSprite({ kind, owner: 0 }, s); ctx.globalAlpha = 0.6; stamp(c, SX(sp.x), SY(sp.y), z / s); ctx.globalAlpha = 1;
  tag(why || `${B.name} · ${costText(B.cost)}`, SX(sp.x - n / 2), SY(sp.y - n / 2) - 8 - (BLD[kind].h + 10) * z);
}
function drawMini() {
  const m = mctx, k = 172 / MAP;
  m.clearRect(0, 0, 172, 172); m.drawImage(terrainMini, 0, 0); m.drawImage(forestLayer(), 0, 0, 172, 172);
  for (const f of G.finds) if (!f.done || FINDS[f.kind].capture) { m.fillStyle = f.owner !== null && FINDS[f.kind].capture ? G.P[f.owner].color : '#f2cf55'; m.fillRect(f.x * k - 1.5, f.y * k - 1.5, 3, 3); }
  for (const b of G.blds) { m.fillStyle = G.P[b.owner].color; const s = b.kind === 'keep' ? 7 : BLD[b.kind].wallish ? 2 : BLD[b.kind].fp >= 5 ? 6 : 4; m.fillRect(b.x * k - s / 2, b.y * k - s / 2, s, s); }
  for (const u of G.units) if (u.owner !== WILD ? visibleTo0(u) : !UNIT[u.kind].flee && !UNIT[u.kind].passive) { m.fillStyle = G.P[u.owner].color; m.fillRect(u.x * k - 1, u.y * k - 1, 2, 2); }
  const a = toWorld(0, 0), b = toWorld(cw, ch);
  m.strokeStyle = '#fff'; m.lineWidth = 1.5; m.strokeRect(a.x * k, a.y * k, (b.x - a.x) * k, (b.y - a.y) * k);
}


// ── Weather on the glass: rain, snow, lightning. Seen from above, so no sky: streaks and splashes, drifting flakes, a flash and a bolt.
function drawWeather() {
  const z = cam.z, t = performance.now() / 1000, wx = G.wx;
  if (wx === 'drought') { ctx.fillStyle = 'rgba(210,160,60,.10)'; ctx.fillRect(0, 0, cw, ch); }
  if (wx === 'rain') {
    ctx.fillStyle = 'rgba(20,30,50,.12)'; ctx.fillRect(0, 0, cw, ch);
    if (!lessMotion) {
      ctx.strokeStyle = 'rgba(205,220,240,.30)'; ctx.lineWidth = 1; ctx.beginPath();
      for (let i = 0; i < 70; i++) { const x = ((i * 97.3 + t * 60) % (cw + 60)) - 30, y = ((i * 53.7 + t * 520) % (ch + 60)) - 30; ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 14); }
      ctx.stroke();
    }
  }
  if (wx === 'frost') {
    ctx.fillStyle = 'rgba(230,240,250,.14)'; ctx.fillRect(0, 0, cw, ch);
    if (!lessMotion) { ctx.fillStyle = 'rgba(245,248,252,.85)'; for (let i = 0; i < 80; i++) { const y = ((i * 71.9 + t * 34) % (ch + 20)) - 10, x = (i * 113.7 + Math.sin(t * 0.8 + i) * 14) % cw; ctx.fillRect(x, y, 2 + (i % 3 === 0), 2 + (i % 3 === 0)); } }
  }
  if (G.bolts && G.bolts.length) {
    G.bolts = G.bolts.filter(b => G.t - b.t < 0.5);
    for (const b of G.bolts) {
      const age = G.t - b.t; if (age < 0.12) { ctx.fillStyle = `rgba(235,240,255,${0.45 * (1 - age / 0.12)})`; ctx.fillRect(0, 0, cw, ch); }
      if (age > 0.3) continue;
      let r = b.seed * 1e6 | 1; const rr = () => ((r = (r * 16807) % 2147483647) / 2147483647) - 0.5;   // the same jagged path every frame
      const x1 = SX(b.x), y1 = SY(b.y), x0 = x1 + rr() * 80, y0 = Math.min(0, y1 - 400), n = 10;
      ctx.strokeStyle = `rgba(250,252,255,${1 - age / 0.3})`; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x0, y0);
      let bx = 0, by = 0; for (let i = 1; i <= n; i++) { const f = i / n, x = x0 + (x1 - x0) * f + (i < n ? rr() * 28 : 0), y = y0 + (y1 - y0) * f; ctx.lineTo(x, y); if (i === 4) { bx = x; by = y; } }
      ctx.moveTo(bx, by); ctx.lineTo(bx + rr() * 60, by + (y1 - y0) * 0.18); ctx.stroke();
    }
  }
}

// the whole forest as one picture, for far views and the small map; redrawn when trees fall, at most once a second
let forestCv = null, forestV = -1, forestT = 0, forestG = null;
function forestLayer() {
  const now = performance.now();
  if (forestCv && forestG === G && (forestV === G.treeV || now - forestT < 1000)) return forestCv;
  if (!forestCv) { forestCv = document.createElement('canvas'); forestCv.width = forestCv.height = MAP * bgK; }
  const f = forestCv.getContext('2d'); f.setTransform(bgK, 0, 0, bgK, 0, 0); f.clearRect(0, 0, MAP, MAP);
  for (const [col, r] of [['#1c3a1c', 15], ['#2b5427', 11]]) { f.fillStyle = col; f.beginPath(); for (const n of G.nodes) if (n.kind === 'tree' && n.amt > 0) { f.moveTo(n.x + r, n.y); f.arc(n.x, n.y, r, 0, 7); } f.fill(); }
  forestV = G.treeV; forestT = now; forestG = G; return forestCv;
}
