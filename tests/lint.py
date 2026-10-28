# Lint the joined game with ESLint (not part of the gate: ESLint is not always installed). Run:  python3 tests/lint.py
# Finds undefined names, duplicate keys, unreachable code and unused variables across the shared scope.
import glob, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js = ''.join(open(f).read() for f in sorted(glob.glob(os.path.join(ROOT, 'src/[0-9][0-9]-*.js'))))
os.makedirs('/tmp/fk-lint', exist_ok=True); open('/tmp/fk-lint/game.js', 'w').write(js)
eslint = next((p for p in ['/opt/node22/lib/node_modules/eslint/bin/eslint.js'] if os.path.exists(p)), None)
if not eslint: sys.exit('ESLint not found: install it (npm i -g eslint) and edit the path above')
sys.exit(subprocess.run(['node', eslint, '-c', os.path.join(ROOT, 'tests/lint/eslint.config.mjs'), '/tmp/fk-lint/game.js'], cwd='/tmp/fk-lint').returncode)
