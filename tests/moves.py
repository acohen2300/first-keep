# Batch 3 (Build 80): movement and work rules, each shown failing on a planted bug. Run by the gate:  python3 tests/moves.py
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => {
  const F = window.__fk, bad = []; F.newGame(7); F.act('close'); F.setPause(false); let G = F.G;
  // decision 1: the search widens with the time since the last find, from 90 to 180
  const q = { lostT: undefined }; const r0 = F.searchR(q); q.lostT = G.t - 5; const r5 = F.searchR(q); q.lostT = G.t - 30; const r30 = F.searchR(q);
  if (!(r0 === 90 && r5 > 90 && r5 < 180 && r30 === 180)) bad.push('the search radius does not widen from 90 to 180 (' + [r0, r5, r30].join(', ') + ')');
  // a villager who has lost its find keeps its job for a while and looks again, instead of dropping it at once
  const lv = G.units.find((u) => u.owner === 0 && u.kind === 'vil'); F.setJob(lv, 'food'); lv.was = 'bush'; lv.node = null; lv.nnT = 0; lv.lostT = undefined;
  lv.bad = {}; for (const n of G.nodes) lv.bad[n.id] = G.t + 999;
  for (let i = 0; i < 12; i++) F.step(0.25);
  if (lv.job !== 'food') bad.push('a villager with no find in sight gave up its job in 3 seconds (' + lv.job + ')');
  F.newGame(7); F.act('close'); F.setPause(false); G = F.G;
  // decision 10: two on one spot part, the same way every time
  const v = G.units.filter((u) => u.owner === 0 && u.kind === 'vil').slice(0, 2);
  const run = () => { v[1].x = v[0].x; v[1].y = v[0].y; F.pushApart(v[0], v[1]); return [v[0].x - v[1].x, v[0].y - v[1].y]; };
  const a = run(), b = run();
  if (Math.hypot(a[0], a[1]) < 1) bad.push('two villagers on one spot did not part');
  if (a[0] !== b[0] || a[1] !== b[1]) bad.push('the parting direction changes from one time to the next');
  // C13: a fish costs its walk home like any find
  const k = F.keepOf(0), nr = { kind: 'fish', type: 'food', x: k.x + 60, y: k.y, amt: 300, id: 9e6 }, fr = { ...nr, x: k.x + 600, id: 9e6 + 1 };
  const probe = (n) => F.forage({ x: n.x, y: n.y, owner: 0, node: null, carry: 0 }, n);
  const rn = probe(nr), rf = probe(fr);
  if (!(rn > rf)) bad.push('a fish far from any drop-off pays as well as one beside it (' + rn.toFixed(3) + ' vs ' + rf.toFixed(3) + ')');
  // C10: a student is not pulled out of the School
  const s = F.addUnit(0, 'spear', k.x + 40, k.y + 40);
  if (s) { s.state = 'school'; if (F.troops().includes(s)) bad.push('All hands / Town square pulls a student out of the School'); if (F.sendable().includes(s)) bad.push('Home pulls a student out of the School'); }
  // C14: every way a repair ends gives back the old job
  const w = G.units.find((u) => u.owner === 0 && u.kind === 'vil'); w.job = 'repair'; w.pj = 'wood'; w.rep = { id: 1 }; F.backToWork(w);
  if (w.job !== 'wood' || w.pj || w.rep) bad.push('a repair that ends does not return the villager to its old job (' + w.job + ')');
  // decision 12: a deer's diagonal run is no faster than a straight one
  const d = F.addUnit(G.P.length - 1, 'deer', 600, 600); G.tick = 1 - (d.id % 6); d.hurtT = undefined; d.run = { x: 1600, y: 1600 };
  const x0 = d.x, y0 = d.y; F.wildTick(d, 0.25, 1); const step = Math.hypot(d.x - x0, d.y - y0), want = F.UNIT.deer.spd * 0.25;
  if (Math.abs(step - want) > 0.05 * want) bad.push('a deer runs ' + step.toFixed(2) + ' a step on a diagonal, not ' + want.toFixed(2));
  // decisions 8, 8b, 13: soldiers leave animals alone; a boar on one of your civilians, seen by your side, is not left alone
  const sp = F.addUnit(0, 'spear', k.x + 100, k.y + 100), bo = F.addUnit(G.P.length - 1, 'boar', k.x + 110, k.y + 100), vv = G.units.find((u) => u.owner === 0 && u.kind === 'vil');
  bo.tgt = null; if (F.nearestFoe(0, sp, 200) === bo) bad.push('a soldier goes after a boar that has done nothing');
  vv.x = bo.x + 5; vv.y = bo.y; bo.tgt = vv; if (F.nearestFoe(0, sp, 200) !== bo) bad.push('a soldier ignores a boar on one of your villagers');
  const far = F.addUnit(0, 'spear', k.x + 100, k.y + 100); if (!F.groupSees(0, bo)) bad.push('the group does not see what one member sees');
  // a villager at work eases in: the nearer its spot, the slower its step
  const ew = G.units.find((u) => u.owner === 0 && u.kind === 'vil'), sx = ew.x; ew.carry = 0; ew.hunt = null; ew.tgt = null; ew.stuck = 0;
  F.moveTo(ew, sx + 200, ew.y, 0.25, 4, 1); const stepFar = Math.abs(ew.x - sx); ew.x = sx; F.moveTo(ew, sx + 20, ew.y, 0.25, 4, 1); const stepNear = Math.abs(ew.x - sx);
  if (!(stepNear < stepFar)) bad.push('a villager does not ease in near its spot (' + stepNear.toFixed(2) + ' vs ' + stepFar.toFixed(2) + ')');
  // batch 4: B7 full health follows research; B15 no fish on land; B8 Easy has no bonus; B5 a fallen holder hands the Throne back
  F.newGame(7); G = F.G; const tc = F.keepOf(0); G.P[0].techs.add('masonry'); F.fxDirty();
  if (Math.abs(tc.hp - F.maxHpB(0, tc.kind)) > 1) bad.push('Masonry left the Town Center at ' + Math.round((100 * tc.hp) / F.maxHpB(0, tc.kind)) + '% health');
  for (const n of G.nodes) if (n.kind === 'fish' && F.onLand(n.x, n.y)) { bad.push('a fish sits on land at ' + Math.round(n.x) + ',' + Math.round(n.y)); break; }
  G.diff = 'easy'; G.hz = { fire: 1 }; if (F.levelMul() !== 1) bad.push('Easy keeps a score bonus for hazards that are off');
  G.diff = 'normal'; F.takeThrone(1, true); const T = G.blds.find((b) => b.kind === 'throne'); F.fall(G.P[1]);
  if (!T || T.gone || T.owner === 1 || (G.throne && G.throne.owner === 1)) bad.push('the Throne was deleted or still held by a fallen side');
  return bad;
}"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        bad = await pg.evaluate(JS); await br.close()
    bad += errs
    print(('PASS ' if not bad else 'FAIL ') + 'movement and work rules (parting, fish walk, students, back to work)', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
