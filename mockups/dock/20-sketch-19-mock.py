# mock: the dock as two pads (Train left, Learn right). python3 pads.py <v100 dir> <out.png>
import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
V, OUT = sys.argv[1], sys.argv[2]
PREP = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, D = FK.D, SH = BOOKS.shells; MENU.act('start'); await W(400); S.tab = null; MENU.render(true);
 Object.assign(FK.SIDES[0].store, { food: 900, wood: 900, gold: 600, stone: 300, iron: 200 }); FK.SIDES[0].age = 3; const h0 = FK.seatOf(0), made = {};
 for (const n of ['Barracks', 'Stable', 'Siege workshop', 'Lumber camp']) { const c = Object.keys(SH).find((k) => SH[k].name === n); out: for (let d = 8; d < 240; d++) for (const [i, j] of [[h0.i + d, h0.j], [h0.i - d, h0.j], [h0.i, h0.j + d], [h0.i, h0.j - d], [h0.i + d, h0.j + d], [h0.i - d, h0.j - d]]) { if (!ECON.canPlace(c, i, j, 0)) continue; const t = FK.build(c, i, j, FK.SIDES[0].col); if (t) { t.side = 0; t.done = 1; made[n] = t; break out; } } }
 FK.pause(true); window.$made = made; window.$W = W; return Object.keys(made); })()"""
SHOW = r"""async ([n, pads]) => { const S = MENU.S, t = $made[n]; S.subject = t; S.tab = null; S.cpage = 0; MENU.render(true); await $W(150); const H0 = Math.round(document.querySelector('#base').getBoundingClientRect().bottom - document.querySelector('#rank').getBoundingClientRect().top);
 const names = [...document.querySelectorAll('#base .tabs .cell')].map((x) => x.textContent.trim()).filter(Boolean);
 const grab = async (tab) => { const e = [...document.querySelectorAll('#base .tabs .cell')].find((x) => x.textContent.trim() === tab); if (!e) return []; e.click(); await $W(150); return [...document.querySelectorAll('#base .tabs + .row6 > *')].filter((x) => x.tagName !== 'I').map((x) => x.outerHTML); };
 const L = names[0], R = names[1], more = names.length > 2, tr = await grab(L), le = R ? await grab(R) : [], rows = document.querySelectorAll('#base .row6'), E = '<i></i>', pad = (X) => [...X, E, E, E, E, E, E].slice(0, 6), a = pad(tr), b = pad(le);
 rows[0].classList.remove('tabs'); rows[0].innerHTML = [...a.slice(0, 3), ...b.slice(0, 3)].join(''); rows[1].innerHTML = [...a.slice(3), ...b.slice(3)].join('');
 const st = document.createElement('style'); st.textContent = '#base .row6 > *:nth-child(4) { box-shadow: -2px 0 0 #d9a93a; } #base .row6 > i { visibility: visible !important; opacity: .35 } .ptl { display: grid; grid-template-columns: 1fr 1fr; font: 600 12px Barlow, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: #d9a93a; padding: 3px 8px 0; } .ptl b { font-weight: 600 } .ptl span + span { padding-left: 6px } .ptl em { font-style: normal; float: right; color: #f0e6d2; opacity: .8; padding-right: 2px }'; document.head.append(st);
 const h = document.createElement('div'); h.className = 'ptl'; h.innerHTML = `<span>${L}</span><span>${R || ''}</span>`; rows[0].before(h);
 const rk = document.querySelector('#rank'), dots = [...rk.querySelectorAll('.dot')], hd = document.createElement('div'); hd.style.cssText = 'display:flex;align-items:center;gap:16px;padding:4px 8px 0;height:30px'; hd.innerHTML = `<span style="font:600 14px Barlow,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#e8c36a;margin-right:auto">${rk.querySelector('.exec span').textContent}</span>`; hd.append(dots[3], dots[4]); h.before(hd); rk.style.display = 'none'; await $W(60);
 const H1 = Math.round(document.querySelector('#base').getBoundingClientRect().height);
 return [names, tr.length, le.length, 'before ' + H0, 'after ' + H1]; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'); await pg.wait_for_timeout(1500)
        print(await pg.evaluate(PREP)); shots = []
        for n in ['Barracks', 'Stable', 'Siege workshop', 'Lumber camp']:
            for pads in (1,):
                r = await pg.evaluate(SHOW, [n, pads]); await pg.wait_for_timeout(200); f = f'/tmp/mock/s{len(shots)}.png'; await pg.screenshot(path=f); shots.append((f"{n}: {'his sketch of 17:53 (mock)' if pads else 'today (n65)'}", f)); print(n, pads, r)
        print(errs[:3]); await b.close()
    ims = [Image.open(f) for _, f in shots]; w, h = ims[0].size; top = int(h * 0.74); ims = [im.crop((0, top, w, h)) for im in ims]; ch = h - top
    sheet = Image.new('RGB', (w, (ch + 70) * len(ims)), (20, 16, 12)); d = ImageDraw.Draw(sheet)
    for i, (name, _) in enumerate(shots): y = i * (ch + 70); sheet.paste(ims[i], (0, y + 70)); d.text((16, y + 18), name, fill=(240, 230, 210), font_size=36)
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
