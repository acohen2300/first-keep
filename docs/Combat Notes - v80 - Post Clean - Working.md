# Combat Notes: v80, Post Clean (Nov 1)

Albert's double yes: Nov 1, 01:17. Branch `combat80`, from main `e4d0c82`. Preview only; nothing pushed.

## What was built

| Item | Rule now | Code home |
|---|---|---|
| C1 | One hostility test, `isFoe(o, x, me)`. Sides follow their relations, and so do the Natives (warriors and citadel). The rest of the wild (animals, bandits, robbers, outlaws, the horde, guards) is a foe to everyone, always. A soldier at peace with the Natives now defends a villager from a wolf it sees, and the horde breaks buildings at peace too. | `08-core` `wildFoe`, `isFoe`; used by `15` `strikes`, `nearestFoeBld`; `14` held target and focus; `13` villagers' fright; `09` danger map; `39` huddle; `40` Emergency |
| N4 / C4 | Only an animal (tested by its kind, `animal` tag) hits at half strength and leaves the nerve alone. Natives, outlaws and the citadel towers hit at full strength and drain the nerve. | `16` `hurt` (`beast`); `MORALE.wild` |
| C2 | A group's strength includes the soldier itself. | `15` `groupPower` |
| C3 | A soldier's facing sum starts with its own facing, so a soldier fighting alone takes a blow from behind as from behind. | `16` `fromWhere` |
| C5 | The nerve drain comes from the damage that lands, after armour, formation and flank. | `16` `hurt` |
| C6 | `routAt` records when the rout began. The 2 s grace (`MORALE.capAfter`) counts from then, and so does the end of the run (`routSecs`). Engagement no longer erases the grace. Save shape 40 → 41 (`routT` becomes `routAt`). | `14` `solTick`, `routSecs`; `34` `MIGRATE[40]` |
| C7 | Comment only (N5). HP(t) = max − (max − HP0)·e^(−t/τ), τ = max/heal. Closing 95% of the gap takes −ln 0.05 = 2.996 τ. A half-dead swordsman (70 HP, heal 3, τ = 23.3 s) reaches 95% of full at τ ln 10 = 53.7 s and 99% at τ ln 50 = 91.3 s. The old comment's 11.7 s was the linear time, 35/3. | `14` `healTick` comment |
| C8 | A converted unit loses its Native flag. A priest cannot convert past the ceiling of the unit's class (`clsCount < clsMax`); with no room, the spell stops. | `14` `priestTick` |
| C9 | Wild attackers measure their reach to a building once. Soldiers and the wild share `reachOf` and `closeIn`. The petard splash records its attacker on each neighbour it hits (`by`, `byT`), so plunder is paid. | `09` `reachOf`, `closeIn`; `14` `wildTick`; `16` splash |
| Item 5 | All spots have one home. `spotAt` covers a building's outline or a hex lattice around a point. `takeSpots` assigns them. A spot is free when it is on open ground, on the point's side of water and walls, unclaimed, and no one stands within half a gap. Units take spots by greedy assignment, cheapest walk first. Villagers sent to a tapped point (`postTo`) each get their own spot: n spots fill a disc R ≈ 0.525·d·√n, d = 3 ft. A unit leaving a building (`stepOut`) takes the nearest free spot on the building's whole outline. All five exit paths use it: a shop, a shelter, a soldier, the Emergency release and Stop. Waiters use the same code (`waitAt`). Seeded dice only; no dice used at all. | `13` `LATTICE`, `spotAt`, `takeSpots`, `postTo`, `stepOut`, `waitAt`; callers in `11`, `14`, `26`, `33`, `40` |
| Item 6 | A computer villager that is waiting (it has a gathering job, is idle, and has no find and no hunt) is moved by the computer's brain to the job with the best free find. Jobs are ranked by the forager's rate R at the best find, walk out included and crowding counted (Charnov's marginal value theorem; decision 1's rate). The player's villagers are unaffected. | `17` `think` |

The equations and sources are in `SCIENCE.md`. These sources were not opened and are marked "from memory": the treaty rule (Vienna Convention art. 34), Olson 1993, Lagrange and Thue on hex packing, Reynolds arrival, and greedy assignment (Kuhn 1955 for the exact form).

Tests: `tests/combat.py`, new, run by the gate. Every check fails on `e4d0c82` (run there with only the exports added) except C7, which by its nature cannot: behaviour is unchanged and only the comment moved. Its check runs the real `healTick` at a hospital (53.7 s to 95%), and the planted linear heal fails it. `tests/handoff.py` has 14 new planted bugs, at least one for every item.

## Decisions for Albert

1. **Soldiers at a tapped point keep their battalion shape.** `formUp` already gives each soldier its own place in a line, column, wedge or square, so item 5's disc is for villagers only. Priests and medics still stand by their random offsets. Say if they should take spots too.
2. **A conversion at the ceiling stops silently.** Should the player be told ("Army at the ceiling")?
3. **Item 6 ignores the personality's job mix.** It picks the best rate across all jobs, so the mix may move the villager back on a later think. Item 6 also uses a fresh order, so a waiting computer villager may leave the wild for a field (decision 1's same-kind rule is lifted for the computer's brain only).
4. **C1 reaches past soldiers.** At peace with the Natives, villagers now flee wolves and bandits, the danger map stamps bandits, and the huddle and Emergency count the wild as foes. This is the same as being at war with the wild today, which is the default (regard 20 < 40).
5. **The Natives' ambush multiplier (×1.3) applies anywhere off the island, not only at the causeways.** `hurt` tests `onLand` and the distance from the middle. I noticed this and did not change it. With N4, Natives now hit soldiers at 1.3 against 0.65 before, twice as hard.
6. **Item 6 did not clearly recover the lost minute (4 seeds).** See balance. Idle villager-seconds fell from 1,329 to 211, but blocked rose from 6.5 to 25.5: the moved villagers walk to farther finds and some stand blocked. A 20-seed run is needed before this is judged.

## Rules bent

- New test file `tests/combat.py`, rather than another block in `tests/moves.py`. This keeps each planted-bug run short.
- `tests/gate.py --accept` appends to `CUTS.md`. I reverted that line because another builder may be editing `CUTS.md`. It is in the draft below.
- The fingerprint shares are not additive: the game is chaotic, so turning one change off can move the others. For C5, "off" was approximated as draining from the raw base blow.
- A unit leaving a building when every outline spot is taken stays where it was inside, and `collide` frees it, as before. This is a fallback, not a second system.

## Not done

- C10 to C16, apart from what earlier builds took (C11, C12, C15, C16 stay on the Owed list).
- Arrival radius for soldiers and animals. Own spots for priests and medics.
- The "from memory" sources were not opened.
- A message for a conversion refused at the ceiling (decision 2).

## Size

- `src/*.js` went from 1,064,082 to 1,070,028 bytes (+5,946, about two thirds of it comments). `first-keep.html` went from 1,182,817 to 1,188,763.
- Code: 20 files, +232 −109 lines, plus `tests/combat.py` (131 lines). Five copies of the exit placement became one (`stepOut`). The soldier's and the wild's reach became one (`reachOf`, `closeIn`). The waiter's spot search became `takeSpots`.

## Fingerprint shares (turning each change off in turn, 5 game minutes, seed 7)

The full batch against `e4d0c82`: 5 of 5 minutes differ, total count difference 1,486.

| Off | Against the full batch |
|---|---|
| Item 6 | 5 minutes, 1,539 (the bulk) |
| C4 | 3 minutes, 244 |
| C1, C2, C3, C5, C6, C8, C9, item 5 | 0 (these 5 minutes never meet them: the wild is at war by default, few fights) |

Accepted with `python3 tests/gate.py --accept "..."`.

## Balance (`tests/balance.py --seeds 4 --minutes 30 --jobs 1`)

| | e4d0c82 | combat80 |
|---|---|---|
| Bronze, median all sides | 5.3 min | 5.3 min |
| Classical, median all sides | 9.6 min | 8.9 min |
| Classical, computers (seats 1–3), median / mean | 9.95 / 11.93 min | 9.45 / 12.08 min |
| Medieval, median (sides reaching it) | 24.5 (5 of 16) | 22.3 (5 of 16) |
| Villager-seconds idle, no work found (median a game) | 1,329 | 211 |
| Villager-seconds blocked (median a game) | 6.5 | 25.5 |
| Wins by seat | seat 0: 2, seat 3: 2 | seat 0: 1, seat 3: 3 |
| Sides that fell | 0 | 0 |

Classical by seed and seat, before → after:
- Seed 1: [8.1, 19.8, 9.8, 8.6] → [8.1, 13.0, 10.8, 8.5]
- Seed 2: [11.8, 14.9, 8.3, 10.1] → [20.1, 19.1, 8.3, 9.4]
- Seed 3: [7.8, 16.4, 8.6, 9.3] → [7.8, 18.2, 8.0, 8.5]
- Seed 4: [7.8, 17.3, 9.4, 10.6] → [8.1, 23.3, 8.3, 9.5]

The balanced and Fortress seats are a little faster. The aggressive seat (1) is slower on three of four seeds. The mean is unchanged. Kills per 100 spent fell for spear and sword (1.02 → 0.69, 1.07 → 0.67), consistent with full-strength Natives and the nerve drained after the flank.

Soak (`tests/soak.py 1,2,3 20`): passed on all three seeds, no errors.

## Draft for CUTS.md

### Combat batch (Build 80, Nov 1; Albert yes yes 01:17)

**Changes**
- C1: one hostility test, `isFoe` (08-core). Only the Natives follow relations; the rest of the wild is hostile to all, always.
- N4/C4: half strength and no nerve for animals only, tested by kind. C2: the group includes itself. C3: own facing first. C5: nerve drained from the final damage.
- C6: `routAt` replaces `routT`; `MORALE.capAfter` 2 s; save shape 41.
- C7: the healing comment corrected (2.996 τ to 95% of the gap; 53.7 s for the half-dead swordsman).
- C8: converts lose the Native flag and respect the ceiling.
- C9: one reach (`reachOf`, `closeIn`); the petard splash records its attacker.
- Item 5: `takeSpots`, `postTo`, `stepOut`, with the hex `LATTICE`, in one home in 13-sim-civil.
- Item 6: the computer's brain moves waiting villagers by the forager's rate.
- **Play fingerprint accepted:** Combat batch (Nov 1): C1 one hostility test, C2–C9, N4 animal by kind, item 5 own spots, item 6 computers move waiting villagers. Shares by turning each off: item 6 moves all 5 minutes (1539 of the count difference), C4 3 minutes (244); C1, C2, C3, C5, C6, C8, C9 and item 5 none in these 5 minutes.

**Cut**
- `routT` (the end of a rout), replaced by `routAt` + `routSecs`.
- Five hand-written building exits (`b.y + 30`, `halfOf + 6`), replaced by `stepOut`.
- The waiter's own spot search, replaced by `takeSpots`.
- The wild's `U.rng + 5 + halfOf` reach, replaced by `reachOf`.
- `Math.max(p, unitPower(u))` in `groupPower`.
- The `v === t` test in `fromWhere`: `unitsNear` never yields the soldier itself.
- The random `ox`/`oy` offsets at a tapped point (`qidle`, Home), replaced by `postTo`.

**Tests**
- `tests/combat.py` (new, in the gate): every item, each failing on `e4d0c82` except C7 (comment only; it holds the real heal to τ ln 10).
- 14 planted bugs in `tests/handoff.py`.
- Balance before and after: see `docs/Combat Notes - v80 - Post Clean - Working.md`.
