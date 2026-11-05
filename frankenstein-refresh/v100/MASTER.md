# First Keep v100 · 5. the Master (index, citations and comments)

Written by `index.py`, never by hand: each part of the code, the whys it carries (E), and the laws (Q) and book entries each why names, with their citations (N). From any line: why, by what math, from what source.


## index.html#page


## index.html#frames

- **E1** First Keep v100 · the world reads its numbers from the Books (books/*.js), never from here
- **E2** A Book entry is { key, value, name, cite, law } under its code; the game sees each book as · D53 (N112) · D86 (N71, N72, N73, N79)
- **E3** every code in every book
- **E4** a slot's pointer, read
- **E5** S the shells (books/shells.js): a row names its layer, ticks its capabilities (SC) and poi

## index.html#the-frames

- **E6** The frames (QBD). The grid is square in its own frame; the board frame is the grid turned  · QBD (N66) · A1 (N90) · A2 (N91)
- **E7** QBE: the most a tile may step up or down over its own width and still be a slope · QBE (N64)
- **E8** QBK the art frame: a building is painted with its front along x and sheared by SKEW so tha · QBK (N66)

## index.html#qbf-the-dice

- **E9** QBF the dice (N65): one seed, Mulberry32. Every roll names Who, What, Where, When, Why and · QBF (N65) · N65
- **E10** two streams from the map's seed, dealt fresh at makeUnits: the rules' (M1), so the same se · D187 (N125)
- **E11** QAZ a fractal line (N60): K waves, the k-th of amplitude k^(−H), H = 2 − Dim; a coast's Di · QAZ (N60) · N60
- **E12** QAZ as a surface: K plane waves in rolled directions, the same amplitudes; scale is the lo · QAZ (N60)

## index.html#the-coast

- **E13** The coast (L2 Cut at the board's edge; L4 Edge). Where it stands out it is a headland and  · QBG (N67)
- **E14** The roll: Who the map · What how far the coast wanders in and out · Where the coast only;  · QAZ (N60)
- **E15** pos: the way along the side from its start; returns [wander, cliffness]
- **E16** −1 bay to 1 headland

## index.html#the-ground

- **E17** The ground: one height a tile. Depth is the way in from the coast (negative at sea). Land  · D13 (N112) · D16 (N112) · D17 (N112)
- **E18** height, depth from the coast, the four drawn corner heights, the forest floor
- **E19** marsh (TW1): always wet (KI1)
- **E20** the way in from the coast at a board point, and the coast's cliffness there
- **E21** the drawn corners (QBE): at every grid corner the tiles round it are sorted by height and  · QBE (N64)

## index.html#floor-2-terrain

- **E22** Floor 2, terrain (layer 90): every piece is a Cut or a Raise on the one height field (L2,  · QBE (N64)
- **E23** a spot in a corner's own frame (u along one edge, v along the other), the same in all four
- **E24** the four roads: corner to middle
- **E25** every tile whose middle lies within r of a board point: fn(k, d, dx, dy)
- **E26** a lake: a bowl (deep at the middle, D27) inside a fractal shore (QAZ, D28); where the land · D27 (N112) · QAZ (N60) · D28 (N112) · QBG (N67) · D32 (N112) · D16 (N112)
- **E27** a wandering line (QAZ) from a to b, pinned at both ends; null when any point fails ok · QAZ (N60)
- **E28** a channel: discs along a line; w the half-width, deep the bed; the bank falls over D32 · D32 (N112)
- **E29** a smooth hill: its steepest slope is 0.77 h / r, under the angle of repose at these number
- **E30** The home pond: Who every corner · What one small lake · Where Z3, the same spot in each co · D51 (N112) · D52 (N112) · QAZ (N60)
- **E31** Lakes: Who the map · What their number, size and place · Where Z4, off the roads and the m · D25 (N112) · QBA (N61) · QAZ (N60)
- **E32** Rivers: Who the map · What one from each lake big enough, to the nearest free coast · Wher · QAZ (N60) · QBB (N62)
- **E33** Fords (TC4): Who every river · What a shallow crossing · Where wherever a river crosses on · D33 (N112)
- **E34** Hills (TR1): Who the map · What a few smooth rises · Where Z4, clear of water and roads ·  · D36 (N112) · D37 (N112) · D38 (N112)
- **E35** Streams (TC3): Who each hill · What a thin, wadeable run to the nearest lake · Where Z4 ·  · D34 (N112) · D35 (N112)
- **E36** Rock (TR2): Who the map · What outcrops nothing walks over or through · Where Z4, on dry l · D39 (N112) · D40 (N112) · D41 (N112) · QBE (N64) · D23 (N112)
- **E37** Crevices (TC5): Who the map · What a dry trench nothing crosses · Where Z4, off the roads  · D42 (N112) · D45 (N112) · D44 (N112)
- **E38** Forest (TF1): Who the map · What where the trees grow (the trees themselves come on floor  · D50 (N112) · QAZ (N60) · D48 (N112) · D49 (N112)
- **E39** the wood's edge keeps one tile from any slope or water

## index.html#floor-3-non-movables

- **E40** Floor 3, non-movables (layer 100): shells with no Walk, an Amount and a Yield (S). Each st
- **E41** the finds (layer 100), from their shells: kind → code, yield, amount, the ground kept clea
- **E42** QBJ Z1's store, from what the first age up costs (D129, Mid's Bronze; Albert's rule): food · QBJ (N69) · D129 (N160) · D62 (N112) · D69 (N112)
- **E43** what stands on each tile, and the shells themselves
- **E44** the free tile nearest a spot
- **E45** a shell on a tile; its stand wanders within the tile by D82 on the dice, so no wood is a g · D82 (N112)
- **E46** the n free tiles nearest a spot: a grove (marked as woods, the trees follow) or a berry pa
- **E47** The home finds: Who every corner · What Z1's berries, grove, gold and stone, sized by QBJ; · QBJ (N69) · D72 (N112) · D70 (N112) · D71 (N112) · QBF (N65)
- **E48** Z4's finds: Who the map · What piles of gold, stone and iron, berry patches, and the gifts · D73 (N112) · D81 (N112)
- **E49** The trees: Who every tile of woods (TF1, and the groves) · What one tree, its stand, size  · R1 (N144)
- **E50** drawn back to front
- **E51** a tree with trees on all eight sides is deep: nothing can stand between it and its neighbo
- **E52** 0 water, 1 sand, 2 dirt, 3 grass; bare dirt again high over the land (D23) · D23 (N112)
- **E53** the first band is what can be waded (D24) · D24 (N112)
- **E54** the forest floor: the grass, shaded; the marsh: the grass, toward the water
- **E55** what a face shows between two heights (L1): the grass is the land's top skin; anything rai

## index.html#drawn-once-in-the-view-frame

- **E56** Drawn once in the view frame: every tile a lifted quad, a face where it steps down toward 
- **E57** the masks at a quarter scale: the land in white and in shadow, the inland water
- **E58** a quad a, b, c, d (top-left round to bottom-left on the screen) grown half a pixel right a
- **E59** the grass's blades: one 64-unit tile of short strokes in two tints of C4, repeated (previe · C4 (N102)
- **E60** the light stands high to the left and in front: ground leaning that way is lit, ground lea
- **E61** runs: flat tiles of one colour in a row drawn as one quad (no seams, few fills)
- **E62** faces: the +y edge and the +x edge face the camera (the turn is under 45°)

## index.html#the-view

- **E63** The view (layer 140): one camera, drag to pan, pinch or wheel to zoom; the overlays are dr
- **E64** one flag a layer code (the panel, floor 8) and Fast

## index.html#the-door

- **E65** The door (floor 8): the modules (menu, econ, combat, ai) hang on these hooks and read the 
- **E66** event: a named happening (a blow, a drop, a raise) that the sound and the feel answer, by  · HE1 (N97)
- **E277** QCA, the effects: what each side has learned, and each side's numbers worked out once unti · QCA (N154, N155, N156)
- **E278** a thing's keys, the names an effect may reach it by: every head of its code's letters (B,  · BR1 (N144)
- **E279** a number's base, from its one home: the pace (D86), a building's health (D139) or a unit's · D86 (N71, N72, N73, N79) · D139 (N69) · D138 (N69) · D123 (N69) · D124 (N69) · D125 (N69) · SN1 (N133) · D87 (N112) · D127 (N69)
- **E280** the one window for a kind's number after research (QCA): flat adds first, then the shares  · QCA (N154, N155, N156)
- **E281** learning a step puts its effects in force for that side; every unit and building of the si
- **E67** a slow beat's turn (D182–D184): the step whose seconds played cross it, its phase in Mid's · D182 (N122) · D184 (N122) · D98 (N112)
- **E68** the screen jolts with a heavy impact (QBT) · QBT (N81, N82, N83, N18)
- **E69** the walking grid, at the land's height, clipped to the played ground: the coast's line bro · D7 (N112)
- **E70** Z1 to Z4 from each corner (D3 to D6), at the land's height (L11: a rule drawn on the groun · D3 (N112)

## index.html#the-brushes

- **E71** The brushes (preview 49, 18-figures.js): a polygon, an ellipse, a line, two gradients; g i

## index.html#the-building-art

- **E72** The building art (preview 49, 19-building-art.js; Nov 3, the last build before the camera  · PB3 (N151, N160) · PB4 (N151, N160) · PB6 (N151, N160) · PB12 (N151, N160)
- **E294** research shows on its building (Mid's UP, PB12): the steps learned of those its row names, · PB12 (N151, N160) · PB3 (N151, N160) · PB4 (N151, N160) · PB6 (N151, N160)
- **E295** the keep at its level: the bastion from its points in the Sprites book (PB13) · PB13 (N151, N160)
- **E73** a building picture's height, from its look

## index.html#the-node-art

- **E74** The node art (the same file): six trees, three bushes, stone, gold and iron; r is a dice f

## index.html#the-figures

- **E75** The figures (preview 49, 18-figures.js): people and beasts drawn from data, feet at (0, 0)
- **E76** the brushes: one drawing routine a shape; a look in books/sprites.js names its brush and t
- **E77** a figure's frame, from its look

## index.html#b-the-buildings

- **E78** B the buildings (layer 110; shells without Walk): the size in tiles (D8–D11; a wall piece  · D8 (N112) · D11 (N112) · D12 (N112)
- **E79** the buildings (layer 110), from their shells: name, size in tiles, Open, the picture, what
- **E80** a building stands on n × n flat free tiles from (i, j); Closed takes them (OCC 2), Open le
- **E81** The Town Center: Who every corner · What one · Where Z2 on the road at D84, the same in al · D84 (N112)

## index.html#floor-5-movables

- **E82** Floor 5, movables (layer 120): U units and M moveables are shells that walk. Each stands a · QBL (N74)
- **E83** one a corner (C5–C8); the player is 0 · C5 (N103) · C8 (N103)
- **E84** the units and moveables (layer 120), from their shells: name, look, pace (a D86 key) · D86 (N71, N72, N73, N79)
- **E85** the tool a villager works a find with (WORKTOOL): axe, hands, pick
- **E86** walking (L5, top rules): land or a ford is walked; a thing, a closed building or a step pa
- **E87** inland water bearing ice (QQ): walked as if flat · QQ (N17)
- **E88** QN: mud and snow cost a walker · QN (N13)
- **E89** QBL A* over the tiles, eight ways, straight 1 and diagonal √2, the heuristic the octile di · QBL (N74) · N74
- **E90** most: the tiles it may open before giving up
- **E91** no cutting a corner
- **E92** a unit on a tile; its stand wanders in the tile (D82) · D82 (N112)
- **E93** a path of one tile (already there) walks to its middle: no step past the end
- **E94** to a tile
- **E95** to a tile beside one
- **E96** the drop-off for a yield: the side's nearest building that takes it in (SC Drop-off, B's f
- **E97** to a tile along a building's edge
- **E98** a find used up is gone; its tile is free again
- **E99** one tick for every unit
- **E100** walking: toward the next tile's middle at the shell's speed
- **E101** metres walked, which turn the stride (QBU); its speed now, which a blow carries (QBT) · QBU (N79) · QBT (N81, N82, N83, N18)
- **E102** wildlife wanders: after a Poisson wait (QM, mean D94) it walks to a free tile within D95 · QM (N12) · D94 (N112) · D95 (N112)
- **E103** M3 the grids (a spatial hash): units by squares of D185, refiled after each step's walking · D185 (N123) · D186 (N124)
- **E104** every unit within r of from (a square), never itself
- **E105** the buildings within r of (x, y) by their squares, a little beyond on the edges; refiled w
- **E106** the rules' dice and the looks', from the map's seed but not its stream
- **E107** The villagers: Who every side · What D67 villagers · Where round its Town Center · When th · D67 (N112)
- **E108** The wildlife: Who the map · What herds of deer and packs of wolves · Where Z4, on walkable · D90 (N112) · D93 (N112)
- **E109** which walkers, how many groups and how big: the book's (D181) · D181 (N121)
- **E110** what carries a walker: its mount, else its own body (W)

## index.html#the-body-s-laws

- **E111** The body's laws (Book 1): mass from what a shell is made of (W), the blow that sends a bod · QBT (N81, N82, N83, N18) · QBS (N77, N78, N80)
- **E112** QBT: the whole striker when it moves, else its weapon; the struck one is sent off at v = m · QBT (N81, N82, N83, N18)
- **E113** QBT: friction slows it by μ g a second until it rests; anything it cannot stand on stops i · QBT (N81, N82, N83, N18)
- **E114** the mean speed over the step, so the slide ends where v² ÷ 2μg says
- **E115** QBS: none while the body holds (classes I, II); grows over class III to the tipping angle; · QBS (N77, N78, N80)
- **E116** a unit's picture: the look at its frame, facing right, painted once per look, colour and f

## index.html#the-things-drawn-each-frame-back-to-fr

- **E117** The things, drawn each frame back to front, only those on the screen. A picture is painted · D83 (N112)
- **E118** W × H units, the art's origin at (tx, ty), its anchor (the point stamped at the thing's st
- **E119** the node art's own small dice, seeded by the variant, so a tree's leaves fall the same eac
- **E120** each drawn at its stand (x, y on the screen), s pixels a unit
- **E121** a find far out, from its look

## index.html#floor-6-climate

- **E122** Floor 6, climate (layer 130): one sky over the whole board (185 m across: one weather), ac · D20 (N112) · D21 (N112) · D22 (N112)
- **E123** QA the sun: sin a = sin φ sin δ + cos φ cos δ cos H; φ D99, δ swings ±23.44° over the year · QA (N1, N2) · D99 (N112)
- **E124** light by the sun's height, the twilights at −6, −12, −18 (SoRen's ramp, QD) · QD (N2)
- **E125** QP the one first-order lag, x to its level L over τ: x(t) = L + (x0 − L) e^(−t/τ) (N16; Mi · QP (N16) · N16
- **E126** QH the rain: a two-state chain, drawn once a game hour (a day's 24th): P(wet | dry) and P( · QH (N7) · D102 (N7) · D103 (N112) · QI (N8)
- **E127** the season's mean, eased into the next
- **E128** what falls
- **E129** rain comes and goes over tens of seconds (SoRen)
- **E130** QP settle: wet in D104, dry in D105 · QP (N16) · D104 (N112) · D105 (N112)
- **E131** QO degree-day melt, rain on snow twice as fast · QO (N14, N15)
- **E132** QQ: ice grows with the freezing degree-seconds and bears at D109 · QQ (N17) · D109 (N112)
- **E133** QM: fog comes on a Poisson wait (D110) and stays D111 · QM (N12) · D110 (N112) · D111 (N112)
- **E134** fog, or mist after rain at dawn and dusk (KW8)
- **E135** QL, QM: strikes on Poisson waits in a storm · QL (N11) · QM (N12)
- **E136** a strike: on the ground in view when close, a sheet flash when far; the flash never comes  · D112 (N112) · QL (N11)
- **E137** a far flash: its thunder from beyond the screen
- **E138** the rain: a pool of drops whose size sets its speed (Marshall–Palmer sizes, QJ Atlas's fal · QJ (N9)
- **E139** on the ground, under everything: snow whitens the land (screen), wet darkens it (multiply)
- **E140** over everything: what falls, the strikes, the flash, the night and the fog
- **E141** SoRen's bolt: a channel from the top of the sky to the ground with a fork or two, three st
- **E142** the channel wanders but leans home to its foot
- **E143** the light: the sun's by the ramp, clouds take a quarter, the horizon's warmth within 8° of
- **E144** KW7: Koschmieder's reach (QK) limits sight on the Display floor; here the haze · QK (N10)
- **E145** Marsh (TW1): Who the map · What a wet margin round a lake or two · Where Z4's lakes, the l · D115 (N112) · D114 (N112)

## index.html#floor-7-display

- **E146** Floor 7, display (layer 140): what the player sees. The fog of war: every tile is unseen,  · D117 (N112) · QK (N10) · D118 (N112) · QAT (N53)
- **E147** the player's sight, every D119: what was in sight is remembered; what the units and buildi · D119 (N112)
- **E148** the sea is never fogged
- **E149** the fog image is one tile a pixel in the grid's frame; one affine lays it on the ground (Q · QBD (N66)
- **E150** QAT the shadow: length = height × cot(the sun's height), capped at D120 heights, thrown aw · QAT (N53) · D120 (N112)
- **E151** left at sunrise, up at noon, right at sunset
- **E152** under the buildings and units: a building's footprint thrown by its height, a unit's foot 
- **E153** the box's shadow: its top thrown, joined to its foot along every edge, one fill so the ove

## index.html#the-woods-cache

- **E154** The woods cache: the deep trees (eight tree neighbours) are painted once per chunk of the 
- **E155** chunks of CS × CS tiles
- **E156** a tree cut: its chunk is stale, and its neighbours stand at an edge now
- **E157** each chunk's box in the view frame, with room above for the trees' height
- **E158** the chunk's deep trees on one canvas
- **E159** a hit moves to the back: the oldest goes first
- **E160** a wounded one sways about its feet (QBS) · QBS (N77, N78, N80)
- **E161** L6 the play edge: the line between tiles D7 in from the coast and the rest, along the tile · D7 (N112)

## index.html#touch

- **E162** Touch: one finger pans, two pinch; a wheel zooms about the pointer.
- **E163** the camera rule: the board never leaves the screen's middle; a board smaller than the scre
- **E164** the tile under a tap, at the land's height, and the player's unit nearest it; the modules 
- **E165** The seed of the day (QBF): the date as YYYYMMDD, the same map for everyone that day; a see · QBF (N65)
- **E166** the door: what the modules may touch
- **E167** the test hook

## menu.js

- **E168** First Keep v100 · menu.js (floor 8): everything on the glass. Lives alone; it reads the wo
- **E169** Its shape lives in the Screen book (books/screen.js): the mold, the Build tabs, the card's
- **E170** its numbers live in books/measure.js (D); nothing is typed here
- **E171** the codes and their floors; Lock is a mark for us (no floor is locked yet)
- **E172** the Screen book: the Build tabs are its; a building shows priced once econ prices it, else
- **E173** the seat, and who it trains first: asked of the books, never named
- **E174** the kinds War's Train box offers
- **E175** a page that keeps its own height (SC20) · SC20 (N101)
- **E176** the new game's choices: the first is the label's row in Albert's template; built ones set 
- **E177** which choices are floors yet
- **E178** the base's columns, Albert's template
- **E179** the base's icons: one 24-unit box each, line icons in the cell's colour, finds in their ow
- **E180** the resources in their colours (COLORS.md)
- **E181** the colours: COLORS.md, one name each, set once on :root; nothing below uses a colour that
- **E182** the glass's own state, nothing of the world's
- **E272** the words helpers: numbers shortened (1.2k, 12k), plurals, 'a, b or c', a percent slower,  · D191 (N132)
- **E273** the first ending in the Words book (J5) that fits the name · J5 (N132)
- **E274** how much slower a full cover of mud or snow makes a march, in percent, from its terrain fa · QN (N13)
- **E275** a place as the map's lettered squares, measured from the board's corner: D190 units a squa · D190 (N132) · A1 (N90)
- **E276** a ledger line: its reasons largest first, each in its word and shortened, apart by a dot; 
- **E183** 60w 60f, as Albert's Build menu
- **E184** read: the one window onto the world the glass draws from
- **E185** VERBS: every way the player may act, each with its reason not to. act() asks whyNot first;
- **E186** Train a kind: the nearest finished building that trains it
- **E187** a channel's volume, a step a tap (HX10) · HX10 (N149)
- **E188** sound on or off
- **E189** a cell for what is drawn but not yet built: Albert's reminder
- **E190** the new game: the bell (D134), fog, the day's map or a fresh one · D134 (N114)
- **E191** tap a yield: new villagers go there (the ring)
- **E192** tap picks, slide places the ghost, tap again builds
- **E193** the cells: one mold; a verb's cell is dim when its whyNot says so, and a dim cell only say
- **E194** a cell's object arguments live here by key, since the DOM holds strings
- **E195** the mold: a ribbon is an optional label and a strip of n equal cells; seg puts them in one
- **E196** the mold: every screen is rows on one six-column grid (the Formation). A row holds cells a
- **E197** Albert's Town Center: the bars in the title, three tabs, the queue, train, tech
- **E198** Fast and New sit in the title row; the volumes add a row, so the Yard ticks Tall (SN13) · SN13 (N142, N143)
- **E199** one row a name in SN4; each answers for the subject t, or says nothing · SN4 (N136)
- **E200** the base: Albert's template. Corners Yard and War; who works where; Build and − + under ea
- **E201** war mode: Albert's War rows. Left the people's orders, the middle box (map, squads, orders
- **E202** the top bar: Albert's two ribbons. The stores, sound, play, mail; the age, the clock, peop
- **E203** Relations and Misfits: one row a people: who and where they stand, (a bribe for misfits), 
- **E204** the five stores, sound, play, mail (SN5) · SN5 (N137)
- **E205** a page opens from the bottom edge, over the base's rows; the card waits behind it
- **E206** the ghost: press and slide on the map moves it; the tile under the finger is its middle. B
- **E207** the tap: the glass answers first. A ghost takes it; aiming takes it; a unit or a thing und
- **E208** one height for every page but the Tall ones: each is laid out once, the tallest sets the p
- **E209** the tallest of the pages that are not Tall sets the one height
- **E210** sized once the modules and fonts are in (the first start)
- **E211** the game opens on the player's hall
- **E212** the version, said once (D171) · D171 (N118)

## econ.js

- **E170** its numbers live in books/measure.js (D); nothing is typed here
- **E213** First Keep v100 · econ.js (floor 9): the economy. Lives alone; touches the world only thro
- **E290** the Research book (O) by code and by key
- **E267** a side's economy, fresh: its age, the steps it knows, its gathered total, the rally, and t
- **E214** seconds played, and when the bell rings
- **E291** a find's or a field's rate after the side's research (QCA): the one window, D88 or the row · QCA (N154, N155, N156) · D88 (N70)
- **E215** gone: marked when it leaves the map (below)
- **E216** paying: a side pays all of a cost or none of it (SB Cost)
- **E268** earn and spend: every store in or out goes through these two, the one home for the stores, · J1 (N132)
- **E269** what was paid comes back the way it went out: the store, the minute's spending and the led
- **E270** the stores' flow a minute: the last full minute, or before there is one the minute so far  · D189 (N132)
- **E271** each minute (D188) the minute's in and out become the last minute's · D188 (N132)
- **E217** a site: a building paid for and placed at done 0; villagers raise it. canPlace mirrors bui
- **E218** training, research and the age: one queue at the building, as long as the mold's six and w · QCA (N154, N155, N156) · D124 (N69) · D129 (N160)
- **E219** the age (Mid's ageUp): the next age, never the hidden sixth until the peace opens it; paid · D129 (N160) · D130 (N160)
- **E292** Mid's research lines: a line is the steps of one line at one building, in the book's order
- **E293** research (Mid's researchWhy and research): a step is refused when known, before its age, b
- **E220** the jobs (SM Gather): a villager's job is the yield it works; counts are read, not kept
- **E221** QW: the find of a yield that keeps the round trip shortest: nearest the drop-off among tho · QW (N24) · D89 (N112)
- **E222** a find no path reaches is left alone a while (D137), and the next beat chooses again among · D137 (N114) · D89 (N112)
- **E223** assign: + sends the nearest idle villager (else one from the fullest other job) to the yie
- **E224** the tick: training and research, ages, upkeep, the villagers, the bell
- **E225** a new game: the book's stores (D172); the bell stays as Start set it · D172 (N119)
- **E226** the score (QBR): what a side holds, cost ÷ D135, everything it gathered ÷ D135, and what i · QBR (N75) · D135 (N75)

## combat.js

- **E170** its numbers live in books/measure.js (D); nothing is typed here
- **E227** First Keep v100 · combat.js (floor 10): health, one blow (QBO), target choice (QAG), nerve · QBO (N69) · QAG (N36, N37) · QBQ (N76) · QAL (N41)
- **E285** the Sides book (I) and the stances made in play, each pair's own; a new game forgets them
- **E286** who belongs (the kind decides): a side's own are no group; an animal (I4) is a beast; a ki · I4 (N158) · I3 (N158)
- **E287** a stance is the pair's own, or the book's start (I2); a treaty sets it both ways between i · I2 (N158) · N159
- **E288** the one hostility test (Mid's isFoe): never one's own; an animal is everyone's foe; one of
- **E289** the wild looking at a side: an animal fights everyone; a group fights a side at war with i
- **E228** tiles from a unit to a thing: to a building's footprint, in the grid's frame
- **E229** gone: pulled down (econ marks it) or dead (die marks it)
- **E230** QBO the blow: base × counter × flank − armour, one at least; engines strike buildings with · QBO (N69)
- **E231** the blow (QBO), and the body it moves (QBT) · QBO (N69) · QBT (N81, N82, N83, N18)
- **E232** QAG the target: the most harm a second for its health left, discounted by distance; wildli · QAG (N36, N37)
- **E233** by the grids: a building by its middle, so the widest one's reach (D11) is added · D11 (N112)
- **E234** to within reach of a thing, with a short search (D147) · D147 (N114)
- **E235** a wave falls back to its seat, else to any building of its side
- **E236** a side's wave in the field: its soldiers at the start, so nerve can be read (QBQ) · QBQ (N76)
- **E237** to a tile, or near one that cannot be stood on (a building's)
- **E282** who counters whom: the counter's edge (D140) when the striker's class is the one it counte · D140 (N114) · QBO (N69) · QAF (N35)
- **E238** QAF a group's power: each one's health × its blow after research, the blow at least D194,  · QAF (N35) · D194 (N69, N157) · D193 (N157)
- **E283** QAF the odds an army gives itself against a side, the one home the computers read: the cou · QAF (N35) · D193 (N157)
- **E284** against theirs: its soldiers, its towers (not its seat) at D177 each, its people at D192 ( · D177 (N157) · D192 (N157)
- **E239** a villager fights back only when bitten
- **E240** the bars: a unit's or building's health, when it is hurt and in sight; the crosshair of th

## ai.js

- **E170** its numbers live in books/measure.js (D); nothing is typed here
- **E241** First Keep v100 · ai.js (floor 11): one brain for the computer's side, one personality (ba
- **E242** the seat, and the hands it trains
- **E243** the shells a side can pay for that tick a capability
- **E244** each yield's camp: the drop-off that takes it in
- **E245** a spot: the nearest free footprint to a point, searched in rings, kept off the home's own 
- **E246** jobs by need: the yield whose share is most under its wanted share takes an idle villager,
- **E247** people, homes, drop-offs, plots, the age
- **E248** the army: the best counter to what the enemy (the first side in play it is at war with) fi
- **E249** the wave: it sets out at the odds (QAF, combat.js) of D155 or better against the other sid · QAF (N35) · D155 (N114)

## sound.js

- **E250** First Keep v100 · sound.js (beside the stack): one player for every recipe in books/sound.
- **E251** The ear is the camera, at a height (QAX); a struck thing rings by its material (QAY); snow · QAX (N58) · QAY (N59) · QBX (N88)
- **E252** each channel's volume steps, the one in use first (HX10) · HX10 (N149)
- **E253** a phone opens its audio only on a touch
- **E254** the Ring/Silent switch silences the game; the player's music plays on (HX8) · HX8 (N148)
- **E255** a battle's many blows never clip a phone speaker
- **E256** QAY: each mode dies with time constant tau ÷ Hz, to 80 dB down · QAY (N59)
- **E257** QAX: the ear sits over the screen's middle at the height a lens of HX1's field of view nee · QAX (N58) · HX1 (N58)
- **E258** full within the closest zoom's height, then falling as 1 ÷ distance (the inverse-square la
- **E259** metres
- **E260** QBY: a sound with a reach is full within floor × reach · QBY (N89)
- **E261** the air is full: an alert never waits
- **E262** thunder comes after its flash by the distance ÷ the speed of sound
- **E263** QBX: rain drowns the far and quiet first · QBX (N88)
- **E264** the player's volume for this channel
- **E265** ambience as events: a bird from a tree in view by day, a cricket in the dark, never in win · HX4 (N12, N145)
- **E266** QBX: the air's top falls with snow cover, on a log scale · QBX (N88)
