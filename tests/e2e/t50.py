import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':390,'height':844}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("window.__vib=[]; navigator.vibrate=(x)=>{window.__vib.push(x); return true;};")
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        # frames per second paused vs running
        fps = await pg.evaluate("""() => new Promise(res => { const F=window.__fk; F.newGame(3); F.act('close'); const count = (ms) => new Promise(r => { let n=0; const t0=performance.now(); const f=()=>{ n++; if (performance.now()-t0<ms) requestAnimationFrame(f); else r(n); }; requestAnimationFrame(f); }); 
          F.setPause(true); setTimeout(async () => { const d0 = window.__fk.G.tick; const draws0 = performance.now(); let k=0; const orig = window.__fk.draw; res({}); }, 100); })""")
        # measure draw calls via wrapping ctx.fillRect count? simpler: count frames with a rAF probe is not the game's loop; instead sample G frames via draw counter
        r = await pg.evaluate("""async () => { const F=window.__fk; let n=0; const c=document.getElementById('cv').getContext('2d'); const o=c.setTransform.bind(c); c.setTransform=(...a)=>{n++; return o(...a);}; 
          F.setPause(true); await new Promise(r=>setTimeout(r,1500)); n=0; await new Promise(r=>setTimeout(r,1000)); const paused=n; F.setPause(false); n=0; await new Promise(r=>setTimeout(r,1000)); return {pausedDraws:paused, runningDraws:n}; }""")
        print('draws/s', r)
        # weather + lightning + haptics
        r2 = await pg.evaluate("""async () => { const F=window.__fk, G=F.G; G.wx='rain'; G.t = 180*1+10; F.cam.z=1.6; for(let i=0;i<5;i++) F.step(1/30); 
          const k=F.keepOf(0); G.bolts=[{x:F.cam.x,y:F.cam.y,t:G.t,seed:0.42}]; F.draw(); return {bolts:G.bolts.length}; }""")
        await pg.wait_for_timeout(50); await pg.screenshot(path='/tmp/t/w_rain.png')
        await pg.evaluate("()=>{const F=window.__fk,G=F.G; G.wx='frost'; G.bolts=[];}"); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/t/w_snow.png')
        r3 = await pg.evaluate("""() => { const F=window.__fk, G=F.G; F.SET.vibe=true; const k=F.keepOf(0); F.sfx('done'); F.sfx('horn'); return window.__vib.length; }""")
        # fault: two distinct errors -> card
        await pg.evaluate("()=>{ window.__fk.setPause(false); setTimeout(()=>{throw new Error('test one')},0); setTimeout(()=>{throw new Error('test two')},10); }"); await pg.wait_for_timeout(300)
        card = await pg.evaluate("()=>({t: window.__fk.G.card && window.__fk.G.card.type, paused: window.__fk.G.paused, saved: !!localStorage.getItem('firstkeep.save')})")
        print(json.dumps({'weather':r2,'vibrations':r3,'fault':card}), [e for e in errs if 'test' not in e][:3]); await br.close()
asyncio.run(main())
