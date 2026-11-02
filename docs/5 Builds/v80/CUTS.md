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
