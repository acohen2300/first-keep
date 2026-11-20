# First Keep: hand-off (Nov 20, 2026) [2026-11-20 05:45]

## START HERE: where things stand [2026-11-20 05:45]
- Last build N86, sealed. Preview n86: https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n86/ . His play owed. Do not send him to n84: its computers do not grow.
- Read The List section 52 and `docs/4 Now/Audit - Nov 20.md`. His complaint of Nov 20 05:03: lists and no closing. Close things: a failing test, the fix, the preview; fewer reports.
- Open, in order: his answer on which tile the "outpost wagon" was; the refused tap that says nothing on screen (every dim cell); the wagon's card (no Unpack); the mocks he asked for (2 and 9, 3, 4, 7, 10, 12, 14, 15, and the type sizes); the 21 red tests; note 37's audit; the clock (Draft 3).
- The suite alone on N85: 70 of 98 hold, 28 red (the list is in the audit, C). t-n52 and t-n60 are unsteady in a batch.
- Probes must not call `MENU.act('start')`: it re-rolls the seed. Use `FK.reset()`.

## The Nov 19 21:42 hand-off (older)

## START HERE: where things stand [2026-11-19 21:42]
- Last build N84, sealed. Preview n84: https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n84/ . His play owed.
- His answers on the 48 play notes are The List section 50; what was built and read from them is section 51. Read those two first.
- Built from his "easy fix" notes: 1, 6, 8, 11, 13 (N83) and 46 (N84).
- Next, in his words: mocks first for 2 and 9, 3, 4, 7, 10, 12 (with a dark glow), 14, 15, each drawn in a game screen; talk for 18, 19, 23, 24, 27, 31; his rulings owed on 17 (the rout rule), the Squad word and the garrison toggle (note 6), and whether farms may touch (note 46).
- Not traced: 16 (outpost wagon), 22 (one probe owed), 49 (trade routes and caravans), the match log's five items (section 47). The clock (Draft 3) is still owed.
- His style: short replies, plain words, no patches (fix the code at its source), no helpers. A permit opens at most ten items: split a build that needs more.

## The Nov 19 20:45 hand-off (older)

## START HERE: his order of Nov 19 20:41 [2026-11-19 20:45]
- His words: "My personal order is to fix all at once and then I'll play your fixes and see if I like them." Then 20:45: fresh chat, hand-off now. The old chat built nothing after this.
- Read as: his 48 play notes (The List section 48) are the list; fix them in one run; he plays after. Not confirmed by him beyond those words: the new chat's first reply is a short numbered plan (what will be fixed in the run, what cannot and why), then build without waiting unless a note needs a design answer.
- Everything is sealed and pushed. Last build N82. Preview: https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n82/
- His style: replies at a quarter of the usual length, plain words, no patches (fix the code at its source), no helpers.

## The run, in the order asked of him (menus first, then army; he did not answer the order) [2026-11-19 20:45]
1. The white line (note 1): N82 laid the fade on two pieces (`.mline` and `#base` in menu.js's css); the gap shows, and `#base` is tinted when empty. Fix: one fade, one piece, only as tall as the rows showing. Fade strength unanswered: he liked the darker fade to the bottom (`mockups/cards/overlay.png`); Claude's offer was 40% running to the bottom.
2. Notes that undo recent work: War Command words never change (the reading comes out of the title); the Build menu stays open after a non-repeat building; the research effect line needs a place on screen; the gap between buildings back (reverses Nov 14).
3. The other menu notes, then army, then the rest of section 48. Notes that are design questions (formations, ambush, throne and natives, misfits, camera, artistic pass, v80/base/mid audit) need his rulings or a mock first: say so in the plan, do not guess.
4. From the match log (section 47), untraced: runaway computer gold, villagers stuck in "wait", unspent stock, late ages, no ending.
5. Still owed after that: the clock (Draft 3), which he had set for overnight.
- Open tests: t-n47 six (5 rich clearings on the test seed since N75), unsteady t-n24 far, t-n60 cross, t-p2 focusHome, t-n42 fx. The full suite was not run on N75 to N82.
- Preview push that works: force-fetch `+main:refs/remotes/origin/main`, a detached worktree, copy the game files and books to `frankenstein-refresh/preview-nNN/`, push `HEAD:main`.


## Since 13:25 [2026-11-19 15:55]
- N82 built and sealed (Jobs always the Jobs page; every tile filled; a 30% fade behind the rows; preview n82). He plays it tonight and will bring notes. Open: the fade (he liked the darker one, overlay.png bottom row). N80 built and sealed (clear fills from one rule; Train, Learn and Jobs tiles filled; his play owed; the dark glow is talk, not built). His word, Nov 19 17:41: no patches, fix the code at its source. N78 built and sealed (the new HUD, one mold: Drafts 7 and 8; his play owed, in n79). Next in his order: the clock (Draft 3), overnight. Open: t-n47 six (5 rich clearings on the test seed since the N75 land), unsteady t-n24, t-n60, t-p2.
- N77 built and sealed (the ghost waits on six repeatable builds, a tap on the ghost builds; preview n77; his play owed). N76 built and sealed (touches pass through the menu; his play owed, in n77 too). Open: t-n60 and t-p2 unsteady, not traced. N75 built and sealed: the nature-made land (Draft 1), preview n75. Not yet played by Albert. Next in his order: item 2, the clock. The land's next build (grading, piers, causeways) waits for his word.
- Another chat was writing building-card drafts on this branch at the same time (14:36 to 14:57): fetch before pushing.


Read this first in a fresh chat. Then `docs/3 Locks/Drafts/00 Index.md` and Drafts 1 to 6: they hold every ruling of Nov 19 with its time and source. [2026-11-19 13:25]

## Where things stand [2026-11-19 13:25]
- Code: branch `n46-back-to-n41`, folder `frankenstein-refresh/v100/`, last build N74, sealed (see `v100/BUILDS.md`). Previews are folders on `main`: copy index.html, the five .js, fonts.css, the manifest and books/ to `frankenstein-refresh/preview-nNN/`. Do not run `publish.py` from the branch (it pushes the branch to main). [2026-11-19 13:25]
- Preview n74: https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n74/ . Not yet seen by Albert on his phone. [2026-11-19 13:25]
- N74 built: makers (makeForest, makeRoads, makeTrees, makeFish); the road law as written (trees stand in the strip, no cover there); wood by size; broad home trees (drawn 1.6x wide); rocks and crevices cut; mud cited; 1 wood = 2.5 kg at D53. [2026-11-19 13:25]

## How Albert wants the work done from here (Nov 19 13:20) [2026-11-19 13:25]
- His words: "we talk about things. Then I get a preview. And I don't see what I expect to see and then I need to wait two hours to fix it." [2026-11-19 13:25]
- Agreed fix: (1) before every build, a "what you will see" list of 3 to 5 lines, and what he will not see; his yes on it. (2) Anything visible is mocked in a game screen first; he corrects the picture; then it is built. (3) One visible change a preview, in his order; say before starting if it will not fit in one run. [2026-11-19 13:25]
- He asked for the nature-made land FIRST. Claude built clean-up and trees first and stopped; he was not told the order. Do not repeat that. [2026-11-19 13:25]

## Next, in his order [2026-11-19 13:25]
1. DONE AS N75 (built, not proven by his play). Nature-made land (Draft 1): pictures first in a game screen (home corner with its cove; the whole map; two or three seeds). The mock's maker is `nature.js` (not in the repo; rebuild from Draft 1's math: fBm relief, Priority-Flood, D8 flow, channel head A·S^1.27 ≥ 380, width ∝ √Q, TWI > 10.5). Then build: the land, water found from it, then ice, fish, fords, marsh and docks re-pointed at the new water (they read the lists `lakes` and `RIV` today), then the fairness sweep. Grading, piers and causeways are the build after. [2026-11-19 13:25]
2. The clock (Draft 3, ruled): year 3,600 s, season 900 s, day 300 s (3 a season), night 25% of the day; the economy kept per minute of play; 36 entries to re-time. [2026-11-19 13:25]
3. Baked ground and woods (woods repaint is 76 ms on the test machine with 7,654 trees; paint by 32-tile squares). The test patch is at preview `n73-baked`; its typed numbers must go to the book. [2026-11-19 13:25]
4. Tools (Draft 6, ruled): bronze 6x stone and dear, iron the same speed and far cheaper, saw 1.9x. Flag: chopping starts six times slower than today; show him before it ships with anything else. [2026-11-19 13:25]
5. Clean-up owed: one ice model; one fish rule; one trunk density for sight; units on the land's entries (index.py's unit list has no "units", "metres", "kg" or "°C"); typed names ('tree'); a kill-list test; the master list ticked; a trunk drawn 2.6x under a normal crown (new art). [2026-11-19 13:25]

## Facts worth keeping [2026-11-19 13:25]
- The game repeats exactly for a seed: a fingerprint tool (hash of H, FOR, OCC, the things, the roads, then three minutes of `FK.sim`) proves a refactor changed nothing. Rebuild it as needed. [2026-11-19 13:25]
- The lane rule (D46, laneDist) is not dead: it lays river fords on the line from each home to the middle. [2026-11-19 13:25]
- Red before N74 and after alike: t-n29, t-n17, t-land, t-gather. t-n57 fails about one run in six. The full suite was not run on N74. [2026-11-19 13:25]
- His phone builds the old ground in 406 ms; the ground and trees cost almost nothing a frame. What heats the phone is not measured (suspects: unit loops, the save every 60 s, the tap readback). [2026-11-19 13:25]
