# First Keep: hand-off (Nov 14, 2026, 09:26)

Rules: `CLAUDE.md` (the one start). The one list: `The List.md` (section 10 holds Albert's Nov 14 return to n41). Laws: `docs/3 Locks/Designs/09`.

## Where it stands
- Albert, Nov 14 07:54 to 08:40: last night's jump to design was a judgement error; back to n41, keep a few items, then bug work only.
- Code: `frankenstein-refresh/v100/`, branch `n46-back-to-n41` (cut from S9 = n41, `cb9c9d2`). Last sealed build: N50 (bottom of `BUILDS.md`).
- Branch `n29-the-list` keeps N42 to N45 whole, parked (`Parked.md`, "Parked Nov 14"). Do not build there.
- Previews on `main` (`frankenstein-refresh/preview-nNN/`): n50 is the one to play (n49: without the Pioneer; n48: without the mine shaft; n47: the new map only; n46: the old map). n40 to n45 stay up.
- Live v100 on `main`: untouched. Going live is Albert's call only.

## In N47 (on top of N46; Albert's go of Nov 14 10:16)
- Z4 by the randomizer: woods from one field over the board, ten plain and six rich clearings, winding paths clearing to clearing, the corner-to-middle lanes grown over (to confirm with him), a tree holds four villagers. Pictures: `mockups/n47`.

## Next builds, in his order (ruled, a go: Albert, Nov 14 10:51 "then you can do all three"; The List section 10 has his words). Each its own preview.
1. DONE as N48 (BUILT, his play owed): dock + fish as one element. Left from it: the pier turning toward the water and shortening on narrow water.
2. DONE as N49 (BUILT, his play owed): the mine shaft (Blasting lets a Mining camp be worked in place for gold). Left from it: iron, the animation.
   FIRST, before the Pioneer: the two faults N47 brought (BUILDS.md N48 and N49): t-p2 (a focused villager idle by a tree another finished) and t-n24 (a far attack order across woods). t-n24 waits on Albert's call.
3. DONE as N50 (BUILT, his play owed): the Pioneer. Left from it (BUILDS.md N50): a follow order for villagers, a felling speed, its own picture, trees drawn lying, proof of a tap order across a wood.
   Albert, Nov 14 12:48, the lanes: "Leave it for now" (t-n24's far check stays open against that).
The frozen-villager trace is OFF by his word (Nov 14 10:10): he tests first.

## In N46 (on top of n41)
- From N42: sound after a call; the clock's second line and the wonder countdown; the 1,000 sale; berries regrow; the research hint (TENTATIVE: his play decides).
- From N43: construction in three stages; sea fish; the woods card for soldiers only (the second half of the dock fix).
- New in N46: a sea fish is laid only where someone can stand to catch it (N361). Under N43's code 34 to 60 of about 105 sea fish could not be reached, and t-dock failed three runs in five.

## Open bugs (not started; the trace of 1 is off by his word)
1. The frozen villagers. The 40-minute watch (`/home/claude/tools/watch.py` in the Nov 14 chat; the method is on The List, section 9) lists villagers in `carry` with a load and no path who do not move for 40 s: 44 on n41, 28 on N46, all within about a minute of each other around minute 33 to 38. So the fault is older than n41 and N45 did not cause it. A 10 s probe of another run saw none before 2300 s: it does not happen in every game. Not traced. First look: econ.js:229 (`!b || !beside(u, b)` then `carry(u)` again with no path made).
2. The inland fish with no place to stand (2 to 9 a map on n41, before sea fish): not touched.
3. His food under 60 for 27 minutes with 97 soldiers; villagers on `wait` with nothing telling him; "Something is in the way" beside farms (needs his screenshot); one computer's +14,000 gold a minute.
4. The tests that failed before Nov 13 (named in BUILDS.md, N46).

## Waiting on Albert
- His play of n46. In play he inspects: dead buttons (Winner, "All tech / Later", "Scout / Later"), cut-off text, soldiers running by themselves. He judges the research hint.
- H10 (the computers' economy) stays held by his word of Nov 13 08:26.
- The Controller: he hates the new controls (Nov 13 22:06); a menu matter, done together, his detail to come.

## How to build (the short form)
- Gate: `cd frankenstein-refresh/v100 && python3 index.py` (PASS). A permit (`permit.json`) lists `opens` (at most 10; the prefix `book` opens all books; `code:index.html` opens all its sections) and `grow` bytes per file or section. Seal with `--seal` after the BUILDS.md entry; clear the permit.
- Tests: copy `v100` to `/tmp` with `mid` and `clean` beside it; `python3 test.py --only t-a,t-b`. Full suite about 25 minutes, in the background on a frozen copy. Do not run other Chrome jobs beside it: t-a1 (a frame-time check) and others fail under load.
- Publishing a preview: `git worktree add /tmp/mainwt main`; copy the game files (`index.html`, `menu.js`, `econ.js`, `combat.js`, `ai.js`, `sound.js`, `fonts.css`, `manifest.webmanifest`) and `books/`; commit; `git push origin HEAD:main`.
- The board differs from one page load to the next even on one seed (the scenario's land), so a test that passes once is not proof: run a board-dependent test five times.
- Times in BUILDS.md and The List come from `date` or `git log`, never from memory.
