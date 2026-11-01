# QC 05: src/10-world.js, src/38-natives.js (v80 HEAD c3b4964 vs v70 88b2cb2)

Read only. Both files read in full. Checks run in a node sandbox (src/*.js minus 41-boot, DOM stubbed; scripts in scratchpad/qc/w5/), no Chromium.
Measured: 30 seeds × 4 corners, reachability against the real walking grid (`compOf`), home-pocket centroid distance per kind; 60 seeds for water/off-map/stacked finds; citadel geometry on seed 3.

Tags: C traced and sure · K fairly sure · S suspect.

## 1. Prior findings

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| P1 | B2 FIXED: daily flag passed in, no date read in newGame; only caller with the daily seed passes `true` | 10-world.js:116, 138-139; 33-verbs.js:220 | C | closed | none |
| P2 | B3 STILL PRESENT, unchanged: loose roll and fallback still give each corner its own distance. 30 seeds: home stone spread across corners up to 110 units, gold 89, iron 85, grove 62 (bushes 2); 121 of 150 seed×kind sets differ by >1 unit. Decision 5a (home zones, clearing 200, band 200-260, HOME_RICH 1.18, map +8%) not built (CUTS preview 6 says so) | 10-world.js:241-248, 481-517, 533-542 | C | high: breaks the base rule "home resources" | build 5a as decided; cut loose/fallback for home ids |
| P3 | B4 STILL PRESENT, unchanged: forest `reach()` uses its own 10-unit grid, not NAV. 30 seeds: 19 bushes (seed 17 corner 0 cluster at 269,1278, same spot v70 audit found), 1 gold (seed 9, 357,1392), 2 ruins, 3 dens not reachable from their own keep without cutting trees | 10-world.js:399-446 | C | high: one corner's finds walled in | check against NAV/compOf after the lay, cut toward the failing goal |
| P4 | B7 FIXED for scenarios: mkBld records `mx`; the stale-fx buildings of Siege are lifted to full by `fxDirty()`→`keepHealth` at the end of applyScenario | 10-world.js:730, 217; 08-core.js:475-486 | C | closed | none |
| P5 | B7 built as a third home: mkBld sets `mx`, keepHealth sets/scales `mx`, and rehealth's building loop still does the same (now a no-op after its own fxDirty) | 10-world.js:730; 08-core.js:480-486, 636-640 | K | low: rule §0 one home | delete rehealth's building loop |
| P6 | B10 STILL PRESENT: road scenario (`all:true`) gives Market and 6 villagers to you only; N3 decided every court gets them, not built | 10-world.js:203-215 | C | medium: unequal, unstated | loop `sides` for blds/vils/walls when `S.all` |
| P7 | B15 FIXED: lake fish skip `onLand` (pure geometry, so no stale-grid risk at map time) | 10-world.js:657-659; 09-nav.js:26 | C | closed | none |
| P8 | D7 STILL PRESENT: regard0 20 < peaceAt 40, only your verb gifts, so computers stay at war with the Natives; raids still pick computers (4b "raids skip computers" not built). You can buy out of raids; they then fall only on computers | 38-natives.js:220; 05-rules-wild.js:74-76 | K | medium: one-sided Natives | build 4b (or let computers court) as decided |
| P9 | C1/troops S2-1 STILL PRESENT: one `G.rel[o][WILD]` (set by natSync) covers Natives, animals and outlaws. At peace with the Natives your soldiers' `atWar` tests skip wolves/bandits, while wolves still attack anyone | 38-natives.js:29; 08-core.js:378; 14-sim-troops.js:419 | K | medium: relations rule contradicted | one `hostile(o,v)`: Natives by rel, the rest always hostile |
| P10 | natSync news hard-codes "40" instead of NATIVE.peaceAt | 38-natives.js:33 | C | low | read NATIVE.peaceAt |
| P11 | dead guard `if (!N.warBy)` (natState makes it) | 38-natives.js:25 | C | low | delete |
| P12 | Throne score written straight into `gathered`, outside earn (D6/N6, batch 6 owed) | 38-natives.js:296 | C | medium: crowns | route through earn or the crown |
| P13 | forest clearings hand-typed twice (keepOut, goals), drifted from ROUTES/camps/deposits; shrine leftovers `[516,516]` and laySpots `sh` (shore shrines cut in Build 40) | 10-world.js:324-333, 429-439, 487-490 | C | low; blocks 5a step 1 | derive from ROUTES, camps, MID/CORNER; cut shrine leftovers |
| P14 | applyScenario writes `p.res` directly (ledger rule) | 10-world.js:187 | C | low | earn the difference |
| P15 | `Math.random` for the seed in a sim file | 10-world.js:117 | C | low | caller supplies the seed |
| P16 | stale comments: `sworn` on `post`, `clim` on `chron`, "a tower at each corner" (two) | 10-world.js:62, 68, 671 | C | low | move/correct |
| P17 | local `dist` shadows global `dist()` | 10-world.js:481, 542 | C | low | rename `far` |
| P18 | hand-written weighted pick (second copy in 39-games) | 38-natives.js:223-227 | C | low | one `pickW` in 08 |

## 2. v80 changes in these files (diff 88b2cb2..HEAD)

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| V1 | `threats: []` in blankGame: correct (C17) | 10-world.js:8 | C | ok | none |
| V2 | `daily` parameter: correct and as decided (B2) | 10-world.js:116, 138-139 | C | ok | none |
| V3 | `fogTick()` at the end of newGame, after applyScenario: correct (B1) | 10-world.js:172 | C | ok | none |
| V4 | fish `onLand` skip: correct (B15); 60 seeds, no non-fish node or find in water or off the map | 10-world.js:657-659 | C | ok | none |
| V5 | `b.mx` at birth: correct, but see P5 (three homes) | 10-world.js:730 | C | ok | see P5 |

## 3. New

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | Citadel ring is off-centre: walls/gates on cells c±R with c=floor(MID/NAVC) centre at 1005, Throne at 1000. N and W gates 75 from the Throne, S and E 85; yard 4 squares N/W, 5 S/E. The Fortress's nearest gates are about 14 nearer than the Raiders' | 10-world.js:674-690 | C | low: "Throne central" off by half a square | lay the ring on cells symmetric about MID (c-R .. c+R-1) |
| N2 | Two towers on one diagonal only: NW (930,930), 99 from the Throne; SE (1080,1080), 113. Raiders' and Fortress's two near gates share one tower; yours and Rivals' are split across two; NW/SE shores in tower reach, SW/NE not | 10-world.js:691-695 | K | medium: the shared prize differs by corner | four equal towers, or none |
| N3 | The one shrine is fixed in the SW yard (948,1046): to W gate 47, S 69, N 134, E 143. You (W/S) and Raiders/Fortress reach it first, Rivals last. 15 gold a minute to its keeper | 10-world.js:696 | C | medium: unequal, unstated | Albert's call: put it equidistant (on the Throne's axis/centre) or state the bend |
| N4 | Garrison spawns and regrows in the south yard (Throne y+44): S gate (you, Fortress) faces it at about 41, N gate about 119 | 38-natives.js:83 | S | low (units move once alerted) | spawn round the Throne at a random angle |
| N5 | Runway deposits are checked only against water: 12 stacked pairs in 60 seeds (gold on berries, stone on gold) | 10-world.js:373-387 | C | low | add spots and earlier deposits to the `wet` test |
| N6 | `goals` omit lakes: 138 fish in 30 seeds sit on forest-enclosed or map-edge shores no villager can reach without cutting; code comment says "nothing may be walled in" | 10-world.js:426-440, 649-661 | K | low-medium (water itself is random by rule) | add a shore point per lake to goals, or fold into the P3 fix |
| N7 | judgeNatives allies through `makeAlly(WILD, from)`, which overwrites the side's one ally slot without ending the alliance already held; `G.rel[from][q]` stays 'ally' | 38-natives.js:71; 11-orders.js:291-297 | S | medium if reachable | refuse or end the old alliance in one alliance function |
| N8 | B5 hand-back writes the Throne's owner in 16-sim-fight, a second home beside takeThrone | 16-sim-fight.js (B5 block); 38-natives.js:91-130 | K | low: rule §0 | one `throneTo(o, how)` used by both |
| N9 | Alliance end goes to peace, then 5 s later to war with a second message if regard < 40 | 38-natives.js:20-37 | S | low | decide the target relation once from regard |
| N10 | Comments still promise "the same finds at the same distances in every corner" | 10-world.js:223, 480, 519 | C | low (misleads the next builder) | rewrite with 5a |
| N11 | Unequal starts that are by design: Fortress at peace with all; "New land" carries only your age and research (said in its message) | 10-world.js:132, 154-158 | S | info | state the Fortress start in RULES §1 or the Setup text |

## Counts
C 24 · K 6 · S 4 (34 rows; 8 closed/ok: P1, P4, P7, V1-V5).
