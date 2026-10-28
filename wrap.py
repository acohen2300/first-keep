# The native copy for the App Store wrapper (Capacitor): the same page, with a lock-down header and the iPhone's safe areas in its head.
# Run after build.py:  python3 build.py && python3 wrap.py   ->  native/index.html  (Capacitor's webDir is native/)
import os
game = open('first-keep.html', encoding='utf-8').read()
add = ('<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; '   # nothing is loaded from the web, no outside code runs (App Store 2.5.2)
       'font-src data:; img-src data: blob:; media-src data: blob:; base-uri \'none\'; form-action \'none\'">'
       '<style>html{background:#121715;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box}</style>')
web_vp = '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
assert game.count(web_vp) == 1 and game.count('<head>\n') == 1, 'the page shell changed: update wrap.py'
page = game.replace(web_vp, '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">').replace('<head>\n', '<head>\n' + add + '\n', 1)
os.makedirs('native', exist_ok=True)
open('native/index.html', 'w', encoding='utf-8').write(page)
print('native/index.html', os.path.getsize('native/index.html'))
