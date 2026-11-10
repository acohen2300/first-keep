// E882
'use strict';
window.CELS = (() => {
const D = fromBook('measure'), CE = D.cels, ONE = D.count.one, ZERO = D.count.zero, SH = BOOKS.shells, has = (c, t) => SH[c].ticks.includes(t); // E883
const CODES = Object.keys(SH).filter((c) => SH[c].layer === CE.layer).sort((a, b) => SH[a].order - SH[b].order), PIECES = new Map(); // E884
function poisson(r, size, rnd) { const cell = r / Math.SQRT2, n = Math.ceil(size / cell), grid = new Int32Array(n * n).fill(-ONE), pts = [], live = []; // E885
  const put = (x, y) => { grid[Math.floor(y / cell) * n + Math.floor(x / cell)] = pts.length; pts.push([x, y]); live.push(pts.length - ONE); };
  put(rnd() * size, rnd() * size);
  while (live.length) { const at = Math.floor(rnd() * live.length), [px, py] = pts[live[at]]; let found = false;
    for (let t = ZERO; t < CE.tries; t++) { const a = rnd() * Math.PI * (ONE + ONE), d = r * (ONE + CE.ring * rnd()), x = px + Math.cos(a) * d, y = py + Math.sin(a) * d; if (x < ZERO || y < ZERO || x >= size || y >= size) continue;
      const gi = Math.floor(x / cell), gj = Math.floor(y / cell); let ok = true; for (let j = Math.max(ZERO, gj - ONE - ONE); j <= Math.min(n - ONE, gj + ONE + ONE) && ok; j++) for (let i = Math.max(ZERO, gi - ONE - ONE); i <= Math.min(n - ONE, gi + ONE + ONE); i++) { const q = grid[j * n + i]; if (q >= ZERO && Math.hypot(pts[q][ZERO] - x, pts[q][ONE] - y) < r) { ok = false; break; } }
      if (ok) { put(x, y); found = true; break; } }
    if (!found) { live[at] = live[live.length - ONE]; live.pop(); } }
  return pts; }
const lip = (code) => { const C = FK.ref(SH[code].cel); return C.len ? C.len[ZERO] + C.len[ONE] : ZERO; }; // E888
function bake(code, pi, pj, q) { const c = document.createElement('canvas'), P = CE.piece, s = Math.ceil(P * q), top = Math.ceil(lip(code) * q); c.width = s; c.height = s + top; c.top = top; const g = c.getContext('2d'); g.translate(ZERO, top); const rnd = FK.dice(FK.seedNow() + CE.prime[ZERO] * pi + CE.prime[ONE] * pj + CODES.indexOf(code)); // E886
  const [ox, oy] = FK.groundBox(), [x0, y0] = [pi * P - ox, pj * P - oy], on = (x, y) => FK.grassView(x0 + x / q, y0 + y / q);
  const ink = [FK.C.cel.light, FK.C.cel.dark], tw = (paths, alpha) => paths.forEach((p, n) => { g.globalAlpha = alpha(n); g.strokeStyle = g.fillStyle = ink[n % ink.length]; p.fill ? g.fill(p.path) : g.stroke(p.path); }); // E890
  if (has(code, 'Blades')) { const B = FK.ref(SH[code].cel), P2 = Array.from({ length: ink.length * B.tiers }, () => ({ path: new Path2D(), fill: true }));
    for (const [x, y] of poisson(B.gap * q, s, rnd)) { if (!on(x, y)) continue; const L = (B.len[ZERO] + rnd() * B.len[ONE]) * q, lean = (rnd() - CE.half) * B.lean * L, p = P2[(rnd() < B.lit ? ZERO : ONE) + ink.length * Math.floor(rnd() * B.tiers)].path; const w = B.w * q * CE.half; p.moveTo(x - w, y); p.lineTo(x + lean, y - L); p.lineTo(x + w, y); }
    tw(P2, (n) => B.a[ZERO] + (B.a[ONE] * (Math.floor(n / ink.length) + CE.half)) / B.tiers); }
  return c; }
let fresh = false; const QUEUE = new Map(), later = window.requestIdleCallback || ((f) => setTimeout(f, ZERO)); // E892
function want(key, job) { if (QUEUE.has(key)) return; QUEUE.set(key, job); if (QUEUE.size === ONE) later(work); }
function work(dl) { if (!QUEUE.size) return; if (dl && dl.timeRemaining && dl.timeRemaining() < CE.need) { later(work); return; } const [key, [code, i, j, q]] = QUEUE.entries().next().value; QUEUE.delete(key); PIECES.set(key, bake(code, i, j, q)); if (PIECES.size > CE.keep) PIECES.delete(PIECES.keys().next().value); if (QUEUE.size) later(work); else { fresh = true; FK.dirty(); } }
function draw(ctx, z, gx, gy, w, h, m = ZERO) { const P = CE.piece, q = FK.zoomStep(z), [, , gw, gh] = FK.groundBox(), n = [Math.ceil(gw / P), Math.ceil(gh / P)]; // E887
  for (const code of CODES) { if (has(code, 'Coat')) { const K = FK.ref(SH[code].cel); ctx.save(); ctx.setTransform(ONE, ZERO, ZERO, ONE, ZERO, ZERO); ctx.globalCompositeOperation = K.mode; ctx.globalAlpha = K.a; ctx.drawImage(ctx.canvas, ZERO, ZERO); ctx.restore(); continue; } // E891
    const [z0, z1] = SH[code].fade ? CE.fade[SH[code].fade] : [ZERO, ZERO], a = z1 > z0 ? Math.min(ONE, Math.max(ZERO, (z - z0) / (z1 - z0))) : ONE; if (a <= ZERO) continue; ctx.globalAlpha = a;
    const i0 = Math.max(ZERO, Math.floor((-m - gx) / (P * z))), i1 = Math.min(n[ZERO] - ONE, Math.floor((w + m - gx) / (P * z))), j0 = Math.max(ZERO, Math.floor((-m - gy) / (P * z))), j1 = Math.min(n[ONE] - ONE, Math.floor((h + m - gy) / (P * z)));
    for (let j = j0 - ONE; j <= j1 + ONE; j++) for (let i = i0 - ONE; i <= i1 + ONE; i++) { if (i < ZERO || j < ZERO || i >= n[ZERO] || j >= n[ONE]) continue; const key = `${code}|${i}|${j}|${q}`, c = PIECES.get(key), out = i < i0 || i > i1 || j < j0 || j > j1; if (!c) { want(key, [code, i, j, q]); continue; } if (out) continue; // E895
      ctx.drawImage(c, gx + i * P * z, gy + j * P * z - (c.top / q) * z, P * z, P * z + (c.top / q) * z); } }
  ctx.globalAlpha = ONE; const f = fresh; fresh = false; return f; }
FK.on('start', () => { PIECES.clear(); QUEUE.clear(); }); FK.on('land', draw);
return { CODES, draw, clear: () => PIECES.clear() };
})();
