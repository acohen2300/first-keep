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
        await ledger(b)
        await effects(b)
        await odds(b)
        await foe(b)
        await research(b)
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
# Same action, same result for the stores (F11): v100's own actions (an earning, a Home planned and scrapped at 10%, a villager queued and taken back, the age, the people eating, a spend,
# the minute's turn), each beside the calls Mid makes for it, replayed in Mid's frozen 08-core, 11-orders (shellBack), 36-economy, 07-text, 09-nav and 30-cards
ACTS = """(() => { FK.reset(); const s = FK.SIDES[0], E = ECON, M = MENU, D = FK.D;
  const snap = () => JSON.parse(JSON.stringify({ store: s.store, gathered: s.gathered, flow: s.flow, spent1: s.spent1, flowBy: s.flowBy, spentBy: s.spentBy, rate: s.rate, orate: s.orate, ledger: s.ledger, lines: [M.ledgerLine(s.ledger.in), M.ledgerLine(s.ledger.out)],
    vel: E.YIELDS.map((y) => [E.flowOf(0, y, s.rate, s.flow), E.outOf(0, y), E.netOf(0, y), E.velOf(0, y)]) }));
  const out = { start: JSON.parse(JSON.stringify(s.store)), steps: [] }, step = (name, mid, f) => { out.steps.push([name, f(), JSON.parse(JSON.stringify(mid)), snap(), FK.K.t]); };
  const code = MENU.SCR.tabs.Home.find((c) => FK.SH[c].ticks.includes('House') && !FK.SH[c].ticks.includes('Seat')), h = FK.seatOf(0), vil = D.trains[h.code][0]; let t = null;
  out.home = D.cost[code]; out.Y = E.YIELDS;
  step('earn', [['earn', 'food', 600, 'gather']], () => (E.earn(0, 'food', 600, 'gather'), true));
  step('plan', [['pay', D.cost[code], 'buildings']], () => { for (let d = 8; d < 30 && !t; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) if (!t && E.canPlace(code, i, j)) t = E.plan(0, code, i, j); return !!t; });
  step('scrap', [['payBack', 'shellBack', 'buildings']], () => { t.done = 0.1; E.cancel(t); return true; });
  step('queue', [['pay', D.cost[vil], 'units']], () => E.queue(h, vil));
  step('unqueue', [['payBack', D.cost[vil], 'units']], () => (E.unqueue(h), true));
  step('age', [['pay', E.ageCost(0), 'research']], () => E.ageUp(0));
  step('eat', [['spend', 'food', FK.units().filter((u) => u.side === 0).length * D.upkeep / D.day * 0.1, 'upkeep']], () => (FK.sim(0.1), true));
  step('repairs', [['spend', 'stone', 150, 'repairs']], () => (E.spend(0, 'stone', 150, 'repairs'), true));
  step('minute', [['flowTick']], () => { FK.K.t0 = 59.9; FK.K.t = 60.1; FK.fire('tick', 0); return true; });
  step('after', [['earn', 'wood', 50, 'gather'], ['spend', 'wood', 20, 'units']], () => { E.earn(0, 'wood', 50, 'gather'); E.spend(0, 'wood', 20, 'units'); FK.K.t = 75; return true; });
  out.say = { fmt: [0, 7.9, 999, 1000, 1234, 9999, 10000, 12345, 999999].map(M.fmt), plural: NAMES.map(M.plural), some: NAMES.map((n, i) => M.some(i % 3, n)), or: [['a'], ['a', 'b'], ['a', 'b', 'c', 'd']].map(M.orList), slow: [0, 0.2, 0.5, 1.3].map(M.slowPct),
    coord: [[-50, -50], [0, 0], [99, 99], [100, 250], [1234, 567], [2159, 2159]].map(([x, y]) => M.coord(FK.B0 + x, FK.B0 + y)) };
  return out; })()"""
BALANCE = """(() => { FK.reset(); for (let i = 0; i < 3000; i++) FK.sim(0.1); const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  return FK.D.players.map((p) => { const s = FK.SIDES[p], L = s.ledger, mine = [Math.abs(sum(s.store) - sum(FK.D.start) - (sum(L.in) - sum(L.out))) < 1e-6, Math.abs(s.gathered - (L.in.gather || 0)) < 1e-6];
    return p === 0 ? mine : [...mine, L.in.gather > 0, L.out.upkeep > 0, L.out.buildings > 0, L.out.units > 0, Object.keys(s.rate).length > 0]; }); })()"""
NAMES = ['Wolf', 'Spearman', 'Man-at-arms', 'Archer', 'Ally', 'Ditch', 'Box', 'Sheep', 'Day', 'Bus', 'Horseman', 'wolf']
MIDLEDGER = r"""const vm = require('vm'), fs = require('fs'), [core, orders, eco, text, nav, cards, run] = process.argv.slice(1).map((f, i) => (i < 6 ? fs.readFileSync(f, 'utf8') : JSON.parse(f))), ctx = {}; vm.createContext(ctx);
const cut = (t, a, b) => t.slice(t.indexOf(a), t.indexOf(b, t.indexOf(a)));
vm.runInContext([cut(core, 'const clamp', 'const hyp'), cut(core, 'function earn(', '// the door of a keep'), cut(core, 'const plural', '// Settings'), cut(orders, 'function shellBack', 'function refundOf'), cut(eco, 'const flowOf', 'function initEconomy'),
  cut(text, 'const slowPct', '// the loyalty'), cut(text, 'const LEDGER_WORD', '// the scenarios'), 'const MAP = 3060;' + cut(nav, 'const COORD', 'function snapPos'), 'const ' + cut(cards, 'line = (o)', "'nothing yet';") + "'nothing yet';",
  `const WILD = -1, p = { id: 0, res: { ...RUN.start }, gathered: 0, flow: {}, rate: {}, spent1: {}, orate: {}, ledger: { in: {}, out: {} } }, G = { P: [p], tick: 0 }, BLD = { home: { cost: RUN.home } }, OUT = { steps: [] };
  const Y = RUN.Y, snap = () => JSON.parse(JSON.stringify({ store: p.res, gathered: p.gathered, flow: p.flow, spent1: p.spent1, flowBy: p.flowBy || {}, spentBy: p.spentBy || {}, rate: p.rate, orate: p.orate, ledger: p.ledger, lines: [line(p.ledger.in), line(p.ledger.out)],
    vel: Y.map((y) => [flowOf(p, y, p.rate, p.flow), outOf(p, y), netOf(p, y), velOf(p, y)]) }));
  for (const [, , calls, , t] of RUN.steps) { G.tick = t * 30; for (const [f, ...a] of calls) { if (a[0] === 'shellBack') a[0] = shellBack({ kind: 'home', prog: 0.1 }); ({ earn, spend, pay, payBack, flowTick })[f](...(f === 'flowTick' ? [] : [p, ...a])); } OUT.steps.push(snap()); }
  OUT.say = { fmt: [0, 7.9, 999, 1000, 1234, 9999, 10000, 12345, 999999].map(fmt), plural: RUN.names.map(plural), some: RUN.names.map((n, i) => some(i % 3, n)), or: [['a'], ['a', 'b'], ['a', 'b', 'c', 'd']].map(orList), slow: [0, 0.2, 0.5, 1.3].map(slowPct),
    coord: [[-50, -50], [0, 0], [99, 99], [100, 250], [1234, 567], [2159, 2159]].map(([x, y]) => coord(x, y)) };`].join(';\n'), Object.assign(ctx, { RUN: run }));
console.log(JSON.stringify(vm.runInContext('OUT', ctx)));"""
def close(a, b):   # equal, numbers within a millionth
    if isinstance(a, dict) and isinstance(b, dict): return a.keys() == b.keys() and all(close(a[k], b[k]) for k in a)
    if isinstance(a, list) and isinstance(b, list): return len(a) == len(b) and all(map(close, a, b))
    if isinstance(a, (int, float)) and isinstance(b, (int, float)): return abs(a - b) <= 1e-6 * max(1, abs(a), abs(b))
    return a == b
async def ledger(b):   # same action, same stores, flow, ledger and words as Mid's frozen code; and 300 s of four sides' play balance the ledger to the unit
    pg = await b.new_page(viewport={'width': 390, 'height': 844}); await pg.goto(URL); await pg.wait_for_timeout(800)
    v = await pg.evaluate(ACTS.replace('NAMES', json.dumps(NAMES)))
    bal = await pg.evaluate(BALANCE); await pg.close()
    src = [os.path.join(HERE, '../mid/src', f) for f in ('08-core.js', '11-orders.js', '36-economy.js', '07-text.js', '09-nav.js', '30-cards.js')]
    r = subprocess.run(['node', '-e', MIDLEDGER] + src + [json.dumps({'start': v['start'], 'home': v['home'], 'steps': v['steps'], 'names': NAMES, 'Y': v['Y']})], capture_output=True, text=True)
    mid = json.loads(r.stdout or 'null')
    off = [v['steps'][i][0] for i in range(len(v['steps'])) if not mid or not close(v['steps'][i][3], mid['steps'][i])] + [k for k in v['say'] if not mid or v['say'][k] != mid['say'][k]]
    acted = all(x[1] for x in v['steps'])
    ok('t-ledger', mid and not off and acted and all(all(x) for x in bal), [off, acted, bal, r.stderr[-300:]])
# The effects law (F12a, QCA): with a set of effects in force, a kind's numbers are Mid's stats(), maxHpB, unitCost and techCost, and its rehealth, run in Mid's frozen 08-core and
# 11-orders with one change: Mid multiplied its shares (fxv: m *= f.m); Albert's call (Nov 5 11:40) adds them, so Mid's line is read as m += f.m - 1 (its effects turned into additive
# shares). Mid's keys come from tags that name what v100's keys name (the heads of a code's letters and its ticks, worked out here, not by the page). A building's health is also
# held to v100's D139 × (1 + Σ); the lowest, a find's rate and the walk are checked on the page (Mid's gathering waits for its own laws)
SHELLS = json.loads(re.search(r'BOOK\("shells", ([\s\S]*)\);', open(os.path.join(HERE, 'books/shells.js')).read()).group(1))
MEASURE = {e['key']: e['value'] for e in json.loads(re.search(r'BOOK\("measure", ([\s\S]*)\);', open(os.path.join(HERE, 'books/measure.js')).read()).group(1)).values()}
heads = lambda c: [re.match(r'[A-Z]*', c).group(0)[:i + 1] for i in range(len(re.match(r'[A-Z]*', c).group(0)))]
HOME = next(c for c, e in SHELLS.items() if 'House' in e['ticks'] and 'Seat' not in e['ticks']); SEAT = next(c for c, e in SHELLS.items() if 'Seat' in e['ticks'])
TREE = next(c for c, e in SHELLS.items() if e.get('find') in MEASURE['rate']); SOLDIER = next(c for c in MEASURE['stats'] if 'Fight' in SHELLS[c]['ticks'] and 'Gather' not in SHELLS[c]['ticks'])
FX = [({'s': 'spd', 'k': 'UV', 'p': 0.10}, {'s': 'spd', 'k': 'UV', 'm': 1.10}), ({'s': 'spd', 'k': 'Walk', 'p': 0.08}, {'s': 'spd', 'k': '#Walk', 'm': 1.08}), ({'s': 'spd', 'k': 'UM3', 'p': 0.5}, {'s': 'spd', 'k': 'UM3', 'm': 1.5}),
      ({'s': 'hp', 'k': 'UM', 'p': 0.15}, {'s': 'uhp', 'k': '#UM', 'm': 1.15}), ({'s': 'hp', 'k': SOLDIER, 'p': 0.05}, {'s': 'uhp', 'k': SOLDIER, 'm': 1.05}),
      ({'s': 'hp', 'k': HOME, 'p': 0.10}, {'s': 'bhp', 'k': HOME, 'm': 1.10}), ({'s': 'hp', 'k': 'B', 'p': 0.08}, {'s': 'bhp', 'k': '*', 'm': 1.08}),
      ({'s': 'atk', 'k': 'UM1', 'a': 2}, {'s': 'dmg', 'k': 'UM1', 'a': 2}), ({'s': 'atk', 'k': 'Fight', 'a': 1}, {'s': 'dmg', 'k': '#Fight', 'a': 1}), ({'s': 'rng', 'k': 'Shoot', 'a': 1}, {'s': 'rng', 'k': '#Shoot', 'a': 1}),
      ({'s': 'cost', 'k': 'UM', 'p': -0.13}, {'s': 'cost', 'k': '#UM', 'm': 0.87}), ({'s': 'cost', 'k': 'O', 'p': -0.2}, {'s': 'cost', 'k': '#research', 'm': 0.8}),
      ({'s': 'rof', 'k': 'UM3', 'min': 1.2}, None), ({'s': 'rate', 'k': TREE, 'p': 0.2}, None)]
STEP = {'wood': 233, 'gold': 117}
EFF = """(() => { FK.reset(); const D = FK.D, kinds = Object.keys(D.stats), seat = FK.seatOf(0), keys = ['hp', 'atk', 'rng', 'spd'], read = (side) => kinds.map((k) => keys.map((y) => FK.stat(k, side, y)));
  const u = FK.units().find((v) => v.side === 0 && FK.has(v, 'Gather') && !FK.MARSH[v.k]), sol = FK.spawn(SOLDIER, 0, u.k, FK.rng); sol.hp = 20; seat.hp = seat.hpMax / 2;
  const base = { read: read(0), walk: FK.stat(u.code, 0, 'spd') }; BOOKS.tech.O0 = { key: 'O0', value: { cost: STEP, fx: FX }, name: 'a test step', cite: [], law: ['QCA'] }; FK.learn(0, 'O0');
  const out = { base, mine: read(0), wild: read(1), cost: kinds.filter((k) => D.cost[k]).map((k) => FK.stat(k, 0, 'cost')), tech: FK.stat('O0', 0, 'cost'), home: FK.stat(HOME, 0, 'hp'), seat: [seat.hp, seat.hpMax], sol: [sol.hp, sol.hpMax],
    rof: [FK.stat('UM3', 0, 'rof'), FK.stat('UM1', 0, 'rof')], rate: FK.stat(TREE, 0, 'rate'), seatBase: D.bldHp[seat.code], kinds };
  FK.K.wet = FK.K.snow = 0; FK.go(u, [3, -3, 3 * FK.N, -3 * FK.N].map((d) => u.k + d).find(FK.walkable)); FK.step(0.1); out.walk = u.mps; delete BOOKS.tech.O0; FK.reset(); out.after = FK.stat(HOME, 0, 'hp'); return out; })()"""
MIDFX = r"""const vm = require('vm'), fs = require('fs'), [core, orders, run] = process.argv.slice(1).map((f, i) => (i < 2 ? fs.readFileSync(f, 'utf8') : JSON.parse(f)));
const cut = (t, a, b) => t.slice(t.indexOf(a), t.indexOf(b, t.indexOf(a))), law = cut(core, 'function fxList', '// Two words'), add = law.replace('if (f.m) m *= f.m;', 'if (f.m) m += f.m - 1;');
const go = (fx) => { const ctx = { RUN: run }; vm.createContext(ctx); vm.runInContext([fx, cut(core, 'const unitKeys', 'const dmgOf'), cut(core, 'function rehealth', '// Hawk-Dove'), cut(orders, 'const scaled', 'function trainWhy'),
  `const WILD = -1, TECH = [], CIVS = {}, standing = () => true, baseKind = (k) => k, TECHBY = { O0: { fx: RUN.fx } }, G = { fxv: 0, P: [{ techs: new Set() }, { techs: new Set() }] };
  const UNIT = Object.fromEntries(RUN.kinds.map((k) => [k, { name: k, hp: RUN.stats[k].hp, dmg: RUN.stats[k].atk, rng: RUN.stats[k].rng, spd: RUN.spd[k], sight: 0, tags: RUN.tags[k], cost: RUN.cost[k] }]));
  const BLD = { [RUN.home]: { hp: RUN.bhp[RUN.home] }, [RUN.seat]: { hp: RUN.bhp[RUN.seat] } };
  G.units = [{ owner: 0, kind: RUN.soldier, hp: 20, max: RUN.stats[RUN.soldier].hp }]; G.blds = [{ owner: 0, kind: RUN.seat, hp: RUN.bhp[RUN.seat] / 2, mx: RUN.bhp[RUN.seat], prog: 1 }];
  G.P[0].techs.add('O0'); rehealth(0); const read = (o) => RUN.kinds.map((k) => { const s = stats(o, k); return [s.hp, s.dmg, s.rng, s.spd]; });
  var OUT = { mine: read(0), wild: read(1), cost: RUN.kinds.filter((k) => RUN.cost[k]).map((k) => unitCost(0, k)), tech: techCost(0, { cost: RUN.step }), home: maxHpB(0, RUN.home), seat: [G.blds[0].hp, G.blds[0].mx], sol: [G.units[0].hp, G.units[0].max] };`].join(';\n'), ctx);
  return vm.runInContext('OUT', ctx); };
console.log(JSON.stringify({ added: add !== law ? go(add) : null, compounded: go(law) }));"""
async def effects(b):   # same effects, same numbers as Mid's frozen code with its shares added; a Home's health is D139 × (1 + Σ); the lowest, a find's rate and the walk read the law
    pg = await b.new_page(viewport={'width': 390, 'height': 844}); await pg.goto(URL); await pg.wait_for_timeout(800)
    v = await pg.evaluate(EFF.replace('SOLDIER', json.dumps(SOLDIER)).replace('HOME', json.dumps(HOME)).replace('TREE', json.dumps(TREE)).replace('STEP', json.dumps(STEP)).replace('FX', json.dumps([a for a, _ in FX]))); await pg.close()
    kinds = v['kinds']; run = {'kinds': kinds, 'stats': MEASURE['stats'], 'spd': {k: MEASURE['speed'][SHELLS[k]['pace'].split('.')[1]] for k in kinds}, 'cost': {k: MEASURE['cost'].get(k) for k in kinds},
        'tags': {k: heads(k) + SHELLS[k]['ticks'] for k in kinds}, 'bhp': MEASURE['bldHp'], 'home': HOME, 'seat': SEAT, 'soldier': SOLDIER, 'step': STEP, 'fx': [m for _, m in FX if m]}
    r = subprocess.run(['node', '-e', MIDFX] + [os.path.join(HERE, '../mid/src', f) for f in ('08-core.js', '11-orders.js')] + [json.dumps(run)], capture_output=True, text=True)
    mid = json.loads(r.stdout or 'null'); add = mid and mid['added']
    walk = MEASURE['speed'][SHELLS['UV']['pace'].split('.')[1]] * (1 + 0.10 + 0.08)
    got = [bool(add) and all(close(v[k], add[k]) for k in ('mine', 'wild', 'cost', 'tech', 'home', 'seat', 'sol')),
           close(v['home'], MEASURE['bldHp'][HOME] * (1 + 0.10 + 0.08)) and close(v['after'], MEASURE['bldHp'][HOME]),
           bool(mid) and not close(v['mine'], mid['compounded']['mine']), v['rof'] == [1.2, MEASURE['stats']['UM1']['rof']],
           close(v['rate'], MEASURE['rate'][SHELLS[TREE]['find']] * 1.2), close(v['walk'], walk) and close(v['base']['walk'], walk / 1.18)]
    ok('t-effects', all(got), [got, r.stderr[-300:]])
# The odds of a battle (F12b, QAF): the same armies and towers, each side's power and the odds the computers read, against Mid's frozen unitPower, powerOf, lanchester (08-core),
# vsMul (15-sim-spatial), powerFrom, estPower, matchup (17-ai) and oddsOf (11-orders) with Mid's own numbers (a tower 120, the people 250); Mid's dmgOf runs with its weather, temper and
# hunger at rest. Who counters whom comes from v100's class and counter (D138, D140) as Mid's vs table. And a villager walled in from every find tries one find a beat and ends idle or waiting
ARMIES = [(['UM1', 'UM1', 'UM2', 'UM2', 'UM2'], ['UM3', 'UM3'], 1, 0), (['UM3'] * 4, ['UM1'] * 5 + ['UM2'], 0, 1), (['UM1'] * 10 + ['UM2'] * 2, ['UM2'] * 11, 2, 1), (['UM2'], [], 1, 0), ([], ['UM4', 'UM1'], 0, 0)]
WAROD = """(() => { const D = FK.D, [me, foe] = D.players, tw = Object.keys(D.tower).find((c) => !FK.SH[c].ticks.includes('Seat') && D.cost[c]), out = [];
  for (const [A, B, towers, dead] of ARMIES) { FK.reset(); const at = (s) => FK.units().find((v) => v.side === s).k, h = FK.seatOf(foe); let n = 0;
    A.forEach((c, i) => { const u = FK.spawn(c, me, at(me), FK.rng); u.hp = Math.ceil(u.hpMax * (1 - i / 17)); }); B.forEach((c, i) => { const u = FK.spawn(c, foe, at(foe), FK.rng); u.hp = Math.ceil(u.hpMax * (1 - i / 13)); });
    for (let d = 6; d < 40 && n < towers + dead; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) if (n < towers + dead && ECON.canPlace(tw, i, j)) { const t = FK.build(tw, i, j, FK.SIDES[foe].col); t.hp = n++ < towers ? 50 : 0; }
    const mine = WAR.armyOf(me), theirs = WAR.armyOf(foe);
    out.push({ units: FK.units().map((u) => [u.side, u.code, u.hp]), blds: FK.things().filter((t) => t.kind === 'bld').map((t) => [t.side, D.tower[t.code] && !FK.SH[t.code].ticks.includes('Seat') ? 'tower' : t.code, t.hp]),
      power: [WAR.power(mine), WAR.power(theirs)], odds: WAR.odds(mine, foe), sides: [me, foe] }); }
  return out; })()"""
WALLED = """(() => { FK.reset(); const u = ECON.villagersOf(0).find((v) => !v.load), ring = []; for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) { const k = u.k + y * FK.N + x; if ((x || y) && FK.OCC[k] === 0) { FK.OCC[k] = 1; ring.push(k); } }
  const marks = () => FK.things().filter((t) => t.noPath != null).length, tree = FK.things().filter((t) => t.kind === 'tree').sort((a, b) => Math.hypot(a.bx - u.bx, a.by - u.by) - Math.hypot(b.bx - u.bx, b.by - u.by))[0];
  let err = '', one = -1; try { const m0 = marks(); ECON.gatherAt(u, tree); one = marks() - m0; for (let i = 0; i < 600; i++) FK.sim(0.1); } catch (e) { err = String(e); }
  for (const k of ring) FK.OCC[k] = 0; return [err, one, u.job]; })()"""
MIDODDS = r"""const vm = require('vm'), fs = require('fs'), [core, spatial, ai, orders, run] = process.argv.slice(1).map((f, i) => (i < 4 ? fs.readFileSync(f, 'utf8') : JSON.parse(f)));
const cut = (t, a, b) => t.slice(t.indexOf(a), t.indexOf(b, t.indexOf(a))), out = [];
for (const c of run.cases) { const ctx = { RUN: run, C: c }; vm.createContext(ctx);
  vm.runInContext([`const WILD = -1, G = { t: 0, units: C.units.map(([owner, kind, hp]) => ({ owner, kind, hp })), blds: C.blds.map(([owner, kind, hp]) => ({ owner, kind, hp, prog: 1 })) };
  const UNIT = Object.fromEntries(Object.entries(RUN.stats).map(([k, s]) => [k, { tick: RUN.soldier.includes(k) ? 'sol' : 'vil', tags: [s.cls] }])), hasTag = (k, t) => UNIT[k].tags.includes(t), baseKind = (k) => k;
  const stats = (o, k) => ({ dmg: RUN.stats[k].atk, vs: RUN.stats[k].vs ? { [RUN.stats[k].vs]: RUN.counter } : null }), wearMul = () => 1, shapeOf = () => ({}), TEMPER = { calm: {} }, temperOf = () => 'calm', hungerOf = () => 1, EVM = { dmg: 1 }, ZEAL = {}, CHARGE = {}, fxv = () => ({ m: 1 })`,
    cut(core, 'const clamp', 'const hyp'), cut(core, 'const bldsOf', 'const ready'), cut(core, 'const isSoldier', 'const armyOf'), cut(core, 'const dmgOf', 'const rngOf'), cut(core, 'const unitPower', '// the square law'), cut(core, 'const lanchester', '// ═'),
    cut(spatial, 'function vsMul', '\n}') + '\n}', cut(ai, 'const powerFrom', 'const nearestType'), cut(ai, 'function matchup', '// a wave'), cut(orders, 'const oddsOf', 'function judgeEnvoy'),
    `const [q, o] = C.sides; var OUT = { power: [powerOf(soldiersOf(q)), powerOf(soldiersOf(o))], odds: oddsOf(q, o) };`].join(';\n'), ctx);
  out.push(vm.runInContext('OUT', ctx)); }
console.log(JSON.stringify(out));"""
async def odds(b):   # same armies, same odds as Mid's frozen code; a villager walled in does not crash
    pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); await pg.goto(URL); await pg.wait_for_timeout(800)
    v = await pg.evaluate(WAROD.replace('ARMIES', json.dumps(ARMIES))); walled = await pg.evaluate(WALLED); await pg.close()
    soldier = [c for c in MEASURE['stats'] if 'Fight' in SHELLS[c]['ticks'] and 'Gather' not in SHELLS[c]['ticks']]
    r = subprocess.run(['node', '-e', MIDODDS] + [os.path.join(HERE, '../mid/src', f) for f in ('08-core.js', '15-sim-spatial.js', '17-ai.js', '11-orders.js')] + [json.dumps({'cases': v, 'stats': MEASURE['stats'], 'counter': MEASURE['counter'], 'soldier': soldier})], capture_output=True, text=True)
    mid = json.loads(r.stdout or 'null')
    got = [bool(mid) and all(close(a['power'], m['power']) and close(a['odds'], m['odds']) for a, m in zip(v, mid)), len({round(a['odds'], 6) for a in v}) == len(v),
           walled[0] == '' and walled[1] == 1 and walled[2] in ('idle', 'wait') and not errs]
    ok('t-odds', all(got), [got, [(a['odds'], m['odds']) for a, m in zip(v, mid or [])], walled, errs[:2], r.stderr[-300:]])
# Who is a foe (F12c): the same sides, wild kinds and treaties put to v100's isFoe, atWar and friendly and to Mid's frozen isFoe, gangOf, gangRel, atWar and friendly (08-core) over
# Mid's own unit table (02-rules-units: its tags and gangs), each v100 kind read as the Mid kind it wears (its look); Mid's struck memory empty (no camp has been struck), its wild the fifth side (its own WILD).
# Then on the page: two soldiers of two sides beside a Town Center keep the peace a treaty made, and fight once it is war
WILDK = ['MW3', 'MW4', 'MW6', 'MH1', 'MH3', 'MH4']; TREATIES = [[0, 2, 'peace'], [1, 3, 'ally'], [0, 'ban', 'peace'], [2, 'nat', 'ally'], [3, 'rob', 'peace'], [1, 'out', 'peace'], [2, 0, 'ally']]
FOE = """(() => { FK.reset(); const W = WAR, out = { foe: [], war: [], friend: [] }, wild = WILDK, sides = [0, 1, 2, 3], groups = ['nat', 'out', 'ban', 'rob'];
  for (const [a, b, s] of TREATIES) W.treaty(a, b, s);
  const xs = sides.map((s) => ({ side: s, code: 'UM1' })).concat(wild.map((c) => ({ side: -1, code: c })));
  for (const o of sides) for (const x of xs) out.foe.push([o, x.side, x.code, null, W.isFoe(o, x)]);
  for (const me of wild) for (const x of xs) out.foe.push([-1, x.side, x.code, me, W.isFoe(-1, x, { side: -1, code: me })]);
  for (const a of sides) { for (const b of sides.concat(groups)) out.war.push([a, b, W.atWar(a, b)]); for (const b of sides) out.friend.push([a, b, W.friendly(a, b)]); }
  return out; })()"""
KEEP = """(() => { FK.reset(); const D = FK.D, [me, foe] = D.players, v = ECON.villagersOf(me)[0], a = FK.spawn(FK.D.ai.troops[0], me, v.k, FK.rng), b = FK.spawn(FK.D.ai.troops[0], foe, v.k, FK.rng), hp = () => [a.hp, b.hp];
  WAR.treaty(me, foe, 'peace'); const full = hp(); for (let i = 0; i < 50; i++) FK.sim(0.1); const kept = JSON.stringify(hp()) === JSON.stringify(full) && a.target !== b && b.target !== a;
  WAR.treaty(me, foe, 'war'); for (let i = 0; i < 100; i++) FK.sim(0.1); return [kept, a.hp < full[0] || b.hp < full[1]]; })()"""
MIDFOE = r"""const vm = require('vm'), fs = require('fs'), [basics, units, core, run] = process.argv.slice(1).map((f, i) => (i < 3 ? fs.readFileSync(f, 'utf8') : JSON.parse(f)));
const cut = (t, a, b) => t.slice(t.indexOf(a), t.indexOf(b, t.indexOf(a))), ctx = { RUN: run }; vm.createContext(ctx);
vm.runInContext([basics, units, `const side = (s) => (s < 0 ? WILD : s), G = { t: 0, struck: {}, rel: [0, 1, 2, 3, 4].map((a) => [0, 1, 2, 3, 4].map((b) => (a === b ? 'self' : 'war'))), gang: {} };
  for (const g of ['out', 'ban', 'rob']) G.gang[g] = { rel: [0, 1, 2, 3, 4].map(() => 'war') };
  const gangState = (g) => G.gang[g], kind = (c) => RUN.look[c], at = (s, c, i) => ({ owner: side(s), kind: kind(c), id: i, x: 0, y: 0 });
  for (const [a, b, s] of RUN.treaties) { if (typeof b === 'number') G.rel[a][b] = G.rel[b][a] = s; else if (b === 'nat') G.rel[a][WILD] = G.rel[WILD][a] = s; else G.gang[b].rel[a] = s; }`,
  cut(core, 'const atWar', 'const season'),
  `var OUT = { foe: RUN.foe.map(([o, s, c, me], i) => [o, s, c, me, isFoe(side(o), at(s, c, i), me ? at(-1, me, -9) : undefined)]),
    war: RUN.war.map(([a, b]) => [a, b, typeof b === 'number' ? atWar(a, b) : gangRel(a, b) === 'war']), friend: RUN.friend.map(([a, b]) => [a, b, friendly(a, b)]) };`].join(';\n'), ctx);
console.log(JSON.stringify(ctx.OUT));"""
async def foe(b):   # same sides, same stances, same foes as Mid's frozen isFoe; a treaty's peace is kept on the field
    pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); await pg.goto(URL); await pg.wait_for_timeout(800)
    v = await pg.evaluate(FOE.replace('WILDK', json.dumps(WILDK)).replace('TREATIES', json.dumps(TREATIES))); keep = await pg.evaluate(KEEP); await pg.close()
    look = {c: SHELLS[c]['look'] for c in WILDK + ['UM1']}
    r = subprocess.run(['node', '-e', MIDFOE] + [os.path.join(HERE, '../mid/src', f) for f in ('01-rules-basics.js', '02-rules-units.js', '08-core.js')] + [json.dumps({'look': look, 'treaties': TREATIES, **v})], capture_output=True, text=True)
    mid = json.loads(r.stdout or 'null')
    off = [x for k in ('foe', 'war', 'friend') for x, y in zip(v[k], (mid or {}).get(k, [])) if x != y]
    ok('t-foe', mid and not off and len(set(x[-1] for x in v['foe'])) == 2 and keep == [True, True] and not errs, [off[:6], keep, errs[:2], r.stderr[-300:]])
# Ages and research (F13a): the same orders, the same answers as Mid's frozen code: the age up Stone to Bronze (its price and wait, 01-rules-basics AGES, 11-orders ageUp) and
# the woodcutting line in order (04-rules-tech TECH; 08-core lineOf, prevOf, needsOf, nextStep; 11-orders researchWhy, research, techCost), each step's price, time and
# refusal, and the rate a villager cuts wood at after each step against Mid's gatherMul with its shares added (Albert, Nov 5 11:40: m += f.m − 1). A finished order is
# Mid's own completion (12-sim-core: p.age = j.age; learnTech adds the step and dirties the effects), its words and sounds left out
ORDERS = [['age'], ['done'], ['tech', 'axes'], ['tech', 'hafting'], ['tech', 'hafting'], ['done'], ['tech', 'sawpits'], ['tech', 'axes'], ['done'], ['tech', 'ironaxe'], ['tech', 'hafting']]
RES = """(() => { FK.reset(); const s = FK.SIDES[0], st = s.store, T = BOOKS.tech, key = (k) => Object.keys(T).find((c) => T[c].key === k), H = key('hafting'), at = T[H].value.at, h = FK.seatOf(0), out = [];
  for (const y of ECON.YIELDS) st[y] = 5000; let lab = null;
  for (let d = 6; d < 40 && !lab; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) if (!lab && ECON.canPlace(at, i, j)) lab = FK.build(at, i, j, s.col);
  const u = ECON.villagersOf(0)[0], tree = FK.things().filter((t) => t.kind === 'tree').sort((a, b) => Math.hypot(a.bx - u.bx, a.by - u.by) - Math.hypot(b.bx - u.bx, b.by - u.by))[0];
  const cut = () => { u.load = 0; u.carry = null; ECON.gatherAt(u, tree); for (let k = 0; k < 3000 && !(u.job === 'gather' && !u.path); k++) FK.sim(0.1); u.load = 0; FK.sim(0.1); const r = [u.load / 0.1, FK.stat(TREE, 0, 'rate')]; ECON.idle(u); return r; };
  const base = cut(); let last = null;
  for (const [o, k] of ORDERS) { const before = { ...st };
    if (o === 'age') { const c = ECON.ageCost(0), ok = ECON.ageUp(0); last = ['age', s.aging]; out.push([o, k, ok, '', c, s.aging]); }
    else if (o === 'tech') { const c = key(k), why = ECON.researchWhy(0, c), ok = ECON.research(0, c); if (ok) last = ['tech', c]; out.push([o, k, ok, why, Object.fromEntries(ECON.YIELDS.map((y) => [y, before[y] - st[y]]).filter(([, n]) => n)), ok ? lab.q.length === 1 ? lab.qt : null : null]); }
    else { let n = 0; if (last[0] === 'age') while (s.age < 1 && n < 9999) { FK.sim(0.1); n++; } else while (ECON.researchWhy(0, last[1]) !== 'known' && n < 9999) { FK.sim(0.1); n++; } const [got, stat] = cut(); out.push([o, last[0], s.age, n, got / base[0], stat / base[1]]); } }
  return { out, line: ECON.lineOf(H).map((c) => T[c].key), next: T[ECON.nextStep(0, H)].key, needs: ECON.needsOf(key('ironaxe')).map((c) => (T[c] ? T[c].key : c)), queued: lab.q.length }; })()"""
MIDRES = r"""const vm = require('vm'), fs = require('fs'), [basics, units, blds, tech, core, orders, run] = process.argv.slice(1).map((f, i) => (i < 6 ? fs.readFileSync(f, 'utf8') : JSON.parse(f)));
const cut = (t, a, b) => t.slice(t.indexOf(a), t.indexOf(b, t.indexOf(a))), ctx = { RUN: run }; vm.createContext(ctx);
const fx = cut(core, 'function fxList', '// Two words').replace('if (f.m) m *= f.m;', 'if (f.m) m += f.m - 1;');
vm.runInContext([basics, units, blds, tech, fx, cut(core, 'const costText', 'const afford'), cut(core, 'const afford', '// Every'), cut(core, 'const sumCost', 'const fmt'), cut(core, 'const bldsOf', 'const readyAt'),
  cut(core, 'const qMax', 'const lineFree'), cut(core, 'const lineOf', 'const todaySeed'), cut(core, 'const nodeKey', 'const makeOf'), cut(orders, 'const scaled', 'const unitCost'), cut(orders, 'const techCost', 'function trainWhy'),
  cut(orders, 'function researchWhy', 'let navHold'),
  `const standing = (b, o) => b.owner === o && b.prog >= 1 && b.hp > 0, keepOf = (o) => G.blds.find((b) => b.owner === o && b.kind === 'keep'), nextAge = (o) => AGES[G.P[o].age + 1] || null, pay = (p, c) => { for (const k in c) p.res[k] -= c[k]; };
  const EVM = { gather: 1 }, WEATHER = [{}], season = () => ({ name: 'Summer', farm: 1 }), SCALE = { kinds: [] }, hz = () => false;
  const G = { fxv: 0, wx: 0, P: [{ id: 0, res: { f: 5000, w: 5000, g: 5000, s: 5000, i: 5000 }, techs: new Set(), age: 0, spent: 0 }], blds: [{ owner: 0, kind: 'keep', prog: 1, hp: 1, q: [] }, { owner: 0, kind: 'lumber', prog: 1, hp: 1, q: [] }] };
  const p = G.P[0], why = (w) => (!w ? '' : w === 'Already known.' ? 'known' : w.startsWith('Needs the ') ? 'age' : w === 'Being researched.' ? 'busy' : w.startsWith('Needs a ') ? 'at' : w === 'That line is full.' ? 'full' : w.startsWith('Not enough') ? 'cost' : 'need');
  const Y = { f: 'food', w: 'wood', g: 'gold', s: 'stone', i: 'iron' }, named = (c) => Object.fromEntries(Object.entries(c).map(([k, n]) => [Y[k], n])), base = gatherMul(0, { kind: 'tree' });
  var OUT = { out: [] }; let last = null;
  for (const [o, k] of RUN.orders) { const before = { ...p.res };
    if (o === 'age') { const c = nextAge(0).cost, ok = ageUp(0), j = G.blds[0].q[0]; last = j; OUT.out.push([o, k, ok, '', named(c), j.total]); }
    else if (o === 'tech') { const w = why(researchWhy(0, k)), ok = research(0, k), q = G.blds[1].q, j = ok ? q[q.length - 1] : null; if (ok) last = j; OUT.out.push([o, k, ok, w, named(Object.fromEntries(Object.keys(before).map((y) => [y, before[y] - p.res[y]]).filter(([, n]) => n))), ok && q.length === 1 ? j.total : null]); }
    else { const b = G.blds.find((x) => x.q[0] === last); b.q.shift(); if (last.age) { p.age = last.age; p.aging = false; } else p.techs.add(last.tech); G.fxv++; const m = gatherMul(0, { kind: 'tree' }) / base; OUT.out.push([o, last.age ? 'age' : 'tech', p.age, Math.round(last.total / 0.1), m, m]); } }
  OUT.line = lineOf(TECHBY.hafting).map((t) => t.id); OUT.next = nextStep(0, TECHBY.hafting).id; OUT.needs = needsOf(TECHBY.ironaxe); OUT.queued = G.blds[1].q.length;`].join(';\n'), ctx);
console.log(JSON.stringify(ctx.OUT));"""
async def research(b):   # same orders, same prices, times, refusals, line and rate as Mid's frozen code, with its shares added
    pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); await pg.goto(URL); await pg.wait_for_timeout(800)
    v = await pg.evaluate(RES.replace('ORDERS', json.dumps(ORDERS)).replace('TREE', json.dumps(TREE))); await pg.close()
    r = subprocess.run(['node', '-e', MIDRES] + [os.path.join(HERE, '../mid/src', f) for f in ('01-rules-basics.js', '02-rules-units.js', '03-rules-buildings.js', '04-rules-tech.js', '08-core.js', '11-orders.js')] + [json.dumps({'orders': ORDERS})], capture_output=True, text=True)
    mid = json.loads(r.stdout or 'null')
    steps = lambda o: [x[:3] + x[4:] if x[0] == 'done' else x for x in o]   # a wait is held to Mid's time within a tick, below
    waits = [abs(a[3] - m[3]) <= 1 for a, m in zip(v['out'], (mid or {}).get('out', [])) if a[0] == 'done']
    got = [bool(mid) and close(steps(v['out']), steps(mid['out'])) and all(waits) and len(waits) == 3, bool(mid) and all(v[k] == mid[k] for k in ('line', 'next', 'needs', 'queued')),
           [x[3] for x in v['out'] if x[0] == 'tech'] == ['need', '', 'busy', 'age', '', 'need', 'known'], close(v['out'][-3][4], 1.25) and not errs]
    ok('t-research', all(got), [got, v['out'], (mid or {}).get('out'), errs[:2], r.stderr[-400:]])
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
