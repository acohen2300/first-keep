# D-013 Villagers grouping and glitching (decision 10, bug 2) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked (built); the reproduction step withdrawn by D-019 [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: Rule: (a) arrive and stop: within an arrival radius of its target a unit stops steering to the exact point and stands where it was pushed; the radius must be larger than the 8-unit push. (b) tie-break: units at the same point are pushed apart along a direction fixed by their ids. [2026-11-01 07:45]
- Its source: Math: arrival steering, desired speed = max speed x min(1, distance / slowing radius) (Reynolds 1999, [2026-11-01 07:45]
- Its code home: Code home: pushApart and collide in 16-sim-fight.js 147-224; moveTo in 09-nav.js 600-669; heft weights 16-sim-fight.js 146. Add to SCIENCE.md when built. Saved for the build layer. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 830-848 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

10. Villagers grouping and glitching (bug 2). DECIDED (Albert, Oct 31); jitter cause to be confirmed in batch 0.
Fact read in the code: pushApart (16-sim-fight.js 147-171) separates two units only if 0 &lt; d &lt; 8, so units at exactly the same point (d = 0) never separate. Suspected, not reproduced: each tick moveTo pulls a unit back to its exact target while pushApart shoves it away, so it trembles.
Rule: (a) arrive and stop: within an arrival radius of its target a unit stops steering to the exact point and stands where it was pushed; the radius must be larger than the 8-unit push. (b) tie-break: units at the same point are pushed apart along a direction fixed by their ids.
Math: arrival steering, desired speed = max speed x min(1, distance / slowing radius) (Reynolds 1999, 
Steering Behaviors for Autonomous Characters
); separation steering, a push that falls off with distance (Reynolds 1987, 
Flocks, Herds, and Schools
, SIGGRAPH). Both citations are from memory; the papers were not opened.
Code home: pushApart and collide in 16-sim-fight.js 147-224; moveTo in 09-nav.js 600-669; heft weights 16-sim-fight.js 146. Add to SCIENCE.md when built. Saved for the build layer.
10. Villagers grouping and glitching (bug 2). DECIDED (Albert, Oct 31).
Rule: (a) arrive and stop: within an arrival radius of its target a unit stops steering to the exact point and stands where it was pushed; (b) tie-break: two units at exactly the same point are pushed apart along a fixed direction from their ids.
Logic: pushApart only separates units when 0 &lt; distance &lt; 8, so units on one spot never separate (read in code, 16-sim-fight.js line 152). The jitter (target pull against push) is suspected, not yet reproduced; confirm in batch 0 before building. The arrival radius must be larger than the 8-unit push or units tremble at its edge.
Math: arrival steering, Reynolds 1999, 
Steering Behaviors For Autonomous Characters
 (speed falls to zero inside a slowing radius); separation steering, Reynolds 1987, 
Flocks, Herds, and Schools: A Distributed Behavioral Model
, SIGGRAPH (push away from neighbours, weaker with distance). Both citations are from memory; the papers were not opened.
Code home: pushApart and collide, 16-sim-fight.js 147-224; moveTo, 09-nav.js 600-669.
Build to-do: add arrival radius and tie-break; reproduce the jitter first (batch 0).
