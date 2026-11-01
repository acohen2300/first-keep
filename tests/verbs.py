# Every verb a control can send has a handler (the class of bug behind the dead Build menu, Build 34 to 36). Run by the gate:  python3 tests/verbs.py
# Read from the source: data-act and data-in literals; btn, sym and slt (both its verbs); the choices of choice() and offOn(), each ['verb:…'.
import glob, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
s = open('src/33-verbs.js').read()
def keys(name):
    i = s.index(f'const {name} = {{'); j = s.index('\n};', i); return set(re.findall(r'(?:^|[{;,]\s*|\n(?:\t| {2}))([a-z][a-zA-Z0-9]*)\(\w*\)\s*\{', s[i:j]))
have = keys('ACT') | keys('PLAY')
src = ''.join(open(f).read() for f in ['src/shell-head.html'] + sorted(glob.glob('src/*.js')))
used = (set(re.findall(r'data-(?:act|in)="([a-z]+)', src)) | set(re.findall(r"(?:btn|sym|slt)\([`']([a-z]+)", src))
        | set(re.findall(r"slt\([`'][^`']*[`'],\s*[`']([a-z]+)", src))     # the slider's own verb, its second
        | set(re.findall(r"(?<![\w\]\)])\[\s*[`']([a-z]+):", src))           # a choice: ['verb:…', words, chosen] (an array, not a lookup like WHY['bonus:…'])
        | set(re.findall(r"offOn\('([a-z]+)'", src)))                          # an Off · On setting: its key is its verb
miss = sorted(used - have)
print(('PASS ' if not miss else 'FAIL ') + f'every control verb has a handler ({len(used)} verbs)', '' if not miss else f'no handler: {miss}')
sys.exit(1 if miss else 0)
