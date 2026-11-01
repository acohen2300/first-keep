# The map's base rules (decisions 2 and 5a, Albert, Oct 31), each shown failing on a planted bug. Run by the gate:  python3 tests/map.py
# Adds the 100-seed placement report with --seeds N (the gate runs 100).
import asyncio, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEEDS = int(sys.argv[sys.argv.index('--seeds') + 1]) if '--seeds' in sys.argv else 100

# decision 2: two squares between non-wall buildings; a one-square gap is refused; the two-square lane is open ground; a crop may touch
GAP = """() => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(7); F.act('close'); const G = F.G, k = F.keepOf(0), n = F.BLD.house.fp, N = F.NC;
  let done = false;
  for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const s = F.findSpot(0, 'house', k.x, k.y, 90, 260); if (!s) continue;
    const a = F.build(0, 'house', s.x, s.y); a.prog = 1; F.built(a); F.navRebuild();
    const at = (g) => ({ x: a.x + ax * (n + g) * F.NAVC, y: a.y + ay * (n + g) * F.NAVC }), p1 = at(1), p2 = at(2), f = at(0);
    if (F.canPlace(0, 'house', p2.x, p2.y)) { a.hp = 0; F.navRebuild(); continue; }   // something else in the way here: another side
    done = true;
    if (!F.canPlace(0, 'house', p1.x, p1.y)) bad.push('a one-square gap between two buildings is allowed');
    const b = F.build(0, 'house', p2.x, p2.y); b.prog = 1; F.built(b); F.navRebuild();
    for (let i = 0; i < n; i++) for (let g = 1; g <= 2; g++) {   // the two lane squares along the shared side
      const gx = ax ? (ax > 0 ? a.gx + n - 1 + g : a.gx - g) : a.gx + i, gy = ay ? (ay > 0 ? a.gy + n - 1 + g : a.gy - g) : a.gy + i;
      if (F.NAV.solid[gy * N + gx]) { bad.push('the two-square lane between two buildings is shut at ' + gx + ',' + gy); i = n; break; }
    }
    if (F.canPlace(0, 'farm', a.x + ax * (n + F.BLD.farm.fp) * F.NAVC / 2, a.y + ay * (n + F.BLD.farm.fp) * F.NAVC / 2) === 'Leave a gap: two squares round each building') bad.push('a crop may not touch a house');
    break;
  }
  if (!done) bad.push('no clear ground for the gap test');
  return bad; }"""

# D1: a wave is judged by its progress. A wave that keeps walking nearer is not recalled at WAVE.stall; one that neither nears nor fights
# for WAVE.stall goes home, and its target is left alone for WAVE.cool. Driven through the real decideWar, with the clock moved by hand.
WAVE = """() => {
  const F = window.__fk, bad = []; F.SET.scen = 'open'; F.newGame(3); F.act('close'); const G = F.G, W = F.WAVE, p = G.P[1], per = F.PERS[p.pers], k0 = F.keepOf(0), k1 = F.keepOf(1);
  G.rel[1][0] = G.rel[0][1] = 'war';
  const sq = []; for (let i = 0; i < 12; i++) { const u = F.addUnit(1, 'spear', k1.x + 60 + i * 4, k1.y + 60); u.state = 'attack'; u.target = 0; sq.push(u); }
  p.wave = { n: 12, t: G.t, to: 0, bid: null, d: 1e9, pt: G.t };
  const walk = (s) => { for (const u of sq) { const d = Math.hypot(k0.x - u.x, k0.y - u.y); u.x += ((k0.x - u.x) / d) * F.UNIT.spear.spd * s; u.y += ((k0.y - u.y) / d) * F.UNIT.spear.spd * s; u.hitT = -99; } G.t += s; };
  F.decideWar(p, per); for (let i = 0; i < 8; i++) { walk(10); F.decideWar(p, per); }
  if (!p.wave || sq.some((u) => u.state !== 'attack')) bad.push('a wave still walking nearer was recalled after ' + 80 + ' s');
  const t0 = G.t; for (let i = 0; i < 6 && p.wave; i++) { G.t += 10; F.decideWar(p, per); }
  if (p.wave) bad.push('a wave that neither neared nor fought for ' + (G.t - t0) + ' s was not recalled');
  else if (!((p.ai.cool[0] || 0) > G.t)) bad.push('a stalled target is not left alone');
  else { for (const u of sq) u.state = 'home'; F.decideWar(p, per); if (p.wave && p.wave.to === 0) bad.push('the stalled wave went straight back at the same target'); }
  return bad; }"""

async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); fails = 0
        async def run(js, arg=None):
            pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
            await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
            try: out = await pg.evaluate(js, arg) if arg is not None else await pg.evaluate(js)
            except Exception as e: out = ['the test could not run: ' + str(e).splitlines()[0][:160]]
            await pg.close()
            return out, errs
        bad, errs = await run(GAP); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'two squares between buildings (decision 2)', '' if not bad else bad); fails += bool(bad)
        bad, errs = await run(WAVE); bad += errs
        print(('PASS ' if not bad else 'FAIL ') + 'a wave is judged by its progress (D1)', '' if not bad else bad); fails += bool(bad)
        await br.close()
    sys.exit(1 if fails else 0)
asyncio.run(main())
