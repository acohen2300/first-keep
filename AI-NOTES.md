# Computers batch notes (branch ai81, from wild81 d6bbc07, Nov 1)

Albert approved the batch with "yes yes yes" (Nov 1, 07:33). Locks: D-028 (N6), D-029 (N7), D-030 (N8), D-038/D-039 (N16a), D-068 (answer 10), D-082 (raids follow the robbers). D2 to D5 are from the Decision Record, lines 319 to 338.

## What was built
1. **Answer 10: work by need** (`17-ai` `goalOf`, `needOf`, the jobs block of `think`).
   - **The goal.** Each personality picks one (`PERS.goals`): aggressive army, then age, then building; balanced age, building, army; fortress building, age, army. The next age counts as a goal from the start. Once the town saves for an age, the age is the goal for every personality.
   - **Due purchases.** A house, or a plot the computer wants but cannot yet afford, is added to the goal's cost.
   - **The equation.** For each resource, time to afford t = shortfall ÷ income. Income = hands on it × what each earns now (`forageNow`), less the steady draw: what the store feeds, plus a growing town's villagers (one villager's cost over its training time).
   - **The bottleneck** is the resource with the longest t (Goldratt). A new or waiting villager goes there, to its best free find in reach.
   - **Moving workers.** One worker a beat moves to the bottleneck. It comes from a resource the goal does not need, if that store will not then run out. Failing that, it comes from a resource whose t stays under the bottleneck's after the move (minimax).
   - **Nothing short:** the personality's mix, as before.
   - **What it replaces:** item 6's best-rate pick, and D4's mix (which added the saving gap and cut any store over 600 by 60%).
2. **W6: the famine runway** (`runsOut`, `famineNear`). wild81 did not build it (WILD-NOTES 6).
   - runway = store ÷ (eaten − gathered).
   - lead = ⌈gap ÷ rate⌉ hands moved one a beat, plus the first load (c ÷ rate).
   - runway < lead: food comes first.
   - The same test, with the goal's share held back, guards every resource a worker would leave.
3. **The shift to plots** (`plotPays`, `PLOTS`, `PLOT_AT`).
   - **When:** a field, tree farm, quarry, Mint or foundry is built, or a free one staffed, when R_plot > R_wild and (R_plot − R_wild) × T > its cost.
   - **T** is the time to the bell, or the plot's own life if shorter.
   - **Limits:** one plot at a time, and no more plots than hands on the resource.
   - **Replaces:** the old berry-count and tree-count rules for fields and tree farms.
   - **Cut from the lists:** the quarry, foundry and Mint left the balanced and fortress build lists. Every personality now builds them by the test, the aggressive one included.
   - **Staffing:** a post (quarry, Mint, foundry) is staffed by the same test in `aiEconomy`, for every personality, from the Bronze age.
4. **N7: no flat villager ceiling** (`per.vils` is gone).
   - Housing and the worker limit are the hard limits.
   - A villager is trained while ΔR × T_left > its cost, with ΔR the best free rate from home.
   - The age mark is now 12 + 4 × age, and the army waits for `per.early`.
5. **N8: peace mode** (`armyAim`, `peaceAll`). Reproduced first, in node, on seed 3 with Normal settings: 30 soldiers stood down to 22, and 23 were queued again within 60 s.
   - **The rule:** at peace with every court (no war and no notice running), the army aim is `PEACE.stand.keep` × the ceiling.
   - **One number:** `standDown` keeps the same number (`armyAim`).
6. **N6: the crowns** (`crownsOf`, `warCredit`).
   - **Wealth** = `p.gathered`.
   - **War** = the cost value of enemy people and buildings destroyed (`p.war`). An animal has no cost, so it adds nothing. `p.kills` is gone.
   - **Wellbeing** = people × (1 − sick share) + 8 per place of care + 5 per laurel. `p.health`, which was always 100, is gone.
   - **Sources opened:** 0 A.D.'s `Score.js` (economy = resources gathered + trade; military = the value of enemy units killed and buildings destroyed) and sc2reader's "resources killed". **Age of Empires II: from memory.** The official forum threads I opened give no formula.
7. **N16a: the raid's mark** (`natRaid`, `roulette`).
   - **Who can be marked:** the raided side's villagers and caravans that the band beats, with their guard, by the square law. One is drawn with w = (1 + 2·load/CARRY) ÷ (1 + guard/P_band).
   - **The dice:** seeded. `roulette` is now the one home for weighted draws (the side pick, the mark and the Games).
   - **Who is chosen:** the raiders take the mark as their `aggro`. Computers stay ineligible while 4b is live.
8. **D2:** `firstNeed` researches the first unknown step a wanted step waits on.
9. **D3:**
   - while saving, `aiEconomy` buys nothing;
   - a venture needs gold over the next age's gold + 900;
   - computer caravans buy no spice.
10. **D5:** a save, once begun, holds until the age is bought (`p.ai.save.age`).
11. **Tests:** `tests/ai.py` (in the gate), with 20 plants in `tests/handoff.py`. Every check fails on d6bbc07: run in node against a copy of d6bbc07's src, each item fails by behaviour. Two of them also crash on missing exports there.

## Decisions for Albert
1. **Conquest has no bell, so T_left is open.** In a conquest the payback tests (N7, plots) always pass, and only the rate tests bind. Should there be a horizon (a year?) instead?
2. **The personalities' goal order** (aggressive army first, fortress building first) is my reading of "personality picks the goal". It costs those two some age time; see the balance table.
3. **The raid's guard** is measured as a share of the band's strength, so the weight has no unit. The record's γ·guard used raw strength, which would make any escort an absolute bar.
4. **The War crown** counts the Natives and outlaws at their table cost; most have none, so they count nothing.
5. **The raid with no mark it can beat:** no raid. The old fallback was the nearest drop-off building.

## Rules bent
- The fingerprint was accepted once (see below).
- `tests/combat.py` item 6 still passes: by need, a waiter goes to the bottleneck's best free find, and the crowd and reach rules are unchanged.

## Not done
- (filled at the end)

## Balance
(filled at the end)

## Draft for CUTS.md
- **ai81 (Nov 1):** answer 10 by need, with the shift to plots; W6 famine runway; N7 (no ceiling, payback); N8 peace mode; N6 crowns; N16a raid mark; D2 to D5.
- **Cut:**
  - `PERS.vils` (16, 26, 28);
  - the mix's saving gap, its ×0.4 over 600 and ×1.6 under 100, the food "keep" for winter and the hungry +0.3 (D4, W6);
  - the berry-count rule for fields and the tree-count rule for tree farms;
  - the quarry, foundry and Mint rows of the balanced and fortress build lists;
  - `p.kills`, `p.health`;
  - the raid's drop-off mark;
  - spice on computer routes;
  - three hand-typed roulette loops (now `roulette`).
