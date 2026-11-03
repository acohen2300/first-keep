# The test field (Albert, Nov 3): the page opened with ?test is you and one rival at war, both armies on the field, a mine site by gold
# with a wolf, 5,000 of everything, and it is never saved over your real game.
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = """() => { const F = window.__fk, G = F.G, bad = [];
  if (!G.test) bad.push('the page opened with ?test is not the test field');
  const alive = G.P.filter((p) => p.alive && p.id !== F.WILD).map((p) => p.id).join(',');
  if (alive !== '0,1') bad.push('the test field has sides ' + alive + ' (want you and one rival)');
  if (G.rel[0][1] !== 'war') bad.push('the rival is not at war with you');
  const mine = (o, k) => G.units.filter((u) => u.owner === o && u.kind === k).length;
  if (mine(0, 'spear') < 10 || mine(0, 'archer') < 8 || mine(1, 'spear') < 10) bad.push('the armies are not on the field');
  if (G.P[0].res.g < 4000) bad.push('the test field does not start with 5,000 of everything');
  if (!G.blds.some((b) => b.owner === 0 && b.kind === 'mining' && b.prog < 1)) bad.push('no mine site by the gold');
  if (!G.units.some((u) => u.kind === 'wolf')) bad.push('no wolf at the gold');
  const before = localStorage.getItem(F.SAVEKEY); F.saveGame(true); if (localStorage.getItem(F.SAVEKEY) !== before) bad.push('the test field was saved over the real game');
  return bad; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html') + '?test'); await pg.wait_for_timeout(800)
        bad = await pg.evaluate(JS) + errs; await br.close()
    print(('PASS ' if not bad else 'FAIL ') + 'the test field (?test): one rival, both armies, the mine and the wolf, never saved', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
