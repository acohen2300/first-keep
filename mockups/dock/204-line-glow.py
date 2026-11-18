import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
BASE = ".hint { flex: auto; text-align: left; padding-left: 6px; } .gw { margin-left: 0; } .gw::before { content: '→'; color: var(--wdim); padding: 0 4px 0 6px; } .gw button { padding: 0 3px; } .gw button.on { color: var(--rw); text-decoration: underline; text-underline-offset: 2px; }"
G = [('now: no glow', ''),
     ('A: soft cream glow', '.jb .fl, .mline .dot:first-child { text-shadow: 0 0 6px rgba(245,232,200,.45), 0 0 2px rgba(0,0,0,.9); } .mline .dot:first-child { box-shadow: 0 0 10px rgba(245,232,200,.25); }'),
     ('B: gold glow', '.jb .fl, .mline .dot:first-child { text-shadow: 0 0 7px rgba(230,185,71,.55), 0 0 2px rgba(0,0,0,.9); } .mline .dot:first-child { box-shadow: 0 0 12px rgba(230,185,71,.35); }'),
     ('C: glow on the open one only', '.jb .fl.on { text-shadow: 0 0 7px rgba(245,232,200,.6), 0 0 2px rgba(0,0,0,.9); }')]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        ims = []
        for t, css in G:
            pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
            await pg.evaluate("(css) => { MENU.S.tab = null; MENU.act('mtab', 'Jobs'); MENU.render(true); const s = document.getElementById('spd'); if (s) s.classList.remove('on'); const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }", BASE + css); await pg.wait_for_timeout(300)
            ims.append((t, Image.open(io.BytesIO(await pg.screenshot())).crop((0, 1330, 780, 1688)))); await pg.close()
        await b.close()
    s = Image.new('RGB', (2 * 792, 2 * 398), '#14120e'); d = ImageDraw.Draw(s)
    for i, (t, im) in enumerate(ims): x, y = (i % 2) * 792, (i // 2) * 398; d.text((x + 8, y + 8), t, fill='#e8e4d4', font=F); s.paste(im, (x, y + 40))
    s.save('/home/claude/first-keep/mockups/dock/204-line-glow-mock.png')
asyncio.run(go())
