# How the game (n75) draws its menus today: the closed line, a building card, War. Real screens, nothing drawn over.
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
V = '/home/claude/first-keep/frankenstein-refresh/v100'; OUT = '/home/claude/first-keep/mockups/cards/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); await pg.goto('file://' + V + '/index.html#20261105'); await pg.wait_for_timeout(2500)
        await pg.evaluate("() => { start(20261105); FK.fog(false); paused = false; K.t = D.day / 4; climate(0); MENU.S.tab = null; MENU.render(true); const h = FK.seatOf(0); FK.cam.follow = false; FK.cam.x = h.vx; FK.cam.y = h.vy - 230; }"); await pg.wait_for_timeout(700)
        sheet = Image.new('RGB', (390 * 3 + 20, 420), (20, 17, 14)); bg = []
        for c, js in enumerate(["MENU.S.subject = null; MENU.S.tab = null;", "MENU.S.subject = FK.seatOf(0);", "MENU.S.subject = null; MENU.act('war');"]):
            await pg.evaluate("(js) => { eval(js); MENU.render(true); }", js); await pg.wait_for_timeout(500); await pg.screenshot(path='/tmp/n.png'); sheet.paste(Image.open('/tmp/n.png').resize((390, 844)).crop((0, 424, 390, 844)), (c * 400, 0))
            bg.append(await pg.evaluate("() => [...document.querySelectorAll('#base, #base > *, #ui')].map((e) => e.id + '.' + e.className + ' ' + getComputedStyle(e).backgroundImage.slice(0, 90) + ' ' + getComputedStyle(e).backgroundColor)"))
        sheet.save(OUT + 'now.png'); print(bg[1]); await b.close()
asyncio.run(main())
