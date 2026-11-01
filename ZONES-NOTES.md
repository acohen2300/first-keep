# Zones Notes, v81: the three home zones, the ghost, the find gap

Branch `zones81`, from main 66a68a5, with main c4d73e7 (the docs system) merged in. Not pushed.

Three changes, one commit each:
1. **The three home zones** (Albert's answer 2, Nov 1 07:07; batch "yes yes yes" 07:33). Commits 9be58f5, 28243c6.
2. **The ghost tinted by canPlace** (Albert, Nov 1 12:48). Commit 86636c4.
3. **Every building two squares from every find** (Albert, Nov 1 13:00). Commit 6763d1a.

## 1. The three home zones

**Zone 1, behind each Town Center** (`BACK`, `BACK_MARGIN` in 06; laid by `laySpots` in 10):
- one berry patch (4 bushes) and one small grove (4 trees, 2 × 2);
- every node behind the Town Center (the corner's side of both axes), 200 to 325 (MID − CORNER) from it;
- the amounts come from the costs, in one home:
  - food = Bronze 300 + 6 villagers × 50 = **600** (150 a bush);
  - wood = Bronze 100 + 5 houses × 30 = **250** (62.5 a tree);
- the same on every land (the land's `amt` skips zone 1), so it always holds Bronze's cost;
- laid first. It never searches outward: if it does not fit, the find is missing and `tests/map.py` fails;
- its room is its own shape plus one square, so two finds keep two squares between their nodes;
- every node is `BACK.edge` (30) from the map's edge. That is half a tap (22 px) at the opening zoom on the tilted axis, rounded up to whole squares. Two squares gave 19 px and failed the camera check.

**Zone 2:** the five home finds as before (band 200 to 260, × 1.18), with no node in zone 1. They now lie round the front and sides.

**Zone 3:** every wild find, movable and runway deposit is kept out of zone 1 as well as the band.

**The clearing holds:** no node of any find within 200 of a Town Center.

### The fit: 400 of 400

Zone 1 fits in **every corner of 100 seeds × 4 corners** (the gate's run). Last night's arc failed 57 of 120 for lack of room. Sizing zone 1 to what it must hold (two finds about 20 across) solved it.

Worst case over 400 corners:

| Measure | Worst |
|---|---|
| Zone 1 node from its Town Center | 200 to 324 |
| Zone 1 node from the map edge | 30 |
| Zone 1 node from any other find's node | 24 |
| Zone 2 nearest node | 200 to 260 (farthest 343) |
| Nearest node not of zones 1–2 | 260 |
| Camera, all four sizes | 26 px (the check asks 22) |

### Tests

- `tests/map.py` checks, per corner:
  - zone 1's counts;
  - its food and wood against Bronze's cost and margin, worked out in the test from `AGES`, the villager and the house;
  - every node behind, 200 to MID − CORNER, 30 from the edge and two squares from other finds;
  - nothing else in zone 1;
  - the zone 1 grove reached.

  It prints the fit count. The camera check includes zone 1.
- **Fails on main:** "no zone 1 (BACK) to lay".
- **Six plants, all caught:** zone 1 laid out front; zone 1's food typed (550); zone 1 scaled by the land; zone 2 and the wild in zone 1; zone 1 two squares from the edge; zone 1 without its gaps. Two older plant texts were updated because the line they hit changed.
- `tests/science.py`: "clear sight" now sets a clear sky. It read the seed's opening weather, which was clear only by luck. The new map's dice rolled weather with sight 60.

### Fingerprint, taken apart

| Variant | Fingerprint |
|---|---|
| Full change | moves |
| Zone 1 not laid (zone 2 and the wild still kept out of it) | moves |
| Zone 1 off, no keep-out, no deposit guard | exact |

Both parts move it: laying zone 1, and keeping the others out of it.

## 2. The ghost (Albert, 12:48)

- **Cut from `drawGhost` (24):** the build grid four squares out, its darker taken squares, and the green or red footprint box with its outline.
- **Added:** the ghost's own art is tinted green where `canPlace` says it fits and red where it does not (`ghostTint`, one cached copy per sprite and answer). The reason stays in its label (for example "Leave two squares from trees and rocks").
- **Unchanged:** the line-up guides from `snapGhost` (09).
- **Walls left as they are.** Their per-square cells are the wall tool itself.
- **Help text (07):** "over the build grid" is cut. It now reads "It shows green where it fits; red says why not." `GUIDE.md` still has the old line; it is regenerated at the next preview (answer 13).
- **Test (`tests/map.py`):** while placing, no line and no rectangle besides the label's; the tint follows `canPlace` (green-minus-red of the drawn art, one open and one refused spot). It fails on the build before (22 lines, 6 rectangles, red where it fits).
- **Four plants, all caught:** grid drawn, box drawn, tint inverted, no tint.
- **Fingerprint exact** (drawing only).
- Pictures: `/tmp/claude-0/-home-claude/5e78bdae-23e5-5268-bffd-9d2ee20ad0d1/scratchpad/zones81/ghost-ok.png` and `/tmp/claude-0/-home-claude/5e78bdae-23e5-5268-bffd-9d2ee20ad0d1/scratchpad/zones81/ghost-no.png`.

## 3. Two squares from every find (Albert, 13:00)

- **`canPlace` (09):** a node of any find (tree, bush, rock, deposit) inside the footprint grown by `LANE` squares refuses the building. It was 6 units. The gap is `LANE`, the same number as between buildings, in one home.
- Mine and quarry plots follow it.
- **Fish do not count.** A dock needs the water, and fish swim in it.
- **The refusal** reads "Leave two squares from trees and rocks".
- **Help text:** "It keeps two squares from trees, bushes and rocks too."
- **The map's own layout is not bound by it.** If the layout puts a find within two squares of a starting building, the map laid it there. The rule is for placing, by players and computers. In practice the only starting building is the Town Center, and every node is 200 or more from it.
- **Starting buildings and the first house fit.** On 20 seeds every computer finds room at the start for a house (60 to 190 from its Town Center) and for a mill, a lumber camp and a mine camp by the nearest find of each.
- **Room over play** (6 seeds, checked at 5, 10 and 15 minutes, all four seats; 432 checks): house, field, lumber and mine camp were never refused. The mill was refused 3 times late (by food that has run thin), against 7 times on the build before the rule. So the computers are not boxed in.
- **Tests (`tests/map.py`):** for a house, a mine camp and a field, a tree half a unit inside two squares (beside, and above) refuses; at two squares it stands. Plus the computers' room at the start. It fails on the build before.
- **One plant, caught** (the old 6-unit gap).
- **Fingerprint accepted:** the computers' buildings land elsewhere from minute 1.

## Runs (one browser at a time)

- `build.py`, `wrap.py`, `lint.py`, `tests/docs.py`: clean.
- **Gate:** all pass but one line, combat item 5 (below).
- **START QC** (final, on 6763d1a): **FAILED, 26 problems, all from one cause**:
  - combat item 5;
  - so the gate;
  - so `tests/combat.py`'s control run;
  - so its 23 plants, which cannot be judged on a failing control.

  Every other plant was caught: **121 of 121**.
- **Soak** `1,2,3 20`: 3 of 3 PASS.

## Balance

**4 seeds × 30 minutes, jobs 1** (median minutes; sides reaching it of 16):

| Build | Bronze | Classical | Medieval | Blocked villager-s |
|---|---|---|---|---|
| main 66a68a5 | **5.7** | 9.4 | 24.8 (7) | 37.0 |
| zones only (9be58f5) | 6.7 | 12.7 (15) | 19.7 (3) | 38.5 |
| zones81 final (6763d1a) | **6.5** | 12.3 (14) | 20.0 (3) | 53.0 |

The 4-seed medians are carried by seed 1, where seats 0 and 1 reached Bronze at 28 and 22 minutes. Seat 0's home berries there lie inside a guarded find's danger radius, so its villagers will not take them; they gather wild bushes 270 out with no mill. Main has corners like this too: on 20 seeds, every home bush was on the danger map in 5 corners on main and 3 here. It is the dice, not the zones.

**A closer call, 20 seeds × 10 minutes** (what Bronze needs):

| Build | Bronze | Reached by 10 min | Classical by 10 min |
|---|---|---|---|
| main 66a68a5 | 5.1 | 71 of 80 | 42 of 80 |
| zones81 final | **5.5** | 70 of 80 | 32 of 80 |

So Bronze is about **0.4 min later** than main on 20 seeds (0.8 on 4). Classical by 10 minutes is down by a quarter. One game had a blocked outlier: seat 1 with 387 villager-seconds, max 202 in one game; main's max was 27.

**A take-one-out run** (4 seeds × 10 min, zone 1 not laid, the keep-out kept): Bronze 4.2, 14 of 16. That is against about 6.1 and 13 of 16 with zone 1 laid. This points at zone 1 itself slowing the computers, though 4 seeds is thin.

**Likely cause** (from code, not proven):
- the computers put a mill or lumber camp by the nearest find (`17-ai`: drop-offs by `nearestType`);
- zone 1's finds are small (four trees of 62.5 wood), so a camp built there serves only a few loads.

## Size

`first-keep.html`: 1,195,604 bytes on main 66a68a5, 1,198,214 here (+2,610).

## Decisions for Albert

1. **Zone 1 is added, not carved from the home berries and grove.** I read "zone 2: the other home finds" as the five home finds staying in the band, with zone 1 a new starter patch on top (+600 food, +250 wood a corner). The other reading moves the home berries and grove behind and shrinks them to 600 and 250. That would cut home food from 2,655 to 600 and wood from 4,248 to 250. Which?
2. **Bronze is about 0.4 min later** (20 seeds), with zone 1 itself the likely cause (the take-one-out run).
   - My pick: fewer, bigger zone 1 nodes, 2 bushes of 300 and 2 trees of 125, so a camp by them is worth its cost. This needs a test run first.
   - Or have the computers skip a drop-off by a find under a set size.
3. **The margin's split:** 6 villagers and 5 houses give exactly your 600 and 250. But 6 villagers need one house, not five (room 5 at the start for 4 people). Keep 5, or cut wood to 130 (1 house)?
4. **Zone 1 ignores the land's multiplier,** so it always holds Bronze's cost. Fertile land does not make it richer.
5. **Walls and gates are not held to the find gap.** They were never checked against finds.
   - The computers' wall arc stands at 190 from the Town Center, and zone 2's nodes start at 200. Holding walls to the gap would leave holes in every computer's ring where a home find stands.
   - "No exceptions" was the word, so this is your call. My pick: keep walls exempt.
6. **Zone 1's edge margin is 30, not 20.** The camera needs it (19 px at 20).
7. **Found, not changed: combat item 5.** `tests/combat.py` item 5 (villagers sent to one point each stand on their own spot) passes on main only on its own seed 7.
   - On main, seeds 1, 3, 4, 6 and 9 leave 6 to 12 of 12 villagers off their spots after 40 s.
   - This branch's map moves seed 7 into the failing set: 2 of 12 off.
   - A trace shows the villagers arrive, are pushed 5 to 27 units off by the others, and stay in state `home` without going back. A real bug in the spot code, not in the zones. It blocks START QC here and needs the combat owner.

## Rules bent

- **One home:** the 22 px half-tap in `BACK.edge` is also typed in `tests/map.py`'s camera check. The code has no tap constant.
- **Build only what was decided:**
  - zone 1's 30 edge margin (forced by the camera check);
  - zone 3's deposits kept out of zone 1;
  - fish left out of the find gap (docks).
- **Formatting:** `tests/fmt.py` reformatted a few untouched lines in 10-world.js (prettier on the whole file). Its changes to other files were reverted.
- **START QC was not run before the first edit.** A clean-copy run was started and then stopped while the browser was busy. Main 66a68a5's state was taken as passed.
- **The find-gap fingerprint reason** was corrected in `tests/baseline.json` after `--accept` (the first text guessed at the scripted buildings). The line `--accept` writes to `CUTS.md` was reverted.

## Not done

- The combat item 5 bug (above).
- The Bronze cost of zone 1 (decision 2).
- `GUIDE.md` keeps the old build-grid line until it is regenerated.
- `SCIENCE.md`: nothing new. The amounts are costs; the gap is design.

## Draft for CUTS.md

### Zones 81 (answer 2: three home zones; the ghost; two squares from every find), branch `zones81`, not published

**What changed**
- **Zone 1 behind each Town Center:**
  - a berry patch (4 × 150) and a small grove (4 × 62.5);
  - 600 food and 250 wood, worked out from Bronze's cost, 6 villagers and 5 houses (`BACK`, `BACK_MARGIN` in 06);
  - no land multiplier;
  - nodes 200 to 325 from the Town Center, 30 from the edge, two squares from other finds;
  - laid first, never moved out front.
- **Zones 2 and 3** (the five home finds; the wild, movables and runway deposits) kept out of zone 1.
- **The ghost:** its art tinted green or red by `canPlace`; the reason in its label; the line-up guides kept; walls unchanged.
- **Every building two squares (`LANE`) from every find**, plots included; fish excepted; the map's own layout not bound.
- **Text:** `RULES.md` fairness gives the three zones; the build help text and the refusal message updated.

**Cut**
- The build grid under the ghost (four squares out, darker taken squares).
- The ghost's green or red footprint box and outline.
- "over the build grid" from the build help text.
- canPlace's 6-unit node gap (now `LANE` squares).
- The home finds may no longer lie behind the Town Center.

**Tests**
- `tests/map.py`:
  - zone 1 checks (fits 400 of 400);
  - the ghost (no grid, no box, tint follows `canPlace`);
  - the find gap (refused inside two squares, accepted at two; the computers find room on 20 seeds).

  Each fails on the build before.
- 11 new plants, all caught; 2 plant texts updated.
- `tests/science.py` clear sight sets a clear sky.
- Camera 26 px at four sizes. Gate PASS but combat item 5 (a latent bug, seed luck on main). Soak 3 of 3.
- **Balance, Bronze:**
  - 4 seeds × 30: 6.5 against main's 5.7;
  - 20 seeds × 10: 5.5 against 5.1.
- **Size:** 1,198,214 bytes (+2,610).

**Play fingerprint accepted twice:**
- the zones: moved by laying zone 1 and by keeping the others out of it; exact with both off;
- the find gap: the computers' buildings land elsewhere from minute 1.

The ghost does not move it.
