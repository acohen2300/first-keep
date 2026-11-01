# Cold review: combat80 (merged to main at 5537493, HEAD 4bec211)

Checked against `git diff e4d0c82 combat80` and the merged main. I ran `build.py` (no change to the tree), `lint.py` (exit 0) and `combat.py` (PASS), plus my own probes of the built page (scripts in `scratchpad/probe/`, and a build of e4d0c82 in `scratchpad/base/` for comparison). I did not edit, commit or push anything.

## Ranked findings

### 1. BLOCKER: C1 makes the Natives' traps a foe to their own allies
- `src/08-core.js:382`: `wildFoe = owner === WILD && !x.native && !x.citadel`. The pits and nets the Natives lay (`38-natives.js:133` `trapAt(WILD, …)`, called from `layTraps`) have neither flag, so `isFoe(o, trap)` is true for every side, even one at peace or allied with the Natives.
- Probe: allied with the Natives, `isFoe(0, pit)` = true, `nearestFoeBld(0, ram)` = the pit, and a ram near a causeway did 63.75 damage to the pit in 10 s. Before the batch, `atWar` gave false here.
- This breaks C1's rule that the Natives follow relations. Other parts of the code still answer by relations for the same trap (`trapsTick` uses `friendly`, the danger map's buildings at `09-nav.js:300` and `findBlocker` at `09-nav.js:486` use `atWar`), so the trap now gets two different answers.
- Root cause: `wildFoe` is a list of exceptions on the owner. A test on the kind (the `animal` tag plus the outlaw kinds) would match N4's own principle ("test the kind, not the owner") and would not miss the next WILD object someone adds.
- Not tested: `combat.py`'s C1 check covers units only.

### 2. SHOULD FIX: item 5's "own spot" is not where the villager stands, and the test cannot see it
- `src/06-rules-tuning.js:160` `ARRIVE = 9` is larger than the lattice gap `SEARCH.gap*FOOT = 7.95` (`13-sim-civil.js:72-74`). A villager with no hunt or target counts as arrived within 9.5 of its spot (`09-nav.js:649`).
- Probe: 50 villagers sent to one point all got distinct spots, with a disc radius of 28.7 (the theory gives 29.5). After they arrived, they stood on average 8.3 from their own spot, and 38 of the 50 were nearer another villager's spot than their own.
- What the player sees is still acceptable: `pushApart` (8) spaces them, the closest pair is 8.0 apart, and nothing trembles. But the claim "each its own spot" is not true on the ground. The half-gap occupancy test in `takeSpots` (`:110`) also reads where units stand, not their spots.
- Personal space now has three numbers: gap 7.95, push 8 (hand-typed in `16-sim-fight.js:153,161`) and ARRIVE 9. That breaks "one home per number".
- `tests/combat.py` (item 5) allows `ARRIVE + 3 = 12`, more than one spot spacing, so a villager on the wrong spot passes.

### 3. SHOULD FIX: "one shared spot system" is only partly true
- Soldiers sent to a tapped point get their slots from `formUp` (`12-sim-core.js:246-266`), which moves blocked slots with `freeNear`. That is a second spot system, and it does not check occupancy or claims.
- The builder's reading (keep the battalion shape) is reasonable for the shape. But Albert asked for one system, so the right build is the formation's slot positions fed through the same `takeSpots` filter (open ground, same side of water, unclaimed), not a separate one.
- Other random offsets remain: idle villagers by the Town Center (`13-sim-civil.js:287`), priests and medics (`14-sim-troops.js:83,92`), the Emergency ring (`40-emergency.js:128`) and escorts (`14:386`). Only the first is close to item 5's wording. Albert should be told these remain.

### 4. SHOULD FIX: C1's side effects at peace were never balance-tested
The 4-seed balance run used the default war with the wild (regard 20 < 40), so none of the following was measured:
- **Danger map** (`09-nav.js:292`): wolves and bandits are now stamped for sides at peace or allied with the Natives (only meat animals are skipped). `bestNode` drops unsafe finds (`12-sim-core.js:673`), so finds near wolf ranges become unworkable for a peaceful side. This is an economic change Albert will not expect from "wolves are hostile".
- **Shelter** (`13-sim-civil.js:174`): villagers stay inside while any wolf or bandit with `thr` is within `SHELTER.clear`. A wolf loitering near the Town Center can keep them in.
- **Emergency** (`40-emergency.js:37`): `threatDir` now aims the Town Center's ring at the nearest wolf within 700, where before it aimed at the middle.
- **Huddle** (`39-huddle.js:21-25`): counts every WILD unit with `tick === 'wild'`, the passive vagabond included. This is not filtered by `thr`.
- Villagers flee packs of three or more, and the one a wolf hits flees too.
- All of this is the at-war behaviour carried over to peace, and it follows from the C1 rule. But the builder's Decision 4 calls it "the same as the default". That is true only for sides that have not reached peace with the Natives. It needs a peace-with-Natives balance case before going live.

### 5. SHOULD FIX: item 6 sends a batch of waiters to the same animal
- `17-ai.js:298-309`: `forage` counts no crowd for a hunt (`12-sim-core.js:603`, `others = 0` when `n.hunt`), and item 6 bumps `wk` only for finds.
- Probe: 12 waiting villagers, one `think`: 8 were sent to the same deer (id 989), the other 2 to bushes. They recovered (no blocked seconds in 90 s), but it wastes walks, and every waiter is moved in one think.
- The search also ignores reach. The probe has no `was`, so it scans the whole map with straight-line distance and no `NAV.comp` check, and picked finds 250 to 280 away. On seed 7 every find was in one component, so I could not show an unreachable pick, but nothing prevents one.

### 6. NOTE: item 6, thrash, cost and the player
- **Thrash:** on seed 3 over 12 minutes, item 6 moved 3 villagers, none back to its previous job, and only 3 waiting villager-seconds were left. The computers' overall job churn was 444 changes before and 588 after (203 and 260 back-and-forth within 60 s). Most of that churn was there before the batch (the job-mix code at `17-ai.js:291-295`), and item 6 is not its main source.
- **Cost:** about 0.5 to 0.7 ms per waiter per `think` on desktop after warm-up (the first call took 9 ms per waiter), because each waiter runs 5 whole-map `bestNode` scans over 2,023 finds. This happens once per `react` (1 s normal, 0.5 s hard) per computer, not per tick. On a phone with ten waiters at once, expect a 20 to 50 ms hitch.
- **The player:** item 6 never touches the player. `think` runs only for `p.id && p.id !== WILD` (`12-sim-core.js:156`).
- **Balance caveat:** `tests/balance.py:28` drives seat 0 with `think` too. The fall in idle time (1,329 to 211) therefore includes seat 0 acting like a computer, and the human player's idle time is unchanged.

### 7. NOTE: blocked villager-seconds 6.5 to 25.5 is unexplained
- The builder says moved villagers walk to farther finds and some stand blocked. I could not reproduce this: the 8 co-hunters in finding 5 had 0 blocked seconds over 90 s.
- The difference is 19 villager-seconds in a 30-minute game with about 40 villagers per side, around 0.03% of villager-time, from 4 chaotic seeds. Treat it as noise until a 20-seed run, or a trace of which villagers are blocked and why, says otherwise. The builder's explanation is unverified.

### 8. SHOULD FIX: tests that cannot fail, or that test the code against itself
`tests/combat.py`:
- **Item 5 arrival:** the tolerance is 12 against a spacing of 7.95 (finding 2).
- **takeSpots filters:** the off-map margin, `blockedCell`, the water and wall component check, the half-gap occupancy check and claims across separate `postTo` calls have no check and no plant. Every check uses open ground, so turning any filter off would pass.
- **Item 6:** the check recomputes the code's own argmax over `bestNode`, so it proves the code agrees with itself. Nothing checks "never the player", "no back-and-forth" or the crowd at a hunt.
- **C1:** only `nearestFoe` and `nearestFoeBld` are checked. Nothing covers the danger map, huddle, Emergency, villager fear, or Native buildings and traps (finding 1).
- **C9 petard:** the check reads `by` only. It never shows the plunder being paid.

`tests/handoff.py`, the 14 plants: each one targets a line that combat.py exercises, and each plant mirrors the old code, so they are real. But there is none for the gaps above.

The C6 save step `41` is not tested anywhere: `tests/saves.py` covers only step 40. I ran it by hand and it is right (see the C6 item under "Verified").

### 9. NOTE: an exit with a full outline lands inside the building
- `13-sim-civil.js:183-190`: with every outline spot claimed, `stepOut` leaves the unit at the building's centre, on a blocked cell.
- Probe: it then walked out to a post 140 away within 15 s, so it does not get stuck. But "collide frees it" (Combat Notes) is the wrong reason: `collide` only pushes units apart, and pathing does the freeing. This is a fallback, and RULES §0 says no patches.

### 10. NOTE: per-tick cost of `takeSpots`
- The half-gap test is `G.units.some(...)` for each candidate spot (`13-sim-civil.js:111`), O(spots × units).
- Measured: 0.42 ms a call on a Town Center outline with about 490 units and free spots, 0.04 ms when every spot is claimed.
- `waitAt` retries every tick while it has no spot. If the outline is free but stood on (soldiers parked round the Town Center), 20 waiters cost about 8 ms a tick.
- There is no infinite loop: all loops are bounded by N, at most 529 lattice points (`LATTICE` R = 12, hand-typed).
- Using `unitsNear` instead of the full unit list would remove the cost.

### 11. NOTE: smaller points
- **Sort comment** (`13-sim-civil.js:99` in the diff): it says ties go "to the lower spot, then the earlier unit". The stable sort over unit-major insertion gives the earlier unit first. It is still deterministic: no dice, `Array.sort` is stable, and the lattice is sorted by rounded distance then angle.
- **Point spots and outline claims:** spots round a point never check a building's claimed outline spots (different keys), only units standing there. A tap beside a drop-off can put a post on a waiter's claimed but empty spot.
- **Tap on a blocked cell:** if the tapped cell is blocked, `cm` is 0 and the water filter is off.
- **Hand-typed numbers:** `p.x < 8 … MAP - 8` (`13-sim-civil.js:110`), `LATTICE` R = 12, and `i % LATTICE.length` in `spotAt`, which never wraps because `takeSpots` stops at N.
- **C8:** the convert check covers the phone ceiling (`clsMax`) but not housing (`capOf`). That matches C8 as written ("army ceiling"); say so to Albert.
- **Combat Notes:** they still say "Save shape 40 → 41 (`MIGRATE[40]`)". On main the step is `41` (shape 41 → 42), and `MIGRATE[40]` is the research step.
- **Preview saves:** a save made by the combat80 preview alone (shape 41 with `routAt`) would load on main as if it came from the research build and skip the Printing fold. This affects local preview saves only.
- **Native ambush** (`16-sim-fight.js:68`, builder's Decision 5): with N4, a Native's blow now lands at ×1.3 anywhere off the island, against 0.65 before. That is double, and it is a larger change than "Natives at full strength" suggests. Albert should see the number.

## Verified as built
- **isFoe as the only test:** `isFoe` is used by strikes, `nearestFoeBld`, the held target and focus, villager fear, shelter, the danger map's units, huddle and Emergency. The `atWar` calls left in the sim and AI are relations between sides (spies, sabotage, priests, gates, building orders, the AI's war plans, the morale odds at `14:233`, which count only soldiers, where `atWar` and `isFoe` agree). They give the same answer as `isFoe` for every object except the traps (finding 1).
- **C4/N4:** the attacker's kind is tested (`hasTag(a.kind,'animal')`, `16-sim-fight.js:30`) for both the half strength and the nerve. Only wild kinds carry the `animal` tag (deer, boar, wolf, bear, bison, direwolf, dragon), so no player unit is affected. The `o === WILD` left at `16:51` is the meat-animal rule and is correct.
- **C2:** correct. `unitsNear` skips the unit itself (`15-sim-spatial.js:197,209`), so it is not counted twice.
- **C3:** correct. It starts from `t.fx` and `t.fy`, and `fx` is always set (`10-world.js:799`).
- **C5:** the nerve is drained after armour, formation, flank and roof.
- **C6:** the save step `41` computes `routAt = routT − MORALE.rout × (engage ? 0.5 : 1)`. That is the exact inverse of the old `routT = G.t + MORALE.rout × factor`. Run by hand on a v40 save: 100 → 96 with Engagement and 100 → 92 without (rout 8), and v40 → v42 runs through both steps.
- **C7:** comment only; the numbers match the τ ln 10 and τ ln 50 maths.
- **C8:** built as agreed (the Native flag is cleared and the ceiling is checked).
- **C9:** one reach for soldiers and the wild, and `closeIn`'s stop matches `moveTo`'s building arrival (`gap ≤ max(6, rng)`, hit at `rng + 2`). The petard splash records `by` and `byT`.
- **Item 5, the hex ring:** distinct spots for 50 villagers, radius as the formula predicts, spots off the map and in blocked cells skipped, and the water side checked through `NAV.comp`. A corner tap got 20 spots and no fallback.
- **Item 5, determinism:** no dice; stable sorts.
