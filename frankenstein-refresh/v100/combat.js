'use strict';
// E227
window.WAR = (() => {
const { D, C, W, K, A, SIDES, N } = FK, STD = []; // E961
// E170
const things = FK.things, units = FK.units, T = D.tile, [ME] = D.players, MO = D.nerve, FL = D.flanking, AR = D.army, GR = D.ranks, FLY = D.flight, FM = D.forms, ST = FK.SPRITE, WD = fromBook('words').army;
const HU = D.hud, CH = D.charge, FB = D.fallback, CK = D.choke, AM = D.ambush, FAM = D.familiar, DI = D.direct, WO = fromBook('words').orders, ORD = new Set(), MS = {}, AT = {}; // E406
const stat = (u) => FK.statRow(u.code, u.side);
const hpMax = (t) => FK.stat(t.code, t.side, 'hp') ?? 400;
const armed = (u) => !!SIDES[u.side] && FK.has(u, 'Fight') && !FK.has(u, 'Gather');
const SB = fromBook('sides'), rel = new Map(); // E285
const groupOf = (x) => (SIDES[x.side] ? null : SB.beasts.includes(x.code) ? 'beast' : x.horde && !x.back ? 'out' : Object.keys(SB.groups).find((g) => SB.groups[g].includes(x.code)) || 'nat'); // E286
const stance = (a, b) => (a === b ? null : rel.get(a + ' ' + b) ?? SB.start), treaty = (a, b, s) => { if (SB.stances.includes(s)) { rel.set(a + ' ' + b, s); rel.set(b + ' ' + a, s); } }; // E287
const atWar = (a, b) => stance(a, b) === 'war', friendly = (a, b) => a === b || stance(a, b) === 'ally';
function isFoe(o, x, me) { if (x.side === o) return false; if (!SIDES[x.side]) { const g = groupOf(x); return g === 'beast' || atWar(o, g); } if (SIDES[o]) return atWar(o, x.side); // E288
  const g = (me && groupOf(me)) || 'nat'; return g === 'beast' || (atWar(x.side, g) && x.side === ME); } // E289
const tame = (u, v) => u.side === ME && v.kind === 'unit' && !SIDES[v.side] && !(v.target && v.target.side === ME); // E937
const enemies = (a, b) => !b.hid && !b.veil && !FK.has(b, 'Envoy') && isFoe(a.side, b, a) && FK.inSight(b, a.side, a);
const edgeDist = (u, t) => { if (t.kind !== 'bld') return FK.dist(u, t) / T; const [sx, sy] = FK.fromBoard(u.bx, u.by); return Math.hypot(Math.max(0, t.i * T - sx, sx - (t.i + t.n) * T), Math.max(0, t.j * T - sy, sy - (t.j + t.n) * T)) / T; }; // E228
const alive = (t) => t.hp > 0 && !t.gone, up = (t) => t.done >= 1 && alive(t), due = (x) => !(x > 0), half = (x) => x / 2; // E229
const gap = (u, p) => FK.dist(u, p) / T, dir = (dx, dy) => { const d = Math.hypot(dx, dy) || 1; return [dx / d, dy / d, d]; }, beast = (x) => groupOf(x) === 'beast';
const ranged = (u) => stat(u).rng > FL.melee, routing = (u) => u.job === 'rout' && u.routAt != null, clsOf = (c) => FK.SH[c].class, rider = (u) => clsOf(u.code) === 'Riders', engine = (u) => clsOf(u.code) === 'Engines';
const TK = FK.TK, knows = (side, k) => !!SIDES[side] && SIDES[side].techs.has(TK[k]); // E382
// E383
const SQ = { plan: [], form: [], temper: [], intent: [], sel: null }, SHAPES = Object.keys(FM).filter((k) => k !== 'column'), DIAL = { temper: WD.tempers, form: SHAPES, intent: WD.intents };
const fresh = () => { SQ.plan = WD.squads.map(() => ({})); SQ.temper = WD.squads.map(() => AR.temper.guard); SQ.form = WD.squads.map(() => SHAPES.indexOf('line')); SQ.intent = WD.squads.map(() => AR.intent.engage); SQ.sel = null; };
const mine = (u) => u.side === ME && u.bn != null, temperOf = (u) => (u.wall > K.t ? AR.temper.hold : mine(u) ? SQ.temper[u.bn] : AR.temper.guard), temper = (u) => D.tempers[temperOf(u)], intent = (u) => (mine(u) ? SQ.intent[u.bn] : AR.intent.engage);
const formOf = (u) => (mine(u) && knows(ME, 'formations') ? SHAPES[SQ.form[u.bn]] : 'line'), marching = (u) => u.job === 'march' && !u.target && !!u.path;
const shapeOf = (u) => FM[u.wall > K.t ? DI.wall.shape : drillOn(u) ? u.drill.shape : marching(u) && knows(u.side, 'formations') ? 'column' : formOf(u)];
const kiteOf = (u) => !!stat(u).kite || (knows(u.side, 'engage') && (stat(u).tags || []).includes('ranged') && temperOf(u) !== AR.temper.press);
const dialOf = (key, a) => { const [v, ...more] = a == null ? new Set(SQ[key]) : [SQ[key][a]]; return more.length ? null : v; };
const cycle = (key, a) => { const nx = ((dialOf(key, a) ?? -1) + 1) % DIAL[key].length; if (a == null) SQ[key] = SQ[key].map(() => nx); else SQ[key][a] = nx; };
const sum = (S, f) => S.reduce((n, x) => n + f(x), 0);
function rebattalion() { // E384
  const S = armyOf(ME), left = SQ.plan.map((P) => ({ ...P })), room = (u, i) => left[i][clsOf(u.code)] > 0, take = (u, i) => { left[i][clsOf(u.code)]--; u.bn = i; };
  for (const u of S) if (!knows(ME, 'command') || u.bn == null || !room(u, u.bn)) u.bn = null; else take(u, u.bn);
  for (const u of S) if (u.bn == null && knows(ME, 'command')) { const i = SQ.plan.findIndex((_, i) => room(u, i)); if (SQ.plan[i]) take(u, i); } }
function plan(i, cls, up) { const P = SQ.plan[i], cur = P[cls] ?? 0, [ten, one, five] = AR.steps, st = (up ? cur < ten : cur <= ten) ? one : five, others = sum(Object.keys(P), (q) => P[q]) - cur; // E385
  P[cls] = Math.min(Math.max(cur, D.squad - others), Math.max(0, up ? cur + st : cur - st)); if (!P[cls]) delete P[cls]; rebattalion(); }
const squad = (i) => armyOf(ME).filter((u) => u.bn === i), orders = (side) => armyFree(side, 'rout').filter((u) => side !== ME || SQ.sel == null || u.bn === SQ.sel);
function lack(i) { const gap = { ...SQ.plan[i] }, less = (c, n) => { gap[clsOf(c)] -= n; }; for (const u of squad(i)) less(u.code, 1); for (const b of things()) if (b.side === ME) for (const j of b.q || []) if (j.plan && j.bn === i) for (const c in j.plan) less(c, j.plan[c]); // E386
  const out = {}; for (const cls in gap) { const k = FK.civKind(FK.kinds(cls).find((c) => FK.aged(FK.civKind(c, ME), ME)), ME); if (gap[cls] > 0 && k) out[k] = gap[cls]; } return out; }
// E230
const wear = (u) => (SIDES[u.side] && (K.rain + K.snowing > 0 || K.temp < 0) ? 1 - D.wear * (1 - Math.min(1, FK.stat(u.code, u.side, 'wear'))) : 1);
const dmgOf = (u) => FK.stat(u.code, u.side, 'atk') * wear(u) * (rider(u) ? shapeOf(u).dmg : 1) * temper(u).dmg * ECON.hungerOf(u.side) * ZE.mul ** (u.zeal > K.t) * D.health.dmg ** (u.sick > K.t) * FK.evKnob('dmg');
const vsOf = (u) => Object.assign({}, stat(u).vs, ...FK.ranks(u.code, u.side).map((c) => BOOKS.tech[c].value.rank.vs)), tagsOf = (t) => [clsOf(t.code), ...(stat(t).tags || [])];
const vs = (a, t) => { const v = vsOf(a); return Math.max(...[t.code, ...tagsOf(t)].map((k) => v[k] || 1)); }; // E282
function fromWhere(t, a) { // E387
  const free = t.fx == null || !((t.target && t.target !== a) || t.stuck > K.t || routing(t)), [dx, dy] = dir(a.bx - t.bx, a.by - t.by); let [fx, fy] = [t.fx, t.fy], cover = false;
  if (!free) FK.unitsNear(t, FL.line * T, (v) => { if (v.side !== t.side || !armed(v) || !alive(v) || v.fx == null) return; fx += v.fx; fy += v.fy; const [ex, ey, e] = dir(v.bx - t.bx, v.by - t.by); if (e < FL.cover * T && ex * dx + ey * dy > FL.cos) cover = true; });
  const [gx, gy] = dir(fx, fy); return free || cover ? MO.front : dx * gx + dy * gy; }
function damage(a, t, base = dmgOf(a)) { const A = a.kind === 'unit' ? stat(a) : {}, melee = A.rng <= FL.melee; if (t.kind === 'bld') return base * FK.stat(a.code, a.side, 'bld'); let d = base * vs(a, t) * (a.kind === 'unit' ? ONE - FAM.fight * (ONE - (a.fam ?? ONE)) : ONE); // E355
  if (FK.has(t, 'Prey') && FK.has(a, 'Gather')) d *= D.hunt.blow;
  if (armed(t)) { const F = shapeOf(t); if (beast(a)) d *= MO.wild; if (routing(t)) d *= MO.routHit; if (t.fb > K.t) d *= FB.hit; d *= FK.stat(t.code, t.side, 'armor') * F.hit * (rider(a) ? F.vsRiders : 1); if (melee && fromWhere(t, a) < FL.behind) d *= D.flank; }
  if (t.kind === 'unit' && FK.inWoods(t.k)) { if (!melee) d *= Math.exp(-D.woods.stems * D.woods.trunk * FK.woodsLine(a, t)); // E875
    else { let n = ZERO; FK.unitsNear(t, FL.line * D.tile, (v) => { if (v.target === t && v.side === a.side && alive(v)) n++; }); d /= Math.max(ONE, n); } } // E876
  return stat(t).rarmor && !melee ? d * stat(t).rarmor : d; }
function hit(a, t, base) { if (a.kind === 'unit' && caught(a, t)) return ECON.takePrisoner(a.side, t); const d = damage(a, t, base), u = a.kind === 'unit'; t.hp -= d; t.hurtT = K.t; if (SIDES[t.side]) FK.fire('event', 'struck', t, a); sparks.push({ x: t.bx, y: t.by, t: K.t }); sparks.splice(0, sparks.length - FLY.sparks); // E231
  if (u && SIDES[a.side] && !SIDES[t.side]) ECON.struck(a.side, groupOf(t)); // E518
  if (u) { FK.impact(a, t); if (ranged(a)) shot(a, t, W[FK.SH[a.code].body].height); if (!SIDES[t.side]) { t.aggro = a; if (t.job !== 'fight' && stat(t).atk) fight(t, a); } if (t.kind === 'bld') ECON.shot(a, t, d); }
  if (!alive(t)) { if (armed(a)) a.mor = Math.min(MO.full, a.mor + MO.kill); die(t, a); } }
FK.on('drown', (u) => die(u)); // E796
function die(t, by) { t[t.kind === 'bld' ? 'by' : 'killer'] = by && by.side; if (t.kind === 'bld') { if (by && SIDES[by.side] && by.side !== t.side) { for (const [y, n] of Object.entries(D.cost[t.code] || {})) ECON.earn(by.side, y, Math.floor(n * D.plunder), 'loot'); if (by.side === ME) FK.fire('event', 'plunder', t); } FK.fire('event', 'fell', t); FK.unbuild(t); return; } // E356
  if (armed(t)) { const near = []; FK.unitsNear(t, MO.crowd * T, (v) => { if (v.side === t.side && armed(v) && alive(v) && gap(t, v) < MO.crowd) near.push(v); }); for (const v of near) v.mor -= 1 / (D.breakAt * (near.length + 1)); } // E388
  t.gone = true; const us = units(), c = FK.has(t, 'Prey') && FK.lay('meat', t.bx, t.by, D.meat[t.code]); if (us.includes(t)) us.splice(us.indexOf(t), 1); FK.fire('gone', t); for (const u of us) if (u.target === t) { u.target = null; if (c && FK.has(u, 'Gather')) ECON.gatherAt(u, c); } }
// E232
const power1 = (u) => ((u.hp * Math.max(D.leastBlow, dmgOf(u))) / D.odds.per) * (stat(u).bonly ? D.odds.bonly : 1);
const groupPower = (u) => { let p = power1(u); FK.unitsNear(u, AR.group * T, (v) => { if (v.side === u.side && armed(v) && alive(v)) p += power1(v); }); return p; };
const canBeat = (u, v) => groupPower(u) * vs(u, v) > power1(v) * vs(v, u); // E389
const worth = (u, v, d) => { const mine = (dmgOf(u) * vs(u, v)) / stat(u).rof, reach = (Math.max(0, d - stat(u).rng) * T) / D.upm / FK.stat(u.code, u.side, 'spd'); return mine > 0 ? ((stat(v).rof ? (dmgOf(v) * vs(v, u)) / stat(v).rof : null) + AR.least) / (v.hp / mine + reach) : 0; };
function bestFoe(u, r) { let best = null, bv = -Infinity, bb = false; FK.unitsNear(u, r * T, (v) => { if (!enemies(u, v) || !alive(v) || edgeDist(u, v) > r) return; const beat = canBeat(u, v), V = worth(u, v, edgeDist(u, v)); if ((beat && !bb) || (beat === bb && V > bv)) [best, bv, bb] = [v, V, beat]; }); return best; } // E233
const nearest = (u, r, at = u, ok = alive) => { let best = null; FK.unitsNear(at, r * T, (v) => { if (enemies(u, v) && alive(v) && ok(v) && gap(at, v) < r && (!best || gap(at, v) < gap(at, best))) best = v; }); return best; };
const foeBld = (u, r) => { let best = null; FK.bldsNear(u.bx, u.by, (r + D.large) * T, (t) => { if (SIDES[t.side] && enemies(u, t) && alive(t) && edgeDist(u, t) <= r && (!best || edgeDist(u, t) < edgeDist(u, best))) best = t; }); return best; };
function choose(u, r) { let best = null; FK.unitsNear(u, r * T, (t) => { if (enemies(u, t) && alive(t) && edgeDist(u, t) <= r && (SIDES[t.side] || t.target === u) && (!best || worth(u, t, edgeDist(u, t)) > worth(u, best, edgeDist(u, best)))) best = t; }); return best; }
const toward = (u, t) => { const r = Math.max(1, stat(u).rng); return FK.walkTo(u, t.kind === 'bld' ? (q) => { const i = q % N, j = (q - i) / N; return i >= t.i - r && i < t.i + t.n + r && j >= t.j - r && j < t.j + t.n + r; } : (q) => q !== t.k && nearK(q, t.k, r), t.kind === 'bld' ? FK.tileAt(t.bx, t.by) : t.k, D.chase); }; // E234
const home = (side) => FK.seatOf(side) || things().find((t) => t.kind === 'bld' && t.side === side); // E235
const nearHome = (u, t) => (u.home && gap(t, u.home) < D.yard) || (!!home(u.side) && gap(t, home(u.side)) < D.yard); // E390
const waves = SIDES.map(() => null); // E236
function fight(u, t, told) { u.job = 'fight'; u.target = t; u.then = null; u.focus = told ? t : null; }
const nearK = (q, k, r) => Math.abs(q % N - k % N) <= r && Math.abs(Math.floor(q / N) - Math.floor(k / N)) <= r;
function march(u, k) { u.mvT = K.t; u.job = 'march'; u.goal = k; u.target = null; u.then = 'march'; if (!FK.walkTo(u, (q) => q === k || nearK(q, k, FK.walkable(k) ? 0 : 4), k)) { u.job = 'idle'; block(u); } } // E237
const block = (u) => { const b = foeBld(u, FL.melee); if (b) fight(u, b); }; // E391
function recall(side) { waves[side] = null; homeAll(orders(side)); }
const guardsOf = (t) => units().filter((u) => u.esc === t), guard = (S, t) => { const room = t && D.trade.guard - guardsOf(t).length; S.filter((u) => armed(u) && u.esc !== t).filter((u, i) => !t || i < room).forEach((u) => Object.assign(u, { esc: t, home: t })); }; // E493
FK.on('gone', (t) => { for (const u of guardsOf(t)) Object.assign(u, { esc: null, home: null }); });
function homeAll(S) { for (const u of S) { const h = home(u.side); Object.assign(u, { job: 'rout', routAt: null, target: null, goal: null, then: 'idle', ord: null, sent: false, drill: null, amb: null, hid: false, esc: null }); if (!h || !FK.goBy(u, h)) u.job = 'idle'; } }
function attack(side, k, army = orders(side)) { if (!army.length) return 0; waves[side] = { n0: army.length, k, t: 0, hp: 0 }; dress(army, k); if (side === ME) FK.fire('event', 'march', army[0]); return army.length; }
const armyOf = (side) => units().filter((u) => u.side === side && ECON.soldier(u.code)), BUSY = { rout: (u) => u.job === 'rout' }, armyFree = (side, ...skip) => armyOf(side).filter((u) => !skip.some((k) => BUSY[k](u))); // E372
// E392
function dress(S, k, form, drill) { const [s0] = S, shape = form || formOf(s0), [tx, ty] = FK.tileMid(k), h = home(s0.side) || { bx: tx, by: ty }, [fx, fy] = (drill && drill.f) || dir(tx - h.bx, ty - h.by), n = S.length, slow = Math.min(...S.filter((u) => !engine(u)).map((u) => FK.stat(u.code, u.side, 'spd')));
  S.sort((a, b) => (a.bn ?? n) - (b.bn ?? n) || ranged(a) - ranged(b)); const nf = sum(S, (u) => !ranged(u)), turn = 2 * Math.PI, ring = (Math.max(nf, GR.ring) * GR.gap) / turn;
  const cols = { column: Math.min(n, GR.column), square: Math.ceil(Math.sqrt(n)), front: n, choke: (drill && drill.cols) || GR.choke }[shape] || Math.min(GR.most, Math.max(1, Math.round(Math.sqrt(n * GR.rows))));
  S.forEach((u, i) => { let c, r; if (shape === 'support') { const on = i < nf, m = Math.max(1, on ? nf : n - nf), j = on ? i : i - nf, rr = on ? ring : Math.max(0, ring - GR.gap) * Math.sqrt((j + 0.5) / m); [c, r] = [Math.cos((j / m) * turn) * rr, Math.sin((j / m) * turn) * rr]; }
    else { const ri = shape === 'wedge' ? Math.floor(half(Math.sqrt(8 * i + 1) - 1)) : Math.floor(i / cols); c = (shape === 'wedge' ? i - half(ri * (ri + 1) + ri) : (i % cols) - half(cols - 1)) * GR.gap; r = -ri * GR.gap; }
    if (drill && drill.arc) { const R = drill.arc.r, a = ((i - half(n)) * GR.gap + half(GR.gap)) / R; [c, r] = [Math.sin(a) * R, R - Math.cos(a) * R]; } // E407
    const g = FK.tileAt(tx + (fx * r - fy * c) * T, ty + (fy * r + fx * c) * T); Object.assign(u, { fx, fy, slow: Math.min(1, slow / FK.stat(u.code, u.side, 'spd')), sent: false, drill: drill && { ...drill, shape, k: FK.walkable(g) ? g : k, from: { bx: u.bx, by: u.by } } }); march(u, u.drill ? u.drill.k : FK.walkable(g) ? g : k); }); }
const tired = (S) => { for (const u of S) u.tire = CH.slow; }; // E806
const drillOn = (u) => !!(u.drill && u.drill.until > K.t && u.goal === u.drill.k && (u.job === 'march' || u.job === 'hold')); // E393
function drillHold(u) { const L = u.drill; if (!drillOn(u) || L.held) return; const [x, y] = FK.tileMid(u.goal), mine = far(u, { bx: x, by: y }) / D.upm / FK.pace(u); let foe = Infinity; for (const f of foesNear(u)) foe = Math.min(foe, far(f, u) / D.upm / FK.pace(f));
  if (foe < mine) { L.held = true; L.k = FK.tileAt(u.bx, u.by); Object.assign(u, { path: null, goal: L.k, job: 'hold' }); } }
function formHome() { const at = new Map(); for (const u of units()) if (armed(u) && u.job === 'idle' && !u.target && !u.esc) { const b = u.hb && alive(u.hb) ? u.hb : home(u.side); if (!b) continue; const H = at.get(b) || at.set(b, new Map()).get(b), k = u.bn ?? u.code; (H.get(k) || H.set(k, []).get(k)).push(u); } // E394
  for (const [b, blocks] of at) { const [fx, fy] = dir(FK.MID - b.bx, FK.MID - b.by), out = (half(b.n) + GR.yard) * T, list = [...blocks.keys()].sort((p, q) => String(p).localeCompare(String(q))).map((k) => blocks.get(k).sort((p, q) => ranged(p) - ranged(q)));
    const cols = list.map((a) => Math.min(GR.cols, Math.ceil(Math.sqrt(a.length * GR.block)))); let x0 = half(-(sum(cols, (c) => c + 1) - 1) * GR.gap);
    list.forEach((a, bi) => { a.forEach((u, i) => { const c = (x0 + ((i % cols[bi]) + 0.5) * GR.gap) * T, r = out + Math.floor(i / cols[bi]) * GR.gap * T; u.home = { bx: b.bx + fx * r - fy * c, by: b.by + fy * r + fx * c }; if (!u.path) [u.fx, u.fy] = [fx, fy]; }); x0 += (cols[bi] + 1) * GR.gap; }); } }
// E239
function nerve(u, dt) { let m = u.mor; const full = MO.full * (ONE - D.exposure.nerve * FK.exposure(u.code, u.side)); // E809
  if (!u.target) { const near = FK.bldsNear(u.bx, u.by, MO.shelterR * T, (b) => b.side === u.side && up(b) && (FK.has(b, 'Shoot') || FK.has(b, 'Line') || FK.has(b, 'Gate')) && gap(u, b) < MO.shelterR); m = FK.relax(m, full, MO.tau / FK.stat(u.code, u.side, 'rest') / (near ? MO.shelter * FK.stat(u.code, u.side, 'shelter') : MO.front), dt); }
  else { const us = [u], them = []; FK.unitsNear(u, MO.crowd * T, (v) => { if (armed(v) && alive(v)) (v.side === u.side ? us : atWar(u.side, v.side) ? them : []).push(v); }); if (them.length > us.length * MO.outnumbered) m -= MO.odds * dt; }
  u.mor = Math.min(full, Math.max(0, m)); if (u.mor > 0 || stat(u).bonly || u.fb > K.t) return;
  Object.assign(u, { job: 'rout', routAt: K.t, target: null, focus: null, path: null }); if (u.side === ME && !(K.t - routSaid < MO.say)) { routSaid = K.t; FK.fire('event', 'rout', u, u.bn != null ? WD.squads[u.bn] : WD.all); } }
let routSaid = -Infinity, homeT = 0, ordT = HU.beat; const sparks = [], tracers = [];
// E970
function flee(u) { if (K.t > u.routAt + FK.stat(u.code, u.side, 'rout')) { Object.assign(u, { job: 'idle', routAt: null, mor: MO.after, path: null }); const f = nearest(u, FK.stat(u.code, u.side, 'sight')); if (f) fight(u, f); else if (u.home) march(u, FK.tileAt(u.home.bx, u.home.by)); return; } // E395
  if (u.path || !due(u.rp)) return; u.rp = D.repath; const f = nearest(u, MO.flee), h = home(u.side) || u, [dx, dy] = f ? dir(u.bx - f.bx, u.by - f.by) : dir(h.bx - u.bx, h.by - u.by);
  if (FK.go(u, FK.tileAt(u.bx + dx * MO.run * T, u.by + dy * MO.run * T))) u.then = 'rout'; }
function brain(u, dt, look) { // E396
  if (u.job === 'rout') { if (routing(u)) flee(u); else if (!u.path) u.job = 'idle'; return true; }
  nerve(u, dt); if (routing(u)) return true; drillHold(u); if (u.amb && ambushTick(u)) return true;
  if (u.chg && u.chg < K.t) { u.chg = null; u.tire = CH.slow; } if (u.tire) u.tire = FK.relax(u.tire, D.bases.pace, CH.tired, dt); // E408
  if (u.hp < u.hpMax && !u.target && !u.unfed && FK.bldsNear(u.bx, u.by, D.shelter.r * T, (b) => b.side === u.side && FK.has(b, 'Shelter') && up(b) && gap(u, b) < D.shelter.r)) u.hp = FK.relax(u.hp, u.hpMax, u.hpMax / FK.stat(u.code, u.side, 'garrison'), dt);
  const s = stat(u), sight = FK.stat(u.code, u.side, 'sight'), atHome = u.job === 'idle' || (u.job === 'fight' && u.was == null), d = (v) => edgeDist(u, v); let t = u.target;
  if (u.focus && !(alive(u.focus) && enemies(u, u.focus))) u.focus = null;
  if (t && !(alive(t) && enemies(u, t) && (t === u.focus || d(t) < sight * AR.leash * temper(u).chase || (atHome && nearHome(u, t))))) t = null;
  if (look && !u.focus) { const it = intent(u), far = it === AR.intent.loose && u.job === 'march' ? s.rng + AR.step : sight, cur = t && t.kind === 'unit' ? t : null;
    let c = s.bonly || (it === AR.intent.bld && foeBld(u, far)) ? foeBld(u, far) : bestFoe(u, far);
    if (cur && (!c || d(cur) <= s.rng || (canBeat(u, cur) >= canBeat(u, c) && worth(u, c, d(c)) < (1 + D.moveOn) * worth(u, cur, d(cur))))) c = cur;
    if (atHome && c && !nearHome(u, c) && c.target !== u) c = null;
    if (!c && atHome && !s.bonly) c = (u.home && nearest(u, D.yard, u.home)) || (home(u.side) && nearest(u, D.yard, home(u.side))) || null;
    if (!c && (u.job === 'march' || u.job === 'hold' || u.was != null)) c = foeBld(u, sight);
    if (c && c !== u.focus && tame(u, c)) c = null; // E936
    t = c || (t && t.kind === 'bld' ? t : null); }
  if (t && !u.focus && ((temperOf(u) === AR.temper.hold && u.side === ME && u.job !== 'march' && u.was == null) || drillOn(u) || u.fb > K.t) && d(t) > s.rng) t = null;
  u.pacex = shapeOf(u).spd * (marching(u) && u.slow ? u.slow : 1) * (u.chg ? CH.spd * FK.stat(u.code, u.side, 'charge') : u.tire ?? D.bases.pace);
  if (t && u.target !== t) { if (u.job !== 'fight') u.was = u.job === 'idle' ? null : u.goal; fight(u, t, t === u.focus); u.path = null; }
  else if (!t && u.job === 'fight') { u.target = null; u.path = null; if (u.was != null) march(u, u.was); else u.job = 'idle'; u.was = null; }
  else if (u.job === 'march' && !u.path) { if (u.goal == null || nearK(u.k, u.goal, FK.walkable(u.goal) ? 1 : 4)) u.job = 'hold'; else if (due(u.rp)) { u.rp = D.repath; if (!FK.go(u, u.goal)) u.job = 'hold'; } }
  else if (u.job === 'idle' && u.home && !u.path && gap(u, u.home) > AR.near && due(u.rp)) { u.rp = D.repath; if (FK.go(u, FK.tileAt(u.home.bx, u.home.by))) { u.path.pop(); u.path.push([u.home.bx, u.home.by]); u.then = 'idle'; } }
  return false; }
// E397
const AN = (A.loose / A.round) * 2 * Math.PI, M = W.bow.blow, mpt = T / D.upm, reachs = new Map();
function fly(v, h) { const k = M.drag / M.kg, P = []; let x = 0, y = h, vx = v * Math.cos(AN), vy = v * Math.sin(AN), px, py;
  for (P.push([x, y]); y >= 0; ) { const s = Math.hypot(vx, vy); vx -= k * s * vx * FLY.dt; vy -= (D.g + k * s * vy) * FLY.dt; [px, py] = [x, y]; x += vx * FLY.dt; y += vy * FLY.dt; P.push([x, y]); }
  P.land = px + ((x - px) * py) / (py - y); P.pop(); P.push([P.land, 0]); return P; }
function speedFor(d, h) { let lo = 0, hi = D.g; while (fly(hi, h).land < d) hi *= 2; for (let i = FLY.tries; i--; ) { const v = half(lo + hi); if (fly(v, h).land < d) lo = v; else hi = v; } return half(lo + hi); }
const hillReach = (rng, h, dh) => { const key = [rng, h, Math.round(dh)].join(); if (!reachs.has(key)) reachs.set(key, fly(speedFor(rng * mpt, ZERO), h + Math.max(ZERO, Math.round(dh))).land / mpt); return reachs.get(key); }; // E983
const dropTo = (a, b) => (FK.H[a.k] - (b ? FK.H[b.k] : ZERO)) / D.upm, reachOf = (t, u = null) => { const w = D.tower[t.code]; return hillReach(w.bow, w.h * mpt, u ? dropTo(t, u) : Math.max(ZERO, dropTo(t))) + FK.stat(t.code, t.side, 'rng'); };
function shot(a, t, h) { tracers.push({ a, u: dir(t.bx - a.bx, t.by - a.by), P: fly(speedFor(gap(a, t) * mpt, h), h), t0: K.t }); }
// E409
const say = (w, o = {}) => FK.fire('say', w.replace(/\{(\w+)\}/g, (_, x) => o[x] ?? '')), mid = (k) => { const [bx, by] = FK.tileMid(k); return { bx, by }; }, kOf = (p) => FK.tileAt(p.bx, p.by), far = FK.dist;
const centreOf = (S) => ({ bx: sum(S, (u) => u.bx) / S.length, by: sum(S, (u) => u.by) / S.length }), tl = (a, b) => Math.hypot((a % N) - (b % N), Math.floor(a / N) - Math.floor(b / N));
function routeK(a, b, who) { const p = a !== b && FK.findPath(a, (q) => q === b, b, undefined, who), prev = [a, ...(p || [])]; return p ? Math.min(HU.route, Math.max(HU.least, sum(p, (q) => tl(q, prev.shift())) / tl(a, b))) : HU.least; } // E410
const etaOf = (S, k, rk) => Math.max(...S.map((u) => (far(u, mid(k)) / D.upm) * rk / FK.pace(u)));
function mark(S, k, label) { const [u0] = S, O = { k, label, t: K.t, rk: routeK(kOf(centreOf(S)), k, u0), arrived: false }; ORD.add(O); for (const u of S) Object.assign(u, { ord: O, mvT: K.t }); if (u0.side === ME) say(WO.marching, { n: S.length, at: label }); return O; } // E411
const status = (u) => (routing(u) ? 'rout' : u.target && alive(u.target) ? 'fight' : u.job === 'rout' ? 'rally' : u.job === 'march' ? (K.t - u.mvT > HU.still ? 'hold' : !u.ord && u.goal === SIDES[u.side].flag ? 'rally' : 'march') : u.job === 'idle' && u.home && gap(u, u.home) > HU.home ? 'rally' : 'hold'); // E412
const sendable = () => armyOf(ME), idleSoldier = (u) => !(u.sent && u.bn == null) && ['hold', 'rally'].includes(status(u)), free = () => sendable().filter(idleSoldier);
function freeWhy() { const S = sendable(), c = (k) => S.filter((u) => status(u) === k).length; if (!S.length) return WO.none; return WO.busy.replace('{list}', Object.keys(WO.states).filter(c).map((k) => WO.states[k].replace('{n}', c(k))).join(fromBook('words').list.and) || WO.guarding); }
function walkTo(v, p) { Object.assign(v, { job: 'walk', then: 'idle', target: null }); if (!FK.toSpot(v, p)) v.job = 'idle'; }
function order(S, t, k) { const sol = S.filter(armed), vil = S.filter((u) => FK.has(u, 'Gather')), theirs = t && t.side !== ME; // E413
  for (const u of S) u.go = true; // E946
  if (theirs && SIDES[t.side] && !atWar(ME, t.side)) { say(WO.foeFirst); return null; }
  if (theirs && t.kind === 'unit') { if (FK.has(t, 'Prey')) for (const v of vil) ECON.hunt(ME, t, v); }
  else if (t && t.kind === 'bld') { for (const v of vil) if (!up(t) || t.hp < t.hpMax - D.repair.within) ECON.buildAt(v, t); else if (!ECON.startWork(v, t)) walkTo(v, t); }
  else if (t) for (const v of vil) ECON.gatherAt(v, t); else for (const v of vil) walkTo(v, mid(k));
  for (const u of S.filter((v) => !armed(v) && troop(v))) { const at = theirs && t.kind === 'unit' && FK.has(u, 'Convert'), sab = theirs && t.kind === 'bld' && FK.has(u, 'Spy'); if (at || sab) Object.assign(u, { job: at ? 'convert' : 'sab', cv: t, tid: t, path: null }); else walkTo(u, t || mid(k)); } // E475
  for (const u of S.filter((v) => FK.has(v, 'Unpack'))) ECON.sendWagon(u, k ?? kOf(t));
  if (!sol.length) return null; const goal = t ? kOf(t) : k;
  if (theirs) for (const u of sol) { fight(u, t, true); u.sent = false; } else { dress(sol, goal); for (const u of sol) u.sent = !t; }
  return mark(sol, goal, t ? FK.rankName(t.code || FK.KIND[t.kind].code, t.side) : MENU.coord(...FK.tileMid(k))); }
// E414
const mUnits = (m) => units().filter((u) => u.side === ME && u.ord === m.ord && alive(u)), out = (slot) => MS[slot] && !MS[slot].end;
const hostile = (v) => v.side !== ME && alive(v) && isFoe(ME, v) && (armed(v) || beast(v));
const foesNear = (c, r = HU.near) => { const F = []; FK.unitsNear(c, r * T, (v) => { if (hostile(v) && FK.inSight(v) && gap(c, v) < r) F.push(v); }); return F; };
const chance = (S, F) => { const r = (power(S) / Math.max(HU.least, power(F))) * mixOf(S, F); return (r * r) / (HU.least + r * r); };
function ordersTick() { const by = new Map(); for (const u of units()) if (u.side === ME && u.ord && alive(u)) (by.get(u.ord) || by.set(u.ord, []).get(u.ord)).push(u); // E415
  for (const O of ORD) { const S = by.get(O); if (!S) { ORD.delete(O); continue; } const st = S.map(status), walk = S.filter((u, n) => st[n] === 'march');
    Object.assign(O, centreOf(S), { n: S.length, fight: st.includes('fight'), eta: O.arrived || !walk.length ? null : Math.ceil(etaOf(walk, O.k, O.rk)) });
    if (!O.arrived && !walk.length && !O.fight && !st.includes('rout') && K.t - O.t > HU.settle) { O.arrived = true; say(WO.arrived, { n: S.length, at: O.label }); } }
  for (const m of Object.values(MS)) { if (m.end) continue; const S = mUnits(m); if (!S.length) { Object.assign(m, { end: K.t, st: 'lost' }); say(WO.lost, { m: m.name }); continue; }
    const F = foesNear(centreOf(S)), st = S.map(status), walk = st.includes('march'); m.st = st.includes('fight') || (!walk && F.length) ? 'act' : walk ? 'go' : 'done';
    if (m.st === 'done') { m.end = K.t; continue; } if (m.st !== 'act') continue; m.odds += (chance(S, F) - m.odds) * HU.smooth;
    if (m.odds < HU.lose && !m.flash) { m.flash = true; say(WO.losing, { m: m.name }); } else if (m.flash && m.odds > HU.clear) m.flash = false; } }
function send(i, aim) { const S = free().filter((u) => i == null || u.bn === i), slot = i ?? WD.all, name = i == null ? WD.all : WD.squads[i]; // E416
  if (!S.length) return say(i == null ? freeWhy() : WO.nobody, { m: name }); if (out(slot)) callHome(slot, true);
  ECON.orderCost(ME, S); tired(S); const O = order(S, aim.t, aim.k); if (O) MS[slot] = { name, sq: i, ord: O, n0: S.length, t: K.t, due: K.t + etaOf(S, O.k, O.rk), st: 'go', odds: HU.clear }; }
const go = (aim) => { const ready = knows(ME, 'command') ? WD.squads.map((_, i) => i).filter((i) => !out(i) && free().some((u) => u.bn === i)) : []; if (ready.length) ready.forEach((i) => send(i, aim)); else send(null, aim); };
function callHome(slot, quiet) { const m = MS[slot]; if (!m) return; homeAll(mUnits(m)); delete MS[slot]; if (!quiet) say(WO.home, { m: m.name }); }
const everyHome = () => { for (const k in MS) callHome(k, true); homeAll(sendable()); say(WO.allHome); };
function reinforcePlan(m) { const S = mUnits(m); if (!S.length) return null; const c = centreOf(S), F = foesNear(c); if (!F.length) return null; // E417
  const res = free().filter((u) => !S.includes(u)), rk = res.length ? routeK(kOf(centreOf(res)), kOf(c), res.at(-1)) : HU.least, live = sum(S, (u) => u.hp) / Math.max(HU.least, sum(F, (v) => dmgOf(v) / stat(v).rof)), mu = mixOf(S, F), foe = Math.max(HU.least, power(F));
  const cand = res.map((u) => ({ u, t: ((far(u, c) / D.upm) * rk) / FK.pace(u) })).sort((p, q) => p.t - q.t), list = [], waves = []; let pow = power(S);
  for (const r of cand) { if (r.t > live || (pow / foe) * mu >= HU.even) break; list.push(r); pow += power1(r.u); }
  for (const r of list) { const w = waves.at(-1); if (w && (r.t - w.t < HU.gap || waves.length === HU.waves)) w.list.push(r); else waves.push({ t: r.t, list: [r] }); }
  return { c, go: list.map((r) => r.u), waves }; }
function reinforce(S, m) { const U = mUnits(m); if (!U.length) return; const O = order(S, null, kOf(centreOf(U))); if (!O) return; ORD.delete(O); for (const u of S) u.ord = m.ord; }
// E418
const ofKind = (cls) => sendable().filter((u) => clsOf(u.code) === cls), aimK = (aim) => (aim.t ? kOf(aim.t) : aim.k), wait = (k) => Math.ceil(Math.max(K.t, AT[k] ?? K.t) - K.t);
const chargeWhy = (S) => (!S.some((u) => !stat(u).bonly) ? WO.why.charge : AT['charge' + ME] > K.t ? WO.why.winded.replace('{n}', wait('charge' + ME)) : '');
function charge(S) { const [s0] = S; AT['charge' + s0.side] = K.t + CH.cd * FK.stat('', s0.side, 'chargecd'); for (const u of S) if (!stat(u).bonly) { u.chg = K.t + CH.secs; u.mor = Math.min(MO.full, u.mor + CH.nerve); } }
function fallBack(S) { const h = home(ME); if (!h || !S.length) return false; for (const u of S) { const f = nearest(u, FB.look), [dx, dy] = f ? dir(u.bx - f.bx, u.by - f.by) : dir(h.bx - u.bx, h.by - u.by), k = FK.tileAt(u.bx + dx * FB.back * T, u.by + dy * FB.back * T);
  Object.assign(u, { fb: K.t + FB.secs, target: null, focus: null, ord: null, sent: false }); march(u, FK.walkable(k) ? k : u.k); } return true; }
const DIRECTS = { // E419
  wall: (S, aim, said) => { const c = centreOf(S), F = foesNear(c), to = F.length ? centreOf(F) : mid(aimK(aim)), f = dir(to.bx - c.bx, to.by - c.by), k = kOf(c), cols = narrowAt(k, f); for (const u of S) Object.assign(u, { wall: K.t + DI.wall.secs, focus: null, target: null }); dress(S, k, cols ? 'choke' : DI.wall.lay, { t0: K.t, until: K.t + DI.wall.secs, f, cols }); return cols ? WO.narrow.replace('{n}', cols) : said; },
  loose: (S, aim, said) => { if (AT.loose > K.t) return WO.why.reload.replace('{n}', wait('loose')); const c = centreOf(S), F = foesNear(c);
    if (F.length) { const f = centreOf(F), r = Math.min(...S.map((u) => stat(u).rng)) * DI.arc, [dx, dy] = dir(c.bx - f.bx, c.by - f.by); dress(S, FK.tileAt(f.bx + dx * r * T, f.by + dy * r * T), 'line', { t0: K.t, until: K.t + DI.arcSecs, f: [-dx, -dy], arc: { r } }); } else order(S, aim.t, aim.k);
    for (const u of S) u.cd = null; AT.loose = K.t + DI.loose; return said; },
  charge: (S, aim, said) => { const why = chargeWhy(S); if (why) return why; order(S, aim.t, aim.k); charge(S); return said; },
};
function direct(cls, aim) { const [id, , snd, said] = WO.direct[cls], S = ofKind(cls), [u0] = S; if (!S.length) return say(WO.why.none); // E420
  const w = DIRECTS[id](S, aim, said); if (!w.endsWith('!')) return say(w); const f = ECON.orderCost(ME, S); tired(S); say(f ? WO.fed : w, { m: w, n: f }); FK.fire('event', snd, u0); }
const directWait = (cls) => { const [id] = WO.direct[cls]; return wait(id); };
function narrowAt(k, [fx, fy]) { const [cx, cy] = FK.tileMid(k), most = CK.max * GR.gap; let w = ZERO; for (const s of [ONE, -ONE]) for (let d = ONE; d <= most; d++) { if (!FK.walkable(FK.tileAt(cx - fy * d * T * s, cy + fx * d * T * s))) break; w++; } // E421
  return w < most + most ? Math.min(CK.max, Math.max(CK.min, Math.round(w / GR.gap))) : null; }
function coverNear(k) { const ci = k % N, cj = Math.floor(k / N), R = Math.ceil(AM.find), C0 = AM.cover, inN = (v) => v >= C0 && v < N - C0; let best = null, bd = Infinity; // E422
  for (let j = cj - R; j <= cj + R; j++) for (let i = ci - R; i <= ci + R; i++) { const q = j * N + i, d = Math.hypot(i - ci, j - cj); if (!inN(i) || !inN(j) || !FK.walkable(q) || d >= bd || d > AM.find) continue;
    let near = false; for (let y = -C0; y <= C0 && !near; y++) for (let x = -C0; x <= C0 && !near; x++) if ((x || y) && FK.FOR[q + y * N + x]) near = true; if (near) [best, bd] = [q, d]; }
  return best; }
function ambushAt(k, S) { const [none, bare, gone] = WO.ambush; if (!S.length) return say(none); const q = coverNear(k); if (q == null) return say(bare); const A = { k: q };
  for (const u of S) Object.assign(u, { target: null, focus: null, ord: null, hid: false }); dress(S, q, 'square'); for (const u of S) Object.assign(u, { amb: A, ambK: u.goal }); say(gone, { n: S.length, at: MENU.coord(...FK.tileMid(q)) }); }
function ambushTick(u) { if (u.goal !== u.ambK || (u.job !== 'march' && u.job !== 'hold')) { u.amb = null; u.hid = false; return false; } // E423
  if (!u.hid) { if (u.job === 'hold' || gap(u, mid(u.ambK)) < AM.there) u.hid = true; return false; }
  const f = nearest(u, AM.spring * FK.stat(u.code, u.side, 'spring')); if (!f && !(K.t - u.hurtT < AM.blow)) return true; const A = u.amb;
  for (const v of units()) if (v.amb === A) { Object.assign(v, { amb: null, hid: false, chg: K.t + CH.secs }); if (f) fight(v, f); }
  const [, , , sprung] = WO.ambush; if (u.side === ME) { say(sprung); FK.fire('event', 'march', u); } return false; }
function drawOrders(ctx, s, at, oval) { const O0 = ST.orders, [lw, rw, aw] = O0.line, [la, ra, aa, ta] = O0.alpha, F0 = ST.flag, L0 = ST.leaves, me = SIDES[ME].col; ctx.save(); ctx.strokeStyle = ctx.fillStyle = me; ctx.textAlign = 'center'; // E424
  for (const O of ORD) { if (!O.n) continue; const [x, y] = at(...FK.tileMid(O.k)), r = O0.ring * s; if (!O.arrived && O.bx != null) { ctx.globalAlpha = la; ctx.lineWidth = lw; ctx.setLineDash(O0.dash); ctx.lineDashOffset = -performance.now() / O0.flow; ctx.beginPath(); ctx.moveTo(...at(O.bx, O.by)); ctx.lineTo(x, y); ctx.stroke(); }
    ctx.globalAlpha = O.arrived ? aa : ra; ctx.lineWidth = O.arrived ? aw : rw; ctx.setLineDash(O.arrived ? O0.done : O0.dash); oval(x, y, r, O0.tilt); ctx.stroke(); if (O.eta) { ctx.globalAlpha = ta; ctx.fillText(O.eta + 's', x, y - r * O0.tilt - O0.up); } }
  ctx.setLineDash([]); ctx.globalAlpha = D.bases.pace; const fl = SIDES[ME].flag; if (fl != null) { const [x, y] = at(...FK.tileMid(fl)), [fw, f1, f2] = F0.fly.map((v) => v * s); ctx.strokeStyle = F0.col; ctx.lineWidth = F0.line; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - F0.pole * s); ctx.stroke(); ctx.fillStyle = me; ctx.beginPath(); ctx.moveTo(x, y - F0.pole * s); ctx.lineTo(x + fw, y - f1); ctx.lineTo(x, y - f2); ctx.closePath(); ctx.fill(); }
  const [sp, ph, dp] = L0.sway, [rx, ry] = L0.r, [t0, t1] = L0.turn; for (const u of units()) if (u.hid && u.side === ME) { const [x, y] = FK.toScreen(u.vx, u.vy); L0.at.forEach((m, i) => { const a = K.t * sp + i * ph + u.bx; ctx.fillStyle = L0.cols[i % L0.cols.length]; ctx.beginPath(); ctx.ellipse(x + m * L0.spread * s + Math.sin(a) * s, y - L0.up * s + L0.lift[i] * L0.rise * s + Math.cos(a) * dp * s, rx * s, ry * s, t0 + i * t1, ...ST.marks.arc); ctx.fill(); }); }
  ctx.restore(); }
FK.on('spawn', (u) => { u.hp = u.hpMax = hpMax(u); u.cd = FK.rng(); u.mor = MO.full; if (u.side === ME && armed(u)) rebattalion(); });
FK.on('start', () => { waves.fill(null); homeT = null; routSaid = -Infinity; ORD.clear(); for (const k in MS) delete MS[k]; for (const k in AT) delete AT[k]; ordT = HU.beat; rel.clear(); reachs.clear(); fresh(); sparks.length = tracers.length = 0; for (const u of units()) if (u.hp == null) Object.assign(u, { hp: hpMax(u), hpMax: hpMax(u), mor: MO.full }); for (const t of things()) if (t.kind === 'bld') fill(t); });
const fill = (t) => { t.hpMax = hpMax(t); t.hp = t.done >= 1 ? t.hpMax : 1; };
FK.on('tick', (dt) => {
  if (ECON.result()) return; heal(dt); if (FK.every(TP.beat)) traps(); homeT -= dt; if (due(homeT)) { homeT = D.scan; formHome(); }
  for (const t of FK.blds()) { if (t.hpMax == null) fill(t);
    const tw = D.tower[t.code]; if (!tw || !up(t)) continue; t.cd -= dt; if (!due(t.cd)) continue; const reach = reachOf(t); let best = null; FK.unitsNear(t, (reach + t.n) * T, (u) => { if (SIDES[u.side] && isFoe(t.side, u, t) && FK.inSight(u, t.side, t) && !u.veil && !FK.has(u, 'Envoy') && (!tw.only || FK.has(u, tw.only)) && edgeDist(u, t) <= reachOf(t, u) && (!best || edgeDist(u, t) < edgeDist(best, t))) best = u; });
    if (best) { FK.fire('event', 'shot', t); shot(t, best, tw.h * mpt); hit(t, best, FK.stat(t.code, t.side, 'atk') + ECON.within(t)); t.cd = FK.stat(t.code, t.side, 'rof'); } }
  for (const u of units().slice()) { if (!alive(u) || u.inside || u.den) continue; const s = stat(u); u.cd -= dt; u.rp -= dt; u.sc -= dt; const look = due(u.sc); if (look) { u.sc = D.scan; u.fam = FK.fam(u.side, u.k); } if (u.mps) u.mvT = K.t;
    if (!SIDES[u.side]) { if (wild(u, look)) continue; }
    else if (FK.has(u, 'Scout') && scout(u, look)) continue;
    else if (support(u, dt, look)) continue;
    else if (!armed(u)) { if (u.job !== 'fight') { const w = units().find((b) => !SIDES[b.side] && b.job === 'fight' && b.target === u); if (w) fight(u, w); else continue; } }
    else if (brain(u, dt, look)) continue;
    if (u.job !== 'fight') continue; const t = u.target; if (!t || !alive(t)) { u.target = null; u.path = null; if (u.was != null && armed(u)) march(u, u.was); else u.job = 'idle'; continue; }
    if (edgeDist(u, t) <= (ranged(u) ? hillReach(s.rng, ZERO, dropTo(u, t)) : s.rng) + 0.5) { if (u.kT > K.t - D.kite.hold && u.path) continue; u.path = null; [u.fx, u.fy] = dir(t.bx - u.bx, t.by - u.by); u.face = Math.sign(u.fx) || u.face; // E398
      const f = look && !due(u.cd) && kiteOf(u) && nearest(u, D.kite.near, u, (v) => !ranged(v)); if (f) { const [dx, dy] = dir(u.bx - f.bx, u.by - f.by), x = u.bx + dx * D.kite.back * T, y = u.by + dy * D.kite.back * T; if (FK.walkable(FK.tileAt(x, y))) { Object.assign(u, { path: [[x, y]], at: 0, then: 'fight', kT: K.t }); continue; } }
      if (due(u.cd)) { hit(u, t); u.cd = s.rof; } } else if (!u.path && due(u.rp)) { u.rp = D.repath; if (!toward(u, t)) { u.target = null; u.job = 'idle'; u.rp = 3 * D.repath; block(u); } } }
  ordT -= dt; if (due(ordT)) { ordT = HU.beat; ordersTick(); } if (FK.every(D.beats.natives)) raids(); if (FK.every(D.beats.slow)) for (const o of D.players) if (o !== ME) loot(o);
  waves.forEach((w, side) => { if (!w) return; w.t += dt; if (armyFree(side, 'rout').length < D.breakAt * w.n0) recall(side); });
});
// E240
FK.on('draw', (ctx, s) => { if (!FK.show.U) return; const [cw, ch] = FK.size(), MK = ST.marks, [a0, a1] = MK.arc, B = MK.bar, at = (x, y, up = 0) => FK.toScreen(...FK.toView(x, y, Math.max(0, FK.H[FK.tileAt(x, y)]) + up));
  const seen = (x, y, m) => x > -m && x < cw + m && y > -m && y < ch + m, bar = (x, y, w, f, col) => { ctx.save(); ctx.fillStyle = C.shade; ctx.globalAlpha = B.alpha; ctx.fillRect(x - half(w), y, w, B.h); ctx.restore(); ctx.fillStyle = col; ctx.fillRect(x - half(w), y, w * f, B.h); };
  const oval = (x, y, r, k, from = a0, to = a1) => { ctx.beginPath(); ctx.ellipse(x, y, r, r * k, a0, from, to); };
  for (const u of units()) if (u.hp != null && u.hp < u.hpMax && FK.inSight(u)) { const [x, y] = FK.toScreen(u.vx, u.vy), [w, up, m] = B.unit; if (seen(x, y, m)) bar(x, y - up * s, w * s, u.hp / u.hpMax, SIDES[u.side] ? SIDES[u.side].col : C.white); }
  for (const t of FK.blds()) if (t.hp != null && t.hp < t.hpMax && up(t) && FK.inSight(t)) { const [x, y] = FK.toScreen(t.vx, t.vy), [w, up, plus, m] = B.bld; if (seen(x, y, m)) bar(x, y - (t.n * up + plus) * s, t.n * w * s, t.hp / t.hpMax, SIDES[t.side].col); }
  drawOrders(ctx, s, at, oval);
  ctx.strokeStyle = C.shaft; ctx.lineWidth = s; for (const r of tracers.slice()) { const P = r.P, n = P.length - 1, p = (K.t - r.t0) / (n * FLY.dt); if (p >= 1) { tracers.splice(tracers.indexOf(r), 1); continue; } // E399
    const [ux, uy] = r.u, pt = (f) => { const [x, y] = P[Math.round(Math.max(0, f) * n)], m = (x / mpt) * T; return at(r.a.bx + ux * m, r.a.by + uy * m, y * D.upm); };
    ctx.beginPath(); ctx.moveTo(...pt(p - FLY.tail)); ctx.lineTo(...pt(p)); ctx.stroke(); }
  const K0 = ST.spark; ctx.save(); ctx.strokeStyle = C.flame; ctx.lineWidth = K0.line * s; for (const k of sparks) { const a = (K.t - k.t) / FLY.spark; if (a < 0 || a >= 1) continue; const [x, y] = at(k.x, k.y, K0.lift), g = (K0.to + a * K0.grow) * s; ctx.globalAlpha = 1 - a; ctx.beginPath(); // E400
    for (let i = K0.rays; i--; ) { const an = i * K0.turn + k.t * K0.spin, c = Math.cos(an), e = Math.sin(an); ctx.moveTo(x + c * K0.from * s, y + e * K0.from * s); ctx.lineTo(x + c * g, y + e * g); } ctx.stroke(); } ctx.restore();
// E960
  const S0 = ST.standard, grp = new Map(); STD.length = ZERO; if (FK.cam.z < S0.zoom) return; for (const u of units()) if (armed(u) && alive(u) && !engine(u) && (u.job === 'march' || u.job === 'hold' || u.was != null) && FK.inSight(u)) { const key = u.side + ' ' + (u.ord ?? u.rally ?? u.was ?? u.goal), g = grp.get(key) || grp.set(key, { o: u.side, us: [] }).get(key); g.us.push(u); } // E401
  for (const { o, us } of grp.values()) { if (us.length < S0.least) continue; const [x, y] = at(sum(us, (u) => u.bx) / us.length, sum(us, (u) => u.by) / us.length), h = S0.pole * s, [r0, r1] = S0.ring, r = r0 * s + r1, col = SIDES[o].col, [fw, f1, f2, f3] = S0.flag.map((v) => v * s), [sp, sw, tail] = S0.wave, a = Math.sin(K.t * sp + o) * sw * s, top = S0.top; STD.push({ pole: S0.pole, vx: sum(us, (u) => u.vx) / us.length, vy: sum(us, (u) => u.vy) / us.length, i: o + us.length });
    ctx.lineWidth = S0.line * s; ctx.save(); ctx.strokeStyle = C.shade; ctx.globalAlpha = S0.alpha; oval(x, y, r, S0.tilt); ctx.stroke(); ctx.restore(); ctx.strokeStyle = col; oval(x, y, r, S0.tilt, top, top + (sum(us, (u) => u.hp) / sum(us, (u) => u.hpMax)) * a1); ctx.stroke();
    ctx.strokeStyle = C.pole; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.stroke(); ctx.fillStyle = col; ctx.strokeStyle = C.shade; ctx.lineWidth = s; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.quadraticCurveTo(x + half(fw), y - h + a, x + fw, y - h + f1 + a * tail); ctx.lineTo(x + fw, y - h + f2 + a * tail); ctx.quadraticCurveTo(x + half(fw), y - h + f2 + a, x, y - h + f3); ctx.closePath(); ctx.fill(); ctx.stroke(); }
});
FK.on('shut', (side, u) => !u || isFoe(side, u)); // E329
const power = (us) => sum(us, power1); // E238
const mixOf = (S, F) => { const first = (_, i) => i < D.odds.look, a = S.filter(first), b = F.filter(first), x = sum(a, (u) => sum(b, (v) => vs(u, v))), y = sum(a, (u) => sum(b, (v) => vs(v, u))); return x ? Math.min(D.odds.hi, Math.max(D.odds.lo, x / y)) : D.bases.pace; };
function odds(S, side) { const me = S.length ? S[0].side : ME, F = armyOf(side).filter((u) => FK.inSight(u, me)), p = power(S) * mixOf(S, F); // E283
  const q = power(F) + things().filter((t) => t.side === side && D.tower[t.code] && !FK.has(t, 'Seat') && alive(t) && FK.inSight(t, me)).length * D.ai.towerWorth + D.ai.peopleWorth; return (p * p) / (p * p + q * q); } // E284
// E465
const ZE = D.zeal, CV = D.convert, SA = D.sab, [SOL, TOWER] = D.sab.seen, FO = D.follow, PR = D.prison, TW = fromBook('words').troops;
const troop = (u) => armed(u) || FK.has(u, 'Heal') || FK.has(u, 'Convert') || FK.has(u, 'Spy');
const caught = (a, t) => t.kind === 'unit' && routing(t) && K.t - t.routAt > PR.after && gap(a, t) <= PR.r && !stat(a).bonly && !!SIDES[a.side] && !!SIDES[t.side]; // E466
function support(u, dt, look) { if (u.job === 'school') return true; if (FK.has(u, 'Spy')) return spy(u, look); if (!FK.has(u, 'Convert') && !FK.has(u, 'Heal')) return false; // E467
  if (u.job === 'convert') return convert(u, dt); if (look && (u.job === 'idle' || u.job === 'follow')) follow(u); return true; }
function follow(u) { let a = null; FK.unitsNear(u, FO.r * T, (v) => { if (v.side === u.side && armed(v) && alive(v) && (v.job === 'march' || v.job === 'fight') && (!a || gap(u, v) < gap(u, a))) a = v; }); // E468
  if (!a) { if (u.job === 'follow' && !u.path) u.job = 'idle'; return; } const k = FK.tileAt(a.bx - (a.fx || null) * FO.back * T, a.by - (a.fy || null) * FO.back * T); if (gap(u, mid(k)) > FO.near && FK.go(u, k)) Object.assign(u, { job: 'follow', then: 'follow' }); }
function convert(u, dt) { const t = u.cv, full = !!t && (armed(t) ? ECON.armyFull(u.side) : ECON.popOf(u.side) >= ECON.popCap(u.side)); if (full && u.side === ME) say(TW.convert.full); // E469
  if (!t || !alive(t) || t.inside || !SIDES[t.side] || !atWar(u.side, t.side) || full || u.cvCd > K.t) { Object.assign(u, { job: 'idle', cv: null }); return true; }
  if (gap(u, t) > CV.r) { u.cvT = due(u.cvT - dt) ? null : u.cvT - dt; if (!u.path && due(u.rp)) { u.rp = D.repath; FK.go(u, t.k); } return true; }
  u.path = null; u.cvT = (u.cvT || null) + dt; if (u.cvT < CV.secs * FK.stat(u.code, u.side, 'convert')) return true; const was = t.side;
  Object.assign(t, { side: u.side, job: 'idle', target: null, focus: null, bn: null, hb: null, path: null, goal: null, was: null, ord: null }); t.hpMax = hpMax(t); t.hp = Math.min(t.hp, t.hpMax);
  Object.assign(u, { cvCd: K.t + CV.cd, cvT: null, job: 'idle', cv: null }); const name = FK.SH[t.code].name.toLowerCase(); if (u.side === ME) { rebattalion(); say(TW.convert.won, { name }); } else if (was === ME) say(TW.convert.lost, { name }); return true; }
// E982
function heal(dt) { const H = [...FK.blds().filter((t) => FK.has(t, 'Heal') && up(t)), ...units().filter((u) => FK.has(u, 'Heal') && !u.inside && alive(u))]; if (!H.length) return; // E470
  for (const u of units()) { if (!(u.hp < u.hpMax) || !SIDES[u.side] || !alive(u)) continue; let best = null; for (const h of H) { const R = D.heal[h.code]; if (h.side === u.side && R.heal > best && gap(u, h) < R.r) best = R.heal; } if (best) u.hp = FK.relax(u.hp, u.hpMax, u.hpMax / (best * FK.stat(u.code, u.side, 'heal')), dt); } }
const watches = (b, u) => b.side !== u.side && SIDES[b.side] && FK.has(b, 'Shoot') && up(b) && atWar(b.side, u.side) && gap(u, b) < TOWER + FK.stat(b.code, b.side, 'spysight'); // E471
const guarded = (b) => FK.bldsNear(b.bx, b.by, SA.far * T, (d) => d.side === b.side && FK.has(d, 'Shoot') && up(d) && gap(b, d) < TOWER + FK.stat(d.code, d.side, 'spysight'));
const veilOf = (u) => { let w = false; FK.unitsNear(u, SOL * T, (v) => { w = w || (!!SIDES[v.side] && armed(v) && atWar(v.side, u.side) && !v.inside && alive(v) && gap(u, v) < SOL); }); return !w && !FK.bldsNear(u.bx, u.by, SA.far * T, (b) => watches(b, u)); }; // E472
function spy(u, look) { if (look) { u.veil = veilOf(u);
    let b = null; FK.bldsNear(u.bx, u.by, (SA.look + D.large) * T, (t) => !!(SIDES[t.side] && atWar(u.side, t.side) && alive(t) && edgeDist(u, t) < SA.look && (b = t))); if (b) ECON.intel(u.side, b.side); }
  if (u.job === 'sab') { const b = u.tid; if (!b || !alive(b) || !atWar(u.side, b.side)) Object.assign(u, { job: 'idle', tid: null }); else if (edgeDist(u, b) <= SA.at) sabotage(u, b); else if (!u.path && due(u.rp)) { u.rp = D.repath; FK.goBy(u, b); } return true; }
  if (u.side !== ME && look && u.job === 'idle') { let b = null; FK.bldsNear(u.bx, u.by, FK.sightOf(u), (t) => !!(SIDES[t.side] && atWar(u.side, t.side) && alive(t) && FK.inSight(t, u.side, u) && SA.how[t.code] && !guarded(t) && (b = t))); if (b) Object.assign(u, { job: 'sab', tid: b }); } // E473
  return true; }
function sabotage(u, b) { const how = SA.how[b.code], W = TW.sab, name = FK.SH[b.code].name; if (!how) { u.job = 'idle'; return; } // E474
  if (how === 'burn') { b.hp -= b.hpMax * SA.burn; if (!alive(b)) die(b, null); else ECON.ignite(b, 'sabotage'); } else { b.stall = K.t + SA.stall; const c = (b.q || []).shift(); if (c && D.ages.includes(c)) SIDES[b.side].aging = null; const [nx] = b.q || []; if (nx) b.qt = ECON.timeOf(b.side, nx); }
  if (b.side === ME) say(W[how], { at: MENU.coord(b.bx, b.by), name, n: SA.stall }); else if (u.side === ME) say(how === 'burn' ? W.didBurn : W.didStall, { name: name.toLowerCase() }); die(u, null); }
// E582
const FD = D.finds, RD = D.raids, JN = D.wayfarer, WW = fromBook('words').wild, ONE = D.count.one, ZERO = D.count.zero, raid = { hit: {} }, [L0, L1] = FD.leash, codeOf = (t) => (FK.KIND[t.kind] || {}).code, rowOf = FK.rowOf;
const guardsLeft = (t) => units().some((v) => v.find === t && !SIDES[v.side] && alive(v) && FK.has(v, 'Fight')), besideK = (t) => { let b = null; FK.stamp(t.bx, t.by, FD.take * T, (k, d) => { if (FK.walkable(k) && (!b || d < b.d)) b = { d, k }; }); return b && b.k; };
function wild(u, look) { if (u.back && K.t > u.back) Object.assign(u, { back: null, horde: false, home: u.camp, aggro: null }); // E583
  if (FK.has(u, 'Join')) { if (look) meet(u); return true; } const h = u.home;
  if (!h) { if (FK.has(u, 'Fight') && u.job === 'idle' && !u.path && look) { const t = choose(u, D.wildAggro); if (t && t.kind !== 'bld') fight(u, t); } return false; } if (!FK.has(u, 'Fight')) return true;
  const rr = FD.raid[u.code], far = u.horde ? Infinity : (rr || L0) + L1; let t = u.target && alive(u.target) && !u.target.inside ? u.target : null;
  if (look) { t = u.aggro && alive(u.aggro) && !u.aggro.inside && gap(u.aggro, h) < far ? u.aggro : nearest(u, rr ? rr + FD.reach : FD.look, u, (v) => !!SIDES[v.side] && !v.inside && (u.horde || gap(v, h) < (rr && tagsOf(v).includes('civ') ? rr : FD.home)) && !(rr && ECON.guarded(v)));
    if (!t && u.horde) t = foeBld(u, FD.breaks); const W = FD.weigh[u.code];
    if (t && W && u.aggro !== t) { if (!u.hd || u.hd.t !== t || K.t > u.hd.until) u.hd = { t, until: K.t + W, fight: FK.rng() < (FD.stake * power1(u)) / power1(t) }; if (!u.hd.fight) t = null; } } // E584
  if (t && gap(t, h) > far) { t = null; u.aggro = null; } if (t) { if (u.target !== t) fight(u, t); return false; } if (u.job === 'fight') Object.assign(u, { job: 'idle', target: null, path: null });
  if (!u.path && gap(u, h) > FD.back && due(u.rp)) { u.rp = D.repath; FK.goBeside(u, FK.tileAt(h.bx, h.by)); } return true; }
function meet(u) { let m = null; FK.unitsNear(u, JN.meet * T, (v) => { if (!m && SIDES[v.side] && alive(v) && !v.inside && !FK.has(v, 'Envoy') && gap(u, v) < JN.meet) m = v; }); if (!m) return; // E585
  const o = m.side, n = JN.joins[u.code], seat = FK.seatOf(o); for (let i = n; i--; ) { if (!seat || ECON.popOf(o) >= ECON.popCap(o)) { ECON.earn(o, 'food', JN.food, 'finds', false); continue; }
    const [vil] = FK.trains(seat.code), v = FK.spawn(vil, o, u.k, FK.rng), r = SIDES[o].rally, f = r && ECON.bestFind(v, r); v.bx += i * JN.gap * T; FK.place(v); if (f) ECON.gatherAt(v, f); }
  if (o === ME) say(n > ONE ? WW.wayfarer.many : WW.wayfarer.one); FK.vanish(u); }
function roulette(w) { let x = FK.rng() * sum(w, (v) => v); const i = w.findIndex((v) => (x -= v) <= null); return ~i ? i : ~-w.length; } // E586
function raids() { const [g0, g1] = RD.gap, wait = () => (g0 + FK.rng() * (g1 - g0)) / (FK.hz('horde') ? RD.horde : ONE); // E587
  if (raid.at == null) raid.at = RD.from + (D.ai.diff[MENU.S.game.diff].safe ?? null) + wait() * RD.first; if (K.t < raid.at) return; raid.at = K.t + wait();
  const M = [], w = [], B = new Map(); for (const side of D.players) { const k = FK.seatOf(side); if (!k || ECON.fell(side) || !atWar(side, 'rob')) continue; const [f] = things().filter((t) => codeOf(t) === RD.camp && guardsLeft(t)).sort((a, b) => gap(a, k) - gap(b, k)); if (!f) continue;
    const R = units().filter((u) => u.find === f && alive(u) && stat(u).atk).slice(null, RD.n + SIDES[side].age), band = sum(R, power1), again = ONE + RD.again[ZERO] * Math.exp(-(K.t - (raid.hit[side] ?? -Infinity)) / RD.again[ONE]);
    for (const v of R.length ? units() : []) { if (v.side !== side || !alive(v) || v.inside || !(FK.has(v, 'Gather') || FK.has(v, 'Trade'))) continue; let guard = null; FK.unitsNear(v, RD.group * T, (s) => { if (s.side === side && armed(s) && alive(s) && !s.inside && gap(s, v) < RD.group) guard += power1(s); });
      const c = power1(v) + guard; if ((band * band) / (band * band + c * c) <= RD.beat) continue; const load = (v.load || null) + sum(Object.values(v.goods || {}), (x) => x); M.push(v); B.set(v, R); w.push((again * (D.carry + RD.load * load) * band) / (D.carry * (band + RD.guard * guard))); } }
  if (!M.length) return; const mark = M[roulette(w)], R = B.get(mark); raid.hit[mark.side] = K.t; for (const u of R) Object.assign(u, { camp: u.home, home: { bx: mark.bx, by: mark.by }, aggro: mark, horde: true, back: K.t + RD.secs });
  if (mark.side === ME) say(WW.raid, { name: FK.SH[mark.code].name.toLowerCase(), at: MENU.coord(mark.bx, mark.by) }); return mark; }
function loot(o) { const L = FD.loot, P = D.ai.pers[D.ai.pers.of[o]], army = armyOf(o), seat = FK.seatOf(o); if (!seat || ECON.fell(o)) return; // E588
  for (const t of things()) if ((rowOf(t) || {}).hire && !t.taken && SIDES[o].store.gold >= L.gold) ECON.hire(o, t); if (!P || !P.loot || army.length < L.army || waves[o]) return;
  const out = army.filter((u) => u.loot); if (out.length) { const [u0] = out, f = u0.loot; if (f.gone || f.taken || (!guardsLeft(f) && K.t - u0.lootT > L.give)) { for (const u of out) u.loot = null; homeAll(out); } return; }
  let f = null; for (const t of things()) { const F = rowOf(t), d = F && gap(t, seat); if (F && !t.taken && (F.got || F.hire || (guardsLeft(t) && SIDES[o].age)) && d < (F.got || F.hire ? L.far : L.stop) && (!f || d < gap(f, seat))) f = t; }
  const home = army.filter((u) => u.job === 'idle' && !stat(u).bonly && !u.esc), go = home.slice(null, Math.min(L.go, Math.ceil(home.length * L.share))), k = f && besideK(f); if (k == null || go.length < L.least) return;
  for (const u of go) { march(u, k); Object.assign(u, { loot: f, lootT: K.t }); } }
function scout(u, look) { if (look) u.veil = !!u.sneak && veilOf(u); // E813
  if (u.job === 'idle' && !u.path && !u.target) u.job = 'scout'; if (u.job !== 'scout') return false; if (u.path) return true; const S = FD.scout; // E589
  if (look) { let f = null; for (const t of things()) { const F = rowOf(t); if (F && F.got && !t.taken && !guardsLeft(t) && gap(t, u) < S.far && !units().some((v) => SIDES[v.side] && v.side !== u.side && gap(v, t) < S.clear) && (!f || gap(t, u) < gap(f, u))) f = t; }
    const k = f && besideK(f); if (k != null && FK.go(u, k)) { u.then = 'scout'; return true; } }
  if (!u.route) { const e = S.edge * T, j = () => (FK.rng() * (S.jit + S.jit) - S.jit) * T, c = [[FK.MID, FK.B1 - e], [FK.B1 - e, FK.MID], [FK.MID, FK.B0 + e], [FK.B0 + e, FK.MID], ...things().filter((t) => FK.has(t, 'Seat')).map((t) => [t.bx + Math.sign(FK.MID - t.bx) * S.keep * T, t.by + Math.sign(FK.MID - t.by) * S.keep * T]), [FK.MID - S.mid * T, FK.MID - S.mid * T], [FK.MID + S.mid * T, FK.MID + S.mid * T]];
    u.route = c.map(([x, y]) => ({ bx: x + j(), by: y + j() })).sort((a, b) => Math.atan2(a.by - FK.MID, a.bx - FK.MID) - Math.atan2(b.by - FK.MID, b.bx - FK.MID)); const ds = u.route.map((w) => gap(w, u)); u.wp = ds.indexOf(Math.min(...ds)); }
  const w = u.route[u.wp % u.route.length]; if (gap(u, w) < S.at) u.wp = -~u.wp; else if (due(u.rp)) { u.rp = D.repath; if (FK.go(u, FK.tileAt(w.bx, w.by))) u.then = 'scout'; else u.wp = -~u.wp; } return true; }
FK.on('start', () => { raid.at = null; raid.hit = {}; });
// E519
const TP = D.trap, CT = fromBook('words').camp.trap, shown = (b, side) => !FK.has(b, 'Trap') || b.side === side || friendly(side, b.side) || !!(b.seen || {})[side];
FK.on('hide', (t) => !shown(t, ME)); FK.on('own', (t) => friendly(ME, t.side));
function traps() { for (const b of things().slice()) { if (b.kind !== 'bld' || !FK.has(b, 'Trap') || !up(b) || b.gone) continue; const kind = FK.SH[b.code].trap, E = TP.kinds[kind]; b.seen = b.seen || {};
  FK.unitsNear(b, TP.scout * T, (v) => { if (b.gone || !alive(v) || v.inside || !SIDES[v.side] || v.side === b.side || friendly(v.side, b.side) || gap(v, b) > TP.scout) return;
    if (FK.has(v, 'Scout') && !b.seen[v.side]) { b.seen[v.side] = true; if (v.side === ME) say(CT.found, { what: CT.names[kind], at: MENU.coord(b.bx, b.by) }); return; }
    if (!b.seen[v.side] && gap(v, b) <= TP.r) spring(b, v, kind, E); }); } }
function spring(b, v, kind, E) { const horse = FK.SH[v.code].mount ? 'horse' : 'foot', name = FK.rankName(v.code, v.side).toLowerCase(); // E520
  if (E.hits) { if (K.t - (v.spikeT ?? -Infinity) < E.again) return; v.spikeT = K.t; b.hits = -~b.hits; b.seen[v.side] = true; if (b.hits >= E.hits) FK.unbuild(b); } else FK.unbuild(b);
  if (v.side === ME) say(CT.hit[kind], { name, lame: E.hits && E.stuck[horse] ? CT.lame : '' }); else if (b.side === ME) say(CT.caught, { what: CT.names[kind], name, side: fromBook('words').end.sides[v.side] });
  if (E.take) { if (FK.has(v, 'Gather') || (armed(v) && !E.take.not.includes(clsOf(v.code)))) ECON.takePrisoner(b.side, v); return; }
  v.hp -= v.hpMax * E.hurt[horse]; v.hurtT = K.t; if ((E.stuck || {})[horse]) v.stuck = K.t + E.stuck[horse]; if (!alive(v)) die(v); }
FK.on('save', (X) => { X.war = { waves, homeT, routSaid, ordT, ORD, MS, AT, rel, SQ, raid }; }); // E667
FK.on('load', ({ war: W }) => { ({ homeT, routSaid, ordT } = W); const keep = { waves, ORD, MS, AT, rel, SQ, raid }; for (const k in keep) FK.refill(keep[k], W[k]); });
const take = (t) => { for (const u of units()) if (u.target === t) u.target = null; FK.vanish(t); }; // E691
return { hillReach, standards: STD, chargeWhy, take, wild, meet, raids, loot, scout, roulette, guardsLeft, besideK, traps, shown, spring, guard, guardsOf, order, send, go, callHome, everyHome, reinforcePlan, reinforce, direct, directWait, ambushAt, foesNear, status, free, freeWhy, sendable, centreOf, routeK, etaOf, mixOf, chance, homeAll, charge, fallBack, ORD, MS, attack, recall, fight, march, hit, damage, die, armyOf, armyFree, power, power1, odds, waves, armed, enemies, isFoe, groupOf, stance, treaty, atWar, friendly, hpMax, stat, vs, fromWhere, reachOf, fly, speedFor, dress, drillOn, rebattalion, plan, squad, lack, cycle, dialOf, temperOf, shapeOf, formOf, kiteOf, SQ, DIAL, SHAPES, bestFoe, canBeat, worth, formHome, wear, dmgOf, knows };
})();
