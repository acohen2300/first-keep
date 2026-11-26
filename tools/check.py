# The check: run before every preview. It prints one line per rule and PASS or FAIL at the end.
#   python3 tools/check.py              books, then the game
#   python3 tools/check.py --same-play  also fail if the match plays differently from the kept one (for builds that must not change play)
#   python3 tools/check.py --accept     keep this build's match as the new one to compare against (for builds meant to change play)
#   python3 tools/check.py --deep       also replay three longer matches (other peoples, scenarios, every hazard); slow, for builds that touch much
# Every build first writes tools/build.txt: the commit it starts from on the first line, then each file it may change, one a line. Any other file changed fails.
import math, asyncio, json, pathlib, re, sys
import run
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parent.parent
KEPT = ROOT / 'tools' / 'kept.json'
CODE = ['index.html', 'menu.js', 'econ.js', 'combat.js', 'ai.js', 'sound.js']
SEED, MINUTES = 7, 5          # the match every build replays
DEEP = [  # (seed, labels tapped on the new-game screen, game minutes)
    (11, [], 20),
    (12, ['Easy', 'Han', '30 min', 'Siege'], 20),
    (13, ['Hard', 'Persian', 'Conquest', 'Silk Road', 'Hardest', 'Famine', 'Weather', 'Drought', 'Outlaws', 'Plague'], 25),
]
NO_UNIT = 0
# Ceilings that may only go down (Albert, Nov 23: the rules become gates, so drift fails the check on its own)
TYPED = {'index.html': 4563, 'menu.js': 24, 'econ.js': 9, 'combat.js': 10, 'ai.js': 3, 'sound.js': 16}  # numbers other than 0 and 1 typed in the code (rule 1; most of index.html's are the art)
KINDS = {'science': 'Sourced', 'paper': 'Sourced', 'history': 'Sourced', 'source': 'Sourced', 'web': 'Sourced', 'note': 'Derived', 'design': 'Chosen', 'chosen': 'Chosen', 'art': 'Chosen', 'game': 'Chosen'}   # a source's kind, and what a number it backs is
SPARE_COMMENTS, LOOSE_CITATIONS = 0, 0   # comments the code never uses; sources (not his rulings) no entry names
BUILD = ROOT / 'tools' / 'build.txt'       # the build's own list: the commit it starts from, then every file it may change (rule 11)
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

def typed(src):
    """The numbers typed in JavaScript other than 0 and 1, outside strings and comments (the parts of a template string inside ${} are code and count)."""
    out, i, n, stack = [], 0, len(src), []   # stack: '`' inside a template's text, '{' inside code (a ${} or a brace opened within it)
    while i < n:
        c = src[i]
        if stack and stack[-1] == '`':
            if c == '\\': i += 2; continue
            if c == '`': stack.pop(); i += 1; continue
            if src.startswith('${', i): stack.append('{'); i += 2; continue
            i += 1; continue
        if src.startswith('//', i): i = src.find('\n', i); i = n if i < 0 else i; continue
        if src.startswith('/*', i): i = src.find('*/', i + 2); i = n if i < 0 else i + 2; continue
        if c in '\'"':
            i += 1
            while i < n and src[i] != c and src[i] != '\n': i += 2 if src[i] == '\\' else 1
            i += 1; continue
        if c == '`': stack.append('`'); i += 1; continue
        if c == '{' and stack: stack.append('{')
        if c == '}' and stack and stack[-1] == '{': stack.pop()
        m = re.match(r'(\d+\.?\d*(?:e[+-]?\d+)?|\.\d+)', src[i:i + 40]) if (c.isdigit() or (c == '.' and src[i + 1:i + 2].isdigit())) and not (src[i - 1:i].isalnum() or src[i - 1:i] in '_$') else None
        if m:
            if m.group(1) not in ('0', '1', '0.', '1.'): out.append(m.group(1))
            i += len(m.group(1)); continue
        i += 1
    return out

def scripts(f):
    t = (ROOT / f).read_text(encoding='utf-8')
    return '\n'.join(re.findall(r'<script[^>]*>(.*?)</script>', t, re.S)) if f.endswith('.html') else t

def check_rules():
    # rule 1: typed numbers, by file, may only go down
    over = []
    for f in CODE:
        k = len(typed(scripts(f)))
        if k > TYPED[f]: over.append(f'{f} {k} > {TYPED[f]}')
        elif k < TYPED[f]: print(f'note  {f}: {k} typed numbers, under its ceiling of {TYPED[f]}: lower TYPED to {k}')
    rule('rule 1: no new typed numbers in the code (ceilings may only go down)', not over, ', '.join(over) if over else ', '.join(f'{f} {TYPED[f]}' for f in CODE))
    # a comment code ends its line: anything after // E123 on the same line is commented out (Nov 23: a code put mid-line silently cut the rest of hit())
    cut = [f'{f}:{n}' for f in CODE for n, l in enumerate((ROOT / f).read_text(encoding='utf-8').split('\n'), 1) for m in re.finditer(r'// (E\d+)', l) if not re.fullmatch(r'(\s+E\d+)*\s*', l[m.end():])]
    rule('every // E code ends its line, so no code hides behind a comment', not cut, ', '.join(cut[:6]))
    # rule 11: every file changed since the build began is named in the build's list; the rest are proven untouched by diff
    import subprocess
    if not BUILD.exists(): rule('rule 11: the build names the files it may change (tools/build.txt)', False, 'no tools/build.txt'); return
    lines = [l.strip() for l in BUILD.read_text(encoding='utf-8').splitlines() if l.strip() and not l.startswith('#')]
    since, named = lines[0], set(lines[1:]) | {'tools/build.txt'}
    git = lambda *a: subprocess.run(['git', *a], cwd=ROOT, capture_output=True, text=True)
    r = git('diff', '--name-only', since)
    if r.returncode: rule('rule 11: the build names the files it may change (tools/build.txt)', False, f'cannot diff from {since}: {r.stderr.strip()[:120]}'); return
    new = git('ls-files', '--others', '--exclude-standard').stdout.split()
    changed = set(r.stdout.split()) | set(new)
    stray = sorted(changed - named)
    rule(f'rule 11: only the files the build names changed since {since}; every other file is untouched by diff', not stray, ', '.join(stray[:8]) if stray else f'{len(changed)} changed, all named')

def check_books():
    B = books(); N, Q, E = B['citations'], B['laws'], B['comments']
    # the picture stays sharp and the rate steady (Albert, Nov 25, after Build 41 beside v111): the draw budget may shed shadows and motion, never pixels, and holds one frame rate
    dr = next(e['value'] for e in B['measure'].values() if e.get('key') == 'draw')
    rule('the picture never drops below full resolution, and the game holds one frame rate', all(r == 1 for r in dr['res']) and dr['lv']['fps'] == 0, f"res {dr['res']}, the rate from level {dr['lv']['fps']}: {dr['fps']} a second")
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
    used = {c for n in re.findall(r'//[^\n]*|/\*.*?\*/', code, re.S) for c in re.findall(r'\b(E\d+)\b', n)} | set(re.findall(r'\((E\d+)\)', code))  # every code in a // or /* */ comment, a second code on a line included
    lost = sorted(used - set(E), key=lambda c: int(c[1:]))
    rule('every comment code in the code is in the Comments book', not lost, f'{len(lost)} missing, e.g. ' + ', '.join(lost[:8]) if lost else f'{len(used)} codes')
    spare = sorted(set(E) - used, key=lambda c: int(c[1:]))
    rule(f'comments the code never uses: no more than {SPARE_COMMENTS} (may only go down)', len(spare) <= SPARE_COMMENTS, f'{len(spare)}' + (', e.g. ' + ', '.join(spare[:8]) if spare else ''))
    cited = {n for b in B.values() for e in b.values() for n in e.get('cite', [])} | {n for e in E.values() for n in re.findall(r'\bN\d+\b', e['text'])}   # an entry's cite, or a comment that names its source in its words
    odd = sorted((c for c, e in N.items() if e.get('kind') not in KINDS), key=lambda c: int(c[1:]))
    rule('every source says its kind: ' + ', '.join(f'{k} ({v})' for k, v in KINDS.items()), not odd, f'{len(odd)} without, e.g. ' + ', '.join(odd[:8]) if odd else f'{len(N)} sources')
    record = {c for c, e in N.items() if e.get('kind') == 'design'}   # Albert's rulings: the record, kept whether or not an entry names them
    loose = sorted(set(N) - cited - record, key=lambda c: int(c[1:]))
    rule(f'sources no entry names (his rulings aside): no more than {LOOSE_CITATIONS} (may only go down)', len(loose) <= LOOSE_CITATIONS, f'{len(loose)}' + (', e.g. ' + ', '.join(loose[:8]) if loose else ''))
    # every entry Sourced (a source outside the game says it), Derived (a law works it out, or it was measured on the game), or Chosen (his call, or a design or another game's); counted, not stored, so it can't drift from the cites
    how = lambda e: 'Sourced' if any(KINDS.get(N.get(n, {}).get('kind')) == 'Sourced' for n in e.get('cite', [])) else 'Derived' if e.get('law') or any(N.get(n, {}).get('kind') == 'note' for n in e.get('cite', [])) else 'Chosen'
    tally = Counter(how(e) for b in B.values() for e in b.values() if 'value' in e)
    why = [c for b in B.values() for c, e in b.items() if 'value' in e and how(e) == 'Chosen' and not any(KINDS.get(N.get(n, {}).get('kind')) == 'Chosen' for n in e.get('cite', [])) and 'tuning' not in e.get('name', '').lower()]
    rule('every entry is Sourced, Derived or Chosen, and a Chosen one says why (his call, a design, another game, or tuning)', not why, f'{len(why)} without, e.g. ' + ', '.join(why[:8]) if why else ', '.join(f'{k} {tally[k]}' for k in ('Sourced', 'Derived', 'Chosen')))
    # units
    unset = sum(1 for e in B['measure'].values() for u in (e['unit'].values() if isinstance(e.get('unit'), dict) else [e.get('unit')]) if u == 'unset')
    rule('units: none unset', unset == 0, f'{unset} unset')
    def leaves(v): return 0 if isinstance(v, bool) else 1 if isinstance(v, (int, float)) else sum(leaves(x) for x in (v.values() if isinstance(v, dict) else v)) if isinstance(v, (dict, list)) else 0
    bare = 0
    for e in B['measure'].values():
        v, u = e['value'], e.get('unit'); n = leaves(v)
        bare += 0 if isinstance(u, str) or (isinstance(v, list) and u) or (isinstance(u, dict) and '*' in u) else n - sum(leaves(x) for k, x in v.items() if k in u) if isinstance(v, dict) and isinstance(u, dict) else n  # '*': every key of the table has the same fields, said once
    rule(f'units: every number in the Measurements book says its unit ({NO_UNIT} allowed without)', bare <= NO_UNIT, f'{bare}')
    # the Units book: one word per unit; 'A per B' is a word over the 'one' of another ('per B' alone is a rate)
    words, ones = {e['word'] for e in B['units'].values()}, {e['one'] for e in B['units'].values() if 'one' in e}
    def known(u):
        if u in words: return True
        head, *tail = ('' if u.startswith('per ') else u.split(' per ')[0]), *(u[4:] if u.startswith('per ') else u.partition(' per ')[2]).split(' per ')
        return (head == '' or head in words) and tail != [''] and all(t in ones for t in tail)
    said = set()
    def walk(u): said.add(u) if isinstance(u, str) else [walk(x) for x in (u.values() if isinstance(u, dict) else u or [])]
    for e in B['measure'].values(): walk(e.get('unit'))
    odd = sorted(u for u in said if not known(u))
    rule('units: every unit said is in the Units book', not odd, ', '.join(odd[:8]) if odd else f'{len(said)} said, {len(words)} words')
    twice = sorted(w for w in words if sum(1 for e in B['units'].values() if e['word'] == w) > 1)
    spare = sorted(w for w in words if not any(u == w or u.startswith(w + ' per ') for u in said) and not any(e['word'] == w and e.get('one') and any(u.endswith('per ' + e['one']) or (' per ' + e['one'] + ' per ') in u for u in said) for e in B['units'].values()))
    rule('units: no word twice, none unused', not twice and not spare, ', '.join(twice + spare))

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
    """Two groups, two orders: the foot to one spot, then the archers to another. Each must end at its own spot, and every soldier never picked must be back where he stood (he may give way while a group passes)."""
    WHERE = "(() => { const at = (f) => { const U = units.filter((u) => u.side === 0 && f(fk.SH[u.code].class)); return [U.reduce((a, u) => a + u.bx, 0) / U.length, U.reduce((a, u) => a + u.by, 0) / U.length]; }; return { foot: at((c) => c === 'Foot'), archers: at((c) => c === 'Archers'), rest: units.filter((u) => u.side === 0 && ['Riders', 'Engines'].includes(fk.SH[u.code].class)).map((u) => [u.bx, u.by, !!u.path]), tile: fk.D.tile }; })()"
    SEND = "([who, x, y]) => { const tap = (v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); tap('mwho|' + who + '|'); const spot = fk.tileMid(fk.hitAt(x, y)[0]); fk.tap(x, y); return spot; }"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate("[1, 2, 3].forEach((s) => WAR.treaty(0, s, 'peace'))")  # the computers' early waves (dealt per match) would otherwise fight the soldiers never picked
        await run.step(pg, 40)
        for _ in range(12):  # the test army is still walking to its first places (a siege engine takes over a minute): measure from when all stand
            if not any(r[2] for r in (await pg.evaluate(WHERE))['rest']): break
            await run.step(pg, 10)
        await pg.evaluate("document.querySelector('[data-v=\"war||\"]').click()"); was = await pg.evaluate(WHERE)
        far = lambda p, q: math.hypot(p[0] - q[0], p[1] - q[1]) / was['tile']
        off = lambda now: max(far(p, q) for p, q in zip(now['rest'], was['rest']))
        a = await pg.evaluate(SEND, ['Foot', 70, 250]); most = 0
        for _ in range(6): await run.step(pg, 5); most = max(most, off(await pg.evaluate(WHERE)))
        b = await pg.evaluate(SEND, ['Archers', 320, 250])
        for _ in range(8): await run.step(pg, 5); now = await pg.evaluate(WHERE); most = max(most, off(now))
        return far(now['foot'], a), far(now['archers'], b), off(now), far(a, b), most, any(r[2] for r in was['rest'])

async def stands():
    """The picked foot make a wall and keep it; soldiers not picked do not; a new order drops it. (The Wall button is gone until Mode is built: the wall is called straight.)"""
    WALL = "(() => { const n = (c) => units.filter((u) => u.side === 0 && fk.SH[u.code].class === c && u.wall).length; return [n('Foot'), n('Archers')]; })()"
    TAP = "(v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate("[1, 2, 3].forEach((s) => WAR.treaty(0, s, 'peace'))")  # the computers' dealt plans attack early; this test is about our wall
        await run.step(pg, 40)
        for v in ('war||', 'mwho|Foot|'): await pg.evaluate(TAP, v)
        await pg.evaluate('WAR.stand(fk.picked(), null)')
        await run.step(pg, 120); held = await pg.evaluate(WALL)
        await pg.evaluate("fk.tap(70, 250)"); await run.step(pg, 5)  # the foot are still picked: nothing ended the pick (a second tap on Foot would put the box out, Nov 26)
        return held, await pg.evaluate(WALL)

CALM = "[1, 2, 3].forEach((s) => { const p = AI.per(s); if (p) p.waveMin = 1e9; })"  # the computers' dealt plans send waves early; checks of our own soldiers' orders run with the rivals' waves held back
async def chase():
    """Archers told to attack the farthest enemy soldier, who is walking away and out of sight: they must keep going to where he was last seen, not stop."""
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40)
        far = await pg.evaluate("(() => { const A = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Archers'), [a] = A, E = units.filter((u) => u.side !== 0 && fk.SIDES[u.side] && fk.SH[u.code].class).sort((p, q) => Math.hypot(q.bx - a.bx, q.by - a.by) - Math.hypot(p.bx - a.bx, p.by - a.by)), [e] = E; window.WHO = A; window.FROM = [a.bx, a.by]; WAR.order(A, e, e.k); return Math.hypot(e.bx - a.bx, e.by - a.by) / fk.D.tile; })()")
        await run.step(pg, 60)
        idle, gone = await pg.evaluate("[WHO.filter((u) => u.job === 'idle').length, Math.hypot(WHO[0].bx - FROM[0], WHO[0].by - FROM[1]) / fk.D.tile]")
        return far, idle, gone

async def tower(n):
    """The first n foot are ordered at an enemy tower raised 30 tiles from home; three minutes on, what is left of the tower and of them."""
    SET = "(n) => { const h = fk.seatOf(0), k0 = fk.tileAt(h.bx, h.by - 300), N = fk.N; let t = null; for (let d = 0; d < 40 && !t; d++) for (let dx = -d; dx <= d && !t; dx++) for (const dy of [-d, d]) { t = fk.build('BW3', k0 % N + dx, Math.floor(k0 / N) + dy, fk.SIDES[2].col); if (t) break; } t.done = 1; t.hp = t.hpMax = WAR.hpMax(t); window.ITS = t; window.ITSAT = [t.bx, t.by]; window.MEN = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot').slice(0, n); WAR.order(MEN, t, fk.tileAt(t.bx, t.by)); FK.on('tick', () => { for (const u of MEN) if (u.broke) u.zBroke = true; }); }"
    LOOK = "(() => { const A = MEN.filter((u) => units.includes(u)); return { ever: MEN.filter((u) => u.zBroke).length, tower: things.includes(ITS) && ITS.hp > 0 ? Math.round(ITS.hp) : 0, alive: A.length, onIt: A.filter((u) => u.target === ITS).length, near: A.filter((u) => Math.hypot(u.bx - ITSAT[0], u.by - ITSAT[1]) < 15 * fk.D.tile).length, broke: A.filter((u) => u.broke).length }; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40); await pg.evaluate(SET, n); await run.step(pg, 180)
        return await pg.evaluate(LOOK)

async def defends():
    """The army stands 60 tiles from home; ten raiders fall on the town centre; the foot are picked and told Defend through the war menu."""
    RAID = "(() => { const h = fk.seatOf(0), code = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot').code, k0 = fk.tileAt(h.bx, h.by - 60), N = fk.N; window.RAIDERS = []; for (let d = 0; d < 10 && RAIDERS.length < 10; d++) for (let dx = -d; dx <= d && RAIDERS.length < 10; dx++) { const k = k0 + dx - d * N; if (fk.walkable(k) && !units.some((u) => u.k === k)) { const e = fk.spawn(code, 2, k, fk.rng); if (e) RAIDERS.push(e); } } for (const e of RAIDERS) WAR.fight(e, h, true); })()"
    LOOK = "(() => { const on = (c) => units.filter((u) => u.side === 0 && fk.SH[u.code].class === c && RAIDERS.includes(u.target)).length; return [on('Foot'), on('Archers')]; })()"
    TAP = "(v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40); await pg.evaluate("(() => { const h = fk.seatOf(0); WAR.order(units.filter((u) => u.side === 0 && fk.SH[u.code].class), null, fk.tileAt(h.bx, h.by - 600)); })()"); await run.step(pg, 80)
        await pg.evaluate(RAID); await run.step(pg, 3)
        for v in ('war||', 'mwho|Foot|', 'mord|defend|'): await pg.evaluate(TAP, v)
        await run.step(pg, 5)
        return await pg.evaluate(LOOK)

async def troops():
    """The troop boxes (Albert, Nov 26): War opens with nobody picked; a type box picks its soldiers, minus trims one, a second type adds its own and keeps the trim, a lit box tapped again puts its soldiers down and the last one out leaves nobody; New picks every soldier never ordered, and soldiers given an order (Hold here) leave New."""
    TAP = "(v) => { [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); return fk.picked().length; }"
    WORDS = "[...document.querySelectorAll('#base .mctl .six > .fl')].map((b) => b.textContent.trim().replace(/\\s+/g, ' '))"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40); got = [await pg.evaluate(TAP, 'war||')]; words = [await pg.evaluate(WORDS)]
        for v in ('mwho|Riders|', 'mtyp|Riders|-1'): got.append(await pg.evaluate(TAP, v))
        words.append(await pg.evaluate(WORDS))
        for v in ('mwho|Foot|', 'mwho|Foot|', 'mwho|Riders|', 'mwho|new|', 'mwho|new|'): got.append(await pg.evaluate(TAP, v))
        new = [await pg.evaluate(TAP, 'mwho|Archers|'), await pg.evaluate(TAP, 'mhold||')]
        new.append((await pg.evaluate(WORDS))[0]); await pg.evaluate(TAP, 'mwho|Archers|'); new.append(await pg.evaluate(TAP, 'mwho|new|'))
        new.append(await pg.evaluate("fk.picked().filter((u) => fk.SH[u.code].class === 'Archers').length"))
        return got, words, new

async def site_taps():
    """A tap on one's own site, twice: the site stands, its card is open, no trash pops up by the finger and no word 'undefined' shows anywhere."""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 5)
        await pg.evaluate("""(() => { const h = fk.seatOf(0), N = fk.N, k0 = fk.tileAt(h.bx, h.by); for (let r = 8; r < 30; r++) for (let d = -r; d <= r; d++) for (const [i, j] of [[k0 % N + d, Math.floor(k0 / N) - r], [k0 % N + d, Math.floor(k0 / N) + r]]) if (ECON.canPlace('BR1', i, j)) { window.ZQS = ECON.site(0, 'BR1', i, j); return; } })()""")
        xy = await pg.evaluate("(() => { fk.cam.x = ZQS.vx; fk.cam.y = ZQS.vy; MENU.render(true); return fk.toScreen(ZQS.vx, ZQS.vy); })()")
        for _ in range(2):
            await pg.evaluate("([x, y]) => { fk.tap(x, y); MENU.render(true); }", xy); await pg.wait_for_timeout(700)
        await run.step(pg, 1)
        return await pg.evaluate("[fk.things().includes(ZQS), MENU.S.subject === ZQS, document.querySelectorAll('.trash').length, /undefined/.test(document.body.innerText)]")

async def picks_end():
    """Every order ends the pick: a move from the War card, and villagers sent to a bush from the map. The switches keep it: Hold, and since Nov 26 Retreat."""
    TAP = "(v) => { [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); return fk.picked().length; }"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40); got = []
        for v in ('war||', 'mwho|Archers|'): got.append(await pg.evaluate(TAP, v))
        await pg.evaluate("fk.tap(70, 250)"); got.append(await pg.evaluate("fk.picked().length"))
        got.append(await pg.evaluate(TAP, 'mwho|Foot|')); got.append(await pg.evaluate(TAP, 'mord|retreat|'))
        await pg.evaluate(TAP, 'war||')
        got.append(await pg.evaluate("""(() => { const V = units.filter((u) => u.side === 0 && fk.has(u, 'Gather')).slice(0, 3), b = fk.things().filter((t) => t.kind === 'bush' && !units.some((u) => fk.dist(u, t) < 1.5 * fk.D.tile)).sort((a, c) => fk.dist(a, V[0]) - fk.dist(c, V[0]))[0]; /* a bush nobody stands on, so the tap lands on the bush (Nov 24: the turned home finds put a villager on the nearest) */ fk.select(V); MENU.render(true); fk.cam.x = b.vx; fk.cam.y = b.vy; MENU.render(true); const [x, y] = fk.toScreen(b.vx, b.vy); const n = fk.picked().length; if (fk.paused()) fk.pause(false); fk.tap(x, y); return [n, fk.picked().length, V.filter((u) => u.target === b).length]; })()"""))
        return got

async def rings():
    """An order at a foe leaves no ring on the map; a move keeps its ring."""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40)
        await pg.evaluate("""(() => { const mine = (c) => units.filter((u) => u.side === 0 && fk.SH[u.code].class === c), foe = units.filter((u) => u.side === 2 && u.hp > 0).sort((a, b) => fk.dist(a, mine('Archers')[0]) - fk.dist(b, mine('Archers')[0]))[0], F = mine('Foot');
          WAR.order(mine('Archers'), foe, fk.tileAt(foe.bx, foe.by)); WAR.order(F, null, fk.tileAt(F[0].bx + 120, F[0].by - 80)); })()""")
        await run.step(pg, 2)
        return await pg.evaluate("[...WAR.ORD].filter((O) => O.n).map((O) => !!O.foe).sort()")

async def told():
    """Villagers carrying stone, sent to a berry bush away from home, keep to it after dropping the stone; a villager working a farm stays at it when raiders come."""
    STICK = """(() => { const h = fk.seatOf(0), d = (t) => fk.dist(t, h) / fk.D.tile, wild = (b) => units.some((u) => u.side !== 0 && u.hp > 0 && fk.has(u, 'Fight') && fk.dist(u, b) < 30 * fk.D.tile);
  const clr = (b) => Math.min(...units.filter((u) => u.side !== 0 && u.hp > 0 && fk.has(u, 'Fight')).map((u) => fk.dist(u, b))), B = fk.things().filter((t) => t.kind === 'bush' && d(t) > 30 && d(t) < 125 && fk.things().filter((q) => q.kind === 'bush' && fk.dist(q, t) < 6 * fk.D.tile).length >= 4) /* a patch with room for the four (Nov 24: an isolated bush sends the fourth to the next patch, as ruled) */.sort((a, b) => clr(b) - clr(a))[0], st = fk.things().filter((t) => t.kind === 'stone').sort((a, b) => d(a) - d(b))[0];
  const V = units.filter((u) => u.side === 0 && fk.has(u, 'Gather')).slice(0, 4); for (const u of V) ECON.gatherAt(u, st); window.ZQB = B; window.ZQV = V; return Math.round(d(B)); })()"""
    POST = """(() => { const h = fk.seatOf(0), N = fk.N, k0 = fk.tileAt(h.bx, h.by); let F = null; for (let r = 7; r < 30 && !F; r++) for (let dd = -r; dd <= r && !F; dd++) for (const [i, j] of [[k0 % N + dd, Math.floor(k0 / N) - r], [k0 % N + dd, Math.floor(k0 / N) + r]]) if (!F && ECON.canPlace('BCL1', i, j)) { F = fk.build('BCL1', i, j, fk.SIDES[0].col); F.done = 1; F.hp = F.hpMax = fk.stat('BCL1', 0, 'hp'); }
  const v = units.filter((u) => u.side === 0 && fk.has(u, 'Gather')).sort((a, b) => fk.dist(a, F) - fk.dist(b, F))[5]; ECON.gatherAt(v, F); window.ZQF = F; window.ZQW = v; return !!F; })()"""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 5); await pg.evaluate(STICK); await run.step(pg, 25)
        await pg.evaluate("WAR.order(ZQV, ZQB, fk.tileAt(ZQB.bx, ZQB.by))"); await run.step(pg, 120)
        kept = await pg.evaluate("[ZQV.filter((u) => u.target && u.target.kind === 'bush' && fk.dist(u.target, ZQB) < 6 * fk.D.tile).length, ZQV.length]")
        await pg.evaluate(POST); await run.step(pg, 30)
        await pg.evaluate("(() => { const e = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot'); for (let n = 0; n < 3; n++) fk.spawn(e.code, 2, fk.tileAt(ZQW.bx + 30 + 10 * n, ZQW.by + 20), fk.rng); })()")
        await run.step(pg, 6)
        return kept, await pg.evaluate("[ZQW.target === ZQF, !!(ZQW.scared || ZQW.inside || ZQW.den)]")

async def gaps():
    """Farms, tree farms, pastures, quarries, mints and foundries may stand side by side; a house keeps one tile from another house and two from anything else."""
    GAPS = """(() => { const h = fk.seatOf(0), N = fk.N, k0 = fk.tileAt(h.bx, h.by), ci = k0 % N, cj = Math.floor(k0 / N), col = fk.SIDES[0].col;
  const room = (i, j, w, hgt) => { for (let y = j - 3; y < j + hgt + 3; y++) for (let x = i - 3; x < i + w + 3; x++) if (!fk.free(y * N + x)) return false; return true; };
  let at = null; for (let r = 12; r < 60 && !at; r++) for (let d = -r; d <= r && !at; d++) for (const [i, j] of [[ci + d, cj - r], [ci + d, cj + r], [ci - r, cj + d], [ci + r, cj + d]]) if (!at && room(i, j, 14, 3) && ECON.canPlace('BCL1', i, j)) at = [i, j];
  if (!at) return 'no room'; const [i, j] = at, out = {};
  const A = fk.build('BCL1', i, j, col), n = A.n; A.done = 1;
  out.farmFarm0 = ECON.canPlace('BCL1', i + n, j); out.farmMint0 = ECON.canPlace('BI6', i + n, j); out.farmHouse0 = ECON.canPlace('BR1', i + n, j); out.farmHouse2 = ECON.canPlace('BR1', i + n + 2, j);
  return [n, out]; })()"""
    HOUSES = """(() => { const h = fk.seatOf(0), N = fk.N, k0 = fk.tileAt(h.bx, h.by), ci = k0 % N, cj = Math.floor(k0 / N), col = fk.SIDES[0].col;
  const room = (i, j, w, hgt) => { for (let y = j - 3; y < j + hgt + 3; y++) for (let x = i - 3; x < i + w + 3; x++) if (!fk.free(y * N + x)) return false; return true; };
  let at = null; for (let r = 12; r < 70 && !at; r++) for (let d = -r; d <= r && !at; d++) for (const [i, j] of [[ci + d, cj - r], [ci + d, cj + r], [ci - r, cj + d], [ci + r, cj + d]]) if (!at && room(i, j, 14, 3) && ECON.canPlace('BR1', i, j)) { const ok = ['BR1'].every(() => true); if (ok) at = [i, j]; }
  const [i, j] = at, out = {}; const A = fk.build('BR1', i, j, col), n = A.n; A.done = 1;
  out.house0 = ECON.canPlace('BR1', i + n, j); out.house1 = ECON.canPlace('BR1', i + n + 1, j); out.barracks1 = ECON.canPlace('BM1', i + n + 1, j); out.barracks2 = ECON.canPlace('BM1', i + n + 2, j); return [n, out]; })()"""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 2)
        return (await pg.evaluate(GAPS))[1], (await pg.evaluate(HOUSES))[1]

async def marks():
    """Your farm, quarry, mint, foundry, pasture and tree farm, four of them worked: the board draws their flags, glow and idle marks with no error."""
    SET = """(() => { const h = fk.seatOf(0), N = fk.N, k0 = fk.tileAt(h.bx, h.by), ci = k0 % N, cj = Math.floor(k0 / N), col = fk.SIDES[0].col, made = [];
          const room = (i, j, w, hgt) => { for (let y = j - 2; y < j + hgt + 2; y++) for (let x = i - 2; x < i + w + 2; x++) if (!fk.free(y * N + x)) return false; return true; };
          let at = null; for (let r = 8; r < 60 && !at; r++) for (let d = -r; d <= r && !at; d++) for (const [i, j] of [[ci + d, cj - r], [ci + d, cj + r], [ci - r, cj + d], [ci + r, cj + d]]) if (!at && room(i, j, 12, 6)) at = [i, j];
          const [i, j] = at; const put = (code, x, y) => { const b = fk.build(code, x, y, col); b.done = 1; b.hp = b.hpMax = fk.stat(code, 0, 'hp'); made.push(b); return b; };
          const F = put('BCL1', i, j), Q = put('BCL4', i + 3, j), M = put('BI6', i + 6, j), Fo = put('BI7', i + 9, j), P = put('BCL3', i, j + 3), T = put('BCL2', i + 3, j + 3);
          const V = units.filter((u) => u.side === 0 && fk.has(u, 'Gather')).sort((a, b) => fk.dist(a, F) - fk.dist(b, F)); ECON.gatherAt(V[0], F); ECON.gatherAt(V[1], M); ECON.gatherAt(V[2], P); ECON.gatherAt(V[3], T);
          window.ZQM = made; fk.cam.x = (F.vx + Fo.vx) / 2; fk.cam.y = (F.vy + T.vy) / 2; return made.map((b) => b.code); })()"""
    async with run.game(SEED, test=True) as pg:
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await run.step(pg, 2); await pg.evaluate(SET); await run.step(pg, 25)
        for _ in range(3): await pg.evaluate("draw()"); await run.step(pg, 0.5)
        return await pg.evaluate("ZQM.map((b) => !!b.wk)"), errs

async def logs():
    """The copy log says how a band order ended (here: its foe dead, then a new order) and names the cause of a death with no killer."""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40)
        await pg.evaluate("""(() => { const F = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot'), e = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot'); const z = fk.spawn(e.code, 2, fk.tileAt(F[0].bx + 60, F[0].by), fk.rng); WAR.order(F, z, fk.tileAt(z.bx, z.by)); })()""")
        await run.step(pg, 20)
        await pg.evaluate("(() => { const F = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot'); WAR.order(F, null, fk.tileAt(F[0].bx - 60, F[0].by)); const v = units.find((u) => u.side === 0 && fk.has(u, 'Gather')); fk.harm(v, v.hp); WAR.die(v, null, 'removed by you'); })()")
        await run.step(pg, 64)
        L = json.loads(await pg.evaluate("MENU.logText()"))
        end = [r for r in L['orders'] if r[1] == 'ended']
        lost = {k: v for r in L['rows'] for k, v in (r.get('lost') or {}).get(L['sides'][0], {}).items()}  # the log names sides by colour since Nov 24
        return (end[-1][3] if end else None), lost

async def home():
    """A stone miner whose last stone runs out, far from home: he goes idle at the mining camp (not waiting there for ever), and a minute later walks home to the town center."""
    SET = """(() => { const h = fk.seatOf(0), N = fk.N, S = fk.things().filter((t) => t.kind === 'stone').sort((a, b) => fk.dist(a, h) - fk.dist(b, h));
  let st = null, camp = null; for (const t of S) { if (fk.dist(t, h) < 25 * fk.D.tile) continue; const k0 = fk.tileAt(t.bx, t.by); for (let r = 2; r < 8 && !camp; r++) for (let d = -r; d <= r && !camp; d++) for (const [i, j] of [[k0 % N + d, Math.floor(k0 / N) - r], [k0 % N + d, Math.floor(k0 / N) + r]]) if (!camp && ECON.canPlace('BI3', i, j)) { camp = fk.build('BI3', i, j, fk.SIDES[0].col); camp.done = 1; camp.hp = camp.hpMax = fk.stat('BI3', 0, 'hp'); } if (camp) { st = t; break; } }
  for (const t of S) if (t !== st) t.amount = 0; st.amount = 4;
  const u = units.filter((u) => u.side === 0 && fk.has(u, 'Gather'))[0]; Object.assign(u, { bx: st.bx + 15, by: st.by + 15, path: null, load: 0, carry: null }); fk.place(u); ECON.gatherAt(u, st); window.ZQU = u; window.ZQH = h; window.ZQC = camp; return [Math.round(fk.dist(st, h) / fk.D.tile), Math.round(fk.dist(camp, st) / fk.D.tile)]; })()"""
    LOOK = "[ZQU.job, Math.round(fk.dist(ZQU, ZQH) / fk.D.tile)]"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 5); await pg.evaluate(SET); await run.step(pg, 30)
        a = await pg.evaluate(LOOK); await run.step(pg, 100)
        return a, await pg.evaluate(LOOK)

async def patched():
    """Every word floating over the map has its dark patch at the book's strength, and a redrawn card keeps the patches in place (read on the Town Center's card, whose row of words floats); the War card's boxes carry their own shade (Nov 26), so no patch lies under them."""
    TAP = "(v) => { [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); }"
    READ = "[...document.querySelectorAll('#patch i')].map((p) => { const r = p.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), +getComputedStyle(p).opacity]; })"
    UNDER = "(() => { const P = [...document.querySelectorAll('#patch i')].map((p) => p.getBoundingClientRect()), B = [...document.querySelectorAll('#rank .tb, #base .mctl .tb, #base .mctl .duo')].filter((b) => b.offsetWidth).map((b) => b.getBoundingClientRect()); return [B.length, B.filter((b) => P.some((p) => p.left < b.right && p.right > b.left && p.top < b.bottom && p.bottom > b.top)).length]; })()"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40)
        await pg.evaluate("(() => { MENU.S.subject = fk.seatOf(0); MENU.render(true); })()")
        got = await pg.evaluate(READ); await pg.evaluate('MENU.render(true)'); again = await pg.evaluate(READ)
        words = await pg.evaluate("[...document.querySelectorAll('#base .mctl .row2 button')].filter((b) => b.offsetWidth && !b.classList.contains('gone')).length")
        await pg.evaluate("(() => { MENU.S.subject = null; MENU.render(true); })()"); await pg.evaluate(TAP, 'war||'); await pg.evaluate('MENU.render(true)')
        return got, again == got, words, await pg.evaluate('MENU.SCR.patch.most'), await pg.evaluate(UNDER)

async def pressed():
    """A tapped button is pressed the moment the finger lands and let go after it leaves; a tap that redraws the button (Foot becomes boxed) still shows the press on the new button, and nothing is left pressed."""
    TAP = "(v) => { [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); }"
    PRESS = """(() => { const find = () => [...document.querySelectorAll('[data-v]')].find((x) => x.dataset.v === 'mwho|Foot|'), b = find(), o = { bubbles: true, pointerId: 1 };
  b.dispatchEvent(new PointerEvent('pointerdown', o)); const down = b.classList.contains('pr'); window.dispatchEvent(new PointerEvent('pointerup', o)); b.click(); const nb = find();
  return [down, nb !== b, nb.classList.contains('pr')]; })()"""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40); await pg.evaluate(TAP, 'war||')
        got = await pg.evaluate(PRESS)
        await pg.wait_for_timeout(int(await pg.evaluate('MENU.SCR.press.hold * D.touch.ms')) + 200)
        return got, await pg.evaluate("document.querySelectorAll('.pr').length")

async def farway():
    """On his Timberland map (seed 3382234986), six foot ordered from beside his town centre (D28) at the rival town centre at D4, 380 steps round the forest, all set off on the way; before, the search gave up at 20,000 tiles and they said 'no way'."""
    async with run.game(3382234986) as pg:
        await run.step(pg, 2)
        return await pg.evaluate("""(() => { const N = fk.N, me = fk.seatOf(0), t = fk.seatOf(1), k0 = fk.tileAt(me.bx, me.by), code = Object.keys(fk.SH).find((c) => fk.SH[c].class === 'Foot'), S = [];
          for (let r = 4; r < 30 && S.length < 6; r++) for (let d = -r; d <= r && S.length < 6; d++) { const k = k0 + d + r * N; if (fk.walkable(k) && !units.some((u) => u.k === k)) { const u = fk.spawn(code, 0, k, fk.rng); if (u) S.push(u); } }
          WAR.order(S, t, fk.tileAt(t.bx, t.by)); return [MENU.coord(t.bx, t.by), S.map((u) => (u.path ? u.path.length : 0))]; })()""")
async def front_line():
    """Twenty foe foot march at ten foot and ten archers of ours, which are told to attack the man at the back of them: they take the front, nobody goes past it, and a minute on we have lost fewer than they have; then what is left of them is put back beside their own town center, where the band lets them go."""
    SET = "(() => { const h = fk.seatOf(0), N = fk.N, T = fk.D.tile, code = (cls) => units.find((u) => u.side === 0 && fk.SH[u.code].class === cls).code, block = (c, side, k0, n, into) => { for (let d = 0; d < 12 && into.length < n; d++) for (let dx = -d; dx <= d && into.length < n; dx++) for (const dy of [-d, d]) { const k = k0 + dx + dy * N; const e = into.length < n && fk.walkable(k) && !units.some((u) => u.k === k) && fk.spawn(c, side, k, fk.rng); if (e) into.push(e); } return into; }, P = fk.tileAt(h.bx, h.by - 30 * T); window.OURS = block(code('Foot'), 0, P, 10, []); block(code('Archers'), 0, P + 3 * N, 20, OURS); window.FOES = block(code('Foot'), 2, fk.tileAt(h.bx, h.by - 52 * T), 20, []); WAR.attack(2, P, FOES); })()"
    TAP = "(() => { const c = WAR.centreOf(OURS), F = FOES.filter((u) => units.includes(u)), f = WAR.centreOf(F), d = Math.hypot(f.bx - c.bx, f.by - c.by); window.AX = { c, a: [(f.bx - c.bx) / d, (f.by - c.by) / d] }; window.BACK = F.sort((p, q) => Math.hypot(q.bx - c.bx, q.by - c.by) - Math.hypot(p.bx - c.bx, p.by - c.by))[0]; WAR.order(OURS, BACK, BACK.k); })()"
    LOOK = "(() => { const on = (u) => ((u.bx - AX.c.bx) * AX.a[0] + (u.by - AX.c.by) * AX.a[1]) / fk.D.tile, M = OURS.filter((u) => units.includes(u)), F = FOES.filter((u) => units.includes(u)), front = Math.min(...F.map(on)), c = WAR.centreOf(M), far = (v) => Math.hypot(v.bx - c.bx, v.by - c.by) / fk.D.tile, near = Math.min(...F.map(far)); return [M.filter((u) => on(u) > front + 2).length, 20 - M.length, 20 - F.length, M.filter((u) => u.target === BACK).length, M.filter((u) => F.includes(u.target) && u.target !== u.hitBy && far(u.target) > near + fk.D.front.deep + 1).length]; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate("[1, 3].forEach((s) => WAR.treaty(0, s, 'peace'))"); await pg.evaluate(CALM); await run.step(pg, 10); await pg.evaluate(SET); await run.step(pg, 4); await pg.evaluate(TAP); await run.step(pg, 1)
        first = await pg.evaluate(LOOK); most, deep = 0, first[4]
        for _ in range(30): await run.step(pg, 2); got = await pg.evaluate(LOOK); most, deep = max(most, got[0]), max(deep, got[4])
        town = await pg.evaluate("(() => { const s2 = fk.seatOf(2), [bx, by] = fk.tileMid(WAR.besideK(s2)), F = FOES.filter((u) => units.includes(u)); for (const v of F) { Object.assign(v, { bx, by, path: null, job: 'idle', target: null, focus: null }); fk.place(v); } return F.length; })()"); await run.step(pg, 3)
        chase = await pg.evaluate("OURS.filter((u) => units.includes(u) && FOES.includes(u.target)).length")
        return first[3], deep, most, got[1], got[2], town, chase
async def struck_on_march():
    """Ten of our foot are moved past five enemy archers who shoot at them on the way: they kill the archers and go on to the spot (his N423: if they are attacked they should kill the thing and keep going)."""
    SET = "(() => { const h = fk.seatOf(0), N = fk.N, T = fk.D.tile, code = (cls) => units.find((u) => u.side === 0 && fk.SH[u.code].class === cls).code, block = (c, side, k0, n, into) => { for (let d = 0; d < 12 && into.length < n; d++) for (let dx = -d; dx <= d && into.length < n; dx++) for (const dy of [-d, d]) { const k = k0 + dx + dy * N; const e = into.length < n && fk.walkable(k) && !units.some((u) => u.k === k) && fk.spawn(c, side, k, fk.rng); if (e) into.push(e); } return into; }; window.OURS = block(code('Foot'), 0, fk.tileAt(h.bx + 24 * T, h.by + 6 * T), 10, []); window.BOWS = block(code('Archers'), 2, fk.tileAt(h.bx + 38 * T, h.by + 12 * T), 5, []); for (const u of BOWS) Object.assign(u, { job: 'hold', goal: u.k }); window.GOAL = fk.tileAt(h.bx + 56 * T, h.by + 6 * T); WAR.order(OURS, null, GOAL); })()"
    LOOK = "(() => { const O = OURS.filter((u) => units.includes(u)), B = BOWS.filter((u) => units.includes(u)), [gx, gy] = fk.tileMid(GOAL); return [O.length, 5 - B.length, O.filter((u) => Math.hypot(u.bx - gx, u.by - gy) < 4 * fk.D.tile).length]; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate("[1, 3].forEach((s) => WAR.treaty(0, s, 'peace'))"); await pg.evaluate(CALM); await run.step(pg, 10); await pg.evaluate(SET); await run.step(pg, 70)
        return await pg.evaluate(LOOK)

async def rush():
    """Fourteen of our foot are sent at fourteen archers coming on to shoot them: once under the arrows they run in (Herodotus 6.112, Marathon), so they get within 3 tiles of the archers, not stand off at their range."""
    SET = "(() => { const h = fk.seatOf(0), N = fk.N, T = fk.D.tile, code = (cls) => units.find((u) => u.side === 0 && fk.SH[u.code].class === cls).code, block = (c, side, k0, n, into) => { for (let d = 0; d < 12 && into.length < n; d++) for (let dx = -d; dx <= d && into.length < n; dx++) for (const dy of [-d, d]) { const k = k0 + dx + dy * N; const e = into.length < n && fk.walkable(k) && !units.some((u) => u.k === k) && fk.spawn(c, side, k, fk.rng); if (e) into.push(e); } return into; }; window.OURS = block(code('Foot'), 0, fk.tileAt(h.bx + 30 * T, h.by + 6 * T), 14, []); window.BOWS = block(code('Archers'), 2, fk.tileAt(h.bx + 42 * T, h.by + 6 * T), 14, []); WAR.attack(2, OURS[0].k, BOWS); WAR.order(OURS, BOWS[0], BOWS[0].k); })()"
    LOOK = "(() => { const O = OURS.filter((u) => units.includes(u)), B = BOWS.filter((u) => units.includes(u)); return Math.min(99, ...O.map((u) => Math.min(...B.map((v) => Math.hypot(v.bx - u.bx, v.by - u.by) / fk.D.tile)))); })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate("[1, 3].forEach((s) => WAR.treaty(0, s, 'peace'))"); await pg.evaluate(CALM); await run.step(pg, 10); await pg.evaluate(SET); close = 99
        for _ in range(15): await run.step(pg, 1); close = min(close, await pg.evaluate(LOOK))
        return close

async def elephant():
    """The war elephant (Nov 23): its blow tramples more than the man it strikes; enemy foot fighting near it lose nerve; arrows shake it, less once armoured; gone amok it tramples its own side."""
    SET = """(() => { const h = fk.seatOf(0), N = fk.N, T = fk.D.tile, at = (dx, dy) => fk.tileAt(h.bx + dx * T, h.by + dy * T), block = (c, side, k0, n, into) => { for (let d = 0; d < 12 && into.length < n; d++) for (let dx = -d; dx <= d && into.length < n; dx++) for (const dy of [-d, d]) { const k = k0 + dx + dy * N; const e = into.length < n && fk.walkable(k) && !units.some((u) => u.k === k) && fk.spawn(c, side, k, fk.rng); if (e) into.push(e); } return into; };
      window.EL = block('UM12', 0, at(30, 6), 1, []); window.PACK = block('UM1', 2, at(32, 6), 8, []); for (const u of PACK) Object.assign(u, { job: 'hold', goal: u.k }); WAR.fight(EL[0], PACK[0]);
      window.AMOK = block('UM12', 0, at(30, 30), 1, []); window.OWN = block('UM1', 0, at(30, 30), 5, []).filter((u) => u !== AMOK[0]); Object.assign(AMOK[0], { job: 'rout', routAt: K.t, broke: true, mor: 0 });
      window.SHOT = [...block('UM12', 0, at(-30, 6), 1, []), ...block('UM12', 0, at(-30, 30), 1, [])]; })()"""
    LOOK = "(() => { const hurt = (S) => S.filter((u) => !units.includes(u) || u.hp < u.hpMax).length; return [hurt(PACK), Math.min(...PACK.filter((u) => units.includes(u)).map((u) => u.mor)), hurt(OWN)]; })()"
    SHOOT = "(() => { const B = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Archers') || units.find((u) => u.side === 0 && fk.SH[u.code].class === 'Archers'); const r = SHOT.map((e) => { e.mor = 1; for (let i = 0; i < 10; i++) WAR.hit(B, e); return 1 - e.mor; }); return r; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate("[1, 3].forEach((s) => WAR.treaty(0, s, 'peace'))"); await pg.evaluate(CALM); await run.step(pg, 10); await pg.evaluate(SET); await run.step(pg, 8)
        trampled, fear, own = await pg.evaluate(LOOK)
        bare = await pg.evaluate(SHOOT)
        await pg.evaluate("(() => { const t = BOOKS.tech; const c = Object.keys(t).find((k) => t[k].key === 'elephantarmour'); fk.learn ? fk.learn(0, c) : null; return c; })()")
        armoured = await pg.evaluate(SHOOT)
        return trampled, fear, own, bare, armoured

async def no_way():
    """A wave leaves only on a whole route (none: no wave, and that rival is left alone a while); a wave stood with no way on, short of its mark, turns home at once (Nov 24: red's waves stood on a river bank, 150 tiles short, then went again)."""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 5)
        return await pg.evaluate("""(() => { const N = FK.N, wet = (k) => { const i = k % N, j = (k - i) / N; for (let dj = -6; dj <= 6; dj++) for (let di = -6; di <= 6; di++) { const q = (j + dj) * N + i + di; if (i + di < 0 || j + dj < 0 || i + di >= N || j + dj >= N || FK.walkable(q)) return false; } return true; };
          let sea = -1; for (let k = 0; k < N * N && sea < 0; k += 7) if (wet(k)) sea = k;
          const army = (s) => fk.units().filter((u) => u.side === s && ECON.soldier(u.code)), seat = (s) => fk.blds().find((b) => b.side === s && fk.has(b, 'Seat')), mk = (s, n) => { const h = seat(s); for (let i = 0; i < n; i++) FK.spawn('UM2', s, FK.tileAt(h.bx + 40 + i * 12, h.by + 40), FK.rng); return army(s); };
          const A = mk(2, 6), none = WAR.attack(2, sea, A), noWave = WAR.waves[2] === null;
          const h0 = seat(0), far = FK.tileAt(h0.bx, h0.by), went = WAR.attack(2, far, A), w = WAR.waves[2]; Object.assign(w, { S: A, to: 0, bid: false, d: Infinity, pt: FK.K.t });
          AI.decideWar(2, AI.per(2)); const kept = !!WAR.waves[2]; for (const u of A) Object.assign(u, { job: 'hold', path: null, hurtT: -1e9 });
          AI.decideWar(2, AI.per(2)); return { sea: sea >= 0, none, noWave, went, kept, home: WAR.waves[2] === null, cool: (AI.mind[2].cool || {})[0] > FK.K.t }; })()""")

async def spoils():
    """A fallen side's store goes to the side that felled its last seat (Nov 23: it went to nobody; the line read the building's board row for its killer)."""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 5)
        a = await pg.evaluate("""(() => { const S = SIDES, Y = ['food', 'wood', 'stone', 'gold', 'iron']; Object.assign(S[2].store, { food: 111, wood: 2222, stone: 3333, gold: 4444, iron: 555 });
          const had = Y.map((y) => S[0].store[y]), theirs = Y.map((y) => S[2].store[y]), killer = units.find((u) => u.side === 0);
          for (const b of fk.blds().filter((b) => b.side === 2 && fk.has(b, 'Seat'))) WAR.die(b, killer);
          const kept = Y.map((y) => S[2].store[y] === (D.start[y] || 0)), standing = fk.units().filter((u) => u.side === 2).length, fellAtSeat = ECON.fell(2);
          for (const u of fk.units().filter((u) => u.side === 2 && fk.has(u, 'Gather'))) WAR.die(u, killer); return [Y.map((y, i) => S[0].store[y] - had[i] >= theirs[i]), kept, fellAtSeat, standing, fk.units().filter((u) => u.side === 2).length]; })()""")
        await run.step(pg, 12)  # the beaten check runs on the slow beat, every 10 s
        return a, await pg.evaluate("[ECON.fell(2), fk.units().filter((u) => u.side === 2).length]")

async def full_lines():
    """Two barracks of yours: a Train tap on one whose line is full goes to the other's line, with a note naming where it went; with both full it is refused."""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 1)
        return await pg.evaluate("""(() => { for (const u of fk.units().filter((v) => v.side === 0 && ECON.soldier(v.code))) fk.vanish(u);
  const h = fk.seatOf(0), N = fk.N, k0 = fk.tileAt(h.bx, h.by), [H] = fk.bought('House'), put = (code) => { for (let r = 8; r < 40; r++) for (let d = -r; d <= r; d++) for (const [i, j] of [[k0 % N + d, Math.floor(k0 / N) - r], [k0 % N + d, Math.floor(k0 / N) + r], [k0 % N - r, Math.floor(k0 / N) + d], [k0 % N + r, Math.floor(k0 / N) + d]]) if (ECON.canPlace(code, i, j)) { const t = ECON.site(0, code, i, j); t.done = 1; return t; } return null; };
  const b1 = put('BM1'), b2 = put('BM1'), [c] = fk.trains('BM1', 0).filter((x) => fk.aged(x, 0)), cap = fk.stat('BM1', 0, 'queue'), got = [cap];
  for (let n = 0; n < 9 && ECON.popCap(0) < ECON.popOf(0) + 2 * cap + 1; n++) put(H);
  for (let n = 0; n < cap; n++) ECON.queue(b1, c);
  got.push(b1.q.length, MENU.act('train', c, b1), b1.q.length, b2.q.length, MENU.mail[0] && MENU.mail[0].text);
  for (let n = 1; n < cap; n++) MENU.act('train', c, b1);
  got.push(b2.q.length, MENU.act('train', c, b2), b1.q.length, b2.q.length, MENU.log.no['train: ' + MENU.WD.say.lineFull] || 0, MENU.WD.say.lineOther.replace('{b}', ECON.nameOf('BM1').toLowerCase()));
  return got; })()"""), pg.errors
async def thin_ice():
    """Albert's log (Nov 21, seed 3382234986): soldiers drowned marching, as a crossing mode let them onto ice too thin to bear one of them. On the lake nearest your Town Center, ice at 0.8 of what bears a soldier at the safe load:
    no soldier of any side, with a crossing mode or without, gets a way onto it, none drowns, and the ice stays whole; at 1.2 of it yours (normal) may step on and the computer's (ai of them) may not."""
    FIND = """() => { const me = FK.ME ?? ME, seat = FK.seatOf(me), N = FK.N; let best = -1, land = -1, bd = Infinity;
  for (let k = 0; k < N * N; k++) { if (!(FK.H[k] <= -FK.D.wade / 2 && DEP[k] >= FK.D.edge)) continue; let l = -1; for (const [dx, dy] of FK.D.ways) { const q = k + dy * N + dx; if (FK.H[q] > 0 && FK.walkable(q)) l = q; } if (l < 0) continue;
    const [x, y] = FK.tileMid(k), d = Math.hypot(x - seat.bx, y - seat.by); if (d < bd) [bd, best, land] = [d, k, l]; }
  const foe = Object.keys(FK.SIDES).map(Number).find((s) => s !== me); window.__ice = { me, foe, k: best, land, code: 'UM1', drowned: 0 }; FK.on('drown', () => window.__ice.drowned++); return best >= 0; }"""
    SET = """(f) => { const T = window.__ice; FK.K.snow = 0; const h = Math.sqrt(massOf(T.code) / FK.D.ice.load.safe) * f; FK.K.fds = (onsetOf(T.k) + (h / FK.D.ice.alpha.bare) ** 2) * FK.D.day; }"""
    SEND = """() => { const T = window.__ice, U = []; for (const s of [T.me, T.me, T.foe, T.foe]) { const u = FK.spawn(T.code, s, T.land, FK.rng); if (s === T.me) u.ice = 'normal'; U.push(u); } return U.map((u) => FK.go(u, T.k)); }"""
    BEARS = """() => { const T = window.__ice, [a, b] = [T.me, T.foe].map((s) => FK.spawn(T.code, s, T.land, FK.rng)); a.ice = 'normal'; return [FK.walkable(T.k, a), FK.walkable(T.k, b)]; }"""
    async with run.game(3382234986, test=True) as pg:
        if not await pg.evaluate(FIND): return None
        await pg.evaluate(SET, 0.8); ways = await pg.evaluate(SEND)
        for _ in range(12): await pg.evaluate(SET, 0.8); await run.step(pg, 1)
        got = await pg.evaluate('() => [window.__ice.drowned, HOLES.size]')
        await pg.evaluate(SET, 1.2); bears = await pg.evaluate(BEARS)
        return ways, got, bears, pg.errors[:2]
async def alarmed():
    """The alarm leaves nobody idle in the open: 50 villagers spread over the base, Shelter rung; 30 s on every building with room is full and the rest are beside the town center or still on their way (Albert's raid, Nov 21: 8 in, 30 idle, 15 walking)."""
    SET = """(() => { const h = fk.seatOf(0), T = fk.D.tile, v0 = units.filter((u) => u.side === 0 && fk.has(u, 'Gather'))[0];
  for (let i = 0; i < 44; i++) ECON.spawnBy(h, v0.code);
  units.filter((u) => u.side === 0 && fk.has(u, 'Gather')).forEach((u, i) => { const a = i * 2.4, r = (7 + (i % 12) * 2.2) * T; Object.assign(u, { bx: h.bx + Math.cos(a) * r, by: h.by + Math.sin(a) * r, path: null, load: 0, carry: null, target: null, job: 'idle' }); fk.place(u); }); })()"""
    LOOK = """(() => { const h = fk.seatOf(0), V = units.filter((u) => u.side === 0 && fk.has(u, 'Gather') && !u.gone), c = { n: V.length, inside: 0, walking: 0, open: 0, beside: 0, other: 0 };
  for (const u of V) c[u.inside ? 'inside' : u.path || u.job === 'walk' || u.job === 'shelter' ? 'walking' : fk.isIdle(u) ? (fk.atB(u, h) ? 'beside' : 'open') : 'other']++;
  c.room = fk.blds().filter((b) => b.side === 0 && ECON.up(b) && ECON.hold(b)).reduce((n, b) => n + ECON.hold(b), 0); return c; })()"""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 3); await pg.evaluate(SET); await run.step(pg, 1)
        await pg.evaluate("ECON.alarm('shelter')"); await run.step(pg, 30)
        return await pg.evaluate(LOOK), pg.errors[:2]
ROW = "[...document.querySelectorAll('#base .mt.W .cell')].map((b) => b.textContent.trim() + (b.classList.contains('lit') ? '*' : '') + (b.classList.contains('dim') ? '~' : ''))"
async def missions():
    """The War card's tall row (Albert, Nov 26): Attack, Move, Hold, then the pad To Death, Defend, Stop, Retreat; nothing is armed or lit as it opens, and every box is dim with nobody picked. With nobody picked Retreat does nothing and Move does nothing."""
    TAP = "(v) => { [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); return fk.picked().length; }"
    HOMING = "units.filter((u) => u.side === 0 && u.job === 'rout').length"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40); await pg.evaluate(TAP, 'war||')
        row = await pg.evaluate(ROW)
        await pg.evaluate("fk.select(null)"); n = await pg.evaluate(TAP, 'mord|retreat|'); h = await pg.evaluate(HOMING); m = await pg.evaluate(TAP, 'mord|move|')
        return row, (n, h, m, await pg.evaluate(ROW))

async def retreats():
    """Retreat is a switch (Albert, Nov 26): the foot are sent out from home and put on Hold; Retreat on: all walk home, the box lit, Hold off, the pick kept; six seconds on they are nearer home; tapped again they stop where they stand, unlit, not on Hold and in the state a move that has arrived leaves them in, and twenty seconds on have not moved; on again and left alone they are home, idle, and the light is out."""
    TAP = "(v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click()"
    OUT = "() => { const h = fk.seatOf(0), M = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot'); window.MEN = M; WAR.order(M, null, fk.tileAt(h.bx + 300, h.by)); }"
    LOOK = "(() => { const h = fk.seatOf(0), T = fk.D.tile; window.AT = MEN.map((u) => [u.bx, u.by]); return { picked: fk.picked().length, home: MEN.filter((u) => u.job === 'rout' && u.routAt == null).length, hold: MEN.filter((u) => u.stand).length, lit: !!document.querySelector('[data-v=\"mord|retreat|\"].lit'), jobs: [...new Set(MEN.map((u) => u.job))].sort().join('+'), far: +(MEN.reduce((a, u) => a + fk.dist(u, h), 0) / MEN.length / T).toFixed(1) }; })()"
    MOVED = "+Math.max(...MEN.map((u, i) => Math.hypot(u.bx - AT[i][0], u.by - AT[i][1]) / fk.D.tile)).toFixed(1)"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40); await pg.evaluate(OUT); await run.step(pg, 60); was = await pg.evaluate("[...new Set(MEN.map((u) => u.job))].sort().join('+')")
        for v in ('war||', 'mwho|Foot|', 'mhold||'): await pg.evaluate(TAP, v)
        a = await pg.evaluate(LOOK); await pg.evaluate(TAP, 'mord|retreat|'); b = await pg.evaluate(LOOK)
        await run.step(pg, 6); c = await pg.evaluate(LOOK); await pg.evaluate(TAP, 'mord|retreat|'); d = await pg.evaluate(LOOK)
        await run.step(pg, 20); moved = await pg.evaluate(MOVED); e = await pg.evaluate(LOOK)
        await pg.evaluate(TAP, 'mord|retreat|'); await run.step(pg, 120); f = await pg.evaluate(LOOK)
        return [a, b, c, d, e, f], moved, was, pg.errors[:2]

CTL = """window.Z = { tap: (v) => { const b = [...document.querySelectorAll('[data-v]')].find((b) => b.offsetParent !== null && b.dataset.v === v); if (b) b.click(); return !!b; }, cls: (c) => units.filter((u) => u.side === 0 && fk.SH[u.code].class === c && u.hp > 0),
  mt: (t) => { fk.cam.x = t.vx; fk.cam.y = t.vy; MENU.render(true); fk.tap(...fk.toScreen(t.vx, t.vy)); MENU.render(true); }, box: (c) => [...document.querySelectorAll('#base .mctl .six > .fl')].map((b) => b.textContent.trim().replace(/\\s+/g, ' ') + (b.querySelector('.has') ? '*' : '')).find((w) => w.startsWith(c)),
  home: () => { Z.tap('mhome||'); fk.select(null); MENU.S.aim = null; MENU.render(true); } }; if (fk.paused()) fk.pause(false); true"""
async def controls():
    """The control rule sheet (Albert, Nov 26, N582), each line driven by real taps on the map: picking by tap adds and drops; with soldiers picked a tap on ground moves and a tap on an enemy attacks, and the pick ends; with nobody picked a tap primes a target and Attack fires at it; ground primes only while War is open; a tap on your own building is never a troop order; a box takes soldiers only, after a quarter-second hold."""
    out = {}
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate("[1, 3].forEach((s) => WAR.treaty(0, s, 'peace')); WAR.treaty(0, 2, 'war')"); await pg.evaluate(CALM); await run.step(pg, 60); await pg.evaluate(CTL)
        out['pick'] = await pg.evaluate("(() => { const F = Z.cls('Foot'), A = Z.cls('Archers'); Z.mt(F[0]); const p = fk.picked()[0], a = [fk.picked().length, MENU.S.war]; Z.mt(A.find((u) => u !== p) || A[0]); a.push(fk.picked().length, Z.box('Foot'), Z.box('Archers')); Z.mt(fk.picked()[0]); a.push(fk.picked().length); return a; })()")
        out['move'] = await pg.evaluate("(() => { Z.home(); Z.tap('war||'); Z.tap('mwho|Foot|'); const F = Z.cls('Foot'); fk.cam.x = F[0].vx; fk.cam.y = F[0].vy; MENU.render(true); const [x, y] = fk.toScreen(F[0].vx, F[0].vy); fk.tap(x + 100, y - 90); MENU.render(true); return [fk.picked().length, F.filter((u) => u.job === 'march').length]; })()")
        await run.step(pg, 1)
        out['attack'] = await pg.evaluate("(() => { Z.home(); const e = units.find((u) => u.side === 2 && fk.SH[u.code].class && u.hp > 0); Z.tap('war||'); Z.tap('mwho|Riders|'); const R = Z.cls('Riders'); Z.mt(e); return [fk.picked().length, R.filter((u) => u.focus && u.focus.side === 2).length, R.length]; })()")
        await run.step(pg, 1)
        out['prime'] = await pg.evaluate("(() => { Z.home(); const e = units.filter((u) => u.side === 2 && fk.SH[u.code].class && u.hp > 0).at(-1); Z.mt(e); const a = [MENU.S.war, !!(MENU.S.aim && MENU.S.aim.t === e), MENU.S.subject == null]; Z.tap('mwho|Archers|'); const A = Z.cls('Archers'), ok = Z.tap('mord|attack|'); return [a, fk.picked().length, !!MENU.S.aim, A.filter((u) => u.focus === e).length, A.length]; })()")
        await run.step(pg, 1)
        out['ground'] = await pg.evaluate("(() => { Z.home(); Z.tap('war||'); fk.tap(150, 300); MENU.render(true); const a = !!MENU.S.aim; fk.tap(150, 300); MENU.render(true); const b = !!MENU.S.aim; Z.tap('mwho|Foot|'); const g = Z.cls('Foot').map((u) => u.goal).join(); Z.tap('mord|move|'); const c = [fk.picked().length, Z.cls('Foot').map((u) => u.goal).join() === g]; Z.home(); fk.tap(150, 300); MENU.render(true); return [a, b, c, !!MENU.S.aim, MENU.S.war]; })()")
        out['own'] = await pg.evaluate("(() => { Z.home(); Z.tap('war||'); Z.tap('mwho|Foot|'); Z.tap('mhold||'); const F = Z.cls('Foot'), g = F.map((u) => u.goal).join(), t = fk.seatOf(0); Z.mt(t); return [fk.picked().length, MENU.S.subject === t, MENU.S.war, F.map((u) => u.goal).join() === g]; })()")
        xy = await pg.evaluate("(() => { Z.home(); const F = Z.cls('Foot'), v = units.find((u) => u.side === 0 && fk.has(u, 'Gather')); v.bx = F[0].bx + fk.D.tile; v.by = F[0].by; fk.place(v); window.VIL = v; fk.cam.x = F[0].vx; fk.cam.y = F[0].vy; MENU.render(true); return fk.toScreen(F[0].vx, F[0].vy); })()")
        hold = await pg.evaluate('D.touch.hold')
        await pg.mouse.move(xy[0] - 150, xy[1] - 150); await pg.mouse.down(); await pg.wait_for_timeout(hold + 40); await pg.mouse.move(xy[0], xy[1], steps=4); await pg.mouse.move(xy[0] + 150, xy[1] + 110, steps=4); await pg.mouse.up(); await pg.wait_for_timeout(100)
        out['box'] = await pg.evaluate("[fk.picked().length > 0, fk.picked().every((u) => fk.SH[u.code].class), fk.picked().includes(VIL), MENU.S.war]") + [hold]
        out['errors'] = pg.errors[:2]
    return out

async def seeks():
    """Soldiers sent at one enemy unit by a tap on it seek it (Albert, Nov 26: 'tap an enemy soldier, it launches and seeks it'): an enemy foot soldier 14 tiles off walks away the whole time; the cavalry are picked and he is tapped; 36 s on they are on him and he is hurt."""
    SET = "(() => { const M = Z.cls('Riders'), code = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot').code, T = fk.D.tile, c = M.reduce((a, u) => [a[0] + u.bx / M.length, a[1] + u.by / M.length], [0, 0]); let e = null; for (let d = 14; d < 30 && !e; d++) { const k = fk.tileAt(c[0] + d * T, c[1]); if (fk.walkable(k) && !units.some((u) => u.k === k)) e = fk.spawn(code, 2, k, fk.rng); } e.hpMax = e.hp = 99999; window.MEN = M; window.FOE = e; const far = fk.tileAt(e.bx + 45 * T, e.by + 10 * T); window.FLEE = () => { if (FOE.job !== 'march' && FOE.job !== 'walk') WAR.order([FOE], null, far); }; FLEE(); Z.tap('war||'); Z.tap('mwho|Riders|'); Z.mt(e); return [fk.picked().length, M.filter((u) => u.focus === e).length]; })()"
    LOOK = "(() => { FLEE(); const T = fk.D.tile, A = MEN.filter((u) => u.hp > 0); return [+Math.min(...A.map((u) => Math.hypot(u.bx - FOE.bx, u.by - FOE.by) / T)).toFixed(1), A.filter((u) => u.target === FOE).length, 99999 - Math.round(FOE.hp)]; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate("WAR.treaty(0, 2, 'war')"); await pg.evaluate(CALM); await run.step(pg, 40); await pg.evaluate(CTL); a = await pg.evaluate(SET)
        for _ in range(6): await run.step(pg, 6); b = await pg.evaluate(LOOK)
        return a, b, pg.errors[:2]

async def falls():
    """Fall back (off the War card since Nov 25, until Advance and Fall back are built; called straight): three enemy foot stand three tiles from the foot; the foot are picked and told Fall back: they walk away from the enemies, re-form, then go back in at the enemies they left."""
    TAP = "(v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click()"
    GAP = "(() => { const F = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot' && u.hp > 0), m = (S) => [S.reduce((a, u) => a + u.bx, 0) / S.length, S.reduce((a, u) => a + u.by, 0) / S.length], [ax, ay] = m(F), L = FOES.filter((u) => u.hp > 0), [bx, by] = L.length ? m(L) : [ax, ay]; return [Math.hypot(ax - bx, ay - by) / fk.D.tile, F.filter((u) => u.fall).length, F.filter((u) => FOES.includes(u.target)).length]; })()"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 40)
        await pg.evaluate("(() => { const F = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot'), e = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot'), c = F[0], T = fk.D.tile; window.FOES = []; for (let n = 0; n < 3; n++) { const z = fk.spawn(e.code, 2, fk.tileAt(c.bx + (3 + n) * T, c.by), fk.rng); if (z) FOES.push(z); } })()")
        for v in ('war||', 'mwho|Foot|'): await pg.evaluate(TAP, v)
        await pg.evaluate("WAR.fallBack(fk.picked())")
        seen = []
        for _ in range(6): seen.append(await pg.evaluate(GAP)); await run.step(pg, 2)
        return seen
async def walled():
    """Nine foot are ordered at a rival house inside a closed ring of rival walls with a gate (no way in); what they strike at 20 s, and at 160 s how many wall pieces stand and whether the house was reached."""
    SET = """(() => { const h = fk.seatOf(0), N = fk.N, B = fk.B, col = fk.SIDES[2].col, [WALL] = fk.bought('Line'), [GATE] = fk.bought('Gate'), [HOUSE] = fk.bought('House'), R = 2, n = B[HOUSE][1], gn = B[GATE][1], box = n + R + R, k0 = fk.tileAt(h.bx, h.by - 300), up = (t) => { if (t) { t.done = 1; t.hp = t.hpMax = WAR.hpMax(t); } return t; };
      let at = null; for (let d = 0; d < 40 && !at; d++) for (let dx = -d; dx <= d && !at; dx++) for (const dy of [-d, d]) { const i = k0 % N + dx, j = Math.floor(k0 / N) + dy, h0 = fk.H[j * N + i]; let ok = true; for (let y = j - 1; y < j + box + 1 && ok; y++) for (let x = i - 1; x < i + box + 1 && ok; x++) ok = fk.walkable(y * N + x) && !fk.OCC[y * N + x] && fk.H[y * N + x] === h0; if (ok) { at = [i + R, j + R]; break; } }
      const [i0, j0] = at, house = up(fk.build(HOUSE, i0, j0, col)), W = [up(fk.build(GATE, i0 + Math.floor((n - gn) / 2), j0 + n + R - gn, col))];
      for (let y = j0 - R; y < j0 + n + R; y++) for (let x = i0 - R; x < i0 + n + R; x++) if (y === j0 - R || y === j0 + n + R - 1 || x === i0 - R || x === i0 + n + R - 1) { const w = up(fk.build(WALL, x, y, col)); if (w) W.push(w); }
      const men = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot').slice(0, 9), shut = !fk.findPath(men[0].k, (q) => { const x = q % N, y = (q - x) / N; return x >= i0 - 1 && x <= i0 + n && y >= j0 - 1 && y <= j0 + n; }, fk.tileAt(house.bx, house.by), D.tries.way, men[0]);
      window.WALLED = { house, W, men }; WAR.order(men, house, fk.tileAt(house.bx, house.by)); return shut; })()"""
    LOOK = "(() => { const { house, W, men } = WALLED, A = men.filter((u) => units.includes(u)); return { onWall: A.filter((u) => W.includes(u.target)).length, onHouse: A.filter((u) => u.target === house).length, stand: W.filter((w) => things.includes(w)).length, of: W.length, house: things.includes(house) ? Math.round(house.hp / house.hpMax * 100) : 0 }; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40); shut = await pg.evaluate(SET); await run.step(pg, 20); first = await pg.evaluate(LOOK); await run.step(pg, 140)
        return shut, first, await pg.evaluate(LOOK)

async def unqueued():
    """Back on a Town Center queue of a villager then the next age takes the villager out: the age-up starts its whole time and does not finish on the next step (Nov 21 review of econ.js, E931)."""
    SET = """(() => { const h = fk.seatOf(0), v = units.find((u) => u.side === 0 && fk.has(u, 'Gather')).code, a0 = fk.SIDES[0].age; if (!ECON.queue(h, v)) { h.q = [v]; h.qt = ECON.timeOf(0, v); } const up = ECON.ageUp(0); window.ZUQ = { h, a0 }; return [h.q.length, up]; })()"""
    LOOK = "(() => { const { h, a0 } = ZUQ; return [fk.SIDES[0].age - a0, h.q.length, Math.round(h.qt), h.q.length ? Math.round(ECON.timeOf(0, h.q[0])) : null]; })()"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 3); q = await pg.evaluate(SET); await run.step(pg, 1)
        await pg.evaluate("ECON.unqueue(ZUQ.h, 0)"); await run.step(pg, 1)
        return q, await pg.evaluate(LOOK)

async def camp_crew():
    """One soldier alone raises a camp piece 45 tiles or more from every other soldier: its crew does not grow step on step, and in ten seconds the piece rises at one soldier's hands (D279 build x campbuild, to D126's crew power), not slower and slower (Nov 21 review of econ.js, E2560)."""
    SET = """(() => { const h = fk.seatOf(0), N = fk.N, T = fk.D.tile, [code] = fk.bought('House'), A = units.filter((v) => v.side === 0 && WAR.armed(v)); let b = null;
  for (let r = 45; r < 90 && !b; r += 3) for (let a = 0; a < 24 && !b; a++) { const i = Math.round(h.i + r * Math.cos(a * Math.PI / 12)), j = Math.round(h.j + r * Math.sin(a * Math.PI / 12)); const t = i > 0 && j > 0 && ECON.site(0, code, i, j); if (!t) continue; if (A.some((v) => fk.dist(v, t) < 45 * T)) fk.unbuild(t); else b = t; }
  b.camp = { size: 'small' }; const foot = units.find((u) => u.side === 0 && fk.SH[u.code].class === 'Foot').code; let u = null;
  for (let y = b.j - 1; y <= b.j + b.n && !u; y++) for (let x = b.i - 1; x <= b.i + b.n && !u; x++) { const k = y * N + x; if (fk.walkable(k) && !fk.OCC[k] && !units.some((v) => v.k === k)) u = fk.spawn(foot, 0, k, fk.rng); }
  Object.assign(u, { job: 'raise', then: 'raise', site: b, goal: null, target: null, path: null }); window.ZCC = { b, u, d0: b.done }; return [Math.round(Math.min(...A.map((v) => fk.dist(v, b))) / T), fk.atB(u, b)]; })()"""
    LOOK = "(() => { const { b, u, d0 } = ZCC, T1 = fk.stat(b.code, 0, 'build'), hand = fk.D.camp.build * fk.stat('', 0, 'campbuild'); return [Math.round(b.crew || 0), +(b.done - d0).toFixed(4), +((hand ** fk.D.crew) * 10 / T1).toFixed(4), units.filter((v) => v.site === b && v.job === 'raise').length, units.filter((v) => v.target === b).length, u.job]; })()"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 3); s = await pg.evaluate(SET); await run.step(pg, 10)
        return s, await pg.evaluate(LOOK)

async def age_lost():
    """A second Town Center stands; the one raising the age-up is razed: the side can start the age-up again at the other (Nov 21 review of econ.js, E2561)."""
    SET = """(() => { const h = fk.seatOf(0), col = fk.SIDES[0].col; let h2 = null; for (let r = 12; r < 40 && !h2; r++) for (let a = -r; a <= r && !h2; a += 2) h2 = fk.build(h.code, h.i + a, h.j + r, col) || fk.build(h.code, h.i + a, h.j - r, col);
  h2.done = 1; h2.hp = h2.hpMax = WAR.hpMax(h2); const up = ECON.ageUp(0), at = fk.blds().find((t) => t.side === 0 && (t.q || []).some((c) => fk.D.ages.includes(c))); window.ZAL = at; return [up, !!at, fk.SIDES[0].aging > 0]; })()"""
    RAZE = "(() => { WAR.die(ZAL, units.find((u) => u.side > 0 && fk.SIDES[u.side] && WAR.armed(u)) || null, 'razed'); return [fk.SIDES[0].aging, fk.blds().filter((t) => t.side === 0 && fk.has(t, 'Seat')).length, ECON.ageUp(0), fk.SIDES[0].aging > 0]; })()"
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 3); s = await pg.evaluate(SET); await run.step(pg, 1)
        return s, await pg.evaluate(RAZE)

async def no_phantom():
    """A villager sent to a new farm finds no path to it: the farm keeps no worker who is not there, shows as idle, and the next villager sent works it (Nov 21 review of econ.js, E222)."""
    SET = """(() => { const V = units.filter((u) => u.side === 0 && fk.has(u, 'Gather')), v = V[0], w = V[1], N = fk.N, [code] = fk.bought('Field'), k0 = fk.tileAt(v.bx, v.by), i0 = k0 % N, j0 = Math.floor(k0 / N); let f = null;
  for (let r = 8; r < 30 && !f; r++) for (let d = -r; d <= r && !f; d++) f = ECON.site(0, code, i0 + d, j0 + r) || ECON.site(0, code, i0 + d, j0 - r);
  f.done = 1; f.hp = f.hpMax; Object.assign(v, { load: 0, carry: null }); const g = fk.goBy; fk.goBy = () => false; ECON.gatherAt(v, f); fk.goBy = g; window.ZNP = { f, w }; return [v.target === f, ~~f.wk, ECON.idlePost(f)]; })()"""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 3); s = await pg.evaluate(SET); await run.step(pg, 1)
        took = await pg.evaluate("(() => { Object.assign(ZNP.w, { load: 0, carry: null }); ECON.gatherAt(ZNP.w, ZNP.f); return ZNP.w.target === ZNP.f; })()"); await run.step(pg, 2)
        return s, took, await pg.evaluate("[ZNP.w.target === ZNP.f, ~~ZNP.f.wk]")

async def courage(heart):
    """Eight foot stand 30 tiles out with courage set on the War card's Mode; sixteen enemy foot fall on them: how many broke (N565: Focused takes 3x the losses, To death never runs)."""
    SET = "(heart) => { const h = fk.seatOf(0), M = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot').slice(0, 8); for (const u of M) u.heart = heart; window.MEN = M; for (const u of units.filter((u) => u.side === 0 && ECON.soldier(u.code) && !M.includes(u))) WAR.die(u, null, 'test'); /* the eight alone: on open ground the rest of the army at home joined in and the eight won (Nov 25, the new home layout) */ WAR.order(M, null, fk.tileAt(h.bx + 300, h.by)); }"
    RAID = "(() => { const code = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot').code, N = fk.N, c = MEN.reduce((a, u) => [a[0] + u.bx / MEN.length, a[1] + u.by / MEN.length], [0, 0]), k0 = fk.tileAt(c[0] + 60, c[1]); window.RAID = []; for (let d = 0; d < 12 && RAID.length < 16; d++) for (let dx = -d; dx <= d && RAID.length < 16; dx++) for (const dy of [-d, d]) { const k = k0 + dx + dy * N; if (RAID.length < 16 && fk.walkable(k) && !units.some((u) => u.k === k)) RAID.push(fk.spawn(code, 2, k, fk.rng)); } WAR.treaty(0, 2, 'war'); RAID.forEach((e, i) => WAR.fight(e, MEN[i % MEN.length], true)); return RAID.length; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40); await pg.evaluate(SET, heart); await run.step(pg, 40); await pg.evaluate(RAID); await run.step(pg, 60)
        return await pg.evaluate("MEN.filter((u) => u.broke).length")

async def hold_fast():
    """All foot moved out, then told Hold from the War card; twenty enemy foot are set beside them: a minute on, how far any held man moved and how many broke (N565: Hold is die in place)."""
    TAP = "(v) => [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click()"
    OUT = "() => { const h = fk.seatOf(0), M = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot'); window.MEN = M; WAR.order(M, null, fk.tileAt(h.bx + 300, h.by)); }"
    RAID = "(() => { window.AT = new Map(MEN.map((u) => [u, [u.bx, u.by]])); const code = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot').code, N = fk.N, c = MEN.reduce((a, u) => [a[0] + u.bx / MEN.length, a[1] + u.by / MEN.length], [0, 0]), k0 = fk.tileAt(c[0] + 50, c[1]); window.RAID = []; for (let d = 0; d < 12 && RAID.length < 20; d++) for (let dx = -d; dx <= d && RAID.length < 20; dx++) for (const dy of [-d, d]) { const k = k0 + dx + dy * N; if (RAID.length < 20 && fk.walkable(k) && !units.some((u) => u.k === k)) RAID.push(fk.spawn(code, 2, k, fk.rng)); } WAR.treaty(0, 2, 'war'); return MEN.filter((u) => u.stand).length; })()"
    LOOK = "(() => { const A = MEN.filter((u) => units.includes(u) && u.hp > 0); return [+Math.max(0, ...A.map((u) => Math.hypot(u.bx - AT.get(u)[0], u.by - AT.get(u)[1]) / fk.D.tile)).toFixed(1), MEN.filter((u) => u.broke).length, A.length]; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40); await pg.evaluate(OUT); await run.step(pg, 60)
        for v in ('war||', 'mwho|Foot|', 'mhold||'): await pg.evaluate(TAP, v)
        await run.step(pg, 3); n = await pg.evaluate(RAID); await run.step(pg, 60)
        return n, await pg.evaluate(LOOK)

async def hold_pause():
    """Hold and Pause (Albert, Nov 25): held foot are moved and must still hold on arrival, then are sent at a foe far out of reach and Hold must be off; archers are paused, six enemy foot are set seven tiles off: the archers take no target until one of them is hit."""
    FOES = "(n) => { const A = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Archers'), code = units.find((u) => u.side === 2 && fk.SH[u.code].class === 'Foot').code, N = fk.N, c = A.reduce((a, u) => [a[0] + u.bx / A.length, a[1] + u.by / A.length], [0, 0]), k0 = fk.tileAt(c[0] + n * fk.D.tile, c[1]); window.ARC = A; window.FOES = []; for (let d = 0; d < 12 && FOES.length < 6; d++) for (let dx = -d; dx <= d && FOES.length < 6; dx++) for (const dy of [-d, d]) { const k = k0 + dx + dy * N; if (FOES.length < 6 && fk.walkable(k) && !units.some((u) => u.k === k)) FOES.push(fk.spawn(code, 2, k, fk.rng)); } for (const u of A) u.mute = true; WAR.treaty(0, 2, 'war'); FOES.forEach((e, i) => WAR.fight(e, A[i % A.length], true)); }"
    SEEN = "(() => [ARC.filter((u) => u.target).length, ARC.some((u) => u.mute) && ARC.every((u) => u.mute || u.hp <= 0), FOES.filter((e) => e.hp < e.hpMax || e.hp <= 0).length])()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40)
        a = await pg.evaluate("(() => { const h = fk.seatOf(0), M = units.filter((u) => u.side === 0 && fk.SH[u.code].class === 'Foot'); window.MEN = M; for (const u of M) u.stand = true; WAR.order(M, null, fk.tileAt(h.bx + 300, h.by)); return MEN.every((u) => u.stand); })()")
        await run.step(pg, 60)
        b = await pg.evaluate("MEN.every((u) => u.stand && u.job === 'hold')")
        c = await pg.evaluate("(() => { const f = units.find((u) => u.side === 2 && fk.SH[u.code].class); WAR.treaty(0, 2, 'war'); WAR.order(MEN, f, null); const on = MEN.some((u) => u.stand); WAR.homeAll(MEN); WAR.treaty(0, 2, 'peace'); return on; })()")
        await pg.evaluate(FOES, 7); await run.step(pg, 1); early = (await pg.evaluate(SEEN))[:2]
        await run.step(pg, 39); late = await pg.evaluate(SEEN)
        return [a, b, c], [early, [late[0], await pg.evaluate("ARC.some((u) => u.mute)"), late[2]]]

async def modes():
    """The War card's tall row and which boxes are lit after each tap (Attack, To Death, Move, Hold, Stop, the four types picked); Specialty set on the whole army, then a move: where each class stands, [forward, right] in tiles from the spot (N565)."""
    TAP = "(v) => { [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v).click(); return [...document.querySelectorAll('#base .mt .cell')].filter((b) => b.classList.contains('lit')).map((b) => b.textContent.trim()); }"
    GO = "() => { const h = fk.seatOf(0), A = units.filter((u) => u.side === 0 && fk.SH[u.code].class); window.ARMY = A; window.GOAL = fk.tileAt(h.bx, h.by - 300); WAR.order(A, null, GOAL); }"
    LOOK = "(() => { const [gx, gy] = fk.tileMid(GOAL), f = [ARMY[0].fx, ARMY[0].fy], by = {}; for (const u of ARMY) { const dx = (u.bx - gx) / fk.D.tile, dy = (u.by - gy) / fk.D.tile; (by[fk.SH[u.code].class] ||= []).push([dx * f[0] + dy * f[1], -dx * f[1] + dy * f[0]]); } const m = (L, i) => L.reduce((a, p) => a + p[i], 0) / L.length; return Object.fromEntries(Object.entries(by).map(([c, L]) => [c, [+m(L, 0).toFixed(1), +m(L, 1).toFixed(1)]])); })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 40)
        for v in ('war||', 'mwho|Foot|', 'mwho|Archers|', 'mwho|Riders|', 'mwho|Engines|'): await pg.evaluate(TAP, v)
        a = await pg.evaluate(TAP, 'mord|attack|'); b = await pg.evaluate(TAP, 'mmode|heart|death|'); c = b; d = await pg.evaluate(TAP, 'mhold||'); e = await pg.evaluate(TAP, 'mpause||')
        for v in ('mhold||', 'mpause||'): await pg.evaluate(TAP, v)
        await pg.evaluate("MENU.act('mmode', 'form', 'specialty')")  # formations have no button until the formation page is placed (Nov 26): the switch is called straight
        await pg.evaluate(GO); await run.step(pg, 90)
        return [a, b, c, d, e], await pg.evaluate(LOOK)

async def big_move():
    """Fifty more soldiers made, then all 74 moved 85 tiles at once: the order must count as arrived within two minutes (N566: his orders at T27 and U25 never did)."""
    GROW = "(n) => { const h = fk.seatOf(0), N = fk.N, codes = [...new Set(units.filter((u) => u.side === 0 && fk.SH[u.code].class).map((u) => u.code))], k0 = fk.tileAt(h.bx + 150, h.by + 150); let m = 0; for (let d = 0; d < 30 && m < n; d++) for (let dx = -d; dx <= d && m < n; dx++) for (const dy of [-d, d]) { const k = k0 + dx + dy * N; if (m < n && fk.walkable(k) && !units.some((u) => u.k === k)) { fk.spawn(codes[m % codes.length], 0, k, fk.rng); m++; } } return m; }"
    GO = "() => { const h = fk.seatOf(0), A = units.filter((u) => u.side === 0 && fk.SH[u.code].class); window.ARMY = A; window.ZO = WAR.order(A, null, fk.tileAt(h.bx + 60, h.by - 60)); return A.length; }"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 20); await pg.evaluate(GROW, 50); await run.step(pg, 5); n = await pg.evaluate(GO); await run.step(pg, 120)
        return n, await pg.evaluate("[!!ZO.arrived, ARMY.filter((u) => u.hp > 0 && u.job === 'march').length]")

async def steward():
    """A Store's Steward tab (N569): its six tiles; set to Idle & new, six idle villagers are sent to work; set to All workers with a wood-heavy mix, workers move to wood."""
    TAP = "(v) => { const b = [...document.querySelectorAll('[data-v]')].find((b) => b.dataset.v === v); if (!b) return null; b.click(); return [...document.querySelectorAll('#base .mt .cell')].map((b) => b.textContent.trim()); }"
    STORE = "(() => { const h = fk.seatOf(0), N = fk.N, k0 = fk.tileAt(h.bx, h.by); let t = null; for (let r = 7; r < 30 && !t; r++) for (let dd = -r; dd <= r && !t; dd++) for (const [i, j] of [[k0 % N + dd, Math.floor(k0 / N) - r], [k0 % N + dd, Math.floor(k0 / N) + r]]) if (!t && ECON.canPlace('BI4', i, j)) { t = fk.build('BI4', i, j, fk.SIDES[0].col); t.done = 1; t.hp = t.hpMax = fk.stat('BI4', 0, 'hp'); } if (fk.paused()) fk.pause(false); MENU.S.tab = null; MENU.S.subject = t; MENU.render(true); return !!t; })()"
    async with run.game(SEED, test=True) as pg:
        await pg.evaluate(CALM); await run.step(pg, 10); await pg.evaluate(STORE); await pg.evaluate(TAP, 'ctab|Steward|'); t = await pg.evaluate(TAP, 'stew||')
        await pg.evaluate("units.filter((u) => u.side === 0 && fk.has(u, 'Gather')).forEach((u) => { u.job = 'idle'; u.target = null; u.path = null; u.then = null; })"); await run.step(pg, 8)
        idle = await pg.evaluate("ECON.stewNow(0).n.idle"); await pg.evaluate(TAP, 'stew||'); await pg.evaluate("ECON.stewOf(0).mix = { food: 1, wood: 5, gold: 0, stone: 0, iron: 0 }"); await run.step(pg, 20)
        return t, idle, await pg.evaluate("ECON.stewNow(0).n")

async def batch_ab():
    """Nov 24 builds: Wide takes half from an arrow, Line all of it; a computer short of a yield takes a hand from the yield it has most of; the people cell reads people over room; the villager card has Build and its tiles say how many work each job."""
    async with run.game(SEED, test=True) as pg:
        await run.step(pg, 5)
        a = await pg.evaluate("""(() => { const A = fk.units().filter((u) => u.side === 0 && ECON.soldier(u.code)), arch = A.find((u) => WAR.ranged(u)), foot = A.find((u) => !WAR.ranged(u)); foot.form = 'line'; const line = WAR.damage(arch, foot); foot.form = 'wide'; const vk = WAR.shapeOf(foot) === D.forms.wide, wide = WAR.damage(arch, foot); foot.form = 'line';
          const s = 2, V = ECON.villagersOf(s), S = FK.SIDES[s]; for (const v of V) { const f = ECON.bestFind(v, 'iron') || ECON.bestFind(v, 'gold'); if (f) ECON.gatherAt(v, f); v.load = 0; } Object.assign(S.store, { food: 5000, wood: 0, stone: 5000, gold: 400, iron: 9000 }); const was = V.filter((v) => ECON.jobOf(v) === 'iron').length;
          return { line, wide, vk, was }; })()""")
        await run.step(pg, 90)
        b = await pg.evaluate("""(() => { const V = ECON.villagersOf(2), J = {}; for (const v of V) { const j = ECON.jobOf(v) || v.job; J[j] = (J[j] || 0) + 1; } const cell = [...document.querySelectorAll('.strip .cell')].map((c) => c.textContent.trim()).find((t) => /^[0-9]+[/][0-9]+$/.test(t)) || null;
          FK.select(fk.units().find((u) => u.side === 0 && fk.has(u, 'Gather'))); MENU.render(true); const card = [...document.querySelectorAll('#base [data-v]')].map((x) => x.dataset.v), tile = [...document.querySelectorAll('#base .cell')].map((c) => c.textContent.trim()).find((t) => /Food/.test(t)) || '';
          return { jobs: J, cell, build: card.includes('mtab|Build|'), tile }; })()""")
        return a, b

async def fish_and_walls():
    """Nov 24: villagers sent to fish with no Dock lay one and fish; a wall piece may stand on a bank and in wading water, not in deep water."""
    async with run.game(SEED) as pg:
        await run.step(pg, 2)
        w = await pg.evaluate("""(() => { const N = FK.N, H = FK.H, h = FK.seatOf(0), i0 = Math.floor(h.bx / D.tile), j0 = Math.floor(h.by / D.tile); let bank = null, shallow = null, deep = null;
          for (let r = 1; r < 80 && !(bank && shallow && deep); r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const i = i0 + dx, j = j0 + dy, k = j * N + i; if (FK.OCC[k] || FK.FOR[k]) continue; if (!bank && H[k] > 0 && H[k] < D.land) bank = [i, j]; if (!shallow && H[k] <= 0 && H[k] > -D.wade / 2) shallow = [i, j]; if (!deep && H[k] < -D.wade) deep = [i, j]; }
          const fish = fk.things().filter((f) => fk.has(f, 'Catch')).sort((a, b) => fk.dist(a, h) - fk.dist(b, h))[0], V = ECON.villagersOf(0).slice(0, 2); window.FV = V; window.F0 = FK.SIDES[0].store.food; const sent = V.map((u) => ECON.gatherAt(u, fish));
          return [[bank, shallow, deep].map((p) => !!p && ECON.canPlace('BW1', p[0], p[1], 0)), sent]; })()""")
        await run.step(pg, 90)
        f = await pg.evaluate("[FV.filter((u) => u.target && u.target.code === 'BCT2' && u.job === 'gather').length, fk.blds().filter((b) => b.side === 0 && b.code === 'BCT2' && b.done >= 1).length]")
        return w, f

async def dead_research():
    """Nov 25: the research that did nothing: Chimney's warmth, Law code and Magistrates, Local guides and Midwives each move a share the game reads; with Midwives two villagers at the head of a line train together."""
    async with run.game(SEED) as pg:
        await run.step(pg, 2)
        a = await pg.evaluate("""(() => { const st = (k, c = '') => FK.stat(c, 0, k), was = [st('warm'), st('push'), st('guides'), st('twin', 'UV')]; for (const c of ['O47', 'O163', 'O164', 'O260', 'O42']) { FK.SIDES[0].techs.add(c); FK.learn(0, c); } FK.SIDES[0].store.food = 9999; for (const u of ECON.villagersOf(0).slice(4)) WAR.die(u, null, 'test'); const tc = fk.seatOf(0); tc.q = []; ECON.queue(tc, 'UV'); ECON.queue(tc, 'UV'); window.ZTC = tc; window.ZN0 = ECON.villagersOf(0).length; return [was, [st('warm'), st('push'), st('guides'), st('twin', 'UV')], tc.qt]; })()""")
        await run.step(pg, a[2] + 2)
        return a, await pg.evaluate("ECON.villagersOf(0).length - ZN0")

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
    fa, ab, moved, apart, most, walking = await orders()
    rule('two groups keep their own orders: each ends at its own spot, and every soldier never picked ends where he stood (the worst one under 1 tile; he may give way while a group passes)', max(fa, ab) < apart / 2 and moved < 1 and not walking, f'foot {fa:.1f} tiles from its spot, archers {ab:.1f} from theirs, the spots {apart:.1f} apart; of those never picked the worst ended {moved:.1f} tiles off, the farthest any gave way {most:.1f}')
    held, after = await stands()
    rule('a wall stands until the next order: the picked foot hold it two minutes on, the archers never picked do not, a move drops it', held[0] > 0 and held[1] == 0 and after[0] == 0, f'{held[0]} foot in the wall after two minutes, {held[1]} archers; {after[0]} after a move')
    far, idle, gone = await chase()
    rule('soldiers told to attack a foe who walks out of sight keep going to where he was last seen', idle == 0 and gone > 20, f'the foe {far:.0f} tiles off; a minute on, {idle} archers idle, the first {gone:.0f} tiles from where he started')
    won, lost = await tower(10), await tower(6)
    rule('a band winning against the building it was sent at stays and brings it down', won['tower'] == 0 and won['alive'] > 0, f"ten foot at a tower: the tower at {won['tower']}, {won['alive']} alive")
    rule('a band that breaks does not walk back into the building one at a time', lost['tower'] > 0 and lost['ever'] > 0 and lost['onIt'] == 0 and lost['near'] == 0, f"six foot at a tower: the tower at {lost['tower']}, {lost['alive']} alive, {lost['ever']} of them broke at some time (counted as it happens since Nov 25: on open ground the broken are shot as they run), {lost['onIt']} back on it, {lost['near']} within 15 tiles")
    foot, bow = await defends()
    rule('Defend sends the picked soldiers at whoever is attacking the town, and nobody else', foot > 0 and bow == 0, f'{foot} foot on the raiders five seconds on, {bow} archers')
    pe = await picks_end()
    rule('every order ends the pick: a War move, villagers sent to a bush; Retreat, a switch since Nov 26, keeps it', pe[:5] == [0, 8, 0, 10, 10] and pe[5][0] == 3 and pe[5][1] == 0 and pe[5][2] > 0, f'picked after each tap (War, Archers, a move, Foot, Retreat), villagers [before, after, went]: {pe}')
    rg = await rings()
    rule('an order at a foe draws no ring where the foe stood; a move keeps its ring', rg == [False, True], f'live orders, marked foe: {rg}')
    tk, tp = await told()
    rule('villagers keep to the find they were sent to, and a worker at a farm stays when raiders come', tk[0] == tk[1] and tp == [True, False], f'on the told bush after two minutes: {tk[0]} of {tk[1]}; farm worker still at the farm, ran: {tp}')
    gf, gh = await gaps()
    rule('fields may touch each other, a house keeps one tile from a house and two from the rest', gf == {'farmFarm0': True, 'farmMint0': True, 'farmHouse0': False, 'farmHouse2': True} and gh == {'house0': False, 'house1': True, 'barracks1': False, 'barracks2': True}, f'may stand there: {gf}, {gh}')
    mk, me = await marks()
    rule('your workplaces show who works them: the board draws the flags, glow and idle marks with no error', mk == [True, False, True, False, True, True] and not me, f'worked (farm, quarry, mint, foundry, pasture, tree farm): {mk}; errors: {me[:2]}')
    le, ll = await logs()
    rule('the copy log says how a band order ended and what killed anyone with no killer', bool(le) and le.get('foe dead') and le.get('new order') and ll.get('villagers: removed by you') == 1, f'last order ended: {le}; your losses: {ll}')
    h0, h1 = await home()
    rule('a villager whose find runs out goes idle, and a minute idle walks home to the town center', h0[0] == 'idle' and h1[0] == 'idle' and h1[1] < h0[1] - 20, f'job and tiles from the town center, just after and 100 s on: {h0}, {h1}')
    st = await site_taps()
    rule('a tap on your own site only picks it: two taps leave it standing with its card open, no trash by the finger, no "undefined"', st == [True, True, 0, False], f'stands, card open, trash pops, undefined shown: {st}')
    pg_, pk, pn, pm, pu = await patched()
    rule('every word floating over the map has its dark patch at the book strength, and a redrawn card keeps them in place; a box that carries its own shade has no patch under it', len(pg_) >= 1 and pn >= 3 and all(abs(o - pm) < 0.01 for _, _, o in pg_) and pk and pu[0] >= 10 and pu[1] == 0, f'{len(pg_)} patches under the Town Center card\'s {pn} words, strengths {sorted({o for _, _, o in pg_})}, same after a redraw: {pk}; War card: {pu[0]} shaded boxes, {pu[1]} with a patch under')
    pr, pl = await pressed()
    rule('a tapped button is pressed when the finger lands and let go after; a tap that redraws it still shows the press; nothing stays pressed', pr == [True, True, True] and pl == 0, f'pressed on landing, redrawn, pressed again: {pr}; still pressed after: {pl}')
    fw = await farway()
    rule('a band ordered at a town centre far round a forest finds the way (his Timberland map, D28 to D4)', fw[0] == 'D4' and len(fw[1]) == 6 and min(fw[1]) > 250,  # 392 steps before the home water moved (Nov 25), 288 since: still the long way round
         f'to {fw[0]}: steps on each soldier\'s way {fw[1]}')
    fb, fd, fp, fm, ff, ft, fc = await front_line()
    rule('a tap on one man of a group coming on: nobody goes for the man tapped at the back, every soldier fights a man of its front, never one deeper unless that man is striking him, none of ours past their front, and a minute on we have lost fewer than they have (its own promise, never checked until Nov 23); a group gone back into its own town is let go', fb == 0 and fd == 0 and fc == 0 and fp == 0 and fm < ff, f'on the man tapped: {fb}; most on a man deeper than the front: {fd}; most of ours past their front: {fp}; a minute on, lost {fm} of 20, they lost {ff} of 20' + f'; {ft} of theirs put back in their town, {fc} of ours still on them 3 s later')
    sm = await struck_on_march()
    rule('a group moved past archers who shoot it kills them and goes on to its spot', sm[1] == 5 and sm[2] >= 1, f'of ours left, archers down of 5, ours at the spot: {sm}')
    rc = await rush()
    rule('foot sent at archers run in under the arrows and get within 3 tiles of them', rc < 3, f'closest any came: {rc:.1f} tiles')
    et, ef, eo, eb, ea = await elephant()
    rule('the war elephant: its blow tramples more than the one man it strikes, enemy foot near it lose nerve, arrows shake it, and gone amok it tramples its own', et >= 2 and ef < 1 and eo >= 1 and eb[0] > 0, f'enemy foot hurt in 8 s: {et} of 8; their least nerve: {ef:.2f}; own foot hurt by the amok one: {eo}; nerve lost to ten arrows, bare and armoured: {eb[0]:.2f}, {ea[0]:.2f}')
    ab0, ab1 = await batch_ab()
    rule('Wide takes half of an arrow that Line takes whole (Albert\'s Nov 21 Wide, derived from its spacing)', ab0['vk'] and abs(ab0['wide'] - ab0['line'] * 0.5) < 1e-6 and ab0['line'] > 0, f'line {ab0["line"]:.2f}, wide {ab0["wide"]:.2f}')
    rule('a computer with no wood and 9,000 iron takes hands off iron for wood within a minute and a half', ab1['jobs'].get('wood', 0) > 0 and ab1['jobs'].get('iron', 0) < ab0['was'], f'on iron at the start {ab0["was"]}, after: {ab1["jobs"]}')
    rule('the people cell reads people over room before the cap (Albert, Nov 24: caps showing)', ab1['cell'] is not None, f'cell: {ab1["cell"]}')
    rule('the villager card has Build, and its job tile says how many work that job', ab1['build'] and 'working' in ab1['tile'], f'Build: {ab1["build"]}; tile: {ab1["tile"]!r}')
    fw0, fw1 = await fish_and_walls()
    rule('fishing with no Dock: the villagers lay Docks by the water and fish there (Albert, Nov 24: no way to fish)', fw0[1] == [True, True] and fw1[0] == 2 and fw1[1] >= 1, f'sent {fw0[1]}; fishing at a Dock, Docks standing: {fw1}')
    rule('a wall piece stands on a bank and in wading water, never in deep water, so a wall can run to the water with no gap (Albert, Nov 24)', fw0[0] == [True, True, False], f'bank, wading, deep: {fw0[0]}')
    dr, dn = await dead_research()
    rule('the research that did nothing now moves what the game reads: warmth, push, guides, twin; with Midwives two villagers train in the time of one', dr[0] == [0, 1, 1, 0] and dr[1][0] > 0 and dr[1][1] < 1 and dr[1][2] < 1 and dr[1][3] > 0 and dn == 2, f'before {dr[0]}, after {dr[1]}; villagers out after one training time: {dn}')
    nw = await no_way()
    rule('a wave leaves only on a whole route to its mark, and turns home at once when it stands with no way on', nw['sea'] and nw['none'] == 0 and nw['noWave'] and nw['went'] > 0 and nw['kept'] and nw['home'] and nw['cool'], str(nw))
    sp, sq = await spoils()
    rule('a side\'s last Town Center falls: the felling side takes the whole store, the fallen keep what every side starts with and fight on; with its last villager dead it is beaten and its soldiers fight on (Albert, Nov 24)', all(sp[0]) and all(sp[1]) and not sp[2] and sp[3] > 0 and sq[0] and sq[1] > 0, f'conqueror got all: {sp[0]}; fallen keep the start: {sp[1]}; beaten at the seat: {sp[2]}; units standing: {sp[3]}; beaten with no villagers, soldiers left: {sq}')
    fl, fe = await full_lines()
    rule('a Train tap on a full line goes to the least busy barracks with room, says so in a note, and is refused only when every line is full', fl[1:5] == [fl[0], True, fl[0], 1] and fl[5] == fl[11] and fl[6:11] == [fl[0], False, fl[0], fl[0], 1] and not fe, f'line size, first filled, tap taken, the two lines, the note, second filled, last tap taken, the two lines, refused: {fl}; errors: {fe[:2]}')
    ti = await thin_ice()
    rule('thin ice: no soldier of any side gets a way onto ice too thin to bear him at the safe load, none drowns, the ice stays whole; ice that bears yours lets the computer\'s on as well, one set of rules for every side (Albert, Nov 24)', ti is not None and ti[0] == [False] * 4 and ti[1] == [0, 0] and ti[2] == [True, True] and not ti[3], f'ways {ti and ti[0]}, drowned and holes {ti and ti[1]}, bears (yours, computer) {ti and ti[2]}, errors {ti and ti[3]}')
    ac, ae = await alarmed()
    rule('the alarm leaves nobody idle in the open: every building with room fills, the rest gather beside the town center', ac['n'] >= 40 and ac['open'] == 0 and ac['other'] == 0 and ac['inside'] == min(ac['room'], ac['n']) and not ae, f'{ac}, errors {ae}')
    ws, w0, w1 = await walled()
    rule('a soldier with no way to its foe strikes the enemy wall or gate in the way, and goes back to the foe once a piece falls (D400)', ws and w0['onWall'] > 0 and w1['stand'] < w1['of'] and (w1['onHouse'] > 0 or w1['house'] < 100), f'ring shut: {ws}; at 20 s on a wall {w0["onWall"]}, on the house {w0["onHouse"]}; at 160 s wall pieces standing {w1["stand"]} of {w1["of"]}, on the house {w1["onHouse"]}, house left {w1["house"]}%')
    uq = await unqueued()
    rule('taking the first item out of a queue restarts the clock: Back on a Town Center queue of a villager then an age leaves the age-up its whole time, not a free age', uq[0] == [2, True] and uq[1][:2] == [0, 1] and uq[1][2] >= uq[1][3] - 2, f'queue and age-up taken: {uq[0]}; ages gained, queue left, seconds left, its whole time: {uq[1]}')
    cs, cc = await camp_crew()
    rule('a camp piece raised by soldiers alone rises at their hands, as a villager\'s would: its crew does not grow step on step', cs[1] and cc[0] <= 1 and cc[3:] == [1, 0, 'raise'] and abs(cc[1] - cc[2]) <= cc[2] * 0.02, f'piece {cs[0]} tiles from the other soldiers, one beside it: {cs[1]}; crew, risen in 10 s, one soldier\'s 10 s, soldiers on it, villagers on it, his job: {cc}')
    al, ar = await age_lost()
    rule('a side whose Town Center falls while raising the age, with another standing, can start the age-up again at the other', al == [True, True, True] and ar[0] == 0 and ar[1] >= 1 and ar[2:] == [True, True], f'second Town Center, age-up taken and running: {al}; after the raze: aging, Town Centers left, age-up taken again, running: {ar}')
    ns, nt, nw = await no_phantom()
    rule('a villager with no path to a farm leaves no one counted on it: it shows idle and the next villager sent works it', ns == [False, 0, True] and nt and nw == [True, 1], f'on it, counted, idle after the failed walk: {ns}; the next taken: {nt}; on it and counted two seconds on: {nw}')
    tr, tw, tn = await troops()
    rule('troop boxes (Albert, Nov 26): War opens with nobody picked; a type picks its own, minus trims one and the trim survives adding a type; a lit box tapped again puts its soldiers down, the last one out leaves nobody; New picks every soldier never ordered and a second tap lets them go', tr == [0, 4, 3, 13, 3, 0, 24, 0], f'picked after each tap (War, Cav, minus, Foot, Foot, Cav, New, New): {tr}')
    rule('the troop boxes say how many each would pick, and picked/there on a trimmed type', tw[0] == ['New 24', 'Foot 10', 'Archers 8', 'Cavalry 4', 'Siege 2'] and tw[1][3] == 'Cavalry 3/4', f'as War opens: {tw[0]}; after the trim: {tw[1]}')
    rule('New is the soldiers never given an order: eight archers put on Hold leave it, and New then picks the other sixteen', tn == [8, 8, 'New 16', 16, 0], f'archers picked, still picked after Hold, the New box, picked by New, archers among them: {tn}')
    W7 = ['Attack', 'Move', 'Hold', 'To Death', 'Defend', 'Stop', 'Retreat']
    mr, ma = await missions()
    rule('the War card reads Attack, Move, Hold, then the pad To Death, Defend, Stop, Retreat; nothing is armed as it opens and every box is dim with nobody picked (Albert, Nov 26)', mr == [w + '~' for w in W7], f'row: {mr}')
    rule('with nobody picked, Retreat does nothing (Albert, Nov 22: it sent the whole army), and Move does nothing and stays unlit', ma == (0, 0, 0, [w + '~' for w in W7]), f'picked after Retreat, soldiers walking home, picked after Move, the row: {ma}')
    rt, rm, rw, re_ = await retreats()
    ra, rb, rc, rd, re2, rf = rt
    rule('Retreat is a switch (Albert, Nov 26): on, the picked foot walk home, the box lit, Hold off and the pick kept; tapped again they stop where they stand, unlit and not on Hold; on again and left alone they are home and the light is out',
         (ra['hold'], ra['lit']) == (10, False) and (rb['picked'], rb['home'], rb['hold'], rb['lit']) == (10, 10, 0, True) and rc['far'] < rb['far'] - 1 and (rd['picked'], rd['home'], rd['hold'], rd['lit'], rd['jobs']) == (10, 0, 0, False, rw) and rm < 1.5 and re2['home'] == 0
         and (rf['home'], rf['lit'], rf['hold'], rf['jobs']) == (0, False, 0, 'idle') and rf['far'] < rb['far'] - 10 and not re_,
         f'after a move that arrived their state is {rw}; on Hold: {ra}; Retreat on: {rb}; 6 s on: {rc}; tapped again: {rd}; farthest moved in the next 20 s: {rm} tiles; on again, 2 min on: {rf}; errors {re_}')
    ct = await controls()
    rule('picking on the map (N582): a tap on a soldier picks him and opens War, a tap on another adds him and the card shows both (picked/there), a tap on one already picked drops him', ct['pick'] == [1, True, 2, 'Foot 1/10*', 'Archers 1/8*', 1], f"{ct['pick']}")
    rule('with soldiers picked a tap on the map is the order, no button: on ground they march there, on an enemy they are sent at it; the pick ends', ct['move'] == [0, 10] and ct['attack'][0] == 0 and ct['attack'][1] == ct['attack'][2] > 0, f"ground: picked after, marching {ct['move']}; enemy: picked after, sent at him, cavalry {ct['attack']}")
    rule('with nobody picked a tap on an enemy primes it and opens War with no card; soldiers picked, Attack fires at it, the target is dropped and the pick ends', ct['prime'][0] == [True, True, True] and ct['prime'][1:3] == [0, False] and ct['prime'][3] == ct['prime'][4] > 0, f"War open, primed, no card: {ct['prime'][0]}; after Attack: picked, still primed, archers sent at him, archers {ct['prime'][1:]}")
    rule('open ground primes only while War is open, and a second tap on it lets it go; Move with no target does nothing and keeps the pick; with War closed a tap on open ground does nothing', ct['ground'] == [True, False, [10, True], False, False], f"primed, after a second tap, [picked, nobody moved] after Move with no target, War closed: primed, War open: {ct['ground']}")
    rule('a tap on your own building is never a troop order: the held foot stay, the pick is let go, War closes and the building\'s card opens', ct['own'] == [0, True, False, True], f"picked, card open, War open, nobody moved: {ct['own']}")
    rule('the box starts after a quarter-second hold and takes soldiers only when it holds any', ct['box'][:4] == [True, True, False, True] and ct['box'][4] == 250 and not ct['errors'], f"picked some, all soldiers, the villager in it, War open, hold ms: {ct['box']}; errors {ct['errors']}")
    sk, sl, se = await seeks()
    rule('soldiers sent at an enemy unit by a tap seek him while he walks away (Albert, Nov 26)', sk == [0, 4] and sl[0] < 3 and sl[1] > 0 and sl[2] > 0 and not se, f'picked after the tap and cavalry sent at him: {sk}; 36 s on, nearest in tiles, on him, his hurt: {sl}; errors {se}')
    cn, cf, cd = await courage('normal'), await courage('focused'), await courage('death')
    rule('courage on the War card: eight foot set upon by sixteen; Normal ones break, Focused hold three times the losses, To death never run', cn > 0 and cf < cn and cd == 0, f'broke after a minute: Normal {cn}, Focused {cf}, To death {cd}')
    hn, hl = await hold_fast()
    rule('Hold is die in place: the held foot neither move from their spot nor break with twenty foes on them', hn > 0 and hl[0] < 1.5 and hl[1] == 0, f'{hn} held; a minute on, the farthest moved {hl[0]} tiles, {hl[1]} broke, {hl[2]} alive')
    mt, ml = await modes()
    rule('the War card lights the whole box of a switch that is on, To Death, Hold and Stop for the picked group; Attack never stays lit (it fires, it does not arm)', [mt[0], mt[1], mt[3], mt[4]] == [[], ['To Death'], ['Hold', 'To Death'], ['Hold', 'To Death', 'Stop']], f'lit after Attack with no target, To Death, Hold, Stop: {[mt[0], mt[1], mt[3], mt[4]]}')
    hp = await hold_pause()
    rule('Hold survives a Move and ends on an Attack out of reach; paused archers take no target with foes in range, and being hit ends the pause', hp[0] == [True, True, False] and hp[1][0] == [0, True] and hp[1][1][1] is False and hp[1][1][2] > 0, f'held after the order, held on arrival, held after an attack out of reach: {hp[0]}; paused archers with a target and all still paused at 1 s: {hp[1][0]}; at 40 s targets, any paused, foes hurt or dead: {hp[1][1]}')
    rule('Specialty: foot in front, archers behind them, siege at the back, cavalry off the right flank', ml['Archers'][0] < ml['Foot'][0] - 2 and ml['Engines'][0] < ml['Archers'][0] and ml['Riders'][1] > ml['Foot'][1] + 3, f'[forward, right] tiles: {ml}')
    bn, ba = await big_move()
    rule('a big army moved at once arrives: no soldier walks in place short of his spot', ba == [True, 0], f'{bn} soldiers; two minutes on, arrived and still marching: {ba}')
    st, si, sn = await steward()
    rule('the Store\'s Steward (Albert, Nov 23): six tiles, Idle & new sends idle villagers to work, All workers moves workers to match the mix', st is not None and len(st) == 6 and st[0].startswith('Steward') and si == 0 and sn['wood'] > sn['food'], f'tiles {st}; idle after {si}; at work {sn}')
    fb = await falls()
    rule('Fall back: the picked foot walk away from a nearby enemy group, re-form, then go back in at the enemies they left', fb[0][1] > 0 and max(g for g, _, _ in fb) > fb[0][0] + 2 and fb[-1][1] == 0 and fb[-1][2] > 0, f'gap in tiles, falling back, fighting those left, every 2 s: {[(round(g, 1), a, b) for g, a, b in fb]}')
    kept = json.loads(KEPT.read_text()) if KEPT.exists() else {}
    d = await deep() if '--deep' in sys.argv else None
    if '--accept' in sys.argv or not kept:
        KEPT.write_text(json.dumps({'seed': SEED, 'minutes': MINUTES, 'match': a, 'deep': d or kept.get('deep')}) + '\n'); print(f'note  match {a} kept' + (f', deep {d}' if d else ''))
        return
    same = a == kept['match'] and (d is None or d == kept.get('deep'))
    detail = f"{a} against kept {kept['match']}" + (f"; deep {d} against {kept.get('deep')}" if d else '')
    if '--same-play' in sys.argv: rule('plays exactly as the kept match' + ('es' if d else ''), same, detail)
    else: print('note  ' + ('plays exactly as kept' if same else 'plays differently from kept: ' + detail))

check_rules()
check_books()
asyncio.run(check_game())
print('\nPASS' if not fails else f'\nFAIL: {len(fails)} rule(s)')
sys.exit(1 if fails else 0)
