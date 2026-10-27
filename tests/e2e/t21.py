import asyncio, sys, json
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; const R={}; const run=s=>{for(let i=0;i<s*30;i++)F.step(1/30);};
 F.newGame(11); let G=F.G; F.setPause(false); const k=F.keepOf(0), P=G.P[0]; P.res.w+=5000; P.res.s+=3000; P.age=1;
 const f=F.stopsAll().sort((a,b)=>Math.hypot(a.x-k.x,a.y-k.y)-Math.hypot(b.x-k.x,b.y-k.y))[0]; G.units.filter(u=>u.find===f.id).forEach(u=>{u.hp=0;}); run(1);
 R.stop=[f.x,f.y]; F.act('tpost:'+f.id); const pt=F.postAt(f); R.pt=pt&&[pt.x,pt.y,pt.prog]; const b=G.units.find(u=>u.rep===pt); R.builder=b&&[Math.round(b.x),Math.round(b.y),b.job];
 const tr=[]; for(let i=0;i<8;i++){ run(10); tr.push(b?[Math.round(b.x),Math.round(b.y),b.job,b.scared?1:0,b.inside?1:0, Math.round(pt.prog*100)]:null);} R.track=tr;
 const cv=F.addUnit(0,'caravan',k.x+60,k.y-60); cv.route={to:f.id,s:true,rep:true,spice:true}; cv.leg='go'; cv.goods={cloth:5}; cv.from={x:k.x,y:k.y}; const ct=[]; for(let i=0;i<8;i++){run(10); ct.push([Math.round(cv.x),Math.round(cv.y),cv.leg,cv.hp>0?1:0]);} R.cart=ct;
 return R; }"""
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        print(json.dumps(await pg.evaluate(JS))); print(errs[:2]); await b.close()
asyncio.run(main(sys.argv[1]))
