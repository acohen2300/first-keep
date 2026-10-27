import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk, R={};
 R.seeds=[]; for (const s of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]) { const t0=performance.now(); F.newGame(s); const G=F.G; const ms=Math.round(performance.now()-t0);
   const trees=G.nodes.filter(n=>n.kind==='tree').length, open=G.nodes.filter(n=>n.kind==='tree'&&n.open).length;
   const k=G.P.slice(0,4).map(p=>F.keepOf(p.id)); const C=F.NAV.comp, cell=(x,y)=>Math.floor(y/10)*200+Math.floor(x/10);
   const freeComp=(x,y)=>{ for(let r=0;r<6;r++) for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){ const c=cell(x+dx*10,y+dy*10); if(!F.NAV.solid[c]) return C[c]; } return -1; };
   const kc=freeComp(k[0].x, k[0].y-40); const keepsOK=k.every(b=>freeComp(b.x,b.y-40)===kc);
   const cut=G.finds.filter(f=>freeComp(f.x,f.y)!==kc).map(f=>f.kind);
   const res=G.nodes.filter(n=>(n.kind==='gold'||n.kind==='stone'||n.kind==='iron'||n.kind==='bush')&&freeComp(n.x,n.y)!==kc).length;
   R.seeds.push([s,ms,trees,open,keepsOK,cut.join('/')||'-',res]); }
 return R; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':390,'height':844}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        r=await pg.evaluate(JS); [print(x) for x in r['seeds']]
        await pg.evaluate("()=>{const F=window.__fk; F.newGame(3); F.act('close'); F.cam.z=0.3; F.cam.x=1000; F.cam.y=1000;}"); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/t/forest_far.png')
        await pg.evaluate("()=>{const F=window.__fk; const k=F.keepOf(0); F.cam.z=1.0; F.cam.x=k.x+250; F.cam.y=k.y-250;}"); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/t/forest_near.png')
        print(errs[:3]); await br.close()
asyncio.run(main())
