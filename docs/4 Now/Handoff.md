# First Keep: hand-off (Nov 17, 2026, 20:00)

## START HERE (2026-11-17 20:00): N68 BUILT (preview n68): Design 15, the n67 play fixes. His play is next
- His go (Nov 17 19:00): "Can you carry on without me and go build new preview?" Rulings 18:12 to 18:46: The List 28; spec: `docs/3 Locks/Designs/15 The n67 play fixes.md`; mocks `mockups/dock/158` to `172`.
- What is in, cuts and Claude's calls: BUILDS.md N68; Parked.md "Cut in N68". Code: menu.js MOLD.crew (E1236), mx (E1233), book tap (E1234), halo on the `back` hook (E1235), reticle B (E432, P38); econ.js toJob (E1237).
- Open, his: problem 11 (one font; mock 162); the unit pictures at tile size; the trash red; whether the War screen and finds want a row ✕.
- Tests: t-n68, t-n67, t-guide pass; the full suite has no new failure against N67's list (t-n60 flaky on both).
- What he reports from play is not a go: talk first.


## START HERE (2026-11-17 16:00): N67 BUILT (preview n67): Design 14's mold and the audit answers. His play is next
- His go (Nov 17 15:40): "Go for all", the whole of Design 14 and The List 26 (his audit answers; the page https://claude.ai/artifact/XkZM2q1bKADA1r68i7Q6TC). Audit: `docs/4 Now/Audit - Nov 17.md`.
- What is in: BUILDS.md N67 (and Claude's calls there, his to overrule). Cuts: Parked.md "Cut in N67".
- Code: menu.js "The mold" (MOLD: jobs, build, bld, crew, find, ice, war; mline, mbase; verbs jsel to mrule, E1200 to E1232). Sizes and words: SN48 mold2, J61 mold.
- NOT done: colour dedupe (List 26 items 40 to 43: needs a pointer form in the colours book; art colours would shift), words stored twice (48), long lines (34), ECON teach internals, the cut buildings' shells (AI), the town alarm's button (his call).
- Sealed N67; preview `frankenstein-refresh/preview-n67/` on main. Tests: t-n67 and t-guide pass; the old menu tests that Design 14 replaced fail (BUILDS N67 names them: rewrite or retire, his call); 24 tests fail on N66 and N67 alike (older).
- What he reports from play is not a go: talk first.

## START HERE (2026-11-17 14:27): Design 14 SAVED (the mold for new game, Jobs, Build and the building card); NOTHING BUILT since N66
- Albert, Nov 17 08:24 to 14:25, talk and mocks: `docs/3 Locks/Designs/14 The mold - new game, Jobs, Build.md` holds every ruling; The List section 25 holds his words in order; mocks `mockups/dock/74` to `140`, the sheet `127`.
- Next, his: the Controller (army) in the mold, or one build (n67) of Design 14. Design 14 F lists what is still open.
- This chat ran very long: start the next one fresh (CLAUDE.md, this file, then Design 14).

## Before that (2026-11-17 08:06): 2026-11-17 08:06): N66 BUILT (preview n66): Design 13's building card is in the game for his play. His list from play is next
- His word (Nov 17 07:45, 07:46): get it all in the game, tests very light, he makes "a proper list" from play. What he reports from play is still not a go: talk first.
- What is in: BUILDS.md N66 (the bar and box, select then buy, small cards at the right, floating circles, Demolish tap-fill-tap, Repair and Send without a picked villager). Claude's calls are listed there: his to overrule.
- Code: menu.js kmodel (the card's model, once a render), kbar, kbox, kdot, kat; S.cs is the chosen cell's data-v, S.dm the armed building; SN47 holds every number and list, J60 the words. Finds, units and foes' buildings still use cardDock and ctop.
- OWED: the tests that read the old tabs (BUILDS.md N66 names them; main() throws until t-queue, t-cards and t-research are moved); the full suite not run. menu.js grew 9,249 bytes under a grant.
- Found, not fixed: `--rb` is set twice (blue, then a 2 px radius), so blue edges are void. Screens of N66: `mockups/dock/72-n66-real-screens.png`, `73-n66-real-screens.png`.

## Before that (2026-11-17 07:40): a night of talk and mocks on the building card: Design 13. NOTHING BUILT, nothing in the game changed since N65
- Read `docs/3 Locks/Designs/13 The building card - bar and box.md` first: section A is where the card stands, B his words in order, C Claude's calls (his to overrule), E the breaks not fixed. Ask him nothing that B answers.
- It is NOT a go to build. The glo-up is still ON HOLD and his play bugs come first (Nov 16 12:04). He has given no bug notes yet; he sent one match log with no words (`docs/4 Now/Match log - Nov 16 (188 min).json`; read on The List 23).
- The night began with "I think I messed up my game... over engineered it and somehow lost features" (Nov 16 20:58). The inventory (`docs/4 Now/Inventory - Nov 16.md`) found nothing lost by accident between n41 and n65. Claude's get-back-on-track plan (freeze design, play n65, sort notes, one bug build, repeat) was offered at 21:19 and not answered: he went on to the card.
- The card in one line: the Jobs dock's two rectangles, the strip as a bar (Home, name, tabs, Repair and Demolish as ringed icons, an X) that becomes a reading line when a cell is selected, the box as a green row (Train, Plant or Make) over a blue row (Learn); buildings with neither float three circles on the map.
- Mocks: `mockups/dock/46`, `52`, `54` to `70` (pngs kept for the key ones; every script is there). `card8.py` draws any building: `python3 card8.py <v100 dir> sheet <out.png> <panels.json>`; a panel is `[title, {"b": "Stable", "icons": true, "sel": "Chariot", ...}]` (options: cols 3, drop down, rj, barFit, vil, page, armed, queue, store, learn). `61` to `63` are the floating circles.
- Next, his: (1) his bug notes of n61 to n65, still owed; (2) on the card, Design 13 C and E: the X's two jobs, where Replant and the other state actions live, a status line, the double tap, whether this is the mold for every page. (3) Not run: the cards in other states (damaged, a site, worked out, prisoners).
- A bug met, not traced: the Pasture's Manage tab shows "Sheep" with "undefined" under it.

## Before that (2026-11-16 18:27): talk only since 17:02: the building card redrawn in mocks, nothing built; his play notes on bugs are still owed
- Nothing in the game changed since N65. The glo-up stays ON HOLD (Nov 16 12:04). n65 is the preview to play (`.../preview-n65/?fps` shows the meter).
- He came to give play notes and gave one: "I hate the two tabs for spawn and learn" (Nov 16 17:02). The rest of the talk is that card (The List, the lines of Nov 16 17:02 to 18:14; `mockups/dock/10` to `26`). His bug notes of n61 to n65 are NOT given yet.
- Where the card stands: "Sadly this is the best layout" (18:14) = mock 25 (one brown card, the name centred, back and close top right, Train and Learn under it, two pads of six tiles, a clear space). Then "bring this design to 2027 not 1997": mock 26, Claude's skin, NOT ruled. Nothing of it is a go to build.
- Open, his (ask nothing he has answered): Home, Jobs, Build, War while a card is open; Manage (on a Barracks only Repair and Demolish); the text squeeze (a tile is 58 px against 63; the lines under 0.77 are named on The List); whether the card's look replaces Nov 15 15:53 ("look like the Jobs dock, not the gradient") and Nov 15 16:18 ("the top row is the card's tabs"), and whether it spreads to the Jobs dock, the Controller and the top bar.
- How the mocks are made: `mockups/dock/NN-*.py` (Playwright on the real v100 page: each tab's cells are grabbed and laid out again; `python3 26-...py <v100 dir> <out.png> <before.png>`).

## Before that (2026-11-16 09:30): N65 sealed (preview n65): shots by kind. Design 12's plan is built. Next: his play bugs (the glo-up is ON HOLD, his word Nov 16 12:04)
- ON HOLD (Albert, Nov 16 12:04): do NOT build the glo-up. He found many bugs in play since N61 to N65 and says nothing was audited properly. Next: take his play notes, sort each (bug, which build brought it in: previews n60 to n65 are all up to compare; design question), trace bugs to file and line, one fix list for his go, bugs only. What he reports from play is not a go to change anything (talk first).
- N65 (BUILDS.md N65; Design 12 F5 and its section L; The List 22): his go was "Go go go proceed" (Nov 15 19:15) for all of Design 12 F and the glo-up, and "build Design 12 F5" (Nov 16 08:23). F1 to F5 are built; the glo-up is ruled and NOT built (The List 20; the notes are under "Before that (2026-11-15 14:47)" below). His play of n61 to n65 owed. Design 12 H, I, K and L list Claude's calls inside F2 to F5: his to overrule; ask nothing again that they or The List 22 answer.
- A shot's code: the shell slot `shot` (a look in the Sprites book, P49 to P54: its parts, `m` metres a unit, `trail`, the burning picture as `rank`); `combat.js:160` shot() and `combat.js:281` (E399); the numbers are D245. A new shooter must name a shot (the gate: SC7 needs it).
- Ruled Nov 16 11:58: the night light from a burning shot is left out and parked as TBD (Parked); N58 to N65's seals under grants stand ("You can seal them up"). Open, his, after play (Design 12 L): the sizes (true to life, small when zoomed out); the gun's ball as smoke alone.
- Size: combat.js is 65,500 bytes after a grant of 440 in N65; menu.js 130,624.
- Open from N60, not traced: t-n60 fails about 1 run in 3. The tests that come and go are named in BUILDS N62 to N65.

## Before that (2026-11-16 07:41): N64 sealed (preview n64): the Help card
- N64 (BUILDS.md N64; Design 12 F4 and its sections J and K; The List 22): his go was "Go go go proceed" (Nov 15 19:15) for all of Design 12 F and the glo-up, and "build Design 12 F4" (Nov 16 06:55). F1 to F4 are built; F5 and the glo-up are ruled and NOT built. His play of n61 to n64 owed. Design 12 H, I and K list Claude's calls inside F2, F3 and F4: his to overrule; ask nothing again that they or The List 22 answer.
- Help's code: `SCREENS.Help`, the table `HELP` (one function a tab: its body and what the reading box says), the verb `help` (no word: open; a word: set tab, grp, sub or sel), state `S.h` through `help()`; words J59, page SN46. A page that ticks Dock is drawn in the dock by base(); test.py's main opens every page by `S.tab`, so a new page must draw with no state set.
- For F5 (C9): `combat.js` shot() and D245; mock 4. Start: "build Design 12 F5".
- Size: menu.js is 130,624 bytes after a grant of 4,620 in N64. The verbs callHome and recallP have no button (seen, not cut).
- Open, his: the Pioneer has no history line of its own (Help shows the Ram's); the Guide's tables still hold the cut field defences; the 14 buildings off the Build menu are not in Help.
- Open from N60, not traced: t-n60 fails about 1 run in 3. t-a1, t-n25, t-n29, t-n51 and t-p2 also come and go on N63 and N64 alike.

## Before that (2026-11-16 04:52): N63 sealed (preview n63): the unit cell and "loses to"
- N63 (BUILDS.md N63; Design 12 F3 and its section I; The List 22): his go was "Go go go proceed" (Nov 15 19:15) for all of Design 12 F and the glo-up. F1 to F3 are built; F4, F5 and the glo-up are ruled and NOT built. His play of n61, n62 and n63 owed. Design 12 H and I list Claude's calls inside F2 and F3: his to overrule; ask nothing again that they or The List 22 answer.
- For F4 (Design 12 B6, C8): a new section "Help, guide, tips and tricks, learn" holding the Guide, the whole tech tree, the Town Center's info (Parked, "Cut in N62") and the triangle of what beats what. The Guide still lists the Ram and the Small camp wagon. What beats what is one law now: `top`, `beats`, `loses` (menu.js, E1121) over `WAR.vs`; the symbols are SN45 (`MK`), drawn by `SVG[key]` inside a `.u` line. N55 removed the Help page: find what is left of it before building.
- For F5 (C9): `combat.js` shot() and D245; mock 4.
- Size: menu.js is 126,007 bytes after a grant of 850 in N63. The verbs callHome and recallP have no button (seen, not cut).
- Open from N60, not traced: t-n60 fails about 1 run in 3. t-a1, t-n29 and t-p2 also come and go on N62 and N63 alike.

## Before that (2026-11-15 21:58): N62 sealed (preview n62): every card in the dock
- N62 (BUILDS.md N62; Design 12 F2 and its section H; The List 22): his go was "Go go go proceed" (Nov 15 19:15) for all of Design 12 F and the glo-up. F1 and F2 are built; F3 to F5 and the glo-up are ruled and NOT built. His play of n61 and n62 owed. Design 12 H lists Claude's sixteen calls inside F2: his to overrule; ask nothing again that it or The List 22 answers.
- For F3: a Train cell is `VERBS.train.label` (menu.js); its middle line is free unless the unit is queued (then "×3"). The numbers are D138 (`books/measure.js`), read through `FK.stat`. A cell holds 10 to 11 letters; the fit law (`fit`, E1120, SN44) squeezes to 77% and no further, and t-n62's `fits` check measures every research, unit and Build place: the three metrics and the symbol must pass it. Mock 3 is `mockups/dock/3-...png`; real screens of N62 are `mockups/dock/5-n62-real-screens.png`.
- The dock's mold is `dock(tabs, on, verb, cells)`; a card's tabs are `CARD` (one function a tab, SN4 gives the order and the tick); Manage is the catch-all. F4 (Help) needs a home for the tech tree, the Guide and the Town Center's info (Parked, "Cut in N62").
- Open from N60, not traced: t-n60 fails about 1 run in 3 (roads that do not cross, or stop short of the coast).

## Before that (2026-11-15 20:25): N61 sealed (preview n61): the dock, Build drawn in it
- N61 (BUILDS.md N61; Design 12; The List 22): his go was "Go go go proceed" (19:15) for all of Design 12 F and the glo-up ("Both. You can handle it"). F1 is built; F2 to F5 and the glo-up are ruled and NOT built. Section E's answers are on The List 22. His play of n61 owed.
- For F2: a page with the Dock tick (SC54) is drawn by base() from SCREENS (menu.js); a card (cardText, ROWS, menu.js:327) is still a sheet. The mocks are in `mockups/dock/`.

## Before that (2026-11-15 14:47): N60 sealed (preview n60); the glo-up was to be N61 and now follows the dock
- N60: roads coast to coast, one piece, dry, clear of finds, crossing; stops on the roads (BUILDS.md N60). His play owed.
- N61, ruled (The List 20, Nov 15 13:24): three tiers by age, Wood = Stone, Bronze; Timber = Classical, Medieval; Stone = Gunpowder, Enlightenment; Claude's improvements 1 to 8 all (7 civ styles stays parked); stone tier adds hit points; Claude picks the shape tells for the house and barracks; farms, pastures, Wonder, camps and booth stay as they are. Mock: https://claude.ai/artifact/Jmdx5BNouy88yNDfgUue6X. Art is drawn by ART[art](col, 0, lv, civ, want) through bldSprite (index.html 1262) with levelOf (547): start there.
- ALSO READ (2026-11-15 18:55): Design 12, the dock (`docs/3 Locks/Designs/12 ...`; The List 22). Albert's menu talk of Nov 15: ruled, not built, mocks in `mockups/dock/`. Its section E is open and is done with him, one question at a time. He has not said whether the dock or N61 comes first: ask that first.

Rules: `CLAUDE.md` (the one start). The one list: `The List.md` (section 10 holds Albert's Nov 14 return to n41). Laws: `docs/3 Locks/Designs/09`.

## Where it stands
- Albert, Nov 14 07:54 to 08:40: last night's jump to design was a judgement error; back to n41, keep a few items, then bug work only.
- Code: `frankenstein-refresh/v100/`, branch `n46-back-to-n41` (cut from S9 = n41, `cb9c9d2`). Last sealed build: N59 (bottom of `BUILDS.md`): roads out of water; stops apart and clear. Preview n59 (n58: roads coast to coast; n57: winding roads, research tab; n56: camera jumps; n55: Support and Mail; (n54: trade roads and booth; n53: the Wonder and Exit). Albert's list of 13 (Nov 14 22:05) is The List section 14: 1 and 2 built; 3 to 13 traced or waiting on his word.
- Branch `n29-the-list` keeps N42 to N45 whole, parked (`Parked.md`, "Parked Nov 14"). Do not build there.
- Previews on `main` (`frankenstein-refresh/preview-nNN/`): n65 is the one to play (n64: the Help card, shots as streaks; n63: the unit cell, no Help; n62: cards in the dock, no unit numbers; n61: Build in the dock, the old cards; n60: the roads); before them n59 was (n51: without the fix list; n50: without the order fix; n49: without the Pioneer; n48: without the mine shaft; n47: the new map only; n46: the old map). n40 to n45 stay up.
- Live v100 on `main`: untouched. Going live is Albert's call only.

## In N47 (on top of N46; Albert's go of Nov 14 10:16)
- Z4 by the randomizer: woods from one field over the board, ten plain and six rich clearings, winding paths clearing to clearing, the corner-to-middle lanes grown over (to confirm with him), a tree holds four villagers. Pictures: `mockups/n47`.

## Next builds, in his order (ruled, a go: Albert, Nov 14 10:51 "then you can do all three"; The List section 10 has his words). Each its own preview.
1. DONE as N48 (BUILT, his play owed): dock + fish as one element. Left from it: the pier turning toward the water and shortening on narrow water.
2. DONE as N49 (BUILT, his play owed): the mine shaft (Blasting lets a Mining camp be worked in place for gold). Left from it: iron, the animation.
   FIRST, before the Pioneer: the two faults N47 brought (BUILDS.md N48 and N49): t-p2 (a focused villager idle by a tree another finished) and t-n24 (a far attack order across woods). t-n24 waits on Albert's call.
3. DONE as N50 (BUILT, his play owed): the Pioneer. Left from it (BUILDS.md N50): a follow order for villagers, a felling speed, its own picture, trees drawn lying, proof of a tap order across a wood.
   Albert, Nov 14 12:48, the lanes: "Leave it for now" (t-n24's far check stays open against that).
The frozen-villager trace is OFF by his word (Nov 14 10:10): he tests first.

## In N46 (on top of n41)
- From N42: sound after a call; the clock's second line and the wonder countdown; the 1,000 sale; berries regrow; the research hint (TENTATIVE: his play decides).
- From N43: construction in three stages; sea fish; the woods card for soldiers only (the second half of the dock fix).
- New in N46: a sea fish is laid only where someone can stand to catch it (N361). Under N43's code 34 to 60 of about 105 sea fish could not be reached, and t-dock failed three runs in five.

## Rule (Albert, Nov 14 16:22)
- What he reports from play is NOT a go. Talk it through with him first; build only on his word. N51 broke this.
- To talk through next: army control (The List, section 10, Nov 14 16:06 to 16:22).

## Open bugs (not started; the trace of 1 is off by his word)
1. The frozen villagers. The 40-minute watch (`/home/claude/tools/watch.py` in the Nov 14 chat; the method is on The List, section 9) lists villagers in `carry` with a load and no path who do not move for 40 s: 44 on n41, 28 on N46, all within about a minute of each other around minute 33 to 38. So the fault is older than n41 and N45 did not cause it. A 10 s probe of another run saw none before 2300 s: it does not happen in every game. Not traced. First look: econ.js:229 (`!b || !beside(u, b)` then `carry(u)` again with no path made).
2. The inland fish with no place to stand (2 to 9 a map on n41, before sea fish): not touched.
3. His food under 60 for 27 minutes with 97 soldiers; villagers on `wait` with nothing telling him; "Something is in the way" beside farms (needs his screenshot); one computer's +14,000 gold a minute.
4. The tests that failed before Nov 13 (named in BUILDS.md, N46).

## Waiting on Albert
- His play of n52 (The List, section 11, has what to look at by item). Rally's home: his, "part of a large change later tonight" (Nov 14 17:34).
- Item 10 of section 11 (spawn "facing me") was built on Claude's reading (south side, south yard): his word decides.
- His play of n46. In play he inspects: dead buttons (Winner, "All tech / Later", "Scout / Later"), cut-off text, soldiers running by themselves. He judges the research hint.
- H10 (the computers' economy) stays held by his word of Nov 13 08:26.
- The Controller: he hates the new controls (Nov 13 22:06); a menu matter, done together, his detail to come.

## How to build (the short form)
- Gate: `cd frankenstein-refresh/v100 && python3 index.py` (PASS). A permit (`permit.json`) lists `opens` (at most 10; the prefix `book` opens all books; `code:index.html` opens all its sections) and `grow` bytes per file or section. Seal with `--seal` after the BUILDS.md entry; clear the permit.
- Tests: copy `v100` to `/tmp` with `mid` and `clean` beside it; `python3 test.py --only t-a,t-b`. Full suite about 25 minutes, in the background on a frozen copy. Do not run other Chrome jobs beside it: t-a1 (a frame-time check) and others fail under load.
- Publishing a preview: `git worktree add /tmp/mainwt main`; copy the game files (`index.html`, `menu.js`, `econ.js`, `combat.js`, `ai.js`, `sound.js`, `fonts.css`, `manifest.webmanifest`) and `books/`; commit; `git push origin HEAD:main`.
- The board differs from one page load to the next even on one seed (the scenario's land), so a test that passes once is not proof: run a board-dependent test five times.
- Times in BUILDS.md and The List come from `date` or `git log`, never from memory.
