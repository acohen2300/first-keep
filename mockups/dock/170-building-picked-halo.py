import asyncio, sys, io
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
from PIL import ImageFilter, ImageChops
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); await pg.add_init_script(PRE); await pg.goto('file://' + V + '/index.html#20261105'); await pg.wait_for_timeout(1200)
        await pg.evaluate(BOOT); await pg.evaluate("(() => { const h = FK.seatOf(0), c = FK.cam; c.x = c.tx = h.vx; c.y = c.ty = h.vy + 80; FK.select(null); MENU.S.subject = h; FK.dirty(); MENU.render(true); })()")
        await pg.wait_for_timeout(600); await pg.evaluate(FREEZE); await pg.evaluate("document.getElementById('spd').classList.remove('on')"); await pg.wait_for_timeout(300)
        A = Image.open(io.BytesIO(await pg.screenshot())).convert('RGB')
        xy = await pg.evaluate("FK.toScreen(FK.seatOf(0).vx, FK.seatOf(0).vy)")
        await pg.evaluate("(() => { const h = FK.seatOf(0); h.gone = true; FK.dirty(); })()"); await pg.wait_for_timeout(400)
        B = Image.open(io.BytesIO(await pg.screenshot())).convert('RGB'); await b.close()
    x, y = xy[0] * 2, xy[1] * 2; box = (int(x - 170), int(y - 200), int(x + 170), int(y + 40)); px = A.load(); m = Image.new('L', A.size, 0); mp = m.load()
    for i in range(box[0], box[2]):
        for j in range(box[1], box[3]):
            r, g, bb = px[i, j]
            if r - g > 14 or (r > 95 and g > 80): mp[i, j] = 255
    m = m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    edge = ImageChops.subtract(m.filter(ImageFilter.MaxFilter(7)), m)
    import math
    G = Image.new('RGB', A.size, (0, 0, 0)); gm = Image.new('L', A.size, 0); gp = gm.load(); cx, cy = x, y - 70
    for i in range(int(cx - 260), int(cx + 260)):
        for j in range(int(cy - 200), int(cy + 200)):
            d = math.hypot((i - cx) / 240, (j - cy) / 175)
            if d < 1: gp[i, j] = int(170 * (1 - d) ** 1.5)
    def halo(im, col):
        g = Image.composite(Image.new('RGB', A.size, col), im, gm); return Image.composite(im, g, m)
    crop = lambda im: im.crop((int(x) - 300, int(y) - 360, int(x) + 300, int(y) + 200))
    sheet('170-building-picked-halo', [('n67 now: picked, no mark', crop(A)), ('halo, gold (the name halo)', crop(halo(A, (240, 200, 90)))), ('halo, white', crop(halo(A, (255, 255, 255))))])
asyncio.run(run())
