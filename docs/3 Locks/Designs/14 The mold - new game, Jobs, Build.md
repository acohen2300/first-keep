# Design 14: The mold (new game, Jobs, Build)

Albert, Nov 17 2026, 08:24 to 14:01 (talk and mocks; NOT built). Sheet: `mockups/dock/127-design-14-final-sheet.png`. His words and every step are in The List, section 25. Saved on his word, 14:01: "Save the sheet and then we can work on it."

## A. The mold (13:41: "This is the mold. It is by far the best.")
- Three rows at the screen's foot: Home (left) and War (right) as floating circles; a control row; a tile row.
- Control row: the Jobs | Build toggle at the left (the lit half light), the middle control, the last slot at the right.
- Tiles: separate boxes, 2 px apart, 2 px from the screen's edges, 44 px tall.
- Look: tint (no blur), Claude's call on his "tint instead of glass is fine"; pill-shaped controls, the selected thumb light (style of iOS Phone's All | Missed).
- Tap areas 44 × 44; a control drawn thinner (24 px) spills its tap area upward only.

## B. Jobs
- Toggle on Jobs; no middle control; − and + in the last slot.
- Six tiles: People, Food, Wood, Stone, Gold, Iron; icon and count over the name. Pick a tile (white ring), then − or +.

## C. Build
- Toggle on Build; middle: the group track Town · Work · Army · Keep · Learn, 44 px a button.
- While placing a building: ✓ (place) and ✕ (cancel) sit between the toggle and the track; they show only while placing.
- Six tiles: the name (12) over its cost stacked one resource a line (11).
- Groups:
  - Town: House, Store, Bar, Theatre, Baths, Aqueduct
  - Work: Mill, Lumber, Mine, Dock, Workshop, Market
  - Army: Barracks, Range, Stable, Siege, Smith, Council
  - Keep: Town Center, Castle, Tower, Wall, Wonder
  - Learn: School, Temple, Hospital, Court, Library, Hall
- From other cards, not Build: Farm and Pasture (Mill); Quarry, Mint and Foundry (Mine); Tree farm (Lumber); Gate (Wall); the camp tents and the Depot (Camp wagon, made at the Siege workshop). Trade posts are laid on the map.
- Cut (log in Parked.md when built): Apartment, Palisade, Pit, Net, Stakes, Caltrops. Abatis: OPEN.
- Renamed: Dwelling → House, Tavern → Bar.

## D. New game
- Header: Welcome (IM Fell 18, gold) with A New Game (Barlow 14/600) beside it.
- Daily Challenge as a switch, a thin line under it.
- Two columns of pads, 3 across, all 40 px: Difficulty | Scenario (Siege "Holdout", Silk Road "Economic", Last Keep "3 vs 1"; optional, none = a normal game); Length (Conquest, 15, 30) | Rules (War Fog, Allies, Random; tap on, no tap off); Civilization | Hazards (points shown +3, +2; none lit = no hazards).
- Style B: top-lit brown gradient, sheen on Start; Start reads the civ's perks and the game.

## E. Building card (14:02 to 14:25; mocks `mockups/dock/130` to `140`)
- The mold: Home (left) and War (right) on top; beside Home a path "› Army › Barracks": the group word dim (Barlow 14) and tappable as a back button to that Build tab; the building's name Barlow 17/600, gold, with a soft gold halo behind it (centre 22%, fading out).
- Control row: a toggle Train | Learn (the left word follows what the building makes: Train, Plant at the Mill, Build at the Mine); Repair, Demolish and ✕ at the right (for now). Opens on Train; a building with nothing to train shows Learn only, no toggle.
- One tile row for the toggled side; the card shrinks to the right as options are fewer, the toggle moving right with it.
- Tiles: a unit's picture (small), its name, its cost on one line at 11 (a cost too long for its tile drops its spaces: "450w250f150g"); Train tiles outlined dim green, Learn dim blue (35% into the tray brown).
- Over six research: the sixth tile is More, paging the rest.
- Kept from K: one tap buys; the bar reads the tile after the tap (stats, "training 1") with Cancel; white ring = selected; green ring receding = training; blue receding = learning.
- Supersedes for the card his Nov 17 06:21 "I do mind separating training from learning" (he chose the toggle at 14:09 after Claude raised it).

## E2. Villager card (14:26 to 14:43; mock `mockups/dock/153`)
- One line on the fixed Home/War line: Home › Villager (Barlow 16/600 gold, halo), then buttons Stop, Garrison, Remove, Cancel, then War. Nothing under it: the map shows.
- Tap and tap: tap a villager, tap where it goes; the card holds only what a tap on the map can't do.
- Remove: tap, red fill, tap; the villager dies and frees its slot. Garrison: the nearest building. Cancel: closes.
- Path rule: the middle word only when the thing belongs to a Build group (Home › Army › Barracks; Home › Villager).

## E3. The army Controller (14:44 to 15:00; mocks `mockups/dock/154` to `157`)
- Home › War (red, red halo); the War circle lit red, showing ✕ to close.
- Who: one line, All · Foot · Bow · Cav · Siege · Idle, each with picked of total ("Cav 1/30"); words if they fit, icons if not (he prefers words; on a 390 px phone they need icons); − + at the right: each "−" leaves behind the picked unit nearest your Town Center and its ring goes out on the map.
- Orders: six tiles Attack, Move, Defend, Hold, Retreat, Squad. Tap and tap, either order: the map then the order, or the order then the map; the second tap sends them. No ✓ ✕. Orders without a spot (Hold, Defend, Retreat) go on the tap.
- The same menu opens from the War circle, a tap on your own soldier, or a hold-and-drag box over soldiers; the who-line fills to match. Soldiers get no card of their own.
- Leave the war screen: People, Garrison, Build, Protect (they live in Jobs and the villager card).
- Formation: parked (15:02).
- Support (spy, medic, priest) are villagers, not army: they get the villager card's one line (Home › Spy ...), not the Controller (15:02).
- Alert: when anything of yours is attacked, an alert circle appears just left of War, on the fixed line; tap it and the camera goes there; it hides when nothing is under attack (15:02). The army-on-the-move jump is not ruled.
- OPEN: Squad's page; Support's buttons.

## E4. Finds (15:00, his word; not mocked)
- Animals, berries, fish, rocks, stones and trees get a variation of the villager card: one line on the fixed Home/War line, Home › the find's name, a reading (what is left), its buttons, Cancel, War.

## Law: Home and War never move (14:40)
- Both circles sit at the same spot on every screen (714 px down on an 844 px phone); every card stacks from that line down.

## F. OPEN
- New game in the mold's look, or kept as a full-screen sheet.
- + and − on People; where the alert and army jumps go; the Jobs middle (a reading line?); three-cost buildings at 44 px; Abatis.
- Found in the books: Rebels has no cost; the unit pictures read poorly at tile size; research names that need short forms (Weights and measures, Letters of credit, Threshing sledge).

## G. Rulings, Nov 17 15:10 (new chat)
- Alert: a red circle with a triangle, just left of War on the fixed line; tap = camera goes there. (N56 already has the alert finder, WAR.attacked(): reuse it, move the button.)
- Support: the villager card plus one Skill button.
- Squad: Claude's idea, in the mold: the Squad tile reads "Squad 12" and a tap re-picks them; when the who-line holds a different pick it reads "Save" and a tap stores it. OPEN against the old squads (combat.js:25 SQ: plan, form, temper, intent; menu.js:158 needs Battalions): see the audit.
- New game: Claude's review offered (keep the full sheet; pads 44; separate tiles 2 px apart; Daily as a pill). Not ruled.
- 15:15: he asked for a full audit (ECS mapping of the new controls, the 12 core values, code attitude) before n67. 15:16: "In concept the new controls should allow us to cut ALOT of features." Audit: `docs/4 Now/Audit - Nov 17.md`.
