# The bot: plays the first minutes the way a stranger told only what the ticker says would, and reports how it went.
# A test tool, not a player: python3 tests/bot.py [seed] [minutes]   (defaults 3 and 5). It fails if the town stalls or errors.
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED = int(sys.argv[1]) if len(sys.argv) > 1 else 3
MIN = int(sys.argv[2]) if len(sys.argv) > 2 else 5
RUN = """([seed, minutes]) => { const F = window.__fk; F.SET.diff = 'normal'; F.newGame(seed); F.act('close'); const G = F.G, P = G.P[0], k = F.keepOf(0);
  window.__errs = []; console.error = (...a) => window.__errs.push(String(a[0]).slice(0, 200)); F.setPause(false);
  const vils = () => G.units.filter((u) => u.owner === 0 && u.kind === 'vil'), sold = () => G.units.filter((u) => u.owner === 0 && F.armyStatus(u) !== undefined && u.kind !== 'vil' && u.hp > 0);
  const tips = new Set(), log = [];
  const put = (kind, r0, r1) => { const s = F.findSpot(0, kind, k.x, k.y, r0, r1); return s ? F.build(0, kind, s.x, s.y) : null; };
  for (let sec = 0; sec < minutes * 60; sec++) {
    for (let i = 0; i < 30; i++) F.step(1 / 30);
    const V = vils(), n = (j) => V.filter((v) => v.job === j).length;
    for (const v of V.filter((v) => !v.job)) F.setJob(v, n('food') < 4 ? 'food' : n('wood') < 4 ? 'wood' : n('gold') < 2 ? 'gold' : 'food');
    if (!k.q.length && V.length < 20 && P.res.f >= 50) F.train(0, 'vil');
    const unfinished = G.blds.some((b) => b.owner === 0 && b.prog < 1 && b.kind === 'house');
    if (F.popOf(0) >= F.capOf(0) - 2 && !unfinished && P.res.w >= 30) put('house', 60, 190);
    if (G.t > 75 && !G.blds.some((b) => b.owner === 0 && b.kind === 'barracks') && P.res.w >= 100) put('barracks', 60, 190);
    const bk = G.blds.find((b) => b.owner === 0 && b.kind === 'barracks' && b.prog >= 1);
    if (bk && !bk.q.length && sold().length < 8) F.train(0, 'spear');
    if (sec % 5 === 0) { const t = F.advise(); if (t) tips.add(t.replace(/\\d+/g, 'N')); }
    if (sec % 60 === 59) log.push(Math.round(G.t) + 's: ' + V.length + ' villagers, ' + sold().length + ' soldiers, ' + F.popOf(0) + '/' + F.capOf(0) + ' room, food ' + Math.round(P.res.f) + ' wood ' + Math.round(P.res.w));
    if (!G.units.some((u) => u.owner === 0)) break;
  }
  return { log, tips: [...tips], errs: window.__errs.slice(0, 3), villagers: vils().length, over: !!G.over }; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(viewport={'width': 390, 'height': 844}); perr = []; pg.on('pageerror', lambda e: perr.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(500)
        r = await pg.evaluate(RUN, [SEED, MIN]); await br.close()
    print('\n'.join(r['log'])); print('ticker said:'); [print('  ' + t) for t in r['tips']]
    bad = r['errs'] + perr + ([] if r['villagers'] >= 8 and not r['over'] else ['the town stalled: ' + str(r['villagers']) + ' villagers'])
    print(('PASS' if not bad else 'FAIL') + ' bot, seed ' + str(SEED) + ', ' + str(MIN) + ' min', bad or ''); sys.exit(1 if bad else 0)
asyncio.run(main())
