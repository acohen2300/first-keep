import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        pg.on('pageerror',lambda e:print('PAGEERR',str(e)[:300])); pg.on('console',lambda m:print('C',m.text[:200]) if m.type=='error' and 'ERR_TUNNEL' not in m.text else None)
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800); await b.close()
asyncio.run(main())
