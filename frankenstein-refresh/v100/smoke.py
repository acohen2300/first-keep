"""Smoke test for First Keep v100: does it start, play, save, reload and run smooth. ~3 min."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
V = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
URL = 'file://' + V + '#20261105'
FRAMES = '''() => new Promise(r => { let n=0, t0=performance.now(), last=t0, slow=[];
 function f(t){ n++; if(t-last>40) slow.push(Math.round(t-last)); last=t; if(t-t0<10000) requestAnimationFrame(f);
 else r({fps:+(n*1000/(t-t0)).toFixed(1), slow, heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize/1e6) : null}); }
 requestAnimationFrame(f); })'''
PLAY = '''(mins) => { const t0 = performance.now(); let worst = 0;
 for (let i = 0; i < mins * 600; i++) { const a = performance.now(); FK.sim(0.1); worst = Math.max(worst, performance.now() - a); }
 const S = FK.SIDES, us = FK.units();
 return { ms: Math.round(performance.now() - t0), worstStep: Math.round(worst), units: us.length, things: FK.things().length,
   mine: us.filter(u => u.side === 0).length, working: us.filter(u => u.side === 0 && u.job && u.job !== 'idle').length,
   stores: S.slice(0, 4).map(s => s && s.store ? Object.values(s.store).reduce((a, b) => a + b, 0) | 0 : null),
   nan: us.some(u => !Number.isFinite(u.bx) || !Number.isFinite(u.by) || !Number.isFinite(u.hp)) }; }'''
SAVE = '''() => { FK.save(true); const S0 = FK.readSave(); if (!S0) return { saved: false }; const txt = JSON.stringify(S0);
 const before = { units: FK.units().length, things: FK.things().length, t: FK.K ? FK.K.t : null, store: JSON.stringify(FK.SIDES[0].store) };
 FK.resume(FK.readSave());
 const after = { units: FK.units().length, things: FK.things().length, t: FK.K ? FK.K.t : null, store: JSON.stringify(FK.SIDES[0].store) };
 for (let i = 0; i < 300; i++) FK.sim(0.1);
 return { saved: true, bytes: txt.length, same: JSON.stringify(before) === JSON.stringify(after), before, after, runsOn: FK.units().length > 0 }; }'''

async def main():
    out, ok = {}, True
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox', '--allow-file-access-from-files', '--enable-precise-memory-info'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
        await pg.goto(URL); await pg.wait_for_timeout(2500)
        out['starts'] = await pg.evaluate("typeof FK === 'object' && typeof MENU === 'object' && document.title")
        out['frames_setup'] = await pg.evaluate(FRAMES)
        await pg.evaluate("FK.reset()")
        out['play_10min'] = await pg.evaluate(PLAY, 10)
        out['save_reload'] = await pg.evaluate(SAVE)
        out['frames_play'] = await pg.evaluate(FRAMES)
        out['errors'] = errs[:5]
        await b.close()
    P, S, F1, F2 = out['play_10min'], out['save_reload'], out['frames_setup'], out['frames_play']
    checks = {
        'page starts': bool(out['starts']),
        'no page errors': not out['errors'],
        'a 10-min match runs, nothing NaN': P['units'] > 0 and not P['nan'],
        'your villagers work': P['working'] > 0,
        'save writes and reloads the same': S.get('saved') and S.get('same') and S.get('runsOn'),
        'setup screen smooth (>=55 fps, no frame >60 ms)': F1['fps'] >= 55 and not [x for x in F1['slow'] if x > 60],
    }
    warn = {'match smooth (>=55 fps, no frame >60 ms) — known mid-match stutter, logged in Parked.md (Albert, Nov 7 11:48: publish to preview anyway)': F2['fps'] >= 55 and not [x for x in F2['slow'] if x > 60]}
    print(json.dumps(out, indent=1)[:3000])
    for k, v in checks.items(): print(('PASS ' if v else 'FAIL ') + k)
    for k, v in warn.items(): print(('PASS ' if v else 'WARN ') + k)
    print(f"{sum(map(bool, checks.values()))}/{len(checks)} smoke checks hold")
    sys.exit(0 if all(checks.values()) else 1)
asyncio.run(main())
