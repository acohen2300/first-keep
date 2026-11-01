# Text, science and combat leftovers: builder's notes (branch text81) [2026-11-01 15:30]

Approved by Albert, Nov 1, 07:33 ("yes yes yes"), batch D-074 items D and E. Built in `/home/claude/fk-text`, branch `text81`, from main `83928d5`. Not pushed. [2026-11-01 15:30]

## START QC on main, before any change [2026-11-01 15:30]
- Build, wrap, lint, docs check, the whole gate (science, history, tables, saves, moves, palette, words, four phone sizes, baseline): all PASS. [2026-11-01 15:30]
- Planted bugs: 41 of 133 run, all caught, none FAIL. The run was stopped there to free the browser (other builders were running theirs); the full run is the final QC below. The first attempt was killed from outside (exit 144), likely another builder's `pkill`. [2026-11-01 15:30]

## What was built [2026-11-01 15:30]
1. **Aqueduct (D-060).** It houses no one. Fixed: the rules line "Room opens when a House, Apartment or Aqueduct finishes" (now House or Apartment; "an Aqueduct houses no one"), the hint "You are full: Build → House, Apartment or Aqueduct" (now House or Apartment), the Aqueduct's WHY ("More water, more people" → a Game: note that it houses no one and lets an Apartment stand), its card text (dropped "Build 63"). Code unchanged: it gives sickness ×0.8 and lets an Apartment stand. [2026-11-01 15:30]
2. **Plague (D-061).** Clean water, Sewers and Quarantine each multiply the SIR spread β (`fx spread`), from one home, `MEASURED` at the top of `04-rules-tech.js`: water e^(−0.126) = 0.882, sewers e^(−0.123) = 0.884, isolation 0.6. Together ×0.468 (fxv multiplies). Clean water loses its invented "sickness half as often" (`sick ×0.5`); Sewers loses "plague 40% less" (`plague ×0.6`). The rules line now says each and that they multiply. Stone granary's card said "Plague spreads half as fast" but its effect is fewer cases brought in: now "Plague brings half as many cases." The sickness line said the sick work and fight at 60%; the code has work at half, fight at 60%: corrected. [2026-11-01 15:30]
3. **Weather glass (D-062).** Replaces the forecast-only effect: fields give ×46,625/42,300 = ×1.102 (`fx crop food`). Still needs Weather signs, which alone tell the sky a minute ahead. The sickness half of the answer is not built (see below). [2026-11-01 15:30]
4. **Charcoal burning (D-063).** Its age is the Foundry's (Medieval, N12); a weight-5 step of that age costs 440 in 52 s (the median of its 13 peers, split 260/180, as Wagons at the same building). Now 260 food, 180 wood, 52 s (was 170, 110, 38 s, a Bronze price). [2026-11-01 15:30]
5. **Ice (D-064).** Horseshoes (`#mounted`) and Crampons (`#infantry`, `#civ`, `#siege`) set a flag `studs`; the ice's friction becomes max(μ_ice, 0.28). A slip is the existing logistic on need − μ (Hanson et al. 1999). Each device is on its own contact (hoof, boot), so they never add: a horse with both is a horse with Horseshoes. No immunity: 0.28 is close to the needs (foot 0.20, horse 0.25, siege 0.30). The shortened stride on ice now scales with the share of grip still lacking (design). Before: each step cut the need by half and the two added to a need of zero for horses. Helpers in `37-events.js`: `needOf`, `studded`, `iceMu`, `strideShare`. Villagers' forage estimate now reads their own keys (`unitKeys('vil')`), so Crampons count for them. [2026-11-01 15:30]
6. **Text.** [2026-11-01 15:30]
   - F2: "The screen" rewritten from the live code (bar, strip and what each strip cell opens, the row's three pages and the cycle button, Emergency, Home), page names read from `ROW_WORD`. [2026-11-01 15:30]
   - F3: the upgrade list is generated from the research table (`tierLines`): adds Halberdier, Rider scout and the six elite ranks. [2026-11-01 15:30]
   - F4: `techWhy(id)` reads `WHY['tech:' + id]` first; the Legion research and the Roman Legionary now have separate lines (card, Guide, `tests/history.py`). [2026-11-01 15:30]
   - F5: seven chronicle and milestone lines trimmed to 10 words; six chronicle lines shortened again to fit the 375 px preview (the gate found them once `words.py` read them). `tests/words.py` now reads NEWS and each milestone's first line, and templates in EV_TEXT. [2026-11-01 15:30]
   - F6: all twelve provable errors corrected against opened sources (list under Sources). [2026-11-01 15:30]
   - F7: three of about a dozen looked up: Weiyang's 14 km walls (confirmed, kept), Vitruvius (corrected: reached Florence from St Gall in 1414), insulae plumbing (softened to what the source says). The rest are below under "Not done". [2026-11-01 15:30]
   - F8: the elite template takes a written plural (Elite crossbowmen, Elite horsemen, Keshig guards); each elite has a real date (27 BC, 13 BC, about 480 BC, 1203, about 300 BC, 1352) and the four outside the Medieval span carry a Game: note, so `tests/history.py` checks them. History now fails a step with no readable date unless it is dated by its own era name. Keshig corrected to 1203 and "sworn followers"; the Apple-bearers line to Herodotus 7.41; the Praetorians to 40 BC and 27 BC. [2026-11-01 15:30]
   - F9: the hand-copied numbers read their tables: house room, hunger 75%, break point 30%, the year's minutes, the wagon's joiners, the rebellion's share (new `VASSAL.rise`, used by the code too), three quarters and 4 minutes, Medicine's 50%, the computers' nerve (from `PLAYERS` and `PERS`), the School's seats, the harvest odds, Hard's think rate. The comments that claimed "cannot drift" now say what is true. [2026-11-01 15:30]
   - D16: the two teach entries of one age (horse archer to cataphract, ram to catapult) deleted; `teachTo` already refused them, so play is unchanged. [2026-11-01 15:30]
7. **Combat.** [2026-11-01 15:30]
   - C11: the drop-off stashes the load as carried (two places); the workshop path also counts `st.got`. [2026-11-01 15:30]
   - C12: a computer's spy on the look-out returns between its 15-tick checks instead of walking home. [2026-11-01 15:30]
   - C15: one `workMul` (sick, hunger, circus, starving) for every worker, the shepherd included; a fisher whose dock is gone leaves the fish (the 20-tick leave test); the loss that shakes nerve is a circle of `MORALE.lossR`, not the grid's box. [2026-11-01 15:30]
   - C16: muster prices read `unitCost` (discounts count); hiring checks `armyRoom`/`armyFull`; research, training and muster share `shortest` (08-core), so research takes a free line. [2026-11-01 15:30]
8. **Tests.** New `tests/text81.py` (in the gate), plus checks in `tests/science.py` (studs on ice), `tests/tables.py` (N10 block rewritten for D-062), `tests/history.py` (dates), `tests/words.py` (NEWS, milestones). 24 new plants in `tests/handoff.py`, each run alone and caught; two old N10 plants (the two-minute forecast, which no longer exists) were rewritten to plant bugs that still can happen with one minute, both caught. Every new check fails on main (main has none of the names or values). [2026-11-01 15:30]
9. **Fingerprint.** Accepted with its reason (logged by the gate in `docs/5 Builds/v80/CUTS.md`). Shares: each change reverted alone, then the fingerprint run: C11 reverted alone gives the baseline exactly (100% of the change); C12, C15, C16 reverted each leave the new fingerprint (0%); the research changes do not reach the 5-minute script (none of those steps are taken in it). [2026-11-01 15:30]

## Sources: what was opened, the figure taken, how it maps [2026-11-01 15:30]
- **Alsan & Goldin 2019**, *JPE* 127(2), "Watersheds in Child Mortality" (Goldin's site PDF, opened): water alone ("ignoring the role of sewerage") −12.6 log points of child mortality, sewerage alone −12.3 (p. 603); together −26.6 (p. 589). Mapping: deaths per case unchanged, so cases fall by e^(−b); with S ≈ N, new cases ≈ β I, so β × e^(−b). The two singles multiply to e^(−0.249) = 0.780, near the joint 0.766, so multiplying matches the study. [2026-11-01 15:30]
- **Cutler & Miller 2005**, *Demography* 42(1) (abstract on PubMed and the authors' erratum, opened): Table 5 joint filtration and chlorination effect on typhoid −0.25 log points. Used only as a cross-check (same size as Alsan & Goldin). Their shares of the decline were lowered by the erratum (41%, 59%, 48%); not used. [2026-11-01 15:30]
- **Bootsma & Ferguson 2007**, *PNAS* 104(18) (PMC full text, opened): the most effective cities cut transmission "by up to 30–50%"; mapping R = β/γ, γ unchanged, β × 0.6 (the middle). [2026-11-01 15:30]
- **Markel et al. 2007**, *JAMA* 298(6) (abstract, opened): earlier and longer interventions go with lower peak and total death rates (Spearman correlations). No figure taken. [2026-11-01 15:30]
- **Rosenzweig & Udry 2013**, NBER w19334 (PDF, opened): forecast-responsive farmers' mean profit R46,625 against R42,300 (p. 21); responders do worse when rain is bad (p. 24). Mapping: fields ×1.102. [2026-11-01 15:30]
- **Ichihara & Mizoguchi**, "Skid Resistance of Snow- or Ice-Covered Roads", HRB Special Report 115 (TRB PDF, opened): studded tyres on snow or ice 0.279 at −5 °C and below (0.320, 0.436 nearer 0); the scan is poor, the lowest bin taken. Mapping: μ of iron studs on ice, 0.28. [2026-11-01 15:30]
- **Hsu et al. 2016**, *Ergonomics* 59(5) (Salford repository, opened): bench COF of winter boots, wet ice 0.08, dry ice 0.20: confirms the game's `ice0` 0.08. **Fekr et al. 2021**, *IJERPH* 18:405 (PDF, opened): plain boots on wet ice 0.03–0.09, grit outsoles 0.15–0.26. **Leskinen et al. 2010**, ORP conference (opened): wet ice, 0 of 6 slipped in studded shoes, 4 of 6 in plain winter shoes (consistent with 0.28, not used as a number). [2026-11-01 15:30]
- **History (F6, F7, F8), opened:** Wikipedia: Sawmill (Hierapolis sawed stone, late 3rd century); Greek and Roman artillery (Dionysius' engines non-torsion; torsion first recorded at Tyre 332 BC); Battle of Morgarten (halberds; the pike later); List of aqueducts in Rome (ten by Trajan, the Alexandrina 226); History of crossbows (13 BC list: 537,707, 11,181 imperial); Royal Road (nine days; Darius improved older roads); Ōdai Yamamoto I (pottery about 16,500 BP); Cohort (the cohort replaced the maniple, 107 BC); Tercio (first 1534; Rocroi 1643; "reputation of invincibility"); Hittites (the iron monopoly "increasingly contested"); Battle of New Orleans (8 Jan 1815; Ghent 24 Dec 1814; ratified 16 Feb 1815); Lapphyttan (about 1150–1350); Kheshig (1203, sworn followers, grew to 10,000); Praetorian Guard (40 BC garrison, 27 BC designation); Insula (running water; upper floors "could have had" piped water at Ostia; Augustus' 70-foot limit). livius.org and Herodotus 7.41 (ellopos.net): golden apples and pomegranates on the guards' spears. EBSCO: Weiyang Palace, 14 km of walls, completed 200 BC. westernciv.com: Vitruvius found at St Gall, in Florence 1414. [2026-11-01 15:30]
- **From memory, not opened:** Anderson, Charles & Rees (2022) on smaller filtration effects (named in SCIENCE.md as from memory, not used); Cynoscephalae 197 BC (kept from the old line); "best paid in the army" (kept). [2026-11-01 15:30]

## Decisions for Albert [2026-11-01 15:30]
1. **Weather glass does not do what answer 5 said.** The opened study measures a higher average (+10%), and finds forecast users do *worse* in bad rain years. So I built the average gain on fields, not a cut in bad weather's toll. Keep this, or something else? The sickness half (cold and wet) has no opened figure and is not built. [2026-11-01 15:30]
2. **Quarantine 0.6 or 0.675?** 0.6 is the middle of the best cities' 30–50%; Bootsma's own typical case is 32.5% (×0.675). [2026-11-01 15:30]
3. **Water and sewers act on all sickness, not only plague.** The study is child mortality, mostly waterborne. Clean water now cuts 12% of the spread instead of halving the arrivals: much weaker than before. [2026-11-01 15:30]
4. **Ice values are an analog.** No opened study measures a stud on a hoof or a medieval crampon; studded tyres (0.28) stand in. A better source would replace one number. Crampons now reach villagers and siege crews, not riders' horses; Horseshoes reach anything `#mounted`, elephants included (as before). [2026-11-01 15:30]
5. **D16:** I deleted the two dead lessons. Alternative: retarget ram → trebuchet (a later age), which would change play. [2026-11-01 15:30]
6. **The Aqueduct's own sickness ×0.8 and Waterworks' ×0.8** are numbers without a source, and with the Clean water step they count water twice. For the research-truth audit. [2026-11-01 15:30]
7. **Stone granary's plague ×0.5 and Inoculation's ×0.3** have no source either (not in this batch). [2026-11-01 15:30]

## Not done [2026-11-01 15:30]
- F7: still unchecked: Tempering dated 1200s, the heavy plough's "population doubled", the foundry's wood ratio, dolerite wedges, the 10,000-year baskets, the contested claims stated as settled (Ishango, Nagashino volleys, Theophrastus, the Olympic truce, Babylon's eclipses), Sun Tzu's and the counterweight's dates, Dupuy's range. [2026-11-01 15:30]
- The sickness part of D-062 (no source). [2026-11-01 15:30]
- `docs/4 Now/Owed.md`, `Handoff.md` and the Decision files are not updated (the merge does that); the CUTS draft is below. [2026-11-01 15:30]

## Balance (4 seeds × 30 min, before = main 83928d5, after = this branch's code at 14:55; later edits were text only) [2026-11-01 15:30]
| | before | after |
|---|---|---|
| Bronze, Classical, Medieval (median min) | 5.7, 9.4, 19.2 | 5.7, 9.9, 19.4 |
| sides reaching Medieval | 7 of 16 | 4 of 16 |
| sides that fell | 0 | 1 (at 29.5 min) |
| wins by seat | 1: 1, 2: 2, 3: 1 | 0: 3, 3: 1 |
| villager-seconds blocked (median a game) | 16 | 70 |
| idle, no work found (median) | 42 | 181.5 |
| waiting at a workshop (median) | 236.5 | 73.5 |

Read with care: four seeds. Two signals for Albert before live: fewer sides reach Medieval (7 → 4), and villagers stand idle or blocked far more (42 → 181, 16 → 70). Suspects, untested: the fisher who leaves when no dock is in reach (C15) and the shepherd who stops while the side starves (C15); Charcoal's higher price is a Medieval step and cannot explain Classical. Owed: a 20-seed run, and the same run with C15's fisher rule reverted. Raw: the session scratchpad, `text81/before.json`, `after.json`. [2026-11-01 15:30]

## Final QC [2026-11-01 15:30]
QCRESULT

## Draft for CUTS.md [2026-11-01 15:30]
- Aqueduct (D-060): the text says it houses no one; the room line and the full hint no longer name it. [2026-11-01 15:30]
- Plague (D-061): Clean water `sick ×0.5` → `spread ×0.882`; Sewers `plague ×0.6` → `spread ×0.884`; Quarantine `spread ×0.5` → `×0.6` (Alsan & Goldin 2019; Bootsma & Ferguson 2007). Cut: Clean water's halving of arrivals (no source). Stone granary's card corrected to what it does. [2026-11-01 15:30]
- Weather glass (D-062): `forecast +1` → fields ×1.102 (Rosenzweig & Udry 2013). Cut: the two-minute forecast. [2026-11-01 15:30]
- Charcoal burning (D-063): 170 f, 110 w, 38 s → 260 f, 180 w, 52 s, its age's price. [2026-11-01 15:30]
- Ice (D-064): `ice` a 0.5 (Horseshoes, Crampons, adding to no slips for horses) → `studs`: ice μ at least 0.28, each on its own contact. Cut: the additive need cut. [2026-11-01 15:30]
- F2 to F9, D16 as listed above; cut: the two same-age lessons (D16). [2026-11-01 15:30]
- C11, C12, C15, C16 as listed above. [2026-11-01 15:30]
- Tests: `tests/text81.py`; 24 plants; two N10 plants rewritten. Fingerprint accepted: C11 is all of it. [2026-11-01 15:30]
