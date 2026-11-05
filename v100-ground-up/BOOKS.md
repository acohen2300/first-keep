# First Keep v100 · the Books

Written by `index.py` from `books/*.js`, never by hand.

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
| D171 | the build: First Keep v100, the build number | 100 · 11 | Design: the build log (README) |

## rules

| Code | Name | Value | Cited |
|---|---|---|---|
| X1 | a code that has two homes (two books) | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X2 | a book entry with no citation, or citing an N not in the Citations book | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X3 | an entry or a law naming a Q or an N that does not exist | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X4 | a shell lacking what its layer's mold needs | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X5 | a shell ticking what it cannot back | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X6 | a slot on a shell that nothing it ticks asks for | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X7 | a slot pointing at nothing: a D code, a body, a kit, a look, a sound | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X8 | an event playing a sound that is not in the Sound book | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X9 | a Build tab over nine, or listing something that is not a building | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X10 | a building missing from the Build menu or listed twice (unless named off it) | {stage: books} | Design: Albert, Nov 5 (the gate) |
| X11 | opened code naming a shell instead of asking by tick or by book | {stage: code} | Design: Albert, Nov 5 (the gate) |
| X12 | numbers typed into D instead of the Measurements book | {stage: code} | Design: Albert, Nov 5 (the gate) |
| X13 | a comment that ends in a statement: it may have swallowed code | {stage: code} | Design: Albert, Nov 5 (the gate) |
| X14 | the version typed into the page instead of read from D171 | {stage: code} | Design: Albert, Nov 5 (the gate) |
| X15 | a code file that does not parse on its own | {stage: code} | Design: Albert, Nov 5 (the gate) |
| X16 | the whole game, joined, not parsing (a name declared twice) | {stage: code} | Design: Albert, Nov 5 (the gate) |
| X17 | a permit opening more than ten items, or a change it does not open | {stage: seal} | Design: Albert, Nov 5 (the gate) |
| X18 | a locked item differing from its seal by a single byte | {stage: seal} | Design: Albert, Nov 5 (the gate) |
| X19 | opened code typing more numbers or colours than when sealed | {stage: seal} | Design: Albert, Nov 5 (the gate) |
| X20 | opened code growing past its sealed size without growth the permit grants | {stage: seal} | Design: Albert, Nov 5 (the gate) |
| X21 | INDEX.md, BOOKS.md or INVENTORY.md not what the books say (on GitHub) | {stage: seal} | Design: Albert, Nov 5 (the gate) |
| X22 | a rule in this book that nothing runs | {stage: seal} | Design: Albert, Nov 5 (the gate) |
| X23 | the page shows the version from the book | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X24 | the top is one ribbon of the cells the Screen book names | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X25 | Build renders the book's tabs, each with its buildings | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X26 | every page that is not Tall shares one height | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X27 | the Tall pages keep their own height | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X28 | the panel is solid | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X29 | the seat's queue is the mold's six single slots, filling in order | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X30 | a card shows the rows its subject ticks: a villager, a find, the seat | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X31 | a building picked from Build is placed as a site | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X32 | the page runs with no errors | {stage: page} | Design: Albert, Nov 5 (the gate) |
| X33 | the gate stops each planted break: a second home, a bad tick, a shell named in code, swallowed code, one byte of a locked law | {stage: page} | Design: Albert, Nov 5 (the gate) |

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
| R1 | Tree | [Yield] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| R5 | Bush | [Yield] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| R2 | Gold | [Yield] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| R3 | Stone | [Yield] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| R4 | Iron | [Yield] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MG1 | Ruins | [Yield] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MG2 | Cemetery | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MG3 | Campfire | [Yield] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MG4 | Treasure | [Yield] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BTC1 | Town Center | [Seat, Drop-off, Spawn, Shoot, House, Research, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BTC2 | Castle | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BTC5 | Medical tent | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BTC6 | Training tent | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BTC7 | Mess tent | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BTC8 | Camp tower | [Shoot] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BR1 | Home | [House, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BR2 | Apartment | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BCR1 | Market | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BCR2 | Tavern | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BCL1 | Farm | [Field, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BCL2 | Tree farm | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BCL3 | Pasture | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BCL4 | Quarry | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BCT1 | Trade post | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BCT2 | Dock | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP1 | School | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP2 | Library | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP3 | Temple | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP4 | Baths | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP5 | Theatre | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP6 | Hospital | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP7 | Aqueduct | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP8 | Courthouse | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP9 | Hall | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BP10 | War Council | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI1 | Mill | [Drop-off, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI2 | Lumber camp | [Drop-off, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI3 | Mining camp | [Drop-off, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI4 | Store | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI5 | Depot | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI6 | Mint | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI7 | Foundry | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI8 | Workshop | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BI9 | Smith | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BM1 | Barracks | [Spawn, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BM2 | Range | [Spawn, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BM3 | Stable | [Spawn, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BM4 | Siege workshop | [Spawn, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BW1 | Wall | [Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BW2 | Gate | [Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BW3 | Tower | [Shoot, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BW4 | Palisade | [Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BF5 | Abatis | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BS1 | Throne | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| BS2 | Wonder | [] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| UV | Villager | [Walk, Gather, Carry, Build, Repair, Fight, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| UM1 | Foot | [Walk, Fight, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| UM2 | Archers | [Walk, Fight, Shoot, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| UM3 | Riders | [Walk, Fight, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| UM4 | Engines | [Walk, Fight, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| UM4b | Engines | [Walk] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| US1 | Priest | [Walk] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| US2 | Medic | [Walk] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| US3 | Spy | [Walk] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| US4 | Scout | [Walk, Fight, Scout, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| UT1 | Caravan | [Walk, Carry, Trade] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| UT2 | Camp wagon | [Walk, Carry] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MH1 | Outlaws | [Walk] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MH3 | Robbers | [Walk] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MH4 | Vagabonds | [Walk] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MH5 | Wayfarers | [Walk] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MW3 | Deer | [Walk, Wander, Prey, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MW4 | Wolf | [Walk, Wander, Fight, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |
| MW6 | Bear | [Walk, Wander, Fight, Health] | Design: the v100 dictionary, Nov 4–5 (S, U, M, R, B) |

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

