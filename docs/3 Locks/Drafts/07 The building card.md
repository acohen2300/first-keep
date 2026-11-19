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
