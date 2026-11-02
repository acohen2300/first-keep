# The SOP: how a change goes from idea to live [2026-11-01 07:45]

The same nine steps every time. The detail of each check is in `docs/1 How we work/06 QC standard.md`. [2026-11-01 07:45]

1. **List.** Write the change as a list, in Albert's words. Decisions one at a time as Problem and Idea (`03 Q&A format.md`). Before agreeing to an idea, look for its weakness and a real-world solution. [2026-11-01 07:45]
2. **Mockup.** A screen is drawn as a picture in `mockups/vNN/` and agreed first (`04 Mockup format.md`). Measurements and mockups need no yes. [2026-11-01 07:45]
3. **Yes yes.** Nothing is built until Albert says yes twice. Lock each agreed decision as a new file in `docs/3 Locks/Decisions/` (the next D number; a later answer supersedes an earlier one by a new file that names the old). [2026-11-01 07:45]
4. **Build.** One change at a time or all of the list together; for each change one test and one planted bug, its plant run alone (`--plant --only=word`). Big or risky work may still go in a worktree with fresh eyes; that is the builder's call, not the default. [2026-11-02 13:54]
5. **Gate.** `python3 tests/gate.py` before each preview. [2026-11-02 13:54]
6. **Preview.** `python3 publish.py --preview "Build NN preview N: what changed"`. It builds, runs the gate and lint, writes `GUIDE.md` from the game, commits and pushes the preview. [2026-11-01 07:45]
7. **Live.** Only on Albert's word, after Live QC (`python3 tests/handoff.py`, every plant caught), soak and balance: `python3 publish.py "…"`. The stamp goes in `docs/5 Builds/STAMPS.md`. [2026-11-02 13:54]

## What goes in a preview's docs [2026-11-01 07:45]
- `docs/5 Builds/vNN/pN/`: the builders' notes for that preview (what was built, decisions for Albert, rules bent, what is not done, size before and after, the balance numbers, the "## Draft for CUTS.md"). [2026-11-01 07:45]
- `docs/5 Builds/vNN/CUTS.md`: the preview's own "## Build NN preview N" section (every change and cut, the checks' results, the balance table, sizes). [2026-11-01 07:45]
- `docs/4 Now/Owed.md`: strike what was built, add what was put off. `docs/4 Now/Parked.md`: any idea parked. [2026-11-01 07:45]
- `docs/4 Now/Handoff.md`: replaced with the new state; the old one goes to `docs/6 Records/Old hand-offs/`. [2026-11-01 07:45]
- `docs/2 Rules/SCIENCE.md` for any new equation; `docs/2 Rules/EXCEPTIONS.md` for any rule bent with Albert's yes. [2026-11-01 07:45]
- Every line written or edited in a living doc ends with its stamp, ` [YYYY-MM-DD HH:MM]` (Eastern time). [2026-11-01 07:45]

## Line stamps [2026-11-01 07:45]
- Living docs are `START-HERE.md` and `docs/1` to `docs/5`. Every line written or edited there ends with ` [YYYY-MM-DD HH:MM]`, Eastern time. A line moved without a change keeps no stamp. [2026-11-01 07:45]
- `docs/6 Records/` is closed: read it, never edit it. Records may be added or moved there whole. [2026-11-01 07:45]
- `tests/docs.py` (run by Live QC and by `publish.py`) holds both against the last commit, and checks that every file in START-HERE's reading order exists. [2026-11-02 13:54]
