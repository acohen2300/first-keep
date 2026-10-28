# Format the source with Prettier (the settings are in .prettierrc). 00-pre and the end of 39-boot hold the two halves of the one scope's wrapper,
# so 39-boot is formatted inside a temporary wrapper. Run:  python3 tests/fmt.py   (then build and run the gate: formatting must change nothing)
import glob, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
def pretty(text, name):
    p = subprocess.run(['prettier', '--config', '.prettierrc', '--stdin-filepath', name], input=text, capture_output=True, text=True)
    if p.returncode: sys.exit(f'prettier failed on {name}:\n{p.stderr[:600]}')
    return p.stdout
for f in sorted(glob.glob('src/[0-9][0-9]-*.js')):
    s = open(f).read()
    if f.endswith('00-pre.js'): continue
    if f.endswith('39-boot.js'):
        assert s.rstrip().endswith('})();'); body = s.rstrip()[:-len('})();')]
        out = pretty('(() => {\n' + body + '})();\n', f)
        inner = out[len('(() => {\n'):].rstrip()[:-len('})();')]
        inner = '\n'.join(l[1:] if l.startswith('\t') else l for l in inner.split('\n'))   # the wrapper indents the body once; the shared scope stays flat
        new = inner.rstrip('\n') + '\n\n})();\n'
    else: new = pretty(s, f)
    if new != s: open(f, 'w').write(new); print('formatted', f)
