# QC 7: src/12-sim-core.js, src/13-sim-civil.js (v80 HEAD vs v70 88b2cb2)

Read only. Both files read in full; searchR/SEARCH (06-rules-tuning 158-159), setJob (11-orders 839), startWork (16-sim-fight 381), moveTo arrival (09-nav 634), freeVil (08-core 490), save (34-save 184) read where they bear.

## Owner's sighting, traced
Berries run out -> villager delivers first (13:134-168), then searches from the drop-off, radius 90 growing to 180 (12:683, 06:159). Next berry cluster is farther than 180 -> no find. For 35 s (tau 10 + give 25, 13:231) it keeps its job, stands where it delivered (the mill's edge), u.idle = true -> Zs (23-view 891). After 35 s it drops the job (13:246) and walks to u.post = {mill.x + half + 6, mill.y + 6} (13:247): the SAME point for every villager of that mill -> they pile on one spot, Zs, and never look again (job null; only an order restarts them). Decision 1 says wait at the drop-off and re-look every few seconds with no end; the 25 s give-up is not in the decision.
The one holding a berry (S): the pile stands at mill edge + 6, exactly on the band a carrier must reach (moveTo arrival to a building = rectGap <= 6, 09-nav 631); the carry branch has no no-path/blocked exit (13:161), so a carrier pushed by the pile keeps its load. Not reproduced.

## 1. Prior findings
| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| P1 | C11 still present: drop-off stashes Math.round(carry) (0.45 -> 0, 2.5 -> 3); shop door the same and skips st.got | 13:162, 13:326 | C | resources made and lost on every partial load (each find that runs out) | stash u.carry unrounded at both |
| P2 | C13 fixed: fish now pay the walk to the nearest food drop (dock drops food) | 12:611 | C | fixed | none |
| P3 | C14 fixed in repairTick: all four exits call backToWork, stale pj cleared | 13:381-387, 406, 412, 417, 442, 459 | C | fixed | none |
| P4 | C14 one-home only partly: vilTick still hand-writes the pj restore twice; fire exit sets fireman=false then backToWork sets it again | 13:238-243, 13:269-271, 13:411 | C | RULES 0 one home; low | route both through backToWork; drop 13:411 |
| P5 | C15a still present: shepherd milk applies hungerOf only, not starving(), sickness, circus | 13:196 | C | food made while starving | share makeNow's multiplier |
| P6 | C15b still present: fisher keeps fishing after its dock is gone (leave test has no dockNear) | 13:221 | C | food without a dock | add n.kind==='fish' && !dockNear to 13:221 |
| P7 | C15c still present: morale loss uses unitsNear box, no dist test (corners 56 not 40) | 12:301-303 | C | morale wider than SCIENCE says | dist(u,v) < MORALE.lossR in callback |
| P8 | C12 still present: computer spy in 'look' walks home on 14 of 15 ticks | 13:621, 13:657 | C | computers' spies useless | move %15 inside the branch, always return |
| P9 | Bug 1 partly addressed: grace window and widening radius added; idle-at-drop-off still the end state after 35 s, now with no re-look (see N1) | 13:231-256 | C | owner's sighting | see N1, N2 |
| P10 | Prior S2-11 still present: built() heals a damaged site to 0.999 max | 12:453 | S | free heal | decide if meant |
| P11 | Prior S2-13 still present: scout can stand forever at an unreachable treasure (no noPathT) | 13:489-504 | S | stuck scout | skip finds with noPathT |
| P12 | A-group: none of A1-A11 has code in these files. Related: the save rounds every float to 0.01 (34-save 285), so carry, lostT, nnT, G.t change on reload | 34-save:285 | K | A6 same-game; tiny | keep floats for sim fields |
| P13 | B6 (v80, in 12): when the shown wonder falls, the next is G.blds.find order, not the earliest wend; comment at 12:468 says "the one standing longest" | 12:114-115 | C | wrong win clock with 3 wonders; rare | pick the min wend |
| P14 | B6: wonders from a pre-v80 save have no wend and are ignored when the shown one falls | 12:114 | S | old saves only | set wend on load |
| P15 | B7 (v80): b.mx = maxHpB written twice in built() | 12:452, 12:460 | C | dead line, patch on patch | delete 12:460 |

## 2. Decision 1 vs the v80 code
| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| D1 | "look from that spot before going home; if seen, deliver then go straight to it": not built. A carrier delivers first, then searches from the drop-off; a find 80 from the spent bush but 150 from the mill is missed until r grows | 13:134-168, 13:230 | C | up to 10 s idle per trip, wrong first pick | search once at the spent find, remember the pick, go there after delivery |
| D2 | "If nothing is found ... wait at the drop-off, shown as idle, re-look every few seconds": code adds a 25 s give (SEARCH.give) then drops the job and never re-looks | 13:231, 13:236-256, 06:158 | C | THE sighting: permanent idle | delete give; keep job, re-look every 2-3 s at the drop-off |
| D3 | Anchor "the spot you placed it": no placed anchor exists while working (setJob clears u.post); search is from wherever the villager stands | 12:683, 11-orders:845 | C | placed villagers search from the wrong place | keep an anchor on the villager, measure from it |
| D4 | Carry-0 case (find emptied by another): villager waits at the spent find, not at the drop-off, and the 180 radius runs from there | 13:231-235 | C | decision says deliver/go to drop-off then search | walk to the anchor before the timed search |
| D5 | Leash 200 (DANGER_R.far) from the nearest drop-off: not built | 12:683 | C | with D4 a villager can pick a find far beyond 200 from any drop | add dist(nearest drop, n) <= DANGER_R.far for unplaced |
| D6 | Cap rule for placed villagers ("outside the cap, wait"): not built | 13:231 | C | as D3 | build with D3 |
| D7 | Candidates "plus finds friends are working": not built | 12:662-686 | C | fewer candidates than decided | add nodes with an ally's worker on them |
| D8 | "Skip the danger map": code still drops finds on the danger map (unsafe) | 12:666 | K (wording ambiguous) | fewer candidates | ask Albert: skip = ignore it, or = do not add it |
| D9 | "same-kind finds your side has seen": only the player is held to sight (known0); computers see every node | 12:668 | C | computers never go idle for lack of sight; one-sided rule | apply a seen test to computers too, or record the exception |
| D10 | Shown as idle: waiting villagers show Zs (u.idle) but keep a job, so freeVil / idle counter / idle button / pickVil-first do not count them | 13:233, 08-core:490, 32-frame:548 | C | player sees Zs, counter says 0 idle | decide one idle meaning |
| D11 | Rate R, radius r = 90 + 90 min(1, t/10), re-look 2-3 s, numbers in the rules table: as decided | 06:158-159, 12:691, 13:232 | C | ok | none |

## 3. New bugs
| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | All waiting villagers of one drop-off get the same post point; they stack within ARRIVE 9 of it (piled, Zs) | 13:247 | C | the pile in the sighting | spread posts (ring by id) or drop the post |
| N2 | lostT is cleared only at 13:280; setJob does not clear it. Any node given another way (startWork after building a mill/dock, a tap order to a field, a carcass via died(), the reconsider switch, a hunt at 13:274) keeps a stale lostT: next time the find runs out the 35 s grace is skipped (instant give-up) and the radius starts at 180 | 13:274-280, 13:302, 11-orders:843, 16:385, 12:322 | C | instant idle after any earlier loss; computers lose the grace after every hunt | clear lostT in setJob and wherever u.node is set (one home) |
| N3 | Carry branch has no no-path or blocked exit: a carrier whose drop is unreachable or crowded keeps walking with its load for good | 13:161 | K | stuck worker, load never banked; likely the berry holder | on noPathT pick another drop or wait |
| N4 | Reconsider with a stale lostT (N2) searches 180 instead of 90 | 12:683, 13:293 | K | small churn | fixed by N2 |
| N5 | Player-only grace message: after give-up the player gets news; computers silently idle until think() reassigns (17-ai 287) | 13:248-255 | K | asymmetry by design, not recorded | note in EXCEPTIONS or leave |
| N6 | Wild wk is only incremented between recounts (never decremented on leave) | 13:281, 13:301 | K | crowd term wrong up to 1 s | one home for wk (prior S3) |
