import asyncio, sys, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; const R={}; const run=s=>{for(let i=0;i<s*30;i++)F.step(1/30);};
 F.newGame(11); let G=F.G; F.setPause(false); const k=F.keepOf(0), P=G.P[0]; P.res.w+=5000; P.res.s+=3000; P.res.f+=3000; P.age=1;
 const V=()=>G.units.filter(u=>u.owner===0&&u.kind==='vil'); for(let i=0;i<9;i++) F.addUnit(0,'vil',k.x+20,k.y-40);
 const place=(kind,r0=70)=>{ const s=F.findSpot(0,kind,k.x,k.y,r0,260); return s&&F.build(0,kind,s.x,s.y); };
 const pa=place('pasture'), we=place('weaver'), br=place('brewery'), bz=place('bizc'), fa=place('farm'), mk=place('market');
 run(70); R.built=[pa,we,br,bz,fa,mk].map(b=>b&&Math.round(b.prog*100));
 R.woolStart=pa.node.amt; F.sendVil(0,pa.node.id); F.setCrop(fa,'barley'); F.sendVil(0,fa.node.id); F.sendVil(0,we.node.id); F.sendVil(0,br.node.id);
 run(90); R.goods90={...P.goods}; R.sheep=pa.sheep;
 // spring shearing + stale beer
 P.goods.beer=40; const sh0=pa.node.amt, sp0=pa.sheep; F.seasonTurn(); R.beerAfterTurn=P.goods.beer;
 // stop: clear guards, post, caravan route
 const f=F.stopsAll().sort((a,b)=>Math.hypot(a.x-k.x,a.y-k.y)-Math.hypot(b.x-k.x,b.y-k.y))[0]; G.units.filter(u=>u.owner===4&&u.find&&u.kind!=='vagabond').forEach(u=>{u.hp=0;});
 run(1); R.canPost=F.canPlace(0,'tpost',f.x,f.y); F.act('tpost:'+f.id); run(60); const pt=F.postAt(f); R.postProg=pt&&Math.round(pt.prog*100);
 run(2); R.stopOwner=f.owner; const g0=P.res.g; run(60); R.postIncome60=Math.round(P.res.g-g0);
 P.goods.cloth=40; P.goods.beer=10; const cv=F.addUnit(0,'caravan',bz.x,bz.y+30); F.setRoute(cv,f,true,true); const g1=P.res.g; let t=0; const legs=[]; while(t<30*240){F.step(1/30);t++; if(t%300===0)legs.push(cv.leg);} R.caravanLegs=legs.join(''); R.gold240=Math.round(P.res.g-g1-120*4); R.spice=Math.floor(P.goods.spice||0); R.clothLeft=Math.floor(P.goods.cloth);
 // fire
 const h=place('house',90); run(25); R.houseDone=h.prog>=1; F.ignite(h,'test'); R.firemen=V().filter(v=>v.fireman).length; run(20); R.fireOut=!(h.fire>0); R.houseHp=Math.round(h.hp/h.mx*100);
 // health: outbreak + hospital
 F.outbreak(0,0.5,false); R.sickNow=G.units.filter(u=>u.owner===0&&u.sick>G.t).length; run(30); R.sick30=G.units.filter(u=>u.owner===0&&u.sick>G.t).length;
 // supply + rations
 for(let i=0;i<5;i++)F.addUnit(0,'spear',k.x+60,k.y-90); P.goods.beer=20; P.goods.spice=20; run(3); const sp=G.units.find(u=>u.owner===0&&u.kind==='spear'); R.sup=sp.sup; R.ration=P.ration; R.dmg=F.dmgOf(sp).toFixed(2);
 // weather
 G.wx='rain'; R.rainRng=F.rngOf(F.addUnit(0,'archer',k.x,k.y)).toFixed(1); G.wx='clear';
 R.health=P.health; R.risk=F.sickRisk(0).toFixed(3);
 return R; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        try: print(json.dumps(await pg.evaluate(JS)))
        except Exception as e: print('EXC', str(e)[:600])
        print('errors', errs[:3]); await b.close()
asyncio.run(main(sys.argv[1]))
