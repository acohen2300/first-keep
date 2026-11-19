# Draft 1: The ground — nature-made land [2026-11-19 11:05]

STATUS: DRAFT (Albert, Nov 19 11:04: "Put it on the draft section"). He thinks it is the better concept; not settled, not a go to build. Next element: trees.

Why: the element-by-element audit started with the ground (Albert, 08:47). Today's ground is one height map (good) with four made-up water rules, three distance grids, the forest built inside it, ~75 typed numbers and ~30 numbers with no unit. Mock comparing today with the nature version: https://claude.ai/artifact/GRkcE1ZGeejUgzQaczHsDx (16 seeds captured from n73; nothing in the game changed).

## His rulings and ideas (in order)
1. Use the nature version: the seed makes the land's shape; water follows it once, at map creation (09:10, "If we did this to the whole map"). Whole map, not wilds only.
2. Flat land is made, as in real life: villagers grade land before building (09:16).
3. The corners are plains, and the home pocket is land graded ahead of time by the same rule (09:16, 09:21: "It's not a choice until later – the home pocket is a plain").
4. Two ways to build off the pocket (09:19): graded (longer, cheaper, more stable) or ungraded on piers (faster, more expensive, fewer hit points). Penalties proportional to the unevenness (09:21 "Yes proportional"). Too steep: no building (09:21 "Fair").
5. Armies can target the piers of an ungraded building (09:21).
6. Research and the Siege workshop make grading faster; the Pioneer grades (09:19; Pioneer as grader, Claude's suggestion, his "yes" implied by 2 — CONFIRM).
7. Only real numbers and math (09:21).
8. Gold, iron, stone and berries need no flat land (09:16).
9. Rivers: a path / bridge concept (09:16); then (09:29) the grading mechanism fills shallow water into a causeway ("Why not"). Bridges for deep water, later.
10. Sight on hills belongs to the line-of-sight element, not the ground (09:16).
11. Notebook (09:25): research for land development, cheaper and faster; earth moved first by hand, then animal, then machine, scaling with the ages (use history); excavation may uncover mines (needs a real rate, else parked); tech to reinforce piers: concrete and stone masonry.
12. The home pond is a cove: the ocean comes in through a narrow channel into the edge of the pocket, the same at every corner (sketch 09:27). Salt water (09:29); sea fish already exist.

## The math (sources from memory; each to be opened and cited before it enters a book)
- Land shape: fractal relief (fBm), seeded.
- Lakes: hollows filled to their spill point (Priority-Flood, Barnes, Lehman & Mulla 2014).
- Flow: each cell drains to its steepest/reaching neighbour; flow accumulation A.
- Rivers start where a·S² > C (Montgomery & Dietrich 1988); width ∝ √A (Leopold & Maddock 1953).
- Marsh where ln(a / tan β) is high (Beven & Kirkby 1979). Already computed in the meadow code (makeSoil).
- Grading: earth = cut + fill under the footprint; time = earth ÷ (workers × digging rate by age: hand, animal, treadwheel). Rate to source.
- Ungraded: extra material and hit-point loss ∝ earth not moved. HP loss is the hardest to source; no number until one is found.
- Causeway: fill volume of shallow water, same rate; a depth limit.
- Seawater freezes at about −1.9 °C.

## Open (his calls or checks)
- The Pioneer as the grader: confirm.
- Uncovering ore while grading: only with a real rate.
- "Land shape" on the notebook page: meaning not read.
- Checks: redraw of a graded patch mid-game; how saves store the map; a sweep of a few hundred seeds before any setting is locked; the map tests compared with Mid go stale.
- Machines: powered diggers are 19th century, after the Gunpowder age; "machine" in game = treadwheels and winches.

## Findings after the rulings (Nov 19, 09:40 to 11:00) [2026-11-19 11:05]
- Real thresholds put in the mock (sources opened): channel head A·S^1.27 ≥ 380, A in m² (Jefferson & McGee 2013, 100 channel heads, forested North Carolina Piedmont); marsh where ln(a/tan β) > 10.5 (Qiu, Lyon & Creveling 2020, matched to the FEMA floodplain, New Jersey); Priority-Flood (Barnes, Lehman & Mulla 2014, Computers & Geosciences 62:117-127); w = aQ^b, b ≈ 0.5 (Leopold & Maddock 1953, USGS PP 252); seawater freezes at about −1.9 °C at salinity 35 (Fujino et al. 1974 table). Hand digging 1 to 3 m³ a worker-day (labour productivity tables); 1870s navvies about 14 m³ of clay a shift (Sullivan, Victorian Web). Draft-animal rate: not found. Ore uncovered while grading: no real rate, OUT (his rule).
- Mock with his design: https://claude.ai/artifact/GRkcE1ZGeejUgzQaczHsDx (16 seeds from n73). At roughness 10: water 3.2 to 9.2% of the land (today 1.6 to 3.7%), river 1,224 to 3,347 tiles, marsh about 2.7%; grading one pocket 400 to 600 m³ (150 to 600 worker-days by hand).
- The ground's real cost is its picture, not its water rules: renderGround traces 156,816 tiles as outlines (70k fills, 54k strokes, 419k points) into 34 shapes. makeTerrain (all water, hills, forest) is 72 ms of it.
- Baked ground (painted in chunks, a background worker for close-ups) built as a test: preview https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n73-baked/ (#old in the same build). On Claude's slow test machine 0.8 s against 2.2 s. On Albert's phone the OLD ground builds in 406 ms (his screenshot, 10:55): the speed gain is small there; baking earns its place only with this land design. Gaps in the bake: cliff faces, water level with the land, roads drawn from tile marks (thin), a green line on some lake edges, a moment's blur on new chunks.
- Proven: real science for every rule, fewer rules, a natural look, the bake runs in the real game on his phone. Not proven: that it plays better, fairness over hundreds of seeds, building on slopes, net code, speed with rolling land on his phone.
- If adopted, in order: the seed sweep; the one "flat enough" grading rule; a playable preview he plays before it replaces today's ground.
