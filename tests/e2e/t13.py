import asyncio, sys, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; const R={};
 // AI health: blds, age, army at 6/10/14 min, seed 2024 and 99, player alive via keeping fed
 R.ai=[]; for (const seed of [2024,99]) { F.newGame(seed); const G=F.G; F.setPause(false); const row=[];
   for (let i=0;i<30*60*14;i++){ F.step(1/30); if(i%(30*240)===30*240-1){ row.push(G.P.slice(1,4).map(p=>[G.blds.filter(b=>b.owner===p.id&&b.prog>=1).length,G.blds.filter(b=>b.owner===p.id&&b.prog<1).length,p.age,G.units.filter(u=>u.owner===p.id&&F.UNIT[u.kind].tick==='sol').length,G.units.filter(u=>u.owner===p.id&&u.kind==='vil').length].join('/'))); } }
   R.ai.push(row); }
 // save/load with a site mid-build
 F.newGame(7); let G=F.G; F.setPause(false); const k=F.keepOf(0); const s=F.findSpot(0,'barracks',k.x,k.y,60,190); G.P[0].res.w+=500; const b=F.build(0,'barracks',s.x,s.y); for(let i=0;i<90;i++)F.step(1/30);
 R.midProg=Math.round(b.prog*100); F.saveGame(true); const S=F.readSave(); F.loadGame(S); G=F.G; const b2=G.blds.find(x=>x.kind==='barracks'&&x.owner===0); const v=G.units.find(u=>u.job==='repair'); R.loaded={prog:Math.round(b2.prog*100), builderRepOk: !!(v&&v.rep&&v.rep.id===b2.id)};
 for(let i=0;i<900;i++)F.step(1/30); R.afterLoad=Math.round(b2.prog*100);
 return R; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        r=await pg.evaluate(JS); print(json.dumps(r)); print('errors', errs[:3]); await b.close()
asyncio.run(main(sys.argv[1]))
