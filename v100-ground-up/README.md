# First Keep v100 · Ground Up

A clean build, poured from the foundation, in this folder only. The old game (`src/`, `index.html`, `preview/`) stays as reference and is never copied: a value crosses over only through the dictionary, an equation only through the calculations.

## The rule
Every thing has one code and one home. Numbers live in D, colours in C, angles in A, equations in Q with their citations in N. Everything else points there. Change the source and its users follow. A floor is built, checked, then locked.

## The pages
- `DICTIONARY.md`: every thing, group and rule, by code.
- `CALCULATIONS.md`: Q, the equations (letters only), and N, their citations.
- `INDEX.md`: Q and N matched both ways; written by `index.py`, never by hand.
- `EXTRACT.md`: what was pulled from the old game and SoRen, for reference only.
- `index.html`: the world, one file (floors 1 to 7), with one door, `FK`, that the modules hang on.
- `menu.js`, `econ.js`, `combat.js`, `ai.js`: floors 8 to 11, one file each, loaded by one script tag each; each lives alone and touches the world only through `FK` (and the menu and the computer act only through `ECON` and `WAR`, the same doors).

## The floors, in build order
0 Dictionary · 1 Ground (layers 10 to 80) · 2 Terrain (90) · 3 Non-movables (100) · 4 Buildings (110) · 5 Movables (120) · 6 Climate (130) · 7 Display (140) · 8 Menu (150) · 9 Economy · 10 Combat · 11 The computer · Sound beside the stack

## How to work it
Open `index.html` in a phone browser, or the preview link. Drag to pan, pinch or scroll to zoom. Tap a villager, then a bush or a tree, and it gathers; Jobs puts villagers on yields with − and +; Build raises a ghost you slide into place; the hall trains villagers; War aims and sends the soldiers. You hold the blue corner; the computer holds the opposite one and is always at war with you. The game ends when a hall falls, or at the bell (15 minutes) on score. Layers shows and hides each floor; Fast runs the clock ×8; New rolls another map. No build step: the files are the game.

## Status
- [x] 0 Dictionary
- [x] 1 Ground: the site, the board, the four strata, the grid turned, the coast as beach and cliff, the play edge, the four zones. Set on this floor for Albert to confirm: D12 to D19, A2.
- [x] 2 Terrain: lakes, rivers, fords, streams, hills, rock, crevices, the forest floor and the home pond, all cut or raised on the one height field; Z4 by the dice with the six answers beside each roll. Set on this floor for Albert to confirm: D23 to D52.
- [x] 3 Non-movables: a tree on every tile of woods; at home the berries, grove, gold and stone of Z1 sized from one age up (QBJ), Z3 the same three times over with iron; Z4's piles, patches, ruins, cemeteries, campfires and treasure by the dice; every one a shell with an amount and a yield, drawn as tints of C. Set on this floor for Albert to confirm: D53 to D83 (the prices D61 to D66 are the genre's stand-ins).
- [x] 4 Buildings: the B table, four sizes, Open or Closed, standing on flat free tiles; the pictures pulled from preview 49 (the last build before the camera turn), point lists only, packed to 350 lines, painted once per look and zoom step and stamped; the trees, bushes and rock the same way; the Town Center in Z2 on the road; a Build toggle to place and remove for testing. Set on this floor for Albert to confirm: D84.
- [x] 5 Movables: U and M as shells that walk (A*, QBL) at speeds from life (D85, D86); the figures from preview 49, one look a code; villagers round every Town Center, Gather to the nearest drop-off at the old game's rates (D88), the stores shown; deer and wolves wander in Z4 (QM); tap a villager to pick it, a find to send it gathering, the ground to walk; the deep woods painted once a chunk; 30 frames a second. Set on this floor for Albert to confirm: D85 to D98.
- [x] 6 Climate: the clock (Y), the sun by the equation (QA) and the light by SoRen's ramp, rain by the two-state chain (QH) with snow under 1 °C (QI), SoRen's weather on the glass and First Keep's lightning pinned to the ground it hits, wet and mud (QP, QN), snow cover and its melt (QO), ice that bears (QQ), fog and mist, the marsh; one weather for the whole board. Fast for testing. Set on this floor for Albert to confirm: D99 to D116.
- [x] 7 Display: the fog of war (sight by D117, fog in the air shortens it, the sea never fogged, one picture a tile a pixel laid on by one affine), shadows from the sun (QAT), side rings, the grass blades baked on, the seams closed, the camera kept on the board. Set on this floor for Albert to confirm: D117 to D121.
- [x] 8 Menu (`menu.js`): four tabs (Layers · Jobs · Build · War), one page, one card for whatever is picked, one cell mold; the glass reads the world through `read()` and acts through `act(verb, arg)` over VERBS, each with its own whyNot: a dim cell never runs, it says why. Set on this floor: D162 to D164.
- [x] 9 Economy (`econ.js`): costs, training queues, sites that villagers raise at n^0.7 (QAC), homes and room, six ages, food upkeep (QBP), the villager as one state machine (idle, walk, gather, carry, build, repair, wait) with Charnov's move-on (QW), the score (QBR), the bell and the fall of a hall. Set on this floor for Albert to confirm: D122 to D137 (the prices D123 are the genre's stand-ins, N69).
- [x] 10 Combat (`combat.js`): health, one blow (QBO: base × counter × flank − armour), the target by harm a second over health left (QAG), nerve (QBQ: a wave below 0.3 of its start goes home, N76), towers and the hall shoot (QAL), march and rout, health bars, the crosshair. Set on this floor for Albert to confirm: D138 to D148.
- [x] 11 The computer (`ai.js`): one brain, balanced: villagers by need, homes ahead of room, camps by the finds, farms when the bushes are gone, the barracks, the age when it can pay, the army as the best counter, a wave at Lanchester odds (QAF), home when it stalls. Normal only. Set on this floor for Albert to confirm: D149 to D161.
- [ ] 12 The look pass, then the lock of floors 1 and 2
