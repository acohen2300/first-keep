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

## D Measurements (the book `books/measure.js`)
Every measured number lives in `books/measure.js`, one entry a code, with its name, value, citation and law; INDEX.md shows it, INDEX-CITATIONS.md cross-checks it. Nothing here repeats a value. (Was "D Dimensions"; renamed Nov 5 for what it holds: sizes, times, prices, speeds, counts.)

## Y Year (time)
Y1 a day (D20) · Y2 a season (D21) · Y3 a year (D22) (four seasons; the old values, kept because they are clean). The clock runs from the map's making; Fast (D116) for testing.

## A Angles · C Colours
In `books/angles.js` and `books/colours.js`. The art's own paints stay inside the brushes; C is the game's palette, the owner's colour passed into every picture.

## W Mass · G Ground · P Sprites · H Hearing · SC Capabilities · N Citations
Each is a book in `books/`: W bodies, kit and materials in kilograms; G what is underfoot and its friction; P every look and its brush; H every sound as a recipe and which event plays it; SC every tick a shell may carry and what answers it; N every source, opened or still from memory.

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

## S Shell (one mold for everything you can tap; the rows live in `books/shells.js`, the ticks in `books/capabilities.js`)
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

## H Hearing → `books/sound.js` (a sound is a recipe of tones, noise and struck materials; QAX, QAY, QBX)

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
