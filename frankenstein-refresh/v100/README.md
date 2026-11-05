# First Keep v100 · Ground Up

A clean build, poured from the foundation, in this folder only. The old game (`src/`, `index.html`, `preview/`) stays as reference and is never copied: a value crosses over only through the dictionary, an equation only through the calculations.

## The rule
Everything has one home, and the homes are Books (`books/*.js`), split by subject. The game reads the Books; it never types a number, an angle, a colour or a sound.
Everything you can tap is a shell: a row in the Shells book that names its layer, ticks its capabilities, and points each slot at another book (`"amount": "D53"`, `"body": "person"`, `"look": "vil"`). Laws (CALCULATIONS.md) run on whatever has the slots they need, and the code asks `has(thing, 'Fight')`, never a shell's code. Change a book entry and everything that reads it follows. A floor is built, checked, then locked: its books, its shells and its laws together.

## The pages
- `books/`: the Books. measure (D), angles (A), colours (C), ground (G), mass (W), shells (S), capabilities (SC, with the molds), screen (SN: the menus as shells), rules (X: every check), sprites (P), sound (H), citations (N). Each entry: code, name, value, citation, law.
- `CALCULATIONS.md`: Book 1, the Laws (Q), each with its citations.
- `index.py`: the gate (above); writes `INDEX-CITATIONS.md`, `INDEX.md` and `INVENTORY.md` (the building's scaffolding, with its change at every build).
- `DICTIONARY.md`: the words: layers, zones, logic, the shell mold, what is held for later.
- `EXTRACT.md`: what was pulled from the old game and SoRen, for reference only.
- `index.html`: the world (floors 1 to 7) and the body's laws, one door `FK`; `menu.js`, `econ.js`, `combat.js`, `ai.js`, `sound.js`: one module a file, each touching the world only through `FK`.

## How a build runs (Nov 5)
1. **The permit** (`permit.json`): the agreed list opens at most ten items (a book entry, a shell row, a law, a code section, a tool); it may grant a code item room to grow (`grow`). Everything else is sealed (`seal.json`: each item's fingerprint, bytes and typed numbers).
2. **The gate** (`python3 index.py`, half a second): every rule of stage books, code and seal in `books/rules.js`, run by its key. It writes INDEX-CITATIONS.md, INDEX.md and INVENTORY.md, prints what changed and where, and that everything else matched its seal byte for byte. A change off the permit, a locked byte moved, opened code that grew or typed a number: it stops, naming the rule.
3. **The tests** (`python3 test.py`, about ten seconds): every rule of stage page, one test each, including the proof that the gate stops five planted breaks.
4. **Publish** (`python3 publish.py "what it is"`): 2 and 3, then the build logged in BUILDS.md, the new seal, the permit cleared, a commit as Albert's no-reply address, the push. On GitHub the gate runs again before the site deploys (`.github/workflows/pages.yml`).

## The floors, in build order
0 Dictionary and the Books · 1 Ground (layers 10 to 80) · 2 Terrain (90) · 3 Non-movables (100) · 4 Buildings (110) · 5 Movables (120) · 6 Climate (130) · 7 Display (140) · 8 Menu (150) · 9 Economy · 10 Combat · 11 The computer · Sound beside the stack

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
- [x] 0 The Books (Nov 5): every number, angle, colour, look and sound out of the code into `books/`; shells as rows with ticks; the policing index. Camera rise 41° (A2); opens on the Town Center at a fifth of the screen (D165); walk at quick time, 1.52 m/s (D86); sound as recipes with one player (`sound.js`: distance, pan, snow muffle, rain mask, birds and crickets); impact by momentum and friction (QBT), the wounded sway (QBS), the stride by metres walked (QBU).
- [x] 0b The Screen book and the gate (Nov 5): menus as shells (six-slot rows; the subject's ticks pick a card's rows; Tall pages), six Build tabs of up to nine, the second top row cut, a solid panel; the permit, the seals, the molds, the tests, publish, and the gate on GitHub.
- [ ] 12 The look pass, then the lock of floors 1 and 2
