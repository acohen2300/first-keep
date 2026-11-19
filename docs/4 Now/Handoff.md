# First Keep: hand-off (Nov 19, 2026, 15:55) [2026-11-19 15:55]

## Since 13:25 [2026-11-19 15:55]
- N80 built and sealed (clear fills from one rule; Train, Learn and Jobs tiles filled; preview n80; his play owed; the dark glow is talk, not built). His word, Nov 19 17:41: no patches, fix the code at its source. N78 built and sealed (the new HUD, one mold: Drafts 7 and 8; his play owed, in n79). Next in his order: the clock (Draft 3), overnight. Open: t-n47 six (5 rich clearings on the test seed since the N75 land), unsteady t-n24, t-n60, t-p2.
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
