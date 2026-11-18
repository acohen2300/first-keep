import asyncio, sys, io
from playwright.async_api import async_playwright
from PIL import Image
V = sys.argv[1]; PRE = open(V + '/test.py').read().split('PRE = r"""')[1].split('"""')[0]
JS = r"""() => { const q = (s) => document.querySelector(s), sp = document.getElementById('spd'); if (sp) sp.classList.remove('on');
 const fl = (w, c = '') => `<button class="fl ${c}">${w}</button>`, S = 'viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
 const line = q('.mline'), home = line.firstElementChild;
 line.innerHTML = `<button class="dot"><svg ${S}><path d="M9 6v12M15 6v12"/></svg></button><div class="mpath" style="display:flex;align-items:center;flex:1;min-width:0"><span class="jb">${fl('Paused', 'on')}<i></i>${fl('Resume')}</span><span class="gw" style="margin-left:auto"><button>Help</button><i></i><button>Copy log</button></span></div><button class="dot"><svg ${S}><path d="M15 6l-6 6 6 6"/></svg></button>`;
 q('.mctl').innerHTML = `<div class="row2"><button class="cb big">Pause</button><b class="ar">→</b><button class="cb">Settings</button><span class="gs"></span><span class="acts">${fl('New')}<i></i>${fl('Quit', 'red')}<i></i>${fl('Cancel')}</span></div>`;
 const T = (lab, tiles) => `<div style="font:italic var(--first);color:var(--wdim);padding:4px 6px 2px">${lab}</div><div style="display:flex;gap:var(--gap)">${tiles}</div>`;
 const cell = (h, on) => `<button class="cell ${on ? 'sel' : ''}" style="width:var(--ccell, 74px)">${h}</button>`;
 const c = (h, on) => `<button class="cell ic ${on ? 'sel' : ''}" style="flex:0 0 calc((100% - 5 * var(--gap)) / 6)">${h}</button>`, lab = (t, u) => `<div style="display:flex;gap:8px;align-items:baseline;padding:6px 6px 4px"><b style="font:var(--head);color:var(--rw)">${t}</b><i style="font:italic var(--first);color:var(--wdim)">${u}</i></div>`, row = (h) => `<div class="mt" style="position:static;display:flex;gap:var(--gap);justify-content:flex-start">${h}</div>`;
 const mt = q('#base .mt'); mt.outerHTML = lab('Speed', 'tap one') + row(c('×1', 1) + c('×2') + c('×3')) + lab('Sounds', 'tap to cycle') + row(c(`<span class="t"><svg ${S}><path d="M4 10h4l5-4v12l-5-4H4zM16 9a4 4 0 010 6"/></svg></span>All`, 1) + c(`<span class="t"><svg ${S}><path d="M6 17h12l-2-3v-4a4 4 0 00-8 0v4zM10 20h4"/></svg></span>Alerts`) + c(`<span class="t"><svg ${S}><path d="M4 10h4l5-4v12l-5-4H4zM17 9l4 6M21 9l-4 6"/></svg></span>Off`));
 const base = q('#base'); base.style.height = 'auto'; base.style.top = 'auto'; base.style.bottom = '0'; base.style.background = 'linear-gradient(transparent, rgba(20,16,10,.92) 18%)';; }"""
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2); E = []; pg.on('pageerror', lambda e: E.append(str(e)))
        await pg.add_init_script(PRE); await pg.goto('file://'+V+'/index.html#20261105'); await pg.wait_for_timeout(1000)
        await pg.evaluate("(() => { MENU.S.tab = 'Jobs'; MENU.render(true); MENU.render = () => {}; FK.pause(true); })()"); await pg.evaluate(JS); await pg.wait_for_timeout(300)
        Image.open(io.BytesIO(await pg.screenshot())).crop((0, 800, 780, 1688)).save('/home/claude/first-keep/mockups/dock/203-pause-menu-mock.png'); print(E[:1]); await b.close()
asyncio.run(go())
