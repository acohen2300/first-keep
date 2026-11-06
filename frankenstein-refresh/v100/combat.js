'use strict';
// E227
window.WAR = (() => {
const { D, C, W, K, A, SIDES, N } = FK;
// E170
const things = FK.things, units = FK.units, T = D.tile, [ME] = D.players, MO = D.nerve, FL = D.flanking, AR = D.army, GR = D.grid, FLY = D.flight, FM = D.forms, ST = FK.SPRITE, WD = fromBook('words').army;
const stat = (u) => D.stats[u.code] || D.stats.UV;
const hpMax = (t) => FK.stat(t.code, t.side, 'hp') ?? 400;
const armed = (u) => !!SIDES[u.side] && FK.has(u, 'Fight') && !FK.has(u, 'Gather');
const SB = fromBook('sides'), rel = new Map(); // E285
const groupOf = (x) => (SIDES[x.side] ? null : SB.beasts.includes(x.code) ? 'beast' : Object.keys(SB.groups).find((g) => SB.groups[g].includes(x.code)) || 'nat'); // E286
const stance = (a, b) => (a === b ? null : rel.get(a + ' ' + b) ?? SB.start), treaty = (a, b, s) => { if (SB.stances.includes(s)) { rel.set(a + ' ' + b, s); rel.set(b + ' ' + a, s); } }; // E287
const atWar = (a, b) => stance(a, b) === 'war', friendly = (a, b) => a === b || stance(a, b) === 'ally';
function isFoe(o, x, me) { if (x.side === o) return false; if (!SIDES[x.side]) { const g = groupOf(x); return g === 'beast' || atWar(o, g); } if (SIDES[o]) return atWar(o, x.side); // E288
  const g = (me && groupOf(me)) || 'nat'; return g === 'beast' || (atWar(x.side, g) && x.side === ME); } // E289
const enemies = (a, b) => isFoe(a.side, b, a);
const edgeDist = (u, t) => { if (t.kind !== 'bld') return Math.hypot(u.bx - t.bx, u.by - t.by) / T; const [sx, sy] = FK.fromBoard(u.bx, u.by); return Math.hypot(Math.max(0, t.i * T - sx, sx - (t.i + t.n) * T), Math.max(0, t.j * T - sy, sy - (t.j + t.n) * T)) / T; }; // E228
const alive = (t) => t.hp > 0 && !t.gone, up = (t) => t.done >= 1 && alive(t), due = (x) => !(x > 0), half = (x) => x / 2; // E229
const gap = (u, p) => Math.hypot(u.bx - p.bx, u.by - p.by) / T, dir = (dx, dy) => { const d = Math.hypot(dx, dy) || 1; return [dx / d, dy / d, d]; }, beast = (x) => groupOf(x) === 'beast';
const ranged = (u) => stat(u).rng > FL.melee, routing = (u) => u.job === 'rout' && u.routAt != null, clsOf = (c) => FK.SH[c].class, rider = (u) => clsOf(u.code) === 'Riders', engine = (u) => clsOf(u.code) === 'Engines';
const TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])), knows = (side, k) => !!SIDES[side] && SIDES[side].techs.has(TK[k]); // E382
// E383
const SQ = { plan: [], form: [], temper: [], intent: [], sel: null }, SHAPES = Object.keys(FM).filter((k) => k !== 'column'), DIAL = { temper: WD.tempers, form: SHAPES, intent: WD.intents };
const fresh = () => { SQ.plan = WD.squads.map(() => ({})); SQ.temper = WD.squads.map(() => AR.temper.guard); SQ.form = WD.squads.map(() => SHAPES.indexOf('line')); SQ.intent = WD.squads.map(() => AR.intent.engage); SQ.sel = null; };
const mine = (u) => u.side === ME && u.bn != null, temperOf = (u) => (mine(u) ? SQ.temper[u.bn] : AR.temper.guard), temper = (u) => D.tempers[temperOf(u)], intent = (u) => (mine(u) ? SQ.intent[u.bn] : AR.intent.engage);
const formOf = (u) => (mine(u) && knows(ME, 'formations') ? SHAPES[SQ.form[u.bn]] : 'line'), marching = (u) => u.job === 'march' && !u.target && !!u.path;
const shapeOf = (u) => FM[drillOn(u) ? u.drill.shape : marching(u) && knows(u.side, 'formations') ? 'column' : formOf(u)];
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
  const out = {}; for (const cls in gap) { const k = FK.kinds(cls).find((c) => FK.aged(c, ME)); if (gap[cls] > 0 && k) out[k] = gap[cls]; } return out; }
// E230
const wear = (u) => (SIDES[u.side] && (K.rain + K.snowing > 0 || K.temp < 0) ? 1 - D.wear * (1 - Math.min(1, FK.stat(u.code, u.side, 'wear'))) : 1);
const dmgOf = (u) => FK.stat(u.code, u.side, 'atk') * wear(u) * (rider(u) ? shapeOf(u).dmg : 1) * temper(u).dmg * ECON.hungerOf(u.side);
const vsOf = (u) => Object.assign({}, stat(u).vs, ...FK.ranks(u.code, u.side).map((c) => BOOKS.tech[c].value.rank.vs)), tagsOf = (t) => [clsOf(t.code), ...(stat(t).tags || [])];
const vs = (a, t) => { const v = vsOf(a); return Math.max(...[t.code, ...tagsOf(t)].map((k) => v[k] || 1)); }; // E282
function fromWhere(t, a) { // E387
  const free = t.fx == null || !((t.target && t.target !== a) || t.stuck > K.t || routing(t)), [dx, dy] = dir(a.bx - t.bx, a.by - t.by); let [fx, fy] = [t.fx, t.fy], cover = false;
  if (!free) FK.unitsNear(t, FL.line * T, (v) => { if (v.side !== t.side || !armed(v) || !alive(v) || v.fx == null) return; fx += v.fx; fy += v.fy; const [ex, ey, e] = dir(v.bx - t.bx, v.by - t.by); if (e < FL.cover * T && ex * dx + ey * dy > FL.cos) cover = true; });
  const [gx, gy] = dir(fx, fy); return free || cover ? MO.front : dx * gx + dy * gy; }
function damage(a, t, base = dmgOf(a)) { const A = a.kind === 'unit' ? stat(a) : {}, melee = A.rng <= FL.melee; if (t.kind === 'bld') return base * FK.stat(a.code, a.side, 'bld'); let d = base * vs(a, t); // E355
  if (FK.has(t, 'Prey') && FK.has(a, 'Gather')) d *= D.hunt.blow;
  if (armed(t)) { const F = shapeOf(t); if (beast(a)) d *= MO.wild; if (routing(t)) d *= MO.routHit; d *= FK.stat(t.code, t.side, 'armor') * F.hit * (rider(a) ? F.vsRiders : 1); if (melee && fromWhere(t, a) < FL.behind) d *= D.flank; }
  return stat(t).rarmor && !melee ? d * stat(t).rarmor : d; }
function hit(a, t, base) { const d = damage(a, t, base), u = a.kind === 'unit'; t.hp -= d; sparks.push({ x: t.bx, y: t.by, t: K.t }); sparks.splice(0, sparks.length - FLY.sparks); // E231
  if (armed(t) && !beast(a)) { const dot = u ? fromWhere(t, a) : MO.front; t.mor -= ((MO.hit * d * temper(t).nerve) / t.hpMax) * (dot < FL.behind ? MO.rear : dot < FL.cos ? MO.side : MO.front); }
  if (u) { FK.impact(a, t); if (ranged(a)) shot(a, t, W[FK.SH[a.code].body].height); if (!SIDES[t.side] && t.job !== 'fight' && stat(t).atk) fight(t, a); }
  if (!alive(t)) { if (armed(a)) a.mor = Math.min(MO.full, a.mor + MO.kill); die(t, a); } }
function die(t, by) { if (t.kind === 'bld') { if (by && SIDES[by.side] && by.side !== t.side) { for (const [y, n] of Object.entries(D.cost[t.code] || {})) ECON.earn(by.side, y, Math.floor(n * D.plunder), 'loot'); if (by.side === ME) FK.fire('event', 'plunder', t); } FK.fire('event', 'fell', t); FK.unbuild(t); return; } // E356
  if (armed(t)) { const near = []; FK.unitsNear(t, MO.lossR * T, (v) => { if (v.side === t.side && armed(v) && alive(v) && gap(t, v) < MO.lossR) near.push(v); }); for (const v of near) v.mor -= 1 / (D.breakAt * (near.length + 1)); } // E388
  t.gone = true; const us = units(), c = FK.has(t, 'Prey') && FK.lay('meat', t.bx, t.by, D.meat[t.code]); if (us.includes(t)) us.splice(us.indexOf(t), 1); if (FK.sel() === t) FK.select(null); for (const u of us) if (u.target === t) { u.target = null; if (c && FK.has(u, 'Gather')) ECON.gatherAt(u, c); } }
// E232
const power1 = (u) => ((u.hp * Math.max(D.leastBlow, dmgOf(u))) / D.odds.per) * (stat(u).bonly ? D.odds.bonly : 1);
const groupPower = (u) => { let p = power1(u); FK.unitsNear(u, AR.group * T, (v) => { if (v.side === u.side && armed(v) && alive(v)) p += power1(v); }); return p; };
const canBeat = (u, v) => groupPower(u) * vs(u, v) > power1(v) * vs(v, u); // E389
const worth = (u, v, d) => { const mine = (dmgOf(u) * vs(u, v)) / stat(u).rof, reach = (Math.max(0, d - stat(u).rng) * T) / D.upm / FK.stat(u.code, u.side, 'spd'); return mine > 0 ? ((dmgOf(v) * vs(v, u)) / stat(v).rof + AR.least) / (v.hp / mine + reach) : 0; };
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
function march(u, k) { u.job = 'march'; u.goal = k; u.target = null; u.then = 'march'; if (!FK.walkTo(u, (q) => q === k || nearK(q, k, FK.walkable(k) ? 0 : 4), k)) { u.job = 'idle'; block(u); } } // E237
const block = (u) => { const b = foeBld(u, FL.melee); if (b) fight(u, b); }; // E391
function recall(side) { waves[side] = null; const h = home(side); for (const u of orders(side)) { Object.assign(u, { job: 'rout', routAt: null, target: null, goal: null, then: 'idle' }); if (!h || !FK.goBy(u, h)) u.job = 'idle'; } }
function attack(side, k) { const army = orders(side); if (!army.length) return 0; waves[side] = { n0: army.length, k, t: 0, hp: 0 }; dress(army, k); if (side === ME) FK.fire('event', 'march', army[0]); return army.length; }
const armyOf = (side) => units().filter((u) => u.side === side && ECON.soldier(u.code)), BUSY = { rout: (u) => u.job === 'rout' }, armyFree = (side, ...skip) => armyOf(side).filter((u) => !skip.some((k) => BUSY[k](u))); // E372
// E392
function dress(S, k, form, drill) { const [s0] = S, shape = form || formOf(s0), [tx, ty] = FK.tileMid(k), h = home(s0.side) || { bx: tx, by: ty }, [fx, fy] = dir(tx - h.bx, ty - h.by), n = S.length, slow = Math.min(...S.filter((u) => !engine(u)).map((u) => FK.stat(u.code, u.side, 'spd')));
  S.sort((a, b) => (a.bn ?? n) - (b.bn ?? n) || ranged(a) - ranged(b)); const nf = sum(S, (u) => !ranged(u)), turn = 2 * Math.PI, ring = (Math.max(nf, GR.ring) * GR.gap) / turn;
  const cols = { column: Math.min(n, GR.column), square: Math.ceil(Math.sqrt(n)), front: n, choke: GR.choke }[shape] || Math.min(GR.most, Math.max(1, Math.round(Math.sqrt(n * GR.rows))));
  S.forEach((u, i) => { let c, r; if (shape === 'support') { const on = i < nf, m = Math.max(1, on ? nf : n - nf), j = on ? i : i - nf, rr = on ? ring : Math.max(0, ring - GR.gap) * Math.sqrt((j + 0.5) / m); [c, r] = [Math.cos((j / m) * turn) * rr, Math.sin((j / m) * turn) * rr]; }
    else { const ri = shape === 'wedge' ? Math.floor(half(Math.sqrt(8 * i + 1) - 1)) : Math.floor(i / cols); c = (shape === 'wedge' ? i - half(ri * (ri + 1) + ri) : (i % cols) - half(cols - 1)) * GR.gap; r = -ri * GR.gap; }
    const g = FK.tileAt(tx + (fx * r - fy * c) * T, ty + (fy * r + fx * c) * T); Object.assign(u, { fx, fy, slow: Math.min(1, slow / FK.stat(u.code, u.side, 'spd')), drill: drill && { ...drill, shape, k, from: { bx: u.bx, by: u.by } } }); march(u, FK.walkable(g) ? g : k); }); }
const drillOn = (u) => !!(u.drill && u.drill.until > K.t && u.goal === u.drill.k && (u.job === 'march' || u.job === 'hold')); // E393
function drillHold(u) { const L = u.drill; if (!drillOn(u) || L.held || K.t - L.t0 < (L.until - L.t0) * D.forming.share) return; const [x, y] = FK.tileMid(u.goal), [, , all] = dir(x - L.from.bx, y - L.from.by);
  if (1 - Math.hypot(x - u.bx, y - u.by) / all < D.forming.share) { L.held = true; Object.assign(u, { path: null, goal: FK.tileAt(u.bx, u.by), job: 'hold' }); } }
function formHome() { const at = new Map(); for (const u of units()) if (armed(u) && u.job === 'idle' && !u.target) { const b = u.hb && alive(u.hb) ? u.hb : home(u.side); if (!b) continue; const H = at.get(b) || at.set(b, new Map()).get(b), k = u.bn ?? WD.squads.length; (H.get(k) || H.set(k, []).get(k)).push(u); } // E394
  for (const [b, blocks] of at) { const [fx, fy] = dir(FK.MID - b.bx, FK.MID - b.by), out = (half(b.n) + GR.yard) * T, list = [...blocks.keys()].sort((p, q) => p - q).map((k) => blocks.get(k).sort((p, q) => ranged(p) - ranged(q)));
    const cols = list.map((a) => Math.min(GR.cols, Math.ceil(Math.sqrt(a.length * GR.block)))); let x0 = half(-(sum(cols, (c) => c + 1) - 1) * GR.gap);
    list.forEach((a, bi) => { a.forEach((u, i) => { const c = (x0 + ((i % cols[bi]) + 0.5) * GR.gap) * T, r = out + Math.floor(i / cols[bi]) * GR.gap * T; u.home = { bx: b.bx + fx * r - fy * c, by: b.by + fy * r + fx * c }; if (!u.path) [u.fx, u.fy] = [fx, fy]; }); x0 += (cols[bi] + 1) * GR.gap; }); } }
// E239
function nerve(u, dt) { let m = u.mor;
  if (!u.target) { const near = FK.bldsNear(u.bx, u.by, MO.shelterR * T, (b) => b.side === u.side && up(b) && (FK.has(b, 'Shoot') || FK.has(b, 'Line') || FK.has(b, 'Gate')) && gap(u, b) < MO.shelterR); m = FK.relax(m, MO.full, MO.tau / FK.stat(u.code, u.side, 'rest') / (near ? MO.shelter * FK.stat(u.code, u.side, 'shelter') : MO.front), dt); }
  else { const us = [u], them = []; FK.unitsNear(u, MO.crowd * T, (v) => { if (armed(v) && alive(v)) (v.side === u.side ? us : atWar(u.side, v.side) ? them : []).push(v); }); if (them.length > us.length * MO.outnumbered) m -= MO.odds * dt; }
  u.mor = Math.min(MO.full, Math.max(0, m)); if (u.mor > 0 || stat(u).bonly) return;
  Object.assign(u, { job: 'rout', routAt: K.t, target: null, focus: null, path: null }); if (u.side === ME && !(K.t - routSaid < MO.say)) { routSaid = K.t; FK.fire('event', 'rout', u, u.bn != null ? WD.squads[u.bn] : WD.all); } }
let routSaid = -Infinity, homeT = 0; const sparks = [], tracers = [];
function flee(u) { if (K.t > u.routAt + FK.stat(u.code, u.side, 'rout')) { Object.assign(u, { job: 'idle', routAt: null, mor: MO.after, path: null }); return; } // E395
  if (u.path || !due(u.rp)) return; u.rp = D.repath; const f = nearest(u, MO.flee), h = home(u.side) || u, [dx, dy] = f ? dir(u.bx - f.bx, u.by - f.by) : dir(h.bx - u.bx, h.by - u.by);
  if (FK.go(u, FK.tileAt(u.bx + dx * MO.run * T, u.by + dy * MO.run * T))) u.then = 'rout'; }
function brain(u, dt, look) { // E396
  if (u.job === 'rout') { if (routing(u)) flee(u); else if (!u.path) u.job = 'idle'; return true; }
  nerve(u, dt); if (routing(u)) return true; drillHold(u);
  if (u.hp < u.hpMax && !u.target && FK.bldsNear(u.bx, u.by, D.shelter.r * T, (b) => b.side === u.side && FK.has(b, 'Shelter') && up(b) && gap(u, b) < D.shelter.r)) u.hp = FK.relax(u.hp, u.hpMax, u.hpMax / FK.stat(u.code, u.side, 'garrison'), dt);
  const s = stat(u), sight = s.sight || D.aggro, atHome = u.job === 'idle' || (u.job === 'fight' && u.was == null), d = (v) => edgeDist(u, v); let t = u.target;
  if (u.focus && !(alive(u.focus) && enemies(u, u.focus))) u.focus = null;
  if (t && !(alive(t) && enemies(u, t) && (t === u.focus || d(t) < sight * AR.leash * temper(u).chase || (atHome && nearHome(u, t))))) t = null;
  if (look && !u.focus) { const it = intent(u), far = it === AR.intent.loose && u.job === 'march' ? s.rng + AR.step : sight, cur = t && t.kind === 'unit' ? t : null;
    let c = s.bonly || (it === AR.intent.bld && foeBld(u, far)) ? foeBld(u, far) : bestFoe(u, far);
    if (cur && (!c || d(cur) <= s.rng || (canBeat(u, cur) >= canBeat(u, c) && worth(u, c, d(c)) < (1 + D.moveOn) * worth(u, cur, d(cur))))) c = cur;
    if (atHome && c && !nearHome(u, c) && c.target !== u) c = null;
    if (!c && atHome && !s.bonly) c = (u.home && nearest(u, D.yard, u.home)) || (home(u.side) && nearest(u, D.yard, home(u.side))) || null;
    if (!c && (u.job === 'march' || u.job === 'hold' || u.was != null)) c = foeBld(u, sight);
    t = c || (t && t.kind === 'bld' ? t : null); }
  if (t && !u.focus && ((temperOf(u) === AR.temper.hold && u.side === ME && u.job !== 'march' && u.was == null) || drillOn(u)) && d(t) > s.rng) t = null;
  u.pacex = shapeOf(u).spd * (marching(u) && u.slow ? u.slow : 1);
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
const reachOf = (t) => { const w = D.tower[t.code]; if (!reachs.has(t.code)) reachs.set(t.code, fly(speedFor(w.bow * mpt, 0), w.h * mpt).land / mpt); return reachs.get(t.code) + FK.stat(t.code, t.side, 'rng'); };
function shot(a, t, h) { tracers.push({ a, u: dir(t.bx - a.bx, t.by - a.by), P: fly(speedFor(gap(a, t) * mpt, h), h), t0: K.t }); }
FK.on('spawn', (u) => { u.hp = u.hpMax = hpMax(u); u.cd = FK.rng(); u.mor = MO.full; if (u.side === ME && armed(u)) rebattalion(); });
FK.on('start', () => { waves.fill(null); rel.clear(); reachs.clear(); fresh(); sparks.length = tracers.length = 0; for (const u of units()) if (u.hp == null) Object.assign(u, { hp: hpMax(u), hpMax: hpMax(u), mor: MO.full }); for (const t of things()) if (t.kind === 'bld') fill(t); });
const fill = (t) => { t.hpMax = hpMax(t); t.hp = t.done >= 1 ? t.hpMax : 1; };
FK.on('tick', (dt) => {
  if (ECON.result()) return; homeT -= dt; if (due(homeT)) { homeT = D.scan; formHome(); }
  for (const t of things()) if (t.kind === 'bld') { if (t.hpMax == null) fill(t);
    const tw = D.tower[t.code]; if (!tw || !up(t)) continue; t.cd -= dt; if (!due(t.cd)) continue; const reach = reachOf(t); let best = null; FK.unitsNear(t, (reach + t.n) * T, (u) => { if (SIDES[u.side] && isFoe(t.side, u, t) && edgeDist(u, t) <= reach && (!best || edgeDist(u, t) < edgeDist(best, t))) best = u; });
    if (best) { FK.fire('event', 'shot', t); shot(t, best, tw.h * mpt); hit(t, best, FK.stat(t.code, t.side, 'atk')); t.cd = FK.stat(t.code, t.side, 'rof'); } }
  for (const u of units().slice()) { if (!alive(u)) continue; const s = stat(u); u.cd -= dt; u.rp -= dt; u.sc -= dt; const look = due(u.sc); if (look) u.sc = D.scan;
    if (!SIDES[u.side]) { if (FK.has(u, 'Fight') && (u.job === 'idle' || u.job === 'fight') && !u.path) { if (u.job === 'idle' && look) { const t = choose(u, D.wildAggro); if (t && t.kind !== 'bld') fight(u, t); } } }
    else if (!armed(u)) { if (u.job !== 'fight') { const w = units().find((b) => !SIDES[b.side] && b.job === 'fight' && b.target === u); if (w) fight(u, w); else continue; } }
    else if (brain(u, dt, look)) continue;
    if (u.job !== 'fight') continue; const t = u.target; if (!t || !alive(t)) { u.target = null; u.path = null; if (u.was != null && armed(u)) march(u, u.was); else u.job = 'idle'; continue; }
    if (edgeDist(u, t) <= s.rng + 0.5) { if (u.kT > K.t - D.kite.hold && u.path) continue; u.path = null; [u.fx, u.fy] = dir(t.bx - u.bx, t.by - u.by); u.face = Math.sign(u.fx) || u.face; // E398
      const f = look && !due(u.cd) && kiteOf(u) && nearest(u, D.kite.near, u, (v) => !ranged(v)); if (f) { const [dx, dy] = dir(u.bx - f.bx, u.by - f.by), x = u.bx + dx * D.kite.back * T, y = u.by + dy * D.kite.back * T; if (FK.walkable(FK.tileAt(x, y))) { Object.assign(u, { path: [[x, y]], at: 0, then: 'fight', kT: K.t }); continue; } }
      if (due(u.cd)) { hit(u, t); u.cd = s.rof; } } else if (!u.path && due(u.rp)) { u.rp = D.repath; if (!toward(u, t)) { u.target = null; u.job = 'idle'; u.rp = 3 * D.repath; block(u); } } }
  waves.forEach((w, side) => { if (!w) return; w.t += dt; if (armyFree(side, 'rout').length < D.breakAt * w.n0) recall(side); });
});
// E240
FK.on('draw', (ctx, s) => { if (!FK.show.U) return; const [cw, ch] = FK.size(), MK = ST.marks, [a0, a1] = MK.arc, B = MK.bar, X = MK.cross, at = (x, y, up = 0) => FK.toScreen(...FK.toView(x, y, Math.max(0, FK.H[FK.tileAt(x, y)]) + up));
  const seen = (x, y, m) => x > -m && x < cw + m && y > -m && y < ch + m, bar = (x, y, w, f, col) => { ctx.save(); ctx.fillStyle = C.shade; ctx.globalAlpha = B.alpha; ctx.fillRect(x - half(w), y, w, B.h); ctx.restore(); ctx.fillStyle = col; ctx.fillRect(x - half(w), y, w * f, B.h); };
  const oval = (x, y, r, k, from = a0, to = a1) => { ctx.beginPath(); ctx.ellipse(x, y, r, r * k, a0, from, to); };
  for (const u of units()) if (u.hp != null && u.hp < u.hpMax && (u.side === ME || FK.inSight(u.k))) { const [x, y] = FK.toScreen(u.vx, u.vy), [w, up, m] = B.unit; if (seen(x, y, m)) bar(x, y - up * s, w * s, u.hp / u.hpMax, SIDES[u.side] ? SIDES[u.side].col : C.white); }
  for (const t of things()) if (t.kind === 'bld' && t.hp != null && t.hp < t.hpMax && up(t) && (t.side === ME || FK.inSight(t.k ?? FK.tileAt(t.bx, t.by)))) { const [x, y] = FK.toScreen(t.vx, t.vy), [w, up, plus, m] = B.bld; if (seen(x, y, m)) bar(x, y - (t.n * up + plus) * s, t.n * w * s, t.hp / t.hpMax, SIDES[t.side].col); }
  const w = waves[ME]; if (w) { const [x, y] = at(...FK.tileMid(w.k)), [r, rk] = X.r, [p, q] = X.arm.map((v) => v * s); ctx.strokeStyle = C.red; ctx.lineWidth = X.line; oval(x, y, r * s, rk / r); ctx.moveTo(x - p, y); ctx.lineTo(x + p, y); ctx.moveTo(x, y - q); ctx.lineTo(x, y + q); ctx.stroke(); }
  ctx.strokeStyle = C.shaft; ctx.lineWidth = s; for (const r of tracers.slice()) { const P = r.P, n = P.length - 1, p = (K.t - r.t0) / (n * FLY.dt); if (p >= 1) { tracers.splice(tracers.indexOf(r), 1); continue; } // E399
    const [ux, uy] = r.u, pt = (f) => { const [x, y] = P[Math.round(Math.max(0, f) * n)], m = (x / mpt) * T; return at(r.a.bx + ux * m, r.a.by + uy * m, y * D.upm); };
    ctx.beginPath(); ctx.moveTo(...pt(p - FLY.tail)); ctx.lineTo(...pt(p)); ctx.stroke(); }
  const K0 = ST.spark; ctx.save(); ctx.strokeStyle = C.flame; ctx.lineWidth = K0.line * s; for (const k of sparks) { const a = (K.t - k.t) / FLY.spark; if (a < 0 || a >= 1) continue; const [x, y] = at(k.x, k.y, K0.lift), g = (K0.to + a * K0.grow) * s; ctx.globalAlpha = 1 - a; ctx.beginPath(); // E400
    for (let i = K0.rays; i--; ) { const an = i * K0.turn + k.t * K0.spin, c = Math.cos(an), e = Math.sin(an); ctx.moveTo(x + c * K0.from * s, y + e * K0.from * s); ctx.lineTo(x + c * g, y + e * g); } ctx.stroke(); } ctx.restore();
  const S0 = ST.standard, grp = new Map(); if (FK.cam.z < S0.zoom) return; for (const u of units()) if (armed(u) && alive(u) && !engine(u) && (u.job === 'march' || u.job === 'hold' || u.was != null) && (u.side === ME || FK.inSight(u.k))) { const key = u.side + ' ' + (u.was ?? u.goal), g = grp.get(key) || grp.set(key, { o: u.side, us: [] }).get(key); g.us.push(u); } // E401
  for (const { o, us } of grp.values()) { if (us.length < S0.least) continue; const [x, y] = at(sum(us, (u) => u.bx) / us.length, sum(us, (u) => u.by) / us.length), h = S0.pole * s, [r0, r1] = S0.ring, r = r0 * s + r1, col = SIDES[o].col, [fw, f1, f2, f3] = S0.flag.map((v) => v * s), [sp, sw, tail] = S0.wave, a = Math.sin(K.t * sp + o) * sw * s, top = S0.top;
    ctx.lineWidth = S0.line * s; ctx.save(); ctx.strokeStyle = C.shade; ctx.globalAlpha = S0.alpha; oval(x, y, r, S0.tilt); ctx.stroke(); ctx.restore(); ctx.strokeStyle = col; oval(x, y, r, S0.tilt, top, top + (sum(us, (u) => u.hp) / sum(us, (u) => u.hpMax)) * a1); ctx.stroke();
    ctx.strokeStyle = C.pole; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.stroke(); ctx.fillStyle = col; ctx.strokeStyle = C.shade; ctx.lineWidth = s; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.quadraticCurveTo(x + half(fw), y - h + a, x + fw, y - h + f1 + a * tail); ctx.lineTo(x + fw, y - h + f2 + a * tail); ctx.quadraticCurveTo(x + half(fw), y - h + f2 + a, x, y - h + f3); ctx.closePath(); ctx.fill(); ctx.stroke(); }
});
FK.on('shut', (side, u) => !u || isFoe(side, u)); // E329
const power = (us) => sum(us, power1); // E238
function odds(S, side) { const F = armyOf(side), first = (_, i) => i < D.odds.look, a = S.filter(first), b = F.filter(first), x = sum(a, (u) => sum(b, (v) => vs(u, v))), y = sum(a, (u) => sum(b, (v) => vs(v, u))); let p = power(S); // E283
  if (x) p *= Math.min(D.odds.hi, Math.max(D.odds.lo, x / y)); const q = power(F) + things().filter((t) => t.side === side && D.tower[t.code] && !FK.has(t, 'Seat') && alive(t)).length * D.ai.towerWorth + D.ai.peopleWorth; return (p * p) / (p * p + q * q); } // E284
return { attack, recall, fight, march, hit, damage, die, armyOf, armyFree, power, power1, odds, waves, armed, enemies, isFoe, groupOf, stance, treaty, atWar, friendly, hpMax, stat, vs, fromWhere, reachOf, fly, speedFor, dress, drillOn, rebattalion, plan, squad, lack, cycle, dialOf, temperOf, shapeOf, formOf, kiteOf, SQ, DIAL, SHAPES, bestFoe, canBeat, worth, formHome, wear, dmgOf, knows };
})();
