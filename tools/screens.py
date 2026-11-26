# The screens test: opens every menu, sheet and card in a fixed order with the clock held, and keeps what each one shows.
#   python3 tools/screens.py OUT.json            walk this build and write what every screen shows
#   python3 tools/screens.py OUT.json OTHER_DIR  walk the build in OTHER_DIR instead (to compare an older build)
#   python3 tools/screens.py --compare A.json B.json   list every screen that differs
import asyncio, hashlib, json, pathlib, re, sys
import run

SHOT = """(() => { const clean = (h) => h.replace(/src="data:[^"]*"/g, (m) => 'src="pic' + m.length + '"'); return clean((document.getElementById('topbar') || {innerHTML: ''}).innerHTML) + '\\n<!-- ui -->\\n' + clean(document.getElementById('ui').innerHTML); })()"""
CLICK = "(k) => { const b = [...document.querySelectorAll('[data-v]')].find((b) => b.offsetParent !== null && b.dataset.v.replace(/\\|+$/, '') === k.replace(/\\|+$/, '')); if (b) b.click(); return !!b; }"
KEYS = "(v) => [...document.querySelectorAll('[data-v]')].filter((b) => b.offsetParent !== null && b.dataset.v.split('|')[0] === v).map((b) => b.dataset.v)"
SETTLE = 1500   # ms: longer than the menus' own settle timer, so a screen is read after it has come to rest

async def walk(root):
    shots = {}
    async def snap(pg, name):
        n, k = name, 2
        while n in shots: n = f'{name} ({k})'; k += 1
        seen = {}   # a unit's handle is a running number; only which buttons share one matters, so number them as met
        shots[n] = re.sub(r'\|U(\d+)\|', lambda m: '|U%d|' % seen.setdefault(m.group(1), len(seen) + 1), await pg.evaluate(SHOT))
    async def click(pg, key, name=None, wait=0):
        ok = await pg.evaluate(CLICK, key)
        if wait: await pg.wait_for_timeout(wait)
        if ok and name: await snap(pg, name)
        return ok
    # 1. the new-game screen
    async with run.game(21, root=root, begin=False) as pg:
        await snap(pg, 'New game')
        for label in ['Hard', 'Han', 'Conquest', 'Siege', 'Hardest', 'Famine', 'Daily', 'Daily', 'War Fog', 'Random']:
            try: await run.tap(pg, label); await snap(pg, f'New game › {label}')
            except RuntimeError: shots[f'New game › {label}'] = 'no such button'
    # 2. in a match, full stores
    async with run.game(21, root=root, test=True) as pg:
        await pg.evaluate('MENU.render(true)'); await snap(pg, 'Play')
        await click(pg, 'mtab|Jobs', 'Jobs')
        for k in await pg.evaluate(KEYS, 'jsel'): await click(pg, k, f'Jobs › {k}')
        for k in (await pg.evaluate(KEYS, 'jpm'))[:4]: await click(pg, k, f'Jobs › {k}')
        await click(pg, 'idle', 'Jobs › idle'); await click(pg, 'mhome', 'Home')
        async def build_open(g=None):
            if not await pg.evaluate(KEYS, 'group'): await click(pg, 'mhome'); await click(pg, 'mtab|Build')
            if g: await click(pg, g)
        await click(pg, 'mtab|Build', 'Build')
        for g in await pg.evaluate(KEYS, 'group'):
            await build_open(g); await snap(pg, f'Build › {g}')
            for pk in (await pg.evaluate(KEYS, 'pick'))[:3]:
                await build_open(g)
                if not await click(pg, pk, f'Build › {g} › {pk}'): continue
                if await click(pg, 'build', f'Build › {g} › {pk} › build'): await pg.wait_for_timeout(SETTLE); await snap(pg, f'Build › {g} › {pk} › settled')
                else: await click(pg, 'mback')
        await click(pg, 'mhome', 'Home')
        await run.step(pg, 240); await pg.evaluate('MENU.render(true)'); await snap(pg, 'Play, four minutes on')
        for tab in ['Stores', 'Score']:
            if await click(pg, f'tab|{tab}', tab): await click(pg, 'close')
        if await click(pg, 'mail', 'Mail'): await click(pg, 'close')
        if await click(pg, 'pause', 'Pause'): await click(pg, 'resume'); await pg.evaluate('fk.pause(true)')
        if await click(pg, 'tab|Stores') and await click(pg, 'book', 'Help'):
            for k in await pg.evaluate(KEYS, 'tab'): await click(pg, k, f'Help › {k}')
            await click(pg, 'close')
        # every kind of thing and unit on the board, own, wild and theirs
        kinds = await pg.evaluate("""(() => { const seen = new Map(); for (const t of [...things, ...units]) { if (t.gone) continue; const k = (t.side === 0 ? 'mine' : t.side == null || t.side < 0 ? 'wild' : 'theirs') + ' ' + (fk.SH[t.code] ? fk.SH[t.code].name : t.kind) + (t.done != null && t.done < 1 ? ' (site)' : ''); if (!seen.has(k)) seen.set(k, t); } window.__k = [...seen.values()]; return [...seen.keys()]; })()""")
        for i, name in enumerate(kinds):
            await pg.evaluate("(i) => { const t = window.__k[i]; Object.assign(MENU.S, { tab: null, ghost: null, war: false }); if (t.kind === 'unit') { MENU.S.subject = null; fk.select([t]); if (t.side !== 0) { fk.select(null); MENU.S.subject = t; } } else { fk.select(null); MENU.S.subject = t; } MENU.render(true); }", i)
            await snap(pg, f'Card: {name}')
            for k in await pg.evaluate(KEYS, 'ctab'): await click(pg, k, f'Card: {name} › {k}')
            for k in (await pg.evaluate(KEYS, 'who'))[:2]: await click(pg, k, f'Card: {name} › {k}')
            for k in (await pg.evaluate(KEYS, 'vjob'))[:2]: await click(pg, k, f'Card: {name} › {k}')
            await pg.evaluate("fk.select(null); MENU.S.subject = null; MENU.S.who = null; MENU.render(true)")
        # the war controls
        if await click(pg, 'war', 'War'):
            for k in await pg.evaluate(KEYS, 'mwho'): await click(pg, k, f'War › {k}')   # New, then each type (the frame of Nov 26)
            for k in await pg.evaluate(KEYS, 'mtyp'): await click(pg, k, f'War › {k}')
            for k in ('mord|move|', 'mhold', 'mmode|heart|death|', 'mpause', 'mord|defend|', 'mord|retreat|', 'mord|retreat|', 'mord|attack|'): await click(pg, k, f'War › {k}')   # Retreat twice: on, then stopped where they stand
            await click(pg, 'mback', 'War closed by Exit')
        shots['errors'] = '\n'.join(pg.errors)
    return shots

def compare(a, b):
    A, B = json.load(open(a)), json.load(open(b)); bad = [k for k in A if A[k] != B.get(k)] + [k for k in B if k not in A]
    for k in bad[:12]:
        x, y = A.get(k, ''), B.get(k, ''); i = next((n for n in range(min(len(x), len(y))) if x[n] != y[n]), min(len(x), len(y)))
        print(f'DIFFERS  {k}\n   was: …{x[max(0, i - 60):i + 100]!r}\n   now: …{y[max(0, i - 60):i + 100]!r}')
    print(f'{len(A)} screens, {len(bad)} differ' + ('' if bad else ': every screen is identical'))
    return not bad

if __name__ == '__main__':
    if sys.argv[1] == '--compare': sys.exit(0 if compare(sys.argv[2], sys.argv[3]) else 1)
    shots = asyncio.run(walk(pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else run.ROOT))
    json.dump(shots, open(sys.argv[1], 'w'), indent=0)
    print(f"{len(shots) - 1} screens kept, {len(set(shots.values()))} different; errors: {shots['errors'] or 'none'}")
