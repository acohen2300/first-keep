import asyncio, sys, time, json
from playwright.async_api import async_playwright
V = sys.argv[1]; MIN = int(sys.argv[2]); PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}); E=[]; pg.on('pageerror', lambda e: E.append(str(e))); pg.on('console', lambda m: E.append('C:' + m.text[:300]) if m.type == 'error' else None)
        await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#' + sys.argv[3] + ''); await pg.wait_for_timeout(1000)
        print(await pg.evaluate("(() => { ECON.setBell(Infinity); return [FK.seed(), FK.land(), FK.D.players, location.hash]; })()"))
        t0 = time.time()
        for m in range(MIN):
            r = await pg.evaluate("(() => { const t0 = performance.now(); $rich(0); const H = FK.seatOf(0); if (H) H.hp = H.hpMax; let n = 0; $run(60, () => { if (n++ % 40 === 0) { AI.think(0); if (H) H.hp = H.hpMax; } }); const ms = performance.now() - t0; return [Math.round(ms), FK.units().length, FK.blds().length, ECON.result() && ECON.result().text, FK.D.players.map((p) => ECON.fell(p) ? 'x' : FK.units().filter((u) => u.side === p).length).join('/')]; })()")
            if m % 5 == 4 or r[3] or r[0] > 8000: print(m + 1, r, round(time.time() - t0), E[:2], flush=True)
            if r[3]: break
        await b.close()
asyncio.run(go())
