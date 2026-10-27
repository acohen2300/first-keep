import asyncio, sys
from playwright.async_api import async_playwright
JS = """() => { const F=window.__fk; F.newGame(9001); const G=F.G; F.setPause(false);
  const vs=G.units.filter(u=>u.owner===0&&u.kind==='vil');
  // only game for food: remove bushes
  for (const n of G.nodes) if (n.kind==='bush') n.amt=0;
  vs.forEach(v=>{v.job='food';v.node=null});
  const k=F.keepOf(0), deer0=G.units.filter(u=>u.owner===4&&u.kind==='deer'&&Math.hypot(u.x-k.x,u.y-k.y)<420).length;
  const out=[]; let flips=0, lastD=null; const log=[];
  for (let i=0;i<30*150;i++) { F.step(1/30);
    if (i%300===0) log.push(vs.map(v=>[v.hunt?(v.hunt.kind+':'+Math.round(Math.hypot(v.x-v.hunt.x,v.y-v.hunt.y))+':'+Math.round(v.hunt.hp)):'-', v.node&&v.node.kind, Math.round(v.carry), v.scared?'S':'', v.idle?'I':'']).join(' | '));
    if (i%15===0) { const v=vs[0]; if (v.hunt && v.hunt.hp>0) { const d=Math.hypot(v.x-v.hunt.x,v.y-v.hunt.y); if (lastD!==null && Math.sign(d-lastD)!==0) {} lastD=d; } } }
  const deer1=G.units.filter(u=>u.owner===4&&u.kind==='deer'&&Math.hypot(u.x-k.x,u.y-k.y)<420).length;
  const v0=vs[0]; const th=G.threats.filter(t=>Math.hypot(t.x-v0.x,t.y-v0.y)<130).map(t=>[t.kind,t.owner,Math.round(Math.hypot(t.x-v0.x,t.y-v0.y)),t.state]); const vi={x:v0.x|0,y:v0.y|0,inside:v0.inside,hid:v0.hid, ht:v0.hurtT, t:G.t}; const r=112; let n=0; for (const t of G.threats) if (Math.hypot(t.x-v0.x,t.y-v0.y)<r && F.UNIT[t.kind]) n++; const dbg={scared:v0.scared,n,hurtAgo:G.t-(v0.hurtT||-99), thr:G.threats.length, hp:v0.hp}; return {dbg,th,vi,log: log.slice(-1), deer0,deer1,food:Math.round(G.P[0].res.f), gathered: Math.round(G.P[0].gathered), meat:G.nodes.filter(n=>n.kind==='meat').length}; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        print(path.split('/')[-1], await pg.evaluate(JS), errs); await b.close()
asyncio.run(main(sys.argv[1]))
