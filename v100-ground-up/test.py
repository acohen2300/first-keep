# The menu's tests, one a fix (v100 · 10). Drives the page as a player does, through the menu's own verbs, and measures what shows.
# Run: python3 test.py   (Chrome or Chromium headless, Playwright; about 15 seconds)
import asyncio, os, sys, json, shutil, subprocess, tempfile
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); URL = 'file://' + os.path.join(HERE, 'index.html') + '#20261105'
CHROME = next((p for p in ('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser') if os.path.exists(p)), None)
res = []
def ok(name, cond, got=''): res.append(bool(cond)); print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else f'  [{got}]'), flush=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(1500)
        ev = pg.evaluate
        book = await ev("fromBook('screen')"); D = await ev("({ v: FK.D.version })")
        ok('the version is said once, from the book (D171)', await ev("document.title") == 'First Keep v' + D['v'])
        ok('the top: one ribbon, the cells the book names (SN5)', await ev("[document.querySelectorAll('.topbar .strip').length, document.querySelectorAll('.topbar .strip .cell').length]") == [1, len(book['top'])])
        await ev("MENU.S.tab = 'Build'; MENU.render(true)")
        tabs = await ev("[...document.querySelectorAll('#panel .tabs .cell')].map((c) => c.textContent)")
        ok('Build: the six tabs of the book (SN2)', tabs == list(book['tabs']), tabs)
        h = {}
        for g, codes in book['tabs'].items():
            got = await ev(f"(() => {{ MENU.S.group = '{g}'; MENU.render(true); return [document.getElementById('panel').offsetHeight, document.querySelectorAll('#panel .frame .cell').length]; }})()")
            ok(f'Build › {g}: its {len(codes)} buildings, nine at most', got[1] == len(codes) <= 9, got); h[g] = got[0]
        on = sum(len(v) for v in book['tabs'].values()); bld = await ev("FK.SH && Object.values(FK.SH).filter((s) => s.layer === 110).length")
        ok('every building on the menu once, or named off it (SN3)', on + len(book['offmenu']) == bld, [on, len(book['offmenu']), bld])
        await ev("MENU.S.tab = 'Layers'; MENU.render(true)"); yard = await ev("document.getElementById('panel').offsetHeight")
        ok('one height for every page that is not Tall', len(set(h.values()) | {yard}) == 1, [h, yard])
        hall = await ev("MENU.S.tab = 'Hall'; MENU.S.htab = 'Town'; MENU.render(true); document.getElementById('panel').style.height")
        start = await ev("MENU.S.tab = 'Start'; MENU.render(true); document.getElementById('panel').style.height")
        ok('the Tall pages (Town Center, Start) keep their own height', hall == '' and start == '', [hall, start])
        ok('the panel is solid: nothing of the map shows through', await ev("getComputedStyle(document.getElementById('panel')).backgroundColor.startsWith('rgb(')"))
        # the Town Center: the queue is the six slots of the mold, one unit a slot
        await ev("const s = FK.SIDES[0].store; s.food = s.wood = s.gold = s.stone = 2000; MENU.S.tab = 'Hall'; MENU.render(true)")
        ok('Hall: the queue row is six single slots, empty', await ev("[...document.querySelectorAll('#panel .row6')].some((r) => r.querySelectorAll('.q').length === 6)"))
        for _ in range(3): await ev("MENU.act('people')")
        q = await ev("(() => { MENU.render(true); const r = [...document.querySelectorAll('#panel .row6')].find((r) => r.querySelectorAll('.q').length === 6); return [...r.querySelectorAll('.q')].map((c) => c.tagName + ':' + c.textContent.replace(/\\d+:\\d+/, '')); })()")
        ok('Hall: three villagers queued fill the first three slots', q[:3] == ['BUTTON:Villager'] * 3 and q[3:] == ['I:'] * 3, q)
        # the card: the subject's ticks pick its rows (SN4)
        rows = lambda: ev("[...document.querySelectorAll('#card > *')].map((e) => e.tagName + (e.className ? '.' + e.className : ''))")
        await ev("MENU.S.tab = null; const u = ECON.villagersOf(0)[0]; MENU.S.subject = u; MENU.render(true)")
        ok('a villager: title, health, its job, its orders', await rows() == ['H2', 'P', 'P', 'DIV.row'], await rows())
        await ev("MENU.S.subject = FK.things().find((t) => t.kind === 'tree'); MENU.render(true)")
        ok('a tree: title, what it holds, its orders', await rows() == ['H2', 'P', 'DIV.row'], await rows())
        await ev("MENU.S.subject = FK.things().find((t) => FK.has(t, 'Seat') && t.side === 0); MENU.render(true)")
        ok('the Town Center: title, health, its queue, train, the age, its orders', await rows() == ['H2', 'P', 'DIV.row6', 'DIV.row', 'DIV.row', 'DIV.row'], await rows())
        # building: pick, slide, build: a site stands and a villager goes to raise it
        await ev("MENU.S.subject = null; MENU.S.tab = 'Build'; MENU.S.group = 'Home'; MENU.render(true); MENU.act('pick', 'BR1')")
        site = await ev("""(() => { const h = FK.things().find((t) => FK.has(t, 'Seat') && t.side === 0); for (let d = 8; d < 30; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) if (ECON.canPlace('BR1', i, j)) { Object.assign(MENU.S.ghost, { i, j, ok: true }); MENU.act('build'); return FK.things().some((t) => t.code === 'BR1' && t.side === 0 && t.done < 1); } return false; })()""")
        ok('Build › Home › Home: placed, a site stands', site)
        ok('no page errors', not errs, errs[:3])
        await b.close()
    # the gate finds what it must: a comment that swallows code (it broke SoRen four times, and this build once)
    t = tempfile.mkdtemp(); shutil.copytree(HERE, t + '/v', ignore=shutil.ignore_patterns('*.png')); m = open(t + '/v/menu.js').read()
    open(t + '/v/menu.js', 'w').write(m.replace("S.htab = keepH; PANEL = h;", "S.htab = keepH; // swallowed PANEL = h;", 1))
    r = subprocess.run([sys.executable, t + '/v/index.py'], capture_output=True, text=True); shutil.rmtree(t)
    ok('the gate stops a comment that swallows code', r.returncode == 1 and 'swallowed code' in r.stdout, r.stdout[-300:])
asyncio.run(main())
print(f'{sum(res)}/{len(res)} passed'); sys.exit(0 if all(res) else 1)
