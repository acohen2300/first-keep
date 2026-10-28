// ═════ 11-input.js ═════
// ───────────────────────── Touch: drag to look, pinch to zoom, tap to ask, press and slide to place ─────────────────────────
const ptrs = new Map(); let drag = null, pinch = null;
const HOLD_MS = 320; let holdT = 0;   // hold a finger on open ground, then drag: a box
const holdStop = () => { clearTimeout(holdT); G.press = null; };
const lp = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
let EDGE = null;   // where the finger is while it drags the ghost: near the screen edge the map scrolls
function edgeScroll(dt) {
  if (!EDGE || !G.place || !drag || drag.mode !== 'place') return;
  const m = 48, vx = EDGE.x < m ? -1 : EDGE.x > cw - m ? 1 : 0, vy = EDGE.y < m ? -1 : EDGE.y > ch - m ? 1 : 0; if (!vx && !vy) return;
  cam.x += vx * 320 * dt / cam.z; cam.y += vy * 320 * dt / (cam.z * TILT); clampCam(); ghostAt(EDGE, drag.touch);
}
const LIFT = 64;   // on a phone the building waits this far above your finger, so you can see it
function ghostAt(p, touch) {
  const pl = G.place, w = toWorld(p.x, p.y - (touch ? LIFT : 0));
  if (pl.kind === 'wall') { const c = toCell(w); if (!pl.a) pl.a = c; pl.cells = wallLine(pl.a, c); pl.at = { x: c.gx * NAVC + 5, y: c.gy * NAVC + 5 }; }
  else pl.at = snapGhost(0, pl.kind, w.x, w.y, Math.max(14, 26 / cam.z));
}
cv.addEventListener('pointerdown', e => { hideStrip(); holdStop();
  try { cv.setPointerCapture(e.pointerId); } catch (err) {} const p = lp(e); ptrs.set(e.pointerId, p);
  if (ptrs.size >= 2) { drag = null; const [a, b] = [...ptrs.values()]; pinch = { d: hyp(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; return; }
  if (G.place) {
    const touch = e.pointerType !== 'mouse', at = G.place.at, gx = at ? SX(at.x) : 0, gy = at ? SY(at.y) : 0, nearGhost = !at || Math.min(hyp(p.x - gx, p.y - gy), hyp(p.x - gx, p.y - (touch ? LIFT : 0) - gy)) < Math.max(70, BLD[G.place.kind].fp * NAVC * cam.z * 0.7);
    if (nearGhost) { if (G.place.kind === 'wall') { G.place.a = null; } ghostAt(p, touch); drag = { mode: 'place', touch }; EDGE = p; ui(true); return; }
    drag = { mode: 'pan', x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, touch };   // away from the ghost: drag looks around; a tap moves the ghost there
    return;
  }
  drag = { mode: 'pan', x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false };
  G.press = { x: p.x, y: p.y, t: performance.now() };
  holdT = setTimeout(() => { const d = drag; if (d && d.mode === 'pan' && !d.moved && G.press) { drag = { mode: 'box', x0: G.press.x, y0: G.press.y, x1: G.press.x, y1: G.press.y }; G.box = drag; G.press = null; if (navigator.vibrate) navigator.vibrate(12); } }, HOLD_MS);
});
cv.addEventListener('pointermove', e => {
  const p = lp(e); if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, p);
  if (pinch && ptrs.size >= 2) {
    const [a, b] = [...ptrs.values()], d = hyp(a.x - b.x, a.y - b.y) || 1, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    zoomAt(cam.z * d / pinch.d, mx, my); cam.x -= (mx - pinch.mx) / cam.z; cam.y -= (my - pinch.my) / (cam.z * TILT); clampCam();
    pinch.d = d; pinch.mx = mx; pinch.my = my; return;
  }
  if (drag && drag.mode === 'box') { drag.x1 = p.x; drag.y1 = p.y; return; }
  if (G.place && drag && drag.mode === 'place') { ghostAt(p, drag.touch); EDGE = p; return; }
  if (G.place && !drag && e.pointerType === 'mouse' && G.place.kind !== 'wall') { ghostAt(p, false); return; }
  if (!drag || drag.mode !== 'pan') return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (!drag.moved && hyp(dx, dy) > 8) { drag.moved = true; holdStop(); }
  if (drag.moved) { cam.x = drag.cx - dx / cam.z; cam.y = drag.cy - dy / (cam.z * TILT); clampCam(); }
});
cv.addEventListener('pointerup', e => {
  ptrs.delete(e.pointerId); holdStop();
  if (pinch) { if (ptrs.size < 2) pinch = null; drag = null; return; }
  const d = drag; drag = null; if (!d) return;
  EDGE = null;
  if (d.mode === 'box') { G.box = null; if (Math.abs(d.x1 - d.x0) < 12 && Math.abs(d.y1 - d.y0) < 12) { const q = lp(e); tapAt(q.x, q.y); } else boxPick(d); ui(true); return; }   // held but never dragged: it was a tap
  if (d.mode === 'place') { ui(true); return; }   // it waits: drag again to adjust, or tap Build
  if (d.moved) return;
  const p = lp(e);
  if (G.place) { if (G.place.kind === 'wall') G.place.a = null; ghostAt(p, d.touch); ui(true); return; }
  tapAt(p.x, p.y);
});
cv.addEventListener('pointercancel', e => { EDGE = null; holdStop(); G.box = null; ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; drag = null; });
cv.addEventListener('wheel', e => { e.preventDefault(); const p = lp(e); zoomAt(cam.z * Math.exp(-e.deltaY * 0.0015), p.x, p.y); }, { passive: false });
['gesturestart', 'gesturechange', 'gestureend'].forEach(t => document.addEventListener(t, e => e.preventDefault()));
mini.addEventListener('pointerdown', e => { e.stopPropagation(); const r = mini.getBoundingClientRect(); cam.x = (e.clientX - r.left) / r.width * MAP; cam.y = (e.clientY - r.top) / r.height * MAP; clampCam(); });
// what is under the finger: a building (they have height), a find, a unit, a resource, else the ground
function tapAt(sx, sy) {
  hideStrip(); if (G.over) return;
  if (RADAR && hyp(sx - RADAR.sx, sy - RADAR.sy) < 26) { cam.x = RADAR.x; cam.y = RADAR.y; clampCam(); return; }
  const z = cam.z; let foot = null, roof = null, fy = -1e9, ry = -1e9;
  for (const b of G.blds) {   // footprint: the ground it stands on; roof: the height drawn above it
    const B = BLD[b.kind], w = Math.max(B.fp * NAVC * z, 22), x = SX(b.x), gy = SY(b.y), d = B.fp * NAVC * z * TILT;
    if (sx <= x - w / 2 - 4 || sx >= x + w / 2 + 4 || sy >= gy + d / 2 + 4) continue;
    if (sy > gy - d / 2 - 4) { if (gy > fy) { foot = b; fy = gy; } }
    else if (sy > gy - d / 2 - (B.h + 8) * z - 10 && gy > ry) { roof = b; ry = gy; }
  }
  if (foot) { openCard({ type: 'bld', id: foot.id }); return; }
  const near = (x, y, r) => hyp(SX(x) - sx, SY(y) - 6 * z - sy) < r;
  const f = G.finds.find(f => !(f.done && FINDS[f.kind].got) && near(f.x, f.y, Math.max(22, 14 * z)));
  if (f) { openCard({ type: 'find', id: f.id }); return; }
  let u = null, ud = Math.max(16, 9 * z); for (const v of G.units) if (!v.inside && visibleTo0(v)) { const d = hyp(SX(v.x) - sx, SY(v.y) - 6 * z - sy); if (d < ud) { ud = d; u = v; } }
  if (u) { openCard({ type: 'unit', id: u.id }); return; }
  if (roof) { openCard({ type: 'bld', id: roof.id }); return; }
  let nd = null, nr = Math.max(16, 11 * z);
  for (const n of G.nodes) if (n.kind !== 'farm') { const d = hyp(SX(n.x) - sx, SY(n.y) - 6 * z - sy); if (d < nr) { nr = d; nd = n; } }
  if (nd) { openCard({ type: 'node', id: nd.id }); return; }
  const w = toWorld(sx, sy);
  showStrip(sx, sy, w.x, w.y);   // open ground: the small send strip at your finger
}
function startPlace(kind) {
  const B = BLD[kind], p = G.P[0];
  if (B.age > p.age) { openCard({ type: 'info', kind }); return; }
  if (G.place && G.place.kind === kind) { cancelPlace(); return; }
  const why = capWhy(0, kind); if (why) { say(why + '.', '', 3); sfx('err'); return; }
  closeCard(); G.place = { kind, at: null, a: null, cells: null };
  // start the ghost in the middle of the screen, snapped beside something of yours if it can be
  const w = toWorld(cw / 2, ch / 2); if (kind !== 'wall') G.place.at = snapGhost(0, kind, w.x, w.y, 200);
  $('place').hidden = false; ui(true);
}
// you tapped Build: build what the ghost shows; houses, fields and gates offer the next spot beside it
function cancelPlace() { if (G) G.place = null; $('place').hidden = true; }


// Select: the box drawn on screen, turned into the trees and villagers of yours inside it
function boxPick(d) {
  const a = toWorld(Math.min(d.x0, d.x1), Math.min(d.y0, d.y1)), b = toWorld(Math.max(d.x0, d.x1), Math.max(d.y0, d.y1)), r = { x0: a.x, y0: a.y, x1: b.x, y1: b.y };
  const trees = G.nodes.filter(n => n.kind === 'tree' && n.amt > 0 && inBox(n, r)).length, vils = unitsOf(0, 'vil').filter(u => !u.inside && inBox(u, r)).map(u => u.id);
  if (!trees && !vils.length) { say('Nothing to pick in that box: trees or villagers.', '', 3); return; }
  openCard({ type: 'box', r, trees, vils });
}
