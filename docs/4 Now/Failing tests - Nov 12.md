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

## The 22 sorted, first pass (Nov 12 15:40, N31 code, `test.py --only` the 22) [2026-11-12 15:40]
Run: 0 of 22 hold. Sorted by what fails; nothing in the game changed. [2026-11-12 15:40]

**A. The test itself crashes (calls something renamed or gone): stale test, fix the test.** [2026-11-12 15:40]
- t-food: `E.orderCost is not a function` (N24 made it a value). Stale, certain.
- t-orders: `KeyError: 'wheel'`; t-war: `KeyError: 'hit'` (book keys renamed or gone). Stale, likely.
- t-n15: reads `.length` of something undefined; t-gather: reads `.d` of undefined; t-walls: Mid's loader throws. Not read yet.

**B. "Equals Mid's frozen code" checks: the yardstick is out of date.** These prove the Frankenstein move from Mid; since then Albert's rulings changed many numbers on purpose (N19 slower days and twice the land, N20 storms, N18 fires, C3 ration, N24, N26). Failing: `books`/`nums` in t-peace, t-fire, t-wild, t-stage, t-mind, t-realm; t-odds (power and odds vs Mid); t-kinds; t-civs (art count); t-land (2 checks); t-a1 (2 checks). [2026-11-12 15:40]
- ALBERT'S CALL: the migration is over. Proposal: the yardstick becomes the book (the one home), not Mid. Each difference is then matched to a ruling in BUILDS.md; a difference with no ruling is drift (a real bug). [2026-11-12 15:40]

**C. Behaviour checks: the real candidates, read one by one next.** [2026-11-12 15:40]
- t-sight `los` (stale by his N24 #13: computers see in circles) and `mini` (not read).
- t-same `wet`: no rain in the first 300 s; likely stale (N19/N20 changed the weather's pace).
- t-stage `lights` (lantern vs hearth: likely N18 fires) and `shed` (N29 changed shedding: likely stale).
- t-physics `edge and hours` (hours: likely N19 slower days).
- t-alarm `refused`, `told`; t-trade `stops`; t-realm `camp`, `ans`; t-wild `events`, `raid`; t-mind `plans`, `moon`, `ground`, `flood`: not read.
- t-walls `crew`, `repair`, `refund`, `seal`, `rings`, `price`: most likely real; refund touches G15 (refund on cancel, open).

**Albert's call on B (Nov 12 15:36, yes yes):** Mid stays the yardstick for features (exists and works); the books are the yardstick for numbers; a number that differs from Mid with no ruling is drift. Fix group A and B tests to this. [2026-11-12 15:36]
