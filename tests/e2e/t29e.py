import asyncio, json
from playwright.async_api import async_playwright
SETUP="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0]; for(const r of ['f','w','s','g','i'])P.res[r]=99999; P.age=2;
 const k0=F.keepOf(0); for (const kind of ['house','barracks','smith','farm','library']) { const s=F.findSpot(0,kind,k0.x,k0.y,60,300); if(!s) continue; const b=F.build(0,kind,s.x,s.y); if(b){b.prog=1;b.hp=F.BLD[kind].hp;F.built(b);} }
 F.setPause(false); for(let i=0;i<900;i++)F.step(1/30); F.saveGame(true); return {t:Math.round(G.t), blds:G.blds.filter(b=>b.owner===0&&b.hp>0).length}; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844}); pg=await ctx.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(await pg.evaluate(SETUP))
        await pg.reload(); await pg.wait_for_timeout(900)
        print(await pg.evaluate("()=>({card:__fk.G.card&&__fk.G.card.type, blds:__fk.G.blds.filter(b=>b.owner===0).length})"))
        await pg.screenshot(path='/tmp/t/b26_resume0.png')
        await pg.evaluate("()=>__fk.act('resume')"); await pg.wait_for_timeout(600)
        print(await pg.evaluate("()=>{const G=__fk.G;return {t:Math.round(G.t), blds:G.blds.filter(b=>b.owner===0&&b.hp>0).length, units:G.units.filter(u=>u.owner===0).length, keep:!!__fk.keepOf(0), cam:[Math.round(__fk.cam.x),Math.round(__fk.cam.y),__fk.cam.z]}}"))
        await pg.screenshot(path='/tmp/t/b26_resume.png'); print('errors',errs[:4]); await b.close()
asyncio.run(main())
