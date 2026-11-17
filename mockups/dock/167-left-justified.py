import asyncio, sys
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
LEFT = ".mt{justify-content:start}"
M = "const q = (s) => document.querySelector(s); const t = q('.mctl .tg'); const on = t.querySelector('.on'); if (on) on.classList.add(on.textContent === 'Learn' ? 'L' : 'T'); t.style.marginLeft = '0'; q('.mctl .mr').style.marginLeft = 'auto'; document.getElementById('spd').classList.remove('on');"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        a = await shot(b, TC, M, CSS40 + CLEAR + LEFT, 560); z = await shot(b, TC + "MENU.act('ctab','Learn'); MENU.render(true);", M, CSS40 + CLEAR + LEFT, 560)
        bl = await shot(b, "FK.select(null); MENU.act('mmode','Build'); MENU.act('group','Keep'); MENU.render(true);", "document.getElementById('spd').classList.remove('on');", CSS40 + LEFT, 560)
        sheet('167-left-justified', [('left: Town Center on Train', a), ('left: on Learn', z), ('left: Build, Keep (5 tiles)', bl)]); await b.close()
asyncio.run(run())
