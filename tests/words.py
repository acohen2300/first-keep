# The words read mid-game: every message (say) and tip (advise). Each must fit ONE line of the banner on the smallest phone;
# the gate renders them all at 375 px wide (python3 tests/words.py --list hands it the strings). Here: at most 10 words, as a first sieve.
# Every string literal inside a say(...) counts, including both sides of a ternary (Build 37's sieve missed those).
import re, glob, sys, json
LIMIT = 10

def first_arg(src, i):   # the source of say(...)'s first argument, from the "(" at i to the top-level comma or ")"
    d = 0; q = None; j = i + 1
    while j < len(src):
        c = src[j]
        if q:
            if c == '\\': j += 2; continue
            if c == q and q != '`': q = None
            elif q == '`' and c == '`': q = None
            elif q == '`' and c == '$' and src[j + 1:j + 2] == '{':   # a ${...} inside a template: skip to its close
                k = j + 2; e = 1
                while k < len(src) and e: e += {'{': 1, '}': -1}.get(src[k], 0); k += 1
                j = k; continue
        elif c in '\'"`': q = c
        elif c in '([{': d += 1
        elif c in ')]}':
            if d == 0: return src[i + 1:j]
            d -= 1
        elif c == ',' and d == 0: return src[i + 1:j]
        j += 1
    return ''

def literals(code):   # every string literal at the top level of a piece of code; a template's ${...} becomes one word, its inside skipped
    out = []; i = 0; n = len(code)
    def skip_expr(j):   # from just after "${" to just after its "}", stepping over strings inside
        e = 1
        while j < n and e:
            c = code[j]
            if c in '\'"`': j = skip_str(j); continue
            e += {'{': 1, '}': -1}.get(c, 0); j += 1
        return j
    def skip_str(j):   # from an opening quote to just after its close
        qq = code[j]; j += 1
        while j < n and code[j] != qq:
            if code[j] == '\\': j += 2; continue
            if qq == '`' and code[j] == '$' and code[j + 1:j + 2] == '{': j = skip_expr(j + 2); continue
            j += 1
        return j + 1
    while i < n:
        c = code[i]
        if c in '\'"`':
            j = skip_str(i); raw = code[i + 1:j - 1]
            if c == '`':   # rebuild the template's words with each ${...} as one word
                t = ''; k = 0
                while k < len(raw):
                    if raw[k] == '\\': t += raw[k:k + 2]; k += 2; continue
                    if raw[k] == '$' and raw[k + 1:k + 2] == '{':
                        e = 1; k += 2
                        while k < len(raw) and e:
                            ch = raw[k]
                            if ch in '\'"`':
                                q2 = ch; k += 1
                                while k < len(raw) and raw[k] != q2: k += 2 if raw[k] == '\\' else 1
                            elif ch == '{': e += 1
                            elif ch == '}': e -= 1
                            k += 1
                        t += '12'; continue
                    t += raw[k]; k += 1
                raw = t
            t = raw.replace("\\'", "'").lstrip('!')
            if len(t.split()) >= 2: out.append(t)   # a single word (a class name, a sound) is not a message
            i = j; continue
        i += 1
    return out

def messages():
    found = []
    for f in sorted(glob.glob('src/[0-9][0-9]-*.js')):
        src = open(f).read()
        for m in re.finditer(r'\bsay\(', src):
            line = src[:m.start()].count('\n') + 1
            for t in literals(first_arg(src, m.end() - 1)): found.append((f, line, t))
        a = src.find('function advise(')
        if a >= 0:
            body = src[a:src.find('\n}', a)]
            for m in re.finditer(r"return (`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')", body):
                for t in literals(m.group(1)): found.append((f, src[:a].count('\n') + body[:m.start()].count('\n') + 1, t))
    # the spectacle's lines are said through variables (say(EV_TEXT[k][1])), so read the table itself; EV_LINE is what the alert bar shows
    t = open('src/07-text.js').read()
    for name in ('EV_TEXT', 'EV_LINE'):
        a = t.find(f'const {name} = {{'); b = t.find('\n}', a)
        for m in re.finditer(r"'((?:[^'\\]|\\.)*)'", t[a:b]):
            if len(m.group(1).split()) >= 2: found.append(('src/07-text.js', t[:a + m.start()].count('\n') + 1, m.group(1).replace("\\'", "'")))
    return found

if __name__ == '__main__':
    M = messages()
    if '--list' in sys.argv: print(json.dumps(sorted({t for _, _, t in M}))); sys.exit(0)
    bad = [f'{len(t.split())} words {f}:{n} {t[:90]}' for f, n, t in M if len(t.split()) > LIMIT]
    # Albert's rule (Build 40): no apostrophes in the game's words. An escaped apostrophe in any string, or a possessive inside a template, fails.
    import glob
    for f in sorted(glob.glob('src/*.js')):
        for n, line in enumerate(open(f), 1):
            code = line.split('   //')[0]
            if "\\'" in code or re.search(r"[}a-z]'s? [a-z]", code.split('//')[0] if code.lstrip().startswith('//') is False and '`' in code else ''): bad.append(f'apostrophe {f}:{n} {code.strip()[:90]}')
    print('\n'.join(bad) if bad else f'words ok ({len(M)} messages)'); sys.exit(1 if bad else 0)
