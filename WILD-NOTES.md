# Wild notes (branch wild81, from main 66a68a5, Nov 1)

**Mockup (Albert agreed it Nov 1 08:14, "I like it", as a third tab):**
- `mockups/80/Relations Misfits.png`: page two, Misfits (390×844).
- `mockups/80/Relations Misfits - page one.png`: page one, the computers, stance only.
- Built screenshots of both pages: `mockups/80/Relations Misfits - built, Relations.png` and `mockups/80/Relations Misfits - built, Misfits.png`.

## What was built
1. **The wild by kind (answer 1b).** Animals are always everyone's foe. The Natives, outlaws, bandits and robbers each keep their own regard (0 to 100) and their own stance with each side, copying the Natives' flow:
   - bribes raise regard (the Danegeld rule), blows lower it, and it drifts back to 20;
   - at 40 the group leaves you be;
   - at 70 an emissary can make any group a friend (Albert, 11:14). The groups' own logic is v81's.
   - `REGARD` (the shared numbers, moved out of `NATIVE`) and `GANG` live in `05-rules-wild`.
   - Who belongs is `gangOf` (`08-core`). Bandits are bandit and goblin; robbers are robber, skeleton and troll (`UNIT.gang`). The outlaws are the horde (Albert, 11:12: yes). The Natives are their warriors, walls, towers and pits.
   - `isFoe` reads each group's stance (`gangRel`). The guards' look in `wildTick` and the danger map read the same test.
   - Emissaries go to the group's nearest camp (`homeOf(g, from)`). `judgeGang` is the Natives' answer, used for every group.
   - Raids follow the robbers' stance alone (Albert, 11:13). The robbers' regard picks the target.
   - State: `G.gang`. Save shape 42 → 43, with one MIGRATE step: the Natives' regard moves from `G.nat` to `G.gang.nat`, and the dead fields are dropped.
2. **Decision 4b (EXCEPTIONS #15, approved by Albert at 11:13 as an experiment to make the computers competitive).** The Natives and the misfit groups never start a fight with a computer.
   - A camp remembers who struck it for `NATIVE.struck` (60 s) and fights only those units, on its own ground. For the Natives that is `YARD` of the Throne; for a guard, its leash.
   - Raids, the horde and the Natives' pits and nets skip the computers (`calm4b`, the one home).
   - The danger map follows: a guard that would not fight a computer is not danger to it.
   - The player's rules are unchanged.
3. **Relations: Town | Relations | Misfits.**
   - Relations shows the computers, with the stance only.
   - Misfits shows the Natives, outlaws, bandits and robbers, each with a Bribe and a stance; every handshake is live.
   - A picked stance not yet sent reads "Foe → Neutral" in the stance colours; once sent, the line shows the stance alone. On a one-slot Misfits name the change takes two lines; it fits at 375.
   - A dim icon (a vassal's or overlord's row) takes no pick (`stanceOff`, one home for the icon and the verb).
4. **Answer 11.** A conversion refused at the ceiling says "At Maximum Occupancy Capacity".
5. **Answer 12, then decision 5 (Albert, 11:22): no ambush at all.** `NATIVE.ambush` and `natGround` are gone, and nobody gets a terrain bonus. `woodsGrid` is back in the view (it only blocks sight now), as on main. The test checks that a Native strikes the same in the open, on a causeway, at the camp's edge and in a wood.
   - **Owed for v81, not built:** surprise (Dupuy 1.1 to 2.2, fading) and home-ground movement (road against cross-country speed) for everyone.
6. **Decision 6 (Albert, 11:27 to 11:32): hunger and famine.**
   - **Who eats from where:** a villager working food (a bush, a field, fish, meat or game, including on the way to it) eats from that food, not from the store (`upkeepTick`).
   - **An empty store is not a famine.** Work goes on as normal, and the toast says "Food stores empty: put villagers on food."
   - **Famine** (`famT`, `starveTick`) is an empty store with no bush, own field, fish, meat or game in reach (`foodInReach`: the Town Center's region on the walking grid, `regionAt` and `reachFrom`).
     - The toast says "Famine: no food in reach. Two days to recover."
     - People keep full strength for `STARVE.grace`, two game days (240 s); then work and blows fall to `UPKEEP.hunger` 0.72 (`hungerOf`).
     - Under the Famine hazard, a villager then leaves and a soldier deserts every 30 s. Leaving waits until the weakening starts.
     - The old 60 s work stop (`starving`) is gone.
   - **The 0.72** is the Minnesota study's fall in grip strength, 58.2 → 41.8 kg (Keys et al. 1950). I opened it via Hargrove, Heinz & Heinz, *Dynamic Medicine* 7:16 (2008), Table 1. The same table gives the Harvard work test falling 72% (64.1 → 18.1), an endurance measure. Strength is the closer match to a blow and a stroke of the axe; for Albert to confirm.
   - **The computers' food runway** (reorder point) is not built here. Their mix already adds hands to food under two minutes of eating (`17-ai` `keep`). A true runway needs a "time to rebuild food income" this batch does not model, so it goes to the computers builder with answer 10's need logic.
7. **The hunt.**
   - **A #1, Victory sighting 3:** the Games wait for the board's peace. The war branch and `PEACE.games.first` are deleted, and Relations reads "Games at the next peace".
   - **A #2:** the danger disc is stamped by rows. Tested identical to the old disc.
   - **A #3:** a builder bitten by a boar or bear fights back on its own job, then goes back to its site. An order to build drops a hunt (`setJob('repair')` clears `u.hunt`, fresh review #1). A hunter sent to build builds.
   - **A #4:** the wild looks every fifth tick, and at once when the foe it held is lost.
   - **A #5:** the look-ahead runs every tick again, as on main (fresh review #4). Only `gcell` inlined in `lineClear` remains, tested identical to `gcell` on 400 lines, edges included.
   - **A #6:** one `flood`, and a side's buffer is made once.
   - **A #7:** only a spent tree marks the grid dirty.
   - **A #8:** `navOnce` covers the player's wall line and the computers' wall plan.
   - **A #9:** the dead fields are gone. **A #10:** `BEAT` and `every()`.
   - **B #1, Victory sighting 1:** the Chronicle is paged with `pager()`, shared with the Mail.
   - **B #2, Victory sighting 2:** z-tokens, with `#end` on top.
   - **B #5:** the place bar follows `G.place`.
   - **B #6:** Send help is held in place on a wooden building, and the Army card's live lines sit under its buttons.
   - **B #7:** the alarm clocks are saved.
   - **B #8:** the Guide's page is cached.
   - **B #10:** `drawOnce`.
8. **The outside review's four:**
   - the strip lets the sky cell go, not the soldiers;
   - the squad's − and + share one `.duo` cell;
   - `ACT.jump` closes the card;
   - any part of a dim or locked control counts as greyed and glows red.
9. **Albert's sighting (08:13, 08:18; QC D10).** The strip read "z 0" while villagers showed Zs. `freeVil` is now the one idle predicate: no job, or a job with nothing it can do (`u.idle`, waiting with no find in reach). The Zs, the strip's count, the idle button, the quick action, the People ring, `+` on a job (`moveVil`) and `pickVil` all read it.
   - The computers' "a villager with no job yet" (`17-ai`) keeps its own `!v.job` on purpose: their waiting villagers are placed by need just below.
   - `tests/combat.py` item 6 now gives the computer nothing to build with. A waiting villager is idle, so a site would take it first, which made that check unable to fail.
10. **Fresh review fixes.**
    - #1: the bitten-builder blocker.
    - #3: the danger map reads the stance.
    - #4: A #5 is back to every tick.
    - #6: a dim stance icon takes no pick, and the 375 fit check measures a reachable state.
    - #7: 4b tests for the horde, the pits and nets, and the Natives' yard.
    - #8: the woods are view-only again, so the browser and node cannot disagree.
    - #9: the ambush is gone.
    - #10: a computer striking a wayfarer no longer writes into the Natives' memory.
    - #11, partly: only the Natives' stance rebuilds the grid; `groundOf` is worked out only when a camp remembers; `laT` is gone with A #5.
11. **Gatherer caps (Albert, 12:57).**
    - **How many a find holds** (`findCap`, `13-sim-civil`): the working spots on the ring it is worked from, SPACE (3 ft) apart: ⌊2π·WORK_R / SPACE⌋. `WORK_R` is now the one home of the working reach, which was typed as 9 and 13 in the walk.
      - bush, stone, gold, iron, meat: 7;
      - fish: 10;
      - a tree: 1 feller;
      - fields keep their own 1 (`slotsOf`).
    - **Why a ring, not `spotAt`:** a find has no square footprint like a building, so its spots sit on the ring its gatherers stand on. `spotAt`'s square ring gives 8 at the same reach.
    - **The tree** follows OSHA 29 CFR 1910.266(d)(6)(ii): "The distance between adjacent occupied work areas shall be at least two tree lengths of the trees being felled". Opened on govinfo.gov (CFR 2018 edition); ecfr.gov was not reachable from here.
    - **A full find:** the search skips it (`bestNode`). A newcomer reaching it finds every spot held and looks again; one that holds a spot (`u.at`) keeps it. Players and computers alike.
    - **Fingerprint:** unchanged by the caps. The five scripted minutes never put more than a find holds on one.
12. **Item 5 on six seeds** (the map-zones builder's find). Villagers sent to one point passed on seed 7 only. Traced in node: the nearest-first pairing sent the last to arrive across the crowd already standing, and the push held them off for good (each was still walking back every tick, but the pushes won).
    - **The fix, two rules:**
      - a group sent to a point takes its spots in arrival order, the first to arrive on the far side (`takeSpots`, lattice case);
      - two of a side walking to their own spots do not shove each other (`pushApart`), since the spots already keep them SPACE apart.
    - **What did not work:** walking all the way onto the spot and a tighter arrival were tried and did not settle it.
    - **The test:** `tests/combat.py` item 5 runs on seeds 1, 3, 4, 6, 7 and 9, with 2 plants. The fingerprint is unchanged.
13. **Tests.** `tests/wild.py` runs in the gate. Every check failed on main when first written; the later ones (A3b, D1, S1, G1, G2, the 4b extras, H1 to H4, D10) fail by plant.
    - The plants (`tests/handoff.py`): see Checks. Coarse 4b plants now name their own message.

## Measured (node, seed 2, minute 10; before → after)
- `dangerMap`: 45.1 → 4.9 ms a call.
- `compOf`: 2.1 → 0.65 ms.
- One minute of play: 11.5 → 4.9 s. This was measured before A #5 was reverted.

## Fingerprint
Each change was turned off in turn, with node running the gate's FINGERPRINT script; all of them off gives main's baseline exactly. Out of 5 minutes:
- 4b moves 5, and the guards' look through `isFoe` 5.
- The villagers on food eating from it: 5.
- The danger map reading the stance: 4.
- The famine floor: 4.
- A #4: 2.
- A #3, A #7, A #8, the raids by the robbers and D10: 0.

## Balance (4 seeds × 30 min, jobs 1)
| | main 66a68a5 | wild81 (first) | wild81 now |
|---|---|---|---|
| Bronze (median) | 5.7 min, 16 of 16 | 6.1 min, 15 of 16 | **5.3 min, 16 of 16** |
| Classical | 9.4 min | 10.6 min | 10.0 min |
| Medieval | 24.8 min, 7 of 16 | 23.2 min, 9 of 16 | 23.6 min, 8 of 16 (one side to Gunpowder at 29.2) |
| Sides that fell | 0 | 0 | 0 |
| Wins by seat | aggr 1, bal 3 | bal 3, fort 1 | bal 2, fort 2 |
| Blocked villager-seconds (median) | 37.0 | 59.5 | **39.0** (max 93) |
| Idle, no work found (median) | 0.5 | 0.5 | **41.0** |
| Games held | 0 | 0 | 0 |

- **Seed 3's computer now recovers:** Bronze at 9.2 in the browser run (main 14.4; the first wild81 run never left Stone). The bitten-builder fix, the famine floor and food eaten where it is gathered are what changed for it.
- **The blocked rise is gone (59.5 → 39.0).** It came from A #5's cadence, as the fresh review said; A #5 is reverted.
- **Idle rose from 0.5 to 41 villager-seconds a game.** These are the villagers a full find turns away while they search, which is what the caps should do (they stand instead of crowding a find). Worth a look on the 20-seed run that is owed.
- **Raw results:** `scratchpad/wild/bal-before.json`, `bal-after.json`, `bal-after2.json`.

## Checks run
- **START QC on the merge with main (c56d93d):** 210 PASS, exit 0 (all plants caught, `tests/docs.py`, the gate at four sizes, the fingerprint).
- **START QC on the last commit:** FINAL_QC.
- **Every new plant is caught** (scratch runner over `PLANTS`, then START QC).
- **Soak** (`tests/soak.py 1,2,3 20`): 3 of 3 PASS.
- **Lint and build:** clean.

## Decisions for Albert (open)
1. **The weakening number.** Grip strength −28% (×0.72, used) or the Harvard work test −72% (×0.28)?
2. **The Famine hazard.** Its leaving now waits for the weakening, after two days of true famine. That makes the hazard much milder; it bites only when no food is in reach. Keep it as the hazard's effect, or give the hazard something else?
3. **4b and the computers' danger map.** Guards that would not fight a computer are no longer danger to its gatherers, so the computers gather beside guarded finds (in line with 4b).
4. **The arrow on Misfits** takes two lines in a one-slot name (it fits at 375).
5. **The Games** wait for the board's peace. Since the computers are at war from the start, a game may see none.

## Rules bent
- `EXCEPTIONS.md` #15 is now approved (Albert, 11:13).
- The plant "a group's verb is read as a number" is caught as a crash inside the Relations check.
- `tests/combat.py` item 6 now empties the computer's store before its think (see 9).

## Not done / owed
- **v81:**
  - surprise (Dupuy 1.1 to 2.2, fading) and home-ground movement (road against cross-country speed), for everyone;
  - the misfit groups' own logic (friends fight for you);
  - clean water lengthening famine survival, from a cited source.
- **The computers builder:** the food runway (the reorder point), with answer 10's need.
- **Hunt items left:** B #9's spacing, #11, #15, #18, #22; A #11 to #27 except #11 and #12; G.bolts (A #17).
- **Docs:** CUTS.md, PARKED.md and SCIENCE.md are drafts here (docs are the other builder's). The Checks doc and HANDOFF should list `tests/wild.py`.
- **Fresh review #11 left:** the status strip copes with one hidden tally cell only (only Iron hides today); Ransom and Stand down show on both tabs.

## Draft for SCIENCE.md
| Where | What | Value or form | Label | Source |
|---|---|---|---|---|
| `03-rules-buildings` `UPKEEP.hunger`; `36-economy` `hungerOf` | Work and blows after two days of famine | ×0.72 | cited (secondary, opened) | Keys et al., *The Biology of Human Starvation* (1950): hand dynamometer 58.2 → 41.8 kg over 24 weeks of semistarvation (−28%); Harvard work test 64.1 → 18.1 (−72%). Via Hargrove, Heinz & Heinz, "Modeling transitions in body composition…", *Dynamic Medicine* 7:16 (2008), Table 1 (opened Nov 1). The book itself was not opened. |
| `13-sim-civil` `findCap`; `06-rules-tuning` `WORK_R` | Gatherers a find holds | ⌊2π·WORK_R / SPACE⌋: 7 at a bush or a rock, 10 at fish; a tree 1 | design (geometry); cited (the tree) | Working spots SPACE (3 ft) apart on the ring worked from. One feller a tree: OSHA 29 CFR 1910.266(d)(6)(ii), "the distance between adjacent occupied work areas shall be at least two tree lengths" (govinfo.gov, CFR 2018, opened Nov 1). |
| `06-rules-tuning` `STARVE.grace` | Full strength for two game days without food | 240 s | general knowledge (from memory) | The rule of threes (about three weeks without food, with water). The game's two days are design inside it. |
| `06-rules-tuning` `BEAT`; `08-core` `every` | The slow ticks: one period, read by the tick and by its body | slow 10 s, health 5 s, Natives 5 s | design | The result does not depend on the beat (`tests/wild.py` A10). |
| The SCIENCE.md row on `isFoe` (line 76) | The whole wild as a foe | | correct it | Animals always; the four groups by their own regard (`gangOf`, `gangRel`). |

## Draft for CUTS.md
- **wild81 (Nov 1):**
  - the wild by kind (1b) with four groups' regard;
  - 4b (EXCEPTIONS #15, approved);
  - Relations Town | Relations | Misfits, with every group able to become a friend by emissary;
  - raids by the robbers' stance;
  - answer 11; no ambush (decision 5);
  - hunger and famine (decision 6);
  - hunt A #1–#4, #6–#10 and B #1, #2, #5–#8, #10;
  - the review's four; Albert's D10 idle count; gatherer caps per find;
  - save shape 43.
- **Cut:**
  - `wildFoe`; `holdGames`' war branch and its line; `PEACE.games.first`; the Chronicle's fold;
  - `G.yearN`, `G.gamesN`, `G.lost`, `L.coalRisk`, `p.ration`, `p.rations`, the `if (v)` after `addUnit`;
  - the hand-typed `ctx` swaps; `compOf`'s own flood; the bare z-index numbers; the `'bnabout'` fold id;
  - the `#place` writes; the computers' gift slot;
  - `NATIVE.ambush` and the Natives' ×1.3 (decision 5);
  - `starving()` and the 60 s work stop (`STARVE.stop`, `STARVE.leave`);
  - "They take gold, not oaths" (every group can be a friend);
  - the raid's double condition (Natives and robbers).
- **Play fingerprint accepted:** wild81 after the fresh review and Albert's decisions 1-6: decision 4b and the guards' look by isFoe move 5 of 5 minutes; villagers on food eat from it 5; the danger map by stance 4; the famine floor 4; hunt A #4 2. A #3, #7, #8, the robbers' raids and D10 move nothing. All off gives main's baseline exactly.
- **Parked (to PARKED.md):**
  - conversion past the cap: Albert's up to 2% over, against crowding raising sickness by density (answer 11);
  - surprise and home ground (v81);
  - water and famine (v81).
