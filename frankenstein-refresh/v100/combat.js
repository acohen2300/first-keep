'use strict';
// E227
window.WAR = (() => {
const { D, B, U, SIDES, N } = FK;
// E170
const things = FK.things, units = FK.units, T = D.tile;
const stat = (u) => D.stats[u.code] || D.stats.UV;
const hpMax = (t) => FK.stat(t.code, t.side, 'hp') ?? 400;
const armed = (u) => u.side >= 0 && FK.has(u, 'Fight') && !FK.has(u, 'Gather');
const enemies = (a, b) => a.side !== b.side && (a.side >= 0 ? b.side >= 0 || FK.has(b, 'Fight') : b.side >= 0);
const edgeDist = (u, t) => { if (t.kind !== 'bld') return Math.hypot(u.bx - t.bx, u.by - t.by) / T; const [sx, sy] = FK.fromBoard(u.bx, u.by); return Math.hypot(Math.max(0, t.i * T - sx, sx - (t.i + t.n) * T), Math.max(0, t.j * T - sy, sy - (t.j + t.n) * T)) / T; }; // E228
const alive = (t) => t.hp > 0 && !t.gone; // E229
// E230
function damage(a, t) { const s = stat(a); let d = t.kind === 'bld' ? s.bld || s.atk : s.atk; if (t.kind !== 'bld') { const ts = stat(t); d *= vs(a, t); if ((a.bx - t.bx) * (t.face || 1) < 0) d *= D.flank; d -= ts.arm; } return Math.max(D.leastBlow, d); }
function hit(a, t) { t.hp -= damage(a, t); FK.impact(a, t); if (t.hp <= 0) die(t, a); } // E231
function die(t, by) { if (t.kind === 'bld') { FK.fire('event', 'fell', t); FK.unbuild(t); return; } t.gone = true; const us = units(), i = us.indexOf(t); if (i >= 0) us.splice(i, 1); if (FK.sel() === t) FK.select(null); for (const u of us) if (u.target === t) u.target = null; }
// E232
function choose(u, r) { const s = stat(u); let best = null; const look = (t) => { if (!enemies(u, t) || !alive(t)) return; const d = edgeDist(u, t); if (d > r) return; if (t.side < 0 && t.target !== u) return; const v = damage(u, t) / s.rof / Math.max(1, t.hp) / (1 + d / D.aggro); if (!best || v > best[1]) best = [t, v]; };
  FK.unitsNear(u, r * T, look); FK.bldsNear(u.bx, u.by, (r + D.large) * T, (t) => { if (t.side >= 0) look(t); }); return best && best[0]; } // E233
const toward = (u, t) => { const r = Math.max(1, stat(u).rng); return FK.walkTo(u, t.kind === 'bld' ? (q) => { const i = q % N, j = (q - i) / N; return i >= t.i - r && i <= t.i + t.n + r - 1 && j >= t.j - r && j <= t.j + t.n + r - 1; } : (q) => q !== t.k && nearK(q, t.k, r), t.kind === 'bld' ? FK.tileAt(t.bx, t.by) : t.k, D.chase); }; // E234
const home = (side) => FK.seatOf(side) || things().find((t) => t.kind === 'bld' && t.side === side); // E235
const waves = SIDES.map(() => null); // E236
function fight(u, t) { u.job = 'fight'; u.target = t; u.then = null; }
const nearK = (q, k, r) => Math.abs(q % N - k % N) <= r && Math.abs(Math.floor(q / N) - Math.floor(k / N)) <= r;
function march(u, k) { u.job = 'march'; u.goal = k; u.target = null; u.then = 'march'; if (!FK.walkTo(u, (q) => q === k || nearK(q, k, FK.walkable(k) ? 0 : 4), k)) u.job = 'idle'; } // E237
function recall(side) { waves[side] = null; const h = home(side); for (const u of units()) if (u.side === side && armed(u)) { u.job = 'rout'; u.target = null; u.goal = null; u.then = 'idle'; if (!h || !FK.goBy(u, h)) u.job = 'idle'; } }
function attack(side, k) { const army = units().filter((u) => u.side === side && armed(u) && u.job !== 'rout'); if (!army.length) return 0; waves[side] = { n0: army.length, k, t: 0, hp: 0 }; for (const u of army) march(u, k); if (side === 0) FK.fire('event', 'march', army[0]); return army.length; }
const armyOf = (side) => units().filter((u) => u.side === side && armed(u));
const vs = (a, t) => D.counter ** (stat(a).vs === stat(t).cls); // E282
const power = (us) => us.reduce((n, u) => n + u.hp * Math.max(D.leastBlow, FK.stat(u.code, u.side, 'atk')) / D.odds.per, 0); // E238
function odds(S, side) { const F = armyOf(side), a = S.slice(0, D.odds.look), b = F.slice(0, D.odds.look); let x = 0, y = 0, p = power(S); for (const u of a) for (const v of b) { x += vs(u, v); y += vs(v, u); } // E283
  if (x) p *= Math.min(D.odds.hi, Math.max(D.odds.lo, x / y)); const q = power(F) + things().filter((t) => t.side === side && D.tower[t.code] && !FK.has(t, 'Seat') && alive(t)).length * D.ai.towerWorth + D.ai.peopleWorth; return p * p / (p * p + q * q); } // E284
FK.on('spawn', (u) => { u.hp = u.hpMax = hpMax(u); u.cd = FK.rng(); u.rp = 0; });
FK.on('start', () => { waves.fill(null); for (const u of units()) if (u.hp == null) { u.hp = u.hpMax = hpMax(u); u.cd = 0; u.rp = 0; } for (const t of things()) if (t.kind === 'bld') { t.hpMax = hpMax(t); t.hp = t.done >= 1 ? t.hpMax : 1; } });
FK.on('tick', (dt) => {
  if (ECON.result()) return;
  for (const t of things()) if (t.kind === 'bld') { if (t.hpMax == null) { t.hpMax = hpMax(t); t.hp = t.done >= 1 ? t.hpMax : 1; }
    const tw = D.tower[t.code], [blow, reach, pace] = tw || []; if (!tw || t.done < 1) continue; t.cd = (t.cd || 0) - dt; if (t.cd > 0) continue; let best = null; FK.unitsNear(t, (reach + t.n) * T, (u) => { if (u.side < 0 || u.side === t.side) return; const d = edgeDist(u, t); if (d <= reach && (!best || d < best[1])) best = [u, d]; }); if (best) { FK.fire('event', 'shot', t); best[0].hp -= Math.max(D.leastBlow, blow - stat(best[0]).arm); if (best[0].hp <= 0) die(best[0]); t.cd = pace; } }
  for (const u of units().slice()) { if (!alive(u)) continue; const s = stat(u); u.cd -= dt; u.rp -= dt; u.sc = (u.sc || 0) - dt; const look = u.sc <= 0; if (look) u.sc = D.scan;
    if (u.side < 0) { if (s.atk && (u.job === 'idle' || u.job === 'fight') && !u.path) { if (u.job === 'idle' && look) { const t = choose(u, D.wildAggro); if (t && t.kind !== 'bld') fight(u, t); } } }
    else if (!armed(u)) { if (u.job !== 'fight') { const w = units().find((b) => b.side < 0 && b.job === 'fight' && b.target === u); if (w) fight(u, w); else continue; } } // E239
    else if (u.job === 'idle' || u.job === 'march' || (u.job === 'walk' && u.then === 'march')) { const t = look ? choose(u, D.aggro) : null; if (t) { u.was = u.job === 'idle' ? null : u.goal; fight(u, t); } else if (u.job === 'march' && !u.path) { if (u.goal == null || nearK(u.k, u.goal, FK.walkable(u.goal) ? 1 : 4)) u.job = 'idle'; else if (u.rp <= 0) { u.rp = D.repath; if (!FK.go(u, u.goal)) u.job = 'idle'; } } }
    else if (u.job === 'rout' && !u.path) u.job = 'idle';
    if (u.job !== 'fight') continue; const t = u.target; if (!t || !alive(t)) { u.target = null; u.path = null; if (u.was != null && armed(u)) march(u, u.was); else u.job = 'idle'; continue; }
    if (edgeDist(u, t) <= s.rng + 0.5) { u.path = null; u.face = t.bx < u.bx ? -1 : 1; if (u.cd <= 0) { hit(u, t); u.cd = s.rof; } } else if (!u.path && u.rp <= 0) { u.rp = D.repath; if (!toward(u, t)) { u.target = null; u.job = 'idle'; u.rp = 3 * D.repath; } } }
  for (let side = 0; side < SIDES.length; side++) { const w = waves[side]; if (!w) continue; w.t += dt; const army = armyOf(side).filter((u) => u.job !== 'rout'); if (army.length < D.breakAt * w.n0) recall(side); }
});
// E240
FK.on('draw', (ctx, s) => { if (!FK.show.U) return; const [cw, ch] = FK.size();
  const bar = (x, y, w, f, col) => { ctx.fillStyle = '#000'; ctx.globalAlpha = 0.5; ctx.fillRect(x - w / 2, y, w, 3); ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.fillRect(x - w / 2, y, w * f, 3); };
  for (const u of units()) if (u.hp != null && u.hp < u.hpMax && (u.side === 0 || FK.inSight(u.k))) { const [x, y] = FK.toScreen(u.vx, u.vy); if (x > -20 && x < cw + 20 && y > -20 && y < ch + 20) bar(x, y - 34 * s, 16 * s, u.hp / u.hpMax, u.side >= 0 ? SIDES[u.side].col : '#ece5d3'); }
  for (const t of things()) if (t.kind === 'bld' && t.hp != null && t.hp < t.hpMax && t.done >= 1 && (t.side === 0 || FK.inSight(t.k ?? FK.tileAt(t.bx, t.by)))) { const [x, y] = FK.toScreen(t.vx, t.vy); if (x > -40 && x < cw + 40 && y > -40 && y < ch + 40) bar(x, y - (t.n * 12 + 20) * s, t.n * 10 * s, t.hp / t.hpMax, SIDES[t.side].col); }
  const w = waves[0]; if (w) { const [bx, by] = FK.tileMid(w.k), [vx, vy] = FK.toView(bx, by, Math.max(0, FK.H[w.k])), [x, y] = FK.toScreen(vx, vy); ctx.strokeStyle = '#ff6b5b'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, 14 * s, 7 * s, 0, 0, 7); ctx.moveTo(x - 20 * s, y); ctx.lineTo(x + 20 * s, y); ctx.moveTo(x, y - 10 * s); ctx.lineTo(x, y + 10 * s); ctx.stroke(); }
});
return { attack, recall, fight, march, hit, damage, die, armyOf, power, odds, waves, armed, enemies, hpMax, stat };
})();
