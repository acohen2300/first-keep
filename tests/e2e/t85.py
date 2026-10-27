import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk, R={}; const run=s=>{for(let i=0;i<s*30;i++)F.step(1/30);};
 for (const mode of ['farm','bush','both']) { F.newGame(99); const G=F.G; F.setPause(false); const P=G.P[0], k=F.keepOf(0); P.res.w+=2000; G.units.filter(u=>u.owner===0&&u.kind==='vil').forEach(u=>{u.hp=0;u.gone=true;}); run(0.1);
   const vs=[]; for(let i=0;i<6;i++) vs.push(F.addUnit(0,'vil',k.x+40,k.y-40));
   if (mode!=='bush') { for(let j=0;j<2;j++){ const s=F.findSpot(0,'farm',k.x,k.y,60,200); const b=F.build(0,'farm',s.x,s.y); b.prog=1; b.hp=120; F.built(b);} F.navRebuild(); }
   vs.forEach(v=>F.setJob(v, mode==='farm'?'farm':'food'));
   G.P.forEach(p=>{p.eats=0;}); const f0=P.res.f; let eaten=0; for(let i=0;i<180;i++){ const e=P.eats||0; run(1); eaten+= (P.eats||0)/60; }
   R[mode]=Math.round((P.res.f - f0 + eaten)/6/3); }   // food per villager per minute
 return R; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); await br.close()
asyncio.run(main())
