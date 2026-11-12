# The gate. Every check is an entry in books/rules.js; this file runs each by its key, in three stages: the books, the code, the seal.
#   python3 index.py          check; write the pages (INDEX, CITATIONS, INDEX-CITATIONS) and INVENTORY.md; report what changed against the seal and what stayed locked
#   python3 index.py --seal   after a passing build: seal every item (fingerprint, bytes, typed numbers) for the next permit
#   python3 index.py --ci     on GitHub: write nothing; the pages must already match, and nothing may differ from the seal
#   python3 index.py --survey ../mid ../map   (paths from this folder) read another game (Mid) with the same measures; hold it to its seal; write its map
import json, re, glob, os, sys, hashlib, subprocess, tempfile
os.chdir(os.path.dirname(os.path.abspath(__file__))); CI, SEAL = '--ci' in sys.argv, '--seal' in sys.argv
CODE = ['index.html', 'menu.js', 'econ.js', 'combat.js', 'ai.js', 'sound.js']   # the game, in load order after the books
TOOLS = ['index.py', 'publish.py', 'test.py', 'ship.py', '../../.github/workflows/pages.yml']
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
NCODE = re.compile(r'N\d+')   # a citation code (outside the f-string: Python before 3.12 forbids a backslash inside one)
NUM = lambda t: len(re.findall(r'(?<![\w.#$-])\d+\.?\d*(?![\w%])', t)) + len(re.findall(r'(?<![\w#$-])\d*\.?\d+(?:px|ms|s|em|rem|vh|vw|deg|%)\b', t)) + 3 * len(re.findall(r'#[0-9a-fA-F]{6}\b', t))   # typed numbers, with a unit too (N6, item 1: 14px, 0.3s and .5 got through); a colour counts three
SHELL = re.compile(r"['\"](?:" + '|'.join(sorted(BOOKS['shells'], key=len, reverse=True)) + r")['\"]|\b[A-Z]{1,2}\.(?:" + '|'.join(BOOKS['shells']) + r")\b")   # a shell named in code
BYNAME = re.compile(r"\b(?:kind|type|code)\s*[!=]==?\s*['\"]\w+['\"]")   # a thing asked what it is by a typed name
def SWALLOW(line): c = re.search(r'(?<![:"\'\\])//(.*)$', line); return bool(c and re.search(r'\w\(.*\)\s*;\s*($|\w|\})', c.group(1)) and not re.search(r'[\'"`]', c.group(1)[:3]))
NOW = items(); STAMP = {k: {'sha': hashlib.sha256(v.encode()).hexdigest(), 'bytes': len(v.encode()), 'numbers': NUM(v) if k.startswith('code:') else 0} for k, v in NOW.items()}
def survey(ref, out):   # Frankenstein Refresh: the reference game (Mid) read with the gate's own measures; it changes nothing there but its first seal
    files = sorted(glob.glob(f'{ref}/src/[0-9][0-9]-*.js')); page, js = text(f'{ref}/index.html'), ''.join(text(f) for f in files); bad = []
    stamp = {os.path.relpath(f, ref): {'sha': hashlib.sha256(text(f).encode()).hexdigest(), 'lines': text(f).count('\n'), 'chars': len(text(f)), 'bytes': len(text(f).encode())} for f in [f'{ref}/index.html'] + files}
    if not os.path.exists(f'{ref}/seal.json'): json.dump(stamp, open(f'{ref}/seal.json', 'w'), indent=0)   # sealed once, held to it ever after
    bad += [f'[frozen] {f} differs from its seal' for f in set(stamp) | set(json.load(open(f'{ref}/seal.json'))) if stamp.get(f) != json.load(open(f'{ref}/seal.json')).get(f)]
    build = lambda t: re.sub(r'const BUILD = \d+;', '', t).strip()   # Mid's build.py stamps its build number in; the rest must match exactly
    if build(js) != build(page[page.index('<script>') + 8:page.rindex('</script>')]): bad.append('[frozen] the parts in src/ do not rebuild the page')
    DEF = re.compile(r'(?m)^(?:async\s+)?function\*?\s+([\w$]+)|^(?:const|let|var|class)\s+([\w$]+)')
    words = {}
    for w in re.findall(r'[A-Za-z_$][\w$]*', re.sub(r'(?m)(?<![:"\'\\])//.*$|/\*[\s\S]*?\*/', '', js)): words[w] = words.get(w, 0) + 1   # comments do not count as use
    pieces = []   # file, section, name, text: every file cut at its headers, every section at its top-level names
    for f in files:
        for sec in re.split(r'(?m)^(?=// ──)', text(f)):
            head = re.sub(r'^// ─+\s*|\s*─+\s*$', '', sec.split('\n')[0]).replace('|', '/') if sec.startswith('// ──') else '(top of the file)'
            cuts = [0] + [m.start() for m in DEF.finditer(sec) if m.start()] + [len(sec)]
            for a, b in zip(cuts, cuts[1:]):
                if a < b: m = DEF.match(sec, a); pieces.append((os.path.basename(f), head[:70], (m.group(1) or m.group(2)) if m else '', sec[a:b]))
    if ''.join(p[3] for p in pieces) != js: bad.append('[frozen] the map\'s pieces do not add back up to the parts')
    dirt = lambda t: (NUM(t), len(BYNAME.findall(t)) + len(SHELL.findall(t)), sum(map(SWALLOW, t.split('\n'))))
    row = lambda ps: [len(ps), sum(p[3].count('\n') for p in ps), sum(len(p[3]) for p in ps), sum(len(p[3].encode()) for p in ps)] + [sum(dirt(p[3])[i] for p in ps) for i in range(3)] + [sum(1 for p in ps if p[2] and words.get(p[2], 0) < 2)]
    fmt = lambda name, r: f'| {name} | ' + ' | '.join(f'{v:,}' for v in r) + ' |'
    HEAD = '| Pieces | Lines | Characters | Bytes | Typed numbers | Asks by name | Swallowed | Named nowhere else |'
    groups = json.load(open(f'{out}/groups.json')) if os.path.exists(f'{out}/groups.json') else {}
    by = lambda key: {k: [p for p in pieces if key(p) == k] for k in dict.fromkeys(key(p) for p in pieces)}
    m = ['# Mid · the map', '', f'Written by `v100/index.py --survey`, never by hand. Mid is frozen: {len(files)} parts in `mid/src/`, sealed; joined, they are `mid/index.html` byte for byte.', '',
         'Typed numbers: numbers and colours typed into code (they belong in a book). Asks by name: `kind === \'tree\'` and the like (ask by tick). Swallowed: a comment ending in code. Named nowhere else: a top-level name used nowhere but where it is made (dead, or an entry point).', '',
         '## The whole', '', '| What ' + HEAD, '|---' * 9 + '|', fmt('Mid', row(pieces)), '', '## By group (step 3, from `groups.json`)', '', '| Group | Into v100 ' + HEAD, '|---' * 10 + '|']
    m += [f'| {g} | {groups.get("homes", {}).get(g, "")} ' + fmt('', row(ps))[3:] for g, ps in by(lambda p: groups.get('files', {}).get(p[0], 'ungrouped')).items()]
    m += ['', '## By part', '', '| Part | Group ' + HEAD, '|---' * 10 + '|'] + [f'| {f} | {groups.get("files", {}).get(f, "ungrouped")} ' + fmt('', row(ps))[3:] for f, ps in by(lambda p: p[0]).items()]
    m += ['', '## By section', '', '| Part | Section ' + HEAD, '|---' * 10 + '|'] + [f'| {f} | {s} ' + fmt('', row(ps))[3:] for (f, s), ps in by(lambda p: (p[0], p[1])).items()]
    n = ['# Mid · every piece', '', 'Written by `v100/index.py --survey`, never by hand: every top-level name in Mid, in order.', '', '| Part | Section | Name | Lines | Bytes | Typed numbers | Asks by name | Swallowed | Used elsewhere |', '|---' * 9 + '|']
    n += [f'| {p[0]} | {p[1]} | {p[2] or "(before the first name)"} | {p[3].count(chr(10)):,} | {len(p[3].encode()):,} | ' + ' | '.join(map(str, dirt(p[3]))) + f' | {max(words.get(p[2], 0) - 1, 0) if p[2] else ""} |' for p in pieces]
    stage, temp, raw = f'{ref}/../staging', groups.get('staging', {}), lambda f: open(f, 'rb').read()
    bookof = lambda f: temp[groups['files'][os.path.basename(f)]]   # a part's temp book
    if '--stage' in sys.argv and not os.path.exists(stage):   # step 5, once: every part into its group's temp book, exactly as it is, in Mid's order
        os.makedirs(stage); json.dump([[bookof(f), os.path.basename(f), len(raw(f))] for f in files], open(f'{stage}/order.json', 'w'), indent=0)
        for b in dict.fromkeys(map(bookof, files)): open(f'{stage}/{b}', 'wb').write(b''.join(raw(f) for f in files if bookof(f) == b))
    if os.path.exists(stage):   # ever after: the temp books, read back in Mid's order, are Mid's parts byte for byte, with nothing left over
        order, at, tb = json.load(open(f'{stage}/order.json')), {}, {}
        for b, part, size in order:
            tb.setdefault(b, raw(f'{stage}/{b}')); got = tb[b][at.get(b, 0):at.get(b, 0) + size]; at[b] = at.get(b, 0) + size
            if got != raw(f'{ref}/src/{part}'): bad.append(f'[frozen] staging/{b} does not give back {part} byte for byte')
        bad += [f'[frozen] staging/{b} holds {len(t) - at[b]:,} bytes Mid does not' for b, t in tb.items() if len(t) != at[b]]
        bad += [f'[frozen] staging/{f} is not in the order' for f in os.listdir(stage) if f not in tb and f != 'order.json']
        sorts = {b: json.load(open(f'{ref}/../clean/{b[:-3]}.json'))['pieces'] for b in tb if os.path.exists(f'{ref}/../clean/{b[:-3]}.json')}   # step 6: each piece's line in its temp book's sort (X43)
        names = {b: [p[2] for p in pieces if p[2] and bookof(p[0]) == b] for b in tb}
        for b, L in sorts.items(): bad += [f'[sorted] staging/{b}: {n} has no line' for n in names[b] if n not in L] + [f'[sorted] staging/{b}: {n} is not one of its pieces' for n in L if n not in names[b]] + [f'[sorted] staging/{b}: {n} is "{L[n][0]}"' for n in L if L[n][0] not in ('in v100', 'bring', 'cut', 'parked')]
        tally = lambda b: ', '.join(f'{sum(1 for v in sorts[b].values() if v[0] == s)} {s}' for s in ('in v100', 'bring', 'cut', 'parked')) if b in sorts else 'not yet'
        m += ['', '## Staging (steps 4 and 5): the temp books, every line of Mid as it is; and the sort (step 6)', '', '| Temp book | Group | Parts | Lines | Characters | Bytes | Sorted (step 6) |', '|---|---|---|---|---|---|---|']
        m += [f'| {b} | {next(g for g, x in temp.items() if x == b)} | {sum(1 for o in order if o[0] == b)} | {t.count(10):,} | {len(t.decode()):,} | {len(t):,} | {tally(b)} |' for b, t in tb.items()]
        m += [f'| **all** | {len(tb)} temp books | {len(order)} | {sum(t.count(10) for t in tb.values()):,} | {sum(len(t.decode()) for t in tb.values()):,} | {sum(map(len, tb.values())):,} | {sum(map(len, sorts.values()))} of {sum(map(len, names.values())):,} pieces |']
    os.makedirs(out, exist_ok=True); open(f'{out}/MAP.md', 'w').write('\n'.join(m) + '\n'); open(f'{out}/PIECES.md', 'w').write('\n'.join(n) + '\n')
    print(f'Mid: {len(files)} parts, {len(pieces):,} pieces, {sum(s["lines"] for f, s in stamp.items() if f != "index.html"):,} lines; map written to {out}'); [print('BROKEN', x) for x in bad]
    print('PASS' if not bad else f'STOP: {len(bad)} broken'); sys.exit(1 if bad else 0)
if '--survey' in sys.argv: a = sys.argv.index('--survey'); survey(sys.argv[a + 1], sys.argv[a + 2])
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
    if b in ('citations', 'comments'): continue   # the two books of words: sources and whys
    for c, e in es.items():
        rule('cited', e.get('cite'), f'{c} ({b}) has no citation')
        for t in e.get('cite', []): rule('cited', re.fullmatch(r'N\d+', t), f'{c} ({b}) cites by typed text, not by code: {t[:60]}')   # every citation is an entry in the Citations book
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
    rule('pointers', s['layer'] != 120 or s['look'] in keys('sprites'), f'{c} wears {s.get("look")}, not in the Sprites book')
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
for k, t in NOW.items():
    if not k.startswith('code:'): continue
    for m in SHELL.finditer(t):
        if k in changed: rule('names', False, f'{k} names {m.group(0)}: ask by tick or by book')
        else: known.append(f'{k} names {m.group(0)} (locked; clean it when a permit opens it)')
    ran.add('names'); rule('typedD', not re.search(r'Object\.assign\(D,|const D = \{', t), f'{k} types numbers into D')
script = lambda f: '\n'.join(re.findall(r'<script>([\s\S]*?)</script>', text(f))) if f.endswith('.html') else text(f)
for f in CODE:
    for ln, line in enumerate(script(f).split('\n'), 1):
        rule('swallowed', not SWALLOW(line), f'{f}:{ln} a comment ends in a statement')
EC = BOOKS['comments']; EUSE = {}   # a comment in code is only its code: the why lives once in the Comments book
for k, t in NOW.items():
    if not k.startswith('code:'): continue
    for line in (script(k[5:].split('#')[0]) if '#' not in k else t).split('\n'):
        c = re.search(r'(?<![:"\'\\])//(.*)$', line)
        if not c: continue
        m = re.fullmatch(r'\s*(?:── [^(]*\((E\d+)\)|(E\d+))\s*', c.group(1))
        rule('comments', m, f'{k} comments in words, not by code: {c.group(1).strip()[:50]}')
        if m: e = m.group(1) or m.group(2); EUSE.setdefault(e, []).append(k); rule('comments', e in EC, f'{k} names {e}, not in the Comments book')
for e in EC: rule('comments', e in EUSE, f'{e} is in the Comments book but no code names it')
for k, t in NOW.items():   # G1: the stats are read through FK.stat (and its row), never raw, outside the door that holds stat itself
    if k.startswith('code:') and k != 'code:index.html#the-door': rule('rawstats', not re.search(r'\bD\.stats\[|\bstats\[', t), f'{k} reads the raw stats table: ask FK.stat')
MEAS = book('measure'); TABLES = {'Health': MEAS['buildTime'], 'Research': {e['value']['at']: 1 for e in BOOKS['tech'].values() if e['value'].get('at')}, 'Spawn': MEAS['trains'], 'Field|Make': MEAS['ai.plots']}
for need, tab in TABLES.items():   # G2: a shell a table names has the ticks that table's work asks of it
    for c in tab: rule('ticked', c not in BOOKS['shells'] or any(x in BOOKS['shells'][c]['ticks'] for x in need.split('|')), f'{c} is in a {need} table but does not tick {need}')
rule('version', not re.search(r'v100 · \d', text('index.html')), 'index.html types the version; it lives in D171')
def parses(key, name, js):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as t: t.write(js)
    r = subprocess.run(['node', '--check', t.name], capture_output=True, text=True); os.unlink(t.name)
    rule(key, r.returncode == 0, f'{name} does not parse: {(r.stderr.strip().splitlines() or [""])[-1][:100]}')
for f in CODE: parses('parse', f, script(f))
parses('joined', 'the whole game, joined', '\n'.join(text(p) for p in sorted(glob.glob('books/*.js'))) + '\n' + '\n'.join(script(f) for f in CODE))
KEYS = "const ts = require('typescript'), fs = require('fs'); for (const f of process.argv.slice(1)) { const sf = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), 99, true, 1); (function walk(n) { if (ts.isObjectLiteralExpression(n)) { const seen = new Set(); for (const p of n.properties) { if (!p.name || ts.isComputedPropertyName(p.name) || ts.isGetAccessor(p) || ts.isSetAccessor(p)) continue; const k = p.name.text; if (seen.has(k)) console.log(f.split('/').pop().replace('__', '/') + ':' + (sf.getLineAndCharacterOfPosition(p.getStart()).line + 1) + ' ' + k); seen.add(k); } } ts.forEachChild(n, walk); })(sf); }"
with tempfile.TemporaryDirectory() as d:   # X77: the later of two equal keys silently wins (B6's two home verbs)
    for f in CODE + sorted(glob.glob('books/*.js')): open(os.path.join(d, f.replace('/', '__')), 'w').write(script(f) if f in CODE else text(f))
    r = subprocess.run(['node', '-e', KEYS, *glob.glob(os.path.join(d, '*'))], capture_output=True, text=True, env={**os.environ, 'NODE_PATH': subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()})
rule('unique', not r.returncode and not r.stdout.strip(), f"the same key twice: {r.stdout.strip() or r.stderr.strip()[:200]}")
# ── 3. The seal
report = []; ran.add('permit')   # the permit's check runs on every change below, and on none when nothing changed
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
xc = ['# First Keep v100 · 3. Index and Citations (the cross-check)', '', 'Written by `index.py`, never by hand. Every law and every entry matched to its citations, and every citation to what uses it.', '', '## By law', ''] + [f'- **{q}** {l[len(q) + 1:].split(":")[0]} → {", ".join(NCODE.findall(l.split(" · ")[-1])) or "design"}' + (f' · used by {", ".join(uses[q])}' if q in uses else '') for q, l in LAWS.items()]
xc += ['', '## By citation', ''] + [f'- **{n}** {"" if e["opened"] else "(to open) "}{e["text"][:110]} → {", ".join([q for q, l in LAWS.items() if n in l] + uses.get(n, [])) or "unused"}' for n, e in N.items()]
xc += ['', '## Named exceptions', '', f'- Tall: {", ".join(e["key"] for e in BOOKS["screen"].values() if "Tall" in (e["value"].get("ticks", []) if isinstance(e["value"], dict) else []))}', f'- Off the Build menu: {", ".join(SN["offmenu"])}']
xc += ['', '## Sounds waiting for a feature', ''] + [f'- **{e["key"]}** ({c}) waits for {e["waits"]}' for c, e in BOOKS['sound'].items() if e.get('waits')]
cell = lambda v: json.dumps(v, ensure_ascii=False).replace('"', '').replace('|', '/')[:140]
pg = ['# First Keep v100 · 1. the Index', '', 'Written by `index.py` from `books/*.js`, never by hand: every entry of every book by its code, and the codes it cites.', '']
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
ci = ['# First Keep v100 · 2. the Citations', '', 'Written by `index.py` from `books/citations.js`, never by hand: every source by its code.', '', '| Code | Kind | Opened | Source |', '|---|---|---|---|'] + [f'| {n} | {e.get("kind", "source")} | {"yes" if e["opened"] else "to open"} | {e["text"]} |' for n, e in N.items()]
KNOWN_CODES = set(HOME) | set(LAWS); codes_in = lambda t: [x for x in dict.fromkeys(re.findall(r'\b[A-Z]{1,3}\d*[A-Z]?\d*\b', t)) if x in KNOWN_CODES]
cm = ['# First Keep v100 · 4. the Comments', '', 'Written by `index.py` from `books/comments.js`, never by hand: every why, by its code, and where the code names it.', '', '| Code | In | Why |', '|---|---|---|'] + [f'| {e} | {", ".join(dict.fromkeys(x[5:] for x in EUSE.get(e, [])))} | {v["text"].replace("|", "/")} |' for e, v in EC.items()]
cites = lambda c: ', '.join(re.findall(r'N\d+', LAWS[c].split(' · ')[-1])) if c in LAWS else ', '.join(BOOKS[HOME[c]][c].get('cite', [])) if c in HOME and HOME[c] not in ('citations', 'comments') else ''
ms = ['# First Keep v100 · 5. the Master (index, citations and comments)', '', 'Written by `index.py`, never by hand: each part of the code, the whys it carries (E), and the laws (Q) and book entries each why names, with their citations (N). From any line: why, by what math, from what source.', '']
for k in [k for k in NOW if k.startswith('code:')]:
    es = [e for e, ks in EUSE.items() if k in ks]
    ms += ['', f'## {k[5:]}', ''] + [f'- **{e}** {EC[e]["text"][:90]}' + ''.join(f' · {c}{" (" + cites(c) + ")" if cites(c) else ""}' for c in codes_in(EC[e]['text'])) for e in es]
PAGES = {'INDEX.md': pg, 'COMMENTS.md': cm, 'MASTER.md': ms, 'CITATIONS.md': ci, 'INDEX-CITATIONS.md': xc, 'INVENTORY.md': inv}
for f, lines in PAGES.items():
    t = '\n'.join(lines) + '\n'
    if CI: rule('pages', text(f) == t, f'{f} is not what the books say: written by hand, or not rebuilt')
    else: open(f, 'w').write(t)
ran.add('pages')
UNITS = {'tiles', 'seconds', 'ms', 'share', 'count', 'unset', 'none', 'pixels', 'per second', 'times'}; unset = 0   # N27 (#2): every measured number carries its unit and its subject as book fields; a unit is set only where the code or the entry itself proves it, and the count still unset may only fall (X94)
def _num(v): return (not isinstance(v, bool)) and (isinstance(v, (int, float)) or (isinstance(v, list) and any(_num(x) for x in v)) or (isinstance(v, dict) and any(_num(x) for x in v.values())))
for c, e in BOOKS['measure'].items():
    rule('units', 'unit' in e and bool(e.get('subject')), f'{c} has no unit or no subject field'); u, v = e.get('unit'), e['value']
    if isinstance(v, dict): rule('units', isinstance(u, dict) and all(k in v and x in UNITS for k, x in u.items()), f'{c} names a unit for a key it does not hold, or a unit not in the list'); unset += sum(1 for k, x in v.items() if _num(x) and k not in (u or {}))
    else: rule('units', u in UNITS, f'{c}: unit {u!r} is not in the list'); unset += u == 'unset'
rule('units', unset <= RULES['units']['value']['unset'], f'{unset} numbers have no unit set; the rule allows {RULES['units']['value']['unset']}: set units, never raise the count')
for k, e in RULES.items():
    if e['value']['stage'] not in ('page', 'survey'): rule('rules', k in ran, f'rule {k} is in the book but nothing runs it')
print(f'{PERMIT["build"] or "no permit"} · opens {len(OPEN)}/10 · {sum(len(es) for es in BOOKS.values())} entries, {len(LAWS)} laws, {len(N)} citations')
print(f'MODIFIED ({len(changed)}):'); print('\n'.join(report) or '- nothing')
print(f'LOCKED ({len(locked)} of {len(STAMP)}): byte for byte as sealed, {sum(STAMP[k]["bytes"] for k in locked):,} bytes')
for w in known: print('KNOWN', w)
for x in bad: print('BROKEN', x)
print('PASS' if not bad else f'STOP: {len(bad)} broken'); sys.exit(1 if bad else 0)
