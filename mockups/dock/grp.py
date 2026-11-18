import asyncio, sys
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
JS = open('/home/claude/mk/grp.js').read()
SET = "MENU.act('mmode','Build'); MENU.render(true);"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        P = [(t, await shot(b, SET, f"window.__K = '{k}';" + JS, CSS40, 600)) for t, k in [('A. Five icons, the lit one underlined', 'icons'), ('B. Page dots (swipe the tiles)', 'dots'), ('C. One word that cycles', 'cyc')]]
        sheet('193-group-picker', P); await b.close()
asyncio.run(run())
