# The native copy for the App Store wrapper (Capacitor): the same game, inside a full page with the iPhone's safe areas and a lock-down header.
# Run after build.py:  python3 build.py && python3 wrap.py   ->  native/index.html  (Capacitor's webDir is native/)
import os
game = open('first-keep.html', encoding='utf-8').read()
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">'
        # nothing is loaded from the web (the typefaces are inside the file), and no outside code runs (App Store 2.5.2)
        '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; '
        'font-src data:; img-src data: blob:; media-src data: blob:; base-uri \'none\'; form-action \'none\'">'
        '<style>html{background:#121715;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box}</style>'
        '</head><body>')
os.makedirs('native', exist_ok=True)
open('native/index.html', 'w', encoding='utf-8').write(head + game.replace('<meta charset="utf-8">', '', 1) + '</body></html>')
print('native/index.html', os.path.getsize('native/index.html'))
