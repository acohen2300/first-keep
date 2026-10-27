import asyncio, sys
from playwright.async_api import async_playwright
JS="""(seed) => { const F=window.__fk; F.newGame(seed); const G=F.G; F.setPause(false); const out=[];
  for (let i=0;i<30*60*14;i++) { F.step(1/30); if (i%(30*120)===0) out.push([Math.round(G.t/60), G.units.filter(u=>u.owner===0&&u.kind==='vil').length, G.units.filter(u=>u.owner===0&&F.UNIT[u.kind].tick==='sol').length, !!F.keepOf(0)]); }
  return out; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        for s in (2024, 99):
            print(path.split('/')[-1], s, await pg.evaluate(JS, s))
        await b.close()
asyncio.run(main(sys.argv[1]))
