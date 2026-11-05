# First Keep v100 · 4. the Comments

Written by `index.py` from `books/comments.js`, never by hand: every why, by its code, and where the code names it.

| Code | In | Why |
|---|---|---|
| E1 | index.html#frames | First Keep v100 · the world reads its numbers from the Books (books/*.js), never from here: one home each. |
| E2 | index.html#frames | A Book entry is { key, value, name, cite, law } under its code; the game sees each book as one object by key (D, A, C, W, G), and a shell's slot points at a code (D53, D86.walk). |
| E3 | index.html#frames | every code in every book |
| E4 | index.html#frames | a slot's pointer, read |
| E5 | index.html#frames | S the shells (books/shells.js): a row names its layer, ticks its capabilities (SC) and points each slot at a book. has() is the one way the code asks what a thing can do. |
| E6 | index.html#the-frames | The frames (QBD). The grid is square in its own frame; the board frame is the grid turned A1 about the site's middle; the view foreshortens depth by sin A2 and shows height by cos A2. |
| E7 | index.html#the-frames | QBE: the most a tile may step up or down over its own width and still be a slope |
| E8 | index.html#the-frames | QBK the art frame: a building is painted with its front along x and sheared by SKEW so that edge follows the grid; its depth is ART_T a unit of width, the back standing ART_S of that to the right |
| E9 | index.html#qbf-the-dice | QBF the dice (N65): one seed, Mulberry32. Every roll names Who, What, Where, When, Why and How beside it (L13). |
| E10 | index.html#qbf-the-dice | two streams from the map's seed, dealt fresh at makeUnits: the rules' (M1), so the same seed plays the same game, and the looks' (D187), so a look never shifts a rule roll |
| E11 | index.html#qbf-the-dice | QAZ a fractal line (N60): K waves, the k-th of amplitude k^(−H), H = 2 − Dim; a coast's Dim is about 1.25. Returns a function of the way along, in radians, giving −1 to 1. |
| E12 | index.html#qbf-the-dice | QAZ as a surface: K plane waves in rolled directions, the same amplitudes; scale is the longest wave in units. Returns a function of (x, y) giving about −1 to 1. |
| E13 | index.html#the-coast | The coast (L2 Cut at the board's edge; L4 Edge). Where it stands out it is a headland and a cliff, where it bends in a bay and a beach (QBG). |
| E14 | index.html#the-coast | The roll: Who the map · What how far the coast wanders in and out · Where the coast only; within D5 of every corner the same wander (L12), free along the middle of each side · When the map is made · Why no two maps share a coast, and every home gets the same one · How QAZ on the dice. |
| E15 | index.html#the-coast | pos: the way along the side from its start; returns [wander, cliffness] |
| E16 | index.html#the-coast | −1 bay to 1 headland |
| E17 | index.html#the-ground | The ground: one height a tile. Depth is the way in from the coast (negative at sea). Land stands at D13; a beach falls to the water over D16, a cliff over D17 (L4); the sea deepens with distance. The stratum a tile shows is whichever its height reaches (L1). |
| E18 | index.html#the-ground | height, depth from the coast, the four drawn corner heights, the forest floor |
| E19 | index.html#the-ground | marsh (TW1): always wet (KI1) |
| E20 | index.html#the-ground | the way in from the coast at a board point, and the coast's cliffness there |
| E21 | index.html#the-ground | the drawn corners (QBE): at every grid corner the tiles round it are sorted by height and split where a step passes the angle of repose; each group shares one height, so a slope meets without a crack and a face stands where it should |
| E22 | index.html#floor-2-terrain | Floor 2, terrain (layer 90): every piece is a Cut or a Raise on the one height field (L2, L3); the layer that shows follows (L1), a step past the angle of repose is a face (QBE). |
| E23 | index.html#floor-2-terrain | a spot in a corner's own frame (u along one edge, v along the other), the same in all four (L12) |
| E24 | index.html#floor-2-terrain | the four roads: corner to middle |
| E25 | index.html#floor-2-terrain | every tile whose middle lies within r of a board point: fn(k, d, dx, dy) |
| E26 | index.html#floor-2-terrain | a lake: a bowl (deep at the middle, D27) inside a fractal shore (QAZ, D28); where the land stands out into it the shore is a face, where it bends back a bank (QBG); a lake's bank falls over D32, the sea's beach over D16 (L4) |
| E27 | index.html#floor-2-terrain | a wandering line (QAZ) from a to b, pinned at both ends; null when any point fails ok |
| E28 | index.html#floor-2-terrain | a channel: discs along a line; w the half-width, deep the bed; the bank falls over D32 |
| E29 | index.html#floor-2-terrain | a smooth hill: its steepest slope is 0.77 h / r, under the angle of repose at these numbers |
| E30 | index.html#floor-2-terrain | The home pond: Who every corner · What one small lake · Where Z3, the same spot in each corner's own frame (D51, D52, L12) · When the map is made · Why a home has water to fish and to sail, and the same water for all · How one shore rolled once (QAZ), shared |
| E31 | index.html#floor-2-terrain | Lakes: Who the map · What their number, size and place · Where Z4, off the roads and the middle, inside the play edge · When the map is made · Why no two maps share their water · How a count between D25, sizes on the power law of lakes (QBA, Pareto draw), places uniform, each shore QAZ |
| E32 | index.html#floor-2-terrain | Rivers: Who the map · What one from each lake big enough, to the nearest free coast · Where Z4 only; a river never enters a home (L12) · When the map is made · Why water that moves, a way to sail out, a line to hold · How the path wanders (QAZ), the width grows with the lake (QBB) |
| E33 | index.html#floor-2-terrain | Fords (TC4): Who every river · What a shallow crossing · Where wherever a river crosses one of the four roads, and once more at a rolled spot · When with the river · Why towns grew at fords: a road meets water where it can be waded · How the bed raised to wading depth over D33 |
| E34 | index.html#floor-2-terrain | Hills (TR1): Who the map · What a few smooth rises · Where Z4, clear of water and roads · When the map is made · Why high ground to hold and to see from · How count D36, radius D37, a dome of D38 |
| E35 | index.html#floor-2-terrain | Streams (TC3): Who each hill · What a thin, wadeable run to the nearest lake · Where Z4 · When with the hills · Why water springs where ground rises · How a channel of D34 by D35 |
| E36 | index.html#floor-2-terrain | Rock (TR2): Who the map · What outcrops nothing walks over or through · Where Z4, on dry land, off the roads · When the map is made · Why cover and chokepoints inland · How count D39, radius D40, raised D41 in one step so every edge is a face (QBE); its top is bare (D23) |
| E37 | index.html#floor-2-terrain | Crevices (TC5): Who the map · What a dry trench nothing crosses · Where Z4, off the roads and water · When the map is made · Why a line that cannot be walked, without water · How count D42, a wandering line of D45, cut to D44 so both walls are faces |
| E38 | index.html#floor-2-terrain | Forest (TF1): Who the map · What where the trees grow (the trees themselves come on floor 3) · Where a wall round every home at D50 with the road through it (the same for all, L12), and patches over Z4 by a rolled surface; never on water, slopes or roads · When the map is made · Why woods to cut, to hide in, to go round · How QAZ as a surface, scale D48, standing where it rises past D49 |
| E39 | index.html#floor-2-terrain | the wood's edge keeps one tile from any slope or water |
| E40 | index.html#floor-3-non-movables | Floor 3, non-movables (layer 100): shells with no Walk, an Amount and a Yield (S). Each stands on one flat tile of land; a big one takes the tiles under it. Nothing here moves; floor 5 takes from the amounts. |
| E41 | index.html#floor-3-non-movables | the finds (layer 100), from their shells: kind → code, yield, amount, the ground kept clear |
| E42 | index.html#floor-3-non-movables | QBJ Z1's store, from what one age up costs (Albert's rule): food for the age and the villagers, wood for the mill, the lumber camp, the homes and the barracks, each with a margin (D61–D69) |
| E43 | index.html#floor-3-non-movables | what stands on each tile, and the shells themselves |
| E44 | index.html#floor-3-non-movables | the free tile nearest a spot |
| E45 | index.html#floor-3-non-movables | a shell on a tile; its stand wanders within the tile by D82 on the dice, so no wood is a grid |
| E46 | index.html#floor-3-non-movables | the n free tiles nearest a spot: a grove (marked as woods, the trees follow) or a berry patch |
| E47 | index.html#floor-3-non-movables | The home finds: Who every corner · What Z1's berries, grove, gold and stone, sized by QBJ; Z3's the same at D72 times, with iron · Where fixed spots in the corner's frame (D70, D71), the same in all four (L12) · When the map is made · Why every player starts with the same ground and the same means to the next age · How one home dice (QBF), restarted at each corner, so the four are alike to the stand of each bush |
| E48 | index.html#floor-3-non-movables | Z4's finds: Who the map · What piles of gold, stone and iron, berry patches, and the gifts: ruins, cemeteries, campfires, treasure · Where Z4, on flat free land, off the roads, the middle and the play edge · When the map is made · Why the game beyond the homestead is to be found, not known · How counts D73–D81, places uniform until one is clear, each a roll |
| E49 | index.html#floor-3-non-movables | The trees: Who every tile of woods (TF1, and the groves) · What one tree, its stand, size and shade · Where its tile · When the map is made · Why the woods are what is cut for wood (R1) · How three rolls a tile |
| E50 | index.html#floor-3-non-movables | drawn back to front |
| E51 | index.html#floor-3-non-movables | a tree with trees on all eight sides is deep: nothing can stand between it and its neighbours, so the deep woods are painted once a chunk (see the woods cache) |
| E52 | index.html#floor-3-non-movables | 0 water, 1 sand, 2 dirt, 3 grass; bare dirt again high over the land (D23) |
| E53 | index.html#floor-3-non-movables | the first band is what can be waded (D24) |
| E54 | index.html#floor-3-non-movables | the forest floor: the grass, shaded; the marsh: the grass, toward the water |
| E55 | index.html#floor-3-non-movables | what a face shows between two heights (L1): the grass is the land's top skin; anything raised above it shows bare earth |
| E56 | index.html#drawn-once-in-the-view-frame | Drawn once in the view frame: every tile a lifted quad, a face where it steps down toward the camera. Then every frame is one picture, moved and scaled. |
| E57 | index.html#drawn-once-in-the-view-frame | the masks at a quarter scale: the land in white and in shadow, the inland water |
| E58 | index.html#drawn-once-in-the-view-frame | a quad a, b, c, d (top-left round to bottom-left on the screen) grown half a pixel right and down, so the next tile's edge lands on solid paint and no seam shows |
| E59 | index.html#drawn-once-in-the-view-frame | the grass's blades: one 64-unit tile of short strokes in two tints of C4, repeated (preview 49's) |
| E60 | index.html#drawn-once-in-the-view-frame | the light stands high to the left and in front: ground leaning that way is lit, ground leaning away is shaded, 3% a unit of lean over a tile |
| E61 | index.html#drawn-once-in-the-view-frame | runs: flat tiles of one colour in a row drawn as one quad (no seams, few fills) |
| E62 | index.html#drawn-once-in-the-view-frame | faces: the +y edge and the +x edge face the camera (the turn is under 45°) |
| E63 | index.html#the-view | The view (layer 140): one camera, drag to pan, pinch or wheel to zoom; the overlays are drawn each frame over the one picture. |
| E64 | index.html#the-view | one flag a layer code (the panel, floor 8) and Fast |
| E65 | index.html#the-door | The door (floor 8): the modules (menu, econ, combat, ai) hang on these hooks and read the world through FK; nothing else of theirs touches this file |
| E66 | index.html#the-door | event: a named happening (a blow, a drop, a raise) that the sound and the feel answer, by the names in books/sound.js HE1 |
| E67 | index.html#the-door | a slow beat's turn (D182–D184): the step whose seconds played cross it, its phase in Mid's frames (D98) |
| E68 | index.html#the-door | the screen jolts with a heavy impact (QBT) |
| E69 | index.html#the-door | the walking grid, at the land's height, clipped to the played ground: the coast's line brought D7 in (L6) |
| E70 | index.html#the-door | Z1 to Z4 from each corner (D3 to D6), at the land's height (L11: a rule drawn on the ground, not ground) |
| E71 | index.html#the-brushes | The brushes (preview 49, 18-figures.js): a polygon, an ellipse, a line, two gradients; g is the canvas being painted |
| E72 | index.html#the-building-art | The building art (preview 49, 19-building-art.js; Nov 3, the last build before the camera turn): every piece drawn from its own point lists, in units, feet at (0, 0), the front edge along x, the back up and to the right. Research tiers, ages, civs, seasons and flags are cut. |
| E73 | index.html#the-building-art | a building picture's height, from its look |
| E74 | index.html#the-node-art | The node art (the same file): six trees, three bushes, stone, gold and iron; r is a dice for the leaf blobs |
| E75 | index.html#the-figures | The figures (preview 49, 18-figures.js): people and beasts drawn from data, feet at (0, 0), facing right, a person about 21 tall; fr 0–3 the walk, 10 and up at work (the tool, two poses). One look a code; the rest of the roster stays in preview 49 as skins. |
| E76 | index.html#the-figures | the brushes: one drawing routine a shape; a look in books/sprites.js names its brush and the brush's settings ($side the owner's colour, $side*0.6 a tint of it) |
| E77 | index.html#the-figures | a figure's frame, from its look |
| E78 | index.html#b-the-buildings | B the buildings (layer 110; shells without Walk): the size in tiles (D8–D11; a wall piece is one tile, D12), Open or Closed (S Styles), the picture it wears. Health, prices and times come with the Content pull. |
| E79 | index.html#b-the-buildings | the buildings (layer 110), from their shells: name, size in tiles, Open, the picture, what it takes in |
| E80 | index.html#b-the-buildings | a building stands on n × n flat free tiles from (i, j); Closed takes them (OCC 2), Open leaves them walkable (OCC 3) |
| E81 | index.html#b-the-buildings | The Town Center: Who every corner · What one · Where Z2 on the road at D84, the same in all four (L12) · When the map is made · Why the game starts with a hall to gather at · How no roll: fixed |
| E82 | index.html#floor-5-movables | Floor 5, movables (layer 120): U units and M moveables are shells that walk. Each stands at a board point, walks tile to tile along a path (QBL), and does one thing at a time. |
| E83 | index.html#floor-5-movables | one a corner (C5–C8); the player is 0 |
| E84 | index.html#floor-5-movables | the units and moveables (layer 120), from their shells: name, look, pace (a D86 key) |
| E85 | index.html#floor-5-movables | the tool a villager works a find with (WORKTOOL): axe, hands, pick |
| E86 | index.html#floor-5-movables | walking (L5, top rules): land or a ford is walked; a thing, a closed building or a step past the angle of repose is not |
| E87 | index.html#floor-5-movables | inland water bearing ice (QQ): walked as if flat |
| E88 | index.html#floor-5-movables | QN: mud and snow cost a walker |
| E89 | index.html#floor-5-movables | QBL A* over the tiles, eight ways, straight 1 and diagonal √2, the heuristic the octile distance (N74). goal(k) says when a tile will do; returns the tiles to walk, or null |
| E90 | index.html#floor-5-movables | most: the tiles it may open before giving up |
| E91 | index.html#floor-5-movables | no cutting a corner |
| E92 | index.html#floor-5-movables | a unit on a tile; its stand wanders in the tile (D82) |
| E93 | index.html#floor-5-movables | a path of one tile (already there) walks to its middle: no step past the end |
| E94 | index.html#floor-5-movables | to a tile |
| E95 | index.html#floor-5-movables | to a tile beside one |
| E96 | index.html#floor-5-movables | the drop-off for a yield: the side's nearest building that takes it in (SC Drop-off, B's fifth field) |
| E97 | index.html#floor-5-movables | to a tile along a building's edge |
| E98 | index.html#floor-5-movables | a find used up is gone; its tile is free again |
| E99 | index.html#floor-5-movables | one tick for every unit |
| E100 | index.html#floor-5-movables | walking: toward the next tile's middle at the shell's speed |
| E101 | index.html#floor-5-movables | metres walked, which turn the stride (QBU); its speed now, which a blow carries (QBT) |
| E102 | index.html#floor-5-movables | wildlife wanders: after a Poisson wait (QM, mean D94) it walks to a free tile within D95 |
| E103 | index.html#floor-5-movables | M3 the grids (a spatial hash): units by squares of D185, refiled after each step's walking, buildings by D186; a new unit is filed as it comes. A search looks only nearby |
| E104 | index.html#floor-5-movables | every unit within r of from (a square), never itself |
| E105 | index.html#floor-5-movables | the buildings within r of (x, y) by their squares, a little beyond on the edges; refiled when one comes or goes (Mid's rule); stops when fn says true |
| E106 | index.html#floor-5-movables | the rules' dice and the looks', from the map's seed but not its stream |
| E107 | index.html#floor-5-movables | The villagers: Who every side · What D67 villagers · Where round its Town Center · When the game starts · Why hands to gather and build · How the free tiles nearest the hall |
| E108 | index.html#floor-5-movables | The wildlife: Who the map · What herds of deer and packs of wolves · Where Z4, on walkable ground · When the map is made · Why food to hunt, teeth to fear · How counts D90–D93, places uniform until one walks |
| E109 | index.html#floor-5-movables | which walkers, how many groups and how big: the book's (D181) |
| E110 | index.html#floor-5-movables | what carries a walker: its mount, else its own body (W) |
| E111 | index.html#the-body-s-laws | The body's laws (Book 1): mass from what a shell is made of (W), the blow that sends a body off (QBT), the slide to rest on the ground under it (G), the sway of the wounded (QBS) |
| E112 | index.html#the-body-s-laws | QBT: the whole striker when it moves, else its weapon; the struck one is sent off at v = m·v ÷ (m + M) |
| E113 | index.html#the-body-s-laws | QBT: friction slows it by μ g a second until it rests; anything it cannot stand on stops it |
| E114 | index.html#the-body-s-laws | the mean speed over the step, so the slide ends where v² ÷ 2μg says |
| E115 | index.html#the-body-s-laws | QBS: none while the body holds (classes I, II); grows over class III to the tipping angle; there in class IV. Its rhythm the body's pendulum |
| E116 | index.html#the-body-s-laws | a unit's picture: the look at its frame, facing right, painted once per look, colour and frame (LOOKBOX gives the box) |
| E117 | index.html#the-things-drawn-each-frame-back-to-fr | The things, drawn each frame back to front, only those on the screen. A picture is painted once per look and zoom step, then stamped (the sprite cache); far out (D83) a node is a dot. The gifts are drawn direct, as tints of C. |
| E118 | index.html#the-things-drawn-each-frame-back-to-fr | W × H units, the art's origin at (tx, ty), its anchor (the point stamped at the thing's stand) at (ax, ay) |
| E119 | index.html#the-things-drawn-each-frame-back-to-fr | the node art's own small dice, seeded by the variant, so a tree's leaves fall the same each paint |
| E120 | index.html#the-things-drawn-each-frame-back-to-fr | each drawn at its stand (x, y on the screen), s pixels a unit |
| E121 | index.html#the-things-drawn-each-frame-back-to-fr | a find far out, from its look |
| E122 | index.html#floor-6-climate | Floor 6, climate (layer 130): one sky over the whole board (185 m across: one weather), acting on everything below (L7). The clock is Y: a day D20, a season D21, a year D22. |
| E123 | index.html#floor-6-climate | QA the sun: sin a = sin φ sin δ + cos φ cos δ cos H; φ D99, δ swings ±23.44° over the year from the spring equinox, H turns with the day (noon at the day's middle) |
| E124 | index.html#floor-6-climate | light by the sun's height, the twilights at −6, −12, −18 (SoRen's ramp, QD) |
| E125 | index.html#floor-6-climate | QP the one first-order lag, x to its level L over τ: x(t) = L + (x0 − L) e^(−t/τ) (N16; Mid's relax: wetness here, and the market, nerve, healing, loyalty to come) |
| E126 | index.html#floor-6-climate | QH the rain: a two-state chain, drawn once a game hour (a day's 24th): P(wet / dry) and P(wet / wet) are D102; a wet hour is a storm with D103. Snow falls instead when the air is at or under 1 °C (QI) |
| E127 | index.html#floor-6-climate | the season's mean, eased into the next |
| E128 | index.html#floor-6-climate | what falls |
| E129 | index.html#floor-6-climate | rain comes and goes over tens of seconds (SoRen) |
| E130 | index.html#floor-6-climate | QP settle: wet in D104, dry in D105 |
| E131 | index.html#floor-6-climate | QO degree-day melt, rain on snow twice as fast |
| E132 | index.html#floor-6-climate | QQ: ice grows with the freezing degree-seconds and bears at D109 |
| E133 | index.html#floor-6-climate | QM: fog comes on a Poisson wait (D110) and stays D111 |
| E134 | index.html#floor-6-climate | fog, or mist after rain at dawn and dusk (KW8) |
| E135 | index.html#floor-6-climate | QL, QM: strikes on Poisson waits in a storm |
| E136 | index.html#floor-6-climate | a strike: on the ground in view when close, a sheet flash when far; the flash never comes within D112 of the last (QL, WCAG 2.3.1), and the bolt is pinned to the ground it hits |
| E137 | index.html#floor-6-climate | a far flash: its thunder from beyond the screen |
| E138 | index.html#floor-6-climate | the rain: a pool of drops whose size sets its speed (Marshall–Palmer sizes, QJ Atlas's fall speed), leaning a little; the snow: flakes that drift |
| E139 | index.html#floor-6-climate | on the ground, under everything: snow whitens the land (screen), wet darkens it (multiply), ice whitens the inland water |
| E140 | index.html#floor-6-climate | over everything: what falls, the strikes, the flash, the night and the fog |
| E141 | index.html#floor-6-climate | SoRen's bolt: a channel from the top of the sky to the ground with a fork or two, three strokes from a soft glow to a bright core; its foot lights the ground round it |
| E142 | index.html#floor-6-climate | the channel wanders but leans home to its foot |
| E143 | index.html#floor-6-climate | the light: the sun's by the ramp, clouds take a quarter, the horizon's warmth within 8° of it |
| E144 | index.html#floor-6-climate | KW7: Koschmieder's reach (QK) limits sight on the Display floor; here the haze |
| E145 | index.html#floor-6-climate | Marsh (TW1): Who the map · What a wet margin round a lake or two · Where Z4's lakes, the land D115 out from the water · When the map is made · Why ground that is always mud (KI2), slow to cross, never built on · How count D114, lakes picked by the dice |
| E146 | index.html#floor-7-display | Floor 7, display (layer 140): what the player sees. The fog of war: every tile is unseen, seen once, or in sight now (the player's units see D117, its buildings further; fog in the air shortens sight, QK); the unseen is dark, the remembered dim (D118). Shadows fall from the sun (QAT). |
| E147 | index.html#floor-7-display | the player's sight, every D119: what was in sight is remembered; what the units and buildings of side 0 reach now is seen |
| E148 | index.html#floor-7-display | the sea is never fogged |
| E149 | index.html#floor-7-display | the fog image is one tile a pixel in the grid's frame; one affine lays it on the ground (QBD): the turn, the tilt and the camera together |
| E150 | index.html#floor-7-display | QAT the shadow: length = height × cot(the sun's height), capped at D120 heights, thrown away from the sun; the sun rises on the right, stands over the bottom of the screen at noon (the camera looks north), sets on the left |
| E151 | index.html#floor-7-display | left at sunrise, up at noon, right at sunset |
| E152 | index.html#floor-7-display | under the buildings and units: a building's footprint thrown by its height, a unit's foot by its own; none under the trees (the woods are their own shade) |
| E153 | index.html#floor-7-display | the box's shadow: its top thrown, joined to its foot along every edge, one fill so the overlaps stay one shade |
| E154 | index.html#the-woods-cache | The woods cache: the deep trees (eight tree neighbours) are painted once per chunk of the board and zoom step; the rest of the things are stamped each frame. Cutting a tree wakes its neighbours and repaints the chunk. |
| E155 | index.html#the-woods-cache | chunks of CS × CS tiles |
| E156 | index.html#the-woods-cache | a tree cut: its chunk is stale, and its neighbours stand at an edge now |
| E157 | index.html#the-woods-cache | each chunk's box in the view frame, with room above for the trees' height |
| E158 | index.html#the-woods-cache | the chunk's deep trees on one canvas |
| E159 | index.html#the-woods-cache | a hit moves to the back: the oldest goes first |
| E160 | index.html#the-woods-cache | a wounded one sways about its feet (QBS) |
| E161 | index.html#the-woods-cache | L6 the play edge: the line between tiles D7 in from the coast and the rest, along the tiles' own edges |
| E162 | index.html#touch | Touch: one finger pans, two pinch; a wheel zooms about the pointer. |
| E163 | index.html#touch | the camera rule: the board never leaves the screen's middle; a board smaller than the screen sits centred |
| E164 | index.html#touch | the tile under a tap, at the land's height, and the player's unit nearest it; the modules answer first (menu), else a tap picks a villager or sends the picked one walking |
| E165 | index.html#touch | The seed of the day (QBF): the date as YYYYMMDD, the same map for everyone that day; a seed in the address overrides it. |
| E166 | index.html#touch | the door: what the modules may touch |
| E167 | index.html#touch | the test hook |
| E168 | menu.js | First Keep v100 · menu.js (floor 8): everything on the glass. Lives alone; it reads the world through one function, read(), and acts through one, act(verb, arg), backed by VERBS, where every verb carries its own whyNot. A dim button never runs: it says why. |
| E169 | menu.js | Its shape lives in the Screen book (books/screen.js): the mold, the Build tabs, the card's rows and the subject's ticks that pick them, the pages and which are Tall. Nothing of it is typed here. |
| E170 | menu.js, econ.js, combat.js, ai.js | its numbers live in books/measure.js (D); nothing is typed here |
| E171 | menu.js | the codes and their floors; Lock is a mark for us (no floor is locked yet) |
| E172 | menu.js | the Screen book: the Build tabs are its; a building shows priced once econ prices it, else Later |
| E173 | menu.js | the seat, and who it trains first: asked of the books, never named |
| E174 | menu.js | the kinds War's Train box offers |
| E175 | menu.js | a page that keeps its own height (SC20) |
| E176 | menu.js | the new game's choices: the first is the label's row in Albert's template; built ones set the game, the rest wait (dim, they say why) |
| E177 | menu.js | which choices are floors yet |
| E178 | menu.js | the base's columns, Albert's template |
| E179 | menu.js | the base's icons: one 24-unit box each, line icons in the cell's colour, finds in their own |
| E180 | menu.js | the resources in their colours (COLORS.md) |
| E181 | menu.js | the colours: COLORS.md, one name each, set once on :root; nothing below uses a colour that is not here (the map's own paint excepted) |
| E182 | menu.js | the glass's own state, nothing of the world's |
| E183 | menu.js | 60w 60f, as Albert's Build menu |
| E184 | menu.js | read: the one window onto the world the glass draws from |
| E185 | menu.js | VERBS: every way the player may act, each with its reason not to. act() asks whyNot first; a reason stops it and is said |
| E186 | menu.js | Train a kind: the nearest finished building that trains it |
| E187 | menu.js | a channel's volume, a step a tap (HX10) |
| E188 | menu.js | sound on or off |
| E189 | menu.js | a cell for what is drawn but not yet built: Albert's reminder |
| E190 | menu.js | the new game: the bell (D134), fog, the day's map or a fresh one |
| E191 | menu.js | tap a yield: new villagers go there (the ring) |
| E192 | menu.js | tap picks, slide places the ghost, tap again builds |
| E193 | menu.js | the cells: one mold; a verb's cell is dim when its whyNot says so, and a dim cell only says why |
| E194 | menu.js | a cell's object arguments live here by key, since the DOM holds strings |
| E195 | menu.js | the mold: a ribbon is an optional label and a strip of n equal cells; seg puts them in one frame with one lit. Every screen is a list of ribbons |
| E196 | menu.js | the mold: every screen is rows on one six-column grid (the Formation). A row holds cells and parts; a part is an optional label and a strip of choices, seg puts them in one frame with one lit |
| E197 | menu.js | Albert's Town Center: the bars in the title, three tabs, the queue, train, tech |
| E198 | menu.js | Fast and New sit in the title row; the volumes add a row, so the Yard ticks Tall (SN13) |
| E199 | menu.js | one row a name in SN4; each answers for the subject t, or says nothing |
| E200 | menu.js | the base: Albert's template. Corners Yard and War; who works where; Build and − + under each yield |
| E201 | menu.js | war mode: Albert's War rows. Left the people's orders, the middle box (map, squads, orders, kinds), right the army's |
| E202 | menu.js | the top bar: Albert's two ribbons. The stores, sound, play, mail; the age, the clock, people, idle, records, rank, army |
| E203 | menu.js | Relations and Misfits: one row a people: who and where they stand, (a bribe for misfits), the three stances, ✓. Drawn now, built with diplomacy (Later) |
| E204 | menu.js | the five stores, sound, play, mail (SN5) |
| E205 | menu.js | a page opens from the bottom edge, over the base's rows; the card waits behind it |
| E206 | menu.js | the ghost: press and slide on the map moves it; the tile under the finger is its middle. Build confirms. Nothing of this reaches the canvas's own pan while a ghost is up |
| E207 | menu.js | the tap: the glass answers first. A ghost takes it; aiming takes it; a unit or a thing under it becomes the subject, and a picked villager or soldier is sent at it |
| E208 | menu.js | one height for every page but the Tall ones: each is laid out once, the tallest sets the panel, the others fill it (Albert: menus never move) |
| E209 | menu.js | the tallest of the pages that are not Tall sets the one height |
| E210 | menu.js | sized once the modules and fonts are in (the first start) |
| E211 | menu.js | the game opens on the player's hall |
| E212 | menu.js | the version, said once (D171) |
| E213 | econ.js | First Keep v100 · econ.js (floor 9): the economy. Lives alone; touches the world only through FK. Costs, homes, training, sites, ages, upkeep, and the villager as one state machine: idle, walk, gather, carry, build, repair, wait. |
| E214 | econ.js | seconds played, and when the bell rings |
| E215 | econ.js | gone: marked when it leaves the map (below) |
| E216 | econ.js | paying: a side pays all of a cost or none of it (SB Cost) |
| E217 | econ.js | a site: a building paid for and placed at done 0; villagers raise it. canPlace mirrors build's rule without building |
| E218 | econ.js | training: a queue at the building; the head trains; a new unit stands on a free tile beside and takes the side's rally job |
| E219 | econ.js | the age: paid, then a wait at the Town Center (D129) |
| E220 | econ.js | the jobs (SM Gather): a villager's job is the yield it works; counts are read, not kept |
| E221 | econ.js | QW: the find of a yield that keeps the round trip shortest: nearest the drop-off among those within D89 of the villager, else nearest the villager |
| E222 | econ.js | a find no path reaches is left alone a while (D137) |
| E223 | econ.js | assign: + sends the nearest idle villager (else one from the fullest other job) to the yield's best find; − sets one of the job's villagers idle |
| E224 | econ.js | the tick: training, ages, upkeep, the villagers, the bell |
| E225 | econ.js | a new game: the book's stores (D172); the bell stays as Start set it |
| E226 | econ.js | the score (QBR): what a side holds, cost ÷ D135, and everything it gathered ÷ D135 |
| E227 | combat.js | First Keep v100 · combat.js (floor 10): health, one blow (QBO), target choice (QAG), nerve (QBQ), towers (QAL). Lives alone; touches the world only through FK. A soldier's jobs: idle, walk, fight, march (to a point, fighting what it meets), rout (home, fighting nothing). |
| E228 | combat.js | tiles from a unit to a thing: to a building's footprint, in the grid's frame |
| E229 | combat.js | gone: pulled down (econ marks it) or dead (die marks it) |
| E230 | combat.js | QBO the blow: base × counter × flank − armour, one at least; engines strike buildings with their own blow |
| E231 | combat.js | the blow (QBO), and the body it moves (QBT) |
| E232 | combat.js | QAG the target: the most harm a second for its health left, discounted by distance; wildlife only when it is biting |
| E233 | combat.js | by the grids: a building by its middle, so the widest one's reach (D11) is added |
| E234 | combat.js | to within reach of a thing, with a short search (D147) |
| E235 | combat.js | a wave falls back to its seat, else to any building of its side |
| E236 | combat.js | a side's wave in the field: its soldiers at the start, so nerve can be read (QBQ) |
| E237 | combat.js | to a tile, or near one that cannot be stood on (a building's) |
| E238 | combat.js | QAF Lanchester: blows a second × health |
| E239 | combat.js | a villager fights back only when bitten |
| E240 | combat.js | the bars: a unit's or building's health, when it is hurt and in sight; the crosshair of the player's wave |
| E241 | ai.js | First Keep v100 · ai.js (floor 11): one brain for the computer's side, one personality (balanced). Lives alone; acts only through ECON and WAR, the same doors the menu uses. Every D.ai.beat it looks and does one round: jobs by need, people, homes, drop-offs, plots, the age, the army, the wave. |
| E242 | ai.js | the seat, and the hands it trains |
| E243 | ai.js | the shells a side can pay for that tick a capability |
| E244 | ai.js | each yield's camp: the drop-off that takes it in |
| E245 | ai.js | a spot: the nearest free footprint to a point, searched in rings, kept off the home's own ring so the roads stay open |
| E246 | ai.js | jobs by need: the yield whose share is most under its wanted share takes an idle villager, or one from the yield most over |
| E247 | ai.js | people, homes, drop-offs, plots, the age |
| E248 | ai.js | the army: the best counter to what the enemy fields most, until the age's count stands |
| E249 | ai.js | the wave: Lanchester odds r²/(1+r²) (QAF) of my strength over theirs with their towers counted as soldiers; a stalled wave goes home |
| E250 | sound.js | First Keep v100 · sound.js (beside the stack): one player for every recipe in books/sound.js (H). Lives alone; hears the world only through FK's 'event' hook. |
| E251 | sound.js | The ear is the camera, at a height (QAX); a struck thing rings by its material (QAY); snow lowers the air's top and rain masks the quiet (QBX). No sound is typed here. |
| E252 | sound.js | each channel's volume steps, the one in use first (HX10) |
| E253 | sound.js | a phone opens its audio only on a touch |
| E254 | sound.js | the Ring/Silent switch silences the game; the player's music plays on (HX8) |
| E255 | sound.js | a battle's many blows never clip a phone speaker |
| E256 | sound.js | QAY: each mode dies with time constant tau ÷ Hz, to 80 dB down |
| E257 | sound.js | QAX: the ear sits over the screen's middle at the height a lens of HX1's field of view needs to see the screen; a sound d along the ground is √(d² + h²) away, |
| E258 | sound.js | full within the closest zoom's height, then falling as 1 ÷ distance (the inverse-square law in amplitude), less the air's loss |
| E259 | sound.js | metres |
| E260 | sound.js | QBY: a sound with a reach is full within floor × reach |
| E261 | sound.js | the air is full: an alert never waits |
| E262 | sound.js | thunder comes after its flash by the distance ÷ the speed of sound |
| E263 | sound.js | QBX: rain drowns the far and quiet first |
| E264 | sound.js | the player's volume for this channel |
| E265 | sound.js | ambience as events: a bird from a tree in view by day, a cricket in the dark, never in winter; when one sings is a Poisson process (HX4) |
| E266 | sound.js | QBX: the air's top falls with snow cover, on a log scale |
