# Real screens of N65: each kind of shot in the air, plain and burning. Run: python3 n65_screens.py <v100 dir> <out.png>
import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
V, OUT = sys.argv[1], sys.argv[2]
JS = r"""async ([fire, zoom]) => { const D = FK.D, SH = BOOKS.shells, [ME, foe] = D.players, N = FK.N, byName = (n) => Object.keys(SH).find((c) => SH[c].name === n), T = BOOKS.tech, tk = (k) => Object.keys(T).find((c) => T[c].key === k);
 FK.reset(); Object.assign(FK.K, { rain: 0, snowing: 0, temp: 10 }); FK.pause(true); MENU.S.tab = null; MENU.render(true); const me = FK.SIDES[ME]; if (fire) for (const k of ['firearrows', 'burningshot']) { me.techs.add(tk(k)); FK.learn(ME, tk(k)); }
 const h = FK.seatOf(ME), GAP = 8, ROWS = ['Archer', 'Crossbowman', 'Javelineer', 'Arquebusier', 'Catapult', 'Trebuchet', 'Bombard'];
 const k0 = (() => { for (let d = 16; d < 80; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) if (i > 2 && i + GAP + 2 < N && j > 2 && j + 2 * ROWS.length < N && ROWS.every((_, r) => [0, GAP].every((x) => FK.walkable((j + 2 * r) * N + i + x)))) return j * N + i; })(); if (!k0) return null;
 const us = []; ROWS.forEach((n, r) => { const a = FK.spawn(byName(n), ME, k0 + 2 * r * N, FK.rng), t = FK.spawn(byName('Spearman'), foe, k0 + 2 * r * N + GAP, FK.rng); t.hp = t.hpMax = 1e6; us.push([a, t]); });
 for (const [a, t] of us) WAR.hit(a, t); for (let i = 0; i < 9; i++) FK.sim(0.05);
 const [mx, my] = FK.tileMid(k0 + ROWS.length * N + GAP / 2); FK.cam.z = zoom; FK.camGo ? 0 : 0; const c = FK.cam; const [vx, vy] = FK.toView(mx, my, 0); c.x = c.tx = vx; c.y = c.ty = vy; document.querySelector('#spd').classList.remove('on'); FK.dirty(); await new Promise((r) => setTimeout(r, 400)); return [FK.toScreen(...FK.toView(mx, my, 0))]; }"""
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox']); tiles = []
        for fire in (0, 1):
            for zoom in (1.39, 3, 5):
                pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
                await pg.goto('file://' + V + '/index.html#20261105'); await pg.wait_for_timeout(1200)
                r = await pg.evaluate(JS, [fire, zoom]); await pg.wait_for_timeout(300)
                im = Image.open(io.BytesIO(await pg.screenshot())); print(fire, zoom, r, errs[:2]); full = im; cx, cy = int(r[0][0] * 3), int(r[0][1] * 3) - (120 if zoom < 4 else 330); R = 330 if zoom < 2 else 560 if zoom < 4 else 700; im = im.crop((cx - R, cy - R, cx + R, cy + R)).resize((520, 520), Image.LANCZOS); tiles.append((fire, zoom, im)); await pg.close()
        sheet = Image.new('RGB', (3 * 526 + 6, 2 * 546 + 6), '#20241c'); d = ImageDraw.Draw(sheet)
        for i, (fire, zoom, im) in enumerate(tiles):
            x, y = 6 + (i % 3) * 526, 6 + (i // 3) * 546; sheet.paste(im, (x, y + 20)); d.text((x + 4, y + 4), f"{'burning (Fire arrows, Burning shot learned)' if fire else 'plain'} - zoom {zoom}" + (' (as the game opens)' if zoom < 2 else ''), fill='#e8e4d4')
        sheet.save(OUT); await b.close()
asyncio.run(go())
