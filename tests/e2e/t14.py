import asyncio, sys, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(5); const G=F.G; F.setPause(false); const R={};
 G.P[1].res.s=1e6; G.units=G.units.filter(u=>u.owner===WILD0); 
 return 0; }""".replace("WILD0","4")
JS2="""() => { const F=window.__fk; F.newGame(5); const G=F.G; F.setPause(false);
 G.P[0].res.s=1e6; G.P[1].res.s=1e6; G.P[3].res.s=1e6;
 const wy=1500; const ws=[]; for(let gx=2;gx<198;gx++){ const w=F.build(1,'wall',gx*10+5,wy+5); if(w){w.prog=1;w.hp=1e9;w.mx=1e9;ws.push(w);} }
 F.navRebuild();
 // attackers: player 0 soldiers (spearmen) south of wall, ordered to a point north of it
 const us=[]; for(let i=0;i<90;i++){ const u=F.addUnit(0,"spear",1000+(i%10)*5,1520+Math.floor(i/10)*5); u.state='goto'; u.px=1000; u.py=1400; u.idleT=0; us.push(u);} 
 for(let i=0;i<30*40;i++) F.step(1/30);
 const gaps=[]; const have=new Set(ws.map(w=>Math.floor(w.x/10))); for(let gx=2;gx<198;gx++) if(!have.has(gx)) gaps.push(gx); const dead=ws.filter(w=>w.hp<=0).map(w=>Math.floor(w.x/10)); const crossed=us.filter(u=>u.hp>0&&u.y<wy).length; const where=us.filter(u=>u.hp>0&&u.y<wy).map(u=>Math.floor(u.x/10)); const alive=us.filter(u=>u.hp>0).length; const wallsLeft=ws.filter(w=>w.hp>0).length;
 return {walls:ws.length,wallsLeft,alive,crossed,gaps:gaps.slice(0,30),dead,where:where.slice(0,10)}; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS2))); print('errors', errs[:3]); await b.close()
asyncio.run(main(sys.argv[1]))
