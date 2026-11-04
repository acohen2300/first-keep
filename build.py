import glob, re, subprocess, sys, os
# Joins src/ into first-keep.html, and refuses to when the joined game is broken:
# a syntax error, or one top-level name declared twice (the files share one scope, so a second
# function of the same name silently replaces the first; Build 23 lost the towers that way).
files = sorted(glob.glob('src/[0-9][0-9]-*.js'))
js = ''.join(open(f).read() for f in files)
names = {}
for f in files:
    prev = ''
    for n, line in enumerate(open(f), 1):
        m = re.match(r'(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)', line)
        if not m and n > 1 and re.sub(r'//.*$', '', prev).rstrip().endswith(','): m = re.match(r'\t([A-Za-z_$][\w$]*)\s*=\s', line)   # a second name in one const statement ("\tLMID = SQUARE / 2,"), counted since preview 52 (the cards name them)
        prev = line
        if m:
            k = m.group(1) or (m.group(2) if m.re.groups > 1 else None)
            if k in names: sys.exit(f'build refused: {k} declared twice ({names[k]} and {f}:{n})')
            names[k] = f'{f}:{n}'
# the cards (src/00-elements.js, Albert, Nov 4): every slot present, every name in acts, logic, pings and art a top-level name declared once
# (names above), every layer one of LAYERS. A hole refuses the build: the builder who left it fixes it, not the player. The rest of a card
# (impacts, math, orders, buildings, exempt) is checked against the running game by tests/elements.py in the gate.
import json
SLOTS = ['impacts', 'acts', 'logic', 'math', 'orders', 'pings', 'buildings', 'layers', 'art', 'exempt']
r = subprocess.run(['node', '-e', open('src/00-elements.js').read() + '\nconsole.log(JSON.stringify([LAYERS, ELEMENTS]))'], capture_output=True, text=True)
if r.returncode: sys.exit('build refused: src/00-elements.js does not run alone: ' + r.stderr.strip()[:200])
LAYERS, ELEMENTS = json.loads(r.stdout.strip().splitlines()[-1])
for el, card in ELEMENTS.items():
    for slot in SLOTS:
        if slot not in card or not isinstance(card[slot], list) or (not card[slot] and slot != 'exempt'): sys.exit(f'build refused: the card {el} has no {slot} (every slot is a list of names; only exempt may be empty)')
    for slot in ('acts', 'logic', 'pings', 'art', 'exempt'):
        for n in card[slot]:
            if n not in names: sys.exit(f'build refused: the card {el} names {n} in {slot}, which is not a top-level name declared once in src/')
    for n in card['layers']:
        if n not in LAYERS: sys.exit(f'build refused: the card {el} writes a layer that is not in LAYERS: {n}')
    if len(set(card['acts']) & set(card['exempt'])): sys.exit(f'build refused: the card {el} both acts with and is exempt from {set(card["acts"]) & set(card["exempt"])}')
# a research id used twice would make the second unreachable (Build 57 found 'inoculation' and 'rotation' twice): refuse it
ids = {}
for n, line in enumerate(open('src/04-rules-tech.js'), 1):
    m = re.match(r"\s*id: '([a-z_0-9]+)',", line)
    if m:
        if m.group(1) in ids: sys.exit(f'build refused: research id {m.group(1)} used twice (lines {ids[m.group(1)]} and {n})')
        ids[m.group(1)] = n
# a // comment that ends in a statement has swallowed code (Build 38's battalion line): refuse it, as SoRen's build does
def comment_of(line):
    q = None; i = 0
    while i < len(line) - 1:
        c = line[i]
        if q:
            if c == '\\': i += 2; continue
            if c == q: q = None
        elif c in '\'"`': q = c
        elif c == '/' and line[i + 1] == '/': return line[i + 2:].strip()
        i += 1
for f in files:
    for n, line in enumerate(open(f), 1):
        c = comment_of(line)
        # Build 41: a comment that ends in an assignment is refused too (one swallowed the raid clock)
        if c and re.search(r'\w\(.*\)\s*;\s*(\},?)?\s*$', c): sys.exit(f'build refused: {f}:{n} a comment ends in code: ...{c[-60:]}')
        if c and (re.search(r'(;|\))\s*(if \(|for \(|while \(|[A-Za-z_$][\w$.\[\]]*\s*([*+/-]?=[^=]|\())', c) or re.search(r'\b[A-Za-z_$][\w$]*(\.[\w$]+)+\s*=\s*[^=\s][^;]*;\s*$', c)): sys.exit(f'build refused: {f}:{n} a comment holds statements (code swallowed?): ...{c[:70]}')   # Build 39: statements hid in a comment and every rank upgrade lost its numbers
# the build number has one home, the latest "## Build NN" section of the versions' CUTS.md (docs/5 Builds/vNN/CUTS.md); the game shows it (Build 60: the code said 41 for nineteen builds)
BUILD_NO = max(int(n) for f in glob.glob('docs/5 Builds/*/CUTS.md') for n in re.findall(r'^## Build (\d+)', open(f).read(), re.M))
js, nb = re.subn(r'const BUILD = \d+;', f'const BUILD = {BUILD_NO};', js, count=1)
if not nb: sys.exit('build refused: const BUILD not found in src/01')
os.makedirs('/tmp/fk-build', exist_ok=True)
open('/tmp/fk-build/game.js', 'w').write(js)
r = subprocess.run(['node', '--check', '/tmp/fk-build/game.js'], capture_output=True, text=True)
if r.returncode: sys.exit('build refused: syntax error\n' + r.stderr.strip())
# the fonts travel inside the file: no network call, the same look offline (subset to the letters the game uses; licences in src/fonts)
import base64
face = lambda fam, f, w: "@font-face{font-family:'%s';font-weight:%s;font-display:swap;src:url(data:font/woff;base64,%s) format('woff')}" % (fam, w, base64.b64encode(open('src/fonts/' + f, 'rb').read()).decode())
fonts = '<style>' + face('IM Fell English SC', 'fell-sc.woff', 400) + face('Barlow Semi Condensed', 'barlow.woff', 600) + '</style>'   # two fonts (v80, Albert): Fell for titles, Barlow for the rest at one weight, 600, one file
h = open('src/shell-head.html').read().replace('<!--FONTS-->', fonts)
t = open('src/shell-tail.html').read()
i = h.index('\n<div id="app">')   # the head's part ends where the markup starts
open('first-keep.html', 'w').write('<!doctype html>\n<html lang="en">\n<head>\n' + h[:i] + '\n</head>\n<body>' + h[i:] + js.rstrip('\n') + '\n' + t + '\n</body>\n</html>\n')
