# The page's tests: the rules of stage "page" in books/rules.js, one test each, named by its key. They check only what needs the running page;
# what the files alone prove is the gate's (index.py). Run: python3 test.py (all, as publish.py does) or python3 test.py --only t-a,t-b (a build's own; headless Chrome and Playwright)
import asyncio, os, re, sys, json, shutil, subprocess, tempfile
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); URL = 'file://' + os.path.join(HERE, 'index.html') + '#20261105'
book = lambda n: json.loads(re.search(r'BOOK\("%s", ([\s\S]*)\);' % n, open(os.path.join(HERE, f'books/{n}.js')).read()).group(1))
keyed = lambda n: {e['key']: e['value'] for e in book(n).values()}
RULES = {e['key']: e['name'] for e in book('rules').values() if e['value']['stage'] == 'page'}
ONLY = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else list(RULES)
CHROME = next((p for p in ('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser') if os.path.exists(p)), None); done = {}
def ok(key, cond, got=''):
    if key not in ONLY: return   # a test of several rules says only those asked for
    done[key] = done.get(key, True) and bool(cond); print(('PASS ' if cond else 'FAIL ') + f'[{key}] {RULES[key]}' + ('' if cond else f'  [{got}]'), flush=True)
async def fresh(b, wait=800):   # a new page on the seed, its errors gathered
    pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); await pg.goto(URL); await pg.wait_for_timeout(wait); return pg, errs
# The one loader of Mid's frozen code (mid/src) into node's vm. parts {name: file} are read as text; body is JS that returns what is held to the page, with cut(text, from, to)
# (to the end when to is empty), qca(text) Mid's fxv under the effects law (QCA, Albert Nov 5 18:07: its boosts added, its cuts one at a time) and box(code, more): code (a string or a list joined) run in a fresh context holding RUN and more, its OUT returned. RUN comes in on stdin
MIDJS = r"""const vm = require('vm'), fs = require('fs'), RUN = JSON.parse(fs.readFileSync(0, 'utf8')), src = (f) => fs.readFileSync(DIR + '/' + f + '.js', 'utf8');
const cut = (t, a, b) => t.slice(t.indexOf(a), b ? t.indexOf(b, t.indexOf(a)) : undefined), qca = (t) => t.replace('let m = 1,', 'let m = 1, up = 1, cuts = 1,').replace('if (f.m) m *= f.m;', 'if (f.m > 1) up += f.m - 1; else if (f.m) cuts *= f.m;').replace('return (M[key] = { m, a', 'return (M[key] = { m: up * cuts, a'), box = (code, more) => { const ctx = { RUN, ...more }; vm.createContext(ctx); vm.runInContext([].concat(code).join(';\n'), ctx); return vm.runInContext('OUT', ctx); };
"""
def frozen(parts, body, run=None):   # Mid's answer (None if it broke) and node's errors
    js = MIDJS.replace('DIR', json.dumps(os.path.join(HERE, '../mid/src'))) + ''.join(f'const {n} = src({json.dumps(f)});\n' for n, f in parts.items())
    r = subprocess.run(['node', '-e', js + f'console.log(JSON.stringify((() => {{ {body} }})()));'], input=json.dumps(run), capture_output=True, text=True)
    return json.loads(r.stdout or 'null'), r.stderr
async def main(b):   # the screen and Build A's fixes, on one page in turn
    pg, errs = await fresh(b, 1500); ev = pg.evaluate
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
    ok('t-errors', not errs, errs[:3]); await pg.close()
SAME = """(() => { FK.reset(); let beats = 0, wet = 0; for (let i = 0; i < 3000; i++) { FK.sim(0.1); beats += FK.every(FK.D.beats.slow); wet += FK.K.wetHour; }   // 300 s of play, the weather in it
  const r = (x) => Math.round(x * 1e6), state = [FK.units().map((u) => [u.code, u.side, r(u.bx), r(u.by), u.hp, r(u.cd), u.job]), FK.SIDES.map((s) => s.store), r(FK.K.wet), FK.K.fogT, ECON.score(0).total];
  const near = [], us = FK.units(); for (const u of us.slice(0, 60)) for (const R of [30, 80, 200]) { const got = []; FK.unitsNear(u, R, (v) => got.push(us.indexOf(v))); near.push(JSON.stringify(got.sort((a, b) => a - b)) === JSON.stringify(us.map((v, i) => (v !== u && Math.abs(v.bx - u.bx) < R && Math.abs(v.by - u.by) < R ? i : -1)).filter((i) => i >= 0)));
    const bs = []; FK.bldsNear(u.bx, u.by, R, (t) => { bs.push(t); }); near.push(FK.things().every((t) => t.kind !== 'bld' || Math.abs(t.bx - u.bx) >= R || Math.abs(t.by - u.by) >= R || bs.includes(t))); }
  return { state: JSON.stringify(state), draws: Array.from({ length: 20 }, FK.rng), beats, wet, near: near.every(Boolean) && near.length > 0, mine: Array.from({ length: 1000 }, dice(20261105)), book: [FK.D.beats, FK.D.grid] }; })()"""
MIDRNG = r"""return box(core.match(/function rng\(\) \{[\s\S]*?\n\}/)[0] + ';' + tuning.match(/const BEAT = [^;]*;/)[0] + ';var OUT = { draws: Array.from({ length: 1000 }, rng), book: [BEAT, { unit: ' + spatial.match(/const UG = (\d+)/)[1] + ', bld: ' + spatial.match(/const SGC = (\d+)/)[1] + ' }] };', { G: { rs: 20261105 } });"""
async def same(b):   # same seed, same game: two pages on one seed play 300 s alike and draw alike; the dice are Mid's own rng draw for draw; the grids find what a full scan finds
    mid, _ = frozen({'core': '08-core', 'tuning': '06-rules-tuning', 'spatial': '15-sim-spatial'}, MIDRNG)
    runs = []
    for _ in range(2):
        pg, _ = await fresh(b); runs.append(await pg.evaluate(SAME)); await pg.close()
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
MIDLEDGER = r"""return box([cut(core, 'const clamp', 'const hyp'), cut(core, 'function earn(', '// the door of a keep'), cut(core, 'const plural', '// Settings'), cut(orders, 'function shellBack', 'function refundOf'), cut(eco, 'const flowOf', 'function initEconomy'),
  cut(text, 'const slowPct', '// the loyalty'), cut(text, 'const LEDGER_WORD', '// the scenarios'), 'const MAP = 3060;' + cut(nav, 'const COORD', 'function snapPos'), 'const ' + cut(cards, 'line = (o)', "'nothing yet';") + "'nothing yet';",
  `const WILD = -1, p = { id: 0, res: { ...RUN.start }, gathered: 0, flow: {}, rate: {}, spent1: {}, orate: {}, ledger: { in: {}, out: {} } }, G = { P: [p], tick: 0 }, BLD = { home: { cost: RUN.home } }, OUT = { steps: [] };
  const Y = RUN.Y, snap = () => JSON.parse(JSON.stringify({ store: p.res, gathered: p.gathered, flow: p.flow, spent1: p.spent1, flowBy: p.flowBy || {}, spentBy: p.spentBy || {}, rate: p.rate, orate: p.orate, ledger: p.ledger, lines: [line(p.ledger.in), line(p.ledger.out)],
    vel: Y.map((y) => [flowOf(p, y, p.rate, p.flow), outOf(p, y), netOf(p, y), velOf(p, y)]) }));
  for (const [, , calls, , t] of RUN.steps) { G.tick = t * 30; for (const [f, ...a] of calls) { if (a[0] === 'shellBack') a[0] = shellBack({ kind: 'home', prog: 0.1 }); ({ earn, spend, pay, payBack, flowTick })[f](...(f === 'flowTick' ? [] : [p, ...a])); } OUT.steps.push(snap()); }
  OUT.say = { fmt: [0, 7.9, 999, 1000, 1234, 9999, 10000, 12345, 999999].map(fmt), plural: RUN.names.map(plural), some: RUN.names.map((n, i) => some(i % 3, n)), or: [['a'], ['a', 'b'], ['a', 'b', 'c', 'd']].map(orList), slow: [0, 0.2, 0.5, 1.3].map(slowPct),
    coord: [[-50, -50], [0, 0], [99, 99], [100, 250], [1234, 567], [2159, 2159]].map(([x, y]) => coord(x, y)) };`]);"""
def close(a, b):   # equal, numbers within a millionth
    if isinstance(a, dict) and isinstance(b, dict): return a.keys() == b.keys() and all(close(a[k], b[k]) for k in a)
    if isinstance(a, list) and isinstance(b, list): return len(a) == len(b) and all(map(close, a, b))
    if isinstance(a, (int, float)) and isinstance(b, (int, float)): return abs(a - b) <= 1e-6 * max(1, abs(a), abs(b))
    return a == b
async def ledger(b):   # same action, same stores, flow, ledger and words as Mid's frozen code; and 300 s of four sides' play balance the ledger to the unit
    pg, _ = await fresh(b)
    v = await pg.evaluate(ACTS.replace('NAMES', json.dumps(NAMES)))
    bal = await pg.evaluate(BALANCE); await pg.close()
    mid, err = frozen({'core': '08-core', 'orders': '11-orders', 'eco': '36-economy', 'text': '07-text', 'nav': '09-nav', 'cards': '30-cards'}, MIDLEDGER, {'start': v['start'], 'home': v['home'], 'steps': v['steps'], 'names': NAMES, 'Y': v['Y']})
    off = [v['steps'][i][0] for i in range(len(v['steps'])) if not mid or not close(v['steps'][i][3], mid['steps'][i])] + [k for k in v['say'] if not mid or v['say'][k] != mid['say'][k]]
    acted = all(x[1] for x in v['steps'])
    ok('t-ledger', mid and not off and acted and all(all(x) for x in bal), [off, acted, bal, err[-300:]])
# The effects law (F12a, QCA): with a set of effects in force, a kind's numbers are Mid's stats(), maxHpB, unitCost and techCost, and its rehealth, run in Mid's frozen 08-core and
# 11-orders with one change: Mid multiplied its shares (fxv: m *= f.m); Albert's calls (Nov 5 11:40, 18:07) add the boosts and apply the cuts one at a time, so Mid's line is read
# through qca (its boosts turned into added shares, its cuts kept as Mid compounded them; two cuts on the spearman's price). Mid's keys come from tags that name what v100's keys name (the heads of a code's letters and its ticks, worked out here, not by the page). A building's health is also
# held to v100's D139 × (1 + Σ); the lowest, a find's rate and the walk are checked on the page (Mid's gathering waits for its own laws)
SHELLS = book('shells'); MEASURE = keyed('measure')
heads = lambda c: [re.match(r'[A-Z]*', c).group(0)[:i + 1] for i in range(len(re.match(r'[A-Z]*', c).group(0)))]
HOME = next(c for c, e in SHELLS.items() if 'House' in e['ticks'] and 'Seat' not in e['ticks']); SEAT = next(c for c, e in SHELLS.items() if 'Seat' in e['ticks'])
TREE = next(c for c, e in SHELLS.items() if e.get('find') in MEASURE['rate']); SOLDIER = next(c for c in MEASURE['stats'] if 'Fight' in SHELLS[c]['ticks'] and 'Gather' not in SHELLS[c]['ticks'])
FX = [({'s': 'spd', 'k': 'UV', 'p': 0.10}, {'s': 'spd', 'k': 'UV', 'm': 1.10}), ({'s': 'spd', 'k': 'Walk', 'p': 0.08}, {'s': 'spd', 'k': '#Walk', 'm': 1.08}), ({'s': 'spd', 'k': 'UM3', 'p': 0.5}, {'s': 'spd', 'k': 'UM3', 'm': 1.5}),
      ({'s': 'hp', 'k': 'UM', 'p': 0.15}, {'s': 'uhp', 'k': '#UM', 'm': 1.15}), ({'s': 'hp', 'k': SOLDIER, 'p': 0.05}, {'s': 'uhp', 'k': SOLDIER, 'm': 1.05}),
      ({'s': 'hp', 'k': HOME, 'p': 0.10}, {'s': 'bhp', 'k': HOME, 'm': 1.10}), ({'s': 'hp', 'k': 'B', 'p': 0.08}, {'s': 'bhp', 'k': '*', 'm': 1.08}),
      ({'s': 'atk', 'k': 'UM1', 'a': 2}, {'s': 'dmg', 'k': 'UM1', 'a': 2}), ({'s': 'atk', 'k': 'Fight', 'a': 1}, {'s': 'dmg', 'k': '#Fight', 'a': 1}), ({'s': 'rng', 'k': 'Shoot', 'a': 1}, {'s': 'rng', 'k': '#Shoot', 'a': 1}),
      ({'s': 'cost', 'k': 'UM', 'c': 0.13}, {'s': 'cost', 'k': '#UM', 'm': 0.87}), ({'s': 'cost', 'k': 'O', 'c': 0.2}, {'s': 'cost', 'k': '#research', 'm': 0.8}), ({'s': 'cost', 'k': 'UM1', 'c': 0.5}, {'s': 'cost', 'k': 'UM1', 'm': 0.5}),
      ({'s': 'rof', 'k': 'UM3', 'min': 1.2}, None), ({'s': 'rate', 'k': TREE, 'p': 0.2}, None)]
STEP = {'wood': 233, 'gold': 117}
EFF = """(() => { FK.reset(); const D = FK.D, kinds = Object.keys(D.stats), seat = FK.seatOf(0), keys = ['hp', 'atk', 'rng', 'spd'], read = (side) => kinds.map((k) => keys.map((y) => FK.stat(k, side, y)));
  const u = FK.units().find((v) => v.side === 0 && FK.has(v, 'Gather') && !FK.MARSH[v.k]), sol = FK.spawn(SOLDIER, 0, u.k, FK.rng); sol.hp = 20; seat.hp = seat.hpMax / 2;
  const base = { read: read(0), walk: FK.stat(u.code, 0, 'spd') }; BOOKS.tech.O0 = { key: 'O0', value: { cost: STEP, fx: FX }, name: 'a test step', cite: [], law: ['QCA'] }; FK.learn(0, 'O0');
  const out = { base, mine: read(0), wild: read(1), cost: kinds.filter((k) => D.cost[k]).map((k) => FK.stat(k, 0, 'cost')), tech: FK.stat('O0', 0, 'cost'), home: FK.stat(HOME, 0, 'hp'), seat: [seat.hp, seat.hpMax], sol: [sol.hp, sol.hpMax],
    rof: [FK.stat('UM3', 0, 'rof'), FK.stat('UM1', 0, 'rof')], rate: FK.stat(TREE, 0, 'rate'), seatBase: D.bldHp[seat.code], kinds };
  FK.K.wet = FK.K.snow = 0; FK.go(u, [3, -3, 3 * FK.N, -3 * FK.N].map((d) => u.k + d).find(FK.walkable)); FK.step(0.1); out.walk = u.mps; delete BOOKS.tech.O0; FK.reset(); out.after = FK.stat(HOME, 0, 'hp'); return out; })()"""
MIDFX = r"""const law = cut(core, 'function fxList', '// Two words'), add = qca(law);
const go = (fx) => box([fx, cut(core, 'const unitKeys', 'const dmgOf'), cut(core, 'function rehealth', '// Hawk-Dove'), cut(orders, 'const scaled', 'function trainWhy'),
  `const WILD = -1, TECH = [], CIVS = {}, standing = () => true, baseKind = (k) => k, TECHBY = { O0: { fx: RUN.fx } }, G = { fxv: 0, P: [{ techs: new Set() }, { techs: new Set() }] };
  const UNIT = Object.fromEntries(RUN.kinds.map((k) => [k, { name: k, hp: RUN.stats[k].hp, dmg: RUN.stats[k].atk, rng: RUN.stats[k].rng, spd: RUN.spd[k], sight: 0, tags: RUN.tags[k], cost: RUN.cost[k] }]));
  const BLD = { [RUN.home]: { hp: RUN.bhp[RUN.home] }, [RUN.seat]: { hp: RUN.bhp[RUN.seat] } };
  G.units = [{ owner: 0, kind: RUN.soldier, hp: 20, max: RUN.stats[RUN.soldier].hp }]; G.blds = [{ owner: 0, kind: RUN.seat, hp: RUN.bhp[RUN.seat] / 2, mx: RUN.bhp[RUN.seat], prog: 1 }];
  G.P[0].techs.add('O0'); rehealth(0); const read = (o) => RUN.kinds.map((k) => { const s = stats(o, k); return [s.hp, s.dmg, s.rng, s.spd]; });
  var OUT = { mine: read(0), wild: read(1), cost: RUN.kinds.filter((k) => RUN.cost[k]).map((k) => unitCost(0, k)), tech: techCost(0, { cost: RUN.step }), home: maxHpB(0, RUN.home), seat: [G.blds[0].hp, G.blds[0].mx], sol: [G.units[0].hp, G.units[0].max] };`]);
return { added: add !== law ? go(add) : null, compounded: go(law) };"""
async def effects(b):   # same effects, same numbers as Mid's frozen code with its shares added; a Home's health is D139 × (1 + Σ); the lowest, a find's rate and the walk read the law
    pg, _ = await fresh(b)
    v = await pg.evaluate(EFF.replace('SOLDIER', json.dumps(SOLDIER)).replace('HOME', json.dumps(HOME)).replace('TREE', json.dumps(TREE)).replace('STEP', json.dumps(STEP)).replace('FX', json.dumps([a for a, _ in FX]))); await pg.close()
    kinds = v['kinds']; run = {'kinds': kinds, 'stats': MEASURE['stats'], 'spd': {k: MEASURE['speed'][SHELLS[k]['pace'].split('.')[1]] for k in kinds}, 'cost': {k: MEASURE['cost'].get(k) for k in kinds},
        'tags': {k: heads(k) + SHELLS[k]['ticks'] + SHELLS[k].get('class', '').split() for k in kinds}, 'bhp': MEASURE['bldHp'], 'home': HOME, 'seat': SEAT, 'soldier': SOLDIER, 'step': STEP, 'fx': [m for _, m in FX if m]}
    mid, err = frozen({'core': '08-core', 'orders': '11-orders'}, MIDFX, run); add = mid and mid['added']
    walk = MEASURE['speed'][SHELLS['UV']['pace'].split('.')[1]] * (1 + 0.10 + 0.08)
    got = [bool(add) and all(close(v[k], add[k]) for k in ('mine', 'wild', 'cost', 'tech', 'home', 'seat', 'sol')),
           close(v['home'], MEASURE['bldHp'][HOME] * (1 + 0.10 + 0.08)) and close(v['after'], MEASURE['bldHp'][HOME]),
           bool(mid) and not close(v['mine'], mid['compounded']['mine']), v['rof'] == [1.2, MEASURE['stats']['UM1']['rof']],
           close(v['rate'], MEASURE['rate'][SHELLS[TREE]['find']] * 1.2), close(v['walk'], walk) and close(v['base']['walk'], walk / 1.18)]
    ok('t-effects', all(got), [got, err[-300:]])
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
  let err = '', one = -1; try { const m0 = marks(); ECON.gatherAt(u, tree); one = marks() - m0; for (let i = 0; i < 600 || (u.job === 'gather' && !u.target && i < 650); i++) FK.sim(0.1); } catch (e) { err = String(e); }   // F15: read past the one tick between two tries (a find whose path failed, the next looked for)
  for (const k of ring) FK.OCC[k] = 0; return [err, one, u.job]; })()"""
MIDODDS = r"""return RUN.cases.map((C) => box([`const WILD = -1, G = { t: 0, units: C.units.map(([owner, kind, hp]) => ({ owner, kind, hp })), blds: C.blds.map(([owner, kind, hp]) => ({ owner, kind, hp, prog: 1 })) };
  const UNIT = Object.fromEntries(Object.entries(RUN.stats).map(([k, s]) => [k, { tick: RUN.soldier.includes(k) ? 'sol' : 'vil', tags: [s.cls] }])), hasTag = (k, t) => UNIT[k].tags.includes(t), baseKind = (k) => k;
  const stats = (o, k) => ({ dmg: RUN.stats[k].atk, vs: RUN.stats[k].vs ? { [RUN.stats[k].vs]: RUN.counter } : null }), wearMul = () => 1, shapeOf = () => ({}), TEMPER = { calm: {} }, temperOf = () => 'calm', hungerOf = () => 1, EVM = { dmg: 1 }, ZEAL = {}, CHARGE = {}, fxv = () => ({ m: 1 })`,
    cut(core, 'const clamp', 'const hyp'), cut(core, 'const bldsOf', 'const ready'), cut(core, 'const isSoldier', 'const armyOf'), cut(core, 'const dmgOf', 'const rngOf'), cut(core, 'const unitPower', '// the square law'), cut(core, 'const lanchester', '// ═'),
    cut(spatial, 'function vsMul', '\n}') + '\n}', cut(ai, 'const powerFrom', 'const nearestType'), cut(ai, 'function matchup', '// a wave'), cut(orders, 'const oddsOf', 'function judgeEnvoy'),
    `const [q, o] = C.sides; var OUT = { power: [powerOf(soldiersOf(q)), powerOf(soldiersOf(o))], odds: oddsOf(q, o) };`], { C }));"""
async def odds(b):   # same armies, same odds as Mid's frozen code; a villager walled in does not crash
    pg, errs = await fresh(b)
    v = await pg.evaluate(WAROD.replace('ARMIES', json.dumps(ARMIES))); walled = await pg.evaluate(WALLED); await pg.close()
    soldier = [c for c in MEASURE['stats'] if 'Fight' in SHELLS[c]['ticks'] and 'Gather' not in SHELLS[c]['ticks']]
    mid, err = frozen({'core': '08-core', 'spatial': '15-sim-spatial', 'ai': '17-ai', 'orders': '11-orders'}, MIDODDS, {'cases': v, 'stats': MEASURE['stats'], 'counter': MEASURE['counter'], 'soldier': soldier})
    got = [bool(mid) and all(close(a['power'], m['power']) and close(a['odds'], m['odds']) for a, m in zip(v, mid)), len({round(a['odds'], 6) for a in v}) == len(v),
           walled[0] == '' and walled[1] == 1 and walled[2] in ('idle', 'wait') and not errs]
    ok('t-odds', all(got), [got, [(a['odds'], m['odds']) for a, m in zip(v, mid or [])], walled, errs[:2], err[-300:]])
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
MIDFOE = r"""return box([basics, units, `const side = (s) => (s < 0 ? WILD : s), G = { t: 0, struck: {}, rel: [0, 1, 2, 3, 4].map((a) => [0, 1, 2, 3, 4].map((b) => (a === b ? 'self' : 'war'))), gang: {} };
  for (const g of ['out', 'ban', 'rob']) G.gang[g] = { rel: [0, 1, 2, 3, 4].map(() => 'war') };
  const gangState = (g) => G.gang[g], kind = (c) => RUN.look[c], at = (s, c, i) => ({ owner: side(s), kind: kind(c), id: i, x: 0, y: 0 });
  for (const [a, b, s] of RUN.treaties) { if (typeof b === 'number') G.rel[a][b] = G.rel[b][a] = s; else if (b === 'nat') G.rel[a][WILD] = G.rel[WILD][a] = s; else G.gang[b].rel[a] = s; }`,
  cut(core, 'const atWar', 'const season'),
  `var OUT = { foe: RUN.foe.map(([o, s, c, me], i) => [o, s, c, me, isFoe(side(o), at(s, c, i), me ? at(-1, me, -9) : undefined)]),
    war: RUN.war.map(([a, b]) => [a, b, typeof b === 'number' ? atWar(a, b) : gangRel(a, b) === 'war']), friend: RUN.friend.map(([a, b]) => [a, b, friendly(a, b)]) };`]);"""
async def foe(b):   # same sides, same stances, same foes as Mid's frozen isFoe; a treaty's peace is kept on the field
    pg, errs = await fresh(b)
    v = await pg.evaluate(FOE.replace('WILDK', json.dumps(WILDK)).replace('TREATIES', json.dumps(TREATIES))); keep = await pg.evaluate(KEEP); await pg.close()
    look = {c: SHELLS[c]['look'] for c in WILDK + ['UM1']}
    mid, err = frozen({'basics': '01-rules-basics', 'units': '02-rules-units', 'core': '08-core'}, MIDFOE, {'look': look, 'treaties': TREATIES, **v})
    off = [x for k in ('foe', 'war', 'friend') for x, y in zip(v[k], (mid or {}).get(k, [])) if x != y]
    ok('t-foe', mid and not off and len(set(x[-1] for x in v['foe'])) == 2 and keep == [True, True] and not errs, [off[:6], keep, errs[:2], err[-300:]])
# Ages and research (F13a, F13b): the same orders, the same answers as Mid's frozen code. The age goes into the seat's queue (01-rules-basics AGES, 11-orders ageUp, 39-games
# ageOpen and nextAge: the hidden sixth never next); the research lines in order (04-rules-tech TECH; 08-core lineOf, prevOf, needsOf, nextStep; 11-orders researchWhy, research,
# techCost), each step's price, time (after Tally sticks, 0.95 of it) and refusal; after each step the rate wood is cut at (gatherMul), the load (carryOf), a home's room (roomOf),
# all with Mid's shares added (Albert, Nov 5 11:40: m += f.m − 1), and the lumber camp's footing (19-building-art upTier). A finished order is Mid's own completion (12-sim-core:
# p.age = j.age; learnTech adds the step and dirties the effects). On the page: the Hall names a step and an age in its queue, a villager ordered behind the age waits for it, the
# age button and the info card name the next age and its own wait, Gunpowder's next is none (Mid's nextAge), the keep at Gunpowder takes its level (Mid's bldSprite: age 4 or more) and draws
# differently, as a camp with research does; Z1's food is from Mid's first age's price
ORDERS = [['tech', 'tally'], ['hall'], ['done'], ['tech', 'baskets'], ['done'], ['age'], ['train'], ['hall'], ['done'], ['tech', 'axes'], ['tech', 'hafting'], ['tech', 'hafting'], ['done'],
          ['tech', 'sawpits'], ['tech', 'axes'], ['done'], ['tech', 'timber'], ['done'], ['tech', 'ironaxe'], ['tech', 'hafting']]
RES = """(() => { FK.reset(); const D = FK.D, s = FK.SIDES[0], st = s.store, T = BOOKS.tech, key = (k) => Object.keys(T).find((c) => T[c].key === k), H = key('hafting'), at = T[H].value.at, h = FK.seatOf(0), out = [], x = { hall: [], held: [] };
  for (const y of ECON.YIELDS) st[y] = 5000; let lab = null;
  for (let d = 6; d < 40 && !lab; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) if (!lab && ECON.canPlace(at, i, j)) lab = FK.build(at, i, j, s.col);
  const u = ECON.villagersOf(0)[0], tree = FK.things().filter((t) => t.kind === 'tree').sort((a, b) => Math.hypot(a.bx - u.bx, a.by - u.by) - Math.hypot(b.bx - u.bx, b.by - u.by))[0];
  const cut = () => { u.load = 0; u.carry = null; ECON.gatherAt(u, tree); for (let k = 0; k < 3000 && !(u.job === 'gather' && !u.path); k++) FK.sim(0.1); u.load = 0; FK.sim(0.1); const r = [u.load / 0.1, FK.stat(TREE, 0, 'rate')];
    u.load = D.carry + 0.5; FK.sim(0.1); r.push(u.job === 'gather'); u.load = 0; ECON.idle(u); return r; };
  const cells = () => { MENU.S.subject = null; MENU.S.tab = 'Hall'; MENU.S.htab = 'Town'; MENU.render(true); const r = [...[...document.querySelectorAll('#panel .row6')].find((q) => q.querySelectorAll('.q').length).querySelectorAll('.q')].map((c) => c.textContent.replace(/\\d+:\\d+/, '')); MENU.S.tab = null; return r; };
  const words = () => { MENU.S.info = true; MENU.S.tab = 'Hall'; MENU.S.htab = 'Town'; MENU.render(true); const r = [MENU.VERBS.ageUp.label(), document.getElementById('panel').textContent]; MENU.S.info = false; MENU.S.tab = null; return r; };
  x.start = words(); const base = cut(); let last = null, people = 0;
  for (const [o, k] of ORDERS) { const before = { ...st };
    if (o === 'age') { const c = ECON.ageCost(0), ok = ECON.ageUp(0); last = ['age']; out.push([o, k, ok, '', c, s.aging]); x.aged = [h.q.slice(), h.qt]; }
    else if (o === 'train') { x.train = ECON.queue(h, D.trains[h.code][0]); people = FK.units().filter((v) => v.side === 0).length; }
    else if (o === 'hall') x.hall.push(cells());
    else if (o === 'tech') { const c = key(k), why = ECON.researchWhy(0, c), ok = ECON.research(0, c); if (ok) last = ['tech', c]; const b = FK.things().find((t) => t.side === 0 && (t.q || []).includes(c));
      out.push([o, k, ok, why, Object.fromEntries(ECON.YIELDS.map((y) => [y, before[y] - st[y]]).filter(([, n]) => n)), ok && b.q.length === 1 ? b.qt : null]); }
    else { let n = 0; if (last[0] === 'age') { while (s.age < 1 && n < 9999) { FK.sim(0.1); n++; x.held.push(FK.units().filter((v) => v.side === 0).length === people); } x.held.push(h.q.length === 1 && !!FK.SH[h.q[0]]); }
      else while (ECON.researchWhy(0, last[1]) !== 'known' && n < 9999) { FK.sim(0.1); n++; }
      const [got, stat, keeps] = cut(); out.push([o, last[0], s.age, n, got / base[0], stat / base[1], keeps, FK.stat('UV', 0, 'carry'), FK.stat(HOME, 0, 'room') - D.pop[HOME], FK.levelOf(lab)[1]]); } }
  x.bronze = words(); const spr = (code, lv, up) => { const c = FK.bldSprite(code, s.col, 1, lv, up), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) n += d[i] * (i % 97); return n; };
  s.age = 4; s.aging = 0; x.gun = [MENU.VERBS.ageUp.label(), ECON.nextAge(0), FK.levelOf(h)[0], spr(h.code, 0, 0) !== spr(h.code, FK.levelOf(h)[0], 0), spr(lab.code, 0, 0) !== spr(lab.code, 0, FK.levelOf(lab)[1])];
  x.z1 = FK.Z1.food;
  return { out, x, line: ECON.lineOf(H).map((c) => T[c].key), next: T[ECON.nextStep(0, H)].key, needs: ECON.needsOf(key('ironaxe')).map((c) => (T[c] ? T[c].key : c)), queued: lab.q.length }; })()"""
MIDRES = r"""const fx = qca(cut(core, 'function fxList', '// Two words'));
return box([basics, units, blds, tech, fx, cut(core, 'const costText', 'const afford'), cut(core, 'const afford', '// Every'), cut(core, 'const sumCost', 'const fmt'), cut(core, 'const bldsOf', 'const readyAt'),
  cut(core, 'const roomOf', '\n'), cut(core, 'const qMax', 'const lineFree'), cut(core, 'const lineOf', 'const todaySeed'), cut(core, 'const carryOf', '\n'), cut(core, 'const nodeKey', 'const makeOf'),
  cut(orders, 'const scaled', 'const unitCost'), cut(orders, 'const techCost', 'function trainWhy'), cut(orders, 'function researchWhy', 'let navHold'), cut(games, 'const ageOpen', '\n'), cut(games, 'const nextAge', '\n'),
  cut(art, 'const TECHAT', '// a block'),
  `const standing = (b, o) => b.owner === o && b.prog >= 1 && b.hp > 0, keepOf = (o) => G.blds.find((b) => b.owner === o && b.kind === 'keep'), pay = (p, c) => { for (const k in c) p.res[k] -= c[k]; };
  const EVM = { gather: 1 }, WEATHER = [{}], season = () => ({ name: 'Summer', farm: 1 }), SCALE = { kinds: [] }, hz = () => false;
  const G = { fxv: 0, wx: 0, P: [{ id: 0, res: { f: 5000, w: 5000, g: 5000, s: 5000, i: 5000 }, techs: new Set(), age: 0, spent: 0 }], blds: [{ owner: 0, kind: 'keep', prog: 1, hp: 1, q: [] }, { owner: 0, kind: 'lumber', prog: 1, hp: 1, q: [] }] };
  const p = G.P[0], why = (w) => (!w ? '' : w === 'Already known.' ? 'known' : w.startsWith('Needs the ') ? 'age' : w === 'Being researched.' ? 'busy' : w.startsWith('Needs a ') ? 'at' : w === 'That line is full.' ? 'full' : w.startsWith('Not enough') ? 'cost' : 'need');
  const Y = { f: 'food', w: 'wood', g: 'gold', s: 'stone', i: 'iron' }, named = (c) => Object.fromEntries(Object.entries(c).map(([k, n]) => [Y[k], n])), base = gatherMul(0, { kind: 'tree' });
  var OUT = { out: [], first: [AGES[1].name, AGES[1].t], names: { tally: TECHBY.tally.name, age: AGES[1].name } }; let last = null;
  for (const [o, k] of RUN.orders) { const before = { ...p.res };
    if (o === 'age') { const c = nextAge(0).cost, ok = ageUp(0), j = G.blds[0].q[G.blds[0].q.length - 1]; last = j; OUT.out.push([o, k, ok, '', named(c), j.total]); }
    else if (o === 'tech') { const w = why(researchWhy(0, k)), ok = research(0, k), b = G.blds.find((x) => x.q.some((j) => j.tech === k)), j = ok ? b.q[b.q.length - 1] : null; if (ok) last = j; OUT.out.push([o, k, ok, w, named(Object.fromEntries(Object.keys(before).map((y) => [y, before[y] - p.res[y]]).filter(([, n]) => n))), ok && b.q.length === 1 ? j.total : null]); }
    else if (o === 'done') { const b = G.blds.find((x) => x.q[0] === last); b.q.shift(); if (last.age) { p.age = last.age; p.aging = false; } else p.techs.add(last.tech); G.fxv++; const m = gatherMul(0, { kind: 'tree' }) / base;
      OUT.out.push([o, last.age ? 'age' : 'tech', p.age, Math.round(last.total / 0.1), m, m, RUN.carry + 0.5 < carryOf(0), carryOf(0), roomOf(0, 'house') - BLD.house.room, upTier('lumber', p)]); } }
  p.age = 4; OUT.gun = [nextAge(0)]; OUT.z1food = AGES[1].cost.f;
  OUT.line = lineOf(TECHBY.hafting).map((t) => t.id); OUT.next = nextStep(0, TECHBY.hafting).id; OUT.needs = needsOf(TECHBY.ironaxe); OUT.queued = G.blds[1].q.length;`]);"""
async def research(b):   # same orders, same prices, times, refusals, line, rate, load, room and footing as Mid's frozen code, with its shares added; the screen and the art follow
    pg, errs = await fresh(b)
    v = await pg.evaluate(RES.replace('ORDERS', json.dumps(ORDERS)).replace('TREE', json.dumps(TREE)).replace('HOME', json.dumps(HOME))); await pg.close()
    mid, err = frozen({'basics': '01-rules-basics', 'units': '02-rules-units', 'blds': '03-rules-buildings', 'tech': '04-rules-tech', 'core': '08-core', 'orders': '11-orders', 'games': '39-games', 'art': '19-building-art'},
                      MIDRES, {'orders': [o for o in ORDERS if o[0] in ('age', 'tech', 'done')], 'carry': MEASURE['carry']}); mid = mid or {}
    steps = lambda o: [x[:3] + x[4:] if x[0] == 'done' else x for x in o]   # a wait is held to Mid's time within a tick, below
    waits = [abs(a[3] - m[3]) <= 1 for a, m in zip(v['out'], mid.get('out', [])) if a[0] == 'done']
    x, nm, first = v['x'], mid.get('names', {}), mid.get('first', ['', 0])
    got = [bool(mid) and len(v['out']) == len(mid['out']) and close(steps(v['out']), steps(mid['out'])) and all(waits) and len(waits) == 6,
           bool(mid) and all(v[k] == mid[k] for k in ('line', 'next', 'needs', 'queued')),
           [y[3] for y in v['out'] if y[0] == 'tech'] == ['', '', 'need', '', 'busy', 'age', '', '', 'need', 'known'] and close(v['out'][7][5], 18 * 0.95) and v['out'][-3][7] == MEASURE['carry'] + 3 and v['out'][-3][8] == 1,
           [[c for c in q if c] for q in x['hall']] == [[nm.get('tally')], [nm.get('age'), SHELLS['UV']['name']]] and x['train'] and x['aged'][1] == first[1] and len(x['held']) > 300 and all(x['held']),
           f"{first[0]} age" in x['start'][0] and f"{first[1]}s to rise" in x['start'][1] and 'Classical age' in x['bronze'][0],
           x['gun'][:3] == ['Last age', mid.get('gun', [0])[0], 1] and x['gun'][3] and x['gun'][4], close(x['z1'], (mid.get('z1food', 0) + MEASURE['villagers'] * MEASURE['villager']) * (1 + MEASURE['margin'])), not errs]
    ok('t-research', all(got), [got, v['out'], mid.get('out'), x, errs[:2], err[-400:]])
# Gathering and standing spots (F14): ten villagers sent to one bush of the home patch (its bushes given ten times their food, so the patch lasts the five minutes) with a mill beside it.
# Each stands on a spot of its own on its find's ring, the spots and the bodies a pace apart, never more on a find than Mid's frozen findCap. Each one's crowd share and its forager's rate R are
# Mid's frozen forage for the same load, walk, crowd and walked length d; and in five minutes each gathers Mid's frozen makeNow's food within 2%: Mid's worker fills its load
# without a break, then walks to the drop-off and back as long as the v100 villager did between those loads. The walk is v100's own (the A* paths, and the push by mass, QCJ, where Mid
# shoved by hand weights 9, 3, 1, so one at work hardly moved); a v100 worker pushed off its work mid-load loses that time, and the 2% holds that loss small
GATHER = """(() => { FK.reset(); const D = FK.D, h = FK.seatOf(0), vil = D.trains[h.code][0], dt = 0.1, upm = D.upm, SP = FK.SP / upm;
  const ring = []; for (let y = h.j - 1; y <= h.j + h.n; y++) for (let x = h.i - 1; x <= h.i + h.n; x++) if (FK.walkable(y * FK.N + x)) ring.push(y * FK.N + x);
  while (ECON.villagersOf(0).length < 10) FK.spawn(vil, 0, ring[ECON.villagersOf(0).length * 3], FK.rng);
  const vs = ECON.villagersOf(0), bushes = FK.things().filter((t) => t.kind === 'bush'), bush = bushes.slice().sort((a, b) => Math.hypot(a.bx - h.bx, a.by - h.by) - Math.hypot(b.bx - h.bx, b.by - h.by))[0];
  const mill = Object.keys(FK.SH).find((c) => (FK.SH[c].drop || []).join() === 'food'); let m = null;
  for (let d = 3; d < 20 && !m; d++) for (let a = 0; a < 16 && !m; a++) { const k = FK.tileAt(bush.bx + Math.cos(a * Math.PI / 8) * d * D.tile, bush.by + Math.sin(a * Math.PI / 8) * d * D.tile), i = k % FK.N, j = (k - i) / FK.N; if (k >= 0) m = FK.build(mill, i - 1, j - 1, FK.SIDES[0].col); }   // laid as the map lays a building (flat, free ground), not by the player's placing rule (F15: two squares from finds)
  for (const t of bushes) t.amount *= 10; const amt = new Map(bushes.map((t) => [t, t.amount]));
  for (const u of vs) ECON.gatherAt(u, bush);
  const load = vs.map(() => 0), work = vs.map(() => []), came = vs.map(() => null); let first = null, food = 0;
  for (let i = 0; i < 3000; i++) { FK.step(dt); FK.fire('tick', dt);
    vs.forEach((u, n) => { if (u.load > load[n] + 1e-9) { work[n].push(i); food += u.load - load[n]; if (!came[n]) came[n] = [Math.hypot(u.spot.x - u.bx, u.spot.y - u.by) / upm, u.spot.c === u.target]; } else if (u.load < load[n]) work[n].push(-i); load[n] = u.load; });
    if (!first && came.every(Boolean)) { const R = vs.map((u) => ECON.forage(u, u.target, m)), pair = (f) => Math.min(...vs.flatMap((u, a) => vs.slice(a + 1).map((v) => f(u, v)))) / upm;
      first = { R, spots: pair((u, v) => Math.hypot(u.spot.x - v.spot.x, u.spot.y - v.spot.y)), bodies: pair((u, v) => Math.hypot(u.bx - v.bx, u.by - v.by)),
        crowd: vs.map((u) => [u.target.wk, ECON.capOf(u.target)]), share: vs.map((u) => ECON.forage({ ...u, bx: u.target.bx, by: u.target.by }, u.target, null) / FK.stat(FK.KIND.bush.code, 0, 'rate')),
        mid: vs.map((u) => ({ u: [u.bx / upm, u.by / upm], n: [u.target.bx / upm, u.target.by / upm], amt: u.target.amount, wk: u.target.wk, d: u.target.way.d / upm })) }; } }
  const one = FK.things().find((t) => t.kind === 'tree');
  return { first, came, work, SP, arrive: D.space.arrive, cap: [ECON.capOf(bush), ECON.capOf(one)], c: FK.stat(vil, 0, 'carry'), v: FK.stat(vil, 0, 'spd'), rate: FK.stat(FK.KIND.bush.code, 0, 'rate'),
    food, taken: bushes.reduce((s, t) => s + amt.get(t) - t.amount, 0), mill: !!m, ten: vs.length }; })()"""
MIDGATHER = r"""return box([`const FOOT = ${basics.match(/FOOT = ([\d.]+)/)[1]}`, tuning.match(/const RATE_OF = \{[^}]*\};/)[0], tuning.match(/const WORK_R = \{[^}]*\};/)[0], 'const SPACE = ' + tuning.match(/SPACE = ([^,;]+)/)[1],
  `const G = { t: 0 }, UNIT = {}, carryOf = () => RUN.c, stats = () => ({ spd: RUN.v }), groundSpd = () => 1, unitKeys = () => [], gatherMul = () => 1, workMul = () => 1, makeOf = () => null, keepOf = () => null, dropFor = () => null;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), nearest = (list) => list[0]`,
  cut(core, 'const FORAGE', '// The turtle plan'), cut(civil, 'function makeNow', '// Where each one stands'), cut(civil, 'const findCap', '// the walking region'),
  `const bushOf = (c) => ({ kind: 'bush', type: 'food', amt: c.amt, wk: c.wk, x: c.n[0], y: c.n[1] });
  var OUT = { cap: [findCap({ kind: 'bush' }), findCap({ kind: 'tree' })], R: RUN.mid.map((c) => { const n = bushOf(c); return forage({ owner: 0, x: c.u[0], y: c.u[1], node: n }, n, [{ x: n.x + c.d, y: n.y }]); }),
    share: RUN.mid.map((c) => { const n = bushOf(c); return forage({ owner: 0, x: n.x, y: n.y, node: n }, n, [n]) / RATE_OF.bush; }), rate: RATE_OF.bush, food: 0 };
  for (const w of RUN.work) { const gaps = [], u = { owner: 0 }, n = { kind: 'bush', amt: 1e9 }; let last = 0, out = false, carry = 0;
    for (const i of w) if (i < 0) out = true; else { if (out) gaps.push(i - last - 1); out = false; last = i; }
    for (let i = w[0], k = 0; i < RUN.steps; i++) { const g = makeNow(u, n, RUN.dt, RUN.c - carry); carry += g; OUT.food += g; if (carry >= RUN.c - 1e-6) { carry = 0; i += gaps[Math.min(k++, gaps.length - 1)] || 0; } } }`]);"""
async def gather(b):   # ten villagers to one bush patch: their own spots a pace apart, Mid's findCap, crowd share and rate, and Mid's makeNow's food on the same five minutes of work
    pg, errs = await fresh(b)
    v = await pg.evaluate(GATHER); await pg.close(); f = v['first'] or {}
    mid, err = frozen({'basics': '01-rules-basics', 'tuning': '06-rules-tuning', 'core': '12-sim-core', 'civil': '13-sim-civil'}, MIDGATHER, {'mid': f.get('mid', []), 'work': v['work'], 'c': v['c'], 'v': v['v'], 'dt': 0.1, 'steps': 3000})
    mid = mid or {}; same = lambda a, b: len(a) == len(b) and all(abs(x - y) <= 1e-9 * max(1, abs(y)) for x, y in zip(a, b))
    got = [v['mill'] and v['ten'] == 10 and bool(f), all(c[1] and c[0] <= v['SP'] + 1e-9 for c in v['came']), f.get('spots', 0) >= v['SP'] - v['arrive'] - 1e-9 and f.get('bodies', 0) >= v['SP'] - v['arrive'] - 1e-9,
           v['cap'] == mid.get('cap') and all(c[0] <= c[1] for c in f.get('crowd', [[1, 0]])), same(f.get('R', []), mid.get('R', [0])) and same(f.get('share', []), mid.get('share', [0])) and v['rate'] == mid.get('rate'),
           v['food'] > 0 and v['taken'] >= v['food'] - 1e-6 and abs(v['food'] - mid.get('food', 0)) <= 0.02 * mid.get('food', 1), not errs]
    ok('t-gather', all(got), [got, v['came'], {k: f.get(k) for k in ('R', 'share', 'spots', 'bodies', 'crowd')}, {k: mid.get(k) for k in ('cap', 'R', 'share', 'food')}, v['food'], errs[:2], err[-400:]])
REC = """return box(sound + `;var REC = []; tone = (f, dur, type, vol, f2, at) => REC.push(['tone', f, dur, type, vol, f2 || 0, at || 0, panV]);
hiss = (dur, vol, fq, q, f2, at) => REC.push(['hiss', dur, vol, fq, q || 1, f2 || 0, at || 0]); knock = (mat, f, vol, at = 0, snap = 1) => REC.push(['knock', mat, f, vol, at, snap]);
var OUT = Object.fromEntries(Object.entries(SFX).map(([k, [gap, make]]) => { REC = []; panV = 0; make(1, 0); return [k, [gap, ...REC]]; }));`, { window: {}, navigator: {}, document: {}, performance: { now: () => 0 }, Math });"""
def match():   # same action, same result: each of Mid's sounds, made by Mid's own frozen code (its tone, hiss and knock recorded), against its recipe in the Sound book
    mid, _ = frozen({'sound': '35-sound'}, REC); hb = keyed('sound')
    full = lambda p: list(p) + {'tone': [0, 0, 0], 'hiss': [1, 0, 0], 'knock': [0, 1]}[p[0]][len(p) - {'tone': 5, 'hiss': 4, 'knock': 4}[p[0]]:]   # a recipe drops its trailing defaults
    same = lambda a, b: len(a) == len(b) and all(abs(x - y) < 1e-9 if isinstance(x, (int, float)) and isinstance(y, (int, float)) else x == y for x, y in zip(a, b))
    cut = {k for k, v in json.load(open(os.path.join(HERE, '../clean/sound.json')))['pieces']['SFX'][2].items() if v[0] == 'cut'}   # a sound Albert cut is not brought
    off = [k for k, r in (mid or {}).items() if k not in cut and (k not in hb or not (same(r[:1], hb[k][:1]) and len(r) == len(hb[k]) and all(same(full(a), full(b)) for a, b in zip(r[1:], hb[k][1:]))))]
    ok('t-match', mid and not off, off)
# Builders, repair, limits, placing and walls (F15): the same actions, the same answers as Mid's frozen code, each run in node's vm with Mid's own tables (01, 02, 03 rules) and cut
# from 06-rules-tuning (BUILDER_POW, LANE, HOME, WALL_R), 08-core (capAt, capFor, atCap, capWhy), 09-nav (snapPos, canPlace, GUIDE_R, snapGhost, wallLine, SEAL, sealPath), 11-orders
# (shellBack, repairCost), 12-sim-core (bldTick), 13-sim-civil (repairTick) and 17-ai (wallPlan). On the page: a crew of 1 to 3 raises a Barracks (each tick's crew Mid's bldTick's),
# a villager mends a Home from half (Mid's repairTick on the same building: the ticks, the stores spent, back to work), every building's limit at every age and count (and with Forest law),
# Mid's canPlace on a copy of the ground round a Home and a Barracks (the same buildings, every find a node; probes whose footprint is free and flat in v100), the snapped spot (snapGhost),
# a wall laid corner to corner, the seal shut by a ring round the Town Center and open through its one gap, the computer's wall ring; and behaviour Mid's code shows only in play: a gate
# opens to its own side, an ally and a side at peace and shuts to a side at war and to a beast; the nearest free villager is sent, and one pulled off its work goes back to its find after
WALLS = """(() => { const D = FK.D, E = ECON, N = FK.N, out = {}, [ME, FOE] = D.players, at = E.at, us = FK.SIDES[ME];
  const priced = (tick, no) => Object.keys(D.cost).filter((c) => FK.SH[c].layer === 110 && FK.SH[c].ticks.includes(tick) && !(no && FK.SH[c].ticks.includes(no)));
  const [BAR] = Object.keys(D.trains).filter((c) => !FK.SH[c].ticks.includes('Seat')), [HOME] = priced('House', 'Seat'), [WALL] = priced('Line'), [GATE] = priced('Gate'), [FIELD] = priced('Field'), MILL = priced('Drop-off', 'Seat').find((c) => FK.SH[c].drop.join() === 'food');
  const fill = () => { for (const y of E.YIELDS) us.store[y] = 9000; }, flat = (i, j, n) => { for (let y = j; y < j + n; y++) for (let x = i; x < i + n; x++) if (!FK.free(y * N + x) || FK.H[y * N + x] !== FK.H[j * N + i]) return false; return true; };
  const spot = (c, from, dmin, away = []) => { for (let d = dmin; d < 70; d++) for (let a = 0; a < 48; a++) { const i = Math.round(from.i + from.n / 2 + Math.cos(a * Math.PI / 24) * d), j = Math.round(from.j + from.n / 2 + Math.sin(a * Math.PI / 24) * d);
    if (E.canPlace(c, i, j) && away.every(([t, r]) => Math.max(Math.abs(t.i - i), Math.abs(t.j - j)) >= r)) return [i, j]; } return null; };
  const beside = (t, u, q) => { [u.bx, u.by] = FK.tileMid((t.j + q) * N + t.i - 1); u.path = null; u.spot = null; FK.place(u); };
  out.crew = [1, 2, 3].map((n) => { FK.reset(); fill(); const h = FK.seatOf(ME), [i, j] = spot(BAR, h, 12), t = E.plan(ME, BAR, i, j), vs = E.villagersOf(ME).slice(0, n), hp = [];
    vs.forEach((u, q) => { beside(t, u, q); E.buildAt(u, t); }); const job = vs.every((u) => u.job === 'build'); let steps = 0;
    while (t.done < 1 && steps < 9000) { FK.sim(0.1); steps++; if (steps % 20 === 0 && t.done < 1) hp.push(t.hp); }
    return { n, steps, hp, job, M: t.hpMax, T: FK.stat(BAR, ME, 'build'), full: t.hp === t.hpMax }; });
  { FK.reset(); fill(); const h = FK.seatOf(ME), [i, j] = spot(HOME, h, 12), t = FK.build(HOME, i, j, us.col), M = (t.hpMax = FK.stat(HOME, ME, 'hp'));
    t.hp = M / 2; const half = E.repairCost(t); t.hp = M * 0.3; const low = E.repairCost(t); t.hp = M / 2;
    const [u] = E.villagersOf(ME); beside(t, u, 0); E.buildAt(u, t); let steps = 0, ticks = 0; while (u.target === t && ticks++ < 9000) { const was = t.hp; FK.sim(0.1); if (t.hp > was) steps++; }
    out.repair = { steps, hp: t.hp, M, spent: us.ledger.out.repairs || 0, half, low, T: D.buildTime[HOME], cost: D.cost[HOME], job: u.job, was: u.was }; }
  out.refund = [0.1, 0.149, 0.15, 0.5, 1].map((done) => [done, E.refund({ code: BAR, done })]); out.cost = D.cost[BAR];
  { FK.reset(); const L = FK.things(), rows = [], counts = [0, 1, 2, 3, 4, 6, 8, 12, 13], ask = (c, a, r) => { us.age = a; for (const n of counts) { for (let q = 0; q < n; q++) L.push({ kind: 'bld', side: ME, code: c, done: 1 }); rows.push([c, a, n, r, E.capWhy(ME, c)]); L.splice(L.length - n, n); } };
    for (const c of Object.keys(D.caps)) for (let a = 0; a < 5; a++) ask(c, a, 0);
    const law = Object.keys(BOOKS.tech).find((c) => BOOKS.tech[c].value.fx.some((f) => f.s === 'limit')), fx = BOOKS.tech[law].value.fx.find((f) => f.s === 'limit'); FK.learn(ME, law);
    for (let a = 0; a < 5; a++) ask(fx.k, a, fx.a); us.age = 0; out.caps = rows; }
  { FK.reset(); us.age = 1; const h = FK.seatOf(ME), H = FK.build(HOME, ...spot(HOME, h, 16), us.col), B = FK.build(BAR, ...spot(BAR, h, 16, [[H, 20]]), us.col), probes = [], finds = new Set(), rough = new Set(), snaps = [];
    for (const X of [H, B]) for (let dj = -8; dj <= 8; dj++) for (let di = -8; di <= 8; di++) for (const c of [HOME, BAR, FIELD, MILL, WALL]) { const i = X.i + di, j = X.j + dj; if (flat(i, j, FK.B[c][1])) probes.push([c, i, j, E.placeWhy(ME, c, i, j)]); }
    for (const X of [H, B]) for (let y = X.j - 16; y <= X.j + 16; y++) for (let x = X.i - 16; x <= X.i + 16; x++) if (FK.OCC[y * N + x] === 1) finds.add(y * N + x); else if (!FK.OCC[y * N + x] && !FK.free(y * N + x)) rough.add(y * N + x);
    for (const X of [H, B]) for (let dj = -9; dj <= 9; dj += 2) for (let di = -9; di <= 9; di += 2) for (const c of [HOME, FIELD]) snaps.push([c, X.i + di, X.j + dj, ...E.snap(ME, c, X.i + di, X.j + dj, D.place.tol.zoom)]);
    out.place = { probes, snaps, finds: [...finds].map(at), rough: [...rough].map(at), blds: FK.things().filter((t) => t.kind === 'bld').map((t) => [t.code, t.i, t.j, t.n]), tol: D.place.tol.zoom }; us.age = 0; }
  out.lines = [[0, 0, 7, 3], [0, 0, 3, 7], [5, 5, 0, 0], [0, 0, -6, 2], [2, 2, 2, 9], [0, 0, 4, 4], [0, 0, -5, -8], [3, 1, 3, 1], [0, 0, 9, 1], [4, 0, 0, 11]].map(([a, b, c, d]) => [a, b, c, d, E.wallLine((100 + b) * N + 100 + a, (100 + d) * N + 100 + c).map((k) => at(k).map((v) => v - 100))]);
  { FK.reset(); const h = FK.seatOf(ME), m = 5, lo = [h.i - m, h.j - m], hi = [h.i + h.n - 1 + m, h.j + h.n - 1 + m], c = [[lo[0], lo[1]], [hi[0], lo[1]], [hi[0], hi[1]], [lo[0], hi[1]]].map(([i, j]) => j * N + i);
    const ring = [...new Set(c.flatMap((k, q) => E.wallLine(k, c[(q + 1) % 4])))], g = hi[1] * N + h.i + Math.floor(h.n / 2), shut = E.sealPath(ME, ring), open = E.sealPath(ME, ring.filter((k) => k !== g));
    out.seal = { h: [h.i, h.j, h.n], ring: ring.map(at), gap: at(g), inRing: ring.includes(g), shut: shut.length, through: open.includes(g), open: open.length }; }
  { FK.reset(); const h = FK.seatOf(ME); let c = null; for (let d = 10; d < 60 && !c; d++) for (let a = 0; a < 48 && !c; a++) { const i = Math.round(h.i + h.n / 2 + Math.cos(a * Math.PI / 24) * d), j = Math.round(h.j + h.n / 2 + Math.sin(a * Math.PI / 24) * d); if (flat(i - 3, j - 3, 7)) c = [i, j]; }
    const [ci, cj] = c; for (let y = cj - 1; y <= cj + 1; y++) for (let x = ci - 1; x <= ci + 1; x++) if (x !== ci || y !== cj) FK.build(x === ci + 1 && y === cj ? GATE : WALL, x, y, us.col);
    const k = cj * N + ci, far = (cj + 3) * N + ci, go = (code, side) => { const u = FK.spawn(code, side, k, FK.rng), r = FK.go(u, far); u.path = null; return r; }, sol = D.trains[BAR][0], beast = fromBook('sides').beasts.find((b) => FK.SH[b].ticks.includes('Walk'));
    out.gate = { mine: go(D.trains[h.code][0], ME), war: go(sol, FOE), beast: go(beast, -1) }; WAR.treaty(ME, FOE, 'ally'); out.gate.ally = go(sol, FOE); WAR.treaty(ME, FOE, 'peace'); out.gate.peace = go(sol, FOE); WAR.treaty(ME, FOE, 'war'); out.gate.again = go(sol, FOE); }
  { FK.reset(); fill(); const h = FK.seatOf(ME), vs = E.villagersOf(ME); for (let q = 1; q < vs.length; q++) E.assign(ME, 'wood', 1); const free = vs.find((v) => v.job === 'idle' || v.job === 'wait');
    const t = E.plan(ME, HOME, ...spot(HOME, h, 8)); E.autoBuilder(ME, t); out.free = { one: !!free, sent: !!free && free.target === t && !free.was.back, others: vs.filter((v) => v.target === t).length }; }
  { FK.reset(); fill(); const h = FK.seatOf(ME), vs = E.villagersOf(ME); for (let q = 0; q < vs.length; q++) E.assign(ME, 'wood', 1); for (let q = 0; q < 300; q++) FK.sim(0.1); const none = vs.every((v) => v.job !== 'idle' && v.job !== 'wait');
    const t = E.plan(ME, HOME, ...spot(HOME, h, 8)), near = vs.filter((v) => E.jobOf(v) && E.jobOf(v) !== 'build').sort((a, b) => Math.hypot(a.bx - t.bx, a.by - t.by) - Math.hypot(b.bx - t.bx, b.by - t.by))[0], old = near.target;
    E.autoBuilder(ME, t); const sent = near.target === t && near.was.back && near.was.t === old; let q = 0; while (t.done < 1 && q++ < 9000) FK.sim(0.1); FK.sim(0.1);
    out.pulled = { sent, built: t.done >= 1, back: near.target === old || E.jobOf(near) === 'wood', clear: near.was === null, none }; }
  { FK.reset(); const s = FK.SIDES[FOE], h = FK.seatOf(FOE); s.age = 1; s.store.stone = 5000; s.store.wood = 5000; const plan = AI.wallPlan(h); AI.round(FOE);
    out.ring = { h: [h.i, h.j, h.n], mid: FK.MID / D.tile, plan: plan.map(([k, c]) => [...at(k), c === GATE ? 'gate' : 'wall']), laid: FK.things().filter((t) => t.side === FOE && E.wallish(t)).map((t) => [t.i, t.j, FK.has(t, 'Gate') ? 'gate' : 'wall']), pieces: D.ai.walls.pieces }; }
  out.N = N; return out; })()"""
MIDWALLS = r"""return box([basics, units, blds, tuning.match(/const BUILDER_POW = [\d.]+;/)[0], tuning.match(/const LANE = \d+;/)[0], tuning.match(/const HOME = \{[^}]*\};/)[0], cut(tuning, 'const WALL_R', '\n'),
  `const NC = RUN.N, HERE_MID = RUN.mid * NAVC, G = { P: [{ age: 0, techs: new Set(), res: {} }], blds: [], finds: [], nodes: [], t: 0, tick: 0, wx: 'clear' }, NAV = { occ: [], lake: [], solid: new Uint8Array(NC * NC), gate: new Uint8Array(NC * NC) };
  const hyp = Math.hypot, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), sfx = () => {}, say = () => {}, news = () => {}, rng = () => 0.5, TOAST = {}, WEATHER = { clear: {} }; let FX = 0, MAXHP = 1, KEEP = null, NODES = [];
  const fxv = (o, s) => ({ m: 1, a: s === 'limit' ? FX : 0 }), maxHpB = () => MAXHP, keepOf = () => KEEP, nodesNear = (x, y, r, fn) => NODES.some(fn), guardsLeft = () => 0, postAt = () => null, lakeGap = () => 0`,
  cut(core, 'const addRes', 'const sumCost'), cut(core, 'const bldsOf', 'const ready'), 'const ready = (o, kind) => bldsOf(o, kind).filter((b) => b.prog >= 1)', cut(core, 'const capAt', 'const clsCount'),
  cut(nav, 'const toCell', '\n'), cut(nav, 'function snapPos', 'function navRebuild'), cut(nav, 'function canPlace', 'function findSpot'), cut(nav, 'function wallLine', '// Is your keep'), cut(nav, 'const SEAL', ''),
  'const halfOf = (b) => (b.n * NAVC) / 2', cut(orders, 'function shellBack', 'function refundOf'), cut(orders, 'const repairCost', 'const nodeName'), cut(simc, 'function bldTick', 'function built('), cut(civil, 'function repairTick', '// ───────────────────────── Other people'),
  cut(ai, 'function wallPlan', '// how the two armies').replace(/\bMID\b/g, 'HERE_MID'),   // the map's middle is v100's
  `function freeNear(cx, cy) { for (let r = 0; r < 9; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (!NAV.solid[(cy + dy) * NC + cx + dx]) return { cx: cx + dx, cy: cy + dy }; return null; }
  const KIND = RUN.kind, RES_OF = { f: 'food', w: 'wood', g: 'gold', s: 'stone', i: 'iron' }, OUT = {}, wood = (c) => Object.fromEntries(Object.entries(c).map(([y, n]) => [y[0], n]));
  OUT.prices = RUN.prices.map(([c, k, unit]) => Object.fromEntries(Object.entries((unit ? UNIT : BLD)[k].cost || {}).map(([y, n]) => [RES_OF[y], n])));   // read before anything below sets a cost
  OUT.crew = RUN.crew.map((c) => { BLD.barracks.t = c.T; MAXHP = c.M; const b = { kind: 'barracks', owner: 0, prog: 0, hp: c.M * 0.1, q: [] }, hp = []; let steps = 0; built = () => {};
    while (b.prog < 1 && steps < 9000) { b.crew = c.n; bldTick(b, 0.1); steps++; if (steps % 20 === 0 && b.prog < 1) hp.push(b.hp); } return { steps, hp }; });
  var built;
  { const r = RUN.repair; MAXHP = r.M; BLD.house.t = r.T; BLD.house.cost = wood(r.cost); const p = G.P[0], b = { kind: 'house', owner: 0, prog: 1, hp: r.M / 2, fire: 0 }, u = { owner: 0, rep: b, building: false, x: 0, y: 0 }; p.res = { w: 9000, f: 9000, s: 9000, g: 9000, i: 9000 };
    let spent = 0, steps = 0, back = false; spend = (pp, k, n) => { pp.res[k] -= n; spent += n; }; backToWork = () => { back = true; }; rectGap = () => 0; moveTo = () => true;
    while (!back && steps < 9000) { const was = b.hp; repairTick(u, 0.1, 0); if (b.hp > was) steps++; } b.hp = r.M / 2; const half = repairCost(0, b); b.hp = r.M * 0.3; OUT.repair = { steps, spent, hp: null, half, low: repairCost(0, b) }; b.hp = r.M / 2; }
  var spend, backToWork, rectGap, moveTo;
  OUT.refund = RUN.refund.map(([done]) => { BLD.barracks.cost = wood(RUN.cost); return shellBack({ kind: 'barracks', prog: done }); });
  OUT.caps = RUN.caps.map(([c, a, n, r]) => { const kind = KIND[c]; if (!kind) return null; G.P[0].age = a; FX = r; G.blds = Array.from({ length: n }, () => ({ owner: 0, kind, hp: 1, prog: 1 })); const w = BLD[kind].age > a ? 'A later age allows it' : capWhy(0, kind) || ''; G.blds = []; FX = 0; return w; });
  { const P = RUN.place; G.P[0].age = 1; for (const [c, i, j, n] of P.blds) { const B = { owner: 0, kind: KIND[c], n, x: (i + n / 2) * NAVC, y: (j + n / 2) * NAVC, hp: 1, prog: 1 }; G.blds.push(B); for (let y = j; y < j + n; y++) for (let x = i; x < i + n; x++) NAV.occ[y * NC + x] = B; }
    NODES = P.finds.map(([i, j]) => ({ kind: 'tree', x: (i + 0.5) * NAVC, y: (j + 0.5) * NAVC })); capWhy = () => null; for (const [i, j] of P.rough) NAV.lake[j * NC + i] = 1;   // ground v100 cannot build on (water, slope, woods' floor) as Mid's lake
    const mid = (k, i, j) => [(i + BLD[k].fp / 2) * NAVC, (j + BLD[k].fp / 2) * NAVC];
    OUT.probes = P.probes.map(([c, i, j]) => canPlace(0, KIND[c], ...mid(KIND[c], i, j)) || '');
    OUT.snaps = P.snaps.map(([c, i, j]) => { const s = snapGhost(0, KIND[c], ...mid(KIND[c], i, j), P.tol * NAVC); return [s.gx, s.gy]; }); G.blds = []; NAV.occ = []; NODES = []; }
  var capWhy;
  OUT.lines = RUN.lines.map(([a, b, c, d]) => wallLine({ gx: a, gy: b }, { gx: c, gy: d }).map((q) => [q.gx, q.gy]));
  { const [hi, hj, hn] = RUN.seal.h; for (let y = hj; y < hj + hn; y++) for (let x = hi; x < hi + hn; x++) NAV.solid[y * NC + x] = 1; KEEP = { x: (hi + hn / 2) * NAVC, y: (hj + hn / 2) * NAVC };
    const ring = RUN.seal.ring.map(([gx, gy]) => ({ gx, gy })), [gi, gj] = RUN.seal.gap, shut = sealPath(ring), open = sealPath(ring.filter((c) => c.gx !== gi || c.gy !== gj));
    OUT.seal = { shut: shut && shut.length, through: !!open && open.some((p) => Math.floor(p.x / NAVC) === gi && Math.floor(p.y / NAVC) === gj), open: open && open.length }; NAV.solid.fill(0); }
  { const [hi, hj, hn] = RUN.ring.h; OUT.ring = wallPlan({ x: (hi + hn / 2) * NAVC, y: (hj + hn / 2) * NAVC }).map((c) => [c.gx, c.gy, c.kind]); }`], { Math, console });"""
async def walls(b):   # builders, repair, limits, placing and walls: the same answers as Mid's frozen code; a gate, the builders sent and the way back to work on the page
    pg, errs = await fresh(b)
    v = await pg.evaluate(WALLS); await pg.close()
    kind = {}   # each v100 building as the Mid kind it is, from the sort (clean/numbers.json, BLD: "Mid's name → v100's name"); a second Town Center is Mid's town
    names = {e['name']: c for c, e in SHELLS.items() if e['layer'] == 110}
    for k, row in json.load(open(os.path.join(HERE, '../clean/numbers.json')))['pieces']['BLD'][2].items():
        m = re.search(r'→ ([^;]+)', row[1]); c = m and names.get(m.group(1).strip())
        if c and k != 'keep': kind[c] = k
    kind.setdefault('BTC1', 'town')
    prices = [[c, kind[c], False] for c in MEASURE['cost'] if c in kind] + [[c, SHELLS[c]['look'], True] for c in MEASURE['cost'] if SHELLS[c]['layer'] == 120]   # a unit is the Mid kind it wears (its look)
    mid, err = frozen({'basics': '01-rules-basics', 'units': '02-rules-units', 'blds': '03-rules-buildings', 'tuning': '06-rules-tuning', 'core': '08-core', 'nav': '09-nav', 'orders': '11-orders', 'simc': '12-sim-core', 'civil': '13-sim-civil', 'ai': '17-ai'},
                      MIDWALLS, {**v, 'kind': kind, 'N': v['N'], 'mid': v['ring']['mid'], 'prices': prices})
    mid = mid or {}; near = lambda a, b: abs(a - b) <= 1e-6 * max(1, abs(b))
    crew = [c['job'] and c['full'] and c['steps'] == m['steps'] and len(c['hp']) == len(m['hp']) and all(map(near, c['hp'], m['hp'])) for c, m in zip(v['crew'], mid.get('crew', []))]
    rep = v['repair']; mr = mid.get('repair', {}); wood = lambda c: {y[0]: n for y, n in c.items()}
    repair = [rep['steps'] == mr.get('steps'), near(rep['spent'], mr.get('spent', -1)), wood(rep['half']) == mr.get('half'), wood(rep['low']) == mr.get('low'), rep['hp'] >= rep['M'] - 0.5, rep['job'] != 'build' and rep['was'] is None]
    refund = [wood(x[1]) == m for x, m in zip(v['refund'], mid.get('refund', []))]
    caps = [(row, m) for row, m in zip(v['caps'], mid.get('caps', [])) if m is not None and row[4] != m]
    probes = [(p, m) for p, m in zip(v['place']['probes'], mid.get('probes', [])) if p[3] != m]
    snaps = [(s, m) for s, m in zip(v['place']['snaps'], mid.get('snaps', [])) if s[3:] != m]
    lines = [x[:4] for x, m in zip(v['lines'], mid.get('lines', [])) if x[4] != m]
    s, ms = v['seal'], mid.get('seal', {}); seal = [s['inRing'], s['shut'] == 0 == ms.get('shut'), s['through'] and ms.get('through'), s['open'] > 0 and ms.get('open', 0) > 0]
    g = v['gate']; gate = [g['mine'], not g['war'], not g['beast'], g['ally'], g['peace'], not g['again']]
    ring = v['ring']; rings = [ring['plan'] == mid.get('ring'), 0 < len(ring['laid']) <= ring['pieces'], all(x in ring['plan'] for x in ring['laid']), any(x[2] == 'gate' for x in ring['laid'])]
    price = [p[0] for p, m in zip(prices, mid.get('prices', [])) if MEASURE['cost'][p[0]] != m] + ([] if len(prices) == len(MEASURE['cost']) else ['unmapped'])
    build = [v['free']['one'], v['free']['sent'], v['free']['others'] == 1] + list(v['pulled'].values())
    got = [all(crew) and len(crew) == 3, all(repair), all(refund) and len(refund) == 5, not caps and len(mid.get('caps', [])) > 2000, not probes and len(v['place']['probes']) > 500, not snaps and len(v['place']['snaps']) > 300, not lines, all(seal), all(gate), all(rings), all(build), not price, not errs]
    ok('t-walls', all(got), [got, crew, repair, refund, caps[:4], len(caps), probes[:4], len(probes), snaps[:4], len(snaps), lines, seal, gate, rings, build, price, errs[:2], err[-600:]])
# Food, farms, seasons, hunting and fishing (F16, M14 to M16): one town played a year and a season, second by second, through v100's own nature (soil, the season's turn, upkeep) beside
# Mid's frozen natureTick, seasonTurn, upkeepTick, shareOf, hungerOf, starveTick, foodInReach and gatherMul (36-economy, 37-events, 08-core) with Mid's own numbers (01, 03, 06) and its
# own research rows read as added shares; the dice are one list both draw from. Then an order's meals against Mid's orderCost, a boar hunted to its carcass, and fish only near a dock
FOOD = """(() => { FK.reset(); const D = FK.D, E = ECON, s = FK.SIDES[0], h = FK.seatOf(0), R = RUN, T = BOOKS.tech, key = (k) => Object.keys(T).find((c) => T[c].key === k), out = { snaps: [] };
  for (const k of R.techs) FK.learn(0, key(k)); s.store.food = R.food; s.store.wood = s.store.stone = 9999; let n = 0;
  const placed = (code) => { for (let d = 8; d < 60; d++) for (let a = 0; a < 16; a++) { const i = Math.round(h.i + d * Math.cos(a * 0.3927)), j = Math.round(h.j + d * Math.sin(a * 0.3927)); if (E.canPlace(code, i, j)) { const t = E.plan(0, code, i, j); t.done = 1; t.hp = t.hpMax; return t; } } };
  const farms = R.fert.map((f) => Object.assign(placed('BCL1'), { fert: f })), pen = Object.assign(placed('BCL3'), { sheep: R.sheep, wk: 1 }), fish = FK.things().find((t) => t.kind === 'fish');
  s.store.food = R.food; fish.amount = fish.max / 2; const free = (q) => FK.walkable(q) && !FK.units().some((u) => u.k === q), near = (k) => { for (let d = 1; ; d++) for (const q of [k + d, k - d, k + d * FK.N, k - d * FK.N]) if (free(q)) return q; };
  while (E.villagersOf(0).length < 20) FK.spawn('UV', 0, near(h.k ?? FK.tileAt(h.bx, h.by)), Math.random);
  for (const c of ['UM1', 'UM1', 'UM1', 'UM1', 'UM1', 'UM3', 'UM3', 'UM3', 'UM3', 'UM3']) FK.spawn(c, 0, near(FK.tileAt(h.bx, h.by)), Math.random);
  for (const u of FK.units()) if (u.side === 0) { u.job = 'idle'; u.target = u.path = null; }
  const bushes = FK.things().filter((t) => t.kind === 'bush').slice(0, 5); E.villagersOf(0).slice(0, 5).forEach((u, i) => Object.assign(u, { job: 'gather', target: bushes[i], carry: 'food' }));
  const wolf = FK.spawn('MW4', -1, near(FK.tileAt(h.bx, h.by)), Math.random), away = [pen.bx + 2 * D.flock.wolf, pen.by], base = FK.stat('BCL1', 0, 'rate'); let got = 0;
  out.units = FK.units().filter((u) => u.side === 0).map((u) => u.code); out.base = base; const rng = FK.rng; FK.rng = () => R.draws[n++];
  for (let t = 1; t <= R.secs; t++) { FK.K.t = t; const w = R.wolfAt.includes(t); wolf.bx = w ? pen.bx : away[0]; wolf.by = w ? pen.by : away[1];
    for (const f of farms.slice(0, R.worked)) f.workT = E.time(); E.nature(1); for (const f of farms.slice(0, R.worked)) got += (E.rateOf(f, 0) * E.hungerOf(0)) / base;
    if (t % 60 === 0) out.snaps.push([t, s.store.food, !!s.hungry, farms.map((f) => f.fert), pen.sheep, fish.amount, got, bushes.map((b) => b.amount), s.ledger.out.upkeep || 0, s.ledger.out.spoiled || 0, E.harvest()]); }
  out.draws = n; FK.rng = rng; FK.reset(); const S = FK.units().filter((u) => u.side === 0).slice(0, 3).concat(FK.spawn('UM3', 0, near(FK.tileAt(h.bx, h.by)), Math.random), FK.spawn('UM1', 0, near(FK.tileAt(h.bx, h.by)), Math.random));
  const f0 = FK.SIDES[0].store.food; out.order = [S.map((u) => u.code), E.orderCost(0, S), f0 - FK.SIDES[0].store.food];
  FK.reset(); const H = FK.seatOf(0), boar = FK.units().filter((u) => FK.has(u, 'Prey') && u.code === D.boar.code).sort((a, b) => Math.hypot(a.bx - H.bx, a.by - H.by) - Math.hypot(b.bx - H.bx, b.by - H.by))[0], v = E.villagersOf(0)[0];
  E.hunt(0, boar, v); for (let i = 0; i < 1500 && !boar.gone; i++) FK.sim(0.1); const meat = FK.things().find((t) => t.kind === 'meat');
  out.hunt = [boar.gone === true, !!meat && meat.amount === D.meat[boar.code], v.target === meat, E.jobOf(v)];
  const fsh = FK.things().find((t) => t.kind === 'fish'), u = E.villagersOf(0)[0], dock = { side: 0, code: 'BCT2', done: 1, kind: 'bld', bx: fsh.bx, by: fsh.by };
  out.dock = [E.docked(0, fsh), (FK.things().push(dock), E.docked(0, fsh)), E.docked(1, fsh)]; FK.things().pop(); return out; })()"""
MIDFOOD = r"""const ev = cut(events, 'function starveTick');
return box([cut(basics, 'const SEASON_LEN', 'const EASY_SAFE'), basics.match(/const SEASONS = \[[\s\S]*?\];/)[0], blds.match(/const UPKEEP = [^;]*;/)[0], blds.match(/const SPOIL = [^;]*;/)[0],
  tuning.match(/const FERT = [^;]*;/)[0], tuning.match(/const HARVEST = \[[\s\S]*?\];/)[0], tuning.match(/const STARVE = [\s\S]*?;/)[0], tuning.match(/const ORDER = [^;]*;/)[0], core.match(/const clamp = [^\n]*/)[0], core.match(/const logistic = [^\n]*/)[0],
  core.match(/const season = [^\n]*/)[0], cut(core, 'const nodeKey', 'const makeOf'), cut(eco, 'const FLEECE', 'const stopsAll'), cut(eco, 'function natureTick', '// ── fire'), cut(eco, 'function upkeepTick', '// the Bank'), cut(eco, 'function shareOf', '// ── prices'), ev,
  `const WILD = -1, R = RUN; let n = 0, ledger = { upkeep: 0, spoiled: 0, orders: 0 }; const rng = () => R.draws[n++], fxv = (o, s, keys) => { let m = 1, a = 0, c = 1; for (const f of R.fx) if (f.s === s && (!f.k || [].concat(f.k).some((k) => (keys || []).includes(k)))) { if (f.m > 1) m += f.m - 1; else if (f.m) c *= f.m; if (f.a) a += f.a; } return { m: m * c, a }; };
  const unitKeys = (k) => [k], hasTag = (k, t) => (R.tags[k] || []).includes(t), UNIT = { vil: { cls: 'civ', tick: 'vil' }, spear: { cls: 'army', tick: 'sol' }, cata: { cls: 'army', tick: 'sol' }, wolf: { cls: null, meat: 0 } };
  const BLD = { farm: { crop: 'food' }, pasture: { crop: 'wool', sheep: 6 } }, campEat = () => 0, news = () => {}, storm = () => false, hazard = () => false, stopsAll = () => [], ROUTES = [], every = () => false, BEAT = {}, flowTick = () => {}, hz = () => false;
  const unitsOf = () => [], HEALTH = {}, TOAST = {}, coord = () => '', keepOf = () => ({}), regionAt = () => 1, reachFrom = () => true, dockNear = () => true, EVM = { gather: 1 }, WEATHER = { clear: {} }, SCALE = { kinds: [] }, isSoldier = (u) => u.kind !== 'vil', dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const spend = (p, k, x, why) => { p.res[k] -= x; ledger[why] = (ledger[why] || 0) + x; }, stash = (o, k, x) => { G.P[o].res.f += x; };
  const p = { id: 0, alive: true, res: { f: R.food } }, G = { t: 0, tick: 0, seasonN: 0, wx: 'clear', P: [p], units: [], blds: [], nodes: [] };
  const farms = R.fert.map((f, i) => ({ kind: 'farm', owner: 0, prog: 1, hp: 1, fert: f })); for (const b of farms) { b.node = { kind: 'farm', type: 'food', farm: b, amt: Infinity }; G.blds.push(b); G.nodes.push(b.node); }
  const pen = { kind: 'pasture', owner: 0, prog: 1, hp: 1, x: 0, y: 0, sheep: R.sheep, node: { kind: 'farm', type: 'wool', amt: 0, wk: 1 } }; G.blds.push(pen); const fish = { kind: 'fish', type: 'food', amt: R.fishMax / 2, max: R.fishMax }; G.nodes.push(fish);
  const bushes = R.bushes.map((a) => ({ kind: 'bush', type: 'food', amt: a })); G.nodes.push(...bushes);
  R.units.forEach((c, i) => G.units.push({ owner: 0, kind: { UV: 'vil', UM1: 'spear', UM3: 'cata' }[c], job: i < 5 ? 'food' : null, node: i < 5 ? bushes[i] : null }));
  const wolf = { owner: WILD, kind: 'wolf', hp: 1, x: 9999, y: 9999 }; G.units.push(wolf); let got = 0; var OUT = { snaps: [] };
  for (let t = 1; t <= R.secs; t++) { G.t = t; G.tick = t * 30 + 1; wolf.x = wolf.y = R.wolfAt.includes(t) ? 0 : 9999; for (const b of farms.slice(0, R.worked)) b.node.workT = t;
    natureTick(); upkeepTick(); for (const b of farms.slice(0, R.worked)) got += gatherMul(0, b.node) * hungerOf(0);
    if (t % 60 === 0) OUT.snaps.push([t, p.res.f, !!p.hungry, farms.map((b) => b.fert), pen.sheep, fish.amt, got, bushes.map((b) => b.amt), ledger.upkeep, ledger.spoiled, G.harvest || 1]); }
  OUT.draws = n; const P2 = { id: 0, res: { f: 1e6 } }; G.P = [P2]; OUT.order = orderCost(0, R.order.map((c) => ({ kind: { UV: 'vil', UM1: 'spear', UM3: 'cata' }[c] })));`]);"""
async def food(b):   # a year and a season of food, the same as Mid's frozen code; an order's meals; a boar hunted; fish only near a dock
    pg, errs = await fresh(b)
    tech = open(os.path.join(HERE, '../mid/src/04-rules-tech.js')).read(); TECHS = ['hearth', 'icehouse', 'seedstore']
    fx = [f for k in TECHS for f in json.loads(json.dumps(eval(re.sub(r'(\w+):', r'"\1":', re.search(r"id: '%s',[\s\S]*?fx: (\[[\s\S]*?\]),\n" % k, tech).group(1)).replace("'", '"'))))]
    run = {'techs': TECHS, 'food': 1300, 'draws': [0.7, 0.3, 0.1], 'fert': [1, 0.705, 0.65, 1], 'worked': 2, 'sheep': 11, 'wolfAt': [540, 720], 'secs': 900}
    v = await pg.evaluate(FOOD.replace('RUN', json.dumps(run)))
    fishMax = await pg.evaluate("FK.things().find((t) => t.kind === 'fish').max"); await pg.close()
    v0 = v['snaps'][0]
    mid, err = frozen({'basics': '01-rules-basics', 'blds': '03-rules-buildings', 'tuning': '06-rules-tuning', 'core': '08-core', 'eco': '36-economy', 'events': '37-events'}, MIDFOOD,
                      {**run, 'fx': fx, 'tags': {'cata': ['mounted']}, 'units': v['units'], 'fishMax': fishMax, 'bushes': [MEASURE['bushFood']] * 5, 'order': v['order'][0]})
    m0 = MEASURE['rate'] and 0.8   # Mid's farm rate: v100's harvest is read against its own base, Mid's against its gatherMul alone
    same = bool(mid) and len(mid['snaps']) == len(v['snaps']) and all(close(a, b) for a, b in zip(v['snaps'], mid['snaps']))
    flips = bool(mid) and any(x[2] for x in v['snaps']) and not v['snaps'][-1][2] and v['snaps'][-1][4] < run['sheep']   # it went hungry, was fed again by the cull, and the wolf took sheep
    got = [same, flips, v['draws'] == (mid or {}).get('draws'), bool(mid) and v['order'][1] == mid['order'] == v['order'][2], v['hunt'][:3] == [True, True, True] and v['hunt'][3] == 'food', v['dock'] == [False, True, False], not errs]
    off = [i for i, (a, c) in enumerate(zip(v['snaps'], (mid or {}).get('snaps', []))) if not close(a, c)][:2]
    ok('t-food', all(got), [got, off, [v['snaps'][i] for i in off], [mid['snaps'][i] for i in off] if mid and off else '', v['order'], (mid or {}).get('order'), v['hunt'], v['dock'], err[-400:], errs[:2]])
def proof():   # each planted break in a copy of the build must stop the gate, named by the rule it breaks
    plants = {'home': ('books/angles.js', '"A3":', '"D1":'), 'needs': ('books/shells.js', '"ticks": ["Yield"]', '"ticks": ["Yeld"]'),
              'names': ('menu.js', "FK.has(u, 'Gather') && own(u)", "u.code === 'UV' && own(u)"), 'swallowed': ('menu.js', 'S.htab = keepH; PANEL = h;', 'S.htab = keepH; // swallowed PANEL = h;'),
              'seals': ('CALCULATIONS.md', 'QA Sun height', 'QA Sun  height')}
    for key, (f, a, b) in plants.items():
        t = tempfile.mkdtemp(); shutil.copytree(HERE, t + '/v', ignore=shutil.ignore_patterns('*.png')); s = open(f'{t}/v/{f}').read()
        assert a in s, f'plant {key}: {a} not found'; open(f'{t}/v/{f}', 'w').write(s.replace(a, b, 1))
        r = subprocess.run([sys.executable, t + '/v/index.py'], capture_output=True, text=True); shutil.rmtree(t)
        ok('t-proof', r.returncode == 1 and (f'[{key}]' in r.stdout or (key == 'seals' and '[permit] law:QA' in r.stdout)), f'{key}: {r.stdout[-200:]}')
async def ai(b):   # the computer's army building, on a page of its own on the seed: the bell test before restarts the shared page, so this game starts clean (F16)
    pg, errs = await fresh(b)
    got = await pg.evaluate("(() => { FK.reset(); for (let i = 0; i < 6000; i++) FK.sim(0.1); const first = FK.D.ai.raise[0].code; return [FK.seed(), FK.things().some((t) => t.side === FK.D.players[1] && t.code === first)]; })()")
    ok('t-ai', got[1] and not errs, [got, errs[:2]]); await pg.close()
# The pace (F17, F17b, QCB): five kinds of v100 walker and a wolf on dry, flat, firm ground in still air, plain, with a full load and sick, with no research, Roads, Field drains,
# Snow clearing + Oiled cloaks + Forced marches, Crampons, and Roads with Field drains: each one's pace over its walk is Mid's frozen paceOf under a clear sky (its season at rest:
# the season's own speeds are out; a full load is Mid's 0.9 to a ten-thousandth, by W24), and each one's mud and snow costs are Mid's fxv under the effects law (two cuts, one on what
# the other left: Mid's own compounding); the ground ice of a winter and a summer is Mid's frozen groundTick's, fed the same air and wetness; and on the page a walker in mud steps at
# its pace and one on ice slips once, stands, and walks on wary. Where v100 now differs from Mid by design (Pandolf's mud, snow and grade, the wind, grip) is t-physics
PKINDS = [('UV', 'vil', 0), ('UM1', 'spear', 0), ('UM2', 'archer', 0), ('UM3', 'cata', 0), ('UM4', 'ram', 0), ('MW4', 'wolf', -1)]
PSTATES = [dict(load=0, sick=0), dict(load=MEASURE['carry'], sick=0), dict(load=0, sick=1)]
PSETS = [[], ['roads'], ['drainage'], ['snowclear', 'waterproof', 'marching'], ['crampons'], ['roads', 'drainage']]
PACE = """(() => { const D = FK.D, K = FK.K, TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])), out = [], cost = [];
  for (const set of SETS) { FK.reset(); for (const k of set) FK.learn(0, TK[k]); const hk = FK.tileAt(FK.seatOf(0).bx, FK.seatOf(0).by); let k0 = -1;
    for (let d = 3; k0 < 0 && d < 60; d++) for (const q of [hk + d, hk - d, hk + d * FK.N, hk - d * FK.N]) if (k0 < 0 && FK.walkable(q) && !FK.MARSH[q]) k0 = q;
    for (const [code, , side] of KINDS) { const u = FK.spawn(code, side, k0, FK.rng); cost.push(side < 0 ? null : [FK.stat(code, side, 'mud') / D.walkCost.mud / (D.pace.sink[code] ?? D.pace.sink.foot), FK.stat(code, side, 'snow') / D.walkCost.snow]);
      for (const st of STATES) { if (st.load && !FK.has(u, 'Gather')) continue; Object.assign(K, { wet: 0, snow: 0, gfd: 0, temp: 10, wind: 0 }); u.load = st.load; u.sick = st.sick;
        out.push(FK.pace(u) / FK.ref(FK.SH[code].pace)); } } }
  FK.reset(); const rec = [], share = () => Math.sqrt(K.gfd / D.groundIce.fdd); K.t = D.season * 3 + 5; K.wet = 1;
  for (let i = 0; i < 1800; i++) { if (i === 900) K.t = D.season + 10; FK.sim(0.1); rec.push([K.temp, K.wet, share()]); }
  FK.reset(); const u = ECON.villagersOf(0)[0], far = [6, -6, 6 * FK.N, -6 * FK.N].map((d) => u.k + d).find(FK.walkable); let told = 0, stuck = 0, still = 0; FK.on('event', (e) => { told += e === 'slip'; });
  Object.assign(K, { wet: 0.7, snow: 0, gfd: 0, temp: 5, wind: 0 }); u.load = 0; FK.go(u, far); FK.step(0.1); const mud = [u.mps, FK.pace(u), FK.ref(FK.SH[u.code].pace)];
  Object.assign(K, { wet: 0, gfd: D.groundIce.fdd, temp: -5 }); for (let i = 0; i < 100; i++) { K.t += 0.1; const s = u.stuck > K.t; FK.step(0.1); if (s) { stuck++; still += u.mps === 0; } if (!u.path) FK.go(u, far); }
  return { cases: out, cost, rec, mud, stuck, still, told, wary: u.wary }; })()"""
MIDPACE = r"""const fx = qca(cut(core, 'function fxList', '// Two words'));
return box([basics, units, blds, tech, tuning, fx, cut(core, 'const clamp', 'const hyp'), cut(core, 'const baseKind', '\n'), cut(core, 'const unitKeys', 'const dmgOf'), cut(nav, 'const paceOf', '// One home'), cut(sim, 'const insulate', 'function step'),
  cut(events, 'const precip', '\n'), cut(events, 'const groundNeed', '// fire against'), cut(events, 'function groundTick', '// Traffic'),
  `const standing = () => false, EVM = { spd: 1 }, shapeOf = () => ({}), season = () => ({ name: 'Summer', spd: 1 }), hz = () => false, mudAt = () => G.clim.mud, relax = (x) => x;
  const G = { t: 0, fxv: 0, wx: 'clear', clim: { mud: 0, snow: 0, ice: 0, T: 10 }, P: [{ techs: new Set() }], blds: [] }; var OUT = { cases: [], cost: [], ice: [] };
  for (const set of RUN.sets) { G.P[0] = { techs: new Set(set) }; G.fxv++;
    for (const [, kind, side] of RUN.kinds) { const o = side < 0 ? WILD : 0, keys = unitKeys(kind); OUT.cost.push(o === WILD ? null : [fxv(o, 'mud', keys).m, 1 - fxv(o, 'snow', keys).a]);
      for (const st of RUN.states) { if (st.load && kind !== 'vil') continue; const u = { owner: o, kind, x: 0, y: 0, carry: st.load, sick: st.sick }; OUT.cases.push(paceOf(u, sideSpd(o)) / UNIT[kind].spd); } } }
  const c = { W: 0, snow: 0, ice: 0, fdd: 0 }; for (const [T, W] of RUN.rec) { c.T = T; c.W = W; groundTick(c, 'clear', 0.1); OUT.ice.push(c.ice); }`]);"""
async def pace(b):   # same walkers on dry flat ground, same pace as Mid's frozen code; the same research costs (cuts one at a time); ground ice as Mid's; a walk in mud and a slip on ice on the page
    pg, errs = await fresh(b)
    v = await pg.evaluate(PACE.replace('SETS', json.dumps(PSETS)).replace('KINDS', json.dumps(PKINDS)).replace('STATES', json.dumps(PSTATES))); await pg.close()
    mid, err = frozen({'basics': '01-rules-basics', 'units': '02-rules-units', 'blds': '03-rules-buildings', 'tech': '04-rules-tech', 'tuning': '06-rules-tuning', 'core': '08-core', 'nav': '09-nav', 'sim': '12-sim-core', 'events': '37-events'},
                      MIDPACE, {'sets': PSETS, 'kinds': PKINDS, 'states': PSTATES, 'rec': [r[:2] for r in v['rec']]}); mid = mid or {}
    ice = [r[2] for r in v['rec']]; near = lambda a, c: all(abs(x - y) <= 1e-4 for x, y in zip(a, c)) and len(a) == len(c)
    snow = close([x[1] if x else 0 for x in v['cost']], [x[1] if x else 0 for x in mid.get('cost', [])])
    got = [bool(mid) and near(v['cases'], mid['cases']), bool(mid) and close([x[0] if x else 0 for x in v['cost']], [x[0] if x else 0 for x in mid['cost']]) and snow and any(x and abs(x[0] - 0.35) < 1e-9 for x in v['cost']),
           bool(mid) and close(ice, mid['ice']) and max(ice[:900]) > 0.2 and ice[-1] < max(ice), len({round(c, 6) for c in v['cases']}) > 3,
           close(v['mud'][0], v['mud'][1]) and v['mud'][1] < v['mud'][2], v['stuck'] > 0 and v['still'] == v['stuck'] and v['told'] == 1 and v['wary'] is True, not errs]
    ok('t-pace', all(got), [got, v['cases'][:8], mid.get('cases', [])[:8], v['cost'][:6], mid.get('cost', [])[:6], v['mud'], v['stuck'], v['still'], v['told'], errs[:2], err[-400:]])
# The physics (F17b, Albert Nov 5 18:07 and 18:08): the pace is Pandolf's equation solved for the speed (QCB): flat, firm, unloaded and still, a villager walks exactly 1.52 m/s; loaded, up a
# grade, in mud and snow (η) and into a wind (Pugh's drag counted as a grade), the speed v100 finds puts Pandolf's M back at the walker's power, computed here on its own from the books; the
# effects law (QCA): boosts add, cuts one at a time, never 0 nor the base, every cut in the Tech book a share between 0 and 1; the weather (QCL): the particles falling are the pool times
# the strength, the rates, wind and visibility are the law's, the blizzard flag turns exactly at the NWS's wind and visibility and after three game hours; grip (QR): a step slips
# exactly when the friction it needs exceeds what the ground offers; Crampons give studs to those on foot and the engines' haulers, never to riders, who wait for Horseshoes; the scout's
# pace and reach are Mid's
MASS = keyed('mass'); GROUND = keyed('ground')
PHYS = """(() => { const D = FK.D, K = FK.K, TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])), out = {}; FK.reset();
  const u = FK.units().find((v) => v.side === 0 && FK.has(v, 'Gather')), g0 = { ...FK.footing(u), mud: 0, snow: 0, ice: 0, rise: 0, along: 1 }; Object.assign(K, { wind: 0 }); u.load = 0; u.wary = false;
  out.flat = FK.pace(u, g0); out.cases = CASES.map(([load, rise, mud, snow, wind]) => { u.load = load; K.wind = wind; return [load, rise, mud, snow, wind, FK.pace(u, { ...g0, rise, mud, snow })]; }); u.load = 0; K.wind = 0;
  BOOKS.tech.O0 = { key: 'O0', value: { cost: {}, fx: [{ s: 'cost', k: 'UM1', p: 0.1 }, { s: 'cost', k: 'UM1', p: 0.08 }, ...CUTS.map((c) => ({ s: 'cost', k: 'UM1', c }))] }, name: 'a test step', cite: [], law: ['QCA'] }; FK.learn(0, 'O0');
  out.cuts = [FK.stat('UM1', 0, 'cost'), FK.stat('UM1', 0, 'atk')]; BOOKS.tech.O0.value.fx = [{ s: 'atk', k: 'UM1', p: 0.1 }, { s: 'atk', k: 'UM1', p: 0.08 }, ...CUTS.map((c) => ({ s: 'atk', k: 'UM1', c }))]; FK.learn(0, 'O0'); out.cuts.push(FK.stat('UM1', 0, 'atk')); delete BOOKS.tech.O0; FK.reset();
  out.sky = LEVELS.map((x) => [sky(x, 0), sky(0, x)]); out.drops = LEVELS.map((x) => { K.rain = x; K.snowing = 0; K.wind = 0; const y = DROPS.map((m) => m.y); drawSky(0.05); const r = DROPS.filter((m, i) => m.y !== y[i]).length; K.rain = 0; K.snowing = x; const y2 = DROPS.map((m) => m.y); drawSky(0.05); return [r, DROPS.filter((m, i) => m.y !== y2[i]).length]; });
  const W = D.weather.blizzard, edge = W.wind / D.weather.wind.most / (1 + D.weather.wind.gust); out.edge = [blizzard(sky(0, edge * (1 - 1e-9))), blizzard(sky(0, Math.min(1, edge * (1 + 1e-9)))), blizzard(sky(1, 0))];
  out.flags = [[1, W.wind, W.vis - 1e-6], [1, W.wind - 1e-6, W.vis - 1e-6], [1, W.wind, W.vis], [0, W.wind * 2, 1]].map(([S, gust, vis]) => blizzard({ S, gust, vis }));
  FK.reset(); const play0 = play; play = () => 0; K.t = D.season * 3 + 1; FK.sim(0.1); Object.assign(K, { wetHour: true, I: 1, dir: 1, snowing: 1, rain: 0, blizT: 0 }); const hrs = [];
  for (let i = 0; i < 40; i++) { FK.sim(0.5); hrs.push([K.blizT, K.bliz, K.temp <= 1]); } play = play0; out.hours = hrs; out.hour = D.day / 24;
  FK.reset(); const w = FK.units().find((v) => v.side === 0 && FK.has(v, 'Gather')), far = [6, -6, 6 * FK.N, -6 * FK.N].map((d) => w.k + d).find(FK.walkable), need0 = FK.G.step.person; out.slip = [];
  for (const [ice, land, dn] of [[1, 0, 1e-9], [1, 0, 0], [1, 0, -1e-9], [0.5, 0.99, 1e-9]]) { Object.assign(K, { wet: 0, snow: 0, temp: -5, gfd: ice * ice * D.groundIce.fdd, wind: 0 }); const g = FK.footing(w), on = land < ice ? g.on : g.ground;
    FK.G.step.person = on + dn; w.stuck = 0; w.wary = false; w.tread = -1; FK.go(w, far); const p0 = play; play = () => land; FK.step(0.1); play = p0; out.slip.push([on + dn > on, w.stuck > K.t]); }
  FK.G.step.person = need0; out.studs = [];
  for (const set of [['crampons'], ['horseshoes']]) { FK.reset(); for (const k of set) FK.learn(0, TK[k]); out.studs.push(['UV', 'UM1', 'UM2', 'UM4', 'UM3'].map((c) => FK.stat(c, 0, 'studs') > 0)); }
  out.scout = [FK.stat('US4', 0, 'spd'), D.stats.US4.rng, D.speed.walk]; out.tech = Object.values(BOOKS.tech).flatMap((e) => e.value.fx || []).filter((f) => f.p != null || f.c != null).map((f) => [f.p ?? null, f.c ?? null]);
  return out; })()"""
PCASES = [[0, 0, 0, 0, 0], [MEASURE['carry'], 0, 0, 0, 0], [0, 0.05, 0, 0, 0], [MEASURE['carry'] / 2, 0.08, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0.5, 0.5, 0], [0, 0, 0, 0, -12], [MEASURE['carry'], 0.03, 0.3, 0, -6]]
CUTS = [0.5, 0.3, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99]; LEVELS = [0, 0.137, 0.37, 0.5, 0.81, 1]
async def physics(b):   # Pandolf's pace, the effects law, the weather and grip, against the equations here, from the books
    pg, errs = await fresh(b)
    v = await pg.evaluate(PHYS.replace('CASES', json.dumps(PCASES)).replace('CUTS', json.dumps(CUTS)).replace('LEVELS', json.dumps(LEVELS))); await pg.close()
    P, Wb, man, wx = MEASURE['pace']['pandolf'], MASS['person'], MASS['person']['kg'], MEASURE['weather']; g, v0 = MEASURE['g'], MEASURE['speed']['walk']
    def M(V, L, G, eta, wind):   # Pandolf, Givoni & Goldman (1977), with Pugh's drag as a grade
        F = Wb['drag'] * ((v0 - wind) * abs(v0 - wind) - v0 * v0)
        return P['stand'] * man + P['load'] * (man + L) * (L / man) ** 2 + eta * (man + L) * (P['walk'] * V * V) + P['grade'] * V * max(0, eta * (man + L) * G * 100 + 100 * F / g)
    power = P['stand'] * man + P['walk'] * man * v0 * v0
    eta = lambda mud, snow: 1 + MEASURE['walkCost']['mud'] * mud + MEASURE['walkCost']['snow'] * snow
    pand = [abs(M(V, load * MASS['carried']['kg'], rise, eta(mud, snow), wind) - power) / power < 1e-9 for load, rise, mud, snow, wind, V in v['cases']]
    slower = all(c[5] < v0 for c in v['cases'][1:])
    k = 1 + 0.1 + 0.08; cost0 = MEASURE['cost']['UM1']; prod = 1
    for c in CUTS: prod *= 1 - c
    cuts = all(abs(n - round(cost0[y] * k * prod)) <= 0 for y, n in v['cuts'][0].items()) and 0 < v['cuts'][2] < MEASURE['stats']['UM1']['atk'] * k and abs(v['cuts'][2] - MEASURE['stats']['UM1']['atk'] * k * prod) < 1e-9 and v['cuts'][1] == MEASURE['stats']['UM1']['atk']
    book = all((p is None or p > 0) and (c is None or 0 < c < 1) for p, c in v['tech']) and any(c for _, c in v['tech'])
    def sky(r, s):
        R, S, w = r * wx['rain']['most'], s * wx['snow']['most'], max(r, s) * wx['wind']['most']; ext = wx['rain']['beta'] * R ** wx['rain']['pow'] + S / wx['snow']['c']
        return {'R': R, 'S': S, 'wind': w, 'gust': w * (1 + wx['wind']['gust']), 'vis': wx['km'] * wx['k'] / ext if ext else float('inf')}
    skies = all(all(a[y] == c[y] or abs(a[y] - c[y]) < 1e-9 * max(1, abs(c[y])) for y in c) for pair, x in zip(v['sky'], LEVELS) for a, c in zip(pair, [sky(x, 0), sky(0, x)]))
    drops = v['drops'] == [[round(wx['pool'] * x), round(wx['pool'] * x)] for x in LEVELS]
    edge = v['edge'] == [False, True, False] and v['flags'] == [True, False, False, False]
    H = 3 * v['hour']; t_on = [h for h in v['hours'] if h[1]]
    hours = all(h[2] for h in v['hours']) and all(h[1] == (h[0] >= wx['blizzard']['hours'] * v['hour']) for h in v['hours']) and any(h[1] for h in v['hours']) and not v['hours'][int(H / 0.5) - 2][1]
    slip = all(a == b for a, b in v['slip']) and [s[1] for s in v['slip']] == [True, False, False, True]
    studs = v['studs'] == [[True, True, True, True, False], [False, False, False, False, True]]
    scout = abs(v['scout'][0] - v0 * 27 / 24) < 1e-9 and v['scout'][1] == 12 / 10
    got = [abs(v['flat'] - v0) < 1e-12, all(pand) and slower, cuts and book, skies and drops, edge and hours, slip and studs, scout, not errs]
    ok('t-physics', all(got), [got, v['flat'], [c[5] for c in v['cases']], pand, v['cuts'], v['drops'], v['edge'], v['flags'], v['hours'][25:33], v['slip'], v['studs'], v['scout'], errs[:2]])
# The soldier kinds (F18, Albert's Unit shell, Nov 5 10:26): every kind a row of the one Unit shell, its settings Mid's UNIT and TEACH_TO (02-rules-units, 06-rules-tuning); after each
# set of research its numbers are Mid's frozen stats() (08-core) with every share added, its tiers' too (Albert, Nov 5 11:40), and its sight Mid's with sightFx's adds; the scout's rank
# its name and its pace; each army building trains exactly its class's kinds, each from its age; the army stops at ARMYMAX; and each figure at each rank and kit is Mid's sprite()'s pixels
TECH = book('tech'); KSHELL = [c for c, e in SHELLS.items() if 'class' in e]; RANKED = sorted({e['value']['rank']['k'] for e in TECH.values() if 'rank' in e['value']} - set(KSHELL))
KSETS = [[], ['shields', 'spearwall', 'drill', 'bronze', 'spearheads', 'leather', 'helmets', 'slings', 'composite', 'horses', 'bridles', 'fieldcraft'],
         ['phalanx', 'legion', 'saddles', 'stirrups', 'cavalry', 'iron', 'chain', 'scale', 'torsion', 'engineers', 'marching'],
         ['pikesquare', 'arms', 'plate', 'bodkin', 'xbowdrill', 'longbow', 'knighthood', 'horseshoes', 'counterweight', 'firearrows', 'burningshot', 'tempering'],
         ['halberd', 'tercio', 'bayonet', 'musket', 'volley', 'remounts', 'dragoons', 'casehard', 'oiling', 'corned', 'limbers', 'petards']]
KINDJS = """(() => { const D = FK.D, TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])), s0 = FK.SIDES[0], out = { sets: [], trains: [], wrong: [] }, keys = ['hp', 'atk', 'rng', 'spd', 'sight', 'armor', 'train'];
  let got = []; for (const set of SETS) { got = got.concat(set); FK.reset(); for (const k of got) FK.learn(0, TK[k]); out.sets.push(CODES.map((c) => [FK.rankOf(c, 0), FK.rankName(c, 0), FK.kitOf(0, c), ...keys.map((y) => FK.stat(c, 0, y))])); }
  const rich = () => { for (const y of ECON.YIELDS) s0.store[y] = 1e6; }, room = D.pop[FK.seatOf(0).code]; D.pop[FK.seatOf(0).code] = D.popMax; FK.reset(); rich(); s0.age = D.ages.length - 2; const h = FK.seatOf(0), blds = [];
  for (const code of Object.keys(D.trains).filter((c) => c !== h.code)) { let t = null; for (let d = 8; d < 60 && !t; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) if (!t && ECON.canPlace(code, i, j)) t = FK.build(code, i, j, s0.col); blds.push(t); }
  for (let a = 0; a < D.ages.length - 1; a++) { s0.age = a; out.trains.push(blds.map((b) => [b.code, FK.trains(b.code).filter((c) => { const ok = ECON.queue(b, c); if (ok) ECON.unqueue(b); return ok; })]));
    for (const b of blds) for (const c of CODES) if (!FK.trains(b.code).includes(c) && ECON.queue(b, c)) { out.wrong.push([b.code, c]); ECON.unqueue(b); } }
  const b = blds.find((x) => FK.trains(x.code).length), c = FK.trains(b.code)[0]; while (ECON.popOf(0, ECON.soldier) < D.armyMax - 1) FK.spawn(c, 0, FK.units().find((u) => u.side === 0).k, FK.rng);
  out.ceiling = [ECON.queue(b, c), ECON.queue(b, c), MENU.VERBS.train.whyNot(c, b), ECON.popOf(0, ECON.soldier), WAR.armyOf(0).length]; D.pop[h.code] = room; return out; })()"""
ARTJS = """((src) => { const M = new Function('clamp', 'fault', src + '\\nreturn { sprite };')((v, lo, hi) => Math.max(lo, Math.min(hi, v)), (e) => { throw e; }), col = FK.SIDES[0].col, q = Math.SQRT2 ** 2, out = [];
  for (const [look, lvs, kits] of CASES) for (let lv = 0; lv <= lvs; lv++) for (let kit = 0; kit <= kits; kit++) for (const fr of [0, 1, 3]) { const a = FK.figure(look, col, lv, fr, 2, kit), b = M.sprite(look, col, lv, fr, q, kit);
    const da = a.getContext('2d').getImageData(0, 0, a.width, a.height).data, db = b.width === a.width && b.height === a.height ? b.getContext('2d').getImageData(0, 0, b.width, b.height).data : []; let off = da.length === db.length ? 0 : -1, ink = 0;
    for (let i = 3; off >= 0 && i < da.length; i += 4) { if (da[i]) ink++; if (Math.abs(da[i - 3] - db[i - 3]) + Math.abs(da[i - 2] - db[i - 2]) + Math.abs(da[i - 1] - db[i - 1]) + Math.abs(da[i] - db[i]) > 8) off++; }
    out.push([look, lv, kit, fr, off, ink]); }
  return out; })"""
MIDKINDS = r"""const fx = qca(cut(core, 'function fxList', '// Two words'));
const st = cut(core, 'const unitKeys', 'const dmgOf').replace('tier = 0;', 'tier = 0, hpS = 0, spdS = 0;').replace('hp *= R.hp || 1;', 'hpS += (R.hp || 1) - 1;').replace('spd *= R.spd || 1;', 'spdS += (R.spd || 1) - 1;')
  .replace("hp: hp * fxv(o, 'uhp', keys).m", "hp: hp * (fxv(o, 'uhp', keys).m + hpS)").replace("spd: spd * fxv(o, 'spd', keys).m", "spd: spd * (fxv(o, 'spd', keys).m + spdS)");
return box([basics, units, blds, tech, tuning, fx, st, cut(core, 'const baseKind', '\n'), cut(core, 'const armyRoom', 'const qMax'),
  `const standing = () => false, G = { t: 0, fxv: 0, P: [{ techs: new Set(), uc: {} }], blds: [] }, hasT = (k, t) => (UNIT[k].tags || []).includes(t), AT = ['barracks', 'range', 'stable', 'siege'];
  const SOL = Object.keys(UNIT).filter((k) => UNIT[k].tick === 'sol' && UNIT[k].cost && AT.includes(UNIT[k].at) && !UNIT[k].civ && !UNIT[k].replaces);
  var OUT = { sol: SOL, unit: Object.fromEntries(SOL.map((k) => [k, UNIT[k]])), t: Object.fromEntries(Object.keys(UNIT).map((k) => [k, UNIT[k].t])), teach: TEACH_TO, max: [POPMAX, ARMYMAX, BNSIZE], full: armyFull(0), sets: [] }; let got = [];
  for (const set of RUN.sets) { got = got.concat(set); G.P[0] = { techs: new Set(got), uc: {} }; G.fxv++;
    OUT.sets.push(RUN.looks.map((k) => { const S = stats(0, k); return [S.tier, S.name, S.kit, S.hp, S.dmg, S.rng, S.spd, S.sight + fxv(0, 'sight', ['*', ...unitKeys(k)]).a, S.armor, UNIT[k].t * S.train]; })); }`]);"""
async def kinds(b):   # same kinds, same settings and same numbers after research as Mid's frozen code; trains by class and age; the ceiling; the figures pixel for pixel
    codes = KSHELL + RANKED; look = {c: SHELLS[c]['look'] for c in codes}; cls = {c: SHELLS[c].get('class') for c in codes}
    pg, errs = await fresh(b)
    v = await pg.evaluate(KINDJS.replace('SETS', json.dumps(KSETS)).replace('CODES', json.dumps(codes)))
    ranks = {}
    for e in TECH.values():
        if 'rank' in e['value']: ranks[e['value']['rank']['k']] = ranks.get(e['value']['rank']['k'], 0) + 1
    SPR = keyed('sprites'); cases = [[look[c], len(SPR[look[c]].get('rank', [])) or (1 if SPR[look[c]].get('elite') else 0), 3 if cls[c] else 0] for c in codes] + [[l, 0, 0] for l in ('vil', 'wolf', 'caravan', 'wagon')]
    art = await pg.evaluate(ARTJS.replace('CASES', json.dumps(cases)), open(os.path.join(HERE, '../mid/src/18-figures.js')).read()); await pg.close()
    mid, err = frozen({'basics': '01-rules-basics', 'units': '02-rules-units', 'blds': '03-rules-buildings', 'tech': '04-rules-tech', 'tuning': '06-rules-tuning', 'core': '08-core'}, MIDKINDS, {'sets': KSETS, 'looks': [look[c] for c in codes]}); mid = mid or {}
    U, walk, ages = mid.get('unit', {}), MEASURE['speed']['walk'], MEASURE['ages']; Y = {'f': 'food', 'w': 'wood', 'g': 'gold', 'i': 'iron', 's': 'stone'}; at = {SHELLS[c]['look']: c for c in MEASURE['trains']}
    near = lambda a, b, r=1e-6: abs(a - b) <= r * max(1, abs(a), abs(b))
    def same(c):   # a kind's settings, Mid's
        u, e, s = U.get(look[c], {}), SHELLS[c], MEASURE['stats'][c]
        return (u.get('name') == e['name'] and ages.index(e['age']) == u.get('age') and at.get(u.get('at')) in MEASURE['trains'] and MEASURE['trains'][at[u['at']]] == [e['class']]
                and look.get(e.get('teach')) == mid['teach'].get(look[c]) and MEASURE['cost'][c] == {Y[k]: n for k, n in u['cost'].items()} and MEASURE['train'][c] == u['t']
                and [s['hp'], s['atk'], s['rof']] == [u['hp'], u['dmg'], u['cd']] and near(s['rng'], u['rng'] / 10) and near(s['sight'], u['sight'] / 10) and near(MEASURE['speed'][e['pace'].split('.')[1]], walk * u['spd'] / 24, 1e-4))
    def numbers(i, j, c):   # after research: v100 [level, name, kit, hp, atk, rng, spd, sight, armor, train] against Mid's [tier, name, kit, hp, dmg, rng, spd, sight + sightFx, armor, t × train]
        a, m = v['sets'][i][j], mid['sets'][i][j]
        if not cls[c]: return a[:2] == m[:2] and near(a[6] / v['sets'][0][j][6], m[6] / mid['sets'][0][j][6])
        return (a[:3] == m[:3] and near(a[3], m[3]) and near(a[4], m[4]) and near(a[5], m[5] / 10) and near(a[6], walk * m[6] / 24, 1e-4) and near(a[7], m[7] / 10) and near(a[8], m[8]) and near(a[9], m[9]))
    trained = [[[b, sorted(look[c] for c in ks)] for b, ks in age] for age in v['trains']]
    want = [[[b, sorted(k for k in mid.get('sol', []) if at.get(U[k]['at']) == b and U[k]['age'] <= a)] for b, _ in age] for a, age in enumerate(v['trains'])]
    bad = [x for x in art if x[4] != 0 or x[5] < 20]
    got = [bool(mid) and sorted(look[c] for c in KSHELL) == sorted(mid['sol']) and all(same(c) for c in KSHELL),
           bool(mid) and all(numbers(i, j, c) for i in range(len(KSETS)) for j, c in enumerate(codes)) and len({str(r) for r in v['sets']}) == len(KSETS),
           trained == want and not v['wrong'] and any(len(ks) > 1 for age in trained for _, ks in age),
           bool(mid) and [MEASURE['popMax'], MEASURE['armyMax'], MEASURE['squad']] == mid['max'] and v['ceiling'][:2] == [True, False] and v['ceiling'][2] == mid['full'].rstrip('.') and v['ceiling'][3:] == [MEASURE['armyMax'], MEASURE['armyMax'] - 1],
           not bad and len(art) > 300, not errs, bool(mid) and all(n == mid['t'].get(SHELLS[c]['look']) for c, n in MEASURE['train'].items())]
    ok('t-kinds', all(got), [got, bad[:6], v['ceiling'], v['wrong'][:4], [x for x in zip(trained, want) if x[0] != x[1]][:1], errs[:2], err[-400:]])
PAGED = {'t-kinds': kinds, 't-pace': pace, 't-physics': physics, 't-food': food, 't-ai': ai, 't-same': same, 't-ledger': ledger, 't-effects': effects, 't-odds': odds, 't-foe': foe, 't-research': research, 't-gather': gather, 't-walls': walls}   # each on its own page
PLAIN = {'t-match': match, 't-proof': proof}   # no page; every other rule is main's
async def page():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=['--no-sandbox', '--allow-file-access-from-files'])
        if any(k not in PAGED and k not in PLAIN for k in ONLY): await main(b)
        for k, f in PAGED.items():
            if k in ONLY: await f(b)
        await b.close()
for k in ONLY:
    if k not in RULES: print(f'FAIL [{k}] no such page rule'); sys.exit(1)
if any(k not in PLAIN for k in ONLY): asyncio.run(page())
for k, f in PLAIN.items():
    if k in ONLY: f()
missing = [k for k in ONLY if k not in done]
for k in missing: print(f'FAIL [{k}] no test runs this rule')
print(f'{sum(done.values())}/{len(ONLY)} rules hold'); sys.exit(0 if all(done.values()) and not missing else 1)
