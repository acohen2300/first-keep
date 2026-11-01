# First Keep v80: fresh review (88b2cb2..c3b4964, src and tests)

Method: read the decision record (Decisions, 17 answers, Final build sheet, numbered decisions), CUTS.md from Build 80 preview 1, the src and test diffs. Built HEAD in a detached worktree, ran tests/moves.py, saves.py and science.py (all PASS), played the same seeds in v70 (v70-restoration/index.html) and v80 through `window.__fk`, and re-ran the play fingerprint with single v80 changes taken out (at HEAD and at the preview 3 and 4 commits). Scripts are in fresh80-work/ next to this file. Nothing in the repo was edited.

Most serious first.

## 1. Soldiers no longer fight back against an animal that attacks them (a regression; C1 made worse, not fixed)
- Decision 8: soldiers leave animals alone "unless the player orders it, or a civilian is targeted and the animal is within line of sight". C1, which batch 3 was meant to fix (Final build sheet: "C1 as decided (8)"), was "A wolf took a swordsman from 70 to 47.5 and he never struck back". The fix it named was one hostility test: animals and outlaws always hostile.
- Code: `ignorable` (src/15-sim-spatial.js:29) treats any animal with a temper as ignorable unless it is on a *civilian*. A soldier who is being attacked is not covered, and being hurt does not trigger a response. C1's own predicate (`hostile(o, v)`; Natives follow relations, the rest of the wild always hostile) was not built. `nearestFoe` still requires `atWar(o, WILD)`.
- Ran (wolf.js): a sword with a wolf, then a bear, on it for 20 s. v70: the sword targets the beast and kills the wolf (wolf 45 to -3). v80: the sword never targets it (0 ticks); the wolf is untouched at 45 and the sword drops from 70 to 29. Ordered attacks still work (order.js): v80 kills the boar, wolf and bear when told to.
- CUTS preview 4 lists only "the live test 4b" as not built, so the C1 hostility split was silently left out.
- Matters: high. It changes combat in the player's view, and an earlier sighting (C1) now happens at war as well as at peace.

## 2. The Resume lock can still be left by another route (A2 not closed)
- A2: "The card cannot be closed into play."
- Code: only the close and back buttons are blocked (`cardLocked`, src/34-save.js:167; src/33-verbs.js `close`, `cardback`). `openCard` (src/27-cards-core.js:9) replaces the Resume card with any other card.
- Ran (bin/resume.py): reload with a saved game at 1:40, then tap the stores pill (top left). The Resume card becomes the stores card, its close works, and the game underneath plays. After 60 s of play and a forced save, the save is still 1:40 (`holdSave` stays true). The real save is safe (A1 holds), but everything played this way is never saved. That is the A2 symptom.
- tests/saves.py checks only the two buttons, and sets `holdSave` by hand rather than through boot.
- Matters: medium-high (player safety batch).

## 3. Decision 1 (villager search) is only partly built
- Decision: if nothing is found, "wait at the drop-off, shown as idle, and re-look every few seconds" (no time limit); search from the anchor; leash 200.
- Code: src/13-sim-civil.js:231 re-looks for `tau + give` = 35 s, then falls into the old Build 61 branch (job dropped, wait for an order). `give: 25` (src/06-rules-tuning.js:158) is not in the decision. The anchor for placed villagers and the leash are not built. The radius is measured from where the villager stands.
- Bug: `u.lostT` is cleared only when the villager picks a find itself (13-sim-civil.js:280). It is not cleared on `setJob` or on the give-up path. Ran (stale.js): the first loss keeps the job 50 s. After the player sends the same villager to a new find by hand, the second loss drops the job at 15 s, the same as v70. The 35 s window never comes back, and `searchR` starts at 180, not 90.
- The search did deliver first and waited near the drop-off in my run (search.js), which matches "deliver, then search" for an unplaced villager.
- Matters: medium.

## 4. More than decided: defenders ignore anything beyond 45 (STARTLE)
- Decision 8: Defend (boar, bear) = Hawk-Dove, fight with probability V/C. No range change was decided.
- Code: src/14-sim-troops.js:475 cuts the boar and bear look range from 140 to `STARTLE` 45 (src/05-rules-wild.js), on top of V/C (:489). It is not in the decision or in RULES/SCIENCE, and preview 4's fingerprint reason does not name it (see 6).
- The `temper` values 'flee' and 'hunt' are labels nothing reads (wolf prey choice is not built; CUTS preview 5 says so). The deer now carries both `flee: true` and `temper: 'flee'`: two homes for one fact.
- Matters: medium (balance; boar and bear behave differently from what was agreed).

## 5. Smaller mismatches
- N2/B8: Easy's multiplier is now 1 (src/37-events.js:15), but the Setup Start button still says "score ×1.x" on Easy (src/30-cards.js:464).
- B6: when the shown wonder falls, the next one is the first found in the list (src/12-sim-core.js:114), not the one standing longest, as the comment says.
- B7: `keepHealth` (src/08-core.js:480) repeats the building loop of `rehealth` (:623): two homes for one rule (RULES §0, "make a core").
- Decision 14: the decision says one cached shape per building kind, moved with Path2D addPath, and "no per-frame shadow maths". The code rebuilds a convex hull for every building every frame (src/23-view-things.js:247). Measured (perf.js): no visible frame cost (v70 6.8-7.2 ms against v80 7.0-7.5 ms at zoom 0.9; at zoom 2 the two are the same). So the method is not the one decided, but the cost is not real.
- SCIENCE.md: CUTS preview 5 says "a row for each equation built so far". Missing: the wall slide v' = v - (v·n)n (decision 12), the planar shadow projection (decision 14), and the id tie-break and arrival radius (decision 10). science.py labels the search-radius check "Reynolds-style arrival".
- B13: `navHold` (src/11-orders.js:963) is not reset if `build` throws inside the wall loop. After that, the walking grid would never rebuild. Unlikely, but there is no try/finally.
- A5: a damaged main save with a good `.bak` shows "could not be read" on Setup while Resume offers the backup. `.lost` is one slot, so a second damaged save overwrites the first (the same class of problem as A4).

## 6. Fingerprint acceptances: is the stated cause the real one?
I ran the fingerprint script with single changes taken out (bin/fp.py).
- Preview 3 (fish walk, parting, deer, back-to-work): only the deer change moves it. Taking out the deer change alone gives exactly v70. Taking out the fish change or the parting changes nothing. The reason names three causes that do nothing.
- Preview 4 (search, arrival 9, soldiers and animals, group sight): those changes move minutes 3 to 5. Minute 1 moves because of the unnamed STARTLE change. Taking out STARTLE alone, or the named four alone, does not restore preview 3. Both contribute; one is not stated.
- Preview 6 (B1, B7, B9, B15, B12): at HEAD, taking out B7, B9 and B12 together changes nothing. B1 (fog lit in newGame) and B15 (fish on land) are the real causes. B12 cannot change play: same flood, same result.
- Preview 8: "gathering back to v70" comes from Albert's separate test, not from the fingerprint. The player's row still differs from v70 at minutes 3 to 5 (minute 4 food 484 against 514). Taking out B1 alone puts minute 4 back at 514/275/140. So the remaining gap is the fog change, not gathering.

## 7. Tests that can pass while the behaviour is wrong
- moves.py C14 calls `backToWork` directly. It would pass if any repair exit still called `setJob(u, null)`.
- moves.py group sight: the "far" spearman is placed on the same spot as the near one, so the union is never tested.
- moves.py decision 1: a 3-second check. It misses the stale `lostT`, the 35 s give-up and the drop-off wait.
- moves.py animals: encodes only the civilian case. A soldier attacked by a beast (item 1) is not tested.
- moves.py B8: tests `levelMul` only, not "a difficulty change applies from the next game".
- saves.py: the lock is checked only on the close and back buttons (item 2). Five static checks only look for text (`on('hands')`, `CHAN[name] !== 'alert' &&`, the `.old' + S.v` string, the old event line). Behaviour can break while the text stays.
- science.py Hawk-Dove tests `hawkP(V, C)` only. A `wildTick` that never called it would pass.
