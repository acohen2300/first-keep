# D-016 Army units pursuing odd things on spawn (decision 13, bug 4) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked; the re-test after decision 8 is owed (docs/4 Now/Owed.md) [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: Rule: covered by decision 8 (soldiers leave animals alone unless ordered, or a civilian is under attack in sight). The 320 home sweep stays only for hostile people (enemy soldiers, siege). Confirm in batch 0: spawn soldiers beside animals and log their targets. [2026-11-01 07:45]
- Its source: Logic: in home state a soldier sweeps 320 from its yard and from the Town Center (14-sim-troops.js 279-284), wider than the clearing (200) and the home band (200 to 260), so in the home area it can only reach animals and the like. Not reproduced; the cause may also be a leftover target from an earlier state, which decision 8 would not fix. [2026-11-01 07:45]
- Its code home: Code home: solTick 279-284 and nearHome 121 in 14-sim-troops.js; ignorable in 15-sim-spatial.js. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 861-866 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

13. Army units pursuing odd things on spawn (bug 4). DECIDED (Albert, Oct 31).
Rule: covered by decision 8 (soldiers leave animals alone unless ordered, or a civilian is under attack in sight). The 320 home sweep stays only for hostile people (enemy soldiers, siege). Confirm in batch 0: spawn soldiers beside animals and log their targets.
Logic: in home state a soldier sweeps 320 from its yard and from the Town Center (14-sim-troops.js 279-284), wider than the clearing (200) and the home band (200 to 260), so in the home area it can only reach animals and the like. Not reproduced; the cause may also be a leftover target from an earlier state, which decision 8 would not fix.
Principle: territorial defence, respond to what threatens what you hold (no specific source looked up).
Code home: solTick 279-284 and nearHome 121 in 14-sim-troops.js; ignorable in 15-sim-spatial.js.
Build to-do: after decision 8's animal rule is built, re-run the spawn test.
