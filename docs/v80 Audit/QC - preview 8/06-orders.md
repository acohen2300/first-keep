# QC 06: src/11-orders.js, src/33-verbs.js (v80 HEAD vs v70 88b2cb2)

Read only. Both files read in full. No browser, no build. Tags: C traced and sure, K fairly sure, S suspect.

## Owner's sighting: units pile on one point

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| O1 | Villagers sent to a tapped point all get the same `post` {x,y}, with no offset of their own. `qidle` in my file adds `u.ox/u.oy`, `order()` does not. Two homes, two behaviours. | 26-input.js:455-457 (vs 33-verbs.js:500, 575) | C | high: the sighting | `go()` sets `post = {x + u.ox, y + u.oy}`, the same as qidle and vhome |
| O2 | A villager whose find ran out waits at `dr.x + halfOf(dr) + 6, dr.y + 6`, the same point for every villager at that drop-off. This is the pile at the drop-off. | 13-sim-civil.js:247 | C | high: the sighting | add `u.ox`/`u.oy` (or a slot round the drop-off) to that post |
| O3 | ARRIVE = 9 is the only settling rule for villagers. A circle of radius 9 holds about 1 to 3 villagers at the 8-unit push, so the rest are pushed outside 9 and walk back in. Decision 10a was built for one villager at its own spot, not for a group on one point. | 06-rules-tuning.js:157; 09-nav.js:634 | K | high: why the pile jostles rather than settles | with O1/O2 each has its own point, and 9 is then enough |
| O4 | Soldiers: no cause found in these two files. Ground orders go through `formUp`, which gives each soldier its own slot (`gx/gy`) inside the last 90. Side effect: `phold` and `fallBack` set each soldier's own `px`, but `formUp` groups any within the same 50-unit cell and re-forms them round the first one's point, so "Holding here" shuffles. | 11-orders.js:599-613; 33-verbs.js:619-631; 12-sim-core.js:189 | S | medium | if the owner saw soldiers pile, reproduce first; hold could skip `formUp` (state other than goto, or a flag) |

## 1. Prior audit findings in these files

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| P1 | A2 (Resume closed into play): FIXED for close and back. `close` returns while `cardLocked()`, `cardback` returns on Resume. | 33-verbs.js:37, 45 | C | was high | none |
| P2 | A2, part still open: `resume()` with no save to read closes the card and unpauses with `holdSave` still true. That game never saves (saveGame returns on holdSave, force too). | 33-verbs.js:147-150 | K | medium: a session's play is never saved | in that branch open Setup (or clear holdSave and start fresh) |
| P3 | A5 (load that throws): FIXED as decided (kept aside, new game, Setup). But Setup is opened from a tap on the Resume card, so its Back returns to Resume, for a save that has just been moved aside; Resume then loads `.bak` or falls into P2. | 33-verbs.js:142-146; 27-cards-core.js:10 | K | medium | `openCard({type:'setup'}, true)` (no `from`) in the catch |
| P4 | A11 (`card:menu,land` throws): FIXED in the text. The `card` verb still builds `{type, page}`, so any future `card:menu,x` would throw again. | 33-verbs.js:351-354 | K | low | let `card:` pass `id` for menu, or forbid menu in it |
| P5 | B8 (difficulty changes the running game): FIXED. `G.diff = a` gone; newGame reads SET.diff. | 33-verbs.js:181-186; 10-world.js:45 | C | done | none |
| P6 | B2 (daily flag): FIXED. `today` passes `true`. | 33-verbs.js:220 | C | done | none |
| P7 | B13 (40-piece wall stalls a frame): FIXED as decided: one `navRebuild` after the line. New bug from it: see N1. | 11-orders.js:136-154, 963-974 | C | done | none |
| P8 | B14 (spy "unguarded" uses shot range): FIXED. `guarded` uses `spySeen(d.owner, d)`; a building always has `q`, so it reads the 140 + research row. | 11-orders.js:781-782; 08-core.js:572 | C | done | none |
| P9 | C16a: muster ignores research cost discounts: `U.cost` raw, not `unitCost(o,k)`. | 11-orders.js:68 | C | medium: discounts never reach a muster | `unitCost(o,k)[r]` |
| P10 | C16b: `hireWhy` uses `ARMYMAX`, ignores `capA`, own wording. | 11-orders.js:817 | C | medium | `armyRoom(o)` and `armyFull(o)` |
| P11 | C16c: research always queues at the first building of its kind; "That line is full" while a second one is free. `train` and `muster` pick the shortest line; research and the check both use `[0]`. | 11-orders.js:106-108, 117 | C | medium | one `shortest(o, kind)` helper for train, muster, research |
| P12 | C10 (students pulled out of School): fixed only in `sendable` and `troops`. `orderSet` (attack, recall, fallback, charge, zeal) still includes students: `recall` → `sendHome` sets state home, `attack` sets state attack; the lesson and tuition are lost. Two lists of "who can be sent". | 08-core.js:327-328; 33-verbs.js:664-672, 874-889; 11-orders.js:1075-1082 | C | high: paid tuition lost from the War card | `orderSet` excludes `state === 'school'`, or one shared filter for both lists |
| P13 | core S3: `setRel` declares war on the Natives by a second path (makePeace, then writes 'war'). | 11-orders.js:325-331 | C | low (rule: one home) | a `declareWar` branch for WILD |
| P14 | core S4: `demand` can take 0 when the store is between 0 and 1, and still costs loyalty. | 11-orders.js:484, 490 | C | low | `demandWhy` refuses when `Math.floor(Q.res[r]) < 1` |
| P15 | core S4: `musterWhy` says "Needs a X" when the reason is the age. | 11-orders.js:81 | C | low | split the age case off, as trainWhy does |
| P16 | core S2-11: `nodeName` says "Field" for a pasture, quarry, workshop, mint, foundry; hand-written names. | 11-orders.js:942-949 | C | low | `BLD[n.farm.kind].name` for plots |
| P17 | core S3: `repairCost` copies repairTick's fallback cost and 0.25 rate. | 11-orders.js:936-941; 13-sim-civil.js:448-453 | C | low (two homes) | one constant and one cost function |
| P18 | core S3: five comment lines repeat one another above `centreOf`. | 11-orders.js:1037-1041 | C | trivial | keep one |
| P19 | core S3: `ordersTick`'s `if (!G.ords) return` also skips `missionsTick` and the ord cleanup; `G.ords` still born lazily. | 11-orders.js:1120 | S | low | declare `ords: {}` in blankGame and drop the guard |
| P20 | frame S2-4: a dimmed (`dis`) button still runs its verb. `attack:near` with nobody says "Marching on the ...". | 33-verbs.js:1094-1100, 878-889 | C | medium (one rule for every button) | return after the nope flash for `dis` |
| P21 | frame S2-5: phold, scoutgo, attack, spygo, guard, unguard write state directly instead of `order()`; `attack` keeps `u.ord`, `tgt`, `focus`, so an old order's ring and line live on. | 33-verbs.js:619-631, 859-869, 878-889, 948-962, 979-1009 | C | medium (two homes) | route through `order()`/`sendHome()` |
| P22 | frame S2-7: `learn('goto')` and `learn('envoy')` are never called; those two hints never retire. | 33-verbs.js:1037-1047; 32-frame.js:452, 459 | C | low | learn them in learnAct (or where the act happens) |
| P23 | frame S2-9: any `pointermove` cancels the hold-to-read timer; a resting finger moves 1 px. | 33-verbs.js:1063-1064 | S | low | cancel only past a distance |
| P24 | frame S2-11: `tpost` checks cost before age (Stone age told "Not enough"), and says "sets out" even if `build` returns null. | 33-verbs.js:752-770 | C | low | age first; speak only on a built post |
| P25 | frame S3: pairs differing only by source: charge/pcharge, fallback/pfall, recall/precall, vgo/dismiss. | 33-verbs.js:632-648, 664-672, 874-877, 909-931 | C | low (bloat) | one verb each with a source argument |
| P26 | frame S3: resume/fresh/today/next repeat the start sequence; v80 added `freshSlate()` to three copies, so it is now worse by three lines. | 33-verbs.js:26-35, 153-162, 216-226 | C | low (two homes) | one `startGame(seed, carry, daily)` |
| P27 | frame S3: `qbuild` and `buildrow` repeat the suggestAt → MENUS lookup; `pbuild` repeats the fallback. | 33-verbs.js:80-93, 512-518, 610-618 | C | low | one `openBuild(at)` |
| P28 | frame S3: stale comments: two back to back at :93; "Warnings always show" at :1029. | 33-verbs.js:93, 1029 | C | trivial | cut or correct |
| P29 | cards 8: cancel by index; the card re-renders every 150 ms, so a tap can cancel the next order. | 33-verbs.js:700-704 | S | medium | cancel by an order id kept on the job |
| P30 | cards 9: "New soldiers here" clears a rally set elsewhere instead of moving it. | 33-verbs.js:870-873 | C | low | clear only when tapped at the same spot |
| P31 | ai 14: the trade stop's sell toggle makes a table of wares only; raw loads are then skipped. | 33-verbs.js:705-711 | S | low | include raw kinds, or treat undefined as sell |
| P32 | mutation M11a/M11b (cancel refunds): code still correct; the escaped mutants are a test gap, not a code bug. | 11-orders.js:39-48 | C | low | test owned by the gate reviewer |

## 2. v80 changes in these files

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| V1 | B13 navHold: correct for a clean line; see N1 and N2. | 11-orders.js:136-137, 153-154, 963-974 | C | | |
| V2 | B14 `guarded` → `spySeen`: correct, as decided. | 11-orders.js:782 | C | | |
| V3 | `close` locked on Resume and on Setup-while-held: correct (A2). | 33-verbs.js:37 | C | | |
| V4 | `cardback` on Resume returns: correct. | 33-verbs.js:45 | C | | |
| V5 | `resume` try/catch (A5): correct, gaps in P2 and P3. | 33-verbs.js:135-152 | K | | |
| V6 | `freshSlate()` in next, fresh, today: correct (A8, A10); not in the resume catch, which keeps the "damaged" note on purpose. | 33-verbs.js:30, 156, 219 | C | | |
| V7 | `diff` no longer writes `G.diff`: correct (B8). | 33-verbs.js:184 | C | | |
| V8 | `today` passes the daily flag: correct (B2). | 33-verbs.js:220 | C | | |

## 3. New findings

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | Under `navHold` the grid is not rebuilt between pieces, so `canPlace` (which reads `NAV.occ`) does not see pieces just laid. `wallSet` does not remove duplicates: a line that crosses or doubles back on itself lists a cell twice. In v70 the second copy was refused ("blocked"); now it is built: charged twice, two walls on one cell. | 11-orders.js:963-974; 09-nav.js:686-690; 26-input.js:41 | K | medium: double charge, stacked walls | dedupe `cells` (a Set of gx,gy) before the loop |
| N2 | `navHold` is not in try/finally; if a `build` throws during a line, the flag stays true and no later build rebuilds the grid. | 11-orders.js:963-974 | S | low | try/finally round the loop |
| N3 | `PLAY.job` gives every jobless villager the job by writing `u.job` directly, bypassing `setJob`: `post`, `wait`, `was` stay as they were, so the villager walks back to its old post when the job ends. It also takes villagers you deliberately Stopped. | 33-verbs.js:370-376 | K | medium (two homes) | `setJob(u, a)` |
| N4 | `pjob` and `vjob` put a villager on a job still locked by age; `job` and `move` check `shut()`, these two do not. | 33-verbs.js:599-609, 900-908 | K | medium: an age lock skipped | call `shut(j)` first |
| N5 | `moveVil`'s second branch (take the lowest earner from another job) is dead: its only caller, `PLAY.move`, returns first unless a free villager exists, and `freeVil` is the same test. The comment at 851 promises it. | 11-orders.js:851, 862-865; 33-verbs.js:379-382; 08-core.js:490 | C | low: dead code or a lost feature | Albert's call: drop the guard, or cut the branch and comment |
| N6 | `hunt3` calls `sendHunt` three times; with no idle villager, `pickVil` prefers food workers, which includes the hunter just sent, so one villager may be "sent" two or three times with three messages. | 33-verbs.js:827-829; 12-sim-core.js:735-745 | S | low | exclude `v.hunt === a` in sendHunt (site argument) |
| N7 | `age` and `muster` verbs refuse silently (muster only beeps); every other verb says why. `ageUp` has no Why function. | 33-verbs.js:551-555, 853-855; 11-orders.js:125-135 | K | low | an `ageWhy` and say the why for both |
| N8 | `hire` charges the full price and announces `H.n` soldiers, but only converts the vagabonds still alive at the find; fewer, or none, may join. | 11-orders.js:821-836 | S | low | count the vagabonds first, charge and announce that |
| N9 | `vgo` and `teach` take any unit id with no owner check (`vjob` has one). Only shown on your own units today. | 33-verbs.js:660-663, 909-922 | S | low | `u.owner === 0` |
| N10 | `unTrain` says "the newest" but cancels the last order in the first building in `G.blds` order. | 11-orders.js:50-59 | S | low | correct the comment, or search all lines for the newest |
| N11 | Envoy cost and age-up cost are raw table costs while units and research go through `unitCost`/`techCost`. May be intended. | 11-orders.js:129-131, 319, 364-365 | S | low | Albert's call: should research discounts touch them |
