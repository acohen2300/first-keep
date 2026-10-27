import asyncio, sys, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        r=await pg.evaluate("""()=>{const F=window.__fk;F.newGame(5);F.act('close');const G=F.G,P=G.P[0],k=F.keepOf(0);
          P.age=3; for(const r of ['f','w','s','g','i'])P.res[r]=9999;
          const put=kind=>{const s=F.findSpot(0,kind,k.x,k.y,70,320);const b=F.build(0,kind,s.x,s.y);b.prog=1;b.hp=F.BLD[kind].hp;F.built(b);return b;};
          const out={}; out.ageOk=F.ageUp(0); for(let i=0;i<110*30;i++)F.step(1/30); out.age=P.age; out.ageName=F.AGES[P.age].name;
          const range=put('range'), siege=put('siege'), smith=put('smith'); F.navRebuild();
          out.trainA=F.train(0,'arquebus',range.id); out.trainB=F.train(0,'bombard',siege.id);
          for(let i=0;i<60*30;i++)F.step(1/30);
          out.arq=G.units.filter(u=>u.owner===0&&u.kind==='arquebus').length; out.bom=G.units.filter(u=>u.owner===0&&u.kind==='bombard').length;
          out.nameBefore=F.stats(0,'arquebus').name; F.learnTech(0,'musket'); out.nameAfter=F.stats(0,'arquebus').name; out.dmg=F.stats(0,'arquebus').dmg;
          const hp0=F.maxHpB?0:0; F.learnTech(0,'fortify'); F.learnTech(0,'starfort');
          out.err=null; return out;}""")
        print(json.dumps(r)); 
        # armour levels shot: three soldiers rows, kit 0..3
        await pg.evaluate("""()=>{const F=window.__fk,G=F.G,P=G.P[0],k=F.keepOf(0);F.setPause(true);
          G.units=G.units.filter(u=>u.owner!==0||u.kind==='vil'||u.kind==='arquebus'||u.kind==='bombard');
          const kinds=['spear','sword','archer','chariot','cata','crossbow','arquebus','bombard'];
          kinds.forEach((kd,i)=>{for(let j=0;j<1;j++)F.addUnit(0,kd,k.x-120+i*30,k.y+120);});
          F.cam.x=k.x-5;F.cam.y=k.y+120;F.cam.z=3.6;}""")
        for lvl,techs in enumerate([[],['leather'],['chain'],['plate']]):
            await pg.evaluate("(t)=>{const F=window.__fk,P=F.G.P[0];for(const x of t)F.learnTech(0,x);F.G.t+=0;P.uc={};}", techs)
            await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'/tmp/t/b28_kit{lvl}.png',clip={'x':0,'y':300,'width':390,'height':250})
        # keep age 4 look
        await pg.evaluate("()=>{const F=window.__fk,k=F.keepOf(0);F.cam.x=k.x;F.cam.y=k.y;F.cam.z=2.4;}")
        await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/t/b28_keep.png')
        print('errs',errs[:5]); await b.close()
asyncio.run(main())
