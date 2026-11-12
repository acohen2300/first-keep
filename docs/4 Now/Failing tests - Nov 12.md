# Failing tests - Nov 12 [2026-11-12 10:36]

## The two (List item 3) [2026-11-12 10:36]

1. t-n23 `shed`: the test still looked for the N23 wording (`shed(w2 - w1`); N29 sealed lateness shedding (D321 lag, a frame more than 2× late). Test and rule X89 updated to N29's rule. Not a code bug. [2026-11-12 10:36]
2. t-n25 `retreat` (new in N30): Execute deselected the Controller's group, so Retreat sent no one. Fixed in code: Execute keeps the Controller's pick (E1048). The tap table's deselect-after stays for taps. [2026-11-12 10:36]
3. t-n25 `fought` (failed in N29 too): two rule-correct causes, not code bugs. The lone foe routs and the soldiers take it prisoner (combat `caught`, `takePrisoner`), and archers stand at their own range (9.5 tiles) past the test's 6. Test now counts both. Passed 8 of 8 runs after. [2026-11-12 10:36]
4. t-n24 `kept` (new in N30, on purpose): the old rule "the picked stay picked after an order" is replaced by Albert's Nov 12 08:12 rule (tap 2 makes tap 1 act, then deselects). Test and rule wording updated. [2026-11-12 10:36]

## Found while sorting: 23 more old tests already fail in N29 [2026-11-12 10:36]

The full N29 run (frozen copy) failed 25 of the 67 that ran, then stopped on a plant that no longer matches the code (`plant swallowed`). Besides t-n23 and t-n25: [2026-11-12 10:36]

- Script errors (the test calls something renamed or gone): t-n15, t-orders, t-war, t-food (`E.orderCost is not a function`, N24 made it a value), t-gather, t-walls, t-mind (`Unexpected token`). [2026-11-12 10:36]
- A check false: t-a1, t-land, t-peace, t-civs, t-sight, t-stage, t-wild, t-fire, t-realm, t-trade (`noMint`, `guard0`), t-alarm, t-kinds, t-physics, t-same, t-ledger, t-odds. [2026-11-12 10:36]

In N30, t-ledger passes (the stores ledger now has its one home); the other 22 still fail, none new. Not on the agreed list. Each needs a read: a stale test (fix the test) or a real bug (fix the code). Logged as a new item in The List. [2026-11-12 10:36]
