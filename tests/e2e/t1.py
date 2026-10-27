import asyncio, json, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
        await pg.goto('file:///home/claude/first-keep/first-keep.html')
        await pg.wait_for_timeout(1500)
        print('keys', await pg.evaluate("Object.keys(window.__fk||{}).join(',')"))
        print('errs', errs[:5])
        await b.close()
asyncio.run(main())
