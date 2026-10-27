import asyncio, sys
from playwright.async_api import async_playwright
JS=sys.argv[2] if len(sys.argv)>2 else ""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        await pg.evaluate("()=>{const F=window.__fk;F.newGame(5);F.act('close');F.setPause(false);for(let i=0;i<90;i++)F.step(1/30);F.setPause(true);"+JS+"}")
        await pg.wait_for_timeout(400); await pg.screenshot(path=sys.argv[1]); print(errs[:3]); await b.close()
asyncio.run(main())
