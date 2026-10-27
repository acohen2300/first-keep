import asyncio, json
from playwright.async_api import async_playwright
JS="""(seed)=>{const F=window.__fk;F.newGame(seed);F.act('close');const G=F.G,P=G.P[0];F.setPause(false);const errs={};let n=0;
 for(let i=0;i<22*60*30;i++){ F.step(1/30); if(i%150===0){ if(i%900===0){for(const r of ['f','w','s','g','i'])P.res[r]=Math.max(P.res[r],800);} try{F.draw();}catch(e){const m=String(e.stack||e).split('\\n').slice(0,3).join(' | ');errs[m]=(errs[m]||0)+1;n++;} } }
 return {seed,n,errs,over:G.over,t:Math.round(G.t)};}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        for s in [5,11,23]:
            print(json.dumps(await pg.evaluate(JS,s))[:900])
        await b.close()
asyncio.run(main())
