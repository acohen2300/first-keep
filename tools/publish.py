# The one way a build reaches the phone: the check, then the stitched page pushed to the site's `fresh/` folder.
#   python3 tools/publish.py "what the build is" [--same-play | --accept]
# The site is served from the branch `main`; this adds or replaces only its `fresh/` folder. If the check fails, nothing is published.
import os, pathlib, subprocess, sys, tempfile
import ship
ROOT = pathlib.Path(__file__).resolve().parent.parent
def git(*a, cwd=ROOT):
    r = subprocess.run(['git', *a], cwd=cwd, capture_output=True, text=True)
    if r.returncode: sys.exit(f'STOP at git {a[0]}: {r.stderr.strip()[:300]}')
    return r.stdout.strip()
what = next((a for a in sys.argv[1:] if not a.startswith('--')), None) or sys.exit('say what the build is')
if git('status', '--porcelain'): sys.exit('STOP: commit the work first; a preview is always a commit')
if subprocess.run([sys.executable, 'check.py', *[a for a in sys.argv[1:] if a.startswith('--')]], cwd=ROOT / 'tools').returncode: sys.exit('STOP: the check failed; nothing published')
at = git('rev-parse', '--short', 'HEAD')
with tempfile.TemporaryDirectory() as tmp:
    site = pathlib.Path(tmp) / 'site'
    git('fetch', '--depth', '1', 'origin', 'main'); git('worktree', 'add', '--detach', str(site), 'FETCH_HEAD')
    try:
        size = ship.ship(site / 'fresh')
        git('add', 'fresh', cwd=site)
        git('commit', '-q', '-m', f"Fresh preview ({at}): {what}\n\n{os.environ.get('TRAILER', '')}".strip(), cwd=site)
        git('-c', 'push.negotiate=true', 'push', '-q', 'origin', 'HEAD:main', cwd=site)
    finally: git('worktree', 'remove', '--force', str(site))
print(f'published {at}: {what} ({size:,} bytes) → /first-keep/fresh/')
