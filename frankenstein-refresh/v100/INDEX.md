# First Keep v100 · 1. the Index

Written by `index.py` from `books/*.js`, never by hand: every entry of every book by its code, and the codes it cites.

## angles

| Code | Name | Value | Cited |
|---|---|---|---|
| A1 | the grid's turn on the screen | 15 | N90 |
| A2 | the camera's rise over the ground | 41 | N91 |
| A3 | the angle of repose, dry sand: steeper is a face, not a slope | 34 | N64 |

## capabilities

| Code | Name | Value | Cited |
|---|---|---|---|
| SC0 | what every shell has: a name, its ticks, its citation | {by: every book of shells, law: [], needs: [name, ticks, cite], may: [layer]} | N92 |
| SC01 | the mold of a find (layer 100) | {by: shells (finds), law: [], needs: [find, look], may: [room, sound]} | N92 |
| SC02 | the mold of a building (layer 110) | {by: shells (buildings), law: [], needs: [size, style, look, material], may: []} | N92 |
| SC03 | the mold of a walker (layer 120) | {by: shells (units, moveables), law: [], needs: [look, pace, body], may: []} | N92 |
| SC04 | the mold of a page (the Screen book) | {by: books/screen.js, law: [], needs: [], may: [rows]} | N93 |
| SC1 | walks the tiles at its pace | {by: index.html floor 5: step, findPath, law: [QBL, QBM, QBU], needs: [pace, body], may: [mount, kit, voice]} | N94 |
| SC2 | works a find and fills a load; also counts it among the people | {by: econ.js, law: [QBN, QW], needs: [body], may: []} | N95 |
| SC3 | takes a load to the nearest drop-off of its side | {by: econ.js, law: [QBN], needs: [body], may: []} | N95 |
| SC4 | raises a site | {by: econ.js, law: [QAC], needs: [body], may: []} | N95 |
| SC5 | mends a hurt building | {by: econ.js, law: [QAC], needs: [body], may: []} | N95 |
| SC6 | strikes; without Gather it is a soldier; a wild one with it bites | {by: combat.js, law: [QBO, QAG, QBT], needs: [D138], may: []} | N96 |
| SC7 | looses at range (a building that shoots reads D143) | {by: combat.js, law: [QAL], needs: [D143/D138], may: []} | N96 |
| SC8 | has health, and sways when badly hurt | {by: combat.js, index.html, law: [QBS], needs: [D138/D139], may: []} | N97 |
| SC9 | wanders when idle (a Poisson wait) | {by: index.html step, law: [QM], needs: [pace], may: []} | N94 |
| SC10 | can be hunted | {by: menu.js (hunting not built yet), law: [], needs: [], may: []} | N94 |
| SC11 | a side's seat: the game opens on it, and a side falls with its last | {by: econ.js, ai.js, menu.js, law: [QBW], needs: [], may: []} | N95 |
| SC12 | takes in the yields its row lists | {by: index.html dropFor, ai.js, law: [QBN], needs: [drop], may: []} | N98 |
| SC13 | trains the units D133 gives it | {by: econ.js, law: [], needs: [D133], may: []} | N95 |
| SC14 | houses the people D127 gives it | {by: econ.js, ai.js, law: [], needs: [D127], may: []} | N95 |
| SC15 | where the ages are reached | {by: menu.js, econ.js, law: [], needs: [], may: []} | N95 |
| SC16 | a building that yields, at the rate its row points to | {by: econ.js, ai.js, law: [QBN], needs: [yield, rate], may: []} | N95 |
| SC17 | a find: holds an amount of a yield | {by: econ.js, law: [QBN], needs: [yield, amount], may: []} | N99 |
| SC18 | scouts (not built yet) | {by: waiting, law: [], needs: [], may: []} | N100 |
| SC19 | trades (not built yet) | {by: waiting, law: [], needs: [], may: []} | N100 |
| SC20 | a page that keeps its own height (the Town Center, the Start page); every other page shares the tallest of the rest | {by: menu.js, law: [], needs: [], may: []} | N101 |

## citations

| Code | Name | Value | Cited |
|---|---|---|---|
| N1 |  | Spherical astronomy, the altitude formula (standard) | opened |
| N2 |  | Meeus, Astronomical Algorithms, 2nd ed. (1998) | opened |
| N3 |  | JPL, Approximate Positions of the Planets (1800–2050) | opened |
| N4 |  | Mallama & Hilton (2018), colour indices | opened |
| N5 |  | Ballesteros (2012), colour index to temperature | opened |
| N6 |  | (retired: satellites cut, Stone Age) | opened |
| N7 |  | Gabriel & Neumann (1962), QJRMS 88 | opened |
| N8 |  | Jennings, Winchell, Livneh & Molotch (2018), Nature Communications 9:1148 | opened |
| N9 |  | Atlas, Srivastava & Sekhon (1973); Gunn & Kinzer (1949) | opened |
| N10 |  | Koschmieder (1924) | opened |
| N11 |  | WCAG 2.3.1, three flashes | opened |
| N12 |  | Poisson (1837); Feller, An Introduction to Probability Theory, vol. 1 | opened |
| N13 |  | Pandolf, Givoni & Goldman (1977) | opened |
| N14 |  | Hock (2003), degree-day melt | opened |
| N15 |  | US Army Corps of Engineers (1956), Snow Hydrology | opened |
| N16 |  | First-order lag (standard); Cukjati, Reberšek & Miklavčič (2001) | opened |
| N17 |  | Stefan (1891) | opened |
| N18 |  | Bowden & Hughes (1939), friction on ice and snow | opened |
| N19 |  | Hanson et al. (1999), slip and the grip a step needs | opened |
| N20 |  | Bekker (1960), Off-the-Road Locomotion: pressure–sinkage p = (kc/b + kφ) zⁿ; Wong, Theory of Ground Vehicles (multi-pass) — from memory, to  | to open |
| N21 |  | Rothermel (1972); USDA RMRS-GTR-371 | opened |
| N22 |  | Heskestad (1984); NFPA 72, the t² fire | opened |
| N23 |  | Holling (1959), Can. Entomol. 91 | opened |
| N24 |  | Charnov (1976), Theor. Pop. Biol. 9 | opened |
| N25 |  | Fretwell & Lucas (1970) | opened |
| N26 |  | Sutherland (1983) | opened |
| N27 |  | Verhulst (1838) | opened |
| N28 |  | Schaefer (1954) | opened |
| N29 |  | White (1962), Medieval Technology and Social Change: three-field rotation raised the sown share from 1/2 to 2/3 — from memory; Rothamsted Br | to open |
| N30 |  | Wright (1936), learning curve | opened |
| N31 |  | Thomas & Smith (1990), overmanning | opened |
| N32 |  | Labuza, first-order food loss | opened |
| N33 |  | FAO, Grain storage techniques, ch. 6 | opened |
| N34 |  | Andreyeva, Long & Brownell (2010), food price elasticities | opened |
| N35 |  | Lanchester (1916), Aircraft in Warfare | opened |
| N36 |  | Churchill, Saffidine & Buro (2012), AIIDE | opened |
| N37 |  | Cox & Smith (1961), Queues | opened |
| N38 |  | Maynard Smith & Price (1973), hawk–dove | opened |
| N39 |  | Projectile motion from a height (standard) | opened |
| N40 |  | Drag on a sphere (standard fluid dynamics) | opened |
| N41 |  | Horizon from a height, √(2Rh) (standard) | opened |
| N42 |  | Bresenham (1965), grid line | opened |
| N43 |  | Pulliam (1973) | opened |
| N44 |  | Lima (1995) | opened |
| N45 |  | Ydenberg & Dill (1986) | opened |
| N46 |  | Thermal resistance in series (standard) | opened |
| N47 |  | Kermack & McKendrick (1927), Proc. R. Soc. A 115 | opened |
| N48 |  | Bootsma & Ferguson (2007), PNAS 104(18) | opened |
| N49 |  | Goldberg (1989), roulette-wheel selection | opened |
| N50 |  | Hertz (1882), contact | opened |
| N51 |  | Auerbach (1891), crack threshold | opened |
| N52 |  | Weibull (1951), strength by size | opened |
| N53 |  | Plane geometry, shadow length | opened |
| N54 |  | Black-body colour; inverse-square light | opened |
| N55 |  | Briggs (1969), plume rise | opened |
| N56 |  | Pasquill–Gifford dispersion | opened |
| N57 |  | Damped harmonic oscillator (standard) | opened |
| N58 |  | ISO 9613-2, sound outdoors | opened |
| N59 |  | Klatzky, Pai & Krotkov (2000), Presence 9 | opened |
| N60 |  | Mandelbrot (1967), Science 156 | opened |
| N61 |  | Downing et al. (2006), lake sizes | opened |
| N62 |  | Leopold & Maddock (1953), USGS Paper 252 | opened |
| N63 |  | Hutchinson (1957), shoreline development | opened |
| N64 |  | Angle of repose, dry sand about 34° (Al-Hashemi & Al-Amoudi 2018, Powder Technology 330, a review; from memory, to open) | to open |
| N65 |  | Ettinger (2017), Mulberry32, a 32-bit generator; the seed of the day is the game's own rule | opened |
| N66 |  | Parallel (dimetric) projection; the classic turned-view RTS draws the ground at 2:1, a camera 30° over the ground (from memory: Age of Empir | to open |
| N67 |  | Wave refraction on an indented coast: energy converges on headlands, diverges in bays (coastal geomorphology, standard; Bird, Coastal Geomor | to open |
| N68 |  | Towns and roads at fords: Oxford, Frankfurt (Franconofurd, the Franks' ford), Bedford; the record, from memory | to open |
| N69 |  | Age of Empires II (1999), the genre's prices and amounts: the second age 500 food, a villager 50 food, a house 25 wood, the mill and the lum | to open |
| N70 |  | First Keep Build 42 (Oct 28), the old game's own gathering rates a second: berries 0.9, trees 0.75, gold 0.6, stone 0.55, iron 0.5 (its time | opened |
| N71 |  | Bohannon (1997), Age and Ageing 26: comfortable walking speed about 1.4 m/s (from memory, to open) | to open |
| N72 |  | Horse gaits: walk about 1.7 m/s, trot about 3.6 m/s (standard equine, from memory) | to open |
| N73 |  | Travel speeds of deer, wolf and bear at a walk or trot (natural history, standard; from memory, to open) | to open |
| N74 |  | Hart, Nilsson & Raphael (1968), IEEE Trans. SSC 4: A* | opened |
| N75 |  | First Keep Build 42 (Oct 28), the old game's SCORE: unit 5, bld 5, tech 5, wealth 10 (its weights, kept) | opened |
| N76 |  | Dupuy (1987), Understanding War: forces break at losses well short of annihilation; the classic breakpoint near 30% (from memory, to open) | to open |
| N77 |  | Ranger Medic Handbook (2025), p. 45, the classes of haemorrhagic shock: I up to 15% blood lost, slightly anxious; II 15–30%, mildly anxious; | opened |
| N78 |  | FBI Academy, Handgun Wounding Factors and Effectiveness (Patrick, 1989): short of a hit to the brain or upper spinal cord, a wounded man is  | opened |
| N79 |  | NAVMC 2691, Marine Corps Drill and Ceremonies Manual: quick time is 120 steps a minute at 30 inches a step (3.4 mph, 1.52 m/s); summary open | opened |
| N80 |  | Winter (1995), Human balance and posture control during standing and walking, Gait & Posture 3: quiet standing as an inverted pendulum; the  | to open |
| N81 |  | Engineering ToolBox, Friction coefficients for common materials: rubber on dry concrete 0.6–0.85, on wet 0.45–0.75; car tyre on dry grass 0. | opened |
| N82 |  | Conservation of momentum; the perfectly inelastic collision v = m₁v₁ / (m₁ + m₂) (standard mechanics) | opened |
| N83 |  | Sliding to rest under Coulomb friction: d = v² / (2 μ g) (standard mechanics) | opened |
| N84 |  | ICRP Publication 23 (1975), Reference Man: 70 kg (from memory, to open) | to open |
| N85 |  | Masses of animals and arms: horse about 500 kg, deer 70, wolf 40, bear 200; spear 2.5 kg, shield 5, scale armour 12, lance 4; strides and bl | to open |
| N86 |  | Rossing, The Science of Sound: the modes of a free bar at 1 : 2.756 : 5.404 (from memory, to open; carried from Base) | to open |
| N87 |  | Densities: timber about 600 kg/m³, stone about 2,400, iron 7,870 (standard tables, from memory, to open) | to open |
| N88 |  | Fresh snow is porous and absorbs sound, high frequencies most: a snowy landscape sounds muffled (acoustics of snow, from memory, to open) | to open |
| N89 |  | National Weather Service, Understanding Lightning: Thunder (weather.gov/safety/lightning-science-thunder): thunder can be heard only about 1 | opened |
| N90 |  | Design: Albert, Nov 4 (the turned grid, \B\) | opened |
| N91 |  | Design: Albert, Nov 5: matched to Base's squash of 0.66 (sin 41.3°), the look he played and liked | opened |
| N92 |  | Design: Albert, Nov 5 (the mold) | opened |
| N93 |  | Design: Albert, Nov 5 (menus are shells) | opened |
| N94 |  | Design: v100 floor 5, Nov 4 | opened |
| N95 |  | Design: v100 floor 9, Nov 5 | opened |
| N96 |  | Design: v100 floor 10, Nov 5 | opened |
| N97 |  | Design, Nov 5 | opened |
| N98 |  | Design: v100 floor 4, Nov 4 | opened |
| N99 |  | Design: v100 floor 3, Nov 4 | opened |
| N100 |  | Design: dictionary SC | opened |
| N101 |  | Design: Albert, Nov 5 07:35 | opened |
| N102 |  | Design: v100 floor 1, Nov 4 | opened |
| N103 |  | Design: v100, Nov 4 | opened |
| N104 |  | N81 (car tyre on dry grass, 0.35: the nearest measured pair) | opened |
| N105 |  | Design, Nov 5: no measured value found; set between grass and snow | opened |
| N106 |  | N81 (waxed wood on wet snow, 0.14 static) | opened |
| N107 |  | N81 (ice on ice, 0.1 static) | opened |
| N108 |  | N84 (70 kg) | opened |
| N109 |  | N79 (stride: two steps of 30 in) | opened |
| N110 |  | N80 (centre of mass 0.55 of height; foot) | opened |
| N111 |  | Design, Nov 5: a timber engine about 1.7 m³ (W12 × volume); stride a wheel's turn | opened |
| N112 |  | Design: v100 floors, Nov 4 (Albert to confirm) | opened |
| N113 |  | Design: the figures' four-frame walk (preview 49) | opened |
| N114 |  | Design: v100 floors, Nov 5 (Albert to confirm) | opened |
| N115 |  | Design: Albert, Nov 5 (his screenshot of Base) | opened |
| N116 |  | Design: the juice pass of Nov 3 (Base: 2 px, 0.08 s) | opened |
| N117 |  | Standard gravity (standard) | opened |
| N118 |  | Design: the build log (README) | opened |
| N119 |  | Design: Albert, Nov 1 14:18 (the old game's START_RES: 200 of food, wood, stone and gold, no iron) | opened |
| N120 |  | Design: the computer of floor 11, Nov 5 (were typed in ai.js; moved to the book, Build A) | opened |
| N121 |  | Design: v100 floor 5, Nov 4 (deer herds D90–D91, wolf packs D92–D93) | opened |
| N122 |  | Design: Mid's BEAT (numbers.js), brought by Albert's yes, Nov 5 11:40 (Frankenstein F10) | opened |
| N123 |  | Design: Mid's UG (15-sim-spatial.js), brought by Albert's yes, Nov 5 11:40 (Frankenstein F10) | opened |
| N124 |  | Design: Mid's SGC (15-sim-spatial.js), brought by Albert's yes, Nov 5 11:40 (Frankenstein F10) | opened |
| N125 |  | Design: Albert's randomizer rule, Nov 5 (Frankenstein F10): no Math.random in the world, looks included | opened |
| N126 |  | Design: Albert, Nov 5 (the gate) | opened |
| N127 |  | Design: the audit of Nov 5, Build A: a test for each fix | opened |
| N128 |  | Design: Albert, Nov 5 (Frankenstein Refresh: map Mid with our tests) | opened |
| N129 |  | Design: Albert, Nov 5 (Frankenstein Refresh: delete nothing; prove it) | opened |
| N130 |  | Design: Albert, Nov 5 09:49 (Frankenstein 4: the match test) | opened |
| N131 |  | Design: Albert, Nov 5 09:47 (sort every piece) | opened |
| N132 |  | Design: Albert, Nov 5 11:40 (Frankenstein F10) | opened |
| N133 |  | Design: Albert, the Rank Ribbon (Oct 30) and the Formation | opened |
| N134 |  | Design: Albert, Nov 5 07:13–07:15 (his Land list; six tabs of up to nine) | opened |
| N135 |  | Design: Albert, Nov 5 07:30 | opened |
| N136 |  | Design: Albert, Nov 5 07:30 (the Inspector precedent) | opened |
| N137 |  | Design: Albert's Build 30 top bar | opened |
| N138 |  | Design: Albert, Nov 5 07:36 | opened |
| N139 |  | Design: Albert, Nov 4 (the setup screen its own height) | opened |
| N140 |  | Design: Albert, Nov 5 | opened |
| N141 |  | Design: Albert, Nov 5 07:34 | opened |
| N142 |  | Design: v100 floor 8, Nov 5 | opened |
| N143 |  | Design: Albert, Nov 5 10:28 (Tall for the volume row: keep for now) | opened |
| N144 |  | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) | opened |
| N145 |  | Art: Base | opened |
| N146 |  | Art: Mid (35-sound.js), Nov 5 | opened |
| N147 |  | Art: Base (the juice pass, Nov 3) | opened |
| N148 |  | Design: Apple's ambient audio session for games, carried from Mid (35-sound.js) | opened |
| N149 |  | Design: Albert, Nov 5 09:47 (three volumes) | opened |
| N150 |  | Art: preview 49 (18-figures.js), the last build before the camera turn | opened |
| N151 |  | Art: preview 49 (19-building-art.js) | opened |
| N152 |  | Art: preview 49 | opened |
| N153 |  | Design: Albert, Nov 5 12:21: comments in their own book, by letter code; five pages: 1 Index, 2 Citations, 3 Index and Citations, 4 Comments | opened |
| N154 |  | Design: Albert, Nov 5 11:40: research stacks and its percents add, applied once to the base (3.0 with +10% and +8% is 3.0 × 1.18 = 3.54, not | opened |
| N155 |  | Design: Albert, Nov 5 11:16 (3) and (4): walking's base is 3.4 mph and research improves it; building-health research is a share on top of v | opened |
| N156 |  | Design: Mid's effects (08-core.js fxList, fxFits, fxv, keepHealth, rehealth, stats, maxHpB; 11-orders.js scaled, unitCost, techCost), brough | opened |
| N157 |  | Design: Mid's battle odds (08-core.js unitPower, powerOf, lanchester; 17-ai.js powerFrom, estPower, matchup; 36-economy.js oddsOf) with its  | opened |

## colours

| Code | Name | Value | Cited |
|---|---|---|---|
| C1 | Water | #2a6488 | N102 |
| C2 | Sand | #cdbb88 | N102 |
| C3 | Dirt | #785c3a | N102 |
| C4 | Grass | #4a6634 | N102 |
| C5 | Ring blue, the player | #6aaeff | N103 |
| C6 | Ring green | #5fd08a | N103 |
| C7 | Ring red | #ff6b5b | N103 |
| C8 | Ring white | #ece5d3 | N103 |
| C10 | Gold (on) | #e6b947 | N103 |

## comments

| Code | Name | Value | Cited |
|---|---|---|---|
| E1 |  | First Keep v100 · the world reads its numbers from the Books (books/*.js), never from here: one home each. |  |
| E2 |  | A Book entry is { key, value, name, cite, law } under its code; the game sees each book as one object by key (D, A, C, W, G), and a shell's  |  |
| E3 |  | every code in every book |  |
| E4 |  | a slot's pointer, read |  |
| E5 |  | S the shells (books/shells.js): a row names its layer, ticks its capabilities (SC) and points each slot at a book. has() is the one way the  |  |
| E6 |  | The frames (QBD). The grid is square in its own frame; the board frame is the grid turned A1 about the site's middle; the view foreshortens  |  |
| E7 |  | QBE: the most a tile may step up or down over its own width and still be a slope |  |
| E8 |  | QBK the art frame: a building is painted with its front along x and sheared by SKEW so that edge follows the grid; its depth is ART_T a unit |  |
| E9 |  | QBF the dice (N65): one seed, Mulberry32. Every roll names Who, What, Where, When, Why and How beside it (L13). |  |
| E10 |  | two streams from the map's seed, dealt fresh at makeUnits: the rules' (M1), so the same seed plays the same game, and the looks' (D187), so  |  |
| E11 |  | QAZ a fractal line (N60): K waves, the k-th of amplitude k^(−H), H = 2 − Dim; a coast's Dim is about 1.25. Returns a function of the way alo |  |
| E12 |  | QAZ as a surface: K plane waves in rolled directions, the same amplitudes; scale is the longest wave in units. Returns a function of (x, y)  |  |
| E13 |  | The coast (L2 Cut at the board's edge; L4 Edge). Where it stands out it is a headland and a cliff, where it bends in a bay and a beach (QBG) |  |
| E14 |  | The roll: Who the map · What how far the coast wanders in and out · Where the coast only; within D5 of every corner the same wander (L12), f |  |
| E15 |  | pos: the way along the side from its start; returns [wander, cliffness] |  |
| E16 |  | −1 bay to 1 headland |  |
| E17 |  | The ground: one height a tile. Depth is the way in from the coast (negative at sea). Land stands at D13; a beach falls to the water over D16 |  |
| E18 |  | height, depth from the coast, the four drawn corner heights, the forest floor |  |
| E19 |  | marsh (TW1): always wet (KI1) |  |
| E20 |  | the way in from the coast at a board point, and the coast's cliffness there |  |
| E21 |  | the drawn corners (QBE): at every grid corner the tiles round it are sorted by height and split where a step passes the angle of repose; eac |  |
| E22 |  | Floor 2, terrain (layer 90): every piece is a Cut or a Raise on the one height field (L2, L3); the layer that shows follows (L1), a step pas |  |
| E23 |  | a spot in a corner's own frame (u along one edge, v along the other), the same in all four (L12) |  |
| E24 |  | the four roads: corner to middle |  |
| E25 |  | every tile whose middle lies within r of a board point: fn(k, d, dx, dy) |  |
| E26 |  | a lake: a bowl (deep at the middle, D27) inside a fractal shore (QAZ, D28); where the land stands out into it the shore is a face, where it  |  |
| E27 |  | a wandering line (QAZ) from a to b, pinned at both ends; null when any point fails ok |  |
| E28 |  | a channel: discs along a line; w the half-width, deep the bed; the bank falls over D32 |  |
| E29 |  | a smooth hill: its steepest slope is 0.77 h / r, under the angle of repose at these numbers |  |
| E30 |  | The home pond: Who every corner · What one small lake · Where Z3, the same spot in each corner's own frame (D51, D52, L12) · When the map is |  |
| E31 |  | Lakes: Who the map · What their number, size and place · Where Z4, off the roads and the middle, inside the play edge · When the map is made |  |
| E32 |  | Rivers: Who the map · What one from each lake big enough, to the nearest free coast · Where Z4 only; a river never enters a home (L12) · Whe |  |
| E33 |  | Fords (TC4): Who every river · What a shallow crossing · Where wherever a river crosses one of the four roads, and once more at a rolled spo |  |
| E34 |  | Hills (TR1): Who the map · What a few smooth rises · Where Z4, clear of water and roads · When the map is made · Why high ground to hold and |  |
| E35 |  | Streams (TC3): Who each hill · What a thin, wadeable run to the nearest lake · Where Z4 · When with the hills · Why water springs where grou |  |
| E36 |  | Rock (TR2): Who the map · What outcrops nothing walks over or through · Where Z4, on dry land, off the roads · When the map is made · Why co |  |
| E37 |  | Crevices (TC5): Who the map · What a dry trench nothing crosses · Where Z4, off the roads and water · When the map is made · Why a line that |  |
| E38 |  | Forest (TF1): Who the map · What where the trees grow (the trees themselves come on floor 3) · Where a wall round every home at D50 with the |  |
| E39 |  | the wood's edge keeps one tile from any slope or water |  |
| E40 |  | Floor 3, non-movables (layer 100): shells with no Walk, an Amount and a Yield (S). Each stands on one flat tile of land; a big one takes the |  |
| E41 |  | the finds (layer 100), from their shells: kind → code, yield, amount, the ground kept clear |  |
| E42 |  | QBJ Z1's store, from what one age up costs (Albert's rule): food for the age and the villagers, wood for the mill, the lumber camp, the home |  |
| E43 |  | what stands on each tile, and the shells themselves |  |
| E44 |  | the free tile nearest a spot |  |
| E45 |  | a shell on a tile; its stand wanders within the tile by D82 on the dice, so no wood is a grid |  |
| E46 |  | the n free tiles nearest a spot: a grove (marked as woods, the trees follow) or a berry patch |  |
| E47 |  | The home finds: Who every corner · What Z1's berries, grove, gold and stone, sized by QBJ; Z3's the same at D72 times, with iron · Where fix |  |
| E48 |  | Z4's finds: Who the map · What piles of gold, stone and iron, berry patches, and the gifts: ruins, cemeteries, campfires, treasure · Where Z |  |
| E49 |  | The trees: Who every tile of woods (TF1, and the groves) · What one tree, its stand, size and shade · Where its tile · When the map is made  |  |
| E50 |  | drawn back to front |  |
| E51 |  | a tree with trees on all eight sides is deep: nothing can stand between it and its neighbours, so the deep woods are painted once a chunk (s |  |
| E52 |  | 0 water, 1 sand, 2 dirt, 3 grass; bare dirt again high over the land (D23) |  |
| E53 |  | the first band is what can be waded (D24) |  |
| E54 |  | the forest floor: the grass, shaded; the marsh: the grass, toward the water |  |
| E55 |  | what a face shows between two heights (L1): the grass is the land's top skin; anything raised above it shows bare earth |  |
| E56 |  | Drawn once in the view frame: every tile a lifted quad, a face where it steps down toward the camera. Then every frame is one picture, moved |  |
| E57 |  | the masks at a quarter scale: the land in white and in shadow, the inland water |  |
| E58 |  | a quad a, b, c, d (top-left round to bottom-left on the screen) grown half a pixel right and down, so the next tile's edge lands on solid pa |  |
| E59 |  | the grass's blades: one 64-unit tile of short strokes in two tints of C4, repeated (preview 49's) |  |
| E60 |  | the light stands high to the left and in front: ground leaning that way is lit, ground leaning away is shaded, 3% a unit of lean over a tile |  |
| E61 |  | runs: flat tiles of one colour in a row drawn as one quad (no seams, few fills) |  |
| E62 |  | faces: the +y edge and the +x edge face the camera (the turn is under 45°) |  |
| E63 |  | The view (layer 140): one camera, drag to pan, pinch or wheel to zoom; the overlays are drawn each frame over the one picture. |  |
| E64 |  | one flag a layer code (the panel, floor 8) and Fast |  |
| E65 |  | The door (floor 8): the modules (menu, econ, combat, ai) hang on these hooks and read the world through FK; nothing else of theirs touches t |  |
| E66 |  | event: a named happening (a blow, a drop, a raise) that the sound and the feel answer, by the names in books/sound.js HE1 |  |
| E67 |  | a slow beat's turn (D182–D184): the step whose seconds played cross it, its phase in Mid's frames (D98) |  |
| E68 |  | the screen jolts with a heavy impact (QBT) |  |
| E69 |  | the walking grid, at the land's height, clipped to the played ground: the coast's line brought D7 in (L6) |  |
| E70 |  | Z1 to Z4 from each corner (D3 to D6), at the land's height (L11: a rule drawn on the ground, not ground) |  |
| E71 |  | The brushes (preview 49, 18-figures.js): a polygon, an ellipse, a line, two gradients; g is the canvas being painted |  |
| E72 |  | The building art (preview 49, 19-building-art.js; Nov 3, the last build before the camera turn): every piece drawn from its own point lists, |  |
| E73 |  | a building picture's height, from its look |  |
| E74 |  | The node art (the same file): six trees, three bushes, stone, gold and iron; r is a dice for the leaf blobs |  |
| E75 |  | The figures (preview 49, 18-figures.js): people and beasts drawn from data, feet at (0, 0), facing right, a person about 21 tall; fr 0–3 the |  |
| E76 |  | the brushes: one drawing routine a shape; a look in books/sprites.js names its brush and the brush's settings ($side the owner's colour, $si |  |
| E77 |  | a figure's frame, from its look |  |
| E78 |  | B the buildings (layer 110; shells without Walk): the size in tiles (D8–D11; a wall piece is one tile, D12), Open or Closed (S Styles), the  |  |
| E79 |  | the buildings (layer 110), from their shells: name, size in tiles, Open, the picture, what it takes in |  |
| E80 |  | a building stands on n × n flat free tiles from (i, j); Closed takes them (OCC 2), Open leaves them walkable (OCC 3) |  |
| E81 |  | The Town Center: Who every corner · What one · Where Z2 on the road at D84, the same in all four (L12) · When the map is made · Why the game |  |
| E82 |  | Floor 5, movables (layer 120): U units and M moveables are shells that walk. Each stands at a board point, walks tile to tile along a path ( |  |
| E83 |  | one a corner (C5–C8); the player is 0 |  |
| E84 |  | the units and moveables (layer 120), from their shells: name, look, pace (a D86 key) |  |
| E85 |  | the tool a villager works a find with (WORKTOOL): axe, hands, pick |  |
| E86 |  | walking (L5, top rules): land or a ford is walked; a thing, a closed building or a step past the angle of repose is not |  |
| E87 |  | inland water bearing ice (QQ): walked as if flat |  |
| E88 |  | QN: mud and snow cost a walker |  |
| E89 |  | QBL A* over the tiles, eight ways, straight 1 and diagonal √2, the heuristic the octile distance (N74). goal(k) says when a tile will do; re |  |
| E90 |  | most: the tiles it may open before giving up |  |
| E91 |  | no cutting a corner |  |
| E92 |  | a unit on a tile; its stand wanders in the tile (D82) |  |
| E93 |  | a path of one tile (already there) walks to its middle: no step past the end |  |
| E94 |  | to a tile |  |
| E95 |  | to a tile beside one |  |
| E96 |  | the drop-off for a yield: the side's nearest building that takes it in (SC Drop-off, B's fifth field) |  |
| E97 |  | to a tile along a building's edge |  |
| E98 |  | a find used up is gone; its tile is free again |  |
| E99 |  | one tick for every unit |  |
| E100 |  | walking: toward the next tile's middle at the shell's speed |  |
| E101 |  | metres walked, which turn the stride (QBU); its speed now, which a blow carries (QBT) |  |
| E102 |  | wildlife wanders: after a Poisson wait (QM, mean D94) it walks to a free tile within D95 |  |
| E103 |  | M3 the grids (a spatial hash): units by squares of D185, refiled after each step's walking, buildings by D186; a new unit is filed as it com |  |
| E104 |  | every unit within r of from (a square), never itself |  |
| E105 |  | the buildings within r of (x, y) by their squares, a little beyond on the edges; refiled when one comes or goes (Mid's rule); stops when fn  |  |
| E106 |  | the rules' dice and the looks', from the map's seed but not its stream |  |
| E107 |  | The villagers: Who every side · What D67 villagers · Where round its Town Center · When the game starts · Why hands to gather and build · Ho |  |
| E108 |  | The wildlife: Who the map · What herds of deer and packs of wolves · Where Z4, on walkable ground · When the map is made · Why food to hunt, |  |
| E109 |  | which walkers, how many groups and how big: the book's (D181) |  |
| E110 |  | what carries a walker: its mount, else its own body (W) |  |
| E111 |  | The body's laws (Book 1): mass from what a shell is made of (W), the blow that sends a body off (QBT), the slide to rest on the ground under |  |
| E112 |  | QBT: the whole striker when it moves, else its weapon; the struck one is sent off at v = m·v ÷ (m + M) |  |
| E113 |  | QBT: friction slows it by μ g a second until it rests; anything it cannot stand on stops it |  |
| E114 |  | the mean speed over the step, so the slide ends where v² ÷ 2μg says |  |
| E115 |  | QBS: none while the body holds (classes I, II); grows over class III to the tipping angle; there in class IV. Its rhythm the body's pendulum |  |
| E116 |  | a unit's picture: the look at its frame, facing right, painted once per look, colour and frame (LOOKBOX gives the box) |  |
| E117 |  | The things, drawn each frame back to front, only those on the screen. A picture is painted once per look and zoom step, then stamped (the sp |  |
| E118 |  | W × H units, the art's origin at (tx, ty), its anchor (the point stamped at the thing's stand) at (ax, ay) |  |
| E119 |  | the node art's own small dice, seeded by the variant, so a tree's leaves fall the same each paint |  |
| E120 |  | each drawn at its stand (x, y on the screen), s pixels a unit |  |
| E121 |  | a find far out, from its look |  |
| E122 |  | Floor 6, climate (layer 130): one sky over the whole board (185 m across: one weather), acting on everything below (L7). The clock is Y: a d |  |
| E123 |  | QA the sun: sin a = sin φ sin δ + cos φ cos δ cos H; φ D99, δ swings ±23.44° over the year from the spring equinox, H turns with the day (no |  |
| E124 |  | light by the sun's height, the twilights at −6, −12, −18 (SoRen's ramp, QD) |  |
| E125 |  | QP the one first-order lag, x to its level L over τ: x(t) = L + (x0 − L) e^(−t/τ) (N16; Mid's relax: wetness here, and the market, nerve, he |  |
| E126 |  | QH the rain: a two-state chain, drawn once a game hour (a day's 24th): P(wet / dry) and P(wet / wet) are D102; a wet hour is a storm with D1 |  |
| E127 |  | the season's mean, eased into the next |  |
| E128 |  | what falls |  |
| E129 |  | rain comes and goes over tens of seconds (SoRen) |  |
| E130 |  | QP settle: wet in D104, dry in D105 |  |
| E131 |  | QO degree-day melt, rain on snow twice as fast |  |
| E132 |  | QQ: ice grows with the freezing degree-seconds and bears at D109 |  |
| E133 |  | QM: fog comes on a Poisson wait (D110) and stays D111 |  |
| E134 |  | fog, or mist after rain at dawn and dusk (KW8) |  |
| E135 |  | QL, QM: strikes on Poisson waits in a storm |  |
| E136 |  | a strike: on the ground in view when close, a sheet flash when far; the flash never comes within D112 of the last (QL, WCAG 2.3.1), and the  |  |
| E137 |  | a far flash: its thunder from beyond the screen |  |
| E138 |  | the rain: a pool of drops whose size sets its speed (Marshall–Palmer sizes, QJ Atlas's fall speed), leaning a little; the snow: flakes that  |  |
| E139 |  | on the ground, under everything: snow whitens the land (screen), wet darkens it (multiply), ice whitens the inland water |  |
| E140 |  | over everything: what falls, the strikes, the flash, the night and the fog |  |
| E141 |  | SoRen's bolt: a channel from the top of the sky to the ground with a fork or two, three strokes from a soft glow to a bright core; its foot  |  |
| E142 |  | the channel wanders but leans home to its foot |  |
| E143 |  | the light: the sun's by the ramp, clouds take a quarter, the horizon's warmth within 8° of it |  |
| E144 |  | KW7: Koschmieder's reach (QK) limits sight on the Display floor; here the haze |  |
| E145 |  | Marsh (TW1): Who the map · What a wet margin round a lake or two · Where Z4's lakes, the land D115 out from the water · When the map is made |  |
| E146 |  | Floor 7, display (layer 140): what the player sees. The fog of war: every tile is unseen, seen once, or in sight now (the player's units see |  |
| E147 |  | the player's sight, every D119: what was in sight is remembered; what the units and buildings of side 0 reach now is seen |  |
| E148 |  | the sea is never fogged |  |
| E149 |  | the fog image is one tile a pixel in the grid's frame; one affine lays it on the ground (QBD): the turn, the tilt and the camera together |  |
| E150 |  | QAT the shadow: length = height × cot(the sun's height), capped at D120 heights, thrown away from the sun; the sun rises on the right, stand |  |
| E151 |  | left at sunrise, up at noon, right at sunset |  |
| E152 |  | under the buildings and units: a building's footprint thrown by its height, a unit's foot by its own; none under the trees (the woods are th |  |
| E153 |  | the box's shadow: its top thrown, joined to its foot along every edge, one fill so the overlaps stay one shade |  |
| E154 |  | The woods cache: the deep trees (eight tree neighbours) are painted once per chunk of the board and zoom step; the rest of the things are st |  |
| E155 |  | chunks of CS × CS tiles |  |
| E156 |  | a tree cut: its chunk is stale, and its neighbours stand at an edge now |  |
| E157 |  | each chunk's box in the view frame, with room above for the trees' height |  |
| E158 |  | the chunk's deep trees on one canvas |  |
| E159 |  | a hit moves to the back: the oldest goes first |  |
| E160 |  | a wounded one sways about its feet (QBS) |  |
| E161 |  | L6 the play edge: the line between tiles D7 in from the coast and the rest, along the tiles' own edges |  |
| E162 |  | Touch: one finger pans, two pinch; a wheel zooms about the pointer. |  |
| E163 |  | the camera rule: the board never leaves the screen's middle; a board smaller than the screen sits centred |  |
| E164 |  | the tile under a tap, at the land's height, and the player's unit nearest it; the modules answer first (menu), else a tap picks a villager o |  |
| E165 |  | The seed of the day (QBF): the date as YYYYMMDD, the same map for everyone that day; a seed in the address overrides it. |  |
| E166 |  | the door: what the modules may touch |  |
| E167 |  | the test hook |  |
| E168 |  | First Keep v100 · menu.js (floor 8): everything on the glass. Lives alone; it reads the world through one function, read(), and acts through |  |
| E169 |  | Its shape lives in the Screen book (books/screen.js): the mold, the Build tabs, the card's rows and the subject's ticks that pick them, the  |  |
| E170 |  | its numbers live in books/measure.js (D); nothing is typed here |  |
| E171 |  | the codes and their floors; Lock is a mark for us (no floor is locked yet) |  |
| E172 |  | the Screen book: the Build tabs are its; a building shows priced once econ prices it, else Later |  |
| E173 |  | the seat, and who it trains first: asked of the books, never named |  |
| E174 |  | the kinds War's Train box offers |  |
| E175 |  | a page that keeps its own height (SC20) |  |
| E176 |  | the new game's choices: the first is the label's row in Albert's template; built ones set the game, the rest wait (dim, they say why) |  |
| E177 |  | which choices are floors yet |  |
| E178 |  | the base's columns, Albert's template |  |
| E179 |  | the base's icons: one 24-unit box each, line icons in the cell's colour, finds in their own |  |
| E180 |  | the resources in their colours (COLORS.md) |  |
| E181 |  | the colours: COLORS.md, one name each, set once on :root; nothing below uses a colour that is not here (the map's own paint excepted) |  |
| E182 |  | the glass's own state, nothing of the world's |  |
| E183 |  | 60w 60f, as Albert's Build menu |  |
| E184 |  | read: the one window onto the world the glass draws from |  |
| E185 |  | VERBS: every way the player may act, each with its reason not to. act() asks whyNot first; a reason stops it and is said |  |
| E186 |  | Train a kind: the nearest finished building that trains it |  |
| E187 |  | a channel's volume, a step a tap (HX10) |  |
| E188 |  | sound on or off |  |
| E189 |  | a cell for what is drawn but not yet built: Albert's reminder |  |
| E190 |  | the new game: the bell (D134), fog, the day's map or a fresh one |  |
| E191 |  | tap a yield: new villagers go there (the ring) |  |
| E192 |  | tap picks, slide places the ghost, tap again builds |  |
| E193 |  | the cells: one mold; a verb's cell is dim when its whyNot says so, and a dim cell only says why |  |
| E194 |  | a cell's object arguments live here by key, since the DOM holds strings |  |
| E195 |  | the mold: a ribbon is an optional label and a strip of n equal cells; seg puts them in one frame with one lit. Every screen is a list of rib |  |
| E196 |  | the mold: every screen is rows on one six-column grid (the Formation). A row holds cells and parts; a part is an optional label and a strip  |  |
| E197 |  | Albert's Town Center: the bars in the title, three tabs, the queue, train, tech |  |
| E198 |  | Fast and New sit in the title row; the volumes add a row, so the Yard ticks Tall (SN13) |  |
| E199 |  | one row a name in SN4; each answers for the subject t, or says nothing |  |
| E200 |  | the base: Albert's template. Corners Yard and War; who works where; Build and − + under each yield |  |
| E201 |  | war mode: Albert's War rows. Left the people's orders, the middle box (map, squads, orders, kinds), right the army's |  |
| E202 |  | the top bar: Albert's two ribbons. The stores, sound, play, mail; the age, the clock, people, idle, records, rank, army |  |
| E203 |  | Relations and Misfits: one row a people: who and where they stand, (a bribe for misfits), the three stances, ✓. Drawn now, built with diplom |  |
| E204 |  | the five stores, sound, play, mail (SN5) |  |
| E205 |  | a page opens from the bottom edge, over the base's rows; the card waits behind it |  |
| E206 |  | the ghost: press and slide on the map moves it; the tile under the finger is its middle. Build confirms. Nothing of this reaches the canvas' |  |
| E207 |  | the tap: the glass answers first. A ghost takes it; aiming takes it; a unit or a thing under it becomes the subject, and a picked villager o |  |
| E208 |  | one height for every page but the Tall ones: each is laid out once, the tallest sets the panel, the others fill it (Albert: menus never move |  |
| E209 |  | the tallest of the pages that are not Tall sets the one height |  |
| E210 |  | sized once the modules and fonts are in (the first start) |  |
| E211 |  | the game opens on the player's hall |  |
| E212 |  | the version, said once (D171) |  |
| E213 |  | First Keep v100 · econ.js (floor 9): the economy. Lives alone; touches the world only through FK. Costs, homes, training, sites, ages, upkee |  |
| E214 |  | seconds played, and when the bell rings |  |
| E215 |  | gone: marked when it leaves the map (below) |  |
| E216 |  | paying: a side pays all of a cost or none of it (SB Cost) |  |
| E217 |  | a site: a building paid for and placed at done 0; villagers raise it. canPlace mirrors build's rule without building |  |
| E218 |  | training: a queue at the building; the head trains; a new unit stands on a free tile beside and takes the side's rally job |  |
| E219 |  | the age: paid, then a wait at the Town Center (D129) |  |
| E220 |  | the jobs (SM Gather): a villager's job is the yield it works; counts are read, not kept |  |
| E221 |  | QW: the find of a yield that keeps the round trip shortest: nearest the drop-off among those within D89 of the villager, else nearest the vi |  |
| E222 |  | a find no path reaches is left alone a while (D137), and the next beat chooses again among the finds near (D89): one walled in tries one fin |  |
| E223 |  | assign: + sends the nearest idle villager (else one from the fullest other job) to the yield's best find; − sets one of the job's villagers  |  |
| E224 |  | the tick: training, ages, upkeep, the villagers, the bell |  |
| E225 |  | a new game: the book's stores (D172); the bell stays as Start set it |  |
| E226 |  | the score (QBR): what a side holds, cost ÷ D135, and everything it gathered ÷ D135 |  |
| E227 |  | First Keep v100 · combat.js (floor 10): health, one blow (QBO), target choice (QAG), nerve (QBQ), towers (QAL). Lives alone; touches the wor |  |
| E228 |  | tiles from a unit to a thing: to a building's footprint, in the grid's frame |  |
| E229 |  | gone: pulled down (econ marks it) or dead (die marks it) |  |
| E230 |  | QBO the blow: base × counter × flank − armour, one at least; engines strike buildings with their own blow |  |
| E231 |  | the blow (QBO), and the body it moves (QBT) |  |
| E232 |  | QAG the target: the most harm a second for its health left, discounted by distance; wildlife only when it is biting |  |
| E233 |  | by the grids: a building by its middle, so the widest one's reach (D11) is added |  |
| E234 |  | to within reach of a thing, with a short search (D147) |  |
| E235 |  | a wave falls back to its seat, else to any building of its side |  |
| E236 |  | a side's wave in the field: its soldiers at the start, so nerve can be read (QBQ) |  |
| E237 |  | to a tile, or near one that cannot be stood on (a building's) |  |
| E238 |  | QAF a group's power: each one's health × its blow after research, the blow at least D194, over D193 per (Mid's unitPower and powerOf, one ho |  |
| E239 |  | a villager fights back only when bitten |  |
| E240 |  | the bars: a unit's or building's health, when it is hurt and in sight; the crosshair of the player's wave |  |
| E241 |  | First Keep v100 · ai.js (floor 11): one brain for the computer's side, one personality (balanced). Lives alone; acts only through ECON and W |  |
| E242 |  | the seat, and the hands it trains |  |
| E243 |  | the shells a side can pay for that tick a capability |  |
| E244 |  | each yield's camp: the drop-off that takes it in |  |
| E245 |  | a spot: the nearest free footprint to a point, searched in rings, kept off the home's own ring so the roads stay open |  |
| E246 |  | jobs by need: the yield whose share is most under its wanted share takes an idle villager, or one from the yield most over |  |
| E247 |  | people, homes, drop-offs, plots, the age |  |
| E248 |  | the army: the best counter to what the enemy fields most, until the age's count stands |  |
| E249 |  | the wave: it sets out at the odds (QAF, combat.js) of D155 or better against the other side; a stalled wave goes home |  |
| E250 |  | First Keep v100 · sound.js (beside the stack): one player for every recipe in books/sound.js (H). Lives alone; hears the world only through  |  |
| E251 |  | The ear is the camera, at a height (QAX); a struck thing rings by its material (QAY); snow lowers the air's top and rain masks the quiet (QB |  |
| E252 |  | each channel's volume steps, the one in use first (HX10) |  |
| E253 |  | a phone opens its audio only on a touch |  |
| E254 |  | the Ring/Silent switch silences the game; the player's music plays on (HX8) |  |
| E255 |  | a battle's many blows never clip a phone speaker |  |
| E256 |  | QAY: each mode dies with time constant tau ÷ Hz, to 80 dB down |  |
| E257 |  | QAX: the ear sits over the screen's middle at the height a lens of HX1's field of view needs to see the screen; a sound d along the ground i |  |
| E258 |  | full within the closest zoom's height, then falling as 1 ÷ distance (the inverse-square law in amplitude), less the air's loss |  |
| E259 |  | metres |  |
| E260 |  | QBY: a sound with a reach is full within floor × reach |  |
| E261 |  | the air is full: an alert never waits |  |
| E262 |  | thunder comes after its flash by the distance ÷ the speed of sound |  |
| E263 |  | QBX: rain drowns the far and quiet first |  |
| E264 |  | the player's volume for this channel |  |
| E265 |  | ambience as events: a bird from a tree in view by day, a cricket in the dark, never in winter; when one sings is a Poisson process (HX4) |  |
| E266 |  | QBX: the air's top falls with snow cover, on a log scale |  |
| E267 |  | a side's economy, fresh: its age, its gathered total, the rally, and the stores' flow (this minute's in and out, the last minute's, each by  |  |
| E268 |  | earn and spend: every store in or out goes through these two, the one home for the stores, the minute's flow (by resource and by reason) and |  |
| E269 |  | what was paid comes back the way it went out: the store, the minute's spending and the ledger step back, so a cancel is as if the order neve |  |
| E270 |  | the stores' flow a minute: the last full minute, or before there is one the minute so far scaled up (from at least D189 seconds); net is in  |  |
| E271 |  | each minute (D188) the minute's in and out become the last minute's |  |
| E272 |  | the words helpers: numbers shortened (1.2k, 12k), plurals, 'a, b or c', a percent slower, a place as its lettered square, a ledger line; the |  |
| E273 |  | the first ending in the Words book (J5) that fits the name |  |
| E274 |  | how much slower a full cover of mud or snow makes a march, in percent, from its terrain factor f: 1 − 1 ÷ (1 + f) (QN) |  |
| E275 |  | a place as the map's lettered squares, measured from the board's corner: D190 units a square, letters across, numbers down (A1 to V22); off  |  |
| E276 |  | a ledger line: its reasons largest first, each in its word and shortened, apart by a dot; under half a unit is left out |  |
| E277 |  | QCA, the effects: what each side has learned, and each side's numbers worked out once until its learning changes; a new game forgets both |  |
| E278 |  | a thing's keys, the names an effect may reach it by: every head of its code's letters (B, BR for BR1), its code, and its ticks |  |
| E279 |  | a number's base, from its one home: the pace (D86), a building's health (D139) or a unit's (D138), a find's or a field's rate, a price (D123 |  |
| E280 |  | the one window for a kind's number after research (QCA): flat adds first, then the shares summed and applied once to that (Albert, Nov 5 11: |  |
| E281 |  | learning a step puts its effects in force for that side; every unit and building of the side keeps its share of health as the most it can ha |  |
| E282 |  | who counters whom: the counter's edge (D140) when the striker's class is the one it counters, else even; the one home the blow (QBO) and the |  |
| E283 |  | QAF the odds an army gives itself against a side, the one home the computers read: the counters summed both ways over the first of each army |  |
| E284 |  | against theirs: its soldiers, its towers (not its seat) at D177 each, its people at D192 (Mid's powerFrom); the square law as odds, p² ÷ (p² |  |

## ground

| Code | Name | Value | Cited |
|---|---|---|---|
| G5 | dry grass | {mu: 0.35} | N104 |
| G6 | mud: wet ground or marsh | {mu: 0.25} | N105 |
| G7 | snow cover | {mu: 0.14} | N106; N18 |
| G8 | ice that bears a walker | {mu: 0.1} | N107; N18 |

## mass

| Code | Name | Value | Cited |
|---|---|---|---|
| W1 | a person | {kg: 70, height: 1.8, com: 0.99, foot: 0.26, stride: 1.524} | N108; N109; N110 |
| W2 | a horse | {kg: 500, height: 1.6, com: 1.2, foot: 0.6, stride: 2.5} | N85 |
| W3 | a deer | {kg: 70, height: 1.0, com: 0.7, foot: 0.4, stride: 1.5} | N85 |
| W4 | a wolf | {kg: 40, height: 0.8, com: 0.5, foot: 0.35, stride: 1.4} | N85 |
| W5 | a bear | {kg: 200, height: 1.0, com: 0.6, foot: 0.5, stride: 1.2} | N85 |
| W6 | an engine on wheels (ram, catapult) | {kg: 1000, height: 1.5, stride: 2.0} | N111 |
| W7 | a tool (axe, pick, hammer) | {kg: 2, blow: {kg: 2, mps: 8}} | N85 |
| W8 | a spear | {kg: 2.5, blow: {kg: 2.5, mps: 6}} | N85 |
| W9 | a shield | {kg: 5} | N85 |
| W10 | a bow, its blow an arrow | {kg: 2, blow: {kg: 0.03, mps: 50}} | N85 |
| W11 | scale armour | {kg: 12} | N85 |
| W13 | a lance: a thrust when standing; moving, the whole rider and horse strike (QBT) | {kg: 4, blow: {kg: 4, mps: 6}} | N85 |
| W14 | a wagon's or caravan's load | {kg: 100} | N97 |
| W12 | timber | {density: 600} | N87 |
| W15 | stone | {density: 2400} | N87 |
| W16 | iron | {density: 7870} | N87 |

## measure

| Code | Name | Value | Cited |
|---|---|---|---|
| D1 | the site, the whole world | 3060 | N112 |
| D2 | the board, the played land | 2160 | N112 |
| D3 | the zones' edges from each corner: Z1, Z2, Z3 (Z4 beyond) | [300, 600, 900] | N112 |
| D7 | the play edge, in from the coast | 60 | N112 |
| D8 | Small: a building 2 × 2 tiles | 2 | N112 |
| D9 | Standard: 3 × 3 tiles | 3 | N112 |
| D10 | Medium: 4 × 4 tiles | 4 | N112 |
| D11 | Large: 6 × 6 tiles | 6 | N112 |
| D12 | a tile | 10 | N112 |
| D13 | the land's height over the water | 24 | N112 |
| D14 | the sand's top | 12 | N112 |
| D15 | the dirt's top | 20 | N112 |
| D16 | a beach falls to the water over | 80 | N112 |
| D17 | a cliff falls over | 4 | N112 |
| D18 | the coast wanders in and out by | 24 | N112 |
| D19 | the sea is darkest this far out | 60 | N112 |
| D20 | a day (Y1) | 120 | N112 |
| D21 | a season (Y2) | 180 | N112 |
| D22 | a year (Y3) | 720 | N112 |
| D23 | bare ground this high over the land | 12 | N112 |
| D24 | water deeper than this is not waded | 4 | N112 |
| D25 | lakes, how many | [3, 6] | N112 |
| D26 | a lake's radius | [50, 160] | N112 |
| D27 | a lake's depth at the middle | 12 | N112 |
| D28 | a shore's wander as a share of the radius | 0.25 | N112 |
| D29 | a river's depth | 8 | N112 |
| D30 | a river's half-width as a share of its lake's radius | 0.25 | N112 |
| D31 | a river's wander | 80 | N112 |
| D32 | a bank falls over | 40 | N112 |
| D33 | a ford's length | 40 | N112 |
| D34 | a stream's half-width | 6 | N112 |
| D35 | a stream's depth | 2 | N112 |
| D36 | hills, how many | [2, 4] | N112 |
| D37 | a hill's radius | [80, 160] | N112 |
| D38 | a hill's height | 14 | N112 |
| D39 | rocks, how many | [3, 6] | N112 |
| D40 | a rock's radius | [15, 35] | N112 |
| D41 | a rock's height | 18 | N112 |
| D42 | crevices, how many | [1, 2] | N112 |
| D43 | a crevice's half-width | 8 | N112 |
| D44 | a crevice's floor | 13 | N112 |
| D45 | a crevice's length | [150, 300] | N112 |
| D46 | a road's clear half-width | 50 | N112 |
| D47 | the middle kept clear | 150 | N112 |
| D48 | the woods' longest wave | 500 | N112 |
| D49 | the woods stand where the surface rises past | 0.1 | N112 |
| D50 | the forest wall round a home, from and to | [920, 1080] | N112 |
| D51 | the home pond's spot in the corner's frame | [700, 450] | N112 |
| D52 | the home pond's radius | 50 | N112 |
| D53 | a tree's wood | 100 | N112 |
| D54 | a bush's food | 125 | N112 |
| D55 | a gold pile | 800 | N112 |
| D56 | a stone pile | 350 | N112 |
| D57 | an iron pile | 350 | N112 |
| D58 | a ruin's stone | 200 | N112 |
| D59 | a campfire's food | 100 | N112 |
| D60 | a treasure's gold | 300 | N112 |
| D61 | one age up | 500 | N69 |
| D62 | a villager | 50 | N112 |
| D63 | the mill | 100 | N112 |
| D64 | the lumber camp | 100 | N112 |
| D65 | a home | 25 | N112 |
| D66 | the barracks | 175 | N112 |
| D67 | villagers counted | 6 | N112 |
| D68 | homes counted | 2 | N112 |
| D69 | the margin | 0.25 | N112 |
| D70 | Z1's spots in the corner's frame | {bush: [250, 140], tree: [140, 250], gold: [200, 120], stone: [120, 200]} | N112 |
| D71 | Z3's spots | {bush: [820, 300], tree: [300, 820], iron: [560, 680], stone: [450, 750], gold: [680, 560]} | N112 |
| D72 | Z3 holds this many times Z1 | 3 | N112 |
| D73 | Z4's gold piles | [4, 6] | N112 |
| D74 | stone piles | [3, 5] | N112 |
| D75 | iron piles | [3, 5] | N112 |
| D76 | berry patches | [6, 10] | N112 |
| D77 | bushes a patch | [4, 6] | N112 |
| D78 | ruins | [2, 2] | N112 |
| D79 | cemeteries | [1, 2] | N112 |
| D80 | campfires | [2, 3] | N112 |
| D81 | treasures | [1, 2] | N112 |
| D82 | a thing's stand wanders in its tile by | 3 | N112 |
| D83 | under this many pixels a tile things are dots and the grid is off | 5 | N112 |
| D84 | the Town Center's spot in the corner's frame, Z2 on the road | [380, 380] | N112 |
| D85 | units a metre, from the figure | 11.7 | N112 |
| D86 | speeds in metres a second (walk: quick time, 120 steps of 30 in a minute) | {walk: 1.52, trot: 3.6, horse: 1.7, push: 0.7, deer: 1.5, wolf: 2.5, bear: 1.5} | N71; N72; N73; N79 |
| D87 | a load | 10 | N112 |
| D88 | gathering a second, the old game's own | {bush: 0.9, tree: 0.75, gold: 0.6, stone: 0.55, iron: 0.5} | N70 |
| D89 | the next find within | 100 | N112 |
| D90 | deer herds | [3, 5] | N112 |
| D91 | a herd | [3, 5] | N112 |
| D92 | wolf packs | [2, 3] | N112 |
| D93 | a pack | [2, 3] | N112 |
| D94 | a wander's mean wait | 6 | N112 |
| D95 | its reach | 60 | N112 |
| D96 | drawn frames in one stride (two steps) | 4 | N113 |
| D97 | a work beat | 0.4 | N112 |
| D98 | frames a second | 30 | N112 |
| D99 | the latitude | 45 | N112 |
| D100 | the seasons' mean air, spring to winter | [10, 22, 12, -6] | N112 |
| D101 | the day's swing | 6 | N112 |
| D102 | P(wet | dry), P(wet | wet) an hour | [0.12, 0.65] | N7 |
| D103 | storms among wet hours | 0.25 | N112 |
| D104 | wet settles in | 20 | N112 |
| D105 | dries out in | 50 | N112 |
| D106 | walking costs of mud and snow | {mud: 0.8, snow: 0.6} | N112 |
| D107 | snow a second when it snows | 0.03 | N112 |
| D108 | melt a °C·s | 0.004 | N112 |
| D109 | ice bears a walker at this many freezing °C·s | 200 | N112 |
| D110 | fog's wait | 240 | N112 |
| D111 | fog stays | 40 | N112 |
| D112 | between flashes | 0.34 | N112 |
| D113 | between strikes in a storm | 6 | N112 |
| D114 | marshy lakes | [1, 2] | N112 |
| D115 | a marsh's width | 40 | N112 |
| D116 | Fast, for testing | 8 | N112 |
| D117 | how far a unit and a building see | {unit: 60, bld: 100} | N112 |
| D118 | the fog's dark over the unseen and the remembered | [0.75, 0.4] | N112 |
| D119 | the fog's beat | 0.5 | N112 |
| D120 | a shadow at most this many heights | 3 | N112 |
| D121 | the blades' strength | 0.45 | N112 |
| D122 | the sides in play | [0, 2] | N114 |
| D123 | what a thing costs | {BTC1: {wood: 275, stone: 100}, BR1: {wood: 25}, BI1: {wood: 100}, BI2: {wood: 100}, BI3: {wood: 100}, BCL1: {wood: 60}, BM1: {wood: 175}, B | N69 |
| D124 | seconds to train | {UV: 25, UM1: 21, UM2: 35, UM3: 30, UM4: 36, US4: 30} | N69 |
| D125 | one villager's seconds to raise a site | {BTC1: 150, BR1: 25, BI1: 35, BI2: 35, BI3: 35, BCL1: 15, BM1: 50, BM2: 50, BM3: 50, BM4: 40, BW1: 10, BW2: 70, BW3: 80, BW4: 5} | N69 |
| D126 | n villagers raise it at n^this | 0.7 | N114 |
| D127 | the people a building houses | {BTC1: 10, BR1: 5} | N69 |
| D128 | the most people | 200 | N69 |
| D129 | an age's price: n × food, (n − 1) × gold, and its wait | {food: 500, gold: 200, time: 90} | N114 |
| D130 | the six ages | [Camp, Village, Town, City, Kingdom, Empire] | N114 |
| D131 | a unit's food a day | 1 | N114 |
| D132 | move on when another find is this much nearer the drop-off | 0.18 | N114 |
| D133 | who trains whom | {BTC1: [UV], BM1: [UM1], BM2: [UM2], BM3: [UM3, US4], BM4: [UM4]} | N114 |
| D134 | the bell | 900 | N114 |
| D135 | the score's divisors | {unit: 5, bld: 5, tech: 5, wealth: 10} | N75 |
| D136 | a farm's food a second | 0.4 | N69 |
| D137 | a find no path reached is left alone for | 60 | N114 |
| D138 | a unit's health, blow, reach, pace, armour, class and counter | {UV: {hp: 25, atk: 3, rng: 1, rof: 1.5, arm: 0, cls: foot}, UM1: {hp: 45, atk: 8, rng: 1, rof: 1, arm: 1, cls: foot, vs: horse}, UM2: {hp: 3 | N69 |
| D139 | a building's health | {BTC1: 2400, BR1: 550, BI1: 600, BI2: 600, BI3: 600, BCL1: 480, BM1: 1200, BM2: 1200, BM3: 1200, BM4: 1500, BW1: 1800, BW2: 2750, BW3: 1020, | N69 |
| D140 | a counter's edge | 1.5 | N114 |
| D141 | a blow from behind | 1.3 | N114 |
| D142 | a wave breaks under this share of its start | 0.3 | N76 |
| D143 | what shoots: blow, reach, pace | {BW3: [5, 8, 2], BTC1: [5, 6, 2], BTC8: [4, 6, 2]} | N69 |
| D144 | a soldier takes up a fight within | 8 | N114 |
| D145 | seconds between its path checks | 1 | N114 |
| D146 | wildlife bites within | 3 | N114 |
| D147 | tiles a chase may search | 2500 | N114 |
| D148 | seconds between a soldier's looks around | 0.5 | N114 |
| D149 | seconds between its rounds | 2 | N114 |
| D150 | villagers wanted by age | [10, 16, 22, 28, 32, 36] | N114 |
| D151 | the share of villagers on each yield by age | [[0.55, 0.45, 0, 0, 0], [0.45, 0.35, 0.15, 0.05, 0], [0.4, 0.3, 0.2, 0.1, 0], [0.35, 0.3, 0.2, 0.1, 0.05], [0.35, 0.3, 0.2, 0.1, 0.05], [0.3 | N114 |
| D152 | a home goes up when fewer than this many places are left | 4 | N114 |
| D153 | a camp goes up when a job's find is farther than this from its drop-off | 12 | N114 |
| D154 | soldiers wanted by age | [4, 8, 12, 16, 20, 24] | N114 |
| D155 | a wave goes at these Lanchester odds | 0.6 | N114 |
| D156 | seconds a wave may make no progress before it goes home | 60 | N114 |
| D157 | villagers sent to a site | 2 | N114 |
| D160 | farms it keeps | 4 | N114 |
| D161 | farms when no bush stands within this of the hall | 25 | N114 |
| D162 | the glass redraws every | 0.25 | N114 |
| D163 | a reason stays | 2.5 | N114 |
| D164 | woods chunks kept drawn | 64 | N114 |
| D165 | the game opens on the Town Center at this share of the screen's width | 0.2 | N115 |
| D166 | the screen jolt: pixels a m/s the struck one is sent, at most, for, and from what speed | {px: 1, max: 3, s: 0.08, from: 1.5} | N116 |
| D167 | blood lost at the shock classes' edges: II, III, IV (health lost read as blood lost) | [0.15, 0.3, 0.4] | N77; N78 |
| D168 | gravity, m/s² | 9.81 | N117 |
| D169 | the ground a find keeps clear round it, in units | {gold: 9, stone: 9, iron: 9, ruins: 14, cemetery: 12, campfire: 6, treasure: 4} | N112 |
| D170 | a wall piece: one tile | 1 | N112 |
| D171 | the build: First Keep v100, the build number | 100 · 12 | N118 |
| D172 | the stores every side starts with | {food: 200, wood: 200, stone: 200, gold: 200, iron: 0} | N119 |
| D173 | tiles a site is searched for, ring by ring | 30 | N120 |
| D174 | a villager moves to the neediest yield when its share is this far under | 0.15 | N120 |
| D175 | villagers on a yield before it gets its own camp | 3 | N120 |
| D176 | the share of wanted villagers before it ages up | 0.8 | N120 |
| D177 | a tower counts as this much strength in the odds (Mid's 120; v100 held 100) | 120 | N157 |
| D178 | the ring a home, a camp and a field keep from the hall | {home: 5, camp: 2, field: 4} | N120 |
| D179 | the army buildings it raises, in order: when (villagers, age) and how far out | [{code: BM1, vils: 8, age: 0, ring: 5}, {code: BM2, vils: 0, age: 2, ring: 5}, {code: BM3, vils: 0, age: 3, ring: 6}] | N120 |
| D180 | the soldiers it trains, the first by default; the best counter first | [UM1, UM2, UM3] | N120 |
| D181 | the wildlife laid on the map: which walker, how many groups (a D key) and how big (a D key) | [{code: MW3, groups: herds, size: herd}, {code: MW4, groups: packs, size: pack}] | N121 |
| D182 | the slow beat: every 10 s, its phase 150 frames (D98) in: the market, loyalty, the computers' slow looks | [10, 150] | N122 |
| D183 | the health beat: every 5 s, phase 75 frames | [5, 75] | N122 |
| D184 | the Natives' beat: every 5 s, phase 7 frames | [5, 7] | N122 |
| D185 | the unit grid's square, in units: units are filed by it after each step, so a search looks only nearby | 48 | N123 |
| D186 | the building grid's square, in units | 100 | N124 |
| D187 | the looks' dice: the map's seed XOR this, a stream apart from the map's and the rules' (QBF) | 1013904223 | N125 |
| D188 | the minute's beat: the stores' flow turns over, the last minute's in and out kept (Mid's flowTick, every 1,800 frames from the start) | [60, 0] | N132 |
| D189 | the stores' flow: a first minute scaled from at least this many seconds; a store's velocity is tanh(net a minute ÷ ref); under half a unit is nothing; falling with under this many minutes left is the worst (Mid's VEL) | {least: 10, ref: 40, half: 0.5, short: 2} | N132 |
| D190 | the map's lettered square, in units (J6): A1 to V22 across the board | 100 | N132 |
| D191 | numbers said: from a thousand shortened to tenths of a k (1.2k), from ten thousand to whole k (12k); a share said in percent | {tenth: 100, thousand: 1000, whole: 10000, percent: 100} | N132 |
| D192 | a side's people count as this much strength in the odds | 250 | N157 |
| D193 | the odds: a unit's power is its health × its blow ÷ per; who counters whom is weighed over the first look of each army, held between lo and hi | {per: 6, look: 10, lo: 0.6, hi: 1.6} | N157 |
| D194 | a blow does at least this, and a unit's power counts at least this blow | 1 | N69; N157 |

## rules

| Code | Name | Value | Cited |
|---|---|---|---|
| X1 | a code that has two homes (two books) | {stage: books} | N126 |
| X2 | an entry with no citation, a citation not in the Citations book, or one typed as text instead of its code | {stage: books} | N126 |
| X3 | an entry or a law naming a Q or an N that does not exist | {stage: books} | N126 |
| X4 | a shell lacking what its layer's mold needs | {stage: books} | N126 |
| X5 | a shell ticking what it cannot back | {stage: books} | N126 |
| X6 | a slot on a shell that nothing it ticks asks for | {stage: books} | N126 |
| X7 | a slot pointing at nothing: a D code, a body, a kit, a look, a sound | {stage: books} | N126 |
| X8 | an event playing a sound that is not in the Sound book | {stage: books} | N126 |
| X9 | a Build tab over nine, or listing something that is not a building | {stage: books} | N126 |
| X10 | a building missing from the Build menu or listed twice (unless named off it) | {stage: books} | N126 |
| X11 | opened code naming a shell instead of asking by tick or by book | {stage: code} | N126 |
| X12 | numbers typed into D instead of the Measurements book | {stage: code} | N126 |
| X13 | a comment that ends in a statement: it may have swallowed code | {stage: code} | N126 |
| X14 | the version typed into the page instead of read from D171 | {stage: code} | N126 |
| X15 | a code file that does not parse on its own | {stage: code} | N126 |
| X16 | the whole game, joined, not parsing (a name declared twice) | {stage: code} | N126 |
| X17 | a permit opening more than ten items, or a change it does not open | {stage: seal} | N126 |
| X18 | a locked item differing from its seal by a single byte | {stage: seal} | N126 |
| X19 | opened code typing more numbers or colours than when sealed | {stage: seal} | N126 |
| X20 | opened code growing past its sealed size without growth the permit grants | {stage: seal} | N126 |
| X21 | a page (INDEX, CITATIONS, INDEX-CITATIONS, INVENTORY) not what the books say (on GitHub) | {stage: seal} | N126 |
| X22 | a rule in this book that nothing runs | {stage: seal} | N126 |
| X23 | the page shows the version from the book | {stage: page} | N126 |
| X24 | the top is one ribbon of the cells the Screen book names | {stage: page} | N126 |
| X25 | Build renders the book's tabs, each with its buildings | {stage: page} | N126 |
| X26 | every page that is not Tall shares one height | {stage: page} | N126 |
| X27 | the Tall pages keep their own height | {stage: page} | N126 |
| X28 | the panel is solid | {stage: page} | N126 |
| X29 | the seat's queue is the mold's six single slots, filling in order | {stage: page} | N126 |
| X30 | a card shows the rows its subject ticks: a villager, a find, the seat | {stage: page} | N126 |
| X31 | a building picked from Build is placed as a site | {stage: page} | N126 |
| X32 | the page runs with no errors | {stage: page} | N126 |
| X33 | the gate stops each planted break: a second home, a bad tick, a shell named in code, swallowed code, one byte of a locked law | {stage: page} | N126 |
| X34 | a new game starts with the book's stores (D172), and a restart resets them and the weather | {stage: page} | N127 |
| X35 | the fog is drawn only when the Start page turns it on | {stage: page} | N127 |
| X36 | a paid unit with no room to stand waits in the queue, then appears | {stage: page} | N127 |
| X37 | the bell rings at the length chosen at Start; the default is the book's | {stage: page} | N127 |
| X38 | a find used up is gone at once, and never chosen again | {stage: page} | N127 |
| X39 | the computer raises its army buildings in the book's order (D179) | {stage: page} | N127 |
| X40 | code that asks what a thing is by a typed name (kind === 'tree'): ask by tick | {stage: survey} | N128 |
| X41 | the reference copy differs from its seal, or its parts, or the temp books read back in its order, do not rebuild it byte for byte | {stage: survey} | N129 |
| X42 | a sound brought from Mid makes the same parts as Mid's own code makes it (same action, same result) | {stage: page} | N130 |
| X43 | a temp book being sorted leaves a piece of Mid without its line (in v100, bring, cut or parked) | {stage: survey} | N131 |
| X44 | same seed, same game: two pages on one seed draw alike and stand alike after 300 s with the weather in it; the rules' dice are Mid's rng draw for draw, BEAT and the grid squares Mid's; unitsNear finds exactly what a full scan finds, bldsNear every building a scan finds | {stage: page} | N132 |
| X45 | a comment in code written in words instead of its code, a code not in the Comments book, or a Comments entry no code names | {stage: code} | N153 |
| X46 | every store in or out goes through earn and spend: an earning, a Home built and scrapped at 10%, a villager queued and taken back, an age, the people eating, a spend and the minute's turn leave the stores, the minute's flow, its velocity and the ledger and its lines as Mid's frozen code leaves them; fmt, plural, some, orList, slowPct and coord read as Mid's; 300 s of four sides' play balance the ledger to the unit | {stage: page} | N132 |
| X47 | a kind's numbers after research are Mid's stats(), maxHpB, unitCost, techCost and rehealth with its shares added, not multiplied (QCA); a Home's health is D139 × (1 + Σ shares); the lowest is kept; a find's rate and the walk read the law | {stage: page} | N154 |
| X48 | the odds of a battle are Mid's frozen unitPower, powerOf, powerFrom, matchup and lanchester for the same armies and towers (Mid's values, a tower 120, the people 250); a villager walled in from every find does not crash and ends idle or waiting | {stage: page} | N157 |

## screen

| Code | Name | Value | Cited |
|---|---|---|---|
| SN1 | the mold: six slots a row, a slot 44 tall (Apple's least touch target), gaps and edges 6 | {slots: 6, slot: 44, gap: 6} | N133 |
| SN2 | the Build tabs: six, up to nine buildings each, three to a row (each cell two slots wide) | {Home: [BTC1, BR1, BR2, BCR2, BP4, BP6, BP7], Land: [BCL1, BI1, BCL2, BI3, BCT2, BI2, BCL3, BCL4, BI5], Trade: [BCR1, BCT1, BI6, BI4, BI7, B | N134 |
| SN3 | buildings not on the Build menu: the Throne is the map's; the camp tents come with the camp wagon | [BS1, BTC5, BTC6, BTC7, BTC8] | N135 |
| SN4 | a card's rows, in order: a row shows when the subject ticks what it names (none: always) | [[title, null], [health, Health], [load, Gather], [store, Yield], [queue, Spawn], [train, Spawn], [tech, Research], [acts, null]] | N136 |
| SN5 | the top ribbon: the five stores, sound, play, mail | [food, wood, stone, gold, iron, mute, play, mail] | N137 |
| SN6 | readings with no row: the second top row was cut, each waits for its new home | [season and time of day, the clock to the bell, people and room, idle villagers, records, rank, army] | N138 |
| SN10 | the Start page | {ticks: [Tall], rows: the new game's choices} | N139 |
| SN11 | the Build page | {ticks: [], rows: title, the six tabs, the tab's grid} | N140 |
| SN12 | the Town Center page | {ticks: [Tall], rows: title, three tabs, the queue, train, tech} | N141 |
| SN13 | the Yard | {ticks: [Tall], rows: title, the layers, Fast and New, the three volumes} | N142; N143 |

## shells

| Code | Name | Value | Cited |
|---|---|---|---|
| R1 | Tree | [Yield] | N144 |
| R5 | Bush | [Yield] | N144 |
| R2 | Gold | [Yield] | N144 |
| R3 | Stone | [Yield] | N144 |
| R4 | Iron | [Yield] | N144 |
| MG1 | Ruins | [Yield] | N144 |
| MG2 | Cemetery | [] | N144 |
| MG3 | Campfire | [Yield] | N144 |
| MG4 | Treasure | [Yield] | N144 |
| BTC1 | Town Center | [Seat, Drop-off, Spawn, Shoot, House, Research, Health] | N144 |
| BTC2 | Castle | [] | N144 |
| BTC5 | Medical tent | [] | N144 |
| BTC6 | Training tent | [] | N144 |
| BTC7 | Mess tent | [] | N144 |
| BTC8 | Camp tower | [Shoot] | N144 |
| BR1 | Home | [House, Health] | N144 |
| BR2 | Apartment | [] | N144 |
| BCR1 | Market | [] | N144 |
| BCR2 | Tavern | [] | N144 |
| BCL1 | Farm | [Field, Health] | N144 |
| BCL2 | Tree farm | [] | N144 |
| BCL3 | Pasture | [] | N144 |
| BCL4 | Quarry | [] | N144 |
| BCT1 | Trade post | [] | N144 |
| BCT2 | Dock | [] | N144 |
| BP1 | School | [] | N144 |
| BP2 | Library | [] | N144 |
| BP3 | Temple | [] | N144 |
| BP4 | Baths | [] | N144 |
| BP5 | Theatre | [] | N144 |
| BP6 | Hospital | [] | N144 |
| BP7 | Aqueduct | [] | N144 |
| BP8 | Courthouse | [] | N144 |
| BP9 | Hall | [] | N144 |
| BP10 | War Council | [] | N144 |
| BI1 | Mill | [Drop-off, Health] | N144 |
| BI2 | Lumber camp | [Drop-off, Health] | N144 |
| BI3 | Mining camp | [Drop-off, Health] | N144 |
| BI4 | Store | [] | N144 |
| BI5 | Depot | [] | N144 |
| BI6 | Mint | [] | N144 |
| BI7 | Foundry | [] | N144 |
| BI8 | Workshop | [] | N144 |
| BI9 | Smith | [] | N144 |
| BM1 | Barracks | [Spawn, Health] | N144 |
| BM2 | Range | [Spawn, Health] | N144 |
| BM3 | Stable | [Spawn, Health] | N144 |
| BM4 | Siege workshop | [Spawn, Health] | N144 |
| BW1 | Wall | [Health] | N144 |
| BW2 | Gate | [Health] | N144 |
| BW3 | Tower | [Shoot, Health] | N144 |
| BW4 | Palisade | [Health] | N144 |
| BF5 | Abatis | [] | N144 |
| BS1 | Throne | [] | N144 |
| BS2 | Wonder | [] | N144 |
| UV | Villager | [Walk, Gather, Carry, Build, Repair, Fight, Health] | N144 |
| UM1 | Foot | [Walk, Fight, Health] | N144 |
| UM2 | Archers | [Walk, Fight, Shoot, Health] | N144 |
| UM3 | Riders | [Walk, Fight, Health] | N144 |
| UM4 | Engines | [Walk, Fight, Health] | N144 |
| UM4b | Engines | [Walk] | N144 |
| US1 | Priest | [Walk] | N144 |
| US2 | Medic | [Walk] | N144 |
| US3 | Spy | [Walk] | N144 |
| US4 | Scout | [Walk, Fight, Scout, Health] | N144 |
| UT1 | Caravan | [Walk, Carry, Trade] | N144 |
| UT2 | Camp wagon | [Walk, Carry] | N144 |
| MH1 | Outlaws | [Walk] | N144 |
| MH3 | Robbers | [Walk] | N144 |
| MH4 | Vagabonds | [Walk] | N144 |
| MH5 | Wayfarers | [Walk] | N144 |
| MW3 | Deer | [Walk, Wander, Prey, Health] | N144 |
| MW4 | Wolf | [Walk, Wander, Fight, Health] | N144 |
| MW6 | Bear | [Walk, Wander, Fight, Health] | N144 |

## sound

| Code | Name | Value | Cited |
|---|---|---|---|
| HM1 | wood: a struck mode dies with time constant tau ÷ Hz | {tau: 3.2, modes: [[1, 1], [2.756, 0.25]]} | N59; N86 |
| HM2 | stone | {tau: 12, modes: [[1, 1], [2.756, 0.35], [5.404, 0.12]]} | N59; N86 |
| HM3 | metal: rings on | {tau: 447, modes: [[1, 1], [2.756, 0.5], [5.404, 0.3]]} | N59; N86 |
| HU1 | a tap on the glass | [0.03, [tone, 700, 0.05, triangle, 0.16]] | N145 |
| HU2 | a dim cell: it only says why | [0.2, [tone, 180, 0.12, square, 0.1], [tone, 140, 0.14, square, 0.1, 0, 0.09]] | N145 |
| HU3 | a site placed | [0.1, [hiss, 0.08, 0.3, 500, 1], [tone, 120, 0.1, sine, 0.3, 70]] | N145 |
| HU4 | a building raised: two wooden knocks | [0.2, [knock, wood, 220, 0.4], [knock, wood, 330, 0.3, 0.12, 0.5]] | N145 |
| HU5 | a place of war raised: a drum, then a horn | [0.2, [hiss, 0.08, 0.35, 180, 1, 90], [tone, 80, 0.25, sine, 0.35, 55], [tone, 196, 0.5, sawtooth, 0.09, 220, 0.2], [tone, 262, 0.6, sawtoot | N145 |
| HU6 | a villager trained: a light chime | [0.34, [tone, 440, 0.08, sine, 0.2], [tone, 587, 0.14, sine, 0.2, 0, 0.08]] | N145 |
| HU7 | a soldier trained: a short brass call | [0.34, [tone, 294, 0.12, sawtooth, 0.08], [tone, 392, 0.12, sawtooth, 0.08, 0, 0.11], [tone, 440, 0.3, sawtooth, 0.09, 0, 0.22]] | N145 |
| HU8 | a new age: the chord spreads across the ears | [1, [tone, 523, 0.3, triangle, 0.22, 0, 0, -0.675], [tone, 659, 0.3, triangle, 0.22, 0, 0.14, -0.225], [tone, 784, 0.3, triangle, 0.22, 0, 0 | N145 |
| HU9 | the game won | [1, [tone, 392, 0.4, triangle, 0.22], [tone, 523, 0.4, triangle, 0.22, 0, 0.16], [tone, 659, 0.4, triangle, 0.22, 0, 0.32], [tone, 784, 0.4, | N145 |
| HU10 | the game lost | [1, [tone, 392, 0.55, triangle, 0.22], [tone, 349, 0.55, triangle, 0.22, 0, 0.3], [tone, 311, 0.55, triangle, 0.22, 0, 0.6], [tone, 262, 0.5 | N145 |
| HU11 | a unit picked: its tool creaks | [0.15, [knock, wood, 330, 0.18, 0, 0.6]] | N145 |
| HU12 | a unit picked: a blade clinks | [0.15, [knock, metal, 1800, 0.08, 0, 0.4]] | N145 |
| HU13 | a unit picked: a bowstring, its fundamental and two harmonics | [0.15, [tone, 180, 0.18, triangle, 0.12], [tone, 360, 0.09, triangle, 0.06], [tone, 540, 0.06, triangle, 0.04]] | N145 |
| HU14 | a unit picked: a horse stamps twice | [0.15, [knock, wood, 90, 0.22, 0, 0.3], [knock, wood, 90, 0.22, 0.11, 0.3]] | N145 |
| HU15 | gold from anything but your own mint: a soft bell | [3, [tone, 523, 0.45, sine, 0.1], [tone, 784, 0.6, sine, 0.08, 0, 0.12]] | N146 |
| HU16 | zeal: a rising call | [2, [tone, 262, 0.5, triangle, 0.18, 523], [tone, 392, 0.5, sine, 0.12, 784, 0.1], [hiss, 0.4, 0.1, 2000, 1, 5000]] | N146 |
| HU17 | a travelling show | [2, [tone, 784, 0.12, triangle, 0.1], [tone, 988, 0.12, triangle, 0.1, 0, 0.1], [tone, 1175, 0.12, triangle, 0.1, 0, 0.2], [tone, 988, 0.12, | N146 |
| HU18 | a beast | [4, [tone, 90, 0.9, sawtooth, 0.14, 60], [hiss, 0.9, 0.3, 500, 0.8, 150]] | N146 |
| HW1 | a site raised, a blow | [0.25, [hiss, 0.04, 0.3, 2200, 3], [tone, 900, 0.05, square, 0.06, 500]] | N145 |
| HW2 | an axe in a trunk | [0.18, [knock, wood, 220, 0.3]] | N145 |
| HW3 | a pick on rock | [0.18, [knock, stone, 1400, 0.12]] | N145 |
| HW4 | gold into the store: two coins | [0.1, [knock, metal, 1319, 0.08, 0, 0.3], [knock, metal, 1760, 0.08, 0.07, 0]] | N145 |
| HW5 | hands at a bush: a light pluck | [0.3, [tone, 520, 0.05, sine, 0.07, 700]] | N146 |
| HC1 | a blow lands | [0.07, [hiss, 0.05, 0.28, 900, 1], [tone, 160, 0.06, sawtooth, 0.12, 90]] | N145 |
| HC2 | a blow on a building | [0.1, [tone, 90, 0.12, triangle, 0.3, 60], [hiss, 0.08, 0.2, 300, 1]] | N145 |
| HC3 | a heavy impact: the struck one is sent back | [0.12, [tone, 70, 0.1, triangle, 0.38, 40], [hiss, 0.06, 0.25, 400, 1]] | N147 |
| HC4 | an arrow loosed | [0.07, [hiss, 0.12, 0.2, 3000, 2, 1200]] | N145 |
| HC5 | a building falls | [0.3, [hiss, 0.7, 0.45, 400, 0.7, 100], [tone, 70, 0.5, sawtooth, 0.22, 35]] | N145 |
| HC6 | a wave sets out | [8, [tone, 196, 0.35, sawtooth, 0.1, 220], [tone, 220, 0.55, sawtooth, 0.1, 262, 0.35], [tone, 98, 0.9, triangle, 0.2]] | N145 |
| HC7 | a hand gun | [0.12, [hiss, 0.16, 0.5, 900, 1, 200], [tone, 120, 0.16, sawtooth, 0.26, 50]] | N146 |
| HC8 | a siege gun, a blast | [0.25, [hiss, 0.55, 0.6, 320, 0.8, 80], [tone, 62, 0.5, sawtooth, 0.36, 30]] | N146 |
| HA1 | a bird in a tree you can see, by day, not in winter | [1, [tone, 2600, 0.07, sine, 0.04, 3400], [tone, 3000, 0.08, sine, 0.04, 3600, 0.12]] | N145 |
| HA2 | a cricket at night, not in winter | [1, [tone, 4300, 0.03, square, 0.012], [tone, 4300, 0.03, square, 0.012, 0, 0.06], [tone, 4300, 0.03, square, 0.012, 0, 0.12], [tone, 4300,  | N145 |
| HA3 | thunder, after the flash by the real delay | [0.5, [hiss, 0.12, 0.5, 2500, 0.8, 600], [hiss, 2.2, 0.4, 160, 0.5, 50, 0.05], [tone, 45, 1.8, sine, 0.25, 30]] | N145 |
| HA4 | the wind, as hard as it blows | [4, [hiss, 2.4, 0.08, 500, 0.6, 280]] | N146 |
| HA6 | a stampede: a rolling drum of hooves | [1, [tone, 70, 0.08, sine, 0.3, 40], [hiss, 0.05, 0.18, 400, 1, 200], [tone, 70, 0.08, sine, 0.3, 40, 0.13], [hiss, 0.05, 0.18, 400, 1, 200, | N146 |
| HA7 | the ground shakes | [1.5, [tone, 38, 1.6, sine, 0.4, 28], [hiss, 1.4, 0.3, 120, 0.6, 60]] | N146 |
| HE1 | which event plays which sound (a find's own sound and a unit's voice sit on its shell) | {tap: tap, err: err, place: place, built: done, builtWar: doneWar, trained: ready, trainedSol: readySol, age: age, win: win, lose: lose, rai | N97 |
| HX1 | the ear: the lens's field of view, the air's loss in dB a km, the quietest heard, the speed of sound in m/s | {fov: 60, alphaKm: 5, floor: 0.03, c: 340} | N58 |
| HX2 | which sounds are ambience and which alerts (the rest are effects) | {amb: [bird, cricket, thunder, wind, hooves, rumble], alert: [age, win, lose, done, doneWar, ready, readySol, coin, horn, tribute, zeal, jin | N145; N146 |
| HX3 | voices at once; how many each kind leaves free | {max: 14, keep: {alert: 0, fx: 2, amb: 5}} | N145 |
| HX4 | songs a second a singer in view (a Poisson rate), and the most singers counted | {bird: 0.025, cricket: 0.04, singers: 12} | N12; N145 |
| HX5 | the air's top: Hz with no snow, Hz under full snow; how much rain masks a quiet sound | {open: 16000, snow: 2500, rainMask: 0.5} | N88; N97 |
| HX6 | which events are also felt, milliseconds of buzz | {place: 8, done: 25, doneWar: 25, impact: 25, fell: 40, strike: 40, err: 8} | N145 |
| HX7 | how far a sound carries before it fades to the quietest heard, metres: thunder about 10 miles | {thunder: 16093} | N89 |
| HX8 | the phone's audio session: ambient obeys the Ring/Silent switch and plays under the player's own music | ambient | N148 |
| HX9 | the limiter: a battle's many blows never clip a phone speaker (dB, dB, ratio, seconds, seconds) | {threshold: -3, knee: 10, ratio: 4, attack: 0.005, release: 0.25} | N146 |
| HX10 | the three volumes the player sets, a step a tap | {steps: [[1, Full], [0.5, Half], [0, Off]], names: {fx: Effects, alert: Alerts, amb: Ambience}} | N149 |

## sprites

| Code | Name | Value | Cited |
|---|---|---|---|
| P1 | the vil figure | {brush: worker, o: {tunic: #8a6a44, trim: $side, sash: $side, head: bare, legs: #5a4a38, beard: #6b4a2c}, box: [30, 30]} | N150 |
| P2 | the spear figure | {brush: person, o: {tunic: $side, head: bare, shield: round, weapon: spear, legs: #6b5a40, beard: #4a3420}, box: [52, 34]} | N150 |
| P3 | the archer figure | {brush: person, o: {tunic: $side, head: hood, weapon: bow, legs: #5a4a38}, box: [26, 30]} | N150 |
| P4 | the cata figure | {brush: cata, box: [58, 36]} | N150 |
| P5 | the ram figure | {brush: ram, box: [42, 30]} | N150 |
| P6 | the catapult figure | {brush: catapult, box: [32, 26]} | N150 |
| P7 | the priest figure | {brush: person, o: {tunic: #efe6cf, trim: #c9a227, body: robe, head: bare, weapon: staff, sash: $side, legs: #d8cdb2, beard: #d8d0c0}, box:  | N150 |
| P8 | the medic figure | {brush: person, o: {tunic: #e4dccb, trim: $side, head: cap, capCol: #e4dccb, weapon: bag, sash: #c23a30, legs: #6b5a48}, box: [26, 30]} | N150 |
| P9 | the spy figure | {brush: person, o: {tunic: #2a2a30, trim: $side, body: robe, head: hood, hoodCol: #1c1c22, weapon: dagger, cape: #1c1c22, legs: #22222a}, bo | N150 |
| P10 | the scout figure | {brush: person, o: {tunic: $side, head: cap, capCol: $side*0.6, weapon: staff, cape: $side*0.6}, box: [44, 34]} | N150 |
| P11 | the caravan figure | {brush: caravan, box: [36, 30]} | N150 |
| P12 | the wagon figure | {brush: wagon, box: [48, 32]} | N150 |
| P13 | the bandit figure | {brush: person, o: {tunic: #5a5040, head: hood, hoodCol: #4a3e2e, weapon: club, legs: #3a3228, beard: #3a2a1a}, box: [26, 30]} | N150 |
| P14 | the robber figure | {brush: person, o: {tunic: #4a3a30, head: mask, weapon: sword, shield: round, trim: #6b3a2a, legs: #2e2620}, box: [26, 30]} | N150 |
| P15 | the vagabond figure | {brush: person, o: {tunic: #6a5e4e, head: bare, weapon: none, legs: #4a4038, beard: #4a3a2a, sash: #8a3a2a}, box: [26, 30]} | N150 |
| P16 | the wayfarer figure | {brush: person, o: {tunic: #7a6a50, head: straw, weapon: crook, legs: #5a4a38, beard: #8a8070, cape: #6b5a40}, box: [26, 30]} | N150 |
| P17 | the deer figure | {brush: quad, o: {col: #a0703e, len: 13, h: 5.6, legH: 7.4, legW: 0.6, head: 2.2, headY: 1.8, antlers: true, tail: 0.8}, box: [26, 22]} | N150 |
| P18 | the wolf figure | {brush: quad, o: {col: #7a7570, len: 13, h: 5, legH: 5.2, legW: 0.7, head: 2.2, headY: 1, tail: 1.6}, box: [24, 16]} | N150 |
| P19 | the bear figure | {brush: quad, o: {col: #4e3524, len: 17, h: 9, legH: 4.5, legW: 1.5, head: 3.2, headY: 0.8, hump: true, tail: 0}, box: [30, 22]} | N150 |
| PB1 | the castle building picture | {top: 66} | N151 |
| PB2 | the town building picture | {top: 52} | N151 |
| PB3 | the keep building picture | {top: 62} | N151 |
| PB4 | the tower building picture | {top: 84} | N151 |
| PB5 | the wonder building picture | {top: 72} | N151 |
| PB6 | the library building picture | {top: 56} | N151 |
| PB7 | the temple building picture | {top: 50} | N151 |
| PB8 | the theatre building picture | {top: 44} | N151 |
| PB9 | the apartment building picture | {top: 46} | N151 |
| PB10 | the aqueduct building picture | {top: 40} | N151 |
| PB11 | the siege building picture | {top: 40} | N151 |
| PN1 | the finds: their scale, and their dot far out | {scale: {tree: 0.88, bush: 1.45, other: 1.25}, dot: {tree: #3c6c32, bush: #3f6b33, gold: gold, stone: rock, iron: ruin, ruins: ruin, cemeter | N152 |

## tech

| Code | Name | Value | Cited |
|---|---|---|---|

## words

| Code | Name | Value | Cited |
|---|---|---|---|
| J1 | the ledger's word for each reason a store goes in or out (Mid's LEDGER_WORD; the Throne's tithe waits on the Throne, the vassals' tax is parked) | {gather: gathered, orders: marching orders, camps: camp supply, finds: finds, trade: trade, tribute: tribute, ransom: ransoms, market: the M | N132 |
| J2 | a ledger line with nothing on it | nothing yet | N132 |
| J3 | a list said: 'a, b or c'; a ledger line's items apart | {and: , , or:  or , dot:  · } | N132 |
| J4 | a number shortened: 1.2k | k | N132 |
| J5 | one, two: the first ending that fits, as [pattern, flags, ending] (a man-at-arms, men-at-arms; a spearman; a wolf; an ally; a ditch; the rest take s) | [[^(m)an(-at-arms)$, i, $1en$2], [man$, , men], [(wol)f$, i, $1ves], [([^aeiou])y$, , $1ies], [(s/x/ch/sh)$, , $1es], [$, , s]] | N132 |
| J6 | the map's lettered squares: a letter across, a number down (A1 to V22 on the board, D190) | ABCDEFGHIJKLMNOPQRSTUVWXYZ | N132 |

