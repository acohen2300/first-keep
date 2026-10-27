import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, k=F.keepOf(0); const R={mode:G.mode};
 F.declareWar(0,1); for(let i=0;i<6;i++)F.addUnit(0,'spear',k.x+40,k.y-40);
 G.sel='all';
 F.openCard({type:'army'}); R.armyCard=[...document.querySelectorAll('#card button')].map(b=>b.textContent).filter(t=>/Attack/.test(t));
 const ek=F.keepOf(1); F.openCard({type:'bld',id:ek.id}); R.keepCard=[...document.querySelectorAll('#card button')].map(b=>b.textContent).filter(t=>/^Attack/.test(t));
 // radar: an army of side 1 marching on us from far away
 const e=[]; for(let i=0;i<5;i++)e.push(F.addUnit(1,'spear',ek.x,ek.y)); e.forEach(u=>{u.state='attack';u.target=0;});
 F.cam.x=k.x;F.cam.y=k.y;F.cam.z=1.2; F.setPause(false); for(let i=0;i<40;i++)F.step(1/30); F.draw();
 R.farFromKeep=Math.round(Math.hypot(e[0].x-k.x,e[0].y-k.y)); R.radar=!!window.__fk; return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); await pg.screenshot(path='/tmp/t/b25_radar.png'); print('errors',errs[:3]); await b.close()
asyncio.run(main())
