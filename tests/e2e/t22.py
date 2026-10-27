import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(11); const G=F.G; const k=F.keepOf(0);
 const a=F.astar(360,1640,1000,1540,0); const b=F.astar(360,1640,700,1300,0);
 const st=F.stopsAll().map(f=>[f.x,f.y]); return {a:[a.pts.length,a.partial], b:[b.pts.length,b.partial], st, NC:F.NAV.solid.length}; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); await br.close()
asyncio.run(main())
