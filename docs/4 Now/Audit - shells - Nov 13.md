# Shell audit, Nov 13 (one script pass over the books and the six code files; no reviewers)

## Holds
- 110 shells (17 finds, 50 buildings, 43 units). Every one has a name, layer, look and citation. 109 have ticks (BS1 has none).
- Every tick on a shell is in the Capabilities book (53). Every tick the code asks for is in the book.
- No code asks a thing what it is by its look. The gate stops a shell named in code (rule `names`), a typed colour (`hues`), a typed number (`ratchet`), a number without its unit (`units`).

## Breaks from "everything is a shell with ticks"
1. Jobs are typed names in code, not ticks: 121 comparisons (`idle` 39, `march` 14, `wait` 11, `hold` 11, `fight` 8, ...). The job door (P2) gave jobs one writer but not one book.
2. Priority (D377) is keyed on those job names. It is a measure, not a tick on a shell.
3. Civilisations are typed names in code: 12 comparisons (han 4, roman 3, persian 2, ...), all in the art.
4. 10 capabilities are in the book but no code asks for them (Build, Carry, Health, Hire, Repair, Research, Take, Teach, Walk, Yield): either dead ticks or behaviour living outside its tick. `Tall` is ticked on no shell.
5. Kinds: 117 comparisons of `kind` (bld 55, unit 33, tree 10): the three layers and trees asked by name.

## Proposal (not built)
- A Jobs book: each job one entry with its ticks (Works, Moves, Rests, Fights) and its priority level; code asks `does(u, 'Works')`, never `job === 'gather'`. Priority then reads the job's entry: one home.
- A shell may carry a `rank` bonus (a wagon, an engine, a king) added to the job's level: the point system reused.
- Dead capabilities: read each, cut or wire, log in Parked.
