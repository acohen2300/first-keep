# Writes INDEX.md from CALCULATIONS.md: every Q with its Ns, every N with its Qs. Run after any edit to CALCULATIONS.md.
import re
s = open('CALCULATIONS.md').read()
N = dict(re.findall(r'^(N\d+) (.+)$', s, re.M)); fw = []; bw = {}; Q = 0
for line in s.splitlines():
    m = re.match(r'^(Q[A-Z]+) (.+) · (.+)$', line)
    if not m: continue
    q, body, refs = m.groups(); Q += 1; ns = re.findall(r'N\d+', refs)
    fw.append(f"{q} {body.split(':')[0]} → {', '.join(ns) if ns else 'design (no citation)'}")
    for n in ns: bw.setdefault(n, []).append(q)
out = ["# First Keep v100 · the Index: calculations and citations, both ways", "", "Written from CALCULATIONS.md by `index.py`, never by hand. If a Q or an N ever goes missing or doubles, this page shows it.", "", "## By calculation"] + fw + ["", "## By citation"]
for n in sorted(N, key=lambda x: int(x[1:])): out.append(f"{n} {N[n]} → {', '.join(bw.get(n, ['(unused)']))}")
out.append(f"\n{Q} calculations, {len(N)} citations.")
open('INDEX.md', 'w').write('\n'.join(out) + '\n'); print(Q, 'calculations', len(N), 'citations; unused:', [n for n in N if n not in bw])
