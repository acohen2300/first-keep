# QC 3 of 13: player-facing text (src/07-text.js, src/31-guide.js), HEAD c3b4964 against v70 88b2cb2

Since v70, these two files have changed in one line only: 07:605, the House fix, now `menu:land`. So every v70 text finding still stands at the same line number. The tables in 01 to 06 were loaded in node, and each number below was checked against them.

Tags: C = traced, sure; K = fairly sure; S = suspect. Matters: H = a player is misled or the game breaks; M = wrong, but a small thing; L = tidiness.

## 1. Prior findings (text.md, decision record F1 to F10)

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| P0 | FIXED. The House milestone fix crashed the game (S1). It is now `menu:land` | 07-text.js:605 | C | - | none |
| P1 | STILL. F1: the Open scenario says "five villagers"; the code spawns 3 | 07-text.js:42 (10-world.js:617) | C | H | Read the count, or say three |
| P2 | STILL. F1: "soft snow costs a walker more than mud". The table says mud 0.8 > snow 0.6; "1 °C" is also typed by hand | 07-text.js:645 (06:69) | C | H | Cut the clause; read CLIMATE.snowAt |
| P3 | STILL. F1: room opens when an "Aqueduct" finishes, but BLD.aqueduct has no room | 07-text.js:761 | C | M | Drop Aqueduct (Albert call per N14) |
| P4 | STILL. F1/D: "Clean water, sewers and quarantine halve the spread"; only quarantine is spread x0.5 | 07-text.js:1056 | C | M | Say what each does (Albert call per N14) |
| P5 | STILL. F1: ground marks "for looks only and not saved"; ruts are simulated and saved | 07-text.js:951 (34-save.js:240) | C | M | Fix the claim |
| P6 | STILL. F1: "Opening any card pauses the game"; only READ_CARDS do | 07-text.js:1021 (27-cards-core.js:35) | C | M | "Reading cards pause..." |
| P7 | STILL. F2: "The screen" is the old screen: age, clock and speed in the top bar, "Build bottom right", "− cancels", "Build swaps the jobs" | 07-text.js:766 | C | H | Rewrite to the v70 screen: the cycled row, the hammer under People, Emergency bottom right |
| P8 | STILL. F3: the tier list is typed by hand and misses Halberdier, Rider scout and six elites (the table has 15 tiers; the text lists 7) | 07-text.js:896 | C | M | Generate from TECH.filter(t=>t.tier) |
| P9 | STILL. F4: one WHY.legion key serves the Legion research and the Roman Legionary | 07-text.js:195-196 | C | M | Split the key |
| P10 | STILL. F5: toasts over 10 words: NEWS 564 (13), 565, 573, 581, 583 (11); MS drop 614, squad 626 (11); so 771 "every message is 10 words or fewer" is false | 07-text.js:564-626, 771 | C | M | Trim; let words.py read NEWS and MS_TEXT[0] |
| P11 | STILL. F6: provable history errors (sawmill 82, torsion 266, pikesquare 197, castiron 375, cleanwater 378, hanxbow 491, royalroad 182, legion 196, hearth 172, tercio 200, iron 240, New Orleans 1062) | 07-text.js as listed | C | M | Correct, sources first (Batch 7) |
| P12 | STILL. F7: the suspected history list is unchanged | 07-text.js (text.md list) | S | L | Look each one up |
| P13 | STILL. F8: "become Elite crossbowmans / horsemans"; six elites dated `when:'Medieval'` | 04-rules-tech.js:3119-3121 | C | M | Plural from the table; real dates |
| P14 | STILL. F9: the comment says "Numbers come from the tables", but hand copies remain: 602 five, 656 75%, 669 30%, 681 twelve minutes, 645 1 °C, 718 three join, 719 three minutes, 811 vassal numbers, 816, 966 50%, 1001 .5/.65/.85, 1036 Four, 1041 one in six/twenty, 1116 twice a second; 31-guide:218 "cannot disagree". All match the tables today | 07-text.js:742 and lines listed | C | M | Template them; remove the false comment |
| P15 | STILL. F10: shrine "inside the Throne" (851) against "at the foot" (861, FINDS desc) | 07-text.js:851 | C | M | "at the foot" |
| P16 | STILL. F10: the troll "goes home at dusk"; it is a timed 90 s | 07-text.js:721 | C | L | "goes home soon" |
| P17 | STILL. F10: the "Hold ground" entry describes a control that does not exist | 07-text.js:954-958 | C | M | Cut the entry |
| P18 | STILL. F10: Net is "laid by the Natives, or a Walls trap"; Walls has only pit and stakes | 31-guide.js:24 | C | L | Check MENUS first |
| P19 | STILL. F10: Heavy blows lists elephants, cataphracts, trebuchets; knock also has bombard, mauryael, malihorse | 07-text.js:931 | C | L | Generate from UNIT.knock |
| P20 | STILL. F10: "(Coinage 90%)" is a hand +0.1; with Weights (+0.05) and Milled (+0.05) the price reaches 100% | 07-text.js:886 | C | L | Read the sell fx |
| P21 | STILL. F10: vassal "business center" is not a building; "others 3" is false (house 1, pasture 2, tavern 4, baths 5, theatre/council/mint 6) | 07-text.js:811 | C | M | Generate from BLD.invest |
| P22 | STILL. unitsAt ignores UNIT.also, so the second Town Center shows no Trains | 31-guide.js:5 | C | L | Use trainsAt |
| P23 | STILL. Dead WHY.venture; EV_TEXT.mirage[1] is never said | 07-text.js:385, 716 | C | L | Cut, log in CUTS.md |
| P24 | STILL. guideMd's Research table has no When column | 31-guide.js:257 | C | L | Add t.when |

## 2. Text that v80 made wrong (or right)

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| V1 | Villager search is the old rule: "looks only for the same kind of find within its own sight; when none is in sight it waits at the drop-off". v80: the radius grows 90 to 180 over 10 s (villager sight is 90), and the villager keeps its job 35 s before it waits | 07-text.js:791 (06-rules-tuning.js:158; 12-sim-core.js:683; 13-sim-civil.js:231) | C | H | Template from SEARCH: "within ${SEARCH.x} widening to ${SEARCH.x+SEARCH.y}; after ${SEARCH.tau+SEARCH.give} s it waits" |
| V2 | "Guards stay near what they guard and attack whoever comes close." v80: boar and bear defend only within STARTLE 45 and fight with probability V/C, so a strong party may be left alone | 07-text.js:851 (05-rules-wild.js:66; 14-sim-troops.js:487) | K | M | "A bear or boar fights what comes within ${STARTLE}, likelier the weaker you are" |
| V3 | Hunting: "An animal that attacks a villager is fought by that villager and the two nearest". The code does this only for animals with meat, so never a wolf. v80 added that soldiers step in on any animal they can see on a civilian; the text says neither | 07-text.js:796 (16-sim-fight.js:46; 15-sim-spatial.js:29) | C | M | Name the meat rule; add one line on soldiers stepping in |
| V4 | "Town square stops everyone" / "gathers everyone". v80 C10: students at a School are left alone by Home, Town square and All hands | 07-text.js:791, 1031 (40-emergency.js:22; 28-army-quick.js:62) | K | L | "everyone but students" |
| V5 | Difficulty: "turns the minds of the computers, never their stores ... only how they think". Easy also turns every hazard off (hz() is false on Easy), and since v80 B8 it gets no level bonus | 07-text.js:1116-1117 (37-events.js:13-15) | C | M | Add "Easy: no hazards, no level bonus"; drop "only how they think" |
| V6 | v80 B8: a difficulty change applies from the next game. The Guide does not say so (check the Help card's own wording too, outside my files) | 07-text.js:1116; 33-verbs.js:181-185 | S | L | Add "from the next game" |
| V7 | Made true by v80, no edit needed: "two villagers run with buckets" (B9, 07:1051), and the forage formula now also holds for fish (C13, 07:791) | 07-text.js:1051, 791 | C | - | none |
| V8 | No text is affected by saves, shadows, group sight, the arrival radius, Throne handback or wonder clocks; the 1111 save line still holds | 07-text.js:1111 | K | - | none |

## 3. New problems

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | The Emergency explanation exists twice, almost word for word: TRIGGERS and the card's "How it works" fold, which lives outside 07 (one-home breach) | 07-text.js:1031; 40-emergency.js:182 | C | M | One string in 07; both read it |
| N2 | Wolf desc says "guards nothing but its den", but FINDS.chest is guarded by 2 wolves, the Guide says "a treasure chest under wolves", and the den holds a bear | 02-rules-units.js:497; 05-rules-wild.js:7, 32; 07-text.js:851 | C | M | "Hunts in packs; guards hidden chests" |
| N3 | Spy sight is given as a flat 140; three research steps add +60/+40/+40 (spysight) | 07-text.js:876 (08-core.js:572; 04-rules-tech.js:2535, 2574, 2589) | C | L | "...140, farther with research" |
| N4 | Hand copies also live in FINDS descs the Guide shows: shrine "10 s / 15 gold", mercs "six swords for 240 gold, three minutes", vagabonds "three ... 90 gold" | 05-rules-wild.js:46, 51, 57 | K | L | Template the descs |
| N5 | "Escort +4" is typed into the Guide; the button label is a separate literal | 07-text.js:1081; 28-army-quick.js:104 | K | L | One constant |
| N6 | Circus says "viewers work lighter" for a 10% work boost (mul 1.1) | 07-text.js:717 | K | L | "viewers work faster" |
| N7 | The Guide's Peoples card repeats the same fact: Mongol 547/495, Maurya 549/497/509 | 07-text.js:495-549 | C | L | Cut one of each |
| N8 | Player-facing toasts outside 07 (for example "Not enough to pay for repairs.", "New land. Your age and research stay.") break the "every line of wording" home in 07:1 and escape words.py | 13-sim-civil.js:461; 33-verbs.js:33 | C | L | Move to 07 or extend words.py |

Checked and correct: quick action text (936) against QA; War missions (1026); Emergency's four orders against EMERGENCY; the row cycle text (621, 1021: Jobs, War, Train); the demolish refund 50% and 15% (11-orders.js:232); Roads halve the season slowing (12-sim-core.js:20); plague R0 x1.5 (36-economy.js:494); sick at 60% (08-core.js:558); Muster x2 cost, x1.25 time (11-orders.js:68-71); YEAR = 12 min; house room 5. No apostrophes in any table in 07.
