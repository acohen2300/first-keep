import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':375,'height':667})
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        print(await pg.evaluate("""()=>{const F=window.__fk;F.newGame(5);F.act('close');const P=F.G.P[0];for(const r of ['f','w','s','g','i'])P.res[r]=9999;P.age=3;F.openCard({type:'score'});return new Promise(r=>setTimeout(()=>{const T=document.querySelector('.tally').getBoundingClientRect();const L=[...document.querySelector('.tally').children].pop().getBoundingClientRect();const S=document.getElementById('score').getBoundingClientRect();r({tally:T.right,last:L.right,score:S.width,scoreTxt:document.getElementById('score').textContent})},300))}"""))
        await b.close()
asyncio.run(main())
