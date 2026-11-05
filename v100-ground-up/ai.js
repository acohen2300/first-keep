'use strict';
// First Keep v100 · ai.js (floor 11): one brain for the computer's side, one personality (balanced). Lives alone; acts only through ECON and WAR, the same doors the menu uses. Every D.ai.beat it looks and does one round: jobs by need, people, homes, drop-offs, plots, the age, the army, the wave.
window.AI = (() => {
const { D, B, SIDES, N } = FK;
// its numbers live in books/measure.js (D); nothing is typed here
const things = FK.things, units = FK.units, Y = ['food', 'wood', 'gold', 'stone', 'iron'];
const clock = SIDES.map(() => 0), seen = SIDES.map(() => ({ hp: 0, t: 0 }));
const home = (side) => things().find((t) => t.side === side && FK.has(t, 'Seat'));
const bought = (cap) => FK.ticked(cap).filter((c) => !FK.SH[c].ticks.includes('Seat') && D.cost[c]); // the shells a side can pay for that tick a capability
const HOUSE = bought('House')[0], FIELD = bought('Field')[0];
const camps = Object.fromEntries(Y.map((y) => [y, bought('Drop-off').find((c) => (FK.SH[c].drop || []).includes(y))])); // each yield's camp: the drop-off that takes it in
const dist = (a, b) => Math.hypot(a.bx - b.bx, a.by - b.by);
// a spot: the nearest free footprint to a point, searched in rings, kept off the home's own ring so the roads stay open
function spot(code, bx, by, rmin = 0) { const n = B[code][1], [sx, sy] = FK.fromBoard(bx, by), ci = Math.floor(sx / D.tile - n / 2), cj = Math.floor(sy / D.tile - n / 2);
  for (let r = rmin; r < 30; r++) for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i += j === cj - r || j === cj + r ? 1 : 2 * r) if (ECON.canPlace(code, i, j)) return [i, j]; return null; }
function raise(side, code, bx, by, rmin) { const at = spot(code, bx, by, rmin); if (!at) return null; const t = ECON.plan(side, code, ...at); if (!t) return null; let n = 0; for (const u of ECON.villagersOf(side).sort((a, b) => dist(a, t) - dist(b, t))) if (n < D.ai.builders && (u.job === 'idle' || u.job === 'wait' || ECON.jobOf(u) !== 'build')) { ECON.buildAt(u, t); n++; } return t; }
const count = (side, code) => things().filter((t) => t.kind === 'bld' && t.side === side && t.code === code).length;
const trainer = (side, code) => things().find((t) => t.kind === 'bld' && t.side === side && t.done >= 1 && (D.trains[t.code] || []).includes(code) && !(t.q && t.q.length));
function round(side) { const s = SIDES[side], h = home(side); if (!h) return; const age = s.age, jobs = ECON.jobs(side), vs = ECON.villagersOf(side), want = D.ai.people[age], mix = D.ai.mix[age], sites = things().filter((t) => t.kind === 'bld' && t.side === side && t.done < 1);
  // jobs by need: the yield whose share is most under its wanted share takes an idle villager, or one from the yield most over
  const onJobs = Y.reduce((n, y) => n + jobs[y], 0) || 1, gap = (y) => mix[Y.indexOf(y)] - jobs[y] / onJobs, need = Y.slice().sort((a, b) => gap(b) - gap(a))[0], over = Y.slice().sort((a, b) => gap(a) - gap(b))[0];
  if (jobs.idle > 0) ECON.assign(side, need, 1); else if (gap(need) > 0.15 && jobs[over] > 1) ECON.assign(side, need, 1);
  for (const t of sites) if (!vs.some((u) => u.target === t)) { const u = vs.find((v) => v.job === 'idle' || v.job === 'wait') || vs.find((v) => ECON.jobOf(v) === over); if (u) ECON.buildAt(u, t); }
  s.rally = need;
  // people, homes, drop-offs, plots, the age
  if (vs.length + (h.q ? h.q.length : 0) < want) ECON.queue(h, 'UV');
  if (ECON.popCap(side) - ECON.popOf(side) < D.ai.homeAhead && !sites.some((t) => t.code === HOUSE)) raise(side, HOUSE, h.bx, h.by, 5);
  for (const y of Y) if (jobs[y] >= 3) { const u = vs.find((v) => ECON.jobOf(v) === y && v.target && v.target.kind !== 'bld'); if (!u) continue; const b = FK.dropFor(u, y); if (b && dist(b, u.target) > D.ai.campAt * D.tile && !sites.some((t) => camps[y] === t.code)) raise(side, camps[y], u.target.bx, u.target.by, 2); }
  if (vs.length >= 8 && !count(side, 'BM1')) raise(side, 'BM1', h.bx, h.by, 5); else if (age >= 2 && !count(side, 'BM2')) raise(side, 'BM2', h.bx, h.by, 5); else if (age >= 3 && !count(side, 'BM3')) raise(side, 'BM3', h.bx, h.by, 6);
  if (!things().some((t) => t.kind !== 'bld' && ECON.yieldOf(t) === 'food' && t.amount > 0 && dist(t, h) < D.ai.farmAt * D.tile) && count(side, FIELD) < D.ai.farms && !sites.some((t) => t.code === FIELD)) raise(side, FIELD, h.bx, h.by, 4);
  if (vs.length >= want * 0.8 && ECON.ageCost(side) && ECON.canPay(side, ECON.ageCost(side))) ECON.ageUp(side);
  // the army: the best counter to what the enemy fields most, until the age's count stands
  const enemy = D.players.find((p) => p !== side), theirs = WAR.armyOf(enemy), mine = WAR.armyOf(side);
  if (mine.length < D.ai.army[age]) { const cls = {}; for (const u of theirs) cls[WAR.stat(u).cls] = (cls[WAR.stat(u).cls] || 0) + 1; const most = Object.keys(cls).sort((a, b) => cls[b] - cls[a])[0]; const best = ['UM1', 'UM2', 'UM3'].find((c) => D.stats[c].vs === most) || 'UM1';
    for (const code of [best, 'UM1', 'UM2', 'UM3']) { const b = trainer(side, code); if (b && ECON.queue(b, code)) break; } }
  // the wave: Lanchester odds r²/(1+r²) (QAF) of my strength over theirs with their towers counted as soldiers; a stalled wave goes home
  const eh = home(enemy), w = WAR.waves[side];
  if (!w && mine.length >= D.ai.army[Math.max(1, age)] && eh) { const r = WAR.strength(mine) / Math.max(1, WAR.strength(theirs) + things().filter((t) => t.kind === 'bld' && t.side === enemy && D.tower[t.code]).length * 100); if (r * r / (1 + r * r) >= D.ai.odds) WAR.attack(side, FK.tileAt(eh.bx, eh.by)); }
  else if (w && eh) { const hp = things().filter((t) => t.kind === 'bld' && t.side === enemy).reduce((n, t) => n + t.hp, 0) + theirs.reduce((n, u) => n + u.hp, 0); if (hp < seen[side].hp) seen[side].t = 0; else seen[side].t += D.ai.beat; seen[side].hp = hp; if (seen[side].t > D.ai.stall) { WAR.recall(side); seen[side].t = 0; } }
}
FK.on('start', () => { clock.fill(0); for (const q of seen) { q.hp = 0; q.t = 0; } });
FK.on('tick', (dt) => { if (ECON.result()) return; for (const side of D.players) { if (side === 0) continue; clock[side] += dt; if (clock[side] >= D.ai.beat) { clock[side] = 0; round(side); } } });
return { round, spot, raise };
})();
