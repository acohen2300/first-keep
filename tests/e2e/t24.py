import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(11); const G=F.G; F.setPause(false); for(let i=0;i<40;i++)F.step(1/30);
 const D=(x,y)=>0; const a=F.astar(360,1640,1000,1480,0,true), b=F.astar(360,1640,1000,1480,0,false);
 const finds=G.finds.filter(f=>['chest','ruins','den','cemetery'].includes(f.kind)&&f.x<1000&&f.y>1000).map(f=>[f.kind,Math.round(f.x),Math.round(f.y)]);
 const g=(G.guarded||[]).length; const near=(p,f)=>Math.hypot(p.x-f[1],p.y-f[2]);
 const minA=finds.map(f=>Math.round(Math.min(...a.pts.map(p=>near(p,f))))), minB=finds.map(f=>Math.round(Math.min(...b.pts.map(p=>near(p,f)))));
 return {g, finds, a:[a.pts.length,a.partial], b:[b.pts.length,b.partial], minA, minB}; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); await br.close()
asyncio.run(main())
