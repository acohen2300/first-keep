import asyncio, sys, json, os
from playwright.async_api import async_playwright
V = sys.argv[1]; JS = sys.argv[2]; SEED = sys.argv[3] if len(sys.argv) > 3 else '4063976774'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.join(V, 'index.html') + '#' + SEED); await pg.wait_for_timeout(1500)
        r = await pg.evaluate(open(JS).read())
        print(json.dumps(r, indent=1)[:int(os.environ.get('MAXOUT', '6000'))]); print('ERRS', errs[:3])
        await b.close()
asyncio.run(main())
