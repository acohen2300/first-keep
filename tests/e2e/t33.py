import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, k=F.keepOf(0), R={}; F.declareWar(0,1);
 for(let i=0;i<6;i++)F.addUnit(0,'spear',k.x+40+i*6,k.y-60);
 const foe=F.addUnit(1,'chariot',k.x+300,k.y-300); foe.state='goto'; foe.px=k.x+700; foe.py=k.y-300;   // it rides away
 F.openCard({type:'unit',id:foe.id}); F.act('qfoe:'+foe.id); F.setPause(false);
 const mine=G.units.filter(u=>u.owner===0&&u.kind==='spear'), start=[foe.x,foe.y];
 for(let i=0;i<30*25;i++)F.step(1/30);
 R.foeMoved=Math.round(Math.hypot(foe.x-start[0],foe.y-start[1])); R.foeAlive=foe.hp>0;
 R.nearFoe=mine.filter(u=>Math.hypot(u.x-foe.x,u.y-foe.y)<60).length; R.nearOldSpot=mine.filter(u=>Math.hypot(u.x-start[0],u.y-start[1])<40).length;
 R.focus=mine.filter(u=>u.focus===foe).length; return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); await b.close()
asyncio.run(main())
