# The colours, the text sizes and the timings hold (Build 66, after SoRen's palette law; Build 70, the colour index). Every colour COLORS.md
# names is defined once, in the style sheet's :root, with the value the index gives; the retired names are gone; nothing else in the style
# sheet, and nothing in the interface's code, writes a named colour by hand (the code colours not even the map's art); the words are readable
# on the wood and the steel, and the ink on the gold fill (WCAG 2.1 contrast, 4.5:1); the style sheet uses the three text sizes only; every
# transition and animation names one of the four timings.
import re, glob, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
css = open('src/shell-head.html').read()
files = sorted(glob.glob('src/[0-9][0-9]-*.js'))
js = ''.join(open(f).read() for f in files)
ui = ''.join(open(f).read() for f in files if 26 <= int(os.path.basename(f)[:2]) <= 33 or int(os.path.basename(f)[:2]) >= 39)   # touch, cards, the frame, the verbs, the row, Emergency, boot
bad = []
index = open('COLORS.md').read()
named = {}   # token -> colour, read from the index's tables (the gold fill's row names two of each)
for row in re.findall(r'^\|[^|]+\|([^|]*`--[^|]+)\|([^|]+)\|', index.split('## Retired')[0], re.M):
    for tok, hexv in zip(re.findall(r'`--([\w-]+)`', row[0]), re.findall(r'#[0-9a-fA-F]{6}', row[1])): named[tok] = hexv.lower()
retired = re.findall(r'`--([\w-]+)`', index.split('## Retired')[1])
root = re.search(r':root\{(.*?)\}', css, re.S)
if not root or len(named) < 16: sys.exit(f'FAIL the colour index: {len(named)} colours read from COLORS.md, :root {"found" if root else "missing"}')
V = dict(re.findall(r'--([\w-]+):([^;]+);', root.group(1)))
rest = css[:root.start()] + css[root.end():]
for k, h in named.items():
    if V.get(k, '').strip().lower() != h: bad.append(f'--{k} is {V.get(k, "missing")} in :root; the index says {h}')
    if len(re.findall(r'--' + k + r':', css)) != 1: bad.append(f'--{k} is defined more than once')
    n = rest.lower().count(h) + (js if k.startswith('ring-') else ui).lower().count(h)
    if n: bad.append(f'{h} (--{k}) is written by hand {n} times: use the name')
for k in retired:
    n = len(re.findall(r'--' + re.escape(k) + r'(?![\w-])', css + js))
    if n: bad.append(f'the retired --{k} is used {n} times')
def rgb(h): return [int(h[i:i + 2], 16) for i in (1, 3, 5)]
def lum(c):
    c = [x / 255 for x in c]; c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def ratio(a, b): return (max(lum(a), lum(b)) + 0.05) / (min(lum(a), lum(b)) + 0.05)
mix = lambda a, b, t: [x * t + y * (1 - t) for x, y in zip(rgb(named[a]), rgb(named[b]))]
work = re.search(r'--work:color-mix\(in srgb,var\(--([\w-]+)\) (\d+)%,var\(--([\w-]+)\)\)', css)
pairs = [(w, g) for w in ['cream-1', 'cream-2', 'gold-1', 'ring-b', 'ring-g', 'ring-r', 'ring-w'] for g in ['brown-1', 'brown-2']] + [(w, 'steel-2') for w in ['cream-1', 'cream-2']]
for w, g in pairs:
    r = ratio(rgb(named[w]), rgb(named[g]))
    if r < 4.5: bad.append(f'--{w} on --{g}: {r:.1f}:1, under 4.5')
r = ratio(rgb(named['ink']), mix('fill-1', 'fill-2', 0.5))
if r < 4.5: bad.append(f'the ink on the gold fill: {r:.1f}:1, under 4.5')
if not work: bad.append('--work is not a mix of two named colours')
else:
    r = ratio(rgb(named['cream-1']), mix(work.group(1), work.group(3), int(work.group(2)) / 100))
    if r < 4.5: bad.append(f'Cream 1 on the working bar: {r:.1f}:1, under 4.5')
sizes = {k: V.get(k, '').strip() for k in ['fs-s', 'fs-m', 'fs-l']}
if sizes != {'fs-s': '12px', 'fs-m': '15px', 'fs-l': '19px'}: bad.append(f'the three text sizes are {sizes}, not 12, 15, 19')
for m in re.finditer(r'font-size:([^;}]+)|font:([^;}]+)', rest):
    v = (m.group(1) or m.group(2)).strip()
    if v != 'inherit' and not re.fullmatch(r'(\d+ )?var\(--fs-[sml]\)(/\S+)?( var\(--\w+\))?', v): bad.append(f'a text size outside the three: {m.group(0)[:50]}')
for k in ['t-quick', 't-sweep', 't-settle', 't-long']:
    if len(re.findall(r'--' + k + r':', css)) != 1: bad.append(f'{k} is not defined once')
for m in re.finditer(r'(transition|animation):([^;}]*)', css):
    if re.search(r'\d*\.?\d+m?s\b', m.group(2)) and 'var(--t-' not in m.group(2): bad.append(f'a timing by hand: {m.group(0)[:60]}')
print(('PASS ' if not bad else 'FAIL ') + f'the colour index ({len(named)} names), the three text sizes and the four timings: one home each, readable', '' if not bad else bad)
sys.exit(1 if bad else 0)
