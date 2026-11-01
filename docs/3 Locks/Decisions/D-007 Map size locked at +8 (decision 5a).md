# D-007 Map size locked at +8% (decision 5a) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked; its home zone amended by D-059 (three zones) [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: the record below [2026-11-01 07:45]
- Its source: none named in the record [2026-11-01 07:45]
- Its code home: none named in the record [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 799-802 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

5a. LOCKED at +8% (Albert, Oct 31), replacing the earlier size figures.
Map 2000 to 2160 (middle 1080); keep spacing 695 to about 751 (neighbours about 1,502 apart, about 62.5 s walk); margin behind each Town Center about 329 (area +16.6%, walking grid 216 cells a side). Zone: clearing 200, band 200 to 260 for all five finds at random, amounts +18% (food 2,655, wood 4,248, stone 1,770, gold 1,770, iron 1,770).
The zone needs about 316 behind the Town Center; the buffer of about 13 is, in Albert's reading, mostly there so the player can see and play in the corner (to be checked against the camera bounds in the test). Fallback if the 100-seed placement test fails: clearing 190, band 190 to 250.
Order: derive the hand-typed coordinates from MAP, MID and CORNER (tested at today's size); the D1 fix; change the constants; then the 100-seed placement test, camera and corner visibility check, soak, gate at four sizes, balance comparison.
