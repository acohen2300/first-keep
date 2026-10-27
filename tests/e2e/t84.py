import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(99); const G=F.G; F.setPause(false); const out=[]; for(let m=1;m<=24;m++){ for(let i=0;i<30*60;i++)F.step(1/30); if(m%4) continue; const p=G.P[2]; const V=G.units.filter(u=>u.owner===2&&u.kind==='vil'); const jobs={}; V.forEach(u=>jobs[u.job]=(jobs[u.job]||0)+1); out.push([m,p.age,p.aging,Object.entries(p.res).map(([k,v])=>k+Math.round(v)).join(' '),V.length,JSON.stringify(jobs),G.units.filter(u=>u.owner===2&&F.UNIT[u.kind].tick==='sol').length, Math.round(p.eats)]); } return out; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        for r in await pg.evaluate(JS): print(r)
        await br.close()
asyncio.run(main())
