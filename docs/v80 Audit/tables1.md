# Tables audit 1: 01-rules-basics, 02-rules-units, 03-rules-buildings, 05-rules-wild, 06-rules-tuning (v70)

Method: every line of the five files read. Tables loaded in node (01-06 joined in one scope, `ag-tables1/load.js`) and cross-checked by script (`ag-tables1/xref.js`, `fields.js`, `strict.js`), then each hit traced into the consumer code with grep. Nothing in the repo was touched. No gate, soak, balance or probe run.

Scripts: /tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/ag-tables1/

## Clean (checked, nothing found)
- Every `UNIT.at`/`also`/`replaces`/`civ`, `BLD` drop/crop/makes, `TECH.at`/`tier.unit`/`btier.bld`/`need`, `PERS.build`/`techs`, `FINDS.guard`/`hire.unit`, `SCENARIOS.techs`/`blds`/`hz`, `TODAY_HZ`, `TEACH_TO`, `CIVS.uu`, `MENUS.items` resolve. All cost keys are valid short keys with positive values; every costed unit/building/tech has `t > 0` (envoy excepted on purpose).
- No unit opens before its building's age; no tech opens before its building's age; no tech (explicit need or line predecessor) waits on a later-age step; research lines are in non-decreasing age order.
- `PRICE.eps` covers exactly `MKTK`; every `LAND.amt` covers `RES`; `CLIMATE.chain` covers every season; every `EVENTS.season`/`need` is real.
- Every `fx.s` stat used in TECH/BLD/CIVS is read somewhere outside the rules.
- Every field of the flat tuning tables (VASSAL, NATIVE, THRONE, MORALE, CLIMATE, HEALTH, WATER, TELL, POST, DEMAND, etc.) is read at least once.
- No `Math.random` or clock in 01-06.
- Number-in-description spot checks hold (spy 45/140, medic 55/3, hospital 90/3, treefarm 500, tower 5, mint 1:1 and 15%, workshop 2:1 and 3:1, wonder 8 min, shrine 15 g/min, caravan two thirds of walking pace, tpost 20%/40%/12, replant half cost).

## Findings

### S2: wrong behaviour

**S2-1. The computers' research wish-lists mostly cannot be followed. VERIFIED (static); effect on play SUSPECTED.**
`05-rules-wild.js:137-150, 190-225, 265-291` (PERS.*.techs). A step can be researched only once its line predecessor is known (`needsOf` = `prevOf` + `need`, 08-core:206). The lists leave the predecessors out. Reachable from the list alone (script):
- aggr: 4 of 12 (bronze, horses, cavalry, engage). `drill` waits on spearwall, `axes` on hafting, `plough` on threshing, `leather` on helmets, `composite` on slings, `iron` on spearheads, `chain` on scale.
- bal: 12 of 34. fort: 8 of 25.
17-ai:233 tries the list every tick; a miss falls through to a once-every-10-ticks pass in TECH table order (17-ai:238). So the predecessors arrive late and in table order, and the "personality" mostly does not decide what is researched. fort lists `chain` before `iron` (chain waits on iron); harmless because the loop moves on, but wrong.
Fix: in the AI loop, research the first missing step of `needsOf` for each wanted id (the same walk `grant` already does in 10-world:179), or make tables.py require each list to be closed under needs.

**S2-2. Two `TEACH_TO` entries can never be taught. VERIFIED.**
`06-rules-tuning.js:111-112`: `harcher: 'cata'` and `ram: 'catapult'`. Both pairs are the same age (2). `teachTo` (11-orders:651-653) returns null unless the target's age is higher, so the soldier card says "Nothing newer to learn." Dead data that reads as a feature. Fix: delete both lines, or point them at a later kind.

**S2-3. The Caravan description is wrong. VERIFIED.**
`02-rules-units.js:71`: "With no route it runs between your Markets for gold." There is one Market per side (no `cap` and no `nocap`, so `capFor` gives 1, 08-core:287), and the no-route run goes to an ally's Market or Town Center (`allyMarket`, 36-economy:100-111). 07-text:891 already says it right. Fix: "With no route it runs to an ally's Market for gold."

**S2-4. The table's own comment contradicts the population limits. VERIFIED.**
`02-rules-units.js:2`: "civ = the 60 villagers and workers, army = the 90". The real values are POPMAX 180 and ARMYMAX 120 (01:17-18). Fix: name the constants and drop the numbers.

**S2-5. `BLD.wonder.one` and its check cannot be reached. VERIFIED.**
`03-rules-buildings.js:633` `one: true`; `09-nav.js:722` checks it. The wonder has no `cap`, so `capFor` already gives 1, and `capWhy` (09-nav:679) returns "At the limit of 1" before line 722 is reached. No research adds `limit` to wonder. Fix: delete the field and the branch (2 lines).

### S3: rule violations and bloat

**S3-1. Dead table fields (one home, but nobody lives there). VERIFIED by grep.**
- `MENUS[*].blurb` (03:659-682): 6 strings, never read anywhere in src or tests.
- `FINDS.mercs.gone: 180` (05:56): never read. The real duration is `EVENTS.mercs.secs` (06:266), also 180. Two copies of one number, one dead.
- `UNIT.performer.cheer: 150` (02:580): never read. The circus uses `EVENTS.circus.cheer` = 120 (37-events:334). The dead copy also disagrees with the live one.
- `UNIT.*.fantasy: true` (02:606, 620, 634, 649, 693): never read. Fantasy units are picked through `FINDS.guard[1]` and the event kinds. (`EVENTS.*.fantasy` is read; the unit flag is not.)
- Tag `'light'` (02:224, the chariot): no `vs`, fx or `hasTag` reads it.
- `UNIT.gun: true` (02:377, 418) repeats the `'gun'` tag the same two units already carry. Fix: `hasTag(kind,'gun')` at 16-sim-fight and drop the flag.
About 15 lines saved in all.

**S3-2. Hazard sizes are typed into the code, not the table. VERIFIED.**
`HAZARDS` (06:185-217) holds only points and words. The effects are literals: winter fields ×0.6 (08-core:597), winter march ×0.8 (12-sim-core:16), plague ×3 (36-economy:348), plague carts ×2 (36-economy:232), plague death ×4 (36-economy:523; the comment at 06:302 says "death × 4", but the table has no field for it), horde raids ÷2 (38-natives:216). This breaks the one-home rule, and every hazard description is a hand copy of these literals. Fix: give each HAZARDS entry its multipliers and have the code read them.

**S3-3. Hand copies of table values. VERIFIED.**
- `ROUTES` (06:274-287): 1000 typed eight times. That is MID. 510/680/1320/1490 are MID±490/320.
- `TELL.foot: 27` (06:234) is a copy of `UNIT.scout.spd`. `TELL.ride: 49` is said to be "the scout on a horse", but a mounted scout is 27 × 1.35 = 36.45 (the horses tier, 04). The copy is wrong.
- `RAW_NAME` (03:13) repeats `RESOURCES[*].name`. `RESOURCES.*.drop` (01:50-54) types 'Mill', 'Lumber camp', 'Mine', which are copies of `BLD.*.name`.
- The raw list `'f','w','s','i'` is typed in 03:14, 06:306, 06:307, 06:308, 27-cards-core:414 and 17-ai:216. It is `Object.keys(TRADE)`. 27-cards-core:414 is an exact copy of `MKTK`.
- 36-economy:584 `R.w >= 150 && R.s >= 50` is the Market's cost typed by hand; use `afford(p, BLD.market.cost)`.
- The fantasy ×1.5 is typed twice (14-sim-troops:575, 30-cards:205) and lives only in a comment (05:3).
- 36-economy:587 `p.pers === 'aggr'` is a name check that breaks PERS's own rule at 05:103 ("Every behaviour is a field, never a name check").

**S3-4. Stale or contradicting comments. VERIFIED.**
- 01:20: "six battalions, once Command is researched…; BNSIZE: the most one Zeal blesses". There are four squads (BN), and BNSIZE is also the squad cap (39-huddle:69-74).
- 08-core:276: "a hungry town works and fights at 60%". `UPKEEP.hunger` is 0.75 (03:16).
- 05:66: "the Fortress posts a job: break one guarded find, first side to take it is paid". No such feature exists in src. It is an orphan comment.
- 03:55: `}; // a caravan carries 20 goods` is attached to PRICE. It belongs to LOAD.
- 03:18: "Loyalty moves 5% of the way to its target". The code is now `relax` with `VASSAL.tau` (36-economy:863). The rate is equal, but the comment describes the old code.
- SCIENCE.md:3 says "Rule 4 of RULES.md"; the science rule is section 5.

**S3-5. Words in the rules files contradict RULES section 6. VERIFIED.**
RULES section 6 says "Rules (numbers only) in 01 to 06; every word in 07". 02, 03, 05 and 06 hold about 11.5 KB of `desc`/`text`/`note`/`blurb` (plus 10.5 KB in 04). Either the rule or the layout is wrong; one of them should change.

**S3-6. Real-world numbers with no SCIENCE.md row. VERIFIED (grep of SCIENCE.md).**
None of these appear: `SEASONS` spd/farm ("real effects, simplified"), `HARVEST` odds (1/20, 1/6), `CLIMATE.equinox` 80 (a real calendar fact), `CLIMATE.wear` 0.15 (frost brittleness and rust), `CLIMATE.mud`/`eq`/`shore`/`miss`/`blizzard`/`drought`/`hazard`, `NIGHT_SIGHT`, `NATIVE.danegeld` (it cites the Danegeld), `CHARGE`, `FORM` (wedge and square), `TELL.foot`/`ride`, the caravan's "two thirds of walking pace". Each should be labelled design or cited.

**S3-7. What tests/tables.py does not check, and should. VERIFIED (read).**
It checks: research needs resolve and have no cycles; scenario tech names; "a limit in every age"; one cancel refund. Gaps:
- The limit check cannot fail. `capAt` clamps the index (08-core:285), so any non-empty cap array passes, including the current 5-long arrays against 6 ages. RULES section 7 says "a test must be able to fail".
- Missing: unit `at`/`also`/`replaces`/`civ` resolve; tech `at`/`tier`/`btier` resolve; cost keys valid; ages ordered (unit not before its building, need not after its step); FINDS guard/hire kinds; MENUS items, with every buildable in a menu or exempt (tpost is in none, by design); PERS build kinds, and PERS techs closed under needs (would catch S2-1); TEACH_TO entries actually teachable (would catch S2-2); PRICE/LAND/CLIMATE.chain cover their key sets; no dead fields (would catch S3-1).
- It boots Chromium to check pure data. A node script over 01-06 (like `xref.js`) runs in milliseconds and needs no game.

### S4: minor
- `cap` arrays have 5 entries for 6 ages (03, 18 buildings). The Enlightenment silently uses the Gunpowder value. The comment at 03:653 says "Stone … Gunpowder", so this is intended, but undeclared in the data.
- `PERS.*.mix` sums to 1.08 / 1.10 / 1.08. 17-ai normalises it, so this is harmless, but the values do not read as shares.
- `JOBS = RES` (01:59) is a second name for one thing.
- `FORT = 3` and `WILD = 4` are hand indexes into PLAYERS. 10-world:131 sets FORT's peace by that index.
- FORM notes: Square "30% less from riders" is really 0.9 × 0.7 = 37% less. Wedge "take 10% more" applies to the whole battalion, not just its riders (16-sim-fight:73-75).
- Teaching versus a unique unit: a Han archer is taught to crossbow (age 3) and becomes a hanxbow (age 2), so a Han player cannot teach archers into a unit they can already train (11-orders:651-672).
- School, Library and Siege workshop descriptions list a few of their 12, 18 and 6 offerings. The Siege workshop omits the bombard.
- `VASSAL.decay` 0.98 per 10 s (36-economy:861) is another first-order decay written by hand beside `relax`.
- The Drought hazard description says "springs can too"; the hazard chain applies only in Summer (37-events:578). SUSPECTED misleading.

## Not checked
- 04-rules-tech beyond the cross-references (the TECH records' own text and history are another reviewer's).
- Whether the numbers balance (balance.py not run, by instruction).
- How much S2-1 affects play (needs probe.py).
- Colours against COLORS.md: the resource colours are indexed; the player and goods colours fall under EXCEPTIONS #11.

## Overall
The tables hold together on references and ages: no broken id, no age inversion, no bad cost key. The rot is in the edges: dead fields and dead teach entries, comments carrying old numbers, hazard sizes and route coordinates typed by hand outside their tables, and AI wish-lists that ignore the research tree they sit in. tables.py checks the least useful slice of this and contains one test that cannot fail.
