'use strict';
// E213
window.ECON = (() => {
const { D, B, U, KIND, SIDES, OCC, H, N } = FK;
// E170
const YIELDS = ['food', 'wood', 'gold', 'stone', 'iron'];
// E290
const T = BOOKS.tech, TK = FK.TK;
const fresh = () => ({ age: 0, aging: 0, civ: null, war: null, laurels: null, techs: new Set(), gathered: 0, rally: null, flow: {}, rate: {}, spent1: {}, orate: {}, flowBy: {}, rateBy: {}, spentBy: {}, orateBy: {}, ledger: { in: {}, out: {} }, intel: {}, zealT: null, ventures: [], debased: false, ally: null, lord: null, rebel: null, envoyOut: false, envoyAt: -Infinity }); // E267
for (const s of SIDES) Object.assign(s, fresh());
let result = null, bell = 0, limit = D.bell, turned, harvest; // E214
const things = FK.things, units = FK.units;
const yieldOf = (t) => (t.kind === 'bld' ? ((FK.has(t, 'Field') || FK.has(t, 'Make')) && up(t) ? t.make || FK.SH[t.code].yield : null) : KIND[t.kind].yield);
const rateOf = (t, side) => { if (FK.has(t, 'Make')) return makeOf(t).rate * FK.stat(yieldOf(t), side, 'make') * scaleOf(t, side); const r = FK.stat(t.code || KIND[t.kind].code, side, 'rate') * scaleOf(t, side); return FK.has(t, 'Flock') ? r * t.sheep : FK.has(t, 'Soil') ? r * D.seasons.farm[FK.season()] * harvest.m * t.fert : r; }; // E291
const alive = (t) => !t.gone && (t.kind === 'bld' || t.amount > 0), up = (t) => t.done >= 1; // E215
const dist = FK.dist;
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
const popOf = (side, ok = (c) => FK.SH[c]) => units().filter((u) => u.side === side && ok(u.code)).length + FK.blds().filter((t) => t.side === side).reduce((n, t) => n + (t.q || []).flatMap((c) => (c.plan ? Object.entries(c.plan).flatMap(([k, v]) => Array(v).fill(k)) : [c])).filter(ok).length, 0);
const soldier = (c) => FK.SH[c] && FK.SH[c].class, armyRoom = (side) => D.armyMax + ~~SIDES[side].capA, armyFull = (side) => popOf(side, soldier) >= armyRoom(side); // E371
const popCap = (side) => Math.min(D.popMax, FK.blds().filter((t) => t.side === side && up(t)).reduce((n, t) => n + (FK.stat(t.code, side, 'room') || 0), 0));
const villagersOf = (side) => units().filter((u) => u.side === side && FK.has(u, 'Gather'));
// E217
const P = D.place, [ME] = D.players, at = (k) => [k % N, (k - (k % N)) / N], is = (c, tick) => FK.has({ code: c }, tick), wallish = (t) => FK.has(t, 'Line') || FK.has(t, 'Gate'), wallAt = (k) => things().find((t) => t.kind === 'bld' && FK.has(t, 'Line') && t.j * N + t.i === k);
const many = (side, c) => FK.blds().filter((t) => t.side === side && t.code === c && t !== FK.seatOf(side)).length;
function capWhy(side, c) { const cp = Object.values(FK.stat(c, side, 'limit') || {}), age = SIDES[side].age, n = cp[age] ?? cp.at(-1); // E313
  if (D.bldAge[c] > age) return `${D.ages[D.bldAge[c]]} age`; if (D.bldTech[c] && !SIDES[side].techs.has(TK[D.bldTech[c]])) return `Research ${T[TK[D.bldTech[c]]].name} first`; if (D.bldNeeds[c] && !things().some((t) => t.side === side && t.code === D.bldNeeds[c] && up(t))) return `Needs an ${FK.SH[D.bldNeeds[c]].name} standing`; if (cp.length && !n) return 'A later age allows it'; return !cp.length || many(side, c) < n ? '' : `At the limit of ${n}` + (cp[age + 1] > n ? '. A new age allows more' : ''); }
function placeWhy(side, c, i, j, capped) { const [, n] = B[c], crop = is(c, 'Field'); let why = capped ? '' : capWhy(side, c); // E314
  if (i < 0 || j < 0 || i + n > N || j + n > N) return 'Too close to the edge'; if (why) return why; if (is(c, 'Post') && !stops().some((f) => onStop({ i, j, n }, f) && !postOn(f))) return MW.stop; if (is(c, 'Shore') && !FK.byLake(...FK.toBoard((i + n * P.half) * D.tile, (j + n * P.half) * D.tile), D.fish.shore)) return SAY.shore;
  for (let y = j; y < j + n; y++) for (let x = i; x < i + n; x++) { const k = y * N + x; if (is(c, 'Gate') && (wallAt(k) || {}).side === side) continue; if (OCC[k] || FK.FOR[k]) return 'Something is in the way'; if (!FK.free(k) || H[k] !== H[j * N + i]) return 'It needs flat, open ground'; }
  if (!wallish({ code: c })) FK.bldsNear(...FK.toBoard((i + n * P.half) * D.tile, (j + n * P.half) * D.tile), (n + P.near + P.lane) * D.tile, (b) => { const gap = Math.max(b.i - i - n, i - b.i - b.n, b.j - j - n, j - b.j - b.n); if (gap >= P.lane) return;
    const on = (s, v) => v >= s && v < s + b.n, touch = on(b.i, i - 1) || on(b.i, i + n) || on(b.j, j - 1) || on(b.j, j + n);
    why = !crop && !wallish(b) && !FK.has(b, 'Field') ? 'Leave a gap: two squares round each building' : touch && !wallish(b) && (D.trains[c] || D.trains[b.code]) ? 'Leave a lane around buildings that train people' : ''; return !!why; });
  const off = (v, lo, hi) => Math.max(lo - v - P.half, v + P.half - hi, 0); // E315
  for (let y = j - P.lane; y < j + n + P.lane && !why; y++) for (let x = i - P.lane; x < i + n + P.lane; x++) if (OCC[y * N + x] === 1 && Math.hypot(off(x, i, i + n), off(y, j, j + n)) < P.lane) return 'Leave two squares from trees and rocks';
  return why || (FK.reached(side, { i, j, n }, ...FK.toBoard((i + n * P.half) * D.tile, (j + n * P.half) * D.tile)) ? '' : SAY.reach); }
const canPlace = (code, i, j, side = ME, capped) => !placeWhy(side, code, i, j, capped);
const around = [...new Set(D.ways.flat())].sort((a, b) => a - b);
function snap(side, c, i, j, tol) { const [, n] = B[c]; let best = [i, j], bd = tol; if (wallish({ code: c })) return best; // E316
  const take = (x, y) => { const d = Math.hypot(x - i, y - j); if (d < bd && canPlace(c, x, y, side)) [best, bd] = [[x, y], d]; };
  for (const b of things()) if (b.kind === 'bld' && b.side === side && !wallish(b)) { const h = (b.n - n) * P.half, ci = b.i + h, cj = b.j + h, R = (b.n + n) * P.half + tol + P.near;
    if (Math.abs(ci - i) <= R && Math.abs(cj - j) <= R) for (const g of P.gaps) { for (const x of [b.i - n - g, b.i + b.n + g]) for (const y of [Math.round(cj), b.j, b.j + b.n - n, j]) take(x, y); for (const y of [b.j - n - g, b.j + b.n + g]) for (const x of [Math.round(ci), b.i, b.i + b.n - n, i]) take(x, y); }
    if (Number.isInteger(h) && Math.abs(ci - i) < P.guide && Math.abs(cj - j) < P.guide) { for (const d of around) take(ci, j + d); for (const d of around) take(i + d, cj); } }
  return best; }
function plan(side, code, i, j) { const cost = D.cost[code] || {}; if (!canPay(side, cost) || placeWhy(side, code, i, j)) return null; if (is(code, 'Gate') && wallAt(j * N + i)) FK.unbuild(wallAt(j * N + i)); const t = site(side, code, i, j); if (t) pay(side, cost, 'buildings'); return t; }
function site(side, code, i, j) { const t = FK.build(code, i, j, SIDES[side].col); if (!t) return null; t.done = t.crew = 0; if (is(code, 'Supply')) t.supply = D.camp.start; if (FK.SH[code].amount) t.amount = t.max = FK.ref(FK.SH[code].amount); if (is(code, 'Flock')) t.sheep = D.flock.start; if (is(code, 'Soil')) t.fert = D.soil.full; const M = FK.stat(code, side, 'hp'); if (M) { t.hpMax = M; t.hp = M * D.rising.start; } return t; }
const costBy = (t, f) => Object.fromEntries(Object.entries(D.cost[t.code] || {}).map(([y, n]) => [y, f(n)])), refund = (t) => costBy(t, (n) => Math.floor(n * (t.done < D.refund.first ? D.refund.early : D.refund.share))); // E317
function cancel(t) { while (t.q && t.q.length) unqueue(t); payBack(t.side, refund(t), 'buildings'); FK.unbuild(t); }
const repairCost = (t) => costBy(t, (n) => Math.ceil((n * D.repair.cost * (t.hpMax - t.hp)) / t.hpMax));
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
const priceOf = (side, c, b) => tentCost(side, b, c.plan ? c.paid : D.ages.includes(c) ? D.age.cost[D.ages.indexOf(c)] : FK.stat(c, side, 'cost')), room = (b) => (b.q || []).length < FK.stat(b.code, b.side, 'queue');
const order = (b, c) => { (b.q = b.q || []).push(c); if (b.q.length === 1) b.qt = timeOf(b.side, c); };
function queue(b, code) { if (!up(b) || !FK.trains(b.code, b.side).includes(code) || !FK.aged(code, b.side) || !room(b) || campWhyTrain(b.side, code)) return false; const cost = priceOf(b.side, code, b); if (!canPay(b.side, cost) || popOf(b.side) >= popCap(b.side) || (soldier(code) && armyFull(b.side))) return false; pay(b.side, cost, 'units'); order(b, code); return true; }
function unqueue(b) { if (!b.q || !b.q.length) return; const code = b.q.pop(); payBack(b.side, priceOf(b.side, code, b), FK.SH[code] || code.plan ? 'units' : 'research'); if (D.ages.includes(code)) SIDES[b.side].aging = 0; if (!b.q.length) b.qt = 0; }
function spawnBy(b, code) { const s = FK.spotFor(b, b); if (!s) return null; const u = FK.spawn(code, b.side, FK.tileAt(s.x, s.y), FK.rng); u.bx = s.x; u.by = s.y; u.hb = b; FK.place(u); const fl = SIDES[b.side].flag; if (fl != null && WAR.armed(u)) WAR.march(u, fl); return u; } // E311
// E402
const musterN = sumCost, readyAt = (side, c) => things().filter((t) => t.side === side && up(t) && FK.trains(t.code, side).includes(c)).length;
function musterCost(side, plan) { const cost = {}, ks = Object.keys(plan); for (const c of ks) addRes(cost, priceOf(side, c), plan[c] * D.muster.cost); return { cost, t: Math.ceil(Math.max(...ks.map((c) => (plan[c] * timeOf(side, c)) / readyAt(side, c))) * D.muster.time) }; }
const council = (side) => lines(side, (t) => FK.has(t, 'Squad'));
function musterWhy(side, plan) { const n = musterN(plan); return !WAR.knows(side, 'muster') ? 'tech' : !n ? 'none' : !council(side) ? 'at' : Object.keys(plan).some((c) => !FK.aged(c, side) || !readyAt(side, c)) ? 'kind' : popOf(side, soldier) + n > armyRoom(side) ? 'army' : popOf(side) + n > popCap(side) ? 'room' : !canPay(side, musterCost(side, plan).cost) ? 'cost' : ''; }
function mustered(b, job) { for (const c in job.plan) for (let i = job.plan[c]; i--; ) { const u = spawnBy(b, c); if (u) u.bn = job.bn; } if (b.side === ME) FK.fire('event', 'mustered', b, job.bn != null ? fromBook('words').army.squads[job.bn] : fromBook('words').army.all); }
function muster(side, plan, bn) { if (musterWhy(side, plan)) return false; const { cost, t } = musterCost(side, plan); pay(side, cost, 'units'); order(council(side), { plan, bn, t, paid: cost }); return true; }
// E219
const nextAge = (side) => { const n = SIDES[side].age + 1; return n < D.ages.length && (n !== D.age.hidden || opened) ? n : null; }, ageCost = (side) => D.age.cost[nextAge(side)] || null;
function ageUp(side) { const s = SIDES[side], n = nextAge(side), h = FK.seatOf(side); if (!n || s.aging || !h || !room(h) || !canPay(side, D.age.cost[n])) return false; pay(side, D.age.cost[n], 'research'); order(h, D.ages[n]); s.aging = timeOf(side, D.ages[n]); return true; }
const rise = (side) => { const s = SIDES[side]; s.aging = 0; s.age++; if (side === ME) FK.fire('event', 'age', null); };
// E292
const lineOf = (c) => Object.keys(T).filter((x) => T[x].value.at === T[c].value.at && T[x].value.line === T[c].value.line);
const prevOf = (c) => { const L = lineOf(c); return L[L.indexOf(c) - 1] || null; };
const needsOf = (c) => [...new Set([prevOf(c), ...(T[c].value.need || []).map((k) => TK[k] || k)].filter(Boolean))];
const nextStep = (side, c) => lineOf(c).find((x) => !SIDES[side].techs.has(x)) || null;
// E293
const lines = (side, ok) => FK.blds().filter((t) => t.side === side && up(t) && ok(t)).reduce((a, b) => (!a || (b.q || []).length < (a.q || []).length ? b : a), null); // E327
const labOf = (side, c) => lines(side, (t) => t.code === T[c].value.at), lineFor = (side, c) => lines(side, (t) => FK.trains(t.code, side).includes(c) && (!t.camp || canPay(side, priceOf(side, c, t)))) || lines(side, (t) => FK.trains(t.code, side).includes(c));
function researchWhy(side, c) { const s = SIDES[side], b = labOf(side, c);
  return s.techs.has(c) ? 'known' : T[c].value.civ && T[c].value.civ !== s.civ ? 'civ' : T[c].value.age > s.age ? 'age' : needsOf(c).some((n) => !s.techs.has(n)) ? 'need' : things().some((t) => t.side === side && (t.q || []).includes(c)) ? 'busy' : !b ? 'at' : !room(b) ? 'full' : canPay(side, priceOf(side, c)) ? '' : 'cost'; }
function research(side, c) { if (researchWhy(side, c)) return false; const b = labOf(side, c); pay(side, priceOf(side, c), 'research'); order(b, c); return true; }
const learn = (side, c) => { SIDES[side].techs.add(c); FK.learn(side, c); if (T[c].value.age === D.age.hidden) enlightened(side); };
// E220
const jobOf = (u) => (u.target && (u.job === 'gather' || u.job === 'carry' || (u.job === 'walk' && (u.then === 'gather' || u.then === 'carry'))) ? u.carry || yieldOf(u.target) : u.job === 'build' || (u.job === 'walk' && u.then === 'build') ? 'build' : null);
const jobs = (side) => { const n = Object.fromEntries([...YIELDS, 'build', 'idle'].map((k) => [k, 0])); for (const u of villagersOf(side)) { const j = jobOf(u); if (j) n[j]++; else if (u.job === 'idle' || u.job === 'wait') n.idle++; } return n; };
const findsOf = (y) => things().filter((t) => yieldOf(t) === y && alive(t) && (t.kind !== 'bld' || (SIDES[t.side] && !(t.amount <= 0))));
// E306
const FO = D.forage, SR = D.search, capOf = (t) => FO.cap[t.kind] ?? FK.ring(t).m;
const others = (u, t) => Math.max(0, ~~t.wk - (u.target === t)), full = (u, t) => others(u, t) >= capOf(t);
const span = (t) => (t.kind === 'bld' ? (t.n + 2) * D.tile * Math.SQRT1_2 : FK.ring(t).r + D.tile);
function forage(u, t, b, low) { // E307
  const s = !low && t.kind !== 'bld' && FK.spotFor(u, t); if (s === null) return 0;
  const c = FK.stat(u.code, u.side, 'carry'), v = FK.stat(u.code, u.side, 'spd') * D.upm, life = c * FO.life, g = rateOf(t, u.side) / (1 + others(u, t) / (FO.hold[t.kind] ?? FO.hold.other));
  const A = t.amount == null || (u.target === t && FO.cap[t.kind]) ? life : Math.min(Math.max(1, t.amount), life);
  const d = !b ? 0 : low ? Math.max(0, dist(t, b) - span(t) - span(b)) : t.way && t.way.b === b ? t.way.d : (t.way = { b, d: FK.wayLen(FK.tileAt(...(s ? [s.x, s.y] : [t.bx, t.by])), b, u) }).d;
  return c / (c / g + (2 * d) / v + (dist(u, t) * c) / (A * v));
}
const forageNow = (u) => jobOf(u) && jobOf(u) !== 'build' && alive(u.target) && forage(u, u.target, FK.dropFor(u, u.carry));
const searchR = (u) => (SR.from + SR.grow * Math.min(1, (bell - (u.lost?.t ?? bell)) / SR.tau)) * D.upm;
const inBox = (t, r) => t.bx >= r.x0 && t.bx <= r.x1 && t.by >= r.y0 && t.by <= r.y1;
const post = (t) => FK.has(t, 'Field') || FK.has(t, 'Make'), posted = (u) => !!jobOf(u) && jobOf(u) !== 'build' && post(u.target), idlePost = (b) => post(b) && up(b) && !b.wk;
// E221
function bestFind(u, y, from, b = FK.dropFor(u, y)) { const r = from && searchR(u), cs = [];
  for (const t of findsOf(y)) if ((t.kind !== 'bld' || (t.side === u.side && !u.wild)) && docked(u.side, t) && !unsafe(t, u.side) && bell - ((t.noPath || {})[u.side] ?? -Infinity) >= D.noPath && !full(u, t) && (u.patch ? inBox(t, u.patch) : !from || Math.hypot(from.x - t.bx, from.y - t.by) <= r)) cs.push([forage(u, t, b, true), t]);
  let best = null, top = 0; for (const [ub, t] of cs.filter(([p]) => isFinite(p)).sort(([p], [q]) => q - p)) { if (ub <= top) break; const R = forage(u, t, b); if (R > top) [best, top] = [t, R]; }
  return best; }
function gatherAt(u, t) { u.tool = null; if (u.load && u.carry !== yieldOf(t)) { u.target = t; carry(u); return; } if (u.target !== t && (full(u, t) || (t.kind !== 'bld' && !FK.spotFor(u, t)))) { u.carry = yieldOf(t); u.lost = { x: t.bx, y: t.by, t: bell }; return look(u); } t.wk = ~~t.wk + (u.target !== t); u.target = t; u.carry = yieldOf(t); u.lost = null; if (beside(u, t)) { u.job = 'gather'; return; } u.job = 'walk'; u.then = 'gather'; if (!(t.kind === 'bld' ? FK.goBy(u, t) : FK.toSpot(u, t))) { (t.noPath = t.noPath || {})[u.side] = bell; u.target = u.path = null; u.job = 'gather'; } } // E222
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
function startWork(u, b) { if (post(b)) { if (full(u, b)) return false; gatherAt(u, b); return true; } const ys = FK.SH[b.code].drop || [], t = ys.length < YIELDS.length && ys.map((y) => bestFind(u, y)).find(Boolean); if (t) gatherAt(u, t); return !!t; }
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
const docked = (side, t) => !FK.has(t, 'Catch') || FK.blds().some((b) => b.side === side && FK.has(b, 'Shore') && up(b) && Math.abs(b.bx - t.bx) < D.fish.near && Math.abs(b.by - t.by) < D.fish.near);
const inReach = (side) => findsOf('food').some((t) => (t.kind !== 'bld' || t.side === side) && docked(side, t)) || units().some((u) => FK.has(u, 'Prey'));
const fromFind = (u) => FK.has(u, 'Gather') && u.target && !u.target.gone && (jobOf(u) === 'food' || FK.has(u.target, 'Prey')) && !FK.has(u.target, 'Flock'); // E349
function upkeep(dt) { for (const side of D.players) { const s = SIDES[side]; let need = 0;
  for (const u of units()) if (u.side === side) { const e = eats(u) * dt; if (!fromFind(u)) need += e - camped(u, e); else if (KIND[u.target.kind]) FK.take(u.target, Math.min(u.target.amount, e)); }
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
    if (spring) { if (t.wk) earn(t.side, 'wool', t.sheep * F.fleece, 'gather'); t.sheep = Math.min(F.max, Math.round(t.sheep + (F.lambs * t.sheep * (F.max - t.sheep)) / F.max)); const cull = t.wk && t.sheep > F.hold && t.sheep - F.hold; if (cull) { t.sheep -= cull; earn(t.side, 'food', cull * F.mutton, 'gather'); if (t.side === ME) FK.fire('event', 'cull', t, cull); } }
    if (t.sheep && units().some((u) => F.takers.includes(u.code) && dist(u, t) < F.wolf)) { const n = Math.min(t.sheep, 1 + Math.floor(FK.rng() * F.take)); t.sheep -= n; if (t.side === ME) FK.fire('event', 'wolves', t, n); } }
  if (!spring) return; const r = FK.rng(); harvest = D.harvest.find((h) => r < h.upTo); if (harvest !== D.harvest.at(-1)) FK.fire('event', 'harvest', null, D.harvest.indexOf(harvest));
  if (units().some((u) => u.route && SIDES[u.side]) && chance(HE.plague[+FK.hz('plague')], ONE)) { plague = FK.K.t + HE.lasts * D.season; for (const s of SIDES) s.plagueDead = null; tell(HW.sick.roads); }
  if (things().some((t) => t.side === ME && FK.has(t, 'Flock'))) FK.fire('event', 'spring', null); }
// E353
const replantCost = (t) => costBy(t, (n) => Math.round(n * D.treeFarm.replant));
const replantWhy = (side, t) => (!t.max ? SAY.none : t.amount ? SAY.growing : canPay(side, replantCost(t)) ? '' : 'cost');
function replant(side, t) { if (replantWhy(side, t)) return false; pay(side, replantCost(t), 'buildings'); t.amount = t.max; return true; }
const cutOut = (side, at) => things().filter((q) => q.side === side && q.max && !q.amount && (FK.SH[at.code].drop || []).includes(yieldOf(q))), replantAll = (side, at) => cutOut(side, at).sort((a, b) => dist(a, at) - dist(b, at)).filter((q) => replant(side, q)).length;
function hunt(side, a, v) { const free = (q) => q.job === 'idle' || q.job === 'wait', u = v || villagersOf(side).filter((q) => !posted(q) && jobOf(q) !== 'build').sort((p, q) => free(q) - free(p) || dist(p, a) - dist(q, a)).shift(); if (u) { WAR.fight(u, a); u.then = 'fight'; } return u; } // E354
const stroke = (u, t, ev) => { u.face = t.bx < u.bx ? -1 : 1; const beat = Math.floor(u.t / D.beat); if (beat !== u.beat && beat % 2 === 0) FK.fire('event', ev, t, u); u.beat = beat; }; // E224
FK.on('tick', (dt) => {
  if (result) return; bell += dt;
  for (const t of things()) if (t.kind === 'bld' && t.q && t.q.length && up(t) && !(t.stall > FK.K.t)) { t.qt -= dt; const code = t.q[0]; if (D.ages.includes(code)) SIDES[t.side].aging = t.qt; if (t.qt <= 0) { const u = FK.SH[code] ? spawnBy(t, code) : null; if (FK.SH[code] && !u) continue; t.q.shift(); if (T[code]) learn(t.side, code); else if (code.plan) mustered(t, code); else if (!u) rise(t.side); if (u && t.side === ME) FK.fire('event', FK.has(u, 'Gather') ? 'trained' : 'trainedSol', u); const r = SIDES[t.side].rally; if (u && FK.has(u, 'Gather') && r) { const f = bestFind(u, r); if (f) gatherAt(u, f); } if (t.q.length) t.qt = timeOf(t.side, t.q[0]); } }
  nature(dt);
  for (const t of things()) t.wk = t.crew = 0; for (const u of units()) if (jobOf(u) && jobOf(u) !== 'build') u.target.wk++; else if (u.job === 'build' && u.target) u.target.crew++;
  for (const u of units()) { if (u.inside && (u.inside.gone || u.job !== 'inside') && out(u) && FK.has(u, 'Gather') && u.job === 'idle') resume(u); if (u.job === 'shelter' && !u.path) enter(u); if (!FK.has(u, 'Gather') || u.path || u.inside || u.den) continue; const t = u.target;
    if (u.job === 'gather') { if (!t || !alive(t)) { lose(u); continue; } if (!beside(u, t)) { gatherAt(u, t); continue; }
      u.tool = FK.WORK[t.kind] ?? FK.WORK.other; stroke(u, t, 'work'); const cap = FK.stat(u.code, u.side, 'carry'), g = rateOf(t, u.side) * dt * hungerOf(u.side) * D.health.work ** (u.sick > FK.K.t), n = Math.min(g, t.amount ?? g, cap - u.load); t.workT = bell; // E347
      if (FK.has(t, 'Make')) { make(u.side, t, g); continue; } if (FK.has(t, 'Flock')) { earn(u.side, 'food', g, 'gather'); continue; } u.load += n; if (t.kind !== 'bld') FK.take(t, n); else if (t.max) t.amount -= n; if (u.load >= cap - 1e-6 || (!n && u.load)) carry(u); }
    else if (u.job === 'carry') { const b = FK.dropFor(u, u.carry); if (!b || !beside(u, b)) { carry(u); continue; } earn(u.side, u.carry, u.load, 'gather'); u.load = 0; if (u.side === ME) FK.fire('event', 'drop.' + u.carry, b);
      const cur = t && alive(t) && yieldOf(t) === u.carry ? t : null, next = cur && posted(u) ? null : bestFind(u, u.carry, u.lost || { x: u.bx, y: u.by }, b); const go = cur && next && next !== cur && forage(u, next, b) > (1 + D.moveOn) * forage(u, cur, b) ? next : cur || next; if (go) gatherAt(u, go); else lose(u); }
    else if (u.job === 'build' || u.job === 'repair') { if (u.douse && !(t && t.fire > null)) { u.douse = null; done(u, t); continue; } if (!t || !alive(t) || (up(t) && !(t.fire > null) && t.hp >= t.hpMax - D.repair.within)) { done(u, t); continue; } if (!beside(u, t)) { buildAt(u, t); continue; }
      u.tool = 2; stroke(u, t, 'raise'); if (up(t)) { if (t.fire > null) douse(u, t, dt); else mend(u, t, dt); continue; } // E326
      let k = ((Math.pow(t.crew, D.crew) / t.crew) * dt) / (FK.stat(t.code, t.side, 'build') || 30); if ((D.cost[t.code] || {}).stone && FK.K.temp <= D.frost.at) k *= D.frost.share; t.done = Math.min(1, t.done + k); t.hp = Math.min(t.hpMax, t.hp + t.hpMax * D.rising.rise * k);
      if (up(t)) { t.hp = t.hpMax; FK.wear(t); if (FK.has(t, 'Wonder')) { t.held = bell + D.wonderHold; tell(EW.built[+(t.side !== ME)], { m: D.wonderHold / MINUTE, side: EW.sides[t.side] }); } if (t.side === ME) FK.fire('event', wallish(t) || FK.trains(t.code).some((c) => !FK.SH[c].ticks.includes('Gather')) ? 'builtWar' : 'built', t); } }
    else if (u.job === 'wait') { u.wait -= dt; if (u.wait <= 0) { if (u.load) carry(u); else if (u.lost) look(u); else idle(u); } }
    else if (u.job === 'idle' && u.load) carry(u);
  }
  burn(dt); if (FK.every(FD.beat)) finds(); if (FK.every(D.minute)) lightning(); if (FK.every(D.beats.health)) health();
  if (FK.every(DG.beat)) { dangerMap(); watch(); sites(); } if (FK.every(DG.look)) leave(); if (FK.every(FL.look)) for (const u of units()) if (FK.has(u, 'Gather') && SIDES[u.side]) fright(u, FK.seatOf(u.side)); judge();
});
FK.on('gone', (t) => { t.gone = true; });
FK.on('gone', (t) => { if (FK.has(t, 'Wonder') && t.held != null) tell(EW.lost[+(t.side !== ME)], { side: EW.sides[t.side] }); if (result || !FK.has(t, 'Seat') || !D.players.includes(t.side) || fell.has(t.side) || things().some((q) => FK.has(q, 'Seat') && q.side === t.side)) return; fall(t.side, t.by); });
FK.on('start', () => { result = emg = FK.near = null; bell = 0; warnT = -Infinity; fell.clear(); rang.clear(); turned = Math.floor(FK.K.t / D.season); harvest = D.harvest.at(-1); for (const s of SIDES) Object.assign(s, fresh(), { store: { ...D.start }, capA: null }); for (const s of D.players) { scares[s] = []; delete FK.DANGER[s]; } // E225
  for (const side of D.players) villagersOf(side).forEach((u, i) => { const f = bestFind(u, D.first.jobs[i] || D.first.rest); if (f) gatherAt(u, f); }); });
// E436
const DG = D.danger, FL = D.flee, AL = D.alarm, AW = fromBook('words').alarm, EW = fromBook('words').end, T0 = D.tile, scares = {}, fell = new Set(), rang = new Set(), BEST = 'fk.best'; let emg = null, warnT;
const tell = (w, o = {}, m) => FK.fire('say', w.replace(/\{(\w+)\}/g, (_, x) => o[x] ?? ''), m);
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
function watch() { const h = FK.seatOf(ME), mine = FK.blds().filter((t) => t.side === ME), seen = (u) => u.side !== ME && SIDES[u.side] && WAR.armed(u) && !u.inside && WAR.atWar(ME, u.side) && FK.inSight(u); FK.near = null; if (!h || result) return; // E445
  let best = null, bd = AL.far * T0; for (const u of units()) if (seen(u) && (u.job === 'march' || (u.target && u.target.side === ME))) for (const b of mine) if (dist(u, b) < bd) [best, bd] = [u, dist(u, b)];
  const [near] = units().filter((u) => seen(u) && (u === best || dist(u, h) < AL.far * T0)).sort((a, b) => dist(a, h) - dist(b, h)); if (near) FK.near = { u: near, n: units().filter((v) => v.side === near.side && seen(v) && dist(v, near) < AL.radar * T0).length, eta: best && Math.ceil(bd / D.upm / FK.pace(best)) };
  if (near && dist(near, h) < AL.home * T0 && bell - warnT > AL.again) { warnT = bell; tell(AW.home); } }
// E446
function sites() { if (emg) return; for (const t of things()) if (t.kind === 'bld' && SIDES[t.side] && !up(t) && !units().some((v) => v.target === t && jobOf(v) === 'build')) { const R = FK.reach(t.side);
  if (!FK.reached(t.side, t, t.bx, t.by)) { if (t.side === ME && !t.told) tell(SAY.site, { b: FK.SH[t.code].name }); t.told = true; continue; } t.told = false; if (wallish(t) && wallsBusy(t.side)) continue;
  const [v] = villagersOf(t.side).filter((v) => (v.job === 'idle' || v.job === 'wait') && !v.inside && !v.den && !v.emg && R.has(v.k)).sort((a, b) => dist(a, t) - dist(b, t)); if (v) buildAt(v, t); } }
// E447
function fall(side, by) { fell.add(side); const s = SIDES[side]; if (SIDES[by] && by !== side) { const got = { ...s.store }; for (const t of things()) if (t.kind === 'bld' && t.side === side) for (const [y, n] of Object.entries(D.cost[t.code] || {})) add(got, y, Math.floor(n * D.plunder)); for (const y in got) { earn(by, y, got[y], 'loot'); spend(side, y, s.store[y], 'loot'); } }
  for (const u of units().filter((u) => u.side === side)) WAR.die(u); for (const t of FK.blds().filter((t) => t.side === side)) FK.unbuild(t);
  const left = D.players.filter((p) => !fell.has(p)), n = Math.floor((D.armyMax * D.fallen.share) / left.length); for (const p of left) SIDES[p].capA = ~~SIDES[p].capA + n; if (side !== ME) { tell(EW.fallen, { side: EW.sides[side] }); if (left.includes(ME)) tell(EW.shared, { n }); } }
function judge() { if (result) return; const t = MENU.clock(bell), rivals = D.players.filter((p) => p !== ME); if (fell.has(ME)) return finish(false, EW.fell, { t }); if (rivals.every((p) => fell.has(p))) return finish(true, EW.rivals, { t }); // E448
  const [w] = things().filter((q) => FK.has(q, 'Wonder') && up(q) && q.held != null).sort((a, b) => a.held - b.held); if (w && bell >= w.held) return finish(w.side === ME, EW.wonder[+(w.side !== ME)], { m: D.wonderHold / MINUTE, side: EW.sides[w.side] });
  for (const m of D.bellSay.at) if (limit < Infinity && bell >= limit - m && !rang.has(m)) { rang.add(m); if (bell < limit - m + D.bellSay.late) tell(EW.left[+(m <= MINUTE)], { m: m / MINUTE }); }
  if (bell < limit) return; const [top] = D.players.filter((p) => !fell.has(p)).sort((a, b) => score(b).total - score(a).total); finish(top === ME, EW.bell[+(top !== ME)], { n: score(top).total, side: EW.sides[top], me: score(ME).total }); }
function finish(won, w, o) { const sc = Math.round(score(ME).total * FK.levelMul()); let best = null; try { best = Number(localStorage.getItem(BEST)) || null; } catch (e) {} if (won && !(best >= sc)) { best = sc; try { localStorage.setItem(BEST, String(sc)); } catch (e) {} } // E449
  const text = w.replace(/\{(\w+)\}/g, (_, x) => o[x] ?? '') + EW.score.replace('{n}', sc).replace('{best}', best ? EW.best.replace('{n}', best) : ''); result = { winner: won ? ME : null, won, text }; FK.near = null; tell(text); FK.fire('event', won ? 'win' : 'lose', null); }
// E226
function score(side) { const s = { people: 0, army: 0, tech: (SIDES[side].ledger.out.research || 0) / D.score.tech, bld: 0, wealth: SIDES[side].gathered / D.score.wealth };
  for (const u of units()) if (u.side === side) s[FK.has(u, 'Gather') || !FK.has(u, 'Fight') ? 'people' : 'army'] += sumCost(D.cost[u.code]) / D.score.unit;
  for (const t of things()) if (t.kind === 'bld' && t.side === side && up(t)) s.bld += sumCost(D.cost[t.code]) / D.score.bld;
  for (const k in s) s[k] = Math.round(s[k]); s.total = s.people + s.army + s.tech + s.bld + s.wealth; return s; }
// E458
const TE = D.teach, PR = D.prison, ZE = D.zeal, TW = fromBook('words').troops, ageOf = (c) => D.ages.indexOf(FK.SH[c].age), bldsOf = (side, tick) => FK.blds().filter((t) => t.side === side && FK.has(t, tick) && up(t));
const teachTo = (u) => { const k = FK.SH[u.code].teach; return k && FK.SH[k] && ageOf(k) > ageOf(u.code) ? k : null; }, teachGap = (u) => ageOf(teachTo(u)) - ageOf(u.code);
function teachCost(side, u) { const A = priceOf(side, u.code), B = priceOf(side, teachTo(u)), c = {}; for (const y in B) if (B[y] > ~~A[y]) c[y] = B[y] - ~~A[y]; add(c, 'gold', TE.tuition * teachGap(u)); return c; } // E459
const teachSecs = (side, u) => D.train[teachTo(u)] * TE.mul * teachGap(u) * FK.stat(u.code, side, 'lesson'), schooling = (side) => units().filter((v) => v.side === side && v.job === 'school').length;
const teachWhy = (side, u) => { const to = teachTo(u), W = TW.teach; return !to ? W.none : u.job === 'school' ? W.busy : !(FK.stat(u.code, side, 'teach') > D.bases.teach) ? W.vets : ageOf(to) > SIDES[side].age ? W.age.replace('{age}', D.ages[ageOf(to)]) : !bldsOf(side, 'Teach').length ? W.school : schooling(side) >= TE.seats * bldsOf(side, 'Teach').length ? W.full : !canPay(side, teachCost(side, u)) ? W.cost : ''; };
function teach(side, u) { if (teachWhy(side, u)) return false; pay(side, teachCost(side, u), 'research'); Object.assign(u, { job: 'school', schoolT: FK.K.t + teachSecs(side, u), path: null, target: null, focus: null, chg: null, fb: null }); return true; }
function graduate(u) { const f = u.hp / u.hpMax; u.code = teachTo(u); u.hpMax = FK.stat(u.code, u.side, 'hp'); u.hp = Math.max(D.bases.pace, u.hpMax * f); Object.assign(u, { job: 'idle', schoolT: null }); if (u.side === ME) tell(TW.teach.done, { name: FK.rankName(u.code, ME).toLowerCase() }); } // E460
// E461
let prisoners = []; FK.on('start', () => { prisoners = []; });
const ransomOf = (c) => Math.round(Math.max(PR.least, sumCost(D.cost[c]) * PR.ransom)), prisonersOf = (side) => prisoners.filter((x) => x.o === side), nameOf1 = (c) => FK.SH[c].name.toLowerCase();
function takePrisoner(by, v) { const x = { o: v.side, by, code: v.code, t: FK.K.t, ransom: ransomOf(v.code) }; prisoners.push(x); WAR.take(v); if (v.side === ME) tell(TW.prison.lost, { side: EW.sides[by], name: nameOf1(v.code), n: x.ransom }); else if (by === ME) tell(TW.prison.taken, { name: nameOf1(v.code) }); }
const home1 = (side, c) => FK.seatOf(side) && spawnBy(FK.seatOf(side), c);
function payRansom(side, i) { const x = prisonersOf(side)[i]; if (!x || SIDES[side].store.gold < x.ransom || !home1(side, x.code)) return false; spend(side, 'gold', x.ransom, 'ransom'); if (SIDES[x.by]) earn(x.by, 'gold', x.ransom, 'ransom'); prisoners = prisoners.filter((p) => p !== x); if (side === ME) tell(TW.prison.paid, { name: nameOf1(x.code) }); return true; }
// E462
const zealCost = (side, t) => ({ gold: Math.round(ZE.cost.gold * FK.stat(t.code, side, 'zealcost')) });
const zealWhy = (side, t, list) => { const W = TW.zeal; return !up(t) ? W.temple : SIDES[side].zealT > FK.K.t ? W.rest.replace('{n}', Math.ceil(SIDES[side].zealT - FK.K.t)) : !canPay(side, zealCost(side, t)) ? W.cost : !list.length ? W.none : !units().some((p) => p.side === side && FK.has(p, 'Convert') && list.some((v) => dist(p, v) < ZE.near * D.tile)) ? W.priest : ''; };
function zeal(side, t, list) { if (zealWhy(side, t, list)) return false; pay(side, zealCost(side, t), 'zeal'); SIDES[side].zealT = FK.K.t + ZE.cd * FK.stat(t.code, side, 'zealcd'); for (const u of list) u.zeal = FK.K.t + ZE.secs + FK.stat(t.code, side, 'zealsecs'); if (side === ME) tell(TW.zeal.on, { n: ZE.secs }); return true; }
FK.on('tick', () => { for (const u of units().slice()) if (u.job === 'school' && FK.K.t >= u.schoolT) graduate(u); // E463
  for (const x of prisoners.slice()) if (FK.K.t - x.t > PR.secs) { prisoners = prisoners.filter((p) => p !== x); if (!fell.has(x.by)) home1(x.by, x.code); if (x.o === ME) tell(TW.prison.turned, { name: nameOf1(x.code), side: EW.sides[x.by] }); } });
function intel(side, of) { if (side !== ME) return; const army = {}; for (const u of units()) if (u.side === of && WAR.armed(u)) army[u.code] = -~army[u.code]; SIDES[side].intel[of] = { t: FK.K.t, store: { ...SIDES[of].store }, age: SIDES[of].age, techs: SIDES[of].techs.size, army }; } // E464
// E478
const MK = D.market, PC = D.price, GD = D.goods, TR = D.trade, VE = D.venture, MW = fromBook('words').trade, [SLOW] = D.beats.slow, SPICE = Object.keys(GD).find((k) => GD[k].buy); let stock = {};
const raw = (k) => k in MK.worth, lot = (k) => (raw(k) ? MK.lot.raw : MK.lot.good), worth = (k) => (raw(k) ? MK.worth[k] / MK.lot.raw : GD[k].buy || GD[k].base), baseOf = (k) => (raw(k) ? worth(k) : GD[k].base), goodName = (k) => (MW.goods[k] || k).toLowerCase();
const coinOf = (side) => (SIDES[side].debased ? D.mint.price : D.mint.sound), goingPrice = (k, side) => Math.min(PC.cap, Math.max(PC.floor, Math.max(PC.least, stock[k]) ** (-1 / PC.eps[k]))) ** FK.stat('', side, 'band');
const sellPrice = (side, k) => Math.floor((lot(k) * worth(k) * (MK.sell + FK.stat('', side, 'sell')) * goingPrice(k, side)) / coinOf(side)), buyPrice = (side, k) => Math.ceil(lot(k) * worth(k) * MK.buy * goingPrice(k, side) * coinOf(side));
const stockHit = (k, q) => { stock[k] = Math.max(PC.least, stock[k] - q / (raw(k) ? PC.q0.raw : PC.q0.good)); }, marketOf = (side) => things().find((t) => t.kind === 'bld' && t.side === side && up(t) && FK.has(t, 'Trade'));
function marketTrade(side, k, how) { const st = SIDES[side].store, n = lot(k); if (!marketOf(side) || !MK[how].includes(k)) return false; // E479
  if (how === 'sells') { if (st[k] < n) return false; const v = sellPrice(side, k); spend(side, k, n, 'market'); earn(side, 'gold', v, 'market', !raw(k)); stockHit(k, -n); }
  else { const c = buyPrice(side, k); if (st.gold < c) return false; spend(side, 'gold', c, 'market'); earn(side, k, n, 'market', false); stockHit(k, n); } return true; }
const minting = (side) => things().some((t) => t.side === side && up(t) && FK.has(t, 'Make') && D.makes[t.code].gold);
function debase(side) { const s = SIDES[side]; if (s.debased || !minting(side)) return false; s.debased = true; earn(side, 'gold', D.mint.debase, 'mint'); if (side === ME) tell(MW.debased, { n: D.mint.debase, m: D.mint.price }); return true; } // E480
function venture(side, amt) { const s = SIDES[side]; if (s.age < VE.age || !marketOf(side) || s.store.gold < amt || s.ventures.length >= VE.max) return false; spend(side, 'gold', amt, 'venture'); s.ventures.push({ amt, due: bell + D.year }); if (side === ME) tell(MW.sent, { n: amt }); return true; } // E481
const returnOf = (side, amt) => Math.round(amt * (VE.back + FK.stat('', side, 'venture'))), interest = (side) => Math.min(D.interest.cap, Math.floor(SIDES[side].store.gold * FK.stat('', side, 'interest')));
function ventures() { for (const side of D.players) { const s = SIDES[side]; s.ventures = s.ventures.filter((v) => { if (v.due > bell) return true; if (FK.rng() < VE.lost) { if (side === ME) tell(MW.lost, { n: v.amt }); return false; } // E482
  const back = returnOf(side, v.amt); earn(side, 'gold', shareUp(side, back), 'venture'); s.gathered -= v.amt; if (side === ME) tell(MW.back, { n: back, m: v.amt }); return false; }); } }
const wholeRoute = () => TR.routes.some((_, r) => { const [a, ...rest] = stops().filter((f) => f.route === r).map((f) => f.owner); return a != null && rest.every((x) => x === a); });
function drift() { const whole = wholeRoute(); for (const k in stock) { const aim = (GD[k] && GD[k].buy && whole ? PC.spice : PC.normal) ** -PC.eps[k]; stock[k] = aim + (stock[k] - aim) * Math.exp(-SLOW / PC.tau); } } // E483
// E484
const makeOf = (t) => (D.makes[t.code] || {})[yieldOf(t)], setMake = (t, y) => { if (!(D.makes[t.code] || {})[y]) return false; t.make = y; for (const u of units()) if (u.target === t) u.carry = y; return true; };
const scaleOf = (t, side) => { const S = D.scale; return FK.stat('', side, 'scale') && S.kinds.includes(t.code) ? S.base + S.per * Math.min(S.cap, things().filter((q) => q !== t && q.side === side && q.code === t.code && up(q)).length) : S.base; };
function make(side, t, g) { const { from } = makeOf(t), st = SIDES[side].store; for (const y in from) g = Math.min(g, st[y] / from[y]); for (const y in from) spend(side, y, g * from[y], 'shops'); earn(side, yieldOf(t), g, 'gather'); }
// E485
const stops = () => things().filter((t) => t.kind !== 'bld' && FK.has(t, 'Trade')), onStop = (b, f) => { const [i, j] = at(f.k); return i >= b.i && i < b.i + b.n && j >= b.j && j < b.j + b.n; }, postOn = (f) => things().find((b) => FK.has(b, 'Post') && onStop(b, f));
const held = (side, r) => stops().filter((f) => f.route === r && f.owner === side).length, isStop = (p) => p.kind !== 'bld', wares = (p) => TR.carried.filter((k) => !(isStop(p) && GD[k] && GD[k].buy));
const farF = (d) => Math.min(TR.far, (TR.per * D.tile + d) / (TR.per * D.tile)), priceAt = (side, k, p, from) => baseOf(k) * TR.want ** (p.want === k) * goingPrice(k, side) * farF(dist(from, p)) * FK.stat('', side, 'trade');
function cargo(side, p, from) { const st = SIDES[side].store, out = {}; let n = TR.load; for (const k of wares(p).sort((a, b) => priceAt(side, b, p, from) - priceAt(side, a, p, from))) { const q = Math.min(n, Math.floor(raw(k) ? st[k] - TR.keep : st[k])); if (q >= TR.least) { out[k] = q; n -= q; } } return out; }
const payOf = (side, goods, p, from) => sumCost(Object.fromEntries(Object.entries(goods).map(([k, q]) => [k, q * priceAt(side, k, p, from)]))), estPay = (side, p, from) => Math.round(payOf(side, cargo(side, p, from), p, from));
const near1 = (u, ok) => FK.blds().filter((t) => up(t) && ok(t)).reduce((a, b) => (!a || dist(b, u) < dist(a, u) ? b : a), null), homeOf = (u) => near1(u, (t) => t.side === u.side && FK.has(t, 'Trade'));
const targets = (side) => stops().filter((f) => !(f.owner != null && f.owner !== side && WAR.atWar(side, f.owner) && postOn(f))), setRoute = (c, p, rep, spice) => Object.assign(c, { route: { to: p, rep: !!rep, spice: !!spice }, leg: 'load', dest: null, cargo: null });
function bestTarget(side, c) { const h = homeOf(c); if (!h) return null; const [best = null] = targets(side).sort((a, b) => estPay(side, b, h) - estPay(side, a, h)); return best; }
const allyMarket = (side, from) => things().filter((b) => b.kind === 'bld' && up(b) && (FK.has(b, 'Trade') || FK.has(b, 'Seat')) && SIDES[b.side] && b.side !== side && !fell.has(b.side) && WAR.stance(side, b.side) === 'ally').reduce((a, b) => (!a || dist(b, from) > dist(a, from) ? b : a), null);
const there = (u, t) => (isStop(t) ? dist(u, t) <= TR.reach * D.tile : FK.atB(u, t));
function toward(u, t) { if (u.path) return false; if (there(u, t)) return true; Object.assign(u, { job: 'walk', then: 'idle' }); if (!(isStop(t) ? FK.go(u, t.k) : FK.goBy(u, t))) Object.assign(u, { job: 'idle', route: null, dest: null, rest: bell + D.repath }); return false; } // E486
function route(u) { const side = u.side, r = u.route, t = r.to, h = homeOf(u); if (t.gone || !h || (!isStop(t) && WAR.atWar(side, t.side))) return void (u.route = null); // E487
  if (u.leg === 'load') { if (!toward(u, h)) return; u.goods = cargo(side, t, h); for (const k in u.goods) spend(side, k, u.goods[k], 'trade'); if (Object.keys(u.goods).length || (r.spice && isStop(t))) Object.assign(u, { leg: 'go', from: { bx: h.bx, by: h.by } }); return; }
  if (u.leg === 'go') { if (!toward(u, t)) return; let gold = payOf(side, u.goods, t, u.from); const keeper = isStop(t) ? t.owner : null, sold = Object.entries(u.goods).map(([k, q]) => q + ' ' + goodName(k));
    if (keeper != null && keeper !== side && gold) { const cut = gold * Math.min(TR.cutMax, TR.cut[held(keeper, t.route)] + FK.stat('', keeper, 'cut')); gold -= cut; earn(keeper, 'gold', cut, 'trade'); }
    for (const k in u.goods) stockHit(k, -u.goods[k]); gold = Math.round(shareUp(side, gold)); earn(side, 'gold', gold, 'trade'); u.goods = {};
    if (r.spice && isStop(t)) { const c = GD[SPICE].buy * goingPrice(SPICE), q = Math.min(TR.load, Math.floor(SIDES[side].store.gold / c)); if (q >= TR.least) { spend(side, 'gold', Math.round(q * c), 'trade'); u.goods[SPICE] = q; stockHit(SPICE, q); } }
    if (side === ME && gold) tell(MW.sold, { what: sold.join(fromBook('words').list.and), n: gold }); if (side === ME && u.goods[SPICE]) tell(MW.spice, { n: u.goods[SPICE] }); u.abroad = isStop(t) || t.side !== side; u.leg = 'back'; return; }
  if (!toward(u, h)) return; for (const k in u.goods) earn(side, k, u.goods[k], 'trade', false); u.goods = {}; if (u.abroad && plague > FK.K.t && FK.rng() < HE.carts[+FK.hz('plague')]) outbreak(side, HE.cart, true); u.abroad = false; if (r.rep) u.leg = 'load'; else u.route = null; }
function run(u) { const side = u.side, home = (u.last && !u.last.gone && u.last) || homeOf(u); let d = u.dest && !u.dest.gone && (u.dest.side === side || WAR.stance(side, u.dest.side) === 'ally') ? u.dest : null; // E488
  if (!d) { const to = home && allyMarket(side, home); if (!to) { u.dest = u.cargo = null; if (home) toward(u, home); return; } const l = dist(home, to) / D.tile; d = u.dest = to; u.last = home; u.cargo = Math.min(TR.cap, Math.floor(((l * l) / TR.div) * FK.stat('', side, 'trade'))); }
  if (!toward(u, d)) return; if (d.side === side) return void (u.dest = null); earn(side, 'gold', u.cargo, 'trade'); if (side === ME && u.cargo) tell(MW.ally, { n: u.cargo }); u.dest = u.last; u.cargo = null; }
const guarded = (v) => things().some((b) => b.side === v.side && up(b) && (FK.has(b, 'Post') || (FK.has(b, 'Shoot') && FK.has(b, 'Hold') && !FK.has(b, 'Seat'))) && dist(b, v) < TR.safe * D.tile) || units().some((s) => s.side === v.side && WAR.armed(s) && Math.abs(s.bx - v.bx) < TR.near * D.tile && Math.abs(s.by - v.by) < TR.near * D.tile); // E489
FK.on('start', () => { stock = Object.fromEntries(Object.keys(PC.eps).map((k) => [k, PC.normal])); });
FK.on('tick', () => { if (result) return; const beat = FK.every(TR.beat); // E490
  for (const u of units()) if (FK.has(u, 'Trade') && SIDES[u.side] && !(u.rest > bell)) { if (beat && FK.stat(u.code, u.side, 'armed')) { const f = units().filter((v) => WAR.enemies(u, v) && dist(u, v) <= FK.stat(u.code, u.side, 'rng') * D.tile).reduce((a, b) => (!a || dist(b, u) < dist(a, u) ? b : a), null); if (f) WAR.hit(u, f); } if (u.route) route(u); else if (!supply(u, beat)) run(u); }
  if (beat) { const S = stops(), P = things().filter((b) => FK.has(b, 'Post')); for (const f of S) { const p = P.find((b) => onStop(b, f)); f.owner = p && up(p) ? p.side : null; } TR.routes.forEach((_, r) => { const [a, ...rest] = stops().filter((f) => f.route === r).map((f) => f.owner); if (a != null && rest.every((x) => x === a) && !fell.has(a)) earn(a, 'gold', shareUp(a, TR.all), 'trade'); }); }
  if (FK.every(D.beats.slow)) { drift(); ventures(); } if (FK.every(D.minute)) for (const side of D.players) if (!fell.has(side)) earn(side, 'gold', interest(side), 'gather'); });
FK.on('gone', (t) => { const by = t.killer, goods = t.goods || {}; if (t.kind !== 'unit' || !FK.has(t, 'Trade') || !SIDES[t.side] || by == null) return; // E491
  if (SIDES[by] && by !== t.side) { earn(by, 'gold', t.cargo, 'loot'); for (const k in goods) earn(by, k, goods[k], 'loot', false); return; }
  if (t.side === ME) tell(MW.robbed, { n: Math.round(~~t.cargo + sumCost(Object.fromEntries(Object.entries(goods).map(([k, q]) => [k, q * baseOf(k)])))) }); });
// E494
const CA = D.camp, CM = D.camps, CW = fromBook('words').camp, hf = P.half, campOf = (c) => ((FK.SH[c] || {}).camp || '').split('.').pop() || null, gridOf = (t) => FK.fromBoard(t.bx, t.by);
function facing(side, [sx, sy]) { const h = FK.seatOf(side); if (!h) return CA.south; const [x, y] = gridOf(h), d = Math.hypot(x - sx, y - sy); return d ? [(x - sx) / d, (y - sy) / d] : CA.south; }
function campLayout(size, [sx, sy], [fx, fy]) { const C = CM[size], L = [], put = (code, ax, ay) => { const [, n] = B[code]; L.push({ code, i: Math.round((sx + (-fy * ax + fx * ay) * D.tile) / D.tile - n * hf), j: Math.round((sy + (fx * ax + fy * ay) * D.tile) / D.tile - n * hf) }); }; // E495
  if (C.side) { const h = C.side * hf; for (let i = -h; i < h; i++) { put(C.gate.includes(i) ? C.door : C.wall, i + hf, h - hf); put(C.wall, i + hf, hf - h); if (Math.abs(i + hf) + hf < h) { put(C.wall, hf - h, i + hf); put(C.wall, h - hf, i + hf); } } }
  for (const [code, ax, ay] of C.spots) put(code, ax, ay); return L; }
const campCells = (L) => { const S = new Set(); for (const p of L) { const [, n] = B[p.code], m = wallish({ code: p.code }) ? null : CA.lane; for (let y = p.j - m; y < p.j + n + m; y++) for (let x = p.i - m; x < p.i + n + m; x++) S.add(y * N + x); } return S; };
function campWhy(side, size, at) { const L = campLayout(size, at, facing(side, at)), E = CA.edge, W = CW.why, cells = campCells(L), [cx, cy] = FK.toBoard(...at), reach = (CM[size].reach ?? CM[size].side * hf + CA.lane) * D.tile; // E496
  if (L.some((p) => { const [, n] = B[p.code]; return p.i < E || p.j < E || p.i + n > N - E || p.j + n > N - E; })) return W.edge;
  for (const k of cells) { if (!(H[k] > CA.water)) return W.water; if (OCC[k] > CA.node) return W.bld; if (OCC[k] && !FK.FOR[k]) return W.find; }
  if (things().some((t) => CA.finds.includes(t.kind) && Math.hypot(t.bx - cx, t.by - cy) < reach + (KIND[t.kind].r || CA.findR * D.tile))) return W.near;
  return L.some((p) => { const [, n] = B[p.code]; for (let y = p.j; y < p.j + n; y++) for (let x = p.i; x < p.i + n; x++) if (H[y * N + x] !== H[p.j * N + p.i]) return true; return false; }) ? W.flat : ''; }
const near = (k, S, r) => { const [i, j] = at(k); for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (S.has((j + y) * N + i + x)) return true; return false; };
function unpack(u) { const side = u.side, size = campOf(u.code), spot = gridOf(u), why = campWhy(side, size, spot); u.job = 'idle'; if (why) { if (side === ME) tell(CW.elsewhere, { why }); return false; } // E497
  const f = facing(side, spot), L = campLayout(size, spot, f), cells = campCells(L), C = CM[size], camp = { size }, burnt = things().filter((t) => t.kind === CA.burns && t.amount > CA.start && near(t.k, cells, CA.burn)), h = C.side * hf * D.tile;
  const [ux, uy] = spot, [fx, fy] = f, out = (t) => { const [x, y] = gridOf(t), dx = x - ux, dy = y - uy, a = fx * dx + fy * dy; return !(Math.abs(fx * dy - fy * dx) < h && Math.abs(a) < h) && a <= h - CA.open * D.tile; }, ab = C.side ? burnt.filter(out).map((t) => t.k) : [];
  for (const t of burnt) { FK.FOR[t.k] = false; FK.take(t, t.amount); }
  for (const p of L) { const b = site(side, p.code, p.i, p.j); if (b) b.camp = camp; }
  let laid = false; for (const k of ab) { if (cells.has(k) || OCC[k]) continue; const b = site(side, C.abatis, ...at(k)); if (b) { Object.assign(b, { camp, done: CA.built }); b.hp = b.hpMax; laid = true; } }
  WAR.die(u); if (side === ME) tell(CW.unpacked, { what: CW.what[size], at: MENU.coord(u.bx, u.by), felled: burnt.length ? CW.felled.replace('{n}', burnt.length).replace('{abatis}', laid ? CW.abatis : '') : '' }); return true; }
const sendWagon = (u, k) => { Object.assign(u, { job: 'walk', then: 'unpack', target: null }); if (!FK.go(u, k)) u.job = 'idle'; };
// E498
const hasCamp = (side, size) => { const C = CM[size], s = SIDES[side]; return !C.tech || (s.techs.has(TK[C.tech]) && things().some((t) => t.side === side && t.code === C.need && up(t))); };
const campCap = (side, size) => (!hasCamp(side, size) || SIDES[side].age < CM[size].first ? null : SIDES[side].age > CM[size].first ? CA.most : CA.one);
const campsOut = (side, size) => new Set(things().filter((t) => t.side === side && t.camp && t.camp.size === size && !wallish(t) && alive(t)).map((t) => t.camp)).size + units().filter((u) => u.side === side && campOf(u.code) === size).length + things().flatMap((t) => (t.side === side && t.q) || []).filter((c) => campOf(c) === size).length;
function campWhyTrain(side, c) { const size = campOf(c), Q = CW.cap; if (!size) return ''; const cap = campCap(side, size), what = CW.what[size]; // E499
  if (!cap) return SIDES[side].age < CM[size].first ? Q.age.replace('{name}', FK.SH[c].name).replace('{age}', D.ages[CM[size].first]) : !things().some((t) => t.side === side && t.code === CM[size].need && up(t)) ? Q.store : Q.tech;
  return campsOut(side, size) >= cap ? (cap === CA.one ? Q.one : Q.two).replace('{what}', what) : ''; }
// E500
const needs = (b) => !up(b) || b.hp < b.hpMax * CA.mend, hands = (u) => CA.build * FK.stat('', u.side, 'campbuild'), raiser = (u) => WAR.armed(u) && !CA.not.includes(FK.SH[u.code].class) && !u.target && !u.chg && !u.goingHome && (u.job === 'idle' || u.job === 'hold');
function campRaise(dt) { const S = things().filter((b) => b.camp && alive(b) && needs(b)), look = FK.every(CA.look), at1 = [];
  for (const u of units()) { if (u.job === 'raise') { const b = u.site; if (!b || b.gone || !needs(b) || u.target) { u.site = null; u.job = 'idle'; } else if (FK.atB(u, b)) { b.crew += hands(u); at1.push(u); } else if (!u.path && !FK.goBy(u, b)) u.job = 'idle'; continue; }
    if (!look || !S.length || !raiser(u)) continue; const taken = (b) => units().filter((v) => v.site === b && v.job === 'raise').length, by = (b) => dist(u, b) / D.tile + CA.crowd * taken(b), [b] = S.filter((q) => q.side === u.side && by(q) < CA.raise).sort((p, q) => by(p) - by(q));
    if (b) { Object.assign(u, { job: 'raise', then: 'raise', site: b, goal: null }); if (!FK.atB(u, b) && !FK.goBy(u, b)) u.job = 'idle'; } }
  for (const u of at1) { const b = u.site, T1 = FK.stat(b.code, b.side, 'build'), k = ((hands(u) * Math.pow(b.crew, D.crew)) / b.crew) * dt / T1;
    if (up(b)) b.hp = Math.min(b.hpMax, b.hp + ((b.hpMax * D.rising.rise * hands(u)) / T1) * dt); else { b.done = Math.min(CA.built, b.done + k); b.hp = up(b) ? b.hpMax : Math.min(b.hpMax, b.hp + b.hpMax * D.rising.rise * k); } } }
function sendHome(u) { const H1 = (t) => t.kind === 'bld' && t.side === u.side && FK.has(t, 'Heal') && up(t) && alive(t), tent = things().find((t) => H1(t) && t.camp && dist(t, u) < D.heal[t.code].r * D.tile), hosp = tent && things().find((t) => H1(t) && !t.camp); // E501
  if (!hosp) return; WAR.march(u, FK.tileAt(hosp.bx, hosp.by)); u.goingHome = true; if (u.side === ME) tell(CW.home, { name: FK.rankName(u.code, u.side) }); }
// E502
const depots = (side) => bldsOf(side, 'Supply').filter(alive), depotFor = (u) => depots(u.side).find((d) => dist(d, u) < CA.reach * D.tile) || null; let hungryT = -Infinity;
function camped(u, e) { const d = WAR.armed(u) && !u.inside && depotFor(u); if (!d) { u.unfed = false; return null; } if (d.supply >= e) { d.supply -= e; u.unfed = false; return e; }
  Object.assign(u, { unfed: true, tire: Math.min(u.tire ?? D.bases.pace, D.charge.slow) }); if (u.side === ME && FK.K.t - hungryT > CA.say) { hungryT = FK.K.t; tell(CW.hungry); } return null; }
function supply(u, beat) { const side = u.side, st = SIDES[side].store; let S = u.sup; // E503
  if (!S) { const h = beat && homeOf(u), [d] = h ? depots(side).filter((b) => b.supply < CA.supply * hf && !units().some((v) => v.sup && v.sup.d === b)).sort((a, b) => dist(a, h) - dist(b, h)) : []; if (!d) return false;
    const fee = Math.ceil((CA.fee * dist(h, d)) / (CA.per * D.tile)), food = Math.min(CA.load, Math.floor(st.food - CA.keep.food)); if (food < CA.least || st.gold < fee + CA.keep.gold) return false; S = u.sup = { d, h, leg: 'load', food, fee }; }
  if (S.d.gone || S.h.gone) return !!(u.sup = null);
  if (S.leg === 'load') { if (!toward(u, S.h)) return true; const food = Math.min(S.food, Math.floor(st.food)); if (food < CA.least || st.gold < S.fee) return !!(u.sup = null); spend(side, 'food', food, 'camps'); spend(side, 'gold', S.fee, 'camps'); Object.assign(S, { food, leg: 'go' }); return true; }
  if (S.leg === 'go') { if (!toward(u, S.d)) return true; S.d.supply = Math.min(CA.supply, S.d.supply + S.food); if (side === ME) tell(CW.stocked, { n: S.food, m: S.fee }); S.leg = 'back'; return true; }
  if (!toward(u, S.h)) return true; u.sup = null; return false; }
const tentCost = (side, b, c) => (b && b.camp && c ? Object.fromEntries(Object.entries(c).map(([y, n]) => [y, Math.round(n + n * CA.extra * FK.stat('', side, 'tentcost'))])) : c);
FK.on('tick', (dt) => { if (result) return; campRaise(dt); const send = FK.every(CA.send); // E504
  for (const u of units().slice()) { if (u.job === 'unpack' && !u.path) unpack(u); if (u.goingHome && u.job !== 'march') u.goingHome = false; if (send && WAR.armed(u) && !u.target && !u.goingHome && u.job !== 'rout' && (u.hp < u.hpMax * CA.home || u.sick)) sendHome(u); }
  if (FK.every(D.minute) && (FK.K.rain || FK.K.snowing || FK.K.temp <= D.frost.at)) for (const b of things()) if (b.camp && up(b) && alive(b)) b.hp = Math.max(CA.floor, b.hp - CA.wear * b.hpMax); });
// E505
const RL = D.relations, RG = D.regard, VA = D.vassal, DM = VA.demand, RW = fromBook('words').realm, SB = fromBook('sides'), [WARS, PEACE, ALLY] = SB.stances, [LO, HI] = VA.scale, notice = new Map(), gangs = new Map(), [ENVOY] = FK.ticked('Envoy');
const nameOf2 = (q) => (typeof q === 'string' ? SB.names[q] : EW.sides[q]), courts = () => D.players.filter((p) => !fell.has(p)), oddsOf = (q, o) => WAR.odds(WAR.armyOf(q), o), unally = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) if (SIDES[x].ally === y) SIDES[x].ally = null; };
const recallAt = (a, b) => { const w = WAR.waves[a], h = FK.seatOf(b); if (w && h && w.k === FK.tileAt(h.bx, h.by)) WAR.recall(a); };
function declareWar(a, b, why) { if (a === b || WAR.atWar(a, b)) return; const was = WAR.stance(a, b) === ALLY; WAR.treaty(a, b, WARS); notice.delete(a + ' ' + b); notice.delete(b + ' ' + a); unally(a, b);
  if (a === ME || b === ME) tell(RW.war, { side: nameOf2(a === ME ? b : a), was: was ? RW.broken : '', why }); else tell(RW.between, { a: nameOf2(a), b: nameOf2(b) }); }
function makePeace(a, b) { WAR.treaty(a, b, PEACE); unally(a, b); recallAt(a, b); recallAt(b, a); }
function makeAlly(a, b) { WAR.treaty(a, b, ALLY); SIDES[a].ally = b; SIDES[b].ally = a; if (a !== ME && b !== ME) tell(RW.allied, { a: nameOf2(a), b: nameOf2(b) }); }
const noticeLeft = (a, b) => Math.ceil(Math.max(notice.get(a + ' ' + b) ?? FK.K.t, FK.K.t) - FK.K.t);
function relWhy(o, q, want) { const W = RW.why, rel = WAR.stance(o, q), s = SIDES[o]; // E506
  if (typeof q === 'string') { if (want === rel) return W.already; if (want === WARS) return ''; const n = want === PEACE ? RG.peaceAt : RG.allyAt; return regardOf(o, q) < n ? W.regard.replace('{n}', n) : want === PEACE ? '' : envoyWhy(o, rel); }
  if (q === o || fell.has(q)) return W.now; if (SIDES[q].lord === o && !SIDES[q].rebel) return W.vassal; if (s.lord === q && !s.rebel) return W.lord; if (want === rel) return W.already;
  return want === WARS ? (noticeLeft(o, q) ? W.notice.replace('{n}', noticeLeft(o, q)) : '') : envoyWhy(o, rel, want); }
const envoyWhy = (o, rel, want = ALLY) => { const W = RW.why, c = D.cost[ENVOY]; return want === ALLY && rel === WARS ? W.peaceFirst : SIDES[o].envoyOut ? W.out : !FK.aged(ENVOY, o) ? W.age : !canPay(o, c) ? W.cost.replace('{cost}', Object.entries(c).map(([y, n]) => n + ' ' + y).join(fromBook('words').list.and)) : ''; };
function setRel(o, q, want) { if (relWhy(o, q, want)) return false; const rel = WAR.stance(o, q), g = typeof q === 'string' && gang(q);
  if (g && want !== ALLY) { g.warBy[o] = want === WARS; WAR.treaty(o, q, want); if (want === WARS) addRegard(o, q, -RG.warCost); return true; }
  if (want === WARS) { if (rel === ALLY) makePeace(o, q); notice.set(o + ' ' + q, FK.K.t + RL.notice); if (o === ME || q === ME) tell(RW.notice, { side: nameOf2(o === ME ? q : o), n: RL.notice }); return true; }
  notice.delete(o + ' ' + q); if (want === PEACE && rel === ALLY) { makePeace(o, q); if (q === ME) tell(RW.ended, { side: nameOf2(o) }); return true; } return sendEnvoy(o, q, want); }
const homeOf2 = (q, from) => { if (typeof q !== 'string') return FK.seatOf(q); const [v = null] = units().filter((v) => !SIDES[v.side] && WAR.groupOf(v) === q && v.hp > LO).sort((a, b) => dist(a, from) - dist(b, from)); return v; };
function sendEnvoy(o, to, ask) { const s = SIDES[o], k = FK.seatOf(o), tk = k && homeOf2(to, k); if (!tk || envoyWhy(o, WAR.stance(o, to), ask)) return false; const u = spawnBy(k, ENVOY); if (!u) return false; // E507
  pay(o, D.cost[ENVOY], 'units'); Object.assign(u, { job: 'envoy', to, ask }); Object.assign(s, { envoyOut: true, envoyAt: FK.K.t }); if (o === ME) tell(RW.sent, { side: nameOf2(to), what: RW.asks[ask] }); return true; }
function envoyTick(u) { const back = u.job === 'back', h = back ? FK.seatOf(u.side) : homeOf2(u.to, u); if (!h) { if (back) WAR.die(u); else u.job = 'back'; return; }
  if (h.kind === 'bld' ? FK.atB(u, h) : dist(u, h) / D.tile <= RL.at) { if (back) WAR.die(u); else judgeEnvoy(u.to, u.side, u); return; } if (!u.path && FK.K.t >= (u.go ?? -Infinity)) { u.go = FK.K.t + D.repath; if (!(h.kind === 'bld' ? FK.goBy(u, h) : FK.go(u, h.k))) u.job = 'back'; else u.then = u.job; } }
const reply = (from, u, w, o = {}) => { u.job = 'back'; if (from === ME) tell(w, { side: nameOf2(u.to), ...o }); };
function judgeEnvoy(to, from, u) { const A = RW.answer, ask = u.ask; if (WAR.stance(from, to) === WARS && ask !== PEACE) { WAR.die(u); if (from === ME) tell(A.killed, { side: nameOf2(to) }); return; } // E508
  if (typeof to === 'string') return judgeGang(to, from, u, ask); if (to === ME) { u.job = 'back'; tell(A.offer, { side: nameOf2(from), what: A.offers[ask] }); return; }
  const T = SIDES[to], busy = courts().some((q) => q !== from && q !== to && WAR.atWar(to, q)), them = oddsOf(to, from), lift = FK.stat('', from, 'diplo');
  if (ask === PEACE) { if (!WAR.atWar(to, from)) return reply(from, u, A.already); if (them > RL.peace + lift && !busy && !T.rebel) { const P1 = RL.truce, price = Math.round((P1.gold + P1.gold * P1.odds * them) / P1.round) * P1.round;
      if (SIDES[from].store.gold < price) return reply(from, u, A.more, { n: price }); spend(from, 'gold', price, 'tribute'); earn(to, 'gold', price, 'tribute'); makePeace(to, from); return reply(from, u, A.bought, { n: price }); }
    makePeace(to, from); return reply(from, u, A.peace); }
  if (T.ally != null && T.ally !== from) return reply(from, u, A.taken, { other: nameOf2(T.ally) }); if (T.ally === from) return reply(from, u, A.yours);
  if (oddsOf(from, to) < RL.weak) return reply(from, u, A.weak); if (!busy && them > RL.strong + lift) return reply(from, u, A.alone); makeAlly(to, from); reply(from, u, A.yes); }
function sendHelp(f, pt, told) { const mine = WAR.armyOf(f).filter((u) => u.job === 'idle' || u.job === 'hold'), keep = Math.ceil(mine.length * RL.help.keep), go = mine.filter((_, i) => i >= keep); if (!go.length || !pt) return false;
  for (const u of go) { WAR.march(u, FK.tileAt(pt.bx, pt.by)); u.helpT = FK.K.t; } if (told) tell(RW.help, { side: nameOf2(f), n: go.length }); return true; }
// E590
const FD = D.finds, WW = fromBook('words').wild, ONE = D.hazards.base, rowOf = FK.rowOf, list = (c) => Object.entries(c).map(([y, n]) => n + ' ' + y).join(fromBook('words').list.and);
function finds() { for (const t of things()) { const F = rowOf(t); if (!F || !F.got || t.taken || t.gone || WAR.guardsLeft(t)) continue; let m = null;
    FK.unitsNear(t, FD.take * D.tile, (v) => { if (!m && SIDES[v.side] && !v.gone && v.hp > null && !v.inside && !FK.has(v, 'Envoy') && !FK.has(v, 'Trade') && dist(v, t) < FD.take * D.tile) m = v; }); if (!m) continue;
    const o = m.side, s = SIDES[o], got = {}; for (const y in F.got) got[y] = Math.round(F.got[y]); t.taken = o; for (const y in got) earn(o, y, got[y], 'finds', false); let extra = '';
    const c = F.tech && Object.keys(T).find((c) => !s.techs.has(c) && T[c].value.age <= s.age && !T[c].value.rank && needsOf(c).every((n) => s.techs.has(n)) && !things().some((b) => b.side === o && (b.q || []).includes(c))); if (c) { learn(o, c); extra = WW.scroll.replace('{name}', T[c].name); }
    if (o === ME) tell(WW.took, { name: FK.SH[FK.KIND[t.kind].code].name, got: list(got), extra }); } }
function hireWhy(o, t) { const H = t && (rowOf(t) || {}).hire, W = WW.hire; if (!H || t.taken || t.gone) return W.gone; if (!units().some((u) => u.side === o && !u.gone && !FK.has(u, 'Envoy') && dist(u, t) < FD.near * D.tile)) return W.near; // E591
  return popOf(o, soldier) + H.n > armyRoom(o) ? W.full : canPay(o, H.cost) ? '' : W.cost.replace('{cost}', list(H.cost)); }
function hire(o, t) { if (hireWhy(o, t)) return false; const H = rowOf(t).hire; pay(o, H.cost, 'units'); t.taken = o;
  for (const v of units().slice()) if (v.find === t && !SIDES[v.side]) { const s = FK.spawn(H.unit, o, v.k, FK.rng); Object.assign(s, { bx: v.bx, by: v.by }); FK.place(s); FK.vanish(v); } if (o === ME) tell(WW.hire.done, { n: H.n }); return true; }
// E592
const FI = D.fire, HW = fromBook('words').harm, sq = (x) => x * x, eta = (r) => FI.eta.reduce((v, c, i) => v + c * r ** i, null), heat = (age, gap) => Math.min(FI.full, sq(age / FI.grow)) * sq(FI.near / (gap + FI.near)), chance = (rate, dt) => FK.rng() < -Math.expm1(-rate * dt);
const lit = new Set(), fireMul = () => Math.min(FI.most, eta(FK.K.wet) / eta(null)), bname = (b) => FK.SH[b.code].name.toLowerCase(), burnable = (b) => b.kind === 'bld' && FK.has(b, 'Burn') && up(b) && alive(b) && b.hp > null;
function ignite(b, why, from = '') { if (!burnable(b) || b.fire > null) return false; Object.assign(b, { fire: FI.full, fireT: FK.K.t, spread: why === 'spread', smoke: false, fc: FI.check }); lit.add(b); // E593
  const near = villagersOf(b.side).filter((v) => !v.inside && !v.douse && jobOf(v) !== 'build' && dist(v, b) / D.tile - b.n * D.place.half < FI.run).sort((p, q) => dist(p, b) - dist(q, b)).slice(null, FI.crew);
  for (const v of near) { buildAt(v, b, true); if (v.job !== 'idle') v.douse = b; } if (b.side === ME) tell(HW.fire.at, { b: bname(b), why: HW.fire.why[why].replace('{b}', from), who: HW.fire.who[near.length] }); return true; }
function douse(u, t, dt) { if (!t.smoke && (t.spread || t.hp < t.hpMax * D.place.half) && FK.rng() < FI.smoke * dt) { t.smoke = true; if (t.side === ME) tell(HW.fire.smoke, { b: bname(t) }); WAR.die(u); return; }
  t.fire = Math.max(null, t.fire - FI.douse * dt); if (!t.fire && t.side === ME) tell(HW.fire.out, { b: bname(t) }); }
function burn(dt) { const fm = fireMul(); for (const b of lit) { if (!(b.fire > null) || !alive(b)) { lit.delete(b); continue; } b.hp -= b.hpMax * FI.burn * dt * b.fire; // E594
    if (b.hp <= null) { if (b.side === ME) tell(HW.fire.down, { b: bname(b) }); WAR.die(b, null); continue; } b.fc -= dt; if (b.fc > null) continue; b.fc += FI.check; const age = FK.K.t - b.fireT;
    for (const c of things()) if (c !== b && burnable(c) && !(c.fire > null)) { const g = Math.max(null, dist(b, c) / D.tile - (b.n + c.n) * D.place.half); if (g < FI.reach && chance(FI.rate * fm * heat(age, g), FI.check)) ignite(c, 'spread'); } } }
function lightning() { const K = FK.K; if (FK.season() === FI.season && K.storm && K.wetHour) for (const side of D.players) if (!fell.has(side) && chance(FI.storm[+FK.hz('drought')], ONE)) { // E595
    const W = things().filter((b) => b.side === side && burnable(b)); if (W.length) { const b = W[Math.floor(FK.rng() * W.length)]; FK.bolt(b.vx, b.vy); ignite(b, 'lightning'); } }
  for (const b of things()) if (FI.forges.includes(b.code) && up(b) && alive(b) && chance(FI.sparks, ONE)) { let n = null; for (const c of things()) if (c !== b && c.side === b.side && burnable(c) && dist(c, b) < FI.spark * D.tile && (!n || dist(c, b) < dist(n, b))) n = c; if (n) ignite(n, 'sparks', bname(b)); } }
function shot(a, t, d) { if (!up(t) || !SIDES[a.side]) return; const F = FI.arrows, blast = FK.stat(a.code, a.side, 'blast') >= ONE; if (!(t.fire > null) && (blast || FK.stat(a.code, a.side, 'fire') >= ONE) && FK.rng() < (blast ? F.blast : F.chance) * fireMul()) ignite(t, 'shot');
  if (blast) for (const n of things().slice()) if (n !== t && n.kind === 'bld' && n.side === t.side && alive(n) && dist(n, t) < F.splash * D.tile) { n.hp -= d * F.hit; if (n.hp <= null) WAR.die(n, a); } }
// E596
const HE = D.health, [HBEAT] = D.beats.health; let plague = -Infinity;
const town = (side, k) => units().filter((u) => u.side === side && !u.inside && !u.gone && u.hp > null && (dist(u, k) < HE.near * D.tile || !!depotFor(u)));
const sickRisk = (side) => HE.risk * HE.seasons[FK.season()] * FK.stat('', side, 'sick') * FK.stat('', side, 'chill') ** (FK.season() === HE.winter);
function outbreak(side, share, pl) { const k = FK.seatOf(side); if (!k || fell.has(side)) return; const P = town(side, k).filter((u) => !(u.sick > FK.K.t)), n = Math.max(ONE, Math.round(P.length * share * FK.stat('', side, 'plague') ** !!pl));
  for (let i = n; i-- && P.length; ) { const [u] = P.splice(Math.floor(FK.rng() * P.length), ONE); Object.assign(u, { sick: FK.K.t + HE.sickFor, plague: !!pl }); } if (side === ME) tell(pl ? HW.sick.plague : HW.sick.ill, { n }); }
function health() { const now = FK.K.t, H = [...things().filter((b) => b.kind === 'bld' && FK.has(b, 'Heal') && up(b) && alive(b)), ...units().filter((u) => FK.has(u, 'Heal') && !u.gone && u.hp > null)]; // E597
  for (const side of D.players) { const s = SIDES[side]; if (fell.has(side)) continue; s.sickT = (s.sickT ?? HE.every) - HBEAT; if (s.sickT <= null) { s.sickT = HE.every; if (chance(sickRisk(side), ONE)) outbreak(side, null, false); } }
  for (const side of D.players) { const k = FK.seatOf(side); if (fell.has(side) || !k) continue; const S = []; let I = null, pl = false; for (const u of town(side, k)) if (u.sick > now) { I++; pl = pl || u.plague; } else S.push(u); if (!I || !S.length) continue;
    const x = (((HE.R0 * HE.plagueR0[+pl]) / HE.sickFor) * HBEAT * FK.stat('', side, 'spread') * S.length * I) / (I + S.length); let n = Math.floor(x); if (FK.rng() < x - n) n++;
    for (let i = n; i-- && S.length; ) { const [v] = S.splice(Math.floor(FK.rng() * S.length), ONE); Object.assign(v, { sick: now + HE.sickFor, plague: pl }); } }
  for (const u of units().slice()) { if (!(u.sick > now)) { if (u.sick) Object.assign(u, { sick: null, plague: false }); continue; } const o = u.side;
    if (H.some((h) => h.side === o && D.heal[h.code] && dist(h, u) < D.heal[h.code].r * D.tile) && FK.rng() < HE.cure * FK.stat('', o, 'cure')) { Object.assign(u, { sick: null, plague: false }); continue; }
    if ((!u.plague || ~~SIDES[o].plagueDead < Math.max(ONE, popOf(o) * HE.plagueCap)) && FK.rng() < HE.death * HE.plagueDeath[+!!u.plague] * FK.stat('', o, 'death')) { if (u.plague) SIDES[o].plagueDead = -~SIDES[o].plagueDead; WAR.die(u); } } }
FK.on('start', () => { plague = -Infinity; lit.clear(); for (const s of SIDES) s.sickT = s.plagueDead = null; });
// E509
const gang = (g) => gangs.get(g) || gangs.set(g, { regard: SIDES.map(() => RG.regard0), gifts: SIDES.map(() => []), warBy: {}, hitT: {} }).get(g), regardOf = (o, g) => gang(g).regard[o];
function addRegard(o, g, d) { const R = gang(g), [lo, hi] = RG.scale; R.regard[o] = Math.min(hi, Math.max(lo, R.regard[o] + d)); gangSync(o, g); }
function gangSync(o, g) { if (!SIDES[o] || fell.has(o)) return; const r = regardOf(o, g), rel = WAR.stance(o, g), R = gang(g), side = SB.names[g];
  if (rel === ALLY) { if (r < RG.allyAt - RG.slack) { WAR.treaty(o, g, PEACE); if (o === ME) tell(RW.gang.end, { side }); } return; }
  if (R.warBy[o] && r >= RG.allyAt) R.warBy[o] = false; const want = R.warBy[o] || r < RG.peaceAt ? WARS : PEACE; if (want !== rel) { WAR.treaty(o, g, want); if (o === ME) tell(RW.gang[want], { side, n: RG.peaceAt }); } }
const giftsRecent = (o, g) => gang(g).gifts[o].filter((t) => FK.K.t - t < RG.giftWindow).length, giftGain = (o, amt, g) => Math.max(RG.floor, Math.round(amt / (RG.per + RG.per * RG.danegeld * giftsRecent(o, g)))); // E510
const giftWhy = (o, amt, g) => (SB.seat[g] && !things().some((t) => t.code === SB.seat[g] && alive(t)) ? RW.why.throne : SIDES[o].store.gold < amt ? RW.why.gold.replace('{n}', amt) : '');
function giveGift(o, amt, g) { if (giftWhy(o, amt, g)) return false; const m = giftGain(o, amt, g); spend(o, 'gold', amt, 'tribute'); gang(g).gifts[o].push(FK.K.t); addRegard(o, g, m); if (o === ME) tell(RW.gang.gift, { side: SB.names[g], n: amt, m, more: giftsRecent(o, g) > RG.floor ? RW.gang.more : '' }); return true; }
function judgeGang(g, from, u, ask) { const A = RW.answer; if (ask !== ALLY) return reply(from, u, A.words); if (regardOf(from, g) < RG.allyAt) return reply(from, u, A.low, { n: Math.round(regardOf(from, g)), of: RG.allyAt }); WAR.treaty(from, g, ALLY); reply(from, u, A.friend); }
const struck = (o, g) => { if (!(g in SB.groups)) return; const R = gang(g); if (FK.K.t - (R.hitT[o] ?? -Infinity) > RG.hitGap) { R.hitT[o] = FK.K.t; addRegard(o, g, -RG.hitCost); } };
// E511
const VW = RW.vassal, vassalsOf = (L) => courts().filter((p) => SIDES[p].lord === L), ruled = (L, q) => SIDES[q].lord === L && !SIDES[q].rebel;
const shareUp = (side, gold) => { const s = SIDES[side]; if (s.lord == null || s.rebel || s.loyal < VA.shareAt || !(gold > LO)) return gold; const x = gold * VA.share; earn(s.lord, 'gold', x, 'tribute'); return gold - x; };
function loyaltyParts(q) { const s = SIDES[q], k = FK.seatOf(q), r = VA.r * D.tile; if (!k) return { invest: LO, garrison: LO, protect: LO, hate: LO, target: LO };
  const invest = things().filter((b) => b.kind === 'bld' && b.side === s.lord && up(b) && alive(b) && dist(b, k) < r).reduce((n, b) => n + (D.invest[b.code] ?? VA.invest), LO), garrison = Math.min(VA.garrisonMax, units().filter((u) => u.side === s.lord && soldier(u.code) && dist(u, k) < r).length * VA.garrison);
  const protect = Math.round(s.protect || LO), hate = VA.tribute.hate; return { invest, garrison, protect, hate, target: Math.min(HI, Math.max(LO, VA.base + invest + garrison + protect - hate)) }; }
function makeVassal(q, L, light) { const s = SIDES[q]; Object.assign(s, { lord: L, unrest: VA.unrest0, loyal: light ? VA.light : VA.loyal0, protect: LO, base: s.gathered, rebel: null, paid: LO, forced: null, demands: [] }); // E512
  for (const r of D.players) if (r !== q) WAR.treaty(q, r, r === L ? ALLY : WAR.atWar(L, r) ? WARS : PEACE); if (WAR.waves[q]) WAR.recall(q); recallAt(L, q); tell(L === ME ? VW.kneel : VW.became, { side: nameOf2(q), lord: nameOf2(L) }); }
function surrenderWhy(o, q) { const W = RW.why, k = FK.seatOf(q), V = VA.surrender; if (!k || fell.has(q) || SIDES[q].lord === o) return W.now; if (!WAR.atWar(o, q)) return W.enemy;
  const mine = WAR.armyOf(o).filter((u) => dist(u, k) < V.r * D.tile); return mine.length < V.men ? W.men.replace('{n}', V.men) : WAR.power(WAR.armyOf(q)) > WAR.power(mine) * V.strong ? W.strong : ''; }
const demandSurrender = (o, q) => { const why = surrenderWhy(o, q); if (why) { if (o === ME) tell(why); return false; } makeVassal(q, o); return true; };
const overlordWhy = (o, q) => (fell.has(q) || WAR.stance(o, q) !== ALLY ? RW.why.ally : WAR.power(WAR.armyOf(o)) < RL.overlord * WAR.power(WAR.armyOf(q)) ? RW.why.twice : '');
function offerOverlord(o, q) { if (overlordWhy(o, q)) return false; makeVassal(q, o, true); return true; }
function breakTies(L, q) { const s = SIDES[q]; if (s.lord !== L) return false; s.lord = s.rebel = null; levyOf(L, q).forEach(releaseLevy); for (const v of vassalsOf(L)) SIDES[v].unrest = Math.min(HI, SIDES[v].unrest + DM.tributeUnrest); declareWar(L, q, L === ME ? VW.cut : VW.cuts.replace('{side}', nameOf2(L))); return true; } // E513
const demandCost = (q) => DM.loyal + DM.loyal * SIDES[q].demands.filter((t) => FK.K.t - t < DM.recent).length, demandWhy = (L, q, y) => (!ruled(L, q) ? RW.why.now : !(SIDES[q].store[y] > LO) ? RW.why.none.replace('{what}', y) : '');
function demand(L, q, y) { if (demandWhy(L, q, y)) return false; const s = SIDES[q], x = Math.min(DM.amt, Math.floor(s.store[y])), m = demandCost(q); spend(q, y, x, 'tribute'); earn(L, y, x, 'tribute'); s.loyal = Math.max(LO, s.loyal - m); s.demands.push(FK.K.t); if (L === ME) tell(VW.demand, { side: nameOf2(q), n: x, what: y, m }); return true; }
const menAt = (L, q) => { const k = FK.seatOf(q); return k ? WAR.armyOf(L).filter((u) => dist(u, k) < VA.r * D.tile).length : LO; };
const tributeWhy = (L, q) => (!ruled(L, q) ? RW.why.now : SIDES[q].forced > FK.K.t ? RW.why.forced.replace('{n}', Math.ceil(SIDES[q].forced - FK.K.t)) : menAt(L, q) < DM.tributeMen ? RW.why.men2.replace('{n}', DM.tributeMen) : '');
function forceTribute(L, q) { if (tributeWhy(L, q)) return false; const s = SIDES[q]; s.forced = FK.K.t + DM.tribute; s.unrest = Math.min(HI, s.unrest + DM.tributeUnrest); if (L === ME) tell(VW.forced, { side: nameOf2(q), n: DM.tribute / MINUTE }); return true; }
const levyOf = (L, q) => units().filter((u) => u.side === L && u.levy === q), atHome1 = (q) => WAR.armyOf(q).filter((u) => u.job === 'idle' || u.job === 'hold'), levyRoom = (L, q) => Math.max(LO, Math.ceil((WAR.armyOf(q).length + levyOf(L, q).length) * DM.levyMax) - levyOf(L, q).length);
const levyWhy = (L, q, n) => (!ruled(L, q) ? RW.why.now : !atHome1(q).length ? RW.why.home : n < DM.least || n > levyRoom(L, q) ? RW.why.half : '');
function levy(L, q, n) { if (levyWhy(L, q, n)) return false; const go = atHome1(q).filter((_, i) => i < n), k = FK.seatOf(L); for (const u of go) { Object.assign(u, { side: L, levy: q, home: null, target: null }); if (k) WAR.march(u, FK.tileAt(k.bx, k.by)); } if (L === ME) { WAR.rebattalion(); tell(VW.levy, { n: go.length, side: nameOf2(q) }); } return true; }
const releaseLevy = (u) => Object.assign(u, { side: u.levy, levy: null, job: 'idle', target: null, focus: null, bn: null, ord: null }), releaseAll = (L, q) => { const S = levyOf(L, q); S.forEach(releaseLevy); if (L === ME && S.length) tell(VW.home, { n: S.length, side: nameOf2(q) }); return S.length > LO; };
function rebel(q, coalition) { const s = SIDES[q], L = s.lord, k = FK.seatOf(L), V = villagersOf(q), n = Math.ceil(V.length * VA.rise); if (s.rebel || !FK.seatOf(q)) return; levyOf(L, q).forEach(releaseLevy); WAR.treaty(q, L, WARS); // E514
  for (const v of V.filter((_, i) => i < n)) { const r = FK.spawn(VA.rebel, q, v.k, FK.rng); Object.assign(r, { bx: v.bx, by: v.by, rebel: true }); FK.place(r); WAR.die(v); if (k) WAR.march(r, FK.tileAt(k.bx, k.by)); }
  if (k) WAR.attack(q, FK.tileAt(k.bx, k.by)); s.rebel = { t0: FK.K.t, n0: WAR.armyOf(q).length || VA.n0 }; if (L === ME) tell(coalition ? VW.rise : VW.rebel, { n: coalition ? n : VA.freeAfter / MINUTE, side: nameOf2(q) }); }
function vassals() { for (const q of D.players) { const s = SIDES[q], L = s.lord; if (L == null || fell.has(q)) continue; if (fell.has(L)) { s.lord = s.rebel = null; continue; } // E515
    if (s.rebel) { if (WAR.armyOf(q).length < s.rebel.n0 * VA.crushed) { Object.assign(s, { rebel: null, unrest: VA.after, loyal: Math.max(LO, s.loyal - VA.lost) }); WAR.treaty(q, L, ALLY); for (const u of units().slice()) if (u.side === q && u.rebel) WAR.die(u); if (WAR.waves[q]) WAR.recall(q); if (L === ME) tell(VW.crushed, { side: nameOf2(q) }); }
      else if (FK.K.t - s.rebel.t0 > VA.freeAfter) { s.rebel = s.lord = null; levyOf(L, q).forEach(releaseLevy); if (L === ME) tell(VW.free, { side: nameOf2(q) }); } continue; }
    if (!FK.seatOf(L)) levyOf(L, q).forEach(releaseLevy); const st = s.store, forced = +(s.forced > FK.K.t), take = Math.max(LO, s.gathered - s.base) * VA.tribute.take * VA.forced[forced], tot = YIELDS.reduce((n, y) => n + st[y], LO); s.base = s.gathered; s.paid = LO;
    if (tot && take) for (const y of YIELDS) { const x = Math.min(st[y], (take * st[y]) / tot); spend(q, y, x, 'tribute'); earn(L, y, x, 'tribute'); s.paid += x; }
    s.protect = (s.protect || LO) * VA.decay; s.loyal = FK.relax(s.loyal, loyaltyParts(q).target, VA.tau, SLOW); s.unrest = Math.min(HI, Math.max(LO, s.unrest + VA.tribute.push + VA.push[forced] - s.loyal / VA.calm));
    if (s.loyal >= VA.giftAt && FK.every(VA.gift)) { const g = {}; for (const y of YIELDS) { const x = Math.floor((st[y] * VA.giftShare * (s.loyal - VA.giftFrom)) / HI); if (x) { spend(q, y, x, 'tribute'); earn(L, y, x, 'tribute'); g[y] = x; } } if (L === ME && Object.keys(g).length) tell(VW.gift, { side: nameOf2(q), what: Object.entries(g).map(([y, x]) => x + ' ' + y).join(fromBook('words').list.and) }); }
    if (L === ME && s.unrest > VA.warn && FK.K.t - (s.warnT ?? -Infinity) > VA.warnGap) { s.warnT = FK.K.t; tell(VW.unrest, { side: nameOf2(q), n: Math.round(s.unrest) }); } if (s.unrest >= HI) rebel(q); }
  const CO = VA.coalition; if (FK.every(CO.beat)) for (const L of D.players) { const V = vassalsOf(L).filter((q) => !SIDES[q].rebel); if (V.length < CO.least) continue; const risk = V.reduce((n, q) => n + (SIDES[q].unrest / HI) ** CO.pow, LO) * CO.k * V.length;
    if (L === ME && risk > CO.warn && FK.K.t - (SIDES[L].coalT ?? -Infinity) > CO.gap) { SIDES[L].coalT = FK.K.t; tell(VW.talk); }
    if (FK.rng() < risk) { const R = V.filter((q) => SIDES[q].unrest >= CO.rise); if (R.length >= CO.least) { for (const a of R) for (const b of R) if (a !== b) WAR.treaty(a, b, ALLY); R.forEach((q) => rebel(q, true)); } } } }
FK.on('start', () => { notice.clear(); gangs.clear(); hungryT = -Infinity; }); // E516
FK.on('tick', () => { if (result) return; for (const [k, t] of [...notice]) if (FK.K.t >= t) { const [a, b] = k.split(' ').map(Number); declareWar(a, b, RW.noticed); } for (const u of units().slice()) if (FK.has(u, 'Envoy') && !u.gone) envoyTick(u); if (FK.every(D.beats.slow)) vassals(); });
FK.on('gone', (t) => { if (t.kind !== 'unit' || !SIDES[t.side]) return; if (FK.has(t, 'Envoy')) SIDES[t.side].envoyOut = false; if (t.levy != null) SIDES[t.levy].loyal = Math.max(LO, (SIDES[t.levy].loyal || LO) - DM.levyLoyal); // E517
  if (t.killer != null && soldier(t.code)) for (const q of vassalsOf(t.killer)) { const k = FK.seatOf(q); if (!SIDES[q].rebel && WAR.atWar(q, t.side) && k && dist(t, k) < VA.r * D.tile) SIDES[q].protect = Math.min(VA.protectMax, (SIDES[q].protect || LO) + VA.kill); } });
// E625
const PZ = D.peace, PW = fromBook('words').peace, MW2 = fromBook('words').mail, chron = []; let truceT = null, opened = false, stood = false, deal = null;
const peaceAll = (side) => !D.players.some((q) => q !== side && !fell.has(q) && (WAR.atWar(side, q) || noticeLeft(side, q) || noticeLeft(q, side)));
const truceAll = () => D.players.every((a) => fell.has(a) || peaceAll(a)), truceFor = () => (truceT == null ? null : FK.K.t - truceT), fill = (w, o) => w.replace(/\{(\w+)\}/g, (_, x) => o[x] ?? ''); // E626
function note(w, o = {}) { chron.push({ t: Math.round(FK.K.t), text: fill(w, o) }); if (chron.length > PZ.chron) chron.shift(); } // E627
function standDown(side, quiet) { const h = FK.seatOf(side), S = WAR.armyOf(side).filter((u) => !u.ord && !u.inside), go = S.slice(side === ME ? Math.ceil(S.length * PZ.stand.keep) : AI.aim(side)); if (!h || !go.length) return null; // E628
  for (const u of go) { const us = units(); us.splice(us.indexOf(u), ONE); u.gone = true; FK.fire('gone', u); const [vil] = FK.trains(h.code), v = FK.spawn(vil, side, u.k, FK.rng), r = side === ME && SIDES[side].rally, f = r && bestFind(v, r); if (f) gatherAt(v, f); }
  const o = { n: go.length, side: EW.sides[side] }; if (side === ME) tell(PW.stood, o, { grp: 'chronicle', cls: 'good' }); else if (!quiet) tell(PW.they, o, { grp: 'chronicle' }); note(PW.chron.stood, o); return go.length; }
function peaceTick() { const was = truceT; if (truceAll()) { if (truceT == null) { truceT = FK.K.t; if (FK.K.t > PZ.quiet) { tell(PW.truce, {}, { grp: 'realm', cls: 'soft' }); note(PW.chron.truce); } } } else if (truceT != null) { truceT = null; stood = false; } // E629
  const age = D.ages[D.age.hidden]; if (!opened && truceFor() >= PZ.years * D.year) { opened = true; tell(PW.opens, { age }, { grp: 'realm', cls: 'good' }); note(PW.chron.opened, { age }); }
  if (truceT != null && !stood && truceFor() >= PZ.stand.after) { stood = true; for (const side of D.players) if (side !== ME && !fell.has(side)) standDown(side, true); } return was !== truceT; }
function crowns() { const L = D.players, out = {}, pts = Object.fromEntries(L.map((s) => [s, null])), care = (s) => things().filter((t) => t.side === s && t.kind === 'bld' && up(t) && FK.has(t, 'Care')).length; // E630
  const val = { wealth: (s) => Math.round(SIDES[s].gathered), war: (s) => Math.round(SIDES[s].war), wellbeing: (s) => Math.round(SIDES[s].laurels * PZ.crown.laurel + (fell.has(s) ? null : villagersOf(s).filter((u) => !(u.sick > FK.K.t)).length * PZ.crown.people + care(s) * PZ.crown.bld)) };
  for (const c in val) { const R = L.map((side) => ({ side, v: val[c](side) })).sort((a, b) => b.v - a.v); R.forEach((r, i) => (pts[r.side] += r.v > null ? L.length - ONE - i : null)); out[c] = R; }
  out.overall = L.map((side) => ({ side, v: pts[side], tie: score(side).total })).sort((a, b) => b.v - a.v || b.tie - a.tie); return out; }
function enlightened(side) { const last = Object.keys(T).filter((c) => T[c].value.age === D.age.hidden && !T[c].value.civ); if (result || !last.every((c) => SIDES[side].techs.has(c))) return; const o = { side: EW.sides[side], age: D.ages[D.age.hidden] }; note(PW.chron.done, o); finish(true, PW.done, o); } // E631
function setCiv(side, civ) { SIDES[side].civ = civ; const g = Object.keys(T).find((c) => T[c].value.given && T[c].value.civ === civ); if (g) learn(side, g); } // E632
FK.on('start', () => { truceT = null; opened = stood = false; chron.length = null; if (deal) D.players.forEach((side, i) => setCiv(side, deal[i])); deal = null; });
FK.on('tick', () => { if (!result && FK.every(D.peaceBeat)) peaceTick(); });
FK.on('gone', (t) => { const by = t.killer ?? t.by; if (SIDES[by] && SIDES[t.side] && by !== t.side) SIDES[by].war += sumCost(D.cost[t.code]); }); // E633
FK.on('event', (e, t, a) => { const foe = e === 'struck' ? a && a.side : t && t.by; if ((e === 'struck' || e === 'fell') && t.side === ME && SIDES[foe] && WAR.atWar(ME, foe)) tell(e === 'fell' ? MW2.lost : MW2.raid, { b: FK.SH[t.code].name.toLowerCase(), at: MENU.coord(t.bx, t.by) }, { at: e === 'struck' ? a : t, cls: MW2.urgent, grp: 'war' }); }); // E634
const investText = () => { const by = {}; for (const [c, n] of Object.entries(D.invest)) (by[n] = by[n] || []).push(FK.SH[c].name.toLowerCase()); return Object.keys(by).sort((a, b) => a - b).map((n) => by[n].join(fromBook('words').list.and) + ' ' + n).join('; ') + RW.investRest.replace('{n}', VA.invest); };
// E663
const SCN = D.scenarios, WT = fromBook('words').start, nearTiles = (x, y, r) => { const got = []; FK.stamp(x, y, r, (k, d) => got.push([d, k])); return got.sort(([a], [b]) => a - b).map(([, k]) => k); };
function raise(side, code, x, y, r) { const k = nearTiles(x, y, r).find((q) => canPlace(code, ...at(q), side)); if (k == null) return null; const t = FK.build(code, ...at(k), SIDES[side].col); if (t) t.hp = t.hpMax = WAR.hpMax(t); return t; }
function people(side, code, n, x, y, r) { const used = new Set(FK.units().map((u) => u.k)); for (const k of nearTiles(x, y, r)) { if (n <= null) return; if (FK.walkable(k) && !used.has(k)) { FK.spawn(code, side, k, FK.rng); used.add(k); n--; } } }
function applyScenario(key) { const sc = SCN[key], h = FK.seatOf(ME); if (!sc || !h || !Object.keys(sc).length) return; // E664
  for (const side of sc.all ? D.players : [ME]) { const s = SIDES[side], grant = (c) => { if (!T[c] || s.techs.has(c)) return; needsOf(c).forEach(grant); learn(side, c); }; s.age = Math.max(s.age, sc.age || null); for (const y in sc.store) s.store[y] = Math.max(s.store[y], sc.store[y]); (sc.techs || []).forEach((k) => grant(TK[k])); }
  for (const q of D.players) if (q !== ME) { WAR.treaty(ME, q, sc.rel); for (const r of D.players) if (sc.among && r !== ME && r !== q) WAR.treaty(q, r, sc.among); }
  for (const [code, dx] of sc.blds || []) raise(ME, code, h.bx + dx, h.by, sc.within); const [vil] = D.trains[h.code]; if (sc.vils) people(ME, vil, sc.vils, h.bx, h.by, sc.within);
  limit = sc.len || Infinity; const [name, line] = WT.scen[key]; tell(`${name}: ${line}`, { n: D.villagers }, { grp: 'realm', cls: 'soft' }); }
function testField() { const F = D.testField, [, foe] = D.players, h = FK.seatOf(ME), s = SIDES[ME], [rx, ry] = [FK.MID - h.bx, FK.MID - h.by], len = Math.hypot(rx, ry), [ux, uy] = [rx / len, ry / len]; // E665
  for (const side of D.players) if (side !== ME && side !== foe) { fell.add(side); for (const t of things().filter((b) => b.side === side)) FK.unbuild(t); for (const u of FK.units().filter((v) => v.side === side)) FK.vanish(u); }
  WAR.treaty(ME, foe, WARS); for (const y in s.store) s.store[y] = F.store; s.age = Math.max(s.age, F.age); F.techs.forEach((k) => { if (T[TK[k]]) learn(ME, TK[k]); });
  F.army.forEach(([r, list], n) => list.forEach(([code, m], j) => { const d = r + j * F.row; people(n ? foe : ME, code, m, h.bx + ux * d, h.by + uy * d, m * F.file); }));
  tell(WT.test, {}, { grp: 'realm', cls: 'soft' }); }
FK.on('begin', () => { tell(WT.land, { land: WT.lands[FK.land()] }, { grp: 'realm' }); if (FK.TEST) testField(); else if (!MENU.daily()) applyScenario(MENU.scen()); });
FK.on('save', (X) => { if (result) return true; X.econ = { bell, limit, turned, harvest, emg, warnT, prisoners, stock, plague, hungryT, truceT, opened, stood, deal, fell, rang, lit, notice, gangs, scares, chron }; }); // E666
FK.on('load', ({ econ: E }) => { ({ bell, limit, turned, harvest, emg, warnT, prisoners, stock, plague, hungryT, truceT, opened, stood, deal } = E); const keep = { fell, rang, lit, notice, gangs, scares, chron }; for (const k in keep) FK.refill(keep[k], E[k]); });
return { priceOf, peaceAll, truceAll, truceFor, opened: () => opened, peaceTick, standDown, crowns, chron, setCiv, deal: (d) => { deal = d; }, finds, hireWhy, hire, ignite, douse, burn, lightning, shot, fireMul, eta, heat, sickRisk, outbreak, health, plague: () => plague, campLayout, campCells, campWhy, campCap, campsOut, campWhyTrain, campOf, unpack, sendWagon, depots, supply, tentCost, declareWar, makePeace, makeAlly, noticeLeft, relWhy, envoyWhy, setRel, sendEnvoy, judgeEnvoy, sendHelp, regardOf, addRegard, giftGain, giftWhy, giveGift, struck, vassalsOf, shareUp, loyaltyParts, makeVassal, surrenderWhy, demandSurrender, overlordWhy, offerOverlord, breakTies, demandCost, demandWhy, demand, tributeWhy, forceTribute, levyOf, levyRoom, levyWhy, levy, releaseLevy, releaseAll, rebel, vassals, investText, tell, nameOf2, stock: () => stock, goingPrice, sellPrice, buyPrice, marketTrade, debase, venture, returnOf, interest, makeOf, setMake, scaleOf, stops, postOn, priceAt, cargo, estPay, setRoute, bestTarget, allyMarket, guarded, teachTo, teachCost, teachSecs, teachWhy, teach, graduate, takePrisoner, prisonersOf, payRansom, ransomOf, zealCost, zealWhy, zeal, intel, threat, alarm, allClear, alarmOn: () => !!emg, unsafe, dangerWhy, within, hold, fall, fell: (side) => fell.has(side), eats, hungerOf, docked, orderCost, nature, upkeep, seasonTurn, rateOf, harvest: () => harvest.m, replantCost, replantWhy, replant, cutOut, replantAll, hunt, at, capWhy, placeWhy, snap, refund, repairCost, wallLine, lay, sealPath, wallish, autoBuilder, room, lineFor, forage, forageNow, capOf, searchR, boxCut, sendOut, posted, idlePost, startWork, setBell: (s) => { limit = s; }, bell: () => limit, plan, cancel, canPlace, canPay, pay, payBack, earn, spend, addRes, sumCost, flowOf, outOf, netOf, velOf, queue, unqueue, timeOf, nameOf, musterN, musterCost, musterWhy, muster, ageUp, ageCost, nextAge, research, researchWhy, lineOf, prevOf, needsOf, nextStep, assign, jobs, jobOf, popOf, popCap, armyRoom, armyFull, soldier, villagersOf, gatherAt, buildAt, carry, idle, bestFind, yieldOf, up, score, time: () => bell, result: () => result, YIELDS };
})();
