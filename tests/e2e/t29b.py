import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; const run=s=>{for(let i=0;i<s*30;i++)F.step(1/30);}; const R={};
 // plague via caravan, quarantine blocks
 for (const quar of [false,true]) { F.newGame(11); const G=F.G; F.setPause(false); const k=F.keepOf(0), P=G.P[0]; P.res.w+=5000; P.res.s+=3000; P.age=1; 
  G.units.filter(u=>u.owner===4&&u.find&&u.kind!=='vagabond').forEach(u=>{u.hp=0;}); run(1);
  const s=F.findSpot(0,'bizc',k.x,k.y,70,260); const bz=F.build(0,'bizc',s.x,s.y); bz.prog=1; F.navRebuild(); P.goods.cloth=200;
  const f=F.stopsAll().find(f=>f.x===1000&&f.y===1490); const cv=F.addUnit(0,'caravan',bz.x,bz.y+30); F.setRoute(cv,f,true,false); G.plague={until:G.t+999};
  if (quar) F.quarantine(0); const pop0=G.units.filter(u=>u.owner===0&&F.UNIT[u.kind].cls).length; let maxSick=0; for(let i=0;i<120;i++){ run(1); maxSick=Math.max(maxSick,G.units.filter(u=>u.owner===0&&u.sick>G.t).length); }
  R[quar?'quar':'open']={leg:cv.leg, pos:[Math.round(cv.x),Math.round(cv.y)], hp:cv.hp, route:!!cv.route, maxSick, died: pop0-G.units.filter(u=>u.owner===0&&F.UNIT[u.kind].cls).length, plagueDead:P.plagueDead||0, sold: Math.round(P.res.g)}; }
 // hospital cures
 F.newGame(12); const G=F.G; F.setPause(false); const k=F.keepOf(0), P=G.P[0]; P.age=2; P.res.w+=3000; P.res.s+=3000; 
 const s=F.findSpot(0,'hospital',k.x,k.y,60,200); const h=F.build(0,'hospital',s.x,s.y); h.prog=1; h.hp=h.mx=F.BLD.hospital.hp; F.navRebuild();
 G.units.filter(u=>u.owner===0&&u.kind==='vil').slice(0,10).forEach(u=>{u.sick=G.t+60; u.x=h.x+10; u.y=h.y+30; u.job=null;});
 run(15); R.hospitalSickAfter15=G.units.filter(u=>u.owner===0&&u.sick>G.t).length;
 return R; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); print(errs[:2]); await br.close()
asyncio.run(main())
