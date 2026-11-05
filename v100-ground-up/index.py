# The gate. Every check is an entry in books/rules.js; this file runs each by its key, in three stages: the books, the code, the seal.
#   python3 index.py          check; write INDEX.md, BOOKS.md and INVENTORY.md; report what changed against the seal and what stayed locked
#   python3 index.py --seal   after a passing build: seal every item (fingerprint, bytes, typed numbers) for the next permit
#   python3 index.py --ci     on GitHub: write nothing; the pages must already match, and nothing may differ from the seal
import json, re, glob, os, sys, hashlib, subprocess, tempfile
os.chdir(os.path.dirname(os.path.abspath(__file__))); CI, SEAL = '--ci' in sys.argv, '--seal' in sys.argv
CODE = ['index.html', 'menu.js', 'econ.js', 'combat.js', 'ai.js', 'sound.js']   # the game, in load order after the books
TOOLS = ['index.py', 'publish.py', 'test.py', '../.github/workflows/pages.yml']
text = lambda p: open(p, encoding='utf-8').read() if os.path.exists(p) else None
BOOKS = {m.group(1): json.loads(m.group(2)) for f in sorted(glob.glob('books/*.js')) for m in [re.search(r'BOOK\("(\w+)", ([\s\S]*)\);\s*$', text(f))]}
LAWS = {m.group(1): m.group(0) for m in re.finditer(r'(?m)^(Q[A-Z]+) .*$', text('CALCULATIONS.md'))}
def items():   # every sealed thing, id → text: a book entry, a law, a section of the world file, a module, a tool
    out = {f'book:{b}:{c}': json.dumps(e, sort_keys=True, ensure_ascii=False) for b, es in BOOKS.items() for c, e in es.items()}
    out.update({f'law:{q}': line for q, line in LAWS.items()})
    html = text('index.html'); a = html.index("<script>\n'use strict';"); parts = re.split(r'(?m)^(?=// ── )', html[a:])
    out['code:index.html#page'], out['code:index.html#frames'] = html[:a], parts[0]
    for p in parts[1:]: out['code:index.html#' + re.sub(r'\W+', '-', p[5:p.find('\n')][:40].split(':')[0].split('(')[0]).strip('-').lower()] = p
    out.update({'code:' + f: text(f) for f in CODE[1:]}); out.update({'tool:' + f.split('/')[-1]: text(f) for f in TOOLS if text(f) is not None})
    return out
NUM = lambda t: len(re.findall(r'(?<![\w.#$-])\d+\.?\d*(?![\w%])', t)) + 3 * len(re.findall(r'#[0-9a-fA-F]{6}\b', t))   # typed numbers; a colour counts three
NOW = items(); STAMP = {k: {'sha': hashlib.sha256(v.encode()).hexdigest(), 'bytes': len(v.encode()), 'numbers': NUM(v) if k.startswith('code:') else 0} for k, v in NOW.items()}
if SEAL: json.dump(dict(sorted(STAMP.items())), open('seal.json', 'w'), indent=0); print(f'sealed {len(STAMP)} items'); sys.exit(0)
RULES = {e['key']: e for e in BOOKS['rules'].values()}; bad, known, ran = [], [], set()
def rule(key, ok, msg):   # one check: a failure stops the build, named by its rule
    ran.add(key)
    if not ok: bad.append(f'[{key}] {msg}')
def book(name): return {e['key']: e['value'] for e in BOOKS[name].values()}
# ── 1. The books
HOME = {}
for b, es in BOOKS.items():
    for c in es: rule('home', c not in HOME, f'{c} is in {HOME.get(c)} and {b}'); HOME[c] = b
N = BOOKS['citations']
for b, es in BOOKS.items():
    if b == 'citations': continue
    for c, e in es.items():
        rule('cited', e.get('cite'), f'{c} ({b}) has no citation')
        for n in re.findall(r'N\d+', ' '.join(e.get('cite', []))): rule('cited', n in N, f'{c} cites {n}, not in the Citations book')
        for q in e.get('law', []): rule('laws', q in LAWS, f'{c} names law {q}, not in CALCULATIONS.md')
for q, line in LAWS.items():
    for n in re.findall(r'N\d+', line.split(' · ')[-1] if ' · ' in line else ''): rule('laws', n in N, f'{q} cites {n}, not in the Citations book')
CAPS, D, SN = book('capabilities'), BOOKS['measure'], book('screen')
def backed(code, s, need):   # a slot by name, or a D table that holds this shell's code; alternatives split by |
    return any((code in (D.get(alt, {}).get('value') or {})) if re.fullmatch(r'D\d+', alt) else s.get(alt) is not None for alt in need.split('|'))
def mold(code, s):
    m = CAPS.get(f'layer{s.get("layer")}', {'needs': [], 'may': []}); allowed = set(CAPS['shell']['needs'] + CAPS['shell']['may'] + m['needs'] + m['may'])
    for need in CAPS['shell']['needs'] + m['needs']: rule('mold', backed(code, s, need), f'{code} lacks {need}, which its mold needs')
    for t in s.get('ticks', []):
        rule('needs', t in CAPS, f'{code} ticks {t}, which no capability answers')
        for need in CAPS.get(t, {'needs': []})['needs']: rule('needs', backed(code, s, need), f'{code} ticks {t} but lacks {need}')
        allowed |= set(CAPS.get(t, {}).get('may', [])) | {n for n in CAPS.get(t, {'needs': []})['needs'] if not n.startswith('D')}
    for slot in s: rule('orphan', slot in allowed, f'{code} carries {slot}, which nothing it ticks asks for')
keys = lambda name: {e['key'] for e in BOOKS[name].values()}
def points(p): c, _, k = p.partition('.'); e = BOOKS.get(HOME.get(c, ''), {}).get(c); return e is not None and (not k or k in (e['value'] or {}))
for c, s in BOOKS['shells'].items():
    mold(c, s)
    for slot in ('amount', 'size', 'room', 'pace', 'rate'): rule('pointers', not s.get(slot) or points(s[slot]), f'{c}.{slot} points at {s.get(slot)}, not in a book')
    for k in [s.get('body'), s.get('mount')] + s.get('kit', []): rule('pointers', not k or k in keys('mass'), f'{c} is made of {k}, not in the Mass book')
    for k in (s.get('sound'), s.get('voice')): rule('pointers', not k or k in keys('sound'), f'{c} sounds {k}, not in the Sound book')
    rule('pointers', s['layer'] != 120 or s['look'] in keys('sprites'), f'{c} wears {s["look"]}, not in the Sprites book')
for c, e in BOOKS['screen'].items():
    if isinstance(e['value'], dict) and 'ticks' in e['value']: mold(c, {**e['value'], 'name': e['name'], 'cite': e['cite'], 'layer': 'page'})
for ev, s in book('sound')['on'].items(): rule('sounds', s in keys('sound'), f'event {ev} plays {s}, not in the Sound book')
listed = [c for v in SN['tabs'].values() for c in v]
for tab, codes in SN['tabs'].items():
    rule('tabs', len(codes) <= 9, f'Build tab {tab} holds {len(codes)}')
    for c in codes: rule('tabs', BOOKS['shells'].get(c, {}).get('layer') == 110, f'Build tab {tab} lists {c}, not a building')
for c, s in BOOKS['shells'].items():
    if s['layer'] == 110: rule('once', listed.count(c) == 1 or (c in SN['offmenu'] and not listed.count(c)), f'{c} is on the Build menu {listed.count(c)} times')
# ── 2. The code
SEALED = json.load(open('seal.json')) if os.path.exists('seal.json') else {}
PERMIT = json.load(open('permit.json')); OPEN = PERMIT['opens']; GROW = PERMIT.get('grow', {})
opened = lambda k: any(k == o or k.startswith(o + ':') or k.startswith(o + '#') for o in OPEN)
changed = sorted(k for k in set(STAMP) | set(SEALED) if STAMP.get(k, {}).get('sha') != SEALED.get(k, {}).get('sha'))
SHELL = re.compile(r"['\"](?:" + '|'.join(sorted(BOOKS['shells'], key=len, reverse=True)) + r")['\"]|\b[A-Z]{1,2}\.(?:" + '|'.join(BOOKS['shells']) + r")\b")
for k, t in NOW.items():
    if not k.startswith('code:'): continue
    for m in SHELL.finditer(t):
        if k in changed: rule('names', False, f'{k} names {m.group(0)}: ask by tick or by book')
        else: known.append(f'{k} names {m.group(0)} (locked; clean it when a permit opens it)')
    ran.add('names'); rule('typedD', not re.search(r'Object\.assign\(D,|const D = \{', t), f'{k} types numbers into D')
script = lambda f: '\n'.join(re.findall(r'<script>([\s\S]*?)</script>', text(f))) if f.endswith('.html') else text(f)
for f in CODE:
    for ln, line in enumerate(script(f).split('\n'), 1):
        c = re.search(r'(?<![:"\'\\])//(.*)$', line)
        rule('swallowed', not (c and re.search(r'\w\(.*\)\s*;\s*($|\w|\})', c.group(1)) and not re.search(r'[\'"`]', c.group(1)[:3])), f'{f}:{ln} a comment ends in a statement')
rule('version', not re.search(r'v100 · \d', text('index.html')), 'index.html types the version; it lives in D171')
def parses(key, name, js):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as t: t.write(js)
    r = subprocess.run(['node', '--check', t.name], capture_output=True, text=True); os.unlink(t.name)
    rule(key, r.returncode == 0, f'{name} does not parse: {(r.stderr.strip().splitlines() or [""])[-1][:100]}')
for f in CODE: parses('parse', f, script(f))
parses('joined', 'the whole game, joined', '\n'.join(text(p) for p in sorted(glob.glob('books/*.js'))) + '\n' + '\n'.join(script(f) for f in CODE))
# ── 3. The seal
rule('permit', len(OPEN) <= 10, f'the permit opens {len(OPEN)} items: ten at most')
report = []
for k in changed:
    was, now = SEALED.get(k), STAMP.get(k); what = 'added' if not was else 'removed' if not now else f'{was["bytes"]:,} → {now["bytes"]:,} bytes'
    report.append(f'- {k} · {what}' + ('' if opened(k) else '  ← NOT ON THE PERMIT')); rule('permit', opened(k), f'{k} changed without a permit ({what})')
    if CI: rule('seals', False, f'{k} differs from the seal: build and seal it through publish.py')
    if was and now and k.startswith('code:'):
        rule('ratchet', now['numbers'] <= was['numbers'], f'{k} types more numbers or colours ({was["numbers"]} → {now["numbers"]}): they belong in a book')
        rule('budget', now['bytes'] <= was['bytes'] + GROW.get(k, 0), f'{k} grew {now["bytes"] - was["bytes"]:,} bytes past its seal; the permit grants {GROW.get(k, 0):,}')
locked = [k for k in STAMP if k in SEALED and k not in changed]; ran.update({'seals', 'ratchet', 'budget'})
known += [f'{w}: a reading waiting for its new home' for w in SN['waiting']]
# ── the pages, written from the books (INDEX: the cross-references; BOOKS: every book; INVENTORY: the building's scaffolding and its change)
uses = {}
for b, es in BOOKS.items():
    for c, e in es.items():
        for r in e.get('law', []) + re.findall(r'N\d+', ' '.join(e.get('cite', []))): uses.setdefault(r, []).append(c)
idx = ['# First Keep v100 · the Index', '', 'Written by `index.py`, never by hand.', '', '## By law', ''] + [f'- **{q}** {l[len(q) + 1:].split(":")[0]} → {", ".join(re.findall(r"N\d+", l.split(" · ")[-1])) or "design"}' + (f' · used by {", ".join(uses[q])}' if q in uses else '') for q, l in LAWS.items()]
idx += ['', '## By citation', ''] + [f'- **{n}** {"" if e["opened"] else "(to open) "}{e["text"][:110]} → {", ".join([q for q, l in LAWS.items() if n in l] + uses.get(n, [])) or "unused"}' for n, e in N.items()]
idx += ['', '## Named exceptions', '', f'- Tall: {", ".join(e["key"] for e in BOOKS["screen"].values() if "Tall" in (e["value"].get("ticks", []) if isinstance(e["value"], dict) else []))}', f'- Off the Build menu: {", ".join(SN["offmenu"])}']
cell = lambda v: json.dumps(v, ensure_ascii=False).replace('"', '').replace('|', '/')[:140]
pg = ['# First Keep v100 · the Books', '', 'Written by `index.py` from `books/*.js`, never by hand.', '']
for b, es in BOOKS.items():
    pg += [f'## {b}', '', '| Code | Name | Value | Cited |', '|---|---|---|---|'] + [f'| {c} | {e.get("name", "")} | {cell(e.get("value", e.get("text", e.get("ticks"))))} | {"; ".join(e.get("cite", []))[:80] if b != "citations" else ("opened" if e["opened"] else "to open")} |' for c, e in es.items()] + ['']
def size(k): t = NOW[k]; return t.count('\n'), len(t), len(t.encode())
delta = lambda k: '' if SEALED.get(k, {}).get('bytes') in (None, STAMP[k]['bytes']) else f' ({STAMP[k]["bytes"] - SEALED[k]["bytes"]:+,})'
inv = ['# First Keep v100 · Inventory', '', f'Written by `index.py` at every build, never by hand. Version {book("measure")["version"]}; the change in brackets is against the last seal.', '', '| Group | Items | Lines | Characters | Bytes |', '|---|---|---|---|---|']
for g, pre in (('Game code', 'code:'), ('Books', 'book:'), ('Laws', 'law:'), ('Tools', 'tool:')):
    ks = [k for k in NOW if k.startswith(pre)]; s = [sum(size(k)[i] for k in ks) for i in range(3)]; d = sum(STAMP[k]['bytes'] - SEALED.get(k, STAMP[k])['bytes'] for k in ks)
    inv.append(f'| {g} | {len(ks)} | {s[0]:,} | {s[1]:,} | {s[2]:,}{f" ({d:+,})" if d else ""} |')
inv += ['', '## The trades (code)', '', '| Item | Lines | Characters | Bytes | Typed numbers |', '|---|---|---|---|---|'] + [f'| {k[5:]} | {size(k)[0]:,} | {size(k)[1]:,} | {size(k)[2]:,}{delta(k)} | {STAMP[k]["numbers"]} |' for k in NOW if k.startswith('code:')]
inv += ['', '## The books', '', '| Book | Entries | Bytes |', '|---|---|---|'] + [f'| {b} | {len(es)} | {len(text(f"books/{b}.js").encode()):,} |' for b, es in BOOKS.items()]
inv += ['', '## The shells', '', '| Layer | Shells | Ticking nothing yet |', '|---|---|---|'] + [f'| {L} | {sum(1 for s in BOOKS["shells"].values() if s["layer"] == L)} | {sum(1 for s in BOOKS["shells"].values() if s["layer"] == L and not s["ticks"])} |' for L in (100, 110, 120)]
inv += ['', '## The rules', '', '| Code | Rule | Stage | Stops |', '|---|---|---|---|'] + [f'| {c} | {e["key"]} | {e["value"]["stage"]} | {e["name"]} |' for c, e in BOOKS['rules'].items()]
inv += ['', f'{len(STAMP)} items sealed · {sum(len(es) for es in BOOKS.values())} book entries · {len(LAWS)} laws · {len(N)} citations, {sum(1 for e in N.values() if not e["opened"])} still to open · {len(known)} known']
PAGES = {'INDEX.md': idx, 'BOOKS.md': pg, 'INVENTORY.md': inv}
for f, lines in PAGES.items():
    t = '\n'.join(lines) + '\n'
    if CI: rule('pages', text(f) == t, f'{f} is not what the books say: written by hand, or not rebuilt')
    else: open(f, 'w').write(t)
ran.add('pages')
for k, e in RULES.items():
    if e['value']['stage'] != 'page': rule('rules', k in ran, f'rule {k} is in the book but nothing runs it')
print(f'{PERMIT["build"] or "no permit"} · opens {len(OPEN)}/10 · {sum(len(es) for es in BOOKS.values())} entries, {len(LAWS)} laws, {len(N)} citations')
print(f'MODIFIED ({len(changed)}):'); print('\n'.join(report) or '- nothing')
print(f'LOCKED ({len(locked)} of {len(STAMP)}): byte for byte as sealed, {sum(STAMP[k]["bytes"] for k in locked):,} bytes')
for w in known: print('KNOWN', w)
for x in bad: print('BROKEN', x)
print('PASS' if not bad else f'STOP: {len(bad)} broken'); sys.exit(1 if bad else 0)
