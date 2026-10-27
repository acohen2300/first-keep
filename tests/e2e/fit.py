import asyncio, json, sys
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(5); F.act('close'); const G=F.G, P=G.P[0], k=F.keepOf(0); F.setPause(true);
 P.age=3; for(const r of ['f','w','s','g','i'])P.res[r]=9999; P.goods.cloth=30; for(let i=0;i<12;i++)F.addUnit(0,'spear',k.x+60,k.y-60);
 const ids={}; for (const kind of Object.keys(F.BLD)) { if(['keep','wall','gate','wonder'].includes(kind)) continue; const s=F.findSpot(0,kind,k.x,k.y,70,420); if(!s) continue; const b=F.build(0,kind,s.x,s.y); if(!b) continue; b.prog=1;b.hp=F.BLD[kind].hp;F.built(b); ids[kind]=b.id; }
 ids.keep=k.id; F.navRebuild(); F.makeVassal(1,0,'fair'); const out={};
 const cards=Object.entries(ids).map(([n,id])=>[n,{type:'bld',id}]).concat([['army',{type:'army'}],['help',{type:'help'}],['setup',{type:'setup'}],['score',{type:'score'}],['ground',{type:'ground',x:k.x+200,y:k.y}],['vassal',{type:'bld',id:F.keepOf(1).id}],['node',{type:'node',id:G.nodes.find(n=>n.kind==='stone').id}],['unit',{type:'unit',id:G.units.find(u=>u.owner===0&&u.kind==='vil').id}],['find',{type:'find',id:G.finds[0].id}]]);
 for (const [n,c] of cards) { F.openCard(c); const el=document.getElementById('card'); out[n]=[el.scrollHeight, el.clientHeight]; }
 return out; }"""
async def main(W,H):
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':W,'height':H})
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        r=await pg.evaluate(JS); over={k:v for k,v in r.items() if v[0]>v[1]+1}
        print(W,H,'fits', len(r)-len(over),'of',len(r)); print(json.dumps(dict(sorted(over.items(), key=lambda kv:-kv[1][0]+kv[1][1])))); await b.close()
asyncio.run(main(int(sys.argv[1]),int(sys.argv[2])))
