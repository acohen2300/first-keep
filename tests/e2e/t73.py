import asyncio, json
from playwright.async_api import async_playwright
JS="""async () => { const F=window.__fk, R={}; F.newGame(7); F.act('close'); const G=F.G; F.setPause(false); const k=F.keepOf(0); for(let i=0;i<6;i++) F.addUnit(0,'vil',k.x+30,k.y-50).job='food';
 // a forest tree cluster near home: pick the open tree nearest the keep and put the camera on it
 const t=G.nodes.filter(n=>n.kind==='tree'&&n.open&&Math.hypot(n.x-k.x,n.y-k.y)>380).sort((a,b)=>Math.hypot(a.x-k.x,a.y-k.y)-Math.hypot(b.x-k.x,b.y-k.y))[0];
 F.cam.x=t.x; F.cam.y=t.y; F.cam.z=1.3; F.draw();
 const cv=document.getElementById('cv'), r=cv.getBoundingClientRect(); const ev=(ty,x,y)=>cv.dispatchEvent(new PointerEvent(ty,{pointerId:1,pointerType:'touch',clientX:r.left+x,clientY:r.top+y,bubbles:true,isPrimary:true}));
 F.act('selmode'); const cx=r.width/2, cy=r.height/2; ev('pointerdown',cx-60,cy-40); ev('pointermove',cx+60,cy+40); ev('pointerup',cx+60,cy+40);
 const c=G.card; R.card=c&&c.type; R.trees=c&&c.trees; F.act('boxcut:3'); const cutters=G.units.filter(u=>u.patch).length; R.cutters=cutters; R.pjs=G.units.filter(u=>u.patch).map(u=>u.pj);
 const left0=G.nodes.filter(n=>n.kind==='tree'&&n.amt>0&&F.inBox?0:0).length;
 const box=G.units.find(u=>u.patch).patch; const inb=n=>n.x>=box.x0&&n.x<=box.x1&&n.y>=box.y0&&n.y<=box.y1; const t0=G.nodes.filter(n=>n.kind==='tree'&&inb(n)).length;
 let tt=0; while(G.nodes.some(n=>n.kind==='tree'&&inb(n)) && tt<30*900){ F.step(1/30); tt++; }
 R.treesInBox=t0; R.clearedSecs=Math.round(tt/30); R.left=G.nodes.filter(n=>n.kind==='tree'&&inb(n)).length; for(let i=0;i<90;i++)F.step(1/30); R.backJobs=G.units.filter(u=>u.owner===0&&u.kind==='vil').map(u=>u.job).join(',');
 R.wood=Math.round(G.P[0].res.w); return R; }"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':390,'height':844}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); print(errs[:3]); await br.close()
asyncio.run(main())
