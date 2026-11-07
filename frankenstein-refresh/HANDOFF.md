# Frankenstein Refresh: hand-off (Nov 7, 2026)

Read this first in a fresh chat, then `BUILD-BRIEF.md` (the method and the core values), `clean/decisions.json` (Albert's binding calls) and the end of `../docs/4 Now/Parked.md` (open items). `../START-HERE.md` still describes the old v80 structure; for this work, this file is the start.

## Where things stand
- Mid's gameplay is in v100's structure: builds F10 to F39 published, plus C4 (cleanup) and S1 (sight). 63 of 73 modules are in.
- The gate passes, the survey passes, and 45 of 45 rules hold. Preview: https://acohen2300.github.io/first-keep/frankenstein-refresh/v100/
- Still to build: F40, the Throne (waits for Albert's description of the reimagined Throne; the Games wait with it), and F41–F49, the menus (to be redesigned to fit v100's menus; the seven screen readings in the Screen book's SN6 go there).
- How to build: write `v100/permit.json`, build per `BUILD-BRIEF.md`, then `python3 publish.py "message"` from `v100/` with `TRAILER` set. Run it in the background with a 2-hour timeout, because the full test run now takes more than 30 minutes.

## Albert's calls of Nov 6 (all in decisions.json)
- Core values, checked in order on every piece: fair, our logic and rules, real-life solution, real math, science, purpose, function, one home. Rigid: zero stray numbers; every value in its book with citation and comment; ECS.
- No fog of war. Sight is real math: the horizon, the eye by light, line of sight through ground, trees and buildings, and fog formed at the dew point. It is the same for the computers.
- You start at the bottom left. The pocket holds one age up, by law. Z3 is a transition zone laid by the Randomizer.
- The civilisations as Mid had them, where clean. Trees at the Forest Service's height.

## Open for Albert (revisions)
1. **The Barracks:** the computers raise no army building by 15 minutes because the free Mill and Farm were cut. t-ai is parked in Parked.md. Albert plays first, then decides: first army building right after the first Home (Mid's effective order), bring the free start back, or change the rule.
2. **The pocket's gold and stone:** the law gives none, because the age and the start buildings cost no gold or stone. For now there is a floor of one pile each. Keep it, or set amounts?
3. **Water near the Town Center:** Mid kept water 360 units away; the home pond's shore is about 280 away.
4. **The coast:** keep v100's coast shape and bring Mid's sea, cliffs and sky looks onto it (Albert, Nov 6).
5. **Scale and board size:** shrink the person to real scale and grow the board, through the one number D.upm (units a metre).
6. **Visibility:** switch the rain and snow terms to NOAA's CALVIS, so every haze term comes from one source.
7. **The small map as a weather radar:** the country around the board, with weather drifting in on the real wind.
8. **Play test:** units stutter or slow while walking; check the pace law along the path, the frame time and the sight look.
9. **The typed-number sweep:** about 7,900 numbers are still typed in code. Move them into their books module by module, and lower the ratchet as each module empties.
10. **Sources:** 44 are still "from memory, to open".
11. **Smaller calls from the builds** (each in Parked.md):
    - Treasure: v100's gold plus Mid's spoils.
    - Lightning only in summer storms.
    - The Gate burns.
    - Finds and "gathered".
    - The five civilisations' Wonder fronts, which become drawing lists in the Sprites book.
    - About 60 Guide rules waiting for their modules.
    - Lanterns' light falloff.
    - Building heights in sight.
12. **The tests:** test.py is about 246 KB. Trim it again, with no check loosened.
