# The start QC for any hand-off (Build 80). One command, the same checks every time:
#   python3 tests/handoff.py            everything: state, build, lint, the gate, the planted-bug check, what is owed
#   python3 tests/handoff.py --plant    only the planted-bug check (can the tests still fail?)
#   python3 tests/handoff.py --state    only the state and what is owed (no build, no tests)
# Exit 0 only if every check passed. A new session runs this first and reports every FAIL before it touches anything.
import os, re, shutil, subprocess, sys, tempfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PY = sys.executable
fails = []

def run(args, cwd=ROOT, timeout=900):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=timeout)
    return r.returncode, (r.stdout + r.stderr)

def say(ok, what, detail=''):
    print(('PASS ' if ok else 'FAIL ') + what + ((' ' + detail) if detail and not ok else ''))
    if not ok: fails.append(what)

# Each planted bug: a file, the text that is there now, the bug that replaces it, and the test that must then FAIL.
# If a planted bug passes, that test can no longer catch what it was written to catch.
PLANTS = [
  ('34-save.js', 'seenErr.size >= 2 || holdSave) return;', 'seenErr.size >= 2 || (holdSave && !force)) return;', 'tests/saves.py', 'a forced save overwrites the Resume save'),
  ('34-save.js', "localStorage.removeItem(SAVEKEY + '.bak'); // the backup goes too", '// the backup goes too', 'tests/saves.py', 'a finished game comes back from its backup'),
  ('12-sim-core.js', "dr = (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),", "dr = n.kind === 'fish' ? null : (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),", 'tests/moves.py', 'fish pay no walk home'),
  ('16-sim-fight.js', 'if (dx === 0 && dy === 0) {', 'if (false) {', 'tests/moves.py', 'two units on one spot never part'),
  ('40-emergency.js', " && u.state !== 'school'); // a student", '); // a student', 'tests/moves.py', 'a student is pulled out of the School'),
  ('14-sim-troops.js', 'sx = ((nx - u.x) / rd) * sp * dt,', 'sx = clamp(nx - u.x, -1, 1) * sp * dt,', 'tests/moves.py', 'a deer runs faster on a diagonal'),
  ('13-sim-civil.js', '< SEARCH.tau + SEARCH.give) {', '< -1) {', 'tests/moves.py', 'a villager drops its job the moment it loses its find'),
  ('08-core.js', '(C <= V ? 1 : V / C)', '(C <= V ? 1 : 1)', 'tests/science.py', 'Hawk-Dove always fights'),
  ('09-nav.js', 'Math.min(1, Math.max(0.25, dd / SLOWR))', '1', 'tests/moves.py', 'villagers never ease in'),
  ('08-core.js', 'if (b.mx && b.mx !== M) b.hp =', 'if (false) b.hp =', 'tests/moves.py', 'Masonry leaves a Town Center at 77%'),
  ('10-world.js', 'if (!onLand(fx, fy))', 'if (true)', 'tests/moves.py', 'fish sit on land'),
  ('37-events.js', "(G.diff === 'easy' ? 1 : 1 + levelOf(G.hz) / 10)", '(1 + levelOf(G.hz) / 10)', 'tests/moves.py', 'Easy keeps a hazard bonus'),
  ('16-sim-fight.js', "b.kind === 'throne' && b.owner === p.id && !b.gone", "b.kind === 'throne' && false", 'tests/moves.py', 'a fallen holder deletes the Throne'),
]

def plant_check():
    tmp = tempfile.mkdtemp(prefix='fk-plant-')
    try:
        for name in os.listdir(ROOT):
            if name in ('.git', 'node_modules', '__pycache__'): continue
            s, d = os.path.join(ROOT, name), os.path.join(tmp, name)
            (shutil.copytree if os.path.isdir(s) else shutil.copy2)(s, d)
        clean = {}
        for f, old, new, test, why in PLANTS:
            p = os.path.join(tmp, 'src', f)
            if f not in clean: clean[f] = open(p).read()
            src = clean[f]
            if old not in src:
                say(False, f'planted bug "{why}"', f'the text to plant in {f} is gone: update PLANTS in tests/handoff.py')
                continue
            open(p, 'w').write(src.replace(old, new, 1))
            c, out = run([PY, 'build.py'], cwd=tmp)
            if c: say(False, f'planted bug "{why}"', 'the build failed with the bug in'); open(p, 'w').write(src); continue
            c, out = run([PY, test], cwd=tmp)
            say(c != 0, f'planted bug "{why}" is caught by {test}', 'the test PASSED with the bug in: it cannot fail')
            open(p, 'w').write(src)
        if any(f for f in fails if f.startswith('planted')): pass
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

def state():
    c, out = run(['git', 'status', '--short'])
    say(not out.strip(), 'the working tree is clean (nothing uncommitted)', out.strip().replace('\n', ' | ')[:200])
    c, out = run(['git', 'log', '-1', '--format=%h %an <%ae> %s'])
    print('last commit:', out.strip())
    say('acohen2300@users.noreply.github.com' in out, 'the last commit is Albert\'s noreply address', out.strip())
    print('preview: https://acohen2300.github.io/first-keep/preview/   live: only on Albert\'s word')

def owed():
    print('\nOWED (read these before building anything):')
    for f in ('SCIENCE.md',):
        for line in open(os.path.join(ROOT, f)).read().splitlines():
            if re.search(r'not opened|from memory|unopened', line, re.I) and line.startswith('|'):
                print('  unverified source:', re.sub(r'\s+', ' ', line)[:170])
    cuts = open(os.path.join(ROOT, 'CUTS.md')).read().splitlines()
    for line in cuts[-60:]:
        if re.search(r'Not (yet|built)|owed|Honest note', line): print('  CUTS:', line[:200])
    print('  the decision record and the audit are in docs/v80 Audit/')

if __name__ == '__main__':
    only = sys.argv[1] if len(sys.argv) > 1 else ''
    state()
    if only != '--state':
        if only != '--plant':
            for a, name in (([PY, 'build.py'], 'build.py'), ([PY, 'wrap.py'], 'wrap.py'), ([PY, 'tests/lint.py'], 'lint')):
                c, out = run(a); say(c == 0, name + ' is clean', out[-300:])
            c, out = run([PY, 'tests/gate.py'], timeout=1200)
            for l in out.splitlines():
                if l.startswith('FAIL'): fails.append(l[:200]); print(l[:300])
            say(c == 0, 'the gate passes (science, history, tables, saves, moves, palette, words, four phone sizes, baseline)')
        plant_check()
    owed()
    print('\n' + ('START QC PASSED' if not fails else 'START QC FAILED: ' + str(len(fails)) + ' problem(s) above; report them before touching anything'))
    sys.exit(1 if fails else 0)
