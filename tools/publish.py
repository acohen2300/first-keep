# The one way a build reaches the phone: the check, then the stitched page pushed to its own folder `fresh/vN/` (Albert, Nov 22 21:03: each new build
# needs a new link, so a game in progress is never met by a newer build); `fresh/` itself only sends the phone to the newest vN.
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
        (site / 'fresh').mkdir(exist_ok=True)
        n = max([int(d.name[1:]) for d in (site / 'fresh').iterdir() if d.is_dir() and d.name[1:].isdigit() and d.name[0] == 'v'] or [100]) + 1
        size = ship.ship(site / 'fresh' / f'v{n}')
        for f in ('index.html', 'sw.js', 'manifest.webmanifest'): (site / 'fresh' / f).unlink(missing_ok=True)
        (site / 'fresh' / 'index.html').write_text(ship.door(f'v{n}/'), encoding='utf-8')
        git('add', '-A', 'fresh', cwd=site)
        git('commit', '-q', '-m', f"Fresh preview v{n} ({at}): {what}\n\n{os.environ.get('TRAILER', '')}".strip(), cwd=site)
        git('-c', 'push.negotiate=true', 'push', '-q', 'origin', 'HEAD:main', cwd=site)
    finally: git('worktree', 'remove', '--force', str(site))
print(f'published v{n} ({at}): {what} ({size:,} bytes) → https://acohen2300.github.io/first-keep/fresh/v{n}/')
