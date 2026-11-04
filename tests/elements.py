# The cards against the running game (preview 52, Albert's cards): what build.py cannot check by reading. Run by the gate:  python3 tests/elements.py
#   impacts: a resource (RES) or a node kind;  math: a name in SCIENCE.md's backticks;  orders: a verb in ACT or PLAY;  buildings: a kind in BLD;
#   exempt: the name does not appear in any file an act of the card lives in (the card's "exclusions": a thing it never touches).
import asyncio, glob, os, re, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
JS = """() => { const F = window.__fk; const kinds = new Set(['bush', 'tree', 'fish', 'stone', 'gold', 'iron', 'farm', 'meat']);
  return { E: F.ELEMENTS, res: F.RES, kinds: [...kinds], acts: [...Object.keys(F.ACT), ...Object.keys(F.PLAY)], blds: Object.keys(F.BLD) }; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        got = await pg.evaluate(JS); await br.close()
    sci = set(re.findall(r'`([^`]+)`', open('docs/2 Rules/SCIENCE.md').read()))
    src = {os.path.basename(f): open(f).read() for f in glob.glob('src/*.js')}
    homes = {}   # name -> file
    for f, s in src.items():
        for m in re.finditer(r'^(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=|\t([A-Za-z_$][\w$]*)\s*=\s)', s, re.M): homes[m.group(1) or m.group(2) or m.group(3)] = f
    bad = list(errs)
    for el, c in got['E'].items():
        for n in c['impacts']:
            if n not in got['res'] and n not in got['kinds']: bad.append(f'{el}: impacts {n} is no resource or node kind')
        for n in c['math']:
            if n not in sci: bad.append(f'{el}: math {n} is not named in SCIENCE.md')
        for n in c['orders']:
            if n not in got['acts']: bad.append(f'{el}: orders {n} is no verb in ACT or PLAY')
        for n in c['buildings']:
            if n not in got['blds']: bad.append(f'{el}: buildings {n} is no kind in BLD')
        files = {homes[a] for a in c['acts'] if a in homes}
        for n in c['exempt']:
            for f in sorted(files):
                if re.search(r'\b' + re.escape(n) + r'\b', src[f]): bad.append(f'{el}: exempt {n} appears in {f}, where its act lives')
    n = len(got['E'])
    print(('PASS ' if not bad else 'FAIL ') + f'the cards against the running game ({n} card{"s" if n != 1 else ""}: impacts, math, orders, buildings, exempt)', '' if not bad else bad[:6])
    sys.exit(1 if bad else 0)
asyncio.run(main())
