import asyncio, sys, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); const G=F.G; F.setPause(false); const R={}; const k=F.keepOf(0);
 const vils=()=>G.units.filter(u=>u.owner===0&&u.kind==='vil');
 // 1: house gets an automatic builder and finishes
 const s=F.findSpot(0,'house',k.x,k.y,60,190); const b=F.build(0,'house',s.x,s.y);
 R.assigned = vils().filter(v=>v.job==='repair'&&v.rep===b).length; R.pjSet = vils().find(v=>v.rep===b).pj;
 let t=0; while(b.prog<1&&t<120*30){F.step(1/30);t++;} R.houseSecs=Math.round(t/30); R.houseListed=F.BLD.house.t;
 for(let i=0;i<60;i++)F.step(1/30); const bb=vils().filter(v=>v.job==='repair').length; R.stillBuilding=bb; R.builderBack=vils().find(v=>v.pj===null||v.pj===undefined)?'ok':'?';
 // 2: no villagers free => site waits; then two builders faster
 const s2=F.findSpot(0,'farm',k.x,k.y,60,190); G.P[0].res.w+=500; const b2=F.build(0,'farm',s2.x,s2.y);
 vils().forEach(v=>{ if(v.rep===b2){F.setJob(v,null);v.rep=null;} });
 for(let i=0;i<300;i++)F.step(1/30); R.waitsNoCrew = b2.prog;
 F.act('sendbld:'+b2.id); F.act('sendbld:'+b2.id); t=0; while(b2.prog<1&&t<200*30){F.step(1/30);t++;} R.farm2crewSecs=Math.round(t/30); R.farmListed=F.BLD.farm.t;
 // 3: wall line: 10 pieces, at most two builders, all finish
 G.P[0].res.s+=2000; const y0=Math.floor((k.y-120)/10); let made=[]; for(let i=0;i<10;i++){ const w=F.build(0,'wall',(Math.floor(k.x/10)-5+i)*10+5,y0*10+5); if(w)made.push(w);} 
 R.wallsMade=made.length; R.wallBuilders=vils().filter(v=>v.job==='repair'&&v.rep&&F.BLD[v.rep.kind].wallish).length;
 t=0; while(made.some(w=>w.prog<1)&&t<400*30){F.step(1/30);t++;} R.wallsDoneSecs=Math.round(t/30); R.wallsLeft=made.filter(w=>w.prog<1).length;
 R.vilCount=vils().length; return R; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); print('errors', errs[:3]); await b.close()
asyncio.run(main(sys.argv[1]))
