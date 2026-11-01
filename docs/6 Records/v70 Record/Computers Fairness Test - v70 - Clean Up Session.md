# Computers' Fairness Test - v70 - Clean Up Session
*Run Oct 30, 2026 evening. Parked: not in Build 70. Open on the v80 list (item 10, ballot V24 and V25).*

## The problem
The computers stalled before the Medieval age: on Build 62, 10 of 24 sides reached it in 30 minutes. The cost report (HANDOFF.md, Oct 30) found the cause: **spending that does not wait for the save**, not too few villagers. Six purchases skipped the saving check (towers, priests, zeal, medics, siege, hiring at finds), and a side stopped training villagers while it saved, so it stopped growing.

## The fix tested (on Build 62, in a scratch copy)
1. The six purchases wait for the save.
2. Villagers are still trained while saving (a worker pays back its 50 food in minutes).
3. The villager ceiling grows with the age reached, up to 60 (12 on each of five jobs), instead of one flat ceiling.
4. Saving never strips the army below its smallest wave.

## Why it is not cheating
It changes only what the computers choose to buy and when. They get no free resources, no extra sight, no faster work and no rule the player does not have. Exception #5 (they see the whole map) stands as before; fog for them is a separate item (V25).

## Results (6 games, 30 minutes, the computers in all four seats: 24 sides)
| | Build 62 | With the fix |
|---|---|---|
| Bronze, median | 4.6 min | 7.4 min |
| Classical, median | 9.7 min | 11.1 min |
| Medieval | 10 of 24 sides, 22.6 min | **22 of 24 sides, 18.0 min** |
| Gunpowder | none | 9 of 24 sides, 22.2 min |
| Sides that fell | 0 | 0 |
| Wins by seat | Aggressive 4, Balanced 1, Balanced 1 | Fortress 3, Balanced 2, Aggressive 1 |
| Villager-seconds blocked (median a game) | 14 | 255.5 |

## What it costs, and what is open
- The early ages are slower (Bronze about 3 minutes later): the sides grow before they buy.
- More villagers means more of them blocked on the way to work (14 → 255.5), the same lane problem the harness has measured since Build 61.
- The wins move from the Aggressive seat to the Fortress.
- One run of 6 games; the seat swing between runs has been 4 to 7 wins since Build 57.
- Decision for Albert in v80: take the fix, tune it, or leave the computers as they are.
