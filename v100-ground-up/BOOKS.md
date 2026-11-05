# First Keep v100 · the Books

Written by `index.py` from `books/*.js`, never by hand. Each book is the one home of what it holds; the game reads the files, this page shows them.

## angles

| Code | Name | Value | Cited |
|---|---|---|---|
| A1 | the grid's turn on the screen | 15 | Design: Albert, Nov 4 (the turned grid, "B") |
| A2 | the camera's rise over the ground | 41 | Design: Albert, Nov 5: matched to Base's squash of 0.66 (sin 41.3°), the look he |
| A3 | the angle of repose, dry sand: steeper is a face, not a slope | 34 | N64 |

## capabilities

| Code | Name | Value | Cited |
|---|---|---|---|
| SC0 | what every shell has: a name, its ticks, its citation | {by: every book of shells, law: [], needs: [name, ticks, cite], may: [layer]} | Design: Albert, Nov 5 (the mold) |
| SC01 | the mold of a find (layer 100) | {by: shells (finds), law: [], needs: [find, look], may: [room, sound]} | Design: Albert, Nov 5 (the mold) |
| SC02 | the mold of a building (layer 110) | {by: shells (buildings), law: [], needs: [size, style, look, material], may: []} | Design: Albert, Nov 5 (the mold) |
| SC03 | the mold of a walker (layer 120) | {by: shells (units, moveables), law: [], needs: [look, pace, body], may: []} | Design: Albert, Nov 5 (the mold) |
| SC04 | the mold of a page (the Screen book) | {by: books/screen.js, law: [], needs: [], may: [rows]} | Design: Albert, Nov 5 (menus are shells) |
| SC1 | walks the tiles at its pace | {by: index.html floor 5: step, findPath, law: [QBL, QBM, QBU], needs: [pace, body], may: [mount, kit, voice]} | Design: v100 floor 5, Nov 4 |
| SC2 | works a find and fills a load; also counts it among the people | {by: econ.js, law: [QBN, QW], needs: [body], may: []} | Design: v100 floor 9, Nov 5 |
| SC3 | takes a load to the nearest drop-off of its side | {by: econ.js, law: [QBN], needs: [body], may: []} | Design: v100 floor 9, Nov 5 |
| SC4 | raises a site | {by: econ.js, law: [QAC], needs: [body], may: []} | Design: v100 floor 9, Nov 5 |
| SC5 | mends a hurt building | {by: econ.js, law: [QAC], needs: [body], may: []} | Design: v100 floor 9, Nov 5 |
| SC6 | strikes; without Gather it is a soldier; a wild one with it bites | {by: combat.js, law: [QBO, QAG, QBT], needs: [D138], may: []} | Design: v100 floor 10, Nov 5 |
| SC7 | looses at range (a building that shoots reads D143) | {by: combat.js, law: [QAL], needs: [D143/D138], may: []} | Design: v100 floor 10, Nov 5 |
| SC8 | has health, and sways when badly hurt | {by: combat.js, index.html, law: [QBS], needs: [D138/D139], may: []} | Design, Nov 5 |
| SC9 | wanders when idle (a Poisson wait) | {by: index.html step, law: [QM], needs: [pace], may: []} | Design: v100 floor 5, Nov 4 |
| SC10 | can be hunted | {by: menu.js (hunting not built yet), law: [], needs: [], may: []} | Design: v100 floor 5, Nov 4 |
| SC11 | a side's seat: the game opens on it, and a side falls with its last | {by: econ.js, ai.js, menu.js, law: [QBW], needs: [], may: []} | Design: v100 floor 9, Nov 5 |
| SC12 | takes in the yields its row lists | {by: index.html dropFor, ai.js, law: [QBN], needs: [drop], may: []} | Design: v100 floor 4, Nov 4 |
| SC13 | trains the units D133 gives it | {by: econ.js, law: [], needs: [D133], may: []} | Design: v100 floor 9, Nov 5 |
| SC14 | houses the people D127 gives it | {by: econ.js, ai.js, law: [], needs: [D127], may: []} | Design: v100 floor 9, Nov 5 |
| SC15 | where the ages are reached | {by: menu.js, econ.js, law: [], needs: [], may: []} | Design: v100 floor 9, Nov 5 |
| SC16 | a building that yields, at the rate its row points to | {by: econ.js, ai.js, law: [QBN], needs: [yield, rate], may: []} | Design: v100 floor 9, Nov 5 |
| SC17 | a find: holds an amount of a yield | {by: econ.js, law: [QBN], needs: [yield, amount], may: []} | Design: v100 floor 3, Nov 4 |
| SC18 | scouts (not built yet) | {by: waiting, law: [], needs: [], may: []} | Design: dictionary SC |
| SC19 | trades (not built yet) | {by: waiting, law: [], needs: [], may: []} | Design: dictionary SC |
| SC20 | a page that keeps its own height (the Town Center, the Start page); every other page shares the tallest of the rest | {by: menu.js, law: [], needs: [], may: []} | Design: Albert, Nov 5 07:35 |

## citations

| Code | Name | Value | Cited |
|---|---|---|---|
| N1 | opened | Spherical astronomy, the altitude formula (standard) | |
| N2 | opened | Meeus, Astronomical Algorithms, 2nd ed. (1998) | |
| N3 | opened | JPL, Approximate Positions of the Planets (1800–2050) | |
| N4 | opened | Mallama & Hilton (2018), colour indices | |
| N5 | opened | Ballesteros (2012), colour index to temperature | |
| N6 | opened | (retired: satellites cut, Stone Age) | |
| N7 | opened | Gabriel & Neumann (1962), QJRMS 88 | |
| N8 | opened | Jennings, Winchell, Livneh & Molotch (2018), Nature Communications 9:1148 | |
| N9 | opened | Atlas, Srivastava & Sekhon (1973); Gunn & Kinzer (1949) | |
| N10 | opened | Koschmieder (1924) | |
| N11 | opened | WCAG 2.3.1, three flashes | |
| N12 | opened | Poisson (1837); Feller, An Introduction to Probability Theory, vol. 1 | |
| N13 | opened | Pandolf, Givoni & Goldman (1977) | |
| N14 | opened | Hock (2003), degree-day melt | |
| N15 | opened | US Army Corps of Engineers (1956), Snow Hydrology | |
| N16 | opened | First-order lag (standard); Cukjati, Reberšek & Miklavčič (2001) | |
| N17 | opened | Stefan (1891) | |
| N18 | opened | Bowden & Hughes (1939), friction on ice and snow | |
| N19 | opened | Hanson et al. (1999), slip and the grip a step needs | |
| N20 | to open | Bekker (1960), Off-the-Road Locomotion: pressure–sinkage p = (kc/b + kφ) zⁿ; Wong, Theory of Ground Vehicles (multi-pass) — from memory, to  | |
| N21 | opened | Rothermel (1972); USDA RMRS-GTR-371 | |
| N22 | opened | Heskestad (1984); NFPA 72, the t² fire | |
| N23 | opened | Holling (1959), Can. Entomol. 91 | |
| N24 | opened | Charnov (1976), Theor. Pop. Biol. 9 | |
| N25 | opened | Fretwell & Lucas (1970) | |
| N26 | opened | Sutherland (1983) | |
| N27 | opened | Verhulst (1838) | |
| N28 | opened | Schaefer (1954) | |
| N29 | to open | White (1962), Medieval Technology and Social Change: three-field rotation raised the sown share from 1/2 to 2/3 — from memory; Rothamsted Br | |
| N30 | opened | Wright (1936), learning curve | |
| N31 | opened | Thomas & Smith (1990), overmanning | |
| N32 | opened | Labuza, first-order food loss | |
| N33 | opened | FAO, Grain storage techniques, ch. 6 | |
| N34 | opened | Andreyeva, Long & Brownell (2010), food price elasticities | |
| N35 | opened | Lanchester (1916), Aircraft in Warfare | |
| N36 | opened | Churchill, Saffidine & Buro (2012), AIIDE | |
| N37 | opened | Cox & Smith (1961), Queues | |
| N38 | opened | Maynard Smith & Price (1973), hawk–dove | |
| N39 | opened | Projectile motion from a height (standard) | |
| N40 | opened | Drag on a sphere (standard fluid dynamics) | |
| N41 | opened | Horizon from a height, √(2Rh) (standard) | |
| N42 | opened | Bresenham (1965), grid line | |
| N43 | opened | Pulliam (1973) | |
| N44 | opened | Lima (1995) | |
| N45 | opened | Ydenberg & Dill (1986) | |
| N46 | opened | Thermal resistance in series (standard) | |
| N47 | opened | Kermack & McKendrick (1927), Proc. R. Soc. A 115 | |
| N48 | opened | Bootsma & Ferguson (2007), PNAS 104(18) | |
| N49 | opened | Goldberg (1989), roulette-wheel selection | |
| N50 | opened | Hertz (1882), contact | |
| N51 | opened | Auerbach (1891), crack threshold | |
| N52 | opened | Weibull (1951), strength by size | |
| N53 | opened | Plane geometry, shadow length | |
| N54 | opened | Black-body colour; inverse-square light | |
| N55 | opened | Briggs (1969), plume rise | |
| N56 | opened | Pasquill–Gifford dispersion | |
| N57 | opened | Damped harmonic oscillator (standard) | |
| N58 | opened | ISO 9613-2, sound outdoors | |
| N59 | opened | Klatzky, Pai & Krotkov (2000), Presence 9 | |
| N60 | opened | Mandelbrot (1967), Science 156 | |
| N61 | opened | Downing et al. (2006), lake sizes | |
| N62 | opened | Leopold & Maddock (1953), USGS Paper 252 | |
| N63 | opened | Hutchinson (1957), shoreline development | |
| N64 | to open | Angle of repose, dry sand about 34° (Al-Hashemi & Al-Amoudi 2018, Powder Technology 330, a review; from memory, to open) | |
| N65 | opened | Ettinger (2017), Mulberry32, a 32-bit generator; the seed of the day is the game's own rule | |
| N66 | to open | Parallel (dimetric) projection; the classic turned-view RTS draws the ground at 2:1, a camera 30° over the ground (from memory: Age of Empir | |
| N67 | to open | Wave refraction on an indented coast: energy converges on headlands, diverges in bays (coastal geomorphology, standard; Bird, Coastal Geomor | |
| N68 | to open | Towns and roads at fords: Oxford, Frankfurt (Franconofurd, the Franks' ford), Bedford; the record, from memory | |
| N69 | to open | Age of Empires II (1999), the genre's prices and amounts: the second age 500 food, a villager 50 food, a house 25 wood, the mill and the lum | |
| N70 | opened | First Keep Build 42 (Oct 28), the old game's own gathering rates a second: berries 0.9, trees 0.75, gold 0.6, stone 0.55, iron 0.5 (its time | |
| N71 | to open | Bohannon (1997), Age and Ageing 26: comfortable walking speed about 1.4 m/s (from memory, to open) | |
| N72 | to open | Horse gaits: walk about 1.7 m/s, trot about 3.6 m/s (standard equine, from memory) | |
| N73 | to open | Travel speeds of deer, wolf and bear at a walk or trot (natural history, standard; from memory, to open) | |
| N74 | opened | Hart, Nilsson & Raphael (1968), IEEE Trans. SSC 4: A* | |
| N75 | opened | First Keep Build 42 (Oct 28), the old game's SCORE: unit 5, bld 5, tech 5, wealth 10 (its weights, kept) | |
| N76 | to open | Dupuy (1987), Understanding War: forces break at losses well short of annihilation; the classic breakpoint near 30% (from memory, to open) | |
| N77 | opened | Ranger Medic Handbook (2025), p. 45, the classes of haemorrhagic shock: I up to 15% blood lost, slightly anxious; II 15–30%, mildly anxious; | |
| N78 | opened | FBI Academy, Handgun Wounding Factors and Effectiveness (Patrick, 1989): short of a hit to the brain or upper spinal cord, a wounded man is  | |
| N79 | opened | NAVMC 2691, Marine Corps Drill and Ceremonies Manual: quick time is 120 steps a minute at 30 inches a step (3.4 mph, 1.52 m/s); summary open | |
| N80 | to open | Winter (1995), Human balance and posture control during standing and walking, Gait & Posture 3: quiet standing as an inverted pendulum; the  | |
| N81 | opened | Engineering ToolBox, Friction coefficients for common materials: rubber on dry concrete 0.6–0.85, on wet 0.45–0.75; car tyre on dry grass 0. | |
| N82 | opened | Conservation of momentum; the perfectly inelastic collision v = m₁v₁ / (m₁ + m₂) (standard mechanics) | |
| N83 | opened | Sliding to rest under Coulomb friction: d = v² / (2 μ g) (standard mechanics) | |
| N84 | to open | ICRP Publication 23 (1975), Reference Man: 70 kg (from memory, to open) | |
| N85 | to open | Masses of animals and arms: horse about 500 kg, deer 70, wolf 40, bear 200; spear 2.5 kg, shield 5, scale armour 12, lance 4; strides and bl | |
| N86 | to open | Rossing, The Science of Sound: the modes of a free bar at 1 : 2.756 : 5.404 (from memory, to open; carried from Base) | |
| N87 | to open | Densities: timber about 600 kg/m³, stone about 2,400, iron 7,870 (standard tables, from memory, to open) | |
| N88 | to open | Fresh snow is porous and absorbs sound, high frequencies most: a snowy landscape sounds muffled (acoustics of snow, from memory, to open) | |

## colours

| Code | Name | Value | Cited |
|---|---|---|---|
| C1 | Water | #2a6488 | Design: v100 floor 1, Nov 4 |
| C2 | Sand | #cdbb88 | Design: v100 floor 1, Nov 4 |
| C3 | Dirt | #785c3a | Design: v100 floor 1, Nov 4 |
| C4 | Grass | #4a6634 | Design: v100 floor 1, Nov 4 |
| C5 | Ring blue, the player | #6aaeff | Design: v100, Nov 4 |
| C6 | Ring green | #5fd08a | Design: v100, Nov 4 |
| C7 | Ring red | #ff6b5b | Design: v100, Nov 4 |
| C8 | Ring white | #ece5d3 | Design: v100, Nov 4 |
| C10 | Gold (on) | #e6b947 | Design: v100, Nov 4 |

## ground

| Code | Name | Value | Cited |
|---|---|---|---|
| G5 | dry grass | {mu: 0.35} | N81 (car tyre on dry grass, 0.35: the nearest measured pair) |
| G6 | mud: wet ground or marsh | {mu: 0.25} | Design, Nov 5: no measured value found; set between grass and snow |
| G7 | snow cover | {mu: 0.14} | N81 (waxed wood on wet snow, 0.14 static); N18 |
| G8 | ice that bears a walker | {mu: 0.1} | N81 (ice on ice, 0.1 static); N18 |

## mass

| Code | Name | Value | Cited |
|---|---|---|---|
| W1 | a person | {kg: 70, height: 1.8, com: 0.99, foot: 0.26, stride: 1.524} | N84 (70 kg); N79 (stride: two steps of 30 in); N80 (centre of mass 0.55 of heigh |
| W2 | a horse | {kg: 500, height: 1.6, com: 1.2, foot: 0.6, stride: 2.5} | N85 |
| W3 | a deer | {kg: 70, height: 1.0, com: 0.7, foot: 0.4, stride: 1.5} | N85 |
| W4 | a wolf | {kg: 40, height: 0.8, com: 0.5, foot: 0.35, stride: 1.4} | N85 |
| W5 | a bear | {kg: 200, height: 1.0, com: 0.6, foot: 0.5, stride: 1.2} | N85 |
| W6 | an engine on wheels (ram, catapult) | {kg: 1000, height: 1.5, stride: 2.0} | Design, Nov 5: a timber engine about 1.7 m³ (W12 × volume); stride a wheel's tur |
| W7 | a tool (axe, pick, hammer) | {kg: 2, blow: {kg: 2, mps: 8}} | N85 |
| W8 | a spear | {kg: 2.5, blow: {kg: 2.5, mps: 6}} | N85 |
| W9 | a shield | {kg: 5} | N85 |
| W10 | a bow, its blow an arrow | {kg: 2, blow: {kg: 0.03, mps: 50}} | N85 |
| W11 | scale armour | {kg: 12} | N85 |
| W13 | a lance: a thrust when standing; moving, the whole rider and horse strike (QBT) | {kg: 4, blow: {kg: 4, mps: 6}} | N85 |
| W14 | a wagon's or caravan's load | {kg: 100} | Design, Nov 5 |
| W12 | timber | {density: 600} | N87 |
| W15 | stone | {density: 2400} | N87 |
| W16 | iron | {density: 7870} | N87 |

## measure

| Code | Name | Value | Cited |
|---|---|---|---|
| D1 | the site, the whole world | 3060 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D2 | the board, the played land | 2160 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D3 | the zones' edges from each corner: Z1, Z2, Z3 (Z4 beyond) | [300, 600, 900] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D7 | the play edge, in from the coast | 60 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D8 | Small: a building 2 × 2 tiles | 2 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D9 | Standard: 3 × 3 tiles | 3 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D10 | Medium: 4 × 4 tiles | 4 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D11 | Large: 6 × 6 tiles | 6 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D12 | a tile | 10 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D13 | the land's height over the water | 24 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D14 | the sand's top | 12 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D15 | the dirt's top | 20 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D16 | a beach falls to the water over | 80 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D17 | a cliff falls over | 4 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D18 | the coast wanders in and out by | 24 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D19 | the sea is darkest this far out | 60 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D20 | a day (Y1) | 120 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D21 | a season (Y2) | 180 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D22 | a year (Y3) | 720 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D23 | bare ground this high over the land | 12 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D24 | water deeper than this is not waded | 4 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D25 | lakes, how many | [3, 6] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D26 | a lake's radius | [50, 160] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D27 | a lake's depth at the middle | 12 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D28 | a shore's wander as a share of the radius | 0.25 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D29 | a river's depth | 8 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D30 | a river's half-width as a share of its lake's radius | 0.25 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D31 | a river's wander | 80 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D32 | a bank falls over | 40 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D33 | a ford's length | 40 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D34 | a stream's half-width | 6 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D35 | a stream's depth | 2 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D36 | hills, how many | [2, 4] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D37 | a hill's radius | [80, 160] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D38 | a hill's height | 14 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D39 | rocks, how many | [3, 6] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D40 | a rock's radius | [15, 35] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D41 | a rock's height | 18 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D42 | crevices, how many | [1, 2] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D43 | a crevice's half-width | 8 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D44 | a crevice's floor | 13 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D45 | a crevice's length | [150, 300] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D46 | a road's clear half-width | 50 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D47 | the middle kept clear | 150 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D48 | the woods' longest wave | 500 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D49 | the woods stand where the surface rises past | 0.1 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D50 | the forest wall round a home, from and to | [920, 1080] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D51 | the home pond's spot in the corner's frame | [700, 450] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D52 | the home pond's radius | 50 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D53 | a tree's wood | 100 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D54 | a bush's food | 125 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D55 | a gold pile | 800 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D56 | a stone pile | 350 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D57 | an iron pile | 350 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D58 | a ruin's stone | 200 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D59 | a campfire's food | 100 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D60 | a treasure's gold | 300 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D61 | one age up | 500 | N69 |
| D62 | a villager | 50 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D63 | the mill | 100 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D64 | the lumber camp | 100 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D65 | a home | 25 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D66 | the barracks | 175 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D67 | villagers counted | 6 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D68 | homes counted | 2 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D69 | the margin | 0.25 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D70 | Z1's spots in the corner's frame | {bush: [250, 140], tree: [140, 250], gold: [200, 120], stone: [120, 200]} | Design: v100 floors, Nov 4 (Albert to confirm) |
| D71 | Z3's spots | {bush: [820, 300], tree: [300, 820], iron: [560, 680], stone: [450, 750], gold: [680, 560]} | Design: v100 floors, Nov 4 (Albert to confirm) |
| D72 | Z3 holds this many times Z1 | 3 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D73 | Z4's gold piles | [4, 6] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D74 | stone piles | [3, 5] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D75 | iron piles | [3, 5] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D76 | berry patches | [6, 10] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D77 | bushes a patch | [4, 6] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D78 | ruins | [2, 2] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D79 | cemeteries | [1, 2] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D80 | campfires | [2, 3] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D81 | treasures | [1, 2] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D82 | a thing's stand wanders in its tile by | 3 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D83 | under this many pixels a tile things are dots and the grid is off | 5 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D84 | the Town Center's spot in the corner's frame, Z2 on the road | [380, 380] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D85 | units a metre, from the figure | 11.7 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D86 | speeds in metres a second (walk: quick time, 120 steps of 30 in a minute) | {walk: 1.52, trot: 3.6, horse: 1.7, push: 0.7, deer: 1.5, wolf: 2.5, bear: 1.5} | N71; N72; N73; N79 |
| D87 | a load | 10 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D88 | gathering a second, the old game's own | {bush: 0.9, tree: 0.75, gold: 0.6, stone: 0.55, iron: 0.5} | N70 |
| D89 | the next find within | 100 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D90 | deer herds | [3, 5] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D91 | a herd | [3, 5] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D92 | wolf packs | [2, 3] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D93 | a pack | [2, 3] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D94 | a wander's mean wait | 6 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D95 | its reach | 60 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D96 | drawn frames in one stride (two steps) | 4 | Design: the figures' four-frame walk (preview 49) |
| D97 | a work beat | 0.4 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D98 | frames a second | 30 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D99 | the latitude | 45 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D100 | the seasons' mean air, spring to winter | [10, 22, 12, -6] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D101 | the day's swing | 6 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D102 | P(wet | dry), P(wet | wet) an hour | [0.12, 0.65] | N7 |
| D103 | storms among wet hours | 0.25 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D104 | wet settles in | 20 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D105 | dries out in | 50 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D106 | walking costs of mud and snow | {mud: 0.8, snow: 0.6} | Design: v100 floors, Nov 4 (Albert to confirm) |
| D107 | snow a second when it snows | 0.03 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D108 | melt a °C·s | 0.004 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D109 | ice bears a walker at this many freezing °C·s | 200 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D110 | fog's wait | 240 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D111 | fog stays | 40 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D112 | between flashes | 0.34 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D113 | between strikes in a storm | 6 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D114 | marshy lakes | [1, 2] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D115 | a marsh's width | 40 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D116 | Fast, for testing | 8 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D117 | how far a unit and a building see | {unit: 60, bld: 100} | Design: v100 floors, Nov 4 (Albert to confirm) |
| D118 | the fog's dark over the unseen and the remembered | [0.75, 0.4] | Design: v100 floors, Nov 4 (Albert to confirm) |
| D119 | the fog's beat | 0.5 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D120 | a shadow at most this many heights | 3 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D121 | the blades' strength | 0.45 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D122 | the sides in play | [0, 2] | Design: v100 floors, Nov 5 (Albert to confirm) |
| D123 | what a thing costs | {BTC1: {wood: 275, stone: 100}, BR1: {wood: 25}, BI1: {wood: 100}, BI2: {wood: 100}, BI3: {wood: 100}, BCL1: {wood: 60}, BM1: {wood: 175}, B | N69 |
| D124 | seconds to train | {UV: 25, UM1: 21, UM2: 35, UM3: 30, UM4: 36, US4: 30} | N69 |
| D125 | one villager's seconds to raise a site | {BTC1: 150, BR1: 25, BI1: 35, BI2: 35, BI3: 35, BCL1: 15, BM1: 50, BM2: 50, BM3: 50, BM4: 40, BW1: 10, BW2: 70, BW3: 80, BW4: 5} | N69 |
| D126 | n villagers raise it at n^this | 0.7 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D127 | the people a building houses | {BTC1: 10, BR1: 5} | N69 |
| D128 | the most people | 200 | N69 |
| D129 | an age's price: n × food, (n − 1) × gold, and its wait | {food: 500, gold: 200, time: 90} | Design: v100 floors, Nov 5 (Albert to confirm) |
| D130 | the six ages | [Camp, Village, Town, City, Kingdom, Empire] | Design: v100 floors, Nov 5 (Albert to confirm) |
| D131 | a unit's food a day | 1 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D132 | move on when another find is this much nearer the drop-off | 0.18 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D133 | who trains whom | {BTC1: [UV], BM1: [UM1], BM2: [UM2], BM3: [UM3, US4], BM4: [UM4]} | Design: v100 floors, Nov 5 (Albert to confirm) |
| D134 | the bell | 900 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D135 | the score's divisors | {unit: 5, bld: 5, tech: 5, wealth: 10} | N75 |
| D136 | a farm's food a second | 0.4 | N69 |
| D137 | a find no path reached is left alone for | 60 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D138 | a unit's health, blow, reach, pace, armour, class and counter | {UV: {hp: 25, atk: 3, rng: 1, rof: 1.5, arm: 0, cls: foot}, UM1: {hp: 45, atk: 8, rng: 1, rof: 1, arm: 1, cls: foot, vs: horse}, UM2: {hp: 3 | N69 |
| D139 | a building's health | {BTC1: 2400, BR1: 550, BI1: 600, BI2: 600, BI3: 600, BCL1: 480, BM1: 1200, BM2: 1200, BM3: 1200, BM4: 1500, BW1: 1800, BW2: 2750, BW3: 1020, | N69 |
| D140 | a counter's edge | 1.5 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D141 | a blow from behind | 1.3 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D142 | a wave breaks under this share of its start | 0.3 | N76 |
| D143 | what shoots: blow, reach, pace | {BW3: [5, 8, 2], BTC1: [5, 6, 2], BTC8: [4, 6, 2]} | N69 |
| D144 | a soldier takes up a fight within | 8 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D145 | seconds between its path checks | 1 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D146 | wildlife bites within | 3 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D147 | tiles a chase may search | 2500 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D148 | seconds between a soldier's looks around | 0.5 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D149 | seconds between its rounds | 2 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D150 | villagers wanted by age | [10, 16, 22, 28, 32, 36] | Design: v100 floors, Nov 5 (Albert to confirm) |
| D151 | the share of villagers on each yield by age | [[0.55, 0.45, 0, 0, 0], [0.45, 0.35, 0.15, 0.05, 0], [0.4, 0.3, 0.2, 0.1, 0], [0.35, 0.3, 0.2, 0.1, 0.05], [0.35, 0.3, 0.2, 0.1, 0.05], [0.3 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D152 | a home goes up when fewer than this many places are left | 4 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D153 | a camp goes up when a job's find is farther than this from its drop-off | 12 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D154 | soldiers wanted by age | [4, 8, 12, 16, 20, 24] | Design: v100 floors, Nov 5 (Albert to confirm) |
| D155 | a wave goes at these Lanchester odds | 0.6 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D156 | seconds a wave may make no progress before it goes home | 60 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D157 | villagers sent to a site | 2 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D160 | farms it keeps | 4 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D161 | farms when no bush stands within this of the hall | 25 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D162 | the glass redraws every | 0.25 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D163 | a reason stays | 2.5 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D164 | woods chunks kept drawn | 64 | Design: v100 floors, Nov 5 (Albert to confirm) |
| D165 | the game opens on the Town Center at this share of the screen's width | 0.2 | Design: Albert, Nov 5 (his screenshot of Base) |
| D166 | the screen jolt: pixels a m/s the struck one is sent, at most, for, and from what speed | {px: 1, max: 3, s: 0.08, from: 1.5} | Design: the juice pass of Nov 3 (Base: 2 px, 0.08 s) |
| D167 | blood lost at the shock classes' edges: II, III, IV (health lost read as blood lost) | [0.15, 0.3, 0.4] | N77; N78 |
| D168 | gravity, m/s² | 9.81 | Standard gravity (standard) |
| D169 | the ground a find keeps clear round it, in units | {gold: 9, stone: 9, iron: 9, ruins: 14, cemetery: 12, campfire: 6, treasure: 4} | Design: v100 floors, Nov 4 (Albert to confirm) |
| D170 | a wall piece: one tile | 1 | Design: v100 floors, Nov 4 (Albert to confirm) |
| D171 | the build: First Keep v100, the build number | 100 · 10 | Design: the build log (README) |

## screen

| Code | Name | Value | Cited |
|---|---|---|---|
| SN1 | the mold: six slots a row, a slot 44 tall (Apple's least touch target), gaps and edges 6 | {slots: 6, slot: 44, gap: 6} | Design: Albert, the Rank Ribbon (Oct 30) and the Formation |
| SN2 | the Build tabs: six, up to nine buildings each, three to a row (each cell two slots wide) | {Home: [BTC1, BR1, BR2, BCR2, BP4, BP6, BP7], Land: [BCL1, BI1, BCL2, BI3, BCT2, BI2, BCL3, BCL4, BI5], Trade: [BCR1, BCT1, BI6, BI4, BI7, B | Design: Albert, Nov 5 07:13–07:15 (his Land list; six tabs of up to nine) |
| SN3 | buildings not on the Build menu: the Throne is the map's; the camp tents come with the camp wagon | [BS1, BTC5, BTC6, BTC7, BTC8] | Design: Albert, Nov 5 07:30 |
| SN4 | a card's rows, in order: a row shows when the subject ticks what it names (none: always) | [[title, null], [health, Health], [load, Gather], [store, Yield], [queue, Spawn], [train, Spawn], [tech, Research], [acts, null]] | Design: Albert, Nov 5 07:30 (the Inspector precedent) |
| SN5 | the top ribbon: the five stores, sound, play, mail | [food, wood, stone, gold, iron, mute, play, mail] | Design: Albert's Build 30 top bar |
| SN6 | readings with no row: the second top row was cut, each waits for its new home | [season and time of day, the clock to the bell, people and room, idle villagers, records, rank, army] | Design: Albert, Nov 5 07:36 |
| SN10 | the Start page | {ticks: [Tall], rows: the new game's choices} | Design: Albert, Nov 4 (the setup screen its own height) |
| SN11 | the Build page | {ticks: [], rows: title, the six tabs, the tab's grid} | Design: Albert, Nov 5 |
| SN12 | the Town Center page | {ticks: [Tall], rows: title, three tabs, the queue, train, tech} | Design: Albert, Nov 5 07:34 |
| SN13 | the Yard | {ticks: [], rows: title, the layers, Fast and New} | Design: v100 floor 8, Nov 5 |

## shells

| Code | Name | Value | Cited |
|---|---|---|---|
| R1 | Tree | layer 100 · Yield | |
| R5 | Bush | layer 100 · Yield | |
| R2 | Gold | layer 100 · Yield | |
| R3 | Stone | layer 100 · Yield | |
| R4 | Iron | layer 100 · Yield | |
| MG1 | Ruins | layer 100 · Yield | |
| MG2 | Cemetery | layer 100 · no ticks | |
| MG3 | Campfire | layer 100 · Yield | |
| MG4 | Treasure | layer 100 · Yield | |
| BTC1 | Town Center | layer 110 · Seat, Drop-off, Spawn, Shoot, House, Research, Health | |
| BTC2 | Castle | layer 110 · no ticks | |
| BTC5 | Medical tent | layer 110 · no ticks | |
| BTC6 | Training tent | layer 110 · no ticks | |
| BTC7 | Mess tent | layer 110 · no ticks | |
| BTC8 | Camp tower | layer 110 · Shoot | |
| BR1 | Home | layer 110 · House, Health | |
| BR2 | Apartment | layer 110 · no ticks | |
| BCR1 | Market | layer 110 · no ticks | |
| BCR2 | Tavern | layer 110 · no ticks | |
| BCL1 | Farm | layer 110 · Field, Health | |
| BCL2 | Tree farm | layer 110 · no ticks | |
| BCL3 | Pasture | layer 110 · no ticks | |
| BCL4 | Quarry | layer 110 · no ticks | |
| BCT1 | Trade post | layer 110 · no ticks | |
| BCT2 | Dock | layer 110 · no ticks | |
| BP1 | School | layer 110 · no ticks | |
| BP2 | Library | layer 110 · no ticks | |
| BP3 | Temple | layer 110 · no ticks | |
| BP4 | Baths | layer 110 · no ticks | |
| BP5 | Theatre | layer 110 · no ticks | |
| BP6 | Hospital | layer 110 · no ticks | |
| BP7 | Aqueduct | layer 110 · no ticks | |
| BP8 | Courthouse | layer 110 · no ticks | |
| BP9 | Hall | layer 110 · no ticks | |
| BP10 | War Council | layer 110 · no ticks | |
| BI1 | Mill | layer 110 · Drop-off, Health | |
| BI2 | Lumber camp | layer 110 · Drop-off, Health | |
| BI3 | Mining camp | layer 110 · Drop-off, Health | |
| BI4 | Store | layer 110 · no ticks | |
| BI5 | Depot | layer 110 · no ticks | |
| BI6 | Mint | layer 110 · no ticks | |
| BI7 | Foundry | layer 110 · no ticks | |
| BI8 | Workshop | layer 110 · no ticks | |
| BI9 | Smith | layer 110 · no ticks | |
| BM1 | Barracks | layer 110 · Spawn, Health | |
| BM2 | Range | layer 110 · Spawn, Health | |
| BM3 | Stable | layer 110 · Spawn, Health | |
| BM4 | Siege workshop | layer 110 · Spawn, Health | |
| BW1 | Wall | layer 110 · Health | |
| BW2 | Gate | layer 110 · Health | |
| BW3 | Tower | layer 110 · Shoot, Health | |
| BW4 | Palisade | layer 110 · Health | |
| BF5 | Abatis | layer 110 · no ticks | |
| BS1 | Throne | layer 110 · no ticks | |
| BS2 | Wonder | layer 110 · no ticks | |
| UV | Villager | layer 120 · Walk, Gather, Carry, Build, Repair, Fight, Health | |
| UM1 | Foot | layer 120 · Walk, Fight, Health | |
| UM2 | Archers | layer 120 · Walk, Fight, Shoot, Health | |
| UM3 | Riders | layer 120 · Walk, Fight, Health | |
| UM4 | Engines | layer 120 · Walk, Fight, Health | |
| UM4b | Engines | layer 120 · Walk | |
| US1 | Priest | layer 120 · Walk | |
| US2 | Medic | layer 120 · Walk | |
| US3 | Spy | layer 120 · Walk | |
| US4 | Scout | layer 120 · Walk, Fight, Scout, Health | |
| UT1 | Caravan | layer 120 · Walk, Carry, Trade | |
| UT2 | Camp wagon | layer 120 · Walk, Carry | |
| MH1 | Outlaws | layer 120 · Walk | |
| MH3 | Robbers | layer 120 · Walk | |
| MH4 | Vagabonds | layer 120 · Walk | |
| MH5 | Wayfarers | layer 120 · Walk | |
| MW3 | Deer | layer 120 · Walk, Wander, Prey, Health | |
| MW4 | Wolf | layer 120 · Walk, Wander, Fight, Health | |
| MW6 | Bear | layer 120 · Walk, Wander, Fight, Health | |

## sound

| Code | Name | Value | Cited |
|---|---|---|---|
| HM1 | wood: a struck mode dies with time constant tau ÷ Hz | {tau: 3.2, modes: [[1, 1], [2.756, 0.25]]} | N59; N86 |
| HM2 | stone | {tau: 12, modes: [[1, 1], [2.756, 0.35], [5.404, 0.12]]} | N59; N86 |
| HM3 | metal: rings on | {tau: 447, modes: [[1, 1], [2.756, 0.5], [5.404, 0.3]]} | N59; N86 |
| HU1 | a tap on the glass | [0.03, [tone, 700, 0.05, triangle, 0.16]] | Art: Base |
| HU2 | a dim cell: it only says why | [0.2, [tone, 180, 0.12, square, 0.1], [tone, 140, 0.14, square, 0.1, 0, 0.09]] | Art: Base |
| HU3 | a site placed | [0.1, [hiss, 0.08, 0.3, 500, 1], [tone, 120, 0.1, sine, 0.3, 70]] | Art: Base |
| HU4 | a building raised: two wooden knocks | [0.2, [knock, wood, 220, 0.4], [knock, wood, 330, 0.3, 0.12, 0.5]] | Art: Base |
| HU5 | a place of war raised: a drum, then a horn | [0.2, [hiss, 0.08, 0.35, 180, 1, 90], [tone, 80, 0.25, sine, 0.35, 55], [tone, 196, 0.5, sawtooth, 0.09, 220, 0.2], [tone, 262, 0.6, sawtoot | Art: Base |
| HU6 | a villager trained: a light chime | [0.34, [tone, 440, 0.08, sine, 0.2], [tone, 587, 0.14, sine, 0.2, 0, 0.08]] | Art: Base |
| HU7 | a soldier trained: a short brass call | [0.34, [tone, 294, 0.12, sawtooth, 0.08], [tone, 392, 0.12, sawtooth, 0.08, 0, 0.11], [tone, 440, 0.3, sawtooth, 0.09, 0, 0.22]] | Art: Base |
| HU8 | a new age: the chord spreads across the ears | [1, [tone, 523, 0.3, triangle, 0.22, 0, 0, -0.68], [tone, 659, 0.3, triangle, 0.22, 0, 0.14, -0.23], [tone, 784, 0.3, triangle, 0.22, 0, 0.2 | Art: Base |
| HU9 | the game won | [1, [tone, 392, 0.4, triangle, 0.22], [tone, 523, 0.4, triangle, 0.22, 0, 0.16], [tone, 659, 0.4, triangle, 0.22, 0, 0.32], [tone, 784, 0.4, | Art: Base |
| HU10 | the game lost | [1, [tone, 392, 0.55, triangle, 0.22], [tone, 349, 0.55, triangle, 0.22, 0, 0.3], [tone, 311, 0.55, triangle, 0.22, 0, 0.6], [tone, 262, 0.5 | Art: Base |
| HU11 | a unit picked: its tool creaks | [0.15, [knock, wood, 330, 0.18, 0, 0.6]] | Art: Base |
| HU12 | a unit picked: a blade clinks | [0.15, [knock, metal, 1800, 0.08, 0, 0.4]] | Art: Base |
| HU13 | a unit picked: a bowstring, its fundamental and two harmonics | [0.15, [tone, 180, 0.18, triangle, 0.12], [tone, 360, 0.09, triangle, 0.06], [tone, 540, 0.06, triangle, 0.04]] | Art: Base |
| HU14 | a unit picked: a horse stamps twice | [0.15, [knock, wood, 90, 0.22, 0, 0.3], [knock, wood, 90, 0.22, 0.11, 0.3]] | Art: Base |
| HW1 | a site raised, a blow | [0.25, [hiss, 0.04, 0.3, 2200, 3], [tone, 900, 0.05, square, 0.06, 500]] | Art: Base |
| HW2 | an axe in a trunk | [0.18, [knock, wood, 220, 0.3]] | Art: Base |
| HW3 | a pick on rock | [0.18, [knock, stone, 1400, 0.12]] | Art: Base |
| HW4 | gold into the store: two coins | [0.1, [knock, metal, 1319, 0.08, 0, 0.3], [knock, metal, 1760, 0.08, 0.07, 0]] | Art: Base |
| HC1 | a blow lands | [0.07, [hiss, 0.05, 0.28, 900, 1], [tone, 160, 0.06, sawtooth, 0.12, 90]] | Art: Base |
| HC2 | a blow on a building | [0.1, [tone, 90, 0.12, triangle, 0.3, 60], [hiss, 0.08, 0.2, 300, 1]] | Art: Base |
| HC3 | a heavy impact: the struck one is sent back | [0.12, [tone, 70, 0.1, triangle, 0.38, 40], [hiss, 0.06, 0.25, 400, 1]] | Art: Base (the juice pass, Nov 3) |
| HC4 | an arrow loosed | [0.07, [hiss, 0.12, 0.2, 3000, 2, 1200]] | Art: Base |
| HC5 | a building falls | [0.3, [hiss, 0.7, 0.45, 400, 0.7, 100], [tone, 70, 0.5, sawtooth, 0.22, 35]] | Art: Base |
| HC6 | a wave sets out | [8, [tone, 196, 0.35, sawtooth, 0.1, 220], [tone, 220, 0.55, sawtooth, 0.1, 262, 0.35], [tone, 98, 0.9, triangle, 0.2]] | Art: Base |
| HA1 | a bird in a tree you can see, by day, not in winter | [1, [tone, 2600, 0.07, sine, 0.04, 3400], [tone, 3000, 0.08, sine, 0.04, 3600, 0.12]] | Art: Base |
| HA2 | a cricket at night, not in winter | [1, [tone, 4300, 0.03, square, 0.012], [tone, 4300, 0.03, square, 0.012, 0, 0.06], [tone, 4300, 0.03, square, 0.012, 0, 0.12], [tone, 4300,  | Art: Base |
| HA3 | thunder, after the flash by the real delay | [0.5, [hiss, 0.12, 0.5, 2500, 0.8, 600], [hiss, 2.2, 0.4, 160, 0.5, 50, 0.05], [tone, 45, 1.8, sine, 0.25, 30]] | Art: Base |
| HE1 | which event plays which sound (a find's own sound and a unit's voice sit on its shell) | {tap: tap, err: err, place: place, built: done, builtWar: doneWar, trained: ready, trainedSol: readySol, age: age, win: win, lose: lose, rai | Design, Nov 5 |
| HX1 | the ear: the lens's field of view, the air's loss in dB a km, the quietest heard, the speed of sound in m/s | {fov: 60, alphaKm: 5, floor: 0.03, c: 340} | N58 |
| HX2 | which sounds are ambience and which alerts (the rest are effects) | {amb: [bird, cricket, thunder], alert: [age, win, lose, done, doneWar, ready, readySol, coin, horn]} | Art: Base |
| HX3 | voices at once; how many each kind leaves free | {max: 14, keep: {alert: 0, fx: 2, amb: 5}} | Art: Base |
| HX4 | songs a second a singer in view (a Poisson rate), and the most singers counted | {bird: 0.025, cricket: 0.04, singers: 12} | N12; Art: Base |
| HX5 | the air's top: Hz with no snow, Hz under full snow; how much rain masks a quiet sound | {open: 16000, snow: 2500, rainMask: 0.5} | N88; Design, Nov 5 |
| HX6 | which events are also felt, milliseconds of buzz | {place: 8, done: 25, doneWar: 25, impact: 25, fell: 40, strike: 40, err: 8} | Art: Base |

## sprites

| Code | Name | Value | Cited |
|---|---|---|---|
| P1 | the vil figure | {brush: worker, o: {tunic: #8a6a44, trim: $side, sash: $side, head: bare, legs: #5a4a38, beard: #6b4a2c}, box: [30, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P2 | the spear figure | {brush: person, o: {tunic: $side, head: bare, shield: round, weapon: spear, legs: #6b5a40, beard: #4a3420}, box: [52, 34]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P3 | the archer figure | {brush: person, o: {tunic: $side, head: hood, weapon: bow, legs: #5a4a38}, box: [26, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P4 | the cata figure | {brush: cata, box: [58, 36]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P5 | the ram figure | {brush: ram, box: [42, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P6 | the catapult figure | {brush: catapult, box: [32, 26]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P7 | the priest figure | {brush: person, o: {tunic: #efe6cf, trim: #c9a227, body: robe, head: bare, weapon: staff, sash: $side, legs: #d8cdb2, beard: #d8d0c0}, box:  | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P8 | the medic figure | {brush: person, o: {tunic: #e4dccb, trim: $side, head: cap, capCol: #e4dccb, weapon: bag, sash: #c23a30, legs: #6b5a48}, box: [26, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P9 | the spy figure | {brush: person, o: {tunic: #2a2a30, trim: $side, body: robe, head: hood, hoodCol: #1c1c22, weapon: dagger, cape: #1c1c22, legs: #22222a}, bo | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P10 | the scout figure | {brush: person, o: {tunic: $side, head: cap, capCol: $side*0.6, weapon: staff, cape: $side*0.6}, box: [44, 34]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P11 | the caravan figure | {brush: caravan, box: [36, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P12 | the wagon figure | {brush: wagon, box: [48, 32]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P13 | the bandit figure | {brush: person, o: {tunic: #5a5040, head: hood, hoodCol: #4a3e2e, weapon: club, legs: #3a3228, beard: #3a2a1a}, box: [26, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P14 | the robber figure | {brush: person, o: {tunic: #4a3a30, head: mask, weapon: sword, shield: round, trim: #6b3a2a, legs: #2e2620}, box: [26, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P15 | the vagabond figure | {brush: person, o: {tunic: #6a5e4e, head: bare, weapon: none, legs: #4a4038, beard: #4a3a2a, sash: #8a3a2a}, box: [26, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P16 | the wayfarer figure | {brush: person, o: {tunic: #7a6a50, head: straw, weapon: crook, legs: #5a4a38, beard: #8a8070, cape: #6b5a40}, box: [26, 30]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P17 | the deer figure | {brush: quad, o: {col: #a0703e, len: 13, h: 5.6, legH: 7.4, legW: 0.6, head: 2.2, headY: 1.8, antlers: true, tail: 0.8}, box: [26, 22]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P18 | the wolf figure | {brush: quad, o: {col: #7a7570, len: 13, h: 5, legH: 5.2, legW: 0.7, head: 2.2, headY: 1, tail: 1.6}, box: [24, 16]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| P19 | the bear figure | {brush: quad, o: {col: #4e3524, len: 17, h: 9, legH: 4.5, legW: 1.5, head: 3.2, headY: 0.8, hump: true, tail: 0}, box: [30, 22]} | Art: preview 49 (18-figures.js), the last build before the camera turn |
| PB1 | the castle building picture | {top: 66} | Art: preview 49 (19-building-art.js) |
| PB2 | the town building picture | {top: 52} | Art: preview 49 (19-building-art.js) |
| PB3 | the keep building picture | {top: 62} | Art: preview 49 (19-building-art.js) |
| PB4 | the tower building picture | {top: 84} | Art: preview 49 (19-building-art.js) |
| PB5 | the wonder building picture | {top: 72} | Art: preview 49 (19-building-art.js) |
| PB6 | the library building picture | {top: 56} | Art: preview 49 (19-building-art.js) |
| PB7 | the temple building picture | {top: 50} | Art: preview 49 (19-building-art.js) |
| PB8 | the theatre building picture | {top: 44} | Art: preview 49 (19-building-art.js) |
| PB9 | the apartment building picture | {top: 46} | Art: preview 49 (19-building-art.js) |
| PB10 | the aqueduct building picture | {top: 40} | Art: preview 49 (19-building-art.js) |
| PB11 | the siege building picture | {top: 40} | Art: preview 49 (19-building-art.js) |
| PN1 | the finds: their scale, and their dot far out | {scale: {tree: 0.88, bush: 1.45, other: 1.25}, dot: {tree: #3c6c32, bush: #3f6b33, gold: gold, stone: rock, iron: ruin, ruins: ruin, cemeter | Art: preview 49 |

