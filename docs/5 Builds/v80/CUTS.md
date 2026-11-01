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

- **Play fingerprint accepted:** text81 (Nov 1 batch): C11 stashes the load unrounded, so a partial load of 0.5 no longer becomes 1 at the drop-off; it is the whole of the change (each other change reverted alone leaves the fingerprint as it was; C11 reverted alone restores the baseline exactly). [2026-11-01 15:20]
