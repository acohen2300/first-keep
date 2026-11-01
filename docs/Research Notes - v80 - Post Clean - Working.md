# Research Notes - v80 - Post Clean - Working
*Build 80, Nov 1, 2026. The builder's notes for the research and text batch (decisions N9, N10, N11, N12, N14; Albert's double yes, Nov 1, 01:17). Branch `research80`, made from `main` at 0abb080; not pushed, not published. `CUTS.md` is not touched (another builder runs in parallel): its entry is drafted at the end.*

## Start QC, before any change
`python3 tests/handoff.py` on 0abb080: START QC PASSED (build, wrap, lint, the gate at four sizes, 66 planted bugs caught). No FAIL to report.

## What was built

**N9 (D11). Research keyed to the finds its text names.**
- One home for what gather research is keyed to: `nodeKey(n)` in `08-core`, the find's own kind (tree, bush, fish, meat, stone, gold, iron), or for a worked plot the building it belongs to (farm, treefarm, quarry, mint, foundry, pasture). The resource type is no longer a key, so `food` can no longer reach fish and game, and `gold` can no longer reach the Mint.
- One home for whether an effect reaches something: `fxFits(f, keys)` in `08-core`, used by `fxv` and by the find card's Bonus line (`bonusText`, which had its own copy of the rule, with a dead `&& false` branch). An fx row's `k` may now name a list.
- The rows (`04-rules-tech`): Sickles, Threshing sledge, Plough, Horse collar `k: 'farm'`, Albert's own words, "fields and mines only" (review fix: the first build kept bushes on Sickles from its card's text; the card now says "Fields yield 10% faster."). Bushes take no harvest research. The mining rows are unchanged in the table and now reach only the stone, gold and iron finds, not the Quarry, Mint or Foundry.
- Kept exactly as they played (not research, or not in N9): the Felling line `k: ['tree', 'treefarm']` (it reached tree farms through `wood` before); the Mint's own "gold gathered pays 15% more" and the Mali bonus `k: ['gold', 'mint']` (both reached the Mint's coin through `gold` before). See Decisions.
- Fishing and hunting: both have their own research, so nothing was invented. Fishing: Fish traps, Nets, Decked boats, Trawl nets (Fishing line), Dugout canoes, Sails (Harbour line), Ice house. Hunting: Ice house only (`meat` ×1.15). Both lose the harvest line, as decided: on the whole tree fish fell from ×6.80 to the Dock's own steps, game from ×1.92 to ×1.15.

**N10 (D12). Climate steps are layers in series.**
- `insulate(a) = 1 / (1 + a)` in `12-sim-core`, read by `sideSpd` for `cold` and `wet`; it replaces `1 − min(1, a)`. Only the formula that reads the fx data changed.
- To keep the cards' "half", Wool cloaks and Oiled cloaks now carry `a: 1` (was 0.5): 1/(1+1) = 0.5, exactly what they did before alone. A second layer would leave a third, never zero.
- Weather glass: its cold and wet cut is gone. My choice for the replacement (flagged below): a lead-time effect on what the game already has. The sky was already rolled one minute ahead for Weather signs (`c.next`); it is now a list, `G.clim.ahead`, rolled a minute ahead for each forecast step and never less than one. Weather glass carries `forecast a: 1` and needs Weather signs (review fix), so it always tells the sky two minutes ahead ("Signs of rain in 2 minutes."), and its card, "The next sky is told a minute further ahead", is true. With no forecast the dice are drawn in the same order as before (the fingerprint confirms it).
- Ice steps (Horseshoes, Crampons) are friction, left as friction. They do not enter `muOf` (what the ground offers). They lower what a step needs: `slipChance(u, need × (1 − a))` in `09-nav`, and the stride loss `1 − μstride·ice·(1 − a)` in `groundSpd`. Not changed. See Decisions: for a rider both together make a = 1.
- SCIENCE.md: a row for the layers (ISO 9920 and ASHRAE 55, 1 clo = 0.155 m²·K/W, marked from memory: neither opened) and a row for the barometer's lead time (design on the record, from memory).

**N11 (D14). The research card's formula sentence.** It was still there after the cards merge (`techBook`, `27-cards-core`). Deleted. The card keeps "weight N of 10". The w comment in `04-rules-tech` now says w is shown on the card and that cost and t are set by hand for balance. The Rules page said the same false thing ("Cost and time follow the weight of the step in history"); corrected.

**N12 (D15). The research oddities.**
- (a) The 4 was not in the caravan row of `02-rules-units`: it was typed in `caravanTick` (`13-sim-civil`), with the reach 24 beside it. Both moved into the caravan row (`armed: { dmg: 4, rng: 24 }`); `caravanTick` reads the row; the Armed caravans card is generated from it: "Caravans are twice as tough, and their guards strike any foe within 24 for 4, once a second." (review fix: "hit back" was wrong, they strike whether struck or not, and the reach was not shown).
- (b) Charcoal burning: `age: BLD.foundry.age` (the Medieval age), read from the table. Its cost and time are left at their Bronze-age values (see Decisions). Its WHY line has a "Game:" note so the history check passes.
- (c) Printing is folded into Printing press: `research m 0.68` (0.8 × 0.85), "Research is 32% faster". The Printing row and its WHY line are cut; the press's WHY line keeps Printing's fact (twenty million books by 1500). Old saves: save shape 39 to 40 (`MIGRATE[39]`): "printing" becomes "press" in every side's research; a queued Printing order is dropped and given back through the same path as a cancel (review fix): `refund(p, j)` in `11-orders`, one home for `cancelOrder` and the migration, so the purse, the ledger and research spent (`p.spent`, which feeds the tech score) all move. A side that had the press but never researched Printing now gets the whole ×0.68, a free ×0.85 (unstated before; it follows from the merge).

**N14 (F1). The text follows the tables.**
- Open scenario: "five villagers" was false (3). The number has one home, `START_VILS` in `06-rules-tuning`, read by `10-world` (the row of villagers now centred for any count) and the text: "a keep, 3 villagers, a scout, the land."
- Snow against mud: the milestone said snow costs more than mud (the tables say the opposite: 38% against 44%) and "Below 1 °C" (the rule is at and below). Now generated: "At 1 °C and below what falls is snow; deep snow slows a walker 38%, deep mud 44%." The Rules page's weather line had "snow falls below freezing"; now `snowAt` too. One helper, `slowPct`, for the three places that turned Pandolf's factor into a percent.
- Ground marks: "for looks only and not saved" was half false. Now: the marks of the fallen and the burned are looks only, not kept in the save; the ruts are real mud and are kept.
- Pausing: "Opening any card pauses the game" was false. `READ_CARDS` now names each card it holds (`27-cards-core`), and the Rules line is generated from it: "Opening a card you sit and read (Research, the Army, the Guide, Help, Score, Stores, Sound, the War Council or Relations) pauses the game; a building, a unit or a field to glance at does not".
- The rest of group F's code contradictions (F10, from `docs/v80 Audit/text.md` items 9, 11, 13, 14, 15, 16, 17): Hold ground cut (a control that exists nowhere; logged in the CUTS draft); the shrine "at the foot of the Throne" (one line said "inside"); the troll "goes home soon" (its end is timed, not by dusk); the heavy-blows list generated from `UNIT.knock` (the bombard was missing); the Market line reads the `sell` research ("research raises it to 100%"; it said "Coinage 90%" from a hand +0.1); the vassal investment list generated from `BLD.invest` ("business center" is no building, "others 3" was false), with the default 3 moved to `VASSAL.invest`; the Net's Guide row no longer says it is a Walls trap.
- Oiled cloaks (found while testing N10, same principle): its card said "Rain slows soldiers half as much", but rain has no march slowdown in `WEATHER`; only a blizzard does (rain slows a march through the mud, which cloaks do not touch). Corrected to "Blizzards slow soldiers half as much." See Decisions.
- **Held for Albert, not touched:** the Aqueduct room line (`07-text`, "Room opens when a House, Apartment or Aqueduct finishes") and the plague line ("Clean water, sewers and quarantine halve the spread").

**Tests.** Each fails on main 0abb080 (run on a copy of 0abb080 with these tests; on main the page lacks some exports, so they were added to that copy only, with `insulate` given main's own reading, 1 − min(1, a)):
- `tests/tables.py`: N9, every harvest and mining step reaches exactly fields or the mines' finds (23 failures on main, e.g. "Sickles reaches the fish"); N10, Weather glass has no cold or wet cut, needs Weather signs, and over 160 turns of the sky every change is told exactly two minutes before it comes, in the right words, and nothing else is told; one minute rolled ahead with no forecast; N11, no research card claims a cost formula; N12, the Armed caravans card says the row's reach and hit in their places in its sentence, the caravan's strike doubles when its row's hit doubles, Charcoal burning sits in the Foundry's age, no Printing step, the press is 0.8 × 0.85; F1, the Open text against a new game's villagers, the snow line reads the tables, the ground marks line against what a save holds (the ruts kept, no scar layer), and the pause line against play (each card it names pauses, a building card does not).
- `tests/science.py`: layers in series: one layer 0.5, two 1/3, one cloak halves the winter toll, one oiled cloak halves the storm toll, every step together leaves both tolls above zero (main: "one layer: got 0", "every step together ends the storm toll", "ends the winter toll").
- `tests/saves.py`: an old save holding Printing opens with the press, a queued Printing order is given back to the purse, the ledger and research spent, the sky rolled ahead survives (fail on main).
- `tests/handoff.py`: 17 planted bugs, one or more per change (the resource as the key, Sickles on all food, Sickles on bushes, the old climate formula, Weather glass with no lead, Weather glass without Weather signs, the warning a minute late, the formula sentence, the typed caravan hit, the card's reach and hit swapped, Charcoal in the Bronze age, the migration without Printing, the refund outside the cancel path, five starting villagers, the old snow line, the save without its ruts, every card pausing). See the final run below.

**The fingerprint did not move.** `tests/baseline.json` is unchanged and no `--accept` was run. Proof, each change turned off in turn on a copy and the gate's fingerprint run (`scratchpad/fpvariants.py`): all on, N9 off, N10 off, N12a off, N12b off, N12c off, N14 off and all off each equal main's baseline at every minute. The fingerprint's five-minute script never reaches the harvest line, the cloaks, Weather glass, Charcoal burning or Printing, so it cannot see these changes; the balance run is where they show.

## Decisions for Albert
1. **Weather glass's replacement: the lead time (my choice, as asked).** It needs Weather signs and tells the sky two minutes ahead instead of one. The alternative was nothing, which would leave a step with no effect (dead: it would then have to be cut). Say if you want it cut instead.
2. **The Mint's own bonus and the Mali bonus still reach the Mint's coin.** Both say "gold gathered"; striking coin is not gathering. N9 covered research only, so I kept them as they played (`k: ['gold', 'mint']`). Dropping `'mint'` from the two rows makes them gathering only.
3. **Bushes take no harvest research** (×1.67 before), following your "fields and mines only" (review fix; Sickles' card corrected). If berry picking should have a step of its own, that is a new step.
4. **Felling still reaches tree farms.** It did before (through `wood`) and its text says "Wood"; kept. Your call if a coppice plot should take only the Lumber camp's own tree-farm steps.
5. **Charcoal burning's price.** Moved to the Medieval age at its Bronze-age price (170f 110w, 38 s). Wagons, the same weight in the same age, costs 260f 180w, 52 s. The numbers are balance (N11), so I did not change them.
6. **Printing press is now one step at the press's price** (550g 360s, 87 s) for the effect two steps gave (the cut Printing cost 550f 360g, 87 s more). Kept as decided; say if the price should rise.
7. **Ice for riders.** Horseshoes (riders, a 0.5) and Crampons (everyone, a 0.5) add to a = 1 for a rider: no stride loss on ice and the slip test asks for no grip at all (the chance is then small but not zero). Left as friction, as asked. If it should not reach immunity, the series form or a friction gain on `muOf` (crampons raise the grip on offer) would do it; that is a new decision.
8. **Oiled cloaks only matter in a blizzard** (Harsh winters only). The card now says so. If rain should slow a march, that is a `WEATHER.rain.spd` (a new rule).
9. **Held, not touched:** the Aqueduct room line and the plague line (N14).

## Rules bent
- **Text read by a test.** The ground marks check reads two phrases of its line ("ruts … kept in the save", "fell … not kept in the save") and holds each against the save; a rewording that drops the phrases would fail it, which is the intent.
- **`--accept` not run, so no CUTS.md line from it** (the gate appends one when it runs). Not needed: the fingerprint did not move.
- **Save shape 40.** One migration step with two parts (Printing, the sky rolled ahead), as the save rules ask.
- **Hard-typed cadence kept:** the caravan's strike is still "once a second" as `(G.tick + u.id) % 30`, as every other once-a-second check in the game.

## What was not done
- F2 to F9 (the screen help rewrite, the tier list, the WHY.legion split, toast lengths, the history errors, the elite template, the TRIGGERS numbers) are batch 7 items outside this brief; not started. The other hand-copied numbers in TRIGGERS (75%, 30%, twelve minutes and the rest) stand.
- D16 (in batch 7 with these) was not in this brief.
- GUIDE.md is left as it is: it is the Build 70 snapshot (written by `F.guideMd()`, which could write it again; whether to is Albert's call). It still lists Printing, the old Charcoal age, Weather glass's old cut and the old caravan and cloak texts.
- Fractional forecast steps: `A[lead - 1]` assumes whole minutes; every forecast step is 1. The turn the lead grows draws one more die (same inputs, same game).
- The sources marked from memory (ISO 9920, ASHRAE 55, the barometer's lead) were not opened.
- No preview, no push, no publish.

## Size, before and after
| | 0abb080 | research80 |
|---|---|---|
| `src/*.js` | 1,052,951 bytes, 30,261 lines | 1,056,685 bytes, 30,299 lines (+3,734 bytes, +38 lines) |
| `first-keep.html` | 1,171,686 bytes | 1,175,420 bytes |
| `tests/*.py` | 1,632 lines | 1,715 lines |
Research steps: 230 to 229 (Printing folded in).

## Balance
`python3 tests/balance.py --seeds 4 --minutes 30 --jobs 1`, main (0abb080) and research80. Four seeds is a small sample; differences within a seed's noise are not findings.

| | main | research80 |
|---|---|---|
| Winners (seat, civ) | 1 Mali, 2 Mali, 0 Mongol, 2 Persian | 0 Han, 3 Roman, 2 Mali, 2 Persian |
| Bronze (median minute) | 4.5 | 4.5 |
| Classical | 9.1 | 9.2 |
| Medieval | 20.9, by 7 of 16 sides | 21.6, by 8 of 16 sides |
| Sides that fell | 0 | 0 |
| Mean final score (16 sides) | 3,213 | 3,177 |
| Villager-seconds blocked, median per game | 80.5 (max 327) | 74.5 (max 106) |
| Idle, no work found / waiting at a workshop | 917.5 / 387.0 | 501.0 / 122.0 |
| Caravans at the end, per seat | 4, 7, 5, 6 | 2, 7, 4, 5 |
| Page errors | 0 | 0 |

Reading: the ages and the scores hold; no side fell in either. The economy did not visibly slow from fish and game losing the harvest line in 30 minutes on four seeds. The idle and workshop-wait counts fell, which I cannot tie to these changes from four seeds.

## Review fixes (Nov 1, the fresh-eyes review of 9ebb3a1)
Fixed on top: N9 to Albert's "fields and mines only" (no bushes, Sickles' card corrected); Weather glass needs Weather signs; the old-save Printing refund goes through the cancel path; the Weather glass test checks the warning comes two minutes early; the ground marks and pause checks hold the text against the save and against play; the Armed caravans check reads reach and hit in their places in the sentence (and the card now says what the guards do: strike any foe within 24 for 4, once a second); the villager row centred for any `START_VILS`. GUIDE.md left as the Build 70 snapshot. The balance numbers above are from 9ebb3a1 (bushes then kept Sickles' ×1.1); not run again.

## Final check
First build (9ebb3a1), before its commit: `python3 build.py` clean, `python3 tests/lint.py` clean, `python3 tests/handoff.py`: build, wrap, lint, the whole gate (four sizes, the baseline fingerprint) PASS; 78 planted bugs, all caught (the 12 new ones included). Its one FAIL was "the working tree is clean", the uncommitted batch itself. After that commit it was run again: START QC PASSED (92 PASS, no FAIL; 78 planted bugs caught; the tree clean). The review fixes (28568e3): build and lint clean, science, history, tables and saves PASS, then `python3 tests/handoff.py` (after the combat builder's run had finished): START QC PASSED, 97 PASS, no FAIL, 83 planted bugs caught, the tree clean.

## Draft for CUTS.md
**Research and text (N9, N10, N11, N12, N14; Albert, Nov 1, yes yes). Branch `research80`.**

Changes:
- N9: gather research keyed to the find (`nodeKey`, one home in `08-core`); `fxFits` one home for whether an effect reaches a thing (fxv and the find card); fx `k` may name a list. Fields and mines only: the harvest line on fields (Sickles' card corrected), mining on the stone, gold and iron finds. Bushes, fish and game lose the harvest line (they keep the Dock's steps and Ice house). Felling, the Mint's own bonus and Mali kept as they played.
- N10: cold and wet as layers in series, 1/(1 + Σa) (`insulate`, `12-sim-core`); Wool cloaks and Oiled cloaks a 1 (still half). Weather glass: forecast lead time, the sky rolled a minute ahead per forecast step (`G.clim.ahead`); it needs Weather signs. Ice steps unchanged (friction). SCIENCE.md: two rows.
- N11: the research card's cost formula sentence and the Rules page's twin cut; the w comment fixed.
- N12: the caravan's guards in the caravan row (`armed: { dmg: 4, rng: 24 }`), the Armed caravans card generated from it (reach and hit); Charcoal burning in the Foundry's age (`BLD.foundry.age`); Printing folded into Printing press (×0.68), save shape 40 maps it, a queued order refunded as a cancel (`refund`, one home in `11-orders`).
- N14: Open villagers (`START_VILS`), snow against mud and `snowAt`, ground marks, pausing (generated from `READ_CARDS`), the shrine, the troll, the heavy blows list, the Market's sell rate, the vassal investment list (`VASSAL.invest`), the Net's menu, Oiled cloaks (blizzards). Held for Albert: the Aqueduct room line, the plague line.

Cut:
- The research step Printing (folded into Printing press; its effect kept, its WHY fact kept in the press's line).
- The research card sentence "Cost and time ×(0.5 + 0.1w) for its age" and the Rules page's "Cost and time follow the weight of the step in history".
- Weather glass's cold and wet cut (a barometer is not insulation).
- The Rules entry "Hold ground" (a control that exists nowhere; the Temper dial's Hold replaced it).
- `bonusText`'s own copy of the key rule (and its dead `&& false` branch).
- The typed 4 and 24 in `caravanTick`, the typed 3 in the start's villager loop and in the vassal's investment.
- Sickles on bushes (bushes take no harvest research: fields and mines only).

Tests:
- `tests/tables.py`: fields and mines only (N9), Weather glass's need and its warning two minutes early (N10), no formula on the card (N11), the caravan row and its card, Charcoal, Printing (N12), the Open start, snow, ground marks against the save, pausing against play (F1).
- `tests/science.py`: layers in series.
- `tests/saves.py`: Printing and the rolled sky migrate; the refund reaches the ledger and research spent.
- `tests/handoff.py`: 17 planted bugs (83 in all).
- Play fingerprint: unchanged (each change turned off in turn: all equal the baseline; the five-minute script reaches none of them).
- Balance (4 seeds, 30 min): main and research80 in `docs/Research Notes - v80 - Post Clean - Working.md`.
