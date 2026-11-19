import asyncio, sys, json, os, time
from playwright.async_api import async_playwright
V = sys.argv[1]; MIN = int(sys.argv[2]); OUT = sys.argv[3]; SEED = sys.argv[4] if len(sys.argv) > 4 else '4063976774'
SETUP = r"""(() => { window.$seen = new Set(); window.$dead = []; window.$minute = (n) => { const K = FK.K;
  for (let i = 0; i < n * 600; i++) { for (const u of FK.units()) $seen.add(u); FK.sim(0.1);
    for (const u of $seen) if (u.gone) { $seen.delete(u); const hb = u.hitBy, S = FK.SIDES[u.side];
      let foe = null, fd = 1e9; for (const v of FK.units()) if (v.side !== u.side && WAR.armed(v)) { const d = Math.hypot(v.bx - u.bx, v.by - u.by); if (d < fd) { fd = d; foe = v; } }
      $dead.push({ t: Math.round(K.t), side: u.side, code: u.code, armed: !!WAR.armed(u), hp: Math.round(u.hp * 10) / 10, sick: u.sick > K.t - 0.2, plague: !!u.plague, job: u.job, inside: !!u.inside,
        hitBy: hb == null ? null : typeof hb === 'string' ? hb : (hb.code + '@' + hb.side), hitAgo: u.hitT == null ? null : Math.round(K.t - u.hitT), killer: u.killer ?? null,
        food: S ? Math.round(S.store.food) : null, temp: Math.round(K.temp), foeD: Math.round(fd / FK.D.tile), foe: foe ? foe.code + '@' + foe.side : null }); } }
  return { t: K.t, n: [0, 1, 2, 3].map((s) => [FK.units().filter((u) => u.side === s && !WAR.armed(u)).length, FK.units().filter((u) => u.side === s && WAR.armed(u)).length]), dead: $dead.length, res: (typeof X !== 'undefined' && X.result) ? X.result() : null, food: FK.SIDES.slice(0,4).map((s) => Math.round(s.store.food)) }; }; return true; })()"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.join(V, 'index.html') + '#' + SEED); await pg.wait_for_timeout(1500)
        await pg.evaluate("(async () => { document.querySelector('[data-v=\"opt|len|0\"]').click(); await new Promise(r => setTimeout(r, 200)); document.querySelector('[data-v=\"start||\"]').click(); await new Promise(r => setTimeout(r, 300)); FK.pause(true); return [MENU.S.opt.len, FK.K.t, FK.paused()]; })()"); await pg.evaluate(SETUP); t0 = time.time()
        for m in range(MIN):
            r = await pg.evaluate("$minute(1)")
            if True: print(m + 1, r, round(time.time() - t0), flush=True)
            if m % 10 == 9 or m == MIN - 1: json.dump(await pg.evaluate("$dead"), open(OUT, 'w'))
        print('ERRS', errs[:3]); await b.close()
asyncio.run(main())
