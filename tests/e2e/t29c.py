import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0], out={};
 const kinds=Object.keys(F.BLD).filter(k=>ART[k]); 
 for (const k of kinds) for (const up of [0,1,2]) { const c=document.createElement('canvas'); c.width=300; c.height=300; g=c.getContext('2d'); g.translate(150,200); UP=up;
   try { ART[k](P.color,0,''); } catch(e) { out[k+up]=String(e).slice(0,100); } UP=0; g=null; }
 // all techs researched, every building built, then draw
 for (const t of F.TECH) P.techs.add(t.id); P.age=4; for(const r of ['f','w','s','g','i'])P.res[r]=99999;
 const k0=F.keepOf(0); for (const k of kinds) { if(['keep','wonder','town','castle'].includes(k)) continue; const s=F.findSpot(0,k,k0.x,k0.y,60,330); if(!s) continue; const b=F.build(0,k,s.x,s.y); if(b){b.prog=1;b.hp=F.BLD[k].hp;F.built(b);} }
 F.navRebuild(); F.cam.x=k0.x;F.cam.y=k0.y;F.cam.z=1; F.setPause(false); for(let i=0;i<30;i++)F.step(1/30);
 let derr=null; try{ F.draw(); }catch(e){derr=String(e).slice(0,200)}
 out.draw=derr; out.keepAlive=G.blds.some(b=>b.kind==='keep'&&b.owner===0&&b.hp>0); return out; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text[:150]) if m.type=='error' and 'TUNNEL' not in m.text else None)
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); print('errors',errs[:5]); await pg.screenshot(path='/tmp/t/b26_all.png'); await b.close()
asyncio.run(main())
