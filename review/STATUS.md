# Where the 18 reports stand (Nov 22, evening)

Read against `fresh` at 7a334585 plus today's fixes. Item numbers are each report's own.

## Fixed before today (night push round 2, Nov 21)
- ai 1, 2, 3, 4, 6
- combat 1, 2, 5, 9, 10
- econ 1, 2, 3, 4, 5
- idx1 1, 3, 4
- idx2 1, 2, 3, 4, 6
- idx3 1, 2, 3, 4, 5, 6, 7
- idx4 1, 3, 4
- idx6 1, 2, 3, 4, 13
- menu1 1, 2, 3 (Random on a Daily), 7
- menu2 7, 8, 9
- v-ai 1, 3, 4
- v-econ 1 to 6
- v-front 1, 2, 3, 4, 6, 7
- v-routes 1, 2, 6
- v-war 1, 3, 4, 6, 7, 9

## Fixed today (Nov 22)
- ai 7: a freed rebel attacks again
- ai 9: the AI build goal asks for stock
- ai 10 / v-ai 6: saves keep the computers' dealt plans
- combat 3: archers and engines stop within reach
- combat 4: the tapped man counts in his group
- econ 10: caravan spice priced with trade research
- econ 12: ruins scroll only teaches own-civ research
- idx4 9: safe list removal
- idx6 14: a soldier stood down at peace doesn't die on screen
- menu1 4: New game and Delete ignore double taps
- menu1 11: the more tile's count
- menu2 11: a second finger no longer breaks button holds
- menu2 13: a map tap sends fighters only
- v-routes 5: no-way memory ends when the land changes
- v-routes 7: a resumed march reaches buildings
- v-war 8: Retreat's words
- v-war 12, 15: dead CSS removed
- v-war 13: Mode is built

## Albert's calls (not fixed: each changes the design)
- econ 6: five paid techs do nothing (Midwives, Local guides, Law code, Magistrates, Chimney). Build their effects or remove them?
- menu1 3: the Start page's "Allies" switch does nothing
- ai 5 + round 2: should computers sell surplus at the market (reverses his Nov 5 ruling) or get a hoard-spending rule?
- ai 8 / v-ai 5: side names no longer match how the sides play
- idx1 2: Willow never grows (fixing it changes how every map looks)
- v-war 5: a mission tapped with nobody picked orders the whole army and turns the eye off
- v-war 10 / menu1 10: red box = set. A set mission shows a white ring; every Exit button shows a permanent red box
- v-war 14: the bell's tap area is 28 px wide (rule: 44)
- econ 11: a villager on a spent farm or shaft "works" forever and never shows idle

## Small, still open (no call needed)
- combat 6 / idx4 2 / v-routes 4: the no-way memory still keys on the heuristic tile, not the goal
- idx4 5: the news delay routes with no walker, so it avoids every forest and gate
- idx2 5: a reload wipes the battle marks off the ground
- idx3 8: snow flecks on a Yew land off its crown
- menu2 10 / v-war 11: the press look on pause, mail and the eye
- idx1 5, idx1 6: forest lattice reach; a robbers' camp skips the open-ring test (both unsure)
- v-ai 2: the villager cap can crowd out the army aim
- v-ai 7: an aggressive plan dealt walls rarely builds them (unsure)

## Frames: belongs to Build 3 (freezes)
- combat 7, 8, 11, 12, 13, 14
- econ 7, 8, 9, 14
- idx2 7, 8, 9
- idx4 6, 7
- idx6 5 to 12
- menu1 5, 6
- menu2 1 to 6, 12
- v-econ 8
- v-front 5
- v-routes 3

## Rule clean-up (numbers and words in code, dead code): last
- ai 11, 12
- combat 15
- econ 13
- idx1 7 to 10
- idx2 10, 11, 12
- idx3 9
- idx4 8
- idx6 15
- menu1 8, 9
- menu2 14, 15
- v-ai 8
- v-econ 7
- v-front 8
- v-routes 8

## Specs waiting for him
- spec-roads: bridges and fords
- spec-camera: follow a unit; snap to idle soldiers
