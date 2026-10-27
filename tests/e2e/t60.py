import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(2024); const G=F.G; F.setPause(false); for(let i=0;i<30*60*15;i++)F.step(1/30);
 const t=[]; for(let i=0;i<5;i++){ const t0=performance.now(); F.saveGame(true); t.push(+(performance.now()-t0).toFixed(1)); }
 return {ms:t, kb: Math.round((localStorage.getItem('firstkeep.save')||'').length/1024), units:G.units.length, nodes:G.nodes.length}; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); await br.close()
asyncio.run(main())
