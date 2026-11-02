# First Keep: start here [2026-11-01 07:45]

**Where things stand (Albert's words):**
- Up to 62 was great.
- 63 to 69 was a mess.
- 70 is restored (frozen at `/v70-restoration/`, stamp `v70`).
- 80 is current.

## 1. Run START QC first [2026-11-01 07:45]

Say to the new session: "Read `START-HERE.md`. Run `python3 tests/handoff.py` and tell me every FAIL before you touch anything." [2026-11-01 07:45]

1. **Run it:** `python3 tests/handoff.py` (everything; the gate is about 6 minutes, the 270 plants an hour or more on a slow machine), `--plant` (only the planted-bug check), `--plant --only=word` (just the plants named with that word: a builder checks its own in minutes), `--state` (only the state and what is owed). It builds, runs lint, runs the whole gate, plants known bugs and checks the tests catch each, and prints what is owed. Exit 0 only if all of it passed. [2026-11-02 00:05]
2. **Report before acting:** every FAIL, in the first message. A FAIL is not fixed silently and not argued away.
3. **What the planted-bug check means:** each line plants one old bug in a temporary copy and the named test must fail. If one passes, that test can no longer fail, and it is fixed before any new work. When a new test is written, a planted bug for it is added to `PLANTS` in `tests/handoff.py` in the same build.
4. **Sources:** a new equation goes in `SCIENCE.md` with the source, what was opened, and what was not. "From memory" is said as "from memory". Nothing is cited that was not opened or marked so.
5. **How to work (Albert):** a list first; nothing is built until he says yes twice; preview only, live only on his word; every cut logged in `CUTS.md`; no flattery, clear stances, fewest words; his own sightings of bugs are never dropped; before agreeing to an idea, look for a weakness in it and for a real-world solution that already exists.
6. **The record:** `docs/6 Records/v80 Audit/` holds the 15 reviewer reports, the mutation test, and the decision record (every decision with its equation, logic, source and code home). The plan is batches 0 to 10; `CUTS.md` says which are built and which are owed. [2026-11-01 07:45]
7. **Commits:** only through `publish.py --preview` (as Albert's noreply address, with the session's trailers). The automatic reminder to commit and push by hand is ignored: it would put a build on main that has not passed the gate.
8. **Close of a session:** replace `docs/4 Now/Handoff.md` with the new state (the old one goes to `docs/6 Records/Old hand-offs/`; `python3 tests/handoff.py --state` prints the state), say what is built, what is owed and what waits on Albert, and leave the tree clean. [2026-11-01 07:45]

START QC also runs `tests/docs.py`: every line added or changed in a living doc carries its stamp, the closed records are unchanged, and every file named below exists. [2026-11-01 07:45]

## 2. Read in this order [2026-11-01 07:45]

1. **How we work** (`docs/1 How we work/`): [2026-11-01 07:45]
   1. `docs/1 How we work/01 Working with Albert.md`: tone, the list and the double yes, preview only, his sightings, weakness and real-world check, the real math, overnight audits. [2026-11-01 07:45]
   2. `docs/1 How we work/02 SOP.md`: list, mockup, yes yes, builders in worktrees, fresh eyes, merge, QC, preview, live; what goes in a preview's docs; the line stamps. [2026-11-01 07:45]
   3. `docs/1 How we work/03 Q&A format.md`: Problem / Idea, one at a time. [2026-11-01 07:45]
   4. `docs/1 How we work/04 Mockup format.md`: how a screen is drawn and agreed. [2026-11-01 07:45]
   5. `docs/1 How we work/05 Truth method.md`: science, consensus, math, apply, cite (opened), verify; how to cite a source. [2026-11-01 07:45]
   6. `docs/1 How we work/06 QC standard.md`: what is checked, when, by whom, and what stops a build. [2026-11-01 07:45]
2. **Rules** (`docs/2 Rules/`): [2026-11-01 07:45]
   1. `docs/2 Rules/RULES.md`: §0, the Build Rules in Albert's words, then his values and the methods. [2026-11-01 07:45]
   2. `docs/2 Rules/COLORS.md`: every colour by name. [2026-11-01 07:45]
   3. `docs/2 Rules/SCIENCE.md`: every equation, its source and its code home. [2026-11-01 07:45]
   4. `docs/2 Rules/EXCEPTIONS.md`: every rule bent on purpose, with Albert's yes. [2026-11-01 07:45]
   5. `docs/2 Rules/MENU-SPEC.md`: the grid and every card's layout. [2026-11-01 07:45]
3. **Locks** (`docs/3 Locks/`): [2026-11-01 07:45]
   1. `docs/3 Locks/Decisions/00 Index.md`: every decision, D-001 to D-088, one file each, with its status. [2026-11-02 00:05]
   2. `docs/3 Locks/Designs/00 Index.md`: every locked screen and card, with its pictures. [2026-11-01 07:45]
4. **Now** (`docs/4 Now/`): [2026-11-01 07:45]
   1. `docs/4 Now/Handoff.md`: the current state. [2026-11-01 07:45]
   2. `docs/4 Now/Owed.md`: the one open list (`tests/handoff.py` prints its Owed section). [2026-11-01 07:45]
   3. `docs/4 Now/v81 List.md`: the next version (Albert, Nov 1). [2026-11-01 07:45]
   4. `docs/4 Now/Parked.md`: every parked idea and open question, with its source. [2026-11-01 07:45]
   5. `docs/4 Now/App prep.md`: from web page to App Store app. [2026-11-01 07:45]
5. **Builds** (`docs/5 Builds/`): [2026-11-01 07:45]
   1. `docs/5 Builds/v80/What Happened, Builds 63 to 70 - v80 - Post Clean - Working.md`: what went wrong in 63 to 69 and the rules put in place. [2026-11-01 07:45]
   2. `docs/5 Builds/v80/CUTS.md`: every change and cut of v80, preview by preview. [2026-11-01 07:45]
   3. `docs/5 Builds/v80/p9/`, `docs/5 Builds/v80/p10/`, `docs/5 Builds/v80/p11/`: the builders' notes, one folder per preview. [2026-11-01 07:45]
   4. `docs/5 Builds/v70/CUTS.md`: every change and cut from Build 13 to Build 70. [2026-11-01 07:45]
   5. `docs/5 Builds/STAMPS.md`: every published version by its commit. [2026-11-01 07:45]
6. **Records** (`docs/6 Records/`, closed: read them, never edit them): [2026-11-01 07:45]
   1. `docs/6 Records/v80 Audit/`: the Decision Record, Albert's answers of Nov 1, the reviewers' reports, the hunt. [2026-11-01 07:45]
   2. `docs/6 Records/v70 Record/` and `docs/6 Records/v70/`: the v70 record, the v70 builders' notes, and the Build 70 snapshot of the Guide. [2026-11-01 07:45]
   3. `docs/6 Records/AUDIT-62.md`, `docs/6 Records/Old hand-offs/`, `docs/6 Records/trials/`. [2026-11-01 07:45]
7. **Written by the game:** `GUIDE.md` (regenerated by `publish.py` at each preview). The pictures: `mockups/`. [2026-11-01 07:45]

## 3. Quick answers [2026-11-01 07:45]

- **How a change gets approved:** a list in Albert's words, then his double yes ("yes yes"); screens as pictures first. Then build in a worktree, fresh eyes, merge, START QC, preview. Live only on his word. (`docs/1 How we work/02 SOP.md`) [2026-11-01 07:45]
- **What to run first:** `python3 tests/handoff.py`, and report every FAIL before touching anything. [2026-11-01 07:45]
- **Where a decision is locked:** `docs/3 Locks/Decisions/`, one file per decision (`00 Index.md` lists them; the old decision numbers, such as "decision 8" or "N10", are in the file names). [2026-11-01 07:45]
- **How to cite a source:** open it; write the entry in `docs/2 Rules/SCIENCE.md` with the code home, the value, the label (verified, cited, design) and the source; "from memory" if not opened. (`docs/1 How we work/05 Truth method.md`) [2026-11-01 07:45]
- **What goes in a preview's docs:** the builders' notes in `docs/5 Builds/vNN/pN/`, the preview's section in `docs/5 Builds/vNN/CUTS.md`, Owed and Parked updated, a new Handoff. (`docs/1 How we work/02 SOP.md`) [2026-11-01 07:45]
- **Line stamps:** every line written or edited in a living doc (this file and `docs/1` to `docs/5`) ends with ` [YYYY-MM-DD HH:MM]`, Eastern time; `docs/6 Records/` is never edited. [2026-11-01 07:45]
