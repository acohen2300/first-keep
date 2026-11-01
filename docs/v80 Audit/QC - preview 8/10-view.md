# QC 10: the view (src/20-25), v80 HEAD c3b4964 against v70 88b2cb2

Read in full: 20, 21, 22, 23, 24, 25. Diff 88b2cb2..HEAD on 20-25: 22 (fogT gone), 23 (boxShadowPath + hull), 24 (view fogTick call gone). Read only; no build, no browser. One `node -e` check: hull winding (same as ellipse, so no holes under nonzero fill) and cost (about 1.2 µs a building on desktop node).
Tags: C traced and sure, K fairly sure, S suspect.

## 1. Prior findings

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| B1 | FIXED. The view no longer calls fogTick. fogT is gone. Fog is lit at the end of newGame (after the scenario) and after a load. | 24:482-504; 22:75-76; 10-world:172; 34-save:471 | C | Same seed now plays the same with or without a first frame | none |
| E12 | STILL. Fog leaks: sparks and tracers drawn after the fog (and a burning arrow's glow, 24:561). A remembered enemy building is drawn live: smoke shows work, fire, HP bar, site progress. Blaze glow over the fog. Chimney-tech flicker. Picked enemy ringed with no sight check. Scars painted everywhere. Cracks after the fog. Finds pushed with no known0. | 21:316,322; 24:561; 21:275 + 23:53-83,135,139,142; 24:582,591; 23:1247-1269; 20:36-82; 24:48; 21:278 | C | You read enemy state through the fog | Draw remembered buildings from a snapshot. Draw sparks and tracers before the fog. Filter picks and finds by sight |
| E13 | STILL. The build grid is half a square off for odd footprints | 24:264-265 | C | 26 of 41 buildings | `Math.round(sp.x/NAVC - B.fp/2) - 4` (same for y) |
| E14 | STILL. Rut and mud rows are culled without TILT or vy | 24:13-16 | C | Top of the screen has no ruts | Use toWorld(0,0) and toWorld(cw,ch) |
| E15a | STILL. Pile and badge caches key on z.toFixed(2), not dpr: a new canvas every pinch frame, and the wrong size after the dpr drop | 23:400; 20:87 | C | Pinch hitches | Key on quant(z*dpr) and dpr |
| E15b | STILL. drawSky calls getComputedStyle every frame | 25:166 | C | Forced style recalc every frame | Read --hb once in fit() |
| E15c | STILL. The sheet-flash gap is re-rolled every frame (2.5-3.7 s, not 2.5-8.5 s) | 25:68 | C | Storms flash too often | Roll the next gap once, when a flash fires |
| E15d | STILL. The shake translate comes after the ground and is never undone: overlays and the radar shift off their tap target | 21:250-253 | C | Mis-taps during a shake | save before the shake, restore after the standing pass |
| E16 | STILL. The view makes G.bolts with Math.random and sets b.lit on the simulation's bolts. The view writes the Place verdict (pl.why). makeBg uses Math.random, so the ground differs on every load. Nothing in the simulation reads these, so the outcome does not change. | 25:73-75,83,87; 24:249,261; 21:9-32,185-191 | C | Breaks "one home" and "laid once from the seed" | A view BOLTS array. canPlace verdict in 32. A local PRNG from G.seed for makeBg |
| E17 | STILL (in view files too). #c9b48a typed in by hand | 23:764,843 | K | Colour drift | A named token |
| G3 | STILL. drawFind is 339 lines of vector art every frame, with LG gradients made per frame. The shrine dome is drawn twice. | 23:906-1244 (gradients 957, 1037, 1072, 1077) | C | Frame cost near finds; bloat | Cache a sprite per kind, colour and scale. Delete 1073-1078 |
| V8 | STILL. Torch shadows read last frame's STANDARDS. flameShadow runs per unit × standard even at noon. | 23:779-780; 21:314 | C | Waste; stale by a frame | Fill STANDARDS before units; skip when G.night is 0 |
| V9 | STILL. A throw inside a piece leaves ctx.save/clip open, which persists across frames. drawFind also leaves the global g = ctx. | 21:305-311; 23:64-67,912-915,1242-1243 | K | One fault can crop every later frame | save before each piece, restore in finally (or ctx.reset) |
| V10 | STILL. Minimap smoothing is never restored. The grassM guard is stale after makeBg. Snow is drawn twice (drawEvents and drawWeather). The forest layer, deepTrees and woodsGrid key on treeV, which every navRebuild bumps. | 24:324; 21:238; 24:96-107 + 25:55-66; 25:204, 23:194, 22:81 | C | Waste and blur | As in view.md |
| V11 | STILL, and now harder to fix. fogLayer rebuilds 2,500 cells and calls putImageData every frame, and again for the minimap. v80 deleted fogT, the only fog change counter. | 22:141-157; 24:493,325 | K | Waste: the fog changes 3 times a second, the layer is rebuilt 60 | fogTick bumps G.fogV; fogLayer keys on it |

## 2. v80 changes in my files

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| S1 | The building shadow is NOT made once per kind (decision 14). Every building, every frame: 8 points built, sorted, a convex hull run, about 17 small arrays allocated. It is one path and one fill (with units and trees, same winding, so no holes). | 23:231-266, 283; fill 272/290 | C | Breaks the decision; GC churn about 20 allocations × buildings on screen | The swept box is always the same hexagon: take the 6 corners from sign(dx), sign(dy) (±w, ±d plus the shift). No hull, no arrays |
| S2 | The new shadow is bigger than the old one: the full footprint width, and the full L = h·cot(alt), capped at 3h (Town Center 44 → 132 units). The old one was a 0.66r-wide oval reaching about 0.83L. Same alpha (up to 0.33). B.h is the top of the roof, so a gable is cast as a full box. | 23:247-253, 186; CAST 23:169 | K | Works against "too long and dark" | Cap CAST.max lower (about 1.5) for boxes and/or cast at the eave height |
| S3 | A building site (prog < 1) casts the full building's shadow. sunShadows ignores prog. | 23:280-283 vs 23:53-83 | C | A staked-out plot throws a tower's shadow | h × (0.15 + 0.85·prog) when prog < 1, the same rise the site draw uses |
| S4 | Dark pop: when SHADE.a drops under 0.02 (dusk, night, storm, blizzard) the fill jumps from 0.02 to 0.18, so every building gets a dark footprint box and every unit a pool at once | 23:271, 179-181, 250 | C | Visible flicker at dusk and at weather changes | Fade the pool: alpha = max(SHADE.a, 0.18·(1-k)) with a smooth k, or drop the unlit pool |
| S5 | The shadow rectangle is unsheared, but the art is sheared right by d·SIDE. The shadow misses the east-wall overhang and shows a dark wedge at the back-left. | 23:254-261 vs 19:4,48-60 | S | Shape mismatch | Shear the rect's back corners by +d·SIDE |
| S6 | Units, trees, bushes and rocks keep the old oval, which still sticks out in front of the foot. The centre moves \|g\|·L/2 (\|g\| = TILT for north or south light), but the semi-axis is L/2 + r. So it reaches (1-\|g\|)L/2 + r ≈ 0.17L + r toward the viewer, and is 0.83L long north-south but 1.0L east-west. | 23:214-227 | C | The "shadow under and behind" is still there on everything but buildings | Semi-axis = hypot(SHADE.x, SHADE.y)·L/2 + r |
| S7 | No new game-state write or Math.random in the v80 view diff. The diff only removes the fogTick call and fogT. | diff 22, 23, 24 | C | Clean | none |

## 3. New

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | Glide: drawUnit treats a unit as walking only if mvT is under 0.15 s old, and pace comes from u.st.walk. moveTo sets both only when a step is over 0.3, i.e. over 9 units/s at DT 1/30. Siege (10-12), anyone in quicksand (×0.3), and villagers in mud + snow + carry (24 × 0.42 × 0.9 ≈ 9) fall under it. They slide in frame 0. | 23:749-761; 09-nav:659-665; 01:7 | C | Owner's sighting: units glide without stepping | Sim: step threshold `m > 0.3` → `m > 0.05` (09, not my file). Or view: moving = hyp(u.x-u.lx, u.y-u.ly) > 0.01 |
| N2 | Running deer and the dragon set mvT but never add to st.walk. pace is frozen, so they slide in one stride pose. | 14-sim-troops:413-450; 37-events:699-704; 23:751,756 | C | Frozen legs on fleeing game | Add the step length to u.st.walk there (or pace from a view-side odometer) |
| N3 | Units pushed apart, and the woodcutter lean, move with no mvT, so they slide in frame 0. Common in crowds at drop sites. | 16-sim-fight:147-176; 23:733-742 | K | Adds to the glide look | View odometer: walk += hyp(x-lx, y-ly) per drawn unit (WeakMap like LEAN) |
| N4 | Walk under buildings: a building sorts at b.y + 0.4·half, but its art leans its east wall d·SIDE (about 2.6·fp units) past the footprint into the lane. A unit in the east lane, behind the sort line, is drawn first and covered by the wall. | 21:275; 19:4,48-60 | K | Owner's sighting: units walk under buildings | Keep the art's east wall inside the footprint, or sort a unit with x > b.x + half after that building |
| N5 | The shadow pass runs after drawPicks, so shadows darken the pick rings | 21:264 vs 21:289 | K | Rings dim under shadows | Move drawPicks after sunShadows |
| N6 | Lightning that the simulation drops on enemy buildings is drawn (with its flash) after the fog, anywhere | 25:82-136; 36-economy:394 | S | Small fog leak | Skip the bolt when fogAt is 0 |

Counts: C 19, K 7, S 2 (28 rows). B1 fixed; every other prior finding still present.
