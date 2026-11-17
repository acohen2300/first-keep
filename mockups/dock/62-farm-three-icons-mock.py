# mock 62 = mock 61 with a third circle, send a villager (Albert, Nov 17 07:19), drawn with the Jobs dock's own People icon; order: villager, Repair, Demolish
# mock: tap a Farm and get only two icons, Repair and Demolish, with no bar and no card (Albert, Nov 17 07:18). Two places: (1) in the empty middle of the Jobs strip, as two of its own circles; (2) floating by the building on the map.
# The Jobs strip and dock are the game's own, untouched. The ring round the farm is drawn by the mock. python3 61-...py <v100 dir> <out.png>
import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
V, OUT = sys.argv[1], sys.argv[2]
JS = r"""async (mode) => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, SH = BOOKS.shells, me = FK.SIDES[0]; MENU.act('start'); await W(400); S.tab = null; MENU.render(true); Object.assign(me.store, { food: 900, wood: 900, gold: 600, stone: 300, iron: 200 }); me.age = 3;
 const c = Object.keys(SH).find((k) => SH[k].name === 'Farm'), h0 = FK.seatOf(0); let t = null, at = null; out: for (let d = 5; d < 120; d++) for (const [i, j] of [[h0.i + d, h0.j], [h0.i - d, h0.j], [h0.i, h0.j + d], [h0.i, h0.j - d]]) { if (!ECON.canPlace(c, i, j, 0)) continue; t = FK.build(c, i, j, me.col); if (t) { t.side = 0; t.done = 1; at = [i, j]; break out; } }
 FK.pause(true); S.subject = null; S.tab = null; MENU.render(true); const N = FK.N, [mx, my] = FK.tileMid(at[1] * N + at[0]), cam = FK.cam; cam.z = 3; const [vx, vy] = FK.toView(mx, my, 0); cam.x = cam.tx = vx; cam.y = cam.ty = vy; FK.dirty(); await W(500);
 const [sx, sy] = FK.toScreen(...FK.toView(mx, my, 0)), dots = [...document.querySelectorAll('#rank .dot')], r3 = dots[2].getBoundingClientRect(), r4 = dots[3].getBoundingClientRect(), rk = document.querySelector('#rank').getBoundingClientRect();
 const WR = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9l-3.8 3.8z"/></svg>', TR = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ff6b5b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>';
 const ring = document.createElement('div'); ring.style.cssText = `position:fixed;left:${sx - 34}px;top:${sy - 26}px;width:68px;height:44px;border:2px solid #6aaeff;border-radius:50%;pointer-events:none;z-index:5`; document.body.append(ring);
 const mk = (svg, x, y, size) => { const d = dots[2].cloneNode(true); d.innerHTML = svg; d.classList.remove('on', 'gold'); d.style.cssText = `position:fixed;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;z-index:6;margin:0`; document.body.append(d); return d; };
 const gap = r4.left - r3.right, size = r3.width, pv = document.querySelector('#base .cell svg'), PP = pv ? pv.outerHTML : WR;
 if (mode === 'strip') { const cx = (r3.right + r4.left) / 2, cy = rk.top + rk.height / 2; mk(PP, cx - size - 10, cy, size); mk(WR, cx, cy, size); mk(TR, cx + size + 10, cy, size); }
 else { mk(PP, sx - 50, sy - 62, 40); mk(WR, sx, sy - 62, 40); mk(TR, sx + 50, sy - 62, 40); }
 await W(200); return { gap: Math.round(gap), dot: Math.round(size), farm: [Math.round(sx), Math.round(sy)], rank: [Math.round(rk.top), Math.round(rk.height)] }; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files']); shots = []
        for title, sub, mode in (('Tap a Farm: three circles in the Jobs strip', 'send a villager, Repair, Demolish, in the strip\'s empty middle', 'strip'),):
            pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'); await pg.wait_for_timeout(1500); r = await pg.evaluate(JS, mode); await pg.wait_for_timeout(300); f = f'/tmp/mock/f61_{mode}.png'; await pg.screenshot(path=f); print(mode, r, errs[:2]); shots.append((title, sub, f)); await pg.close()
        await b.close()
    CH = 900; ims = [Image.open(f) for _, _, f in shots]; w, h = ims[0].size; sheet = Image.new('RGB', (w, (CH + 104) * len(ims)), (16, 12, 9)); d = ImageDraw.Draw(sheet)
    for i, (title, sub, _) in enumerate(shots): y = i * (CH + 104); d.text((18, y + 14), title, fill=(236, 229, 211), font_size=30); d.text((18, y + 56), sub, fill=(190, 180, 160), font_size=26); sheet.paste(ims[i].crop((0, h - CH, w, h)), (0, y + 104))
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
