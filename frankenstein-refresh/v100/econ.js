'use strict';
// E213
window.ECON = (() => {
const { D, B, U, KIND, SIDES, OCC, H, N } = FK;
// E170
const YIELDS = ['food', 'wood', 'gold', 'stone', 'iron'];
const fresh = () => ({ age: 0, aging: 0, gathered: 0, rally: null, flow: {}, rate: {}, spent1: {}, orate: {}, flowBy: {}, rateBy: {}, spentBy: {}, orateBy: {}, ledger: { in: {}, out: {} } }); // E267
for (const s of SIDES) Object.assign(s, fresh());
let result = null, bell = 0, limit = D.bell; // E214
const things = FK.things, units = FK.units;
const yieldOf = (t) => (t.kind === 'bld' ? (FK.has(t, 'Field') && t.done >= 1 ? FK.SH[t.code].yield : null) : KIND[t.kind].yield);
const rateOf = (t) => (t.kind === 'bld' ? FK.ref(FK.SH[t.code].rate) : D.rate[t.kind]);
const alive = (t) => !t.gone && (t.kind === 'bld' || t.amount > 0); // E215
const dist = (a, b) => Math.hypot(a.bx - b.bx, a.by - b.by);
const beside = (u, t) => (t.kind === 'bld' ? Math.abs(u.k % N - (t.i + t.n / 2)) <= t.n / 2 + 1 && Math.abs(Math.floor(u.k / N) - (t.j + t.n / 2)) <= t.n / 2 + 1 : FK.nextTo(t.k)(u.k));
const sumCost = (c) => Object.values(c || {}).reduce((a, b) => a + b, 0);
// E216
const canPay = (side, cost) => YIELDS.every((y) => SIDES[side].store[y] >= (cost[y] || 0));
// E268
const add = (o, k, n) => (o[k] = (o[k] || 0) + n), by = (o, y) => o[y] || (o[y] = {});
const addRes = (a, c, f = 1) => { for (const y in c || {}) add(a, y, c[y] * f); return a; };
function earn(side, y, n, why, counts = true) { if (!(n > 0)) return; const s = SIDES[side]; s.store[y] += n; if (counts) s.gathered += n; add(s.flow, y, n); add(s.ledger.in, why, n); add(by(s.flowBy, y), why, n); }
function spend(side, y, n, why) { if (!(n > 0)) return; const s = SIDES[side]; s.store[y] -= n; add(s.spent1, y, n); add(s.ledger.out, why, n); add(by(s.spentBy, y), why, n); }
const pay = (side, cost, why) => { for (const y in cost) spend(side, y, cost[y], why); };
function payBack(side, cost, why) { const s = SIDES[side]; for (const y in cost) if (cost[y] > 0) { s.store[y] += cost[y]; s.spent1[y] = Math.max(0, add(s.spent1, y, -cost[y])); s.ledger.out[why] = Math.max(0, add(s.ledger.out, why, -cost[y])); } } // E269
// E270
const [MINUTE] = D.minute, F = D.flow;
const flowOf = (side, y, last, now) => (Object.keys(SIDES[side].rate).length ? last[y] || 0 : ((now[y] || 0) * MINUTE) / Math.max(F.least, FK.K.t % MINUTE));
const outOf = (side, y) => flowOf(side, y, SIDES[side].orate, SIDES[side].spent1);
const netOf = (side, y) => flowOf(side, y, SIDES[side].rate, SIDES[side].flow) - outOf(side, y);
const velOf = (side, y) => { const net = netOf(side, y); return net < -F.half && SIDES[side].store[y] < -net * F.short ? -1 : Math.tanh(net / F.ref); };
FK.on('tick', () => { if (FK.every(D.minute)) for (const s of SIDES) Object.assign(s, { rate: s.flow, flow: {}, orate: s.spent1, spent1: {}, rateBy: s.flowBy, flowBy: {}, orateBy: s.spentBy, spentBy: {} }); }); // E271
const popOf = (side) => units().filter((u) => u.side === side).length + things().filter((t) => t.kind === 'bld' && t.side === side).reduce((n, t) => n + (t.q ? t.q.length : 0), 0);
const popCap = (side) => Math.min(D.popMax, things().filter((t) => t.kind === 'bld' && t.side === side && t.done >= 1).reduce((n, t) => n + (D.pop[t.code] || 0), 0));
const villagersOf = (side) => units().filter((u) => u.side === side && FK.has(u, 'Gather'));
// E217
const canPlace = (code, i, j) => { const n = B[code][1]; if (i < 0 || j < 0 || i + n > N || j + n > N) return false; for (let y = j; y < j + n; y++) for (let x = i; x < i + n; x++) if (!FK.free(y * N + x) || H[y * N + x] !== H[j * N + i]) return false; return true; };
function plan(side, code, i, j) { const cost = D.cost[code] || {}; if (!canPay(side, cost) || !canPlace(code, i, j)) return null; const t = FK.build(code, i, j, SIDES[side].col); if (!t) return null; pay(side, cost, 'buildings'); t.done = 0; t.crew = 0; return t; }
function cancel(t) { if (t.done < 1) payBack(t.side, D.cost[t.code] || {}, 'buildings'); FK.unbuild(t); }
// E218
function queue(b, code) { if (b.done < 1 || !(D.trains[b.code] || []).includes(code)) return false; const cost = D.cost[code]; if (!canPay(b.side, cost) || popOf(b.side) >= popCap(b.side)) return false; pay(b.side, cost, 'units'); (b.q = b.q || []).push(code); if (b.q.length === 1) b.qt = D.train[code]; return true; }
function unqueue(b) { if (!b.q || !b.q.length) return; const code = b.q.pop(); payBack(b.side, D.cost[code], 'units'); if (!b.q.length) b.qt = 0; }
function spawnBy(b, code) { const got = []; for (let y = b.j - 1; y <= b.j + b.n; y++) for (let x = b.i - 1; x <= b.i + b.n; x++) { const k = y * N + x; if (x >= 0 && y >= 0 && x < N && y < N && FK.walkable(k)) got.push(k); } if (!got.length) return null; return FK.spawn(code, b.side, got[Math.floor(FK.rng() * got.length)], FK.rng); }
// E219
const ageCost = (side) => { const n = SIDES[side].age + 1; return n >= D.ages.length ? null : { food: D.age.food * n, gold: D.age.gold * (n - 1) }; };
function ageUp(side) { const s = SIDES[side], c = ageCost(side); if (!c || s.aging || !canPay(side, c)) return false; pay(side, c, 'research'); s.aging = D.age.time; return true; }
// E220
const jobOf = (u) => (u.target && (u.job === 'gather' || u.job === 'carry' || (u.job === 'walk' && (u.then === 'gather' || u.then === 'carry'))) ? u.carry || yieldOf(u.target) : u.job === 'build' || (u.job === 'walk' && u.then === 'build') ? 'build' : null);
const jobs = (side) => { const n = { food: 0, wood: 0, gold: 0, stone: 0, iron: 0, build: 0, idle: 0 }; for (const u of villagersOf(side)) { const j = jobOf(u); if (j) n[j]++; else if (u.job === 'idle' || u.job === 'wait') n.idle++; } return n; };
const findsOf = (y) => things().filter((t) => yieldOf(t) === y && alive(t) && (t.kind !== 'bld' || t.side >= 0));
// E221
function bestFind(u, y, from) { let best = null; for (const t of findsOf(y)) { if ((t.kind === 'bld' && t.side !== u.side) || bell - (t.noPath || -1e9) < D.noPath) continue; const d = dist(u, t); if (from && d > D.next) continue; const c = from ? dist(from, t) : d; if (!best || c < best[1]) best = [t, c]; } return best && best[0]; }
function gatherAt(u, t) { u.tool = null; if (u.load && u.carry !== yieldOf(t)) { u.target = t; carry(u); return; } u.target = t; u.carry = yieldOf(t); if (beside(u, t)) { u.job = 'gather'; return; } u.job = 'walk'; u.then = 'gather'; if (!(t.kind === 'bld' ? FK.goBy(u, t) : FK.goBeside(u, t.k))) { t.noPath = bell; const n = bestFind(u, u.carry, FK.dropFor(u, u.carry)) || bestFind(u, u.carry); if (n) gatherAt(u, n); else idle(u); } } // E222
function carry(u) { u.tool = null; const b = FK.dropFor(u, u.carry); if (!b) { u.job = 'wait'; u.wait = 2; return; } if (beside(u, b)) { u.job = 'carry'; return; } u.job = 'walk'; u.then = 'carry'; if (!FK.goBy(u, b)) { u.job = 'wait'; u.wait = 2; } }
function buildAt(u, t) { u.tool = null; u.target = t; if (beside(u, t)) { u.job = 'build'; return; } u.job = 'walk'; u.then = 'build'; if (!FK.goBy(u, t)) u.job = 'idle'; }
function idle(u) { u.job = 'idle'; u.then = null; u.tool = null; u.target = null; u.path = null; }
// E223
function assign(side, y, n) { const vs = villagersOf(side);
  if (n < 0) { const u = vs.find((v) => jobOf(v) === y); if (!u) return false; if (u.load) carry(u); else idle(u); return true; }
  let u = vs.find((v) => v.job === 'idle' || v.job === 'wait'); if (!u) { const c = jobs(side); let top = null; for (const j in c) if (j !== y && j !== 'idle' && j !== 'build' && (!top || c[j] > c[top])) top = j; u = top && c[top] > 0 ? vs.find((v) => jobOf(v) === top) : null; } if (!u) return false;
  const b = FK.dropFor(u, y), t = bestFind(u, y, b) || bestFind(u, y); if (!t) return false; gatherAt(u, t); return true; }
// E224
FK.on('tick', (dt) => {
  if (result) return; bell += dt;
  for (const s of SIDES) if (s.aging) { s.aging -= dt; if (s.aging <= 0) { s.aging = 0; s.age++; if (s === SIDES[0]) FK.fire('event', 'age', null); } }
  for (const t of things()) if (t.kind === 'bld' && t.q && t.q.length && t.done >= 1) { t.qt -= dt; if (t.qt <= 0) { const code = t.q[0], u = spawnBy(t, code); if (!u) continue; t.q.shift(); if (u && t.side === 0) FK.fire('event', FK.has(u, 'Gather') ? 'trained' : 'trainedSol', u); const r = SIDES[t.side].rally; if (u && FK.has(u, 'Gather') && r) { const f = bestFind(u, r, FK.dropFor(u, r)) || bestFind(u, r); if (f) gatherAt(u, f); } if (t.q.length) t.qt = D.train[t.q[0]]; } }
  for (const side of D.players) spend(side, 'food', Math.min(SIDES[side].store.food, units().filter((u) => u.side === side).length * D.upkeep / D.day * dt), 'upkeep');
  for (const t of things()) if (t.kind === 'bld') t.crew = 0;
  for (const u of units()) { if (!FK.has(u, 'Gather') || u.path) continue; const t = u.target;
    if (u.job === 'gather') { if (!t || !alive(t)) { const n = t && bestFind(u, u.carry, FK.dropFor(u, u.carry)); if (n) gatherAt(u, n); else if (u.load) carry(u); else idle(u); continue; } if (!beside(u, t)) { gatherAt(u, t); continue; }
      u.tool = t.kind === 'bld' ? 1 : { tree: 0, bush: 1 }[t.kind] ?? 2; u.face = t.bx < u.bx ? -1 : 1; const beat = Math.floor(u.t / D.beat); if (beat !== u.beat && beat % 2 === 0) FK.fire('event', 'work', t, u); u.beat = beat; const n = Math.min(rateOf(t) * dt, t.kind === 'bld' ? 1e9 : t.amount, D.carry - u.load); u.load += n; if (t.kind !== 'bld') FK.take(t, n); if (u.load >= D.carry - 1e-6) carry(u); }
    else if (u.job === 'carry') { const b = FK.dropFor(u, u.carry); if (!b || !beside(u, b)) { carry(u); continue; } earn(u.side, u.carry, u.load, 'gather'); u.load = 0; if (u.side === 0) FK.fire('event', 'drop.' + u.carry, b);
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
FK.on('start', () => { result = null; bell = 0; for (const s of SIDES) Object.assign(s, fresh(), { store: { ...D.start } }); }); // E225
// E226
function score(side) { const s = { people: 0, army: 0, tech: ageSpent(side) / D.score.tech, bld: 0, wealth: SIDES[side].gathered / D.score.wealth };
  for (const u of units()) if (u.side === side) s[FK.has(u, 'Gather') || !FK.has(u, 'Fight') ? 'people' : 'army'] += sumCost(D.cost[u.code]) / D.score.unit;
  for (const t of things()) if (t.kind === 'bld' && t.side === side && t.done >= 1) s.bld += sumCost(D.cost[t.code]) / D.score.bld;
  s.total = Math.floor(s.people + s.army + s.tech + s.bld + s.wealth); return s; }
const ageSpent = (side) => { let n = 0; for (let a = 1; a <= SIDES[side].age; a++) n += D.age.food * a + D.age.gold * (a - 1); return n; };
return { setBell: (s) => { limit = s; }, bell: () => limit, plan, cancel, canPlace, canPay, pay, payBack, earn, spend, addRes, sumCost, flowOf, outOf, netOf, velOf, queue, unqueue, ageUp, ageCost, assign, jobs, jobOf, popOf, popCap, villagersOf, gatherAt, buildAt, carry, idle, bestFind, yieldOf, score, time: () => bell, result: () => result, YIELDS };
})();
