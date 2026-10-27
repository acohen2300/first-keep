import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0]; for(const r of ['f','w','s','g','i'])P.res[r]=99999; P.age=2;
 const k0=F.keepOf(0); for (const kind of ['house','barracks','smith','farm','library','market','stable','range','temple','school','hospital','mining','lumber','mill']) { const s=F.findSpot(0,kind,k0.x,k0.y,60,300); if(!s) continue; const b=F.build(0,kind,s.x,s.y); if(b){b.prog=1;b.hp=F.BLD[kind].hp;F.built(b);} }
 G.speed=4; F.setPause(false); F.cam.x=k0.x; F.cam.y=k0.y; F.cam.z=1.2; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text[:200]) if m.type in('error','warning') and 'TUNNEL' not in m.text else None)
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        await pg.evaluate(JS)
        for i in range(6):
            await pg.wait_for_timeout(4000)
            s=await pg.evaluate("()=>{const G=__fk.G; return {t:Math.round(G.t), blds:G.blds.filter(b=>b.owner===0&&b.hp>0).length, over:G.over, paused:G.paused, card:G.card&&G.card.type}}"); print(s)
            if i==2:
                # research things so tiers change
                await pg.evaluate("()=>{const P=__fk.G.P[0]; for(const t of __fk.TECH) if(['barracks','smith','mill','keep','library'].includes(t.at)) P.techs.add(t.id);}")
        print('errors',errs[:6]); await pg.screenshot(path='/tmp/t/b26_run.png'); await b.close()
asyncio.run(main())
