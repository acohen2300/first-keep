import asyncio, sys, json
from playwright.async_api import async_playwright
DIR, MIN = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 50
SEED = sys.argv[3] if len(sys.argv) > 3 else '20261105'
URL = 'file://' + DIR + '/index.html#' + SEED
JS = r"""(async (MIN) => { MENU.S.tab = null; MENU.S.opt.len = 0; MENU.act('start'); FK.fog(false); const rows = [];
 for (let m = 1; m <= MIN; m++) { let idleS = [0,0,0,0], hung = [0,0,0,0]; for (let k = 0; k < 600; k++) { FK.sim(0.1); const H0 = FK.seatOf(0); if (H0) H0.hp = H0.hpMax; if (k % 30 === 0) for (const s of [1,2,3]) { const vs = ECON.villagersOf(s); idleS[s] += vs.filter((v) => v.job === 'idle' || v.job === 'wait').length / Math.max(1, vs.length); if (FK.SIDES[s].hungry) hung[s]++; } }
  if (ECON.result()) { rows.push([m, 'END', ECON.result().text]); break; } for (const s of [1,2,3]) { const S = FK.SIDES[s], vs = ECON.villagersOf(s); if (!FK.seatOf(s)) { rows.push([m, s, 'dead']); continue; } rows.push([m, s, vs.length, +(idleS[s] / 20).toFixed(3), hung[s], S.age, WAR.armyOf(s).length, Math.round(S.store.food), Math.round(S.store.wood), Math.round(S.store.gold), Math.round(S.store.stone)]); } }
 return rows; })"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); await pg.goto(URL); await pg.wait_for_timeout(800)
        rows = await pg.evaluate(JS + '(' + str(MIN) + ')')
        print(json.dumps({'rows': rows, 'errs': errs[:3]})); await b.close()
asyncio.run(main())
