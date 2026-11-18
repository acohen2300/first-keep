import asyncio, sys
from playwright.async_api import async_playwright
V = sys.argv[1]; WALLS = sys.argv[2] == '1'; CODE = sys.argv[3] if len(sys.argv) > 3 else 'Trebuchet'; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
JS = r"""(async () => { ECON.setBell(Infinity); const F = 1, h = FK.seatOf(F), N = FK.N, byName = (n) => Object.keys(FK.SH).find((c) => FK.SH[c].name === n); WAR.treaty(0, F, 'war'); const s = FK.SIDES[F]; s.age = 1; $rich(F); $rich(0);
 let walls = 0; if (WALLS) for (const [k, c] of AI.wallPlan(h)) { const t = FK.build(c, k % N, Math.floor(k / N), s.col); if (t) { t.side = F; t.done = 1; t.hp = t.hpMax = WAR.hpMax(t); walls++; } }
 let k0 = null; for (let d = 22; d < 40 && !k0; d++) for (const k of [(h.j + d) * N + h.i, (h.j - d) * N + h.i, h.j * N + h.i + d, h.j * N + h.i - d]) if (!k0 && [0, 1, 2, 3, 4, 5].every((x) => FK.walkable(k + x))) k0 = k;
 const mine = Array.from({ length: 11 }, (_, x) => FK.spawn(byName(CODE), 0, k0 + (x % 6) + N * Math.floor(x / 6), FK.rng)).filter(Boolean); WAR.order(mine, h, h.k);
 const out = [walls, mine.length]; for (let i = 0; i < 6; i++) { const t0 = performance.now(); $run(5); out.push(Math.round(performance.now() - t0)); } out.push(h.hp, mine.map((u) => u.job).join(',')); return out; })()""".replace('WALLS', 'true' if WALLS else 'false').replace('CODE', repr(CODE))
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}); E=[]; pg.on('pageerror', lambda e: E.append(str(e)))
        await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#2183249118'); await pg.wait_for_timeout(1000)
        print('walls' if WALLS else 'open', await pg.evaluate(JS), E[:2]); await b.close()
asyncio.run(go())
