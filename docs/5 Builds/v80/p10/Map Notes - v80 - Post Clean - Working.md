# Map Notes, v80 (Post Clean, Working): decisions 2 and 5a, D1, B4

Branch `map80`, from main 38001b9. Built on Albert's double yes (Nov 1, 01:17), with his towers-and-shrine decision (Nov 1, 03:17) and the fresh-eyes review's fixes on top. Not pushed, not published. Eight commits, one per step, so each can be taken out alone.

## What was built, in the decided order

### 1. Every map coordinate derived from MAP, MID and CORNER (5a step 1)

- **One table, `PLACES` in 06**, holds the shared places:
  - from the middle: the trade stops, the lake's lodes, the scout loop's inner points;
  - from the edge: the robbers' camps;
  - from a Town Center: the first villagers' spot (`start`, which had three homes).
- `cross(d)` gives the four points on the middle lines. `ROUTES` is built from these.
- The camps, the lodes, the scout loop, the camera's first spot and the gate's test points (1000, 770, 200) all read them. The scout loop's corner points come from the real Town Centers, so an old game's loop fits its own corners.
- The map's lettered squares come from `MAP`: A1 to V22. The old labels stopped at T20, so the last 160 units of the map all read as T or 20.
- The A* heap is sized from `NC`.
- **Fingerprint unchanged.**

**1b (separate commit):** the forest's clearings and paths now come from the real stops, camps and lodes. They had drifted 5 units by hand. The shore-shrine leftovers are cut.

### 2. Decision 2: two squares between buildings (`LANE = 2` in 06)

- `canPlace` refuses a one-square gap between non-wall buildings.
- Walls, gates and crops may touch anything, but a field may not touch a building that trains.
- The ghost snaps flush (crops) or two squares off.
- The slit rule stays.
- The player's text (07-text and `GUIDE.md`) now says "two squares apart".

### 3. D1: a wave is judged by its progress (`WAVE` in 05)

- A wave goes home when beaten, or when for 45 s it has neither come 30 nearer its mark nor fought.
- A side it stalled against is left alone for 180 s.
- **Two exceptions, so a win at stake is never waited out:**
  - a wave on a wonder or on the Throne leaves no cool-down;
  - a side holding a wonder or the Throne is attacked even if it is cooled.
- The cool-down is keyed by the side attacked. The Throne run no longer cools anyone.

### 4. 5a: the bigger map and the home zone

**MAP and CORNER.** `MAP` is 2160. `CORNER` is snapped from the agreed 751 in its one home (01): `MID − (round((MID − 751)/NAVC − 0.5) + 0.5)·NAVC` gives 755.

- **Why 755, not 751:** a 5-square Town Center centres on a half square, so 329 behind it snaps to 325 at every corner.
- **What it costs:** 325 behind each Town Center, not 329, so the buffer behind the zone is about 9, not Albert's 13. The camera check below holds anyway.
- **What it guarantees:** every place laid from CORNER is on the grid, so the forest code cannot meet an off-grid stop. Its stop filter also takes a tolerance now.

**The home zone, measured on each find's own nodes** (`HOME = { clear: 200, band: 60, rich: 1.18 }`, radius `CLEAR` 360):
- no node of any find within 200 of the Town Center;
- each of the five home finds at a random place round the Town Center, with its nearest node in 200 to 260;
- no node of any other find within 260;
- amounts are today's pocket × 1.18.

**Every find is laid by its nodes.** Its shape (each bush, tree, rock or animal from the find's middle) is rolled first, and the find is accepted only if its nodes keep the rules.

**Every find and deposit in every corner (equal content).**
- A find with no room searches outward: its ring widens by 20 every 50 tries (`SEEK`).
- A runway deposit slides along its path, then searches outward ring by ring.
- The fresh-eyes review measured the runway gold missing in 37% of corners. Now nothing is missing on 100 seeds.

**B4 (`openWays`).** Everything in a corner is checked from its Town Center on the real walking grid.
- What stands on a middle line counts for both corners beside it, so every corner checks its own 2 camps and 4 stops. Before, the Fortress had 2 camps and 4 stops and the Raiders none.
- The lodes are laid symmetric about their middle line (gold either side, iron and stone on the line).
- A cut-off find gets a cut home along the way with the fewest trees, never across water (`wayHome`). Before, it was a straight line, which a lake could block.

**The citadel, as Albert decided (Nov 1):**
- four towers, one on each corner of the ring, at MID ± 70; no wall is laid under a tower;
- the ring symmetric, with gates two squares wide;
- the shrine on the Throne's own square. A priest within 50 holds it, standing at the foot of the Throne on its own side.
- The citadel is now the same seen from every Town Center: the same sorted distances to every wall, gate, tower, the Throne and the shrine.

**Save shape 40.** A game saved on the 2000 map opens set down in the middle of the 2160 map:
- every place moves 80, including an animal's graze point (renamed `grazeAt`, since `gx`/`gy` also name a soldier's place in the line) and a scout's loop;
- the fog and the ruts move square for square;
- an old wave gets its progress fields.

`RULES.md` §1 fairness is rewritten to say exactly this.

## Decisions for Albert

1. **The home zone's reading** (built as the coordinator asked):
   - The band holds each home find's *nearest* node; its other nodes may lie past it. The grove's farthest tree reaches about 340.
   - So the walk to a home find spreads more than the 60 the decision's rate math assumed.
   - A 56-room grove cannot fit wholly inside a 60-unit band, so "the whole find in the band" is not possible as decided.
2. **Bronze is about 0.8 min later than today** (below), from the farther home finds and the wild finds pushed past the band. Keep, or move the band in?
3. **CORNER 755 against the agreed 751:** the snap above. Agreed?
4. **Gates two squares wide.** Symmetry forces this: the map's middle is a square's edge.
5. **Older problems, found and not changed:**
   - the first villagers start on the Town Center's own squares (one of three each side);
   - the soak counts a game that ends as a failed save;
   - troops stuck on an unreachable robber at 80 px (ai.md). D1 now cools them off instead of relaunching them.

## The 100-seed placement test (`tests/map.py`, in the gate)

**PASS on 100 seeds × 4 corners.** Each check fails on any corner:
- a node within the clearing;
- a home find's nearest node outside the band;
- another find's node in the band;
- forest or water within 360;
- the corners holding different finds (every node but trees and fish, by kind and amount, plus the carried-off finds);
- not 2 camps and 4 stops;
- anything of the corner, shared places included, not reached from its Town Center.

Worst case over 400 corners:

| Measure | Worst |
|---|---|
| A home find's nearest node from its Town Center | 200 to 260 (its farthest node 340) |
| Nearest node of any find | 200 |
| Nearest node not of the zone | 260 |
| Nearest home node to the map edge | 21 |

The fallback (clear 190) was not needed.

## Camera and corner visibility

At the four phone sizes and the opening zoom, the camera was sent to every home node (10 seeds; the gate's run) and held by `clampCam`. Every node stood inside the clear band.
- Nearest: **29 px** from the view's edge, at every size.
- 100 seeds at 375 × 667: worst 27 px. The check asks for 22 px.

## Tests and planted bugs

`tests/map.py` checks:
- the gap (and a field touching a house on any free side);
- D1, with the win-threat exceptions and the map labels;
- the citadel per corner (towers, shrine, nothing on a wall square);
- a **real old save**: `tests/fixtures/save-v39.json`, 215 kB, made by build 38001b9 on seed 3, four minutes plus a Raiders' wave. It checks units, animals' graze points, the scout loop, buildings, trees, finds, lakes, Town Centers, the fog and the ruts, then loads it and plays 90 s;
- the camera at four sizes;
- the 100-seed zone.

**55 planted bugs, all caught** (20 for the map, including the camera, the shrine, three towers, the ruts, the graze point, a dropped find, a clashing deposit, an uneven lode, home finds laid by their middles, and the win-threat cool-downs). For each plant the planted-bug check runs `map.py` at 25 seeds and one phone size (`FK_PLANT`); the gate runs it whole.

Earlier tests fixed for the size: `science.py`'s rut index; `moves.py`'s parting test (now on open ground) and its scan, now to `MAP`.

## Runs (one at a time)

- `build.py`, `wrap.py`, `lint.py`: clean.
- **Gate:** PASS at four sizes.
- **`handoff.py`:** START QC PASSED.
- **Soak** (6 seeds × 30, before the review fixes): 5 PASS. Seed 4 failed "the save did not read back" because the game ended; the base fails seed 5 the same way.

**Fingerprint** (accepted with cause; the `CUTS.md` line `--accept` writes was reverted):

| Step | Effect on the fingerprint |
|---|---|
| Step 1 | exact |
| 1b | moves (forest) |
| Decision 2 | moves (placement) |
| D1 | exact |
| 5a | moves from minute 1 (new map) |
| Review fixes | move from minute 1 through the layout alone |

For the review fixes: with the D1 exceptions and the scout loop taken out the fingerprint is identical, and the graze rename and labels change no play.

### Balance (4 seeds, 30 min, jobs 1; median minutes, sides reaching it of 16)

| Build | Bronze | Classical | Medieval | Blocked villager-s |
|---|---|---|---|---|
| v70 | 4.4 | 8.2 | 20.0 (6) | 75.5 |
| v80 today | 4.5 | 9.4 | 20.4 (4) | 98.5 |
| map80, first build | 4.9 | 10.0 | 25.5 (5) | 26.0 |
| **map80, after the review fixes** | 5.3 | 9.6 | 24.5 (5); Gunpowder 28.7 (1) | 6.5 |

Earlier take-one-out runs on the first build:

| Variant | Bronze | Classical | Medieval |
|---|---|---|---|
| without D1 | 4.9 | 9.6 | 19.3 (7) |
| without the wild-find floor | 4.7 | 9.2 | 23.1 (10) |
| LANE 1 | 5.2 | 9.0 | 27.2 (7) |

- **Bronze:** the map itself.
- **Classical:** mostly the floor.
- **Medieval:** too few sides to read. No side fell.

**Waves** (seeds 1 to 4, 30 min, within 300 of the target's Town Center), first build:

| Build | Waves | Arrived | Ended within 47 s short |
|---|---|---|---|
| v70 | 73 | 73% | 15 |
| v80 today | 84 | 70% | 20 |
| map80 | 35 | 94% | 0 |

### Frame cost and size

- **Simulation step** (node, 3 seeds): 4.56 to 4.97 ms (+9%), against a map area +16.6%.
- **Draw:** no measurable rise; another builder shared the CPUs.
- **Size:** `first-keep.html` 1,190,299 bytes before.

## Rules bent (named)

- **Fair is not mirror:** the gates are two squares wide (forced by symmetry).
- **Build only what was decided:**
  - the home finds lie all round the Town Center (the old arc could not hold five in the band);
  - every other find lies past the band;
  - a cut home may go through a wild grove;
  - a find or deposit searches outward rather than being dropped.
- **No hand-typed numbers:** `FOREST.clear`/`cut`/`edge`, `WAVE`, `SEEK`, `PLACES` and `COORD` are in tables. The ring caps (560, 640) are distances from home, kept inline. QC 04 G10's `SHORE`, `POCKET` and `GUIDE_R` are untouched.
- **`GUIDE.md` was edited by hand** (one line) rather than regenerated, so as not to pull in other builders' text.

## Draft for SCIENCE.md

- **Decision 2:** a gap is passable if wider than 2r, after inflating each obstacle by the walker's radius (configuration space, ECE276B). Here 2r is the drawn figure's width. Code: `LANE` (06), `canPlace` and `snapGhost` (09). Label: design.
- **5a:** gather rate R = c / (c/g + 2d/v + w·c/(A·v)). Berries at 200 give 0.38/s and at 260 give 0.34/s. Built on nodes, so a find's nearest node sets d. Code: `HOME` and `CLEAR` (06); `LAYOUT`, `laySpots`, `makeMap`, `openWays` and `wayHome` (10). Label: design.
- **D1:** progress means the mean distance to the mark shrinking by `WAVE.step`, or a blow within `WAVE.fight`. Code: `WAVE` (05); `decideWar` and `throneRun` (17). Label: design.

## Draft for CUTS.md

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
