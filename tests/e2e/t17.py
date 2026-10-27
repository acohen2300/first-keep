import asyncio, sys, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; const R={};
 // A: three villagers, place four houses in a row
 F.newGame(7); let G=F.G; F.setPause(false); let k=F.keepOf(0); G.P[0].res.w+=2000; G.P[0].res.f+=500; const bs=[];
 for(let i=0;i<4;i++){ const s=F.findSpot(0,'house',k.x,k.y,60+i*5,190); const b=F.build(0,'house',s.x,s.y); if(b) bs.push(b); }
 const crew=()=>bs.map(b=>G.units.filter(u=>u.rep===b&&u.job==='repair').length);
 R.crewRightAfter=crew(); for(let i=0;i<30*40;i++)F.step(1/30); R.progAfter40=bs.map(b=>Math.round(b.prog*100)); R.crewAfter40=crew();
 // B: AI builder killed: does the AI get stuck with an unfinished site?
 F.newGame(7); G=F.G; F.setPause(false); let site=null, t=0;
 while(!site && t<30*600){ F.step(1/30); t++; site=G.blds.find(b=>b.owner===1&&b.prog<1&&b.kind!=='wall'); }
 if(site){ R.site=[site.kind,Math.round(G.t)]; G.units.filter(u=>u.rep===site).forEach(u=>{u.hp=0;u.gone=true;}); const p0=site.prog; for(let i=0;i<30*240;i++)F.step(1/30);
   R.afterKill={prog:Math.round(site.prog*100), blds:G.blds.filter(b=>b.owner===1).length, stillSite:G.blds.some(b=>b===site&&b.prog<1)}; }
 // C: orderSet and spies/priests
 F.newGame(7); G=F.G; const sp=F.addUnit(0,'spy',500,1500), pr=F.addUnit(0,'priest',520,1500), sd=F.addUnit(0,'spear',540,1500); pr.state='shrine';
 R.spyBn=sp.bn; R.orderSetHasSpy=F.orderSet().includes(sp); R.orderSetHasShrinePriest=F.orderSet().includes(pr);
 // D: AI group key
 const ai=F.addUnit(1,'spear',900,300); R.aiBn=ai.bn; return R; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); await b.close()
asyncio.run(main(sys.argv[1]))
