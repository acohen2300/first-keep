# The Index and the Books: the key (Albert, Nov 4: "re layer the game ... source pointers like an 'act' pointer") [2026-11-04 10:35]

The Index is `INDEX.md` at the root: written from the code by `tests/index.py` at every publish, as `GUIDE.md` is, never by hand. This file is its key: what the Books are, how a card is read, and the list of things that still have two homes. [2026-11-04 10:35]

## 1. The Books (Albert's five, Nov 4) [2026-11-04 10:35]

| Book | Holds | Files (the table `BOOKS` in `tests/index.py` is the one home of this list) | [2026-11-04 10:35]
|---|---|---| [2026-11-04 10:35]
| **Truth** | the rules and the sim: every number, every behaviour | Rules `01` to `06`; World `10-world` and its layers, `09-nav`; Sim `08`, `11` to `16`, `36` to `40`; Save `34`, boot `41` | [2026-11-04 10:35]
| **Look** | the pictures, the screens, the sound | Art `18`, `19`; View `20` to `25`; Menus `26` to `33`, `39-huddle`, the shell; Sound `35` | [2026-11-04 10:35]
| **Words** | every line the player reads | `07-text`, `31-guide` | [2026-11-04 10:35]
| **Minds** | the computers and the natives | `17-ai`, `38-natives` | [2026-11-04 10:35]
| **Binder** | the records the code points at | `SCIENCE.md`, `COLORS.md`, `EXCEPTIONS.md`, the Decisions index, `CUTS.md` | [2026-11-04 10:35]
[2026-11-04 10:35] [2026-11-04 10:35]

A thing is in one Book. A rule's number is in Truth and nowhere else; Look reads it, never copies it; Words names it, never restates it. [2026-11-04 10:35]

## 2. The cards (Albert's format, Nov 4, 10:13; names, not numbers) [2026-11-04 10:35]

An element is one card in `src/00-elements.js` (`ELEMENTS`), read by the game and printed by the Index. Every slot is a list of names, and every name is a pointer to one thing that exists: [2026-11-04 10:35]

| Slot | What the names are | Checked by | [2026-11-04 10:35]
|---|---|---| [2026-11-04 10:35]
| `impacts` | the resources or node kinds it changes | the gate (`tests/elements.py`): real `RES` keys or node kinds | [2026-11-04 10:35]
| `acts` | the behaviours it runs: functions | the build: a top-level name declared once | [2026-11-04 10:35]
| `logic` | the rules and helpers it reads: tables and functions | the build: a top-level name declared once | [2026-11-04 10:35]
| `math` | the equations it uses, by their name in `SCIENCE.md` | the gate: the name stands in `SCIENCE.md` | [2026-11-04 10:35]
| `orders` | the player's verbs on it: `ACT` keys | the gate: a real verb | [2026-11-04 10:35]
| `pings` | the counts it reports: functions | the build: a top-level name declared once | [2026-11-04 10:35]
| `buildings` | the buildings it works at: `BLD` keys | the gate: a real building | [2026-11-04 10:35]
| `layers` | the layers of the board it writes to | the build: one of `LAYERS` | [2026-11-04 10:35]
| `art` | the drawing it uses: functions and tables | the build: a top-level name declared once | [2026-11-04 10:35]
| `exempt` | what it never touches (Albert's "exclusions") | the gate: the name does not appear in the files its `acts` live in | [2026-11-04 10:35]
[2026-11-04 10:35] [2026-11-04 10:35]

A card with a slot missing, or a name with no home or two, refuses the build (`build.py`): the builder who made the hole fixes it, not the player. "Layers applied: all" is not allowed: a card names the layers it writes, since reading is free and writing is where bugs come from. [2026-11-04 10:35]

The log (Albert: "build 44 changed these: from x to y"): `tests/index.py --diff` prints what changed on the cards since the last published build, from the cards themselves, for the preview's CUTS section. [2026-11-04 10:35]

## 3. The two homes (found by reading, Nov 4; each a fact that lives in two places and can disagree) [2026-11-04 10:35]

Closed in preview 52 (the layer rebuild): [2026-11-04 10:35]
- A lake's shore, traced three times (72, 72 and 48 points): one, `shoreWalk` (`10-world-water`). [2026-11-04 10:35]
- How far a shore reaches, three formulas: one, `lakeRTo`. The flood's rise added in three places: one, `floodRise`. [2026-11-04 10:35]
- The map-maker kept trees out of lakes as circles, the grid used the true shore (20 trees in water over 20 seeds): one taken list, `takenGap` by the shore. [2026-11-04 10:35]
- The great lake's margin, five numbers in five places: named in one table, `ROOM` (`10-world-ground`), the numbers unchanged. [2026-11-04 10:35]
- Rivers: the painting guessed the stretches and the source lake back from the gaps: each pool carries `run` and `src` (`makeRiver`), the painting reads `riverRuns`. [2026-11-04 10:35]
- The island and causeways, one length on the grid and another in the painting: `THRONE.isle`, `cause`, `causeTo`, both read them. [2026-11-04 10:35]
- A tree's size, five rules in five files: one table, `TREE` (`10-world-forest`); the size-by-what-is-left formula twice: one, `nodeScale`. [2026-11-04 10:35]
- Nodes clustered three ways: one placer, `cluster`. The corner's quarter, three ways: `QUARTER` and `inQuarterL`. [2026-11-04 10:35]

Still open (not changed: each is a rule or a look Albert decides): [2026-11-04 10:35]
- `37-events` 174: a building in flood is judged by `lakeGap` (which already holds the rise) against `EVENTS.flood.rise` again, so the rise counts twice; say whether that is the rule. [2026-11-04 10:35]
- Finds keep out of lakes by the lake's radius plus 25 (`laySpots`), not by the shore: one changed answer there moves every roll after it, so it waits for a yes; no find stood in water on 20 seeds. [2026-11-04 10:35]
- The trade lane the forest keeps clear is a straight band (`FOREST.lane`); the road drawn on the ground bends round the great lake (`21-view-frame`, `ROUTES`): two shapes of one route. [2026-11-04 10:35]
- `inQuarter` (world frame, for openWays) and `inQuarterL` (the corner's frame, for laying) are one idea in two frames; the world one reads the land's middle lines, the corner one the keep, 3.5 apart (KEEP_W). [2026-11-04 10:35]
- The villager's whole behaviour is one 350-line tick (`vilTick`, `13-sim-civil`) with its states implied (scared, carrying, posted, focused, searching, working), not named: the gather card names the functions round it; naming the states is the next cut, and a rule change in disguise if done carelessly. [2026-11-04 10:35]

## 4. Locking a definition, not its use (Albert's note, Nov 4, 11:20; a proposal for his yes, not built) [2026-11-04 12:05]

- A Binder entry is a definition: one name, the equation or the rule, its source, its code home (the line in `SCIENCE.md` today). Its *use* is any card or function that points at the name. [2026-11-04 12:05]
- To lock the definition: the entry carries a version line (`lanchester v1, Nov 4`), and `build.py` keeps a copy of every locked entry's text (`docs/0 Index/locks.json`, written by `tests/index.py --lock NAME`). A build whose entry text differs from the lock is refused unless the version line was bumped in the same change, with a reason. So a definition changes only on purpose, in the open, and the Index's log says "lanchester v1 → v2: why". [2026-11-04 12:05]
- The use stays free: a new card may point at `lanchester` with no ceremony; a card that points at a name with no entry refuses the build (the slot test, already in). [2026-11-04 12:05]
- Laying it out: the Binder stays one file (`SCIENCE.md`) with one table row an entry; the Index prints the Binder's names beside the cards that use each, so "what reads this?" is one look. Precedent: a schema registry (Confluent, Avro): a definition is versioned and immutable once published; readers bind to a version by name. [2026-11-04 12:05]
- The weakness: a locked table nobody may touch rots as fast as an unlocked one. The lock is on the *change*, not the *edit*: anyone may propose, the build makes the bump explicit. [2026-11-04 12:05]
