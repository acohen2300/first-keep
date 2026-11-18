import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
CSS = ".gw { margin-left: 0; } .gw::before { content: '→'; color: var(--wdim); padding: 0 4px 0 6px; } .gw button { padding: 0 3px; } .gw button.on { color: var(--rw); text-decoration: underline; text-underline-offset: 2px; } .jb .fl, .mline .dot:first-child { text-shadow: 0 0 6px rgba(245,232,200,.45), 0 0 2px rgba(0,0,0,.9); } .mline .dot:first-child { box-shadow: 0 0 10px rgba(245,232,200,.25); } .jb .fl:not(.on) { opacity: .45; text-shadow: none; } .jb .fl.on { text-shadow: 0 0 8px rgba(245,232,200,.7), 0 0 2px rgba(0,0,0,.9); }"
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=3); await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
        await pg.evaluate("""(css) => { MENU.S.tab = null; $rich(0); const u = ECON.villagersOf(0)[0], c = FK.cam; c.x = c.tx = u.vx; c.y = c.ty = u.vy; FK.dirty(); FK.select([u]); MENU.act('mtab', 'Build'); MENU.act('pick', Object.keys(FK.SH).find((c) => FK.SH[c].name === 'House')); MENU.render(true); MENU.render = () => {};
          const s = document.getElementById('spd'); if (s) s.classList.remove('on'); const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
          const w = document.querySelector('.mline [data-v^="war|"]'); w.insertAdjacentHTML('beforebegin', '<button class="fl" style="font-size:28px;font-weight:400;padding:0 8px">−</button>'); }""", CSS)
        await pg.wait_for_timeout(300)
        Image.open(io.BytesIO(await pg.screenshot())).crop((0, 1950, 1170, 2532)).save('/home/claude/first-keep/mockups/dock/211-fullest-dock-mock.png'); await b.close()
asyncio.run(go())
