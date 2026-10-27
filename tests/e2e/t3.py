import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width':430,'height':900}, device_scale_factor=2)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(1000)
        await pg.evaluate("() => { const F=window.__fk; F.newGame(4242); F.act('card:none'); }")
        await pg.evaluate("() => { const F=window.__fk; try{ document.getElementById('card').innerHTML=''; }catch(e){} F.zoomAt(F.minZ()*1.0, 215, 400); F.setPause(true); }")
        await pg.wait_for_timeout(500)
        await pg.screenshot(path='map_all.png')
        await pg.evaluate("() => { const F=window.__fk, k=F.keepOf(0); F.cam.x=k.x+150; F.cam.y=k.y-140; F.cam.z=1.1; }")
        await pg.wait_for_timeout(500)
        await pg.screenshot(path='map_keep.png')
        print(errs)
        await b.close()
asyncio.run(main())
