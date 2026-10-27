import asyncio, sys, json
from playwright.async_api import async_playwright
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        # start a game, close the card
        await pg.evaluate("() => { const F=window.__fk; F.newGame(7); F.act('close'); F.setPause(false); }")
        await pg.wait_for_timeout(300)
        # --- march: mixed battalion east
        r = await pg.evaluate("""() => { const F=window.__fk, G=F.G, k=F.keepOf(0); const us=[]; for (const kind of ['spear','spear','spear','chariot','chariot','ram','ram','archer','archer','archer']) us.push(F.addUnit(0,kind,k.x+40+us.length*6,k.y-60));
          for (const u of us){ u.state='goto'; u.px=k.x+500; u.py=k.y-60; u.idleT=0; } 
          let t=0; const rows=[]; for(let i=0;i<30*14;i++){ F.step(1/30); if(i%(30*3)===0) rows.push(Math.round((Math.max(...us.map(u=>u.x))-Math.min(...us.map(u=>u.x))))); }
          const gx=us.map(u=>[Math.round(u.gx),Math.round(u.gy)]); return {spread:rows, g:gx.slice(0,10)}; }""")
        print('march', json.dumps(r))
        # --- ghost pan
        r = await pg.evaluate("""() => { const F=window.__fk; F.startPlace('house'); const G=F.G; return {at:G.place.at, cam:{x:F.cam.x,y:F.cam.y}}; }""")
        print('ghost start', r)
        await pg.mouse.move(60, 200); await pg.mouse.down(); await pg.mouse.move(160, 260, steps=6); await pg.mouse.up()
        r2 = await pg.evaluate("() => { const F=window.__fk; return {at:F.G.place.at, cam:{x:F.cam.x,y:F.cam.y}}; }")
        print('after far drag (cam moves, ghost stays)', r2)
        await pg.mouse.click(60, 200)
        r3 = await pg.evaluate("() => { const F=window.__fk; return {at:F.G.place.at}; }")
        print('after tap far (ghost moves)', r3)
        await pg.screenshot(path='/tmp/t/ghost.png')
        # edge scroll: drag ghost to the left edge
        sx = await pg.evaluate("() => { const F=window.__fk; return [F.G.place.at.x, F.cam.x, F.cam.z]; }")
        # find ghost screen pos
        gp = await pg.evaluate("() => { const F=window.__fk, a=F.G.place.at, c=F.cam; const r=document.getElementById('cv').getBoundingClientRect(); return [(a.x-c.x)*c.z+r.width/2, (a.y-c.y)*c.z*0.66+r.height/2]; }")
        c0 = await pg.evaluate("() => window.__fk.cam.x")
        await pg.mouse.move(gp[0], gp[1]); await pg.mouse.down(); await pg.mouse.move(10, gp[1], steps=8); await pg.wait_for_timeout(1200); await pg.mouse.up()
        c1 = await pg.evaluate("() => window.__fk.cam.x")
        print('edge scroll cam.x', round(c0), '->', round(c1))
        # --- radar: put an enemy soldier off-screen near keep
        await pg.evaluate("() => { const F=window.__fk; F.act('cancel'); }")
        await pg.evaluate("""() => { const F=window.__fk, G=F.G, k=F.keepOf(0); F.cam.x=k.x-60; F.cam.y=k.y+150; for(let i=0;i<5;i++){ const u=F.addUnit(1,'spear',k.x+300+i*5,k.y-250); u.state='home'; } F.draw(); }""")
        await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/t/radar.png')
        # --- site mark + villager card button
        await pg.evaluate("""() => { const F=window.__fk, G=F.G, k=F.keepOf(0); G.P[0].res.w+=999; const s=F.findSpot(0,'barracks',k.x,k.y,60,190); const bb=F.build(0,'barracks',s.x,s.y); G.units.forEach(u=>{ if(u.rep===bb){ F.setJob(u,null); u.rep=null; } }); F.cam.x=k.x; F.cam.y=k.y; const v=G.units.find(u=>u.owner===0&&u.kind==='vil'); F.openCard({type:'unit',id:v.id}); }""")
        await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/t/site.png')
        txt = await pg.evaluate("() => document.getElementById('card').innerText")
        print('card:', txt.replace('\\n',' | ')[:300])
        print('errors', errs[:3]); await b.close()
asyncio.run(main(sys.argv[1]))
