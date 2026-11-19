# Item cards, Albert Nov 19 16:10: the info where the tiles would be; an italic sentence beside the - and +. Two wordings side by side, and one full game screen.
import asyncio
from playwright.async_api import async_playwright
V = '/home/claude/first-keep/frankenstein-refresh/v100'; OUT = '/home/claude/first-keep/mockups/cards/'; PANEL = open(OUT + 'panel.js').read()
item = lambda n, left, unit, on, hint='Add a villager': {'title': n, 'crumb': n, 'pages': [], 'hint': hint, 'pm': 1, 'acts': ['Exit'], 'tiles': [], 'info': [f'{left} {unit} left', f'{on} of 4 working']}
SPECS = [item('Berries', 240, 'food', 2), item('Berries', 240, 'food', 2, 'Send a villager?'), item('Tree', 310, 'wood', 1), item('Gold', 800, 'gold', 0), item('Stone', 600, 'stone', 0), item('Iron', 600, 'iron', 0), item('Fish', 500, 'food', 0)]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 300}, device_scale_factor=2); await pg.goto('file://' + V + '/index.html#1'); await pg.wait_for_timeout(1200)
        await pg.evaluate("() => { document.body.innerHTML = ''; document.body.style.cssText = 'margin:0;background:#3d7a36;display:flex;flex-wrap:wrap;gap:6px;overflow:auto;height:auto;position:static'; document.documentElement.style.cssText = 'overflow:auto;height:auto'; }")
        await pg.add_script_tag(content=PANEL)
        for sp in SPECS: print(sp['title'], sp['hint'], await pg.evaluate("(sp) => fkPanel(sp, false)", sp))
        await pg.screenshot(path=OUT + 'sheet-Items.png', full_page=True); await pg.close()
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); await pg.goto('file://' + V + '/index.html#20261105'); await pg.wait_for_timeout(2500)
        await pg.evaluate("() => { start(20261105); FK.fog(false); paused = false; K.t = D.day / 4; climate(0); MENU.S.tab = null; MENU.render(true); }"); await pg.wait_for_timeout(700)
        await pg.add_style_tag(content='#ui,#qa,#spd{visibility:hidden!important}'); await pg.add_script_tag(content=PANEL)
        await pg.evaluate("""(sp) => { const h = FK.seatOf(0), t = FK.things().filter((q) => q.kind === 'bush').sort((a, b) => Math.hypot(a.bx - h.bx, a.by - h.by) - Math.hypot(b.bx - h.bx, b.by - h.by))[0]; FK.cam.follow = false; FK.cam.x = t.vx; FK.cam.y = t.vy + 40; fkPanel({ ...sp, fix: 1 }, false); }""", SPECS[0])
        await pg.wait_for_timeout(600); await pg.screenshot(path=OUT + 'screen-Berries.png'); await b.close()
asyncio.run(main())
