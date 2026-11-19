# Draft 1 mock: the real game (v100) drawn with today's ground and with the nature-made land (nature.js), same seed. Pictures only.
import asyncio, sys, json
from playwright.async_api import async_playwright
V = '/home/claude/first-keep/frankenstein-refresh/v100'; HERE = '/home/claude/first-keep/mockups/land'
SEEDS = [int(s) for s in sys.argv[1:]] or [20261105]
NAT = open(HERE + '/nature.js').read()
SETUP = """async ([sd, on]) => { const W = (ms) => new Promise((r) => setTimeout(r, ms)); window.NAT.on = on; start(sd); FK.fog(false); paused = false; K.t = D.day / 4; climate(0); MENU.S.tab = null; MENU.render(true); await W(600); MENU.S.tab = null; MENU.render(true); await W(200);
 const h = FK.seatOf(0); return { stats: on ? NAT.stats : { lakes: lakes.length, rivers: RIV.length }, home: [h.vx, h.vy] }; }"""
async def shot(pg, path, cam):
    await pg.evaluate("([x, y, z]) => { if (x != null) { FK.cam.x = x; FK.cam.y = y; } FK.cam.z = z; FK.cam.follow = false; }", cam); await pg.wait_for_timeout(700)
    await pg.screenshot(path=path)
async def main():
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        for sd in SEEDS:
            for on in (False, True):
                pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
                await pg.add_init_script("window.addEventListener('DOMContentLoaded', () => { const s = document.createElement('script'); s.textContent = %s; document.body.append(s); });" % json.dumps(NAT))
                await pg.goto('file://' + V + '/index.html#' + str(sd)); await pg.wait_for_timeout(2500)
                r = await pg.evaluate(SETUP, [sd, on]); tag = f"{sd}-{'nature' if on else 'today'}"
                z0 = await pg.evaluate("FK.cam.z")
                await shot(pg, f'{HERE}/{tag}-home.png', [None, None, z0])
                await shot(pg, f'{HERE}/{tag}-pocket.png', [None, None, z0 * 0.45])
                mx = await pg.evaluate("toView(MID, MID, D.land)")
                await shot(pg, f'{HERE}/{tag}-map.png', [mx[0], mx[1], 390 / 3150])
                out[tag] = {**r, 'z0': z0, 'errs': errs[:3]}; await pg.close()
        await b.close()
    print(json.dumps(out, indent=1))
asyncio.run(main())
