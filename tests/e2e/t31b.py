import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0], k=F.keepOf(0), R={};
 for(const r of ['f','w','s','g','i'])P.res[r]=9999;
 const s=F.findSpot(0,'house',k.x,k.y,60,260);const h=F.build(0,'house',s.x,s.y);h.prog=1;h.hp=F.BLD.house.hp;F.built(h);F.navRebuild();
 const V=G.units.filter(u=>u.owner===0&&u.kind==='vil'); R.n=V.length; R.jobs=V.map(v=>v.job+'/'+(v.rep?v.rep.id:'-')); V[0].x=h.x+20; V[0].y=h.y+18;
 F.ignite(h,'test'); R.after1=V.map(v=>v.job+'/'+(v.rep===h)); F.act('douse:'+h.id); R.after2=V.map(v=>v.job+'/'+(v.rep===h)+'/'+!!v.fireman); return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); await b.close()
asyncio.run(main())
