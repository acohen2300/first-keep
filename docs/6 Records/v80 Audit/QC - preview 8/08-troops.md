# QC 8 of 13: troops, spatial, fight (v80 HEAD c3b4964 against v70 88b2cb2)

Read in full: src/14-sim-troops.js (617), src/15-sim-spatial.js (214), src/16-sim-fight.js (403). Helpers looked up: 08-core (hawkP, groupSees, unitPower, atWar, temperOf), 09-nav (moveTo, route, findBlocker), 23-view-things 749-751 (walk frames), 38-natives natSync, 02-rules-units animals. Read only; no browser run.

Tags: C traced, sure · K fairly sure · S suspect. Lines are HEAD lines.

## 1. Prior findings

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| P-C1 | STILL PRESENT. Hostility still runs through atWar(o, WILD); natSync still sets peace with WILD; wildTick attacks with no relation check. The hostility split of decision 8 (outlaws always hostile, Natives by relations) is not built, though CUTS preview 4 reads as if 8 were done. Now compounded by V3: at peace a side cannot even defend villagers from wolves. | 15:48, 15:104; 14:473-482; 38-natives:16-38 | C | high | one `hostile(o,v)`: Natives by G.rel, all other WILD always hostile; use in nearestFoe, bestFoe, nearestFoeBld, wildTick |
| P-C2 | STILL PRESENT. groupPower takes max(p, own) not p + own (unitsNear skips self). | 15:84 | C | med | `u.gp = p + unitPower(u)` |
| P-C3 | STILL PRESENT. Lone soldier: facing sum has no own facing, returns 0 (side) for every blow. `t.fx === undefined` (16:5) and `v === t` (16:17) still dead. | 16:10-25 | C | med | seed fx, fy with t.fx, t.fy |
| P-C4 | STILL PRESENT. Half damage and no nerve keyed on owner WILD, not on animal; N4 decided, not built (batch 5). | 16:59, 16:63 | C | med | test `hasTag(a.kind,'animal')` |
| P-C5 | STILL PRESENT. Nerve drained from d before armour, shape, vsMounted, FLANK. | 16:62-66 vs 16:71-77 | C | med | final d first, then drain nerve once |
| P-C6 | STILL PRESENT. Engagement halves routT, capture test uses fixed MORALE.rout-2, so capturable at once. | 14:233, 14:329 | C | low | store routAt, test `G.t - routAt > 2` |
| P-C7 | BEHAVIOUR KEPT per N5, but the comment fix N5 asked for is not done: still says "a half-dead soldier takes the time it did"; 14:170 still says "garrisoned" (it is only near). | 14:89-91, 14:170 | C | low | rewrite comment: τ = max/heal, 95% at ~3τ |
| P-C8 | STILL PRESENT. Conversion keeps t.native, no army ceiling check. | 14:41-51 | C | med | clear native; refuse when clsCount ≥ clsMax |
| P-C9 | STILL PRESENT. Wild reach adds halfOf to a wall-gap test (horde hits from rng+35); petard splash sets no by/byT (no plunder) and scans all G.blds. | 14:499-500; 16:41-43 | C | low | halfOf only in moveTo radius; set n.by/byT; bldsNear |
| P-C10 | FIXED outside these files (school soldiers left out). solTick school branch unchanged. | 40-emergency:22; 28-army-quick:62; 14:128-132 | K | low | none |
| P-C20 | FIXED for d = 0: direction from ids, deterministic, total separation 8 − 0.01. Residual: the direction is fixed, so if both pushed cells are blocked (a one-cell lane across that direction) neither moves, every tick, for ever. | 16:151-156; 16:168-175 | K (fix) / S (residual) | low | on a blocked push try the perpendicular (g + 90°) |
| P-B2 | PARTLY FIXED (villagers grouping/glitching). Tie-break built; arrival radius 9 only for villagers at work (09-nav:627). Decision 10a said "a unit": soldiers, priests, medics and animals still pull to the exact spot with r = 3 (14:74, 14:87, 14:386, 14:393, 14:510) against the 8 push, so two with near-equal spots tremble in place. | 09-nav:627; 14 lines listed | K | med | one ARRIVE rule in moveTo for every unit not chasing a target |
| P-B3 | PARTLY FIXED (animals slide like ice). Unit direction and wall slide are right. The cause of the look remains: the flee step moves the deer 40 px/s and sets mvT but never adds to u.st.walk; the view picks the leg frame from st.walk / STRIDE, so the deer moves with its legs frozen in one frame: it skates. | 14:447-450; 23-view-things:749-751 | C | high (owner sighting) | add `u.st.walk += hyp(x1-u.x, y1-u.y)` before the move (better: one step helper, see G1) |
| P-B3b | Decision 12's "give up a run below half speed" does not hold: u.run = null lasts only until the next look (≤ 6 ticks), which rebuilds the same away vector into the same wall; between looks the deer walks to its old graze spot (maybe toward the threat). Result: stutter at walls, and a cornered deer steps in place (mvT set with no motion). | 14:418-420, 14:437, 14:440, 14:444, 14:462 | K | med | on give-up keep sliding along the open axis (or flip to the tangent), and hold off re-looking ~1 s |
| P-B4 | PARTLY FIXED (new soldiers chase odd things). Animals are out of the home sweep. Left: (a) a held target is never re-tested by ignorable: the validity test and the keep rule hold an animal after it leaves the civilian, within 320 of yard/TC or 1.4× sight; (b) the 320 sweep is distance from the yard or TC, not sight and not canBeat, so a lone new soldier walks into fog after a bandit, robber or camp guard up to 320 off (people hazards were kept on purpose by decision 13, but not "in sight"). | 14:249-259, 14:268-277; 14:280-284 | K | high (owner sighting) | treat cur as null when ignorable(cur, o); gate the sweep with groupSees(o, v) and canBeat |

## 2. v80 changes in these files

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| V1 | Hawk-Dove matches SCIENCE.md:74: p = V/C, all fight when C ≤ V, V = 1, C = power(intruder)/power(self), drawn with seeded rng once in 10 s; a hurt animal (aggro) always fights. Correct as decided. | 14:487-491; 08-core:641 | C | — | none |
| V2 | The 10 s draw is one slot per animal: when the nearest stranger alternates between two (re-picked every 5 ticks), each switch re-draws, so the real fight chance is above V/C. Also at the 10 s re-draw a boar mid-fight (not yet hurt) can turn Dove and walk off. | 14:469-491 | K | low | keep the draw per intruder id (small map) or hold the target once Hawk is drawn |
| V3 | Soldiers (and towers, which use nearestFoe) never strike back at an animal that is biting them: ignorable is true unless the animal's target is a civilian. The wolf's "hunt" temper (canBeat) is not built, so wolves still attack soldiers at 14:473-482 and the soldier stands there. Literal to decision 8, but the C1 repro (sword 70→47.5, never struck back) is now true at war too. | 15:27-30; 14:473-482 | C | high | ignorable false also when v.tgt is one of o's units (any), i.e. self-defence; build the wolf canBeat |
| V4 | groupSees scans every unit and building, called per candidate animal per soldier per look; N16b said "use the spatial grid". | 15:29 → 08-core:597-599 | K | low (perf) | query unitsNear / bldsNear with max sight |
| V5 | Deer step: unit direction, axis wall slide v' = v − (v·n)n is exact for the grid's axis-aligned walls; diagonal no longer √2 fast. Correct. | 14:429-446 | C | — | none |
| V6 | Same-spot tie-break correct and deterministic (see P-C20 residual). | 16:151-156 | C | — | none |
| V7 | B5 Throne handover runs after the plunder loop, so the killer is paid a quarter of the cost of citadel buildings that then pass to the Natives and stand. | 16:261-284 | S | low | hand over the Throne block before the plunder loop |
| V8 | Science note, not a bug: an owner against an intruder is the asymmetric game, whose ESS is "Bourgeois" (owner fights) (Maynard Smith & Parker 1976, from memory); V/C is the symmetric mix. The row names V/C as a design mapping, which is honest. | SCIENCE.md:74 | S | low | none, or record the choice in the row |

## 3. Glides (moves that are not steps)

The view walks a figure only when `G.t - mvT < 0.15` and advances the legs by `st.walk / STRIDE` (23-view-things:749-751). Only moveTo (09-nav:662-667) and the deer flee step set mvT; only moveTo adds st.walk.

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| G1 | pushApart, knockback, the lake push and the freeNear rescue all move x, y with no mvT and no st.walk: the figure slides standing. A walker (heft 3) shoves a standing unit (heft 1) 75% of up to 8 px a tick, so a column passing a crowd makes the crowd glide. This is the owner's "units glide without stepping". | 16:168-175, 16:99-102, 16:213-217, 16:221-227 | C | high (owner sighting) | one `step(u, nx, ny)` home (adds st.walk, sets mvT above 0.3) used by moveTo, the flee step and pushApart; leave knock and rescue as flashes |
| G2 | The reverse: moveTo sets mvT and adds st.walk = m before the wall test, so a fully blocked unit walks in place and its walk count grows; the deer flee step sets mvT when cornered with no motion. | 09-nav:651-667; 14:441-450 | K | low | count the real displacement after the slide |

## 4. New

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | u.aggro is never cleared except by the leash: a boar or bear keeps its first attacker for the rest of the game and skips the Hawk-Dove draw for it on every later meeting. | 14:471, 14:494-497; 16:111 | K | low | clear aggro when the target leaves STARTLE or after ~60 s |
| N2 | Grid staleness (old S2-13) still: nearU and unitsNear pad by 0 while units move and are knocked up to ~8 px after the grid is built. | 15:118-139, 15:191-207 | S | low | one grid walk with pad 8 (old S3-3) |

Counts: C 15 · K 9 · S 4 (27 rows; P-C20 carries K for the fix and S for the residual; V1, V5, V6 are confirmations that the code is right).
