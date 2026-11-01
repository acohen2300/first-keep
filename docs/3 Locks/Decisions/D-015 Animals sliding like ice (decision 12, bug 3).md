# D-015 Animals sliding like ice (decision 12, bug 3) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked (built) [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: Rule: sliding collision response, three changes in the flee step: (1) move along one unit direction so diagonal speed is correct (today each axis moves at full speed, about 41% too fast on a diagonal); (2) slide along a wall keeping only the tangential part of the motion, so speed falls to |v| cos(theta) against it; (3) stop the run if the slide speed falls below half. [2026-11-01 07:45]
- Its source: Equation: v' = v - (v . n) n, with n the wall normal (sliding collision response, standard in character controllers; general knowledge, not looked up). Rejected: a flee map over the nav grid (Brian Walker's Dijkstra safety maps, Brogue), too much code for deer. [2026-11-01 07:45]
- Its code home: Code home: flee step of wildTick, 14-sim-troops.js 427-437. Wolf and bear branches not yet read. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 855-860 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

12. Animals sliding like ice (bug 3). DECIDED (Albert, Oct 31).
Rule: sliding collision response, three changes in the flee step: (1) move along one unit direction so diagonal speed is correct (today each axis moves at full speed, about 41% too fast on a diagonal); (2) slide along a wall keeping only the tangential part of the motion, so speed falls to |v| cos(theta) against it; (3) stop the run if the slide speed falls below half.
Equation: v' = v - (v . n) n, with n the wall normal (sliding collision response, standard in character controllers; general knowledge, not looked up). Rejected: a flee map over the nav grid (Brian Walker's Dijkstra safety maps, Brogue), too much code for deer.
Watch: deer get slower on diagonals than today; villager speed is 24. Check hunting ease in the balance run.
Code home: flee step of wildTick, 14-sim-troops.js 427-437. Wolf and bear branches not yet read.
Build to-do: all three changes; balance run for the deer speed effect.
