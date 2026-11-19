# Albert, Nov 19 16:13: the cards overlay the screen, no brown background. Three cards over the real game, fully clear (top row) and with a faint fade (bottom row), for his pick.
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
V = '/home/claude/first-keep/frankenstein-refresh/v100'; OUT = '/home/claude/first-keep/mockups/cards/'; PANEL = open(OUT + 'panel.js').read()
SPECS = [({'title': 'Town Center', 'crumb': 'Town Center', 'pages': ['Train', 'Learn', 'Relations'], 'page': 'Train', 'acts': ['Repair', 'Demolish', 'Exit'], 'tiles': [{'n': 'Villager', 's': '50f'}, {'n': 'Scout', 's': '80f'}]}, 'home'),
 ({'title': 'Berries', 'crumb': 'Berries', 'pages': [], 'hint': 'Add a villager', 'pm': 1, 'acts': ['Exit'], 'tiles': [], 'info': ['240 food left', '2 of 4 working']}, 'bush'),
 ({'title': 'War Command', 'war': 1, 'pick': [['All', 9], ['Foot', 4], ['Bow', 3], ['Cav', 2], ['Siege', 0], ['Idle', 1], ['Squad', 2]], 'pm': 1, 'acts': ['Exit'], 'tiles': [{'war': 1, 'n': n} for n in ['Attack', 'Move', 'Defend', 'Hold', 'Retreat', 'Garrison villagers']]}, 'home')]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); await pg.goto('file://' + V + '/index.html#20261105'); await pg.wait_for_timeout(2500)
        await pg.evaluate("() => { start(20261105); FK.fog(false); paused = false; K.t = D.day / 4; climate(0); MENU.S.tab = null; MENU.render(true); }"); await pg.wait_for_timeout(700)
        await pg.add_style_tag(content='#ui,#qa,#spd{visibility:hidden!important}'); await pg.add_script_tag(content=PANEL); sheet = Image.new('RGB', (390 * 3 + 20, 420 * 2 + 10), (20, 17, 14))
        for r, look in enumerate(['clear', 'fade']):
            for c, (sp, at) in enumerate(SPECS):
                await pg.evaluate("""([sp, at, look]) => { document.querySelectorAll('.fk').forEach((e) => e.remove()); const h = FK.seatOf(0), t = at === 'home' ? h : FK.things().filter((q) => q.kind === at).sort((a, b) => Math.hypot(a.bx - h.bx, a.by - h.by) - Math.hypot(b.bx - h.bx, b.by - h.by))[0]; FK.cam.follow = false; FK.cam.x = t.vx; FK.cam.y = t.vy - 230; fkPanel({ ...sp, fix: 1, look }, false); }""", [sp, at, look])
                await pg.wait_for_timeout(500); await pg.screenshot(path='/tmp/o.png'); im = Image.open('/tmp/o.png').resize((390, 844)).crop((0, 424, 390, 844)); sheet.paste(im, (c * 400, r * 430))
                if look == 'clear' and c == 0: Image.open('/tmp/o.png').resize((390, 844)).save(OUT + 'overlay-screen.png')
        sheet.save(OUT + 'overlay.png'); await b.close()
asyncio.run(main())
