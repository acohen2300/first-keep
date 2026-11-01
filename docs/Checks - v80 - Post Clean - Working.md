# Checks - v80 - Post Clean - Working
*Made Oct 31, 2026; rewritten Nov 1 as the QC standard at Albert's word ("so other hand-offs know how to handle it"). What is checked, when, by whom, and what stops a build. Changed only with Albert's word. Any agent picking up this repo follows it as written.*

## 1. The order of work (people before code)
1. **A list first.** Every change is written as a list and shown to Albert. Decisions go one at a time, as a short Problem and Idea.
2. **Pictures before code.** A screen is drawn and agreed as a mockup first (`mockups/`).
3. **A double yes.** Nothing is built until Albert says yes twice ("yes yes").
4. **Truth before numbers (Albert, Nov 1).** Every rule and research effect is as true to life as possible, except the named exceptions (`EXCEPTIONS.md`):
   - is there science for it (physics, chemistry, biology, geology, medicine)?
   - is there an accepted consensus?
   - find the math, and apply it;
   - state the reasons and cite the sources, opened and not from memory, in `SCIENCE.md` with the code home;
   - verify it with a test.

   A number with no source is listed for Albert, never invented.
5. **Before agreeing to any idea,** look for its weakness and for a solution that already exists in the real world.
6. **Builders in separate copies.** Each part is built in its own git worktree and branch. The builder:
   - leaves notes in `docs/<Part> Notes - vNN - ….md`: what was built, decisions for Albert, rules bent, what is not done, size before and after, the balance numbers, and a "## Draft for CUTS.md" section;
   - never edits `CUTS.md` when builders run in parallel (the merger appends the draft);
   - never pushes.
7. **One browser at a time.** The machine has 2 CPUs; a builder waits for the browser rather than running two at once.
8. **Preview, then live.** A build goes to the preview link only (`publish.py --preview`). It goes live only on Albert's word.
9. **Stamps.** Every published build is listed with its commit in `STAMPS.md`.
10. **Commits.** No personal email on any commit (the repo is public). Albert's noreply address is set in the repo config. Keep the session's trailers.

## 2. Every change carries its own proof
- **A test that fails on the code before the change** and passes after. Show it failing: run it on a copy of the base commit.
- **A planted bug** in `tests/handoff.py` (PLANTS) for each new check. The bug is planted in a clean copy, and the named test must fail with its expected text. A test that passes with its bug planted is a test that cannot fail, and it does not count.
- **The fingerprint** (five minutes of a recorded game in `tests/gate.py`) moves only for a deliberate rule change. Accept it with `python3 tests/gate.py --accept "the exact reason"`, and say which change moved it by turning each change off in turn.
- **Save shape.** A change to what a save holds raises `SAVEV` and adds one `MIGRATE` step. Old saves must load (the v39 fixture in `tests/fixtures/`). When two builders both raise it, the merger chains their steps and does not overwrite one with the other.
- **Build rules (`RULES.md` §0):**
  - every number has one home, and nothing is hand-typed that a table should hold;
  - no patches on patches, nothing dead;
  - the simplest design.

## 3. The test suite
| File | What it holds | Run |
|---|---|---|
| `tests/handoff.py` | **START QC.** Build, wrap, lint, the whole gate, then every planted bug (a clean control run first). Prints the Owed list. | Every session and every hand-off, before touching anything: `python3 tests/handoff.py`. Report every FAIL first. |
| `tests/gate.py` | Four phone sizes (375×667, 390×844, 393×852, 430×932). Layout, fit, taps, events, the fingerprint, the map's base rules, the button budget, and the words. It also runs all the quick tests below. | Inside START QC and `publish.py` |
| `tests/lint.py` | No undefined names, duplicate keys or unreachable code | Inside START QC and `publish.py` |
| `tests/science.py` | Each equation against its source (`SCIENCE.md`) | In the gate |
| `tests/history.py` | Each research step in its age | In the gate |
| `tests/tables.py` | The rule tables hold together | In the gate |
| `tests/saves.py` | Save safety, migrations and the Welcome back card | In the gate |
| `tests/moves.py` | Movement and work rules (search, spots, leash) | In the gate |
| `tests/map.py` | Map fairness: equal content per corner over 100 seeds, the home zones, the citadel seen the same from every corner, the camera, old saves on the new map | In the gate |
| `tests/combat.py` | Hostility, strength, nerve, rout, conversion, reach, spots, the computers' waiting villagers | In the gate |
| `tests/cards.py` | The v80 cards: Setup, Relations, Mail pages, E1 to E11, and that cards never scroll or grow | In the gate |
| `tests/verbs.py` | Every control's verb has a handler | In the gate |
| `tests/palette.py` | Colours by name, text sizes 12 and 18, one font weight, timings | In the gate |
| `tests/words.py` | Toasts and tips are 10 words at most and fit one line at 375 | In the gate |
| `tests/soak.py` | Long games, Hard, every hazard: no error, no impossible number, nothing below zero | `python3 tests/soak.py 1,2,3,4,5,6 30` before each preview |
| `tests/balance.py` | The computers in all four seats. It measures; it does not pass or fail. | `python3 tests/balance.py --seeds 4 --minutes 30 --jobs 1` after any rule change; 20 seeds for a close call |
| `tests/probe.py`, `bot.py`, `econ.py` | Tools for one question (a computer's stall, a stranger's first minutes, the economy's rates) | When needed |
| `tests/fmt.py` | Prettier formatting | Before committing source |

## 4. The QC rounds (who checks what, and when)
1. **A builder's own checks:**
   - build, lint, its tests and plants, and the full START QC on its commit;
   - soak on 3 seeds, and balance before and after if a rule changed.
2. **Fresh eyes on each build.** A reviewer who has not seen the work compares what was agreed (the Decision Record, the Build List, the mockups, `RULES.md`) with the code, and finds:
   - bugs;
   - tests that cannot fail;
   - build-rule breaks;
   - records left out.

   Its report goes in `docs/v80 Audit/`. The builder fixes every blocker and every should-fix, or names it for Albert, before the merge.
3. **The merge:**
   - `git merge --no-ff`, conflicts resolved by hand with nothing lost or doubled;
   - the builder's draft appended to `CUTS.md`, with the merge's own notes;
   - START QC on main after every merge.
4. **Before a preview:**
   - START QC passes on main, with every plant caught;
   - soak on 6 seeds × 30 minutes;
   - balance against v70 (4 seeds × 30 minutes, the table in `CUTS.md`);
   - a last fresh-eyes review of the seams between builds (merge resolutions, cross-build effects, the records, the first minute of play and an old save).

   Then `publish.py --preview`, which runs the build, the gate and lint again and stops at the first failure.
5. **The hunt** (a deep read of the whole code), at a version's close or overnight:
   - two readers, one for the rules and simulation, one for the view, cards, input and saves;
   - bugs, cost per tick and per frame, build-rule breaks;
   - each item marked NEW, or KNOWN against the earlier audits;
   - report only; fixes wait for Albert's yes.
6. **Albert's sightings are never dropped.** Each one is written down, found in the code, and either fixed or closed with his word.

## 5. The lock
- **Live is locked.** A push is refused unless the live page is exactly a build the gate passed: a fingerprint of the file, stored by `publish.py` and checked by a pre-push hook.
- **Previews** run the full gate every time but do not move the live lock.

## 6. The records every build keeps
- **`CUTS.md`:** every change and every cut, per build, with the checks' results, the balance table and sizes.
- **`EXCEPTIONS.md`:** every place the game knowingly bends its own rules, with Albert's yes.
- **`PARKED.md`:** every idea cut or parked.
- **`SCIENCE.md`:** every equation, its source (opened, or marked "from memory" until it is) and its code home.
- **The Build List's Owed section:** the one list of what is owed. Strike a line when it is built; add one when something is put off.
- **`docs/v80 Audit/`:** the decision record, the QC audit of preview 8, every fresh-eyes report, and the hunt.
- **The builders' notes:** one file per build.
