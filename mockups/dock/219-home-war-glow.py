import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
CSS = ".mline [data-v^=\"war|\"] { box-shadow: 0 0 12px rgba(229,83,75,.45); } .mline .dot:first-child { box-shadow: 0 0 12px rgba(255,255,255,.4) !important; } .jb .fl, .mline .dot:first-child { text-shadow: 0 0 6px rgba(245,232,200,.45), 0 0 2px rgba(0,0,0,.9); } .mline .dot:first-child { box-shadow: 0 0 10px rgba(245,232,200,.25); } .jb .fl:not(.on) { opacity: .45; text-shadow: none; }"
JS = """([css, n]) => { const s = document.getElementById('spd'); if (s) s.classList.remove('on'); const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
 document.querySelector('.mline .mpath').insertAdjacentHTML('beforeend', '<span class="hint" style="text-align:left;padding-left:6px">tap Build to switch</span>');
 const pm = document.querySelector('.mctl .pm > div'); const IC = { eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', aim: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>', pin: '<path d="M12 21s-7-6.5-7-11a7 7 0 0114 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>' }; pm.style.padding = '0 3px'; pm.innerHTML = `<button class="fl" style="flex:auto;min-width:0;margin:2px 0;height:32px;padding:0 4px;font-size:12px;display:flex;gap:3px;align-items:center;justify-content:center;${n ? 'color:var(--g1);border:1.5px solid var(--g1)' : 'color:var(--wdim);border:1.5px solid var(--wdim)'};border-radius:8px;background:rgba(0,0,0,.25)"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[window.__ic]}</svg>Idle ${n}</button>`;
 const p = document.querySelector('#base .mt .cell'); p.style.boxShadow = 'inset 0 0 0 2px var(--rg)'; p.innerHTML = '<span class="t" style="display:flex;gap:4px;align-items:center">' + p.querySelector('.t').innerHTML.replace(/\\d+$/, '') + ' 18|35</span>Train +'; }"""
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        ims = []
        for t, n, ic in [('Home white, War red', 2, 'pin')]:
            pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
            await pg.evaluate(f"window.__ic = '{ic}'"); await pg.evaluate("() => { MENU.S.tab = null; MENU.act('mtab', 'Jobs'); MENU.render(true); MENU.render = () => {}; }"); await pg.evaluate(JS, [CSS, n]); await pg.wait_for_timeout(200)
            ims.append((t, Image.open(io.BytesIO(await pg.screenshot())).crop((0, 1330, 780, 1688)))); await pg.close()
        await b.close()
    s = Image.new('RGB', (792, 398), '#14120e'); d = ImageDraw.Draw(s)
    for i, (t, im) in enumerate(ims): d.text((i * 792 + 8, 8), t, fill='#e8e4d4', font=F); s.paste(im, (i * 792, 40))
    s.save('/home/claude/first-keep/mockups/dock/219-home-war-glow-mock.png')
asyncio.run(go())
