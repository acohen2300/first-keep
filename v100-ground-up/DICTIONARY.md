# First Keep v100 · the dictionary

Every thing has one code and one home. Numbers live in D, colours in C, angles in A, calculations in Q (CALCULATIONS.md). Everything else points there. Written Nov 4, 2026 with Albert, floor by floor.

## Layers, bottom up (by tens, nine open slots between each pair)
10 G1 Water · 20 G2 Sand · 30 G3 Dirt · 40 G4 Grass · 50 Z1 · 60 Z2 · 70 Z3 · 80 Z4 · 90 Terrain · 100 Non-movables (resources, gifts) · 110 Buildings · 120 Movables (units, wildlife, hazards, livestock) · 130 Climate (host, sky, weather) · 140 Display (fog of war, labels, rings, the view) · 150 Menu
Sound is its own track beside the stack. 100 to 120 are drawn together, sorted by depth: a villager behind a house is hidden by it.

## G Ground
G1 Water · G2 Sand · G3 Dirt · G4 Grass
The four are strata: water at 0, sand to D14, dirt to D15, grass above. A tile's top layer is whichever stratum its height reaches (L1). Cut lowers a tile's height, Raise lifts it; the layer that shows follows (L2, L3).

## Z Zones (measured from each corner of the board)
Z1 Pocket: resources for one age up, calculated: a few villagers, a mill, a lumber camp, a couple of homes, a barracks; gold, stone, trees, berries
Z2 Town: the Town Center stands here
Z3 Homestead: the clearing, more resources
Z4 The rest of the board: laid by the Randomizer (L13)

## D Dimensions (numbers only; things point here)
D1 3,060 · D2 2,160 · D3 0–300 · D4 300–600 · D5 600–900 · D6 900+ · D7 60 · D8 2×2 · D9 3×3 · D10 4×4 · D11 6×6
D12 10 · D13 24 · D14 12 · D15 20 · D16 80 · D17 4 · D18 24 · D19 60
D20 120 s · D21 180 s · D22 720 s
D23 12 · D24 4 · D25 3–6 · D26 50–160 · D27 12 · D28 0.25 · D29 8 · D30 0.25 · D31 80 · D32 40 · D33 40 · D34 6 · D35 2
D36 2–4 · D37 80–160 · D38 14 · D39 3–6 · D40 15–35 · D41 18 · D42 1–2 · D43 8 · D44 13 · D45 150–300 · D46 50 · D47 150
D48 500 · D49 0.1 · D50 920–1080 · D51 700, 450 · D52 50
D53 100 · D54 125 · D55 800 · D56 350 · D57 350 · D58 200 · D59 100 · D60 300
D61 500 · D62 50 · D63 100 · D64 100 · D65 25 · D66 175 · D67 6 · D68 2 · D69 0.25
D70 berries 250, 140 · grove 140, 250 · gold 200, 120 · stone 120, 200 · D71 berries 820, 300 · grove 300, 820 · iron 560, 680 · stone 450, 750 · gold 680, 560 · D72 3
D73 4–6 · D74 3–5 · D75 3–5 · D76 6–10 · D77 4–6 · D78 2 · D79 1–2 · D80 2–3 · D81 1–2 · D82 3 · D83 5
D84 380, 380
D85 11.7 · D86 walk 1.4 · trot 3.6 · horse 1.7 · push 0.7 · deer 1.5 · wolf 2.5 · bear 1.5 · D87 10 · D88 berries 0.9 · trees 0.75 · gold 0.6 · stone 0.55 · iron 0.5
D89 100 · D90 3–5 · D91 3–5 · D92 2–3 · D93 2–3 · D94 6 s · D95 60 · D96 6 · D97 0.4 s · D98 30
D117 unit 60 · building 100 · D118 0.75, 0.4 · D119 0.5 s · D120 3 · D121 0.45
D122 sides 0, 2 · D123 costs: Town Center 275 wood 100 stone · Home 25 wood · Mill, Lumber camp, Mining camp 100 wood · Farm 60 wood · Barracks, Range, Stable 175 wood · Siege workshop 200 wood 100 stone · Wall 5 stone · Gate 30 stone · Tower 50 wood 100 stone · Palisade 5 wood · Villager 50 food · Foot 60 food 20 wood · Archers 25 wood 45 gold · Riders 80 food 70 gold · Engines 160 wood 75 gold · Scout 80 food
D124 train: Villager 25 s · Foot 21 · Archers 35 · Riders 30 · Engines 36 · Scout 30 · D125 raise: Town Center 150 s · Home 25 · camps 35 · Farm 15 · Barracks, Range, Stable 50 · Siege workshop 40 · Wall 10 · Gate 70 · Tower 80 · Palisade 5 · D126 0.7 · D127 Town Center 10 · Home 5 · D128 200
D129 500 food, 200 gold, 90 s · D130 Camp · Village · Town · City · Kingdom · Empire · D131 1 food a day · D132 0.18 · D133 Town Center → Villager · Barracks → Foot · Range → Archers · Stable → Riders, Scout · Siege workshop → Engines · D134 900 s · D135 5, 5, 5, 10 · D136 0.4 · D137 60 s
D138 health, blow, reach, a blow every, armour, class, counters: Villager 25, 3, 1, 1.5 s, 0, foot · Foot 45, 8, 1, 1, 1, foot, counters horse · Archers 30, 5, 5, 2, 0, ranged, counters foot · Riders 100, 10, 1, 1.8, 2, horse, counters ranged · Engines 175, 4 (60 at a building), 1, 5, 3, siege · Scout 45, 3, 1, 2, 0, horse · Deer 20 · Wolf 40, 6 · Bear 150, 12, armour 1
D139 health: Town Center 2400 · Home 550 · camps 600 · Farm 480 · Barracks, Range, Stable 1200 · Siege workshop 1500 · Wall 1800 · Gate 2750 · Tower 1020 · Palisade 250 · D140 1.5 · D141 1.3 · D142 0.3 · D143 Tower 5, 8 tiles, 2 s · Town Center 5, 6, 2 · Camp tower 4, 6, 2 · D144 8 tiles · D145 1 s · D146 3 tiles · D147 2,500 tiles · D148 0.5 s
D149 2 s · D150 10, 16, 22, 28, 32, 36 · D151 by age, food · wood · gold · stone · iron: 55/45/0/0/0 · 45/35/15/5/0 · 40/30/20/10/0 · 35/30/20/10/5 · 35/30/20/10/5 · 30/30/20/10/10 · D152 4 · D153 12 tiles · D154 4, 8, 12, 16, 20, 24 · D155 0.6 · D156 60 s · D157 2 · D160 4 · D161 25 tiles · D162 0.25 s · D163 2.5 s · D164 64
D99 45° · D100 10, 22, 12, −6 °C · D101 6 °C · D102 0.12, 0.65 · D103 0.25 · D104 20 s · D105 50 s · D106 mud 0.8 · snow 0.6 · D107 0.03 · D108 0.004 · D109 200 °C·s · D110 240 s · D111 40 s · D112 0.34 s · D113 6 s · D114 1–2 · D115 40 · D116 ×8
Pointers: G1 (the site) → D1 · the board → D2 · Z1 → D3 · Z2 → D4 · Z3 → D5 · Z4 → D6 · play edge → D7 · Small → D8 · Standard → D9 · Medium → D10 · Large → D11
Floor 1 (set Nov 4 for the build; Albert to confirm): a tile → D12 · the land's height over the water → D13 · the sand's top → D14 · the dirt's top (grass above it) → D15 · a beach falls to the water over → D16 · a cliff falls over → D17 · the coast wanders in and out by → D18 · the sea is darkest this far out → D19
Time → Y
Floor 2 (set Nov 4 for the build; Albert to confirm): bare ground this high over the land → D23 · water deeper than this is not waded → D24 · lakes, how many → D25 · a lake's radius → D26 · a lake's depth at the middle → D27 · a shore's wander as a share of the radius → D28 · a river's depth → D29 · a river's half-width as a share of its lake's radius → D30 · a river's wander → D31 · a bank falls over → D32 · a ford's length → D33 · a stream's half-width → D34 · a stream's depth → D35 · hills, how many → D36 · a hill's radius → D37 · a hill's height → D38 · rocks, how many → D39 · a rock's radius → D40 · a rock's height → D41 · crevices, how many → D42 · a crevice's half-width → D43 · a crevice's floor → D44 · a crevice's length → D45 · a road's clear half-width → D46 · the middle kept clear → D47 · the woods' longest wave → D48 · the woods stand where the surface rises past → D49 · the forest wall round a home, from and to → D50 · the home pond's spot in the corner's frame → D51 · the home pond's radius → D52
Floor 3 (set Nov 4 for the build; Albert to confirm): a tree's wood → D53 · a bush's food → D54 · a gold pile → D55 · a stone pile → D56 · an iron pile → D57 · a ruin's stone → D58 · a campfire's food → D59 · a treasure's gold → D60 · the prices Z1 is sized from (QBJ; stand-ins from the genre, N69, until the Content pull): one age up → D61 · a villager → D62 · the mill → D63 · the lumber camp → D64 · a home → D65 · the barracks → D66 · villagers counted → D67 · homes counted → D68 · the margin → D69 · Z1's spots in the corner's frame → D70 · Z3's spots → D71 · Z3 holds this many times Z1 → D72 · Z4's gold piles → D73 · stone piles → D74 · iron piles → D75 · berry patches → D76 · bushes a patch → D77 · ruins → D78 · cemeteries → D79 · campfires → D80 · treasures → D81 · a thing's stand wanders in its tile by → D82 · under this many pixels a tile things are dots and the grid is off → D83
Floor 4 (set Nov 4 for the build; Albert to confirm): the Town Center's spot in the corner's frame, Z2 on the road → D84
Floor 5 (set Nov 4 for the build; Albert to confirm): units a metre, from the figure (21 units a person of 1.8 m) → D85 · speeds in metres a second (N71–N73) → D86 · a load → D87 · gathering a second, the old game's own (N70) → D88 · the next find within → D89 · deer herds → D90 · a herd → D91 · wolf packs → D92 · a pack → D93 · a wander's mean wait → D94 · its reach → D95 · walk frames a second → D96 · a work beat → D97 · frames a second → D98
Floor 6 (set Nov 4 for the build; Albert to confirm): the latitude (QA) → D99 · the seasons' mean air, spring to winter → D100 · the day's swing → D101 · P(wet | dry), P(wet | wet) an hour (QH, N7) → D102 · storms among wet hours → D103 · wet settles in (QP) → D104 · dries out in → D105 · walking costs of mud and snow (QN) → D106 · snow a second when it snows → D107 · melt a °C·s (QO) → D108 · ice bears a walker at this many freezing °C·s (QQ) → D109 · fog's wait (QM) → D110 · fog stays → D111 · between flashes (QL) → D112 · between strikes in a storm → D113 · marshy lakes → D114 · a marsh's width → D115 · Fast → D116
Floor 7 (set Nov 4 for the build; Albert to confirm): how far a unit and a building see → D117 · the fog's dark over the unseen and the remembered → D118 · the fog's beat → D119 · a shadow at most this many heights (QAT) → D120 · the blades' strength → D121
Floor 8, the menu (set Nov 5 for the build; Albert to confirm): the glass redraws every → D162 · a reason stays → D163 · woods chunks kept drawn → D164
Floor 9, the economy (set Nov 5; the genre's prices as stand-ins, N69, until the Content pull): the sides in play → D122 · what a thing costs → D123 · seconds to train → D124 · one villager's seconds to raise a site → D125 · n villagers raise it at n^this (QAC) → D126 · the people a building houses → D127 · the most people → D128 · an age's price: n × food, (n − 1) × gold, and its wait → D129 · the six ages → D130 · a unit's food a day (QBP) → D131 · move on when another find is this much nearer the drop-off (QW) → D132 · who trains whom → D133 · the bell (a game's length) → D134 · the score's divisors (QBR, N75) → D135 · a farm's food a second → D136 · a find no path reached is left alone for → D137
Floor 10, combat (set Nov 5; N69 stand-ins): a unit's health, blow, reach, pace, armour, class and counter → D138 · a building's health → D139 · a counter's edge (QBO) → D140 · a blow from behind (QBO) → D141 · a wave breaks under this share of its start (QBQ, N76) → D142 · what shoots: blow, reach, pace (QAL) → D143 · a soldier takes up a fight within → D144 · seconds between its path checks → D145 · wildlife bites within → D146 · tiles a chase may search → D147 · seconds between a soldier's looks around → D148
Floor 11, the computer (set Nov 5; balanced, from the A-rules audit): seconds between its rounds → D149 · villagers wanted by age → D150 · the share of villagers on each yield by age → D151 · a home goes up when fewer than this many places are left → D152 · a camp goes up when a job's find is farther than this from its drop-off → D153 · soldiers wanted by age → D154 · a wave goes at these Lanchester odds (QAF) → D155 · seconds a wave may make no progress before it goes home → D156 · villagers sent to a site → D157 · farms it keeps → D160 · farms when no bush stands within this of the hall → D161

## Y Year (time)
Y1 a day → D20 · Y2 a season → D21 · Y3 a year → D22 (four seasons; the old values, kept because they are clean). The clock runs from the map's making; Fast (D116) for testing.

## A Angles
A1 15°: the grid's turn on the screen
A2 30°: the camera's rise over the ground (set for floor 1: the genre's 2:1, sin 30° = ½; QBD)
A3 34°: the angle of repose, dry sand (QBE): a slope steeper than this is a face, not a slope

## C Colours
C1 Water #2a6488 · C2 Sand #cdbb88 · C3 Dirt #785c3a · C4 Grass #4a6634 (depth, faces and shade are tints of these, never new colours)
C5 Ring blue #6aaeff · C6 Ring green #5fd08a · C7 Ring red #ff6b5b · C8 Ring white #ece5d3 · C9 Background brown #2a1d13 · C10 Gold #e6b947 (on)
The art's paints (the building and node pictures pulled from preview 49) stay inside the pictures, as a picture's pixels do: 231 hex paints and 55 tints, in one block of the code, none used outside it. C is the game's palette; the owner's colour (C5–C8) is passed into every picture.

## L Logic
L1 Stack: G1 → G4, bottom up, as strata by height (D14, D15)
L2 Cut: lower the ground in a shape; the layer that shows follows
L3 Raise: lift the ground in a shape
L4 Edge: a gentle fall is a beach (the sand shows, D16); a fall steeper than the angle of repose (A3) is a face, the dirt shows (D17)
L5 Top rules: the top layer decides walk, build, sail
L6 Play edge: nothing played within D7 of the coast
L7 Downward only: a layer acts on those below, never reads above; climate reaches G1
L8 One home: every number lives in D
L9 Unbound: anything may point to any D, A or C; change flows one way: change the source and its users follow; a user never changes the source, only re-points
L10 Mixes, not new things: a combination is two states together
L11 Zones are rules, not ground
L12 Same at home, varied beyond: Z1 to Z3 identical in every corner; the coast too, within 900 of a corner
L13 Randomizer: a strict rule; one seed (QBF); it picks only within the rules; a roll is written only when Who, What, Where, When, Why and How stand beside it; a blank means it is not built
L14 Light: ground leaning toward the light is lit, leaning away shaded (relief); the light stands high, left and in front until Climate brings the sun

## T Terrain (layer 90; floor 2)
TC Cut: TC1 Lake (a bowl, D27, inside a fractal shore, QAZ; sizes on the power law, QBA; cliff where the land stands out into it, QBG) · TC2 River (from a lake to the free coast, wandering, QAZ; width with the lake, QBB) · TC3 Stream (from a hill to the nearest lake, wadeable) · TC4 Shallows (a ford: the bed raised to wading depth wherever a river crosses a road, and once more) · TC5 Crevice (a dry trench cut to D44; both walls faces, so nothing crosses)
A cliff is any cut with a fall steeper than A3 (L4): not a terrain of its own.
TW Wet: TW1 Marsh (always Wet, KI1; built with Climate)
TR Raise: TR1 Hills (a smooth dome, D38, its slope under A3) · TR2 Rock (raised D41 in one step, every edge a face; its top bare, D23)
TF Forest: TF1 Forest (where the trees grow: a wall round every home at D50 with the road through it, and patches over Z4 where a rolled surface rises past D49; never on water, slopes or roads; the trees come on floor 3)
Placement: Z1 and Z2 clean; Z3 one pond at D51, the same in every corner; the four roads (corner to middle, D46) and the middle (D47) kept clear; Z4 by the Randomizer with its six answers beside each roll (L13)

## K Climate (layer 130; acts on everything below; floor 6)
One sky over the whole board (it is 185 m across, so one weather). The clock is Y. Each hour of the day (its 24th) the rain is drawn by a two-state chain (QH, D102); a wet hour is a storm by D103; snow falls instead at or under 1 °C (QI). The air is the season's mean (D100) eased into the next, plus the day's swing (D101) by the light.
KH Host: KH1 Sun (QA at D99: its height sets the light by SoRen's ramp with the twilights at −6°, −12°, −18°, QD; night a blue over all, the horizon's warmth within 8° of it) · KH2 Moon · KH3 Planets (nowhere to show yet: the board fills the screen; held)
KS Sky: KS1 Stars · KS2 Aurora · KS3 Meteors · KS4 Comets (held with the Host: no horizon)
KW Weather: KW1 Cloud (a quarter off the light while it rains or snows) · KW2 Rain (drops of Marshall–Palmer sizes at Atlas's speeds, QJ) · KW3 Snow · KW4 Sleet · KW5 Hail · KW6 Lightning (strikes on Poisson waits in a storm, D113; SoRen's bolt, three strokes and a fork or two, pinned to the ground it hits, its foot lit; a flash never within D112 of the last, QL; thunder its sound) · KW7 Fog (on a Poisson wait, D110, for D111) · KW8 Mist (after rain, at dawn and dusk)
KI Impacts: KI1 Wet (settles in over D104, out over D105, QP; the land darkens) · KI2 Mud (a walker slows by D106, QN; the marsh always) · KI3 Pooling · KI4 Flood · KI5 Frozen (ice on the inland water when the freezing degree-seconds pass D109, QQ: walked as flat ground, whitened) · KI6 Snow cover (D107 a second; melts by the degree-day, D108, QO, twice as fast in rain; whitens the land; slows a walker) · KI8 Frost · KI9 Meltwater · KI10 Dust · KI11 Dry grass · KI12 Ash · KI13 Foot tracks · KI14 Animal tracks · KI15 Ruts
Mixes: Storm (KW1+KW2+KW6) · Deluge (heavy KW2) · Slush (KI6+KI1) · Frozen mud (KI2+KI5)
Held for later: KW4, KW5, KI3, KI4, KI8–KI15, the sound of thunder, fire from a strike (QT, QU), sight in fog (QK, the Display floor). Cut: wind, the eclipse.

## S Shell (one mold for everything you can tap)
SA Attributes (numbers → D): Health · Speed · Capacity · Sight · Size · Style (Open or Closed) · Attack · Range · Rate · Armour · Nerve · Price · Time · Upkeep · Population · Amount · Yield (→ R)
SC Capabilities: Walk · Sail · Gather · Carry · Build · Repair · Fight · Shoot · Heal · Convert · Scout · Spy · Trade · Spawn · Research · Drop-off · House · Shelter (a unit may go in; a building holds) · Make
SP Personality: Bold · Steady · Wary
SM Commands (all get Select, Move, Home): Place · Focus · Squad · Formation · Stance · Shelter
Styles: Open (walkable over; a worker on it, or none) · Closed (blocks; a worker inside, or a garrison)
A building is a shell without Walk. Resources and gifts are shells with no walk, an amount and a yield.

## U Units (shells, layer 120; floor 5)
UV Villager (look vil; Speed walk; Capacity D87; Gather at D88 by the find's kind, to the nearest Drop-off of its side, then back; the next find within D89)
UM Military: UM1 Foot (spear) · UM2 Archers (archer) · UM3 Riders (cata; Speed trot) · UM4 Engines (ram, catapult; Speed push; their later forms with the Content pull)
US Support: US1 Priest · US2 Medic · US3 Spy · US4 Scout (all walk)
UT Transport: UT1 Caravan · UT2 Camp wagon (Speed horse) · UT3 Boat (no picture yet; Sail comes with water)
Speed: D86 in metres a second × D85. Health, Sight, Attack and the rest come with the three tiers. The figures are preview 49's (18-figures.js), one look a code; the rest of its roster is held there as skins.
Walking (QBL): tile to tile by A*, eight ways; land and fords are walked, a thing, a closed building and a step past A3 are not (L5).
At start: D67 villagers round every Town Center (L12), the player's at corner 0 (C5), the computers' at the others (C6–C8).

## M Moveables (shells, layer 120; they come and go)
MH Hazards: MH1 Outlaws · MH2 Hordes · MH3 Robbers · MH4 Vagabonds · MH5 Wayfarers
MW Wildlife: MW1 Fish · MW2 Turkeys · MW3 Deer (look deer; D90, D91 herds in Z4) · MW4 Wolf (wolf; D92, D93 packs) · MW5 Fox · MW6 Bear (bear) · wildlife wanders: a Poisson wait (QM, D94), then a walk within D95; MW2 and MW5 have no pictures yet
MH looks: MH1 bandit · MH3 robber · MH4 vagabond · MH5 wayfarer (MH2 a band of MH1); none placed yet, they arrive as events (floor 6)
ML Livestock: ML1 Sheep (wool; lamb for meat) · ML2 Cattle (milk, meat)
MG Gifts (layer 100; floor 3 places MG1–MG4 in Z4 by the dice, D78–D81): MG1 Ruins (yield stone → D58: old stone is quarried, as the Middle Ages quarried Rome) · MG2 Cemeteries (no yield yet) · MG3 Campfires (yield food → D59) · MG4 Treasure (yield gold → D60) · MG5 Booty · MG6 Stolen goods (MG5, MG6 come from the hazards, floor 5)

## R Resources (shells, layer 100)
R1 Trees (yield wood, amount D53; one on every tile of woods, TF1, and in the groves) · R2 Gold (gold, D55) · R3 Stone (stone, D56) · R4 Iron (iron, D57) · R5 Berries (food, D54)
Where (floor 3): Z1 a berry patch, a grove, one gold, one stone at D70, counts from QBJ · Z3 the same at D71, D72 times, with iron · Z4 by the dice, D73–D77 · the same in every corner (L12) · a thing stands on one flat tile of land, its stand wandering by D82; a pile takes the tiles under it

## B Buildings (shells without Walk, layer 110; floor 4)
Each: a size in tiles (D8–D11; a wall piece one tile, D12) · Open or Closed · the picture it wears (preview 49's art, pulled Nov 4). Health, prices and times come with the Content pull.
BTC Anchors: BTC1 Town Center (Large, Closed) · BTC2 Castle (Large) · BTC3 War camp large · BTC4 War camp small (compositions of the parts below with BW4 and BF5: no second copies; composed later) · BTC5 Medical tent (Small) · BTC6 Training tent (Small) · BTC7 Mess tent (Small) · BTC8 Camp tower (Small)
BR Residential: BR1 Home (Small) · BR2 Apartment (Standard)
BC Commercial: BCR1 Market (Standard, Open) · BCR2 Tavern (Small) · BCL1 Farm (Standard, Open) · BCL2 Tree farm (Standard, Open) · BCL3 Pasture (Standard, Open) · BCL4 Quarry (Standard, Open) · BCT1 Trade post (Small, Open) · BCT2 Dock (Small, Open)
BP Public: BP1 School (Standard) · BP2 Library (Medium) · BP3 Temple (Medium) · BP4 Baths (Standard) · BP5 Theatre (Medium) · BP6 Hospital (Standard) · BP7 Aqueduct (Standard) · BP8 Courthouse (Standard) · BP9 Hall (Standard) · BP10 War Council (Standard)
BI Industry: BI1 Mill (Standard) · BI2 Lumber camp (Standard) · BI3 Mining camp (Standard) · BI4 Store (Standard) · BI5 Depot (Small) · BI6 Mint (Standard) · BI7 Foundry (Standard) · BI8 Workshop (Standard) · BI9 Smith (Standard)
BM Military: BM1 Barracks (Medium) · BM2 Range (Medium, Open) · BM3 Stable (Medium) · BM4 Siege workshop (Medium)
BW Walls and towers: BW1 Wall · BW2 Gate · BW4 Palisade (one tile each, laid as lines) · BW3 Tower (Small)
BF Field defences (untested; merge held): BF1 Pit · BF2 Net · BF3 Stakes · BF4 Caltrops (no pictures yet) · BF5 Abatis (one tile)
BS Special: BS1 Throne (Large) · BS2 Wonder (Large)
Sizes: Small (D8) · Standard (D9) · Medium (D10) · Large (D11). Closed by default; Open where marked.
Where (floor 4): the Town Center in Z2 on the road at D84, the same in every corner (L12). Everything else is placed by the player (the Menu floor); until then the Build toggle places the picked building on a tap and removes one on a tap, for fit and look.
Stands on: n × n flat, free tiles of land at one height; Closed takes them, Open leaves them walkable (L5).

## Forms (first fill, Albert to mark up)
Villager: Walk Gather Carry Build Repair Shelter | Wary | Place Focus Shelter
Foot: Walk Fight Shelter | Steady | Place Squad Formation Stance Shelter
Archers: Walk Shoot Shelter | Steady | Place Squad Formation Stance Shelter
Riders: Walk Fight | Bold | Place Squad Formation Stance
Engines: Walk Shoot (at buildings) | Steady | Place Squad Stance
Priest: Walk Heal Convert Shelter | Wary | Place Squad
Medic: Walk Heal Shelter | Wary | Squad
Spy: Walk Spy Shelter | Wary | Place
Scout: Walk Scout | Wary | Place
Caravan: Walk Carry Trade | Wary
Camp wagon: Walk Carry Build | Wary | Place
Boat: Sail Carry | Wary | Place
Wolf: Walk Fight | Bold · Bear: Walk Fight | Steady · Fox: Walk Fight | Wary · Deer, Turkeys: Walk | Wary
Sheep, Cattle: Walk | Wary | Select Move · Outlaws, Robbers: Walk Fight Carry | Bold · Hordes: Walk Fight | Bold
Vagabonds: Walk Carry | Wary · Wayfarers: Walk Trade | Wary
Fish: Amount, Yield food, Spawn (regrows each spring, QY)
Town Center: Spawn Research Drop-off House Shelter Shoot · Tower: Shoot Shelter · Mill: Drop-off · Mint: Make

## H Hearing (a sound is a material struck, synthesized; QAY)
HM Materials: Wood · Stone · Metal
HA Ambient: Birds · Crickets · Water · Rain · Thunder
HW Work: Hammer · Chop · Mine · Coin
HC Combat: Clash · Arrow · Hooves · Crash · Horn
HU Interface: Tap · Place · Error · Done · New age

## Formations (names only; defined later)
Line · Wedge · Square · Front · Choke · Support · the march in Column

## V View (layer 140; floor 7)
Fog of war: every tile is unseen, remembered or in sight; the player's units see D117, its buildings further by their size; fog in the air (KW7) shortens sight (QK); the unseen dark and the remembered dim by D118; the sea is never fogged; another side's unit shows only in sight. Drawn as one picture a tile a pixel, laid on the ground by one affine (QBD).
Shadows (QAT): a building's box and a unit's foot thrown by the sun's height, capped at D120 heights; left at sunrise, up at noon (the camera looks north), right at sunset; they fade with the light.
Rings: every unit stands in a ring of its side's colour (C5–C8); the picked one in gold (C10).
The grass: a 64-unit tile of blades in two tints of C4, baked on the grass (D121); the tile seams closed.
The camera: the board never leaves the screen's middle (the camera rule); pinch and wheel zoom about the pointer; Fit on a new map.
Held for later: labels, the small map, ripples and rain rings on water, clouds' shadows, sight from height (QAL) and the woods blocking sight (QAM), many eyes (QAN).

## Screen (floor 8: menu.js, alone)
One cell mold: slot 44, gap 6, UI Barlow Semi Condensed 13, display IM Fell English SC 18, the bar's colours (C). Four tabs along the bottom (Layers · Jobs · Build · War), one page above the bar, one card above the page for the subject (a unit, a building, a find: title, facts, actions), a reason at the top when a dim cell is tapped.
Layers: a row a code (G Grid · Z Zones · T Things · R Rim · B Buildings · U Units · K Climate · V View) with Show and Lock; Fast and New below. Lock is a mark for us, kept on the phone; no floor is locked yet (floors 1–2 lock after the artistic polish).
Jobs: People held / room · 🔨 raising · idle; a row a yield with its count, ★ the rally job (new villagers take it), − and + (the nearest idle villager to the yield's best find, QW); the age and Age up.
Build: a group (Town · Camps · Army · Walls), the strip of its buildings with prices (dim when unpaid); a pick raises a ghost that follows a press-and-slide on the map, green where it may stand, red where not; Build pays and sends a villager, Cancel drops it.
War: Soldiers held and whether a wave is out · Set target (the next tap on the map aims the crosshair) · Attack (every idle soldier marches, fighting what it meets, QAG) · Recall (home).
Doors: read() is the one window the glass draws from; act(verb, arg) the one way it acts, through VERBS, where every verb carries its own whyNot; a dim cell never runs, it only says why.
Held: the small map, labels, formations.

## Screen mockups (held)
The control sheets 1 and 2 (v80), the Formation Templates and the Slot Kit (v70) in `mockups/` are a catalog of examples, not a spec. When the Screen floor starts, the forms in use get marked; the rest stay examples.
Type: UI Barlow Semi Condensed, display IM Fell English SC; two sizes, 14 and 18; one weight; slot 44, gap 6; timings 0.15, 0.4, 1.2, 2.4 s.

## Later (kept, to be rebuilt clean after the core)
The Throne and the great lake, reimagined (the middle stays clear until Albert describes them) · diplomacy, vassals, the Games, crowns, the peace age · hunting (the deer stand, no one hunts them yet) · shelter in storms · the walls' gates · the Camp buildings (BTC5–8) · Priest, Medic, Spy, Caravan, Camp wagon · the outlaws · the Market and prices (QAE) · spoilage · the tech tree (the Content pull) · the computer's personalities beyond balanced, and Easy/Hard · the player's choice of corner and more than one computer.

## Later
Labels and the small map · ripples · Behaviours, one rule a capability (most point at a Q) · shell values in three tiers · the Content pull (tech tree first) · the six formations defined · the "from memory" citations opened · the gather rates (floor 5) · a cemetery's gift · the war camps composed · the art's skins held in preview 49 (see Parked) · fight, hunt and flee (QAF–QAO) · hazards as events · livestock and boats · natives · the Throne and the middle · the Town Center's spot in Z2 · the camera rule (the play edge never under the controls) · water depth · fish as a resource · colours for T, R, M, B
