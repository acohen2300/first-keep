import asyncio, sys, json
from playwright.async_api import async_playwright
src=open('/tmp/t/t11.py').read(); JS=src.split('JS="""')[1].split('"""')[0]
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        c = await pg.context.new_cdp_session(pg); await c.send('Profiler.enable'); await c.send('Profiler.start')
        r = await pg.evaluate(JS); res = await c.send('Profiler.stop')
        nodes = {n['id']: n for n in res['profile']['nodes']}; dt = res['profile']['timeDeltas']; samples = res['profile']['samples']
        self_t = {}
        for s, d in zip(samples, dt):
            cf = nodes[s]['callFrame']; k = cf['functionName'] + ':' + str(cf['lineNumber']); self_t[k] = self_t.get(k, 0) + d
        tot = sum(self_t.values()); print(r)
        for k, v in sorted(self_t.items(), key=lambda x: -x[1])[:22]: print(k, round(v/1000), 'ms', round(100*v/tot), '%')
        await b.close()
asyncio.run(main(sys.argv[1]))
