# Audit, Nov 19, 2026 (n73) — Claude alone, read-only, nothing in the game changed

Albert, Nov 19 06:36: eight steps; findings saved here after each step. Code read at commit `562cc00` (branch `n46-back-to-n41`, N73).
Each finding: file and line; PROVEN (read in the code, counted by a script, or run on the page) or SUSPECTED (read only, not run).
Tools written for it (read-only): `docs/4 Now/tools/audit-nov19/` (`books.js`, `logs.py`, `book.js`, `design.py`, `design-read.py`, `probes.py`). Raw results: `tools/audit-nov19/out/`.

## Covered, sampled, not looked at
- Read in full, line by line: `menu.js` (498 lines), `econ.js` (631), `combat.js` (381), `ai.js` (172); `index.html` lines 1 to 509 and 1039 to 1822.
- Sampled, not read line by line: `index.html` 510 to 1038 (the building art, node art, trees and figures: drawing code). Counted by script only (colours and numbers typed in it).
- Not read: `sound.js`, `sw.js`, `fonts.css`, `test.py` (388 KB; only its head), `index.py` (only its rule list), the books line by line (checked by script, and by key where a finding needed a number).
- Read in full: CLAUDE.md, Handoff.md, The List sections 1 to 40, BUILDS.md N68 to N73, Route map - Nov 18.
- Not read: Designs 09 to 20 (only what The List quotes), Parked.md (searched, not read), Mid's and Base's code.
- Run on the page (headless Chrome, 390 x 844, a frozen copy in `/tmp`): the full suite once (24 minutes); the design measure on 44 screens; the route map (1,194 taps, 63 screens); seven probes.
- Not done: the suite was run once, not five times (Handoff: a board-dependent test needs five). No phone was used: nothing here proves speed or heat.
- Match logs: all seven in the repo, by one script (six in `docs/4 Now`, one in `Play logs`). You said five; there are seven.

---

## 1. Problems

### 1a. The full suite on n73 (frozen copy, one run, 24 minutes)
91 rules; 64 hold; 27 fail. N71's baseline was also 27: t-p2 passed this time, t-n57 failed (both known to flip). No new failure.
Lines inside `test.py` were not recorded: each test is named, its place in the file is unverified.

RIG: the test breaks before it judges anything (8). PROVEN by its own error text.
1. t-n27: reads `[0]` of nothing.
2. t-n30: throws in `labOf` (econ.js:116) on a tech code that no longer exists.
3. t-trade: `Object.assign` on null.
4. t-research: clicks a ring cell of the old card.
5. t-gather: reads `.x` of null.
6. t-walls: Mid's own code crashes on a building it has no entry for.
7. t-peace: compares nothing with a number (Python).
8. t-physics: asks for a key `hour` that is gone (Python).

STALE: the failing check contradicts a later ruling (8). PROVEN for the check named; other checks in the same test not traced where said.
9. t-n24b: Build no longer filters by age (Design 15).
10. t-n29: the reticle was redrawn in N68.
11. t-n42: reads the old card's text; its bulk check was retired in N71.
12. t-kinds: the Pioneer stands where Mid has the Ram.
13. t-land: 15 home bushes against Mid's 10 (your Nov 14 ruling). Its checks 7, 8, 10 not traced.
14. t-fire: sickness, changed by N73's immunity. Its books check not traced.
15. t-n17: the list of buildings with a Repeat tick differs from the test's list.
16. t-same: only "wet > 0" fails (no rain fell in 300 s). State and draws are equal: same seed, same game holds.

GAME, known (1).
17. t-n57: a road ends short of the coast on some boards.

NOT TRACED to a cause (10). SUSPECTED only.
18. t-odds: v100's battle odds are 2 to 6 times Mid's for the same armies (0.34 against 0.058; 0.895 against 0.413; 0.776 against 0.150). A real difference; drift or ruling unknown. The computers decide attacks on it (ai.js:142).
19. t-food: food after 60 s 1,300 against Mid's 1,173.
20. t-sight: two checks; one is the old "a villager does not see a foe after the tree is felled" (open since Nov 12).
21. t-stage: books; lights `lantern` against Mid's `hearth`; the shed.
22. t-war: its "reach" reads NaN from the test's own sum (a probe shows the Tower reaches 15.2 tiles and kills); its books check not traced.
23. t-civs (check 2). 24. t-wild. 25. t-mind. 26. t-realm. 27. t-orders (checks 5, 6, 9).
Why not finished: each compares v100 with a run of Mid; the test must be made to print both sides. My work; nothing needed from you.

What this means: 27 red is the resting state, so a build that breaks one of these 27 areas shows nothing. Eight of them judge nothing at all.

### 1b. The "built" items of N68 to N73 against the code
All found in the code (PROVEN, read): crew mold menu.js:247; book tap :345; halo :381; reticle :382 to 384; attack-move :255; tabs :156; back :160; finish :238; fold :154 to 155; People's tile and "Train: cost" :152; Idle box :240; price :56 to 57; wood fix econ.js:235; refund econ.js:77; War's Shelter | Work | Out menu.js:251; pause card :279; ribbon taps :267; immunity econ.js:535; yellow alert menu.js:257; white tiles :174.
Found, and built is not proven: none of these has your play yet except what you noted on n71.

Faults found on the way:
1. PROVEN (screenshot). The round delete button on a tapped building site prints the word "undefined": the Screen book has no `trash` icon (menu.js:257).
2. PROVEN. Three verbs with no button: `cancel` (menu.js:117), `follow` (:120), `mx` (:164, N68's close).
3. PROVEN. The 1,000 lot Market sale (your Nov 13 ruling, kept Nov 14) is gone: cut in N67, logged in Parked, its check retired in N71. A Sell tap sells 100 wood for 64 gold (probe). `bulkPay` has no caller (econ.js:362); the book's bulk number is unused. Whether you agreed to the cut: unverified.
4. PROVEN. t-n73's yellow check tests the class name, not the colour. The colour is right; the test would pass with it wrong.

---

## 2. Logic (the five files against the match logs)

### A. Army
1. PROVEN. Hold does not hold, and why. The Hold tile only sets `job: 'hold'` (menu.js:118). The soldier's brain drops a far target only if his temper is `hold` (combat.js:142), and temper is `hold` only inside a squad set to it or while a wall order runs (combat.js:27). A soldier with no squad is always `guard`, so he chases the first foe he sees (combat.js:134 to 145), and joins any fight near him (combat.js:58).
2. PROVEN. The form-up you asked for on Nov 18 is already in the engine with no button. `WAR.direct` (combat.js:221 to 229): `wall` (foot dress into a line or a choke and truly hold for `DI.wall.secs`), `loose` (archers form an arc at their range), `charge`; also `fallBack` (:219), `ambushAt` (:237), squads' temper, formation and intent dials (:25 to 32). Nothing in menu.js calls any of them (counted: 15 WAR functions with no caller outside combat.js). The mock of "archers form up and hold, footmen a wall" can be a button on these, not new logic.
3. PROVEN. A winning group routs. Every death takes `1 / (0.3 × (n + 1))` nerve from each soldier within 10 tiles (combat.js:66; D142 breakAt 0.3). A kill gives back 0.04, to the killer only (combat.js:62; D231). So a group breaks when about 30% of it is dead, whatever it has done to the enemy. Being outnumbered 1.5 to 1 nearby drains more (combat.js:118). This is "many run from few". Logs: his army lost 40% or more inside one minute in 6 of 7 games (up to 7 times a game).
4. PROVEN. A routed soldier can be taken prisoner after `PR.after` seconds of running (combat.js:301, :58), so a rout also bleeds the army.
5. PROVEN (probe on the page, Nov 19: job `rout`, no rout time, status `rally`). Retreat sets job `rout` with no rout time (combat.js:96), which the status reads as "rally" (combat.js:167); the nerve bar and the rout badge are keyed on job `rout` (index.html:1652 to 1653), so a retreating army wears the rout badge.
6. PROVEN. Stray numbers in combat.js: default health 400 (combat.js:9); `3 × repath` (:269); `0 : 4` and `1 : 4` tiles (:83, :147); `0.5` reach (:267).

### B. Villagers and the economy
7. PROVEN in the logs, cause SUSPECTED. Half the town waits at about minute 20. Peak on `wait`: 48 of 102 (minute 22), 29 of 56 (25), 28 of 53 (17), 20 of 62, 19 of 68, 33 of 86. A villager whose find runs out looks only inside a radius round the lost find that starts at 15 m and grows to 60 m over 20 s (econ.js:138, :145, :172; D197 search), then waits 2 s and looks again (econ.js:242). Past that radius she never walks. Nothing tells the player except the Idle count. Not reproduced on the page.
8. PROVEN. `wait` counts as idle (econ.js:124), and a posted or garrisoned villager is left out of the Idle box but not out of the top bar's idle number (econ.js:124 `jobs` against `idlers`): two idle counts that can differ. CORRECTION (Nov 19): overstated. Read again, the two differ only for a villager walking to shelter; small.
9. PROVEN. Population counts more than people standing: every queued unit counts at once (econ.js:35), caravans, wagons, envoys and levied soldiers count, and the cap falls when a house is lost (econ.js:37) with no word to the player. The top bar shows pop/cap, idle and army from three different counts (menu.js:78, :266). This is the likely "weird way the game is counting"; your example is still needed to be sure.
10. PROVEN. A kill pays the loser's whole store plus 25% of every building's price (econ.js:319; D233). Logs: loot 340,941 against 302,970 gathered (Nov 17), 142,110 (Nov 14), 110,821 (Nov 16). One kill ends the economy game.
11. PROVEN in the logs, cause SUSPECTED. One computer piles gold it never spends: 462,063 (Nov 13), 184,035 (Nov 14), 212,451 (Nov 17). Its spending is capped by its goals (ai.js:58 to 62) and ventures only above a spare (ai.js:126); trade and a held route keep paying (econ.js:393 to 405).
12. PROVEN in the logs. The computers reach the last age 2 to 4 times sooner than you in all seven games (theirs at minutes 19 to 43; yours at 61 to 101). The rule: age up when villagers reach a count and the army a size (ai.js:83), with all gathering steered to the price (ai.js:110 to 118).
13. PROVEN in the logs. One computer (side 2) trains villagers without end: peak 119 to 153 in every game (yours 65 to 123). It trains while one more villager pays back before the bell (ai.js:88 to 89), with no other limit but the cap of 180. Your Nov 4 ruling named this; it stands unfixed.
14. PROVEN. A Mint needs a villager posted (econ.js:140). Your Nov 4 word: mints run themselves. Call owed since Nov 14 (The List 13).
15. PROVEN. A tap on a worked-out field replants and pays at once, with no card and no word (menu.js:355).
16. PROVEN. Spice still runs in the route code (econ.js:391, :395 to 396) though the menu never asks for it (menu.js:95 passes `false`) and you killed spice on Nov 15. Dead branch.
17. PROVEN. In the engine with no button (counted, no caller outside econ.js): `debase` (you said no to it, Nov 11), `prep` and boarding (:296 to 306), `teach` (:340), `boxCut` (:179), `standDown` (:596), `crowns` (:602), and the whole vassal set: `demandSurrender`, `offerOverlord`, `demand`, `forceTribute`, `levy`, `releaseAll`, `breakTies` (:556 to 572). The computers do not use them either. About 90 lines of econ.js run for nobody.
18. PROVEN. Two lists of the five resources in two orders: food, wood, gold, stone, iron (econ.js:6) and food, wood, stone, gold, iron (menu.js:13). Not one home; the Stores table and the log use the second.
19. PROVEN. Words typed in code, past the gate's `words` rule: "cancelled", "taken down", "back" (menu.js:142); the seven peoples' names (menu.js:262); the four season names (index.html:1284).
20. PROVEN. Stray numbers in econ.js: build time default 30 (econ.js:239).

### C. Menus and the screen
21. PROVEN. The blue help reader still has a home: the Welcome back page (menu.js:276, reached at index.html:1809). Inside it the test `S.tab === 'Start'` can never be true (dead).
22. PROVEN. Three ways to draw a page live side by side: the mold (menu.js:239 to 258), the old sheet with its own head of Back, Book, Close (menu.js:183 to 184: Stores, Score, Mail), and the pause card built by hand (menu.js:279). Finds and War draw their own line with no Jobs | Build (menu.js:248, :251). The route map's finding 3, still open.
23. PROVEN. `SCREENS.Build` (menu.js:190 to 192) is the old Build page; Build is drawn by `MOLD.build` (:242). The old one can no longer be reached (`page()` only draws sheets, :199). Dead, about 600 bytes. The same for the local `line` in `render` (menu.js:279: defined, never called, and it hides the outer `line`).
24. PROVEN (probe: after two errors the tab is 'Pause', the panel is an empty 386 x 14 box, the bottom rows are gone, only the top bar answers). After a second error the game sets the page to 'Pause' (index.html:427), a page that no longer exists since N70 made pause a card. Read: an empty panel, the bottom rows hidden, the pause card held back. Your Nov 7 ruling: after the error screen the New game setup must come back. To run on the page (step 3).
25. PROVEN (probe: new game started from War keeps War on, the fold on and the squad). A new game does not reset War mode, the fold, the saved squad or the armed order (`start` resets other fields only, menu.js:434). To run on the page.
26. PROVEN. The match log records no ending and no wonder (menu.js:441; your Nov 13 ruling). No log of the seven says how the game ended. Every log says version "100 · 12": the preview number is not in it, so no log can be tied to a build.
27. PROVEN. `loses` (what a unit loses to) is defined and called nowhere (menu.js:204).

### D. Speed (read only; your `?fps` shot is still the proof)
28. NOT REPRODUCED (probe on a desktop: 0.32 ms a tap on the Town Center with 42 houses round it; a phone's chip may differ, your `?fps` shot decides). A tap on the map reads one pixel back from the graphics chip for every building under the finger's box (index.html:1797), though a kept copy of each sprite's pixels exists for another purpose (index.html:1488). This is the first place to look for "tapping the Town Center costs the most frames" (Nov 14).
29. MEASURED, and smaller than read (probe: one save takes 23.4 ms at 405 units, 358 KB, once every 60 s: one dropped frame a minute, not the crawl; "every beat" was wrong). The save writes the whole world as text on the game's own thread (index.html:430 to 438, :461). Its cost grows with units and buildings: a candidate for the n67 end-game crawl.
30. SUSPECTED. Costs that grow with the square of the unit count: `vacant` (index.html:1148, every unit for every spot tried), `popOf`, `jobs`, `armyOf`, `score` on each menu beat (menu.js:78), `units().some` inside loops (econ.js:161, :315, :401).

### E. The world
31. PROVEN. Numbers typed in the world's code, against "zero stray numbers": index.html:71 (10, 1.25), :75 (0.2, 0.3), :146 (1.06), :147 (200), :153 (900), :155 (1.5), :162, :168, :174 to 177, :215, :230, :251 (0.85, 0.3), :391 (24, 200), :482 to 496, :1123, :1201 to 1205, :1240 to 1271, :1500 to 1509, :1751, :1805. The gate does not count them.
32. PROVEN. A loaded carrier does not outrank an empty walker: rank reads only path and job (index.html:1188; D377). Your "yes" of Nov 13 22:21 was built in N42 and left behind on the old branch.

### What the logs say, in one place (seven games, 107 to 188 minutes)
- You never lose to hunger alone: food under 60 for 4 to 27 minutes a game, always with stores of wood and gold unspent.
- Villagers fell by 3 or more in a minute with food in store in every game (sickness: fixed in N73, not yet proven by play).
- Late game: stores pile up with nothing to buy (to 60,455 food, 101,000 wood, 244,829 gold).
- No game records its end.

---

## 3. Design (measured on the running screens: 44 screens, 390 x 844; `design.py`)
Counts: 909 boxes, 815 buttons, 1,403 runs of text.

1. PROVEN. People's tile: 1 px border #ece5d3 (white, as you ruled Nov 18 14:47), no ring. Other job tiles: the same cream at 42%.
2. PROVEN. Fonts: 12 different (family, size, weight, style). Sizes 11, 12, 13.3, 14, 17, 20, 22; weights 400 and 600. Barlow everywhere; IM Fell only on "Welcome"; Arial 13.3 on the "undefined" button.
3. PROVEN. 11 px is the commonest size: 815 of 1,403 runs (571 in the top bar). Your minimum is 12, with 11 for costs only. The Screen book's type has no 12 at all (20, 17, 14, 14, 11, 11).
4. PROVEN. A tile's name comes four ways: 14 regular (86), 14 bold (18), 11 regular (17), 17 bold gold (3). Your ruling: one font, only the cost changes.
5. PROVEN. Text colours: 9. Tile text is cream except the red ">" in six unit names, and costs.
6. PROVEN. Outlines: 50 boxes draw two or three at once. Every Build tile: border and ring (38). Pause speed cells: border and ring. A picked card tile and the placing tile: border, inset and ring. The Jobs rally tile: border and inset.
7. PROVEN. "Picked" is drawn six ways: underline or colour only (30), ring (10), border and fill (4), fill (3), border and inset (3), border, inset and ring (3).
8. PROVEN. Shells: 22 different boxes; heights 17, 22, 24, 32, 40, 44; corners 0, 6, 40; 9 border colours. The 44-high tile alone has 15 skins.
9. PROVEN. Under 44 px: 316 of 815 buttons, 65 kinds. The floating words are 40 high (Jobs 45 x 40, Build 46 x 40, Cancel 57 x 40); the fold "-" is 20 x 40; crumbs 40 x 17 and 52 x 24; War's - and + 33 x 44; Stores' head cells 39 x 44.
10. PROVEN (screenshot). Clipped tiles: 11 on 6 screens. Stable: all 5 unit tiles (names cut at the top, costs at the bottom). Barracks 2; House 1; Temple 1; the Town Center's queued Villager; Learn 1. Four Mail lines are cut sideways.
11. PROVEN. Static elements hold: Home at (2, 714) and War at (348, 714), 40 x 40, on all 39 screens that have them. Both are under 44. Not on: new game, Stores, Score, Mail, Welcome back.
12. PROVEN. The menu's top edge moves: 674 (Jobs, Build, cards), 714 (War), 612 (pause), 507 (new game) of 844.
13. PROVEN. The blue reader is still drawn on Welcome back (ring and outline).

Not measured: colours inside the map's art; the look on a real phone; anything in motion.

---

## 4. Route map on n73 (`routes.py`: 1,194 taps, 63 screens, 0 errors)
Fixed since Nov 18: findings 1 and 2 (every building card: Jobs goes to Jobs, Build to Build).

Still open. PROVEN by the crawl unless said.
1. No Jobs | Build on: bush, gold, iron, den, campfire and treasure cards; War; an army picked. Stores, Score and Mail have no line at all.
2. Dead taps: the crumb words (about 45); the alert dot on 11 find cards; about 25 Mail lines; Volume "Full"; Copy log (says nothing); the first Delete tap on a site.
3. Refused with no word: Gather on bush, gold, iron, campfire; Jobs "-" at zero; Idle 0; the built-once buildings (School, Temple, Hospital, Library, Hall, Court); 14 locked units; Demolish on the Town Center.
4. Not reached (the crawler's limit, not the game's): stone, cemetery, ruins, camp, drifters, stop, animals (the tap picked the villager); tree, fish, a foe's villager and Town Center opened no card. SUSPECTED only for these.

---

## 5. Books (script checks: `tools/audit-nov19/books.js`)
1. PROVEN. Sizes: 2,685 entries in 16 books. No code has two homes.
2. PROVEN. Comments: 1,081 in the book, every one cited in code, none missing. 39 codes are cited on more than one line (one why for two places). 109 whys run past 320 letters (longest 1,033): unchanged since N71.
3. PROVEN. Citations: 391 in the book; none missing; 59 are cited by no entry (dead citations, or cited only in words). 36 are not marked opened.
4. PROVEN. Every entry in every book carries a citation.
5. SUSPECTED dead keys (name never read in the five files): Measure `Z2`; Words `song`; Screen `waiting`, `Layers`, `Ice`. Suspected unused numbers: `shares.mounted`, `flock.milk`, `venture.sizes`, `regard.giftMax`, `flames.candle`, `forest.bends`. (Sprites, Sound and Mass names are read through a shell's look, so the script cannot judge them.)
6. PROVEN doubles. Words: 9 sentences stored twice or more ("Not enough: {cost}." three times; "Food stores empty: put villagers on food." twice; "That line is full" twice). Colours: 173 values, 120 distinct, 13 colours stored under two or three names (#ffffff three, #e6b947 three, #f2cf55 three).
7. PROVEN. Colours outside the Colours book: 437 typed in index.html's art (251 distinct), and the Sprites book holds 339 of its own (177 distinct). The Colours book holds 120. So the game has about 550 colours and one book governs about a fifth.
8. PROVEN. Numbers typed in code (rough count by script): menu.js 19, econ.js 8, combat.js 12, ai.js 3; index.html about 400 outside the art and about 4,150 inside it.
9. PROVEN. Things still asked by name: job names 88 places (econ.js 38, combat.js 34, index.html 9, ai.js 6, menu.js 1), kind names 124. The gate's count is 250; Design 09's step 3 had it at 149 on the parked branch.

---

## 6. The List 1 to 31: ruled, and not in n73
Read in full. Left out: what you parked, held or killed yourself.
1. A loaded carrier outranks an empty walker (Nov 13 22:21 "yes"). Built N42, not in N46 on. index.html:1188.
2. A resource turns red in the top bar while its Out beats its In (H9, Nov 12 "Sure"). Built N44 on the old branch. menu.js:267 has no such colour.
3. The match log records wonders and the end (Nov 13 22:21). menu.js:441.
4. Fires three times the size, torches doubled, v80's army torch (Nov 13 play list 9). Built N42 to N43 on the old branch; you kept other items on Nov 14 and said "the rest I don't want yet". Not checked in n73.
5. The shell pass, slice one (N45): "it goes back last, after the bug work". Not back: 250 asks by name against 149.
6. The top strip in one row (Nov 18 08:12, note 1: "never supposed to be two rows"). Every cell is still two lines (menu.js:266 to 267).
7. The Mail button "isn't practical as is" (Nov 18 08:12, note 2). Unchanged (menu.js:121, :196).
8. The blue help reader cut everywhere (Nov 18 08:12 note 7; Nov 18 13:36). Still on Welcome back (menu.js:276).
9. Jobs | Build on every screen (Design 16: "the line stays"). Missing on a find's card, in War, on Stores, Score, Mail (menu.js:248, :251, :183).
10. Quit on the pause card (your sketch, Nov 18 13:05). Not built; what it does is not ruled.
11. One font, only the cost changes (Nov 17 17:50, problem 11). Open; measured in step 3.
12. The dock: the pier turns toward the water and shortens on narrow water (Nov 14 10:10 "Sure"). Not built (N48).
13. The mine shaft: iron, and the going-underground animation (Nov 14 09:57). Not built (N49).
14. The Pioneer: villagers that follow it, its felling speed, its own picture, trees drawn lying (Nov 14 10:57). Not built (N50).
15. Mints run themselves (Nov 4). Call owed since Nov 14.
16. Zero typed numbers, and the gate refusing one (G4, Nov 10). Not done: see 2.E.31 and 5.8.
17. The Nov 8 triage's 55 "do" items (G9): never checked one by one.
18. Farm research re-sourced from history (G11, Nov 11): never started.
19. The late game has something to spend on (H11, Nov 13; your Oct 28 rule). Open; the logs agree.
20. Your slow ages against the computers (H12, Nov 13). Open; the logs agree.
21. The computers' economy (H10): held by your word of Nov 13 08:26. Named here because it has been held six days and the logs still show it.
22. Gifts to a side "doesn't work right now. There's a bug" (Nov 13 22:49). Gift still answers "later" (menu.js:96).
23. Gather and All hands have no button (G13; Nov 13 "Not sure"). Still none.
24. The auto-upgrade of units on a tech (audit answer 7, Nov 17): only the age rise upgrades a line (econ.js:107); whether any research does is unverified.
25. The fresh-eyes product review (D9, Nov 12) and battle visual noise (D7): never done. This audit is not that review.
26. "Something is in the way" beside farms; how you went over the cap; control lost after: not reproduced, your screenshot or steps owed since Nov 13 to 14.
27. The age glo-up (The List 20): ruled, on hold by your word of Nov 16. Named so it is not lost.

---

## 7. Market and the top ten
Sources: gaming.net "10 Best RTS Games on iOS & Android" (2026); toucharcade (Northgard's launch price); App Store and Google Play listings through apppricinglab (ROME: Total War, Rusted Warfare); appgoblin (Age of Empires Mobile); Sensor Tower's 2025 figures as reported by Outlook Respawn; Apple's Small Business Program.

### The field
| # | Game | What it is | How it is sold |
|---|---|---|---|
| 1 | Company of Heroes | squad tactics, a PC port | paid ($13.99 to $19.99), campaigns as add-ons |
| 2 | Northgard | Viking clan and land, a PC port | paid ($7.99 to $8.99 at launch), clans $2.99 each |
| 3 | Rusted Warfare | 90s-style RTS, one maker, huge armies | paid ($1.99 Android, $2.99 iPhone), nothing else to buy |
| 4 | Bad North | small island defence, roguelite | paid |
| 5 | Art of War 3 | base building, direct control, online | free with purchases |
| 6 | DomiNations | a city through the ages, raids | free with purchases |
| 7 | Mushroom Wars 2 | fast node capture | free with purchases |
| 8 | C&C: Rivals | 1 v 1 in minutes | free with purchases |
| 9 | Bunker Wars | WW1 trench lines | free with purchases |
| 10 | Iron Marines Invasion | RTS and tower defence, heroes | free with purchases |
Beside them: Age of Empires Mobile (Level Infinite; about 10.2 million Android installs). It carries the name but is an alliance-and-timers game, not Age of Empires II. ROME: Total War ($9.99) is the paid game that sits highest for longest.

### Where First Keep stands
1. The gap is real: no game above is Age of Empires II on a phone (gather, build, age up, a long match against computers, offline). The paid ports are PC games squeezed down; the free ones are timers. Your Nov 17 read (people who loved AoE II and left at III and IV) fits the gap.
2. The closest rival in kind is Rusted Warfare: one maker, paid, no purchases, offline, about a million Android downloads over 14 years at $1.99. It proves the audience and sets the ceiling a solo game should expect.
3. Price: $5 sits between Rusted Warfare ($2 to $3) and the ports ($8 to $20). It is defensible only at the ports' finish. Under Apple's and Google's small-business terms you keep 85%: about $4.25 a copy.
4. The market is against paid games in volume (96% of installs are free), and for them in trust: every paid game above sells "no purchases" as a feature.

### First Keep against the ten, element by element
| Element | Best in the field | First Keep today |
|---|---|---|
| Depth of economy and ages | Northgard, DomiNations | ahead: 28 buildings, 260 research steps, seasons, weather, trade, sickness |
| A world that feels real | none tries | ahead, and alone: real light, ice, soil, sight |
| Army control on a phone | Company of Heroes, Rusted Warfare (group, hold, stance, formation) | behind: Hold does not hold; a winning army runs; the formations exist with no button |
| First ten minutes | Bad North, Iron Marines (taught by doing) | behind: no tutorial; Help is a card of text |
| Computer rivals | Northgard, Company of Heroes | uneven: they age 3 times faster, hoard, and one grows without end |
| A match that ends well | all ten | behind: a kill pays the whole store; stores pile up; the log has no ending |
| Finish (one font, one ring, one outline) | Northgard, Bad North | behind: step 3 |
| Speed on a hot phone | all ten ship native | unknown: heat and the late crawl are unproven either way; it is a web page |
| Multiplayer | Rusted Warfare, Art of War 3 | none (your word: not until it has teeth) |

### Getting it to market
1. It is a web page. The stores need an app: a wrapper (Capacitor or the like) round the same files is the short road; Apple also needs a developer account ($99 a year) and a Mac, or a cloud build, to submit. You have never opened this on a computer: this is the one step you cannot do from the phone alone. Unverified in detail; a spike of a day would settle it.
2. Before any store: the game must not heat the phone, must save and resume without fail, and must teach the first ten minutes.
3. The cheapest first test is not a store: the page as it is, in front of 20 Age of Empires II players (r/aoe2, r/iosgaming), with the match log switched on and an ending recorded. That needs finding 2.C.26 fixed first.
4. The pitch in one line: "Age of Empires II for your phone. One price. No timers. Works offline."

---

## 8. Summary

### In short
1. The machinery is sound: the gate passes, the books hold 2,685 entries with a citation each, same seed gives the same game.
2. The play is hurt by a short list, most of it already in your notes: Hold does not hold and a winning group runs (2.A.1, 2.A.3); half the town stands waiting near minute 20 (2.B.7); one kill pays the whole store, the late game has nothing to buy, the computers age 2 to 4 times faster (2.B.10 to 13).
3. The menu is three builders, not one mold (2.C.22): 12 fonts, 6 ways to show "picked", 50 double outlines, 316 buttons under 44 px, 11 clipped tiles.
4. The suite cannot guard you: 27 red at rest; 8 judge nothing, 8 argue with your rulings, 10 are untraced.
5. Rulings leak at branch changes: 27 not in n73 (step 6); at least 4 were built once and left on the parked branch; one (the 1,000 lot) was cut after you kept it.
6. Against the field: ahead on depth and the world, behind on army control, the first ten minutes and finish; speed on a phone unknown.

### Next steps (proposed; nothing built; each waits for your word)
1. Small and already ruled, each with a failing test first: the "undefined" button; the error screen back to New game (Nov 7); a new game clears War; the log records the end and the build number; the blue reader off Welcome back; the carrier's rank; the red resource.
2. The suite: mend the 8 rigs, move the 8 stale checks to their rulings, trace the 10. Until then no build is proven safe in those areas.
3. The army: Hold as a temper on the soldier, not only in a squad; buttons on the form-up code that exists (2.A.2). The rout rule needs your ruling: today nerve counts only your own dead.
4. Reproduce the minute-20 wait on the page before changing it.
5. The menu: one builder, one outline rule, one type scale. Needs your ruling on 11 against 12.
6. Your `?fps` shots at minutes 10, 60 and 90: the only proof of speed.

### What you should have asked
1. "What did we lose going back to n41?" Step 6, items 1, 2, 4, 5.
2. "What can the tests not see?" Step 1a.
3. "How does a match end?" No log of seven says; the game does not record it.
4. "What is in the engine with no button?" 15 army functions, the whole vassal set and more (2.A.2, 2.B.17): weight carried for nothing, or features one button away.
5. "Who has played it besides me?" No one. Every proof of play is one player who knows the game.
6. "Is it fast at minute 90 on a phone?" Unmeasured.

### The road to studio quality (each stage ends on a number or your play)
1. Instruments: 0 untraced red tests; a log with an ending and a build number.
2. Play: Hold holds; a winning group stands; no villager waits unseen; a match ends and says who won. Proof: your play and the logs.
3. One mold: fonts 12 to the scale you rule; double outlines 50 to 0; under 44 px 316 to 0; clipped 11 to 0; Jobs | Build on every screen. Proof: `design.py` rerun.
4. The first ten minutes, taught by doing. Needs your spec.
5. Speed and heat on the phone. Proof: `?fps`.
6. Twenty Age of Empires II players with the log on.
7. The wrapper and the stores.
The weak point of this plan: stages 4 and 6 are where the ten rivals spent their money, and neither can be proven by a script or by you. How long any stage takes: don't know.
