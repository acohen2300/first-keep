import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0]; for(const r of ['f','w','s','g','i'])P.res[r]=9999;
 const k=F.keepOf(0); F.cam.x=k.x; F.cam.y=k.y; F.cam.z=0.6; const z0=F.cam.z; F.act('build:house'); const R={zAfterStart:F.cam.z, same:F.cam.z===z0, ghost:!!(G.place&&G.place.at)};
 const n0=G.blds.filter(b=>b.owner===0).length; F.act('placeok'); R.built=G.blds.filter(b=>b.owner===0).length-n0; R.zAfterBuild=F.cam.z; return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); print(errs[:3]); await pg.screenshot(path='/tmp/t/b26_zoomed_build.png'); await b.close()
asyncio.run(main())
