# D-006 Map fairness: home zones and map size, final (decision 5a) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: superseded by D-007 [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: the record below [2026-11-01 07:45]
- Its source: Logic and math: gather rate R = c / (c/g + 2d/v + w [2026-11-01 07:45]
- Its code home: none named in the record [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 791-798 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

5a. FINAL (Albert, Oct 31): home zones and map size. DECIDED.
All five home-pocket finds sit inside one 60-unit band just outside the clearing (clearing 200, band 200 to 260), at random positions in it. Everything outside the zones is random. Amounts are today's pocket plus 18% (HOME_RICH 1.18): food 2,655, wood 4,248, stone 1,770, gold 1,770, iron 1,770 per corner.
Map: the space between camps grows 10% (CORNER 695 to about 765; neighbours 1,390 to about 1,530 apart, a walk of about 58 s to about 64 s) and the margin behind each Town Center grows to about 405, so MAP goes from 2000 to about 2340 (area +37%, walking grid 200 to 234 cells a side). The exact size is settled by test.
Needs, in order: (1) replace the hand-typed map coordinates (the centre 1000 typed eight times, the lake and trade stops) with values derived from MAP, MID and CORNER, tested at today's size; (2) the D1 fix (waves recalled at 45 s); (3) change the three constants behind a test; (4) 100-seed placement test (every corner places every find in the band), the fairness test on content, the soak on a phone-sized setup, the gate at four sizes, and a balance comparison of age-up times and wave arrival against today.
Logic and math: gather rate R = c / (c/g + 2d/v + w
c/(A
v)): berries at 200 give 0.38/s and at 260 give 0.34/s (about 11% less before a mill). Area per player is the usual RTS map-size rule (general knowledge, not looked up).
Needs the Fairness rule in RULES.md rewritten from equal distances to equal content.
