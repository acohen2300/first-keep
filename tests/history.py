# The history check (Build 58): every research step's date against the age it sits in. A step out of its age is allowed only when its WHY
# line carries a "Game:" note saying so. Run by the gate:  python3 tests/history.py   (needs first-keep.html built)
import asyncio, os, re, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# the ages' spans, by the usual reckoning for the Near East and Europe: Stone to 3300 BC, Bronze to 800 BC, Classical to AD 500, Medieval to 1450, Gunpowder to 1700, the Enlightenment to 1800
SPAN = [(-1e9, -3300), (-3300, -800), (-800, 500), (500, 1450), (1450, 1700), (1650, 1800)]
SLACK = 150  # years either side: an age is a span, not a wall
def year(when):
    w = when.strip().replace(',', '')
    m = re.match(r'(?:about |c\. ?)?(\d+)(?:s)?\s*(BC|AD)?', w)
    if not m: return None
    y = int(m.group(1))
    return -y if (m.group(2) == 'BC' or 'BC' in w) else y
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page()
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(300)
        T = await pg.evaluate("() => window.__fk.TECH.map(t => ({ id: t.id, name: t.name, age: t.age, when: t.when || '', why: (window.__fk.WHY[t.id] || '') }))")
        await br.close()
    bad, nodate = [], []
    for t in T:
        y = year(t['when'])
        if y is None: nodate.append(t['id']); continue
        lo, hi = SPAN[t['age']]
        if (y < lo - SLACK or y > hi + SLACK) and 'Game:' not in t['why']:
            bad.append(f"{t['id']} ({t['name']}, {t['when']}) sits in the {['Stone','Bronze','Classical','Medieval','Gunpowder','Enlightenment'][t['age']]} age with no Game: note")
    print(('PASS ' if not bad else 'FAIL ') + f'every research step sits in its age or says why ({len(T)} steps, {len(nodate)} without a date)', '' if not bad else bad)
    if nodate: print('  no date:', nodate)
    sys.exit(1 if bad else 0)
asyncio.run(main())
