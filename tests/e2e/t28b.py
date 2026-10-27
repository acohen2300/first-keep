import asyncio, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(7); F.act('close'); const G=F.G, P=G.P[0], R={};
 // bell warnings: jump to 4:30 before the bell
 F.setPause(false); G.t=1800-301; const said=[]; for(let i=0;i<60;i++){F.step(1/30); said.push(...G.log.filter(l=>/to the bell/.test(l.text)).map(l=>l.text));}
 R.bell5=[...new Set(said)]; G.t=1800-61; for(let i=0;i<60;i++){F.step(1/30); said.push(...G.log.filter(l=>/to the bell/.test(l.text)).map(l=>l.text));} R.bells=[...new Set(said)];
 // reach the bell: you lead -> victory
 G.t=1799.9; for(let i=0;i<10;i++)F.step(1/30); R.over=G.over; R.endShown=!document.getElementById('end').hidden; R.btns=[...document.querySelectorAll('#endActs button')].filter(b=>!b.hidden).map(b=>b.textContent.replace(/\\s+/g,' '));
 // New game opens the setup card and hides the end screen; closing it brings the end screen back
 F.act('again'); R.afterAgain={end:!document.getElementById('end').hidden, card:G.card&&G.card.type}; F.act('close'); R.afterClose={end:!document.getElementById('end').hidden};
 // free play
 F.act('free'); R.free={over:G.over,flag:G.free,end:!document.getElementById('end').hidden}; const t0=G.t; for(let i=0;i<90;i++)F.step(1/30); R.freeRuns=G.t>t0;
 // save keeps free play
 F.saveGame(true); const S=F.readSave(); R.savedFree=S&&S.free;
 // another conquest: keep civ, age, techs
 P.age=3; P.techs.add('axes'); G.over='won'; G.free=false; const civ=P.civ; F.act('next'); const Q=F.G.P[0]; R.next={age:Q.age, axes:Q.techs.has('axes'), civ:Q.civ===civ, t:Math.round(F.G.t), over:F.G.over, fresh:F.G.units.filter(u=>u.owner===0).length};
 // glow
 F.G.hitT=F.G.t; F.draw&&F.draw(); R.glow='drawn';
 return R; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        print(json.dumps(await pg.evaluate(JS))); print('errors',errs[:3]); await b.close()
asyncio.run(main())
