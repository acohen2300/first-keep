# D-005 Map fairness: home zones, outline (decision 5a) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: superseded by D-006 [2026-11-01 07:45]
- Albert's words: X resources: "today's home pocket, plus 18% (Albert)"; otherwise not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: Rule (replaces equal distances with equal content): two zones, home and not home. Each home zone is defined by three numbers: X resources, X clearing, X radius. The map lays the four zones first, with a clearing larger than today (today about 150), then drops each corner's finds at random inside its zone. Once the zones are done, everything else is random. Suggested starting values: clearing 200, radius 360 (CLEAR = 360 already exists, and lakes never come within it). [2026-11-01 07:45]
- Its source: Math: gather rate R = c / (c/g + 2d/v + w [2026-11-01 07:45]
- Its code home: Code home: LAYOUT and laySpots in 10-world 239, 525-611; CLEAR in 06-rules-tuning 324; RICH in 01-rules-basics 21. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 782-790 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

5a. Map fairness: home zones. DECIDED in outline (Albert, Oct 31); one choice open.
Rule (replaces equal distances with equal content): two zones, home and not home. Each home zone is defined by three numbers: X resources, X clearing, X radius. The map lays the four zones first, with a clearing larger than today (today about 150), then drops each corner's finds at random inside its zone. Once the zones are done, everything else is random. Suggested starting values: clearing 200, radius 360 (CLEAR = 360 already exists, and lakes never come within it).
X resources: today's home pocket, plus 18% (Albert). Per corner: berries 5 x 531 = 2,655 food; grove 12 x 354 = 4,248 wood; stone 2 x 885 = 1,770; gold 2 x 885 = 1,770; iron 2 x 885 = 1,770. Implement as one number, HOME_RICH 1.18, on the pocket finds only, on top of RICH 2.5.
Math: gather rate R = c / (c/g + 2d/v + w
c/(A
v)), with c 10, v 24, gold g 0.6. Gold at 150 from the drop-off gives 0.34/s, at 270 gives 0.25/s (26% less) before a mining camp. A distance band of about 50 units per find gives about 14%; about 35 gives 10%. OPEN: band limit, or fully random inside the zone.
Logic: AoE-style map scripts give each player the same starting objects at random spots (general knowledge, not looked up).
Needs: update the fairness rule text in RULES.md, and the fairness test to check content, clearing and radius, not distances.
Code home: LAYOUT and laySpots in 10-world 239, 525-611; CLEAR in 06-rules-tuning 324; RICH in 01-rules-basics 21.
