# The one way v100 is published. It runs the gate and the tests; if both pass it logs the build, seals it for the next permit, clears the permit,
# commits as Albert's no-reply address and pushes. If either fails, nothing is committed.
#   TRAILER="Co-Authored-By: …\nClaude-Session: …" python3 publish.py "what the build is"
import os, sys, json, subprocess, datetime
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
run = lambda *a: subprocess.run(a, capture_output=True, text=True)
if len(sys.argv) < 2: sys.exit('say what the build is: python3 publish.py "…"')
gate = run(sys.executable, 'index.py'); print(gate.stdout[-2500:])
if gate.returncode: sys.exit('STOP: the gate failed; nothing published')
tests = run(sys.executable, 'test.py'); print(tests.stdout[-1500:])
if tests.returncode: sys.exit('STOP: the tests failed; nothing published')
permit = json.load(open('permit.json'))
report = [l for l in gate.stdout.splitlines() if l.startswith(('- ', 'MODIFIED', 'LOCKED'))]
stamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
with open('BUILDS.md', 'a') as f:   # the record: every build's permit and what it changed, appended, never edited
    f.write(f"\n## {permit['build']} · {stamp}\n{permit.get('agreed', '')}\nOpened: {', '.join(permit['opens'])}\n" + '\n'.join(report) + f"\nTests: {tests.stdout.strip().splitlines()[-1]}\n")
seal = run(sys.executable, 'index.py', '--seal'); print(seal.stdout)
json.dump({'build': '', 'agreed': '', 'opens': []}, open('permit.json', 'w'), indent=1)   # the next build starts with nothing open
for a in (['git', 'add', '-A', '.', '../.github/workflows/pages.yml', '../docs/4 Now/Parked.md'],
          ['git', '-c', 'user.name=Albert', '-c', 'user.email=acohen2300@users.noreply.github.com', 'commit', '-q', '-m', f"{sys.argv[1]}\n\n{os.environ.get('TRAILER', '').replace(chr(92) + 'n', chr(10))}"],
          ['git', 'pull', '-q', '--rebase', 'origin', 'main'], ['git', 'push', '-q', 'origin', 'HEAD:main']):
    r = run(*a)
    if r.returncode: sys.exit(f'STOP at {" ".join(a[:3])}: {r.stderr.strip()[:300]}')
print('published:', sys.argv[1])
