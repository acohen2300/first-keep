import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0], k=F.keepOf(0), R=[];
 for(const r of ['f','w','s','g','i'])P.res[r]=9999; P.age=3;
 const s=F.findSpot(0,'brewery',k.x,k.y,60,260);const br=F.build(0,'brewery',s.x,s.y);br.prog=1;br.hp=F.BLD.brewery.hp;F.built(br);F.navRebuild();
 const v=G.units.find(u=>u.owner===0&&u.kind==='vil'); F.setJob(v,'beer',br.node); F.setPause(false);
 for(let t=0;t<12;t++){ for(let i=0;i<30*10;i++)F.step(1/30); R.push([v.job, v.node===br.node, !!v.wait, +v.carry.toFixed(1), v.carryType, +(P.goods.beer||0).toFixed(1), Math.round(br.node.amt), v.state]); }
 return {R, node:{type:br.node.type, kind:br.node.kind, rate:br.node.rate}}; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); await b.close()
asyncio.run(main())
