# D-001 Where a villager looks for work (decision 1) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked (built in Build 80 preview 9); built with no reproduction gate per D-019 [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: the record below [2026-11-01 07:45]
- Its source: Logic: leave a find when its marginal rate falls to the long-run average including travel (Charnov, marginal value theorem). Search tightly near the last find, then widen with time since the last find (area-restricted search). Followers are scored with the crowding term. [2026-11-01 07:45]
- Its code home: Code home today: forage() and bestNode() in 12-sim-core 593-715; the dropoff-then-search order in 13-sim-civil 134-275. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 723-725, 745-756 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

Villagers going idle:
 
DECIDED (Albert, Oct 31): when a find runs out, look from that spot before going home; if one is seen, deliver then go straight to it. If none, deliver, then search from the anchor (the spot you placed it, else its nearest drop-off) with a radius that grows from x to x+y over a time tau (x about 90, y about 90, tau about 10 s, all in the rules table). Candidates: same-kind finds your side has seen, plus finds friends are working. Skip the danger map. Leash: 200 (DANGER_R.far) from the nearest drop-off for unplaced villagers. Choose by the existing forage rate R. If nothing is found, or a placed villager is outside the cap, wait at the drop-off, shown as idle, and re-look every few seconds.

1. Where a villager looks for work. DECIDED.
Logic: leave a find when its marginal rate falls to the long-run average including travel (Charnov, marginal value theorem). Search tightly near the last find, then widen with time since the last find (area-restricted search). Followers are scored with the crowding term.
Equations: g'(t*) = g(t*) / (T + t*). The game's rate: R = c(1 - d) / (c/g + 2d/v + w
c/(A
v)), with g divided by (1 + others/room). Search radius: r(t) = x + y * min(1, t/tau).
Numbers to set in the rules table: x about 90, y about 90, tau about 10 s (to tune); leash 200 (DANGER_R.far) from the nearest drop-off.
Code home today: forage() and bestNode() in 12-sim-core 593-715; the dropoff-then-search order in 13-sim-civil 134-275.
Sources: 
Charnov marginal value theorem, PMC
; 
A random walk on Area Restricted Search, arXiv
. The producer-scrounger point rests on general knowledge; I did not open those sources.
