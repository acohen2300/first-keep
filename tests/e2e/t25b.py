import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); const G=F.G; F.setPause(false);
 const m=()=>{const a=performance.now(); F.step(1/30); return Math.round((performance.now()-a)*10)/10;};
 const base=[]; for(let i=0;i<8;i++)base.push(m());
 G.nodes.filter(n=>n.kind==='tree').slice(0,100).forEach(n=>n.amt=0);
 const after=[]; for(let i=0;i<8;i++)after.push(m());
 return {base,after}; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':430,'height':900})
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); await b.close()
asyncio.run(main())
