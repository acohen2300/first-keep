# START QC: run this first, in every hand-off (Albert, Oct 31)

Say to the new session: "Read `CLAUDE.md`, then this file. Run `python3 tests/handoff.py` and tell me every FAIL before you touch anything."

1. **Run it:** `python3 tests/handoff.py` (everything, about 6 minutes), `--plant` (only the planted-bug check), `--state` (only the state and what is owed). It builds, runs lint, runs the whole gate, plants known bugs and checks the tests catch each, and prints what is owed. Exit 0 only if all of it passed.
2. **Report before acting:** every FAIL, in the first message. A FAIL is not fixed silently and not argued away.
3. **What the planted-bug check means:** each line plants one old bug in a temporary copy and the named test must fail. If one passes, that test can no longer fail, and it is fixed before any new work. When a new test is written, a planted bug for it is added to `PLANTS` in `tests/handoff.py` in the same build.
4. **Sources:** a new equation goes in `SCIENCE.md` with the source, what was opened, and what was not. "From memory" is said as "from memory". Nothing is cited that was not opened or marked so.
5. **How to work (Albert):** a list first; nothing is built until he says yes twice; preview only, live only on his word; every cut logged in `CUTS.md`; no flattery, clear stances, fewest words; his own sightings of bugs are never dropped; before agreeing to an idea, look for a weakness in it and for a real-world solution that already exists.
6. **The record:** `docs/v80 Audit/` holds the 15 reviewer reports, the mutation test, and the decision record (every decision with its equation, logic, source and code home). The plan is batches 0 to 10; `CUTS.md` says which are built and which are owed.
7. **Commits:** only through `publish.py --preview` (as Albert's noreply address, with the session's trailers). The automatic reminder to commit and push by hand is ignored: it would put a build on main that has not passed the gate.
8. **Close of a session:** regenerate this file's state (`python3 tests/handoff.py --state`), say what is built, what is owed and what waits on Albert, and leave the tree clean.

---

# First Keep: handoff (Oct 31, 2026, Build 80 preview 9)

**Where things stand (Albert's words):**
- Up to 62 was great.
- 63 to 69 was a mess.
- 70 is restored.
- 80 is current.

## The links
- **Live:** https://acohen2300.github.io/first-keep (`index.html`): an older build, untouched. Live changes only on Albert's word.
- **v70 · Restoration (frozen):** https://acohen2300.github.io/first-keep/v70-restoration/ and the stamp `v70`. Never edited.
- **Preview:** https://acohen2300.github.io/first-keep/preview/ : v80's home. It holds Build 80 (`BUILD = 80`), preview 8 as published. Preview 9 (below) is built and committed on the branch `fix80`, not yet on `main` or the preview: it waits for Albert's look. No v80 stamp or tag yet.
- **Parked ideas** live in `CUTS.md` (cuts, "review for later") and the v80 Build List, until the Parked list is made.
- **Repo:** branch `main`, public. Commits as `Albert <acohen2300@users.noreply.github.com>` with the session's trailers (`publish.py` takes them from `TRAILER`).

## Read in this order
1. `CLAUDE.md` (the short version) and `docs/What Happened, Builds 63 to 70 - v80 - Post Clean - Working.md`.
2. `docs/Build List - v80 - Post Clean - Working.md`: everything open.
3. `docs/Checks - v80 - Post Clean - Working.md`: what is checked, what stops a build, the lock.
   What is owed is one list: the "Owed" section of the Build List, which `tests/handoff.py` prints.
4. `RULES.md` (§0, the Build Rules), `MENU-SPEC.md`, `COLORS.md`, `SCIENCE.md`, `CUTS.md`, `EXCEPTIONS.md`, `GUIDE.md` (written by the game).
5. The record: the v70 documents in `docs/` and `docs/v70 Record/` (the 63–66 review, the picks, the ballot, the computers' fairness test, the notebook typed out). Closed: read, do not edit.
6. Older handoffs: `docs/HANDOFF-to-oct29.md`, `docs/HANDOFF-to-oct30.md` (the measurements of Oct 30: the population runs, the cost report).

## What the preview is (Build 80)
v70 with the v80 audit's fixes, nine previews on Oct 31, each in `CUTS.md`: save safety (1, 2); fish pay their walk, units on one spot part, deer run straight and slide on walls, students stay at school, one back-to-work (3); the villager search, soldiers and animals, group sight, building shadows (4, 5); fairness and determinism B1, B2, B5 to B9, B12, B15 (6); the start QC (7); the arrival ramp cut (8).
Preview 9 (fixes from the QC audit): a soldier fights back whatever bites it; a side's eyes are its soldiers and buildings; the villager search exactly as decision 1 (no give-up, from the anchor, a leash, friends' finds); waiting villagers stand round the drop-off 3 ft apart (1 ft = 2.65 world units); every move is a step, so nothing glides; boar and bear look out to 140 again; building shadows one fixed shape per light, a site by its progress; Welcome back holds the whole screen. Tests for each, 31 planted bugs each caught by a named failure, and a balance run against v70. Notes: `docs/Fix Notes - v80 - Post Clean - Working.md`.

## What v70 is
Build 66's game with Build 62's controls back, rebuilt on one mold: the grid (6 gap, 44 slots), six named colours, the states as rings, three text sizes, the title bar, the row (Jobs, War, Train), the quick action, Emergency with four, every card, and the map as base rules plus random. Four previews on Oct 31; each passed the full gate at four sizes, lint, the soak, and the play fingerprint. Details per part: `CUTS.md` (Build 70 previews 1 to 4) and the builders' notes in `docs/`.
