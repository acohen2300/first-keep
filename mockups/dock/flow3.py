import asyncio, sys, json
sys.argv = [sys.argv[0], sys.argv[1], '/tmp/mk']
exec(open('/home/claude/mk/mock.py').read().split('async def go():')[0])
JS = open('/home/claude/mk/flow3.js').read()
B = lambda t, cls='': f'<button class="fl {cls}">{t}</button>'
VROW = lambda st: f'<span class="p">Villager → <b>{st}</b></span><span class="gap"></span>' + B('Stop') + B('Garrison') + B('Delete', 'red') + B('Cancel')
SWAP = "const c = qa('#base .mt .cell'); c[3].parentNode.insertBefore(c[4], c[3]);"
GO = "const c = qa('#base .mt .cell'); c[3].parentNode.insertBefore(c[4], c[3]); c[0].classList.remove('sel'); c[0].innerHTML = '<span class=\"t\">✓</span>Go'; c[0].style.boxShadow = 'inset 0 0 0 2px var(--rg)'; c[0].style.color = 'var(--rg)'; c[1].classList.add('sel');"
NOGO = "const c = qa('#base .mt .cell'); c[3].parentNode.insertBefore(c[4], c[3]); c[0].style.visibility = 'hidden';"
VS = "const u = ECON.villagersOf(0)[0], c = FK.cam; c.x = c.tx = u.vx; c.y = c.ty = u.vy; FK.dirty(); FK.select(null); "
HOUSE = "MENU.act('pick', Object.keys(FK.SH).find((c) => FK.SH[c].name === 'House')); MENU.render(true);"
VR = lambda crumb: f'<span class="p">Villager → <b>{crumb}</b></span><span class="gap"></span>' + B('Garrison') + B('Delete', 'red') + B('Cancel')
LIT = "const c = qa('#base .mt .cell.sel'); c.innerHTML = 'House<small>30w</small>';"
STATES = [
 ('1. Always', "MENU.render(true);", dict(on='', tiles=False)),
 ('2. Jobs', "MENU.render(true);", dict(on='Jobs', pm='<div><button>+</button></div>' + '<div><button>−</button><button>+</button></div>' * 5, tilefix=SWAP)),
 ('3. Build', "MENU.act('mmode','Build'); MENU.render(true);", dict(on='Build', track=1, row='<span class="p">Build → <b>Town</b></span><span class="gap"></span>' + B('Cancel'))),
 ('4. Build, tap House', "MENU.act('mmode','Build'); " + HOUSE, dict(on='Build', track=1, row='<span class="p">Build → Town → <b>House</b></span><span class="gap"></span>' + B('Build', 'grn') + B('Cancel'), tilefix=LIT)),
 ('5. Tap a villager', VS + "MENU.render(true);", dict(on='', say='choose a task', row=VR('food'), tiles=False)),
 ('6. Villager, Jobs', VS + "MENU.render(true);", dict(on='Jobs', say='choose a job below', row=VR('waiting'), tilefix=NOGO)),
 ('7. Villager, Food', VS + "MENU.render(true);", dict(on='Jobs', say='tap Go to send', row=VR('Food'), tilefix=GO)),
 ('8. Villager, Build', VS + "MENU.act('mmode','Build'); MENU.render(true);", dict(on='Build', track=1, row=VR('Town'))),
 ('9. Villager, House', VS + "MENU.act('mmode','Build'); " + HOUSE, dict(on='Build', track=1, row='<span class="p">Villager → <b>House</b></span><span class="gap"></span>' + B('Build', 'grn') + B('Garrison') + B('Delete', 'red') + B('Cancel'), tilefix=LIT)),
]
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
        P = []
        for t, setup, F in STATES: P.append((t, await shot(b, setup, f"window.__F = {json.dumps(F)};" + JS, CSS40, 600)))
        sheet('195-full-a', P[:4]); sheet('196-full-b', P[4:7]); sheet('197-full-c', P[7:]); await b.close()
asyncio.run(run())
