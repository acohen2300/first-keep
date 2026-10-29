# The computer probe (Build 59): what a computer side is doing, every 5 game minutes, so a stall is found in the numbers, not guessed.
# A test tool, not a gate:  python3 build.py && python3 tests/probe.py [seeds 1,2] [minutes 40]
# For each seat: age, villagers and the share it needs to save for the next age, soldiers, the jobs (food/wood/gold/stone/iron), the store,
# the share of the last 5 minutes spent saving for an age (or not saving because of a threat at home), and where the spending went (the ledger).
import asyncio, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEEDS = [int(a) for a in (sys.argv[1] if len(sys.argv) > 1 else '1,2').split(',')]
MINUTES = int(sys.argv[2]) if len(sys.argv) > 2 else 40
JS = """([seed, minutes]) => {
  const F = window.__fk, CV = Object.keys(F.CIVS); F.SET.diff = 'normal'; F.SET.fog = false; F.SET.scen = 'open'; F.SET.civ = CV[seed % CV.length]; F.newGame(seed); F.act('close'); F.setPause(false);
  const G = F.G, P0 = G.P[0]; P0.pers = 'bal'; P0.ai.t = 1; const st = [0, 1, 2, 3].map(() => ({ s: 0, t: 0, n: 0 })), out = [];
  let last = [0, 1, 2, 3].map((o) => ({ ...G.P[o].ledger.out }));
  for (let sec = 0; sec < minutes * 60; sec++) {
    for (let i = 0; i < 30; i++) { F.step(1 / 30); if (P0.alive) { P0.ai.t -= 1 / 30; if (P0.ai.t <= 0) { P0.ai.t = F.react(); F.think(P0); } } }
    for (let o = 0; o < 4; o++) { const a = G.P[o].ai.saving; st[o].n++; if (a === 1) st[o].s++; if (a === 2) st[o].t++; }
    if (sec % 300 === 299) out.push({ min: Math.round(G.t / 60), seats: [0, 1, 2, 3].map((o) => { const p = G.P[o], L = p.ledger.out, d = {}; for (const k in L) d[k] = Math.round(L[k] - (last[o][k] || 0)); last[o] = { ...L };
      const r = { o, pers: p.pers, alive: p.alive, age: p.age, vils: F.unitsOf(o, 'vil').length, army: F.soldiersOf(o).length,
        jobs: ['food', 'wood', 'gold', 'stone', 'iron'].map((j) => F.unitsOf(o, 'vil').filter((u) => u.job === j).length).join('/'),
        store: Object.fromEntries(Object.entries(p.res).map(([k, v]) => [k, Math.round(v)])), saving: Math.round((100 * st[o].s) / st[o].n), threat: Math.round((100 * st[o].t) / st[o].n), spent: d };
      st[o].s = st[o].t = st[o].n = 0; return r; }) });
  }
  return out; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(400)
        for seed in SEEDS:
            for s in await pg.evaluate(JS, [seed, MINUTES]):
                print(f"seed {seed}, minute {s['min']}")
                for r in s['seats']: print('  ', json.dumps(r))
        await br.close()
asyncio.run(main())
