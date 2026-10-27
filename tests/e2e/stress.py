import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(3); F.act('close'); const G=F.G; F.setPause(false);
 for (let o=0;o<4;o++){ const k=F.keepOf(o); for(let i=0;i<150;i++) F.addUnit(o,'vil',k.x+(i%15)*6-40,k.y+Math.floor(i/15)*6-30); }
 F.declareWar(0,1); for(let i=0;i<60;i++)F.step(1/30);
 const t=[]; for(let i=0;i<150;i++){const a=performance.now();F.step(1/30);t.push(performance.now()-a);} t.sort((a,b)=>a-b);
 return {units:G.units.length, median:+t[75].toFixed(1), p95:+t[142].toFixed(1)}; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        for f in ['first-keep-b24b.html','first-keep.html']:
            await pg.goto('file:///home/claude/first-keep/'+f); await pg.wait_for_timeout(600); print(f, json.dumps(await pg.evaluate(JS)))
        print(errs[:2]); await b.close()
asyncio.run(main())
