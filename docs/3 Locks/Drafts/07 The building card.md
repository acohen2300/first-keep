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
