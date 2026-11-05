'use strict';
// First Keep v100 · combat.js (floor 10): health, one blow (QBO), target choice (QAG), nerve (QBQ), towers (QAL). Lives alone; touches the world only through FK. A soldier's jobs: idle, walk, fight, march (to a point, fighting what it meets), rout (home, fighting nothing).
window.WAR = (() => {
const { D, B, U, SIDES, N } = FK;
Object.assign(D, {
  stats: { UV: { hp: 25, atk: 3, rng: 1, rof: 1.5, arm: 0, cls: 'foot' }, UM1: { hp: 45, atk: 8, rng: 1, rof: 1, arm: 1, cls: 'foot', vs: 'horse' }, UM2: { hp: 30, atk: 5, rng: 5, rof: 2, arm: 0, cls: 'ranged', vs: 'foot' }, UM3: { hp: 100, atk: 10, rng: 1, rof: 1.8, arm: 2, cls: 'horse', vs: 'ranged' },
    UM4: { hp: 175, atk: 4, bld: 60, rng: 1, rof: 5, arm: 3, cls: 'siege' }, US4: { hp: 45, atk: 3, rng: 1, rof: 2, arm: 0, cls: 'horse' }, MW3: { hp: 20, atk: 0, rng: 1, rof: 1, arm: 0, cls: 'wild' }, MW4: { hp: 40, atk: 6, rng: 1, rof: 1.5, arm: 0, cls: 'wild' }, MW6: { hp: 150, atk: 12, rng: 1, rof: 2, arm: 1, cls: 'wild' } }, // D138 a unit's health, blow, reach in tiles, seconds a blow, armour, class and what it counters (N69 stand-ins)
  bldHp: { BTC1: 2400, BR1: 550, BI1: 600, BI2: 600, BI3: 600, BCL1: 480, BM1: 1200, BM2: 1200, BM3: 1200, BM4: 1500, BW1: 1800, BW2: 2750, BW3: 1020, BW4: 250 }, // D139 a building's health (N69)
  counter: 1.5, flank: 1.3, breakAt: 0.3, // D140 a counter's edge (QBO), D141 a blow from behind (QBO), D142 a wave breaks under this share of its start (QBQ)
  tower: { BW3: [5, 8, 2], BTC1: [5, 6, 2], BTC8: [4, 6, 2] }, // D143 what shoots: blow, reach in tiles, seconds a shot (QAL)
  aggro: 8, repath: 1, wildAggro: 3, chase: 2500, scan: 0.5, // D144 a soldier takes up a fight within this many tiles, D145 seconds between its path checks, D146 wildlife bites within, D147 tiles a chase may search, D148 seconds between a soldier's looks around
});
const things = FK.things, units = FK.units, T = D.tile;
const stat = (u) => D.stats[u.code] || D.stats.UV;
const hpMax = (t) => (t.kind === 'bld' ? D.bldHp[t.code] || 400 : stat(t).hp);
const armed = (u) => u.side >= 0 && u.code !== 'UV' && u.code[0] === 'U';
const enemies = (a, b) => a.side !== b.side && (a.side >= 0 ? b.side >= 0 || b.code === 'MW4' || b.code === 'MW6' : b.side >= 0);
const edgeDist = (u, t) => { if (t.kind !== 'bld') return Math.hypot(u.bx - t.bx, u.by - t.by) / T; const [sx, sy] = FK.fromBoard(u.bx, u.by); return Math.hypot(Math.max(0, t.i * T - sx, sx - (t.i + t.n) * T), Math.max(0, t.j * T - sy, sy - (t.j + t.n) * T)) / T; }; // tiles from a unit to a thing: to a building's footprint, in the grid's frame
const alive = (t) => t.hp > 0 && (t.kind === 'bld' ? things().indexOf(t) >= 0 : units().indexOf(t) >= 0);
// QBO the blow: base × counter × flank − armour, one at least; engines strike buildings with their own blow
function damage(a, t) { const s = stat(a); let d = t.kind === 'bld' ? s.bld || s.atk : s.atk; if (t.kind !== 'bld') { const ts = stat(t); if (s.vs && ts.cls === s.vs) d *= D.counter; if ((a.bx - t.bx) * (t.face || 1) < 0) d *= D.flank; d -= ts.arm; } return Math.max(1, d); }
function hit(a, t) { t.hp -= damage(a, t); if (t.hp <= 0) die(t, a); }
function die(t, by) { if (t.kind === 'bld') { FK.unbuild(t); return; } const us = units(), i = us.indexOf(t); if (i >= 0) us.splice(i, 1); if (FK.sel() === t) FK.select(null); for (const u of us) if (u.target === t) u.target = null; }
// QAG the target: the most harm a second for its health left, discounted by distance; wildlife only when it is biting
function choose(u, r) { const s = stat(u); let best = null; const look = (t) => { if (!enemies(u, t) || !alive(t)) return; const d = edgeDist(u, t); if (d > r) return; if (t.side < 0 && t.target !== u) return; const v = damage(u, t) / s.rof / Math.max(1, t.hp) / (1 + d / D.aggro); if (!best || v > best[1]) best = [t, v]; };
  for (const t of units()) if (t !== u) look(t); for (const t of things()) if (t.kind === 'bld' && t.side >= 0) look(t); return best && best[0]; }
const toward = (u, t) => { const r = Math.max(1, stat(u).rng); return FK.walkTo(u, t.kind === 'bld' ? (q) => { const i = q % N, j = (q - i) / N; return i >= t.i - r && i <= t.i + t.n + r - 1 && j >= t.j - r && j <= t.j + t.n + r - 1; } : (q) => q !== t.k && nearK(q, t.k, r), t.kind === 'bld' ? FK.tileAt(t.bx, t.by) : t.k, D.chase); }; // to within reach of a thing, with a short search (D147)
const home = (side) => things().find((t) => t.kind === 'bld' && t.side === side && t.code === 'BTC1') || things().find((t) => t.kind === 'bld' && t.side === side);
const waves = SIDES.map(() => null); // a side's wave in the field: its soldiers at the start, so nerve can be read (QBQ)
function fight(u, t) { u.job = 'fight'; u.target = t; u.then = null; }
const nearK = (q, k, r) => Math.abs(q % N - k % N) <= r && Math.abs(Math.floor(q / N) - Math.floor(k / N)) <= r;
function march(u, k) { u.job = 'march'; u.goal = k; u.target = null; u.then = 'march'; if (!FK.walkTo(u, (q) => q === k || nearK(q, k, FK.walkable(k) ? 0 : 4), k)) u.job = 'idle'; } // to a tile, or near one that cannot be stood on (a building's)
function recall(side) { waves[side] = null; const h = home(side); for (const u of units()) if (u.side === side && armed(u)) { u.job = 'rout'; u.target = null; u.goal = null; u.then = 'idle'; if (!h || !FK.goBy(u, h)) u.job = 'idle'; } }
function attack(side, k) { const army = units().filter((u) => u.side === side && armed(u) && u.job !== 'rout'); if (!army.length) return 0; waves[side] = { n0: army.length, k, t: 0, hp: 0 }; for (const u of army) march(u, k); return army.length; }
const armyOf = (side) => units().filter((u) => u.side === side && armed(u));
const strength = (us) => us.reduce((n, u) => n + stat(u).atk / stat(u).rof * u.hp, 0); // QAF Lanchester: blows a second × health
FK.on('spawn', (u) => { u.hp = u.hpMax = hpMax(u); u.cd = Math.random(); u.rp = 0; });
FK.on('start', () => { waves.fill(null); for (const u of units()) if (u.hp == null) { u.hp = u.hpMax = hpMax(u); u.cd = 0; u.rp = 0; } for (const t of things()) if (t.kind === 'bld') { t.hpMax = hpMax(t); t.hp = t.done >= 1 ? t.hpMax : 1; } });
FK.on('tick', (dt) => {
  if (ECON.result()) return;
  for (const t of things()) if (t.kind === 'bld') { if (t.hpMax == null) { t.hpMax = hpMax(t); t.hp = t.done >= 1 ? t.hpMax : 1; }
    const tw = D.tower[t.code]; if (!tw || t.done < 1) continue; t.cd = (t.cd || 0) - dt; if (t.cd > 0) continue; let best = null; for (const u of units()) if (u.side >= 0 && u.side !== t.side) { const d = edgeDist(u, t); if (d <= tw[1] && (!best || d < best[1])) best = [u, d]; } if (best) { best[0].hp -= Math.max(1, tw[0] - stat(best[0]).arm); if (best[0].hp <= 0) die(best[0]); t.cd = tw[2]; } }
  for (const u of units().slice()) { if (!alive(u)) continue; const s = stat(u); u.cd -= dt; u.rp -= dt; u.sc = (u.sc || 0) - dt; const look = u.sc <= 0; if (look) u.sc = D.scan;
    if (u.side < 0) { if (s.atk && (u.job === 'idle' || u.job === 'fight') && !u.path) { if (u.job === 'idle' && look) { const t = choose(u, D.wildAggro); if (t && t.kind !== 'bld') fight(u, t); } } }
    else if (!armed(u)) { if (u.job !== 'fight') { const w = units().find((b) => b.side < 0 && b.job === 'fight' && b.target === u); if (w) fight(u, w); else continue; } } // a villager fights back only when bitten
    else if (u.job === 'idle' || u.job === 'march' || (u.job === 'walk' && u.then === 'march')) { const t = look ? choose(u, D.aggro) : null; if (t) { u.was = u.job === 'idle' ? null : u.goal; fight(u, t); } else if (u.job === 'march' && !u.path) { if (u.goal == null || nearK(u.k, u.goal, FK.walkable(u.goal) ? 1 : 4)) u.job = 'idle'; else if (u.rp <= 0) { u.rp = D.repath; if (!FK.go(u, u.goal)) u.job = 'idle'; } } }
    else if (u.job === 'rout' && !u.path) u.job = 'idle';
    if (u.job !== 'fight') continue; const t = u.target; if (!t || !alive(t)) { u.target = null; u.path = null; if (u.was != null && armed(u)) march(u, u.was); else u.job = 'idle'; continue; }
    if (edgeDist(u, t) <= s.rng + 0.5) { u.path = null; u.face = t.bx < u.bx ? -1 : 1; if (u.cd <= 0) { hit(u, t); u.cd = s.rof; } } else if (!u.path && u.rp <= 0) { u.rp = D.repath; if (!toward(u, t)) { u.target = null; u.job = 'idle'; u.rp = 3 * D.repath; } } }
  for (let side = 0; side < SIDES.length; side++) { const w = waves[side]; if (!w) continue; w.t += dt; const army = armyOf(side).filter((u) => u.job !== 'rout'); if (army.length < D.breakAt * w.n0) recall(side); else if (!army.length) waves[side] = null; }
});
// the bars: a unit's or building's health, when it is hurt and in sight; the crosshair of the player's wave
FK.on('draw', (ctx, s) => { if (!FK.show.U) return; const [cw, ch] = FK.size();
  const bar = (x, y, w, f, col) => { ctx.fillStyle = '#000'; ctx.globalAlpha = 0.5; ctx.fillRect(x - w / 2, y, w, 3); ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.fillRect(x - w / 2, y, w * f, 3); };
  for (const u of units()) if (u.hp != null && u.hp < u.hpMax && (u.side === 0 || FK.inSight(u.k))) { const [x, y] = FK.toScreen(u.vx, u.vy); if (x > -20 && x < cw + 20 && y > -20 && y < ch + 20) bar(x, y - 34 * s, 16 * s, u.hp / u.hpMax, u.side >= 0 ? SIDES[u.side].col : '#ece5d3'); }
  for (const t of things()) if (t.kind === 'bld' && t.hp != null && t.hp < t.hpMax && t.done >= 1 && (t.side === 0 || FK.inSight(t.k ?? FK.tileAt(t.bx, t.by)))) { const [x, y] = FK.toScreen(t.vx, t.vy); if (x > -40 && x < cw + 40 && y > -40 && y < ch + 40) bar(x, y - (t.n * 12 + 20) * s, t.n * 10 * s, t.hp / t.hpMax, SIDES[t.side].col); }
  const w = waves[0]; if (w) { const [bx, by] = FK.tileMid(w.k), [vx, vy] = FK.toView(bx, by, Math.max(0, FK.H[w.k])), [x, y] = FK.toScreen(vx, vy); ctx.strokeStyle = '#ff6b5b'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, 14 * s, 7 * s, 0, 0, 7); ctx.moveTo(x - 20 * s, y); ctx.lineTo(x + 20 * s, y); ctx.moveTo(x, y - 10 * s); ctx.lineTo(x, y + 10 * s); ctx.stroke(); }
});
return { attack, recall, fight, march, hit, damage, die, armyOf, strength, waves, armed, enemies, hpMax, stat };
})();
