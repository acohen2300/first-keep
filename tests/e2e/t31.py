import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0], k=F.keepOf(0), R={};
 for(const r of ['f','w','s','g','i'])P.res[r]=9999; P.age=3;
 const put=(kind,x,y)=>{const s=F.findSpot(0,kind,x??k.x,y??k.y,60,260);const b=F.build(0,kind,s.x,s.y);b.prog=1;b.hp=F.BLD[kind].hp;F.built(b);return b;};
 const h=put('house'); F.navRebuild();
 // a villager next to it
 const V=G.units.filter(u=>u.owner===0&&u.kind==='vil'); V[0].x=h.x+20; V[0].y=h.y+18; V[1].x=h.x-300; V[1].y=h.y;
 F.ignite(h,'test'); R.helpers=V.filter(v=>v.rep===h).length; R.farOneCame=V[1].rep===h; R.banner=G.log[0].act;
 F.act('douse:'+h.id); R.afterSend=G.units.filter(v=>v.rep===h&&v.fireman).length;
 // big fire: deaths at most one
 let deaths=0; const fires=[]; for (let trial=0;trial<30;trial++){ const b=put('house'); F.navRebuild(); for(let i=0;i<3;i++){const v=F.addUnit(0,'vil',b.x+15,b.y+15);} F.ignite(b,'it spread'); const before=G.units.filter(u=>u.owner===0&&u.hp>0).length; F.act('douse:'+b.id); F.setPause(false); for(let i=0;i<30*25;i++)F.step(1/30); const after=G.units.filter(u=>u.owner===0&&u.hp>0).length; fires.push(before-after); b.hp=0; for(let i=0;i<5;i++)F.step(1/30); }
 R.deathsPerFire=fires; R.maxDeaths=Math.max(...fires);
 // brewery from food
 const br=put('brewery'); F.navRebuild(); const v=G.units.find(u=>u.owner===0&&u.kind==='vil'&&u.hp>0); F.setJob(v,'beer',br.node); const f0=P.res.f, b0=P.goods.beer; for(let i=0;i<30*200;i++)F.step(1/30); R.carry=+v.carry.toFixed(1); R.beerMade=+(P.goods.beer-b0).toFixed(1); R.foodUsed=Math.round(f0-P.res.f);
 // market: goods + venture
 const m=put('market'); F.navRebuild(); P.goods.cloth=30; F.openCard({type:'bld',id:m.id}); R.marketBtns=[...document.querySelectorAll('#card button')].map(b=>b.textContent.replace(/\\s+/g,' ')).slice(0,20);
 return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); print('errors',errs[:3]); await b.close()
asyncio.run(main())
