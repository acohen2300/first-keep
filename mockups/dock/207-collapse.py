import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
GL = ".jb .fl, .mline .dot:first-child { text-shadow: 0 0 6px rgba(245,232,200,.45), 0 0 2px rgba(0,0,0,.9); } .mline .dot:first-child { box-shadow: 0 0 10px rgba(245,232,200,.25); } .jb .fl:not(.on) { opacity: .45; text-shadow: none; } .hint { flex: auto; text-align: left; padding-left: 6px; }"
SV = 'viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"'
OPEN = f"""() => {{ const m = document.querySelector('.mline'), w = m.querySelector('[data-v^="war|"]'); w.insertAdjacentHTML('beforebegin', '<button class="dot"><svg {SV}><path d="M15 6l-6 6 6 6"/></svg></button>'); }}"""
SHUT = f"""() => {{ const m = document.querySelector('.mline'), home = m.firstElementChild, w = m.querySelector('[data-v^="war|"]'); m.innerHTML = ''; m.append(home); m.insertAdjacentHTML('beforeend', '<button class="dot"><svg {SV}><path d="M12 6v12M6 12h12"/></svg></button><span style="flex:auto"></span>'); m.append(w); document.querySelector('.mctl').innerHTML = ''; document.querySelector('#base .mt').innerHTML = ''; }}"""
SHUT2 = SHUT.replace("m.append(w);", "")
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        ims = []
        for t, js in [('open: ‹ before W', OPEN), ('closed: ⌂ + … W', SHUT), ('closed: ⌂ + only', SHUT2)]:
            pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
            await pg.evaluate("(css) => { MENU.S.tab = null; MENU.act('mtab', 'Jobs'); MENU.render(true); MENU.render = () => {}; const s = document.getElementById('spd'); if (s) s.classList.remove('on'); const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); document.querySelector('.mline .mpath').insertAdjacentHTML('beforeend', '<span class=\"hint\">tap Build to switch</span>'); }", GL)
            await pg.evaluate(js); await pg.wait_for_timeout(200)
            ims.append((t, Image.open(io.BytesIO(await pg.screenshot())).crop((0, 1330, 780, 1688)))); await pg.close()
        await b.close()
    s = Image.new('RGB', (3 * 792, 398), '#14120e'); d = ImageDraw.Draw(s)
    for i, (t, im) in enumerate(ims): d.text((i * 792 + 8, 8), t, fill='#e8e4d4', font=F); s.paste(im, (i * 792, 40))
    s.save('/home/claude/first-keep/mockups/dock/207-collapse-mock.png')
asyncio.run(go())
