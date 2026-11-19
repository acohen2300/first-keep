# Draft 2: Trees [2026-11-19 11:21]

STATUS: DRAFT (Albert, Nov 19 11:20: "we are done with trees then. We have a new plan"). Not settled, not a go to build.

## Today (n73, seed 3982373520, sandbox times; his phone ran the ground ~6x faster)
- Forest built inside makeTerrain: a 3.25 m lattice, jittered, scored by four sine waves; the top 2,586 a corner. 7,967 trees laid.
- Then deleted: edge trees, rings round guarded finds, paths to finds (openWays, 88 ms), and the trade-road strip: 61 m each side, oaks spared, 5,042 of 7,654 felled (623 stamps, 4.6M tile visits, 237 ms). 2,612 left, 516,616 wood.
- makeThings 624 ms. Woods drawn into one screen-size sheet, repainted whole (53-62 ms) whenever a tree is first worked, the camera slides off it, zoom or leaf stage changes.
- Every tree 100 wood whatever its drawn size (0.85-1.15). Sight assumes 500 stems/ha (D361), the woods hold about 950. Tool research +10/+15/+15/+15%, no source.

## His rulings
1. Road strip: use the real rule (11:15 "Is there a real world math...", 11:17). The Statute of Winchester 1285 clears woods, bushes and dykes 200 ft each side so robbers cannot lurk, but spares oak, ash and great trees, "so as it shall be clear underneath". So: keep the trees in the strip; the strip is not ambush cover or hiding ground. "Great trees" by size once wood follows size. (CONFIRM the reading; asked 11:15.)
2. A tree holds four villagers: kept (11:15 "Yes 4").
3. Wood follows size: yes if possible (11:15). Wood = treeWood x size^3 (V = f x g x h).
4. Plant once (11:17 "there will be less to delete"): one "trees can't grow here" mask first (water, edge, home, glades, paths, roads, find rings), then plant; no delete passes. The strip found by one distance pass.
5. Bake the woods once, edit on touch (11:18): woods in 32 x 32 tile squares on the ground's square grid; a touched tree repaints its square and the one below; squares reused when panning; leaf stages repainted a few squares a frame; only squares near the screen kept; fixed zoom levels.
6. Randomized each game by the seed (11:20).

## Proposed with them (not ruled)
- Forest placed by nature: the ground draft's wetness index, slope and height (willow, birch by water; conifers on hills), a fixed count a corner for fairness.
- One trunk density for drawing and sight.
- Tools from sources: stone to bronze the big jump; bronze about as good as steel (Mathieu & Meyer 1997, Penn Museum); saw about 1.9x the axe (ILO 1978: thinning 100 stems, axe ~17 h, bow saw ~9 h, chainsaw ~4 h). Stone-to-bronze ratio not found (Saraydar & Shimada 1971 not opened).
- One time rule (a game second = real time) before any real rate means anything; covers digging in Draft 1 too.

## The math (opened)
- Stem volume V = f x basal area x height, f 0.5 (quadratic paraboloid), ANU Fenner School mensuration. 100 wood = 100 kg at 600 kg/m3 (W12) = 0.167 m3 = a 10 m tree (W25) about 21 cm across.
- Density about 950/ha: a dense young stand; least-disturbed oak coppice measured over 1,000 on the stand density index (J. For. Res. 2019, s11676-019-01063-z).
- Woodcutters at Greenwood Furnace, PA: about two cords a day each; a cord about 1.4 t (Thunder Said Energy).
- Manual felling crews: two cutters on a crosscut (FAO Y3061E).
- Statute of Winchester 1285, ch. 5 (statutes.org.uk; british-history.ac.uk).

## Expected
- Better: the forest kept (about 3x), real rules, one home for the no-trees rule.
- Cheaper but modest: about 330 ms off map making (~55 ms phone); a tree touch from a whole repaint (~10 ms phone) to about 1 ms. More trees cost more first paint and memory.
- Not shown: that trees are a phone heat or speed problem. Proof before build: the ?fps meter with woods repaint times, 10 villagers chopping a minute.
