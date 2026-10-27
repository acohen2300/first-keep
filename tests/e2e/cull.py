import asyncio, json
from playwright.async_api import async_playwright
# a building whose centre is just off the left edge at high zoom must still be drawn (its pixels must show)
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, k=F.keepOf(0), R=[]; F.setPause(true); F.act('tipx');
 const cv=document.getElementById('cv'), x=cv.getContext('2d'); 
 for (const z of [2.0, 2.5, 3.2, 4]) { F.cam.z=z; const W=cv.clientWidth; // put keep centre 70 px left of the screen
   F.cam.x = k.x + (W/2 + 100)/z; F.cam.y=k.y; F.draw(); const d=x.getImageData(0, Math.round(cv.height/2 - 160), 40, 160).data; let s=0; for(let i=0;i<d.length;i+=4) s+=d[i]+d[i+1]+d[i+2]; R.push([z, Math.round(s/(d.length/4))]); }
 return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        for f in ['first-keep-b26b.html','first-keep.html']:
            await pg.goto('file:///home/claude/first-keep/'+f); await pg.wait_for_timeout(700); print(f, json.dumps(await pg.evaluate(JS)))
        await b.close()
asyncio.run(main())
