# Frankenstein Refresh: how a migration build is done

Albert's yes yes (Nov 5, 11:40) covers builds F10 to F39, in the order of `clean/modules.json`. Each build brings its modules from Mid into the copy of v100 (`v100/`), clean: v100's structure, Mid's gameplay.

## Never touch
`../v100-ground-up/`, `../preview/`, `mid/`, `staging/`, `map/groups.json`. Do not commit or push (the lead does).

## Read first
1. `v100/DICTIONARY.md`: the structure, written with Albert. Every item is a shell (a row in `books/shells.js`) with attributes pointing into books and ticks (`books/capabilities.js`). Units are one Unit shell whose attributes (Age, Class, Level, Behavior, Attitude, Sprite, Motion, Speed, Health…) make each kind. Layers 10–150, floors in build order.
2. `clean/decisions.json`: Albert's calls. Binding. Mid's values come over as they are unless a call says otherwise. Research percents add, applied once to the base (3.0 with +10% and +8% is 3.54).
3. `clean/modules.json`: your build, its modules, their pieces and the plan for each (`v100`: shells, ticks, books, laws, code).
4. Each piece's Mid code (`staging/<book>.js`, or `mid/src/<part>.js`) and its sort line (`clean/<book>.json`).
5. The v100 code it lands in: `v100/index.html` (floors marked `// ── `), `econ.js`, `combat.js`, `ai.js`, `menu.js`, `sound.js`, `books/*.js`, `CALCULATIONS.md`.

## The rules the gate holds you to (`v100/index.py`, `books/rules.js`)
- **The permit**: write `v100/permit.json` first: `{"build": "F10 · …", "agreed": "Albert, Nov 5 11:40: yes yes F10–F39", "opens": [...]}`, one whole module's worth, never split (Albert, Nov 5 13:30; an item is `code:file`, `code:index.html#section`, `book:name` or `book:name:CODE`, `law:Qxx`, `tool:file`). Anything changed outside the permit stops the gate. Growth of a code item past its seal needs `"grow": {"code:…": bytes}` with a `"why"`.
- **One home**: every number, colour and name lives in a book. Code may not type more numbers than its seal (the ratchet); colours belong in the Colours book. Code never names a shell (`'BTC1'`, `B.BTC1`): it asks by tick (`has(t, 'Fight')`) or reads a book.
- **Laws**: new math is one line in `CALCULATIONS.md`, `Qxx Name: the equation in words · Nxx`, and the book entries that use it name it in `law`. A source is an entry in `books/citations.js`: `"opened": true` only if you opened it this session; otherwise the text says "from memory, to open".
- **Citations and comments by code**: a book entry cites only N codes (a new source or a new call of Albert's is a new entry in `books/citations.js`). A comment in code is only its code, `// E12` (a floor's header keeps its title: `// ── Floor 5, movables (E40)`); the why is written once in `books/comments.js`. The gate stops words in a comment, a code that isn't in its book, and an entry no code uses. So `book:comments` (and `book:citations` when a source is added) go on the permit.
- **The pages** (`INDEX.md`, `BOOKS.md`, `INVENTORY.md`) are written by `index.py`, never by hand.

- **A new book** is loaded by the page: its `<script src="books/….js">` goes among the books in index.html's head (`code:index.html#page`), so a build that adds a book opens that item too.

## Style
v100's own: compact lines, a short comment that says why in plain words, one rule per capability, layers and floors in build order. Lean: no fixes on fixes, no second way to do what v100 does. Mid's code is the reference for what happens, never for how it is written.

## The test
Each build adds one entry to `books/rules.js` (`{"key": "t-…", "value": {"stage": "page"}, "name": "…", "cite": ["Design: Albert, Nov 5 11:40 (Frankenstein F..)"], "law": []}`; so `book:rules` goes on the permit) and one test in `test.py` that proves same action, same result against Mid's frozen code where it can (load Mid's tables or functions with node's vm, as `REC` and `match()` do for the sounds), otherwise a behaviour test on the running page. A break in what it checks must make it fail.

## Done means
1. `python3 index.py` prints PASS, and `python3 test.py` says every rule holds.
2. In `clean/<book>.json`, every piece you brought changes from `"bring"` to `"in v100"` with a note of where it now lives (`"F10: index.html, the dice"`). Then `python3 index.py --survey ../mid ../map` from `v100/` prints PASS.
3. A cut made on the way is logged in `../docs/4 Now/Parked.md` (append a short section).
4. Leave `permit.json` as it is. The lead publishes (`v100/publish.py`: the gate and tests again, the BUILDS.md entry, the seal, the permit cleared, the commit as Albert, the push).

If something will not fit v100's rules or Albert's calls, stop and report it instead of forcing it.

## Report
What was built (a few lines); each opened file's lines and bytes before and after; the test and its result; anything that did not fit.
