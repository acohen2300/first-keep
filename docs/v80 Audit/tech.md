# Audit: src/04-rules-tech.js (v70 Restoration)

Reviewer: fresh-eyes, read-only. Method: the whole file was read as structure (the 224 hand-written TECH records were dumped one line each and read, plus the elite loop, CIVS and the unique units), then checked with node scripts against the real tables (01 to 07 loaded into node from a copy at scratchpad/ag-tech). Every fx stat was traced to its consumer by grep and by reading the consumer code (08-core fxList/fxv/stats/gatherMul, 11-orders, 12, 13, 14, 16, 36, 37).

## Clean (checked, nothing found)
- 230 research ids (224 hand + 6 elite), all unique. VERIFIED.
- Every `need` id exists; no cycles in need + line-predecessor graph (needsOf as the game computes it); no step needs a step of a later age; no common step waits on a civ-only step; every `at` building exists and is available by the step's age. VERIFIED.
- Every fx stat set by TECH/BLD/CIVS (57 stats) is read somewhere with the matching operator (m/a/min), and no stat is read that nothing sets. Every `k` resolves to a resource, unit kind, building kind, or a real tag (#infantry, #guard, #wallish, #bld, #research...). VERIFIED.
- Every tier/btier names a real unit/building; every CIVS.uu exists, has the right civ, and replaces a real unit; one elite per civ. VERIFIED.
- Every "N%" in a desc matches its fx number (script check of all 230). VERIFIED.
- No Math.random, clock or order-dependent code in the file. VERIFIED.

## S1
None found.

## S2: wrong behaviour

1. **Food gather research leaks to fish and hunting** (VERIFIED). `gatherMul` (08-core:588) asks `fxv(o,'gather',[n.type,n.kind])`, so a step keyed `k:'food'` hits every food node: fields, bushes, fish, meat. Sickles 04:191, Threshing 04:204, Plough 04:217, Horse collar 04:243 say "Fields yield" (Sickles: "Fields and bushes"), but they also boost fish and hunting. Script result for the whole tree (ages 0 to 4): fish ×6.80 (4 mill steps + 8 dock/house steps), hunt ×1.92, bush ×1.67, while a field gets ×4.44 only after 8 more crop steps. Fix: key those four `k:'farm'` (the field node's kind), or say in the desc that they apply to all food.

2. **Mining and gold research boosts the Mint, Foundry and Quarry output** (VERIFIED mechanically, intent SUSPECTED). Workshop nodes are `kind:'farm', type:<product>` (10-world:730), and gatherMul applies `gather` by type to them as well as `crop`/`make`. So Antler picks, Fire-setting, Deep shafts and Mine pumps (gather gold) multiply the Mint's coin (mint ×3.77 total); Pumps, Blasting and Ventilation (gather iron) multiply the Foundry (×4.72); the Mali gold bonus and the Mint's own "gold gathered pays 15% more" apply to struck coin too. Descs say "Stone and gold come in" (miners). Fix: same as 1. Key the gather steps by node kind (stone/gold/iron), not by type.

3. **Additive 'a' climate steps reach full immunity, and the descs say otherwise** (VERIFIED). `a` adds, readers do `1 - min(1, a)`:
   - cold: Wool cloaks 0.5 (04:1174) + Weather glass 0.5 (04:2307) = 1.0, so winter slows nothing. wet: Oiled cloaks 0.5 (04:1188) + Weather glass 0.5 = 1.0, so rain slows nothing. Weather glass's desc says "half as much more", which reads as ×0.25 left, not 0.
   - ice for riders: Horseshoes 0.5 (04:1404, #mounted) + Crampons 0.5 (04:2293, no k) = 1.0, so riders never slip or lose stride on ice.
   - wear: `wearMul` (37-events:686) has one `wear` value for both frost and rain. Tempering (04:1519) says "Blades do not go brittle in frost", but it halves both frost and rain wear. Oiled steel (04:1612) says "do not rust in rain", but it halves both. Only together do they remove wear.
   Fix: make the descs say what the numbers do, or use `m` (halve, halve again). Split wear into frost and rain if the two texts are meant.

4. **Hidden effect: Armed caravans** (VERIFIED). The desc (04:2758) is "Caravans are twice as tough." 13-sim-civil:537 also makes caravans strike nearby foes for 4 damage every 30 ticks, keyed on `techs.has('armedcart')`. That is outside the table and not in the text. Fix: put it in fx (a `dmg` k caravan, with the unit given a base attack) or cut it.

5. **Elite ranks are unequal between peoples** (VERIFIED). `stats()` (08-core:513) applies every tier whose `unit` is the base kind. Legion and Immortal (base sword) also take Men-at-arms (hp ×1.3, +3); Mali horseman (base cata) takes Knighthood (×1.2, +2). Han, Mongol and Maurya have no common tier for their base kind. Final elite: Roman hp ×1.625 +6 dmg; Persian ×1.625 +5; Mali ×1.44 +4 +spd; Han +2 dmg +15 rng, no hp at all. RULES §1: "if it is unfair, it is out." Fix: give each elite the same budget in one formula, or stop common tiers stacking on unique units.

6. **Charcoal burning is inert for two ages** (VERIFIED). Charcoal burning (04:152) is age 1 at the Lumber camp and sets `make iron`, but the Foundry is age 3. The player pays for nothing until then. Fired brick (04:513, age 1) gives +4 apartment room, and apartments come at age 2 (smaller issue).

## S3: rule violations and bloat

7. **"w sets cost and time" is false** (VERIFIED). Line 4 says the weight "sets its cost and time", and the research card (27-cards-core:128) tells the player "Cost and time ×(0.5+0.1w) for its age". Cost and t are hand-typed. The implied base per age (most rows fit it: cost 90/170/280/440/650/1000, seconds 18/28/38/52/66/100, split 60/40) matches only 109 of 224 common steps. 34 are more than 15% off in cost: Bronze (w9) costs 58% less than its formula, Town watch 62% less, Plough 90% more, Nets 89% more, Windmill 49% more, Iron 68% more, Helmets/Leather/Socketed heads about 60% less. In age 5, Scientific method has w1 but is the strongest research step (×0.75) and costs 900. A comment that contradicts the code, shown to players as fact. Fix: generate `cost` and `t` from (age, w, two resources) in one helper. That makes the card true and removes 450 lines (every cost: and t: line).

8. **23 redundant `need` entries** (VERIFIED). These name the step's own line predecessor, which needsOf already adds: legion→phalanx, stirrups→saddles, plate→chain, machic→fortify, starfort→guncast, greattower→beacons, guntower→greattower, limbers→corned, ballistics→algebra, military_academy→academy, optics→press, inoculation→quarantine, command→engage, formations→command, staff→muster, credit→coinage, banking→credit, exchange→banking, milled→assay, finery→blast, waterproof→warmclothes, firearrows→composite, volley→musket. 08-core:208 de-duplicates them with a Set, with a comment naming the Build 52 symptom: a patch over duplicated data. Fix: cut the 23, drop the Set, and add a build.py refusal.

9. **Behaviour outside the record** (VERIFIED). engage, command, formations and muster carry `fx: []` and act through `techs.has('<id>')` in 08-core (×4), 11-orders, 14, 17, 28, 29, 34, 39-huddle. armedcart, chimney, roads and snowclear are also hard-coded by id (13:537, 24:583, 32:371-372), and 08-core:528 hard-codes `['leather','chain','plate']` for the art. RULES §6: one record per thing. Fix: flags in fx (`{s:'stances'}`, `{s:'squads'}`...) read by fxv, or a `opens:` field.

10. **Printing and Printing press are one invention twice** (VERIFIED). Printing (keep, 04:811, 1450s, research ×0.85, needs press) and Printing press (library, 04:2129, 1450s, research ×0.8). Both WHY lines describe Gutenberg. One home: merge them.

11. **Elite steps have no date, so the history test skips them** (VERIFIED). The loop sets `when: 'Medieval'` (04:3120). history.py's `year()` returns None, so these 6 steps go on the "no date" list and pass. Their WHY lines give 27 BC (Praetorians), Herodotus's Apple-bearers (about 480 BC), Maurya (about 300 BC): far older than age 3, with no Game: note, and they get one because they escape the check. Sawpits ('Roman'), Pollarding ('Bronze age'), Fieldcraft ('Stone age') and Rites ('Bronze age') escape the same way. Fix: real dates in the elite tuple, and make history.py fail on no-date.

12. **Elite desc is a template that produces wrong text** (VERIFIED). 04:3121 gives "become Elite crossbowmans", "Elite horsemans" and "Royal elephants, ... tougher" (correct), and says "tougher, harder hitting" for Han, which gets no hp. Speed for Mongol and Mali is not mentioned. The name gives "Elite: Elite crossbowman" (04:3111), patched by a TITLE_SHORT entry in 07:15. Fix: build the desc from the tier numbers; give Han and Mali elites real names (both are "Elite X").

13. **WHY key collision: legion** (VERIFIED). `legion` is both a research id and a unit id. The single WHY.legion text (07:195) ends "Game: it replaces the swordsman of the Bronze age ... so a Roman player has a Roman army". It is shown on the Legion research card (27-cards-core:128) to every people, and history.py reads its "Game:" too. Fix: rename one id (the research step to `legion_ranks` or `manipular`).

14. **Line order creates long hidden chains** (VERIFIED, design judgement). A line is one strict chain, so unrelated steps queue behind each other. Halberd (spear) waits on Men-at-arms (sword), which waits on Plate, which waits on Water bellows and Cast iron at the Foundry: 17 prerequisites over 3 buildings. Tercio has 31 prerequisites; Stone saws (quarry) has 19, including Horse breeding at the Stable (via sawmill→windmill→horse collar). The player sees only "Needs X" one step at a time.

15. **Date inversions in prerequisites** (VERIFIED). Burning shot (600s, 04:1786) waits on Fire arrows (900s). Academy (Plato, 387 BC, 04:2044) waits on Veterans (Marius, 100 BC).

16. **Real-history claims that look wrong** (SUSPECTED, from general knowledge, not checked against a source this session):
    - Torsion springs 399 BC, Dionysius of Syracuse (04:1757). The engines of 399 BC were non-torsion (gastraphetes/oxybeles); torsion is usually dated to Macedon about 350 to 340 BC.
    - Tercio WHY: "unbeaten from Pavia to Rocroi". Pavia (1525) predates the tercio (1534), and tercios lost before Rocroi (Nieuwpoort 1600).
    - Tempering dated 1200s (04:1519). Quench-and-temper is attested by about 1000 BC.
    - Seed drill WHY credits only Tull (1701). Babylonian and Han Chinese seed drills existed. RULES §5 asks for more than one place.
    - Only 3 of 230 `when` values say "about", though nearly all prehistoric dates are approximate. RULES §5 asks for "about" unless exact.

17. **Repetition: the size of the problem** (VERIFIED). 3,097 of the 3,234 lines are 224 records that Prettier expands to about 13.8 lines each (printWidth 120 cannot fit an object with nested cost/fx). 450 lines are `at:`/`line:` that repeat the group, 450 are `cost:`/`t:` that a formula gives (finding 7), and 460 are brace lines. A grouped positional table, `line('lumber','Felling', [[id, name, age, w, when, fx, need, desc], ...])`, with cost and t generated: my test of the 224 rows in that shape through the project's Prettier config gave 289 lines. Estimate: 3,234 lines become about 450 to 550 (about 2,700 lines saved, about 85%). In addition, 67 of 230 descs are reproduced exactly by 12 fx templates ("Wood comes in N% faster", "Farms give N% more"...). Generating them removes the desc/number drift risk (none found today).

## S4: minor
18. Legionary desc (04:3181) says "breaks buildings faster", but `bld` is 1.5, the same as the swordsman it replaces. VERIFIED.
19. Two header comments both open "Research" (04:2 and 04:4). `btier`, `short` and `civ` are not documented in the header. VERIFIED.
20. Iron working (age 1) costs 160 iron, which turns the iron counter on in the Bronze age (firstAge). 01-rules-basics:54 says iron is "from the Classical age on". VERIFIED.
21. Mongol bonus "everything on horseback": #mounted excludes the scout, which rides after Horse breeding. VERIFIED (tags), minor.
22. Research speed stacks to ×0.299 (8 steps), healing ×3.51, nerve rest ×3.65, trade ×2.63. Not wrong, but none of these totals has a SCIENCE.md "design" label. RULES §5 labels real-world numbers only, so this is a judgement call.

## Not checked
- Balance (whether the totals are fun or AoE-like). The lead runs balance.py.
- SCIENCE.md is labelled "cited" for every date; I did not open sources. Item 16 is from general knowledge.
- Art/UI for elites and btier names beyond the grep.
- The AI's research order (17-ai) beyond confirming it respects civ and isNext.

## Overall
The tree is structurally sound: ids, prerequisites, cycles, buildings, units and effect keys all check clean, and every effect is read. The weaknesses are what the effects actually do: food and mining research leak into fish, hunting and the workshops; the additive climate steps hit immunity while their text says "half"; the elites are unequal; and the "weight sets cost and time" claim shown to players is false for half the tree. The file is about 85% expansion of a table that a grouped row format plus a cost formula would hold in about 500 lines.
