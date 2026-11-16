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
 const st = document.createElement('style'); st.textContent = ' #base .row6 > i { visibility: visible !important; opacity: .35 } .ptl { display: grid; grid-template-columns: 1fr 1fr; font: 600 12px Barlow, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: #d9a93a; padding: 3px 8px 0; } .ptl b { font-weight: 600 } .ptl span + span { padding-left: 6px } .ptl em { font-style: normal; float: right; color: #f0e6d2; opacity: .8; padding-right: 2px }'; document.head.append(st);
 const h = document.createElement('div'); h.className = 'ptl'; h.innerHTML = `<span>${L}</span><span>${R || ''}</span>`; rows[0].before(h);
 const rk = document.querySelector('#rank'), dots = [...rk.querySelectorAll('.dot')], hd = document.createElement('div'); hd.style.cssText = 'display:flex;align-items:center;gap:16px;padding:4px 8px 0;height:30px'; const ns = rk.querySelector('.exec span'), cs = getComputedStyle(ns), tt = document.createElement('span'); tt.textContent = ns.textContent; Object.assign(tt.style, { fontFamily: cs.fontFamily, fontSize: '18px', fontVariant: cs.fontVariant, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform, color: '#e8c36a', marginRight: 'auto' }); hd.append(tt); const lab = (w) => { const e = document.createElement('span'); e.textContent = w || ''; e.style.cssText = 'font:600 12px Barlow,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#d9a93a'; return e; }, lh = document.createElement('div'), rh = document.createElement('div'); lh.style.cssText = 'flex:1 1 0;display:flex;align-items:baseline;gap:8px;min-width:0'; rh.style.cssText = 'flex:1 1 0;display:flex;align-items:center;gap:12px;padding-left:9px'; tt.style.marginRight = '0'; tt.style.whiteSpace = 'nowrap'; lh.append(tt, lab(L)); const rl = lab(R); rl.style.marginRight = 'auto'; rh.append(rl, dots[3], dots[4]); hd.innerHTML = ''; hd.style.gap = '0'; hd.style.padding = '2px 4px 0'; hd.append(lh, rh); h.before(hd); h.remove(); rk.style.display = 'none'; await $W(60);
 const st2 = document.createElement('style'); st2.textContent = '#base { background: linear-gradient(#4a3524, #20150d) !important; border: 1px solid #7a6440 !important; border-radius: 10px !important; padding: 2px 6px 7px !important; } #base .row6 { gap: 4px !important; grid-template-columns: repeat(3, 1fr) 6px repeat(3, 1fr) !important; margin-top: 4px; background: none !important; } #base .row6 > * { background: linear-gradient(#45321f, #2b1d13) !important; border: 1px solid #7a6440 !important; border-radius: 6px !important; box-shadow: none !important; box-sizing: border-box; height: 46px; } #base .row6 > i { opacity: .45 !important; border-style: dashed !important; } #base .row6 > b.sp { background: none !important; border: 0 !important; } .ptl { grid-template-columns: 1fr 1fr !important; padding: 2px 4px 0 !important; } .ptl span + span { padding-left: 9px !important; } #base .cell > .u, #base .cell > small { display: inline-block; white-space: nowrap; transform-origin: center; }'; document.head.append(st2);
 for (const r of document.querySelectorAll('#base .row6')) { const sp = document.createElement('b'); sp.className = 'sp'; r.insertBefore(sp, r.children[3]); } await $W(80);
 let least = 1; for (const c of document.querySelectorAll('#base .row6 > .cell')) { const cw = c.getBoundingClientRect().width - 4; for (const l of c.querySelectorAll(':scope > .u, :scope > small')) { l.style.transform = 'none'; const nat = l.getBoundingClientRect().width, k = Math.min(1, cw / nat); l.style.transform = `scaleX(${k})`; least = Math.min(least, k); } }
 const TW = Math.round(document.querySelector('#base .row6 > .cell').getBoundingClientRect().width);
 const H1 = Math.round(document.querySelector('#base').getBoundingClientRect().height);
 return [names, tr.length, le.length, 'before ' + H0, 'after ' + H1, 'least ' + least.toFixed(2), 'tile ' + TW]; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'); await pg.wait_for_timeout(1500)
        print(await pg.evaluate(PREP)); shots = []
        for n in ['Barracks', 'Stable', 'Siege workshop', 'Lumber camp']:
            for pads in (1,):
                r = await pg.evaluate(SHOW, [n, pads]); await pg.wait_for_timeout(200); f = f'/tmp/mock/s{len(shots)}.png'; await pg.screenshot(path=f); shots.append((f"{n}: {'condensed: one header line (mock)' if pads else 'today (n65)'}", f)); print(n, pads, r)
        print(errs[:3]); await b.close()
    ims = [Image.open(f) for _, f in shots]; w, h = ims[0].size; top = int(h * 0.74); ims = [im.crop((0, top, w, h)) for im in ims]; ch = h - top
    sheet = Image.new('RGB', (w, (ch + 70) * len(ims)), (20, 16, 12)); d = ImageDraw.Draw(sheet)
    for i, (name, _) in enumerate(shots): y = i * (ch + 70); sheet.paste(ims[i], (0, y + 70)); d.text((16, y + 18), name, fill=(240, 230, 210), font_size=36)
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
