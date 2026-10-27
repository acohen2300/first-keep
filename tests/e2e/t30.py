import asyncio, json
from playwright.async_api import async_playwright
SETUP="""() => { const F=window.__fk; const run=s=>{for(let i=0;i<s*30;i++)F.step(1/30);}; F.newGame(11); F.act('close'); const G=F.G; F.setPause(false); const k=F.keepOf(0), P=G.P[0]; P.res.w+=5000; P.res.s+=3000; P.res.f+=2000; P.age=1;
 G.units.filter(u=>u.owner===4&&u.find&&u.kind!=='vagabond').forEach(u=>{u.hp=0;}); run(1);
 const place=(kind,r0=70)=>{ const s=F.findSpot(0,kind,k.x,k.y,r0,260); const b=F.build(0,kind,s.x,s.y); b.prog=1; b.hp=b.mx=F.BLD[kind].hp; F.navRebuild(); return b; };
 window.T={bz:place('bizc'), pa:place('pasture'), we:place('weaver'), fa:place('farm'), mk:place('market')}; T.pa.node.amt=30; P.goods.cloth=37; P.goods.beer=12; P.goods.spice=8; P.goods.wool=14;
 const f=F.stopsAll().find(f=>f.x===1000&&f.y===1490); T.f=f; T.cv=F.addUnit(0,'caravan',T.bz.x,T.bz.y+40); F.setRoute(T.cv,f,true,true); G.wx='rain'; run(2); F.cam.x=T.bz.x; F.cam.y=T.bz.y; F.cam.z=1.6; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':430,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800); await pg.evaluate(SETUP); await pg.wait_for_timeout(400)
        await pg.screenshot(path='/tmp/t/econ_map.png')
        for name, js in [('bizc',"window.__fk.openCard({type:'bld',id:T.bz.id})"),('stop',"window.__fk.openCard({type:'find',id:T.f.id})"),('cv',"window.__fk.openCard({type:'unit',id:T.cv.id})"),('farm',"window.__fk.openCard({type:'bld',id:T.fa.id})"),('keep',"window.__fk.openCard({type:'bld',id:window.__fk.keepOf(0).id})")]:
            await pg.evaluate(js); await pg.wait_for_timeout(250)
            txt=await pg.evaluate("document.getElementById('card').innerText"); print('==',name, txt.replace('\n',' | ')[:700])
            if name in ('bizc','cv','stop'): await pg.screenshot(path=f'/tmp/t/card_{name}.png')
        print(errs[:3]); await br.close()
asyncio.run(main())
