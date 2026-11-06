'use strict';
// E213
window.ECON = (() => {
const { D, B, U, KIND, SIDES, OCC, H, N } = FK;
// E170
const YIELDS = ['food', 'wood', 'gold', 'stone', 'iron'];
// E290
const T = BOOKS.tech, TK = Object.fromEntries(Object.entries(T).map(([c, e]) => [e.key, c]));
const fresh = () => ({ age: 0, aging: 0, techs: new Set(), gathered: 0, rally: null, flow: {}, rate: {}, spent1: {}, orate: {}, flowBy: {}, rateBy: {}, spentBy: {}, orateBy: {}, ledger: { in: {}, out: {} }, intel: {}, zealT: null }); // E267
for (const s of SIDES) Object.assign(s, fresh());
let result = null, bell = 0, limit = D.bell, turned, harvest; // E214
const things = FK.things, units = FK.units;
const yieldOf = (t) => (t.kind === 'bld' ? (FK.has(t, 'Field') && up(t) ? FK.SH[t.code].yield : null) : KIND[t.kind].yield);
const rateOf = (t, side) => { const r = FK.stat(t.code || KIND[t.kind].code, side, 'rate'); return FK.has(t, 'Flock') ? r * t.sheep : FK.has(t, 'Soil') ? r * D.seasons.farm[FK.season()] * harvest.m * t.fert : r; }; // E291
const alive = (t) => !t.gone && (t.kind === 'bld' || t.amount > 0), up = (t) => t.done >= 1; // E215
const dist = (a, b) => Math.hypot(a.bx - b.bx, a.by - b.by);
const beside = (u, t) => (t.kind === 'bld' ? FK.atB(u, t) : !!u.spot && u.spot.c === t && dist(u, t) <= FK.ring(t).r + FK.SP);
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
const popOf = (side, ok = (c) => FK.SH[c]) => units().filter((u) => u.side === side && ok(u.code)).length + things().filter((t) => t.kind === 'bld' && t.side === side).reduce((n, t) => n + (t.q || []).flatMap((c) => (c.plan ? Object.entries(c.plan).flatMap(([k, v]) => Array(v).fill(k)) : [c])).filter(ok).length, 0);
const soldier = (c) => FK.SH[c] && FK.SH[c].class, armyRoom = (side) => D.armyMax + ~~SIDES[side].capA, armyFull = (side) => popOf(side, soldier) >= armyRoom(side); // E371
const popCap = (side) => Math.min(D.popMax, things().filter((t) => t.kind === 'bld' && t.side === side && up(t)).reduce((n, t) => n + (FK.stat(t.code, side, 'room') || 0), 0));
const villagersOf = (side) => units().filter((u) => u.side === side && FK.has(u, 'Gather'));
// E217
const P = D.place, [ME] = D.players, at = (k) => [k % N, (k - (k % N)) / N], is = (c, tick) => FK.has({ code: c }, tick), wallish = (t) => FK.has(t, 'Line') || FK.has(t, 'Gate'), wallAt = (k) => things().find((t) => t.kind === 'bld' && FK.has(t, 'Line') && t.j * N + t.i === k);
const many = (side, c) => things().filter((t) => t.kind === 'bld' && t.side === side && t.code === c && t !== FK.seatOf(side)).length;
function capWhy(side, c) { const cp = Object.values(FK.stat(c, side, 'limit') || {}), age = SIDES[side].age, n = cp[age] ?? cp.at(-1); // E313
  if (D.bldAge[c] > age) return 'A later age allows it'; if (D.bldNeeds[c] && !things().some((t) => t.side === side && t.code === D.bldNeeds[c] && up(t))) return `Needs an ${FK.SH[D.bldNeeds[c]].name} standing`; if (cp.length && !n) return 'A later age allows it'; return !cp.length || many(side, c) < n ? '' : `At the limit of ${n}` + (cp[age + 1] > n ? '. A new age allows more' : ''); }
function placeWhy(side, c, i, j) { const [, n] = B[c], crop = is(c, 'Field'); let why = capWhy(side, c); // E314
  if (i < 0 || j < 0 || i + n > N || j + n > N) return 'Too close to the edge'; if (why) return why; if (is(c, 'Shore') && !FK.byLake(...FK.toBoard((i + n * P.half) * D.tile, (j + n * P.half) * D.tile), D.fish.shore)) return SAY.shore;
  for (let y = j; y < j + n; y++) for (let x = i; x < i + n; x++) { const k = y * N + x; if (is(c, 'Gate') && (wallAt(k) || {}).side === side) continue; if (OCC[k] || FK.FOR[k]) return 'Something is in the way'; if (!FK.free(k) || H[k] !== H[j * N + i]) return 'It needs flat, open ground'; }
  if (!wallish({ code: c })) FK.bldsNear(...FK.toBoard((i + n * P.half) * D.tile, (j + n * P.half) * D.tile), (n + P.near + P.lane) * D.tile, (b) => { const gap = Math.max(b.i - i - n, i - b.i - b.n, b.j - j - n, j - b.j - b.n); if (gap >= P.lane) return;
    const on = (s, v) => v >= s && v < s + b.n, touch = on(b.i, i - 1) || on(b.i, i + n) || on(b.j, j - 1) || on(b.j, j + n);
    why = !crop && !wallish(b) && !FK.has(b, 'Field') ? 'Leave a gap: two squares round each building' : touch && !wallish(b) && (D.trains[c] || D.trains[b.code]) ? 'Leave a lane around buildings that train people' : ''; return !!why; });
  const off = (v, lo, hi) => Math.max(lo - v - P.half, v + P.half - hi, 0); // E315
  for (let y = j - P.lane; y < j + n + P.lane && !why; y++) for (let x = i - P.lane; x < i + n + P.lane; x++) if (OCC[y * N + x] === 1 && Math.hypot(off(x, i, i + n), off(y, j, j + n)) < P.lane) return 'Leave two squares from trees and rocks';
  return why || (FK.reached(side, { i, j, n }, ...FK.toBoard((i + n * P.half) * D.tile, (j + n * P.half) * D.tile)) ? '' : SAY.reach); }
const canPlace = (code, i, j, side = ME) => !placeWhy(side, code, i, j);
const around = [...new Set(D.ways.flat())].sort((a, b) => a - b);
function snap(side, c, i, j, tol) { const [, n] = B[c]; let best = [i, j], bd = tol; if (wallish({ code: c })) return best; // E316
  const take = (x, y) => { const d = Math.hypot(x - i, y - j); if (d < bd && canPlace(c, x, y, side)) [best, bd] = [[x, y], d]; };
  for (const b of things()) if (b.kind === 'bld' && b.side === side && !wallish(b)) { const h = (b.n - n) * P.half, ci = b.i + h, cj = b.j + h, R = (b.n + n) * P.half + tol + P.near;
    if (Math.abs(ci - i) <= R && Math.abs(cj - j) <= R) for (const g of P.gaps) { for (const x of [b.i - n - g, b.i + b.n + g]) for (const y of [Math.round(cj), b.j, b.j + b.n - n, j]) take(x, y); for (const y of [b.j - n - g, b.j + b.n + g]) for (const x of [Math.round(ci), b.i, b.i + b.n - n, i]) take(x, y); }
    if (Number.isInteger(h) && Math.abs(ci - i) < P.guide && Math.abs(cj - j) < P.guide) { for (const d of around) take(ci, j + d); for (const d of around) take(i + d, cj); } }
  return best; }
function plan(side, code, i, j) { const cost = D.cost[code] || {}; if (!canPay(side, cost) || placeWhy(side, code, i, j)) return null; if (is(code, 'Gate') && wallAt(j * N + i)) FK.unbuild(wallAt(j * N + i)); const t = FK.build(code, i, j, SIDES[side].col); if (!t) return null; pay(side, cost, 'buildings'); t.done = t.crew = 0; if (FK.SH[code].amount) t.amount = t.max = FK.ref(FK.SH[code].amount); if (is(code, 'Flock')) t.sheep = D.flock.start; if (is(code, 'Soil')) t.fert = D.soil.full; const M = FK.stat(code, side, 'hp'); if (M) { t.hpMax = M; t.hp = M * D.rising.start; } return t; }
const refund = (t) => Object.fromEntries(Object.entries(D.cost[t.code] || {}).map(([y, n]) => [y, Math.floor(n * (t.done < D.refund.first ? D.refund.early : D.refund.share))])); // E317
function cancel(t) { while (t.q && t.q.length) unqueue(t); payBack(t.side, refund(t), 'buildings'); FK.unbuild(t); }
const repairCost = (t) => Object.fromEntries(Object.entries(D.cost[t.code] || {}).map(([y, n]) => [y, Math.ceil((n * D.repair.cost * (t.hpMax - t.hp)) / t.hpMax)]));
// E318
const wallLine = (a, b) => { const [ai, aj] = at(a), [bi, bj] = at(b), n = Math.max(Math.abs(bi - ai), Math.abs(bj - aj)), out = [a]; let [pi, pj] = [ai, aj];
  for (let s = 0; s++ < n; ) { const i = ai + Math.round(((bi - ai) * s) / n), j = aj + Math.round(((bj - aj) * s) / n); if (i !== pi && j !== pj) out.push(pj * N + i); out.push(j * N + i); [pi, pj] = [i, j]; } return out; };
function lay(side, c, cells) { const built = [], blocked = []; let broke = false; for (const k of cells) { if (!canPay(side, D.cost[c] || {})) { broke = true; break; } const t = plan(side, c, ...at(k)); if (t) { built.push(t); autoBuilder(side, t); } else blocked.push(k); } return { built: built.length, blocked: blocked.length, broke }; }
function sealPath(side, extra) { const h = FK.seatOf(side); if (!h) return null; const ks = [], ci = h.i + h.n * P.half, cj = h.j + h.n * P.half, from = Math.floor(cj) * N + Math.floor(ci), shut = OCC[from]; // E319
  for (let y = h.j; y < h.j + h.n; y++) for (let x = h.i; x < h.i + h.n; x++) ks.push(y * N + x); const add = extra.filter((k) => !OCC[k]), was = [...ks, ...add].map((k) => OCC[k]);
  ks.forEach((k) => (OCC[k] = 0)); add.forEach((k) => (OCC[k] = shut)); const p = FK.findPath(from, (k) => { const [x, y] = at(k); return Math.hypot(x - ci, y - cj) >= D.seal.reach; }, from);
  [...ks, ...add].forEach((k, n) => (OCC[k] = was[n])); return p || []; }
// E218
const timeOf = (side, c) => (c.plan ? c.t : T[c] ? FK.stat(c, side, 'time') : D.ages.includes(c) ? D.age.time[D.ages.indexOf(c)] : FK.stat(c, side, 'train')), nameOf = (c) => (c.plan ? fromBook('words').army.muster : T[c] ? T[c].name : FK.SH[c] ? FK.SH[c].name : c);
const priceOf = (side, c) => (c.plan ? c.paid : D.ages.includes(c) ? D.age.cost[D.ages.indexOf(c)] : FK.stat(c, side, 'cost')), room = (b) => (b.q || []).length < FK.stat(b.code, b.side, 'queue');
const order = (b, c) => { (b.q = b.q || []).push(c); if (b.q.length === 1) b.qt = timeOf(b.side, c); };
function queue(b, code) { if (!up(b) || !FK.trains(b.code).includes(code) || !FK.aged(code, b.side) || !room(b)) return false; const cost = priceOf(b.side, code); if (!canPay(b.side, cost) || popOf(b.side) >= popCap(b.side) || (soldier(code) && armyFull(b.side))) return false; pay(b.side, cost, 'units'); order(b, code); return true; }
function unqueue(b) { if (!b.q || !b.q.length) return; const code = b.q.pop(); payBack(b.side, priceOf(b.side, code), FK.SH[code] || code.plan ? 'units' : 'research'); if (D.ages.includes(code)) SIDES[b.side].aging = 0; if (!b.q.length) b.qt = 0; }
function spawnBy(b, code) { const s = FK.spotFor(b, b); if (!s) return null; const u = FK.spawn(code, b.side, FK.tileAt(s.x, s.y), FK.rng); u.bx = s.x; u.by = s.y; u.hb = b; FK.place(u); const fl = SIDES[b.side].flag; if (fl != null && WAR.armed(u)) WAR.march(u, fl); return u; } // E311
// E402
const musterN = sumCost, readyAt = (side, c) => things().filter((t) => t.side === side && up(t) && FK.trains(t.code).includes(c)).length;
function musterCost(side, plan) { const cost = {}, ks = Object.keys(plan); for (const c of ks) addRes(cost, priceOf(side, c), plan[c] * D.muster.cost); return { cost, t: Math.ceil(Math.max(...ks.map((c) => (plan[c] * timeOf(side, c)) / readyAt(side, c))) * D.muster.time) }; }
const council = (side) => lines(side, (t) => FK.has(t, 'Squad'));
function musterWhy(side, plan) { const n = musterN(plan); return !WAR.knows(side, 'muster') ? 'tech' : !n ? 'none' : !council(side) ? 'at' : Object.keys(plan).some((c) => !FK.aged(c, side) || !readyAt(side, c)) ? 'kind' : popOf(side, soldier) + n > armyRoom(side) ? 'army' : popOf(side) + n > popCap(side) ? 'room' : !canPay(side, musterCost(side, plan).cost) ? 'cost' : ''; }
function mustered(b, job) { for (const c in job.plan) for (let i = job.plan[c]; i--; ) { const u = spawnBy(b, c); if (u) u.bn = job.bn; } if (b.side === ME) FK.fire('event', 'mustered', b, job.bn != null ? fromBook('words').army.squads[job.bn] : fromBook('words').army.all); }
function muster(side, plan, bn) { if (musterWhy(side, plan)) return false; const { cost, t } = musterCost(side, plan); pay(side, cost, 'units'); order(council(side), { plan, bn, t, paid: cost }); return true; }
// E219
const nextAge = (side) => { const n = SIDES[side].age + 1; return n < D.ages.length && n !== D.age.hidden ? n : null; }, ageCost = (side) => D.age.cost[nextAge(side)] || null;
function ageUp(side) { const s = SIDES[side], n = nextAge(side), h = FK.seatOf(side); if (!n || s.aging || !h || !room(h) || !canPay(side, D.age.cost[n])) return false; pay(side, D.age.cost[n], 'research'); order(h, D.ages[n]); s.aging = timeOf(side, D.ages[n]); return true; }
const rise = (side) => { const s = SIDES[side]; s.aging = 0; s.age++; if (side === ME) FK.fire('event', 'age', null); };
// E292
const lineOf = (c) => Object.keys(T).filter((x) => T[x].value.at === T[c].value.at && T[x].value.line === T[c].value.line);
const prevOf = (c) => { const L = lineOf(c); return L[L.indexOf(c) - 1] || null; };
const needsOf = (c) => [...new Set([prevOf(c), ...(T[c].value.need || []).map((k) => TK[k] || k)].filter(Boolean))];
const nextStep = (side, c) => lineOf(c).find((x) => !SIDES[side].techs.has(x)) || null;
// E293
const lines = (side, ok) => things().filter((t) => t.kind === 'bld' && t.side === side && up(t) && ok(t)).reduce((a, b) => (!a || (b.q || []).length < (a.q || []).length ? b : a), null); // E327
const labOf = (side, c) => lines(side, (t) => t.code === T[c].value.at), lineFor = (side, c) => lines(side, (t) => FK.trains(t.code).includes(c));
function researchWhy(side, c) { const s = SIDES[side], b = labOf(side, c);
  return s.techs.has(c) ? 'known' : T[c].value.age > s.age ? 'age' : needsOf(c).some((n) => !s.techs.has(n)) ? 'need' : things().some((t) => t.side === side && (t.q || []).includes(c)) ? 'busy' : !b ? 'at' : !room(b) ? 'full' : canPay(side, priceOf(side, c)) ? '' : 'cost'; }
function research(side, c) { if (researchWhy(side, c)) return false; const b = labOf(side, c); pay(side, priceOf(side, c), 'research'); order(b, c); return true; }
const learn = (side, c) => { SIDES[side].techs.add(c); FK.learn(side, c); };
// E220
const jobOf = (u) => (u.target && (u.job === 'gather' || u.job === 'carry' || (u.job === 'walk' && (u.then === 'gather' || u.then === 'carry'))) ? u.carry || yieldOf(u.target) : u.job === 'build' || (u.job === 'walk' && u.then === 'build') ? 'build' : null);
const jobs = (side) => { const n = Object.fromEntries([...YIELDS, 'build', 'idle'].map((k) => [k, 0])); for (const u of villagersOf(side)) { const j = jobOf(u); if (j) n[j]++; else if (u.job === 'idle' || u.job === 'wait') n.idle++; } return n; };
const findsOf = (y) => things().filter((t) => yieldOf(t) === y && alive(t) && (t.kind !== 'bld' || (SIDES[t.side] && !(t.amount <= 0))));
// E306
const FO = D.forage, SR = D.search, capOf = (t) => FO.cap[t.kind] ?? FK.ring(t).m;
const others = (u, t) => Math.max(0, ~~t.wk - (u.target === t)), full = (u, t) => others(u, t) >= capOf(t);
const span = (t) => (t.kind === 'bld' ? (t.n + 2) * D.tile * Math.SQRT1_2 : FK.ring(t).r + D.tile);
function forage(u, t, b, low) { // E307
  const s = t.kind !== 'bld' && FK.spotFor(u, t); if (!low && s === null) return 0;
  const c = FK.stat(u.code, u.side, 'carry'), v = FK.stat(u.code, u.side, 'spd') * D.upm, life = c * FO.life, g = rateOf(t, u.side) / (1 + others(u, t) / (FO.hold[t.kind] ?? FO.hold.other));
  const A = t.amount == null || (u.target === t && FO.cap[t.kind]) ? life : Math.min(Math.max(1, t.amount), life);
  const d = !b ? 0 : low ? Math.max(0, dist(t, b) - span(t) - span(b)) : t.way && t.way.b === b ? t.way.d : (t.way = { b, d: FK.wayLen(FK.tileAt(...(s ? [s.x, s.y] : [t.bx, t.by])), b) }).d;
  return c / (c / g + (2 * d) / v + (dist(u, t) * c) / (A * v));
}
const forageNow = (u) => jobOf(u) && jobOf(u) !== 'build' && alive(u.target) && forage(u, u.target, FK.dropFor(u, u.carry));
const searchR = (u) => (SR.from + SR.grow * Math.min(1, (bell - (u.lost?.t ?? bell)) / SR.tau)) * D.upm;
const inBox = (t, r) => t.bx >= r.x0 && t.bx <= r.x1 && t.by >= r.y0 && t.by <= r.y1;
const posted = (u) => !!jobOf(u) && jobOf(u) !== 'build' && FK.has(u.target, 'Field'), idlePost = (b) => FK.has(b, 'Field') && up(b) && !b.wk;
// E221
function bestFind(u, y, from, b = FK.dropFor(u, y)) { const r = from && searchR(u), cs = [];
  for (const t of findsOf(y)) if ((t.kind !== 'bld' || t.side === u.side) && docked(u.side, t) && !unsafe(t, u.side) && bell - (t.noPath ?? -Infinity) >= D.noPath && !full(u, t) && (u.patch ? inBox(t, u.patch) : !from || Math.hypot(from.x - t.bx, from.y - t.by) <= r)) cs.push([forage(u, t, b, true), t]);
  let best = null, top = 0; for (const [ub, t] of cs.sort(([p], [q]) => q - p)) { if (ub <= top) break; const R = forage(u, t, b); if (R > top) [best, top] = [t, R]; }
  return best; }
function gatherAt(u, t) { u.tool = null; if (u.load && u.carry !== yieldOf(t)) { u.target = t; carry(u); return; } if (u.target !== t && (full(u, t) || (t.kind !== 'bld' && !FK.spotFor(u, t)))) { u.carry = yieldOf(t); u.lost = { x: t.bx, y: t.by, t: bell }; return look(u); } t.wk = ~~t.wk + (u.target !== t); u.target = t; u.carry = yieldOf(t); u.lost = null; if (beside(u, t)) { u.job = 'gather'; return; } u.job = 'walk'; u.then = 'gather'; if (!(t.kind === 'bld' ? FK.goBy(u, t) : FK.toSpot(u, t))) { t.noPath = bell; u.target = u.path = null; u.job = 'gather'; } } // E222
function carry(u) { u.tool = null; const b = FK.dropFor(u, u.carry); if (!b) { u.job = 'wait'; u.wait = SR.again; return; } if (beside(u, b)) { u.job = 'carry'; return; } u.job = 'walk'; u.then = 'carry'; if (!FK.goBy(u, b)) { u.job = 'wait'; u.wait = SR.again; } }
function buildAt(u, t, pulled) { if (u.target !== t && jobOf(u) !== 'build') u.was = { t: jobOf(u) && u.target, y: jobOf(u), back: !!pulled }; u.raise = !up(t); u.tool = null; u.target = t; if (beside(u, t)) { u.job = 'build'; u.path = null; return; } u.job = 'walk'; u.then = 'build'; if (!FK.goBy(u, t)) u.job = 'idle'; } // E320
function idle(u) { u.job = 'idle'; u.then = null; u.tool = null; u.target = null; u.path = null; u.spot = u.lost = u.patch = u.was = null; }
// E321
function autoBuilder(side, t, by) { if (by) return buildAt(by, t); const vs = villagersOf(side).filter((v) => !posted(v));
  if (wallish(t) && wallsBusy(side)) return;
  const free = vs.filter((v) => v.job === 'idle' || v.job === 'wait'), busy = vs.filter((v) => jobOf(v) && jobOf(v) !== 'build'), hand = side === ME && !free.length;
  const [v] = free.length || hand ? (hand ? busy : free).sort((a, b) => dist(a, t) - dist(b, t)) : busy.sort((a, b) => forageNow(a) - forageNow(b)); if (v) buildAt(v, t, hand); }
const wallsBusy = (side) => things().filter((s) => s.side === side && !up(s) && wallish(s) && units().some((v) => v.target === s && jobOf(v) === 'build')).length >= D.builders.crew;
function back(u) { const w = u.was, f = w && (w.t && alive(w.t) ? w.t : w.y && bestFind(u, w.y)); u.raise = false; if (f) gatherAt(u, f); else idle(u); u.was = null; } // E322
function nextSite(u, t) { const near = (r, ok) => { let best = null; FK.bldsNear(u.bx, u.by, r * D.tile, (q) => { if (q.side === u.side && !up(q) && ok(q) && dist(u, q) < r * D.tile && (!best || dist(u, q) < dist(u, best))) best = q; }); return best; }; // E323
  return (wallish(t) && near(D.builders.wall, wallish)) || near(D.builders.site, (q) => !units().some((v) => v !== u && v.target === q && jobOf(v) === 'build')); }
function done(u, t) { const w = u.was || {}; if (u.raise && t && alive(t)) { if ((!w.back || FK.SH[t.code].drop) && startWork(u, t)) return (u.was = null); const s = !w.back && nextSite(u, t); if (s) return buildAt(u, s); } back(u); } // E324
function mend(u, t, dt) { const M = t.hpMax, heal = Math.min(M - t.hp, (M / D.buildTime[t.code] / D.repair.time) * dt), due = addRes({ ...t.rd }, D.cost[t.code], (D.repair.cost * heal) / M); // E325
  if (Object.keys(due).some((y) => Math.floor(due[y]) > SIDES[u.side].store[y])) { if (u.side === ME) FK.fire('event', 'short', t); return back(u); }
  t.rd = {}; for (const y in due) { spend(u.side, y, Math.floor(due[y]), 'repairs'); t.rd[y] = due[y] - Math.floor(due[y]); } t.hp += heal; }
// E308
const lose = (u) => { u.lost = u.lost || { x: u.bx, y: u.by, t: bell }; if (u.load) carry(u); else look(u); };
function look(u) { const n = bestFind(u, u.carry, u.lost); if (n) return gatherAt(u, n); if (u.patch) return unbox(u); u.job = u.then = 'wait'; u.wait = SR.again + FK.rng(); const b = FK.dropFor(u, u.carry); if (b) FK.toSpot(u, b); }
// E309
function startWork(u, b) { if (FK.has(b, 'Field')) { if (full(u, b)) return false; gatherAt(u, b); return true; } const ys = FK.SH[b.code].drop || [], t = ys.length < YIELDS.length && ys.map((y) => bestFind(u, y)).find(Boolean); if (t) gatherAt(u, t); return !!t; }
// E310
const middle = (r) => ({ bx: (r.x0 + r.x1) / 2, by: (r.y0 + r.y1) / 2 });
const cutIn = (u, r, y) => (findsOf(y).some((t) => inBox(t, r)) ? findsOf(y).filter((t) => !inBox(t, r)).sort((a, b) => dist(a, middle(r)) - dist(b, middle(r))).find((t) => !full(u, t) && FK.spotFor(u, t)) : null);
function unbox(u) { const way = cutIn(u, u.patch, u.carry); if (way) return gatherAt(u, way); const pj = u.pj; u.patch = u.pj = null; const n = pj && bestFind(u, pj); if (n) gatherAt(u, n); else look(u); }
function boxCut(side, r, n) { const t = things().find((q) => q.kind !== 'bld' && alive(q) && yieldOf(q) && inBox(q, r)), y = t && yieldOf(t);
  const vs = villagersOf(side).filter((u) => t && !u.patch && !posted(u)).sort((a, b) => (a.job !== 'idle') - (b.job !== 'idle') || dist(a, middle(r)) - dist(b, middle(r))).filter((u, i) => i < n);
  for (const u of vs) { u.pj = jobOf(u) && jobOf(u) !== y && jobOf(u) !== 'build' ? jobOf(u) : null; u.patch = r; const f = bestFind(u, y) || cutIn(u, r, y); if (f) gatherAt(u, f); else u.patch = u.pj = null; }
  return vs.length; }
const sendOut = (t) => { const u = villagersOf(t.side).filter((v) => v.target === t).pop(); if (u) idle(u); return !!u; };
// E223
function assign(side, y, n) { const vs = villagersOf(side);
  if (n < 0) { const u = vs.find((v) => jobOf(v) === y); if (!u) return false; if (u.load) carry(u); else idle(u); return true; }
  const u = vs.find((v) => v.job === 'idle' || v.job === 'wait') || vs.filter((v) => jobOf(v) && jobOf(v) !== y && jobOf(v) !== 'build' && !posted(v)).reduce((a, v) => (!a || forageNow(v) < forageNow(a) ? v : a), null); if (!u) return false;
  const t = bestFind(u, y); if (!t) return false; gatherAt(u, t); return true; }
// E348
const SAY = fromBook('words').say, eats = (u) => (FK.stat(u.code, u.side, 'eat') * D.upkeep) / D.day, hungerOf = (side) => (bell - ((SIDES[side] || {}).famine ?? bell) >= D.hunger.days * D.day ? D.hunger.work : 1);
const docked = (side, t) => !FK.has(t, 'Catch') || things().some((b) => b.side === side && FK.has(b, 'Shore') && up(b) && Math.abs(b.bx - t.bx) < D.fish.near && Math.abs(b.by - t.by) < D.fish.near);
const inReach = (side) => findsOf('food').some((t) => (t.kind !== 'bld' || t.side === side) && docked(side, t)) || units().some((u) => FK.has(u, 'Prey'));
const fromFind = (u) => FK.has(u, 'Gather') && u.target && !u.target.gone && (jobOf(u) === 'food' || FK.has(u.target, 'Prey')) && !FK.has(u.target, 'Flock'); // E349
function upkeep(dt) { for (const side of D.players) { const s = SIDES[side]; let need = 0;
  for (const u of units()) if (u.side === side) { const e = eats(u) * dt; if (!fromFind(u)) need += e; else if (KIND[u.target.kind]) FK.take(u.target, Math.min(u.target.amount, e)); }
  if (!s.hungry || inReach(side)) s.famine = null; else if (s.famine == null) { s.famine = bell; if (side === ME) FK.fire('event', 'famine', null); }
  if (s.store.food >= need) { spend(side, 'food', need, 'upkeep'); if (s.hungry && s.store.food > D.hunger.fed) { s.hungry = false; if (side === ME) FK.fire('event', 'fed', null); } }
  else { spend(side, 'food', s.store.food, 'upkeep'); if (!s.hungry) { s.hungry = true; if (side === ME && inReach(ME)) FK.fire('event', 'hungry', null); } } } }
const orderCost = (side, S) => { const f = Math.min(Math.round((sumCost(S.map((u) => FK.ref(FK.SH[u.code].upkeep))) * D.upkeep * D.order) / D.day), Math.floor(SIDES[side].store.food)); spend(side, 'food', f, 'orders'); return f; }; // E350
// E351
function nature(dt) {
  for (const t of things()) if (FK.has(t, 'Soil') && up(t)) t.fert = Math.min(D.soil.full, Math.max(FK.stat(t.code, t.side, 'soil'), t.fert + (bell - t.workT < D.soil.worked ? -D.soil.loss / D.year : D.soil.rest / D.season) * dt));
  const n = Math.floor(FK.K.t / D.season); if (n !== turned) { turned = n; seasonTurn(); } upkeep(dt); }
function seasonTurn() { const spring = !FK.season(), F = D.flock; // E352
  for (const side of D.players) { const s = SIDES[side], lost = Math.floor(-s.store.food * Math.expm1((Math.log1p(-D.spoil.year) * D.season * FK.stat('', side, 'spoil')) / D.year / D.spoil.year)); spend(side, 'food', lost, 'spoiled'); if (side === ME && lost >= D.spoil.say) FK.fire('event', 'spoiled', null, lost); }
  if (spring) for (const t of things()) if (FK.has(t, 'Catch') && t.amount < t.max) t.amount += (D.fish.r * t.amount * (t.max - t.amount)) / t.max;
  for (const t of things()) if (FK.has(t, 'Flock') && up(t)) {
    if (spring) { t.sheep = Math.min(F.max, Math.round(t.sheep + (F.lambs * t.sheep * (F.max - t.sheep)) / F.max)); const cull = t.wk && t.sheep > F.hold && t.sheep - F.hold; if (cull) { t.sheep -= cull; earn(t.side, 'food', cull * F.mutton, 'gather'); if (t.side === ME) FK.fire('event', 'cull', t, cull); } }
    if (t.sheep && units().some((u) => F.takers.includes(u.code) && dist(u, t) < F.wolf)) { const n = Math.min(t.sheep, 1 + Math.floor(FK.rng() * F.take)); t.sheep -= n; if (t.side === ME) FK.fire('event', 'wolves', t, n); } }
  if (!spring) return; const r = FK.rng(); harvest = D.harvest.find((h) => r < h.upTo); if (harvest !== D.harvest.at(-1)) FK.fire('event', 'harvest', null, D.harvest.indexOf(harvest));
  if (things().some((t) => t.side === ME && FK.has(t, 'Flock'))) FK.fire('event', 'spring', null); }
// E353
const replantCost = (t) => Object.fromEntries(Object.entries(D.cost[t.code] || {}).map(([y, n]) => [y, Math.round(n * D.treeFarm.replant)]));
const replantWhy = (side, t) => (!t.max ? SAY.none : t.amount ? SAY.growing : canPay(side, replantCost(t)) ? '' : 'cost');
function replant(side, t) { if (replantWhy(side, t)) return false; pay(side, replantCost(t), 'buildings'); t.amount = t.max; return true; }
const cutOut = (side, at) => things().filter((q) => q.side === side && q.max && !q.amount && (FK.SH[at.code].drop || []).includes(yieldOf(q))), replantAll = (side, at) => cutOut(side, at).sort((a, b) => dist(a, at) - dist(b, at)).filter((q) => replant(side, q)).length;
function hunt(side, a, v) { const free = (q) => q.job === 'idle' || q.job === 'wait', u = v || villagersOf(side).filter((q) => !posted(q) && jobOf(q) !== 'build').sort((p, q) => free(q) - free(p) || dist(p, a) - dist(q, a)).shift(); if (u) { WAR.fight(u, a); u.then = 'fight'; } return u; } // E354
// E224
FK.on('tick', (dt) => {
  if (result) return; bell += dt;
  for (const t of things()) if (t.kind === 'bld' && t.q && t.q.length && up(t) && !(t.stall > FK.K.t)) { t.qt -= dt; const code = t.q[0]; if (D.ages.includes(code)) SIDES[t.side].aging = t.qt; if (t.qt <= 0) { const u = FK.SH[code] ? spawnBy(t, code) : null; if (FK.SH[code] && !u) continue; t.q.shift(); if (T[code]) learn(t.side, code); else if (code.plan) mustered(t, code); else if (!u) rise(t.side); if (u && t.side === ME) FK.fire('event', FK.has(u, 'Gather') ? 'trained' : 'trainedSol', u); const r = SIDES[t.side].rally; if (u && FK.has(u, 'Gather') && r) { const f = bestFind(u, r); if (f) gatherAt(u, f); } if (t.q.length) t.qt = timeOf(t.side, t.q[0]); } }
  nature(dt);
  for (const t of things()) t.wk = t.crew = 0; for (const u of units()) if (jobOf(u) && jobOf(u) !== 'build') u.target.wk++; else if (u.job === 'build' && u.target) u.target.crew++;
  for (const u of units()) { if (u.inside && (u.inside.gone || u.job !== 'inside') && out(u) && FK.has(u, 'Gather') && u.job === 'idle') resume(u); if (u.job === 'shelter' && !u.path) enter(u); if (!FK.has(u, 'Gather') || u.path || u.inside || u.den) continue; const t = u.target;
    if (u.job === 'gather') { if (!t || !alive(t)) { lose(u); continue; } if (!beside(u, t)) { gatherAt(u, t); continue; }
      u.tool = FK.WORK[t.kind] ?? FK.WORK.other; u.face = t.bx < u.bx ? -1 : 1; const beat = Math.floor(u.t / D.beat); if (beat !== u.beat && beat % 2 === 0) FK.fire('event', 'work', t, u); u.beat = beat; const cap = FK.stat(u.code, u.side, 'carry'), g = rateOf(t, u.side) * dt * hungerOf(u.side), n = Math.min(g, t.amount ?? g, cap - u.load); t.workT = bell; // E347
      if (FK.has(t, 'Flock')) { earn(u.side, 'food', g, 'gather'); continue; } u.load += n; if (t.kind !== 'bld') FK.take(t, n); else if (t.max) t.amount -= n; if (u.load >= cap - 1e-6 || (!n && u.load)) carry(u); }
    else if (u.job === 'carry') { const b = FK.dropFor(u, u.carry); if (!b || !beside(u, b)) { carry(u); continue; } earn(u.side, u.carry, u.load, 'gather'); u.load = 0; if (u.side === ME) FK.fire('event', 'drop.' + u.carry, b);
      const cur = t && alive(t) ? t : null, next = cur && posted(u) ? null : bestFind(u, u.carry, u.lost || { x: u.bx, y: u.by }, b); const go = cur && next && next !== cur && forage(u, next, b) > (1 + D.moveOn) * forage(u, cur, b) ? next : cur || next; if (go) gatherAt(u, go); else lose(u); }
    else if (u.job === 'build' || u.job === 'repair') { if (!t || !alive(t) || (up(t) && t.hp >= t.hpMax - D.repair.within)) { done(u, t); continue; } if (!beside(u, t)) { buildAt(u, t); continue; }
      u.tool = 2; u.face = t.bx < u.bx ? -1 : 1; const beat = Math.floor(u.t / D.beat); if (beat !== u.beat && beat % 2 === 0) FK.fire('event', 'raise', t, u); u.beat = beat; if (up(t)) { mend(u, t, dt); continue; } // E326
      let k = ((Math.pow(t.crew, D.crew) / t.crew) * dt) / (FK.stat(t.code, t.side, 'build') || 30); if ((D.cost[t.code] || {}).stone && FK.K.temp <= D.frost.at) k *= D.frost.share; t.done = Math.min(1, t.done + k); t.hp = Math.min(t.hpMax, t.hp + t.hpMax * D.rising.rise * k);
      if (up(t)) { t.hp = t.hpMax; if (FK.has(t, 'Wonder')) { t.held = bell + D.wonderHold; tell(EW.built[+(t.side !== ME)], { m: D.wonderHold / MINUTE, side: EW.sides[t.side] }); } if (t.side === ME) FK.fire('event', wallish(t) || FK.trains(t.code).some((c) => !FK.SH[c].ticks.includes('Gather')) ? 'builtWar' : 'built', t); } }
    else if (u.job === 'wait') { u.wait -= dt; if (u.wait <= 0) { if (u.load) carry(u); else if (u.lost) look(u); else idle(u); } }
    else if (u.job === 'idle' && u.load) carry(u);
  }
  if (FK.every(DG.beat)) { dangerMap(); watch(); sites(); } if (FK.every(DG.look)) leave(); if (FK.every(FL.look)) for (const u of units()) if (FK.has(u, 'Gather') && SIDES[u.side]) fright(u, FK.seatOf(u.side)); judge();
});
FK.on('gone', (t) => { t.gone = true; });
FK.on('gone', (t) => { if (FK.has(t, 'Wonder') && t.held != null) tell(EW.lost[+(t.side !== ME)], { side: EW.sides[t.side] }); if (result || !FK.has(t, 'Seat') || !D.players.includes(t.side) || fell.has(t.side) || things().some((q) => FK.has(q, 'Seat') && q.side === t.side)) return; fall(t.side, t.by); });
FK.on('start', () => { result = emg = FK.near = null; bell = 0; warnT = -Infinity; fell.clear(); rang.clear(); turned = Math.floor(FK.K.t / D.season); harvest = D.harvest.at(-1); for (const s of SIDES) Object.assign(s, fresh(), { store: { ...D.start }, capA: null }); for (const s of D.players) { scares[s] = []; delete FK.DANGER[s]; } // E225
  for (const side of D.players) villagersOf(side).forEach((u, i) => { const f = bestFind(u, D.first.jobs[i] || D.first.rest); if (f) gatherAt(u, f); }); });
// E436
const DG = D.danger, FL = D.flee, AL = D.alarm, AW = fromBook('words').alarm, EW = fromBook('words').end, T0 = D.tile, scares = {}, fell = new Set(), rang = new Set(), BEST = 'fk.best'; let emg = null, warnT;
const tell = (w, o = {}) => FK.fire('say', w.replace(/\{(\w+)\}/g, (_, x) => o[x] ?? ''));
const threat = (v) => !v.gone && !v.inside && FK.has(v, 'Fight') && !FK.has(v, 'Gather') && !FK.has(v, 'Prey') && !WAR.stat(v).bonly && (!!soldier(v.code) || !SIDES[v.side]), foeOf = (side, v) => threat(v) && WAR.isFoe(side, v); // E437
const unsafe = (t, side) => t.kind !== 'bld' && (FK.DANGER[side] || [])[FK.tileAt(t.bx, t.by)] >= DG.unsafe, tower = (side, t) => D.tower[t.code] && up(t) && SIDES[t.side] && WAR.atWar(side, t.side);
function dangerMap() { for (const s of D.players) { const M = (FK.DANGER[s] = new Uint8Array(N * N)), put = (p, r, lv) => FK.stamp(p.bx, p.by, r * T0, (k) => { if (M[k] < lv) M[k] = lv; }); // E438
  for (const v of units()) if (foeOf(s, v)) put(v, DG.near, DG.foe); for (const t of things()) if (tower(s, t)) put(t, WAR.reachOf(t) + DG.reach, DG.foe);
  scares[s] = scares[s].filter((q) => q.t > bell); for (const q of scares[s]) put(q, DG.mem, DG.scare); } }
function dangerWhy(t, side) { const v = units().find((q) => foeOf(side, q) && dist(q, t) <= (DG.near + DG.pad) * T0), b = !v && things().find((q) => tower(side, q) && dist(q, t) <= (WAR.reachOf(q) + DG.reach + DG.pad) * T0); // E439
  return v ? (SIDES[v.side] ? AW.nearOf : AW.near).replace('{who}', FK.rankName(v.code, v.side)).replace('{side}', EW.sides[v.side]) : b ? AW.tower.replace('{side}', EW.sides[b.side]).replace('{bld}', FK.SH[b.code].name.toLowerCase()) : AW.scare; }
function leave() { let said = false; for (const u of units()) { const t = u.target, y = jobOf(u); if (!y || y === 'build' || !SIDES[u.side] || !unsafe(t, u.side)) continue; // E440
  if (u.side === ME && !said) said = tell(AW.leave, { why: dangerWhy(t, ME), find: FK.SH[t.code || KIND[t.kind].code].name.toLowerCase() }) || true; u.target = null; if (u.job === 'gather' || u.then === 'gather') { u.path = null; lose(u); } } }
const hold = (b) => FK.stat(b.code, b.side, 'hold'), inN = (b) => units().filter((u) => u.inside === b || u.den === b).length, within = (b) => Math.min(hold(b), units().filter((u) => u.inside === b).length);
function enter(u) { const b = u.den; if (!b || b.gone || !up(b)) return void Object.assign(u, { den: null, job: 'idle' }); // E441
  if (!FK.atB(u, b)) { Object.assign(u, { job: 'walk', then: 'shelter', target: null, spot: null }); if (!FK.goBy(u, b)) Object.assign(u, { den: null, job: 'idle' }); return; }
  Object.assign(u, { inside: b, den: null, hid: true, job: 'inside', then: null, path: null, target: null, spot: null }); }
const out = (u) => Object.assign(u, { inside: null, hid: false, emg: false, scared: false, job: u.job === 'inside' ? 'idle' : u.job }), resume = (u) => (u.load ? carry(u) : u.carry ? look(u) : idle(u));
function fright(u, h) { if (!h) return; if (u.inside) { if (!u.emg && !units().some((v) => foeOf(u.side, v) && dist(v, u.inside) < FL.clear * T0)) resume(out(u)); return; } // E442
  const was = u.scared, r = (was ? FL.flee * FL.wide : FL.flee) * T0; const near = []; FK.unitsNear(u, r, (v) => { if (foeOf(u.side, v) && dist(u, v) < r) near.push(v); }); const foe = near.filter((v) => SIDES[v.side]).length, wild = near.length - foe;
  u.scared = !!(u.emg || foe || (wild && (wild >= FL.raid || FK.K.t - (u.hurtT ?? -Infinity) < FL.hurt)));
  if (u.scared && !was && !u.den) { const [tw] = things().filter((b) => b.side === u.side && b !== h && up(b) && inN(b) < hold(b) && dist(u, b) < FL.tower * T0).sort((a, b) => dist(u, a) - dist(u, b)); u.den = tw && dist(u, tw) < dist(u, h) ? tw : h; enter(u);
    const S = scares[u.side]; if (dist(u, h) > DG.far * T0 && !S.some((q) => dist(q, u) < DG.mem * T0)) { S.push({ bx: u.bx, by: u.by, t: bell + DG.secs }); if (S.length > DG.keep) S.shift(); } }
  else if (!u.scared && was && u.den) { u.den = null; resume(u); } }
// E443
const ranked = () => things().filter((b) => b.side === ME && up(b) && hold(b)).sort((a, b) => b.hp - a.hp || hold(b) - hold(a));
function fillRank(us, into, first) { let rest = us.slice(); for (const b of ranked()) { const n = hold(b) - inN(b), take = rest.sort((p, q) => (first ? first(p) - first(q) : null) || dist(p, b) - dist(q, b)).filter((_, i) => i < n); take.forEach((u) => into(u, b)); rest = rest.filter((u) => !take.includes(u)); } return rest; }
function threatDir(h) { const [n] = units().filter((v) => foeOf(ME, v) && dist(v, h) < AL.dir * T0).sort((a, b) => dist(a, h) - dist(b, h)), t = (FK.near && FK.near.u) || n || { bx: FK.MID, by: FK.MID }, d = dist(t, h) || Infinity; return [(t.bx - h.bx) / d, (t.by - h.by) / d]; }
const walkTo = (u, x, y) => { Object.assign(u, { job: 'walk', then: 'idle', target: null, spot: null, den: null }); if (!FK.go(u, FK.tileAt(x, y))) u.job = 'idle'; };
function alarm(kind) { const h = FK.seatOf(ME); if (!h) return false; emg = emg || new Map(); for (const u of villagersOf(ME)) if (!emg.has(u)) emg.set(u, { t: u.target, y: jobOf(u) }); // E444
  const [dx, dy] = threatDir(h), S = WAR.armyFree(ME, 'rout'), r = h.n * P.half * T0;
  if (kind === 'square') { for (const u of villagersOf(ME)) { out(u); const d = dist(u, h) || Infinity, f = r + AL.square * T0; walkTo(u, h.bx + ((u.bx - h.bx) / d) * f, h.by + ((u.by - h.by) / d) * f); }
    for (const u of S) { const d = dist(u, h) || Infinity, f = r + AL.square * AL.away * T0; WAR.march(u, FK.tileAt(h.bx + ((u.bx - h.bx) / d) * f, h.by + ((u.by - h.by) / d) * f)); } }
  if (kind === 'hands') { for (const u of S) Object.assign(u, { ord: null, focus: null, target: null }); const left = fillRank(S, (u, b) => { u.den = b; enter(u); }, (u) => !WAR.ranged(u)), m = Math.min(left.length, AL.perRow), cx = h.bx + dx * AL.line * T0, cy = h.by + dy * AL.line * T0;
    left.forEach((u, i) => { const row = Math.floor(i / AL.perRow) * AL.row * T0, col = ((i % AL.perRow) - (m - AL.one) * P.half) * AL.row * T0; WAR.march(u, FK.tileAt(cx - dx * row - dy * col, cy - dy * row + dx * col)); }); }
  if (kind !== 'square') { const V = villagersOf(ME).filter((u) => !u.inside && !u.den); for (const u of V) Object.assign(u, { emg: true, scared: true }); const left = fillRank(V, (u, b) => { u.den = b; enter(u); });
    left.forEach((u, i) => walkTo(u, h.bx - dx * AL.behind * T0 + ((i % AL.cols) * AL.gap - AL.shift) * T0, h.by - dy * AL.behind * T0 + Math.floor(i / AL.cols) * AL.gap * T0)); }
  tell(AW.started, { name: AW.cells[kind].name }); return true; }
function allClear() { if (!emg) return; for (const [u, w] of emg) { if (u.gone) continue; out(u); u.den = null; if (w.t && w.y === 'build' && alive(w.t)) buildAt(u, w.t); else if (w.t && alive(w.t)) gatherAt(u, w.t); else if (w.y && w.y !== 'build') { const f = bestFind(u, w.y); if (f) gatherAt(u, f); else idle(u); } else idle(u); } emg = null; tell(AW.back); }
function watch() { const h = FK.seatOf(ME), mine = things().filter((t) => t.kind === 'bld' && t.side === ME), seen = (u) => u.side !== ME && SIDES[u.side] && WAR.armed(u) && !u.inside && WAR.atWar(ME, u.side) && FK.inSight(u.k); FK.near = null; if (!h || result) return; // E445
  let best = null, bd = AL.far * T0; for (const u of units()) if (seen(u) && (u.job === 'march' || (u.target && u.target.side === ME))) for (const b of mine) if (dist(u, b) < bd) [best, bd] = [u, dist(u, b)];
  const [near] = units().filter((u) => seen(u) && (u === best || dist(u, h) < AL.far * T0)).sort((a, b) => dist(a, h) - dist(b, h)); if (near) FK.near = { u: near, n: units().filter((v) => v.side === near.side && seen(v) && dist(v, near) < AL.radar * T0).length, eta: best && Math.ceil(bd / D.upm / FK.pace(best)) };
  if (near && dist(near, h) < AL.home * T0 && bell - warnT > AL.again) { warnT = bell; tell(AW.home); } }
// E446
function sites() { if (emg) return; for (const t of things()) if (t.kind === 'bld' && SIDES[t.side] && !up(t) && !units().some((v) => v.target === t && jobOf(v) === 'build')) { const R = FK.reach(t.side);
  if (!FK.reached(t.side, t, t.bx, t.by)) { if (t.side === ME && !t.told) tell(SAY.site, { b: FK.SH[t.code].name }); t.told = true; continue; } t.told = false; if (wallish(t) && wallsBusy(t.side)) continue;
  const [v] = villagersOf(t.side).filter((v) => (v.job === 'idle' || v.job === 'wait') && !v.inside && !v.den && !v.emg && R.has(v.k)).sort((a, b) => dist(a, t) - dist(b, t)); if (v) buildAt(v, t); } }
// E447
function fall(side, by) { fell.add(side); const s = SIDES[side]; if (SIDES[by] && by !== side) { const got = { ...s.store }; for (const t of things()) if (t.kind === 'bld' && t.side === side) for (const [y, n] of Object.entries(D.cost[t.code] || {})) add(got, y, Math.floor(n * D.plunder)); for (const y in got) { earn(by, y, got[y], 'loot'); spend(side, y, s.store[y], 'loot'); } }
  for (const u of units().filter((u) => u.side === side)) WAR.die(u); for (const t of things().filter((t) => t.kind === 'bld' && t.side === side)) FK.unbuild(t);
  const left = D.players.filter((p) => !fell.has(p)), n = Math.floor((D.armyMax * D.fallen.share) / left.length); for (const p of left) SIDES[p].capA = ~~SIDES[p].capA + n; if (side !== ME) { tell(EW.fallen, { side: EW.sides[side] }); if (left.includes(ME)) tell(EW.shared, { n }); } }
function judge() { if (result) return; const t = MENU.clock(bell), rivals = D.players.filter((p) => p !== ME); if (fell.has(ME)) return finish(false, EW.fell, { t }); if (rivals.every((p) => fell.has(p))) return finish(true, EW.rivals, { t }); // E448
  const [w] = things().filter((q) => FK.has(q, 'Wonder') && up(q) && q.held != null).sort((a, b) => a.held - b.held); if (w && bell >= w.held) return finish(w.side === ME, EW.wonder[+(w.side !== ME)], { m: D.wonderHold / MINUTE, side: EW.sides[w.side] });
  for (const m of D.bellSay.at) if (limit < Infinity && bell >= limit - m && !rang.has(m)) { rang.add(m); if (bell < limit - m + D.bellSay.late) tell(EW.left[+(m <= MINUTE)], { m: m / MINUTE }); }
  if (bell < limit) return; const [top] = D.players.filter((p) => !fell.has(p)).sort((a, b) => score(b).total - score(a).total); finish(top === ME, EW.bell[+(top !== ME)], { n: score(top).total, side: EW.sides[top], me: score(ME).total }); }
function finish(won, w, o) { const sc = score(ME).total; let best = null; try { best = Number(localStorage.getItem(BEST)) || null; } catch (e) {} if (won && !(best >= sc)) { best = sc; try { localStorage.setItem(BEST, String(sc)); } catch (e) {} } // E449
  const text = w.replace(/\{(\w+)\}/g, (_, x) => o[x] ?? '') + EW.score.replace('{n}', sc).replace('{best}', best ? EW.best.replace('{n}', best) : ''); result = { winner: won ? ME : null, won, text }; FK.near = null; tell(text); FK.fire('event', won ? 'win' : 'lose', null); }
// E226
function score(side) { const s = { people: 0, army: 0, tech: (SIDES[side].ledger.out.research || 0) / D.score.tech, bld: 0, wealth: SIDES[side].gathered / D.score.wealth };
  for (const u of units()) if (u.side === side) s[FK.has(u, 'Gather') || !FK.has(u, 'Fight') ? 'people' : 'army'] += sumCost(D.cost[u.code]) / D.score.unit;
  for (const t of things()) if (t.kind === 'bld' && t.side === side && up(t)) s.bld += sumCost(D.cost[t.code]) / D.score.bld;
  for (const k in s) s[k] = Math.round(s[k]); s.total = s.people + s.army + s.tech + s.bld + s.wealth; return s; }
// E458
const TE = D.teach, PR = D.prison, ZE = D.zeal, TW = fromBook('words').troops, ageOf = (c) => D.ages.indexOf(FK.SH[c].age), bldsOf = (side, tick) => things().filter((t) => t.kind === 'bld' && t.side === side && FK.has(t, tick) && up(t));
const teachTo = (u) => { const k = FK.SH[u.code].teach; return k && FK.SH[k] && ageOf(k) > ageOf(u.code) ? k : null; }, teachGap = (u) => ageOf(teachTo(u)) - ageOf(u.code);
function teachCost(side, u) { const A = priceOf(side, u.code), B = priceOf(side, teachTo(u)), c = {}; for (const y in B) if (B[y] > ~~A[y]) c[y] = B[y] - ~~A[y]; add(c, 'gold', TE.tuition * teachGap(u)); return c; } // E459
const teachSecs = (side, u) => D.train[teachTo(u)] * TE.mul * teachGap(u) * FK.stat(u.code, side, 'lesson'), schooling = (side) => units().filter((v) => v.side === side && v.job === 'school').length;
const teachWhy = (side, u) => { const to = teachTo(u), W = TW.teach; return !to ? W.none : u.job === 'school' ? W.busy : !(FK.stat(u.code, side, 'teach') > D.bases.teach) ? W.vets : ageOf(to) > SIDES[side].age ? W.age.replace('{age}', D.ages[ageOf(to)]) : !bldsOf(side, 'Teach').length ? W.school : schooling(side) >= TE.seats * bldsOf(side, 'Teach').length ? W.full : !canPay(side, teachCost(side, u)) ? W.cost : ''; };
function teach(side, u) { if (teachWhy(side, u)) return false; pay(side, teachCost(side, u), 'research'); Object.assign(u, { job: 'school', schoolT: FK.K.t + teachSecs(side, u), path: null, target: null, focus: null, chg: null, fb: null }); return true; }
function graduate(u) { const f = u.hp / u.hpMax; u.code = teachTo(u); u.hpMax = FK.stat(u.code, u.side, 'hp'); u.hp = Math.max(D.bases.pace, u.hpMax * f); Object.assign(u, { job: 'idle', schoolT: null }); if (u.side === ME) tell(TW.teach.done, { name: FK.rankName(u.code, ME).toLowerCase() }); } // E460
// E461
let prisoners = []; FK.on('start', () => { prisoners = []; });
const ransomOf = (c) => Math.round(Math.max(PR.least, sumCost(D.cost[c]) * PR.ransom)), prisonersOf = (side) => prisoners.filter((x) => x.o === side), nameOf1 = (c) => FK.SH[c].name.toLowerCase();
function takePrisoner(by, v) { const x = { o: v.side, by, code: v.code, t: FK.K.t, ransom: ransomOf(v.code) }; prisoners.push(x); WAR.die(v); if (v.side === ME) tell(TW.prison.lost, { side: EW.sides[by], name: nameOf1(v.code), n: x.ransom }); else if (by === ME) tell(TW.prison.taken, { name: nameOf1(v.code) }); }
const home1 = (side, c) => FK.seatOf(side) && spawnBy(FK.seatOf(side), c);
function payRansom(side, i) { const x = prisonersOf(side)[i]; if (!x || SIDES[side].store.gold < x.ransom) return false; spend(side, 'gold', x.ransom, 'ransom'); if (SIDES[x.by]) earn(x.by, 'gold', x.ransom, 'ransom'); prisoners = prisoners.filter((p) => p !== x); home1(side, x.code); if (side === ME) tell(TW.prison.paid, { name: nameOf1(x.code) }); return true; }
// E462
const zealCost = (side, t) => ({ gold: Math.round(ZE.cost.gold * FK.stat(t.code, side, 'zealcost')) });
const zealWhy = (side, t, list) => { const W = TW.zeal; return !up(t) ? W.temple : SIDES[side].zealT > FK.K.t ? W.rest.replace('{n}', Math.ceil(SIDES[side].zealT - FK.K.t)) : !canPay(side, zealCost(side, t)) ? W.cost : !list.length ? W.none : !units().some((p) => p.side === side && FK.has(p, 'Convert') && list.some((v) => dist(p, v) < ZE.near * D.tile)) ? W.priest : ''; };
function zeal(side, t, list) { if (zealWhy(side, t, list)) return false; pay(side, zealCost(side, t), 'zeal'); SIDES[side].zealT = FK.K.t + ZE.cd * FK.stat(t.code, side, 'zealcd'); for (const u of list) u.zeal = FK.K.t + ZE.secs + FK.stat(t.code, side, 'zealsecs'); if (side === ME) tell(TW.zeal.on, { n: ZE.secs }); return true; }
FK.on('tick', () => { for (const u of units().slice()) if (u.job === 'school' && FK.K.t >= u.schoolT) graduate(u); // E463
  for (const x of prisoners.slice()) if (FK.K.t - x.t > PR.secs) { prisoners = prisoners.filter((p) => p !== x); if (!fell.has(x.by)) home1(x.by, x.code); if (x.o === ME) tell(TW.prison.turned, { name: nameOf1(x.code), side: EW.sides[x.by] }); } });
function intel(side, of) { if (side !== ME) return; const army = {}; for (const u of units()) if (u.side === of && WAR.armed(u)) army[u.code] = -~army[u.code]; SIDES[side].intel[of] = { t: FK.K.t, store: { ...SIDES[of].store }, age: SIDES[of].age, techs: SIDES[of].techs.size, army }; } // E464
return { teachTo, teachCost, teachSecs, teachWhy, teach, graduate, takePrisoner, prisonersOf, payRansom, ransomOf, zealCost, zealWhy, zeal, intel, threat, alarm, allClear, alarmOn: () => !!emg, unsafe, dangerWhy, within, hold, fall, fell: (side) => fell.has(side), eats, hungerOf, docked, orderCost, nature, upkeep, seasonTurn, rateOf, harvest: () => harvest.m, replantCost, replantWhy, replant, cutOut, replantAll, hunt, at, capWhy, placeWhy, snap, refund, repairCost, wallLine, lay, sealPath, wallish, autoBuilder, room, lineFor, forage, forageNow, capOf, searchR, boxCut, sendOut, posted, idlePost, startWork, setBell: (s) => { limit = s; }, bell: () => limit, plan, cancel, canPlace, canPay, pay, payBack, earn, spend, addRes, sumCost, flowOf, outOf, netOf, velOf, queue, unqueue, timeOf, nameOf, musterN, musterCost, musterWhy, muster, ageUp, ageCost, nextAge, research, researchWhy, lineOf, prevOf, needsOf, nextStep, assign, jobs, jobOf, popOf, popCap, armyRoom, armyFull, soldier, villagersOf, gatherAt, buildAt, carry, idle, bestFind, yieldOf, score, time: () => bell, result: () => result, YIELDS };
})();
