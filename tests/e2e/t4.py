import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width':430,'height':900}, device_scale_factor=2)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(1000)
        # FISH
        r = await pg.evaluate("""() => { const F=window.__fk; F.newGame(777); const G=F.G; F.setPause(false);
          const p=G.P[0]; p.res={f:500,w:900,s:500,g:500};
          const k=F.keepOf(0), L=G.lakes.filter(L=>Math.hypot(L.x-k.x,L.y-k.y)<700 && L!==G.lakes[0])[0];
          // vil on food: strip fields/bushes/deer so only fish remain
          for (const n of G.nodes) if (n.kind!=="fish" && n.type==="food") n.amt=0; G.units=G.units.filter(u=>!(u.owner===4&&u.kind==='deer'));
          let spot=null; for (let a=0;a<6.3&&!spot;a+=0.1) for (const gap of [30,40,50]) { const x=L.x+Math.cos(a)*(L.r+gap), y=L.y+Math.sin(a)*(L.r+gap); if(!F.canPlace(0,'dock',x,y)){spot=[x,y];break;} }
          const msg1 = F.canPlace(0,'dock',L.x+L.r*3,L.y);
          const b0 = F.build(0,'dock',spot[0],spot[1]);
          return {spot, msg1, built: !!b0, lake:[L.x,L.y,L.r], dockFishNodes: G.nodes.filter(n=>n.kind==='fish' && Math.hypot(n.x-spot[0],n.y-spot[1])<150).length}; }""")
        print('fish setup', r)
        # run 20s with no dock complete -> food unchanged; then wait for dock; then count
        res = await pg.evaluate("""() => { const F=window.__fk, G=F.G; const out=[];
          for (let i=0;i<30*10;i++) F.step(1/30); out.push(['t10', Math.round(G.P[0].res.f), G.units.filter(u=>u.owner===0&&u.kind==='vil'&&u.node&&u.node.kind==='fish').length]);
          for (let i=0;i<30*60;i++) F.step(1/30); out.push(['t70', Math.round(G.P[0].res.f), G.units.filter(u=>u.owner===0&&u.kind==='vil'&&u.node&&u.node.kind==='fish').length, G.blds.filter(b=>b.kind==='dock'&&b.prog>=1).length]); return out; }""")
        print(res)
        print(errs)
        await b.close()
asyncio.run(main())
