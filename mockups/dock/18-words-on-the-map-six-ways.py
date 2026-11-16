# sheet: six ways to show a name over the map, on real n65 ground. python3 words.py <v100 dir> <out.png>
import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
V, OUT = sys.argv[1], sys.argv[2]
PREP = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, D = FK.D, SH = BOOKS.shells; MENU.act('start'); await W(400); S.tab = null; MENU.render(true);
 Object.assign(FK.SIDES[0].store, { food: 900, wood: 900, gold: 600, stone: 300, iron: 200 }); FK.SIDES[0].age = 3; const h0 = FK.seatOf(0), made = {};
 for (const n of ['Barracks', 'Stable', 'Siege workshop', 'Lumber camp']) { const c = Object.keys(SH).find((k) => SH[k].name === n); out: for (let d = 8; d < 240; d++) for (const [i, j] of [[h0.i + d, h0.j], [h0.i - d, h0.j], [h0.i, h0.j + d], [h0.i, h0.j - d], [h0.i + d, h0.j + d], [h0.i - d, h0.j - d]]) { if (!ECON.canPlace(c, i, j, 0)) continue; const t = FK.build(c, i, j, FK.SIDES[0].col); if (t) { t.side = 0; t.done = 1; made[n] = t; break out; } } }
 FK.pause(true); window.$made = made; window.$W = W; return Object.keys(made); })()"""
WAYS = [('1 Plain (nothing behind)', 'background:none;border-color:transparent;box-shadow:none', ''),
        ('2 Outline (stroke round each letter)', 'background:none;border-color:transparent;box-shadow:none', '-webkit-text-stroke:3px #1b130c;paint-order:stroke fill'),
        ('3 Halo (soft dark glow)', 'background:none;border-color:transparent;box-shadow:none', 'text-shadow:0 0 3px #000,0 0 5px #000,0 0 8px #000,0 1px 2px #000'),
        ('4 Scrim (dark fade behind the words)', 'background:linear-gradient(90deg,transparent,rgba(20,14,8,.7) 22%,rgba(20,14,8,.7) 78%,transparent);border-color:transparent;box-shadow:none;border-radius:0', ''),
        ('5 Blur (frosted; killed Nov 14)', 'background:rgba(40,30,20,.25);-webkit-backdrop-filter:blur(7px) brightness(.7);backdrop-filter:blur(7px) brightness(.7);box-shadow:none', ''),
        ('6 Plate (today: the pill)', '', '')]
SCENES = [('grass, day', '{}'), ('snow', '{ snow: 1, snowing: 0.6, temp: -4 }'), ('night', '{ light: 0.12, alt: -20 }')]
JS = r"""async ([scene, box, txt]) => { Object.assign(FK.K, { snow: 0, snowing: 0, light: 1, temp: 10 }, scene); MENU.S.subject = $made['Siege workshop']; MENU.render(true); await $W(250);
 const e = document.querySelector('#rank .exec'), s = e.querySelector('span'); e.style.cssText += ';' + box; s.style.cssText += ';' + txt; const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'); await pg.wait_for_timeout(1500); await pg.evaluate(PREP); tiles = {}
        for si, (sn, sc) in enumerate(SCENES):
            for wi, (wn, box, txt) in enumerate(WAYS):
                r = await pg.evaluate('(a) => (' + JS + ')([eval("(" + a[0] + ")"), a[1], a[2]])', [sc, box, txt]); await pg.wait_for_timeout(150)
                f = f'/tmp/mock/w{si}{wi}.png'; await pg.screenshot(path=f); im = Image.open(f); x, y, w, h = [int(v * 3) for v in r]; tiles[(si, wi)] = im.crop((x - 60, y - 96, x + w + 60, y + h + 24))
        print(errs[:3]); await b.close()
    tw, th = tiles[(0, 0)].size; LW = 0; sheet = Image.new('RGB', (tw * 3 + 40, 70 + (th + 60) * 6), (20, 16, 12)); d = ImageDraw.Draw(sheet)
    for si, (sn, _) in enumerate(SCENES): d.text((10 + si * (tw + 10), 18), sn, fill=(217, 169, 58), font_size=34)
    for wi, (wn, _, _) in enumerate(WAYS):
        y = 70 + wi * (th + 60); d.text((10, y + 8), wn, fill=(240, 230, 210), font_size=32)
        for si in range(3): sheet.paste(tiles[(si, wi)], (10 + si * (tw + 10), y + 52))
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
