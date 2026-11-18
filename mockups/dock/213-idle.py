import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
CSS = ".jb .fl, .mline .dot:first-child { text-shadow: 0 0 6px rgba(245,232,200,.45), 0 0 2px rgba(0,0,0,.9); } .mline .dot:first-child { box-shadow: 0 0 10px rgba(245,232,200,.25); } .jb .fl:not(.on) { opacity: .45; text-shadow: none; }"
JS = """([css, n]) => { const s = document.getElementById('spd'); if (s) s.classList.remove('on'); const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
 document.querySelector('.mline .mpath').insertAdjacentHTML('beforeend', '<span class="hint" style="text-align:left;padding-left:6px">tap Build to switch</span>');
 const pm = document.querySelector('.mctl .pm > div'); pm.innerHTML = `<button class="fl" style="flex:auto;font-size:16px;${n ? 'color:var(--g1)' : 'opacity:.55'}">Idle: ${n}</button>`;
 const p = document.querySelector('#base .mt .cell'); p.style.boxShadow = 'inset 0 0 0 2px var(--rb)'; p.innerHTML = '<span class="t" style="display:flex;gap:4px;align-items:center">' + p.querySelector('.t').innerHTML.replace(/\\d+$/, '') + ' 18|35</span><span style="font-size:20px;line-height:1">+</span>'; }"""
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        ims = []
        for t, n in [('nobody idle', 0), ('2 idle: tap to jump to the next', 2)]:
            pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
            await pg.evaluate("() => { MENU.S.tab = null; MENU.act('mtab', 'Jobs'); MENU.render(true); MENU.render = () => {}; }"); await pg.evaluate(JS, [CSS, n]); await pg.wait_for_timeout(200)
            ims.append((t, Image.open(io.BytesIO(await pg.screenshot())).crop((0, 1330, 780, 1688)))); await pg.close()
        await b.close()
    s = Image.new('RGB', (2 * 792, 398), '#14120e'); d = ImageDraw.Draw(s)
    for i, (t, im) in enumerate(ims): d.text((i * 792 + 8, 8), t, fill='#e8e4d4', font=F); s.paste(im, (i * 792, 40))
    s.save('/home/claude/first-keep/mockups/dock/213-idle-mock.png')
asyncio.run(go())
