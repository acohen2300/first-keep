import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(99); const G=F.G; F.setPause(false); for(let i=0;i<30*60*28;i++)F.step(1/30);
 return G.P.slice(1,4).map(p=>[p.alive, p.age, Math.round(p.res.i), G.units.filter(u=>u.owner===p.id&&u.job==='iron').length, [...p.techs].filter(t=>['iron','chain','plate'].includes(t)).join('/')]); }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); print(errs[:2]); await br.close()
asyncio.run(main())
