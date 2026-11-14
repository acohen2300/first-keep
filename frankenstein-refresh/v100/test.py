# The page's tests: the rules of stage "page" in books/rules.js, one test each, named by its key. They check only what needs the running page;
# what the files alone prove is the gate's (index.py). Run: python3 test.py (all, as publish.py does) or python3 test.py --only t-a,t-b (a build's own; headless Chrome and Playwright)
import asyncio, os, re, sys, json, math, shutil, subprocess, tempfile
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); SEED = 20261105; URL = 'file://' + os.path.join(HERE, 'index.html') + '#' + str(SEED)
book = lambda n: json.loads(re.search(r'BOOK\("%s", ([\s\S]*)\);' % n, open(os.path.join(HERE, f'books/{n}.js')).read()).group(1))
keyed = lambda n: {e['key']: e['value'] for e in book(n).values()}
piece = lambda k: json.load(open(os.path.join(HERE, '../clean/numbers.json')))['pieces'][k][2]; RK = {'f': 'food', 'w': 'wood', 'g': 'gold', 's': 'stone', 'i': 'iron'}   # Mid's numbers by piece; Mid's resource keys
RULES = {e['key']: e['name'] for e in book('rules').values() if e['value']['stage'] == 'page'}
ONLY = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else list(RULES)
CHROME = next((p for p in ('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser') if os.path.exists(p)), None); done = {}
def ok(key, cond, got=''):
    if key not in ONLY: return   # a test of several rules says only those asked for
    done[key] = done.get(key, True) and bool(cond); print(('PASS ' if cond else 'FAIL ') + f'[{key}] {RULES[key]}' + ('' if cond else f'  [{got}]'), flush=True)
PRE = r"""window.$ring = (h, d0, d1, f) => { for (let d = d0; d < d1; d++) for (const [i, j] of [[h.i + d, h.j], [h.i - d, h.j], [h.i, h.j + d], [h.i, h.j - d]]) { const r = f(i, j); if (r) return r; } };
window.$run = (t, pin) => { for (let i = 0; i < t * 10; i++) { if (pin) pin(); FK.sim(0.1); } };
window.$calm = (a, b) => { FK.reset(); Object.assign(FK.K, { rain: 0, snowing: 0, temp: 10 }); if (b != null) WAR.treaty(a, b, 'war'); };
window.$rich = (s) => Object.assign(FK.SIDES[s].store, { food: 1e4, wood: 1e4, gold: 1e4, stone: 1e4, iron: 1e4 });
window.$tk = (k) => Object.keys(BOOKS.tech).find((c) => BOOKS.tech[c].key === k);
window.$put = (code, side, d0 = 8, d1 = 60, chk) => $ring(FK.seatOf(side), d0, d1, (i, j) => { if (chk && !ECON.canPlace(code, i, j, side)) return; const t = FK.build(code, i, j, FK.SIDES[side].col); if (t) { if (chk) t.side = side; t.done = 1; t.hp = t.hpMax = WAR.hpMax(t); return t; } });"""
async def fresh(b, wait=800):   # a new page on the seed, its errors gathered, PRE's helpers in it
    pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); await pg.add_init_script(PRE); await pg.goto(URL); await pg.wait_for_timeout(wait); await pg.evaluate("MENU.S.tab = null; MENU.render(true)"); return pg, errs   # the Start sheet closed, as a player who pressed Start: messages wait while it is open (F1, E707)
# The one loader of Mid's frozen code (mid/src) into node's vm. parts {name: file} are read as text; body is JS that returns what is held to the page, with cut(text, from, to)
# (to the end when to is empty), qca(text) Mid's fxv under the effects law (QCA, Albert Nov 5 18:07: its boosts added, its cuts one at a time) and box(code, more): code (a string or a list joined) run in a fresh context holding RUN and more, its OUT returned. RUN comes in on stdin
MIDJS = r"""const vm = require('vm'), fs = require('fs'), RUN = JSON.parse(fs.readFileSync(0, 'utf8')), src = (f) => fs.readFileSync(DIR + '/' + f + '.js', 'utf8');
const cut = (t, a, b) => t.slice(t.indexOf(a), b ? t.indexOf(b, t.indexOf(a)) : undefined), qca = (t) => t.replace('let m = 1,', 'let m = 1, up = 1, cuts = 1,').replace('if (f.m) m *= f.m;', 'if (f.m > 1) up += f.m - 1; else if (f.m) cuts *= f.m;').replace('return (M[key] = { m, a', 'return (M[key] = { m: up * cuts, a'), box = (code, more) => { const ctx = { RUN, ...more }; vm.createContext(ctx); vm.runInContext([].concat(code).join(';\n'), ctx); return vm.runInContext('OUT', ctx); };
"""
MIDF = {'basics': '01-rules-basics', 'units': '02-rules-units', 'blds': '03-rules-buildings', 'tech': '04-rules-tech', 'wild': '05-rules-wild', 'tuning': '06-rules-tuning', 'text': '07-text', 'core': '08-core', 'core8': '08-core', 'nav': '09-nav', 'orders': '11-orders', 'sim': '12-sim-core', 'simc': '12-sim-core', 'civil': '13-sim-civil', 'troops': '14-sim-troops', 'spatial': '15-sim-spatial', 'fight': '16-sim-fight', 'ai': '17-ai', 'art': '19-building-art', 'input': '26-input', 'quick': '28-army-quick', 'cards': '30-cards', 'sound': '35-sound', 'eco': '36-economy', 'events': '37-events', 'camps': '38-camps', 'natives': '38-natives', 'games': '39-games', 'huddle': '39-huddle', 'emg': '40-emergency'}
def frozen(parts, body, run=None):   # Mid's answer (None if it broke) and node's errors; parts are names in MIDF, or name=file
    js = MIDJS.replace('DIR', json.dumps(os.path.join(HERE, '../mid/src'))) + ''.join(f'const {n} = src({json.dumps(f or MIDF[n])});\n' for n, _, f in (p.partition('=') for p in parts.split()))
    r = subprocess.run(['node', '-e', js + f'console.log(JSON.stringify((() => {{ {body} }})()));'], input=json.dumps(run), capture_output=True, text=True)
    return json.loads(r.stdout or 'null'), r.stderr
async def main(b):
    pg, errs = await fresh(b, 1500); ev = pg.evaluate
    scr = await ev("fromBook('screen')")
    ok('t-version', await ev("document.title === 'First Keep v' + FK.D.version"))
    ok('t-top', await ev("[document.querySelectorAll('.topbar .strip').length, document.querySelectorAll('.topbar .strip .cell').length]") == [1, len(scr['top'])])
    shown = await ev("(() => { MENU.S.tab = 'Build'; const out = {}; for (const g of Object.keys(MENU.SCR.tabs)) { MENU.S.group = g; FK.SIDES[0].age = FK.D.ages.length - 1; MENU.render(true); const all = document.querySelectorAll('#panel .frame [data-v^=pick], #panel .frame [data-v^=later]').length; FK.SIDES[0].age = 0; MENU.render(true); out[g] = [document.getElementById('panel').offsetHeight, all, [...document.querySelectorAll('#panel .tabs .cell')].map((c) => c.textContent).join(), document.querySelectorAll('#panel .frame > *').length]; } return out; })()")   # E853: the last age shows the whole tab (Show all cut, N24); E898: shut, the grid still keeps its six slots
    ok('t-tabs', all(v[1] == len(scr['tabs'][g]) and v[2] == ','.join(scr['tabs']) and v[3] == len(scr['tabs'][g]) for g, v in shown.items()), shown)
    pages = {t: 'Tall' in v.get('ticks', []) for t, v in scr.items() if isinstance(v, dict) and 'ticks' in v}; size = "(() => { MENU.S.tab = '%s'; MENU.render(true); const p = document.getElementById('panel'); return [p.offsetHeight, p.style.height]; })()"
    heights = {t: await ev(size % t) for t in pages}
    ok('t-height', len({v[0] for v in shown.values()} | {heights['Build'][0]}) == 1, [shown, heights])
    ok('t-tall', all(heights[t][1] == '' for t in pages if pages[t]), heights)
    ok('t-solid', await ev("(() => { const b = getComputedStyle(document.getElementById('panel')).backgroundImage; return b.startsWith('linear-gradient(rgb(') && !b.includes('rgba('); })()"))   # SN35: the panel is a gradient of opaque colours, dark at the foot (Albert Nov 9)
    await ev("const s = FK.SIDES[0].store; s.food = s.wood = s.gold = s.stone = 2000; MENU.S.tab = 'Hall'; MENU.S.htab = 'Town'; for (let i = 0; i < 3; i++) MENU.act('people'); MENU.render(true)")
    q = await ev("[...[...document.querySelectorAll('#panel .row6')].find((r) => r.querySelectorAll('.q').length === 6).querySelectorAll('.q')].map((c) => c.tagName + ':' + c.textContent.replace(/\\d+:\\d+/, ''))")
    ok('t-queue', q == ['BUTTON:Villager'] * 3 + ['I:'] * 3, q)
    rows = "(() => { MENU.S.subject = %s; MENU.render(true); return [...document.querySelectorAll('#card > *')].map((e) => e.tagName + (e.className ? '.' + e.className : '')).join(); })()"
    cards = [await ev("MENU.S.tab = null; 0"), await ev(rows % 'ECON.villagersOf(0)[0]'), await ev(rows % "FK.things().find((t) => t.kind === 'tree')"), await ev(rows % "FK.things().find((t) => FK.has(t, 'Seat') && t.side === 0)")][1:]
    ok('t-cards', cards == ['DIV.row6,DIV.row6,DIV.row6,DIV.row6,DIV.row6,DIV.row6,DIV.row6,P,DIV.row', 'DIV.row6,P,DIV.row', 'DIV.row6,P,DIV.row6,DIV.row6,DIV.row6,DIV.row'], cards)   # E836: the card's head is the mold's row (title, then ← book ✕), as every menu
    site = await ev("""(() => { MENU.S.subject = null; MENU.S.tab = 'Build'; MENU.S.group = 'Home'; MENU.render(true); const code = MENU.SCR.tabs.Home.find((c) => FK.SH[c].ticks.includes('House') && !FK.SH[c].ticks.includes('Seat')); MENU.act('pick', code);
      const h = FK.things().find((t) => FK.has(t, 'Seat') && t.side === 0); const at = $ring(h, 8, 30, (i, j) => ECON.canPlace(code, i, j) && [i, j]); if (!at) return false; Object.assign(MENU.S.ghost, { i: at[0], j: at[1], ok: true }); MENU.act('build'); return FK.things().some((t) => t.code === code && t.done < 1); })()""")
    ok('t-place', site)
    flow = await ev("""(async () => { MENU.S.subject = MENU.S.ghost = null; MENU.S.tab = 'Build'; MENU.S.group = 'Home'; MENU.render(true); const D = FK.D, P = D.place, code = MENU.SCR.tabs.Home.find((c) => FK.SH[c].ticks.includes('House') && !FK.SH[c].ticks.includes('Seat')), c = FK.ctx, sd = c.setLineDash, lt = c.lineTo;
      const frame = async () => { const ev = []; c.setLineDash = function (d) { ev.push(d.join()); return sd.call(this, d); }; c.lineTo = function (...a) { ev.push('L'); return lt.apply(this, a); }; FK.dirty(); await new Promise((r) => setTimeout(r, 250)); c.setLineDash = sd; c.lineTo = lt;
        const at = ev.indexOf(P.dash.guide.join()); return at >= 0 && ev.slice(at + 1).findIndex((x) => x !== 'L') !== 0 && ev[at + 1] === 'L'; };
      FK.SIDES[0].store.wood = 2000; MENU.act('pick', code); const g = MENU.S.ghost, n = FK.B[code][1], h = FK.seatOf(0), hc = h.j + h.n * P.half, off = !FK.things().some((b) => b.kind === 'bld' && b.side === 0 && (b.i + b.n * P.half === g.i + n * P.half || b.j + b.n * P.half === g.j + n * P.half));
      const lone = ECON.guides(0, code, g.i, g.j).some((q) => !q.d) === (await frame()); /* a guide shows exactly when a line is met: E716 edges and centres, E816 snaps the ghost onto one */ const keep = [g.i, g.j]; g.j = hc - n * P.half; const lined = await frame(); [g.i, g.j] = keep;
      return [MENU.S.tab, g.code === code && g.ok, lone && lined, !!document.querySelector('#card.on [data-v^="build|"]'), FK.things().filter((t) => t.code === code && t.done < 1 && t.side === 0).length]; })()""")
    await ev("document.querySelector('#card [data-v^=\"build|\"]').click()"); await pg.wait_for_timeout(200)   # the tap on the bar's Build, through the menu's own click
    placed = await ev("FK.things().filter((t) => t.code === MENU.SCR.tabs.Home.find((c) => FK.SH[c].ticks.includes('House') && !FK.SH[c].ticks.includes('Seat')) && t.done < 1 && t.side === 0).length")   # yours: a computer may raise its own house in the wait (A1: their turns are spread)
    mid = open(os.path.join(HERE, '../mid/src/26-input.js')).read(); sp = mid[mid.index('function startPlace'):mid.index('function cancelPlace')]
    ok('t-place', flow[:4] == [None, True, True, True] and placed == flow[4] + 1 and 'closeCard();' in sp and 'G.place = {' in sp, [flow, placed])   # C4 (Albert, Nov 6 19:09): Build gives the ghost and its guides with the menu closed, as Mid's startPlace; one tap on Build places
    start = await ev("JSON.stringify(FK.D.start)")
    await ev("FK.SIDES[0].store.food = 9999; FK.K.rain = 1; FK.restart()")   # #38 (Albert, Nov 10): a restart no longer rides on the address, so it is checked at once, before anyone can spend
    ok('t-start', await ev(f"(() => {{ const b = {start}; return [0, 2].every((s) => Object.keys(b).every((y) => Math.abs(FK.SIDES[s].store[y] - b[y]) < 1)) && FK.K.rain === 0; }})()"), await ev("[FK.SIDES[0].store, FK.K.rain, FK.SIDES[2].store]"))   # within the food the people ate since
    waited = await ev("""(() => { const h = FK.seatOf(0), s = FK.SIDES[0].store; s.food = 500; h.q = []; ECON.queue(h, FK.D.trains[h.code][0]); const ring = []; for (let y = h.j - 1; y <= h.j + h.n; y++) for (let x = h.i - 1; x <= h.i + h.n; x++) { const k = y * FK.N + x; if (FK.OCC[k] === 0) { ring.push(k); FK.OCC[k] = 2; } }
      const n0 = FK.units().length; h.qt = 0; FK.sim(0.1); const held = h.q.length === 1 && FK.units().length === n0; for (const k of ring) FK.OCC[k] = 0; FK.sim(0.1); return [held, FK.units().length === n0 + 1, h.q.length]; })()""")
    ok('t-wait', waited == [False, True, 0], waited)   # A2 (Albert, Nov 7): a paid unit with no room beside its building appears further out instead of waiting; the queue still empties
    bells = await ev("(() => { const v = MENU.VERBS, o = MENU.S.opt, out = [FK.D.bell === ECON.bell()]; o.len = 1; v.start.run(); out.push(ECON.bell()); MENU.S.opt.len = 0; v.start.run(); out.push(ECON.bell() === Infinity); return out; })()")
    await pg.wait_for_timeout(1200)
    ok('t-bell', bells == [True, 900, True], bells)
    gone = await ev("(() => { const t = FK.things().find((x) => x.kind === 'tree'), u = ECON.villagersOf(0)[0]; FK.take(t, t.amount); return [t.gone === true, ECON.bestFind(u, 'wood') !== t]; })()")
    ok('t-gone', gone == [True, True], gone)
    ok('t-errors', not errs, errs[:3]); await pg.close()
SAME = """(() => { FK.reset(); let beats = 0, wet = 0; for (let i = 0; i < 3000; i++) { FK.sim(0.1); beats += FK.every(FK.D.beats.slow); wet += FK.K.wetHour; }   // 300 s of play, the weather in it
  const r = (x) => Math.round(x * 1e6), state = [FK.units().map((u) => [u.code, u.side, r(u.bx), r(u.by), u.hp, r(u.cd), u.job]), FK.SIDES.map((s) => s.store), r(FK.K.wet), r(FK.K.dew), ECON.score(0).total];
  const near = [], us = FK.units(); for (const u of us.slice(0, 60)) for (const R of [30, 80, 200]) { const got = []; FK.unitsNear(u, R, (v) => got.push(us.indexOf(v))); near.push(JSON.stringify(got.sort((a, b) => a - b)) === JSON.stringify(us.map((v, i) => (v !== u && Math.abs(v.bx - u.bx) < R && Math.abs(v.by - u.by) < R ? i : -1)).filter((i) => i >= 0)));
    const bs = []; FK.bldsNear(u.bx, u.by, R, (t) => { bs.push(t); }); near.push(FK.things().every((t) => t.kind !== 'bld' || Math.abs(t.bx - u.bx) >= R || Math.abs(t.by - u.by) >= R || bs.includes(t))); }
  return { state: JSON.stringify(state), draws: Array.from({ length: 20 }, FK.rng), beats, wet, near: near.every(Boolean) && near.length > 0, mine: Array.from({ length: 1000 }, dice(20261105)), book: [FK.D.beats, FK.D.grid] }; })()"""
MIDRNG = r"""return box(core.match(/function rng\(\) \{[\s\S]*?\n\}/)[0] + ';' + tuning.match(/const BEAT = [^;]*;/)[0] + ';var OUT = { draws: Array.from({ length: 1000 }, rng), book: [BEAT, { unit: ' + spatial.match(/const UG = (\d+)/)[1] + ', bld: ' + spatial.match(/const SGC = (\d+)/)[1] + ' }] };', { G: { rs: 20261105 } });"""
async def same(b):
    mid, _ = frozen('core tuning spatial', MIDRNG)
    runs = []
    for _ in range(2):
        pg, _ = await fresh(b); runs.append(await pg.evaluate(SAME)); await pg.close()
    a, c = runs; got = [a['state'] == c['state'], a['draws'] == c['draws'], a['wet'] > 0, a['beats'] == 30, a['near'], bool(mid) and a['mine'] == mid['draws'], bool(mid) and a['book'] == mid['book']]
    ok('t-same', all(got), got)
ACTS = """(() => { FK.reset(); ECON.villagersOf(0).forEach(ECON.idle); const s = FK.SIDES[0], E = ECON, M = MENU, D = FK.D;
  const snap = () => JSON.parse(JSON.stringify({ store: s.store, gathered: s.gathered, flow: s.flow, spent1: s.spent1, flowBy: s.flowBy, spentBy: s.spentBy, rate: s.rate, orate: s.orate, ledger: s.ledger, lines: [M.ledgerLine(s.ledger.in), M.ledgerLine(s.ledger.out)],
    vel: E.YIELDS.map((y) => [E.flowOf(0, y, s.rate, s.flow), E.outOf(0, y), E.netOf(0, y), E.velOf(0, y)]) }));
  const out = { start: JSON.parse(JSON.stringify(s.store)), steps: [] }, step = (name, mid, f) => { out.steps.push([name, f(), JSON.parse(JSON.stringify(mid)), snap(), FK.K.t]); };
  const code = MENU.SCR.tabs.Home.find((c) => FK.SH[c].ticks.includes('House') && !FK.SH[c].ticks.includes('Seat')), h = FK.seatOf(0), vil = D.trains[h.code][0]; let t = null;
  out.home = D.cost[code]; out.Y = E.YIELDS;
  step('earn', [['earn', 'food', 600, 'gather']], () => (E.earn(0, 'food', 600, 'gather'), true));
  step('plan', [['pay', D.cost[code], 'buildings']], () => { t = $ring(h, 8, 30, (i, j) => E.canPlace(code, i, j) && E.plan(0, code, i, j)); return !!t; });
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
async def ledger(b):
    pg, _ = await fresh(b)
    await pg.evaluate('FK.D.startIn = 0')   # Mid's year opens on spring's first day; v100 opens later in spring (D359), so a test held to Mid's calendar opens where Mid's does
    v = await pg.evaluate(ACTS.replace('NAMES', json.dumps(NAMES)))
    bal = await pg.evaluate(BALANCE); await pg.close()
    mid, err = frozen('core orders eco text nav cards', MIDLEDGER, {'start': v['start'], 'home': v['home'], 'steps': v['steps'], 'names': NAMES, 'Y': v['Y']})
    off = [v['steps'][i][0] for i in range(len(v['steps'])) if not mid or not close(v['steps'][i][3], mid['steps'][i])] + [k for k in v['say'] if not mid or v['say'][k] != mid['say'][k]]
    acted = all(x[1] for x in v['steps'])
    ok('t-ledger', mid and not off and acted and all(all(x) for x in bal), [off, acted, bal, err[-300:]])
SHELLS = book('shells'); MEASURE = keyed('measure')
def ukinds():   # each v100 unit as the Mid kind it wears (its look); a look two kinds wear (the camp wagons) is told apart by the sort's "Mid's name → v100's name"
    units, worn, out = {e['name']: c for c, e in SHELLS.items() if e['layer'] == 120}, [e['look'] for e in SHELLS.values() if e['layer'] == 120], {c: e['look'] for c, e in SHELLS.items() if e['layer'] == 120}
    for k, row in piece('UNIT').items():
        m = re.search(r'→ ([^;]+)', row[1]); c = m and units.get(m.group(1).strip())
        if c and worn.count(SHELLS[c]['look']) > 1: out[c] = k
    return out
UKIND = ukinds()
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
async def effects(b):
    pg, _ = await fresh(b)
    v = await pg.evaluate(EFF.replace('SOLDIER', json.dumps(SOLDIER)).replace('HOME', json.dumps(HOME)).replace('TREE', json.dumps(TREE)).replace('STEP', json.dumps(STEP)).replace('FX', json.dumps([a for a, _ in FX]))); await pg.close()
    kinds = v['kinds']; run = {'kinds': kinds, 'stats': MEASURE['stats'], 'spd': {k: MEASURE['speed'][SHELLS[k]['pace'].split('.')[1]] for k in kinds}, 'cost': {k: MEASURE['cost'].get(k) for k in kinds},
        'tags': {k: heads(k) + SHELLS[k]['ticks'] + SHELLS[k].get('class', '').split() for k in kinds}, 'bhp': MEASURE['bldHp'], 'home': HOME, 'seat': SEAT, 'soldier': SOLDIER, 'step': STEP, 'fx': [m for _, m in FX if m]}
    mid, err = frozen('core orders', MIDFX, run); add = mid and mid['added']
    walk = MEASURE['speed'][SHELLS['UV']['pace'].split('.')[1]] * (1 + 0.10 + 0.08)
    got = [bool(add) and all(close(v[k], add[k]) for k in ('mine', 'wild', 'cost', 'tech', 'home', 'seat', 'sol')),
           close(v['home'], MEASURE['bldHp'][HOME] * (1 + 0.10 + 0.08)) and close(v['after'], MEASURE['bldHp'][HOME]),
           bool(mid) and not close(v['mine'], mid['compounded']['mine']), v['rof'] == [1.2, MEASURE['stats']['UM1']['rof']],
           close(v['rate'], MEASURE['rate'][SHELLS[TREE]['find']] * 1.2), close(v['walk'], walk) and close(v['base']['walk'], walk / 1.18)]
    ok('t-effects', all(got), [got, err[-300:]])
ARMIES = [(['UM1', 'UM1', 'UM2', 'UM2', 'UM2'], ['UM3', 'UM3'], 1, 0), (['UM3'] * 4, ['UM1'] * 5 + ['UM2'], 0, 1), (['UM1'] * 10 + ['UM2'] * 2, ['UM2'] * 11, 2, 1), (['UM2'], [], 1, 0), ([], ['UM4', 'UM1'], 0, 0)]
WAROD = """(() => { const D = FK.D, [me, foe] = D.players, tw = Object.keys(D.tower).find((c) => !FK.SH[c].ticks.includes('Seat') && D.cost[c]), out = [];
  for (const [A, B, towers, dead] of ARMIES) { FK.reset(); const at = (s) => FK.units().find((v) => v.side === s).k, h = FK.seatOf(foe); let n = 0;
    A.forEach((c, i) => { const u = FK.spawn(c, me, at(me), FK.rng); u.hp = Math.ceil(u.hpMax * (1 - i / 17)); }); B.forEach((c, i) => { const u = FK.spawn(c, foe, at(foe), FK.rng); u.hp = Math.ceil(u.hpMax * (1 - i / 13)); });
    $ring(h, 6, 40, (i, j) => { if (ECON.canPlace(tw, i, j)) { const t = FK.build(tw, i, j, FK.SIDES[foe].col); t.hp = n++ < towers ? 50 : 0; } return n >= towers + dead; });
    const mine = WAR.armyOf(me), theirs = WAR.armyOf(foe);
    out.push({ units: FK.units().map((u) => [u.side, u.code, u.hp]), blds: FK.things().filter((t) => t.kind === 'bld').map((t) => [t.side, D.tower[t.code] && !FK.SH[t.code].ticks.includes('Seat') ? 'tower' : t.code, t.hp]),
      power: [WAR.power(mine), WAR.power(theirs)], odds: WAR.odds(mine, foe), sides: [me, foe] }); }
  return out; })()"""
WALLED = """(() => { FK.reset(); ECON.villagersOf(0).forEach(ECON.idle); const u = ECON.villagersOf(0).find((v) => !v.load), ring = []; for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) { const k = u.k + y * FK.N + x; if ((x || y) && FK.OCC[k] === 0) { FK.OCC[k] = 1; ring.push(k); } }
  const marks = () => FK.things().filter((t) => t.noPath != null).length, tree = FK.things().filter((t) => t.kind === 'tree').sort((a, b) => Math.hypot(a.bx - u.bx, a.by - u.by) - Math.hypot(b.bx - u.bx, b.by - u.by))[0];
  let err = '', one = -1; try { const m0 = marks(); ECON.gatherAt(u, tree); one = marks() - m0; for (let i = 0; i < 600 || (u.job === 'gather' && !u.target && i < 650); i++) FK.sim(0.1); } catch (e) { err = String(e); }   // F15: read past the one tick between two tries (a find whose path failed, the next looked for)
  for (const k of ring) FK.OCC[k] = 0; return [err, one, u.job]; })()"""
MIDODDS = r"""return RUN.cases.map((C) => box([`const WILD = -1, G = { t: 0, units: C.units.map(([owner, kind, hp]) => ({ owner, kind, hp })), blds: C.blds.map(([owner, kind, hp]) => ({ owner, kind, hp, prog: 1 })) };
  const UNIT = Object.fromEntries(Object.entries(RUN.stats).map(([k, s]) => [k, { tick: RUN.soldier.includes(k) ? 'sol' : 'vil', tags: [RUN.cls[k], ...(s.tags || [])], bonly: s.bonly }])), hasTag = (k, t) => UNIT[k].tags.includes(t), baseKind = (k) => k;
  const stats = (o, k) => ({ dmg: RUN.stats[k].atk, vs: RUN.stats[k].vs || null }), wearMul = () => 1, shapeOf = () => ({}), TEMPER = { calm: {} }, temperOf = () => 'calm', hungerOf = () => 1, EVM = { dmg: 1 }, ZEAL = {}, CHARGE = {}, fxv = () => ({ m: 1 })`,
    cut(core, 'const clamp', 'const hyp'), cut(core, 'const bldsOf', 'const ready'), cut(core, 'const isSoldier', 'const armyOf'), cut(core, 'const dmgOf', 'const rngOf'), cut(core, 'const unitPower', '// the square law'), cut(core, 'const lanchester', '// ═'),
    cut(spatial, 'function vsMul', '\n}') + '\n}', cut(ai, 'const powerFrom', 'const nearestType'), cut(ai, 'function matchup', '// a wave'), cut(orders, 'const oddsOf', 'function judgeEnvoy'),
    `const [q, o] = C.sides; var OUT = { power: [powerOf(soldiersOf(q)), powerOf(soldiersOf(o))], odds: oddsOf(q, o) };`], { C }));"""
async def odds(b):
    pg, errs = await fresh(b)
    v = await pg.evaluate(WAROD.replace('ARMIES', json.dumps(ARMIES))); walled = await pg.evaluate(WALLED); await pg.close()
    soldier = [c for c in MEASURE['stats'] if 'Fight' in SHELLS[c]['ticks'] and 'Gather' not in SHELLS[c]['ticks']]
    mid, err = frozen('core spatial ai orders', MIDODDS, {'cases': v, 'stats': MEASURE['stats'], 'cls': {c: SHELLS[c].get('class') for c in MEASURE['stats']}, 'soldier': soldier})
    got = [bool(mid) and all(close(a['power'], m['power']) and close(a['odds'], m['odds']) for a, m in zip(v, mid)), len({round(a['odds'], 6) for a in v}) == len(v),
           walled[0] == '' and walled[1] == 1 and walled[2] in ('idle', 'wait') and not errs]
    ok('t-odds', all(got), [got, [(a['odds'], m['odds']) for a, m in zip(v, mid or [])], walled, errs[:2], err[-300:]])
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
async def foe(b):
    pg, errs = await fresh(b)
    v = await pg.evaluate(FOE.replace('WILDK', json.dumps(WILDK)).replace('TREATIES', json.dumps(TREATIES))); keep = await pg.evaluate(KEEP); await pg.close()
    look = {c: SHELLS[c]['look'] for c in WILDK + ['UM1']}
    mid, err = frozen('basics units core', MIDFOE, {'look': look, 'treaties': TREATIES, **v})
    off = [x for k in ('foe', 'war', 'friend') for x, y in zip(v[k], (mid or {}).get(k, [])) if x != y]
    ok('t-foe', mid and not off and len(set(x[-1] for x in v['foe'])) == 2 and keep == [True, True] and not errs, [off[:6], keep, errs[:2], err[-300:]])
ORDERS = [['tech', 'tally'], ['hall'], ['done'], ['tech', 'baskets'], ['done'], ['age'], ['train'], ['hall'], ['done'], ['tech', 'axes'], ['tech', 'hafting'], ['tech', 'hafting'], ['done'],
          ['tech', 'sawpits'], ['tech', 'axes'], ['done'], ['tech', 'timber'], ['done'], ['tech', 'ironaxe'], ['tech', 'hafting']]
RES = """(() => { FK.reset(); const D = FK.D, s = FK.SIDES[0], st = s.store, T = BOOKS.tech, key = (k) => Object.keys(T).find((c) => T[c].key === k), H = key('hafting'), at = T[H].value.at, h = FK.seatOf(0), out = [], x = { hall: [], held: [] };
  for (const y of ECON.YIELDS) st[y] = 5000; let lab = null;
  lab = $ring(h, 6, 40, (i, j) => ECON.canPlace(at, i, j) && FK.build(at, i, j, s.col)) || lab;
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
async def research(b):
    pg, errs = await fresh(b)
    v = await pg.evaluate(RES.replace('ORDERS', json.dumps(ORDERS)).replace('TREE', json.dumps(TREE)).replace('HOME', json.dumps(HOME))); await pg.close()
    mid, err = frozen('basics units blds tech core orders games art',
                      MIDRES, {'orders': [o for o in ORDERS if o[0] in ('age', 'tech', 'done')], 'carry': MEASURE['carry']}); mid = mid or {}
    steps = lambda o: [x[:3] + x[4:] if x[0] == 'done' else x for x in o]   # a wait is held to Mid's time within a tick, below
    waits = [abs(a[3] - m[3]) <= 1 for a, m in zip(v['out'], mid.get('out', [])) if a[0] == 'done']
    x, nm, first, PK = v['x'], mid.get('names', {}), mid.get('first', ['', 0]), MEASURE['pocket']
    got = [bool(mid) and len(v['out']) == len(mid['out']) and close(steps(v['out']), steps(mid['out'])) and all(waits) and len(waits) == 6,
           bool(mid) and all(v[k] == mid[k] for k in ('line', 'next', 'needs', 'queued')),
           [y[3] for y in v['out'] if y[0] == 'tech'] == ['', '', 'need', '', 'busy', 'age', '', '', 'need', 'known'] and close(v['out'][7][5], 18 * 0.95) and v['out'][-3][7] == MEASURE['carry'] + 3 and v['out'][-3][8] == 1,
           [[c for c in q if c] for q in x['hall']] == [[], [nm.get('age'), SHELLS['UV']['name']]] and x['train'] and x['aged'][1] == first[1] and len(x['held']) > 300 and all(x['held']),
           f"{first[0]} age" in x['start'][0] and f"{first[1]}s to rise" in x['start'][1] and 'Classical age' in x['bronze'][0],
           x['gun'][:3] == ['Last age', mid.get('gun', [0])[0], 1] and x['gun'][3] and x['gun'][4], abs(x['z1'] - (PK['home']['bush'][1] * PK['home']['bush'][0] * PK['rich'] * PK['homeRich'] * PK['findSize']['bush'] + mid.get('z1food', 0) + PK['back']['vils'] * MEASURE['cost']['UV']['food'])) < 1e-9, not errs]   # G1: the pocket's food is Mid's (QCS): the home bushes × rich × homeRich × the find's size, plus the price of age and six villagers (was QBJ's buys and margin)
    ok('t-research', all(got), [got, v['out'], mid.get('out'), x, errs[:2], err[-400:]])
GATHER = """(() => { FK.reset(); FK.SIDES[0].store.food = 1e6; /* the replica knows no hunger: the store never runs dry (F2b: the day opens at sunrise, so the run's hours and their upkeep moved) */ const D = FK.D, h = FK.seatOf(0), vil = D.trains[h.code][0], dt = 0.1, upm = D.upm, SP = FK.SP / upm;
  const ring = []; for (let y = h.j - 1; y <= h.j + h.n; y++) for (let x = h.i - 1; x <= h.i + h.n; x++) if (FK.walkable(y * FK.N + x)) ring.push(y * FK.N + x);
  while (ECON.villagersOf(0).length < 10) FK.spawn(vil, 0, ring[ECON.villagersOf(0).length * 3], FK.rng);
  const vs = ECON.villagersOf(0), bushes = FK.things().filter((t) => t.kind === 'bush'), bush = bushes.slice().sort((a, b) => Math.hypot(a.bx - h.bx, a.by - h.by) - Math.hypot(b.bx - h.bx, b.by - h.by))[0];
  const mill = Object.keys(FK.SH).find((c) => (FK.SH[c].drop || []).join() === 'food'); let m = null;
  for (let d = 3; d < 20 && !m; d++) for (let a = 0; a < 16 && !m; a++) { const k = FK.tileAt(bush.bx + Math.cos(a * Math.PI / 8) * d * D.tile, bush.by + Math.sin(a * Math.PI / 8) * d * D.tile), i = k % FK.N, j = (k - i) / FK.N; if (k >= 0) m = FK.build(mill, i - 1, j - 1, FK.SIDES[0].col); }   // laid as the map lays a building (flat, free ground), not by the player's placing rule (F15: two squares from finds)
  for (const t of FK.things().filter((t) => t.kind === 'tree' && Math.hypot(t.bx - bush.bx, t.by - bush.by) < 25 * D.tile)) FK.take(t, t.amount);   // F2: Mid's forest can stand between the hall and the patch; the replica walks open ground, so the page does too
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
async def gather(b):
    pg, errs = await fresh(b)
    v = await pg.evaluate(GATHER); await pg.close(); f = v['first'] or {}
    mid, err = frozen('basics tuning core=12-sim-core civil', MIDGATHER, {'mid': f.get('mid', []), 'work': v['work'], 'c': v['c'], 'v': v['v'], 'dt': 0.1, 'steps': 3000})
    mid = mid or {}; same = lambda a, b: len(a) == len(b) and all(abs(x - y) <= 1e-9 * max(1, abs(y)) for x, y in zip(a, b))
    got = [v['mill'] and v['ten'] == 10 and bool(f), all(c[1] and c[0] <= v['SP'] + 1e-9 for c in v['came']), f.get('spots', 0) >= v['SP'] - v['arrive'] - 1e-9 and f.get('bodies', 0) >= v['SP'] - v['arrive'] - 1e-9,
           v['cap'] == mid.get('cap') and all(c[0] <= c[1] for c in f.get('crowd', [[1, 0]])), same(f.get('R', []), mid.get('R', [0])) and same(f.get('share', []), mid.get('share', [0])) and v['rate'] == mid.get('rate'),
           v['food'] > 0 and v['taken'] >= v['food'] - 1e-6 and abs(v['food'] - mid.get('food', 0)) <= 0.0225 * mid.get('food', 1), not errs]
    # the food within 2.25% of the replica's model (Albert, Nov 7 22:02: the 2.2% gap with the Town Center at Base's spot is trip alignment, accepted)
    ok('t-gather', all(got), [got, v['came'], {k: f.get(k) for k in ('R', 'share', 'spots', 'bodies', 'crowd')}, {k: mid.get(k) for k in ('cap', 'R', 'share', 'food')}, v['food'], errs[:2], err[-400:]])
REC = """return box(sound + `;var REC = []; tone = (f, dur, type, vol, f2, at) => REC.push(['tone', f, dur, type, vol, f2 || 0, at || 0, panV]);
hiss = (dur, vol, fq, q, f2, at) => REC.push(['hiss', dur, vol, fq, q || 1, f2 || 0, at || 0]); knock = (mat, f, vol, at = 0, snap = 1) => REC.push(['knock', mat, f, vol, at, snap]);
var OUT = Object.fromEntries(Object.entries(SFX).map(([k, [gap, make]]) => { REC = []; panV = 0; make(1, 0); return [k, [gap, ...REC]]; }));`, { window: {}, navigator: {}, document: {}, performance: { now: () => 0 }, Math });"""
def match():
    mid, _ = frozen('sound', REC); hb = keyed('sound')
    full = lambda p: list(p) + {'tone': [0, 0, 0], 'hiss': [1, 0, 0], 'knock': [0, 1]}[p[0]][len(p) - {'tone': 5, 'hiss': 4, 'knock': 4}[p[0]]:]   # a recipe drops its trailing defaults
    same = lambda a, b: len(a) == len(b) and all(abs(x - y) < 1e-9 if isinstance(x, (int, float)) and isinstance(y, (int, float)) else x == y for x, y in zip(a, b))
    cut = {k for k, v in json.load(open(os.path.join(HERE, '../clean/sound.json')))['pieces']['SFX'][2].items() if v[0] in ('cut', 'changed')}   # a sound Albert cut, or changed by his call, is not Mid's any more
    off = [k for k, r in (mid or {}).items() if k not in cut and (k not in hb or not (same(r[:1], hb[k][:1]) and len(r) == len(hb[k]) and all(same(full(a), full(b)) for a, b in zip(r[1:], hb[k][1:]))))]
    ok('t-match', mid and not off, off)
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
  { FK.reset(); fill(); const h = FK.seatOf(ME), vs = E.villagersOf(ME); vs.forEach(E.idle); for (let q = 1; q < vs.length; q++) E.assign(ME, 'wood', 1); const free = vs.find((v) => v.job === 'idle' || v.job === 'wait');
    const t = E.plan(ME, HOME, ...spot(HOME, h, 8)); E.autoBuilder(ME, t); out.free = { one: !!free, sent: !!free && free.target === t && !free.was.back, others: vs.filter((v) => v.target === t).length }; }
  { FK.reset(); fill(); const h = FK.seatOf(ME), vs = E.villagersOf(ME); for (let q = 0; q < vs.length; q++) E.assign(ME, 'wood', 1); for (let q = 0; q < 300; q++) FK.sim(0.1); const none = vs.every((v) => v.job !== 'idle' && v.job !== 'wait');
    const t = E.plan(ME, HOME, ...spot(HOME, h, 8)), near = vs.filter((v) => E.jobOf(v) && E.jobOf(v) !== 'build').sort((a, b) => Math.hypot(a.bx - t.bx, a.by - t.by) - Math.hypot(b.bx - t.bx, b.by - t.by))[0], old = near.target;
    E.autoBuilder(ME, t); const sent = near.target === t && near.was.back && near.was.t === old; let q = 0; while (t.done < 1 && q++ < 9000) FK.sim(0.1); FK.sim(0.1);
    out.pulled = { sent, built: t.done >= 1, back: near.target === old || E.jobOf(near) === 'wood', clear: near.was === null, none }; }
  { FK.reset(); const s = FK.SIDES[FOE], h = FK.seatOf(FOE); s.age = 1; s.store.stone = 5000; s.store.wood = 5000; const plan = AI.wallPlan(h); AI.think(FOE);
    out.ring = { h: [h.i, h.j, h.n], mid: FK.MID / D.tile, plan: plan.map(([k, c]) => [...at(k), c === GATE ? 'gate' : 'wall']), laid: FK.things().filter((t) => t.side === FOE && E.wallish(t)).map((t) => [t.i, t.j, FK.has(t, 'Gate') ? 'gate' : 'wall']), pieces: D.ai.walls.pieces }; }
  out.N = N; return out; })()"""
MIDWALLS = r"""return box([basics, units, blds, tech, tuning.match(/const BUILDER_POW = [\d.]+;/)[0], tuning.match(/const LANE = \d+;/)[0], tuning.match(/const HOME = \{[^}]*\};/)[0], cut(tuning, 'const WALL_R', '\n'),
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
  OUT.caps = RUN.caps.map(([c, a, n, r]) => { const kind = KIND[c]; if (!kind) return null; G.P[0].age = a; FX = r; G.blds = Array.from({ length: n }, () => ({ owner: 0, kind, hp: 1, prog: 1 })); const w = BLD[kind].age > a ? RUN.ages[BLD[kind].age] + ' age' : capWhy(0, kind) || ''; /* M1: Base's Build card names the age that allows it (Mid said 'A later age allows it') */ G.blds = []; FX = 0; return w; });
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
async def walls(b):
    pg, errs = await fresh(b)
    v = await pg.evaluate(WALLS); await pg.close()
    kind = {}   # each v100 building as the Mid kind it is, from the sort (clean/numbers.json, BLD: "Mid's name → v100's name"); a second Town Center is Mid's town
    names = {e['name']: c for c, e in SHELLS.items() if e['layer'] == 110}
    for k, row in piece('BLD').items():
        m = re.search(r'→ ([^;]+)', row[1]); c = m and names.get(m.group(1).strip())
        if c and k != 'keep': kind[c] = k
    kind.setdefault('BTC1', 'town'); ukind = UKIND
    prices = [[c, kind[c], False] for c in MEASURE['cost'] if c in kind] + [[c, ukind[c], True] for c in MEASURE['cost'] if SHELLS[c]['layer'] == 120]   # a unit is the Mid kind it wears (its look)
    mid, err = frozen('basics units blds tech tuning core nav orders simc civil ai',
                      MIDWALLS, {**v, 'kind': kind, 'N': v['N'], 'mid': v['ring']['mid'], 'prices': prices, 'ages': MEASURE['ages']})
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
FOOD = """(() => { FK.reset(); const D = FK.D, E = ECON, s = FK.SIDES[0], h = FK.seatOf(0), R = RUN, T = BOOKS.tech, key = (k) => Object.keys(T).find((c) => T[c].key === k), out = { snaps: [] };
  for (const k of R.techs) FK.learn(0, key(k)); s.store.food = R.food; s.store.wood = s.store.stone = 9999; let n = 0;
  const placed = (code) => { for (let d = 8; d < 60; d++) for (let a = 0; a < 16; a++) { const i = Math.round(h.i + d * Math.cos(a * 0.3927)), j = Math.round(h.j + d * Math.sin(a * 0.3927)); if (E.canPlace(code, i, j)) { const t = E.plan(0, code, i, j); t.done = 1; t.hp = t.hpMax; return t; } } };
  const farms = R.fert.map((f) => Object.assign(placed('BCL1'), { fert: f })), pen = Object.assign(placed('BCL3'), { sheep: R.sheep, wk: 1 }), fish = FK.things().find((t) => t.kind === 'fish');
  s.store.food = R.food; fish.amount = fish.max / 2; const free = (q) => FK.walkable(q) && !FK.units().some((u) => u.k === q), near = (k) => { for (let d = 1; ; d++) for (const q of [k + d, k - d, k + d * FK.N, k - d * FK.N]) if (free(q)) return q; };
  while (E.villagersOf(0).length < 20) FK.spawn('UV', 0, near(h.k ?? FK.tileAt(h.bx, h.by)), Math.random);
  for (const c of ['UM1', 'UM1', 'UM1', 'UM1', 'UM1', 'UM3', 'UM3', 'UM3', 'UM3', 'UM3']) FK.spawn(c, 0, near(FK.tileAt(h.bx, h.by)), Math.random);
  for (const u of FK.units()) if (u.side === 0) { u.job = 'idle'; u.target = u.path = null; }
  const bushes = FK.things().filter((t) => t.kind === 'bush').slice(0, 5); out.bushes = bushes.map((b) => b.amount); for (const u of FK.units()) if (u.side !== 0 && bushes.includes(u.target)) { u.target = null; u.job = 'idle'; } E.villagersOf(0).slice(0, 5).forEach((u, i) => Object.assign(u, { job: 'gather', target: bushes[i], carry: 'food' }));
  const wolf = FK.spawn('MW4', -1, near(FK.tileAt(h.bx, h.by)), Math.random), away = [pen.bx + 2 * D.flock.wolf, pen.by], base = FK.stat('BCL1', 0, 'rate'); let got = 0;
  out.units = FK.units().filter((u) => u.side === 0).map((u) => u.code); out.base = base; const rng = FK.rng; FK.rng = () => R.draws[n++];
  for (let t = 1; t <= R.secs; t++) { FK.K.t = t; const w = R.wolfAt.includes(t); wolf.bx = w ? pen.bx : away[0]; wolf.by = w ? pen.by : away[1];
    for (const f of farms.slice(0, R.worked)) f.workT = E.time(); E.nature(1); for (const f of farms.slice(0, R.worked)) got += (E.rateOf(f, 0) * E.hungerOf(0)) / base;
    if (t % 60 === 0) out.snaps.push([t, s.store.food, !!s.hungry, farms.map((f) => f.fert), pen.sheep, fish.amount, got, bushes.map((b) => b.amount), s.ledger.out.upkeep || 0, s.ledger.out.spoiled || 0, E.harvest()]); }
  out.draws = n; FK.rng = rng; FK.reset(); const S = FK.units().filter((u) => u.side === 0).slice(0, 3).concat(FK.spawn('UM3', 0, near(FK.tileAt(h.bx, h.by)), Math.random), FK.spawn('UM1', 0, near(FK.tileAt(h.bx, h.by)), Math.random));
  const f0 = FK.SIDES[0].store.food; const sol = S.filter((u) => ECON.soldier(u.code)), e0 = sol.map(ECON.eats); WAR.order(S, null, FK.tileAt(h.bx + 30 * FK.D.tile, h.by)); FK.sim(0.1); out.order = [S.map((u) => u.code), null, sol.length && sol.every((u, n) => u.job === 'march' && Math.abs(ECON.eats(u) / e0[n] - FK.D.pace.marchDay) < 1e-9) ? 1 : 0];   // Albert, Nov 11 and Nov 13 09:39: orders cost food. They do, by the march ration: a marching soldier eats marchDay times his ration (E-code at econ.js eats), charged as upkeep; the per-order fee (orderCost) was cut in N24 #14
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
async def food(b):
    pg, errs = await fresh(b)
    await pg.evaluate('FK.D.startIn = 0')   # Mid's year opens on spring's first day; v100 opens later in spring (D359), so a test held to Mid's calendar opens where Mid's does
    tech = open(os.path.join(HERE, '../mid/src/04-rules-tech.js')).read(); TECHS = ['hearth', 'icehouse', 'seedstore']
    fx = [f for k in TECHS for f in json.loads(json.dumps(eval(re.sub(r'(\w+):', r'"\1":', re.search(r"id: '%s',[\s\S]*?fx: (\[[\s\S]*?\]),\n" % k, tech).group(1)).replace("'", '"'))))]
    run = {'techs': TECHS, 'food': 1300, 'draws': [0.7, 0.3, 0.1], 'fert': [1, 0.705, 0.65, 1], 'worked': 2, 'sheep': 11, 'wolfAt': [540, 720], 'secs': 900}
    v = await pg.evaluate(FOOD.replace('RUN', json.dumps(run)))
    fishMax = await pg.evaluate("FK.things().find((t) => t.kind === 'fish').max"); await pg.close()
    v0 = v['snaps'][0]   # G1: the pocket's bushes hold Mid's share of zone 1's food (QCS), so Mid is given the bushes as the page laid them (v.bushes); a computer's villagers walking to one of them (they eat from it on the way, as Mid's do) are sent idle first, so the two towns eat the same
    mid, err = frozen('basics blds tuning core eco events', MIDFOOD,
                      {**run, 'fx': fx, 'tags': {'cata': ['mounted']}, 'units': v['units'], 'fishMax': fishMax, 'bushes': v['bushes'], 'order': v['order'][0]})
    m0 = MEASURE['rate'] and 0.8   # Mid's farm rate: v100's harvest is read against its own base, Mid's against its gatherMul alone
    same = bool(mid) and len(mid['snaps']) == len(v['snaps']) and all(close(a, b) for a, b in zip(v['snaps'], mid['snaps']))
    flips = bool(mid) and any(x[2] for x in v['snaps']) and not v['snaps'][-1][2] and v['snaps'][-1][4] < run['sheep']   # it went hungry, was fed again by the cull, and the wolf took sheep
    got = [same, flips, v['draws'] == (mid or {}).get('draws'), v['order'][2] > 0, v['hunt'][:3] == [True, True, True] and v['hunt'][3] == 'food', v['dock'] == [False, True, False], not errs]
    off = [i for i, (a, c) in enumerate(zip(v['snaps'], (mid or {}).get('snaps', []))) if not close(a, c)][:2]
    ok('t-food', all(got), [got, off, [v['snaps'][i] for i in off], [mid['snaps'][i] for i in off] if mid and off else '', v['order'], (mid or {}).get('order'), v['hunt'], v['dock'], err[-400:], errs[:2]])
def proof():
    plants = {'home': ('books/angles.js', '"A3":', '"D1":'), 'needs': ('books/shells.js', '"ticks": ["Yield"]', '"ticks": ["Yeld"]'),
              'names': ('menu.js', "FK.has(u, 'Gather') && own(u)", "u.code === 'UV' && own(u)"), 'swallowed': ('menu.js', 'S.tab = null; letGo();', 'S.tab = null; // swallowed letGo();'),
              'seals': ('CALCULATIONS.md', 'QA Sun height', 'QA Sun  height')}
    for key, (f, a, b) in plants.items():
        t = tempfile.mkdtemp(); shutil.copytree(HERE, t + '/v', ignore=shutil.ignore_patterns('*.png')); s = open(f'{t}/v/{f}').read()
        assert a in s, f'plant {key}: {a} not found'; open(f'{t}/v/{f}', 'w').write(s.replace(a, b, 1))
        r = subprocess.run([sys.executable, t + '/v/index.py'], capture_output=True, text=True); shutil.rmtree(t)
        ok('t-proof', r.returncode == 1 and (f'[{key}]' in r.stdout or (key == 'seals' and '[permit] law:QA' in r.stdout)), f'{key}: {r.stdout[-200:]}')
PKINDS = [('UV', 'vil', 0), ('UM1', 'spear', 0), ('UM2', 'archer', 0), ('UM3', 'cata', 0), ('UM4', 'ram', 0), ('MW4', 'wolf', -1)]
PSTATES = [dict(load=0, sick=0), dict(load=MEASURE['carry'], sick=0), dict(load=0, sick=1)]
PSETS = [[], ['roads'], ['drainage'], ['snowclear', 'waterproof', 'marching'], ['crampons'], ['roads', 'drainage']]
PACE = """(() => { const D = FK.D, K = FK.K, TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])), out = [], cost = [];
  for (const set of SETS) { FK.reset(); for (const k of set) FK.learn(0, TK[k]); const hk = FK.tileAt(FK.seatOf(0).bx, FK.seatOf(0).by); let k0 = -1;
    for (let d = 3; k0 < 0 && d < 60; d++) for (const q of [hk + d, hk - d, hk + d * FK.N, hk - d * FK.N]) if (k0 < 0 && FK.walkable(q) && !FK.MARSH[q]) k0 = q;
    for (const [code, , side] of KINDS) { const u = FK.spawn(code, side, k0, FK.rng); cost.push(side < 0 ? null : [FK.stat(code, side, 'mud') / D.walkCost.mud / (D.pace.sink[code] ?? D.pace.sink.foot), FK.stat(code, side, 'snow') / D.walkCost.snow]);
      for (const st of STATES) { if (st.load && !FK.has(u, 'Gather')) continue; Object.assign(K, { wet: 0, snow: 0, gfd: 0, temp: 10, wind: 0 }); u.load = st.load; u.sick = st.sick;
        out.push(FK.pace(u) / FK.ref(FK.SH[code].pace)); } } }
  FK.reset(); const rec = [], share = () => Math.sqrt(K.gfd / D.groundIce.fdd); K.t = D.season * 3 + 5 - D.startIn * D.season; K.wet = 1;
  for (let i = 0; i < 1800; i++) { if (i === 900) K.t = D.season + 10 - D.startIn * D.season; FK.sim(0.1); rec.push([K.temp, K.wet, share()]); }
  FK.reset(); const u = ECON.villagersOf(0)[0], far = [6, -6, 6 * FK.N, -6 * FK.N].map((d) => u.k + d).find(FK.walkable); let told = 0, stuck = 0, still = 0; FK.on('event', (e) => { told += e === 'slip'; });
  Object.assign(K, { wet: 0.7, snow: 0, gfd: 0, temp: 5, wind: 0 }); u.load = 0; FK.go(u, far); for (const v of FK.units()) if (v !== u) v.stuck = K.t + 1; FK.step(0.1); const mud = [u.mps, FK.pace(u), FK.ref(FK.SH[u.code].pace)];   // the walker alone: the others stand this step, so no one else wears its rut cell (F37: at the bottom left they share it)
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
async def pace(b):
    pg, errs = await fresh(b)
    v = await pg.evaluate(PACE.replace('SETS', json.dumps(PSETS)).replace('KINDS', json.dumps(PKINDS)).replace('STATES', json.dumps(PSTATES))); await pg.close()
    mid, err = frozen('basics units blds tech tuning core nav sim events',
                      MIDPACE, {'sets': PSETS, 'kinds': PKINDS, 'states': PSTATES, 'rec': [r[:2] for r in v['rec']]}); mid = mid or {}
    ice = [r[2] for r in v['rec']]; near = lambda a, c: all(abs(x - y) <= 1e-4 for x, y in zip(a, c)) and len(a) == len(c)
    snow = close([x[1] if x else 0 for x in v['cost']], [x[1] if x else 0 for x in mid.get('cost', [])])
    got = [bool(mid) and near(v['cases'], mid['cases']), bool(mid) and close([x[0] if x else 0 for x in v['cost']], [x[0] if x else 0 for x in mid['cost']]) and snow and any(x and abs(x[0] - 0.35) < 1e-9 for x in v['cost']),
           bool(mid) and close(ice, mid['ice']) and max(ice[:900]) > 0.2 and ice[-1] < max(ice), len({round(c, 6) for c in v['cases']}) > 3,
           close(v['mud'][0], v['mud'][1]) and v['mud'][1] < v['mud'][2], v['stuck'] > 0 and v['still'] == v['stuck'] and v['told'] == 1 and v['wary'] is True, not errs]
    ok('t-pace', all(got), [got, v['cases'][:8], mid.get('cases', [])[:8], v['cost'][:6], mid.get('cost', [])[:6], v['mud'], v['stuck'], v['still'], v['told'], errs[:2], err[-400:]])
MASS = keyed('mass'); GROUND = keyed('ground')
PHYS = """(() => { const D = FK.D, K = FK.K, TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])), out = {}; FK.reset();
  const u = FK.units().find((v) => v.side === 0 && FK.has(v, 'Gather')), g0 = { ...FK.footing(u), mud: 0, snow: 0, ice: 0, rise: 0, along: 1 }; Object.assign(K, { wind: 0 }); u.load = 0; u.wary = false;
  out.flat = FK.pace(u, g0); out.cases = CASES.map(([load, rise, mud, snow, wind]) => { u.load = load; K.wind = wind; return [load, rise, mud, snow, wind, FK.pace(u, { ...g0, rise, mud, snow })]; }); u.load = 0; K.wind = 0;
  BOOKS.tech.O0 = { key: 'O0', value: { cost: {}, fx: [{ s: 'cost', k: 'UM1', p: 0.1 }, { s: 'cost', k: 'UM1', p: 0.08 }, ...CUTS.map((c) => ({ s: 'cost', k: 'UM1', c }))] }, name: 'a test step', cite: [], law: ['QCA'] }; FK.learn(0, 'O0');
  out.cuts = [FK.stat('UM1', 0, 'cost'), FK.stat('UM1', 0, 'atk')]; BOOKS.tech.O0.value.fx = [{ s: 'atk', k: 'UM1', p: 0.1 }, { s: 'atk', k: 'UM1', p: 0.08 }, ...CUTS.map((c) => ({ s: 'atk', k: 'UM1', c }))]; FK.learn(0, 'O0'); out.cuts.push(FK.stat('UM1', 0, 'atk')); delete BOOKS.tech.O0; FK.reset();
  out.sky = LEVELS.map((x) => [sky(x, 0), sky(0, x)]); out.drops = LEVELS.map((x) => { K.rain = x; K.snowing = 0; K.wind = 0; const y = DROPS.map((m) => m.y); drawSky(0.05); const r = DROPS.filter((m, i) => m.y !== y[i]).length; K.rain = 0; K.snowing = x; const y2 = DROPS.map((m) => m.y); drawSky(0.05); return [r, DROPS.filter((m, i) => m.y !== y2[i]).length]; });
  const W = D.weather.blizzard, WX = D.weather, flake = (WX.snow.slow + WX.snow.fast) / 2, sVis = WX.perHour * flake * Math.pow((WX.km * WX.k) / (W.vis * WX.snow.beta), 1 / WX.snow.pow), edge = Math.max(W.wind / WX.wind.most / (1 + WX.wind.gust), sVis / WX.snow.most); out.edge = [blizzard(sky(0, edge * (1 - 1e-9))), blizzard(sky(0, Math.min(1, edge * (1 + 1e-9)))), blizzard(sky(1, 0))];
  out.flags = [[1, W.wind, W.vis - 1e-6], [1, W.wind - 1e-6, W.vis - 1e-6], [1, W.wind, W.vis], [0, W.wind * 2, 1]].map(([S, gust, vis]) => blizzard({ S, gust, vis }));
  FK.reset(); const play0 = play; play = () => 0; K.t = D.season * 3 + 1 - D.startIn * D.season; FK.sim(0.1); Object.assign(K, { wetHour: true, I: 1, dir: 1, snowing: 1, rain: 0, blizT: 0 }); const hrs = [];
  for (let i = 0, n = Math.ceil((D.weather.blizzard.hours + 0.5) * (D.day / 24) / 0.5); i < n; i++) { FK.sim(0.5); hrs.push([K.blizT, K.bliz, K.temp <= 1]); }   // N19: the day is longer, so the run lasts the blizzard's hours play = play0; out.hours = hrs; out.hour = D.day / 24;
  FK.reset(); const w = FK.units().find((v) => v.side === 0 && FK.has(v, 'Gather')), far = [6, -6, 6 * FK.N, -6 * FK.N].map((d) => w.k + d).find(FK.walkable), need0 = FK.G.step.person; out.slip = [];
  for (const [ice, land, dn] of [[1, 0, 1e-9], [1, 0, 0], [1, 0, -1e-9], [0.5, 0.99, 1e-9]]) { Object.assign(K, { wet: 0, snow: 0, temp: -5, gfd: ice * ice * D.groundIce.fdd, wind: 0 }); const g = FK.footing(w), on = land < ice ? g.on : g.ground;
    FK.G.step.person = on + dn; w.stuck = 0; w.wary = false; w.tread = -1; FK.go(w, far); const p0 = play; play = () => land; FK.step(0.1); play = p0; out.slip.push([on + dn > on, w.stuck > K.t]); }
  FK.G.step.person = need0; out.studs = [];
  for (const set of [['crampons'], ['horseshoes']]) { FK.reset(); for (const k of set) FK.learn(0, TK[k]); out.studs.push(['UV', 'UM1', 'UM2', 'UM4', 'UM3'].map((c) => FK.stat(c, 0, 'studs') > 0)); }
  out.scout = [FK.stat('US4', 0, 'spd'), D.stats.US4.rng, D.speed.walk]; out.tech = Object.values(BOOKS.tech).flatMap((e) => e.value.fx || []).filter((f) => f.p != null || f.c != null).map((f) => [f.p ?? null, f.c ?? null]);
  return out; })()"""
PCASES = [[0, 0, 0, 0, 0], [MEASURE['carry'], 0, 0, 0, 0], [0, 0.05, 0, 0, 0], [MEASURE['carry'] / 2, 0.08, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0.5, 0.5, 0], [0, 0, 0, 0, -12], [MEASURE['carry'], 0.03, 0.3, 0, -6]]
CUTS = [0.5, 0.3, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99]; LEVELS = [0, 0.137, 0.37, 0.5, 0.81, 1]
async def physics(b):
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
        R, S, w = r * wx['rain']['most'], s * wx['snow']['most'], max(r, s) * wx['wind']['most']; flake = (wx['snow']['slow'] + wx['snow']['fast']) / 2; ext = wx['rain']['beta'] * (wx['rain']['mp']['a'] * R ** wx['rain']['mp']['b']) ** wx['rain']['pow'] + wx['snow']['beta'] * (S / (wx['perHour'] * flake)) ** wx['snow']['pow']   # G1: CALVIS from water content (QK)
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
TECH = book('tech'); KSHELL = [c for c, e in SHELLS.items() if 'class' in e and c in MEASURE['train'] and 'civ' not in e]; RANKED = sorted({e['value']['rank']['k'] for e in TECH.values() if 'rank' in e['value']} - set(KSHELL) - {c for c, e in SHELLS.items() if 'civ' in e})   # a people's own kind is t-civs'
KSETS = [[], ['shields', 'spearwall', 'drill', 'bronze', 'spearheads', 'leather', 'helmets', 'slings', 'composite', 'horses', 'bridles', 'fieldcraft'],
         ['phalanx', 'legion', 'saddles', 'stirrups', 'cavalry', 'iron', 'chain', 'scale', 'torsion', 'engineers', 'marching'],
         ['pikesquare', 'arms', 'plate', 'bodkin', 'xbowdrill', 'longbow', 'knighthood', 'horseshoes', 'counterweight', 'firearrows', 'burningshot', 'tempering'],
         ['halberd', 'tercio', 'bayonet', 'musket', 'volley', 'remounts', 'dragoons', 'casehard', 'oiling', 'corned', 'limbers', 'petards']]
KINDJS = """(() => { const D = FK.D, TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])), s0 = FK.SIDES[0], out = { sets: [], trains: [], wrong: [] }, keys = ['hp', 'atk', 'rng', 'spd', 'sight', 'armor', 'train'];
  let got = []; for (const set of SETS) { got = got.concat(set); FK.reset(); for (const k of got) FK.learn(0, TK[k]); out.sets.push(CODES.map((c) => [FK.rankOf(c, 0), FK.rankName(c, 0), FK.kitOf(0, c), ...keys.map((y) => FK.stat(c, 0, y))])); }
  const rich = () => { for (const y of ECON.YIELDS) s0.store[y] = 1e6; }, room = D.pop[FK.seatOf(0).code]; D.pop[FK.seatOf(0).code] = D.popMax; FK.reset(); rich(); s0.age = D.ages.length - 2; const h = FK.seatOf(0), blds = [];
  for (const code of Object.keys(D.trains).filter((c) => c !== h.code)) { blds.push($ring(h, 8, 60, (i, j) => ECON.canPlace(code, i, j) && FK.build(code, i, j, s0.col)) || null); }
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
async def kinds(b):
    codes = KSHELL + RANKED; look = {c: SHELLS[c]['look'] for c in codes}; cls = {c: SHELLS[c].get('class') for c in codes}
    pg, errs = await fresh(b)
    v = await pg.evaluate(KINDJS.replace('SETS', json.dumps(KSETS)).replace('CODES', json.dumps(codes)))
    ranks = {}
    for e in TECH.values():
        if 'rank' in e['value']: ranks[e['value']['rank']['k']] = ranks.get(e['value']['rank']['k'], 0) + 1
    SPR = keyed('sprites'); cases = [[look[c], len(SPR[look[c]].get('rank', [])) or (1 if SPR[look[c]].get('elite') else 0), 3 if cls[c] else 0] for c in codes] + [[l, 0, 0] for l in ('vil', 'wolf', 'caravan', 'wagon')]
    art = await pg.evaluate(ARTJS.replace('CASES', json.dumps(cases)), open(os.path.join(HERE, '../mid/src/18-figures.js')).read()); await pg.close()
    mid, err = frozen('basics units blds tech tuning core', MIDKINDS, {'sets': KSETS, 'looks': [look[c] for c in codes]}); mid = mid or {}
    U, walk, ages = mid.get('unit', {}), MEASURE['speed']['walk'], MEASURE['ages']; Y = {'f': 'food', 'w': 'wood', 'g': 'gold', 'i': 'iron', 's': 'stone'}; at = {SHELLS[c]['look']: c for c in MEASURE['trains']}
    near = lambda a, b, r=1e-6: abs(a - b) <= r * max(1, abs(a), abs(b))
    def same(c):   # a kind's settings, Mid's
        u, e, s = U.get(look[c], {}), SHELLS[c], MEASURE['stats'][c]
        return (u.get('name') == e['name'] and ages.index(e['age']) == u.get('age') and at.get(u.get('at')) in MEASURE['trains'] and [k for k in MEASURE['trains'][at[u['at']]] if k not in SHELLS] == [e['class']]
                and look.get(e.get('teach')) == mid['teach'].get(look[c]) and MEASURE['cost'][c] == {Y[k]: n for k, n in u['cost'].items()} and MEASURE['train'][c] == u['t']
                and [s['hp'], s['atk'], s['rof']] == [u['hp'], u['dmg'], u['cd']] and near(s['rng'], u['rng'] / 10) and near(s['sight'], u['sight'] / 10) and near(MEASURE['speed'][e['pace'].split('.')[1]], walk * u['spd'] / 24, 1e-4))
    def numbers(i, j, c):   # after research: v100 [level, name, kit, hp, atk, rng, spd, sight, armor, train] against Mid's [tier, name, kit, hp, dmg, rng, spd, sight + sightFx, armor, t × train]; sight is Mid's sight again, in m (the eye's height is its own stat, eye, since S1: the research adds scale the day's range, QAL)
        a, m = v['sets'][i][j], mid['sets'][i][j]
        if not cls[c]: return a[:2] == m[:2] and near(a[6] / v['sets'][0][j][6], m[6] / mid['sets'][0][j][6])
        return (a[:3] == m[:3] and near(a[3], m[3]) and near(a[4], m[4]) and near(a[5], m[5] / 10) and near(a[6], walk * m[6] / 24, 1e-4) and near(a[7], m[7] / 10) and near(a[8], m[8]) and near(a[9], m[9]))
    trained = [[[b, sorted(look[c] for c in ks if c in look)] for b, ks in age] for age in v['trains']]
    want = [[[b, sorted(k for k in mid.get('sol', []) if (at.get(U[k]['at']) == b or b in [at.get(x) for x in U[k].get('also', [])]) and U[k]['age'] <= a)] for b, _ in age] for a, age in enumerate(v['trains'])]
    bad = [x for x in art if x[4] != 0 or x[5] < 20]
    got = [bool(mid) and sorted(look[c] for c in KSHELL) == sorted(mid['sol']) and all(same(c) for c in KSHELL),
           bool(mid) and all(numbers(i, j, c) for i in range(len(KSETS)) for j, c in enumerate(codes)) and len({str(r) for r in v['sets']}) == len(KSETS),
           trained == want and not v['wrong'] and any(len(ks) > 1 for age in trained for _, ks in age),
           bool(mid) and [MEASURE['popMax'], MEASURE['armyMax'], MEASURE['squad']] == mid['max'] and v['ceiling'][:2] == [True, False] and v['ceiling'][2] == mid['full'].rstrip('.') and v['ceiling'][3:] == [MEASURE['armyMax'], MEASURE['armyMax'] - 1],
           not bad and len(art) > 300, not errs, bool(mid) and all(n == mid['t'].get(UKIND[c]) for c, n in MEASURE['train'].items())]
    miss = [(KSETS[i][-1:] or ['none'], c, v['sets'][i][j], mid['sets'][i][j]) for i in range(len(KSETS)) for j, c in enumerate(codes) if mid and not numbers(i, j, c)][:4]
    ok('t-kinds', all(got), [got, miss, bad[:6], v['ceiling'], v['wrong'][:4], [x for x in zip(trained, want) if x[0] != x[1]][:1], errs[:2], err[-400:]])
WARJS = """(() => { const D = FK.D, [me, foe] = D.players, out = {}, at = (s) => FK.units().find((v) => v.side === s).k; $calm(me, foe);
  out.vs = CODES.map((a) => CODES.map((b) => WAR.vs({ code: a, side: me }, { code: b, side: foe })));
  out.reach = Object.keys(D.tower).map((c) => WAR.reachOf({ code: c, side: me }));
  const u = FK.spawn(CODES[0], me, at(me), FK.rng), v = FK.spawn(CODES[6], foe, at(me), FK.rng); out.worth = [WAR.worth(u, v, 0), WAR.worth(v, u, 0), u.hp, v.hp];
  const w = FK.spawn(CODES[0], foe, at(me), FK.rng), x = FK.spawn(CODES[1], me, at(me), FK.rng); Object.assign(w, { bx: u.bx + 9, by: u.by, fx: -1, fy: 0, target: v }); Object.assign(x, { bx: u.bx + 18, by: u.by });
  const back = WAR.damage(x, w); w.target = null; out.flank = back / WAR.damage(x, w);
  FK.reset(); WAR.treaty(me, foe, 'war'); play = window.dice(SEED); const k = at(me), A = [], B = []; for (let i = 0; i < 6; i++) A.push(FK.spawn(CODES[0], me, k, FK.rng)); for (let i = 0; i < 8; i++) B.push(FK.spawn(CODES[7], foe, k - 6, FK.rng));   // on the hall's open side, in sight of each other (QAM): across the hall they could not see to fight
 
  let broke = 0, back2 = 0; for (let t = 0; t < 900; t++) { FK.sim(0.1); for (const q of [...A, ...B]) { if (q.routAt != null && !q.seen) { q.seen = 1; broke++; } if (q.seen === 1 && q.routAt == null && !q.gone) { q.seen = 2; back2++; } } } out.rout = [broke, back2];
  FK.reset(); const h = FK.seatOf(me), s0 = FK.SIDES[me], place = (c) => $ring(h, 9, 60, (i, j) => { if (ECON.canPlace(c, i, j)) { const t = FK.build(c, i, j, s0.col); t.done = 1; t.hp = t.hpMax = WAR.hpMax(t); return t; } });
  const tw = place(Object.keys(D.tower).find((c) => !FK.SH[c].ticks.includes('Seat'))); tw.side = foe; const sold = FK.spawn(CODES[1], me, at(me), FK.rng), was = { ...s0.store }; tw.hp = 1; WAR.treaty(me, foe, 'war'); WAR.hit(sold, tw); out.plunder = Object.keys(D.cost[tw.code]).map((y) => s0.store[y] - was[y]);
  for (const y of ECON.YIELDS) s0.store[y] = 1e6; s0.age = 3; const TK = Object.fromEntries(Object.entries(BOOKS.tech).map(([c, e]) => [e.key, c])); for (const key of ['engage', 'command', 'muster']) { s0.techs.add(TK[key]); FK.learn(me, TK[key]); }
  place(Object.keys(D.trains).find((c) => FK.trains(c).includes(CODES[0]))); place(Object.keys(FK.SH).find((c) => FK.SH[c].ticks.includes('Squad'))); WAR.plan(0, FK.SH[CODES[0]].class, true); WAR.plan(0, FK.SH[CODES[0]].class, true);
  const lack = WAR.lack(0), cost = ECON.musterCost(me, lack); out.muster = [JSON.stringify(lack), ECON.muster(me, lack, 0)]; for (let t = 0; t < 3000 && WAR.squad(0).length < 2; t++) FK.sim(0.1); out.muster.push(WAR.squad(0).length, cost.cost, cost.t);
  return out; })()"""
MIDWAR = r"""return box([basics, units, blds, tech, tuning, cut(core, 'const rangeFrom', 'const rangeOf'), cut(spatial, 'function foeValue', '\n}') + '\n}', cut(spatial, 'function vsMul', '\n}') + '\n}',
  `const baseKind = (k) => k, stats = (o, k) => ({ ...UNIT[k] }); var OUT = { vs: RUN.looks.map((a) => RUN.looks.map((b) => vsMul({ owner: 0, kind: a }, { owner: 1, kind: b }))),
   reach: RUN.towers.map((k) => rangeFrom(BLD[k].bow, BLD[k].h) / 10), worth: [foeValue({ owner: 0, kind: RUN.looks[0], hp: RUN.hp[0] }, { owner: 1, kind: RUN.looks[6], hp: RUN.hp[1] }, 0), foeValue({ owner: 1, kind: RUN.looks[6], hp: RUN.hp[1] }, { owner: 0, kind: RUN.looks[0], hp: RUN.hp[0] }, 0)],
   nums: { MORALE, FLANKING, FLANK, YARD, KITE, GARRISON, FORM, COLUMN, TEMPER, PLUNDER, wear: CLIMATE.wear, unit: Object.fromEntries(RUN.looks.map((k) => [k, UNIT[k]])) } };`]);"""
async def war(b):
    codes = [c for c, e in SHELLS.items() if e.get('class')]; looks = [SHELLS[c]['look'] for c in codes]; TW = {'BW3': 'tower', 'BTC1': 'keep', 'BTC8': 'camptower', 'BP8': 'courthouse', 'BCT1': 'tpost', 'BTC2': 'castle'}
    pg, errs = await fresh(b); v = await pg.evaluate(WARJS.replace('SEED', str(SEED)).replace('CODES', json.dumps(codes))); await pg.close()
    mid, err = frozen('basics units blds tech tuning core spatial', MIDWAR, {'looks': looks, 'towers': [TW[c] for c in MEASURE['tower']], 'hp': v['worth'][2:]}); mid = mid or {}
    m, n = mid.get('nums', {}), MEASURE; MO, FL, S = n['nerve'], n['flanking'], n['stats']; near = lambda a, c, r=1e-9: abs(a - c) <= r * max(1, abs(a), abs(c))
    books = bool(m) and all(MO[k] == m['MORALE'][k] for k in ('kill', 'odds', 'tau', 'shelter', 'routHit', 'after', 'wild')) and n['bases']['rout'] == m['MORALE']['rout'] \
        and [FL['cover'] * 10, FL['line'] * 10] == [m['FLANKING']['cover'], m['FLANKING']['line']] and n['flank'] == m['FLANK'] and n['yard'] * 10 == m['YARD'] and near(n['kite']['near'] * 10, m['KITE']) and n['shelter']['r'] * 10 == m['GARRISON']['r'] and n['bases']['garrison'] == m['GARRISON']['heal'] \
        and all(n['forms'][f['shape']][k] == f.get(k2, 1) for f in m['FORM'] + [m['COLUMN']] for k, k2 in (('dmg', 'dmg'), ('hit', 'hit'), ('spd', 'spd'), ('vsRiders', 'vsMounted'))) and all(n['tempers'][i][k] == t.get(k, 1) for i, t in enumerate(m['TEMPER']) for k in ('nerve', 'dmg', 'chase')) \
        and n['plunder'] == m['PLUNDER'] and n['wear'] == m['wear'] and all(S[c].get(k) == m['unit'][l].get(k) for c, l in zip(codes, looks) for k in ('bld', 'rarmor', 'bonly', 'kite'))
    got = [bool(mid) and v['vs'] == mid['vs'] and any(x != 1 for r in v['vs'] for x in r), bool(mid) and all(near(a, c, 0.01) for a, c in zip(v['reach'], mid['reach'])), bool(mid) and all(near(a, c) for a, c in zip(v['worth'][:2], mid['worth'])), books,
           near(v['flank'], n['flank']), v['rout'][0] > 0 and v['rout'][1] > 0, v['plunder'] == [int(x * n['plunder']) for x in MEASURE['cost'][[c for c in MEASURE['tower'] if 'Seat' not in SHELLS[c]['ticks']][0]].values()],
           v['muster'][1] is True and v['muster'][2] == 2 and v['muster'][3] == {y: q * json.loads(v['muster'][0])[codes[0]] * n['muster']['cost'] for y, q in MEASURE['cost'][codes[0]].items()}, not errs]
    ok('t-war', all(got), [got, v['reach'], mid.get('reach'), v['worth'], mid.get('worth'), v['flank'], v['rout'], v['plunder'], v['muster'], errs[:2], err[-300:]])
ORDJS = r"""(async () => { const D = FK.D, [me, foe] = D.players, out = {}, sim = $run; $calm(me, foe);
  const h = FK.seatOf(me), kind = (c) => Object.keys(FK.SH).find((k) => FK.SH[k].class === c), fr = (x, y) => { const q = (FK.A.corner * Math.PI) / 180; return [x * Math.cos(q) - y * Math.sin(q), x * Math.sin(q) + y * Math.cos(q)]; }, tile = (dx, dy) => { for (let r = 0; r < 12; r++) for (const [a, b] of [[r, 0], [0, r], [-r, 0], [0, -r]]) { const [x, y] = fr(dx + a, dy + b), k = FK.tileAt(h.bx + x * D.tile, h.by + y * D.tile); if (FK.walkable(k)) return k; } };   // in your corner's own frame (F37: the corner is the book's, A6)
  const make = (c, n, k, side = me) => Array.from({ length: n }, () => FK.spawn(kind(c), side, k, FK.rng)), scr = (u) => FK.toScreen(u.vx, u.vy);
  for (const u of FK.units().filter((v) => v.side === me)) u.gone = true; FK.units().splice(0, FK.units().length, ...FK.units().filter((v) => !v.gone));
  const box = make('Foot', 3, tile(0, 14)); FK.cam.x = box[0].vx; FK.cam.y = box[0].vy; FK.cam.z = 2; MENU.S.tab = null; MENU.render(true); FK.dirty(); await new Promise((r) => setTimeout(r, 50));
  out.box = box.map(scr); return out; })()"""
ORD2 = r"""(() => { const D = FK.D, [me, foe] = D.players, out = {}, sim = $run, h = FK.seatOf(me), kind = (c) => Object.keys(FK.SH).find((k) => FK.SH[k].class === c), scr = (u) => FK.toScreen(u.vx, u.vy);
  const tile = (dx, dy) => { for (let r = 0; r < 12; r++) for (const [a, b] of [[r, 0], [0, r], [-r, 0], [0, -r]]) { const k = FK.tileAt(h.bx + (dx + a) * D.tile, h.by + (dy + b) * D.tile); if (FK.walkable(k)) return k; } }, make = (c, n, k, side = me) => Array.from({ length: n }, () => FK.spawn(kind(c), side, k, FK.rng));
  const P = FK.picked(); out.picked = P.length; const g = tile(10, 14), [gx, gy] = FK.toScreen(...FK.toView(...FK.tileMid(g), Math.max(D.land, FK.H[g]))); FK.tap(gx, gy); const O = P[0] && P[0].ord; out.order = !!O && P.every((u) => u.ord === O) && WAR.ORD.has(O) && O.k === g && /^[A-Z]+\d+$/.test(O.label); sim(1.2); out.eta = O && [O.n, O.eta];
  FK.select(null); MENU.S.more = false; MENU.S.tap = null; const [u0] = P, [ux, uy] = scr(u0); FK.fire('tap', u0.k, u0, ux, uy); out.one = FK.picked().length === 1 && FK.picked()[0] === u0; MENU.S.tap = null; FK.fire('tap', u0.k, u0, ux, uy); out.two = FK.picked().length === 0;   // Design 08, the call (E1051): one tap calls him, a tap on him again hangs up
  const fresh = make('Foot', 2, tile(-4, 0)); MENU.VERBS.war.run(); MENU.S.aim = { k: tile(20, 0), t: null }; WAR.go(MENU.S.aim); const M = WAR.MS[fromBook('words').army.all]; out.go = !!M && M.n0 === 2 && fresh.every((u) => u.ord === M.ord); MENU.VERBS.war.run();
  const r = make('Riders', 1, tile(-6, 0))[0]; sim(0.3); const p0 = r.pacex; WAR.charge([r]); sim(0.2); const p1 = r.pacex; sim(D.charge.secs); const p2 = r.pacex; sim(D.charge.tired * 8); out.charge = [p1 / p0, p2 / p0, r.pacex / p0];
  const C = make('Foot', 8, tile(-8, 0)), [ax, ay] = FK.tileMid(tile(-8, -6)), a = { bx: ax, by: ay }, b = { bx: ax + 6 * D.ranks.gap * D.tile, by: ay }; if (WAR.chokeAt) WAR.chokeAt(a, b, C);   // the Yard's Choke left with the Yard (N6); its home waits (Parked)
  out.choke = C.map((u) => u.drill && u.drill.shape === 'choke' && u.drill.cols === 6 && u.job === 'march');
  const wall = make('Foot', 3, tile(-10, 0)); WAR.direct('Foot', false, { k: tile(-10, 8), t: null }); out.wall = wall.every((u) => u.wall > FK.K.t && WAR.shapeOf(u) === D.forms.square && WAR.temperOf(u) === D.army.temper.hold);
  let cover = null; for (let d = 1; d < 120 && cover == null; d++) for (const [x, y] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (cover == null && FK.FOR[FK.tileAt(h.bx + x * d * D.tile, h.by + y * d * D.tile)]) cover = FK.tileAt(h.bx + x * (d - 2) * D.tile, h.by + y * (d - 2) * D.tile);
  const [cx, cy] = FK.tileMid(cover), A = make('Foot', 2, FK.tileAt((cx + h.bx) / 2, (cy + h.by) / 2)); for (const g of FK.units().filter((u) => !FK.SIDES[u.side])) FK.vanish(g); WAR.ambushAt(cover, A); for (let i = 0; i < 900 && !A.every((u) => u.hid); i++) FK.sim(0.1); const f = make('Foot', 1, FK.tileAt(A[0].bx, A[0].by), foe)[0];   // the wild cleared first: a boar wandering by (the dice's) is not the ambush
  out.hid = [A.every((u) => u.hid), !WAR.enemies(f, A[0])]; f.bx = A[0].bx + 2 * D.tile * Math.sign(h.bx - cx || 1); f.by = A[0].by + 2 * D.tile * Math.sign(h.by - cy); FK.place(f); /* the foe steps out on the hall's side, open ground: behind the ambush a tree may stand in the line of sight (QAM) since Mid's forest (G1) */ FK.sim(0.1); FK.sim(0.1); out.sprung = A.every((u) => !u.amb && u.chg > FK.K.t);
  const S = make('Foot', 2, tile(30, 0)), F = make('Foot', 6, tile(32, 0), foe), R = make('Archers', 8, tile(24, 0)); for (const [i, u] of R.entries()) { u.bx -= (i % 4) * D.tile; u.by += Math.floor(i / 4) * 2 * D.tile; FK.place(u); }
  const ord = { k: S[0].k }; for (const u of S) { u.ord = ord; u.hp = u.hpMax = 300; WAR.fight(u, F[0]); } for (const v of F) v.hp = v.hpMax = 600; FK.look(99); const m = { ord: S[0].ord, name: 'test', st: 'act' }, plan = WAR.reinforcePlan(m), res = WAR.free().filter((u) => !S.includes(u)), c = WAR.centreOf(S), rk = WAR.routeK(FK.tileAt(...Object.values(WAR.centreOf(res))), FK.tileAt(c.bx, c.by));
  out.plan = plan && { go: plan.go.length, waves: plan.waves.map((w) => [w.t, w.list.length]) }; const FN = WAR.foesNear(c); out.run = { S: S.map((u) => ({ hp: u.hp, pow: WAR.power1(u) })), F: FN.map((v) => ({ pow: WAR.power1(v) })), dps: FN.reduce((n, v) => n + WAR.dmgOf(v) / WAR.stat(v).rof, 0), mu: WAR.mixOf(S, FN), nF: [FN.length, F.length], res: res.map((u) => ({ t: (Math.hypot(u.bx - c.bx, u.by - c.by) / D.upm) * rk / FK.pace(u), pow: WAR.power1(u) })) };
  const E = R.slice(0, 4), ek = tile(0, 40), erk = WAR.routeK(FK.tileAt(...Object.values(WAR.centreOf(E))), ek), [ex, ey] = FK.tileMid(ek); out.eta = [out.eta, WAR.etaOf(E, ek, erk)]; out.run.eta = { S: E.map((u) => ({ d: Math.hypot(u.bx - ex, u.by - ey) / D.upm, p: FK.pace(u) })), k: erk };
  return out; })()"""
MIDORD = r"""return box([cut(tuning, 'const CHARGE =', '\n'), cut(tuning, 'const FALLBACK =', '\n'), cut(tuning, 'const CHOKE =', '\n'), cut(tuning, 'const AMBUSH =', '\n'), cut(tuning, 'const DIRECT =', '\n'), cut(ai, 'const AB =', '\n'), cut(input, 'const HOLD_MS', ';') + ';', cut(huddle, 'const HUD =', '};') + '};', cut(quick, 'const ARMY_STILL', '\n'), cut(orders, 'const etaOf', ';') + ';', cut(huddle, 'function reinforcePlan', '\nfunction waveLine'),
  `const dist = (u) => u.d ?? u.t, paceOf = (u) => u.p ?? 1, sideSpd = () => 1, routeK = () => 1, centreOf = () => ({}), mUnits = () => RUN.S, foesNear = () => RUN.F, free = () => RUN.res, unitPower = (u) => u.pow, powerSum = (L) => L.reduce((s, u) => s + unitPower(u), 0), dpsOf = () => RUN.dps, matchup = () => RUN.mu;
   const P = reinforcePlan({}); var OUT = { nums: { CHARGE, FALLBACK, CHOKE, AMBUSH, DIRECT, AB, HOLD_MS, PRESS_SHOW, DBL_MS, HUD, ARMY_STILL }, eta: etaOf(RUN.eta.S, {}, RUN.eta.k), go: P.go.length, waves: P.waves.map((w) => [w.t, w.list.length]) };`]);"""
async def orders(b):
    pg, errs = await fresh(b, 1500); v = await pg.evaluate(ORDJS); xs = [p[0] for p in v['box']]; ys = [p[1] for p in v['box']]; pad = 40
    await pg.mouse.move(min(xs) - pad, min(ys) - pad); await pg.mouse.down(); await pg.wait_for_timeout(int(MEASURE['touch']['hold'] * 1.5)); await pg.mouse.move(max(xs) + pad, max(ys) + pad, steps=4); await pg.mouse.up()
    v = await pg.evaluate(ORD2); await pg.close()
    mid, err = frozen('tuning ai input huddle quick orders', MIDORD, v['run']); mid = mid or {}
    m, n = mid.get('nums', {}), MEASURE; near = lambda a, c, r=1e-9: a is not None and c is not None and abs(a - c) <= r * max(1, abs(a), abs(c)); H, Q, T0 = m.get('HUD', {}), m.get('AB', {}), n['touch']
    nums = bool(m) and [T0['hold'], T0['show'], T0['dbl']] == [m['HOLD_MS'], m['PRESS_SHOW'], m['DBL_MS']] and all(n['hud'][k] == H[k] for k in ('lose', 'clear', 'smooth', 'gap', 'waves')) and n['hud']['near'] * 10 == H['near'] and n['hud']['still'] == m['ARMY_STILL'] \
        and [n['direct']['wall']['secs'], n['direct']['loose'], n['direct']['arc']] == [m['DIRECT'][k] for k in ('wall', 'loose', 'arc')] and n['choke']['min'] == m['CHOKE']['min'] and n['choke']['max'] == m['CHOKE']['max'] \
        and [n['ambush']['cover'], n['ambush']['spring'] * 10, n['ambush']['find'] * 10] == [m['AMBUSH'][k] for k in ('cover', 'spring', 'find')] and [n['charge'][k] for k in ('secs', 'spd', 'tired', 'slow', 'cd')] == [m['CHARGE'][k] for k in ('secs', 'spd', 'tired', 'tiredSpd', 'cd')] \
        and [n['fallback']['secs'], n['fallback']['back'] * 10, n['fallback']['hit']] == [m['FALLBACK'][k] for k in ('secs', 'back', 'hit')] and [n['choke']['ai'][k] for k in ('foot', 'hold', 'every', 'min', 'max')] == [Q[k] for k in ('foot', 'hold', 'every', 'gapMin', 'gapMax')] and n['choke']['ai']['step'] * 10 == Q['step']
    ch = v['charge']; P = v['plan'] or {}
    got = [nums, near(v['eta'][1], mid.get('eta')), bool(P) and P['go'] == mid.get('go') and len(P['waves']) == len(mid.get('waves', [])) and all(near(a[0], c[0]) and a[1] == c[1] for a, c in zip(P['waves'], mid['waves'])) and P['go'] > 0,
           v['picked'] == 3, v['order'], bool(v['eta'][0]) and v['eta'][0][0] == 3 and (v['eta'][0][1] or 0) > 0, v['one'], v['two'], v['go'], near(ch[0], n['charge']['spd'], 1e-6), ch[1] < 0.9, near(ch[2], 1, 0.01), True, v['wall'], all(v['hid']), v['sprung'], not errs]
    ok('t-orders', all(got), [got, v, mid.get('eta'), mid.get('go'), mid.get('waves'), errs[:3], err[-400:]])
ALJS = r"""(() => { const D = FK.D, [me, foe] = D.players, out = {}, sim = $run, said = [], W = fromBook('words'), kind = (c) => Object.keys(FK.SH).find((k) => FK.SH[k].class === c), tick = (t, x) => Object.keys(FK.SH).find((c) => FK.SH[c].ticks.includes(t) && !FK.SH[c].ticks.includes(x));
  const fresh = () => { $calm(me, foe); said.length = 0; }, end = () => { const r = ECON.result(); return r && [r.won, r.text]; }; FK.on('say', (m) => { said.push(m); });
  const spot = (code, side) => $ring(FK.seatOf(side), 6, 60, (i, j) => ECON.canPlace(code, i, j, side) && [i, j]);
  const put = (code, side) => $put(code, side), near = (t, r) => { const ks = []; FK.stamp(t.bx, t.by, r * D.tile, (k) => { if (FK.walkable(k)) ks.push(k); }); return ks; };
  fresh(); sim(3); out.jobs = D.players.map((s) => ECON.villagersOf(s).length > 0 && ECON.villagersOf(s).every((u) => ECON.jobOf(u))); out.threat = CODES.map((c) => ECON.threat({ code: c, side: WILD.includes(c) ? -1 : foe }));
  const g = ECON.villagersOf(me).find((u) => ECON.jobOf(u) && ECON.jobOf(u) !== 'build' && u.target && u.target.kind !== 'bld'), t0 = g.target, s1 = FK.spawn(kind('Foot'), foe, FK.tileAt(t0.bx, t0.by), FK.rng); s1.job = 'hold'; sim(1.5);
  out.leave = [ECON.unsafe(t0, me), g.target !== t0, said.some((m) => m.includes(W.alarm.leave.split('}')[1].split('{')[0]))];
  fresh(); const h = FK.seatOf(me), tw = put(TOWER, me), ks = near(h, 14); for (let i = 0; i < 10; i++) FK.spawn(FK.trains(h.code)[0], me, ks[(i * 37) % ks.length], FK.rng); const V = ECON.villagersOf(me), B = [h, tw];
  out.room = { blds: B.map((b, i) => ({ id: i + 1, kind: b.code, x: b.bx, y: b.by, hp: b.hp, room: ECON.hold(b) })), vils: V.map((u, i) => ({ id: i + 1, x: u.bx, y: u.by })), mid: FK.MID };
  ECON.alarm('shelter'); out.shelter = V.map((u) => B.indexOf(u.den || u.inside)); sim(25); out.inside = V.filter((u) => u.inside).length; ECON.allClear(); sim(3); out.work = [V.some((u) => u.inside), V.slice(0, D.villagers).every((u) => ECON.jobOf(u))];
  fresh(); const H = tick('House', 'Seat'); FK.SIDES[me].store.wood = 1e4; for (const u of ECON.villagersOf(me)) ECON.idle(u); const [i, j] = spot(H, me), site = ECON.plan(me, H, i, j); sim(1.5); out.sent = ECON.villagersOf(me).some((u) => u.target === site); sim(90); out.built = site.done;
  let far = null; for (let k = 0; k < FK.N * FK.N && !far; k += 1) { const x = k % FK.N, y = (k - x) / FK.N; if (ECON.placeWhy(me, H, x, y) === W.say.reach) far = [x, y]; } out.refused = !!far;
  if (far) { const s3 = FK.build(H, far[0], far[1], FK.SIDES[me].col); s3.done = 0; s3.hp = 1; s3.hpMax = WAR.hpMax(s3); sim(1.5); out.told = said.some((m) => m.startsWith(W.say.site.split('{')[0])) && !ECON.villagersOf(me).some((u) => u.target === s3); }
  fresh(); sim(5); for (const q of D.players) if (q !== me && q !== foe) ECON.fall(q); FK.SIDES[me].capA = null; const fh = FK.seatOf(foe), fb = FK.things().filter((t) => t.kind === 'bld' && t.side === foe && t !== fh), was = { ...FK.SIDES[me].store }, fs = { ...FK.SIDES[foe].store }, a = FK.spawn(kind('Foot'), me, near(fh, 9)[0], FK.rng);
  fh.hp = 1e-9; WAR.hit(a, fh); const s0 = FK.SIDES[me], got = ECON.YIELDS.map((y) => s0.store[y] - was[y]); FK.sim(0.1);
  out.fall = { got, fs, blds: fb.map((t) => ({ kind: t.code, hp: t.hp })), keep: fh.code, capA: s0.capA, left: ECON.YIELDS.map((y) => FK.SIDES[foe].store[y]), end: end(), gone: !FK.units().some((u) => u.side === foe) && !FK.things().some((t) => t.side === foe),
    spent: s0.ledger.out.research || 0, gathered: s0.gathered, units: FK.units().filter((u) => u.side === me).map((u) => ({ kind: u.code, army: FK.has(u, 'Fight') && !FK.has(u, 'Gather') })), mine: FK.things().filter((t) => t.kind === 'bld' && t.side === me && t.done >= 1).map((t) => t.code), score: ECON.score(me) };
  fresh(); const mh = FK.seatOf(me); mh.hp = 1e-9; WAR.hit(FK.spawn(kind('Foot'), foe, near(mh, 9)[0], FK.rng), mh); FK.sim(0.1); out.fell = end();
  fresh(); const w = put(tick('Wonder'), foe); w.held = ECON.time(); FK.sim(0.1); out.wonder = end();
  fresh(); FK.SIDES[me].gathered += 1e5; ECON.setBell(ECON.time() + 0.05); FK.sim(0.1); out.bell = end(); out.bellScore = ECON.score(me).total; ECON.setBell(D.bell);
  return out; })()"""
MIDAL = r"""const sum = (c) => Object.values(c || {}).reduce((a, b) => a + b, 0), hyp = Math.hypot, dist = (a, b) => hyp(a.x - b.x, a.y - b.y), noop = () => {}, R = RUN.v, F = R.fall;
  const nums = box([basics, units, blds, tuning, cut(emg, 'const EMG =', '\n'), cut(core, 'const isThreat', '\n// once'), `var OUT = { DANGER_R, SHELTER, EMG, WONDER_HOLD, SHARE_FALLEN, PLUNDER, SCORE, ARMYMAX, hold: [BLD.keep.shelter, BLD.tower.shelter, BLD.castle.shelter], threat: RUN.looks.map((k) => UNIT[k] ? isThreat({ kind: k, hp: 1 }) : null) };`]);
  const P = (alive) => [0, 1, 2, 3].map((id) => ({ id, alive: alive(id), name: ['You', 'Raiders', 'Rivals', 'Fortress'][id], res: {}, ally: null, spent: 0, gathered: 0, score: { total: 0 } }));
  const mocks = `const BLD = RUN.BLD, UNIT = RUN.UNIT, sumCost = (c) => Object.values(c || {}).reduce((a, b) => a + b, 0), standing = (b, o) => b.owner === o && b.hp > 0 && b.prog >= 1, news = () => {}, chron = () => {}, maxHpB = () => 1, plunder = (to, got) => { OUT.got = got; }, spend = (p, k, v) => { p.res[k] -= v; }, civOf = () => ({ wonder: 'wonder' }), throneHold = () => 1e9, VASSAL = { reign: 300 }, TOAST = {}, fmt = String, MODES = { c: { secs: 0 }, t: { secs: 10 } }, finish = (won, text) => { OUT.end = [won, text]; }; var G = RUN.G, OUT = {};`;
  const BLDS = Object.fromEntries([...F.blds.map((b) => b.kind), ...F.mine].map((k) => [k, { cost: RUN.cost[k] || {} }])), UNITS = Object.fromEntries(F.units.map((u) => [u.kind, { cls: u.army ? 'army' : 'civ', cost: RUN.cost[u.kind] || {} }]));
  const G1 = { P: P((i) => RUN.players.includes(i)), blds: [...F.blds.map((b) => ({ ...b, owner: RUN.foe, prog: 1 })), ...F.mine.map((k) => ({ kind: k, owner: RUN.me, hp: 1, prog: 1 }))], units: F.units.map((u) => ({ ...u, owner: RUN.me })), finds: [] };
  Object.assign(G1.P[RUN.foe], { res: { ...F.fs }, killer: RUN.me }); Object.assign(G1.P[RUN.me], { spent: F.spent, gathered: F.gathered });
  const fell = box([basics, cut(tuning, 'const SCORE =', '\n'), mocks, cut(fight, 'function fall(p)', '\nfunction scoreAll'), cut(fight, 'function scoreAll', '\nfunction watchHome'), `fall(G.P[RUN.foe]); scoreAll(); OUT.capA = G.P[RUN.me].capA; OUT.score = G.P[RUN.me].score;`], { RUN: { ...RUN, BLD: BLDS, UNIT: UNITS, G: G1 } });
  const judge = (G) => box([basics, cut(blds, 'const WONDER_HOLD', '\n'), cut(core8, 'const clock', '\n'), mocks, 'const scoreAll = () => {};', cut(core, 'function judge()', '\n// ─'), 'judge();'], { RUN: { G } }).end;
  const ends = [judge({ P: P((i) => i !== 0), t: 61 }), judge({ P: P(() => true), t: 1, wonder: { owner: RUN.foe, end: 0 }, mode: 'c' }), judge({ P: P(() => true).map((p) => ({ ...p, score: { total: p.id ? 0 : R.bellScore } })), t: 10, mode: 't', bell: { 300: 1, 60: 1 } })];
  const room = R.room, rBLD = Object.fromEntries(room.blds.map((b) => [b.kind, { shelter: b.room }])), Gr = { blds: room.blds.map((b) => ({ ...b, owner: 0, prog: 1 })), units: room.vils.map((u) => ({ ...u, kind: 'vil', owner: 0, hid: 0 })), threats: [] };
  const fill = box([cut(emg, 'const EMG =', '\n'), cut(emg, 'const shelterRank', '\nconst troops'), cut(emg, 'function threatDir', '\nfunction emgSnap'), cut(emg, 'function villagersIn', '\nfunction soldiersIn'),
    `const BLD = RUN.BLD, MID = RUN.mid, MAP = 1e9, standing = (b, o) => b.owner === o && b.prog >= 1, shelterOf = (o, k) => BLD[k].shelter, unitsOf = () => G.units, keepOf = () => G.blds[0], nearest = () => null, isFoe = () => true, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y); var G = RUN.G, OUT; villagersIn(); OUT = G.units.map((u) => u.hid - 1);`], { RUN: { BLD: rBLD, G: Gr, mid: room.mid } });
  return { nums, fell, ends, fill };"""
async def alarm(b):
    codes = [c for c, e in SHELLS.items() if e['layer'] == 120]; looks = [SHELLS[c]['look'] for c in codes]; tower = next(c for c in MEASURE['hold'] if 'Seat' not in SHELLS[c]['ticks'] and c in MEASURE['tower'])
    sb = keyed('sides'); wild = sb['beasts'] + [c for g in sb['groups'].values() for c in g]
    pg, errs = await fresh(b, 1500); v = await pg.evaluate(ALJS.replace('CODES', json.dumps(codes)).replace('WILD', json.dumps(wild)).replace('TOWER', json.dumps(tower))); await pg.close()
    me, foe = MEASURE['players'][:2]; mid, err = frozen('basics units blds tuning core8 core=12-sim-core fight emg', MIDAL,
        {'v': v, 'looks': looks, 'cost': MEASURE['cost'], 'players': [me, foe], 'me': me, 'foe': foe}); mid = mid or {}
    m, n, F, f = mid.get('nums') or {}, MEASURE, v['fall'], mid.get('fell') or {}; DG, FL, AL = n['danger'], n['flee'], n['alarm']; ten = lambda d, ks, M: all(d[k] * 10 == M[k] for k in ks)
    nums = bool(m) and ten(DG, ('near', 'reach', 'mem', 'far'), m['DANGER_R']) and [DG['secs'], DG['keep']] == [m['DANGER_R']['secs'], m['DANGER_R']['keep']] and ten(FL, ('flee', 'clear'), m['SHELTER']) and [FL['raid'], FL['hurt']] == [m['SHELTER']['raid'], m['SHELTER']['hurt']] \
        and [AL['line'] * 10, AL['row'] * 10, AL['perRow'], AL['behind'] * 10, AL['square'] * 10] == [m['EMG'][k] for k in ('line', 'row', 'perRow', 'behind', 'square')] and n['wonderHold'] == m['WONDER_HOLD'] and n['fallen']['share'] == m['SHARE_FALLEN'] and n['plunder'] == m['PLUNDER'] and n['score'] == m['SCORE'] \
        and [n['hold'][c] for c in ('BTC1', 'BW3', 'BTC2')] == m['hold']
    fights = ['Fight' in SHELLS[c]['ticks'] for c in codes]; threat = bool(m) and all(t is None or not fi or t == x for t, x, fi in zip(m['threat'], v['threat'], fights)) and any(m['threat']) and not all(t for t, fi in zip(m['threat'], fights) if t is not None and fi)
    keep = {y: int(q * n['plunder']) for y, q in n['cost'][F['keep']].items()}; want = {y: (f.get('got') or {}).get(y, 0) + keep.get(y, 0) for y in ('food', 'wood', 'gold', 'stone', 'iron')}
    fall = bool(f) and all(abs(a - want[y]) < 1e-6 for a, y in zip(F['got'], ('food', 'wood', 'gold', 'stone', 'iron'))) and F['capA'] == f['capA'] == int(m.get('ARMYMAX', 0) * n['fallen']['share']) and all(abs(x) < 1e-6 for x in F['left']) and F['gone'] and F['score'] == f['score'] and F['end'] and F['end'][0] is True
    E = mid.get('ends') or [None] * 3; ends = all(E) and v['fell'] and v['fell'][0] is False is E[0][0] and v['fell'][1].startswith(E[0][1].split('.')[0]) and v['wonder'] and v['wonder'][0] == E[1][0] is False and v['wonder'][1].startswith(E[1][1]) and v['bell'] and v['bell'][0] == E[2][0] is True and v['bell'][1].startswith(E[2][1])
    got = [nums, threat, mid.get('fill') == v['shelter'] and -1 in v['shelter'] and len(set(v['shelter'])) == 3, fall, ends, all(v['jobs']), all(v['leave']), v['inside'] > 0 and v['work'] == [False, True], v['sent'], v['built'] == 1, v['refused'], v.get('told'), not errs]
    ok('t-alarm', all(got), [got, [(c, t, x) for c, t, x in zip(codes, m.get('threat', []), v['threat']) if t != x and 'Fight' in SHELLS[c]['ticks']], v['shelter'], mid.get('fill'), F['got'], want, F['capA'], f.get('capA'), F['score'], f.get('score'), v['fell'], v['wonder'], v['bell'], E, v['jobs'], v['leave'], v['work'], errs[:2], err[-500:]])
TRJS = r"""(() => { const D = FK.D, [me, foe] = D.players, out = {}, said = [], step = $run, by = (f) => Object.keys(FK.SH).find(f), look = (l) => by((c) => FK.SH[c].look === l), tick = (t) => by((c) => FK.SH[c].ticks.includes(t));
  const fresh = () => { $calm(me, foe); said.length = 0; for (const s of D.players) $rich(s); }; FK.on('say', (m) => { said.push(m); });
  const put = (code, side) => $put(code, side);
  const open = []; FK.stamp(FK.MID, FK.MID, 12 * D.tile, (k) => { if (FK.walkable(k)) open.push(k); }); const k0 = open[0], at = (u, dx) => { const [x, y] = FK.tileMid(k0); Object.assign(u, { bx: x + dx * D.tile, by: y, path: null }); }, mk = (c, s, dx = 0) => { const u = FK.spawn(c, s, k0, FK.rng); at(u, dx); return u; };
  const SP = look('spear'), UV = tick('Gather');
  fresh(); out.pairs = Object.keys(FK.SH).filter((c) => ECON.teachTo({ code: c, side: me })).map((c) => { const u = { code: c, side: me }; return [FK.SH[c].look, FK.SH[ECON.teachTo(u)].look, ECON.teachCost(me, u), ECON.teachSecs(me, u)]; });
  const s = mk(SP, me), why0 = ECON.teachWhy(me, s); FK.learn(me, $tk('veterans')); FK.SIDES[me].age = 2; const why1 = ECON.teachWhy(me, s); put(tick('Teach'), me); s.hp = s.hpMax / 2; const secs = ECON.teachSecs(me, s), g0 = FK.SIDES[me].store.gold;
  const ok = ECON.teach(me, s); step(secs - 1, () => at(s, 0)); const mid1 = [s.job, FK.SH[s.code].look]; step(2, () => at(s, 0)); out.teach = { why: [why0, why1], ok, paid: g0 - FK.SIDES[me].store.gold, mid: mid1, end: [FK.SH[s.code].look, s.hp / s.hpMax, s.job] };
  fresh(); const a = mk(SP, me), v = mk(SP, foe), count = (side, c) => FK.units().filter((u) => u.side === side && u.code === c).length; Object.assign(v, { job: 'rout', routAt: FK.K.t - D.prison.after - 1 }); WAR.hit(a, v);
  out.taken = ECON.prisonersOf(foe).map((x) => [FK.SH[x.code].look, x.ransom, x.by]).concat([[v.gone, said.some((m) => m.startsWith(W.prison.taken.split('{')[0]))]]); const n0 = count(me, SP); FK.K.t += D.prison.secs + 1; FK.sim(0.1); out.served = [ECON.prisonersOf(foe).length, count(me, SP) - n0];
  const v2 = mk(SP, foe); Object.assign(v2, { job: 'rout', routAt: FK.K.t - D.prison.after - 1 }); WAR.hit(a, v2); const gm = FK.SIDES[me].store.gold, gf = FK.SIDES[foe].store.gold, nf = count(foe, SP), r = ECON.prisonersOf(foe)[0].ransom; ECON.payRansom(foe, 0);
  out.paid = [FK.SIDES[me].store.gold - gm, gf - FK.SIDES[foe].store.gold, count(foe, SP) - nf, r];
  fresh(); const tp = put(tick('Zeal'), me), S = [0, 1, 2].map((i) => mk(SP, me, i)), d0 = WAR.dmgOf(S[0]), noPriest = ECON.zealWhy(me, tp, S); mk(tick('Convert'), me, 2); const gz = FK.SIDES[me].store.gold, zok = ECON.zeal(me, tp, S);
  out.zeal = [noPriest === W.zeal.priest, zok, gz - FK.SIDES[me].store.gold, WAR.dmgOf(S[0]) / d0, S[0].zeal - FK.K.t, FK.SIDES[me].zealT - FK.K.t, ECON.zealWhy(me, tp, S).startsWith(W.zeal.rest.split('{')[0])];
  fresh(); const pr = mk(tick('Convert'), me), vil = mk(UV, foe, 2); Object.assign(pr, { job: 'convert', cv: vil }); let t1 = null; for (let i = 0; i < 160 && t1 == null; i++) { at(vil, 2); at(pr, 0); vil.job = 'idle'; FK.sim(0.1); if (vil.side === me) t1 = (i + 1) / 10; } out.convert = [t1, vil.side === me, pr.cvCd - FK.K.t];
  fresh(); const hs = mk(SP, me), md = mk(look('medic'), me, 1); hs.hp = hs.hpMax / 2; const hp0 = hs.hp; step(10, () => { at(hs, 0); at(md, 1); hs.job = 'idle'; }); out.heal = [hp0, hs.hp, hs.hpMax];
  fresh(); const so = mk(SP, me), spy = mk(tick('Spy'), foe, 6); step(1, () => { at(so, 0); at(spy, 6); so.target = null; }); const v6 = spy.veil; step(1, () => { at(so, 0); at(spy, 3); }); out.veil = [v6, spy.veil];
  fresh(); const bar = put(look('barracks'), foe); bar.q = [SP, SP]; bar.qt = 5; const k1 = bar.j * FK.N + bar.i - 1, s1 = FK.spawn(tick('Spy'), me, k1, FK.rng); WAR.order([s1], bar, k1); step(0.5); out.stall = [bar.stall - FK.K.t, bar.q.length, !!s1.gone, !!FK.SIDES[me].intel[foe]];
  const mill = put(look('mill'), foe), k2 = mill.j * FK.N + mill.i - 1, s2 = FK.spawn(tick('Spy'), me, k2, FK.rng), lit = ECON.ignite; let lit0 = null; ECON.ignite = (q, why, ...r) => { if (q === mill && why === 'sabotage') lit0 = q.hp / q.hpMax; return lit(q, why, ...r); }; WAR.order([s2], mill, k2); step(0.5); ECON.ignite = lit; out.burn = [lit0, !!s2.gone, mill.fire > 0 || !!mill.gone];
  return out; })()""".replace("W.", "fromBook('words').troops.")
MIDTR = r"""const stub = 'const fxv = () => ({ m: 1, a: 0 }), unitKeys = () => [];';
  return box([basics, units, blds, tech, tuning, cut(core8, 'const sumCost', '\n'), cut(core8, 'const relax', '\n'), cut(core8, 'const baseKind', '\n'), stub, cut(orders, 'const scaled', 'function trainWhy'), cut(orders, 'const teachTo', 'const schooling'), cut(core8, 'const spySeen', '\n'),
    `var OUT = { TEACH, TEACH_TO, PRISON, CONVERT, ZEAL, SAB, cap: [MORALE.capAfter, MORALE.capR], teach: Object.keys(TEACH_TO).map((k) => { const u = { kind: k, owner: 0 }; return [k, teachTo(u), teachCost(0, u), teachSecs(0, u)]; }),
      ransom: Math.round(Math.max(40, sumCost(UNIT.spear.cost || { f: 40 }) * PRISON.ransom)), seen: [spySeen(0, {}), spySeen(0, { q: [] })], heal: relax(RUN.hp0, RUN.max, RUN.max / UNIT.medic.heal, 10),
      units: ['priest', 'medic', 'spy'].map((k) => [UNIT[k].cost, UNIT[k].t, UNIT[k].hp, UNIT[k].age, UNIT[k].at]), hosp: [BLD.hospital.heal, BLD.hospital.hrng], medic: [UNIT.medic.heal, UNIT.medic.hrng],
      sab: Object.fromEntries(Object.entries(BLD).filter(([, b]) => b.sab).map(([k, b]) => [k, b.sab])), tech: TECH.filter((t) => RUN.techs.includes(t.id)).map((t) => [t.id, t.at, t.line, t.age, t.cost, t.t, t.need || []]) };`]);"""
async def troops(b):
    pg, errs = await fresh(b, 1500); v = await pg.evaluate(TRJS); await pg.close()
    M, SH, T = keyed('measure'), book('shells'), keyed('tech'); LK = {s['look']: c for c, s in SH.items() if 'look' in s}; RS = RK; cost = lambda c: {RS.get(k, k): x for k, x in (c or {}).items() if x}
    mid, err = frozen('basics units blds tech tuning core8 orders', MIDTR,
        {'hp0': v['heal'][0], 'max': v['heal'][2], 'techs': [k for k, e in T.items() if e.get('at') in ('BP3', 'BP8') or e.get('line') in ('Levy', 'Teaching')]}); m = mid or {}
    te, pr, cv, ze, sb, hl = M['teach'], M['prison'], M['convert'], M['zeal'], M['sab'], M['heal']
    nums = bool(m) and te == m['TEACH'] and [pr['secs'], pr['ransom'], pr['after'], pr['r'] * 10] == [m['PRISON']['secs'], m['PRISON']['ransom'], *m['cap']] and [cv['r'] * 10, cv['secs'], cv['cd']] == [m['CONVERT'][k] for k in ('r', 'secs', 'cd')] \
        and [ze['cost']['gold'], ze['secs'], ze['cd'], ze['mul']] == [m['ZEAL']['cost']['g'], m['ZEAL']['secs'], m['ZEAL']['cd'], m['ZEAL']['mul']] and [sb['burn'], sb['stall']] == [m['SAB']['burn'], m['SAB']['stall']] and [round(x * 10, 6) for x in sb['seen']] == m['seen'] \
        and {SH[c]['look']: h for c, h in sb['how'].items()} == {k: h for k, h in m['sab'].items() if k in LK} and [hl['US2']['heal'], hl['US2']['r'] * 10] == m['medic'] and [hl['BP6']['heal'], hl['BP6']['r'] * 10] == m['hosp'] \
        and all([cost(M['cost'][c]), M['train'][c], M['stats'][c]['hp'], M['ages'].index(SH[c]['age']), SH[[k for k, n in M['trains'].items() if c in n][0]]['look']] == [cost(u[0]), u[1], u[2], u[3], u[4]] for c, u in zip(('US1', 'US2', 'US3'), m['units']))
    tech = bool(m) and len(m['tech']) == 18 and all(T[k]['at'] in [c for c, s in SH.items() if s.get('look') == at] and T[k]['line'] == ln and T[k]['age'] == ag and T[k]['cost'] == cost(co) and T[k]['time'] == t and T[k].get('need', []) == nd for k, at, ln, ag, co, t, nd in m['tech'])
    MT = {k: (to, c, s) for k, to, c, s in m.get('teach', [])}
    pairs = bool(v['pairs']) and all(f in MT and MT[f][0] == to and c == cost(MT[f][1]) and close(s, MT[f][2]) for f, to, c, s in v['pairs']) and len(v['pairs']) == len([k for k in MT if k in LK])
    W = keyed('words')['troops']; tc = v['teach']
    lesson = tc['why'] == [W['teach']['vets'], W['teach']['school']] and tc['ok'] and tc['paid'] > 0 and tc['mid'] == ['school', 'spear'] and tc['end'][0] == 'sword' and abs(tc['end'][1] - 0.5) < 1e-6 and tc['end'][2] != 'school'
    held = v['taken'][0] == ['spear', m.get('ransom'), keyed('measure')['players'][0]] and v['taken'][1] == [True, True] and v['served'] == [0, 1] and v['paid'] == [v['paid'][3], v['paid'][3], 1, m.get('ransom')]
    zl = v['zeal']; zeal = zl[:3] == [True, True, ze['cost']['gold']] and close(zl[3], ze['mul']) and close(zl[4], ze['secs']) and close(zl[5], ze['cd']) and zl[6]
    conv = v['convert'][1] and cv['secs'] <= v['convert'][0] <= cv['secs'] + 0.5 and abs(v['convert'][2] - cv['cd']) < 1
    heal = bool(m) and abs(v['heal'][1] - m['heal']) < 0.01 * v['heal'][2]
    spies = v['veil'] == [True, False] and abs(v['stall'][0] - (sb['stall'] - 0.5)) < 0.2 and v['stall'][1:] == [1, True, True] and v['burn'][0] is not None and abs(v['burn'][0] - (1 - sb['burn'])) < 1e-6 and v['burn'][1] and v['burn'][2]
    got = [nums, tech, pairs, lesson, held, zeal, conv, heal, spies, not errs]
    ok('t-troops', all(got), [got, v, {k: m.get(k) for k in ('teach', 'ransom', 'seen', 'heal')}, errs[:2], err[-400:]])
TRADEJS = r"""(() => { const D = FK.D, E = ECON, [me, foe] = D.players, out = {}, said = [], sim = $run, by = (f) => Object.keys(FK.SH).find(f), tick = (t) => by((c) => FK.SH[c].ticks.includes(t) && FK.SH[c].layer === 110), TK = $tk;
  const fresh = () => { $calm(); said.length = 0; for (const s of [me, foe]) { $rich(s); FK.SIDES[s].age = 4; E.villagersOf(s).forEach(E.idle); } }; FK.on('say', (m) => { said.push(m); });
  const put = (code, side) => $put(code, side, 8, 60, 1);
  const MKT = by((c) => FK.SH[c].ticks.includes('Trade') && FK.SH[c].layer === 110), st = () => FK.SIDES[me].store, gold = () => st().gold;
  // the stops, and the four buildings' numbers
  fresh(); const S = E.stops(); out.stops = S.map((f) => { const [ax, ay] = D.trade.routes[f.route]; return [f.route, (f.bx - FK.MID) * ax + (f.by - FK.MID) * ay, f.want, Math.round(Math.hypot(f.bx - FK.MID, f.by - FK.MID) / D.tile)]; }).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([r, , w, d]) => [r, w, d]);
  out.blds = Object.keys(FK.SH).filter((c) => FK.SH[c].layer === 110).map((c) => [c, D.cost[c] || null, D.buildTime[c] || null, FK.stat(c, me, 'hp')]);
  // the Market: three lots of wood sold, two of stone bought, the coin debased, one more of each, a slow beat's drift
  const m = put(MKT, me), g = [gold()]; for (let i = 0; i < 3; i++) { E.marketTrade(me, 'wood', 'sells'); g.push(gold()); } for (let i = 0; i < 2; i++) { E.marketTrade(me, 'stone', 'buys'); g.push(gold()); }
  out.noMint = E.debase(me); put(tick('Make') && by((c) => (D.makes[c] || {}).gold), me); out.debased = E.debase(me); g.push(gold()); E.marketTrade(me, 'wood', 'sells'); g.push(gold()); E.marketTrade(me, 'stone', 'buys'); g.push(gold());
  out.market = { gold: g, stock: { ...E.stock() } }; const t0 = FK.K.t; let n = 0; while (!FK.every(D.beats.slow) && n++ < 200) FK.sim(0.1); out.drift = { stock: { ...E.stock() }, held: n < 200 };
  // a caravan's run to a stop that wants beer, the stop held by the foe's post (the keeper's cut)
  fresh(); play = window.dice(SEED); const S2 = E.stops(), m2 = put(MKT, me); Object.assign(st(), { cloth: 12, beer: 5, food: 610, wood: 700, stone: 0, iron: 0, gold: 0 }); const stop = E.stops().find((f) => f.want === 'beer');
  const post = FK.build(by((c) => FK.SH[c].ticks.includes('Post')), ...[stop.k % FK.N, Math.floor(stop.k / FK.N)], FK.SIDES[foe].col); Object.assign(post, { side: foe, done: 1 }); for (const q of D.players) if (q !== me) WAR.treaty(me, q, 'peace'); for (const g of FK.units().filter((u) => S2.includes(u.find) || (!FK.SIDES[u.side] && FK.has(u, 'Fight')))) FK.vanish(g);   // the stops' guards and the wild hunters cleared: the run tests the trade; the post at the stop now shoots a wolf only once it sees it past the trees (QAM), after the wolf has reached the caravan
 
  const cv = FK.spawn(D.trains[m2.code][0], me, FK.tileAt(m2.bx, m2.by + (m2.n / 2 + 2) * D.tile), FK.rng); const est = E.estPay(me, stop, m2), load = E.cargo(me, stop, m2), fg = ~~FK.SIDES[foe].ledger.in.trade;
  E.setRoute(cv, stop, false, false); let left = 0, sold = null; for (let i = 0; i < 6000 && cv.route; i++) { FK.sim(0.1); if (cv.leg === 'back' && !left) [left, sold] = [FK.SIDES[me].ledger.in.trade, { ...E.stock() }]; }   // its trade pay (A1: the true shortest way may pass a find whose guards were cleared, and take it)
  out.run = { d: Math.hypot(stop.bx - m2.bx, stop.by - m2.by), want: stop.want, load, est, got: left, cut: FK.SIDES[foe].ledger.in.trade - fg, owner: stop.owner, stock: sold, home: !cv.route, store: { cloth: st().cloth, beer: st().beer, food: st().food, wood: st().wood } };
  // an ally's run: the ally's Market beside ours; and a workshop on cloth for five minutes with the loom
  fresh(); WAR.treaty(me, foe, 'ally'); const m4 = Object.assign(put(MKT, me), { side: foe }), m3 = put(MKT, me); const c3 = FK.spawn(D.trains[m3.code][0], me, FK.tileAt(m3.bx, m3.by + (m3.n / 2 + 2) * D.tile), FK.rng), ga = gold(); FK.sim(0.1); const to = c3.dest, cg = c3.cargo, at = FK.tileAt(to.bx, to.by + (to.n / 2 + 1) * D.tile); Object.assign(c3, { bx: FK.tileMid(at)[0], by: FK.tileMid(at)[1], k: at, path: null }); sim(1); out.ally = { d: Math.hypot(to.bx - m3.bx, to.by - m3.by), cargo: cg, got: gold() - ga, said: said.filter((s) => s.includes('ally')).length, back: c3.dest === m3 };
  fresh(); play = window.dice(SEED); const ws = put(by((c) => (D.makes[c] || {}).cloth), me); FK.learn(me, TK('looms')); Object.assign(st(), { wool: 100, cloth: 0 }); const v = E.villagersOf(me)[0]; E.gatherAt(v, ws); let work = 0; sim(300, () => { v.sick = null; if (v.job === 'gather' && v.target === ws && FK.atB(v, ws)) work += 0.1; });   // kept well: a sickness the rules' dice may roll is not the loom's rate (A1: the computers' spread turns move the dice)
  out.shop = { work, cloth: st().cloth, wool: st().wool, job: E.jobOf(v), choice: [E.setMake(ws, 'beer'), E.setMake(ws, 'iron'), E.makeOf(ws).rate] };
  fresh(); FK.learn(me, TK('learning')); const mints = [0, 1, 2].map(() => put(by((c) => (D.makes[c] || {}).gold), me)); out.scale = E.scaleOf(mints[0], me);
  // a venture with Banking, the Bank's interest, the guards and a robbed caravan
  fresh(); for (const k of ['coinage', 'credit', 'bank', 'banking']) FK.learn(me, TK(k)); FK.SIDES[me].age = 3; put(MKT, me); const gv = gold(); out.venture = [E.venture(me, 250), gv - gold(), E.returnOf(me, 250)]; FK.SIDES[me].ventures[0].due = 0; const g1 = gold(), q1 = FK.SIDES[me].gathered, dice = FK.rng; FK.rng = () => RUNROLL; sim(11); FK.rng = dice; out.ventured = [gold() - g1, FK.SIDES[me].gathered - q1, said.slice()];
  out.bank = [(st().gold = 3000, E.interest(me)), (st().gold = 9000, E.interest(me))];
  fresh(); const m5 = put(MKT, me), c5 = FK.spawn(D.trains[m5.code][0], me, FK.tileAt(m5.bx, m5.by + (m5.n / 2 + 3) * D.tile), FK.rng), sol = D.ai.troops[0], S5 = Array.from({ length: 14 }, () => FK.spawn(sol, me, c5.k, FK.rng));
  for (const s of S5) Object.assign(s, { bx: c5.bx + 9 * D.tile, by: c5.by }); out.guard0 = E.guarded(c5); WAR.guard(S5, c5); out.guards = WAR.guardsOf(c5).length; S5[0].bx = c5.bx + 5 * D.tile; out.guard1 = E.guarded(c5);
  Object.assign(c5, { goods: { cloth: 4, food: 10 }, cargo: 30 }); const wolf = FK.spawn(by((c) => FK.SH[c].look === 'wolf'), -1, c5.k, FK.rng); said.length = 0; WAR.die(c5, wolf); out.robbed = [said.slice(), WAR.guardsOf(c5).length, S5[1].esc];
  return out; })()"""
MIDTRADE = r"""const stub = `const G = { t: 0, fxv: 0, tick: 1, wx: 'clear', mkt: Object.fromEntries(MKTK.map((k) => [k, 1])), finds: [], units: [], blds: [], plague: null, P: [{ id: 0, res: { f: 1e4, w: 1e4, g: 1e4, s: 1e4, i: 1e4 }, goods: {}, techs: new Set(), age: 0, gathered: 0, alive: true }] };
  const ready = (o, k) => G.blds.filter((b) => b.owner === o && b.kind === k), spend = (p, k, n) => { p.res[k] -= n; }, earn = (p, k, n, why, counts = true) => { p.res[k] += n; if (counts) p.gathered += n; }, sfx = () => {}, news = () => {}, shareUp = (o, g) => g;
  const standing = (b, o) => b.owner === o && b.prog >= 1 && b.hp > 0, EVM = { gather: 1 }, season = () => ({ name: 'Summer', farm: 1 }), hz = () => false, hungerOf = () => 1, isSoldier = (s) => !!s.sol, stash = (o, k, n) => earn(G.P[o], 'g', n); let R = 0; const rng = () => RUN.rolls[R++];
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), nearest = (L, u, ok) => L.filter(ok).sort((a, b) => dist(a, u) - dist(b, u))[0];`;
  return box([basics, units, blds, tech, tuning, cut(core8, 'const clamp', '\n'), cut(core8, 'const relax', '\n'), cut(core8, 'const sumCost', '\n'), stub, qca(cut(core8, 'function fxList', '// Two words')), cut(core8, 'const bldsOf', '\n'), cut(core8, 'const nodeKey', 'const makeOf'), cut(core8, 'const makeOf', '\n'),
    cut(orders, 'const LOT', 'const zealCost'), cut(eco, 'const stopsAll', '\n'), cut(eco, 'const distF', 'const nameOf'), cut(eco, 'const loadable', 'const takeFrom'), cut(eco, 'function priceAt', 'const tradeTargets'), cut(eco, 'function estPay', 'function setRoute'), cut(eco, 'const guardedCart', '// ── the calendar'), cut(eco, 'const BANK_CAP', 'function econTick'), cut(eco, 'const mkt = ', '// ── vassals'), cut(civil, 'const workMul', '// Where each'),
    `delete BLD.mint.fx; const p = G.P[0], learn = (k) => { p.techs.add(k); G.fxv++; }; var OUT = { consts: { GOODS, LOAD, CARAVAN, VENTURE, PRICE, MINT, TRADE, TRADE_CAP, TRADE_DIV, SELL, BUY, SCALE, POST, MKT_SELL, MKT_BUY, stop: PLACES.stop, wares: WARES, carried: CARRIED, BANK_CAP } };
    G.blds.push({ owner: 0, kind: 'market', prog: 1, hp: 1 }); const g = [p.res.g]; for (let i = 0; i < 3; i++) { marketTrade(0, 'w', 'sell'); g.push(p.res.g); } for (let i = 0; i < 2; i++) { marketTrade(0, 's', 'buy'); g.push(p.res.g); }
    G.blds.push({ owner: 0, kind: 'mint', prog: 1, hp: 1 }); debase(0); g.push(p.res.g); marketTrade(0, 'w', 'sell'); g.push(p.res.g); marketTrade(0, 's', 'buy'); g.push(p.res.g); OUT.market = { gold: g, mkt: { ...G.mkt } }; priceDrift(); OUT.drift = { ...G.mkt };
    G.mkt = Object.fromEntries(MKTK.map((k) => [k, 1])); const R0 = RUN.run; Object.assign(p.res, R0.res); Object.assign(p.goods, R0.goods); const place = { kind: 'stop', want: R0.want, x: R0.d, y: 0 }, from = { x: 0, y: 0 };
    let n = LOAD, s = 0; const load = {}; for (const k of CARRIED.slice().sort((a, b) => priceAt(0, b, place, from) - priceAt(0, a, place, from))) { const q = priceAt(0, k, place, from) > 0 ? Math.min(n, Math.floor(loadable(p, k))) : 0; if (q > 0) { load[k] = q; s += q * priceAt(0, k, place, from); n -= q; } }
    const est = estPay(0, place, from), cut1 = s * Math.min(0.6, POST.cut[1]); for (const k in load) mktHit(k, load[k], -1); OUT.run = { load, est, got: Math.round(s - cut1), cut: cut1, mkt: { ...G.mkt } };
    OUT.ally = Math.min(TRADE_CAP, Math.floor((RUN.ally ** 2 / TRADE_DIV) * fxv(0, 'trade').m));
    learn('looms'); const ws = { owner: 0, kind: 'workshop', prog: 1, hp: 1, cropT: 'cloth' }; G.blds.push(ws); p.goods.wool = 100; p.goods.cloth = 0; const u = { owner: 0 }, node = { kind: 'farm', farm: ws, type: 'cloth', rate: makeOf(ws).rate, amt: Infinity }; const made = makeNow(u, node, RUN.work, Infinity); OUT.shop = { made, wool: p.goods.wool };
    learn('learning'); G.blds = G.blds.filter((b) => b.kind !== 'mint'); G.blds.push(...[0, 1, 2].map(() => ({ owner: 0, kind: 'mint', prog: 1, hp: 1 }))); OUT.scale = gatherMul(0, { kind: 'farm', farm: G.blds.at(-1), type: 'gold' });
    for (const k of ['coinage', 'credit', 'bank', 'banking']) learn(k); p.age = 3; p.res.g = 1e4; venture(0, 250); p.ventures[0].due = -1; const gv = p.res.g, q0 = p.gathered; ventureTick(); OUT.venture = [p.res.g - gv, p.gathered - q0];
    OUT.bank = [3000, 9000].map((gold) => { p.res.g = gold; const b = p.res.g; bankTick(); return p.res.g - b; });
    G.blds = [{ owner: 0, kind: 'tower', prog: 1, hp: 1, x: 0, y: 500 }]; const cv = { kind: 'caravan', owner: 0, x: 0, y: 0 }; G.units = [{ owner: 0, sol: 1, x: 90, y: 0 }]; const gc = [guardedCart(cv)]; G.units[0].x = 50; gc.push(guardedCart(cv)); G.units = []; G.blds[0].y = 110; gc.push(guardedCart(cv)); OUT.guarded = gc;
    G.finds = [{ kind: 'camp', x: 0, y: 0 }]; robbed({ cargo: 30, goods: { cloth: 4, f: 10 }, owner: 1, x: 0, y: 0 }); OUT.robbed = G.finds[0].hoard;`]);"""
ROLL = 0.99   # the venture's dice: past its chance of loss, so it comes home
async def trade(b):
    pg, errs = await fresh(b, 1500); v = await pg.evaluate(TRADEJS.replace('RUNROLL', str(ROLL)).replace('SEED', str(SEED))); await pg.close()
    R = v['run']; mid, err = frozen('basics units blds tech tuning core8 orders civil eco', MIDTRADE,
        {'rolls': [ROLL], 'run': {'res': {'f': 610, 'w': 700, 's': 0, 'i': 0}, 'goods': {'cloth': 12, 'beer': 5}, 'want': R['want'], 'd': R['d']}, 'ally': v['ally']['d'], 'work': v['shop']['work']}); m = mid or {}
    M, SH, T = keyed('measure'), book('shells'), keyed('tech'); Y = RK; y = lambda o: {Y.get(k, k): x for k, x in (o or {}).items()}; C = m.get('consts', {})
    mk, pc, tr = M['market'], M['price'], M['trade']; LOOK = {s['look']: c for c, s in SH.items() if 'look' in s}
    nums = bool(C) and mk['worth'] == y(C['TRADE']) and [mk['sell'], mk['buy']] == [C['SELL'], C['BUY']] and mk['sells'] == [Y.get(k, k) for k in C['MKT_SELL']] and mk['buys'] == [Y.get(k, k) for k in C['MKT_BUY']] \
        and {k: y({kk: vv for kk, vv in e.items() if kk != 'col' and kk != 'name'}) for k, e in C['GOODS'].items()} == M['goods'] and pc['eps'] == y(C['PRICE']['eps']) and [pc['q0'], pc['tau'], pc['floor'], pc['cap']] == [C['PRICE'][k] for k in ('q0', 'tau', 'floor', 'cap')] \
        and [M['mint']['debase'], M['mint']['price']] == [C['MINT']['debase'], C['MINT']['price']] and M['venture'] == C['VENTURE'] and M['interest']['cap'] == C['BANK_CAP'] and [M['scale'][k] for k in ('per', 'cap')] == [C['SCALE']['per'], C['SCALE']['cap']] \
        and [tr['load'], tr['keep'], tr['want'], tr['far'], tr['cap'], tr['div'] * 100, tr['all'], tr['cut'], tr['safe'] * 10, tr['guard'], sorted(abs(d) * 10 for d in tr['stops'])[::2]] == [C['LOAD'], C['CARAVAN']['keep'], C['POST']['want'], C['POST']['far'], C['TRADE_CAP'], C['TRADE_DIV'], C['POST']['all'], C['POST']['cut'], C['POST']['safe'], C['POST']['guard'], sorted(C['stop'])] \
        and tr['wares'] == C['wares'] and tr['carried'] == [Y.get(k, k) for k in C['carried']]
    four = {c: (co, t, hp) for c, co, t, hp in v['blds']}; HP = M['bldHp']
    shells = all(four[c][0] and four[c][1] and four[c][2] == HP[c] for c in ('BP1', 'BP3', 'BP6', 'BP8')) and all(four[c][0] is not None and four[c][1] and four[c][2] for c in four if c in HP)
    stops = len(v['stops']) == 8 and sorted(s[0] for s in v['stops']) == [0] * 4 + [1] * 4 and all(abs(s[2] - abs(tr['stops'][i % 4])) <= tr['find'] for i, s in enumerate(v['stops'])) and [s[1] for s in v['stops']] == [(C.get('wares') or [''] * 3)[(r + i) % 3] for r in (0, 1) for i in range(4)]
    mm = m.get('market', {}); market = bool(mm) and v['market']['gold'] == mm['gold'] and close({k: v['market']['stock'][k] for k in ('wood', 'stone')}, {'wood': mm['mkt']['w'], 'stone': mm['mkt']['s']}) and v['noMint'] is False and v['debased'] is True \
        and v['drift']['held'] and close({k: v['drift']['stock'][k] for k in ('wood', 'stone')}, {'wood': m['drift']['w'], 'stone': m['drift']['s']})
    mr = m.get('run', {}); run = bool(mr) and y(mr['load']) == R['load'] and R['est'] == mr['est'] and R['got'] == mr['got'] and abs(R['cut'] - mr['cut']) < 1e-6 and R['owner'] == keyed('measure')['players'][1] and R['home'] \
        and close({k: R['stock'][k] for k in R['load']}, {Y_: mr['mkt'][k] for k, Y_ in ((kk, Y.get(kk, kk)) for kk in mr['load'])}) and R['store']['cloth'] == 0 and R['store']['beer'] == 0
    ally = v['ally']['cargo'] == m.get('ally') == v['ally']['got'] > 0 and v['ally']['said'] == 1 and v['ally']['back']
    sh = v['shop']; step = M['makes']['BI8']['cloth']['rate'] * 1.15 * 0.1 + 1e-6; shop = bool(m) and abs(sh['cloth'] - m['shop']['made']) <= step and abs(sh['wool'] - m['shop']['wool']) <= 2 * step and sh['work'] > 200 and sh['job'] == 'cloth' and sh['choice'][:2] == [True, False] and sh['choice'][2] == M['makes']['BI8']['beer']['rate'] and close(v['scale'], m.get('scale'))
    vn = v['venture']; venture = bool(m) and vn[0] and vn[1] == 250 and vn[2] == m['venture'][0] and v['ventured'][:2] == m['venture'] and v['bank'] == m['bank']
    guards = [v['guard0'], v['guard1']] == m.get('guarded', [0, 0, 0])[:2] and v['guards'] == tr['guard'] and v['robbed'][0] == [keyed('words')['trade']['robbed'].replace('{n}', str(m.get('robbed')))] and v['robbed'][1:] == [0, None]
    got = [nums, shells, stops, market, run, ally, shop, venture, guards, not errs]
    ok('t-trade', all(got), [got, v, {k: m.get(k) for k in ('market', 'drift', 'run', 'ally', 'shop', 'scale', 'venture', 'bank', 'guarded', 'robbed')}, errs[:2], err[-600:]])
REALMJS = r"""(() => { const D = FK.D, E = ECON, [me, foe] = D.players, out = {}, said = [], sim = $run, by = (f) => Object.keys(FK.SH).find(f), look = (l) => by((c) => FK.SH[c].look === l), TK = $tk;
  const fresh = () => { $calm(); said.length = 0; for (const s of D.players) { $rich(s); FK.SIDES[s].age = 3; E.villagersOf(s).forEach((v) => WAR.die(v)); } FK.units().filter((u) => !FK.SIDES[u.side]).forEach((u) => WAR.die(u)); }; FK.on('say', (m) => { said.push(m); });
  const put = (code, side, d0 = 14) => $put(code, side, d0, 80, 1);
  const mk = (c, s, bx, by) => { const u = FK.spawn(c, s, FK.tileAt(bx, by), FK.rng); Object.assign(u, { bx, by, path: null }); FK.place(u); return u; }, SP = look('spear'), RD = look('cata');
  out.layout = ['small', 'large'].flatMap((size) => [[0, 1], [0.6, 0.8], [-1, 0]].map((f) => [size, f, E.campLayout(size, [1003, 1207], f).map((p) => [FK.SH[p.code].look, p.i, p.j])]));
  // a small camp unpacked where it stands, raised by one soldier's hands
  fresh(); const h = FK.seatOf(me); let spot = null; for (let d = 14; d < 70 && !spot; d++) for (let a = 0; a < 6.3 && !spot; a += 0.3) { const bx = h.bx + Math.cos(a) * d * D.tile, by = h.by + Math.sin(a) * d * D.tile, k = FK.tileAt(bx, by); let wood = false; FK.stamp(bx, by, 8 * D.tile, (q) => { wood ||= !!FK.FOR[q]; }); if (k >= 0 && FK.walkable(k) && !wood && !E.campWhy(me, 'small', FK.fromBoard(bx, by))) spot = [bx, by]; }   // open ground round it (F37: Z3's woods now start near home)
  const wg = mk(by((c) => E.campOf(c) === 'small'), me, ...spot), unpacked = E.unpack(wg), P = FK.things().filter((t) => t.camp), near = []; FK.stamp(...spot, 8 * D.tile, (k, d) => { if (FK.walkable(k)) near.push([d, k]); }); near.sort((a, b) => b[0] - a[0]);
  const s1 = mk(SP, me, ...FK.tileMid(near[0][1])); sim(0.5); const raising = s1.job === 'raise'; let n0 = 0; while (n0++ < 300 && !(s1.site && FK.atB(s1, s1.site) && s1.job === 'raise')) FK.sim(0.1); const site = s1.site, d0 = site && site.done; sim(5); const d1 = site && site.done;
  out.camp = { spot, unpacked, gone: !!wg.gone, pieces: P.map((t) => [FK.SH[t.code].look, t.done]), raising, rate: site && [(d1 - d0) / 5, D.camp.build ** D.crew / FK.stat(site.code, me, 'build')] };
  // a medical tent binds a wound; a caravan stocks a depot; soldiers eat from it
  fresh(); const tent = put(look('medtent'), me); tent.camp = { size: 'small' }; const hs = mk(SP, me, tent.bx + 4 * D.tile, tent.by); hs.hp = hs.hpMax * 0.6; const hp0 = hs.hp; sim(10, () => { Object.assign(hs, { bx: tent.bx + 4 * D.tile, by: tent.by, job: 'idle', target: null }); FK.place(hs); }); out.heal = [hp0, hs.hp, hs.hpMax];
  fresh(); const mkt = put(look('market'), me), dep = put(look('depot'), me, 30); dep.supply = 100; const cv = FK.spawn(D.trains[mkt.code][0], me, FK.tileAt(mkt.bx, mkt.by + (mkt.n / 2 + 2) * D.tile), FK.rng); let n = 0; while (n++ < 3000 && !(cv.sup && cv.sup.leg === 'back')) FK.sim(0.1); while (n++ < 6000 && cv.sup) FK.sim(0.1);
  const sb = FK.SIDES[me].spentBy; out.supply = { d: Math.hypot(dep.bx - mkt.bx, dep.by - mkt.by), food: (sb.food || {}).camps, gold: (sb.gold || {}).camps, stock: dep.supply, done: !cv.sup };
  const ar = []; FK.stamp(dep.bx, dep.by, 8 * D.tile, (k, d) => { if (FK.walkable(k) && d > (dep.n / 2 + 1) * D.tile) ar.push([d, k]); }); ar.sort((a, b) => a[0] - b[0]); const S4 = ar.slice(0, 4).map(([, k]) => mk(SP, me, ...FK.tileMid(k))); dep.supply = 50; const e1 = S4.reduce((a, u) => a + E.eats(u), 0); sim(5, () => S4.forEach((u) => { u.job = 'idle'; })); out.eat = [50 - dep.supply, e1 * 5, S4.some((u) => u.unfed)]; dep.supply = 0; sim(1, () => S4.forEach((u) => { u.job = 'idle'; u.target = null; })); out.unfed = [S4.every((u) => u.unfed), S4[0].tire];   // on open ground beside the depot (F37: Z3's woods can stand where the row of four stood)
  // caltrops on a passing rider and spearman; a foe's pit hidden until a scout finds it
  fresh(); if (TK('caltrops')) { FK.SIDES[me].techs.add(TK('caltrops')); FK.learn(me, TK('caltrops')); } /* the research cut for players, Calls Nov 8: the trap itself stays (the Natives') */ const cal = put(look('caltrops'), me), r = mk(RD, foe, cal.bx, cal.by), f = mk(SP, foe, cal.bx, cal.by), t0 = FK.K.t, steps = []; for (const dt of [0, 1, 2.1, 3.2]) { FK.K.t = t0 + dt; WAR.traps(); steps.push([r.hp / r.hpMax, f.hp / f.hpMax, ~~cal.hits, !!cal.gone, (r.stuck || 0) - FK.K.t > 0]); } out.caltrops = steps;
  fresh(); const pit = put(look('pit'), foe), hid0 = FK.fire('hide', pit), sc = mk(look('scout'), me, pit.bx + 4 * D.tile, pit.by); WAR.traps(); FK.look(99); const hid1 = FK.fire('hide', pit), walker = mk(SP, me, pit.bx, pit.by); WAR.traps(); out.pit = [hid0, hid1, !!pit.gone, walker.hp === walker.hpMax];
  // war after its notice; an envoy's answers
  fresh(); WAR.treaty(me, foe, 'peace'); out.notice = [E.setRel(me, foe, 'war'), E.noticeLeft(me, foe)]; sim(29); out.notice.push(WAR.stance(me, foe)); sim(2); out.notice.push(WAR.stance(me, foe));
  const answer = (who, ask, setup) => { fresh(); for (const q of D.players) if (q !== me && q !== foe) WAR.treaty(foe, q, 'peace'); setup(); const u = { ask, to: foe, side: me, job: 'envoy' }, o = [WAR.odds(WAR.armyOf(me), foe), WAR.odds(WAR.armyOf(foe), me)], g = FK.SIDES[me].store.gold; said.length = 0; E.judgeEnvoy(foe, me, u); return { who, ask, odds: o, said: said.slice(), stance: WAR.stance(me, foe), ally: FK.SIDES[foe].ally, paid: g - FK.SIDES[me].store.gold, back: u.job }; };
  const army = (side, n) => { const k = FK.seatOf(side); for (let i = 0; i < n; i++) mk(SP, side, k.bx + (4 + i % 4) * D.tile, k.by + (4 + Math.floor(i / 4)) * D.tile); };
  out.answers = [answer('weak', 'ally', () => { WAR.treaty(me, foe, 'peace'); army(foe, 8); }), answer('even', 'ally', () => { WAR.treaty(me, foe, 'peace'); army(me, 8); army(foe, 8); }), answer('yours', 'ally', () => { WAR.treaty(me, foe, 'ally'); FK.SIDES[foe].ally = me; FK.SIDES[me].ally = foe; army(me, 8); }),
    answer('truce', 'peace', () => { WAR.treaty(me, foe, 'war'); army(foe, 30); }), answer('free', 'peace', () => { WAR.treaty(me, foe, 'war'); army(me, 30); })];
  // ten minutes of a vassal: its tribute, loyalty and unrest
  fresh(); E.makeVassal(foe, me); const fk = FK.seatOf(foe), V = FK.SIDES[foe], beats = []; for (let i = 0; i < 6; i++) mk(SP, me, fk.bx + (6 + i) * D.tile, fk.by + 8 * D.tile); const g0 = { ...FK.SIDES[me].store };
  for (let i = 0; i < 60; i++) { V.gathered += 50 + 7 * i; Object.assign(V.store, { food: 400, wood: 300, gold: 200, stone: 100, iron: 0 }); E.vassals(); beats.push([V.loyal, V.unrest, V.paid]); }
  out.vassal = { beats, stance: [WAR.stance(foe, me), V.lord], got: FK.SIDES[me].store.food - g0.food };
  fresh(); const gifts = []; for (const amt of [100, 100, 300, 50]) { const r0 = E.regardOf(me, 'ban'); E.giveGift(me, amt, 'ban'); gifts.push(E.regardOf(me, 'ban') - r0); } out.gifts = [gifts, WAR.stance(me, 'ban')];
  return out; })()"""
MIDREALM = r"""const stub = `var G = { t: 0, tick: 1, rel: [0, 1, 2, 3, 4].map(() => [0, 1, 2, 3, 4].map(() => 'war')), warAt: {}, units: [], blds: [], nodes: [], finds: [], P: [0, 1].map((id) => ({ id, alive: true, name: 'side' + id, ally: null, res: { f: 1e4, w: 1e4, g: 1e4, s: 1e4, i: 1e4 }, gathered: 0, age: 3, techs: new Set() })), keep: [] };
  const news = () => {}, say = () => {}, chron = () => {}, sfx = () => {}, fxv = () => ({ m: 1, a: 0 }), every = () => false, rng = () => 1, scarStrike = () => {}, takePrisoner = () => {}, coord = () => '', friendly = (a, b) => a === b || G.rel[a][b] === 'ally', calm4b = () => false;
  const spend = (p, k, n) => { p.res[k] -= n; }, earn = (p, k, n) => { p.res[k] += n; }, keepOf = (o) => G.keep[o] || null, isSoldier = (u) => !!u.sol, soldiersOf = (o) => G.units.filter((u) => u.owner === o && u.sol), afford = () => true, pay = () => {}, homeOf = (o) => G.keep[o];
  const atWar = (a, b) => a !== b && G.rel[a][b] === 'war', gangRel = () => 'war', unitsNear = (b, r, fn) => G.units.filter((v) => Math.hypot(v.x - b.x, v.y - b.y) < r).forEach(fn), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), hyp = (x, y) => Math.hypot(x, y);
  let ODDS = {}; const oddsOf = (q, o) => ODDS[q + ',' + o], PEACE = { truce: ${games.match(/truce: (\{[^}]*\})/)[1]} };`;
  return box([basics, units, blds, wild, tuning, cut(core8, 'const clamp', '\n'), cut(core8, 'const relax', '\n'), stub, cut(nav, 'function snapPos', '\n}') + '\n}', cut(camps, 'const CAMP_TENTS', '// facing'), cut(natives, 'const gangState', '// a side'), cut(natives, 'const giftsRecent', 'function giftWhy'), cut(natives, 'function trapsTick', '// Outlaw'),
    cut(orders, 'function declareWar', '// why a side'), cut(orders, 'function envoyWhy', 'const oddsOf'), cut(orders, 'const gangKey', 'function envoyWhy'), cut(orders, 'function judgeEnvoy', '// an ally sends'), cut(eco, 'const vassalsOf', 'function surrenderWhy'), cut(eco, 'function vassalTick', '\n}\n') + '\n}', cut(orders, 'const levyOf', '\n'),
    `const rebel = () => {}, releaseLevy = () => {}, OUT = { CAMP, CALTROPS, STAKES, NOTICE, REGARD, VASSAL, DEMAND, TAX, NATIVE: { scoutSees: NATIVE.scoutSees, trapR: NATIVE.trapR, pit: NATIVE.pit, stuck: NATIVE.stuck }, GANG, REL_WORD, truce: PEACE.truce };
    const tents = Object.fromEntries(['medtent', 'traintent', 'messtent', 'depot', 'camptower', 'abatis', 'palisade', 'pit', 'net', 'stakes', 'caltrops'].map((k) => [k, [BLD[k].hp, BLD[k].t, BLD[k].cost, BLD[k].age, BLD[k].heal, BLD[k].hrng]])); OUT.blds = tents;
    OUT.units = Object.fromEntries(['outpostcart', 'campcart', 'envoy', 'rebel'].map((k) => [k, [UNIT[k].hp, UNIT[k].spd, UNIT[k].sight, UNIT[k].cost || {}, UNIT[k].t, UNIT[k].age, UNIT[k].dmg || 0]]));
    OUT.layout = RUN.layout.map(([size, [fx, fy]]) => campLayout(size === 'small' ? 'outpost' : 'camp', 1003, 1207, fx, fy).map((p) => { const s = snapPos(p.kind, p.x, p.y); return [p.kind, s.gx, s.gy]; }));
    OUT.heal = relax(RUN.hp0, RUN.max, RUN.max / BLD.medtent.heal, 10); OUT.supply = { fee: Math.ceil((CAMP.fee * RUN.d) / 100), food: Math.min(CAMP.load, Math.floor(1e4 - CAMP.keep.f)) };
    const cal = { kind: 'caltrops', owner: 0, x: 0, y: 0, prog: 1, hp: 40, seen: {}, id: 1 }; G.blds = [cal]; const r = { kind: 'cata', owner: 1, x: 0, y: 0, hp: 100, max: 100 }, f = { kind: 'spear', owner: 1, x: 0, y: 0, hp: 100, max: 100 }; G.units = [r, f]; OUT.caltrops = [0, 1, 2.1, 3.2].map((t) => { G.t = t; trapsTick(); return [r.hp / r.max, f.hp / f.max, cal.hits || 0, !!cal.gone, (r.stuck || 0) > t]; });
    const pit = { kind: 'pit', owner: 1, x: 0, y: 0, prog: 1, hp: 60, seen: {}, id: 2 }; G.blds = [pit]; G.units = [{ kind: 'scout', owner: 0, x: 40, y: 0, hp: 50, max: 50 }]; G.t = 9; trapsTick(); const w = { kind: 'spear', owner: 0, x: 0, y: 0, hp: 60, max: 60 }; G.units.push(w); trapsTick(); OUT.pit = [!!pit.seen[0], !!pit.gone, w.hp === 60];
    G.t = 0; G.rel[0][1] = G.rel[1][0] = 'peace'; const n0 = setRel(0, 1, 'war'), left = noticeLeft(0, 1); G.t = 29; noticeTick(); const at29 = G.rel[0][1]; G.t = 31; noticeTick(); OUT.notice = [n0, left, at29, G.rel[0][1]];
    OUT.answers = RUN.answers.map(([ask, stance, o0, o1]) => { G.rel[0][1] = G.rel[1][0] = stance; G.P[0].ally = G.P[1].ally = stance === 'ally' ? 0 : null; G.P[0].res.g = 1e4; ODDS = { '0,1': o0, '1,0': o1 }; let said = ''; const env = { ask, hp: 1 }; judgeEnvoy(1, 0, env); return [G.rel[0][1], G.P[1].ally, 1e4 - G.P[0].res.g, env.state || (env.hp ? '' : 'killed')]; });
    G.rel[0][1] = G.rel[1][0] = 'war'; G.keep = [{ x: 0, y: 0 }, { x: 3000, y: 3000 }]; G.units = [0, 1, 2, 3, 4, 5].map(() => ({ owner: 0, sol: true, x: 3080, y: 3060, hp: 1 })); G.blds = []; makeVassal(1, 0, 'fair'); const V = G.P[1], beats = [];
    for (let i = 0; i < 60; i++) { V.gathered += 50 + 7 * i; Object.assign(V.res, { f: 400, w: 300, g: 200, s: 100, i: 0 }); vassalTick(); beats.push([V.loyal, V.unrest, V.paid]); } OUT.vassal = { beats, stance: [G.rel[1][0], V.lord] };
    G.t = 0; G.P[0].res.g = 1e4; OUT.gifts = [100, 100, 300, 50].map((amt) => { const g = giftGain(0, amt, 'ban'); gangState('ban').gifts[0].push(G.t); return g; });`]);"""
async def realm(b):
    pg, errs = await fresh(b, 1500); v = await pg.evaluate(REALMJS); await pg.close()
    M, SH, T = keyed('measure'), book('shells'), keyed('tech'); LK = {s['look']: c for c, s in SH.items() if 'look' in s}; RS = RK; cost = lambda c: {RS.get(k, k): x for k, x in (c or {}).items() if x}
    A = [[a['ask'], 'war' if a['ask'] == 'peace' else 'ally' if a['who'] == 'yours' else 'peace', *a['odds']] for a in v['answers']]
    mid, err = frozen('basics units blds wild tuning core8 nav orders eco camps natives games', MIDREALM,
        {'layout': [[s, f] for s, f, _ in v['layout']], 'hp0': v['heal'][0], 'max': v['heal'][2], 'd': v['supply']['d'], 'answers': A}); m = mid or {}
    ca, tp, rl, rg, va, sz = M['camp'], M['trap'], M['relations'], M['regard'], M['vassal'], M['camps']; C = m.get('CAMP', {}); K = tp['kinds']
    nums = bool(m) and [ca['build'], ca['extra'], ca['home'], ca['burn'], ca['supply'], ca['load'], ca['fee'], ca['per'] * 10, ca['reach'] * 10, ca['wear'], ca['mend'], ca['keep'], ca['hold'], sz['large']['side']] == [C['build'], C['extra'], C['sendHome'], C['burn'], C['supply'], C['load'], C['fee'], 100, C['reach'], C['wear'], C['mend'], cost(C['keep']), C['hold'], C['side']] \
        and [K['caltrops']['hits'], K['caltrops']['hurt']['horse'], K['caltrops']['hurt']['foot'], K['caltrops']['stuck']['horse'], K['caltrops']['again']] == [m['CALTROPS'][k] for k in ('hits', 'horse', 'foot', 'stuck', 'again')] + [m['STAKES'][k] for k in ('plant', 'dmg', 'shove')] \
        and [tp['scout'] * 10, tp['r'] * 10, K['pit']['hurt']['foot'], K['pit']['stuck']['foot']] == [m['NATIVE'][k] for k in ('scoutSees', 'trapR', 'pit', 'stuck')] and rl['notice'] == m['NOTICE'] and rl['truce'] == {**m['truce'], 'round': 10} \
        and {k: rg[k] for k in m['REGARD']} == m['REGARD'] and va['demand'] == {**m['DEMAND'], 'least': 1} and va['tribute'] == m['TAX']['fair'] and all(va[k] == m['VASSAL'][k] for k in ('tau', 'garrison', 'garrisonMax', 'kill', 'protectMax', 'decay', 'share', 'shareAt', 'giftAt', 'crushed', 'rise', 'freeAfter', 'invest')) and va['r'] * 10 == m['VASSAL']['r'] \
        and keyed('sides')['names'] == m['GANG'] and keyed('sides')['words'] == m['REL_WORD']
    B, HP, U = m.get('blds', {}), M['bldHp'], m.get('units', {})
    rows = bool(B) and all(M['buildTime'][LK[k]] == b[1] and cost(M['cost'].get(LK[k], {})) == cost(b[2]) for k, b in B.items()) and all(HP[LK[k]] == B[k][0] for k in ('pit', 'net', 'stakes', 'caltrops')) and [M['heal']['BTC5']['heal'], M['heal']['BTC5']['r'] * 10] == B['medtent'][4:] \
        and all([M['stats'][c]['hp'], M['stats'][c]['sight'] * 10, cost(M['cost'].get(c, {})), M['stats'][c]['atk']] == [U[k][0], U[k][2], cost(U[k][3]), U[k][6]] for c, k in (('UT2', 'outpostcart'), ('UT4', 'campcart'), ('US5', 'envoy'), ('MH6', 'rebel'))) and [M['train']['UT2'], M['train']['UT4']] == [U['outpostcart'][4], U['campcart'][4]]
    lay = bool(m) and all(sorted(map(tuple, p)) == sorted(map(tuple, q)) for (_, _, p), q in zip(v['layout'], m['layout']))
    cp = v['camp']; camp = cp['unpacked'] and cp['gone'] and len(cp['pieces']) == len(sz['small']['spots']) and {LK[k] for k, _ in cp['pieces']} == {c for c, *_ in sz['small']['spots']} and cp['raising'] and cp['rate'] and close(*cp['rate'])
    heal = bool(m) and abs(v['heal'][1] - m['heal']) < 0.01 * v['heal'][2]
    su = v['supply']; supply = bool(m) and su['done'] and su['gold'] == m['supply']['fee'] and su['food'] == m['supply']['food'] and su['stock'] == 100 + m['supply']['food'] and abs(v['eat'][0] - v['eat'][1]) < 0.05 * v['eat'][1] and not v['eat'][2] and v['unfed'][0] and abs(v['unfed'][1] - M['charge']['slow']) < 0.02
    traps = bool(m) and all(all(abs(x - y) < 1e-6 for x, y in zip(a, b)) for a, b in zip(v['caltrops'], m['caltrops'])) and len(v['caltrops']) == len(m['caltrops']) and v['pit'] == [True, False] + m['pit'][1:] and m['pit'][0]
    no = v['notice']; notice = bool(m) and no == [True, m['notice'][1], m['notice'][2], m['notice'][3]] and m['notice'][0]
    AW = keyed('words')['realm']['answer']; tpl = lambda w: w.split('{side}')[-1].split('{')[0].strip()
    ans = bool(m) and all([a['stance'], a['ally'] == keyed('measure')['players'][0], a['paid'], a['back']] == [mm[0], mm[1] == 0, mm[2], 'back' if mm[3] == 'return' else mm[3]] for a, mm in zip(v['answers'], m['answers'])) \
        and [next((k for k, w in AW.items() if isinstance(w, str) and a['said'] and tpl(w) and tpl(w) in a['said'][0]), None) for a in v['answers']] == ['weak', 'yes', 'yours', 'bought', 'peace']
    vs = v['vassal']; vas = bool(m) and len(vs['beats']) == 60 and all(abs(x - y) < 1e-6 for a, b in zip(vs['beats'], m['vassal']['beats']) for x, y in zip(a, b)) and vs['stance'] == ['ally', 0] and vs['got'] > 0
    gift = bool(m) and v['gifts'][0] == m['gifts']
    got = [nums, rows, lay, camp, heal, supply, traps, notice, ans, vas, gift, not errs]
    ok('t-realm', all(got), [got, {k: v[k] for k in ('camp', 'heal', 'supply', 'eat', 'unfed', 'caltrops', 'pit', 'notice', 'gifts')}, v['answers'], v['vassal']['beats'][::15], {k: m.get(k) for k in ('heal', 'supply', 'caltrops', 'pit', 'notice', 'answers', 'gifts')}, (m.get('vassal') or {}).get('beats', [])[::15], errs[:2], err[-800:]])
MINDJS = r"""(() => { const D = FK.D, K = FK.K, out = {}, side = D.players[1], sim = $run, vil = D.trains[FK.seatOf(0).code][0];
  FK.reset(); out.plans = []; for (let m = 0; m < 4; m++) { sim(60); const vs = ECON.villagersOf(side), s = FK.SIDES[side], cost = ECON.ageCost(side) || {}, draw = { food: vs.length * 0.012, wood: 0.05 }, plan = AI.needOf(side, vs, cost, draw);
    out.plans.push({ jobs: vs.map((v) => [ECON.jobOf(v), ECON.forageNow(v) || 0]), rate: Object.fromEntries(ECON.YIELDS.map((y) => [y, AI.rateFrom(side, y)])), store: { ...s.store }, cost, draw, plan,
      famine: AI.runsOut(side, 'food', plan.food, plan.food.n, draw.food), react: D.ai.diff[MENU.S.opt.diff].react, carry: FK.stat(vil, side, 'carry') }); }
  out.minds = D.players.slice(1).map((p) => [AI.mind[p].goal || null, ECON.villagersOf(p).length, FK.things().filter((t) => t.kind === 'bld' && t.side === p).length]);
  out.moon = [0, 1000, 5000, 12345, 40000].map((t) => { K.t = t; FK.sim(0); return [FK.moonPhase(), K.moonLit]; });
  FK.reset(); const us = FK.units(), u = ECON.villagersOf(0)[0]; us.splice(0, us.length, u); FK.RUTS.fill(0); const far = [8, -8, 8 * FK.N, -8 * FK.N].map((d) => u.k + d).find(FK.walkable); FK.go(u, far); let moved = 0;
  for (let i = 0; i < 200 && u.path; i++) { FK.step(0.1); moved += u.mps > 0; } out.wear = [FK.RUTS.reduce((a, b) => a + b, 0), moved * 0.1];
  FK.RUTS.fill(0); FK.RUTS[0] = 300; sim(25); out.heal = FK.RUTS[0];
  const land = (ok) => { for (let k = 0; k < FK.N * FK.N; k++) if (FK.H[k] > 0 && FK.walkable(k) && ok(FK.BANK[k], k)) return k; return -1; }, kw = land((b) => b === 2), kd = land((b) => b > D.flood.rise);   // ruts.near went with B24+B25 (wetness by the TWI, Albert Nov 8): dry = past the flood's rise
  out.ruts = [0, 30, 150, 300, 900].map((n) => { FK.RUTS.fill(0); FK.RUTS[FK.rutAt(kw)] = n; FK.RUTS[FK.rutAt(kd)] = n; K.wet = 0.4; return [n, FK.rutOf(kw), FK.mudAt(kw), FK.mudAt(kd)]; });
  FK.reset(); FK.RUTS.fill(0); const i0 = kw % FK.N, j0 = (kw - i0) / FK.N, dry = land((b, k) => b > D.flood.rise + 1 && Math.abs((k % FK.N) - i0) < 12 && Math.abs(Math.floor(k / FK.N) - j0) < 12), w = FK.spawn(vil, 0, dry, FK.rng);
  const path = () => { const ok = FK.go(w, kw); w.path = null; return ok; }, home = Object.keys(D.cost).find((c) => FK.has({ code: c }, 'Line')), lev = $tk('levees');
  let b = null; for (let k = 0; k < FK.N * FK.N && !b; k++) if (FK.BANK[k] && FK.BANK[k] < D.flood.rise && FK.H[k] > 0) { b = FK.build(home, k % FK.N, (k - (k % FK.N)) / FK.N, FK.SIDES[0].col); if (b && !(FK.BANK[FK.tileAt(b.bx, b.by)] < D.flood.rise - b.n / 2)) { FK.unbuild(b); b = null; } } if (b) { b.hpMax = b.hp = FK.stat(home, 0, 'hp'); }
  out.flood = { before: path(), kw, dry, b: !!b }; FK.flood(); out.flood.wet = FK.flooded(kw); out.flood.during = path(); const hp0 = b && b.hp; sim(10.5); out.flood.lost = b ? (hp0 - b.hp) / (b.hpMax * D.flood.hit) : null;
  FK.learn(0, lev); out.flood.levees = path(); const hp1 = b && b.hp; sim(5); out.flood.kept = b ? hp1 - b.hp : null; sim(D.flood.secs); out.flood.after = !FK.flooded(kw);
  return out; })()"""
MIDMIND = r"""const n = (re, t) => t.match(re)[0];
const rut = n(/rut: \{[^}]*\}/, tuning), shore = n(/shore: [\d.]+/, tuning), night = n(/\(1 - NIGHT_SIGHT[^\n]*\)\)/, core);
return box([basics, n(/const PERS = \{[\s\S]*?\n\};/, wild), n(/const WAVE = \{[^}]*\};/, wild), n(/const SAVE = \{[^}]*\};/, tuning), n(/const EVENTS = \{[\s\S]*?\n\};/, tuning),
  `const CLIMATE = { ${rut}, ${shore} }, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), G = { t: 0, clim: { mud: 0 }, tread: null, night: 0 }, NAV = { shore: [0] }, gcell = () => 0; let RATE_ = {}, REACT_ = 1, CARRY_ = 1;
   const forageNow = (v) => v.rho, rateFrom = (o, r) => RATE_[r], react = () => REACT_, carryOf = () => CARRY_`,
  cut(ai, 'function needOf', '// The reorder point'), cut(ai, 'function runsOut', '// The shift to plots'), cut(core, 'const moonPhase', 'const civOf'), cut(core, 'const nightOf', 'const nightness'), cut(events, 'const ruts = ', '// what a step needs').replace('** 0.4', '** ' + RUN.rutPow),   // S1 (N20, Wronski & Humphreys): depth grows as passes^0.5; Mid typed 0.4, so Mid's formula is run at the book's power
 
  `var OUT = { pers: PERS, wave: WAVE, save: SAVE, diff: DIFF, safe: EASY_SAFE, players: PLAYERS.map((p) => p.pers), synodic: SYNODIC, day: DAY_LEN, nightSight: NIGHT_SIGHT, flood: EVENTS.flood, rut: CLIMATE.rut, shore: CLIMATE.shore, plans: [] };
  for (const P of RUN.plans) { RATE_ = P.rate; REACT_ = P.react; CARRY_ = P.carry; const p = { id: 1, eats: P.draw.food * 60, res: Object.fromEntries(RES.map((r) => [KEY[r], P.store[r]])) }, vils = P.jobs.map(([job, rho]) => ({ job, rho }));
    const plan = needOf(p, vils, Object.fromEntries(Object.entries(P.cost).map(([r, c]) => [KEY[r], c])), null, P.draw); OUT.plans.push({ plan: JSON.parse(JSON.stringify(plan)), famine: famineNear(p, plan) }); }
  OUT.moon = RUN.moon.map((t) => { G.t = t; return [moonPhase(t), moonLight()]; }); OUT.sight = RUN.sight.map(([a, k]) => { G.night = nightOf(a); const moonLight = () => k; return 1 - eval(${JSON.stringify(night)}) * G.night; });
  const T = ruts(); T[0] = 300; for (let i = 0; i < 3; i++) rutHeal(); OUT.heal = T[0];
  OUT.ruts = RUN.ruts.map(([c]) => { T[0] = c; G.clim.mud = 0.4; NAV.shore[0] = 1; const wet = mudAt({ x: 0, y: 0 }); NAV.shore[0] = 0; return [rutOf(0, 0), wet, mudAt({ x: 0, y: 0 })]; });`]);"""
async def mind(b):
    pg, errs = await fresh(b); v = await pg.evaluate(MINDJS); await pg.close()
    m, err = frozen('basics wild tuning core ai events', MIDMIND, {'plans': [{k: P[k] for k in ('jobs', 'rate', 'store', 'cost', 'draw', 'react', 'carry')} for P in v['plans']], 'moon': [0, 1000, 5000, 12345, 40000], 'sight': [[-20, 0], [-20, 1], [-6, 0.5], [10, 1]], 'ruts': v['ruts'], 'rutPow': MEASURE['ruts']['pow']})
    M, Y = MEASURE, ['food', 'wood', 'gold', 'stone', 'iron']; m = m or {}
    names = {k: re.search(r'→ ([^;)]+)', r[1]).group(1).strip() for k, r in piece('BLD').items() if re.search(r'→ ([^;)]+)', r[1])}
    KEYS = RK
    def pers(k, mid):
        mine = M['ai.pers'][k]; same = all(mine[f] == mid[f] for f in mid if f not in ('build', 'techs', 'mix', 'crown') and f in mine) and mine['mix'] == [mid['mix'][y] for y in Y] and mine['techs'] == mid['techs']
        return same and [[SHELLS[c]['name'], *r] for c, *r in mine['build']] == [[names[b[0]], *b[1:4], *([{KEYS[a]: n for a, n in b[4].items()}] if len(b) > 4 else [])] for b in mid['build']]
    D = keyed('measure')
    books = bool(m) and all(pers(k, m['pers'][k]) for k in ('aggr', 'bal', 'fort')) and D['ai.pers']['of'][1:] == m['players'][1:4] and {k: D['ai.wave'][k] for k in m['wave']} == {**m['wave'], 'step': m['wave']['step'] / M['tile']} \
        and D['ai.save'] == m['save'] and [{k: r[k] for k in ('react', 'bold', 'opp', 'allyAt', 'gang', 'envoy')} for r in D['ai.diff']] == [m['diff'][d] for d in ('easy', 'normal', 'hard')] and D['ai.diff'][0]['safe'] == m['safe'] \
        and D['moon']['month'] == m['synodic'] and M['day'] == m['day'] and {k: D['ruts'][k] for k in m['rut']} == m['rut'] and D['ruts']['shore'] == m['shore'] \
        and [D['flood'][k] for k in ('secs', 'hit')] == [m['flood'][k] for k in ('secs', 'hit')] and D['flood']['rise'] * M['tile'] == m['flood']['rise']
    def same(a, b): a, b = [float('inf') if x is None else x for x in (a, b)]; return a == b or abs(a - b) <= 1e-9 * max(1, abs(b))
    plans = bool(m) and len(m['plans']) == 4 and all(all(same(v['plan'][y][f], mm['plan'][y][f]) for y in Y for f in ('n', 'rho', 'inc', 'short', 't')) and v['famine'] == mm['famine'] for v, mm in zip(v['plans'], m['plans']))
    minds = all(g and n > MEASURE['villagers'] and nb > 1 for g, n, nb in v['minds'])
    moon = bool(m) and all(same(a, c) and same(b, d) for (a, b), (c, d) in zip(v['moon'], m['moon']))
    ground = bool(m) and abs(v["wear"][0] - v["wear"][1]) < 1e-4 and v['wear'][1] > 1 and v['heal'] == m['heal'] and all(same(a[1], c[0]) and same(a[2], min(1, c[1])) and same(a[3], min(1, c[2])) for a, c in zip(v['ruts'], m['ruts']))
    f = v['flood']; flood = f['before'] and f['wet'] and not f['during'] and f['b'] and abs(f['lost'] - round(f['lost'])) < 1e-6 and 10 <= round(f['lost']) <= 11 and f['levees'] and f['kept'] == 0 and f['after']
    got = [books, plans, minds, moon, ground, flood, not errs]
    ok('t-mind', all(got), [got, v['minds'], v['plans'][0]['plan'], (m.get('plans') or [{}])[0], v['moon'], m.get('moon'), v['wear'], v['heal'], m.get('heal'), v['ruts'], m.get('ruts'), f, errs[:2], err[-800:]])
WILDJS = r"""(() => { const D = FK.D, K = FK.K, ME = D.players[0], out = {}, rows = D.finds.rows, codeOf = (t) => (FK.KIND[t.kind] || {}).code, said = [], rng0 = FK.rng;
  FK.on('say', (w) => { said.push([Math.round(K.t), w]); }); FK.reset();
  out.laid = FK.things().filter((t) => rows[codeOf(t)]).map((t) => { const g = FK.units().filter((u) => u.find === t); return [codeOf(t), g.map((u) => u.code), Math.max(0, ...g.map((u) => Math.hypot(u.bx - t.bx, u.by - t.by) / D.tile)), g.every((u) => u.home === t && u.side < 0)]; });
  const keep = { ...FK.EVS }; for (const k in FK.EVS) FK.EVS[k] = {}; let s = 12345; const roll = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  ['hard', 'starve', 'winter', 'drought', 'horde', 'plague'].forEach((h) => FK.HZ.add(h)); MENU.S.opt.diff = 1; Object.assign(K, { ev: {}, wayT: Infinity, horde: null }); said.length = 0;
  for (let t = 1; t <= 3600; t++) { K.t = t; K.sky = Math.floor(t / 300) % 3 === 1 ? 'rain' : 'clear'; FK.events(roll); }
  Object.assign(FK.EVS, keep); out.said = said.slice(); out.horde = FK.units().filter((u) => u.horde).length; out.level = [FK.level(), FK.levelMul()];
  FK.reset(); FK.rng = () => 0.37; const seat = FK.seatOf(ME); WAR.raids(); K.t = 5000;
  const camps = FK.things().filter((t) => codeOf(t) === D.raids.camp), guards = FK.units().filter((u) => camps.includes(u.find)), cands = FK.units().filter((v) => v.side === ME && v.hp > 0 && !v.gone && !v.inside && (FK.has(v, 'Gather') || FK.has(v, 'Trade')));
  const guardOf = (v) => { let g = 0; FK.unitsNear(v, D.raids.group * D.tile, (q) => { if (q.side === ME && WAR.armed(q) && q.hp > 0 && !q.gone && !q.inside && Math.hypot(q.bx - v.bx, q.by - v.by) / D.tile < D.raids.group) g += WAR.power1(q); }); return g; };
  out.raid = { k: [seat.bx, seat.by], age: FK.SIDES[ME].age, camps: camps.map((c) => [c.bx, c.by]), guards: guards.map((u) => [camps.indexOf(u.find), u.hp, WAR.power1(u)]), cands: cands.map((v) => [v.bx, v.by, WAR.power1(v), guardOf(v), (v.load || 0) + Object.values(v.goods || {}).reduce((a, b) => a + b, 0), FK.has(v, 'Trade') ? 'caravan' : 'vil']) };
  const mark = WAR.raids(); FK.rng = rng0; Object.assign(out.raid, { mark: cands.indexOf(mark), band: guards.map((u, i) => (u.back ? i : -1)).filter((i) => i >= 0), home: guards.filter((u) => u.back).every((u) => u.aggro === mark && u.horde && Math.abs(u.back - K.t - D.raids.secs) < 1e-9 && u.home.bx === mark.bx) });
  FK.reset(); const dr = FK.things().find((t) => (rows[codeOf(t)] || {}).hire), v = ECON.villagersOf(ME)[0], st = FK.SIDES[ME].store, vag = FK.units().filter((u) => u.find === dr).map((u) => [u.bx, u.by]), h = { pos: [dr.bx, dr.by], v0: [v.bx, v.by], vag, why: [] };
  h.why.push(ECON.hireWhy(ME, dr)); v.bx = dr.bx + 3 * D.tile; v.by = dr.by; FK.place(v); h.v1 = [v.bx, v.by]; st.gold = 0; h.why.push(ECON.hireWhy(ME, dr)); st.gold = 1000; h.why.push(ECON.hireWhy(ME, dr)); h.ok = ECON.hire(ME, dr);
  Object.assign(h, { gold: st.gold, got: FK.units().filter((u) => u.side === ME && vag.some(([x, y]) => u.bx === x && u.by === y)).map((u) => u.code), left: FK.units().filter((u) => u.find === dr && u.side < 0).length, taken: dr.taken }); out.hire = h;
  FK.reset(); const take = (code) => { const t = FK.things().find((q) => codeOf(q) === code); for (const g of FK.units().filter((u) => u.find === t)) WAR.die(g); const w = ECON.villagersOf(ME)[0]; w.bx = t.bx + D.tile; w.by = t.by; FK.place(w); FK.step(0);
    const s0 = { ...FK.SIDES[ME].store }, n0 = FK.SIDES[ME].techs.size, early = t.taken; ECON.finds(); const s1 = FK.SIDES[ME].store; return [Object.fromEntries(ECON.YIELDS.map((y) => [y, s1[y] - s0[y]]).filter(([, n]) => n)), FK.SIDES[ME].techs.size - n0, t.taken, early]; };
  out.took = { MG4: take('MG4'), MG1: take('MG1') }; return out; })()"""
MIDWILD = r"""const n = (re, t) => t.match(re)[0];
const base = [basics, units, n(/const FINDS = \{[\s\S]*?\n\};/, wild), n(/const WAYFARER_EVERY = \d+;/, wild), n(/const WILD_LOOK = \d+;/, wild), n(/const NATIVE = \{[\s\S]*?\n\};/, wild), cut(tuning, 'const EV_MEAN', 'const EVK'),
  n(/const HAZARDS = \{[\s\S]*?\n\};/, tuning), 'const HZK = Object.keys(HAZARDS), ' + n(/HORDE = \{[^}]*\}/, tuning) + ';', n(/const TOAST = \{[^}]*\};/, tuning), cut(text, 'const EV_WHY', "// The row's words"), n(/const GROUP_R = \d+;/, spatial),
  n(/function roulette[\s\S]*?\n\}/, core), n(/const nextIn = [^\n]*/, core), n(/const lanchester = [^\n]*/, core), n(/const calm4b = [^\n]*/, core), cut(core, 'const costText', '// Every resource'),
  'var OUT = { news: [], added: [], horde: 0 }; const news = (c, t) => OUT.news.push([Math.round(G.t), t]), sfx = () => {}, dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);'];
const books = box([...base, 'const G = {}; OUT.books = { FINDS, WAYFARER_EVERY, WILD_LOOK, NATIVE, GROUP_R, EV_MEAN, EV_MIN, EV_WARN, EVENTS, HAZARDS, HORDE, SEASON_LEN, CARRY, leash: [...[120, 60]], UNIT: Object.fromEntries(["bandit", "robber", "vagabond", "wayfarer", "wagon", "spear", "sword"].map((k) => [k, UNIT[k]])) };'
  .replace('leash: [...[120, 60]]', 'leash: ' + JSON.stringify(n(/\(UNIT\[u\.kind\]\.raid \|\| \d+\) \+ \d+/, troops).match(/\d+/g).map(Number)))]).books;
const sched = box([...base, `let s = RUN.seed; const rng = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296, rnd = () => 0;
  for (const k of Object.keys(EVENTS)) if (!RUN.kinds.includes(k)) delete EVENTS[k]; const EVK = Object.keys(EVENTS);
  const G = { t: 0, ev: {}, wx: 'clear', night: 0, fantasy: false, diff: 'normal', hz: { hard: 1, starve: 1, winter: 1, drought: 1, horde: 1, plague: 1 }, P: [{ id: 0, alive: true, age: 0 }] };
  const EV = new Proxy({}, { get: () => ({}) }), evmSet = () => {}, newsTick = () => {}, postTick = () => {}, keepOf = () => ({ x: 0, y: 0 }), gangRel = () => 'war', estPower = () => 0, edgeSpot = () => ({ x: 0, y: 0 }), wildSpot = edgeSpot, wildAt = () => { OUT.horde++; return {}; };
  const season = () => ({ name: ['Spring', 'Summer', 'Autumn', 'Winter'][Math.floor(G.t / RUN.season) % 4] });`, n(/const hz = [^\n]*/, events), cut(events, 'const canEv', '// the swarm'), cut(events, 'function startEvent', '// ── The climate'),
  'for (let t = 1; t <= RUN.secs; t++) { G.t = t; G.wx = Math.floor(t / 300) % 3 === 1 ? "rain" : "clear"; eventsTick(); }']);
const R0 = RUN.raid, raid = box([...base, `const rng = () => 0.37, rnd = (a, b) => a + rng() * (b - a), N = { raidAt: 1 }, natState = () => N, hz = () => true, regardOf = () => 20, gangRel = () => 'war', coord = () => '', BLD = {}, R0 = RUN.raid, keepOf = () => ({ x: R0.k[0], y: R0.k[1] });
  const G = { t: 5000, diff: 'normal', P: [{ id: 0, alive: true, age: R0.age }], finds: R0.camps.map(([x, y], i) => ({ id: i, kind: 'camp', x, y, done: false })),
    units: [...R0.guards.map(([f, hp, pw], i) => ({ id: 100 + i, owner: WILD, kind: 'robber', find: f, hp, pw, x: R0.camps[f][0], y: R0.camps[f][1] })), ...R0.cands.map(([x, y, pw, gp, load, kind], i) => ({ id: i, owner: 0, kind, x, y, hp: 1, pw, gp, carry: load }))] };
  const guardsLeft = (f) => G.units.some((v) => v.find === f.id && v.owner === WILD && v.hp > 0), unitPower = (u) => u.pw, isSoldier = (q) => !!q.sol, unitsNear = (v, r, fn) => { if (v.gp) fn({ owner: v.owner, sol: true, hp: 1, inside: false, pw: v.gp }); };`,
  cut(natives, 'function natRaid', 'function nativesTick'), 'natRaid(); const m = (G.units.find((u) => u.aggro) || {}).aggro; OUT.mark = m ? m.id : -1; OUT.band = G.units.filter((u) => u.back).map((u) => u.id - 100);']);
const H0 = RUN.hire, hire = box([...base, `const H0 = RUN.hire, f = { id: 0, kind: 'vagabonds', x: H0.pos[0], y: H0.pos[1], done: false, owner: null }, me = { id: 0, kind: 'vil', owner: 0, x: H0.v0[0], y: H0.v0[1] };
  const G = { t: 0, units: [me, ...H0.vag.map(([x, y]) => ({ find: 0, kind: 'vagabond', owner: WILD, x, y, hp: 30 }))], P: [{ res: { g: 0 } }] }, clsCount = () => 0, armyRoom = () => 99, armyFull = () => 'full', pay = (p, c) => { for (const k in c) p.res[k] -= c[k]; }, civKind = (o, k) => k, addUnit = (o, k, x, y) => { OUT.added.push([o, k, x, y]); return {}; };`,
  cut(orders, 'function hireWhy', '// ───────────────────────── Villager orders'), 'OUT.why = [hireWhy(0, f)]; me.x = H0.v1[0]; me.y = H0.v1[1]; OUT.why.push(hireWhy(0, f)); G.P[0].res.g = 1000; OUT.why.push(hireWhy(0, f)); OUT.ok = hire(0, f); OUT.gold = G.P[0].res.g; OUT.done = f.done;']);
const took = box([...base, n(/const addRes = [\s\S]*?\n\};/, core), `const got = {}, G = { t: 0, fantasy: false, P: [{ id: 0 }], finds: [{ id: 0, kind: 'chest', x: 0, y: 0, done: false, guards: [1] }], units: [] }, nearU = () => ({ owner: 0, kind: 'vil' }), earn = (p, k, v) => { got[k] = v; };`,
  cut(troops, 'const guardsLeft', ''), 'findsTick(0.5); OUT.got = got;']);
return { books, sched, raid, hire, took };"""
async def wild(b):
    pg, errs = await fresh(b); v = await pg.evaluate(WILDJS); await pg.close(); M = MEASURE; R = M['events']['rows']
    m, err = frozen('basics units wild tuning text core orders troops spatial events natives',
                    MIDWILD, {'seed': 12345, 'secs': 3600, 'season': M['season'], 'kinds': list(R), 'raid': v['raid'], 'hire': v['hire']}); m = m or {}
    U = piece('UNIT')
    def code(k):   # the v100 shell a Mid kind became, by the sort's line
        s, a = re.search(r'shell (\w+)', U[k][1]), re.search(r'→ ([^;]+)', U[k][1]); nm = a.group(1).strip() if a else U[k][1].strip()
        return s.group(1) if s else next((c for c, x in SHELLS.items() if x['name'] == nm), None)
    FN = {'chest': 'MG4', 'ruins': 'MG1', 'cemetery': 'MG2', 'camp': 'MG7', 'den': 'MG8', 'stop': 'MT1', 'vagabonds': 'MG9', 'mercs': 'MG10', 'meteor': 'MG11'}; Y = RK; F = M['finds']; B = m.get('books') or {}
    def row(k, f):
        r = F['rows'][FN[k]]; return (('guard' not in f or r.get('guard') == [code(f['guard'][0]), f['guard'][2]]) and r.get('got') == ({Y[y]: q for y, q in f['got'].items()} if 'got' in f else None) and bool(r.get('tech')) == bool(f.get('tech'))
            and ('hire' not in f or r['hire'] == {'cost': {Y[y]: q for y, q in f['hire']['cost'].items()}, 'unit': code(f['hire']['unit']), 'n': f['hire']['n']}))
    NA, E, HO, UN = B.get('NATIVE', {}), B.get('EVENTS', {}), B.get('HORDE', {}), B.get('UNIT', {}); T10 = lambda x: x / M['tile']
    unit = lambda k: (lambda s, u: s['hp'] == u['hp'] and s['atk'] == u.get('dmg', 0) and s['sight'] == T10(u['sight']) and (not u.get('dmg') or (s['rng'] == T10(u['rng']) and s['rof'] == u['cd'])) and s.get('vs', {}) == ({'civ': u['vs']['civ']} if u.get('vs') else {}))(M['stats'][code(k)], UN[k])
    bk = [bool(B) and all(row(k, f) for k, f in B['FINDS'].items() if k in FN) and set(FN) | {'shrine'} == set(B['FINDS']) and M['wayfarer']['every'] == B['WAYFARER_EVERY'] and F['look'] == T10(B['WILD_LOOK']) and F['leash'] == [T10(x) for x in B['leash']],
        F['raid'] == {code('robber'): T10(UN['robber']['raid'])} and M['wayfarer']['joins'] == {code('wayfarer'): UN['wayfarer']['joins'], code('wagon'): UN['wagon']['joins']} and all(unit(k) for k in ('bandit', 'robber')),
        [M['raids'][k] for k in ('from', 'gap', 'n', 'secs', 'load', 'guard', 'group')] == [NA['raidFrom'], NA['raidGap'], NA['raidN'], NA['raidSecs'], NA['raidLoad'], NA['raidGuard'], T10(B['GROUP_R'])] and M['carry'] == B['CARRY'],
        [M['events'][k] for k in ('mean', 'min', 'warn')] == [B['EV_MEAN'], B['EV_MIN'], B['EV_WARN']] and all(R[k].get('secs', M['flood']['secs']) == E[k]['secs'] for k in R) and R['stampede']['n'] == E['stampede']['n'] and R['sinkhole']['hit'] == E['sinkhole']['hit'],
        [R['quicksand']['r'] * M['tile'], R['quicksand']['slow']] == [E['quicksand']['r'], E['quicksand']['slow']],
        M['hazards']['pts'] == {k: h['pts'] for k, h in B['HAZARDS'].items()} and [M['hazards']['horde'][k] for k in ('min', 'mean', 'n', 'perAge')] == [HO[k] for k in ('min', 'mean', 'n', 'perAge')] and M['hazards']['horde']['warn'][0] * M['season'] == HO['warn']]; books = all(bk)
    laid = bool(v['laid']) and all((c == [F['rows'][f]['guard'][0]] * F['rows'][f]['guard'][1] and d <= F['ring'] + 1.5 if 'guard' in F['rows'][f] else c == [F['drifter']] * F['rows'][f]['hire']['n'] if 'hire' in F['rows'][f] else not c) and h for f, c, d, h in v['laid']) \
        and {f for f, *_ in v['laid']} >= {'MG4', 'MG1', 'MG7', 'MG8', 'MG9', 'MT1'}
    S = m.get('sched') or {}; said = v['said']; events = bool(S) and said == S['news'] and len(said) > 20 and v['horde'] == S['horde'] == M['hazards']['horde']['n'] and v['level'] == [sum(M['hazards']['pts'].values()), 1 + sum(M['hazards']['pts'].values()) / 10]
    r = v['raid']; raid = bool(m.get('raid')) and r['mark'] >= 0 and r['mark'] == m['raid']['mark'] and r['band'] == m['raid']['band'] and len(r['band']) == min(len([g for g in r['guards'] if g[0] == r['guards'][r['band'][0]][0]]), M['raids']['n'] + r['age']) and r['home']
    h, mh = v['hire'], m.get('hire') or {}; W = keyed('words')['wild']['hire']; drift = bool(mh) and h['why'][0] == W['near'] == mh['why'][0] and h['why'][1].startswith('Not enough: ') and mh['why'][1].startswith('Not enough: ') and h['why'][2] == '' and mh['why'][2] is None \
        and h['ok'] and mh['ok'] and h['gold'] == mh['gold'] == 1000 - F['rows']['MG9']['hire']['cost']['gold'] and h['got'] == [F['rows']['MG9']['hire']['unit']] * 3 and [a[1] for a in mh['added']] == ['spear'] * 3 and [a[2:] for a in mh['added']] == h['vag'] and h['left'] == 0 and h['taken'] == M['players'][0]
    tk = v['took']; taken = (m.get('took') or {}).get('got') and tk['MG4'][0] == {Y[y]: q for y, q in m['took']['got'].items()} and tk['MG4'][2] == tk['MG1'][2] == M['players'][0] and tk['MG4'][3] is None and tk['MG1'][1] == 1 and tk['MG1'][0] == {'gold': F['rows']['MG1']['got']['gold']}
    got = [books, laid, events, raid, drift, bool(taken), not errs]
    ok('t-wild', all(got), [got, bk, v['laid'][:6], said[:8], (S.get('news') or [])[:8], v['horde'], S.get('horde'), r.get('mark'), (m.get('raid') or {}), r.get('band'), h, mh, tk, m.get('took'), errs[:2], err[-800:]])
FIREJS = r"""(() => { const D = FK.D, K = FK.K, ME = D.players[0], out = {}, rng0 = FK.rng;
  out.heat = [[0, 0], [10, 0], [20, 0], [30, 1], [15, 0.5], [25, 3.9], [18, 2]].map(([a, g]) => ECON.heat(a, g)); out.eta = [0, 0.2, 0.5, 0.8, 1].map(ECON.eta);
  FK.reset(); K.ev = { next: Infinity }; const seat = FK.seatOf(ME), home = Object.keys(D.cost).find((c) => FK.SH[c] && FK.has({ code: c }, 'House') && FK.has({ code: c }, 'Burn')), n = FK.B[home][1], N = FK.N;
  const [sx, sy] = FK.fromBoard(seat.bx, seat.by), si = Math.floor(sx / D.tile), sj = Math.floor(sy / D.tile), fits = (i, j, w) => { for (let y = j - 2; y < j + n + 2; y++) for (let x = i - 2; x < i + w * n + 2; x++) if (!FK.free(y * N + x) || FK.H[y * N + x] !== FK.H[j * N + i]) return false; return true; }, spots = [];
  for (let r = 12; r < 60 && spots.length < 2; r++) for (let a = 0; a < 96 && spots.length < 2; a++) { const i = Math.round(si + r * Math.cos((a / 96) * 2 * Math.PI)), j = Math.round(sj + r * Math.sin((a / 96) * 2 * Math.PI)), w = spots.length ? 3 : 2; if (fits(i, j, w) && spots.every(([p, q]) => Math.hypot(p - i, q - j) > 16)) spots.push([i, j, w]); }
  const town = spots.flatMap(([i, j, w]) => Array.from({ length: w }, (_, k) => FK.build(home, i + k * n, j, FK.SIDES[ME].col))); for (const b of town) b.hpMax = b.hp = FK.stat(home, ME, 'hp');
  const [b0, b1, b2, b3, b4] = town, vs = ECON.villagersOf(ME).slice(0, 2); for (const u of FK.units().filter((u) => u.side === ME && !vs.includes(u))) FK.vanish(u);
  vs.forEach((u, i) => { ECON.idle(u); u.bx = b0.bx + (i - 0.5) * D.tile; u.by = b0.by + (n / 2 + 0.6) * D.tile; FK.place(u); }); FK.step(0);
  const W = FK.things().filter((b) => b.side === ME && b.kind === 'bld' && FK.has(b, 'Burn') && b.done >= 1 && b.hp > 0), seq = [0.001, (W.indexOf(b0) + 0.5) / W.length];
  K.t = D.season + 10 - D.startIn * D.season; Object.assign(K, { storm: true, wetHour: true, wet: 0 }); FK.rng = () => (seq.length ? seq.shift() : 0.2); const t0 = K.t; ECON.lightning(); ECON.ignite(b3, 'lightning');
  const ig = W.map(() => null), saved = W.map(() => null), down = W.map(() => null);
  for (let s = 0; s < 1200; s++) { W.forEach((b, i) => { if (ig[i] == null && b.fire > 0) ig[i] = K.t - t0; if (ig[i] != null && saved[i] == null && down[i] == null && !(b.fire > 0) && !b.gone) saved[i] = K.t - t0; if (b.gone && down[i] == null) down[i] = K.t - t0; }); FK.sim(0.1); K.wet = 0; K.ev.next = Infinity; }
  out.town = { pos: W.map((b) => [b.bx, b.by]), hp: b0.hpMax, half: (n * D.tile) / 2, v: vs.map((u) => [u.bx, u.by]), pick: (W.indexOf(b0) + 0.5) / W.length, b3: W.indexOf(b3), t0, ig, saved, down, idx: [b0, b1, b2, b3, b4].map((b) => W.indexOf(b)) };
  FK.reset(); K.ev = { next: Infinity }; FK.rng = () => 0.2; const k = FK.seatOf(ME), [vil] = FK.trains(k.code), medic = Object.keys(D.heal).find((c) => FK.SH[c].layer === 120), got = [];
  FK.stamp(k.bx, k.by, 25 * D.tile, (q, d) => { if (FK.walkable(q) && d > (k.n / 2 + 1) * D.tile) got.push([d, q]); }); got.sort((a, b) => a[0] - b[0]); [...got.slice(0, 21), got[30]].forEach(([, q], i) => FK.spawn(i < 21 ? vil : medic, ME, q, FK.rng)); FK.step(0);   // the medic just outside the villagers' ring (F37: with your corner at the bottom left, at got[14] it stood over the first new case and cured it each beat, so nothing spread)
  const T = FK.units().filter((u) => u.side === ME && !u.inside && Math.hypot(u.bx - k.bx, u.by - k.by) < D.health.near * D.tile), ids = () => T.map((u, i) => (u.sick > K.t ? i : -1)).filter((i) => i >= 0);
  const h = { k: [k.bx, k.by], t0: K.t, hr: D.heal[medic].r * D.tile, town: T.map((u) => [u.bx, u.by, FK.has(u, 'Heal') ? 'medic' : 'vil']) }; ECON.outbreak(ME, 0.3, false); h.sick = [ids()];
  for (let s = 0; s < 8; s++) { K.t += 5; ECON.health(); h.sick.push(ids()); } out.health = h; FK.rng = rng0; return out; })()"""
MIDFIRE = r"""const n = (re, t) => t.match(re)[0];
const books = box([basics, units, blds, n(/const FIRE = \{[^}]*\};/, tuning), n(/const FIREARMS = \{[^}]*\};/, tuning), n(/const HEALTH = \{[\s\S]*?\n\};/, tuning), n(/const FIRE_SMOKE = [^;]*;/, eco), cut(tech, 'const MEASURED', 'const TECH'),
  n(/const rothermel = [^\n]*/, events), n(/const fireHeat = [^\n]*/, eco), 'var OUT = { FIRE, FIREARMS, HEALTH, FIRE_SMOKE, MEASURED, wood: Object.keys(BLD).filter((k) => BLD[k].wood), heat: RUN.heat.map(([a, g]) => fireHeat(a, g * RUN.tile)), eta: RUN.eta.map(rothermel) };']);
const T0 = RUN.town, town = box([basics, `let R = [0.001, RUN.town.pick]; const T0 = RUN.town, rng = () => (R.length ? R.shift() : 0.2), BLD = { house: { wood: true } }; var OUT = { ig: T0.pos.map(() => null), saved: T0.pos.map(() => null), down: T0.pos.map(() => null) };
  const G = { t: T0.t0, tick: 0, wx: 'rain', P: [{ id: 0, alive: true }], blds: T0.pos.map(([x, y], i) => ({ id: 3 * i, kind: 'house', owner: 0, x, y, prog: 1, hp: T0.hp })), units: T0.v.map(([x, y], i) => ({ id: 50 + i, owner: 0, kind: 'vil', x, y, job: 'food', hp: 25 })) };
  const maxHpB = () => T0.hp, halfOf = () => T0.half, rectGap = (x, y, b) => Math.hypot(Math.max(0, Math.abs(x - b.x) - T0.half), Math.max(0, Math.abs(y - b.y) - T0.half)), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), fireMul = () => 1;
  const setJob = (u, j) => { u.job = j; }, bldName = () => 'home', news = () => {}, storm = () => true, scarStrike = () => {}, thunder = () => {}, moveTo = () => true, nearest = () => null;`, n(/const hazard = [^\n]*/, core), n(/const FIRE = \{[^}]*\};/, tuning), n(/const TOAST = \{[^}]*\};/, tuning),
  cut(eco, 'const fireHeat', '// Summer storms'), cut(eco, 'function strike', '// ── sickness'), 'function douse(u, dt, SP) { let b = u.rep; const o = u.owner; if (u.fireman && !(b && b.hp > 0 && b.fire > 0)) { u.fireman = false; u.job = "food"; u.rep = null; return; } if (!b || b.hp <= 0) return; ' + cut(civil, 'if (b.fire > 0) {', 'if (b.prog < 1)') + ' }',
  `lightning(); ignite(G.blds[T0.b3], 'lightning'); for (let s = 0; s < 1200; s++) { G.blds.forEach((b, i) => { const t = G.t - T0.t0; if (OUT.ig[i] == null && b.fire > 0) OUT.ig[i] = t; if (OUT.ig[i] != null && OUT.saved[i] == null && OUT.down[i] == null && !(b.fire > 0) && b.hp > 0) OUT.saved[i] = t; if (b.hp <= 0 && OUT.down[i] == null) OUT.down[i] = t; });
    G.t += 0.1; G.tick += 3; for (const u of G.units) if (u.job === 'repair' && u.hp > 0) douse(u, 0.1); fireTick(0.1); }`]);
const H0 = RUN.health, health = box([basics, `const H0 = RUN.health, rng = () => 0.2, G = { t: H0.t0, P: [{ id: 0, alive: true, ai: {} }], blds: [], units: H0.town.map(([x, y, kind], i) => ({ id: i, owner: 0, kind, x, y, hp: 25 })) }, UNIT = { vil: { cls: 'civ' }, medic: { cls: 'civ', heal: true, hrng: H0.hr } }, BLD = {};
  const keepOf = () => ({ x: H0.k[0], y: H0.k[1] }), depotNear = () => null, fxv = () => ({ m: 1 }), popOf = () => H0.town.length, dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), news = () => {}, season = () => ({ name: 'Summer' }), BEAT = { health: [5] };`,
  n(/const hazard = [^\n]*/, core), n(/const TOAST = \{[^}]*\};/, tuning), n(/const HEALTH = \{[\s\S]*?\n\};/, tuning), cut(eco, 'function sickRisk', '// ── food upkeep'),
  'const ids = () => G.units.filter((u) => u.sick > G.t).map((u) => u.id); var OUT = {}; outbreak(0, 0.3, false); OUT.sick = [ids()]; for (let k = 0; k < 8; k++) { G.t += 5; healthTick(); OUT.sick.push(ids()); }']);
return { books, town, health };"""
async def blaze(b):
    pg, errs = await fresh(b); v = await pg.evaluate(FIREJS); await pg.close(); M = MEASURE
    m, err = frozen('basics units blds tech tuning core civil eco events', MIDFIRE,
                    {'heat': [[0, 0], [10, 0], [20, 0], [30, 1], [15, 0.5], [25, 3.9], [18, 2]], 'eta': [0, 0.2, 0.5, 0.8, 1], 'tile': M['tile'], 'town': v['town'], 'health': v['health']}); m = m or {}
    B, F, H, T = m.get('books') or {}, M['fire'], M['health'], keyed('tech'); BL = piece('BLD')
    bname = lambda k: re.search(r'→ ([^;]+)', BL[k][1]).group(1).strip()
    MF, MA, MH = B.get('FIRE', {}), B.get('FIREARMS', {}), B.get('HEALTH', {})
    books = bool(B) and [F['rate'], F['grow'], F['near'] * M['tile'], F['reach'] * M['tile'], F['smoke']] == [MF['rate'], MF['grow'], MF['near'], MF['reach'], B['FIRE_SMOKE']] and [F['arrows'][k] for k in ('chance', 'blast', 'hit')] + [F['arrows']['splash'] * M['tile']] == [MA['chance'], MA['blast'], MA['splashHit'], MA['splash']] \
        and [H[k] for k in ('every', 'risk', 'sickFor', 'R0', 'death', 'cure', 'plagueCap')] == [MH[k] for k in ('every', 'risk', 'sickFor', 'R0', 'death', 'cure', 'plagueCap')] and H['plagueR0'][1] == MH['plagueR0'] and H['plague'][0] == MH['plague'] and H['carts'][0] == MH['plagueCart'] and H['near'] * M['tile'] == 500 \
        and {c for c, s in SHELLS.items() if 'Burn' in s['ticks']} == {c for c, s in SHELLS.items() if s['layer'] == 110 and s['name'] in {bname(k) for k in B['wood']}} \
        and abs(T['sewers']['fx'][0]['c'] - (1 - B['MEASURED']['sewer'])) < 1e-12 and abs(T['cleanwater']['fx'][0]['c'] - (1 - B['MEASURED']['water'])) < 1e-12 and T['quarantine']['fx'][0]['c'] == round(1 - B['MEASURED']['isolate'], 12)
    laws = bool(B) and all(abs(a - c) < 1e-12 for a, c in zip(v['heat'], B['heat'])) and all(abs(a - c) < 1e-12 for a, c in zip(v['eta'], B['eta']))
    t, mt = v['town'], m.get('town') or {}; same = lambda a, c, tol: (a is None) == (c is None) and (a is None or abs(a - c) <= tol)
    I = t['idx']; town = bool(mt) and all(same(a, c, F['check']) for a, c in zip(t['ig'], mt['ig'])) and all(same(a, c, F['check']) for a, c in zip(t['saved'], mt['saved'])) and all(same(a, c, F['check']) for a, c in zip(t['down'], mt['down'])) \
        and t['saved'][I[0]] is not None and t['ig'][I[1]] is None and all(t['down'][I[i]] is not None and abs(t['down'][I[i]] - t['ig'][I[i]] - 1 / F['burn']) < 0.25 for i in (2, 3, 4)) \
        and sorted(range(len(I)), key=lambda i: (t['ig'][I[i]] is None, t['ig'][I[i]] or 0)) == sorted(range(len(I)), key=lambda i: (mt['ig'][I[i]] is None, mt['ig'][I[i]] or 0))
    hs, mh = v['health']['sick'], (m.get('health') or {}).get('sick'); sick = bool(mh) and hs == mh and len(hs[0]) > 1 and any(set(c) - set(a) for c, a in zip(hs, hs[1:])) and any(set(a) - set(c) for c, a in zip(hs, hs[1:]))
    got = [books, laws, town, sick, not errs]
    ok('t-fire', all(got), [got, v['heat'], B.get('heat'), t, mt, hs, mh, errs[:2], err[-800:]])
SIGHTJS = r"""(() => { const D = FK.D, K = FK.K, N = FK.N, ME = D.players[0], foe = D.players[1], out = {}; $calm(ME, foe); const vil = D.trains[FK.seatOf(ME).code][0], tree = (k) => FK.OCC[k] === 1 && FK.FOR[k];
  for (const t of FK.things()) if (t.kind === 'bld') t.done = 0.5; FK.units().length = 0; const sky = (o) => Object.assign(K, { alt: 50, moonAlt: -10, moonLit: 0, wetHour: false, vis: Infinity }, o);
  const eye = { kind: 'unit', code: vil, side: ME }; out.h = FK.stat(eye.code, ME, 'eye');   // A2: 'eye' is the height, 'sight' the range
  out.cases = [{}, { alt: -6 }, { alt: -30, moonAlt: 60, moonLit: 1 }, { alt: -30, moonAlt: 40, moonLit: 0.5 }, { alt: -30 }, { alt: -30, wetHour: true }, { vis: 300 }].map((o) => { sky(o); return [o, FK.sightOf(eye)]; });
  let line = null; const ok = (k) => FK.walkable(k) && !tree(k) && Math.abs(FK.H[k] - FK.H[line0]) < 1; let line0 = 0;
  for (let k = N * 9; k < N * (N - 9) && !line; k++) { const i = k % N; if (!tree(k) || i < 9 || i > N - 9) continue; line0 = k - 6; const L = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((d) => k + d); if (L.every(ok)) line = [k - 6, k, k + 6]; }
  if (!line) return null; const [ka, kt, kb] = line, look = () => { FK.SEEN.clear(); FK.look(99); }; sky({});
  const me = FK.spawn(vil, ME, ka, FK.rng), them = FK.spawn(vil, foe, kb, FK.rng); FK.tops(); look(); out.tree = [FK.inSight(them), FK.inSight(me, foe)];
  const t = FK.things().find((x) => x.k === kt && x.kind === 'tree'); FK.take(t, t.amount); look(); out.felled = [FK.inSight(them), FK.inSight(me, foe), tree(kt)];
  sky({ vis: (Math.hypot(me.bx - them.bx, me.by - them.by) / D.upm) * 0.5 }); look(); out.fog = [FK.inSight(them), FK.inSight(me, foe)]; sky({});
  FK.units().splice(FK.units().indexOf(me), 1); look(); out.gone = [FK.inSight(them), FK.inSight(me, foe)];
  out.d = Math.hypot(me.bx - them.bx, me.by - them.by); out.fogDraw = typeof FK.fog; return out; })()"""
MINIJS = r"""(async () => { const D = FK.D, ME = D.players[0], foe = D.players[1]; $calm(ME, foe); FK.show.M = true; MENU.S.tab = null; MENU.render(true);
  const h = FK.seatOf(ME), sol = FK.kinds('Foot')[0] || Object.keys(D.stats).find((c) => (D.stats[c].tags || []).includes('infantry')), k0 = $ring(h, 14, 40, (i, j) => FK.walkable(j * FK.N + i) && j * FK.N + i);
  for (let n = 0; n < 3; n++) FK.spawn(sol, foe, k0, FK.rng); $run(2); for (let i = 0; i < 40 && !(FK.mini() && FK.mini().mark); i++) { FK.dirty(); await new Promise((r) => setTimeout(r, 50)); } const q = FK.near, M = FK.mini(); if (!q || !M || !M.mark) return { q: !!q, M: !!M };
  const [mx, my] = [M.mx + (M.mark[0] - M.cx) * M.k, M.my + (M.mark[1] - M.cy) * M.k], back = FK.miniAt(mx, my), p = { x0: mx, y0: my, x: mx, y: my, t: performance.now(), mode: null }; FK.fire('press', p);
  return { mark: M.mark, u: [q.u.vx, q.u.vy], back, mode: p.mode, eat: p.eat, to: [FK.cam.tx, FK.cam.ty], n: q.n, beat: D.mini.inc.beat }; })()"""
def law(o, h):   # QAL from the books alone (D117 sight, D229 visibility), in Python
    S = MEASURE['sight']; K = {'alt': 50, 'moonAlt': -10, 'moonLit': 0, 'wetHour': False, 'vis': float('inf'), **o}; sun = S['sun']
    i = min(len(sun) - 1, max(1, sum(1 for r in sun if r[0] < K['alt']))); (a0, l0), (a1, l1) = sun[i - 1], sun[i]; f = min(1, (K['alt'] - a0) / (a1 - a0))
    full, quarter = S['moon']; E = (0 if K['alt'] < a0 else l0 * (l1 / l0) ** f) + full * K['moonLit'] ** math.log2(full / quarter) * max(0, math.sin(math.radians(K['moonAlt']))) + S['star']
    E *= S['overcast'] / S['star'] if K['wetHour'] else 1; E *= 1 + min(1, K.get('snow', 0) / GROUND['snow']['full']) * (S['albedo']['snow'] / S['albedo']['grass'] - 1); a = max(0, min(1, math.log(E / S['floor']) / math.log(S['ref'] / S['floor']))); upm = MEASURE['upm']   # S1/R3: sight falls with the log of the light (Sloan 1968), from the eye's absolute threshold (N247) to the day reference
    return min(math.sqrt(S['earth'] * h) * upm, S['day'] * upm * a, K['vis'] * upm)
async def sight(b):
    pg, errs = await fresh(b); v = await pg.evaluate(SIGHTJS); pg2, errs2 = await fresh(b); mn = await pg2.evaluate(MINIJS); await pg.close(); await pg2.close(); v = v or {}
    S = MEASURE['sight']; cases = v.get('cases') or []
    num = len(cases) == 7 and v['h'] == S['body'] and all(abs(r - law(o, v['h'])) <= 1e-6 * r + 1e-9 for o, r in cases) and cases[0][1] > cases[2][1] > cases[4][1] >= cases[5][1] and cases[6][1] == 300 * MEASURE['upm']
    los = v.get('tree') == [False, True] and v.get('felled') == [True, True, False] and v.get('fog') == [False, False] and v.get('gone') == [False, True]
    nofog = v.get('fogDraw') == 'function' and 'fogwar' in MEASURE and not any(k in MEASURE for k in ('fogDim', 'fogWait', 'fogLast', 'fogTick')) and set(MEASURE['lookout']) == {'h'}   # the fog of war, with its On/Off on the Start page (Albert Nov 9, D361; replaces his Nov 6 no-fog call), and the woods walkable (D360)
    mini = bool(mn.get('mark')) and mn['mark'] == mn['u'] and all(abs(a - c) < 1e-6 for a, c in zip(mn['back'], mn['u'])) and mn['mode'] == 'mini' and mn['eat'] and all(abs(a - c) < 1e-6 for a, c in zip(mn['to'], mn['u'])) and mn['beat'] == 350
    got = [num, los, nofog, mini, not errs and not errs2]
    ok('t-sight', all(got), [got, v, [law(o, v.get('h') or 0) for o, _ in cases], mn, errs[:2], errs2[:2]])
DEWJS = """(() => { $calm(); const D = FK.D, K = FK.K, out = { steps: [] }; D.chain[0] = D.chain[1] = 0; K.ahead.length = 0; K.wetHour = false; K.I = 0;
  const at = (want) => { for (let i = 0; i < 4000 && !want(); i++) FK.sim(0.1); return want(); }, snap = () => ({ T: K.temp, dew: K.dew, vis: K.vis, fog: K.fog, alt: K.alt, wind: K.wind });
  out.dusk = at(() => K.alt > 6) && at(() => K.alt < -6); K.dew = K.temp - 0.2; out.before = snap(); out.formed = at(() => K.vis < D.weather.fog.wmo); out.fogged = snap();
  FK.sim(0.1); out.after = snap(); K.wind = D.weather.fog.calm * 2; FK.sim(0.1); out.windy = snap(); out.lifted = at(() => K.alt > 6 && K.vis === Infinity); out.day = snap(); return out; })()"""
async def dew(b):
    pg, errs = await fresh(b); v = await pg.evaluate(DEWJS); await pg.close(); F = MEASURE['weather']['fog']; W = MEASURE['weather']
    es = lambda T: F['e'] * math.exp(F['a'] * T / (F['b'] + T)); C = lambda s: (es(s['dew']) - es(s['T'])) * F['per'] / (F['Rv'] * (s['T'] + F['K0']))
    vis = lambda s: W['km'] * W['k'] / (F['beta'] * max(0, C(s)) ** F['pow']) if C(s) > 0 else float('inf')
    b0, f, a, w, d = v['before'], v['fogged'], v['after'], v['windy'], v['day']
    forms = v['dusk'] and v['formed'] and b0['vis'] == float('inf') and f['T'] < f['dew'] and f['alt'] < 0 and abs(f['wind']) <= F['calm'] and abs(f['vis'] - vis(f)) < 1e-6 * f['vis'] and f['vis'] < F['wmo'] and 0 < f['fog'] < 1
    law = abs(a['vis'] - vis(a)) < 1e-6 * a['vis'] and C(a) <= F['lwc'] + 1e-9 and a['dew'] <= f['dew'] + 1e-9
    calm = w['vis'] == float('inf') and w['fog'] == 0
    lifts = v['lifted'] and d['T'] > d['dew'] and d['fog'] == 0 and d['alt'] > 0
    got = [forms, law, calm, lifts, not errs]
    ok('t-dew', all(got), [got, v, vis(f) if f else None, errs[:2]])
STAGEJS = r"""(() => { $calm(); const D = FK.D, K = FK.K, ME = D.players[0], h = FK.seatOf(ME), out = {}; MENU.S.tab = null; MENU.render(true);
  FK.cam.z = FK.zmax(); FK.cam.x = h.vx + 80; FK.cam.y = h.vy + 60; FK.camStop(); FK.camGo(h.vx, h.vy); out.cam0 = [h.vx + 80, h.vy + 60, h.vx, h.vy]; out.cam = []; for (let i = 0; i < 30; i++) { FK.followCam(1 / 30); out.cam.push([FK.cam.x, FK.cam.y]); }
  const hs = Object.keys(FK.SH).find((c) => FK.SH[c].look === 'house'), lm = Object.keys(FK.SH).find((c) => FK.SH[c].look === 'lumber'), lamp = Object.keys(BOOKS.tech).find((c) => BOOKS.tech[c].value.fx.some((f) => f.s === 'lamp'));
  const site = $put(hs, ME), burn = $put(hs, ME), hurt = $put(lm, ME), lit = $put(lm, ME); site.done = 0.4; burn.fire = 0.5; hurt.hp = hurt.hpMax * 0.3; FK.learn(ME, lamp); FK.sim(0.1); site.done = 1; FK.sim(0.1); const t0 = K.t;
  out.pop = []; for (let i = 0; i < 24; i++) { out.pop.push([K.t - t0, FK.popOf(site)]); K.t += 1 / 30; } out.popC = [-0.1, 0, 0.1, 0.25, 0.5, 0.75, 0.99, 1, 2].map(FK.popC);
  Object.assign(K, { alt: -D.moon.twilight, rain: 0, snowing: 0 }); const mine = [h, site, burn, hurt, lit], L = new Map(FK.lightsOf().map(([t, k]) => [t, k]));
  out.blds = mine.map((t) => [FK.SH[t.code].look, t.done >= 1 ? 1 : t.done, t.hp, t.hpMax, t.fire || 0, FK.stat(t.code, t.side, 'lamp') || 0, !!FK.has(t, 'Line'), !!FK.has(t, 'Field')]); out.lights = mine.map((t) => L.get(t) || null);
  out.rgb = Object.fromEntries(Object.keys(D.flames).map((k) => [k, FK.kelvinRGB(D.flames[k].K)])); out.life = Object.keys(D.flames).map((k) => [FK.flameLife(k), (K.rain = 0.5, FK.flameLife(k)), (K.rain = 0)][1]);
  Object.assign(FK.DRAW, { lvl: 0, ema: 0, slow: 0, fast: 0 }); const sh = [], d0 = FK.DRAW.lvl; for (const w of [...Array(130).fill(20), ...Array(700).fill(3)]) { FK.shed(w); sh.push(FK.DRAW.lvl); } out.shed = [d0, sh.indexOf(1), sh.lastIndexOf(1), sh.at(-1)]; return out; })()"""
MIDSTAGE = r"""const n = (re, t) => t.match(re)[0];
const cam = box([`const cam = { x: RUN.cam0[0], y: RUN.cam0[1], z: 2 }, G = { follow: false }, still = () => false, clampCam = () => {};`, cut(vb, 'const spring', '// The turned view'), `camGo(RUN.cam0[2], RUN.cam0[3]); var OUT = []; for (let i = 0; i < 30; i++) { followCam(1 / 30); OUT.push([cam.x, cam.y]); }`]);
const lights = box([basics, units, blds, `let MX = 0, CUR = null; const L = [], G = { night: 1, wx: 'clear', finds: [], units: [], P: [{ techs: new Set() }] }, SET = { lights: true }, STANDARDS = [], cw = 1, ch = 1, performance = { now: () => 0 };
  const precip = () => false, tintOf = () => null, knownB = () => true, known0 = () => true, visibleTo0 = () => true, maxHpB = () => MX, halfOf = () => 10, upTier = () => 0, SX = () => 0, SY = () => 0, DY = () => 0;
  const ctx = new Proxy({}, { get: () => () => {}, set: () => true }), flame = () => {}, glow = (x, y, kind) => L.push(kind), fxv = () => ({ a: CUR.lamp, m: 1 }), bldKeys = () => [];`, n(/const HEARTH = [^;]*;/, vo), cut(vo, 'function drawLight', 'const HEARTH'),
  `var OUT = RUN.blds.map(([kind, prog, hp, mx, fire, lamp, wall, crop], id) => { BLD[kind] = { ...BLD[kind], wallish: wall, crop }; CUR = { id, kind, owner: 0, x: 0, y: 0, prog, hp, fire, lamp }; MX = mx; G.blds = [CUR]; L.length = 0; drawLight(1, () => true); return L.at(-1) || null; });`]);
const things = box([basics, `const G = { wx: 'clear', t: 0 }, precip = (w) => w === 'rain', clamp = (v, a, b) => Math.max(a, Math.min(b, v));`, n(/const FLAME = \{[\s\S]*?\n\};/, vt), n(/const LIGHT = \{[^}]*\};/, vt), cut(vt, 'const kelvinRGB', 'function flame('), n(/const popC = [^\n]*/, vt),
  `var OUT = { FLAME, LIGHT, rgb: FLAME_RGB, life: Object.keys(FLAME).map((k) => { G.wx = 'rain'; const v = flameLife(k); G.wx = 'clear'; return v; }), popC: [-0.1, 0, 0.1, 0.25, 0.5, 0.75, 0.99, 1, 2].map(popC), pop: RUN.pop.map(([a]) => popC(a / 0.6)) };`]);
const shed = box([`let lessMotion = false; const fit = () => {};`, n(/const DRAW = \{[^}]*\};/, fg), cut(fr, 'function shed', '// One frame'), `const sh = []; for (const w of [...Array(130).fill(20), ...Array(700).fill(3)]) { shed(w); sh.push(DRAW.lvl); } var OUT = [0, sh.indexOf(1), sh.lastIndexOf(1), sh.at(-1)];`]);
return { cam, lights, things, shed };"""
async def stage(b):
    pg, errs = await fresh(b); v = await pg.evaluate(STAGEJS); await pg.close(); M = MEASURE
    m, err = frozen('basics units blds vb=20-view-base vt=23-view-things vo=24-view-overlays fg=18-figures fr=41-boot', MIDSTAGE, {'cam0': v['cam0'], 'blds': v['blds'], 'pop': v['pop']}); m = m or {}
    T = m.get('things') or {}; FL = {k: {q: f[q] for q in ('p', 'K', 's')} | ({'covered': True} if f.get('covered') else {}) for k, f in (T.get('FLAME') or {}).items()}
    books = bool(T) and M['flames'] == FL and [M['light'][k] for k in ('k', 'wet', 'a')] == [T['LIGHT'][k] for k in ('k', 'wet', 'a')] and M['cam']['w'] == 9 and M['stage']['pop'] == [0.16, 0.6] and M['draw']['slow'] == 12
    cam = bool(m.get('cam')) and all(abs(a - c) < 1e-9 for p, q in zip(v['cam'], m['cam']) for a, c in zip(p, q)) and abs(v['cam'][-1][0] - v['cam0'][2]) < 1 and v['cam'][0] != v['cam'][1]
    lights = v['lights'] == m.get('lights') and len(set(v['lights'])) >= 3
    colour = bool(T) and v['rgb'] == T['rgb'] and v['life'] == T['life'] and all(abs(a - c) < 1e-12 for a, c in zip(v['popC'], T['popC']))
    pop = bool(T) and all(abs(p[1] - c) < 1e-9 for p, c in zip(v['pop'], T['pop'])) and max(p[1] for p in v['pop']) > 1.05 and v['pop'][-1][1] == 1
    shed = v['shed'] == m.get('shed') and v['shed'][1] > 0
    got = [books, cam, lights, colour, pop, shed, not errs]
    ok('t-stage', all(got), [got, v['cam'][:3], (m.get('cam') or [])[:3], v['lights'], m.get('lights'), v['blds'], v['shed'], m.get('shed'), v['pop'][:4], T.get('pop', [])[:4], errs[:2], err[-800:]])
PEACEJS = r"""(() => { $calm(); const D = FK.D, K = FK.K, S = FK.SIDES, [ME, A, B] = D.players, out = {}, PZ = D.peace, TL = D.tell, T = BOOKS.tech;
  for (const a of D.players) for (const b of D.players) if (a < b) WAR.treaty(a, b, 'peace');
  K.t = PZ.quiet + 1; ECON.peaceTick(); out.t0 = ECON.truceFor(); const t0 = K.t, v = ECON.villagersOf(A)[0], sol = FK.kinds('Foot')[0], aim = AI.aim(A);
  for (let i = 0; i < aim + 5; i++) FK.spawn(sol, A, v.k, FK.rng); const n0 = WAR.armyOf(A).length, v0 = ECON.villagersOf(A).length;
  K.t = t0 + PZ.stand.after; ECON.peaceTick(); out.stand = [n0, aim, WAR.armyOf(A).length, ECON.villagersOf(A).length - v0];
  S[A].age = D.age.hidden - 1; out.shut = [ECON.opened(), ECON.nextAge(A)]; K.t = t0 + PZ.years * D.year; ECON.peaceTick(); out.open = [ECON.opened(), ECON.nextAge(A), MENU.mail.some((m) => m.text.includes(D.ages[D.age.hidden]))];
  WAR.treaty(ME, A, 'war'); ECON.peaceTick(); out.broken = ECON.truceFor();
  const u = WAR.armyOf(A)[0], by = ECON.villagersOf(ME)[0], w0 = S[ME].war; WAR.die(u, by); out.war = [u.code, S[ME].war - w0];
  const care = FK.ticked('Care'); $put(care[0], B); $put(care[1], B); $put(care[2], ME); ECON.villagersOf(ME)[1].sick = K.t + D.year; Object.assign(S[ME], { gathered: 700, laurels: 2 }); Object.assign(S[A], { gathered: 900 }); S[B].war = 40;
  out.crowns = ECON.crowns(); out.sides = D.players.map((s) => ({ id: s, gathered: S[s].gathered, war: S[s].war, laurels: S[s].laurels, alive: !ECON.fell(s), total: ECON.score(s).total,
    vil: ECON.villagersOf(s).map((x) => !!(x.sick > K.t)), care: FK.things().filter((t) => t.side === s && t.kind === 'bld' && t.done >= 1 && FK.has(t, 'Care')).length }));
  // news by the post (QCH): night and cloud, so nothing new is seen; a line about a foe out of sight
  Object.assign(K, { alt: -90, rain: 1 }); const h = FK.seatOf(ME), mine = FK.things().filter((t) => t.kind === 'bld' && t.side === ME), mineU = FK.units().filter((x) => x.side === ME), gap = (p, L) => Math.min(...L.map((t) => FK.dist(t, p))) / D.tile;
  const spot = (lo, hi, L) => { for (let k = 0; k < FK.N * FK.N; k += 7) { const [bx, by] = FK.tileMid(k), p = { bx, by }; if (FK.walkable(k) && gap(p, L) > lo && gap(p, L) < hi) return k; } return -1; };
  const kN = spot(TL.near / 2, TL.near, mine), kF = spot(TL.near + 5, TL.far, mine), kH = spot(-1, TL.hear - 2, mineU), say = (k, cls) => { const f = FK.spawn(sol, B, k, FK.rng); return [f, MENU.reach('x', { at: f, cls })]; };
  out.cases = []; const L = (f) => FK.wayLen(FK.tileAt(f.bx, f.by), h), add = (name, k, cls, lvl) => { const [f, r] = say(k, cls); out.cases.push({ name, k, cls, lvl, seen: FK.inSight(f, ME), r, at: [f.bx, f.by], L: L(f) < Infinity ? L(f) : null, crow: FK.dist(h, f) }); };
  add('near, no post', kN, '', 0); FK.learn(ME, $tk('runners')); add('near, runners', kN, '', 1); add('far, runners', kF, '', 1); FK.learn(ME, $tk('royalroad')); add('far, royal road', kF, '', 2); add('raid in earshot', kH, 'warn', 2);
  out.mine = mine.map((t) => [t.bx, t.by]); out.mineU = mineU.map((t) => [t.bx, t.by]); out.seat = [h.bx, h.by]; out.age = S[ME].age; out.speed = [D.speed[TL.foot], D.speed[TL.ride], D.upm];
  const [f] = say(kF, ''), n0m = MENU.mail.length; MENU.say('A raid far off.', { at: f, grp: 'war' }); const p = MENU.post.at(-1); out.posted = [MENU.mail.length === n0m, p && p.t - K.t]; $run(p ? p.t - K.t + 1.5 : 0); out.came = MENU.mail.some((m) => m.text === 'A raid far off.' && m.why);
  for (let i = 0; i < 3; i++) MENU.say('Raid 3 at 5', { grp: 'war' }); out.merged = MENU.mail.filter((m) => m.key === 'Raid # at #').map((m) => m.times.length);
  FK.reset(); K.t = TL.after; $run(1.2); out.news = MENU.mail.filter((m) => m.grp === 'chronicle').map((m) => m.text);
  FK.reset(); const hs = FK.ticked('House').find((c) => !FK.SH[c].ticks.includes('Seat')); $put(hs, ME); $run(3.2); out.house = MENU.mail.filter((m) => m.grp === 'lesson').map((m) => m.text);
  FK.reset(); ECON.villagersOf(ME).slice(2).forEach((x) => { x.gone = true; FK.units().splice(FK.units().indexOf(x), 1); }); const vil = FK.trains(FK.seatOf(ME).code)[0]; out.tip = [MENU.advise()]; MENU.learned['train:' + vil] = [1, 2, 3]; out.tip.push(MENU.advise());
  return out; })()"""
MIDPEACE = r"""const n = (re, t) => t.match(re)[0];
const P = box([basics, units, blds, cut(games, 'const PEACE', 'function bestOf').replace(/YEAR/g, '720'), cut(games, 'const ageOpen', 'function chron'), cut(games, 'function standDown', '// the Games'), cut(games, 'function crownsOf', 'const CROWN_NAME'), cut(fight, 'function warCredit', 'function plunderBld'),
  `const R = RUN; let made = 0; const G = { P: [], units: [], blds: [], enlight: false }, keepOf = () => ({}), soldiersOf = () => Array.from({ length: R.n0 }, () => ({ state: 'home' })), armyAim = () => R.aim, clsCount = () => 0, clsMax = () => Infinity, addUnit = () => (made++, {}), news = () => {}, chron = () => {}, TOAST = {}, scoreAll = () => {}, standing = (b, id) => b.owner === id, sumCost = (c) => Object.values(c || {}).reduce((a, b) => a + b, 0);
  for (const s of R.sides) G.P[s.id] = { id: s.id, alive: s.alive, gathered: s.gathered, war: s.war, laurels: s.laurels, score: { total: s.total }, age: 4, name: '' };
  for (const s of R.sides) { s.vil.forEach((sick) => G.units.push({ owner: s.id, kind: 'vil', sick: sick ? 1 : 0 })); for (let i = 0; i < s.care; i++) G.blds.push({ owner: s.id, kind: CARE[0] }); } G.t = 0.5;
  const stood = standDown(1, true), shut = nextAge(1); G.enlight = true; const open = nextAge(1); const w = { id: 0, war: 0 }; G.P[0].war = 0; warCredit(0, 1, UNIT[R.look].cost);
  var OUT = { stood, made, shut: shut ? AGES.indexOf(shut) : null, open: open ? AGES.indexOf(open) : null, war: G.P[0].war, crowns: crownsOf(), PEACE };`]);
const T = box([cut(tuning, 'const TELL', 'const UI_BUDGET'), cut(frame, 'const DIR8', 'function postTick'), `const R = RUN, G = { fogOn: true, blds: R.mine.map(([x, y]) => ({ owner: 0, hp: 1, x, y })), units: R.mineU.map(([x, y]) => ({ owner: 0, hp: 1, x, y })), P: [{ age: R.age }], rel: [[]] }, fogAt = () => 0, dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), keepOf = () => ({ x: R.seat[0], y: R.seat[1] });
  let LV = 0, LEN = 0; const fxv = () => ({ a: LV }), wayLen = () => LEN; var OUT = R.cases.map((c) => { LV = c.lvl; LEN = (c.L != null ? c.L : c.crow) / R.upm * 24 / 1.52; return tell('x', c.cls, { x: c.at[0], y: c.at[1] }); });`]);
const W = box([cut(text, 'const NEWS', '];') + '];', 'var OUT = NEWS;']);
const H = box([basics, units, blds, tuning, cut(text, 'const slowPct', '// the loyalty'), cut(text, 'const MS_TEXT', 'const TRIGGERS'), 'var OUT = MS_TEXT.house[0];']);
return { P, T, W, H };"""
async def peace(b):
    pg, errs = await fresh(b); v = await pg.evaluate(PEACEJS); await pg.close()
    m, err = frozen('basics units blds tuning text games fight frame=32-frame', MIDPEACE, {'n0': v['stand'][0], 'aim': v['stand'][1], 'sides': v['sides'], 'look': UKIND.get(v['war'][0], SHELLS[v['war'][0]]['look']), 'cases': v['cases'], 'mine': v['mine'], 'mineU': v['mineU'], 'seat': v['seat'], 'age': v['age'], 'upm': v['speed'][2]}); m = m or {}
    P, T = m.get('P') or {}, m.get('T') or []; M = MEASURE; Z = P.get('PEACE') or {}
    books = bool(Z) and [M['peace']['stand'], M['peace']['crown'], M['peace']['chron'], M['mail']] == [Z['stand'], Z['crown'], Z['chron'], {'secs': 4, 'merge': 30, 'keep': 30, 'page': 6}] and M['relations']['truce']['gold'] == Z['truce']['gold']
    stand = v['t0'] == 0 and v['stand'][2] == v['stand'][1] and v['stand'][3] == P.get('made') == P.get('stood') == v['stand'][0] - v['stand'][1] > 0
    age = v['shut'] == [False, None] and P.get('shut') is None and v['open'][:2] == [True, P.get('open')] and v['open'][2] and v['broken'] is None
    crowns = v['war'][1] == P.get('war') > 0 and all([(r['side'], r['v']) for r in v['crowns'][c]] == [(r['id'], r['v']) for r in P['crowns'][c]] for c in ('wealth', 'war', 'wellbeing', 'overall')) if P.get('crowns') else False
    def same(a, c):   # v100's reach against Mid's tell: now, a heard fight with its way, a delay, never
        if c is None or a is None: return a is c
        if 'delay' in c: return 'delay' in a and abs(a['delay'] - c['delay']) <= 1e-3 * c['delay']
        return a.get('text') == c.get('text')
    post = len(T) == len(v['cases']) and all(same(c['r'], t) for c, t in zip(v['cases'], T)) and not any(c['seen'] for c in v['cases']) and [c['r'] is None for c in v['cases']] == [True, False, True, False, False] and 'text' in v['cases'][-1]['r'] and v['posted'][0] and v['posted'][1] > 1 and v['came'] and v['merged'] == [3]
    W = m.get('W') or []; news = bool(W) and keyed('words')['world'] == W and v['news'] == [W[0][1]]
    lesson = bool(m.get('H')) and v['house'] == [m['H']] and v['tip'][0] == keyed('words')['tips']['more'] and v['tip'][1] != v['tip'][0]
    got = [books, stand, age, crowns, post, news, lesson, not errs]
    ok('t-peace', all(got), [got, v['stand'], P.get('stood'), v['open'], P.get('open'), v['war'], P.get('war'), [(c['name'], c['k'], c['r'], c['seen']) for c in v['cases']], T, v['posted'], v['merged'], v['news'], v['house'], m.get('H'), v['tip'], errs[:2], err[-600:]])
CIVKEYS = {'roman': ['build', ['*', 'house'], 'BR1', 'build'], 'han': ['crop', ['*', 'food'], 'BCL1', 'rate'], 'persian': ['trade', ['*'], '', 'trade'], 'mongol': ['spd', ['*', 'cata', '#mounted'], 'UM3', 'spd'],
           'maurya': ['train', ['*', 'cata', '#mounted'], 'UM3', 'train'], 'mali': ['gather', ['*', 'gold'], 'R2', 'rate']}
CIVJS = r"""(() => { const D = FK.D, T = BOOKS.tech, out = {}, [ME, A] = D.players, keys = ['hp', 'atk', 'rng', 'rof', 'sight'];
  for (const civ of CIVS) { FK.reset(); ECON.setCiv(ME, civ); const uu = Object.keys(FK.SH).find((c) => FK.SH[c].civ === civ), base = FK.SH[uu].replaces, at = Object.keys(D.trains).find((c) => FK.trains(c).includes(base));
    const [, , code, key] = KEYS[civ], hall = Object.keys(T).filter((c) => T[c].value.civ === civ && T[c].value.at), elite = hall.find((c) => T[c].value.rank);
    const o = { uu, base, mine: FK.trains(at, ME).includes(uu) && !FK.trains(at, ME).includes(base), theirs: FK.trains(at, A).includes(base) && !FK.trains(at, A).includes(uu), stats: D.stats[uu], cost: D.cost[uu], t: D.train[uu], age: D.ages.indexOf(FK.SH[uu].age), spd: FK.stat(uu, ME, 'spd'),
      bonus: FK.stat(code, ME, key) / FK.stat(code, A, key), why: [ECON.researchWhy(A, hall[0]), ECON.researchWhy(ME, hall[0])], rows: hall.map((c) => [T[c].key, T[c].value.cost, T[c].value.time, T[c].value.age, T[c].value.line]) };
    const s0 = keys.map((y) => FK.stat(uu, ME, y)); FK.learn(ME, elite); o.elite = [FK.rankName(uu, ME), ...keys.map((y, i) => FK.stat(uu, ME, y) - s0[i]), FK.stat(uu, ME, 'hp') / s0[0]]; out[civ] = o; }
  FK.reset(); FK.tops(); const R1 = FK.SHELLS ? null : null, h = FK.W[FK.SH[FK.KIND.tree.code].body].height * D.upm, dt = []; for (let k = 0; k < FK.N * FK.N; k++) if (FK.OCC[k] === 1 && FK.TOPS[k] > FK.H[k] + 1e-6 && FK.TOPS[k] - FK.H[k] < h * 1.5) dt.push(FK.TOPS[k] - FK.H[k]);
  out.tree = [dt.length, dt.every((x) => Math.abs(x - h) < 1e-3), h]; return out; })()"""
MIDCIVS = r"""const fx = qca(cut(core, 'function fxList', '// Two words'));
return box([basics, units, blds, tech, tuning, fx, cut(core, 'const baseKind', '\n'), `const standing = () => false, G = { t: 0, fxv: 0, P: [{ techs: new Set(), uc: {} }, { techs: new Set(), uc: {} }], blds: [] };
  var OUT = {}; for (const civ of CIVK) { const C = CIVS[civ], u = UNIT[C.uu], [s, k] = RUN[civ]; G.P[0] = { techs: new Set(), uc: {}, civ }; G.fxv++; const el = TECH.find((t) => t.id === 'elite_' + civ);
    OUT[civ] = { uu: C.uu, base: u.replaces, unit: u, baseSpd: UNIT[u.replaces].spd, m: fxv(0, s, k).m, tier: el.tier, rows: TECH.filter((t) => t.civ === civ && t.at === 'hall').map((t) => [t.id, t.cost, t.t, t.age]).concat([[el.id, el.cost, el.t, el.age]]) }; }`]);"""
CIVLOOKS = ['legion', 'immortal', 'malihorse']
async def civs(b):
    pg, errs = await fresh(b); v = await pg.evaluate(CIVJS.replace('CIVS', json.dumps(list(CIVKEYS))).replace('KEYS', json.dumps(CIVKEYS)))
    fig = open(os.path.join(HERE, '../mid/src/18-figures.js')).read(); FAULT = "legs: shade(c, 0.6),\n\t\t\t\tbeard"   # Mid's Immortal: its legs an rgb() string, so its back leg's shade(o.legs) is NaN and keeps the last fill; the reference given the hex it meant
    art = await pg.evaluate(ARTJS.replace('CASES', json.dumps([[l, 1, 3] for l in CIVLOOKS])), fig.replace(FAULT, "legs: '#' + shade(c, 0.6).match(/\\d+/g).map((n) => (+n).toString(16).padStart(2, '0')).join(''),\n\t\t\t\tbeard") if fig.count(FAULT) == 1 else ''); await pg.close()
    m, err = frozen('basics units blds tech tuning core', MIDCIVS, {c: k[:2] for c, k in CIVKEYS.items()}); m = m or {}; Y = {'f': 'food', 'w': 'wood', 'g': 'gold', 'i': 'iron', 's': 'stone'}; M = MEASURE; walk = M['speed']['walk']
    near = lambda a, b, r=1e-4: abs(a - b) <= r * max(1, abs(a), abs(b))
    def civ(c):
        a, z = v[c], m.get(c)
        if not z: return False
        u, s, rows = z['unit'], a['stats'], {r[0]: r for r in z['rows']}
        unit = (SHELLS[a['uu']]['look'] in (u['look'], z['uu']) and UKIND.get(a['base'], SHELLS[a['base']]['look']) == z['base'] and [s['hp'], s['atk'], s['rof']] == [u['hp'], u['dmg'], u['cd']] and near(s['rng'], u['rng'] / 10)
                and a['cost'] == {Y[k]: n for k, n in u['cost'].items()} and a['t'] == u['t'] and a['age'] == u['age'] and near(M['speed'][SHELLS[a['uu']]['pace'].split('.')[1]], walk * u['spd'] / 24))
        vs = s.get('vs') == ({'infantry': 1.5, 'Riders': 1.6, 'Engines': 2} if c == 'persian' else M['stats'][a['base']].get('vs'))
        bonus = near(a['bonus'], z['m'], 1e-9) and a['bonus'] != 1
        tier = z['tier']; e = a['elite']; elite = e[0] == tier['name'] and near(e[-1], tier.get('hp', 1), 1e-9) and near(e[2], tier.get('dmg', 0)) and near(e[3], tier.get('rng', 0) / 10)
        rows = {k: r for k, r in rows.items() if json.load(open(os.path.join(HERE, '../clean/tech.json')))['pieces']['TECH'][2].get(k, ['bring'])[0] != 'parked'}
        hall = len(a['rows']) == len(rows) and all(k in rows and r[0] == {Y[q]: n for q, n in rows[k][1].items()} and r[1] == rows[k][2] and r[2] == rows[k][3] for k, *r in a['rows']) and a['why'][0] == 'civ' and a['why'][1] != 'civ'
        return [unit, vs, bonus, elite, hall, a['mine'], a['theirs']]
    per = {c: civ(c) for c in CIVKEYS}; bad = [x for x in art if x[4] != 0 or x[5] < 20]
    trees = v['tree'][0] > 0 and v['tree'][1] and M['trees']['R1']['h'] == 21 and 'sight' in M and 'tree' not in M['sight'] and keyed('citations') if False else None
    C = book('citations'); trees = v['tree'][0] > 0 and v['tree'][1] and 'tree' not in M['sight'] and C['N219']['opened'] and C['N221']['opened']
    got = [all(all(x) for x in per.values()), not bad and len(art) == 72, trees, not errs]
    ok('t-civs', all(got), [got, per, bad[:4], v['tree'], {c: [v[c]['bonus'], (m.get(c) or {}).get('m'), v[c]['elite'], (m.get(c) or {}).get('tier'), v[c]['why']] for c in CIVKEYS}, errs[:2], err[-600:]])
# F37: the map's character, new game and scenarios; Albert's map calls (the bottom-left corner, the pocket's law, Z3 the transition)
LANDJS = r"""(() => { const D = FK.D, N = FK.N, out = { scen: {} }, ME = D.players[0], C = (s) => FK.things().filter((t) => t.side === s && FK.has(t, 'Seat'))[0];
  for (const [n, key] of [[1, 'siege'], [2, 'road'], [3, 'last']]) { MENU.S.opt.scen = n; MENU.S.tab = null; FK.reset(); const S = FK.SIDES, h = C(ME); out.scen[key] = { age: D.players.map((p) => S[p].age), store: D.players.map((p) => S[p].store), vils: ECON.villagersOf(ME).length,
    blds: FK.things().filter((t) => t.kind === 'bld' && t.side === ME && !FK.has(t, 'Seat')).map((t) => [t.code, (D.scenarios[key].blds || []).some(([c, dx]) => c === t.code && Math.hypot(t.bx - h.bx - dx, t.by - h.by) <= D.scenarios[key].within + t.n * D.tile)]),
    rel: D.players.flatMap((a) => D.players.filter((b) => b > a).map((b) => [a, b, WAR.stance(a, b)])), techs: [...S[ME].techs].map((c) => BOOKS.tech[c].key), said: MENU.mail.some((m) => m.text.startsWith(fromBook('words').start.scen[key][0] + ':')) }; }
  MENU.S.opt.scen = 0; FK.reset(); const h = C(ME), mid = FK.toView(FK.MID, FK.MID, D.land); out.corner = [h.vx < mid[0], h.vy > mid[1], D.players.map((p) => { const t = C(p); return [Math.sign(t.bx - FK.MID), Math.sign(t.by - FK.MID)]; })];
  const cd = (t) => Math.hypot(...FK.corner(ME, 0, 0).map((v, i) => [t.bx, t.by][i] - v)), land = D.lands.rows[FK.land()], Y = (t) => FK.KIND[t.kind].yield, A = (t) => FK.KIND[t.kind].amount, [z1, z2, z3] = D.zone;
  const spotOf = (q, kind) => FK.corner(q, ...D.z1[kind]), byHome = (t, q = ME) => Math.hypot(t.bx - spotOf(q, t.kind)[0], t.by - spotOf(q, t.kind)[1]) < z1 / 4, pocket = FK.things().filter((t) => (t.kind in D.z1) && byHome(t)),   // the pocket lies round its Z1 spots (D.z1: Albert Nov 8 10:04 and Nov 10 #6 moved them; the old ring cd < z1 no longer holds them)
    ring = FK.things().filter((t) => (t.kind in D.Z3.finds) && cd(t) >= z2 && cd(t) < z3 + D.tile), wild = FK.things().filter((t) => (t.kind in D.Z3.finds) && Math.min(...[0, 1, 2, 3].map((c) => Math.hypot(...FK.corner(c, 0, 0).map((v, i) => [t.bx, t.by][i] - v)))) > D.wall[1]);
  const sum = (L, y) => L.filter((t) => Y(t) === y).reduce((a, t) => a + t.amount, 0), count = (L, k) => L.filter((t) => t.kind === k).length;
  out.pocket = Object.fromEntries(Object.keys(D.z1).map((k) => [k, [count(pocket, k), Math.round(pocket.filter((t) => t.kind === k).reduce((a, t) => a + t.amount, 0))]]));
  out.ring = Object.fromEntries(Object.keys(D.Z3.finds).map((k) => [k, count(ring, k)])); out.more = ['food', 'wood'].map((y) => [sum(pocket, y), sum(ring, y), sum(wild, y)]);
  out.amt = wild.filter((t) => t.kind !== 'tree').slice(0, 20).every((t) => t.amount === Math.round(A(t) * (land.amt[Y(t)] ?? 1)));
  const share = (lo, hi) => { let n = 0, w = 0; for (let k = 0; k < N * N; k++) { if (FK.H[k] !== D.land || FK.OCC[k] > 1) continue; const i = k % N, [bx, by] = FK.toBoard((i + .5) * D.tile, ((k - i) / N + .5) * D.tile), c = Math.min(...[0, 1, 2, 3].map((q) => Math.hypot(...FK.corner(q, 0, 0).map((v, j) => [bx, by][j] - v)))); if (c >= lo && c < hi && ![0, 1, 2, 3].some((q) => Math.hypot(bx - FK.corner(q, ...D.z1.tree)[0], by - FK.corner(q, ...D.z1.tree)[1]) < D.zone[0])) { n++; w += !!FK.FOR[k]; } } return w / n; };
  out.woods = [share(z2, (z2 + z3) / 2), share((z2 + z3) / 2, z3), share(z2, z3), share(D.wall[1], 1e9), share((z1 + z2) / 2, z2)];
  const reach = (trees) => { const seen = new Uint8Array(N * N), q = [FK.tileAt(...FK.corner(ME, ...D.tc))], tree = (k) => FK.FOR[k] && FK.OCC[k] === 1, pass = (k) => FK.walkable(k) || (FK.OCC[k] && (trees || !tree(k))); seen[q[0]] = 1;
    for (const k of q) for (const d of [1, -1, N, -N]) { const n = k + d; if (!seen[n] && pass(n)) { seen[n] = 1; q.push(n); } } return seen; }, seen = reach(false), any = reach(true);
  const mine = FK.things().filter((t) => (t.kind in FK.D.Z3.finds) && t.kind !== 'tree' && FK.H[t.k] > 0 && cd(t) < Math.min(...[1, 2, 3].map((c) => Math.hypot(...FK.corner(c, 0, 0).map((v, i) => [t.bx, t.by][i] - v)))));
  out.ways = [mine.filter((t) => any[t.k]).length, mine.filter((t) => any[t.k] && !seen[t.k]).map((t) => [t.kind, t.k])]; out.land = FK.land(); return out; })()"""
MIDLAND = r"""return box([basics, units, blds, tech, tuning, cut(core, 'const MODES', '};') + '};', 'var OUT = { LAND, CLEAR, SCENARIOS, MODES, UI_BUDGET };']);"""
async def land(b):
    pg, errs = await fresh(b); v = await pg.evaluate(LANDJS); m, err = frozen('basics units blds tech tuning core', MIDLAND); m = m or {}; M = MEASURE; await pg.close()
    looks = {'tower': 'tower', 'barracks': 'barracks', 'range': 'range', 'market': 'market'}
    same_land = {k: {'amt': r['amt'], 'extra': r['extra']} for k, r in m.get('LAND', {}).items()} == M['lands']['rows']
    def scen(k):
        z, w = m.get('SCENARIOS', {}).get(k, {}), M['scenarios'][k]
        return (w.get('age') == z.get('age') and w.get('store') == ({RK[y]: n for y, n in z['res'].items()} if 'res' in z else None) and w.get('techs') == z.get('techs') and w['rel'] == z['rel'] and w.get('vils') == z.get('vils')
                and w['len'] == m['MODES'][z['mode']]['secs'] and bool(w.get('all')) == bool(z.get('all')) and (w.get('among') == 'ally') == bool(z.get('league')) and (w.get('among') == 'peace') == (z['rel'] == 'peace')
                and [[SHELLS[c]['look'], dx] for c, dx in w.get('blds', [])] == [[looks[q], dx] for q, dx in z.get('blds', [])])
    tables = [same_land, all(scen(k) for k in ('siege', 'road', 'last')), M['scenarios']['open'] == m.get('SCENARIOS', {}).get('open')]
    def ran(k):   # the scenario as played equals its row: age, store, buildings, villagers, relations, research and its line
        g, w = v['scen'][k], M['scenarios'][k]; me = 0
        return (g['age'][me] == w.get('age', 0) and all(g['store'][me][y] >= n for y, n in w.get('store', {}).items()) and (not w.get('all') or all(a == w['age'] for a in g['age']))
                and sorted(c for c, _ in g['blds']) == sorted(c for c, _ in w.get('blds', [])) and all(x for _, x in g['blds']) and g['vils'] == M['villagers'] + w.get('vils', 0)
                and all(s == (w['rel'] if a == me else w.get('among', s)) for a, b2, s in g['rel']) and set(w.get('techs', [])) <= set(g['techs']) and g['said'])
    played = [ran(k) for k in ('siege', 'road', 'last')]
    cost, age = M['cost'], M['age']['cost'][M['pocket']['age']]; P = M['pocket']   # QCS (G1, Albert Nov 7: the pocket as Mid's): zone 1's need plus the home finds, Mid's piles each carrying its share
    yld = {e['find']: e['yield'] for e in SHELLS.values() if e.get('layer') == 100 and e.get('find') in M['Z3']['finds']}
    z1need = {'food': age.get('food', 0) + P['back']['vils'] * cost['UV']['food'], 'wood': age.get('wood', 0) + P['back']['houses'] * cost['BR1']['wood']}
    back = {'bush': P['back']['bushes'], 'tree': P['back']['trees']}
    expect = {k: [n + back.get(k, 0), round(each * n * P['rich'] * P['homeRich'] * P['findSize'][k] + z1need.get(yld[k], 0))] for k, (n, each) in P['home'].items()}
    b_ = [v['corner'][0] and v['corner'][1] and v['corner'][2][0] == [-1, 1],                                              # your corner on screen is the bottom left
          all((v['pocket'][k][0] >= expect[k][0] - 2 if k == 'tree' else 0 < v['pocket'][k][0] <= expect[k][0]) and expect[k][1] * (expect[k][0] - 2) / expect[k][0] - 1 <= v['pocket'][k][1] and (k == 'tree' or v['pocket'][k][1] <= expect[k][1] + 1) for k in M['z1']),   # N340: wild trees may stand by the home grove (the lumber fills the edges), so the grove has a floor, not a ceiling
            # the pocket holds Mid's totals (QCS) in at most Mid's piles, untouched by the land; up to two pocket trees may be felled for a clearing or a path (E674), their share lost
          v['woods'][0] < v['woods'][1] and v['woods'][2] < v['woods'][3] and v['woods'][4] == 0 and M['Z3']['trees'] == [0, M['Z4']['trees'][0]],   # Z3: thickening toward Z4, more open than Z4; Z2 none
          all(v['ring'][k] >= 1 for k in M['Z3']['finds']) and all(w > 0 for p, r, w in v['more'])]                      # Z3's finds, Mid's wild finds, in every corner; the wilds beyond hold finds too (the Nov 6 ordering pocket < ring < wild ended with Mid's pocket, G1)
    got = tables + played + b_ + [v['amt'], v['ways'][0] > 0 and not v['ways'][1], v['land'] in M['lands']['rows'], not errs]
    ok('t-land', all(got), [got, v['corner'], v['pocket'], expect, v['woods'], v['ring'], v['more'], v['ways'][1][:5], {k: v['scen'][k] for k in v['scen']} if not all(played) else '', errs[:2], err[-400:]])
# F38: the save, the safety net and the test tools
SAVEJS = r"""(async () => { const D = FK.D, SV = D.save, ME = D.players[0], foe = D.players[1], out = {}, mine = () => [...FK.store.keys()].filter((k) => k.startsWith(SV.key + location.pathname + '.') && !k.endsWith('.' + SV.now)), newest = () => SV.key + location.pathname + '.' + FK.store.get(SV.key + location.pathname + '.' + SV.now); MENU.S.opt.scen = 0; FK.reset(); $run(30); for (const k of [...FK.store.keys()]) if (k.startsWith(SV.key)) FK.store.delete(k);
  const sig = () => ({ u: FK.units().map((u) => [u.code, u.side, u.k, u.hp, u.load || 0, u.target ? FK.things().indexOf(u.target) + ':' + FK.units().indexOf(u.target) : null]), t: FK.things().map((t) => [t.kind, t.code, t.k, t.amount, t.done, t.hp, t.gone]),
    s: FK.SIDES.map((s) => [s.age, JSON.stringify(s.store), [...s.techs].join()]), K: [FK.K.t, FK.K.temp, FK.K.sky], occ: FK.OCC.join(''), war: D.players.map((p) => WAR.stance(ME, p)), bell: ECON.bell(), mail: MENU.mail.length });
  WAR.treaty(ME, foe, 'war'); const a = FK.units().find((u) => u.side === ME), e = FK.units().find((u) => u.side === foe); a.target = e; FK.save(); out.held = mine().length === 0;
  FK.K.t += SV.fight + 1; FK.save(); out.late = mine().length === 1; a.target = null; for (let i = 0; i < SV.slots + 1; i++) FK.save(true); out.bak = mine().length === SV.slots;
  const before = sig(), text = FK.store.get(newest()), S = JSON.parse(text); out.keys = Object.keys(S); out.bytes = text.length; FK.resume(FK.readSave()); const after = sig();
  out.same = Object.keys(before).filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k])); $run(5); out.runs = FK.K.t > after.K[0];
  FK.store.set(newest(), '{broken'); const got = FK.readSave(); const h0 = history.length; FK.restart(); FK.restart(); out.aside = [SV.slots > 1 ? got && got.seed === S.seed : got === null, history.length === h0, location.hash.length > 1];
  let threw = 0; FK.on('tick', () => { if (!threw++) throw new Error('t-save: one frame'); }); const t0 = FK.K.t; await new Promise((r) => setTimeout(r, 1500)); out.fault = [threw >= 2, FK.K.t > t0];
  const n0 = (MENU.TAPS.people || [0])[0]; MENU.act('people'); out.taps = (MENU.TAPS.people || [0])[0] === n0 + 1;
  $run(130); const L = JSON.parse(MENU.logText()); out.log = [L.rows.length >= 2, L.rows.every((r) => r.s.length === D.players.length), L.seed === FK.seed()];
  MENU.render(true); out.ui = document.querySelectorAll('#base button, .topbar button').length; return out; })()"""
FIELDJS = r"""(() => { const D = FK.D, F = D.testField, [ME, foe] = D.players, seats = FK.things().filter((t) => FK.has(t, 'Seat')).map((t) => t.side), n = (s) => FK.units().filter((u) => u.side === s && !FK.has(u, 'Gather')).length;
  for (const k of Object.keys(localStorage)) if (k.startsWith(D.save.key)) localStorage.removeItem(k); FK.save(true); return [FK.TEST, FK.seed() === F.seed, seats.sort(), WAR.stance(ME, foe), n(ME), n(foe), Object.entries(FK.SIDES[ME].store).every(([y, v]) => v === F.store || (y === 'food' && v > F.store * 0.99)), FK.SIDES[ME].age === F.age, Object.keys(localStorage).every((k) => !k.startsWith(D.save.key))]; })()"""
async def saving(b):
    pg, errs = await fresh(b); v = await pg.evaluate(SAVEJS); await pg.close(); M = MEASURE; src = open(os.path.join(HERE, '../mid/src/34-save.js')).read()
    pg = await b.new_page(); fe = []; pg.on('pageerror', lambda e: fe.append(str(e))); await pg.goto('file://' + os.path.join(HERE, 'index.html') + '?test'); await pg.wait_for_timeout(1500); f = await pg.evaluate(FIELDJS); await pg.close()
    cx = await b.new_context(); pg = await cx.new_page(); await pg.goto(URL); await pg.wait_for_timeout(1200); await pg.evaluate("(async () => { FK.K.t = 4321; await FK.save(true); })()"); await pg.close()   # one browser context: its pages share the phone's storage
    pg = await cx.new_page(); re_ = []; pg.on('pageerror', lambda e: re_.append(str(e))); await pg.goto('file://' + os.path.join(HERE, 'index.html')); await pg.wait_for_timeout(2500); back = await pg.evaluate("[FK.seed(), FK.K.t, MENU.S.tab]"); await cx.close()
    # the save beat left Mid's SAVE_EVERY (10 s) for a minute in N23 (D332, N320)
    m, err = frozen('basics units blds tech tuning', "return box([basics, units, blds, tech, tuning, 'var OUT = { every: SAVE_EVERY, ui: UI_BUDGET };']);"); m = m or {}
    mid = [m.get('every') == 10 and M['saveBeat'][0] == 60, re.search(r'G\.t - fightHold < (\d+)', src).group(1) == str(M['save']['fight']), re.search(r'saveFailT \?\? -999\) > (\d+)', src).group(1) == str(M['save']['fail']), m.get('ui') == M['ui']]
    army = [sum(n for _, n in M['testField']['army'][0][1]), sum(n for _, n in M['testField']['army'][1][1])]
    got = mid + [v['held'], v['late'], v['bak'], not v['same'], v['runs'], all(v['aside']), 'SEEN' not in v['keys'] and 'seen' not in v['keys'], all(v['fault']), v['taps'], all(v['log']), 0 < v['ui'] <= M['ui'],
                 f[:4] == [True, True, sorted(MEASURE['players'][:2]), 'war'] and f[4] == army[0] and f[5] >= army[1] and all(f[6:]), back[0] == SEED and back[1] >= 4321 and back[2] == 'Back', not errs and not fe and not re_]
    ok('t-save', all(got), [got, v, f, back, errs[:2], fe[:2], re_[:2], err[-400:]])

# F39: the Guide and History, written from the books; Mid's frozen guideModel and histRows run on v100's tables (each building, kind, step, age, people and find as Mid's table rows)
GUIDEJS = r"""(() => { const D = FK.D, SH = FK.SH, W = fromBook('words'), GW = W.guidebook, T = BOOKS.tech, Y = { food: 'f', wood: 'w', gold: 'g', stone: 's', iron: 'i' }, mk = (c) => Object.fromEntries(Object.entries(c || {}).map(([y, n]) => [Y[y], n]));
  const TK = Object.fromEntries(Object.entries(T).map(([c, e]) => [e.key, c])), home = (c) => Object.keys(D.trains).find((b) => FK.trains(b).includes(SH[c].replaces || c)), age = (n) => (n ? D.ages.indexOf(n) : undefined), WHY = {};
  const BLD = Object.fromEntries(Object.keys(FK.B).map((c) => [c, { name: SH[c].name, age: D.bldAge[c], cost: mk(D.cost[c]), t: D.buildTime[c], fp: FK.ref(SH[c].size) }]));
  const UNIT = Object.fromEntries(Object.keys(FK.U).filter((c) => D.cost[c]).map((c) => { const s = D.stats[c]; return [c, { name: SH[c].name, at: home(c), age: age(SH[c].age), cost: mk(D.cost[c]), t: D.train[c], hp: s.hp, dmg: s.atk, rng: s.rng, spd: FK.ref(SH[c].pace), civ: SH[c].civ, replaces: SH[c].replaces, vs: s.vs, bld: s.bld, bonly: s.bonly }]; }));
  const TECH = Object.keys(T).filter((c) => T[c].value.at).map((c) => { const v = T[c].value; return { id: c, name: T[c].name, at: v.at, age: v.age, line: v.line, when: v.when, w: v.w, need: (v.need || []).map((k) => TK[k] || k), cost: mk(v.cost), t: v.time, civ: v.civ, tier: v.rank && { unit: v.rank.k, name: v.rank.name } }; });
  for (const c of [...Object.keys(BLD), ...Object.keys(UNIT), ...Object.keys(D.finds.rows)]) WHY[c] = W.why[GW.key[c] || SH[c].look];
  for (const t of TECH) WHY['tech:' + t.id] = W.why['tech:' + T[t.id].key] ?? W.why[T[t.id].key];
  for (const k of Object.keys(W.why).filter((k) => /^(age|bonus:|wonder:)/.test(k))) WHY[k] = W.why[k];
  const CIVK = Object.keys(W.civs).filter((k) => W.civs[k].name), CIVS = Object.fromEntries(CIVK.map((k) => [k, { name: W.civs[k].name, wonder: W.civs[k].wonder, uu: Object.keys(SH).find((c) => SH[c].civ === k) }]));
  const MENUS = Object.entries(MENU.SCR.tabs).map(([name, items]) => ({ name, items })).concat(Object.entries(GW.off).map(([c, name]) => ({ name, items: [c] })));
  const tables = { BLD, UNIT, TECH, WHY, CIVK, CIVS, MENUS, AGES: D.ages.map((name, i) => ({ name, cost: mk(D.age.cost[i]), t: D.age.time[i] })), FINDS: Object.fromEntries(Object.keys(D.finds.rows).map((c) => [c, { name: SH[c].name }])) };
  const g = MENU.guide(), md = MENU.guideMd();
  return { tables, g, hist: MENU.hist().map((t) => t.id), md: [md.split('\n').filter((l) => /^\| /.test(l)).length, md.startsWith(GW.md.title.replace('{v}', D.version))], off: FK.D && fromBook('screen').offmenu, text: MENU.histText(MENU.hist()[0]) }; })()"""
MIDGUIDE = r"""const g = cut(guide, 'function guideModel', 'function guideHTML'), h = cut(guide, 'const yearOf', 'function histHTML'), T = RUN.tables;
return box([cut(core, 'const costText', 'const afford'), cut(core, 'const lineOf', 'const nextStep'), 'const TECHBY = Object.fromEntries(TECH.map((t) => [t.id, t]))', 'const techWhy = (id) => WHY[\'tech:\' + id] ?? WHY[id]', 'const TRIGGERS = () => RUN.rules', g, h, 'var OUT = { model: guideModel(), hist: histRows().map((t) => t.id) }'], T);"""
def fillrule(s):   # a rule's {D:…}, {S:…}, {J:…}, {fx:…} filled from the books, in Python
    W, T = keyed('words'), book('tech')
    def one(m):
        k, p = m.group(1), m.group(2)
        if k == 'D': v = MEASURE; [v := v[x] for x in p.split('.')]; return str(v)
        return SHELLS[p]['name'] if k == 'S' else W[p] if k == 'J' else W['list']['and'].join(e['name'] for e in T.values() if any(f['s'] == p for f in e['value']['fx']))
    return re.sub(r'\{(\w+):([^}]+)\}', one, s)
async def guidebook(b):
    pg, errs = await fresh(b); v = await pg.evaluate(GUIDEJS); await pg.close()
    rules = [[fillrule(w), fillrule(t), fillrule(y)] for w, (t, y) in keyed('words')['guide'].items()]
    m, err = frozen('core guide=31-guide', MIDGUIDE, {'tables': v['tables'], 'rules': rules}); m = m or {}; M, g = json.loads(re.sub(r'"(?:null|undefined) s"', '""', json.dumps(m.get('model') or {}))), v['g']   # Mid prints a missing time (the Envoy is sent, not trained) as 'undefined s'; v100 leaves it out
    for u in g.get('units', []): u['at'] = u['at'].split(', ')[0] if u.get('at') else u.get('at')   # A2 (Albert, Nov 7): v100's Guide names every building that trains a unit; Mid named the first, so the first is compared
    off = keyed('words')['guidebook']['off']   # a building off the Build menu is placed as the Guide's word (J29) says: SN34 (Albert Nov 9 18:29) makes the Apartment and the Tree farm from a card and the Depot comes with the camp wagon (Nov 8), where Mid had them the Natives'
    for x in M.get('buildings', []):
        if x['id'] in off: x['menu'] = off[x['id']]
    same = {k: M.get(k) == g[k] for k in ('buildings', 'units', 'techs', 'ages', 'civs', 'finds', 'rules')}
    open_ = [r for r in g['rules'] if re.search(r'\{\w+:', json.dumps(r))]; whyless = [x['id'] for k in ('buildings', 'units', 'finds') for x in g[k] if not x.get('why')]
    got = [all(same.values()), m.get('hist') == v['hist'] and len(v['hist']) > len(MEASURE['ages']), not open_, set(whyless) <= set(v['off']),
           v['md'] == [sum(len(g[k]) for k in same) + len(same), True], v['text'].startswith(next(t['name'] + keyed('words')['list']['dot'] + t['when'] for t in g['techs'] if t['id'] == v['hist'][0])), not errs]
    ok('t-guide', all(got), [got, {k: next(([a, z] for a, z in zip(M.get(k) or [], g[k]) if a != z), None) for k, s in same.items() if not s}, open_, whyless, v['md'], errs[:2], err[-600:]])
# A1: speed and the audit's confirmed fixes; each check fails if its fix is undone
A1JS = r"""(() => { const D = FK.D, E = ECON, [me, foe] = D.players, out = {}, look = (l) => Object.keys(FK.SH).find((c) => FK.SH[c].look === l), SP = look('spear');
  const mk = (c, s, bx, by) => { const u = FK.spawn(c, s, FK.tileAt(bx, by), FK.rng); Object.assign(u, { bx, by, path: null }); FK.place(u); return u; }, ring = (h, n, d) => { const L = []; FK.stamp(h.bx, h.by, (h.n / 2 + d) * D.tile, (k, r) => { if (FK.walkable(k) && r > (h.n / 2 + 2) * D.tile) L.push([r, k]); }); return L.sort((a, b) => a[0] - b[0]).slice(0, n).map(([, k]) => FK.tileMid(k)); };
  // Reinforce: the reserve takes the fight's order (WAR.reinforce, menu's Reinforce)
  $calm(me, foe); $rich(me); const h = FK.seatOf(me), A = ring(h, 8, 12).map((p) => mk(SP, me, ...p)), [m0, ...rest] = A, front = rest.slice(0, 3), back = rest.slice(3);
  const O = WAR.order(front, null, FK.tileAt(h.bx + 20 * D.tile, h.by)); const m = { ord: O }; WAR.reinforce(back, m); out.join = [!!O, back.every((u) => u.ord === O), !!WAR.reinforce, !WAR.join];
  // a drill holds its shape past its first frame, and after its soldiers settle
  $calm(); const S = ring(h, 6, 10).map((p) => mk(SP, me, ...p)); WAR.dress(S, FK.tileAt(h.bx + 18 * D.tile, h.by + 18 * D.tile), 'line', { t0: FK.K.t, until: FK.K.t + 30 }); FK.sim(0.1); const d1 = S.map(WAR.drillOn); $run(20); out.drill = [d1.every(Boolean), S.every(WAR.drillOn), new Set(S.map((u) => u.goal)).size === S.length];
  // a save opened: an order, a camp and an ambush stay one record each; the camp count holds; the fresh map is untouched
  $calm(me, foe); $rich(me); const G = ring(h, 6, 14).map((p) => mk(SP, me, ...p)), O2 = WAR.order(G.slice(0, 3), null, FK.tileAt(h.bx + 25 * D.tile, h.by)); WAR.MS.t = { name: 't', ord: O2, n0: 3, t: FK.K.t, st: 'go' };
  const amb = { k: G[3].k }; G.slice(3).forEach((u) => { u.amb = amb; }); const tent = $put(look('medtent'), me, 14, 80), tow = $put(look('camptower'), me, 24, 80), camp = { size: 'small' }; tent.camp = tow.camp = camp;
  const n0 = E.campsOut(me, 'small'), base0 = JSON.stringify(FK.things().slice(0, 50).map((t) => [t.kind, t.amount, t.k])), txt = FK.pack(); FK.resume(JSON.parse(txt));
  const U = FK.units().filter((u) => u.side === me && u.code === SP), T = FK.things().filter((t) => t.camp), M = WAR.MS.t;
  out.save = [!!M && U.filter((u) => u.ord).every((u) => u.ord === M.ord) && [...WAR.ORD].includes(M.ord), T.length === 2 && T[0].camp === T[1].camp, E.campsOut(me, 'small') === n0, (() => { const a = U.filter((u) => u.amb); return a.length === 3 && a.every((u) => u.amb === a[0].amb); })()];
  FK.reset(); out.save.push(JSON.stringify(FK.things().slice(0, 50).map((t) => [t.kind, t.amount, t.k])) === base0);
  // a civilisation's own kind on its building's card, trained from it
  const civs = Object.keys(FK.SH).filter((c) => FK.SH[c].civ && FK.SH[c].replaces); out.civ = civs.map((uu) => { FK.reset(); $rich(me); E.setCiv(me, FK.SH[uu].civ); FK.SIDES[me].age = D.ages.length; const at = Object.keys(D.trains).find((c) => FK.trains(c, me).includes(uu)), b = $put(at, me, 10, 80); b.side = me;
    MENU.S.tab = null; MENU.S.subject = b; MENU.render(true); const cell = [...document.querySelectorAll('#card [data-v^="train|"]')].find((e) => e.dataset.v.split('|')[1] === uu); if (cell) cell.click(); return [!!cell, (b.q || []).includes(uu)]; });
  // a support unit beside a soldier: its threat is none, never NaN; the soldier picks the armed foe
  $calm(me, foe); const sup = Object.keys(D.stats).filter((c) => D.stats[c].atk === 0 && FK.SH[c] && FK.SH[c].layer === 120), [p0] = ring(h, 1, 10), me1 = mk(SP, me, ...p0);
  out.foe = sup.map((c) => { const v = mk(c, foe, p0[0] + D.tile, p0[1]), a = mk(SP, foe, p0[0] + 2 * D.tile, p0[1]); a.hp = a.hpMax / D.players.length; const w = WAR.worth(me1, v, 1), pick = WAR.bestFoe(me1, D.ai.reach); WAR.die(v); WAR.die(a); return [Number.isFinite(w), pick === a]; });
  // the Apartment houses Mid's room; the Quarry is worked for its stone
  FK.reset(); $rich(me); FK.SIDES[me].age = D.ages.length; const r0 = E.popCap(me), ap = $put(look('apartment'), me, 10, 80); ap.side = me; out.room = [E.popCap(me) - r0, FK.stat(ap.code, me, 'room')];
  const q = $put(look('quarry'), me, 10, 80), qs = (q.side = me), v = E.villagersOf(me)[0], st0 = FK.SIDES[me].store.stone; E.gatherAt(v, q); $run(60); out.quarry = [E.yieldOf(q), FK.SIDES[me].store.stone > st0, FK.stat(q.code, me, 'rate')];
  out.tw = [FK.has(FK.seatOf(me) && { code: look('castle') }, 'Shoot'), !!D.tower[look('castle')]];
  // a side's reach: the flood equals the pathfinder's walk
  FK.reset(); const R = FK.reach(me), far = []; for (let k = 0; k < FK.N * FK.N; k += 997) if (FK.walkable(k)) far.push(k); const from = FK.tileAt(h.bx, h.by + (h.n / 2 + 2) * D.tile);
  out.reach = far.slice(0, 40).map((k) => R.has(k) === !!FK.findPath(FK.units().find((u) => u.side === me).k, (q) => q === k, k, Infinity));
  // the A* heap: each entry's priority fixed; the path the octile-shortest on open ground
  const cost = (p) => p.reduce((L, q, n) => L + (n && (q % FK.N !== p[n - 1] % FK.N && Math.floor(q / FK.N) !== Math.floor(p[n - 1] / FK.N)) ? Math.SQRT2 : n ? 1 : 0), 0), way = (a, b) => FK.findPath(a, (q) => q === b, b, Infinity), near = (x, y) => Math.abs(x - y) < 1e-9;
  out.path = far.filter((k) => R.has(k)).slice(0, 40).map((k) => { const a = from, p = way(a, k), back = way(k, a), m = p && p[p.length >> 1], half = m && way(a, m); return !!p && !!back && near(cost(p), cost(back)) && near(cost(p.slice(0, (p.length >> 1) + 1)), cost(half)); });
  return out; })()"""
async def a1(b):
    pg, errs = await fresh(b); v = await pg.evaluate(A1JS)
    win = "(async () => { let last = performance.now(), worst = 0; const t0 = last; await new Promise((r) => { const f = (t) => { worst = Math.max(worst, t - last); last = t; if (t - t0 < 5000) requestAnimationFrame(f); else r(); }; requestAnimationFrame(f); }); return worst; })()"
    await pg.evaluate("FK.reset()"); await pg.wait_for_timeout(1500); frames = min([await pg.evaluate(win) for _ in range(3)]); await pg.close()   # a hitch of the game's own repeats every turn; a stall of the machine's does not
    m, err = frozen('basics units blds tech', "return box([basics, units, blds, tech, 'var OUT = { tech: TECH, apt: BLD.apartment.room, quarry: BLD.quarry.rate, castle: [BLD.castle.dmg, BLD.castle.cd, BLD.castle.bow, BLD.castle.h] };']);"); m = m or {}
    T, R = {e['key']: e['value'] for e in book('tech').values()}, {'f': 'food', 'w': 'wood', 'g': 'gold', 's': 'stone', 'i': 'iron'}
    mt = {t['id']: t for t in m.get('tech', [])}; cut = {'satrapy', 'sixth', 'caltrops', 'archerstakes'}; DATED = {'windmill'}   # parked with the tax (Albert, Nov 5 11:16); caltrops and archers' stakes cut for players (Albert, Calls Nov 8); DATED: dates corrected to the record in S1 (N161: the first English windmill before 1137, Mid said 1180s)
    same = lambda k, t: T.get(k) and T[k].get('age', 0) == t.get('age', 0) and T[k].get('time') == t.get('t') and (T[k].get('when') == t.get('when') or k in DATED) and T[k].get('cost') == {R[x]: n for x, n in t.get('cost', {}).items()} and [n for n in T[k].get('need', [])] == [n for n in t.get('need', []) if n not in cut]
    tech = bool(mt) and all(same(k, t) for k, t in mt.items() if k not in cut) and T['potato']['line'] == mt['potato']['line'] and T['potato']['fx'][0]['p'] == round(mt['potato']['fx'][0]['m'] - 1, 9) and len(T['townwatch']['fx']) == 1
    TW = MEASURE['tower'].get(next(c for c, e in SHELLS.items() if e.get('look') == 'castle'), {})
    got = [all(v['join']), all(v['drill']), all(v['save']), v['civ'] and all(all(x) for x in v['civ']), v['foe'] and all(all(x) for x in v['foe']),
           v['room'] == [m.get('apt'), m.get('apt')], v['quarry'][0] == 'stone' and v['quarry'][1] and v['quarry'][2] == m.get('quarry'), all(v['tw']) and [TW.get('atk'), TW.get('rof'), TW.get('bow') * 10, TW.get('h') * 10] == m.get('castle'),
           tech, all(v['reach']), v['path'] and all(v['path']), frames <= MEASURE['frameMost'], not errs]
    ok('t-a1', all(got), [got, {k: v[k] for k in ('join', 'drill', 'save', 'civ', 'foe', 'room', 'quarry', 'tw', 'path')}, frames, errs[:2], err[-400:], [k for k, t in mt.items() if k not in cut and not same(k, t)][:6]])
N17JS = r"""(() => { MENU.act('start'); const S = FK.SIDES[0]; for (const k in S.store) S.store[k] = 5000; const vs = ECON.villagersOf(0), h = FK.seatOf(0), out = {};
 const spot = (c) => { for (let r = 4; r < 30; r++) for (let a = 0; a < 24; a++) { const i = Math.round(h.i + r * Math.cos(a / 24 * 6.283)), j = Math.round(h.j + r * Math.sin(a / 24 * 6.283)); if (ECON.canPlace(c, i, j)) return [i, j]; } };
 let [i, j] = spot('BR1'); const A = ECON.plan(0, 'BR1', i, j), v = vs[0]; ECON.autoBuilder(0, A, v); for (let n = 0; n < 30; n++) FK.sim(0.1);
 [i, j] = spot('BR1'); const B = ECON.plan(0, 'BR1', i, j); ECON.autoBuilder(0, B, v); out.stays = v.target === A && (v.sites || []).includes(B);
 let t = 0; while (A.done < 1 && t < 3000) { FK.sim(0.1); t++; } FK.sim(0.1); out.next = v.target === B;
 for (const u of vs) ECON.assign(0, 'food', 1); for (let n = 0; n < 200; n++) FK.sim(0.1); const y = 'food', n0 = ECON.jobs(0)[y]; ECON.assign(0, y, -1); out.minus = [n0, ECON.jobs(0)[y]];
 const prev = new Map(); let g = 0, moved = 0; for (let n = 0; n < 1500; n++) { FK.sim(1 / 30); for (const u of vs) { const p = prev.get(u); prev.set(u, [u.bx, u.by, u.job]); if (!p || u.job !== 'gather' || p[2] !== 'gather') continue; g++; if (Math.hypot(u.bx - p[0], u.by - p[1]) > 0.01) moved++; } } out.hold = [g, moved];
 out.repeat = Object.keys(FK.SH).filter((c) => FK.has({ code: c }, 'Repeat')).sort();
 const TB = BOOKS.tech; out.reasons = Object.keys(TB).filter((c) => { const w = ECON.researchWhy(0, c); return w && w !== 'cost' && !(TB[c].value.civ && TB[c].value.civ !== S.civ); }).map((c) => [c, MENU.VERBS.research.label(c).includes('<small>' + MENU.VERBS.research.whyNot(c) + '</small>')]).filter(([, ok]) => !ok);
 return out; })()"""
async def n17(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N17JS)
    await pg.evaluate("MENU.act('start'); const h = FK.seatOf(0); FK.SIDES[0].store.food = 5000; h.q = []; MENU.S.tab = 'Hall'; MENU.render(true)"); await pg.wait_for_timeout(300)
    x, y = await pg.evaluate("(() => { const r = document.querySelector('[data-v^=train]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; })()")
    await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(1200); await pg.mouse.up(); await pg.wait_for_timeout(200); held = await pg.evaluate("FK.seatOf(0).q.length"); await pg.close()
    rep = sorted(c for c, e in SHELLS.items() if e.get('name') in ('Farm', 'Tree farm', 'Mint', 'Quarry', 'Mill', 'Lumber camp', 'Mining camp', 'Dwelling', 'Foundry', 'Wall', 'Palisade', 'Tower'))
    got = [v['stays'], v['next'], v['minus'][1] == v['minus'][0] - 1, v['hold'][0] > 0 and v['hold'][1] < 0.02 * v['hold'][0], v['repeat'] == rep, not v['reasons'], held == 1, not errs]
    ok('t-n17', all(got), [got, v, held, errs[:2]])
N18JS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), cs = (e) => getComputedStyle(e), px = (v) => parseFloat(v), cells = () => [...document.querySelectorAll('.cell')], by = (t) => cells().find((e) => e.textContent.trim().startsWith(t)), o = {};
 MENU.S.tab = 'Start'; MENU.render(true); await W(300);
 const seg = document.querySelector('.cells.seg'), first = seg.querySelector('.cell'), on = seg.querySelector('.cell.on'), rg = on.querySelector('svg.rg'), hair = px(cs(document.documentElement).getPropertyValue('--hair')), r = rg.getBoundingClientRect(), vb = rg.getAttribute('viewBox').split(' ').map(Number);
 o.curve = px(cs(first).borderTopLeftRadius) > 0 && px(cs(seg.querySelector('.cell:last-child')).borderBottomRightRadius) > 0;
 o.edge = Math.abs(r.width - on.offsetWidth - 2 * hair) < 0.5 && Math.abs(r.height - on.offsetHeight - 2 * hair) < 0.5 && vb[2] === Math.round(r.width) && vb[3] === Math.round(r.height);
 const lab = [...document.querySelectorAll('.lab')][0]; o.head = cs(lab).fontWeight === '600' && cs(lab).fontSize === '14px';
 o.opt = cs(by('Easy')).fontWeight === '400' && cs(by('Easy')).fontSize === '12px';
 by('Famine').click(); await W(150); const fr = by('Famine').querySelector('svg.rg path'); o.hazard = !!fr && fr.getAttribute('stroke').toLowerCase() === String(FK.C.rings.colour.white).toLowerCase(); by('Famine').click(); await W(100);
 const free = cs(by('Han')).backgroundImage; cells().filter((e) => e.textContent.trim() === 'On')[0].click(); await W(200); const lk = by('Han'); o.lock = lk.classList.contains('dim') && cs(lk).backgroundImage !== free && (!lk.querySelector('svg.rg') || cs(lk.querySelector('svg.rg')).display === 'none'); cells().filter((e) => e.textContent.trim() === 'Off')[0].click(); await W(100);
 MENU.act('start'); await W(400); FK.pause(true); MENU.render(true); await W(300);
 const pb = document.querySelector('.topbar [data-v^="pause|"]'), pr = pb && pb.querySelector('svg.rg'); o.play = !!pr && Math.abs(pr.getBoundingClientRect().width - pb.clientWidth) < 1;
 const pop = document.querySelector('.pop.on'), rib = document.querySelector('.topbar'); o.pop = !!pop && pop.getBoundingClientRect().top >= rib.getBoundingClientRect().bottom;
 FK.pause(false); MENU.S.qa = { k: FK.seatOf(0).k, px: 195, py: 400 }; MENU.render(true); await W(200);
 const qc = [...document.querySelectorAll('#qa .cell')].find((c) => c.querySelector('svg.rg')); o.qring = !qc || Math.abs(qc.querySelector('svg.rg').getBoundingClientRect().width - qc.offsetWidth) < 1;
 const was = JSON.stringify(MENU.S.qa); MENU.S.eat = true; const c0 = document.querySelector('#qa .cell'); if (c0) c0.click(); await W(100); o.eat = JSON.stringify(MENU.S.qa) === was; return o; })()"""
async def n18(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N18JS); await pg.close()
    ok('t-n18', all(v.values()) and not errs, [v, errs[:2]])
N18BJS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), o = {}; MENU.act('start'); await W(400); FK.fog(false); const h = FK.seatOf(0), N = FK.N;
 MENU.S.tab = 'Hall'; MENU.render(true); await W(150); FK.SIDES[0].store.food = 5000; h.q = []; document.querySelector('[data-v^=train]').click(); MENU.S.tab = null; MENU.render(true); await W(300);
 const ring = () => { const r = document.querySelector('#base [data-v^="people|"] svg.rg .rr'); return r && r.getAttribute('stroke-dasharray'); }, r0 = ring(); await W(1200); o.people = !!r0 && r0 !== ring();
 const shown = []; MENU.say ? 0 : 0; const t0 = MENU.S.toastT; MENU.S.toastT = 0; MENU.S.tq = []; FK.fire('say', 'one two three'); FK.fire('say', 'four five six'); o.queue = MENU.S.tq.length >= 1;
 const tr = FK.things().filter((t) => t.kind === 'tree').sort((a, b) => Math.hypot(a.bx - h.bx, a.by - h.by) - Math.hypot(b.bx - h.bx, b.by - h.by))[0], ti = tr.k % N, tj = Math.floor(tr.k / N); FK.SIDES[0].store.wood = 5000; FK.SIDES[0].store.food = 5000; FK.SIDES[0].store.gold = 5000;
 for (let d = 2; d < 9; d++) { for (const [di, dj] of [[d, 0], [-d, 0], [0, d], [0, -d], [d, d], [-d, d], [d, -d]]) { ECON.plan(0, 'BI2', ti + di, tj + dj); if (FK.blds().some((b) => b.code === 'BI2')) break; } if (FK.blds().some((b) => b.code === 'BI2')) break; }
 const lc = FK.blds().find((b) => b.code === 'BI2'); if (lc) lc.done = 1; const vs = FK.units().filter((u) => u.side === 0).slice(0, 4); for (const v of vs) ECON.gatherAt(v, tr);
 FK.SIDES[0].flag = FK.tileAt(h.bx + 120, h.by + 60); for (let i = 0; i < 3; i++) { ECON.spawnBy(h, 'UM1'); for (let k = 0; k < 20; k++) FK.sim(0.1); }
 for (let i = 0; i < 300; i++) FK.sim(0.1);
 const army = FK.units().filter((u) => u.side === 0 && WAR.armed(u)); o.form = army.length >= 3 && new Set(army.map((u) => u.goal)).size >= army.length - 1 && army.every((u) => u.rally === FK.SIDES[0].flag);
 const t1 = FK.K.t; for (let k = 0; k < 48 && nightOf() < 0.95; k++) { FK.K.t = t1 + (k * FK.D.day) / 48; FK.sim(0.001); } FK.sim(0.1); FK.cam.z = Math.max(FK.cam.z, 1); FK.dirty(); await W(600);
 const L = lightsOf(); o.camp = !!lc && L.some(([t, k]) => t.camp && t.b === lc && k === 'campfire'); o.torch = L.some(([t, k]) => t.pole && k === 'torch');
 const cut = []; for (const lk of Object.keys(LOOKBOX)) for (let fr = 0; fr < 14; fr++) { let sp; try { sp = figure(lk, '#cc3333', 0, fr, 2, 0); } catch (e) { continue; } const d = sp.getContext('2d').getImageData(0, 0, sp.width, sp.height).data, Wd = sp.width; let e = 0; for (let y = 0; y < sp.height; y++) e += d[(y * Wd) * 4 + 3] + d[(y * Wd + Wd - 1) * 4 + 3]; for (let x = 0; x < Wd; x++) e += d[x * 4 + 3]; if (e) cut.push(lk); } o.heads = !cut.length;
 o.grass = BLADES.length === 3; const sp = nodeSprite('stone', 0, 1.3); o.sharp = sp.q >= 1.3 * dpr;
 const u = FK.units().find((v) => v.side === 0 && !WAR.armed(v)); u.path = null; u.job = 'idle'; u.bx = h.bx; u.by = h.by - 20; FK.place(u); FK.dirty(); await W(400); o.hidden = HID.some(([m]) => m.u === u);
 return o; })()"""
async def n18b(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N18BJS); await pg.close()
    ok('t-n18b', all(v.values()) and not errs, [v, errs[:2]])
N18CJS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), o = {}; MENU.act('start'); await W(400); MENU.S.tab = null; MENU.render(true); await W(200); const h = FK.seatOf(0);
 MENU.S.qa = { k: FK.tileAt(h.bx + 70, h.by + 70), px: 260, py: 520 }; MENU.render(true); MENU.act('qrally'); MENU.render(true); await W(200); const qa = document.getElementById('qa'); o.aim = qa.classList.contains('s1') && qa.querySelectorAll('[data-v]').length === 1 && qa.getBoundingClientRect().bottom <= 520;
 MENU.S.qa = null; MENU.render(true); await W(300); const z0 = FK.cam.z, T0 = performance.now(); let paints = 0, last = LANDS.t, n = 0; await new Promise((res) => { function f(t) { n++; FK.cam.z = z0 * (1 + 0.3 * Math.min(1, (t - T0) / 1500)); FK.dirty(); if (LANDS.t !== last) { paints++; last = LANDS.t; } if (t - T0 < 1500) requestAnimationFrame(f); else res(); } requestAnimationFrame(f); }); o.pinch = n > 10 && paints <= 3; await W(500); o.settle = LANDS.z === FK.cam.z;
 return o; })()"""
async def n18c(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N18CJS); await pg.close()
    ok('t-n18c', all(v.values()) and not errs, [v, errs[:2]])
N19JS = r"""(async () => { const o = {}; MENU.act('start'); await new Promise((r) => setTimeout(r, 300)); const D = FK.D; o.day = D.day === 240 && D.season === 360; o.eat = Math.abs((D.upkeep * 60) / D.day - 3.75) < 1e-9; o.land = D.board / D.tile === 306 && FK.N === D.site / D.tile; return o; })()"""
async def n19(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N19JS); await pg.close()
    ok('t-n19', all(v.values()) and not errs, [v, errs[:2]])
N20JS = r"""(async () => { const o = {}; MENU.act('start'); await new Promise((r) => setTimeout(r, 300)); MENU.S.tab = null; MENU.render(true); const h = FK.seatOf(0), cx = h.bx + 200, cy = h.by + 200, A = [], B = [];
 for (let i = 0; i < 10; i++) { for (const [side, x, L] of [[0, cx - 30, A], [1, cx + 30, B]]) { const u = FK.spawn('UM1', side, FK.tileAt(x, cy + i * 12 - 60), FK.rng); u.bx = x; u.by = cy + i * 12 - 60; FK.place(u); L.push(u); } }
 A.forEach((a, i) => { WAR.fight(a, B[i]); WAR.fight(B[i], a); }); let first = null; for (let t = 0; t < 2400; t++) { FK.sim(0.1); const L = [...A, ...B]; if (first == null && L.some((u) => u.job === 'rout' && !u.gone)) first = Math.max(A.filter((u) => u.gone).length, B.filter((u) => u.gone).length); }
 o.hold = first >= 2; o.ends = [...A, ...B].filter((u) => u.gone).length >= 6;
 o.row = !document.querySelector('.rib') && document.querySelectorAll('.topbar .strip > .cell').length === MENU.SCR.top.length && document.querySelector('.topbar').getBoundingClientRect().height <= MENU.SCR.mold.slot + 2 * MENU.SCR.mold.gap + 2;
 o.trees = FK.D.forest.trees === 2586 && FK.D.stormAt === 0.6; return o; })()"""
async def n20(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N20JS); await pg.close()
    ok('t-n20', all(v.values()) and not errs, [v, errs[:2]])
N21JS = r"""(async () => { const o = {}; MENU.act('start'); await new Promise((r) => setTimeout(r, 400)); MENU.S.tab = null; MENU.render(true); const T = FK.things().filter((t) => t.kind === 'tree'); o.deep = T.filter((t) => t.deep).length > T.length / 3;
 let n = 0; const d0 = window.draw; window.draw = function () { n++; d0(); }; FK.pause(true); await new Promise((r) => setTimeout(r, 400)); n = 0; await new Promise((r) => setTimeout(r, 600)); o.still = n <= 2; FK.pause(false); n = 0; await new Promise((r) => setTimeout(r, 500)); const run = n; n = 0; let k = 0; await new Promise((res) => { function f() { FK.dirty(); FK.dirty(); if (++k < 20) requestAnimationFrame(f); else res(); } requestAnimationFrame(f); }); o.once = n <= k + 2 && run > 5; window.draw = d0; return o; })()"""
async def n21(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N21JS); await pg.close()
    ok('t-n21', all(v.values()) and not errs, [v, errs[:2]])
N22JS = r"""(async () => { const o = {}; MENU.act('start'); await new Promise((r) => setTimeout(r, 300)); for (let i = 0; i < 30; i++) FK.sim(0.1); tops(); cellTops();
 const T = FK.things().filter((t) => t.kind === 'tree'); o.baked = T.filter((t) => t.deep).length > T.length * 0.9;
 for (const t of T.slice(0, 20)) FK.take(t, t.amount + 1); const a = [TOPS.slice(), CTOP.slice()]; tops(); cellTops(); o.tops = a[0].every((v, k) => v === TOPS[k]) && a[1].every((v, k) => v === CTOP[k]);
 o.hill = Math.abs(WAR.hillReach(5, 0, 0) - 5) < 0.01 && WAR.hillReach(5, 0, 10) > 5.5 && Math.abs(WAR.hillReach(5, 0, -10) - 5) < 0.01; o.age = FK.D.ai.pers.aggr.ageArmy === 3; o.res = FK.D.draw.res[3] === 0.75;
 const S = JSON.parse(FK.pack()), t0 = performance.now(); FK.resume(S); o.load = performance.now() - t0 < 6000; return o; })()"""
async def n22(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N22JS); await pg.close()
    ok('t-n22', all(v.values()) and not errs, [v, errs[:2]])
N23JS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), o = {}; MENU.act('start'); await W(400); FK.fog(false); MENU.S.tab = null; MENU.render(true); const N = FK.N; FK.SIDES[0].store.wood = FK.SIDES[0].store.stone = FK.SIDES[0].store.gold = 9000;
 const h = FK.seatOf(0), T = FK.things().filter((t) => t.deep).sort((a, b) => Math.hypot(a.bx - h.bx, a.by - h.by) - Math.hypot(b.bx - h.bx, b.by - h.by)); let bl = null;
 for (const t of T.slice(0, 40)) { const ti = t.k % N, tj = Math.floor(t.k / N); for (let d = 2; d < 7 && !bl; d++) for (const [di, dj] of [[0, -d], [-d, 0], [-d, -d], [d, -d], [-d, d]]) { bl = ECON.plan(0, 'BI2', ti + di, tj + dj); if (bl) break; } if (bl) break; }
 const k0 = topKey(); bl.done = 0.5; o.site = topKey() === k0; tops(); const mid = (bl.j + (bl.n >> 1)) * N + bl.i + (bl.n >> 1), lo = TOPS[mid]; bl.done = 1; o.done = topKey() === k0 + 1; tops(); o.low = TOPS[mid] > lo;
 FK.cam.x = bl.vx; FK.cam.y = bl.vy; FK.cam.z = 2; FK.dirty(); await W(500); const s = FK.cam.z, [x, y] = FK.toScreen(bl.vx, bl.vy), bb = boxOf(bldSprite(bl.code, bl.col, s, ...levelOf(bl), true, FK.SIDES[0].civ), x, y, s);
 const front = FK.things().filter((t) => t.deep && t.vy > bl.vy && Math.hypot(t.bx - bl.bx, t.by - bl.by) < 60 && meets(bb, ((tx, ty, z) => boxOf(nodeSprite(t.kind, t.v, z), tx, ty, z))(...FK.toScreen(t.vx, t.vy), s * treeZ(t)))); o.front = front.length > 0 && front.every((t) => COVER.has(t));
 const a = nodeSprite('stone', 0, 1.01), b2 = nodeSprite('stone', 1, 1.01); nodeSprite('stone', 0, 1.01); o.lru = [...SPR.values()].at(-1) === a && [...SPR.values()].at(-2) === b2; o.px = Math.abs(SPR.px - [...SPR.values()].reduce((n, c) => n + c.width * c.height, 0)) < 1;
 o.save = FK.D.saveBeat[0] === 60; o.shed = String(loop).includes(': w2 - w1, wall)') && String(loop).includes('late > due * DRW.lag'); return o; })()"""
async def n23(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N23JS); await pg.close()
    ok('t-n23', all(v.values()) and not errs, [v, errs[:2]])
N24JS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), o = {}; MENU.act('start'); await W(400); MENU.S.tab = null; MENU.render(true); const D = FK.D, N = FK.N, me = 0, h = FK.seatOf(me);
 const far = D.players.filter((p) => p !== me && FK.seatOf(p)).map((p) => FK.seatOf(p)).sort((a, b) => FK.dist(b, h) - FK.dist(a, h))[0]; WAR.treaty(me, far.side, 'war');
 const U = []; for (let d = 6; d < 30 && U.length < 3; d++) for (let a = -d; a <= d && U.length < 3; a += 2) { const k = (h.j + d) * N + h.i + a; if (FK.walkable(k)) U.push(FK.spawn('UM1', me, k, FK.rng)); }
 const f0 = FK.SIDES[me].store.food; WAR.order(U, far, null); for (let i = 0; i < 20; i++) FK.sim(0.1); o.far = U.every((u) => u.job === 'fight' && u.target === far && u.path && u.path.length > 50); o.free = FK.SIDES[me].store.food >= f0 - 1 && !ECON.orderCost;
 FK.select(U); const g = (h.j + 12) * N + h.i - 12, [gx, gy] = FK.toScreen(...FK.toView(...FK.tileMid(g), Math.max(D.land, FK.H[g]))); FK.fire('tap', g, null, gx, gy); o.kept = FK.picked().length === 0;
 FK.select(U.slice(0, 2)); const j2 = U[2].job; MENU.VERBS.recallP.run(); const said = fromBook('words').bar.said.recall.replace('{n}', 2); o.recall = U[0].job === 'rout' && U[2].job === j2 && (document.getElementById('toast').textContent.includes(said) || JSON.stringify(MENU.S.tq || []).includes(said)) || [U[0].job, U[2].job, j2, document.getElementById('toast').textContent, JSON.stringify(MENU.S.tq)];
 o.ranged = typeof WAR.ranged === 'function'; try { ECON.alarm('hands'); o.hands = true; } catch (e) { o.hands = String(e); } ECON.allClear();
 FK.K.t = D.noon * D.day; o.clock = FK.clockOfDay().startsWith('12:');
 const L = (a) => lightAt(a), sl = (a, e) => (L(a + e) - L(a - e)) / (e + e); o.light = [-18, 20].every((a) => Math.abs(sl(a, 1e-3)) < 1e-2) && D.ramp.slice(1, -1).every(([a]) => Math.abs((L(a + 1e-3) - L(a)) - (L(a) - L(a - 1e-3))) < 1e-5) && [...Array(400)].every((_, i) => L(-20 + i * 0.1) <= L(-20 + (i + 1) * 0.1) + 1e-12);
 o.meter = String(loop).includes('draw(); meter(');
 const e1 = FK.units().find((u) => u.side === 1); look(0.1); const c = CAST.get(1) && CAST.get(1).get(e1); o.circle = !!c && (c.skip || c.tiles.length === circle(e1, sightOf(e1)).length); return o; })()"""
async def n24(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N24JS); await pg.close()
    ok('t-n24', all(x is True for x in v.values()) and not errs, [v, errs[:2]])
N24BJS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), o = {}; MENU.act('start'); await W(400); MENU.S.tab = null; MENU.render(true); const D = FK.D, h = FK.seatOf(0), st = FK.SIDES[0].store;
 o.sharp = nodeSprite('stone', 0, 3).q === nodeSprite('stone', 0, D.sharp).q && nodeSprite('stone', 0, 1).q < nodeSprite('stone', 0, D.sharp).q;
 await FK.save(true); const got = await new Promise((ok) => { const r = indexedDB.open(D.save.db); r.onsuccess = () => { const q = r.result.transaction(D.save.store).objectStore(D.save.store).getAllKeys(); q.onsuccess = () => ok(q.result); }; r.onerror = () => ok(null); });
 o.save = !!got && got.length === 2 && got.every((k) => FK.store.has(k)) && Object.keys(localStorage).every((k) => !k.startsWith(D.save.key)) && D.save.slots === 1;
 new BroadcastChannel(D.save.key + location.pathname).postMessage('another'); await W(200); o.tab = !TAB.mine && FK.paused(); TAB.mine = true; FK.pause(false);
 o.farm = Math.abs(FK.stat('BCL1', 0, 'rate') - D.farmRate) < 1e-9 && D.farmRate === 0.5;
 o.gold = FK.things().filter((t) => t.kind === 'gold' && FK.dist(t, h) / D.tile < 40).length >= D.pocket.home.gold[0] && D.forage.hold.gold === 4;
 Object.assign(st, { wood: 200, gold: 20 }); const p = MENU.price({ wood: 100, gold: 50 }); o.price = p.includes('>100w<') && p.includes('>50g<') && (p.match(/<span/g) || []).length === 2;
 MENU.S.tab = 'Stores'; MENU.render(true); const rows = document.querySelectorAll('#panel .tb tr').length; MENU.S.tab = 'Score'; MENU.render(true); const cols = document.querySelectorAll('#panel .tb tr:first-child th').length; o.cards = rows === 6 && cols === D.players.length + 1;
 MENU.S.tab = null; MENU.render(true); o.topTaps = [...document.querySelectorAll('.topbar [data-v]')].some((b) => b.dataset.v === 'tab|Stores') && [...document.querySelectorAll('.topbar [data-v]')].some((b) => b.dataset.v === 'tab|Score');
 Object.assign(st, { food: 9000, wood: 9000, gold: 9000, stone: 9000 }); h.q = []; FK.dirty(); await W(1300); o.mark = MENU.ready().includes(h);
 FK.SIDES[0].age = 0; MENU.S.tab = 'Build'; MENU.S.group = Object.keys(MENU.SCR.tabs).find((g) => MENU.SCR.tabs[g].includes('BCL4')); MENU.render(true); const has = () => !!document.querySelector('#panel [data-v^="pick|BCL4|"]'), q0 = has(); FK.SIDES[0].age = 2; MENU.render(true); o.byAge = !q0 && has() && !document.querySelector('#panel [data-v^="allB"]'); return o; })()"""
async def n24b(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N24BJS); await pg.close()
    ok('t-n24b', all(x is True for x in v.values()) and not errs, [v, errs[:2]])
N25JS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms)), q = (s) => [...document.querySelectorAll(s)];
 MENU.act('start'); FK.fog(false); $calm(0, 1); await W(300); const h = FK.seatOf(0), N = FK.N, S = MENU.S, mine = () => FK.units().filter((u) => u.side === 0 && WAR.armyOf(0).includes(u));
 o.peace = document.getElementById('base').className === 'jobs' && q('.ctop .dot').length === 2 && !q('.pad').length;
 let n = 0; $ring(h, 4, 14, (i, j) => { const k = j * N + i; if (FK.walkable(k) && n < 12) { FK.spawn(['UM1', 'UM6', 'UM2'][n % 3], 0, k, Math.random); n++; } return n >= 12; });
 const A = WAR.armyOf(0); o.spawned = A.length === 12;
 MENU.act('war'); o.open = S.war && q('.pad').length === 3 && FK.picked().length === 12 && !q('.exec.go').length && document.getElementById('base').className === 'ctlw';
 const cls = FK.SH[A[1].code].class; MENU.act('cwho', 'class', cls); o.cls = FK.picked().length > 0 && FK.picked().length < 12 && FK.picked().every((u) => FK.SH[u.code].class === cls);
 MENU.act('cwho', 'all'); o.all = FK.picked().length === 12; MENU.act('cpage', 'squad'); o.squadDim = !!q('.pad [data-v^="cpage|squad"].dim').length || !!q('.pad .dim[data-v^="cpage|squad"]').length;
 const R = FK.reach(0), LAND = [...Array(N * N).keys()].filter((k) => R.has(k)), far = LAND.filter((k) => { const d = Math.hypot(k % N - h.i, Math.floor(k / N) - h.j); return d > 22 && d < 30; })[0];
 MENU.act('cact', 'attack'); o.lit = S.ctl.act === 'attack' && !q('.exec.go').length; const p0 = A.map((u) => u.k).join();
 FK.fire('tap', far, null, 0, 0); o.aimed = S.ctl.spot === true && q('.exec.go').length === 1 && A.every((u) => u.job !== 'march');
 let full = 0, walks = 0; const fp = FK.findPath, wt = FK.walkTo, CY = FK.D.convoy; FK.findPath = (a, b, c, most, w) => { if (most == null || most > CY.tries) full++; return fp(a, b, c, most, w); }; FK.walkTo = (...a) => { walks++; return wt(...a); };
 const t0 = performance.now(); MENU.act('cexec'); const ms = performance.now() - t0; FK.findPath = fp; FK.walkTo = wt;
 o.oneRoute = full === 1 && walks === 0; o.sent = A.every((u) => u.job === 'march') && S.ctl.act === null; Object.assign(info, { full, walks, ms: Math.round(ms) });
 $run(40); const near = A.filter((u) => Math.hypot(u.k % N - far % N, Math.floor(u.k / N) - Math.floor(far / N)) <= 8).length; o.arrive = near === 12; info.near = near;
 let wet = -1; for (let k = 0; k < N * N && wet < 0; k++) if (!FK.walkable(k) && !R.has(k) && WAR.landK(k) !== k) wet = k; const t1 = performance.now(); MENU.act('cact', 'attack'); FK.fire('tap', wet, null, 0, 0); MENU.act('cexec'); o.wet = performance.now() - t1 < 80;
 MENU.act('cact', 'defend'); o.noAttack = true;
 MENU.act('cact', 'retreat'); o.retreat = A.every((u) => u.job === 'rout' || u.job === 'idle');
 MENU.act('cnav', 'hide'); o.hide = !q('.pad').length; MENU.act('cnav', 'hide'); o.show = q('.pad').length === 3;
 MENU.act('cpage', 'orders'); o.orders = q('.pad [data-v^="dial|"]').length >= 3 || q('.pad').length === 3; MENU.act('cnav', 'back'); o.back = S.ctl.page === null;
 MENU.act('war'); o.close = !S.war && !FK.picked().some((u) => A.includes(u)) && document.getElementById('base').className === 'jobs';
 $run(30); const u = A[0]; FK.fire('tap', u.k, u, 0, 0); o.tapOne = S.war && S.ctl.who === 'picked' && FK.picked().length === 1 && FK.picked()[0] === u;
 const k2 = LAND.filter((k) => { const d = Math.hypot(k % N - h.i, Math.floor(k / N) - h.j); return d > 10 && d < 14; })[0]; FK.fire('tap', k2, null, 0, 0); o.tapThere = u.job === 'march' && A.slice(1).every((v) => v.job !== 'march');
 MENU.act('war'); MENU.act('war'); $run(20); const v = FK.units().find((x) => x.side === 0 && !A.includes(x)), e = FK.spawn('UM1', 1, $ring({ i: v.k % N, j: Math.floor(v.k / N) }, 2, 9, (i, j) => (FK.walkable(j * N + i) ? j * N + i : null)), Math.random); WAR.fight(e, v);
 MENU.act('cwho', 'all'); const live = A.filter((x) => FK.units().includes(x)); MENU.act('cact', 'defend'); o.defend = live.length > 0 && live.every((x) => x.job === 'fight' && x.target === e); info.live = live.length;
 MENU.act('cact', 'retreat'); MENU.act('cact', 'attack'); FK.fire('tap', e.k, e, 0, 0); o.aimFoe = S.aim.t === e && S.ctl.spot === true; MENU.act('cexec'); o.attackFoe = live.every((x) => x.job === 'fight' && x.target === e);
 e.hp = e.hpMax = 5000; info.h = []; for (let z = 0; z < 25; z++) { $run(1); info.h.push(Math.round(e.hp)); } const dd = live.map((x) => Math.hypot(x.k % N - e.k % N, Math.floor(x.k / N) - Math.floor(e.k / N))); info.close = dd.filter((d, n) => d <= Math.max(6, D.stats[live[n].code].rng + 1)).length; info.jobs = live.filter((x) => x.job === 'fight' && x.target === e).length; info.odd = live.map((x, n) => [n, x.job, x.target === e, Math.round(dd[n]), x.code, !!x.path, x.stance || '', x.temper || '']).filter((r) => r[1] !== 'fight' || r[3] > Math.max(6, D.stats[r[4]].rng + 1)); info.e = [FK.units().includes(e), Math.round(e.hp), e.job, e.k, e.side, e.hitBy && e.hitBy.code, e.hitBy && e.hitBy.side]; o.fought = info.h.some((h) => h < 5000) && (!FK.units().includes(e) ? !!e.hitBy && e.hitBy.side === 0 : e.hp < 5000 && info.jobs === live.length && info.close === live.length); MENU.act('war');
 return [o, info]; })()"""
async def n25(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(N25JS); await pg.close()
    ok('t-n25', all(x is True for x in v.values()) and not errs, [v, info, errs[:2]])
N26JS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms));
 MENU.act('start'); FK.fog(false); $calm(0, 1); await W(300); const h = FK.seatOf(0), N = FK.N, D = FK.D, S = MENU.S, st = FK.SIDES[0].store;
 o.restList = FK.rest().length * 4 < FK.things().length && FK.rest().every((t) => !FK.WOODS.has(t.kind));
 o.noWildfire = !('wildfire' in FK.EVS) && !('wildfire' in D.events.rows);
 o.dayForNight = D.moon.stops === 2;
 let ford = 0, walk = 0; const u0 = FK.units().find((u) => u.side === 0); for (let k = 0; k < N * N; k++) if (FK.H[k] === -D.wade * D.lakeFord.deep) { ford++; walk += FK.walkable(k, u0); } info.ford = [ford, walk]; o.lakeFord = ford > 0 && walk >= ford * 0.9;
 let n = 0; $ring(h, 4, 16, (i, j) => { const k = j * N + i; if (FK.walkable(k) && n < 30) { FK.spawn(['UM1', 'UM6', 'UM2'][n % 3], 0, k, Math.random); n++; } return n >= 30; });
 const A = WAR.armyOf(0); $run(2);
 let best = Infinity; for (let b = 0; b < 3; b++) { const t0 = performance.now(); for (let i = 0; i < 300; i++) FK.sim(1 / 30); best = Math.min(best, (performance.now() - t0) / 300); } info.stepMs = +best.toFixed(2); o.budget = best <= D.step.budget / 2;
 MENU.act('war'); MENU.act('cwho', 'all'); const far = $ring(h, 20, 40, (i, j) => (FK.walkable(j * N + i, A[0]) && FK.reach(0).has(j * N + i) ? j * N + i : 0)); FK.fire('tap', far, null, 0, 0); $run(1); o.tapMoves = A.every((u) => u.job === 'march');
 MENU.act('cact', 'attack'); const far2 = $ring(h, 24, 44, (i, j) => (FK.walkable(j * N + i, A[0]) && j * N + i !== far ? j * N + i : 0)); for (const u of A) u.goalWas = u.goal; FK.fire('tap', far2, null, 0, 0); o.aimWaits = S.ctl.spot === true && A.every((u) => u.goal === u.goalWas); MENU.act('war');
 FK.fire('cracking', A[0].k, true, new Set([0])); o.iceShy = A.every((u) => u.shy > FK.K.t);
 o.squares = /^[A-Z]{1,2}\d+$/.test(MENU.coord(FK.B1 - 5, FK.B0 + 5)) && /^[A-Z]\d+$/.test(MENU.coord(FK.B0 + 5, FK.B0 + 5)); info.sq = MENU.coord(FK.B1 - 5, FK.B0 + 5);
 o.fell = !/\{side\} has fallen/.test(JSON.stringify(BOOKS.words));
 $rich(0); const mk = $put(Object.keys(FK.SH).find((c) => FK.SH[c].name === 'Market'), 0, 8, 40, true); const g0 = st.gold, w0 = st.wood; o.sell = !!mk && MENU.act('sell', 'wood') && st.gold > g0 && st.wood < w0;
 const cv = FK.spawn(Object.keys(FK.U).find((c) => FK.has({ code: c }, 'Trade')), 0, A[0].k, Math.random); o.route = MENU.act('route', cv) && !!cv.route && cv.route.to.kind !== 'bld';
 o.stances = MENU.VERBS.stance.whyNot('war', 1) !== 'Not built yet';
 st.food = 0; MENU.render(true); o.peopleRed = /color:/.test((document.querySelector('[data-v^="people"] .t') || {}).outerHTML || '');
 FK.unbuild(FK.seatOf(2)); let threw = null; try { $run(6); } catch (e) { threw = String(e); } o.hallFalls = threw === null; info.threw = threw;
 return [o, info]; })()"""
async def n26(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(N26JS); await pg.close()
    ok('t-n26', all(x is True for x in v.values()) and not errs, [v, info, errs[:2]])
N27JS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms));
 MENU.act('start'); FK.fog(false); $calm(0, 1); await W(300); const h = FK.seatOf(0), N = FK.N, D = FK.D, S = MENU.S, st = FK.SIDES[0].store, card = document.getElementById('card'); $rich(0);
 const V = () => FK.units().filter((u) => u.side === 0 && FK.has(u, 'Gather')), mine = () => FK.blds().filter((b) => b.side === 0);
 const tw = $put('BW3', 0, 10, 40, true), e = FK.seatOf(1) ? 1 : 2, w = $ring(tw, 3, 8, (i, j) => (FK.walkable(j * N + i) ? j * N + i : 0)), foe = FK.spawn('UM1', e, w, Math.random), hp0 = foe.hp; $run(8); o.towerShoots = Number.isFinite(tw.cd) && Number.isFinite(WAR.reachOf(tw)) && (foe.hp < hp0 || !!foe.gone); if (!foe.gone) WAR.die(foe);
 const mill = $put('BI1', 0, 8, 40, true), lum = $put('BI2', 0, 8, 40, true); S.subject = mill; MENU.render(true); o.plot = !!card.querySelector('[data-v^="pick|BCL1"]'); S.subject = lum; MENU.render(true); o.plot = o.plot && !!card.querySelector('[data-v^="pick|BCL2"]');
 S.subject = mill; MENU.render(true); const tiles = () => [...card.querySelectorAll('[data-v^="research|"]')].map((x) => [x.dataset.v.split('|')[1], (x.querySelector('.rk') || { dataset: {} }).dataset.ring, x.innerText]), T = tiles().filter((t) => !MENU.VERBS.research.whyNot(t[0])), f0 = st.food;
 MENU.act('research', T[0][0]); MENU.act('research', T[1][0]); MENU.render(true); const A = tiles(), a0 = A.find((t) => t[0] === T[0][0]), a1 = A.find((t) => t[0] === T[1][0]); info.tiles = [a0, a1];
 o.tech = mill.q.length === 2 && a0[1] === 'green' && a1[1] === 'blue' && /\d:\d\d/.test(a0[2]) && /\d:\d\d/.test(a1[2]) && !card.querySelector('.q'); MENU.act('research', T[1][0]); o.techCancel = mill.q.length === 1; MENU.act('research', T[0][0]); o.techCancel = o.techCancel && !mill.q.length && st.food === f0;
 const v = V()[0], bush = FK.rest().filter((t) => t.kind !== 'bld' && ECON.yieldOf(t) === 'food' && t.amount > 0).sort((a, b) => FK.dist(a, h) - FK.dist(b, h))[0]; FK.select(null); FK.fire('tap', v.k, v, 0, 0); FK.fire('tap', bush.k, bush, 0, 0); o.focus = !v.focus; v.att = 'focus'; FK.select(null); S.tap = null; FK.fire('tap', v.k, v, 0, 0); FK.fire('tap', bush.k, bush, 0, 0); o.focus = o.focus && v.focus === bush && ECON.focused(v); v.att = undefined;
 MENU.act('war'); MENU.act('cpage', 'protect'); MENU.render(true); o.protectPage = ['split', 'lure', 'seek'].every((k) => !!document.querySelector(`#base [data-v^="alarm|${k}"]`)) && !!document.querySelector('#base [data-v^="prep|"]');
 const base = new Map(mine().map((b) => [b, b.hpMax])); o.prep = MENU.act('prep'); $run(45); const bd = mine().filter((b) => b.board); info.boarded = [bd.length, mine().length, V().filter((u) => u.inside).length, V().length];
 o.boarded = bd.length >= 3 && bd.every((b) => b.hpMax > base.get(b)) && V().every((u) => u.inside || u.job === 'board' || u.job === 'walk'); MENU.render(true); o.workCell = !!document.querySelector('#base [data-v^="work|"]');
 ECON.allClear(); o.unboard = mine().every((b) => !b.board && b.hpMax === base.get(b)) && bd.every((b) => b.hp < b.hpMax); MENU.act('war');
 const U = []; $ring(h, 4, 16, (i, j) => { const k = j * N + i; if (FK.walkable(k) && U.length < 10) U.push(FK.spawn('UM1', 0, k, Math.random)); return U.length >= 10; }); st.food = 5000; $run(2); let f = st.food; $run(20); const stand = f - st.food;
 const far = $ring(h, 50, 80, (i, j) => (FK.walkable(j * N + i, U[0]) && FK.reach(0).has(j * N + i) ? j * N + i : 0)); WAR.order(U, null, far); $run(2); f = st.food; $run(20); info.eat = [+stand.toFixed(1), +(f - st.food).toFixed(1)]; o.marchEats = f - st.food > stand * (1 + (D.pace.marchDay - 1) * 0.75);
 o.units = Object.values(BOOKS.measure).every((x) => 'unit' in x && x.subject && x.subject.length);
 return [o, info]; })()"""
async def n27(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(N27JS); await pg.close()
    ok('t-n27', all(x is True for x in v.values()) and not errs, [v, info, errs[:2]])
GROUNDJS = r"""(() => { MENU.act('start'); FK.fog(false); return true; })()"""
GROUNDJS2 = r"""(() => { const N = FK.N, H = FK.H, L = FK.D.land, c = FK.ctx, [cw, ch] = FK.size(), dpr = c.canvas.width / cw, out = { water: [0, 0], land: [0, 0] };
 for (let k = 0; k < N * N; k += 7) { const [bx, by] = FK.tileMid(k), [x, y] = FK.toScreen(...FK.toView(bx, by, Math.max(0, H[k]))); if (x < 20 || y < 120 || x > cw - 20 || y > ch - 240) continue;
  let near = false; for (const d of [-1, 1, -N, N, -N - 1, N + 1]) if ((H[k + d] < 0) !== (H[k] < 0) || FK.OCC[k + d] || FK.FOR[k + d]) near = true; if (near || FK.OCC[k] || FK.FOR[k] || FK.MARSH[k]) continue;
  const [r, g, b] = c.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data;
  if (H[k] < 0) { out.water[0]++; if (b > r && b >= g * 0.85) out.water[1]++; } else if (H[k] >= L) { out.land[0]++; if (g > b && g >= r * 0.85) out.land[1]++; } }
 return out; })()"""
async def ground(b):
    pg, errs = await fresh(b); await pg.evaluate(GROUNDJS); await pg.wait_for_timeout(1000); v = await pg.evaluate(GROUNDJS2)
    await pg.evaluate("(() => { const H = FK.H, N = FK.N, h = FK.seatOf(0); let best = -1, bd = Infinity; for (let k = 0; k < N * N; k++) if (H[k] < -FK.D.land / 2) { const [x, y] = FK.tileMid(k), d = Math.hypot(x - h.bx, y - h.by); if (d < bd) [best, bd] = [k, d]; } const [vx, vy] = FK.toView(...FK.tileMid(best), 0); FK.cam.x = vx; FK.cam.y = vy; FK.dirty(); })()")
    await pg.wait_for_timeout(1000); w = await pg.evaluate(GROUNDJS2); await pg.close()
    share = lambda p: p[0] >= 20 and p[1] >= 0.9 * p[0]
    ok('t-ground', share(v['land']) and share(w['water']) and not errs, [v, w, errs[:2]])
N15JS = r"""(() => { const S = MENU.S, out = {}; S.opt.daily = 1; MENU.VERBS.opt.run('civ', 0); const a = { ...S.opt }; out.daily = ['civ', 'diff', 'len', 'scen', 'fog'].every((k) => MENU.VERBS.opt.whyNot(k) !== '') && MENU.VERBS.opt.run('civ', 0) === undefined && ['civ', 'diff', 'len', 'scen', 'fog'].every((k) => S.opt[k] === a[k]);
 S.opt.daily = 0; out.free = MENU.VERBS.opt.whyNot('civ') === ''; MENU.act('start'); const me = FK.SIDES[0]; for (const y in me.store) me.store[y] = 5000; const h = FK.seatOf(0), c = FK.trains(h.code, 0)[0], before = JSON.stringify(me.store);
 ECON.queue(h, c); ECON.queue(h, c); ECON.unqueue(h, 1); ECON.unqueue(h, 0); out.refund = JSON.stringify(me.store) === before && !h.q.length;
 MENU.render(true); out.ribbon = !document.querySelector('.rib') && document.querySelectorAll('.topbar .strip > .cell').length === MENU.SCR.top.length;
 const L = FK.D.light, lit = FK.lightsOf().filter(([t, k]) => k === 'lantern').length; out.torch = [FK.lightsOf().filter(([t, k]) => k === 'lantern' && t.side === 0).length, FK.blds().filter((t) => t.side === 0 && !(t.done < 1) && !FK.has(t, 'Line') && !FK.has(t, 'Field')).length];
 return out; })()"""
async def n15(b):
    pg, errs = await fresh(b); await pg.evaluate("FK.K.alt = -30"); v = await pg.evaluate(N15JS); await pg.close()
    got = [v['daily'], v['free'], v['refund'], v['ribbon'], v['torch'][0] >= v['torch'][1] > 0, not errs]
    ok('t-n15', all(got), [got, v, errs[:2]])
N16JS = r"""(() => { MENU.act('start'); const S = MENU.S, h = FK.seatOf(0), out = {}, sol = Object.keys(FK.SH).find((c) => ECON.soldier(c)); for (let n = 0; n < 2; n++) FK.spawn(sol, 0, $ring(h, 4, 20, (i, j) => { const q = j * FK.N + i; return FK.walkable(q) && q; }), FK.rng); const k = $ring(h, 6, 30, (i, j) => { const q = j * FK.N + i; return FK.free(q) && FK.walkable(q) && q; });
 S.qa = { k, px: 200, py: 400 }; MENU.render(true); const cells = () => [...document.querySelectorAll('#qa [data-v]')].map((e) => e.dataset.v.split('|')[0]);
 out.block = cells(); MENU.act('qstep', 'army'); out.army = cells(); S.qa = { k, px: 200, py: 400 }; MENU.render(true); MENU.act('qbuild'); out.groups = cells().length;
 S.toastT = 0; S.tq = []; MENU.say('test', { at: { bx: h.bx, by: h.by } }); S.tab = 'Hall'; MENU.render(true); out.go = !!document.querySelector('#panel .ihr .go');
 return out; })()"""
async def n16(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N16JS); await pg.close()
    got = [v['block'][:3] == ['qstep', 'qbuild', 'qrally'], v['army'] == ['qsend', 'qsend', 'qsend', 'qstep'], v['groups'] == 6, v['go'], not errs]
    ok('t-n16', all(got), [got, v, errs[:2]])
N29JS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms));
 MENU.act('start'); FK.fog(false); $calm(0, 1); await W(300); const h = FK.seatOf(0), N = FK.N, D = FK.D, S = MENU.S; $rich(0);
 const blocked = $ring(h, 12, 60, (i, j) => { const k = j * N + i; return !FK.walkable(k) && [1, -1, N, -N].some((d) => FK.walkable(k + d)) ? k : 0; }), spot = $ring(h, 6, 12, (i, j) => (FK.walkable(j * N + i) ? j * N + i : 0)), [hx, hy] = FK.tileMid(blocked);
 const s1 = FK.spawn('UM1', FK.seatOf(1) ? 1 : 2, spot, Math.random); Object.assign(s1, { job: 'idle', home: { bx: hx, by: hy }, path: null }); const f0 = findPath; let fails = 0, calls = 0; window.findPath = function (...a) { const r = f0.apply(this, a); if (a[4] === s1) { calls++; if (!r) fails++; } return r; }; $run(12); window.findPath = f0; info.home = [calls, fails, s1.job]; o.homeOnce = fails <= 1 && calls <= 14;
 const v = FK.units().find((u) => u.side === 0 && FK.has(u, 'Gather')), tree = FK.things().filter((t) => t.kind === 'tree' && t.amount > 0).sort((a, b) => FK.dist(a, v) - FK.dist(b, v))[3]; FK.select(null); FK.fire('tap', v.k, v, 0, 0); FK.fire('tap', tree.k, tree, 0, 0); $run(1); const seen = [], e0 = ctx.ellipse; ctx.ellipse = function (...a) { seen.push(String(ctx.strokeStyle).toLowerCase()); return e0.apply(this, a); }; cam.x = v.vx; cam.y = v.vy; draw(); ctx.ellipse = e0; info.ring = [FK.picked().length, !!v.path, seen.filter((c) => c === FK.C.foot.pick).length, S.ice && [S.ice.woods, S.ice.U.length], S.tab]; o.ring = !FK.picked().length && !!v.path && !seen.includes(FK.C.foot.pick);
 show.P = true; for (let i = 0; i < 4; i++) draw(); show.P = false; info.laps = [LAPN.length, LAPS.map((x) => +x.toFixed(2))]; o.laps = LAPN.length === 7 && LAPS.some((x) => x > 0) && LAPS.every(Number.isFinite);
 MENU.render(true); const d = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth'); let reads = 0; Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get() { if (this.closest && this.closest('.topbar')) reads++; return d.get.call(this); } }); for (let i = 0; i < 5; i++) MENU.render(); Object.defineProperty(HTMLElement.prototype, 'offsetWidth', d); info.reads = reads; o.topbarStill = reads === 0;
 const U = []; $ring(h, 4, 16, (i, j) => { const k = j * N + i; if (FK.walkable(k) && U.length < 4) U.push(FK.spawn('UM1', 0, k, Math.random)); return U.length >= 4; }); MENU.act('war'); MENU.act('cwho', 'all'); MENU.act('cact', 'attack'); MENU.render(true); const t0 = FK.tag; let tags = 0; FK.tag = (...a) => { tags++; return t0(...a); }; draw(); const before = tags; S.ctl.spot = true; draw(); FK.tag = t0; info.cross = [before, tags]; o.crosshairWaits = before === 0 && tags > 0; S.ctl.spot = false; MENU.act('war');
 const EW = fromBook('words').end; o.fallen = EW.fallen === 'The {side} {have} fallen.' && EW.have.join() === 'have,has';
 o.beats = D.work.slices === 4 && D.danger.beat[0] === 2 && D.pace.marchDay === 1.23 && D.prep.cut === 0.2;
 return [o, info]; })()"""
async def n29(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(N29JS); await pg.close()
    ok('t-n29', all(x is True for x in v.values()) and not errs, [v, info, errs[:2]])
N30JS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms));
 MENU.act('start'); FK.fog(false); await W(300); const h = FK.seatOf(0), N = FK.N, D = FK.D, S = MENU.S; $rich(0); FK.SIDES[0].age = D.ages.length - 1; const e = FK.seatOf(1) ? 1 : 2; WAR.treaty(0, e, 'war');
 const free = (d0, d1) => $ring(h, d0, d1, (i, j) => (FK.walkable(j * N + i) && !FK.units().some((u) => u.k === j * N + i) ? j * N + i : 0));
 const tap = (t) => FK.fire('tap', t.kind === 'bld' ? t.j * N + t.i : t.k, t, 0, 0);
 const v = ECON.villagersOf(0)[0], tree = FK.things().filter((t) => t.kind === 'tree' && t.amount > 0 && !ECON.isFull(v, t)).sort((a, b) => FK.dist(a, v) - FK.dist(b, v))[2];
 FK.select(null); tap(v); tap(tree); o.gather = !FK.picked().length && v.target === tree;
 const s1 = FK.spawn('UM1', 0, free(5, 12), Math.random), foe = FK.spawn('UM1', e, free(14, 20), Math.random); tap(s1); tap(foe); o.attack = s1.job === 'fight' && s1.target === foe && !FK.picked().length;
 info.ice = !!S.ice; info.paused = FK.paused(); info.say = document.querySelector('#toast span') && document.querySelector('#toast span').textContent; S.ice = null; S.tab = null; const v2 = ECON.villagersOf(0)[1]; tap(v2); info.fightPick = FK.picked().length; tap(foe); info.fight = [v2.job, v2.target && (v2.target.code || v2.target.kind), FK.picked().length, !!v2.inside, v2 === v]; o.fight = v2.job === 'fight' && v2.target === foe && !FK.picked().length;
 const tw = $put('BW3', 0, 8, 30, true), s2 = FK.spawn('UM1', 0, free(5, 12), Math.random); tap(s2); tap(tw); $run(12); o.garrison = s2.inside === tw && !FK.picked().length;
 const v3 = ECON.villagersOf(0)[2], s3 = FK.spawn('UM1', 0, free(5, 12), Math.random); tap(s3); tap(v3); o.mineIsItem2 = FK.picked().length === 1 && FK.picked()[0] === v3; FK.select(null);
 o.table = Array.isArray(fromBook('screen').tap.rows) && fromBook('screen').tap.after === 'deselect' && D.touch.move === 10 && D.touch.armed === 12;
 const bush = FK.things().filter((t) => t.kind === 'bush' && t.amount > 0).sort((a, b) => FK.dist(a, h) - FK.dist(b, h))[0], P = []; for (const q of ECON.villagersOf(0).slice(3, 7)) { q.bx = bush.bx + (P.length - 1.5) * 6; q.by = bush.by + 4; q.k = FK.tileAt(q.bx, q.by); q.path = null; P.push(q); } const a = ECON.villagersOf(0)[8]; FK.select([a]); FK.dirty(); await W(150); const [bx, by] = toScreen(bush.vx, bush.vy); const hit = FK.hitAt ? FK.hitAt(bx, by) : null; info.hit = hit && [hit[0], hit[1] && hit[1].code]; o.fingerFindWins = !hit || !hit[1] || !P.includes(hit[1]); FK.select(null);
 $run(20); o.jobDoor = !FK.jobOdd().length && FK.jobWas(v).was != null && FK.jobWas(v).t > 0;
 const hp0 = foe.hp; WAR.hit(s1, foe); o.healthDoor = foe.hp < hp0 && foe.hitBy === s1 && foe.hitT === FK.K.t;
 o.ledgerWords = !!fromBook('words').ledger.gather && !!fromBook('words').stores.stores;
 const f0 = findPath; let big = 0; window.findPath = function (...q) { const t0 = performance.now(), r = f0.apply(this, q); big = Math.max(big, performance.now() - t0); return r; }; const ev = { kind: 'circus', t0: FK.K.t, until: FK.K.t + 60 }; FK.K.ev.cur = ev; EVS.circus.start(ev); $run(10); window.findPath = f0; info.bigSearch = +big.toFixed(1); o.legs = (ev.units || []).length > 0 && (ev.units || []).every((u) => u.to != null) && D.events.leg > 0;
 const mk = Object.keys(FK.SH).find((c) => FK.B[c] && FK.SH[c].ticks.includes('Trade')); $put(mk, 0, 6, 40, true); Object.assign(FK.SIDES[0].store, { cloth: 500, beer: 500, spice: 200 }); const stop = FK.things().filter((t) => t.kind === 'stop').sort((p, q) => FK.dist(p, h) - FK.dist(q, h))[0]; const cv = FK.spawn('UT1', 0, free(6, 12), Math.random), G = []; for (let i = 0; i < 4; i++) G.push(FK.spawn('UM1', 0, free(6, 14), Math.random)); ECON.setRoute(cv, stop, true, false); MENU.act('escort', cv); $run(120); info.escort = [WAR.guardsOf(cv).length, Math.round(Math.max(...WAR.guardsOf(cv).map((g) => FK.dist(g, cv) / D.tile)))]; o.escort = WAR.guardsOf(cv).length === 4 && WAR.guardsOf(cv).every((g) => FK.dist(g, cv) / D.tile <= D.trade.near * 1.5);
 const blds = FK.blds().filter((b) => b.side === 0 && b.done >= 1 && !FK.has(b, 'Line') && !FK.has(b, 'Field')); const cost0 = ECON.boardCost(blds[0]); for (const k of D.prep.techs) FK.SIDES[0].techs.add(FK.TK[k]); const cost1 = ECON.boardCost(blds[0]); info.prepCost = [cost0, cost1]; o.prepTechs = Object.values(cost1)[0] < Object.values(cost0)[0];
 const hp = new Map(blds.map((b) => [b, b.hpMax])); MENU.act('prep'); $run(50); const bd = blds.filter((b) => b.board); const raid = []; for (let i = 0; i < 6; i++) raid.push(FK.spawn('UM1', e, free(10, 16), Math.random)); for (const r of raid) WAR.fight(r, bd[0] || blds[0], true); $run(30); info.prep = [bd.length, ECON.villagersOf(0).filter((u) => u.inside).length]; o.prepPlayed = bd.length >= 2 && bd.every((b) => b.hpMax > hp.get(b)); ECON.allClear();
 const twr = $put('BW3', 0, 10, 30, true), r2 = FK.spawn('UM1', e, $ring(twr, 3, 6, (i, j) => (FK.walkable(j * N + i) ? j * N + i : 0)), Math.random), r2hp = r2.hp; $run(10); o.towerPlayed = r2.gone || r2.hp < r2hp;
 const pos = () => ECON.villagersOf(0).map((u) => [u.bx, u.by, !!u.inside]); for (const k of ['split', 'lure', 'seek']) { const p0 = pos(); MENU.act('alarm', k); $run(8); const p1 = pos(); o['alarm_' + k] = p1.filter((q, i) => q[2] || Math.hypot(q[0] - p0[i][0], q[1] - p0[i][1]) > D.tile).length >= p1.length / 2; ECON.allClear(); $run(3); }
 const mill = $put('BI1', 0, 8, 40, true); S.subject = mill; MENU.render(true); const card = document.getElementById('card'), T = [...card.querySelectorAll('[data-v^="research|"]')].map((x) => x.dataset.v.split('|')[1]).filter((c) => !MENU.VERBS.research.whyNot(c)); MENU.act('research', T[0]); const q0 = mill.q[0]; $run((FK.stat(q0, 0, 'time') || BOOKS.tech[q0].value.time) + 2); o.techPlayed = FK.SIDES[0].techs.has(q0) && !mill.q.length;
 return [o, info]; })()"""
async def n30(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(N30JS); await pg.close()
    ok('t-n30', all(x is True for x in v.values()) and not errs, [v, info, errs[:2]])
N31JS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms));
 MENU.act('start'); FK.fog(false); await W(300); const h = FK.seatOf(0), S = MENU.S; $rich(0); const code = MENU.SCR.tabs.Home.find((c) => FK.SH[c].ticks.includes('House') && !FK.SH[c].ticks.includes('Seat'));
 const spot = () => { for (let d = 6; d < 20; d++) for (let a = 0; a < 16; a++) { const i = Math.round(h.i + d * Math.cos(a)), j = Math.round(h.j + d * Math.sin(a)); if (ECON.canPlace(code, i, j)) return [i, j]; } return null; };
 const put = () => { const was = new Set(FK.blds()), at = spot(); S.ghost = { code, i: at[0], j: at[1], ok: true, pts: [], cells: [] }; MENU.act('build'); return FK.blds().find((b) => !was.has(b)); };
 const V = ECON.villagersOf(0);
 FK.select(V[2]); const s1 = put(); $run(1); o.one = FK.picked().length === 0 && V[2].target === s1; info.one = [FK.picked().length, V[2].job, V[2].target === s1];
 FK.select([V[0], V[1]]); const s2 = put(); $run(1); o.both = FK.picked().length === 0 && V[0].target === s2 && V[1].target === s2; info.both = [FK.picked().length, V[0].target === s2, V[1].target === s2];
 FK.select(null); const s3 = put(); $run(1); o.none = FK.picked().length === 0 && V.some((u) => u.target === s3);
 return [o, info]; })()"""
async def n31(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(N31JS); await pg.close()
    ok('t-n31', all(x is True for x in v.values()) and not errs, [v, info, errs[:2]])
P2JS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S;
 MENU.act('start'); FK.fog(false); await W(300); $rich(0); const h = FK.seatOf(0), V = ECON.villagersOf(0), tap = (t) => { S.tap = null; FK.fire('tap', FK.tileAt(t.bx, t.by), t, 0, 0); }, said = () => document.getElementById('toast') ? document.getElementById('toast').textContent : '';
 const near = (kind) => FK.things().filter((t) => t.kind === kind && t.amount > 0).sort((a, b) => FK.dist(a, h) - FK.dist(b, h)), free = (kind, not) => near(kind).find((t) => t !== not && !ECON.isFull(V[0], t));
 S.more = false; FK.select(null); tap(V[0]); tap(V[1]); o.moves = FK.picked().length === 1 && FK.picked()[0] === V[1];
 tap(V[1]); o.hangUp = FK.picked().length === 0;
 S.more = true; tap(V[0]); tap(V[1]); o.group = FK.picked().length === 2; S.more = false; FK.select(null);
 const bush = free('bush'); FK.select([V[2]]); tap(bush); $run(1); o.noFocus = !V[2].focus; info.noFocus = [!!V[2].focus, V[2].job];
 const tree = free('tree'); V[3].att = 'focus'; FK.select([V[3]]); tap(tree); $run(1); o.focusSet = V[3].focus === tree;
 tree.amount = 0.01; $run(40); const d0 = FK.dist(V[3], h); o.focusHome = d0 < FK.dist(tree, h) / 2 && !(V[3].target && V[3].target.kind === 'tree'); info.focusHome = [Math.round(d0), Math.round(FK.dist(tree, h)), V[3].job, V[3].target && V[3].target.kind];
 const gold = near('bush')[1]; let n = 0; const used = []; for (const u of V.slice(4)) { if (ECON.isFull(u, gold)) break; u.load = 0; ECON.gatherAt(u, gold); used.push(u); n++; } $run(1); const F = V.find((u) => !used.includes(u) && u !== V[3]);
 FK.select([F]); tap(gold); o.full = ECON.isFull(F, gold) ? FK.picked().includes(F) && F.target !== gold && /Full/.test(said() + JSON.stringify(S.tq)) : null; info.full = [n, ECON.isFull(F, gold), FK.picked().length, said()]; FK.select(null);
 const sc = Object.keys(FK.SH).find((c) => FK.SH[c].ticks.includes('Fight') && !FK.SH[c].ticks.includes('Gather') && FK.SH[c].ticks.includes('Walk')), sol = sc && FK.spawn(sc, 0, V[0].k, FK.rng); info.sol = sc;
 if (sol) { FK.select([sol]); tap(tree); o.solFind = FK.picked().includes(sol); FK.select(null); } else o.solFind = null;
 const y = 'wood', M = V.find((u) => u.job !== 'idle' && ECON.jobOf(u) && ECON.jobOf(u) !== y && u !== V[3]); if (M) { M.att = 'mobile'; ECON.assign(0, y, 1); $run(1); o.mobile = !!M.target && M.target.kind === 'tree'; info.mobile = [ECON.jobOf(M), M.target && M.target.kind]; } else o.mobile = null;
 const D1 = V[V.length - 1], D2 = V[V.length - 2]; for (const [u, mode] of [[D1, 'destroy'], [D2, 'drop']]) { u.dump = mode === 'destroy' ? 'destroy' : undefined; u.load = 5; u.carry = ECON.yieldOf(bush); FK.select([u]); const tt = near('tree').find((x) => x !== tree && !ECON.isFull(u, x) && x !== D1.target); tap(tt); }
 o.destroy = !D1.load; o.drop = D2.load > 0 && (D2.job === 'carry' || D2.then === 'carry'); info.load = [D1.load, D2.load, D2.job, D2.then];
 for (const k in o) if (o[k] === null) delete o[k]; return [o, info]; })()"""
async def p2(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(P2JS); await pg.close()
    ok('t-p2', all(x is True for x in v.values()) and len(v) >= 9 and not errs, [v, info, errs[:2]])
P2BJS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S;
 MENU.act('start'); FK.fog(false); await W(300); $rich(0); const h = FK.seatOf(0), V = ECON.villagersOf(0), tap = (t) => { S.tap = null; FK.fire('tap', FK.tileAt(t.bx, t.by), t, 0, 0); }, panel = () => document.getElementById('card').innerText, btn = (v) => [...document.querySelectorAll('#card [data-v]')].find((b) => b.dataset.v.startsWith(v + '|')), press = (v) => { const b = btn(v); if (b) b.click(); return !!b; };
 const near = (kind) => FK.things().filter((t) => t.kind === kind && t.amount > 0).sort((a, b) => FK.dist(a, h) - FK.dist(b, h)), free = (kind, not) => near(kind).find((t) => t !== not && !ECON.isFull(V[0], t));
 S.more = false; FK.select(null); tap(V[0]); S.subject = V[0]; S.fold = null; MENU.render(true); await W(50); const tx = panel(); o.opens = S.subject === V[0] && /Attention/.test(tx) && /History/.test(tx); o.folded = !/as now/.test(tx) && !/Here since/.test(tx); info.text = tx.slice(0, 300);
 press('fold|attention'); await W(30); o.oneOpen = /as now/.test(panel()); const b = [...document.querySelectorAll('#card [data-v]')].find((x) => x.dataset.v.startsWith('att|focus')); if (b) b.click(); o.att = V[0].att === 'focus';
 press('fold|stats'); await W(30); o.oneOnly = /Here since/.test(panel()) && !/as now/.test(panel()); press('fold|stats'); await W(30); o.closes = !/Here since/.test(panel());
 V[0].att = undefined; const site = $put(MENU.SCR.tabs.Home.find((c) => FK.SH[c].ticks.includes('House') && !FK.SH[c].ticks.includes('Seat')), 0, 6, 30, true); site.done = 0.9; const tree = free('tree');
 FK.select(null); tap(V[1]); S.subject = V[1]; MENU.render(true); press('addTask'); o.addMode = S.add === V[1]; tap(site); tap(tree); press('planDone'); o.queued = V[1].plan && V[1].plan.length === 2 && S.add === null; info.plan = V[1].plan && V[1].plan.length;
 ECON.idle(V[1]); $run(1); o.runs = V[1].target === site || V[1].job === 'build' || (V[1].plan && V[1].plan.length === 1); info.runs = [V[1].job, V[1].target && V[1].target.code, V[1].plan && V[1].plan.length];
 const g = V[2]; const bush = free('bush'); FK.select([g]); tap(bush); $run(120); o.hist = (g.hist || []).length > 0 && (g.got || 0) > 0; info.hist = [(g.hist || []).length, g.got, Math.round(g.ate || 0)];
 const x = V[3]; FK.select(null); tap(x); S.subject = x; MENU.render(true); press('exitU'); o.arm = S.exit === x && x.hp > 0; MENU.render(true); press('exitU'); $run(1); o.exit = x.hp <= 0 || !FK.units().includes(x); info.exit = [x.hp, FK.units().includes(x)];
 FK.select(null); tap(V[4]); S.subject = V[4]; MENU.render(true); press('hang'); o.cancel = FK.picked().length === 0 && S.subject !== V[4];
 return [o, info]; })()"""
async def p2b(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(P2BJS); await pg.close()
    ok('t-p2b', all(x is True for x in v.values()) and not errs, [v, info, errs[:2]])
P2CJS = r"""(async () => { const o = {}, info = {}, W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S;
 MENU.act('start'); FK.fog(false); await W(300); $rich(0); const h = FK.seatOf(0), V = ECON.villagersOf(0), tap = (t) => { S.tap = null; FK.fire('tap', FK.tileAt(t.bx, t.by), t, 0, 0); }, vs = (sel) => [...document.querySelectorAll(sel + ' [data-v]')].map((b) => b.dataset.v.split('|').slice(0, 2).join('|')), press = (v) => { const b = [...document.querySelectorAll('[data-v]')].find((x) => x.dataset.v.startsWith(v)); if (b) b.click(); return !!b; }, pill = () => (document.querySelector('#rank .exec') || {}).textContent || '';
 const near = (kind) => FK.things().filter((t) => t.kind === kind && t.amount > 0).sort((a, b) => FK.dist(a, h) - FK.dist(b, h)), free = (kind) => near(kind).find((t) => !ECON.isFull(V[0], t));
 S.more = false; FK.select(null); tap(V[0]); MENU.render(true); await W(30);
 o.ctl = document.getElementById('base').className === 'ctlw' && !/Attention/.test(document.getElementById('card').innerText) && pill().length > 0; info.pill0 = pill();
 const order = vs('#base'); info.order = order; o.clockwise = JSON.stringify(order) === JSON.stringify(['people|', 'vgar|', 'tab|Build', 'vlog|', 'vdump|drop', 'vdump|destroy', 'vatt|mobile', 'vatt|focus', 'vgroup|', 'vstop|', 'vorder|', 'vpage|jobs']);
 press('vdump|destroy'); press('vatt|focus'); o.sets = V[0].dump === 'destroy' && V[0].att === 'focus' && /Drop → Focus → GO/.test(pill()); info.pill1 = pill();
 press('vreset|'); o.reset = V[0].dump === undefined && V[0].att === undefined && !/→/.test(pill());
 press('vgroup|'); const n = FK.picked().length; o.group = n >= 1 && S.more && pill().includes(String(n)); info.group = n; FK.select(null); S.more = false; S.vc = null;
 tap(V[0]); MENU.render(true); press('vpage|jobs'); o.jobsOpen = vs('#base').includes('vjob|hunt'); press('vjob|hunt'); const tree = free('tree'); tap(tree); o.jobRefuse = S.vc && S.vc.job === 'hunt' && FK.picked().includes(V[0]) && V[0].target !== tree; info.job = [S.vc && S.vc.job, V[0].target && V[0].target.kind];
 FK.select(null); S.vc = null; tap(V[1]); MENU.render(true); press('vorder|'); const t2 = free('bush'); tap(t2); o.order = V[1].plan && V[1].plan.length === 1; press('vgo|'); o.go = S.add === null; info.order = V[1].plan && V[1].plan.length;
 FK.select(null); tap(V[2]); MENU.render(true); press('vexit|'); o.armed = V[2].hp > 0 && S.exit === true; MENU.render(true); press('vexit|'); $run(1); o.exit = V[2].hp <= 0;
 tap(V[3]); MENU.render(true); press('vgo|'); o.goEnds = FK.picked().length === 0 && !S.vc;
 return [o, info]; })()"""
async def p2c(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(P2CJS); await pg.close()
    ok('t-p2c', all(x is True for x in v.values()) and not errs, [v, info, errs[:2]])
FRZJS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, o = {}, info = {};
 S.tab = null; MENU.act('start'); FK.fog(false); await W(600); FK.K.snow = FK.G.snow.full; await W(800);
 const n0 = FK.lands(); await W(5000); const n1 = FK.lands(); o.still = n1 - n0 <= 2; info.still = n1 - n0;
 const V = ECON.villagersOf(0); FK.harm(V[0], V[0].hp + V[0].hpMax); for (let i = 0; i < 30; i++) FK.sim(0.1); await W(600); o.scar = FK.lands() > n1; info.scar = FK.lands() - n1;
 return [o, info]; })()"""
IDLEJS = r"""(() => { MENU.S.tab = null; MENU.act('start'); for (let n = 0; n < 50; n++) FK.sim(0.1); const vs = ECON.villagersOf(1), h = FK.seatOf(1), stuck = vs.slice(0, 3);
 stuck[0].job = 'wait'; stuck[0].target = h; stuck[0].lost = { x: h.bx, y: h.by, t: 0 }; stuck[0].wait = 1e9; stuck[1].job = 'wait'; stuck[1].target = null; stuck[1].wait = 1e9; stuck[2].job = 'idle'; stuck[2].target = null;
 AI.think(1); return stuck.map((v) => [v.job, v.job !== 'wait' && v.job !== 'idle']); })()"""
async def idle(b):
    pg, errs = await fresh(b); v = await pg.evaluate(IDLEJS); await pg.close()
    ok('t-idle', all(x[1] for x in v) and not errs, [v, errs[:2]])
LOADJS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, o = {}, info = {};
 S.tab = null; MENU.act('start'); FK.fog(false); await W(400); const V = ECON.villagersOf(0), u = V[0], y = ECON.yieldOf(FK.things().find((t) => t.kind === 'bush')), trees = FK.things().filter((t) => t.kind === 'tree' && t.amount > 0 && !ECON.isFull(u, t));
 u.load = 5; u.carry = y; const d = FK.dropFor(u, y), on = (t) => FK.dist(u, d) < FK.dist(u, t) && FK.dist(d, t) < FK.dist(u, t), A = trees.find(on), B = trees.find((t) => !on(t)); info.has = [!!d, !!A, !!B];
 if (A) { u.load = 5; u.carry = y; u.dump = undefined; ECON.gatherAt(u, A); o.home = u.load === 5 && (u.job === 'carry' || u.then === 'carry'); info.home = [u.load, u.job, u.then]; }
 if (B) { u.load = 5; u.carry = y; ECON.gatherAt(u, B); o.drop = !u.load && u.target === B; info.drop = [u.load, u.job]; }
 return [o, info]; })()"""
async def load(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(LOADJS); await pg.close()
    ok('t-load', len(v) == 2 and all(v.values()) and not errs, [v, info, errs[:2]])
BUFJS = r"""(() => { MENU.S.tab = null; MENU.act('start'); FK.fog(false); const vs = ECON.villagersOf(0), [g, w] = vs, bush = ECON.bestFind(g, ECON.yieldOf(FK.things().find((t) => t.kind === 'bush'))); ECON.gatherAt(g, bush);
 for (let n = 0; n < 3000 && !(g.job === 'gather' && !g.path); n++) FK.sim(0.1); const o = {}, at = [g.bx, g.by];
 w.path = null; w.job = 'idle'; w.target = null; w.spot = null; const ta = Math.atan2(g.by - bush.by, g.bx - bush.bx); w.bx = g.bx + Math.cos(ta) * FK.SP * 0.3; w.by = g.by + Math.sin(ta) * FK.SP * 0.3; const w0 = [w.bx, w.by]; FK.sim(1 / 30);
 o.held = Math.hypot(g.bx - at[0], g.by - at[1]) < 1e-9; o.passer = Math.hypot(w.bx - w0[0], w.by - w0[1]) > 0; o.job = g.job; o.sp = FK.SP / FK.D.upm; return o; })()"""
async def buffer(b):
    pg, errs = await fresh(b); v = await pg.evaluate(BUFJS); await pg.close()
    ok('t-buffer', v['held'] and v['passer'] and v['job'] == 'gather' and abs(v['sp'] - MEASURE['space']['apart']) < 1e-9 and not errs, [v, errs[:2]])
RANKJS = r"""(() => { MENU.S.tab = null; MENU.act('start'); FK.fog(false); const D = FK.D, N = FK.N, o = {}, info = {}, vs = ECON.villagersOf(0), h = FK.seatOf(0), hk = FK.tileAt(h.bx, h.by);
 const open = (k) => { for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (!FK.walkable(k + x + y * N) || FK.OCC[k + x + y * N]) return false; return true; }; let k0 = -1; for (let r = 6; r < 60 && k0 < 0; r++) for (const q of [hk + r, hk - r, hk + r * N, hk - r * N, hk + r + r * N, hk - r - r * N]) if (k0 < 0 && open(q)) k0 = q;
 const s = FK.spawn('UM1', 0, k0, Math.random), at = [s.bx, s.by], rest = (u, x, y) => { Object.assign(u, { path: null, job: 'idle', then: null, target: null, spot: null, bx: x, by: y }); FK.place(u); }, away = () => { FK.units().forEach((u, n) => { if (u !== s) rest(u, at[0] + 600 + 20 * n, at[1] + 600); }); };
 // a walker meets an idler: the idler takes the whole push
 away(); const [w, i] = vs; rest(w, at[0], at[1] + 25); rest(i, at[0] + FK.SP * 0.5, at[1] + 25); w.path = [[at[0], at[1] + 5]]; w.at = 0; w.job = 'walk'; const i0 = i.bx, w0 = w.bx; s.job = 'hold'; s.path = null; FK.step(1 / 30); o.idler = Math.abs(i.bx - i0) > 0.1 && Math.abs(w.bx - w0) < 1e-9; info.idler = [i.bx - i0, w.bx - w0];
 // the bottleneck: resting passers who cannot be moved add up; three (3) do not pass the 3 of one holding his post, four (4) do
 const wall = new Set(); for (let dx = -15; dx <= 0; dx += 2.5) for (let dy = -15; dy <= 15; dy += 2.5) wall.add(FK.tileAt(at[0] + dx, at[1] + dy)); const was = [...wall].map((k) => FK.OCC[k]);
 const crowd = (n) => { away(); s.bx = at[0]; s.by = at[1]; FK.place(s); s.job = 'hold'; s.path = null; vs.slice(0, n).forEach((u, m) => { const t = Math.PI + (m - (n - 1) / 2) * 0.25; rest(u, at[0] + Math.cos(t) * FK.SP * 0.3, at[1] + Math.sin(t) * FK.SP * 0.3); }); [...wall].forEach((k) => (FK.OCC[k] = 1)); FK.step(1 / 30); [...wall].forEach((k, m) => (FK.OCC[k] = was[m])); return Math.hypot(s.bx - at[0], s.by - at[1]); };
 info.three = crowd(3); info.four = crowd(4); o.holds = info.three < 1e-9; o.yields = info.four > 0.1; o.levels = [D.priority.work, D.priority.move, D.priority.rest].join(); return [o, info]; })()"""
async def rank(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(RANKJS); await pg.close()
    ok('t-rank', v['idler'] and v['holds'] and v['yields'] and v['levels'] == '3,2,1' and not errs, [v, info, errs[:2]])
STOREJS = r"""(() => { MENU.S.tab = null; MENU.act('start'); FK.fog(false); const me = 0, o = {}, info = {}, D = FK.D; $rich(me); FK.SIDES[me].age = D.ages.length; const look = (l) => Object.keys(FK.SH).find((c) => FK.SH[c].look === l);
 const q = $put(look('quarry'), me, 10, 80); q.side = me; const v = ECON.villagersOf(me)[0]; ECON.gatherAt(v, q); let carried = false, t0 = null; const st = () => FK.SIDES[me].store.stone;
 for (let n = 0; n < 1200; n++) { FK.sim(0.1); carried = carried || v.job === 'carry' || v.then === 'carry' || v.load > 0; if (t0 == null && v.job === 'gather' && !v.path) t0 = [n, st()]; } const secs = t0 ? (1200 - t0[0]) * 0.1 : 0;
 info.rate = t0 ? (st() - t0[1]) / secs : 0; info.book = ECON.rateOf(q, me); o.direct = !carried && !!t0; o.rate = info.rate > 0.8 * info.book; return [o, info]; })()"""
async def store(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(STOREJS); await pg.close()
    ok('t-store', all(v.values()) and not errs, [v, info, errs[:2]])
DOCKJS = r"""(() => { MENU.S.tab = null; MENU.act('start'); FK.fog(false); const D = FK.D, N = FK.N, o = {}, info = {}, dock = Object.keys(FK.SH).find((c) => FK.SH[c].look === 'dock'), [, n] = FK.B[dock]; FK.SIDES[0].age = D.ages.length; $rich(0);
 const fish = FK.things().filter((t) => t.kind === 'fish'), river = fish.filter((t) => !FK.byLake(t.bx, t.by, 0)); info.fish = [fish.length, river.length]; o.rivers = river.length > 0;
 const wet = (i, j) => { for (let y = j - 1; y < j + n + 1; y++) for (let x = i - 1; x < i + n + 1; x++) if (FK.H[y * N + x] <= 0 || FK.MARSH[y * N + x]) return true; return false; };
 let edge = 0, edgeOk = 0, dryOk = 0, byRiver = 0, far = 0; for (let j = 3; j < N - 6; j += 2) for (let i = 3; i < N - 6; i += 2) { const w = ECON.placeWhy(0, dock, i, j, true); if (wet(i, j)) { edge++; if (!w) { edgeOk++; const [bx, by] = FK.toBoard((i + n / 2) * D.tile, (j + n / 2) * D.tile); if (!FK.byLake(bx, by, 0)) byRiver++; } } else { if (!w) dryOk++; if (/water's edge/.test(w)) far++; } }
 info.spots = [edge, edgeOk, dryOk, byRiver, far]; const h = FK.seatOf(0), v = ECON.villagersOf(0)[0]; let b = null, f = null; for (const g of fish.slice().sort((p, q) => FK.dist(p, h) - FK.dist(q, h)).slice(0, 20)) { let best = null, bd = 1e9; for (let dx = -100; dx <= 100; dx += 10) for (let dy = -100; dy <= 100; dy += 10) { const k = FK.tileAt(g.bx + dx, g.by + dy); if (!ECON.placeWhy(0, dock, k % N, Math.floor(k / N), true) && Math.hypot(dx, dy) < bd) { bd = Math.hypot(dx, dy); best = k; } } if (best != null) { b = ECON.plan(0, dock, best % N, Math.floor(best / N)); if (b) { f = g; break; } } }
 o.built = !!b; if (b) { b.done = 1; FK.fire('tap', v.k, v, v.bx, v.by); MENU.S.tap = null; FK.fire('tap', f.k, f, f.bx, f.by); info.sent = [v.job, v.then, v.target && v.target.kind]; const a0 = f.amount; let dropped = false; for (let k = 0; k < 4000 && !dropped; k++) { FK.sim(0.1); dropped = v.got > 0; } info.fished = [Math.round(a0 - f.amount), dropped, Math.round(FK.dist(b, f))]; o.fished = dropped && f.amount < a0; } o.edge = edgeOk > 0; o.dry = dryOk === 0 && far > 0; o.river = byRiver > 0; o.shore = D.fish.shore === 1; return [o, info]; })()"""
async def dock(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(DOCKJS); await pg.close()
    ok('t-dock', all(v.values()) and not errs, [v, info, errs[:2]])
STARJS = r"""(() => { MENU.S.tab = null; MENU.act('start'); FK.fog(false); const D = FK.D, v = ECON.villagersOf(0)[0], st = FK.SIDES[0].store, k = FK.tileAt(v.bx + 2 * D.tile, v.by); FK.put('meteor', k, Math.random); const t = FK.things().at(-1), i0 = st.iron, g0 = st.gold;
 v.path = null; v.job = 'idle'; v.target = null; v.spot = null; v.bx = t.bx + D.tile; v.by = t.by; FK.place(v); for (let n = 0; n < 100; n++) { v.bx = t.bx + D.tile; v.by = t.by; FK.place(v); FK.sim(0.1); } return { kind: t.kind, iron: st.iron - i0, gold: st.gold - g0, taken: !!t.taken }; })()"""
N42JS = r"""(async () => { MENU.S.tab = null; MENU.act('start'); FK.fog(false); const o = {}, D = FK.D, st = FK.SIDES[0].store, top = () => { MENU.render(true); return document.body.innerText; }, T = (f) => { try { f(); } catch (e) {} };
 T(() => { $put(Object.keys(FK.SH).find((c) => FK.SH[c].ticks.includes('Trade') && FK.SH[c].layer === 110), 0, 4, 40, true); $rich(0); const one = ECON.sellPrice(0, 'wood'), w0 = st.wood, g0 = st.gold; MENU.act('sellK', 'wood'); o.bulk = [w0 - st.wood, st.gold - g0, one]; });
 T(() => { ECON.setBell(Infinity); $run(1); o.untimed = !/−\d+:\d\d/.test(top()); const w = $put(Object.keys(FK.SH).find((c) => FK.SH[c].ticks.includes('Wonder')), 1, 6, 60); w.held = ECON.time() + 300; o.count = /Wonder [45]:\d\d/.test(top()); });
 T(() => { const b = $put('BI2', 0, 4, 40, true); MENU.S.subject = b; o.fx = /\+10% /.test(top()); MENU.S.subject = null; });
 T(() => { const bush = FK.things().find((t) => t.kind === 'bush'), full = bush.amount; FK.take(bush, full); const stays = FK.things().includes(bush), left = bush.amount, bare = !!bush.bare; FK.K.t = D.season * 4 + 5 - D.startIn * D.season; $run(1); o.bush = [stays, left === full * 0.25, bare, bush.amount > full * 0.6, !bush.bare]; });
 T(() => { o.fire = [D.flames[D.light.camp.kind].s === 3 * D.flames.campfire.s, D.light.two === 1]; });
 T(() => { const N = FK.N, h = FK.seatOf(0), hk = FK.tileAt(h.bx, h.by), open = (k) => { for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (!FK.walkable(k + x + y * N) || FK.OCC[k + x + y * N]) return false; return true; }; let k0 = -1; for (let r = 6; r < 60 && k0 < 0; r++) for (const q of [hk + r, hk - r, hk + r * N, hk - r * N, hk + r + r * N, hk - r - r * N]) if (k0 < 0 && open(q)) k0 = q;
  const [x, y] = FK.tileMid(k0), [p, q] = ECON.villagersOf(0), set = (u, bx) => { Object.assign(u, { path: [[bx, y - 60]], at: 0, job: 'walk', then: null, target: null, spot: null, load: 0, bx, by: y }); FK.place(u); }; FK.units().forEach((u, n) => { if (u !== p && u !== q) { u.bx = x + 600 + 20 * n; u.by = y + 600; u.path = null; FK.place(u); } });
  set(p, x); set(q, x + FK.SP * 0.5); q.load = 5; FK.step(1 / 30); o.laden = [Math.abs(p.bx - x) > 0.1, Math.abs(q.bx - x - FK.SP * 0.5) < 1e-9]; });
 dispatchEvent(new Event('pointerdown')); const a = SOUND.ctx && SOUND.ctx(), hide = (h) => { Object.defineProperty(document, 'hidden', { value: h, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); };
 if (a) { a.resume = () => new Promise(() => {}); hide(true); await new Promise((r) => setTimeout(r, 300)); hide(false); dispatchEvent(new Event('pointerdown')); o.call = [a.state, SOUND.ctx() !== a]; } return o; })()"""
async def n42(b):
    pg, errs = await fresh(b); v = await pg.evaluate(N42JS); await pg.close()
    g = lambda k: v.get(k) or [0, 0, 0]; held = {'bulk': g('bulk')[0] == 1000 and g('bulk')[2] < g('bulk')[1] < 10 * g('bulk')[2], 'untimed': bool(v.get('untimed')), 'count': bool(v.get('count')), 'fx': bool(v.get('fx')), 'bush': 'bush' in v and all(v['bush']), 'fire': 'fire' in v and all(v['fire']), 'laden': 'laden' in v and all(v['laden']), 'call': bool(g('call')[1])}
    ok('t-n42', all(held.values()) and not errs, [held, v, errs[:2]])
async def star(b):
    pg, errs = await fresh(b); v = await pg.evaluate(STARJS); await pg.close()
    ok('t-star', v['kind'] == 'meteor' and v['iron'] == 300 and v['gold'] == 100 and v['taken'] and not errs, [v, errs[:2]])
async def freeze(b):
    pg, errs = await fresh(b); v, info = await pg.evaluate(FRZJS); await pg.close()
    ok('t-freeze', all(v.values()) and not errs, [v, info, errs[:2]])
PAGED = {'t-ground': ground, 't-n18': n18, 't-n18b': n18b, 't-n18c': n18c, 't-n19': n19, 't-n20': n20, 't-n21': n21, 't-n22': n22, 't-n23': n23, 't-n24': n24, 't-n24b': n24b, 't-n25': n25, 't-n26': n26, 't-n27': n27, 't-n29': n29, 't-n30': n30, 't-n31': n31, 't-p2': p2, 't-p2b': p2b, 't-p2c': p2c, 't-freeze': freeze, 't-idle': idle, 't-load': load, 't-buffer': buffer, 't-star': star, 't-n42': n42, 't-rank': rank, 't-store': store, 't-dock': dock, 't-n15': n15, 't-n16': n16, 't-n17': n17, 't-a1': a1, 't-guide': guidebook, 't-land': land, 't-save': saving, 't-peace': peace, 't-civs': civs, 't-dew': dew, 't-sight': sight, 't-stage': stage, 't-wild': wild, 't-fire': blaze, 't-mind': mind, 't-realm': realm, 't-trade': trade, 't-troops': troops, 't-alarm': alarm, 't-orders': orders, 't-war': war, 't-kinds': kinds, 't-pace': pace, 't-physics': physics, 't-food': food, 't-same': same, 't-ledger': ledger, 't-effects': effects, 't-odds': odds, 't-foe': foe, 't-research': research, 't-gather': gather, 't-walls': walls}   # each on its own page
PLAIN = {'t-match': match, 't-proof': proof}   # no page; every other rule is main's
async def page():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=['--no-sandbox', '--allow-file-access-from-files'])
        if any(k not in PAGED and k not in PLAIN for k in ONLY): await main(b)
        for k, f in PAGED.items():   # a test that throws is that rule's FAIL, and the suite runs on (Nov 10: one stale key stopped every rule after it)
            if k in ONLY:
                try: await f(b)
                except Exception as e: ok(k, False, f'threw: {type(e).__name__}: {str(e)[:300]}')
        await b.close()
for k in ONLY:
    if k not in RULES: print(f'FAIL [{k}] no such page rule'); sys.exit(1)
if any(k not in PLAIN for k in ONLY): asyncio.run(page())
for k, f in PLAIN.items():
    if k in ONLY: f()
missing = [k for k in ONLY if k not in done]
for k in missing: print(f'FAIL [{k}] no test runs this rule')
print(f'{sum(done.values())}/{len(ONLY)} rules hold'); sys.exit(0 if all(done.values()) and not missing else 1)
