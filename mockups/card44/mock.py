# Draft 7 Q4 and Q5 (Albert, Nov 19 15:49): the building card's row 2 with every tap area 44 px, and the longest building name in the title box. The real game behind; the card drawn over it.
import asyncio, json, sys
from playwright.async_api import async_playwright
V = '/home/claude/first-keep/frankenstein-refresh/v100'; OUT = '/home/claude/first-keep/mockups/card44/'
CARD = r"""([title, tiles, mode]) => {
  document.querySelectorAll('#fkmock').forEach((e) => e.remove()); const css = `
  #fkmock{position:fixed;left:0;right:0;bottom:0;height:150px;z-index:99999;font-family:'Barlow Semi Condensed',sans-serif;color:#efe6d2;background:linear-gradient(#3a2c20f0,#241a12f8 30%);border-top:1px solid #5a4632}
  #fkmock .r1{position:absolute;left:3px;right:3px;top:6px;height:44px;display:flex;align-items:center;gap:8px}
  #fkmock .hm{width:38px;height:38px;border-radius:50%;border:1.5px solid #8a7660;background:#2b2018;display:grid;place-items:center;font-size:15px}
  #fkmock .way{font-size:16px;font-weight:600;white-space:nowrap}#fkmock .way i{color:#8a7660;font-style:normal;padding:0 4px}
  #fkmock .tt{margin-left:auto;border:1.5px solid #e6b947;border-radius:6px;color:#e6b947;font-size:18px;font-weight:600;padding:2px 8px;white-space:nowrap;overflow:hidden;max-width:var(--tw)}
  #fkmock .w{width:38px;height:38px;border-radius:50%;border:1.5px solid #8a7660;background:#2b2018;display:grid;place-items:center;color:#e8604c;font-size:18px;font-weight:700;flex:none}
  #fkmock .r2{position:absolute;left:3px;top:54px;height:44px;display:flex;align-items:stretch;white-space:nowrap}
  #fkmock .s{min-width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;box-sizing:border-box;position:relative}
  #fkmock.show .s{outline:1px dashed #ffffff55;outline-offset:-1px}
  #fkmock .b{border:1.5px solid #5fd08a;border-radius:7px;padding:2px 5px;box-shadow:0 0 6px #5fd08a88}
  #fkmock .s+.s:not(.nop)::before{content:'';position:absolute;left:0;top:14px;bottom:14px;border-left:1px solid #8a7660}
  #fkmock .dm{color:#e8604c}#fkmock .ex span{border:1.5px solid #e8604c;border-radius:7px;padding:2px 6px}
  #fkmock .r3{position:absolute;left:3px;top:101px;display:flex;gap:4px}#fkmock .tile{width:60px;height:44px;border:1.5px solid #efe6d2;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:13px}#fkmock .tile small{color:#5fd08a;font-size:11px}
  #fkmock .note{position:absolute;right:6px;top:104px;font-size:11px;color:#c9b99a;text-align:right;max-width:150px}`;
  const d = document.createElement('div'); d.id = 'fkmock'; d.className = mode; const s = (t, c = '') => `<div class="s ${c}">${t}</div>`;
  d.innerHTML = `<style>${css}</style><div class="r1"><div class="hm">⌂</div><div class="way">Home<i>|</i>Jobs<i>|</i>Build</div><div class="tt">${title}</div><div class="w">W</div></div>
   <div class="r2">${s(`<span class="b">${title}</span>`, 'nop')}${s('›', 'nop')}${s('<span class="b">Train</span>', 'nop')}${s('Learn')}${s('Relations')}${s('Repair')}${s('Demolish', 'dm')}${s('<span>Exit</span>', 'ex')}</div>
   <div class="r3">${tiles.map(([n, c]) => `<div class="tile">${n}<small>${c}</small></div>`).join('')}</div><div class="note"></div>`;
  document.body.append(d); const r2 = d.querySelector('.r2'), tt = d.querySelector('.tt');
  return { row2: Math.round(r2.scrollWidth), screen: innerWidth, title: Math.round(tt.scrollWidth), slots: [...r2.children].map((e) => Math.round(e.getBoundingClientRect().width)) }; }"""
LONGEST = """() => { const c = document.createElement('canvas').getContext('2d'); c.font = "600 18px 'Barlow Semi Condensed'"; const names = Object.values(SH).filter((s) => s.layer === 110).map((s) => s.name); return names.map((n) => [n, Math.round(c.measureText(n).width)]).sort((a, b) => b[1] - a[1]).slice(0, 4); }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        await pg.goto('file://' + V + '/index.html#20261105'); await pg.wait_for_timeout(2500)
        await pg.evaluate("async () => { start(20261105); FK.fog(false); K.t = D.day / 4; climate(0); MENU.S.tab = null; MENU.render(true); }"); await pg.wait_for_timeout(800)
        await pg.add_style_tag(content='#dock,#bar,.dock,.mold{visibility:hidden!important}')
        longest = await pg.evaluate(LONGEST); print('longest', longest)
        for name, title, tiles in (('tc', 'Town Center', [['Villager', '50f'], ['Scout', '80f']]), ('longest', longest[0][0], [['Ram', '160w'], ['Mangonel', '160w'], ['Trebuchet', '200w']])):
            for mode in ('', 'show'):
                r = await pg.evaluate(CARD, [title, tiles, mode]); print(name, mode, r)
                await pg.screenshot(path=f'{OUT}{name}{"-taps" if mode else ""}.png')
        await b.close()
asyncio.run(main())
