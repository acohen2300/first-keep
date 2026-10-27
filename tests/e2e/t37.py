import asyncio, json
from playwright.async_api import async_playwright
JS = """(shape)=>{const F=window.__fk;F.newGame(5);F.act('close');const G=F.G,P=G.P[0],k=F.keepOf(0);
  P.age=3;for(const r of ['f','w','s','g','i'])P.res[r]=9999;F.learnTech(0,'command');F.learnTech(0,'formations');
  G.units=G.units.filter(u=>u.owner!==0||u.kind==='vil'); const T=F.keepOf(2)||F.keepOf(1);
  const S=[];for(let i=0;i<60;i++)S.push(F.addUnit(0,'spear',k.x+40+(i%6)*8,k.y+40+((i/6)|0)*8));
  F.setPause(false);G.rel[0][1]='war';G.rel[0][2]='war';G.rel[0][3]='war';
  G.bnPlan[0]={spear:60};G.form[0]=({line:0,column:1,wedge:2,square:3})[shape]; F.rebattalion?F.rebattalion():0; 
  const tx=T.x+(k.x<T.x?-260:260),ty=T.y+(k.y<T.y?-260:260);
  for(const u of S){u.state='goto';u.px=tx;u.py=ty;u.idleT=0;}
  const snap={};const pos=S.map(u=>[u.x,u.y]);
  for(let i=0;i<110*30;i++){F.step(1/30); if(i===70*30)S.forEach((u,j)=>pos[j]=[u.x,u.y]);}
  const alive=S.filter(u=>u.hp>0), d=alive.map(u=>Math.hypot(u.x-tx,u.y-ty)).sort((a,b)=>a-b);
  const stuck=alive.filter((u,j)=>Math.hypot(u.x-pos[S.indexOf(u)][0],u.y-pos[S.indexOf(u)][1])<4 && Math.hypot(u.x-tx,u.y-ty)>60).length;
  return {shape,alive:alive.length,near:d.filter(x=>x<80).length,median:Math.round(d[(d.length/2)|0]),max:Math.round(d[d.length-1]),stuck};}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        for sh in ['line','column','wedge','square']:
            print(json.dumps(await pg.evaluate(JS, sh)))
        print(errs[:3]); await b.close()
asyncio.run(main())
