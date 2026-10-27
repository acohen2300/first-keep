import asyncio, json
from playwright.async_api import async_playwright
JS="""(seed)=>{const F=window.__fk;F.newGame(seed);F.act('close');const G=F.G,k=F.keepOf(0);
 const near=(kind)=>G.nodes.filter(n=>n.kind===kind&&Math.hypot(n.x-k.x,n.y-k.y)<260&&n.x<k.x&&n.y>k.y).length;
 return {seed,keep:[k.x,k.y],bush:near('bush'),tree:near('tree'),stone:near('stone'),gold:near('gold'),iron:near('iron')};}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        for s in [1,5,9,23,77]: print(json.dumps(await pg.evaluate(JS,s)))
        print(errs[:3]); await b.close()
asyncio.run(main())
