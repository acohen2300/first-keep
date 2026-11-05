'use strict';
// First Keep v100 · econ.js (floor 9): the economy. Lives alone; touches the world only through FK. Costs, homes, training, sites, ages, upkeep, and the villager as one state machine: idle, walk, gather, carry, build, repair, wait.
window.ECON = (() => {
const { D, B, U, KIND, SIDES, OCC, H, N } = FK;
// its numbers live in books/measure.js (D); nothing is typed here
const YIELDS = ['food', 'wood', 'gold', 'stone', 'iron'];
for (const s of SIDES) Object.assign(s, { age: 0, aging: 0, gathered: 0, spent: 0, rally: null });
let result = null, bell = 0, limit = D.bell; // seconds played, and when the bell rings
const things = FK.things, units = FK.units;
const yieldOf = (t) => (t.kind === 'bld' ? (FK.has(t, 'Field') && t.done >= 1 ? FK.SH[t.code].yield : null) : KIND[t.kind].yield);
const rateOf = (t) => (t.kind === 'bld' ? FK.ref(FK.SH[t.code].rate) : D.rate[t.kind]);
const alive = (t) => !t.gone && (t.kind === 'bld' || t.amount > 0); // gone: marked when it leaves the map (below)
const dist = (a, b) => Math.hypot(a.bx - b.bx, a.by - b.by);
const beside = (u, t) => (t.kind === 'bld' ? Math.abs(u.k % N - (t.i + t.n / 2)) <= t.n / 2 + 1 && Math.abs(Math.floor(u.k / N) - (t.j + t.n / 2)) <= t.n / 2 + 1 : FK.nextTo(t.k)(u.k));
const sumCost = (c) => Object.values(c || {}).reduce((a, b) => a + b, 0);
// paying: a side pays all of a cost or none of it (SB Cost)
const canPay = (side, cost) => YIELDS.every((y) => (SIDES[side].store[y] || 0) >= (cost[y] || 0));
const pay = (side, cost, sign = 1) => { for (const y in cost) SIDES[side].store[y] -= sign * cost[y]; if (sign > 0) SIDES[side].spent += sumCost(cost); };
const popOf = (side) => units().filter((u) => u.side === side).length + things().filter((t) => t.kind === 'bld' && t.side === side).reduce((n, t) => n + (t.q ? t.q.length : 0), 0);
const popCap = (side) => Math.min(D.popMax, things().filter((t) => t.kind === 'bld' && t.side === side && t.done >= 1).reduce((n, t) => n + (D.pop[t.code] || 0), 0));
const villagersOf = (side) => units().filter((u) => u.side === side && FK.has(u, 'Gather'));
// a site: a building paid for and placed at done 0; villagers raise it. canPlace mirrors build's rule without building
const canPlace = (code, i, j) => { const n = B[code][1]; if (i < 0 || j < 0 || i + n > N || j + n > N) return false; for (let y = j; y < j + n; y++) for (let x = i; x < i + n; x++) if (!FK.free(y * N + x) || H[y * N + x] !== H[j * N + i]) return false; return true; };
function plan(side, code, i, j) { const cost = D.cost[code] || {}; if (!canPay(side, cost) || !canPlace(code, i, j)) return null; const t = FK.build(code, i, j, SIDES[side].col); if (!t) return null; pay(side, cost); t.done = 0; t.crew = 0; return t; }
function cancel(t) { if (t.done < 1) pay(t.side, D.cost[t.code] || {}, -1); FK.unbuild(t); }
// training: a queue at the building; the head trains; a new unit stands on a free tile beside and takes the side's rally job
function queue(b, code) { if (b.done < 1 || !(D.trains[b.code] || []).includes(code)) return false; const cost = D.cost[code]; if (!canPay(b.side, cost) || popOf(b.side) >= popCap(b.side)) return false; pay(b.side, cost); (b.q = b.q || []).push(code); if (b.q.length === 1) b.qt = D.train[code]; return true; }
function unqueue(b) { if (!b.q || !b.q.length) return; const code = b.q.pop(); pay(b.side, D.cost[code], -1); if (!b.q.length) b.qt = 0; }
function spawnBy(b, code) { const got = []; for (let y = b.j - 1; y <= b.j + b.n; y++) for (let x = b.i - 1; x <= b.i + b.n; x++) { const k = y * N + x; if (x >= 0 && y >= 0 && x < N && y < N && FK.walkable(k)) got.push(k); } if (!got.length) return null; return FK.spawn(code, b.side, got[Math.floor(FK.rng() * got.length)], FK.rng); }
// the age: paid, then a wait at the Town Center (D129)
const ageCost = (side) => { const n = SIDES[side].age + 1; return n >= D.ages.length ? null : { food: D.age.food * n, gold: D.age.gold * (n - 1) }; };
function ageUp(side) { const s = SIDES[side], c = ageCost(side); if (!c || s.aging || !canPay(side, c)) return false; pay(side, c); s.aging = D.age.time; return true; }
// the jobs (SM Gather): a villager's job is the yield it works; counts are read, not kept
const jobOf = (u) => (u.target && (u.job === 'gather' || u.job === 'carry' || (u.job === 'walk' && (u.then === 'gather' || u.then === 'carry'))) ? u.carry || yieldOf(u.target) : u.job === 'build' || (u.job === 'walk' && u.then === 'build') ? 'build' : null);
const jobs = (side) => { const n = { food: 0, wood: 0, gold: 0, stone: 0, iron: 0, build: 0, idle: 0 }; for (const u of villagersOf(side)) { const j = jobOf(u); if (j) n[j]++; else if (u.job === 'idle' || u.job === 'wait') n.idle++; } return n; };
const findsOf = (y) => things().filter((t) => yieldOf(t) === y && alive(t) && (t.kind !== 'bld' || t.side >= 0));
// QW: the find of a yield that keeps the round trip shortest: nearest the drop-off among those within D89 of the villager, else nearest the villager
function bestFind(u, y, from) { let best = null; for (const t of findsOf(y)) { if ((t.kind === 'bld' && t.side !== u.side) || bell - (t.noPath || -1e9) < D.noPath) continue; const d = dist(u, t); if (from && d > D.next) continue; const c = from ? dist(from, t) : d; if (!best || c < best[1]) best = [t, c]; } return best && best[0]; }
function gatherAt(u, t) { u.tool = null; if (u.load && u.carry !== yieldOf(t)) { u.target = t; carry(u); return; } u.target = t; u.carry = yieldOf(t); if (beside(u, t)) { u.job = 'gather'; return; } u.job = 'walk'; u.then = 'gather'; if (!(t.kind === 'bld' ? FK.goBy(u, t) : FK.goBeside(u, t.k))) { t.noPath = bell; const n = bestFind(u, u.carry, FK.dropFor(u, u.carry)) || bestFind(u, u.carry); if (n) gatherAt(u, n); else idle(u); } } // a find no path reaches is left alone a while (D137)
function carry(u) { u.tool = null; const b = FK.dropFor(u, u.carry); if (!b) { u.job = 'wait'; u.wait = 2; return; } if (beside(u, b)) { u.job = 'carry'; return; } u.job = 'walk'; u.then = 'carry'; if (!FK.goBy(u, b)) { u.job = 'wait'; u.wait = 2; } }
function buildAt(u, t) { u.tool = null; u.target = t; if (beside(u, t)) { u.job = 'build'; return; } u.job = 'walk'; u.then = 'build'; if (!FK.goBy(u, t)) u.job = 'idle'; }
function idle(u) { u.job = 'idle'; u.then = null; u.tool = null; u.target = null; u.path = null; }
// assign: + sends the nearest idle villager (else one from the fullest other job) to the yield's best find; − sets one of the job's villagers idle
function assign(side, y, n) { const vs = villagersOf(side);
  if (n < 0) { const u = vs.find((v) => jobOf(v) === y); if (!u) return false; if (u.load) carry(u); else idle(u); return true; }
  let u = vs.find((v) => v.job === 'idle' || v.job === 'wait'); if (!u) { const c = jobs(side); let top = null; for (const j in c) if (j !== y && j !== 'idle' && j !== 'build' && (!top || c[j] > c[top])) top = j; u = top && c[top] > 0 ? vs.find((v) => jobOf(v) === top) : null; } if (!u) return false;
  const b = FK.dropFor(u, y), t = bestFind(u, y, b) || bestFind(u, y); if (!t) return false; gatherAt(u, t); return true; }
// the tick: training, ages, upkeep, the villagers, the bell
FK.on('tick', (dt) => {
  if (result) return; bell += dt;
  for (const s of SIDES) if (s.aging) { s.aging -= dt; if (s.aging <= 0) { s.aging = 0; s.age++; if (s === SIDES[0]) FK.fire('event', 'age', null); } }
  for (const t of things()) if (t.kind === 'bld' && t.q && t.q.length && t.done >= 1) { t.qt -= dt; if (t.qt <= 0) { const code = t.q[0], u = spawnBy(t, code); if (!u) continue; t.q.shift(); if (u && t.side === 0) FK.fire('event', FK.has(u, 'Gather') ? 'trained' : 'trainedSol', u); const r = SIDES[t.side].rally; if (u && FK.has(u, 'Gather') && r) { const f = bestFind(u, r, FK.dropFor(u, r)) || bestFind(u, r); if (f) gatherAt(u, f); } if (t.q.length) t.qt = D.train[t.q[0]]; } }
  for (const side of D.players) { const s = SIDES[side]; s.store.food = Math.max(0, s.store.food - units().filter((u) => u.side === side).length * D.upkeep / D.day * dt); }
  for (const t of things()) if (t.kind === 'bld') t.crew = 0;
  for (const u of units()) { if (!FK.has(u, 'Gather') || u.path) continue; const t = u.target;
    if (u.job === 'gather') { if (!t || !alive(t)) { const n = t && bestFind(u, u.carry, FK.dropFor(u, u.carry)); if (n) gatherAt(u, n); else if (u.load) carry(u); else idle(u); continue; } if (!beside(u, t)) { gatherAt(u, t); continue; }
      u.tool = t.kind === 'bld' ? 1 : { tree: 0, bush: 1 }[t.kind] ?? 2; u.face = t.bx < u.bx ? -1 : 1; const beat = Math.floor(u.t / D.beat); if (beat !== u.beat && beat % 2 === 0) FK.fire('event', 'work', t, u); u.beat = beat; const n = Math.min(rateOf(t) * dt, t.kind === 'bld' ? 1e9 : t.amount, D.carry - u.load); u.load += n; if (t.kind !== 'bld') FK.take(t, n); if (u.load >= D.carry - 1e-6) carry(u); }
    else if (u.job === 'carry') { const b = FK.dropFor(u, u.carry); if (!b || !beside(u, b)) { carry(u); continue; } SIDES[u.side].store[u.carry] += u.load; SIDES[u.side].gathered += u.load; u.load = 0; if (u.side === 0) FK.fire('event', 'drop.' + u.carry, b);
      const next = bestFind(u, u.carry, b), cur = t && alive(t) ? t : null; const go = cur && next && next !== cur && dist(b, next) < dist(b, cur) * (1 - D.moveOn) ? next : cur || next; if (go) gatherAt(u, go); else idle(u); }
    else if (u.job === 'build' || u.job === 'repair') { if (!t || !alive(t) || (t.done >= 1 && t.hp >= t.hpMax)) { let site = null; FK.bldsNear(u.bx, u.by, D.next, (q) => q.side === u.side && q.done < 1 && dist(u, q) < D.next && (site = q)); if (site) buildAt(u, site); else idle(u); continue; } if (!beside(u, t)) { buildAt(u, t); continue; }
      u.tool = 2; u.face = t.bx < u.bx ? -1 : 1; t.crew++; const share = Math.pow(t.crew, D.crew) / t.crew, time = D.buildTime[t.code] || 30; const beat = Math.floor(u.t / D.beat); if (beat !== u.beat && beat % 2 === 0) FK.fire('event', 'raise', t, u); u.beat = beat; if (t.done < 1) { t.done = Math.min(1, t.done + share * dt / time); if (t.done >= 1 && t.side === 0) FK.fire('event', D.trains[t.code] && D.trains[t.code].some((c) => !FK.SH[c].ticks.includes('Gather')) ? 'builtWar' : 'built', t); if (t.hp != null) t.hp = Math.min(t.hpMax, t.hp + t.hpMax * share * dt / time); } else t.hp = Math.min(t.hpMax, t.hp + t.hpMax * share * dt / time); }
    else if (u.job === 'wait') { u.wait -= dt; if (u.wait <= 0) { if (u.load) carry(u); else idle(u); } }
    else if (u.job === 'idle' && u.load) carry(u);
  }
  if (bell >= limit) { const sc = D.players.map((p) => [score(p).total, p]).sort((a, b) => b[0] - a[0]); result = { winner: sc[0][1], how: 'bell' }; FK.fire('event', result.winner === 0 ? 'win' : 'lose', null); }
});
FK.on('gone', (t) => { t.gone = true; });
FK.on('gone', (t) => { if (result || !FK.has(t, 'Seat') || !D.players.includes(t.side)) return; if (!things().some((q) => FK.has(q, 'Seat') && q.side === t.side)) { result = { winner: D.players.find((p) => p !== t.side), how: 'conquest' }; FK.fire('event', result.winner === 0 ? 'win' : 'lose', null); } });
FK.on('start', () => { result = null; bell = 0; for (const s of SIDES) Object.assign(s, { age: 0, aging: 0, gathered: 0, spent: 0, rally: null, store: { ...D.start } }); }); // a new game: the book's stores (D172); the bell stays as Start set it
// the score (QBR): what a side holds, cost ÷ D135, and everything it gathered ÷ D135
function score(side) { const s = { people: 0, army: 0, tech: ageSpent(side) / D.score.tech, bld: 0, wealth: SIDES[side].gathered / D.score.wealth };
  for (const u of units()) if (u.side === side) s[FK.has(u, 'Gather') || !FK.has(u, 'Fight') ? 'people' : 'army'] += sumCost(D.cost[u.code]) / D.score.unit;
  for (const t of things()) if (t.kind === 'bld' && t.side === side && t.done >= 1) s.bld += sumCost(D.cost[t.code]) / D.score.bld;
  s.total = Math.floor(s.people + s.army + s.tech + s.bld + s.wealth); return s; }
const ageSpent = (side) => { let n = 0; for (let a = 1; a <= SIDES[side].age; a++) n += D.age.food * a + D.age.gold * (a - 1); return n; };
return { setBell: (s) => { limit = s; }, bell: () => limit, plan, cancel, canPlace, canPay, pay, queue, unqueue, ageUp, ageCost, assign, jobs, jobOf, popOf, popCap, villagersOf, gatherAt, buildAt, carry, idle, bestFind, yieldOf, score, time: () => bell, result: () => result, YIELDS };
})();
