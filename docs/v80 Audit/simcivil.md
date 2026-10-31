# Audit: src/12-sim-core.js and src/13-sim-civil.js (v70)

Every line of both files read. Probes run in a copy (`scratchpad/ag-simcivil`) with playwright against `window.__fk`; scripts in `scratchpad/ag-simcivil-t/` (t.py, t2.py, t3.py).
Determinism: no Math.random, no clock in either file; every view call made from them (sfx, news, celebrate, shot, scarFall, scarBurn, wearGround) was checked and draws no rng(). No determinism break found.

## S1

**1. The Throne is deleted when its holder falls, and a dead side then wins on the Throne clock.** VERIFIED.
- `16-sim-fight.js:271-276` `fall()` sets `hp = 0, gone = true` on every building of the fallen side, the Throne included (its owner is the holder after `takeThrone`).
- `12-sim-core.js:97-101`: the "taken, never broken" rescue skips it because of `!b.gone`; `12:123-134` then removes it from `G.blds`.
- `G.throne` still names the dead side; `judge` (`12:344`) never checks `alive`, so after `throneHold()` the game ends "X held the Throne". `takeThrone` (`38-natives.js:92`) finds no Throne, so nobody can retake it.
- Probe (t.py `throne`, `throneWin`): AI 1 holds, its keep falls → `throneInBlds:false`, `G.throne:{owner:1}`; with the clock run out → `over:"lost"` while `p1alive:false`.
- Fix: in `fall()` hand the Throne and the citadel back to WILD (`G.throne = null`) instead of breaking them; have `judge` require `G.P[o].alive`.

## S2

**2. Only one wonder can be tracked; a second one erases the first one's win clock.** VERIFIED.
- `12:466` `built()` overwrites `G.wonder` without checking. `canPlace` only stops two wonders from the same owner (`09-nav.js:722`, `B.one`). The AI waits for `!G.wonder` (`17-ai.js:163`), but the player does not.
- Probe (t3.py): AI wonder done → `G.wonder={owner:1,...}`; player wonder done → `{owner:0,...}`; player's wonder falls → `G.wonder=null` while the AI wonder still stands and can never win.
- Fix: keep the clock on the building (`b.end`), and have `judge` and the views read the standing wonders.

**3. Resources made or lost by rounding at the drop.** VERIFIED. `13:162` `stash(Math.round(u.carry))`, the same at `13:320` (which also skips `st.got`).
- Probe (t.py `round`): a carry of 0.45 delivered 0; a carry of 2.5 delivered 3. A partial load happens whenever a job changes or a find runs out.
- Fix: stash `u.carry` unrounded. `earn` takes fractions, and milk and shops already stash fractions.

**4. A computer's spy in `look` walks back home between its 15-tick checks.** VERIFIED.
- The `look` block (`13:611`) runs only when `(tick+id)%15===0`. On the other ticks it falls through to `13:647`, which sends a `look` spy to its own keep.
- Probe (t2.py): a spy left in `look` mid-map: distance to the target keep 695→770, to its own keep 695→669 in 11 s.
- Fix: in `13:611` take the `%15` test inside the `look` branch and always `return`; `13:647` then serves `home` only.

**5. `forage` treats fish as needing no walk to a drop.** VERIFIED. `12:608` `dr = n.kind === 'fish' ? null : …`, so `d = 0`. But `vilTick` carries fish to `dropFor(o,'food')` like any load.
- Probe (t.py `fish`): with the drop 140 away, fish R 0.40 (equal to the at-the-door rate) against a bush's 0.295.
- This skews every choice `forage` makes (bestNode, pickVil, turtlePlan, the 18% move rule).
- Fix: delete the fish exception.

**6. A builder whose site is destroyed or cancelled goes idle and keeps a stale `pj`.** VERIFIED.
- `13:405-408` calls `setJob(u,null)` without reading or clearing `u.pj`. The finished-site path (`13:392-394`) and the fire path (`13:400-402`) both restore it.
- Probe (t3.py): woodcutter sent to build, site killed → `job:null, pj:'wood'`. The stale `pj` comes back later at `13:233` and pulls the villager off a job the player gave it.
- Fix: one `backToWork(u)` helper used by all three exits (the same 3 lines are already written twice).

**7. Shepherds milk while the side is starving or the shepherd is sick.** VERIFIED (code). `13:196` applies `hungerOf` but not `starving()`, sickness or the circus bonus that `makeNow` applies (`13:32-38`). STARVE says nobody works. Fix: share `makeNow`'s multiplier.

**8. Fishers keep fishing after their dock is gone.** VERIFIED (code). `dockNear` is checked only in `bestNode` (`12:681`); `vilTick` never checks it again. Fix: add `n.kind==='fish' && !dockNear(...)` to the leave test at `13:221`.

**9. `turtlePlan` counts other sides' fields and workshops' output as finds.** VERIFIED (code).
- `mkBld` pushes every field and workshop node into `G.nodes` (`10-world.js:741`). The first loop (`12:628`) does not filter `n.farm`, so an ally's field within 400 counts, and so does a Mint's gold without its stone cost.
- The second loop (`12:631`) then repeats the player's own fields.
- Fix: `!n.farm` in the first loop; filter `makes` in the second.

**10. Morale loss "within 40" is a square, not a circle.** VERIFIED (code). `died` (`12:300`) relies on `unitsNear`, which is a box test (`15:191,203`) and never checks `dist`, unlike `vilTick:90`. Corners reach 56. SCIENCE.md says within 40. Fix: `dist(u,v) < MORALE.lossR` in the callback.

**11. Damage taken while a site is going up is wiped on completion.** SUSPECTED (may be meant). `12:452` `b.hp = max(b.hp, 0.999·mx)`. Progress already brings hp to max (`0.1M + 0.9M·Σk`), so the line only matters for a damaged site, and then it heals it for free. The 0.999 is unexplained.

**12. A caravan's pay is worked out from its home, wherever the caravan stands.** SUSPECTED. `13:550-561`: when `d` is lost (alliance broke, or the home market fell while away), the new cargo is computed from `dist(home,to)`. A caravan already at the ally's market can be paid again without making the trip. Fix: on losing `d`, send the caravan home first.

**13. A scout can stand for good at an unreachable treasure.** SUSPECTED. `13:479-495`: no `noPathT` check, and the same find is picked again every 30 ticks.

## S3: rules and bloat

Dead or redundant code (VERIFIED):
- `13:289`: never runs. `b` is null whenever `u.node.farm` (`13:287`). `13:295` `if (!u.node.farm)` is always true.
- `12:661` `!(n.farm && BLD[n.farm.kind].sheep)`: dead, because `12:676` skips pastures anyway.
- `12:592` `FORAGE.room.carcass`: dead key. The carcass node's kind is `'meat'` (`12:316`), so it falls back to `||2`.
- `G.lost` (`12:324`): written, never read, not in `blankGame`, not saved. Cut it.
- `13:128` `u.node = null` after `setJob`, which already sets it.
- `12:67`: the first half of the condition is covered by `.some`.
- `12:82-89`, `124-135`, `137-146`: three hand-written "any? then filter" blocks. Each is `if (X.some(...))`; saves about 15 lines.
- Drop cache: six keys (`13:139-155`). `dropN` is redundant with `dropR`+`dropV`. Bump `G.bldV` in `reap` when buildings go and one key does it; saves about 10 lines.

Rule breaks:
- `13:412` `rng() < FIRE_SMOKE*dt`: should be `hazard(FIRE_SMOKE, dt)` (RULES §5: a random "when" is a Poisson process).
- Tables in a simulation file: `FORAGE` (`12:592`), `DF` and `react` (`12:294-295`, AI tuning). Numbers belong in files 01 to 06.
- Inline numbers:
  - hunter ×5 damage (`13:365`)
  - douse rate 0.2 (`13:418`)
  - repair fallback cost `{w:200,s:100}` and `||60` (`13:437-438`); the Throne has no cost and gets this
  - winter 0.8 (`12:16`)
  - the credit window `20` written twice (`12:99,106`)
  - drop-off size `<4` at `12:749` against `<=3` at `16:369`
- Stale comment, `12:106`: "a flood twenty minutes after a scratch". `G.t` is seconds; the window is 20 s.
- Inconsistent `forage`: a hunt's `A = UNIT.meat` (`12:603`), but the carcass holds `meat·RICH` (`12:316`). Its third term is 2.5× too pessimistic for hunting.
- SCIENCE.md shows `R = c(1−δ)/…`; the code has no δ (it excludes danger yes-or-no). The table should show the form the code uses.
- `wk` has two homes: incremental bookkeeping in 9 places (setJob, died, leaveWork, startWork, vilTick ×5), uneven (wild nodes are only ever incremented between recounts), plus `recount` every second.
- The out-of-building spot (`x + ox·0.8, y + 30`) is copied 4 times (`13:79`, `14:152`, `40:70`) and in a close variant at `13:12`, `11:868`. Make one `exitAt(u,b)`.
- Placement: the villager logic is split. `forage`, `bestNode`, `pickVil`, `typesOf` and `dropFor` sit at `12:560-750`; `vilTick` is in 13. Moving them to 13 makes 12 the step and 13 the people.
- Words: 15 `news`/`say` strings inline in these two files (RULES §6: every word in 07). This is the practice codebase-wide, not special to these files.

## vilTick (286 lines): split, yes

It handles six things in a row with fall-through: indoors (shop or shelter), fright, carrying home, idle, choosing work, and working. Fall-through hides bugs: `flock` falls through to the gather branch on purpose, and the shepherd's `wk` rules differ from the rest.

A plan that keeps behaviour:
```
vilTick(u,dt,SP):
  u.idle=false
  if (u.inside) return insideTick(u,dt)               // 63-83 (shop, or shelter exit)
  const kk=keepOf(u.owner), rb=hideAt(u,kk)           // rb BEFORE the scare check, as now (68 runs before 110)
  if ((G.tick+u.id)%5===0) scareCheck(u,kk)           // 84-118
  if (u.scared && kk) return runIn(u,rb,dt,SP)        // 119-132
  if (carryHome(u,dt,SP)) return                      // 133-169, true = stop this tick
  if (u.job==='repair') return repairTick(u,dt,SP)
  if (!u.job) return waitIdle(u,kk,dt,SP)             // 174-179
  leaveUnsafe(u)                                      // 180-187
  if (u.hunt) return huntTick(u,dt,SP)
  const flock=shepherd(u,dt)                          // 192-202
  if (!flock && (waitPlot(u,dt,SP) || seekWork(u))) return   // 203-218; 219-299
  workAt(u,dt,SP,cap)                                 // 300-345
```
- `seekWork` (80 lines) splits again into `lostFind` (231-251), `patchCut` (253-268) and `reconsider` (276-299).
- The split saves no lines by itself (about +15 for function headers). With the dead code above removed, the net is about −10 to −20.
- What it buys: each phase can be tested alone, and every exit is an explicit `return`.
- Keep `rb` computed before `scareCheck`: today a villager scared this tick runs one tick toward the old hiding place (S4; fixing that is a behaviour change, so make it a separate step).

formUp (127 lines) should split the same way: `homeYard` (lines 181-222), `marchShape` (223-278), `paceCaps` (279-292). In `12:265-271`, `u` and `a[i]` are the same object; use one name.

## S4
- `13:184`: the farm-node `wk--` can only run when a hunt is unsafe and a farm node is also set, which is almost never.
- `13:215` `G.P[u.owner].alive` is always true (dead sides' units are removed).
- `12:629` `(o!==0 || !G.fogOn || known0(n))`: `known0` already tests `!G.fogOn`.
- `makeNow` sets `u.work = G.t` while starving, so the villager reads as working.
- `leaveWork` reuses `DANGER_R.secs` as the no-path timeout: two meanings, one number.
- The shop worker deposits its carry at the shop door (`13:319-322`), not at a drop-off.
- `sideSpd`: `WEATHER.spd || 1` would turn a weather speed of 0 into 1.

## Not checked
moveTo/nav internals, hurt/shot/plunder bodies (16), recount's dangerMap cost, AI use of pickVil, save round-trip of the fields named here, the performance of the O(B·U) shelter count at `13:107`, and balance effects of the fixes.
