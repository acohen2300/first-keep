import asyncio, json
from playwright.async_api import async_playwright
JS="""async () => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0]; for(const r of ['f','w','s','g','i'])P.res[r]=99999; P.age=3;
 const k0=F.keepOf(0); for (const kind of ['house','house','barracks','smith','farm','library','market','stable','range','temple','school','hospital','mining','lumber','mill','tower','castle','apartment','bizc','siege']) { const s=F.findSpot(0,kind,k0.x,k0.y,60,330); if(!s) continue; const b=F.build(0,kind,s.x,s.y); if(b){b.prog=1;b.hp=F.BLD[kind].hp;F.built(b);} }
 for(let i=0;i<20;i++)F.addUnit(0,['spear','archer','sword','vil'][i%4],k0.x+10*i,k0.y+60);
 F.navRebuild(); F.setPause(true); const px=M=>{let n=0,c=0;for(const v of M.values()){n+=v.width*v.height;c++;}return [c,Math.round(n/1e6*10)/10];};
 const out=[]; const T=F.TECH;
 for (const z of [0.6,0.9,1.2,1.5,1.8,2.2,2.8,3.4,4]) { F.cam.x=k0.x+30; F.cam.y=k0.y+30; F.cam.z=z; F.draw(); out.push([z, px(F.caches.SPR), px(F.caches.BSPR), px(F.caches.NSPR)]); }
 for (const t of T) P.techs.add(t.id); for (const z of [0.9,1.5,2.2,3.4]) { F.cam.z=z; F.draw(); }
 out.push(['alltech', px(F.caches.SPR), px(F.caches.BSPR), px(F.caches.NSPR)]); return out; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=3)
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        for r in await pg.evaluate(JS): print(r)
        await b.close()
asyncio.run(main())
