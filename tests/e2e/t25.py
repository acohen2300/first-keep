import asyncio, json
from playwright.async_api import async_playwright
FELL="""() => { const F=window.__fk; F.newGame(7); const G=F.G; F.setPause(false);
 const trees=G.nodes.filter(n=>n.kind==='tree'); const R={trees:trees.length};
 const ts=[]; for(let i=0;i<5;i++){ F.navRebuild(); const a=performance.now(); F.navRebuild(); ts.push(performance.now()-a); }
 R.rebuildMs=Math.round(Math.min(...ts)*10)/10;
 trees.slice(0,100).forEach(n=>n.amt=0); const a=performance.now(); F.step(1/30); R.stepWith100Felled=Math.round((performance.now()-a)*10)/10;
 const b=performance.now(); F.step(1/30); R.stepNext=Math.round((performance.now()-b)*10)/10; return R; }"""
SAVE="""() => { const F=window.__fk; F.newGame(7); F.G.t=60; F.saveGame(true); const k='firstkeep.save'; const S=JSON.parse(localStorage.getItem(k));
 const ok=!!F.readSave(); S.v=23; localStorage.setItem(k,JSON.stringify(S)); const old=F.readSave();
 return {sameVersionOpens:ok, olderOpens:!!old, keptAside:!!localStorage.getItem(k+'.old'), mainCleared:localStorage.getItem(k)===null}; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(FELL))); print(json.dumps(await pg.evaluate(SAVE))); print('errors',errs[:3]); await b.close()
asyncio.run(main())
