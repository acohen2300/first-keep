import asyncio, sys, json, os, time
from playwright.async_api import async_playwright
V = sys.argv[1]; MIN = int(sys.argv[2]); N = int(sys.argv[3]); SEED = '4063976774'
JS = r"""(async (N) => { document.querySelector('[data-v="opt|len|0"]').click(); await new Promise(r => setTimeout(r, 200)); document.querySelector('[data-v="start||"]').click(); await new Promise(r => setTimeout(r, 300)); FK.pause(true);
  const h = FK.seatOf(0); let made = 0; for (let d = 2; d < 12 && made < N; d++) for (let a = -d; a <= d && made < N; a++) for (const [i, j] of [[h.i + a, h.j + d], [h.i + a, h.j - d]]) { const k = j * FK.N + i; if (made < N && FK.walkable(k)) { try { FK.spawn('UV', 0, k, FK.rng); made++; } catch (e) { return String(e); } } }
  window.$rows = []; window.$m = () => { const K = FK.K, mine = () => FK.units().filter((u) => u.side === 0 && !WAR.armed(u)); const n0 = mine().length; let sickDead = 0, otherDead = 0; const seen = new Set(mine());
    for (let i = 0; i < 600; i++) { FK.sim(0.1); for (const u of seen) if (u.gone) { seen.delete(u); if (u.sick > K.t - 0.2 && u.hp > 0) sickDead++; else otherDead++; } if (i % 100 === 0) Object.assign(FK.SIDES[0].store, { food: 5000 }); }
    const M = mine(); const r = [Math.round(K.t / 60), n0, M.length, M.filter((u) => u.sick > K.t).length, sickDead, otherDead, Math.round(K.temp)]; $rows.push(r); return r; }; return made; })"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.join(V, 'index.html') + '#' + SEED); await pg.wait_for_timeout(1500)
        print('made', await pg.evaluate(JS + f"({N})")); print('min, start, end, sick now, died sick, died other, temp')
        for m in range(MIN): print(await pg.evaluate("$m()"), flush=True)
        print('ERRS', errs[:3]); await b.close()
asyncio.run(main())
