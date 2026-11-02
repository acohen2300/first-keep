# The parts map: every base part, its one home, and what goes around it [2026-11-02 10:19]

Albert, Nov 2, 10:05 to 10:17: "set up a group of things and then every other thing points to that one group of things"; "point the randomizer there, point the fonts there, point design there, point the overlay there"; "if the heads up display is a heads up display then it should be there all the time and the only thing cycle does is change the words". Measured on preview 16 (f5b5287), comments left out. Report only: each fix is its own list and yes yes. [2026-11-02 10:19]

| # | Part | Its one home | Goes around it | Fix | [2026-11-02 10:19]
|---|---|---|---|---|
| 1 | The game's dice | `rng` (seeded; `tests/saves.py` holds the sim to it) | none in the game's rules | none | [2026-11-02 10:19]
| 2 | The looks' dice (sky, shake, smoke, sound) | `NS_rng` (`08-core`, M5) | 23 `Math.random`: view-frame 9, sound 7, weather 6, view-things 1 (the 24th, a new game's seed when none is given, is right) | point them at one looks-dice from `NS_rng`, seeded per game | [2026-11-02 10:19]
| 3 | Type | `mapFont`, CSS `--ui`, `--display`, two sizes | none | none | [2026-11-02 10:19]
| 4 | Screen colours | the style sheet's `:root` tokens (COLORS.md), 113 uses | none on screens | none | [2026-11-02 10:19]
| 5 | Map colours (marks, bars, rings, ripples, labels) | none: only the colour-code rings read `:root` (`codeOf`) | 227 colours typed in the view files (things 115, overlays 51, frame 34, base 12, weather 11, fog 4). The same meaning in two colours: the Z and the selection ring are #ffd35e, the screens' gold is --gold-1 #e6b947; a site's progress bar uses #e6b947 | the map reads the same tokens: one `tok(name)` (codeOf made general) | [2026-11-02 10:19]
| 6 | Drawings (units, buildings) | none | 704 typed colours (building art 406, figures 298) | a few materials (wood, thatch, stone, cloth, skin, metal), each shaded by `shade()`; not every shade a token | [2026-11-02 10:19]
| 7 | Words | `07-text` | 180 toasts written where they fire, in 19 files (verbs 41, orders 35, economy 24, events 15) | every toast a line in `07-text`, named; the code points at the name | [2026-11-02 10:19]
| 8 | The card mold | `27-cards-core` (btn, pic, sym, info, acts, list, rowHTML) | 296 tags written by hand: cards 132, card pages 79, frame 35, guide 29, games and huddle 16, quick army 4, emergency 1 | everything through the mold's parts; a part it lacks is added to the mold once | [2026-11-02 10:19]
| 9 | The HUD row | one element, patched in place (`rowUI`) | three page builders (`jobsPage`, `warPage`, `trainPage`) each lay out the row their own way; cycling lays it out again and measures the map again (`fit`) | the Formation (Oct 30): one fixed row of 6 slots over 12 half slots; Jobs, War and Train are only data (icon, word, count, state a slot); cycle changes the data | [2026-11-02 10:19]
| 10 | Who is "your army" | none: four definitions | `soldiersOf` (by tick), `armyOf` (by class), `troops` (armyOf less escort, rout, school), `sendable` (armyOf less spy, shrine, escort, school) | one `armyOf` and one list of busy states, each order naming which it skips | [2026-11-02 10:19]
| 11 | A time on screen | `clock` | `mmss` (39-huddle) is the same function under another name | one | [2026-11-02 10:19]
| 12 | Rings drawn on the map | `idleMark` for Z and F only | 32 ellipses drawn by hand (things 19, overlays 9, weather 2, events 2) | one `ring(x, y, r, tok)` | [2026-11-02 10:19]
| 13 | Screen sizes | CSS `--slot`, `--gap`, `--rad` | none found in the screens | none | [2026-11-02 10:19]

## Numbers the map and the screens work out apart [2026-11-02 10:19]
- Fixed: the idle count (the strip's Z count and the map's Z marks now share `freeVil` and `idlePost`, D-089). [2026-11-02 10:19]
- Open, to check one by one in the build: the army (10 above: the strip counts `armyOf`, the Army card `sendable`, the Emergency `troops`); time left (11). [2026-11-02 10:19]

## The order Claude proposes (each its own list and yes yes) [2026-11-02 10:19]
1. The HUD as one Formation (9): what Albert named first; it is also the map's bottom edge, measured once instead of on every cycle. [2026-11-02 10:19]
2. One army (10), one clock (11): small, and they are numbers the screens show. [2026-11-02 10:19]
3. The map reads the screen tokens (5), one ring (12): the same gold for the same meaning. [2026-11-02 10:19]
4. One looks-dice (2). [2026-11-02 10:19]
5. Words home (7) and the card mold (8): the largest, file by file. [2026-11-02 10:19]
6. Drawings by material (6): last; the most work for the least a player sees. [2026-11-02 10:19]

## Done (Nov 2, preview 17) [2026-11-02 10:41]
- 2 the looks' dice (`lookDice`), 10 the army (`armyFree`), 11 the clock, 12 the rings (`ring`): one home each. 7 and 8 parked (Parked.md, O5 and O6). [2026-11-02 10:41]
