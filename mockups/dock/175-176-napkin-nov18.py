import asyncio, sys
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
H = "const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)], sp = document.getElementById('spd'); if (sp) sp.classList.remove('on'); const line = q('.mline'), path = q('.mline .mpath'), ctl = q('.mctl'); path.style.cssText = 'display:flex;gap:4px;align-items:center;flex:1;min-width:0'; "
GRID = "const grid = (cells) => { ctl.innerHTML = '<div style=\"display:grid;grid-template-columns:repeat(6,1fr);gap:var(--gap,4px);width:100%;align-items:end\">' + cells.map((c) => '<div style=\"display:flex;justify-content:center;gap:3px\">' + c + '</div>').join('') + '</div>'; }; const sm = (t, cls) => '<button class=\"mp ' + (cls || '') + '\" style=\"height:28px;min-width:28px;padding:0 6px;font-size:16px\">' + t + '</button>'; "
CSS = ".mline .tg { flex: 0 0 auto; } .mline .tg.grp { flex: 1 1 auto; min-width: 0; } .mline .tg.grp button { padding-inline: 4px; }"
JOBS = H + GRID + "const tg = ctl.querySelector('.tg'), x = ctl.querySelector('[data-v^=\"mx|\"]'); path.append(tg, x); grid(['', ...Array(5).fill(sm('−') + sm('+'))]);"
BLD = H + "const tg = ctl.querySelector('.tg:not(.grp)'), tr = ctl.querySelector('.tg.grp'); path.append(tg, tr); ctl.innerHTML = '';"
PLACE = H + GRID + "const tg = ctl.querySelector('.tg:not(.grp)'), tr = ctl.querySelector('.tg.grp'); path.innerHTML = ''; path.append(tg, tr); const c = q('#base .mt .cell.sel'); c.innerHTML = 'House<small>30w</small>'; const r = c.getBoundingClientRect(), cr = ctl.getBoundingClientRect(); ctl.innerHTML = ''; ctl.style.position = 'relative'; ctl.insertAdjacentHTML('beforeend', '<div style=\"position:absolute;left:' + (r.left - cr.left) + 'px;width:' + r.width + 'px;bottom:4px;display:flex;justify-content:center;gap:3px\">' + sm('✕', 'no') + sm('✓', 'ok') + '</div>');"
VIL = H + "const tg = ctl.querySelector('.tg:not(.grp)'), tr = ctl.querySelector('.tg.grp'); const old = path.innerHTML; path.innerHTML = ''; path.append(tg, tr); ctl.innerHTML = '<div style=\"display:flex;gap:6px;align-items:center;width:100%;white-space:nowrap\">' + old + '</div>'; const rd = ctl.querySelector('.mrd'); if (rd) { rd.style.flex = '1'; rd.style.minWidth = '0'; rd.style.overflow = 'hidden'; }"
SETV = "const u = ECON.villagersOf(0)[0], c = FK.cam; c.x = c.tx = u.vx; c.y = c.ty = u.vy; FK.dirty(); FK.select([u]); MENU.render(true);"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        P = [('Always: Home and War', await shot(b, "MENU.act('mx'); MENU.render(true);", H, CSS40 + CSS, 560)),
             ('Tap Home: Jobs, − + over each job', await shot(b, "MENU.render(true);", JOBS, CSS40 + CSS, 560)),
             ('Tap Build: track on the line', await shot(b, "MENU.act('mmode','Build'); MENU.render(true);", BLD, CSS40 + CSS, 560)),
             ('Tap a building: ✕ ✓ over it', await shot(b, "MENU.act('mmode','Build'); MENU.act('pick', Object.keys(FK.SH).find((c) => FK.SH[c].name === 'House')); MENU.render(true);", PLACE, CSS40 + CSS, 560)),
             ('Villager: rows swapped', await shot(b, SETV, VIL, CSS40 + CSS, 560))]
        sheet('175-napkin-nov18', P[:3]); sheet('176-napkin-nov18', P[3:]); await b.close()
asyncio.run(run())
