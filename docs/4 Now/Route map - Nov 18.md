# Route map of n71 (Nov 18, 2026) — read-only, nothing in the game changed

Albert, Nov 18 20:47: "you should do the route map." His Nov 12 "If X, then Y" tap table, made from the running game.

## How
- `docs/4 Now/tools/routes.py <v100 dir> <out.json>` (needs `pre.js`: test.py's PRE): headless Chrome on v100, seed 20261105, a new game, one of each Build-menu building stood up, three Spearmen.
- 61 screens, 1,155 taps: every visible button of each screen, and five taps on the map (empty ground, own Town Center, own villager, berry bush, own Mill). Each tap: the screen before, the screen after, what changed, what new words showed. `ana.py` sorts it.
- Limits: it sees a route that is broken, not one that works and feels wrong. Tree, fish, foe villager and foe Town Center taps missed (no card opened): not covered. Library and Hall could not be stood up. A tap on a find often picked the villager working it. Soldier orders were checked by hand (below) because the screen shows nothing of them.

## The top line: Home · Jobs | Build · − · W
| Screen | Home | Jobs | Build | W |
|---|---|---|---|---|
| Rest | camera only | Jobs | Build | War |
| Jobs | rest | rest | Build | War |
| Build, placing | rest | Jobs | rest | War |
| Villager picked | rest | job row under him | build row under him | War |
| Own building's card (27 buildings and a site) | rest | **card stays, Jobs lights** | **card stays, Build lights** | War |
| Find's card (gold, iron, ruins, cemetery, den, campfire) | rest | **not on the line** | **not on the line** | War |
| War, army picked | rest | **not on the line** | **not on the line** | rest |
| Stores, Score, Mail | **no line** | **no line** | **no line** | **no line** |
- No dead end: every screen has a button that lands on rest.

## A tap on the map
| Screen | Ground | Own building | Own villager |
|---|---|---|---|
| Rest | nothing | its card | picked |
| Jobs open | Jobs stays | **card, Jobs still lit** | picked, job row open |
| Build open | Build stays | **card, Build still lit** | picked, build row open |
| Villager picked | sent, pick dropped | sent, pick dropped | pick dropped |
| Villager picked, Jobs open | Jobs page (pick dropped) | Jobs page | Jobs page |
| Building's card | rest | that building's card | picked |
| War | "Spot set: tap Attack or Move" | the same | picks nobody |
| Stores, Score, Mail | nothing | nothing | nothing |

## Found
1. Jobs and Build do nothing on a building's card but light up (all 27 cards and the site). `mtab` sets only `S.tab` (menu.js:157); the card outranks the tab (menu.js:258). His note of 19:38; idea agreed in talk 19:39 (a tap closes the card and opens the page).
2. The same from the other side: open Jobs or Build, tap a building, and the card opens with Jobs or Build still lit (menu.js:258; the tap does not clear `S.tab`).
3. The line is not one line: Jobs | Build are missing on a find's card and in War; the three pages have no line at all. Design 16 line 7 says the line never changes; its line 27 left these open.
4. War, checked by hand with three Spearmen picked (`MENU.act('mord', …)`):
   - Hold: the order is taken (job idle to hold) and the screen shows nothing: no word, nothing lit.
   - Defend: nothing happens and nothing is said (no one is under attack).
   - Retreat: the soldiers' job becomes `rout`, and nothing is said.
   - With nobody picked, All and Hold do nothing and say nothing.
5. Words drawn as buttons that do nothing: the name and the state word in the control row (55 taps: "Town Center", "Train", "food", "Villager"…). `mback` returns for the last crumb (menu.js:161).
6. Mail: 20 lines tap and do nothing (Lessons, Replies, Advice, Realm lines with no place to go). Crawler only.
7. Refused with no reason shown (crawler only, unverified): Gather on a gold, iron, ruins or campfire card; the Jobs "−" at zero; Train on 13 units that are locked (Legionary, Chariot, Cataphract, Elephant, Catapult, Trebuchet, Bombard, Ballista, Siege tower, Pioneer, Camp wagon, Medic, Priest); Out in War.
8. Small: Volume "Full" when already full; Copy log says nothing; Home at rest only moves the camera.
