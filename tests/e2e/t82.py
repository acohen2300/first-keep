import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch()
        for w,h in [(375,667),(430,932)]:
            pg=await br.new_page(viewport={'width':w,'height':h}); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(500)
            print(w, await pg.evaluate("()=>{const T=document.querySelector('.tally'),H=document.getElementById('hud'); return {hud:H.getBoundingClientRect().width, tally:Math.round(T.getBoundingClientRect().width), kids:[...T.children].map(s=>Math.round(s.getBoundingClientRect().width)), others:[...H.children].filter(e=>e!==T).map(e=>e.id+':'+Math.round(e.getBoundingClientRect().width))}}"))
        await br.close()
asyncio.run(main())
