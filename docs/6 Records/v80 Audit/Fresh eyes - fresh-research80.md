# Cold review: research80 (9ebb3a1 on 0abb080)

What I ran: build.py and lint.py were clean. tables, science, saves and history all PASS. I ran all 12 new planted bugs myself on a copy: each one was found once in the source, the build stayed clean, and the named test failed with the expected message. I also ran the 5-minute fingerprint script with extra probes to check which research and finds it reaches. I did not run the gate, the soak or balance.

## Ranked findings

1. **should fix (ask Albert)**: `src/04-rules-tech.js:201-202`, N9, Sickles `k: ['farm', 'bush']`, "Fields and bushes".
   Albert said "No, fields and mines only." Bushes are neither. The bush comes from Claude's own write-up of N9 in the Decision Record ("fields and bushes (tags farm, bush)"), not from Albert. The builder followed the card's text and kept bushes. Builder decision 3 then offers to spread bushes to the whole line, which goes the opposite way from what Albert said. Read strictly, Albert's answer means `k: 'farm'` and the card says "Fields yield 10% faster."
   Today bushes get x1.1, where before they got x1.67 from the whole line. Either way it needs Albert's word.

2. **should fix**: `src/04-rules-tech.js:2306`, Weather glass "The next sky is told a minute further ahead."
   Weather glass needs only `science` (its line comes after Crampons). It does not need Weather signs, which is at the School. So a side with Weather glass and no Weather signs gets `forecast a = 1`, a one-minute lead. That is exactly what Weather signs alone gives, not a minute "further". The card is false in that case, which is the N14 principle. Fix by adding `need: ['weathersigns']`, or by making the card say what it does alone.
   The rest of the effect is real, wired and bounded:
   - `37-events.js:585-590`: `lead` is at most 2. The list is filled to `max(1, lead)`.
   - With no forecast, the dice are drawn in the old order.
   - Each change is told once, `lead` minutes ahead.
   - The old `next` field migrates (`34-save.js:127-130`), and the load merges with `blankClim` (`34-save.js:471`), so `ahead` always exists.

3. **should fix**: `src/34-save.js:126`, MIGRATE[39] refund of a queued Printing order.
   It calls `addRes` directly. `cancelOrder` (`11-orders.js:41-48`) uses `payBack(p, paid, 'research')` and also does `p.spent -= sumCost(paid)`. So the refund never reaches the ledger, and `p.spent` stays inflated by 910. `p.spent` feeds the tech score (`16-sim-fight.js:308`). `tests/saves.py` only checks `res.g`, so this passes.
   Smaller issue, same step: a side that had Printing press but never researched Printing now gets the full 0.68, a free x0.85. That is probably acceptable, but it is unstated.

4. **should fix**: CUTS.md was not touched (`git diff --stat` shows no CUTS.md).
   CLAUDE.md says "every cut logged in CUTS.md". This batch cuts the Printing step, the "Hold ground" Rules entry, the formula sentence and its Rules twin, and Weather glass's cold/wet cut. The entry is only a draft at the end of the Research Notes. It must be logged before merge.

5. **should fix (tests)**: weak or text-only checks.
   - `tests/tables.py:41-42` (N10): it only counts `clim.ahead.length`. It never checks that the warning is actually told (the `news` condition at `37-events.js:589`), or Weather glass without Weather signs (finding 2). A broken condition or wrong index would pass.
   - `tests/tables.py:61-62` (ground marks, pausing): these only fail if the old false sentence comes back word for word. The builder admits this. They cannot catch any other wrong wording.
   - `tests/tables.py:47` (Armed caravans card): `desc.includes(String(A.dmg))` matches any "4" in the card's text.
   - `tests/saves.py:40`: does not check `p.spent` or the ledger (finding 3).
   - All 12 new plants do plant and are caught (confirmed by my own run).

6. **note**: N14 scope.
   N14 named six lines. The diff also changes F10 items: the "Hold ground" entry cut, the troll, the shrine, the heavy-blows list now generated from data, the Market line ("research raises it to 100%"), the vassal investment list plus `VASSAL.invest`, the Net's Guide row, and the Oiled cloaks text ("Blizzards"). It also widens the Mint and Mali keys. The record's batch 7 says "group F per N14", so this may be covered. Confirm that Albert's yes covers more than the six lines.
   The generated texts read correctly: "cataphract, war elephant, bombard or trebuchet"; "house 1; farm, pasture 2; ... castle 20; any other 3".

7. **note**: the Aqueduct room line (`07-text.js:775`) and the plague line (`07-text.js:1065`) were not touched, as agreed.

8. **note**: Charcoal burning (`04-rules-tech.js:154-163`) is now age 3, read from `BLD.foundry.age`.
   - Its prerequisite in the Carpentry line is still Timber framing (age 1).
   - Wagons still comes after it, both in age 3, as before.
   - Nothing lists it in `need`.
   - Its price is still the Bronze-age 170f 110w, 38 s, against Wagons at 260f 180w, 52 s in the same age. The builder flagged this. It is a balance call for Albert.

9. **note**: leftover Printing references.
   - None in `src` (apart from the migration), PERS/17-ai research lists or tests. No step's `need` names a removed id (checked with node).
   - GUIDE.md still lists Printing, Printing press at 20%, Charcoal in Bronze, Weather glass's old cold/wet effect, Oiled cloaks "Rain" and the old Armed caravans text.
   - The builder's reason ("no tool here to write it again") is wrong: `guideMd` is exported (`41-boot.js:226`), and RULES.md:113 says GUIDE is written with `F.guideMd()`. But GUIDE.md is labelled the Build 70 snapshot, so whether to rewrite it is Albert's call.

10. **note**: N10 formula. `insulate = 1/(1+a)` (`12-sim-core.js:16`) matches the decision.
    - Both readers of `cold` and `wet` (`sideSpd`) changed. There are no other readers, and the mission clocks read `sideSpd`.
    - Wool cloaks and Oiled cloaks at `a: 1` still halve the toll alone.
    - Horseshoes plus Crampons still add to `a = 1` on ice for riders (09-nav:622, 37-events:671), which means no stride loss. This is flagged in the builder's notes and is left open.

11. **note**: the caravan attack values are the same as before (`armed: { dmg: 4, rng: 24 }`, `02-rules-units.js:71`; read at `13-sim-civil.js:587-589`).
    The card says the guards "hit back", but the code strikes the nearest foe in reach once a second whether or not it was attacked. The reach of 24 is not shown.

12. **note**: N9 key rule.
    `nodeKey` (`08-core.js:608`) and `fxFits` (`08-core.js:456`) are one home each, shared by `gatherMul` and `bonusText`.
    - Fish and game lose the harvest line, as decided.
    - The Quarry, Mint and Foundry lose the mining line, as decided.
    - The Mint and Mali bonuses are kept through `'mint'` (builder decision 2).
    - The Felling rows are kept through `treefarm`.
    - The Pasture and Weaver now match only their building kind. No row named wool, cloth or beer, so nothing is lost.
    Risk: nothing checks fx keys. A mistyped or resource-style key (for example the old `'food'`) now silently reaches nothing, which is what the Sickles plant shows.

13. **note**: forecast details.
    - `A[lead - 1]` assumes `lead` is a whole number. A future fractional `forecast a` would produce the warning every turn.
    - The turn the lead goes up, there is one extra dice roll. Same inputs still give the same game, but player 0's research now moves the shared dice stream.

14. **note**: `10-world.js:617-619`. The `START_VILS` loop still places villagers at `(i - 1) * 14` and gives the wood job only to `i === 1`. Both assume 3.

15. **note**: the Research Notes say the final QC ran on b56b0d8. HEAD is 9ebb3a1, an amend that differs only in the notes file. That is fine, but the hash in the notes is stale.

## Fingerprint (item 5)
The builder's claim is plausible and I confirmed it.
- I ran the fingerprint's own 5-minute script with probes. The only research queued by any side is Tally sticks and Hearth (sides 1-3) and Coppicing (side 3). There are no gather steps, cloaks, Weather glass, Charcoal, Printing or Armed caravans.
- Villagers work bushes, trees, stone, gold and one Farm. Nobody works fish or meat.
- Bushes are worked heavily, but Sickles is never researched, so N9 cannot change any number.
- No forecast step means `lead` = 0, so the dice are drawn in the old order.
- `START_VILS` = 3 equals the old loop count.
