import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html')
        await pg.wait_for_timeout(1200)
        # layouts over 30 seeds: lakes, connectivity, overlaps
        r = await pg.evaluate("""() => { const F = window.__fk, out = []; 
          for (let s = 1; s <= 30; s++) { F.newGame(s * 7919); const G = F.G, nav = F.NAV;
            const ks = [0,1,2,3].map(o => F.keepOf(o)), comp = ks.map(k => nav.comp[Math.floor(k.y/10)*200+Math.floor(k.x/10)]);
            const conn = comp.every(c => c === comp[0]);
            // any node/find inside a lake?
            let bad = 0; for (const n of G.nodes) if (n.kind !== 'fish' && G.lakes.some(L => Math.hypot(n.x-L.x,n.y-L.y) < L.r+4)) bad++;
            for (const f of G.finds) if (G.lakes.some(L => Math.hypot(f.x-L.x,f.y-L.y) < L.r+10)) bad += 100;
            for (const u of G.units) if (u.owner===4 && G.lakes.some(L => Math.hypot(u.x-L.x,u.y-L.y) < L.r)) bad += 1000;
            const keepGap = Math.min(...ks.map(k => Math.min(...G.lakes.map(L => Math.hypot(k.x-L.x,k.y-L.y)-L.r))));
            const comps = new Set(G.units.filter(u=>u.owner===0||u.owner===4).map(u => nav.comp[Math.floor(u.y/10)*200+Math.floor(u.x/10)])).size;
            out.push([s, G.lakes.length, conn, bad, Math.round(keepGap), G.nodes.length, G.units.length]); }
          return out; }""")
        for x in r: print(x)
        print('errs', errs)
        await b.close()
asyncio.run(main())
