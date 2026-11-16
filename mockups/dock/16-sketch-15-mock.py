# mock: the dock as two pads (Train left, Learn right). python3 pads.py <v100 dir> <out.png>
import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
V, OUT = sys.argv[1], sys.argv[2]
PREP = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, D = FK.D, SH = BOOKS.shells; MENU.act('start'); await W(400); S.tab = null; MENU.render(true);
 Object.assign(FK.SIDES[0].store, { food: 900, wood: 900, gold: 600, stone: 300, iron: 200 }); FK.SIDES[0].age = 3; const h0 = FK.seatOf(0), made = {};
 for (const n of ['Barracks', 'Stable', 'Siege workshop', 'Lumber camp']) { const c = Object.keys(SH).find((k) => SH[k].name === n); out: for (let d = 8; d < 240; d++) for (const [i, j] of [[h0.i + d, h0.j], [h0.i - d, h0.j], [h0.i, h0.j + d], [h0.i, h0.j - d], [h0.i + d, h0.j + d], [h0.i - d, h0.j - d]]) { if (!ECON.canPlace(c, i, j, 0)) continue; const t = FK.build(c, i, j, FK.SIDES[0].col); if (t) { t.side = 0; t.done = 1; made[n] = t; break out; } } }
 FK.pause(true); window.$made = made; window.$W = W; return Object.keys(made); })()"""
SHOW = r"""async ([n, pads]) => { const S = MENU.S, t = $made[n]; S.subject = t; S.tab = null; S.cpage = 0; MENU.render(true); await $W(150);
 const names = [...document.querySelectorAll('#base .tabs .cell')].map((x) => x.textContent.trim()).filter(Boolean);
 const grab = async (tab) => { const e = [...document.querySelectorAll('#base .tabs .cell')].find((x) => x.textContent.trim() === tab); if (!e) return []; e.click(); await $W(150); return [...document.querySelectorAll('#base .tabs + .row6 > *')].filter((x) => x.tagName !== 'I').map((x) => x.outerHTML); };
 const L = names[0], R = names[1], tr = await grab(L), le = R ? await grab(R) : [], rows = document.querySelectorAll('#base .row6'), E = '<i></i>', pad = (X) => [...X, E, E, E, E, E, E].slice(0, 6), lab = (w) => `<div class="rl">${w || ''}</div>`;
 rows[0].classList.remove('tabs'); rows[0].innerHTML = lab(L) + pad(tr).join(''); rows[1].innerHTML = lab(R) + pad(le).join('');
 const st = document.createElement('style'); st.textContent = '#base .row6 { grid-template-columns: 44px repeat(6, 1fr) !important; } #base .row6 > i { visibility: visible !important; opacity: .35 } #base .row6 > * { background-image: none !important } #base .row6 > .cell, #base .row6 > i { box-shadow: -1px 0 0 rgba(255,255,255,.12) } .rl { font: 600 12px Barlow, sans-serif; letter-spacing: .05em; text-transform: uppercase; color: #d9a93a; text-align: center; border-right: 2px solid #d9a93a; margin-right: 6px; align-self: stretch; display: flex; align-items: center; justify-content: center; } #base .cell > .u, #base .cell > small { display: inline-block; white-space: nowrap; transform-origin: center; }'; document.head.append(st); await $W(60);
 let least = 1; for (const c of document.querySelectorAll('#base .row6 > .cell')) { const cw = c.getBoundingClientRect().width - 2; for (const l of c.querySelectorAll(':scope > .u, :scope > small')) { l.style.transform = 'none'; const nat = l.getBoundingClientRect().width, k = Math.min(1, cw / nat); l.style.transform = `scaleX(${k})`; least = Math.min(least, k); } }
 const top = document.querySelector('#rank .ctop'), dots = [...top.querySelectorAll('.dot')], nm = top.querySelector('.exec'); top.innerHTML = ''; top.style.cssText = 'display:flex;gap:15px;align-items:center'; nm.style.cssText = 'flex:0 0 122px;margin-right:auto'; top.append(nm, ...dots);
 return [names, tr.length, le.length, +least.toFixed(2), Math.round(document.querySelector('#base .row6 > .cell').getBoundingClientRect().width)]; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'); await pg.wait_for_timeout(1500)
        print(await pg.evaluate(PREP)); shots = []
        for n in ['Barracks', 'Stable', 'Siege workshop', 'Lumber camp']:
            for pads in (1,):
                r = await pg.evaluate(SHOW, [n, pads]); await pg.wait_for_timeout(200); f = f'/tmp/mock/s{len(shots)}.png'; await pg.screenshot(path=f); shots.append((f"{n}: {'his sketch of 17:35 (mock)' if pads else 'today (n65)'}", f)); print(n, pads, r)
        print(errs[:3]); await b.close()
    ims = [Image.open(f) for _, f in shots]; w, h = ims[0].size; top = int(h * 0.74); ims = [im.crop((0, top, w, h)) for im in ims]; ch = h - top
    sheet = Image.new('RGB', (w, (ch + 70) * len(ims)), (20, 16, 12)); d = ImageDraw.Draw(sheet)
    for i, (name, _) in enumerate(shots): y = i * (ch + 70); sheet.paste(ims[i], (0, y + 70)); d.text((16, y + 18), name, fill=(240, 230, 210), font_size=36)
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
