# mock 39 = mock 38 with the sum of what this building's research has given so far, written to the right of its name (Albert, Nov 17 05:06). Only effects that reach the whole class (Riders) are summed; a step for one unit is counted, not summed.
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
#rank { display: none !important; }
#base { background: #1c1813 !important; border: 0 !important; border-radius: 8px !important; padding: 2px 6px 2px !important; gap: 0 !important; box-shadow: 0 -8px 24px rgba(0,0,0,.30) !important; display: block !important; font-family: var(--ui); }
.k-hd { display: flex; justify-content: space-between; align-items: center; height: 26px; padding: 0 4px; }
.k-hd b { font: 18px var(--display); color: #ece5d3; font-weight: 400; line-height: 22px; }
.k-hd span { display: flex; gap: 18px; } .k-ag { flex: 1; margin-left: 10px; font: 400 12px var(--ui); font-style: normal; color: #a39a86; white-space: nowrap; overflow: hidden; align-self: center; padding-top: 3px; } .k-hd svg { width: 16px; height: 16px; stroke: #a39a86; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
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
.k-rd { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 4px; }
.k-rd b { font: 600 14px var(--ui); color: #ece5d3; white-space: nowrap; } .k-rd i { font: 400 12px var(--ui); font-style: normal; color: #a39a86; flex: 1; white-space: nowrap; overflow: hidden; }
.k-rd b s { text-decoration: none; margin-left: 3px; } .k-rd b s b { color: #ff6b5b; font-weight: 600; } .k-rd b s svg { width: 13px; height: 13px; vertical-align: -2px; stroke: #e6b947; }
.k-rd q { quotes: none; display: flex; gap: 7px; align-items: center; color: #ece5d3; } .k-rd q::before, .k-rd q::after { content: none; } .k-rd q span { display: inline-flex; align-items: center; gap: 1px; } .k-rd q svg { width: 11px; height: 11px; stroke: #a39a86; }
.k-rd u { text-decoration: none; display: flex; gap: 5px; font: 600 12px var(--ui); white-space: nowrap; }
.k-rd button { height: 28px; padding: 0 16px; border: 0; border-radius: 6px; font: 600 14px var(--ui); color: #100c08; }
"""
SHOW = r"""async ([opt, css]) => { const S = MENU.S, t = $made['Stable'], W = $W, SH = BOOKS.shells, M = BOOKS.measure, mv = (k) => Object.values(M).find((e) => e.key === k).value;
 const open = async () => { S.subject = t; S.tab = null; S.cpage = 0; MENU.render(true); await W(150); }, tabs = () => [...document.querySelectorAll('#base .tabs .cell')], cells = () => [...document.querySelectorAll('#base .tabs + .row6 > *')].filter((x) => x.tagName !== 'I'), go = async (tab) => { const e = tabs().find((x) => x.textContent.trim() === tab); if (!e) return false; e.click(); await W(150); return true; }, tap = async (word) => { const c = cells().find((x) => x.textContent.trim().startsWith(word)); S.tap = null; if (c) c.click(); await W(120); S.tap = null; };
 const T = BOOKS.tech, ME = FK.D.players[0], me = FK.SIDES[ME], tk = (k) => Object.keys(T).find((c) => T[c].key === k); for (const k of opt.learn || []) { me.techs.add(tk(k)); FK.learn(ME, tk(k)); }
 await open(); for (const [tab, word, n, secs] of opt.queue || []) { for (let q = 0; q < n; q++) { await go(tab); await tap(word); } for (let i = 0; i < secs * 20; i++) FK.sim(0.05); MENU.render(true); await W(120); }
 const read = (el) => { const sp = el.querySelector(':scope > span').cloneNode(true); sp.querySelectorAll('b, svg').forEach((x) => x.remove()); const sm = [...el.querySelectorAll(':scope > small')], cs = sm.filter((s) => !s.classList.contains('u') && !s.classList.contains('c')).pop(), [verb, code] = (el.dataset.v || '').split('|'), rr = el.querySelector(':scope > svg.rg .rr'), run = el.querySelector(':scope > i.rk[data-rs="run"]'), cn = [...el.querySelectorAll('*')].find((e) => /^×\d+$/.test(e.textContent.trim())), cnt = cn ? cn.textContent.trim().slice(1) : null;
  const f = el.querySelector(':scope > span'), bt = f ? [...f.querySelectorAll(':scope > b, :scope > svg')].map((x) => x.outerHTML).join('') : '', mu = el.querySelector(':scope > small.u');
  return { beats: bt, stats: mu ? mu.innerHTML : '', name: sp.textContent.trim(), verb, code, dim: el.classList.contains('dim'), cost: cs ? [...cs.querySelectorAll('span')].map((x) => x.textContent.trim()).filter((x) => /^\d/.test(x)) : [], col: cs ? getComputedStyle(cs).color : '', fx: (el.querySelector(':scope > small.c') || {}).textContent || '', raw: rr ? [rr.getAttribute('stroke-dasharray'), rr.getAttribute('pathLength'), rr.getTotalLength ? Math.round(rr.getTotalLength()) : 0] : null, work: run && rr ? (() => { const a = parseFloat(rr.getAttribute('stroke-dasharray')), pl = parseFloat(rr.getAttribute('pathLength')) || (a > 1 && rr.getTotalLength ? rr.getTotalLength() : 1); return Math.max(0, Math.min(1, (isNaN(a) ? 1 : a) / pl)); })() : null, cnt, html: el.outerHTML.length }; };
 await go('Train'); const tr = cells().map(read); await go('Learn'); const le = cells().map(read); const base = document.querySelector('#base'), was = Math.round(base.getBoundingClientRect().height + document.querySelector('#rank').getBoundingClientRect().height + 6);
 const pic = (c) => { try { const cv = FK.figure(SH[c].look, FK.SIDES[0].col, 0, 0, 3, 0); return cv.toDataURL(); } catch (e) { return ''; } }, secs = mv('train');
 const cell = (x, row) => { if (!x) return '<div class="k-c none"></div>'; const p = row === 'T' ? pic(x.code) : '', sel = x.name.startsWith(opt.sel); return `<div class="k-c ${p ? '' : 'two'} ${x.dim ? 'dim' : ''} ${sel ? 'sel' : ''} ${x.work != null ? 'work' : ''} ${x.work != null && x.work >= 1 ? 'wait' : ''}" ${x.work != null ? `style="--p:${x.work}"` : ''}>${p ? `<img src="${p}">` : ''}<span>${x.name}</span>${x.cnt ? `<em>×${x.cnt}</em>` : ''}</div>`; };
 const six = (X) => [...X, null, null, null, null, null, null].slice(0, 6), all = [...tr.map((x) => [x, 'T']), ...le.map((x) => [x, 'L'])], [s, sr] = all.find(([x]) => x.name.startsWith(opt.sel)) || all[0];
 const line = sr === 'T' ? (s.stats ? `<q>${s.stats}<span>${secs[s.code]}s</span></q>` : `Trains in ${secs[s.code]} s`) : s.fx, acc = sr === 'T' ? '#5fd08a' : '#6aaeff';
 const WORD = { spd: 'Speed', hp: 'Health', atk: 'Attack', rng: 'Range', train: 'Train time' }, sum = {}, flat = {}; let one = 0, other = 0; for (const c of me.techs) { const v = T[c] && T[c].value; if (!v || v.at !== t.code) continue; for (const f of v.fx || []) { if (f.k !== 'Riders') { one++; continue; } if (!WORD[f.s]) { other++; continue; } if (f.p != null) sum[f.s] = (sum[f.s] || 0) + f.p; else if (f.a != null) flat[f.s] = (flat[f.s] || 0) + f.a; else if (f.c != null) sum[f.s] = (sum[f.s] || 0) - f.c; } }
 const agg = [...Object.keys(sum).map((k) => `${WORD[k]} ${sum[k] > 0 ? '+' : '−'}${Math.round(Math.abs(sum[k]) * 100)}%`), ...Object.keys(flat).map((k) => `${WORD[k]} +${flat[k]}`)].join(' · '), learned = [...me.techs].filter((c) => T[c] && T[c].value.at === t.code).map((c) => T[c].key);
 base.innerHTML = `<div class="k-hd"><b>Stable</b><i class="k-ag">${agg ? 'Riders: ' + agg : ''}</i><span><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></span></div><div class="k-row T">${six(tr).map((x) => cell(x, 'T')).join('')}</div><div class="k-row L">${six(le).map((x) => cell(x, 'L')).join('')}</div><div class="k-rd"><b>${s.name}<s>${sr === 'T' ? s.beats : ''}</s></b><i>${line}</i><u style="color:${s.col}">${s.cost.map((c) => `<span>${c}</span>`).join('')}</u><button style="background:${acc}">${sr === 'T' ? 'Train' : 'Learn'}</button></div>`;
 const st = document.createElement('style'); st.textContent = css; document.head.append(st); await W(250);
 const fits = []; for (const l of document.querySelectorAll('.k-c:not(.two) span')) { const cw = l.parentElement.getBoundingClientRect().width - 4, nat = l.getBoundingClientRect().width, k = Math.min(1, cw / nat); l.style.transform = `scaleX(${k})`; if (k < 1) fits.push([l.textContent, +k.toFixed(2)]); }
 const ri = document.querySelector('.k-rd i'), over = ri.scrollWidth - ri.clientWidth, free = Math.round(ri.clientWidth - [...ri.childNodes].reduce((a, n) => a + (n.getBoundingClientRect ? n.getBoundingClientRect().width : 0), 0));
 const ag = document.querySelector('.k-ag'); return { agOver: ag.scrollWidth - ag.clientWidth, agRoom: ag.clientWidth, agText: ag.textContent, learned, tcode: t.code, one, other, over, free, was, card: Math.round(base.getBoundingClientRect().height), tile: +document.querySelector('.k-c').getBoundingClientRect().width.toFixed(1), fits, tr: tr.map((x) => [x.name, x.work, x.cnt, x.raw]), le: le.map((x) => [x.name, x.fx, x.cost.join(' '), x.work, x.raw]), pics: tr.map((x) => pic(x.code).length) }; }"""
PANELS = [('Mock A: nothing learned yet: nothing after the name', {'sel': 'Chariot'}),
          ('Mock B: Horse breeding and Bridles learned', {'sel': 'Chariot', 'learn': ['horses', 'bridles']}),
          ('Mock C: six steps learned (the longest sum the Stable can show)', {'sel': 'Cataphract', 'learn': ['horses', 'bridles', 'saddles', 'stirrups', 'horseshoes', 'remounts']})]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files']); shots = []
        url = 'file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); await pg.goto(url); await pg.wait_for_timeout(1500); await pg.evaluate(PREP)
        await pg.evaluate("""async () => { MENU.S.subject = $made['Stable']; MENU.S.tab = null; MENU.S.cpage = 0; MENU.render(true); await $W(200); }"""); await pg.screenshot(path='/tmp/mock/p35_before.png'); await pg.close()
        for title, opt in PANELS:
            pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=3); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(url); await pg.wait_for_timeout(1500); await pg.evaluate(PREP)
            r = await pg.evaluate(SHOW, [opt, CSS]); await pg.wait_for_timeout(200); f = f'/tmp/mock/p35_{len(shots)}.png'; await pg.screenshot(path=f); print({k: r[k] for k in ('agText', 'agOver', 'agRoom', 'learned', 'tcode', 'one', 'other')}, [x[:2] for x in r['le']], errs[:2])
            print('line over', r['over'], 'free', r['free']); shots.append((title, f"card {r['card']} px (today {r['was']} px), cell {r['tile']} px" + (f", narrowest name squeezed to {min(x[1] for x in r['fits']):.2f}" if r['fits'] else ', no name squeezed'), f)); await pg.close()
        await b.close()
    shots.insert(0, ('Today (n65): the Stable, Train tab', 'the strip of circles and the dock', '/tmp/mock/p35_before.png'))
    CH = 620; ims = [Image.open(f) for _, _, f in shots]; w, h = ims[0].size
    sheet = Image.new('RGB', (w, (CH + 110) * len(ims)), (16, 12, 9)); d = ImageDraw.Draw(sheet)
    for i, (title, sub, _) in enumerate(shots): y = i * (CH + 110); d.text((18, y + 16), title, fill=(236, 229, 211), font_size=30); d.text((18, y + 60), sub, fill=(190, 180, 160), font_size=28); sheet.paste(ims[i].crop((0, h - CH, w, h)), (0, y + 110))
    sheet.save(OUT); print(sheet.size)
asyncio.run(main())
