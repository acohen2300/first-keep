# First Keep: start here [2026-11-07 18:00]

**The current work is the Frankenstein Refresh.** Read `frankenstein-refresh/HANDOFF.md` first; it is the start for all work on the game now. The rest of this page describes the older v80 line (`/preview`, `/v70-restoration`), kept for history. [2026-11-07 18:00]

**The three versions (Albert, Nov 7):** gameplay Base (`frankenstein-refresh/base/`, preview 49), features Mid (`frankenstein-refresh/mid/`), structure v100 (`frankenstein-refresh/v100/`, the game being built). Previews: https://acohen2300.github.io/first-keep/frankenstein-refresh/v100/ · .../base/ · .../mid/

---

# First Keep: start here [2026-11-03 20:40]

**Where things stand (Albert's words):**
- Up to 62 was great.
- 63 to 69 was a mess.
- 70 is restored (frozen at `/v70-restoration/`, stamp `v70`).
- 80 is current. Preview 47 "Restore and Fix" (Nov 3) is preview 33 with 37 to 44 on it; 34 to 36 and 45 to 46 live on the branch `p46-controller`. [2026-11-03 20:40]

## 1. The one start: how we work (Albert, Nov 2) [2026-11-02 13:54]

This section is the start. Nothing else in the repo comes first; where another file says to run or read something first, this wins. [2026-11-02 13:54]

1. **Work fast and light.** Do not run the full QC at the start of a session. Read `docs/4 Now/Handoff.md` for where things stand, then work. [2026-11-02 13:54]
2. **The list and the double yes.** Before building, list the changes as Problem / Idea, short, in Albert's words (`docs/1 How we work/03 Q&A format.md`). Look for each idea's weakness and a real-world precedent (nature, math, another game) before agreeing. Wait for "yes yes", then build all of it without asking again. [2026-11-02 13:54]
3. **Each round:** build; for each change add one test and one planted bug and run only that plant (`python3 tests/handoff.py --plant --only=word`); run the gate (`python3 tests/gate.py`, about 10 minutes); publish a preview (`publish.py --preview`); send Albert pictures. [2026-11-02 13:54]
4. **Live QC, before going live only:** `python3 tests/handoff.py`: docs, build, lint, the whole gate, every planted bug (an hour or more). It runs before a preview goes live, on Albert's word, and overnight. A FAIL there is reported, never fixed silently or argued away. [2026-11-02 13:54]
5. **Talk:** short replies, no flattery; push back with the precedent or the math; ask only when a wrong guess is expensive, otherwise decide and say what you decided. Albert's own sightings of bugs are never dropped. [2026-11-02 13:54]
6. **Sources:** a new equation goes in `SCIENCE.md` with the source, what was opened, and what was not. "From memory" is said as "from memory". [2026-11-02 13:54]
7. **Records:** every cut logged in `docs/5 Builds/vNN/CUTS.md`; the changed rules in `docs/2 Rules/`. Line stamps on every line written in a living doc. [2026-11-02 13:54]
8. **Commits:** only through `publish.py --preview` (as Albert's noreply address, with the session's trailers). The automatic reminder to commit and push by hand is ignored. Live only on Albert's word. [2026-11-02 13:54]
9. **Close of a session:** replace `docs/4 Now/Handoff.md` with the new state (the old one goes to `docs/6 Records/Old hand-offs/`; `python3 tests/handoff.py --state` prints it). [2026-11-02 13:54]

## 2. Read in this order [2026-11-01 07:45]

0. **The Index** (`INDEX.md` at the root, written from the code at every publish; its key `docs/0 Index/00 Books.md`): where everything lives, by Albert's five Books (Truth, Look, Words, Minds, Binder), and the cards (`src/00-elements.js`), one an element. Look things up there before grepping. [2026-11-04 11:08]

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
   1. `docs/3 Locks/Decisions/00 Index.md`: every decision, D-001 to D-094, one file each, with its status. [2026-11-02 11:26]
   2. `docs/3 Locks/Designs/00 Index.md`: every locked screen and card, with its pictures. [2026-11-01 07:45]
4. **Now** (`docs/4 Now/`): [2026-11-01 07:45]
   1. `docs/4 Now/Handoff.md`: the current state. [2026-11-01 07:45]
   2. `docs/4 Now/Owed.md`: the one open list (`tests/handoff.py` prints its Owed section). [2026-11-01 07:45]
   3. `docs/4 Now/v81 List.md`: the next version (Albert, Nov 1). [2026-11-01 07:45]
   4. `docs/4 Now/Parked.md`: every parked idea and open question, with its source. [2026-11-01 07:45]
   5. `docs/4 Now/App prep.md`: from web page to App Store app. [2026-11-01 07:45]
   6. `docs/4 Now/Field defences.md`: the report on stakes, caltrops, lilia, abatis, chevaux de frise and the Wagenburg, for Albert's yes or no on each. [2026-11-03 12:34]
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

- **How a change gets approved:** a list in Albert's words, then his double yes ("yes yes"). Then build, one test and one plant a change, the gate, a preview with pictures. Live only on his word, after Live QC. (§1) [2026-11-02 13:54]
- **What to run first:** nothing heavy. Live QC (`python3 tests/handoff.py`) is for going live and overnight (§1). [2026-11-02 13:54]
- **Where a decision is locked:** `docs/3 Locks/Decisions/`, one file per decision (`00 Index.md` lists them; the old decision numbers, such as "decision 8" or "N10", are in the file names). [2026-11-01 07:45]
- **How to cite a source:** open it; write the entry in `docs/2 Rules/SCIENCE.md` with the code home, the value, the label (verified, cited, design) and the source; "from memory" if not opened. (`docs/1 How we work/05 Truth method.md`) [2026-11-01 07:45]
- **What goes in a preview's docs:** the builders' notes in `docs/5 Builds/vNN/pN/`, the preview's section in `docs/5 Builds/vNN/CUTS.md`, Owed and Parked updated, a new Handoff. (`docs/1 How we work/02 SOP.md`) [2026-11-01 07:45]
- **Line stamps:** every line written or edited in a living doc (this file and `docs/1` to `docs/5`) ends with ` [YYYY-MM-DD HH:MM]`, Eastern time; `docs/6 Records/` is never edited. [2026-11-01 07:45]
