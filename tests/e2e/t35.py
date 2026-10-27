import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':500},device_scale_factor=2)
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        await pg.evaluate("""()=>{const F=window.__fk;F.newGame(5);F.act('close');const G=F.G,P=G.P[0],k=F.keepOf(0);F.setPause(true);P.age=4;
          G.units=G.units.filter(u=>u.owner!==0);
          ['spear','sword','archer','crossbow'].forEach((kd,i)=>{F.addUnit(0,kd,k.x-60+i*28,k.y+110);});
          ['arquebus','bombard'].forEach((kd,i)=>{F.addUnit(0,kd,k.x-20+i*50,k.y+150);});
          for(const x of ['leather','chain','plate'])F.learnTech(0,x);P.uc={};
          F.cam.x=k.x;F.cam.y=k.y+130;F.cam.z=5;}""")
        await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/t/b28_gun.png'); await b.close()
asyncio.run(main())
