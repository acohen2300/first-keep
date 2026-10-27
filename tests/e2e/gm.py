import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        md = await pg.evaluate("() => window.__fk.guideMd()")
        open('/home/claude/first-keep/GUIDE.md','w').write(md); print(len(md)); await b.close()
asyncio.run(main())
