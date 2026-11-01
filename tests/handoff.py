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

# Each planted bug: a file, the text that is there now, the bug that replaces it, the test that must then FAIL, why, and the words the test's
# FAIL line must carry. If a planted bug passes, that test can no longer catch what it was written to catch. The test is first run on the
# clean copy (it must pass), and a planted bug counts as caught only by a test failure that names it: a crash, a page error or a build that
# breaks catches nothing (Build 80 preview 9; before, any non-zero exit counted).
PLANTS = [
  # save safety (tests/saves.py)
  ('34-save.js', 'seenErr.size >= 2 || holdSave) return;', 'seenErr.size >= 2 || (holdSave && !force)) return;', 'tests/saves.py', 'a forced save overwrites the Resume save', 'a forced save overwrote'),
  ('34-save.js', "localStorage.removeItem(SAVEKEY + '.bak'); // the backup goes too", '// the backup goes too', 'tests/saves.py', 'a finished game comes back from its backup', 'clearSave left'),
  ('34-save.js', "if (cardLocked() && !e.target.closest('#card')) e.stopPropagation();", ';', 'tests/saves.py', 'a tap outside the Welcome back card opens another card', 'got through'),
  ('34-save.js', "localStorage.setItem(SAVEKEY + '.old' + S.v,", "localStorage.setItem(SAVEKEY + '.old',", 'tests/saves.py', 'stale saves share one slot', 'share one slot'),
  ('34-save.js', "e.kind === 'wildfire') endEvent();", "e.kind === 'wildfire') G.ev.cur = null;", 'tests/saves.py', 'an event dropped on load is not ended', 'was not ended'),
  ('35-sound.js', "CHAN[name] === 'alert' || n <=", 'n <=', 'tests/saves.py', 'an alert waits for a voice', 'an alert waits'),
  ('40-emergency.js', "on('hands') || 'warn'", "'warn'", 'tests/saves.py', 'All hands never shows on', 'All hands is on'),
  # movement and work (tests/moves.py)
  ('12-sim-core.js', "dr = (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),", "dr = n.kind === 'fish' ? null : (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),", 'tests/moves.py', 'fish pay no walk home', 'a fish far from'),
  ('16-sim-fight.js', 'if (dx === 0 && dy === 0) {', 'if (false) {', 'tests/moves.py', 'two units on one spot never part', 'did not part'),
  ('40-emergency.js', " && u.state !== 'school'); // a student", '); // a student', 'tests/moves.py', 'a student is pulled out of the School', 'out of the School'),
  ('14-sim-troops.js', 'sx = ((nx - u.x) / rd) * sp * dt,', 'sx = clamp(nx - u.x, -1, 1) * sp * dt,', 'tests/moves.py', 'a deer runs faster on a diagonal', 'a deer runs'),
  ('08-core.js', 'if (b.mx && b.mx !== M) b.hp =', 'if (false) b.hp =', 'tests/moves.py', 'Masonry leaves a Town Center at 77%', 'Masonry left'),
  ('10-world.js', 'if (!onLand(fx, fy))', 'if (true)', 'tests/moves.py', 'fish sit on land', 'a fish sits on land'),
  ('37-events.js', "(G.diff === 'easy' ? 1 : 1 + levelOf(G.hz) / 10)", '(1 + levelOf(G.hz) / 10)', 'tests/moves.py', 'Easy keeps a hazard bonus', 'Easy keeps'),
  ('16-sim-fight.js', "b.kind === 'throne' && b.owner === p.id && !b.gone", "b.kind === 'throne' && false", 'tests/moves.py', 'a fallen holder deletes the Throne', 'the Throne was deleted'),
  ('13-sim-civil.js', 'if (b.hp >= maxHpB(o, b.kind) - 0.5) {\n\t\tbackToWork(u);', 'if (b.hp >= maxHpB(o, b.kind) - 0.5) {\n\t\tsetJob(u, null);', 'tests/moves.py', 'a repair that ends forgets the old job', 'is whole does not send'),
  # Build 80 preview 9, one or more for each fix
  ('15-sim-spatial.js', 'if (U.temper) return !(onMe(v, me) || (', 'if (U.temper) return !(false || (', 'tests/moves.py', 'a soldier bitten by a wolf does not fight back', 'a wolf biting it'),
  ('08-core.js', 'm.owner === o && isSoldier(m) && m.hp > 0', 'm.owner === o && m.hp > 0', 'tests/moves.py', 'the attacked villager is one of the eyes', "side's eyes"),
  ('13-sim-civil.js', 'u.next = n && !n.hunt ? n.id : null;', 'u.next = null;', 'tests/moves.py', 'the find seen when the last ran out is forgotten', 'was never taken'),
  ('13-sim-civil.js', 'lost ? u.anchor || dropFor(u.owner, u.job, u) || u : undefined', 'lost ? u : undefined', 'tests/moves.py', 'the search runs from where the villager stands, not the anchor', 'did not start from the drop-off'),
  ('12-sim-core.js', ': dist(nearest(drops, n) || keepOf(u.owner) || n, n) > DANGER_R.far))', ': false))', 'tests/moves.py', 'no leash from the drop-off', 'past the leash'),
  ('12-sim-core.js', 'if (!mates.has(n)) continue;', 'continue;', 'tests/moves.py', 'a friend\'s find does not count', 'a friend is working'),
  ('13-sim-civil.js', 'u.nnT = G.t + SEARCH.again + rng(); // nothing in reach', 'setJob(u, null); // nothing in reach', 'tests/moves.py', 'a villager with nothing in reach gives up its job', 'gave up its job'),
  ('13-sim-civil.js', 'if (!u.job || u.hunt || (u.node && u.node.amt > 0)) {', 'if (!u.job || u.hunt) {', 'tests/moves.py', 'the search clock survives a new find', 'kept the old search clock'),
  ('13-sim-civil.js', 'const p = spotAt(b, u.spot.i);', 'const p = spotAt(b, 0);', 'tests/moves.py', 'every waiter is sent to one point', 'not at their own spots'),
  ('16-sim-fight.js', 'if (!blockedCell(gcell(ax, ay), a.owner)) stepTo(a, ax, ay);', 'if (!blockedCell(gcell(ax, ay), a.owner)) (a.x = ax), (a.y = ay);', 'tests/moves.py', 'a push glides', 'a push moves'),
  ('09-nav.js', 'stepTo(u, nx, ny); // the walk counts', 'u.x = nx; u.y = ny; if (m > 0.3) u.st.walk += m; // the walk counts', 'tests/moves.py', 'a small move glides', 'under 0.3'),
  ('14-sim-troops.js', 'U.raid ? U.raid + 40 : WILD_LOOK,', "U.temper === 'defend' ? 45 : U.raid ? U.raid + 40 : WILD_LOOK,", 'tests/moves.py', 'boar and bear react only at 45', 'does not react'),
  ('23-view-things.js', 'B.h * Math.min(1, e.prog)', 'B.h', 'tests/moves.py', 'a site casts a full building\'s shadow', 'quarter raised'),
  ('23-view-things.js', 'if (HEX.k === k) return HEX.pts;', '', 'tests/moves.py', 'the shadow shape is made again every time', 'made again'),
  ('13-sim-civil.js', 't = ((i % k) * 2 * R) / k - R;', 't = ((i % k) * 2 * R) / k - R + R / k / 2;', 'tests/moves.py', 'waiting spots crowd at the corners', 'ft apart, under'),
  ('12-sim-core.js', 'u.anchor ? dist(u.anchor, n) > SEARCH.x + SEARCH.y :', 'u.anchor ? false :', 'tests/moves.py', 'no cap for a placed villager', 'past the cap'),
  ('13-sim-civil.js', 'lost ? u.anchor || dropFor(u.owner, u.job, u) || u : undefined', 'lost ? dropFor(u.owner, u.job, u) || u : undefined', 'tests/moves.py', 'a placed villager searches from the drop-off', 'search from where it was placed'),
  ('34-save.js', "['pointerdown', 'pointermove', 'pointerup', 'click', 'wheel']", "['pointerdown', 'pointermove', 'pointerup', 'click']", 'tests/saves.py', 'the wheel zooms behind the Welcome back card', 'the wheel zoomed'),
  ('08-core.js', '(C <= V ? 1 : V / C)', '(C <= V ? 1 : 1)', 'tests/science.py', 'Hawk-Dove always fights', 'hawk V<C'),
]

def plant_check():
    print(f'planted bugs: {len(PLANTS)}')
    tmp = tempfile.mkdtemp(prefix='fk-plant-')
    try:
        for name in os.listdir(ROOT):
            if name in ('.git', 'node_modules', '__pycache__'): continue
            s, d = os.path.join(ROOT, name), os.path.join(tmp, name)
            (shutil.copytree if os.path.isdir(s) else shutil.copy2)(s, d)
        c, out = run([PY, 'build.py'], cwd=tmp)
        say(c == 0, 'the clean copy builds', out[-300:])
        clean_ok = {}
        for test in sorted({p[3] for p in PLANTS}):
            c, out = run([PY, test], cwd=tmp)
            clean_ok[test] = c == 0
            say(c == 0, f'{test} passes on the clean copy (the control run)', out[-300:])
        clean = {}
        for f, old, new, test, why, expect in PLANTS:
            p = os.path.join(tmp, 'src', f)
            if f not in clean: clean[f] = open(p).read()
            src = clean[f]
            if old not in src:
                say(False, f'planted bug "{why}"', f'the text to plant in {f} is gone: update PLANTS in tests/handoff.py')
                continue
            if not clean_ok[test]:
                say(False, f'planted bug "{why}"', f'{test} fails on the clean copy, so it proves nothing'); continue
            open(p, 'w').write(src.replace(old, new, 1))
            try:
                c, out = run([PY, 'build.py'], cwd=tmp)
                if c: say(False, f'planted bug "{why}"', 'the build failed with the bug in: a broken build is not a caught bug'); continue
                c, out = run([PY, test], cwd=tmp)
                fail_line = any(l.startswith('FAIL ') and expect in l for l in out.splitlines())
                crashed = 'Traceback' in out
                say(c != 0 and fail_line and not crashed, f'planted bug "{why}" is caught by {test}',
                    'the test PASSED with the bug in: it cannot fail' if c == 0 else 'the test crashed instead of failing' if crashed else f'the test failed, but not with "{expect}": ' + out.strip()[-200:])
            finally:
                open(p, 'w').write(src)
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
    # one maintained list: the "Owed" section of the Build List (Build 80 preview 9; before, old CUTS lines were grepped, and built items printed as owed)
    print('\nOWED (docs/Build List - v80 - Post Clean - Working.md, section "Owed"; read these before building anything):')
    lines = open(os.path.join(ROOT, 'docs', 'Build List - v80 - Post Clean - Working.md')).read().split('\n## Owed', 1)
    if len(lines) < 2: say(False, 'the Build List has an "Owed" section'); return
    for line in lines[1].split('\n## ', 1)[0].splitlines()[1:]:
        if line.startswith('- '): print('  ' + line)
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
