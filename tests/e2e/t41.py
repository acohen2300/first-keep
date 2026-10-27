import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for W in (375,390,430):
            pg=await b.new_page(viewport={'width':W,'height':800})
            await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(500)
            r=await pg.evaluate("""()=>{const F=window.__fk;F.newGame(5);F.act('close');const P=F.G.P[0];for(const k of ['f','w','s','g','i'])P.res[k]=P.res[k]*0+9999;F.ui(true);
              const T=document.querySelector('.tally'),tr=T.getBoundingClientRect();return {tally:Math.round(tr.width),spans:[...T.children].map(s=>Math.round(s.getBoundingClientRect().width)),over:[...T.children].map(s=>Math.round(s.getBoundingClientRect().right-tr.right)),score:Math.round(document.getElementById('score').getBoundingClientRect().width)}}""")
            print(W,json.dumps(r)); await pg.close()
        await b.close()
asyncio.run(main())
