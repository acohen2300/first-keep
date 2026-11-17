import asyncio, sys
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
SET = r"""const h = FK.seatOf(0), byName = (n) => Object.keys(FK.SH).find((c) => FK.SH[c].name === n), N = FK.N; let k0 = null;
 for (let d = 5; d < 40 && !k0; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d]]) { const k = j * N + i; if (!k0 && [0,1,2,6,7,N,N+6].every((x) => FK.walkable(k + x)) && !FK.WOODS) k0 = k; }
 if (!k0) for (let d = 5; d < 40 && !k0; d++) { const k = (h.j + d) * N + h.i + 3; if ([0,1,2,6,7].every((x) => FK.walkable(k + x))) k0 = k; }
 const mine = [0,1,2].map((x) => FK.spawn(byName('Swordsman'), 0, k0 + x, FK.rng)); const foe = FK.spawn(byName('Spearman'), 1, k0 + 4, FK.rng); window.__foe = foe; console.log('F', JSON.stringify([!!foe, foe && FK.inSight(foe), foe && foe.hp]));
 for (let i = 0; i < 6; i++) FK.sim(0.05); console.log('F2', FK.inSight(foe)); const c = FK.cam; c.z = 3; c.x = c.tx = foe.vx - 20; c.y = c.ty = foe.vy + 30; MENU.act('war'); FK.select(mine); MENU.S.ctl.who = 'all'; MENU.S.ctl.act = 'attack'; MENU.S.aim = null; FK.dirty(); MENU.render(true);"""
R = "#e5534b"
def ov(svg): return "document.getElementById('spd').classList.remove('on'); const [x, y] = FK.toScreen(window.__foe.vx, window.__foe.vy); document.body.insertAdjacentHTML('beforeend', `<svg style='position:fixed;inset:0;pointer-events:none;z-index:2' width='390' height='844'>" + svg + "</svg>`); document.querySelector('.mline .mpath').insertAdjacentHTML('beforeend', '<span class=\"mrd\" style=\"color:var(--rw)\">Attack: tap a target</span>'); const a = document.querySelector('#base .mt [data-v=\"mord|attack|\"]'); a.style.cssText = 'background:var(--rr);border-color:var(--rr);color:var(--rw)';"
RING = "<ellipse cx='${x}' cy='${y}' rx='20' ry='8' fill='none' stroke='%s' stroke-width='3'/>"
A = RING % R
B = A + "<path d='M${x-7} ${y-62} L${x+7} ${y-62} L${x} ${y-53} Z' fill='" + R + "'/>"
C = "<g fill='none' stroke='" + R + "' stroke-width='2.5' stroke-linecap='round'><path d='M${x-16} ${y-50} l0 -7 l7 0 M${x+16} ${y-50} l0 -7 l-7 0 M${x-16} ${y+3} l0 7 l7 0 M${x+16} ${y+3} l0 7 l-7 0'/></g>"
G = "<ellipse cx='${x+40}' cy='${y+10}' rx='20' ry='8' fill='none' stroke='#fff' stroke-width='2.5' stroke-dasharray='5 4'/>"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        now = await shot(b, SET + "MENU.S.ctl.spot = true; MENU.S.aim = { k: FK.kOf ? FK.kOf(window.__foe) : window.__foe.k, t: window.__foe }; MENU.S.aimT = performance.now(); MENU.render(true);", "document.getElementById('spd').classList.remove('on');", '', 0)
        P = [('n67 now', now)]
        for t, svg in [('A: red ring under the foe', A), ('B: ring + marker over the head', B), ('C: four corners', C), ('ground spot: white dashed ring', G)]:
            P.append((t, await shot(b, SET, ov(svg), CSS40, 0)))
        crop = lambda im: im.crop((330, 440, 690, 800)).resize((540, 540))
        sheet('172-reticle-options', [(t, crop(im)) for t, im in P]); await b.close()
asyncio.run(run())
