# Batch 3 (Build 80): movement and work rules, each shown failing on a planted bug. Run by the gate:  python3 tests/moves.py
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => {
  const F = window.__fk, bad = []; F.newGame(7); F.act('close'); F.setPause(false); let G = F.G;
  // decision 10: two on one spot part, the same way every time
  const v = G.units.filter((u) => u.owner === 0 && u.kind === 'vil').slice(0, 2);
  v[0].x = F.keepOf(0).x + 60; v[0].y = F.keepOf(0).y - 60;   // on open ground: the first villagers can start on the Town Center's own squares
  const run = () => { v[1].x = v[0].x; v[1].y = v[0].y; F.pushApart(v[0], v[1]); return [v[0].x - v[1].x, v[0].y - v[1].y]; };
  const a = run(), b = run();
  if (Math.hypot(a[0], a[1]) < 1) bad.push('two villagers on one spot did not part');
  if (a[0] !== b[0] || a[1] !== b[1]) bad.push('the parting direction changes from one time to the next');
  // C13: a fish costs its walk home like any find
  const k = F.keepOf(0), nr = { kind: 'fish', type: 'food', x: k.x + 60, y: k.y, amt: 300, id: 9e6 }, fr = { ...nr, x: k.x + 600, id: 9e6 + 1 };
  const probe = (n) => F.forage({ x: n.x, y: n.y, owner: 0, node: null, carry: 0 }, n);
  const rn = probe(nr), rf = probe(fr);
  if (!(rn > rf)) bad.push('a fish far from any drop-off pays as well as one beside it (' + rn.toFixed(3) + ' vs ' + rf.toFixed(3) + ')');
  // C10: a student is not pulled out of the School
  const s = F.addUnit(0, 'spear', k.x + 40, k.y + 40);
  if (s) { s.state = 'school'; if (F.troops().includes(s)) bad.push('All hands / Town square pulls a student out of the School'); if (F.sendable().includes(s)) bad.push('Home pulls a student out of the School'); }
  // decision 12: a deer's diagonal run is no faster than a straight one
  const d = F.addUnit(G.P.length - 1, 'deer', 600, 600); G.tick = 1 - (d.id % 6); d.hurtT = undefined; d.run = { x: 1600, y: 1600 };
  const x0 = d.x, y0 = d.y; F.wildTick(d, 0.25, 1); const step = Math.hypot(d.x - x0, d.y - y0), want = F.UNIT.deer.spd * 0.25;
  if (Math.abs(step - want) > 0.05 * want) bad.push('a deer runs ' + step.toFixed(2) + ' a step on a diagonal, not ' + want.toFixed(2));
  // decisions 8, 8b, 13: soldiers leave animals alone; a boar on one of your civilians, seen by your side, is not left alone
  const sp = F.addUnit(0, 'spear', k.x + 100, k.y + 100), bo = F.addUnit(G.P.length - 1, 'boar', k.x + 110, k.y + 100), vv = G.units.find((u) => u.owner === 0 && u.kind === 'vil');
  bo.tgt = null; if (F.nearestFoe(0, sp, 200) === bo) bad.push('a soldier goes after a boar that has done nothing');
  vv.x = bo.x + 5; vv.y = bo.y; bo.tgt = vv; if (F.nearestFoe(0, sp, 200) !== bo) bad.push('a soldier ignores a boar on one of your villagers');
  // batch 4: B7 full health follows research; B15 no fish on land; B8 Easy has no bonus; B5 a fallen holder hands the Throne back
  F.newGame(7); G = F.G; const tc = F.keepOf(0); G.P[0].techs.add('masonry'); F.fxDirty();
  if (Math.abs(tc.hp - F.maxHpB(0, tc.kind)) > 1) bad.push('Masonry left the Town Center at ' + Math.round((100 * tc.hp) / F.maxHpB(0, tc.kind)) + '% health');
  for (const n of G.nodes) if (n.kind === 'fish' && F.onLand(n.x, n.y)) { bad.push('a fish sits on land at ' + Math.round(n.x) + ',' + Math.round(n.y)); break; }
  G.diff = 'easy'; G.hz = { [Object.keys(F.HAZARDS)[0]]: 1 }; if (F.levelMul() !== 1) bad.push('Easy keeps a score bonus for hazards that are off');
  G.diff = 'normal'; F.takeThrone(1, true); const T = G.blds.find((b) => b.kind === 'throne'); F.fall(G.P[1]);
  if (!T || T.gone || T.owner === 1 || (G.throne && G.throne.owner === 1)) bad.push('the Throne was deleted or still held by a fallen side');
  return bad;
}"""

JS2 = """() => {
  const F = window.__fk, bad = [], W = () => F.G.P.length - 1, T = 1 / 30;
  const run = (secs, until) => { for (let i = 0; i < secs * 30; i++) { F.step(T); if (until && until()) return true; } return false; };
  // a fresh game, fog off, the computers' and the player's other villagers out of the way, so one villager's choices can be read
  const fresh = () => { F.newGame(7); F.act('close'); F.setPause(false); const G = F.G; G.fogOn = false; G.ev.next = 1e9; G.ev.cur = null;
    for (const u of G.units) if (u.kind === 'vil') { u.job = null; u.node = null; u.hunt = null; u.post = { x: u.x, y: u.y }; }
    F.step(T); return G; }; // one step lays the walking grid
  // a straight run of open land out from the Town Center, so finds can be laid at set distances from the drop-off
  const ray = (G, k, from, to) => { for (let a = 0; a < 24; a++) { const cx = Math.cos(a * Math.PI / 12), cy = Math.sin(a * Math.PI / 12); let ok = true;
      for (let r = from; r <= to && ok; r += 8) { const x = k.x + cx * r, y = k.y + cy * r; ok = !F.blockedCell(F.gcell(x, y), 0) && !G.blds.some((b) => b !== k && Math.hypot(b.x - x, b.y - y) < 40); }
      if (ok) return { cx, cy }; } bad.push('no open ground ' + from + ' to ' + to + ' from the Town Center: a search test could not run'); return null; };
  let id = 9e6;
  const bush = (G, k, d, r, amt = 300, side = 0) => { const n = { id: id++, kind: 'bush', type: 'food', x: k.x + d.cx * r - d.cy * side, y: k.y + d.cy * r + d.cx * side, amt, max: 300 }; G.nodes.push(n); return n; };
  const only = (u, keep) => { u.bad = {}; for (const n of F.G.nodes) if (!keep.includes(n)) u.bad[n.id] = 1e9; }; // it may take only these finds
  const vil = (G, i = 0) => G.units.filter((u) => u.owner === 0 && u.kind === 'vil')[i];

  // ── decision 1, the villager search ──
  { // deliver first, then straight to the find seen from the spent spot (it lies 190 from the drop-off: the search from there never reaches it)
    const G = fresh(), k = F.keepOf(0), d = ray(G, k, 60, 240); if (d) {
    const S = bush(G, k, d, 150, 0.4), Q = bush(G, k, d, 190), u = vil(G); only(u, [S, Q]);
    u.x = S.x - d.cx * 8; u.y = S.y - d.cy * 8; F.setJob(u, 'food', S); u.carry = 5; u.carryType = 'food';
    let dropT = -1, tookT = -1; const f0 = G.P[0].res.f;
    run(40, () => { if (dropT < 0 && u.carry === 0 && G.P[0].res.f > f0) dropT = G.t; if (tookT < 0 && u.node === Q) tookT = G.t; return tookT >= 0; });
    if (tookT < 0) bad.push('a find seen when the last ran out (40 from it, 190 from the drop-off) was never taken');
    else if (dropT < 0 || dropT > tookT) bad.push('a villager went to the next find with its load, before delivering it');
    else if (tookT - dropT > 1) bad.push('after delivering, the villager searched again instead of going straight to the find it had seen (' + (tookT - dropT).toFixed(1) + ' s)'); } }
  { // the anchor: an unplaced villager whose find was emptied by another searches from its nearest drop-off, not from where it stands
    const G = fresh(), k = F.keepOf(0), d = ray(G, k, 60, 220); if (d) {
    const S = bush(G, k, d, 200, 0), B = bush(G, k, { cx: -d.cx, cy: -d.cy }, 100), u = vil(G); only(u, [S, B]);
    u.x = S.x; u.y = S.y; F.setJob(u, 'food', S); u.carry = 0;
    const t0 = G.t; if (!run(20, () => u.node === B) || G.t - t0 > 5) bad.push('the search did not start from the drop-off: a find 100 from it, 300 from the villager, took ' + (G.t - t0).toFixed(1) + ' s (from the drop-off it is in reach by 3 s)'); } }
  { // the leash and the cap: unplaced, a find 230 from the drop-off is never taken; placed beside it, the same find is
    for (const placed of [false, true]) {
      const G = fresh(), k = F.keepOf(0), d = ray(G, k, 60, 240); if (!d) continue;
      const S = bush(G, k, d, 160, 0.4), C = bush(G, k, d, 232), u = vil(G); only(u, [S, C]);
      u.x = S.x - d.cx * 8; u.y = S.y - d.cy * 8; F.setJob(u, 'food', S, placed ? S : undefined); u.carry = 5; u.carryType = 'food';
      const took = run(30, () => u.node === C);
      if (!placed && took) bad.push('an unplaced villager took a find 232 from the drop-off, past the leash of ' + F.DANGER_R.far);
      if (placed && !took) bad.push('a placed villager did not take a find 72 from the spot it was placed'); } }
  { // the anchor: a placed villager searches from where it was placed. Its find 130 from that spot (past the first look's 90) and 198 from the
    // drop-off (past the full radius from there) is taken in time
    const G = fresh(), k = F.keepOf(0), d = ray(G, k, 60, 160); if (d) {
    const S = bush(G, k, d, 150, 0), C = bush(G, k, d, 150, 300, 130), u = vil(G); only(u, [S, C]);
    if (F.blockedCell(F.gcell(C.x, C.y), 0)) bad.push('the anchor test find stands on a wall: move it'); else {
    u.x = S.x; u.y = S.y; F.setJob(u, 'food', S, S); u.carry = 0;
    if (!run(20, () => u.node === C)) bad.push('a placed villager did not search from where it was placed: a find 130 from that spot was never taken'); } } }
  { // the cap: a placed villager takes nothing past x + y from where it was placed, not even a friend's find (200 from it)
    const G = fresh(), k = F.keepOf(0), d = ray(G, k, 60, 110); if (d) {
    const S = bush(G, k, d, 100, 0), D = bush(G, k, { cx: -d.cx, cy: -d.cy }, 100, 3000), u = vil(G), m = vil(G, 1); only(u, [S, D]);
    if (F.blockedCell(F.gcell(D.x, D.y), 0)) bad.push('the cap test find stands on a wall: move it'); else {
    m.x = D.x + 6; m.y = D.y; F.setJob(m, 'food', D); only(m, [D]);
    u.x = S.x; u.y = S.y; F.setJob(u, 'food', S, S); u.carry = 0;
    if (run(15, () => u.node === D)) bad.push('a placed villager took a find 200 from where it was placed, past the cap of ' + (F.SEARCH.x + F.SEARCH.y)); } } }
  { // a find a friend is working counts past the radius: 195 from the drop-off, past 180, inside the leash
    for (const friend of [false, true]) {
      const G = fresh(), k = F.keepOf(0), d = ray(G, k, 60, 220); if (!d) continue;
      const S = bush(G, k, { cx: -d.cx, cy: -d.cy }, 40, 0), Fd = bush(G, k, d, 195, 3000), u = vil(G), m = vil(G, 1); only(u, [S, Fd]);
      u.x = S.x; u.y = S.y; F.setJob(u, 'food', S); u.carry = 0;
      if (friend) { m.x = Fd.x + 6; m.y = Fd.y; F.setJob(m, 'food', Fd); only(m, [Fd]); }
      const took = run(25, () => u.node === Fd);
      if (friend && !took) bad.push('a find a friend is working, 195 from the drop-off, was not taken');
      if (!friend && took) bad.push('a find 195 from the drop-off, past the search radius, was taken with no friend on it'); } }
  { // no end: nothing in reach, it keeps its job a full minute, waits at the drop-off, and still takes a find the moment one appears
    const G = fresh(), k = F.keepOf(0), d = ray(G, k, 60, 160); if (d) {
    const S = bush(G, k, d, 120, 0), u = vil(G); only(u, [S]); u.x = S.x; u.y = S.y; F.setJob(u, 'food', S); u.carry = 0;
    run(60);
    if (u.job !== 'food') bad.push('a villager with nothing in reach gave up its job (' + u.job + ') within a minute');
    else if (!u.idle) bad.push('a villager waiting for a find is not shown as idle');
    else if (Math.hypot(u.x - k.x, u.y - k.y) > F.halfOf(k) + 25) bad.push('a villager waiting for a find is not at the drop-off (' + Math.round(Math.hypot(u.x - k.x, u.y - k.y)) + ' from it)');
    const N = bush(G, k, d, 80); only(u, [N]);
    if (!run(5, () => u.node === N)) bad.push('after a minute of waiting, a new find 80 from the drop-off was not taken: the villager stopped looking'); } }
  { // the clock resets on every new find, the player's order too: the next loss starts the search at 90 again
    const G = fresh(), k = F.keepOf(0), d = ray(G, k, 60, 160); if (d) {
    const B = bush(G, k, d, 100), u = vil(G); F.setJob(u, 'food'); u.was = 'bush'; u.lostT = G.t - 100;
    F.setJob(u, 'food', B, B); F.step(T);
    if (u.lostT !== undefined || F.searchR(u) !== F.SEARCH.x) bad.push('a villager given a find by the player kept the old search clock (radius ' + Math.round(F.searchR(u)) + ')'); } }

  // ── waiting spots round the whole building ──
  const spots = () => {
    const G = fresh(), k = F.keepOf(0), V = G.units.filter((u) => u.owner === 0 && u.kind === 'vil');
    for (const u of V) { F.setJob(u, 'food'); u.was = 'bush'; u.lostT = G.t; u.node = null; only(u, []); }
    run(25); return V.map((u) => ({ u, s: u.spot }));
  };
  { const A = spots(), k = F.keepOf(0), gap = F.SPACE;
    if (A.some((a) => !a.s)) bad.push('a waiting villager has no spot of its own');
    else {
      const ids = A.map((a) => a.s.i); if (new Set(ids).size !== ids.length) bad.push('two waiting villagers share one spot');
      const P = A.map((a) => F.spotAt(k, a.s.i)), R = F.halfOf(k) + 5, sides = new Set();
      for (const p of P) { const dx = p.x - k.x, dy = p.y - k.y; if (Math.abs(Math.max(Math.abs(dx), Math.abs(dy)) - R) > 0.01) bad.push('a spot is off the building outline'); sides.add(Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'e' : 'w') : (dy > 0 ? 's' : 'n')); }
      // every spot of every building kind, corners too, at least the gap apart, on all four sides
      for (const kind of Object.keys(F.BLD)) { const b = { kind, x: 500, y: 500 }, N = F.spotAt(b, 0).N, Q = [], sd = new Set(); let near = Infinity;
        for (let i = 0; i < N; i++) { const p = F.spotAt(b, i); Q.push(p); const dx = p.x - 500, dy = p.y - 500; if (Math.abs(dx) > Math.abs(dy) + 0.01) sd.add(dx > 0 ? 'e' : 'w'); else if (Math.abs(dy) > Math.abs(dx) + 0.01) sd.add(dy > 0 ? 's' : 'n'); }
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) near = Math.min(near, Math.hypot(Q[i].x - Q[j].x, Q[i].y - Q[j].y));
        if (near < gap - 0.01) { bad.push('two waiting spots at a ' + kind + ' are ' + (near / F.FOOT).toFixed(2) + ' ft apart, under ' + (F.SPACE / F.FOOT) + ' ft'); break; }
        if (sd.size < 4) { bad.push('the waiting spots at a ' + kind + ' do not go round all four sides'); break; } }
      if (sides.size < 2) bad.push('the waiters stand on one side of the building only');
      const far = A.filter((a, i) => Math.hypot(a.u.x - P[i].x, a.u.y - P[i].y) > F.ARRIVE + 3).length;
      if (far) bad.push(far + ' waiting villagers are not at their own spots (they pile up)');
      const B = spots(); if (B.map((b) => b.s && b.s.i).join() !== ids.join()) bad.push('the same seed stood the waiters on different spots');
    } }

  // ── any real move is a step ──
  { const G = fresh(), k = F.keepOf(0), V = G.units.filter((u) => u.owner === 0 && u.kind === 'vil'), a = V[0], b = V[1];
    const walk = (u) => u.st.walk;
    b.x = a.x + 3; b.y = a.y; let wa = walk(a), wb = walk(b); F.pushApart(a, b);
    if (!(walk(a) > wa && walk(b) > wb)) bad.push('a push moves a villager without a step');
    const c = F.addUnit(1, 'cata', a.x - 20, a.y); wa = walk(a); const x0 = a.x; F.hurt(1, c, a, 1);
    if (a.x !== x0 && !(walk(a) > wa)) bad.push('a knockback moves a villager without a step');
    const L = G.lakes[0]; if (L) { a.x = L.x + (L.r - 3) * 0.7071; a.y = L.y + (L.r - 3) * 0.7071; wa = walk(a); F.collide(); if (!(walk(a) > wa)) bad.push('the push out of the water is not a step'); }
    a.x = k.x; a.y = k.y; wa = walk(a); F.collide(); if (!(walk(a) > wa)) bad.push('the rescue out of a wall is not a step');
    const dr = F.addUnit(W(), 'deer', 600, 600); G.tick = 1 - (dr.id % 6); dr.hurtT = undefined; dr.run = { x: 900, y: 600 }; const wd = walk(dr); F.wildTick(dr, 0.25, 1);
    if (!(walk(dr) > wd)) bad.push('a fleeing deer runs without a step');
    const s = V[2]; s.x = k.x + 80; s.y = k.y + 80; s.path = null; const ws = walk(s), sx = s.x, sy = s.y; F.moveTo(s, s.x + 50, s.y, 0.005, 2, 1); const moved = Math.hypot(s.x - sx, s.y - sy);
    if (moved > 0 && Math.abs(walk(s) - ws - moved) > 1e-6) bad.push('a move under 0.3 a step is not counted (' + moved.toFixed(3) + ' moved, ' + (walk(s) - ws).toFixed(3) + ' walked)'); }

  // ── self-defence; group sight's eyes; boar and bear distance ──
  { const G = fresh(), k = F.keepOf(0), w = W(); G.rel[0][w] = G.rel[w][0] = 'peace';
    const d = ray(G, k, 60, 160) || { cx: 1, cy: 0 }, sp = F.addUnit(0, 'spear', k.x + d.cx * 120, k.y + d.cy * 120), wf = F.addUnit(w, 'wolf', sp.x + 10, sp.y);
    wf.hx = wf.x; wf.hy = wf.y; wf.tgt = sp; wf.aggro = sp;
    if (F.nearestFoe(0, sp, 200) !== wf) bad.push('a soldier does not count a wolf biting it as a foe (at peace with the wild)');
    const h0 = wf.hp; run(8); if (!(wf.hp < h0)) bad.push('a soldier bitten by a wolf never struck back (wolf ' + Math.round(wf.hp) + ' of ' + Math.round(h0) + ', soldier ' + Math.round(sp.hp) + ')'); }
  { const G = fresh(), k = F.keepOf(0), P = { x: 0, y: 0 };
    let best = 0; for (let x = 200; x < F.MAP; x += 100) for (let y = 200; y < F.MAP; y += 100) { const m = Math.min(...G.blds.filter((b) => b.owner === 0).map((b) => Math.hypot(b.x - x, b.y - y))); if (m > best && !F.blockedCell(F.gcell(x, y), 0)) { best = m; P.x = x; P.y = y; } }
    const vv = vil(G), bo = F.addUnit(W(), 'boar', P.x + 5, P.y); vv.x = P.x; vv.y = P.y; bo.tgt = vv;
    const far = F.addUnit(0, 'spear', P.x + F.sightOf(vv) + 150, P.y);
    if (F.groupSees(0, bo)) bad.push('the villager being attacked counts as one of its side\\'s eyes');
    if (F.nearestFoe(0, far, 2000) === bo) bad.push('a soldier went after a boar on a villager that no soldier or building could see');
    const near = F.addUnit(0, 'spear', P.x + 30, P.y);
    if (!F.groupSees(0, bo)) bad.push('a soldier in sight of the boar does not make its side see it');
    if (F.nearestFoe(0, far, 2000) !== bo) bad.push('the group does not see what one soldier sees: a far soldier ignores a boar on a villager'); }
  for (const kind of ['boar', 'bear']) {
    const G = fresh(), bo = F.addUnit(W(), kind, 700, 700); bo.hx = bo.x; bo.hy = bo.y; bo.tgt = null; bo.aggro = null; bo.hd = null;
    const v = vil(G); v.x = bo.x + 70; v.y = bo.y; v.inside = false; F.wildTick(bo, T, 1);
    if (bo.tgt !== v) bad.push('a ' + kind + ' does not react to a villager 70 away near its home (it should look out to ' + F.WILD_LOOK + ')'); }

  // ── the back-to-work test, through the repair exits themselves (not the helper) ──
  { const G = fresh(), u = vil(G), b = F.keepOf(0);
    u.job = 'wood'; F.setJob(u, 'repair'); u.pj = 'wood'; u.rep = b; b.hp = F.maxHpB(0, b.kind); run(3);
    if (u.job !== 'wood' || u.rep) bad.push('a repair whose building is whole does not send the villager back to its old job (' + u.job + ')');
    const u2 = vil(G, 1); F.setJob(u2, 'repair'); u2.pj = 'stone'; u2.rep = { ...b, hp: 0 }; run(3);
    if (u2.job !== 'stone') bad.push('a repair whose building is gone does not send the villager back to its old job (' + u2.job + ')');
    const b3 = F.keepOf(0), u3 = vil(G, 2); F.setJob(u3, 'repair'); u3.pj = 'gold'; u3.rep = b3; u3.fireman = true; b3.fire = 0; run(2);
    if (u3.job !== 'gold' || u3.fireman) bad.push('a fire put out does not send its fighter back to its old job (' + u3.job + ')'); }

  // ── building shadows: one fixed shape per light, moved and stretched; a site by its progress ──
  { const ctx = F.ctx, S = F.SHADE; F.newGame(7); F.act('close'); F.draw();
    const hull = (P) => { P.sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
      for (const p of P) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
      for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
      return lo.slice(0, -1).concat(up.slice(0, -1)); };
    const inside = (H, x, y) => { let s = 0; for (let i = 0; i < H.length; i++) { const a = H[i], b = H[(i + 1) % H.length], c = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]); if (Math.abs(c) < 1e-9) continue; const g = Math.sign(c); if (!s) s = g; else if (g !== s) return false; } return true; };
    const edge = (H, x, y) => H.some((a, i) => { const b = H[(i + 1) % H.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return Math.abs((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0])) / L < 0.6; });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); let miss = 0;
    for (const [lx, ly] of [[1, 0], [0.6, 0.6], [0, 1], [-0.7, 0.5], [-1, 0], [-0.5, -0.8], [0, -1], [0.8, -0.4]]) {
      S.a = 0.3; S.x = lx; S.y = ly; S.len = 1.4; const w = 20, h = 30, sx = 200, sy = 200, d = w * F.TILT, vx = lx * h * 1.4, vy = ly * h * 1.4, P = [];
      for (const [cx, cy] of [[-w, -d], [w, -d], [w, d], [-w, d]]) P.push([sx + cx, sy + cy], [sx + cx + vx, sy + cy + vy]);
      const H = hull(P); ctx.beginPath(); F.boxShadow(sx, sy, h, w, 1);
      for (let x = 120; x < 280; x += 1.5) for (let y = 130; y < 270; y += 1.5) if (!edge(H, x, y) && ctx.isPointInPath(x, y) !== inside(H, x, y)) miss++;
    }
    ctx.restore();
    if (miss) bad.push('a building shadow is not the footprint swept along the light (' + miss + ' points differ from the hull)');
    if (F.hexOf(1, 1) !== F.hexOf(1, 1)) bad.push('the shadow shape is made again for the same light instead of kept');
    const k = F.keepOf(0), cam = F.cam; cam.x = k.x; cam.y = k.y; cam.z = 1; F.draw();
    const area = (prog) => { S.a = 0.5; S.x = 0.7; S.y = 0.5; S.len = 2; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
      F.sunShadows([], [[0, 1, { kind: 'tower', x: k.x, y: k.y, prog }]], 1, true);
      const D = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data; let n = 0; for (let i = 3; i < D.length; i += 4) if (D[i]) n++; return n; };
    const full = area(1), site = area(0.25);
    if (!(site < full * 0.8)) bad.push('a building site a quarter raised casts a full building\\'s shadow (' + site + ' against ' + full + ' pixels)'); }
  return bad;
}"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        bad = await pg.evaluate(JS); bad += await pg.evaluate(JS2); await br.close()
    bad += errs
    print(('PASS ' if not bad else 'FAIL ') + 'movement and work rules (search, waiting spots, steps, self-defence, group sight, boar and bear, back to work, shadows)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
