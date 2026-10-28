# The one way a build goes live. It builds, runs the whole gate, and only then copies to index.html and preview/, commits and pushes.
# It also installs a pre-push hook that refuses any push where index.html is not a build the gate passed, so a push by hand is refused too.
#   python3 publish.py "Build 38: what changed"
import hashlib, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
STAMP = 'tests/gate-passed.sha'   # the sha256 of the last first-keep.html the gate passed, written only by this script
HOOK = '''#!/bin/sh
# installed by publish.py: a push must carry an index.html the gate passed
cd "$(git rev-parse --show-toplevel)" || exit 1
want=$(cat tests/gate-passed.sha 2>/dev/null); have=$(sha256sum index.html | cut -c1-64)
if [ "$want" != "$have" ]; then echo "push refused: index.html is not a build the gate passed. Use: python3 publish.py \\"message\\""; exit 1; fi
'''
def sha(p): return hashlib.sha256(open(p, 'rb').read()).hexdigest()
def run(*a): r = subprocess.run(a); return r.returncode == 0
def install_hook():
    d = subprocess.run(['git', 'rev-parse', '--git-path', 'hooks'], capture_output=True, text=True).stdout.strip(); os.makedirs(d, exist_ok=True)
    p = os.path.join(d, 'pre-push'); open(p, 'w').write(HOOK); os.chmod(p, 0o755)
install_hook()
if len(sys.argv) < 2: sys.exit('usage: python3 publish.py "Build NN: what changed"')
msg = sys.argv[1]
if not run(sys.executable, 'build.py') or not run(sys.executable, 'wrap.py'): sys.exit('publish refused: the build failed')
if not run(sys.executable, 'tests/gate.py'): sys.exit('publish refused: the gate failed. Nothing was copied, committed or pushed.')
open(STAMP, 'w').write(sha('first-keep.html') + '\n')
for dst in ('index.html', 'preview/index.html'): open(dst, 'wb').write(open('first-keep.html', 'rb').read())
trailer = os.environ.get('TRAILER', '')
if not run('git', 'add', '-A') or not run('git', 'commit', '-q', '-m', msg + ('\n\n' + trailer if trailer else '')): sys.exit('nothing to commit, or the commit failed')
if not run('git', 'fetch', '-q', 'origin', 'main'): sys.exit('could not fetch; not pushed')
if not run('git', 'push', 'origin', 'HEAD:main'): sys.exit('the push was refused')
print('live in a minute or two: https://acohen2300.github.io/first-keep')
