import asyncio
from playwright.async_api import async_playwright
JS = """() => { const F=window.__fk; F.newGame(777); const G=F.G; F.setPause(false);
  G.P[0].res={f:500,w:900,s:500,g:500};
  const k=F.keepOf(0), L=G.lakes.filter(L=>Math.hypot(L.x-k.x,L.y-k.y)<700 && L!==G.lakes[0])[0];
  const clear=()=>{ for (const n of G.nodes) if (n.kind!=='fish' && n.type==='food') n.amt=0; for (const u of G.units) if (u.owner===0) { u.node=null; u.hunt=null; } };
  const UNIT_MEAT=u=>F.UNIT[u.kind].meat; G.units=G.units.filter(u=>!(u.owner===4&&UNIT_MEAT(u))); clear();
  let spot=null; for (let a=0;a<6.3&&!spot;a+=0.1) { const x=L.x+Math.cos(a)*(L.r+30), y=L.y+Math.sin(a)*(L.r+30); if(!F.canPlace(0,'dock',x,y)){spot=[x,y];break;} }
  const out=[]; const fishers=()=>G.units.filter(u=>u.owner===0&&u.kind==='vil'&&u.node&&u.node.kind==='fish').length;
  for (let i=0;i<30*15;i++) { F.step(1/30); if (i%30===0) clear(); } out.push(['nodock t15', Math.round(G.P[0].res.f), fishers()]);
  F.build(0,'dock',spot[0],spot[1]);
  for (let i=0;i<30*80;i++) { F.step(1/30); if (i%30===0) clear(); } out.push(['dock t95', Math.round(G.P[0].res.f), fishers(), G.nodes.filter(n=>n.kind==='fish').reduce((s,n)=>s+n.amt,0)|0]);
  return out; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        print(await pg.evaluate(JS)); print(errs); await b.close()
asyncio.run(main())
