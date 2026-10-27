import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(99); const G=F.G; F.setPause(false); for(let i=0;i<30*60*16;i++)F.step(1/30);
 const V=G.units.filter(u=>u.owner===2&&u.kind==='vil'&&u.job==='food'); const k=F.keepOf(2);
 const st=V.map(u=>[u.node?u.node.kind:(u.hunt?'hunt':'none'), Math.round(u.node?Math.hypot(u.node.x-k.x,u.node.y-k.y):0), Math.round(u.carry), u.idle?1:0]);
 const farms=G.blds.filter(b=>b.owner===2&&b.kind==='farm').map(b=>[Math.round(b.prog*100), b.node&&b.node.worker?1:0]);
 const mills=G.blds.filter(b=>b.owner===2&&b.kind==='mill').length; const bushes=G.nodes.filter(n=>n.kind==='bush'&&Math.hypot(n.x-k.x,n.y-k.y)<300).length;
 return {st, farms, mills, bushes}; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); await br.close()
asyncio.run(main())
