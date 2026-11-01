# D-039 N16a addendum. Outlaw raid disincentive [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked; to build in batch C [2026-11-01 07:45]
- Albert's words: "An army nearby puts the outlaws off, as in real life" (as recorded) [2026-11-01 07:45]
- The rule: Rule (mine, to confirm at build): w_i = (1 + beta x load_i / CARRY) / (1 + gamma x guard_i), guard_i = the armed strength within escort range of target i, taken from the existing groupPower; and the outlaws only attack a target they can beat, the same canBeat test the hunters use in decision 8. Basis: risk-sensitive foraging, the landscape of fear (Brown 1988; Laundre 2010, from memory). Fix C2 (group strength leaves out the soldier itself) first, since this reads groupPower. Starting values beta 2, gamma 1; tune in the balance run. [2026-11-01 07:45]
- Its source: Basis: risk-sensitive foraging, the landscape of fear (Brown 1988; Laundre 2010, from memory). Fix C2 (group strength leaves out the soldier itself) first, since this reads groupPower. Starting values beta 2, gamma 1; tune in the balance run. [2026-11-01 07:45]
- Its code home: none named in the record [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 976-977 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

N16a addendum. Outlaw raid disincentive (Albert, Oct 31).
 An army nearby puts the outlaws off, as in real life. Rule (mine, to confirm at build): w_i = (1 + beta x load_i / CARRY) / (1 + gamma x guard_i), guard_i = the armed strength within escort range of target i, taken from the existing groupPower; and the outlaws only attack a target they can beat, the same canBeat test the hunters use in decision 8. Basis: risk-sensitive foraging, the landscape of fear (Brown 1988; Laundre 2010, from memory). Fix C2 (group strength leaves out the soldier itself) first, since this reads groupPower. Starting values beta 2, gamma 1; tune in the balance run.
