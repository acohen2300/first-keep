# Toasts (say) and tips (advise) are read mid-game: at most 10 words each, with every ${...} counted as one word.
import re, glob, sys
LIMIT = 10; bad = []
for f in sorted(glob.glob('src/[0-9][0-9]-*.js')):
    lines = open(f).read().split('\n')
    for i, l in enumerate(lines, 1):
        found = [m.group(1) for m in re.finditer(r"say\((`[^`]*`|'(?:[^'\\]|\\.)*')", l)]
        if f.endswith('12-ui.js') and 413 <= i <= 430 or (f.endswith('12-ui.js') and 'function advise' in ''.join(lines[max(0, i - 25):i])):
            found += [m.group(1) for m in re.finditer(r"return ('(?:[^'\\]|\\.)*'|`[^`]*`)", l)]
        for t in found:
            t = re.sub(r"\$\{[^}]*\}", "X", t[1:-1]).lstrip('!')
            if len(t.split()) > LIMIT: bad.append(f'{len(t.split())} words {f}:{i} {t[:90]}')
print('\n'.join(bad) if bad else 'words ok'); sys.exit(1 if bad else 0)
