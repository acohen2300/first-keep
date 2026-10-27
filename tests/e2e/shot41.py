import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(500)
        await pg.evaluate("()=>{const F=window.__fk;F.newGame(5);F.act('close');F.ui(true)}"); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='/tmp/t/hud375.png'); await b.close()
asyncio.run(main())
