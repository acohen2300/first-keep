# real screens of the Help card: python3 shots.py <v100 dir> <out.png> [w] [h]
import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
V, OUT = sys.argv[1], sys.argv[2]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 390; H = int(sys.argv[4]) if len(sys.argv) > 4 else 844
PREP = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, T = BOOKS.tech, D = FK.D; MENU.act('start'); await W(400); S.tab = null; MENU.render(true);
 Object.assign(FK.SIDES[0].store, { food: 420, wood: 380, gold: 150, stone: 90, iron: 40 }); FK.SIDES[0].age = 2; const tk = (n) => Object.keys(T).find((c) => T[c].name === n); for (const n of ['Shields', 'Spear wall', 'Fieldcraft', 'Local guides']) { FK.SIDES[0].techs.add(tk(n)); FK.learn(0, tk(n)); }
 const h0 = FK.seatOf(0), bar = Object.keys(D.trains).find((b) => D.trains[b].join() === 'Foot'); out: for (let d = 8; d < 240; d++) for (const [i, j] of [[h0.i + d, h0.j], [h0.i - d, h0.j], [h0.i, h0.j + d], [h0.i, h0.j - d]]) { if (!ECON.canPlace(bar, i, j, 0)) continue; const t = FK.build(bar, i, j, FK.SIDES[0].col); if (t) { t.side = 0; t.done = 1; break out; } }
 FK.pause(true); MENU.render(true); await W(80);
 window.$c = async (sel, txt) => { const e = [...document.querySelectorAll(sel)].find((x) => !txt || x.textContent.startsWith(txt)); if (!e) throw new Error('no ' + sel + ' ' + txt); e.click(); await W(120); }; return 1; })()"""
STEPS = [('The door, under pause', []), ('Tips, a rule read', [('#spd [data-v^="help|"]', ''), ('#base [data-v^="help|sel|"]', 'The crowns')]), ('Units, the Archer read', [('#base .tabs .cell', 'Units'), ('#base [data-v^="help|sel|"]', 'Archer')]),
         ('Buildings, Military', [('#base .tabs .cell', 'Buildings'), ('#base [data-v^="help|grp|"]', 'Military'), ('#base [data-v^="help|sel|"]', 'Barracks')]), ('Research', [('#base .tabs .cell', 'Research')]),
         ('The Barracks tree', [('#base [data-v^="help|sub|"]', 'Barracks'), ('#base [data-v^="help|sel|"]', 'Pike square')]), ('Ages', [('#rank [data-v^="back|"]', ''), ('#base .tabs .cell', 'Ages'), ('#base [data-v^="help|sel|"]', 'Bronze')]), ('Peoples', [('#base .tabs .cell', 'Peoples'), ('#base [data-v^="help|sel|"]', 'Roman')])]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=2); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); await pg.goto('file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'); await pg.wait_for_timeout(1200)
        await pg.evaluate(PREP); shots = []
        for name, clicks in STEPS:
            for sel, txt in clicks: await pg.evaluate('([a, b]) => $c(a, b)', [sel, txt])
            await pg.wait_for_timeout(150); f = f'/tmp/sh{len(shots)}.png'; await pg.screenshot(path=f); shots.append((name, f))
        print(errs[:3]); await b.close()
    ims = [Image.open(f) for _, f in shots]; w, h = ims[0].size; n = len(ims); cols = 4; rws = (n + cols - 1) // cols; sheet = Image.new('RGB', (w * cols + 20 * (cols - 1), (h + 50) * rws), (20, 16, 12)); d = ImageDraw.Draw(sheet)
    for i, (name, _) in enumerate(shots): x, y = (i % cols) * (w + 20), (i // cols) * (h + 50); sheet.paste(ims[i], (x, y + 50)); d.text((x + 10, y + 16), f'{i + 1} {name}', fill=(240, 230, 210), font_size=26)
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
