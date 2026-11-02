# The colours, the text sizes and the timings hold (Build 66, after SoRen's palette law; Build 70, the colour index). Every colour COLORS.md
# names is defined once, in the style sheet's :root, with the value the index gives; the retired names are gone; nothing else in the style
# sheet, and nothing in the interface's code, writes a named colour by hand (the code colours not even the map's art); the words are readable
# on the wood and the steel, and the ink on the gold fill (WCAG 2.1 contrast, 4.5:1; working is a ring on the edge since Build 70, so no fill
# lies behind the words); the style sheet uses the two text sizes only (v80: 12 and 18), two fonts (IM Fell English SC for titles, Barlow
# Semi Condensed for the rest, the map included), and Barlow at one weight, 600, from one file; every word on the map is drawn through one
# helper (mapFont, its size from labelK: 12 at the starting zoom, a floor of 9); every transition and animation names one of the four timings.
import re, glob, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
css = open('src/shell-head.html').read()
files = sorted(glob.glob('src/[0-9][0-9]-*.js'))
js = ''.join(open(f).read() for f in files)
ui = ''.join(open(f).read() for f in files if 26 <= int(os.path.basename(f)[:2]) <= 33 or int(os.path.basename(f)[:2]) >= 39)   # touch, cards, the frame, the verbs, the row, Emergency, boot
rest_js = ''.join(open(f).read() for f in files if int(os.path.basename(f)[:2]) >= 8)   # past the rules files: their players', resources' and goods' colours are data (EXCEPTIONS #11; wool is the white by chance)
bad = []
index = open('docs/2 Rules/COLORS.md').read()
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
    n = rest.lower().count(h) + (rest_js if k.startswith('ring-') else ui).lower().count(h)
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
pairs = [(w, g) for w in ['gold-1', 'ring-b', 'ring-g', 'ring-r', 'ring-w'] for g in ['brown-1', 'brown-2']] + [('ring-w', 'steel-2')]
for w, g in pairs:
    r = ratio(rgb(named[w]), rgb(named[g]))
    if r < 4.5: bad.append(f'--{w} on --{g}: {r:.1f}:1, under 4.5')
GLASS = int(V.get('glass', '0').strip().rstrip('%')) / 100   # a card is glass over the map (Nov 2): its words hold on the worst ground, white
glassy = [x * GLASS + 255 * (1 - GLASS) for x in rgb(named['brown-1'])]
for w in ['ring-w', 'gold-1', 'ring-r']:
    r = ratio(rgb(named[w]), glassy)
    if r < 4.5: bad.append(f'--{w} on a glass card over white ground: {r:.1f}:1, under 4.5')
DIM = int(V.get('dim', '0').strip().rstrip('%')) / 100   # the dim white (the levels, Nov 2): the white blended into what it sits on
for g in ['brown-1', 'brown-2', 'steel-2']:
    r = ratio(mix('ring-w', g, DIM), rgb(named[g]))
    if r < 4.5: bad.append(f'the dim white on --{g}: {r:.1f}:1, under 4.5')
r = ratio(rgb(named['ink']), mix('fill-1', 'fill-2', 0.5))
if r < 4.5: bad.append(f'the ink on the gold fill: {r:.1f}:1, under 4.5')
sizes = {k: v.strip() for k, v in V.items() if k.startswith('fs-')}
if sizes != {'fs-s': '12px', 'fs-l': '18px'}: bad.append(f'the text sizes are {sizes}, not the two: 12 and 18')
for m in re.finditer(r'font-size:([^;}]+)|font:([^;}]+)', rest):
    v = (m.group(1) or m.group(2)).strip()
    if v != 'inherit' and not re.fullmatch(r'(400 )?var\(--fs-[sl]\)(/\S+)?( var\(--display\))?', v): bad.append(f'a text size outside the two: {m.group(0)[:50]}')
# two fonts: the display face and the Barlow stack, each named once in :root; nothing else names a family
if not V.get('display', '').strip().startswith('"IM Fell English SC"') or not V.get('ui', '').strip().startswith('"Barlow Semi Condensed"'): bad.append('the two fonts are not --display (IM Fell English SC) and --ui (Barlow Semi Condensed)')
for m in re.finditer(r'font-family:([^;}]+)', rest):
    if m.group(1).strip() not in ('var(--ui)', 'var(--display)', 'inherit'): bad.append(f'a font outside the two: {m.group(0)[:60]}')
# one weight: --weight (600) in :root, read once by the body (and by mapFont from the page); the display face keeps its 400; no other weight
w = re.findall(r'font-weight:([^;}]+)', rest)
if V.get('weight', '').strip() != '600' or w.count('var(--weight)') != 1 or any(x not in ('var(--weight)', '400', 'inherit') for x in w): bad.append(f'Barlow at one weight, 600, set once: --weight is {V.get("weight")}, the style sheet writes {w}')
for m in re.finditer(r'font:(\d+)', rest):
    if m.group(1) != '400' or 'var(--display)' not in rest[m.start():m.start() + 60]: bad.append(f'a weight in a font shorthand: {m.group(0)}')
# one Barlow file, at 600; the fonts the build puts in the file are the two
fonts = sorted(f for f in os.listdir('src/fonts') if f.endswith(('.woff', '.woff2', '.ttf', '.otf')))
if fonts != ['barlow.woff', 'fell-sc.woff']: bad.append(f'the font files are {fonts}, not barlow.woff and fell-sc.woff')
faces = re.findall(r"face\('([^']+)', '([^']+)', (\d+)\)", open('build.py').read())
if sorted(faces) != [('Barlow Semi Condensed', 'barlow.woff', '600'), ('IM Fell English SC', 'fell-sc.woff', '400')]: bad.append(f'the build packs {faces}')
# the map: every word drawn through mapFont, which reads the one font at 600; the size scales with labelK, 12 at the starting zoom, 9 the floor
for f in files:
    for n, line in enumerate(open(f), 1):
        if re.search(r'\.font\s*=', line) and not re.search(r'\.font\s*=\s*mapFont\(', line): bad.append(f'{f}:{n} a map label not through mapFont: {line.strip()[:60]}')
        if re.search(r"system-ui|'sans-serif'|\bsans-serif\b", line) and 'shell' not in f: bad.append(f'{f}:{n} the phone\'s own font: {line.strip()[:60]}')
# the label sizes have one home (LABEL, 12 and 9) and the weight one (--weight): no call site writes a size, mapFont writes no weight
if not re.search(r'LABEL = \{ px: 12, floor: 9 \}', js): bad.append('the map labels are not LABEL = { px: 12, floor: 9 }')
for m in re.finditer(r'mapFont\(([^)]*)\)', js):
    if re.search(r'\d', m.group(1)): bad.append(f'a map label writes its own size: {m.group(0)}')
mf = re.search(r'const mapFont = .*', js); lk = re.search(r'const labelK = .*', js)
if not mf or 'LABEL.px' not in mf.group(0) or 'fontWeight' not in mf.group(0) or re.search(r'`\d{3} ', mf.group(0)): bad.append('mapFont does not read LABEL.px and the page\'s one weight')
if not lk or 'LABEL.floor' not in lk.group(0) or 'ZOOM_START' not in lk.group(0): bad.append('labelK does not read LABEL.floor and ZOOM_START')
for k in ['t-quick', 't-sweep', 't-settle', 't-long']:
    if len(re.findall(r'--' + k + r':', css)) != 1: bad.append(f'{k} is not defined once')
for m in re.finditer(r'(transition|animation):([^;}]*)', css):
    if re.search(r'\d*\.?\d+m?s\b', m.group(2)) and 'var(--t-' not in m.group(2): bad.append(f'a timing by hand: {m.group(0)[:60]}')
print(('PASS ' if not bad else 'FAIL ') + f'the colour index ({len(named)} names), the two text sizes, the two fonts at one weight, the map labels and the four timings: one home each, readable', '' if not bad else bad)
sys.exit(1 if bad else 0)
