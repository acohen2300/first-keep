import asyncio, json
from playwright.async_api import async_playwright
SETUP="""() => { const F=window.__fk; const run=s=>{for(let i=0;i<s*30;i++)F.step(1/30);}; F.newGame(21); F.act('close'); const G=F.G; F.setPause(false); const P=G.P[0]; P.res.f+=1e5; P.res.w+=1e5; P.res.s+=1e5; P.res.g+=1e5; P.age=3; const k=F.keepOf(0);
 const place=(kind,b,r0=90)=>{ const s=F.findSpot(0,kind,b.x,b.y,r0,400); const x=F.build(0,kind,s.x,s.y); x.prog=1; x.hp=F.BLD[kind].hp; F.built(x); return x; };
 window.T={c:place('castle',k,110), t:place('town',k,120), e:place('exchange',k,80)}; F.navRebuild(); F.makeVassal(1,0,'fair'); run(12); F.cam.x=k.x+80; F.cam.y=k.y-80; F.cam.z=1.1; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':430,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800); await pg.evaluate(SETUP); await pg.wait_for_timeout(400)
        await pg.screenshot(path='/tmp/t/b21_map.png')
        await pg.evaluate("window.__fk.openCard({type:'bld',id:window.__fk.keepOf(1).id})"); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/t/b21_vassal.png')
        print((await pg.evaluate("document.getElementById('card').innerText")).replace('\n',' | ')[:700])
        await pg.evaluate("window.__fk.openCard({type:'bld',id:T.e.id})"); await pg.wait_for_timeout(300)
        print((await pg.evaluate("document.getElementById('card').innerText")).replace('\n',' | ')[:500])
        print(errs[:3]); await br.close()
asyncio.run(main())
