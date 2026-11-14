import asyncio, sys, json
from playwright.async_api import async_playwright
DIR = sys.argv[1]; URL = 'file://' + DIR + '/index.html#20261105'
JS = r"""((tab) => { const S = MENU.S; if (tab !== 'Start') { if (!FK.seatOf(0)) MENU.act('start'); } S.tab = tab; MENU.render(true);
 const root = document.body, out = { tab, fonts: {}, heights: {}, widths: {}, gaps: {}, cells: 0, colours: {} };
 const els = [...root.querySelectorAll('button, [data-v], .cell, .slot')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
 for (const e of els) { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); out.cells++; const h = Math.round(r.height), w = Math.round(r.width); out.heights[h] = (out.heights[h] || 0) + 1; out.widths[w] = (out.widths[w] || 0) + 1;
  for (const t of [e, ...e.querySelectorAll('*')]) { if (!t.childNodes.length || ![...t.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue; const c = getComputedStyle(t), f = c.fontFamily.split(',')[0].replace(/"/g, '') + ' ' + c.fontWeight + ' ' + c.fontSize; out.fonts[f] = (out.fonts[f] || 0) + 1; }
  const n = e.nextElementSibling; if (n) { const q = n.getBoundingClientRect(); if (Math.abs(q.top - r.top) < 2 && q.width > 0) { const g = Math.round(q.left - r.right); out.gaps[g] = (out.gaps[g] || 0) + 1; } } }
 return out; })"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); await pg.goto(URL); await pg.wait_for_timeout(900)
        res = []
        for tab in ['Start', 'Hall', 'Build', 'War', 'Help', 'Mail', 'Ice', 'Back', 'Town', null_ if False else None]:
            if tab is None: continue
            try: res.append(await pg.evaluate(JS + '(' + json.dumps(tab) + ')')); await pg.screenshot(path=f'/tmp/probe/g2-{tab}.png')
            except Exception as e: res.append({'tab': tab, 'err': str(e)[:200]})
        print(json.dumps({'res': res, 'errs': errs[:3]})); await b.close()
null_ = None
asyncio.run(main())
