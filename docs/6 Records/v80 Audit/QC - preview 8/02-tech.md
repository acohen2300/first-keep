# QC 02: research table (src/04-rules-tech.js) and its readers (src/08-core.js)

HEAD c3b4964 against v70 88b2cb2. `git diff 88b2cb2..HEAD -- src/04-rules-tech.js` is empty: the table is unchanged since v70, so every line number in the v70 audit for file 04 still holds. 08-core.js gained 17 lines (keepHealth, groupSees, hawkP). Batch 7 (D11, D12, D14, D15, D16, F3, F8) has not been built; CUTS.md does not claim it was.

Checked by script (230 steps, tables 01 to 07 loaded in node): ids unique; every `need` exists; no cycles; no step needs a later-age step (directly or through the chain); every `at` building exists by the step's age; every tier/btier names a real unit or building; every "N%" in a desc matches its fx number; every fx stat has a reader with the matching operator.

## A. Prior findings

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| P1 | D11 still there: `gather` is read by node type and kind, so harvest steps keyed `food` also speed fish, hunting and bushes; mining steps (and Mali's bonus and the Mint's own +15%) multiply the Mint's coin, the Foundry's iron and the Quarry | 08-core.js:603; 04:200, 213, 226, 252; 04:428-429, 444-445, 460-461, 476-478, 506-507, 551; 04:3165 | C | wrong | Per N9: key the harvest steps to farm/bush and the mining steps to node kinds, and skip `gather` on workshop nodes (n.farm with BLD.makes) |
| P2 | D12 still there: cold, wet, ice and wear add up to 1, and readers do 1 − min(1, a). Wool cloaks + Weather glass means winter slows nothing; Oiled cloaks + Weather glass means rain slows nothing; Horseshoes + Crampons means riders never lose stride on ice; one `wear` covers both frost and rain | 04:1183, 1197, 2317-2318, 1414, 2302, 1528, 1621; readers 12-sim-core.js:20-21, 09-nav.js:613, 37-events.js:668, 686 | C | wrong | Per N10: reader 1/(1+Σa); give Weather glass a new effect |
| P3 | D13 still there: stats() also applies common tiers to unique units. Final elites: Roman hp ×1.625 +6; Persian ×1.625 +5; Mali ×1.44 +4, speed ×1.19; Maurya ×1.25 +3; Mongol ×1.2 +2; Han ×1.0 +2, +15 range | 08-core.js:524; 04:3101-3106 | C | wrong | Skip common tiers when U.civ, or set one budget for every elite |
| P4 | D14 still there: the card tells players "Cost and time ×(0.5+0.1w) for its age"; the header comment says w "sets its cost and time" | 27-cards-core.js:128; 04:4 | C | wrong | Per N11: delete the sentence and fix the comment |
| P5 | D15a still there: armed caravans hit for 4 in code, but the desc only says "twice as tough" | 13-sim-civil.js:547-550; 04:2767-2768 | C | wrong | Per N12a: put it in the text (or in fx) |
| P6 | D15b still there: Charcoal burning is Bronze age (1), but the Foundry it boosts comes in the Medieval age (3) | 04:157, 161 | C | minor | Per N12b: move it to age 3 |
| P7 | D15c still there: Printing (keep) and Printing press (library) are the same invention | 04:811-822, 2129-2139 | C | minor | Per N12c: merge into press at ×0.68 |
| P8 | D16 still there: teach entries harcher→cata and ram→catapult are the same age, so teachTo filters them out (dead data) | 06-rules-tuning.js:111-112; 11-orders.js:656 | C | minor | Delete or retarget |
| P9 | F3 still there: the upgrade help list leaves out Halberdier, Rider scout and the six elites | 07-text.js:896 | C | minor | Generate it from TECH tiers |
| P10 | F8 still there: the elite template gives "Elite crossbowmans" and "Elite horsemans", says "tougher" for Han (no hp), and the name "Elite: Elite crossbowman" is patched in TITLE_SHORT; when:'Medieval' lets history.py skip them | 04:3111, 3120-3121; 07-text.js:15; tests/history.py:24 | C | minor | Build the desc from the tier numbers with plural(); real dates; history.py fails on no-date |
| P11 | G1 table bloat (3,234 lines, hand-typed cost/t, 67 descs a template would give): parked by decision | 04:5-3097 | C | minor | Stays parked (decision record, batch 10) |
| P12 | 23 `need` entries repeat the line predecessor; needsOf patches it with a Set | 04 (e.g. 1063, 1400, 1608...); 08-core.js:208 | C | minor | Cut the 23, drop the Set, add a build refusal |
| P13 | Behaviour keyed by step id, outside fx: engage, command, formations, muster, armedcart, chimney, roads, snowclear; plus the hard-coded kit list | 08-core.js:330, 331, 334, 346, 538; 11-orders.js:76; 13-sim-civil.js:547; 14-sim-troops.js:233; 17-ai.js:242; 24-view-overlays.js:582; 28-army-quick.js:229; 29-card-pages.js:69-70; 32-frame.js:371-372; 39-huddle.js:476, 521 | C | minor | Flags in fx read through fxv |
| P14 | F4 / audit #13 still there: `legion` is both a research id and a unit id, so one WHY.legion (Roman text) shows on every people's Legion card | 04:1050, 3173; 07-text.js:195 | C | wrong | Rename the research id |
| P15 | Date inversions still there, plus one the v70 audit missed: Tercio (1534) needs Volley fire (1590s); Burning shot (600s) needs Fire arrows (900s); Academy (387 BC) needs Veterans (100 BC) | 04:1113/1117 vs 1342; 1792/1796; 2050/2054 | C | minor | Re-point the needs, or fix the dates after checking sources (F6) |
| P16 | Legionary desc says it "breaks buildings faster", but bld is the same as the swordsman's | 04:3181 | C | minor | Cut the clause |
| P17 | Iron working (age 1) costs 160 iron, against the rule that iron starts in the Classical age | 04:1510 | C | minor | Gold-only cost, or change the rule text |
| P18 | Mongol "everything on horseback" leaves out the rider scout (#mounted has no scout) | 04:3151-3152 | K | minor | Narrow the text, or tag the scout once ridden |

## B. v80 changes in these files

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| V1 | B7 keepHealth works (it rescales each finished building's hp when its maximum moves, capped at the maximum). But rehealth() calls fxDirty() first, so keepHealth has already set b.mx = M, and rehealth's own building loop never fires: two homes for one rescale, one of them dead (a patch on a patch) | 08-core.js:475-487 vs 633-638 | C | minor | Delete the building loop in rehealth; keep only units there |
| V2 | groupSees scans every unit and building, each with a full sightOf; N16b said "use the spatial grid for the check". It is called only after the short-circuit in ignorable (an animal on a civilian), so the cost is bounded | 08-core.js:597-599; 15-sim-spatial.js:29 | K | minor | Query the spatial grid, or log that this departs from the decision |
| V3 | hawkP (V/C, 1 when C ≤ V) is correct and its one caller passes V=1 with C = the power ratio | 08-core.js:641; 14-sim-troops.js:489 | C | none | (no fix needed) |

## C. New findings

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | Petards are keyed `#gun`, and arquebus has the gun tag and the A.gun flag. So once Petards is researched, arquebusiers and musketeers also set wooden buildings alight at the bombard's blast chance and splash the buildings next to them. The desc says "Bombards" | 04:1849, 1851; 16-sim-fight.js:36-41 | C | breaks play | k:'bombard' |
| N2 | Gun founding (Smith, Walls line, cannon casting) gives +10 damage to every `#gun`, so arquebusiers get +10 on a base of 16 (+62%), on top of Musket +4, Volley +4 and Bayonet +3. Volley fire's +4 also reaches bombards | 04:1679, 1345 | K | wrong | Key Gun founding to bombard, or say "guns and muskets" and rebalance |
| N3 | Muster's desc reads "Set formations for whole battalions", but the code trains a whole battalion in one order at the War Council (cost ×2, time ×1.25). Formations is the step that sets shape | 04:2672; 11-orders.js:60-80; 39-huddle.js:476-480 | C | wrong | Desc: "Train a whole battalion in one order, at twice the cost." |
| N4 | Stone granary says "Plague spreads half as fast", but its stat `plague` scales how many fall sick when a plague strikes. Quarantine's `spread` is the real spread rate, and it carries the same words | 04:400-402 vs 2386-2387; 36-economy.js:454, 494 | C | wrong | Granary desc: "A plague strikes half as many." |
| N5 | Armour keeps the lowest (min), so Shields (infantry 0.92) and Helmets (0.90) do nothing once Leather (all soldiers 0.85, same age, 60 gold) is known. Scale (mounted 0.80) does nothing once Chain (0.70) is known. Shields is a whole Barracks step that goes inert in the age it opens | 04:1007, 1554, 1567, 1580, 1593; 08-core.js:545 | C | minor | Give Shields a different stat (e.g. ranged-only armour), or cut it and log it in CUTS.md |
| N6 | A developer note shows to players in Drill yard's desc: "Game: it gave room before Build 63; one population now." | 04:1212 | C | minor | Move it to a comment |
| N7 | musterCost prices with raw UNIT cost ×2, not unitCost, so Feudal levy (infantry 10% cheaper) does not apply to a muster | 11-orders.js:66 | K | minor | Use unitCost(o, k) |
| N8 | Crampons has no k, so it also cuts horses' and engines' slip and stride loss; the desc says "Men slip half as often" | 04:2302, 2304; 09-nav.js:613; 37-events.js:668 | C | minor | k:'#infantry' and #civ, or fix the text (with P2) |
| N9 | Burning shot says "Engines set buildings alight", but only wooden buildings can catch (Fire arrows says "wooden") | 04:1797; 16-sim-fight.js:35 | C | minor | Add "wooden" |
| N10 | Descs narrower than their keys: Arrow slits and Geometry say "Towers", but #guard also covers Town Centers, castles and trade posts; Public schooling's key-less gather also speeds the Mint, Foundry and Quarry | 04:1635-1636, 2000-2001, 2207 | K | minor | Fix the words, or key them |

## Counts
C 25 · K 5 · S 0 (V3 is a clean check, not counted as a defect).
