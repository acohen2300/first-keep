# Batch 3 (Build 80): movement and work rules, each shown failing on a planted bug. Run by the gate:  python3 tests/moves.py
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => {
  const F = window.__fk, bad = []; F.newGame(7); F.act('close'); F.setPause(false); const G = F.G;
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
