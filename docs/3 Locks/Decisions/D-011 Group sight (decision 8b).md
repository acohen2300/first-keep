# D-011 Group sight (decision 8b) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked (built in Build 80 preview 9); no sight cap per D-041 [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: the record below [2026-11-01 07:45]
- Its source: Basis: the many-eyes effect, Pulliam 1973, [2026-11-01 07:45]
- Its code home: Code home: 08-core.js beside sightOf (lines 566-584). Open: a cap on how much a big army reveals, to decide at build. The Pulliam and Lima citations are from memory; the papers were not opened [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 818-827 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

8b. Group sight. 
DECIDED
 (Albert, Oct 31).
 
Equation used in the game: a threat t is seen by a side if for any member i, dist(m_i, t) &lt;= sightOf(m_i), so the group's view is the union of the members' sight discs. Basis: the many-eyes effect, Pulliam 1973, 
On the advantages of flocking
, J. Theor. Biol. 38, P(detect) = 1 - (1 - p)^N; Lima 1995, 
Back to the basics of anti-predatory vigilance: the group-size effect
, Animal Behaviour 49. The probability form is the biology only; the game uses the deterministic union (static, no dice). Fog, night and weather still shrink each member's own disc through sightOf. Code home: 08-core.js beside sightOf (lines 566-584). Open: a cap on how much a big army reveals, to decide at build. The Pulliam and Lima citations are from memory; the papers were not opened
.
