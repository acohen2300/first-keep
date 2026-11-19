# Sorts design.py's measurements. python3 design-read.py <design.json>
import json, sys, re
from collections import Counter, defaultdict
D = json.load(open(sys.argv[1]))['screens']; N = len(D)
hexc = lambda c: (lambda m: '#%02x%02x%02x' % tuple(int(x) for x in m.groups()[:3]) + ('' if not m.group(4) or float(m.group(4)) >= 1 else '@%.2f' % float(m.group(4))))(re.match(r'rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)', c)) if c.startswith('rgb') else c
print('SCREENS', N)
# 1 fonts
F = defaultdict(lambda: [0, set(), []])
for s, d in D.items():
    for t in d.get('texts', []):
        k = (t['fam'], t['px'], t['w'], t['st'] + (' caps' if t['caps'] else ''))
        F[k][0] += 1; F[k][1].add(s)
        if len(F[k][2]) < 4 and t['t'] not in F[k][2]: F[k][2].append(t['t'])
print('\n1 FONTS: %d different (family, size, weight, style)' % len(F))
for k, (n, ss, ex) in sorted(F.items(), key=lambda x: -x[1][0]): print('  %-26s %5spx %s %-12s runs %4d screens %2d  e.g. %s' % (k[0][:26], k[1], k[2], k[3], n, len(ss), ' | '.join(ex)))
print('  sizes:', sorted(Counter(k[1] for k in F).items()), ' weights:', sorted(Counter(k[2] for k in F).items()), ' families:', sorted(Counter(k[0] for k in F).items()))
sq = Counter(t['sx'] for d in D.values() for t in d.get('texts', []) if t['sx'] != 1)
print('  text squeezed sideways (scaleX): runs %d, widths %s' % (sum(sq.values()), sorted(sq.items())[:8]))
# 2 text colours
C = Counter(); CT = defaultdict(set)
for s, d in D.items():
    for t in d.get('texts', []):
        k = hexc(t['col']) + ('' if t['a'] >= 1 else ' x%.2f' % t['a']); C[k] += 1; CT[k].add(t['t'])
print('\n2 TEXT COLOURS: %d different' % len(C))
for k, n in C.most_common(24): print('  %-22s runs %4d  e.g. %s' % (k, n, ' | '.join(list(CT[k])[:4])))
# tile text: .mt .cell names and small lines
TT = Counter()
for s, d in D.items():
    for t in d.get('texts', []):
        if 'cell' in t['host'] and t['root'] in ('ui', 'base'): TT[(('second line' if t['tag'] in ('small', 'span') else 'name'), hexc(t['col']), t['px'], t['w'])] += 1
print('  tile text (cells in the bottom rows):'); [print('    %-12s %-18s %spx %s  runs %d' % (*k, n)) for k, n in TT.most_common(16)]
# 3 outlines on a box
def lines(b): return [x for x in (('border ' + b['border']) if b['border'] else '', ('inset ' + b['inset'][:40]) if b['inset'] else '', ('ring ' + '+'.join(b['ring'])) if b['ring'] else '', ('outline ' + b['outline']) if b['outline'] else '') if x]
OC = Counter(); multi = defaultdict(list); picked = Counter()
for s, d in D.items():
    for b in d.get('boxes', []):
        L = lines(b); OC[len(L)] += 1
        if len(L) >= 2: multi[(b['cls'][:38], tuple(x.split(' ')[0] for x in L))].append((s, b['text'][:18]))
        if re.search(r'\b(sel|on|arm)\b', b['cls']): picked[(b['cls'][:38], len(L), tuple(x.split(' ')[0] for x in L))] += 1
print('\n3 OUTLINES a box (border, inset line, ring, outline):', dict(sorted(OC.items())))
for k, v in sorted(multi.items(), key=lambda x: -len(x[1]))[:14]: print('  %-40s %-28s boxes %3d  e.g. %s / %s' % (k[0], '+'.join(k[1]), len(v), v[0][0], v[0][1]))
print('  picked or lit boxes:'); [print('    %-40s lines %d %-24s  %d' % (k[0], k[1], '+'.join(k[2]), n)) for k, n in picked.most_common(14)]
# 4 shells: distinct box shapes
S = defaultdict(lambda: [0, set(), ''])
for s, d in D.items():
    for b in d.get('boxes', []):
        k = (b['h'], b['rad'], hexc(b['border'].split('px ')[1]) if b['border'] else '-', b['bg'] if b['bg'] in ('gradient', '') else hexc(b['bg']))
        S[k][0] += 1; S[k][1].add(s); S[k][2] = S[k][2] or (b['cls'][:26] + ' "' + b['text'][:14] + '"')
print('\n4 SHELLS: %d different boxes (height, corner, border colour, fill)' % len(S))
for k, (n, ss, ex) in sorted(S.items(), key=lambda x: -x[1][0])[:30]: print('  h%-3s r%-6s border %-16s fill %-10s boxes %4d screens %2d  %s' % (*k, n, len(ss), ex))
print('  heights:', sorted(Counter(k[0] for k in S).items())); print('  corners:', sorted(Counter(k[1] for k in S).items())); print('  border colours:', len(set(k[2] for k in S)), sorted(set(k[2] for k in S)))
# 5 tap areas
small = defaultdict(list)
for s, d in D.items():
    for b in d.get('boxes', []):
        if b['tag'] == 'button' and b['v'] and (b['tw'] < 44 or b['th'] < 44): small[(b['cls'][:30], b['tw'], b['th'])].append((s, b['text'][:14]))
print('\n5 TAP AREAS under 44 (with the invisible spill counted): %d kinds, %d buttons' % (len(small), sum(len(v) for v in small.values())))
for k, v in sorted(small.items(), key=lambda x: -len(x[1]))[:22]: print('  %-32s %3dx%-3d  buttons %3d  e.g. %s / %s' % (*k, len(v), v[0][0], v[0][1]))
# 6 clipped
cl = defaultdict(list)
for s, d in D.items():
    for b in d.get('boxes', []):
        if (b['clipX'] or b['clipY']) and b['text']: cl[s].append(b['text'][:22] + (' ↔' if b['clipX'] else '') + (' ↕' if b['clipY'] else ''))
print('\n6 CLIPPED text: %d boxes on %d screens' % (sum(len(v) for v in cl.values()), len(cl)))
for s, v in sorted(cl.items(), key=lambda x: -len(x[1]))[:16]: print('  %-34s %2d  %s' % (s, len(v), ' | '.join(v[:5])))
# 7 People, small text
for s in ('Jobs',):
    for b in D[s]['boxes']:
        if 'ppl' in b['cls']: print('\n7 PEOPLE tile:', {k: b[k] for k in ('cls', 'w', 'h', 'border', 'inset', 'ring', 'rad', 'text')})
tiny = Counter((t['px'], t['t']) for d in D.values() for t in d.get('texts', []) if t['px'] < 11.5)
print('  text under 12 px: runs %d; smallest %s' % (sum(tiny.values()), sorted(set(k[0] for k in tiny))[:4])); print('   ', [k for k, _ in tiny.most_common(14)])
