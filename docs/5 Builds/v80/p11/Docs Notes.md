# Docs Notes - v80 preview 11: the docs system [2026-11-01 07:45]

Albert's item 15 of Nov 1 (D-073), approved "yes yes yes" at 07:33 as the first part of the batch (D-074). Built in the worktree `fk-docs`, branch `docs81`, from main at `66a68a5`. Not pushed. [2026-11-01 07:45]

## What was built
- `START-HERE.md`: the four lines, START QC first, the reading order across every folder, quick answers. `CLAUDE.md` is now a pointer to it plus the commit and trailer rule. [2026-11-01 07:45]
- `docs/1 How we work/`: 01 Working with Albert, 02 SOP (with what goes in a preview's docs and the line stamps), 03 Q&A format, 04 Mockup format, 05 Truth method (with how to cite a source), 06 QC standard (the Checks doc, moved; paths and the parked line updated). [2026-11-01 07:45]
- `docs/2 Rules/`: RULES, COLORS, SCIENCE, EXCEPTIONS, and MENU-SPEC (the layout's one home, RULES §6), moved whole. [2026-11-01 07:45]
- `docs/3 Locks/Decisions/`: D-001 to D-075, one file each, with an index. D-001 to D-043 from the Decision Record (copied word for word from the closed record, which stays whole), D-044 to D-056 from the Build List's agreed and amended sections (moved), D-057 to D-074 from the Nov 1 answers (copied word for word), D-075 the v81 list; D-076 to D-080 Albert's calls of Nov 1, 08:14 to 09:10 (the pending stance, Misfits as a third tab, the 3:2 study, the HUD pages and Mail's door on the v81 list); the App Store path parked (09:10). Each file: date, status (locked, or superseded by D-xxx), Albert's words, the rule, its source, its code home (the last three taken from the record's own lines where it has them), where it was taken from, and the record word for word. [2026-11-01 09:10]
- `docs/3 Locks/Designs/`: Setup, Relations, the controls, the Market, the type rules, Mail; each links its pictures and its decisions. [2026-11-01 07:45]
- `docs/4 Now/`: Owed (the Build List's Owed, Half done and Housekeeping sections, moved; the Nov 1 batch and the v81 list added), Parked (the Build List's open questions and not-decided items, moved; every parked item of `CUTS.md` copied with its source; the parked decisions), v81 List (Albert, Nov 1, 07:36), Handoff (the state part of `HANDOFF.md`; its START QC part moved to START-HERE), App prep. [2026-11-01 07:45]
- `docs/5 Builds/`: v80 (What Happened, `CUTS.md` for Build 80, p9 and p10 notes, these notes in p11), v70 (`CUTS.md` for Builds 13 to 70, Albert's comments on v70), STAMPS. [2026-11-01 07:45]
- `docs/6 Records/` (closed): v70 Record whole; v70 (the five v70 builders' notes and the Build 70 snapshot of the Guide); v80 Audit; AUDIT-62; Old hand-offs; trials. Every file moved byte for byte (`git mv`, R100). [2026-11-01 07:45]
- `GUIDE.md` written by the game at the root (build 80); `publish.py` writes it at every publish from `window.__fk.guideMd()` (D-071). [2026-11-01 07:45]
- `tests/docs.py`, run by `tests/handoff.py` (not with `--plant`): (1) every line added or changed in a living doc since HEAD~1 ends with ` [YYYY-MM-DD HH:MM]`; a line that stood word for word in any doc of HEAD~1 counts as moved and needs none; (2) every closed record of HEAD~1 is still in `docs/6 Records/` byte for byte; (3) every path in START-HERE exists. Three planted bugs in `PLANTS`, one each; a plant whose file has a folder in its path is now planted from the root. [2026-11-01 07:45]

## Paths changed in the tools [2026-11-01 07:45]
- `build.py`: the build number from the latest "## Build NN" across `docs/5 Builds/*/CUTS.md`. [2026-11-01 07:45]
- `tests/gate.py`: `--accept` appends to `docs/5 Builds/v80/CUTS.md` (path string only; a new version must change it). [2026-11-01 07:45]
- `tests/palette.py`: `docs/2 Rules/COLORS.md`. `tests/handoff.py`: the Owed list from `docs/4 Now/Owed.md`, the docs check, the docs plants, `FK_REPO` for the plant copy. [2026-11-01 07:45]
- `src/05-rules-wild.js`: one comment's path to `docs/6 Records/v80 Audit/ai.md`. Other comments in `src/` and `tests/` name docs by file name only (`SCIENCE.md`, `EXCEPTIONS.md`, `MENU-SPEC.md`, `COLORS.md`, `CUTS.md`), which still hold. [2026-11-01 07:45]
- The pre-push hook reads no docs; unchanged. [2026-11-01 07:45]

## Checks [2026-11-01 07:45]
- Old paths grepped: no hit outside `docs/6 Records/` except three lines of Albert's own answers quoted word for word in D-069, D-071 and D-073 ("PARKED.md", "docs/v70 Record/", "docs/Builds/v80/"), left as he said them. [2026-11-01 07:45]
- Word counts before and after, by group (stamps not counted): Build List 2,394 → 5,542 (now Owed, Parked, D-044 to D-056 and the comments; Parked also copies the CUTS parked items); CUTS 43,114 → 43,132; HANDOFF 944 → 1,644 (Handoff and START-HERE); Checks 1,498 → 1,557; Rules 13,565 → 13,568; v80 notes 15,738 → 15,743; App prep and STAMPS 648 → 648; CLAUDE and README 302 → 168 (CLAUDE's reading order and rules now live in START-HERE). [2026-11-01 07:45]
- Every non-blank line of the old docs is still found word for word, except 62 lines whose only change is a path or a pointer (the old CLAUDE.md's eight lines are replaced by START-HERE). [2026-11-01 07:45]
- The records: 56 files moved byte for byte. [2026-11-01 07:45]

## Decisions for Albert
- MENU-SPEC.md is titled "Menu Spec - v70 - Clean Up Session" but is the living layout page (RULES §6); it sits in `docs/2 Rules/`, not with the closed v70 documents. [2026-11-01 07:45]
- `docs/4 Now/Handoff.md` still describes the state at preview 9; preview 10's state is in `docs/5 Builds/v80/CUTS.md`. It is replaced at the next hand-off. [2026-11-01 07:45]
- The Build List's cold-review items and several Half done items were fixed in Build 80 but are still listed (moved as they were); strike them at the next review. [2026-11-01 07:45]
- The record-time numbers of D-001 to D-043 are as the Decision Record gives them; where it has no separate "Rule", "Source" or "Code home" line, the field says so and points to the record below it. [2026-11-01 07:45]

## Not done
- `gate.py` and `build.py` look for this version's `CUTS.md` by path; v90 changes one string in `gate.py`. [2026-11-01 07:45]
- The Owed list's "Records" line (the QC reports into the repo) stays open: they are in `docs/6 Records/v80 Audit/QC - preview 8/` already. [2026-11-01 07:45]

## Draft for CUTS.md
## Build 80 preview 11 (Nov 1): the docs system [2026-11-01 07:45]
- **Moved (git mv, history follows):** `docs/Checks - v80 - Post Clean - Working.md` → `docs/1 How we work/06 QC standard.md`; `RULES.md`, `COLORS.md`, `SCIENCE.md`, `EXCEPTIONS.md`, `MENU-SPEC.md` → `docs/2 Rules/`; `HANDOFF.md` → `docs/4 Now/Handoff.md`; `APP-PREP.md` → `docs/4 Now/App prep.md`; `docs/Build List - v80 - Post Clean - Working.md` → `docs/4 Now/Owed.md`; `CUTS.md` → `docs/5 Builds/v70/CUTS.md`; `STAMPS.md` → `docs/5 Builds/STAMPS.md`; What Happened → `docs/5 Builds/v80/`; Fix Notes → `docs/5 Builds/v80/p9/`; Cards, Combat, Map, Research Notes → `docs/5 Builds/v80/p10/`; `docs/v70 Record/` → `docs/6 Records/v70 Record/`; `docs/v80 Audit/` → `docs/6 Records/v80 Audit/`; the five v70 notes → `docs/6 Records/v70/`; `GUIDE.md` (the Build 70 snapshot) → `docs/6 Records/v70/GUIDE - Build 70 snapshot.md`; `AUDIT-62.md` → `docs/6 Records/`; `docs/HANDOFF-to-oct29.md`, `docs/HANDOFF-to-oct30.md` → `docs/6 Records/Old hand-offs/`; `docs/trials/` → `docs/6 Records/trials/`. [2026-11-01 07:45]
- **Split:** `CUTS.md` at "## Build 80 preview 1": Builds 13 to 70 stay in `docs/5 Builds/v70/CUTS.md`, Build 80 moves to `docs/5 Builds/v80/CUTS.md`. The Build List: its agreed and amended items → `docs/3 Locks/Decisions/` D-044 to D-056; Owed, Half done, Housekeeping → `docs/4 Now/Owed.md`; Needs Albert's call, Not decided, the notebook, the cold review → `docs/4 Now/Parked.md`; Albert's comments on v70 → `docs/5 Builds/v70/`. `HANDOFF.md`: START QC → `START-HERE.md`; the state → `docs/4 Now/Handoff.md`. [2026-11-01 07:45]
- **Cut:** the reading order and the working rules in `CLAUDE.md` (now in `START-HERE.md`); the reading order in the README (points to `START-HERE.md`). [2026-11-01 07:45]
- **Added:** `START-HERE.md`; `docs/1 How we work/` 01 to 05; `docs/3 Locks/` (D-001 to D-080, six designs); `docs/4 Now/Parked.md`, `docs/4 Now/v81 List.md`; `tests/docs.py` and its three planted bugs; `GUIDE.md` written at each publish. [2026-11-01 09:10]
- **Nothing reworded** but paths and the lines that join or split files; Albert's words copied word for word. [2026-11-01 07:45]
