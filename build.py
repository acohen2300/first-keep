import glob, re, subprocess, sys, os
# Joins src/ into first-keep.html, and refuses to when the joined game is broken:
# a syntax error, or one top-level name declared twice (the files share one scope, so a second
# function of the same name silently replaces the first; Build 23 lost the towers that way).
files = sorted(glob.glob('src/[0-9][0-9]-*.js'))
js = ''.join(open(f).read() for f in files)
names = {}
for f in files:
    for n, line in enumerate(open(f), 1):
        m = re.match(r'(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)', line)
        if m:
            k = m.group(1) or m.group(2)
            if k in names: sys.exit(f'build refused: {k} declared twice ({names[k]} and {f}:{n})')
            names[k] = f'{f}:{n}'
os.makedirs('/tmp/fk-build', exist_ok=True)
open('/tmp/fk-build/game.js', 'w').write(js)
r = subprocess.run(['node', '--check', '/tmp/fk-build/game.js'], capture_output=True, text=True)
if r.returncode: sys.exit('build refused: syntax error\n' + r.stderr.strip())
# the fonts travel inside the file: no network call, the same look offline (subset to the letters the game uses; licences in src/fonts)
import base64
face = lambda fam, f, w: "@font-face{font-family:'%s';font-weight:%s;font-display:swap;src:url(data:font/woff;base64,%s) format('woff')}" % (fam, w, base64.b64encode(open('src/fonts/' + f, 'rb').read()).decode())
fonts = '<style>' + face('IM Fell English SC', 'fell-sc.woff', 400) + ''.join(face('Barlow Semi Condensed', f'barlow-{w}.woff', w) for w in (500, 600, 700)) + '</style>'
h = open('src/shell-head.html').read().replace('<!--FONTS-->', fonts)
t = open('src/shell-tail.html').read()
open('first-keep.html', 'w').write(h + js.rstrip('\n') + '\n' + t)
