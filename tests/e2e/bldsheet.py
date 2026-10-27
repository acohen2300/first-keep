import asyncio
from playwright.async_api import async_playwright
JS="""() => { const F=window.__fk; F.newGame(5); F.act('close'); const G=F.G; F.setPause(true);
 const kinds=Object.keys(F.BLD).filter(k=>!['wall','gate','farm','pasture','treefarm','market','dock'].includes(k));
 const cv=document.createElement('canvas'); const cols=6, cw=130, ch=130; cv.width=cols*cw; cv.height=Math.ceil((kinds.length+3)/cols)*ch; const x=cv.getContext('2d'); x.fillStyle='#4a6a34'; x.fillRect(0,0,cv.width,cv.height);
 const all=[...kinds]; G.P[0].civ='han'; 
 all.forEach((k,i)=>{ const c=F.bldSprite({kind:k,owner:0},2); const cx=(i%cols)*cw+cw/2, cy=Math.floor(i/cols)*ch+ch-25; x.drawImage(c,cx-c.ax/2*1,cy-c.ay/2*1,c.width/2*1,c.height/2*1); x.fillStyle='#fff'; x.font='11px sans-serif'; x.fillText(k,cx-30,cy+20); });
 ['persian','mali','roman'].forEach((civ,j)=>{ G.P[0].civ=civ; const i=all.length+j; const c=F.bldSprite({kind:'wonder',owner:0},2); const cx=(i%cols)*cw+cw/2, cy=Math.floor(i/cols)*ch+ch-25; x.drawImage(c,cx-c.ax/2,cy-c.ay/2,c.width/2,c.height/2); x.fillStyle='#fff'; x.fillText(civ,cx-30,cy+20); });
 return cv.toDataURL(); }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':800,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(700)
        d=await pg.evaluate(JS); import base64; open('/tmp/t/sheet.png','wb').write(base64.b64decode(d.split(',')[1])); print(errs[:3]); await b.close()
asyncio.run(main())
