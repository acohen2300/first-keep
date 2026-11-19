# The shell, ring, font, outline audit, measured on the running screens (read-only).
# python3 design.py <v100 dir> <out.json> [shots dir]   — uses ../routes.py's screens and ../pre.js
import asyncio, sys, json, os, re
from playwright.async_api import async_playwright
V = sys.argv[1]; OUT = sys.argv[2]; SHOTS = sys.argv[3] if len(sys.argv) > 3 else None
HERE = os.path.dirname(os.path.abspath(__file__)); UP = os.path.dirname(HERE); SEED = '20261105'
PRE = open(os.path.join(UP, 'pre.js')).read(); JS = re.search(r'JS = r"""(.*?)"""', open(os.path.join(UP, 'routes.py')).read(), re.S).group(1)
MEASURE = r"""window.$measure = () => { const vis = (e) => { const r = e.getBoundingClientRect(), c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none'; }, out = { texts: [], boxes: [] };
  const alpha = (e) => { let a = 1; for (let x = e; x && x !== document.body; x = x.parentElement) a *= parseFloat(getComputedStyle(x).opacity); return +a.toFixed(2); };
  const clear = (c) => !c || c === 'transparent' || /rgba\([^)]*,\s*0\)/.test(c);
  for (const root of ['#ui', '.topbar', '#spd', '#qa'].flatMap((s) => [...document.querySelectorAll(s)])) { if (!vis(root)) continue;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const e = n.parentElement; if (!vis(e) || e.closest('svg')) continue; const cs = getComputedStyle(e), host = e.closest('button, .cell') || e;
      out.texts.push({ t: t.slice(0, 26), fam: cs.fontFamily.split(',')[0].replace(/"/g, ''), px: parseFloat(cs.fontSize), w: cs.fontWeight, st: cs.fontStyle, col: cs.color, a: alpha(e), caps: cs.fontVariant.includes('small-caps'), und: cs.textDecorationLine.includes('underline'), tag: e.tagName.toLowerCase(), cls: (typeof e.className === 'string' ? e.className : '').trim(), host: (host.className || '').toString().trim(), hv: (host.dataset && host.dataset.v) || '', root: root.id || root.className, sx: (cs.transform !== 'none' ? +new DOMMatrix(cs.transform).a.toFixed(2) : 1) }); }
    for (const e of root.querySelectorAll('button, .cell')) { if (!vis(e)) continue; const cs = getComputedStyle(e), r = e.getBoundingClientRect(), af = getComputedStyle(e, '::after'); let tw = r.width, th = r.height;
      if (af.content !== 'none' && af.position === 'absolute') { const p = (k) => parseFloat(af[k]) || 0; tw = r.width - p('left') - p('right'); th = r.height - p('top') - p('bottom'); }
      const bw = parseFloat(cs.borderTopWidth), border = bw > 0 && cs.borderTopStyle !== 'none' && !clear(cs.borderTopColor) ? bw + 'px ' + cs.borderTopColor : '', sh = cs.boxShadow === 'none' ? '' : cs.boxShadow, rg = e.querySelector(':scope > svg.rg'), rgOn = rg && getComputedStyle(rg).display !== 'none';
      out.boxes.push({ v: e.dataset.v || '', cls: (e.className || '').toString().trim(), tag: e.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height), tw: Math.round(tw), th: Math.round(th), rad: cs.borderTopLeftRadius, border, inset: /inset/.test(sh) ? sh : '', glow: sh && !/inset/.test(sh) ? sh : '', ring: rgOn ? [...rg.querySelectorAll('path')].map((p) => p.getAttribute('stroke') + ' ' + p.getAttribute('stroke-width')) : null,
        outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? cs.outlineWidth + ' ' + cs.outlineColor : '', bg: cs.backgroundImage !== 'none' ? 'gradient' : clear(cs.backgroundColor) ? '' : cs.backgroundColor, col: cs.color, a: alpha(e), clipX: e.scrollWidth > e.clientWidth + 1, clipY: e.scrollHeight > e.clientHeight + 1, text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30), root: root.id || root.className, x: Math.round(r.left), y: Math.round(r.top) }); } }
  return out; };"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox']); errs = []; res = {}
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); pg.on('pageerror', lambda e: errs.append(str(e)[:200])); await pg.add_init_script(PRE)
        await pg.goto('file://' + os.path.join(V, 'index.html') + '#' + SEED); await pg.wait_for_timeout(1800); await pg.evaluate(MEASURE)
        async def take(name, js=None, wait=120):
            try:
                if js: await pg.evaluate(js)
                await pg.wait_for_timeout(wait); res[name] = await pg.evaluate('$measure()')
                if SHOTS: await pg.screenshot(path=os.path.join(SHOTS, re.sub(r'[^a-z0-9]+', '-', name.lower()) + '.png'))
            except Exception as e: res[name] = {'err': str(e)[:200]}
            print(name, len(res[name].get('texts', [])), len(res[name].get('boxes', [])), flush=True)
        await take('new game')
        info = await pg.evaluate(JS); await pg.evaluate(MEASURE)
        for s in info['screens']:
            if s.startswith('card: ') and not any(k in s for k in ('Town Center', 'Barracks', 'Mill', 'Market', 'Stable', 'House', 'site', 'gold', 'bush', 'foe', 'Tower', 'School', 'Temple', 'Mine', 'Lumber', 'wild')): continue
            await take(s, '$list(%s)' % json.dumps(s))
        R = "(() => { const S = MENU.S; clearTimeout(S.doneT); Object.assign(S, { subject: null, tab: null, war: false, ice: null, ghost: null, vpick: null, done: null, fold: false, dm: null, cs: null, ctab: null }); FK.select(null); FK.pause(false); MENU.render(true); })();"
        C = "const click = (v) => { const b = [...document.querySelectorAll('[data-v]')].find((b) => b.offsetParent && b.dataset.v === v); if (b) b.click(); return !!b; };"
        for g in ('Work', 'Army', 'Keep', 'Tech'): await take('Build: ' + g, R + C + "click('mtab|Build|'); click('group|%s|');" % g)
        await take('Jobs: rally set', R + C + "click('mtab|Jobs|'); click('jsel|food|');")
        TC = "const h = FK.seatOf(0), go = () => { FK.cam.x = h.vx; FK.cam.y = h.vy; const [x, y] = FK.toScreen(h.vx, h.vy); MENU.S.tap = null; FK.tap(x, y); MENU.render(true); };"
        await take('Town Center: Train, one queued', R + C + TC + "$rich(0); go(); const t = [...document.querySelectorAll('#base .mt .cell')].find((c) => c.offsetParent); if (t) t.click(); MENU.render(true);")
        await take('Town Center: Learn', R + C + TC + "go(); click('ctab|Learn|');")
        await take('Town Center: Learn, one bought', C + "const t = [...document.querySelectorAll('#base .mt .cell[data-v^=\"research|\"]')].find((c) => c.offsetParent && !c.classList.contains('dim')); if (t) t.click(); MENU.render(true);")
        await take('Town Center: Talk', R + C + TC + "go(); click('ctab|Talk|');")
        await take('War: Attack armed', R + C + "click('war||'); click('mwho||'); click('mord|attack|');")
        await take('pause card', R + C + "click('pause||');")
        await take('Help', C + "click('help||');")
        await take('Welcome back', "MENU.S.tab = 'Back'; FK.pause(true); MENU.render(true);")
        json.dump({'screens': res, 'errs': errs}, open(OUT, 'w')); print('ERRS', len(errs), errs[:3]); await b.close()
asyncio.run(main())
