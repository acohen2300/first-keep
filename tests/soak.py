# The soak: long games on several seeds, every hazard on, Hard. The gate's fingerprint plays five minutes; this plays what comes after
# (raids, hazards, the horde, Hard minds, saves of big games) and fails on any error, any NaN, any resource below zero.
# Opt-in, about 3 minutes:  python3 tests/gate.py --soak     or alone:  python3 tests/soak.py [seeds] [minutes]   (defaults 1,2,3 and 20)
import asyncio, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEEDS = [int(a) for a in (sys.argv[1] if len(sys.argv) > 1 else '1,2,3').split(',')]
MINUTES = int(sys.argv[2]) if len(sys.argv) > 2 else 20
SETUP = """(seed) => { const F = window.__fk; F.SET.diff = 'hard'; F.newGame(seed); F.act('close'); const G = F.G; G.diff = 'hard';
  G.hz = { hard: 1, starve: 1, winter: 1, drought: 1, horde: 1, plague: 1 };
  const P = G.P[0], k = F.keepOf(0); P.age = 2; for (const r of ['f', 'w', 's', 'g', 'i']) P.res[r] = 4000;
  for (let i = 0; i < 25; i++) F.addUnit(0, 'spear', k.x + 40 + (i % 5) * 14, k.y - 60 - ((i / 5) | 0) * 14);   // enough to outlive the early raids
  F.setPause(false); window.__errs = []; console.error = (...a) => { window.__errs.push(String(a[0]).slice(0, 300)); }; return true; }"""
MINUTE = """() => { const F = window.__fk, G = F.G, out = { t: Math.round(G.t) };
  for (let i = 0; i < 1800; i++) { F.step(1 / 30); if (i % 90 === 0) { try { F.draw(); } catch (e) { window.__errs.push('draw: ' + e.message); } } }
  const bad = [];
  for (const u of G.units) if (!Number.isFinite(u.x) || !Number.isFinite(u.y) || !Number.isFinite(u.hp)) { bad.push('unit ' + u.kind + ' ' + u.x + ',' + u.y + ',' + u.hp); if (bad.length > 3) break; }
  for (const p of G.P) for (const r of ['f', 'w', 's', 'g', 'i']) { const v = p.res[r]; if (!Number.isFinite(v) || v < -1) bad.push('res ' + p.id + ' ' + r + '=' + v); }
  F.saveGame(true); if (!F.readSave()) bad.push('the save of a big game did not read back');
  out.bad = bad.slice(0, 5); out.errs = window.__errs.slice(0, 3); out.units = G.units.length; out.blds = G.blds.length; return out; }"""
async def run(br, seed):
    pg = await br.new_page(viewport={'width': 390, 'height': 844}); perr = []; pg.on('pageerror', lambda e: perr.append(str(e)[:300]))
    await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(500); await pg.evaluate(SETUP, seed)
    last = None
    for m in range(MINUTES):
        last = await pg.evaluate(MINUTE)
        if last['bad'] or last['errs'] or perr: break
    await pg.close(); problems = (last['bad'] + last['errs'] + perr)[:3]
    return seed, last['t'], last['units'], last['blds'], problems
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); res = await asyncio.gather(*[run(br, s) for s in SEEDS]); await br.close()
    fails = 0
    for seed, t, u, b, probs in res:
        print(('PASS ' if not probs else 'FAIL ') + f'soak seed {seed}: {t // 60} min, {u} units, {b} buildings', '' if not probs else json.dumps(probs)); fails += bool(probs)
    sys.exit(1 if fails else 0)
asyncio.run(main())
