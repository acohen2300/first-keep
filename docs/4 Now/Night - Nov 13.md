# Night work, Nov 13 (Albert: "Do as much as you can without stopping", 01:26)

## 3. Bug traces
- **Winner button (D10, H5): not a bug, never built.** The new game's "Tension" row (Winner / Diplomacy) is in `OPTS.tension` (`menu.js:14`) but not in `BUILT` (`menu.js`, `BUILT = { diff, len, daily, civ, scen, fog }`), so a tap answers "Not built yet". Nothing in the game reads `S.opt.tension`. Needs Albert: what Winner and Diplomacy mean, or hide the row until built (his Nov 11 lean: hide what is not available).
- **Mill showing two researches at once (H6): not a queue bug.** Each building runs one research at a time (`econ.js:89` order, `econ.js:221` runs only `q[0]`); `labOf` sends a research to the least busy building of its kind, so with two Mills two Mill researches run at once, one in each. The Mill card lights every Mill research running anywhere, which reads as one Mill running two. Real-world: AoE2 also researches per building. Idea: the card lights only what runs in this building, and marks the other "at the other Mill". Needs his call.
- **Villagers disappearing (D10): not reproduced.** Known ways a unit leaves: drowning through ice (`index.html:1048`, told as "fell"), wayfarers leaving (`combat.js:337`), Delete. Needs a log or screenshot from a game where it happened.

## 2. P2-end, the load rule: built, NOT sealed (held)
- Rule built: a villager sent to a new kind of find carries her load home only if the drop is on the way; otherwise she drops it (`econ.js` `gatherAt`). New test t-load passes; fails with the old rule.
- Full suite: one new failure, **t-n17 "gatherers hold their spots"**. Measured 3 runs each: old rule 0, 0, 0 moving frames; new rule 9, 84, 97 (of ~3,300; limit 2%).
- The moves are tiny pushes at the bush (`index.html:1151-1159`, `collide`/`shove`), not walks. Source not pinned.
- Not sealed, so nothing goes in half-proven. Code put back; the whole change is saved in `Held - P2-end load rule.patch` (apply with `git apply`).
- Needs: find who pushes the gatherer (one more trace), then seal. About 30 min.
- Mobile and Focus: no change. Focus is already the normal behaviour; Mobile's `assign` moves the least-productive worker (`forageNow`), better than "nearest". End of a job: already handled (`back`/`was`).

## 4. H10, the computers' economies (report)
Headless, one seed, Conquest, no player, 50 min (`/tmp/probe/h10.py`).
- **Raiders:** boom to 108 villagers, but 43 standing idle ("wait") at 50 min; food and wood near zero all game; per-worker food rate 0.24/s (others 0.74) = finds near home used up, long walks.
- **Rivals:** stuck at 10-23 villagers, Age 2 from minute 15 to 45; hungry at 15-18 and 42.
- **Fortress:** 47 villagers flat from minute 33; food 0 and hungry from 36; wood 3,232 and stone 2,660 piling unused; 18 on stone, 9 on food.
Causes found in code:
1. **Famine check ignores spending.** `famineNear` (`ai.js:53`) compares eating with gathering only; food spent on villagers and soldiers is left out. Measured: Fortress food income -6.05/s, yet "no famine". So no one is moved to food, food sits at 0, the side goes hungry, hungry people work slower (`econ.js:188`): a spiral.
2. **Villagers trained straight into zero food** (`ai.js:89`): when not saving, a villager is queued whenever any rate pays back; nothing keeps food for eating.
3. **Idle villagers when finds run out** (`ai.js:119`): a waiting villager only takes a find `bestFind` returns; none in range = stands forever. No "build a camp further out" step.
4. Gold frozen (his log, Rivals 30-37): fits saving for an age with gold already met; workers moved off gold. Not a bug by itself.
- Side find: **Scenarios overwrite the chosen length** (`econ.js:610` `limit = sc.len || Infinity`): Siege/Silk Road/Last Keep ignore 15/30/60 min.
- Needs his call: fix 1 and 2 (food reserve = eating for N minutes before training) and 3 (camp toward the next find). Proof: the same probe shows no hunger in 50 min.

## 5. The snow logic cost (report)
- Not reproduced. Headless, snow pinned on vs off, alternating minutes, 140-170 units: 2.4-3.7 ms vs 2.8-4.6 ms per step. Snow is not costlier in the sim.
- What "logic" means: the `?fps` meter's logic is all sim steps in one frame (`index.html:396`), 30 steps a second, capped at a 12 ms budget (D step). At 57 fps a frame runs about half a step (his 2 ms); at 15-22 fps it runs 1.5-2 steps, and his 12-16 ms is the 12 ms budget being hit. So the high logic is mostly a result of the slow drawing, not its cause.
- Needs: his phone in snow with `?fps` after F8 (preview-n35) — if draw drops, logic should drop with it.

## 6. G1 colours and G2 menus (reports)
- **G1:** index.html has 521 colours not in the Colours book: 495 are picture data (building art 344, figures 136, node art 15); 26 are loose code (climate 12, view lights 9, brushes 3, page 1, soil 1). menu.js: 16 off-book colours, all on lines 47-48. econ/combat/ai: none. Needs: move the 26 + 16 into the book (a small build, his yes).
- **G2:** not done. Needs pictures of every menu next to the kit (`mockups/70/Slot Kit - v70 - Clean Up Session.png`). My first screenshot pass opened the wrong tab names; a second pass is about 15 min.

## 1. G5, the failing tests: not started
- Same 22 fail as before (full run of Nov 13 night); no new ones except t-n17 above. No time left tonight.
