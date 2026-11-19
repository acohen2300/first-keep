# Read-only page probes for the Nov 19 audit. python3 probes.py <v100 dir>
import asyncio, sys, json, os
from playwright.async_api import async_playwright
V = sys.argv[1]; UP = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); PRE = open(os.path.join(UP, 'pre.js')).read()
START = "document.querySelector('[data-v=\"opt|len|0\"]').click(); document.querySelector('[data-v=\"start||\"]').click();"
P = {
 'tower reach and a shot': "(() => { const c = Object.keys(FK.D.tower).find((c) => !FK.SH[c].ticks.includes('Seat')), t = $put(c, 0, 6, 40, true), r = WAR.reachOf(t); WAR.treaty(0, 1, 'war'); const k = FK.tileAt(t.bx + 2 * FK.D.tile, t.by + 2 * FK.D.tile), u = FK.spawn('UM1', 1, k, FK.rng), hp = u.hp; FK.fog(false); $run(8); return { tower: FK.SH[c].name, reach: r, foeHp: [hp, u.hp, !!u.gone] }; })()",
 'market: what one Sell tap sells': "(() => { $rich(0); const m = $put(Object.keys(FK.SH).find((c) => FK.SH[c].ticks.includes('Trade') && FK.B[c]), 0, 6, 40, true), s = FK.SIDES[0].store, w = s.wood, g = s.gold; MENU.act('sell', 'wood'); return { woodSold: w - s.wood, goldGot: s.gold - g, bulkInBook: FK.D.market.bulk, lot: FK.D.market.lot.raw }; })()",
 'new game after War': "(async () => { const S = MENU.S; MENU.act('war'); const war0 = S.war; S.fold = true; S.sq = [1]; MENU.act('new'); await new Promise((r) => setTimeout(r, 100)); document.querySelector('[data-v=\"start||\"]').click(); await new Promise((r) => setTimeout(r, 400)); return { warBefore: war0, warAfterNewGame: S.war, foldAfter: S.fold, squadAfter: (S.sq || []).length, line: (document.querySelector('.mline') || {}).innerText }; })()",
 'two errors': "(async () => { window.dispatchEvent(new ErrorEvent('error', { error: new Error('probe one'), message: 'probe one' })); window.dispatchEvent(new ErrorEvent('error', { error: new Error('probe two'), message: 'probe two' })); await new Promise((r) => setTimeout(r, 200)); MENU.render(true); const v = (id) => { const e = document.getElementById(id); const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), (e.innerText || '').trim().slice(0, 60)]; }; return { tab: MENU.S.tab, paused: FK.paused(), panel: v('panel'), rank: v('rank'), base: v('base'), spd: v('spd'), buttonsOnScreen: [...document.querySelectorAll('[data-v]')].filter((b) => b.getBoundingClientRect().width > 0).map((b) => b.dataset.v).slice(0, 14) }; })()",
 'tap cost on a town of 60 buildings': "(() => { $rich(0); let n = 0; for (let i = 0; i < 60; i++) if ($put('BR1', 0, 6, 70, true)) n++; const h = FK.seatOf(0); FK.cam.x = h.vx; FK.cam.y = h.vy; FK.cam.z = 1.2; MENU.render(true); const [x, y] = FK.toScreen(h.vx, h.vy); const t = (px, py) => { const a = performance.now(); for (let i = 0; i < 50; i++) FK.hitAt(px, py); return +((performance.now() - a) / 50).toFixed(2); }; return { houses: n, msOnTownCenter: t(x, y), msOnOpenGround: t(20, 300) }; })()",
 'save cost at 300 units': "(() => { for (let i = 0; i < 280; i++) { const h = FK.seatOf(0), k = (h.j + h.n + 3 + (i % 20)) * FK.N + h.i - 10 + Math.floor(i / 20); try { FK.spawn(i % 2 ? 'UM1' : 'UV', 0, k, FK.rng); } catch (e) {} } const a = performance.now(); let len = 0; for (let i = 0; i < 5; i++) len = (FK.pack() || '').length; return { units: FK.units().length, msAPack: +((performance.now() - a) / 5).toFixed(1), bytes: len, everySeconds: FK.D.saveBeat }; })()",
 'retreat wears the rout badge': "(() => { const us = [0, 1, 2].map((n) => { const h = FK.seatOf(0); return FK.spawn('UM1', 0, (h.j + h.n + 2) * FK.N + h.i + n, FK.rng); }); WAR.homeAll(us); return { job: us[0].job, routAt: us[0].routAt, status: WAR.status(us[0]) }; })()",
}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        for name, js in P.items():
            pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:160])); await pg.add_init_script(PRE)
            await pg.goto('file://' + os.path.join(V, 'index.html') + '#20261105'); await pg.wait_for_timeout(1500); await pg.evaluate(START); await pg.wait_for_timeout(500)
            try: r = await pg.evaluate(js)
            except Exception as e: r = {'threw': str(e)[:300]}
            print('##', name, '\n  ', json.dumps(r)[:900], ('\n   page errors: ' + str(errs[:2])) if errs and name != 'two errors' else '', flush=True); await pg.close()
        await b.close()
asyncio.run(main())
