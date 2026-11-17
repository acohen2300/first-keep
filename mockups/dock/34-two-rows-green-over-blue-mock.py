# mock: the building card, the 18:08 layout in a 2027 skin, on n65's real cells. python3 pads10.py <v100 dir> <out.png> <before.png>
import asyncio, sys, os, json
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
V, OUT, BEFORE = sys.argv[1], sys.argv[2], sys.argv[3]
PREP = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, D = FK.D, SH = BOOKS.shells; MENU.act('start'); await W(400); S.tab = null; MENU.render(true);
 Object.assign(FK.SIDES[0].store, { food: 900, wood: 900, gold: 600, stone: 300, iron: 200 }); FK.SIDES[0].age = 3; const h0 = FK.seatOf(0), made = {};
 for (const n of ['Barracks', 'Stable', 'Siege workshop', 'Lumber camp']) { const c = Object.keys(SH).find((k) => SH[k].name === n); out: for (let d = 8; d < 240; d++) for (const [i, j] of [[h0.i + d, h0.j], [h0.i - d, h0.j], [h0.i, h0.j + d], [h0.i, h0.j - d], [h0.i + d, h0.j + d], [h0.i - d, h0.j - d]]) { if (!ECON.canPlace(c, i, j, 0)) continue; const t = FK.build(c, i, j, FK.SIDES[0].col); if (t) { t.side = 0; t.done = 1; made[n] = t; break out; } } }
 FK.pause(true); window.$made = made; window.$W = W; return Object.keys(made); })()"""
CSS = r"""
#base { background: linear-gradient(#3b2b1e, #20160e) !important; border: 0 !important; border-radius: 14px !important; padding: 4px 6px 6px !important; gap: 0 !important; box-shadow: 0 -10px 28px rgba(0,0,0,.32), inset 0 1px 0 rgba(236,229,211,.16) !important; }
.mk-hd { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; height: 29px; padding: 0 2px; }
.mk-l, .mk-r { display: flex; gap: GAPpx; align-items: center; } .mk-r { justify-content: flex-end; }
.mk-n span { font: 18px var(--display); color: var(--g1); position: relative; white-space: nowrap; line-height: 22px; display: inline-block; }
.mk-n span::after { content: ''; position: absolute; left: 1px; right: 1px; bottom: -1px; height: 2px; border-radius: 1px; background: #5fd08a; opacity: .9; }
#base .dot { width: 28px !important; height: 28px !important; border: 0 !important; box-shadow: none !important; flex: 0 0 28px; }
#base .dot:not(.red) { background: rgba(236,229,211,.10) !important; }
.mk-lb { display: grid; grid-template-columns: 1fr 1fr; align-items: end; font: var(--second); color: color-mix(in srgb, var(--g1) 92%, transparent); line-height: 14px; height: 15px; margin-bottom: 3px; position: relative; }
.mk-lb span { padding-left: 5px; } .mk-lb span + span { padding-left: 10px; }
.mk-more { position: absolute; right: 2px; bottom: 0; font: var(--second); line-height: 15px; color: rgba(236,229,211,.8); background: rgba(236,229,211,.10); border: 0; border-radius: 8px; padding: 0 8px; }
#base .row6 { display: grid !important; grid-template-columns: repeat(3, 1fr) 6px repeat(3, 1fr) !important; gap: 2px !important; background: none !important; align-items: stretch !important; }
#base .row6.r1 { margin-top: 2px; }
#base .row6 > .cell, #base .row6 > i { background: rgba(236,229,211,.10) !important; border: 0 !important; border-radius: 3px !important; box-shadow: none !important; height: 44px !important; min-width: 0; padding: 0 !important; margin: 0 !important; visibility: visible !important; opacity: 1 !important; position: relative; display: flex !important; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; box-sizing: border-box; }
#base .row6 > i { background: rgba(236,229,211,.035) !important; }
#base .row6 > b.sp { background: none !important; }
#base .r0 > :nth-child(1), #base .r0 > :nth-child(5) { border-top-left-radius: 10px !important; }
#base .r0 > :nth-child(3), #base .r0 > :nth-child(7) { border-top-right-radius: 10px !important; }
#base .r1 > :nth-child(1), #base .r1 > :nth-child(5) { border-bottom-left-radius: 10px !important; }
#base .r1 > :nth-child(3), #base .r1 > :nth-child(7) { border-bottom-right-radius: 10px !important; }
#base .cell > span, #base .cell > small { display: inline-block; white-space: nowrap; line-height: 14px !important; font: var(--second); transform-origin: center; font-variant-numeric: tabular-nums; }
#base .cell > span { color: #f1eadb; }
#base .cell > small.c, #base .cell > small.u { color: rgba(236,229,211,.6) !important; }
#base .cell.dim { background: rgba(236,229,211,.045) !important; } #base .cell.dim > span, #base .cell.dim > small.u, #base .cell.dim > small.c { opacity: .55; }
#base .cell > svg.rg, #base .cell > i.rk { display: none !important; }
#base .cell.work { background: rgba(95,208,138,.10) !important; }
#base .cell.work::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 2px; background: conic-gradient(#5fd08a calc(var(--p) * 1turn), rgba(95,208,138,.22) 0); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
#base .cell > small.u svg { width: 9px !important; height: 9px !important; }
TIGHT

.pads { position: relative; }
.pads .fr { position: absolute; top: 0; bottom: 0; width: calc(50% - 1.5px); border-radius: 10px; box-sizing: border-box; border: 1.5px solid; pointer-events: none; background: linear-gradient(#ece5d338, #ece5d338) 33.33% 50% / 1px 74% no-repeat, linear-gradient(#ece5d338, #ece5d338) 66.66% 50% / 1px 74% no-repeat, linear-gradient(#ece5d338, #ece5d338) 50% 50% / 92% 1px no-repeat, rgba(236,229,211,.05); }
.pads.R .fr { width: auto; left: 0; right: 0; height: 44px; bottom: auto; border-radius: 12px; background: linear-gradient(#ece5d338, #ece5d338) 16.67% 50% / 1px 70% no-repeat, linear-gradient(#ece5d338, #ece5d338) 33.33% 50% / 1px 70% no-repeat, linear-gradient(#ece5d338, #ece5d338) 50% 50% / 1px 70% no-repeat, linear-gradient(#ece5d338, #ece5d338) 66.67% 50% / 1px 70% no-repeat, linear-gradient(#ece5d338, #ece5d338) 83.33% 50% / 1px 70% no-repeat, rgba(236,229,211,.05); } .pads.R .fr.r { top: auto; bottom: 0; } #base .pads.R .row6 { grid-template-columns: repeat(6, 1fr) !important; } #base .pads.R .row6.r1 { margin-top: 3px !important; }
.pads .fr.l { left: 0; } .pads .fr.r { right: 0; }
#base .pads .row6 { grid-template-columns: repeat(3, 1fr) 3px repeat(3, 1fr) !important; gap: 0 !important; margin-top: 0 !important; }
.mk-hd.padC { display: flex; justify-content: space-between; align-items: center; height: 26px; padding: 0 4px 2px; } .mk-hd.padC .mk-n span::after { left: 0; right: 0; } .mk-hd.padC .mk-r { gap: 14px; } #base .mk-hd.padC .dot { background: none !important; width: 22px !important; height: 22px !important; flex-basis: 22px; }
#base .pads .row6 > .cell, #base .pads .row6 > i, #base .pads .cell.dim { background: none !important; border-radius: 0 !important; }
#base .pads .cell.work { background: rgba(95,208,138,.10) !important; border-radius: 6px !important; }
.mk-hd.padB { display: flex; justify-content: space-between; align-items: center; height: 32px; padding: 0 4px 2px; }
.mk-hd.padA { display: flex; justify-content: space-between; align-items: flex-end; height: auto; padding: 2px 4px 4px; }
.mk-hd.padA .mk-n span::after, .mk-hd.padB .mk-n span::after { left: 0; right: 0; }
.clu { display: grid; grid-template-columns: 28px 28px; gap: 6px 10px; } .mk-hd.padB .mk-r { gap: 8px; }
"""
SHOW = r"""async ([n, opt, css]) => { const S = MENU.S, t = $made[n], W = $W; document.getElementById('mk-style')?.remove(); document.querySelector('#rank').style.display = '';
 const open = async () => { S.subject = t; S.tab = null; S.cpage = 0; MENU.render(true); await W(150); }, tabs = () => [...document.querySelectorAll('#base .tabs .cell')], cells = () => [...document.querySelectorAll('#base .tabs + .row6 > *')].filter((x) => x.tagName !== 'I'), go = async (tab) => { const e = tabs().find((x) => x.textContent.trim() === tab); if (!e) return false; e.click(); await W(150); return true; }, tap = async (word) => { const c = cells().find((x) => x.textContent.trim().startsWith(word)); S.tap = null; if (c) c.click(); await W(120); S.tap = null; };
 await open(); const names = tabs().map((x) => x.textContent.trim()).filter(Boolean), L = names[0], R = names[1];
 if (opt.queue) { for (let q = 0; q < (opt.taps || 1); q++) { await go(opt.queue[0]); await tap(opt.queue[1]); } for (let i = 0; i < opt.secs * 20; i++) FK.sim(0.05); MENU.render(true); await W(120); }
 const grab = async (tab) => ((await go(tab)) ? cells().map((x) => x.outerHTML) : []), tr = await grab(L), le = R ? await grab(R) : [];
 const rows = document.querySelectorAll('#base .row6'), E = '<i></i>', pad6 = (X) => [...X, E, E, E, E, E, E].slice(0, 6), a = pad6(tr), b = pad6(le), SP = '<b class="sp"></b>';
 rows[0].className = 'row6 r0'; rows[1].className = 'row6 r1'; rows[0].innerHTML = [...a.slice(0, 3), SP, ...b.slice(0, 3)].join(''); rows[1].innerHTML = [...a.slice(3), SP, ...b.slice(3)].join('');
 const rk = document.querySelector('#rank'), dots = [...rk.querySelectorAll('.dot')], nm = rk.querySelector('.exec span').textContent, hd = document.createElement('div'), lb = document.createElement('div');
 hd.className = 'mk-hd'; hd.innerHTML = '<div class="mk-l"></div><div class="mk-n"><span></span></div><div class="mk-r"></div>'; hd.querySelector('.mk-n span').textContent = nm;
 if (opt.B) { hd.querySelector('.mk-l').append(dots[0], dots[1], dots[2]); hd.querySelector('.mk-r').append(dots[3], dots[4], dots[5]); } else hd.querySelector('.mk-r').append(dots[3], dots[4]);
 lb.className = 'mk-lb'; lb.innerHTML = `<span>${L}</span><span>${R || ''}</span>` + (opt.B && names[2] ? `<button class="mk-more">${names.slice(2).join(' ')}</button>` : ''); rows[0].before(hd, lb); rk.style.display = 'none';
 if (opt.pad) { lb.remove(); const wrap = document.createElement('div'), COL = { Train: '#5fd08a', Learn: '#2f8cff' }, fr = (side, g) => `<div class="fr ${side}" style="border-color:${COL[g] || 'rgba(236,229,211,.45)'}"></div>`; wrap.className = 'pads' + (opt.rows ? ' R' : ''); if (opt.rows) { rows[0].innerHTML = a.join(''); rows[1].innerHTML = b.join(''); } rows[0].before(wrap); wrap.append(rows[0], rows[1]); wrap.insertAdjacentHTML('beforeend', fr('l', L) + fr('r', R));
  hd.className = 'mk-hd pad' + opt.pad; hd.innerHTML = '<div class="mk-n"><span></span></div>' + (opt.pad === 'A' ? '<div class="clu"></div>' : '<div class="mk-r"></div>'); hd.querySelector('.mk-n span').textContent = nm;
  if (opt.pad === 'A') hd.querySelector('.clu').append(dots[0], dots[5], dots[2], dots[1], dots[3], dots[4]); else if (opt.pad === 'C') hd.querySelector('.mk-r').append(dots[3], dots[4]); else hd.querySelector('.mk-r').append(dots[0], dots[1], dots[2], dots[3], dots[4], dots[5]); }
 const st = document.createElement('style'); st.id = 'mk-style'; st.textContent = css; document.head.append(st); await W(100);
 for (const c of document.querySelectorAll('#base .row6 > .cell')) { const k = c.querySelector(':scope > i.rk[data-rs="run"]'), rr = c.querySelector(':scope > svg.rg .rr'); if (k && rr) { c.classList.add('work'); c.style.setProperty('--p', Math.min(1, parseFloat(rr.getAttribute('stroke-dasharray')) || 1)); } }
 const fits = []; for (const c of document.querySelectorAll('#base .row6 > .cell')) { const cw = c.getBoundingClientRect().width - 4; for (const l of c.querySelectorAll(':scope > span, :scope > small')) { l.style.transform = 'none'; const nat = l.getBoundingClientRect().width, k = Math.min(1, cw / nat); l.style.transform = `scaleX(${k})`; if (k < 1) fits.push([l.textContent.trim(), +k.toFixed(2), Math.round(nat)]); } }
 const one = document.querySelector('#base .row6 > .cell'), sm = [...document.querySelectorAll('#base .cell > small')].find((x) => x.children.length > 1), g = sm ? getComputedStyle(sm) : null, sp = sm ? getComputedStyle(sm.children[1]) : null;
 return { names, tile: +one.getBoundingClientRect().width.toFixed(1), card: Math.round(document.querySelector('#base').getBoundingClientRect().height), fits: fits.sort((x, y) => x[1] - y[1]), gap: g ? [g.display, g.gap, sp.marginLeft, sp.paddingLeft, g.wordSpacing] : null, nameW: Math.round(hd.querySelector('.mk-n span').getBoundingClientRect().width) }; }"""
PANELS = [('Stable', 'Stable (Chariot x2 in training)', {'pad': 'C', 'rows': 1, 'queue': ['Train', 'Chariot'], 'secs': 5, 'taps': 2}),
          ('Barracks', 'Barracks (Shields being researched)', {'pad': 'C', 'rows': 1, 'queue': ['Learn', 'Shields'], 'secs': 9}),
          ('Siege workshop', 'Siege workshop (the Bombard not affordable)', {'pad': 'C', 'rows': 1}),
          ('Lumber camp', 'Lumber camp (Learn blue; Plant has no colour yet)', {'pad': 'C', 'rows': 1})]
async def main():
    tight = sys.argv[4] if len(sys.argv) > 4 else ''
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files']); shots = []
        for n, title, opt in PANELS:
            pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'); await pg.wait_for_timeout(1500); await pg.evaluate(PREP)
            css = CSS.replace('GAPpx', '8px' if opt.get('B') else '12px').replace('TIGHT', tight)
            r = await pg.evaluate(SHOW, [n, opt, css]); await pg.wait_for_timeout(200); f = f'/tmp/mock/p10_{len(shots)}.png'; await pg.screenshot(path=f); low = [x[1] for x in r['fits'] if x[1] < 1]; shots.append((f"{title}", f"card {r['card']} px, tile {r['tile']} px, text squeezed to {min(low):.2f}", f)); print(n, r['card'], r['tile'], [x for x in r['fits'] if x[1] < .77], errs[:2]); await pg.close()
        await b.close()
    CH = 520; ims = [Image.open(f) for _, _, f in shots]; w, h = ims[0].size
    sheet = Image.new('RGB', (w, (CH + 110) * len(ims)), (16, 12, 9)); d = ImageDraw.Draw(sheet)
    for i, (title, sub, _) in enumerate(shots): y = i * (CH + 110); d.text((18, y + 16), title, fill=(236, 229, 211), font_size=30); d.text((18, y + 60), sub, fill=(190, 180, 160), font_size=28); sheet.paste(ims[i].crop((0, h - CH, w, h)), (0, y + 110))
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
