# First Keep: hand-off (Nov 13, 2026, 22:50; the overnight run)

Rules: `CLAUDE.md` (the one start). The one list: `The List.md` (section 9 is tonight's go). Laws: `docs/3 Locks/Designs/09`.

## Where it stands
- Code: `frankenstein-refresh/v100/`, branch `n29-the-list`. Last sealed build: see the top of `BUILDS.md` (N42 at 22:50).
- Preview Albert plays: `frankenstein-refresh/preview-nNN/` on `main` (n42 at 22:50), published from a worktree of `main` (`git worktree add /tmp/mainwt main`; copy the game files and `books/`; `git push origin HEAD:main`).
- Live v100 on `main`: untouched. Going live is Albert's call only.

## Tonight (Albert, Nov 13 22:21 and 22:35; his words are on The List, section 9)
- What he has ruled is a go. Tonight only: creative licence ("delete. Clean. Enhance"), code size may rise, controls may get a flow and design pass. Still: nothing live, cuts logged in `Parked.md`, no helpers.
- Order: (1) batch 1, done as N42; (2) the new game screen (font, rings, Start, a prettier card from v80); (3) looks: building going up, the army torch from v80, elite looks, trees to the map edges; (4) the logic audit and open faults; (5) the Controller pass (SoRen p21's idea: the sentence is the control; spies and medics); (6) dead ends, the shell pass (Design 10 is a go), polish, repo tidy.
- Each batch: tests that fail on the old code, a BUILDS.md entry, seal, commit, push, a new preview, a numbered report from The List.

## How to build (the short form)
- Gate: `cd frankenstein-refresh/v100 && python3 index.py` (PASS). A permit (`permit.json`) lists `opens` (at most 10; a prefix such as `book` opens all books) and `grow` bytes per file or section; seal with `--seal` after the BUILDS.md entry; clear the permit.
- Tests: copy `v100` to `/tmp` with `mid` and `clean` beside it; `python3 test.py --only t-a,t-b`. Proof = passes, and fails on the old code.
- Typed numbers and colours are refused: use ZERO, ONE, the books. A book entry needs `cite` (citations need `"opened": true, "kind": "note"`).
- Known flaky: t-dock (one fail in five; a fisher stands after one catch). Failing before tonight: 18 tests (`Tests - Nov 13.md`).

## Open, waiting on Albert
- His play of n42 and later previews; a `?fps` night screenshot (more torches, bigger fires).
- Twelve open questions sent 22:45 (in chat; the ones marked "mine" are decided by Claude tonight).
- Menus and the Controller: he sees pictures before and after.
