# The one way v100 is published: the gate, then the tests; if both pass, the build is logged in BUILDS.md, sealed for the next permit,
# the permit cleared, and the whole committed as Albert's no-reply address and pushed. If either fails, nothing is committed.
#   TRAILER="Co-Authored-By: …\nClaude-Session: …" python3 publish.py "what the build is"
import os, sys, json, subprocess, datetime
os.chdir(os.path.dirname(os.path.abspath(__file__))); run = lambda *a: subprocess.run(a, capture_output=True, text=True)
if len(sys.argv) < 2: sys.exit('say what the build is: python3 publish.py "…"')
for step in ('index.py', 'test.py'):
    r = run(sys.executable, step); print(r.stdout[-1800:])
    if r.returncode: sys.exit(f'STOP: {step} failed; nothing published')
    if step == 'index.py': gate = r.stdout
    else: tests = r.stdout.strip().splitlines()[-1]
permit = json.load(open('permit.json')); total = open('INVENTORY.md').read().strip().splitlines()[-1]
with open('BUILDS.md', 'a') as f:   # the record, appended, never edited
    f.write(f"\n## {permit['build']} · {datetime.datetime.now():%Y-%m-%d %H:%M}\n{permit['agreed']}\nOpened: {', '.join(permit['opens'])}\n"
            + '\n'.join(l for l in gate.splitlines() if l.startswith(('- ', 'MODIFIED', 'LOCKED'))) + f'\nTests: {tests}\nInventory: {total}\n')
print(run(sys.executable, 'index.py', '--seal').stdout)
json.dump({'build': '', 'agreed': '', 'opens': []}, open('permit.json', 'w'), indent=1)   # the next build starts with nothing open
msg = f"{sys.argv[1]}\n\n{os.environ.get('TRAILER', '').replace(chr(92) + 'n', chr(10))}"
for a in (['git', 'add', '-A', '.', '../.github', '../docs/4 Now/Parked.md'], ['git', '-c', 'user.name=Albert', '-c', 'user.email=acohen2300@users.noreply.github.com', 'commit', '-q', '-m', msg],
          ['git', 'pull', '-q', '--rebase', 'origin', 'main'], ['git', 'push', '-q', 'origin', 'HEAD:main']):
    r = run(*a)
    if r.returncode: sys.exit(f'STOP at {" ".join(a[:2])}: {r.stderr.strip()[:300]}')
print('published:', sys.argv[1])
