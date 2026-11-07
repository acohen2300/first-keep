'use strict';
// E241
window.AI = (() => {
const { D, B, SIDES, N } = FK;
// E170
const things = FK.things, units = FK.units, Y = ECON.YIELDS, [FOOD, WOOD, GOLD, STONE, IRON] = Y, A = D.ai, AT = A.turn, RG = A.ring, WV = A.wave, SV = A.save, CO = AT.counter, EC = AT.econ, [MINUTE] = D.minute;
const clock = SIDES.map(() => 0), mind = SIDES.map(() => ({})), of = (x) => x || 0, per = (side) => A.pers[A.pers.of[side]];
const home = FK.seatOf, born = (h) => FK.trains(h.code)[0]; // E242
const bought = FK.bought; // E243
const [HOUSE] = bought('House'), [WALL] = bought('Line'), [GATE] = bought('Gate'), [WONDER] = bought('Wonder'), [MARKET] = bought('Trade'), [PASTURE] = bought('Flock'), [POST] = bought('Post'), [TOWER] = bought('Shoot').filter((c) => FK.has({ code: c }, 'Hold'));
const WP = D.ai.walls, rings = new Map(), TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])), SHOP = Object.keys(D.makes).find((c) => D.makes[c][EC.beer]);
const camps = Object.fromEntries(Y.map((y) => [y, bought('Drop-off').find((c) => !FK.ticked('Shore').includes(c) && (FK.SH[c].drop || []).includes(y))])); // E244
const dist = FK.dist, tick = (c, k) => FK.has({ code: c }, k), kindOf = (k) => Object.keys(D.train).find((c) => tick(c, k) && tick(c, 'Walk'));
let DF = A.diff[MENU.S.opt.diff];
// E245
function spot(code, bx, by, rmin = 0, side, rmax = D.ai.reach) { const n = B[code][1], [sx, sy] = FK.fromBoard(bx, by), ci = Math.floor(sx / D.tile - n / 2), cj = Math.floor(sy / D.tile - n / 2);
  for (let r = rmin; r < rmax; r++) for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i += j === cj - r || j === cj + r ? 1 : 2 * r) if (ECON.canPlace(code, i, j, side)) return [i, j]; return null; }
function raise(side, code, bx, by, rmin, rmax) { const at = spot(code, bx, by, rmin, side, rmax); if (!at) return null; const t = ECON.plan(side, code, ...at); if (!t) return null; let n = 0; for (const u of ECON.villagersOf(side).sort((a, b) => dist(a, t) - dist(b, t))) if (n < D.ai.builders && (u.job === 'idle' || u.job === 'wait' || ECON.jobOf(u) !== 'build')) { ECON.buildAt(u, t); n++; } return t; }
function wallPlan(h) { const H = D.place.half, R = WP.ring + H, ci = h.i + h.n * H, cj = h.j + h.n * H, mid = FK.MID / D.tile, base = Math.atan2(mid - cj, mid - ci), off = new Map(); let pi = null, pj = null; // E331
  const add = (i, j) => { const a = Math.atan2(j + H - cj, i + H - ci) - base; if (!off.has(j * N + i)) off.set(j * N + i, Math.abs(Math.atan2(Math.sin(a), Math.cos(a)))); };
  for (let s = -WP.steps; s <= WP.steps; s++) { const a = base + s * WP.step, i = Math.floor(ci + Math.cos(a) * R), j = Math.floor(cj + Math.sin(a) * R); if (pi !== null && i !== pi && j !== pj) add(i, pj); add(i, j); [pi, pj] = [i, j]; }
  const ks = [...off.keys()], gates = ks.slice().sort((a, b) => off.get(a) - off.get(b)).filter((k, n) => n < WP.gates); return [...gates.map((k) => [k, GATE]), ...ks.filter((k) => !gates.includes(k)).map((k) => [k, WALL])]; }
// E434
const AB = D.choke.ai, CK = D.choke, claimT = new Map();
function gapOnRoad(a, b) { const T = D.tile, L = dist(a, b), ux = (b.bx - a.bx) / L, uy = (b.by - a.by) / L, open = (x, y) => FK.walkable(FK.tileAt(x, y)); let best = null;
  for (let t = AB.from * T; t < L * D.place.half; t += AB.step * T) { const x = a.bx + ux * t, y = a.by + uy * t; if (!open(x, y)) continue; let w = CK.min;
    for (const s of [CK.min, -CK.min]) for (let i = CK.min; i <= AB.max && open(x - uy * s * i * T, y + ux * s * i * T); i++) w++;
    if (w >= AB.min && w <= AB.max && (!best || w < best.w)) best = { x, y, w, f: [ux, uy] }; }
  return best; }
function chokeClaim(side, enemy) { const t = FK.K.t; if (claimT.get(side) > t) return; claimT.set(side, t + AB.every); const k = home(side), f = home(enemy); if (!k || !f) return; // E435
  const foot = WAR.armyOf(side).filter((u) => u.job === 'idle' && !u.target && !AB.not.includes(FK.SH[u.code].class)); if (foot.length < AB.foot) return; const g = gapOnRoad(k, f); if (!g) return;
  WAR.dress(foot.filter((_, i) => i < g.w * AB.files), FK.tileAt(g.x, g.y), 'choke', { t0: t, until: t + AB.hold, cols: Math.min(CK.max, Math.max(CK.min, g.w)), f: g.f }); }
// E525
const total = (xs, f) => xs.reduce((n, x) => n + f(x), 0), pos = (x) => Math.max(0, x), up = ECON.up;
const blds = (side, code) => things().filter((t) => t.kind === 'bld' && t.side === side && (!code || t.code === code)), count = (side, code) => blds(side, code).length, rising = (side, code) => blds(side, code).some((t) => !up(t));
const ready = (side, code) => blds(side, code).filter(up), lineOf = (t) => of(t.q && t.q.length), trainers = (side, code) => ready(side).filter((t) => FK.trains(t.code, side).includes(code)).sort((a, b) => lineOf(a) - lineOf(b));
const train = (side, code) => { const [b] = code ? trainers(side, code) : []; return !!b && ECON.queue(b, code); }, queued = (side, ok) => total(blds(side), (t) => (t.q || []).filter((c) => FK.SH[c] && ok(c)).length);
const mine = (side, ok) => units().filter((u) => u.side === side && ok(u.code)).length + queued(side, ok), inArmy = (side) => mine(side, ECON.soldier), is = (c) => (x) => x === c;
// E526
const left = () => pos(ECON.bell() - ECON.time()), probe = (side, wild, h = home(side)) => ({ kind: 'unit', code: born(h), side, bx: h.bx, by: h.by, wild });
function rateFrom(side, y, wild) { const u = probe(side, wild), t = ECON.bestFind(u, y); return of(t && ECON.forage(u, t, FK.dropFor(u, y))); }
function plotPays(side, code) { const h = home(side), y = A.plots[code], [, n] = B[code], t = { kind: 'bld', code, side, done: 1, make: y, fert: D.soil.full, n, bx: h.bx, by: h.by + total(RG.plot, Number) * D.place.half * D.tile };
  const plot = ECON.forage(probe(side), t, FK.dropFor(t, y)), wild = rateFrom(side, y, true); return plot > wild && (plot - wild) * left() > ECON.sumCost(D.cost[code]); }
function needOf(side, vs, cost, draw) { const s = SIDES[side], plan = {};
  for (const y of Y) { const on = vs.filter((v) => ECON.jobOf(v) === y), got = on.map(ECON.forageNow).filter(pos), rho = got.length ? total(got, Number) / got.length : rateFrom(side, y), inc = on.length * rho - of(draw[y]), short = pos(of(cost[y]) - s.store[y]);
    plan[y] = { n: on.length, rho, inc, short, t: short && (pos(inc) ? short / inc : Infinity) }; }
  return plan; }
function runsOut(side, y, P, n, demand, hold, until) { const gap = demand - n * P.rho; if (!pos(gap)) return false;
  const lead = (pos(P.rho) ? Math.ceil(gap / P.rho) : Infinity) * DF.react + FK.stat(born(home(side)), side, 'carry') / Math.max(AT.tiny, P.rho);
  return (SIDES[side].store[y] - of(hold)) / gap < Math.max(lead, of(until)); }
const famineNear = (side, plan, eat) => runsOut(side, FOOD, plan[FOOD], plan[FOOD].n, eat);
// E527
const peaceAll = ECON.peaceAll;
const cap = (side) => Math.min(D.armyMax, per(side).armyCap + AT.armyAge * SIDES[side].age), aim = (side) => Math.ceil(cap(side) * (peaceAll(side) ? DP.stand : 1));
const trains = (code) => Object.keys(D.trains).find((c) => FK.trains(c).includes(FK.SH[code].replaces || code));
function goalOf(side, P, saving) { const s = SIDES[side], n = inArmy(side), age = { what: 'age', cost: ECON.ageCost(side) }; if (saving) return age;
  for (const g of P.goals) { if (g === 'age' && age.cost && !s.aging) return age;
    if (g === 'army' && n < aim(side)) { const [first] = A.troops, want = mind[side].want || first, at = trains(want); if (!count(side, at)) return { what: at, cost: D.cost[at] }; return { what: g, cost: ECON.addRes({}, FK.stat(want, side, 'cost'), Math.min(P.waveMin, aim(side) - n)) }; }
    if (g === 'build') { const [c] = P.build.find(([c, age, m, army]) => s.age >= age && count(side, c) < m && n >= army) || []; if (c) return { what: c, cost: D.cost[c] }; } }
  return null; }
function bestCounter(side) { const m = mind[side], i = of(m.cyc), foes = units().filter((v) => SIDES[v.side] && WAR.atWar(side, v.side) && ECON.soldier(v.code) && FK.inSight(v, side)); m.cyc = i + 1; // E528
  const can = [...new Set(ready(side).flatMap((t) => FK.trains(t.code, side)))].filter((c) => ECON.soldier(c) && FK.aged(c, side) && !CO.not.includes(FK.SH[c].class) && !(D.stats[c] || {}).bonly); if (!can.length) return null; if (!foes.length) return can[i % can.length];
  const sc = can.map((c) => { const me = { code: c, side }; return { c, s: total(foes, (v) => WAR.vs(me, v) / Math.max(CO.floor, WAR.vs(v, me))) / foes.length / (ECON.sumCost(D.cost[c]) / CO.per) ** CO.pow }; }).sort((a, b) => b.s - a.s);
  return sc[i % Math.min(CO.mix, sc.length)].c; }
function firstNeed(side, c) { if (!c || SIDES[side].techs.has(c)) return null; for (const n of ECON.needsOf(c)) if (!SIDES[side].techs.has(n)) return firstNeed(side, n); return c; }
const young = (M, T) => Object.fromEntries(Y.map((y) => [y, M[y] + total(Object.entries(T[y] || {}), ([k, f]) => f * M[k])]));
// E529
function chaseCrown(side, put) { const s = SIDES[side], has = (c) => blds(side, c).length, T = BOOKS.tech, last = Object.keys(T).filter((c) => T[c].value.age === D.age.hidden && !T[c].value.civ); // E649
  if (per(side).crown === 'wellbeing') FK.ticked('Care').some((c) => FK.aged(c, side) && !has(c) && ECON.canPay(side, D.cost[c]) && put(c));
  if (ECON.opened() && ECON.nextAge(side) === D.age.hidden && !s.aging) ECON.ageUp(side);
  if (s.age === D.age.hidden) { const [lab] = last.map((c) => T[c].value.at); if (!has(lab)) put(lab); else last.some((c) => ECON.research(side, c)); } }
function think(side) { const s = SIDES[side], P = per(side), h = home(side), m = mind[side]; if (!h || !P) return; const R = s.store, vs = ECON.villagersOf(side), armyN = WAR.armyOf(side).length, t = FK.K.t, put = (code, at, [r0, r1]) => raise(side, code, at.bx, at.by, r0, r1), jobs = ECON.jobs(side), vil = born(h);
  if (t - of(m.siteT) >= AT.site) { m.siteT = t; for (const b of blds(side)) if (!up(b) && !ECON.wallish(b) && !vs.some((u) => u.target === b)) ECON.autoBuilder(side, b); }
  const due = {}, flat = s.age >= AT.apart.age && ECON.canPay(side, AT.apart.cost) ? A.apartment : HOUSE; // E530
  if (!rising(side, HOUSE) && !rising(side, A.apartment) && ECON.popOf(side) >= ECON.popCap(side) - D.ai.homeAhead && ECON.popCap(side) < D.popMax && !put(flat, h, RG.home) && !ECON.canPay(side, D.cost[HOUSE])) ECON.addRes(due, D.cost[HOUSE]);
  for (const y of Y) if (jobs[y] >= AT.drop.crew && !rising(side, camps[y])) { const [f] = things().filter((x) => x.kind !== 'bld' && pos(x.amount) && ECON.yieldOf(x) === y).sort((a, b) => dist(a, h) - dist(b, h)), d = f && FK.dropFor({ side, bx: f.bx, by: f.by }, y); if (f && !(d && dist(d, f) < AT.drop.near * D.tile)) put(camps[y], f, RG.drop); } // E531
  for (const [code, y] of Object.entries(A.plots)) { if (ECON.capWhy(side, code) || rising(side, code) || count(side, code) * ECON.capOf({ kind: 'bld' }) >= jobs[y] || !plotPays(side, code)) continue; // E532
    const b = put(code, h, RG.plot); if (b) ECON.setMake(b, y); else if (!ECON.canPay(side, D.cost[code])) ECON.addRes(due, D.cost[code]); break; }
  const [FIELD] = Object.keys(A.plots); if (count(side, FIELD) >= AT.mill && !count(side, camps[FOOD])) put(camps[FOOD], h, RG.mill);
  const nx = ECON.nextAge(side), [base, step] = A.ageAt, toAge = nx != null && !s.aging && ((m.save && m.save.age === nx) || (vs.length >= base + step * s.age && armyN >= P.ageArmy)); if (toAge) ECON.ageUp(side); // E533
  const cost = toAge && !s.aging && ECON.ageCost(side), have = cost && total(Y, (y) => Math.min(R[y], of(cost[y]))) / ECON.sumCost(cost);
  if (!cost) m.save = null; else { const S = m.save || (m.save = { age: nx, best: have, at: t, until: -Infinity }); if (have > S.best + SV.step) { S.best = have; S.at = t; } if (t >= S.until && t - S.at > SV.stall) { S.until = t + SV.spend; S.at = S.until; S.best = -SV.step; } }
  let threat = false; FK.unitsNear(h, AT.threat * D.tile, (u) => { threat = threat || (!!SIDES[u.side] && WAR.atWar(side, u.side) && ECON.soldier(u.code)); });
  const saving = !!cost && !threat && !(m.save && t < m.save.until), need = saving ? cost : {}; m.saving = saving;
  const grow = ECON.popOf(side) < D.popMax && Math.max(...Y.map((y) => rateFrom(side, y))) * left() > ECON.sumCost(FK.stat(vil, side, 'cost')), eat = total(units().filter((u) => u.side === side), ECON.eats), draw = { [FOOD]: eat }; // E534
  if (grow && (!saving || R[FOOD] >= of(need[FOOD]) + AT.spare)) { if (lineOf(h) < AT.line) ECON.queue(h, vil); const each = ECON.addRes(ECON.addRes({}, FK.stat(vil, side, 'cost')), D.cost[HOUSE], 1 / Math.max(1, of(FK.stat(HOUSE, side, 'room'))));
    for (const [y, c] of Object.entries(each)) draw[y] = of(draw[y]) + c / ECON.timeOf(side, vil); }
  const scout = kindOf('Scout'); if (!saving && !mine(side, is(scout)) && t > AT.scout.at && R[FOOD] > AT.scout.food) train(side, scout);
  const [[BAR]] = P.build, lines = A.lines.flatMap((c) => ready(side, c)); // E535
  for (const [code, age, n, army, stock] of P.build) if (s.age >= age && count(side, code) < n && armyN >= army && (!stock || ECON.canPay(side, stock)) && (!saving || code === BAR) && put(code, h, RG.build)) break;
  if (P.extraBarracks && ready(side, BAR).length && count(side, BAR) <= P.extraBarracks && R[WOOD] > AT.extra) put(BAR, h, RG.line);
  if (!saving && lines.length && lines.every((b) => lineOf(b) >= AT.line) && inArmy(side) < cap(side) && R[WOOD] >= AT.extra) { const [c] = A.lines.filter((x) => FK.aged(x, side) && !rising(side, x) && !ECON.capWhy(side, x)).sort((a, b) => count(side, a) - count(side, b)); if (c) put(c, h, RG.line); }
  if (P.towers > count(side, TOWER) && s.age && R[STONE] >= AT.tower.stone) { const k = (AT.tower.out * D.tile) / (Math.hypot(FK.MID - h.bx, FK.MID - h.by) || D.tile); put(TOWER, { bx: h.bx + (FK.MID - h.bx) * k, by: h.by + (FK.MID - h.by) * k }, RG.tower); }
  if (P.walls && s.age >= WP.age && R[STONE] >= WP.stone) { const laid = []; if (!rings.has(side)) rings.set(side, wallPlan(h)); for (const [k, code] of rings.get(side)) { if (laid.length >= WP.pieces || R[STONE] < WP.keep) break; const b = !FK.OCC[k] && ECON.plan(side, code, k % N, (k - (k % N)) / N); if (b) { laid.push(b); ECON.autoBuilder(side, b); } } } // E330
  if (P.wonder && s.age >= AT.wonder.age && !count(side, WONDER) && !things().some((b) => b.code === WONDER && up(b)) && ECON.canPay(side, ECON.addRes({ ...AT.wonder.spare }, D.cost[WONDER])) && armyN >= AT.wonder.army) put(WONDER, h, RG.wonder);
  const priest = kindOf('Convert'), medic = kindOf('Heal'), [temple] = ready(side).filter((b) => FK.has(b, 'Zeal')); // E536
  if (temple) { if (armyN >= AT.priest.army && mine(side, is(priest)) < AT.priest.most[+!!P.shrine]) train(side, priest); const eng = WAR.armyOf(side).filter((u) => u.job === 'fight' && u.target && !(u.zeal > t)); if (!(s.zealT > t) && R[GOLD] >= AT.zeal.gold && eng.length >= AT.zeal.busy) ECON.zeal(side, temple, eng); }
  if (armyN >= AT.medic.army && mine(side, is(medic)) < AT.medic.most) train(side, medic);
  const SG = AT.siege, sg = mine(side, (c) => FK.SH[c].class === SG.cls), late = SG.late[s.age - SG.from]; // E537
  if (P.siege && sg < P.siege + Math.floor(armyN / SG.per)) train(side, late && sg % SG.turn === SG.turn - 1 ? late : SG.cycle[sg % SG.cycle.length]);
  if (P.trade && s.age && armyN >= AT.caravan.army && !saving && count(side, MARKET) && mine(side, (c) => tick(c, 'Trade')) < AT.caravan.most && ECON.canPay(side, AT.caravan.cost)) train(side, kindOf('Trade'));
  economy(side, P, h, saving, put); chaseCrown(side, (c) => put(c, h, RG.build));
  const spy = kindOf('Spy'); if (P.spy && mine(side, is(spy)) < AT.spy.most && ECON.canPay(side, AT.spy.cost)) train(side, spy);
  if (!saving && !P.techs.some((k) => TK[k] && ECON.research(side, firstNeed(side, TK[k]) || TK[k])) && !((m.n = of(m.n) + 1) % AT.research)) Object.keys(BOOKS.tech).some((c) => ECON.research(side, c)); // E538
  if (!saving && WAR.knows(side, 'muster') && inArmy(side) + AT.muster <= aim(side)) { const want = (m.want = bestCounter(side)); if (want) ECON.muster(side, { [want]: AT.muster }); }
  if (!saving && inArmy(side) < aim(side) && vs.length >= P.early) { const want = (m.want = bestCounter(side)); if (want) train(side, want); }
  const goal = goalOf(side, P, saving), all = ECON.addRes({ ...(goal ? goal.cost : {}) }, due), plan = needOf(side, vs, all, draw), famine = famineNear(side, plan, eat); // E539
  const order = Y.filter((y) => plan[y].t || (famine && y === FOOD)).sort((a, b) => (famine && (b === FOOD) - (a === FOOD)) || plan[b].t - plan[a].t), [first] = order, idle = vs.find((v) => v.job === 'idle'); Object.assign(m, { goal: goal && goal.what, need: first || null, plan });
  const move = (u, y) => { const f = u && ECON.bestFind(u, y); if (f) ECON.gatherAt(u, f); }, giver = (y) => vs.find((v) => ECON.jobOf(v) === y && of(v.load) < AT.carry && !(ECON.posted(v) && FK.has(v.target, 'Make')));
  if (first) { const tb = famine && first === FOOD ? Infinity : plan[first].t; if (idle) move(idle, first);
    else { let d = null, dv = -Infinity; for (const y of Y) { const Q = plan[y], gain = Q.inc - Q.rho; if (y === first || !Q.n || (famine && y === FOOD)) continue; const after = Q.short && (pos(gain) ? Q.short / gain : Infinity); // E540
        if (Q.short ? after >= tb : runsOut(side, y, Q, Q.n - 1, ECON.outOf(side, y) / MINUTE, of(all[y]), isFinite(tb) && tb)) continue; const v = Q.short ? tb - after : Infinity; if (v > dv) { dv = v; d = y; } }
      if (d) move(giver(d), first); } }
  else { const X = AT.mix, M0 = Object.fromEntries(Y.map((y, i) => [y, P.mix[i]])), M1 = s.age ? M0 : young(M0, X.stone), M = s.age < X.iron ? young(M1, X.early) : P.wonder ? Object.fromEntries(Y.map((y) => [y, M1[y] + X.wonder])) : M1; // E541
    const all = total(Y, (y) => M[y]) || 1, [[top, gap], ...rest] = Y.map((y) => [y, (M[y] / all) * vs.length - plan[y].n]).sort((a, b) => b[1] - a[1]), [low] = rest.at(-1); if (idle) move(idle, top); else if (gap >= 1) move(giver(low), top); }
  s.rally = first || FOOD; for (const v of vs) if (v.job === 'wait' && !v.target) { const by = (r) => { const f = ECON.bestFind(v, r); return of(f && ECON.forage(v, f, FK.dropFor(v, r))); }, y = order.find((r) => ECON.bestFind(v, r)) || Y.slice().sort((a, b) => by(b) - by(a)).find(by); if (y) move(v, y); } // E542
  if (P.bold < AT.never) decideWar(side, P); if (!WAR.waves[side]) chokeClaim(side, D.players.find((p) => WAR.atWar(side, p) && home(p)));
  if (P.diplo) diplomacy(side, P); allyDuty(side); }
// E543
function economy(side, P, h, saving, put) { const s = SIDES[side], R = s.store; if (s.age < EC.age || FK.K.t < EC.at) return;
  const post = blds(side).find((b) => ECON.idlePost(b) && ECON.yieldOf(b) && ![FOOD, WOOD].includes(ECON.yieldOf(b)) && (!A.plots[b.code] || plotPays(side, b.code))); if (post) { const [u] = ECON.villagersOf(side).filter((v) => !ECON.posted(v)).sort((a, b) => dist(a, post) - dist(b, post)); if (u) ECON.gatherAt(u, post); }
  if (saving) return; const age = ECON.ageCost(side); if (R[GOLD] - of(age && age[GOLD]) > EC.venture.spare && s.ventures.length < EC.venture.most) ECON.venture(side, EC.venture.amt);
  if (ECON.canPay(side, EC.post.cost)) { const [f] = ECON.stops().filter((x) => !ECON.postOn(x) && dist(x, h) < EC.post.far * D.tile).sort((a, b) => dist(a, h) - dist(b, h)); if (f && put(POST, f, RG.post)) return; }
  if (!P.trade) return; if (!count(side, MARKET)) { if (ECON.canPay(side, EC.market)) put(MARKET, h, RG.build); return; }
  const brew = A.pers.of[side] === EC.brew; if (!brew && !count(side, PASTURE) && ECON.canPay(side, EC.pasture)) return put(PASTURE, h, RG.build);
  if (!count(side, SHOP) && ECON.canPay(side, EC.shop)) { const b = put(SHOP, h, RG.build); if (b) ECON.setMake(b, brew ? EC.beer : EC.cloth); return; }
  const cs = units().filter((c) => c.side === side && FK.has(c, 'Trade')); if (mine(side, (c) => tick(c, 'Trade')) < EC.caravans) train(side, kindOf('Trade'));
  if (FK.every(EC.route)) for (const c of cs) if (!c.route) { const f = ECON.bestTarget(side, c); if (f) ECON.setRoute(c, f, true, false); } }
// E544
function decideWar(side, P) { const m = mind[side], w = WAR.waves[side], t = FK.K.t; m.cool = m.cool || {};
  if (w && w.S) { const out = w.S.filter((u) => !u.gone), [gx, gy] = FK.tileMid(w.k), d = out.length ? total(out, (u) => Math.hypot(u.bx - gx, u.by - gy)) / out.length : w.d;
    if (out.some((u) => u.job === 'fight' || t - of(u.hurtT) < WV.fight) || d < w.d - WV.step * D.tile) { w.d = Math.min(w.d, d); w.pt = t; }
    if (!w.charged && out.some((u) => u.job === 'fight' && u.target && u.target.kind === 'unit')) { w.charged = true; WAR.charge(out); }
    const stalled = t - w.pt > WV.stall; if (out.length < w.n0 * WV.broke || stalled) { WAR.recall(side); if (stalled && !w.bid) m.cool[w.to] = t + WV.cool; } return; }
  if (w) return; const Wd = things().find((b) => b.code === WONDER && up(b) && b.side !== side && WAR.atWar(side, b.side)), free = WAR.armyFree(side, 'rout').filter((u) => !u.goal && !u.drill && !u.esc);
  if (free.length < (Wd ? WV.wonder : P.waveMin + DF.wave)) return; const bold = P.bold + DF.bold, go = Wd ? free : free.slice(Math.floor(free.length * P.guard)); let best = null, bp = -Infinity;
  for (const q of D.players) { if (q === side || ECON.fell(q) || !WAR.atWar(side, q) || !home(q)) continue; const threat = !!Wd && Wd.side === q; if (!threat && of(m.cool[q]) > t) continue; if (q === ME && ECON.time() < DF.safe && !Wd) continue;
    const prob = WAR.odds(go, q), busy = P.opportunist && D.players.some((x) => x !== side && x !== q && !ECON.fell(x) && WAR.atWar(q, x)), pr = threat ? Math.max(prob, WV.threat) : busy ? prob * P.opportunist * DF.opp : prob; if (pr > bp) { bp = pr; best = q; } }
  if (best == null || bp <= (WAR.armyOf(side).length >= cap(side) - WV.full ? Math.min(bold, WV.settle) : bold)) return; const at = Wd && Wd.side === best ? Wd : home(best); if (!WAR.attack(side, FK.tileAt(at.bx, at.by), go)) return; // E545
  Object.assign(WAR.waves[side], { S: go, to: best, bid: at !== home(best), d: Infinity, pt: t }); const fast = go.filter((u) => FK.SH[u.code].class === WV.riders).filter((_, i) => i < P.raid);
  const [mark] = blds(best).filter((b) => up(b) && !FK.has(b, 'Seat') && FK.has(b, 'Drop-off')).sort((a, b) => dist(a, h0(side)) - dist(b, h0(side))); if (mark && fast.length) WAR.dress(fast, FK.tileAt(mark.bx, mark.by));
  if (best === ME) ECON.tell(fromBook('words').realm.march, { side: fromBook('words').end.sides[side], n: go.length }); }
const h0 = (side) => home(side) || { bx: FK.MID, by: FK.MID };
// E522
const DP = D.ai.diplo, LG = D.league, [ME] = D.players, [WARS, PEACE, ALLY] = fromBook('sides').stances, [ENVOY] = FK.ticked('Envoy'), helped = new Map(), score = (p) => ECON.score(p).total; let league = null;
function diplomacy(side, P) { const s = SIDES[side], rivals = D.players.filter((q) => q !== side && !ECON.fell(q)); if (!FK.aged(ENVOY, side) || s.envoyOut || FK.K.t - s.envoyAt < DF.envoy) return;
  const [lead] = D.players.filter((q) => !ECON.fell(q)).sort((a, b) => score(b) - score(a)), warOn = rivals.some((q) => WAR.atWar(side, q) && SIDES[q].lord !== side);
  for (const q of rivals) { if (SIDES[q].lord === side || s.lord === q) continue; const odds = WAR.odds(WAR.armyOf(side), q), rel = WAR.stance(side, q);
    if (rel === WARS && odds < DP.peace && WAR.armyOf(side).length < P.waveMin && ECON.setRel(side, q, PEACE)) return;
    if (!warOn && rel === PEACE && !ECON.noticeLeft(side, q) && odds > P.bold + DP.lift + DF.bold && (P.crown === 'war' || ECON.truceFor() === null) && ECON.setRel(side, q, WARS)) return;
    if (s.ally == null && SIDES[q].ally == null && rel === PEACE && ECON.time() > DF.allyAt && (warOn || (DF.gang && lead !== side && lead !== q)) && ECON.setRel(side, q, ALLY)) return; } }
function allyDuty(side) { const s = SIDES[side]; if (s.ally == null || FK.K.t - (helped.get(side) ?? -Infinity) < DP.help.gap) return; const ak = home(s.ally), mk = home(side);
  const near = (k, o) => !!k && FK.units().some((u) => SIDES[u.side] && WAR.atWar(o, u.side) && ECON.soldier(u.code) && dist(u, k) < DP.help.near * D.tile);
  if (ak && mk && !near(mk, side) && near(ak, s.ally)) { helped.set(side, FK.K.t); ECON.sendHelp(side, ak, s.ally === ME); } }
function leagueTick() { const S = D.players.filter((p) => !ECON.fell(p) && !(SIDES[p].lord != null && !SIDES[p].rebel)).sort((a, b) => score(b) - score(a)), W = fromBook('words').realm.league, sides = fromBook('words').end.sides; if (S.length < LG.least) return; // E523
  const [lead, next] = S, ratio = score(lead) / Math.max(LG.floor, score(next));
  if (league == null) { if (ratio < LG.lead) return; league = lead; } else if (league !== lead || ratio < LG.release) { league = null; ECON.tell(W.off); return; }
  const M = S.filter((p) => p !== lead && p !== ME && SIDES[p].lord !== lead); if (!M.length) return; const fresh = M.some((p) => WAR.stance(p, lead) !== WARS);
  for (const p of M) { if (!WAR.atWar(p, lead)) ECON.declareWar(p, lead, W.why); for (const q of M) if (q !== p) WAR.treaty(p, q, ALLY); } if (fresh) ECON.tell(W.on, { sides: M.map((p) => sides[p]).join(fromBook('words').list.and), side: sides[lead] }); }
FK.on('start', () => { clock.fill(0); rings.clear(); claimT.clear(); helped.clear(); league = null; mind.forEach((_, i) => { mind[i] = {}; }); DF = A.diff[MENU.S.opt.diff]; });
FK.on('tick', (dt) => { if (ECON.result()) return; if (FK.every(D.beats.slow)) leagueTick(); for (const side of D.players) { if (side === ME) continue; clock[side] += dt; if (clock[side] >= DF.react) { clock[side] = 0; think(side); } } });
return { think, mind, spot, raise, wallPlan, gapOnRoad, chokeClaim, peaceAll, diplomacy, allyDuty, leagueTick, bestCounter, goalOf, needOf, runsOut, rateFrom, plotPays, decideWar, cap, aim };
})();
