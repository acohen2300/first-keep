'use strict';
// E241
window.AI = (() => {
const { D, B, SIDES, N } = FK;
// E170
const things = FK.things, units = FK.units, Y = ECON.YIELDS;
const clock = SIDES.map(() => 0), seen = SIDES.map(() => ({ hp: 0, t: 0 }));
const home = FK.seatOf, born = (h) => FK.trains(h.code)[0]; // E242
const bought = (cap) => FK.ticked(cap).filter((c) => !FK.ticked('Seat').includes(c) && D.cost[c]); // E243
const [HOUSE] = bought('House'), [FIELD] = bought('Field'), [WALL] = bought('Line'), [GATE] = bought('Gate'), WP = D.ai.walls, rings = new Map();
const camps = Object.fromEntries(Y.map((y) => [y, bought('Drop-off').find((c) => !FK.ticked('Shore').includes(c) && (FK.SH[c].drop || []).includes(y))])); // E244
const dist = (a, b) => Math.hypot(a.bx - b.bx, a.by - b.by);
// E245
function spot(code, bx, by, rmin = 0, side) { const n = B[code][1], [sx, sy] = FK.fromBoard(bx, by), ci = Math.floor(sx / D.tile - n / 2), cj = Math.floor(sy / D.tile - n / 2);
  for (let r = rmin; r < D.ai.reach; r++) for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i += j === cj - r || j === cj + r ? 1 : 2 * r) if (ECON.canPlace(code, i, j, side)) return [i, j]; return null; }
function raise(side, code, bx, by, rmin) { const at = spot(code, bx, by, rmin, side); if (!at) return null; const t = ECON.plan(side, code, ...at); if (!t) return null; let n = 0; for (const u of ECON.villagersOf(side).sort((a, b) => dist(a, t) - dist(b, t))) if (n < D.ai.builders && (u.job === 'idle' || u.job === 'wait' || ECON.jobOf(u) !== 'build')) { ECON.buildAt(u, t); n++; } return t; }
function wallPlan(h) { const H = D.place.half, R = WP.ring + H, ci = h.i + h.n * H, cj = h.j + h.n * H, mid = FK.MID / D.tile, base = Math.atan2(mid - cj, mid - ci), off = new Map(); let pi = null, pj = null; // E331
  const add = (i, j) => { const a = Math.atan2(j + H - cj, i + H - ci) - base; if (!off.has(j * N + i)) off.set(j * N + i, Math.abs(Math.atan2(Math.sin(a), Math.cos(a)))); };
  for (let s = -WP.steps; s <= WP.steps; s++) { const a = base + s * WP.step, i = Math.floor(ci + Math.cos(a) * R), j = Math.floor(cj + Math.sin(a) * R); if (pi !== null && i !== pi && j !== pj) add(i, pj); add(i, j); [pi, pj] = [i, j]; }
  const ks = [...off.keys()], gates = ks.slice().sort((a, b) => off.get(a) - off.get(b)).filter((k, n) => n < WP.gates); return [...gates.map((k) => [k, GATE]), ...ks.filter((k) => !gates.includes(k)).map((k) => [k, WALL])]; }
const count = (side, code) => things().filter((t) => t.kind === 'bld' && t.side === side && t.code === code).length;
const trainer = (side, code) => things().find((t) => t.kind === 'bld' && t.side === side && t.done >= 1 && FK.trains(t.code).includes(code) && !(t.q && t.q.length));
function round(side) { const s = SIDES[side], h = home(side); if (!h) return; const age = s.age, jobs = ECON.jobs(side), vs = ECON.villagersOf(side), want = D.ai.people[age], mix = D.ai.mix[age], sites = things().filter((t) => t.kind === 'bld' && t.side === side && t.done < 1);
  // E246
  const onJobs = Y.reduce((n, y) => n + jobs[y], 0) || 1, gap = (y) => mix[Y.indexOf(y)] - jobs[y] / onJobs, need = Y.slice().sort((a, b) => gap(b) - gap(a))[0], over = Y.slice().sort((a, b) => gap(a) - gap(b))[0];
  if (jobs.idle > 0) ECON.assign(side, need, 1); else if (gap(need) > D.ai.shift && jobs[over] > 1) ECON.assign(side, need, 1);
  for (const t of sites) if (!ECON.wallish(t) && !vs.some((u) => u.target === t)) { const u = vs.find((v) => v.job === 'idle' || v.job === 'wait') || vs.find((v) => ECON.jobOf(v) === over); if (u) ECON.buildAt(u, t); }
  s.rally = need;
  // E247
  if (vs.length + (h.q ? h.q.length : 0) < want) ECON.queue(h, born(h));
  if (ECON.popCap(side) - ECON.popOf(side) < D.ai.homeAhead && !sites.some((t) => t.code === HOUSE)) raise(side, HOUSE, h.bx, h.by, D.ai.ring.home);
  for (const y of Y) if (jobs[y] >= D.ai.campCrew) { const u = vs.find((v) => ECON.jobOf(v) === y && v.target && v.target.kind !== 'bld'); if (!u) continue; const b = FK.dropFor(u, y); if (b && dist(b, u.target) > D.ai.campAt * D.tile && !sites.some((t) => camps[y] === t.code)) raise(side, camps[y], u.target.bx, u.target.by, D.ai.ring.camp); }
  const next = D.ai.raise.find((b) => vs.length >= b.vils && age >= b.age && !count(side, b.code)); if (next) raise(side, next.code, h.bx, h.by, next.ring);
  if (!things().some((t) => t.kind !== 'bld' && ECON.yieldOf(t) === 'food' && t.amount > 0 && dist(t, h) < D.ai.farmAt * D.tile) && count(side, FIELD) < D.ai.farms && !sites.some((t) => t.code === FIELD)) raise(side, FIELD, h.bx, h.by, D.ai.ring.field);
  if (age >= WP.age && s.store.stone >= WP.stone) { const laid = []; if (!rings.has(side)) rings.set(side, wallPlan(h)); for (const [k, code] of rings.get(side)) { if (laid.length >= WP.pieces || s.store.stone < WP.keep) break; const t = !FK.OCC[k] && ECON.plan(side, code, k % N, (k - (k % N)) / N); if (t) { laid.push(t); ECON.autoBuilder(side, t); } } } // E330
  if (vs.length >= want * D.ai.ageAt && ECON.ageCost(side) && ECON.canPay(side, ECON.ageCost(side))) ECON.ageUp(side);
  // E248
  const enemy = D.players.find((p) => WAR.atWar(side, p)), theirs = WAR.armyOf(enemy), mine = WAR.armyOf(side);
  if (mine.length < D.ai.army[age]) { const T = D.ai.troops, score = (c) => theirs.reduce((n, u) => n + WAR.vs({ code: c, side }, u), 0), best = T.reduce((b, c) => (score(c) > score(b) ? c : b));
    for (const code of [best, ...T]) { const b = trainer(side, code); if (b && ECON.queue(b, code)) break; } }
  // E249
  const eh = home(enemy), w = WAR.waves[side];
  if (!w && mine.length >= D.ai.army[Math.max(1, age)] && eh) { if (WAR.odds(mine, enemy) >= D.ai.odds) WAR.attack(side, FK.tileAt(eh.bx, eh.by)); }
  else if (w && eh) { const hp = things().filter((t) => t.kind === 'bld' && t.side === enemy).reduce((n, t) => n + t.hp, 0) + theirs.reduce((n, u) => n + u.hp, 0); if (hp < seen[side].hp) seen[side].t = 0; else seen[side].t += D.ai.beat; seen[side].hp = hp; if (seen[side].t > D.ai.stall) { WAR.recall(side); seen[side].t = 0; } }
}
FK.on('start', () => { clock.fill(0); rings.clear(); for (const q of seen) { q.hp = 0; q.t = 0; } });
FK.on('tick', (dt) => { if (ECON.result()) return; for (const side of D.players) { if (side === 0) continue; clock[side] += dt; if (clock[side] >= D.ai.beat) { clock[side] = 0; round(side); } } });
return { round, spot, raise, wallPlan };
})();
