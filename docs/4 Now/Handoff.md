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
- **Parked ideas** live in `docs/4 Now/Parked.md`; what is owed in `docs/4 Now/Owed.md`; the v81 list in `docs/4 Now/v81 List.md`. [2026-11-01 07:45]
- **Repo:** branch `main`, public. Commits as `Albert <acohen2300@users.noreply.github.com>` with the session's trailers (`publish.py` takes them from `TRAILER`).

## Read in this order
1. `START-HERE.md` (the reading order) and `docs/5 Builds/v80/What Happened, Builds 63 to 70 - v80 - Post Clean - Working.md`. [2026-11-01 07:45]
2. `docs/4 Now/Owed.md`: everything open. [2026-11-01 07:45]
3. `docs/1 How we work/06 QC standard.md`: what is checked, what stops a build, the lock. [2026-11-01 07:45]
   What is owed is one list: the "Owed" section of `docs/4 Now/Owed.md`, which `tests/handoff.py` prints. [2026-11-01 07:45]
4. `docs/2 Rules/` (`RULES.md` §0, the Build Rules; `MENU-SPEC.md`, `COLORS.md`, `SCIENCE.md`, `EXCEPTIONS.md`), the locks in `docs/3 Locks/`, the version's `CUTS.md` in `docs/5 Builds/v80/`, `GUIDE.md` (written by the game). [2026-11-01 07:45]
5. The record: the v70 documents in `docs/6 Records/v70/` and `docs/6 Records/v70 Record/` (the 63–66 review, the picks, the ballot, the computers' fairness test, the notebook typed out). Closed: read, do not edit. [2026-11-01 07:45]
6. Older handoffs: `docs/6 Records/Old hand-offs/HANDOFF-to-oct29.md`, `docs/6 Records/Old hand-offs/HANDOFF-to-oct30.md` (the measurements of Oct 30: the population runs, the cost report). [2026-11-01 07:45]

## What the preview is (Build 80)
v70 with the v80 audit's fixes, nine previews on Oct 31, each in `CUTS.md`: save safety (1, 2); fish pay their walk, units on one spot part, deer run straight and slide on walls, students stay at school, one back-to-work (3); the villager search, soldiers and animals, group sight, building shadows (4, 5); fairness and determinism B1, B2, B5 to B9, B12, B15 (6); the start QC (7); the arrival ramp cut (8).
Preview 9 (fixes from the QC audit): a soldier fights back whatever bites it; a side's eyes are its soldiers and buildings; the villager search exactly as decision 1 (no give-up, from the anchor, a leash, friends' finds); waiting villagers stand round the drop-off 3 ft apart (1 ft = 2.65 world units); every move is a step, so nothing glides; boar and bear look out to 140 again; building shadows one fixed shape per light, a site by its progress; Welcome back holds the whole screen. Tests for each, 31 planted bugs each caught by a named failure, and a balance run against v70. Notes: `docs/5 Builds/v80/p9/Fix Notes - v80 - Post Clean - Working.md`. [2026-11-01 07:45]

## What v70 is
Build 66's game with Build 62's controls back, rebuilt on one mold: the grid (6 gap, 44 slots), six named colours, the states as rings, three text sizes, the title bar, the row (Jobs, War, Train), the quick action, Emergency with four, every card, and the map as base rules plus random. Four previews on Oct 31; each passed the full gate at four sizes, lint, the soak, and the play fingerprint. Details per part: `CUTS.md` (Build 70 previews 1 to 4) and the builders' notes in `docs/`.
