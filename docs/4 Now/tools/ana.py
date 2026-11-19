import json, collections, sys
R = json.load(open('/tmp/routes.json')); NOISE = {'work', 'raise', 'struck', 'born', 'done'}
for r in R: r['e'] = [x for x in r.get('ev', []) if x not in NOISE]; r['c'] = [k for k in r.get('ch', []) if k not in ('top', 'cam', 'w')]
print(len(R), 'taps', len({r['screen'] for r in R}), 'screens', 'errs', sum(1 for r in R if r.get('err')))
print('EVENTS', collections.Counter(x for r in R for x in r['e']))
top = ['mhome||', 'mtab|Jobs|', 'mtab|Build|', 'war||', 'mfold||']
print('\n== TOP LINE: where each lands, by screen')
S = collections.OrderedDict()
for r in R: S.setdefault(r['screen'], {})[r['v']] = r
for s, D in S.items():
    row = []
    for v in top:
        r = D.get(v); row.append('—' if not r else ('SAME' if r.get('to') == r.get('from') and not [k for k in r['c'] if k != 'S.fold' and k != 'dom.rank'] and v != 'mfold||' else r.get('to', '?')) if not (r.get('to') == r.get('from')) else ('stays' + ('*' if r['c'] else ' DEAD')))
    print(f"{s[:26]:26} | " + ' | '.join(f"{x[:24]:24}" for x in row))
print('\n== DEAD: tapped, nothing changed, nothing said')
dead = [r for r in R if r['where'] != 'map' and not r.get('err') and r.get('hit') and not r['c'] and not r.get('nw') and 'err' not in r['e']]
G = collections.defaultdict(list)
for r in dead: G[(r['v'].split('|')[0], r['label'][:18])].append(r['screen'])
for k, v in sorted(G.items(), key=lambda x: -len(x[1])): print(len(v), k, v[:4])
print('\n== REFUSED with no words shown')
G = collections.defaultdict(list)
for r in R:
    if 'err' in r['e'] and not r.get('nw'): G[(r['v'].split('|')[0], r['label'][:18])].append(r['screen'])
for k, v in sorted(G.items(), key=lambda x: -len(x[1])): print(len(v), k, v[:4])
print('\n== NO WAY OUT: screens with no button that lands on rest')
for s, D in S.items():
    outs = [r['label'][:10] or r['v'][:10] for r in D.values() if r['where'] != 'map' and r.get('to') == 'rest']
    if not outs and s != 'rest': print(' ', s, '| is:', next(iter(D.values())).get('from'))
print('\n== MAP TAPS: screen x target -> lands')
for s, D in S.items():
    print(f"{s[:26]:26} | " + ' | '.join(f"{(D[m].get('to') or D[m].get('err','?'))[:22]:22}" for m in D if m.startswith('map:')))
print('\n== SAME BUTTON, DIFFERENT RESULT (by verb+label)')
G = collections.defaultdict(lambda: collections.defaultdict(list))
for r in R:
    if r['where'] == 'map' or r['v'] in top: continue
    out = 'rest' if r.get('to') == 'rest' else 'stays' if r.get('to') == r.get('from') else 'goes'
    G[(r['v'].split('|')[0], r['label'][:14])][out + ('' if r['c'] or r.get('nw') else ' DEAD')].append(r['screen'])
for k, v in G.items():
    if len(v) > 1: print(k, {a: (len(b), b[:2]) for a, b in v.items()})
