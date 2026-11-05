# The page's tests: the rules of stage "page" in books/rules.js, one test each, named by its key. They check only what needs the running page;
# what the files alone prove is the gate's (index.py). Run: python3 test.py   (headless Chrome and Playwright; a few seconds)
import asyncio, os, re, sys, json, glob, shutil, subprocess, tempfile
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); URL = 'file://' + os.path.join(HERE, 'index.html') + '#20261105'
RULES = {e['key']: e['name'] for e in json.loads(re.search(r'BOOK\("rules", ([\s\S]*)\);', open(os.path.join(HERE, 'books/rules.js')).read()).group(1)).values() if e['value']['stage'] == 'page'}
CHROME = next((p for p in ('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser') if os.path.exists(p)), None); done = {}
def ok(key, cond, got=''): done[key] = done.get(key, True) and bool(cond); print(('PASS ' if cond else 'FAIL ') + f'[{key}] {RULES[key]}' + ('' if cond else f'  [{got}]'), flush=True)
async def page():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=['--no-sandbox', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(1500); ev = pg.evaluate
        scr = await ev("fromBook('screen')")
        ok('t-version', await ev("document.title === 'First Keep v' + FK.D.version"))
        ok('t-top', await ev("[document.querySelectorAll('.topbar .strip').length, document.querySelectorAll('.topbar .strip .cell').length]") == [1, len(scr['top'])])
        shown = await ev("(() => { MENU.S.tab = 'Build'; const out = {}; for (const g of Object.keys(MENU.SCR.tabs)) { MENU.S.group = g; MENU.render(true); out[g] = [document.getElementById('panel').offsetHeight, document.querySelectorAll('#panel .frame .cell').length, [...document.querySelectorAll('#panel .tabs .cell')].map((c) => c.textContent).join()]; } return out; })()")
        ok('t-tabs', all(v[1] == len(scr['tabs'][g]) and v[2] == ','.join(scr['tabs']) for g, v in shown.items()), shown)
        pages = {t: 'Tall' in v.get('ticks', []) for t, v in scr.items() if isinstance(v, dict) and 'ticks' in v}; size = "(() => { MENU.S.tab = '%s'; MENU.render(true); const p = document.getElementById('panel'); return [p.offsetHeight, p.style.height]; })()"
        heights = {t: await ev(size % t) for t in pages}
        ok('t-height', len({v[0] for v in shown.values()} | {heights[t][0] for t in pages if not pages[t]}) == 1, [shown, heights])
        ok('t-tall', all(heights[t][1] == '' for t in pages if pages[t]), heights)
        ok('t-solid', await ev("getComputedStyle(document.getElementById('panel')).backgroundColor.startsWith('rgb(')"))
        await ev("const s = FK.SIDES[0].store; s.food = s.wood = s.gold = s.stone = 2000; MENU.S.tab = 'Hall'; MENU.S.htab = 'Town'; for (let i = 0; i < 3; i++) MENU.act('people'); MENU.render(true)")
        q = await ev("[...[...document.querySelectorAll('#panel .row6')].find((r) => r.querySelectorAll('.q').length === 6).querySelectorAll('.q')].map((c) => c.tagName + ':' + c.textContent.replace(/\\d+:\\d+/, ''))")
        ok('t-queue', q == ['BUTTON:Villager'] * 3 + ['I:'] * 3, q)
        rows = "(() => { MENU.S.subject = %s; MENU.render(true); return [...document.querySelectorAll('#card > *')].map((e) => e.tagName + (e.className ? '.' + e.className : '')).join(); })()"
        cards = [await ev("MENU.S.tab = null; 0"), await ev(rows % 'ECON.villagersOf(0)[0]'), await ev(rows % "FK.things().find((t) => t.kind === 'tree')"), await ev(rows % "FK.things().find((t) => FK.has(t, 'Seat') && t.side === 0)")][1:]
        ok('t-cards', cards == ['H2,P,P,DIV.row', 'H2,P,DIV.row', 'H2,P,DIV.row6,DIV.row,DIV.row,DIV.row'], cards)
        site = await ev("""(() => { MENU.S.subject = null; MENU.S.tab = 'Build'; MENU.S.group = 'Home'; MENU.render(true); const code = MENU.SCR.tabs.Home.find((c) => FK.SH[c].ticks.includes('House') && !FK.SH[c].ticks.includes('Seat')); MENU.act('pick', code);
          const h = FK.things().find((t) => FK.has(t, 'Seat') && t.side === 0); for (let d = 8; d < 30; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) if (ECON.canPlace(code, i, j)) { Object.assign(MENU.S.ghost, { i, j, ok: true }); MENU.act('build'); return FK.things().some((t) => t.code === code && t.done < 1); } return false; })()""")
        ok('t-place', site)
        # Build A's fixes, one test each
        start = await ev("JSON.stringify(FK.D.start)")
        await ev("FK.SIDES[0].store.food = 9999; FK.K.rain = 1; FK.restart ? location.hash = '#20261106' : 0")
        await pg.wait_for_timeout(1200)
        ok('t-start', await ev(f"(() => {{ const b = {start}; return [0, 2].every((s) => Object.keys(b).every((y) => Math.abs(FK.SIDES[s].store[y] - b[y]) < 1)) && FK.K.rain === 0; }})()"), await ev("[FK.SIDES[0].store, FK.K.rain]"))   # within the food the people ate since
        far = "(() => { FK.show.fog = %s; const [vx, vy] = FK.toView(FK.MID, FK.MID, FK.D.land); FK.cam.x = vx; FK.cam.y = vy; FK.cam.z = 1; MENU.S.tab = null; MENU.render(true); FK.dirty(); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => { const c = document.getElementById('map'), d = c.getContext('2d').getImageData(c.width / 2, c.height / 2, 1, 1).data; r([d[0], d[1], d[2]]); }))); })()"
        off, on = await ev(far % 'false'), await ev(far % 'true')
        ok('t-fog', sum(on) < sum(off) - 30, [off, on])
        waited = await ev("""(() => { const h = FK.seatOf(0), s = FK.SIDES[0].store; s.food = 500; h.q = []; ECON.queue(h, FK.D.trains[h.code][0]); const ring = []; for (let y = h.j - 1; y <= h.j + h.n; y++) for (let x = h.i - 1; x <= h.i + h.n; x++) { const k = y * FK.N + x; if (FK.OCC[k] === 0) { ring.push(k); FK.OCC[k] = 2; } }
          const n0 = FK.units().length; h.qt = 0; FK.sim(0.1); const held = h.q.length === 1 && FK.units().length === n0; for (const k of ring) FK.OCC[k] = 0; FK.sim(0.1); return [held, FK.units().length === n0 + 1, h.q.length]; })()""")
        ok('t-wait', waited == [True, True, 0], waited)
        bells = await ev("(() => { const v = MENU.VERBS, o = MENU.S.opt, out = [FK.D.bell === ECON.bell()]; o.len = 1; v.start.run(); out.push(ECON.bell()); MENU.S.opt.len = 0; v.start.run(); out.push(ECON.bell() === Infinity); return out; })()")
        await pg.wait_for_timeout(1200)
        ok('t-bell', bells == [True, 900, True], bells)
        gone = await ev("(() => { const t = FK.things().find((x) => x.kind === 'tree'), u = ECON.villagersOf(0)[0]; FK.take(t, t.amount); return [t.gone === true, ECON.bestFind(u, 'wood') !== t]; })()")
        ok('t-gone', gone == [True, True], gone)
        ai = await ev("(() => { for (let i = 0; i < 6000; i++) FK.sim(0.1); const first = FK.D.ai.raise[0].code; return FK.things().some((t) => t.side === FK.D.players[1] && t.code === first); })()")
        ok('t-ai', ai)
        ok('t-errors', not errs, errs[:3])
        await same(b)
        await b.close()
SAME = """(() => { FK.reset(); let beats = 0, wet = 0; for (let i = 0; i < 3000; i++) { FK.sim(0.1); beats += FK.every(FK.D.beats.slow); wet += FK.K.wetHour; }   // 300 s of play, the weather in it
  const r = (x) => Math.round(x * 1e6), state = [FK.units().map((u) => [u.code, u.side, r(u.bx), r(u.by), u.hp, r(u.cd), u.job]), FK.SIDES.map((s) => s.store), r(FK.K.wet), FK.K.fogT, ECON.score(0).total];
  const near = [], us = FK.units(); for (const u of us.slice(0, 60)) for (const R of [30, 80, 200]) { const got = []; FK.unitsNear(u, R, (v) => got.push(us.indexOf(v))); near.push(JSON.stringify(got.sort((a, b) => a - b)) === JSON.stringify(us.map((v, i) => (v !== u && Math.abs(v.bx - u.bx) < R && Math.abs(v.by - u.by) < R ? i : -1)).filter((i) => i >= 0)));
    const bs = []; FK.bldsNear(u.bx, u.by, R, (t) => { bs.push(t); }); near.push(FK.things().every((t) => t.kind !== 'bld' || Math.abs(t.bx - u.bx) >= R || Math.abs(t.by - u.by) >= R || bs.includes(t))); }
  return { state: JSON.stringify(state), draws: Array.from({ length: 20 }, FK.rng), beats, wet, near: near.every(Boolean) && near.length > 0, mine: Array.from({ length: 1000 }, dice(20261105)), book: [FK.D.beats, FK.D.grid] }; })()"""
MIDRNG = """const vm = require('vm'), src = require('fs').readFileSync(process.argv[1], 'utf8'), sp = require('fs').readFileSync(process.argv[2], 'utf8'), sg = require('fs').readFileSync(process.argv[3], 'utf8'), ctx = { G: { rs: 20261105 } }; vm.createContext(ctx);
vm.runInContext(src.match(/function rng\\(\\) \\{[\\s\\S]*?\\n\\}/)[0] + ';' + sp.match(/const BEAT = [^;]*;/)[0] + ';var OUT = { draws: Array.from({ length: 1000 }, rng), book: [BEAT, { unit: ' + sg.match(/const UG = (\\d+)/)[1] + ', bld: ' + sg.match(/const SGC = (\\d+)/)[1] + ' }] };', ctx); console.log(JSON.stringify(ctx.OUT));"""
async def same(b):   # same seed, same game: two pages on one seed play 300 s alike and draw alike; the dice are Mid's own rng draw for draw; the grids find what a full scan finds
    mid = subprocess.run(['node', '-e', MIDRNG, os.path.join(HERE, '../mid/src/08-core.js'), os.path.join(HERE, '../mid/src/06-rules-tuning.js'), os.path.join(HERE, '../mid/src/15-sim-spatial.js')], capture_output=True, text=True)
    mid = json.loads(mid.stdout or 'null')
    runs = []
    for _ in range(2):
        pg = await b.new_page(viewport={'width': 390, 'height': 844}); await pg.goto(URL); await pg.wait_for_timeout(800); runs.append(await pg.evaluate(SAME)); await pg.close()
    a, c = runs; got = [a['state'] == c['state'], a['draws'] == c['draws'], a['wet'] > 0, a['beats'] == 30, a['near'], bool(mid) and a['mine'] == mid['draws'], bool(mid) and a['book'] == mid['book']]
    ok('t-same', all(got), got)
REC = """const vm = require('vm'), ctx = { window: {}, navigator: {}, document: {}, performance: { now: () => 0 }, Math }; vm.createContext(ctx);
vm.runInContext(require('fs').readFileSync(process.argv[1], 'utf8') + `;var REC = []; tone = (f, dur, type, vol, f2, at) => REC.push(['tone', f, dur, type, vol, f2 || 0, at || 0, panV]);
hiss = (dur, vol, fq, q, f2, at) => REC.push(['hiss', dur, vol, fq, q || 1, f2 || 0, at || 0]); knock = (mat, f, vol, at = 0, snap = 1) => REC.push(['knock', mat, f, vol, at, snap]);
var OUT = Object.fromEntries(Object.entries(SFX).map(([k, [gap, make]]) => { REC = []; panV = 0; make(1, 0); return [k, [gap, ...REC]]; }));`, ctx); console.log(JSON.stringify(ctx.OUT));"""
def match():   # same action, same result: each of Mid's sounds, made by Mid's own frozen code (its tone, hiss and knock recorded), against its recipe in the Sound book
    mid = json.loads(subprocess.run(['node', '-e', REC, os.path.join(HERE, '../mid/src/35-sound.js')], capture_output=True, text=True).stdout)
    hb = {e['key']: e['value'] for e in json.loads(re.search(r'BOOK\("sound", ([\s\S]*)\);', open(os.path.join(HERE, 'books/sound.js')).read()).group(1)).values()}
    full = lambda p: list(p) + {'tone': [0, 0, 0], 'hiss': [1, 0, 0], 'knock': [0, 1]}[p[0]][len(p) - {'tone': 5, 'hiss': 4, 'knock': 4}[p[0]]:]   # a recipe drops its trailing defaults
    same = lambda a, b: len(a) == len(b) and all(abs(x - y) < 1e-9 if isinstance(x, (int, float)) and isinstance(y, (int, float)) else x == y for x, y in zip(a, b))
    cut = {k for k, v in json.load(open(os.path.join(HERE, '../clean/sound.json')))['pieces']['SFX'][2].items() if v[0] == 'cut'}   # a sound Albert cut is not brought
    off = [k for k, r in mid.items() if k not in cut and (k not in hb or not (same(r[:1], hb[k][:1]) and len(r) == len(hb[k]) and all(same(full(a), full(b)) for a, b in zip(r[1:], hb[k][1:]))))]
    ok('t-match', mid and not off, off)
def proof():   # each planted break in a copy of the build must stop the gate, named by the rule it breaks
    plants = {'home': ('books/angles.js', '"A3":', '"D1":'), 'needs': ('books/shells.js', '"ticks": ["Yield"]', '"ticks": ["Yeld"]'),
              'names': ('menu.js', "FK.has(u, 'Gather') && own(u)", "u.code === 'UV' && own(u)"), 'swallowed': ('menu.js', 'S.htab = keepH; PANEL = h;', 'S.htab = keepH; // swallowed PANEL = h;'),
              'seals': ('CALCULATIONS.md', 'QA Sun height', 'QA Sun  height')}
    for key, (f, a, b) in plants.items():
        t = tempfile.mkdtemp(); shutil.copytree(HERE, t + '/v', ignore=shutil.ignore_patterns('*.png')); s = open(f'{t}/v/{f}').read()
        assert a in s, f'plant {key}: {a} not found'; open(f'{t}/v/{f}', 'w').write(s.replace(a, b, 1))
        r = subprocess.run([sys.executable, t + '/v/index.py'], capture_output=True, text=True); shutil.rmtree(t)
        ok('t-proof', r.returncode == 1 and (f'[{key}]' in r.stdout or (key == 'seals' and '[permit] law:QA' in r.stdout)), f'{key}: {r.stdout[-200:]}')
asyncio.run(page()); match(); proof()
missing = [k for k in RULES if k not in done]
for k in missing: print(f'FAIL [{k}] no test runs this rule')
print(f'{sum(done.values())}/{len(RULES)} rules hold'); sys.exit(0 if all(done.values()) and not missing else 1)
