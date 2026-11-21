# The check: run before every preview. It prints one line per rule and PASS or FAIL at the end.
#   python3 tools/check.py              books, then the game
#   python3 tools/check.py --same-play  also fail if the match plays differently from the kept one (for builds that must not change play)
#   python3 tools/check.py --accept     keep this build's match as the new one to compare against (for builds meant to change play)
#   python3 tools/check.py --deep       also replay three longer matches (other peoples, scenarios, every hazard); slow, for builds that touch much
import math, asyncio, json, pathlib, re, sys
import run

ROOT = pathlib.Path(__file__).resolve().parent.parent
KEPT = ROOT / 'tools' / 'kept.json'
CODE = ['index.html', 'menu.js', 'econ.js', 'combat.js', 'ai.js', 'sound.js']
SEED, MINUTES = 7, 5          # the match every build replays
DEEP = [  # (seed, labels tapped on the new-game screen, game minutes)
    (11, [], 20),
    (12, ['Easy', 'Han', '30 min', 'Siege'], 20),
    (13, ['Hard', 'Persian', 'Conquest', 'Silk Road', 'Hardest', 'Famine', 'Weather', 'Drought', 'Outlaws', 'Plague'], 25),
]
NO_UNIT = 2259
PICTURES_MB = 192             # chosen: half of iPhone Safari's 384 MB ceiling for pictures held in memory

fails = []
def rule(name, ok, detail=''):
    print(('ok    ' if ok else 'FAIL  ') + name + (': ' + detail if detail else ''))
    if not ok: fails.append(name)

def books():
    out = {}
    for f in sorted((ROOT / 'books').glob('*.js')):
        m = re.search(r'BOOK\("(\w+)",\s*(\{.*\})\);?\s*$', f.read_text(encoding='utf-8'), re.S)
        out[m.group(1)] = json.loads(m.group(2))
    return out

def check_books():
    B = books(); N, Q, E = B['citations'], B['laws'], B['comments']
    code = '\n'.join((ROOT / f).read_text(encoding='utf-8') for f in CODE)
    # one home: a code is in one book only
    seen = {}; twice = []
    for name, b in B.items():
        for c in b: twice += [c] if c in seen else []; seen[c] = name
    rule('one home: every code is in one book', not twice, ', '.join(twice[:8]))
    # index → citation: every citation an entry names is in the Citations book
    lost = sorted({f'{c}→{n}' for b in B.values() for c, e in b.items() for n in e.get('cite', []) if n not in N})
    rule('every citation named is in the Citations book', not lost, f'{len(lost)} missing, e.g. ' + ', '.join(lost[:6]) if lost else '')
    # index → law: every law an entry names is in the Laws book
    lost = sorted({f'{c}→{q}' for b in B.values() for c, e in b.items() for q in e.get('law', []) if q not in Q})
    rule('every law named is in the Laws book', not lost, f'{len(lost)} missing, e.g. ' + ', '.join(lost[:6]) if lost else '')
    # code ↔ comments, both ways
    used = set(re.findall(r'// (E\d+)\b', code)) | set(re.findall(r'\((E\d+)\)', code))
    lost = sorted(used - set(E), key=lambda c: int(c[1:]))
    rule('every comment code in the code is in the Comments book', not lost, f'{len(lost)} missing, e.g. ' + ', '.join(lost[:8]) if lost else f'{len(used)} codes')
    spare = sorted(set(E) - used, key=lambda c: int(c[1:]))
    print(f'note  {len(spare)} comments in the book are not used by the code' + (', e.g. ' + ', '.join(spare[:8]) if spare else ''))
    cited = {n for b in B.values() for e in b.values() for n in e.get('cite', [])}
    print(f'note  {len(set(N) - cited)} of {len(N)} citations are named by no entry')
    # units
    unset = sum(1 for e in B['measure'].values() for u in (e['unit'].values() if isinstance(e.get('unit'), dict) else [e.get('unit')]) if u == 'unset')
    rule('units: none unset', unset == 0, f'{unset} unset')
    def leaves(v): return 0 if isinstance(v, bool) else 1 if isinstance(v, (int, float)) else sum(leaves(x) for x in (v.values() if isinstance(v, dict) else v)) if isinstance(v, (dict, list)) else 0
    bare = 0
    for e in B['measure'].values():
        v, u = e['value'], e.get('unit'); n = leaves(v)
        bare += 0 if isinstance(u, str) or (isinstance(v, list) and u) else n - sum(leaves(x) for k, x in v.items() if k in u) if isinstance(v, dict) and isinstance(u, dict) else n
    rule(f'units: no more than {NO_UNIT} numbers inside tables with no unit said (open work; may only go down)', bare <= NO_UNIT, f'{bare}')

async def play(after_another=False):
    async with run.game(SEED) as pg:
        if after_another: await pg.evaluate(f"fk.reset(99); for (let n = 0; n < 400; n++) sim(1 / D.step.hz); fk.reset({SEED}); fk.pause(true);")
        food0 = await pg.evaluate('SIDES[0].store.food + SIDES[0].store.wood')
        if not after_another:
            lack = await pg.evaluate("[...Object.keys(D.cost).filter((c) => fk.SH[c] && fk.SH[c].layer === 110 && !(fk.stat(c, 0, 'build') > 0 && fk.stat(c, 0, 'hp') > 0)), ...Object.keys(D.stats).filter((c) => !(D.stats[c].hp > 0))]")
            rule('every building that can be built has a build time and health, every unit has health', not lack, ', '.join(lack[:10]))
        await run.step(pg, MINUTES * 60)
        return await run.fingerprint(pg), await pg.evaluate('SIDES[0].store.food + SIDES[0].store.wood') - food0, await pg.evaluate('units.length'), list(pg.errors)

async def deep():
    out = []
    for seed, setup, minutes in DEEP:
        async with run.game(seed, setup=setup) as pg:
            await run.step(pg, minutes * 60); out.append(await run.fingerprint(pg))
            rule(f'deep match, seed {seed}, {minutes} minutes, no errors', not pg.errors, '; '.join(pg.errors[:2]))
    return out

MINE = "things.filter((t) => t.side === 0).length"
async def draw():
    async with run.game(SEED) as pg:
        await run.release(pg); await pg.wait_for_timeout(1000)
        before = await pg.evaluate(MINE); steps = []
        for v in ('mtab', 'pick', 'build'):
            done = await pg.evaluate("(v) => { const all = [...document.querySelectorAll('[data-v]')].filter((b) => b.offsetParent !== null && !b.disabled && b.dataset.v.split('|')[0] === v); const b = v === 'mtab' ? all.find((b) => b.dataset.v.includes('Build')) : all[0]; if (b) b.click(); return !!b; }", v)
            steps.append(done); await pg.wait_for_timeout(400)
        placed = await pg.evaluate(MINE) - before
        await pg.wait_for_timeout(18000)
        return await run.pictures(pg), list(pg.errors), placed, steps

async def orders():
    """Two groups, two orders: the foot to one spot, then the archers to another. Each must end at its own spot, and soldiers never picked must not move."""
    WHERE = "(() => { const at = (f) => { const U = units.filter((u) => u.side === 0 && f(fk.SH[u.code].class)); return [U.reduce((a, u) => a + u.bx, 0) / U.length, U.reduce((a, u) => a + u.by, 0) / U.length]; }; return { foot: at((c) => c === 'Foot'), archers: at((c) => c === 'Archers'), rest: at((c) => c === 'Riders' || c === 'Engines'), tile: fk.D.tile }; })()"
    SEND = "([who, x, y]) => { const tap = (v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); tap('mwho|' + who + '|'); const spot = fk.tileMid(fk.hitAt(x, y)[0]); fk.tap(x, y); tap('mord|move|'); return spot; }"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40); await pg.evaluate("document.querySelector('[data-v=\"war||\"]').click()"); was = await pg.evaluate(WHERE)
        a = await pg.evaluate(SEND, ['Foot', 70, 250]); await run.step(pg, 30); b = await pg.evaluate(SEND, ['Archers', 320, 250]); await run.step(pg, 40); now = await pg.evaluate(WHERE)
        far = lambda p, q: math.hypot(p[0] - q[0], p[1] - q[1]) / now['tile']
        return far(now['foot'], a), far(now['archers'], b), far(now['rest'], was['rest']), far(a, b)

async def stands():
    """The picked foot make a wall and keep it; soldiers not picked do not; a new order drops it."""
    WALL = "(() => { const n = (c) => units.filter((u) => u.side === 0 && fk.SH[u.code].class === c && u.wall).length; return [n('Foot'), n('Archers')]; })()"
    TAP = "(v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click()"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40)
        for v in ('war||', 'mwho|Foot|', 'stand||'): await pg.evaluate(TAP, v)
        await run.step(pg, 120); held = await pg.evaluate(WALL)
        await pg.evaluate("fk.tap(70, 250)"); await pg.evaluate(TAP, 'mord|move|'); await run.step(pg, 5)
        return held, await pg.evaluate(WALL)

async def chase():
    """Archers told to attack the farthest enemy soldier, who is walking away and out of sight: they must keep going to where he was last seen, not stop."""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40)
        far = await pg.evaluate("(() => { const A = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Archers'), [a] = A, E = units.filter((u) => u.side !== 0 && fk.SIDES[u.side] && fk.SH[u.code].class).sort((p, q) => Math.hypot(q.bx - a.bx, q.by - a.by) - Math.hypot(p.bx - a.bx, p.by - a.by)), [e] = E; window.WHO = A; window.FROM = [a.bx, a.by]; WAR.order(A, e, e.k); return Math.hypot(e.bx - a.bx, e.by - a.by) / fk.D.tile; })()")
        await run.step(pg, 60)
        idle, gone = await pg.evaluate("[WHO.filter((u) => u.job === 'idle').length, Math.hypot(WHO[0].bx - FROM[0], WHO[0].by - FROM[1]) / fk.D.tile]")
        return far, idle, gone

async def tower(n):
    """The first n foot are ordered at an enemy tower raised 30 tiles from home; three minutes on, what is left of the tower and of them."""
    SET = "(n) => { const h = fk.seatOf(0), k0 = fk.tileAt(h.bx, h.by - 300), N = fk.N; let t = null; for (let d = 0; d < 40 && !t; d++) for (let dx = -d; dx <= d && !t; dx++) for (const dy of [-d, d]) { t = fk.build('BW3', k0 % N + dx, Math.floor(k0 / N) + dy, fk.SIDES[2].col); if (t) break; } t.done = 1; t.hp = t.hpMax = WAR.hpMax(t); window.ITS = t; window.ITSAT = [t.bx, t.by]; window.MEN = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot').slice(0, n); WAR.order(MEN, t, fk.tileAt(t.bx, t.by)); }"
    LOOK = "(() => { const A = MEN.filter((u) => units.includes(u)); return { tower: things.includes(ITS) && ITS.hp > 0 ? Math.round(ITS.hp) : 0, alive: A.length, onIt: A.filter((u) => u.target === ITS).length, near: A.filter((u) => Math.hypot(u.bx - ITSAT[0], u.by - ITSAT[1]) < 15 * fk.D.tile).length, broke: A.filter((u) => u.broke).length }; })()"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40); await pg.evaluate(SET, n); await run.step(pg, 180)
        return await pg.evaluate(LOOK)

async def defends():
    """The army stands 60 tiles from home; ten raiders fall on the town centre; the foot are picked and told Defend through the war menu."""
    RAID = "(() => { const h = fk.seatOf(0), code = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot').code, k0 = fk.tileAt(h.bx, h.by - 60), N = fk.N; window.RAIDERS = []; for (let d = 0; d < 10 && RAIDERS.length < 10; d++) for (let dx = -d; dx <= d && RAIDERS.length < 10; dx++) { const k = k0 + dx - d * N; if (fk.walkable(k) && !units.some((u) => u.k === k)) { const e = fk.spawn(code, 2, k, fk.rng); if (e) RAIDERS.push(e); } } for (const e of RAIDERS) WAR.fight(e, h, true); })()"
    LOOK = "(() => { const on = (c) => units.filter((u) => u.side === 0 && fk.SH[u.code].class === c && RAIDERS.includes(u.target)).length; return [on('Foot'), on('Archers')]; })()"
    TAP = "(v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click()"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40); await pg.evaluate("(() => { const h = fk.seatOf(0); WAR.order(units.filter((u) => u.side === 0 && fk.SH[u.code].class), null, fk.tileAt(h.bx, h.by - 600)); })()"); await run.step(pg, 80)
        await pg.evaluate(RAID); await run.step(pg, 3)
        for v in ('war||', 'mwho|Foot|', 'mord|defend|'): await pg.evaluate(TAP, v)
        await run.step(pg, 5)
        return await pg.evaluate(LOOK)

async def troops():
    """The Troops controller: a class trimmed with minus keeps its count when another class is added, All brings everyone back, and with the army out of view the On Screen box alone picks nobody."""
    TAP = "(v) => { [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); return fk.picked().length; }"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40); got = []
        for v in ('war||', 'mwho|Riders|', 'mview|troops|', 'mtyp|UM10|-1', 'mwho|Foot|', 'mwho||'): got.append(await pg.evaluate(TAP, v))
        await pg.evaluate("(() => { fk.cam.x += 3 * fk.size()[0] / fk.cam.z; MENU.render(true); })()")
        got.append(await pg.evaluate(TAP, 'mscr|1|')); got.append(await pg.evaluate(TAP, 'mscr|1|'))
        return got

async def check_game():
    a, gathered, people, errs = await play()
    rule('the game loads and a match starts', people > 0, f'{people} people and animals on the board')
    rule(f'{MINUTES} minutes of play, no errors', not errs, '; '.join(errs[:2]))
    rule('villagers gather', gathered > 0, f'food and wood up {gathered:.0f}')
    b, *_ = await play(after_another=True)
    rule('the same seed plays the same match, even straight after another game', a == b, a if a == b else f'{a} then {b}')
    pics, errs, placed, steps = await draw()
    rule('a building can be picked and placed from the Build menu', placed == 1, f'{placed} placed, taps landed: {steps}')
    rule('20 seconds on screen, no errors', not errs, '; '.join(errs[:2]))
    rule(f'pictures in memory under {PICTURES_MB} MB', pics['mb'] <= PICTURES_MB, f"{pics['count']} pictures, {pics['mb']} MB")
    fa, ab, moved, apart = await orders()
    rule('two groups keep their own orders: each ends at its own spot, soldiers never picked stay put', max(fa, ab) < apart / 2 and moved < 1, f'foot {fa:.1f} tiles from its spot, archers {ab:.1f} from theirs, the spots {apart:.1f} apart; the rest moved {moved:.1f}')
    held, after = await stands()
    rule('a wall stands until the next order: the picked foot hold it two minutes on, the archers never picked do not, a move drops it', held[0] > 0 and held[1] == 0 and after[0] == 0, f'{held[0]} foot in the wall after two minutes, {held[1]} archers; {after[0]} after a move')
    far, idle, gone = await chase()
    rule('soldiers told to attack a foe who walks out of sight keep going to where he was last seen', idle == 0 and gone > 20, f'the foe {far:.0f} tiles off; a minute on, {idle} archers idle, the first {gone:.0f} tiles from where he started')
    won, lost = await tower(10), await tower(6)
    rule('a band winning against the building it was sent at stays and brings it down', won['tower'] == 0 and won['alive'] > 0, f"ten foot at a tower: the tower at {won['tower']}, {won['alive']} alive")
    rule('a band that breaks does not walk back into the building one at a time', lost['tower'] > 0 and lost['broke'] > 0 and lost['onIt'] == 0 and lost['near'] == 0, f"six foot at a tower: the tower at {lost['tower']}, {lost['alive']} alive, {lost['broke']} of them broken, {lost['onIt']} back on it, {lost['near']} within 15 tiles")
    foot, bow = await defends()
    rule('Defend sends the picked soldiers at whoever is attacking the town, and nobody else', foot > 0 and bow == 0, f'{foot} foot on the raiders five seconds on, {bow} archers')
    tr = await troops()
    rule('troop words: a class trimmed with minus keeps its count when another is added, All brings everyone back, On Screen alone picks nobody when the army is out of view', tr == [24, 4, 4, 3, 13, 24, 0, 24], f'picked after each tap (War, Cav, Troops, minus, Foot, All, Off Screen off, on): {tr}')
    kept = json.loads(KEPT.read_text()) if KEPT.exists() else {}
    d = await deep() if '--deep' in sys.argv else None
    if '--accept' in sys.argv or not kept:
        KEPT.write_text(json.dumps({'seed': SEED, 'minutes': MINUTES, 'match': a, 'deep': d or kept.get('deep')}) + '\n'); print(f'note  match {a} kept' + (f', deep {d}' if d else ''))
        return
    same = a == kept['match'] and (d is None or d == kept.get('deep'))
    detail = f"{a} against kept {kept['match']}" + (f"; deep {d} against {kept.get('deep')}" if d else '')
    if '--same-play' in sys.argv: rule('plays exactly as the kept match' + ('es' if d else ''), same, detail)
    else: print('note  ' + ('plays exactly as kept' if same else 'plays differently from kept: ' + detail))

check_books()
asyncio.run(check_game())
print('\nPASS' if not fails else f'\nFAIL: {len(fails)} rule(s)')
sys.exit(1 if fails else 0)
