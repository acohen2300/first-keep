# Cold review: branch map80 (38001b9..2de31bb, 6 commits)

Report only. Nothing in the worktree was edited. Ran: build.py and lint.py (both clean), plus small Playwright probes in the scratchpad (rev80/). I did not run the gate, balance or soak. I also did a real migration test: built 38001b9 from `git archive`, played seed 3 for 9 minutes, gave the Raiders a wave, saved, and loaded that save into map80.

## Verdict on the agreed list

| Agreed | State |
|---|---|
| Coordinates derived from MAP/MID/CORNER, fingerprint unchanged | Built (e39c096). ROUTES, camps, lodes and scout points all reproduce the old values at 2000. Two hand-typed map grids remain: the `coord()` labels (item 4) and the old 200..2000 scan in moves.py. |
| D1, a wave judged by progress | Built, and it works. I found no infinite wait. Two gaps: item 6. |
| MAP 2160, CORNER ~751 | MAP 2160 built. CORNER is 755, which is what 751 snaps to. That leaves 325 behind the Town Center, not 329, so the buffer behind the zone is about 9, not 13. |
| Home zone 200 / 200-260 / 1.18 | Built for find centres only. The individual nodes are not inside it (item 1). |
| 2 squares between buildings, slit rule kept | Built. The player-facing text was not updated (item 3). |
| B4 | Built on the walking grid. Small asymmetry noted in item 9. |
| Shrine, towers and ring symmetric | Only the ring was built. The stop on the towers is not real; the stop on the shrine is (item 2). |
| 100-seed test, camera check | Both built. Gaps are in item 7. |
| RULES fairness rewrite | Done. It claims "nothing within 200", which the build does not hold (item 1). |

## Ranked findings

### Should fix (no blockers to merge, but these are the ones that matter)

1. **The home zone holds find centres, not finds.** Locations: `src/10-world.js:244-248` (LAYOUT), `tests/map.py` ZONE (`b0 - 6 / b1 + 6` on centres) and `RULES.md:51`.
   - The band is applied to each find's centre. The nodes spread around that centre by up to the find's room (bush 38, grove 56).
   - Measured on 30 seeds: home nodes stand **162 to 297** from their Town Center. RULES now says "the same clearing (nothing within 200)", and that is false: home berries stand at 162.
   - The spread in walk distance is about 135, not the 60 the gather-rate math in decision 5a was based on.
   - The test cannot see this, because it averages each kind before measuring.
   - The fix is either to state "centres in the band" in RULES and the decision, or to place by node. Placing by node does not work as decided: a 56-room grove cannot fit inside a 60 band. That makes it Albert's call.

2. **Towers and shrine.** Locations: `src/10-world.js:648-652` and `src/10-world.js:653`.
   - **The tower stop is not real.** "Two towers cannot be equal" is true, but nothing forces two. The four corners are symmetric about the middle, so four towers at the ring's four open corners are equal for every Town Center: (MID±70, MID±70), the existing tower spot mirrored.
   - Today's layout, measured: You and the Rivals are 1072/1072 from the two towers, the Raiders 969/1167, the Fortress 1167/969. That is the unequal layout QC 05 N2 named.
   - "None" is the other equal layout. Either one meets "placed symmetrically"; four changes the citadel's strength, which is the only real reason to ask.
   - Separately, each tower (fp 2, cells 100-101 and 114-115) sits on top of 2 wall squares of the ring, which also run 100 and 115. This predates the branch, but the ring was rebuilt here and the overlap kept.
   - **The shrine stop is real.** The only point the same distance from all four Town Centers is the middle, and the Throne (fp 6) covers it. Measured distances from the shrine today: 998 (You), 1066, 1137 (Rivals), 1074.
   - Equal options: make the shrine part of the Throne (the text already contradicts itself between "inside" and "at the foot"), or keep it and state the bend. One shrine can never be equidistant otherwise.

3. **Player text still promises flush placement.** Locations: `src/07-text.js:801` and `GUIDE.md:372`.
   - Both say the ghost "snaps flush beside your other buildings, side by side; buildings that train keep a walking lane". Now every non-crop building needs two squares.
   - `src/09-nav.js:3` still says "leave one free around them".
   - `src/06-rules-tuning.js:332` says the home finds sit "in the pocket behind the Town Center", but the pocket was cut.
   - `src/10-world.js:630` says "a tower at each corner" (QC P16, still open).

4. **Hand-typed map grid in `coord()`.** Location: `src/09-nav.js:61-62`.
   - It uses `x / 100` clamped to 0..19, which assumes the 2000 map.
   - At 2160, the last 160 units all read as column T and row 20. These labels appear in player messages ("Under attack at …", the march label).
   - Fix: derive the column count from MAP.

5. **Runway gold is often not laid.** Location: `src/10-world.js:375-381`.
   - The new "no room → not laid" rule drops the runway gold deposit in **59 of 160 corners (37%)** over 40 seeds. Stone was always laid.
   - So in about a third of games, corners differ by a whole gold deposit. The rule allows this ("outside the zone is random"), but the notes report "carried-off finds with no room: 0" and never give this rate.
   - The cause is that every wild find now sits in the 300-400 ring, right where the path's gold at f 0.45 lands.
   - Either widen the slide along the path, or report the rate to Albert as part of decision 5 in the notes.

6. **D1 cool-down and the win threats.** Locations: `src/17-ai.js:497` (and :499), `src/17-ai.js:400-401`.
   - A stalled wave puts its target on 180 s cool-down. The cool-down check runs before the wonder and Throne-holder priority (`pr ≥ 0.75`), so a computer can sit out 3 of a wonder's 8 minutes. Exempt the side holding a wonder or the Throne.
   - In `throneRun`, `w.to` is the holder at launch. If the Throne changes hands mid-wave, the cool-down lands on the wrong side.
   - What checks out:
     - The progress measure: the mean distance must set a new best by 30, so marching back and forth does not count.
     - No infinite wait: a wave that never fights and never nears is recalled within 45 s.
     - A dead target (`keepOf` null) means no progress, so the wave is recalled.
     - An old v39 wave migrates and progresses (real save: d 1e9 → 394, pt updated).

7. **Tests that cannot fail, or prove less than they claim.**
   - `tests/map.py` CAMERA has no planted bug, so it has never been shown failing. The notes say "each shown failing first", which is not true for this test.
   - `tests/map.py` MIGRATE is circular. It makes the "old" save by subtracting D from a new save, then checks that the migration adds D back.
     - It deletes `tread`, so the ruts are never tested.
     - It checks only units' x/y, buildings, nodes and keep.
     - My real test (an old build's save) passed: it loaded, ran 90 s with no errors, put 0 units off the map, moved the fog, and the wave progressed. So the code is fine, but the test should use a fixture from the old build.
   - `tests/map.py` GAP, the crop line: it passes if the farm is refused for any other reason (only that exact message counts as a failure).
   - `tests/map.py` ZONE:
     - It fails on nothing that went missing outside the zone. `W.dropped` only reports, and only counts carried-off finds; laySpots now silently drops any wild find with no room in 300 tries, and deposits are not counted at all (see item 5).
     - Nothing guarantees a home find is laid on a seed outside the 100. `laySpots` (10-world:402-430) drops it silently. That is unlikely given the annulus, but it is unguarded.
   - `tests/handoff.py:62-70`: the 8 new plants plus the control run execute `map.py` 9 times, each with 100 seeds and four camera sizes, on every start QC. This is a real cost increase for each session.
   - `tests/moves.py:162` still scans `200..2000`. `tests/map.py:94` and `tests/science.py:44` type 40 for the fog square (`F.FOG`/`F.FOGN` are not exported). `src/01-rules-basics.js:46` uses `Math.ceil(MAP / 40)` instead of `FOG`; that predates the branch.

### Notes

8. **Migration leftovers** (`src/34-save.js:122-161`):
   - Wild animals store an absolute graze point in `u.gx/u.gy` (`14-sim-troops.js:458`). It is not moved, so they walk 80 off for one 3-8 s graze. Soldiers use the same names for relative offsets, so the field is correctly left out of PAIRS; the fix is to rename the animals' field.
   - A migrated game keeps its Town Centers 385 from the edge, but the scout loop (`13-sim-civil.js:547`) is built from CORNER (325), so the scouts' corner points are 155 off.
   - Old event edge points sit 80 inside the new edge.
   - The 80-wide empty strip round an old map is expected.

9. **openWays** (`src/10-world.js:588-621`):
   - The cost is fine: at most 12 grid rebuilds, newGame measured at about 73 ms a seed.
   - Shared places on the middle lines are assigned to a corner by `<MID`. Camps come out 1/0/1/2 and stops 2/0/2/4 (You/Raiders/Rivals/Fortress), and the shrine goes to You. Only those corners' forests are cut toward them. Small, but asymmetric.
   - It cuts trees along the line even when water is the real blocker.
   - Wild groves are not checked.
   - The 40 in `towardMid(w.k, 40)` repeats the villager spawn offset (`makeMap`) and the test: one number with three homes.

10. **Spacing edge cases** (`src/09-nav.js:681-706`):
    - A wall may stand one square from a house, which leaves a slit the slit rule shuts. This is allowed as decided ("walls may touch"); flagging only.
    - The comment says walls may not touch trainers, but the code lets walls and gates touch trainers either way; only crops are barred. The behaviour is unchanged from before.
    - Snapping is exact for odd and even footprints. I checked the snapPos arithmetic.
    - I did not measure the computers' findSpot failure rate. The notes' balance shows Bronze +0.4 min and blocked villager-seconds down.

11. **makeForest `out`** (`src/10-world.js:323-325`): `reduce` with no initial value throws if a stop's local coordinate is not exactly CORNER. That holds only because 755 snaps exactly; at 751 it would crash newGame.

12. **CORNER 755**: this is the right snap (751 → 755, and 745 is the other exact value). It is still a change to the agreed figure, and it is waiting for Albert.

13. **Gates two wide**: confirmed forced. MID/NAVC = 108 is a whole number, so no single middle square exists. Every Town Center's gate distances are identical (1012/1012/1020/1020/1119/1119/1125/1125).

14. **Process**:
    - The cuts are drafted in the notes but not logged in `CUTS.md`. They must be before merge (Albert's standing rule).
    - The notes say "five commits"; there are six.
    - Authors and trailers are correct.

15. **Older, flagged by the builder and confirmed**: the first villagers spawn on the Town Center's own squares. In my probe, 60 of 360 villagers over 30 seeds started within 25 of the Town Center's centre.
