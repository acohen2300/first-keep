# The check: run before every preview. It prints one line per rule and PASS or FAIL at the end.
#   python3 tools/check.py              books, then the game
#   python3 tools/check.py --same-play  also fail if the match plays differently from the kept one (for builds that must not change play)
#   python3 tools/check.py --accept     keep this build's match as the new one to compare against (for builds meant to change play)
#   python3 tools/check.py --deep       also replay three longer matches (other peoples, scenarios, every hazard); slow, for builds that touch much
import asyncio, json, pathlib, re, sys
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
