import asyncio, sys, io
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        v = await shot(b, "const h = FK.seatOf(0), u = ECON.villagersOf(0)[0], c = FK.cam; c.x = c.tx = u.vx; c.y = c.ty = u.vy; FK.select([u]); FK.dirty(); MENU.render(true);", '', '', 0)
        bl = await shot(b, "FK.select(null); MENU.act('mmode','Build'); MENU.render(true);", '', '', 0)
        sheet('actual-n67', [('n67 actual: villager picked', v), ('n67 actual: Build', bl)]); await b.close()
asyncio.run(run())
