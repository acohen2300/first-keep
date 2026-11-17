# Mocks of the n67 play-note fixes on the real v100 page. python3 mock.py <v100 dir> <out dir>
import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V, OUT = sys.argv[1], sys.argv[2]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
BOOT = r"""(() => { MENU.S.tab = null; MENU.render(true); const sp = document.getElementById('spd'); if (sp) sp.classList.remove('on');
 const st = FK.SIDES[0].store; for (const r in st) st[r] = 5000; const h = FK.seatOf(0), c = FK.cam, [vx, vy] = [h.vx, h.vy + 60]; c.x = c.tx = vx; c.y = c.ty = vy; FK.dirty(); })()"""
FREEZE = "(() => { MENU.render(true); const sp = document.getElementById('spd'); if (sp) sp.classList.remove('on'); MENU.__r = MENU.render; FK.pause(true); })()"
I = {  # icons drawn in the game's line style
 'build': '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6l4 4M4 20l9-9M12 4l8 8-3 3-8-8z"/></svg>',
 'stop': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
 'gar': '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 20V8l3 2V6l5-3 5 3v4l3-2v12zM10 20v-5h4v5"/></svg>',
}
CSS40 = ":root{--csm:40px} .mctl{height:40px} .dot svg{width:20px;height:20px} .dot.del{color:var(--rr)} .dot.dim{opacity:1}"
CLEAR = ".mctl .tg button.on.T{background:var(--rg);color:var(--ink)} .mctl .tg button.on.L{background:var(--kb);color:var(--ink)} .mt.T .cell{border-color:var(--rg)} .mt.L .cell{border-color:var(--kb)} .mt.T .cell small{color:var(--rg)}"
async def shot(b, setup, patch, css='', y0=560):
    pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.add_init_script(PRE); await pg.goto('file://' + V + '/index.html#20261105'); await pg.wait_for_timeout(1200)
    await pg.evaluate(BOOT); await pg.evaluate('(async () => {' + setup + '})()'); await pg.wait_for_timeout(300); await pg.evaluate(FREEZE)
    if patch or css: await pg.evaluate('([p, css, I]) => { const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); MENU.render = () => {}; (new Function("I", p))(I); }', [patch, css, I])
    await pg.wait_for_timeout(400); im = Image.open(io.BytesIO(await pg.screenshot())); print(len(errs) and errs[:1]); await pg.close(); return im.crop((0, y0 * 2, 780, 1688))
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22) if __import__('os').path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf') else ImageFont.load_default()
def sheet(name, panels):
    W = 780; H = max(p.height for _, p in panels) + 40; s = Image.new('RGB', (len(panels) * (W + 12) - 12, H), '#14120e'); d = ImageDraw.Draw(s)
    for i, (t, p) in enumerate(panels): x = i * (W + 12); d.text((x + 10, 8), t, fill='#e8e4d4', font=F); s.paste(p, (x, 40))
    s.save(f'{OUT}/{name}.png'); print('saved', name)
TC = "FK.select(null); MENU.S.subject = FK.seatOf(0); MENU.render(true);"
VIL = "FK.select([ECON.villagersOf(0)[0]]); MENU.render(true);"
PLACE = "MENU.act('mmode','Build'); MENU.act('pick','BR1'); MENU.render(true);"
WAR = r"""const h = FK.seatOf(0), byName = (n) => Object.keys(FK.SH).find((c) => FK.SH[c].name === n), N = FK.N; let k0 = null; for (let d = 6; d < 30 && !k0; d++) { const k = (h.j + d) * N + h.i; if ([0,1,2,3,4,8].every((x) => FK.walkable(k + x))) k0 = k; }
 const mine = [0,1,2,3].map((x) => FK.spawn(byName('Spearman'), 0, k0 + x, FK.rng)); const foe = FK.spawn(byName('Spearman'), 1, k0 + 8, FK.rng); window.__foe = foe; window.__k0 = k0;
 const [vx, vy] = [foe.vx, foe.vy]; const c = FK.cam; c.x = c.tx = vx; c.y = c.ty = vy - 150; MENU.act('war'); FK.select(mine); MENU.S.ctl.who = 'all'; MENU.render(true);"""
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        q = 'const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];'
        # 1. villager: Build on the villager's line; every tapped button 40
        vnow = await shot(b, VIL, '')
        vfix = await shot(b, VIL, q + r"""const p = q('.mline .mpath'); p.querySelector('.mrd').remove(); qa('.mline .mp').forEach((e) => e.remove());
          const sk = p.querySelector('[data-v^="exitU"]'); for (const [ic, cls] of [['build', ''], ['stop', ''], ['gar', '']]) { const d = document.createElement('button'); d.className = 'dot ' + cls; d.innerHTML = I[ic]; p.insertBefore(d, sk); }
          p.querySelector('.dot').style.cssText = 'color:var(--ink);background:var(--rw);margin-left:auto';""", CSS40)
        vbld = await shot(b, "FK.select(null); MENU.act('mmode','Build'); MENU.render(true);", q + r"""FK.select([ECON.villagersOf(0)[0]]); const p = q('.mline .mpath'); const tg = q('.mctl .tg:not(.grp)'); if (!q('#base .mt .cell')) {} 
          p.innerHTML = '<span class="mn gold">› Villager</span><span class="mrd">picks the site, then builds it</span>';""", CSS40)
        sheet('1-villager-build', [('n67 now', vnow), ('fix: Build ⚒ on the line, icons 40', vfix), ('after the ⚒ tap: Build, villager kept', vbld)])
        # 2. Town Center card: toggle moves right; 40 icons; Train / Learn told apart by colour
        tnow = await shot(b, TC, '')
        mark = q + r"""const t = q('.mctl .tg'); const on = t.querySelector('.on'); if (on) on.classList.add(on.textContent === 'Learn' ? 'L' : 'T'); t.style.marginLeft = 'auto'; q('.mctl .mr').style.marginLeft = '0';"""
        tfix = await shot(b, TC, mark, CSS40 + CLEAR)
        tfixL = await shot(b, TC + "MENU.act('ctab','Learn'); MENU.render(true);", mark, CSS40 + CLEAR)
        sheet('2-building-card', [('n67 now', tnow), ('fix: Train lit green, sits with the card', tfix), ('fix: Learn lit blue', tfixL)])
        # 3. placing a House: ✓ ✕ as pills, hint on the line, locked tiles dim with the age
        pnow = await shot(b, PLACE, '')
        pfix = await shot(b, PLACE, q + r"""const c = q('.mctl'), mr = c.querySelector('.mr'); mr.style.marginLeft = '0'; mr.innerHTML = '<button class="mp" style="color:var(--ink);background:var(--rg);border-color:var(--rg);padding-inline:22px">✓</button><button class="mp" style="color:var(--rw);background:var(--rr);border-color:var(--rr);padding-inline:22px">✕</button>';
          q('.mctl .tg.grp').style.marginRight = '0'; const cells = qa('#base .mt .cell'); cells[0].innerHTML = 'House<small style="color:var(--rg)">30w</small>';
          const age = {Bar: 'Medieval', Theatre: 'Classical', Baths: 'Classical', Aqueduct: 'Classical'}; for (const e of cells.slice(1)) { const n = e.textContent.replace(/Locked.*/, '').trim(); e.innerHTML = n + '<small>' + (age[n] || '') + '</small>'; e.style.opacity = '.45'; }
          q('.mline .mpath').innerHTML = '<span class="mn gold">› House</span><span class="mrd">drag to move · ✓ to place</span>';""", CSS40)
        sheet('3-placing', [('n67 now', pnow), ('fix: ✓ ✕ pills, hint on the line, locked = age', pfix)])
        # 10. attack aiming
        wnow = await shot(b, WAR + "MENU.S.ctl.act = 'attack'; MENU.render(true);", '', '', 380)
        wfix = await shot(b, WAR + "MENU.S.ctl.act = 'attack'; MENU.S.ctl.spot = true; MENU.S.aim = { k: window.__k0 + 8, t: window.__foe }; MENU.S.aimT = performance.now(); MENU.render(true);", q + r"""const a = q('#base .mt [data-v="mord|attack|"]'); a.style.cssText = 'background:var(--rr);border-color:var(--rr);color:var(--rw)';
          q('.mline .mpath').insertAdjacentHTML('beforeend', '<span class="mrd" style="color:var(--rw)">Attack: tap a target</span>');""", CSS40, 380)
        sheet('10-attack-aim', [('n67 now (Attack armed)', wnow), ('fix: Attack lit red, line says what next, red reticle on the foe', wfix)])
        # 11. one font: every word Barlow 14/600; only costs change colour
        ONE = ":root{--title:500 13px 'Barlow Semi Condensed';--head:500 13px 'Barlow Semi Condensed';--first:500 13px 'Barlow Semi Condensed';--second:500 13px 'Barlow Semi Condensed'} .mn.gold{text-shadow:none} .lack{text-decoration:none}"
        f1 = await shot(b, TC, mark, CSS40 + CLEAR + ONE); f2 = await shot(b, PLACE, '', CSS40 + ONE)
        sheet('11-one-font', [('one font 13/500: card', f1), ('one font 13/500: Build', f2)])
        await b.close()
import os
if not os.environ.get("ONLY2"): asyncio.run(go())
SELB = r"""const h = FK.seatOf(0), c = FK.cam; c.x = c.tx = h.vx; c.y = c.ty = h.vy - 40; FK.select(null); MENU.S.subject = h; FK.dirty(); MENU.render(true);"""
RING = r"""const h = FK.seatOf(0), [x, y] = FK.toScreen(h.vx, h.vy), w = h.n * 22 * FK.cam.z;
 document.body.insertAdjacentHTML('beforeend', `<svg style="position:fixed;inset:0;pointer-events:none;z-index:2" width="390" height="844"><ellipse cx="${x}" cy="${y + 14}" rx="58" ry="28" fill="rgba(255,255,255,.08)" stroke="#fff" stroke-width="2.5"/><circle cx="${x - 33.5}" cy="${y - 62.5}" r="22" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${x - 6}" y="${y - 58}" fill="#fff" font-size="12" font-family="Barlow Semi Condensed">tap the book: card opens on Learn</text></svg>`); window.__dbg = [x, y, w, FK.cam.z];"""
async def go2():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        a = await shot(b, SELB, '', '', 300); z = await shot(b, SELB, RING, CSS40 + CLEAR, 300)
        sheet('14-building-picked', [('n67 now: Town Center picked', a), ('fix: picked = white ring; book = a 44 tap spot', z)]); await b.close()
asyncio.run(go2())
