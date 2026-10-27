import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(5); const G=F.G; const C=F.NAV.comp, cell=(x,y)=>Math.floor(y/10)*200+Math.floor(x/10);
 const freeComp=(x,y)=>{ for(let r=0;r<6;r++) for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){ const c=cell(x+dx*10,y+dy*10); if(!F.NAV.solid[c]) return C[c]; } return -1; };
 const k=F.keepOf(0); const kc=freeComp(k.x,k.y-40);
 return G.nodes.filter(n=>['gold','stone','iron','bush'].includes(n.kind)&&freeComp(n.x,n.y)!==kc).map(n=>[n.kind,Math.round(n.x),Math.round(n.y), freeComp(n.x,n.y)]); }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); await br.close()
asyncio.run(main())
