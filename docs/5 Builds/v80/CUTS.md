## Build 80 preview 1 (save safety)
- Nothing cut. `.old` is now one slot per save shape (`.old39`); a finished game's `.bak` is removed with it.
- Changed: forced save no longer overwrites a waiting Resume save; Resume cannot be closed into play; dropped event on load now ends properly; New land/New game/Today reset fight hold, save-failure clock, stale note, error count; House fix points to the Land menu; All hands shows on; alerts skip the voice cap; threats list exists from the first frame.
- Added `tests/saves.py` (in the gate). Lines: +32 / -9 in src, +40 test.

## Build 80 preview 2 (save safety, rest)
- Nothing cut. A cut unit kind no longer stops an old save opening; a damaged save is kept aside (`.lost`) with a note, never written over.
- Tests added to `tests/saves.py`: no Math.random in sim files, no purse change outside earn/spend/payBack, both shown failing on a planted bug.
- Not done: A6 (random state is already saved), A9 (mail left unsaved on purpose: a log, not state), planted-bug meta-test.

- **Play fingerprint accepted:** Build 80 batch 3 part 1: fish pay their walk home (C13), units on one spot part by id (decision 10), deer run one unit direction (decision 12), back-to-work helper (C14): the first minutes move a little

## Build 80 preview 3 (batch 3, part 1)
- Nothing cut. Fish now pay their walk home like any find (C13). School students are left alone by Home, Town square and All hands (C10). One back-to-work helper ends repairs and fires alike (C14). Two units on one spot part along a direction fixed by their ids (decision 10b). Deer run one unit direction, slide along walls, give up a run below half speed (decision 12).
- Tests: `tests/moves.py` (each shown failing on the planted old code). Gate's emergency test now compares only villagers present at the start. Fingerprint accepted: the first minutes move a little.
- Not yet built from batch 3: arrive-and-stop (10a), villager search (1), hostility split and animal temperaments (8), group sight (8b), spawn chase (13), live test 4b, building shadows (14).

- **Play fingerprint accepted:** Build 80 batch 3 part 2: villager search widens with time (decision 1), arrival radius 9 for villagers at work (10a), soldiers leave animals alone (8, 13), group sight (8b): the computers' early economy moves; balance run still to do

## Build 80 preview 4 (batch 3, part 2)
- Nothing cut. Building shadows are now each building's own footprint thrown away from the light (hull of the footprint and itself moved by h·cot(altitude)), not an oval; trees, rocks and people keep ovals (decision 14).
- Villager search widens r = 90 + 90·min(1, t/10 s) after a find is lost, and the villager keeps its job for 25 s more before it waits for an order (decision 1). A villager at work counts as there within 9 (decision 10a).
- Animals get a temper (deer flee, boar and bear defend, wolf hunt). Soldiers leave animals alone unless one is on a civilian of theirs that their side can see (decisions 8, 8b, 13). Defenders take on only what comes within 45 or has hurt them (Hawk-Dove).
- Fingerprint accepted: the computers' early economy moved. Needs a balance run (age-up times, 3 seeds x 30 minutes) before this goes live.
- Not built from batch 3: the live test 4b (natives and computers).
- Honest note: preview 4 uses simplified forms. Not yet built: Charnov's leave rule, Reynolds arrival speed and separation falloff, the general wall normal, Hawk-Dove V/C. Sources from memory, unopened: Pulliam, Lima, Reynolds, Ydenberg and Dill, Maynard Smith and Price. No SCIENCE.md entries yet.

- **Play fingerprint accepted:** Build 80 batch 3 part 3: Hawk-Dove V/C for boar and bear, villagers ease in to their spot (arrival ramp): early economy moves a little

## Build 80 preview 5 (the real math, batch 3 part 3)
- Nothing cut. Boar and bear now fight an intruder with probability V/C (Hawk-Dove), weighed once in ten seconds; hurt ones always fight. Villagers at work ease in to their spot (speed × distance/24, not under a quarter).
- SCIENCE.md has a row for each equation built so far, with its source and what was and was not opened. `tests/science.py` checks Hawk-Dove and the search radius; each new test was shown failing on a planted bug.
- Wall slide: the grid's walls are axis-aligned, so sliding along an axis is v − (v·n)n exactly. Wolf and deer: unchanged. Parting on one spot: ids fix the direction, the push stays linear (not Reynolds' falloff).
- Fingerprint accepted: the early economy moves a little. Balance run still owed.

- **Play fingerprint accepted:** Build 80 batch 4 part 1: fog lit in newGame (B1), full health follows research (B7), two buckets for all (B9), no fish on land (B15), pathfinding cache hits (B12): the first minutes move

## Build 80 preview 6 (batch 4, part 1: fairness and determinism)
- Nothing cut. B1 fog is lit in newGame and after a load, the draw no longer does it (same seed, same game). B2 the daily flag is passed in, no date read inside newGame. B5 a fallen holder hands the Throne back to the Natives. B6 each wonder keeps its own win clock. B7 a finished building keeps its share of full health when research moves it. B8 Easy has no hazard bonus, and a difficulty change applies from the next game. B9 two bucket villagers for every side. B12 the pathfinding cache keys on the grid, flood and game, not the random state. B13 a wall line rebuilds the grid once. B14 a spy is judged against the tower's sight, not its shot range. B15 no fish on the great lake's causeways.
- Tests: moves.py (B5, B7, B8, B15; B7 shown failing on a planted bug). Fingerprint accepted: the first minutes move.
- Not yet: B3, B4, B10, B11 (your call), and the map (home zones, +8%).

## Build 80 preview 7 (the start QC)
- Nothing cut. Added `tests/handoff.py` (the start QC: state, build, lint, the gate, 13 planted-bug checks, what is owed), the "START QC" section at the top of `docs/4 Now/Handoff.md`, a pointer in `CLAUDE.md`, and `docs/6 Records/v80 Audit/` (15 reviewer reports, the mutation test, the decision record). [2026-11-01 07:45]
- The first run of the planted-bug check found a test that could not fail (Easy kept a hazard bonus): the test used a hazard name that is not in the game. Fixed; all 13 now fail when their bug is planted.
- Found: preview 1 to 6 commits were authored as "Claude <noreply@anthropic.com>", not Albert. The repo's git identity is now Albert's noreply address for new commits. The earlier seven stay as they are unless Albert says to rewrite them.

## Build 80 preview 8 (the arrival ramp is out)
- Cut: the arrival ramp (villagers easing in to their spot, speed × distance/24) and its SCIENCE.md row, test and planted bug. Reason: with a mill or a lumber depot and 12 villagers it cost 5 to 16% of gathering against v70, and the jitter it was meant to cure was never seen. Without it, wood and berry yields match v70 (wood 31.8 against 31.5, 15.2 against 16, 33.8 against 34.3; berries 46.3 against 45.7, 22.2 against 22.2, 45 against 45 a villager-minute). Test made with Albert: a mill and a lumber depot beside the finds, 4 and 12 villagers, three seeds, old and new side by side.
- The arrival radius of 9 stays (it costs nothing in that test).

- **Play fingerprint accepted:** Build 80 preview 8: the arrival ramp is cut (it cost 5 to 16 percent of gathering)

- **Play fingerprint accepted:** Build 80 preview 8: arrival ramp cut, gathering back to v70

- **Play fingerprint accepted:** Build 80 preview 9: boar and bear look out to 140 again (v70's distance; preview 4's 45 was never decided). That is the whole difference from preview 8 (minutes 2 to 5, and the wild count at minute 5). Re-checked by taking changes out: self-defence out alone changes nothing; 140 back to 45 alone matches preview 8 except side 1 and the wild count at minute 5, which self-defence moves only when the beasts look to 45; both out give preview 8 exactly. The search, the eyes, the spots and the steps move nothing in the first five minutes.

## Build 80 preview 9 (fixes from the QC audit)
- Changed: a soldier fights back whatever attacks it, an animal included, at peace too (decision 8 amended); a side's eyes are its soldiers and finished buildings, not the attacked civilian (8b); the villager search exactly as decision 1 (look from the spent spot and go there after delivering; else search from the anchor, the placed spot or the nearest drop-off; friends' finds; leash 200, cap 180 for placed; wait at the drop-off with no end; the clock resets on any new find); waiting villagers stand round the drop-off's outline on their own spots, 3 ft apart (1 ft = 2.65 world units, from the drawing); every move is a step (`stepTo`: pushes, knockback, rescues, the deer's run, small moves); boar and bear look out to 140 again; a building's shadow is one fixed hexagon per light direction, moved and stretched, a site by its progress; the Welcome back card holds the whole screen.
- Cut: `SEARCH.give` (25 s, never decided) and the give-up branch it fed (job dropped, every waiter sent to one point, x + half + 6); `STARTLE` (45, never decided); the per-building convex hull (`hull`) for shadows; the text-only save checks (event on load, alert voice, All hands, the `.old` slot), replaced by runtime checks; the 3-second search check and the helper-only back-to-work check in `tests/moves.py`, replaced.
- Tests: `tests/moves.py` and `tests/saves.py` extended (each new check shown failing on its planted bug); `tests/science.py` holds r(t) and FOOT. `tests/handoff.py`: a clean control run, and a plant counts only as a named test failure; 31 plants (was 12, the records said 13), all caught.
- Results: build, wrap, lint clean; the gate passes at four sizes; START QC passed; soak seeds 1 to 3, 20 min: pass (saves 251 to 256 kB; a frame 6.9 to 28.1 ms here).
- Fingerprint accepted (line above): the whole difference is boar and bear at 140, re-checked by taking each change out alone.
- Balance, 4 seeds × 30 min, v70 against preview 9: Bronze 4.4 against 4.5 min; Classical 8.2 against 9.2; Medieval 20.0 against 21.2 (6 of 16 sides both); no side fell in either; villager-seconds blocked 75.5 against 111.5 (median a game), idle with no work 615.5 against 430.5, waiting at a workshop 630 against 288; wins by seat v70 {0: 2, 1: 1, 2: 1}, preview 9 {0: 1, 1: 1, 2: 1, 3: 1}. Classical is about a minute later; not yet traced to one change.
- Frame cost (fixed scene, headless): whole frame unchanged within noise (zoom 0.9: 10.4 to 11.2 ms before, 10.6 to 11.5 after; zoom 2: 9.1 to 11.1 before, 9.0 to 11.4 after); the shadow pass for 105 buildings 142 and 143 µs before, 115 and 135 µs after.
- Size: src 30,136 to 30,227 lines; first-keep.html 1,183,716 to 1,189,980 bytes; tests 1,146 to 1,352 lines.
- Notes: `docs/5 Builds/v80/p9/Fix Notes - v80 - Post Clean - Working.md`. [2026-11-01 07:45]
- After a fresh review (same preview): waiting spots now put one on every corner and cut each side into equal parts of at least 3 ft, so no two spots of any building are closer than 3 ft (the Town Center's corners were 2.1 ft); self-defence is for soldiers only (a tower or a cart keeps the rule it had); new tests for a placed villager's anchor and its 180 cap, for spot spacing on every building kind, and for the wheel and a drag behind the Welcome back card; 35 planted bugs, all caught. Gate, lint, START QC pass; the fingerprint did not move.
- Unapproved assumptions, for Albert: FOOT = 2.65 world units rests on taking a villager as an adult of 5.5 ft; waiting spots stand 5 units (about 1.9 ft) out from the wall, the middle of the free lane square, at least four to a building.

## Build 80, cards (merged Nov 1, before preview 10)
**Cards v80 (branch `cards80`): the type rules, Setup stacked, the controls, Relations final, the Market's picker, the audit's E1 to E11 with N13, the cold review of v70.**

Changes
- Two text sizes, 12 and 18; two fonts; Barlow at one weight, 600 (MAYBE), one file; map labels through `mapFont`, scaled by `labelK` (12 at `ZOOM_START`, floor 9).
- Setup: a rank a setting, name quiet on the left, one selector right-justified; peoples, Daily (Off · On), hazards as bars.
- The controls: `choice` (bar and selector), `lab`, `slt` in `27-cards-core`; a slider's `data-in` verb (33-verbs); the patch keeps a slider's value (27).
- Relations final: `relRow`, `relStatus`, `relHTML` (29); verbs `relwant`, `relgift`, `relon`, `relok`; `REL_WORD` friend, neutral, foe; stance icons from Lucide (`ICON.foe`, `neutral`, `friend`).
- Market on the shared page (`BLD_PAGE.market`, `marketPage`); its size in `SIZE_OF` (one home).
- E1, E2 (`b.made`), E3/N13 (`MSG.page`, `mailp`), E4, E5 (`dropDrag`), E6, E7 (`cardPause`), E8, E9, E11 as above.
- Emergency a slot with its word on the cycle button's rank (`ROW_WORD.emg`); one steel panel for the row and that rank; "+1 Records" (`TECH` short), "+2 Guilds".
- Review fixes: the slider's key (drag kept across the switch); `foeFirst`; `REL_WORD` the one home of the stance words, icons keyed by it, "foe in 30 s"; `mailp:0` on a line with no link; `LABEL` and `--weight` one home each; `.thin` passed by the stance icons only.
- Short names: Bad weather "Weather" (Setup), Record keeping "Records", the Town Center "Town".

Cut
- `src/fonts/barlow-500.woff`, `barlow-700.woff` (the 600 file renamed `barlow.woff`): one weight.
- `--fs-m` and every `font-weight` but the body's 600 and Fell's 400.
- The Setup tick boxes and their CSS (`.tick`, `.tick.daily`), the segmented rows (`seg`, `.seg`, `.segT`, `.seg2`), `.civs`, the civ fold on the face (`civline` and its small-phone rule), the `setup` class on the card, the copyright line on the face (to the book), the one-line `settingsWhy` under the settings (to the book).
- `nativesHTML`, the old `relHTML` rows (Ally/Neutral/Hostile acting at once), the verbs `rel` and `gift`, `NATIVE.gifts` ([100, 300] → `giftMax` 300, `giftStep` 50), the board paragraph on the face (to the book), the tab sub-lines.
- `marketHTML` and the Market's early return in `CARDS.bld`; the Market size case in `renderCard`.
- `.mrows`, `.chips`, `.chip`; the `s15` span; `'end'` in `FULL` (no card); the pause decided in `openCard`.
- EXCEPTIONS #12 and the gate's `name != 'vassal'` skip.
- The words "Hostile" (the card and the two toasts), "ally, neutral, hostile", "+1 research".
- `STANCE` and the stance phrases in `relStatus` (to `REL_WORD`); `ICON.foe`, `neutral`, `friend` renamed `war`, `peace`, `ally`; the gate's inline `verbs()` (to `tests/verbs.py`); `.cin p.why`; the count rule for `.thin`.

Tests
- New `tests/cards.py` (in the gate): Setup stacked, Relations final (a ✓ a row, the friend's gift locked, a ✓ sends its row only, the words), Mail pages, the Market selector, E1, E2, E4, E5, E6, E7, E11, the locked place's name, Emergency on the grid, the steel panel, the map label scale, the vassal's Demand rank. Every check fails on main 38001b9 (run with the same exports added to a scratch copy): 24 failures (the vassal check came after that run; its planted bug is caught).
- `tests/palette.py`: 12 and 18 only; two fonts; one weight, 600, once; two font files packed; every map label through `mapFont`; no phone font. Fails on 38001b9.
- `tests/gate.py`: opens Relations, Research, the milestones and the Army card with Battalions (E8); measures every text's size (12 or 18), font and weight on every card at four sizes; a card's line cut short fails; parts of a control (`.hr`, `.thin`) named; the vassal no longer skipped; `data-in`, `slt` and `sym` verbs checked.
- New `tests/verbs.py` (in the gate, replacing its inline verb check): every control verb has a handler, `choice()`, `offOn()` and `slt` verbs included.
- 31 new planted bugs in `tests/handoff.py` (66 in all), each caught.
- Results (first commit): build, wrap, lint clean; the gate passes (31 of 31; four sizes, both pages); `tests/handoff.py`: every check passes but "the working tree is clean" before this commit; the play fingerprint matches the baseline (the cards change no simulation; `b.made` is a count nothing reads in play); soak seeds 1, 2, 3 for 20 minutes pass (saves 250 to 258 kB; a frame 8.7 to 52 ms with another builder on the same two CPUs).
- Results (review fixes): build, wrap, lint, palette, verbs, words, cards pass; 66 of 66 plants caught. The full gate waits for the merge.
- Merge check (main after the merge): tests/handoff.py START QC PASSED; 66 planted bugs caught; the gate passes at four sizes; fingerprint unchanged.

## Build 80, map (merged Nov 1, before preview 10)
### Map 80 (decisions 2 and 5a, D1, B4; Albert's citadel decision of Nov 1), branch `map80`, not published

**What changed**
- `MAP` 2160; `CORNER` snapped from 751 to 755 in one home.
- The home zone on nodes (`HOME`: clear 200, band 60, rich 1.18; radius `CLEAR` 360).
- Every map coordinate from `MAP`, `MID` and `CORNER` (`PLACES`, `cross`, `COORD`).
- Two squares between buildings (`LANE`).
- Waves judged by progress, with a cool-down that never waits out a win (`WAVE`).
- Every find and deposit in every corner, searched outward (`SEEK`).
- Shared places for both corners; lodes symmetric.
- B4 on the walking grid, cut home round water (`openWays`, `wayHome`).
- Four towers, the shrine on the Throne, the ring symmetric with gates two squares wide.
- Save shape 40.
- `RULES.md` fairness: equal content on nodes.

**Cut**
- The hand `ROUTES` table and the forest's hand clearings (210, 380, −140, 430, 516).
- The shore-shrine leftovers.
- The shared distance per find (`dist`) and laySpots' loose pass and fallback. These were the cause of B3.
- The home pocket's arc and `TURN`.
- `makeForest`'s own reach grid and its straight cuts.
- The camera's typed first spot.
- The A* heap's typed 40000.
- `coord()`'s 2000 grid.
- The animals' `gx`/`gy` graze point (renamed `grazeAt`).
- Two towers on one diagonal and the shrine in the SW yard (Albert, Nov 1).
- The scout loop's corner points from `CORNER` (now from the real Town Centers).
- The dropping of a find or deposit with no room.

**Tests**
- `tests/map.py` in the gate. Worst case on 100 seeds: nearest home node 200 to 260, farthest 340; nearest node of any find 200; nearest node not of the zone 260; edge 21; camera 29 px.
- 55 planted bugs, 55 caught.
- Gate PASS; `handoff.py` PASS.
- Soak 5 of 6 (an ended game; the base fails the same way).
- Balance as above.

**Play fingerprint accepted:** step 1 exact; 1b, decision 2, 5a and the review's layout fixes each move it; D1 and its exceptions do not.
- Merge check (main e4d0c82, cards and map together): tests/handoff.py START QC PASSED; 86 planted bugs caught; the gate passes at four sizes.

## Build 80, research and text (merged Nov 1, before preview 10)
**Research and text (N9, N10, N11, N12, N14; Albert, Nov 1, yes yes). Branch `research80`.**

Changes:
- N9: gather research keyed to the find (`nodeKey`, one home in `08-core`); `fxFits` one home for whether an effect reaches a thing (fxv and the find card); fx `k` may name a list. Fields and mines only: the harvest line on fields (Sickles' card corrected), mining on the stone, gold and iron finds. Bushes, fish and game lose the harvest line (they keep the Dock's steps and Ice house). Felling, the Mint's own bonus and Mali kept as they played.
- N10: cold and wet as layers in series, 1/(1 + Σa) (`insulate`, `12-sim-core`); Wool cloaks and Oiled cloaks a 1 (still half). Weather glass: forecast lead time, the sky rolled a minute ahead per forecast step (`G.clim.ahead`); it needs Weather signs. Ice steps unchanged (friction). SCIENCE.md: two rows.
- N11: the research card's cost formula sentence and the Rules page's twin cut; the w comment fixed.
- N12: the caravan's guards in the caravan row (`armed: { dmg: 4, rng: 24 }`), the Armed caravans card generated from it (reach and hit); Charcoal burning in the Foundry's age (`BLD.foundry.age`); Printing folded into Printing press (×0.68), save shape 40 maps it, a queued order refunded as a cancel (`refund`, one home in `11-orders`).
- N14: Open villagers (`START_VILS`), snow against mud and `snowAt`, ground marks, pausing (generated from `READ_CARDS`), the shrine, the troll, the heavy blows list, the Market's sell rate, the vassal investment list (`VASSAL.invest`), the Net's menu, Oiled cloaks (blizzards). Held for Albert: the Aqueduct room line, the plague line.

Cut:
- The research step Printing (folded into Printing press; its effect kept, its WHY fact kept in the press's line).
- The research card sentence "Cost and time ×(0.5 + 0.1w) for its age" and the Rules page's "Cost and time follow the weight of the step in history".
- Weather glass's cold and wet cut (a barometer is not insulation).
- The Rules entry "Hold ground" (a control that exists nowhere; the Temper dial's Hold replaced it).
- `bonusText`'s own copy of the key rule (and its dead `&& false` branch).
- The typed 4 and 24 in `caravanTick`, the typed 3 in the start's villager loop and in the vassal's investment.
- Sickles on bushes (bushes take no harvest research: fields and mines only).

Tests:
- `tests/tables.py`: fields and mines only (N9), Weather glass's need and its warning two minutes early (N10), no formula on the card (N11), the caravan row and its card, Charcoal, Printing (N12), the Open start, snow, ground marks against the save, pausing against play (F1).
- `tests/science.py`: layers in series.
- `tests/saves.py`: Printing and the rolled sky migrate; the refund reaches the ledger and research spent.
- `tests/handoff.py`: 17 planted bugs (83 in all).
- Play fingerprint: unchanged (each change turned off in turn: all equal the baseline; the five-minute script reaches none of them).
- Balance (4 seeds, 30 min): main and research80 in `docs/5 Builds/v80/p10/Research Notes - v80 - Post Clean - Working.md`. [2026-11-01 07:45]
- Merge with the map: both builds raised the save shape to 40; now the map is step 39 → 40 and research step 40 → 41 (`SAVEV` 41); the saves test runs the research step from 40. The starting villagers keep the map's `PLACES.start` and research's `START_VILS` centring.

- Merge fix (Nov 1, from the hunt): the Mail card scrolled 22 px with a group filter on (11 ranks). The preview switch moved into the pager rank (Previous · Hide previews · Next), and short pages are padded so Next stays put. Test plus 2 planted bugs in tests/cards.py.

## Build 80, combat, spots and the computers' waiting villagers (merged Nov 1, before preview 10)
### Combat batch (Build 80, Nov 1; Albert yes yes 01:17)

**Changes**
- C1: one hostility test, `isFoe` (08-core). Only the Natives follow relations; the rest of the wild is hostile to all, always.
- N4/C4: half strength and no nerve for animals only, tested by kind. C2: the group includes itself. C3: own facing first. C5: nerve drained from the final damage.
- C6: `routAt` replaces `routT`; `MORALE.capAfter` 2 s; save shape 41.
- C7: the healing comment corrected (2.996 τ to 95% of the gap; 53.7 s for the half-dead swordsman).
- C8: converts lose the Native flag and respect the ceiling.
- C9: one reach (`reachOf`, `closeIn`); the petard splash records its attacker.
- Item 5: `takeSpots`, `postTo`, `stepOut`, with the hex `LATTICE`, in one home in 13-sim-civil.
- Item 6: the computer's brain moves waiting villagers by the forager's rate.
- **Play fingerprint accepted:** Combat batch (Nov 1): C1 one hostility test, C2–C9, N4 animal by kind, item 5 own spots, item 6 computers move waiting villagers. Shares by turning each off: item 6 moves all 5 minutes (1539 of the count difference), C4 3 minutes (244); C1, C2, C3, C5, C6, C8, C9 and item 5 none in these 5 minutes.

**Cut**
- `routT` (the end of a rout), replaced by `routAt` + `routSecs`.
- Five hand-written building exits (`b.y + 30`, `halfOf + 6`), replaced by `stepOut`.
- The waiter's own spot search, replaced by `takeSpots`.
- The wild's `U.rng + 5 + halfOf` reach, replaced by `reachOf`.
- `Math.max(p, unitPower(u))` in `groupPower`.
- The `v === t` test in `fromWhere`: `unitsNear` never yields the soldier itself.
- The random `ox`/`oy` offsets at a tapped point (`qidle`, Home), replaced by `postTo`.

**Tests**
- `tests/combat.py` (new, in the gate): every item, each failing on `e4d0c82` except C7 (comment only; it holds the real heal to τ ln 10).
- 14 planted bugs in `tests/handoff.py`.
- Balance before and after: see `docs/5 Builds/v80/p10/Combat Notes - v80 - Post Clean - Working.md`. [2026-11-01 07:45]
- Merge with research: both raised the save shape to 41; research is step 40 → 41, combat (C6, `routAt`) step 41 → 42 (`SAVEV` 42).
- Combat review fixes (f3d741b): wild foes tested by kind (animals and an `outlaw` tag always foes; the Natives' warriors, walls, towers, pits and nets follow relations); personal space one number `SPACE` (3 ft), arrival at one's own spot `SPACE/4`, at work `SPACE`; battalion places through `spotFree`; item 6 ranks by the crowded rate g/(1+others/room), hunts counting their hunters, reachable finds only; save step 41 → 42 tested. Fingerprint accepted once: combat item 6 with research N9/N12 tables (each alone matched its baseline) plus these fixes. Blocked villager-seconds (median, 4 seeds): 6.5 (e4d0c82), 37 now; a carrier jam that predates the batch; a 20-seed run owed. START QC passed, 129 planted bugs caught.

## Build 80 preview 10 (Nov 1): cards, map, research and text, combat with spots and the computers' waiting villagers
Cuts the per-build drafts above left out (from the final fresh review):
- Combat review fixes: the formation's own `freeNear` search (its places now go through `spotFree`); `ARRIVE` 9, `SEARCH.gap` and the push's typed 8 (all now `SPACE`, 3 ft); `wildFoe`'s `!native && !citadel` list (now tested by kind).
- The Mail fix: the preview switch's own rank.

Final fresh review fixes:
- An old save's computers kept their wall plan on the 2000 map's squares and built 80 units off centre: map step 39 drops the plan, so it is drawn again round the moved keep (test in `tests/map.py`, one planted bug).
- The notice toast said "hostile in 30 s": it reads `REL_WORD` ("foe in 30 s"). No test yet (owed).
- The crosshair was red on every wild thing, Native warriors at Friend included: it asks `isFoe`, so the Natives follow your stance. No test yet (owed).

Records: the Build List's Owed section rewritten (built items struck, the night's put-offs added); the hunt's report is `docs/6 Records/v80 Audit/Hunt - Nov 1.md`. [2026-11-01 07:45]

Checks on main before publishing:
- Soak, 6 seeds × 30 min, Hard, every hazard: pass. Saves 222 to 265 kB.
- Balance, 4 seeds × 30 min, against v70 (88b2cb2, the run of Oct 31):

| Measure | v70 | Preview 10 |
|---|---|---|
| Bronze | 4.4 min | 5.7 min |
| Classical | 8.2 min | 9.4 min |
| Medieval | 20.0 min | 24.8 min (7 of 16 sides) |
| Blocked (villager-seconds) | 75.5 | 37.0 |
| Idle (villager-seconds) | 615.5 | 0.5 |
| Sides that fell | 0 | 0 |

  Mali won all 3 of its games, and the balanced seat won 3 of 4. Four seeds only.
- `tests/handoff.py`: see the publish commit.

- [2026-11-01 18:02] Cut from preview 11: the nine long games (120/180/240 min x 3). Reason: Albert will play the preview himself ("you should just do your normal one"). Moved to the overnight run after publishing; the QC standard gains them then. [2026-11-01 18:02]
- **Play fingerprint accepted:** text81 (Nov 1 batch): C11 stashes the load unrounded, so a partial load of 0.5 no longer becomes 1 at the drop-off; it is the whole of the change (each other change reverted alone leaves the fingerprint as it was; C11 reverted alone restores the baseline exactly). [2026-11-01 15:20]

- **Play fingerprint accepted:** Preview 11 merge of wild81, text81, zones81 and ai81: every side starts with 200 food, wood, stone and gold (S1), the computers start with a mill and a farm (EXCEPTIONS #16), plus the wild, famine, caps, text and computers changes. Albert: forget the full QC, get it into the preview (Nov 1 20:49).

## Preview 12 [2026-11-01 21:15]

- [2026-11-01 21:15] Item 5 test (tests/combat.py) waits 80 s, not 40: on the merged map the open point on seed 1 is about 360 from the Town Center and the villagers were still walking at 40 s; at 80 s all 12 stand on their own spots on every seed. Test only, no game code. (Albert, Nov 1 21:14, yes yes) [2026-11-01 21:15]

## Build 80 preview 13 (reach: no sleeper beside berries) [2026-11-02 00:10]
- Albert's sighting (Nov 1, 23:37, five pictures): villagers asleep in a pile beside the mill with full bushes right there; "they bump into each other, get trapped, it's a mess". Reproduced: seed 1, a mill by the five nearest bushes, 20 villagers given Food from the Jobs row; at minute 5 the bushes are spent and all 20 sleep at the mill for the rest of the game, full bushes 180 to 225 from the mill untouched. Cause: the search radius (90 to 180), the leash (200) and the placed cap (180) were written for the v62 map and never re-measured when the zones put the home finds at 230 to 290 (D-088). [2026-11-02 00:10]
- Changed: one number REACH = HOME.clear + HOME.band + 60 (350 today), derived; the search r(t) = REACH/2 + REACH/2·min(1, t/τ), the leash and the placed cap are REACH (`06-rules-tuning`, `12-sim-core` bestNode). The overflow of waiters takes a spot on the next drop-off, nearest first, and only with no spot anywhere stands where it is (`13-sim-civil` waitAt). `tests/handoff.py --plant --only=word` runs just the plants named with that word. [2026-11-02 00:10]
- Cut: the typed 90, 90, 200 and the leash's use of DANGER_R.far (DANGER_R.far stays for the scares, 13-sim-civil). [2026-11-02 00:10]
- Not changed: the worker count (B on the list was withdrawn: a probe of Claude's held a stale bush); the idle count in the strip (D on the list: not reproduced, the strip matched the Zs 11 and 15 in the harness; waits on Albert's steps); the clearing (the human's food per villager-minute is 14 against v70's 24 with the same policy and seed, because every find is now a 250 walk and the player has no mill; parked for Albert). [2026-11-02 00:10]
- Tests: `tests/moves.py`, the search tests rewritten in REACH, two new (the sleeper scene, the overflow); `tests/science.py` reach; three plants, each caught. Results: the sleeper scene after the fix, waiting 0 from minute 5, gathering 2,315 to 3,195 by minute 9 (it stood at 2,315). The gate: see the publish commit. Soak and balance: overnight, in the next hand-off. [2026-11-02 00:10]
- Housekeeping: the four builders' notes files (AI, TEXT, WILD, ZONES) moved from the root to `docs/5 Builds/v80/p11/`; `docs/4 Now/Handoff.md` replaced (it still described preview 11's merge). [2026-11-02 00:10]
- Results after the publish (Nov 2): soak seeds 1 to 3, 20 min, pass (saves 283 to 295 kB; a frame 7.5 to 12.9 ms here). Balance, 4 seeds x 30 min, preview 13 against v70: Bronze 8.2 against 4.4 min; Classical 12.9 against 8.2 (15 of 16 sides); Medieval 21.4 against 20.0 (8 of 16); Gunpowder 22.3 (3 of 16, none in v70); no side fell in either. Villager-seconds idle with no work found 0.0 against 615.5 (the reach: nobody sleeps); blocked 50.5 against 75.5; waiting at a workshop 0.0 against 630. [2026-11-02 00:45]
- Three things the balance run shows that preview 13 did not touch, for Albert (Owed): (1) the computers age up far slower than v70 on the merged build, Bronze 8.2 against 4.4, with the mill-and-farm handicap in; preview 10 was 5.7 and 9.4, so the Nov 1 batches (zones, the computers by need, wild) cost the rest. (2) Seat 1, the aggressive personality, won 3 of 4 and took every wealth, wellbeing and overall crown in all 4 games; v70's wins were spread over seats 0, 1, 2. (3) The computers trained no caravans at all (0 against 96 in v70): D3's rule, "a venture needs gold over the next age's gold + 900", looks like it never lets one through. Four seeds only; 20 before a rule changes. [2026-11-02 00:45]

## Build 80 preview 14 (posted workers, four zones) [2026-11-02 07:48]
- Albert's sighting (Nov 2, 01:10, two pictures; "Fortress beat me", "got to gunpowder before me"): fields empty with Zs, villagers on berries beside them, "They were in the farm, they left". Cause in the code: shelter dropped a farmer's field and it came out to the best rate; the Town square stopped every job; + took the lowest earner on any job, a farmer included. Locked as D-089. [2026-11-02 07:48]
- Albert's four zones (Nov 2, 07:07 to 07:14) against what was built (the home finds at 230 to 290, inside the band meant for walls; nothing in the clearing; zone 1 held out). Locked as D-090. [2026-11-02 07:48]
- Changed (D-089): a villager given a building is posted (`u.plot`) until tapped off or the building falls; it goes back to it after shelter, the Emergency, a fire or a site, and waits there when it cannot work; + and − never take a posted villager (− frees idle first, then roaming); an order from a building takes an idle villager only; "No free hands: train more villagers."; the strip's Z counts idle people and empty posts (`idlePost`, one home with the field's Z); an old save's farmers are posted on load. [2026-11-02 07:48]
- Changed (D-090): zone 1 on, from the Town Center's lane to 220, behind it; your zone to 220, the five home finds (berries 150, home grove 165, gold 180, stone 195, iron 210) the same walk in every corner, random direction; the computers' wall ring 260 (was 190); the forest and every wild find from 300 (the forest was from 360); water still from 360 (CLEAR); REACH = the wall ring, 260 (D-088 had 350). Carried finds keep their own room past the band (the ruins made two holes in 400 wall rings). [2026-11-02 07:48]
- Cut: `BACK.on` and its dormant branch (zone 1 is on); the typed WALL_R 190 and the clearing derived from it; HOME.band; the forest's use of CLEAR; − calling a shop worker out (Build 60; a shop worker leaves by Send out); "No villager is free." (now "No free hands: train more villagers."). [2026-11-02 07:48]
- Tests: `tests/moves.py`, five posted-worker checks (shelter, the Emergency, + and −, the building flow, the strip); the deer checks moved onto open ground (the forest now reaches 300); the anchor test retuned to REACH 260. `tests/map.py` rewritten for the four zones (100 seeds: zone 1, the same walk to each home find, nothing else inside 300, every wall ring whole). `tests/cards.py` E2 gives the workshop an idle villager. `tests/science.py` reach = the wall ring. `tests/balance.py` and `probe.py` set `ai.bot` on seat 0 so the computer playing your seat plays by computer rules (without it, seat 0 never left Stone: its sites took idle villagers only). Six plants for D-089, five for D-090, each shown caught; two plants that went stale in the ai81 merge retargeted (the bottleneck, the villager ceiling). [2026-11-02 07:48]
- Fingerprint: moved (the map); accepted with the reason in the gate. [2026-11-02 07:48]
- Results: food at minute 8 on seed 1, the same plain play: 689 (v70 633, preview 12 430). Balance, 4 seeds x 30 min: Bronze 5.8 min (v70 4.4, preview 13 8.2); Classical 9.6 (8.2, 12.9); Medieval 19.6, 14 of 16 sides (20.0, 6 of 16; 21.4, 8 of 16); Gunpowder 24.1, 8 of 16; no side fell; idle with no work 1.0. Worse: blocked villager-seconds 169.5 (preview 13 50.5, v70 75.5); the aggressive seat won 4 of 4 and every wealth, war and overall crown. [2026-11-02 07:48]

- **Play fingerprint accepted:** Build 80 preview 14: D-090 the four zones (home finds 150 to 210, the same walk in every corner; zone 1 on; forest and wild from 300) and D-089 posted workers: the map and the first minutes move [2026-11-02 08:40]


## Build 80 preview 15 (the nearest builder, rest, Focus) [2026-11-02 09:16]
- Albert, Nov 2, 08:05 to 08:53 (yes yes 08:53): D-091 with nobody idle the nearest villager raises a site you place, then goes back to exactly what it was doing; D-092 rest: a posted villager waits on a spot of its own round its building, a unit at rest that is nudged stays where it was nudged, a grazing deer is drawn head-down; D-093 Focus on the villager card, F over its head, it stays where you put it. [2026-11-02 09:16]
- Measured before the fix: seven villagers stopped on one point walked about 1,400 units every 10 s going nowhere (the shuffle); after, 0. [2026-11-02 09:16]
- Changed: `autoBuilder`, `sendBuilder` (remembers the job, the find or building and the anchor), `backToWork` (restores them), `repairTick` (u.back: straight home); a posted villager never searches for another building; `pushApart` settles a unit at rest (`atRest`, `settle`); the four-legged figure's frame 4; the villager card's actions as two and two (Stop, Focus, Send home, Dismiss); `vfocus`; `idleMark` draws the Z and the F. [2026-11-02 09:16]
- Cut: nothing. [2026-11-02 09:16]
- Tests: `tests/moves.py`: the nearest builder goes back to its own bush; the posted waiter's own spot, still; seven on one point at rest; Focus (the button, + and −, the spent bush). Six plants (p15), each caught. The deer's head-down frame has no test (a drawing). [2026-11-02 09:16]
- Fingerprint: moved by D-091 alone (traced by taking each change out): the scripted house is now built. [2026-11-02 09:16]
- The Grower test (branch `grower-test`, not in this preview): 4 seeds x 30 min against preview 14, the same seats: seeds 1 and 2 identical, 3 and 4 +1,254 and −822 in score; in 30 minutes neither marches nor reaches its army limit, so the two brains barely differ. Needs longer games. [2026-11-02 09:16]

- **Play fingerprint accepted:** Build 80 preview 15: D-091 the nearest villager raises a site when nobody is idle: the scripted house is now built (in preview 14 it never got a builder), so the town grows to 7 at minute 3 and food dips while it builds; traced by taking the change out alone (the rest moves minute 5 a little: rest spots) [2026-11-02 09:16]

## Build 80 preview 16 (standardization, M1 to M7) [2026-11-02 10:09]
- Albert, Nov 2, 09:54 to 09:58 (yes yes): merge what is written in more than one place, no rule changed; the play fingerprint must stay exactly the same (it did). [2026-11-02 10:09]
- M1 `byId(list, id)`: 36 hand-written look-ups by id. M2 `dist(a, b)`: 23 hand-written distances. M3 `crowd(n, ±1)`: 17 hand-bumped worker counts. M4 `standing(b, o)`: 13 hand-written "finished, standing, this side" checks. M5 `NS_rng`: the seeded dice written by hand 4 times (building art, the sky's lightning) now use the one home, moved to `08-core`. M6 `scanNear`: the unit grid's scan, written out in nearestFoe, bestFoe, nearU and unitsNear, now one. M7 `TOAST` (short 3, mid 5, long 8): 219 toasts typed their own seconds (2 to 10); now three lengths, the only change a player sees. [2026-11-02 10:09]
- Cut: the hand-written copies above. Nothing else. Five plants repointed at the new text, each shown caught. Size: src 364 lines in, 382 out. [2026-11-02 10:09]

## Build 80 preview 17 (one home: O1 to O4) [2026-11-02 10:41]
- Albert, Nov 2, 10:27 to 10:32 (yes yes): the parts map's items that need no mockup. Rule: the play fingerprint identical, and every card's screenshot at 390 x 844 identical before and after (a new harness: time, dice and CSS animation frozen; two runs of the old build matched 23 of 23). [2026-11-02 10:41]
- O1 one clock: `mmss` (39-huddle) was `clock` under another name; 8 calls repointed. O2 one army: `armyFree(o, ...busy)` and `BUSY` in 08-core; `troops`, `sendable` and the two selection filters now name what they leave out (spy, shrine, escort, school, rout, unarmed); each counts what it counted. O3 one ring: `ring()` in 24-view-overlays draws the 10 stroked rings on the map (selection, ripples, the group's health, placing marks, events); the filled shapes (logs, meat, flames, shadows) are drawings, left as they are. O4 one looks-dice: `lookDice` (08-core, from NS_rng) for the 23 `Math.random` calls in the sky, the sound and the ground's texture; the game's rules never read it. [2026-11-02 10:41]
- Results: fingerprint identical; 23 of 23 screens identical with O1 to O3; the map's ground speckles differ with O4 (a seeded pattern now; shown by taking O4 out alone: the map is then identical). Gate passes; one plant repointed (the School student, now on armyFree), caught. [2026-11-02 10:41]
- Not done, for Albert: O5 (messages into 07-text): 95 of the 180 fill in names and numbers and would each become a function, more code not less; half moved would be two homes, so none moved. O6 (hand-built screen parts into the mold): 220 of the 296 are words' bold and italic, not parts; of the 36 parts only 3 or 4 match the mold's button, and the mold's capitals would change their words on screen; the rest are parts the mold lacks (the mail row, the queue slot, the link, the HUD cell), design work for the Formation. Both in Parked. [2026-11-02 10:41]

## Build 80 preview 18 (Train and Research double-wide, T1) [2026-11-02 11:03]
- Albert, Nov 2, 10:42 to 10:54 (yes yes): every building card's Train and Research buttons double-wide, three a rank, a short rank filled with faint empty places; the rule written down (MENU-SPEC §10). [2026-11-02 11:03]
- Changed: `grid3` (27-cards-core) lays them; the building card (30-cards) uses it for both ranks. A refused Train button's reason in a double slot's few words: "line full", "hungry" (the full sentence grew the rank past one slot; the gate caught it). [2026-11-02 11:03]
- Seen: the Town Center, House, Market and Workshop cards changed (the single research button that filled a whole rank is now two slots with two empty places); the other 19 cards identical. [2026-11-02 11:03]
- Tests: `tests/cards.py` T1 (every Train or Research rank filled to three); E6 now expects the short reason; two plants (T1 new, E6 repointed), caught. Gate passes. [2026-11-02 11:03]
- Parked (Albert): the 6 x 7 grid for every menu; measured: 13 of 22 cards are taller than 7 ranks (Help and Guide 13, Setup 12, Market and Army with squads 11, Vassal and Mail 10, Research, Misfits, Milestones and Army 9, Score and Relations 8). [2026-11-02 11:03]

## Build 80 preview 19 (the building card's last rank, S1 and S2) [2026-11-02 11:43]
- Albert, Nov 2, 11:30 to 11:34 (A, yes yes): no gold outlines round Train and Research (drawn, and turned down); no "yours" line on your own building card (S1); Help, Repair and Raze one slot each on the last rank of every building card (S2); "Take down" is now "Raze", its refund under it, its second tap "Sure?". [2026-11-02 11:43]
- One word changed by Claude to fit (flagged to Albert): "Send help" is wider than one slot at 375 pt (the gate), so "Help". [2026-11-02 11:43]
- Results: the Stable 9 ranks to 7, the Barracks 8 to 6, the House 6 to 5. Gate passes; `tests/cards.py` S1 and S2 with two plants, caught. [2026-11-02 11:43]
- Cut: the "yours" line on your own cards; "Take down", "Tap again" and "back" on the last rank; the full-width Send help rank. [2026-11-02 11:43]

## Build 80 preview 20 (the line above Train, Build menu threes, the tab corner: Q1, T2, F1) [2026-11-02 12:05]
- Albert, Nov 2 (I like the steel; no ribbon outline; yes yes): the training line moves above the Train rank in its own steel box with no edge (Q1); every Build tab two slots a building, three a rank, a short rank filled with faint empty places (T2); the open tab at the card's edge meets the outline square (F1). [2026-11-02 12:05]
- Changed: `30-cards.js` (the line before `grid3(trainButtons)`; the Build menu through `grid3`), `29-card-pages.js` (`slotsHTML` rank class `queue`), `shell-head.html` (the steel box; the tab's edges; square corner under the first or last open tab). 10 lines in, 5 out. [2026-11-02 12:05]
- Tests: `tests/cards.py` Q1 (steel box, above Train) and T2 (every Build tab's ranks filled to three); Q1 planted (box class removed), caught. Gate passes. [2026-11-02 12:05]
- Cut: the line under the Train rank; the Build menu's hand-filled ranks (now the one `grid3`). [2026-11-02 12:05]

## Build 80 preview 21 (the colour levels; the queue without its box; the cycle button) [2026-11-02 12:45]
- Albert, Nov 2, 12:14 to 12:30 ("just do it"): every colour is a hue at a level, full, dim or faint (COLORS.md); the queue's places stay steel with brown between; a dim tech's edge faint white, apart from Train; the half gap under the top ribbon; the cycle button brown on every page, only its word changing. [2026-11-02 12:45]
- Merged: Cream 1 and the old White (#e9ecef) are one white, `--ring-w` #ece5d3; Cream 2 is that white at the dim level (80%, blended into what it sits on); the hand-set 35% and 50% blends are the faint level. The five age colours moved into `:root`; the Natives' health bar uses the Natives' colour, not its own. [2026-11-02 12:45]
- Found on the way: a dim button on the War page was brown on steel (the states layer beat the steel rule); dim on steel is now Steel 1, steel's own first step. A dim button keeps its Brown 3 edge, so it no longer looks like an empty place. [2026-11-02 12:45]
- Tests: `tests/palette.py` reads the dim white's contrast from the level (4.5:1 on Brown 1, Brown 2, Steel 2); `tests/cards.py` the levels (dim tech edge apart from Train; the cycle button the same on Jobs and War); three plants, caught. [2026-11-02 12:45]
- Cut: `--cream-1`, `--cream-2`, the old White, the queue's steel box, the cycle button's steel tint, the Natives' bar colour #c9b48a. [2026-11-02 12:45]

## Build 80 preview 22 (Emergency a page of the row; no panel; the quick action a sword; building cards two fixed heights) [2026-11-02 13:28]
- Albert, Nov 2, 12:59 to 13:12 (yea yea): Emergency turns the row instead of covering the map; the Emergency button red; no panel behind the row; the quick action for emergencies only, small (sword, then All or Idle, then go; hold the ground for the Here card); building cards one of two fixed heights by kind; a picked villager and a tap: the obvious order (it was already so, Build 40: nothing built). [2026-11-02 13:28]
- Results: the House card 5 ranks to 4 (the info rank on the title's line); the Barracks, Stable and the rest that train 8 always, so nothing changes height as a building goes up or its techs come and go. [2026-11-02 13:28]
- Found: a card could keep the last card's height until the next change of its content (the Mail scrolled after a building card); the height is now set at once (`cardRanks`). [2026-11-02 13:28]
- Tests: gate QUICK redrawn (one sword of 44 centred under the finger, All in its place, Idle toward the middle), the hold opens the Here card; `tests/cards.py` card sizes, Emergency page, no panel; `tests/saves.py` All hands on the page. Plants: five new, five repointed. Gate passes. [2026-11-02 13:28]
- Cut: the Emergency card, its "How it works" fold (the Guide says it), the steel panel, the quick action's hammer, menu, ✕ and +, `infoRank`, the info rank on building cards. [2026-11-02 13:28]

## Build 80 preview 23 (one start; the Alarm; the bullseye; the page dots; the title box; glass cards) [2026-11-02 14:15]
- Albert, Nov 2, 13:54 (yes yes yes): one start for every agent (`CLAUDE.md` points to `START-HERE.md` §1, which overrides anything else); the full QC renamed Live QC and kept for going live and overnight, not a session's start (`START-HERE.md`, `02 SOP.md`, `06 QC standard.md`). [2026-11-02 14:15]
- The Alarm: Emergency renamed (too wide); its orders Work (was Stop: it never stopped anything, it sent everyone back), Gather (was Town square), Garrison (was All hands), Shelter. Their behaviour unchanged. [2026-11-02 14:15]
- The quick action's first chip a bullseye (the diamond turned down), blue, red on an enemy. The cycle button the same on every page: › over three dots; ICON.cycle cut. [2026-11-02 14:15]
- The building title box: its age the top edge (the tech rule), its health a bar (length and colour), a building going up the green ring; the second line cut for your own buildings, kept for what only a kind says (a field's crop) and another side's owner; room, health and age in the book. The small card 4 ranks to 3 (the gap under it gone); full 8 to 7; the Town Center 8. [2026-11-02 14:15]
- Glass: cards at 92% Brown 1 (one number, `--glass`, the end card's 90% folded in); no blur. 90% failed the contrast check for red words over white ground (4.3:1), so 92%. [2026-11-02 14:15]
- Tests: cards.py the title box, card sizes at 3 / 7 / 8; gate the page dot follows the page; palette.py the glass over white. Plants: four new, one repointed (E11), caught. Gate passes. [2026-11-02 14:15]
- Cut: Emergency, Stop, Town square, All hands (as names), the ↻ icon and the page word on the cycle button, the info line on your own building cards. [2026-11-02 14:15]

## Build 80 preview 24 (cards bottom-anchored) [2026-11-02 14:38]
- Albert, Nov 2, 14:26 to 14:33 (go for it): the fixed card heights of preview 23 padded the Barracks and the Town Center 106 px over the row; a card now rises from the row as tall as it holds, its last button one gap (6 px) above the row on every card. Whole-rank rounding cut too (it left up to a rank of padding). [2026-11-02 14:38]
- Code: the fixed heights (`CARD_RANKS`, `fixOf`, `bldFull`), the content observer and `--rk` cut; the style sheet's `max-height` is the whole rule. [2026-11-02 14:38]
- Tests: `tests/cards.py` card sizes now measures the gap over the row on the House, the Barracks and the Town Center; its plant (a card padded to its cap) caught; the two fixed-height plants removed. Gate passes. [2026-11-02 14:38]

## Build 80 preview 25 (the quick action, fixed) [2026-11-02 15:06]
- Albert, Nov 2, 14:54 ("we messed it up"): a sword and ✕; the sword turns to All (the word) and ☰ (the Here card); All sends every soldier. [2026-11-02 15:06]
- The bug he hit: a tap anywhere while it was open closed it and at once opened a new one under the finger, so it could not be put away. A tap while it is open now only closes it. [2026-11-02 15:06]
- Cut: the bullseye and its icon, Idle and its verb (`qidle`, `qaIdle`: idle villagers called to the spot). [2026-11-02 15:06]
- Tests: gate QUICK (a sword of 44 under the finger with ✕ toward the middle; All in its place with ☰); a tap elsewhere closes it; ✕ closes it; ☰ opens the Here card. Plant: a tap elsewhere that reopens it, caught. [2026-11-02 15:06]

## Build 80 preview 26 (the hold launches an attack; the quick action cut) [2026-11-02 15:41]
- Albert, Nov 2, 15:19 to 15:35 (mocked: smaller chips, icons only, a bullseye, his arrow, lock-on, chevrons, crossed swords; chosen: a point that grows into a ring; "let's try it"): hold the ground or an enemy 1.5 s and every soldier goes; the ring snaps out at full. A tap shows "Hold to launch attack"; a double tap on the ground opens the Here card. [2026-11-02 15:41]
- Why: the quick action could not tell a tap that meant "here" from one that meant "close" (Albert: "how does it know?"); a hold means one thing. [2026-11-02 15:41]
- Cut: `#qa` and its styles, `QA`, `showQuick`, `quickStep`, `hideQuick`, the verbs `qsword`, `qall`, `qhere`, `qclose`, `holdAt`, the red ring under the quick action's enemy. The cavalry's `CHARGE` kept its name; the hold is `LAUNCH`. [2026-11-02 15:41]
- Tests: gate the hold (a tap teaches, a double tap opens the Here card, letting go sends nobody, a full hold on an enemy sends every soldier at it), QUICK measures the ring. Plants: four new, caught. Gate passes. [2026-11-02 15:41]

## Build 80 preview 27 (the battle station) [2026-11-02 16:56]
- Albert, Nov 2, 16:13 to 16:36 (his drawings; "this is gold"): the War, Train and Alarm pages become one, the controller: the Alarm's orders left, the small map in the middle (tap: go there; hold: launch the army there), Train · Squad / Orders · Attack right, with Train and Squad turning the middle to their four. Muted steel, no state rings, a red flash on a tap. [2026-11-02 16:56]
- The small map moves into the middle while the station is up (one canvas, one home), and back to its corner after; it draws whether or not the corner map is on. [2026-11-02 16:56]
- Cut: `warPage`, `trainPage`, `ROWS.emg`, the Train page's squad picker (`tsq`), ✓ ✕ (`tcancel`, `wabort`, `waim`, `torders`), the Here card (`CARDS.ground`, `rally`, `spygo`; a double tap on the ground opens nothing), `H.mode` (rally). Found: `hdel` (Abort on a squad's card) had lost its verb in the cleanup; the gate caught it. [2026-11-02 16:56]
- Added: `data-hold`, one way for any button to carry a second verb on a hold (the station's one fewer, a squad's card, everyone home), on the tech tip's own timer. [2026-11-02 16:56]
- Tests: `tests/cards.py` the station (the Alarm button in and back, Train and Squad turning the middle, no state ring, the small map back in its corner); gate the cycle button Jobs ↔ station, Attack and Home, a double tap on the ground opens nothing; `tests/saves.py` Garrison's dot. Plants: four. [2026-11-02 16:56]
- Parked (Albert, 16:50): fog that drifts with the wind on the small map. [2026-11-02 16:56]

## Build 80 preview 28 (the War Director; War, the Mail's door, the map's one home) [2026-11-02 17:53]
- Albert, Nov 2, 16:36 to 17:34 ("I want this like real army control"; "let's crush it"): the War Director on the station's middle, Direct in place of Orders (Orders is a hold on Train): Shield wall / Advance, Loose! / Fall back, Charge / Wheel, Bombard / Pull back, each on every soldier of its kind at once, with its horn, its line and the red flash; a wait as seconds on the slot. No new number but the seconds (DIRECT; SCIENCE). [2026-11-02 17:53]
- The War button (was Alarm): steel, red edge, on the rank above the row at the right; ✕ while the station is up; the chevron and the page dots cut. The small map's one home is the station; the corner map, its setting and its top-bar button cut. The top bar's last cell is the Mail with its unread count: the Mail's door (D-080, open since Nov 1) closed; Milestones a row on the Score card. [2026-11-02 17:53]
- The campaign desk (Albert's pick of the three skins): the villagers' block brown, the war block steel tinted red at the faint level; the middle brighter steel in its white-edged frame. [2026-11-02 17:53]
- Found: fallBack says "The army fall back." for any set; it now takes the Director's words for the kind. [2026-11-02 17:53]
- Cut: `ICON.next`, `ICON.map`, `pageCycle`, `PAGES`, `applyMini`, `SET.mini`, `SET.mapSeen`, the `map` verb. [2026-11-02 17:53]
- Tests: gate the Director (the wall's shape and temper, the volley's reload and its hits, the charge and its wait on the slot, Bombard hitting a building, the hold's fall back), the War button turning the row, the mail count and door; `tests/cards.py` the War button a slot at the right with ✕ up, no chevron, the map nowhere but the station. [2026-11-02 17:53]

## Build 80 preview 29 (the outside audit of the station and the Director, Nov 2, 18:04) [2026-11-02 18:19]
- Albert pasted an outside audit of preview 28's code; each claim checked against the code. Right and fixed (13): Loose had no wait (a tap a frame was a machine gun): 6 s, on the slot. Charge sent winded riders before the check, and sounded the horn twice. Charge and Wheel shared one lockout on the slot. A shield wall kept its soldier's target. Fall back sounded the horn with no Town Center. Wheel's centre broke with the riders split (now the far side from your Town Center). A thumb rolling 1 to 3 px cancelled a button's hold (8 px now). The small map did not capture the finger (now it does, and 8 px of movement cancels the launch). The hold took 320 ms + 1.5 s (now 1.5 s from the finger landing). A hold with no soldiers said "No soldiers yet" over a box-select (silent now; a tap still says it). A launch could fire while paused (cancels). Wheel's and Loose's waits were not saved. [2026-11-02 18:19]
- Wrong (3): the lift after a hold fires the tap (no: the click after a hold is swallowed, `lpDone`; a test now holds Attack with a 3 px roll); `u.wall` stripped on reload (no: units save every property but a skip list); the crosshair a dead clone after reload (no: the HUD is rebuilt on load). [2026-11-02 18:19]
- Tests: gate the reload wait on the slot, winded riders not sent, the hold through a 3 px roll, a tap with no soldiers. Plants: four. [2026-11-02 18:19]

## Build 80 preview 30 (a drag on the small map pans) [2026-11-02 18:36]
- Albert, Nov 2, 18:28: a drag on the small map sweeps the camera with the finger (no glide) and launches nobody; a tap still jumps, a hold still launches. The standard small-map behaviour. Gate test and a plant. [2026-11-02 18:36]

## Build 80 preview 32 (Albert's five: mail, squads, the strike, the sky, the guard) [2026-11-02 21:35]
- Mail: the icon dead centre in its slot; the count a red badge at its top right; hidden at 0; "99+" past 99. Test and two plants. [2026-11-02 21:35]
- Squads: Squad A/B/C/D are now Alpha, Bravo, Charlie (three squads); the fourth tile of the Squad page is "Set Up" (gear), a card that lists the three squads and opens each one's builder. Save 43 to 44 folds the fourth squad into the others. Tests (gate, saves) and three plants. [2026-11-02 21:35]
- Attack, replaced: tap bare ground and a sword shows there; tap the sword and it is the reticle (the crosshair's drawing, with the time and place); tap the reticle and every soldier goes. A tap elsewhere moves or drops the sword; a tap on an enemy opens its card; with no soldiers a tap says "No soldiers yet". The sword starts only on bare ground. [2026-11-02 21:35]
- Cut: the hold to launch an attack, its ring (`drawLaunch`, `LAUNCH`), the words "Hold to launch attack" (`HOLD_WORD.attack`), `launchAt`, `cancelLaunch`, `fireLaunch`, `hintAt`, the 'launch' drag mode, and the hold on the small map (a drag still sweeps the camera, a tap still jumps). The hold on a button (Everyone home) and the hold that picks a soldier stay. The old gate checks and two plants are rewritten for the strike. [2026-11-02 21:35]
- Sky: the weather tint now runs to the top of the screen under the bars (solid there, the fade below as before, the clouds unchanged). Test and plant. [2026-11-02 21:35]
- Guard: a ResizeObserver on the map calls `fit()` whenever its box changes size. A safety net for the squashed map that could not be reproduced; not a proven fix. Test and plant. [2026-11-02 21:35]

## Build 80 preview 33 (Albert's list of Nov 3: the tap, the mine, the Director's drills, the test field, the six fixes, the sweep) [2026-11-03 06:40]
- The tap is a right click (Albert, 06:14, "yes yes" 06:21): with units picked a tap is their order, as it was; with nothing picked a tap on open ground puts the sword and ✕ at the finger (`showQuick`, `quickGo`, `hideQuick`, `#qa`; 28-army-quick). The sword sends every soldier; ✕, a pan, a pinch or any other tap closes them. Test and five plants. [2026-11-03 06:40]
- Cut: the strike of preview 32 (`strikeAt`, `strikeTap`, `cancelStrike`, `drawStrike`, `G.strike`, the strike's stage in `drawReticle`), `G.hint` and its words over the map, `foeOf` (used only by the hold, cut Nov 2), the ResizeObserver guard (the frame check below covers it). [2026-11-03 06:40]
- The hold's ring shows only after 250 ms (`PRESS_SHOW`): it flashed on every tap. Test and plant. [2026-11-03 06:40]
- The mine (Albert's sighting, 06:09): the gold was on the danger map (every 2 s a villager drops a find there, silently). Now a send to a find in real danger says why and sends nobody (`dangerWhy`, 09-nav); a villager that must leave says why; your own order outlasts a fright remembered there (`u.sent`); the builder of a mine, mill or lumber camp pulled off its work works the nearest find it serves (D-091 amended). Tests (moves.py) and three plants. [2026-11-03 06:40]
- The Director's drills (Albert: "form a line", "a semi circle or arc"): Shield wall dresses the foot in one rank (two past six) facing the nearest foes, GRID.gap apart; Loose sets the archers on one arc round the foes' centre at 80% of the shortest bow's reach (`DIRECT.arc`), GRID.gap apart along it, within 120°. `dress`, `drillOn` (28-army-quick); the army's grid lays the shape (12-sim-core); a drilled soldier goes to its place first, then fights only what is in reach (14-sim-troops). Any new order ends the drill. Tests (gate) and three plants. [2026-11-03 06:40]
- The test field: the page opened with `?test` (`testField`, 41-boot): you and one rival at war, fog and events off, 5,000 of each, Engagement, Battalions and Formations, both armies 600 apart along the most open way out, a mine site by gold with a wolf, never saved. Test (`tests/testfield.py`) and plant. [2026-11-03 06:40]
- The six: the strike's two test holes (gone with the strike; the new tests fail on their plants); the sword is the bar's sword icon on a round chip (the drawn one read as ✕); the frame check: each frame, a drawing that does not match the map's box is measured again (41-boot; the squashed map); MENU-SPEC §6 and §7; the reticle's words above its scope line. [2026-11-03 06:40]
- The sweep: no top-level name left unused (every function and constant in src checked against the source and the tests); stale comments on the station and the Help text fixed. [2026-11-03 06:40]
- Parked (Albert, 06:33): a drill's x% rule and countdown, the other arm moving to help, choke point, front line and support formations, forward and support bases, war camps (`Parked.md`). [2026-11-03 06:40]

## Build 80 preview 34 (the controller: Albert's list of Nov 3, 08:51, "yes yes") [2026-11-03 09:05]
- The controller replaces the row (MENU-SPEC §6): seven columns, 6 at the edges and 3 between, ranks 44; Jobs over Town left (brown), War over Close right (steel); the small map 3 × 2 at rest with its Map tile; Jobs as before; Town one column (People over Build), then the build groups, Research and Relations, then a group's buildings; War's ten (Aim · Go, the three squads, Kinds, Alarm, Rally, the shape, Train, Set Up) and its three pages (Kinds, Train, Alarm); Close folds it to one tile. `ctlHTML`, `ctlOpen`, `ctlBack`, `jobsCells`, `townCells`, `warCells` (39-huddle); verbs `ctl`, `ctlsub`, `ctlback`, `mapt`, `ctlshut`, `relopen`, `alarmpg`, `aimgo`, `kpick`, `kidle`, `rallyat` (33-verbs). [2026-11-03 09:05]
- The small map is cut to its box's width round the camera (`miniCut`, 24-view-overlays; the finger reads it the same way, 26-input). [2026-11-03 09:05]
- Past the map's foot, under the controller, the ground runs on to the screen's edge (21-view-frame: the map's last rows drawn down; the camera's limits unchanged, so nothing on the map hides under the row): the dark band under the tiles is gone. [2026-11-03 09:05]
- Tests: gate (the controller at rest, Town's one column, Build, a group, Back, Jobs, the Map tile, Close, 7 columns of 3, a tile 44 or more, the map's foot; War's ten, Kinds picking, Aim · Go sending, Rally), cards (the colours by side, the small map in its box, nothing above the row); ten plants. [2026-11-03 09:05]
- Fixed tests (the holes of preview 33): the shield-wall test no longer crashes without a drill; the drilled-archer test now gives it a foe to chase. [2026-11-03 09:05]
- Taken out: the mine's builder change of preview 33. The builder already went to the gold; the test passes without it (D-091 note). Its plant with it. [2026-11-03 09:05]
- Cut: the War button (`#emgB`), the cycle button, `jobsPage`, `stationPage`, `SMID`, `ROWS`, the station's styles; the Build menu card (`CARDS.menu`, `buildrow`, `G.buildAt`, `G.lastMenu`: a milestone's or a villager's Build opens Town · Build); the Director's second moves (`advance`, `back`, `wheel`, `directh`, `DIRECT.wheel`, `DIRECT.behind`, `G.wheelT`); `emgpage`, `wmid`, `wfire`, `tok`; EXCEPTIONS #17 closed. [2026-11-03 09:05]

## Build 80 preview 35 (the share as a tap cycle: Albert, Nov 3, 10:06) [2026-11-03 10:09]
- A tap on a kind in War · Kinds picks all of it; again half, again a quarter, again all; the tile shows the count and the step. At the map's tap the ones nearest that spot go, the rest stay (`SHARE`, `sharePick`, `shareOn`, `shareFor`, 28-army-quick; tapAt, 26-input). Test (gate) and two plants. [2026-11-03 10:09]
- Built and cut the same morning (never published): the slider up the right edge (Albert, 09:40; cut 10:06 on his outside note: no haptics in Safari, Android's back gesture at the edge, the eyes off the battle; and it kept the ones nearest the middle of the screen, not the target). [2026-11-03 10:09]
- Already in the game, out of date in the notes: prisoners and ransom; the hold-to-launch ring, Squads A to D, the battle station. [2026-11-03 10:09]
- Tests: the controller's size check reads the tile's width (seven columns of 3), not the grid's track list (it counted an implicit column); the Town plant gives a page, not a crash; the drawing check waits 250 ms (the idle frame is 66 ms). [2026-11-03 10:09]
- Test: the drilled archer's check moved to a fresh field at the end of the events test (in the busy field another foe pulled it, so its plant could not fail); now it fails on its plant. [2026-11-03 10:18]

## Build 80 preview 36 (Albert's list of Nov 3, 11:17, "yes yes": the top, the colours, the icons, the crosshair, the counter) [2026-11-03 11:24]
- The thin strip cut (MENU-SPEC §5): the top is one bar, the five counts (tap: Jobs), people (tap: the Army), the clock with the sky (tap: the Status page: age, rank, score, Stores, Mail, Sound), pause with the unread mail as its badge. `--hb` loses the half rank. Mute and the Mail button go (the Status page); `STATUS`, `STATUS_CUT`, `AGE_SHORT`, `muteB`, `mailB` cut. Badges: idle on Jobs (people and empty posts), research on Town, soldiers on War. Tests (gate, wild D10 and R1) and three plants. [2026-11-03 11:24]
- The colours: one brown; the war tiles glow ember (`--ember`), the villagers' and the map tile none; the open page a step lighter, a page under it darker; an attack coming breathes the War tile's glow (`raid`, in place of the red ring). Steel stays for the queue's line. Tests (cards) and two plants. [2026-11-03 11:24]
- The icon review: one picture, one meaning. New at 20: basket (Jobs), town (Town), crossed swords (War), three figures (Kinds), shield with a plus (Train), tent (the Barracks build group), bell (Alarm), flag (Rally), a house with an arrow in (Gather); Work is the tick, Garrison the tower (`def`). The sword stays the sword chip's and the shield Shelter's; the head is the villager card's alone. [2026-11-03 11:24]
- The crosshair: a thin cross with a gap and a dot, a dark edge under it, its colour what is under it; the time and place above. Cut: mock 24's turning chevrons, scan line, sonar ring and corner brackets. [2026-11-03 11:24]
- The speed counter (Help › Speed counter, off by default): frames a second with the low, the draw level, the step's ms, the units, the memory where the browser gives it, the clock. `perfTick` (41-boot), `#perf`. [2026-11-03 11:24]

## Build 80 preview 37 (Albert's list of Nov 3, 11:17: the lakes, the juice, the cost of orders, the forming traffic, the shapes and the two map tools) [2026-11-03 11:58]
- The lakes: no circles. Each lake's edge is a sum of three to five harmonics of angle (`lakeShape`, amp 0.3, up to the 12th), rejected and drawn again until its shoreline development D_L = P / (2√(πA)) falls in WATER.shore, 1.15 to 1.6 (SCIENCE). The walking grid, the flood ring and the drawn shore all read one radius, `lakeRAt`, so what is drawn is what is walked; a lake's inner half is kept, its clearing 110. `tests/map.py`. [2026-11-03 11:58]
- The juice (Albert's note): a charging blow shoves the one it lands on back JUICE.shove and jolts the screen if it is on it; a thud under a blow that lands; the striker recoils after a blow and a near-dead soldier sways. A plain blow shoves nothing (`tests/combat.py`). [2026-11-03 11:58]
- The cost of orders (Albert, 11:08: "you can't just move people around"): every order sent (Go, a squad, the Director) takes the soldiers' meals for ORDER.mins from the store, never more than it holds, and leaves them tired ORDER.tired s; a charge is not tired by it. `orderCost` (36-economy), on `direct` and `hudFire`. [2026-11-03 11:58]
- The forming traffic: when two of one side meet while forming up, the lower rank gives way (riders before shooters before foot, 9 to 1 in the push), the push between formers is half as hard, and a soldier past 70% of its drill's time and short of 70% of its way holds where it stands (`drillHold`, FORMING). A soldier within the last GRID.fan of its spot is deploying, not marching: the column no longer snaps back while a shape forms (08-core `marching`; the Front of six chased the column for ever before). Gate. [2026-11-03 11:58]
- The shapes: Front (one rank, riders break it), Choke (deep and narrow, only the front fights) and Support (foot on a ring, shooters inside) join Line, Wedge and Square on the dial. The two tools on the War page: hold the shape and drag across a gap, and the picked soldiers hold it as a Choke as wide as the gap (CHOKE 1 to 12 files, facing the foe or away from home); hold Rally and tap near forest, and they go to ground at the nearest cover (`coverNear`, AMBUSH): hidden soldiers are no mark; a foe within AMBUSH.spring or a blow springs the whole ambush with a charge. Gate, and nine plants (--only=p37). [2026-11-03 11:58]
- Cut from the test: the four shooters of the support check now leave the map instead of dying there (four dead mates beside them broke the foot's nerve, and the ambush check read the rout). [2026-11-03 11:58]

- **Play fingerprint accepted:** preview 37: the lakes' shores are drawn anew (shoreline development), orders cost meals, a charge shoves: the map and the first minutes differ [2026-11-03 11:58]

## Build 80 preview 38 (Albert, Nov 3, 10:52 to 11:05, "build it today": war camps, step 1) [2026-11-03 12:23]
- Two wagons from the Stable (`outpostcart`, `campcart`; UNIT.camp): pick one, tap the ground, and where it stops it unpacks (`campUnpack`, 38-camps). The Outpost (Bronze): four tents and a timber tower in a strip broadside to home. The Camp (Classical, Camp wagons researched at the Stable): a palisade of CAMP.side squares with a two-square gate on the home side, a camp tower inside each corner, the medical tent and the training tent across the yard from each other (Hyginus §4: the hospital away from the workshops), the mess at the back, the depot inside the gate, a yard for 32 (§1: eight men a tent). One of each at a time, two from the age after (`campCap`). The trees under the camp burn. The wagon is a cart on the road: anyone at war kills it; it takes no room (cls null). [2026-11-03 12:23]
- The tents, 2 × 2 each, come off the wagon paid: Medical tent (heal 2 within 70; a soldier under half, or sick, walks home to the Hospital, `campSendHome`), Training tent (foot and villagers, a quarter over the price, a tenth with Field logistics, `tentCost`; one that cannot be paid for gives way to the Barracks), Mess tent (rest as at the Barracks), Supply depot (a drop-off for every resource), Camp tower (dmg 6, bow 90), Palisade (60 hp, stakes). [2026-11-03 12:23]
- Foot soldiers raise the pieces (`campRaise`): one idle by its side's camp, or arrived where it was sent, takes the nearest unraised piece with the fewest hands on it, at CAMP.build of a villager (Field logistics: full); a new order, a foe or a rout takes it off the work. Riders and engines do not build. [2026-11-03 12:23]
- Research at the Stable, line Camps: Camp wagons (Classical), Field logistics (Classical, after it). `tests/combat.py` (the layout, the limits, the unpacking and the burn, the pace and the research, the tent's price, the wounded sent home, the wagon killed) and seven plants (--only=p38). [2026-11-03 12:23]
- Step 2, the same preview (Albert, 10:55: supplies, the Warehouse, caravans, mud and weather, wear): the depot holds CAMP.supply food and the soldiers within CAMP.reach of it eat from it, off the town's bill (`campEat`, in upkeepTick); empty, they are unsupplied: tired every second and no mending at the mess, with one toast a minute. A Market caravan with nothing to carry runs CAMP.load food to a depot under half (`supplyRun`): the food from the store and a carter's fee of CAMP.fee gold a hundred of the road, paid at the Market; one caravan a depot. The Camp wagon needs the Stone granary researched (the game has no Warehouse building; the granary is its store: Albert to say if a Warehouse building is wanted instead). A wagon's wheels sink CAMP.wheelMud times as deep as a foot (groundSpd). Rain, snow, frost and blizzard take CAMP.wear of a piece's health a minute (`campWearTick`), and an idle foot soldier mends a piece under CAMP.mend as it raises one. A camp is a town for sickness: the outbreak and the SIR spread count anyone within reach of a depot (`depotNear`), and the medical tent cures as the Hospital does. The camp tower is a timber tower now (its own art); each tent its own cloth. `tests/combat.py`, six more plants. Not built: the computers' camps (the A/B test is next). [2026-11-03 13:02]
- The start page on one screen (Albert, 11:15, "try it ... park it if it messes things up"): World and Fog share a rank, Tension and Daily share a rank (`pairRow`, 29-card-pages), the daily level moves into the Start line; ten ranks, no scroll at 375 × 667. Nothing else moved. [2026-11-03 13:22]
- The A/B test of the computers (Albert, 11:10): `tests/ab.py`, a test tool like the balance harness. A plays as shipped with the handicap (HANDICAP: a free mill and farm); B without it and with pressure (AB, 17-ai): two more riders on the drop-off with the most villagers about it, the richest foe weighed by 30%, and a choke claim: six idle foot soldiers hold the narrowest gap on the road to the nearest foe (`gapOnRoad`, the drawn choke of preview 37) three minutes at a time. The seats are dealt A/B by the seed (SET.ab at newGame), who killed whom is kept in `G.kills`. The report is in `docs/6 Records/v80 Audit/AB test - Nov 3.md` once the 20 seeds have run. [2026-11-03 13:22]

## Build 80 preview 39 (Albert, Nov 3, 13:00 to 13:13) [2026-11-03 13:22]
- The Build page is the full building menu: every building of your age, eight a page, › turns the page (`bpage`), Research and Relations on the first page; the six build groups are cut (MENU_ICON and MENU_WORD stay for the Guide). A later age's buildings are no longer shown dim. [2026-11-03 13:22]
- The War tile wears one upright sword (`ICON.swordup`); the crossed swords are cut (they read as the X of Close). [2026-11-03 13:22]
- The title bar's ← shows only on a card with a parent (`G.card.from`); every other card has the name in slots 1 to 4 and Close alone. [2026-11-03 13:22]
- The Map tile in one spot on every page, under War: it took Close's place; a hold on it folds the row. On a full page the map shows over columns 3 to 5 for that page only (H.mapOn); at rest as before (H.map). Gate. [2026-11-03 13:22]

## Build 80 preview 40 (Albert, Nov 3, 13:15 and 13:18: the Store and the Scale line) [2026-11-03 13:28]
- The Store (BLD `store`, Bronze, the age before the Camp wagon; one, two from Medieval): a drop-off for everything; fx on its owner: food spoils half as fast (`spoil` 0.5), soldiers eat a tenth less (`eat` keyed `#soldier`; upkeep now reads fx 'eat' by each unit's keys, `eats(u)`), prices swing half as far (`band` 0.5: `mkt(k, o)` scales the swing round 1; the Market card, sell and buy prices and caravan prices read it). A Camp wagon needs a Store standing (CAMP.need, in place of the Stone granary of preview 38). Its own art: a granary on staddle stones. [2026-11-03 13:28]
- The Scale line at the Store: Learning by doing (Classical; fx `scale`): every farm, tree farm, quarry, mint or foundry past the first adds SCALE.per to all of its kind, to SCALE.cap past the first (gatherMul); Division of labour (Gunpowder): the mint 20% more, every workshop 10% more. The machines Albert named (mills, saws, furnaces) were already each building's own line (Windmill, Sawmill, Stone saws, Blast furnace), so the Store's line is scale itself. `tests/combat.py`. [2026-11-03 13:28]

## Build 80 preview 41 (Albert, Nov 3, 13:13: field defences, "yes"; the report docs/4 Now/Field defences.md) [2026-11-03 13:34]
- Caltrops (BLD `caltrops`, trap; Smithy research Caltrops, Classical, 331 BC): sown from the Build menu as a strip, hidden until sprung; a horse that crosses loses CALTROPS.horse of its health and is stuck CALTROPS.stuck s, a foot soldier CALTROPS.foot; a square takes CALTROPS.hits before it is trodden flat (`trapsTick`, 38-natives). A building may now stand behind a research step (BLD.tech, capWhy). [2026-11-03 13:34]
- Traps are laid as a line like a wall (`lineKind`, 08-core; the wall's corners, drag and undo in 26-input, 11-orders, 24-view-overlays, 32-frame): pits in a band are the lilia of Alesia; a trap keeps no lane from another (canPlace). [2026-11-03 13:34]
- The archers' stake (Range research Archer stakes, Medieval, 1415; STAKES): a foot shooter that has stood STAKES.plant s has its stake in the ground (u.staked, drawn at its feet); a horse that strikes it loses STAKES.dmg of its health, its charge ends and it is thrown back STAKES.shove (hurt, 16-sim-fight); the stake comes up when the shooter moves. No tap: the stake is the shooter's own work. [2026-11-03 13:34]
- The abatis (BLD `abatis`, a camp piece): a Camp's felled trees outside its palisade are laid as its outer work for nothing, a wall of sharpened branches on the forest side (`campUnpack`). Its own art. [2026-11-03 13:34]
- Parked (the report): chevaux de frise, the Wagenburg. `tests/combat.py`; plants (--only=p41). [2026-11-03 13:34]

## Build 80 preview 42 (Albert, Nov 3, 13:15: "a special building that gives the tech for the very special Civ stuff ... deep and rich") [2026-11-03 13:42]
- The Hall (BLD `hall`, Classical, one a side, in the Culture group): named by the people (CIVS.hall: Forum, Taixue, Satrapal Court, Ordu, Mantriparishad, Sankore; `bldName`), its own art by people (six fronts). It researches that people's three specialities (TECH with `civ`, at 'hall', eighteen steps; another people's are refused as before): Rome, Via militaris (foot +20% speed), Horrea (spoil ×0.5), Castra (soldiers raise camps ×1.5, camp works ×1.5 hp); Han, Bronze trigger (crossbows +20 range), Ever-normal granary (band ×0.5), Taixue (research ×0.9); Persia, Royal Road (caravans and wagons +20% speed), Satrapies (vassal tax ×1.2, fx `taxtake`), The Immortals (train ×0.75); Mongol (Medieval, their own age), Yam (mounted sight +20%), Remounts (charge comes round ×0.75), Tumen (horse archers +15 range); Maurya, The sixth (tax resentment ×0.67, fx `taxhate`), Hastin (elephants ×1.2 against buildings, fx `bld` now read on a blow at a building), Pataliputra (walls, gates, towers ×1.25 hp); Mali (Medieval), Bambuk gold (gold ×1.12), Salt road (trade ×1.25), Sankore (research ×0.9). Each has its history in the Guide (WHY) and its number in SCIENCE. The start bonus stays. [2026-11-03 13:42]
- Cut: MENU_WORD and MENU_ICON (the groups page went in preview 39). `tests/combat.py`; plants (--only=p42). [2026-11-03 13:42]

## Build 80 preview 43 (Albert, Nov 3, 13:56: "very, very cool visuals"; the eight, yes yes) [2026-11-03 14:12]
- Caltrops: dark irons with a glint of light on the first; the squares trodden flat lose them one by one. The archers' stake: three pale sharpened stakes leaning out the way the shooter faces, with a shadow line. The abatis: a darker trunk, pale points, the stump where the tree stood. The ambush: a soldier gone to ground is drawn under three leaves of the wood's greens, swaying (`leavesOver`). The wagons: their own look (`wagon`, 18-figures): two horses, a long bed, a tilt on hoops with the side's colour along its edge. The camp: a cooking fire lit at the mess tent after dark (HEARTH), the depot's own stock as a pile of sacks at its door (PILE, by b.supply); the Store: its food as a pile. The Hall: the banner on a pole before the front; lamps lit after dark (HEARTH). [2026-11-03 14:12]
- Not done from the list: the burst of birds on an ambush springing (no bird in the game yet; the horn sounds), the dust puff under a horse on a stake (the knock flash stands in). Parked. [2026-11-03 14:12]

## Build 80 preview 44 (the outside audit Albert pasted at 14:53, every claim checked against the code; "Do it", 15:01; argon's three amendments, 15:02) [2026-11-03 15:16]
- Three Hall steps had taken the ids of the Keep's Royal Road and Relay stations and the Stable's Stud farms, and TECHBY kept the Hall's: the Post line was dead for every people, Stud farms for all but the Mongols. The Hall steps are `persianroad`, `mongolyam`, `mongolremounts`; their Why entries are their own. [2026-11-03 15:16]
- The Mongol steps now do what they say: Remounts shorten the charge's wait (fx `chargecd` on CHARGE.cd in `charge`; before, the damage key, and a charge did 0.975×); the Yam multiplies sight (`sightClear` reads `m` as well as `a`); the Tumen names `harcher`, the unit that exists. [2026-11-03 15:16]
- `u.site` (the camp piece a soldier raises) is in SKIP_U: after a load it is found again, not a detached copy hammered forever. [2026-11-03 15:16]
- Fish and ripples sit on the drawn shore (`lakeRAt`), not the old circle. The B side's choke soldiers come home when the hold ends (17-ai). [2026-11-03 15:16]
- Camps: a cleared find no longer blocks (`done`, not `gone`); stone, ore and berries under the square block ("A resource lies there."); no abatis on the gate side; a camp is counted by its tents, not a last palisade tile; the wagon's spot is checked when it is sent (argon C), and again on arrival. [2026-11-03 15:16]
- The trap line's ghost shows its own cost and the line's own kind; "stakes" and "caltrops" are not pluralled again; "out of wood/iron" by the trap's own resource. [2026-11-03 15:16]
- Orders: an order by tap costs the meals the controller's Go costs (Albert, 11:08: "you can't just move people around"); the meals and the tiredness are taken before the ETA is set; the ledger words "marching orders" and "camp supply". [2026-11-03 15:16]
- The Store's line: Division of labour reaches the workshops, the mint once (×1.2, not ×1.32); Learning by doing keeps to the five kinds it names (SCALE.kinds) and shows in a plot's Bonus line. [2026-11-03 15:16]
- Argon A: a drilled soldier steps one rank (GRID.gap) toward a foe that is striking its line, and no farther (14-sim-troops); the closing of ranks was already there (12-sim-core re-slots the survivors every tick, rank 1 first). Argon B: a supply run leaves CAMP.keep (150 food, 50 gold) in the store. [2026-11-03 15:16]
- A squad tile marches only on a crosshair that is up ("Tap Aim, then the map, then the squad."); before, it took the last crosshair, unseen. The Han arsenal is Donghai's (the Yinwan slips), not Luoyang. [2026-11-03 15:16]
- Tests: `tests/tables.py` (one step to an id; every key an effect names is real), `tests/saves.py` (no detached copy after a load), `tests/combat.py` (the p44 block); plants (--only=p44, 15). [2026-11-03 15:16]

## Build 80 preview 47 · Restore and Fix (Albert, Nov 3, 19:49 to 19:56: "33 is good; 34 kill; 35-36 kill; 37-41 keep; 42-44 keep; 45-46 kill") [2026-11-03 20:30]
- The base is preview 33 (`1cf47ab`), its screens untouched: the Jobs page, the battle station of preview 27, the Build card, the thin strip. [2026-11-03 20:30]
- Previews 37 to 44 ported onto it, every system of theirs whole: the shores, the juice, the cost of orders, forming traffic, Front/Choke/Support, the choke and the ambush, the war camps, the start page on one screen, the A/B harness, the Store and the Scale line, the field defences, the Hall, the visual pass, the audit's ten fixes and argon's three. [2026-11-03 20:30]
- Cut, kept whole on the branch `p46-controller` (the head of main before this preview, `8b44259`): preview 34 (the seven-column controller: Jobs, Town, War, Close, the Map tile, Kinds, Train, Alarm as pages), preview 35 (the share as a tap cycle: all, half, a quarter; `sharePick`, `SHARE`), preview 36 (the thin strip cut, the Status page, badges on the tiles, one brown with the ember glow, the icon review, the plain crosshair, the speed counter), preview 45 (preview 33's Build card back on the controller, Town as People and Build, the villager card's hammer, the paged Build list cut) and preview 46 (People and Town swapped, the Map tile at (6, 1), Hide, the floor cards, New game a question a line, the 3 × 3 villager and item cards, the joined 2 × 2 quick action and the foe's block). [2026-11-03 20:30]
- Cut with them, because they were the controller's doors and not systems: the Build page as the full building menu with › turning the page (preview 39), the Map tile on every page (39), Relations as a row cell (`relopen`), the War page's Aim · Go, Rally as a tap-to-place (`rallyat`; preview 33's hold on Train sets the rally at the crosshair as before). [2026-11-03 20:30]
- The Yard (`CARDS.yard`, 39-huddle; the button `#yardB` at the left end of War's rank, `YARD_ON` in 08-core): the controls of 37 to 44 with no slot on preview 33's screens, staged until each has a home: Choke (drag across a gap), Ambush (tap the cover), Idle soldiers (picked). Shown on every preview, test and frozen version; never on the live game (the page's path and protocol decide). Albert, 19:55: "dumping all the functions we need a home for in a menu for now ... stick it somewhere temporary". It is emptied, then deleted. [2026-11-03 20:30]
- The gate's War Director check is preview 33's (the station's Direct block), with preview 38's stricter facing test. [2026-11-03 20:30]

## Build 80 preview 48 (Albert, Nov 3, 20:18: "Can you check the text. It's so small"; 20:46: "14"; 21:06: "2", done properly; 21:16: "1", the arrow stays) [2026-11-03 21:30]
- The small text size is 14 (`--fs-s`, shell-head), was 12; the large stays 18 (D-044 amended). Why 12: the Oct 31 rule picked the size at which every row word fits a slot at 375 pt. Measured at 375 by the whole gate: the row words lose two (Shield wall is "Wall" on the row, `DIRECT_OF`; the Han step Ever-normal granary is "Granary" in a double-wide, `short`), and what really binds is the cards (a name over a sub line in a 44 rank; one wrapped sub line stretches its whole rank, `grid-auto-rows: minmax`) and the ticker (one line at 375). [2026-11-03 21:30]
- Nineteen history lines of the ticker shortened to 48 characters or fewer (07-text, HISTORY; the jokes kept, the words fewer: "Caesar stabbed 23 times. Politics continues."). [2026-11-03 21:30]
- Sub lines: Charge "6 s of fury, then tired"; Force tribute "8 soldiers at their town first"; How to play "guide, rules, settings"; Engage "fight what's met"; the Build menu's count moves beside the name ("Town 0/2" over "400w 300s 200f"); a four-resource cost (the Colosseum) is a double-wide cell (`s4`; `grid3` counts it as two), which wrapped at 12 too, unseen; the Research card's cost line loses the building's word (its › goes there, `techBtn`); the next age is double-wide on the Town Center card with All tech beside it, its four costs on one line (`keepAgeBtn('s4')`). [2026-11-03 21:30]
- Relations, the Misfits row: the arrow stays (Albert, 21:12: "I want to keep the arrow"); the space before it goes and the one-slot line's inset is 2 px, "Neutral→" over the wanted word, 54 px in 54. The rival rows keep "Neutral → Foe". [2026-11-03 21:30]
- `tests/gate.py` and `tests/palette.py` hold 14 and 18. [2026-11-03 21:30]

## Build 80 preview 49 (Albert, Nov 3, 22:34: "If I play a game can you analyze it?"; 22:35: "Ok go quick") [2026-11-03 22:45]
- The match log (`matchLog`, `matchLogText`, `copyLog`, 39-huddle; the verb `copylog`, 33-verbs; called once a second from the sim, 12-sim-core): a row a minute, every side as [age, villagers, idle, soldiers, food, wood, stone, gold, iron, gathered that minute], with the seconds your Town Center trained nothing and your villagers and soldiers lost that minute; the war, realm and home lines of the mail and the milestones. Kept in the save (`mlog`). Copy match log on the end screen and in the Yard puts it on the clipboard for Claude. Preview only (`YARD_ON`). About 130 bytes a minute. [2026-11-03 22:45]

## Build 80 preview 50 (Albert, Nov 4, 06:50 to 07:03: "I just want to see the front of a building, the side, and the top"; "why can't we take the whole map and rotate it? Like a picture?"; "Go for it ... Yes yes go") [2026-11-04 07:30]
- The view turned 45° (`TURN`, `TILT` 0.55, 01-rules-basics; `SX`, `SY`, `DX`, `DY`, `toWorld`, `dWorld`, `wmat`, `flat`, `wrect`, `viewBox`, 20-view-base): a world point goes to the screen by x − y across and x + y down; the sim's square grid is untouched, people walk as they did. Every drawing that put a point on the screen takes both coordinates now (94 sites); the ground's pictures, the fog and the grass are drawn in world units under the turned matrix; the depth sort is by x + y; the camera's drags and the pinch turn with it; the building hit box is the footprint's box on the turned screen. [2026-11-04 07:30]
- The map is a diamond on the screen: the Throne in the middle, the four homes at its points. Beyond its edges, the rim (`drawRim`, `RIM`, `CLIFF_H`, 21-view-frame): the sea to the horizon past the near edges (south and east) with a strand, a cliff face rising along the far edges (north and west) with its plateau, and the sky behind. The camera may reach RIM past an edge, never further. [2026-11-04 07:30]
- The small map turned with it (`MINI_K`, `miniMat`, `miniWorld`, 24-view-overlays): the diamond fills its square; a tap or a drag on it is turned back to the world. [2026-11-04 07:30]
- The wall mold (`WALL_LOOK`, `drawWallBox`, 23-view-things): a wall, a gate or a palisade is drawn in place as a box on the turned ground (its top, its two near faces, merlons on each open face, a gate's door, a palisade's spikes); a face shared with a wallish neighbour is not drawn, so a run reads as one wall. Buildings keep their old pictures, standing on the turned ground, until they are drawn at the corner (the box mold, next). [2026-11-04 07:30]
- The start camera sits 70 toward the middle on both axes (down the screen). `tests/map.py`, `tests/gate.py` and `tests/cards.py` call the projection with both coordinates. At TILT 0.5 two pairs of buildings read alike at half zoom (the gate); 0.55 keeps them apart. [2026-11-04 07:30]
- Decided with it (Albert, 07:20, "B"): preview 51 lays the land inside a diamond of a √2 larger array, so the map is a square on the screen with sawtooth edges and the homes in its corners, as his pictures of 07:14. The deep dive on the economy and the villagers (`docs/4 Now/Economy and villagers - v80 - Restore and Fix.md`) rides with this preview; its list waits. [2026-11-04 07:30]

## Build 80 preview 51 (Albert, Nov 4, 07:14 to 07:21: his two pictures, "That's what I wanted"; "B."; "We won't do anything else until that's done") [2026-11-04 08:50]
- The land inside the world: the map-maker lays the land as it always has, a square `SQUARE` (2160) a side with a home in each corner, in its own frame; then `turnLand` (10-world) turns every laid thing −45° about the centre into the world, an array `MAP` 3060 a side (`LMID`, `MID`, `worldXY`, `landXY`, `inLand`, `landAt`, 01-rules-basics). Through the turned view of preview 50 the land stands square on the screen again, the walking grid's squares on the diagonal, the homes in the four corners, and the land's edge is the sawtooth of the squares: Albert's pictures. [2026-11-04 08:50]
- What turns: every node, find and lake (a lake's shore harmonics turn with it: ph + k·45°), every building (snapped to the world's squares again), every unit and its places, the keeps. The walking grid, the fog and the view cover the world; a square whose middle is off the land is solid for good (`NAV.off`, `navOffLand`, 09-nav), and the clearance pass does not count the land's own edge as a wall. The fog never covers the sea and the cliffs (`fogOff`, 22-view-fog). `openWays` (nothing walled in) runs after the turn, on the world's grid. [2026-11-04 08:50]
- The keeps are named in the world (`KEEP_W`, 01): each 1,065 from the middle along one axis and 5 to the side along the other, the four a quarter turn apart, so that each sits on the centre of its five squares while the six-square Throne centres on the world's middle; `CORNER` is 753.1 (was 755), the map-maker's margins allow the 3.5 off the diagonal. Neighbours about 1,506 apart. [2026-11-04 08:50]
- The forest's strip along the land's edge is 40 wide (was 15) and the winding paths 34 (was 18): a corridor on the diagonal of a 10-unit grid must be two squares wide to be walked (the path cuts no corner), so the old widths left pockets. [2026-11-04 08:50]
- The rules that named the map's edges or middle lines name the land's now, in the world's frame: the scout's loop, the wayfarers, the events' edge spots and the far side, the storm's crossing and band, a strike's spot, the Throne's causeways (`onLand`), the trade routes (`ROUTES_L` for the map-maker, `ROUTES` for the game), the posts' edge rule. The camera's clamp is in the land's frame (its edges to the bars, RIM past them); the small map shows the land square; the rim draws the sea past the land's near edges and the cliff face and plateau along the far. [2026-11-04 08:50]
- The ground's picture paints only the land green, and the strand one square wide along the shore, square by square: the sawtooth. The Throne's island and causeways are painted in the land's frame (`landMat`, 20-view-base). [2026-11-04 08:50]
- Saves: shape 45. A shape-44 save (previews 47 to 50) is turned into the world by MIGRATE[44] (every place, the fog and the ruts square for square, the lakes' shores); the 2000-map step (39) lays its fog in the land's grid first. [2026-11-04 08:50]
- Tests: `tests/map.py` reads quarters and edges in the land's frame; `tests/gate.py`, `tests/moves.py`, `tests/combat.py`, `tests/text81.py` and `tests/cards.py` call the projection with both coordinates and pick their test spots on the land. The play fingerprint is accepted: the land is laid on new squares, so every game differs from the baseline by design. [2026-11-04 08:50]

- **Play fingerprint accepted:** preview 51: the land turned into the world; laid on new squares, every game differs by design [2026-11-04 08:56]

## Build 80 preview 52 (Albert, Nov 4, 09:27 to 10:15: "re layer the game ... start ground up with the elements ... lock those down as the layers"; the cards, "names, not numbers", exclusions, the slot test, the log; "Go. Yes yes") [2026-11-04 11:05]
- The map-maker in layers, a file each, read and locked alone (10-world-ground, -water, -forest, -plots, -movers, -citadel; `10-world` keeps the game, its players and `newGame`): ground lays the frame and the taken list; water the lakes, rivers and fish; forest the trees, paths and deposits; plots the home zones and finds (and runs the lay, `makeMap`); movers the first people, the game, the carried finds and the camps; the citadel the Throne. The plots' and movers' spots are rolled before the forest (their claims) and laid after it, so Albert's order holds with the one weakness answered (`docs/4 Now/Layers plan`, §4). [2026-11-04 11:05]
- One shore (`shoreWalk`, `shorePath`, `lakeRAt`, `lakeRTo`, `floodRise`, 10-world-water): the walking grid, the map-maker, the ground picture, the flood and the fish walk the same shore; the flood's rise is added in one place. The three traces (72, 72 and 48 points) and the three reaches go. [2026-11-04 11:05]
- One taken list (`taken`, `takenGap`, `ROOM`, 10-world-ground): everything laid in a corner is one list; `ROOM` names every margin (the old numbers, unchanged: a tree 35 past a lake, 40 past the great lake, a find 25, a deposit 45, and the rest). The four lists (taken, room, keepOut, held) go. [2026-11-04 11:05]
- **The fix (named, the fingerprint's only change):** a lake's edge is its true shore, not its radius, for trees, finds and deposits alike. Before: 20 trees stood in water over 20 seeds, and a bush find in a bay on seed 55 of 100. After: none (`tests/map.py`, the one shore, 100 seeds and seed 55). On 20 seeds every find, building, unit and lake lays as in 51 but where a lake's bay reached it; trees and path deposits near water move. The wild finds of a corner with a lake near them roll again (one changed answer moves the rolls after it); the home zones never (CLEAR keeps water 312 or more from a keep). [2026-11-04 11:05]
- Rivers carry their stretches: each pool has `run` (0 above the first ford, 1 between, 2 below) and `src` (its lake's place in `G.lakes`), set by `makeRiver`; the ground picture reads `riverRuns` and `G.lakes[L.src]` instead of guessing the fords and the lake back from the gaps. Saves: shape 46; MIGRATE[45] derives both for an older save by the old guess, once. [2026-11-04 11:05]
- One tree (`TREE`, `nodeScale`, 10-world-forest): the 3 × 3 it blocks, its crown (15, 11), its floor (17, 12), its 1.4 width, the deep-forest count (6), in one table; the grid, the floor, the forest picture, the shadows and the sprites read it. `deepTrees` lives with the forest. The size-by-what-is-left formula, twice, is `nodeScale` once. [2026-11-04 11:05]
- One placer (`cluster`), one corner's quarter (`QUARTER`, `inQuarterL`); the island and causeways one shape for the grid and the picture (`THRONE.isle`, `cause`, `causeTo`; the picture's causeway was 30 shorter than the grid's). [2026-11-04 11:05]
- The cards (`ELEMENTS`, `LAYERS`, `src/00-elements.js`; the key in `docs/0 Index/00 Books.md`): one card an element, every slot a list of names, every name a pointer to one thing. The first card: `gather`. `build.py` refuses a card with a slot missing, a name with no home or two (continued names like `LMID` now count), or a layer not in `LAYERS`; `tests/elements.py` (the gate) checks impacts, math (`SCIENCE.md`), orders (`ACT`, `PLAY`), buildings and the exemptions against the running game. [2026-11-04 11:05]
- The Index (`INDEX.md`, `tests/index.py`, written at every publish as `GUIDE.md` is): the five Books (Albert's Truth, Look, Words, Minds, Binder; the file table is `BOOKS`), every top-level name with its line and note (1,525), every card. `tests/index.py --diff` is the cards' log for this section. The two-homes list, closed and open, is in `00 Books.md` §3. [2026-11-04 11:05]
- The planted-bug set tidied: 22 plants of previews 47 to 51 pointed at text that had moved or changed (the fish, the shrine, the camera clamp, the text sizes, Learning by doing, the camp wagons, zone 1 and the rest); each points at the live line now. Two go with the doors cut in 47 (the hold ring, the hold on the ground). Six new for this preview (`--only=p52`), all caught. [2026-11-04 11:05]
- `tests/wild.py` opens every game under a clear sky (`fresh`): seed 3 now opens in a blizzard (the dice fall differently after the map), and the hunt A3b timed a builder's walk through it. [2026-11-04 11:40]
- Not built, for Albert: the flood judged twice in `37-events` 174; the trade lane straight and the road bent; the villager's states named (see `00 Books.md` §3). [2026-11-04 11:05]
- Decided alone (Nov 4, Albert at work): the finds' shore fix above (a bug in the generator's own rule, seen on seed 55); the Index at the root, not in `docs/`, so its lines need no stamps and it can be regenerated; the villager card names the functions round `vilTick`, not states that do not exist yet. [2026-11-04 11:05]

- **Play fingerprint accepted:** preview 52: a lake's edge is its true shore for trees, finds and deposits (20 trees and a bush find stood in water); trees and deposits near water re-laid, nothing else [2026-11-04 11:01]

## Build 80 preview 53 (Albert, Nov 4, 06:51: "I just want to see the front of a building, the side, and the top. Do it in the cheapest way possible"; his notes of 11:20: the grid lines "out of alignment because of the rotation") [2026-11-04 12:20]
- The building mold (`BOX_LOOK`, `boxed`, `drawBldBox`, 23-view-things): every standing building is the wall's box grown to its footprint and height: the south face lit, the east in shade, a door and windows on them past half zoom, a roof on top (a gable along the run for most, a flat top with merlons for the keep, town, castle, tower, throne and camp tower, a canvas peak for the tents) and the owner's pennant at the roof's east end. One shape for every kind; the table says only the walls' and roof's stuff: stone and slate, plaster and tile, plank and thatch, mud and canvas. The research badge, the piles, the mill's sails, the field dots and the smoke stay. [2026-11-04 12:20]
- Behind a toggle: the old pictures (`ART`, 19-building-art) draw with the Yard's "Buildings" (`SET.boxes`, the verb `boxes`) off; fields, pastures, orchards and traps keep their pictures either way (they lie flat). Nothing of the old art was cut: Albert says which stays once he has seen both. [2026-11-04 12:20]
- The alignment lines in the screen's frame (`snapGhost`, 09-nav; `drawGuides`, 24-view-overlays): since the turn the lines ran along the world's axes, diagonal on the screen (Albert's note). A ghost now also lines up with a building's centre on the same land x (upright on the screen) or land y (level), with the light pull, when the world's squares let the snapped centre land on the line; the lines along the world's axes (edges flush, the lane between) stay, since the footprints sit on those squares. [2026-11-04 12:20]
- Tests: `tests/map.py`, the mold (boxes for what stands, pictures with the toggle off, a frame drawn, the ghost's snap onto a screen line); three plants (`--only=p53`), all caught. [2026-11-04 12:20]
- Parked, Albert's handwritten notes of 11:20, in his words: `docs/4 Now/Parked.md`; the lock-the-definition proposal: `docs/0 Index/00 Books.md` §4. [2026-11-04 12:20]

## Build 80 preview 54 (Albert, Nov 4, 12:27 to 12:47, testing 53: the shadow, "not all buildings changed", "45 degrees is too much", "ghost needs to rotate too", the lines; "if the land rotated, the buildings and pastures and EVERYTHING needs to rotate with it ... all you would have to do is change the index: angle = 45 to 30"; "30 still too much. Go to 15 or 10, your call") [2026-11-04 13:10]
- **One angle** (`VIEW.angle`, 01-rules-basics; `TA`, `TC`, `TS` its radians, cosine and sine; `TURN` is now the diagonal's width per unit): the view turns the world by it (`SX`, `SY`, `DX`, `DY`, `toWorld`, `dWorld`, `wmat`, 20-view-base), the land is laid turned by minus it (`worldXY`, `landXY`, `landMat`; the lakes' harmonics by k·angle, `turnLand`), the small map by it (`miniMat`), the ghost's box, the keeps derived from the land's corners (`KEEP_W`: the first corner snapped to its five-square centre, the rest a quarter turn apart; `KEEP_OFF`, how far they stand off the land's diagonal, read by the map-maker's margins). Before, `TURN` was one number that only meant 45° (cos = sin) and the keeps were a hand-written table. Set to 15 (Albert's call between 15 and 10: at 10 a house's side face is under 9 wide). [2026-11-04 13:10]
- **Saves carry their angle** (`angle` in the save; `reTurn`, 34-save): a save laid at another angle is turned about the world's middle to this one on load: every place, the buildings snapped again, the shores' harmonics, the fog and the ruts square for square. The fixture `tests/fixtures/save-v46-angle45.json` (a preview 53 save) opens at any angle: keeps on their squares, nothing off the land, every fish in its water. [2026-11-04 13:10]
- **Everything turns with the ground:** fields, orchards and pastures are drawn flat on the turned ground (`FLAT`, `drawPlot`, 23-view-things: the soil, the rows by the season, the young trees, the grass and the sheep, a worn edge; a plot being dug shows its soil growing); a site is its box rising with the work (the stakes round it, as before); the shops (workshop, mint, foundry, quarry) are boxes too (they were left out by the crop flag). The toggle still puts every old picture back. [2026-11-04 13:10]
- **The shadow is the box's** (`corners`, `hexOf`, `boxShadow`): cast from the turned footprint, not an upright square (the faint box Albert saw under the Town Center); the silhouette rule is general (an edge faces the sweep or not; a corner is kept, moved or both), keyed on the light's direction, since a turned footprint's silhouette depends on more than the quadrant. `tests/moves.py` holds the sweep against a hull. [2026-11-04 13:10]
- **The ghost turns:** a boxed kind's ghost is the box itself, washed green where it fits and red where not (`drawGhost`); the pictures' ghost stays for the rest. [2026-11-04 13:10]
- **The lines on the screen only** (`drawGuides`, `snapGhost`, `GUIDE_ON`): a ghost lines up with a building's centre on the screen's upright or level line, with the pull, when a square comes within 3 of the line (exact at 45°; at other angles the nearest square); the lines along the world's axes are gone (they read as diagonals); the flush-beside snap stays without a line. [2026-11-04 13:10]
- The computers' wall ring takes the squares on or past `WALL_R` (`wallPlan`, 17-ai): on the arc itself a square's middle fell up to 7 inside it, and at 30° a home find's rock stood within two squares of one on 6 of 400 corners (`tests/map.py`); at 15° none did, so this has no plant. [2026-11-04 13:10]
- Tests: `tests/map.py` the mold (reordered: the snap with the house alone, the boxes' ghost, the plot), the angle fixture; `tests/moves.py` the hull from `DX`, `DY`; four plants (`--only=p54`), all caught. The play fingerprint moves with the angle (every map lays on new squares) and is accepted by name. [2026-11-04 13:10]
- The keep's door (`doorOf`, 08-core; `PLACES.start` is now 15 past the footprint's edge, the same point at 45°): the first villagers stood PLACES.start (40) from the Town Center's centre toward the middle, which at 45° cleared its footprint along an axis; at another angle that way crosses the footprint's corner and the villagers stood on its squares, shut in (the hunt A3 on seed 3). `openWays` reads the door too. [2026-11-04 13:30]
- Still to do from Albert's list of 12:27: nothing; from 12:33 ("a document that laid it all out"): the state-of-the-modules page, tonight. [2026-11-04 13:10]

- **Play fingerprint accepted:** preview 54: the view angle 15 (one home, VIEW.angle); every map lays on new squares; the computers' wall ring on or past WALL_R [2026-11-04 13:12]

- **Play fingerprint accepted:** preview 54: the view angle 15 (one home, VIEW.angle); every map lays on new squares; the first villagers stand at the keep's door, past its footprint; the computers' wall ring on or past WALL_R [2026-11-04 13:30]
