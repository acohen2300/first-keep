import asyncio, base64
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':430,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(800)
        d = await pg.evaluate("""() => { const F=window.__fk; F.newGame(5); const frs=[1,2,0,3,10,11,12,13,14,15,16,17,18,19,20,21]; const S=6; const c=document.createElement('canvas'); c.width=frs.length*34*S/2; c.height=2*60*S/2*1.0+40; 
          const x=c.getContext('2d'); x.fillStyle='#4a6634'; x.fillRect(0,0,c.width,c.height);
          frs.forEach((fr,i)=>{ const s=F.sprite('vil','#4f93e6',0,fr,S); const cx=(i%8)*c.width/8+10, cy=Math.floor(i/8)*(c.height/2)+8; x.drawImage(s,cx,cy); x.fillStyle='#fff'; x.font='14px sans-serif'; x.fillText(String(fr),cx+4,cy+s.height+10); });
          return c.toDataURL('image/png'); }""")
        open('anim.png','wb').write(base64.b64decode(d.split(',')[1])); print(errs); await b.close()
asyncio.run(main())
