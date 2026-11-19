# Draft 4: The rest of the land (grass, dirt, ice, snow, rock, fish, roads) [2026-11-19 12:10]

STATUS: AUDIT ONLY (Albert, Nov 19 12:00: "can you audit them? Math, code hygiene, optimization, one home... let's wrap up this section"). Nothing ruled. n73 code, sandbox times (his phone about 6x faster).

## Across the group
- Per frame this group costs almost nothing: the ground is drawn once and kept (drawGround 5.7 ms over 10 s); footing 27 ms over 10 s (15,532 calls). The frame's 7 ms (sandbox) is spent elsewhere (units).
- At map creation: makeSoil 152 ms; makeThings 607-654 ms (roads and trees, Draft 2).
- The measure book: 341 entries; 103 cite N112 "Design: v100 floors, Nov 4 (Albert to confirm)"; 139 have unit "unset".
- 32 places make a full-map grid (12 Float32, 12 Uint8, 6 Int32, 2 Float64), up to about 15 MB if all were live.

## 1. Grass (the meadow)  MATH: REAL
- D353: octave relief (Mandelbrot 1982), wetness index (Beven & Kirkby 1979), green-up (Zhang et al. 2003), flowers in clusters (Matern 1960), wet soil darker (Lobell & Asner 2002). All marked opened.
- Wrong: the wetness index is worked out here (MTWI, makeSoil) and would be worked out again by Draft 1 (marsh, rivers) and Draft 2 (forest). One home: work it out once with the land, everyone reads it.
- Design, not math: the blades (D366 blade), light and shadow numbers. Fine as looks; say so in the book.

## 2. Dirt (wear, ruts, scars, mud)  MATH: PART
- Real: topsoil gives way past its precompression stress (G12; Horn & Fleige 2003, Weaver & Dale 1978).
- Not real: mud's friction (G6): its own citation N105 says "no measured value found; set between grass and snow". Grass friction (G5) is a car tyre on dry grass, "the nearest measured pair".
- Not real: scar sizes (D299): bare lists of numbers from Mid, no units, e.g. burn [1.05,0.8,0.6,5,1.3,0.37,0.2,3,2].
- One home broken: mud's cost to walk sits in three entries (D106 walkCost 0.8, G6 mu and grip, D pace.sink). "soil" is the key of two unlike things (G12 topsoil strength, D214 a field's fertility).

## 3. Ice and snow  MATH: REAL, TWO HOMES
- Real: lake ice by Stefan's law, load by Gold's formula (D350; N262, N263 opened); snow drift lognormal (Liston 2004); friction on ice and snow (Bowden & Hughes 1939).
- Wrong: ice has two models: lake ice in degree-days by Stefan (D350), ground ice by Mid's rule in degree-seconds (D225, fdd 500). One physics, two homes, two units. Fold ground ice into Stefan.
- Not real: the seasons' mean air (D100 [10,22,12,-6]), snowfall 0.03 a second (D107): N112, unit unset.
- Depends on Draft 3: degree-days use the day (D20, 240 s). When the clocks are ruled, ice must be re-timed.

## 4. Rocks, crevices, hills, cliffs  MATH: NONE
- All design: how many (rocks 6-12, crevices 2-4, hills 4-8), radius, height 18, crevice floor 13, cliff 4, beach 80: N112, unit unset.
- On the test map: 152 rock tiles and 114 crevice tiles of 156,816 (0.17%). Almost nothing on the map for two blocks of code (E36, E37) in makeTerrain.
- Under Draft 1 the land's own shape gives hills; steep ground would be the rock face. Then rocks and crevices as stamped shapes can go (log in PARKED if cut).

## 5. Fish  MATH: REAL LAW, DESIGN AMOUNTS
- Real: regrowth by the logistic law (Verhulst 1838; Schaefer 1954), D378 r 0.5 a year.
- Design: 875 a spot (Mid's 350 x 2.5), spacing, 237 spots.
- Wrong: laid in three separate loops inside makeThings (lakes, rivers, sea): one rule (a spot every so far along any waterline) would do.
- Depends on Draft 3: fish regrow once a year, each spring. The year's length is their clock.

## 6. Trade roads  MATH: REAL
- Real: width from the Twelve Tables (8 ft); least-cost path (Dijkstra 1959; A* 1968); the Statute of Winchester strip (now read right, Draft 2).
- Wrong: laid inside makeThings; the strip's 623 stamps cost 237 ms (gone with Draft 2's ruling).
- To check: D46 "a road's clear half-width" 50 and laneDist are still read (3 and 4 places) though the corner lanes were removed Nov 14 (D345). Likely a leftover.

## Proposed clean-up (not ruled)
1. Wetness index: one home, worked out once with the land.
2. Ice: one model (Stefan), ground ice folded in.
3. Mud walking: one entry. Rename one "soil".
4. Rocks and crevices: drop the stamped shapes under Draft 1 (PARKED).
5. Fish: one placing rule. Roads and fish out of makeThings into their own makers.
6. Not-real numbers marked as such in the book: mud and grass friction, scar sizes, season temperatures, snowfall. Sources to find: boot-on-mud friction, climate normals for the temperatures.
7. Re-time ice and fish when Draft 3 is ruled.
