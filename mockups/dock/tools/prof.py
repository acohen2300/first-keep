import asyncio, sys, json, collections
from playwright.async_api import async_playwright
V = sys.argv[1]; MIN = int(sys.argv[2]); PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
STEP = "(() => { $rich(0); const H = FK.seatOf(0); if (H) H.hp = H.hpMax; let n = 0; $run(60, () => { if (n++ % 40 === 0) { AI.think(0); if (H) H.hp = H.hpMax; } }); return FK.units().length; })()"
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}); await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#2183249118'); await pg.wait_for_timeout(1000)
        await pg.evaluate("ECON.setBell(Infinity)")
        for m in range(MIN): n = await pg.evaluate(STEP)
        cdp = await pg.context.new_cdp_session(pg); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', {'interval': 200}); await cdp.send('Profiler.start')
        await pg.evaluate("(() => { FK.pause(false); let n = 0; $run(20, () => {}); })()")
        await pg.wait_for_timeout(3000)
        prof = (await cdp.send('Profiler.stop'))['profile']
        nodes = {x['id']: x for x in prof['nodes']}; self_t = collections.Counter(); dt = prof['timeDeltas']
        for sid, d in zip(prof['samples'], dt): x = nodes[sid]['callFrame']; self_t[(x['functionName'] or '(anon)', x['url'].split('/')[-1], x['lineNumber'] + 1)] += d
        # inclusive time
        parent = {}
        for x in prof['nodes']:
            for c in x.get('children', []): parent[c] = x['id']
        inc = collections.Counter()
        for sid, d in zip(prof['samples'], dt):
            seen = set(); i = sid
            while i is not None:
                x = nodes[i]['callFrame']; key = (x['functionName'] or '(anon)', x['url'].split('/')[-1], x['lineNumber'] + 1)
                if key not in seen: inc[key] += d; seen.add(key)
                i = parent.get(i)
        tot = sum(dt); print('units', n, 'total ms', tot // 1000)
        print('SELF'); [print(round(v / tot * 100, 1), k) for k, v in self_t.most_common(18)]
        print('INCL'); [print(round(v / tot * 100, 1), k) for k, v in inc.most_common(40) if k[1]]
        await b.close()
asyncio.run(go())
