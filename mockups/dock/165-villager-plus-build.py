import asyncio, sys
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
SET = "const u = ECON.villagersOf(0)[0], c = FK.cam; c.x = c.tx = u.vx; c.y = c.ty = u.vy; FK.dirty(); window.__u = u; FK.select(null); MENU.act('mmode','Build'); %s MENU.render(true);"
JOIN = "const b = document.getElementById('base').innerHTML; FK.select([window.__u]); MENU.__r(true); document.getElementById('base').innerHTML = b; document.getElementById('spd').classList.remove('on');"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        a = await shot(b, SET % '', JOIN, '', 560); z = await shot(b, SET % "MENU.act('pick','BR1');", JOIN, '', 560)
        sheet('165-villager-plus-build', [('combined: villager picked, Build under it', a), ('combined: placing a House', z)]); await b.close()
asyncio.run(run())
