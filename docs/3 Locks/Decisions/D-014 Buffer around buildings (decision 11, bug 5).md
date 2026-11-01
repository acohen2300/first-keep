# D-014 Buffer around buildings (decision 11, bug 5) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked, flagged: live test in process [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: Rule: no buffer ring for now. Reproduce first (batch 0): log where units stand against walls, draw their bodies on the building shapes, and log units found inside a footprint. Decide on a fix after. [2026-11-01 07:45]
- Its source: Logic: footprints are solid, a one-square slit is shut, and a square walled on two sides is shut (09-nav.js 89-123), but a square beside one wall stays open, so a figure can overlap a building's picture. Not reproduced. Other suspects: units leaving a building are placed about 30 units below it unchecked; collide (16-sim-fight.js 215) teleports units found in a solid square to the nearest free one; draw order of building art over the squares behind it [2026-11-01 07:45]
- Its code home: Code home: navRebuild and blockedCell, 09-nav.js; collide, 16-sim-fight.js. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 849-854 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

11. Buffer around buildings (bug 5, walking under buildings). DECIDED (Albert, Oct 31), FLAGGED: LIVE TEST IN PROCESS.
Rule: no buffer ring for now. Reproduce first (batch 0): log where units stand against walls, draw their bodies on the building shapes, and log units found inside a footprint. Decide on a fix after.
Logic: footprints are solid, a one-square slit is shut, and a square walled on two sides is shut (09-nav.js 89-123), but a square beside one wall stays open, so a figure can overlap a building's picture. Not reproduced. Other suspects: units leaving a building are placed about 30 units below it unchecked; collide (16-sim-fight.js 215) teleports units found in a solid square to the nearest free one; draw order of building art over the squares behind it
.
If confirmed: keep unit centres at least half a figure's width from a wall, the same inflation as decision 2 (CO = O + R).
Code home: navRebuild and blockedCell, 09-nav.js; collide, 16-sim-fight.js.
