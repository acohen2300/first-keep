import asyncio, sys
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
X = '<button class="dot"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
ADD = "document.getElementById('spd').classList.remove('on'); const c = document.querySelector('.mctl'); c.insertAdjacentHTML('beforeend', '%s');" % X.replace("'", "\\'")
JOBS = "FK.select(null); MENU.S.tab = null; MENU.render(true);"
BLD = "FK.select(null); MENU.act('mmode','Build'); MENU.render(true);"
HIDE = "document.getElementById('spd').classList.remove('on'); document.querySelector('.mctl').style.visibility='hidden'; document.querySelector('#base .mt').style.visibility='hidden';"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        j = await shot(b, JOBS, ADD, CSS40 + ".tg.grp{min-width:0;flex:1 1 auto} .tg.grp button{padding-inline:4px}", 560)
        bl = await shot(b, BLD, ADD, CSS40 + ".tg.grp{min-width:0;flex:1 1 auto} .tg.grp button{padding-inline:4px}", 560)
        tc = await shot(b, TC, "document.getElementById('spd').classList.remove('on');", CSS40, 560)
        h = await shot(b, JOBS, HIDE, CSS40, 560)
        sheet('168-close-everywhere', [('Jobs: ✕ at the row end', j), ('Build: ✕ at the row end', bl), ('card: ✕ already there', tc), ('after ✕: rows away, map clear', h)]); await b.close()
asyncio.run(run())
