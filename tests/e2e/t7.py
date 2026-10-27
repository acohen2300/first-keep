import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900}, device_scale_factor=2)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        # formation: 60 soldiers, 2 battalions, at home, then sent
        await pg.evaluate("""() => { const F=window.__fk; F.newGame(31); const G=F.G; F.setPause(false); G.P[0].res={f:9999,w:9999,s:9999,g:9999};
          const k=F.keepOf(0); for (let i=0;i<60;i++) { const u=F.addUnit(0, i%3? 'spear':'sword', k.x+60+Math.random()*30, k.y-60); u.state='home'; }
          for (let i=0;i<60;i++) F.step(1/30);
          for (let i=0;i<30*14;i++) F.step(1/30);
          F.act('close'); F.setPause(true); F.cam.x=k.x+120; F.cam.y=k.y-110; F.cam.z=1.3; }""")
        await pg.wait_for_timeout(400); await pg.screenshot(path='grid_home.png')
        r = await pg.evaluate("""() => { const F=window.__fk, G=F.G; F.setPause(false); const k=F.keepOf(0);
          F.act('close'); F.act('sendto:all,900,1200'); for (let i=0;i<30*9;i++) F.step(1/30); F.act('close'); F.setPause(true); F.cam.x=700; F.cam.y=1400; F.cam.z=0.9;
          const s=G.units.filter(u=>u.owner===0&&F.UNIT[u.kind].tick==='sol'); return [s.length, s.filter(u=>u.state==='goto').length, Math.round(s.reduce((a,u)=>a+u.x,0)/s.length), Math.round(s.reduce((a,u)=>a+u.y,0)/s.length)]; }""")
        print(r)
        await pg.wait_for_timeout(400); await pg.screenshot(path='grid_march.png')
        print(errs); await b.close()
asyncio.run(main())
