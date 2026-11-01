# Fresh-eyes review: src/08-core.js, 09-nav.js, 10-world.js, 11-orders.js (v70 Restoration)

Every line of the four files was read. Probes ran in a copy (`scratchpad/ag-core`, rebuilt there; an eval hook was injected into a copy of the HTML at `ag-core/x/fk-eval.html`; scripts `ag-core/x/j2.js` to `j5.js`, runner `t2.py`). Note: `build.py` writes `/tmp/fk-build/game.js`, a fixed shared path, so my rebuild touched the same temp file the lead's build uses (harmless, but the path is shared between runs).

Severity: S1 crash/data loss/determinism, S2 wrong behaviour, S3 rule/bloat, S4 minor.

## S1
- **10-world.js:137-138 with 08-core.js:215-218. VERIFIED by reading.** `newGame` decides between the daily hazards (`TODAY_HZ`) and the scenario/Setup hazards by comparing the seed with `todaySeed()`, which reads `new Date()`. The same seed therefore builds a different game depending on the day it is played: the daily seed replayed tomorrow gets the player's scenario and `SET.hz` instead. The rule is "deterministic from the seed, no clock in simulation files". Fix: pass the daily flag in from the caller (33-verbs:207 already knows it) and keep the clock out of `newGame`.

## S2
1. **Home finds are not at the same distance in every corner. 10-world.js:494-511. VERIFIED.** `laySpots` gives each id one shared distance (`dist[id]`). After 150 failed tries it falls back to a "loose" roll with its own distance per corner, then to a fixed fallback. I measured over 100 seeds × 4 corners (`j2.js`):
   - Shared distance not used: ironP 357/400, goldP 286/400, stoneP 173/400, groveP 76/400.
   - 100 of 100 seeds have at least one corner whose home pocket is off the shared distance, by as much as 101 units.
   - Wild/movable ids drift too, but rarely (den 9, vagabonds 12, cemetery 11, ...).

   This breaks the base rule ("the same home resources at the same distances in every corner"). Cause: the home angle window (−2.9 to −1.75 rad, ±0.5 turn) plus the `x < -190 || y < -190` bound leaves roughly a 14° window at 240 units, which then has to fit 24 to 56 of clearance. Fix: a home pocket is a base rule, so roll its angles once and share them, as `dist` is shared. Alternatively, derive the −190 bound from the real map edge (the keep is 305 from it). Either way the loose and fallback branches can then be cut for home ids.
2. **Buildings made finished never get `b.mx`, so their first bhp research leaves them "damaged". 10-world.js:721-726 + 08-core.js:621. VERIFIED (`j3.js`).** `mkBld` sets `hp` but not `mx`. `rehealth` scales hp only `if (b.mx && ...)`, so on the first rehealth it just sets `mx`.
   - Every game: if Masonry (bhp ×1.3 on all buildings) is the side's first finished research, the Town Center sits at 2400/3120 (77%).
   - Siege scenario: it starts with the keep at 2400/3120 and both towers at 500/910 (55%), and they stay there.
   - The towers are also too weak at birth: `applyScenario` grants techs without `fxDirty()` before `mkBld` (10-world:186, 205), so `maxHpB` reads the stale fx cache.

   Fix: `mkBld` sets `b.mx = maxHpB(...)`; drop the `b.mx &&` guard; call `fxDirty()` right after the grants.
3. **Forest "nothing may be walled in" fails. 10-world.js:397-444. VERIFIED.** 40 seeds × 4 corners gave 24 bush nodes (4 whole clusters) not reachable from their own Town Center (`compOf`). Examples: seed 17 corner 0 at local (−36..−72, 412..441), seed 21 at (391..434, −125..−151). The cause is not water, not the groves and not the clearance erosion (tested each, `j4.js`/`j5.js`). SUSPECTED cause: `reach()` checks on its own 10-unit grid anchored at local −300, which is a half square off and mirrored against the walking grid (keeps at 305/1695). So a gap that is open in `reach()` is closed in `NAV`. Fix: check with the real `NAV`/`compOf` once the map is laid, and cut against that.
4. **Muster ignores cost research. 11-orders.js:68. VERIFIED by reading.** `musterCost` uses raw `U.cost`, not `unitCost(o,k)`, so feudal, informers and police discounts never apply to a muster. Fix: `unitCost(o,k)[r]`.
5. **`hireWhy` uses the wrong army limit. 11-orders.js:814. VERIFIED by reading.** It checks `ARMYMAX` and ignores `capA` (the fallen share), with its own wording. Fix: `armyRoom(o)` and `armyFull(o)`.
6. **Research always queues at the first building. 11-orders.js:106/117. VERIFIED by reading.** `ready(o,T.at)[0]`: when that one's line is full, it says "That line is full." even if a second building of the kind is free. `train` picks the shortest line. Fix: pick the shortest line, one helper for both.
7. **The `compOf` cache never hits. 09-nav.js:207. VERIFIED.** The key includes `G.rs`, the rng state, which changes on every `rng()` call. In 120 sim seconds it rebuilt 122 times out of 148 calls, each time a new 160 KB `Int32Array` and a 40k-cell flood fill. Fix: key on `G.seed` (or a game id) and also on `fxv(o,'flood').a` (levees change `blockedCell`). At the moment the churn hides that the levee state is missing from the key.
8. **A 1-square lane between buildings is never walkable. 09-nav.js:103-112 vs 09-nav.js:692-696, 742-743, 998. VERIFIED.** `canPlace` demands "a lane round each building", and `snapGhost`/keep-placing offer "one lane between". But the slit rule makes that lane solid: two houses one cell apart gave lane cells `[1,1]`. So rows of non-wooden buildings placed by keep-placing form a wall. The rules contradict each other; Albert must choose: either the lane is 2 squares or the slit rule goes.
9. **The spy's "unguarded" test and the tower's sight disagree. 11-orders.js:778-779 vs 08-core.js:562. VERIFIED numbers.** `guarded()` uses the shot range: tower 139, keep 133, courthouse 126. `spySeen` sees spies at 140 + research. So a spy picks a target it thinks is unguarded and is seen before it gets there. The comment at 11-orders.js:776 repeats the 45/140 from the table. Fix: `guarded` reads `spySeen`.
10. **Three fish per game sit on the causeways. 10-world.js:652-656. VERIFIED.** On land at (1162,1000), (1015,1161) and (1015,839), seed 1. Fix: skip angles where `onLand`.
11. **`nodeName` says "Field" for a pasture, quarry, workshop, mint or foundry. 11-orders.js:939-946. VERIFIED by reading.** "A villager heads for the field" for a Mint. It also hand-writes names that BLD and 07 already hold. Fix: `BLD[n.farm.kind].name` for plots; the other kinds belong in 07.
12. **The 'road' scenario is lopsided. 10-world.js:177-213. SUSPECTED design.** `all: true` gives every side the age, store and techs, but only you get the Market and 6 villagers. This breaks "fair for all" unless intended.

## S3 (rules, bloat)
- **The forest's clearing coordinates are copies of facts held elsewhere, and they have already drifted. 10-world.js:321-331 and 427-437.** The same nine points are written twice (keepOut and goals):
  - [210|380, CORNER] are the ROUTES stops, which really sit at local 205/375 since CORNER became 695.
  - [CORNER, 430] is the MID±270 deposit at makeMap:635, really 425.
  - [-140, CORNER] are the camps at 160.
  - [516,516] and laySpots' `sh` (511, comment "this corner's shrine on its shore", 10-world:485-490) reserve room for the four shore shrines that were cut in Build 40 (CUTS.md:408, 414).

  Cut the shrine leftovers and derive the rest from ROUTES and the camp/deposit tables: about 15 lines.
- **Numbers outside 01-06 (rule 6):** mkPlayer's start store `{f:200,w:200,s:100,g:50}` (10-world:80), LAYOUT, SHAPE, FOREST, node amounts (180/120/300/350/500/400/60 ×RICH), SHORE, POCKET, GUIDE_R, SEAL, `|| 100` sight, `{w:200,s:100}`.
- **`repairCost` duplicates repairTick's fallback cost and its 0.25 rate.** 11-orders:936 vs 13-sim-civil:438-443: two homes.
- **`capWhy` hard-codes apartment→aqueduct inline.** 08-core:291. It belongs in the BLD table.
- **`applyScenario` writes `p.res` directly.** 10-world:185. It bypasses earn/spend (ledger rule).
- **Dead code, VERIFIED by grep:**
  - `QC.bak` is never read (08-core:235).
  - `capV` is never set (08-core:278).
  - The `B.one` check is unreachable: the wonder has no cap table, so `capWhy` stops it first; `one:true` is dead too (09-nav:722).
  - `NAV.prev === NAV.solid` is never true (09-nav:116).
  - `(G.prisoners || [])` ×3: makeCitadel and load always set it.
  - The `!S` part of applyScenario's guard (10-world:175).
  - `ordersTick`'s `if (!G.ords) return` also skips `missionsTick` and the `u.ord` cleanup (11-orders:1113). It is a guard for state not declared in `blankGame`; `ords`, `ordN`, `chargeT`, `incoming`, `slipT`, `buildBy`, `treeV` and others are all born lazily.
- **Stale or misplaced comments:**
  - blankGame:61: the `sworn` comment sits on `post`.
  - blankGame:67: the `clim` comment sits on `chron`.
  - makeCitadel:667 says "a tower at each corner"; the code puts two.
  - 11-orders:1030-1034: four comment lines say the same thing (cut 3).
  - `payBack`'s comment says "all step back", but `spentBy` (the Stores drill-down) does not.
  - `sendOut` says "the last villager sent", but it takes the last in unit-creation order.
- **`makeMap` and `laySpots` shadow the global `dist()` with a local `dist`.** 10-world:479, 540.
- **Committing a 40-piece wall takes 131 ms in one frame.** 11-orders:965 → `build` → a full `navRebuild` (3.2 ms) per piece. Fix: build all the pieces, then one rebuild.
- **`setRel` declares war on the Natives through a second path.** It calls `makePeace` and then writes 'war' (11-orders:322-329) instead of one war function.

## S4
- `musterWhy` says "Needs a X" when the reason is the age. Muster checks homes (`capOf`) while `train` lets the order queue.
- `demand` can take 0 when the store is between 0 and 1, and still costs loyalty (11-orders:481-491).
- `DANGER` hard-codes 5 sides (09-nav:269). `popOf`/`clsCount` count units dead this step. `rebattalion` relies on `CLS[-1]` being undefined.
- `Math.random` for the seed sits in a simulation file (10-world:116). Outside the stream, but against the letter of the rule.

## Checked and clean
- Layout determinism: same seed gives an identical hash, and changing the player's civilisation does not change the map.
- No `rng`/`rnd`/`nextIn`/`hazard`/`addUnit` calls in the view or card files, so drawing does not consume the simulation's dice.
- A* heap, ring searches, causeway and gate geometry, and the earn/spend/payBack round trip on cancel and demolish.

## Not checked
Save and load of the fields these files create (mx, so, pf*, lc*). The AI's use of findSpot. A* behaviour with very large armies. The missions logic in 39-huddle.
