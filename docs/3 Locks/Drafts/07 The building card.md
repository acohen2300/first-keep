# Draft 7: The building card, four elements [2026-11-19 14:38]

STATUS: DESIGN TALK, mocked on the n74 screen; not built. Albert, Nov 19 13:39 to 14:36. Mock: `07 card mock - Nov 19 14-33.png`.

## His four elements (sketch, 14:36)
1. The way: house icon, Home | Jobs | Build (the line's left).
2. The title: the building's name in gold, underlined in gold (14:22, 14:04 "read more like a title"); under it, smaller, its pages: Train | Learn | Relations (14:25, 14:33 "a title and then a menu under it"). The current page green and underlined.
3. The breadcrumb: the building's name in a green glowing box › the page in a green glowing box (14:22, 14:24); a chevron, not an arrow (14:22).
4. Exit: an outlined button, red outline with white text or white outline with red text (14:31, his pick open), under W.
- Alignment: the breadcrumb and the page menu share one line; Exit sits under W.
- Tiles: on the left, under the breadcrumb, outlined in white, not green (14:26, 14:27).
- Talk is renamed Relations (13:58).

## Tried and left
- "Welcome to" over the title in a script of yesteryear (14:07, 14:08): no script font in the game (Barlow Semi Condensed, IM Fell English SC); needs a font file (Pinyon Script, Great Vibes or Pacifico, free). Parked until a font is added.
- "Choose:" in italics (14:02): dropped in the chevron version.

## Open
- Demolish: no place yet (Claude's idea: a long press on Exit, with a confirm).
- The breadcrumb's first box quieter than the second (so the tappable one reads)?
- Long names: "Town Center" fills the line at 390 px; longer names must shrink or wrap.
- One mold for every building's card, not the Town Center alone (one home).

## Rows, his sketch of 14:40 [2026-11-19 14:45]
- Row 1: the way (house, Home | Jobs | Build), the title, W. Row 1.A: the pages under the title, their left edge on the title's (his vertical line, "Align"). Row 2: the breadcrumb, and Exit under W. Row 3: the tiles. Mock: `07 card mock - Nov 19 14-40.png`.
- RULING (14:40): Exit, red, white letters. Read as a red outline with white letters (his 14:31: "I meant outline").
- His sketch writes Home | Build | Jobs; the game's order is Home | Jobs | Build: to confirm.
- RULING (14:42): the title on the line of Home | Jobs | Build; Train | Learn | Relations tight under it, between the title and the breadcrumb row. The title is not tappable, so the pages' tap areas may reach up over it. Mock: `07 card mock - Nov 19 14-42.png`. [2026-11-19 14:48]
- Albert 14:45: the pages beside the breadcrumb, "in one place and the selected one glows". 14:46: pipes between them; the title in a gold outline, not underlined; Learn glows blue when picked (Train green). Mock: `07 card mock - Nov 19 14-46.png`. The page menu under the title (14:42) goes if he keeps this. [2026-11-19 14:50]
- RULINGS (14:48 to 14:52): one row, fixed slots: [building] > [page] Train | Learn | Relations | Repair | Demolish | Exit. A slot not used (Relations on a building with none, Repair when not damaged) keeps its space, empty, and its pipes go, so every slot is always in the same spot. Demolish gets its home here. The breadcrumb box stays ("We cannot drop town center. You will have to make it fit"): fits at 390 px at 13 px text (the row ends at 379 of 386). Mock: `07 card mock - Nov 19 14-52.png`. Claude flags: Demolish beside Exit wants a confirm tap. [2026-11-19 14:55]
- RULINGS (14:55): Demolish has a confirm tap ("Yeah"); the space above the tiles cut and the whole panel lowered, tighter. Mock: `07 card mock - Nov 19 14-55.png`. The confirm word "Tap again" overflows the row by 5 px at 13 px: a shorter word ("Sure?") or the same word glowing red. [2026-11-19 14:58]
- RULING (14:57): the confirm word is "Sure?". [2026-11-19 14:59]

## The card as agreed, Nov 19 14:57 ("So I think we have a new hud. Finally") [2026-11-19 14:59]
1. Row 1: house icon, Home | Jobs | Build; the building's name as a title in gold, in a gold outline (not tappable); W.
2. Row 2, one row of fixed slots: [building, green glow] > [page, glowing] Train | Learn | Relations | Repair | Demolish | Exit. The picked page glows: green for Train (and Relations), blue for Learn. A slot not used keeps its space empty and loses its pipes.
3. Demolish: one tap shows "Sure?" in its slot; a second demolishes; anything else cancels.
4. Exit: red outline, white letters, the height of the row.
5. Row 3: the tiles, on the left, outlined in white, tight under row 2. The whole panel lower, no padding over the tiles.
- Text 13 px on row 2 so all of it fits at 390 px (ends at 379 of 386).
- Open for the build: the breadcrumb's building box quieter than the page box?; long building names in row 1's gold box (shrink to fit); Home | Jobs | Build order (his 14:40 sketch wrote Home | Build | Jobs); a script "Welcome to" parked until a font is added.
- One mold for every building's card (one home), not the Town Center alone.
- Final mocks, full screen (15:04): `07 card final - Train.png`, `07 card final - Learn.png`. [2026-11-19 15:06]

## His answers, Nov 19 15:49 (on Claude's 12 questions) [2026-11-19 15:55]
1. The name twice is right: "One is the title one is a breadcrumb." 2. The breadcrumb's boxes stay as designed. 3. Demolish stays left of Exit. 4. "Show me at 44" (the tap areas). 5. "Show me the longest" (the longest building name in the title box). 6. Home | Jobs | Build (a); "I'm not sure what home does but I needed build and jobs to have a third". 7. "Gold everywhere. Red is just for war."

## Every card in the mold, mocked (Albert, 15:51: "Can you mock all menu cards? Building cards? Item cards. Berries etc?") [2026-11-19 16:35]
- `mockups/cards/` (panel.js = the mold, mock.py = the sheets, screens.py = three full game screens; harvest.json and menus.json = every card's real pages and tiles, read from v100 at the last age). `mockups/card44/` = his Q4 and Q5 (44 px tap areas; the longest name).
- Q4 at 44 px: every building's row 2 fits if the chevron (not tappable) takes no 44 px slot; the Market's Learn page is 1 px over and the Town Center's Relations page 4 px over. War Command's row (7 groups, −, +, Exit) is 59 px over at 44 px.
- Q5: the longest name on the Build list is "Siege workshop": 113 px at 18 px in the title; it fits row 1 and row 2.
- Found: the Market has four pages (Train, Sell, Buy, Learn), not three; other first pages are Plant (Mill, Lumber camp), Build (Mining camp, Wall), Make (Foundry, Workshop). 21 of 50 buildings have no page (only Repair, Demolish, Exit). Long tile names (Armed caravans, Dugout canoes, Seed selection, Timber framing, Weighted loom) shrink to about 8 px in a 61 px tile.
- Item cards (Berries, Tree, Gold, Stone, Iron, Fish) are Claude's proposal, no card exists today: the name as title and breadcrumb; "240 food left | 2 of 4 working"; − and + step the workers; Exit. Jobs in the mold (pick a resource tile, − and + in row 2) is also a proposal. Not ruled.
- Item cards, Albert 16:10: the info (how much food it has) goes where the tiles would be; an italic sentence sits beside the − and +, "Send a villager?" or "Add a villager", in italics like the other instructions. Mocked both wordings: `mockups/cards/sheet-Items.png`, `screen-Berries.png` (items.py). His pick of the wording open. Claude: "Add a villager" fits − and + (a count); "Send a villager?" is a question, which wants yes or no. [2026-11-19 16:20]
- RULINGS (Albert, 16:13): the item card's line is "Add a villager". The cards overlay the screen: no brown background. Mock: `mockups/cards/overlay.png` (overlay.py): top row fully clear (dark fill only inside the boxes and tiles, a shadow on the words), bottom row with a faint dark fade behind. His pick open. Claude's findings on the clear one: red words (Demolish, War's orders) and the grey italic line are the weakest over bright grass; the panel hides whatever stands under it (the Town Center itself in the mock). Note: Nov 14 he ruled cards solid ("You can't see through it anyhow"), Nov 17 "glass or a tint, either is fine"; this supersedes both. [2026-11-19 16:30]
- How the game has it today (n75; `mockups/cards/now.png`, now.py): the menu already overlays the game with no background (#ui, #base and its rows are transparent; read from the page). Only the round buttons, the tiles and War's selector have a dark fill; loose words sit on the game with a shadow. [2026-11-19 16:35]
- RULING (Albert, 16:20): the cards stay clear over the game, as today; no fade, no strip ("If it'll be like it is today, that's good"). [2026-11-19 16:40]
- His question (16:20): a touch on the empty space between the menu's words does not scroll the map. Cause (read, not fixed): menu.js:21 `#ui { pointer-events: none } #ui > * { pointer-events: auto }`: the menu's rows take every touch across their full width, gaps included; the map's drag lives on the canvas (index.html:1766) and never gets them. Fix idea (Claude, not ruled): the rows let touches through, only buttons and tiles take them. To check first: panels that scroll or take touches without a button (Mail, Help).
- His question (16:20): the minimum option (Home circle, +, W). It exists today: the − beside Build folds the menu (menu.js:154 mfold; :236 draws the + to unfold). Not yet in the new mold's mocks: row 1 (Home | Jobs | Build, title, W) has no − for it. Open: where the − goes. [2026-11-19 16:40]
- RULING (Albert, 16:27, "That's fine"): the fold's − sits right after Build, where it is today; folded, the menu is the Home circle, a + and W. Taken as his answer on the − only; the touch-gap fix still waits for his go. [2026-11-19 16:45]
- The touch-gap fix, tried on the page, not built (16:50): one rule, "#base and everything in it lets touches through; anything with a verb (data-v) takes them". Trial on n75: a touch in the gap of the card's row 2 lands on the map (before: on the row); every button still takes its tap on the Town Center card (6), Jobs (17), Build (8), War (14); nothing in #base takes touches without a verb. Mail, Help and Pause are another panel, untouched. Weakness: a tap that misses a button now reaches the map as a tap (with soldiers picked, that is an order). Waits for his go. [2026-11-19 16:50]

## Build plan for the new HUD (Albert, 16:57: build the menus before the clock, to play test; the clock overnight) — waits for his yes on this list [2026-11-19 17:50]
What he will see (one preview, n78):
1. Every building's card in the mold: Home | Jobs | Build, − (fold), gold title, W; row 2 the breadcrumb, pages, Repair | Demolish | Exit; tiles under. Clear over the game, as today.
2. Demolish asks "Sure?"; Exit replaces Cancel; Talk reads Relations; Repair shows only when damaged, its slot kept.
3. War Command: gold title, W lit red; All | Foot | Bow | Cav | Siege | Idle | Squad with counts, − and +; orders with red icons; the sixth tile Garrison villagers / Back to work. Out is cut.
4. Item cards: tap berries, a tree, gold, stone, iron or fish: title, "Add a villager" − +, Exit; "240 food left | 2 of 4 working" where the tiles would be.
5. Build in the mold (groups in row 2). Jobs keeps how it works today, in the mold's top row.
Claude's calls on what was open (his to overrule): the 21 page-less buildings keep the full card (one mold); long tile names shortened in the Words book (his Nov 15 word); tiles show name and cost only, as his final mock, the effect line leaves the tile (cut, to Parked); War's row keeps seven groups, so its tap areas run under 44 px ("It is what it is"); a group's number is how many are picked, or the total when none is; item card: + sends the nearest free villager, − sends one back to idle.
Not in it: the clock, the tools, grading.
- RULING (Albert, 17:36), built as N79: the fills of all buttons and outlines are clear, except the tiles for tech and train. [2026-11-19 19:40]
- His idea (17:37, talk): "we should consider a dark glow for contrast.. thoughts?" Claude: yes; it is how film subtitles and map labels stay readable over any picture (a dark halo), and the game's loose words already carry one. Weakness: under a coloured line it dulls the colour, so the glow goes outside and inside the line, the line itself stays crisp. Mock `mockups/cards/glow.png`. His word owed. [2026-11-19 19:40]
- His reason for the clear fills (17:38): "a lot of buttons and a text heavy menu is offset by seeing the game board in between things. Visually it works." [2026-11-19 19:45]
- RULING (Albert, 17:41), built as N80: Jobs' tiles are filled too; no patches: the fill is one rule on the tile row (see BUILDS N80). [2026-11-19 20:00]
- RULING (Albert, 18:51), built as N81: Build's tiles filled too. His question: "Or do we just do a shadow? Help me out". Claude: fill every tile (four of the tile rows are now exceptions to "clear", so the rule is really "tiles are filled; rows 1 and 2 are clear"), and give rows 1 and 2 a dark shadow. Mock `mockups/cards/tiles-shadow.png`. His word owed. [2026-11-19 20:20]
- Talk (Albert, 19:05, talk mode): "I liked the one where it faded to a bit dark towards the bottom. It gave it a bit of depth and transitioned nicely from clear no background to tint." (the bottom row of `mockups/cards/overlay.png`: clear at the top to about 60% near-black by mid-height). State of the work at 19:05: N82 is in the working files, tested, NOT sealed or pushed: Jobs always the Jobs page (a picked villager shows his job tiles at once), every tile filled, a 30% fade (clear to tint across row 1, flat under rows 2 and 3), a shadow on the words. Claude: 30% hardly shows in the game screen; make it one gradient down all three rows to 40% at the bottom (the top of Material's 20 to 40% range), one number in the book. His word owed. [2026-11-19 20:50]
