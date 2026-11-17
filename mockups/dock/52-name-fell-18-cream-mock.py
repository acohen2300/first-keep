# mock 52 = mock 51 with the name at 18 (Albert, Nov 17 06:15), his Nov 9 title size
# mock 51 = mock 50 with the name at 17 and cream (Albert, Nov 17 06:14)
# mock 50 = mock 48 with the building's name back in IM Fell 16, grey, and at the left where a selected thing's name sits (Albert, Nov 17 06:11)
# mock 49 = mock 48 with the building's name in Barlow 14/600, cream (Albert, Nov 17 06:01)
# mock 48 = mock 47 with a small ring round Home, as the Jobs page's circle has (Albert, Nov 17 05:59): 30 px across, the icon 16
# mock 47 = mock 46 with the game's own Home icon at the strip's left, as a bare mark (Albert, Nov 17 05:55: "so it's clear home is everywhere on all pages"); the marks and the button are a little narrower to make its room
# mock 46 = mock 45 held to the Jobs dock's exact footprint (Albert, Nov 17 05:33: "If I wanted to keep a static foot print"): the twelve cells fill the dock's own box; the reading line and the name move up into the strip of circles' own rectangle; no header, no bottom line. The Jobs dock's two rectangles are measured first and the card is set to them.
# mock 45 = mock 44 with a cell's name wearing the colour the game gives its cost today (red to white to green as he can afford it; Albert, Nov 17 05:27): no dim for a cell he cannot afford; a locked cell alone stays dim
# mock 44 = mock 43's A (Albert, Nov 17 05:25: "I like a also") with the bottom line saying why a selected cell cannot be bought: the cost parts he is short of in red, or the game's own reason (VERBS.<verb>.whyNot) in place of the numbers; the button dim
# mock 43 = mock 42 with divider lines in place of tiles (Albert, Nov 17 05:20), two ways: A a tinted panel a row with inset dividers; B one plain panel with cross dividers, colour on the rings only
# mock 42 = mock 41 with the name centred on the card (Albert, Nov 17 05:18); back and close stay at the right
# mock 41 = mock 38 with the name in IM Fell 16, grey, on a 22 px line (Albert, Nov 17 05:14: option 3 at 16) and the bottom line tightened (40 to 34 px, its button 28 to 26)
# mock 38 = mock 37 with Albert's three changes (Nov 17 05:02): a queued cell that waits wears the faint track only; the selected name is not bold; the card's, cells' and button's corners are less round (card 16 to 8, cell 10 to 4, button 14 to 6)
# mock 37 = mock 36 with "selected" as a solid ring (green on Train, blue on Learn) that recedes clockwise while the cell works (Albert, Nov 17 04:57)
# mock 36 = mock 35 with a unit's three numbers, its train time and its "beats" mark on the reading line (Albert, Nov 17 04:52: "Why don't you just add the stats to the bottom row?")
# mock: the building card as two rows of six (Train over Learn), a picture and a name a cell, one reading line under them (Claude's proposal, Nov 16 22:45; Albert, Nov 17 04:45: "as we normally do in a game screen").
# On n65's real page and data. python3 35-...py <v100 dir> <out.png>
import asyncio, sys, os, re
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
V, OUT = sys.argv[1], sys.argv[2]
PREP = re.search(r'PREP = r"""(.*?)"""', open(os.path.join(V, '../../mockups/dock/34-two-rows-green-over-blue-mock.py')).read(), re.S).group(1)
CSS = r"""
#base { background: #1c1813 !important; border: 0 !important; border-radius: 8px !important; padding: 2px 6px 2px !important; gap: 0 !important; box-shadow: 0 -8px 24px rgba(0,0,0,.30) !important; display: block !important; font-family: var(--ui); }
.k-hd { position: relative; display: flex; justify-content: flex-end; align-items: center; height: 22px; padding: 0 4px; } .k-hd b { position: absolute; left: 50%; transform: translateX(-50%); }
.k-hd b { font: 16px var(--display); color: #a39a86; font-weight: 400; line-height: 19px; }
.k-hd span { display: flex; gap: 18px; } .k-hd svg { width: 16px; height: 16px; stroke: #a39a86; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.k-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; margin-bottom: 4px; }
.k-c { position: relative; height: 44px; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; overflow: hidden; box-sizing: border-box; }
.k-c img { height: 24px; width: auto; image-rendering: auto; display: block; margin-top: -1px; }
.k-c span { font: 400 12px/13px var(--ui); color: #ece5d3; white-space: nowrap; display: inline-block; transform-origin: center; text-align: center; }
.k-c.two span { white-space: normal; line-height: 14px; padding: 0 2px; }
.k-row.T .k-c { background: rgba(95,208,138,.16); } .k-row.L .k-c { background: rgba(106,174,255,.16); }
.k-row .k-c.dim { background: rgba(236,229,211,.06); } .k-c.dim span { color: #a39a86; } .k-c.dim img { opacity: .55; }
.k-row .k-c.none { background: rgba(236,229,211,.03); }
.k-row.T { --rc: #5fd08a; --rt: rgba(95,208,138,.22); } .k-row.L { --rc: #6aaeff; --rt: rgba(106,174,255,.22); } .k-c.wait::before { background: var(--rt) !important; }
.k-c.work::before, .k-c.sel::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; background: conic-gradient(var(--rt) calc((1 - var(--p, 1)) * 1turn), var(--rc) 0); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
.k-c em { position: absolute; right: 5px; top: 2px; font: 600 12px/13px var(--ui); font-style: normal; color: var(--rc); }
#base { padding: 4px 6px !important; box-sizing: border-box !important; } .k-row { margin-bottom: 3px !important; } .k-row.L { margin-bottom: 0 !important; }
#rank { display: flex !important; position: relative; align-items: center; gap: 8px; box-sizing: border-box !important; background: #1c1813 !important; border-radius: 8px !important; padding: 0 2px 0 7px !important; font-family: var(--ui); gap: 7px !important; } .s-h { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; flex: 0 0 30px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid rgba(236,229,211,.38); background: rgba(236,229,211,.06); } .s-h svg { width: 16px !important; height: 16px !important; stroke: #ece5d3; }
.s-t { font: 18px var(--display); color: #ece5d3; white-space: nowrap; }
.s-l { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 1px; } .s-l b { font: 600 14px/17px var(--ui); color: #ece5d3; white-space: nowrap; } .s-2 { font: 400 12px/14px var(--ui); color: #a39a86; white-space: nowrap; overflow: hidden; }
.s-l b s { text-decoration: none; margin-left: 3px; } .s-l b s b { color: #ff6b5b; font: 600 14px var(--ui); } .s-l b s svg { width: 13px; height: 13px; vertical-align: -2px; stroke: #e6b947; }
.s-l q { quotes: none; display: flex; gap: 7px; align-items: center; color: #ece5d3; } .s-l q::before, .s-l q::after { content: none; } .s-l q span { display: inline-flex; align-items: center; gap: 1px; } .s-l q svg { width: 11px; height: 11px; stroke: #a39a86; } .s-l em.why { font-style: normal; color: #ff6b5b; }
.s-c { text-decoration: none; display: flex; gap: 5px; font: 600 12px var(--ui); color: #5fd08a; white-space: nowrap; } .s-b { height: 30px; padding: 0 11px; border: 0; border-radius: 6px; font: 600 14px var(--ui); }
.s-m { display: flex; } .s-m svg { width: 16px; height: 16px; padding: 0 6px; stroke: #a39a86; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.k-rd { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 4px; margin-top: -1px; }
.k-rd b { font: 600 14px var(--ui); color: #ece5d3; white-space: nowrap; } .k-rd i { font: 400 12px var(--ui); font-style: normal; color: #a39a86; flex: 1; white-space: nowrap; overflow: hidden; }
.k-rd b s { text-decoration: none; margin-left: 3px; } .k-rd b s b { color: #ff6b5b; font-weight: 600; } .k-rd b s svg { width: 13px; height: 13px; vertical-align: -2px; stroke: #e6b947; }
.k-rd q { quotes: none; display: flex; gap: 7px; align-items: center; color: #ece5d3; } .k-rd q::before, .k-rd q::after { content: none; } .k-rd q span { display: inline-flex; align-items: center; gap: 1px; } .k-rd q svg { width: 11px; height: 11px; stroke: #a39a86; }
.k-rd em.why { font-style: normal; color: #ff6b5b; }
.k-rd u { text-decoration: none; display: flex; gap: 5px; font: 600 12px var(--ui); white-space: nowrap; }
.k-rd button { height: 26px; padding: 0 16px; border: 0; border-radius: 6px; font: 600 14px var(--ui); color: #100c08; }
"""
SHOW = r"""async ([opt, css]) => { const S = MENU.S, t = $made['Stable'], W = $W, SH = BOOKS.shells, M = BOOKS.measure, mv = (k) => Object.values(M).find((e) => e.key === k).value;
 const open = async () => { S.subject = t; S.tab = null; S.cpage = 0; MENU.render(true); await W(150); }, tabs = () => [...document.querySelectorAll('#base .tabs .cell')], cells = () => [...document.querySelectorAll('#base .tabs + .row6 > *')].filter((x) => x.tagName !== 'I'), go = async (tab) => { const e = tabs().find((x) => x.textContent.trim() === tab); if (!e) return false; e.click(); await W(150); return true; }, tap = async (word) => { const c = cells().find((x) => x.textContent.trim().startsWith(word)); S.tap = null; if (c) c.click(); await W(120); S.tap = null; };
 S.subject = null; S.tab = null; MENU.render(true); await W(200); const rc = (q) => { const r = document.querySelector(q).getBoundingClientRect(); return { top: +r.top.toFixed(1), height: +r.height.toFixed(1), left: +r.left.toFixed(1), width: +r.width.toFixed(1) }; }, J = { rank: rc('#rank'), base: rc('#base') };
 if (opt.store) Object.assign(FK.SIDES[0].store, opt.store); await open(); for (const [tab, word, n, secs] of opt.queue || []) { for (let q = 0; q < n; q++) { await go(tab); await tap(word); } for (let i = 0; i < secs * 20; i++) FK.sim(0.05); MENU.render(true); await W(120); }
 const read = (el) => { const sp = el.querySelector(':scope > span').cloneNode(true); sp.querySelectorAll('b, svg').forEach((x) => x.remove()); const sm = [...el.querySelectorAll(':scope > small')], cs = sm.filter((s) => !s.classList.contains('u') && !s.classList.contains('c')).pop(), [verb, code] = (el.dataset.v || '').split('|'), rr = el.querySelector(':scope > svg.rg .rr'), run = el.querySelector(':scope > i.rk[data-rs="run"]'), cn = [...el.querySelectorAll('*')].find((e) => /^×\d+$/.test(e.textContent.trim())), cnt = cn ? cn.textContent.trim().slice(1) : null;
  const f = el.querySelector(':scope > span'), bt = f ? [...f.querySelectorAll(':scope > b, :scope > svg')].map((x) => x.outerHTML).join('') : '', mu = el.querySelector(':scope > small.u');
  return { beats: bt, stats: mu ? mu.innerHTML : '', name: sp.textContent.trim(), verb, code, dim: el.classList.contains('dim'), cost: cs ? [...cs.querySelectorAll('span')].map((x) => x.textContent.trim()).filter((x) => /^\d/.test(x)) : [], col: cs ? getComputedStyle(cs).color : '', fx: (el.querySelector(':scope > small.c') || {}).textContent || '', raw: rr ? [rr.getAttribute('stroke-dasharray'), rr.getAttribute('pathLength'), rr.getTotalLength ? Math.round(rr.getTotalLength()) : 0] : null, work: run && rr ? (() => { const a = parseFloat(rr.getAttribute('stroke-dasharray')), pl = parseFloat(rr.getAttribute('pathLength')) || (a > 1 && rr.getTotalLength ? rr.getTotalLength() : 1); return Math.max(0, Math.min(1, (isNaN(a) ? 1 : a) / pl)); })() : null, cnt, html: el.outerHTML.length }; };
 await go('Train'); const tr = cells().map(read); await go('Learn'); const le = cells().map(read); const base = document.querySelector('#base'), was = Math.round(base.getBoundingClientRect().height + document.querySelector('#rank').getBoundingClientRect().height + 6);
 const pic = (c) => { try { const cv = FK.figure(SH[c].look, FK.SIDES[0].col, 0, 0, 3, 0); return cv.toDataURL(); } catch (e) { return ''; } }, secs = mv('train');
 const lockOf = (x) => { let w = ''; try { w = MENU.VERBS[x.verb].whyNot(x.code, x.verb === 'train' ? t : undefined) || ''; } catch (e) {} return w && !/^Needs /.test(w) ? w : ''; };
 const cell = (x, row) => { if (!x) return '<div class="k-c none"></div>'; x.dim = !!lockOf(x); const p = row === 'T' ? pic(x.code) : '', sel = x.name === opt.sel; return `<div class="k-c ${p ? '' : 'two'} ${x.dim ? 'dim' : ''} ${sel ? 'sel' : ''} ${x.work != null ? 'work' : ''} ${x.work != null && x.work >= 1 ? 'wait' : ''}" ${x.work != null ? `style="--p:${x.work}"` : ''}>${p ? `<img src="${p}">` : ''}<span style="color:${x.dim ? '#a39a86' : x.col || '#ece5d3'}">${x.name}</span>${x.cnt ? `<em>×${x.cnt}</em>` : ''}</div>`; };
 const six = (X) => [...X, null, null, null, null, null, null].slice(0, 6), all = [...tr.map((x) => [x, 'T']), ...le.map((x) => [x, 'L'])], [s, sr] = all.find(([x]) => x.name === opt.sel) || (opt.sel ? all[0] : [{ none: true, cost: [], verb: 'train', code: tr[0].code, name: '', stats: '', beats: '', fx: '', col: '' }, 'T']);
 const RK = { f: 'food', w: 'wood', g: 'gold', s: 'stone', i: 'iron' }, have = FK.SIDES[0].store, shortOf = s.cost.filter((c) => (have[RK[c.slice(-1)]] || 0) < parseFloat(c)); let why = ''; try { why = MENU.VERBS[s.verb].whyNot(s.code, s.verb === 'train' ? t : undefined) || ''; } catch (e) { why = 'ERR ' + e.message; } const blocked = shortOf.length || why;
 const line0 = sr === 'T' ? (s.stats ? `<q>${s.stats}<span>${secs[s.code]}s</span></q>` : `Trains in ${secs[s.code]} s`) : s.fx, acc = sr === 'T' ? '#5fd08a' : '#6aaeff', line = why && !shortOf.length ? `<em class="why">${why}</em>` : line0;
 const H = J.base.height, ch = Math.floor((H - 8 - 3) / 2), rk = document.querySelector('#rank'), hs = rk.querySelector('.dot svg'), home = `<span class="s-h">${hs ? hs.outerHTML : ''}</span>`, marks = '<span class="s-m"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></span>';
 base.innerHTML = `<div class="k-row T">${six(tr).map((x) => cell(x, 'T')).join('')}</div><div class="k-row L">${six(le).map((x) => cell(x, 'L')).join('')}</div>`; base.style.setProperty('height', H + 'px', 'important'); rk.style.setProperty('height', J.rank.height + 'px', 'important');
 rk.innerHTML = s.none ? `${home}<div class="s-t">Stable</div><div style="flex:1"></div>${marks}` : `${home}<div class="s-l"><b>${s.name}<s>${sr === 'T' ? s.beats : ''}</s></b><div class="s-2">${line}</div></div><u class="s-c" style="${why && !shortOf.length ? 'display:none' : ''}">${s.cost.map((c) => `<span ${shortOf.includes(c) ? 'style="color:#ff6b5b"' : ''}>${c}</span>`).join('')}</u><button class="s-b" style="background:${blocked ? 'rgba(236,229,211,.12)' : acc};color:${blocked ? '#a39a86' : '#100c08'}">${sr === 'T' ? 'Train' : 'Learn'}</button>${marks}`;
 const st = document.createElement('style'); st.textContent = css + (opt.hd || '') + `.k-c { height: ${ch}px !important; }`; document.head.append(st); await W(250);
 const fits = []; for (const l of document.querySelectorAll('.k-c:not(.two) span')) { const cw = l.parentElement.getBoundingClientRect().width - 4, nat = l.getBoundingClientRect().width, k = Math.min(1, cw / nat); l.style.transform = `scaleX(${k})`; if (k < 1) fits.push([l.textContent, +k.toFixed(2)]); }
 const sl = rk.querySelector('.s-l'), over = sl ? Math.max(...[...sl.children].map((e) => e.scrollWidth - sl.clientWidth)) : 0, N = { rank: rc('#rank'), base: rc('#base') };
 const hb = rk.querySelector('.s-h').getBoundingClientRect(); return { homeW: Math.round(hb.width), room: sl ? Math.round(sl.clientWidth) : null, need: sl ? Math.max(...[...sl.children].map((e) => e.scrollWidth)) : null, J, N, ch, over, why, was: Math.round(J.base.top + J.base.height - J.rank.top), card: Math.round(N.base.top + N.base.height - N.rank.top), tile: +document.querySelector('.k-c').getBoundingClientRect().width.toFixed(1), fits }; }"""
A = ".k-row { gap: 0 !important; border-radius: 4px; } .k-row.T { background: rgba(95,208,138,.13); } .k-row.L { background: rgba(106,174,255,.13); } .k-row .k-c, .k-row .k-c.dim, .k-row .k-c.none { background: none !important; } .k-c + .k-c::after { content: ''; position: absolute; left: 0; top: 16%; height: 68%; width: 1px; background: rgba(236,229,211,.16); }"
B = ".k-row { gap: 0 !important; background: rgba(236,229,211,.055) !important; margin-bottom: 0 !important; position: relative; } .k-row.T { border-radius: 4px 4px 0 0; } .k-row.L { border-radius: 0 0 4px 4px; margin-bottom: 4px !important; } .k-row.L::before { content: ''; position: absolute; top: 0; left: 2.5%; width: 95%; height: 1px; background: rgba(236,229,211,.16); } .k-row .k-c, .k-row .k-c.dim, .k-row .k-c.none { background: none !important; } .k-c + .k-c::after { content: ''; position: absolute; left: 0; top: 16%; height: 68%; width: 1px; background: rgba(236,229,211,.16); }"
Q = [['Train', 'Chariot', 2, 3], ['Learn', 'Cavalry', 1, 4]]
PANELS = [('Same footprint: nothing selected, the name in the strip', {'hd': A}),
          ('Same footprint: Horse archer selected (the widest line)', {'sel': 'Horse archer', 'hd': A}),
          ('Same footprint: Camp wagon selected (locked: the longest reason)', {'sel': 'Camp wagon', 'hd': A})]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files']); shots = []
        url = 'file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); await pg.goto(url); await pg.wait_for_timeout(1500); await pg.evaluate(PREP)
        await pg.evaluate("""async () => { MENU.S.subject = null; MENU.S.tab = null; MENU.S.cpage = 0; MENU.render(true); await $W(200); }"""); await pg.screenshot(path='/tmp/mock/p35_before.png'); await pg.close()
        for title, opt in PANELS:
            pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(url); await pg.wait_for_timeout(1500); await pg.evaluate(PREP)
            r = await pg.evaluate(SHOW, [opt, CSS]); await pg.wait_for_timeout(200); f = f'/tmp/mock/p35_{len(shots)}.png'; await pg.screenshot(path=f); print({k: r[k] for k in ('homeW', 'room', 'need', 'over')}, r['N'], errs[:2])
            shots.append((title, f"strip + box {r['card']} px (Jobs dock {r['was']} px), cell {r['tile']} x {r['ch']} px" + (f", narrowest name squeezed to {min(x[1] for x in r['fits']):.2f}" if r['fits'] else ', no name squeezed'), f)); await pg.close()
        await b.close()
    shots.insert(0, ('Today (n65): the Jobs dock', 'the footprint to hold: the strip of circles and the box', '/tmp/mock/p35_before.png'))
    CH = 620; ims = [Image.open(f) for _, _, f in shots]; w, h = ims[0].size
    sheet = Image.new('RGB', (w, (CH + 110) * len(ims)), (16, 12, 9)); d = ImageDraw.Draw(sheet)
    for i, (title, sub, _) in enumerate(shots): y = i * (CH + 110); d.text((18, y + 16), title, fill=(236, 229, 211), font_size=30); d.text((18, y + 60), sub, fill=(190, 180, 160), font_size=28); sheet.paste(ims[i].crop((0, h - CH, w, h)), (0, y + 110))
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
