# First Keep: the one start (Albert, Nov 12, 2026)

This file overrides every other start page (`START-HERE.md`, `frankenstein-refresh/HANDOFF.md`, old hand-offs): those are archive.
Read this, then `docs/4 Now/Handoff.md` only. Open other files only when a task needs them. Then wait for Albert.

## 1. Where things are
- Game code: `frankenstein-refresh/v100/` on branch `n29-the-list`. Never `src/` on `main` (old v80 code).
- One list: `docs/4 Now/The List.md`. Every other list is archive.
- Commits as `Albert <acohen2300@users.noreply.github.com>` with the session's `Co-Authored-By` and `Claude-Session` trailers. The repo is public.

## 2. Changes
- No change without "yes yes". Reading and checking are free.
- Before building: a numbered list, one line an item, each with the core values (section 9) it meets or breaks.
- "Do it all" = the whole agreed list in that run: nothing added, nothing trimmed, not split. Stop only when done or truly blocked, and say which.
- A question or ruling from Albert is not a go: answer it, put it on The List, carry on.

## 3. Honesty, checkable
- Every claim about the code cites file and line. No citation: say "unverified".
- Every idea from Albert, before agreeing: name its weakness, and check whether a real-world solution already exists (nature, math, science, game theory, physics, another game).
- Disagree in the first line, with the reason. No "great idea", no validation.
- A wrong answer is corrected in the next reply, unprompted.
- Don't know = say "don't know". Never a guess dressed as fact.

## 4. Done means proven
- DONE only with proof: a named test that passed, or Albert's play.
- BUILT = not proven. Never report BUILT as done.
- A test that still passes with the old code planted back is not proof.

## 5. Reports
- Numbered: done / not done; for each not done, why and what is needed.
- Generated from The List, never from memory.

## 6. Order (until step 3 is done)
1. Housekeeping: one list, one hand-off, one working branch.
2. Sort the 22 failing tests (The List G5): stale or real bug. First pass done Nov 12 (`Failing tests - Nov 12.md`); group B waits on Albert's call.
2b. Gates: `proof` (X99) is built. Still to build: the tap-test gate (needs a real-finger helper) and the door gate (with P2).
3. P2, the job door (`The Plan.md`), to the spec `docs/3 Locks/Designs/08 The call - villagers and army.md`: one place sets a unit's job, target, path and what comes next. Fold in Focus as Albert's rule #17 ("stays on its job as a reasonable worker would"; today it is set on every tap and pinned to one find, E1027) and the open traces (builds a bit then stands, tree then idle, villagers disappearing).
4. Menu check against the kit (G2) and the ring standard (P4).
5. The rest of The List.
- No new features before step 3. Albert's play notes go on The List, not into builds.

## 7. Compute
- Concise: lists, no prose, one screen where possible.
- Never paste code into chat. Search first, read only the lines needed.
- Warn Albert early, before the chat compacts. Update the repo (The List, Handoff) before every hand-off.

## 6b. The laws (Albert, Nov 13: Design 09)
- Everything is a shell with ticks and states; a law is written once for a tick; what is not a shell is information in a book. Read `docs/3 Locks/Designs/09 The laws - shells, ticks, states, books.md` before building anything.
- Never ask a thing its name in code (job, kind, civ, code): ask its tick. The gate's `ecs` count may only fall; every build lowers it or leaves it.
- Albert, Nov 13 09:39: what he has ruled is a go; do not ask again. Only the menus are done together.

## 7b. Gates
- A rule a script can check goes in the gate (`index.py`), not only in this file.
- `proof` (X99): The List holds no DONE without a test that fails with the old line planted.

## 8. Never
- No helpers, agents or subagents: Claude does all reading, building and mocking itself.
- Nothing goes live without Albert's word.
- Nothing cut without logging it in `docs/4 Now/Parked.md`.

## 8b. The three yardsticks (Albert, Nov 12 15:35: Base + Mid + v100 = the perfect game)
- Base: play and design. The judge is Albert's play.
- Mid: depth and features. A test checks that each Mid feature exists in v100 and works.
- v100's books: every number. A test checks a number against its book; the book cites the ruling. A number that differs from Mid with no ruling behind it is drift (a bug).

## 8c. How a fix works (P2a, Nov 12: the first build in three days that worked first time)
1. Albert's spec first, in his words, in `docs/3 Locks/Designs/` (talk mode, one question at a time, short).
2. Tests from the spec before any code: each check fails on today's code.
3. One build: permit opens only what it changes, `grow` for size; book entries (comments E-code, words, citations N-code, rules X-code) for every new line.
4. Run the new test, then the full suite on a frozen copy against a baseline run (`/tmp`), so nothing silently breaks. Old checks that contradict a new ruling are moved to the ruling, said in BUILDS.md.
5. Seal: BUILDS.md entry, `index.py --seal`, clear permit.json, commit, push the branch; a preview copy on `main` (`frankenstein-refresh/preview-nNN/`, the game files and books only). Never live.
6. Report: numbered done / not done.
- Traps met: a fast second tap on the same thing is a double tap (`S.tap`); clear it in tests. A find with no free spot refuses the tap now: aim tests at free finds. `own(u)` is true for buildings too.

## 8d. Taking over (another chat or agent)
- Read this file, then `docs/4 Now/Handoff.md`, then `The List.md` sections 7-8. Nothing else until a task needs it.
- Clone: `git clone --depth 1 -b n29-the-list https://github.com/acohen2300/first-keep`; tests need `frankenstein-refresh/mid` and `clean` beside `v100`.
- Gate: `cd frankenstein-refresh/v100 && python3 index.py`. Tests: `python3 test.py --only t-p2,...` (headless Chrome; the full run takes about 25 minutes: run it in the background on a copy).
- Albert plays on his phone; his play is proof. Ask him for `?fps` screenshots for speed.

## 9. The 12 core values (check every item, in order)
1. Fair? 2. Follows our logic and rules? 3. A real-life solution (nature, science, history, another game)? 4. Real math, its source, where it lives? 5. Science? 6. Purpose? 7. Function? 8. One home?
9. Has a source (math, science, physics, a real-life anchor)? 10. Improves detail, quality and play? 11. Solves a problem, or built for fun? 12. Saves code?
Zero stray numbers: every value in its book with a citation and an E-code. An exception to the logic doesn't redefine the logic: an anomaly is builder error.
