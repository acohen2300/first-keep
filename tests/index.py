# The Index (Albert, Nov 4: "the cabinet"): INDEX.md, written from the code at every publish, as GUIDE.md is. Five Books, each a list of
# the files it holds and every top-level name in them with its line and its note; then every element card (ELEMENTS in src) as one row.
# Nothing here is typed by hand: change the code and the Index follows; a hand-written map would be a second home for every fact.
#   python3 tests/index.py          writes INDEX.md
#   python3 tests/index.py --check  exits 1 if INDEX.md is not what the code says
#   python3 tests/index.py --diff [ref]   the cards' log: what changed on every card since ref (HEAD), for the preview's CUTS section
import glob, os, re, sys, json, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
# The Books: which file is in which (the one table; a file not named here is listed under "Unfiled" so it cannot hide)
BOOKS = [
    ('Truth', 'the rules and the sim: every number, every behaviour, what the game is', [
        ('Rules', ['00-pre', '01-rules-basics', '02-rules-units', '03-rules-buildings', '04-rules-tech', '05-rules-wild', '06-rules-tuning']),
        ('World', ['10-world', '10-world-ground', '10-world-water', '10-world-forest', '10-world-plots', '10-world-movers', '10-world-citadel', '09-nav']),
        ('Sim', ['08-core', '11-orders', '12-sim-core', '13-sim-civil', '14-sim-troops', '15-sim-spatial', '16-sim-fight', '36-economy', '37-events', '38-camps', '39-games', '40-emergency']),
        ('Save and boot', ['34-save', '41-boot']),
    ]),
    ('Look', 'the pictures, the screens and the sound: how the truth is shown', [
        ('Art', ['18-figures', '19-building-art']),
        ('View', ['20-view-base', '21-view-frame', '22-view-fog', '23-view-things', '24-view-overlays', '25-view-weather']),
        ('Menus', ['26-input', '27-cards-core', '28-army-quick', '29-card-pages', '30-cards', '32-frame', '33-verbs', '39-huddle', 'shell-head', 'shell-tail']),
        ('Sound', ['35-sound']),
    ]),
    ('Words', 'every line the player reads', [('Text', ['07-text', '31-guide'])]),
    ('Minds', 'the computers and the natives: how the other sides think', [('Minds', ['17-ai', '38-natives'])]),
]
BINDER = [('docs/2 Rules/SCIENCE.md', 'every equation, its source and its code home'), ('docs/2 Rules/COLORS.md', 'every colour by name'),
          ('docs/2 Rules/EXCEPTIONS.md', 'every rule bent on purpose'), ('docs/3 Locks/Decisions/00 Index.md', 'every decision'), ('docs/5 Builds/v80/CUTS.md', 'every change and cut')]
DECL = re.compile(r'^(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)')
CONT = re.compile(r'^\t([A-Za-z_$][\w$]*)\s*=\s')   # a second name in the same const statement: "\tLMID = SQUARE / 2,"

def note_of(lines, i, line):
    """the note on a name: the comment on its line, else the comment line(s) just above, first sentence, short"""
    m = re.search(r'//\s*(.*)$', line)
    t = m.group(1) if m else ''
    if not t:
        j = i - 1; above = []
        while j >= 0 and lines[j].startswith('//') and not lines[j].startswith('// ═════') and not lines[j].startswith('// ─────'):
            above.insert(0, lines[j][2:].strip()); j -= 1
        t = ' '.join(above)
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.split(r'(?<=[a-z0-9\)])[.;:] (?=[A-Z])', t)[0]   # the first sentence
    return (t[:110] + '…') if len(t) > 112 else t

def names_in(path):
    lines = open(path).read().split('\n')
    out = []
    for i, line in enumerate(lines):
        m = DECL.match(line)
        if m: out.append((m.group(1) or m.group(2), i + 1, note_of(lines, i, line))); continue
        m = CONT.match(line)
        if m and out and re.sub(r'//.*$', '', lines[i - 1]).rstrip().endswith(','): out.append((m.group(1), i + 1, note_of(lines, i, line)))
    return lines, out

def header_of(lines, stem):
    for l in lines[:3]:
        m = re.match(r'// ═════ ' + re.escape(stem) + r'\.js: (.*?) ═════', l)
        if m: return m.group(1)
    for l in lines[:3]:
        m = re.search(r'<!--\s*(.*?)\s*-->', l)
        if m: return m.group(1)
    return ''

def build():
    src = {os.path.basename(f).rsplit('.', 1)[0]: f for f in sorted(glob.glob('src/*.js') + glob.glob('src/*.html'))}
    filed = set(); out = []
    out.append('# First Keep: the Index\n')
    out.append('Written from the code by `tests/index.py` at every publish (like `GUIDE.md`); never edited by hand. Five Books: what each file holds, every top-level name with its line and its note. Then every element card. The key to the Books, and the list of things that still have two homes, is `docs/0 Index/00 Books.md`.\n')
    total = 0
    for book, what, groups in BOOKS:
        out.append(f'\n## {book}: {what}\n')
        for group, stems in groups:
            out.append(f'\n### {group}\n')
            for stem in stems:
                if stem not in src: out.append(f'- `{stem}`: **missing**'); continue
                filed.add(stem)
                lines, names = names_in(src[stem]); total += len(names)
                out.append(f'\n**`{os.path.basename(src[stem])}`** ({len(lines)} lines): {header_of(lines, stem)}\n')
                for n, ln, note in names: out.append(f'- `{n}` {ln}' + (f': {note}' if note else ''))
    left = [s for s in src if s not in filed]
    if left:
        out.append('\n## Unfiled (name these in BOOKS, tests/index.py)\n')
        for stem in left: out.append(f'- `{os.path.basename(src[stem])}`')
    out.append('\n## Binder: the records the code points at\n')
    for p, what in BINDER: out.append(f'- `{p}`: {what}' + ('' if os.path.exists(p) else ' **missing**'))
    # the element cards: read from the built game (ELEMENTS, src/00-elements.js), so a card the build refused never shows here
    cards = elements()
    out.append('\n## Elements: one card each (ELEMENTS, `src/00-elements.js`)\n')
    if not cards: out.append('- none yet')
    else:
        slots = sorted({k for c in cards.values() for k in c})
        out.append('| element | ' + ' | '.join(slots) + ' |')
        out.append('|' + '---|' * (len(slots) + 1))
        for name, c in cards.items():
            out.append(f'| `{name}` | ' + ' | '.join(', '.join(f'`{v}`' for v in c.get(k, [])) if isinstance(c.get(k), list) else (f'`{c[k]}`' if k in c else '') for k in slots) + ' |')
    out.append(f'\n{len(src)} files, {total} names, {len(cards)} cards.\n')
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(out))

def elements():
    """the cards as the code holds them: ELEMENTS in src/00-elements.js, read by node so the Index shows what the game runs"""
    p = 'src/00-elements.js'
    if not os.path.exists(p): return {}
    js = open(p).read() + '\nconsole.log(JSON.stringify(ELEMENTS));'
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode: sys.exit('index refused: src/00-elements.js does not run alone: ' + r.stderr.strip()[:200])
    return json.loads(r.stdout.strip().splitlines()[-1])

def diff(ref='HEAD'):
    """the cards' log (Albert, Nov 4: "build 44 changed these: from x to y"): what changed on every card since ref, from the cards themselves"""
    r = subprocess.run(['git', 'show', f'{ref}:src/00-elements.js'], capture_output=True, text=True)
    old = {}
    if r.returncode == 0:
        q = subprocess.run(['node', '-e', r.stdout + '\nconsole.log(JSON.stringify(ELEMENTS));'], capture_output=True, text=True)
        if q.returncode == 0: old = json.loads(q.stdout.strip().splitlines()[-1])
    new = elements(); lines = []
    for el in sorted(set(old) | set(new)):
        if el not in old: lines.append(f'- card {el}: new'); continue
        if el not in new: lines.append(f'- card {el}: gone'); continue
        for slot in sorted(set(old[el]) | set(new[el])):
            a, b = old[el].get(slot, []), new[el].get(slot, [])
            if a != b: lines.append(f'- {el}.{slot}: {", ".join(a) or "—"} → {", ".join(b) or "—"}')
    return lines

if '--diff' in sys.argv:
    ref = sys.argv[sys.argv.index('--diff') + 1] if len(sys.argv) > sys.argv.index('--diff') + 1 and not sys.argv[sys.argv.index('--diff') + 1].startswith('-') else 'HEAD'
    print('\n'.join(diff(ref)) or f'the cards are as they were at {ref}'); sys.exit(0)
md = build()
if '--check' in sys.argv:
    cur = open('INDEX.md').read() if os.path.exists('INDEX.md') else ''
    if cur != md: print('FAIL INDEX.md is not what the code says: run  python3 tests/index.py'); sys.exit(1)
    print('PASS INDEX.md is what the code says'); sys.exit(0)
open('INDEX.md', 'w').write(md)
print('wrote INDEX.md')
