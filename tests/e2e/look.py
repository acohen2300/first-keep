import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        print(json.dumps(await pg.evaluate(open('/tmp/t/look.js').read()))); await b.close()
asyncio.run(main())
