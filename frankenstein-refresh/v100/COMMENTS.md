# First Keep v100 · 4. the Comments

Written by `index.py` from `books/comments.js`, never by hand: every why, by its code, and where the code names it.

| Code | In | Why |
|---|---|---|
| E687 | index.html#floor-5-movables | past the lane beside a building, the next ring a pace further out, as many rings as the most people need (Mid's spot further out): every paid unit stands somewhere |
| E688 | ai.js | a computer's soldier holding a choke whose time is up, or sent to help an ally and still there D285's stay s, goes back to the pool for the next wave (Mid's state 'home', 17-ai and assist) |
| E689 | index.html#floor-7-display | the tops are made again when a building is added, removed or raised further: a site counts at its built share of its height |
| E690 | index.html#qbf-the-dice | the dice can tell and set where they are, so a save opened rolls on as it would have |
| E691 | combat.js | a captive is taken alive: gone from the field with no corpse, no killer and no blow to anyone's nerve; who aimed at it looks again |
| E693 | menu.js | the arguments the cells point at are made again with each render, so the table holds only what is on the screen |
| E694 | index.html#the-door | a unit's row of numbers with its side's research applied, kept until the research changes: code reads the stats through here, never the raw table |
| E695 | index.html#the-door | at rest (paused, a full-screen page, the end) the world draws D340's idle frames a second, as SoRen does; paused, time stands still |
| E696 | index.html#the-door | the screen stays awake while a match runs; let go when paused, at rest or hidden; a browser without the lock plays on |
| E697 | sound.js | the page hidden, the sound engine is suspended and resumed on return (was closed, as SoRen's sound.off, which left the game silent until the next touch); it wakes on the finger lifting as well as landing, Safari's rule (Base 26-input; the Nov 7 sound audit) |
| E698 | index.html#the-view | a draw-level change redraws the canvas at its new sharpness; only a real change of the window's size refits the camera, so the view never jumps out to the whole map mid-match (the Nov 7 flow study) |
| E699 | menu.js | the ghost carries its own label on the map, as Base and Mid: its name and price where it fits, else why not; the player never has to look down at the card to know |
| E700 | menu.js | only a touch on or near the ghost moves it; a touch away from it falls through to the camera, so the player can look around while placing (Mid's nearGhost, 26-input.js); before the ghost is set down, the first touch places it |
| E701 | menu.js | the top bar's cells by the Screen book: pause and the small map are live controls; a cell that does nothing is not shown (Base's bar had none) |
| E702 | menu.js | pause stops the clock and opens the Pause screen; the same cell resumes |
| E703 | menu.js | New game asks twice, so a stray tap cannot end a match; then the Start sheet |
| E704 | menu.js | the two base rows as Base has them; War is Mid's one red button on the rank above the rows, at the right, shown only over the open map, its close while the station is up; the station takes the two rows' place, the jobs are not stacked under it (Albert, Nov 7 19:38, 19:54: the War button back, the Yard stays out) |
| E705 | menu.js | a hazard switched on adds its points to the level (the measure book's hazards.pts); the Start sheet's picks are a setting, copied into the match's own set when it begins, as Base (SET.hz into G.hz): a toggle after Start is the next match's (Albert, Nov 7 19:35) |
| E706 | menu.js | as Base (Albert, Nov 7 20:48: all Base): a pause has no page, it drops the speeds, New game and the volumes under the pause button and says Paused · tap to carry on, and a tap on the open map carries on; the Start sheet and the Welcome back card hold the world paused behind them; a saved game opens behind Welcome back with Resume and New game; the Yard shows only in the test field |
| E707 | menu.js | while a tall sheet (the Start page) is open, messages wait in the post and come out when it closes, so none covers the sheet (Base's land card came after Start) |
| E708 | index.html#frames | a shell's ticks as a Set, built once from the Shells book: has() is asked hundreds of thousands of times a second, and a Set answers in one step where a list walks |
| E709 | index.html#floor-3-non-movables | the buildings as their own list, a derived index of things rebuilt only when things change (TV, the things version): buildings are a few dozen among ten thousand things, and most scans want only them |
| E710 | index.html#b-the-buildings | a new building slides into the things list at its depth instead of re-sorting ten thousand things, which was a felt hitch every time anyone built |
| E711 | index.html#floor-3-non-movables | the pocket as Mid's (QCS): zone 1's need from the age's price and the first villagers and houses, the home finds by their piles and amounts; Z1 lays Mid's pile counts, each pile carrying its share, and Z3's finds scale from the same totals |
| E712 | ai.js | the computers' first buildings (D342), standing and free when the match begins: Mid's handicap for a player that plays worse than a person; placed by the same site rules the computers always use, so the lanes and the gap from finds hold |
| E713 | index.html#floor-6-climate | visibility by CALVIS alone (QK): rain and snow enter as water content, rain by Marshall–Palmer, snow by its fall speed, so the three haze terms come from one source |
| E738 | menu.js | a building's research on its card: the next step of each of its lines, as Base's card (the Town Center's next age first) |
| E739 | menu.js | research, as Base's techBtn: its name and cost; a step that cannot start says why on the button in place of its price (its age, the step before, the line busy or full, its building; N17 #18), or its shortfall when only the cost stops it; the first tap on a step tells what it does on the help line and arms it, the second buys it, any other tap disarms (Albert, Nov 8 20:49) |
| E740 | menu.js | a building's lines, each as its next step to learn (none when the line is done); another people's lines are left out |
| E748 | index.html#drawn-once-in-the-view-frame | the ground painted once into the whole picture: tiles, faces, contours, reeds; its grass also onto the season sheet, which is the blades' mask |
| E749 | index.html#drawn-once-in-the-view-frame | the cache budgets for what is drawn once and kept |
| E751 | index.html#drawn-once-in-the-view-frame | the ground: nothing before the land is made, then its shapes replayed under the camera at every zoom |
| E753 | index.html#the-body-s-laws | a figure that moved this step walks; it swings its tool only standing at its work |
| E754 | index.html#the-things-drawn-each-frame-back-to-fr | a drawing's size in the world comes from its body's real height in the Mass book: the art is measured once and drawn so it stands that tall |
| E755 | index.html#the-things-drawn-each-frame-back-to-fr | how tall a drawing is: from its first to its last painted row |
| E756 | index.html#the-things-drawn-each-frame-back-to-fr | the figures' scale: a villager's body height over its drawing's, one for every figure (riders, animals and engines are drawn at the same art scale) |
| E757 | index.html#the-things-drawn-each-frame-back-to-fr | a find's scale: its body's height (tree, bush, outcrop) over its own drawing's; a find with no body is drawn as the figures are |
| E758 | index.html#drawn-once-in-the-view-frame | a tile's flat colour by what lies there; its light is the meadow layer's (D353), smooth across the tiles (N11: a marsh is shallow water; the woods' floor is grass; no rim colour) |
| E759 | index.html#drawn-once-in-the-view-frame | the shore and the strata as contours: between four tiles' middles the lowest band is laid, then each higher band above its level, so the coast and the sand, dirt and grass edges cut across the tiles instead of stepping; foam on the water's edge; a cliff or a wood keeps its tiles |
| E760 | index.html#the-building-art | a stone wall laid course by course, each stone with its own faint tint |
| E761 | index.html#the-building-art | damp moss rising from a wall's foot, fading upward |
| E766 | index.html#the-woods-cache | the ring at a unit's feet, full and bright: green picked, blue working, yellow idle (yours); a foe's its side's colour, the wild white (the Colours book's foot, C24) |
| E767 | index.html#floor-5-movables | a grid cell's key is a number, row times the land's width plus column, not a string: no text built on every lookup |
| E768 | index.html#floor-2-terrain | the board point of each tile's middle stepped across the square, not turned afresh for every tile (a stamp of a tower's reach turned a thousand points a beat) |
| E769 | econ.js | a research's needs worked out once and kept: the Tech book does not change in play |
| E770 | index.html#the-view-s-eyes-lights-and-stage | the pace meter: frames a second and the ms a frame spends on logic and on drawing, averaged over tau s, shown with the Yard's P |
| E772 | menu.js | every tap on the map sounds once, by what it did: a pick the unit's voice, an order the go, a double tap the open chime, a wall's point the place, a wall off the land the err, else the tap |
| E773 | index.html#the-trees | the trees as a cast: twelve kinds from the Sprites book (PT1), each a few variants by its own seed; a crown is leaf dabs inside its outline, lit by where each sits; bare limbs grow by twig; evergreen tiers fade light to shade across the tree; drawn once a leaf stage (and snow) and kept |
| E774 | index.html#the-trees | which kind a tree is: weighed by where it stands (wet low ground, the plain, the hills), one roll picks the kind and its variant |
| E775 | index.html#floor-2-terrain | a pond's bank: a short fall to the water on every side, the water filled near the brim (no cliff sides) |
| E776 | index.html#drawn-once-in-the-view-frame | water cells traced like the land: each depth band of the water drawn along its contour, so the shallows and the deep meet in curves, not tiles |
| E777 | index.html#the-trees | a tree's leaf stage: the year's place in seasons, each tree a little later or earlier by its own seed (lag) |
| E778 | index.html#the-trees | every leaf a tree could hold is placed first, each with its own draw; the ones under the share kept are drawn, so a crown fills in spring and thins in fall, leaf by leaf, never reshuffled |
| E779 | index.html#drawn-once-in-the-view-frame | the contours painted band by band over the whole piece of land, lowest first, so a band laid in one cell is never painted over by the lower band of the next; then the ice masks filled once each |
| E780 | index.html#drawn-once-in-the-view-frame | the ice masks, one a step of depth: a lake's water of depth d belongs to step d ÷ the lake's depth (D27) of D350's steps |
| E781 | index.html#floor-6-climate | the ice drawn: the mask of the deepest step frozen so far, over the water |
| E782 | index.html#drawn-once-in-the-view-frame | each water cell adds its shallow part to every step's ice path and its land part to the land path; one fill each, so no seam shows |
| E783 | index.html#floor-2-terrain | a pond's water marks the lake's radius on each of its tiles (for how late it freezes); a brim pond marks its bank, drawn as grass to the water |
| E784 | index.html#floor-5-movables | the ice's thickness on a tile by Stefan's law from the degree-days past that tile's onset (or past the day a hole broke it), thinner growth under snow; what it holds at failure by Gold's formula |
| E785 | index.html#floor-5-movables | who may step on ice: yours unless told to go around; the computer and the wild only where the ice holds several of them at the safe load |
| E786 | index.html#floor-5-movables | your crossing for a unit: its own, else the one you chose to remember for this winter or this game, else normal |
| E787 | index.html#floor-5-movables | stepping from land onto the ice keeps the crossing: wait for an answer; one at a time waits while others of yours are on the ice; file and thin out wait while one of yours is on the ice within the gap |
| E788 | index.html#floor-5-movables | the thinnest ice on the way of the units asked about, and what it holds safely |
| E789 | index.html#floor-5-movables | clear off: everyone of yours on the ice goes to the nearest land |
| E790 | index.html#floor-5-movables | each beat the ice under every loaded tile of deep water is weighed (a thaw leaves them on ice too thin to hold anyone): over the safe load it cracks (heard and seen), and after the warning it breaks at a chance growing with the square of the overload, at once past failing; the tile's people fall through, those near at a chance |
| E791 | index.html#floor-6-climate | the holes and the cracks drawn over the ice: a hole open water ringed with broken edge, a crack's rays growing over the warning |
| E792 | menu.js | the ice card's answers: a way to cross for the units asked about, remembered for this winter or this game if picked; go around orders them again off the ice; clear off |
| E793 | menu.js | the ice card: what the thinnest ice on the way holds, the six ways, remember |
| E794 | menu.js | an order whose way crosses ice asks how to cross, unless a remembered answer stands; they wait at the shore meanwhile |
| E795 | menu.js | ice cracking under yours: the warning said and a clear-off button beside it until all of yours are off the ice |
| E796 | combat.js | one who falls through the ice is lost, as any death, and leaves no body on the ice (under) |
| E797 | index.html#floor-6-climate | a frozen lake under snow: white as the land, with wind-scoured streaks of ice and a rim line at the shore, so it still reads as a lake; made once per ice step and snow step |
| E763 | index.html#the-brushes | a figure's lines in its own darker shade, never black: while a figure is painted (RIM), a stroke asked in ink takes the fill's shade, or a soft ink under a gradient, and a thinner line (the Sprites book's cut, PF2) |
| E764 | index.html#the-figures | the person's cut: anchors at the shoulder, hip, hem, ground and face; the tunic, robe, armour, apron, hair and coif drawn as curves from them; sleeves as bowed strokes with a rim, ending in a hand |
| E762 | index.html#the-figures | a person in true proportion: long legs, a torso, a small head, a slim build, from the Sprites book; the head and its helm drawn smaller about the neck |
| E741 | index.html#floor-6-climate | an event's knobs (damage, speed) while it runs, and how far through it is |
| E743 | index.html#floor-6-climate | the mirage: an army seen on the small map ahead of your Town Center toward the middle, told with its square; at its end, told it was not there |
| E744 | index.html#floor-6-climate | the circus crosses the land like the wagon; a villager near a performer is cheered and gathers more for a while |
| E745 | index.html#floor-6-climate | the aurora: curtains of green and violet over the top of the glass, swaying unless motion is stilled |
| E746 | index.html#floor-6-climate | an event with its own picture draws it over the map |
| E747 | index.html#the-view-s-eyes-lights-and-stage | the mirage's dots on the small map, in the colour of what is coming |
| E737 | menu.js | the help line under the top bar (Albert, Nov 8: one place the eyes always go): every message lands there, gold while fresh (D.toast s) then dim, never gone; a tap goes to the message's place when it has one, else opens the Help card with the whole text |
| E736 | menu.js | the Home button stands at the rank's left whenever the Town Center is off the screen, and takes the camera home (Base, item 15) |
| E735 | menu.js | the hammer carries the receding brown ring for every site going up (the mean of their progress; Albert, Nov 10, #21: the Build button is the aggregator of all builds), People the green ring while the seat trains, and People is ringed blue while anyone stands idle (Base, items 19 and 20); with no hazard ticked each is drawn by lot at D309 lot odds, Base's HZ_ODDS, and the first message says the level (item 5) |
| E734 | econ.js | a yield's first age is the earliest age of anything that costs it (units, buildings, research, the ages themselves), Base's firstAge; a job is locked until then and a tap on it says when it opens (the Nov 7 re-read, item 21) |
| E733 | menu.js | the bars for what is picked, as Base's selection bar (the Nov 7 re-read, items 32 and 34): villagers get the yields, Build and Follow; soldiers Charge, Fall back, Hold, Recall and Follow; a wild animal Hunt, Hunt ×3 and Follow |
| E732 | menu.js | the Mail door on the top bar with its unread count opens the Mail card: the messages newest first, each with its group, a tap on one with a place goes there (Base, the Nov 7 re-read item 13) |
| E731 | index.html#the-view-s-eyes-lights-and-stage, menu.js | the war station's middle is the small map, as Base's: tap to jump, drag to sweep; the map is drawn on the canvas inside the box the menu measures (miniBox); five pages of four tiles take its place (Train, Squad, Set up, Direct, Field), one tap each, no holds (Albert, Nov 8) |
| E730 | menu.js, econ.js | the Build card as Base's: opening it reads the middle of the view and opens the tab of what fits there, marked blue with Fits here; a second tap on the Build tab closes it; each row is the name, built/limit (limitOf), the price in green or the lock (its age, research, need) in grey; tapping the picked building again cancels the ghost |
| E729 | index.html#floor-6-climate | the sky's washes (the dusk glow, the night blue, fog, rime, the flash, the visibility veil) are composed into one colour and laid in one pass, exactly as the six would have painted in turn (each over the last: c = cᵢaᵢ + c(1 − aᵢ), a = aᵢ + a(1 − aᵢ)); the top bar's height is measured once, not read from the layout every frame (SoRen 70-render; the Nov 7 read); with no top bar (a full card open) the sky's band starts at the top of the glass |
| E728 | index.html#floor-6-climate | a close bolt startles as Mid's did: the picture whites to its flash (D113 flash), the ground shakes (the jolt, D113 shake), the thunder follows by the real delay; a sheet flash is the far one |
| E727 | index.html#the-body-s-laws | a blow from beyond melee reach (D.flanking.melee, the combat book's own line) is a missile: its hit is the arrow's sound, as Base's (the Nov 7 sound audit); research done is heard as a build done |
| E726 | menu.js | the place bar says what Base's said (J34): where to press, then the name with 'tap Build, or drag it to move', the pieces of a line; Build and Cancel |
| E725 | index.html#touch | the finger's target is lift px a zoom ABOVE the figure's foot, its body; the sign was turned, so the target sat below the feet and a tap on the figure fell on the ground (the sword): Albert, Nov 7 20:30 |
| E724 | menu.js | a picked villager's bar on the rank, as Base's selection bar (Albert's Base screenshots, Nov 7 20:38): 'n picked' and the cross that lets them go, then the five yields (each picked villager to that yield's nearest find), the hammer (the Build card: the picked raise what is placed) and the crosshair (Follow); the sword and cross on empty ground stay the ground's own action (Albert, Nov 7 20:30: tapping a villager must say build) |
| E723 | sound.js | the sound engine is woken the moment it is made: a phone makes it asleep until a gesture resumes it, so the first taps were silent |
| E722 | index.html#floor-6-climate | zero and one are named from the count row (D346), no longer borrowed from the hazards' base |
| E721 | index.html#floor-5-movables | the path search keeps its working memory between searches (typed arrays stamped by a search number, a heap in two arrays): no Maps, Sets or objects made per step, so a search costs its steps and nothing else; the answer is the same path |
| E720 | index.html#floor-2-terrain | the forest is Mid's (D345, N249): a jittered lattice scored by an organic field, thicker away from home, the best trees kept, three winding paths out; the wall band round a home and the zones' tree shares (D50, Z1–Z4 trees) are gone with their circles |
| E719 | index.html#floor-6-climate | rain and snow are drawn on the glass, as Mid's: the biggest drop crosses the screen at glass px/s whatever the zoom, the rest by their real ratios (Atlas); drawn in the world's metres a far view left them hanging as hairs (Albert, Nov 7 20:01); weather is information, never switched off: a phone shedding motion draws a share of the drops, Reduce motion holds them still (SoRen's; Albert, Nov 9) |
| E718 | menu.js | the Start sheet as Base's: the Start button one slot tall, the people's blurb two lines (the unit and its wonder; the history stays in the Guide), so the sheet fits a phone with the browser's bars (Albert, Nov 7 19:40: ridiculously tall); the speeds ×1 ×2 ×3 drop under the pause button while the match is paused, as Base's spdPop; a speed picked resumes the match |
| E717 | index.html#the-view-s-eyes-lights-and-stage | the eye sees the ground's light, not the sky's: the lux × the albedo of what covers the ground, snow four times grass (D117 albedo, N248), by the snow's share of full cover |
| E716 | menu.js, econ.js | the guide lines, Base's PDF guides (Build 63; Albert, Nov 8: locked): a dashed line along the board's rows (the land turned a little, so they read level and upright) wherever the ghost lines up with one of yours within guide: centre to centre, edge to edge, or flush (D206 align: the ghost's side, then its), so two or three can show at once; counted in half tiles (a middle may sit on a half); drawn pad past both |
| E715 | index.html#the-door | the loop as Mid's (41-boot frame): the world steps at a fixed rate (D343) however the frames come, catching up at most catchup steps; a frame between two steps draws each figure the fraction of the way, so walking is smooth at any frame rate and a slow phone does half the work it did at 60 steps a second; lvx, lvy are where it stood before the step |
| E714 | index.html#the-view-s-eyes-lights-and-stage | the glow's gradient is the inverse-square law itself (QCU), sampled at falloff stops, instead of two guessed stops |
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
| E23 | index.html#floor-2-terrain | a spot in a corner's own frame (u along one edge, v along the other), the frame turned with its corner, the same in all four (L12) |
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
| E38 | index.html#floor-2-terrain | Forest (TF1): Who the map · What where the trees grow (the trees themselves come on floor 3) · Where a wall round every home at D50 with the road through it (the same for all, L12); elsewhere each zone's tree share (D63–D66): none in Z1 and Z2, thickening across Z3 to Z4's own (QCP); never on water, slopes or roads · When the map is made · Why woods to cut, to hide in, to go round, and room to build out near home (Albert, Nov 6) · How QAZ as a surface, scale D48, ranked so each zone holds its share (QCP) |
| E39 | index.html#floor-2-terrain | the wood's edge keeps one tile from any slope or water |
| E40 | index.html#floor-3-non-movables | Floor 3, non-movables (layer 100): shells with no Walk, an Amount and a Yield (S). Each stands on one flat tile of land; a big one takes the tiles under it. Nothing here moves; floor 5 takes from the amounts. |
| E41 | index.html#floor-3-non-movables | the finds (layer 100), from their shells: kind → code, yield, amount, the ground kept clear |
| E42 | index.html#floor-3-non-movables | QBJ the pocket's store, one age up calculated (D62: the age's price, the villagers and the buildings at their costs, with the margin); a kind's finds in a zone are its pockets' worth (D63, D65), at least one |
| E43 | index.html#floor-3-non-movables | what stands on each tile, and the shells themselves |
| E44 | index.html#floor-3-non-movables | the free tile nearest a spot |
| E45 | index.html#floor-3-non-movables | a shell on a tile; its stand wanders within the tile by D82 on the dice, so no wood is a grid |
| E46 | index.html#floor-3-non-movables | the n free tiles nearest a spot: a grove (marked as woods, the trees follow) or a berry patch |
| E47 | index.html#floor-3-non-movables | The home finds: Who every corner · What the pocket's berries, grove, gold and stone at D70's spots, sized by QBJ; Z3's finds (D65) at three pockets' worth, laid by the Randomizer in the ring between Z2 and Z4, off the road; the land's specialty once more · Where the corner's own frame, the same in all four (L12) · When the map is made · Why every player starts with the same ground and the same means to the next age · How one home dice (QBF), restarted at each corner, so the corners match |
| E48 | index.html#floor-3-non-movables | Z4's finds: Who the map · What piles of gold, stone and iron, berry patches, and the gifts: ruins, cemeteries, campfires, treasure · Where Z4, on flat free land, off the roads, the middle and the play edge · When the map is made · Why the game beyond the homestead is to be found, not known · How counts D73–D81, places uniform until one is clear, each a roll |
| E49 | index.html#floor-3-non-movables | The trees: Who every tile of woods (TF1, and the groves) · What one tree, its stand, size and shade · Where its tile · When the map is made · Why the woods are what is cut for wood (R1) · How three rolls a tile |
| E50 | index.html#floor-3-non-movables | drawn back to front |
| E51 | index.html#floor-3-non-movables | a tree with trees on all eight sides is deep: nothing can stand between it and its neighbours, so the deep woods are painted once a chunk (see the woods cache) |
| E52 | index.html#floor-3-non-movables | 0 water, 1 sand, 2 dirt, 3 grass; bare dirt again high over the land (D23) |
| E53 | index.html#floor-3-non-movables | the first band is what can be waded (D24) (N11: three sheets of water, shallow to deep) |
| E54 | index.html#floor-3-non-movables | the forest floor: the grass, shaded; the marsh: the grass, toward the water (N11: the paper sheets from the waterline up: wet sand, sand, the dirt lip, grass; grass is a light neutral the season colours, E902) |
| E55 | index.html#floor-3-non-movables | what a face shows between two heights (L1): the grass is the land's top skin; anything raised above it shows bare earth |
| E56 | index.html#drawn-once-in-the-view-frame | Drawn once in the view frame: every tile a lifted quad, a face where it steps down toward the camera. Then every frame is one picture, moved and scaled. |
| E57 | index.html#drawn-once-in-the-view-frame | the masks at a quarter scale: the land in white and in shadow, the inland water |
| E58 | index.html#drawn-once-in-the-view-frame | a quad a, b, c, d (top-left round to bottom-left on the screen) grown half a pixel right and down, so the next tile's edge lands on solid paint and no seam shows |
| E60 | index.html#drawn-once-in-the-view-frame | the ground is painted flat; the light stands high to the left and in front and the meadow layer lights it (D353 lit): ground leaning that way warm, ground leaning away cool |
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
| E72 | index.html#the-building-art | The building art (preview 49, 19-building-art.js; Nov 3, the last build before the camera turn): every piece drawn from its own point lists, in units, feet at (0, 0), the front edge along x, the back up and to the right. A building's level and its research footing are skins (PB3, PB4, PB6, PB12); civs, seasons and flags are cut. |
| E73 | index.html#the-building-art | a building picture's height, from its look |
| E74 | index.html#the-node-art | The node art (the same file): six trees, three bushes, stone, gold and iron; r is a dice for the leaf blobs |
| E75 | index.html#the-figures | The figures (preview 49, 18-figures.js): people and beasts drawn from data, feet at (0, 0), facing right, a person about 21 tall; fr 0–3 the walk, 10 and up at work (the tool, two poses). One look a code; the soldiers' looks are Mid's own (F18), the rest of the roster stays in preview 49 as skins. |
| E76 | index.html#the-figures | the brushes: one drawing routine a shape; a look in books/sprites.js names its brush and the brush's settings ($side the owner's colour, $side*0.6 a tint of it, any colour*0.6 a tint of that) |
| E77 | index.html#the-figures | a figure's frame, from its look |
| E78 | index.html#b-the-buildings | B the buildings (layer 110; shells without Walk): the size in tiles (D8–D11; a wall piece is one tile, D12), Open or Closed (S Styles), the picture it wears. Health, prices and times come with the Content pull. |
| E79 | index.html#b-the-buildings | the buildings (layer 110), from their shells: name, size in tiles, Open, the picture, what it takes in |
| E80 | index.html#b-the-buildings | a building stands on n × n flat free tiles from (i, j); Closed takes them (OCC 2), Open leaves them walkable (OCC 3) |
| E81 | index.html#b-the-buildings | The Town Center: Who every corner · What one · Where Z2 on the road at D84, the same in all four (L12) · When the map is made · Why the game starts with a hall to gather at · How no roll: fixed |
| E82 | index.html#floor-5-movables | Floor 5, movables (layer 120): U units and M moveables are shells that walk. Each stands at a board point, walks tile to tile along a path (QBL), and does one thing at a time. |
| E83 | index.html#floor-5-movables | one a corner (C5–C8); the player is 0 |
| E84 | index.html#floor-5-movables | the units and moveables (layer 120), from their shells: name, look, pace (a D86 key) |
| E85 | index.html#floor-5-movables | the tool a villager works a find with (WORKTOOL): axe, hands, pick, from the Sprites book (PN1 tool), the one home econ.js reads |
| E86 | index.html#floor-5-movables | walking (L5, top rules): land or a ford is walked; a thing, a closed building or a step past the angle of repose is not |
| E87 | index.html#floor-5-movables | inland water bearing ice (QQ): walked as if flat; ice bears where its depth step is behind the walking front (K.iceOn) |
| E88 | index.html#floor-5-movables | the pace's books (QCB): its states and Pandolf's coefficients (D224), the friction a step needs (G9), slipping (G10); the player's side, told when its people slip |
| E89 | index.html#floor-5-movables | QBL A* over the tiles, the eight ways of D198, straight 1 and diagonal √2, the heuristic the octile distance (N74). goal(k) says when a tile will do; returns the tiles to walk, or null. Each open entry keeps the priority it was pushed with; a tile reached again by a shorter way is pushed again, and the old entry is skipped when it comes up (lazy deletion: the heap's order never changes under it) |
| E90 | index.html#floor-5-movables | most: the tiles it may open before giving up |
| E91 | index.html#floor-5-movables | the tiles one step from a tile, by the eight ways of D198, that a walker may step to (walkable, within the slope); no cutting a corner; the pathfinder and the reach both step by it |
| E92 | index.html#floor-5-movables | a unit on a tile; its stand wanders in the tile (D82) |
| E93 | index.html#floor-5-movables | a path of one tile (already there) walks to its middle: no step past the end |
| E94 | index.html#floor-5-movables | to a tile |
| E95 | index.html#floor-5-movables | to a tile beside one |
| E96 | index.html#floor-5-movables | the one distance and the one nearest search; the drop-off for a yield is the side's nearest building that takes it in (SC Drop-off, B's fifth field), a find the nearest of its kind within reach |
| E97 | index.html#floor-5-movables | to a tile along a building's edge (the ring of tiles round it, byB) |
| E98 | index.html#floor-5-movables | a find used up is gone; its tile is free again |
| E99 | index.html#floor-5-movables | one tick for every unit |
| E100 | index.html#floor-5-movables | walking: toward the next point at the walker's pace (QCB) over the ground it steps onto; true when it gets there |
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
| E116 | index.html#the-body-s-laws | a unit's picture: its look at its frame, its rank and its side's armour kit, facing right, painted once per look, colour, rank, kit and frame (LOOKBOX gives the box); a look marked elite carries the gold pennant at a rank (Mid's sprite) |
| E117 | index.html#the-things-drawn-each-frame-back-to-fr | The things, drawn each frame back to front, only those on the screen. A picture is painted once per look and zoom step, then stamped (the sprite cache); far out (D83) a node is a dot. The gifts are drawn direct, as tints of C. |
| E118 | index.html#the-things-drawn-each-frame-back-to-fr | W × H units, the art's origin at (tx, ty), its anchor (the point stamped at the thing's stand) at (ax, ay) |
| E119 | index.html#the-things-drawn-each-frame-back-to-fr | the node art's own small dice, seeded by the variant, so a tree's leaves fall the same each paint |
| E120 | index.html#the-things-drawn-each-frame-back-to-fr | each drawn at its stand (x, y on the screen), s pixels a unit |
| E121 | index.html#the-things-drawn-each-frame-back-to-fr | a find far out, from its look |
| E122 | index.html#floor-6-climate | Floor 6, climate (layer 130): one sky over the whole board (185 m across: one weather), acting on everything below (L7). The clock is Y: a day D20, a season D21, a year D22. |
| E123 | index.html#floor-6-climate | QA the sun: sin a = sin φ sin δ + cos φ cos δ cos H; φ D99, δ swings ±23.44° over the year from the spring equinox, H turns with the day (noon at the day's middle) |
| E124 | index.html#floor-6-climate | light by the sun's height, the twilights at −6, −12, −18 (SoRen's ramp, QD) |
| E125 | index.html#floor-6-climate | QP the one first-order lag, x to its level L over τ: x(t) = L + (x0 − L) e^(−t/τ) (N16; Mid's relax: wetness here, and the market, nerve, healing, loyalty to come) |
| E126 | index.html#floor-6-climate | QH the rain: a two-state chain, drawn once a game hour (a day's 24th): P(wet / dry) and P(wet / wet) are D102; a wet spell draws its intensity and the wind's sign once, from the rules' dice (QCL), a storm from D103. Snow falls instead when the air is at or under 1 °C (QI) |
| E127 | index.html#floor-6-climate | the season's mean, eased into the next |
| E128 | index.html#floor-6-climate | what falls |
| E129 | index.html#floor-6-climate | rain and snow come and go over tens of seconds (SoRen), toward the spell's intensity |
| E130 | index.html#floor-6-climate | QP settle: wet in D104, dry in D105; melting snow soaks the ground as rain does (Mid: what melts goes into the ground's water; nothing vanishes) |
| E131 | index.html#floor-6-climate | QO degree-day melt, rain on snow twice as fast |
| E132 | index.html#floor-6-climate | QQ: lake ice grows with the freezing degree-seconds (D350, by Stefan's law); ice on the ground grows the same way while the ground is wet, full at D225 |
| E133 | index.html#floor-6-climate | fog by the atmosphere (QK, QCL): the air keeps its dew point (D229 fog); falling rain or snow saturates it; past the fog's water the rest settles as dew and lowers the dew point (Magnus inverted) |
| E135 | index.html#floor-6-climate | QL, QM: strikes on Poisson waits in a storm |
| E136 | index.html#floor-6-climate | a strike: on the ground in view when close, a sheet flash when far; the flash never comes within D112 of the last (QL, WCAG 2.3.1), and the bolt is pinned to the ground it hits |
| E137 | index.html#floor-6-climate | a far flash: its thunder from beyond the screen |
| E138 | index.html#floor-6-climate | the rain's fall speed (QJ, Atlas's fit to Gunn & Kinzer); how many of the pool are falling: the strength |
| E139 | index.html#floor-6-climate | on the ground, under everything: snow whitens the land (screen), wet darkens it (multiply), ice whitens the inland water |
| E140 | index.html#floor-6-climate | over everything: what falls, the strikes, the flash, the night, the white of low visibility and the fog |
| E141 | index.html#floor-6-climate | SoRen's bolt: a channel from the top of the sky to the ground with a fork or two, three strokes from a soft glow to a bright core; its foot lights the ground round it |
| E142 | index.html#floor-6-climate | the channel wanders but leans home to its foot |
| E143 | index.html#floor-6-climate | the light: the sun's by the ramp, the horizon's warmth within 8° of it; rain no longer washes the whole picture grey nor darkens the wet ground (Mid tints only the sky band; Albert, Nov 7 20:11: gloomy, dismal), the weather's visibility (E381) remains; the night's wash is the eye's own darkness (D117's light on a log scale, QAL), one home with sight: moonlit snow is bright on the screen as it is to the eye |
| E144 | index.html#floor-6-climate | KW7: Koschmieder's reach (QK) limits sight on the Display floor; here the haze |
| E145 | index.html#floor-6-climate | Marsh (TW1): Who the map · What a wet margin round a lake or two · Where Z4's lakes, the land D115 out from the water · When the map is made · Why ground that is always mud (KI2), slow to cross, never built on · How count D114, lakes picked by the dice |
| E146 | index.html#floor-7-display | Floor 7, display (layer 140): what each side sees, now and nothing else (Albert, Nov 6: no fog of war; the land is always drawn). Every tick of D117 each side's eyes, its units and finished buildings, look at every other side's unit and building: seen when within the eye's range (QAL) and the line clears (QAM); the computers by the same rule (QAN) |
| E147 | index.html#floor-7-display | a thing's height: a building's from its look (D312), a person's from D117 |
| E148 | index.html#floor-7-display | each tile's top: the ground, a standing tree's height, a building's; worked out again when a thing is felled, lost or raised |
| E149 | index.html#floor-7-display | the line of sight (QAM): from the eye's height to the target's top, tile by tile along the grid line (Bresenham), its own footprints aside; blocked where a tile's top stands above the line |
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
| E162 | index.html#touch | Touch: one finger pans, two pinch; a wheel zooms about the pointer; a held finger picks more, drags the crosshair or draws a box (F21). |
| E163 | index.html#touch | the camera rule: the board never leaves the screen's middle; past its edge the camera may show what the bars cover there and a little more (D315 sea on the sides and below, sky above), so nothing of the board need stay under a bar; a board smaller than that sits centred |
| E164 | index.html#touch | what is under the finger: the tile at the land's height and the nearest unit it may see (yours, or one in sight and not hidden), within the larger of D246 hit and hitZ a zoom (Mid's hitAt); the menu answers the tap |
| E165 | index.html#touch | The seed of the day (QBF): the date as YYYYMMDD, the same map for everyone that day; a seed in the address overrides it. |
| E166 | index.html#touch | the door: what the modules may touch |
| E167 | index.html#touch | the test hook |
| E168 | menu.js | First Keep v100 · menu.js (floor 8): everything on the glass. Lives alone; it reads the world through one function, read(), and acts through one, act(verb, arg), backed by VERBS, where every verb carries its own whyNot. A dim button never runs: it says why. |
| E169 | menu.js | Its shape lives in the Screen book (books/screen.js): the mold, the Build tabs, the card's rows and the subject's ticks that pick them, the pages and which are Tall. Nothing of it is typed here. |
| E170 | menu.js, econ.js, combat.js, ai.js | its numbers live in books/measure.js (D); nothing is typed here |
| E171 | menu.js | the codes and their floors; Lock is a mark for us (no floor is locked yet) |
| E172 | menu.js | the Screen book: the Build tabs are its; a building shows priced once econ prices it, else Later |
| E173 | menu.js | the seat, and who it trains first: asked of the books, never named |
| E174 | menu.js | the classes War's Train box offers (D133), each as the first kind of it open at this age (Mid's kindOf) |
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
| E186 | menu.js | Train a kind: the nearest finished building that trains it; a kind before its age says which age it waits for |
| E187 | menu.js | a channel's volume, a step a tap (HX10) |
| E188 | menu.js | sound on or off |
| E189 | menu.js | a cell for what is drawn but not yet built: Albert's reminder |
| E190 | menu.js | the new game: the bell (D134), fog, the day's map or a fresh one |
| E191 | menu.js | tap a yield: new villagers go there (the ring) |
| E192 | menu.js | tap picks, slide places the ghost, tap again builds |
| E193 | menu.js | the cells: one mold; a verb's cell is dim when its whyNot says so, and a dim cell only says why |
| E194 | menu.js | a cell's object arguments live here by key, since the DOM holds strings (the hold verbs are gone: one tap does everything, Albert, Nov 8) |
| E195 | menu.js | the mold: a ribbon is an optional label and a strip of n equal cells; seg puts them in one frame with one lit. Every screen is a list of ribbons |
| E196 | menu.js | the mold: every screen is rows on one six-column grid (the Formation). A row holds cells and parts; a part is an optional label and a strip of choices, seg puts them in one frame with one lit |
| E197 | menu.js | Albert's Town Center: the bars in the title, three tabs, the queue, train, tech |
| E198 | menu.js | Fast and New sit in the title row; the volumes add a row, so the Yard ticks Tall (SN13) |
| E199 | menu.js | one row a name in SN4; each answers for the subject t, or says nothing |
| E200 | menu.js | the base: Albert's template. Corners Yard and War; who works where; Build and − + under each yield |
| E201 | menu.js | war mode: Albert's War rows. Left the people's orders, the middle box (map, squads and their dials, orders, kinds), right the army's |
| E202 | menu.js | the top bar: Albert's two ribbons. The stores, sound, play, mail; the age, the clock, people, idle, records, rank, army |
| E203 | menu.js | Relations and Misfits: one row a people: who and where they stand, (a bribe for misfits), the three stances, ✓. Drawn now, built with diplomacy (Later) |
| E204 | menu.js | the five stores, sound, play, mail (SN5) |
| E205 | menu.js | a page or a card is a bottom sheet: it opens from the bottom edge over the base's rows and hides them while it is open, as tall as its own rows (Albert, Nov 9: no fixed height); the card waits behind a page |
| E206 | menu.js | the ghost: press and slide on the map moves it; the tile under the finger is its middle. Build confirms. Nothing of this reaches the canvas's own pan while a ghost is up |
| E207 | menu.js | the tap: the glass answers first. A ghost takes it; aiming takes it; a unit or a thing under it becomes the subject, and a picked villager or soldier is sent at it |
| E208 | menu.js | one height for every page but the Tall ones: each is laid out once, the tallest sets the panel, the others fill it (Albert: menus never move) |
| E211 | menu.js | the game opens on the player's hall |
| E212 | menu.js | the version, said once (D171) |
| E213 | econ.js | First Keep v100 · econ.js (floor 9): the economy. Lives alone; touches the world only through FK. Costs, homes, training, sites, ages, upkeep, and the villager as one state machine: idle, walk, gather, carry, build, repair, wait. |
| E214 | econ.js | seconds played, and when the bell rings |
| E215 | econ.js | gone: marked when it leaves the map (below) |
| E216 | econ.js | paying: a side pays all of a cost or none of it (SB Cost) |
| E217 | econ.js | a site: a building paid for and placed at done 0; villagers raise it. canPlace mirrors build's rule without building |
| E218 | econ.js | training, research and the age: one queue at the building, as long as the mold's six and what research adds (QCA); the head trains, is learned or rises, in its own time after research (D124, the step's own, or the age's, D129); a price is the book's after research (QCA), an age's D129; a new unit stands on a free tile beside and takes the side's rally job; a step or an age in the queue is no person |
| E219 | econ.js | the age (Mid's ageUp): the next age, never the hidden sixth until the peace opens it; paid at its price (D129, the ages of D130) and queued at the seat, which trains nothing else while it rises; the side's aging is its time left |
| E220 | econ.js | the jobs (SM Gather): a villager's job is the yield it works; counts are read, not kept |
| E221 | econ.js | QV: the find of a yield whose rate of return R is best (the walk out, the walk home and the crowd counted), of those not full (D195), not left alone for no path (D137), in the box it was sent to cut, and within the look (D197) of the point given; the straight line under-counts the walk home, so finds are weighed by it first and walked (wayLen) best first until none can beat the best |
| E222 | econ.js | a find no path reaches, or with no spot free on its ring, is left alone a while (D137), and the next beat chooses again: one walled in tries one find a beat and waits, never every find on the map at once |
| E223 | econ.js | assign: + sends an idle or waiting villager (else the one earning least, QV, on another job, never one posted to a field) to the yield's best find; − sets one of the job's villagers idle |
| E224 | econ.js | a stroke of work (gathering or raising) faces its work and sounds on every other beat; the tick: training and research, ages, upkeep, the villagers, the bell |
| E225 | econ.js | a new game: the book's stores (D172); the bell stays as Start set it |
| E226 | econ.js | the score (QBR): what a side holds, cost ÷ D135, everything it gathered ÷ D135, and what it paid for research and ages (the ledger's research, Mid's spent) ÷ D135 |
| E227 | combat.js | First Keep v100 · combat.js (floor 10): health, the blow (QBO, QBT), the foe (QAG, QAF), nerve and the rout (QAI, QAO, QBQ), a soldier's day (its yard, kiting, healing at a shelter), squads, shapes and tempers, towers' reach (QAJ), the missile, sparks and standards. Lives alone; touches the world only through FK. A soldier's jobs: idle (at home, guarding its yard), march (to a point, fighting what it meets), hold (standing at that point), fight, rout (broken and running, or called home) |
| E228 | combat.js | tiles from a unit to a thing: to a building's footprint, in the grid's frame |
| E229 | combat.js | gone: pulled down (econ marks it) or dead (die marks it) |
| E230 | combat.js | the blow's strength (Mid's dmgOf): its blow after research, blades worn by frost, rain or snow (D234, its research a share), a mounted shape's edge, its temper, its side's hunger |
| E231 | combat.js | a blow lands (QBO); it shakes the struck one's nerve by where it comes from (QAI), sends it off by the impact (QBT), throws sparks and, from a shooter, a missile; a kill steadies the striker |
| E232 | combat.js | QAF and QAG the foe (Mid's unitPower, groupPower, canBeat, foeValue): one its group can beat first (Lanchester: its side near summed against the foe alone, with the counters both ways), then the most harm the foe does a second for the time to kill it and reach it; wildlife picks the most worth among what bites it |
| E233 | combat.js | the best foe in reach (Mid's bestFoe), the nearest one (nearestFoe, round any point), the nearest foe building (nearestFoeBld; the widest one's reach, D11, added to the grid's search) |
| E234 | combat.js | to within reach of a thing, with a short search (D147) |
| E235 | combat.js | a wave falls back to its seat, else to any building of its side |
| E236 | combat.js | a side's wave in the field: its soldiers at the start, so nerve can be read (QBQ) |
| E237 | combat.js | to a tile, or near one that cannot be stood on (a building's); no way there, it strikes a foe building that blocks it |
| E238 | combat.js | QAF a group's power: each one's health × its blow (Mid's dmgOf), the blow at least D194, over D193 per, a building-only kind at D193's bonly (Mid's unitPower and powerOf, one home) |
| E239 | combat.js | a soldier's nerve (QAI): at rest it settles back (QP), faster by its own wall or tower; outnumbered it drains; at nothing it breaks and runs (QAO), the player told once in a while |
| E240 | combat.js | the bars: a unit's or building's health, when it is hurt and in sight; the crosshair of the player's wave |
| E241 | ai.js | First Keep v100 · ai.js (floor 11): one brain for every computer's side, three personalities (D303: Raiders, Rivals, Fortress), Mid's think. Lives alone; acts only through ECON and WAR, the same doors as the player; it sees the whole map, as Mid's computers did (Albert, Nov 5). |
| E242 | ai.js | the seat, and the hands it trains |
| E243 | ai.js | the shells a side can pay for that tick a capability |
| E244 | ai.js | each yield's camp: the drop-off that takes it in |
| E245 | ai.js | a spot: the nearest free footprint to a point, searched in rings, kept off the home's own ring so the roads stay open |
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
| E267 | econ.js | a side's economy, fresh: its age, the steps it knows, its gathered total, the rally, and the stores' flow (this minute's in and out, the last minute's, each by reason) and the ledger of the whole game |
| E268 | econ.js | earn and spend: every store in or out goes through these two, the one home for the stores, the minute's flow (by resource and by reason) and the ledger of where it came from and went (its words in the Words book, J1); a gain from gathering counts toward the score's wealth |
| E269 | econ.js | what was paid comes back the way it went out: the store, the minute's spending and the ledger step back, so a cancel is as if the order never was |
| E270 | econ.js | the stores' flow a minute: the last full minute, or before there is one the minute so far scaled up (from at least D189 seconds); net is in less out; a store's velocity runs −1 to +1 by tanh, and falling with under two minutes left is the worst there is (D189) |
| E271 | econ.js | each minute (D188) the minute's in and out become the last minute's |
| E272 | menu.js | the words helpers: numbers shortened (1.2k, 12k), plurals, 'a, b or c', a percent slower, a place as its lettered square, a ledger line; their words in the Words book (J), their numbers in D191 |
| E273 | menu.js | the first ending in the Words book (J5) that fits the name |
| E274 | menu.js | how much slower a full cover of mud or snow makes a march, in percent, from its terrain factor f: 1 − 1 ÷ (1 + f) (QN) |
| E275 | menu.js | a place as the map's lettered squares, measured from the board's corner: D190 units a square, letters across, numbers down (A1 to V22); off the board, the nearest square |
| E276 | menu.js | a ledger line: its reasons largest first, each in its word and shortened, apart by a dot; under half a unit is left out |
| E277 | index.html#the-door | QCA, the effects: what each side has learned, and each side's numbers worked out once until its learning changes; a new game forgets both |
| E278 | index.html#the-door | a thing's keys, the names an effect may reach it by: every head of its code's letters (B, BR for BR1), its code, its ticks and a soldier's class |
| E279 | index.html#the-door | a number's base, from its one home: the pace (D86), a building's health (D139) or a unit's (D138), a find's or a field's rate, a price (D123, or the step's own), a step's time (its own), a unit's training (D124), a site's raising (D125), a queue's length (the mold's six, SN1), a load (D87), a home's room (D127), mud's and snow's cost (D106, how deep it sinks), studs (none), a soldier's share of a blow before armour (D228); any other key is the unit's D138 entry |
| E280 | index.html#the-door | the one window for a kind's number after research (QCA): flat adds first, then the boosts summed and applied once to that, then each cut on what is left (Albert, Nov 5 18:07), then the lowest kept; a price rounds each yield to the whole unit |
| E281 | index.html#the-door | learning a step puts its effects in force for that side; every unit and building of the side keeps its share of health as the most it can have moves |
| E282 | combat.js | who counters whom (Mid's vsMul): the most of the striker's counters (D138 vs, its ranks' added) over the struck one's kind, class and tags; the one home the blow (QBO), the foe (QAG) and the odds (QAF) read |
| E283 | combat.js | QAF the odds an army gives itself against a side, the one home the computers read, counting only the foe's soldiers and towers its side has seen (E624; Albert, Nov 8: the all-seeing was a crutch of the live test): the counters summed both ways over the first of each army, their ratio held in D193 (Mid's matchup) bending my power |
| E284 | combat.js | against theirs: its soldiers, its towers (not its seat) at D177 each, its people at D192 (Mid's powerFrom); the square law as odds, p² ÷ (p² + q²), which is r² ÷ (1 + r²) with r = p ÷ q |
| E285 | combat.js | the Sides book (I) and the stances made in play, each pair's own; a new game forgets them |
| E286 | combat.js | who belongs (the kind decides): a side's own are no group; an animal (I4) is a beast; a kind of the wild in a group's list (I3) is that group's; the rest of the wild is the Natives' (Mid's gangOf) |
| E287 | combat.js | a stance is the pair's own, or the book's start (I2); a treaty sets it both ways between its signers only, never for a third (pacta tertiis, N159) |
| E288 | combat.js | the one hostility test (Mid's isFoe): never one's own; an animal is everyone's foe; one of a wild group is a foe when the side is at war with that group; between sides, war |
| E289 | combat.js | the wild looking at a side: an animal fights everyone; a group fights a side at war with it, but starts nothing with a computer (decision 4b: a camp fights a computer only once struck on its ground, which comes with the camps) |
| E290 | econ.js | the Research book (O) by code and by key |
| E291 | econ.js | a find's or a field's rate after the side's research (QCA): the one window, D88 or the row's own rate as the base |
| E292 | econ.js | Mid's research lines: a line is the steps of one line at one building, in the book's order; a step waits on the one before it and on its needs (by key; a need not yet in the book is never met); the next is the first unknown step of the line |
| E293 | econ.js | research (Mid's researchWhy and research): a step is refused when known, before its age, before its needs, already queued, with no finished building of its row, the shortest queue there full, or not paid for (the reason as a word for the menu); else paid and queued at that building; learned when it leaves the queue, its effects applied once (FK.learn) |
| E294 | index.html#the-building-art | research shows on its building (Mid's UP, PB12): the steps learned of those its row names, none, some, or half or more; a building's level (PB3, PB4, PB6): the side's age against the look's, or how many steps that raise it the side knows; the footing drawn under the walls |
| E295 | index.html#the-building-art | the keep at its level: the bastion from its points in the Sprites book (PB13) |
| E296 | index.html#floor-5-movables | the walked length (QBL) from a tile to beside a building: a straight step one tile, a diagonal √2; no way, infinitely far |
| E297 | index.html#floor-5-movables | QCI standing spots: everyone stands on a spot of its own a pace (D196) apart. A point's spots lie on the hex lattice, nearest first, rings enough for D128 people and D196's spare |
| E298 | index.html#floor-5-movables | a find's working ring (Mid's WORK_R, D196): as many spots as fit a pace apart round it, ⌊2π·r ÷ pace⌋ (Mid's findCap), laid on a ring wide enough that the chord between two is a pace, and clear of the ground the find keeps (D169) |
| E299 | index.html#floor-5-movables | spot i of c: round a find on its ring; round a building on its outline, the lane of tiles beside it, k a side, at least a pace apart, corners too, clockwise from the top-left (Mid's spotAt, in tile coordinates); round a point on the lattice; null past the last |
| E300 | index.html#floor-5-movables | a spot is free when its tile is walked and nobody stands on it or has claimed one within a full pace, 3 ft (D196, OSHA 1910.142(b)(3), N166); at less, neighbours overlapped, the push moved them and the walk back returned them: the twitch (Albert, Nov 10, N17 #16, found against the rule) |
| E301 | index.html#floor-5-movables | the spot u keeps at c, else the free one nearest u (round a point, the nearest the point) |
| E302 | index.html#floor-5-movables | walk to a spot of its own at c: the path's last tile becomes the spot itself; false when none is free or none is reached |
| E303 | index.html#floor-5-movables | a path's last point is reached within near-enough (D196), any point within a pace when the crowd has pushed it this step: a walker held off its way by people takes the next point |
| E304 | index.html#floor-5-movables | QCJ separation, neighbours only (the M3 grid): two closer than a pace part to a pace, each moved by the other's share of their mass (the Mass book, QBT's bodies), the lighter further; two on one point part along a direction fixed by their places in the roll; nobody is pushed into a tree, a wall or water |
| E305 | index.html#the-woods-cache | a find drawn smaller as it is used: PN1's left share and the rest by what is left (Mid's nodeScale) |
| E306 | econ.js | the forager (QV, QX): a find takes D195's cap (a tree one feller, a field one worker) or as many as its ring has spots; the others on it crowd its rate by D195's hold; span: how far a find or a building reaches, so the straight line less both spans never over-counts the walk |
| E307 | econ.js | QV R = c / (c/g + 2d/v + w·c/(A·v)): c the load, g the rate crowded (QX), v the walk, d the walked length to the drop-off (cached per find), w the straight walk out, A what is left up to a field's life (a tree begun counts as worth finishing); low: d by the straight line, a bound. A find with no free spot pays nothing |
| E308 | econ.js | a lost find (Mid's decision 1): it delivers what it carries, then looks from where the find ran out within the look (D197), widening over tau; nothing found, it waits on a spot at its drop-off and looks again every few seconds, with no end; a box that is done sends it back to its work |
| E309 | econ.js | builders who finish a place of work take it up (Mid's startWork): a field if nobody works it; a camp (a drop-off that takes fewer than every yield) sends them to the best find it takes |
| E310 | econ.js | a box over finds (Mid's boxCut): n villagers, idle first then the nearest, cut the finds in it, from the nearest open one outside when none inside is open, then go back to the work they left; Send out: the last villager on a field goes idle; posted: on a field; idlePost: a finished field nobody works |
| E311 | econ.js | a trained unit steps out onto the free spot of its building's outline nearest the middle (Mid's stepOut); none free, the queue waits; with your rally flag up, a soldier marches to it (Mid's rally0, F21) |
| E312 | index.html#floor-5-movables | nudged off its spot, it gives way while pushed and steps back once the crowd lets go: no tug of war with a walker, no shuffle between two on their spots (a push moves each less than near-enough) |
| E313 | econ.js | how many of a building a side may have now: its age's limit with research added (D199), none before its age (D200); why not, in Mid's words (capWhy) |
| E314 | econ.js | why a building may not stand here, Mid's rules in order: the edge, the limit, the ground under it (a gate may take its owner's wall piece), two squares from every building unless one is a wall, gate or field, and never touching one that trains (canPlace); capped: the limit already asked by the caller (the computer's site search, E686) |
| E315 | econ.js | two squares from every find too, measured from the footprint's edge to the find's middle (Mid's nodesNear) |
| E316 | econ.js | the ghost snaps to the nearest spot that fits beside one of yours (touching, or a lane apart, edges or middles in line) or in line with one farther off; else it stays where the finger is (Mid's snapGhost) |
| E317 | econ.js | taking a building down pays back half its price, all of it early in the build; its line is paid back in full first (Mid's shellBack, refundOf, demolish) |
| E318 | econ.js | a wall dragged from corner to corner: a straight run of tiles, four-connected so nothing slips through a diagonal (Mid's wallLine); laid piece by piece while the stores last, each sent a builder; the seal is a foe's walk out from the Town Center over the tiles not yet built too (Mid's sealPath, by v100's A*) |
| E319 | econ.js | the walk starts on the Town Center's own floor; walls being laid count as built; everything is put back after |
| E320 | econ.js | a builder remembers the work it left (its find and yield, and whether it was pulled off it) so it can go back (Mid's sendBuilder); one already beside the site stops the walk it was on, so its arrival cannot turn it back to that walk's work |
| E321 | econ.js | a new site gets the nearest free villager; with none free, your nearest worker is pulled off and goes back after, a computer's lowest earner keeps building (Mid's autoBuilder and pickVil); a line of wall gets two at most, who work down it |
| E322 | econ.js | back to the very find it left if it still stands, else the best of its yield, else idle (Mid's backToWork) |
| E323 | econ.js | the next site for a builder done: a wall piece close by, else a site nobody raises (Mid's repairTick) |
| E324 | econ.js | a site finished: a drop-off or field puts its builder to work there, unless it was pulled off other work; else the next site, else back to work |
| E325 | econ.js | mending, Mid's: three times the build time for a whole building, a quarter of its price paid as it goes; short of any part, it stops (QCK) |
| E326 | econ.js | a crew of n raises a site at n^0.7 (QAC), counted once a tick; frost slows stone work; the site's health rises with it |
| E327 | econ.js | of the buildings that can take an order, the one with the shortest line (Mid's shortest) |
| E328 | index.html#floor-5-movables | a gate is walkable only to those its owner does not count a foe: asked of combat.js by the shut hook, for the walker on the path in hand; none in hand, it is shut |
| E329 | combat.js | a gate is shut to a foe of its owner, and to an unknown walker (the seal's foe) |
| E330 | ai.js | the computer's wall ring: from its age, with stone, a few pieces a round, gates first, while it keeps its stone (Mid's decide) |
| E331 | ai.js | an arc of wall round the Town Center facing the middle, four-connected; its two squares nearest the middle are the gate (Mid's wallPlan) |
| E332 | menu.js | who trains a kind: the building with the shortest line; walls are laid as lines; walls and gates show the seal |
| E333 | menu.js | the ghost to the finger, lifted above it on a phone, snapped beside yours; the reason it may not stand is kept for the label |
| E334 | menu.js | a wall's next corner snaps flat or upright when nearly so; its tiles from its corners (Mid's wallSnap, wallSet) |
| E335 | menu.js | a finger on a wall's corner moves it, on its line slides the whole wall; elsewhere it looks around and a tap adds a corner (Mid's wallHit, wallDrag) |
| E336 | menu.js | Build: a wall line laid while the stores last, said in one toast; a building sent its nearest free villager (or the one picked), then, for a building that ticks Repeat, the ghost waits on the next spot beside it until the limit or the purse says no (Mid's commitPlace; N17 #17) |
| E337 | menu.js | while placing, the finger moves the ghost (a wall's corner or line), not the map; the drag holds only its own finger: a second finger, and the first one's lift, stay the map's, so the map never keeps a finger that has left |
| E338 | menu.js | the ghost's own art tinted green where it fits and red where not, one tinted copy a sprite and colour (Mid's ghostTint) |
| E339 | menu.js | while a wall or gate is placed: a red line where a foe could walk in, or Sealed over the Town Center (Mid's drawSeal) |
| E340 | menu.js | the ghost: a wall's tiles green or red with its corners, the first ringed green; a building's guides to yours in line and its tinted art, no footprint box (Mid's drawGhost, drawGuides) |
| E341 | menu.js | a tap on open ground while the Build page is open marks what fits there (Base: the suggestion is shown in blue with Fits here, never picked for the player; Mid picked it and dropped its ghost) |
| E342 | menu.js | dragging the ghost near the screen's edge scrolls the map (Mid's edgeScroll) |
| E343 | menu.js | what fits a spot: a drop-off for finds far from theirs, more of what stands round you, a wall in a narrow way (a gate beside your wall), a home when room is short; the best score wins (Mid's suggestAt) |
| E344 | index.html#floor-3-non-movables | fish round every lake: a spot every D218 per of its radius, walked out from the middle to the shore and set inset back into the water, each holding its share of the lake (Mid's layFish) |
| E345 | index.html#floor-3-non-movables | a find laid where something falls (game becomes a carcass where it stood); a lake near enough to stand a dock by, past its beach |
| E346 | index.html#floor-5-movables | a boar near every Town Center, at the book's spot in each corner (Mid's boar) |
| E347 | econ.js | the gather beat: the field is worked now (its soil wears); a flock's food goes straight to the store; a plot with an amount runs down and its worker waits by it when it is cut out (Mid's replant wait); a famine weakens the work (hungerOf) |
| E348 | econ.js | what a unit eats a second: its kind's shares (its Upkeep, with research) of a person's day; a famine past its grace weakens work and blows (Mid's shareOf, hungerOf); fish are worked only near a finished dock of the side (Mid's dockNear); food in reach is any find, field of one's own or game (Mid's foodInReach) |
| E349 | econ.js | everyone eats, every moment: a villager working food eats from its find, not the store (a field and game for nothing, a shepherd from the store); the store empty is hunger, and with no food in reach a famine, timed from its start (Mid's upkeepTick, starveTick) |
| E350 | econ.js | an order of yours costs its soldiers' meals for D213's seconds, never more than the store holds (Mid's orderCost); the tiredness is the charge's (E806) |
| E351 | econ.js | the year's work: everyone eats; a field's soil wears while worked and rests back, never under its floor (QAA, Mid's natureTick); each season's turn once |
| E352 | econ.js | each season's turn: food in store spoils (QAD); in spring fish regrow (QY), lambs come (QY) and a tended flock is culled to half for mutton (QZ); wolves near a pasture take sheep every season; the harvest of the year is rolled in spring (Mid's seasonTurn) |
| E353 | econ.js | a cut-out plot is replanted at D222's share of its price and is full again; from a drop-off, every cut-out plot of what it takes, nearest first, as many as can be paid for (Mid's replantWhy, replant, cutOut, replantAll) |
| E354 | econ.js | send a hunter: the given villager, or the nearest idle one, else the nearest from other work (not a builder or a posted worker); it fights the game (Mid's sendHunt) |
| E355 | combat.js | QBO the blow on a unit: × the counter; a villager's javelin on game × D221; on a soldier, an animal's at D231 wild, a runner's × routHit, × its armour share (D228), its shape's hit and against riders, from behind a blade × D141; roofed against missiles; on a building × the striker's bld (Mid's hurt); a stranger's blow is × (1 − D355 fight × (1 − its familiarity)) (Albert, Nov 8: the outsider pays) |
| E356 | combat.js | a building that falls pays its destroyer D233 of its price (Mid's plunderBld); game falls as a carcass of its meat where it stood, and its hunters butcher it (Mid's kill) |
| E357 | menu.js | hunt a beast from its card; replant a cut-out plot, or every one a drop-off takes, from theirs |
| E358 | menu.js | a pasture's card counts its sheep |
| E359 | menu.js | the town is told what food, the seasons and the flock do, in the Words book's news |
| E360 | index.html#floor-5-movables | the ground under a walker as it steps toward the tile to (QN, QR): its mud (the marsh always), its snow cover, its ice (D225), the friction its step needs by what steps (G9), what the ground offers off the ice (dry to mud to snow) and on it (G8 by the air, melting to hard; the studs' G10 if iron bites), the grade up to it, and which way it walks against the wind |
| E361 | index.html#floor-5-movables | QCB the pace: Pandolf's cost of walking solved for the speed, its power set by the walker's base (D86 with research, QCA) unloaded on flat firm ground in still air; the load, the ground's η, the grade and the wind change it; × each state (D224) and, after a slip, the shortened step on its share of ice (QR) |
| E362 | index.html#floor-5-movables | QR each second on ice: the step lands on the ice with the chance of its cover, else on the ground; it slips exactly when the friction it needs is more than that ground offers, and walks on wary (a shorter step) until it is off the ice |
| E363 | index.html#floor-5-movables | a slipped walker stands G10's seconds; which way it walks, for the wind |
| E364 | index.html#floor-6-climate | above freezing lake ice's degree-seconds fall four times as fast; ground ice thaws by the degree (D225) and its degree-seconds are set to match what is left; the freezing front and the walking front in depth steps (D350), from the freezing degrees |
| E365 | index.html#floor-6-climate | the share of the ground under ice: √ of its freezing degree-seconds over D225's full (QQ, Stefan) |
| E366 | index.html#the-figures | the armour kit a side has learned (Mid's KIT): 0 to 3 steps of the Sprites book's kit, each turning a person's slots (mail and a steel helm, then plate, the great helm, its crest and a cape in the figure's own colours), with a shoulder guard of leather, mail or steel |
| E367 | index.html#the-figures | one drawing list for every figure that is not a person or a beast (the engines, the chariot, the elephant, the riders, the elite pennant): each part a brush (P, E, L, Q, rect, wheel, planks, helm, horse, person), in a frame moved and turned (at), or drawn only in the blow's frame (atk) or out of it (rest); a value may sway with the stride or change in the blow's frame. The numbers live in the Sprites book |
| E368 | index.html#the-figures | a look by its rank: level 0 the look itself, level n the nth of its rank list, past the list its last (Mid's LOOKS by tier) |
| E369 | index.html#the-door | the Unit shell's classes: a class's kinds in book order; what a building trains (D133: a shell, or a class's kinds); a kind is open from its age (D130); a side's civilisation trains its own kind in place of the common one it replaces (Mid's civKind), and no other side trains it |
| E370 | index.html#the-door | a kind's ranks (Mid's tiers): the steps whose rank names it, learned, in book order, give its level and its name; the kit is how many armour steps a soldier's side has learned |
| E371 | econ.js | the army's ceiling: soldiers (a kind with a class), queued ones counted, against D226 (Mid's ARMYMAX; a fallen side's share, capA, joins it with M30) |
| E372 | combat.js | the army: a side's soldiers, the kinds with a class (Mid's armyOf); BUSY names who keeps to its own work and armyFree leaves them out (the routed now; the spy, the shrine, the escort and the school with their modules) |
| E373 | menu.js | why a kind waits: the age it opens in (Mid's trainWhy) |
| E374 | index.html#floor-5-movables | the load, the ground's η (QN, research cuts), and the wind's drag ½ρCdA v/v/ (W1, by the mass to the ⅔, D224), v the walk against the wind (Pugh) |
| E375 | index.html#floor-5-movables | aV² + bV + c = 0: a the walking term, b the grade and the wind as a grade (100F ÷ g), c the standing and load terms less the walker's power; the positive root |
| E376 | index.html#floor-6-climate | QCL the weather of the moment: rates, wind and visibility from the strengths, fog's water in calm air the vapour above saturation (CALVIS: Kunkel's fog term beside rain and snow); fog's share of a km's contrast for its looks; the wind signed and gusting; a blizzard's hours counted while its three conditions hold, and the flag at the NWS's three hours |
| E377 | index.html#floor-6-climate | the weather's book (D229), a game hour, the gusts (a fractal of the day's dice, set at the start) and the particle pool (the looks' dice) |
| E378 | index.html#floor-6-climate | QCL rain and snow rates, the wind, its gusts and the visibility (QK: Koschmieder over rain's and snow's extinction); a blizzard by the NWS: snow, wind or gusts at 35 mph or more, visibility under a quarter mile |
| E379 | index.html#floor-6-climate | rain: Marshall–Palmer sizes at the rate (λ = N0 R^exp), each drop falling at its size's speed in metres a second on the screen, carried and slanted by the wind |
| E380 | index.html#floor-6-climate | snow: flakes falling slow to fast by size, carried by the wind and swaying |
| E381 | index.html#floor-6-climate | the white of low visibility: the contrast lost over the screen's width, 1 − e^(−3.912 d ÷ V) (QK) |
| E382 | combat.js | a side knows a step of research by its key |
| E383 | combat.js | the player's three squads (Mid's battalions): each one's plan by class, its shape, temper and intent (the dials), and the one picked for orders (none: the whole army); the computers keep Guard and the line |
| E384 | combat.js | who is in which squad (Mid's rebattalion): each keeps its squad while its class has room in the plan, the rest fill the first squad with room; none before Battalions |
| E385 | combat.js | a squad's plan by class (Mid's sqPlan): a step of one under ten, five above, the whole squad at most D227 |
| E386 | combat.js | what a squad lacks, by kind to train (Mid's musterGap): its plan less its soldiers and those mustering for it, each class as its first kind of the age |
| E387 | combat.js | where a blow comes from (Mid's fromWhere): the cosine between the line's facing (its own and its comrades' near, D232) and the striker; the front whenever it can turn to meet it or a comrade covers that side |
| E388 | combat.js | QAI a loss drains each soldier of its side within D231's lossR by 1 ÷ (D142 × n) (Mid's died, Dupuy's break) |
| E389 | combat.js | Lanchester's odds above a half is exactly the ratio above one |
| E390 | combat.js | a soldier at home keeps to its yard: within D235 of its post or of its Town Center (Mid's nearHome) |
| E391 | combat.js | a foe building in the way is struck (Mid's findBlocker) |
| E392 | combat.js | a group dressed into its shape at a tile (Mid's formUp): facing from home to there, the squads in order, blades before shooters; a column three files, a square √n, a front one rank, a choke three, a line about twice as wide as deep, a wedge point first, support a ring of blades round the shooters; each walks to its own place, at the pace of the slowest that is not an engine; a drill (the War Director's) keeps the shape for its time |
| E393 | combat.js | time to contact: a soldier in a drill fights where it stands when the nearest foe would reach it before it reaches its place (D242; Mid's drillOn, drillHold) |
| E394 | combat.js | idle soldiers form up at the building that trained them, one block per squad, else one block per kind of soldier (Albert, Nov 10, #32: by type); at home an army stands in the yard of the building that trained it (or its Town Center), toward the map's middle, a block a squad side by side, blades in front, shooters behind (Mid's formUp, homeSpot) |
| E395 | combat.js | a broken soldier runs D231's run a step from the nearest foe (or toward home) at its own pace, for the run's seconds (research shortens it), then comes back at D231's after (Mid's routSecs) |
| E396 | combat.js | a soldier's day (Mid's solTick): nerve, healing by a shelter (QP), its drill; it keeps its foe while in reach of its sight × D238 leash × its temper's chase; it looks for the best foe and keeps the one it has unless the new is D132 better or the old is at its blade; at home only near its yard; No pursuit and Buildings first; Hold fights only what comes within reach; a march arrived holds; at home it walks back to its post |
| E397 | combat.js | QAJ the missile: projectile motion with quadratic drag (the arrow's, W10), loosed at D245's angle, stepped until it lands; its speed for a distance found by halving; a tower reaches as far as the arrow that lands at its bow's ground reach would land from its height, plus its research |
| E398 | combat.js | in reach: it faces its foe; a shooter reloading with a blade near steps back (Mid's KITE), then strikes when ready |
| E399 | combat.js | the missiles in flight: a streak along the drag path, its tail D245's share of the flight |
| E400 | combat.js | a blow's sparks (Mid's sparkDraw) |
| E401 | combat.js | the standards (Mid's drawStandards): a group of D sprites' least on the move carries its side's flag, a ring at its foot as full as its health |
| E402 | econ.js | Muster (Mid's musterN, musterCost, musterWhy, muster): a squad's lack in one order at the War Council: D244's times the price, the slowest kind's time shared by the buildings that train it × D244's time; refused without the step, with nothing lacking, without a council, a kind's building, room in the army or the town, or the price (a reason as a word for the menu); it comes out together into its squad |
| E403 | menu.js | the squads: a tap picks one for orders, a tap on the one picked opens its dials; Set up opens them for the one picked or the whole army |
| E404 | menu.js | the squads' words and the step each dial waits for (Engagement, Formations, Battalions) |
| E405 | menu.js | the War Council's card: the three squads, the picked one's plan by class (− and +) and Muster for what it lacks |
| E406 | combat.js | the orders, missions and the War Director's measures and words; the groups on the march (ORD), the missions by squad or the whole army (MS), and the moves' waits (AT) |
| E407 | combat.js | the archers' arc (Mid's dress 'arc'): each on a circle of the arc's radius round the foe, a rank's gap apart along it, facing in |
| E408 | combat.js | a charge spent: the pace drops to D249 slow and settles back to the walker's own (QP, N16); while it lasts the pace is D249 spd times the charge's research |
| E409 | combat.js | the orders' shared measures: a point of a tile, the tile of a point, the length between, a group's centre, a tile's straight steps |
| E410 | combat.js | the walk over the straight line (Mid's routeK): the way by A* (QBL), its steps summed, held within D247 least and route |
| E411 | combat.js | a group's order you can follow (Mid's march): its tile, label, start and walk ratio; each soldier carries it, and the player hears where they march |
| E412 | combat.js | each soldier's one word (Mid's armyStatus): rout, fight, rally (sent home, walking to the flag, or away from its place), march, or hold once still for D247 still |
| E413 | combat.js | the obvious order for what is picked (Mid's order, Albert Nov 2): a foe is fought, a beast hunted, a site raised or mended, a field or camp worked, a find gathered, the ground walked, each villager to its own spot; a side not at war is refused |
| E414 | combat.js | missions: a mission's soldiers, the hostile soldiers a group sees near it, and the chance (QAF) of the group against them with the counters both ways |
| E415 | combat.js | each beat: every order's centre, count, fight and time left, arrived once all have stopped (Mid's ordersTick); every mission goes, acts or is done, its chance eased, lost or losing said once (Mid's missionsTick) |
| E416 | combat.js | Go (Mid's hudFire, hudGo): a squad's idle soldiers, else the army's, march on the crosshair as one order and one mission; every ready squad goes, else the army |
| E417 | combat.js | who can still reach a fight in time, fastest first, until the fight is even (Mid's reinforcePlan); grouped into waves by arrival |
| E418 | combat.js | the War Director: the soldiers of a kind that can go, the crosshair's tile, a move's wait in seconds; the charge's reason, the charge, fall back in order |
| E419 | combat.js | the Director's three moves (Mid's DIRECTS): each returns what it says, a reason without its bang when nobody moved |
| E420 | combat.js | a kind's move, one tap (Mid's direct): it says its word, pays its meals (D213), tires the soldiers and sounds its event |
| E421 | combat.js | the narrow at a tile: the open ground across the facing, a tile at a time each way until a wall, a tree or water; narrower than the widest choke it is a choke, held in as many files as it is wide (D.choke; Mid's chokeAt without the drag) |
| E422 | combat.js | the nearest cover (Mid's coverNear): an open tile with forest within D252 cover, within D252 find of the crosshair |
| E423 | combat.js | an ambush in place (Mid's ambushTick): once there it goes to ground (no foe sees it); a foe within reach or a blow springs them all with a charge |
| E424 | combat.js | your groups on the march (Mid's drawOrders): a dashed line to where they go, a ring there, the time left; the rally flag (flagAt); leaves over a hidden soldier (leavesOver) |
| E425 | index.html#touch | the finger's gesture: where it went down and is, when, and what a module made of it (a line, the crosshair, a box); a hold after D246 hold |
| E426 | index.html#touch | the hold's ring once the finger plainly holds, and the box being drawn (Mid's drawTouch) |
| E427 | menu.js | Attack is Go, held it is Home (Mid's station); the rally flag, held the ambush; the choke tool; reinforce the mission most in need; a kind's two moves; the quick action's sword and close |
| E429 | menu.js | Albert's one rule for the finger (Build 40, Nov 2): a tap picks yours, a second tap opens the card; with yours picked a tap is the obvious order; on open ground with nothing picked, the sword and close (Nov 3); a group's ring picks the group; a cut-out plot replants |
| E430 | menu.js | the crosshair (Mid's aimSpot, aimColor): a foe, a find or the ground under the tap; green yours, red a foe or a hostile near, blue an ally, white nature |
| E431 | menu.js | the finger's holds and drags on the map: the crosshair dragged, yours picked to keep picking, a box picks yours in it |
| E432 | menu.js | the crosshair (Mid's drawReticle): brackets, a sonar ring, turning chevrons, a scan line, the cross, the time and the square |
| E433 | menu.js | a tile on the board (the floor gives -1 off it) |
| E434 | ai.js | the narrowest gap on the road to a foe (Mid's gapOnRoad): from D251 ai.from tiles out to half way, each ai.step tiles, the open width across the road, the narrowest of ai.min to ai.max |
| E435 | ai.js | the computer holds a gap (Mid's chokeClaim): once each D251 ai.every, with enough idle foot, files deep across the narrowest gap on the road to its nearest foe, for ai.hold |
| E436 | econ.js | the Alarm and the end (F23, Mid's 09-nav, 12-sim-core, 13-sim-civil, 16-sim-fight, 40-emergency): the danger map's and the alarm's measures (D253 to D255), the words (J12, J13), the sides fallen, the bell's warnings said, the best score's key |
| E437 | econ.js | a threat (Mid's isThreat): alive, not inside, one that fights and is neither a villager, game hunted for meat, nor a soldier that strikes only buildings; the side's foe by the one hostility test |
| E438 | econ.js | the danger map (Mid's dangerMap, stampDanger): each side's, drawn afresh each beat on the walking grid: foe level round every threat to it and inside every enemy tower's reach plus D253 reach; scare level round the frights remembered (they lapse) |
| E439 | econ.js | why a spot is dangerous, nearest cause first (Mid's dangerWhy): a threat near (its side named), an enemy tower's reach, else a fright remembered there |
| E440 | econ.js | a worker leaves a find that turns unsafe (Mid's vilTick): it drops the find and looks again, off the danger; your town is told why, once a look |
| E441 | econ.js | going inside (Mid's vilTick, stepOut): a unit sent to a building with room walks to it and goes in, hidden and out of reach, at its middle; a building gone or not standing sends it back to idle |
| E442 | econ.js | a villager's fright (Mid's vilTick, D254): soldiers near scare it, beasts or robbers when a pack comes or one hurt it; it runs into the nearest building with room if nearer than the Town Center, else the Town Center, and its side remembers the place when it was far from home; inside, it comes out when no threat is near the building, unless the Alarm holds it |
| E443 | econ.js | the Alarm's ranking (Mid's shelterRank, roomIn, fillRank, threatDir): buildings with room, sturdiest first, then roomiest, each filled to its room with the nearest; the danger lies toward the foe coming, the nearest threat within D255 dir, else the middle |
| E444 | econ.js | the Alarm (Mid's emgStart, townSquare, soldiersIn, villagersIn): its first order notes each villager's work for Work; Gather sets everyone round the Town Center, soldiers outside; Garrison fills the buildings with soldiers, shooters first, the rest a line toward the danger; Garrison and Shelter fill the room left with villagers, the rest wait behind the Town Center. Work (Mid's emgStop): every villager back to what it did; soldiers stay till sent |
| E445 | econ.js | the warnings (Mid's incomingTick, watchHome, drawRadar): the nearest foe's soldier you see near your Town Center or marching on your buildings, its group counted and its time to arrive, for the marker; a soldier at the town warns, once each D255 again |
| E446 | econ.js | a site nobody builds (F23, Albert's play test): one no villager of its side can reach says why once; else the nearest free villager who can reach it is sent; walls keep their crew (D203) |
| E447 | econ.js | a side falls (Mid's fall): its killer takes its stores and D233 of what its buildings cost; its people and buildings go; its army room × D258 share is split among those left |
| E448 | econ.js | who wins (Mid's judge): your fall loses; every rival fallen wins; a Wonder standing D257 s wins for its side, the first finished first; a timed game warns at D259 and the top score wins at the bell |
| E449 | econ.js | the end (Mid's finish): won or lost, the text and the score (Mid's level played comes with the hazards setting), the best won score kept on this device |
| E451 | menu.js | the Alarm's four cells (Mid's EMERGENCY): Gather, Garrison and Shelter start it; Work ends it |
| E452 | index.html#floor-5-movables | the danger map's home on the walking grid (econ draws it) and each side's reach, cached by what changes the walkable tiles: WALKV counts every change to them (a find laid or spent, a building raised or taken down, a save opened) |
| E453 | index.html#floor-5-movables | the tiles a side's people can walk to: one flood fill over the walking grid (a queue, a typed array) from round its Town Center, by the same steps as the pathfinder (E91), gates as its own see them, a flood as its research lets it; made again only when the walkable tiles, the ice, the flood or a gate's answer change; a building's spot is reached when a tile round it is (F23: a spot nobody can walk to is refused) |
| E454 | index.html#floor-7-display | the fallen, the hit glow and the marker (Mid's fallen, drawHitGlow, drawRadar; D258, D262, D261) |
| E455 | index.html#floor-7-display | a figure that dies in sight topples back, away from the way it faced, and fades |
| E456 | index.html#floor-7-display | something of yours hit: the screen's edge glows, red for a rival, the flame's for the wild, fading |
| E457 | index.html#floor-7-display | foes near your Town Center out of view: a marker on the screen's edge points at them, their count in it and their time to arrive under it; a tap looks at them |
| E458 | econ.js | Teach (Mid's teachTo, teachWhy, teach): an older soldier learns the newer kind its shell's teach slot names, if that kind is of a later age; it stands where it is for the lesson (D263), paid up front |
| E459 | econ.js | the lesson's price: what the newer kind costs more than the old, in each yield, plus tuition gold for each age climbed (Mid's teachCost) |
| E460 | econ.js | the lesson done: the soldier is the newer kind, its health the same share of its new most (Mid's graduate) |
| E461 | econ.js | prisoners (Mid's takePrisoner, payRansom, prisonersTick): a runner caught is held for a ransom of its price; paid, it walks home from its hall; unpaid in D264's time, it serves the captor |
| E462 | econ.js | Zeal (Mid's zealCost, zealWhy, zeal): the Temple blesses the squad for gold if a priest stands with them; their blows are stronger for a while, then the Temple rests |
| E463 | econ.js | each tick: a lesson that is over graduates; a prisoner unransomed in time goes over to its captor |
| E464 | econ.js | a spy by a foe's building reads that side: its stores, age, research and army, kept with the time (Mid's intel) |
| E465 | combat.js | priests, medics and spies (Mid's 14-sim-troops, spyTick): the support troops' own work, the heal of the wounded, and a runner taken prisoner |
| E466 | combat.js | a hand on a runner that did not get away: a prisoner, not a blow (Mid's soldier tick; riders catch the foot) |
| E467 | combat.js | a student stands still; a spy keeps to its own work; a priest converts when sent, else priests and medics walk with the army |
| E468 | combat.js | walk with the army: to the nearest soldier of the side out, a few paces behind it (Mid's followArmy) |
| E469 | combat.js | a priest beside a foe for D265's time turns it; walking off lets the spell fade; with no room the spell stops; then it rests (Mid's priestTick) |
| E470 | combat.js | the wounded heal by the best healer of their side in reach, a hospital or a medic, not the sum: the first-order lag (QP, Mid's healTick) |
| E471 | combat.js | a shooting building watches for spies within its sight of one, more with research (Mid's watchtower, guarded, spySeen) |
| E472 | combat.js | a spy is unseen unless a foe's soldier or watching building is near; by a foe's building it reads them |
| E473 | combat.js | the computers' spy: it takes the first unguarded building it sees that can be sabotaged |
| E474 | combat.js | sabotage (Mid's sabotage): a building burns a share of its health or stalls and loses the head of its line; the spy is spent; a fall by fire pays nobody |
| E475 | combat.js | a support troop told: a priest at a foe converts, a spy at a foe building sabotages, else it walks there |
| E476 | menu.js | Teach on a soldier, Zeal at the Temple, a ransom at your hall |
| E477 | menu.js | the troops row: Teach, Zeal and ransoms on your own card, the lesson's time left, and what your spy read on theirs |
| E478 | econ.js | the Market (Mid's marketTrade and its prices): a yield by the raw lot, a good by the good lot, sold at sell of its worth and bought at buy, both moved by the going price, P = P0 (Q/Q0)^(-1/eps) (QAE), and by debased coin; what is sold adds to the stock, what is bought takes from it; the goods' names for what a caravan says |
| E479 | econ.js | sell or buy one lot at a finished Market: raw sold for gold is a swap, not gathered; a good sold counts |
| E480 | econ.js | the Mint debases the coin once: its gold now, every Market price dearer for good (Rome's denarius) |
| E481 | econ.js | a venture from the Market (the commenda): back in a year with the return or lost; only the profit counts as gathered (QCF) |
| E482 | econ.js | a venture lost to robbers on the way |
| E483 | econ.js | the stock settles back toward normal each slow beat (QP), spice toward dearer while one side holds a whole route |
| E484 | econ.js | a shop (Make): what it makes now and from what; the choice changes its worker's work; Learning by doing adds a share for each other finished plot of its kind (QAB); its worker takes the inputs from the stores and puts the good straight in, as a shepherd's milk |
| E485 | econ.js | trade: the stops on the two routes, held by the post standing on them; a good's price at a place is its base, more where wanted, × the going price, × the distance from its Market (QCE); a load is the best-paying goods first, of a yield only the surplus |
| E486 | econ.js | a caravan walks to a building's side or onto a stop; a way it cannot walk ends its run, and it waits a beat |
| E487 | econ.js | a caravan on a route: load at its Market, sell at the far end (a keeper's cut), buy spice at a stop if told, bring it home, again if it repeats |
| E488 | econ.js | a caravan with no route runs to the farthest ally's Market or Town Center for distance² pay (QCE), then home |
| E489 | econ.js | robbers leave a caravan alone near its side's trade post or tower, or with a soldier of its side beside it |
| E490 | econ.js | each frame the caravans; each beat a stop's holder, an armed caravan's blow and a whole route's pay; each slow beat the prices settle and ventures come home; each minute the Bank's interest |
| E491 | econ.js | a caravan taken by a side pays its cargo and goods to the taker; one killed by the wild is robbed (the robbers' hoard waits for their camps) |
| E492 | index.html#floor-3-non-movables | the trade stops (Mid's ROUTES, PLACES.stop): four on each of the board's two middle lines, each on the nearest free tile, of its route, wanting one of the wares in turn; open ground, so a trade post stands over one |
| E493 | combat.js | guards (Mid's escortPick, guardsOf): soldiers told to escort a caravan or garrison a stop keep to it as their post, as many as the trade's guard; when it is gone they come home |
| E494 | econ.js | The war camp (F25, Mid's 38-camps; Albert, Nov 5 11:16 (7)): a wagon of two sizes (D287) unpacks where it is sent; positions in tiles of the grid, facing the side's Town Center (the gate side), else south (D279). |
| E495 | econ.js | A camp's pieces: each spot [code, across, along toward home] turned by the facing and snapped to a top-left tile as Mid's snapPos (round of the centre less half the size); the large camp's palisade ring first, its gate the two middle squares of the home side. |
| E496 | econ.js | Why a camp cannot stand here (Mid's campWhy): off the map's edge, on water, on a building, on a resource (trees are allowed: they burn), too near a gift; and v100's own ground rule for every building, one flat height under each piece (L5). |
| E497 | econ.js | The wagon unpacks (Mid's campUnpack): the trees within D279's burn of the camp burn and their forest floor clears; the pieces come off as sites; a large camp's felled trees outside its square and off its home side are laid as abatis, built; the wagon is gone. |
| E498 | econ.js | How many camps of a size a side may have out (Mid's campCap, campsOut): none before its age, one in it, two after; the large needs Camp wagons and a Store standing; camps standing (by their tents, not a last palisade square), wagons on the road and in the line all count. |
| E499 | econ.js | Why a camp wagon cannot be trained (Mid's campWhyTrain): the queue and the Train cell ask it. |
| E500 | econ.js | Soldiers raise their camp (Mid's canRaise, campRaise): a soldier on foot, idle or holding, looks each D279 look beat for the nearest of its side's unraised or worn pieces, each hand already there counting D279's crowd tiles more; beside it, its hands (D279's build × campbuild) join the crew and raise it as a villager's would (D204), or mend it at the raising rate. |
| E501 | econ.js | A soldier by a medical tent that is badly hurt or sick walks home to the Hospital (Mid's campSendHome); with none it stays and is bound where it is. |
| E502 | econ.js | The depot feeds the camp (Mid's campEat, every second; here as the people eat): a soldier within D279's reach eats from its stock; with it empty the town feeds it but it is unsupplied, slowed as after a charge and not mended at a shelter, and the camp says so once a minute. |
| E503 | econ.js | A Market caravan with nothing to carry runs food to a depot under half (Mid's supplyRun): from the store, keeping D279's keep, and the carter's fee in gold by the distance; loaded at its Market, unloaded at the depot, home again. |
| E504 | econ.js | The camp's tick: soldiers raise and mend, wagons that arrived unpack, the hurt are sent home each send beat; each minute rain, snow or frost wears every camp piece (Mid's campWearTick). |
| E505 | econ.js | Relations (F28, Mid's 11-orders diplomacy): one stance a pair of sides (combat.js treaty, the Sides book); war is given with D281's notice; peace and an alliance are carried by an envoy and answered by the odds (QAF); an alliance is one ally a side. |
| E506 | econ.js | Why a side cannot take a stance toward another, or a group, now (Mid's relWhy, envoyWhy): a group by its regard (D282); a court not your vassal or lord; war while notice runs. |
| E507 | econ.js | An envoy rides from the Town Center to the court (its Town Center) or the group (its nearest band), is heard there, and rides home (Mid's sendEnvoy, envoyTick); while out, no other goes. |
| E508 | econ.js | The answer (Mid's judgeEnvoy): at war and not asked for peace, the envoy is killed; the player answers its own; peace is taken free, or for a truce's gold when the court's odds are good (Mid's PEACE.truce); an alliance is refused to the weak, by the strong with no other war, and by one allied elsewhere. |
| E509 | econ.js | A wild group's regard for each side (Mid's gangState, regardOf, addRegard, gangSync): peace and war follow it; an envoy makes a friend at D282's allyAt, and the friendship ends a little under it. |
| E510 | econ.js | Gifts (Mid's giftGain, QCD): each gift in the window buys less regard than the last, as the Danegeld bought ever-dearer peace; the Natives' need their Throne standing (it waits for Albert). |
| E511 | econ.js | Vassals and tribute (F28, Mid's 36-economy; Albert, Nov 5 11:16 (2): tribute, the tax rate parked; QCG): a vassal is an ally whose lord its stances follow; it pays tribute, shares its trade's gold when loyal, and may rise. |
| E512 | econ.js | A side becomes a vassal (Mid's makeVassal): by surrender, its army beaten and the lord's soldiers at its Town Center, or as an ally twice outmatched that asks for a lord (loyal from the start); its stances become the lord's. |
| E513 | econ.js | A lord's hand on a vassal (Mid's breakTies, demand, forceTribute, levy, releaseLevy): cut it loose (war, the others warier), demand a store (loyalty, dearer each time), force double tribute with soldiers at its town (unrest), or call up half its soldiers to march under the lord's colours. |
| E514 | econ.js | A rebellion (Mid's rebel): a share of its villagers take up arms as rebels and its army turns on its lord; with a coalition, the restless rise together. |
| E515 | econ.js | Each slow beat (Mid's vassalTick): a rebellion is crushed or wins its freedom; otherwise the vassal pays its tribute from what it gathered since, its loyalty settles toward what the lord has earned (QP), its unrest moves, a loyal one sends gifts, and at the top it rebels; each minute two or more restless vassals may rise together. |
| E516 | econ.js | A new map: no notice running, every group's regard at its start. |
| E517 | econ.js | A vassal's soldier lost under its lord's colours costs loyalty; a foe its lord kills near its town earns its thanks (protect). |
| E518 | combat.js | A blow on a shooter's stake, or on one of a wild group (its regard falls). |
| E519 | combat.js | Field traps (F25, Mid's trapsTick, trapShown): hidden from all but their side, its allies and a side whose scout found them; a foe who steps on one springs it (D280). |
| E520 | combat.js | A trap sprung: caltrops spike each walker once a while and wear flat; the others go off once; a net takes a prisoner (not an engine); horses take the worst. |
| E522 | ai.js | The computer's relations (Mid's aiDiplomacy, allyDuty, peaceAll): its personality's bold and the difficulty's envoy, allyAt and gang (D304), the rest D285: losing, it asks peace; strong and at peace with no war on, it gives notice; with a war on (or on Hard against the leader) it courts an ally; an ally helps a friend's town under attack, never at the cost of its own |
| E523 | ai.js | Dynamic Diplomacy (Mid's LEAGUE, leagueTick): when one side runs far ahead, the others (not the player, not the leader's vassals) ally and make war on it; it breaks up when the lead falls back. |
| E524 | index.html#the-things-drawn-each-frame-back-to-fr | A hidden trap is drawn flat on the ground from the Sprites book, in its side's shade or the foe's red; a site as a dashed ring; caltrops show a spike for each tread left (Mid's drawBld for traps). |
| E525 | ai.js | what a side stands, raises, trains and has queued, asked of the things themselves |
| E526 | ai.js | the by-need plan's eyes (QCM, QV): the seconds to the bell, what one more hand earns at the best find from home (a probe walks from the hall; wild: no plot), whether a plot pays its price back, each yield's hands, rate, income, shortfall and time, and the reorder point (the store runs out before its income can be rebuilt) |
| E527 | ai.js | the army a side keeps: its personality's ceiling plus D291's armyAge an age, at most D226; at peace with every side, D285's stand of it (Mid's armyCap, armyAim, peaceAll) |
| E528 | ai.js | the counter (QCN, Mid's bestCounter): among the soldiers it can train now, the best answer to what its foes field for its price, mixed with the next best so an army is never one kind; with no foe in the field, each in turn |
| E529 | ai.js | a computer's turn, every D304 react s (Mid's think), in Mid's order: a site nobody raises, homes, drop-offs, plots, the age and its saving, the town's growth by payback, a scout, its buildings, towers, walls, a Wonder, priests and Zeal, medics, engines, caravans, its economy, spies, research, Muster and soldiers, then the hands by need and the war |
| E530 | ai.js | shelter before it is needed: a Home (an Apartment once it can) when the people come within D152 of the room; one it cannot yet pay for is due, and the hands work toward it |
| E531 | ai.js | a drop-off where D291's crew work a yield whose nearest find stands far from one |
| E532 | ai.js | the shift to plots: one at a time, never more than the hands on its yield, when it beats the wild find and pays its price back in the time left; one it cannot yet afford is due |
| E533 | ai.js | the age: once the town is big enough (D176) it saves for the next; a save once begun holds until the age is bought, and spends freely only when it has stalled (D290) |
| E534 | ai.js | the town grows while one more villager pays its price in the time left (QCM), and not while it saves for the age unless food runs over; growing is a steady draw on the stores: a villager and its share of a home over its training |
| E535 | ai.js | its personality's buildings in order (D303 build); while saving, only the first; a second barracks or place to train when every line is full |
| E536 | ai.js | faith and care: priests with an army, Zeal on the soldiers fighting, medics (Mid's think) |
| E537 | ai.js | engines to break what soldiers cannot, by D291's cycle and the age's late engine |
| E538 | ai.js | research while not saving: its personality's list in order, each through the first step it waits on; with the list done, any step every D291 research-th turn |
| E539 | ai.js | the hands by need (QCM): the goal and what is due are the cost; the bottleneck is the yield with the longest time to afford it (food first when the famine runway is short) |
| E540 | ai.js | a hand moves to the bottleneck from a yield the goal does not need whose store does not then run out, or from one whose time stays under the bottleneck's after the move |
| E541 | ai.js | with nothing short, the personality's mix: no stone and less gold in the Stone age, no iron before the Classical, a Wonder-builder a little of everything |
| E542 | ai.js | a waiting villager goes to the first yield in need it can find work for, else the one paying most; then the war and the relations |
| E543 | ai.js | the computers' economy (Mid's aiEconomy, without surplus selling, Albert 11:16 (5)): staff an idle shop, ventures with gold to spare over the age, trade posts on free stops, a Market, a Pasture, a workshop (the Raiders brew), caravans and their routes |
| E544 | ai.js | the war (Mid's decideWar, QAF): a wave out is judged by its progress (D289): a blow or a step nearer; it charges once on contact, and goes home beaten or stalled; at home, the foe whose odds, bent by the opportunist's eye, best clear the personality's nerve |
| E545 | ai.js | the wave sets out, its guard kept home; a few riders go for the foe's nearest drop-off to draw the defence apart; you are told when it is you |
| E546 | index.html#drawn-once-in-the-view-frame | the ground's memory (D299): a layer as big as the ground's picture, cleared with each map; the worn earth round every building standing is laid at once |
| E547 | index.html#drawn-once-in-the-view-frame | the ground remembers (Mid's scarCv): marks painted once into a layer under everything, so they cost nothing a frame; at a board point on the ground's picture |
| E548 | index.html#drawn-once-in-the-view-frame | bare earth worn by feet round a finished building (not a field, a wall or a trap) |
| E549 | index.html#drawn-once-in-the-view-frame | the dark where someone fell, wider for a big body, a blade's cut for a soldier |
| E550 | index.html#drawn-once-in-the-view-frame | burnt ground and rubble where a building fell (not a wall) |
| E551 | index.html#floor-6-climate | the moon (QB to first order, QC): it runs ahead of the sun by its phase on a declination that swings from the sun's at new to its opposite at full, so a full moon rises at sunset; its lit fraction (1 − cos i) ÷ 2 |
| E552 | index.html#floor-6-climate | the sky told ahead, the sky's news, the flood and the ruts (D293–D295); the ground's marks laid when someone falls or a building falls |
| E553 | index.html#floor-6-climate | the chain (QH) rolled ahead a forecast step for each step of Weather signs, never less than an hour; when the last rolled hour turns, its sign is told |
| E554 | index.html#floor-6-climate | when the sky turns its news is told, with why in the chain's own odds (Mid's skyTurn and wxWhy) |
| E555 | index.html#floor-6-climate | water over the shore while the flood stands (KI4); the mud a step meets: the wetness, deeper by water (pooling) and by traffic, the ruts' depth (passes ÷ n0)^0.4 (QS, D294) |
| E556 | index.html#floor-6-climate | each land tile's distance to the inland water, once a map: the shore that pools and the land a flood covers |
| E557 | index.html#floor-6-climate | the flood harms a finished building whose middle stands within its rise, unless its side has Levees; you are told |
| E558 | index.html#floor-6-climate | marks on the water and the ground, and the sky band (D296–D298, Mid's drawLakeRipples, drawRainRings, drawSky) |
| E559 | index.html#floor-6-climate | ripples drift on the lakes, inside the shore; none on ice |
| E560 | index.html#floor-6-climate | rain rings sit on the ground, fixed to the world, fewer as the rain eases; only close up |
| E561 | index.html#floor-6-climate | the horizon: a band of sky along the top of the glass, coloured by the hour and the weather |
| E562 | index.html#floor-6-climate | clouds cross the band with the wind |
| E563 | sound.js | the wind is heard as hard as it blows (HA4, HX4) |
| E564 | index.html#floor-3-non-movables | the dens and drifters' camps laid in Z4 on their own dice, so the map's other rolls stay as they were; a robbers' camp at each end of the two trade routes (Mid's layCamps) |
| E565 | index.html#floor-5-movables | a find's guards on a ring round it, each bound to it as its home; drifters in a row beside their fire (Mid's addFind) |
| E566 | index.html#floor-5-movables | a walker that leaves the land (no fall, no carcass), and a find taken away |
| E567 | index.html#floor-6-climate | the Challenge's hazards and the events: a hazard counts only off Easy; the level played multiplies the score |
| E568 | index.html#floor-6-climate | where an event comes in: a spot on one of the land's edges, its far side through the middle, or a free spot of the wild away from every town |
| E569 | index.html#floor-6-climate | an event comes only in its season, or in the rain; never the same twice running |
| E570 | index.html#floor-6-climate | a Poisson wait with a floor: least plus −(mean − least) ln U (QM) |
| E571 | index.html#floor-6-climate | what each event does when it starts, each second it runs and when it ends (Mid's EV) |
| E572 | index.html#floor-6-climate | a sinkhole's star of cracks, each arm bending as it goes, laid on the ground's memory from its place |
| E573 | index.html#floor-6-climate | once a second: the event running, else the warning ahead of the next, else its start; the horde and the travellers; a walker past its way out leaves (Mid's eventsTick) |
| E574 | index.html#floor-6-climate | the horde under the Outlaws hazard: told two seasons and one ahead, then it comes for the weakest side at war with the outlaws, growing with the age (Mid's hordeTick) |
| E575 | index.html#floor-6-climate | a wayfarer from the middle of each edge in turn, to the far one (Mid's wayfarers) |
| E576 | index.html#floor-6-climate | a bolt where it falls: drawn, the ground scorched, the thunder told |
| E577 | index.html#floor-6-climate | a running herd tramples who stands in its way and the soil of the fields it crosses (Mid's herdTick) |
| E578 | index.html#floor-6-climate | quicksand on the ground while it lasts |
| E579 | index.html#floor-6-climate | a falling star streaks down onto its spot |
| E580 | index.html#the-things-drawn-each-frame-back-to-fr | a find drawn as blobs from the Sprites book |
| E581 | index.html#the-things-drawn-each-frame-back-to-fr | flames on what burns, with its smoke, as strong as the fire |
| E582 | combat.js | the wild's guards and travellers, the robbers' raids, the computers' detachments and the scout (Mid's wildTick, wayfarerTick, natRaid, lootRun, scoutTick) |
| E583 | combat.js | a guard keeps to its home: it looks for a stranger near home (a raider, near its reach), lets go past its leash and walks home when far; a raid's band goes home when its time is out |
| E584 | combat.js | a defender weighs a stranger now and then: it fights with probability V / C, C the stranger's strength over its own (QAH) |
| E585 | combat.js | a traveller joins the first side to meet him, as villagers (on its rally job), or as food when the town is full |
| E586 | combat.js | one weighted draw: p = w_i / Σw (QAR) |
| E587 | combat.js | now and then the robbers send a band from the camp nearest a side at a villager or caravan of any side they can beat, drawn toward a load, away from a guard and back to a town robbed lately (D307), and call them back after a spell |
| E588 | combat.js | a computer hires drifters it can pay for, and sends half its idle army at the nearest find while nothing else is on; home when it is taken |
| E589 | combat.js | a scout left to itself goes for a find whose guards have fallen, else loops the land |
| E590 | econ.js | the finds: the first side to touch one whose guards have fallen takes what it holds; the ruins a free research of its age |
| E591 | econ.js | drifters fight for whoever pays, with a unit of the payer beside them and room in the army |
| E592 | econ.js | fire: the ground's dryness by Rothermel (QT), the t² fire's heat across a gap (QU), and a chance in a step from a rate (QM) |
| E593 | econ.js | a wooden building catches fire, and the nearest villagers of its side run with buckets (Mid's ignite) |
| E594 | econ.js | a fire burns its building and, every few seconds, may light a wooden neighbour; a building that burns out falls (Mid's fireTick) |
| E595 | econ.js | in a summer storm lightning strikes a wooden building now and then, and a forge throws sparks (Mid's lightning) |
| E596 | econ.js | sickness: a town's people near its seat or a depot; more cases from outside in summer and winter, fewer with research |
| E597 | econ.js | each health beat: cases from outside, the spread β S I / N (QAQ), and each sick one cured by a healer near, dying, or well again (Mid's healthTick) |
| E598 | index.html#the-view-s-eyes-lights-and-stage | the view's eyes, lights and stage: the light and each eye's range (real math, Albert Nov 6), the camera's glide, the lights after dark, the theatrics, the dressing, the small map and the draw budget (Mid's view, F33 and F34) |
| E599 | index.html#the-view-s-eyes-lights-and-stage | the light on the ground (D117): the sun's by its height, the moon's by its phase and height, the stars'; cloud dims it to the overcast night's share |
| E600 | index.html#the-view-s-eyes-lights-and-stage | a thing's range (QAL): the least of the horizon from its eye, the eye's range in this light (a lantern gives a building part of the dark back) and what the weather lets anyone see (QK) |
| E603 | index.html#the-view-s-eyes-lights-and-stage | another side's building shows only while your people see it |
| E604 | index.html#the-view-s-eyes-lights-and-stage | the player's Reduce motion, read from the phone; the draw budget's level; still: is motion off, by the setting or by load (Mid's lessMotion, DRAW, still) |
| E605 | index.html#the-view-s-eyes-lights-and-stage | a phone that falls behind sheds a level of drawing (tree shadows, then the moving extras, then half the pixels) and climbs back when fast again (Mid's shed); the drawing alone is timed, against shares of the frame's real interval at the rate it runs, not a fixed 12 ms (SoRen's numbers were for 60 frames a second; Albert, Nov 9) |
| E606 | index.html#the-view-s-eyes-lights-and-stage | a cache held to a budget of pixels: the oldest go first, their canvases emptied at once so the phone gets the memory back |
| E607 | index.html#the-view-s-eyes-lights-and-stage | the camera glides on a critically damped spring (QAW): to a point, Home or the small map's tap; a finger takes over; still means a jump (Mid's spring, camGo, camStop) |
| E608 | index.html#the-view-s-eyes-lights-and-stage | Follow keeps the picked units in the middle until they are gone or a finger moves the map (Mid's followCam) |
| E609 | index.html#the-view-s-eyes-lights-and-stage | fire's colour from its temperature (QF, a black body), its life in the rain (an open flame dims, a covered one keeps), its glow fading as 1/r² (QAU) and the flame itself, leaning with the wind (Mid's kelvinRGB, flameLife, glow, flame) |
| E610 | index.html#the-view-s-eyes-lights-and-stage | a flame's light on the ground: a disc fading to a quarter at half its reach, added to the dark, only when there is dark to light |
| E611 | index.html#the-view-s-eyes-lights-and-stage | what burns after dark: a blazing or badly hurt building, a hearth in a home, a lantern at a lit door, a camp's fire, a caravan's lantern (Mid's drawLight, HEARTH) |
| E612 | index.html#the-view-s-eyes-lights-and-stage | theatrics: one pop curve (a finished building and a newborn swell and settle), ripples where you tap, three sizes of celebration (a building, an upgrade rolling through the army, a new age or a wonder) and the pale flash (Mid's popC, celebrate, ripple, ripDraw, drawFlash) |
| E613 | index.html#the-view-s-eyes-lights-and-stage | words on the map keep one size whatever the zoom, as the screen's own words; a label is a pill (Mid's mapFont, tag) |
| E614 | index.html#the-view-s-eyes-lights-and-stage | the dressing: a site staked out and rising with the work, a finished building's pop and fresh glow, its flags, piles and chimney smoke (Mid's drawBld) |
| E615 | index.html#the-view-s-eyes-lights-and-stage | a building site: the stakes round its footprint, the walls rising with the work between two posts, the bar, and z when nobody builds it |
| E616 | index.html#the-view-s-eyes-lights-and-stage | a building's flags, drawn live over its picture where its art put them, waving more in a strong wind (Mid's flagsOn) |
| E617 | index.html#the-view-s-eyes-lights-and-stage | a side's stores as piles by the camp that takes them in: a pyramid by log₁₀ of the store, drawn once per count and zoom (Mid's PILE, pileAt, pileArt) |
| E618 | index.html#the-view-s-eyes-lights-and-stage | a chimney's plume: rising ∝ x^(2/3) (QAV, Briggs) and widening ∝ x^0.9, leaning downwind (Mid's smoke) |
| E619 | index.html#the-view-s-eyes-lights-and-stage | a figure in motion: the woodcutter's lean into its tree (the view's own memory), the step's rise and fall, a lunge into a blow and a shooter's kick, the recoil, a hurt soldier's stagger; then its marks: nerve, rout, march, idle z and focus F (Mid's LEAN, drawUnit, idleMark) |
| E620 | index.html#the-view-s-eyes-lights-and-stage | the small map: the ground, the fog, buildings you know (a seat is a star), units you see, an army coming flashing red, and the screen's box; tap to glide there, drag to sweep (Mid's drawMini, miniIncoming, miniAt) |
| E622 | index.html#the-building-art | a banner on a building that flies live leaves its place to the view (Mid's FLAGS) |
| E623 | index.html#floor-7-display | the shadows of the trees, bushes and rocks in sight, not the deep woods, cast like everything else (QAT, Mid's shadowPath); the draw budget sheds them first |
| E624 | index.html#floor-7-display | is a thing in a side's sight: its own, the land's and the wild's always; another side's only when that side's eyes saw it at the last look, or the eye asking sees it now (range and line, QAL and QAM); the one check for the screen, the fight and the computers |
| E625 | econ.js | a board at peace (Mid's 39-games, D322): the truce clock, the hidden age it opens, standing down, the chronicle; the deal of the peoples for the next match |
| E626 | econ.js | a board truce: no two living sides at war and no notice running; how long it has held |
| E627 | econ.js | the chronicle: the match's lines, kept to D322's chron, newest last |
| E628 | econ.js | standing down (demobilisation, as every peace since Rome): the soldiers at home above the keep go home as villagers, one for one; yours to your gathering job when you ask, a computer's above the army it keeps at peace |
| E629 | econ.js | once a second: the truce clock starts or stops; a year of it opens the hidden age for every side; after D322's stand.after the computers stand down |
| E630 | econ.js | the three crowns and the overall (Mid's crownsOf): Wealth all a side gathered, War the cost of the enemy people and buildings it destroyed, Wellbeing its people in health, its places of care and its laurels; each crown gives a side a point for every side below it, the score breaks a tie |
| E631 | econ.js | the last step of the hidden age ends the match for everyone: everyone wins, the crowns say who won what |
| E632 | econ.js | a side's people: its civilisation, and the bonus row it holds from the start (Mid's CIVS fx, applied by QCA as research is) |
| E633 | econ.js | the War crown's count (Mid's warCredit): a side destroying another side's unit or building is credited its cost; the wild cost nothing |
| E634 | econ.js | a raid on yours: an enemy strikes or fells one of your things; told by the mail, by sight, by ear or by messenger (QCH) |
| E635 | menu.js | the mail (Mid's say and tell, D323): a line shows a while unless it is quiet, the same line within merge is a count on the first, the newest kept; news out of sight comes by the post (QCH) |
| E636 | menu.js | which way a place lies from your Town Center, of eight |
| E637 | menu.js | how a line reaches you (QCH): in sight now; a fight in earshot by its way only; else by a messenger walking from your Town Center, if the Post serves that far |
| E638 | menu.js | a line said: by messenger later, heard as a fight, or now; merged with its repeat, kept, shown |
| E639 | menu.js | the messengers arrive |
| E640 | menu.js | the world's news: a line of your age every while, none at first |
| E641 | menu.js | the peoples on the Start card: the one you pick and its line (its own soldier, the one it replaces, its wonder, its bonus); the others are dealt at random |
| E642 | menu.js | the milestones and tips (Mid's MS_TEST, advise): each milestone said once a match the first time it is true; a tip names what the town needs next until you have done it |
| E643 | menu.js | a hint retires once learned: what you did, counted on this phone, to D325's learned |
| E644 | menu.js | what each tap teaches: training a kind, a job, a building, the next age |
| E645 | menu.js | the fourteen milestones' tests, and their numbers filled from the books |
| E646 | menu.js | gold short while another store is full |
| E647 | menu.js | what the town needs next, first that holds: room, villagers, wood, idle hands, a barracks, spearmen, the next age, food, gold, a fire, sickness, gold work |
| E648 | menu.js | every lesson beat: a new tip is said, then the first milestone newly true, one a beat |
| E649 | ai.js | a computer chases its crown (Mid's chaseCrown): the wellbeing chaser builds each place of care it lacks; every side takes the hidden age when it opens and runs its steps, the match a race to the last |
| E650 | index.html#floor-2-terrain | The corners: the board's four, clockwise a quarter turn apart from the screen's top left; yours, the first, sits A6 round (the bottom left, Albert Nov 6), the computers' follow in turn |
| E652 | index.html#floor-3-non-movables | The way home (QCQ, Mid's openWays and wayHome): nothing is walled in; a find cut off by woods gets the fewest trees cleared between it and its Town Center, never across water; the pocket's grove is kept |
| E653 | index.html#floor-3-non-movables | Z3, laid by the Randomizer: each find of D65 at three pockets' worth, and the land's specialty once more at one pocket's, at a rolled spot in the ring, off the road; the same dice in every corner |
| E654 | index.html#floor-3-non-movables | The land's character (D329, Mid's LAND): past the pocket every find is worth its store's share |
| E655 | index.html#the-door | The save and the safety net (Mid's 34-save and 41-boot): the game saves itself on the save beat and on leaving, keeps the one before, waits out a fight; an error costs a frame, never the game |
| E656 | index.html#the-door | each kind of error logged once; a second kind holds the save (the last good one stands) and says so |
| E657 | index.html#the-door | the save: the seed (the map is laid again from it), the lists, the climate, the sides, what they know, and what differs from the fresh map; each module adds its own on the save hook; a thing or a unit is kept as its place in the lists |
| E658 | index.html#the-door | a save opened: the places turned back into the things and units, the Maps, Sets and Infinity by their tags (D331) |
| E659 | index.html#the-door | the save waits while you fight, at most D331's fight; a failed save says so once in D331's fail; the test field is never saved |
| E660 | index.html#the-door | saves roll through D331's slots, one set per build folder, so live and a preview never share one; when storage is full the oldest goes to make room; a save that will not open is skipped and the one before opens |
| E661 | index.html#the-door | the game opened from a save: the fresh map from its seed, then the lists, the sides and the changes laid back, then each module's own |
| E662 | index.html#touch | The opening: the game opens where you left it, newest save first, saying so if it had to open an older one; the address never ends a match; ?test opens the test field on its own seed |
| E663 | econ.js | New game (Mid's applyScenario and testField): the scenario's buildings and people placed by the placing rules nearest their spot |
| E664 | econ.js | A scenario (D330): the age, the store and the research for you (or every court), the relations, the buildings and villagers, the length |
| E665 | econ.js | The test field (D333): you and one rival at war, the other two gone, every store full, both armies down the road from your Town Center |
| E666 | econ.js | the economy's part of the save: a finished game clears the save instead |
| E667 | combat.js | the war's part of the save: the waves, the orders, the relations, the squads |
| E668 | ai.js | the computers' part of the save: their clocks, plans and minds |
| E669 | menu.js | the ghost's bar (Mid's place bar): what the ghost says, Build to place it, ✕ to stop; the menu stays closed so the ghost and its guides are seen |
| E670 | menu.js | The test tools (Mid's matchLog, copyLog, tapCount): the match log for Claude to read, tap counts kept on this phone |
| E671 | menu.js | a row a minute (D335): each side's age, villagers, soldiers and stores, or none once it fell |
| E672 | menu.js | copied to the clipboard, or through a hidden box where the clipboard is refused |
| E673 | menu.js | the menu's part of the save: the mail, the news, the options, the match log |
| E674 | index.html#floor-3-non-movables | a guarded find stands in its own clearing, as Mid lays its guards on the ring round it (26 from home): it is laid only where the ring is open land, and the trees on the ring are cleared, as the pocket's grove is kept |
| E675 | menu.js | The Guide, written from the books (Mid's guideModel): every building, unit, research step, age, people, find and rule, its numbers read from the tables, so it stays true as they change; an age is a building's or a kind's, or the first |
| E676 | menu.js | a unit is trained at the first building that trains it (or the kind it replaces), as Mid gives each its one home; a history line sits under the shell's look unless the Guide's key says otherwise; a step's line under tech:key, else its key |
| E677 | menu.js | a rule's numbers and names are filled from the books: {D:path} a measurement, {S:code} a shell's name, {J:key} a words entry, {fx:stat} the research that raises it |
| E678 | menu.js | Mid's guideModel, field for field, on v100's tables (a building's menu is its Build tab, else why it is off the menu); no line of what a thing does yet: v100's books hold none |
| E679 | menu.js | History (Mid's yearOf, histRows, histText): a step's date as a year (BC below none; an era by name; undated last), the dated steps in order, a row as text to copy |
| E681 | index.html#the-door | a plain record held in two places (a war order, a camp, an ambush) is saved once, tagged own, and its other places as same; opened, they are one record again (the save first walks what it holds and counts which records it meets twice; the things and units are walked by their fields, each once) |
| E682 | ai.js | a computer's estimate of what one more worker earns on a yield is kept for the slow beat (D182: the computers' slow looks) and not worked out again each turn: the finds change slower than that; when they run out, one is worked out again a frame and the rest keep theirs till a later turn, so a turn never works them all at once |
| E683 | ai.js | the computers' clocks start spread over one turn (react ÷ how many), so no two think on the same frame; each keeps its own turn |
| E684 | index.html#the-door | the work queue: slow jobs, each a generator that yields where it may stop; one job of a key at a time (a computer whose last turn is still running does not start another) |
| E685 | index.html#the-door | a frame runs the queue's jobs in turn, a slice each, up to D339's slices (QCR: counted, not timed, so the game does not depend on the machine); a job not done goes to the back and resumes next frame |
| E686 | ai.js | a site the computer cannot pay for, or may not build, is not searched for: plan() would refuse it after the search (the same answer, without the rings); the search then asks each tile only about the ground (its limit asked once, here) |
| E680 | menu.js | the Guide as Markdown (Mid's guideMd): one table a part, its headings from the words, a bar in a cell made a slash |
| E800 | index.html#the-ground-s-soil-and-paper | made once a map: which tiles are grass, bare or other land; a micro-relief, and on it each tile's flow by the steepest of the eight ways, the area that drains through it and its wetness index ln(a ÷ tan β) (TOPMODEL); the snow's lognormal drift by the relief; the six layers' weights; the clusters of flowers and pebbles; and for each texel of the picture the tile under it, found by walking the height until the view and the land agree (a cliff face, where they never do, is left to the ground below) |
| E803 | index.html#the-ground-s-soil-and-paper | the flowers and pebbles close up: each cluster's offspring from its own seed, as many open as its season allows, none under snow or on a trodden path; one path a colour, filled in layers |
| E804 | index.html#the-ground-s-soil-and-paper | a tile's wetness by its wetness index and its snow by its drift: one home each for the step, the footing and the picture |
| E805 | index.html#the-ground-s-soil-and-paper | a step's wear on the grass: the pressure of everything that walks there (body, mount, kit and the load carried) over its prints, past the soil's precompression stress (lower when wet), by the log of the ratio, in person-steps: a light step wears nothing, a laden villager a little more than an empty one, a knight or a ram several times |
| E806 | combat.js | an order leaves its soldiers tired as a charge does (D247 slow, settling back with tired): give many orders and the army slows (Mid's ORDER.tired; Albert, Nov 8) |
| E807 | index.html#floor-5-movables | QCJ while two soldiers form up (D242): the one of lower precedence gives the whole way, softly (foot before archers before riders before engines; Mid's FORMING soft) |
| E808 | index.html#the-view-s-eyes-lights-and-stage | a side's exposure to cold and wet (D354): the air's cold and the ground's wetness, each cut by its research (Wool cloaks, Oiled cloaks, Chimneys); read by the meals, the sickness and the nerve |
| E809 | combat.js | a soldier's nerve settles no higher than its full × (1 − D354 nerve × its side's exposure): cold and wet sap morale |
| E810 | index.html#floor-7-display | familiarity (D355): a cell is known to a side from the last time one of its eyes stood in it; nothing is saved, so a reload forgets the scouted ground and keeps the own ground |
| E811 | index.html#floor-7-display | a side's familiarity with a tile: one on its own ground (a finished building of its own within D355 home), the Natives' and the wild's everywhere, else the memory fading from the last look |
| E813 | combat.js | a scout set to Stealth (its card) goes on foot at D224's sneak and takes the spy's veil (E472): unseen unless a foe's soldier is near or a shooting building watches |
| E815 | menu.js | what a research does, in words from its effects; with no effects, why it is there |
| E816 | econ.js | where the finger leaves the ghost: Mid's snap first; if nothing caught it and it stands on no guide, the nearest guide line within tol pulls it on (a light pull, as a PDF editor's), so what is drawn is what it snaps to |
| E817 | menu.js | the small pop-ups on the map (a quick attack on bare ground, the ice's clear, the villager's square) stand a slot above the point, centred on it, never under it; where the top bar or the help line leaves no room, a slot below instead |
| E818 | index.html#touch | the bottom bars' height, told by the menu when it changes (the top bar's is read as topOf); a person's head on the screen, a person's height above the feet (and the feet), for what must sit just above one, or just below when the top has no room |
| E819 | menu.js | the villager's square (Albert, Nov 8 21:35-21:46): a tap on your villager opens four boxes above its head, Build, Send to, Attack, More; More turns them to Garrison, Rally, Info, Focus; Send to and Attack wait for the next tap on the map; any other tap closes it and lets the villager go; it follows the villager as it walks |
| E820 | econ.js | a villager told to take cover goes into the nearest building of yours with room, as fright sends it; like fright's, it comes out when no foe is near (so with none near, there is nothing to hide from) |
| E821 | menu.js | one tap listener for the whole screen (Albert, Nov 9): every button with a verb answers wherever it sits; the pause panel lived outside the three listeners and its buttons never ran |
| E822 | index.html#the-view-s-eyes-lights-and-stage | the rate the frames run at, one home: at rest the idle rate, shedding frames the lower rate, otherwise the full rate; the loop paces by it and the shed budgets by it |
| E825 | menu.js | every menu ends in the help line, always there (Info Help Ribbon 1): the latest message, and a tap opens Help; the same line under the top ribbon comes and goes on its own (Albert, Nov 9 12:29) |
| E826 | menu.js | the help line under the top ribbon carries its words in a span and a white ring (Info Help Ribbon 1), the ring receding over the time it takes to read |
| E827 | menu.js | a message's time on screen: the toast's least time plus its words at adult reading speed (Brysbaert 2019; Albert, Nov 9 12:12) |
| E828 | menu.js | the ring's marker inside a box: its colour and its state (dim not chosen, lit chosen, run at work) |
| E829 | menu.js | one colour a kind of work (Albert, Nov 9 12:03-12:19): the age-up white; soldiers red; scouts, envoys and spies blue; caravans gold; other people green; a research its family's colour, brown when it strengthens a building |
| E830 | menu.js | dim is the colour mixed into the tray brown by one share, never picked by hand |
| E831 | menu.js | the box's outline as one path from 12 o'clock, clockwise, round its corners |
| E832 | menu.js | each ring drawn once its box has a size, and again only when its size, colour or state changes |
| E833 | menu.js | how far the work is: a queue's first item by the time left on it; the help line by its time to read |
| E834 | menu.js | every frame the running rings recede, pinned at 12, clockwise, gone when the work is done |
| E835 | menu.js | the queue: the first item rings down (run), those waiting behind it full and bright (lit); the green fill is gone |
| E836 | menu.js | MR title: every menu's title row ends in back, book and close, always in the same place (Albert, Nov 9 12:57) |
| E837 | menu.js | a help line wider than its bar shows the chevron; the chevron opens it to two lines and closes it again |
| E838 | menu.js | the chevron's tap: open or close the help lines |
| E839 | menu.js | a font from the type rule: its weight and size, in the face named |
| E840 | menu.js | the stances: a people's name over two columns, then its four boxes (gift or bribe, war, terms, ally), each ringed by its colour; not built yet |
| E841 | menu.js | the small cards are two columns of the mold wide: the width read from the bar's own width, set once a render |
| E842 | menu.js | a card hanging under its top button: centred under the button, held inside the screen |
| E843 | menu.js | Paused: the speeds and its help line; a tap on play plays again |
| E844 | menu.js | Sound: the three volumes and its help line, under the mute button; a tap on mute mutes and shows it, a tap again hears and hides it |
| E845 | menu.js | the book: Welcome back mid-match (Resume, New game), paused |
| E846 | menu.js | a message kept for the Help page, newest first, the same one twice in a row once |
| E847 | menu.js | Help: the earlier messages, newest first; the latest stays in the help line beneath |
| E848 | menu.js | a small card's title: the title on its own row, back, book and close beneath it |
| E849 | menu.js | a group's label over its boxes, in small capitals across the whole row (as the v80 card) |
| E850 | menu.js | a ring is the box's outline: the box drops its own border so the ring sits on the edge, one line, never a second inside |
| E851 | econ.js | what a side cannot build yet (age, research, a building it needs, a later age): the locks before the limit; the Build menu hides these |
| E852 | econ.js | a building raised into another where it stands (the Gate's way over a wall): taken down, the new one's site laid in its place and paid; put back as it was when there is no room |
| E853 | menu.js | the Build menu: the open tab's buildings a side can build, the rest behind Show all; it opens on the first tab |
| E854 | menu.js | made from a building's card (SN34): the Dwelling's Apartment, the Lumber camp's Tree farm |
| E855 | index.html#the-woods-cache | a picked unit: the green ring at its feet, thick and glowing |
| E856 | menu.js | a picked unit takes the next tap as its one order (a thing: it does that; the ground: it goes there), then the pick clears |
| E857 | menu.js | the quick action: a tap on open ground opens a square of four, the first under the finger (Attack, Build, Squad, More); each step opens in the same place, so three taps in one spot send everyone |
| E858 | menu.js | a share of the army sent to the spot: all, half or a quarter, nearest first, or the idle only |
| E859 | menu.js | Build from the quick action: the Build menu opens on its first tab, the building's ghost starts at the spot |
| E860 | menu.js | the square laid with its first box under the finger, held inside the screen |
| E861 | econ.js | a builder's next site: the first one laid, then the nearest (a wall line keeps to the nearest piece) (Albert, Nov 9: first placed, first built) |
| E862 | index.html#floor-6-climate | the year's clock: the game's time from a start late in spring (D359), for seasons, leaves, the meadow, the weather and the harvest |
| E863 | index.html#floor-5-movables | the woods: walkable for a person or a rider at the woods' pace (D360), never for engines or wagons; the path pays the time lost, so the edge wins unless the trees are much shorter |
| E864 | index.html#touch | a tap anywhere on a building's drawn shape is the building: the front-most whose picture is solid under the finger (Albert, Nov 9 item 8.7) |
| E865 | index.html#touch | a hold is only the box drag to pick many (Albert, Nov 9 item 8.5): nothing else listens for it |
| E866 | menu.js | the menus' sizes, once: every px in the style read from the Screen book's css entry (SN35) |
| E867 | index.html#the-view-s-eyes-lights-and-stage | words drawn on the map at the head type (SN20), never a size typed in the code |
| E868 | index.html#floor-7-display | the sight map, per side: each tile counts the eyes on it (VIS), remembers being seen (EXPL); the buildings a side has seen stay as it saw them (MEM) |
| E869 | index.html#floor-7-display | an eye's tiles: every tile in its reach whose ground, a body high, its line clears over the tops between (trees and buildings by height); cast again only when the eye steps to a new tile, its reach changes, or the tops change |
| E870 | index.html#floor-7-display | seen now: a unit whose tile is in sight; a building any of whose corners is |
| E871 | index.html#floor-7-display | the fog of war's veil: one pixel a tile, dark where never seen, dim where seen before, clear in sight, drawn over the land and smoothed |
| E872 | menu.js | the Start page's Fog of war: off, every side sees all (one rule for all) |
| E873 | index.html#floor-6-climate | the fog drawn by Beer-Lambert: its veil 1 - e^(-beta x path), the path the fog layer or the camera's height inside it, the height read from the zoom |
| E874 | index.html#floor-5-movables | a crossing is ice or woods: the same modes for both (single file, thin out, one at a time, stick to edges, go around), chosen once on the crossing card |
| E875 | combat.js | in the woods a missile is stopped by the trunks with chance 1 - e^(-stems x trunk x L), L the metres of wood the line runs through |
| E876 | combat.js | in the woods the line breaks into one-on-one duels (Lanchester's ancient model, the Linear Law): a blow is shared among all who strike the same foe |
| E877 | index.html#floor-7-display | an eye facing no fog: every point round its rim already seen by others, so it casts nothing; eyes in one cell share one cast |
| E878 | index.html#floor-7-display | a sight cell's woods: how much of it is wood and its ground under the trees, so a ray through the trunks thins by e^(-n d L) and a ray over the canopy meets a wall |
| E879 | index.html#the-door | the fog of war is saved with the game: the ground each side has seen and the buildings it remembers, and whether fog is on; sight is cast again on load |
| E880 | index.html#the-door | the land kept while the camera holds still: one copy drawn back instead of the ground, the meadow, the scars and the skin each frame (SoRen's keyed layers) |
| E889 | index.html#the-door | the land sheet slid by the camera's move since it was drawn: a pan costs one copy, not a new land |
| E893 | index.html#the-door | a sheet (a cel of the old cartoon): a picture a margin larger than the screen, slid pixel for pixel with the camera, painted again only when it slides past its margin, the zoom or its key changes, or its time runs out; the land and the fog of war are each one |
| E894 | index.html#the-door | with ?test the frame meter shows from the start (its only door, the Yard, left the Paused card in N6) |
| E896 | index.html#floor-7-display | the weather's fog as a sheet: each 5 m cell veiled by Beer-Lambert through the fog above it, the layer's top level over the lowest ground, so it pools in the hollows |
| E897 | index.html#floor-7-display | your own people under the canopy drawn as a ring over the trees, so you see who is inside |
| E898 | menu.js | the Build grid keeps its tab's two rows of three: empty slots fill where locked buildings hide, so every tab is one height (Albert Nov 9: fit two rows) |
| E900 | index.html#the-ground-s-soil-and-paper | the ground's soil and paper (N11): wet and snow on the ground for play, and the light, season, snow, flowers and glints over the paper sheets |
| E901 | index.html#the-ground-s-soil-and-paper | over the baked ground: the hills' sun and shade and the meadow's soft patches as one small soft picture, then the snow sheet, then the flowers |
| E902 | index.html#drawn-once-in-the-view-frame, index.html#the-ground-s-soil-and-paper | grass is painted a light neutral and also on its own sheet; that sheet takes the season's one colour (multiplied), recoloured only when the colour moves a visible step, so the ground is never painted again for the season |
| E904 | index.html#drawn-once-in-the-view-frame | a marsh is shallow water; reeds stand in it |
| E905 | index.html#drawn-once-in-the-view-frame | each paper sheet casts a thin shadow on the sheet below, along its edge |
| E906 | index.html#the-ground-s-soil-and-paper | the flowers come up in new places each year; the pebbles stay where they lie |
| E907 | index.html#the-ground-s-soil-and-paper | snow is one more paper sheet, in six steps: it lies where play's drift would cover the ground, hollows first |
| E908 | index.html#the-ground-s-soil-and-paper | glints on the water: a few short strokes that come and go |
| E909 | index.html#floor-3-non-movables | how far each water tile lies from its shore, in tiles (a chamfer distance in two passes); the water's three sheets follow it, so their edges are smooth |
| E910 | index.html#drawn-once-in-the-view-frame | the blades fade in with the zoom, as v80's did: none from far away, full close up |
| E911 | index.html#drawn-once-in-the-view-frame | a path kept as lists of points, so a run of one colour can be joined into one shape |
| E912 | index.html#drawn-once-in-the-view-frame | the ground is recorded once per map as shapes, not painted into a picture: each run of one colour or line becomes one shape, every piece wound the same way so joined pieces never cut holes; replayed under the camera, sharp at every zoom (the paper ground mock, Albert Nov 10 08:38) |
| E913 | index.html#drawn-once-in-the-view-frame | the ground's shapes, the grass's one shape (the season's colour and the blades' bed), the water's fill level and its foam, the blade tiles and the cloud tile |
| E914 | index.html#drawn-once-in-the-view-frame | a blade tile drawn at the screen's own pixels for the zoom in hand, thin triangles in the two blade colours, wrapped at the tile's edges: always sharp; only its scale is on the pattern, the camera on the canvas (Safari) |
| E915 | index.html#drawn-once-in-the-view-frame | the blades' marks, made once per map from the seed: where in the tile, how long, how much lean, dark or light |
| E916 | index.html#drawn-once-in-the-view-frame | the cloud tile: soft noise that wraps, made once per map |
| E917 | index.html#drawn-once-in-the-view-frame | cloud shadows drift over the land each frame, the camera and the drift on the canvas (Safari); still when motion is reduced |
| E918 | index.html#drawn-once-in-the-view-frame | the water fills every cut up to one level just under the grass (the mock's 'high'): the banks below it are drawn as shallow water with foam at its edge; drawing only, the walking rules are unchanged |
| E919 | index.html#drawn-once-in-the-view-frame | the minimap's picture: the shapes replayed once, small |
| E920 | index.html#drawn-once-in-the-view-frame | the shapes are kept by layer (tiles, faces, reeds, then each band's contours) and by colour within a layer, so a whole map replays as a few dozen fills, in the order it was painted |
| E921 | index.html#drawn-once-in-the-view-frame | each water band gets its own layer, laid in order before the first contour: the shapes are kept by colour within a layer, so in one layer the shallow band's fills all drew after the deep band's and hid its smooth edge, leaving the tile squares (Albert, Nov 10: lakes look like Minecraft) |
| E922 | index.html#drawn-once-in-the-view-frame | the grass mask (where the season's colour and the blades go) is cut from the contour cells, not the tiles: a whole grass cell goes in, runs of flat cells merged into one shape; the shore and hill cells add only their grass part; so the tint and blades stop at the grass's smooth edge and never step over the dirt (Albert, Nov 10: odd slopes toward lakes) |
| E923 | index.html#floor-3-non-movables | the water's distance from shore starts at the waterline itself: a water tile beside land takes the fraction of a tile to where the height crosses zero, and the distance spreads only through water; measured from the land tiles' middles it followed the turned grid's staircase, so the bands stepped (Albert, Nov 10, #5: the coast's sawtooth) |
| E924 | index.html#drawn-once-in-the-view-frame | the marsh: each marsh tile draws a number from the seed; where it is over D366's tussock the tile is water, else a tussock of grass; the water's edge runs between the tiles' middles (marching squares) and goes in with the shallows, drawn after the grass's colour and blades, with their foam on its edge; so the marsh is smooth and dotted with tussocks, never the tile staircase (Albert, Nov 10, #9) |
| E925 | menu.js | the Daily challenge: when it is on, the civ, difficulty, length (Albert, Nov 10 11:51) and the dangers are drawn from the day's own dice at the lot's odds, shown picked and locked, the same for everyone that day (Albert, Nov 10, #14) |
| E926 | menu.js | a Build cell you can't pay for says what you are short of each store, coloured red at nothing to white as you near it, and light green once you can pay, as Base and Mid (Albert, Nov 10, #24: what you are short, not the word Short; N17 #13) |
| E927 | menu.js | the Top Info Ribbon (SN39): nine readings under the top ribbon, rank by score among the sides |
| E928 | index.html#floor-6-climate | the time of day as hours and minutes, one home for the clock and the ribbon |
| E929 | index.html#the-view-s-eyes-lights-and-stage | a villager walking home with a load carries it on the back, a bundle in its store's colour (Albert, Nov 10, #35) |
| E930 | index.html#the-view-s-eyes-lights-and-stage | every finished building has a torch by its door from the start, houses their hearth as well; a building two tiles wide or more has two (Albert, Nov 10, #26) |
| E931 | econ.js | any queued item can be taken out, not only the last, and is paid back in full; taking out the first restarts the clock |
| E932 | menu.js | tap a queued slot to cancel it, refunded (Albert, Nov 10, #29) |
| E933 | menu.js | a site's card sends one more villager: the nearest idle, else the nearest worker, who goes back to work after (Albert, Nov 10, #33) |
| E934 | index.html#the-view-s-eyes-lights-and-stage | an order's target answers: a unit glows, a thing ripples in the done colour (Albert, Nov 10, #31) |
| E935 | index.html#touch | with someone picked, a tap near a resource takes it, so the target is bigger than its tile (Albert, Nov 10, #23) |
| E936 | combat.js | your soldiers leave a wild animal alone unless it is after one of yours or you sent them at it (Albert, Nov 10, #32) |
| E937 | combat.js | a beast that is not attacking your side is not a target for your soldiers |
| E938 | index.html#the-view-s-eyes-lights-and-stage | Lanterns (research) make the door torches brighter: light falls off as the square of distance (E = I / r^2), so a torch seen as far reaches sqrt(1 + gain) as far (Albert, Nov 10 11:51: the tech makes them brighter) |
| E939 | menu.js | a message with a place shows Go on the blue info bar, at the top and in a menu's help line; a tap there takes the camera to it and closes the menu (Albert, Nov 10, #30) |
| E940 | index.html#the-trees | a leafy crown takes a warm gloss on its sun side, painted only over its own leaves, baked once with the tree so it costs nothing a frame (Albert, Nov 10, #22) |
| E941 | menu.js | the quick action (Albert, Nov 10, #37, his sketches): tap open ground for a block of Attack, Build, Rally; Attack gives All, half, quarter, Squad; then a reticle in the same spot, and its tap sends them: four taps, the finger never moves; Rally sets the gathering point the same way; Build opens its six groups, then that group's buildings, placed where you tapped |
| E942 | menu.js | the quick action's steps that open another step, so the block stays open after them |
| E943 | menu.js | menus are not redrawn while a finger is down on a button (Albert, Nov 10, N17 #7: taps pressed but did nothing): a redraw replaced the button under the finger, so the click never came; the next frame after the lift draws again |
| E944 | econ.js | minus on a job acts at once: the villager drops what it carries and stands idle, so the count falls on the tap (Albert, Nov 10, N17 #10: plus already pulls someone off another job; minus did nothing while the one it picked walked its load home) |
| E945 | econ.js | first placed, first built (Albert, Nov 10, N17 #4; AoE2's build queue): a site placed with a builder picked who is still raising another joins the end of his list; he finishes the one he is on, then walks to the next in the order they were placed. This was the cause of builders leaving a half-built site (#19, #27, #36) |
| E946 | combat.js | an order you give marks each unit sent: its foot ring stays green from the order until its walk ends (Albert, Nov 10, N17 #9) |
| E947 | index.html#floor-7-display | your people under the canopy drawn as a flat ghost in your side's colour, the figure's outline only, with the ring at the feet (Albert, Nov 10, N17 #11); each figure's flat copy made once and kept |
| E949 | index.html#the-view-s-eyes-lights-and-stage | a flame's flicker by the real puffing rate (QCV, about 5 Hz for a torch), on the wall clock so game speed does not hurry it; the flame's height and its glow share one signal, so the light on the ground breathes with the flame (Albert, Nov 10, N17 #5) |
| E950 | index.html#the-view-s-eyes-lights-and-stage | campfires after dark (Albert, Nov 10, N17 #12): where two or more people stand or work together at night a campfire is lit among them, and stays where it was lit until dawn puts them all out; a light, not a building |
| E953 | sound.js | a sound that will not come back (Albert, Nov 10, N17 #10 and #19): a phone call leaves iOS's audio interrupted and a resume that fails stays failed, so when the last resume did not bring the sound back the next tap closes the old player and makes a new one |
| E954 | menu.js | the blue info strip is read, not flashed (Albert, Nov 10, N17 #18): each line stays its reading time (D read: the least time plus its words at adults' silent reading speed, Brysbaert 2019), and a line that comes while another is showing waits its turn instead of pushing it off, at most a page of them waiting |
| E955 | menu.js | the base and the rank row are drawn once a render and that one drawing is both compared and shown (Albert, Nov 10, N17 #11: People's ring did not recede: the second drawing numbered the Hall's queue 1 where the first had 0, and the ring read an empty slot) |
| E956 | econ.js | a soldier trained while a rally flag stands joins the ones already marching to it or holding it, and they are dressed into one formation there (Albert, Nov 10, N17 #14 and his N13 call: soldiers arriving together take a formation, not a loose crowd; a muster forms in ranks at its rallying point); each new one re-dresses the block, which grows a rank at a time |
| E957 | index.html#the-things-drawn-each-frame-back-to-fr | a sprite is cached at the next size up the √2 ladder, never the one below: drawn smaller it stays sharp, drawn larger it went soft and blocky (Albert, Nov 10, N17 #21: rocks still pixelated; the nearest step could sit 19% under the zoom) |
| E958 | index.html#floor-7-display | your people behind a tree or a building show through it as a silhouette, as Age of Empires II draws them (Albert, Nov 10, N17 #20): each of your people drawn this frame is kept with its box, and every tree or finished building drawn after it (so in front of it) whose box meets that box is paired with it |
| E959 | index.html#floor-7-display | each pair is drawn once the frame's things are down: the person's figure in your colour, cut to the shape of what stands in front of it, at the woods' silhouette strength (D woods.sil), so only the hidden part shows and the part in view is untouched |
| E960 | combat.js | an army's standard groups the soldiers of one order, one rally or one march (Albert, Nov 10, N17 #8: an army out carries its torch; a dressed army gives each soldier its own spot, so grouping by spot never made a group) |
| E961 | combat.js | the standards drawn this frame, kept so the lights put a torch on each after dark (v80's fire staff that walked with the army) |
| E962 | index.html#the-view-s-eyes-lights-and-stage | a campfire after dark by a drop-off where two or more of a side gather and bring their loads there, set just past the building's front corner, once a beat, never by a building that has its own hearth; out at dawn (Albert, Nov 10, N17 #8) |
| E963 | index.html#the-view-s-eyes-lights-and-stage | the lights add a torch on each army's standard, its glow at the standard's foot and its flame at the pole's top |
| E964 | index.html#the-view-s-eyes-lights-and-stage | an open flame's white-hot core: a bloom at its heart the flame's own height across, laid on with light (Albert, Nov 10 15:30, the fire mock) |
| E965 | index.html#the-view-s-eyes-lights-and-stage | one scratch canvas for the fire's highlights |
| E966 | index.html#the-view-s-eyes-lights-and-stage | firelight on the side that faces it (Albert, Nov 10, N17 #8, the mock): each person and finished building in view takes the nearest open flame's colour on its near half, from nothing at its middle to full at its near edge (Lambert's cosine law), as strong as that flame's glow is at its distance (the glow's own falloff) times the rim's gain, after dark only |
| E951 | index.html#floor-6-climate | a lightning flash is three to five return strokes about 60 ms apart (CIGRÉ TB 549), each re-lighting the bolt and whiting the sky by its nearness; timed on the wall clock, so at triple speed it is as startling as at one (Albert, Nov 10, N17 #15) |
| E952 | index.html#floor-2-terrain | a lake keeps off the trade roads' stops, as it keeps off another lake: a stop is a place on dry land where caravans meet, so the water is laid round it (Albert, Nov 10, audit item 4: on the test map two stops fell in lakes and the roads had 6 of 8) |
