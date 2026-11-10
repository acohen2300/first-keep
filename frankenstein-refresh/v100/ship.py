# ship.py: the live page, written from the source for GitHub Pages (Albert, Nov 9: one stitched page, so a phone can never run a new
# page beside an old book; Nov 9 20:22: the source's docs do not ship). The source stays split and whole; only the copy served is changed:
#   the scripts and fonts stitched into index.html; each book's entries lose what only people read (cite, law, and name where the
#   name is a description; the tech and shells books keep their names, which the game shows); the books' JSON written without spaces.
#   python3 ship.py           write the stitched page over index.html (GitHub's checkout only: never run it in the source)
#   python3 ship.py --size    print the page's size before and after, write nothing
import re, json, pathlib, sys
d = pathlib.Path(__file__).resolve().parent
SHOWN = {'tech', 'shells'}   # books whose "name" the game shows on screen
def book(text):
    m = re.search(r'BOOK\("(\w+)",\s*(\{.*\})\);?\s*$', text, re.S)
    name, entries = m.group(1), json.loads(m.group(2))
    for e in entries.values():
        if isinstance(e, dict):
            e.pop('cite', None); e.pop('law', None)
            if name not in SHOWN: e.pop('name', None)
    return f'BOOK("{name}",{json.dumps(entries, ensure_ascii=False, separators=(",", ":"))});'
def page():
    p = (d / 'index.html').read_text(encoding='utf-8')
    def js(m):
        src = (d / m.group(1)).read_text(encoding='utf-8')
        if m.group(1).startswith('books/'): src = book(src)
        return '<script>' + src.replace('</script', '<\\/script') + '</script>'
    p = re.sub(r'<script src="([\w/.-]+\.js)"></script>', js, p)
    p = p.replace('<link rel="stylesheet" href="fonts.css">', '<style>' + (d / 'fonts.css').read_text(encoding='utf-8') + '</style>')
    assert '<script src=' not in p and 'href="fonts.css"' not in p
    return p
if __name__ == '__main__':
    out = page()
    if '--size' in sys.argv:
        src = (d / 'index.html').read_text(encoding='utf-8')
        full = re.sub(r'<script src="([\w/.-]+\.js)"></script>', lambda m: (d / m.group(1)).read_text(encoding='utf-8'), src) + (d / 'fonts.css').read_text(encoding='utf-8')
        print(f'{len(full.encode()):,} bytes with the docs, {len(out.encode()):,} shipped')
    else:
        (d / 'index.html').write_text(out, encoding='utf-8')
