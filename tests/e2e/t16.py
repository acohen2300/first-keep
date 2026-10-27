import asyncio, sys, json
from playwright.async_api import async_playwright
async def main(path):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+path); await pg.wait_for_timeout(800)
        await pg.evaluate("() => { const F=window.__fk; F.newGame(7); F.act('close'); F.setPause(false); F.startPlace('house'); }")
        await pg.wait_for_timeout(200)
        R = await pg.evaluate("""() => { const F=window.__fk, cv=document.getElementById('cv'), r=cv.getBoundingClientRect(); const ev=(t,x,y,id=1)=>cv.dispatchEvent(new PointerEvent(t,{pointerId:id,pointerType:'touch',clientX:r.left+x,clientY:r.top+y,bubbles:true,isPrimary:true}));
          const a0={...F.G.place.at}, c0={x:F.cam.x,y:F.cam.y};
          const gs=[(a0.x-F.cam.x)*F.cam.z+r.width/2,(a0.y-F.cam.y)*F.cam.z*0.66+r.height/2];
          const far=[Math.min(r.width-30, gs[0]+160), Math.max(40, gs[1]-200)];
          ev('pointerdown',far[0],far[1]); ev('pointermove',far[0]-60,far[1]+40); ev('pointermove',far[0]-120,far[1]+80); ev('pointerup',far[0]-120,far[1]+80);
          const a1={...F.G.place.at}, c1={x:F.cam.x,y:F.cam.y};
          // tap far: ghost goes there
          ev('pointerdown',far[0],far[1]); ev('pointerup',far[0],far[1]); const a2={...F.G.place.at};
          // press on the ghost and drag: ghost moves, cam stays
          const gs2=[(a2.x-F.cam.x)*F.cam.z+r.width/2,(a2.y-F.cam.y)*F.cam.z*0.66+r.height/2-64]; const cb={x:F.cam.x,y:F.cam.y};
          ev('pointerdown',gs2[0],gs2[1]+64); ev('pointermove',gs2[0]+30,gs2[1]+64); ev('pointerup',gs2[0]+30,gs2[1]+64); const a3={...F.G.place.at};
          return {ghostMovedOnPan: a0.x!==a1.x||a0.y!==a1.y, camMoved:[Math.round(c1.x-c0.x),Math.round(c1.y-c0.y)], tapMovedGhost: a2.x!==a1.x||a2.y!==a1.y, dragOnGhostMovedGhost: a3.x!==a2.x||a3.y!==a2.y, camStillOnGhostDrag: cb.x===F.cam.x&&cb.y===F.cam.y}; }""")
        print(json.dumps(R)); print('errors', errs[:3]); await b.close()
asyncio.run(main(sys.argv[1]))
