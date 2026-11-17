# run: every building's card read from the running n65 game (its groups and cells), for the static-footprint card (mock 52). python3 53-...py <v100 dir> <out.json>
import asyncio, sys, os, json
from playwright.async_api import async_playwright
V, OUT = sys.argv[1], sys.argv[2]
JS = r"""async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, SH = BOOKS.shells; MENU.act('start'); await W(400); S.tab = null; MENU.render(true);
 const me = FK.SIDES[0]; Object.assign(me.store, { food: 99999, wood: 99999, gold: 99999, stone: 99999, iron: 99999 }); me.age = 5; const h0 = FK.seatOf(0), made = {}, fail = [], N = FK.N;
 const codes = Object.keys(SH).filter((c) => SH[c].layer === 110);
 for (const c of codes) { let t = null; out: for (let d = 6; d < 260; d += 2) for (const [i, j] of [[h0.i + d, h0.j], [h0.i - d, h0.j], [h0.i, h0.j + d], [h0.i, h0.j - d], [h0.i + d, h0.j + d], [h0.i - d, h0.j - d], [h0.i + d, h0.j - d], [h0.i - d, h0.j + d]]) { if (i < 2 || j < 2 || i > N - 3 || j > N - 3) continue; let ok = false; try { ok = ECON.canPlace(c, i, j, 0); } catch (e) {} if (!ok) continue; try { t = FK.build(c, i, j, me.col); } catch (e) { t = null; } if (t) { t.side = 0; t.done = 1; break out; } }
  if (t) made[c] = t; else fail.push(SH[c].name); }
 FK.pause(true);
 const tabs = () => [...document.querySelectorAll('#base .tabs .cell')], cellsOf = () => { const r = document.querySelector('#base .tabs + .row6') || document.querySelector('#base .row6'); return r ? [...r.children].filter((x) => x.tagName !== 'I') : []; };
 const read = (el) => { const f = el.querySelector(':scope > span'); let name = el.textContent.trim().slice(0, 40), beats = false; if (f) { const sp = f.cloneNode(true); beats = !!sp.querySelector('b'); sp.querySelectorAll('b, svg').forEach((x) => x.remove()); name = sp.textContent.trim(); } const sm = [...el.querySelectorAll(':scope > small')], cs = sm.filter((s) => !s.classList.contains('u') && !s.classList.contains('c')).pop(), [verb, code] = (el.dataset.v || '').split('|'), mu = el.querySelector(':scope > small.u');
  let why = ''; try { why = (MENU.VERBS[verb] && MENU.VERBS[verb].whyNot(code, verb === 'train' ? S.subject : undefined)) || ''; } catch (e) {}
  return { name, verb, code, beats, stats: mu ? mu.textContent.trim() : '', cost: cs ? [...cs.querySelectorAll('span')].map((x) => x.textContent.trim()).filter((x) => /^\d/.test(x)) : [], fx: (el.querySelector(':scope > small.c') || {}).textContent || '', why, dim: el.classList.contains('dim'), text: el.textContent.trim().slice(0, 60) }; };
 const out = {}; for (const c of Object.keys(made)) { S.subject = made[c]; S.tab = null; S.cpage = 0; MENU.render(true); await W(60); const tb = tabs().map((x) => x.textContent.trim()).filter(Boolean), groups = {};
  if (!tb.length) groups['(none)'] = cellsOf().map(read); for (const name of tb) { const e = tabs().find((x) => x.textContent.trim() === name); if (e) { e.click(); await W(50); } groups[name] = cellsOf().map(read); }
  out[SH[c].name] = { code: c, title: (document.querySelector('#rank .exec span') || {}).textContent || '', groups }; }
 return { fail, out, fk: Object.keys(FK).filter((k) => /bld|thing|unit|all|list/i.test(k)) }; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=1); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath(os.path.join(V, 'index.html')) + '#20261105'); await pg.wait_for_timeout(1500)
        r = await pg.evaluate(JS); json.dump(r, open(OUT, 'w')); print('placed', len(r['out']), 'failed', r['fail'], 'errs', errs[:2], r['fk'][:12]); await b.close()
asyncio.run(main())
