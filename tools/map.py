# The function map: which functions run, in which game and when, and which never do.
#   python3 tools/map.py OUT.json
# Game to code: a grid of matches the computers play out, then a walk through every button with full stores.
# Code to game: every function, where it first ran, and the comment that says what it is for.
import asyncio, json, pathlib, re, sys
import run
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAMES = [  # (name, seed, labels tapped on the new-game screen, game minutes)
    ('Normal, Roman, 15 min', 11, [], 20),
    ('Easy, Han, 30 min, Siege', 12, ['Easy', 'Han', '30 min', 'Siege'], 30),
    ('Hard, Persian, Conquest, Silk Road, every hazard', 13, ['Hard', 'Persian', 'Conquest', 'Silk Road', 'Hardest', 'Famine', 'Weather', 'Drought', 'Outlaws', 'Plague'], 60),
    ('Normal, Mongol, Conquest, Last Keep, no fog, no allies', 14, ['Mongol', 'Conquest', 'Last Keep', 'War Fog', 'Allies'], 45),
    ('Hard, Maurya, Conquest, random hazards', 15, ['Hard', 'Maurya', 'Conquest', 'Random'], 60),
    ('Normal, Mali, Daily', 16, ['Mali', 'Daily'], 20),
]
MARKS = [1, 5, 10, 20, 30, 45, 60, 90]
STALL = 90   # seconds of computer time one game minute may take before the match is called stalled
first = {}   # function → where it first ran
sizes = {}
def note(cov, where):
    for k, n in cov.items():
        sizes[k] = k[2] - k[1]
        if n and k not in first: first[k] = where

async def play(name, seed, setup, minutes):
    async with run.game(seed, setup=setup, cover=True) as pg:
        note(await run.covered(pg), f'{name} · loading')
        t = 0; slow = None
        for m in [x for x in MARKS if x <= minutes]:
            try:
                while t < m * 60:
                    await asyncio.wait_for(run.step(pg, 60), STALL); t += 60
                    await asyncio.wait_for(pg.evaluate('draw()'), STALL)
            except asyncio.TimeoutError:
                slow = f'one game minute took over {STALL} s of computer time after minute {t // 60}'; break
            note(await run.covered(pg), f'{name} · by minute {m}')
            print(f'  {name}: minute {m}', flush=True)
        if slow: return [slow], None
        return list(pg.errors), await pg.evaluate('[units.length, SIDES.map((s) => s.age)]')

BUTTONS = "[...document.querySelectorAll('button[data-v]')].filter((b) => b.offsetParent !== null && !b.disabled).map((b, n) => [b.dataset.v + ':' + (b.dataset.a || '') + ':' + (b.dataset.b || ''), b.textContent.trim().slice(0, 24)])"
LAST = {'restart', 'new', 'quit', 'resign', 'start', 'surrender'}   # verbs that end the match: tapped last
async def walk():
    """Taps every button it can reach, with full stores, and taps the map between."""
    async with run.game(21, test=True, cover=True) as pg:
        await run.release(pg); await pg.evaluate('show.fast = true'); await pg.wait_for_timeout(1000)
        done = set(); spots = [(195, 420), (120, 300), (260, 520), (195, 250), (60, 600), (330, 330)]; taps = 0
        for turn in range(900):
            here = await pg.evaluate(BUTTONS)
            todo = [k for k, _ in here if k not in done and k.split(':')[0] not in LAST]
            if not todo:
                if turn > 60 and taps and not await pg.evaluate("document.querySelectorAll('button[data-v]').length"): break
                x, y = spots[turn % len(spots)]; await pg.touchscreen.tap(x, y); taps += 1; await pg.wait_for_timeout(120)
                if taps > 150: break
                continue
            k = todo[0]; done.add(k)
            await pg.evaluate("(k) => { const b = [...document.querySelectorAll('button[data-v]')].find((b) => b.offsetParent !== null && b.dataset.v + ':' + (b.dataset.a || '') + ':' + (b.dataset.b || '') === k); if (b) b.click(); }", k)
            await pg.wait_for_timeout(80)
            if turn % 12 == 5: x, y = spots[turn % len(spots)]; await pg.touchscreen.tap(x, y); await pg.wait_for_timeout(80)
        await pg.wait_for_timeout(1500)
        note(await run.covered(pg), 'menus: every button, full stores')
        return sorted(done), list(pg.errors)

async def main(out, which, menus):
    log = {}; done = []
    for n, g in enumerate(GAMES):
        if which is not None and n not in which: continue
        errs, end = await play(*g); log[g[0]] = {'errors': errs, 'end': end}; print(g[0], end, errs[:1], flush=True)
    if menus: done, errs = await walk(); log['menus'] = {'buttons': len(done), 'errors': errs}; print('menus', len(done), errs[:2], flush=True)
    E = json.loads(re.search(r'BOOK\("comments",\s*(\{.*\})\);', (ROOT / 'books/comments.js').read_text(), re.S).group(1))
    text = {f: (ROOT / f).read_text(encoding='utf-8') for f in {k[0] for k in sizes}}
    rows = []
    for k in sorted(sizes):
        f, a, b, name = k; src = text[f]; line_end = src.find('\n', b); line_end = len(src) if line_end < 0 else line_end
        codes = re.findall(r'E\d+', ' '.join(re.findall(r'// (E\d+)', src[a:line_end])))
        rows.append({'file': f, 'line': src.count('\n', 0, a) + 1, 'name': name, 'bytes': b - a, 'ran': k in first, 'first': first.get(k, ''), 'why': (E.get(codes[0], {}).get('text', '') if codes else '')[:240]})
    json.dump({'log': log, 'buttons': done, 'functions': rows}, open(out, 'w'), indent=0)
    never = [r for r in rows if not r['ran']]
    print(f"{len(rows)} functions, {len(never)} never ran, {sum(r['bytes'] for r in never):,} bytes")
# python3 tools/map.py OUT.json [games, e.g. 0,2,4 or none] [menus|nomenus]: a run may take a share of the games, so two can run side by side
which = None if len(sys.argv) < 3 or sys.argv[2] == 'all' else [int(x) for x in sys.argv[2].split(',') if x.isdigit()]
asyncio.run(main(sys.argv[1], which, len(sys.argv) < 4 or sys.argv[3] == 'menus'))
