# Design 12: the dock, one card for everything (Albert, Nov 15 2026, 14:38 to 18:46)

His words, sorted. F1 BUILT as N61, F2 BUILT as N62, F3 BUILT as N63, F4 BUILT as N64 and F5 BUILT as N65: the plan is built (his play owed on all five; sections H, I, K and L hold Claude's calls inside F2, F3, F4 and F5; J is F4's ruling). Lines marked (C) are Claude's calls or findings, his to overrule. Mocks: `mockups/dock/` (0 his two sketches; 1 Build in the dock; 2 Town Center with tabs, three lines and the ring; 3 the unit cell and the symbols; 4 shots by kind; 5 and 6 real screens of N62 and N63; 7 the Help section; 8 and 9 real screens of N64 and N65).
His words for the build (18:46): "Lean and mean. Light and tight. Clean and clear. Simple and elegant. Follow our rules. Only one home for things. ECS laws. Books, citations, indexes, references, comments. No loose info. No helpers. No agents. No builders. Just you." And the 12 core values.

## A. The idea
1. **Tap zones.** "If 44px needs to be the tappable area. Can't we shrink things? The padding and outline is just decoration." Real-world: Apple's 44 pt and Material's 48 dp are hit areas, not drawn sizes; nearest-target hit testing (Bubble Cursor, Grossman and Balakrishnan 2005). From memory, not opened.
2. **The old Build card.** "This feels so outdated and ridiculous." "Why do we need to tell people how many they can build on items where you just build one?" No count on a build-one building. (C) once built it reads Built.
3. **No Build menu.** "Why does the build menu need to be a menu." His sketch (mock 0): mode circles above the dock; in Build the dock's two rows reskin: top row the six categories, bottom row that category's buildings. "Why am I fighting so hard. The answer was staring at me."
4. **The look.** Of the Jobs dock: "This is what I want it to look like." "The text move to 12px." Gradients and glow were mocked and dropped. Mock 1: the selected tab is the dock's own gold box with its floor out, the rule turning gold (C).
5. **Every card.** "Jobs looks like this. And now build looks like this. Then why can't the building card fit?" His sketch (mock 0): three circles (Jobs, Build, War), a name pill, three circles; rows Train and Learn. "I believe we may have finally solved the visual problem I've been fighting for weeks now." Real-world: the command card of StarCraft and Age of Empires (one fixed grid re-labelled by what is picked).

## B. Rulings
1. **Tabs.** Every card uses Build's rule: the top row is the card's groups as tabs, the bottom row six cells. "Agree." (His Train-over-Learn sketch gave way: nearly every building has a third group.)
2. **Six a tab, always.** "Do we even need 7 anywhere?" "I agreed with all those. We don't need actually two outposts wagons. I think the large one is enough." "For the tech in the few instances that they get backed up we can show page 2, but honestly I think things are dependent enough where that won't happen." "The siege workshop has too many anyhow." The engine to go: "The ram." (C) page 2 by a More cell in the sixth place, only then.
3. **Three lines in a cell.** "I actually think you can fit three rows. If you check the padding. It's good to see what things do, it would be far easier to somehow shrink the cost." Name, what it does, cost. Cost in letters: "That's fine, I liked it better like that." Its colour: "I also want the coloring to 'tick' each shade from red red to green green. See v80 when it was still nice." (v80: `src/08-core.js:23` costCol on `main`. This replaces Design 11 item 7's smooth ramp, C34.)
4. **No queue row.** "No queue row. Just a ring and counter." "Every time the green recedes and goes back to the start it's full again. So it does a lot at once from just a single visual." (C) the back circle cancels the last one: not ruled.
5. **The six circles.** "Do what makes sense. We have up to 6 circles. Everything should fit." "Three on the left should be the categories whereas the right three are navigation ones? Or home always left most. War always right most? I leave that up to you." (C) Home leftmost and War rightmost, as today; Jobs and Build beside Home; the pill names what is open; the two beside War are navigation: back and close while a card is open, the alert and army jumps (N56) when none is. War keeps Design 07's row.
6. **Show tech.** "Yes move the show tech from everywhere." The tech tree: "Tech tree moves to the section: Help, guide, tips and tricks, learn." The guide: "The guide should roll into a help/ guide / info center." (N55 removed the Help page; this section is new.)
7. **Start, Welcome back, Mail** stay their own screens: "For now. Yes."

## C. Added to the build list ("Absolutely added to the build list")
8. **Which unit to build.** "I don't know which units to build. I don't know if a long bow shoots further than a musketeer. I don't know what makes a knight better than an elephant. I don't know why elephants are so weak. I don't know the difference between the two footman. Players aren't historians." The answers are already in D138 (`books/measure.js:130`: health, blow, seconds a blow, reach, vs) and unseen. His pick, C (mock 3): line 1 the name with a symbol for what it beats; line 2 three metrics (health, damage a second = blow / seconds a blow, reach); line 3 the cost. (C) also: an enemy's card says what it loses to; the Help section shows the triangle (spear beats riders, riders beat archers, archers beat spear: D138 vs). Real-world: Age of Empires' "Strong vs."; Pokemon's "super effective". The five class symbols and three metric symbols are new art, Claude's drafts.
9. **Shots as what they are.** "I want the archers arrows to look like arrows. I want the fire arrows to be fire arrows and actually have fire. Same with the trebuchets and catapults." Today `combat.js:160` shot() pushes one kind of tracer, drawn as a streak (D245, `books/measure.js:220`); Fire arrows (O100, `books/tech.js:105`) has no picture. Where the streak is drawn: unverified. Real-world: Age of Empires II (arrows turn with their flight; flaming after a tech). Risk: frames; a picture a kind drawn once, a cap on flames.

## D. Claude's checks (branch `n46-back-to-n41` at 50b7656). A cell holds about 14 characters at the dock's size (measured on his screenshot: "Stone" is 62 px wide in a 194 px cell)
1. 254 techs. Effect lines (`menu.js:108` hintOf) over 14: 83, of which 48 list two or more effects. Tech names over 14: 31. Unit names over 14: 5 (Small camp wagon, Large camp wagon, Han crossbowman, Mongol horse archer, Maurya war elephant). Cost lines in letters all fit but the Wonder's.
2. Groups over six (D133, `books/measure.js:125`; `index.html:412` trains): Siege workshop 7 (6 without the Ram); the Training tent 7 (Villager, 2 Foot, 4 Archers); the Market sells 7 goods (D market). No building has more than 6 techs in one age.
3. CORRECTION: the Stable trains 6, not 7 as Claude said at 17:59. A civilisation's rider replaces a base rider (shells `replaces`). With the small wagon gone it is 5. The Chariot's retirement, which he agreed to, is no longer needed for the cap.
4. CORRECTION: Claude said 18 characters at 18:11; drawn at size it is about 14.
9. CORRECTION (N62, 2026-11-15 21:30): 14 was wrong too. Measured in the running game at 390 px wide: a cell is 62.7 px and "Lumber camp" (11 letters) is 63.9 px at 12 px, so a cell holds 10 to 11 letters. 101 of 254 research names, 9 unit names and every three-part price were wider than a cell. Hence the fit law and the short names (section H 3).
5. Relations (3 peoples) and Misfits (4 groups) (`menu.js:379`) fit as cells; each one's stances need a second step.
6. The unit's card (Design 08; `menu.js:327` ROWS.call): its 13 buttons fit as tabs and cells; its lists (orders, history, stats) are text with no cell.
7. Build tabs already hold exactly six each (SN2, `books/screen.js:5`).
8. The game's fonts are in `fonts.css` (Barlow Semi Condensed 400 and 600, IM Fell English SC); mock 3 uses them.

## E. Open: his word (the menus are done together)
1. The Chariot: retire it or keep it (D3).
2. The Training tent's seven. 3. The Market's seven goods.
4. Long effect lines: show the first effect only, or reword all 83 (Claude drafts; many fall by shortening words at J40, "research time", "training time").
5. Long names (31 techs, 5 units).
6. Relations and Misfits: the second step. 7. The unit card's lists.
8. Rally's home (open since Nov 14 17:34).
9. The alert jump cannot be reached while a card is open (B5).
10. Back cancels the last one queued (B4).
11. Player words for the book's "heavy", "light", "spear".
12. The symbols (mock 3): a symbol after the name can read as "is" as well as "beats".
13. Order against N61, the glo-up (ruled, next on the Handoff).
14. A count on a building with a cap above one ("2 left"): Claude's idea, not ruled.
15. Locked designs this redraws: 02 Relations, 03 The controls, 04 Market, 08 The call; MENU-SPEC and Screen SN4, SN11, SN12, SN27, SN33.

## F. The plan (CLAUDE.md 8c): for his yes
Spec: this file, complete once E is answered. Then, each its own build and preview, tests first (each check failing on today's code), permit, book entries, full suite on a frozen copy, seal; the `ecs` counts and the code size may not rise.
1. The dock frame: the six circles, the pill, the tab row, six cells; Build drawn in it (B1, B5, A3, A4). BUILT, N61.
2. Cards in it: Train, Learn, Manage tabs; three lines; cost in letters with the stepped colour; the ring and count; Show tech, the Ram, the small wagon and the queue row cut and logged in Parked (B2, B3, B4, B6). BUILT, N62 (BUILDS.md N62; cuts in Parked, "Cut in N62").
3. The unit cell and "loses to" (C8). BUILT, N63 (BUILDS.md N63; section I).
4. The Help section: guide, tips, the tech tree, the triangle (B6, C8). BUILT, N64 (BUILDS.md N64; sections J and K).
5. Shots by kind (C9). BUILT, N65 (BUILDS.md N65; section L).
Expected, unverified: 1 and 2 shrink menu.js (the Build page, the Town Center page and the card's rows give way to one mold).

## G. The 12 core values, checked for the dock
1 Fair: yes, the same card for every side. 2 Our logic: one mold, one home (the dock). 3 Real-life: the command card. 4, 5, 9 Math and source: Fitts's law T = a + b log2(D/W + 1), W the hit zone (from memory, not opened; goes in the Citations book at build). 6 Purpose: the map stays in sight; one grammar. 7 Function: every card's groups in at most six tabs of six. 8 One home: yes. 10 Detail and play: what a unit beats is shown. 11 Solves a problem: his words, A5. 12 Saves code: expected, unverified.

## H. N62 (F2), Claude's calls inside his rulings: his to overrule [2026-11-15 21:30]
Each is built. None was ruled in these words.
1. **The tabs** (SN4), by the thing's ticks, only those with something in them: Train, Learn, Sell, Buy, Bulk (the Market), Make, Plant (a drop-off's plots), Relations, Misfits (your Town Center), Squads, Plan (the War Council), Intel (what a spy read, on their hall), Manage (everything: what it is, what can be done). The Market has exactly six.
2. **Manage's first cell only tells**: health (and what a unit is doing), a site's share raised, what is left in a find, a flock.
3. **The fit law and the short names.** A line wider than its cell is drawn narrower, never under 77% of its width (SN44). 32 names still too wide have a short form for cells only (Words J58), by his "Shorten them as needed": Weights and measures → Weights; Chimney and fireplace → Chimney; Scientific method → Sci. method; Large camp wagon → Camp wagon; Elite: Royal elephant → Royal elephant; and the rest. The full name stays in messages and the Guide.
4. **The effect line** shows the first effect only, in sentence case ("Train time −25%", his form with a small t). Words shortened to fit (J40): gathering → Gather, research time → Research, the stranger's penalty → Penalty, two at a time → Per train.
5. **The cost's colour** ticks in 4 shades a side (C34 steps).
6. **More than six**: the sixth cell reads "+1" (how many more than six) over the page ("1/2"); a tap turns the page. Five cells a page then.
7. **The count** is "×3" on the cell's middle line. On a unit cell F3 puts the three metrics there: while the unit is queued the count takes that line.
8. **Rings in the dock show only at work**: green and receding on the one in hand, full on those that wait (blue for a research that waits). A research that can be bought wears no ring (his Nov 14 "blue when available" was "for now until he test plays"; mock 2 rings only the one at work).
9. **The Scout trains at the Town Center** (it was a dead "Later" box; the book D133 always listed it and the computers train it).
10. **Buying spice** is cut with selling it.
11. **A unit's card**: a lone unit of yours that is neither villager nor soldier (a caravan, a wagon, an envoy) opens Manage in the dock on a tap; a soldier always gets the Controller (a lone soldier used to get the card over it); a double tap on any unit opens its card. Manage holds Teach, Trade route, Escort, Release, the camera, Stealth, Stop or Recall, Exit.
12. **A thing that is not yours** has its name in its side's colour, for "(theirs)".
13. **Back** cancels the last unit queued from any tab of that building, and says so ("Spearman cancelled: its price is back").
14. **Locks**: a research says why short, in red, on its price line; a Build place reads Locked. A tap says it whole.
15. **The villager's brown pad** holds three; Log's box is empty.
16. **A four-part price** (the Wonder, the last two ages) takes two lines, two parts each; the age cell has no "Next age" line (mock 2 had it).

## I. N63 (F3), Claude's calls inside his rulings: his to overrule [2026-11-16 04:52]
Each is built. None was ruled in these words. Real screens: `mockups/dock/6-n63-real-screens.png`.
1. **What "beats" means.** One symbol: the class of the trained kind this unit has its largest bonus against, by combat's own law (`WAR.vs`, D138 vs); Buildings when it strikes only buildings, or strikes them harder than any kind. A tie goes to the first class in the book. It gives: Spearman > Riders; Swordsman, Legionary, Immortal > Engines; Archer, Horse archer > Foot; Javelineer > Archers; Crossbowman, Arquebusier, Ballista > Riders; Chariot, Cataphract > Archers (the Cataphract ties with Engines); War elephant > Buildings; Catapult, Bombard, Trebuchet > Buildings. Siege tower, Pioneer, Priest, Medic and Spy beat nothing and wear no mark. Weakness: one symbol hides a second bonus (the Arquebusier's 1.5 against Riders sits under its 2 against heavy riders: same symbol here, not always).
2. **The three numbers** (SN45): health; damage a second (a blow over the seconds a blow takes); reach in tiles. From 10 up a number is whole, under 10 it has one decimal. They are read through `FK.stat`, so research and ranks move them. Every soldier shows them, the Support class and the Pioneer too (their damage reads 0).
3. **No space round the >.** A cell is 61 px; the > and a 10 px symbol take 16. With a space, three more names would not fit.
4. **Ten short names, in cells only** (Words J58), by his "Shorten them as needed": where the name, the > and the symbol do not fit even drawn narrower, the cell keeps the kind and drops the civilisation's or the elite's word. Crossbowman, Han crossbowman, Elite crossbowman → Crossbow; Longbowman → Longbow; War elephant, Maurya war elephant, Royal elephant → Elephant; Mali horseman, Elite horseman → Horseman; Mongol horse archer → Horse archer. Weakness: a Han, Maurya, Mali or Mongol player's own unit, and four elites, lose their word on the cell (the numbers still differ; the full name is in the research cell, the messages and the Guide).
5. **"Loses to"** (Words J43): on the Manage tab of a unit that is not yours, one cell names the kind of yours with the largest bonus against it, under its class symbol ("Loses to / Spearman"). None when no kind of yours has a bonus. Not on buildings (not ruled), not on your own units.
6. **The symbols** have one home (SN45) and reuse the game's own icons where it had one: the shield (Foot), the bow (Archers), the horse (Riders), the house (Buildings); new in SN19: the wheel (Engines), the heart, the blow, the reach. 10 px (SN35 sym). Seen: the horse reads weakly at 10 px.
7. **Cut** (Parked, "Cut in N63"): the dead verb `kind`, which held a second home for a class's icon.

## J. F4, the Help section: RULED on the mock (2026-11-16 06:50); BUILT as N64 (2026-11-16 07:41)
Albert, Nov 16 05:20: "Ok go for F4". Ruled already (B6, C8): the tech tree, the guide, tips and the triangle live in one section "Help, guide, tips and tricks, learn". Not ruled: its form, its door, how the tree looks. The menus are done together, so this is a mock first: `mockups/dock/7-help-section-mock.png` (drawn in the running game with its own cells and the Guide's own data; no game code changed).
Found: v100 never had the Guide as a page. `guide()`, `guideMd()` and `hist()` (menu.js 545 to 572) only write GUIDE.md; the page N55 removed was the earlier help lines, not the Guide. Mid has it as a card of pages (mid/src/31-guide.js: rules, buildings, units, research, ages, peoples, history). The Guide holds 50 buildings, 32 units, 254 research steps (28 buildings research; none has more than 20 steps or 7 lines), 6 ages, 6 peoples, 9 finds, 7 rules; Words has 14 tips.
The proposal (one mold, the dock's):
1. **Help is a card in the dock**: "Help" in the top pill, Back and Close beside War, six tabs: Tips, Units, Buildings, Research, Ages, Peoples. Its body is taller than six cells (a tick, as the Start page is taller: his Nov 5 "exception in height only").
2. **Nothing scrolls.** A tab shows cells; a tap on one fills a reading box at the foot (its name, where, age, price, what it becomes, the why).
3. **Units**: the triangle as one line of symbols and words (spearmen > riders > archers > spearmen; engines > buildings), then every unit in N63's cell, a row a class.
4. **Research, the whole tree**: first the 28 buildings as cells with how much is learned ("2/20"); a tap opens that building's every step in the Learn tab's own cell, a group a line, in age order; a later age's step says its age in red. Back returns to the buildings.
5. **Buildings**: Build's six groups as a second row, then that group's places and a reading box. **Ages**: your town now (food eaten a minute, the next age's price and time: the Town Center's parked info) and each age's price, time and what it opens. **Peoples**: the six, then the finds. **Tips**: the 14 tips and the 7 rules.
6. **The door**: under the pause button, beside New game (the game is paused while you read).
7. Also in F4, ruled or plain fixes: the Guide stops listing the Ram and the Small camp wagon as trained.
Weaknesses: the Units and tree bodies are about 420 px tall and cover most of the map; a research cell in Help looks like one you can buy (proposal: Help only tells, a tap never buys); the rules' titles are sentences and need short names for cells; Mid's History page (dated steps, searchable) is left out.
His answers (2026-11-16 06:50, to four questions on mock 7; each was the option marked recommended):
- (a) The form: "Yes, as mocked": Help is a card in the dock, "Help" in the pill, the six tabs, a taller body of cells, a reading box at the foot.
- (b) The door: "Under the pause button": a Help cell beside New game; the game is paused while you read.
- (c) The tree: "Yes, as mocked": the buildings that research as cells with learned/total; a tap shows that building's every step in the Learn tab's cell, a group a line, later ages marked in red. Help only tells: a tap there never buys.
- (d) "Static, tap to read": nothing in Help scrolls; the 7 rules get short names for cells.
Still Claude's calls inside these, his to overrule (items 3 and 5 above were on the mock or in the question's words only in part): the triangle as one line; Buildings by Build's six groups; what Ages, Peoples and Tips hold; Mid's History page left out.
For the build (CLAUDE.md 8c; its own chat: "build Design 12 F4"): tests first; the mock's script is `mockups/dock/7-help-section-mock.py` (run: python3 it <v100 dir> <out.png>); everything it drew came from the game's own `VERBS.train.label`, `VERBS.research.label`, `guide()` and SN45; the body's height is a tick on the page (SN, as Start's Tall); the pause drop is `spdEl` (menu.js 91, 366; E706, E718); Back inside a building's tree returns to the buildings (as Relations: E840, E1115); the Guide's Ram and Small camp wagon rows go (units with no training time, D124).

## K. N64 (F4), Claude's calls inside his rulings: his to overrule [2026-11-16 07:41]
Real screens: `mockups/dock/8-n64-real-screens.png`. (C) throughout.
1. The short names: the 14 tips read Dwellings, Villagers, Wood, Idle, Barracks, Spearmen, Next age, Hungry, Farmers, Market, Selling, Fire, Sickness, Gold; the 7 rules read Town full, Messages, Room, The song, News, Peace, The crowns (J59). His to reword.
2. A tip that carries a number ("{n} villagers idle") reads # for it in Help.
3. Units shows the kind your own people train (a Roman sees the Legionary where others see the Swordsman); the other peoples' soldiers are told under Peoples.
4. The Guide drops only a unit that no building trains (the Ram, the Small camp wagon); the Envoy stays, because it is sent, not trained.
5. An age's cell holds its name and time. Its price ("1600f 900g 300s 400i") is 20 letters and a cell holds about 11; the price is in the reading box and, for the next age, in the lead line.
6. Buildings shows the 36 places of the Build page. The 14 off it (the camp's tents, the Apartment, the Tree farm, the Depot, the Palisade, the Abatis, the Natives' traps, the Throne) have no group and are not shown.
7. A step in Help is the Learn tab's own cell, so it says what the Learn tab would: for a building that is not standing "No building" in place of the price, and a step being researched shows its ring and clock.
8. Close and Back return to the drop under the pause button with the game still paused, not to the running game.
9. A building's reading box says what it trains and how many research steps it holds, not their names (the tree has them).
10. An age's reading box names the buildings and units it opens and counts the research.
11. Mid's History page (the dated steps) is left out, as section J said.
12. Help opens on Tips, fresh each time.
13. The Build circle is lit only when Build is open (it was lit for any page).
14. menu.js grew 4,617 bytes under a grant: Help is a new page and the cuts of N62 gave back more than it took (131,352 before N62, 130,624 now).

## L. N65 (F5), shots by kind: how his words were read, and Claude's calls inside them: his to overrule [2026-11-16 09:30]
Real screens: `mockups/dock/9-n65-real-screens.png` (its script beside it). (C) throughout.
1. The kinds. Mock 4's: arrow (Archer, horse archers), bolt (crossbowmen), ball (Arquebusier), stone (Catapult, Trebuchet), cannonball (Bombard). Beyond the mock: the Javelineer throws a javelin; the Ballista looses the crossbow's bolt, same picture and size; the Siege tower and the six buildings that shoot loose arrows.
2. True size, nothing enlarged (N388, N389): arrow 0.76 m, bolt 0.37, javelin 1.15, stone 0.33, the bombard's ball 0.5. At the opening zoom an arrow is 8 px long and a stone 4. Weakness: small on a phone when zoomed out. One number a look (`m`, Sprites P49 to P54) enlarges it.
3. The gun's ball has no picture: 15 mm cannot be seen. It is a dotted grey smoke trail. Mock 4 drew a small dot.
4. "Where it should be. So everywhere" is read as wherever the stat fire is: Fire arrows gives it to the Archer, the Crossbowman and the Horse archer; Burning shot to every engine (Catapult, Trebuchet, Ballista, Bombard, Siege tower). No research gives fire to the Javelineer, the Arquebusier or a building, so theirs never burn. The Bombard's burning ball is drawn glowing.
5. Trails: a stone, a cannonball and the gun's ball leave dots; an arrow, a bolt and a javelin leave none. The cream streak is cut (Parked, "Cut in N65").
6. One kept picture a kind: no flicker, no embers, no smoke at the muzzle (the frames risk in C9).
7. At night a burning shot does not light the ground. Mid's did. RULED (Albert, Nov 16 11:58): "I would leave it out for now for the lighting the ground for burning shot and park it as tbd." Left out; Parked. [2026-11-16 11:58]
8. A missile flies from where it was loosed. Before, its path slid with its shooter (a fault, fixed).
9. The Caravan's blow draws no missile now: it reaches 2.4 tiles but does not tick Shoot.
10. Every missile still flies the arrow's arc, a stone and a ball too. Seen, not changed.
11. combat.js grew 439 bytes under a grant. RULED (Albert, Nov 16 11:58, asked for his word on N58 to N65 being sealed under grants): "You can seal them up". Those seals stand. Read narrowly: CLAUDE.md 6's rule itself is unchanged, so a later build that grows the code still needs a grant and his word. [2026-11-16 11:58]
