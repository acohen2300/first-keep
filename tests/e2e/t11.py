import asyncio, sys
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(3); const G=F.G; F.setPause(false);
  for (const o of [0,1,2,3]) { const k=F.keepOf(o); for (let i=0;i<57;i++) { const v=F.addUnit(o,'vil',k.x+Math.random()*100-50,k.y+60); v.job=['food','wood','stone','gold'][i%4]; } for (let i=0;i<90;i++) { const u=F.addUnit(o, ['spear','sword','archer','spear'][i%4] in F.UNIT? ['spear','sword','archer','spear'][i%4]:'spear', k.x+Math.random()*100-50,k.y-80); u.state='home'; } }
  for (let i=0;i<60;i++) F.step(1/30);
  const t0=performance.now(); for (let i=0;i<150;i++) F.step(1/30); const ms=(performance.now()-t0)/150;
  return {units:G.units.length, msPerTick:+ms.toFixed(2)}; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        print(path.split('/')[-1], await pg.evaluate(JS), errs); await b.close()
asyncio.run(main(sys.argv[1]))
