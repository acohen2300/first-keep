import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        # guide: every item has a WHY
        g = await pg.evaluate("""() => { const F=window.__fk; const m=F.guideModel(); const md=F.guideMd(); return {len:md.length, hasDock: /Dock/.test(md), missing: (m.missing||'n/a')}; }""")
        print('guide', g)
        # 15 minute game with computers
        r = await pg.evaluate("""() => { const F=window.__fk; F.newGame(2024); const G=F.G; F.setPause(false); const t0=performance.now();
          for (let i=0;i<30*60*15;i++) { F.step(1/30); if (i%900===0) { G.P[0].res.f=Math.max(G.P[0].res.f,300); } }
          return {ms:Math.round(performance.now()-t0), t:Math.round(G.t), over:G.over, units:G.units.length, alive:G.P.map(p=>p.alive), scores:G.P.map(p=>Math.round(p.score.total)), vils:G.units.filter(u=>u.owner===0&&u.kind==='vil').length}; }""")
        print('15min', r)
        # save/load roundtrip incl lakes
        r2 = await pg.evaluate("""() => { const F=window.__fk, G=F.G; F.saveGame(true); const S=F.readSave(); if(!S) return 'nosave'; const L=S.lakes.length; F.loadGame(S); for (let i=0;i<300;i++) F.step(1/30); return {saved:L, lakes:F.G.lakes.length, t:Math.round(F.G.t)}; }""")
        print('save', r2)
        # cards: unit card on a deer, building card on dock info
        r3 = await pg.evaluate("""() => { const F=window.__fk; F.newGame(6); const G=F.G; const d=G.units.find(u=>u.owner===4&&u.kind==='deer'); F.openCard({type:'unit',id:d.id}); F.ui(true); const h=document.getElementById('card').innerHTML; const before=G.units.filter(u=>u.hunt===d).length; F.act('hunt:'+d.id); return {btn:/Send a hunter/.test(h), after:G.units.filter(u=>u.hunt===d).length, before}; }""")
        print('card', r3)
        r4 = await pg.evaluate("""() => { const F=window.__fk; F.openCard({type:'menu',id:'home'}); F.ui(true); const h=document.getElementById('card').innerHTML; return /Dock/.test(h); }""")
        print('home menu has dock', r4)
        print(errs); await b.close()
asyncio.run(main())
