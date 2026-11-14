# The Plan: every open item, planned before anything is built [2026-11-12 08:35]

Albert, Nov 12 08:16: "audit and check for all the places that are fucked. Like the table I showed you above. We have to make a plan for them all. We have to make a plan for ALL open items FIRST, so that you can build AFTER." [2026-11-12 08:35]
Nothing on this page is built. The code is N29. A row is built only after his yes yes. The open items themselves stay on `The List.md`; this page is the order and the how. [2026-11-12 08:35]

## Part 1. The audit: where one thing has many homes (read-only, N29, Nov 12) [2026-11-12 08:35]
The books are one home. The behaviour is not. Counted by script over the five code files: [2026-11-12 08:35]
| What | How many places decide it | Where | What it breaks |
|---|---|---|---|
| A unit's job | 75 writes (idle alone: 33) | econ 41, combat 31, 3 more files | "builds a bit then stands", "tree then idle", idle soldiers |
| A unit's target | 35 | econ 18, combat 16, menu 1 | the same family |
| What it does next (`then`) | 31 | econ 15, combat 15 | the same family |
| Health | 29 (8 of them take health away) | econ 15, combat 9, index 4, ai 1 | no one place to ask "what hit this" |
| Its path | 25 | combat 15, econ 7 | the failed home search found today was one of these |
| What a tap means | 27 ifs and 17 exits in the tap code, 13 more ifs in `WAR.order` | menu, combat | the villager who stays green |
| Selection | 10 callers | menu | the same |
| Job names | 19 set, 21 tested: `convert`, `repair`, `shelter`, `unpack` are tested and never set; `envoy`, `scout` are set and never tested | econ, combat | dead branches |
| Helper names repeated across files | 80 of 1,148 (`near` and `add` in 4 files; `walkTo`, `take`, `spot`, `score`, `seen` in 3) | all | none found yet; not read one by one |
| Words | 1 key twice (`ledger`) | words book | the later one silently wins |
| Ring and colour meanings | 4 clashes | `Rings - Nov 12.md` | "rings and taps inconsistent" |
[2026-11-12 08:35]
Exact copies of a function body in two files: 0. Raw colours outside the Colours book: 429 in index.html, 296 of them inside the building art (picture data). [2026-11-12 08:35]

## Part 2. The fixes, each as one home: "if X, then Y" [2026-11-12 08:35]
- **P1. The tap table.** Three steps, each one home: (1) what is under the finger, by one order while something is selected: enemy, resource, building, your own unit, ground; (2) the table, in a book: item 1, item 2, action; (3) deselect after any row. With it: a finger may slide 10 px and still tap (6 today). Rows as Albert gave them (villager + resource = gather; army + enemy = attack; any unit + empty ground = go) plus rows 4 to 10 in the chat of Nov 12 08:14, awaiting his word. [2026-11-12 08:35]
- **P2. The job door.** One function gives a unit a job; nothing else writes job, target, `then` or path. Beside it a table in a book: when a job ends, what comes next (villager: built it = next site, else the last resource building, else the old job, else idle; and so on). "Idle" is then decided in one place, with its reason kept on the unit so a card can say why he stopped. Before it is touched: one test a behaviour, taken from today's game, so the move changes nothing by accident. [2026-11-12 08:35]
- **P3. The health door.** One function changes health and says who did it. [2026-11-12 08:35]
- **P4. The ring standard.** The three decisions in `Rings - Nov 12.md`, then one mold. [2026-11-12 08:35]
- **P5. The small ones.** The `ledger` key; the six job names that are dead; a read of the 80 repeated helper names, merging those that are the same thing. [2026-11-12 08:35]

## Part 3. The order to build in, and why [2026-11-12 08:35]
1. **The freeze's proof.** His phone on N29 with `?fps`. His 08:04 picture (start of a game): 59 fps, logic 0.7 ms, draw 2.5 ms. The case that matters is late, zoomed in, night, rain. Nothing to build until that picture comes. [2026-11-12 08:35]
2. **P1 the tap table.** It is what he hits in the first minute of every game. Small, and on its own. [2026-11-12 08:35]
3. **P2 the job door, with the bug traces.** The traces still open (builds a bit then stands; tap tree then idle; villagers disappearing; the Winner button) are looked for while writing P2's tests, not before: most of them live in those 75 writes. [2026-11-12 08:35]
4. **The numbers that are his call:** caravans (list C5), the four in `Rebalance - Nov 12.md`, nerve (E7). No building until answered; each is a book number once it is. [2026-11-12 08:35]
5. **P4 rings, then the visual group as one pass:** the mock sheet first (D5), his picks, then D2 (book icon, yellow lines, building animation), D3 (stops card, item cards), D6 (elite looks), D7 (battle noise). One mock sheet, one build. [2026-11-12 08:35]
6. **P3 the health door and P5 the small ones.** [2026-11-12 08:35]
7. **Proof and housekeeping:** B3 (Prep, towers, Split, Lure, Seek, tech tiles as played scenarios), B4 (the two old failing tests), F5 (the world event's search), D8 (units on 1,506 numbers), C6's test, then D9 the fresh-eyes review last, on the finished build. [2026-11-12 08:35]

## Part 4. What each step needs from Albert [2026-11-12 08:35]
- Step 1: one `?fps` screenshot, late in a game, when the phone is warm. [2026-11-12 08:35]
- Step 2: his word on rows 5, 6 and 10 of the table. [2026-11-12 08:35]
- Step 3: one line each on what he saw for the Winner button and villagers disappearing. [2026-11-12 08:35]
- Step 4: caravans (escort, nearer stops, or the risk); bush pickers 2 or 3; stone piles 3 or 5; nerve as it is or steadier. [2026-11-12 08:35]
- Step 5: the three ring decisions; then his picks off the mock sheet. [2026-11-12 08:35]
- Steps 6 and 7: nothing. [2026-11-12 08:35]
