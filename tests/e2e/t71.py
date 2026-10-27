import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(2024); const G=F.G; F.setPause(false); const out=[]; for(let m=1;m<=10;m++){ for(let i=0;i<30*60;i++)F.step(1/30); const p=G.P[2]; const V=G.units.filter(u=>u.owner===2&&u.kind==='vil'); const jobs={}; V.forEach(u=>jobs[u.job+(u.idle?'*':'')]=(jobs[u.job+(u.idle?'*':'')]||0)+1); out.push([m, p.age, Object.values(p.res).map(Math.round).join('/'), V.length, JSON.stringify(jobs), Math.round(p.eats||0), p.hungry, G.units.filter(u=>u.owner===2&&u.noPath&&G.t-u.noPathT<5).length]); } return out; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        for r in await pg.evaluate(JS): print(r)
        await br.close()
asyncio.run(main())
