import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk, R={}; const run=s=>{for(let i=0;i<s*30;i++)F.step(1/30);};
 F.newGame(7); let G=F.G; F.setPause(false); const k=F.keepOf(0), P=G.P[0]; P.res.w+=3000; P.res.s+=2000; P.age=1; for(let i=0;i<8;i++){const v=F.addUnit(0,'vil',k.x+30,k.y-50); v.job='wood';}
 // a farm built by three: all three farm it
 const s=F.findSpot(0,'farm',k.x,k.y,70,260); const fa=F.build(0,'farm',s.x,s.y); F.act('sendbld:'+fa.id); F.act('sendbld:'+fa.id); run(30);
 R.farmers=G.units.filter(u=>u.node===fa.node).length; R.farmWk=fa.node.wk;
 // a mine built by two near stone: both mine
 const st=G.nodes.find(n=>n.kind==='stone'); const s2=F.findSpot(0,'mining',st.x,st.y,30,70); const mi=F.build(0,'mining',s2.x,s2.y); F.act('sendbld:'+mi.id); run(40);
 R.miners=G.units.filter(u=>u.owner===0&&u.kind==='vil'&&(u.job==='stone'||u.job==='gold'||u.job==='iron')).map(u=>u.job);
 // iron: deposits exist, market sells iron
 R.ironNodes=G.nodes.filter(n=>n.kind==='iron').length; R.bushes=G.nodes.filter(n=>n.kind==='bush').length; R.stone=G.nodes.filter(n=>n.kind==='stone').length; R.gold=G.nodes.filter(n=>n.kind==='gold').length;
 // hints retire
 F.SET.learned={}; const tip0=[]; for(let i=0;i<4;i++){ F.act('move:wood'); tip0.push(F.SET.learned['job:wood']); } R.learned=tip0;
 // AI iron over 15 min
 F.newGame(2024); G=F.G; F.setPause(false); run(60*15); R.aiIron=G.P.slice(1,4).map(p=>[p.age, Math.round(p.res.i), G.units.filter(u=>u.owner===p.id&&u.job==='iron').length, [...p.techs].filter(t=>['iron','chain'].includes(t)).join('/')]);
 return R; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':375,'height':667}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("()=>{window.__fk.newGame(3); window.__fk.act('close');}"); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/t/b24_375.png')
        print(json.dumps(await pg.evaluate(JS))); print(errs[:3]); await br.close()
asyncio.run(main())
