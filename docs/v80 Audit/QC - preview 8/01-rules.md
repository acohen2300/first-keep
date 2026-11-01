# QC 1 of 13: rules files 01, 02, 03, 05, 06 (HEAD v80 against v70 88b2cb2)

Read in full: src/01-rules-basics.js, 02-rules-units.js, 03-rules-buildings.js, 05-rules-wild.js, 06-rules-tuning.js. Diff 88b2cb2..HEAD touches 02 (+4), 05 (+2), 06 (+5) only; 01 and 03 unchanged. Readers traced by grep in 08, 09, 12, 13, 14, 15, 16. Nothing run but grep and a node-free hand check of rangeFrom.
Tags: C traced and sure; K read, fairly sure; S suspect.

## 1. Prior audit findings (tables1.md and others): status at HEAD

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| P1 | S2-1 AI research lists skip line predecessors (aggr 4 of 12 reachable). STILL PRESENT; 17-ai.js unchanged since v70 (decision D2 "research first missing step" not built) | 05-rules-wild.js:139-152, 192-226, 267-293 | C | wrong (AI personality barely steers research) | walk needsOf for each wanted id in 17-ai, as decided |
| P2 | S2-2 TEACH_TO harcher->cata and ram->catapult are same age, never teachable. STILL PRESENT | 06-rules-tuning.js:111-112 | C | wrong (dead data) | delete both lines |
| P3 | S2-3 Caravan desc "runs between your Markets" (one Market per side; run goes to an ally). STILL PRESENT | 02-rules-units.js:71 | C | wrong text | "runs to an ally's Market for gold" |
| P4 | S2-4 header comment "60 villagers ... army = the 90" vs POPMAX 180, ARMYMAX 120. STILL PRESENT | 02-rules-units.js:2; 01-rules-basics.js:17-18 | C | minor | name the constants, drop the numbers |
| P5 | S2-5 BLD.wonder.one unreachable (capFor already 1). STILL PRESENT (09-nav:722 too) | 03-rules-buildings.js:633 | C | minor (dead) | delete field and branch |
| P6 | S3-1 dead fields: MENUS blurb, FINDS.mercs.gone (180, copy of EVENTS.mercs.secs), UNIT.performer.cheer 150 (live value is EVENTS.circus.cheer 120), UNIT.*.fantasy, tag 'light', UNIT.gun (repeats 'gun' tag). ALL STILL PRESENT; decision record line 593 lists them for the cut list (batch G, not built) | 03:659-683; 05:56; 02:584; 02:610,624,638,653,697; 02:224; 02:377,418 | C | minor (bloat; cheer copy disagrees) | cut, log in CUTS.md |
| P7 | S3-2 hazard sizes are literals in code, HAZARDS holds only pts and words. STILL PRESENT (the 4x plague death still only in a comment) | 06-rules-tuning.js:190-222, 307 | C | wrong by rule (one home) | give each hazard its multipliers |
| P8 | S3-3 hand copies: ROUTES types 1000 (MID) 8x; TELL.foot 27 copies scout spd; TELL.ride 49 is wrong (mounted scout 27x1.35 = 36.45); RAW_NAME repeats RESOURCES names; RESOURCES.drop copies BLD names; raw list 'f','w','s','i' typed 3x in 03/06. STILL PRESENT | 06:279-292, 239-240, 311-313; 03:13-14; 01:50-54 | C | wrong (TELL.ride: messengers 35% too fast) | derive from MID, UNIT.scout, Object.keys(TRADE) |
| P9 | S3-4 stale comments: 01:20 "six battalions" (four, BNSIZE is also the squad cap); 05 "the Fortress posts a job" orphan (now line 68); 03:55 "a caravan carries 20 goods" hung on PRICE; 03:18 "5% of the way" describes old code. STILL PRESENT | 01-rules-basics.js:20; 05-rules-wild.js:68; 03-rules-buildings.js:55, 18 | C | minor | rewrite or delete each |
| P10 | S3-5 words in the rules files vs RULES §6 "numbers only in 01-06". STILL PRESENT, and v80 added more prose (temper comments) | 02, 03, 05, 06 | K | minor (rule vs layout) | owner picks: change rule or move words |
| P11 | S3-6 real-world numbers with no SCIENCE.md row (SEASONS, HARVEST, CLIMATE.wear/eq/mud, NIGHT_SIGHT, danegeld, CHARGE, FORM, TELL). STILL PRESENT | 01:83-89; 06:22-41, 50-92, 122-134, 165-168 | K | minor | label design or cite |
| P12 | S4 cap arrays 5 long for 6 ages; PERS.mix sums 1.08/1.10/1.08; JOBS = RES alias; FORT/WILD hand indexes; FORM Square note "30% less from riders" is 37%; VASSAL.decay hand-written decay beside relax; Drought desc "springs can too" (hazard chain is Summer only). ALL STILL PRESENT | 03 cap rows; 05:111,157,232; 01:59, 46, 73; 06:131; 03:31; 06:210 | C | minor | as tables1 S4 |
| P13 | tech.md 20: iron comment "weapons and armour from the Classical age on", but Iron working opens iron in Bronze. STILL PRESENT | 01-rules-basics.js:54 | K | minor | "from the Bronze age on" |
| P14 | ai.md 3: Gunpowder costs g 900, the venture fires at gold > 900, so gold for the age is eaten. Table side STILL PRESENT (36-economy logic not mine) | 01-rules-basics.js:80 | K | wrong (AI age-up) | venture threshold from the next age's cost |
| P15 | N7 (decided): remove flat per.vils ceiling. NOT YET BUILT: vils 16/26/28 still read at 17-ai:87,121,249 | 05-rules-wild.js:110, 156, 231 | C | wrong vs decision (owed) | build N7 |

## 2. v80 changes in these files

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| V1 | temper 'flee' and 'hunt' are never compared anywhere. Only `=== 'defend'` (14-sim-troops:475, 487) and truthiness (15-sim-spatial:29) are read. Two of three values are labels with no behaviour | 02-rules-units.js:462, 490 | C | wrong (field claims behaviour not built) | either read them (move deer's flee off `flee:true`) or mark design-only |
| V2 | Deer carries both `temper: 'flee'` and the old `flee: true`; the flee logic still reads `U.flee` (14:416, 12:5, 24:371). Two fields, one fact. And since temper is truthy, the `U.flee` term in ignorable (15:30) can no longer be reached by any unit | 02-rules-units.js:462, 467; 15-sim-spatial.js:29-30 | C | minor (duplicate, dead branch) | drive flee from temper, drop `flee:true` |
| V3 | Dire wolf (the fantasy wolf that replaces chest-guard wolves) got no temper. ignorable() falls to the old rule, so soldiers attack dire wolves on sight but leave real wolves alone: the decision 8 rule changes with the fantasy toggle | 02-rules-units.js:600-613 | C | wrong (inconsistent play) | add `temper: 'hunt'` to direwolf |
| V4 | Bison and dragon are tagged 'animal' but have no temper, so decision 8 ("soldiers leave animals alone") does not cover them; whether soldiers chase them depends on nearestFoe's other filters | 02-rules-units.js:565-576, 690-701 | K (effect S) | minor | decide: temper on every 'animal', or tag check |
| V5 | Comments cite math that is not built: wolf "attacks what it can beat (Charnov 1976)" and deer "Ydenberg and Dill 1986". CUTS preview 5: "Wolf and deer: unchanged"; the deer still runs from any non-villager within 70, no cost comparison. SCIENCE.md:77 lists the deer row as "cited" | 02-rules-units.js:462, 490; SCIENCE.md:77 | C | wrong (record claims math the code lacks) | say "design; not yet built" until the rule exists |
| V6 | STARTLE 45 is a new number not in the decision record (decision 8 says only V/C). It has no SCIENCE.md row; Hawk-Dove gives no distance. It also replaced the defenders' old 140 search (and boar sight is 70) | 05-rules-wild.js:66 | K | wrong by rule (undecided number) | log as design in SCIENCE.md, or get Albert's yes |
| V7 | SEARCH.give 25 is not in decision 1 (which says: if nothing is found, wait at the drop-off shown idle and re-look every few seconds). Code keeps the job tau+give = 35 s then waits for an order; no SCIENCE row for give | 06-rules-tuning.js:156-158; 13-sim-civil.js:231 | K | wrong vs decision | confirm with Albert or follow the decided re-look |
| V8 | Decision 1 says search "from the anchor (placed spot, else nearest drop-off)" with leash DANGER_R.far 200. searchR is measured from the villager's own position (dist(u, n), 12-sim-core:683); no anchor or leash seen in this path | 06-rules-tuning.js:159; 12-sim-core.js:683 | S | wrong vs decision | measure from the anchor; add the leash |
| V9 | searchR is a function that reads game state (G.t) inside a rules file; RULES §6 keeps 01-06 to numbers | 06-rules-tuning.js:159 | K | minor (rule) | move searchR beside forage in 12-sim-core |
| V10 | ARRIVE 9 is set "more than the 8-unit push", but 8 is a bare literal in pushApart (16-sim-fight:158). Hand-copied relation; change one and the other breaks silently | 06-rules-tuning.js:157 | C | minor (no hand-copied numbers) | name PUSH = 8 in the table, ARRIVE = PUSH + 1 |
| V11 | The SEARCH comment (lines 155-156) is split from SEARCH by the ARRIVE line inserted between them | 06-rules-tuning.js:155-158 | C | minor | move ARRIVE above the comment |
| V12 | The defender's Hawk-Dove V = 1 and the 10 s re-weigh are literals in 14-sim-troops:489, not in a table (01:2 "every number lives in a table") | 14-sim-troops.js:489 (table home 05:66) | C | minor | put V and the 10 s beside STARTLE |
| V13 | Name clash: `UNIT.*.temper` (animal mood) beside `TEMPER`, `T_HOLD..T_PRESS`, `G.temper`, `temperOf` (battalion stance) | 02:462-504; 06:139-152 | C | minor (confusing) | rename the animal field (e.g. `mood`) |

Matches the record: SEARCH x 90, y 90, tau 10 (decision 1); ARRIVE above 8 (decision 10a); defend for boar/bear, V/C (decision 8). The arrival ramp cut in preview 8 left nothing behind in these files.

## 3. New findings the audit missed

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | Siege tower desc "Outshoots a watchtower": stower rng 110; a watchtower shoots rangeFrom(106, 44) = 53(1+√(1+176/106)) ≈ 139 (08-core:568). The tower outranges it by about 30 | 02-rules-units.js:330, 339; 03-rules-buildings.js:245, 250 | C | wrong (player told the opposite) | raise stower rng past 140 or fix the text |
| N2 | War elephant desc "Spears and javelins bring it down": Javelineer vs is { archer: 3 } and the elephant has no archer tag, so javelins get no bonus | 02-rules-units.js:195, 285, 299 | C | wrong text | drop "and javelins" (or give jav a bonus) |
| N3 | Wolf desc "guards nothing but its den", but wolves guard the treasure chest (FINDS.chest guard) | 02-rules-units.js:498; 05-rules-wild.js:7 | C | wrong text | "Hunts in packs; guards buried treasure" |
| N4 | FOGN = Math.ceil(MAP / 40): the 40 is FOG typed again on the next line | 01-rules-basics.js:44-45 | C | minor (hand copy) | Math.ceil(MAP / FOG) |
| N5 | Villager desc "Gathers food, wood, stone and gold": omits iron, a villager job (JOBS = RES) | 02-rules-units.js:23 | C | minor text | add iron (or "every resource") |
| N6 | CLIMATE.ice.melt 0.0064 is snow.melt 0.004 x 1.6 typed by hand (comment says so) | 06-rules-tuning.js:70-71 | C | minor (hand copy) | derive from snow.melt |
| N7 | Outlaws hazard desc "Between minute 20 and 40 a horde comes": at = 1200 + Exp(mean 600) (37-events:518), so about 13.5% of games it comes after 40 min (e^-2) | 06-rules-tuning.js:215, 228 | K | minor (text overpromises) | cap the draw at 2400 or say "from minute 20, usually by 40" |
| N8 | Crossbow desc "strong against knights and heavy foot": no trainable foot unit carries 'heavy' (only cata, elephant, troll) | 02-rules-units.js:215, 218 | K | minor text | "strong against knights and elephants" |
| N9 | 01:20 comment glues SHARE_FALLEN's note to a stale BNSIZE note on one line ("// ... // six battalions"); also BUILD_NAME comment still says "v70 · Restoration" at v80 | 01-rules-basics.js:4, 20 | C | minor | split and update comments |
| N10 | SEASONS Winter spd 0.8 and the Bad weather hazard's winter march 0.8 (12-sim-core:16, a literal) are two 0.8s with no shared home; a reader cannot tell if they stack | 01-rules-basics.js:88; 12-sim-core.js:16 | K | minor | put the hazard's factor in HAZARDS.winter |
| N11 | Vagabond hire "A unit of yours has to be within 80": the 80 is a literal in 11-orders:816, not in FINDS.vagabonds | 05-rules-wild.js:51; 11-orders.js:816 | C | minor (number outside table) | FINDS.vagabonds.near: 80, read in both |

Counts: 39 rows. C 27, K 11, S 1 (V4 is K, with its effect on play S).
