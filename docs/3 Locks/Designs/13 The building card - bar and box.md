# Design 13: the building card as a bar and a box (Albert, Nov 16 22:45 to Nov 17 07:35; talk and mocks only, NOTHING BUILT)

Replaces the card of Design 12 F2 (tabs Train | Learn | Manage in the dock) and the brown card of Nov 16 18:14. Every mock is n65's real page at 390 x 844 with its real cells, costs, figures and reasons.
The glo-up stays ON HOLD. BUILT as N66 (Albert, Nov 17 07:46: "Go. I would keep the tests very light"; BUILDS.md N66 says what went in and how it differs from the mocks): his play owed.

## A. Where the card stands (as of Nov 17 07:31)

Two pieces, in the Jobs dock's own two rectangles (the strip of circles, 44 px; the box, 90 px; measured 698/44 and 748/90 on n65):

1. **The bar** (the strip's rectangle).
   - Nothing selected: Home in a ring at the left; the building's name (IM Fell 18, cream) beside it; tabs if the building has more than one page; Repair (a wrench in a ring) and Demolish (a red trash can in a ring); close (an X in a ring). No back mark anywhere.
   - A cell selected: Home; the thing's name with its red ">" and "beats" symbol (Barlow 14/600); under it one line (a unit's health, attack, range and train time; a research step's effect; or the game's own reason in red when it is locked); the cost, each part green or red on its own; the button (Train, Learn, ...; grey when it cannot be bought; "Cancel" on a working cell); the X.
2. **The box** (the dock's rectangle).
   - Top row = what the building makes (Train, Plant or Make), tinted green. Bottom row = Learn, tinted blue. Train and Learn are never on separate tabs.
   - No tiles: a row is one tinted strip with short divider lines that stop short of its edges (the Controller's pad).
   - A cell is a picture (a unit's own figure) and a name; research and plots have no picture, so their name takes up to two lines.
   - A cell's name wears the colour the game gives its cost today (red, white at just enough, green). A cell he cannot afford is not dimmed; a locked cell alone is dim.
   - Selected = a solid ring round the cell (green on the top row, blue on the bottom). Working = the same ring receding clockwise. Queued and waiting = the faint track only. A count (x2) in the cell's corner.
   - A row with nothing in it is not drawn ("If there is no spawning we don't need a green line"). A one-row card is brought down: the bar sits on its row at the bottom.
   - Small cards (three cells a row or fewer) are three cells wide, at the right, cells packed right; their bar is the same width, its rings 26 px and the name's font shrunk to fit. With a cell selected the bar grows leftward to full width (Claude's call).
3. **Taps.** First tap selects (the bar reads it); a second tap, or the button, buys. Demolish: tap, the ring fills red, tap again.
4. **Buildings with nothing to train, plant, make or learn get no card:** three (or two) circles float by the building on the map: send a villager (only where a villager works it), Repair, Demolish. The foot menu is untouched.
5. **Three buildings have tabs**, in the bar: Town Center (Train | Relations), Market (Train | Trade | Bulk), War Council (Learn | Squads).

Latest mocks: `mockups/dock/70` (right-justified small cards), `69`, `68`, `64` to `67` (every card), `63` (the floating circles), `60` (Demolish), `59`, `58`, `52` (the bar), `46` (the footprint). The renderer for any building is `mockups/dock/card8.py` (`python3 card8.py <v100 dir> sheet <out.png> <panels.json>`; `measure <out.json>` runs all 48).

## B. His words, in order (Nov 17 unless dated)

- Nov 16 22:45: "How would you show on screen to a player that they can research 6 items and spawn 6 different types of units.. in a single slim card, that has the most up to date design aesthetic"
- 04:45: "I meant can you mock it as we normally do in a game screen" (a mock = the design drawn in the game's screen).
- 04:52: "Why don't you just add the stats to the bottom row?" (done: mock 36)
- 04:57: selected "is a solid green ring for train and a solid build ring for learn. The when training or learning the ring recedes clockwise as is now" ("build" read as blue)
- 05:02: "Yes. I like your fix idea. I wouldn't bold the font. Another change I'd do is make the corners of the menus and buttons less rounded." (the fix: a queued, waiting cell wears the faint track only; corners: card 8, cell 4, button 6)
- 05:06: asked for the summed research bonus beside the name. 05:09: "You're right. Get rid of the summed bonus in the top row."
- 05:14: "Can you try option 3 but for stable try 16? And the bottom row, can you tighten the padding slightly?" 05:18: "Try centering 'Stable'".
- 05:20: "what if instead of tiles, we used the style where there is a divider line?" 05:25: "I like a also. But it's two taps so if you can't afford it, the bottom row can tell you" (A = a tinted strip a row)
- 05:27: "As a quick view the item name can shift from red to green as you can afford it.. like we have today but on the name before you tap it as the cost is today. Then when you tap it it shows you on the bottom. So instead of can't afford being dim, it's just red font that's ticking to green as you can"
- 05:33, with a screenshot of the Jobs dock (`mockups/dock/71-albert-screenshot-jobs-dock.jpg`): "If I wanted to keep a static foot print, how would you make that work?"
- 05:55: "Your two line version is the best. Can you some how fit that little home icon into the top left? I'm the reading bar? This way it's clear home is everywhere on all pages"
- 05:59: "Do you think you can manage to get a small ring around the home? Like it is on the jobs page?"
- 06:01 to 06:15, the name: Barlow 14/600 cream tried; "go back to the other fancy font and put it at 16 and on the left"; "Try cream 17"; "Try 18 please". Left at IM Fell 18, cream, at the left (his Nov 9 title rule's font and size).
- 06:21: "Run it. Note where it breaks. Suggest solutions and mock suggested solutions. I don't mind having tabs. I do mind separating training from learning."
- 06:43: "These look great. My idea for some cards was to be about half width. Or some smaller variation."
- 06:46: "For medic and farm, I'd shift everything to the left and open up the entire right side". 06:50: "You could shift it all right side instead."
- 06:50: "why can't repair and demolish just be icons? Or Fix in a circle and a trash can in a circle. Or something similar. I don't know why it needs to be so large"
- 07:04: "Can you get rid of all the '<' back buttons and put the X in a ring?"
- 07:15: "Why does demolish need a whole word? Why not just tap the icon once, red fill, tap again?"
- 07:16: "What's the deal with farm? It has nothing?" 07:18: "So why can't just two icons show on the game screen if you tap farm? Fix and trash?" 07:19: "You actually need a third. + send a villager" 07:20: "It needs to float like your mock for farm. I don't want it in the foot menu"
- 07:26: "If there is no spawning we don't need a green line"
- 07:28: "On things like aqueduct I wouldn't bring it all down. Not raise it up" (read as: bring the bar and its one row down to the bottom; he did not confirm the reading, and his next message built on it)
- 07:31: "And now I'd bring the bar and tech and spawn as close to right justified as I can. Things like aqueduct should shrink the font to fit a bar and width of three"

## C. Claude's calls inside his words: his to overrule

1. The X does two jobs now that back is gone: with a cell selected it steps back to the building's bar; with nothing selected it closes the card.
2. Tabs and the two icons give way to the reading line while a cell is selected.
3. A small card's bar grows leftward to full width when a cell is selected (the reading line does not fit three cells' width).
4. Page rule: page 1 is (Train or Plant or Make) over Learn; the other groups pair into further pages in order. Tab names: the first group's name, with Sell + Buy named "Trade".
5. The button's words: Train, Learn, Place (a plot), Make, Sell, Buy, Repair, Demolish, Call (Zeal), Open (a people or a squad), Muster, Build (an upgrade), Cancel.
6. The floating circles: 40 px, in a row above the building; under it when it is near the top of the screen. "Send a villager" is a NEW action: the game has none on a building today (`here` is "Soldiers here"; `helpers` is for a site under construction: menu.js VERBS).
7. Cost colour on the reading line is per part (red for the part he is short of); today the whole line shades together.
8. The research ring while working is blue on the mocks; his Nov 14 word is green while researching.
9. A keep-or-drop rule for rows is not settled: Claude would keep a row whenever the building can ever fill it.

## D. The run on every building (n65, each built and finished, a rich store, the last age, nothing learned)

48 of the 50 buildings (the Apartment and Trade post would not place). Data: `mockups/dock/53-all-buildings-run.json`; fit: `53-all-buildings-measure.json`.

- What the cards hold: 19 nothing but Repair and Demolish; 11 Learn only; 7 Train + Learn; 1 Train only (Training tent); 4 Learn + Plant; 1 Plant only (Depot); 2 Learn + Make; Town Center (Train, Learn, Relations, Misfits); Market (Train, Learn, Sell, Buy, Bulk); War Council (Learn, Squads, Plan).
- Under the newest rules: 19 float circles; 19 are small cards; 7 are full cards (Training tent, School, Depot, Barracks, Range, Stable, Siege workshop); 3 have tabs.
- Fit: the footprint holds on all 48 where it is meant to. No reading line overflows. The Town Center's resting bar is 2 px over (name, two tabs, two icons, the X). The worst name squeeze in a cell is 0.80 ("Apprenticeship"; the fit law's floor is 0.77). Of the 260 research names in the book, 6 need three lines in a cell (Chimney and fireplace, Weights and measures, Warp-weighted loom, Four-course rotation, Ever-normal granary, Elite: Apple-bearer): his "&" ruling shortens them; which already have short forms is unverified.
- The fitted bar's name size on the 19 small cards: 18 on 11 of them; Dock and Dwelling 16.75; Aqueduct and Workshop 16; Courthouse 13; Mining camp 12.75; Lumber camp and Quarry 12.25.

## E. Breaks not fixed

1. Manage holds more than Repair and Demolish, by state, and the run saw only finished, idle, undamaged buildings: Replant (a plot), Replant all, Helpers (a site), Ransom (a prisoner each), Zeal (menu.js, CARD.Manage). No home for them yet; Replant on a floating farm would be a fourth circle.
2. A building's health and a plot's yield (shown on today's card) have no place: the bar has no status line.
3. Market's Bulk tab reads "Sell 1k" four times (the resource was an icon).
4. War Council's Plan row is steppers (minus and plus), not cells to select.
5. Plant cells have no pictures.
6. Throne and Wonder would float a Demolish circle; the five field defences (Abatis, Pit, Net, Stakes, Caltrops) are still buildings in the books though he cut them from play (Nov 8).
7. The second tap that buys meets the game's double-tap trap (`S.tap`): five quick taps for five units. Not designed.
8. Demolish's tap, fill, tap needs: a fast double tap not to count; the armed ring to disarm (another tap elsewhere, or a few seconds). The villager's Exit arms the same way today (menu.js `vexit`).
9. More than six in a row (the Training tent's "+1"; a second page of research): not drawn.
10. Jobs, Build, War and the two jumps are off the screen while a card is open (Home is in the bar); a floating building keeps them all.
11. Is this the mold for Build, Help, Stores and the Controller, or the building card only? Not asked.
12. Cells are 39 px tall (the Jobs dock's own), under his 44; the floating circles are 40.
13. Red against green for colour-blind players; and green now means the top row, a working ring, "can afford" and the Train button at once. Claude's offer, not answered: a name is cream when he can afford it and shades red only when he cannot.
14. Squarer corners: this card only, or every card? Not ruled.
15. The other states were never run: damaged, under construction, worked out, holding prisoners, a full queue.

## F. A bug met on the way (in the game today, not from this design)

- The Pasture's Manage tab shows a cell "Sheep" whose second line reads "undefined" (seen in the run of Nov 17; not traced).

## G. Tried and dropped (for the record)

- A bottom reading line under the rows (mocks 35 to 45): moved up into the strip's rectangle for the static footprint (46).
- The summed research bonus by the name (39): dropped by him; a unit's own numbers on the reading line already include research (the Cataphract read 132 and 8.5 with six steps learned).
- The name as a grey Barlow label, as Barlow 14 cream, centred (40, 42, 49): he returned to IM Fell 18 cream at the left.
- One plain panel with cross dividers (43 B): he chose the tinted strip a row.
- Repair and Demolish as the bottom row's last two cells (54): replaced by the two icons in the bar (58).
- A bar-only card with the Jobs dock under it, and the circles in the strip's empty middle (56, 61, 62): he wants them floating (63).
- The small card at the left, and with a half-width bar that kept the numbers (57): at the right, the bar fitted by shrinking the name (70).
- A single row raised under a bar that stays put (68): brought down (69).
