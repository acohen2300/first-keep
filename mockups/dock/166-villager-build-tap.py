import asyncio, sys
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
SET = "const u = ECON.villagersOf(0)[0], c = FK.cam; c.x = c.tx = u.vx; c.y = c.ty = u.vy; FK.dirty(); window.__u = u; FK.select([u]); MENU.render(true);"
BTN = "const r = document.querySelector('.mline .mrd'); r.outerHTML = '<button class=\"mp\" style=\"margin-left:auto\">Build</button>'; document.getElementById('spd').classList.remove('on');"
SET2 = "const u = ECON.villagersOf(0)[0], c = FK.cam; c.x = c.tx = u.vx; c.y = c.ty = u.vy; FK.dirty(); window.__u = u; FK.select(null); MENU.act('mmode','Build'); MENU.render(true);"
JOIN = "const b = document.getElementById('base').innerHTML; FK.select([window.__u]); MENU.__r(true); document.getElementById('base').innerHTML = b; " + BTN.replace('margin-left:auto', 'margin-left:auto;background:var(--rw);color:var(--ink)')
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        a = await shot(b, SET, BTN, '', 560); z = await shot(b, SET2, JOIN, '', 560)
        sheet('166-villager-build-tap', [('1. villager picked: Build in place of the reading', a), ('2. after the Build tap: Build lit, rows under', z)]); await b.close()
asyncio.run(run())
