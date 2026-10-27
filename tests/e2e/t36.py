import asyncio, base64
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':800,'height':300})
        await pg.goto('file:///home/claude/first-keep/first-keep.html'); await pg.wait_for_timeout(600)
        d=await pg.evaluate("""()=>{const F=window.__fk;F.newGame(5);F.act('close');
          const out=document.createElement('canvas');out.width=900;out.height=320;const o=out.getContext('2d');o.fillStyle='#3a5a2e';o.fillRect(0,0,900,320);
          const col='#3a7bd5';let x=10;
          const list=[['spear',1,0],['spear',1,3],['sword',1,3],['archer',1,3],['crossbow',1,3],['arquebus',0,0],['arquebus',0,3],['arquebus',3,3],['bombard',0,0],['bombard',0,3]];
          for(const [k,t,kit] of list){const c=F.sprite(k,col,t,k==='bombard'&&kit===3?3:0,4,kit);o.drawImage(c,x,20);x+=c.width+4; if(x>820){x=10;}}
          return out.toDataURL();}""")
        open('/tmp/t/b28_sprites.png','wb').write(base64.b64decode(d.split(',')[1])); await b.close()
asyncio.run(main())
