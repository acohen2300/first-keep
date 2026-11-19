# Design 18: the Nov 18 audit fixes (N71)

His go: Albert, Nov 18 17:25, "Do it all." on the seven fixes of `docs/4 Now/Audit - Nov 18.md`. He was at dinner: the calls inside each fix are Claude's, his to overrule.

## The seven, as built
1. One idle. "An idle villager" has one home, `ECON.idlers(side)` (no posted job, idle or waiting, not inside, not in a den). The Jobs "Idle n" box, the tip and "send an idle villager" all read it. "Is its job idle" is asked in one place, the door (`FK.idle(u)`); the code no longer types `job === 'idle'`.
2. Words. No sentence typed in code: each goes to the Words book, once. A word that already had a home is read from there (Stop, Gather, Repair, Demolish, People, Not built yet, Needs {cost}).
3. Icons. The menu's icons live in the Screen book's `icons` (their home since E819); menu.js types none.
4. The dead. `YIELD` and `bodyOf` removed. The six ticks no law asked for: wired where a law already did the tick's work by another road (Health, Yield, Take, Hire, Repair), cut where none did (Carry). Cuts are logged in Parked.
5. Size. No grant: every code file ends the build no larger than it began.
6. The red tests. Each of the 55 is rewritten to the ruling that replaced it, retired (its ruling is gone; logged in Parked), or left red with its reason (a real game fault, his call).
7. The Comments book. The page COMMENTS.md (a second copy of the book) is no longer written; a why is one line: the count of long whys may only fall.

## The gate (so it stays fixed)
- `words`: a sentence typed in code stops the build.
- `ecs`: the ceilings fall to the new counts.
- `whys`: the count of whys over the line length may only fall.
