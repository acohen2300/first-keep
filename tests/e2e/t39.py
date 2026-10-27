import asyncio, json
from playwright.async_api import async_playwright
JS="""()=>{const F=window.__fk;F.newGame(5);F.act('close');const G=F.G,P=G.P[0],k=F.keepOf(0);P.age=2;for(const r of ['f','w','s','g','i'])P.res[r]=9999;
 const put=kind=>{const s=F.findSpot(0,kind,k.x,k.y,70,320);const b=F.build(0,kind,s.x,s.y);b.prog=1;b.hp=F.BLD[kind].hp;F.built(b);return b;};
 const pa=put('pasture'),mill=put('mill'),wv=put('weaver');F.navRebuild(); F.setPause(false);
 const errs={};let carryW=0;
 for(let i=0;i<8*60*30;i++){F.step(1/30); if(i%30===0){ for(const u of G.units) if(u.owner===0&&u.carry>0&&!['food','wood','stone','gold','iron'].includes(u.carryType)) carryW++; try{F.cam.x=k.x;F.cam.y=k.y;F.cam.z=1;F.draw();}catch(e){errs[String(e).slice(0,80)]=1;} } }
 return {carryW,errs,types:[...new Set(G.units.filter(u=>u.carry>0).map(u=>u.carryType))]};}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        print(json.dumps(await pg.evaluate(JS))); await b.close()
asyncio.run(main())
