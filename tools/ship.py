# The page a phone gets: the scripts and fonts stitched into one index.html, so a phone can never run a new page beside an old book.
# Books lose what only people read (cite, law, unit, subject, and name where the name is a description). The source stays split and whole.
#   python3 tools/ship.py OUT    write the page, sw.js and the manifest into the folder OUT
import json, pathlib, re, shutil, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
SHOWN = {'tech', 'shells'}   # books whose "name" the game shows on screen

def book(text):
    m = re.search(r'BOOK\("(\w+)",\s*(\{.*\})\);?\s*$', text, re.S)
    name, entries = m.group(1), json.loads(m.group(2))
    for e in entries.values():
        for k in ('cite', 'law', 'unit', 'subject') + (() if name in SHOWN else ('name',)): e.pop(k, None)
    return f'BOOK("{name}",{json.dumps(entries, ensure_ascii=False, separators=(",", ":"))});'

def page():
    p = (ROOT / 'index.html').read_text(encoding='utf-8')
    def js(m):
        src = (ROOT / m.group(1)).read_text(encoding='utf-8')
        if m.group(1).startswith('books/'): src = book(src)
        return '<script>' + src.replace('</script', '<\\/script') + '</script>'
    p = re.sub(r'<script src="([\w/.-]+\.js)"></script>', js, p)
    p = p.replace('<link rel="stylesheet" href="fonts.css">', '<style>' + (ROOT / 'fonts.css').read_text(encoding='utf-8') + '</style>')
    assert '<script src=' not in p and 'href="fonts.css"' not in p
    return p

def ship(out):
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    (out / 'index.html').write_text(page(), encoding='utf-8')
    for f in ('sw.js', 'manifest.webmanifest'): shutil.copy(ROOT / f, out / f)
    return (out / 'index.html').stat().st_size

if __name__ == '__main__': print(f'{ship(sys.argv[1]):,} bytes')
