# D-002 Gap between buildings (decision 2) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: the record below [2026-11-01 07:45]
- Its source: Logic: widen every obstacle by the walker's radius; a gap is passable only if it is wider than 2r. Placement must then never leave a gap the pathing will shut. [2026-11-01 07:45]
- Its code home: Code home: slit rule 09-nav 103-112; lane rule canPlace 09-nav 673 onward and 692-696. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 726-727, 757-770 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

Lane versus slit rule (B11):
 which one stays?

2. Gap between buildings. 
DECIDED (Albert, Oct 31): 2 squares minimum between non-wall buildings; slit rule stay
s.
Logic: widen every obstacle by the walker's radius; a gap is passable only if it is wider than 2r. Placement must then never leave a gap the pathing will shut.
Equations: CO = O + R = {a + b : a in O, norm(b) &lt;= r}; passable if gap w &gt; 2r.
Honest note: the collision push radius is 8 units, so a 10-unit one-square gap passes physically. The slit rule shuts it because the drawn figure looks wider (Albert, Build 41). So 2r here is the drawn width, a visual choice, not a physical one.
Proposal: non-wall buildings leave 2 or more squares between them; walls, gates and crops may touch.
Construction analogue: ADA accessible route 36 in clear, reducible to 32 in for no more than 24 in of length. A short pinch is allowed; a long run needs the full width.
Code home: slit rule 09-nav 103-112; lane rule canPlace 09-nav 673 onward and 692-696.
Sources: 
ECE276B configuration space lecture
 (the 2r gap condition is not stated there; it follows from the inflation); 
ADA chapter 4, 403.5.1
.
