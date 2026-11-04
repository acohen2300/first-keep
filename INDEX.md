# First Keep: the Index

Written from the code by `tests/index.py` at every publish (like `GUIDE.md`); never edited by hand. Five Books: what each file holds, every top-level name with its line and its note. Then every element card. The key to the Books, and the list of things that still have two homes, is `docs/0 Index/00 Books.md`.

## Truth: the rules and the sim: every number, every behaviour, what the game is

### Rules

**`00-pre.js`** (3 lines): 

**`01-rules-basics.js`** (132 lines): the map, speeds, difficulty, resources, jobs, players, ages, seasons

- `BUILD` 3: written by build.py from the latest "## Build NN" in CUTS.md: the number has one home
- `BUILD_NAME` 4: the version's name, shown as "v70 · Restoration" (Albert, Oct 31)
- `SQUARE` 11: the land's side, as the map-maker lays it
- `LMID` 12
- `MAP` 13: the world: 306 walking squares a side (the land's diagonal is 3055); the middle, 1530, is a square's corner, w…
- `MID` 14
- `DT` 15
- `BN` 16: three squads, slots 2 to 4 of the station's middle, the fourth tile Set Up (Albert, Nov 2; four before, six be…
- `BNS` 17: the battalions, once Command is researched
- `CLS` 19: The four kinds of soldier, by the building that trains them: [id, name, building, the word in a line]. A squad…
- `POPMAX` 25
- `ARMYMAX` 26
- `BNSIZE` 27
- `SHARE_FALLEN` 28: a fallen side's room: half of it is split among whoever is left // six battalions, once Command is researched …
- `RICH` 29
- `PLUNDER` 30
- `CARRY` 31
- `NAVC` 32: NAVC: the walking grid, 10 units a square (never shown)
- `FOOT` 33: world units a foot: a villager is drawn 22.1 figure units tall × FIG 0.66 = 14.6 units, taken as an adult of 5…
- `LAKE0` 34: laid at the land's middle (turned to the world's middle, the same point) // the great lake in the middle, roun…
- `SEASON_LEN` 35: seconds a season
- `YEAR` 36
- `DAY_LEN` 37: seconds a day: six days a year
- `NIGHT_SIGHT` 38
- `SYNODIC` 39: days from new moon to new moon (Meeus 49.1), in game days
- `EASY_SAFE` 40
- `SAVE_EVERY` 41: Easy: no raid before 6:00; the game saves every 10 s
- `DIFF` 44: Difficulty turns the computers' minds, never their stores (Albert, Build 41): react, seconds between decisions…
- `DIFK` 49
- `ZOOM_MAX` 50
- `ZOOM_START` 51: the camera's zoom when a game opens: a map label is LABEL.px there (labelK, 24-view-overlays)
- `LABEL` 52: a map label: 12 at the starting zoom, never under 9 zoomed out (Albert, Oct 31: "base 3"); what is pinned to t…
- `TILT` 53: the camera's pitch: the ground squashed to 0.55 (near AoE2's 2:1; was 0.66 to preview 49; at 0.5 two pairs of …
- `TURN` 54: the view turned 45° (Albert, Nov 4, 06:58: "take the whole map and rotate it
- `RIM` 55: the scenery beyond the map's edge, in world units: sea on the near sides, cliffs and sky on the far (fills the…
- `SIDE` 56
- `worldXY` 59: the land's frame and the world's (preview 51): a land point (lx, ly) stands in the world at the centre plus (l…
- `landXY` 64
- `landAt` 69: a land point as a world point, for the rules that name the land's edges and middle lines
- `inLand` 70
- `FOG` 74
- `FOGN` 75: fog of war: squares of 40; unseen, explored (stays lit, dim), in sight now
- `WILD` 76: the fifth side: animals, bandits, robbers, monsters
- `RESOURCES` 79: One table for the four resources: short key, colour, name, where it is dropped off.
- `RES` 86
- `KEY` 87
- `LONG` 88
- `JOBS` 89: a job for each resource
- `REL_WORD` 92: the one home of the stance words (cold review of v70: friend, neutral, foe), in the Relations card's order
- `CORNER` 96: in the land's frame: 753.1 (was 755); a keep stands about CORNER out on both axes
- `KEEP_W` 101: The keeps' places (preview 51): named in the world, where each must sit on the centre of its five squares (a c…
- `PLAYERS` 107
- `FORT` 115: a player like the others since Build 40: it defends first, and strikes whoever is weak or busy
- `AGES` 117
- `SEASONS` 125

**`02-rules-units.js`** (762 lines): every unit: cost, strength, speed, what it counters

- `CAMP` 15: keep: what a supply run leaves in the store (p44) // side: the Camp's palisade, squares; need: the building a …
- `UNIT` 16
- `hasTag` 761

**`03-rules-buildings.js`** (849 lines): goods, prices, taxes, vassals, every building kind, menus

- `GOODS` 3: Goods: made, stored and carried, apart from the four resources. base: gold for one at a Market next door; it p…
- `GOODK` 9
- `WARES` 10
- `LOAD` 11
- `CARAVAN` 12: a caravan also carries what a store holds beyond this much of food, wood, stone or iron
- `RAW_NAME` 13
- `CARRIED` 14
- `UPKEEP` 16: hunger: work and blows after STARVE.grace without food; the Minnesota study's fall in grip strength, 58.2 to 4…
- `TAX` 19: Vassals
- `VASSAL` 24
- `VENTURE` 42
- `SPOIL` 50: Prices answer the market's stock on the constant-elasticity demand curve, P = P0 (Q/Q0)^(−1/ε) (Marshall's pri…
- `PRICE` 51
- `BLD` 60: Buildings. fp = squares a side (10 units each). h = how tall it stands. room = people it shelters. sab: what a…
- `WONDER_HOLD` 800
- `QUEUE` 801: orders a building holds in its line, before Written records and Guilds
- `MINT` 802: debasing: gold at once, and every Market price multiplied for the rest of the game
- `NOTICE` 803: seconds between declaring a side hostile and the first blow: no ambush from peace
- `DEMAND` 806: what a lord may ask of a vassal: a demand of one resource (loyalty cost grows with each demand in the last two…
- `TRAINERS` 818: buildings that send people out keep a free square round them; the rest may touch
- `MENUS` 821: The build menus. "soon" is on the list but not built: it stays visible until built or deliberately dropped (an…

**`04-rules-tech.js`** (3346 lines): the research tree from history, and the civilizations

- `MEASURED` 8: Research. fx: what it changes, by stat; k narrows it (a resource, a unit kind or #tag, a building kind or #wal…
- `TECH` 19
- `TECHBY` 3228
- `CIVS` 3231: Six civilisations: one unique unit (replaces a common one, same role, a little better), one small bonus, one w…
- `CIVK` 3281
- `ARMYK` 3344
- `SOLDIERK` 3345: counted once every unit, the peoples' own included, is in the table

**`05-rules-wild.js`** (310 lines): finds in the wild, the Natives, the Throne, the computers' personalities

- `FINDS` 4: What you can find in the wild
- `WAYFARER_EVERY` 66
- `WILD_LOOK` 67: how far a beast or a guard looks for a stranger near its home (v70's distance, restored in Build 80 preview 9)…
- `REGARD` 77: They hold the Throne, a citadel on the great lake's island, reached by four causeways (the choke points)
- `GANG` 91: The wild's groups (answer 1b): animals are everyone's foe, always; the four misfit groups each keep their own …
- `NATIVE` 92
- `THRONE` 116: isle: the island's radius; cause: a causeway's width, causeTo: how far from the middle it runs (over the great…
- `WAVE` 122: A wave is judged by its progress (D1, docs/6 Records/v80 Audit/ai.md): it goes home when beaten (under broke o…
- `PERS` 126: The three computer personalities: one brain, three settings

**`06-rules-tuning.js`** (521 lines): combat, morale, weather, hazards, events, routes, market and land numbers

- `TRADE` 2
- `TRADE_CAP` 3
- `TRADE_DIV` 4
- `SELL` 5
- `BUY` 6: TRADE_CAP, TRADE_DIV: an ally run pays distance² ÷ 16000, at most 80 gold
- `ZEAL` 7
- `SAB` 8
- `FLANK` 9: a blow from behind lands 30% harder
- `FLANKING` 14: Where a blow comes from (Build 62, Albert: "a big group's orientation is random; that is not a flank"): a blow…
- `MORALE` 22: Every soldier has nerve (0..1)
- `CHARGE` 42: a burst, then tired
- `ORDER` 50: the juice pass (Albert, Nov 3
- `SCALE` 53: kinds: the five the step names (p44)
- `CALTROPS` 58: field defences (Albert, Nov 3, "yes" to the report docs/4 Now/Field defences.md): caltrops, a sown square take…
- `STAKES` 59
- `FORMING` 63: forming (Albert, Nov 3, 10:48; his outside note of 09:35): while soldiers walk to their places in a shape, the…
- `JUICE` 64
- `CLIMATE` 73: Temperature: a yearly swing and a daily swing round a mean (design: a temperate land about 45° north)
- `FIRE` 124: Fire between buildings (Build 61): a fire grows as the square of its age (the t² design fire, NFPA 72 / Heskes…
- `FIREARMS` 125: fire arrows and burning shot ignite a wooden building on a hit (rain halves it); a petard bombard ignites and …
- `SOUND` 129: fov: the camera's field of view, degrees, which turns the zoom into a height (Albert, Build 64)
- `BEAT` 132: The slow ticks (hunt A #10): each runs every so many seconds (at its own phase in ticks, so they do not land o…
- `YARD` 133: a soldier at home fights within this of its post or its Town Center (the Natives: of the Throne, their camp's …
- `GARRISON` 134: soldiers resting by their own Castle, Barracks or Town Center heal
- `TEACH` 135: Teach: a soldier learns a newer kind at the School, four at a time; time ×1.5 per age climbed, tuition in gold…
- `TEACH_TO` 136
- `FALLBACK` 145: withdraw in order: fewer losses than a rout
- `PRISON` 146: a prisoner unransomed in three minutes serves the captor
- `CONVERT` 147: a priest beside an enemy for a spell turns them; the counter is to kill the priest
- `BUILDER_POW` 148: a crew of n builds n^0.7 times as fast as one: two builders ≈ 1.6×, three ≈ 2.1×. Crowding on a site: output p…
- `FORM` 151: Shape (research Formations at the War Council): each battalion takes one, three in all. spd: march speed; hit:…
- `CHOKE` 173: the choke drawn on the map (hold the shape on War, then drag across the gap): as many files as the gap holds, …
- `AMBUSH` 174
- `COLUMN` 175
- `GRID` 176: an army stands in a grid: 15 apart, about twice as wide as deep; on the march it follows one way to the spot a…
- `DOCKR` 177: fish are caught only within 150 of a finished dock of yours
- `KITE` 178: a shooter steps back from a foe this close while it reloads
- `TEMPER` 180: a battalion's temper, three in all (the computers keep Guard). nerve: how fast blows break it; dmg: blows deal…
- `T_HOLD` 191
- `T_GUARD` 192
- `T_PRESS` 193
- `SHELTER` 194: villagers run into the nearest Town Center or tower when an enemy soldier comes within 70, when three or more …
- `LOOKOUT` 195: a building sees 60 + 24 × the square root of its height: the horizon from a height grows with its square root,…
- `WORK_R` 203: Where a villager looks for the next find (decision 1; area-restricted search, tight near the last find and wid…
- `SPACE` 204
- `ARRIVE` 205
- `DANGER_R` 207: a gatherer will not work within 110 of an enemy or a hunting beast, inside an enemy tower's reach plus 30, wit…
- `DIRECT` 219: arc: the archers' arc stands at 80% of the shortest bow's reach (Albert, Nov 3: 'fall back a bit, form an arc'…
- `TOAST` 220
- `SCORE` 221: score = value held / 5, research / 5, everything gathered / 10
- `FERT` 224: soil: 10% a year worked, never below 60%; a season of rest gives back 40%
- `HARVEST` 225
- `WEATHER` 232: the skies and what each does beyond the ground (the ground, mud, snow, ice and fire come from the climate): bo…
- `WX_EVERY` 246
- `HAZARDS` 250: Random when, never random whether: everything a hazard sends is announced first, and hazards drawn by lot are …
- `HZK` 284
- `HZ_ODDS` 285: none picked (Build 70, Albert's A): each hazard is on at even odds, drawn by lot for the game (design: a coin,…
- `TODAY_HZ` 286: the challenge today is level 10 on the day's seed
- `STARVE` 290: Hunger (Albert, Nov 1)
- `HARD` 291
- `HORDE` 292: the horde comes after min seconds, at an exponential wait about mean (nextIn)
- `TELL` 298: Spectacle: something happens every minute or three, announced WARN seconds ahead; gorgeous first, mostly harml…
- `UI_BUDGET` 307: always-visible buttons on the play screen, at most (Build 59, from the Google audit): a new control must repla…
- `SAVE` 308: a computer saving for an age: progress counts in steps of 2%; 90 s without one and it spends for 45 s (17-ai)
- `EV_MEAN` 309: the mean wait between events (an exponential wait, nextIn)
- `EV_MIN` 310
- `EV_WARN` 311
- `EVENTS` 312
- `EVK` 340
- `NEWS_EVERY` 341
- `PLACES` 347: Where the shared places stand, each from what it belongs to (5a step 1: no map coordinate typed by hand)
- `cross` 348
- `ROUTES_L` 355: in the land's frame, for the map-maker
- `ROUTES` 356
- `POST` 362: each route has four stops. all: gold a second to whoever holds all four of a route; cut: of other sides' sales…
- `HEALTH` 368: Sickness as the SIR model (Kermack & McKendrick 1927
- `MKT_SELL` 380
- `MKT_BUY` 381: wool goes to a Workshop, not to market; spice is the only good not made here
- `MKTK` 382
- `RATE_OF` 383: what a villager gathers a second from each kind of find (fields carry their own rate)
- `LAND` 387: The land's character: each game rolls one, the same for all four corners (fair), so no two games share a map. …
- `LANDK` 393
- `SPREAD` 394
- `CLEAR` 397: The map's base rules (Albert, Build 70): a flat page, four corners (CORNER), the same zones and home finds in …
- `LANE` 400: Between two buildings (decision 2, Albert, Oct 31)
- `HOME` 411: The four zones (Albert, Nov 2, 07:07 to 07:14, D-090; the same in every corner), measured on the finds' own no…
- `WALL_R` 416: The computers' wall ring (wallPlan in 17): the clearing, then the margin a ring square can reach (its diagonal…
- `REACH` 422: Reach (D-088, Albert's sighting of Nov 1: villagers asleep at the mill with full bushes in sight
- `SEARCH` 423
- `searchR` 424
- `BACK_MARGIN` 431: Zone 1 (Albert, Nov 1; on, Nov 2: "Close was supposed to have enough to get you to the first age between you a…
- `BACK` 432
- `WATER` 447: Lakes and rivers (Build 70: random; it was one lake and one river of one width a corner). lakes: how many besi…
- `START_VILS` 474: Scenarios (Build 58, item 41): three set starts on the same rules, each a table of what differs, read by apply…
- `START_RES` 476: the stores every side starts with (Albert, Nov 1 14:18): 200 of food, wood, stone and gold, no iron
- `HANDICAP` 481: EXCEPTIONS #16, LIVE TEST IN PROCESS (Albert, Nov 1 14:23): each computer starts with these already built besi…
- `SCENARIOS` 482

### World

**`10-world.js`** (295 lines): a game, its players, and the map laid in layers (10-world-ground, -water, -forest, -plots, -movers, -citadel)

- `blankGame` 4
- `mkPlayer` 71
- `newGame` 117
- `applyScenario` 189: a scenario is the ordinary game with some things set (SCENARIOS in 06): an age, a store, relations, a few buil…
- `inBox` 235
- `node` 236
- `mkBld` 237
- `addUnit` 263

**`10-world-ground.js`** (92 lines): layer 1, Ground: the land's square, its corners, the turn into the world, and the taken list

- `QUARTER` 5: in the corner's frame: from the land's edge (−327) to its middle lines (753)
- `inQuarterL` 6: m: a margin kept from its edges
- `inQuarter` 8: in the quarter of the map whose Town Center is k, read in the world: what stands on a middle line (a stop, a c…
- `ROOM` 20: Everything already laid in a corner is one list, taken (preview 52; it was four: taken, room, keepOut and held…
- `takenGap` 26: the gap from a corner-frame point to a taken entry's edge: a lake's by its shore, the rest by radius
- `turnLand` 39: Everything the map-maker laid in the land's frame goes to the world's
- `navOffLand` 88: off the land: the world's squares whose middle lies outside the turned land are solid, the same in every rebui…

**`10-world-water.js`** (196 lines): layer 2, Water: the great lake, the lakes, the rivers and their fords, the fish

- `SHORE` 8: squares from water that count as its shore
- `lakeFor` 9
- `lakeHi` 10: the lakes the grid was drawn for, and whether in flood
- `inFlood` 11
- `floodRise` 12: the one place the flood's rise is added to a shore
- `lakeR` 13: a lake's radius in flood
- `lakeRAt` 15: the shore at an angle from the lake's middle: the radius with its harmonics (WATER; lakeShape); a round pool h…
- `lakeRTo` 16: the shore toward a point, in flood too
- `shoreWalk` 19: the shore walked once round, n points at extra beyond the water's edge: fn(x, y, r, a) at each; the one tracer…
- `shorePath` 26
- `onLand` 32: how far a point stands from the nearest lake's edge (negative: in it); the Throne's island and causeways are l…
- `lakeGap` 36
- `lakeGrid` 39: lake cells: 1 water, 2 flood water only, which a side with levees wades
- `lakeSize` 74: Lakes at random over the whole map, never within a clear radius, by a middle line, at the great lake's shore o…
- `lakeShape` 76: a lake's shore (WATER.amp, H, harm): the harmonics drawn by the map's own dice, so one seed is one shore; a ri…
- `lakeHarm` 83
- `makeWater` 106
- `makeRiver` 143: A river (Build 50): a lake drains to the map edge, to the left or right one (toX) or the top or bottom one, as…
- `riverRuns` 173: the stretches of river, each the pools of one run in order, for the painting
- `layFish` 184: the fish: a river is fished at every few pools, in mid-stream; a lake round its shore, in the water, none on t…

**`10-world-forest.js`** (204 lines): layer 3, Forest: the trees, the paths through them, and the deposits along the paths

- `FOREST` 7: edge: no tree nearer the land's edge; cut: half the width of a cut home (openWays): open ground three squares …
- `TREE` 11: One tree (preview 52; it was five rules in five files): it fills the 3 × 3 walking squares round it (block); i…
- `nodeScale` 12: how big a node is drawn: what is left of it
- `findRoom` 13
- `makeForest` 14
- `segGap` 104: how far a point stands from the segment a to b
- `openWays` 114: Nothing may be walled in (B4): every find and every bush, rock and lode in a corner's quarter of the map is re…
- `wayHome` 151: The way home for a find cut off (openWays): the fewest shut squares between it and its home region, never acro…
- `DEEP` 185: the deep forest: a tree with TREE.deep or more standing neighbours on the lattice; its shadow would lie under …
- `deepTrees` 186

**`10-world-plots.js`** (235 lines): layer 4, Plots: the home zones, the finds (bushes, groves, stone, gold, iron), the deposits, the land's richness; and the map laid

- `SHAPE` 4: Each corner is laid out on its own (Build 49; it was one corner mirrored to all four); decision 5a: the same h…
- `LAYOUT` 20
- `BACK_IDS` 48
- `HOME_IDS` 49
- `MOVE_IDS` 50
- `SEEK` 58: one corner's finds, each at random in its own ring, judged by its own nodes (shape: each bush, tree, rock or a…
- `laySpots` 59
- `cluster` 93: a cluster of nodes of one kind: the shape's offsets round a middle, each with amt (the one placer; it was bunc…
- `makeMap` 105: The map in layers (Albert, Build 63 and Nov 4), on the base rules (CLEAR and HOME in 06), laid once from the s…

**`10-world-movers.js`** (42 lines): layer 5, Movers: the first people, the game, the boar, the finds that walk or are carried off, the camps

- `layMovers` 3: Their spots were claimed before the forest (laySpots in makeMap, so the trees leave them their clearings); her…
- `layCamps` 17: a robbers' camp at the middle of each map edge, at the end of a trade route
- `wildAt` 20
- `addFind` 27

**`10-world-citadel.js`** (35 lines): the Throne, its ring, the island and the causeways

- `makeCitadel` 6: The Throne: a walled citadel on the great lake's island, four gates at the four causeways, a tower at each cor…

**`09-nav.js`** (823 lines): paths

- `NC` 6: Squares of 10, never shown
- `POCKET` 7: a joined region smaller than this many squares is a pocket: closed in by trees, buildings or water
- `NAV` 8
- `gcell` 23
- `toCell` 24
- `COORD` 26: a place as the map's lettered squares
- `COORDN` 27
- `coord` 28
- `snapPos` 30
- `navRebuild` 37
- `blockedCell` 133: can this side's unit not stand on this square? (a gate is shut only to those at war with its owner)
- `COMPS` 140: the joined regions as one side sees them: a hostile gate is a wall (Build 63: the open-gate map put a walled e…
- `flood` 143: One flood for "joined regions" (hunt A #6: two copies)
- `compOf` 165
- `lineClear` 174
- `freeNear` 187: the free square nearest (px, py) among the rings around square (cx, cy); with a region (cm), only squares in it
- `DANGER` 213: Where workers will not go: one map for each side, redrawn every second, the one home for danger (Build 48)
- `DISC` 215: a disc of radius R squares, as the half-width of each row (dy from -R to R), worked out once per R (hunt A #2:…
- `discRows` 216
- `stampDanger` 218
- `dangerMap` 230
- `dangerWhy` 263: why a spot is on a side's danger map, nearest cause first: { scare } when the only cause is a fright remembere…
- `AS` 279
- `DX8` 289
- `DY8` 290
- `wayLen` 292: how far the way really is from one place to another: along the path, round water and walls (a straight line if…
- `astar` 304: A*: the shortest way round, no cutting corners
- `halfOf` 435
- `rectGap` 436
- `edge` 440
- `reachOf` 442: a blow's reach, measured once against edge (C9: the wild added a building's half on top of the gap to its wall…
- `closeIn` 443
- `findBlocker` 444
- `standOff` 466
- `route` 480: where to head next on the way to (tx, ty)
- `paceOf` 566: one step toward (x, y); true once within r
- `stepTo` 578: One home for "a unit moved" (Build 80 preview 9): every change of place, a walk, a run, a push, a knock, a res…
- `moveTo` 585
- `canPlace` 655: Every building keeps LANE free squares from the next (decision 2: a one-square lane is shut by the slit rule, …
- `GUIDE_R` 705: how far a building reaches with its alignment lines
- `snapGhost` 706
- `findSpot` 743: The computers' way of finding a spot: rings out from a centre, the first place that fits.
- `wallLine` 758: a straight run of squares from a to b, four-connected so nothing can slip through; near-straight drags snap to…
- `SEAL` 778: Is your keep walled in? A walk outward from the keep over every square a foe can stand on (walls, shut gates, …
- `sealSeen` 779
- `sealFrom` 780
- `sealGen` 781
- `sealPath` 782

### Sim

**`08-core.js`** (753 lines): shared helpers and the game state

- `$` 3
- `clamp` 4
- `hyp` 5
- `CODE` 7: The colour code's one home is the style sheet (--ring-r, -w, -g, -b); the code reads it once (Build 65: it was…
- `codeOf` 8
- `TIME` 9
- `timeOf` 10: ms, from the style sheet's four (Build 66)
- `rgbOf` 11
- `grad` 16: The one gradient (Albert, Build 64): red, through pink, white, light green, to green, for every number that ha…
- `costCol` 23: short: red at nothing, white near enough; enough: light green
- `dist` 24
- `byId` 30: the thing in a list with this id (a building, a unit, a find, a node)
- `lineKind` 31: laid as a line, corner to corner (walls; traps in a band, Nov 3: the lilia of Alesia)
- `standing` 32: a building of this side, finished and standing
- `crowd` 34: how many work a find, counted at once so the next worker this second sees the crowd (recount sets it true ever…
- `NS_rng` 36: the seeded dice for drawings and the sky (Park and Miller's minimal standard, 1988, a = 16807, m = 2³¹ − 1): t…
- `lookDice` 38: the looks' dice (Nov 2, O4): the sky, the sound, the ground's texture, the smoke; never the game's rules (thos…
- `clock` 39
- `costText` 40
- `afford` 45
- `earn` 49: Every resource in or out goes through earn and spend: one home for the stores, the flow of the last minute (p.…
- `spend` 60
- `pay` 70
- `payBack` 75: what was paid comes back the way it went out (Build 60): the store, the minute's spending and the ledger all s…
- `addRes` 84
- `sumCost` 88
- `fmt` 89
- `towardMid` 91
- `nearest` 98
- `rng` 112: The simulation's dice are seeded, so a game can be replayed and tested; looks use lookDice (08-core).
- `rnd` 118
- `roulette` 120: one weighted draw on the seeded dice: index i with probability w_i / Σw (roulette-wheel selection
- `nextIn` 129: Random events are a Poisson process, the established model of independent rare events (Poisson 1837
- `hazard` 130
- `relax` 134: One home for a thing that settles toward a level, the first-order lag: x(t) = L + (x0 − L) e^(−dt/τ) (Build 62…
- `logistic` 136: One home for growth with room (Verhulst 1838): one step of ΔN = r N (1 − N/K), fast while there is room, slowi…
- `NID` 137
- `plural` 139: one wolf, two wolves; one spearman, two spearmen; one man-at-arms, two men-at-arms
- `some` 151
- `SET` 154: Settings remembered on this phone.
- `PLACE` 174: ),
- `keyOf` 176
- `YARD_ON` 177: the Yard (preview 47): on every preview, test and frozen version; never on the live game
- `saveSet` 211
- `lineOf` 217: Research lines: the steps of one line at one building come in table order; a step waits on the one before it a…
- `prevOf` 218
- `needsOf` 223
- `nextStep` 227
- `isNext` 231
- `todaySeed` 232
- `MODES` 236
- `QC` 245: The Town Center, the head count and the room of each side are asked for by every unit every step: answered onc…
- `qc` 246
- `keepOf` 256
- `qcDrop` 262
- `bldsOf` 265
- `ready` 266
- `readyAt` 267: where a unit can be trained: its building, and any other that also trains it
- `unitsOf` 268: the living: the dead leave the list only at the end of a step
- `isSoldier` 269
- `soldiersOf` 270
- `armyOf` 271: the army: the fighters, the spy, the priest, the medic
- `BUSY` 273: One home for "your army less who is busy" (Nov 2, O2: four filters wrote it four ways)
- `armyFree` 281
- `popOf` 282
- `roomOf` 291: people one home shelters, after research
- `capOf` 292
- `armyRoom` 304: One population (Albert, Build 63): only homes cap it (capOf), and any mix is yours, all workers or all soldiers
- `clsMax` 305
- `armyFull` 306: the phone's limit, wherever it bites
- `qMax` 307: orders one building's line holds (Written records, Guilds add to it)
- `shortest` 309: of the buildings that can take an order, the one with the shortest line (training, research and muster alike
- `lineFree` 310
- `capAt` 314: how many of a building you may have now: by age, plus research a cap table lists the ages it changes in; an ag…
- `capFor` 315
- `atCap` 317
- `capWhy` 318
- `clsCount` 329
- `queuedOf` 348
- `orderSet` 357
- `selName` 359
- `hasCmd` 360
- `formOf` 361
- `marching` 365: Shape and temper, the two dials
- `shapeOf` 367
- `dialOf` 376: a dial's setting for one battalion or for all of them (-1 when they differ), and one step round it
- `cycle` 377
- `temperOf` 382: a shield wall holds: no chase
- `kiteOf` 383
- `clsOf` 391: a soldier's kind, from the building that trains it; −1 for none of the four
- `rebattalion` 392
- `every` 418: a slow tick's turn (BEAT)
- `atWar` 419
- `gangOf` 425: The one hostility test (decision 8, C1; answer 1b): sides by their relations; animals are everyone's foe, alwa…
- `gangRel` 436: a side's stance with a group: the Natives' is the fifth side's place in G.rel; the other groups' live with the…
- `calm4b` 440: Decision 4b (an experiment, EXCEPTIONS #15, until the computers can buy peace): the wild's people start nothin…
- `campOf` 441
- `groundOf` 442
- `struckBy` 446
- `isFoe` 452
- `friendly` 462
- `season` 463
- `skyVec` 469: ── The sky (Build 55): the sun's height from the calendar and the land's latitude, by the standard sunrise ari…
- `sunDecl` 477: the sun's declination on day N (the standard approximation)
- `dayN` 478: the day of the real year, held through a game day (six a year: each spans two real months)
- `hourH` 479: the hour angle: 0 at solar noon
- `sunAltAt` 480: degrees above the horizon on day N at fraction f of the day
- `sunAlt` 481
- `sunVec` 482
- `moonVec` 485: the moon's place, to first order (design, said in SCIENCE.md): it runs ahead of the sun by its phase (a full m…
- `nightOf` 490: 0 with the sun up, 1 from nautical twilight on
- `nightness` 491
- `moonPhase` 492: 0 new, 0.5 full
- `moonLight` 493: the lit fraction k = (1 − cos i) / 2 (Meeus 48.1), 1 at full moon
- `civOf` 494
- `civKind` 496: the kind a side actually trains for a common unit (its civilisation's own, if it has one)
- `baseKind` 500
- `BTIER` 502: research that raises every building of a kind in place (btier in the research table)
- `btierOf` 504
- `shelterOf` 505: how many villagers a building takes in, after research
- `bldName` 506
- `fxList` 519: Each side keeps a small cache of its active effects; it is rebuilt when research finishes or a building with e…
- `FX1` 539: the combined effect on one stat for something with these keys: m multiplies, a adds, min keeps the lowest
- `fxFits` 541: whether an effect reaches something with these keys: no k or '*' reaches all; k names one key, or a list of th…
- `fxv` 543
- `fxDirty` 563
- `keepHealth` 568: a finished building keeps its share of full health when research moves the full health (B7
- `freeVil` 580: Two words for two things (Build 62): a villager is FREE when it has no job and can be given one (the tile's co…
- `posted` 585: Posted and roaming (Albert, Nov 2, D-089: "a farm is a farm"): a villager given a building (a field, a tree fa…
- `hand` 589: a plot of yours with no worker on it: the Z on the field (23-view-things) and its count in the strip (32-frame…
- `idlePost` 590
- `unitKeys` 591
- `bldKeys` 598
- `stats` 607: what a side's unit of this kind is, after its research: name, health, damage, reach, speed, what it beats
- `maxHpU` 650
- `maxHpB` 651
- `dmgOf` 652
- `rngOf` 662
- `rangeFrom` 668: how far a building shoots: a shot at 45° from height h with the range r0 it would have from the ground lands a…
- `rangeOf` 669
- `spySeen` 672: how far a side's unit or building sees a hidden spy (research adds to a building's): one home for who may shoo…
- `lookout` 673: how far a building sees, from its height
- `sightFx` 674
- `sightClear` 675
- `visCap` 689: in fog, snow or a blizzard nobody sees past the visibility, a tower no farther than a man (Build 61; before, a…
- `sightOf` 694
- `groupSees` 698: the many eyes (decision 8b
- `carryOf` 701
- `nodeKey` 705: what gather research is keyed to: the find itself (tree, bush, fish, meat, stone, gold, iron), or the building…
- `gatherMul` 706
- `makeOf` 727: what a workshop makes now: from what, how fast
- `rehealth` 729: after research or a new building: every unit and building of that side takes its new health at once (same shar…
- `hawkP` 747: Hawk-Dove (Maynard Smith and Price 1973): with the prize V under the cost of injury C, the stable mix plays Ha…
- `unitPower` 748
- `powerOf` 749
- `lanchester` 752: the square law as odds: with a power ratio r, the chance is r² / (1 + r²) (Lanchester, Aircraft in Warfare, 19…

**`11-orders.js`** (1218 lines): what a side can do, and why not

- `scaled` 4: what an order costs this side now: one scaling for units (Informers make spies cheaper) and research (the Ency…
- `unitCost` 10
- `techCost` 11
- `trainWhy` 12
- `train` 27
- `tentCost` 40: a training tent charges CAMP.extra over the price (Field logistics
- `tentOrNot` 41
- `whyOf` 43: cancel one order in a building's line: what was paid for it comes back in full, the way it went out (every ord…
- `refund` 45: what an order gives back when it goes: the purse, the ledger and the research spent, one home for a cancel and…
- `cancelOrder` 49
- `unTrain` 58
- `musterN` 69: Muster: a whole battalion in one order at the War Council: twice the cost and a quarter longer; the time is sh…
- `musterCost` 70
- `musterWhy` 82
- `muster` 99
- `researchWhy` 107
- `research` 122
- `ageUp` 134
- `navHold` 145
- `navLate` 146
- `navOnce` 148: pieces laid in one go rebuild the grid once, after them (B13: forty pieces stalled a frame 131 ms; hunt A #8: …
- `build` 158
- `autoBuilder` 186: A site rises only while villagers work it
- `sendBuilder` 222: a builder remembers what it left (its job, its find or building, where it was placed), so backToWork takes it …
- `sendBuild` 233: Send one more to a site
- `replantWhy` 246: Replant a plot that is cut out or worked out (Build 61, Albert): half its cost, and it is full again; a coppic…
- `replant` 253
- `shellBack` 264: Take a building down: half its cost back (all of it in the first 15% of the build); every order waiting inside…
- `refundOf` 270
- `demolish` 275
- `declareWar` 297: Relations are ally, peace (neutral) or war (hostile), the same for every side
- `makePeace` 311
- `makeAlly` 325
- `noticeLeft` 333
- `gangKey` 339: why a side cannot take this stance toward another right now, or null a misfit group (GANG) on a Relations row,…
- `relWhy` 340
- `envoyWhy` 362: what stops an emissary going: one for courts and groups alike
- `setRel` 369
- `noticeTick` 401
- `sendEnvoy` 408
- `oddsOf` 424: the square law on strength, bent by who counters whom: the odds q gives itself against o
- `judgeEnvoy` 429
- `reply` 486
- `sendHelp` 491: an ally sends half of what stands at home to a friend's town under attack (every computer does this for its al…
- `overlordWhy` 506: an ally twice your strength may be offered overlordship: they become your vassal at a light tax
- `offerOverlord` 512
- `breakTies` 519: ── A lord's hand on a vassal: cut them loose, demand, force tribute, call up their soldiers (Assyria taxed at …
- `demandCost` 529
- `demandWhy` 530
- `demand` 536
- `menAt` 548
- `tributeWhy` 552
- `forceTribute` 559
- `levyOf` 567
- `levyRoom` 569: how many more may be called up: half of all their soldiers, counting those already marching for you (Build 48:…
- `levyWhy` 573
- `levy` 581
- `releaseLevy` 604
- `releaseAll` 614
- `chargeWhy` 622
- `charge` 628
- `fallBack` 643
- `takePrisoner` 668: Prisoners: a runner touched by a foe, or a man netted by the Natives
- `prisonersOf` 687
- `payRansom` 688
- `teachTo` 703: ── Teach: a soldier of an older kind learns a newer one at the School
- `teachGap` 707
- `teachCost` 708
- `teachSecs` 716
- `schooling` 717
- `teachWhy` 718
- `teach` 731
- `graduate` 741
- `prisonersTick` 752
- `LOT` 776: The Market, one rule for everything it trades: resources by the 100, goods by the 10; it pays 80% of worth (90…
- `worth` 777: spice is worth what it costs at a stop
- `coinOf` 778: debased coin: dearer to buy, less for what you sell
- `sellPrice` 779
- `buyPrice` 780
- `haveOf` 781
- `marketTrade` 782
- `zealCost` 805
- `zealWhy` 806
- `zeal` 816
- `watchtower` 829: a spy stands unseen beyond 45 of soldiers and 140 of towers, the Town Center and Courthouses
- `guarded` 830
- `sabotage` 832
- `intel` 855
- `hireWhy` 862
- `hire` 870
- `setJob` 888
- `atShop` 909: a villager at a workshop, a mint or a foundry, walking there or working inside: + and the computers leave it b…
- `NO_HANDS` 912: the + and − under a job (D-089): + takes an idle villager, else the roaming one earning least on another job; …
- `moveVil` 913
- `stopVil` 927: Stop: a villager drops its job and stands where it is (or where it is sent), ready for a new order (Build 61)
- `sendOut` 937: Send out (a field, a pasture or a shop's card): the last villager sent there goes home; a shop worker steps ou…
- `sendVil` 944
- `sendHunt` 969
- `sendRepair` 983
- `repairCost` 996
- `nodeName` 1002
- `commitPlace` 1012: ── the player's placing and box orders (the finger's work is in 26-input.js; what it orders is here)
- `boxCut` 1075
- `centreOf` 1100: ── Orders you can follow: a group sent somewhere is stamped with its order; the map draws a line to where it i…
- `routeK` 1104
- `etaOf` 1112
- `march` 1114
- `sendHome` 1133: soldiers called home: off whatever they were doing and off their order
- `incomingTick` 1142
- `ordersTick` 1175

**`12-sim-core.js`** (810 lines): the step, formations, deaths, victory, buildings built, research learned

- `isThreat` 3
- `recount` 8: once a second, and at once after a load: finds with live guards (villagers keep away from work beside them), a…
- `insulate` 21: layers worn in series (decision N10): heat loss Q = ΔT / R_total and R_total = R_body + Σ R_i, so the cold's o…
- `sideSpd` 23: what the season and the weather take off a march, for one side: moveTo and the mission clocks read the same nu…
- `step` 31
- `reap` 83: the dead and the spent: the fallen leave, buildings that burned or ran dry go, lists shrink once
- `sidesTick` 163: the computers think, the Natives act, a side without a keep falls, scores and battalions refresh
- `formUp` 180: An army stands in a grid: soldiers of one side that wait at home, or are going to the same spot, form rows, ba…
- `DF` 335
- `react` 336: seconds between computer decisions: human-like, no cheats
- `died` 337
- `judge` 373
- `bldTick` 435
- `built` 488
- `jobDone` 520
- `learnTech` 576
- `dropFor` 603
- `dockNear` 610
- `nodeFits` 621
- `unsafe` 622: on the side's danger map (09-nav: dangerMap); a field is never left for it
- `FORAGE` 634: move when 18% better (Albert, Oct 29); a field's life counts as 20 loads; room is design
- `forage` 635
- `turtlePlan` 659: The turtle plan (Albert, Build 63): what the next age costs in villager-minutes from this Town Center, with th…
- `forageNow` 689: the rate a worker earns where it is now: 0 idle or off gathering
- `bestNode` 701: the best find for this worker and its rate: fields, berries, trees, stone, gold, iron, fish, a carcass, or gam…
- `reachFrom` 779: cm: when given, only a find whose foot (an open square within two of it) lies in that walking region counts: a…
- `nearestNode` 780: the one find a worker should take now
- `pickVil` 784: who to send: an idle villager first, the nearest; with strict (your orders to a building, D-089) nobody else
- `typesOf` 806: the resource a building serves: a field its crop, a drop-off what it takes in

**`13-sim-civil.js`** (875 lines): villagers, hunters, repairers, scouts, envoys, caravans, spies

- `shopTick` 6: A worker at a workshop, a mint or a foundry works inside it (Build 53, Albert: "a worker who works in a shop s…
- `workMul` 22: what a worker's own state does to its work: sick, weakened by a famine (hungerOf), cheered by the circus (one …
- `makeNow` 25: what a worker makes in this moment from a field, a find or a workshop's inputs (which it takes from the stores…
- `LATTICE` 58: Where each one stands: one home for every spot (decision 1; item 5)
- `spotAt` 70
- `findCap` 84: How many can work a find at once (Albert, Nov 1, 12:57): the working spots on the ring it is worked from (WORK…
- `regionAt` 86: the walking region a point belongs to: its own square's, else the nearest open square's (a tap on a tree or a …
- `spotFree` 94: A spot is free for o when it keeps personal space from the map's edge, its square is open, it lies in the regi…
- `takeSpots` 107: The spots at a (a building's outline or a point's lattice; key names it in a claim) for the units in list: fre…
- `postTo` 146: villagers sent to a tapped point: each walks to its own spot round it and stops there (item 5; they all made f…
- `stepOut` 157: out of a building: onto the nearest free spot of its outline (item 5; it was set down 30 below the middle, wha…
- `waitAt` 166: A waiter takes the free spot nearest it at its drop-off, once, and keeps it until it has a find again.
- `vilTick` 199
- `leaveWork` 552: the way to this work ended short of it: there is no way there
- `huntTick` 560
- `backToWork` 580: Mending: three times the build time for a full repair, a quarter of the cost, paid as the work goes. every way…
- `repairTick` 591
- `homeSpot` 688
- `scoutTick` 695
- `envoyTick` 740
- `caravanTick` 757: a caravan with no route trades with an ally: out from your Market to theirs, paid by distance on arrival, then…
- `spyTick` 801

**`14-sim-troops.js`** (662 lines): priests, medics, soldiers, wild animals, wayfarers, finds

- `followArmy` 3: priests and medics walk with the battalion that is out; a priest sent to a shrine stands there
- `priestTick` 26
- `medicTick` 85
- `healTick` 99: Healing: a hospital or a medic heals your own soldiers within reach
- `shot` 122: a missile in the air: it flies for a time that grows with the distance, on a curve that rises with it
- `routSecs` 128: Engagement halves the run (C6: the grace no longer shrinks with it)
- `nearHome` 129
- `ambushTick` 133: the ambush (AMBUSH; 28-army-quick ambushAt): bound for cover it walks; in place it goes to ground (hid); a foe…
- `solTick` 158
- `escortPick` 441: a guard keeps to what it guards: a caravan (escort) or a trade stop you hold (garrison); when that is gone, it…
- `wildLeash` 457: how far from home a beast or a guard follows a foe: the camp's ground
- `wildTick` 459: Guards stay by what they guard and attack whoever comes close; game grazes and runs; robbers raid within their…
- `wayfarers` 556
- `wayfarerTick` 574
- `guardsLeft` 596
- `findsTick` 598

**`15-sim-spatial.js`** (195 lines): who is near what: the unit and building grids

- `UG` 4: Units are sorted into squares of 48 at the start of each step, so a search looks only at the squares around it.
- `UGN` 5
- `UGH` 6
- `UGX` 7
- `buildGrid` 8
- `onMe` 28: soldiers only: a tower or a cart keeps v70's rule
- `ignorable` 29
- `strikes` 35: one in ambush (hid) is no mark
- `scanNear` 38: every unit in the grid's squares within r of a (the unit grid, rebuilt each step), in the grid's own order; wi…
- `nearestFoe` 50
- `foeValue` 72: The attack-value rule: strike first the foe that takes the most of the enemy's damage off the field per second…
- `GROUP_R` 82: can we beat it: the soldier's own group (its side within GROUP_R of it, itself in) against that one foe, by th…
- `groupPower` 83
- `canBeat` 92
- `bestFoe` 93
- `nearU` 114: the nearest unit within r that passes ok, looking only at the squares around (the grid is rebuilt each step)
- `nearestFoeBld` 128
- `SGC` 145: Buildings and nodes stand still, so each is sorted into squares of 100 once, and redone only when one comes or…
- `SGN` 146
- `SG` 147
- `sgrid` 148
- `sgNear` 163: calls fn for everything within r of (x, y) by its square (a little beyond r on the edges); stops and returns t…
- `bldsNear` 176
- `nodesNear` 177
- `unitsNear` 179: the units within r of from, by the unit grid
- `vsMul` 188

**`16-sim-fight.js`** (454 lines): damage, pushing apart, plunder, falling, scoring, finishing

- `fromWhere` 4: where a blow comes from, as the cosine between the line's facing and the attacker: 1 from the front, 0 from th…
- `hurt` 27
- `CHS` 174: Crowd spacing, neighbours only: units are sorted into squares as wide as personal space (no push reaches past …
- `CHW` 175
- `CHEAD` 176
- `CHCELL` 177
- `CHNEXT` 178
- `heft` 181: Who gives way (Build 48; it was always half and half): one at work or in a fight hardly moves, one walking mov…
- `forming` 183: forming (FORMING): walking to its place in a shape (its gx set, not there yet); the precedence of its kind, lo…
- `rankOf` 184
- `pushApart` 185
- `atRest` 219: at rest (D-092): a stopped villager on a point of its own (not a group's spot), or a grazer between bites
- `settle` 220
- `collide` 224
- `plunder` 277: A destroyed building pays its destroyer a quarter of its cost; a fallen Town Center pays the whole stockpile a…
- `warCredit` 292: the War crown (N6): the cost value of an enemy's people or building destroyed, to the side that destroyed it; …
- `plunderBld` 296
- `fall` 307
- `scoreAll` 366
- `watchHome` 382
- `finish` 391
- `TICK` 414
- `slotsOf` 430: one worker to a field, a quarry, a workshop
- `startWork` 431

**`36-economy.js`** (935 lines): trade, weather, fire, sickness, vassals, the computers' economy

- `FLEECE` 4: Real ratios on a compressed calendar: one year is 12 minutes, and every rate below is set against that clock.
- `LAMBS` 5
- `FLOCK` 6: wool per sheep at the spring shearing; a flock grows by logistic growth (Verhulst), r = 0.6 a spring toward a …
- `stopsAll` 8
- `postAt` 9
- `stopsHeld` 10: of one route's four stops
- `stash` 11
- `flowOf` 28: what came in over the last minute, by resource and good: kept for the stores card (the flow is counted as it i…
- `outOf` 30: what went out a minute (a computer's crew per resource reads it, 17-ai)
- `netOf` 31
- `VEL` 34: a store's velocity on the one gradient: its net flow a minute over VEL.ref (tanh: a gentle middle, a firm end)…
- `velOf` 35
- `flowTick` 40
- `initEconomy` 54
- `distF` 76: ── prices: base, more where it is wanted, more the farther it travels
- `baseOf` 77: a made good's price, or a raw find's (the Market's lot price ÷ 100)
- `nameOf` 78
- `colOf` 79: a cart's load shows its colour: a good's own, or the resource's
- `loadable` 80: what a caravan may take: all of a made good, a raw find's surplus
- `takeFrom` 83: a load taken up or put down: raw through the money home (spent on, or back from, trade; a load is not gathered…
- `giveTo` 84
- `priceAt` 86
- `tradeTargets` 94: Trade has two lanes
- `allyMarket` 96
- `targetOf` 117
- `homeBiz` 118: the Market stores goods and loads caravans
- `estPay` 119
- `setRoute` 129
- `bestTarget` 135
- `routeTick` 151: A caravan on a route: load at the Market, sell at the far end (and buy spice at a stop), bring the spice home,…
- `guardedCart` 241: caravans within reach of a trade post or tower of yours, or with a soldier of yours close by, are left alone b…
- `robbed` 253: a robbed caravan's load goes into the nearest robbers' camp, and comes back to whoever breaks the camp
- `natureTick` 262: ── the calendar: weather every minute, the seasons' work, the year's harvest
- `seasonTurn` 304
- `fireHeat` 360: ── fire: wood and thatch burn, catch from their neighbours, and villagers put it out the heat a neighbour rece…
- `FIRE_SMOKE` 361: a second, for each villager fighting a big fire (spread, or the building below half): about one death in three…
- `ignite` 362
- `storm` 391: Summer storms: lightning strikes open ground now and then, and sometimes a wooden building; bakeries and smith…
- `strike` 392
- `lightning` 398
- `fireTick` 415
- `sickRisk` 437: ── sickness: a few fall ill now and then, more in summer and winter; clean water, sewers and quarantine lower …
- `outbreak` 446
- `healthTick` 463
- `upkeepTick` 532: ── food upkeep: everyone eats, every second, wherever they are
- `econTick` 569
- `aiEconomy` 581: ── the computers: a Market, one workshop each, caravans with routes, posts on the free stops near them
- `shareOf` 634: ── food upkeep
- `orderCost` 642: an order's cost (ORDER): the soldiers' meals from the store, and the tiredness; what it ate, for the toast
- `hungerOf` 652: full strength for the first two days of a famine
- `setMake` 656: ── prices float with what is sold and bought, and drift back a workshop's choice: what it makes now (the node'…
- `mkt` 669
- `debase` 674
- `mktHit` 683
- `spiceCost` 688
- `priceDrift` 689
- `venture` 703: ventures: gold put into a merchant voyage; a year later it comes back with 40% more, or not at all
- `ventureTick` 713
- `vassalsOf` 731: ── vassals: tax, loyalty, unrest, rebellion and coalition
- `shareUp` 733: a loyal vassal shares a quarter of its trade profit with its lord
- `loyaltyParts` 740
- `makeVassal` 762
- `surrenderWhy` 790: can this side be made to surrender? Their army is beaten and yours stands at their Town Center.
- `demandSurrender` 800
- `rebel` 809
- `vassalTick` 842

**`37-events.js`** (762 lines): the event scheduler and what each event does

- `EVM` 5: EVM: the knobs an event turns (every unit reads them: damage, speed, sight, gathering)
- `KNOBS` 7: fog caps sight by visibility instead (visCap, 08)
- `evmSet` 8
- `hz` 13: Easy keeps the polite game whatever is switched on
- `levelOf` 14
- `levelMul` 15: the score's multiplier for the level played
- `evOn` 16
- `edgeSpot` 17
- `across` 23: the far side of the land from a spot (through the middle)
- `wildSpot` 24
- `canEv` 35
- `pickEvent` 46
- `crossing` 53: the swarm, the herd and the cloud all cross the map the same way: from one edge to the far side, in E.secs
- `herdAt` 59
- `EV` 73
- `crackAt` 438: The ground splits: a star of jagged cracks and a puff of dust at (x, y), r wide
- `startEvent` 461
- `endEvent` 479
- `eventsTick` 487
- `hordeTick` 512: The horde (the hazard): announced two seasons ahead, then one; from an edge or out of the wild, for the weakes…
- `blankClim` 552: ── The climate (Build 54): one tick a second
- `airTemp` 553
- `wxWhy` 558: why the sky turned, in the chain's own numbers: the list shows it under the line (Build 58)
- `precip` 569
- `skyTurn` 570
- `climateTick` 602
- `groundTick` 615: The ground's water, snow, ice and mud for one step, from the air's temperature c.T and the sky wx (pure in c, …
- `ruts` 644: Traffic (Build 62): every unit-second on a square deepens its ruts
- `rutsAt` 645
- `rutsOn` 646
- `rutHeal` 651
- `rutOf` 656
- `mudAt` 658: mud at a place: the ground's mud, deeper by water (pooling) and by traffic (ruts)
- `groundNeed` 661: what a step needs of the ground (Hanson et al. 1999), by what is stepping: an engine's haulers, a horse, a man…
- `studded` 664: whether iron bites the ice for this contact (D-064)
- `iceMu` 666: the ice's friction now: slickest just below freezing (the melt film), better in deep cold; iron studs give at …
- `strideShare` 673: no stride lost when the studs hold the need
- `groundSpd` 674
- `muOf` 686: Traction: the friction the ground offers now, a blend by cover (ice over snow over mud over dry); studs change…
- `slipChance` 694: the chance of a slip in a check: a logistic step on what the step needs less what the ground offers (Hanson et…
- `rothermel` 697: fire against the ground's wetness
- `fireMul` 698
- `wearMul` 699: brittle in frost, rusted in rain
- `newsTick` 700
- `herdTick` 708: a herd crosses: bison trample what they run over; performers only pass; a dragon flies (it is drawn above ever…
- `starveTick` 738: hunger, once a second, for every side (Albert, Nov 1): the store empty is hunger (p.hungry); with no food in r…
- `foodInReach` 753: food a side can still reach: a bush, its own field, fish or meat with something left, or game, in its Town Cen…

**`38-camps.js`** (307 lines): war camps (Albert, Nov 3): the wagon, the strip and the square, the soldiers who raise them

- `CAMP_TENTS` 6: An Outpost is a thin strip: four tents and a tower in one file, broadside to the way home (Hyginus §1: a centu…
- `campLayout` 8: the pieces of a camp of a kind at (x, y), facing fx, fy (toward home: the gate side): [{kind, x, y}]
- `campFacing` 40: facing: from the spot toward the owner's Town Center (the gate side), else south
- `campCells` 48: the square of ground a camp takes: every piece's footprint plus a lane, as canPlace keeps for a building
- `campWhy` 59: why a camp cannot stand here, or null: off the map, on water, on a building or a find; trees are allowed (they…
- `campUnpack` 79: the wagon unpacks: the trees under the camp burn, the sites are laid, the wagon is gone
- `wagonTick` 139: the wagon on the road: sent to a spot it drives there and unpacks; at home it waits by the Stable
- `campCap` 148: how many camps of a kind a side may have out at once, wagons on the road and in the line counted: one, two fro…
- `campsOut` 154
- `campWhyTrain` 162
- `canRaise` 169: at home or arrived where it was sent
- `campRaise` 170
- `campSendHome` 206: a soldier by a medical tent that is badly hurt or sick walks home to the Hospital (none: it stays and is bound…
- `depotsOf` 224: ── step 2: supplies, the caravan's run, wear and mending, the camp as a pool for sickness
- `depotNear` 225: the depot a unit eats from
- `campEat` 227: every second (36-economy upkeepTick): the soldiers in a camp's reach eat from its depot (eats(u): the food a u…
- `supplyRun` 255: a Market caravan with nothing to carry runs food to a depot under half (caravanTick): the food from the store …
- `campWearTick` 302: a minute of rain, snow or frost takes CAMP.wear of a camp piece's health (every minute; 36-economy econTick)

**`39-games.js`** (208 lines): peace as a path (Build 57)

- `PEACE` 5: Albert, Oct 29: "Why is it just war?" and "I build to match life
- `CARE` 22: what counts as care for the Wellbeing crown
- `bestOf` 24: the best a side has of some measure, over the soldier kinds it has alive (a side with no soldiers sends its vi…
- `livingSides` 35
- `truceAll` 37: a board truce: no two living courts at war, and no notice running
- `truceFor` 44: seconds the whole board has been at peace
- `ageOpen` 45: the hidden age, once opened, stays open for every side
- `nextAge` 46
- `chron` 47
- `peaceTick` 52: once a second from the simulation: the truce clock, the hidden age, standing down, the Games
- `standDown` 82: soldiers above the keep share go home and take up the villager's tools; the room they held is freed (demobilis…
- `holdGames` 105: the Games: held on the Throne island under the truce of the whole board, as the ekecheiria held Olympia; they …
- `crownsOf` 129: the three crowns and the overall (N6, best practice of the genre's flow scores: 0 A.D.'s economy and military …
- `CROWN_NAME` 158
- `crownsHTML` 159
- `enlightenTick` 183: the last step of the hidden age ends the match for everyone: the crowns are pointed to, and play can carry on
- `chaseCrown` 195: a personality chases its crown: the war chaser breaks truces, the wealth chaser trades, the wellbeing chaser b…

**`40-emergency.js`** (167 lines): Emergency: Stop, Town square, All hands, Shelter

- `EMERGENCY` 8: Four orders (MENU-SPEC §8, picture Easy Cards)
- `EMG` 13: square: the villagers stand this far out from the Town Center's walls, the soldiers three times as far
- `shelterRank` 14
- `roomIn` 18
- `troops` 22: a student keeps its lesson (C10)
- `stand` 24: a soldier off its order, to stand at a spot and fight what comes
- `threatDir` 36: the way the danger lies from the Town Center: the attack coming, else the nearest threat, else across the map
- `fillRank` 42: fill the ranked buildings with the nearest of these units (shooters first when asked); what is left over is re…
- `emgSnap` 54: once, at the first order: the picture Stop goes back to, every villager's work and every squad's temper; a vil…
- `release` 62: a villager let go by the emergency: not frightened, out of the building it went into
- `villagersIn` 69
- `soldiersIn` 92
- `townSquare` 121: Town square: everyone round the Town Center, each on its own side: the villagers just out from its walls, the …
- `emgStart` 143
- `emgStop` 152: Stop: every villager back to what it was doing; soldiers stay where the order put them

### Save and boot

**`34-save.js`** (699 lines): save and load

- `SAVEKEY` 3
- `SAVEV` 4: 46: a river's pools carry their stretch and lake (preview 52); 45: the land turned into the world (preview 51)…
- `MIGRATE` 5
- `evSave` 305
- `staleSave` 310: the version of a save we could not open, so the setup card can say so
- `SKIP_U` 311
- `cardLocked` 352: the Resume card, and the setup card while a save waits behind it, must be answered: closing either would start…
- `freshSlate` 362: a deliberate new game starts clean: no leftover fight hold, save-failure clock, stale note or error count from…
- `holdSave` 368: while the Resume card waits, nothing may overwrite the save it offers
- `inFight` 369
- `fightHold` 370
- `saveGame` 372
- `readSave` 493
- `keepAside` 510
- `migrateChain` 519: every old shape has a step to the next: a save from any build since the chain began opens (the gate checks this)
- `clearSave` 524
- `loadGame` 530

**`41-boot.js`** (741 lines): start-up, and closes the one scope

- `last` 3
- `acc` 4
- `lastSave` 5
- `inputT` 6
- `CATCHUP` 7
- `seenErr` 9: The safety net: an error costs a frame, never the game, and each kind is logged once
- `fault` 10
- `shed` 25: Load (DRAW in 18-figures): over 12 ms of work a frame for two seconds sheds one level; under 7 ms for ten seco…
- `frame` 46: One frame
- `spdPop` 95: the speeds drop down under the play button whenever the game is paused; play or a speed closes them (Albert, B…
- `TEST_FIELD` 114: The test field (Albert, Nov 3: "a test game where it's just me and one other enemy"): the page opened with ?test
- `testField` 115
- `clip` 197

## Look: the pictures, the screens and the sound: how the truth is shown

### Art

**`18-figures.js`** (2068 lines): people and beasts, drawn from data

- `lessMotion` 4: the person's own setting (Reduce motion): honoured everywhere, never set by the game
- `DRAW` 11: One draw budget (Build 62): a phone that falls behind sheds in one order, and climbs back when it catches up
- `still` 12
- `shade` 13
- `g` 18: the context being drawn into
- `KIT` 19: how much armour research the side being drawn has (0-3: leather, chain, plate); soldiers only
- `P_` 20
- `E_` 34
- `L_` 47
- `LG` 55
- `INK` 60
- `SKIN` 61
- `STEEL` 62
- `BRONZE` 63
- `WOOD` 64
- `LEATHER` 65
- `steel` 66
- `bronzeG` 67
- `person` 70: ── a person, built from parts. o: { tunic, trim, body, head, helm, crest, shield, weapon, skin, legs, boots, c…
- `helm` 333
- `weapon` 576
- `shield` 819
- `horse` 917: ── a horse, side on. o: { coat, barding: 'cloth'|'scale'|'mail', cloth }
- `quad` 1078
- `elephant` 1160
- `wheel` 1258
- `planks` 1271
- `WORKTOOL` 1293: chop, forage, mine, farm, fish, mend
- `LOOKS` 1294
- `LOOKBOX` 1968: how big each look's sprite box is (local units): [width, height]
- `SPR` 2001: ── the sprite cache: one canvas per look, colour, tier, pose and zoom step
- `trim` 2002
- `SCALES` 2010
- `ELITE_LOOK` 2012: the looks the six peoples' finest wear; the common kinds that share a look never reach a tier
- `elitePennant` 2013
- `sprite` 2039

**`19-building-art.js`** (3068 lines): building art

- `TOWER_LOOK` 7: Local units = world units
- `STONE` 12
- `PLASTER` 13
- `PLANK` 14
- `MUD` 15
- `THATCH` 16
- `TILE` 17
- `SLATE` 18
- `SUN` 22: ── the light (Build 61, after the best of the genre: one warm sun from the upper left, cool shadow, not grey) …
- `SHADOW` 23
- `hexRGB` 24
- `mix` 28
- `lit` 33
- `LINE` 34
- `ao` 35
- `rim` 46
- `sides` 48: the east wall and the top of a box whose front runs x0..x1 at yf, h tall and d deep (d already squashed): draw…
- `UP` 76: Research shows on the building it belongs to
- `TECHAT` 77
- `upTier` 79
- `block` 87: a block: footprint w × w, front wall of height h, a roof on top
- `roofGrain` 271: the grain of a roof: thatch in layered scallops with loose strands, tile in curved rows, slate and the rest in…
- `texture` 303
- `ridgeRoof` 356
- `door` 381
- `win` 395
- `FLAGS` 408: while a building is drawn: where its flags fly, so they are drawn live over it and wave (Build 52)
- `banner` 409
- `crenels` 428
- `column` 442
- `smallTree` 466
- `stump` 494: ── the props the yards share (Build 61) ──
- `grassTufts` 499
- `hay` 507
- `barrel` 513
- `crate` 532
- `sack` 564
- `lantern` 569
- `sheep` 582
- `pony` 589
- `leanto` 616: a lean-to roof on posts over a yard: the front edge sags a little, the slats show, the back edge catches the l…
- `ART` 647: the art for each building kind. c = side colour, o = owner (for civ and research), w = width in world units
- `plotPts` 2396: the ground every plot shares (Build 61): the tilted parallelogram a building stands on, a worn margin, posts a…
- `gpt` 2406
- `post` 2411
- `rail` 2426
- `field` 2431
- `RG` 2454
- `WONDERART` 2459
- `BLDTOP` 2800: footprint box and how tall each kind may draw, for the cache canvas
- `BSPR` 2813
- `bldSprite` 2814
- `NSPR` 2879: trees, bushes, rocks: a few variants each, cached the same way
- `NS_c` 2880
- `NS_poly` 2885
- `NS_blob` 2899
- `NS_INK` 2905
- `NODE_H` 2907: how tall each kind stands, for its shadow
- `nodeSprite` 2908

### View

**`20-view-base.js`** (265 lines): canvas, camera, scars on the ground, tracks, zoom

- `cv` 3
- `mini` 4
- `mctx` 5
- `ctx` 6: the glass; swapped for a cache's context while a badge or a pile is drawn once (Build 62)
- `cam` 7: set again by every new game and load
- `FIG` 8: figures are drawn at 0.66 world units per figure unit: a person stands about 14 tall (Build 59, Albert: from 0…
- `cw` 9
- `ch` 10
- `dpr` 11
- `bg` 12
- `bgK` 13
- `terrainMini` 14
- `grassPat` 15
- `grassM` 16
- `scarCv` 18: the ground remembers: where people fell, where buildings burned, where villagers walk a lot
- `scarX` 19
- `resetScars` 20
- `wearGround` 27: the ground round a building is worn bare by feet (Build 52): painted once into the ground's memory when it is …
- `scarFall` 36
- `scarStrike` 52
- `scarCrack` 60
- `scarBurn` 70
- `drawOnce` 87: a small parchment tab with a book in red ink, and a count when more than one thing waits the badge is drawn on…
- `BADGE` 101
- `researchBadge` 102
- `badgeArt` 117
- `vy` 155: the map is full screen; the view centres on the band between the top pills and the bottom ones
- `bandH` 157: the height of the clear band between the top bars and the jobs (fit sets it)
- `clampCam` 158
- `spring` 173: The camera glides as a critically damped spring (ζ = 1, no overshoot; the standard smoothing of a value toward…
- `CAM_W` 179: ω: the glide is over in about 4/ω s, half a second
- `camGo` 180
- `camStop` 190
- `followCam` 195: Follow (the pick bar): the target is the middle of what is picked, until you drag, pinch or tap the small map,…
- `SX` 220: The turned view (preview 50): a world point goes to the screen by u = (x − y) across and v = (x + y) down, eac…
- `SY` 221
- `DX` 222
- `DY` 223
- `toWorld` 224
- `dWorld` 229
- `wmat` 234
- `flat` 235
- `viewBox` 237: the world box the screen sees: the four screen corners turned back; margin m in world units
- `wrect` 242: a world rectangle flat on the ground, filled (or stroked) under the turned matrix: a footprint, a cell, a wall…
- `landMat` 250: the land's frame on a canvas already in world units (preview 51)
- `DIAG` 251: the land's width on the screen at zoom 1 // the map's width on the screen at zoom 1 (its diagonal)
- `minZ` 252: the land stands square on the screen
- `zoomAt` 253
- `quant` 261

**`21-view-frame.js`** (385 lines): the ground texture and the draw of one frame

- `makeBg` 3: the ground: one soft picture at half detail for the big shapes, a sharp grass texture over it when you are close
- `SPARKS` 219
- `miniT` 220
- `RIMC` 224: The rim (preview 50, Albert: "I wanted water and cliffs and sky anyway"): the screen is a rectangle and the ma…
- `CLIFF_H` 225: the far edges rise this much above the map
- `drawRim` 226
- `draw` 259

**`22-view-fog.js`** (175 lines): the minimap and the fog of war

- `RADAR` 4: Enemy soldiers close to your Town Center but off screen: a red marker on the edge, pointing at them
- `drawRadar` 5
- `hg` 67
- `fogAt` 70: an enemy spy shows only when something of yours is close enough to see it Fog of war, yours alone (the compute…
- `seen0` 71: in your sight now, or yours
- `known0` 72: ever seen: a find you found stays on the map
- `knownB` 73: a building shows where you see it now, or where you once saw it (Build 51: one put up in ground you had only e…
- `visibleTo0` 74
- `fogCv` 75
- `fogImg` 76
- `WOODS` 79: the woods block sight (Build 61, Albert: lifelike lines of sight): a fog square holding three or more standing…
- `woodsGrid` 80
- `openLine` 92: is the square (gx, gy) in open sight of the square (sx, sy)? a line on the grid (Bresenham); the first wood on…
- `fogTick` 114
- `fogOff` 141
- `fogLayer` 142
- `stamp` 165
- `trapShown` 174: a hidden trap shows only to its side, its allies, and a side whose scout found it

**`23-view-things.js`** (1399 lines): buildings, smoke and fire, ripples and sparks, nodes, units, finds

- `WALL_LOOK` 6: The wall mold (preview 50, Albert: "this solves the wall heft problems"): a wall, a gate or a palisade is not …
- `WALL_KEYS` 11
- `wallKeysAt` 12
- `wkey` 13
- `wallKeys` 14
- `drawWallBox` 21
- `drawBld` 83
- `CHIMNEY` 263
- `FLAME` 268: ── Fire (Build 55): one element for every flame in the game
- `LIGHT` 276: reach in world units per √power; what rain leaves of an open flame; the glow's strength
- `CAST` 281: ── Shadows (Build 55, Albert: shadows match the light)
- `SHADE` 282: the shadow's direction on the glass (unit), its length per unit of height (world units), its darkness
- `shadeFrame` 283
- `shadowPath` 306: the shadows of the trees, bushes and rocks you can see, cast from the sun like everything else (Build 61, Albe…
- `BOX` 325: A building's shadow is its own shape, not an oval (decision 14, Albert, Oct 31: we invented the shape, so the …
- `HEX` 331
- `hexOf` 332
- `boxShadow` 347
- `sunShadows` 362
- `flameShadow` 388: a flame's shadow of a thing near it: away from the fire, long, fading as the light does (1/d²)
- `kelvinRGB` 406
- `FLAME_RGB` 414
- `flameLife` 415: what the weather leaves of a flame
- `flame` 417: the flame itself: a teardrop that leans with the wind and flickers; its heart whiter than its edge
- `glow` 438: the light a flame throws on the ground: a disc that fades as the inverse square, drawn additively, only when t…
- `flagsOn` 457: a building's flags fly with the wind: a cloth from the pole top, its tip lifting and falling, longer in a stro…
- `PILE` 480: what a side has in store shows as a pile by the camp that takes it in: logs by the lumber camp, cut stone and …
- `PSPR` 491: the piles are drawn once per kind, counts and zoom into PSPR and stamped (Build 62: measured at 29% of a frame…
- `pileAt` 492
- `pileArt` 508
- `smoke` 538: a chimney's plume (Build 62): bent over by the wind, its height goes with the downwind distance to the two-thi…
- `blaze` 552: fire when a building is badly hurt, dark smoke when sabotage has stalled it
- `RIPS` 568
- `ripple` 569
- `popC` 573: swell and settle; a runs 0 to 1
- `celebrate` 574
- `ripDraw` 590
- `sparkDraw` 606
- `WX_TINT` 629: Three translucent casts (warm dusk, blue night, the weather) laid one over another come to one colour: compute…
- `tintC` 635
- `tintOf` 636
- `NV` 661
- `viewNodes` 662
- `drawNode` 680
- `workOf` 706
- `STRIDE` 722: ground covered by one step, in world units
- `STANDARDS` 725: the poles drawn this frame (screen x, y, side): the lights put a torch on each after dark
- `drawStandards` 726
- `FALL` 781: the fallen (Build 52): a figure that dies where you can see it topples over in a third of a second and fades, …
- `fallen` 782
- `drawFallen` 797
- `LEAN` 812: the view's own memory of each woodcutter's lean: the drawing never writes the game's units (Build 60)
- `PACED` 813: the view's memory of each unit's walk: when it last grew
- `leavesOver` 815: the leaves over a soldier in ambush (the visual pass, Nov 3): three leaf blobs in the wood's greens, swaying a…
- `drawUnit` 830
- `drawFind` 1044
- `drawPicks` 1384: what the finger holds: a ring on the ground under each, green for yours, red for a foe's, gold for the wild an…
- `rnd2` 1398

**`24-view-overlays.js`** (722 lines): ground, event effects, bars, flags, ghost building, minimap

- `drawGround` 4: Spectacle on the glass: each event's picture, drawn over the world
- `drawCracks` 48: the cracks of a sinkhole: dark jagged arms with a pale edge, and a puff of dust that rises and thins over four…
- `drawEvents` 91
- `bar` 109
- `flagAt` 115
- `FONTF` 130
- `FONTW` 131
- `fontF` 132
- `labelK` 137: every word on the map, one home (v80, Albert): the game's one font at its one weight, read from the page (the …
- `mapFont` 138
- `ring` 140: a ring on the ground (a selection, a ripple, a group's health, a placing mark): the one drawer (Nov 2, O3); th…
- `idleMark` 145
- `tag` 153
- `drawSeal` 165: the building you are placing: its footprint green where it fits and red where it does not, and the reason the …
- `drawGuides` 190: alignment guides (Build 63): a thin line from the ghost to every own building whose centre or edge sits on the…
- `drawGhost` 236
- `GHOST_TINT` 287: The ghost's own art tinted green where it fits and red where it does not (Albert, Nov 1): no grid, no footprin…
- `ghostTints` 288
- `ghostTint` 289
- `miniIncoming` 308
- `MINI_K` 327: the land's square fills the small map (preview 51)
- `miniMat` 328: world units to the small map, through the land's frame
- `miniWorld` 329: a point of the small map, in the world
- `drawMini` 330
- `drawFlood` 419: the flood: water over the shore
- `drawSand` 429: quicksand: a pale patch with ripples
- `drawLakeRipples` 444: small ripples drift on the lakes
- `drawRainRings` 464: rain rings sit on the ground, fixed to the world, under buildings and people
- `drawFire` 489: the wildfire
- `drawFogLayer` 508: the fog, soft, over everything standing
- `drawOrders` 524: your groups on the march: a dashed line from the group to where it is going, a ring where it will stand
- `drawTracers` 560: arrows and shots: a short streak along the curve
- `drawLight` 581: the light: warm at dusk and dawn, blue at night, darker toward the edges; lit windows
- `HEARTH` 639: where a fire is always lit after dark (the mess tent's cooking fire, the Hall's lamps
- `drawHitGlow` 641: something of yours was hit: a red glow round the edge, fading over a second and a half
- `drawFlash` 669: a new age, a wonder, a victory: a pale flash
- `drawTouch` 678: boxes of trees being cut, the hold ring, the selection box

**`25-view-weather.js`** (231 lines): rain, wind, lightning, sky, forest

- `RAINP` 7: ── Weather on the glass, after SoRen's model: rain is a pool of drops whose size sets its speed and weight (Ma…
- `fallV` 8
- `RAIN` 9
- `wxT` 14
- `wind` 15
- `flashA` 16
- `flashT` 17
- `sheetT` 18
- `FLASH_GAP` 19
- `flashOK` 20
- `drawWeather` 21
- `SKY` 144: the horizon: a band of sky along the top of the glass, coloured by the hour and the weather; clouds cross it w…
- `drawSky` 154
- `forestCv` 199: the whole forest as one picture, for far views and the small map; redrawn when trees fall, at most once a second
- `forestV` 200
- `forestT` 201
- `forestG` 202
- `forestLayer` 203

### Menus

**`26-input.js`** (669 lines): the finger: tap, hold, box, pick

- `ptrs` 3
- `drag` 4
- `pinch` 5
- `HOLD_MS` 6
- `PRESS_SHOW` 7: ms before the hold's ring shows: a tap (under about 200 ms) never sees it (Albert, Nov 3)
- `DBL_MS` 8
- `holdT` 9: hold a finger: on one of yours, pick it and keep picking; on open ground, then drag: a box
- `holdStop` 10
- `lp` 14
- `EDGE` 18: where the finger is while it drags the ghost: near the screen edge the map scrolls
- `edgeScroll` 19
- `LIFT` 33: on a phone the building waits this far above your finger, so you can see it
- `wallSnap` 35: A wall is a list of corners: tap to add one, drag a corner to move it, drag the wall to slide all of it. `pl.c…
- `wallSet` 43
- `wallXY` 48
- `wallHit` 49
- `ghostAt` 63
- `wallDrag` 68
- `foeFirst` 271: a side you are not at war with: the toast says what to do first, in the stance words (REL_WORD)
- `dropDrag` 274: letting go of a drag, one home (E5: a pinch dropped the drag but left the box drawn and the crosshair glowing)…
- `miniAt` 298
- `hitAt` 331: what is under the finger: a building (they have height), a find, a unit, a resource, else the ground
- `cardFor` 388
- `lastTap` 399: One rule for the finger (Albert, Build 40
- `tapAt` 400
- `ordAt` 460: the order ring under a finger (tap slop 26 px): the nearest group ring wins
- `picked` 474: what the finger holds
- `pickObj` 479
- `setPick` 481
- `pickToggle` 488
- `pickSound` 501: the sound a picked unit answers with: by what it is made of and how it moves (35-sound)
- `order` 511
- `startPlace` 619
- `cancelPlace` 646: you tapped Build: build what the ghost shows; houses, fields and gates offer the next spot beside it
- `boxPick` 651: The box: your people inside it are picked; a box of trees and nobody is a road to cut

**`27-cards-core.js`** (527 lines): the card engine (open, close, patch) and the pieces cards are made of

- `cardTap` 8: the tap being handled was inside a card (the click handler, 33-verbs)
- `openCard` 9
- `READ_CARDS` 24: the cards you sit and read pause the game (named for the Rules page); a building, a unit or a field to glance …
- `cardPK` 28: whether the card on show pauses the game, decided each time what it shows changes (a card opened, back, a tab …
- `cardPause` 29
- `closeCard` 47
- `cardSig` 60
- `sig` 61
- `patchKids` 65
- `patch` 88
- `tpl` 97
- `patchHTML` 98
- `cardIn` 104: A card rises from the row (MENU-SPEC §1): as tall as what it holds, its last rank always one gap above the row…
- `cap1` 109: sentence case: a capital opens every label and every part after a dot
- `btn` 110
- `acts` 114: the Formation, the one helper that lays cells: twelve half slots across, ranks 44 tall, 6 between. cls says ho…
- `grid3` 119: a list collapses (MENU-SPEC §3): its things three a rank, as even as they go, so no rank has a hole: two are t…
- `list` 123
- `info` 134: the info cell: no frame; the value in Cream 1, its label in Cream 2 under it, both at 12. cls: its span, left …
- `empty` 137: a fixed place with nothing in it: a faint plain outline (never dashed)
- `pager` 140: One pager (N13, the Mail; hunt B #1, the Chronicle): rows MSG.page to a page, a short page padded with pad so …
- `choice` 160: ── the controls (v80, the control sheet, Albert Oct 31), each built once and whole slots wide (span: s1 to s6)…
- `lab` 168: a setting's name, quiet at 12, in the slots its control leaves on the left (Setup, MENU-SPEC §8)
- `slt` 172: the slider with its switch: the word, the value and the switch over the track, gold to the knob
- `FOLD` 175: explanations live behind a small fold, closed unless you opened it; it stays as you left it while the card red…
- `techBook` 177: the book entry of a research step: the date, what it changed, and its weight (how much it changed the world, n…
- `folder` 181: tabs are a file folder (MENU-SPEC §1): one rank of tabs; the open one joins one Gold 1 outline round its whole…
- `INFO` 183
- `infoBuf` 184: the explaining text of a card waits behind the book icon
- `fold` 185
- `hpBar` 191
- `sec` 193
- `rowHTML` 195: a rank of six slots in a card, on the row's mold (pic): an icon over its word
- `cardHead` 197: a card's name and subtitle: kept here and laid by renderCard as the title bar, which knows the book and the wa…
- `title` 198: look: a building's title box, its age on the top edge and its health a bar on the bottom (Nov 2)
- `titleBar` 202: The title bar (MENU-SPEC §4), one rank on every card: back · the name, slots 2 to 4 · the book · ×; the subtit…
- `unitLine` 213
- `VS_WORD` 218
- `beatsText` 227
- `trainButtons` 236
- `techState` 266: Research, in four looks you can tell without reading: ready (wax seal), short of something (red ink, what is m…
- `lockedWhy` 278: why a step is locked, in a slot's few words: its age (as the Build menu says it), the step it needs (by its sh…
- `techBtn` 286
- `trainsAt` 307
- `keepAgeBtn` 311
- `statusOf` 326: what one of yours is doing, in words read from its state; and what it has done in its life
- `lifeText` 413
- `yieldText` 426: the math of a find or a field: what a worker takes a minute (the table's rate after research, soil and season)…
- `bonusText` 438: what lifts or lowers a find's take, named (Build 63, Albert: "show if something is getting a bonus"): the rese…
- `fxName` 464: the name of the research or building an effect came from (the effects carry no name of their own)
- `goodsText` 472
- `ownTech` 477: research this people can do: the others' elite ranks stay out of sight
- `fillOf` 478
- `need` 479
- `slotText` 485
- `qName` 486
- `foeNearest` 495: the side at war with you whose Town Center is nearest yours
- `knownPower` 512: the odds the computers use (17-ai.js): the square law on strength, bent by who counters whom, against their ar…
- `oddsText` 520

**`28-army-quick.js`** (407 lines): the army: who can be sent, how many, and the sends; the quick action

- `qsPool` 3: ── Attack with: on an enemy or a find card, from the whole army or one battalion, how many of each type, then go
- `qsPick` 5
- `qsHTML` 16
- `sendable` 59: guards keep to what they guard
- `ARMY_STILL` 63: What each soldier is doing, in one word (Albert, Build 42), worked out from the soldier alone: rally (just tra…
- `armyStatus` 64
- `idleSoldier` 76
- `free` 81: Rest: idle soldiers only, so a group on the march is never pulled off its way
- `freeWhy` 83: why nobody can be sent: nobody exists, or who is busy doing what
- `guardsOf` 94
- `guardRow` 96
- `showQuick` 112: ── The quick action (Albert, Nov 3: "a tap on the ground like a right click"): with units picked, a tap is the…
- `hideQuick` 130
- `quickGo` 134
- `ofKind` 145: ── The War Director (06-rules-tuning, DIRECT): a tap on a kind in the station's middle is its move, a hold its…
- `aimH` 146
- `drillOn` 150: a drill's shape on the ground (Albert, Nov 3: "form a line", "a semi circle or arc"): every soldier of S to it…
- `dress` 151
- `drillHold` 162: the x% by x% rule (FORMING.share): past that share of the drill's time, a soldier not that share of the way fr…
- `toolSet` 176: ── The choke and the ambush (Albert, Nov 3, 11:08: "allowing the player to use the land to pick a formation th…
- `chokeAt` 180
- `coverNear` 205: the ambush: the nearest cover to the tap (an open square with forest within AMBUSH.cover squares, looked for w…
- `ambushAt` 226
- `DIRECT_WHY` 245
- `DIRECTS` 246
- `DIRECT_OF` 307: the four kinds' moves: [tap, hold], with the word each says, and the sound
- `direct` 313
- `directWait` 325: the wait a kind's tap still has to sit out, in seconds (0 when it is ready): the archers' reload, the riders' …
- `SUGGEST` 329: what the game thinks fits a spot (Albert, Build 41): each reason scores a kind, the best one is marked and its…
- `suggestAt` 330
- `dialBtns` 380: The two dials of an army or one battalion (a: 'all' or its number): temper, and shape once Formations is resea…
- `musterGap` 389: ── Muster for a squad: what it still lacks, by soldier kind to train

**`29-card-pages.js`** (577 lines): what a building adds to its card: market, council, workshop and the rest

- `BLD_PAGE` 6: A building's card (MENU-SPEC §8): an info rank (what it holds or does, health, age), its line, its techs, Help…
- `factOf` 86: the first cell of a building's info rank: going up, burning, a wonder's clock, or what its kind says; else the…
- `slotsHTML` 97: A building's line (MENU-SPEC §3, §8): a fixed capacity, one single a place, the first working (its green ring …
- `relSides` 134: Relations, at the Town Center (v80, Albert Oct 31: "we are locking into the final"; picture Relations Final; d…
- `MISFITS` 135
- `relKey` 136: a row's key from a verb: a group's key, or a side's number
- `relLord` 138: a side whose stance is not yours to pick here: your vassal (their own page) or your overlord
- `relName` 139
- `stanceOff` 142: a stance this row cannot take, so its icon is dim and a tap on it picks nothing: your vassal or overlord (thei…
- `relOf` 143: the stance held now
- `giftLock` 144
- `relDraft` 146: what the row's ✓ would send: [gift or 0, stance or null], and why it cannot, or null
- `relPickOf` 153
- `relRow` 158
- `relStatus` 199: what the last ✓ touched will do, in a line; and the board: at peace or not, the Games, the Natives' regard
- `relHTML` 215
- `workshopPage` 253: a workshop turns what is in store into goods: the same page for every one of them
- `marketPage` 291: the Market (MENU-SPEC §8, picture Market Card; v80 keeps v70's layout, no new drawing): on the shared building…
- `keepMoreHTML` 318
- `vassalHTML` 353
- `stopHTML` 431
- `caravanHTML` 489
- `researchHTML` 522
- `setRow` 547: Setup (v80, Albert Oct 31, pictures Setup Stacked with Names, Setup Stacked): each setting its own rank, its n…
- `offOn` 548
- `SET_WHY` 549
- `settingsWhy` 565
- `pairRow` 568: two two-choice settings share a rank (Nov 3, Albert: the start page on one screen): name, its pair, name, its …
- `settingsHTML` 569

**`30-cards.js`** (844 lines): the CARDS table, one entry per card type, and renderCard

- `CARDS` 4: Each takes the card's description (G.card) and returns its page, or null when what it showed is gone.
- `GUIDE_PG` 796: the Guide's page, built once a page (CARDS.guide)
- `FULL` 797: the cards that take the whole height; the Army card with Battalions needs 11 ranks (E8)
- `SIZE_OF` 800: three sizes, one mold each (Albert, Build 63), counted in ranks in the style sheet: lg every rank that fits ab…
- `renderCard` 806

**`32-frame.js`** (713 lines): the frame: the bars, the preview and the mail, the page

- `SVG` 4: Every icon is drawn once, here
- `ICON` 5
- `cell` 160: One mold for every control: a cell is an icon spot and a word spot
- `wd` 161
- `topOf` 162
- `pic` 164
- `sym` 165
- `toGo` 166: the working ring: the share still to go, 1 when the work starts (MENU-SPEC §9)
- `AGE_SHORT` 168: the age in the strip: its name where it fits the 45 pt cell (measured
- `STATUS` 169
- `STATUS_CUT` 179: the strip has a cell for each of the tally's (Iron hidden in the Stone age: 7): the cells it lets go first, th…
- `buildPanel` 181
- `refresh` 211
- `muteBtn` 215
- `paceBtn` 220
- `setPause` 226
- `showEnd` 232: the end of a game: the sim says who won and why; the screen shows it
- `fit` 245: The page's own measures: how tall the orders are (the map's bottom edge) and where the map's middle sits betwe…
- `whoIs` 267: who a unit not yours belongs to, in a few words: a rival and how you stand, a misfit group and how you stand (…
- `MSG` 284: the mail keeps 30 lines, six a page (N13)
- `GROUPS` 285
- `MAIL_FILTERS` 296: the Mail card's filters after All (MENU-SPEC §8: six, one rank); the other groups show under All
- `QUIET` 297: quiet kinds never preview: they wait in the mail
- `urgentCls` 298
- `ccOf` 299: the colour code, from its one home
- `hiddenG` 300
- `news` 301
- `DIR8` 306: You know what you see, what your people hear, and what a messenger brings
- `dirOf` 307: which way a place lies, of eight
- `tell` 308
- `postTick` 337
- `say` 345
- `hushKey` 382: a line's kind: its words, the numbers aside (Raid 3 and Raid 5 are one kind)
- `MS_TEST` 384: the milestones' tests (words in MS_TEXT): each is a moment; the first time it is true it fires, once a game. {…
- `msFill` 400
- `milestoneTick` 404
- `goldTight` 423: gold short while another store is full
- `NEEDS` 424
- `advise` 435
- `SEASON_ICON` 501
- `WX_ICON` 502
- `uiAt` 503
- `txt` 504
- `FIRST` 511: Controls appear when their age comes (Build 59, Albert: hide by age)
- `firstAge` 512
- `resAge` 523
- `resOn` 524
- `ui` 525
- `linkOf` 683
- `shownMsg` 687: The preview (Build 64): the newest live line, or the question that hides its group; paused says so when nothin…
- `preview` 688

**`33-verbs.js`** (1130 lines): every button verb

- `ACT` 4: every button's verb, in one table
- `shut` 375: a job is locked until its age (32-frame, resOn): a tap on it says when it opens
- `PLAY` 377: orders that change the game: refused once it is over
- `act` 1025
- `L` 1037: Hints retire once learned: each counts the times you did what it teaches, kept on this phone; at 3 it is not s…
- `learn` 1038
- `learnAct` 1044
- `lpT` 1055
- `lpDone` 1056
- `lpAt` 1057
- `lpStop` 1058
- `TAPS` 1080: Tap counts (Build 59, from the Google audit): how often each button is used, and tapped while it could not act
- `tapCount` 1084

**`39-huddle.js`** (629 lines): the row below the map and its three pages, the War HUD's missions, the squad card

- `HUD` 8: The row (MENU-SPEC §6, Albert's drawings of Oct 30 and 31): one Formation two ranks tall, the same six columns…
- `mUnits` 16
- `sqUnits` 17
- `sqOut` 18: the squad is out on a mission
- `hostile` 19
- `foesNear` 25
- `powerSum` 30
- `chance` 32: the chance to win: the engine every odds line uses (power against power, the matchup of arms), as r²/(1+r²)
- `dpsOf` 36
- `wxWord` 37
- `paceWord` 39: a squad's pace in a word, from its slowest member (an elephant makes it slow, horse alone fast): what the squa…
- `hudPage` 45: ── the pages
- `kindOf` 56: the kind a class trains from the Train page, and fills a muster with: the first its building trains in this ag…
- `sqPlan` 60
- `aimSpot` 71: ── aiming: the crosshair, moved by a tap on the map while the War or Train page is open
- `aimNear` 79
- `aimAt` 83
- `aimColor` 94: the crosshair's colour says what is under it (Albert, Build 63): green yours, blue an ally, white nothing (nat…
- `hazardAt` 107
- `sqFree` 112: who a squad sends: its idle members; with no squads yet, every idle soldier
- `hudEta` 114: a squad's time to the crosshair (null: every idle soldier), kept for each squad until the target, the squad, t…
- `hudFire` 128: Go: a squad marches on the crosshair as one order and takes its slot (with no squads yet, every idle soldier t…
- `hudGo` 164: Go (✓ on War): every squad at home and ready (its blue ring) marches on the crosshair, each its own mission; w…
- `hudAbort` 170: a mission leaves: the soldiers go home, the slot is free
- `hudAbortAll` 178
- `hudHome` 182: Home: everyone back, every mission off
- `setRally` 188: Orders (the Train page): where new soldiers go when they are made, and which squad they join; ✓ on the crossha…
- `missionsTick` 197: ── each second: where a mission is, how it goes, what to say
- `reinforcePlan` 231: who can still reach a fight in time, fastest first, and how many it takes to even it: waves by arrival
- `waveLine` 259
- `hudJoin` 269: units moved into a mission (a reinforcement): they march to its middle and join its order
- `hudReinforce` 279
- `jobsPage` 289: ── the row: three pages on one mold
- `SMID` 311: what the station's middle shows
- `stationPage` 312
- `idleSoldiers` 352
- `ROWS` 353
- `rowUI` 356: the row on show, patched in place (a button under a finger stays the same button); the cycle button above slot…
- `drawReticle` 379: the reticle (mock 24): brackets, three turning chevrons, a scan line, a sonar ring and short scope lines; its …
- `INTENT` 451: ── the squad card (MENU-SPEC §8, picture Mission Flow): the squad builder while it is home, the live view whil…
- `intentsHTML` 457: the three intents, one chosen (its gold ring); it can change on the way
- `squadHomeHTML` 461: At home: the four kinds, each with how many the squad holds and − + under it (soldiers at home step in by them…
- `squadOutHTML` 488: Out: how it stands, what it lost, send more from the idle reserve, its shape and intent, where it is, Abort
- `YARD_LIST` 537: The Yard (Albert, Nov 3, preview 47 "Restore and Fix"): the staging ground
- `matchLog` 565: ── The match log (Albert, Nov 3, 22:34: "If I play a game can you analyze it?"; preview 49, preview only, YARD…
- `matchLogText` 595
- `copyLog` 600
- `fallbackCopy` 613

**`shell-head.html`** (273 lines): 

**`shell-tail.html`** (2 lines): 

### Sound

**`35-sound.js`** (479 lines): sound and haptics

- `SND` 4: Made in the phone from tones and noise: no files, nothing downloaded
- `saveSnd` 18
- `AC` 22
- `master` 23
- `NOISE` 24
- `voices` 25
- `panV` 26
- `sfxLast` 27
- `sink` 29: to the speakers; a sound from the left or right of the screen comes from that side
- `sndInit` 37
- `tone` 69
- `hiss` 88
- `MAT` 116: name: [least seconds between two, how to make it (v = loudness 0 to 1)] ── Materials (Build 56, after SoRen): …
- `knock` 141
- `SFX` 150
- `CHAN` 353: which of the three volumes each sound belongs to (everything else is an effect)
- `chanVol` 375
- `VOICES` 377: the voices are few (14): an alert always has one; ambience and effects give way when the air is full (Build 63…
- `voiceFree` 378: an alert never waits for a voice (C19)
- `sfx` 379
- `camH` 402: The ear is the camera, at a height (Albert, Build 64: "it should get quieter as I zoom out, with the real math")
- `hearing` 403
- `AMB` 411: Ambience as events (Build 64, "the game plays only what happens"): a bird sings from a tree you can see, by da…
- `ambT` 412
- `ambience` 413
- `thunder` 436: Thunder comes after the flash by the real delay (SOUND.c over SOUND.metre), quieter by the same law as every s…
- `APP` 447: ── Touch you can feel: one table of felt events, three strengths, never more often than every 50 ms
- `FEEL` 448
- `HAPTIC` 449
- `feltT` 466
- `feel` 467
- `onScreen` 478

## Words: every line the player reads

### Text

**`07-text.js`** (1212 lines): every line of wording the game says

- `slowPct` 3: how much slower a full cover of mud or snow makes a march, in percent
- `orList` 5: 'a, b or c'
- `investText` 7: the loyalty each of the lord's buildings buys near a vassal, by value, read from the table (F10: the hand list…
- `TITLE_SHORT` 20: Dates are "about" unless exact; where historians disagree the text says so
- `LEDGER_WORD` 32: the ledger's words (earn and spend, 08-core)
- `SCEN_TEXT` 56: the scenarios' words (SCENARIOS in 06)
- `WHY` 68
- `NEWS` 625: World news: a line from the rest of history now and then, matched to your age
- `SONG` 669: What each spectacle says: the warning, then the event itself why an event happened, under its line in the list…
- `MS_TEXT` 670
- `EV_WHY` 756
- `EV_TEXT` 775
- `HOLD_WORD` 797: the sword with nobody to send (28-army-quick)
- `ROW_WORD` 798
- `techWhy` 820: a research step's why: its own key first ('tech:' + id) where a unit shares its id (F4: one WHY.legion served …
- `tierLines` 822: the upgrade lines, read from the research table (F3): each unit and the ranks its research gives it, in order;…
- `TRIGGERS` 830: What triggers what: when, then, why

**`31-guide.js`** (270 lines): the Guide, written from the tables

- `guideModel` 2
- `guideHTML` 106
- `HIST_NOTE` 175: ── History (beta): the dated things of the game in order, searchable, each with a trail to the real source
- `HIST_ASK` 177
- `yearOf` 178
- `histRows` 187
- `histText` 194
- `histHTML` 195
- `guideMd` 211

## Minds: the computers and the natives: how the other sides think

### Minds

**`17-ai.js`** (781 lines): the computers' minds

- `powerFrom` 5: a side's strength: its soldiers, its towers, its people
- `estPower` 6
- `nearestType` 7
- `bestCounter` 10: the soldier that best answers what the enemies field, among those this side can train now
- `timeLeft` 35: T_left, the seconds to the bell
- `rateFrom` 38: what one more worker earns on r from home: the forager's rate R at the best free find it can walk to, walk and…
- `goalOf` 44: the goal: the first the personality wants of the next age, a building, an army (PERS.goals); its cost is what …
- `needOf` 66: For each resource: the hands on it (n), what one earns there now (rho, a second), the income (less its steady …
- `runsOut` 94: The reorder point (W6, the famine runway; and any resource a worker would leave): runway = (store − what the g…
- `famineNear` 101
- `PLOTS` 105: The shift to plots (Albert, answer 10): a field, a tree farm, a quarry, the Mint or a foundry is built, or a f…
- `PLOT_AT` 106: a plot goes 60 to 170 from the Town Center; judged at the middle of that band
- `plotPays` 107
- `peaceAll` 118: the army a side keeps: its ceiling, and at peace with every court the share it keeps when it stands down (N8: …
- `armyAim` 120
- `firstNeed` 122: the first step a wanted research waits on (D2: the lists name what they want; the steps before it are found, n…
- `think` 129
- `aiDiplomacy` 469: A computer's relations move by its odds, the way a court's did: losing badly, it asks for peace; at peace with…
- `allyDuty` 511: an ally defends a friend's town under attack, never at the cost of its own
- `armyCap` 524: the army a side keeps grows with its age
- `lootRun` 525
- `throneRun` 560: the Throne: from the Medieval age a side with siege and a big army marches on the citadel, or walks in as the …
- `wallPlan` 583
- `matchup` 612: how the two armies' units fare against each other: spearmen against horse, archers against spearmen
- `newWave` 626: a wave: how many set out, at whom, its mark (a building id or null: the Town Center), its best distance so far…
- `decideWar` 627
- `LEAGUE` 714: the leader's score against the next best: it forms above lead, and breaks up below release
- `leagueTick` 715
- `AB` 744: ── The A/B test of the computers (Albert, Nov 3, 11:10: "a b test this")
- `storesOf` 745
- `gapOnRoad` 747: the narrowest gap on the road: the point on the straight line to the foe where the open run across it is short…
- `chokeClaim` 765

**`38-natives.js`** (363 lines): the Natives and the Throne

- `throneB` 4: Regard is what they think of each side (0..100)
- `homeOf` 6: where a side or a group is found: the Natives at the Throne; a misfit group at its nearest camp (or its horde)…
- `natState` 7: what is the Natives' own: the handover, the raids, the garrison's regrowth
- `gangState` 9: Regard (answer 1b): each misfit group (GANG) keeps its own regard for each side, and its own stance with it (t…
- `regardOf` 18
- `addRegard` 19
- `gangSet` 25: a side's stance with a group is set: the Natives through the fifth side's relations, the others in their own l…
- `gangSync` 32: peace and war follow regard; an alliance needs an emissary and ends the moment regard falls under the line
- `giftsRecent` 59: gifts (bribes): the Danegeld rule, each buys less than the last within the window
- `giftGain` 60
- `giftWhy` 61
- `giveGift` 66
- `judgeGang` 82: an emissary to a group: the Natives' answer, copied for every misfit group (Albert, Nov 1; their own logic is …
- `gunAge` 101: the citadel's garrison: warriors in the yard, bowmen on the walls; it grows back while the Natives hold the Th…
- `garrisonMax` 102
- `natSpawn` 107
- `throneHold` 114
- `takeThrone` 116: the Throne changes hands: broken down, or sworn over by allied Natives; the walls and towers go with it, the g…
- `trapAt` 158: Traps: hidden buildings (pits, nets, stakes) of any side
- `layTraps` 164
- `trapsTick` 187
- `natRaid` 256: Outlaw raids: every few minutes the camp nearest the side they regard least sends robbers at one of its people…
- `nativesTick` 308

## Unfiled (name these in BOOKS, tests/index.py)

- `00-elements.js`

## Binder: the records the code points at

- `docs/2 Rules/SCIENCE.md`: every equation, its source and its code home
- `docs/2 Rules/COLORS.md`: every colour by name
- `docs/2 Rules/EXCEPTIONS.md`: every rule bent on purpose
- `docs/3 Locks/Decisions/00 Index.md`: every decision
- `docs/5 Builds/v80/CUTS.md`: every change and cut

## Elements: one card each (ELEMENTS, `src/00-elements.js`)

| element | acts | art | buildings | exempt | impacts | layers | logic | math | orders | pings |
|---|---|---|---|---|---|---|---|---|---|---|
| `gather` | `vilTick`, `makeNow`, `forage`, `bestNode`, `nearestNode`, `pickVil`, `setJob`, `leaveWork`, `waitAt`, `backToWork` | `person`, `WORKTOOL`, `LOOKS`, `drawUnit` | `keep`, `mill`, `lumber`, `mining`, `dock` | `lakeGrid`, `makeWater`, `drawFlood` | `food`, `wood`, `stone`, `gold`, `iron`, `bush`, `tree`, `fish` | `units` | `moveTo`, `astar`, `dropFor`, `carryOf`, `gatherMul`, `forageNow`, `findCap`, `crowd`, `unsafe`, `dangerWhy`, `SEARCH`, `REACH`, `WORK_R`, `RATE_OF`, `FORAGE`, `CARRY`, `SHELTER` | `forage`, `SEARCH`, `UPKEEP` | `job`, `sendvil`, `vstop`, `vfocus`, `vhome`, `idlego`, `pjob` | `popOf`, `freeVil` |

53 files, 1542 names, 1 cards.
