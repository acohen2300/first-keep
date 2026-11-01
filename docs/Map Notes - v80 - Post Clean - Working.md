# Map Notes, v80 (Post Clean, Working): decisions 2 and 5a, D1, B4

Branch `map80` (from main 38001b9), built on Albert's double yes of Nov 1, 01:17. Not pushed, not published. Five commits, one per step, so each can be taken out alone.

## What was built, in the decided order

1. **Every map coordinate derived** (5a step 1). One table, `PLACES` in 06: the trade stops (from the middle), the lake's lodes (from the middle), the robbers' camps (from the edge), the scout's loop (middle, edge, keep). `cross(d)` gives the four points on the middle lines. `ROUTES` is built from them; the camp and lode loops, the scout loop, the camera's first spot and the gate's own test points (1000, 770, 200) read them. The A* heap is sized from `NC` (it was 40000, too small for 216 × 216). **Fingerprint unchanged.**
   - 1b (separate commit): the forest's clearings and paths now come from the real stops, camps and lodes. They had drifted 5 units (210/380/−140/430 typed by hand against 205/375/−145/425). The shore-shrine leftovers (keepOut and goal at 516,516, the `sh` room in laySpots) are cut. The lane and the lattice run from the camp and to `CORNER`. The fingerprint moves from minute 2: the forest is different.
2. **Decision 2: two squares between buildings** (`LANE = 2` in 06). `canPlace` refuses a one-square gap between non-wall buildings. Walls, gates and crops may touch anything, but not a building that trains people (that ring stays one square). The ghost snaps flush (crops) or two squares off. The slit rule stays. Fingerprint moves from minute 2.
3. **D1: a wave is judged by its progress** (`WAVE` in 05). A wave goes home when beaten (under 35%), or when for 45 s it has neither come 30 nearer its goal (the mean of its soldiers' distances to the mark or Town Center) nor fought. A target it stalled against is left alone for 180 s. The Throne run uses the same wave. Fingerprint unchanged in 5 minutes.
4. **5a constants and the home zone.**
   - `MAP` 2160 (`MID` 1080). `CORNER` 755: 751 was decided, but a 5-square Town Center centres on a half square and 751 snaps to 755 at every corner (329 becomes 325), so 755 is typed as what it is. Neighbours 1,510 apart; 325 behind each Town Center.
   - `HOME = { clear: 200, band: 60, rich: 1.18 }` with `CLEAR` 360 as the radius. The five home finds are placed at random in the band 200 to 260, at any angle, at today's pocket × 1.18 (berries 5 × 531, grove 12 × 354, stone, gold and iron 2 × 885 each, before the land's multiplier, which is the same in every corner). Every other find is rolled for each corner on its own (the shared `dist` table is gone) and lies wholly outside the band: its ring is moved out to start at 260 + its room.
   - **B4** (`openWays`): after the whole map is laid, every find and every bush, rock and lode in a corner's quarter is checked from its Town Center on the real walking grid (`navRebuild`, `NAV.comp`). If one is cut off, the forest and wild-grove trees within 30 of the straight line home are cut, up to 12 passes. The forest's own 10-unit grid (`reach`) is cut.
   - Runway deposits stay clear of every find, earlier deposits and the home zone. One with no room is not laid (QC 05 N5). Before, 12 stacked pairs in 60 seeds, and bushes walled inside a grove.
   - **The Throne's ring is symmetric about the Throne.** Walls at ±75 on every side. Each gate is the two middle squares of its side (the ring has an even number of squares, so no single middle square exists). Every Town Center's nearest gate is equally far.
   - **Save shape 40.** A game saved on the 2000 map opens set down in the middle of the 2160 map: every place moves 80, the fog and ruts move square for square, and an old wave gets its progress fields and the cool-down table.
   - `RULES.md` §1 fairness rewritten: equal content, not equal distances.

## The 100-seed placement test (`tests/map.py`, in the gate)

PASS on 100 seeds × 4 corners. Each corner had all five home finds at HOME.rich, nothing else within the band, no find within the clearing, no forest or water within 360, and every home node, every bush, rock and lode and every find of the corner reached from its Town Center.

Worst case over the 400 corners:
- home find centres 197 to 262 from their Town Center (band 200 to 260; a grove's centre wanders ±4 with its trees);
- nearest node not of the zone: 270;
- nearest find (chest, ruins, den, cemetery, vagabonds): 307;
- nearest home node to the map edge: 36;
- carried-off finds with no room: 0.

The decision's fallback (clear 190) was not needed.

First tries that failed, kept for the record:
- With the pocket's old arc (behind the Town Center, ±0.5 turn), 57 of 120 corners in 30 seeds could not fit all five in the band (iron 47, gold 10). The arc was cut; the decision says "at random positions in the band".
- Before the deposit and grove fixes, 22 nodes and finds in 100 seeds were cut off on the walking grid.

## Camera and corner visibility

At 375 × 667, 390 × 844, 393 × 852 and 430 × 932, at the zoom a game opens on, the camera was sent to every home node and held by the map's edges (`clampCam`), 10 seeds, 4 corners. Every home node stood inside the clear band between the bars. The nearest was **41 px** from the view's edge, at every size (the test asks for 22 px, half a tap). The 13-unit buffer Albert read as "to see and play in the corner" holds: the zone's farthest node is 36 from the map edge.

## Tests, each shown failing first

`tests/map.py`, run by the gate, has 8 checks:
- the gap;
- D1;
- the citadel;
- the old save;
- the camera at 4 sizes;
- the 100-seed zone, with its worst-case report.

8 planted bugs were added to `PLANTS`. `handoff.py`: **43 planted bugs, every one caught**; START QC PASSED.
- The gap test failed on the old `canPlace` ("a one-square gap between two buildings is allowed").
- The D1 test failed on the old 45 s rule ("a wave still walking nearer was recalled after 80 s").
- The rest fail on their plants: HOME_RICH removed, wild floor removed, `openWays` removed, the ring half a square off, the old save not moved.

Two existing tests had numbers that broke at the new size, and were fixed:
- `science.py`: the rut test indexed the 50-square fog by hand.
- `moves.py`: the parting test stood its two villagers where the first villagers spawn, which is on the Town Center's own squares. It passed before only because of the angle it happened to part at. The test now stands them on open ground. The spawn itself is a separate, older problem, listed below.

## Runs (one at a time)

- `build.py`, `wrap.py`, `tests/lint.py`: clean.
- `tests/gate.py`: PASS, all four sizes, after accepting the fingerprint with its cause (below). `handoff.py`: START QC PASSED.
- `tests/soak.py 1,2,3,4,5,6 30`: 5 PASS. Seed 4 FAIL "the save of a big game did not read back" (save 0 kB at 28 min). This is not new: the v80 base (38001b9) fails the same way on seed 5 (27 min, save 0 kB). It looks like a game that ends mid-soak (`G.over`, so nothing is saved), which the soak reads as a failure. Not changed here.

### The play fingerprint, with its cause

Measured step by step against the step before:

| Step | Fingerprint |
|---|---|
| 1 | exact |
| 1b | moves from minute 2 (forest layout) |
| decision 2 | moves from minute 2 (where buildings can go) |
| D1 | exact (no wave in 5 minutes) |
| 5a | moves from minute 1 (a new map) |

Accepted, with that reason, in `tests/baseline.json`. The gate's `--accept` also appends a line to `CUTS.md`; that line was reverted here, because `CUTS.md` is not this builder's to edit.

### Balance: 4 seeds, 30 minutes, jobs 1 (median minutes to each age; sides reaching it of 16)

| build | Bronze | Classical | Medieval | blocked villager-s (median) |
|---|---|---|---|---|
| v70 | 4.4 | 8.2 | 20.0 (6) | 75.5 |
| v80 today (38001b9) | 4.5 | 9.4 | 20.4 (4) | 98.5 |
| **map80** | 4.9 | 10.0 | 25.5 (5) | 26.0 |
| map80 without D1 | 4.9 | 9.6 | 19.3 (7) | |
| map80 without the wild-find floor | 4.7 | 9.2 | 23.1 (10) | |
| map80 with LANE 1 | 5.2 | 9.0 | 27.2 (7) | |

No side fell in any run. How to read it:
- **Bronze is about 0.4 min later than today in every variant**, so the cause is the map itself: home finds at 200 to 260 instead of 150 to 270, and walks 8% longer.
- **Classical is 0.6 min later. Most of that comes from the wild-find floor** (without it, 9.2): the near wild berries, groves, stone and gold moved out past 260 + their room.
- **The Medieval median rests on 4 to 10 sides and swings ±4 min between variants.** 4 seeds cannot read it. Removing D1 brings it back to 19.3, as you would expect: waves that arrive mean real wars.

### Wave arrival (seeds 1 to 4, 30 min, normal; every computer wave; within 300 of the target's Town Center)

| build | waves | arrived | ended within 47 s without arriving | median closest |
|---|---|---|---|---|
| v70 | 73 | 54 (73%) | 15 | 49 |
| v80 today | 84 | 59 (70%) | 20 | 57 |
| **map80** | 35 | 33 (94%) | 0 | 39 |

Fewer waves, because no doomed wave is relaunched every 46 s.

### Frame cost and size

- Simulation step, node, seeds 3/5/7, minutes 1 to 1.5: **4.56 ms to 4.97 ms (+9%)**. The map's area is +16.6%.
- Draw in Chromium: no increase measurable. It was 14.6 against 7.9 ms on seed 3 at minute 1, a different view; another builder shared the 2 CPUs.
- Soak frame times swung from 0.4 to 97 ms on both builds, for the same reason; not readable.
- Save size in the soak: 235 to 256 kB against 221 to 260 kB.
- `first-keep.html`: 1,190,299 to 1,196,639 bytes (+6,340); `src/` +6,340.

## Stopped, and why

- **The two towers.** Two towers cannot stand at equal distance from four corners: two points cannot keep a quarter turn's symmetry. They are now exactly symmetric on their own diagonal (both 70 off the Throne on each axis; they were 70 and 80, from snapping). The Raiders and the Fortress still each face one, and you and the Rivals face none. This is Albert's call (QC 05 N2: four equal towers, or none). Not built.
- **The shrine.** The only point equally far from all four gates is the Throne's own square. Moved by the map change only (MID − 52, MID + 46), still in the south-west yard. Albert's call: on the Throne's axis/centre, or state the bend (QC 05 N3).

## Rules bent (named)

- **Fair is not mirror / base rules:** the gates are now two squares wide (four gates of two pieces). Symmetry forces it on a 2160 map whose middle is a square's edge. This is a wider way into the citadel.
- **Build only what was decided:** four calls were mine, all forced by the tests or the wording:
  - the home finds lie anywhere round the Town Center, not in the pocket's arc behind it (the arc could not hold the five in the band; the decision says "at random positions in the band");
  - every other find is pushed out past the band (my reading of "everything outside the zones random", and the only way the band holds the same content in every corner);
  - a cut home may go through a wild grove, not just the forest (some finds sat behind a grove);
  - a runway deposit with no clear room is not laid.
- **No hand-typed numbers:** `FOREST.clear` (80, 90, 60), `FOREST.cut` 30, `FOREST.edge` 15, `WAVE` and `PLACES` are in tables now. The ring caps (560, 640) in makeMap are distances from home, kept inline as before. QC 04 G10's `SHORE`, `POCKET`, `GUIDE_R` and the hand "+5" cell centres are untouched; they are not coordinates.
- Two existing tests (`moves.py`, `science.py`) were edited, as said above.

## Decisions for Albert

1. Towers: four, or none?
2. The shrine: at the Throne (centre or axis), or keep it in the SW yard and state the bend?
3. Gates two squares wide (forced by symmetry): keep?
4. The home finds all round the Town Center (built), or back behind it in a wider arc? The old arc fails the 100-seed test.
5. Wild finds pushed past the band costs about 0.6 min to Classical on 4 seeds. Keep, or allow them in 260 to 360 (the zone's radius) and check the band only by node?
6. `CORNER` 755 (what 751 snaps to): agreed?
7. Older, found here, not changed:
   - the first villagers spawn on the Town Center's own squares (one of three each side);
   - the soak counts a game that ends as a failed save;
   - ai.md's troops locked on an unreachable robber at 80 px are still there; D1 now cools them off after 45 s instead of relaunching at once.

## Draft for SCIENCE.md (the standing rule: each built decision, with its equation, source and code home)

- **Decision 2:** a gap is passable if wider than 2r, after inflating each obstacle by the walker's radius (configuration space; ECE276B, as cited in the decision). 2r is the drawn figure's width, a visual choice. Code: `LANE` in 06, `canPlace` and `snapGhost` in 09-nav. Label: design.
- **5a:** gather rate R = c / (c/g + 2d/v + w·c/(A·v)); berries at 200 give 0.38/s, at 260 give 0.34/s. Area per player is the usual RTS rule (general knowledge, not looked up). Code: `HOME` and `CLEAR` in 06, `LAYOUT`, `laySpots`, `makeMap` and `openWays` in 10-world. Label: design.
- **D1:** progress = the mean distance to the goal shrinking by `WAVE.step`, or a blow within `WAVE.fight`. Code: `WAVE` in 05, `decideWar` and `throneRun` in 17-ai. Label: design.

## Draft for CUTS.md

### Map 80 (decisions 2 and 5a, D1, B4), branch `map80`, not published

**What changed:**
- `MAP` 2160, `CORNER` 755.
- The home zone (`HOME`: clear 200, band 60, rich 1.18; radius `CLEAR` 360).
- Every map coordinate comes from `MAP`, `MID` and `CORNER` (`PLACES`, `cross`).
- Two squares between buildings (`LANE`).
- Waves judged by progress, with a cool-down for a stalled target (`WAVE`).
- B4 reachability on the walking grid (`openWays`).
- Runway deposits clear of finds and of the zone.
- The Throne's walls and gates symmetric; gates two squares wide.
- Save shape 40.
- RULES fairness: equal content.

**Cut:**
- The hand-typed `ROUTES` table, replaced by `PLACES.stop` and `ROUTES` built from it.
- The forest's hand clearings and goals (210, 380, −140, 430, 516), replaced by the real places.
- The shore-shrine leftovers (keepOut and goal at 516,516; `sh` in laySpots), dead since Build 40.
- The shared distance per find (`dist`) and laySpots' loose pass and fallback. These caused B3; replaced by a roll per corner, or not laid.
- The home pocket's arc and `TURN` (the LAND table's swing): the five finds go anywhere in the band.
- `makeForest`'s own reach grid, replaced by `openWays` on the walking grid.
- The camera's typed first spot (400, 1600), replaced by `MID`.
- The A* heap's typed 40000, replaced by `NC * NC`.

**Tests:**
- `tests/map.py` in the gate: gap, D1, citadel, old save, camera at 4 sizes, 100-seed zone. Worst case: centres 197 to 262; nearest other node 270; nearest find 307; edge 36; 41 px in view.
- 8 planted bugs; 43 of 43 caught.
- Gate PASS. `handoff.py` PASS. Soak 5 of 6 (seed 4: an ended game; the base fails seed 5 the same way).
- Balance against v70 and today as above.

**Play fingerprint accepted:** step 1 exact; 1b forest, decision 2 placement, 5a new map each move it; D1 does not.
