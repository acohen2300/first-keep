# Three cards over the real game (n75), full screen: a building, the Market's Sell page, an item.
import asyncio, json
from playwright.async_api import async_playwright
V = '/home/claude/first-keep/frankenstein-refresh/v100'; OUT = '/home/claude/first-keep/mockups/cards/'; PANEL = open(OUT + 'panel.js').read()
A = ['Repair', 'Demolish', 'Exit']
SPECS = {'screen-TownCenter': ({'title': 'Town Center', 'crumb': 'Town Center', 'pages': ['Train', 'Learn', 'Relations'], 'page': 'Train', 'acts': A, 'tiles': [{'n': 'Villager', 's': '50f'}, {'n': 'Scout', 's': '80f'}]}, 'home'),
 'screen-Berries': ({'title': 'Berries', 'crumb': 'Berries', 'pages': [], 'pick': [['240 food left', None], ['2 of 4 working', None]], 'picked': -1, 'pm': 1, 'acts': ['Exit'], 'tiles': []}, 'bush'),
 'screen-War': ({'title': 'War Command', 'war': 1, 'pick': [['All', 9], ['Foot', 4], ['Bow', 3], ['Cav', 2], ['Siege', 0], ['Idle', 1], ['Squad', 2]], 'pm': 1, 'acts': ['Exit'], 'tiles': [{'war': 1, 'n': n} for n in ['Attack', 'Move', 'Defend', 'Hold', 'Retreat', 'Garrison villagers']]}, 'home')}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        await pg.goto('file://' + V + '/index.html#20261105'); await pg.wait_for_timeout(2500)
        await pg.evaluate("() => { start(20261105); FK.fog(false); paused = false; K.t = D.day / 4; climate(0); MENU.S.tab = null; MENU.render(true); }"); await pg.wait_for_timeout(700)
        await pg.add_style_tag(content='#ui,#qa,#spd{visibility:hidden!important}'); await pg.add_script_tag(content=PANEL)
        for name, (sp, at) in SPECS.items():
            await pg.evaluate("""([sp, at]) => { document.querySelectorAll('.fk').forEach((e) => e.remove()); const h = FK.seatOf(0), t = at === 'home' ? h : FK.things().filter((q) => q.kind === at).sort((a, b) => Math.hypot(a.bx - h.bx, a.by - h.by) - Math.hypot(b.bx - h.bx, b.by - h.by))[0]; FK.cam.follow = false; FK.cam.x = t.vx; FK.cam.y = t.vy + 60; fkPanel({ ...sp, fix: 1 }, false); }""", [sp, at])
            await pg.wait_for_timeout(600); await pg.screenshot(path=OUT + name + '.png')
        await b.close()
asyncio.run(main())
