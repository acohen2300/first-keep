import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0], k=F.keepOf(0), R={};
 for(const r of ['f','w','s','g','i'])P.res[r]=99999; P.age=3;
 const put=kind=>{const s=F.findSpot(0,kind,k.x,k.y,60,260);const b=F.build(0,kind,s.x,s.y);b.prog=1;b.hp=F.BLD[kind].hp;F.built(b);return b;};
 const farm=put('farm'), brk=put('barracks'), sm=put('smith'); F.navRebuild();
 // pips: put three villagers on the farm
 for(let i=0;i<3;i++)F.addUnit(0,'vil',k.x+20+i*8,k.y+30); const V=G.units.filter(u=>u.owner===0&&u.kind==='vil'); for(let i=0;i<3;i++){F.setJob(V[i],'farm',farm.node);} R.wk=farm.node.wk;
 // research ring + dot
 F.setPause(false); for(let i=0;i<45;i++)F.step(1/30); F.ui(true);
 R.rdy=[...(G.rdy||[])];
 F.openCard({type:'bld',id:sm.id}); R.smithBtns=[...document.querySelectorAll('#card button')].map(b=>b.textContent).slice(0,6);
 // upgrades: finish two of the barracks techs
 const bt=F.TECH.filter(t=>t.at==='barracks'); R.barracksTechs=bt.length; P.techs.add(bt[0].id); const t1=F.sprite?0:0;
 R.tier1=F.upTier?F.upTier('barracks',P):'n/a';
 // node meter
 const node=G.nodes.find(n=>n.kind==='stone'); node.amt=node.max*0.4; F.openCard({type:'node',id:node.id}); R.meter=document.querySelector('#card .hp i')?.style.width;
 // villager card
 F.openCard({type:'unit',id:V[3].id}); R.vcard=[...document.querySelectorAll('#card button')].map(b=>b.textContent.replace(/\\s+/g,' ')).slice(0,9);
 F.act('vjob:'+V[3].id+',wood'); R.job=V[3].job; F.act('vgo:'+V[3].id); R.afterFirstTap=!V[3].gone; F.act('vgo:'+V[3].id); R.gone=!!V[3].gone;
 // counts
 R.top=document.getElementById('sClock').parentElement.textContent; R.bVil=document.getElementById('bVil').textContent; R.bArmy=document.getElementById('bArmy').textContent;
 return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS),indent=0)); print('errors',errs[:3]); await b.close()
asyncio.run(main())
