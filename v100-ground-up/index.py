# The Index and the one-home check. Reads every Book (books/*.js) and the Laws (CALCULATIONS.md); writes INDEX.md and BOOKS.md, never by hand.
# It stops (exit 1) when the rule "everything has one home" breaks: a code in two books, a citation or law that does not exist, a slot pointing nowhere,
# a tick no capability answers, a number typed into the code where a book should hold it, or a shell named in the code instead of asked by tick.
# Run after any edit: python3 index.py
import json, re, glob, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
BOOKS, HOME = {}, {}
for f in sorted(glob.glob('books/*.js')):
    s = open(f).read(); m = re.search(r'BOOK\("(\w+)", ([\s\S]*)\);\s*$', s)
    BOOKS[m.group(1)] = json.loads(m.group(2))
bad, warn = [], []
for b, entries in BOOKS.items():
    for c in entries:
        if c in HOME: bad.append(f'{c} has two homes: {HOME[c]} and {b}')
        HOME[c] = b
calc = open('CALCULATIONS.md').read()
Q = {}
for line in calc.splitlines():
    m = re.match(r'^(Q[A-Z]+) (.+?)(?: · (.+))?$', line)
    if m: Q[m.group(1)] = (m.group(2), re.findall(r'N\d+', m.group(3) or ''))
N = BOOKS['citations']
# every entry: a citation that exists (a source, or a design call said so), laws that exist
for b, entries in BOOKS.items():
    if b == 'citations': continue
    for c, e in entries.items():
        if not e.get('cite'): bad.append(f'{c} ({b}) has no citation')
        for n in re.findall(r'N\d+', ' '.join(e.get('cite', []))):
            if n not in N: bad.append(f'{c} cites {n}, which is not in the citations book')
        for q in e.get('law', []):
            if q not in Q: bad.append(f'{c} names law {q}, which is not in CALCULATIONS.md')
for q, (_, ns) in Q.items():
    for n in ns:
        if n not in N: bad.append(f'{q} cites {n}, which is not in the citations book')
# the shells: every slot points at something that exists, every tick is a capability
by = lambda book: {e['key']: c for c, e in BOOKS[book].items()}
caps, mass, looks, sounds = by('capabilities'), by('mass'), by('sprites'), by('sound')
def resolves(p):
    c, _, k = p.partition('.'); e = BOOKS.get(HOME.get(c, ''), {}).get(c)
    return e is not None and (not k or (isinstance(e['value'], dict) and k in e['value']))
for c, s in BOOKS['shells'].items():
    for t in s['ticks']:
        if t not in caps: bad.append(f'{c} ticks {t}, which no capability answers')
    for slot in ('amount', 'size', 'room', 'pace', 'rate'):
        if s.get(slot) and not resolves(s[slot]): bad.append(f'{c}.{slot} points at {s[slot]}, which is not in a book')
    for slot in ('body', 'mount'):
        if s.get(slot) and s[slot] not in mass: bad.append(f'{c}.{slot} is {s[slot]}, not in the mass book')
    for k in s.get('kit', []):
        if k not in mass: bad.append(f'{c} carries {k}, not in the mass book')
    for slot in ('sound', 'voice'):
        if s.get(slot) and s[slot] not in sounds: bad.append(f'{c}.{slot} is {s[slot]}, not in the sound book')
    if s['layer'] == 120 and s['look'] not in looks: bad.append(f'{c} wears {s["look"]}, not in the sprites book')
for ev, snd in BOOKS['sound']['HE1']['value'].items():
    if snd not in sounds: bad.append(f'event {ev} plays {snd}, not in the sound book')
# the code: no shell named, no numbers typed into D, every measurement read somewhere
code = {f: open(f).read() for f in ['index.html', 'econ.js', 'combat.js', 'ai.js', 'menu.js', 'sound.js']}
for f, s in code.items():
    for m in re.finditer(r"code(?:\[0\])? [!=]== '[A-Z0-9]+'", s): bad.append(f'{f}: a shell named in the code ({m.group(0)}): ask by tick')
    if re.search(r'Object\.assign\(D,|const D = \{', s): bad.append(f'{f}: numbers typed into D: they belong in books/measure.js')
allcode = '\n'.join(code.values()) + json.dumps(BOOKS['shells'])
for c, e in BOOKS['measure'].items():
    k = e['key'].split('.')[-1]
    if not re.search(r'\bD\.(ai\.)?' + re.escape(k) + r'\b|"' + c + r'[".]|\'' + re.escape(k) + r'\'', allcode): warn.append(f'{c} {e["key"]}: nothing reads it yet')
heard = set(BOOKS['sound']['HE1']['value'].values()) | {s.get('sound') for s in BOOKS['shells'].values()} | {s.get('voice') for s in BOOKS['shells'].values()} | {'bird', 'cricket'}
for c, e in BOOKS['sound'].items():
    if isinstance(e['value'], list) and e['key'] not in heard: warn.append(f'{c} {e["key"]}: waiting for its event')
# INDEX.md: by book, by law, by citation
uses = {}
for b, entries in BOOKS.items():
    for c, e in entries.items():
        for q in e.get('law', []): uses.setdefault(q, []).append(c)
        for n in re.findall(r'N\d+', ' '.join(e.get('cite', []))): uses.setdefault(n, []).append(c)
out = ['# First Keep v100 · the Index', '', 'Written by `index.py` from the Books and the Laws, never by hand. If a code ever goes missing or doubles, the run stops and says where.', '',
       '## The Books', '', '| Book | Entries | Codes |', '|---|---|---|']
for b, entries in BOOKS.items(): out.append(f'| {b} | {len(entries)} | {", ".join(list(entries)[:3])}… |')
out += ['', '## By law (Book 1, CALCULATIONS.md)', '']
for q, (body, ns) in Q.items(): out.append(f'- **{q}** {body.split(":")[0]} → {", ".join(ns) or "design"}' + (f' · used by {", ".join(uses[q])}' if q in uses else ''))
out += ['', '## By citation', '']
for n, e in N.items():
    qs = [q for q, (_, ns) in Q.items() if n in ns]
    out.append(f'- **{n}** {"" if e["opened"] else "(from memory, to open) "}{e["text"][:120]} → {", ".join(qs + uses.get(n, [])) or "unused"}')
out += ['', f'{sum(len(e) for e in BOOKS.values())} entries in {len(BOOKS)} books · {len(Q)} laws · {len(N)} citations, {sum(1 for e in N.values() if not e["opened"])} still to open.']
if warn: out += ['', '## Waiting', ''] + [f'- {w}' for w in warn]
open('INDEX.md', 'w').write('\n'.join(out) + '\n')
# BOOKS.md: every book as a page
show = lambda v: json.dumps(v, ensure_ascii=False).replace('"', '').replace('|', '/')[:140]
pg = ['# First Keep v100 · the Books', '', 'Written by `index.py` from `books/*.js`, never by hand. Each book is the one home of what it holds; the game reads the files, this page shows them.', '']
for b, entries in BOOKS.items():
    pg += [f'## {b}', '', '| Code | Name | Value | Cited |', '|---|---|---|---|']
    for c, e in entries.items():
        if b == 'citations': pg.append(f'| {c} | {"opened" if e["opened"] else "to open"} | {e["text"][:140].replace("|", "/")} | |')
        elif b == 'shells': pg.append(f'| {c} | {e["name"]} | layer {e["layer"]} · {", ".join(e["ticks"]) or "no ticks"} | |')
        else: pg.append(f'| {c} | {e["name"]} | {show(e["value"])} | {"; ".join(e["cite"])[:80]} |')
    pg.append('')
open('BOOKS.md', 'w').write('\n'.join(pg) + '\n')
print(f'{sum(len(e) for e in BOOKS.values())} entries, {len(Q)} laws, {len(N)} citations; {len(warn)} waiting; {len(bad)} broken')
for x in bad: print('BROKEN', x)
sys.exit(1 if bad else 0)
