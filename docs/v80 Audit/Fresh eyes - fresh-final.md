# Fresh final review, main 9aaa320 (tonight: 38001b9..9aaa320)

Review only: nothing was edited or committed. Throwaway scripts are in the scratchpad (chain.py, first.py, plants.py, fit.py, scout*.py).

## Blockers
None found.

## Should fix (ranked)

1. **src/34-save.js:155-158 (MIGRATE[39]): the computers' wall plan is not moved with the map.** `p.ai = { ...p.ai, cool: {} }` keeps `p.ai.wallPlan`, a list of walking-grid squares `{gx, gy}`, and `walk()` shifts only x/y pairs. The preview-9 fixture has this plan for Rivals and Fortress (61 squares each). After migration their Town Centers move +80 but the plan stays on the old squares, so `17-ai.js:151-156` builds their walls and gates 8 squares (80 units) off centre. It does not crash, and tests/map.py MIGRATE does not check it. Fix: shift each square by `D / NAVC`, or `delete p.ai.wallPlan` so it is planned again from the new keep.
2. **CUTS.md:1247-1255 (combat): review-fix cuts not logged.** Combat Notes' own "Draft for CUTS.md" lists three cuts that are missing from CUTS.md: (a) the formation's `freeNear` for a blocked place, replaced by `spotFree`/`takeSpots`; (b) `ARRIVE` 9, `SEARCH.gap` and the push's hand-typed 8 (pushApart and the collide grid), replaced by `SPACE` and `ARRIVE = SPACE/4`; (c) `wildFoe`'s owner exception list `!native && !citadel`, replaced by the kind test. CUTS.md:1231 (Mail merge fix) also leaves out "its own rank cut" (the preview switch's old rank). Both break the every-cut-logged rule.
3. **docs/Build List - v80 - Post Clean - Working.md:34-35, the Owed section.**
   - It still lists work that is now built: Batch 4's "the map (home zones, +8%)" and B4 (`openWays`; the map CUTS entry also names the cause of B3); "D1" under computers (map80); "research and text" (N9 to N12, N14); "cards, fog and view group E" (E1 to E11, N13). handoff.py prints this list as owed.
   - It is missing things the notes put off:
     - The 20-seed run for blocked villager-seconds (6.5 before, 37 now; Combat Notes, CUTS:1260).
     - GUIDE.md still lists Printing, the old Charcoal age and Weather glass (Research Notes:67).
     - F2 to F9 and D16, not done (Research Notes).
     - The Aqueduct room line and the plague line, held (Research Notes:37).
     - No message for a conversion refused at the ceiling; priests and medics still on random offsets (Combat Notes, Not done).
     - The first villagers start on the Town Center's own squares (Map Notes, decision 5).
   - Outside Owed, lines now built are still open: line 43 (Needs call #3, how a picked stance looks; built per Cards decision 3), line 49 (#7 map labels at 11 px; now through `mapFont`), line 65 (#21 gates two squares wide; decided in the map build), lines 81-84 (#30 to #33, cold review: steel panel, Emergency, friend/neutral/foe, "+2 Guilds"; all built by cards80).
4. **src/11-orders.js:346: the toast "<side>: hostile in 30 s" uses the cut word.** The Relations card says "foe in 30 s" (`REL_WORD.war`), and the cards CUTS entry (CUTS.md "The words 'Hostile' (the card and the two toasts)") says the word is gone. Build it from `REL_WORD.war.toLowerCase()`, as 29-card-pages.js:168 does. Related: 07-text.js:960 "every other side turns hostile" (Rules text).
5. **src/39-huddle.js:103-104, aimColor: `o === WILD` is red whatever your stance with the Natives.** C1 says the Natives (warriors, walls, towers) follow relations, and `hostile()` in the same file now uses `isFoe`. But the crosshair on a Native warrior or the citadel shows red at Neutral or Friend. Use `isFoe(0, h.e)` for WILD (wildFoe handles animals and outlaws).

## Notes

6. **src/22-view-fog.js:71-74, 133.** `friendly(0, WILD)` is true when you are Friend with the Natives. Then every WILD unit (animals, outlaws, the horde) lights your fog and is `seen0`, while C1 keeps the outlaws and animals as foes. This was there before tonight, but C1 makes the split visible. Same pattern in 23-view-things.js:8 (`own`).
7. **Relations against C1: the stances are sound.** No row exists for a side that is always a foe. The rows are the Natives plus living rivals; animals and outlaws have no row, and the Natives row governs only their warriors, walls, towers, pits and nets (wildFoe by kind). natRaid still targets only sides at war with the Natives. The words come from `REL_WORD` (Friend, Neutral, Foe) on the card, `whoIs`, `foeFirst` and `30-cards.js:32`; the only exceptions are items 4 and 5. One possible confusion: at Friend with the Natives, the camps' robbers (which the Natives "command", 05-rules-wild.js:73) still attack you. Nothing on the Relations card says so.
8. **The notes disagree with the final save shapes.** Research Notes:61 says "Save shape 40" (it is now step 40 → 41), Combat Notes:147 says "save shape 41" (now 41 → 42), and CUTS.md:1210 and 1239 say the same. The merge lines (CUTS:1229 and 1260) correct them, but the notes files do not.
9. **Combat Notes:171 says "plus 11 from the review"; the plant list grew by 10** (119 → 129). The other counts check out: 35 + cards 31 = 66, + map 20 = 86, + research 17 = 103, + Mail 2 = 105, + combat 14 = 119, + 10 = 129.
10. **The full migration chain is not in the suite.** tests/map.py runs `MIGRATE[39]` on the fixture and then loads shape 40 directly. saves.py runs 40 and 41 on a fresh save. Nothing runs v39 → 42 through `readSave`. I did, at the preview path (`firstkeep.preview.save`), at all four sizes, by booting with the fixture waiting and tapping Resume:
    - The Resume card shows.
    - Shape 42 loads with no page errors, no NaN in any purse and 0 units off the map after 120 s.
    - It re-saves as 42 and reads back.
    Worth keeping as a test.
11. **tests/handoff.py, the two Sickles plants.** Their old text `fx: [{ s: 'gather', k: 'farm', m: 1.1 }],` occurs twice in 04-rules-tech.js (Sickles, then Threshing sledge). `replace(…, 1)` hits Sickles, the intended one, but a reorder would silently plant on the wrong step.
12. **What a v39 save looks like after the move.** The outer 80-unit ring is empty, and rivers that ran to the old edge now stop 80 short of it. Cosmetic only.
13. **src/17-ai.js:399: the computers' find reach is still typed** (`1000 : 800`). It was not scaled with MAP, although map80 moved every other place to `MAP`/`MID`/`CORNER`/`PLACES`.
14. **src/12-sim-core.js:605/615: the `FORAGE.room` key `carcass` never matches a carcass node,** whose kind is `meat`. It falls to the default of 2, the same value, so there is no effect today. It touches item 6's crowded rate; no conflict with N9's `meat` key.
15. **First minute: your scout dies to a camp's robbers at 33 to 42 s on seeds 1, 3 and 7** (seed 2 survives at 23 hp). This is the same on 38001b9, so it is not a regression, but it is in the first minute of the preview.
16. **The records of the checks are stale.** docs/Checks:25 lists the sub-checks as science, history, tables and palette only; saves, moves, map, cards, verbs and combat are now in the gate. HANDOFF.md:5 says handoff takes "about 6 minutes", but with 129 plants, 20 of them map runs, it takes far longer.

## Checked and fine
- **Save chain:** steps 39 → 40 → 41 → 42 each hold on the output of the one before. Step 40's `refund` works on a plain save object (`spent1`, `ledger` present in v39). `clim.next` = false becomes `ahead` [false], which the new roll reads correctly. Step 41 reads techs after step 40's rename. `migrateChain` is complete.
- **Starting villagers (10-world.js:566-570):** `START_VILS` (3) is centred on the map's `PLACES.start`. The handoff plant matches once; the Open text reads `START_VILS`.
- **gate.py:** runs all ten quick tests, combat, map, cards and verbs included. The inline `verbs()` is cut as logged, and the E8 cards and the type-size checks survived the merges.
- **handoff.py plant lists:** every branch tip's plants (cards ed1d3d3 and 02c8578, map 9cba40d, research aaea1f5, combat f3d741b) is in main; there are no duplicates. Every old text is present, all but the two Sickles once (item 11).
- **Combat's spots on the bigger map:** `spotFree` uses MAP and SPACE; `coord` uses `COORDN = ceil(MAP/COORD)` (A1 to V22; V is 60 wide).
- **Item 6 against N9:** the hunt uses `{kind: 'meat'}`, which matches the `meat` gather key; fields are keyed by `n.farm.kind`.
- **Research text against the new type sizes:** Research, Town and Relations show no clipped text and no tall buttons at 375 and 390 (the gate measures all cards at four sizes).
- **First minute:** a fresh boot shows Setup at four sizes (it scrolls at 375, as EXCEPTIONS #3 allows). Start then 60 s of play gives no errors.
- **Build and tests:** build, wrap and lint are clean. The quick tests pass: tables, science, history, saves, map, moves, cards, verbs, palette, combat and words.
