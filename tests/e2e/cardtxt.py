import asyncio, sys
from playwright.async_api import async_playwright
JS="""(kind) => { const F=window.__fk; F.newGame(5); F.act('close'); const G=F.G, P=G.P[0], k=F.keepOf(0); F.setPause(true);
 P.age=3; for(const r of ['f','w','s','g','i'])P.res[r]=9999; P.goods.cloth=30; for(let i=0;i<12;i++)F.addUnit(0,'spear',k.x+60,k.y-60);
 let id=k.id; if(kind!=='keep'){const s=F.findSpot(0,kind,k.x,k.y,70,420); const b=F.build(0,kind,s.x,s.y); b.prog=1;b.hp=F.BLD[kind].hp;F.built(b); id=b.id;}
 F.openCard({type:'bld',id}); return [...document.getElementById('card').children].map(e=>Math.round(e.getBoundingClientRect().height)+' | '+e.textContent.replace(/\\s+/g,' ').slice(0,110)).join('\\n'); }"""
async def main(kind):
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(await pg.evaluate(JS, kind)); await b.close()
asyncio.run(main(sys.argv[1]))
