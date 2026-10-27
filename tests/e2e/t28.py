import asyncio, json, sys
from playwright.async_api import async_playwright
JS="""(seed) => { const F=window.__fk; F.newGame(seed); const G=F.G; F.setPause(false); const out=[]; let fires=0, sick=0, msgs=new Set();
 const t0=performance.now();
 for(let i=0;i<30*60*20;i++){ F.step(1/30); if(i%30===0){ fires+=G.blds.filter(b=>b.fire>0).length; sick+=G.units.filter(u=>u.sick>G.t).length; G.log.forEach(m=>msgs.add(m.text.slice(0,40))); }
   if(i%(30*300)===30*300-1) out.push([Math.round(G.t/60), G.P.slice(1,4).map(p=>{const o=p.id, c=k=>G.blds.filter(b=>b.owner===o&&b.kind===k&&b.prog>=1).length; return [p.age, c('bizc'),c('pasture'),c('weaver'),c('brewery'),c('tpost'), G.units.filter(u=>u.owner===o&&u.kind==='caravan'&&u.route).length, Math.round(p.res.g), Object.values(p.goods).map(Math.floor).join('/'), p.health].join(' ')}), F.stopsAll().map(f=>f.owner===null?'-':f.owner).join('')]); }
 return {out, fires, sick, ms:Math.round(performance.now()-t0), alive:G.P.map(p=>p.alive), msgs:[...msgs].filter(m=>/Plague|Sick|Fire|burn|harvest|Drought|Robbers|caravan/i.test(m)).slice(0,14)}; }"""
async def main(path):
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        for s in (2024, 99):
            r=await pg.evaluate(JS, s); print(s, r['ms'],'ms', r['alive'], 'fires',r['fires'],'sick',r['sick'])
            for x in r['out']: print('  ', x)
            print('  ', r['msgs'])
        print('errors', [e for e in errs if 'TUNNEL' not in e][:3]); await br.close()
asyncio.run(main(sys.argv[1]))
