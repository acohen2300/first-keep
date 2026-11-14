# First Keep: hand-off (Nov 14, 2026, 00:35; the chat moved mid-run)

Rules: `CLAUDE.md` (the one start). The one list: `The List.md` (section 9 holds the Nov 13 22:21 go, his words, and everything built or left open since). Laws: `docs/3 Locks/Designs/09`.

## Where it stands
- Code: `frankenstein-refresh/v100/`, branch `n29-the-list`. Last sealed build: N45 (top of `BUILDS.md`). The permit is clear; the gate passes.
- Previews on `main` (`frankenstein-refresh/preview-nNN/`): n42, n43, n44, n45. n44 is the one Albert was told is safe to play; n45 is the shell pass (play meant unchanged).
- Publishing a preview: `git worktree add /tmp/mainwt main`; copy the game files (`index.html`, `menu.js`, `econ.js`, `combat.js`, `ai.js`, `sound.js`, `fonts.css`, `manifest.webmanifest`) and `books/`; commit; `git push origin HEAD:main`.
- Live v100 on `main`: untouched. Going live is Albert's call only.

## The go (Albert, Nov 13 22:21 and 22:35; his words are on The List, section 9)
- What he has ruled is a go: build it, do not ask again. "Don't stop until you literally can not do without me." No helpers. Nothing live. Cuts logged in `Parked.md`.
- For the night of Nov 13 to 14 he also gave: creative licence, code size may rise ("delete. Clean. Enhance"), controls may get a flow and design pass. Design: "continue the trajectory with clean ups and refinements. Nothing crazy."
- He paused at 00:09 and 00:20 and moved the chat at 00:30. He said he will resume: wait for his word in the new chat, then carry on from "Next".

## Built on Nov 13 to 14 (all BUILT, his play owed; details on The List and in BUILDS.md)
- N42: sound back after a call; 1,000-lot Market sale; wonder countdown; laden right of way; bigger fires; research hints; berries regrow.
- N43: the new game card; a building goes up as foundation, frame, finishing on its own axes; flame shadows; sea fish; winter heads-up; soldiers no longer run by themselves; the woods card for soldiers only.
- N44: dead ends closed; top bar red when a resource falls; the Controller's order line and button names; specials explain themselves.
- N45: the shell pass, slice one. Asks by name 309 → 149; dead ticks 7 → 7; game code 652,072 → 651,148 bytes.

## Next, in order (none needs Albert)
1. Trace the 40-minute watch (The List, "the 40-minute watch"): 27 villagers frozen in `carry` beside their drop-off at 2301 s, soldiers frozen in `march` at 2305 s. First check: does the game end near 2260 s and hold everyone still? The watch: start a game, fog off, bell at Infinity, `FK.sim(0.1)` for 40 game minutes, sample every person each second, list anyone in a moving job (a path, or walk, march, carry) who has not moved 0.5 px in 40 samples.
2. N46: the seven dead ticks (The List has which three wire with no change to play and where; the other four need reading). The gate's `dead` allowance in X112 falls with each.
3. More of the shell pass: 149 asks by name left (jobs idle 42, march 17, hold, fight, wait, rout; the tree kind 11).
4. The polish pass on People, Mail, Stores, the Guide and the unit cards (same trajectory as the new game card).
5. The 19 tests that failed before Nov 13 (named on The List), rewritten against the laws as each step reaches them.
6. The code-size rule into the gate (CLAUDE.md 6 asks for it in every report; it is checked by hand today).

## Waiting on Albert
- His play of n42 to n45. A `?fps` screenshot at night (more torches, bigger fires: speed unmeasured on his phone).
- A screenshot of "Something is in the way" beside farms (not reproduced).
- The villager's twelve buttons: keep the pads, or the strip (`mockups/p2c/strip.png`). Where spies and medics live on the Controller.
- Siege and Road start over their beds (14 and 12 on 10): keep as Mid, or give them beds?
- H10 (the computers' economy) stays held by his word of Nov 13 08:26.

## How to build (the short form)
- Gate: `cd frankenstein-refresh/v100 && python3 index.py` (PASS). A permit (`permit.json`) lists `opens` (at most 10; the prefix `book` opens all books; `code:index.html` opens all its sections) and `grow` bytes per file or section. Seal with `--seal` after the BUILDS.md entry; clear the permit.
- Tests: copy `v100` to `/tmp` with `mid` and `clean` beside it; `python3 test.py --only t-a,t-b`. Full suite about 25 minutes, 80 results, in the background on a frozen copy. Proof = passes on the new code and every check is false on the old code (`git show HEAD:…` into a second copy).
- Rules that bite: typed numbers and colours are refused (use ZERO, ONE, `var(--one)`, the books); the count of `job|then|kind|civ|code === 'x'` may only fall (ask `has(t, 'Tick')` or `inState(u, 'Tick')`); a book entry needs `cite`; a citation needs `"opened": true, "kind": "note"`; a comment needs `{"text"}`; only top-level numeric keys of a measure need a unit.
- Times in BUILDS.md and The List come from `date` or `git log`, never from memory (the Nov 13 entries ran up to two hours fast and were corrected).
- A test must not ride on the date: t-n15 did (the Daily draw) and broke at midnight.
- Known flaky: none open (t-dock was traced and closed in N43).
