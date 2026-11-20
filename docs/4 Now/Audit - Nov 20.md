# First Keep: overnight audit, Nov 20 (03:16 to 04:30)

Read-only. Claude alone, no helpers. Code: branch `n46-back-to-n41` at N85 (95ae772); preview n84's game files are byte-equal to it.
Nothing in the game or the repo was changed, committed or pushed. Corrections (05:40, found while building N86): (a) item 13: the Home and War dots already have a 44 tap area (an unseen pad the measure missed); the row's words were 40. (b) Items 6 and 7 were single runs on random maps (the probe re-rolled the seed); N86's test t-n86 repeats both on the fixed seed, failing on N85. Items 1, 2, 6, 7 and the row's tap area are built in N86 (The List 52).
Lines are in `frankenstein-refresh/v100/`. "Proven" = a page probe or a run. "Read" = code read, not run.

## A. Stop before you play n84

1. **PROVEN. Two of the three computers never grow in preview n84.** New, from N84 (the gap round buildings, your note 46).
   - Your seed 1458651260, the computers alone, 30 minutes (villagers · people/room · age):

     | min | n82 side 1 | n82 side 2 | n84 side 1 | n84 side 2 | n84 side 3 |
     |---|---|---|---|---|---|
     | 10 | 22 · 36/40 · age 2 | 20 · 22/25 · age 2 | 10 · 10/10 · age 0 | 10 · 10/10 · age 0 | 18 · 21/25 · age 2 |
     | 30 | 86 · 136/136 · age 4 | 25 · 32/35 · age 4 | 10 · 10/10 · age 0 | 10 · 10/10 · age 0 | 23 · 34/40 · age 3 |

   - On a second seed (3819965508, on N85) one of the three is stuck the same way for 50 minutes.
   - They sit at 10 people of 10 room with 2,654 wood and 3,541 food unspent: no house is ever built.
   - Cause: the computer's search and the build rule ask two different questions.
     - The search (`ai.js:16-17`) asks `canPlace(…, true, true)`: a spot beside a Field passes.
     - The build (`econ.js:73`, `plan`) asks `placeWhy(side, code, i, j)` with no such pass. Since N84 (`econ.js:49`, `:54`; book D206 `gaps` [0, 2] to [2]) it answers "Leave a gap: two squares round each building".
     - Each computer starts with a Mill and a Farm. Its first spot is beside the Farm. The search picks it, the build refuses it, every turn, forever. 834 allowed spots are in reach of side 1; it never gets to them.
   - Proof of cause: on a scratch copy, with the build asking what the search asks, the 30 minutes equal n82's to the digit.
   - No test saw it: none of the 98 rules plays a computer past its first house.
   - Not fixed. Needs: your go. The fix at the source is one question in one home for search and build.

## B. The runaway computer gold (match log item 1): found

2. **PROVEN, reproduced on your seed in n82 (same lines in N85).** A caravan is paid for a trade run it never walks.
   - Caught at minute 41: side 2, allied with side 3, two caravans standing by the ally's Market. Each is paid 80 gold every 1.2 s without moving: 4,000 gold in 30 s, 8,000 a minute. Your log: about 8,500 a minute. (In your game it was another side: your play differed. The lines are the same.)
   - Cause (`econ.js:398-400`, `run`): the pay is given on reaching the ally's Market, with no check that the caravan went home since the last pay. When it finds no way home (`econ.js:389`, `toward`), it rests one repath (1.2 s by the rhythm seen), then starts a new run from where it stands, is already "there", and is paid again.
   - Real-world check: a caravan is paid for goods carried a distance. No trip, no pay.
   - Not fixed. Needs: your go.

## C. The full suite, run alone (owed since N84)

3. DONE. 70 of 98 rules hold, 28 red. Under load last night it was 32 red.
   - Load explains only four: t-n47, t-n60, t-n51, t-n52 pass alone. t-p2 is red alone (`focusHome`).
   - Red: t-a1 t-alarm t-civs t-fire t-food t-gather t-kinds t-land t-mind t-n24b t-n27 t-n29 t-n30 t-n42 t-odds t-orders t-p2 t-peace t-physics t-realm t-research t-same t-sight t-stage t-trade t-walls t-war t-wild.
4. Looked at tonight (7 of 28; five with a cause, two in part):
   - t-n27, t-n30: stale tests. They call `alarm`, `cpage`, `prep`: cut in N67 on your "Go for all" (Parked.md, "Cut in N67").
   - t-n42: `bulk` is the 1,000 lot sale (`sellK`, cut in N67); `fx` is the research effect line (cut in N78; your note 10 asks it back).
   - t-same: only its weather check is red. Same seed, same game still holds (the two states are equal).
   - t-war: two checks red. The test's reach figures come back NaN; the game's own `reachOf` gives a Tower 15.2 tiles and the Tower kills a spearman (probe). Why the test gets NaN, and its numbers-against-Mid check: not traced.
   - t-physics: the test reads a key (`hour`) the page no longer returns. Not traced further.
   - t-n24b: only `byAge` (the Build menu showing only your age's buildings). Not traced further.
5. NOT DONE: the other 21 red tests have no cause. Why: one look each; out of time. Needs: nothing from you.

## D. Army

6. **PROVEN. Note 22 (they die on the march instead of fighting).**
   - 12 spearmen sent past 5 archers with Move: 0 of 12 alive, 3 archers left.
   - The same march with Attack to ground: 6 of 12 alive, all 5 archers dead.
   - Cause (`combat.js:143`, E1092, built as N368): a soldier you sent to a spot looks for no foe until he arrives. That was your Nov 11 ruling ("an order means go where he taps, period"). Attack to ground clears the mark (`menu.js:251`).
   - Ruling owed: should a Move marcher who is struck turn and fight? Real armies: a column that is ambushed halts and fights.
7. **PROVEN. Note 23 (all on one spot).**
   - A group order is dressed in a grid: 30 foot stand in a block 11.4 by 7.6 tiles (`combat.js:183`, `:100`).
   - Soldiers sent one at a time to one spot are not: 12 end in 1.5 by 1.7 tiles, 15 pairs under half a tile apart, 8 of 12 still marching after 90 s. Each order dresses only its own soldiers; no order knows of the others.
   - Also: in a group of 30, three never reach their slot (240 s later: still marching, 2 to 3 tiles short, the slot free). They keep the "sent" mark, so by item 6 they look for no foe (`combat.js:147`).
   - Needs: the logic talk you asked for (a rest and a space for each unit).
8. Note 24 (the killer tower), facts for the talk (`books/measure.js:114`, D143):
   - Tower: 10 a hit every 1.2 s; reach 15.2 tiles, measured on the home ground. Castle: 12 a second, a longer bow (14 against 10.6).
   - Archer reach 9.5, crossbow 10, arquebus 9, ballista 15: all inside the Tower's reach. Only the catapult (17), bombard (19) and trebuchet (23) out-reach it.
   - Read: with no target the Tower's drop is measured from height zero, not from the ground round it (`combat.js:159`). Whether a shot uses that figure is not traced.
9. Notes 18, 25, 26 (formations, home advantage, ambush): READ. The code is in `combat.js` and nothing calls it: formation, temper and intent (the squads' SQ), ambush, charge, fall back, call home, reinforce. Cut from the menus in N67.

## E. Notes 16, 49, 31, 33, 34

10. **PROVEN. Note 16 (the wagon you tapped and did not see).** Two faults, either fits your note:
    - The Stable's cell is dim until three things hold: the Classical age, a Store, the research Camp wagons. A tap on the dim cell shows nothing on screen: the reason goes to Mail only (`menu.js:168`, `:34`, `:394`). By the code this is so for every refused tap in the game.
    - Trained (45 s; it stands 4 tiles from the Stable), the wagon opens the villager card: "choose a job below", Food, Wood, Gold, Stone, Iron, Garrison. There is no Unpack on it. It unpacks only if you pick it and tap the ground (`combat.js:180`, `econ.js:430`).
11. Note 49 (trade routes, caravans stopping by us): READ.
    - A caravan walks like anyone. The road is read in four places (`index.html:220`, `:241`, `:242`, `:270`); none is the pathfinder or the pace. So caravans do not follow the roads.
    - A computer's caravan goes home, to a stop, and back (`ai.js:132`, `econ.js:390-397`). It visits another side's Market only as an ally (`econ.js:398`). Nobody "stops by us" unless allied.
12. Notes 31, 33, 34 (no way to reach vassals, tax, trade; "the code is already there"): READ.
    - In `econ.js`, called by no menu and by no computer: vassals (makeVassal, offerOverlord, demandSurrender, forceTribute, demand, levy), envoys (sendEnvoy), debasing the mint, teach, prep.
    - The computers use these and you have no button: venture, muster, charge.

## F. The grammar inventory (notes 5, 15, 2, 9): the input for your mock

Measured on 88 rendered pages, 1,688 tappable cells (every Build tab, War, the sheets, 21 buildings' cards and tabs, 4 item cards, 3 unit cards). Type is the cell's own; a smaller second line inside a cell is not counted.

13. Tap size: 926 cells are under 44 in one direction. Nearly all are the control row, which is 40 tall on every page. Widths under 44 on it: the fold − 20, All 25, Cav 31, Foot 34, Squad 36, Home dot 40, War dot 40.
14. Type in tappable cells (your rule of Nov 9: 14/600 and 12/400):

    | found | cells | where |
    |---|---|---|
    | 11 / 400 | 359 | the top bar's cells (stores, age, score) |
    | 13 / 600 | 415 | Exit and the card's name, Demolish, Train, Learn, the Build groups, War's Foot, Bow, Cav |
    | 14 / 400 | 377 | Build, Train and Learn tiles, pause, mail |
    | 14 / 600 | 33 | War's orders |
    | 17 / 600 and 17 / 400 | 336 | Home, Jobs, Build, the fold − |
    | Arial 13.3 | 168 | the Home dot and the War dot: no font is set on them |

15. Rings and edges as built:

    | look | means today |
    |---|---|
    | white ring, dim | a choice not chosen (pause, mail, speed, volume, options) |
    | white ring, bright | the chosen one |
    | brown ring, dim | a Build tile |
    | green ring, thick, receding | a unit training |
    | blue ring, thick, receding | a research at work (two at once both run blue) |
    | white edge, 1 px | Train, Learn and Build tiles; War's orders with a brown fill |
    | white edge at 42% | the Home dot, the War dot |
    | red fill | War is on |
    | gold edge | Start |
    | red words | the War dot, Demolish, Delete (144 cells) |

16. NOT DONE: the rings on the map (picked units, the green villager ring); the Castle, Wonder and Library cards (my script could not place them).

## G. Match log, the rest

17. Villagers in "wait": READ. A villager waits by her drop-off when her find is gone and no other is in reach, and looks again every 2 s (`econ.js:172`); or when she has a load and no drop-off or no way to it (`econ.js:150`). Which find ran out in your game the log does not hold. A probe on a late game is owed.
18. Unspent stock, late ages, no end: not traced. They read as balance and pace (your notes 27, 28), not faults.

## Not done, and what is needed

1. Items 1 and 2 not fixed: your go.
2. 21 red tests untraced (item 5): Claude's work.
3. Note 37 (the v80, Base, Mid, current audit): not started. Out of time.
4. The mocks you asked for (2, 3, 4, 7, 9, 10, 12, 14, 15): not started; this was an audit run.
5. This report and the probe scripts are not in the repo: your word.
