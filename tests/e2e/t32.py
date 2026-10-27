import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0], k=F.keepOf(0), R={};
 for(const r of ['f','w','s','g','i'])P.res[r]=9999; P.age=2;
 for(let i=0;i<8;i++)F.addUnit(0,'spear',k.x+40+i*6,k.y+60); for(let i=0;i<5;i++)F.addUnit(0,'chariot',k.x+40+i*6,k.y+80); for(let i=0;i<3;i++)F.addUnit(0,'archer',k.x+40+i*6,k.y+100);
 // quick send on the ground: 4 spearmen, 0 archers, all chariots
 const gx=k.x+300, gy=k.y-200; F.openCard({type:'ground',x:gx,y:gy});
 R.ground=[...document.querySelectorAll('#card .qs')].map(e=>e.textContent.replace(/\\s+/g,' '));
 for(let i=0;i<4;i++)F.act('qsn:spear,-'); for(let i=0;i<3;i++)F.act('qsn:archer,-'); F.ui(true);
 R.sendBtn=[...document.querySelectorAll('#card button')].map(b=>b.textContent).filter(t=>/^Send/.test(t));
 F.act('qgo:'+gx+','+gy); R.sent=G.units.filter(u=>u.owner===0&&u.state==='goto').map(u=>u.kind).reduce((a,k)=>(a[k]=(a[k]||0)+1,a),{});
 // enemy building: attack with odds
 F.declareWar(0,1); const ek=F.keepOf(1); F.openCard({type:'bld',id:ek.id}); R.attackBtn=[...document.querySelectorAll('#card button')].map(b=>b.textContent).filter(t=>/^Attack with/.test(t));
 // council: build, research command, set Alpha = 5 chariots, Beta = 8 spear
 const s=F.findSpot(0,'council',k.x,k.y,60,300); const c=F.build(0,'council',s.x,s.y); c.prog=1;c.hp=F.BLD.council.hp;F.built(c);F.navRebuild();
 F.openCard({type:'bld',id:c.id}); R.councilBefore=[...document.querySelectorAll('#card button')].map(b=>b.textContent).filter(t=>/Command|Formations/.test(t));
 P.techs.add('command'); F.openCard({type:'bld',id:c.id}); F.act('bned:0'); for(let i=0;i<5;i++)F.act('bnn:chariot,+'); F.act('bned:1'); for(let i=0;i<8;i++)F.act('bnn:spear,+');
 R.alpha=G.units.filter(u=>u.owner===0&&u.bn===0).length; R.beta=G.units.filter(u=>u.owner===0&&u.bn===1).length; R.plan=G.bnPlan.slice(0,2);
 P.techs.add('formations'); F.act('bned:0'); F.act('bnform'); F.act('bnform'); R.formAlpha=G.form[0];
 // send Alpha (wedge) from quick send
 F.openCard({type:'ground',x:gx-200,y:gy}); F.act('qsfrom:0'); F.ui(true); R.alphaPick=[...document.querySelectorAll('#card .qs')].map(e=>e.textContent.replace(/\\s+/g,' '));
 F.act('qgo:'+(gx-200)+','+gy); F.setPause(false); for(let i=0;i<60;i++)F.step(1/30);
 const A=G.units.filter(u=>u.owner===0&&u.bn===0); R.alphaGoing=A.every(u=>u.state==='goto'); R.wedgeOffsets=A.map(u=>[Math.round(u.gx||0),Math.round(u.gy||0)]);
 // save/load keeps plans
 F.saveGame(true); const S=F.readSave(); R.saved={plan:!!S.bnPlan, form:S.form[0]};
 return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':375,'height':667})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); 
        await pg.evaluate("()=>{const F=__fk;F.openCard({type:'ground',x:F.keepOf(0).x+300,y:F.keepOf(0).y-200});}"); await pg.wait_for_timeout(200); await pg.screenshot(path='/tmp/t/b27_qs.png')
        await pg.evaluate("()=>{const F=__fk;const c=F.G.blds.find(b=>b.kind==='council');F.openCard({type:'bld',id:c.id});}"); await pg.wait_for_timeout(200); await pg.screenshot(path='/tmp/t/b27_council.png')
        print('errors',errs[:3]); await b.close()
asyncio.run(main())
