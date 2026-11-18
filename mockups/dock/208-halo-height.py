import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        ims = []
        for t, lift in [('now (lift 0.42)', 0.42), ('0.25', 0.25), ('0.12', 0.12)]:
            pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
            xy = await pg.evaluate("(L) => { MENU.S.tab = null; MENU.SCR.halo.lift = L; MENU.SCR.halo.glow = 0.6; const h = FK.seatOf(0), c = FK.cam; c.follow = false; c.x = c.tx = h.vx; c.y = c.ty = h.vy; MENU.S.subject = h; MENU.S.tab = null; FK.pause(false); MENU.render(true); FK.dirty(); console.log(String(MENU.S.tab)); return FK.toScreen(h.vx, h.vy); }", lift)
            await pg.wait_for_timeout(500); im = Image.open(io.BytesIO(await pg.screenshot())); x, y = xy[0] * 2, xy[1] * 2
            ims.append((t, im.crop((int(x - 200), int(y - 260), int(x + 200), int(y + 120))))); await pg.close()
        await b.close()
    s = Image.new('RGB', (3 * 412, 420), '#14120e'); d = ImageDraw.Draw(s)
    for i, (t, im) in enumerate(ims): d.text((i * 412 + 8, 8), t, fill='#e8e4d4', font=F); s.paste(im, (i * 412, 40))
    s.save('/home/claude/first-keep/mockups/dock/208-halo-height-mock.png')
asyncio.run(go())
