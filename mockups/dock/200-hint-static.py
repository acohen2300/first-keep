import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
H = "Object.keys(FK.SH).find((c) => FK.SH[c].name === 'House')"
VS = "const u = ECON.villagersOf(0)[0], c = FK.cam; c.x = c.tx = u.vx; c.y = c.ty = u.vy; FK.dirty(); FK.select([u]); "
ST0 = [('1 start', ""), ('2 Jobs', "MENU.act('mtab','Jobs');"), ('3 Build', "MENU.act('mtab','Build');"), ('4 House', f"MENU.act('mtab','Build'); MENU.act('pick', {H});"),
      ('5 villager', VS), ('6 villager Jobs', VS + "MENU.act('mtab','Jobs');"), ('7 + Wood', VS + "MENU.act('mtab','Jobs'); MENU.act('vjob','wood');"), ('8 villager House', VS + f"MENU.act('mtab','Build'); MENU.act('pick', {H});")]
ST = [ST0[0], ST0[2], ST0[4], ST0[5], ST0[7], ST0[3]]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        ims = []
        for t, js in ST:
            pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); E = []; pg.on('pageerror', lambda e: E.append(str(e)))
            await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
            await pg.evaluate("(() => { MENU.S.tab = null; $rich(0); " + js + " MENU.render(true); const s = document.getElementById('spd'); if (s) s.classList.remove('on'); const st = document.createElement('style'); st.textContent = '.hint { flex: auto; text-align: left; padding-left: 6px; } .gw { margin-left: 0; } .gw::before { content: \"→\"; font: italic var(--first); color: var(--wdim); padding: 0 4px 0 6px; } .gw button { padding: 0 3px; } .gw button.on { color: var(--rw); text-decoration: underline; text-underline-offset: 2px; }'; document.head.appendChild(st); const h = document.querySelector('.mline .hint'); if (h && h.textContent === 'choose a task') h.textContent = '← choose a task'; })()"); await pg.wait_for_timeout(300)
            ims.append((t, Image.open(io.BytesIO(await pg.screenshot())).crop((0, 1150, 780, 1688)))); print(t, E[:1]); await pg.close()
        await b.close()
    for n, part in ((1, ims[:3]), (2, ims[3:])):
        s = Image.new('RGB', (3 * 792, 538 + 40), '#14120e'); d = ImageDraw.Draw(s)
        for i, (t, im) in enumerate(part): d.text((i * 792 + 8, 8), t, fill='#e8e4d4', font=F); s.paste(im, (i * 792, 40))
        s.save(f'/tmp/mk/13b-{n}.png')
asyncio.run(go())
