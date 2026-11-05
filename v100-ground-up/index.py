# The gate: the Index, the one-home check, the molds, the permit and the seals. Run after any edit:  python3 index.py
#   python3 index.py            check everything; write INDEX.md and BOOKS.md; report what changed against the seal
#   python3 index.py --seal     after a passing build: seal the new state (seal.json) for the next permit
#   python3 index.py --ci       on GitHub: change nothing; fail if the pages are stale or anything differs from the seal
# Everything is sealed by item: a book entry, a shell row, a law, a code section, a tool. permit.json opens at most ten for a build;
# anything else that changed stops the build by name. Opened items are hunted against the rules; locked items must match byte for byte.
import json, re, glob, os, sys, hashlib, subprocess, tempfile
os.chdir(os.path.dirname(os.path.abspath(__file__)))
CI, SEAL = '--ci' in sys.argv, '--seal' in sys.argv
CODE = ['index.html', 'menu.js', 'econ.js', 'combat.js', 'ai.js', 'sound.js']   # the game, in load order after the books
TOOLS = ['index.py', 'publish.py', 'test.py', '../.github/workflows/pages.yml']
PAPER = ['INDEX.md', 'BOOKS.md']   # written here, never by hand

def load(read):
    books = {}
    for f in sorted(p for p in read('ls') if p.startswith('books/')):
        m = re.search(r'BOOK\("(\w+)", ([\s\S]*)\);\s*$', read(f)); books[m.group(1)] = json.loads(m.group(2))
    return books

def items(read):   # every sealed thing: id → text
    out, books = {}, load(read)
    for b, entries in books.items():
        for c, e in entries.items(): out[f'book:{b}:{c}'] = json.dumps(e, sort_keys=True, ensure_ascii=False)
    for line in read('CALCULATIONS.md').splitlines():
        m = re.match(r'^(Q[A-Z]+) ', line)
        if m: out[f'law:{m.group(1)}'] = line
    html = read('index.html'); a = html.index("<script>\n'use strict';"); out['code:index.html#page'] = html[:a]   # the page: markup, styles, the books' loader and their tags
    parts = re.split(r'(?m)^(?=// ── )', html[a:])
    out['code:index.html#frames'] = parts[0]
    for p in parts[1:]: out['code:index.html#' + re.sub(r'\W+', '-', p[5:p.find('\n')][:40].split(':')[0].split('(')[0]).strip('-').lower()] = p
    for f in CODE[1:]: out['code:' + f] = read(f)
    for f in TOOLS:
        t = read(f)
        if t is not None: out['tool:' + f.split('/')[-1]] = t
    return out

def disk(p):
    if p == 'ls': return [os.path.relpath(f) for f in glob.glob('books/*.js')]
    return open(p, encoding='utf-8').read() if os.path.exists(p) else None
seal = lambda t: {'sha': hashlib.sha256(t.encode()).hexdigest(), 'bytes': len(t.encode())}
NOW = items(disk)
NUM = lambda t: len(re.findall(r'(?<![\w.#$-])\d+\.?\d*(?![\w%])', t)) + 3 * len(re.findall(r'#[0-9a-fA-F]{6}\b', t))   # typed numbers, and colours (each counts three)
if SEAL:
    json.dump({k: seal(v) for k, v in sorted(NOW.items())}, open('seal.json', 'w'), indent=0)
    json.dump({k: NUM(v) for k, v in sorted(NOW.items()) if k.startswith('code:')}, open('seal-numbers.json', 'w'), indent=0); print(f'sealed {len(NOW)} items'); sys.exit(0)

BOOKS = load(disk); bad, warn, HOME = [], [], {}
for b, entries in BOOKS.items():
    for c in entries:
        if c in HOME: bad.append(f'{c} has two homes: {HOME[c]} and {b}')
        HOME[c] = b
calc = disk('CALCULATIONS.md'); Q = {}
for line in calc.splitlines():
    m = re.match(r'^(Q[A-Z]+) (.+?)(?: · (.+))?$', line)
    if m: Q[m.group(1)] = (m.group(2), re.findall(r'N\d+', m.group(3) or ''))
N = BOOKS['citations']
# 1. every entry: a citation that exists, laws that exist
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
# 2. the molds: every shell meets its layer's mold and the needs of every tick; no slot that nothing asks for
by = lambda book: {e['key']: c for c, e in BOOKS[book].items()}
CAPS = {e['key']: e['value'] for e in BOOKS['capabilities'].values()}
mass, looks, sounds, D = by('mass'), by('sprites'), by('sound'), {e['key']: e['value'] for e in BOOKS['measure'].values()}
def resolves(p):
    c, _, k = p.partition('.'); e = BOOKS.get(HOME.get(c, ''), {}).get(c)
    return e is not None and (not k or (isinstance(e['value'], dict) and k in e['value']))
def needed(code, s, need):   # a slot by name, or a D table that holds this shell's code (alternatives split by |)
    for alt in need.split('|'):
        if re.fullmatch(r'D\d+', alt):
            v = BOOKS['measure'].get(alt, {}).get('value')
            if isinstance(v, dict) and code in v: return True
        elif s.get(alt) is not None: return True
    return False
def mold(code, s, where):
    m = CAPS.get(f'layer{s.get("layer")}') or CAPS['shell']; allowed = set(CAPS['shell']['needs']) | set(CAPS['shell']['may']) | set(m['needs']) | set(m.get('may', []))
    for need in CAPS['shell']['needs'] + m['needs']:
        if not needed(code, s, need): bad.append(f'{where} {code} lacks {need}, which its mold needs')
    for t in s.get('ticks', []):
        if t not in CAPS: bad.append(f'{where} {code} ticks {t}, which no capability answers'); continue
        allowed |= set(CAPS[t].get('may', [])) | {n for n in CAPS[t]['needs'] if not n.startswith('D')}
        for need in CAPS[t]['needs']:
            if not needed(code, s, need): bad.append(f'{where} {code} ticks {t} but lacks {need}')
    for slot in s:
        if slot not in allowed: bad.append(f'{where} {code} carries {slot}, which nothing it ticks asks for')
for c, s in BOOKS['shells'].items():
    mold(c, s, 'shell')
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
# 3. the screen: pages are shells too; every cell points at something real; no row wider than the mold's six slots
SN = {e['key']: e['value'] for e in BOOKS['screen'].values()}
for c, e in BOOKS['screen'].items():
    if isinstance(e['value'], dict) and 'ticks' in e['value']: mold(c, {**e['value'], 'name': e['name'], 'cite': e['cite'], 'layer': 'page'}, 'page')
for tab, codes in SN['tabs'].items():
    if len(codes) > SN['mold']['slots'] // 2 * 3: bad.append(f'Build tab {tab} holds {len(codes)}: more than three rows of three')
    for c in codes:
        if c not in BOOKS['shells'] or BOOKS['shells'][c]['layer'] != 110: bad.append(f'Build tab {tab} lists {c}, which is not a building shell')
listed = [c for v in SN['tabs'].values() for c in v]
for c, s in BOOKS['shells'].items():
    if s['layer'] == 110 and listed.count(c) != 1 and c not in SN['offmenu']: bad.append(f'building {c} is on the Build menu {listed.count(c)} times (once, or named off the menu)')
if len(SN['top']) > 8: bad.append('the top ribbon holds more than eight cells')
for w in SN['waiting']: warn.append(f'{w}: a reading waiting for its new home (the second top row was cut, Nov 5)')
tall = [c for c, e in BOOKS['screen'].items() if isinstance(e['value'], dict) and 'Tall' in e['value'].get('ticks', [])]
# 4. the code: no shell named, nothing typed into D, every file parses alone and together, no comment swallows code, the version once
code = {f: disk(f) for f in CODE}
def scripts(f):
    t = code[f]; return '\n'.join(re.findall(r'<script>([\s\S]*?)</script>', t)) if f.endswith('.html') else t
for f in CODE:
    s = code[f]
    for m in re.finditer(r"code(?:\[0\])? [!=]== '[A-Z0-9]+'", s): bad.append(f'{f}: a shell named in the code ({m.group(0)}): ask by tick')
    if re.search(r'Object\.assign\(D,|const D = \{', s): bad.append(f'{f}: numbers typed into D: they belong in books/measure.js')
    for ln, line in enumerate(scripts(f).split('\n'), 1):
        c = re.search(r'(?<![:"\'\\])//(.*)$', line)
        if c and re.search(r'\w\(.*\)\s*;\s*($|\w|\})', c.group(1)) and not re.search(r'[\'"`]', c.group(1)[:3]): bad.append(f'{f}:{ln} a comment ends in a statement: it may have swallowed code')
if re.search(r'v100 · \d', code['index.html']): bad.append('index.html: the version is typed into the page; it lives in D (version)')
def node_check(name, text):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as t: t.write(text)
    r = subprocess.run(['node', '--check', t.name], capture_output=True, text=True); os.unlink(t.name)
    if r.returncode: bad.append(f'{name} does not parse: {r.stderr.strip().splitlines()[-1][:120]}')
for f in CODE: node_check(f, scripts(f))
node_check('the whole game, joined', '\n'.join(disk(p) for p in sorted(disk('ls'))) + '\n' + '\n'.join(scripts(f) for f in CODE))   # a name declared twice across two files
# 5. the permit and the seals: what changed, where; what stayed locked, byte for byte; nothing changed without a permit
sealed = json.load(open('seal.json')) if os.path.exists('seal.json') else {}
permit = json.load(open('permit.json')) if os.path.exists('permit.json') else {'build': '', 'opens': []}
opens = permit['opens']
if len(opens) > 10: bad.append(f'the permit opens {len(opens)} items: ten at most')
now = {k: seal(v) for k, v in NOW.items()}
changed = sorted(k for k in set(now) | set(sealed) if now.get(k) != sealed.get(k))
covered = lambda k: any(k == o or k.startswith(o + ':') or k.startswith(o + '#') for o in opens)
def where(k):
    kind, _, rest = k.partition(':'); return {'book': 'books/' + rest.split(':')[0] + '.js', 'law': 'CALCULATIONS.md', 'code': rest.split('#')[0], 'tool': rest}.get(kind, '')
report = []
for k in changed:
    what = 'added' if k not in sealed else 'removed' if k not in now else f'changed {sealed[k]["bytes"]} → {now[k]["bytes"]} bytes'
    report.append(f'- {k} · {where(k)} · {what}' + ('' if covered(k) else '  ← NOT ON THE PERMIT'))
    if not covered(k): bad.append(f'{k} changed without a permit ({what})')
    if CI: bad.append(f'{k} differs from the seal: build and seal it through publish.py')
locked = [k for k in now if k in sealed and now[k] == sealed[k]]
# the hunt: an opened code item may not name a shell (ask by tick or by book); in a locked item the same find is KNOWN, waiting for its permit
SHELLCODE = re.compile(r"['\"](?:" + '|'.join(sorted(BOOKS['shells'], key=len, reverse=True)) + r")['\"]|\b[A-Z]{1,2}\.(?:" + '|'.join(BOOKS['shells']) + r")\b")
for k in sorted(NOW):
    if not k.startswith('code:'): continue
    for m in SHELLCODE.finditer(NOW[k]):
        if k in changed: bad.append(f'{k}: a shell named in the code ({m.group(0)}): ask by tick or by book')
        else: warn.append(f'{k}: names {m.group(0)} (locked; clean it when a permit opens it)')
# the ratchet: an opened piece of game code may not hold more typed numbers or colours than it did when sealed
if sealed and os.path.exists('seal-numbers.json'):
    was = json.load(open('seal-numbers.json'))
    for k in changed:
        if k.startswith('code:') and k in NOW and k in was and NUM(NOW[k]) > was[k]: bad.append(f'{k} types more numbers or colours than it did ({was[k]} → {NUM(NOW[k])}): they belong in a book')
# INDEX.md and BOOKS.md, from the books; on GitHub they must already match
uses = {}
for b, entries in BOOKS.items():
    for c, e in entries.items():
        for q in e.get('law', []): uses.setdefault(q, []).append(c)
        for n in re.findall(r'N\d+', ' '.join(e.get('cite', []))): uses.setdefault(n, []).append(c)
out = ['# First Keep v100 · the Index', '', 'Written by `index.py` from the Books and the Laws, never by hand.', '', '## The Books', '', '| Book | Entries |', '|---|---|']
for b, entries in BOOKS.items(): out.append(f'| {b} | {len(entries)} |')
out += ['', '## By law (Book 1, CALCULATIONS.md)', '']
for q, (body, ns) in Q.items(): out.append(f'- **{q}** {body.split(":")[0]} → {", ".join(ns) or "design"}' + (f' · used by {", ".join(uses[q])}' if q in uses else ''))
out += ['', '## By citation', '']
for n, e in N.items():
    qs = [q for q, (_, ns) in Q.items() if n in ns]
    out.append(f'- **{n}** {"" if e["opened"] else "(from memory, to open) "}{e["text"][:120]} → {", ".join(qs + uses.get(n, [])) or "unused"}')
out += ['', '## Exceptions, named', '', f'- Tall (their own height): {", ".join(BOOKS["screen"][c]["key"] for c in tall)}', f'- Off the Build menu: {", ".join(SN["offmenu"])}']
out += ['', f'{sum(len(e) for e in BOOKS.values())} entries in {len(BOOKS)} books · {len(Q)} laws · {len(N)} citations, {sum(1 for e in N.values() if not e["opened"])} still to open · {len(NOW)} items sealed.']
if warn: out += ['', '## Waiting', ''] + [f'- {w}' for w in warn]
show = lambda v: json.dumps(v, ensure_ascii=False).replace('"', '').replace('|', '/')[:140]
pg = ['# First Keep v100 · the Books', '', 'Written by `index.py` from `books/*.js`, never by hand. Each book is the one home of what it holds; the game reads the files, this page shows them.', '']
for b, entries in BOOKS.items():
    pg += [f'## {b}', '', '| Code | Name | Value | Cited |', '|---|---|---|---|']
    for c, e in entries.items():
        if b == 'citations': pg.append(f'| {c} | {"opened" if e["opened"] else "to open"} | {e["text"][:140].replace("|", "/")} | |')
        elif b == 'shells': pg.append(f'| {c} | {e["name"]} | layer {e["layer"]} · {", ".join(e["ticks"]) or "no ticks"} | |')
        else: pg.append(f'| {c} | {e["name"]} | {show(e["value"])} | {"; ".join(e["cite"])[:80]} |')
    pg.append('')
pages = {'INDEX.md': '\n'.join(out) + '\n', 'BOOKS.md': '\n'.join(pg) + '\n'}
for f, t in pages.items():
    if CI:
        if disk(f) != t: bad.append(f'{f} differs from what the books say: written by hand, or not rebuilt')
    else: open(f, 'w').write(t)
print(f'{permit["build"] or "no permit"} · opens {len(opens)}/10 · {sum(len(e) for e in BOOKS.values())} entries, {len(Q)} laws, {len(N)} citations')
print(f'MODIFIED ({len(changed)}):'); print('\n'.join(report) or '- nothing')
print(f'LOCKED ({len(locked)} of {len(now)}): byte for byte as sealed, {sum(now[k]["bytes"] for k in locked):,} bytes')
for w in warn: print('KNOWN', w)
for x in bad: print('BROKEN', x)
print('PASS' if not bad else f'STOP: {len(bad)} broken')
sys.exit(1 if bad else 0)
