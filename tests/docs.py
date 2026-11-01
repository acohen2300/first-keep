# The docs check (Build 80 preview 11, Albert, Nov 1): run by tests/handoff.py.   python3 tests/docs.py
#   1. Every line added or changed in a living doc (START-HERE.md and docs/1 to docs/5) since the last commit's parent ends with a stamp,
#      " [YYYY-MM-DD HH:MM]" (Eastern time). A line that already stood, word for word, in any doc of that commit was moved or copied
#      unedited and needs no stamp. Blank lines need none.
#   2. Closed records (docs/6 Records/) never change: every closed record of the last commit and of its parent is still there, byte for byte
#      (moving it is allowed; a new record may be added).
#   3. Every path named in START-HERE.md's reading order exists.
# The base is the parent of the last commit (HEAD~1), so the check covers the last commit and anything not yet committed.
# FK_REPO names the git repository when the files checked are a copy (the planted-bug check runs in a temporary copy).
import os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('FK_REPO', ROOT)
STAMP = re.compile(r' \[\d{4}-\d\d-\d\d \d\d:\d\d\]$')
CLOSED = 'docs/6 Records/'
TEXT = ('.md', '.txt')
fails = []

def git(*a):
    return subprocess.run(['git', '-C', REPO, *a], capture_output=True).stdout

def say(ok, what, detail=''):
    print(('PASS ' if ok else 'FAIL ') + what + ((': ' + detail) if detail and not ok else ''))
    if not ok: fails.append(what)

def living(p):
    return p == 'START-HERE.md' or (p.startswith('docs/') and not p.startswith(CLOSED) and p.endswith('.md'))

base = 'HEAD~1' if git('rev-parse', '-q', '--verify', 'HEAD~1').strip() else 'HEAD'
names = [n for n in git('ls-tree', '-r', '-z', '--name-only', base).decode().split('\0') if n]
old = {n: git('show', f'{base}:{n}') for n in names if n.endswith(TEXT) or n.startswith(CLOSED) or n.startswith('docs/')}
pool = set()
for n, b in old.items():
    if n.endswith(TEXT): pool.update(l.rstrip() for l in b.decode('utf-8', 'replace').split('\n'))

now = {}
for top in ('docs',):
    for d, _, fs in os.walk(os.path.join(ROOT, top)):
        for f in fs:
            p = os.path.relpath(os.path.join(d, f), ROOT).replace(os.sep, '/')
            now[p] = open(os.path.join(d, f), 'rb').read()
if os.path.exists(os.path.join(ROOT, 'START-HERE.md')): now['START-HERE.md'] = open(os.path.join(ROOT, 'START-HERE.md'), 'rb').read()

# 1. stamps
bad = []
for p, b in sorted(now.items()):
    if not living(p): continue
    for i, l in enumerate(b.decode('utf-8', 'replace').split('\n'), 1):
        l = l.rstrip()
        if l.strip() and l not in pool and not STAMP.search(l): bad.append(f'{p}:{i} "{l[:60]}"')
say(not bad, f'every added or changed line in a living doc ends with a stamp (against {base})', f'{len(bad)} line(s) with no stamp: ' + '; '.join(bad[:5]))

# 2. closed records
held = {b for p, b in now.items() if p.startswith(CLOSED)}
closed = {f'{c}:{n}': git('show', f'{c}:{n}') for c in {base, 'HEAD'} for n in git('ls-tree', '-r', '-z', '--name-only', c, CLOSED).decode().split('\0') if n}
gone = [n for n, b in closed.items() if b not in held]   # every closed record of the last commit and of its parent, still there byte for byte
say(not gone, 'the closed records (docs/6 Records/) are unchanged', 'closed record changed or removed: ' + '; '.join(gone[:5]))

# 3. the reading order
start = now.get('START-HERE.md', b'').decode()
paths = sorted({m for m in re.findall(r'`([^`]+)`', start) if (m.startswith(('docs/', 'tests/', 'mockups/')) and (m.endswith('/') or '.' in m.rsplit('/', 1)[-1]) and 'NN' not in m) or m in ('GUIDE.md', 'START-HERE.md')})
missing = [m for m in paths if not os.path.exists(os.path.join(ROOT, m))]
say(bool(start) and not missing, f'every file in the reading order exists ({len(paths)} named in START-HERE.md)', 'missing: ' + '; '.join(missing[:5]) if start else 'START-HERE.md is missing')
sys.exit(1 if fails else 0)
