# The colour code and the timings hold (Build 66, after SoRen's palette law): each is defined once, in the style sheet's :root; no other
# place in the source writes the same value by hand (Build 65 found the code written in four places with four blues); every state colour
# and the words' colours are readable on the wood (WCAG 2.1 contrast, 4.5:1); every transition and animation names one of the four timings.
import re, glob, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
css = open('src/shell-head.html').read(); js = ''.join(open(f).read() for f in sorted(glob.glob('src/[0-9][0-9]-*.js')))
bad = []
root = re.search(r':root\{(--ring-b[^}]*)\}', css)
if not root: sys.exit('FAIL the colour code: no :root with --ring-b')
V = dict(re.findall(r'--([\w-]+):([^;]+)', root.group(1)))
for k in ['ring-r', 'ring-w', 'ring-g', 'ring-b', 't-quick', 't-sweep', 't-settle', 't-long']:
    if k not in V: bad.append(f'{k} is not defined')
    elif len(re.findall(r'--' + k + r':', css)) != 1: bad.append(f'{k} is defined more than once')
for k in ['ring-r', 'ring-w', 'ring-g', 'ring-b']:
    h = V.get(k, '').strip().lower()
    n = (css + js).lower().count(h)
    if h and n != 1: bad.append(f'{k} {h} is written {n} times (once is the rule)')
def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
ratio = lambda a, b: (max(lum(a), lum(b)) + 0.05) / (min(lum(a), lum(b)) + 0.05)
panel = re.search(r'--panel:(#[0-9a-fA-F]{6})', css).group(1)
for k in ['ring-r', 'ring-w', 'ring-g', 'ring-b']:
    r = ratio(V[k].strip(), panel)
    if r < 4.5: bad.append(f'{k} on the wood {panel}: {r:.1f}:1, under 4.5')
for m in re.finditer(r'(transition|animation):([^;}]*)', css):
    v = m.group(2)
    if re.search(r'\d*\.?\d+m?s\b', v) and 'var(--t-' not in v: bad.append(f'a timing by hand: {m.group(0)[:60]}')
print(('PASS ' if not bad else 'FAIL ') + 'the colour code and the timings: one home each, readable on the wood', '' if not bad else bad)
sys.exit(1 if bad else 0)
