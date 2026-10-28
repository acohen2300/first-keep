// ═════ 11-view.js ═════
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
function scarStrike(x, y) { if (scarX) { scarX.fillStyle = 'rgba(20,16,12,.35)'; scarX.beginPath(); scarX.ellipse(x, y, 6, 4, 0, 0, 7); scarX.fill(); } }   // where lightning struck
function scarBurn(b) {
  const h = halfOf(b); scarX.fillStyle = 'rgba(25,20,18,.38)'; scarX.beginPath(); scarX.ellipse(b.x, b.y, h * 1.05, h * 0.8, 0, 0, 7); scarX.fill();
  scarX.fillStyle = 'rgba(95,90,84,.55)'; for (let i = 0; i < 5; i++) { const a = i * 1.3 + b.id, r = h * 0.6 * ((i * 0.37) % 1 + 0.2); scarX.fillRect(b.x + Math.cos(a) * r - 1.5, b.y + Math.sin(a) * r * 0.7 - 1, 3, 2); }
}
function tread(u) {   // a villager's step: after enough of them on one patch the earth shows it
  const c = ((u.y / 20) | 0) * (MAP / 20) + ((u.x / 20) | 0);
  if (++TRODE[c] % 260 === 0 && TRODE[c] < 5000) { scarX.fillStyle = 'rgba(120,92,58,.07)'; scarX.beginPath(); scarX.ellipse(u.x, u.y, 5.5, 3, 0, 0, 7); scarX.fill(); }
}
// a small parchment tab with a book in red ink, and a count when more than one thing waits
function researchBadge(x, y, s, n) {
  const w = (n > 1 ? 31 : 23) * s, h = 17 * s, q = lessMotion ? 0 : Math.sin(G.t * 4) * 0.8 * s, bx = x - (n > 1 ? 6.5 : 0) * s, by = y + q;
  ctx.save(); ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x - w / 2, by - h / 2, w, h, h / 2); else ctx.rect(x - w / 2, by - h / 2, w, h);
  ctx.fillStyle = '#e6d6ad'; ctx.fill(); ctx.strokeStyle = '#8e1d14'; ctx.lineWidth = Math.max(1.2, 1.3 * s); ctx.stroke();
  ctx.fillStyle = '#8e1d14'; ctx.beginPath(); ctx.moveTo(bx - 6 * s, by - 4 * s); ctx.lineTo(bx, by - 2.4 * s); ctx.lineTo(bx + 6 * s, by - 4 * s); ctx.lineTo(bx + 6 * s, by + 4 * s); ctx.lineTo(bx, by + 5.6 * s); ctx.lineTo(bx - 6 * s, by + 4 * s); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#e6d6ad'; ctx.lineWidth = Math.max(1, s); ctx.beginPath(); ctx.moveTo(bx, by - 2.4 * s); ctx.lineTo(bx, by + 5.6 * s); ctx.stroke();
  if (n > 1) { ctx.fillStyle = '#2a1c10'; ctx.font = `700 ${Math.round(11 * s)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), x + 8 * s, by + 0.5 * s); }
  ctx.restore();
}
let vy = 0;   // the map is full screen; the view centres on the band between the top pills and the bottom ones
/* fit() is in 14-frame.js: it reads the page's bars */
function clampCam() { const hw = cw / 2 / cam.z, up = (ch / 2 + vy) / (cam.z * TILT), down = (ch / 2 - vy) / (cam.z * TILT); cam.x = clamp(cam.x, Math.min(hw, MID), Math.max(MAP - hw, MID)); cam.y = clamp(cam.y, Math.min(up - 50, MID), Math.max(MAP - down, MID)); }
const SX = x => (x - cam.x) * cam.z + cw / 2;
const SY = (y, h) => (y - cam.y) * cam.z * TILT + ch / 2 + vy - (h || 0) * cam.z;
const toWorld = (sx, sy) => ({ x: (sx - cw / 2) / cam.z + cam.x, y: (sy - ch / 2 - vy) / (cam.z * TILT) + cam.y });
const minZ = () => Math.min(cw / MAP, ch / (MAP * TILT)) || 0.2;
function zoomAt(nz, sx, sy) { const w = toWorld(sx, sy); cam.z = clamp(nz, minZ(), ZOOM_MAX); cam.x = w.x - (sx - cw / 2) / cam.z; cam.y = w.y - (sy - ch / 2 - vy) / (cam.z * TILT); clampCam(); }
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
  { const L = LAKE0, R = THRONE.isle, W = THRONE.cause;   // the Throne's island and its four causeways: stone over the water
    b.fillStyle = 'rgba(206,190,138,1)'; b.beginPath(); b.arc(L.x, L.y, R + 10, 0, 7); b.fill();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const len = L.r + 30; b.fillStyle = '#9a917e'; b.fillRect(L.x + (dx < 0 ? -len : dy ? -W / 2 - 4 : 0), L.y + (dy < 0 ? -len : dx ? -W / 2 - 4 : 0), dx ? len : W + 8, dy ? len : W + 8); }
    const pv = b.createRadialGradient(L.x, L.y, 20, L.x, L.y, R); pv.addColorStop(0, '#b8ad98'); pv.addColorStop(1, '#8f8775'); b.fillStyle = pv; b.beginPath(); b.arc(L.x, L.y, R, 0, 7); b.fill();
    b.strokeStyle = 'rgba(60,50,40,.25)'; b.lineWidth = 1; for (let i = -R; i <= R; i += 12) { b.beginPath(); b.moveTo(L.x - R, L.y + i); b.lineTo(L.x + R, L.y + i); b.stroke(); b.beginPath(); b.moveTo(L.x + i, L.y - R); b.lineTo(L.x + i, L.y + R); b.stroke(); }
  }
  // the old trade roads: a worn dirt track through each route's stops, bending round the great lake (drawn once, into the ground)
  b.lineCap = 'round'; b.lineJoin = 'round';
  for (const r of ROUTES) { const [a, c, d, e] = r.map(([x, y]) => ({ x, y })), vert = a.x === c.x, bend = 2 * (LAKE0.r + 70), m1 = vert ? { x: MID - bend, y: MID } : { x: MID, y: MID - bend };   // a quadratic's middle sits halfway to its control point: twice the clearance
    const path = () => { b.beginPath(); b.moveTo(a.x, a.y); b.lineTo(c.x, c.y); b.quadraticCurveTo(m1.x + (vert ? -40 : 0), m1.y + (vert ? 0 : -40), d.x, d.y); b.lineTo(e.x, e.y); };
    for (const [w, col] of [[14, 'rgba(120,96,58,.35)'], [8, 'rgba(150,124,78,.45)'], [3, 'rgba(96,74,44,.35)']]) { b.strokeStyle = col; b.lineWidth = w; b.setLineDash(w === 3 ? [10, 14] : []); path(); b.stroke(); } b.setLineDash([]);
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
  const z = cam.z, x0 = SX(0), y0 = SY(0), sn = season();
  { const a = toWorld(0, 0), b = toWorld(cw, ch); if (a.x < 0 || a.y < 0 || b.x > MAP || b.y > MAP) { ctx.fillStyle = '#0b0f0d'; ctx.fillRect(0, 0, cw, ch); } }   // beyond the map's edge: dark; the map itself is painted over in full
  ctx.imageSmoothingEnabled = true;
  const layer = img => { const a = toWorld(0, 0), b2 = toWorld(cw, ch), sx0 = clamp(a.x, 0, MAP), sy0 = clamp(a.y, 0, MAP), sx1 = clamp(b2.x, 0, MAP), sy1 = clamp(b2.y, 0, MAP);
    if (sx1 > sx0 && sy1 > sy0) ctx.drawImage(img, sx0 * bgK, sy0 * bgK, (sx1 - sx0) * bgK, (sy1 - sy0) * bgK, SX(sx0), SY(sy0), (sx1 - sx0) * z, (sy1 - sy0) * z * TILT); };
  layer(bg);
  if (z > 1.1 && grassPat) { if (grassM.a !== z * 0.5 || grassM.e !== x0 || grassM.f !== y0) { grassM.a = z * 0.5; grassM.d = z * 0.5 * TILT; grassM.e = x0; grassM.f = y0; grassPat.setTransform(grassM); } ctx.globalAlpha = Math.min(1, (z - 1.1) * 1.5); ctx.fillStyle = grassPat; ctx.fillRect(Math.max(0, x0), Math.max(0, y0), Math.min(cw, MAP * z), Math.min(ch, MAP * z * TILT)); ctx.globalAlpha = 1; }
  if (G.shake > G.t && !lessMotion) { const k = (G.shake - G.t) * 3; ctx.translate(rnd2() * k, rnd2() * k); }   // a tremor: the whole view judders for a moment
  layer(scarCv);
  if (G.flood > G.t) { ctx.fillStyle = 'rgba(42,100,136,.55)'; for (const L of G.lakes) { ctx.beginPath(); ctx.ellipse(SX(L.x), SY(L.y), (L.r + EVENTS.flood.rise) * z, (L.r + EVENTS.flood.rise) * z * TILT, 0, 0, 7); ctx.fill(); } }   // the flood: water over the shore
  if (G.sand && G.sand.until > G.t) { const s = G.sand; ctx.fillStyle = 'rgba(200,180,120,.7)'; ctx.beginPath(); ctx.ellipse(SX(s.x), SY(s.y), s.r * z, s.r * z * TILT, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(120,100,60,.5)'; ctx.lineWidth = 1; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(SX(s.x), SY(s.y), s.r * z * i / 4, s.r * z * TILT * i / 4, 0, 0, 7); ctx.stroke(); } }   // quicksand: a pale patch with ripples
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
  drawGround();   // the weather's mark on the land, under everything standing
  // everything standing, back to front
  // what is on screen: margins in world units, wide enough for the widest building (its turned east wall) and the tallest (a wonder, standing just below the edge)
  const a0 = toWorld(0, 0), b0 = toWorld(cw, ch), mx = Math.max(80 / z, 44), wv = { x: a0.x - mx, y: a0.y - Math.max(120 / (z * TILT), 34) }, wv2 = { x: b0.x + mx, y: b0.y + Math.max(160 / (z * TILT), 115) }, inView = e => e.x > wv.x && e.x < wv2.x && e.y > wv.y && e.y < wv2.y;
  const list = [];
  for (const b of G.blds) if (inView(b) && trapShown(b) && known0(b)) list.push([BLD[b.kind].crop ? b.y - 60 : b.y + halfOf(b) * 0.4, 1, b]);
  const far = z < 0.55; if (far) layer(forestLayer());   // zoomed out, the forest is one picture; close in, each tree
  for (const f of G.finds) if (inView(f) && !(f.done && FINDS[f.kind].got)) list.push([f.y, 3, f]);
  for (const u of G.units) if (!u.inside && inView(u) && visibleTo0(u)) list.push([u.y, 2, u]);
  list.sort((a, b) => a[0] - b[0]);
  const N = viewNodes(wv, wv2, far), sB = quant(z * dpr), sU = quant(z * dpr * FIG);
  // the standing nodes (about 2,000 trees, bushes and rocks) are kept sorted until the view moves a step; the few moving things are merged in
  for (let i = 0, j = 0; i < N.length || j < list.length;) {
    const take = j >= list.length || (i < N.length && N[i].y < list[j][0]), e = take ? N[i++] : list[j][2], t = take ? 0 : list[j++][1];
    try { t === 0 ? drawNode(e, sB) : t === 1 ? drawBld(e, sB) : t === 2 ? drawUnit(e, sU) : drawFind(e); } catch (er) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.setLineDash([]); fault(er); }   // one bad piece must never take the rest of the picture with it: the canvas is put back as it was
  }
  if (G.fire) for (const n of G.fire) if (inView(n)) { const x = SX(n.x), y = SY(n.y), ph = (G.t * 5 + n.id) % 1; ctx.fillStyle = 'rgba(250,150,40,.85)'; ctx.beginPath(); ctx.ellipse(x, y - 8 * z, (3 + ph * 2) * z, (6 + ph * 4) * z, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,230,120,.9)'; ctx.beginPath(); ctx.ellipse(x, y - 7 * z, 1.5 * z, 3 * z, 0, 0, 7); ctx.fill(); smoke(x, y - 14 * z, n.id, z); }   // the wildfire
  if (SET.fog) { if (fogT < 0) fogTick(); const a1 = toWorld(0, 0), b1 = toWorld(cw, ch), sx0 = clamp(a1.x, 0, MAP), sy0 = clamp(a1.y, 0, MAP), sx1 = clamp(b1.x, 0, MAP), sy1 = clamp(b1.y, 0, MAP); ctx.imageSmoothingEnabled = true; if (sx1 > sx0 && sy1 > sy0) ctx.drawImage(fogLayer(), sx0 / FOG, sy0 / FOG, (sx1 - sx0) / FOG, (sy1 - sy0) / FOG, SX(sx0), SY(sy0), (sx1 - sx0) * z, (sy1 - sy0) * z * TILT); }   // the fog, soft, over everything standing
  drawPicks(z); sparkDraw(); ripDraw(); drawEvents(z);
  if (G.ords) {   // your groups on the march: a dashed line from the group to where it is going, a ring where it will stand
    ctx.save(); ctx.strokeStyle = G.P[0].color; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7; ctx.setLineDash([6, 6]); ctx.lineDashOffset = -performance.now() / 60;
    for (const id in G.ords) { const O = G.ords[id]; if (O.arrived || O.cx === undefined) continue; const ax = SX(O.cx), ay = SY(O.cy), bx = SX(O.x), by = SY(O.y); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.beginPath(); ctx.ellipse(bx, by, 10 * cam.z, 10 * cam.z * TILT, 0, 0, 7); ctx.stroke(); }
    ctx.restore();
  }
  if (G.rally0) flagAt(SX(G.rally0.x), SY(G.rally0.y), G.P[0].color, z);
  ctx.strokeStyle = 'rgba(255,238,200,.85)'; ctx.lineWidth = 1.2;
  for (const t of G.tracers) {   // a short streak along the curve: the head and a point just behind it
    const p = 1 - t.life / t.dur, q = Math.max(0, p - 0.12), at = f => [SX(t.x1 + (t.x2 - t.x1) * f), SY(t.y1 + (t.y2 - t.y1) * f, t.h1 + (6 - t.h1) * f + 4 * t.arc * f * (1 - f))];
    const [ax, ay] = at(q), [bx, by] = at(p); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  // the light: warm at dusk and dawn, blue at night, darker toward the edges
  const nt = G.night, dusk = 4 * nt * (1 - nt);
  { const t = tintOf(dusk, nt); if (t) { ctx.fillStyle = t; ctx.fillRect(0, 0, cw, ch); } }   // dusk, night and the weather's cast, blended into one fill
  if (nt > 0) { if (nt > 0.5) for (const b of G.blds) if (inView(b) && b.prog >= 1 && (b.kind === 'house' || b.kind === 'apartment' || b.kind === 'keep')) { ctx.fillStyle = 'rgba(255,200,110,.75)'; ctx.fillRect(SX(b.x) + 3 * z, SY(b.y + halfOf(b) * 0.9, 6), 2 * z, 2 * z); } }
  if (G.hitT !== undefined && G.t - G.hitT < 1.6) {   // something of yours was hit: a red glow round the edge, fading over a second and a half
    const wild = !!G.hitWild, H = wild ? 1 : 0;   // red for a rival, orange for bandits and animals
    if (!hg[H] || hg[H].w !== cw || hg[H].h !== ch) { const q = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.3, cw / 2, ch / 2, Math.max(cw, ch) * 0.72), c = wild ? '240,150,30' : '210,40,30'; q.addColorStop(0, `rgba(${c},0)`); q.addColorStop(1, `rgba(${c},.55)`); q.w = cw; q.h = ch; hg[H] = q; }
    ctx.globalAlpha = 1 - (G.t - G.hitT) / 1.6; ctx.fillStyle = hg[H]; ctx.fillRect(0, 0, cw, ch); ctx.globalAlpha = 1;
  }
  if (G.whiteT !== undefined && G.t - G.whiteT < 0.9) { ctx.globalAlpha = 0.55 * (1 - (G.t - G.whiteT) / 0.9); ctx.fillStyle = '#fff6dc'; ctx.fillRect(0, 0, cw, ch); ctx.globalAlpha = 1; }   // a new age, a wonder, a victory
  drawSky(); drawWeather();
  drawRadar(wv, wv2);
  { const seen = new Set(); ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(192,138,88,.6)'; ctx.lineWidth = 1.5;   // boxes of trees being cut
    for (const u of G.units) if (u.owner === 0 && u.patch && !seen.has(u.patch.x0)) { seen.add(u.patch.x0); const r = u.patch; ctx.strokeRect(SX(r.x0), SY(r.y0), (r.x1 - r.x0) * z, (r.y1 - r.y0) * z * TILT); }
    if (G.press && performance.now() - G.press.t > 90) { const f = Math.min(1, (performance.now() - G.press.t) / HOLD_MS); ctx.strokeStyle = 'rgba(255,211,94,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(G.press.x, G.press.y, 26, -Math.PI / 2, -Math.PI / 2 + f * 6.2832); ctx.stroke(); }   // the ring fills: let go and it is a tap, hold and drag and it is a box
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
// Fog of war, yours alone (the computers play without it, as the doc says): what your people and towers see now is lit; what they saw stays, dim; the rest is dark.
const fogAt = (x, y) => G.fog[clamp((y / FOG) | 0, 0, FOGN - 1) * FOGN + clamp((x / FOG) | 0, 0, FOGN - 1)];
const seen0 = e => !SET.fog || friendly(0, e.owner) || fogAt(e.x, e.y) === 2;   // in your sight now, or yours
const known0 = e => !SET.fog || friendly(0, e.owner) || fogAt(e.x, e.y) > 0;    // ever seen: a building you found stays on the map
const visibleTo0 = u => (u.kind !== 'spy' || friendly(0, u.owner) || u.exposed) && seen0(u);
let fogCv = null, fogImg = null, fogT = -1;
function fogTick() {   // every ten ticks: what is lit now
  const F = G.fog; for (let i = 0; i < F.length; i++) if (F[i] === 2) F[i] = 1;
  const light = (x, y, r) => { const c = (r / FOG) + 0.5, cx = x / FOG, cy = y / FOG, x0 = clamp((cx - c) | 0, 0, FOGN - 1), x1 = clamp((cx + c) | 0, 0, FOGN - 1), y0 = clamp((cy - c) | 0, 0, FOGN - 1), y1 = clamp((cy + c) | 0, 0, FOGN - 1);
    for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) if (hyp(gx + 0.5 - cx, gy + 0.5 - cy) <= c) F[gy * FOGN + gx] = 2; };
  for (const u of G.units) if (u.hp > 0 && friendly(0, u.owner) && !u.inside) light(u.x, u.y, sightOf(u));
  for (const b of G.blds) if (b.hp > 0 && b.prog >= 1 && friendly(0, b.owner)) light(b.x, b.y, (BLD[b.kind].sight || 90));
  fogT = G.tick;
}
function fogLayer() {   // the fog as one small picture, drawn soft over the world
  if (!fogCv) { fogCv = document.createElement('canvas'); fogCv.width = fogCv.height = FOGN; fogImg = fogCv.getContext('2d').createImageData(FOGN, FOGN); }
  const d = fogImg.data, F = G.fog; for (let i = 0; i < F.length; i++) { d[i * 4] = 8; d[i * 4 + 1] = 12; d[i * 4 + 2] = 10; d[i * 4 + 3] = F[i] === 2 ? 0 : F[i] === 1 ? 110 : 235; }
  fogCv.getContext('2d').putImageData(fogImg, 0, 0); return fogCv;
}
function stamp(c, sx, sy, k, flip) { if (flip) { ctx.save(); ctx.translate(sx, sy); ctx.scale(-1, 1); ctx.drawImage(c, -c.ax * k, -c.ay * k, c.width * k, c.height * k); ctx.restore(); } else ctx.drawImage(c, sx - c.ax * k, sy - c.ay * k, c.width * k, c.height * k); }
const trapShown = b => !BLD[b.kind].trap || b.owner === 0 || friendly(0, b.owner) || (b.seen && b.seen[0]);   // a hidden trap shows only to its side, its allies, and a side whose scout found it
function drawBld(b, s) {
  if (BLD[b.kind].trap) { const z = cam.z, x = SX(b.x), y = SY(b.y), k = BLD[b.kind].trap, own = b.owner === 0 || friendly(0, b.owner); if (b.prog < 1) { ctx.strokeStyle = 'rgba(255,211,94,.7)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 6 * z, 3.6 * z, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]); return; }
    if (k === 'pit') { ctx.fillStyle = own ? 'rgba(60,50,30,.5)' : 'rgba(180,40,30,.55)'; ctx.beginPath(); ctx.ellipse(x, y, 6 * z, 3.6 * z, 0, 0, 7); ctx.fill(); }
    else if (k === 'net') { ctx.strokeStyle = own ? 'rgba(120,100,60,.8)' : 'rgba(200,60,40,.8)'; ctx.lineWidth = 1; for (let i = -6; i <= 6; i += 3) { ctx.beginPath(); ctx.moveTo(x + i * z, y - 4 * z); ctx.lineTo(x + i * z, y + 4 * z); ctx.moveTo(x - 6 * z, y + i * z * 0.6); ctx.lineTo(x + 6 * z, y + i * z * 0.6); ctx.stroke(); } }
    else { ctx.strokeStyle = own ? 'rgba(120,90,40,.9)' : 'rgba(200,60,40,.9)'; ctx.lineWidth = 1.2; for (let i = -5; i <= 5; i += 2.5) { ctx.beginPath(); ctx.moveTo(x + i * z, y + 2 * z); ctx.lineTo(x + i * z + 1.5 * z, y - 5 * z); ctx.stroke(); } }
    return; }
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
  if (b.owner === 0 && G.rdy && G.rdy.get(b.kind) && !b.q.some(j => j.tech || j.age)) researchBadge(sx - B.fp * NAVC * z * 0.3, sy - (B.h * 1.2 + 6) * z - 10 * Math.max(0.9, z * 0.6), Math.max(0.9, z * 0.6), G.rdy.get(b.kind));   // a parchment tab with a book and how many researches wait here
  if (b.kind === 'mill' && !lessMotion) { ctx.strokeStyle = '#efe6cf'; ctx.lineWidth = 1.6 * z; const cx = sx, cy = sy - 26 * z, a = G.t; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a + i * 1.571) * 13 * z, cy + Math.sin(a + i * 1.571) * 13 * z); } ctx.stroke(); }
  if (CHIMNEY[b.kind]) { const [dx, h] = CHIMNEY[b.kind]; smoke(sx + dx * z, sy - h * z, b.id, z); }
  blaze(b, sx, sy, z);
  if (b.owner === 0 && B.crop && b.node && !(b.node.wk > 0)) idleMark(sx, sy, z * 1.2);
  const M = maxHpB(b.owner, b.kind);
  if (b.hp < M - 1) bar(sx, sy - c.ay * k - 4, Math.min(60 * z, B.fp * NAVC * z), b.hp / M, G.P[b.owner].color);
  if (G.wonder && G.wonder.id === b.id) { ctx.font = '700 ' + Math.max(12, 12 * z) + 'px ' + fontF(); ctx.fillStyle = '#ffd35e'; ctx.textAlign = 'center'; ctx.fillText(clock(Math.max(0, G.wonder.end - G.t)), sx, sy - c.ay * k - 10); ctx.textAlign = 'left'; }
}
const CHIMNEY = { house: [6.2, 26], smith: [9, 28], keep: [-20, 44], foundry: [9, 34] };
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
// Three translucent casts (warm dusk, blue night, the weather) laid one over another come to one colour: computed once a frame, painted once.
const WX_TINT = { drought: [210, 160, 60, 0.10], rain: [20, 30, 50, 0.12], frost: [230, 240, 250, 0.14] };
const tintC = { k: '', s: '' };
function tintOf(dusk, nt) {
  let r = 0, g = 0, b = 0, a = 0;
  const lay = (cr, cg, cb, ca) => { if (ca <= 0) return; const na = a + ca - a * ca; r = (r * a * (1 - ca) + cr * ca) / na; g = (g * a * (1 - ca) + cg * ca) / na; b = (b * a * (1 - ca) + cb * ca) / na; a = na; };
  if (dusk > 0.02) lay(255, 140, 60, 0.13 * dusk);
  if (nt > 0) lay(10, 18, 48, 0.4 * nt * (1.15 - 0.3 * moonLight()));   // darker toward the new moon
  const w = WX_TINT[G.wx]; if (w) lay(w[0], w[1], w[2], w[3]);
  if (a <= 0.002) return '';
  const k = `${(r | 0)},${(g | 0)},${(b | 0)},${Math.round(a * 200)}`; if (tintC.k !== k) { tintC.k = k; tintC.s = `rgba(${r | 0},${g | 0},${b | 0},${(a).toFixed(3)})`; }
  return tintC.s;
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
const workOf = u => u.job === 'repair' ? 5 : !u.node ? 0 : u.node.kind === 'fish' ? 4 : u.node.kind === 'bush' || u.node.kind === 'meat' ? 1 : u.node.kind === 'stone' || u.node.kind === 'gold' || u.node.kind === 'iron' ? 2 : u.node.kind === 'farm' ? (u.node.type === 'wood' ? 0 : 3) : 0;   // which work a villager is doing: chop, forage, mine, farm, fish, mend
function drawUnit(u, s) {
  // a woodcutter leans in to its tree while it chops: the tree's ground keeps it 20 away, so it is drawn up to 12 closer (drawing only; the game does not move it)
  { const n = u.node, on = u.kind === 'vil' && n && n.kind === 'tree' && u.work && G.t - u.work < 0.25; u.lean = clamp((u.lean || 0) + (on ? 0.08 : -0.08), 0, 1); }
  const ln = u.lean && u.node ? Math.min(12, Math.max(0, dist(u, u.node) - 10)) * u.lean / (dist(u, u.node) || 1) : 0, ux = u.node ? u.x + (u.node.x - u.x) * ln : u.x, uy = u.node ? u.y + (u.node.y - u.y) * ln : u.y;
  const z = cam.z, sx = SX(ux), sy = SY(uy) - (u.fly || 0) * z, U = UNIT[u.kind], col = G.P[u.owner].color, st = u.owner === WILD ? null : stats(u.owner, u.kind);
  const moving = G.t - (u.mvT || -9) < 0.15, working = u.work && G.t - u.work < 0.25;
  const fr = G.t - (u.hitT || -9) < 0.25 ? 3 : moving ? 1 + (((G.t * 6) | 0) + u.id) % 2 : working ? (U.look === 'vil' ? 10 + workOf(u) * 2 + (((G.t * 2.5) | 0) + u.id) % 2 : 1 + (((G.t * 6) | 0) + u.id) % 2) : 0;
  if (z < 0.3) { const big = (LOOKBOX[U.look] || [26])[0]; ctx.fillStyle = u.owner === WILD ? '#c9b48a' : col; const r = Math.max(1.8, big * 0.07 * z * FIG); ctx.fillRect(sx - r, sy - r * 1.6, r * 2, r * 2); return; }   // seen from far away a person is a dot of their colour
  const c = sprite(U.look, col, st ? st.tier : u.tier || 0, fr, s, st && U.tick === 'sol' && !hasTag(u.kind, 'siege') ? st.kit : 0), k = z * FIG / s, big = (LOOKBOX[U.look] || [26])[0];
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
  if (isSoldier(u) && u.mor < 0.6 && z > 0.45 && u.state !== 'rout') bar(sx, top - 10, Math.max(12, 12 * z), u.mor, '#f2cf55');   // nerve, when it is low
  if (u.state === 'rout') { ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx + 5 * z, sy - 6 * z); ctx.lineTo(sx + 5 * z, sy - 20 * z); ctx.stroke(); ctx.fillStyle = '#f4f0e6'; ctx.beginPath(); ctx.moveTo(sx + 5 * z, sy - 20 * z); ctx.lineTo(sx + 13 * z, sy - 17 * z); ctx.lineTo(sx + 5 * z, sy - 14 * z); ctx.closePath(); ctx.fill(); }   // a white flag: broken, running
  if (u.state === 'convert' && u.cvT > 0) { ctx.strokeStyle = 'rgba(244,206,90,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy - 6 * z, 9 * z, -Math.PI / 2, -Math.PI / 2 + 6.28 * u.cvT / (CONVERT.secs * fxv(u.owner, 'convert').m)); ctx.stroke(); }   // the conversion, filling
  if (u.owner === 0 && u.idle) idleMark(sx, top, z);
  if (u.sick > G.t) { ctx.fillStyle = u.plague ? '#7a3a8a' : '#7aa04a'; ctx.beginPath(); ctx.arc(sx - 5 * z, top - 2, 2 * z + 1, 0, 7); ctx.fill(); }
  if (u.kind === 'caravan' && u.goods) { const k = Object.keys(u.goods).find(k => u.goods[k] > 0); if (k) { ctx.fillStyle = GOODS[k].col; ctx.fillRect(sx - 4 * z, sy - 12 * z, 5 * z, 3 * z); } }
}
function drawFind(f) {
  const z = cam.z, x = SX(f.x), y = SY(f.y), F = FINDS[f.kind];
  ctx.save(); ctx.translate(x, y); ctx.scale(z, z); g = ctx; ctx.lineJoin = 'round';
  if (f.kind === 'chest') { E_(0, 1, 7, 2.4, 'rgba(0,0,0,.3)'); P_([[-5, 0], [5, 0], [5, -5], [-5, -5]], '#7a4e24', INK, 0.5); P_([[-5, -5], [5, -5], [4, -8], [-4, -8]], '#8a5a2a', INK, 0.5); L_(-5, -3, 5, -3, '#c9a227', 0.8); E_(0, -4.4, 1, 1, '#f2cf55'); }
  else if (f.kind === 'ruins') { for (const [dx, h] of [[-10, 14], [-4, 8], [3, 16], [9, 5]]) { P_([[dx - 1.6, 0], [dx + 1.6, 0], [dx + 1.6, -h], [dx - 1.6, -h]], LG(dx - 2, 0, dx + 2, 0, ['#e0d8c4', '#a89e88']), INK, 0.4); } P_([[-12, -14], [5, -16.5], [5, -18], [-12, -15.6]], '#d0c8b2', INK, 0.4); P_([[-6, 1], [2, 1], [1, -2], [-5, -2]], '#b8b0a0', INK, 0.4); }
  else if (f.kind === 'cemetery') { for (let i = 0; i < 6; i++) { const dx = -12 + (i % 3) * 10, dy = -3 + Math.floor(i / 3) * 6; P_([[dx - 1.8, dy], [dx + 1.8, dy], [dx + 1.8, dy - 4], [dx, dy - 5.4], [dx - 1.8, dy - 4]], '#9a9890', INK, 0.4); } L_(-16, 6, 16, 6, '#3a3028', 0.6); for (let x = -16; x <= 16; x += 4) L_(x, 6, x, 2, '#3a3028', 0.6); }
  else if (f.kind === 'camp') { for (const [dx, col] of [[-9, '#7a6a50'], [8, '#6a5a44']]) P_([[dx - 6, 0], [dx + 6, 0], [dx, -9]], col, INK, 0.5); E_(0, 2, 3, 1.2, '#3a2a1a'); if (!lessMotion) { const ph = (G.t * 3) % 1; E_(0, 0, 1.6, 2.4 + ph, 'rgba(250,150,40,.85)'); } L_(14, 2, 14, -14, '#3a2a1a', 0.6); P_([[14, -14], [20, -12.6], [14, -11]], '#2a2a2a'); }
  else if (f.kind === 'den') { P_([[-12, 1], [-9, -8], [0, -12], [10, -7], [13, 1]], LG(0, -12, 0, 1, ['#8a8478', '#5a5650']), INK, 0.5); E_(0, -2, 4.4, 4, '#1a1612'); }
  else if (f.kind === 'shrine') {   // the shrine inside the Throne: three steps, four columns, a gold dome, the flame; the holder's colour on the dome's finial
    const oc = f.owner !== null ? G.P[f.owner].color : '#d8cdb4';
    for (let k = 0; k < 3; k++) P_([[-10 + k * 2, 2 - k * 1.6], [10 - k * 2, 2 - k * 1.6], [10 - k * 2, 0.4 - k * 1.6], [-10 + k * 2, 0.4 - k * 1.6]], k % 2 ? '#c8bda0' : '#b8ac92', INK, 0.35);
    for (const cx of [-6, -2, 2, 6]) { L_(cx, -3, cx, -11, '#e8e0c8', 1.6); L_(cx, -3, cx, -11, 'rgba(90,70,40,.35)', 0.5); }
    P_([[-8, -11], [8, -11], [8, -12.4], [-8, -12.4]], '#d8cdb4', INK, 0.35);
    E_(0, -12.4, 7, 4.2, LG(-7, 0, 7, 0, ['#f2d27a', '#c9a227', '#8a6a1a']), INK, 0.4); ctx.save(); ctx.beginPath(); ctx.rect(-8, -17, 16, 4.6); ctx.clip(); E_(0, -12.4, 7, 4.2, LG(-7, 0, 7, 0, ['#f2d27a', '#c9a227', '#8a6a1a']), INK, 0.4); ctx.restore();
    L_(0, -16.6, 0, -19.5, '#8a6a1a', 0.8); E_(0, -20, 1.3, 1.3, oc, INK, 0.3);
    if (!lessMotion) E_(0, -6, 1.6, 2.4 + Math.sin(G.t * 6) * 0.5, 'rgba(255,190,70,.9)');
    if (f.cap) { const t = f.cap.t / F.capture; ctx.strokeStyle = G.P[f.cap.o].color; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, -8, 12, -Math.PI / 2, -Math.PI / 2 + t * 6.28); ctx.stroke(); } }
  else if (f.kind === 'stop') { if (!postAt(f)) {   // a bazaar stall: striped awning on two poles, a table of goods with the wanted one in front, the holder's pennant
    const oc = f.owner !== null ? G.P[f.owner].color : '#d8c79c';
    L_(-9, 2, -9, -11, '#5a3a1c', 1); L_(9, 2, 9, -11, '#5a3a1c', 1);
    for (let k = 0; k < 6; k++) P_([[-11 + k * 3.7, -11], [-7.3 + k * 3.7, -11], [-7.3 + k * 3.7 + 1, -14.5], [-11 + k * 3.7 + 1, -14.5]], k % 2 ? '#efe6d0' : oc, null); P_([[-11, -11], [11, -11], [12, -14.5], [-10, -14.5]], null, INK, 0.4);
    for (let k = 0; k < 6; k++) P_([[-11 + k * 3.7, -11], [-9.2 + k * 3.7, -9.4], [-7.3 + k * 3.7, -11]], k % 2 ? '#efe6d0' : oc, INK, 0.3);
    P_([[-8, 1], [8, 1], [8, -3], [-8, -3]], '#8a5d34', INK, 0.4); L_(-7, 1, -7, 3, '#5a3a1c', 0.8); L_(7, 1, 7, 3, '#5a3a1c', 0.8);
    { const ks = Object.keys(GOODS).filter(k => k !== f.want).slice(0, 2); E_(-4.5, -4, 2.2, 1.4, GOODS[ks[0]].col, INK, 0.3); E_(4.5, -4, 2.2, 1.4, GOODS[ks[1] || ks[0]].col, INK, 0.3); E_(0, -2.2, 2.8, 1.8, GOODS[f.want].col, INK, 0.4); }
    L_(12, -11, 12, -20, '#5a3a1c', 0.8); P_([[12, -20], [19, -18.6], [12, -17]], oc, INK, 0.4); } }
  else if (f.kind === 'vagabonds') { if (!f.done) { E_(0, 2, 3, 1.2, '#3a2a1a'); if (!lessMotion) E_(0, 0, 1.4, 2.2, 'rgba(250,150,40,.85)'); P_([[-10, 3], [-4, 3], [-4, 1], [-10, 1]], '#6b4a3a'); P_([[5, 4], [11, 4], [11, 2], [5, 2]], '#4a5a6a'); } }
  ctx.restore(); g = null;
}
// what the finger holds: a ring on the ground under each, green for yours, red for a foe's, gold for the wild and the land
function drawPicks(z) {
  if (!G.pickE || !G.pickE.length) return;
  ctx.lineWidth = 2; ctx.setLineDash([]);
  for (const e of G.pickE) {
    if (e.hp !== undefined && e.hp <= 0) continue; if (e.amt !== undefined && e.amt <= 0 && !e.farm) continue;
    const own = e.owner, r = e.q ? halfOf(e) + 6 : e.kind && FINDS[e.kind] ? 18 : 9;
    ctx.strokeStyle = own === 0 ? '#5ad27a' : own === undefined || own === null || own === WILD ? '#ffd35e' : '#ff6a52';
    ctx.beginPath(); ctx.ellipse(SX(e.x), SY(e.y), r * z + 3, r * z * TILT + 2, 0, 0, 7); ctx.stroke();
  }
}
const rnd2 = () => Math.random() * 2 - 1;
// Spectacle on the glass: each event's picture, drawn over the world. Light, particles, a real shape; nothing that hides the game.
// the ground after the weather: mud darkens the land, snow whitens it, ice gives it a sheen
function drawGround() {
  const g = G.ground; if (!g || (g.mud < 0.02 && g.snow < 0.02 && g.ice < 0.02)) return;
  const w = cw, h = ch;
  if (g.mud >= 0.02) { ctx.fillStyle = `rgba(70,45,22,${0.22 * g.mud})`; ctx.fillRect(0, 0, w, h); ctx.fillStyle = `rgba(50,32,14,${0.3 * g.mud})`; const z = cam.z, s = 90 * z; for (let i = 0; i < 60; i++) { const sx = SX(((i * 173) % MAP)), sy = SY(((i * 311) % MAP)); if (sx > -s && sx < w + s && sy > -s && sy < h + s) { ctx.beginPath(); ctx.ellipse(sx, sy, s * (0.5 + (i % 3) * 0.25), s * 0.3, 0, 0, 6.3); ctx.fill(); } } }
  if (g.snow >= 0.02) { ctx.fillStyle = `rgba(235,240,245,${0.55 * g.snow})`; ctx.fillRect(0, 0, w, h); }
  if (g.ice >= 0.02) { ctx.fillStyle = `rgba(190,215,240,${0.25 * g.ice})`; ctx.fillRect(0, 0, w, h); }
}
function drawEvents(z) {
  const e = G.ev && G.ev.cur, t = performance.now() / 1000;
  if (e && e.kind === 'storm' && !lessMotion) {   // a dark band of cloud walking east, rain under it
    const x = SX(e.x), w = EVENTS.storm.band * z; const gr = ctx.createLinearGradient(x - w, 0, x + w, 0); gr.addColorStop(0, 'rgba(20,24,34,0)'); gr.addColorStop(0.5, 'rgba(14,18,28,.62)'); gr.addColorStop(1, 'rgba(20,24,34,0)'); ctx.fillStyle = gr; ctx.fillRect(x - w, 0, 2 * w, ch);
    ctx.fillStyle = 'rgba(40,46,60,.85)'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(x + (i - 4) * w * 0.22 + Math.sin(t * 0.7 + i) * 8, 30 + (i % 3) * 14, 70 + (i % 2) * 30, 26, 0, 0, 7); ctx.fill(); }   // the cloud itself along the top of the glass
  }
  if (e && e.kind === 'locusts') { const x = SX(e.x), y = SY(e.y); ctx.fillStyle = 'rgba(20,16,8,.28)'; ctx.beginPath(); ctx.ellipse(x, y, 70 * z, 40 * z, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(230,200,120,.9)'; for (let i = 0; i < 70; i++) { const a = i * 2.4 + t * (1 + (i % 5) * 0.3), r = (20 + (i * 37) % 60) * z; ctx.fillRect(x + Math.cos(a) * r + Math.sin(t * 7 + i) * 3 * z, y + Math.sin(a) * r * TILT - 20 * z + Math.cos(t * 9 + i) * 3 * z, 2.2 * z, 1.4 * z); } }   // a dark cloud of specks
  if (e && e.kind === 'meteor') { const f = clamp((G.t - e.t0) / (e.until - e.t0), 0, 1), x1 = SX(e.at.x), y1 = SY(e.at.y), x0 = x1 - 420, y0 = y1 - 560, x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f; ctx.strokeStyle = 'rgba(255,240,200,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - (x1 - x0) * 0.12, y - (y1 - y0) * 0.12); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); }
  if (e && e.kind === 'eclipse') { const f = Math.sin(Math.PI * clamp((G.t - e.t0) / (e.until - e.t0), 0, 1)), x = cw * 0.5, y = ch * 0.28; ctx.globalAlpha = f; const gl = ctx.createRadialGradient(x, y, 26, x, y, 60); gl.addColorStop(0, 'rgba(255,250,230,.9)'); gl.addColorStop(1, 'rgba(255,250,230,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, y, 60, 0, 7); ctx.fill(); ctx.fillStyle = '#0b0f0d'; ctx.beginPath(); ctx.arc(x, y, 27, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }   // the corona at the top of the glass
  if (e && e.kind === 'fog') { const f = Math.min(1, (G.t - e.t0) / 4, (e.until - G.t) / 4); ctx.fillStyle = `rgba(214,220,222,${0.55 * f})`; ctx.fillRect(0, 0, cw, ch); if (!lessMotion) { ctx.fillStyle = `rgba(230,234,236,${0.25 * f})`; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.ellipse(((i * 173 + t * 12) % (cw + 300)) - 150, (i * 97) % ch, 160, 50, 0, 0, 7); ctx.fill(); } } }
  if (e && e.kind === 'aurora') { const f = Math.sin(Math.PI * clamp((G.t - e.t0) / (e.until - e.t0), 0, 1)); for (let i = 0; i < 3; i++) { const gr = ctx.createLinearGradient(0, 0, 0, ch * 0.5); gr.addColorStop(0, `rgba(${i ? 120 : 60},${220 - i * 40},${140 + i * 40},${0.5 * f})`); gr.addColorStop(1, 'rgba(60,200,140,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, 0); for (let x = 0; x <= cw; x += 20) ctx.lineTo(x, ch * 0.18 + Math.sin(x / 60 + t * 0.6 + i) * 30 + i * 25); ctx.lineTo(cw, 0); ctx.closePath(); ctx.fill(); } }
  if (G.wx === 'blizzard' && !lessMotion) { ctx.fillStyle = 'rgba(245,248,252,.9)'; for (let i = 0; i < 160; i++) { const y = ((i * 71.9 + t * 90) % (ch + 20)) - 10, x = ((i * 113.7 + t * 140 + Math.sin(t * 0.8 + i) * 14) % (cw + 40)) - 20; ctx.fillRect(x, y, 2 + (i % 3 === 0), 2 + (i % 3 === 0)); } ctx.fillStyle = 'rgba(235,240,245,.35)'; ctx.fillRect(0, 0, cw, ch); }
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
  if (SET.fog) { m.imageSmoothingEnabled = false; m.drawImage(fogLayer(), 0, 0, 172, 172); }
  for (const f of G.finds) if ((!f.done || FINDS[f.kind].capture) && known0(f)) { m.fillStyle = f.owner !== null && FINDS[f.kind].capture ? G.P[f.owner].color : '#f2cf55'; m.fillRect(f.x * k - 1.5, f.y * k - 1.5, 3, 3); }
  for (const b of G.blds) {   // Town Centers are stars, castles diamonds, the rest small squares
    if (!known0(b)) continue; m.fillStyle = G.P[b.owner].color; const x = b.x * k, y = b.y * k;
    if (b.kind === 'keep' || b.kind === 'town') { m.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 3 : 7.5, a = -Math.PI / 2 + i * Math.PI / 5; m.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } m.closePath(); m.fill(); m.strokeStyle = 'rgba(0,0,0,.6)'; m.lineWidth = 1; m.stroke(); }
    else if (b.kind === 'castle') { m.beginPath(); m.moveTo(x, y - 5.5); m.lineTo(x + 5.5, y); m.lineTo(x, y + 5.5); m.lineTo(x - 5.5, y); m.closePath(); m.fill(); m.strokeStyle = 'rgba(0,0,0,.6)'; m.lineWidth = 1; m.stroke(); }
    else if (!BLD[b.kind].trap) { const s = BLD[b.kind].wallish ? 2 : BLD[b.kind].fp >= 5 ? 5 : 3.5; m.fillRect(x - s / 2, y - s / 2, s, s); }
  }
  if (G.wx === 'blizzard') { m.fillStyle = 'rgba(235,240,245,.92)'; m.fillRect(0, 0, 172, 172); return; }   // a whiteout: the small map shows nothing
  for (const u of G.units) if (u.owner !== WILD ? visibleTo0(u) : !UNIT[u.kind].flee && !UNIT[u.kind].passive && (!SET.fog || seen0(u))) { m.fillStyle = G.P[u.owner].color; m.fillRect(u.x * k - 1, u.y * k - 1, 2, 2); }
  if (G.mirage && G.mirage.until > G.t) { m.fillStyle = '#de5a44'; for (let i = 0; i < G.mirage.n; i++) m.fillRect((G.mirage.x + (i % 4) * 14 - 20) * k - 1, (G.mirage.y + Math.floor(i / 4) * 14 - 14) * k - 1, 2, 2); }   // the mirage
  const a = toWorld(0, 0), b = toWorld(cw, ch);
  m.strokeStyle = '#fff'; m.lineWidth = 1.5; m.strokeRect(a.x * k, a.y * k, (b.x - a.x) * k, (b.y - a.y) * k);
}


// ── Weather on the glass, after SoRen's model: rain is a pool of drops whose size sets its speed and weight (Marshall-Palmer sizes,
// Atlas's fall speeds); a storm doubles the drops and leans them with the wind. Lightning is SoRen's three-stroke bolt (glow, mid, core) with forks;
// the sky lights from inside and decays in a tenth of a second; far strikes are sheet flashes with no bolt; thunder comes by distance (18-sound).
// Safety as SoRen's: one flash at a time, never two inside a third of a second. The sky band along the top of the glass is the horizon: it
// takes the colour of the hour and the weather, and the storm's cloud walks across it.
const RAINP = { n: 240, lambda: 4.1 * 5 ** -0.21, dMin: 0.5, dMax: 4 }, fallV = D => 9.65 - 10.3 * Math.exp(-0.6 * D);
const RAIN = Array.from({ length: RAINP.n }, (_, i) => { const D = Math.min(RAINP.dMax, RAINP.dMin - Math.log(1 - ((i * 0.618) % 1 || 0.5)) / RAINP.lambda), d = clamp(0.4 + 0.6 * (D - RAINP.dMin) / 2.5, 0.4, 1); return { x: (i * 97.3) % 1000, y: (i * 53.7) % 1000, d, v: 9.6 * fallV(D) / fallV(2) }; });
let wxT = 0, wind = 0, flashA = 0, flashT = -9, sheetT = -9; const FLASH_GAP = 0.34;
const flashOK = now => now - flashT >= FLASH_GAP;
function drawWeather() {
  const z = cam.z, now = performance.now() / 1000, dt = Math.min(0.05, now - (wxT || now)), wx = G.wx, e = G.ev.cur; wxT = now;
  const stormy = e && e.kind === 'storm', raining = wx === 'rain' || stormy;
  wind += ((stormy ? 0.8 : raining ? 0.3 : 0.1) * Math.sin(now * 0.07) - wind) * dt * 0.3;   // the wind wanders; a storm leans it hard
  if (raining && !lessMotion) {
    const n = stormy ? RAINP.n : wx === 'rain' ? 150 : 0, slant = wind * 0.35, fall = 420 * dt;
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) { const m = RAIN[i]; m.y += m.v * fall; m.x += wind * 60 * dt; if (m.y > ch + 12) { m.y = -12; m.x = Math.random() * cw; } if (m.x < -24) m.x = cw + 12; else if (m.x > cw + 24) m.x = -12;
      const len = 8 + 12 * m.d; ctx.strokeStyle = `rgba(205,232,250,${(0.2 + 0.4 * m.d).toFixed(2)})`; ctx.lineWidth = 0.8 + 0.8 * m.d; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - slant * len, m.y + len); ctx.stroke(); }
  }
  if (wx === 'frost' || wx === 'blizzard') {
    if (!lessMotion) { const n = wx === 'blizzard' ? 160 : 80, sp = wx === 'blizzard' ? 90 : 34; ctx.fillStyle = 'rgba(245,248,252,.85)'; for (let i = 0; i < n; i++) { const y = ((i * 71.9 + now * sp) % (ch + 20)) - 10, x = (i * 113.7 + Math.sin(now * 0.8 + i) * 14 + wind * now * 40) % cw; ctx.fillRect(x < 0 ? x + cw : x, y, 2 + (i % 3 === 0), 2 + (i % 3 === 0)); } }
  }
  // the storm's own lightning: far sheet flashes while it walks, a close bolt now and then (the strikes on buildings come from 19-economy)
  if (stormy && !lessMotion && now - sheetT > 2.5 + 6 * Math.random() && flashOK(now)) { sheetT = now; const close = Math.random(); if (close > 0.75) { const bx = cam.x + (Math.random() - 0.5) * cw / z, by = cam.y + (Math.random() - 0.5) * ch / z; (G.bolts = G.bolts || []).push({ x: bx, y: by, t: G.t, seed: Math.random() }); thunder(bx, by); } else { flashA = Math.max(flashA, 0.25 + 0.3 * close); flashT = now; } }
  if (G.bolts && G.bolts.length) {
    G.bolts = G.bolts.filter(b => G.t - b.t < 0.7);
    for (const b of G.bolts) {
      const age = G.t - b.t; if (!b.lit && flashOK(now)) { b.lit = true; flashA = Math.max(flashA, 0.6 + 0.4 * (1 - Math.min(1, hyp(b.x - cam.x, b.y - cam.y) / 900))); flashT = now; }
      if (age > 0.45) continue;
      let r = b.seed * 1e6 | 1; const rr = () => ((r = (r * 16807) % 2147483647) / 2147483647);   // the same jagged path every frame
      const x1 = SX(b.x), y1 = SY(b.y), paths = [], main = []; let x = x1 + (rr() - 0.5) * 80, y = Math.min(0, y1 - 300);
      main.push([x, y]); while (y < y1) { y += 9 + rr() * 15; x += (rr() - 0.5) * 34; main.push([x, y]); } main[main.length - 1] = [x1, y1]; paths.push(main);
      for (let f = 0, nf = 1 + (rr() * 3 | 0); f < nf; f++) { const fk = main[1 + Math.floor(rr() * (main.length - 3))], dir = rr() < 0.5 ? -1 : 1, br = [fk]; for (let k = 1, kn = 3 + (rr() * 3 | 0); k <= kn; k++) br.push([fk[0] + dir * k * (7 + rr() * 9), fk[1] + k * (8 + rr() * 9)]); paths.push(br); }
      const a = clamp(1 - age / 0.45, 0, 1), w = 12;
      ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
      for (const [lw, col] of [[w, `rgba(170,200,255,${(0.18 * a).toFixed(2)})`], [w * 0.38, `rgba(210,228,255,${(0.45 * a).toFixed(2)})`], [w * 0.16, `rgba(255,255,255,${a.toFixed(2)})`]]) { ctx.strokeStyle = col; paths.forEach((path, i) => { ctx.lineWidth = i ? lw * 0.55 : lw; ctx.beginPath(); path.forEach(([px, py], j) => j ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke(); }); }
      ctx.restore();
    }
  }
  if (flashA > 0.005) { ctx.fillStyle = `rgba(190,210,255,${Math.min(0.75, flashA).toFixed(3)})`; ctx.fillRect(0, 0, cw, ch); flashA *= Math.exp(-dt / 0.09); } else flashA = 0;   // the sky lights from inside, once, and is gone in a tenth of a second
}
// the horizon: a band of sky along the top of the glass, coloured by the hour and the weather; clouds cross it with the wind, the storm's front walks it
const SKY = { day: [120, 170, 225], dusk: [235, 150, 80], night: [16, 22, 48], rain: [120, 130, 145], storm: [50, 56, 70], blizzard: [205, 210, 220], drought: [220, 190, 130], frost: [185, 205, 230] };
function drawSky() {
  const nt = G.night, dusk = 4 * nt * (1 - nt), wx = G.wx, e = G.ev.cur, stormy = e && e.kind === 'storm', h = Math.round(Math.min(ch * 0.16, 110));
  const mix = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f)), base = mix(mix(SKY.day, SKY.dusk, dusk), SKY.night, nt), cast = stormy ? SKY.storm : SKY[wx], col = cast ? mix(base, cast, wx === 'rain' ? 0.7 : 0.55) : base;
  const top = (parseFloat(getComputedStyle($('stage')).getPropertyValue('--hb')) || 86) + 2;   // the sky begins under the top bars
  const gr = ctx.createLinearGradient(0, top, 0, top + h); gr.addColorStop(0, `rgba(${col},.6)`); gr.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = gr; ctx.fillRect(0, top, cw, h);
  if (lessMotion) return;
  const now = performance.now() / 1000, cloudy = stormy ? 1 : wx === 'rain' ? 0.8 : wx === 'blizzard' ? 0.9 : wx === 'clear' || wx === 'drought' ? 0.25 : 0.5, dark = stormy ? 0.75 : wx === 'rain' ? 0.5 : 0.2;
  const c = mix(mix([245, 248, 252], [60, 66, 80], dark), SKY.night, nt * 0.8); ctx.fillStyle = `rgba(${c},${0.5 * cloudy})`;
  for (let i = 0; i < 7; i++) { const sp = 6 + (i % 3) * 3, x = ((i * 173 + now * sp * (0.4 + wind)) % (cw + 240)) - 120, y = 8 + (i % 3) * 9, rw = 60 + (i % 4) * 22; ctx.beginPath(); ctx.ellipse(x, top + y, rw, 10 + (i % 2) * 5, 0, 0, 7); ctx.ellipse(x + rw * 0.5, top + y - 4, rw * 0.55, 9, 0, 0, 7); ctx.fill(); }
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
