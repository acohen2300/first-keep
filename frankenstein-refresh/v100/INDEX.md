# First Keep v100 · 1. the Index

Written by `index.py` from `books/*.js`, never by hand: every entry of every book by its code, and the codes it cites.

## angles

| Code | Name | Value | Cited |
|---|---|---|---|
| A1 | the grid's turn on the screen | 15 | N90 |
| A2 | the camera's rise over the ground | 41 | N91 |
| A3 | the angle of repose, dry sand: steeper is a face, not a slope | 34 | N64 |
| A4 | a full turn: the fish spots go round a lake's shore | 360 | N170 |
| A5 | a missile is loosed at this rise: the farthest reach (Mid's rangeFrom) | 45 | N39; N188 |

## capabilities

| Code | Name | Value | Cited |
|---|---|---|---|
| SC0 | what every shell has: a name, its ticks, its citation | {by: every book of shells, law: [], needs: [name, ticks, cite], may: [layer]} | N92 |
| SC01 | the mold of a find (layer 100) | {by: shells (finds), law: [], needs: [find, look], may: [room, sound]} | N92 |
| SC02 | the mold of a building (layer 110) | {by: shells (buildings), law: [], needs: [size, style, look, material], may: []} | N92 |
| SC03 | the mold of a walker (layer 120); one of a side eats its Upkeep (D211). The Unit shell: a soldier kind fills its class (Foot, Archers, Riders, Engines: the building D133 names for it), the age it opens in (D130) and the kind it learns into (teach, Mid's TEACH_TO) | {by: shells (units, moveables), law: [], needs: [look, pace, body], may: [upkeep, class, age, teach]} | N92; N170; N176 |
| SC04 | the mold of a page (the Screen book) | {by: books/screen.js, law: [], needs: [], may: [rows]} | N93 |
| SC1 | walks the tiles at its pace | {by: index.html floor 5: step, findPath, law: [QBL, QBM, QBU], needs: [pace, body], may: [mount, kit, voice]} | N94 |
| SC2 | works a find of best rate from a spot of its own on its ring, as many as the find takes (D195), and fills a load; also counts it among the people | {by: econ.js, law: [QBN, QV, QW, QX, QCI], needs: [body], may: []} | N95; N164 |
| SC3 | takes a load to the nearest drop-off of its side | {by: econ.js, law: [QBN], needs: [body], may: []} | N95 |
| SC4 | raises a site; a builder remembers its work and goes back to it after (Mid's) | {by: econ.js, law: [QAC], needs: [body], may: []} | N95; N168 |
| SC5 | mends a hurt building at D201's time and price, paid as it goes, then goes back to its work (Mid's) | {by: econ.js, law: [QCK], needs: [body], may: []} | N95; N168 |
| SC6 | strikes (QBO: its counters, where the blow comes from, the shape and the armour share); its foe the one its group can beat, then the best (QAG, QAF); a soldier's nerve drains and breaks it (QAI, QAO); a soldier at home guards its yard | {by: combat.js, law: [QBO, QAG, QAF, QBT, QAI, QAO], needs: [D138], may: []} | N96; N188 |
| SC7 | looses at range; a building that shoots reads D143 and reaches as far as an arrow loosed from its height lands (QAJ); a shooter steps back while it reloads | {by: combat.js, law: [QAL, QAJ], needs: [D143/D138], may: []} | N96; N188 |
| SC8 | has health, and sways when badly hurt | {by: combat.js, index.html, law: [QBS], needs: [D138/D139], may: []} | N97 |
| SC9 | wanders when idle (a Poisson wait) | {by: index.html step, law: [QM], needs: [pace], may: []} | N94 |
| SC10 | can be hunted: a villager sent to it (or tapped on it) strikes at D221's blow; it falls as a carcass of D220's food where it stood, which its hunters butcher; one with a blow strikes back (Mid's sendHunt, huntTick, the boar's temper) | {by: econ.js, combat.js, menu.js: hunting, law: [QBO], needs: [D220], may: []} | N94; N170 |
| SC11 | a side's seat: the game opens on it, and a side falls with its last | {by: econ.js, ai.js, menu.js, law: [QBW], needs: [], may: []} | N95 |
| SC12 | takes in the yields its row lists | {by: index.html dropFor, ai.js, law: [QBN], needs: [drop], may: []} | N98 |
| SC13 | trains the units D133 gives it: a shell, or a class, every kind of it from that kind's age | {by: econ.js, law: [], needs: [D133], may: []} | N95; N176 |
| SC14 | houses the people D127 gives it | {by: econ.js, ai.js, law: [], needs: [D127], may: []} | N95 |
| SC15 | where the ages are reached; the queue holds research as well as units: a step of the Research book is learned at the building its row names, after the one before it in its line and its needs | {by: menu.js, econ.js, law: [QCA], needs: [], may: []} | N95; N160 |
| SC16 | a building that yields, at the rate its row points to, to one worker at a time (D195); its builder takes it up; one with an amount runs out and is replanted at D222's share of its price (Mid's replant) | {by: econ.js, ai.js, law: [QBN, QX], needs: [yield, rate], may: [amount]} | N95; N164; N170 |
| SC17 | a find: holds an amount of a yield | {by: econ.js, law: [QBN], needs: [yield, amount], may: []} | N99 |
| SC18 | scouts (not built yet) | {by: waiting, law: [], needs: [], may: []} | N100 |
| SC19 | trades (not built yet) | {by: waiting, law: [], needs: [], may: []} | N100 |
| SC20 | a page that keeps its own height (the Town Center, the Start page); every other page shares the tallest of the rest | {by: menu.js, law: [], needs: [], may: []} | N101 |
| SC21 | laid as a line, corner to corner, one piece a tile, four-connected; touches any building, keeps no lane (Mid's lineKind) | {by: econ.js, menu.js, law: [], needs: [], may: []} | N168 |
| SC22 | shut to a foe of its owner, open to the rest; laid on its owner's wall, it takes the piece's place (Mid's blockedCell) | {by: index.html walkable, combat.js, law: [], needs: [], may: []} | N168 |
| SC23 | stands by a lake, within D218's shore past its beach (Mid's dock) | {by: econ.js placeWhy, ai.js, law: [], needs: [], may: []} | N170 |
| SC24 | a find worked only within D218's near of a finished Shore building of the side; it regrows each spring toward its own stock (QY) | {by: econ.js, law: [QY], needs: [], may: []} | N170 |
| SC25 | keeps a flock (D219): its shepherd's food goes straight to the stores, a sheep's rate times the sheep; lambs each spring (QY), a tended flock culled to half (QZ); wolves take sheep | {by: econ.js, law: [QY, QZ], needs: [], may: []} | N170 |
| SC26 | its soil wears when worked and rests back (QAA, D214); its yield follows the season (D216) and the year's harvest (D215) | {by: econ.js, law: [QAA], needs: [], may: []} | N170 |
| SC27 | a soldier of its side resting within D237's reach heals by the first-order lag (QP); its going inside waits for All hands | {by: combat.js, law: [QP], needs: [], may: []} | N188; N16 |
| SC28 | the War Council: the three squads' plans, and Muster, a squad's lack in one order (D244); a squad's dials (temper, shape, intent) are answered by combat.js | {by: combat.js, econ.js, menu.js, law: [], needs: [], may: []} | N188 |
| SC29 | a building with room inside (D256, after research): its side's villagers run in from danger (D254) and the Alarm fills it, sturdiest first; each one inside adds an arrow to its shot | {by: econ.js, combat.js, law: [], needs: [D256], may: []} | N192 |
| SC30 | finished and standing D257 s, it wins for its side; every side is told when one stands and when it falls | {by: econ.js, law: [], needs: [], may: []} | N192 |
| SC31 | a School: an older soldier learns its newer kind here (D263), standing where it was told, seats a School at once | {by: econ.js, menu.js, law: [], needs: [], may: []} | N194 |
| SC32 | heals its side's troops within D268's reach by the first-order lag (QP); a medic walks with the army (D269) | {by: combat.js, law: [QP], needs: [D268], may: []} | N194 |
| SC33 | a priest: sent at a foe, it stands beside it D265's time and turns it, then rests; it walks with the army (D269) | {by: combat.js, law: [], needs: [], may: []} | N194 |
| SC34 | a Temple: Zeal on a squad with a priest beside it (D266) | {by: econ.js, menu.js, law: [], needs: [], may: []} | N194 |
| SC35 | unseen by a foe beyond D267's sight (a soldier's, a shooting building's), it reads a side it stands by and is spent on sabotage at a foe building (D267) | {by: combat.js, econ.js, index.html, law: [], needs: [], may: []} | N194 |

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
| N158 |  | Design: Mid's one hostility test (08-core.js atWar, gangOf, gangRel, isFoe, friendly; decision 8, C1, answer 1b; 10-world.js every side at w | opened |
| N159 |  | Vienna Convention on the Law of Treaties (1969), art. 34: a treaty creates neither obligations nor rights for a third state without its cons | to open |
| N160 |  | Design: Mid's ages and research (01-rules-basics.js AGES; 04-rules-tech.js TECH, the economy and learning lines; 08-core.js lineOf, prevOf,  | opened |
| N161 |  | Mid's history lines and dates for the ages and research steps (07-text.js WHY; 04-rules-tech.js when), written for Mid from general history; | to open |
| N162 |  | Design: Albert, Nov 5 13:30: one build carries a whole module (or a few small ones), never split; the cap of ten lifted for the refresh; the | opened |
| N163 |  | Reynolds, C. W. (1987), Flocks, herds and schools: a distributed behavioral model, Computer Graphics 21(4) (SIGGRAPH '87): separation, steer | to open |
| N164 |  | Design: Mid's gathering and standing spots (12-sim-core.js recount, FORAGE, forage, forageNow; 13-sim-civil.js findCap, LATTICE, spotAt, tak | opened |
| N165 |  | Hall, E. T. (1966), The Hidden Dimension: personal distance, 1.5 to 4 ft; and hexagonal circle packing, density π/(2√3) (Lagrange 1773; Thue | to open |
| N166 |  | OSHA 29 CFR 1910.266(d)(6)(ii), fellers at least two tree lengths apart; 29 CFR 1910.142, beds at least 36 in apart; Mid's cites, from memor | to open |
| N167 |  | Moussaïd, Helbing, Garnier, Johansson, Combe & Theraulaz (2009), Experimental study of the behavioural mechanisms underlying self-organizati | to open |
| N168 |  | Design: Mid's builders, repair, limits, taking down, placing and walls (11-orders.js autoBuilder, sendBuilder, repairCost, shellBack, refund | opened |
| N169 |  | Design: Albert, Nov 5 10:06–10:28: build and train times Mid's; every building's health v100's | opened |
| N170 |  | Design: Mid's food, farms, seasons, hunting and fishing (36-economy.js shareOf, orderCost, hungerOf, upkeepTick, natureTick, seasonTurn, FLE | opened |
| N171 |  | Keys, Brožek, Henschel, Mickelsen & Taylor (1950), The Biology of Human Starvation (the Minnesota study): grip strength fell from 58.2 to 41 | to open |
| N172 |  | Design: Albert, Nov 5 16:07: the Palisade comes only with the war camp, as in Mid (free there); it leaves the Walls tab | opened |
| N173 |  | Design: Mid's pace (09-nav.js paceOf; 12-sim-core.js sideSpd, insulate; 37-events.js groundNeed, studded, iceMu, strideShare, groundSpd, muO | opened |
| N174 |  | Ichihara & Mizoguchi, studded tyres on ice and snow, Highway Research Board Special Report 115, Table 2 (Mid's cite for studs' grip, 0.28 at | to open |
| N175 |  | Hsu, Li, Bagheri, Fernie & Dutta (2016), Ergonomics 59: bare boots on wet ice 0.08, on cold dry ice 0.20 (Mid's cite); from memory, to open | to open |
| N176 |  | Design: Mid's soldiers (02-rules-units.js UNIT, spear to treb; 04-rules-tech.js the barracks, range, stable, smith and siege lines and their | opened |
| N177 |  | Masses of arms and of the war elephant: a sword about 1.2 kg, a javelin 1 kg thrown at about 20 m/s, a crossbow 5 kg and its bolt 80 g at 45 | to open |
| N178 |  | Gao, Abeysekera, Hirvonen & Aschan (2003), The effect of footwear sole abrasion on the coefficient of friction on melting and hard ice, Int. | opened |
| N179 |  | Burnfield & Powers (2004), Prediction of slip events during walking: an analysis of utilized coefficient of friction and available slip resi | opened |
| N180 |  | US National Weather Service glossary, blizzard (forecast.weather.gov/glossary.php?word=bliz; weather.gov/dtx/winter_defs): sustained wind or | opened |
| N181 |  | Pugh (1971), The influence of wind resistance in running and walking and the mechanical efficiency of work against horizontal or vertical fo | to open |
| N182 |  | Seliga, Hazen & Burnley, nowcasting snowfall rate from visibility (AMS paper 104640): S = c σ, c from about 0.6 early in an event to 0.2 lat | opened |
| N183 |  | Rain's extinction of light β ≈ 0.312 R^0.67 a km, R in mm/h (an empirical fit used for visibility in rain); from memory, to open | to open |
| N184 |  | Harper, Kepert & Ginger (2010), WMO guidelines for converting between various wind averaging periods: a gust about 1.4 times the mean wind o | to open |
| N185 |  | Design: Albert, Nov 5 18:07–18:08: pace by the floor, the weather, mass and gravity, never by the calendar (Pandolf); the effects law, boost | opened |
| N186 |  | Intensity's top: rain 50 mm/h (violent rain on the Met Office's scale), snow 5 mm/h of water, wind 20 m/s (a gale, Beaufort 8); from memory, | to open |
| N187 |  | Locatelli & Hobbs (1974), J. Geophys. Res. 79: snowflakes fall about 0.5 to 1.5 m/s; from memory, to open | to open |
| N188 |  | Design: Mid's blow, nerve, a soldier's day, squads, formations and muster (16-sim-fight.js fromWhere, hurt, plunder, plunderBld; 14-sim-troo | opened |
| N189 |  | Park, J. L. (2010s), arrow drag in free flight (Proc. IMechE, Part P): an arrow's drag coefficient about 1.5 to 3 on its shaft's cross-secti | to open |
| N190 |  | Design: Mid's finger, orders, missions and the War Director (26-input.js hitAt, tapAt, picked, setPick, pickToggle, order, boxPick, ordAt, H | opened |
| N191 |  | Design: Albert, Nov 5 (Frankenstein F21+F22, decisions.json): Mid's gameplay and controls come over (one tap picks, a second opens the card; | opened |
| N192 |  | Design: Mid's alarm, danger map and the end (09-nav.js DANGER, discRows, stampDanger, dangerMap, dangerWhy; 12-sim-core.js isThreat, recount | opened |
| N193 |  | Design: Albert, Nov 5 20:16 (Frankenstein F23): keep going; three playability fixes from his phone (everyone idle, three sites never built): | opened |
| N194 |  | Design: Mid's lessons, prisoners, priests, medics, Zeal and spies (11-orders.js teachTo, teachGap, teachCost, teachSecs, schooling, teachWhy | opened |

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
| C11 | An arrow or shot in flight | #ffeec8 | N188 |
| C12 | A burning arrow; a blow's spark | #ffb050 | N188 |
| C13 | A standard's pole | #3a2a1a | N188 |
| C14 | A ring's or a flag's shadow | #100c08 | N188 |

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
| E42 |  | QBJ Z1's store, from what the first age up costs (D129, Mid's Bronze; Albert's rule): food for the age and the villagers, wood for the mill, |  |
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
| E85 |  | the tool a villager works a find with (WORKTOOL): axe, hands, pick, from the Sprites book (PN1 tool), the one home econ.js reads |  |
| E86 |  | walking (L5, top rules): land or a ford is walked; a thing, a closed building or a step past the angle of repose is not |  |
| E87 |  | inland water bearing ice (QQ): walked as if flat |  |
| E88 |  | the pace's books (QCB): its states and Pandolf's coefficients (D224), the friction a step needs (G9), slipping (G10); the player's side, tol |  |
| E89 |  | QBL A* over the tiles, the eight ways of D198, straight 1 and diagonal √2, the heuristic the octile distance (N74). goal(k) says when a tile |  |
| E90 |  | most: the tiles it may open before giving up |  |
| E91 |  | no cutting a corner |  |
| E92 |  | a unit on a tile; its stand wanders in the tile (D82) |  |
| E93 |  | a path of one tile (already there) walks to its middle: no step past the end |  |
| E94 |  | to a tile |  |
| E95 |  | to a tile beside one |  |
| E96 |  | the drop-off for a yield: the side's nearest building that takes it in (SC Drop-off, B's fifth field) |  |
| E97 |  | to a tile along a building's edge (the ring of tiles round it, byB) |  |
| E98 |  | a find used up is gone; its tile is free again |  |
| E99 |  | one tick for every unit |  |
| E100 |  | walking: toward the next point at the walker's pace (QCB) over the ground it steps onto; true when it gets there |  |
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
| E116 |  | a unit's picture: its look at its frame, its rank and its side's armour kit, facing right, painted once per look, colour, rank, kit and fram |  |
| E117 |  | The things, drawn each frame back to front, only those on the screen. A picture is painted once per look and zoom step, then stamped (the sp |  |
| E118 |  | W × H units, the art's origin at (tx, ty), its anchor (the point stamped at the thing's stand) at (ax, ay) |  |
| E119 |  | the node art's own small dice, seeded by the variant, so a tree's leaves fall the same each paint |  |
| E120 |  | each drawn at its stand (x, y on the screen), s pixels a unit |  |
| E121 |  | a find far out, from its look |  |
| E122 |  | Floor 6, climate (layer 130): one sky over the whole board (185 m across: one weather), acting on everything below (L7). The clock is Y: a d |  |
| E123 |  | QA the sun: sin a = sin φ sin δ + cos φ cos δ cos H; φ D99, δ swings ±23.44° over the year from the spring equinox, H turns with the day (no |  |
| E124 |  | light by the sun's height, the twilights at −6, −12, −18 (SoRen's ramp, QD) |  |
| E125 |  | QP the one first-order lag, x to its level L over τ: x(t) = L + (x0 − L) e^(−t/τ) (N16; Mid's relax: wetness here, and the market, nerve, he |  |
| E126 |  | QH the rain: a two-state chain, drawn once a game hour (a day's 24th): P(wet / dry) and P(wet / wet) are D102; a wet spell draws its intensi |  |
| E127 |  | the season's mean, eased into the next |  |
| E128 |  | what falls |  |
| E129 |  | rain and snow come and go over tens of seconds (SoRen), toward the spell's intensity |  |
| E130 |  | QP settle: wet in D104, dry in D105 |  |
| E131 |  | QO degree-day melt, rain on snow twice as fast |  |
| E132 |  | QQ: lake ice grows with the freezing degree-seconds and bears at D109; ice on the ground grows the same way while the ground is wet, full at |  |
| E133 |  | QM: fog comes on a Poisson wait (D110) and stays D111 |  |
| E134 |  | fog, or mist after rain at dawn and dusk (KW8) |  |
| E135 |  | QL, QM: strikes on Poisson waits in a storm |  |
| E136 |  | a strike: on the ground in view when close, a sheet flash when far; the flash never comes within D112 of the last (QL, WCAG 2.3.1), and the  |  |
| E137 |  | a far flash: its thunder from beyond the screen |  |
| E138 |  | the rain's fall speed (QJ, Atlas's fit to Gunn & Kinzer); how many of the pool are falling: the strength |  |
| E139 |  | on the ground, under everything: snow whitens the land (screen), wet darkens it (multiply), ice whitens the inland water |  |
| E140 |  | over everything: what falls, the strikes, the flash, the night, the white of low visibility and the fog |  |
| E141 |  | SoRen's bolt: a channel from the top of the sky to the ground with a fork or two, three strokes from a soft glow to a bright core; its foot  |  |
| E142 |  | the channel wanders but leans home to its foot |  |
| E143 |  | the light: the sun's by the ramp, clouds take a quarter, the horizon's warmth within 8° of it |  |
| E144 |  | KW7: Koschmieder's reach (QK) limits sight on the Display floor; here the haze |  |
| E145 |  | Marsh (TW1): Who the map · What a wet margin round a lake or two · Where Z4's lakes, the land D115 out from the water · When the map is made |  |
| E146 |  | Floor 7, display (layer 140): what the player sees. The fog of war: every tile is unseen, seen once, or in sight now (the player's units see |  |
| E147 |  | the player's sight, every D119: what was in sight is remembered; what the units and buildings of side 0 reach now is seen, never past the vi |  |
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
| E162 |  | Touch: one finger pans, two pinch; a wheel zooms about the pointer; a held finger picks more, drags the crosshair or draws a box (F21). |  |
| E163 |  | the camera rule: the board never leaves the screen's middle; a board smaller than the screen sits centred |  |
| E164 |  | what is under the finger: the tile at the land's height and the nearest unit it may see (yours, or one in sight and not hidden), within the  |  |
| E165 |  | The seed of the day (QBF): the date as YYYYMMDD, the same map for everyone that day; a seed in the address overrides it. |  |
| E166 |  | the door: what the modules may touch |  |
| E167 |  | the test hook |  |
| E168 |  | First Keep v100 · menu.js (floor 8): everything on the glass. Lives alone; it reads the world through one function, read(), and acts through |  |
| E169 |  | Its shape lives in the Screen book (books/screen.js): the mold, the Build tabs, the card's rows and the subject's ticks that pick them, the  |  |
| E170 |  | its numbers live in books/measure.js (D); nothing is typed here |  |
| E171 |  | the codes and their floors; Lock is a mark for us (no floor is locked yet) |  |
| E172 |  | the Screen book: the Build tabs are its; a building shows priced once econ prices it, else Later |  |
| E173 |  | the seat, and who it trains first: asked of the books, never named |  |
| E174 |  | the classes War's Train box offers (D133), each as the first kind of it open at this age (Mid's kindOf) |  |
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
| E186 |  | Train a kind: the nearest finished building that trains it; a kind before its age says which age it waits for |  |
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
| E201 |  | war mode: Albert's War rows. Left the people's orders, the middle box (map, squads and their dials, orders, kinds), right the army's |  |
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
| E218 |  | training, research and the age: one queue at the building, as long as the mold's six and what research adds (QCA); the head trains, is learn |  |
| E219 |  | the age (Mid's ageUp): the next age, never the hidden sixth until the peace opens it; paid at its price (D129, the ages of D130) and queued  |  |
| E220 |  | the jobs (SM Gather): a villager's job is the yield it works; counts are read, not kept |  |
| E221 |  | QV: the find of a yield whose rate of return R is best (the walk out, the walk home and the crowd counted), of those not full (D195), not le |  |
| E222 |  | a find no path reaches, or with no spot free on its ring, is left alone a while (D137), and the next beat chooses again: one walled in tries |  |
| E223 |  | assign: + sends an idle or waiting villager (else the one earning least, QV, on another job, never one posted to a field) to the yield's bes |  |
| E224 |  | the tick: training and research, ages, upkeep, the villagers, the bell |  |
| E225 |  | a new game: the book's stores (D172); the bell stays as Start set it |  |
| E226 |  | the score (QBR): what a side holds, cost ÷ D135, everything it gathered ÷ D135, and what it paid for research and ages (the ledger's researc |  |
| E227 |  | First Keep v100 · combat.js (floor 10): health, the blow (QBO, QBT), the foe (QAG, QAF), nerve and the rout (QAI, QAO, QBQ), a soldier's day |  |
| E228 |  | tiles from a unit to a thing: to a building's footprint, in the grid's frame |  |
| E229 |  | gone: pulled down (econ marks it) or dead (die marks it) |  |
| E230 |  | the blow's strength (Mid's dmgOf): its blow after research, blades worn by frost, rain or snow (D234, its research a share), a mounted shape |  |
| E231 |  | a blow lands (QBO); it shakes the struck one's nerve by where it comes from (QAI), sends it off by the impact (QBT), throws sparks and, from |  |
| E232 |  | QAF and QAG the foe (Mid's unitPower, groupPower, canBeat, foeValue): one its group can beat first (Lanchester: its side near summed against |  |
| E233 |  | the best foe in reach (Mid's bestFoe), the nearest one (nearestFoe, round any point), the nearest foe building (nearestFoeBld; the widest on |  |
| E234 |  | to within reach of a thing, with a short search (D147) |  |
| E235 |  | a wave falls back to its seat, else to any building of its side |  |
| E236 |  | a side's wave in the field: its soldiers at the start, so nerve can be read (QBQ) |  |
| E237 |  | to a tile, or near one that cannot be stood on (a building's); no way there, it strikes a foe building that blocks it |  |
| E238 |  | QAF a group's power: each one's health × its blow (Mid's dmgOf), the blow at least D194, over D193 per, a building-only kind at D193's bonly |  |
| E239 |  | a soldier's nerve (QAI): at rest it settles back (QP), faster by its own wall or tower; outnumbered it drains; at nothing it breaks and runs |  |
| E240 |  | the bars: a unit's or building's health, when it is hurt and in sight; the crosshair of the player's wave |  |
| E241 |  | First Keep v100 · ai.js (floor 11): one brain for the computer's side, one personality (balanced). Lives alone; acts only through ECON and W |  |
| E242 |  | the seat, and the hands it trains |  |
| E243 |  | the shells a side can pay for that tick a capability |  |
| E244 |  | each yield's camp: the drop-off that takes it in |  |
| E245 |  | a spot: the nearest free footprint to a point, searched in rings, kept off the home's own ring so the roads stay open |  |
| E246 |  | jobs by need: the yield whose share is most under its wanted share takes an idle villager, or one from the yield most over |  |
| E247 |  | people, homes, drop-offs, plots, the age |  |
| E248 |  | the army: the troop whose counters strike hardest, summed over the enemy's soldiers (Mid's bestCounter by vs), until the age's count stands |  |
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
| E267 |  | a side's economy, fresh: its age, the steps it knows, its gathered total, the rally, and the stores' flow (this minute's in and out, the las |  |
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
| E278 |  | a thing's keys, the names an effect may reach it by: every head of its code's letters (B, BR for BR1), its code, its ticks and a soldier's c |  |
| E279 |  | a number's base, from its one home: the pace (D86), a building's health (D139) or a unit's (D138), a find's or a field's rate, a price (D123 |  |
| E280 |  | the one window for a kind's number after research (QCA): flat adds first, then the boosts summed and applied once to that, then each cut on  |  |
| E281 |  | learning a step puts its effects in force for that side; every unit and building of the side keeps its share of health as the most it can ha |  |
| E282 |  | who counters whom (Mid's vsMul): the most of the striker's counters (D138 vs, its ranks' added) over the struck one's kind, class and tags;  |  |
| E283 |  | QAF the odds an army gives itself against a side, the one home the computers read: the counters summed both ways over the first of each army |  |
| E284 |  | against theirs: its soldiers, its towers (not its seat) at D177 each, its people at D192 (Mid's powerFrom); the square law as odds, p² ÷ (p² |  |
| E285 |  | the Sides book (I) and the stances made in play, each pair's own; a new game forgets them |  |
| E286 |  | who belongs (the kind decides): a side's own are no group; an animal (I4) is a beast; a kind of the wild in a group's list (I3) is that grou |  |
| E287 |  | a stance is the pair's own, or the book's start (I2); a treaty sets it both ways between its signers only, never for a third (pacta tertiis, |  |
| E288 |  | the one hostility test (Mid's isFoe): never one's own; an animal is everyone's foe; one of a wild group is a foe when the side is at war wit |  |
| E289 |  | the wild looking at a side: an animal fights everyone; a group fights a side at war with it, but starts nothing with a computer (decision 4b |  |
| E290 |  | the Research book (O) by code and by key |  |
| E291 |  | a find's or a field's rate after the side's research (QCA): the one window, D88 or the row's own rate as the base |  |
| E292 |  | Mid's research lines: a line is the steps of one line at one building, in the book's order; a step waits on the one before it and on its nee |  |
| E293 |  | research (Mid's researchWhy and research): a step is refused when known, before its age, before its needs, already queued, with no finished  |  |
| E294 |  | research shows on its building (Mid's UP, PB12): the steps learned of those its row names, none, some, or half or more; a building's level ( |  |
| E295 |  | the keep at its level: the bastion from its points in the Sprites book (PB13) |  |
| E296 |  | the walked length (QBL) from a tile to beside a building: a straight step one tile, a diagonal √2; no way, infinitely far |  |
| E297 |  | QCI standing spots: everyone stands on a spot of its own a pace (D196) apart. A point's spots lie on the hex lattice, nearest first, rings e |  |
| E298 |  | a find's working ring (Mid's WORK_R, D196): as many spots as fit a pace apart round it, ⌊2π·r ÷ pace⌋ (Mid's findCap), laid on a ring wide e |  |
| E299 |  | spot i of c: round a find on its ring; round a building on its outline, the lane of tiles beside it, k a side, at least a pace apart, corner |  |
| E300 |  | a spot is free when its tile is walked and nobody stands on it or has claimed one within a pace less near-enough (D196); the push settles th |  |
| E301 |  | the spot u keeps at c, else the free one nearest u (round a point, the nearest the point) |  |
| E302 |  | walk to a spot of its own at c: the path's last tile becomes the spot itself; false when none is free or none is reached |  |
| E303 |  | a path's last point is reached within near-enough (D196), any point within a pace when the crowd has pushed it this step: a walker held off  |  |
| E304 |  | QCJ separation, neighbours only (the M3 grid): two closer than a pace part to a pace, each moved by the other's share of their mass (the Mas |  |
| E305 |  | a find drawn smaller as it is used: PN1's left share and the rest by what is left (Mid's nodeScale) |  |
| E306 |  | the forager (QV, QX): a find takes D195's cap (a tree one feller, a field one worker) or as many as its ring has spots; the others on it cro |  |
| E307 |  | QV R = c / (c/g + 2d/v + w·c/(A·v)): c the load, g the rate crowded (QX), v the walk, d the walked length to the drop-off (cached per find), |  |
| E308 |  | a lost find (Mid's decision 1): it delivers what it carries, then looks from where the find ran out within the look (D197), widening over ta |  |
| E309 |  | builders who finish a place of work take it up (Mid's startWork): a field if nobody works it; a camp (a drop-off that takes fewer than every |  |
| E310 |  | a box over finds (Mid's boxCut): n villagers, idle first then the nearest, cut the finds in it, from the nearest open one outside when none  |  |
| E311 |  | a trained unit steps out onto the free spot of its building's outline nearest the middle (Mid's stepOut); none free, the queue waits; with y |  |
| E312 |  | nudged off its spot, it gives way while pushed and steps back once the crowd lets go: no tug of war with a walker, no shuffle between two on |  |
| E313 |  | how many of a building a side may have now: its age's limit with research added (D199), none before its age (D200); why not, in Mid's words  |  |
| E314 |  | why a building may not stand here, Mid's rules in order: the edge, the limit, the ground under it (a gate may take its owner's wall piece),  |  |
| E315 |  | two squares from every find too, measured from the footprint's edge to the find's middle (Mid's nodesNear) |  |
| E316 |  | the ghost snaps to the nearest spot that fits beside one of yours (touching, or a lane apart, edges or middles in line) or in line with one  |  |
| E317 |  | taking a building down pays back half its price, all of it early in the build; its line is paid back in full first (Mid's shellBack, refundO |  |
| E318 |  | a wall dragged from corner to corner: a straight run of tiles, four-connected so nothing slips through a diagonal (Mid's wallLine); laid pie |  |
| E319 |  | the walk starts on the Town Center's own floor; walls being laid count as built; everything is put back after |  |
| E320 |  | a builder remembers the work it left (its find and yield, and whether it was pulled off it) so it can go back (Mid's sendBuilder); one alrea |  |
| E321 |  | a new site gets the nearest free villager; with none free, your nearest worker is pulled off and goes back after, a computer's lowest earner |  |
| E322 |  | back to the very find it left if it still stands, else the best of its yield, else idle (Mid's backToWork) |  |
| E323 |  | the next site for a builder done: a wall piece close by, else a site nobody raises (Mid's repairTick) |  |
| E324 |  | a site finished: a drop-off or field puts its builder to work there, unless it was pulled off other work; else the next site, else back to w |  |
| E325 |  | mending, Mid's: three times the build time for a whole building, a quarter of its price paid as it goes; short of any part, it stops (QCK) |  |
| E326 |  | a crew of n raises a site at n^0.7 (QAC), counted once a tick; frost slows stone work; the site's health rises with it |  |
| E327 |  | of the buildings that can take an order, the one with the shortest line (Mid's shortest) |  |
| E328 |  | a gate is walkable only to those its owner does not count a foe: asked of combat.js by the shut hook, for the walker on the path in hand; no |  |
| E329 |  | a gate is shut to a foe of its owner, and to an unknown walker (the seal's foe) |  |
| E330 |  | the computer's wall ring: from its age, with stone, a few pieces a round, gates first, while it keeps its stone (Mid's decide) |  |
| E331 |  | an arc of wall round the Town Center facing the middle, four-connected; its two squares nearest the middle are the gate (Mid's wallPlan) |  |
| E332 |  | who trains a kind: the building with the shortest line; walls are laid as lines; walls and gates show the seal |  |
| E333 |  | the ghost to the finger, lifted above it on a phone, snapped beside yours; the reason it may not stand is kept for the label |  |
| E334 |  | a wall's next corner snaps flat or upright when nearly so; its tiles from its corners (Mid's wallSnap, wallSet) |  |
| E335 |  | a finger on a wall's corner moves it, on its line slides the whole wall; elsewhere it looks around and a tap adds a corner (Mid's wallHit, w |  |
| E336 |  | Build: a wall line laid while the stores last, said in one toast; a building sent its nearest free villager (or the one picked), then the gh |  |
| E337 |  | while placing, the finger moves the ghost (a wall's corner or line), not the map |  |
| E338 |  | the ghost's own art tinted green where it fits and red where not, one tinted copy a sprite and colour (Mid's ghostTint) |  |
| E339 |  | while a wall or gate is placed: a red line where a foe could walk in, or Sealed over the Town Center (Mid's drawSeal) |  |
| E340 |  | the ghost: a wall's tiles green or red with its corners, the first ringed green; a building's guides to yours in line and its tinted art, no |  |
| E341 |  | a tap on open ground while the Build page is open: what fits there is picked and its ghost put there (Mid's suggestAt) |  |
| E342 |  | dragging the ghost near the screen's edge scrolls the map (Mid's edgeScroll) |  |
| E343 |  | what fits a spot: a drop-off for finds far from theirs, more of what stands round you, a wall in a narrow way (a gate beside your wall), a h |  |
| E344 |  | fish round every lake: a spot every D218 per of its radius, walked out from the middle to the shore and set inset back into the water, each  |  |
| E345 |  | a find laid where something falls (game becomes a carcass where it stood); a lake near enough to stand a dock by, past its beach |  |
| E346 |  | a boar near every Town Center, at the book's spot in each corner (Mid's boar) |  |
| E347 |  | the gather beat: the field is worked now (its soil wears); a flock's food goes straight to the store; a plot with an amount runs down and it |  |
| E348 |  | what a unit eats a second: its kind's shares (its Upkeep, with research) of a person's day; a famine past its grace weakens work and blows ( |  |
| E349 |  | everyone eats, every moment: a villager working food eats from its find, not the store (a field and game for nothing, a shepherd from the st |  |
| E350 |  | an order of yours costs its soldiers' meals for D213's seconds, never more than the store holds (Mid's orderCost; the tiredness comes with t |  |
| E351 |  | the year's work: everyone eats; a field's soil wears while worked and rests back, never under its floor (QAA, Mid's natureTick); each season |  |
| E352 |  | each season's turn: food in store spoils (QAD); in spring fish regrow (QY), lambs come (QY) and a tended flock is culled to half for mutton  |  |
| E353 |  | a cut-out plot is replanted at D222's share of its price and is full again; from a drop-off, every cut-out plot of what it takes, nearest fi |  |
| E354 |  | send a hunter: the given villager, or the nearest idle one, else the nearest from other work (not a builder or a posted worker); it fights t |  |
| E355 |  | QBO the blow on a unit: × the counter; a villager's javelin on game × D221; on a soldier, an animal's at D231 wild, a runner's × routHit, ×  |  |
| E356 |  | a building that falls pays its destroyer D233 of its price (Mid's plunderBld); game falls as a carcass of its meat where it stood, and its h |  |
| E357 |  | hunt a beast from its card; replant a cut-out plot, or every one a drop-off takes, from theirs |  |
| E358 |  | a pasture's card counts its sheep |  |
| E359 |  | the town is told what food, the seasons and the flock do, in the Words book's news |  |
| E360 |  | the ground under a walker as it steps toward the tile to (QN, QR): its mud (the marsh always), its snow cover, its ice (D225), the friction  |  |
| E361 |  | QCB the pace: Pandolf's cost of walking solved for the speed, its power set by the walker's base (D86 with research, QCA) unloaded on flat f |  |
| E362 |  | QR each second on ice: the step lands on the ice with the chance of its cover, else on the ground; it slips exactly when the friction it nee |  |
| E363 |  | a slipped walker stands G10's seconds; which way it walks, for the wind |  |
| E364 |  | above freezing lake ice's degree-seconds fall four times as fast; ground ice thaws by the degree (D225) and its degree-seconds are set to ma |  |
| E365 |  | the share of the ground under ice: √ of its freezing degree-seconds over D225's full (QQ, Stefan) |  |
| E366 |  | the armour kit a side has learned (Mid's KIT): 0 to 3 steps of the Sprites book's kit, each turning a person's slots (mail and a steel helm, |  |
| E367 |  | one drawing list for every figure that is not a person or a beast (the engines, the chariot, the elephant, the riders, the elite pennant): e |  |
| E368 |  | a look by its rank: level 0 the look itself, level n the nth of its rank list, past the list its last (Mid's LOOKS by tier) |  |
| E369 |  | the Unit shell's classes: a class's kinds in book order; what a building trains (D133: a shell, or a class's kinds); a kind is open from its |  |
| E370 |  | a kind's ranks (Mid's tiers): the steps whose rank names it, learned, in book order, give its level and its name; the kit is how many armour |  |
| E371 |  | the army's ceiling: soldiers (a kind with a class), queued ones counted, against D226 (Mid's ARMYMAX; a fallen side's share, capA, joins it  |  |
| E372 |  | the army: a side's soldiers, the kinds with a class (Mid's armyOf); BUSY names who keeps to its own work and armyFree leaves them out (the r |  |
| E373 |  | why a kind waits: the age it opens in (Mid's trainWhy) |  |
| E374 |  | the load, the ground's η (QN, research cuts), and the wind's drag ½ρCdA v/v/ (W1, by the mass to the ⅔, D224), v the walk against the wind ( |  |
| E375 |  | aV² + bV + c = 0: a the walking term, b the grade and the wind as a grade (100F ÷ g), c the standing and load terms less the walker's power; |  |
| E376 |  | QCL the weather of the moment: rates, wind and visibility from the strengths; the wind signed and gusting; a blizzard's hours counted while  |  |
| E377 |  | the weather's book (D229), a game hour, the gusts (a fractal of the day's dice, set at the start) and the particle pool (the looks' dice) |  |
| E378 |  | QCL rain and snow rates, the wind, its gusts and the visibility (QK: Koschmieder over rain's and snow's extinction); a blizzard by the NWS:  |  |
| E379 |  | rain: Marshall–Palmer sizes at the rate (λ = N0 R^exp), each drop falling at its size's speed in metres a second on the screen, carried and  |  |
| E380 |  | snow: flakes falling slow to fast by size, carried by the wind and swaying |  |
| E381 |  | the white of low visibility: the contrast lost over the screen's width, 1 − e^(−3.912 d ÷ V) (QK) |  |
| E382 |  | a side knows a step of research by its key |  |
| E383 |  | the player's three squads (Mid's battalions): each one's plan by class, its shape, temper and intent (the dials), and the one picked for ord |  |
| E384 |  | who is in which squad (Mid's rebattalion): each keeps its squad while its class has room in the plan, the rest fill the first squad with roo |  |
| E385 |  | a squad's plan by class (Mid's sqPlan): a step of one under ten, five above, the whole squad at most D227 |  |
| E386 |  | what a squad lacks, by kind to train (Mid's musterGap): its plan less its soldiers and those mustering for it, each class as its first kind  |  |
| E387 |  | where a blow comes from (Mid's fromWhere): the cosine between the line's facing (its own and its comrades' near, D232) and the striker; the  |  |
| E388 |  | QAI a loss drains each soldier of its side within D231's lossR by 1 ÷ (D142 × n) (Mid's died, Dupuy's break) |  |
| E389 |  | Lanchester's odds above a half is exactly the ratio above one |  |
| E390 |  | a soldier at home keeps to its yard: within D235 of its post or of its Town Center (Mid's nearHome) |  |
| E391 |  | a foe building in the way is struck (Mid's findBlocker) |  |
| E392 |  | a group dressed into its shape at a tile (Mid's formUp): facing from home to there, the squads in order, blades before shooters; a column th |  |
| E393 |  | Albert's x% by x%: a soldier in a drill not D242's share of the way to its place by that share of the time stands where it is (Mid's drillOn |  |
| E394 |  | at home an army stands in the yard of the building that trained it (or its Town Center), toward the map's middle, a block a squad side by si |  |
| E395 |  | a broken soldier runs D231's run a step from the nearest foe (or toward home) at its own pace, for the run's seconds (research shortens it), |  |
| E396 |  | a soldier's day (Mid's solTick): nerve, healing by a shelter (QP), its drill; it keeps its foe while in reach of its sight × D238 leash × it |  |
| E397 |  | QAJ the missile: projectile motion with quadratic drag (the arrow's, W10), loosed at D245's angle, stepped until it lands; its speed for a d |  |
| E398 |  | in reach: it faces its foe; a shooter reloading with a blade near steps back (Mid's KITE), then strikes when ready |  |
| E399 |  | the missiles in flight: a streak along the drag path, its tail D245's share of the flight |  |
| E400 |  | a blow's sparks (Mid's sparkDraw) |  |
| E401 |  | the standards (Mid's drawStandards): a group of D sprites' least on the move carries its side's flag, a ring at its foot as full as its heal |  |
| E402 |  | Muster (Mid's musterN, musterCost, musterWhy, muster): a squad's lack in one order at the War Council: D244's times the price, the slowest k |  |
| E403 |  | the squads: a tap picks one for orders, a tap on the one picked opens its dials; Set up opens them for the one picked or the whole army |  |
| E404 |  | the squads' words and the step each dial waits for (Engagement, Formations, Battalions) |  |
| E405 |  | the War Council's card: the three squads, the picked one's plan by class (− and +) and Muster for what it lacks |  |
| E406 |  | the orders, missions and the War Director's measures and words; the groups on the march (ORD), the missions by squad or the whole army (MS), |  |
| E407 |  | the archers' arc (Mid's dress 'arc'): each on a circle of the arc's radius round the foe, a rank's gap apart along it, facing in |  |
| E408 |  | a charge spent: the pace drops to D249 slow and settles back to the walker's own (QP, N16); while it lasts the pace is D249 spd times the ch |  |
| E409 |  | the orders' shared measures: a point of a tile, the tile of a point, the length between, a group's centre, a tile's straight steps |  |
| E410 |  | the walk over the straight line (Mid's routeK): the way by A* (QBL), its steps summed, held within D247 least and route |  |
| E411 |  | a group's order you can follow (Mid's march): its tile, label, start and walk ratio; each soldier carries it, and the player hears where the |  |
| E412 |  | each soldier's one word (Mid's armyStatus): rout, fight, rally (sent home, walking to the flag, or away from its place), march, or hold once |  |
| E413 |  | the obvious order for what is picked (Mid's order, Albert Nov 2): a foe is fought, a beast hunted, a site raised or mended, a field or camp  |  |
| E414 |  | missions: a mission's soldiers, the hostile soldiers a group sees near it, and the chance (QAF) of the group against them with the counters  |  |
| E415 |  | each beat: every order's centre, count, fight and time left, arrived once all have stopped (Mid's ordersTick); every mission goes, acts or i |  |
| E416 |  | Go (Mid's hudFire, hudGo): a squad's idle soldiers, else the army's, march on the crosshair as one order and one mission; every ready squad  |  |
| E417 |  | who can still reach a fight in time, fastest first, until the fight is even (Mid's reinforcePlan); grouped into waves by arrival |  |
| E418 |  | the War Director: the soldiers of a kind that can go, the crosshair's tile, a move's wait in seconds; the charge's reason, the charge, fall  |  |
| E419 |  | the Director's six moves and the bombard (Mid's DIRECTS): each returns what it says, a reason without its bang when nobody moved |  |
| E420 |  | a kind's move, tap or hold (Mid's direct): it says its word, pays its meals (D213) and sounds its event |  |
| E421 |  | the choke (Mid's chokeAt): a drag across a gap, the soldiers stand in it as many files as it holds, facing the foe seen, else away from home |  |
| E422 |  | the nearest cover (Mid's coverNear): an open tile with forest within D252 cover, within D252 find of the crosshair |  |
| E423 |  | an ambush in place (Mid's ambushTick): once there it goes to ground (no foe sees it); a foe within reach or a blow springs them all with a c |  |
| E424 |  | your groups on the march (Mid's drawOrders): a dashed line to where they go, a ring there, the time left; the rally flag (flagAt); leaves ov |  |
| E425 |  | the finger's gesture: where it went down and is, when, and what a module made of it (a line, the crosshair, a box); a hold after D246 hold |  |
| E426 |  | the hold's ring once the finger plainly holds, and the box being drawn (Mid's drawTouch) |  |
| E427 |  | Attack is Go, held it is Home (Mid's station); the rally flag, held the ambush; the choke tool; reinforce the mission most in need; a kind's |  |
| E428 |  | a button held for D246 hold runs its second verb, and its click is swallowed (Mid's lpT) |  |
| E429 |  | Albert's one rule for the finger (Build 40, Nov 2): a tap picks yours, a second tap opens the card; with yours picked a tap is the obvious o |  |
| E430 |  | the crosshair (Mid's aimSpot, aimColor): a foe, a find or the ground under the tap; green yours, red a foe or a hostile near, blue an ally,  |  |
| E431 |  | the finger's holds and drags on the map: the choke drawn, the crosshair dragged, yours picked to keep picking, a box picks yours in it |  |
| E432 |  | the choke being drawn and the crosshair (Mid's drawReticle): brackets, a sonar ring, turning chevrons, a scan line, the cross, the time and  |  |
| E433 |  | a tile on the board (the floor gives -1 off it) |  |
| E434 |  | the narrowest gap on the road to a foe (Mid's gapOnRoad): from D251 ai.from tiles out to half way, each ai.step tiles, the open width across |  |
| E435 |  | the computer holds a gap (Mid's chokeClaim): once each D251 ai.every, with enough idle foot, files deep across the narrowest gap on the road |  |
| E436 |  | the Alarm and the end (F23, Mid's 09-nav, 12-sim-core, 13-sim-civil, 16-sim-fight, 40-emergency): the danger map's and the alarm's measures  |  |
| E437 |  | a threat (Mid's isThreat): alive, not inside, one that fights and is neither a villager, game hunted for meat, nor a soldier that strikes on |  |
| E438 |  | the danger map (Mid's dangerMap, stampDanger): each side's, drawn afresh each beat on the walking grid: foe level round every threat to it a |  |
| E439 |  | why a spot is dangerous, nearest cause first (Mid's dangerWhy): a threat near (its side named), an enemy tower's reach, else a fright rememb |  |
| E440 |  | a worker leaves a find that turns unsafe (Mid's vilTick): it drops the find and looks again, off the danger; your town is told why, once a l |  |
| E441 |  | going inside (Mid's vilTick, stepOut): a unit sent to a building with room walks to it and goes in, hidden and out of reach, at its middle;  |  |
| E442 |  | a villager's fright (Mid's vilTick, D254): soldiers near scare it, beasts or robbers when a pack comes or one hurt it; it runs into the near |  |
| E443 |  | the Alarm's ranking (Mid's shelterRank, roomIn, fillRank, threatDir): buildings with room, sturdiest first, then roomiest, each filled to it |  |
| E444 |  | the Alarm (Mid's emgStart, townSquare, soldiersIn, villagersIn): its first order notes each villager's work for Work; Gather sets everyone r |  |
| E445 |  | the warnings (Mid's incomingTick, watchHome, drawRadar): the nearest foe's soldier you see near your Town Center or marching on your buildin |  |
| E446 |  | a site nobody builds (F23, Albert's play test): one no villager of its side can reach says why once; else the nearest free villager who can  |  |
| E447 |  | a side falls (Mid's fall): its killer takes its stores and D233 of what its buildings cost; its people and buildings go; its army room × D25 |  |
| E448 |  | who wins (Mid's judge): your fall loses; every rival fallen wins; a Wonder standing D257 s wins for its side, the first finished first; a ti |  |
| E449 |  | the end (Mid's finish): won or lost, the text and the score (Mid's level played comes with the hazards setting), the best won score kept on  |  |
| E451 |  | the Alarm's four cells (Mid's EMERGENCY): Gather, Garrison and Shelter start it; Work ends it |  |
| E452 |  | the danger map's home on the walking grid (econ draws it) and each side's reach, cached by what changes the walkable tiles |  |
| E453 |  | the tiles a side's people can walk to: flooded by the way (QBL) from round its Town Center, gates as its own see them; a building's spot is  |  |
| E454 |  | the fallen, the hit glow and the marker (Mid's fallen, drawHitGlow, drawRadar; D258, D262, D261) |  |
| E455 |  | a figure that dies in sight topples back, away from the way it faced, and fades |  |
| E456 |  | something of yours hit: the screen's edge glows, red for a rival, the flame's for the wild, fading |  |
| E457 |  | foes near your Town Center out of view: a marker on the screen's edge points at them, their count in it and their time to arrive under it; a |  |
| E458 |  | Teach (Mid's teachTo, teachWhy, teach): an older soldier learns the newer kind its shell's teach slot names, if that kind is of a later age; |  |
| E459 |  | the lesson's price: what the newer kind costs more than the old, in each yield, plus tuition gold for each age climbed (Mid's teachCost) |  |
| E460 |  | the lesson done: the soldier is the newer kind, its health the same share of its new most (Mid's graduate) |  |
| E461 |  | prisoners (Mid's takePrisoner, payRansom, prisonersTick): a runner caught is held for a ransom of its price; paid, it walks home from its ha |  |
| E462 |  | Zeal (Mid's zealCost, zealWhy, zeal): the Temple blesses the squad for gold if a priest stands with them; their blows are stronger for a whi |  |
| E463 |  | each tick: a lesson that is over graduates; a prisoner unransomed in time goes over to its captor |  |
| E464 |  | a spy by a foe's building reads that side: its stores, age, research and army, kept with the time (Mid's intel) |  |
| E465 |  | priests, medics and spies (Mid's 14-sim-troops, spyTick): the support troops' own work, the heal of the wounded, and a runner taken prisoner |  |
| E466 |  | a hand on a runner that did not get away: a prisoner, not a blow (Mid's soldier tick; riders catch the foot) |  |
| E467 |  | a student stands still; a spy keeps to its own work; a priest converts when sent, else priests and medics walk with the army |  |
| E468 |  | walk with the army: to the nearest soldier of the side out, a few paces behind it (Mid's followArmy) |  |
| E469 |  | a priest beside a foe for D265's time turns it; walking off lets the spell fade; with no room the spell stops; then it rests (Mid's priestTi |  |
| E470 |  | the wounded heal by the best healer of their side in reach, a hospital or a medic, not the sum: the first-order lag (QP, Mid's healTick) |  |
| E471 |  | a shooting building watches for spies within its sight of one, more with research (Mid's watchtower, guarded, spySeen) |  |
| E472 |  | a spy is unseen unless a foe's soldier or watching building is near; by a foe's building it reads them |  |
| E473 |  | the computers' spy: it takes the first unguarded building it sees that can be sabotaged |  |
| E474 |  | sabotage (Mid's sabotage): a building burns a share of its health or stalls and loses the head of its line; the spy is spent; a fall by fire |  |
| E475 |  | a support troop told: a priest at a foe converts, a spy at a foe building sabotages, else it walks there |  |
| E476 |  | Teach on a soldier, Zeal at the Temple, a ransom at your hall |  |
| E477 |  | the troops row: Teach, Zeal and ransoms on your own card, the lesson's time left, and what your spy read on theirs |  |

## ground

| Code | Name | Value | Cited |
|---|---|---|---|
| G5 | dry grass; a boot's grip on dry ground | {mu: 0.35, grip: 0.7} | N104; N18; N173 |
| G6 | mud: wet ground or marsh; a boot's grip on it | {mu: 0.25, grip: 0.45} | N105; N18; N173 |
| G7 | snow cover; a boot's grip on packed snow | {mu: 0.14, grip: 0.3} | N106; N18; N173 |
| G8 | ice that bears a walker; a boot's grip on it: melting ice grip at and above freezing, rising to hard ice's cold at at °C under | {mu: 0.1, grip: 0.055, cold: 0.18, at: 20} | N107; N18; N178 |
| G9 | the friction a step needs, by what steps: a person's utilized friction (Burnfield & Powers), a horse and an engine's haulers (Mid's design, to open) | {person: 0.21, horse: 0.25, engine: 0.3} | N179; N19; N173 |
| G10 | slipping: iron studs give at least studs on ice; a slip holds a walker secs; each walker is checked every second; the town is told at most every tell seconds | {studs: 0.28, secs: 1.5, every: 1, tell: 20} | N174; N179; N173 |

## mass

| Code | Name | Value | Cited |
|---|---|---|---|
| W1 | a person; its drag ½ρCdA in N·s²/m² (ρ 1.2 kg/m³, CdA 0.45 m²) | {drag: 0.27, kg: 70, height: 1.8, com: 0.99, foot: 0.26, stride: 1.524} | N108; N109; N110; N181 |
| W2 | a horse | {kg: 500, height: 1.6, com: 1.2, foot: 0.6, stride: 2.5} | N85 |
| W3 | a deer | {kg: 70, height: 1.0, com: 0.7, foot: 0.4, stride: 1.5} | N85 |
| W4 | a wolf | {kg: 40, height: 0.8, com: 0.5, foot: 0.35, stride: 1.4} | N85 |
| W5 | a bear | {kg: 200, height: 1.0, com: 0.6, foot: 0.5, stride: 1.2} | N85 |
| W6 | an engine on wheels (ram, catapult) | {kg: 1000, height: 1.5, stride: 2.0} | N111 |
| W7 | a tool (axe, pick, hammer) | {kg: 2, blow: {kg: 2, mps: 8}} | N85 |
| W8 | a spear | {kg: 2.5, blow: {kg: 2.5, mps: 6}} | N85 |
| W9 | a shield | {kg: 5} | N85 |
| W10 | a bow, its blow an arrow; the arrow's drag ½ρCdA in N·s²/m² (ρ 1.2, Cd about 2 on an 8 mm shaft) | {kg: 2, blow: {kg: 0.03, mps: 50, drag: 6e-05}} | N85; N189 |
| W11 | scale armour | {kg: 12} | N85 |
| W13 | a lance: a thrust when standing; moving, the whole rider and horse strike (QBT) | {kg: 4, blow: {kg: 4, mps: 6}} | N85 |
| W14 | a wagon's or caravan's load | {kg: 100} | N97 |
| W12 | timber | {density: 600} | N87 |
| W15 | stone | {density: 2400} | N87 |
| W16 | iron | {density: 7870} | N87 |
| W17 | a boar | {kg: 80, height: 0.9, com: 0.5, foot: 0.3, stride: 1.2} | N85; N170 |
| W18 | a bison | {kg: 700, height: 1.8, com: 1.1, foot: 0.6, stride: 2.2} | N85; N170 |
| W19 | a sword | {kg: 1.2, blow: {kg: 1.2, mps: 8}} | N177 |
| W20 | a javelin, its blow thrown | {kg: 1, blow: {kg: 1, mps: 20}} | N177 |
| W21 | a crossbow, its blow a bolt | {kg: 5, blow: {kg: 0.08, mps: 45}} | N177 |
| W22 | a matchlock gun, its blow a ball | {kg: 5, blow: {kg: 0.02, mps: 350}} | N177 |
| W23 | a war elephant | {kg: 4000, height: 2.7, com: 1.5, foot: 0.45, stride: 2.5} | N177 |
| W24 | a unit of a load carried: set so a full load (D87) is Mid's 0.9 of the walk under Pandolf (QCB) | {kg: 1.4019} | N173; N185 |

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
| D86 | speeds in metres a second (walk: quick time, 120 steps of 30 in a minute, 3.4 mph); Mid's own by its walker's 24: a rider 36 (ride), an elephant 22, an engine 12 (push), the bombard 10 (drag), the boar 30, the bison 70 and the scout 27 (F17b) | {walk: 1.52, ride: 2.28, horse: 1.7, push: 0.76, drag: 0.6333, deer: 1.5, wolf: 2.5, bear: 1.5, boar: 1.9, bison: 4.43, elephant: 1.3933, sc | N71; N72; N73; N79; N170; N176 |
| D87 | a load | 10 | N112 |
| D88 | gathering a second, the old game's own (fish and meat Mid's, for when they come) | {bush: 0.9, tree: 0.75, gold: 0.6, stone: 0.55, iron: 0.5, fish: 0.8, meat: 1.2} | N70; N164 |
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
| D103 | a wet spell is a storm (lightning) from this intensity (the top quarter, as v100's 0.25 of wet hours before) | 0.75 | N112; N185 |
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
| D123 | what a thing costs (Mid's BLD and UNIT cost, by the 10:31 rule; a second Town Center Mid's town, each unit the Mid kind it wears) | {BTC1: {wood: 400, stone: 300, food: 200}, BR1: {wood: 30}, BI1: {wood: 80}, BI2: {wood: 80}, BI3: {wood: 80}, BCL1: {wood: 60}, BM1: {wood: | N168; N176; N194 |
| D124 | seconds to train (Mid's UNIT t for every unit, Albert, Nov 5 10:06) | {UV: 8, UM1: 10, UM6: 12, UM2: 10, UM7: 9, UM8: 12, UM9: 14, UM10: 12, UM3: 16, UM11: 14, UM12: 28, UM4: 20, UM13: 24, UM5: 25, UM14: 40, UM | N169; N176; N194 |
| D125 | one villager's seconds to raise a site (Mid's build times, BLD t; the Town Center a second one, Mid's town) | {BTC1: 60, BR1: 12, BI1: 15, BI2: 15, BI3: 15, BCL1: 10, BM1: 25, BM2: 25, BM3: 25, BM4: 30, BW1: 10, BW2: 12, BW3: 25, BW4: 6, BCL2: 12, BC | N169; N168 |
| D126 | n villagers raise it at n^this | 0.7 | N114 |
| D127 | the people a building houses | {BTC1: 10, BR1: 5} | N69 |
| D128 | the most people, soldiers among them (Mid's POPMAX, by the 10:31 rule) | 180 | N176 |
| D129 | each age's price and its wait in seconds, by the ages of D130 (Mid's AGES); the sixth is hidden until a year of peace opens it; the first age up sizes Z1's food (Mid's pocket) | {cost: [{}, {food: 300, wood: 100}, {food: 600, gold: 200}, {food: 1000, gold: 500, stone: 200}, {food: 1600, gold: 900, stone: 300, iron: 4 | N160 |
| D130 | the six ages (Mid's names; Albert, Nov 5 10:30) | [Stone, Bronze, Classical, Medieval, Gunpowder, Enlightenment] | N160 |
| D131 | a share: what one person eats a day (Mid's UPKEEP.share, 30 food a minute feeding eight) | 7.5 | N170 |
| D132 | move on when another find pays this much more (Mid's 1.18) | 0.18 | N114; N164 |
| D133 | who trains whom: a shell, or a class (every kind of it, each from its age); the scout at the Town Center (Mid's keep) | {BTC1: [UV, US4], BM1: [Foot], BM2: [Archers], BM3: [Riders], BM4: [Engines], BP3: [US1], BP6: [US2], BP8: [US3]} | N114; N176; N194 |
| D134 | the bell | 900 | N114 |
| D135 | the score's divisors | {unit: 5, bld: 5, tech: 5, wealth: 10} | N75 |
| D136 | a farm's food a second | 0.4 | N69 |
| D137 | a find no path reached is left alone for | 60 | N114 |
| D138 | a unit's health, blow, reach and sight in tiles (Mid's ÷ D12), pace; a soldier's tags, its counters (vs: × its blow on a kind, class or tag), its blow on a building (bld, × its blow), roofed (rarmor, × arrows and bolts it takes), building-only (bonly) and kiting (kite), every one Mid's UNIT (no flat armour: its armour is the research share D228); its health and blow open for Albert's play test; the boar and the bison Mid's | {UV: {hp: 25, atk: 3, rng: 1, rof: 1.5, tags: [civ]}, UM1: {hp: 60, atk: 6, rng: 1.2, rof: 1.2, sight: 13, tags: [infantry, spear], vs: {Rid | N69; N170; N176; N188; N194 |
| D139 | a building's health; the tree farm and the pasture a farm's, the dock Age of Empires II's | {BTC1: 2400, BR1: 550, BI1: 600, BI2: 600, BI3: 600, BCL1: 480, BM1: 1200, BM2: 1200, BM3: 1200, BM4: 1500, BW1: 1800, BW2: 2750, BW3: 1020, | N69; N170 |
| D141 | a blow from behind the line lands this much harder (Mid's FLANK) | 1.3 | N188 |
| D142 | a wave breaks under this share of its start (QBQ); a soldier's loss drains each one near 1 ÷ (this × n) (QAI) | 0.3 | N76 |
| D143 | what shoots: its blow, seconds a shot, the reach of its bow from the ground and its height (tiles), its reach's research (rng adds): Mid's watchtower, Town Center and camp tower; it shoots as far as an arrow loosed from that height lands (QAJ); the Courthouse shoots only what ticks its only (Mid's spyonly) | {BW3: {atk: 10, rof: 1.2, bow: 10.6, h: 4.4, rng: 0}, BTC1: {atk: 7, rof: 1, bow: 10.6, h: 3.4, rng: 0}, BTC8: {atk: 6, rof: 1.4, bow: 9, h: | N188; N39; N40; N194 |
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
| D193 | the odds: a unit's power is its health × its blow ÷ per; who counters whom is weighed over the first look of each army, held between lo and hi; a building-only kind counts bonly of its power (Mid's unitPower) | {per: 6, look: 10, lo: 0.6, hi: 1.6, bonly: 0.3} | N157; N188 |
| D194 | a unit's power counts at least this blow (Mid's unitPower) | 1 | N157 |
| D195 | the forager: a field (or a tree begun) counts as life loads; how many a find holds before they crowd (QX); the finds one works at a time: a tree one feller, a field one worker (the Open style) | {life: 20, hold: {tree: 1, bush: 2, fish: 2, stone: 3, gold: 3, iron: 3, carcass: 2, other: 2}, cap: {tree: 1, bld: 1}} | N164; N166 |
| D196 | standing, in metres: a pace apart (3 ft), near enough a spot to stand on it (a quarter pace), the ring a find is worked from (Mid's WORK_R); the lattice's rings, pack × √(D128) and spare more, its second axis at 60° (hex, QCI); two who meet part with pass as much again to the side, each to its right, so they slip by (QCJ) | {apart: 0.9144, arrive: 0.2286, work: {fish: 1.495, other: 1.035}, pack: 0.525, spare: 2, hex: [0.5, 0.866025], pass: 0.5} | N164; N165; N166; N167 |
| D197 | a worker whose find is gone looks from metres, widening by grow over tau seconds (Mid's REACH ÷ 2 and × 1.5), waits at its drop-off and looks again every again seconds | {from: 14.95, grow: 44.86, tau: 20, again: 2} | N164 |
| D198 | the eight ways from a tile, the four straight first | [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]] | N74 |
| D199 | how many of a building a side may have, by age (Stone to Gunpowder; a later age keeps the last), research adding to each (Forest law, QCA); null: no limit; the Town Center counts the ones past the seat (Mid's cap, its town's for a second one) | {BTC1: [0, 0, 1, 2, 2], BTC2: [0, 0, 0, 1, 2], BTC5: null, BTC6: null, BTC7: null, BTC8: null, BR1: null, BR2: null, BCR1: [1], BCR2: [1], B | N168 |
| D200 | the age a building opens in (Mid's BLD age; the rest from the first) | {BTC1: 2, BTC2: 3, BTC5: 1, BTC6: 1, BTC7: 1, BTC8: 1, BR2: 2, BCR2: 3, BCL4: 2, BCT1: 1, BP1: 1, BP2: 2, BP3: 1, BP4: 2, BP5: 2, BP6: 2, BP | N168 |
| D201 | a villager mends a whole building in time × its build time, for cost × its price, paid as it goes; within this much of its health it is whole (Mid's) | {time: 3, cost: 0.25, within: 0.5} | N168 |
| D202 | a building taken down pays back share of its price, early (all of it) while the site is under first raised; what waits in its line comes back in full (Mid's shellBack) | {share: 0.5, first: 0.15, early: 1} | N168 |
| D203 | a line of wall gets crew builders at most, who work down it; a builder done takes the next wall piece within wall tiles, else a site nobody raises within site tiles, else goes back to its work (Mid's 60 and 220 units in its 10-unit squares) | {crew: 2, wall: 6, site: 22} | N168 |
| D204 | a site stands at start of its health and gains rise of it as it is raised (Mid's mkBld and bldTick) | {start: 0.1, rise: 0.9} | N168 |
| D205 | a building that costs stone rises at share in frost, the air at or under at °C: mortar will not set (Mid's frost weather) | {share: 0.5, at: 0} | N168 |
| D206 | placing, in tiles unless said: lane tiles round every building and from every find (walls, gates and fields may touch; nothing touches one that trains); the ghost snaps beside one of yours, touching or a lane apart (gaps), within near, or in line with one within guide (the guide drawn pad past both), to the nearest spot within tol (least, or zoom ÷ the zoom), start from the screen's middle; a find stands half a tile in; on a phone the ghost waits lift px above the finger; within edge px of the screen the map scrolls scroll px a second; a wall corner is caught within hit px, and a drag nearly flat or upright, under 1 in flat, is made so; after a building the next spot is its size and next for its material away (timber leaves a gap for fire); the tint and the ghost's alpha; a corner's knob, the lines' widths and dashes in px; a tile's corners in order (Mid's) | {lane: 2, gaps: [0, 2], near: 4, half: 0.5, guide: 26, pad: 1.2, tol: {least: 1.4, zoom: 2.6}, start: 20, lift: 64, edge: 48, scroll: 320, h | N168 |
| D207 | while walls are laid: a foe's walk out from the Town Center reaching reach tiles is a way in, shown, else Sealed; looked again every seconds (Mid's SEAL) | {reach: 38, every: 0.3} | N168 |
| D208 | the computer's wall ring: ring tiles out from its Town Center, an arc of ± steps of step rad facing the middle, its gates the two squares nearest the middle and laid first; from age, with stone, up to pieces a round while it keeps that much stone (Mid's WALL_R, 260 units in its 10-unit squares, and wallPlan; the balanced computer walls) | {ring: 26, steps: 66, step: 0.019, gates: 2, age: 1, stone: 60, keep: 40, pieces: 3} | N168 |
| D209 | what fits a tapped spot, in tiles and scores: a drop-off for finds within near × r with none within dropR; more of what stands within r (a home: a home; a field: a mill, then a field; an army building: the one you lack; a wall: a gate; the Town Center: a home, keep); a narrow way, its disc of area tiles between choke solid: a wall, or a gate beside your wall; a home when room is short (Mid's SUGGEST) | {r: 14, near: 0.85, dropR: 11, drop: 3, kin: 3.5, keep: 1, area: 4, choke: {lo: 0.35, hi: 0.75}, chokeW: 4, room: 2, short: 1.5} | N168 |
| D210 | a building that needs another of its side standing first (Mid's: the Apartment an Aqueduct) | {BR2: BP7} | N168 |
| D211 | the shares a kind eats, its Upkeep: a person one, a foot soldier 1.5, a rider 3 (its horse's fodder), a cart 2; a wagon none (Mid's UPKEEP) | {person: 1, foot: 1.5, mounted: 3, cart: 2} | N170 |
| D212 | a famine (the store empty, no food in reach): full strength for days, then work and blows at work (the Minnesota study's grip, 58.2 to 41.8 kg); fed again with more than fed in store (Mid's STARVE, UPKEEP.hunger) | {days: 2, work: 0.72, fed: 20} | N170; N171 |
| D213 | an order you give costs its soldiers' meals for this many seconds (Mid's ORDER, half a minute) | 30 | N170 |
| D214 | a field's soil: it loses loss a year while worked (worked within the last worked seconds) and wins back rest a season at rest, never under floor nor over full (Mid's FERT) | {loss: 0.1, rest: 0.4, floor: 0.6, worked: 2, full: 1} | N29; N170 |
| D215 | the year's harvest, rolled each spring: the first row whose upTo passes the roll gives the fields' m; one year in 20 fails (half), one in 6 is poor (30% less), the rest normal (Mid's HARVEST, its chances summed) | [{upTo: 0.05, m: 0.5}, {upTo: 0.21666666666666667, m: 0.7}, {upTo: 1, m: 1}] | N170 |
| D216 | each season's field yield, spring to winter (Mid's SEASONS) | {farm: [1, 1.1, 1.25, 0.4]} | N170 |
| D217 | food in store spoils this share a year, taken at each season's turn; a loss of say or more is told (Mid's SPOIL; the FAO's 2 to 10%) | {year: 0.05, say: 20} | N32; N33; N170 |
| D218 | fish: a spot every per of a lake's radius, inset into the water from its shore, each holding amt × the radius ÷ r0 (Mid's 350 × its RICH 2.5); they regrow each spring at r a year toward that (QY), and are worked only within near of a finished dock of the side; a dock stands within shore of a lake past its beach (Mid's FISH, DOCKR, lakeGap) | {amt: 875, r0: 60, r: 0.5, per: 10, inset: 8, near: 150, shore: 70} | N27; N28; N170 |
| D219 | a pasture's flock: start sheep, at most max; lambs each spring at lambs toward max (QY); a tended flock is culled to hold (half the most) each spring for mutton food a sheep (QZ); its shepherd takes milk food a second a sheep; a wolf or bear within wolf takes up to take sheep a season (Mid's pasture, LAMBS, FLOCK, MUTTON) | {start: 6, max: 12, lambs: 0.6, milk: 0.03, mutton: 100, wolf: 260, take: 2, takers: [MW4, MW6], hold: 6} | N27; N28; N170 |
| D220 | the food game gives when it falls (Mid's meat × its RICH 2.5) | {MW3: 500, MW7: 850, MW8: 1000} | N170 |
| D221 | a villager's javelin strikes game at blow times its blow (Mid's huntTick) | {blow: 5} | N170 |
| D222 | a tree farm: amount wood at rate a second, then cut out; replanted at replant × its price (Mid's treefarm, Albert's 36 and 12) | {amount: 1200, rate: 0.55, replant: 0.5} | N170 |
| D223 | the boar of each corner and its spot in the corner's frame, about 300 from the Town Center and clear of the home pond (Mid's boar, 280 to 380 from the keep) | {code: MW7, at: [470, 660]} | N170 |
| D224 | the pace (QCB): each state that slows a walker, by the field that holds it (sickness 0.8, Mid's); a boot with no iron has no studs; how deep each sinks in mud, a foot 1 and the camp wagon's wheels 2 (Mid's wheelMud); Pandolf's coefficients, standing, load, walking and grade (W, kg; V, m/s; G, %); a grade as a percent; a body's drag area grows as its mass to the two-thirds (geometric similarity) | {state: {sick: 0.8}, bare: 0, sink: {foot: 1, UT2: 2}, pandolf: {stand: 1.5, load: 2, walk: 1.5, grade: 0.35}, pct: 100, area: 0.6667} | N13; N173; N181; N185 |
| D225 | ice on the ground: it grows while the ground is wetter than wet and the air below freezing, full at fdd freezing °C·s (thickness ∝ √), and thaws melt a °C·s above freezing (Mid's CLIMATE.ice) | {wet: 0.225, fdd: 500, melt: 0.0064} | N17; N173 |
| D226 | the most soldiers a side may have, queued ones counted (Mid's ARMYMAX: the phone's ceiling); a fallen side's share adds to it | 120 | N176 |
| D227 | the most soldiers a squad holds (Mid's BNSIZE), with the squads | 40 | N176 |
| D229 | weather by one intensity I, 0 to 1, drawn at a wet spell's start (QCL): rain most mm/h (Marshall–Palmer drops, N0 and the rate's power; sizes dMin to dMax mm; extinction beta R^pow a km), snow most mm/h of water (extinction S ÷ c a km; flakes fall slow to fast m/s); a drop's fall speed a − b e^(−c D) (QJ); wind most m/s, gusting ± gust of it by a fractal of the day's dice (seed, k waves, dimension, period s), so a gust is 1 + gust of the wind; visibility k ÷ extinction a km, km metres to one (QK); a blizzard by the NWS: wind or gusts at least wind m/s (35 mph), visibility under vis m (a quarter mile), for hours; the white veil's most (Koschmieder's contrast lost over the screen's width); a pool of particles whose active count is the strength | {pool: 240, rain: {most: 50, n0: 4.1, exp: -0.21, dMin: 0.5, dMax: 4, beta: 0.312, pow: 0.67}, snow: {most: 5, c: 0.2, slow: 0.5, fast: 1.5} | N9; N10; N180; N182; N183; N184; N186; N187; N185 |
| D230 | the most tiles the way (QBL) opens before it gives up; the most places tried for a wild group | {way: 20000, spot: 100} | N112 |
| D228 | the share of a blow a soldier takes before its armour research, which keeps the lowest share it reaches (Mid's stats armor) | 1 | N176 |
| D231 | a soldier's nerve, 1 when steady: a blow that lands takes hit × the harm ÷ its most health, from the front × front, the side × side, behind × rear; a kill gives kill; a loss within lossR tiles drains (QAI); outnumbered more than this to one within crowd tiles drains odds a second; at rest it settles back over tau s (QP), shelter times faster within shelterR tiles of its own wall or tower; broken, it runs from the nearest foe within flee tiles, run tiles a step, for the run's seconds (D239 rout), takes routHit, and comes back at after; an animal's blow lands at wild and shakes no nerve (Mid's MORALE) | {full: 1, hit: 0.8, side: 1.5, rear: 2, kill: 0.04, lossR: 4, odds: 0.02, crowd: 10, outnumbered: 1.5, tau: 15, shelter: 1.5, shelterR: 6, r | N188; N76; N16 |
| D232 | where a blow comes from: a comrade within cover tiles on that side covers it; the line's facing sums those within line tiles; a blow is from behind past the behind cosine, from the side under cos; only a blade (reach up to melee tiles) flanks (Mid's FLANKING) | {cover: 3, line: 4, cos: 0.5, behind: -0.5, melee: 2} | N188 |
| D233 | a building that falls pays its destroyer this share of its price (Mid's PLUNDER) | 0.25 | N188 |
| D234 | blades brittle in frost and rusted in rain or snow strike this much less, less each research's share (Mid's CLIMATE.wear; Tempering, Oiled steel) | 0.15 | N188 |
| D235 | a soldier at home fights within this many tiles of its post or its Town Center (Mid's YARD) | 32 | N188 |
| D236 | a shooter reloading steps back back tiles from a blade within near, for hold seconds (Mid's KITE) | {near: 4.5, back: 2.8, hold: 0.5} | N188 |
| D237 | a soldier at rest within r tiles of its own shelter heals (Mid's GARRISON; its pace is D239's garrison, QP) | {r: 7} | N188; N16 |
| D238 | a soldier's choice of foe: its side within group tiles add their power (Lanchester); a foe that cannot hurt still counts least; it keeps a foe within leash × its sight × its temper's chase; the computers keep the temper guard; hold fights only within reach, press never kites; No pursuit (loose) looks step tiles past its reach, Buildings first (bld) takes the nearest building; a squad's plan steps by steps[1] under steps[0], else steps[2]; at home a soldier walks back when farther than near tiles from its post (Mid's GROUP_R, foeValue, TEMPER, INTENT, sqPlan) | {group: 6, least: 0.1, leash: 1.4, temper: {hold: 0, guard: 1, press: 2}, intent: {engage: 0, loose: 1, bld: 2}, step: 1, steps: [10, 1, 5], | N188; N36; N37 |
| D239 | the bases of shares that research moves and no shell holds: nerve's settling (rest, shelter), healing at a shelter (garrison: most health ÷ this, seconds), the run (rout, seconds), wear's research, a blow on a building, a charge, a walker's share of its pace from its shape and its march (pace), the room inside a building not in D256 (hold) (Mid's MORALE, GARRISON, fxv); Teach's opening (teach) and its time (lesson), Zeal's seconds, price and rest, a conversion's time, a watcher's sight of a spy (spysight), a healer's pace (heal) | {rest: 1, shelter: 1, garrison: 0.6, rout: 8, wear: 0, bld: 1, charge: 1, pace: 1, hold: 0, teach: 0, lesson: 1, zealsecs: 0, zealcost: 1, z | N188; N194 |
| D240 | a squad's shape, each a trade: riders in it strike × dmg; it takes × hit, from riders × vsRiders; it walks × spd; an army marches in column once Formations is known (Mid's FORM, COLUMN) | {line: {dmg: 1, hit: 1, spd: 1, vsRiders: 1}, wedge: {dmg: 1.15, hit: 1.1, spd: 1, vsRiders: 1}, square: {dmg: 1, hit: 0.9, spd: 0.8, vsRide | N188 |
| D241 | an army stands in a grid gap tiles apart, about rows times as wide as deep, at most most files; at home in its building's yard tiles past it, a block a squad of √(n × block) files up to cols; a column three files, a choke three; support rings its blades round at least ring places (Mid's GRID, formUp, CHOKE) | {gap: 1.5, rows: 2, most: 14, yard: 2.4, block: 2.5, cols: 10, column: 3, choke: 3, ring: 6} | N188 |
| D242 | a soldier in a drill not this share of the way to its place by this share of the drill's time stands where it is (Mid's FORMING, Albert's x% by x%) | {share: 0.7} | N188 |
| D243 | a squad's temper, Hold, Guard, Press: blows on it shake its nerve × nerve, it strikes × dmg, chases × chase (Mid's TEMPER) | [{nerve: 0.8, dmg: 1, chase: 1}, {nerve: 1, dmg: 1, chase: 1}, {nerve: 1.3, dmg: 1.1, chase: 1.3}] | N188 |
| D244 | Muster: a squad's lack in one order at the War Council, cost times the price, the slowest kind's time shared by its buildings, times time (Mid's musterCost) | {cost: 2, time: 1.25} | N188 |
| D245 | a missile's flight (QAJ): loosed at A5, stepped dt seconds, its speed found in tries halvings; drawn as a streak tail of its flight long; a blow's sparks last spark seconds, at most sparks at once | {dt: 0.01, tries: 24, tail: 0.12, spark: 0.3, sparks: 40} | N188; N39; N40 |
| D246 | the finger (Mid's 26-input, Albert's one rule, Nov 2): held hold ms it picks more on one of yours, drags the crosshair on it, else draws a box; its ring shows after show ms (a tap never sees it), ring px wide; a second tap within dbl ms and slop px opens the card; a finger that moves move px looks around (v100's); a unit within the larger of hit px and hitZ px a zoom, lift px a zoom over its foot, is under the finger; a box under box px is a tap; a marching group's ring answers within ord px; ms a second | {hold: 320, show: 250, dbl: 320, ring: 26, move: 6, hit: 16, hitZ: 9, lift: 8, box: 12, slop: 26, ord: 26, ms: 1000} | N190 |
| D247 | orders and missions (Mid's HUD, ARMY_STILL, routeK, ordersTick; distances Mid's px ÷ 10, in tiles): a fight is the hostile soldiers seen within near tiles of a group; a mission whose chance (QAF) falls under lose says it is losing, once until it climbs past clear; the chance moves smooth of the way each beat s; reinforcements arriving within gap s of each other are one wave, at most waves; a soldier still for still s holds; the finger within aim px of the crosshair drags it; a soldier over home tiles from its place is rallying; the walk (QBL) is least to route times the straight line; an order has arrived when all have stopped after settle s; reinforcements stop once the power ratio reaches even; the crosshair reads red with a hostile within danger tiles (Mid's 60 px) | {near: 14, lose: 0.4, clear: 0.5, smooth: 0.3, gap: 8, waves: 3, still: 2.5, aim: 56, home: 1.4, route: 3, least: 1, beat: 1, settle: 3, eve | N190 |
| D248 | the War Director (Mid's DIRECT): a shield wall stands secs s in a line wearing the shape's trade, holding; the archers may loose again after loose s, in an arc at arc of the shortest bow's reach round the foe for arcSecs s (Mid's three volleys); riders may wheel again after wheel s, riding behind tiles past the foe away from home; engines bombard the foe's nearest building within bombard tiles of the crosshair | {wall: {secs: 12, shape: square, lay: line}, loose: 6, wheel: 15, behind: 7, arc: 0.8, arcSecs: 18, bombard: 30} | N190 |
| D249 | the charge (Mid's CHARGE): spd times the pace for secs s, with nerve more nerve; then the pace drops to slow and settles back with time constant tired s (QP); once each cd s; its blow is its speed's momentum (QBT), not Mid's 1.3 | {secs: 6, spd: 1.5, tired: 10, slow: 0.8, cd: 30, nerve: 0.1} | N190; N191; N16; N82 |
| D250 | fall back in order (Mid's FALLBACK): for secs s soldiers step back tiles away from the nearest foe within look tiles (else toward home), take blows × hit and do not rout | {secs: 6, back: 20, look: 20, hit: 0.7} | N190 |
| D251 | the choke (Mid's CHOKE): a gap held min to max files across, a file a rank's gap; the computer's (Mid's AB): with foot or more idle foot soldiers, not of the classes in not, once each every s, it holds the narrowest gap of min to max tiles on the road to the nearest foe, looked for each step tiles from from tiles out to half way, files deep a tile of width, for hold s | {min: 1, max: 12, ai: {foot: 6, hold: 180, every: 240, min: 2, max: 10, step: 4, from: 15, files: 3, not: [Riders, Engines]}} | N190 |
| D252 | the ambush (Mid's AMBUSH): cover is an open tile with forest within cover tiles, looked for within find tiles of the crosshair; a soldier within there tiles of its place goes to ground; a foe within spring tiles, or a blow within blow s, springs it with a charge | {cover: 1, spring: 4.5, find: 9, there: 0.8, blow: 0.5} | N190 |
| D253 | the danger map, one a side on the walking grid (Mid's DANGER_R and dangerMap, distances ÷ 10 in tiles), drawn each beat [s, frame]: foe level within near tiles of a live threat and inside an enemy tower's reach plus reach; scare level for secs s within mem tiles of where one of the side was frightened more than far tiles from home (the last keep kept); a find at unsafe or more is left, looked at each look, its cause said within the radius plus pad; a worker's walk pays cost a tile on any of it unless it goes into it. The fire's and the guards' levels come with them | {near: 11, reach: 3, mem: 8, secs: 45, far: 20, keep: 8, pad: 1, foe: 3, scare: 1, unsafe: 2, cost: 3, beat: [1, 1], look: [0.67, 2]} | N192 |
| D254 | villagers run for shelter (Mid's SHELTER, tiles): when a foe's soldier comes within flee (wide × flee once running), raid or more beasts or robbers do, or one hurt it within hurt s; into the nearest building with room within tower tiles if nearer than the Town Center, else the Town Center; out when no threat is within clear of it; looked at each look [s, frame] | {flee: 7, clear: 15, raid: 3, hurt: 6, wide: 1.6, tower: 22, look: [0.17, 0]} | N192 |
| D255 | the Alarm (Mid's EMG, incomingTick, watchHome, drawRadar; tiles): Garrison's spare soldiers hold a line line tiles toward the danger, rows row apart, perRow a row; villagers with no room wait behind tiles behind the Town Center, cols across, gap apart, shifted shift; Gather stands villagers square tiles out from its walls and soldiers away times as far; the danger lies toward the foe coming, else the nearest threat within dir, else the middle; a group within far tiles of your buildings, counted within group, is coming; a soldier within home of the Town Center warns, once each again s; the marker counts foes within radar of the nearest | {line: 11, row: 1.2, perRow: 12, behind: 6, square: 2, away: 3, gap: 1, cols: 6, shift: 2.5, dir: 70, far: 52, group: 14, home: 34, again: 2 | N192 |
| D256 | the room inside a building, before research (Mid's BLD shelter): villagers and soldiers who go in, each adding an arrow to its shot | {BTC1: 8, BW3: 5, BTC2: 10} | N192 |
| D257 | a finished Wonder that stands this many seconds wins for its side (Mid's WONDER_HOLD) | 480 | N192 |
| D258 | the fallen (Mid's SHARE_FALLEN, FALL, drawFallen): a side's army room × share is split among those left; a figure that dies in sight topples over drop s, a turn × π, and fades over fade s, gone at secs; at most most at once; engines do not topple | {share: 0.5, secs: 1.4, drop: 0.35, fade: 0.7, turn: 0.5, most: 80, not: [Engines]} | N192 |
| D259 | a timed game warns when this many seconds are left, if it is no more than late s past (Mid's judge) | {at: [300, 60], late: 5} | N192 |
| D260 | each villager's first job at the start, in order, the rest on rest (Mid's layMovers: the second on wood) | {jobs: [food, wood], rest: food} | N192 |
| D261 | the marker for foes near your Town Center out of view (Mid's drawRadar, screen px): shown when the nearest is past edge of the screen's sides; kept m in, side from the right, top from the top on the right, foot from the bottom; a disc r, pulsing pulse at beat, an arrow to tip from back, wing wide, its outline line; the time to arrive under px below | {edge: 40, m: 30, side: 84, top: 80, foot: 40, r: 15, pulse: 2, beat: 6, tip: 24, back: 16, wing: 6, line: 1.5, under: 26, half: 0.5, least: | N192 |
| D262 | something of yours is hit: a glow round the screen's edge for secs s, from inner to outer of the screen's sides, at most alpha (Mid's drawHitGlow); red for a rival, the flame's for the wild | {secs: 1.6, inner: 0.3, outer: 0.72, alpha: 0.55, stops: [0, 1]} | N192 |
| D263 | Teach (Mid's TEACH): a soldier learns the newer kind its shell's teach slot names (Mid's TEACH_TO) at the School, seats a School at once; it stands for the newer kind's base training × mul × the ages climbed (research: lesson), and pays the newer kind's dearer prices plus tuition gold an age climbed; opened by Veterans (research: teach) | {seats: 4, mul: 1.5, tuition: 40} | N194 |
| D264 | prisoners (Mid's PRISON, MORALE capAfter and capR, takePrisoner): a runner caught within r tiles after after s of its run is taken; its ransom is its price × ransom in gold, at least least; unransomed for secs s it serves its captor | {secs: 180, ransom: 1, least: 40, after: 2, r: 1} | N194 |
| D265 | a priest turns a foe (Mid's CONVERT, tiles): beside it within r for secs s (research: convert), then rests cd s; the room holds as for a recruit | {r: 4, secs: 12, cd: 60} | N194 |
| D266 | Zeal at the Temple (Mid's ZEAL): for cost gold (research: zealcost) the squad's soldiers strike × mul for secs s (research adds zealsecs); then the Temple rests cd s (research: zealcd); a priest must stand within near tiles of one of them | {cost: {gold: 60}, secs: 45, cd: 120, mul: 1.2, near: 12} | N194 |
| D267 | spies and sabotage (Mid's SAB, the spy's stealth, BLD sab; tiles): a spy is seen by a foe's soldier within seen's first, by a foe's shooting building within its second (research adds spysight), looked for within far; at a foe building's edge within at it burns burn of its health or stalls it stall s and drops the head of its line, by how, and is spent; within look of one it reads that side | {burn: 0.6, stall: 40, seen: [4.5, 14], far: 30, at: 1.4, look: 6, how: {BR1: burn, BCL1: burn, BCL2: burn, BI1: burn, BI4: burn, BI2: burn, | N194 |
| D268 | who heals its side's troops within r tiles (Mid's UNIT and BLD heal, hrng): the best in reach counts, its heal the health a second at the start, the wound closing as the first-order lag, tau = most health ÷ heal (QP) | {US2: {heal: 3, r: 5.5}, BP6: {heal: 3, r: 9}} | N194 |
| D269 | priests and medics walk with the army (Mid's followArmy, tiles): to the nearest soldier of their side out within r, back tiles behind it, once more than near from there | {r: 26, back: 2.4, near: 1} | N194 |

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
| X17 | a change the permit does not open (a build carries one whole module: Albert, Nov 5 13:30) | {stage: seal} | N126; N162 |
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
| X49 | who is a foe is Mid's frozen isFoe, gangOf, atWar and friendly for the same sides, groups and stances: animals everyone's foe, each wild group by its own stance, a treaty binding only its signers; a soldier and a tower strike only a foe | {stage: page} | N158 |
| X50 | ages and research are Mid's frozen code for the same orders: the age queued at the seat at its price and wait, the seat training nothing while it rises, the lines in order at each step's price and time (research-speed steps applied), a step out of order, queued, before its age or its needs refused; after each step the wood rate, the load, a home's room and the camp's footing Mid's with its shares added; the Hall names a step and an age, the age button and info card the next age and its own wait, the hidden age never next, the keep's level at Gunpowder drawn, Z1 from Mid's first age | {stage: page} | N160 |
| X51 | ten villagers sent to one bush patch each stand on a spot of their own on its ring, the spots and the bodies a pace apart, never more on a find than Mid's frozen findCap; each one's crowd share and forager's rate are Mid's frozen forage for the same load, walk, crowd and walked length; Mid's frozen makeNow on the same five minutes of work gathers the same food within 2% (the walk is v100's: paths, and the push by mass) | {stage: page} | N164 |
| X52 | builders, repair, limits, placing and walls are Mid's frozen code for the same actions: a crew's build time and a site's health (bldTick, n^0.7), a repair's time and stores spent (repairTick) and its price (repairCost), every price Mid's BLD and UNIT cost, the refund taken down (shellBack), every building's limit by age with research (capFor, capWhy), placing's refusals (canPlace), a wall laid corner to corner (wallLine) and the seal's gap (sealPath); on the page the nearest free villager is sent and one pulled off its work goes back to it, the ghost snaps a lane apart, a gate opens to its own and an ally and shuts to a foe, and the computer lays its ring | {stage: page} | N168 |
| X53 | a year and a season of food is Mid's frozen code for the same town (20 villagers, five at bushes, 5 foot, 5 riders, 4 farms worked and resting, a tended pasture of 11 with a wolf at two turns, half-fished fish, the hearth, the ice house and seed selection known, the store run dry and fed again): what is eaten (shareOf, upkeepTick, starveTick, foodInReach, hungerOf), spoiled and regrown at each turn (seasonTurn), the soil left (natureTick), the flock and its mutton, and the fields' harvest by season, soil and the year's roll (gatherMul) all equal Mid's; an order's meals are Mid's orderCost; a boar hunted falls as its meat and is butchered; fish are worked only near a dock | {stage: page} | N132; N170 |
| X54 | a walker's pace on dry, flat, firm ground in still air is Mid's frozen paceOf for the same walkers: the walk with its research added once (Forced marches), a full load (Mid's 0.9, by W24) and sickness; wild things too; mud's and snow's costs are Mid's under the effects law (Roads and Field drains one on what the other left, Snow clearing); ground ice grows and thaws as Mid's groundTick; on the page a walker in mud steps at its pace and one on ice slips once, stands, is told once and walks on wary | {stage: page} | N132; N173; N185 |
| X55 | every soldier is the Unit shell with Mid's settings: each kind's class, age, look, teach, price, train time, health, blow, reach, sight and speed (by the foot's 3.4 mph) are Mid's UNIT and TEACH_TO; with research its name, rank, kit, health, blow, reach, speed, sight, armour and train time are Mid's frozen stats() with the shares added; each army building trains exactly its class's kinds, each from its age, and the army stops at the ceiling; every kind's figure at each rank and kit is Mid's own, pixel for pixel | {stage: page} | N132; N176 |
| X56 | the physics of F17b: a villager walks exactly 1.52 m/s on flat firm ground, unloaded, in still air, and every load, grade, mud, snow and headwind gives the speed at which Pandolf's equation (with Pugh's drag as a grade) returns its power, each slower; the effects law adds boosts once and applies cuts one at a time, never reaching 0 nor the base, and every cut in the Tech book is a share between 0 and 1; the falling particles are the pool times the strength, the rates, wind and visibility the law's, and the blizzard flag turns exactly at the NWS's wind and visibility and after three game hours; a step slips exactly when the friction it needs exceeds what the ground offers; Crampons give studs to villagers, foot, archers and the engines' haulers and not riders, Horseshoes to riders; the scout's pace and reach are Mid's | {stage: page} | N185; N13; N180; N179 |
| X57 | the blow, nerve and the rout, a soldier's day, squads and muster (F19+F20): every kind's counters on every kind are Mid's frozen vsMul over its UNIT; a tower reaches as far as Mid's rangeFrom within 1% (the arrow's drag, QAJ); a foe's worth in reach is Mid's foeValue; the nerve, flank, yard, kite, shelter, shapes, tempers, plunder and wear are Mid's numbers; on the page a blow from behind lands × D141, a skirmish breaks a soldier who runs and comes back, a fallen tower pays D233 of its price, and Muster brings a squad's lack at twice the price | {stage: page} | N132; N188 |
| X58 | the finger, orders you can follow and the War Director (F21+F22): Mid's numbers (HOLD_MS, PRESS_SHOW, DBL_MS, HUD, ARMY_STILL, DIRECT, CHOKE, AMBUSH, CHARGE, FALLBACK, AB) in the books; Mid's frozen etaOf and reinforcePlan's waves for the same soldiers; on the page a box picks many, a tap is their order with its line and time, Go makes a mission, the charge quickens then tires, the choke stands as many files as the gap, an ambush hides | {stage: page} | N132; N190; N191 |
| X59 | the Alarm and the end, with the start's first jobs, builders that tell and reachable sites (F23): Mid's DANGER_R, SHELTER, EMG, WONDER_HOLD, SHARE_FALLEN, PLUNDER, SCORE and room in the books; who is a threat is Mid's frozen isThreat; Shelter fills the buildings as Mid's frozen villagersIn does; a rival's fall pays what Mid's frozen fall pays, shares the room and scores as its scoreAll; your fall, a wonder held and the bell end the game as its judge; and on the page every villager has a job within 3 s of a new game, a villager leaves a find a foe stands by, Work sends them back, a site in reach is built, one out of reach says why and a free villager is sent to one in reach, and a spot nobody can walk to is refused | {stage: page} | N192; N193 |
| X60 | Teach, prisoners, priests, medics, Zeal and spies (F24): Mid's TEACH, TEACH_TO, PRISON, CONVERT, ZEAL, SAB, the spy's stealth, heal and hrng, the priest's, medic's and spy's rows and the 18 research steps in the books; Mid's frozen teachCost and teachSecs for every kind that learns, its ransom, spySeen and healTick's lag for the same wound; on the page a spear learns to be a sword at the School keeping its share of health, a runner is taken, serves its captor after the wait and another is ransomed with the gold moved, Zeal costs Mid's gold and lifts the blow by its share for its seconds, a priest turns a villager in Mid's time, a medic binds a wound, a spy is unseen at 6 tiles and seen at 3, and sabotage stalls a barracks and burns a mill | {stage: page} | N132; N194 |

## screen

| Code | Name | Value | Cited |
|---|---|---|---|
| SN1 | the mold: six slots a row, a slot 44 tall (Apple's least touch target), gaps and edges 6 | {slots: 6, slot: 44, gap: 6} | N133 |
| SN2 | the Build tabs: six, up to nine buildings each, three to a row (each cell two slots wide) | {Home: [BTC1, BR1, BR2, BCR2, BP4, BP6, BP7], Land: [BCL1, BI1, BCL2, BI3, BCT2, BI2, BCL3, BCL4, BI5], Trade: [BCR1, BCT1, BI6, BI4, BI7, B | N134 |
| SN3 | buildings not on the Build menu: the Throne is the map's; the camp tents come with the camp wagon; the Palisade comes with the war camp (Albert, Nov 5 16:07) | [BS1, BTC5, BTC6, BTC7, BTC8, BW4] | N135; N172 |
| SN4 | a card's rows, in order: a row shows when the subject ticks what it names (none: always); troops: Teach on a soldier, Zeal at the Temple, ransom at your hall, what a spy read at theirs | [[title, null], [health, Health], [load, Gather], [store, Yield], [flock, Flock], [queue, Spawn], [train, Spawn], [tech, Research], [troops, | N136; N170; N194 |
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
| R6 | Carcass | [Yield] | N170 |
| MW1 | Fish | [Yield, Catch] | N170 |
| R2 | Gold | [Yield] | N144 |
| R3 | Stone | [Yield] | N144 |
| R4 | Iron | [Yield] | N144 |
| MG1 | Ruins | [Yield] | N144 |
| MG2 | Cemetery | [] | N144 |
| MG3 | Campfire | [Yield] | N144 |
| MG4 | Treasure | [Yield] | N144 |
| BTC1 | Town Center | [Seat, Drop-off, Spawn, Shoot, House, Research, Health, Shelter, Hold] | N144 |
| BTC2 | Castle | [Shelter, Hold] | N144 |
| BTC5 | Medical tent | [] | N144 |
| BTC6 | Training tent | [] | N144 |
| BTC7 | Mess tent | [Shelter] | N144 |
| BTC8 | Camp tower | [Shoot] | N144 |
| BR1 | Home | [House, Health] | N144 |
| BR2 | Apartment | [] | N144 |
| BCR1 | Market | [] | N144 |
| BCR2 | Tavern | [] | N144 |
| BCL1 | Farm | [Field, Health, Soil] | N144; N170 |
| BCL2 | Tree farm | [Field, Health] | N144; N170 |
| BCL3 | Pasture | [Field, Health, Flock] | N144; N170 |
| BCL4 | Quarry | [] | N144 |
| BCT1 | Trade post | [] | N144 |
| BCT2 | Dock | [Drop-off, Health, Shore] | N144; N170 |
| BP1 | School | [Teach] | N144; N194 |
| BP2 | Library | [] | N144 |
| BP3 | Temple | [Spawn, Zeal] | N144; N194 |
| BP4 | Baths | [] | N144 |
| BP5 | Theatre | [] | N144 |
| BP6 | Hospital | [Spawn, Heal] | N144; N194 |
| BP7 | Aqueduct | [] | N144 |
| BP8 | Courthouse | [Spawn, Shoot] | N144; N194 |
| BP9 | Hall | [] | N144 |
| BP10 | War Council | [Squad] | N144 |
| BI1 | Mill | [Drop-off, Health] | N144 |
| BI2 | Lumber camp | [Drop-off, Health] | N144 |
| BI3 | Mining camp | [Drop-off, Health] | N144 |
| BI4 | Store | [] | N144 |
| BI5 | Depot | [] | N144 |
| BI6 | Mint | [] | N144 |
| BI7 | Foundry | [] | N144 |
| BI8 | Workshop | [] | N144 |
| BI9 | Smith | [] | N144 |
| BM1 | Barracks | [Spawn, Health, Shelter] | N144 |
| BM2 | Range | [Spawn, Health] | N144 |
| BM3 | Stable | [Spawn, Health] | N144 |
| BM4 | Siege workshop | [Spawn, Health] | N144 |
| BW1 | Wall | [Health, Line] | N144 |
| BW2 | Gate | [Health, Gate] | N144 |
| BW3 | Tower | [Shoot, Health, Hold] | N144 |
| BW4 | Palisade | [Health, Line] | N144 |
| BF5 | Abatis | [] | N144 |
| BS1 | Throne | [] | N144 |
| BS2 | Wonder | [Wonder] | N144 |
| UV | Villager | [Walk, Gather, Carry, Build, Repair, Fight, Health] | N144; N170 |
| UM1 | Spearman | [Walk, Fight, Health] | N144; N170; N176 |
| UM6 | Swordsman | [Walk, Fight, Health] | N144; N170; N176 |
| UM2 | Archer | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM7 | Javelineer | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM8 | Crossbowman | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM9 | Arquebusier | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM10 | Chariot | [Walk, Fight, Health] | N144; N170; N176 |
| UM3 | Cataphract | [Walk, Fight, Health] | N144; N170; N176 |
| UM11 | Horse archer | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM12 | War elephant | [Walk, Fight, Health] | N144; N170; N176 |
| UM4 | Ram | [Walk, Fight, Health] | N144; N170; N176 |
| UM13 | Siege tower | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM5 | Catapult | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM14 | Bombard | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM15 | Ballista | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| UM16 | Trebuchet | [Walk, Fight, Shoot, Health] | N144; N170; N176 |
| US1 | Priest | [Walk, Health, Convert] | N144; N170; N194 |
| US2 | Medic | [Walk, Health, Heal] | N144; N170; N194 |
| US3 | Spy | [Walk, Health, Spy] | N144; N170; N194 |
| US4 | Scout | [Walk, Fight, Scout, Health] | N144; N170 |
| UT1 | Caravan | [Walk, Carry, Trade] | N144; N170 |
| UT2 | Camp wagon | [Walk, Carry] | N144 |
| MH1 | Outlaws | [Walk] | N144 |
| MH3 | Robbers | [Walk] | N144 |
| MH4 | Vagabonds | [Walk] | N144 |
| MH5 | Wayfarers | [Walk] | N144 |
| MW3 | Deer | [Walk, Wander, Prey, Health] | N144; N170 |
| MW4 | Wolf | [Walk, Wander, Fight, Health] | N144 |
| MW6 | Bear | [Walk, Wander, Fight, Health] | N144 |
| MW7 | Boar | [Walk, Wander, Prey, Health] | N170 |
| MW8 | Bison | [Walk, Wander, Prey, Health] | N170 |

## sides

| Code | Name | Value | Cited |
|---|---|---|---|
| I1 | the stances two sides, or a side and a group, may hold; a treaty binds only its signers (vassal comes later) | [war, peace, ally] | N158; N159 |
| I2 | every side starts at this stance with every other side and with each of the wild's groups (Mid's start) | war | N158 |
| I3 | the wild's four groups (the Natives, the outlaws, the bandits, the robbers) and their kinds, each holding its own stance with each side; a kind of the wild in none is the Natives'; the horde is the outlaws' (comes with the hordes) | {nat: [], out: [], ban: [MH1], rob: [MH3]} | N158 |
| I4 | the animals: everyone's foe, always, bound by no stance | [MW3, MW4, MW6, MW7, MW8] | N158; N170 |

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
| P2 | the spear figure; the Hoplite and the Pikeman by rank | {brush: person, o: {tunic: $side, head: bare, shield: round, weapon: spear, legs: #6b5a40, beard: #4a3420}, box: [52, 34], rank: [{brush: pe | N150; N176 |
| P3 | the archer figure; the Longbowman by rank | {brush: person, o: {tunic: $side, head: hood, weapon: bow, legs: #5a4a38}, box: [26, 30], rank: [{brush: person, o: {tunic: $side, head: cap | N150; N176 |
| P4 | the cata figure, on its barded horse; the Knight by rank | {brush: draw, parts: [[horse, {coat: #5a3a24, barding: scale}], [at, -0.6, -1, 0, [[person, {tunic: $side, body: scale, head: conical, helmC | N150; N176 |
| P5 | the ram figure | {brush: draw, parts: [[L, {atk: [-17, -13]}, -8, {atk: [15, 19]}, -8, #6b4a2c, 3], [P, [[{atk: [15, 19]}, -10], [{atk: [19, 23]}, -8], [{atk | N150; N176 |
| P6 | the catapult figure | {brush: draw, parts: [[planks, -11, -6, 11, -3, #8a5d34], [P, [[-2, -6], [0, -14], [2, -6]], #8a5d34, #141210, 0.5], [at, 0, -12, {atk: [-0. | N150; N176 |
| P7 | the priest figure | {brush: person, o: {tunic: #efe6cf, trim: #c9a227, body: robe, head: bare, weapon: staff, sash: $side, legs: #d8cdb2, beard: #d8d0c0}, box:  | N150 |
| P8 | the medic figure | {brush: person, o: {tunic: #e4dccb, trim: $side, head: cap, capCol: #e4dccb, weapon: bag, sash: #c23a30, legs: #6b5a48}, box: [26, 30]} | N150 |
| P9 | the spy figure | {brush: person, o: {tunic: #2a2a30, trim: $side, body: robe, head: hood, hoodCol: #1c1c22, weapon: dagger, cape: #1c1c22, legs: #22222a}, bo | N150 |
| P10 | the scout figure, a runner; mounted by rank (Horse breeding) | {brush: person, o: {tunic: $side, head: cap, capCol: $side*0.6, weapon: staff, cape: $side*0.6}, box: [44, 34], rank: [{brush: draw, parts:  | N150; N176 |
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
| PB3 | the keep building picture; its level (Mid's fourth age, Gunpowder) adds the bastion, PB13 | {top: 62, level: {age: 4}} | N151; N160 |
| PB4 | the tower building picture; its level is how many steps that raise it (a Research row's tier) the side knows: TOWER_LOOK's three | {top: 84, level: {steps: tier}} | N151; N160 |
| PB5 | the wonder building picture | {top: 72} | N151 |
| PB6 | the library building picture; its level (Mid's Medieval age) makes it a university | {top: 56, level: {age: 3}} | N151; N160 |
| PB7 | the temple building picture | {top: 50} | N151 |
| PB8 | the theatre building picture | {top: 44} | N151 |
| PB9 | the apartment building picture | {top: 46} | N151 |
| PB10 | the aqueduct building picture | {top: 40} | N151 |
| PB11 | the siege building picture | {top: 40} | N151 |
| PB12 | research on its building (Mid's UP): 1 when a step of its own is learned sets it on a stone footing (foot tall, its side in shade); 2, half its steps or more, adds corner stones (w, h, every gap, clear of the eaves by edge) and a gilded ridge | {half: 0.5, top: 2, foot: 3, shade: -0.45, line: 0.4, stone: [3.4, 3, 6, 2], lift: 0.15, rim: 0.3, ridge: #e6c75a, ridgeW: 1.6} | N151; N160 |
| PB13 | the keep at its level (Gunpowder): an angled stone bastion with a gun on it, from the keep's front corner | {at: [-27, -1], face: [[-9, -1], [0, 6], [9, -1], [9, -10], [0, -4], [-9, -10]], top: [[-9, -10], [0, -16], [9, -10], [0, -4]], shade: [0.08 | N151; N160 |
| PN1 | the finds: their scale, drawn smaller as they are used (left[0] + left[1] × the share left, Mid's nodeScale), the tool each is worked with (the figure's work frames: axe, hands, pick), and their dot far out; the trees' leaves by the season (autumn's two, winter's snow), the carcass and the fish's ripple (Mid's nodeSprite, drawNode) | {scale: {tree: 0.88, bush: 1.45, other: 1.25}, left: [0.6, 0.4], tool: {tree: 0, bush: 1, bld: 1, other: 2, fish: 1, meat: 1}, dot: {tree: # | N152; N164; N170 |
| P20 | the boar figure | {brush: quad, o: {col: #4a3a2e, len: 13, h: 7, legH: 3.4, legW: 1, head: 2.8, headY: 0.55, tusk: true, bristle: true, tail: 0.6}, box: [24,  | N150; N170 |
| P21 | the bison figure: the hump, a shaggy mane and a short horn | {brush: quad, o: {col: #3e2a1c, len: 20, h: 10, legH: 6, legW: 1.4, head: 3.4, headY: 0.4, hump: true, bristle: true, tail: 0.8, horn: {col: | N150; N170 |
| PB14 | the farm building picture; its level is the season: the crop's colours spring to winter | {level: {season: true}} | N151; N170 |
| PB15 | the tree farm building picture; its level 1 when cut out: stumps | {level: {spent: true}} | N151; N170 |
| PB16 | the pasture building picture; its level is the flock: a sheep drawn for each | {level: {flock: true}} | N151; N170 |
| P22 | the sword figure; the Man-at-arms by rank | {brush: person, o: {tunic: $side, body: scale, head: conical, helmCol: #c08a3a, shield: round, weapon: sword, legs: #6b5a40}, box: [30, 30], | N150; N176 |
| P23 | the jav figure | {brush: person, o: {tunic: $side, head: bare, shield: round, weapon: jav, legs: #6b5a40, beard: #6b4a2c}, box: [34, 30]} | N150; N176 |
| P24 | the crossbow figure | {brush: person, o: {tunic: $side, body: mail, head: kettle, weapon: xbow, legs: #5a4a38}, box: [34, 30], elite: true} | N150; N176 |
| P25 | the arquebus figure | {brush: person, o: {tunic: $side, trim: $side, body: mail, head: morion, weapon: gun, sash: #e6d9b0, legs: #7a3a2e, boots: #6b4a2c}, box: [4 | N150; N176 |
| P26 | the chariot figure, a bowman behind a horse (its car's edges black, as Mid draws a tint of a tint); the Horseman by rank | {brush: draw, parts: [[horse, {coat: #a0703a, saddle: false}, 9], [L, -2, -10, 7, -11, #5a3a1c, 1], [at, -7, -4, 0, [[person, {tunic: $side, | N150; N176 |
| P27 | the harcher figure | {brush: draw, parts: [[horse, {coat: #b08a5a}], [at, -0.6, -1, 0, [[person, {tunic: $side, head: fur, helmCol: $side*0.6, weapon: bow, legs: | N150; N176 |
| P28 | the war elephant figure (its back feet black, as Mid draws a tint of a tint) | {brush: draw, parts: [[at, -8, -9, {sway: -0.15}, [[P, [[-2.4, 0], [2.4, 0], [2.2, 9], [-2.2, 9]], #8d8a86*0.75, #141210, 0.4], [E, 0, 8.8,  | N150; N176 |
| P29 | the stower figure | {brush: draw, parts: [[planks, -8, -42, 8, -3, #8a6a44], [P, [[2, -38], [6, -38], [6, -35], [2, -35]], #1a120a], [P, [[2, -29], [6, -29], [6 | N150; N176 |
| P30 | the ballista figure | {brush: draw, parts: [[L, -6, 0, 0, -9, #8a5d34, 1], [L, 6, 0, 0, -9, #8a5d34, 1], [L, 0, 0, 0, -9, #8a5d34, 1], [planks, -8, -12, 9, -9, #8 | N150; N176 |
| P31 | the bombard figure | {brush: draw, parts: [[planks, -13, -6, 13, -3, #8a5d34], [at, {atk: [0, -2.5]}, 0, 0, [[P, [[-11, -9], [11, -11.4], [13, -9.6], [13, -5.4], | N150; N176 |
| P32 | the treb figure | {brush: draw, parts: [[planks, -14, -5, 14, -2, #8a5d34], [P, [[-6, -5], [0, -30], [6, -5]], null, #8a5d34, 1.6], [L, -3, -18, 3, -18, #8a5d | N150; N176 |
| P33 | the armour a side's research puts on its soldiers (Mid's KIT): leather a shoulder guard, chain mail and a steel helm, plate with a great helm, its crest and a cape in the figure's own colours ($side the trim) | [{}, {body: {: mail, scale: mail}, head: {bare: kettle, hood: kettle, cap: kettle, straw: kettle}}, {body: {: plate, mail: plate, scale: pla | N150; N176 |
| P34 | the elite rank's gold pennant on a staff, for a look marked elite at a rank (Mid's elitePennant, ELITE_LOOK) | {parts: [[L, 8, -4, 8, -30, #5a3a1c, 0.9], [P, [[8, -30], [16, -27.5], [8, -25]], #e6b947, #8a6a1a, 0.4], [P, [[8.6, -29], [13.5, -27.5], [8 | N150; N176 |
| P35 | the standard an army on the move carries: drawn over a group of least or more once the zoom passes zoom; a pole pole tall, a ring at its foot as full as the group's health (radius, plus), filled from top (radians), the flag's width and its edges, its wave (speed, swing, the tail's share), the ring's tilt and its shadow's alpha (Mid's drawStandards) | {least: 5, zoom: 0.4, pole: 30, ring: [6, 2], line: 2.4, flag: [10, 1, 6, 7], wave: [4, 1.4, 1.5], tilt: 0.5, alpha: 0.6, top: -1.5708} | N188 |
| P36 | a blow's sparks: rays rays turned turn apart and spinning spin, from from out to to plus grow over its life, lifted lift (Mid's sparkDraw) | {rays: 5, turn: 1.26, spin: 7, from: 2, to: 3, grow: 6, line: 1.4, lift: 6} | N188 |
| P37 | the marks over the map: a health bar h tall, its shadow's alpha; a unit's width, lift and margin; a building's width and lift a tile of its size, plus, and margin; a whole turn | {bar: {h: 3, alpha: 0.5, unit: [16, 34, 20], bld: [10, 12, 20, 40]}, arc: [0, 6.2832]} | N114 |
| P38 | the crosshair (Mid's drawReticle): its radius the larger of r[0] and r[1] a zoom plus r[2], fired times while it settles settle s after Go; corner brackets bracket of it long, line wide; held it glows (alpha, px more); a sonar ring (its beat, its fall, alpha, from px, out to times r); chevrons turning (speed, at share of r, length, half width, how many); a scan line (speed, inset px); the cross's arms out past r and its gap; its words label px above | {r: [30, 16, 6], fired: 0.8, settle: 0.4, bracket: 0.4, line: 1.5, glow: [0.14, 12], sonar: [0.5, 1.4, 0.8, 4, 1.3], chev: [1.2, 0.62, 7, 5, | N190 |
| P39 | a group on the march (Mid's drawOrders): a dashed line from the group to where it goes (dash, flowing one px each flow ms), a ring there ring a zoom (tilt), faint once arrived (done); line widths (line, ring, arrived), alphas (line, ring, arrived, words); the time left up px over it | {dash: [6, 6], done: [3, 5], line: [1.5, 2, 1.2], alpha: [0.7, 0.85, 0.35, 0.95], ring: 14, flow: 60, up: 4, tilt: 0.5} | N190 |
| P40 | your rally flag (Mid's flagAt): a pole pole a zoom, its fly out and down, line wide, the pole's paint | {pole: 16, fly: [10, 13, 10], line: 1.2, col: #2b2b2b} | N190 |
| P41 | leaves over a soldier in ambush (Mid's leavesOver): a leaf at each of at (spread apart), lifted by lift (rise), up a zoom over its foot, spread apart and rise between, swaying (speed, phase apart, depth), r wide and tall, turned; the two greens | {at: [-1, 0, 1], lift: [0, 1, 0], up: 8, spread: 4.5, rise: 3, sway: [0.8, 2.1, 0.6], r: [3.6, 2.2], turn: [0.5, 0.9], cols: [rgba(96,142,66 | N190 |
| P42 | the finger's marks (Mid's drawTouch): the hold's ring line; the box's fill alpha and line; the choke's line and its words up px; a whole turn from the top | {ring: 3, box: [0.12, 2], choke: 3, up: 12, turn: 6.2832, top: -1.5708} | N190 |

## tech

| Code | Name | Value | Cited |
|---|---|---|---|
| O1 | Hafted axes | {at: BI2, line: Felling, age: 0, cost: {food: 50, wood: 40}, time: 18, fx: [{s: rate, k: [R1, BCL2], p: 0.1}], when: 6000 BC, w: 5} | N160; N161 |
| O2 | Bronze axes | {at: BI2, line: Felling, age: 1, cost: {food: 100, wood: 70}, time: 28, fx: [{s: rate, k: [R1, BCL2], p: 0.15}], when: 3000 BC, w: 5} | N160; N161 |
| O3 | Iron axes | {at: BI2, line: Felling, age: 1, cost: {food: 180, wood: 120}, time: 41, fx: [{s: rate, k: [R1, BCL2], p: 0.15}], need: [iron], when: 1000 B | N160; N161 |
| O4 | Saw pits | {at: BI2, line: Felling, age: 2, cost: {food: 130, wood: 90}, time: 32, fx: [{s: rate, k: [R1, BCL2], p: 0.1}], when: Roman, w: 3} | N160; N161 |
| O5 | Crosscut saw | {at: BI2, line: Felling, age: 3, cost: {food: 240, wood: 160}, time: 48, fx: [{s: rate, k: [R1, BCL2], p: 0.15}], when: 1400s, w: 4} | N160; N161 |
| O6 | Sawmill | {at: BI2, line: Felling, age: 4, cost: {food: 470, wood: 310}, time: 77, fx: [{s: rate, k: BCL2, p: 0.3}], need: [windmill], when: 1500s, w: | N160; N161 |
| O7 | Coppicing | {at: BI2, line: Woodland, age: 0, cost: {food: 50, wood: 30}, time: 17, fx: [{s: rate, k: BCL2, p: 0.25}], when: 4000 BC, w: 4} | N160; N161 |
| O8 | Pollarding | {at: BI2, line: Woodland, age: 1, cost: {food: 70, wood: 50}, time: 21, fx: [{s: rate, k: BCL2, p: 0.1}], when: Bronze age, w: 2} | N160; N161 |
| O9 | Forest law | {at: BI2, line: Woodland, age: 3, cost: {food: 240, wood: 160}, time: 48, fx: [{s: limit, k: BCL2, a: 2}], when: 1100s, w: 4} | N160; N161 |
| O10 | Plantations | {at: BI2, line: Woodland, age: 4, cost: {food: 350, wood: 230}, time: 61, fx: [{s: rate, k: BCL2, p: 0.2}], when: 1600s, w: 4} | N160; N161 |
| O11 | Timber framing | {at: BI2, line: Carpentry, age: 1, cost: {food: 100, wood: 70}, time: 28, fx: [{s: room, k: BR1, a: 1}], when: 2000 BC, w: 5} | N160; N161 |
| O12 | Charcoal burning | {at: BI2, line: Carpentry, age: 3, cost: {food: 260, wood: 180}, time: 52, fx: [{s: rate, k: BI7, p: 0.15}], when: 1000 BC, w: 5} | N160; N161 |
| O13 | Wagons | {at: BI2, line: Carpentry, age: 3, cost: {food: 260, wood: 180}, time: 52, fx: [{s: carry, k: UV, a: 3}], when: 1000s, w: 5} | N160; N161 |
| O14 | Log driving | {at: BI2, line: Carpentry, age: 4, cost: {food: 310, wood: 210}, time: 55, fx: [{s: rate, k: BCL2, p: 0.15}], when: 1500s, w: 3} | N160; N161 |
| O15 | Sickles | {at: BI1, line: Harvest, age: 0, cost: {food: 50, wood: 40}, time: 18, fx: [{s: rate, k: BCL1, p: 0.1}], when: 9000 BC, w: 5} | N160; N161 |
| O16 | Threshing sledge | {at: BI1, line: Harvest, age: 0, cost: {food: 80, wood: 50}, time: 24, fx: [{s: rate, k: BCL1, p: 0.1}], when: 6000 BC, w: 3} | N160; N161 |
| O17 | Plough | {at: BI1, line: Harvest, age: 0, cost: {food: 140, wood: 100}, time: 37, fx: [{s: rate, k: BCL1, p: 0.2}], when: 3500 BC, w: 9} | N160; N161 |
| O18 | Water wheel | {at: BI1, line: Harvest, age: 2, cost: {food: 180, wood: 120}, time: 41, fx: [{s: rate, k: BCL1, p: 0.1}], when: 300 BC, w: 6} | N160; N161 |
| O19 | Horse collar | {at: BI1, line: Harvest, age: 3, cost: {food: 320, wood: 210}, time: 60, fx: [{s: rate, k: BCL1, p: 0.15}], need: [horses], when: 900s, w: 7 | N160; N161 |
| O20 | Heavy plough | {at: BI1, line: Harvest, age: 3, cost: {food: 340, wood: 230}, time: 64, fx: [{s: rate, k: BCL1, p: 0.15}], when: 1000s, w: 8} | N160; N161 |
| O21 | Windmill | {at: BI1, line: Harvest, age: 3, cost: {food: 430, wood: 290}, time: 71, fx: [{s: rate, k: BCL1, p: 0.1}], when: 1180s, w: 6} | N160; N161 |
| O22 | Seed drill | {at: BI1, line: Harvest, age: 4, cost: {food: 430, wood: 290}, time: 71, fx: [{s: rate, k: BCL1, p: 0.15}], when: 1701, w: 6} | N160; N161 |
| O23 | Bread ovens | {at: BI1, line: Stores, age: 1, cost: {food: 90, wood: 60}, time: 26, fx: [{s: rate, k: BCL1, p: 0.1}], when: 3000 BC, w: 4} | N160; N161 |
| O24 | Stone granary | {at: BI1, line: Stores, age: 1, cost: {food: 110, wood: 70}, time: 30, fx: [{s: plague, c: 0.5}], need: [masonry], when: 2500 BC, w: 6} | N160; N161 |
| O25 | Wheelbarrow | {at: BI1, line: Stores, age: 3, cost: {food: 240, wood: 160}, time: 48, fx: [{s: carry, k: UV, a: 5}], when: 1100s, w: 4} | N160; N161 |
| O26 | Antler picks | {at: BI3, line: Digging, age: 0, cost: {food: 50, stone: 30}, time: 17, fx: [{s: rate, k: R3, p: 0.2}, {s: rate, k: R2, p: 0.2}], when: 4000 | N160; N161 |
| O27 | Fire-setting | {at: BI3, line: Digging, age: 1, cost: {food: 90, stone: 60}, time: 26, fx: [{s: rate, k: R3, p: 0.1}, {s: rate, k: R2, p: 0.1}], when: 3000 | N160; N161 |
| O28 | Deep shafts | {at: BI3, line: Digging, age: 2, cost: {food: 170, stone: 110}, time: 38, fx: [{s: rate, k: R3, p: 0.2}, {s: rate, k: R2, p: 0.2}], when: 50 | N160; N161 |
| O29 | Mine pumps | {at: BI3, line: Digging, age: 3, cost: {food: 260, stone: 180}, time: 52, fx: [{s: rate, k: R3, p: 0.15}, {s: rate, k: R2, p: 0.15}, {s: rat | N160; N161 |
| O30 | Mine wagons | {at: BI3, line: Digging, age: 4, cost: {food: 350, stone: 230}, time: 61, fx: [{s: carry, k: UV, a: 3}], when: 1500s, w: 4} | N160; N161 |
| O31 | Blasting | {at: BI3, line: Digging, age: 4, cost: {food: 470, stone: 310}, time: 77, fx: [{s: rate, k: R3, p: 0.25}, {s: rate, k: R4, p: 0.25}], need:  | N160; N161 |
| O32 | Fired brick | {at: BI3, line: Building, age: 1, cost: {food: 170, stone: 110}, time: 38, fx: [{s: room, k: BR1, a: 1}, {s: room, k: BR2, a: 4}], when: 300 | N160; N161 |
| O33 | Masonry | {at: BI3, line: Building, age: 1, cost: {food: 120, stone: 80}, time: 32, fx: [{s: hp, k: B, p: 0.3}], when: 2600 BC, w: 7} | N160; N161 |
| O34 | Ventilation | {at: BI3, line: Building, age: 4, cost: {food: 310, stone: 210}, time: 55, fx: [{s: rate, k: R4, p: 0.2}], when: 1500s, w: 3} | N160; N161 |
| O35 | Iron wedges | {at: BCL4, line: Cutting, age: 2, cost: {wood: 150, iron: 100}, time: 35, fx: [{s: rate, k: BCL4, p: 0.2}], need: [iron], when: 500 BC, w: 4 | N160; N161 |
| O36 | Steel chisels | {at: BCL4, line: Cutting, age: 3, cost: {wood: 210, iron: 140}, time: 44, fx: [{s: rate, k: BCL4, p: 0.15}], when: 1200s, w: 3} | N160; N161 |
| O37 | Stone saws | {at: BCL4, line: Cutting, age: 4, cost: {wood: 350, iron: 230}, time: 61, fx: [{s: rate, k: BCL4, p: 0.2}], need: [sawmill], when: 1500s, w: | N160; N161 |
| O38 | Rollers and sledges | {at: BCL4, line: Hauling, age: 2, cost: {wood: 130, iron: 90}, time: 32, fx: [{s: carry, k: UV, a: 2}], when: 2500 BC, w: 3} | N160; N161 |
| O39 | Treadwheel crane | {at: BCL4, line: Hauling, age: 3, cost: {wood: 290, iron: 190}, time: 56, fx: [{s: rate, k: BCL4, p: 0.2}], when: 1200s, w: 6} | N160; N161 |
| O40 | Tally sticks | {at: BTC1, line: Household, age: 0, cost: {food: 40, gold: 30}, time: 15, fx: [{s: time, k: O, c: 0.05}], when: 20,000 BC, w: 3} | N160; N161 |
| O41 | Baskets | {at: BTC1, line: Household, age: 0, cost: {food: 40, gold: 30}, time: 15, fx: [{s: carry, k: UV, a: 3}], when: 8000 BC, w: 3} | N160; N161 |
| O42 | Midwives | {at: BTC1, line: Household, age: 1, cost: {food: 150, gold: 50}, time: 30, fx: [{s: twin, k: UV, a: 1}], when: 1550 BC, w: 4} | N160; N161 |
| O43 | Census | {at: BTC1, line: Household, age: 2, cost: {food: 170, gold: 110}, time: 38, fx: [{s: train, k: UV, c: 0.2}], need: [writing], when: 500 BC,  | N160; N161 |
| O44 | Town charter | {at: BTC1, line: Household, age: 3, cost: {food: 290, gold: 190}, time: 56, fx: [{s: room, k: BR1, a: 1}], when: 1100s, w: 6} | N160; N161 |
| O45 | Hearth and pot | {at: BR1, line: Home, age: 0, cost: {wood: 40, food: 30}, time: 20, fx: [{s: eat, c: 0.1}], when: about 8000 BC, w: 4} | N160; N161 |
| O46 | Ice house | {at: BR1, line: Home, age: 2, cost: {stone: 120, wood: 80}, time: 32, fx: [{s: rate, k: MW1, p: 0.15}, {s: rate, k: R6, p: 0.15}, {s: spoil, | N160; N161; N170 |
| O47 | Chimney and fireplace | {at: BR1, line: Home, age: 3, cost: {stone: 180, wood: 120}, time: 40, fx: [{s: warm, a: 0.05}, {s: chill, c: 0.5}], when: 1100s, w: 5} | N160; N161 |
| O48 | Calendar | {at: BTC1, line: Watch, age: 2, cost: {food: 180, gold: 120}, time: 41, fx: [{s: rate, k: BCL1, p: 0.05}, {s: time, k: O, c: 0.05}], need: [ | N160; N161 |
| O49 | Town watch | {at: BTC1, line: Watch, age: 3, cost: {food: 90, gold: 60}, time: 26, fx: [{s: rng, k: BTC1, a: 1.5}, {s: rng, k: BTC1, a: 1.5}], when: 1200 | N160; N161 |
| O50 | Civic pride | {at: BTC1, line: Watch, age: 3, cost: {food: 240, gold: 160}, time: 48, fx: [{s: shelter, p: 1}], when: 1300s, w: 4} | N160; N161 |
| O51 | Lanterns | {at: BTC1, line: Watch, age: 3, cost: {wood: 200, gold: 120}, time: 40, fx: [{s: lamp, k: B, a: 0.6}], when: 1417, w: 4} | N160; N161 |
| O52 | Writing | {at: BP1, line: Letters, age: 1, cost: {wood: 150, gold: 100}, time: 39, fx: [{s: time, k: O, c: 0.15}], when: 3200 BC, w: 10} | N160; N161 |
| O53 | Record keeping | {at: BP1, line: Letters, age: 1, cost: {wood: 100, gold: 70}, time: 28, fx: [{s: queue, a: 1}], when: 3000 BC, w: 5} | N160; N161 |
| O54 | Rhetoric | {at: BP1, line: Letters, age: 2, cost: {wood: 170, gold: 110}, time: 38, fx: [{s: diplo, a: 0.1}], when: 400 BC, w: 5} | N160; N161 |
| O55 | Universities | {at: BP1, line: Letters, age: 3, cost: {wood: 320, gold: 210}, time: 60, fx: [{s: time, k: O, c: 0.1}], when: 1088, w: 7} | N160; N161 |
| O56 | Natural philosophy | {at: BP1, line: Letters, age: 4, cost: {wood: 550, gold: 360}, time: 87, fx: [{s: time, k: O, c: 0.15}], need: [press], when: 1600s, w: 9} | N160; N161 |
| O57 | Geometry | {at: BP1, line: Numbers, age: 2, cost: {wood: 110, gold: 70}, time: 30, fx: [{s: atk, k: [BTC1, BW3, BTC8], a: 2}], when: 300 BC, w: 6} | N160; N161 |
| O58 | Algebra | {at: BP1, line: Numbers, age: 3, cost: {wood: 290, gold: 190}, time: 56, fx: [{s: rng, k: Engines, a: 1.0}], when: 820, w: 6} | N160; N161 |
| O59 | Ballistics | {at: BP1, line: Numbers, age: 4, cost: {wood: 430, gold: 290}, time: 71, fx: [{s: atk, k: Engines, a: 5}], need: [algebra], when: 1537, w: 6 | N160; N161 |
| O60 | Architecture | {at: BP2, line: Learning, age: 2, cost: {gold: 180, stone: 120}, time: 41, fx: [{s: build, c: 0.2}], need: [masonry], when: 25 BC, w: 6} | N160; N161 |
| O61 | Guilds | {at: BP2, line: Learning, age: 3, cost: {gold: 260, stone: 180}, time: 52, fx: [{s: queue, a: 2}], when: 1100s, w: 5} | N160; N161 |
| O62 | Printing press | {at: BP2, line: Learning, age: 4, cost: {gold: 550, stone: 360}, time: 87, fx: [{s: time, k: O, c: 0.32}], when: 1450s, w: 9} | N160; N161 |
| O63 | Optics | {at: BP2, line: Learning, age: 4, cost: {gold: 430, stone: 290}, time: 71, fx: [{s: sight, k: *, a: 2.0}], need: [press], when: 1608, w: 6} | N160; N161 |
| O64 | Seed selection | {at: BI1, line: Soil, age: 0, cost: {food: 60, wood: 40}, time: 19, fx: [{s: soil, a: 0.1}], when: 8000 BC, w: 6} | N160; N161; N170 |
| O65 | Irrigation | {at: BI1, line: Soil, age: 1, cost: {food: 200, wood: 130}, time: 44, fx: [{s: soil, a: 0.15}], when: 3000 BC, w: 7} | N160; N161; N170 |
| O66 | Manuring | {at: BI1, line: Soil, age: 1, cost: {food: 90, wood: 60}, time: 26, fx: [{s: soil, a: 0.1}], when: 2000 BC, w: 4} | N160; N161; N170 |
| O67 | Crop rotation | {at: BI1, line: Soil, age: 3, cost: {food: 340, wood: 230}, time: 64, fx: [{s: rate, k: BCL1, p: 0.2}, {s: limit, k: BCL1, a: 3}], when: 800 | N160; N161; N170 |
| O68 | Enclosure | {at: BI1, line: Soil, age: 4, cost: {food: 390, wood: 260}, time: 66, fx: [{s: limit, k: BCL1, a: 3}], when: 1500s, w: 5} | N160; N161; N170 |
| O69 | New World crops | {at: BI1, line: Crops, age: 0, cost: {wood: 290, iron: 190}, time: 56, fx: [{s: rate, k: BCL4, p: 0.2}], when: 1200s, w: 6} | N160; N161; N170 |
| O70 | Fish traps | {at: BCT2, line: Fishing, age: 0, cost: {wood: 40, food: 30}, time: 15, fx: [{s: rate, k: MW1, p: 0.15}], when: 8000 BC, w: 3} | N160; N161; N170 |
| O71 | Nets | {at: BCT2, line: Fishing, age: 0, cost: {wood: 100, food: 70}, time: 28, fx: [{s: rate, k: MW1, p: 0.3}], when: 6000 BC, w: 5} | N160; N161; N170 |
| O72 | Salting | {at: BCT2, line: Fishing, age: 2, cost: {wood: 170, food: 110}, time: 38, fx: [{s: rate, k: MW1, p: 0.2}, {s: spoil, c: 0.5}], when: 300 BC, | N160; N161; N170 |
| O73 | Decked boats | {at: BCT2, line: Fishing, age: 3, cost: {wood: 290, food: 190}, time: 56, fx: [{s: rate, k: MW1, p: 0.3}], when: 1300s, w: 6} | N160; N161; N170 |
| O74 | Trawl nets | {at: BCT2, line: Fishing, age: 4, cost: {wood: 350, food: 230}, time: 61, fx: [{s: rate, k: MW1, p: 0.2}], when: 1376, w: 4} | N160; N161; N170 |
| O75 | Dugout canoes | {at: BCT2, line: Harbour, age: 0, cost: {wood: 50, food: 30}, time: 17, fx: [{s: rate, k: MW1, p: 0.1}], when: 8000 BC, w: 4} | N160; N161; N170 |
| O76 | Sails | {at: BCT2, line: Harbour, age: 1, cost: {wood: 120, food: 80}, time: 32, fx: [{s: rate, k: MW1, p: 0.15}], when: 3000 BC, w: 7} | N160; N161; N170 |
| O77 | Harbour works | {at: BCT2, line: Harbour, age: 2, cost: {wood: 170, food: 110}, time: 38, fx: [{s: hp, k: BCT2, p: 0.5}], need: [masonry], when: 300 BC, w:  | N160; N161; N170 |
| O78 | Compass | {at: BCT2, line: Harbour, age: 3, cost: {wood: 320, food: 210}, time: 60, fx: [{s: sight, k: [UV, US4, UT1], a: 3}], when: 1100s, w: 7} | N160; N161; N170 |
| O79 | Lighthouse | {at: BCT2, line: Harbour, age: 4, cost: {wood: 310, food: 210}, time: 55, fx: [{s: sight, k: BCT2, a: 6}], when: 1500s, w: 3} | N160; N161; N170 |
| O80 | Fieldcraft | {at: BM1, line: March, age: 0, cost: {food: 40, gold: 30}, time: 15, fx: [{s: sight, k: [Foot, Archers], a: 1}], when: Stone age, w: 3} | N160; N161; N173 |
| O81 | Forced marches | {at: BM1, line: March, age: 2, cost: {food: 170, gold: 110}, time: 38, fx: [{s: spd, k: [Foot, Archers], p: 0.08}], when: 200 BC, w: 5} | N160; N161; N173 |
| O82 | Wool cloaks | {at: BM1, line: March, age: 3, cost: {food: 240, gold: 160}, time: 48, fx: [{s: cold, c: 0.5}], need: [spinwheel], when: 1000s, w: 4} | N160; N161; N173 |
| O83 | Oiled cloaks | {at: BM1, line: March, age: 4, cost: {food: 310, gold: 210}, time: 55, fx: [{s: wet, c: 0.5}], need: [warmclothes], when: 1500s, w: 3} | N160; N161; N173 |
| O84 | Roads | {at: BP2, line: Weather, age: 2, cost: {gold: 200, stone: 130}, time: 44, fx: [{s: mud, c: 0.5}, {s: trade, p: 0.15}], when: 300 BC, w: 7} | N160; N161; N173 |
| O85 | Field drains | {at: BP2, line: Weather, age: 2, cost: {gold: 170, stone: 110}, time: 38, fx: [{s: mud, c: 0.3}], when: 100 BC, w: 5} | N160; N161; N173 |
| O86 | Snow clearing | {at: BP2, line: Weather, age: 3, cost: {gold: 240, stone: 160}, time: 48, fx: [{s: snow, c: 0.5}], when: 1200s, w: 4} | N160; N161; N173 |
| O87 | Crampons | {at: BP2, line: Weather, age: 3, cost: {gold: 240, stone: 160}, time: 48, fx: [{s: studs, k: [UV, Foot, Archers, Engines, US1, US2, US3], a: | N160; N161; N173 |
| O88 | Shields | {at: BM1, line: Ranks, age: 1, cost: {food: 50, gold: 40}, time: 18, fx: [{s: armor, k: [Foot, Archers], min: 0.92}], when: 3000 BC, w: 5} | N160; N161; N176 |
| O89 | Spear wall | {at: BM1, line: Ranks, age: 1, cost: {food: 100, gold: 70}, time: 28, fx: [{s: hp, k: UM1, p: 0.1}], when: 2500 BC, w: 5} | N160; N161; N176 |
| O90 | Drill | {at: BM1, line: Ranks, age: 1, cost: {food: 110, gold: 70}, time: 30, fx: [{s: hp, k: UM, p: 0.15}], when: 700 BC, w: 6} | N160; N161; N176 |
| O91 | Phalanx | {at: BM1, line: Ranks, age: 2, cost: {food: 200, gold: 130}, time: 44, fx: [{s: hp, k: UM1, p: 0.25}, {s: atk, k: UM1, a: 2}], rank: {k: UM1 | N160; N161; N176 |
| O92 | Legion | {at: BM1, line: Ranks, age: 2, cost: {food: 220, gold: 150}, time: 47, fx: [{s: hp, k: [Foot, Archers], p: 0.1}, {s: atk, k: [Foot, Archers] | N160; N161; N176 |
| O93 | Pike square | {at: BM1, line: Ranks, age: 3, cost: {food: 320, gold: 210}, time: 60, fx: [{s: hp, k: UM1, p: 0.15}, {s: atk, k: UM1, a: 1}], rank: {k: UM1 | N160; N161; N176 |
| O94 | Men-at-arms | {at: BM1, line: Ranks, age: 3, cost: {food: 260, gold: 180}, time: 52, fx: [{s: hp, k: UM6, p: 0.3}, {s: atk, k: UM6, a: 3}], rank: {k: UM6, | N160; N161; N176 |
| O95 | Halberd | {at: BM1, line: Ranks, age: 4, cost: {food: 390, gold: 260}, time: 66, fx: [{s: hp, k: UM1, p: 0.1}, {s: atk, k: UM1, a: 2}], rank: {k: UM1, | N160; N161; N176 |
| O96 | Tercio | {at: BM1, line: Ranks, age: 4, cost: {food: 470, gold: 310}, time: 77, fx: [{s: hp, k: [Foot, Archers], p: 0.15}], need: [volley], when: 153 | N160; N161; N176 |
| O97 | Bayonet | {at: BM1, line: Ranks, age: 4, cost: {food: 430, gold: 290}, time: 71, fx: [{s: atk, k: UM9, a: 3}], need: [musket], when: 1670s, w: 6} | N160; N161; N176 |
| O98 | Slings | {at: BM2, line: Shot, age: 1, cost: {wood: 80, gold: 50}, time: 24, fx: [{s: atk, k: UM7, a: 1}], when: 7000 BC, w: 3} | N160; N161; N176 |
| O99 | Composite bow | {at: BM2, line: Shot, age: 1, cost: {wood: 120, gold: 80}, time: 32, fx: [{s: rng, k: [UM2, UM8, UM11], a: 1.5}], when: 2000 BC, w: 7} | N160; N161; N176 |
| O100 | Fire arrows | {at: BM2, line: Shot, age: 3, cost: {wood: 170, gold: 110}, time: 38, fx: [{s: fire, k: [UM2, UM8, UM11], a: 1}], need: [composite], when: 9 | N160; N161; N176 |
| O101 | Bodkin points | {at: BM2, line: Shot, age: 3, cost: {wood: 150, gold: 100}, time: 35, fx: [{s: atk, k: [UM2, UM8, UM11], a: 1}], need: [iron], when: 1000s,  | N160; N161; N176 |
| O102 | Crossbow drill | {at: BM2, line: Shot, age: 3, cost: {wood: 240, gold: 160}, time: 48, fx: [{s: atk, k: UM8, a: 2}], when: 1200s, w: 4} | N160; N161; N176 |
| O103 | Longbow | {at: BM2, line: Shot, age: 3, cost: {wood: 290, gold: 190}, time: 56, fx: [{s: atk, k: UM2, a: 1}, {s: rng, k: UM2, a: 2.0}], rank: {k: UM2, | N160; N161; N176 |
| O104 | Musket | {at: BM2, line: Shot, age: 4, cost: {wood: 510, gold: 340}, time: 82, fx: [{s: hp, k: UM9, p: 0.1}, {s: atk, k: UM9, a: 4}, {s: rng, k: UM9, | N160; N161; N176 |
| O105 | Volley fire | {at: BM2, line: Shot, age: 4, cost: {wood: 470, gold: 310}, time: 77, fx: [{s: atk, k: [UM9, UM14], a: 4}], need: [musket], when: 1590s, w:  | N160; N161; N176 |
| O106 | Horse breeding | {at: BM3, line: Horse, age: 1, cost: {food: 130, gold: 90}, time: 35, fx: [{s: spd, k: Riders, p: 0.12}, {s: spd, k: US4, p: 0.35}, {s: sigh | N160; N161; N176 |
| O107 | Bits and bridles | {at: BM3, line: Horse, age: 1, cost: {food: 80, gold: 50}, time: 24, fx: [{s: spd, k: Riders, p: 0.05}], when: 2000 BC, w: 3} | N160; N161; N176 |
| O108 | Saddles | {at: BM3, line: Horse, age: 2, cost: {food: 150, gold: 100}, time: 35, fx: [{s: hp, k: Riders, p: 0.1}], when: 200 BC, w: 4} | N160; N161; N176 |
| O109 | Stirrups | {at: BM3, line: Horse, age: 2, cost: {food: 220, gold: 150}, time: 47, fx: [{s: atk, k: Riders, a: 1}], need: [saddles], when: 300s, w: 8} | N160; N161; N176 |
| O110 | Horseshoes | {at: BM3, line: Horse, age: 3, cost: {food: 260, gold: 180}, time: 52, fx: [{s: studs, k: Riders, a: 1}, {s: mud, k: Riders, c: 0.2}], when: | N160; N161; N176 |
| O111 | Stud farms | {at: BM3, line: Horse, age: 4, cost: {food: 350, gold: 230}, time: 61, fx: [{s: train, k: Riders, c: 0.2}], when: 1500s, w: 4} | N160; N161; N176 |
| O112 | Cavalry | {at: BM3, line: Rider, age: 2, cost: {food: 200, gold: 130}, time: 44, fx: [{s: hp, k: UM10, p: 0.15}, {s: spd, k: UM10, p: 0.12}], rank: {k | N160; N161; N176 |
| O113 | Knighthood | {at: BM3, line: Rider, age: 3, cost: {food: 320, gold: 210}, time: 60, fx: [{s: hp, k: UM3, p: 0.2}, {s: atk, k: UM3, a: 2}, {s: spd, k: UM3 | N160; N161; N176 |
| O114 | Dragoons | {at: BM3, line: Rider, age: 4, cost: {food: 390, gold: 260}, time: 66, fx: [{s: spd, k: Riders, p: 0.1}], need: [musket], when: 1600s, w: 5} | N160; N161; N176 |
| O115 | Bronze | {at: BI9, line: Blades, age: 1, cost: {gold: 100}, time: 37, fx: [{s: atk, k: UM, a: 1}, {s: atk, k: [BTC1, BW3, BTC8], a: 1}], when: 3300 B | N160; N161; N176 |
| O116 | Socketed heads | {at: BI9, line: Blades, age: 1, cost: {gold: 60}, time: 26, fx: [{s: atk, k: UM1, a: 1}], when: 2000 BC, w: 4} | N160; N161; N176 |
| O117 | Iron working | {at: BI9, line: Blades, age: 1, cost: {gold: 240, iron: 160}, time: 50, fx: [{s: atk, k: UM, a: 2}, {s: atk, k: [BTC1, BW3, BTC8], a: 2}], w | N160; N161; N176 |
| O118 | Tempering | {at: BI9, line: Blades, age: 3, cost: {gold: 290, iron: 190}, time: 56, fx: [{s: wear, a: 0.5}], when: 1200s, w: 6} | N160; N161; N176 |
| O119 | Case hardening | {at: BI9, line: Blades, age: 4, cost: {gold: 350, iron: 230}, time: 61, fx: [{s: atk, k: UM, a: 1}], when: 1500s, w: 4} | N160; N161; N176 |
| O120 | Helmets | {at: BI9, line: Armour, age: 1, cost: {gold: 60}, time: 26, fx: [{s: armor, k: [Foot, Archers], min: 0.9}], when: 2500 BC, w: 4} | N160; N161; N176 |
| O121 | Leather armour | {at: BI9, line: Armour, age: 1, cost: {gold: 60}, time: 26, fx: [{s: armor, k: UM, min: 0.85}], kit: true, when: 2000 BC, w: 4} | N160; N161; N176 |
| O122 | Scale armour | {at: BI9, line: Armour, age: 2, cost: {gold: 150, iron: 100}, time: 35, fx: [{s: armor, k: Riders, min: 0.8}], when: 900 BC, w: 4} | N160; N161; N176 |
| O123 | Chain mail | {at: BI9, line: Armour, age: 2, cost: {gold: 180, iron: 120}, time: 41, fx: [{s: armor, k: UM, min: 0.7}], kit: true, need: [iron], when: 30 | N160; N161; N176 |
| O124 | Plate armour | {at: BI9, line: Armour, age: 3, cost: {gold: 320, iron: 210}, time: 60, fx: [{s: armor, k: UM, min: 0.6}], kit: true, need: [chain, bellows] | N160; N161; N176 |
| O125 | Oiled steel | {at: BI9, line: Armour, age: 4, cost: {gold: 310, iron: 210}, time: 55, fx: [{s: wear, a: 0.5}], need: [tempering], when: 1500s, w: 3} | N160; N161; N176 |
| O126 | Torsion springs | {at: BM4, line: Engines, age: 2, cost: {wood: 180, gold: 120}, time: 41, fx: [{s: rng, k: UM5, a: 1.5}, {s: rng, k: UM15, a: 1.5}], when: 33 | N160; N161; N176 |
| O127 | Siege engineers | {at: BM4, line: Engines, age: 2, cost: {wood: 170, gold: 110}, time: 38, fx: [{s: train, k: Engines, c: 0.25}], when: 300 BC, w: 5} | N160; N161; N176 |
| O128 | Burning shot | {at: BM4, line: Engines, age: 3, cost: {wood: 260, gold: 180}, time: 52, fx: [{s: fire, k: Engines, a: 1}], need: [firearrows], when: 600s,  | N160; N161; N176 |
| O129 | Counterweight | {at: BM4, line: Engines, age: 3, cost: {wood: 320, gold: 210}, time: 60, fx: [{s: atk, k: UM16, a: 10}], when: 1100s, w: 7} | N160; N161; N176 |
| O130 | Corned powder | {at: BM4, line: Engines, age: 4, cost: {wood: 510, gold: 340}, time: 82, fx: [{s: atk, k: UM14, a: 20}], when: 1420s, w: 8} | N160; N161; N176 |
| O131 | Gun carriages | {at: BM4, line: Engines, age: 4, cost: {wood: 430, gold: 290}, time: 71, fx: [{s: spd, k: Engines, p: 0.25}], need: [corned], when: 1470s, w | N160; N161; N176 |
| O132 | Petards | {at: BM4, line: Engines, age: 4, cost: {wood: 390, gold: 260}, time: 66, fx: [{s: blast, k: [UM9, UM14], a: 1}], need: [corned], when: 1570s | N160; N161; N176 |
| O133 | Arrow slits | {at: BI9, line: Walls, age: 2, cost: {gold: 150, iron: 100}, time: 35, fx: [{s: rng, k: Shoot, a: 2.0}], when: 200 BC, w: 4} | N160; N161; N188 |
| O134 | Curtain walls | {at: BI9, line: Walls, age: 3, cost: {gold: 290, iron: 190}, time: 56, fx: [{s: hp, k: [Line, Gate], p: 0.6}, {s: hp, k: BW3, p: 0.4}], need | N160; N161; N188 |
| O135 | Machicolations | {at: BI9, line: Walls, age: 3, cost: {gold: 240, iron: 160}, time: 48, fx: [{s: atk, k: BW3, a: 5}], need: [fortify], when: 1200s, w: 4} | N160; N161; N188 |
| O136 | Gun founding | {at: BI9, line: Walls, age: 4, cost: {gold: 470, iron: 310}, time: 77, fx: [{s: atk, k: [UM9, UM14], a: 10}], need: [blasting], when: 1400s, | N160; N161; N188 |
| O137 | Star fort | {at: BI9, line: Walls, age: 4, cost: {gold: 510, iron: 340}, time: 82, fx: [{s: hp, k: [Line, Gate], p: 0.5}, {s: hp, k: Shoot, p: 0.3}], ne | N160; N161; N188 |
| O138 | Beacons | {at: BW3, line: Towers, age: 2, cost: {wood: 150, gold: 80}, time: 35, fx: [{s: sight, k: Shoot, a: 6.0}], when: about 200 BC, w: 4} | N160; N161; N188 |
| O139 | Great towers | {at: BW3, line: Towers, age: 3, cost: {stone: 300, gold: 150}, time: 50, fx: [{s: hp, k: BW3, p: 0.4}, {s: atk, k: BW3, a: 4}, {s: rng, k: B | N160; N161; N188 |
| O140 | Gun towers | {at: BW3, line: Towers, age: 4, cost: {stone: 400, gold: 200, iron: 200}, time: 70, fx: [{s: hp, k: BW3, p: 0.4}, {s: atk, k: BW3, a: 10}, { | N160; N161; N188 |
| O141 | Drawbridge | {at: BTC2, line: Garrison, age: 3, cost: {gold: 240, iron: 160}, time: 48, fx: [{s: hp, k: BTC2, p: 0.2}], when: 1200s, w: 4} | N160; N161; N188 |
| O142 | Standing army | {at: BTC2, line: Garrison, age: 3, cost: {gold: 290, iron: 190}, time: 56, fx: [{s: rest, p: 0.3}, {s: train, c: 0.1}], when: 1445, w: 6} | N160; N161; N188 |
| O143 | Garrison wards | {at: BTC2, line: Garrison, age: 4, cost: {gold: 390, iron: 260}, time: 66, fx: [{s: garrison, p: 1}], need: [hospitals], when: 1500s, w: 5} | N160; N161; N188 |
| O144 | Bastions | {at: BTC2, line: Garrison, age: 4, cost: {gold: 430, iron: 290}, time: 71, fx: [{s: atk, k: BTC2, a: 8}], need: [starfort], when: 1530s, w:  | N160; N161; N188 |
| O145 | Engagement | {at: BP10, line: Command, age: 2, cost: {food: 180, gold: 120}, time: 41, fx: [{s: rout, c: 0.5}], when: 500 BC, w: 6} | N160; N161; N188 |
| O146 | Battalions | {at: BP10, line: Command, age: 2, cost: {food: 180, gold: 120}, time: 41, fx: [], need: [engage], when: 300 BC, w: 6} | N160; N161; N188 |
| O147 | Formations | {at: BP10, line: Command, age: 2, cost: {food: 170, gold: 110}, time: 38, fx: [], need: [command], when: 300 BC, w: 5} | N160; N161; N188 |
| O148 | Standards | {at: BP10, line: Command, age: 2, cost: {food: 260, gold: 180}, time: 52, fx: [{s: rest, p: 0.5}], when: 100 BC, w: 5} | N160; N161; N188 |
| O149 | Supply trains | {at: BP10, line: Command, age: 3, cost: {food: 260, gold: 180}, time: 52, fx: [{s: rest, p: 0.2}], when: 1200s, w: 5} | N160; N161; N188 |
| O150 | Muster | {at: BP10, line: Command, age: 4, cost: {food: 430, gold: 290}, time: 71, fx: [], when: 1600s, w: 6} | N160; N161; N188 |
| O151 | General staff | {at: BP10, line: Command, age: 4, cost: {food: 430, gold: 290}, time: 71, fx: [{s: charge, p: 0.2}], need: [muster], when: 1630s, w: 6} | N160; N161; N188 |
| O152 | Drill yard | {at: BM1, line: Levy, age: 2, cost: {food: 150, gold: 100}, time: 35, fx: [{s: train, c: 0.1}], when: 300 BC, w: 4} | N160; N161 |
| O153 | Veterans | {at: BM1, line: Levy, age: 2, cost: {food: 180, gold: 120}, time: 41, fx: [{s: teach, a: 1}], need: [writing], when: 100 BC, w: 6} | N160; N161 |
| O154 | Feudal levy | {at: BM1, line: Levy, age: 3, cost: {food: 240, gold: 160}, time: 48, fx: [{s: cost, k: [Foot, Archers], c: 0.1}], when: 900s, w: 4} | N160; N161 |
| O155 | Apprenticeship | {at: BP1, line: Teaching, age: 1, cost: {wood: 90, gold: 60}, time: 26, fx: [{s: train, c: 0.1}], when: 1700 BC, w: 4} | N160; N161 |
| O156 | Academy | {at: BP1, line: Teaching, age: 2, cost: {wood: 170, gold: 110}, time: 38, fx: [{s: lesson, c: 0.3}], need: [veterans], when: 387 BC, w: 5} | N160; N161 |
| O157 | War college | {at: BP1, line: Teaching, age: 4, cost: {wood: 390, gold: 260}, time: 66, fx: [{s: lesson, c: 0.3}], need: [academy], when: 1617, w: 5} | N160; N161 |
| O158 | Rites | {at: BP3, line: Faith, age: 1, cost: {gold: 90, stone: 60}, time: 26, fx: [{s: zealsecs, a: 15}], when: Bronze age, w: 4} | N160; N161 |
| O159 | Sacred games | {at: BP3, line: Faith, age: 2, cost: {gold: 150, stone: 100}, time: 35, fx: [{s: zealcost, c: 0.5}, {s: zealcd, c: 0.3}], when: 776 BC, w: 4 | N160; N161 |
| O160 | Relics | {at: BP3, line: Faith, age: 3, cost: {gold: 240, stone: 160}, time: 48, fx: [{s: convert, c: 0.25}], when: 800s, w: 4} | N160; N161 |
| O161 | Preaching orders | {at: BP3, line: Faith, age: 3, cost: {gold: 240, stone: 160}, time: 48, fx: [{s: rest, p: 0.2}], when: 1210s, w: 4} | N160; N161 |
| O162 | Reformation | {at: BP3, line: Faith, age: 4, cost: {gold: 470, stone: 310}, time: 77, fx: [{s: zealcost, c: 0.3}], need: [press], when: 1517, w: 7} | N160; N161 |
| O163 | Law code | {at: BP8, line: Order, age: 1, cost: {gold: 200, wood: 130}, time: 44, fx: [{s: push, c: 0.15}], need: [writing], when: 1750 BC, w: 7} | N160; N161 |
| O164 | Magistrates | {at: BP8, line: Order, age: 3, cost: {gold: 260, wood: 180}, time: 52, fx: [{s: push, c: 0.2}], when: 1100s, w: 5} | N160; N161 |
| O165 | Night watch | {at: BP8, line: Order, age: 3, cost: {gold: 80, wood: 50}, time: 24, fx: [{s: spysight, a: 6}], when: 1200s, w: 3} | N160; N161 |
| O166 | Informers | {at: BP8, line: Order, age: 4, cost: {gold: 350, wood: 230}, time: 61, fx: [{s: cost, k: US3, c: 0.3}], when: 1500s, w: 4} | N160; N161 |
| O167 | Tolls | {at: BP8, line: Revenue, age: 2, cost: {gold: 150, wood: 100}, time: 35, fx: [{s: trade, p: 0.1}], when: 100s, w: 4} | N160; N161 |
| O168 | Assizes | {at: BP8, line: Revenue, age: 3, cost: {gold: 240, wood: 160}, time: 48, fx: [{s: spysight, a: 4}], when: 1166, w: 4} | N160; N161 |
| O169 | Police | {at: BP8, line: Revenue, age: 4, cost: {gold: 390, wood: 260}, time: 66, fx: [{s: cost, k: US3, c: 0.15}, {s: spysight, a: 4}], need: [infor | N160; N161 |

## words

| Code | Name | Value | Cited |
|---|---|---|---|
| J1 | the ledger's word for each reason a store goes in or out (Mid's LEDGER_WORD; the Throne's tithe waits on the Throne, the vassals' tax is parked) | {gather: gathered, orders: marching orders, camps: camp supply, finds: finds, trade: trade, tribute: tribute, ransom: ransoms, market: the M | N132 |
| J2 | a ledger line with nothing on it | nothing yet | N132 |
| J3 | a list said: 'a, b or c'; a ledger line's items apart | {and: , , or:  or , dot:  · } | N132 |
| J4 | a number shortened: 1.2k | k | N132 |
| J5 | one, two: the first ending that fits, as [pattern, flags, ending] (a man-at-arms, men-at-arms; a spearman; a wolf; an ally; a ditch; the rest take s) | [[^(m)an(-at-arms)$, i, $1en$2], [man$, , men], [(wol)f$, i, $1ves], [([^aeiou])y$, , $1ies], [(s/x/ch/sh)$, , $1es], [$, , s]] | N132 |
| J6 | the map's lettered squares: a letter across, a number down (A1 to V22 on the board, D190) | ABCDEFGHIJKLMNOPQRSTUVWXYZ | N132 |
| J7 | the history line of each age (age0 to age4), each research step and each soldier kind, by its key (a step that shares a kind's key: tech:key): what it was and when (Mid's WHY) | {wonder: The great work of each civilisation: built to be seen, and costly enough to show a state at its height., age0: Farming villages of  | N160; N161; N170; N176 |
| J8 | what the town is told when food, the seasons and the flock turn, or its people slip on ice, by the event that tells it (Mid's news; {n}, {m} and {at} filled in) | {hungry: Food stores empty: put villagers on food., fed: Your people are fed again., famine: Famine: no food in reach. Two days to recover., | N170; N173 |
| J9 | what a refusal or an order says for plots, the dock, the hunt, a spot nobody can walk to and a site nobody can reach (Mid's words; the last two F23's) | {replanted: {n} replanted., broke: Not enough to replant., hands: No free hands: train more villagers., hunt: A villager goes hunting., shor | N170 |
| J10 | the army's words: the three squads (Mid's BN, the NATO names), the tempers, the shapes, the intents and the squad dials (Mid's TEMPER, FORM, INTENT) | {squads: [Alpha, Bravo, Charlie], all: Army, setup: Set up, tempers: [Hold, Guard, Press], forms: {line: Line, wedge: Wedge, square: Square, | N188 |
| J11 | orders you can follow, the quick action, the choke, the ambush and the War Director: what each says (Mid's 11-orders, 28-army-quick, 39-huddle words); a move is [its id, its cell, the event it sounds, what it says] | {marching: {n} marching: {at}., arrived: {n} arrived: {at}., lost: {m} is lost., losing: {m} is losing., nobody: {m}: nobody idle in it., no | N190 |
| J12 | the Alarm's four orders (each a name and its icon), what it says, the danger's causes and the warnings (Mid's EMERGENCY, emgStart, emgStop, dangerWhy, watchHome) | {cells: {square: {name: Gather, icon: gather}, hands: {name: Garrison, icon: garrison}, shelter: {name: Shelter, icon: shelter}, work: {name | N192 |
| J13 | the end: the sides' names, a side's fall, the wonder, the bell and the score (Mid's judge, fall, finish, built) | {sides: [You, Raiders, Rivals, Fortress], fell: Your keep fell. You held out {t}., rivals: Every rival has fallen. {t}, wonder: [Your wonder | N192 |
| J14 | what Teach, prisoners, priests, Zeal and spies say (Mid's teachWhy, graduate, takePrisoner, payRansom, prisonersTick, priestTick, zealWhy, zeal, sabotage, intel) | {teach: {label: Teach, none: Nothing newer to learn., busy: Already learning., vets: Research Veterans at the Barracks., age: Needs the {age | N194 |

