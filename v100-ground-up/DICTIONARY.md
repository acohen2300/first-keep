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
Pointers: G1 (the site) → D1 · the board → D2 · Z1 → D3 · Z2 → D4 · Z3 → D5 · Z4 → D6 · play edge → D7 · Small → D8 · Standard → D9 · Medium → D10 · Large → D11
Floor 1 (set Nov 4 for the build; Albert to confirm): a tile → D12 · the land's height over the water → D13 · the sand's top → D14 · the dirt's top (grass above it) → D15 · a beach falls to the water over → D16 · a cliff falls over → D17 · the coast wanders in and out by → D18 · the sea is darkest this far out → D19
Time → Y
Floor 2 (set Nov 4 for the build; Albert to confirm): bare ground this high over the land → D23 · water deeper than this is not waded → D24 · lakes, how many → D25 · a lake's radius → D26 · a lake's depth at the middle → D27 · a shore's wander as a share of the radius → D28 · a river's depth → D29 · a river's half-width as a share of its lake's radius → D30 · a river's wander → D31 · a bank falls over → D32 · a ford's length → D33 · a stream's half-width → D34 · a stream's depth → D35 · hills, how many → D36 · a hill's radius → D37 · a hill's height → D38 · rocks, how many → D39 · a rock's radius → D40 · a rock's height → D41 · crevices, how many → D42 · a crevice's half-width → D43 · a crevice's floor → D44 · a crevice's length → D45 · a road's clear half-width → D46 · the middle kept clear → D47 · the woods' longest wave → D48 · the woods stand where the surface rises past → D49 · the forest wall round a home, from and to → D50 · the home pond's spot in the corner's frame → D51 · the home pond's radius → D52
Floor 3 (set Nov 4 for the build; Albert to confirm): a tree's wood → D53 · a bush's food → D54 · a gold pile → D55 · a stone pile → D56 · an iron pile → D57 · a ruin's stone → D58 · a campfire's food → D59 · a treasure's gold → D60 · the prices Z1 is sized from (QBJ; stand-ins from the genre, N69, until the Content pull): one age up → D61 · a villager → D62 · the mill → D63 · the lumber camp → D64 · a home → D65 · the barracks → D66 · villagers counted → D67 · homes counted → D68 · the margin → D69 · Z1's spots in the corner's frame → D70 · Z3's spots → D71 · Z3 holds this many times Z1 → D72 · Z4's gold piles → D73 · stone piles → D74 · iron piles → D75 · berry patches → D76 · bushes a patch → D77 · ruins → D78 · cemeteries → D79 · campfires → D80 · treasures → D81 · a thing's stand wanders in its tile by → D82 · under this many pixels a tile things are dots and the grid is off → D83
Floor 4 (set Nov 4 for the build; Albert to confirm): the Town Center's spot in the corner's frame, Z2 on the road → D84

## Y Year (time)
Y1 a day → D20 · Y2 a season → D21 · Y3 a year → D22 (four seasons; the old values, kept because they are clean)

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

## K Climate (layer 130; acts on everything below)
KH Host: KH1 Sun · KH2 Moon · KH3 Planets
KS Sky: KS1 Stars · KS2 Aurora · KS3 Meteors · KS4 Comets
KW Weather: KW1 Cloud · KW2 Rain · KW3 Snow · KW4 Sleet · KW5 Hail · KW6 Lightning (thunder its sound) · KW7 Fog · KW8 Mist
KI Impacts: KI1 Wet · KI2 Mud · KI3 Pooling · KI4 Flood · KI5 Frozen · KI6 Snow cover · KI7 Frost · KI8 Meltwater · KI9 Dust · KI10 Dry grass · KI11 Ash · KI12 Foot tracks · KI13 Animal tracks · KI14 Ruts
Mixes: Storm (KW1 + KW2 + KW6) · Deluge (heavy KW2) · Slush (KI6 + KI1) · Frozen mud (KI2 + KI5)

## S Shell (one mold for everything you can tap)
SA Attributes (numbers → D): Health · Speed · Capacity · Sight · Size · Style (Open or Closed) · Attack · Range · Rate · Armour · Nerve · Price · Time · Upkeep · Population · Amount · Yield (→ R)
SC Capabilities: Walk · Sail · Gather · Carry · Build · Repair · Fight · Shoot · Heal · Convert · Scout · Spy · Trade · Spawn · Research · Drop-off · House · Shelter (a unit may go in; a building holds) · Make
SP Personality: Bold · Steady · Wary
SM Commands (all get Select, Move, Home): Place · Focus · Squad · Formation · Stance · Shelter
Styles: Open (walkable over; a worker on it, or none) · Closed (blocks; a worker inside, or a garrison)
A building is a shell without Walk. Resources and gifts are shells with no walk, an amount and a yield.

## U Units (shells, layer 120)
UV Villager
UM Military: UM1 Foot · UM2 Archers · UM3 Riders · UM4 Engines (ram, catapult and their later forms)
US Support: US1 Priest · US2 Medic · US3 Spy · US4 Scout
UT Transport: UT1 Caravan · UT2 Camp wagon · UT3 Boat

## M Moveables (shells, layer 120; they come and go)
MH Hazards: MH1 Outlaws · MH2 Hordes · MH3 Robbers · MH4 Vagabonds · MH5 Wayfarers
MW Wildlife: MW1 Fish · MW2 Turkeys · MW3 Deer · MW4 Wolf · MW5 Fox · MW6 Bear
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

## Screen (held)
The control sheets 1 and 2 (v80), the Formation Templates and the Slot Kit (v70) in `mockups/` are a catalog of examples, not a spec. When the Screen floor starts, the forms in use get marked; the rest stay examples.
Type: UI Barlow Semi Condensed, display IM Fell English SC; two sizes, 14 and 18; one weight; slot 44, gap 6; timings 0.15, 0.4, 1.2, 2.4 s.

## Later
Behaviours, one rule a capability (most point at a Q) · shell values in three tiers · the Content pull (tech tree first) · the six formations defined · the "from memory" citations opened · the gather rates (floor 5) · a cemetery's gift · the war camps composed · the art's skins held in preview 49 (see Parked) · natives · the Throne and the middle · the Town Center's spot in Z2 · the camera rule (the play edge never under the controls) · water depth · fish as a resource · colours for T, R, M, B
