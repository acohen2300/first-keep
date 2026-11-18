import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
JS = r"""(T) => { const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)], sp = document.getElementById('spd'); if (sp) sp.classList.remove('on');
 const st = document.createElement('style'); st.textContent = '.gw { margin-left: 0; } .gw::before { content: "→"; color: var(--wdim); padding: 0 4px 0 6px; } .gw button { padding: 0 3px; } .gw button.on { color: var(--rw); text-decoration: underline; text-underline-offset: 2px; } .mt .cell.lit { box-shadow: inset 0 0 0 2px var(--rw); }'; document.head.appendChild(st);
 const fl = (w, c = '') => `<button class="fl ${c}">${w}</button>`, sides = ['Train', 'Learn', 'Talk'];
 const war = q('.mline [data-v^="war|"]'); const line = q('.mline'); const home = line.firstElementChild;
 line.innerHTML = ''; line.append(home); line.insertAdjacentHTML('beforeend', `<div class="mpath" style="display:flex;align-items:center;flex:1;min-width:0"><span class="jb">${fl('Jobs')}<i></i>${fl('Build')}</span><span class="gw">${sides.map((s) => `<button class="${s === T.side ? 'on' : ''}">${s}</button>`).join('<i></i>')}</span></div><button class="dot red wb"><b>W</b></button>`);
 const C = T.crumbs.map((w, i) => `<button class="cb ${i ? '' : 'big'}">${w}</button>`).join('<b class="ar">→</b>');
 q('.mctl').innerHTML = `<div class="row2">${C}<span class="gs"></span><span class="acts">${T.acts.map(([w, c]) => fl(w, c)).join('<i></i>')}</span></div>`;
 if (T.lit != null) { const c = qa('#base .mt .cell')[T.lit]; if (c) c.classList.add('lit', 'sel'); } }"""
ST = [('A. Tap Town Center', "", dict(side='Train', crumbs=['Town Center', 'Train'], acts=[['Repair'], ['Demolish', 'red'], ['Cancel']])),
      ('B. Tap Villager', "", dict(side='Train', crumbs=['Town Center', 'Villager'], acts=[['Train', 'grn'], ['Cancel']], lit=0)),
      ('C. Training (queue in the crumb)', "", dict(side='Train', crumbs=['Town Center', '6 Villagers'], acts=[['Train', 'grn'], ['Stop'], ['Cancel']], lit=0)),
      ('D. Learn', "MENU.act('ctab','Learn');", dict(side='Learn', crumbs=['Town Center', 'Learn'], acts=[['Repair'], ['Demolish', 'red'], ['Cancel']]))]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        ims = []
        for t, js, T in ST:
            pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); E = []; pg.on('pageerror', lambda e: E.append(str(e)))
            await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
            await pg.evaluate("(() => { MENU.S.tab = null; $rich(0); const h = FK.seatOf(0), c = FK.cam; c.x = c.tx = h.vx; c.y = c.ty = h.vy + 40; FK.dirty(); MENU.S.subject = h; " + js + " MENU.render(true); MENU.render = () => {}; })()")
            await pg.evaluate(JS, T); await pg.wait_for_timeout(300)
            ims.append((t, Image.open(io.BytesIO(await pg.screenshot())).crop((0, 1150, 780, 1688)))); print(t, E[:1]); await pg.close()
        await b.close()
    s = Image.new('RGB', (2 * 792, 2 * 578), '#14120e'); d = ImageDraw.Draw(s)
    for i, (t, im) in enumerate(ims): x, y = (i % 2) * 792, (i // 2) * 578; d.text((x + 8, y + 8), t, fill='#e8e4d4', font=F); s.paste(im, (x, y + 40))
    s.save('/tmp/mk/201-card-law.png')
asyncio.run(go())
