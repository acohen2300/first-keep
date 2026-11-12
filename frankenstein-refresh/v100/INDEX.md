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
| A6 | your corner: the board's corners go clockwise a quarter turn apart from the top left of the screen; yours, the first, is this far round, the bottom left, whatever the grid's turn (Albert, Nov 6 16:01) | 270 | N228 |

## capabilities

| Code | Name | Value | Cited |
|---|---|---|---|
| SC0 | what every shell has: a name, its ticks, its citation | {by: every book of shells, law: [], needs: [name, ticks, cite], may: [layer]} | N92 |
| SC01 | the mold of a find (layer 100); a body (Mass book) gives it its real height | {by: shells (finds), law: [], needs: [find, look], may: [room, sound, style, body]} | N92 |
| SC02 | the mold of a building (layer 110) | {by: shells (buildings), law: [], needs: [size, style, look, material], may: []} | N92 |
| SC03 | the mold of a walker (layer 120); one of a side eats its Upkeep (D211). The Unit shell: a soldier kind fills its class (Foot, Archers, Riders, Engines: the building D133 names for it), the age it opens in (D130) and the kind it learns into (teach, Mid's TEACH_TO); a civilisation's own kind names its civ and the common kind it replaces (Mid's civ, replaces) | {by: shells (units, moveables), law: [], needs: [look, pace, body], may: [upkeep, class, age, teach, civ, replaces]} | N92; N170; N176; N225 |
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
| SC18 | scouts: finds the hidden traps it comes near, for its side; left to itself, it goes for a find whose guards have fallen, then loops the land (Mid's scoutTick) | {by: combat.js traps, econ.js scout, law: [], needs: [], may: []} | N100; N198; N205 |
| SC19 | trades: a Market sells and buys by the lot at the going price (D270, QAE), sends ventures (D274) and loads its side's caravans; a caravan (D278) with a route carries goods from its Market to a trade stop or an ally's Market, sells them by distance (QCE) and buys spice at a stop, or with none runs to an ally's Market for distance² pay; a trade stop is where caravans sell, on one of the two routes | {by: econ.js, law: [QAE, QCE], needs: [], may: []} | N195 |
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
| SC36 | a shop: its one worker turns what is in store into a good, at D276's rate (from what, how fast), by the choice set on it (its yield first); Learning by doing (D277) on the Mint and the Foundry; a Mint lets its side debase the coin (D273) | {by: econ.js, law: [QAB], needs: [yield, D276], may: []} | N195 |
| SC37 | stands on a trade stop (only there, one a stop): the stop is its side's once it stands; a side holding a route's four stops is paid D278's all a second, and a keeper takes D278's cut of others' sales there | {by: econ.js, law: [], needs: [], may: []} | N195 |
| SC38 | a wagon sent to a spot drives there and unpacks its camp (D287) as sites; the trees under it burn | {by: econ.js unpack, combat.js order, law: [], needs: [camp], may: []} | N198 |
| SC39 | a depot: the soldiers within D279's reach eat from its stock; unsupplied they slow and do not mend; a Market caravan fills it | {by: econ.js upkeep, a caravan's run, law: [], needs: [], may: []} | N198 |
| SC40 | a hidden trap (D280's kinds): seen only by its side, its allies and a side whose scout found it; a foe who steps on it springs it | {by: combat.js traps, index.html (drawn, hidden), law: [], needs: [trap], may: []} | N198 |
| SC41 | carries an offer of peace or alliance to a court or a group, answered there by its odds (QAF) or its regard; no one strikes it on the road | {by: econ.js, combat.js enemies, law: [QAF], needs: [], may: []} | N198 |
| SC42 | a find held by its guards (D305): the first side to touch it once they fall takes what it holds (its yield, if it has one, stays to be worked) | {by: econ.js finds, index.html (laid with their guards), law: [], needs: [], may: []} | N205 |
| SC43 | drifters by a fire (D305): they fight for whoever pays, a unit of the payer beside them; the mercenaries move on when their time is out | {by: econ.js hire, index.html (laid with their drifters), law: [], needs: [], may: []} | N205 |
| SC44 | a traveller (D306): crosses the land edge to edge and joins the first side to meet him, as villagers, or as food when the town is full | {by: combat.js wild, index.html (they arrive), law: [], needs: [], may: [mount]} | N205 |
| SC45 | wooden or thatched: it catches fire from lightning in a summer storm, a spark, a shot, sabotage or a wildfire, burns down unless its villagers put it out, and lights its wooden neighbours (D310) | {by: econ.js fire, index.html (drawn, struck), law: [QT, QU], needs: [], may: []} | N206; N21; N22 |
| SC46 | a place of care or recreation: counts toward the Wellbeing crown, and the wellbeing chaser builds it (Mid's CARE: Hospital, Temple, Baths, Theatre, Tavern) | {by: econ.js crowns, law: [], needs: [], may: []} | N222 |
| SC47 | built more than once in a row: after placing it, the next one waits beside it to be placed (Build another); a building you raise once closes the placing (Albert, Nov 10, N17 #17) | {by: menu.js place, law: [], needs: [], may: []} | N307 |

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
| N20 |  | Wronski, E. B. & Humphreys, N. (1994) A method for evaluating the cumulative impact of ground-based logging systems on soils, Journal of For | opened |
| N21 |  | Rothermel (1972); USDA RMRS-GTR-371 | opened |
| N22 |  | Heskestad (1984); NFPA 72, the t² fire | opened |
| N23 |  | Holling (1959), Can. Entomol. 91 | opened |
| N24 |  | Charnov (1976), Theor. Pop. Biol. 9 | opened |
| N25 |  | Fretwell & Lucas (1970) | opened |
| N26 |  | Sutherland (1983) | opened |
| N27 |  | Verhulst (1838) | opened |
| N28 |  | Schaefer (1954) | opened |
| N29 |  | White, L. (1962) Medieval Technology and Social Change, Oxford UP; Rothamsted Research (2017) Broadbalk mean long-term winter wheat yields 1 | to open |
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
| N64 |  | Beakawi Al-Hashemi, H. M. & Baghabra Al-Amoudi, O. S. (2018) A review on the angle of repose of granular materials, Powder Technology 330:39 | opened |
| N65 |  | Ettinger (2017), Mulberry32, a 32-bit generator; the seed of the day is the game's own rule | opened |
| N66 |  | openage reverse-engineering docs, terrain media (AoE2 terrain tile 97x49 px): AoE2 tile 97x49 px, ~2:1. A 2:1 tile = camera elevation 30 deg | opened |
| N67 |  | Webb, P. Introduction to Oceanography, 13.3 Landforms of Coastal Erosion, LibreTexts (CC BY); Bird (2008) Coastal Geomorphology: An Introduc | to open |
| N68 |  | Wikipedia 'River ford' (Oxford, Frankfurt); Wiktionary 'Bedford' (OE Bedanford, Bede's/Bieda's ford): Oxford: ford where oxen crossed; Frank | opened |
| N69 |  | Age of Empires II: Definitive Edition data, SiegeEngineers aoe2techtree data/data.json (Oct 2026); AoE2 fandom Farm and Berry Bush pages; ag | opened |
| N70 |  | First Keep Build 42 (Oct 28), the old game's own gathering rates a second: berries 0.9, trees 0.75, gold 0.6, stone 0.55, iron 0.5 (its time | opened |
| N71 |  | US Army FM 21-18 Foot Marches: quick time 120 steps a minute at a 30-inch step, 3.4 mph = 1.52 m/s (the game's walk; Bohannon 1997 gives 1.2 | opened |
| N72 |  | Wikipedia 'Horse gait' (walk ~7 km/h, trot ~13 km/h): Walk ~7 km/h = 1.94 m/s; trot ~13 km/h = 3.6 m/s | opened |
| N73 |  | Mech, L. D. (1994) Regular and homeward travel speeds of arctic wolves, Journal of Mammalogy, doi:10.2307/1382524; Wolf Haven, Basic facts a | opened |
| N74 |  | Hart, Nilsson & Raphael (1968), IEEE Trans. SSC 4: A* | opened |
| N75 |  | First Keep Build 42 (Oct 28), the old game's SCORE: unit 5, bld 5, tech 5, wealth 10 (its weights, kept) | opened |
| N76 |  | US Army ADRP 1-02 (via Dupuy Institute, 'Breakpoints in U.S. Army Doctrine', 2018): destroyed at 30% losses; Dupuy Institute 'The 40% Rule'  | opened |
| N77 |  | Ranger Medic Handbook (2025), p. 45, the classes of haemorrhagic shock: I up to 15% blood lost, slightly anxious; II 15–30%, mildly anxious; | opened |
| N78 |  | FBI Academy, Handgun Wounding Factors and Effectiveness (Patrick, 1989): short of a hit to the brain or upper spinal cord, a wounded man is  | opened |
| N79 |  | NAVMC 2691, Marine Corps Drill and Ceremonies Manual: quick time is 120 steps a minute at 30 inches a step (3.4 mph, 1.52 m/s); summary open | opened |
| N80 |  | Winter, Patla, Prince, Ishac & Gielo-Perczak (1998) Stiffness control of balance in quiet standing, J. Neurophysiol. 80(3):1211-1221 (invert | to open |
| N81 |  | Engineering ToolBox, Friction coefficients for common materials: rubber on dry concrete 0.6–0.85, on wet 0.45–0.75; car tyre on dry grass 0. | opened |
| N82 |  | Conservation of momentum; the perfectly inelastic collision v = m₁v₁ / (m₁ + m₂) (standard mechanics) | opened |
| N83 |  | Sliding to rest under Coulomb friction: d = v² / (2 μ g) (standard mechanics) | opened |
| N84 |  | ICRP Publication 23 (1975) Report of the Task Group on Reference Man, Pergamon: Reference Man 70 kg, 170 cm, age 20-30 | opened |
| N85 |  | Wolf Haven gray wolf facts; USGS NPWRC Estimating Big Game Weights (ND white-tailed deer): Wolf 36-50 kg (male), 27-36 (female); white-taile | opened |
| N86 |  | Rossing, The Science of Sound (not opened); free-free bar ratios via Hopkin, Musical Instrument Design, in Univ. Rochester PHY103 'Bars and  | to open |
| N87 |  | AmesWeb material density tables: Pure iron 7874; granite 2750, sandstone 2300, marble 2770; red oak 660, white oak 690, shortleaf pine 500 | opened |
| N88 |  | Albert, D. G. (c.1990) Preliminary analysis of measured sound propagation over various seasonal snow covers, US Army CRREL (NASA NTRS 199100 | opened |
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
| N159 |  | Vienna Convention on the Law of Treaties (1969), art. 34: 'A treaty does not create either obligations or rights for a third State without i | opened |
| N160 |  | Design: Mid's ages and research (01-rules-basics.js AGES; 04-rules-tech.js TECH, the economy and learning lines; 08-core.js lineOf, prevOf,  | opened |
| N161 |  | Spot-check only. Blasting: Slovak Spectator (2017), citing the Slovak Mining Museum and a mining office record dated 16 Feb 1627; windmill:  | opened |
| N162 |  | Design: Albert, Nov 5 13:30: one build carries a whole module (or a few small ones), never split; the cap of ten lifted for the refresh; the | opened |
| N163 |  | Reynolds, C. W. (1987) Flocks, herds, and schools: a distributed behavioral model, Computer Graphics 21(4):25-34 (SIGGRAPH '87): First rule  | opened |
| N164 |  | Design: Mid's gathering and standing spots (12-sim-core.js recount, FORAGE, forage, forageNow; 13-sim-civil.js findCap, LATTICE, spotAt, tak | opened |
| N165 |  | Hall, E. T. (1966) The Hidden Dimension, Doubleday/Anchor; hex packing density pi/(2 sqrt 3) (Lagrange 1773, lattice; Thue 1890/1910; Fejes  | opened |
| N166 |  | 29 CFR 1910.266(d)(6)(ii); 29 CFR 1910.142(b)(3): Adjacent occupied work areas at least two tree lengths apart; beds not closer than 36 in l | opened |
| N167 |  | Moussaid, Helbing, Garnier, Johansson, Combe & Theraulaz (2009) Proc. R. Soc. B 276:2755-2762 (arXiv:0908.3131): Slight right-hand preferenc | opened |
| N168 |  | Design: Mid's builders, repair, limits, taking down, placing and walls (11-orders.js autoBuilder, sendBuilder, repairCost, shellBack, refund | opened |
| N169 |  | Design: Albert, Nov 5 10:06–10:28: build and train times Mid's; every building's health v100's | opened |
| N170 |  | Design: Mid's food, farms, seasons, hunting and fishing (36-economy.js shareOf, orderCost, hungerOf, upkeepTick, natureTick, seasonTurn, FLE | opened |
| N171 |  | Keys et al. (1950) The Biology of Human Starvation, Univ. of Minnesota Press; via Hargrove, Heinz & Heinz (2008) Dynamic Medicine 7:16, Tabl | opened |
| N172 |  | Design: Albert, Nov 5 16:07: the Palisade comes only with the war camp, as in Mid (free there); it leaves the Walls tab | opened |
| N173 |  | Design: Mid's pace (09-nav.js paceOf; 12-sim-core.js sideSpd, insulate; 37-events.js groundNeed, studded, iceMu, strideShare, groundSpd, muO | opened |
| N174 |  | Scheibe, R. R. (2002) An Overview of Studded and Studless Tire Traction and Safety, WA-RD 551.1, Washington State Transportation Center for  | opened |
| N175 |  | Hsu, J., Shaw, R., Novak, A., Li, Y., Ormerod, M., Newton, R., Dutta, T. & Fernie, G. (2016) Slip resistance of winter footwear on snow and  | opened |
| N176 |  | Design: Mid's soldiers (02-rules-units.js UNIT, spear to treb; 04-rules-tech.js the barracks, range, stable, smith and siege lines and their | opened |
| N177 |  | Asian elephant: San Diego Zoo Wildlife Alliance factsheet; arrows/bolts/guns: Williams, 'What can scientific analysis tell us about the effe | opened |
| N178 |  | Gao, Abeysekera, Hirvonen & Aschan (2003), The effect of footwear sole abrasion on the coefficient of friction on melting and hard ice, Int. | opened |
| N179 |  | Burnfield & Powers (2004), Prediction of slip events during walking: an analysis of utilized coefficient of friction and available slip resi | opened |
| N180 |  | US National Weather Service glossary, blizzard (forecast.weather.gov/glossary.php?word=bliz; weather.gov/dtx/winter_defs): sustained wind or | opened |
| N181 |  | Pugh, L. G. C. E. (1971) The influence of wind resistance in running and walking and the mechanical efficiency of work against horizontal or | to open |
| N182 |  | Seliga, Hazen & Burnley, nowcasting snowfall rate from visibility (AMS paper 104640): S = c σ, c from about 0.6 early in an event to 0.2 lat | opened |
| N183 |  | Atlas, D. (1953) Optical extinction by rainfall, J. Meteorology 10:486-488, as given in Mulvey, G. J. (1973) The investigation of snowfall r | opened |
| N184 |  | Harper, B. A., Kepert, J. D. & Ginger, J. D. (2010) Guidelines for converting between various wind averaging periods in tropical cyclone con | opened |
| N185 |  | Design: Albert, Nov 5 18:07–18:08: pace by the floor, the weather, mass and gravity, never by the calendar (Pandolf); the effects law, boost | opened |
| N186 |  | Rain classes per MANOBS via Barani Design; Beaufort scale (Wikipedia): Violent rain >50 mm/h (MANOBS, not shown as Met Office); Beaufort 8 g | opened |
| N187 |  | Locatelli, J. D. & Hobbs, P. V. (1974) Fall speeds and masses of solid precipitation particles, J. Geophys. Res. 79(15):2185-2197: Unrimed d | opened |
| N188 |  | Design: Mid's blow, nerve, a soldier's day, squads, formations and muster (16-sim-fight.js fromWhere, hurt, plunder, plunderBld; 14-sim-troo | opened |
| N189 |  | Park, J. L. (2011) Arrow behaviour in free flight, Proc. IMechE Part P: J. Sports Eng. Tech. 225(4):241-252, doi:10.1177/1754337111398542: C | to open |
| N190 |  | Design: Mid's finger, orders, missions and the War Director (26-input.js hitAt, tapAt, picked, setPick, pickToggle, order, boxPick, ordAt, H | opened |
| N191 |  | Design: Albert, Nov 5 (Frankenstein F21+F22, decisions.json): Mid's gameplay and controls come over (one tap picks, a second opens the card; | opened |
| N192 |  | Design: Mid's alarm, danger map and the end (09-nav.js DANGER, discRows, stampDanger, dangerMap, dangerWhy; 12-sim-core.js isThreat, recount | opened |
| N193 |  | Design: Albert, Nov 5 20:16 (Frankenstein F23): keep going; three playability fixes from his phone (everyone idle, three sites never built): | opened |
| N194 |  | Design: Mid's lessons, prisoners, priests, medics, Zeal and spies (11-orders.js teachTo, teachGap, teachCost, teachSecs, schooling, teachWhy | opened |
| N195 |  | Design: Mid's Market, coin, bank and ventures; goods and workshops; trade and caravans (11-orders.js LOT, worth, coinOf, sellPrice, buyPrice | opened |
| N196 |  | Age of Empires II: DE data (SiegeEngineers aoe2techtree data.json): Castle and Wonder 4800, Monastery and University 2100, Market and Blacks | opened |
| N197 |  | openage reverse-engineering, market.md (AoK: gold = (d/size + 0.3) x d x 0.46 + 0.5); AoE2 fandom Trade Cart: Gold almost quadratic in dista | opened |
| N198 |  | Design: Mid's war camps, field traps, relations and diplomacy, vassals and tribute (38-camps.js CAMP_TENTS, campLayout, campFacing, campCell | opened |
| N199 |  | Design: Albert, Nov 5 11:16 (2): vassals pay tribute, the tax rate parked; 11:16 (7): the war camp's wagon in two sizes, small (the outpost) | opened |
| N200 |  | Pseudo-Hyginus, De munitionibus castrorum (trans. at roman-britain.co.uk): Sec. 1: tent holds eight men; century has ten tents, eight pitche | opened |
| N201 |  | Anglo-Saxon Chronicle (MSS C, D, E), 991-1012, via Wikipedia 'Danegeld': 991: 10,000 pounds; 994: 16,000; 1007: 36,000; 1012: 48,000 | opened |
| N202 |  | Design: Mid's computers (17-ai.js bestCounter, timeLeft, rateFrom, goalOf, needOf, runsOut, famineNear, PLOTS, plotPays, think, armyCap, arm | opened |
| N203 |  | Design: Mid's sky, moon and ground (08-core.js moonVec, moonPhase, moonLight, NIGHT_SIGHT, SYNODIC; 37-events.js skyTurn, wxWhy, ruts, rutsA | opened |
| N204 |  | Rosenzweig, M. & Udry, C. (2013) Forecasting Profitability, NBER Working Paper 19334, p. 21: p. 21: forecast-responsive farmer mean profits  | opened |
| N205 |  | Design: Mid's finds, wild guards, drifters, events and hazards (05-rules-wild.js FINDS, WAYFARER_EVERY, WILD_LOOK, NATIVE raids; 14-sim-troo | opened |
| N206 |  | Design: Mid's fire and sickness (36-economy.js fireHeat, FIRE_SMOKE, ignite, strike, lightning, fireTick, sickRisk, outbreak, healthTick; 06 | opened |
| N207 |  | Alsan, M. & Goldin, C. (2019) Watersheds in Child Mortality, J. Political Economy 127(2):586-638, doi:10.1086/700766: Water alone -12.6 log  | opened |
| N208 |  | Design: Mid's view (08-core.js lookout, sightFx, sightClear, visCap, sightOf; 22-view-fog.js knownB, WOODS, woodsGrid, openLine; 20-view-bas | opened |
| N209 |  | Helland, T. (2012) How to Convert Temperature (K) to RGB: Algorithm and Sample Code, tannerhelland.com: All constants match; 1000-40000 K; f | opened |
| N210 |  | NOAA/NCEP operational code CALVIS (rap.v5.1.20, rap_wrfpost.fd/CALVIS.f, nco.ncep.noaa.gov): vis = −ln(0.02)/β; β (km⁻¹) the sum over the hy | opened |
| N211 |  | ITU-R P.840 liquid water content of fog, 0.05 g/m³ (AGI STK help, Rain Models / cloud and fog table, help.agi.com/stk/Content/comm/ITU840-7. | opened |
| N212 |  | US National Weather Service, Houston/Galveston fog guide (weather.gov/media/zhu/ZHU_Training_Page/fog_stuff/fog_guide/fog.pdf): radiation fo | opened |
| N213 |  | Wærsted, Haeffelin, Dupont, Delanoë & Dubuisson (2017), Radiation in fog, Atmos. Chem. Phys. 17, 10811–10835: fog is droplets near the groun | opened |
| N214 |  | WMO-No. 8, Guide to Instruments and Methods of Observation (2018 ed.), Annex 4.B, eq. 4.B.1 (as implemented in NOC AirSeaFluxCode): e_s = 6. | opened |
| N215 |  | USMC MCWP 3-16.6, Supporting Arms Observer, Spotter and Controller (1998), table 2-4 (via generalstaff.org/BBOW/Plans/Visual_Aural_Distances | opened |
| N216 |  | Wikipedia, Daylight, illuminance table: brightest sunlight 120,000 lux, sunrise or sunset on a clear day 400, a full Moon 0.25, a quarter Mo | opened |
| N217 |  | AMS Glossary of Meteorology, 'civil twilight' and 'nautical twilight': End of civil ~3.5-2 lux; end of nautical ~0.008 lux | opened |
| N218 |  | Shlaer (1937) J. Gen. Physiol. 21(2):165-188; Sloan, L. L. (1968) Photopic acuity-luminance function with special reference to parafoveal vi | opened |
| N219 |  | Tirmenstein, D. A. (1991), Quercus alba, in the Fire Effects Information System, USDA Forest Service, Rocky Mountain Research Station (fs.us | opened |
| N220 |  | Design: Albert, Nov 6 14:44–15:06: fog grounded in atmospheric science (CALVIS, the dew point); no fog of war (the land always drawn, anothe | opened |
| N221 |  | Rogers, R. (1990), Quercus alba L., white oak, in Burns & Honkala, Silvics of North America vol. 2, Agriculture Handbook 654, USDA Forest Se | opened |
| N222 |  | Design: Mid's peace and the crowns (39-games.js PEACE, CARE, bestOf, truceAll, truceFor, ageOpen, nextAge, chron, peaceTick, standDown, crow | opened |
| N223 |  | Design: Mid's mail, news and messengers (32-frame.js MSG, GROUPS, QUIET, urgentCls, ccOf, hiddenG, news, DIR8, tell, postTick, say, hushKey; | opened |
| N224 |  | Design: Mid's milestones and tips (32-frame.js MS_TEST, msFill, milestoneTick, goldTight, NEEDS, advise; 26-input.js L, learn, learnAct; 07- | opened |
| N225 |  | Design: Mid's civilisations (04-rules-tech.js CIVS, CIVK, the six unique units, the Hall rows and the six elite ranks; 08-core.js civOf, civ | opened |
| N226 |  | Design: Albert, Nov 6 17:23: the civilisations as Mid had them, if they come clean and within our rules; the Games wait with the Throne; tre | opened |
| N227 |  | Age of Empires forums, 'Creating custom OP civs with Advanced Genie Editor' (guide to the game's .dat file): Most civ bonuses are technologi | opened |
| N228 |  | Design: Albert, Nov 6 16:01–16:07: you start in the corner drawn at the bottom left of the screen, whatever the view's turn; the pocket (Z1) | opened |
| N229 |  | Design: Mid's map character, new game and scenarios (06-rules-tuning.js LAND, SCENARIOS, UI_BUDGET; 07-text.js SCEN_TEXT; 10-world.js newGam | opened |
| N230 |  | Design: Mid's save and safety net (34-save.js saveGame, readSave, keepAside, clearSave, loadGame; 01-rules-basics.js SAVE_EVERY; 41-boot.js  | opened |
| N231 |  | Odum, E. P. (1959) Fundamentals of Ecology, 2nd ed., Saunders (per MLSU e-content notes): Ecotone = transition zone along the edges of two a | opened |
| N232 |  | Design: Albert's play test, Nov 6 19:08–19:11: tapping Build gives the ghost and its guide lines and a tap places it, with no second trip to | opened |
| N233 |  | Dijkstra, E. W. (1959) A note on two problems in connexion with graphs, Numerische Mathematik 1:269-271; 0-1 BFS: cp-algorithms: Citation co | opened |
| N235 |  | Design: Mid's apartment (room 20), quarry (stone 0.45 a second, never runs out, one worker) and castle (dmg 12, bow 140, cd 1.0, h 40) in 03 | opened |
| N236 |  | Design: the A1 speed fix (Albert, Nov 7 06:22): the new-game screen at Mid's speed, no frame over the eye's stutter (Mid runs it at 60 fps,  | opened |
| N237 |  | Arithmetic: 1/60 s = 16.67 ms: 1000/60 = 16.67 ms | opened |
| N239 |  | Design: the A2 gate rules (lead, Nov 7, from the F39 audit): code reads the stats through FK.stat; a shell a table names ticks what the tabl | opened |
| N240 |  | Design: Mid's CLIMATE.noon 0.28 (06-rules-tuning.js), morning light at the start, brought by Albert's flow call, Nov 7 15:44 | opened |
| N241 |  | Design: Albert, Nov 7 2026 14:47-15:46: no status strip, iron stays in the top bar, Map beside mute and pause, the Yard removed (test field  | opened |
| N242 |  | Design: Mid's pocket, 06-rules-tuning.js BACK and HOME (zone 1: AGES[1].cost + 6 villagers' food and 5 houses' wood in 2 bushes and 2 trees; | opened |
| N243 |  | Holle, R. L. and K. L. Cummins, Seasonal Lightning Distributions over North America (Vaisala; NLDN 2005–2014): 64% of the year's cloud-to-gr | opened |
| N244 |  | Design: Mid's HANDICAP (06-rules-tuning.js: blds mill and farm, r 60–170; laid in 10-world.js by findSpot, finished), brought back by Albert | opened |
| N245 |  | Marshall, J. S. and W. McK. Palmer (1948), The distribution of raindrops with size, J. Meteor. 5: rain water content M = 0.072 R^0.88 g/m³ f | to open |
| N246 |  | The inverse-square law of illuminance, E = I ÷ d² (Lambert, Photometria, 1760; any optics text), with the finite-source form E = I ÷ (d² + s | opened |
| N238 |  | Design: SoRen's phone care (soren-archive/index.html: tick() idle and dark frame rates, sound.off() closing the engine when hidden, requestW | opened |
| N261 |  | Human proportion: an adult stands about 7.5 to 8 heads tall, the legs (floor to hip) about half the height (Vitruvius, De architectura III.1 | to open |
| N260 |  | Design: Albert, Nov 8 11:30-11:41 (B16): the land not blocky (coast, beach, cliff); from Gemini's art patch, sun warm and shade cool, stone  | opened |
| N259 |  | Heights in nature: European high forest stands about 20–25 m, woodland edge and coppice 10–15 m; bramble, hawthorn and elder 1–3 m; from mem | to open |
| N258 |  | Design: Albert, Nov 8 08:57 and 10:04 (B13): the real scale, set by the buildings (a house 6 m), people, bushes and rocks drawn at their rea | opened |
| N256 |  | Design: Albert, Nov 8 08:52-08:57 (B12): the tap ring slow; axes swung while walking; more trees, closer to the Town Center, 10-15% more eve | opened |
| N257 |  | Response times: 0.1 s feels instant (Miller 1968; Nielsen, Usability Engineering 1993); touch feedback animations about 200-300 ms (Material | to open |
| N254 |  | Design: Albert, Nov 8 08:02-08:04 (B10): the map fuzzy on the phone; draw it at the phone's own pixels, the ground in chunks as the woods ar | opened |
| N255 |  | WebKit (iOS Safari): total canvas memory is capped (about 384 MB on recent iPhones; one canvas at most 16.7 million pixels); past it canvase | to open |
| N252 |  | Design: Albert, Nov 8 07:26 (bring all of Base's events back): Base's EVENTS, EV and EV_TEXT (base/index.html 5947-5975, 30202-30520, 6909-6 | opened |
| N251 |  | Design: Albert, Nov 8 07:51 (B8): research on every building card and the Hall's three tech slots, as Base's techBtn (base/index.html 23926) | opened |
| N250 |  | Design: Albert's calls, Nov 8 07:26 (B7): Dwelling for the house; Difficulty on the Start card, read at the match's start only; a match open | opened |
| N249 |  | Design: Mid's forest (mid/src/10-world-forest.js, FOREST, TREE, makeForest: lattice 26, ± 6, 375 trees a corner, paths 34 wide, edge 40, the | opened |
| N248 |  | Albedo of natural surfaces: fresh snow 0.80–0.90, grass 0.25, bare soil 0.17 (NSIDC, Thermodynamics: Albedo; Wikipedia, Albedo, table of sam | opened |
| N247 |  | Hecht, Shlaer & Pirenne (1942), Energy, quanta and vision, J. Gen. Physiol. 25: the eye's absolute threshold, a few quanta at the retina, ab | opened |
| N234 |  | Design: Mid's Guide and History (31-guide.js guideModel, HIST_NOTE, HIST_ASK, yearOf, histRows, histText, guideMd; 07-text.js WHY, TRIGGERS, | opened |
| N262 |  | Stefan's law of ice growth, h = α√(freezing degree-days), α about 2.7 cm/(°C·day)^½ for snow-free lake ice and about 1.4 under snow (Lebedev | opened |
| N263 |  | Gold, L. W. (1971), Use of ice covers for transportation, Canadian Geotechnical Journal 8: the bearing capacity of floating ice P = A h², A  | opened |
| N264 |  | Zhang, X., Friedl, M. A., Schaaf, C. B. et al. (2003), Monitoring vegetation phenology using MODIS, Remote Sensing of Environment 84: 471–47 | opened |
| N265 |  | Beven, K. J. and Kirkby, M. J. (1979), A physically based, variable contributing area model of basin hydrology (TOPMODEL), Hydrological Scie | opened |
| N266 |  | Liston, G. E. (2004), Representing subgrid snow cover heterogeneities in regional and global models, Journal of Climate 17: 1381–1397: snow  | opened |
| N267 |  | Cole, D. N. (1987), Research on soil and vegetation in wilderness: a state-of-knowledge review, USDA Forest Service INT-220; Cole, D. N. and | opened |
| N268 |  | Matérn, B. (1960), Spatial variation, Meddelanden från Statens Skogsforskningsinstitut 49: the cluster process, parents scattered at random  | opened |
| N269 |  | Lobell, D. B. and Asner, G. P. (2002), Moisture effects on soil reflectance, Soil Science Society of America Journal 66: 722–727: soil darke | opened |
| N270 |  | Mandelbrot, B. B. (1982), The Fractal Geometry of Nature (Freeman): natural surfaces as sums of octaves whose amplitude halves as their freq | opened |
| N271 |  | Weaver, T. and Dale, D. (1978), Trampling effects of hikers, motorcycles and horses in meadows and forests, Journal of Applied Ecology 15: 4 | opened |
| N272 |  | Horn, R. and Fleige, H. (2003), A method for assessing the impact of load on mechanical stability and on physical properties of soils, Soil  | opened |
| N273 |  | Muir, R. (1998), Tactics and the Experience of Battle in the Age of Napoleon (Yale): infantry caught by cavalry before it had formed square  | to open |
| N274 |  | Farrell, G. and Pease, K. (1993), Once Bitten, Twice Bitten: repeat victimisation and its implications for crime prevention, Home Office Cri | to open |
| N275 |  | US Army Regulation 40-25 / OPNAVINST 10110.1 / AFI 44-141 (2017), Nutrition and Menu Standards for Human Performance Optimization: the Milit | to open |
| N276 |  | Mourtzoukou, E. G. and Falagas, M. E. (2007), Exposure to cold and respiratory tract infections, International Journal of Tuberculosis and L | to open |
| N277 |  | US Army FM 31-70, Basic Cold Weather Manual (1968): cold weather degrades morale and the will to fight, and leaders must counter it with she | to open |
| N278 |  | Ebbinghaus, H. (1885), Über das Gedächtnis (Memory: a contribution to experimental psychology): retention falls steeply at first and then sl | to open |
| N279 |  | US Army FM 21-18, Foot Marches (1990): 4 km/h on roads against about 2.4 km/h cross-country, 60%; The Dupuy Institute (2018), The Combat Val | to open |
| N280 |  | Xenophon, Anabasis (c. 370 BC): the Ten Thousand took guides to cross Kurdistan and Armenia (Books III-IV); the Peninsular War (1808-1814):  | to open |
| N281 |  | US Army FM 21-75, Combat Skills of the Soldier (1984), chapter 3, individual movement: the low crawl and the high crawl, slow and deliberate | to open |
| N282 |  | Design: Albert, Nov 9 2026 08:28-09:08 (talk mode; docs/4 Now/Next build list.md items 4, 5 and 8): rain and snow are never switched off, a  | opened |
| N283 |  | Design: Albert, Nov 9 2026 07:20-12:23 (docs/4 Now/Next build list.md items 1, 2, 3, 9, 11): the type rule, menus as bottom sheets over the  | opened |
| N284 |  | Design: Albert, Nov 9 2026 12:03-12:19 (Next build list item 12): the progress ring and the colour map; Brysbaert, M. (2019), How many words | to open |
| N285 |  | Design: Albert, Nov 9 2026 12:57-13:27 (Next build list item 13): menus all solid, no glass; one card, the seams filled; the title always ba | opened |
| N286 |  | Design: Albert, Nov 9 2026 12:57-13:27 (Next build list item 13, N5): New game one line each, the World row gone, the side's words to the he | opened |
| N287 |  | Design: Albert, Nov 9 2026 18:09-19:37 (Next build list item 14 and the OPEN list, N6): his play notes; the v80 card he called sharp (first  | opened |
| N288 |  | Design: First Keep v80, Build 40 and 44 (the root index.html, showStrip and sendPick): a tap on open ground opens a small strip at the finge | opened |
| N289 |  | US Army FM 21-18, Foot Marches (1990), the rates of march by ground: cross-country and wooded ground far slower than a road (from memory: ab | to open |
| N290 |  | Bergström, B., FOV using recursive shadowcasting (RogueBasin, 2001) and StarCraft II's fog of war (Blizzard, 2010): a map of tiles per side, | to open |
| N291 |  | Roach, W. T., Back to basics: Fog (Weather, 1994-95): radiation fog is a shallow layer over the ground, commonly tens of metres to a couple  | to open |
| N292 |  | Soule, R. G. and Goldman, R. F., Terrain coefficients for energy cost prediction (J. Appl. Physiol. 32, 1972): the terrain factor eta in the | opened |
| N293 |  | Atkinson, M. P. (Naval Postgraduate School), on Lanchester's laws (opened Nov 9 2026): Lanchester's ancient model, a series of one-on-one du | opened |
| N294 |  | A line through a random stand of trunks is blocked with chance 1 - e^(-n d L) (the mean free path; Beer-Lambert for obstacles): n stems a sq | to open |
| N295 |  | Poisson-disk sampling: Cook, R. L., Stochastic sampling in computer graphics (ACM Transactions on Graphics 5, 1986; blue noise, as the cones | to open |
| N296 |  | Teschner, M. et al., Optimized spatial hashing for collision detection of deformable objects (VMV 2003): the primes 73856093 and 19349663, s | to open |
| N297 |  | Varnish: a clear coat fills a surface’s roughness, so less light scatters off the top and the colours under it read deeper (the conservator’ | to open |
| N298 |  | Roberts, M., An improved version of Bridson's algorithm for Poisson disc sampling (Extreme Learning blog, 2019): candidates thrown on a thin | to open |
| N299 |  | Google, web.dev, Measure performance with the RAIL model: a frame at 60 fps has about 16 ms, of which the browser needs some, so the page ha | to open |
| N300 |  | Alex Walker, The Cicada Principle and Why It Matters to Web Designers (SitePoint, 2011): tiles of prime-numbered sizes laid over each other  | to open |
| N301 |  | Albert, Nov 10, 2026, on the ground: four sheets (water, sand, dirt, grass), lakes rivers streams and marshes a cut through them; grass most | opened |
| N302 |  | Albert, Nov 10, 2026, 09:45 and 10:16 (#38, a match lost when Safari's back swipe loaded the previous seed): saves as top games do them, rol | opened |
| N303 |  | USDA NRCS Conservation Practice Standard, Pond (Code 378), 2022: embankment side slopes two horizontal to one vertical or flatter; excavated | opened |
| N304 |  | Albert, Nov 10, 2026, 10:00 (N13 notebook answers, yes yes 10:16): #1 the grass pattern, #2 and #3 lakes' slopes and pixelated water, #4 the | opened |
| N305 |  | A. Hurwitz (1891), Ueber die angenaeherte Darstellung der Irrationalzahlen durch rationale Brueche: the golden ratio is the number worst app | to open |
| N306 |  | Albert, Nov 10, 2026, 10:00 and 10:12 (N13 notebook answers) and 11:32 ('Just do it all'): builds 2 to 4. Menus: title on the card with no b | opened |
| N307 |  | Albert, Nov 10, 2026, 12:26 (N17: his N15 notes answered on the N15 Answer Sheet) and 12:38 (\Build N17 yes yes\; minus frees a villager): t | opened |
| N308 |  | Base (preview 49) and Mid, the cost line: costCol(fr) = grad(fr >= 1 ? 0.55 : fr - 1), red at nothing, white near enough, light green (0.55  | opened |
| N309 |  | Xia, X. and Zhang, P., Flickering of buoyant diffusion flames: a vortex dynamics revisit, arXiv:1803.10400 (2018): the flicker of a buoyant  | opened |
| N310 |  | CIGRÉ Technical Bulletin 549, Lightning Parameters for Engineering Applications (2013, project team headed by V. A. Rakov; slides by M. Mayt | opened |
| N311 |  | The 24-hour clock: a day of 24 hours, each of 60 minutes (ISO 8601 time of day); from memory, to open | to open |
| N312 |  | Proxemics (Psychology Wiki, Fandom), after Edward T. Hall (1963; The Hidden Dimension, 1966): intimate 15-45 cm, personal 45-120 cm, social  | opened |
| N313 |  | Albert, Nov 10, 2026, 14:47-15:07 (notebook page N17, his N18 list) and 15:32 \Go\: build 1 of N18, the menus: #1 pills keep their curves, # | opened |
| N314 |  | Albert, Nov 10, 2026, 14:47-15:30 (his N17 notebook page and the fire talk: a big bright campfire by a drop-off where villagers work, the ar | opened |
| N315 |  | Albert, Nov 10, 2026, 16:54 \Sure\ on build 3 of N18 and 16:55 \A is fine for now\ (the aimer mock): #15 a plain aimer, #22 zoom weird and s | opened |
| N316 |  | Albert, Nov 10, 2026, 18:16-18:22: days move too fast, the map too small (a: enemies too close), the day doubled to 240 for now, the world t | opened |
| N317 |  | Albert, Nov 10, 2026, 18:23 (a lot more trees), 18:27 (the two top rows in the footprint of one), 18:55 (\Go for all\: nerve, the rallied, m | opened |
| N318 |  | Albert, Nov 10, 2026, 18:56-18:59 (the game too slow on his phone; the most expensive things on a frame) and 19:22: \I would do 2-5 and let' | opened |
| N322 |  | Albert, Nov 11, 2026, 09:28-09:52 (N24): \The fix is go to where I tap. Period.\; selection kept; the clock to the sun; dusk and dawn as lon | opened |
| N323 |  | Fritsch, F. N. and Carlson, R. E. (1980), Monotone piecewise cubic interpolation, SIAM Journal on Numerical Analysis 17(2): 238-246 (from me | to open |
| N324 |  | British Agricultural Revolution, Wikipedia, table: crop yield net of seed, bushels/acre: wheat 8.71 (1250-1299), 8.24 (1300-49), 11.36 (1650 | opened |
| N321 |  | Albert, Nov 11, 2026, 05:50: the pace meter showed off screen on his phone: \Center it\ | opened |
| N320 |  | Albert, Nov 11, 2026, 05:05 \Build n23 as we are planned\: Gemini audit 2's fixes (the sprite cache kept by last use, sight from finished bu | opened |
| N319 |  | Albert, Nov 10, 2026, 20:03-21:10 (the dashed ring; still things not redrawn, option B) and 22:47 \Go for them all\ on Gemini's audit fixes  | opened |
| N325 |  | Albert, Nov 11, 2026, 16:15-20:02, in chat: the Controller (three pads of four, one box each with inset dividers, small round buttons over t | opened |
| N326 |  | Albert, Nov 11, 2026, 22:14-23:56, in chat, after his first win by conquest on N25 (184:53): the phone ran hot and froze (\Biggest issue. Ru | opened |
| N327 |  | Day for night, Wikipedia (opened Nov 12, 2026): a night scene shot by day is typically underexposed by about two stops with a blue tint adde | opened |

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
| C15 | The sky: the band by the hour and the weather, its clouds, the frost's cast (Mid's SKY, drawSky, WX_TINT); and the glass's washes, laid at their strength: wet ground's dark, a flash, rain's gloom, the white veil, dusk's glow, night's blue, fog, a shadow (v100's own, moved here from the code) | {day: #78aae1, dusk: #eb9650, night: #101630, rain: #78828f, storm: #323846, blizzard: #cdd2dc, frost: #b9cde6, cloud: #f5f8fc, cloudDark: # | N203 |
| C16 | The ground's memory, each with its strength: worn earth, where one fell and a blade's cut, a strike's scorch, a crack, burnt ground and rubble (Mid's scar paints) | {wear: #7660404d, fall: #28120c38, cut: #3c2d1e80, strike: #14100c59, crack: #160f0a80, burn: #19141261, rubble: #5f5a548c} | N203 |
| C17 | Ripples on the lakes and rain rings on the ground, with their strength (Mid's); the falling rain and snow on the glass (SoRen's, its strength in the weather's drops) | {ripple: #dcf0ff47, ring: #d7e6f54d, rain: #cde8fa, flake: #f5f8fc} | N203; N282 |
| C18 | The wild's: a den's mound, a fallen star's stone and glow, quicksand on the ground, a fire's smoke and a falling star's streak (Mid's drawFind, drawSand, blaze, the meteor) | {den: #4a3a2a, stone: #5c5a60, star: #fff0c8, sand: #c8a8648c, smoke: #3c38348c, streak: #fff0c8e6, aurora: [#5effa0, #6fe0b0, #8a7cff], cle | N205; N206 |
| C19 | The lights and theatrics (Mid's drawLight, flame, celebrate, drawFlash): a lit window, a flame's white heart, an open flame's white-hot core (Albert, Nov 10, the fire mock), the flash, a ripple for a finished building and for a new age | {window: #ffc86e, heart: #fff5d9d9, core: #fff0c8, flash: #fff6dc, done: #ffd35e, big: #fff3c4, shadow: #000000} | N208 |
| C20 | Building and figure dressing (Mid's drawBld, smoke, flagsOn, PILE, pileArt, drawUnit, idleMark): stakes, posts, the site's bar, smoke, the outline, the marks' gold and their shade, the rout badge, the nerve bar, the piles | {stake: #d8c79c, post: #b8955a, bar: #e6b947, smoke: #d7d7d2, line: #100c08bf, mark: #ffd35e, shade: #000000b3, rout: #d8432f, white: #fffff | N208 |
| C21 | The small map and the map's labels (Mid's drawMini, miniIncoming, tag): an outline, the view box, the incoming army's ring and its low beat, the whiteout, a find, a label's pill | {line: #00000099, view: #ffffff, inc: #ff3b2f, incLo: #ffd0c8, white: #ebf0f5eb, find: #f2cf55, pill: #121715eb} | N208 |
| C23 | the ground's small things: the foam on the water's edge; the play edge's dashes; a stone's own tint in a wall, and the damp moss at a wall's foot | {snow: #eef3f6, ice: #dce9f2, crack: #4a6a86, rim: #9fb2c2, foam: #eef6ffa0, stone: [#fff5dc18, #140f0a1a, #6e5f4b14], moss: #364e2250, clea | N260 |
| C24 | the ring at a unit's feet, full and bright (Albert, Nov 8 13:38): green picked (tapped, boxed or in a picked group), blue working, yellow idle; a foe's ring its side's colour, the wild white | {pick: #21e05a, work: #2f8cff, idle: #ffd21f, wild: #ffffff} | N145 |
| C25 | the flowers' petals and eyes, the pebbles, a pebble's shadow and shine (N11: the meadow's season and wet colours cut for the paper ground) | {flowers: [[#f4f0e0, #f2d23a], [#e8c23a, #c89a20], [#d8443a, #2a1a10], [#6a7ad8, #e8e0c0], [#b06ac0, #f0e0f0], [#a08a5a, #6a5a3a]], pebbles: | N264; N268 |
| C28 | the brown ladder: the tray under a ribbon, the box, a raised box, each a step of x = (17, 12, 9) above the last (Albert, Nov 9 11:16) | {tray: #221811, box: #33241a, lighter: #443023} | N283 |
| C29 | gunmetal (S1): the queue, the help line, the research boxes (Albert, Nov 9 10:45-11:22) | #2c3238 | N283 |
| C27 | the progress rings, one colour a kind of work (Albert, Nov 9 12:03-12:19): white the age-up and info; red war; green people and economy; brown building (the wood colour); gold money; blue knowledge, sight and relations; a research takes its family's colour, brown when it strengthens a building; dim = the colour mixed share into the tray brown (C28); replaces the research tints (C26) | {colour: {white: #ece5d3, red: #a3262a, green: #5fd08a, brown: #c08a58, gold: #e6b947, blue: #2f8cff}, family: {economy: green, health: gree | N284 |
| C31 | the fog of war's veil: the near-black green of a moonless meadow (Albert, Nov 9 item 6) | #0b0f09 | N290 |
| C33 | the paper ground (N11, Albert Nov 10): grass is a light neutral that the season colours; wet sand at the waterline; three sheets of water, shallow to deep; the season: light spring green, emerald, dark green, dull green (fall), greyer dull green (winter), back to spring (grass is mostly evergreen); a sheet's thin shadow; the blades' dark and light inks (v80's); reeds; glints | {grass: #f4f2ea, wet: #a8976a, water: [#3d86a8, #2a6488, #1a3f58], season: [#8cc63f, #3d7a36, #2c5a2a, #6f7a3e, #69714f, #8cc63f], shadow: # | N301 |
| C22 | a carried bundle by its store: meat and berries red, logs brown, stone grey, gold, iron steel; its outline ink (Albert, Nov 10, #35) | {food: #b0413e, wood: #8a5a32, stone: #9a9488, gold: #d8b23a, iron: #6c7a86, ink: #1a140e} | N306 |
| C34 | the cost line on one ramp, as Base and Mid: short of it, red at nothing to white as you near it; enough, white the enough share of the way to green (Albert, Nov 10, N17 #13) | {enough: 0.55} | N308; N307 |
| C35 | the three lines of a lightning bolt, glow, mid and core, and the glow at its foot (Base and Mid; Albert, Nov 10, N17 #15) | {lines: [170,200,255, 210,228,255, 255,255,255], foot: 220,235,255} | N145; N307 |
| C36 | how much of a colour stays when it is dimmed or made faint, per cent of the mix (moved from the code in the N17 audit) | {dim: 80, faint: 35} | N306 |
| C37 | the Controller's pads, each its zone's colour at four fifths so a little of the board shows and the colour stays true over any ground (town brown, command blue, war red); the round buttons' glass and edge; a pad's inset dividers; Execute once an order is ready; a pad's dark edge (Albert, Nov 11 19:46-19:56) | {brown: #33241acc, blue: #222e42cc, red: #a3262acc, glass: #ece5d329, edge: #ece5d36b, line: #ece5d34d, go: #2f7a4cd9, ink: #00000066} | N325 |

## comments

| Code | Name | Value | Cited |
|---|---|---|---|
| E687 |  | past the lane beside a building, the next ring a pace further out, as many rings as the most people need (Mid's spot further out): every pai |  |
| E688 |  | a computer's soldier holding a choke whose time is up, or sent to help an ally and still there D285's stay s, goes back to the pool for the  |  |
| E689 |  | the tops are made again when a building is finished or lost: a building blocks sight only once it stands finished (N23, Gemini audit 2: a si |  |
| E690 |  | the dice can tell and set where they are, so a save opened rolls on as it would have |  |
| E691 |  | a captive is taken alive: gone from the field with no corpse, no killer and no blow to anyone's nerve; who aimed at it looks again |  |
| E693 |  | the arguments the cells point at are made again with each render, so the table holds only what is on the screen |  |
| E694 |  | a unit's row of numbers with its side's research applied, kept until the research changes: code reads the stats through here, never the raw  |  |
| E695 |  | at rest (paused, a full-screen page, the end) the world draws D340's idle frames a second, as SoRen does; paused, time stands still |  |
| E696 |  | the screen stays awake while a match runs; let go when paused, at rest or hidden; a browser without the lock plays on |  |
| E697 |  | the page hidden, the sound engine is suspended and resumed on return (was closed, as SoRen's sound.off, which left the game silent until the |  |
| E698 |  | a draw-level change redraws the canvas at its new sharpness; only a real change of the window's size refits the camera, so the view never ju |  |
| E699 |  | the ghost carries its own label on the map, as Base and Mid: its name and price where it fits, else why not; the player never has to look do |  |
| E700 |  | only a touch on or near the ghost moves it; a touch away from it falls through to the camera, so the player can look around while placing (M |  |
| E701 |  | the top bar's cells by the Screen book: pause and the small map are live controls; a cell that does nothing is not shown (Base's bar had non |  |
| E702 |  | pause stops the clock and opens the Pause screen; the same cell resumes |  |
| E703 |  | New game asks twice, so a stray tap cannot end a match; then the Start sheet |  |
| E704 |  | the two base rows as Base has them; War is Mid's one red button on the rank above the rows, at the right, shown only over the open map, its  |  |
| E705 |  | a hazard switched on adds its points to the level (the measure book's hazards.pts); the Start sheet's picks are a setting, copied into the m |  |
| E706 |  | as Base (Albert, Nov 7 20:48: all Base): a pause has no page, it drops the speeds, New game and the volumes under the pause button and says  |  |
| E707 |  | while a tall sheet (the Start page) is open, messages wait in the post and come out when it closes, so none covers the sheet (Base's land ca |  |
| E708 |  | a shell's ticks as a Set, built once from the Shells book: has() is asked hundreds of thousands of times a second, and a Set answers in one  |  |
| E709 |  | the buildings as their own list, a derived index of things rebuilt only when things change (TV, the things version): buildings are a few doz |  |
| E710 |  | a new building slides into the things list at its depth instead of re-sorting ten thousand things, which was a felt hitch every time anyone  |  |
| E711 |  | the pocket as Mid's (QCS): zone 1's need from the age's price and the first villagers and houses, the home finds by their piles and amounts; |  |
| E712 |  | the computers' first buildings (D342), standing and free when the match begins: Mid's handicap for a player that plays worse than a person;  |  |
| E713 |  | visibility by CALVIS alone (QK): rain and snow enter as water content, rain by Marshall–Palmer, snow by its fall speed, so the three haze te |  |
| E738 |  | a building's research on its card: the next step of each of its lines, as Base's card (the Town Center's next age first) |  |
| E739 |  | research, as Base's techBtn: its name and cost; a step that cannot start says why on the button in place of its price (its age, the step bef |  |
| E740 |  | a building's lines, each as its next step to learn (none when the line is done); another people's lines are left out |  |
| E748 |  | the ground painted once into the whole picture: tiles, faces, contours, reeds; its grass also onto the season sheet, which is the blades' ma |  |
| E749 |  | the cache budgets for what is drawn once and kept |  |
| E751 |  | the ground: nothing before the land is made, then its shapes replayed under the camera at every zoom |  |
| E753 |  | a figure that moved this step walks; it swings its tool only standing at its work |  |
| E754 |  | a drawing's size in the world comes from its body's real height in the Mass book: the art is measured once and drawn so it stands that tall |  |
| E755 |  | how tall a drawing is: from its first to its last painted row |  |
| E756 |  | the figures' scale: a villager's body height over its drawing's, one for every figure (riders, animals and engines are drawn at the same art |  |
| E757 |  | a find's scale: its body's height (tree, bush, outcrop) over its own drawing's; a find with no body is drawn as the figures are |  |
| E758 |  | a tile's flat colour by what lies there; its light is the meadow layer's (D353), smooth across the tiles (N11: a marsh is shallow water; the |  |
| E759 |  | the shore and the strata as contours: between four tiles' middles the lowest band is laid, then each higher band above its level, so the coa |  |
| E760 |  | a stone wall laid course by course, each stone with its own faint tint |  |
| E761 |  | damp moss rising from a wall's foot, fading upward |  |
| E766 |  | the ring at a unit's feet, full and bright: green picked, blue working, yellow idle (yours); a foe's its side's colour, the wild white (the  |  |
| E767 |  | a grid cell's key is a number, row times the land's width plus column, not a string: no text built on every lookup |  |
| E768 |  | the board point of each tile's middle stepped across the square, not turned afresh for every tile (a stamp of a tower's reach turned a thous |  |
| E769 |  | a research's needs worked out once and kept: the Tech book does not change in play |  |
| E770 |  | the pace meter: frames a second and the ms a frame spends on logic and on drawing, averaged over tau s, shown with the Yard's P |  |
| E772 |  | every tap on the map sounds once, by what it did: a pick the unit's voice, an order the go, a double tap the open chime, a wall's point the  |  |
| E773 |  | the trees as a cast: twelve kinds from the Sprites book (PT1), each a few variants by its own seed; a crown is leaf dabs inside its outline, |  |
| E774 |  | which kind a tree is: weighed by where it stands (wet low ground, the plain, the hills), one roll picks the kind and its variant |  |
| E775 |  | a pond's bank: a short fall to the water on every side, the water filled near the brim (no cliff sides) |  |
| E776 |  | water cells traced like the land: each depth band of the water drawn along its contour, so the shallows and the deep meet in curves, not til |  |
| E777 |  | a tree's leaf stage: the year's place in seasons, each tree a little later or earlier by its own seed (lag) |  |
| E778 |  | every leaf a tree could hold is placed first, each with its own draw; the ones under the share kept are drawn, so a crown fills in spring an |  |
| E779 |  | the contours painted band by band over the whole piece of land, lowest first, so a band laid in one cell is never painted over by the lower  |  |
| E780 |  | the ice masks, one a step of depth: a lake's water of depth d belongs to step d ÷ the lake's depth (D27) of D350's steps |  |
| E781 |  | the ice drawn: the mask of the deepest step frozen so far, over the water |  |
| E782 |  | each water cell adds its shallow part to every step's ice path and its land part to the land path; one fill each, so no seam shows |  |
| E783 |  | a pond's water marks the lake's radius on each of its tiles (for how late it freezes); a brim pond marks its bank, drawn as grass to the wat |  |
| E784 |  | the ice's thickness on a tile by Stefan's law from the degree-days past that tile's onset (or past the day a hole broke it), thinner growth  |  |
| E785 |  | who may step on ice: yours unless told to go around; the computer and the wild only where the ice holds several of them at the safe load |  |
| E786 |  | your crossing for a unit: its own, else the one you chose to remember for this winter or this game, else normal |  |
| E787 |  | stepping from land onto the ice keeps the crossing: wait for an answer; one at a time waits while others of yours are on the ice; file and t |  |
| E788 |  | the thinnest ice on the way of the units asked about, and what it holds safely |  |
| E789 |  | clear off: everyone of yours on the ice goes to the nearest land |  |
| E790 |  | each beat the ice under every loaded tile of deep water is weighed (a thaw leaves them on ice too thin to hold anyone): over the safe load i |  |
| E791 |  | the holes and the cracks drawn over the ice: a hole open water ringed with broken edge, a crack's rays growing over the warning |  |
| E792 |  | the ice card's answers: a way to cross for the units asked about, remembered for this winter or this game if picked; go around orders them a |  |
| E793 |  | the ice card: what the thinnest ice on the way holds, the six ways, remember |  |
| E794 |  | an order whose way crosses ice asks how to cross, unless a remembered answer stands; they wait at the shore meanwhile |  |
| E795 |  | ice cracking under yours: the warning said and a clear-off button beside it until all of yours are off the ice |  |
| E796 |  | one who falls through the ice is lost, as any death, and leaves no body on the ice (under) |  |
| E797 |  | a frozen lake under snow: white as the land, with wind-scoured streaks of ice and a rim line at the shore, so it still reads as a lake; made |  |
| E763 |  | a figure's lines in its own darker shade, never black: while a figure is painted (RIM), a stroke asked in ink takes the fill's shade, or a s |  |
| E764 |  | the person's cut: anchors at the shoulder, hip, hem, ground and face; the tunic, robe, armour, apron, hair and coif drawn as curves from the |  |
| E762 |  | a person in true proportion: long legs, a torso, a small head, a slim build, from the Sprites book; the head and its helm drawn smaller abou |  |
| E741 |  | an event's knobs (damage, speed) while it runs, and how far through it is |  |
| E743 |  | the mirage: an army seen on the small map ahead of your Town Center toward the middle, told with its square; at its end, told it was not the |  |
| E744 |  | the circus crosses the land like the wagon; a villager near a performer is cheered and gathers more for a while |  |
| E745 |  | the aurora: curtains of green and violet over the top of the glass, swaying unless motion is stilled |  |
| E746 |  | an event with its own picture draws it over the map |  |
| E747 |  | the mirage's dots on the small map, in the colour of what is coming |  |
| E737 |  | the help line under the top bar (Albert, Nov 8: one place the eyes always go): every message lands there, gold while fresh (D.toast s) then  |  |
| E736 |  | the Home button stands at the rank's left whenever the Town Center is off the screen, and takes the camera home (Base, item 15) |  |
| E735 |  | the hammer carries the receding brown ring for every site going up (the mean of their progress; Albert, Nov 10, #21: the Build button is the |  |
| E734 |  | a yield's first age is the earliest age of anything that costs it (units, buildings, research, the ages themselves), Base's firstAge; a job  |  |
| E733 |  | the Controller's top row (Albert Nov 11, N325: 'small, small, clean'): glass circles sitting over the pads. Left: Home (back to the hall), B |  |
| E732 |  | the Mail door on the top bar with its unread count opens the Mail card: the messages newest first, each with its group, a tap on one with a  |  |
| E731 |  | the Controller's parts (Albert Nov 11, N325): its words J50, its sizes SN41, its thin icons SN42, its tints C37; 'soldiers' are the picked t |  |
| E730 |  | the Build card as Base's: opening it reads the middle of the view and opens the tab of what fits there, marked blue with Fits here; a second |  |
| E729 |  | the sky's washes (the dusk glow, the night blue, fog, rime, the flash, the visibility veil) are composed into one colour and laid in one pas |  |
| E728 |  | a close bolt startles as Mid's did: the picture whites to its flash (D113 flash), the ground shakes (the jolt, D113 shake), the thunder foll |  |
| E727 |  | a blow from beyond melee reach (D.flanking.melee, the combat book's own line) is a missile: its hit is the arrow's sound, as Base's (the Nov |  |
| E726 |  | the place bar says what Base's said (J34): where to press, then the name with 'tap Build, or drag it to move', the pieces of a line; Build a |  |
| E725 |  | the finger's target is lift px a zoom ABOVE the figure's foot, its body; the sign was turned, so the target sat below the feet and a tap on  |  |
| E724 |  | a picked villager's bar on the rank, as Base's selection bar (Albert's Base screenshots, Nov 7 20:38): 'n picked' and the cross that lets th |  |
| E723 |  | the sound engine is woken the moment it is made: a phone makes it asleep until a gesture resumes it, so the first taps were silent |  |
| E722 |  | zero and one are named from the count row (D346), no longer borrowed from the hazards' base |  |
| E721 |  | the path search keeps its working memory between searches (typed arrays stamped by a search number, a heap in two arrays): no Maps, Sets or  |  |
| E720 |  | the forest is Mid's (D345, N249): a jittered lattice scored by an organic field, thicker away from home, the best trees kept, three winding  |  |
| E719 |  | rain and snow are drawn on the glass, as Mid's: the biggest drop crosses the screen at glass px/s whatever the zoom, the rest by their real  |  |
| E718 |  | the Start sheet as Base's: the Start button one slot tall, the people's blurb two lines (the unit and its wonder; the history stays in the G |  |
| E717 |  | the eye sees the ground's light, not the sky's: the lux × the albedo of what covers the ground, snow four times grass (D117 albedo, N248), b |  |
| E716 |  | the guide lines, Base's PDF guides (Build 63; Albert, Nov 8: locked): a dashed line along the board's rows (the land turned a little, so the |  |
| E715 |  | the loop as Mid's (41-boot frame): the world steps at a fixed rate (D343) however the frames come, catching up at most catchup steps; a fram |  |
| E714 |  | the glow's gradient is the inverse-square law itself (QCU), sampled at falloff stops, instead of two guessed stops |  |
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
| E23 |  | a spot in a corner's own frame (u along one edge, v along the other), the frame turned with its corner, the same in all four (L12) |  |
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
| E42 |  | QBJ the pocket's store, one age up calculated (D62: the age's price, the villagers and the buildings at their costs, with the margin); a kin |  |
| E43 |  | what stands on each tile, and the shells themselves |  |
| E44 |  | the free tile nearest a spot |  |
| E45 |  | a shell on a tile; its stand wanders within the tile by D82 on the dice, so no wood is a grid |  |
| E46 |  | the n free tiles nearest a spot: a grove (marked as woods, the trees follow) or a berry patch |  |
| E47 |  | The home finds: Who every corner · What the pocket's berries, grove, gold and stone at D70's spots, sized by QBJ; Z3's finds (D65) at three  |  |
| E48 |  | Z4's finds: Who the map · What piles of gold, stone and iron, berry patches, and the gifts: ruins, cemeteries, campfires, treasure · Where Z |  |
| E49 |  | The trees: Who every tile of woods (TF1, and the groves) · What one tree, its stand, size and shade · Where its tile · When the map is made  |  |
| E50 |  | drawn back to front |  |
| E51 |  | a tree with trees on all eight sides is deep: nothing can stand between it and its neighbours, so the deep woods are painted once a chunk (s |  |
| E52 |  | 0 water, 1 sand, 2 dirt, 3 grass; bare dirt again high over the land (D23) |  |
| E53 |  | the first band is what can be waded (D24) (N11: three sheets of water, shallow to deep) |  |
| E54 |  | the forest floor: the grass, shaded; the marsh: the grass, toward the water (N11: the paper sheets from the waterline up: wet sand, sand, th |  |
| E55 |  | what a face shows between two heights (L1): the grass is the land's top skin; anything raised above it shows bare earth |  |
| E56 |  | Drawn once in the view frame: every tile a lifted quad, a face where it steps down toward the camera. Then every frame is one picture, moved |  |
| E57 |  | the masks at a quarter scale: the land in white and in shadow, the inland water |  |
| E58 |  | a quad a, b, c, d (top-left round to bottom-left on the screen) grown half a pixel right and down, so the next tile's edge lands on solid pa |  |
| E60 |  | the ground is painted flat; the light stands high to the left and in front and the meadow layer lights it (D353 lit): ground leaning that wa |  |
| E61 |  | runs: flat tiles of one colour in a row drawn as one quad (no seams, few fills) |  |
| E62 |  | faces: the +y edge and the +x edge face the camera (the turn is under 45°) |  |
| E63 |  | The view (layer 140): one camera, drag to pan, pinch or wheel to zoom; the overlays are drawn each frame over the one picture. |  |
| E64 |  | (the Pace meter starts on when the page is opened with ?fps, so a phone can show it: Albert, Nov 10 20:02) one flag a layer code (the panel, |  |
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
| E87 |  | inland water bearing ice (QQ): walked as if flat; ice bears where its depth step is behind the walking front (K.iceOn) |  |
| E88 |  | the pace's books (QCB): its states and Pandolf's coefficients (D224), the friction a step needs (G9), slipping (G10); the player's side, tol |  |
| E89 |  | QBL A* over the tiles, the eight ways of D198, straight 1 and diagonal √2, the heuristic the octile distance (N74). goal(k) says when a tile |  |
| E90 |  | most: the tiles it may open before giving up |  |
| E91 |  | the tiles one step from a tile, by the eight ways of D198, that a walker may step to (walkable, within the slope); no cutting a corner; the  |  |
| E92 |  | a unit on a tile; its stand wanders in the tile (D82) |  |
| E93 |  | a path of one tile (already there) walks to its middle: no step past the end |  |
| E94 |  | to a tile |  |
| E95 |  | to a tile beside one |  |
| E96 |  | the one distance and the one nearest search; the drop-off for a yield is the side's nearest building that takes it in (SC Drop-off, B's fift |  |
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
| E989 |  | the picked bar acts on the picked soldiers only and says what it did (Mid's phold, precall; Albert, Nov 11) |  |
| E990 |  | the clock reads the sun: the day's noon (D341) shows 12:00 (Albert, Nov 11) |  |
| E991 |  | the light between the ramp's points: a cubic Hermite with Fritsch-Carlson slopes, flat at both ends, so dusk and dawn fade without a corner  |  |
| E992 |  | a computer's side sees in a plain circle of its sight: it knows what is there, no rays through woods and hills (Albert, Nov 11; the late gam |  |
| E993 |  | the save lives in the phone's IndexedDB (hundreds of MB, the browser's own big store), mirrored in STORE so reading is instant; the small lo |  |
| E994 |  | an old save left in localStorage moves to IndexedDB once, and every First Keep key there is cleared to free the site's small store |  |
| E995 |  | the newest tab owns the save: a tab told another has opened pauses and stops saving, so two tabs never write over each other (Albert, Nov 11 |  |
| E996 |  | the Stores card (Have, In, Out, On it over the last minute) and the Score card (each side's parts), opened from the top bar's stores and sco |  |
| E997 |  | a book over each of your finished, idle buildings with research you can start now, looked for once a second (Base's mark; Albert, Nov 11) |  |
| E998 |  | shedding (fewer drops, then 30 fps, then a lower resolution) is timed on the drawing alone: logic time had pushed his phone to half resoluti |  |
| E124 |  | light by the sun's height, the twilights at −6, −12, −18 (SoRen's ramp, QD) |  |
| E125 |  | QP the one first-order lag, x to its level L over τ: x(t) = L + (x0 − L) e^(−t/τ) (N16; Mid's relax: wetness here, and the market, nerve, he |  |
| E126 |  | QH the rain: a two-state chain, drawn once a game hour (a day's 24th): P(wet / dry) and P(wet / wet) are D102; a wet spell draws its intensi |  |
| E127 |  | the season's mean, eased into the next |  |
| E128 |  | what falls |  |
| E129 |  | rain and snow come and go over tens of seconds (SoRen), toward the spell's intensity |  |
| E130 |  | QP settle: wet in D104, dry in D105; melting snow soaks the ground as rain does (Mid: what melts goes into the ground's water; nothing vanis |  |
| E131 |  | QO degree-day melt, rain on snow twice as fast |  |
| E132 |  | QQ: lake ice grows with the freezing degree-seconds (D350, by Stefan's law); ice on the ground grows the same way while the ground is wet, f |  |
| E133 |  | fog by the atmosphere (QK, QCL): the air keeps its dew point (D229 fog); falling rain or snow saturates it; past the fog's water the rest se |  |
| E135 |  | (Albert, Nov 10 16:58: never saw a bolt; a storm strikes all through, not only in its heaviest rain, which had halved the strikes of a storm |  |
| E136 |  | a strike: on the ground in view when close, a sheet flash when far; the flash never comes within D112 of the last (QL, WCAG 2.3.1), and the  |  |
| E137 |  | a far flash: its thunder from beyond the screen |  |
| E138 |  | the rain's fall speed (QJ, Atlas's fit to Gunn & Kinzer); how many of the pool are falling: the strength |  |
| E139 |  | on the ground, under everything: snow whitens the land (screen), wet darkens it (multiply), ice whitens the inland water |  |
| E140 |  | over everything: what falls, the strikes, the flash, the night, the white of low visibility and the fog |  |
| E141 |  | SoRen's bolt: a channel from the top of the sky to the ground with a fork or two, three strokes from a soft glow to a bright core; its foot  |  |
| E142 |  | the channel wanders but leans home to its foot |  |
| E143 |  | the light: the sun's by the ramp, the horizon's warmth within 8° of it; rain no longer washes the whole picture grey nor darkens the wet gro |  |
| E144 |  | KW7: Koschmieder's reach (QK) limits sight on the Display floor; here the haze |  |
| E145 |  | Marsh (TW1): Who the map · What a wet margin round a lake or two · Where Z4's lakes, the land D115 out from the water · When the map is made |  |
| E146 |  | Floor 7, display (layer 140): what each side sees, now and nothing else (Albert, Nov 6: no fog of war; the land is always drawn). Every tick |  |
| E147 |  | a thing's height: a building's from its look (D312), a person's from D117 |  |
| E148 |  | each tile's top: the ground, a standing tree's height, a finished building's; worked out again when a thing is felled, lost or finished |  |
| E149 |  | the line of sight (QAM): from the eye's height to the target's top, tile by tile along the grid line (Bresenham), its own footprints aside;  |  |
| E150 |  | QAT the shadow: length = height × cot(the sun's height), capped at D120 heights, thrown away from the sun; the sun rises on the right, stand |  |
| E151 |  | left at sunrise, up at noon, right at sunset |  |
| E152 |  | under the buildings and units: a building's footprint thrown by its height, a unit's foot by its own; none under the trees (the woods are th |  |
| E153 |  | the box's shadow: its top thrown, joined to its foot along every edge, one fill so the overlaps stay one shade |  |
| E154 |  | The woods cache: the deep trees (eight tree neighbours) are painted once per chunk of the board and zoom step; the rest of the things are st |  |
| E155 |  | chunks of CS × CS tiles |  |
| E156 |  | a tree cut: its chunk is stale, and its neighbours stand at an edge now |  |
| E157 |  | each chunk's box in the view frame, with room above for the trees' height |  |
| E158 |  | the woods' picture: every untouched tree in a chunk on or near the screen, back to front, drawn once into one sheet the size of the screen a |  |
| E159 |  | the woods' sheet slides with the camera and is painted again only past its margin, on a zoom, when a tree is baked or woken (DEEPV), or when |  |
| E160 |  | a wounded one sways about its feet (QBS) |  |
| E162 |  | Touch: one finger pans, two pinch; a wheel zooms about the pointer; a held finger picks more, drags the crosshair or draws a box (F21). |  |
| E163 |  | the camera rule: the board never leaves the screen's middle; past its edge the camera may show what the bars cover there and a little more ( |  |
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
| E194 |  | a cell's object arguments live here by key, since the DOM holds strings (the hold verbs are gone: one tap does everything, Albert, Nov 8) |  |
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
| E205 |  | a page or a card is a bottom sheet: it opens from the bottom edge over the base's rows and hides them while it is open, as tall as its own r |  |
| E206 |  | the ghost: press and slide on the map moves it; the tile under the finger is its middle. Build confirms. Nothing of this reaches the canvas' |  |
| E207 |  | the tap: the glass answers first. A ghost takes it; aiming takes it; a unit or a thing under it becomes the subject, and a picked villager o |  |
| E208 |  | one height for every page but the Tall ones: each is laid out once, the tallest sets the panel, the others fill it (Albert: menus never move |  |
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
| E224 |  | a stroke of work (gathering or raising) faces its work and sounds on every other beat; the tick: training and research, ages, upkeep, the vi |  |
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
| E241 |  | First Keep v100 · ai.js (floor 11): one brain for every computer's side, three personalities (D303: Raiders, Rivals, Fortress), Mid's think. |  |
| E242 |  | the seat, and the hands it trains |  |
| E243 |  | the shells a side can pay for that tick a capability |  |
| E244 |  | each yield's camp: the drop-off that takes it in |  |
| E245 |  | a spot: the nearest free footprint to a point, searched in rings, kept off the home's own ring so the roads stay open |  |
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
| E283 |  | QAF the odds an army gives itself against a side, the one home the computers read, counting only the foe's soldiers and towers its side has  |  |
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
| E300 |  | a spot is free when its tile is walked and nobody stands on it or has claimed one within a full pace, 3 ft (D196, OSHA 1910.142(b)(3), N166) |  |
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
| E324 |  | a builder done (Decisions Nov 11, #16): his queued sites first; then, if he raised this building, its own work (a camp's finds, a field's po |  |
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
| E336 |  | Build: a wall line laid while the stores last, said in one toast; a building sent its nearest free villager (or the one picked), then, for a |  |
| E337 |  | while placing, the finger moves the ghost (a wall's corner or line), not the map; the drag holds only its own finger: a second finger, and t |  |
| E338 |  | the ghost's own art tinted green where it fits and red where not, one tinted copy a sprite and colour (Mid's ghostTint) |  |
| E339 |  | while a wall or gate is placed: a red line where a foe could walk in, or Sealed over the Town Center (Mid's drawSeal) |  |
| E340 |  | the ghost: a wall's tiles green or red with its corners, the first ringed green; a building's guides to yours in line and its tinted art, no |  |
| E341 |  | a tap on open ground while the Build page is open marks what fits there (Base: the suggestion is shown in blue with Fits here, never picked  |  |
| E342 |  | dragging the ghost near the screen's edge scrolls the map (Mid's edgeScroll) |  |
| E343 |  | what fits a spot: a drop-off for finds far from theirs, more of what stands round you, a wall in a narrow way (a gate beside your wall), a h |  |
| E344 |  | fish round every lake: a spot every D218 per of its radius, walked out from the middle to the shore and set inset back into the water, each  |  |
| E345 |  | a find laid where something falls (game becomes a carcass where it stood); a lake near enough to stand a dock by, past its beach |  |
| E346 |  | a boar near every Town Center, at the book's spot in each corner (Mid's boar) |  |
| E347 |  | the gather beat: the field is worked now (its soil wears); a flock's food goes straight to the store; a plot with an amount runs down and it |  |
| E348 |  | what a unit eats a second: its kind's shares (its Upkeep, with research) of a person's day; a famine past its grace weakens work and blows ( |  |
| E349 |  | everyone eats, every moment: a villager working food eats from its find, not the store (a field and game for nothing, a shepherd from the st |  |
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
| E376 |  | QCL the weather of the moment: rates, wind and visibility from the strengths, fog's water in calm air the vapour above saturation (CALVIS: K |  |
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
| E393 |  | time to contact: a soldier in a drill fights where it stands when the nearest foe would reach it before it reaches its place (D242; Mid's dr |  |
| E394 |  | idle soldiers form up at the building that trained them, one block per squad, else one block per kind of soldier (Albert, Nov 10, #32: by ty |  |
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
| E419 |  | the Director's three moves (Mid's DIRECTS): each returns what it says, a reason without its bang when nobody moved |  |
| E420 |  | a kind's move, one tap (Mid's direct): it says its word, tires the soldiers and sounds its event |  |
| E421 |  | the narrow at a tile: the open ground across the facing, a tile at a time each way until a wall, a tree or water; narrower than the widest c |  |
| E422 |  | the nearest cover (Mid's coverNear): an open tile with forest within D252 cover, within D252 find of the crosshair |  |
| E423 |  | an ambush in place (Mid's ambushTick): once there it goes to ground (no foe sees it); a foe within reach or a blow springs them all with a c |  |
| E424 |  | your groups on the march (Mid's drawOrders): a dashed line to where they go, a ring there, the time left; the rally flag (flagAt); leaves ov |  |
| E425 |  | the finger's gesture: where it went down and is, when, and what a module made of it (a line, the crosshair, a box); a hold after D246 hold |  |
| E426 |  | the hold's ring once the finger plainly holds, and the box being drawn (Mid's drawTouch) |  |
| E427 |  | Attack is Go, held it is Home (Mid's station); the rally flag, held the ambush; the choke tool; reinforce the mission most in need; a kind's |  |
| E429 |  | Albert's one rule for the finger (Build 40, Nov 2): a tap picks yours, a second tap opens the card; with yours picked a tap is the obvious o |  |
| E430 |  | the crosshair (Mid's aimSpot, aimColor): a foe, a find or the ground under the tap; green yours, red a foe or a hostile near, blue an ally,  |  |
| E431 |  | the finger's holds and drags on the map: the crosshair dragged, yours picked to keep picking, a box picks yours in it |  |
| E432 |  | the crosshair (Mid's drawReticle): brackets, a sonar ring, turning chevrons, a scan line, the cross, the time and the square |  |
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
| E452 |  | the danger map's home on the walking grid (econ draws it) and each side's reach, cached by what changes the walkable tiles: WALKV counts eve |  |
| E453 |  | the tiles a side's people can walk to: one flood fill over the walking grid (a queue, a typed array) from round its Town Center, by the same |  |
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
| E478 |  | the Market (Mid's marketTrade and its prices): a yield by the raw lot, a good by the good lot, sold at sell of its worth and bought at buy,  |  |
| E479 |  | sell or buy one lot at a finished Market: raw sold for gold is a swap, not gathered; a good sold counts |  |
| E480 |  | the Mint debases the coin once: its gold now, every Market price dearer for good (Rome's denarius) |  |
| E481 |  | a venture from the Market (the commenda): back in a year with the return or lost; only the profit counts as gathered (QCF) |  |
| E482 |  | a venture lost to robbers on the way |  |
| E483 |  | the stock settles back toward normal each slow beat (QP), spice toward dearer while one side holds a whole route |  |
| E484 |  | a shop (Make): what it makes now and from what; the choice changes its worker's work; Learning by doing adds a share for each other finished |  |
| E485 |  | trade: the stops on the two routes, held by the post standing on them; a good's price at a place is its base, more where wanted, × the going |  |
| E486 |  | a caravan walks to a building's side or onto a stop; a way it cannot walk ends its run, and it waits a beat |  |
| E487 |  | a caravan on a route: load at its Market, sell at the far end (a keeper's cut), buy spice at a stop if told, bring it home, again if it repe |  |
| E488 |  | a caravan with no route runs to the farthest ally's Market or Town Center for distance² pay (QCE), then home |  |
| E489 |  | robbers leave a caravan alone near its side's trade post or tower, or with a soldier of its side beside it |  |
| E490 |  | each frame the caravans; each beat a stop's holder, an armed caravan's blow and a whole route's pay; each slow beat the prices settle and ve |  |
| E491 |  | a caravan taken by a side pays its cargo and goods to the taker; one killed by the wild is robbed (the robbers' hoard waits for their camps) |  |
| E492 |  | the trade stops (Mid's ROUTES, PLACES.stop): four on each of the board's two middle lines, each on the nearest free tile, of its route, want |  |
| E493 |  | guards (Mid's escortPick, guardsOf): soldiers told to escort a caravan or garrison a stop keep to it as their post, as many as the trade's g |  |
| E494 |  | The war camp (F25, Mid's 38-camps; Albert, Nov 5 11:16 (7)): a wagon of two sizes (D287) unpacks where it is sent; positions in tiles of the |  |
| E495 |  | A camp's pieces: each spot [code, across, along toward home] turned by the facing and snapped to a top-left tile as Mid's snapPos (round of  |  |
| E496 |  | Why a camp cannot stand here (Mid's campWhy): off the map's edge, on water, on a building, on a resource (trees are allowed: they burn), too |  |
| E497 |  | The wagon unpacks (Mid's campUnpack): the trees within D279's burn of the camp burn and their forest floor clears; the pieces come off as si |  |
| E498 |  | How many camps of a size a side may have out (Mid's campCap, campsOut): none before its age, one in it, two after; the large needs Camp wago |  |
| E499 |  | Why a camp wagon cannot be trained (Mid's campWhyTrain): the queue and the Train cell ask it. |  |
| E500 |  | Soldiers raise their camp (Mid's canRaise, campRaise): a soldier on foot, idle or holding, looks each D279 look beat for the nearest of its  |  |
| E501 |  | A soldier by a medical tent that is badly hurt or sick walks home to the Hospital (Mid's campSendHome); with none it stays and is bound wher |  |
| E502 |  | The depot feeds the camp (Mid's campEat, every second; here as the people eat): a soldier within D279's reach eats from its stock; with it e |  |
| E503 |  | A Market caravan with nothing to carry runs food to a depot under half (Mid's supplyRun): from the store, keeping D279's keep, and the carte |  |
| E504 |  | The camp's tick: soldiers raise and mend, wagons that arrived unpack, the hurt are sent home each send beat; each minute rain, snow or frost |  |
| E505 |  | Relations (F28, Mid's 11-orders diplomacy): one stance a pair of sides (combat.js treaty, the Sides book); war is given with D281's notice;  |  |
| E506 |  | Why a side cannot take a stance toward another, or a group, now (Mid's relWhy, envoyWhy): a group by its regard (D282); a court not your vas |  |
| E507 |  | An envoy rides from the Town Center to the court (its Town Center) or the group (its nearest band), is heard there, and rides home (Mid's se |  |
| E508 |  | The answer (Mid's judgeEnvoy): at war and not asked for peace, the envoy is killed; the player answers its own; peace is taken free, or for  |  |
| E509 |  | A wild group's regard for each side (Mid's gangState, regardOf, addRegard, gangSync): peace and war follow it; an envoy makes a friend at D2 |  |
| E510 |  | Gifts (Mid's giftGain, QCD): each gift in the window buys less regard than the last, as the Danegeld bought ever-dearer peace; the Natives'  |  |
| E511 |  | Vassals and tribute (F28, Mid's 36-economy; Albert, Nov 5 11:16 (2): tribute, the tax rate parked; QCG): a vassal is an ally whose lord its  |  |
| E512 |  | A side becomes a vassal (Mid's makeVassal): by surrender, its army beaten and the lord's soldiers at its Town Center, or as an ally twice ou |  |
| E513 |  | A lord's hand on a vassal (Mid's breakTies, demand, forceTribute, levy, releaseLevy): cut it loose (war, the others warier), demand a store  |  |
| E514 |  | A rebellion (Mid's rebel): a share of its villagers take up arms as rebels and its army turns on its lord; with a coalition, the restless ri |  |
| E515 |  | Each slow beat (Mid's vassalTick): a rebellion is crushed or wins its freedom; otherwise the vassal pays its tribute from what it gathered s |  |
| E516 |  | A new map: no notice running, every group's regard at its start. |  |
| E517 |  | A vassal's soldier lost under its lord's colours costs loyalty; a foe its lord kills near its town earns its thanks (protect). |  |
| E518 |  | A blow on a shooter's stake, or on one of a wild group (its regard falls). |  |
| E519 |  | Field traps (F25, Mid's trapsTick, trapShown): hidden from all but their side, its allies and a side whose scout found them; a foe who steps |  |
| E520 |  | A trap sprung: caltrops spike each walker once a while and wear flat; the others go off once; a net takes a prisoner (not an engine); horses |  |
| E522 |  | The computer's relations (Mid's aiDiplomacy, allyDuty, peaceAll): its personality's bold and the difficulty's envoy, allyAt and gang (D304), |  |
| E523 |  | Dynamic Diplomacy (Mid's LEAGUE, leagueTick): when one side runs far ahead, the others (not the player, not the leader's vassals) ally and m |  |
| E524 |  | A hidden trap is drawn flat on the ground from the Sprites book, in its side's shade or the foe's red; a site as a dashed ring; caltrops sho |  |
| E525 |  | what a side stands, raises, trains and has queued, asked of the things themselves |  |
| E526 |  | the by-need plan's eyes (QCM, QV): the seconds to the bell, what one more hand earns at the best find from home (a probe walks from the hall |  |
| E527 |  | the army a side keeps: its personality's ceiling plus D291's armyAge an age, at most D226; at peace with every side, D285's stand of it (Mid |  |
| E528 |  | the counter (QCN, Mid's bestCounter): among the soldiers it can train now, the best answer to what its foes field for its price, mixed with  |  |
| E529 |  | a computer's turn, every D304 react s (Mid's think), in Mid's order: a site nobody raises, homes, drop-offs, plots, the age and its saving,  |  |
| E530 |  | shelter before it is needed: a Home (an Apartment once it can) when the people come within D152 of the room; one it cannot yet pay for is du |  |
| E531 |  | a drop-off where D291's crew work a yield whose nearest find stands far from one |  |
| E532 |  | the shift to plots: one at a time, never more than the hands on its yield, when it beats the wild find and pays its price back in the time l |  |
| E533 |  | the age: once the town is big enough (D176) it saves for the next; a save once begun holds until the age is bought, and spends freely only w |  |
| E534 |  | the town grows while one more villager pays its price in the time left (QCM), and not while it saves for the age unless food runs over; grow |  |
| E535 |  | its personality's buildings in order (D303 build); while saving, only the first; a second barracks or place to train when every line is full |  |
| E536 |  | faith and care: priests with an army, Zeal on the soldiers fighting, medics (Mid's think) |  |
| E537 |  | engines to break what soldiers cannot, by D291's cycle and the age's late engine |  |
| E538 |  | research while not saving: its personality's list in order, each through the first step it waits on; with the list done, any step every D291 |  |
| E539 |  | the hands by need (QCM): the goal and what is due are the cost; the bottleneck is the yield with the longest time to afford it (food first w |  |
| E540 |  | a hand moves to the bottleneck from a yield the goal does not need whose store does not then run out, or from one whose time stays under the |  |
| E541 |  | with nothing short, the personality's mix: no stone and less gold in the Stone age, no iron before the Classical, a Wonder-builder a little  |  |
| E542 |  | a waiting villager goes to the first yield in need it can find work for, else the one paying most; then the war and the relations |  |
| E543 |  | the computers' economy (Mid's aiEconomy, without surplus selling, Albert 11:16 (5)): staff an idle shop, ventures with gold to spare over th |  |
| E544 |  | the war (Mid's decideWar, QAF): a wave out is judged by its progress (D289): a blow or a step nearer; it charges once on contact, and goes h |  |
| E545 |  | the wave sets out, its guard kept home; a few riders go for the foe's nearest drop-off to draw the defence apart; you are told when it is yo |  |
| E546 |  | the ground's memory (D299): a layer as big as the ground's picture, cleared with each map; the worn earth round every building standing is l |  |
| E547 |  | the ground remembers (Mid's scarCv): marks painted once into a layer under everything, so they cost nothing a frame; at a board point on the |  |
| E548 |  | bare earth worn by feet round a finished building (not a field, a wall or a trap) |  |
| E549 |  | the dark where someone fell, wider for a big body, a blade's cut for a soldier |  |
| E550 |  | burnt ground and rubble where a building fell (not a wall) |  |
| E551 |  | the moon (QB to first order, QC): it runs ahead of the sun by its phase on a declination that swings from the sun's at new to its opposite a |  |
| E552 |  | the sky told ahead, the sky's news, the flood and the ruts (D293–D295); the ground's marks laid when someone falls or a building falls |  |
| E553 |  | the chain (QH) rolled ahead a forecast step for each step of Weather signs, never less than an hour; when the last rolled hour turns, its si |  |
| E554 |  | when the sky turns its news is told, with why in the chain's own odds (Mid's skyTurn and wxWhy) |  |
| E555 |  | water over the shore while the flood stands (KI4); the mud a step meets: the wetness, deeper by water (pooling) and by traffic, the ruts' de |  |
| E556 |  | each land tile's distance to the inland water, once a map: the shore that pools and the land a flood covers |  |
| E557 |  | the flood harms a finished building whose middle stands within its rise, unless its side has Levees; you are told |  |
| E558 |  | marks on the water and the ground, and the sky band (D296–D298, Mid's drawLakeRipples, drawRainRings, drawSky) |  |
| E559 |  | ripples drift on the lakes, inside the shore; none on ice |  |
| E560 |  | rain rings sit on the ground, fixed to the world, fewer as the rain eases; only close up |  |
| E561 |  | the horizon: a band of sky along the top of the glass, coloured by the hour and the weather |  |
| E562 |  | clouds cross the band with the wind |  |
| E563 |  | the wind is heard as hard as it blows (HA4, HX4) |  |
| E564 |  | the dens and drifters' camps laid in Z4 on their own dice, so the map's other rolls stay as they were; a robbers' camp at each end of the tw |  |
| E565 |  | a find's guards on a ring round it, each bound to it as its home; drifters in a row beside their fire (Mid's addFind) |  |
| E566 |  | a walker that leaves the land (no fall, no carcass), and a find taken away |  |
| E567 |  | the Challenge's hazards and the events: a hazard counts only off Easy; the level played multiplies the score |  |
| E568 |  | where an event comes in: a spot on one of the land's edges, its far side through the middle, or a free spot of the wild away from every town |  |
| E569 |  | an event comes only in its season, or in the rain; never the same twice running |  |
| E570 |  | a Poisson wait with a floor: least plus −(mean − least) ln U (QM) |  |
| E571 |  | what each event does when it starts, each second it runs and when it ends (Mid's EV) |  |
| E572 |  | a sinkhole's star of cracks, each arm bending as it goes, laid on the ground's memory from its place |  |
| E573 |  | once a second: the event running, else the warning ahead of the next, else its start; the horde and the travellers; a walker past its way ou |  |
| E574 |  | the horde under the Outlaws hazard: told two seasons and one ahead, then it comes for the weakest side at war with the outlaws, growing with |  |
| E575 |  | a wayfarer from the middle of each edge in turn, to the far one (Mid's wayfarers) |  |
| E576 |  | a bolt where it falls: drawn, the ground scorched, the thunder told |  |
| E577 |  | a running herd tramples who stands in its way and the soil of the fields it crosses (Mid's herdTick) |  |
| E578 |  | quicksand on the ground while it lasts |  |
| E579 |  | a falling star streaks down onto its spot |  |
| E580 |  | a find drawn as blobs from the Sprites book |  |
| E581 |  | flames on what burns, with its smoke, as strong as the fire |  |
| E582 |  | the wild's guards and travellers, the robbers' raids, the computers' detachments and the scout (Mid's wildTick, wayfarerTick, natRaid, lootR |  |
| E583 |  | a guard keeps to its home: it looks for a stranger near home (a raider, near its reach), lets go past its leash and walks home when far; a r |  |
| E584 |  | a defender weighs a stranger now and then: it fights with probability V / C, C the stranger's strength over its own (QAH) |  |
| E585 |  | a traveller joins the first side to meet him, as villagers (on its rally job), or as food when the town is full |  |
| E586 |  | one weighted draw: p = w_i / Σw (QAR) |  |
| E587 |  | now and then the robbers send a band from the camp nearest a side at a villager or caravan of any side they can beat, drawn toward a load, a |  |
| E588 |  | a computer hires drifters it can pay for, and sends half its idle army at the nearest find while nothing else is on; home when it is taken |  |
| E589 |  | a scout left to itself goes for a find whose guards have fallen, else loops the land |  |
| E590 |  | the finds: the first side to touch one whose guards have fallen takes what it holds; the ruins a free research of its age |  |
| E591 |  | drifters fight for whoever pays, with a unit of the payer beside them and room in the army |  |
| E592 |  | fire: the ground's dryness by Rothermel (QT), the t² fire's heat across a gap (QU), and a chance in a step from a rate (QM) |  |
| E593 |  | a wooden building catches fire, and the nearest villagers of its side run with buckets (Mid's ignite) |  |
| E594 |  | a fire burns its building and, every few seconds, may light a wooden neighbour; a building that burns out falls (Mid's fireTick) |  |
| E595 |  | in a summer storm lightning strikes a wooden building now and then, and a forge throws sparks (Mid's lightning) |  |
| E596 |  | sickness: a town's people near its seat or a depot; more cases from outside in summer and winter, fewer with research |  |
| E597 |  | each health beat: cases from outside, the spread β S I / N (QAQ), and each sick one cured by a healer near, dying, or well again (Mid's heal |  |
| E598 |  | the view's eyes, lights and stage: the light and each eye's range (real math, Albert Nov 6), the camera's glide, the lights after dark, the  |  |
| E599 |  | the light on the ground (D117): the sun's by its height, the moon's by its phase and height, the stars'; cloud dims it to the overcast night |  |
| E600 |  | a thing's range (QAL): the least of the horizon from its eye, the eye's range in this light (a lantern gives a building part of the dark bac |  |
| E603 |  | another side's building shows only while your people see it |  |
| E604 |  | the player's Reduce motion, read from the phone; the draw budget's level; still: is motion off, by the setting or by load (Mid's lessMotion, |  |
| E605 |  | a phone that falls behind sheds a level of drawing (tree shadows, then the moving extras, then half the pixels) and climbs back when fast ag |  |
| E606 |  | a cache held to a budget of pixels, its size kept as a running total: the least lately used go first (a picture used is moved to the back),  |  |
| E607 |  | the camera glides on a critically damped spring (QAW): to a point, Home or the small map's tap; a finger takes over; still means a jump (Mid |  |
| E608 |  | Follow keeps the picked units in the middle until they are gone or a finger moves the map (Mid's followCam) |  |
| E609 |  | fire's colour from its temperature (QF, a black body), its life in the rain (an open flame dims, a covered one keeps), its glow fading as 1/ |  |
| E610 |  | a flame's light on the ground: a disc fading to a quarter at half its reach, added to the dark, only when there is dark to light |  |
| E611 |  | what burns after dark: a blazing or badly hurt building, a hearth in a home, a lantern at a lit door, a camp's fire, a caravan's lantern (Mi |  |
| E612 |  | theatrics: one pop curve (a finished building and a newborn swell and settle), ripples where you tap, three sizes of celebration (a building |  |
| E613 |  | words on the map keep one size whatever the zoom, as the screen's own words; a label is a pill (Mid's mapFont, tag) |  |
| E614 |  | the dressing: a site staked out and rising with the work, a finished building's pop and fresh glow, its flags, piles and chimney smoke (Mid' |  |
| E615 |  | a building site: the stakes round its footprint, the walls rising with the work between two posts, the bar, and z when nobody builds it |  |
| E616 |  | a building's flags, drawn live over its picture where its art put them, waving more in a strong wind (Mid's flagsOn) |  |
| E617 |  | a side's stores as piles by the camp that takes them in: a pyramid by log₁₀ of the store, drawn once per count and zoom (Mid's PILE, pileAt, |  |
| E618 |  | a chimney's plume: rising ∝ x^(2/3) (QAV, Briggs) and widening ∝ x^0.9, leaning downwind (Mid's smoke) |  |
| E619 |  | a figure in motion: the woodcutter's lean into its tree (the view's own memory), the step's rise and fall, a lunge into a blow and a shooter |  |
| E620 |  | the small map: the ground, the fog, buildings you know (a seat is a star), units you see, an army coming flashing red, and the screen's box; |  |
| E622 |  | a banner on a building that flies live leaves its place to the view (Mid's FLAGS) |  |
| E623 |  | the shadows of the trees, bushes and rocks in sight, not the deep woods, cast like everything else (QAT, Mid's shadowPath); the draw budget  |  |
| E624 |  | is a thing in a side's sight: its own, the land's and the wild's always; another side's only when that side's eyes saw it at the last look,  |  |
| E625 |  | a board at peace (Mid's 39-games, D322): the truce clock, the hidden age it opens, standing down, the chronicle; the deal of the peoples for |  |
| E626 |  | a board truce: no two living sides at war and no notice running; how long it has held |  |
| E627 |  | the chronicle: the match's lines, kept to D322's chron, newest last |  |
| E628 |  | standing down (demobilisation, as every peace since Rome): the soldiers at home above the keep go home as villagers, one for one; yours to y |  |
| E629 |  | once a second: the truce clock starts or stops; a year of it opens the hidden age for every side; after D322's stand.after the computers sta |  |
| E630 |  | the three crowns and the overall (Mid's crownsOf): Wealth all a side gathered, War the cost of the enemy people and buildings it destroyed,  |  |
| E631 |  | the last step of the hidden age ends the match for everyone: everyone wins, the crowns say who won what |  |
| E632 |  | a side's people: its civilisation, and the bonus row it holds from the start (Mid's CIVS fx, applied by QCA as research is) |  |
| E633 |  | the War crown's count (Mid's warCredit): a side destroying another side's unit or building is credited its cost; the wild cost nothing |  |
| E634 |  | a raid on yours: an enemy strikes or fells one of your things; told by the mail, by sight, by ear or by messenger (QCH) |  |
| E635 |  | the mail (Mid's say and tell, D323): a line shows a while unless it is quiet, the same line within merge is a count on the first, the newest |  |
| E636 |  | which way a place lies from your Town Center, of eight |  |
| E637 |  | how a line reaches you (QCH): in sight now; a fight in earshot by its way only; else by a messenger walking from your Town Center, if the Po |  |
| E638 |  | a line said: by messenger later, heard as a fight, or now; merged with its repeat, kept, shown |  |
| E639 |  | the messengers arrive |  |
| E640 |  | the world's news: a line of your age every while, none at first |  |
| E641 |  | the peoples on the Start card: the one you pick and its line (its own soldier, the one it replaces, its wonder, its bonus); the others are d |  |
| E642 |  | the milestones and tips (Mid's MS_TEST, advise): each milestone said once a match the first time it is true; a tip names what the town needs |  |
| E643 |  | a hint retires once learned: what you did, counted on this phone, to D325's learned |  |
| E644 |  | what each tap teaches: training a kind, a job, a building, the next age |  |
| E645 |  | the fourteen milestones' tests, and their numbers filled from the books |  |
| E646 |  | gold short while another store is full |  |
| E647 |  | what the town needs next, first that holds: room, villagers, wood, idle hands, a barracks, spearmen, the next age, food, gold, a fire, sickn |  |
| E648 |  | every lesson beat: a new tip is said, then the first milestone newly true, one a beat |  |
| E649 |  | a computer chases its crown (Mid's chaseCrown): the wellbeing chaser builds each place of care it lacks; every side takes the hidden age whe |  |
| E650 |  | The corners: the board's four, clockwise a quarter turn apart from the screen's top left; yours, the first, sits A6 round (the bottom left,  |  |
| E652 |  | The way home (QCQ, Mid's openWays and wayHome): nothing is walled in; a find cut off by woods gets the fewest trees cleared between it and i |  |
| E653 |  | Z3, laid by the Randomizer: each find of D65 at three pockets' worth, and the land's specialty once more at one pocket's, at a rolled spot i |  |
| E654 |  | The land's character (D329, Mid's LAND): past the pocket every find is worth its store's share |  |
| E655 |  | The save and the safety net (Mid's 34-save and 41-boot): the game saves itself on the save beat and on leaving, keeps the one before, waits  |  |
| E656 |  | each kind of error logged once; a second kind holds the save (the last good one stands) and says so |  |
| E657 |  | the save: the seed (the map is laid again from it), the lists, the climate, the sides, what they know, and what differs from the fresh map;  |  |
| E658 |  | a save opened: the places turned back into the things and units, the Maps, Sets and Infinity by their tags (D331) |  |
| E659 |  | the save waits while you fight, at most D331's fight; a failed save says so once in D331's fail; the test field is never saved |  |
| E660 |  | saves roll through D331's slots, one set per build folder, so live and a preview never share one; when storage is full the oldest goes to ma |  |
| E661 |  | the game opened from a save: the fresh map from its seed, then the lists, the sides and the changes laid back, then each module's own |  |
| E662 |  | The opening: the game opens where you left it, newest save first, saying so if it had to open an older one; the address never ends a match;  |  |
| E663 |  | New game (Mid's applyScenario and testField): the scenario's buildings and people placed by the placing rules nearest their spot |  |
| E664 |  | A scenario (D330): the age, the store and the research for you (or every court), the relations, the buildings and villagers, the length |  |
| E665 |  | The test field (D333): you and one rival at war, the other two gone, every store full, both armies down the road from your Town Center |  |
| E666 |  | the economy's part of the save: a finished game clears the save instead |  |
| E667 |  | the war's part of the save: the waves, the orders, the relations, the squads |  |
| E668 |  | the computers' part of the save: their clocks, plans and minds |  |
| E669 |  | the ghost's bar (Mid's place bar): what the ghost says, Build to place it, ✕ to stop; the menu stays closed so the ghost and its guides are  |  |
| E670 |  | The test tools (Mid's matchLog, copyLog, tapCount): the match log for Claude to read, tap counts kept on this phone |  |
| E671 |  | a row a minute (D335): each side's age, villagers, soldiers and stores, or none once it fell |  |
| E672 |  | copied to the clipboard, or through a hidden box where the clipboard is refused |  |
| E673 |  | the menu's part of the save: the mail, the news, the options, the match log |  |
| E674 |  | a guarded find stands in its own clearing, as Mid lays its guards on the ring round it (26 from home): it is laid only where the ring is ope |  |
| E675 |  | The Guide, written from the books (Mid's guideModel): every building, unit, research step, age, people, find and rule, its numbers read from |  |
| E676 |  | a unit is trained at the first building that trains it (or the kind it replaces), as Mid gives each its one home; a history line sits under  |  |
| E677 |  | a rule's numbers and names are filled from the books: {D:path} a measurement, {S:code} a shell's name, {J:key} a words entry, {fx:stat} the  |  |
| E678 |  | Mid's guideModel, field for field, on v100's tables (a building's menu is its Build tab, else why it is off the menu); no line of what a thi |  |
| E679 |  | History (Mid's yearOf, histRows, histText): a step's date as a year (BC below none; an era by name; undated last), the dated steps in order, |  |
| E681 |  | a plain record held in two places (a war order, a camp, an ambush) is saved once, tagged own, and its other places as same; opened, they are |  |
| E682 |  | a computer's estimate of what one more worker earns on a yield is kept for the slow beat (D182: the computers' slow looks) and not worked ou |  |
| E683 |  | the computers' clocks start spread over one turn (react ÷ how many), so no two think on the same frame; each keeps its own turn |  |
| E684 |  | the work queue: slow jobs, each a generator that yields where it may stop; one job of a key at a time (a computer whose last turn is still r |  |
| E685 |  | a frame runs the queue's jobs in turn, a slice each, up to D339's slices (QCR: counted, not timed, so the game does not depend on the machin |  |
| E686 |  | a site the computer cannot pay for, or may not build, is not searched for: plan() would refuse it after the search (the same answer, without |  |
| E680 |  | the Guide as Markdown (Mid's guideMd): one table a part, its headings from the words, a bar in a cell made a slash |  |
| E800 |  | made once a map: which tiles are grass, bare or other land; a micro-relief, and on it each tile's flow by the steepest of the eight ways, th |  |
| E803 |  | the flowers and pebbles close up: each cluster's offspring from its own seed, as many open as its season allows, none under snow or on a tro |  |
| E804 |  | a tile's wetness by its wetness index and its snow by its drift: one home each for the step, the footing and the picture |  |
| E805 |  | a step's wear on the grass: the pressure of everything that walks there (body, mount, kit and the load carried) over its prints, past the so |  |
| E806 |  | an order leaves its soldiers tired as a charge does (D247 slow, settling back with tired): give many orders and the army slows (Mid's ORDER. |  |
| E807 |  | QCJ while two soldiers form up (D242): the one of lower precedence gives the whole way, softly (foot before archers before riders before eng |  |
| E808 |  | a side's exposure to cold and wet (D354): the air's cold and the ground's wetness, each cut by its research (Wool cloaks, Oiled cloaks, Chim |  |
| E809 |  | a soldier's nerve settles no higher than its full × (1 − D354 nerve × its side's exposure): cold and wet sap morale |  |
| E810 |  | familiarity (D355): a cell is known to a side from the last time one of its eyes stood in it; nothing is saved, so a reload forgets the scou |  |
| E811 |  | a side's familiarity with a tile: one on its own ground (a finished building of its own within D355 home), the Natives' and the wild's every |  |
| E813 |  | a scout set to Stealth (its card) goes on foot at D224's sneak and takes the spy's veil (E472): unseen unless a foe's soldier is near or a s |  |
| E815 |  | what a research does, in words from its effects; with no effects, why it is there |  |
| E816 |  | where the finger leaves the ghost: Mid's snap first; if nothing caught it and it stands on no guide, the nearest guide line within tol pulls |  |
| E817 |  | the small pop-ups on the map (a quick attack on bare ground, the ice's clear, the villager's square) stand a slot above the point, centred o |  |
| E818 |  | the bottom bars' height, told by the menu when it changes (the top bar's is read as topOf); a person's head on the screen, a person's height |  |
| E819 |  | the villager's square (Albert, Nov 8 21:35-21:46): a tap on your villager opens four boxes above its head, Build, Send to, Attack, More; Mor |  |
| E820 |  | a villager told to take cover goes into the nearest building of yours with room, as fright sends it; like fright's, it comes out when no foe |  |
| E821 |  | one tap listener for the whole screen (Albert, Nov 9): every button with a verb answers wherever it sits; the pause panel lived outside the  |  |
| E822 |  | the rate the frames run at, one home: at rest the idle rate, shedding frames the lower rate, otherwise the full rate; the loop paces by it a |  |
| E825 |  | every menu ends in the help line, always there (Info Help Ribbon 1): the latest message, and a tap opens Help; the same line under the top r |  |
| E826 |  | the help line under the top ribbon carries its words in a span and a white ring (Info Help Ribbon 1), the ring receding over the time it tak |  |
| E827 |  | a message's time on screen: the toast's least time plus its words at adult reading speed (Brysbaert 2019; Albert, Nov 9 12:12) |  |
| E828 |  | the ring's marker inside a box: its colour and its state (dim not chosen, lit chosen, run at work) |  |
| E829 |  | one colour a kind of work (Albert, Nov 9 12:03-12:19): the age-up white; soldiers red; scouts, envoys and spies blue; caravans gold; other p |  |
| E830 |  | dim is the colour mixed into the tray brown by one share, never picked by hand |  |
| E831 |  | the box's outline as one path from 12 o'clock, clockwise, round its corners |  |
| E832 |  | each ring drawn once its box has a size, and again only when its size, colour or state changes |  |
| E833 |  | how far the work is: a queue's first item by the time left on it; the help line by its time to read |  |
| E834 |  | every frame the running rings recede, pinned at 12, clockwise, gone when the work is done |  |
| E835 |  | the queue: the first item rings down (run), those waiting behind it full and bright (lit); the green fill is gone |  |
| E836 |  | MR title: every menu's title row ends in back, book and close, always in the same place (Albert, Nov 9 12:57) |  |
| E837 |  | a help line wider than its bar shows the chevron; the chevron opens it to two lines and closes it again |  |
| E838 |  | the chevron's tap: open or close the help lines |  |
| E839 |  | a font from the type rule: its weight and size, in the face named |  |
| E840 |  | the stances: a people's name over two columns, then its four boxes (gift or bribe, war, terms, ally), each ringed by its colour; not built y |  |
| E841 |  | the small cards are two columns of the mold wide: the width read from the bar's own width, set once a render |  |
| E842 |  | a card hanging under its top button: centred under the button, held inside the screen |  |
| E843 |  | Paused: the speeds and its help line; a tap on play plays again |  |
| E844 |  | Sound: the three volumes and its help line, under the mute button; a tap on mute mutes and shows it, a tap again hears and hides it |  |
| E845 |  | the book: Welcome back mid-match (Resume, New game), paused |  |
| E846 |  | a message kept for the Help page, newest first, the same one twice in a row once |  |
| E847 |  | Help: the earlier messages, newest first; the latest stays in the help line beneath |  |
| E848 |  | a small card's title: the title on its own row, back, book and close beneath it |  |
| E849 |  | a group's label over its boxes, in small capitals across the whole row (as the v80 card) |  |
| E850 |  | a ring is the box's outline: the box drops its own border so the ring sits on the edge, one line, never a second inside |  |
| E851 |  | what a side cannot build yet (age, research, a building it needs, a later age): the locks before the limit; the Build menu hides these |  |
| E852 |  | a building raised into another where it stands (the Gate's way over a wall): taken down, the new one's site laid in its place and paid; put  |  |
| E853 |  | the Build menu: the open tab's buildings of your age and before; a later age's are gone until it comes (Show all cut, Albert Nov 11; the who |  |
| E854 |  | made from a building's card (SN34): the Dwelling's Apartment, the Lumber camp's Tree farm |  |
| E855 |  | a picked unit: the green ring at its feet, thick and glowing |  |
| E856 |  | a picked unit takes the next tap as its order (a thing: it does that; the ground: it goes there). A villager's pick ends with that one order |  |
| E857 |  | the quick action: a tap on open ground opens a square of four, the first under the finger (Attack, Build, Squad, More); each step opens in t |  |
| E858 |  | a share of the army sent to the spot: all, half or a quarter, nearest first, or the idle only |  |
| E859 |  | Build from the quick action: the Build menu opens on its first tab, the building's ghost starts at the spot |  |
| E860 |  | the square laid with its first box under the finger, held inside the screen |  |
| E861 |  | a builder's next site: the first one laid, then the nearest (a wall line keeps to the nearest piece) (Albert, Nov 9: first placed, first bui |  |
| E862 |  | the year's clock: the game's time from a start late in spring (D359), for seasons, leaves, the meadow, the weather and the harvest |  |
| E863 |  | the woods: walkable for a person or a rider at the woods' pace (D360), never for engines or wagons; the path pays the time lost, so the edge |  |
| E864 |  | a tap anywhere on a building's drawn shape is the building: the front-most whose picture is solid under the finger (Albert, Nov 9 item 8.7) |  |
| E865 |  | a hold is only the box drag to pick many (Albert, Nov 9 item 8.5): nothing else listens for it |  |
| E866 |  | the menus' sizes, once: every px in the style read from the Screen book's css entry (SN35) |  |
| E867 |  | words drawn on the map at the head type (SN20), never a size typed in the code |  |
| E868 |  | the sight map, per side: each tile counts the eyes on it (VIS), remembers being seen (EXPL); the buildings a side has seen stay as it saw th |  |
| E869 |  | an eye's tiles: every tile in its reach whose ground, a body high, its line clears over the tops between (trees and buildings by height); ca |  |
| E870 |  | seen now: a unit whose tile is in sight; a building any of whose corners is |  |
| E871 |  | the fog of war's veil: one pixel a tile, dark where never seen, dim where seen before, clear in sight, drawn over the land and smoothed |  |
| E872 |  | the Start page's Fog of war: off, every side sees all (one rule for all) |  |
| E873 |  | the fog drawn by Beer-Lambert: its veil 1 - e^(-beta x path), the path the fog layer or the camera's height inside it, the height read from  |  |
| E874 |  | a crossing is ice or woods: the same modes for both (single file, thin out, one at a time, stick to edges, go around), chosen once on the cr |  |
| E875 |  | in the woods a missile is stopped by the trunks with chance 1 - e^(-stems x trunk x L), L the metres of wood the line runs through |  |
| E876 |  | in the woods the line breaks into one-on-one duels (Lanchester's ancient model, the Linear Law): a blow is shared among all who strike the s |  |
| E877 |  | an eye facing no fog: every point round its rim already seen by others, so it casts nothing; eyes in one cell share one cast |  |
| E878 |  | a sight cell's woods: how much of it is wood and its ground under the trees, so a ray through the trunks thins by e^(-n d L) and a ray over  |  |
| E879 |  | the fog of war is saved with the game: the ground each side has seen and the buildings it remembers, and whether fog is on; sight is cast ag |  |
| E880 |  | the land kept while the camera holds still: one copy drawn back instead of the ground, the meadow, the scars and the skin each frame (SoRen' |  |
| E889 |  | the land sheet slid by the camera's move since it was drawn: a pan costs one copy, not a new land |  |
| E893 |  | a sheet (a cel of the old cartoon): a picture a margin larger than the screen, slid pixel for pixel with the camera, painted again only when |  |
| E894 |  | with ?test the frame meter shows from the start (its only door, the Yard, left the Paused card in N6) |  |
| E896 |  | the weather's fog as a sheet: each 5 m cell veiled by Beer-Lambert through the fog above it, the layer's top level over the lowest ground, s |  |
| E897 |  | your own people under the canopy drawn as a ring over the trees, so you see who is inside |  |
| E898 |  | the Build grid keeps its tab's two rows of three: empty slots fill where locked buildings hide, so every tab is one height (Albert Nov 9: fi |  |
| E900 |  | the ground's soil and paper (N11): wet and snow on the ground for play, and the light, season, snow, flowers and glints over the paper sheet |  |
| E901 |  | over the baked ground: the hills' sun and shade and the meadow's soft patches as one small soft picture, then the snow sheet, then the flowe |  |
| E902 |  | grass is painted a light neutral and also on its own sheet; that sheet takes the season's one colour (multiplied), recoloured only when the  |  |
| E904 |  | a marsh is shallow water; reeds stand in it |  |
| E905 |  | each paper sheet casts a thin shadow on the sheet below, along its edge |  |
| E906 |  | the flowers come up in new places each year; the pebbles stay where they lie |  |
| E907 |  | snow is one more paper sheet, in six steps: it lies where play's drift would cover the ground, hollows first |  |
| E908 |  | glints on the water: a few short strokes that come and go |  |
| E909 |  | how far each water tile lies from its shore, in tiles (a chamfer distance in two passes); the water's three sheets follow it, so their edges |  |
| E910 |  | the blades fade in with the zoom, as v80's did: none from far away, full close up |  |
| E911 |  | a path kept as lists of points, so a run of one colour can be joined into one shape |  |
| E912 |  | the ground is recorded once per map as shapes, not painted into a picture: each run of one colour or line becomes one shape, every piece wou |  |
| E913 |  | the ground's shapes, the grass's one shape (the season's colour and the blades' bed), the water's fill level and its foam, the blade tiles a |  |
| E914 |  | a blade tile drawn at the screen's own pixels for the zoom in hand, thin triangles in the two blade colours, wrapped at the tile's edges: al |  |
| E915 |  | the blades' marks, made once per map from the seed: where in the tile, how long, how much lean, dark or light |  |
| E916 |  | the cloud tile: soft noise that wraps, made once per map |  |
| E917 |  | cloud shadows drift over the land each frame, the camera and the drift on the canvas (Safari); still when motion is reduced |  |
| E918 |  | the water fills every cut up to one level just under the grass (the mock's 'high'): the banks below it are drawn as shallow water with foam  |  |
| E919 |  | the minimap's picture: the shapes replayed once, small |  |
| E920 |  | the shapes are kept by layer (tiles, faces, reeds, then each band's contours) and by colour within a layer, so a whole map replays as a few  |  |
| E921 |  | each water band gets its own layer, laid in order before the first contour: the shapes are kept by colour within a layer, so in one layer th |  |
| E922 |  | the grass mask (where the season's colour and the blades go) is cut from the contour cells, not the tiles: a whole grass cell goes in, runs  |  |
| E923 |  | the water's distance from shore starts at the waterline itself: a water tile beside land takes the fraction of a tile to where the height cr |  |
| E924 |  | the marsh: each marsh tile draws a number from the seed; where it is over D366's tussock the tile is water, else a tussock of grass; the wat |  |
| E925 |  | the Daily challenge: when it is on, the civ, difficulty, length (Albert, Nov 10 11:51) and the dangers are drawn from the day's own dice at  |  |
| E926 |  | a price is one line in one colour, by the store you are shortest of: red at nothing, white near, green once you can pay all of it; the store |  |
| E927 |  | the Top Info Ribbon (SN39): nine readings under the top ribbon, rank by score among the sides |  |
| E928 |  | the time of day as hours and minutes, one home for the clock and the ribbon |  |
| E929 |  | a villager walking home with a load carries it on the back, a bundle in its store's colour (Albert, Nov 10, #35) |  |
| E930 |  | every finished building has a torch by its door from the start, houses their hearth as well; a building two tiles wide or more has two (Albe |  |
| E931 |  | any queued item can be taken out, not only the last, and is paid back in full; taking out the first restarts the clock |  |
| E932 |  | tap a queued slot to cancel it, refunded (Albert, Nov 10, #29) |  |
| E933 |  | a site's card sends one more villager: the nearest idle, else the nearest worker, who goes back to work after (Albert, Nov 10, #33) |  |
| E934 |  | an order's target answers: a unit glows, a thing ripples in the done colour (Albert, Nov 10, #31) |  |
| E935 |  | with someone picked, a tap near a resource takes it, so the target is bigger than its tile (Albert, Nov 10, #23) |  |
| E936 |  | your soldiers leave a wild animal alone unless it is after one of yours or you sent them at it (Albert, Nov 10, #32) |  |
| E937 |  | a beast that is not attacking your side is not a target for your soldiers |  |
| E938 |  | Lanterns (research) make the door torches brighter: light falls off as the square of distance (E = I / r^2), so a torch seen as far reaches  |  |
| E939 |  | a message with a place shows Go on the blue info bar, at the top and in a menu's help line; a tap there takes the camera to it and closes th |  |
| E940 |  | a leafy crown takes a warm gloss on its sun side, painted only over its own leaves, baked once with the tree so it costs nothing a frame (Al |  |
| E941 |  | the quick action (Albert, Nov 10, #37, his sketches): tap open ground for a block of Attack, Build, Rally; Attack gives All, half, quarter,  |  |
| E942 |  | the quick action's steps that open another step, so the block stays open after them |  |
| E943 |  | menus are not redrawn while a finger is down on a button (Albert, Nov 10, N17 #7: taps pressed but did nothing): a redraw replaced the butto |  |
| E944 |  | minus on a job acts at once: the villager drops what it carries and stands idle, so the count falls on the tap (Albert, Nov 10, N17 #10: plu |  |
| E945 |  | first placed, first built (Albert, Nov 10, N17 #4; AoE2's build queue): a site placed with a builder picked who is still raising another joi |  |
| E946 |  | an order you give marks each unit sent: its foot ring stays green from the order until its walk ends (Albert, Nov 10, N17 #9) |  |
| E947 |  | your people under the canopy drawn as a flat ghost in your side's colour, the figure's outline only, with the ring at the feet (Albert, Nov  |  |
| E949 |  | a flame's flicker by the real puffing rate (QCV, about 5 Hz for a torch), on the wall clock so game speed does not hurry it; the flame's hei |  |
| E950 |  | campfires after dark (Albert, Nov 10, N17 #12): where two or more people stand or work together at night a campfire is lit among them, and s |  |
| E953 |  | a sound that will not come back (Albert, Nov 10, N17 #10 and #19): a phone call leaves iOS's audio interrupted and a resume that fails stays |  |
| E954 |  | the blue info strip is read, not flashed (Albert, Nov 10, N17 #18): each line stays its reading time (D read: the least time plus its words  |  |
| E955 |  | the base and the rank row are drawn once a render and that one drawing is both compared and shown (Albert, Nov 10, N17 #11: People's ring di |  |
| E956 |  | a soldier trained while a rally flag stands joins the ones already marching to it or holding it, and they are dressed into one formation the |  |
| E957 |  | a sprite is cached at the next size up the √2 ladder, never the one below: drawn smaller it stays sharp, drawn larger it went soft and block |  |
| E958 |  | your people behind a tree or a building show through it as a silhouette, as Age of Empires II draws them (Albert, Nov 10, N17 #20): each of  |  |
| E960 |  | an army's standard groups the soldiers of one order, one rally or one march (Albert, Nov 10, N17 #8: an army out carries its torch; a dresse |  |
| E961 |  | the standards drawn this frame, kept so the lights put a torch on each after dark (v80's fire staff that walked with the army) |  |
| E962 |  | a campfire after dark by a drop-off where two or more of a side gather and bring their loads there, set just past the building's front corne |  |
| E963 |  | the lights add a torch on each army's standard, its glow at the standard's foot and its flame at the pole's top |  |
| E964 |  | an open flame's white-hot core: a bloom at its heart the flame's own height across, laid on with light (Albert, Nov 10 15:30, the fire mock) |  |
| E965 |  | one scratch canvas for the fire's highlights |  |
| E966 |  | firelight on the side that faces it (Albert, Nov 10, N17 #8, the mock): each person and finished building in view takes the nearest open fla |  |
| E967 |  | the grass blades' tiles are made at the next step up the √2 ladder of the zoom and stretched to it, so a pinch makes a new one only when it  |  |
| E968 |  | while a pinch moves, the land sheet is stretched to the new zoom instead of drawn again; once the zoom has stood still a moment, has moved a |  |
| E969 |  | the quick action's aimer: on the aim step a plain white ring with four ticks and a dot sits on the tile the order will go to, and the one bo |  |
| E970 |  | a soldier whose rout has run its time comes back to the fight: he turns on the nearest foe he can see (within his sight; Nov 10: within the  |  |
| E971 |  | the top row holds what two rows held (Albert, Nov 10 18:27): a cell named two keys joined by / shows each on its own line, a store with its  |  |
| E972 |  | a tree deep in a forest is one with a tree in each of the eight directions a forest step away (the forest is planted on a grid of D forest.s |  |
| E973 |  | asking for a fresh picture marks the frame wanted; the loop draws every frame while the game runs, and while it rests (paused, a menu over i |  |
| E975 |  | the mist and the fog of war share one sheet, the mist painted under the fog, so the screen takes one large copy a frame for both instead of  |  |
| E976 |  | loading a save makes the ground's shape from its seed but does not draw it: load draws it once, with the save's things on it (Gemini's audit |  |
| E977 |  | a filled shape needs no closing stroke, a fill closes itself; only a stroked shape that was closed is closed (the ground's thousands of clos |  |
| E978 |  | a tile that opens (a tree felled, a rock mined out) joins each side's reach where it touches it, flooding on from there, instead of every si |  |
| E979 |  | a felled tree lowers the top of its own tile and its sight cell only, and the sight caches are told the view changed (Gemini's audit, Nov 10 |  |
| E980 |  | the map's tops are worked out again in full only when a building or a find goes, not a tree (cut one by one above) nor a person (never in th |  |
| E981 |  | food in reach is food a side can carry home: a find or prey within the hunger book's reach of one of its own food drop-offs (Gemini's audit, |  |
| E982 |  | a healer heals everyone of its side within its reach, villagers too, as Age of Empires II's monks do (Gemini's audit, Nov 10, BUG-10: only t |  |
| E983 |  | a bow's reach from a height: the arrow's flight (its drag and gravity, QAJ) at the speed that carries it its flat range, flown from the heig |  |
| E984 |  | your hidden people, under the canopy or behind a tree or building drawn after them, show as their ring only, dashed and twice as thick, in y |  |
| E985 |  | a person counts as hidden by what is drawn in front of him only if that thing has ink at the middle of his figure, not merely a box that mee |  |
| E986 |  | the picture's resolution steps down with the draw level, three quarters then half, and back up as frames come quickly again (Albert, Nov 10  |  |
| E987 |  | every untouched tree is baked into the woods' cached picture (Albert, Nov 10 21:08-21:10, option B); a tree leaves it at its first cut, so t |  |
| E988 |  | the trees standing in front of a person, a thing or a building this frame (lower on the screen, their pictures overlapping, looked for cover |  |
| E951 |  | a lightning flash is three to five return strokes about 60 ms apart (CIGRÉ TB 549), each re-lighting the bolt and whiting the sky by its nea |  |
| E952 |  | a lake keeps off the trade roads' stops, as it keeps off another lake: a stop is a place on dry land where caravans meet, so the water is la |  |
| E999 |  | one route for a whole order (Albert Nov 11, N325: 'clean up how army is controlled wholly'): a soldier told to march is set on a path it is  |  |
| E1000 |  | the route of an order: the soldier nearest the middle of the group finds the way once; each other soldier walks a short way onto that route  |  |
| E1001 |  | a tap the army cannot reach (water, a cliff top, inside a wall) is moved to the nearest ground it can reach within D372 snap tiles, so the o |  |
| E1002 |  | Defend (Albert Nov 11, N325: 'Defend goes right to the attack', no spot to pick): of the foes now striking what is mine, the one striking th |  |
| E1003 |  | picking soldiers on the board (a tap, a second tap, a dragged box) opens the Controller with exactly those picked ('who' is 'picked'): Alber |  |
| E1004 |  | who goes: All, Idle, a Class (Foot, Archers, Cavalry, Siege) or a Squad; choosing one picks those soldiers on the board, so the rings show w |  |
| E1005 |  | what they do: Attack lights and waits for a spot on the map, then Execute; Retreat sends the picked home at once; Defend goes at once (E1002 |  |
| E1006 |  | a tap on the board while the Controller is open: on my own soldier it picks or lets go; with soldiers picked (by hand, or All, a Class, a Sq |  |
| E1007 |  | the map's things that are not trees, kept as one list and remade only when a thing comes or goes (as E709 keeps the buildings): of 8,500 thi |  |
| E1008 |  | who works what, counted without walking the whole map: only the things worked last step are cleared, then each worker counts onto his own |  |
| E1010 |  | which villager a wild animal is fighting, gathered once a step; before, every villager searched every unit every step |  |
| E1011 |  | whether food is within reach of a hungry side, asked once a second, and everyone fed in one pass once a second (D-peaceBeat) with the second |  |
| E1012 |  | the trees near a spot, by the buildings' grid (D186), remade at most once a second: a felled tree is skipped by its amount |  |
| E1013 |  | wood is searched for near the worker, not across the map: within his search circle, doubled until a tree is found; tree farms are always can |  |
| E1014 |  | what a side can walk to is kept through building changes for one slow beat (D-beats.slow): before, every building placed made each computer  |  |
| E1015 |  | the fire-light rim of a figure or building, made once for its picture, the light's kind and one of dirs directions (D-light.rim), then stamp |  |
| E1016 |  | a light's glow painted once a kind and stamped at its size and the night's strength; before, a fresh gradient for every light every frame |  |
| E1017 |  | ice-shy (Albert, Nov 11: \They see their comrades fall through the ice and they just continue\): when ice cracks under a side or one of its  |  |
| E1018 |  | every lake has a ford (D374): a shallow bed through its middle, toward the middle of the map, laid without the dice so a map's other rolls a |  |
| E1019 |  | a struck soldier is heard: his own within crowd tiles (D-nerve) who stand idle or hold with no foe, and are not told to hold, turn on the at |  |
| E1020 |  | my soldier left idle far from his post (past the yard, D-yard) holds where he stands and does not walk home alone (Albert, Nov 10: soldiers  |  |
| E1021 |  | a computer thinks in slices across steps (E684): its hall can fall between two slices, and the next slice then asked a hall that was gone fo |  |
| E1022 |  | the Market sells and buys by the lot at the going price (D270, D271), the Workshop is set to cloth or beer, a mercenary camp is hired from i |  |
| E1023 |  | a caravan takes a trade route two ways: Trade route on its card sends it to the nearest trade stop not held by a foe (the safest; measured N |  |
| E1024 |  | the Relations and Misfits rows work: each shows your stance (Foe red, Neutral white, Friend green); War, Terms and Ally go through setRel (a |  |
| E1025 |  | no food for a villager: the People icon wears the cannot-afford fade, red at nothing to white as the food comes (Decisions Nov 11, #22: red  |  |
| E1026 |  | a tower, Town Center or castle shoots: its reach is measured from the tile it stands on. A building has no tile field, so its height over th |  |
| E1027 |  | Focus (Decisions Nov 11, #17): a villager you send to a find or a post by tap is focused on it (the F mark): he does not move on to a richer |  |
| E1028 |  | every drop-off offers its plot on its own card (Decisions Nov 11, #11; Albert: a Mill should offer a farm as Lumber offers a tree farm): the |  |
| E1029 |  | a find you can gather that stands behind trees shows its ring through them, dashed like your hidden people's (E984) and in the find's own co |  |
| E1030 |  | one schedule for everything that waits its turn in a building (Decisions Nov 11, #19): for each item its time until it starts and until it i |  |
| E1031 |  | Protect's three (Decisions Nov 11; Albert: Protect is really a lure): each garrisons your villagers as Garrison does, and those the building |  |
| E1032 |  | an order's food is charged by the ground marched, not by the tap (Decisions Nov 11, #4; Albert: \moving everyone at once makes people hungry |  |
| E1033 |  | Prep (D375): one tap and every villager, working, idle or sheltered, stops and walks to the nearest of your buildings not yet boarded (two t |  |
| E1034 |  | a boarded building shows its planks across its foot, one by one as they go on |  |

## ground

| Code | Name | Value | Cited |
|---|---|---|---|
| G5 | dry grass; a boot's grip on dry ground | {mu: 0.35, grip: 0.7} | N104; N18; N173 |
| G6 | mud: wet ground or marsh; a boot's grip on it | {mu: 0.25, grip: 0.45} | N105; N18; N173 |
| G7 | snow cover; a boot's grip on packed snow; full: the depth (mm of water on the ground) at which the ground is wholly snow for footing and the skin, covers: the depth from which the ground counts as snow (and wet ground as mud at the same share) | {mu: 0.14, grip: 0.3, full: 5, covers: 0.5} | N106; N18; N173 |
| G8 | ice that bears a walker; a boot's grip on it: melting ice grip at and above freezing, rising to hard ice's cold at at °C under | {mu: 0.1, grip: 0.055, cold: 0.18, at: 20} | N107; N18; N178 |
| G9 | the friction a step needs, by what steps: a person's utilized friction (Burnfield & Powers), a horse and an engine's haulers (Mid's design, to open) | {person: 0.21, horse: 0.25, engine: 0.3} | N179; N19; N173 |
| G10 | slipping: iron studs give at least studs on ice; a slip holds a walker secs; each walker is checked every second; the town is told at most every tell seconds | {studs: 0.2, secs: 1.5, every: 1, tell: 20} | N174; N179; N173 |
| G11 | what a step presses on the ground (Albert, Nov 8 16:31: a foot with a shoe, a wagon, a knight, and what they carry): the area of one print in m² (a shoe's sole, a shod hoof, an iron-rimmed wheel's patch on soft ground, a foot) and how many bear the weight at a walk; the pressure is the whole mass (body, mount, kit and load) × g over them | {person: {area: 0.026, feet: 1}, horse: {area: 0.0125, feet: 2}, engine: {area: 0.008, feet: 4}, elephant: {area: 0.12, feet: 2}, deer: {are | N271 |
| G12 | a meadow's topsoil: it gives way past its precompression stress, pa pascals dry, less by soft at full wetness; past it a step wears the grass by the log of the pressure over it (soil compression, Terzaghi), so a step that presses less wears nothing, a horse wears some three times a person, and wet ground wears faster; the ruts count person-steps (D294) | {pa: 10000, soft: 0.5} | N271; N272 |

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
| W25 | a tree of the woods by a village: woodland edge and coppiced wood stand 10–15 m (a high forest oak 20–25 m); its crown hides what stands behind it (sight) and the drawing stands this tall; the low end, coppiced wood by the village (Nov 8 13:08; was 15) | {height: 10} | N258; N259 |
| W26 | a berry bush (bramble, hawthorn, elder: 1–3 m) | {height: 1.5} | N259 |
| W27 | a rock outcrop where stone, gold or iron is dug: a tor or a lode's face standing out of the grass, about two men high (Nov 9 19:21, Albert: v80's gold, stone and iron piles, which read at a glance; tors stand about 3 to 5 m, from memory, to open; Nov 8 13:08 was 1.2, before that 2 m) | {height: 3} | N259; N287 |
| W12 | timber | {density: 600} | N87 |
| W15 | stone | {density: 2400} | N87 |
| W16 | iron | {density: 7870} | N87 |
| W17 | a boar | {kg: 80, height: 0.9, com: 0.5, foot: 0.3, stride: 1.2} | N85; N170 |
| W18 | a bison | {kg: 700, height: 1.8, com: 1.1, foot: 0.6, stride: 2.2} | N85; N170 |
| W19 | a sword | {kg: 1.2, blow: {kg: 1.2, mps: 8}} | N177 |
| W20 | a javelin, its blow thrown | {kg: 1, blow: {kg: 1, mps: 20}} | N177 |
| W21 | a crossbow, its blow a bolt | {kg: 5, blow: {kg: 0.1, mps: 62}} | N177 |
| W22 | a matchlock gun, its blow a ball | {kg: 5, blow: {kg: 0.02, mps: 449}} | N177 |
| W23 | a war elephant | {kg: 3600, height: 2.7, com: 1.5, foot: 0.45, stride: 2.5} | N177 |
| W24 | a unit of a load carried: set so a full load (D87) is Mid's 0.9 of the walk under Pandolf (QCB) | {kg: 1.4019} | N173; N185 |

## measure

| Code | Name | Value | Cited |
|---|---|---|---|
| D1 | (the board plus the same sea all round, 450 a side, Albert, Nov 10 18:22) the site, the whole world | 3960 | N112 |
| D2 | (Albert, Nov 10 18:20-18:22, the map twice the area: the played land's side × √2, 216 to 306 tiles, area 2.007×; the zones from each corner unchanged, so the new land is all between the seats) the board, the played land | 3060 | N112 |
| D3 | the zones' edges from each corner: Z1, Z2, Z3 (Z4 beyond) | [300, 600, 900] | N112 |
| D7 | the play edge, in from the coast | 60 | N112 |
| D8 | Small: a building 2 × 2 tiles | 2 | N112 |
| D9 | Standard: 3 × 3 tiles | 3 | N112 |
| D10 | Medium: 4 × 4 tiles | 4 | N112 |
| D11 | Large: 6 × 6 tiles | 6 | N112 |
| D12 | a tile | 10 | N112 |
| D13 | the land's height over the water | 24 | N112 |
| D14 | the sand's top (N11: a narrow beach, the water filling close to the grass, Albert Nov 10) | 6 | N112 |
| D15 | the dirt's top: a thin lip of dirt between the beach and the grass, like a cut bank (N11, Albert Nov 10) | 10 | N112 |
| D16 | a beach falls to the water over | 80 | N112 |
| D17 | a cliff falls over | 4 | N112 |
| D18 | the coast wanders in and out by | 24 | N112 |
| D19 | the sea is darkest this far out | 60 | N112 |
| D20 | (Albert, Nov 10 18:20: days moved too fast; doubled, 120 to 240 s) a day (Y1) | 240 | N112 |
| D21 | (Albert, Nov 10 18:20: doubled with the day, 180 to 360 s, so a season stays a day and a half) a season (Y2) | 360 | N112 |
| D22 | (four seasons, doubled with them) a year (Y3) | 1440 | N112 |
| D23 | bare ground this high over the land | 12 | N112 |
| D24 | water deeper than this is not waded | 4 | N112 |
| D25 | (Albert, Nov 10 18:20-18:22, the map twice the area: doubled with the area, the same density) lakes, how many | [6, 12] | N112 |
| D26 | a lake's radius | [50, 160] | N112 |
| D27 | a lake's depth at the middle | 12 | N112 |
| D28 | a shore's wander as a share of the radius | 0.25 | N112 |
| D29 | a river's depth | 8 | N112 |
| D30 | a river's half-width as a share of its lake's radius | 0.25 | N112 |
| D31 | a river's wander | 80 | N112 |
| D32 | a bank falls over, in units: 3 horizontal to 1 vertical over the land's height (NRCS Pond 378: 2:1 or flatter; 3:1 so a tile's diagonal falls 4.7, under REPOSE's 6.75, and the bank draws as smooth sheets, no wall faces; Albert, Nov 10, #2); no steeper than people can walk down to the water (the angle of repose, A3, a tile's fall at most REPOSE), so the shore stays open to fishers and to the ice; the dirt ring is gone (D15) and some ponds are filled to the grass (D352) (Nov 8 14:21: 12 left every bank a wall nobody could step down) | 72 | N112; N303; N304 |
| D374 | a lake's ford (Albert, Nov 11 23:31: "The lakes need land bridges"; his armies drowned crossing or had to be steered round by hand): every lake has one shallow crossing through its middle, pointed at the middle of the map, so the way between towns never has to go over deep water or ice; it runs reach lake-radii each way, half a river ford (D33) wide each side, and its bed lies at deep of the wading depth (D-wade), shallow enough to walk and never counted as ice | {reach: 1.5, wide: 0.5, deep: 0.25} | N326 |
| D33 | a ford's length | 40 | N112 |
| D34 | a stream's half-width | 6 | N112 |
| D35 | a stream's depth | 2 | N112 |
| D36 | (Albert, Nov 10 18:20-18:22, the map twice the area: doubled with the area, the same density) hills, how many | [4, 8] | N112 |
| D37 | a hill's radius | [80, 160] | N112 |
| D38 | a hill's height | 14 | N112 |
| D39 | (Albert, Nov 10 18:20-18:22, the map twice the area: doubled with the area, the same density) rocks, how many | [6, 12] | N112 |
| D40 | a rock's radius | [15, 35] | N112 |
| D41 | a rock's height | 18 | N112 |
| D42 | (Albert, Nov 10 18:20-18:22, the map twice the area: doubled with the area, the same density) crevices, how many | [2, 4] | N112 |
| D43 | a crevice's half-width | 8 | N112 |
| D44 | a crevice's floor | 13 | N112 |
| D45 | a crevice's length | [150, 300] | N112 |
| D46 | a road's clear half-width | 50 | N112 |
| D47 | the middle kept clear | 150 | N112 |
| D48 | the woods' longest wave | 500 | N112 |
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
| D62 | (Albert, Nov 11, N24 #17: home gold piles 3 → 6, so more can mine at once; a design number) the pocket as Mid laid it (QCS), its home piles half again (Albert, Nov 10, #7: more in Zone 1): zone 1 behind the Town Center holds the price of age (its index here) plus 6 villagers (D124 UV) and 5 houses (D123 BR1) in 2 bushes and 2 trees; the home finds, [piles, amount a pile] at Mid's RICH 2.5 and HOME.rich 1.18, each kind grown by FIND_SIZE (Albert, Nov 7 14:47: copy Mid; replaces the calculated one-age-up store of Nov 6); the home pocket's trees 12 → 14, 15% more (Albert, Nov 8 08:57) | {age: 1, back: {vils: 6, houses: 5, bushes: 2, trees: 2}, home: {bush: [8, 180], tree: [21, 120], gold: [6, 300], stone: [3, 300], iron: [3, | N322; N256; N242; N304 |
| D63 | Z1 the pocket: no woods, open from edge to edge; Mid's pocket once, at D70's spots (QCS) | {trees: [0, 0], x: 1} | N228; N242 |
| D64 | Z2 the town: no woods, no finds, open to build | {trees: [0, 0], x: 0} | N228 |
| D65 | Z3 the transition (the player's Zone 2, the ring past home): its clusters half again bigger, the same number of spots (Albert, Nov 10, #8); the woods thicken from none at its inner edge to Z4's share at its outer edge (an ecotone), so it is more open than Z4; its finds laid by the Randomizer, the same in every corner, as Mid's wild finds, [piles, a pile's amount at RICH 2.5]: two bush patches of 7 x 180, groves of 20 and 14 x 120, a pair each of gold, stone and iron x 350, each pile then x FIND_SIZE and the land's amt (QCS) (Albert, Nov 6 16:01–16:03; Nov 7 14:47 copy Mid) | {trees: [0, 0.4], finds: {bush: [21, 450], tree: [51, 300], gold: [3, 875], stone: [3, 875], iron: [3, 875]}} | N228; N231; N242; N304 |
| D66 | Z4 the wilds: the woods' share of the land they may grow on, about the woods D49's threshold gave (a quarter of all Z4's land, the roads, the middle and the slopes counted) | {trees: [0.4, 0.4]} | N112; N228 |
| D67 | villagers counted | 6 | N112 |
| D70 | Z1's spots in the corner's frame (Albert, Nov 10, #6: closer to the Town Center, gold and stone side by side: each about 150 units, 19 m, from the TC at D84's spot, gold and stone 64 apart behind it, iron just past them, as ores lie together in a seam; berries and grove to either side); iron added with Mid's fifth home find (Nov 7); at the real scale drawn in to 0.55 of Mid's distance from the Town Center (D84), the layout kept, then held in metres when the tile became 1.25 m (Nov 8 13:08: ×2.4 in units): berries and the home grove about 33 m off, gold and stone 40 m, iron 31 m, a walk of 20–30 s, as a village sits beside its fields and wood (Albert, Nov 8 10:04: move things closer) | {bush: [175, 345], tree: [345, 175], gold: [200, 245], stone: [245, 200], iron: [185, 185]} | N112; N258; N304 |
| D73 | Z4's gold piles | [4, 6] | N112 |
| D74 | stone piles | [3, 5] | N112 |
| D75 | iron piles | [3, 5] | N112 |
| D76 | (Albert, Nov 10 18:20-18:22, the map twice the area: doubled with the area, the same density) berry patches | [12, 20] | N112 |
| D77 | bushes a patch | [4, 6] | N112 |
| D78 | ruins | [2, 2] | N112 |
| D79 | cemeteries | [1, 2] | N112 |
| D80 | campfires | [2, 3] | N112 |
| D81 | treasures | [1, 2] | N112 |
| D82 | a thing's stand wanders in its tile by | 3 | N112 |
| D83 | under this many pixels a tile things are dots and the grid is off | 5 | N112 |
| D84 | the Town Center's spot in the corner's frame, Z2 on the road: Base's 325 from the land's edge (MID − CORNER, decision 5a; Albert, Nov 7 19:35: a bit closer to the corner) | [325, 325] | N112 |
| D85 | units a metre, read off the Town Center as drawn: its door's point (12 drawing units) is a person's height, 1.8 m, so its wall is 3.3 m, one storey, a hall (Albert, Nov 8 13:08: a person the height of the door; the hall one floor). A tile (10 units) is 1.25 m, the Town Center 7.5 m, a house 2.5 m, the land about 270 m across; was 3.333 (a tile 3 m) and before that 11.7 | 8 | N112; N258 |
| D86 | speeds in metres a second (walk: quick time, 120 steps of 30 in a minute, 3.4 mph); Mid's own by its walker's 24: a rider 36 (ride), an elephant 22, an engine 12 (push), the bombard 10 (drag), the small camp wagon 14 (cart), the boar 30, the bison 70, the scout 27 (F17b); the bandit 26, the robber 32, the vagabond 20, the wayfarer 22 and the wagon train 16 (F31); the Mongol horse archer 40 (steppe) and the Mali horseman 38 (F36, Mid's civ units); a post rider 49 (post: Mid's TELL.ride, F35) | {walk: 1.52, ride: 2.28, horse: 1.9, push: 0.76, drag: 0.6333, deer: 1.5, wolf: 2.5, bear: 1.5, boar: 1.9, bison: 4.43, elephant: 1.3933, sc | N71; N72; N73; N79; N170; N176; N198; N223; N225 |
| D87 | a load | 10 | N112 |
| D88 | gathering a second, the old game's own (fish and meat Mid's, for when they come) | {bush: 0.9, tree: 0.75, gold: 0.6, stone: 0.55, iron: 0.5, fish: 0.8, meat: 1.2} | N70; N164 |
| D89 | the next find within | 100 | N112 |
| D90 | (Albert, Nov 10 18:20-18:22, the map twice the area: doubled with the area, the same density) deer herds | [6, 10] | N112 |
| D91 | a herd | [3, 5] | N112 |
| D92 | wolf packs | [2, 3] | N112 |
| D93 | a pack | [2, 3] | N112 |
| D94 | a wander's mean wait | 6 | N112 |
| D95 | its reach | 60 | N112 |
| D96 | the poses of one stride (two steps): stand, left foot, stand, right foot; pose 3 is the strike and never shows while walking (Albert, Nov 10, #34: people carry tools at rest and swing only at work) | [0, 1, 0, 2] | N113 |
| D97 | a work beat | 0.4 | N112 |
| D349 | the pace meter (Albert, Nov 8 13:38: measure on the phone itself): its line centred across the screen, top px from the top, just under the message line (Albert, Nov 11 05:50, 05:56: at the top left it showed off screen on his phone; centre it where it was), its font, averaged over tau s, its shadow blur px | {top: 92, font: 600 13px system-ui, tau: 0.5, blur: 3} | N208; N321 |
| D350 | ice on the water, by the real rules (Albert, Nov 8 14:15: the math, the weight, how ice grows and how long it takes, the size of the lake). Freezing degree-days are the freezing °C·s over a day (D20). The water first freezes once it has lost its stored heat: onset.metre °C·days for each metre of depth, times (1 + onset.fetch × the lake's radius ÷ onset.per m), as deep water stores more heat and a wide lake is kept stirred by the wind; then the ice thickens by Stefan's law, h = alpha × √(degree-days past the onset) cm, alpha bare 2.7 for clear lake ice, snow 1.4 under snow, which insulates it. Gold's formula gives the load a sheet bears, P = A h² kg (h in cm): A load.safe 3.5 is the safe working load, load.fail about three times that breaks it. Every beat s the load on each tile of ice is weighed (a unit's mass from the Mass book): over the safe load the ice cracks (heard and seen, warn s), and if still over it then breaks at a chance growing as the square of the overload, at once past the failing load; whoever is on the tile goes through, and anyone within near tiles at fall; the hole, hole tiles wide, skins over again from that day. Ice bears a walker for a route where it holds a person at failure. Drawn: steps bands of the ice's onset over span °C·days, at a, the cracks in rays of rays segments turning zig, line px; the walking key changes each key degree-day. Under snow (over dust) a frozen lake turns white as the land does, yet still reads as a lake, as it does in nature: the snow on it lies flat and bright, the wind scours streaks of grey-blue ice bare (streaks of streak px, leaning with the wind, at scour), and the shore shows as a rim line where the ice meets the bank (rim px below the edge); remade only at snowSteps of snow | {steps: 6, span: 12, a: 0.9, alpha: {bare: 2.7, snow: 1.4}, onset: {metre: 3, fetch: 0.5, per: 100}, load: {safe: 3.5, fail: 10.5}, beat: 0. | N17; N173; N262; N263 |
| D351 | how your people cross ice, your choice (Albert, Nov 8 14:21: one at a time, single file, thin out, normal, stick to edges; remember this winter or this game): an order whose way runs over ice asks first and waits at the shore (ask); normal steps on as it comes; file keeps gap tiles to the one ahead on the ice; thin out keeps gap tiles; one at a time lets most on the ice at once; stick to edges weighs each tile of ice by edge × its depth in metres, so the way keeps to the shallows, which froze first and are thickest; go around keeps off the ice. The computer and the wild step on only where the ice holds ai of them at the safe load. Clear off sends everyone on the ice to the nearest land within reach tiles; its button stays show s after the last of yours is off | {modes: [normal, file, thin, one, edge, around], rules: {normal: {}, file: {gap: 1}, thin: {gap: 3}, one: {most: 1}, edge: {edge: 4}, around | N263 |
| D352 | the share of ponds filled to the brim: grass runs to the water with no sand (Albert, Nov 8 14:16: lakes full to grass in some cases), as a pond in a meadow | 0.35 | N112 |
| D98 | frames a second, the screen's own rate on most phones (Albert, Nov 8 13:38: snappy; was 30); the draw budget (D321) drops to its fps when a phone cannot keep up | 60 | N112 |
| D99 | the latitude | 45 | N112 |
| D100 | the seasons' mean air, spring to winter | [10, 22, 12, -6] | N112 |
| D101 | the day's swing | 6 | N112 |
| D102 | P(wet | dry), P(wet | wet) an hour | [0.12, 0.65] | N7 |
| D103 | (Albert, Nov 10 18:55: more storms, so lightning is seen: from the top 40% of wet spells, not the top quarter; three 15-minute games had 0 to 90 s of storm) a wet spell is a storm (lightning) from this intensity (the top quarter, as v100's 0.25 of wet hours before) | 0.6 | N112; N185 |
| D104 | wet settles in | 20 | N112 |
| D105 | dries out in | 50 | N112 |
| D106 | walking costs of mud and snow | {mud: 0.8, snow: 0.6} | N112 |
| D107 | snow a second when it snows | 0.03 | N112 |
| D108 | melt a °C·s | 0.004 | N112 |
| D112 | between flashes | 0.34 | N112 |
| D113 | the startle of a strike is Mid's (25-view-weather): a bolt on the screen whites the picture bolt[0] + bolt[1] × its nearness within near m, a sheet flash sheet[0] + sheet[1] × the dice, and the ground shakes shake s (Albert, Nov 7 20:47: a war game, I want to be startled); a flash is stroke.n return strokes (3 to 5, by the dice) gap s apart, as real ground flashes (CIGRÉ TB 549), each re-lighting the bolt and the sky and fading in fade s, the bolt gone life s after the last; the sky's white capped at cap; the bolt's three lines (glow, mid, core) width and alpha, brighter and wider than Mid's, its near flash raised (Albert, Nov 10, N17 #15: louder, brighter, more startling); timed on the wall clock so game speed does not shorten it; a strike closer than flash.close draws a bolt, else a sheet flash far screens away; the sky's flash fades in decay s; the bolt's own drawing (Base's and Mid's, moved here from the code): its dice, lead and top in px, its steps, jag and pull to the strike point, its forks (count, skip, length, steps, width share) and the glow at its foot (radius px, alpha, squashed by half to the ground); between strikes in a summer storm, seconds; the year's cloud-to-ground flashes by season (spring, summer, autumn, winter) over the United States, NLDN 2005–2014: 64% in June–August (Holle & Cummins), the other three read from their Fig. 2; a season's storms strike at the summer rate × its share ÷ the largest share, so lightning comes all year and is rare in winter (QCT) | {summer: 6, share: [0.2, 0.64, 0.13, 0.03], flash: {bolt: [0.7, 0.3], sheet: [0.25, 0.3], near: 900, close: 0.4, far: 4, decay: 0.09}, bolt: | N112; N243; N310; N307 |
| D114 | (Albert, Nov 10 18:20-18:22, the map twice the area: doubled with the area, the same density) marshy lakes | [2, 4] | N112 |
| D115 | a marsh's width | 40 | N112 |
| D116 | Fast, for testing | 8 | N112 |
| D117 | sight by real math (QAL, QAM, QAN), looked again every tick s: a person is made out by day at day m; the eye's range falls with the light as the log of E from floor lux (the eye's absolute threshold, 1e-6 cd/m² seen on a grey of 0.2 reflectance: Hecht, Shlaer & Pirenne 1942) to ref lux (Sloan 1968: acuity linear in log luminance; by starlight that leaves near Mid's night share); the eye sees luminance, the light × the ground's albedo: grass about 0.2, snow 0.8, so a snowfield under the moon is seen four times as far (Albert, Nov 7: the woods by moonlight on snow), by the snow's share of full cover (G7), was (E ÷ ref)^p, at most the day's; the light E = the sun's by its height (sun: height in degrees, lux, between them by the logarithm), plus the moon's full lux × its lit fraction^log2(full ÷ quarter) × sin(its height) (deg to the half turn), plus the stars' star lux; under cloud all of it × overcast ÷ star; the horizon √(earth × h) for an eye h m up (earth the Earth's diameter, m); a person's eye and top body m; a standing tree as tall as D326 gives its kind | {tick: 0.5, day: 1500, body: 1.7, earth: 12742000, ref: 400, floor: 1.6e-05, albedo: {grass: 0.2, snow: 0.8}, sun: [[-12, 0.008], [-6, 3.4], | N41; N215; N216; N217; N218; N220; N247; N248 |
| D120 | a shadow at most this many heights | 3 | N112 |
| D122 | the sides in play, by corner: you (0) and the three computers, Mid's Raiders (1), Rivals (2) and Fortress (3), the rival across the board listed first (v100's one rival before); the Natives' place, Mid's fifth side in the middle, waits for the Throne | [0, 2, 1, 3] | N114; N202; N203 |
| D123 | what a thing costs (Mid's BLD and UNIT cost, by the 10:31 rule, every building that had none too (F26+F27); a second Town Center Mid's town, each unit the Mid kind it wears) | {BTC1: {wood: 400, stone: 300, food: 200}, BR1: {wood: 30}, BI1: {wood: 80}, BI2: {wood: 80}, BI3: {wood: 80}, BCL1: {wood: 60}, BM1: {wood: | N168; N176; N194; N195; N198; N225 |
| D124 | seconds to train (Mid's UNIT t for every unit, Albert, Nov 5 10:06) | {UV: 8, UM1: 10, UM6: 12, UM2: 10, UM7: 9, UM8: 12, UM9: 14, UM10: 12, UM3: 16, UM11: 14, UM12: 28, UM4: 20, UM13: 24, UM5: 25, UM14: 40, UM | N169; N176; N194; N195; N198; N225 |
| D125 | one villager's seconds to raise a site (Mid's build times, BLD t; the Town Center a second one, Mid's town; every building that had none, Mid's, F26+F27) | {BTC1: 60, BR1: 12, BI1: 15, BI2: 15, BI3: 15, BCL1: 10, BM1: 25, BM2: 25, BM3: 25, BM4: 30, BW1: 10, BW2: 12, BW3: 25, BW4: 6, BCL2: 12, BC | N169; N168; N195; N198 |
| D126 | n villagers raise it at n^this | 0.7 | N114 |
| D127 | the people a building houses (the Apartment Mid's twenty) | {BTC1: 10, BR1: 5, BR2: 20} | N69; N235 |
| D128 | the most people, soldiers among them (Mid's POPMAX, by the 10:31 rule) | 180 | N176 |
| D129 | each age's price and its wait in seconds, by the ages of D130 (Mid's AGES); the sixth is hidden until a year of peace opens it; the first age up sizes Z1's food (Mid's pocket) | {cost: [{}, {food: 300, wood: 100}, {food: 600, gold: 200}, {food: 1000, gold: 500, stone: 200}, {food: 1600, gold: 900, stone: 300, iron: 4 | N160 |
| D130 | the six ages (Mid's names; Albert, Nov 5 10:30) | [Stone, Bronze, Classical, Medieval, Gunpowder, Enlightenment] | N160 |
| D131 | (Albert, Nov 10 18:20-18:22, the day and season doubled to slow the sky, the economy kept per minute: a day's share doubled with the day, so a person still eats 3.75 a minute) a share: what one person eats a day (Mid's UPKEEP.share, 30 food a minute feeding eight) | 15 | N170 |
| D132 | move on when another find pays this much more (Mid's 1.18) | 0.18 | N114; N164 |
| D133 | who trains whom: a shell, or a class (every kind of it that is trained, each from its age; the rebels fight as Foot and are never trained); the scout at the Town Center (Mid's keep); the camp wagons at the Stable, villagers, foot and archers at the training tent (Mid's also) | {BTC1: [UV, US4], BM1: [Foot], BM2: [Archers], BM3: [Riders, UT2, UT4], BM4: [Engines], BP3: [US1], BP6: [US2], BP8: [US3], BCR1: [UT1], BTC | N114; N176; N194; N195; N198 |
| D134 | the bell | 900 | N114 |
| D135 | the score's divisors | {unit: 5, bld: 5, tech: 5, wealth: 10} | N75 |
| D136 | a farm's food a second (Albert, Nov 11, N24 #16: the old game's 0.4 × 1.25, so 15 farms feed 60 villagers and 120 soldiers at the Medieval age; the climb by research follows the record: English wheat net of seed 8.71 bu/acre in 1250-1299 to 23.16 in 1800-1849, ×2.7, Broadberry et al. via Wikipedia, N324) | 0.5 | N69; N322; N324 |
| D137 | a find no path reached is left alone for | 60 | N114 |
| D138 | a unit's health, blow, reach and sight in tiles (Mid's ÷ D12), pace; a soldier's tags, its counters (vs: × its blow on a kind, class or tag), its blow on a building (bld, × its blow), roofed (rarmor, × arrows and bolts it takes), building-only (bonly) and kiting (kite), every one Mid's UNIT (no flat armour: its armour is the research share D228); its health and blow open for Albert's play test; the boar and the bison Mid's; a civilisation's own kind is the kind it replaces with Mid's few changes (F36) | {UV: {hp: 25, atk: 3, rng: 1, rof: 1.5, tags: [civ]}, UM1: {hp: 60, atk: 6, rng: 1.2, rof: 1.2, sight: 13, tags: [infantry, spear], vs: {Rid | N69; N170; N176; N188; N194; N195; N198; N225 |
| D139 | a building's health, Age of Empires II's by Albert's call (Nov 5 10:06): the same kind of building there, or its class: a castle or wonder 4800; a market, temple, school, library, hospital and the other halls of a town, and a smith's, mint's, foundry's or workshop's shop 2100 (its Market, Monastery, University, Blacksmith); a war council a barracks' 1200; an apartment or tavern a house's 550; the store a camp's 600; the tree farm, pasture and quarry a farm's 480; the trade post an outpost's 500; the dock Age of Empires II's; a camp's tents and depot a camp's 600, its tower a watch tower's 1020, the abatis a palisade's 250; the traps Mid's (no kind in Age of Empires II) | {BTC1: 2400, BR1: 550, BI1: 600, BI2: 600, BI3: 600, BCL1: 480, BM1: 1200, BM2: 1200, BM3: 1200, BM4: 1500, BW1: 1800, BW2: 2750, BW3: 1020, | N69; N169; N170; N196; N198 |
| D141 | a blow from behind the line lands this much harder (Mid's FLANK) | 1.3 | N188 |
| D142 | a wave breaks under this share of its start (QBQ); a soldier's loss drains each one near 1 ÷ (this × n) (QAI) | 0.3 | N76 |
| D143 | what shoots: its blow, seconds a shot, the reach of its bow from the ground and its height (tiles), its reach's research (rng adds): Mid's watchtower, Town Center, camp tower, trade post and castle; it shoots as far as an arrow loosed from that height lands (QAJ); the Courthouse shoots only what ticks its only (Mid's spyonly) | {BW3: {atk: 10, rof: 1.2, bow: 10.6, h: 4.4, rng: 0}, BTC1: {atk: 7, rof: 1, bow: 10.6, h: 3.4, rng: 0}, BTC8: {atk: 6, rof: 1.4, bow: 9, h: | N188; N39; N40; N194; N195 |
| D144 | a soldier takes up a fight within | 8 | N114 |
| D145 | seconds between its path checks | 1 | N114 |
| D146 | wildlife bites within | 3 | N114 |
| D147 | tiles a chase may search | 2500 | N114 |
| D148 | seconds between a soldier's looks around | 0.5 | N114 |
| D152 | a home goes up when fewer than this many places are left (Mid's think: the people and the queue within two of the room) | 2 | N202 |
| D157 | villagers sent to a site | 2 | N114 |
| D162 | the glass redraws every | 0.25 | N114 |
| D163 | a reason stays | 2.5 | N114 |
| D164 | what is drawn once and kept, at the phone's own pixels: sprites kept to a budget of pixels (the woods are one sliding picture since Nov 10, like the land), the oldest dropped first (the ground is one picture at every zoom, as Base, Mid and v80 drew it: Albert, Nov 10 07:54, the chunks cut) (an iPhone page is closed when its canvases pass a few hundred MB: Albert, Nov 8 08:04, the map fuzzy on the phone) | {sprites: 16000000} | N114; N254; N255 |
| D165 | the camera by a person's height on the glass: the game opens with a villager px tall (20 since Nov 9 19:21: further out, as v80, where the town, the trees, the bushes and the gold show on one screen; was 40), and comes no closer than most px; the screen's size of the people comes from the person, not from a building (Albert, Nov 8 13:08; was the Town Center at 0.3 of the width, a villager 12 px, and a closest zoom typed as 6) | {px: 20, most: 60} | N115; N287 |
| D166 | the screen jolt: pixels a m/s the struck one is sent, at most, for, and from what speed | {px: 1, max: 3, s: 0.08, from: 1.5} | N116 |
| D167 | blood lost at the shock classes' edges: II, III, IV (health lost read as blood lost) | [0.15, 0.3, 0.4] | N77; N78 |
| D168 | gravity, m/s² | 9.81 | N117 |
| D169 | the ground a find keeps clear round it, in units | {gold: 9, stone: 9, iron: 9, ruins: 14, cemetery: 12, campfire: 6, treasure: 4} | N112 |
| D170 | a wall piece: one tile | 1 | N112 |
| D171 | the build: First Keep v100, the build number | 100 · 12 | N118 |
| D172 | the stores every side starts with: the five yields, and none of the goods | {food: 200, wood: 200, stone: 200, gold: 200, iron: 0, wool: 0, cloth: 0, beer: 0, spice: 0} | N119; N195 |
| D173 | tiles a site is searched for, ring by ring | 30 | N120 |
| D176 | the town is big enough to save for the next age with base + per × its age villagers (Mid's 12 + 4 × age), and the personality's soldiers (ageArmy) | [12, 4] | N202 |
| D177 | a tower counts as this much strength in the odds (Mid's 120; v100 held 100) | 120 | N157 |
| D178 | the rings, in tiles from-to, a computer searches for a site: a home round its hall, a drop-off round the find, a plot, a mill, the personality's buildings, a second place to train, a tower toward the middle, a Wonder, a trade post on its stop (Mid's findSpot bands ÷ D12) | {home: [6, 19], drop: [3, 7], plot: [6, 17], mill: [9, 17], build: [9, 21], line: [9, 22], tower: [0, 9], wonder: [12, 26], post: [0, 1], st | N202 |
| D180 | the soldier a computer wants first, before it has chosen a counter (Mid's want, the spearman); the rest it chooses by D291's counter | [UM1, UM2, UM3] | N202 |
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
| D195 | (Albert, Nov 11, N24 #17: a gold vein holds 4 at once, was 3; a design number) the forager: a field (or a tree begun) counts as life loads; how many a find holds before they crowd (QX); the finds one works at a time: a tree one feller, a field one worker (the Open style) | {life: 20, hold: {tree: 1, bush: 2, fish: 2, stone: 3, gold: 4, iron: 3, carcass: 2, other: 2}, cap: {tree: 1, bld: 1}} | N322; N164; N166 |
| D196 | standing, in metres: a pace apart (3 ft), near enough a spot to stand on it (a quarter pace), the ring a find is worked from (Mid's WORK_R); the lattice's rings, pack × √(D128) and spare more, its second axis at 60° (hex, QCI); two who meet part with pass as much again to the side, each to its right, so they slip by (QCJ) | {apart: 0.9144, arrive: 0.2286, work: {fish: 1.495, other: 1.035}, pack: 0.525, spare: 2, hex: [0.5, 0.866025], pass: 0.5} | N164; N165; N166; N167 |
| D197 | a worker whose find is gone looks from metres, widening by grow over tau seconds (Mid's REACH ÷ 2 and × 1.5), waits at its drop-off and looks again every again seconds | {from: 14.95, grow: 44.86, tau: 20, again: 2} | N164 |
| D198 | the eight ways from a tile, the four straight first | [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]] | N74 |
| D199 | how many of a building a side may have, by age (Stone to Gunpowder; a later age keeps the last), research adding to each (Forest law, QCA); null: no limit; the Town Center counts the ones past the seat (Mid's cap, its town's for a second one) | {BTC1: [0, 0, 1, 2, 2], BTC2: [0, 0, 0, 1, 2], BTC5: null, BTC6: null, BTC7: null, BTC8: null, BR1: null, BR2: null, BCR1: [1], BCR2: [1], B | N168; N198 |
| D200 | the age a building opens in (Mid's BLD age; the rest from the first) | {BTC1: 2, BTC2: 3, BTC5: 1, BTC6: 1, BTC7: 1, BTC8: 1, BR2: 2, BCR2: 3, BCL4: 2, BCT1: 1, BP1: 1, BP2: 2, BP3: 1, BP4: 2, BP5: 2, BP6: 2, BP | N168; N198 |
| D201 | a villager mends a whole building in time × its build time, for cost × its price, paid as it goes; within this much of its health it is whole (Mid's) | {time: 3, cost: 0.25, within: 0.5} | N168 |
| D202 | a building taken down pays back share of its price, early (all of it) while the site is under first raised; what waits in its line comes back in full (Mid's shellBack) | {share: 0.5, first: 0.15, early: 1} | N168 |
| D203 | a line of wall gets crew builders at most, who work down it; a builder done takes the next wall piece within wall tiles, else a site nobody raises within site tiles, else goes back to its work (Mid's 60 and 220 units in its 10-unit squares) | {crew: 2, wall: 6, site: 22} | N168 |
| D204 | done: the share at which a site stands finished; a site stands at start of its health and gains rise of it as it is raised (Mid's mkBld and bldTick) | {start: 0.1, rise: 0.9, done: 1} | N168 |
| D205 | a building that costs stone rises at share in frost, the air at or under at °C: mortar will not set (Mid's frost weather) | {share: 0.5, at: 0} | N168 |
| D206 | placing, in tiles unless said: lane tiles round every building and from every find (walls, gates and fields may touch; nothing touches one that trains); grab: a touch within this share of the footprint (or lift px) grabs the ghost, farther away it looks around (Mid's nearGhost); the ghost snaps beside one of yours, touching or a lane apart (gaps), within near, or in line with one within guide along the board's rows (align: centre to centre, edge to edge, flush, as the ghost's side then its, in footprints; the guide drawn pad past both), to the nearest spot within tol (least, or zoom ÷ the zoom), start from the screen's middle; a find stands half a tile in; on a phone the ghost waits lift px above the finger; within edge px of the screen the map scrolls scroll px a second; a wall corner is caught within hit px, and a drag nearly flat or upright, under 1 in flat, is made so; after a building the next spot is its size and next for its material away (timber leaves a gap for fire); the tint and the ghost's alpha; a corner's knob, the lines' widths and dashes in px; a tile's corners in order (Mid's) | {lane: 2, gaps: [0, 2], near: 4, half: 0.5, guide: 26, align: [[0, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]], pad: 1.2, tol: {least: 1.4, zoom | N168 |
| D207 | while walls are laid: a foe's walk out from the Town Center reaching reach tiles is a way in, shown, else Sealed; looked again every seconds (Mid's SEAL) | {reach: 38, every: 0.3} | N168 |
| D208 | the computer's wall ring: ring tiles out from its Town Center, an arc of ± steps of step rad facing the middle, its gates the two squares nearest the middle and laid first; from age, with stone, up to pieces a round while it keeps that much stone (Mid's WALL_R, 260 units in its 10-unit squares, and wallPlan; the balanced computer walls) | {ring: 26, steps: 66, step: 0.019, gates: 2, age: 1, stone: 60, keep: 40, pieces: 3} | N168 |
| D209 | what fits a tapped spot, in tiles and scores: a drop-off for finds within near × r with none within dropR; more of what stands within r (a home: a home; a field: a mill, then a field; an army building: the one you lack; a wall: a gate; the Town Center: a home, keep); a narrow way, its disc of area tiles between choke solid: a wall, or a gate beside your wall; a home when room is short (Mid's SUGGEST) | {r: 14, near: 0.85, dropR: 11, drop: 3, kin: 3.5, keep: 1, area: 4, choke: {lo: 0.35, hi: 0.75}, chokeW: 4, room: 2, short: 1.5} | N168 |
| D210 | a building that needs another of its side standing first (Mid's: the Apartment an Aqueduct) | {BR2: BP7} | N168 |
| D211 | the shares a kind eats, its Upkeep: a person one, a foot soldier 1.5, a rider 3 (its horse's fodder), a cart 2; a wagon none (Mid's UPKEEP) | {person: 1, foot: 1.5, mounted: 3, cart: 2} | N170 |
| D212 | (reach: food counts as in reach only within reach m of one of the side's own food drop-offs, the home zone's outer edge (D zone, 600 units); Gemini's audit, Nov 10, BUG-06: a berry bush anywhere on the map had kept famine away) (Albert, Nov 10 18:22: the day doubled, the economy kept per minute: days halved, the same minutes of full strength) a famine (the store empty, no food in reach): full strength for days, then work and blows at work (the Minnesota study's grip, 58.2 to 41.8 kg); fed again with more than fed in store (Mid's STARVE, UPKEEP.hunger) | {days: 1, work: 0.72, fed: 20, reach: 75} | N170; N171 |
| D214 | (Albert, Nov 10 18:22: the day doubled, the economy kept per minute: loss a year and rest a season doubled, the same change a minute) a field's soil: it loses loss a year while worked (worked within the last worked seconds) and wins back rest a season at rest, never under floor nor over full (Mid's FERT) | {loss: 0.2, rest: 0.8, floor: 0.6, worked: 2, full: 1} | N29; N170 |
| D215 | the year's harvest, rolled each spring: the first row whose upTo passes the roll gives the fields' m; one year in 20 fails (half), one in 6 is poor (30% less), the rest normal (Mid's HARVEST, its chances summed) | [{upTo: 0.05, m: 0.5}, {upTo: 0.21666666666666667, m: 0.7}, {upTo: 1, m: 1}] | N170 |
| D216 | each season's field yield, spring to winter (Mid's SEASONS) | {farm: [1, 1.1, 1.25, 0.4]} | N170 |
| D217 | (Albert, Nov 10 18:22: the day doubled, the economy kept per minute: the year doubled, so the share a year is 1 − 0.95², the same spoiling a minute) food in store spoils this share a year, taken at each season's turn; a loss of say or more is told (Mid's SPOIL; the FAO's 2 to 10%) | {year: 0.0975, say: 20} | N32; N33; N170 |
| D218 | fish: a spot every per of a lake's radius, inset into the water from its shore, each holding amt × the radius ÷ r0 (Mid's 350 × its RICH 2.5); they regrow each spring at r a year toward that (QY), and are worked only within near of a finished dock of the side; a dock stands within shore of a lake past its beach (Mid's FISH, DOCKR, lakeGap) | {amt: 875, r0: 60, r: 0.5, per: 10, inset: 8, near: 150, shore: 70} | N27; N28; N170 |
| D219 | a pasture's flock: start sheep, at most max; lambs each spring at lambs toward max (QY); a tended flock is culled to hold (half the most) each spring for mutton food a sheep (QZ); its shepherd takes milk food a second a sheep; a wolf or bear within wolf takes up to take sheep a season (Mid's pasture, LAMBS, FLOCK, MUTTON); a tended flock is shorn each spring, fleece wool a sheep, into the store (Mid's FLEECE) | {start: 6, max: 12, lambs: 0.6, milk: 0.03, mutton: 100, wolf: 260, take: 2, takers: [MW4, MW6], hold: 6, fleece: 7} | N27; N28; N170; N195 |
| D220 | the food game gives when it falls (Mid's meat × its RICH 2.5) | {MW3: 500, MW7: 850, MW8: 1000} | N170 |
| D221 | a villager's javelin strikes game at blow times its blow (Mid's huntTick) | {blow: 5} | N170 |
| D222 | a plot (a field or a tree farm, the Field tick) holds lasts seconds of its yield at its rate when it is raised (a tree farm's rate here, a field's D136), then is cut out or worn out; replanted at replant × its price (Mid's treefarm; Albert, Nov 4 and Nov 8: fields and tree farms both 36 minutes) | {lasts: 2160, rate: 0.55, replant: 0.5} | N170 |
| D223 | the boar of each corner and its spot in the corner's frame, about 300 from the Town Center and clear of the home pond (Mid's boar, 280 to 380 from the keep) | {code: MW7, at: [470, 660]} | N170 |
| D224 | the pace (QCB): each state that slows a walker, by the field that holds it (sickness 0.8; quicksand 0.3, D308; Mid's; a scout stalking unseen at half its pace, sneak: N281); a boot with no iron has no studs; how deep each sinks in mud, a foot 1 and the camp wagons' wheels 2 (Mid's wheelMud); Pandolf's coefficients, standing, load, walking and grade (W, kg; V, m/s; G, %); a grade as a percent; a body's drag area grows as its mass to the two-thirds (geometric similarity) | {state: {sick: 0.8, sand: 0.3, sneak: 0.5}, bare: 0, sink: {foot: 1, UT2: 2, UT4: 2}, pandolf: {stand: 1.5, load: 2, walk: 1.5, grade: 0.35} | N13; N173; N181; N185; N198 |
| D225 | ice on the ground: it grows while the ground is wetter than wet and the air below freezing, full at fdd freezing °C·s (thickness ∝ √), and thaws melt a °C·s above freezing (Mid's CLIMATE.ice) | {wet: 0.225, fdd: 500, melt: 0.0064} | N17; N173 |
| D226 | the most soldiers a side may have, queued ones counted (Mid's ARMYMAX: the phone's ceiling); a fallen side's share adds to it | 120 | N176 |
| D227 | the most soldiers a squad holds (Mid's BNSIZE), with the squads | 40 | N176 |
| D229 | weather by one intensity I, 0 to 1, drawn at a wet spell's start (QCL): the drops drawn on the glass, the biggest falling glass px/s across the screen whatever the zoom (Mid's 420; the real speeds keep their ratios); rain most mm/h (Marshall–Palmer drops, N0 and the rate's power; sizes dMin to dMax mm; extinction beta C^pow a km with C the rain's water g/m³ = mp.a R^mp.b, Marshall–Palmer), snow most mm/h of water (extinction beta C^pow a km, CALVIS's Stallabrass, C the snow's water g/m³ = S ÷ (perHour × a flake's fall m/s); flakes fall slow to fast m/s); every haze term is CALVIS's (Albert, Nov 7: all weather is real); a drop's fall speed a − b e^(−c D) (QJ); wind most m/s, gusting ± gust of it by a fractal of the day's dice (seed, k waves, dimension, period s), so a gust is 1 + gust of the wind; visibility k ÷ extinction a km, km metres to one (QK); a blizzard by the NWS: wind or gusts at least wind m/s (35 mph), visibility under vis m (a quarter mile), for hours; the white veil's most (Koschmieder's contrast lost over the screen's width); a pool of particles whose active count is the strength; fog by the atmosphere (QK, QCL): the air keeps its dew point; rain or snow falling saturates it (the dew point is the air's); cooled under it, the excess vapour is fog water C = (e_s(dew) − e_s(T)) ÷ (Rv (T + K0) ÷ per) g/m³ by Magnus (e, a, b hPa), in calm air only (wind at most calm m/s, 7 knots: a stronger breeze mixes it away); past lwc g/m³ the rest settles as dew and lowers the dew point; fog's extinction beta C^pow a km (Kunkel's, in NOAA's CALVIS); fog by the WMO's line under wmo m; drops: a drop len px plus the second times its size share, its alpha and width likewise, a flake flake px plus the second times its share, snow's alpha; a phone that sheds motion draws shed of the drops, never none (weather is information: Albert, Nov 9), and Reduce motion holds them still, as SoRen's | {pool: 240, glass: 420, rain: {most: 50, n0: 4.1, exp: -0.21, dMin: 0.5, dMax: 4, beta: 2.24, pow: 0.75, mp: {a: 0.072, b: 0.88}}, snow: {mo | N9; N10; N180; N182; N183; N184; N186; N187; N185; N210; N211; N212; N213; N214; |
| D230 | the most tiles the way (QBL) opens before it gives up; the most places tried for a wild group | {way: 20000, spot: 100} | N112 |
| D228 | the share of a blow a soldier takes before its armour research, which keeps the lowest share it reaches (Mid's stats armor) | 1 | N176 |
| D231 | a soldier's nerve, 1 when steady (Albert, Nov 10 18:55: soldiers ran like big babies; measured 10 v 10, the first ran at 7.8 s with one dead a side: a blow no longer shakes nerve, only losses near him and being outnumbered do, so a line holds together and breaks together near breakAt of its men lost, as ancient lines did); a kill gives kill; a loss drains each of his side within crowd tiles 1 ÷ (breakAt × their number) (QAI), so the whole group, not only the few beside him, shares it and breaks near breakAt lost; outnumbered more than this to one within crowd tiles drains odds a second; at rest it settles back over tau s (QP), shelter times faster within shelterR tiles of its own wall or tower; broken, it runs from the nearest foe within flee tiles, run tiles a step, for the run's seconds (D239 rout), takes routHit, and comes back at after, turning on the nearest foe within flee tiles, or else walking back to its place by its building (Albert, Nov 10 18:55: the rallied stood idle and the fight stalled); an animal's blow lands at wild and shakes no nerve (Mid's MORALE) | {full: 1, kill: 0.04, odds: 0.02, crowd: 10, outnumbered: 1.5, tau: 15, shelter: 1.5, shelterR: 6, routHit: 1.5, after: 0.6, wild: 0.5, flee | N188; N76; N16 |
| D232 | where a blow comes from: a comrade within cover tiles on that side covers it; the line's facing sums those within line tiles; a blow is from behind past the behind cosine, from the side under cos; only a blade (reach up to melee tiles) flanks (Mid's FLANKING) | {cover: 3, line: 4, cos: 0.5, behind: -0.5, melee: 2} | N188 |
| D233 | a building that falls pays its destroyer this share of its price (Mid's PLUNDER) | 0.25 | N188 |
| D234 | blades brittle in frost and rusted in rain or snow strike this much less, less each research's share (Mid's CLIMATE.wear; Tempering, Oiled steel) | 0.15 | N188 |
| D235 | a soldier at home fights within this many tiles of its post or its Town Center (Mid's YARD) | 32 | N188 |
| D236 | a shooter reloading steps back back tiles from a blade within near, for hold seconds (Mid's KITE) | {near: 4.5, back: 2.8, hold: 0.5} | N188 |
| D237 | a soldier at rest within r tiles of its own shelter heals (Mid's GARRISON; its pace is D239's garrison, QP) | {r: 7} | N188; N16 |
| D238 | a soldier's choice of foe: its side within group tiles add their power (Lanchester); a foe that cannot hurt still counts least; it keeps a foe within leash × its sight × its temper's chase; the computers keep the temper guard; hold fights only within reach, press never kites; No pursuit (loose) looks step tiles past its reach, Buildings first (bld) takes the nearest building; a squad's plan steps by steps[1] under steps[0], else steps[2]; at home a soldier walks back when farther than near tiles from its post (Mid's GROUP_R, foeValue, TEMPER, INTENT, sqPlan) | {group: 6, least: 0.1, leash: 1.4, temper: {hold: 0, guard: 1, press: 2}, intent: {engage: 0, loose: 1, bld: 2}, step: 1, steps: [10, 1, 5], | N188; N36; N37 |
| D239 | the bases of shares that research moves and no shell holds: nerve's settling (rest, shelter), healing at a shelter (garrison: most health ÷ this, seconds), the run (rout, seconds), wear's research, a blow on a building, a charge, a walker's share of its pace from its shape and its march (pace), the room inside a building not in D256 (hold) (Mid's MORALE, GARRISON, fxv); Teach's opening (teach) and its time (lesson), Zeal's seconds, price and rest, a conversion's time, a watcher's sight of a spy (spysight), a healer's pace (heal); the Market's sale share's research (sell adds), trade's share (trade), the Bank's interest a minute, a venture's extra return, a stop keeper's extra cut, a good's making (make), Learning by doing (scale) and an armed caravan (armed); a soldier's hands at a camp (campbuild), the training tent's surcharge (tentcost), the Diplomacy research's lift on an envoy's odds (diplo); the sky told ahead in forecast steps (forecast) and Levees (flood: one wades a flood and keeps it from the buildings); fire arrows and burning shot (fire), petards (blast), and sickness's research: cure, death, sick (cases from outside), spread, plague and the exposure's cuts: chill (Chimneys, the town's), cold (Wool cloaks) and wet (Oiled cloaks) (F32, D354); the stranger's penalty's cut (guides, Local guides, D355) and the ambush's reach (spring, Guerrilla warfare); how far your news reaches (news, the Post line's level), the swing of the going price you meet (band) and the wait for the next charge (chargecd), F35+F36 | {rest: 1, shelter: 1, garrison: 0.6, rout: 8, wear: 0, bld: 1, charge: 1, pace: 1, hold: 0, teach: 0, lesson: 1, zealsecs: 0, zealcost: 1, z | N188; N194; N195; N198; N223; N225 |
| D240 | a squad's shape, each a trade: riders in it strike × dmg; it takes × hit, from riders × vsRiders; it walks × spd; an army marches in column once Formations is known (Mid's FORM, COLUMN) | {line: {dmg: 1, hit: 1, spd: 1, vsRiders: 1}, wedge: {dmg: 1.15, hit: 1.1, spd: 1, vsRiders: 1}, square: {dmg: 1, hit: 0.9, spd: 0.8, vsRide | N188 |
| D241 | an army stands in a grid gap tiles apart, about rows times as wide as deep, at most most files; at home in its building's yard tiles past it, a block a squad of √(n × block) files up to cols; a column three files, a choke three; support rings its blades round at least ring places (Mid's GRID, formUp, CHOKE) | {gap: 1.5, rows: 2, most: 14, yard: 2.4, block: 2.5, cols: 10, column: 3, choke: 3, ring: 6} | N188 |
| D242 | forming up: a soldier walking to its place in a drill stands and fights where it is when a foe will reach it before it reaches its place (its time to contact, distance over pace, against the nearest foe's; Albert, Nov 8: no clock, the real question); while two soldiers form, the one of lower precedence gives way (yield, lowest first: foot, then archers, riders, engines) and the push between them is soft × a full one (Mid's FORMING) | {soft: 0.5, yield: [Foot, Archers, Riders, Engines]} | N188; N273 |
| D243 | a squad's temper, Hold, Guard, Press: blows on it shake its nerve × nerve, it strikes × dmg, chases × chase (Mid's TEMPER) | [{nerve: 0.8, dmg: 1, chase: 1}, {nerve: 1, dmg: 1, chase: 1}, {nerve: 1.3, dmg: 1.1, chase: 1.3}] | N188 |
| D244 | Muster: a squad's lack in one order at the War Council, cost times the price, the slowest kind's time shared by its buildings, times time (Mid's musterCost) | {cost: 2, time: 1.25} | N188 |
| D245 | a missile's flight (QAJ): loosed at A5, stepped dt seconds, its speed found in tries halvings; drawn as a streak tail of its flight long; a blow's sparks last spark seconds, at most sparks at once | {dt: 0.01, tries: 24, tail: 0.12, spark: 0.3, sparks: 40} | N188; N39; N40 |
| D246 | with someone picked, a tap within find px of a resource takes that resource, a 60 px target past Apple's 44 (Albert, Nov 10, #23); the finger (Mid's 26-input, Albert's one rule, Nov 2): held hold ms it picks more on one of yours, drags the crosshair on it, else draws a box; its ring shows after show ms (a tap never sees it), ring px wide; a second tap within dbl ms and slop px opens the card; a finger that moves move px looks around (v100's); a unit within the larger of hit px (half of Apple's 44-pt least touch target, N133; was Mid's 16: a tap beside the figure fell on the ground and opened the sword, Albert Nov 7 20:30) and hitZ px a zoom, lift px a zoom over its foot, is under the finger; a box under box px is a tap; a marching group's ring answers within ord px; ms a second | {find: 30, hold: 320, show: 250, dbl: 320, ring: 26, move: 6, hit: 22, hitZ: 9, lift: 8, box: 12, slop: 26, ord: 26, ms: 1000} | N190 |
| D247 | orders and missions (Mid's HUD, ARMY_STILL, routeK, ordersTick; distances Mid's px ÷ 10, in tiles): a fight is the hostile soldiers seen within near tiles of a group; a mission whose chance (QAF) falls under lose says it is losing, once until it climbs past clear; the chance moves smooth of the way each beat s; reinforcements arriving within gap s of each other are one wave, at most waves; a soldier still for still s holds; the finger within aim px of the crosshair drags it; a soldier over home tiles from its place is rallying; the walk (QBL) is least to route times the straight line; an order has arrived when all have stopped after settle s; reinforcements stop once the power ratio reaches even; the crosshair reads red with a hostile within danger tiles (Mid's 60 px) | {near: 14, lose: 0.4, clear: 0.5, smooth: 0.3, gap: 8, waves: 3, still: 2.5, aim: 56, home: 1.4, route: 3, least: 1, beat: 1, settle: 3, eve | N190 |
| D248 | the War Director (Mid's DIRECT; Albert, Nov 8 20:33: one tap each, no holds): a shield wall stands secs s in a line wearing the shape's trade, holding, and where the land is narrow it takes the narrow's width in files (D.choke min to max; the old choke drag is gone); the archers may loose again after loose s, in an arc at arc of the shortest bow's reach round the foe for arcSecs s (Mid's three volleys); riders charge (D247). Advance, fall back, wheel and pull back are cut (Albert, Nov 3: pick the kind, tap where); bombard is cut (engines sent at a building strike it) | {wall: {secs: 12, shape: square, lay: line}, loose: 6, arc: 0.8, arcSecs: 18} | N190 |
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
| D268 | who heals its side's troops within r tiles (Mid's UNIT and BLD heal, hrng; the medical tent's too): the best in reach counts, its heal the health a second at the start, the wound closing as the first-order lag, tau = most health ÷ heal (QP) | {US2: {heal: 3, r: 5.5}, BP6: {heal: 3, r: 9}, BTC5: {heal: 2, r: 7}} | N194; N198 |
| D269 | priests and medics walk with the army (Mid's followArmy, tiles): to the nearest soldier of their side out within r, back tiles behind it, once more than near from there | {r: 26, back: 2.4, near: 1} | N194 |
| D270 | the Market: a yield is traded by the raw lot, a good by the good lot; worth is a raw lot's gold at the normal price, a good's its own (D272); it pays sell of worth (research adds) and charges buy, both × the going price (QAE) and the coin (D273); what it sells and what it buys (wool goes to a Workshop, not to market; spice is the only good not made here) (Mid's LOT, TRADE, SELL, BUY, MKT_SELL, MKT_BUY) | {lot: {raw: 100, good: 10}, worth: {food: 80, wood: 80, stone: 110, iron: 120}, sell: 0.8, buy: 1.25, sells: [food, wood, stone, iron, cloth | N195 |
| D271 | the going price: × (Q/Q0)^(−1/eps), Q/Q0 the stock against its normal (q0 of a raw yield, of a good), never under least; the price kept within floor and cap; the stock settles toward normal (QP) over tau seconds each slow beat; spice settles dearer, × spice, while one side holds a whole route (Mid's PRICE, priceDrift; staples inelastic, the study's 0.27 to 0.81) | {eps: {food: 0.5, wood: 0.8, stone: 1, iron: 1, wool: 0.8, cloth: 1.2, beer: 0.8, spice: 1.5}, q0: {raw: 1000, good: 100}, tau: 100, floor:  | N34; N195 |
| D272 | the goods, made, stored and carried beside the five yields: base, a good's gold at a Market next door; wool raw (made into cloth, never sold); spice not made here: bought at a trade stop for buy (Mid's GOODS) | {wool: {base: 2, raw: true}, cloth: {base: 7}, beer: {base: 5}, spice: {base: 9, buy: 5}} | N195 |
| D273 | debasing the coin at a Mint: debase gold at once, and every Market price × price for the rest of the game; sound coin × sound (Mid's MINT; Rome's denarius) | {debase: 600, price: 1.3, sound: 1} | N195 |
| D274 | a venture: gold sent from the Market from the age at age, at most max out at once, comes back after a year × back (research adds), or not at all with chance lost; the sizes offered (Mid's VENTURE; the commenda) | {age: 3, back: 1.4, lost: 0.2, max: 3, sizes: [100, 250, 500]} | N195 |
| D275 | the Bank: each minute, the gold held × the interest research gives, whole, at most cap (Mid's BANK_CAP, bankTick) | {cap: 40} | N195 |
| D276 | what a shop makes, from what in store, at what rate a second for its one worker: the Workshop cloth from wool or beer from food, the Mint gold from stone, the Foundry iron from wood (Mid's BLD makes) | {BI8: {cloth: {from: {wool: 2}, rate: 0.12}, beer: {from: {food: 3}, rate: 0.15}}, BI6: {gold: {from: {stone: 1}, rate: 0.2}}, BI7: {iron: { | N195 |
| D277 | Learning by doing: once learned, each farm, tree farm, quarry, mint or foundry of a side past the first adds per to all of its kind, at most cap of them (Mid's SCALE; its share a plot, Mid's stand-in for the learning curve) | {base: 1, per: 0.05, cap: 4, kinds: [BCL1, BCL2, BCL4, BI6, BI7]} | N30; N195 |
| D278 | trade (Mid's LOAD, CARAVAN, TRADE_CAP, TRADE_DIV, POST, PLACES.stop, ÷ D12 in tiles): a caravan carries load, of a yield only what passes keep in store, at least least of each it takes, the carried in this order of worth; each stop wants one of the wares and pays want for it; a sale pays more the farther it went, × (1 + d ÷ per tiles), at most far; an ally run pays d² ÷ div (d in tiles), at most cap; a caravan sent to the best stop takes the one its load pays most at (Mid's bonus for a stop is on every choice, so it changes none); whoever holds a route's four stops is paid all gold a second; a stop's keeper takes cut of others' sales by the stops of its route it holds, at most cutMax; a caravan within safe tiles of its side's trade post or tower, or a soldier of its side within near, is left alone by robbers; at most guard soldiers escort a caravan or garrison a stop; a caravan is at a stop within reach tiles; the routes run along the board's two middle lines (routes), their stops at stops tiles from the middle, each laid on the nearest free tile within find; the stops' pay each beat | {load: 20, keep: 600, least: 1, carried: [cloth, beer, spice, food, wood, stone, iron], wares: [cloth, beer, spice], want: 1.5, per: 100, fa | N195; N197 |
| D279 | the war camp (Mid's CAMP, its reaches ÷ D12 in tiles): soldiers raise its pieces at build of a villager's hands (Field logistics brings them to one), mend a piece worn under mend; a training tent trains at extra over the price; the badly hurt (under home of their health) by a medical tent walk to the Hospital, looked at each send beat; the trees within burn tiles of the camp burn (burns), and those outside a large camp's square and off its home side (open rows) are laid as abatis, built; a depot holds supply food, the soldiers within reach tiles eat from it, and a Market caravan runs load food to a depot under half for fee gold each per tiles, leaving keep in the store and never under least food; a minute of rain, snow or frost takes wear of each piece's health, never under floor; a camp stands edge tiles from the map's edge, on land (over water), off buildings (OCC over node) and the ground a find keeps (OCC, not woods), a lane round each piece, reach (D287) plus findR tiles from a gift; facing home, else south; one camp of a size at a time, most from the age after; a soldier of any class but not raises it, looking each look beat within raise tiles (Mid's 160 + 3 × 60), each hand already there counting crowd tiles more; the camp says it is out of food once each say s; the yard holds hold (Mid's) | {build: 0.6, extra: 0.25, home: 0.5, burn: 1, burns: tree, supply: 600, load: 200, fee: 2, per: 10, reach: 12, wear: 0.03, mend: 0.6, keep:  | N198; N199 |
| D287 | the war camp's two sizes (Albert, Nov 5 11:16 (7); Mid's outpost and camp, 38-camps campLayout): each opens in its first age (one, two from the age after); the small (BTC4) is the four tents and a tower in a file, a square between each, broadside to home (Hyginus §1: a century's tents in one line), clear of gifts by reach tiles; the large (BTC3) needs its research and a Store standing, a palisade square of side tiles, the gate the two middle squares of the home side, a tower at each corner inside the stakes, the hospital across the yard from the training tent (§4), the mess at the back, the depot inside the gate; spots are [code, across, along toward home] in tiles from the wagon | {small: {first: 1, reach: 9, spots: [[BTC5, -6, 0], [BTC6, -3, 0], [BTC7, 0, 0], [BI5, 3, 0], [BTC8, 6, 0]]}, large: {first: 2, tech: campwa | N198; N199; N200 |
| D280 | field traps (Mid's trapsTick, CALTROPS, STAKES, NATIVE.scoutSees, trapR, pit and stuck, ÷ D12 in tiles), looked at each beat: a scout within scout tiles finds a hidden trap for its side; a foe of another side within r tiles springs it: a pit hurts a share of its health and holds it stuck s, stakes hurt (a horse worse), a net takes a villager or a soldier (not an engine) prisoner; caltrops spike one walker once each again s, a horse worse and stuck, and are trodden flat after hits; its side and its allies walk free. The archers' stakes are cut (Albert, Nov 8 19:12); the traps are the Natives' only (SN3) | {scout: 6, r: 1, beat: [0.3333, 5], kinds: {pit: {hurt: {foot: 0.4, horse: 0.4}, stuck: {foot: 4, horse: 4}}, net: {take: {not: [Engines]}}, | N198; N199 |
| D281 | relations (Mid's NOTICE, judgeEnvoy, PEACE.truce, overlordWhy, sendHelp): war comes notice s after it is declared (no ambush from peace); an envoy is heard within at tiles; a court at war asked for peace by an envoy takes it free unless its own odds (QAF) pass peace (plus the Diplomacy research), then it asks gold × (1 + odds × its odds), rounded to round; asked for an alliance it says no if the asker's odds are under weak, or if its own pass strong and it has no other war; a side twice (overlord) an ally's army may offer to be its overlord; an ally sends all but keep of its soldiers at home to a friend's town under attack | {notice: 30, at: 3, peace: 0.6, weak: 0.3, strong: 0.7, truce: {gold: 120, odds: 2, round: 10}, overlord: 2, help: {keep: 0.5}} | N198; N199 |
| D282 | a wild group's regard for each side (Mid's REGARD), on scale: it starts at regard0; at peaceAt the group leaves the side be, under it the group is a foe; at allyAt an envoy makes a friend of it, and the friendship ends slack under; a blow on one of the group costs hitCost, once each hitGap s; turning on it yourself costs warCost; a gift of up to giftMax gold in steps of giftStep buys regard by QCD (per gold a point, at least floor, danegeld less for each gift in giftWindow s); it drifts back by decay with the Natives' beat (waits with the Natives) | {regard0: 20, peaceAt: 40, allyAt: 70, slack: 10, decay: 0.1, hitCost: 2, hitGap: 3, warCost: 20, giftMax: 300, giftStep: 50, danegeld: 0.5, | N198; N199; N201 |
| D283 | vassals and tribute (Mid's VASSAL, DEMAND, makeVassal, surrenderWhy, rebel, vassalTick; its fair TAX row as the one tribute: Albert, Nov 5 11:16 (2), the tax rate parked), reaches ÷ D12 in tiles (QCG): a side with surrender.men soldiers within surrender.r tiles of a rival's Town Center, the rival's army no more than strong of theirs, may make it a vassal (loyalty loyal0, light if it asked to be an ally's, unrest unrest0); each slow beat it pays tribute.take of what it gathered since (forced: × the second), its loyalty settles with tau s toward base + the lord's buildings within r tiles (D288, else invest) + garrison a lord's soldier there (at most garrisonMax) + protect (kill a foe the lord kills near it, at most protectMax, × decay a beat) − tribute.hate, its unrest moves by tribute.push (forced: + push's second) − loyalty ÷ calm, on scale; at giftAt it sends giftShare × (loyalty − giftFrom) ÷ 100 of each store each gift beat; at shareAt it gives share of its trade's gold up; over warn its lord is warned each warnGap s; at the top it rebels: rise of its villagers take up arms (rebel), its army turns, and it is crushed when under crushed of its fighters are left (unrest after, loyalty − lost, n0 at least) or free after freeAfter s; the lord may demand amt of a store (loyalty loses loyal × each demand in recent s), force tribute for tribute s with tributeMen soldiers at its town (unrest + tributeUnrest), or levy at least least and up to levyMax of its soldiers (each lost costs levyLoyal); two or more restless vassals may rise together each coalition beat: chance Σ(unrest ÷ 100)^pow × k × their number, warned over warn each gap s, those at rise or more | {r: 45, tau: 195, garrison: 0.5, garrisonMax: 15, kill: 1, protectMax: 20, decay: 0.98, gift: [60, 150], giftShare: 0.1, giftFrom: 50, giftA | N198; N199 |
| D288 | the loyalty a lord's building buys near a vassal's Town Center (Mid's BLD invest: a house, farm, store, tower, market, baths, theatre, tavern, town, castle, pasture, council, trade post, mint and hall); any other D283's invest | {BR1: 1, BCL1: 2, BI4: 2, BW3: 6, BCR1: 10, BP4: 5, BP5: 6, BCR2: 4, BTC1: 15, BTC2: 20, BCL3: 2, BP10: 6, BCT1: 6, BI6: 6, BP9: 3} | N198; N199 |
| D284 | Dynamic Diplomacy (Mid's LEAGUE): with least sides standing, when the leader's score is lead × the next best's the others (not the player, not its vassals) ally and make war on it; it breaks up under release, or when another leads; the next best counts at least floor | {lead: 1.4, release: 1.15, least: 3, floor: 1} | N198; N199 |
| D285 | the computer's relations (Mid's aiDiplomacy, allyDuty and peaceAll): losing at war (odds under peace, fewer than its personality's waveMin soldiers) it asks peace; at peace with no war on its hands it gives notice when its odds pass its personality's bold + lift + the difficulty's bold; at peace with every side it keeps stand of its army; an ally sends help each gap s at most, when foes stand within near tiles of its friend's town and none of its own, and its helpers go back to the pool after stay s still (Mid's assist idleT); the envoy's gap, when it courts allies and whether it gangs up are the difficulty's (D304) | {lift: 0.15, peace: 0.3, stand: 0.5, help: {gap: 30, near: 32, stay: 20}} | N198; N199; N202 |
| D286 | a building that needs research before it is placed (Mid's BLD tech); none since the caltrops left the Build menu (Nov 8) | {} | N198; N199 |
| D289 | a wave (Mid's WAVE and decideWar): it goes home beaten under broke of those who set out, or after stall s with neither a step tiles nearer its mark (the mean of its soldiers' distances) nor a blow within fight s; a side it stalled against is left alone cool s; a rival's Wonder is worth at least threat odds; within full of its army's ceiling it settles for settle odds; wonder soldiers go for a Wonder; its riders go for the foe's nearest drop-off | {broke: 0.35, stall: 45, step: 3, fight: 30, cool: 180, threat: 0.75, settle: 0.4, full: 2, wonder: 4, riders: Riders} | N202 |
| D290 | a computer saving for an age (Mid's SAVE): progress counts in steps of the age's price; stall s without one and it spends freely for spend s | {step: 0.02, stall: 90, spend: 45} | N202 |
| D291 | a computer's turn (Mid's think and aiEconomy, its numbers): a site nobody raises is looked at each site s; an Apartment for a Home from age with cost; a drop-off where crew or more work a yield whose nearest find stands farther than near tiles from one; a Mill after mill farms; soldiers within threat tiles of its hall stop its saving; a Scout after at s with food; the hall's line kept to line; food over the age's price by spare; extra wood for a second barracks or place to train when every line holds line; a tower out tiles toward the middle with stone; a Wonder from age with an army and spare over its price; priests with an army, most 1 (3 for a shrine-keeper), Zeal with gold when busy soldiers fight; medics; engines kept as the personality's siege + one a per soldiers, by cycle, every turn-th the age's late engine from age from; caravans; spies; any research every research-th turn when the list is done; Muster in eights; a villager carrying under carry moves; the army kept grows armyAge an age; a personality bold under never makes war; counter: a kind's score is its mean (its blow on each foe ÷ the foe's on it, at least floor) ÷ (its price ÷ per)^pow, the best two mixed, never of the classes in not; the job mix: iron from age iron, a Wonder-builder adds wonder to each, and the Stone age's and the early shares (each yield + its share of others); econ: from age and at s, ventures with spare gold over the age, most at once, of amt; trade posts on a free stop within far tiles; a Market, a Pasture (not for the brewer), a workshop (the brewer makes beer, the others cloth; a plot shop makes its own yield); caravans; routes looked at each route [s, phase] | {site: 3, apart: {age: 2, cost: {stone: 60, wood: 120}}, drop: {crew: 2, near: 11}, mill: 3, threat: 40, scout: {at: 60, food: 200}, line: 2 | N202 |
| D292 | (N26: the night's wash and the weather's veil together never hide more than stops photographic stops of the picture, a quarter of the light left: film's day for night, N327; Albert, Nov 11: "I need to see"; the dark still shortens what his people see) the moon (KH2): its month, new to new, in game days (Meeus 49.1, the synodic month); the night's share by the sun below the horizon, full at nautical twilight; the night's blue is dark × (1 − the eye's share of light), the same light sight reads (D117: the sun, the moon by its phase and height, the stars, cloud, and snow's albedo), so a full moon over snow glows and a new moon over bare ground is black (Albert, Nov 8); its shadow's strength (Mid's CAST.moon) | {month: 29.53, twilight: 12, dark: 1.1, cast: 0.07, stops: 2} | N2; N203; N327 |
| D293 | the sky told ahead (Weather signs): a forecast step is step s (Mid's minute, WX_EVERY), the chain rolled that far ahead in game hours; the chain's odds told in tenths | {step: 60, tenths: 10} | N7; N203 |
| D294 | the ground remembers (KI15, KI3): every unit-second walked on a square of cell tiles (a tile, so a path is as wide as the feet that make it, B24) deepens its ruts toward deep × the mud at n0 unit-seconds as (passes ÷ n0)^pow, the grass worn off it in the same measure (Cole and Bayfield: cover lost with passes); they heal with tau s, looked at every heal [s, phase]; the mud a step meets is the tile's wetness (D353, the wetness index: hollows and shores wettest) × (1 + the ruts), full where the flood stands (Mid's CLIMATE.rut, mudAt) | {cell: 1, n0: 300, deep: 1, tau: 600, heal: [10, 7], pow: 0.5} | N20; N203 |
| D295 | a flood (KI4): the water stands rise tiles over every shore for secs s; flood water is waded only with Levees, and a finished building whose middle stands within rise of the water, less half its size, loses hit of its health a second, looked at each beat [s, phase], unless its side has Levees, told each say [s, phase]; the flood shows at show of the water's colour (Mid's EVENTS.flood, lakeGrid, drawFlood) | {secs: 90, rise: 4, hit: 0.004, beat: [1, 11], say: [10, 13], show: 0.55} | N203 |
| D296 | the sky band along the top (Mid's SKY and drawSky), and a wash over the glass shows from least: h of the glass high, at most h px, at base strength fading down; the hour's colour (day, toward dusk by dusk × n × (1 − n) with n the night's share, night) cast toward the weather's by cast (rain the second); seven clouds crossing at speed + speed × their place in threes px a second, × calm + the wind's share of its most, placed on their own spacing (their place in threes, fours and twos: mod), w wide, tall, each with a second puff; their cover and darkness by the sky; the night darkens them by night; a frosty clear sky casts the frost colour at frost (Mid's WX_TINT) | {h: [0.16, 110], base: 0.6, dusk: 4, least: 0.005, cast: [0.55, 0.7], clouds: {n: 7, speed: [6, 3], calm: 0.4, x: [173, 240, 120], y: [8, 9] | N203 |
| D297 | ripples on the lakes (Mid's drawLakeRipples): n a lake, the i-th at angle i × turn + spin × t, out at (from + span × ((i × step + drift × t) mod 1)) of the shore, w wide arcs raised lift, line px | {n: 18, turn: 2.4, spin: 0.05, from: 0.25, span: 0.6, step: 0.37, drift: 0.02, w: 6, lift: 2, line: 1.2} | N203 |
| D298 | rain rings on the ground (Mid's drawRainRings): on a grid of cell units, one cell in show holds a ring at full rain (fewer as the rain eases), growing from r[0] to r[0] + r[1] px × the zoom, at most r[2], rate times a second, from zoom on | {cell: 120, zoom: 1.2, show: 3, rate: 1.6, r: [1, 4, 10], line: 1} | N203 |
| D299 | the ground remembers (Mid's scarCv): a layer over the ground at res of its scale, cleared with each map; worn earth round a finished building (an ellipse offset and sized by its width), the dark where one fell (bigger for a big body, with a blade's cut for a soldier), the scorch where lightning struck, burnt ground and five stones where a building fell | {res: 0.5, wear: [0.08, 0.12, 0.86, 0.72], fall: {rx: 4, big: 30, more: 3, ry: 2.2}, cut: [4, 1, 3, 1.5, 0.7], strike: [6, 4], burn: [1.05,  | N203 |
| D300 | the plots a computer builds and what each makes (Mid's PLOTS): one at a time, no more than its hands on that yield, when the plot's rate beats the best wild find's and pays its price back in the time left (QCM) | {BCL1: food, BCL2: wood, BCL4: stone, BI6: gold, BI7: iron} | N202 |
| D337 | the tower a computer raises toward the middle (Mid's tower, not the castle) | BW3 | N202 |
| D301 | the home a computer raises from D291's age when it has the stone and wood (Mid's apartment) | BR2 | N202 |
| D302 | the places to train a computer adds a second of when every one's line is full (Mid's barracks, range, stable) | [BM1, BM2, BM3] | N202 |
| D303 | the computers' three personalities, one brain (Mid's PERS): of, the personality of each side; goals, what its hands work toward first; mix, its share of villagers on food, wood, gold, stone, iron when nothing is short; extraBarracks, armyCap (the army it keeps, + D291's armyAge an age), waveMin (a wave's least), bold (the odds it needs to attack), guard (the share kept home), raid (riders sent at a foe's drop-off), towers, walls, opportunist (how much a foe busy with another war tempts it), early (villagers before soldiers), ageArmy (soldiers before it saves for an age), diplo, trade, spy, loot, wonder, siege (engines kept), shrine (priests kept); build: [building, from age, how many, with an army of at least, with stock in store]; techs: the research it wants, in order (Mid's crown, the games' goal, waits for the games); crown, the crown it chases (Mid's PERS crown: the war chaser alone breaks a board truce, the wellbeing chaser builds care) | {of: [null, aggr, bal, fort], aggr: {goals: [army, age, build], extraBarracks: 1, armyCap: 34, waveMin: 5, bold: 0.5, guard: 0.15, raid: 3,  | N202; N203; N222 |
| D304 | Easy, Normal, Hard (the Start card's Difficulty): difficulty turns the computers' minds, never their stores (Mid's DIFF): react, seconds between a computer's turns; bold, added to the odds it needs; opp, how much more a foe at another war tempts it; allyAt, seconds before it courts allies; gang, whether it allies against the score leader at peace; envoy, seconds between its envoys; wave, soldiers added to a wave's least (Mid's Easy +3); safe, seconds before anyone marches on you (Mid's EASY_SAFE) | [{react: 2, bold: 0.1, opp: 0.8, allyAt: 900, gang: 0, envoy: 240, wave: 3, safe: 360}, {react: 1, bold: 0, opp: 1, allyAt: 600, gang: 0, en | N202 |
| D305 | the finds of the wild (Mid's FINDS): each find's guards (kind, how many, laid on a ring ring tiles round it), what the first side to touch it within take tiles takes once they fall (got; ruins a free research of its age, tech), and drifters who fight for whoever pays (hire: price, kind, how many, laid in a row row tiles off it; a unit of the payer within near tiles); dens and drifters' camps laid in Z4 as lay, the robbers' camps camp tiles out from the middle along each trade route; looked at each beat. A guard or a beast looks look tiles for a stranger within home tiles of its home (a raider within its raid tiles, look plus reach), lets go past its leash (raid or the first, plus the second), goes home past back tiles; the horde breaks buildings within breaks; a defender weighs a stranger each weigh seconds, fighting with probability V / C at stake V (QAH); a computer's detachment (loot): with army soldiers at home and no wave it sends half of them (go at most, least at least) at the nearest find within far tiles (a guarded stop within stop, from the second age), calls them home when it is taken or give s after its guards fall, and hires drifters with gold in store (Mid's WILD_LOOK, wildLeash, lootRun, hire); the finds laid by their own dice (seed). The scout (Mid's PLACES.scout): a fallen find within far tiles with no other side within clear first, else a loop of the land, edge tiles in on its middle lines, keep tiles in front of each Town Center and mid tiles off the middle, each moved up to jit tiles, the next point within at | {rows: {MG4: {guard: [MW4, 2], got: {food: 100, gold: 150}}, MG1: {guard: [MH1, 3], got: {gold: 50}, tech: true}, MG2: {guard: [MH3, 2], got | N205 |
| D306 | a wayfarer every every seconds from the middle of one of the land's edges (edge tiles in, the next edge each time) to the far one; the first unit of a side within meet tiles gains his joins as villagers, gap tiles apart, or food if the town is full; at the far edge he is gone (Mid's WAYFARER_EVERY, wayfarers, wayfarerTick; the wagon train joins three) | {every: 240, edge: 6, meet: 2.2, food: 50, code: MH5, joins: {MH5: 1, MH7: 3}, gap: 0.6} | N205 |
| D307 | the robbers' raids (Mid's NATIVE raids, natRaid): none before from s (Easy adds its safe time), then a wait drawn between gap (halved by horde under the Outlaws hazard); for every side at war with the robbers, the camp nearest its seat sends its first n guards plus one for each age; the mark is a villager or caravan of any side they beat by the square law (QAF above beat), drawn by (1 + load × its load ÷ a full load) / (1 + guard × the armed strength within group tiles of it ÷ the band's) (QAR), × (1 + again[0] × e^(−time since that side was last raided ÷ again[1] s)): whoever pays best for the least risk, and a town robbed once is the likelier mark for a while (repeat victimisation, N274; Albert, Nov 8: not the side they like least); they come back after secs s; the first raid at half a wait; the raiders' camp (camp) | {from: 600, gap: [180, 480], horde: 2, n: 2, secs: 45, load: 2, guard: 1, group: 6, beat: 0.5, again: [1, 600], camp: MG7, first: 0.5} | N205 |
| D308 | the events (Mid's EV_MEAN, EV_MIN, EV_WARN, EVENTS, EV): one at a time; the next after min s plus a Poisson wait of mean − min (QM), told warn s ahead, then run for its secs; a kind that cannot come at its time waits retry s; never the same twice running; each in its seasons (spring 0) or in the rain. They come in at a spot edge[0] tiles in from one of the land's edges, edge[1] from its corners, and cross to the far side; or at a free spot of the wild, wild[0] tiles in, wild[1] from a lake and wild[2] from every Town Center (else wild[3] tiles north of the middle). The stampede's herd tramples each beat what stands within r tiles, a blow of trample, a shove of shove tiles and fert of a field's soil, and those still within gone tiles of their way out leave at its end; the falling star streaks in from up and left; the wildfire burns burn of a tree a second, spreads at spread × the ground's dryness (QT) to trees within r tiles, at most most alight, sets wooden buildings within bld alight, and starts keep tiles from every Town Center; the sinkhole takes hit of a building's health and cracks the ground (arms, length and bend); quicksand slows a walker inside r tiles to slow (D224); the wagon train joins three villagers (D306); the mercenaries are a find for their secs (D305). Base's heat wave, mirage, circus and aurora are back (Albert, Nov 8 07:26; the eclipse, back with them, is cut again Nov 8 19:25); the heat wave comes in summer under the drought hazard (dmg, spd); the mirage, in summer, shows dots of an army on the small map ahead tiles from your Town Center toward the middle (n dots, row a row, gap tiles apart), then says it was a mirage; the circus crosses with n performers (code), and a villager within r tiles of one gathers mul for cheer s; the aurora comes when the night stands at night or more, bands curtains (count, height share, alpha, sway, beat). The storm band and fog stay with v100's climate, which rolls both (one home); the dragon and the troll wait for World: Fantasy; looked at each beat; a field within field tiles of a running bison loses its soil | {mean: 120, min: 30, warn: 12, retry: 30, edge: [4, 30], wild: [20, 6, 42, 30], rows: {stampede: {secs: 30, n: 10, herd: MW8, spread: 4, tra | N205; N252 |
| D309 | the Challenge's hazards (Mid's HAZARDS, HORDE): each switched on adds its points to the level played, and the level multiplies the score by base + level / per (Easy keeps none and its base); the horde (Outlaws) comes after min s plus a Poisson wait of mean − min (QM), told warn and half warn seasons ahead, for the weakest side at war with the outlaws: n plus perAge for each age, of kinds in turn, spread tiles round a spot on the land's edge (at odds edge) or in the wild | {pts: {hard: 3, starve: 2, winter: 2, drought: 2, horde: 3, plague: 2}, lot: 0.5, base: 1, per: 10, horde: {min: 1200, mean: 1800, warn: [2, | N205 |
| D310 | fire (Mid's FIRE, FIRE_SMOKE, FIREARMS, ignite, fireTick): a burning wooden building loses burn of its health a second for its fire's strength; every check s it lights a wooden neighbour within reach tiles at a rate a second of rate × the ground's dryness (QT: η's coefficients eta, as a share of a dry day's, at most most) × its heat there, the t² fire grown in grow s and the radiant view factor (near / (gap + near))² (QU, gap in tiles); the crew nearest villagers of its side within run tiles run with buckets, each putting out douse of it a second; a big fire (spread, or the building below half) can take one of them, smoke a second. In a summer storm each side's wooden building is struck at a chance a minute of storm (drought's second), a Smith or Foundry sparks a wooden neighbour within spark tiles at sparks a minute; fire arrows and burning shot light a wooden building on a hit at chance × the dryness (a petard blast at blast, shaking the neighbours within splash tiles by hit of the blow); the flames drawn (tongues, width, height, sway, smoke); a full fire (full) in the summer (season, spring 0); the forges that spark | {rate: 0.12, grow: 20, near: 1, reach: 4, burn: 0.02, check: 3, douse: 0.2, crew: 2, run: 6, smoke: 0.008, eta: [1, -2.59, 5.11, -3.52], mos | N206; N21; N22 |
| D311 | (Albert, Nov 10 18:22: the day doubled, the economy kept per minute: a plague lasts one season, not two, the same minutes) sickness and healing (Mid's HEALTH, sickRisk, outbreak, healthTick; SIR, QAQ): each side's town (its people within near tiles of its seat, or by a depot) is looked at each health beat (D183): a case comes from outside each every s at a chance a minute of risk × (1 + D354 sick × the town's exposure to cold and wet) × research (sick); new cases β S I / N a beat, β = R0 (× plagueR0 in plague) / sickFor × the beat × research (spread); the sick are well again after sickFor s, cured at cure × research (cure) a beat within a healer's reach (D268), and die at death (× plagueDeath in plague) × research (death), a plague's deaths at most plagueCap of the town. A plague year comes at the spring turn while caravans are on the roads, at plague's odds (the Plague hazard's second), for lasts seasons; a caravan home from abroad then brings cases (cart of the town) at carts' odds. The sick work at work and strike at dmg (Mid's seasons table is gone: the weather itself, D354, is the one home for sickness by the season) | {every: 60, risk: 0.06, sickFor: 60, R0: 2, plagueR0: [1, 1.5], death: 0.004, plagueDeath: [1, 4], cure: 0.3, plague: [0.15, 0.45], plagueCa | N206; N47; N48 |
| D312 | each building's height in world units, its look's (Mid's LOOKOUT heights): its eye and its top for the line of sight (QAL, QAM) | {h: {keep: 34, house: 16, farm: 1, treefarm: 1, mill: 18, store: 20, lumber: 14, mining: 14, barracks: 22, wall: 18, pit: 0, net: 0, stakes: | N208; N41 |
| D314 | the small map (Mid's MINI_K, drawMini, miniIncoming, miniAt): px square, gap from the top and the edge; a finger that moves pan is looking; a seat's star (outer, inner, points), a building's square (wall, other, big at big tiles), a unit's and a find's dot; the outline's and the view box's line; the incoming army's flashing ring every beat ms, its radii, dot and line | {px: 172, gap: 6, pan: 8, seat: [7.5, 3, 10], bld: [2, 3.5, 5], big: 5, dot: 2, find: 3, line: 1, view: 1.5, inc: {beat: 350, r: [9, 6], dot | N208 |
| D315 | the camera's glide (Mid's spring, CAM_W): a critically damped spring of ω w, over in about 4/ω s; it stops within stop of its mark; past the board it may show sea px of open water on the sides and below (beyond what the bars cover there), and sky px above the far edge, where the sky's art will hang (Albert, Nov 8 21:44-21:45: more ocean to scroll out from the bottom; the top scrolls to sky) | {w: 9, stop: 0.3, sea: 48, sky: 160} | N208; N57 |
| D316 | every flame (Mid's FLAME): its power p, colour temperature K (kelvin), size on the glass s, and whether it is covered (a covered flame keeps its light in rain) | {candle: {p: 1, K: 1850, s: 0, covered: true}, lantern: {p: 4, K: 2000, s: 1.4, covered: true}, torch: {p: 9, K: 1900, s: 2.4}, hearth: {p:  | N208; N54 |
| D317 | a torch by every door, lit from the start, two on a building two tiles wide or more (Albert, Nov 10, #26); a flame's glow falls by the inverse-square law (QCU): brightness ∝ 1 ÷ (d² + s²), s the flame's own size as a share of its reach (falloff: stops drawn, s), zero at the reach where the eye stops seeing it; the lights after dark (Mid's LIGHT, glow, flame, flameShadow, HEARTH, drawLight): reach k × √power, what rain leaves of an open flame, the glow's strength and its stops (a quarter at half the reach, 1/r²); no glow under dark; rain's own dark; a building under hurt of its health blazes; windows after night; a lantern's door (across, down) and lift; the looks with a hearth; a window's place, size and alpha; a fire's shadow (darker, the flame's height, its width); the flicker by QCV (the flame's mean height and swing; the glow's swing, a few per cent; Cetegen and Ahmed's 1.5, and a torch's head of 8 cm, a design value with no source yet (about 5 Hz); the second rate's ratio, the golden ratio so the two never line up; Albert, Nov 10, N17 #5), the wind's lean, the teardrop and its white heart; a lantern lifted (door, scale; caravan right, up, scale); a flame's alpha; a campfire after nightfall by a drop-off where least or more of a side gather and bring their loads to it, looked at every beat s, set off tiles past the building's corner, never by a building with its own hearth, out at dawn (Albert, Nov 10, N17 #8: fires by the drop-offs where people work, big and bright, in place of fires among people standing together; near, Hall's social distance, kept for the lights' own record); every open flame's white-hot heart, a bloom core of its flame's size at alpha (Albert, Nov 10 15:30, the fire mock); the rim: a flame lights the side of each person and building that faces it, as bright as its glow at that distance (the glow's own falloff) times gain, rising from nothing at the middle of the figure to full at its edge nearest the flame (the lit half only: Lambert's cosine law, a surface takes light as the cosine of its angle to it), from the nearest open flame only; bright: how much stronger an open fire's glow is than the base (a campfire big and bright, Albert, Nov 10 15:07); the looks that carry a flame (a camp's fire, a caravan's lantern) | {two: 4, k: 12, wet: 0.4, a: 0.22, falloff: [8, 0.15], dark: 0.05, rain: 0.3, hurt: 0.5, night: 0.5, lamp: [0.6, 0.5], door: 3, hearth: [hou | N208; N54; N309; N307; N312 |
| D318 | a black body's colour by temperature (Mid's kelvinRGB, Tanner Helland's fit to the CIE locus, 1000 to 40000 K): t = K / t; red full to the knee, then r0 (t − r1)^r2; green g0 ln t + g1 to the knee, then g2 (t − g3)^g4; blue none to low, b0 ln(t − b1) + b2 to the knee, then full | {t: 100, knee: 66, low: 19, r: [329.698727446, 60, -0.1332047592], g: [99.4708025861, -161.1195681661, 288.1221695283, 60, -0.0755148492], b | N208; N209; N54 |
| D319 | theatrics (Mid's popC, celebrate, ripple, ripDraw, drawFlash): the pop's swell and its seconds, a unit's born pop; a finished building glows for secs at alpha; a ripple's life in s, radius from and growth, line; the flash's life and alpha; no two celebrations closer than calm s; an upgrade's wave (step, all, glow s, alpha); the size of a new age, a wonder or a victory; a ripple (a tap's ring, a building's) runs on the clock on the wall, not the game's: rip[0] s, its ring growing fast then easing as 1 − (1 − a)^ease, ms milliseconds a second (feedback starts within 0.1 s and lasts about a quarter second: Albert, Nov 8 08:52, the tap ring was slow) | {pop: [0.16, 0.6], born: 0.4, glow: [8, 0.32], rip: [0.25, 6, 18, 2], ease: 3, ms: 1000, flash: [0.9, 0.55], calm: 0.34, wave: [0.06, 1.2, 0 | N256; N257; N208 |
| D320 | the ring at a unit's feet, ring px across its half-width and half as deep (moved from the code, N17 audit); the picked unit's ring twice as thick (pick) and glowing (glow, its blur in px), green: a glowing, bigger ring, no words (Albert, Nov 9 18:13, 18:29); building and figure dressing (Mid's drawBld, smoke, flagsOn, pileAt, pileArt, LEAN, drawUnit, idleMark, shadowPath): a site's stakes, its walls rising (from, with the work) at alpha, its two posts, its bar (most, lift, mark); a chimney's plume (puffs, rise rate, lean calm and by the wind, rise, radius from and growth ∝ x^0.9, alpha, seed, a worker's seconds), Briggs' rise ∝ x^(2/3); a flag's fly, its wave (calm, most, by the wind), beat, seed, curve and line; a pile's least zoom, log₁₀ scale, most, rows, place, next pile, spacing, line; a woodcutter's lean in (a frame, most, kept off, at work within); a step's bob, a hurt soldier's sway, a lunge into a blow (s, melee, a shooter's kick s and px), a recoil (s, px), a stagger under this share of health, a melee reach in tiles; the marks over a figure (lift for small, big, tall; the nerve bar's width, lift, when it shows; the rout badge; the march chevron; z and F offsets; lines); a find's shadow (tree, other) laid along the sun; the grass's mottling (Mid's makeBg: blots, radius from and to; squashed, turned; its dice's seed) | {foot: 1.6, pick: 3.2, glow: 8, ring: 7, site: {dash: [3, 3], line: 1.5, show: [0.15, 0.85], a: 0.85, posts: [-0.45, 0.45], post: 0.8, bar:  | N208; N287 |
| D321 | (res: the picture's pixels at each level, a share of the screen's own (capped at 2x): full until level 3, then three quarters (44% fewer pixels at 2x: 1.5x), then half at level 4, the dynamic resolution phones and consoles use; Albert, Nov 10 22:47) the draw budget (Mid's DRAW, shed), in seconds, not frames (Nov 8 13:38: at 5 frames a second 120 frames was 24 s): a frame's drawing in ms (the simulation not counted: shedding drawing cannot cut it) averaged over tau s; over slow of the frame's interval at the rate it runs (ms a second ÷ the rate; SoRen's 12 ms and 7 ms of its 16.7 ms frame, as shares) for shed s sheds a level, under fast of it for climb s climbs one back; a frame is due after slack of its interval (the screen's ticks wobble round 1000/fps); levels 1 the frame rate to fps, the trees' shadows and rain rings, 2 the moving extras (as Reduce motion), top half the pixels | {tau: 0.3, slow: 0.72, fast: 0.42, ms: 1000, shed: 2, climb: 10, fps: 30, slack: 0.8, top: 4, half: 0.5, res: [1, 1, 1, 0.75, 0.5], lv: {sha | N208; N238; N282; N283 |
| D322 | a board at peace (Mid's PEACE): when no two living sides are at war and no notice runs, after stand.after s the computers send their soldiers above the army they keep at peace home to the fields (yours: above keep of what you have, when you ask), and after years the hidden age opens to every side; the Wellbeing crown counts people in health × people, each place of care × bld and each laurel × laurel; the chronicle keeps chron lines; the first quiet s of a match say nothing of it | {years: 1, stand: {after: 90, keep: 0.5}, crown: {bld: 8, laurel: 5, people: 1}, chron: 80, quiet: 30} | N222; N201 |
| D323 | the mail (Mid's MSG): a line shows for its reading time (D read; Albert, Nov 10, N17 #18), a line that comes while another shows waits its turn, the last page of them kept; the same line within merge s is a count on the first; keep lines are kept, page a page | {merge: 30, keep: 30, page: 6} | N223 |
| D324 | how news reaches you (Mid's TELL ÷ D12, NEWS_EVERY): a place in sight is told now; a fight within hear tiles of your people is heard (× gun from the gunAge on), its way only; else a messenger brings it from your Town Center at D86's foot pace, or ride's from the Post line's level ridesAt, if the Post reaches: your near lands (within near tiles of a building of yours) at level 1, your far lands (far) at 2, an ally's lands (near of its buildings) at 3, the whole board at 4; the world's news every s, none in the first after s; levels, the Post level each reach needs | {near: 32, far: 90, hear: 38, gun: 2, gunAge: 4, foot: scout, ride: post, ridesAt: 2, every: 150, after: 60, levels: {near: 1, far: 2, ally: | N223 |
| D325 | the milestones and tips (Mid's MS_TEST, goldTight, NEEDS, advise, L): looked at on D328's beat, one a look; mud and snow past their share, a slip within slip s; gold short under gold while another store is past full; tips: fewer villagers than villagers, wood with none on it or under wood[1] with fewer than wood[2] on it (from wood[0] villagers), idle after idle s, a barracks after barracks s, spearmen under spear[0] before spear[1] s, the next age at age villagers, a food deficit after deficit[0] s within deficit[1] minutes of stores; a hint done learned times is not shown again | {mud: 0.5, snow: 0.5, slip: 20, gold: 50, full: 300, villagers: 6, wood: [3, 80, 2], idle: 20, barracks: 75, spear: [3, 600], age: 10, defic | N224 |
| D327 | the peace beat: every second, phase 2 frames (Mid's tick % 30 === 2: peaceTick, postTick, newsTick) | [1, 2] | N222; N223 |
| D328 | the lesson beat: every 3 s, phase 7 frames (Mid's tick % 90 === 7: milestoneTick) | [3, 7] | N224 |
| D329 | the land's character (Mid's LAND): one of rows rolled a game on a dice of its own (seed: the game's seed XOR this, so the roll moves no other draw), the same in every corner; amt what each store's finds are worth past the pocket, extra its specialty laid once more in Z3, one pocket's worth | {seed: 1013904223, rows: {fertile: {amt: {food: 1.4, wood: 1, stone: 0.8, gold: 1, iron: 1}, extra: bush}, timber: {amt: {food: 1, wood: 1.3 | N229 |
| D330 | the scenarios (Mid's SCENARIOS): an age, a store at least this, research with what it waits on, your relation with every court (rel) and theirs with each other (among: Mid's peace, and Last Keep's league), buildings beside your Town Center by their offset, more villagers, all within within of it (Mid's findSpot reach), the game's length; all: the age and the store go to every court | {open: {}, siege: {age: 3, store: {food: 1200, wood: 900, stone: 900, gold: 500, iron: 150}, techs: [masonry, greattower], rel: war, blds: [ | N229 |
| D331 | (Albert, Nov 11: one slot, in IndexedDB db/store; N322) the save (Mid's saveGame): its place on the phone, one place per build folder, in slots that roll (the newest written over the oldest, AoE2 DE and Civ's rolling autosaves; Albert, Nov 10), now holding which is newest, key alone being the old single save opened once; it waits out a fight at most fight s; a failed save says so once in fail s; the tags that keep links, Maps, Sets and Infinity, and a record held in two places (an order, a camp, an ambush) kept as one: own on its first, same on the rest | {key: fk.save, db: first-keep, store: saves, slots: 1, now: now, fight: 60, fail: 60, tags: {ref: @, map: $M, set: $S, num: $N, base: #, own | N230; N302 |
| D336 | a quarry's stone a second, to its one worker, never running out (Mid's quarry) | 0.45 | N235 |
| D338 | the longest a frame may take on the new-game screen with the world running, in ms (the A1 speed test: a frame of 50 ms is a stutter the eye sees; at the game's 30 frames a second a frame has 33 ms) | 50 | N236 |
| D339 | the slow work (a computer's turn) is done in slices from one queue, each in turn, at most slices a frame, each resuming where it stopped; counted in slices, not ms, so the same seed plays the same game on any machine (t-same); a turn is about 40 slices of a few ms, so 12 keep a frame's share of the turns under a 60 Hz frame of 16.7 ms with room for drawing and the step (QCR) | {slices: 12} | N236; N237 |
| D332 | the save beat: every 60 s, phase 5 frames, off the other beats' frames (N23, Gemini audit 2: a save writes about 565 KB, a hitch every 10 s on a phone; the game also saves when the app is left or the phone locked, so a minute is the most a crash can lose) (was 10 s, Mid's SAVE_EVERY) | [60, 5] | N230; N320 |
| D333 | the test field (?test, Mid's testField): Mid's seed, every store, the age and the War Council's ladder; you and one rival at war, each army in rows of a kind at its distance down the road from your Town Center, a row and a file apart; never saved | {seed: 11, store: 5000, age: 2, techs: [engage, command, formations], army: [[150, [[UM1, 10], [UM2, 8], [UM10, 4], [UM5, 2]]], [750, [[UM1, | N229 |
| D334 | the buttons always on the play screen, at most (Mid's UI_BUDGET): a new control replaces one | 33 | N230 |
| D340 | the draw rate at rest (SoRen's tick: 50 ms a frame live, 150 ms idle, 250 ms dark): paused, behind a full-screen page or card, or with nothing moving, the world steps and draws idle frames a second; hidden, dark | {idle: 15, dark: 4} | N238 |
| D335 | the match log: a row a minute (Mid's matchLog), for Claude to read; the tap counts' place on the phone (Mid's TAPS) | {row: 60, taps: fk.taps} | N230 |
| D341 | the day's fraction at which the sun stands highest: a match opens at sunrise on the spring equinox (the year begins at declination 0, March 21; sunrise at hour angle −90°, so noon = 90° ÷ 360°; Albert, Nov 8 07:26) | 0.25 | N240; N250 |
| D348 | how the ground takes the light and meets the water: a slope leans warm to the sun or cool to the sky by its lean, at most lean (one light law with the buildings' lit); a cliff face sits face in the shadow; the shore and the sand, dirt and grass edges run as contours through the tiles' middles where the land is gentler than steep × the angle of repose (a steeper step is a cliff and keeps its face), with a line of foam foam units wide on the water's edge; damp moss climbs moss of a wall from its foot (Albert, Nov 8 11:35: the coast looked like Minecraft); the blades are the paper mock's (D366, N13); the bands are traced up to steep times the angle of repose (Nov 8 13:57: was 1, which left every pond bank to the tiles' staircase), each piece edged seam px in its own colour so no hairline shows between them, and each tile of the land's masks edged mask units so the mottle shows no grid; a slope's light leans at most lean (Nov 8 15:34: 0.3 showed each tile as a block, a grid); the grass pattern a tile of tile units (about 3.8 m, wide enough not to read as a repeat) holding blades blades, most grown in tufts tufts of them spread 3 to 10 units apart, loose of them alone, each one of five shades, leaning a little with the wind, tall 3 to 7 units (Albert, Nov 8 15:38: hit it with the randomizer); N11: the grass tile is two tiles, 192 and 139 (139 is prime), so their repeat lines up only every 26,688 units (the Cicada Principle, N300); N11: blade 0.06 makes the strokes v80's size on screen, blades 600 per tile | {lean: 0.12, face: -0.28, steep: 4, seam: 0.6, mask: 4, foam: 0.6, moss: 0.28} | N258; N260; N300 |
| D347 | (Albert, Nov 10 18:20-18:22, the day and season doubled to slow the sky, the economy kept per minute: halved, the same minutes without rain) days without rain at the start of a match (Albert, Nov 8 07:26) | 1.5 | N250 |
| D346 | the counting numbers the code may name: zero and one (the number sweep's first row, Nov 7: ONE was borrowed from the hazards' score base D309 and used 103 times as a plain 1) | {zero: 0, one: 1} | N102 |
| D345 | (Albert, Nov 10 18:22: the day doubled, the economy kept per minute: trees per corner doubled with the land's area, then three times that (Albert, Nov 10 18:23 and 18:55: a lot more trees, to block out bigger sections of the map; forests are what shape an Age of Empires II map)) the forest as Mid laid it (10-world-forest makeForest): trees on a step lattice jittered ± jitter, where an organic field runs high (four sine waves of these wavenumbers, phases from the dice, plus grow per unit beyond far from the Town Center: thicker away from home), the top trees a corner; none within edge of the land's edge or home of the Town Center (Mid's HOME.clear), on a trade lane, in the middle, or within path of three winding paths (bends bends, wandering ± wander) from home to each neighbour's middle line and to the middle (Albert, Nov 7 19:40: the perfect arcs were the problem); Albert, Nov 8 08:57: the clear ring home 220 → 130 so the woods come to the Town Center, and 15% more trees a corner (375 → 431) | {step: 26, jitter: 6, trees: 2586, edge: 40, home: 130, path: 34, bends: 3, wander: 70, field: {k: [0.011, 0.013, 0.007, 0.009], far: 450, g | N256; N249 |
| D343 | (N26, Albert Nov 11: his phone ran hot and froze: a slow phone stacked six catch-up steps on every frame and never rested; now the steps of one frame stop once they have taken budget ms, three quarters of a 60 Hz frame, and the match runs slower instead of the phone running flat out) the simulation's fixed step, hz a second (Mid's DT), and the most steps one frame catches up (Mid's CATCHUP), and the longest gap in s one frame counts (cap): a frame between two steps draws each figure the fraction of the way (Mid's DRAW.alpha, Build 63), so a slow phone keeps the same world and smooth walking | {hz: 30, catchup: 6, cap: 0.1, budget: 12} | N112 |
| D344 | the match speeds, under the pause (Base's ×1 ×2 ×3, SoRen's spdPop) | [1, 2, 3] | N241 |
| D342 | each computer begins with these standing beside its Town Center, free and finished: Mid's HANDICAP (a mill and a farm), placed by the AI's own site rules within ai.ring.start of the seat; Go's handicap stones for a player that plays worse than a person (Albert, Nov 7 14:47: give them a mill and a farm; reverses Nov 5's kill) | [BI1, BCL1] | N244 |
| D353 | the ground's soil and flowers (N11, Nov 10: the meadow's picture cut for the paper sheets): seed, the relief and its octaves, the wetness index (TWI: where water gathers, Beven & Kirkby 1979, N268) and the snow's drift into hollows (lognormal, cv), both for play; slope light (lit); the flowers' bloom windows and clumps; opaque is a full byte | {lit: 0.03, seed: 37, opaque: 255, octaves: [[0.03, 1], [0.07, 0.5], [0.15, 0.25], [0.33, 0.125], [0.7, 0.0625]], jitter: [0.6, 0.8], relief | N299; N264; N265; N266; N267; N268; N269; N270; N287 |
| D354 | exposure to the weather (Albert, Nov 8 18:39-18:41): a side's share, 0 to 1, is its cold (the air under cold °C, full span °C lower) × its cold cut (Wool cloaks) plus its wet (the ground's wetness) × its wet cut (Oiled cloaks), the whole × its chill cut (Chimneys); everyone eats (1 + ration × exposure) × their meals (the US Army's cold-weather ration, 4,500 against 3,250 kcal a day, N275), the town's cases from outside are × (1 + sick × exposure) (cold and wet raise respiratory infection, N276), and a soldier's nerve settles no higher than full × (1 − nerve × exposure) (cold and wet sap morale, N277); research compounds and never takes it to nothing (QCA) | {cold: 10, span: 20, ration: 0.4, sick: 1, nerve: 0.3} | N275; N276; N277 |
| D355 | familiarity with the ground (Albert, Nov 8 18:20: the outsider pays, the defender does not; it replaces D-085's road rule): a side knows a cell of cell tiles while one of its eyes (a unit or a finished building) has stood in it, the memory fading as e^(−time ÷ tau) (Ebbinghaus's forgetting, N278); its own ground, within home tiles of a finished building of its own, it always knows; the Natives and the wild know the whole map. A soldier's pace is × (1 − pace × (1 − its familiarity)) (cross-country against road, FM 21-18, N279) and its blows × (1 − fight × (1 − familiarity)); Local guides cut the penalty (guides); scouting ahead is how an army learns the ground, at the risk of the scout being seen | {cell: 8, tau: 600, home: 10, pace: 0.4, fight: 0.3} | N278; N279; N280 |
| D356 | reading time for a message: the toast's least time (D toast) plus its words at wpm words a minute (min seconds a minute): adults' silent reading (Albert, Nov 9 12:12) | {wpm: 238, min: 60} | N284 |
| D357 | the Help page: the last keep messages, newest first, the latest one left to the help line beneath (Albert, Nov 9: the Help page lists earlier messages) | {keep: 20} | N286 |
| D358 | the quick action's shares of the army, nearest to the spot first: half and a quarter (v80's strip: ½ and ¼; All is everyone, Idle only the idle) (Albert, Nov 9 19:15-19:37) | {half: 0.5, quarter: 0.25} | N288; N287 |
| D359 | a game starts this share of a season into spring, when the grass has greened (the meadow's green rises from 0.45 of a season: D353 green up): late spring, about May in the north (Albert, Nov 9 19:21, 19:48: start in a greener month) | 0.75 | N287 |
| D360 | (box: how far a woods chunk's picture reaches past its ground to each side, up and down, in view units, so the tallest and widest tree (216 up, 117 across, measured Nov 10) is never cut at a chunk's edge; cover, side: every untouched tree is drawn once into the woods' cached picture; a tree is drawn again, live, over a person only when it stands in front of him, looked for cover tiles ahead of him and side tiles to each side (Albert, Nov 10 21:08-21:10: still things are not redrawn, only the trees being cut and the things a person stands behind); Albert, Nov 10 20:03-20:06: no silhouettes: a person of yours hidden under the canopy or behind a tree or building shows only a ring, dashed (hidden, as a hidden edge is drawn dashed), thick times the foot ring's line, in his side's colour; an idle villager's ring glows and dims over pulse s, down to low, since he is the one asking to be found) (ring: your own people under the canopy drawn as a ring ring view units wide over the trees: Albert, Nov 9, seeing who is inside) the woods walkable at a cost (Albert, Nov 9 18:33, 19:59: the ice's crossing modes, real math for walking and fighting): who may enter, by what carries them (a person, a rider; engines, wagons and beasts never); eta the Pandolf terrain factor for heavy brush (Soule and Goldman 1972: 1.5), so the pace falls by the same physics as mud and snow; walk a horse's walk in m/s (about 6 km/h: low boughs keep a rider to it); stems a square metre and trunk the trunk's width in m (about 500 a hectare, 0.3 m), so an arrow or shot through L metres of wood is stopped with chance 1 - e^(-stems x trunk x L); edge the crossing's stick-to-edges weight a tile of woods by how deep in it is | {enter: {person: 1, horse: 1}, eta: 1.5, walk: 1.7, stems: 0.05, trunk: 0.3, edge: 4, ring: 3, thick: 2, dash: [3, 2.5], pulse: 1.6, low: 0. | N292; N294; N287 |
| D361 | (in or under woods an eye looks between the trunks: a ray goes on while the chance a line is still clear, e^(-stems x trunk x metres of wood, D360), stays above see, about 45 m; from above the canopy the wood is a wall (Albert, Nov 9 20:17: villagers in trees can’t really see); sight in cells of cell × cell tiles, 5 m; each eye sends rays × π × reach rays, so neighbouring rays meet at the rim; a ray marks each cell whose ground, a body high, rises above the steepest top before it, and stops at a wall: ground steeper than the tops by wall; an eye whose rim, rim points round it, is all seen by others casts nothing (Albert, Nov 9 20:12-20:13: you see until the first thing that blocks; only the eyes facing the fog see)) the fog of war's veil over the map (Albert, Nov 9 item 6; StarCraft's three states, N290): ground never seen under dark, ground seen before under seen, ground in sight clear; the veil drawn a pixel a tile and smoothed, so its edge is soft and units fade in and out at the edge of sight | {dark: 0.88, seen: 0.5, cell: 4, rays: 2, rim: 16, wall: 0, see: 0.5} | N290; N287 |
| D362 | fog seen from the camera (Albert, Nov 9 item 4): radiation fog a layer depth m deep (Roach: tens to a couple of hundred m); the camera's height from the zoom: the ground's width on the screen, half of it over tan(fov / 2), a phone camera's field of view in degrees; the light's path through the fog is the layer, or the camera's height when the camera is inside it, so zoomed out the fog is white and zoomed in you see through; km: metres a kilometre, as beta is per km; the layer's top lies depth over the lowest ground, so fog lies deep in the hollows and thin or gone on the hills (cold air drains downhill: valley fog, Roach); each 5 m cell gets its own veil; the sheet is painted again when beta or the camera's height moves by step | {depth: 100, fov: 60, rad: 0.0174533, km: 1000, step: 0.05} | N291; N287 |
| D363 | (while a pinch is moving the sheet is stretched, not drawn again, and drawn fresh once the zoom has stood still settle ms, or has moved a √2 step, or the stretched sheet no longer covers the screen: the way map apps zoom, Albert, Nov 10, N17 #22: zoom weird and sticky, 15 frames a second while zooming) (N8: the land is a sheet margin px larger than the screen on every side and slides with a pan, drawn again only when the pan runs past the margin, the zoom changes, or ms passes: the cels of an old cartoon, Albert, Nov 9 20:31) the land (the ground, the meadow, scars, the skin of snow and ice, the grid) drawn once and kept while the camera holds still, drawn again when it moves, when the meadow is sweeping, or every ms milliseconds so a new scar or hole shows within a second (SoRen's layers baked once, keyed: Albert, Nov 9 item 7, 20:24) | {ms: 1000, margin: 64, settle: 160} | N287 |
| D365 | the wet sand's top: the band the water darkens at its edge (N11) | 2 | N112 |
| D366 | the paper ground (N11, Albert Nov 10): season is where in the year (0 to 1) each season colour is full; step rounds the colour so the grass is coloured again only when it moves a visible step; year is a prime that gives each year's flowers new places; light: the hills' sun and shade (slope) and the meadow's soft patches (patch), at most sun and shade; shadow: the thin shadow each sheet casts on the one below; snow: six steps, hollows first; marsh: shallow water laid as one smooth sheet with the shallows, after the grass's colour, a share tussock of its tiles left standing as grass tussocks (Albert, Nov 10, #9: tussock sedge marsh); reeds in the marsh's water; glints on the water: one in per tiles, length, width, how fast they come and go, how bright, from what zoom; water: how far from its shore (in tiles) the water turns mid and then deep, as a lake deepens away from its bank; blade tiles: the second at the first over the golden ratio (64 / 1.618 = 39.6), the number least near any fraction (Hurwitz), so the two never line up in a repeat the eye can see, its blade count scaled by area to keep the density (Albert, Nov 10, #1); a third tile one golden step up (64 × 1.618 = 103.6) and every count two thirds, so no one tile carries enough of the blades for its own repeat to show close in, at the same density (Albert, Nov 10, N17 #17: the pattern still showed at close zoom); blades: the zoom where the blades start to show and where they are full (v80's: none from far away, full close up); N13, the paper ground mock built (Albert, Nov 10 08:38: 'Keep cloud shadows. And set water to high. Go go'): level: the water fills every cut up to this height (high; the wading depth), mini: the minimap picture's scale; blade: the mock's two tiles (size, count; the Cicada Principle), each blade a thin triangle len long, leaning lean, w wide, tall stretch, drawn at the screen's pixels for the zoom (never smaller than least); cloud: the mock's cloud shadows, a tile of soft noise (cell lattice, per waves across, oct octaves, contrast k, darkest a), laid scale ground units a pixel and drifting drift a second (the mock's, grown to this map's size) | {season: [0, 0.22, 0.45, 0.68, 0.85, 1], step: 2, year: 7919, light: {slope: 0.6, patch: 0.07, sun: 0.22, shade: 0.3}, shadow: {dx: 0.8, dy: | N301; N305; N304 |
| D367 | what a villager carries home, drawn on the back while walking to drop off: a bundle rx by ry figure px, dx behind and dy up from the feet, in its store's colour (Albert, Nov 10, #35) | {dx: 4, dy: 16, rx: 3.2, ry: 2.4} | N306 |
| D369 | the day's light by the sun's height in degrees: the twilights at −6, −12, −18 (SoRen's ramp, QD), read through a monotone cubic with flat ends so the light never kinks into night or day (Fritsch & Carlson; Albert, Nov 11 09:28: the transitions gradual, the length nature's) | [[-18, 0.18], [-12, 0.3], [-6, 0.45], [0, 0.62], [6, 0.85], [20, 1]] | N322; N323 |
| D370 | the zoom past which a figure is not drawn sharper, only bigger: zoomed in to 3x the sprite cache filled and redrew itself every frame (1,183 new canvases in 3 s, 3-12 fps on his phone); at 2x the same view ran 26-39 fps headless (Albert, Nov 11: try it, check after his test) | 2 | N322 |
| D371 | the book over a building with research you can start now (Base's mark, Albert's screenshot Nov 11): looked for every second; a disc r px at zoom 1 lifted px over the health bar's place, a red ring px; the open book page × r wide, tall × r high each side of the spine, its spine dipped dip | {every: 1, r: 9, lift: 6, ring: 2, page: 0.5, tall: 0.4, dip: 0.25} | N322 |
| D368 | the clock on the top ribbon: hours in a day and minutes in an hour (moved from the code in the N17 audit) | [24, 60] | N311 |
| D372 | a group marches on one route (measured Nov 11: twenty picked soldiers each searched the whole way at every tap, a step stalled up to 104 ms, a tap on water 215 ms): the soldier nearest the group's middle finds the way once; another within near tiles of that way joins it by a search of at most tries tiles and leaves it for its own place the same way; one farther off searches for itself, stagger s after the one before it, most s at the latest; an order onto ground no one can walk to goes to the nearest tile they can, within snap tiles (design numbers, Claude's) | {near: 12, tries: 600, stagger: 0.05, most: 2, snap: 8} | N325 |
| D373 | Defend answers the foe striking what is worth most: your hall, then your people, a building, a soldier (the order Claude proposed Nov 11 15:39; the numbers only rank them) | {seat: 4, folk: 3, bld: 2, soldier: 1} | N325 |
| D375 | Prep (Albert, Nov 11, talk; yes Nov 12 05:27): every villager boards up the nearest building. add: the health boarding adds, as a share of the building's own, +50% for timber and +100% for stone (Albert's). back: unboarding before any attack has landed near the town leaves the building short by this share of what boarding added, to be repaired (Albert: "unboarding takes away half of what boarding added"; "they have to unboard and then repair"); after an attack has landed the boards just come off. Claude's numbers, never set by Albert: time, boarding as a share of the building's own building time, stone twice timber; cost, a share of the building's wood (timber) or stone (stone) price; least, the seconds for a building with no build time; planks, how many are drawn | {add: {wood: 0.5, stone: 1}, back: 0.5, time: {wood: 0.25, stone: 0.5}, cost: {wood: 0.2, stone: 0.3}, least: 30, planks: 4} | N326 |

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
| X26 | every Build tab shares one height, two rows of three (Albert Nov 9: fit two rows; since N2 the other menus are bottom sheets that hug their rows) | {stage: page} | N126; N287 |
| X27 | the Tall pages keep their own height | {stage: page} | N126 |
| X28 | the panel is solid | {stage: page} | N126 |
| X29 | the seat's queue is the mold's six single slots, filling in order | {stage: page} | N126 |
| X30 | a card shows the rows its subject ticks: a villager, a find, the seat | {stage: page} | N126 |
| X31 | a building picked from Build is placed as a site | {stage: page} | N126 |
| X32 | the page runs with no errors | {stage: page} | N126 |
| X33 | the gate stops each planted break: a second home, a bad tick, a shell named in code, swallowed code, one byte of a locked law | {stage: page} | N126 |
| X34 | a new game starts with the book's stores (D172), and a restart resets them and the weather | {stage: page} | N127 |
| X36 | a paid unit with no room to stand beside its building appears further out and the queue empties (A2, Albert Nov 7: every paid unit must appear; before, it waited in the queue) | {stage: page} | N127; N241 |
| X37 | the bell rings at the length chosen at Start; the default is the book's | {stage: page} | N127 |
| X38 | a find used up is gone at once, and never chosen again | {stage: page} | N127 |
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
| X61 | the Market, coin, bank and ventures, goods and workshops, trade and caravans (F26+F27): Mid's TRADE, SELL, BUY, MKT_SELL, MKT_BUY, GOODS, PRICE, MINT, VENTURE, BANK_CAP, SCALE, LOAD, CARAVAN, POST, TRADE_CAP, TRADE_DIV, PLACES.stop and WARES in the books, and every building priced, timed and with its health; eight stops on the two routes wanting Mid's wares in turn; three lots sold, two bought, the coin debased and a slow beat's drift give Mid's frozen marketTrade, debase and priceDrift's gold and stock; a caravan's run to a held stop loads and is paid as Mid's frozen priceAt and loadable, less the keeper's cut; an ally's run, five minutes of a workshop with the loom, Learning by doing, a venture with Banking and the Bank's interest are Mid's frozen numbers; guards keep to a caravan, a guarded caravan is Mid's frozen guardedCart's, a robbed one Mid's frozen robbed | {stage: page} | N132; N195 |
| X62 | the war camp, field traps, relations and vassals (F25+F28): Mid's CAMP, CALTROPS, STAKES, NATIVE's traps, NOTICE, PEACE.truce, REGARD, GANG, REL_WORD, VASSAL, DEMAND and its fair TAX as the tribute in the books, and the camp pieces', traps', wagons', envoy's and rebels' rows; both camps' layouts at three facings are Mid's frozen campLayout snapped; the small camp unpacks as sites and a soldier's hands raise a piece at D279's build of a villager's; a medical tent binds a wound as Mid's healTick's lag; a caravan's supply run costs Mid's fee and food and stocks the depot; soldiers eat from it, and unsupplied they slow; caltrops on a rider and a spearman, and a pit a scout found, are Mid's frozen trapsTick; war comes after Mid's notice; an envoy's five answers and a truce's price are Mid's frozen judgeEnvoy on the same odds; ten minutes of a vassal's tribute, loyalty and unrest are Mid's frozen vassalTick; gifts buy Mid's giftGain (QCD) | {stage: page} | N132; N198 |
| X63 | the computers' minds and the sky, the moon and the ground (F29+F30): Mid's PERS, PLAYERS, WAVE, SAVE, DIFF, EASY_SAFE, SYNODIC, CLIMATE.rut, CLIMATE.shore and EVENTS.flood in the books; a computer's plan by need each minute over four minutes is Mid's frozen needOf and runsOut on the same hands, rates, stores, goal and draw, and every computer grows its town; the moon's phase and light are Mid's (the night's sight is now QAL's, t-sight); a walker wears the ground a unit-second a second, and the ruts heal, deepen the mud and pool by water as Mid's frozen rutHeal, rutOf and mudAt; a flood blocks the land within its rise and harms a building there unless Levees, and goes | {stage: page} | N132; N202; N203 |
| X64 | finds, wild guards, drifters, events and the hazards (F31): Mid's FINDS (guards, spoils, the ruins' scroll, the drifters' price), WAYFARER_EVERY, WILD_LOOK, the leash, NATIVE's raids, GROUP_R, EV_MEAN, EV_MIN, EV_WARN, the kept EVENTS, HAZARDS, HORDE and the bandit's and robber's UNIT rows in the books; on the seed every find laid with its guards on its ring (drifters by their fire); with every hazard on, the events in order with their warnings and the horde's warnings, arrival and number, fed one string of dice, are Mid's frozen eventsTick and hordeTick's (each event's doing set aside); a robbers' raid's band and mark are Mid's frozen natRaid's for the same camp, people and strengths; a drifter's refusals, price and three foot soldiers are Mid's frozen hireWhy and hire's; a chest taken pays Mid's frozen findsTick's spoils, the ruins a free research | {stage: page} | N205 |
| X65 | fire and sickness (F32): Mid's FIRE, FIRE_SMOKE, FIREARMS and HEALTH in the books, its wooden buildings the ones that Burn, its water, sewer and quarantine research the measured shares (MEASURED); fireHeat and Rothermel's η are Mid's; a summer storm's strike on a wooden town of two clusters: the home with villagers beside it saved, its neighbour untouched, and the other cluster's three burning down one from another, each when Mid's frozen lightning, ignite, fireTick and repairTick's buckets do on the same town and dice (to the 3 s look); then an outbreak, beat by beat, sickens and cures the same people as Mid's frozen outbreak and healthTick | {stage: page} | N206 |
| X66 | sight by real math, with the fog of war (Albert Nov 9, D361; his Nov 6 call had none): a person's range equals QAL worked from the books alone at noon, dusk, a full and a half moon, starlight, an overcast night and a fog; a tree between two villagers hides each from the other's side, felled it opens both ways, a fog thinner than their distance hides them, and once your last eye is gone you see nothing, while the foe's eye still sees that ground; the fog of war drawn, none of the old fog-of-war numbers; the small map's incoming mark lands on the soldiers seen and a tap there glides the camera | {stage: page} | N208; N220 |
| X67 | lights, the glide, theatrics and the draw budget (F34): Mid's FLAME, LIGHT, CAM_W, the pop and the shed thresholds in the books; a glide to the Town Center follows Mid's frozen spring and followCam frame by frame; after dark the Town Center, a finished house, a burning house, a badly hurt and a lanterned camp give the lights Mid's frozen drawLight gives; each flame's colour and its life in the rain are Mid's kelvinRGB and flameLife; the finished house's pop runs Mid's popC frame by frame; a slow phone sheds and climbs back on Mid's frozen shed | {stage: page} | N208 |
| X68 | fog by the atmosphere (Albert, Nov 6 14:44): on a dry calm evening with the dew point just under the air, the air cools to it and fog forms (visibility under the WMO's 1 km); the visibility equals CALVIS's 3.912 ÷ (144.7 C^0.88) for the vapour above saturation by Magnus, never past the typical fog's water; a breeze past 7 knots clears it; the sun lifts it once the air warms past the dew point | {stage: page} | N220; N210; N212 |
| X69 | peace, the crowns, the mail, the messengers, milestones and tips (F35): a board truce stands a computer's soldiers above Mid's armyAim down to villagers one for one as Mid's frozen standDown; a year of it opens the hidden age as Mid's nextAge; a kill credits its cost as warCredit; the Wealth, War, Wellbeing and overall crowns equal Mid's crownsOf on the same sides; news of a foe out of sight is never told, told by a runner or a rider at Mid's tell's delay for the same walked metres, or heard as a fight with its way, as Mid's tell; repeats merge; the world's news and the first-house line equal Mid's NEWS and MS_TEXT; a tip done three times retires; the Games wait with the Throne | {stage: page} | N222; N223; N224; N226 |
| X70 | the civilisations (F36): each of the six trains its own kind in place of the common one and no other side does; the kind's numbers, cost, time, age and pace equal Mid's UNIT; its bonus applied by QCA equals Mid's fxv for the civ; its elite rank equals Mid's tier; its Hall rows equal Mid's and only its side may research them; the legionary, Immortal and Mali horseman draw as Mid's figures; every standing tree in the woods stands its kind's Forest Service height (D326) in line of sight | {stage: page} | N225; N226; N219; N221 |
| X71 | the map's character, new game and scenarios (F37), with Albert's map calls: the lands and the scenarios equal Mid's frozen LAND, SCENARIOS and MODES, and each scenario plays as its row (age, store, research, relations, buildings by their spot, villagers, its line); past the pocket each find is worth its land's share; no find of your quarter is walled in by trees (only water may cut it off); your Town Center is at the bottom left of the screen; the pocket holds QBJ's amounts from the costs and the Bronze price; Z3 thickens toward Z4, is more open than Z4, Z2 has no woods, and Z3's finds are more than the pocket's and less than the wilds' | {stage: page} | N229; N228; N232 |
| X72 | saving, the safety net and the test tools (F38): the save beat, the fight wait, the failure's minute and the button budget equal Mid's frozen SAVE_EVERY, saveGame and UI_BUDGET; a save waits out a fight up to its limit, keeps the one before, and opens to the same units, finds, buildings, stores, climate, relations and mail; saves roll through their slots; a damaged save is skipped and the one before opens; a new match adds nothing to the browser's history (Albert, Nov 10, #38); no seen or remembered state is saved; a thrown error costs a frame and the game runs on; taps are counted; the match log rows a minute; the test field (?test) is you and one rival at war with both armies out, never saved; the game opens where you left it | {stage: page} | N230 |
| X73 | the Guide and History, written from the books (F39): Mid's frozen guideModel and histRows, run on v100's tables, list the same buildings, units, research, ages, peoples, finds and rules, with the same numbers, names, lines and order as v100's guide() and hist(); every rule's numbers and names are filled from the books (none left open), each building, unit and find has its history line where the Words book holds one, and the Markdown holds one row an entry | {stage: page} | N234 |
| X75 | G1: code reading the raw stats table (D.stats[…]) outside stat's own home: ask FK.stat | {stage: code} | N239 |
| X76 | G2: a shell named in a build, research, train or computer table that lacks the tick that table asks (Health, Research, Spawn, Field or Make) | {stage: books} | N239 |
| X74 | speed and the audit's fixes (A1): Reinforce sends its soldiers into the fight's order; a drill holds its shape past its first frame; a save opened keeps a war order, a camp and an ambush as one record each (the camp count unchanged) and the fresh map unmarked; a civilisation's own kind shows on its building's card and trains from it; a soldier with a support unit beside it still picks the armed foe; the Apartment adds Mid's room and the Quarry is worked for Mid's stone; New World crops, Town watch and every step's needs equal Mid's TECH; a side's reach equals the walk the pathfinder finds; the new-game screen runs with no frame over D338 | {stage: page} | N235; N236 |
| X77 | an object (a table in code or a book) that holds the same key twice: the later one silently wins (B6: two home verbs) | {stage: code} | N250 |
| X78 | N17, Albert's N15 notes: a site placed with a busy builder waits its turn and he walks to it when his first is done; minus drops the job count at once; gatherers at work hold their spots (under 2% of their frames move); Repeat is ticked on exactly the twelve repeatable buildings; every locked research says why on its button; a tap held a second on Train still trains | {stage: page} | N307 |
| X79 | the paper ground (N11-N14): on the opening view, open water well below the land is drawn blue and open land well above it green, nine in ten points or more, away from shores, finds and trees | {stage: page} | N301; N304 |
| X80 | N15 (Albert's N13 notebook): the Daily challenge locks civ, difficulty, length, scenario and fog, and off frees them; any queued unit taken out is paid back in full; the Top Info Ribbon shows each of its readings; every finished building but walls and fields has its door torch after dark | {stage: page} | N306 |
| X81 | N16, the quick action: open ground gives Attack, Build, Rally; Attack gives All, half, quarter and Squad; Build gives the six groups; a message with a place shows Go on a menu's help line | {stage: page} | N306 |
| X82 | N18 build 1, Albert's N17 notes on the menus: a pill keeps its curved ends; the selected ring lies on the pill's own outline, its ends on the pill's corners; row titles 14/600, options 12/400; a hazard's ring is the options' white; with Daily on a locked option is flat and dark with no ring; the paused Play button wears the ring at its own size; the Paused card hangs below the Top Info Ribbon; the quick action's ring is its box's size; the tap that opens the quick action does not press the box under the finger | {stage: page} | N313 |
| X83 | N18 build 2, Albert's N17 notes: People's ring recedes while a villager trains; a line said while another shows waits its turn; soldiers trained while a rally flag stands are dressed into one formation there; at night a campfire burns by a drop-off where villagers work and the army's standard carries a torch; no figure is clipped by its box (the horse's head); three blade tiles; a rock's sprite is cached at or above its size; a person behind a building shows through it | {stage: page} | N314 |
| X84 | N18 build 3: the quick action's aim step is one box above the aimer; a steady pinch over a second and a half draws the land sheet afresh at most three times (it is stretched between) and once more when the zoom stands still | {stage: page} | N315 |
| X85 | N19: a day is 240 s, a season 360 s, a person eats 3.75 food a minute as before; the played land is 306 tiles a side | {stage: page} | N316 |
| X86 | N20: ten swordsmen a side hold until two or more of a side have fallen and fight on to an end; the top row is one row of nine; three times the trees; storms from 0.6 | {stage: page} | N317 |
| X87 | N21 speed: over a third of the trees are drawn from the woods' cache; a paused, still screen is not redrawn; asking for a picture twice in a frame draws it once | {stage: page} | N318 |
| X88 | N22: nine in ten trees come from the woods' cache; felling trees updates the map's tops exactly as working them out afresh; a bow reaches farther from above and keeps its flat reach from below; the Raiders age with three soldiers; the picture steps to three quarters at level 3; a save loads in under 6 s headless | {stage: page} | N319 |
| X91 | N24 build 2: a figure is no sharper past 2x zoom; the save is one slot in IndexedDB and nothing of First Keep is left in localStorage; a tab told another has opened pauses and stops saving; a farm makes D136 (0.5 a second); home gold has six piles, four to a vein; a price shows in full, each store its own colour; the Stores and Score cards open from the top bar; a building with research you can start shows the book; the Build menu shows only your age's buildings, no Show all | {stage: page} | N322 |
| X90 | N24 build 1: soldiers ordered at a far town find the whole way and go; the picked stay picked after an order; the picked bar's Recall sends only the picked, and says so; All hands runs; the clock reads 12:00 at the sun's noon; the light has no corner (flat ends, smooth knots, never falling as the sun rises); the meter is drawn only with a frame; a computer sees in a circle; an order costs no food | {stage: page} | N322 |
| X89 | N23: a building site does not change the map's tops and a finished one raises them; every untouched tree in front of a building and overlapping it is drawn live over it; a sprite used is moved to the back of the cache and the cache's pixel total is kept exactly; a save every 60 s; the drawing alone is timed for shedding (N24: logic time had dropped the picture to half resolution, which cannot speed logic) | {stage: page} | N320 |
| X92 | N25, the Controller (Albert Nov 11): in peace the bottom is the jobs box with Home and War above it; War opens three pads (brown people, blue actions, red who) and picks every soldier; a class picks only that class; squads are dimmed without Battalions; Attack lights, a tap on the map only aims, and nothing moves until Execute; an order to the ground is one whole-map route for the group and no soldier searches the map for himself; all twelve arrive; a tap on water is answered at once; Retreat sends them home; Hide and Back work; closing lets the soldiers go; a soldier tapped then the ground tapped is an order at once for him alone; Defend sends every free soldier at the foe striking a villager; a foe tapped and Executed is fought by all, and all are still fighting it when they get there | {stage: page} | N325 |
| X93 | N26: the rules ask a list without the trees, and a step with thirty soldiers on the board costs at most half the frame's budget (D343); no wildfire in the game; the night hides at most two stops (D292); every lake has a walkable ford (D374); a tap on the ground moves the picked army at once, with Attack lit it only aims; a side whose ice cracks is ice-shy; a square past Z has a name; no side "has fallen"; the Market sells; a caravan takes a route; the stances are wired; People is red with no food; a hall falling does not throw | {stage: page} | N326 |
| X94 | every measured number carries its unit and its subject as fields of its own entry, never as a comment in code (Decisions Nov 11, #2; Albert: "yes to a unit field on every number enforced by the gate"). subject is where the game reads it (world, economy, war, computers, screen, sound, shells), found by the gate's own reading of the code. A unit is set only where the code proves it (a number multiplied by the tile is in tiles; a number handed to every() is a beat in seconds) or the entry states it; nothing is guessed. N27 set 98 (proved from the code, stated in the entry, or Claude's own new numbers); unset counts the rest and may only fall | {stage: gate, unset: 1506} | N326 |
| X95 | N27: a tower shoots a foe beside it; a Mill and a Lumber camp offer their plot; two techs tapped are one green and one blue with their times and no queue row, and a tap on each cancels and pays back; a villager tapped onto a bush is focused on it; the Protect page holds Split, Lure, Seek and Prep; Prep boards the buildings, raises their health and shelters the villagers, the cell turns to Work, and Work takes the boards off and leaves them short; soldiers on a march eat more than standing; every measure carries a unit and a subject | {stage: page} | N326 |

## screen

| Code | Name | Value | Cited |
|---|---|---|---|
| SN1 | (lnIcon: the icon beside a number in a two-line cell of the top row, Albert, Nov 10 18:27) the mold: six slots a row, a slot 44 tall (Apple's least touch target), gaps and edges 6; the villager's square: one card of four boxes sq a side, no gaps, its dividers drawn inset from the card's edges, its icons sqIcon (Albert, Nov 8 21:42: a square; Nov 9 08:02-08:18: 44, one card, inset dividers, icons 14) | {lnIcon: 13, slots: 6, slot: 44, gap: 6, sq: 44, sqIcon: 14, inset: 9} | N133; N283 |
| SN2 | the Build tabs: six of two rows of three (each cell two slots wide), Dwelling first, top left; the Courthouse in Defence (it trains spies and shoots only spies) (Albert, Nov 9 18:29-18:33; replaces Base's order of up to nine) | {Home: [BR1, BTC1, BCR2, BP4, BP6, BP7], Resources: [BCL1, BI1, BI2, BI3, BCL4, BCL3], Military: [BM1, BM2, BM3, BM4, BI9, BI7], Defence: [B | N134; N287 |
| SN3 | (N6, Albert Nov 9 18:29: the Abatis, a field defence, cut for players as caltrops and stakes were on Nov 8; the Apartment and the Tree farm made from a card, SN34) buildings not on the Build menu: the Throne is the map's; the camp tents and the Depot (the camp's store, a forward base; Albert, Nov 8 19:22) come with the camp wagon; the Palisade comes with the war camp (Albert, Nov 5 16:07); the traps (the pit, the net, the stakes, the caltrops) are the Natives' booby traps and nobody else's (Albert, Nov 8 19:12: no laid defences for players; they wait with the Natives) | [BS1, BTC5, BTC6, BTC7, BTC8, BI5, BW4, BF1, BF2, BF3, BF4, BF5, BR2, BCL2] | N135; N172; N198; N287 |
| SN4 | a card's rows, in order: a row shows when the subject ticks what it names (none: always); troops: Teach on a soldier, Zeal at the Temple, ransom at your hall, what a spy read at theirs | [[title, null], [health, Health], [load, Gather], [store, Yield], [flock, Flock], [trade, Trade], [make, Make], [hire, null], [plot, Drop-of | N136; N170; N194 |
| SN5 | (Albert, Nov 10 18:27: the two top rows in the footprint of the top one: stores share a cell two to a cell, the season an icon beside the clock with the time left under it, people with idle and army, rank over score; one row of nine) the top ribbon: the five stores, sound, pause, the Mail door with its unread count (Base; Albert, Nov 7 20:48: all Base — the small map lives in the war station's middle, not here) | [food/wood, stone/gold, iron/age, when, folk, rank/score, mute, pause, mail] | N137; N241 |
| SN6 | readings with no row: the second top row was cut, each waited for its new home; all now in the Top Info Ribbon (SN39, Nov 10) | [] | N138; N306 |
| SN10 | the Start page | {ticks: [Tall], rows: the new game's choices} | N139 |
| SN11 | the Build page | {ticks: [], rows: title, the six tabs, the tab's grid} | N140 |
| SN12 | the Town Center page | {ticks: [Tall], rows: title, three tabs, the queue, train, tech} | N141 |
| SN13 | the Yard | {ticks: [Tall], rows: title, the layers, Fast and New, the three volumes} | N142; N143 |
| SN18 | the help card: a tap on the help line opens what it said in full (Albert, Nov 8 18:57) | {ticks: [], rows: title; the help line's full text} | N208 |
| SN17 | the ice card: an order over ice asks how to cross (the game keeps running; they wait at the shore) | {ticks: [], rows: title; how thick the ice on the way is and what it holds; the six ways to cross; remember this winter or this game} | N263 |
| SN16 | the Mail card, as Base (the Nov 7 re-read, item 13) | {ticks: [Tall], rows: title, the messages newest first, each with its group; a tap on one with a place goes there} | N241 |
| SN15 | the Welcome back card, as Base: a saved game opens paused behind it; the pause itself has no page (the speeds, New game and the volumes drop under the pause button; Paused · tap to carry on; Albert, Nov 7 20:48: all Base) | {ticks: [Tall], rows: title Welcome back, Resume, New game} | N241 |
| SN14 | words on the map (Mid's LABEL, mapFont, tag): px whatever the zoom, as a screen's words (Albert, Nov 8 21:21: a label must not scale with the zoom; 12 is Mid's, Oct 31); a label's pill (padding, edge, rise, height, inset, the words' nudge down) | {px: 12, pad: [10, 4, 13, 19, 5, 1]} | N208 |
| SN19 | the villager square's icons the bar lacked (24-unit paths, drawn as the others: a stroke, no fill): send, more, the rally flag, info | {send: <path d=\M4 12h14M13 6l6 6-6 6\/>, more: <circle cx=\5\ cy=\12\ r=\1.6\/><circle cx=\12\ cy=\12\ r=\1.6\/><circle cx=\19\ cy=\12\ r=\ | N133 |
| SN20 | the type rule: card titles in the display font at title (weight, px); row headers in column 1 head; inside a box, the first line first and the second line second (Albert, Nov 9 07:37-09:59, 13:12: 12 inside boxes; 19:37: first lines 14 again, as the v80 card; Nov 10, #12: every line inside a box 12 at 400; folder tabs at tab, so six names fit; a group's label in small capitals at label, letters spaced track em) | {ui: Barlow Semi Condensed, display: IM Fell English SC, title: [400, 18], head: [600, 14], first: [400, 12], second: [400, 12], label: [600 | N283; N285; N287 |
| SN21 | the jobs rows: the two rows and a job's − and + gap apart, columns as the mold; icon, count and word at the second line's size, icons icon px; one ink and one fill in every state (Albert, Nov 9 10:03-10:10) | {gap: 3, icon: 12} | N283 |
| SN31 | Info Help Ribbon 1, the help line: h tall on its tray, text pad in from the left, gunmetal with the working ring's blue edge, white second-line words; in two places, one look: the footer of every menu, always there, the latest message (a tap opens Help); and under the top ribbon, only while a message is fresh, coming and going in place of the toasts (Albert, Nov 9 11:14-11:21, 12:26, 12:29) | {h: 22, pad: 10} | N283 |
| SN32 | the ring round a box (research buttons, the queue, the help line): dim (thin, the dim colour) not chosen; lit (thin, bright) chosen; run (thick, bright, over the dim track) at work, pinned at 12 o'clock and receding clockwise until done; corner radius r; seam closes the full ring (Albert, Nov 9 11:23-12:19); verbs: which buttons ring and in what colour (unit: by what it trains; Albert, Nov 9 12:57: rings on everything), the chosen one lit in place of the gold edge | {thin: 1, thick: 2, r: 6, seam: 0.006, verbs: {pick: brown, train: unit, opt: white, speed: white, hazard: white, vol: white, resume: white, | N284; N285 |
| SN27 | MR title: the title's wide box, then back, book (or info) and close, always, in the last slots of the mold, the three small boxes jobs-gap apart (Albert, Nov 9 10:31-10:32, 12:57) | {slots: 2} | N283; N285 |
| SN33 | a wide box, two columns of the mold: train and research boxes in a card, and the small cards (Mail and Welcome back centred over the bars; Paused under the pause button, Sound under the mute button) (Albert, Nov 9 13:08-13:25) | {slots: 2, small: [Mail, Back]} | N286 |
| SN34 | made from a building's own card, not the Build menu: a Dwelling raised to an Apartment (a house adding a floor), a Tree farm planted from the Lumber camp (Albert, Nov 9 18:29) | {BR1: BR2, BI2: BCL2} | N287 |
| SN35 | the menus' sizes in px, once (item 1, the stray sweep: every size typed in menu.js's style comes here): hair a 1 px line; edge a 2 px border; r a box's corner, rc a card's, rq the quick square's, rb a bar's; icon an icon's side; glyph the − / + signs; pad a small gap inside a box; side the inset of a bar and the card text; tpad a title's left inset; vpad and hpad a card's padding; bar a progress bar's height; strip a strip row's height; none the safe-area fallback; caps the title's letter spacing in em (the values as they were typed, now named) | {hair: 1, edge: 2, r: 6, rc: 9, rq: 8, rb: 2, icon: 18, glyph: 18, pad: 4, side: 12, tpad: 14, vpad: 8, hpad: 10, bar: 3, strip: 30, none: 0 | N283; N287 |
| SN40 | the New Game sheet: each row's label span in slots, its choices taking the rest of the six (Daily first, Albert, Nov 10, N17 #2; moved from the code in the N17 audit) | {daily: 4, civ: 0, diff: 3, len: 2, scen: 2, tension: 4, fog: 4} | N307 |
| SN41 | the Controller (replaces the 14-box sheet of Nov 9): three pads, each two slots of the mold wide and two high, one box with dividers inset as the villager's square; over them a row of round glass buttons dot px across, their icons glyph px, their touch reaching hit px past the edge, the glass blurred blur px; Execute a pill exec px wide; a pad's icons icon px in a line stroke wide; half and full are the shares a divider sits at and spans; a button that cannot act keeps dim of its ink; the icons' frames (box; War's own, warW as wide as high) | {dot: 28, glyph: 14, hit: -8, blur: 7, icon: 18, stroke: 1.5, half: 50, full: 100, dim: 0.45, exec: 80, box: 0 0 24 24, warBox: -1.8 1.8 27. | N325 |
| SN42 | the Controller's icons: one thin line, one size, no picture used twice; War is Albert's shield over crossed straight swords (Nov 11 14:49-15:18: curved top, swords at 39 degrees), drawn solid | {home: <path d=\M4 11l8-7 8 7v9H4z\/><path d=\M10 20v-5h4v5\/>, people: <circle cx=\12\ cy=\8\ r=\3.5\/><path d=\M5 20a7 7 0 0 1 14 0\/>, bu | N325 |

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
| MG1 | Ruins | [Yield, Take] | N144; N205 |
| MG2 | Cemetery | [Take] | N144; N205 |
| MG3 | Campfire | [Yield] | N144 |
| MG4 | Treasure | [Yield, Take] | N144; N205 |
| MT1 | Trade stop | [Trade] | N195 |
| BTC1 | Town Center | [Seat, Drop-off, Spawn, Shoot, House, Research, Health, Shelter, Hold] | N144 |
| BTC2 | Castle | [Shoot, Health, Shelter, Hold, Research] | N144; N235 |
| BTC5 | Medical tent | [Heal, Health, Burn] | N144; N198; N206 |
| BTC6 | Training tent | [Spawn, Health, Burn] | N144; N198; N206 |
| BTC7 | Mess tent | [Shelter, Health, Burn] | N144; N198; N206 |
| BTC8 | Camp tower | [Shoot, Health, Burn] | N144; N198; N206 |
| BR1 | Dwelling | [House, Health, Burn, Research, Repeat] | N144; N206 |
| BR2 | Apartment | [House, Health] | N144; N235 |
| BCR1 | Market | [Trade, Spawn, Burn, Health, Research] | N144; N195; N206 |
| BCR2 | Tavern | [Burn, Care, Health] | N144; N206 |
| BCL1 | Farm | [Field, Health, Soil, Repeat] | N144; N170 |
| BCL2 | Tree farm | [Field, Health, Repeat] | N144; N170 |
| BCL3 | Pasture | [Field, Health, Flock] | N144; N170 |
| BCL4 | Quarry | [Field, Health, Research, Repeat] | N144; N235 |
| BCT1 | Trade post | [Post, Shoot, Health, Research] | N144; N195 |
| BCT2 | Dock | [Drop-off, Health, Shore, Burn, Research] | N144; N170; N206 |
| BP1 | School | [Teach, Health, Research] | N144; N194 |
| BP2 | Library | [Health, Research] | N144 |
| BP3 | Temple | [Spawn, Zeal, Care, Health, Research] | N144; N194 |
| BP4 | Baths | [Care, Health] | N144 |
| BP5 | Theatre | [Care, Health] | N144 |
| BP6 | Hospital | [Spawn, Heal, Care, Health, Research] | N144; N194 |
| BP7 | Aqueduct | [Health, Research] | N144 |
| BP8 | Courthouse | [Spawn, Shoot, Health, Research] | N144; N194 |
| BP9 | Hall | [Health, Research] | N144 |
| BP10 | War Council | [Squad, Health, Research] | N144 |
| BI1 | Mill | [Drop-off, Health, Burn, Research, Repeat] | N144; N206 |
| BI2 | Lumber camp | [Drop-off, Health, Burn, Research, Repeat] | N144; N206 |
| BI3 | Mining camp | [Drop-off, Health, Research, Repeat] | N144 |
| BI4 | Store | [Health, Research] | N144 |
| BI5 | Depot | [Drop-off, Supply, Health, Burn] | N144; N198; N206 |
| BI6 | Mint | [Make, Health, Research, Repeat] | N144; N195 |
| BI7 | Foundry | [Make, Health, Research, Repeat] | N144; N195 |
| BI8 | Workshop | [Make, Burn, Health, Research] | N144; N195; N206 |
| BI9 | Smith | [Health, Research] | N144 |
| BM1 | Barracks | [Spawn, Health, Shelter, Burn, Research] | N144; N206 |
| BM2 | Range | [Spawn, Health, Burn, Research] | N144; N206 |
| BM3 | Stable | [Spawn, Health, Burn, Research] | N144; N206 |
| BM4 | Siege workshop | [Spawn, Health, Research] | N144 |
| BW1 | Wall | [Health, Line, Repeat] | N144 |
| BW2 | Gate | [Health, Gate, Burn] | N144; N206 |
| BW3 | Tower | [Shoot, Health, Hold, Research, Repeat] | N144 |
| BW4 | Palisade | [Health, Line, Burn, Repeat] | N144; N206 |
| BF5 | Abatis | [Health, Burn] | N144; N198; N206 |
| BF1 | Pit | [Trap, Health] | N144; N198 |
| BF2 | Net | [Trap, Health] | N144; N198 |
| BF3 | Stakes | [Trap, Health] | N144; N198 |
| BF4 | Caltrops | [Trap, Health] | N144; N198 |
| BS1 | Throne | [] | N144 |
| BS2 | Wonder | [Wonder, Health] | N144 |
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
| US5 | Envoy | [Walk, Envoy, Health] | N144; N198 |
| UT1 | Caravan | [Walk, Carry, Trade, Health] | N144; N170; N195 |
| UT2 | Small camp wagon | [Walk, Carry, Unpack, Health] | N144; N199; N198 |
| UT4 | Large camp wagon | [Walk, Carry, Unpack, Health] | N144; N199; N198 |
| MH1 | Outlaws | [Walk, Fight, Health] | N144; N205 |
| MH3 | Robbers | [Walk, Fight, Health] | N144; N205 |
| MH4 | Vagabonds | [Walk, Health] | N144; N205 |
| MH5 | Wayfarers | [Walk, Join, Health] | N144; N205 |
| MH6 | Rebels | [Walk, Fight, Health] | N144; N198 |
| MW3 | Deer | [Walk, Wander, Prey, Health] | N144; N170 |
| MW4 | Wolf | [Walk, Wander, Fight, Health] | N144 |
| MW6 | Bear | [Walk, Wander, Fight, Health] | N144 |
| MW7 | Boar | [Walk, Wander, Prey, Health] | N170 |
| MW8 | Bison | [Walk, Wander, Prey, Health] | N170 |
| MG7 | Robbers' camp | [Take] | N205 |
| MG8 | Bear den | [Take] | N205 |
| MG9 | Drifters' camp | [Hire] | N205 |
| MG10 | Mercenaries | [Hire] | N205 |
| MG11 | Fallen star | [Take] | N205 |
| MH8 | Performers | [Walk, Health] | N252 |
| MH7 | Wagon train | [Walk, Join, Health] | N205 |
| UM17 | Legionary | [Walk, Fight, Health] | N144; N170; N176; N225 |
| UM18 | Han crossbowman | [Walk, Fight, Shoot, Health] | N144; N170; N176; N225 |
| UM19 | Immortal | [Walk, Fight, Health] | N144; N170; N176; N225 |
| UM20 | Mongol horse archer | [Walk, Fight, Shoot, Health] | N144; N170; N176; N225 |
| UM21 | Maurya war elephant | [Walk, Fight, Health] | N144; N170; N176; N225 |
| UM22 | Mali horseman | [Walk, Fight, Health] | N144; N170; N176; N225 |

## sides

| Code | Name | Value | Cited |
|---|---|---|---|
| I1 | the stances two sides, or a side and a group, may hold; a treaty binds only its signers (a vassal is an ally of its lord, at war with the lord's foes and at peace with the rest: D283) | [war, peace, ally] | N158; N159; N198 |
| I2 | every side starts at this stance with every other side and with each of the wild's groups (Mid's start) | war | N158 |
| I3 | the wild's four groups (the Natives, the outlaws, the bandits, the robbers) and their kinds, each holding its own stance with each side; a kind of the wild in none is the Natives'; the horde is the outlaws' (comes with the hordes) | {nat: [], out: [], ban: [MH1], rob: [MH3]} | N158 |
| I4 | the animals: everyone's foe, always, bound by no stance | [MW3, MW4, MW6, MW7, MW8] | N158; N170 |
| I5 | the wild's groups by name (Mid's GANG) | {nat: Natives, out: Outlaws, ban: Bandits, rob: Robbers} | N198 |
| I6 | each stance's word, in the Relations card's order (Mid's REL_WORD) | {war: Foe, peace: Neutral, ally: Friend} | N198 |
| I7 | a group whose gifts need its seat standing: the Natives' the Throne (Mid's giftWhy; the Throne waits for Albert) | {nat: BS1} | N198 |

## sound

| Code | Name | Value | Cited |
|---|---|---|---|
| HM1 | wood: a struck mode dies with time constant tau ÷ Hz | {tau: 3.2, modes: [[1, 1], [2.756, 0.25]]} | N59; N86 |
| HM2 | stone | {tau: 12, modes: [[1, 1], [2.756, 0.35], [5.404, 0.12]]} | N59; N86 |
| HM3 | metal: rings on | {tau: 447, modes: [[1, 1], [2.756, 0.5], [5.404, 0.3]]} | N59; N86 |
| HU1 | a tap on the glass | [0.03, [tone, 700, 0.05, triangle, 0.16]] | N145 |
| HU19 | an order given: a short rising two-note go, sure and quick (Albert, Nov 8 13:38: a sound for every tap, and it makes sense) | [0.12, [tone, 520, 0.05, triangle, 0.13], [tone, 780, 0.07, triangle, 0.13, 0, 0.06]] | N145 |
| HU20 | a card opened (a double tap): a light rising chime | [0.1, [tone, 880, 0.04, sine, 0.1], [tone, 1320, 0.06, sine, 0.08, 0, 0.04]] | N145 |
| HU21 | ice cracking under weight: sharp snaps and a low groan, the warning before it gives | [0.35, [hiss, 0.06, 0.5, 3500, 0.9, 1500], [hiss, 0.05, 0.4, 2500, 0.9, 800, 0.12], [hiss, 0.07, 0.45, 3000, 0.9, 1000, 0.3], [tone, 95, 0.2 | N145 |
| HU22 | ice gives way: a heavy splash | [0.5, [hiss, 0.6, 0.5, 900, 0.6, 200], [tone, 120, 0.3, sine, 0.2, 60]] | N145 |
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
| HA3 | thunder, after the flash by the real delay: the crack, the rumble and the low roll louder and longer than Base's, by Albert's call, not a measured loudness (Albert, Nov 10, N17 #15: louder, more startling) | [0.5, [hiss, 0.15, 0.8, 2500, 0.8, 600], [hiss, 3.2, 0.6, 160, 0.5, 50, 0.05], [tone, 45, 2.6, sine, 0.4, 30]] | N145; N307 |
| HA4 | the wind, as hard as it blows: heard when it blows past HX4's wind share of its most, a chance a second its share × gust (Mid's AMB.wind and ambience; the wind is measured, not a feature) | [4, [hiss, 2.4, 0.08, 500, 0.6, 280]] | N146; N203 |
| HA6 | a stampede: a rolling drum of hooves | [1, [tone, 70, 0.08, sine, 0.3, 40], [hiss, 0.05, 0.18, 400, 1, 200], [tone, 70, 0.08, sine, 0.3, 40, 0.13], [hiss, 0.05, 0.18, 400, 1, 200, | N146 |
| HA7 | the ground shakes | [1.5, [tone, 38, 1.6, sine, 0.4, 28], [hiss, 1.4, 0.3, 120, 0.6, 60]] | N146 |
| HE1 | which event plays which sound (a find's own sound and a unit's voice sit on its shell) | {tap: tap, err: err, place: place, order: order, open: open, crack: crack, splash: splash, built: done, research: done, hitRanged: arrow, bu | N97 |
| HX1 | the ear: the lens's field of view, the air's loss in dB a km, the quietest heard, the speed of sound in m/s | {fov: 60, alphaKm: 5, floor: 0.03, c: 340} | N58 |
| HX2 | which sounds are ambience and which alerts (the rest are effects) | {amb: [bird, cricket, thunder, wind, hooves, rumble], alert: [age, win, lose, done, doneWar, ready, readySol, coin, horn, tribute, zeal, jin | N145; N146 |
| HX3 | voices at once; how many each kind leaves free | {max: 14, keep: {alert: 0, fx: 2, amb: 5}} | N145 |
| HX4 | songs a second a singer in view (a Poisson rate), and the most singers counted; the wind heard past wind of its most, a chance a second its share × gust (Mid's 0.35, and ÷ 4) | {bird: 0.025, cricket: 0.04, singers: 12, wind: 0.35, gust: 0.25} | N12; N145; N203 |
| HX5 | the air's top: Hz with no snow, Hz under full snow; how much rain masks a quiet sound | {open: 16000, snow: 2500, rainMask: 0.5} | N88; N97 |
| HX6 | which events are also felt, milliseconds of buzz; a strike twice Base's (Albert, Nov 10, N17 #15) | {place: 8, order: 6, crack: 30, splash: 45, built: 25, builtWar: 25, impact: 25, fell: 40, strike: 80, err: 8} | N145; N307 |
| HX7 | how far a sound carries before it fades to the quietest heard, metres: thunder about 10 miles | {thunder: 16093} | N89 |
| HX8 | the phone's audio session: ambient obeys the Ring/Silent switch and plays under the player's own music | ambient | N148 |
| HX9 | the limiter: a battle's many blows never clip a phone speaker (dB, dB, ratio, seconds, seconds) | {threshold: -3, knee: 10, ratio: 4, attack: 0.005, release: 0.25} | N146 |
| HX10 | the three volumes the player sets, a step a tap | {steps: [[1, Full], [0.5, Half], [0, Off]], names: {fx: Effects, alert: Alerts, amb: Ambience}, icons: {fx: sound, alert: bell, amb: leaf}} | N149 |

## sprites

| Code | Name | Value | Cited |
|---|---|---|---|
| P1 | the vil figure; every other villager born is drawn as its alt | {brush: worker, o: {tunic: #8a6a44, trim: $side, sash: $side, head: bare, legs: #5a4a38, beard: #6b4a2c}, box: [30, 30], alt: lady} | N150 |
| P2 | the spear figure; the Hoplite and the Pikeman by rank | {brush: person, o: {tunic: $side, head: bare, shield: round, weapon: spear, legs: #6b5a40, beard: #4a3420}, box: [52, 34], rank: [{brush: pe | N150; N176 |
| P3 | the archer figure; the Longbowman by rank | {brush: person, o: {tunic: $side, head: hood, weapon: bow, legs: #5a4a38}, box: [26, 30], rank: [{brush: person, o: {tunic: $side, head: cap | N150; N176 |
| P4 | the cata figure, on its barded horse; the Knight by rank | {brush: draw, parts: [[horse, {coat: #5a3a24, barding: scale}], [at, -0.6, -1, 0, [[person, {tunic: $side, body: scale, head: conical, helmC | N150; N176 |
| P5 | the ram figure | {brush: draw, parts: [[L, {atk: [-17, -13]}, -8, {atk: [15, 19]}, -8, #6b4a2c, 3], [P, [[{atk: [15, 19]}, -10], [{atk: [19, 23]}, -8], [{atk | N150; N176 |
| P6 | the catapult figure | {brush: draw, parts: [[planks, -11, -6, 11, -3, #8a5d34], [P, [[-2, -6], [0, -14], [2, -6]], #8a5d34, #141210, 0.5], [at, 0, -12, {atk: [-0. | N150; N176 |
| P7 | the priest figure | {brush: person, o: {tunic: #efe6cf, trim: #c9a227, body: robe, head: bare, weapon: staff, sash: $side, legs: #d8cdb2, beard: #d8d0c0}, box:  | N150 |
| P8 | the medic figure | {brush: person, o: {tunic: #e4dccb, trim: $side, head: cap, capCol: #e4dccb, weapon: bag, sash: #c23a30, legs: #6b5a48}, box: [26, 30]} | N150 |
| P9 | the spy figure | {brush: person, o: {tunic: #2a2a30, trim: $side, body: robe, head: hood, hoodCol: #1c1c22, weapon: dagger, cape: #1c1c22, legs: #22222a}, bo | N150 |
| P10 | the scout figure, a runner; mounted by rank (Horse breeding) | {brush: person, o: {tunic: $side, head: cap, capCol: $side*0.6, weapon: staff, cape: $side*0.6}, box: [44, 34], rank: [{brush: draw, parts:  | N150; N176 |
| P11 | the caravan figure | {brush: caravan, box: [46, 30]} | N150 |
| P12 | the wagon figure | {brush: wagon, box: [56, 32]} | N150 |
| P13 | the bandit figure | {brush: person, o: {tunic: #5a5040, head: hood, hoodCol: #4a3e2e, weapon: club, legs: #3a3228, beard: #3a2a1a}, box: [26, 30]} | N150 |
| P14 | the robber figure | {brush: person, o: {tunic: #4a3a30, head: mask, weapon: sword, shield: round, trim: #6b3a2a, legs: #2e2620}, box: [26, 30]} | N150 |
| P15 | the vagabond figure | {brush: person, o: {tunic: #6a5e4e, head: bare, weapon: none, legs: #4a4038, beard: #4a3a2a, sash: #8a3a2a}, box: [26, 30]} | N150 |
| P16 | the wayfarer figure | {brush: person, o: {tunic: #7a6a50, head: straw, weapon: crook, legs: #5a4a38, beard: #8a8070, cape: #6b5a40}, box: [26, 30]} | N150 |
| P17 | the deer figure | {brush: quad, o: {col: #a0703e, len: 13, h: 5.6, legH: 7.4, legW: 0.6, head: 2.2, headY: 1.8, antlers: true, tail: 0.8}, box: [26, 25]} | N150 |
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
| PF2 | the person's cut, one style for every figure (Albert, Nov 8 12:19: all the units as the lady's mock): each line edged in a darker shade of its own colour (rim: k of the fill, w of the old width; ink for a gradient), never black; the tunic, robe, armour and apron as curves from the shoulder (s), hip (h), hem (e), ground (g) or face (f), [across, from, down]; sleeves w wide with a rim, bowed out; the hair (hairCol, unless the look names its own) under a bare head, the brow and nose; hem below the hip; folds; the far sleeve far and the near near of the tunic; alt: every alt-th villager born is drawn as its look's alt | {rim: {k: 0.45, w: 0.6, base: 0.5, hex: 7, ink: rgba(26,20,14,.6)}, alt: 2, hem: 4.2, far: 0.72, near: 0.95, nose: 0.75, hand: 0.8, sash: 0. | N261 |
| P1b | the villager, a woman: a kirtle to the ground, an apron, a coif, her side's colour at the girdle (Albert, Nov 8 12:00: lady villagers; medieval women gathered, harvested, herded and carried) | {brush: worker, o: {tunic: #7d5f48, trim: $side, girdle: $side, head: coif, body: dress, apron: #d6ccb4, legs: #5a4a38}, box: [30, 30]} | N261 |
| PT1 | the trees as a cast, like the units (Albert, Nov 8 13:54: twenty or thirty, reused; 13:55: variants, not all the same): twelve kinds, each in variants drawn from its own seed, painted once a leaf stage and kept; where each grows by weight (wet: under wet units, low by the water; plain; hill: over the land), as woods group (willow and birch by water, oak, maple and beech on the plain, spruce, fir and pine on the hills); the year's nine leaf stages (from, in seasons): buds, leafing, spring's light green, summer, turning, peak, dropping, late fall's thin crown and litter, winter bare (Albert, Nov 8 14:08: leaves grow in spring and fall in the fall, a transition); each tree keeps its own leaves (one falls when the share kept drops under its own draw, so a crown thins and never reshuffles) and turns up to lag of a season after its neighbours, by its own seed; evergreens keep their needles and only brighten in spring; snow on the ground lies on boughs and twigs too. A crown is leaf dabs inside its outline (ellipse, lumpy, spindle, dome, weep), each lit by where it sits, upper left bright (sun), the inside darker (dab); bare limbs grow by twig; evergreen tiers fade light to shade across the whole tree (tier) | {gloss: {x: 0.68, y: 0.22, r: 0.62, a: 0.38, col: #fff0b8, clear: #fff0b800}, half: 0.5, lag: 0.25, wet: 20, kinds: [{name: gloss: the sunli | N261 |
| PF1 | a person drawn in true proportion, about 7.5 heads tall (Vitruvius; Loomis): the legs half the height (hip), the torso (hip to shoulder), the head drawn at head of the old toy head and the body slim of its old width (Albert, Nov 8 11:35: serious, not cartoonish) | {hip: -11, torso: 6.6, head: 0.55, slim: 0.8} | N261 |
| PN1 | the finds: their scale, drawn smaller as they are used (left[0] + left[1] × the share left, Mid's nodeScale), the tool each is worked with (the figure's work frames: axe, hands, pick), and their dot far out; the trees' leaves by the season (autumn's two, winter's snow), the carcass, the fish's ripple and a trade stop's ring (its stall waits for the finds' art) (Mid's nodeSprite, drawNode); the bear den and the fallen star as blobs (offset, radius, the colour's name in C18); the robbers', drifters' and mercenaries' camps wear the campfire (F31) | {left: [0.6, 0.4], tool: {tree: 0, bush: 1, bld: 1, other: 2, fish: 1, meat: 1}, dot: {tree: #3c6c32, bush: #3f6b33, gold: gold, stone: rock | N152; N164; N170; N195; N205 |
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
| P35 | the standard an army out carries, marching or standing (an order, a rally or a march, Albert, Nov 10, N17 #8): drawn over a group of least or more (three: the smallest group that reads as a unit) once the zoom passes zoom; a pole pole tall, a ring at its foot as full as the group's health (radius, plus), filled from top (radians), the flag's width and its edges, its wave (speed, swing, the tail's share), the ring's tilt and its shadow's alpha (Mid's drawStandards) | {least: 3, zoom: 0.4, pole: 30, ring: [6, 2], line: 2.4, flag: [10, 1, 6, 7], wave: [4, 1.4, 1.5], tilt: 0.5, alpha: 0.6, top: -1.5708} | N188 |
| P36 | a blow's sparks: rays rays turned turn apart and spinning spin, from from out to to plus grow over its life, lifted lift (Mid's sparkDraw) | {rays: 5, turn: 1.26, spin: 7, from: 2, to: 3, grow: 6, line: 1.4, lift: 6} | N188 |
| P37 | the marks over the map: a health bar h tall, its shadow's alpha; a unit's width, lift and margin; a building's width and lift a tile of its size, plus, and margin; a whole turn | {bar: {h: 3, alpha: 0.5, unit: [16, 34, 20], bld: [10, 12, 20, 40]}, arc: [0, 6.2832]} | N114 |
| P38 | the crosshair (Mid's drawReticle): its radius the larger of r[0] and r[1] a zoom plus r[2], fired times while it settles settle s after Go; corner brackets bracket of it long, line wide; held it glows (alpha, px more); a sonar ring (its beat, its fall, alpha, from px, out to times r); chevrons turning (speed, at share of r, length, half width, how many); a scan line (speed, inset px); the cross's arms out past r and its gap; its words label px above | {r: [30, 16, 6], fired: 0.8, settle: 0.4, bracket: 0.4, line: 1.5, glow: [0.14, 12], sonar: [0.5, 1.4, 0.8, 4, 1.3], chev: [1.2, 0.62, 7, 5, | N190 |
| P39 | a group on the march (Mid's drawOrders): a dashed line from the group to where it goes (dash, flowing one px each flow ms), a ring there ring a zoom (tilt), faint once arrived (done); line widths (line, ring, arrived), alphas (line, ring, arrived, words); the time left up px over it | {dash: [6, 6], done: [3, 5], line: [1.5, 2, 1.2], alpha: [0.7, 0.85, 0.35, 0.95], ring: 14, flow: 60, up: 4, tilt: 0.5} | N190 |
| P40 | your rally flag (Mid's flagAt): a pole pole a zoom, its fly out and down, line wide, the pole's paint | {pole: 16, fly: [10, 13, 10], line: 1.2, col: #2b2b2b} | N190 |
| P41 | leaves over a soldier in ambush (Mid's leavesOver): a leaf at each of at (spread apart), lifted by lift (rise), up a zoom over its foot, spread apart and rise between, swaying (speed, phase apart, depth), r wide and tall, turned; the two greens | {at: [-1, 0, 1], lift: [0, 1, 0], up: 8, spread: 4.5, rise: 3, sway: [0.8, 2.1, 0.6], r: [3.6, 2.2], turn: [0.5, 0.9], cols: [rgba(96,142,66 | N190 |
| P42 | the finger's marks (Mid's drawTouch): the hold's ring line; the box's fill alpha and line; a label's words up px; a whole turn from the top | {ring: 3, box: [0.12, 2], up: 12, turn: 6.2832, top: -1.5708} | N190 |
| P43 | the envoy figure (Mid's envoy look) | {brush: person, o: {tunic: #eae2cc, trim: $side, body: robe, head: bare, weapon: scroll, sash: $side, legs: #d8cdb2}, box: [26, 30]} | N150; N198 |
| P44 | the hidden traps, drawn flat on the ground in their side's shade or the foe's red (Mid's drawBld for traps): a site a dashed ring, a pit a dark hollow, a net its mesh, stakes their points, caltrops a spike for each tread left and one | {site: {own: rgba(255,211,94,.7), foe: rgba(255,211,94,.7), w: 1, dash: [3, 3], e: [6, 3.6, 0, 0, 7]}, pit: {own: rgba(60,50,30,.5), foe: rg | N198 |
| P45 | the dressing's looks (Mid's CHIMNEY, PILE, pileArt, NODE_H, idleMark): where each look's chimney stands (across, up); each look's piles (the store, the shape); a log, a sack and a block; how tall each find stands, for its shadow; the idle and focus marks | {chimney: {house: [6.2, 26], smith: [9, 28], keep: [-20, 44], foundry: [9, 34]}, pile: {lumber: [[wood, log]], mining: [[stone, block], [gol | N208 |
| P46 | the Roman legionary figure (F36, Mid's civ units) | {brush: person, o: {tunic: #b33a2e, trim: $side, body: segm, head: galea, crest: #b33a2e, shield: scutum, weapon: gladius, legs: #a8653a, bo | N150; N225 |
| P47 | the Persian Immortal figure (F36, Mid's civ units) | {brush: person, o: {tunic: $side, body: robe, head: tiara, helmCol: #efe4cc, shield: wicker, weapon: spear, legs: $side*0.6, beard: #2a1a10, | N150; N225 |
| P48 | the Mali horseman figure, on its cloth-barded horse (F36, Mid's civ units) | {brush: draw, parts: [[horse, {coat: #efe6d4, barding: cloth, cloth: #c9a227}], [at, -0.6, -1, 0, [[person, {tunic: $side, body: robe, head: | N150; N225 |
| P49 | the quick action's aimer, under the finger on the aim step (Albert, Nov 10 16:55, mock A: a plain white ring with four ticks and a dot, in place of Base's reticle): its ring r px across the ground (tilted as the ground is), each tick from tick[0] to tick[1] px beyond the ring, the dot's radius, the line's width and the white's alpha | {r: 16, tick: [5, 10], dot: 2.5, line: 2, tilt: 0.5, alpha: 0.92} | N315 |

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
| O21 | Windmill | {at: BI1, line: Harvest, age: 3, cost: {food: 430, wood: 290}, time: 71, fx: [{s: rate, k: BCL1, p: 0.1}], when: 1130s, w: 6} | N160; N161 |
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
| O45 | Hearth and pot | {at: BR1, line: Dwelling, age: 0, cost: {wood: 40, food: 30}, time: 20, fx: [{s: eat, c: 0.1}], when: about 8000 BC, w: 4} | N160; N161 |
| O46 | Ice house | {at: BR1, line: Dwelling, age: 2, cost: {stone: 120, wood: 80}, time: 32, fx: [{s: rate, k: MW1, p: 0.15}, {s: rate, k: R6, p: 0.15}, {s: sp | N160; N161; N170 |
| O47 | Chimney and fireplace | {at: BR1, line: Dwelling, age: 3, cost: {stone: 180, wood: 120}, time: 40, fx: [{s: warm, a: 0.05}, {s: chill, c: 0.5}], when: 1100s, w: 5} | N160; N161 |
| O48 | Calendar | {at: BTC1, line: Watch, age: 2, cost: {food: 180, gold: 120}, time: 41, fx: [{s: rate, k: BCL1, p: 0.05}, {s: time, k: O, c: 0.05}], need: [ | N160; N161 |
| O49 | Town watch | {at: BTC1, line: Watch, age: 3, cost: {food: 90, gold: 60}, time: 26, fx: [{s: rng, k: BTC1, a: 1.5}], when: 1200s, w: 4} | N160; N161 |
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
| O208 | Medicine | {at: BP2, line: Learning, age: 2, cost: {gold: 180, stone: 120}, time: 41, fx: [{s: heal, p: 0.5}], when: 400 BC, w: 6} | N160; N161; N206 |
| O60 | Architecture | {at: BP2, line: Learning, age: 2, cost: {gold: 180, stone: 120}, time: 41, fx: [{s: build, c: 0.2}], need: [masonry], when: 25 BC, w: 6} | N160; N161 |
| O209 | Medical school | {at: BP2, line: Learning, age: 3, cost: {gold: 290, stone: 190}, time: 56, fx: [{s: death, c: 0.5}, {s: cure, p: 1}], need: [medicine], when | N160; N161; N206 |
| O61 | Guilds | {at: BP2, line: Learning, age: 3, cost: {gold: 260, stone: 180}, time: 52, fx: [{s: queue, a: 2}], when: 1100s, w: 5} | N160; N161 |
| O62 | Printing press | {at: BP2, line: Learning, age: 4, cost: {gold: 550, stone: 360}, time: 87, fx: [{s: time, k: O, c: 0.32}], when: 1450s, w: 9} | N160; N161 |
| O63 | Optics | {at: BP2, line: Learning, age: 4, cost: {gold: 430, stone: 290}, time: 71, fx: [{s: sight, k: *, a: 2.0}], need: [press], when: 1608, w: 6} | N160; N161 |
| O64 | Seed selection | {at: BI1, line: Soil, age: 0, cost: {food: 60, wood: 40}, time: 19, fx: [{s: soil, a: 0.1}], when: 8000 BC, w: 6} | N160; N161; N170 |
| O65 | Irrigation | {at: BI1, line: Soil, age: 1, cost: {food: 200, wood: 130}, time: 44, fx: [{s: soil, a: 0.15}], when: 3000 BC, w: 7} | N160; N161; N170 |
| O66 | Manuring | {at: BI1, line: Soil, age: 1, cost: {food: 90, wood: 60}, time: 26, fx: [{s: soil, a: 0.1}], when: 2000 BC, w: 4} | N160; N161; N170 |
| O67 | Crop rotation | {at: BI1, line: Soil, age: 3, cost: {food: 340, wood: 230}, time: 64, fx: [{s: rate, k: BCL1, p: 0.2}, {s: limit, k: BCL1, a: 3}], when: 800 | N160; N161; N170 |
| O68 | Enclosure | {at: BI1, line: Soil, age: 4, cost: {food: 390, wood: 260}, time: 66, fx: [{s: limit, k: BCL1, a: 3}], when: 1500s, w: 5} | N160; N161; N170 |
| O69 | New World crops | {at: BI1, line: Soil, age: 4, cost: {food: 510, wood: 340}, time: 82, fx: [{s: rate, k: BCL1, p: 0.2}], need: [deepboats], when: 1570s, w: 8 | N160; N161; N170 |
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
| O200 | Marching camps | {at: BM1, line: March, age: 2, cost: {food: 100, gold: 70}, time: 28, fx: [{s: rest, p: 0.3}], when: 400 BC, w: 5} | N160; N161; N198 |
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
| O136 | Gun founding | {at: BI9, line: Walls, age: 4, cost: {gold: 470, iron: 310}, time: 77, fx: [{s: atk, k: [UM9, UM14], a: 10}], need: [blast], when: 1400s, w: | N160; N161; N188 |
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
| O260 | Local guides | {at: BM1, line: Ground, age: 1, cost: {food: 90, gold: 60}, time: 26, fx: [{s: guides, c: 0.5}], when: 401 BC, w: 4} | N160; N161; N280 |
| O261 | Guerrilla warfare | {at: BM1, line: Ground, age: 3, cost: {food: 220, gold: 150}, time: 44, fx: [{s: spring, p: 0.5}], when: 1808, w: 5} | N160; N161; N280 |
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
| O170 | Weights and measures | {at: BCR1, line: Trade, age: 1, cost: {gold: 100, stone: 70}, time: 28, fx: [{s: sell, a: 0.05}], when: 3000 BC, w: 5} | N160; N161; N195 |
| O171 | Coinage | {at: BCR1, line: Trade, age: 2, cost: {gold: 220, stone: 150}, time: 47, fx: [{s: sell, a: 0.1}], when: 600 BC, w: 8} | N160; N161; N195 |
| O172 | Letters of credit | {at: BCR1, line: Trade, age: 3, cost: {gold: 290, stone: 190}, time: 56, fx: [{s: trade, p: 0.25}], need: [coinage], when: 1200s, w: 6} | N160; N161; N195 |
| O173 | Bank | {at: BCR1, line: Trade, age: 3, cost: {gold: 300, stone: 200}, time: 56, fx: [{s: interest, a: 0.01}], need: [credit], when: 1397, w: 6} | N160; N161; N195 |
| O174 | Banking | {at: BCR1, line: Trade, age: 4, cost: {gold: 470, stone: 310}, time: 77, fx: [{s: venture, a: 0.2}], need: [credit], when: 1400s, w: 7} | N160; N161; N195 |
| O175 | Bourse | {at: BCR1, line: Trade, age: 4, cost: {gold: 390, stone: 260}, time: 66, fx: [{s: trade, p: 0.15}], need: [banking], when: 1531, w: 5} | N160; N161; N195 |
| O176 | Armed caravans | {at: BCR1, line: Caravans, age: 2, cost: {gold: 150, stone: 100}, time: 35, fx: [{s: hp, k: UT1, p: 1}, {s: armed, k: UT1, a: 1}], when: 100 | N160; N161; N195 |
| O177 | Convoys | {at: BCR1, line: Caravans, age: 4, cost: {gold: 350, stone: 230}, time: 61, fx: [{s: hp, k: UT1, p: 0.5}], when: 1560s, w: 4} | N160; N161; N195 |
| O178 | Engraved dies | {at: BI6, line: Coin, age: 3, cost: {gold: 240, iron: 160}, time: 48, fx: [{s: make, k: gold, p: 0.2}], when: 500 BC, w: 4} | N160; N161; N195 |
| O179 | Assaying | {at: BI6, line: Coin, age: 3, cost: {gold: 390, iron: 260}, time: 66, fx: [{s: make, k: gold, p: 0.5}], when: 1200s, w: 5} | N160; N161; N195 |
| O180 | Milled coin | {at: BI6, line: Coin, age: 4, cost: {gold: 390, iron: 260}, time: 66, fx: [{s: sell, a: 0.05}], need: [assay], when: 1550s, w: 5} | N160; N161; N195 |
| O181 | Learning by doing | {at: BI4, line: Scale, age: 2, cost: {wood: 220, gold: 140}, time: 40, fx: [{s: scale, a: 1}], when: 100s BC, w: 6} | N160; N161; N195 |
| O182 | Division of labour | {at: BI4, line: Scale, age: 4, cost: {wood: 360, gold: 260}, time: 55, fx: [{s: make, k: gold, p: 0.2}, {s: make, k: [cloth, beer], p: 0.1}] | N160; N161; N195 |
| O183 | Warp-weighted loom | {at: BI8, line: Cloth, age: 1, cost: {wood: 100, gold: 70}, time: 28, fx: [{s: make, k: cloth, p: 0.15}], when: 5000 BC, w: 5} | N160; N161; N195 |
| O184 | Spinning wheel | {at: BI8, line: Cloth, age: 3, cost: {wood: 180, gold: 120}, time: 41, fx: [{s: make, k: cloth, p: 0.3}], when: 1000s, w: 6} | N160; N161; N195 |
| O185 | Fulling mill | {at: BI8, line: Cloth, age: 3, cost: {wood: 260, gold: 180}, time: 52, fx: [{s: make, k: cloth, p: 0.3}], need: [noria], when: 1000s, w: 5} | N160; N161; N195 |
| O186 | Stocking frame | {at: BI8, line: Cloth, age: 4, cost: {wood: 390, gold: 260}, time: 66, fx: [{s: make, k: cloth, p: 0.3}], when: 1589, w: 5} | N160; N161; N195 |
| O187 | Hops | {at: BI8, line: Drink, age: 3, cost: {wood: 150, gold: 100}, time: 35, fx: [{s: make, k: beer, p: 0.3}], when: 1100s, w: 4} | N160; N161; N195 |
| O188 | Common brewhouse | {at: BI8, line: Drink, age: 3, cost: {wood: 210, gold: 140}, time: 44, fx: [{s: make, k: beer, p: 0.2}], when: 1300s, w: 3} | N160; N161; N195 |
| O189 | Cold brewing | {at: BI8, line: Drink, age: 4, cost: {wood: 310, gold: 210}, time: 55, fx: [{s: make, k: beer, p: 0.2}], when: 1500s, w: 3} | N160; N161; N195 |
| O190 | Cast iron | {at: BI7, line: Furnace, age: 3, cost: {wood: 290, stone: 190}, time: 56, fx: [{s: make, k: iron, p: 0.15}], when: 500 BC, w: 6} | N160; N161; N195 |
| O191 | Water bellows | {at: BI7, line: Furnace, age: 3, cost: {wood: 290, stone: 190}, time: 56, fx: [{s: make, k: iron, p: 0.2}], when: 31 AD, w: 6} | N160; N161; N195 |
| O192 | Blast furnace | {at: BI7, line: Furnace, age: 4, cost: {wood: 510, stone: 340}, time: 82, fx: [{s: make, k: iron, p: 0.5}], need: [castiron], when: 1300s, w | N160; N161; N195 |
| O193 | Finery forge | {at: BI7, line: Furnace, age: 4, cost: {wood: 390, stone: 260}, time: 66, fx: [{s: make, k: iron, p: 0.15}], need: [blast], when: 1400s, w:  | N160; N161; N195 |
| O194 | Caravanserai | {at: BCT1, line: Roads, age: 2, cost: {wood: 170, gold: 110}, time: 38, fx: [{s: hp, k: UT1, p: 0.5}], when: 500 BC, w: 5} | N160; N161; N195 |
| O195 | Milestones | {at: BCT1, line: Roads, age: 2, cost: {wood: 130, gold: 90}, time: 32, fx: [{s: trade, p: 0.05}], when: 250 BC, w: 3} | N160; N161; N195 |
| O196 | Fortified posts | {at: BCT1, line: Roads, age: 3, cost: {wood: 260, gold: 180}, time: 52, fx: [{s: hp, k: BCT1, p: 0.5}, {s: atk, k: BCT1, a: 5}], need: [fort | N160; N161; N195 |
| O197 | Customs | {at: BCT1, line: Roads, age: 4, cost: {wood: 390, gold: 260}, time: 66, fx: [{s: cut, a: 0.1}], when: 1300s, w: 5} | N160; N161; N195 |
| O198 | Post roads | {at: BCT1, line: Roads, age: 4, cost: {wood: 390, gold: 260}, time: 66, fx: [{s: trade, p: 0.1}], need: [roads], when: 1500s, w: 5} | N160; N161; N195 |
| O223 | Scientific method | {at: BP2, line: Enlightenment, age: 5, cost: {gold: 600, stone: 300}, time: 90, fx: [{s: time, k: O, c: 0.25}], when: 1660, w: 1} | N160; N161; N222 |
| O224 | Four-course rotation | {at: BP2, line: Enlightenment, age: 5, cost: {gold: 600, wood: 400}, time: 90, fx: [{s: rate, k: BCL1, p: 0.25}], when: 1730s, w: 3} | N160; N161; N222 |
| O225 | Encyclopédie | {at: BP2, line: Enlightenment, age: 5, cost: {gold: 700, stone: 300}, time: 100, fx: [{s: cost, k: O, c: 0.15}], when: 1751, w: 4} | N160; N161; N222 |
| O226 | Public schooling | {at: BP2, line: Enlightenment, age: 5, cost: {gold: 700, food: 500}, time: 100, fx: [{s: rate, k: Yield, p: 0.1}], when: 1763, w: 5} | N160; N161; N222 |
| O199 | Free trade | {at: BP2, line: Enlightenment, age: 5, cost: {gold: 800, stone: 400}, time: 110, fx: [{s: trade, p: 0.25}], when: 1776, w: 6} | N160; N161; N195 |
| O201 | Camp wagons | {at: BM3, line: Camps, age: 2, cost: {wood: 200, gold: 120}, time: 40, fx: [], when: 100s BC, w: 6} | N160; N161; N198 |
| O202 | Field logistics | {at: BM3, line: Camps, age: 2, cost: {food: 180, gold: 120}, time: 40, fx: [{s: campbuild, p: 0.6667}, {s: tentcost, c: 0.6}], need: [campwa | N160; N161; N198 |
| O205 | Weather signs | {at: BP1, line: Sky, age: 2, cost: {gold: 120, wood: 60}, time: 30, fx: [{s: forecast, a: 1}], when: 300 BC, w: 3} | N160; N161; N203 |
| O206 | Levees | {at: BP2, line: Weather, age: 3, cost: {gold: 290, stone: 190}, time: 56, fx: [{s: flood, a: 1}], need: [irrigation], when: 1000s, w: 6} | N160; N161; N203 |
| O207 | Weather glass | {at: BP2, line: Weather, age: 4, cost: {gold: 430, stone: 290}, time: 71, fx: [{s: rate, k: BCL1, p: 0.1022}], need: [science, weathersigns] | N160; N161; N204 |
| O210 | Vaccination | {at: BP2, line: Enlightenment, age: 5, cost: {gold: 600, food: 400}, time: 90, fx: [{s: sick, c: 0.5}], when: 1796, w: 2} | N160; N161; N206 |
| O211 | Bandages | {at: BP6, line: Wards, age: 2, cost: {food: 150, gold: 100}, time: 35, fx: [{s: heal, p: 0.3}], when: 400 BC, w: 4} | N160; N161; N206 |
| O212 | Herbals | {at: BP6, line: Wards, age: 2, cost: {food: 130, gold: 90}, time: 32, fx: [{s: cure, p: 0.3}], when: 50 AD, w: 3} | N160; N161; N206 |
| O213 | Hospitals | {at: BP6, line: Wards, age: 3, cost: {food: 290, gold: 190}, time: 56, fx: [{s: death, c: 0.30000000000000004}], when: 800s, w: 6} | N160; N161; N206 |
| O214 | Pharmacy | {at: BP6, line: Wards, age: 3, cost: {food: 290, gold: 190}, time: 56, fx: [{s: cure, p: 0.5}], need: [herbs], when: 1025, w: 6} | N160; N161; N206 |
| O215 | Quarantine | {at: BP6, line: Wards, age: 3, cost: {food: 320, gold: 210}, time: 60, fx: [{s: spread, c: 0.4}], when: 1377, w: 7} | N160; N161; N206; N48 |
| O216 | Inoculation | {at: BP6, line: Wards, age: 4, cost: {food: 510, gold: 340}, time: 82, fx: [{s: plague, c: 0.7}], need: [quarantine], when: 1500s, w: 8} | N160; N161; N206 |
| O217 | Anatomy | {at: BP6, line: Wards, age: 4, cost: {food: 430, gold: 290}, time: 71, fx: [{s: heal, p: 0.2}], when: 1543, w: 6} | N160; N161; N206 |
| O218 | Surgeons | {at: BP6, line: Wards, age: 4, cost: {food: 430, gold: 290}, time: 71, fx: [{s: heal, p: 0.5}], when: 1545, w: 6} | N160; N161; N206 |
| O219 | Sewers | {at: BP7, line: Water, age: 2, cost: {stone: 320, gold: 210}, time: 60, fx: [{s: spread, c: 0.1157363374391791}], when: 600 BC, w: 7} | N160; N161; N206; N207 |
| O220 | Clean water | {at: BP7, line: Water, age: 2, cost: {stone: 200, gold: 130}, time: 44, fx: [{s: spread, c: 0.11838515321658394}], when: 312 BC, w: 7} | N160; N161; N206; N207 |
| O221 | Plumbing | {at: BP7, line: Water, age: 2, cost: {stone: 260, gold: 180}, time: 52, fx: [{s: room, k: BR2, a: 4}], when: 100s, w: 5} | N160; N161; N206 |
| O222 | Waterworks | {at: BP7, line: Water, age: 4, cost: {stone: 390, gold: 260}, time: 66, fx: [{s: room, k: BR2, a: 2}, {s: sick, c: 0.19999999999999996}], ne | N160; N161; N206 |
| O227 | Runners | {at: BTC1, line: Post, age: 1, cost: {food: 120, gold: 40}, time: 30, fx: [{s: news, a: 1}], when: 2000 BC, w: 3} | N160; N161; N223 |
| O228 | Royal Road | {at: BTC1, line: Post, age: 2, cost: {food: 240, gold: 160, stone: 80}, time: 50, fx: [{s: news, a: 1}], when: 500 BC, w: 5} | N160; N161; N223 |
| O229 | Relay stations | {at: BTC1, line: Post, age: 3, cost: {food: 300, gold: 200}, time: 55, fx: [{s: news, a: 1}], when: 1230s, w: 5} | N160; N161; N223 |
| O230 | Post riders | {at: BTC1, line: Post, age: 4, cost: {food: 390, gold: 260}, time: 66, fx: [{s: news, a: 1}, {s: diplo, a: 0.1}], when: 1490, w: 5} | N160; N161; N223 |
| O231 | News sheets | {at: BTC1, line: Post, age: 4, cost: {gold: 300, wood: 150}, time: 50, fx: [{s: news, a: 1}], when: 1605, w: 4} | N160; N161; N223 |
| O232 | Via militaris | {at: BP9, line: Rome, age: 2, cost: {wood: 200, stone: 150}, time: 40, fx: [{s: spd, k: [Foot, Archers], p: 0.2}], when: 312 BC, w: 6, civ:  | N161; N225 |
| O233 | Horrea | {at: BP9, line: Rome, age: 2, cost: {wood: 220, stone: 200}, time: 42, fx: [{s: spoil, c: 0.5}], need: [viamil], when: 100s, w: 5, civ: roma | N161; N225 |
| O234 | Castra | {at: BP9, line: Rome, age: 2, cost: {wood: 260, gold: 140}, time: 45, fx: [{s: campbuild, p: 0.5}, {s: hp, k: [BW4, BTC8, BF5], p: 0.5}], ne | N161; N225 |
| O235 | Bronze trigger | {at: BP9, line: Han, age: 2, cost: {wood: 200, iron: 120}, time: 40, fx: [{s: rng, k: [UM8, UM18], a: 2}], when: 200s BC, w: 6, civ: han} | N161; N225 |
| O236 | Ever-normal granary | {at: BP9, line: Han, age: 2, cost: {wood: 220, gold: 140}, time: 42, fx: [{s: band, c: 0.5}], need: [trigger], when: 54 BC, w: 5, civ: han} | N161; N225 |
| O237 | Taixue | {at: BP9, line: Han, age: 2, cost: {wood: 260, gold: 180}, time: 45, fx: [{s: time, k: O, c: 0.1}], need: [changping], when: 124 BC, w: 6, c | N161; N225 |
| O238 | Royal Road (Persia) | {at: BP9, line: Persia, age: 2, cost: {wood: 200, gold: 150}, time: 40, fx: [{s: spd, k: [UT1, UT2, UT4], p: 0.2}], when: 500 BC, w: 6, civ: | N161; N225 |
| O239 | The Immortals | {at: BP9, line: Persia, age: 2, cost: {wood: 260, gold: 200}, time: 45, fx: [{s: train, k: UM19, c: 0.25}], when: 480 BC, w: 6, civ: persian | N161; N225 |
| O240 | Yam | {at: BP9, line: Mongol, age: 3, cost: {wood: 200, food: 150}, time: 40, fx: [{s: sight, k: Riders, p: 0.2}], when: 1234, w: 6, civ: mongol} | N161; N225 |
| O241 | Remounts (Mongol) | {at: BP9, line: Mongol, age: 3, cost: {food: 240, gold: 140}, time: 42, fx: [{s: chargecd, c: 0.25}], need: [mongolyam], when: 1241, w: 5, c | N161; N225 |
| O242 | Tumen | {at: BP9, line: Mongol, age: 3, cost: {wood: 260, gold: 180}, time: 45, fx: [{s: rng, k: [UM11, UM20], a: 1.5}], need: [mongolremounts], whe | N161; N225 |
| O243 | Hastin | {at: BP9, line: Maurya, age: 2, cost: {food: 260, gold: 160}, time: 42, fx: [{s: bld, k: [UM12, UM21], p: 0.2}], when: 305 BC, w: 5, civ: ma | N161; N225 |
| O244 | Pataliputra | {at: BP9, line: Maurya, age: 2, cost: {wood: 280, stone: 200}, time: 45, fx: [{s: hp, k: [BW3, BW1, BW2], p: 0.25}], need: [hastin], when: 3 | N161; N225 |
| O245 | Bambuk gold | {at: BP9, line: Mali, age: 3, cost: {wood: 200, gold: 100}, time: 40, fx: [{s: rate, k: R2, p: 0.12}, {s: make, k: gold, p: 0.12}], when: 13 | N161; N225 |
| O246 | Salt road | {at: BP9, line: Mali, age: 3, cost: {wood: 220, gold: 160}, time: 42, fx: [{s: trade, p: 0.25}], need: [bambuk], when: 1352, w: 5, civ: mali | N161; N225 |
| O247 | Sankore | {at: BP9, line: Mali, age: 3, cost: {wood: 260, gold: 200}, time: 45, fx: [{s: time, k: O, c: 0.1}], need: [saltroad], when: 1400s, w: 6, ci | N161; N225 |
| O248 | Elite: Praetorian | {at: BTC2, line: Rome, age: 3, cost: {food: 400, gold: 400, iron: 150}, time: 60, fx: [{s: hp, p: 0.25, k: UM17}, {s: atk, a: 3, k: UM17}],  | N161; N225 |
| O249 | Elite: Elite crossbowman | {at: BTC2, line: Han, age: 3, cost: {food: 400, gold: 400, iron: 150}, time: 60, fx: [{s: atk, a: 2, k: UM18}, {s: rng, a: 1.5, k: UM18}], w | N161; N225 |
| O250 | Elite: Apple-bearer | {at: BTC2, line: Persia, age: 3, cost: {food: 400, gold: 400, iron: 150}, time: 60, fx: [{s: hp, p: 0.25, k: UM19}, {s: atk, a: 2, k: UM19}] | N161; N225 |
| O251 | Elite: Keshig | {at: BTC2, line: Mongol, age: 3, cost: {food: 400, gold: 400, iron: 150}, time: 60, fx: [{s: hp, p: 0.2, k: UM20}, {s: atk, a: 2, k: UM20},  | N161; N225 |
| O252 | Elite: Royal elephant | {at: BTC2, line: Maurya, age: 3, cost: {food: 400, gold: 400, iron: 150}, time: 60, fx: [{s: hp, p: 0.25, k: UM21}, {s: atk, a: 3, k: UM21}] | N161; N225 |
| O253 | Elite: Elite horseman | {at: BTC2, line: Mali, age: 3, cost: {food: 400, gold: 400, iron: 150}, time: 60, fx: [{s: hp, p: 0.2, k: UM22}, {s: atk, a: 2, k: UM22}, {s | N161; N225 |
| O254 | Roman: the people's bonus, held from the start by every side of it (Mid's CIVS fx; as Age of Empires II's civilisation bonuses) | {civ: roman, given: true, fx: [{s: build, c: 0.15}]} | N225; N226; N227 |
| O255 | Han: the people's bonus, held from the start by every side of it (Mid's CIVS fx; as Age of Empires II's civilisation bonuses) | {civ: han, given: true, fx: [{s: rate, k: BCL1, p: 0.1}]} | N225; N226; N227 |
| O256 | Persian: the people's bonus, held from the start by every side of it (Mid's CIVS fx; as Age of Empires II's civilisation bonuses) | {civ: persian, given: true, fx: [{s: trade, p: 0.2}]} | N225; N226; N227 |
| O257 | Mongol: the people's bonus, held from the start by every side of it (Mid's CIVS fx; as Age of Empires II's civilisation bonuses) | {civ: mongol, given: true, fx: [{s: spd, k: Riders, p: 0.1}]} | N225; N226; N227 |
| O258 | Maurya: the people's bonus, held from the start by every side of it (Mid's CIVS fx; as Age of Empires II's civilisation bonuses) | {civ: maurya, given: true, fx: [{s: train, k: Riders, c: 0.25}]} | N225; N226; N227 |
| O259 | Mali: the people's bonus, held from the start by every side of it (Mid's CIVS fx; as Age of Empires II's civilisation bonuses) | {civ: mali, given: true, fx: [{s: rate, k: R2, p: 0.15}, {s: make, k: gold, p: 0.15}]} | N225; N226; N227 |

## words

| Code | Name | Value | Cited |
|---|---|---|---|
| J38 | the ice crossing's words: the card that asks how to cross, what the ice holds by Gold's formula, the six ways, remember, clear off, the crack and the fall | {title: Cross on ice?, lead: It’s risky. The thinnest ice on the way is about {cm} cm: it holds about {kg} kg on one spot, enough for {n} at | N263 |
| J37 | the pace meter's line (the Yard's P layer): frames a second, and the milliseconds a frame spends on the world's logic and on drawing, as this phone measures them | {fps} fps · logic {sim} ms · draw {draw} ms | N208 |
| J1 | the ledger's word for each reason a store goes in or out (Mid's LEDGER_WORD; the Throne's tithe waits on the Throne, the vassals' tax is parked) | {gather: gathered, orders: marching orders, camps: camp supply, finds: finds, trade: trade, tribute: tribute, ransom: ransoms, market: the M | N132 |
| J2 | a ledger line with nothing on it | nothing yet | N132 |
| J3 | a list said: 'a, b or c'; a ledger line's items apart | {and: , , or:  or , dot:  · } | N132 |
| J4 | a number shortened: 1.2k | k | N132 |
| J5 | one, two: the first ending that fits, as [pattern, flags, ending] (a man-at-arms, men-at-arms; a spearman; a wolf; an ally; a ditch; the rest take s) | [[^(m)an(-at-arms)$, i, $1en$2], [man$, , men], [(wol)f$, i, $1ves], [([^aeiou])y$, , $1ies], [(s/x/ch/sh)$, , $1es], [$, , s]] | N132 |
| J6 | the map's lettered squares: a letter across, a number down (A1 to V22 on the board, D190) | ABCDEFGHIJKLMNOPQRSTUVWXYZ | N132 |
| J7 | the history line of each age (age0 to age4), each research step and each soldier kind, by its key (a step that shares a kind's key: tech:key): what it was and when (Mid's WHY); each building, villager and scout by its look (F39) | {throne: The citadel in the middle of the world: Constantinople held the straits, and whoever held it took a cut of every cargo. Thrones wer | N160; N161; N170; N176; N195; N198; N222; N223; N225; N234 |
| J8 | what the town is told when food, the seasons and the flock turn, or its people slip on ice, by the event that tells it (Mid's news; {n}, {m} and {at} filled in) | {hungry: Food stores empty: put villagers on food., fed: Your people are fed again., famine: Famine: no food in reach. Two days to recover., | N170; N173 |
| J9 | what a refusal or an order says for plots, the dock, the hunt, a spot nobody can walk to and a site nobody can reach (Mid's words; the last two F23's) | {replanted: {n} replanted., broke: Not enough to replant., hands: No free hands: train more villagers., hunt: A villager goes hunting., shor | N170 |
| J10 | the army's words: the three squads (Mid's BN, the NATO names), the tempers, the shapes, the intents and the squad dials (Mid's TEMPER, FORM, INTENT) | {squads: [Alpha, Bravo, Charlie], all: Army, setup: Set up, mid: {train: [Train, train], squad: [Squad, squad], direct: [Direct, direct], fi | N188 |
| J11 | orders you can follow, the quick action, the choke, the ambush and the War Director: what each says (Mid's 11-orders, 28-army-quick, 39-huddle words); a move is [its id, its cell, the event it sounds, what it says] | {marching: {n} marching: {at}., arrived: {n} arrived: {at}., lost: {m} is lost., losing: {m} is losing., nobody: {m}: nobody idle in it., no | N190 |
| J12 | the Alarm's four orders (each a name and its icon), what it says, the danger's causes and the warnings (Mid's EMERGENCY, emgStart, emgStop, dangerWhy, watchHome) | {cells: {square: {name: Gather, icon: gather}, hands: {name: Garrison, icon: garrison}, shelter: {name: Shelter, icon: shelter}, split: {nam | N192 |
| J13 | the end: the sides' names, a side's fall, the wonder, the bell and the score (Mid's judge, fall, finish, built) | {sides: [You, Raiders, Rivals, Fortress], fell: Your keep fell. You held out {t}., rivals: Every rival has fallen. {t}, wonder: [Your wonder | N192 |
| J14 | what Teach, prisoners, priests, Zeal and spies say (Mid's teachWhy, graduate, takePrisoner, payRansom, prisonersTick, priestTick, zealWhy, zeal, sabotage, intel) | {teach: {label: Teach, none: Nothing newer to learn., busy: Already learning., vets: Research Veterans at the Barracks., age: Needs the {age | N194 |
| J15 | what trade says: the goods' names, a caravan's sale, its spice, an ally's pay, a venture sent, home or lost, the coin debased, a caravan robbed, and why a trade post will not stand (Mid's routeTick, caravanTick, venture, ventureTick, debase, robbed) | {goods: {wool: Wool, cloth: Cloth, beer: Beer, spice: Spice}, sold: A caravan sold {what} for {n} gold., reached: A caravan reached the stop | N195 |
| J16 | what the war camp and the traps say (Mid's 38-camps and 38-natives words) | {why: {edge: Too near the edge of the map., water: A camp cannot stand in water., bld: A building stands there., find: A resource lies there | N198 |
| J17 | what relations, envoys, regard, vassals and the league say (Mid's 11-orders, 36-economy, 38-natives and 17-ai words) | {why: {now: Not now., already: Already., vassal: Your vassal: see their card., lord: Your overlord., notice: Notice given: {n} s., regard: N | N198; N202 |
| J18 | the sky's news (Mid's WEATHER texts, wxWhy and skyTurn's signs, in v100's hourly chain; what v100's weather does not do is left out of the line) and the flood's warning | {turn: {rain: Rain: the ground softens., snow: Snow: the ground deepens and sight shortens., blizzard: Blizzard: a whiteout. Marches crawl a | N202; N203 |
| J19 | what the wild says (Mid's news for finds, wayfarers, hiring, raids and the horde; EV_TEXT, each event's warning and start; EV_WHY, its why, kept for the chronicle) | {took: {name}: {got}{extra}., scroll:  and a scroll: {name}, wayfarer: {come: A wayfarer: reach him first to gain him., one: A wayfarer join | N205 |
| J20 | what fire and sickness say (Mid's news for ignite, fireTick, repairTick's smoke, outbreak and the plague year) | {fire: {at: Fire at the {b} ({why}). {who}, who: [Nobody is near it., A neighbour runs with a bucket., Two neighbours run with buckets.], ou | N206 |
| J21 | a board at peace, the hidden age, standing down and the crowns (Mid's peaceTick, standDown, enlightenTick, CROWN_NAME); {age}, {n} and {side} filled in | {truce: The whole board is at peace., opens: A year of peace: the {age} opens., stood: {n} soldiers stood down to work., they: {side} stood  | N222 |
| J22 | the mail (Mid's GROUPS, QUIET, urgentCls, DIR8, tell): the groups a line goes to; the quiet kinds wait in the mail unshown; a warning is urgent; a fight out of sight but in earshot is told by its way only, of eight; a messenger's line says so | {title: Mail, empty: Nothing yet., groups: {war: War, home: Home, land: Land, trade: Trade, realm: Realm, chronicle: Chronicle, lesson: Less | N223 |
| J23 | the world's news by age (Mid's NEWS): one line every D324 every, the next of the age you are in | [[Someone has tamed a horse. Opinions are divided., Jericho builds a wall. Neighbours unimpressed., Çatalhöyük: no streets. Walk across the  | N223; N161 |
| J24 | the fourteen milestones, each a line and its why, said once a game the first time it is true (Mid's MS_TEXT; their fixes pointed at Mid's cards, which come with the cards); {room}, {pct} and {spd} filled in | {house: [Your first house: {room} more may live here., Only homes hold people; soldiers and workers alike. A town grows by its roofs.], fiel | N224 |
| J25 | the tips: what the town needs next, in order, each until you have done it three times (Mid's advise; a ! line is a warning and always shows) | {full: You are full: Build → Dwelling., more: More villagers, more of everything., wood: Wood is low. Tap + under Wood., idle: {n} villagers | N224 |
| J26 | the six peoples (Mid's CIVS names, wonders and halls; TITLE_SHORT, short card titles for long names); the Start card's line for the people you pick | {roman: {name: Roman, wonder: Colosseum, hall: Forum}, han: {name: Han, wonder: Weiyang Palace, hall: Taixue}, persian: {name: Persian, wond | N225 |
| J27 | the Guide's rules, in Mid's order (Mid's TRIGGERS: when, then why); {D:key.path} reads the Measurements book, {S:code} a shell's name, {J:key} a words entry, {fx:stat} the research that raises it; the Games' line waits with the Throne | {You order a unit and the town is full: [Train says No room, and nothing is paid. Room opens when a {S:BR1} or a {S:BTC1} is finished, or wh | N222; N223; N234 |
| J28 | the start: the lands' names (Mid's LAND), the scenarios' names and lines (Mid's SCEN_TEXT, without what v100 has not built: the walls, the horde, the truce, the Games), the safety net's and the save's lines (Mid's fault, saveGame, copyLog, testField) | {lands: {fertile: Fertile land, timber: Timberland, stony: Stony hills, golden: Gold country}, land: {land}. Gather, grow, explore., lot: Ha | N229; N230 |
| J29 | the Guide's and History's fixed words (Mid's guideModel, HIST_NOTE, HIST_ASK, yearOf, guideMd): where a unit no building trains is trained, a building off the Build menu and where it comes from, a shell whose history line is not under its look (key), the eras History dates by name (a year, BC below none), the Markdown's headings | {at: the Town Center, start: where you start, secs:  s, by: ×, beats: {times:  ×, bld: buildings, only: buildings only}, off: {BS1: stands o | N234; N161 |
| J30 | the song line, said by the Guide and the Sound page (Mid's SONG) | There is no music in life. Life is the music. You will notice a rhythm and a beat emerging from your kingdom: that is its own song, composed | N234 |
| J31 | a Build cell's second line when the store cannot pay: the sign before each shortfall, the amount you are short of each store (Albert, Nov 10, #24: what you are short, not the word Short), its colour how near (the shortfall is in the tap's Needs) | − | N132 |
| J36 | why a research cannot start now (B8, as Base's research buttons); shown on the button in place of its price, every lock but the purse (Albert, Nov 10, N17 #18) | {age: Needs the {age} age, need: Needs {name} first, busy: Being researched, at: Needs its building standing, full: That line is full, cost: | N251; N307 |
| J35 | the Welcome back card (Base's: the saved game opens paused, Resume or New game) and the pause's line (Base's pauseT) | {title: Welcome back, resume: Resume, paused: Paused · tap to carry on} | N241 |
| J34 | the place bar's words, Base's (26-input placeT; Albert's screenshot Nov 7 20:38) | {helper: + Villager, start: Press where the {name} goes · drag empty ground to look around, lineStart: Tap where the {line} starts, ok: {Nam | N241 |
| J49 | the Stores and Score cards (Base's, Albert's screenshots Nov 11) | {stores: Stores, last: the last minute, cols: [Have, In, Out, On it], storesSay: In: gathered and brought home in the last minute. Out: what | N322 |
| J33 | the picked villagers' bar (Base's selection bar, Albert Nov 7 20:38): its header | {picked: {n} picked, charge: Charge, fallBack: Fall back, hold: Hold, recall: Recall, hunt: Hunt, said: {charge: {n} charging., fallBack: {n | N241 |
| J32 | the Pause screen's words: its title, the pause mark on the top bar (SoRen's), New game and its confirm (Albert, Nov 7: New game on the pause screen, with a confirm) | {title: Paused, mark: ❙❙, newGame: New game, sure: Sure? Tap again} | N241 |
| J39 | the help line under the top bar (Albert, Nov 8 18:57, 20:49: one place the eyes go; quiet-looking; a research tells what it does on the first tap and is bought on the second); its card's title; the words for a step with no number to show | {go: Go ›, title: Help, arm: {name}: {what} · {cost}. Tap again to research., done: {name}: {what}., rank: a new rank, tier: a taller tower, | N208 |
| J40 | each number research moves (the O book's fx s), in words, and the family that tints it (C26): economy, speed, health, war, sight, other | {rate: [gathering, economy], make: [making, economy], scale: [yield per plot, economy], sell: [sale price, economy], trade: [trade, economy] | N160 |
| J42 | N5 words: the stances of Relations and Misfits (a name, then four), the Paused and Sound cards' help lines, the book with no game, the Help page empty (Albert, Nov 9 12:57-13:25) | {sets: {Relations: [gift, war, terms, ally], Misfits: [bribe, war, terms, ally]}, labels: {gift: Gift, bribe: Bribe, war: War, terms: Terms, | N286 |
| J43 | N6 words: a card's group labels (as the v80 card) and Welcome back's help line (Albert, Nov 9 19:37) | {train: Train, research: Research, welcome: Resume where you left off, or start a New game.} | N287 |
| J44 | N6 Build words: the Build menu's show-all box; what to say when a raise or planting finds no room (Albert, Nov 9 18:29) | {noRoom: No room to raise it here} | N287 |
| J45 | the quick action's words: four boxes a step, a square (Albert, Nov 9 19:37) | {attack: Attack, build: Build, squad: Squad, more: More, all: All, half: ½, quarter: ¼, idle: Idle, rally: Rally, villager: Villager, rallyS | N287; N288 |
| J46 | the Start page's Fog of war row (Albert, Nov 9 item 6, 19:37: it should have been there) | {label: Fog of war, on: On, off: Off} | N287 |
| J47 | the crossing card when the way runs through woods (Albert, Nov 9 19:59) | {title: Through the woods?, lead: The woods slow the march and break the line: arrows are lost in the trunks, and every man fights his own f | N287 |
| J48 | the Daily challenge: its row's label, why the dangers can't be tapped while it is on (Albert, Nov 10, #14), and the ordinals for rank in the Top Info Ribbon (#20) | {label: Daily Challenge, set: Today's challenge sets this., ranks: [1st, 2nd, 3rd, 4th], idle: idle, army: army} | N306 |
| J50 | the Controller's words: its twelve buttons, the pages behind Protect, Orders, Class and Squad, Execute, why a button cannot act, and what it says once it has (Albert, Nov 11) | {pads: {people: People, garrison: Garrison, build: Build, protect: Protect, defend: Defend, attack: Attack, orders: Orders, retreat: Retreat | N325 |
| J51 | the Market's Sell and Buy, the Workshop's Make, a camp's Hire, a caravan's route and why it stands idle (Audit D, Albert Nov 11 09:52: show it all; Nov 11 22:48: "There are no trade routes") | {sell: Sell, buy: Buy, short: Needs {n} to sell, gold: Not enough gold, make: Make, hire: Hire, route: Trade route, routed: Caravan set on t | N322; N326 |
| J52 | Prep's words | {started: Prep: everyone boards up., short: Not enough wood or stone to board every building., off: The boards come off. Back to work., earl | N326 |

