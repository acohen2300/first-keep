# Mid · the map

Written by `v100/index.py --survey`, never by hand. Mid is frozen: 51 parts in `mid/src/`, sealed; joined, they are `mid/index.html` byte for byte.

Typed numbers: numbers and colours typed into code (they belong in a book). Asks by name: `kind === 'tree'` and the like (ask by tick). Swallowed: a comment ending in code. Named nowhere else: a top-level name used nowhere but where it is made (dead, or an entry point).

## The whole

| What | Pieces | Lines | Characters | Bytes | Typed numbers | Asks by name | Swallowed | Named nowhere else |
|---|---|---|---|---|---|---|---|---|
| Mid | 1,584 | 33,957 | 1,272,150 | 1,279,351 | 22,937 | 354 | 1 | 0 |

## By group (step 3, from `groups.json`)

| Group | Into v100 | Pieces | Lines | Characters | Bytes | Typed numbers | Asks by name | Swallowed | Named nowhere else |
|---|---|---|---|---|---|---|---|---|---|
| Element cards | Capabilities book (Mid's cards are the first form of ticks) | 4 | 27 | 2,176 | 2,196 | 5 | 0 | 0 | 0 |
| Numbers | Measurements, Shells, Mass, Ground books | 150 | 2,581 | 103,299 | 104,141 | 2,338 | 0 | 0 | 0 |
| Ages and tech | new: Tech book, applied by one law | 7 | 3,375 | 73,123 | 73,159 | 1,812 | 0 | 0 | 0 |
| Words | new: Words book | 19 | 1,215 | 103,803 | 104,005 | 414 | 0 | 0 | 0 |
| Core | index.html, the core floors | 185 | 957 | 47,164 | 47,714 | 398 | 14 | 0 | 0 |
| Walking grid | index.html, the ground and paths floor | 48 | 846 | 34,215 | 34,437 | 368 | 10 | 0 | 0 |
| World | index.html, the world floor | 70 | 1,095 | 52,496 | 53,361 | 691 | 9 | 0 | 0 |
| Orders and economy | econ.js | 256 | 3,878 | 151,377 | 152,607 | 1,287 | 89 | 0 | 0 |
| War | combat.js | 79 | 1,523 | 61,958 | 62,375 | 572 | 32 | 0 | 0 |
| Computers | ai.js | 36 | 782 | 36,855 | 37,048 | 340 | 10 | 0 | 0 |
| Art | Sprites book and the brushes in index.html | 93 | 5,134 | 122,368 | 122,642 | 7,553 | 24 | 0 | 0 |
| View | index.html, the display floor | 178 | 3,369 | 127,181 | 127,457 | 3,508 | 45 | 0 | 0 |
| Touch | index.html, the touch floor | 34 | 669 | 21,388 | 21,512 | 161 | 12 | 0 | 0 |
| Menus | menu.js and the Screen book | 248 | 4,871 | 212,969 | 214,200 | 1,896 | 65 | 0 | 0 |
| Saving | new: a save module | 20 | 771 | 27,462 | 27,595 | 211 | 6 | 0 | 0 |
| Sound | sound.js and the Sound book | 32 | 478 | 14,907 | 15,043 | 488 | 1 | 0 | 0 |
| Events, camps, natives, peace | new: an events module, its numbers in the books | 113 | 1,636 | 67,062 | 67,392 | 784 | 37 | 1 | 0 |
| Start | index.html, the loop and start | 12 | 750 | 12,347 | 12,467 | 111 | 0 | 0 | 0 |

## By part

| Part | Group | Pieces | Lines | Characters | Bytes | Typed numbers | Asks by name | Swallowed | Named nowhere else |
|---|---|---|---|---|---|---|---|---|---|
| 00-elements.js | Element cards | 3 | 25 | 2,153 | 2,173 | 5 | 0 | 0 | 0 |
| 00-pre.js | Element cards | 1 | 2 | 23 | 23 | 0 | 0 | 0 | 0 |
| 01-rules-basics.js | Numbers | 32 | 140 | 10,716 | 10,861 | 214 | 0 | 0 | 0 |
| 02-rules-units.js | Numbers | 4 | 761 | 18,245 | 18,270 | 433 | 0 | 0 | 0 |
| 03-rules-buildings.js | Numbers | 18 | 848 | 23,775 | 23,806 | 670 | 0 | 0 | 0 |
| 04-rules-tech.js | Ages and tech | 7 | 3,375 | 73,123 | 73,159 | 1,812 | 0 | 0 | 0 |
| 05-rules-wild.js | Numbers | 11 | 309 | 9,979 | 10,105 | 282 | 0 | 0 | 0 |
| 06-rules-tuning.js | Numbers | 85 | 523 | 40,584 | 41,099 | 739 | 0 | 0 | 0 |
| 07-text.js | Words | 19 | 1,215 | 103,803 | 104,005 | 414 | 0 | 0 | 0 |
| 08-core.js | Core | 160 | 763 | 38,675 | 39,052 | 315 | 11 | 0 | 0 |
| 09-nav.js | Walking grid | 48 | 846 | 34,215 | 34,437 | 368 | 10 | 0 | 0 |
| 10-world-citadel.js | World | 2 | 34 | 1,941 | 1,963 | 19 | 0 | 0 | 0 |
| 10-world-forest.js | World | 11 | 203 | 9,990 | 10,011 | 133 | 6 | 0 | 0 |
| 10-world-ground.js | World | 11 | 91 | 4,890 | 5,221 | 48 | 0 | 0 | 0 |
| 10-world-movers.js | World | 5 | 43 | 2,051 | 2,071 | 23 | 0 | 0 | 0 |
| 10-world-plots.js | World | 8 | 234 | 12,814 | 12,834 | 205 | 3 | 0 | 0 |
| 10-world-water.js | World | 22 | 196 | 10,204 | 10,531 | 129 | 0 | 0 | 0 |
| 10-world.js | World | 11 | 294 | 10,606 | 10,730 | 134 | 0 | 0 | 0 |
| 11-orders.js | Orders and economy | 121 | 1,232 | 47,517 | 48,061 | 280 | 15 | 0 | 0 |
| 12-sim-core.js | Orders and economy | 34 | 815 | 33,798 | 34,181 | 358 | 25 | 0 | 0 |
| 13-sim-civil.js | Orders and economy | 24 | 876 | 33,634 | 33,774 | 276 | 15 | 0 | 0 |
| 14-sim-troops.js | War | 19 | 661 | 25,073 | 25,314 | 277 | 12 | 0 | 0 |
| 15-sim-spatial.js | Core | 25 | 194 | 8,489 | 8,662 | 83 | 3 | 0 | 0 |
| 16-sim-fight.js | War | 21 | 453 | 17,780 | 17,903 | 149 | 11 | 0 | 0 |
| 17-ai.js | Computers | 36 | 782 | 36,855 | 37,048 | 340 | 10 | 0 | 0 |
| 18-figures.js | Art | 37 | 2,067 | 45,959 | 46,095 | 2,543 | 5 | 0 | 0 |
| 19-building-art.js | Art | 56 | 3,067 | 76,409 | 76,547 | 5,010 | 19 | 0 | 0 |
| 20-view-base.js | View | 40 | 263 | 10,246 | 10,380 | 194 | 0 | 0 | 0 |
| 21-view-frame.js | View | 6 | 384 | 15,684 | 15,704 | 389 | 1 | 0 | 0 |
| 22-view-fog.js | View | 18 | 174 | 7,034 | 7,054 | 156 | 2 | 0 | 0 |
| 23-view-things.js | View | 68 | 1,598 | 58,100 | 58,151 | 1,850 | 32 | 0 | 0 |
| 24-view-overlays.js | View | 34 | 720 | 27,775 | 27,802 | 661 | 7 | 0 | 0 |
| 25-view-weather.js | View | 12 | 230 | 8,342 | 8,366 | 258 | 3 | 0 | 0 |
| 26-input.js | Touch | 34 | 669 | 21,388 | 21,512 | 161 | 12 | 0 | 0 |
| 27-cards-core.js | Menus | 63 | 526 | 27,246 | 27,408 | 162 | 21 | 0 | 0 |
| 28-army-quick.js | War | 39 | 409 | 19,105 | 19,158 | 146 | 9 | 0 | 0 |
| 29-card-pages.js | Menus | 31 | 576 | 30,216 | 30,422 | 215 | 2 | 0 | 0 |
| 30-cards.js | Menus | 7 | 846 | 38,806 | 39,008 | 186 | 14 | 0 | 0 |
| 31-guide.js | Menus | 11 | 269 | 9,572 | 9,623 | 13 | 0 | 0 | 0 |
| 32-frame.js | Menus | 52 | 712 | 39,136 | 39,499 | 771 | 6 | 0 | 0 |
| 33-verbs.js | Menus | 13 | 1,138 | 31,755 | 31,893 | 200 | 15 | 0 | 0 |
| 34-save.js | Saving | 20 | 771 | 27,462 | 27,595 | 211 | 6 | 0 | 0 |
| 35-sound.js | Sound | 32 | 478 | 14,907 | 15,043 | 488 | 1 | 0 | 0 |
| 36-economy.js | Orders and economy | 77 | 955 | 36,428 | 36,591 | 373 | 34 | 0 | 0 |
| 37-events.js | Events, camps, natives, peace | 50 | 761 | 27,899 | 28,046 | 447 | 11 | 0 | 0 |
| 38-camps.js | Events, camps, natives, peace | 20 | 306 | 14,306 | 14,335 | 140 | 13 | 1 | 0 |
| 38-natives.js | Events, camps, natives, peace | 25 | 362 | 14,866 | 14,991 | 118 | 13 | 0 | 0 |
| 39-games.js | Events, camps, natives, peace | 18 | 207 | 9,991 | 10,020 | 79 | 0 | 0 | 0 |
| 39-huddle.js | Menus | 55 | 638 | 29,547 | 29,635 | 291 | 3 | 0 | 0 |
| 40-emergency.js | Menus | 16 | 166 | 6,691 | 6,712 | 58 | 4 | 0 | 0 |
| 41-boot.js | Start | 12 | 750 | 12,347 | 12,467 | 111 | 0 | 0 | 0 |

## By section

| Part | Section | Pieces | Lines | Characters | Bytes | Typed numbers | Asks by name | Swallowed | Named nowhere else |
|---|---|---|---|---|---|---|---|---|---|
| 00-elements.js | (top of the file) | 3 | 25 | 2,153 | 2,173 | 5 | 0 | 0 | 0 |
| 00-pre.js | (top of the file) | 1 | 2 | 23 | 23 | 0 | 0 | 0 | 0 |
| 01-rules-basics.js | (top of the file) | 1 | 1 | 104 | 124 | 1 | 0 | 0 | 0 |
| 01-rules-basics.js | The rules: every number lives in a table | 31 | 139 | 10,612 | 10,737 | 213 | 0 | 0 | 0 |
| 02-rules-units.js | (top of the file) | 4 | 761 | 18,245 | 18,270 | 433 | 0 | 0 | 0 |
| 03-rules-buildings.js | (top of the file) | 18 | 848 | 23,775 | 23,806 | 670 | 0 | 0 | 0 |
| 04-rules-tech.js | (top of the file) | 7 | 3,375 | 73,123 | 73,159 | 1,812 | 0 | 0 | 0 |
| 05-rules-wild.js | (top of the file) | 4 | 69 | 2,788 | 2,808 | 36 | 0 | 0 | 0 |
| 05-rules-wild.js | The Natives: the fifth side, with one brain | 7 | 240 | 7,191 | 7,297 | 246 | 0 | 0 | 0 |
| 06-rules-tuning.js | (top of the file) | 6 | 14 | 1,017 | 1,039 | 21 | 0 | 0 | 0 |
| 06-rules-tuning.js | Combat you steer: nerve, flanks, charge and fall back, prisoners, conv | 9 | 50 | 3,994 | 4,100 | 73 | 0 | 0 | 0 |
| 06-rules-tuning.js | The climate (Build 54): the whole game reads three numbers, the air's  | 31 | 158 | 15,826 | 15,973 | 294 | 0 | 0 | 0 |
| 06-rules-tuning.js | The world's own numbers: weather, soil, sickness, the trade routes, th | 5 | 25 | 1,576 | 1,678 | 19 | 0 | 0 | 0 |
| 06-rules-tuning.js | The Challenge: hazards you switch on. Their points are your level; the | 34 | 276 | 18,171 | 18,309 | 332 | 0 | 0 | 0 |
| 07-text.js | (top of the file) | 4 | 14 | 794 | 814 | 11 | 0 | 0 | 0 |
| 07-text.js | Why it is so: the history behind each row | 15 | 1,201 | 103,009 | 103,191 | 403 | 0 | 0 | 0 |
| 08-core.js | (top of the file) | 1 | 1 | 61 | 81 | 1 | 0 | 0 | 0 |
| 08-core.js | Small helpers | 51 | 252 | 12,234 | 12,362 | 130 | 0 | 0 | 0 |
| 08-core.js | Queries | 52 | 221 | 11,403 | 11,505 | 57 | 4 | 0 | 0 |
| 08-core.js | The sky (Build 55): the sun's height from the calendar and the land's  | 20 | 53 | 3,505 | 3,517 | 36 | 2 | 0 | 0 |
| 08-core.js | Effects: research, civilisation and buildings, by table | 36 | 236 | 11,472 | 11,587 | 91 | 5 | 0 | 0 |
| 09-nav.js | (top of the file) | 1 | 3 | 292 | 312 | 3 | 0 | 0 | 0 |
| 09-nav.js | The walking grid: where things stand, and how people get around | 37 | 649 | 25,135 | 25,236 | 286 | 5 | 0 | 0 |
| 09-nav.js | Placement | 10 | 194 | 8,788 | 8,889 | 79 | 5 | 0 | 0 |
| 10-world-citadel.js | (top of the file) | 2 | 34 | 1,941 | 1,963 | 19 | 0 | 0 | 0 |
| 10-world-forest.js | (top of the file) | 11 | 203 | 9,990 | 10,011 | 133 | 6 | 0 | 0 |
| 10-world-ground.js | (top of the file) | 1 | 3 | 411 | 434 | 7 | 0 | 0 | 0 |
| 10-world-ground.js | A corner's quarter | 4 | 10 | 786 | 888 | 5 | 0 | 0 | 0 |
| 10-world-ground.js | The taken list | 3 | 20 | 1,450 | 1,550 | 24 | 0 | 0 | 0 |
| 10-world-ground.js | The turn (preview 51) | 3 | 58 | 2,243 | 2,349 | 12 | 0 | 0 | 0 |
| 10-world-movers.js | (top of the file) | 5 | 43 | 2,051 | 2,071 | 23 | 0 | 0 | 0 |
| 10-world-plots.js | (top of the file) | 8 | 234 | 12,814 | 12,834 | 205 | 3 | 0 | 0 |
| 10-world-water.js | (top of the file) | 1 | 6 | 790 | 810 | 10 | 0 | 0 | 0 |
| 10-world-water.js | The shape | 11 | 30 | 2,013 | 2,113 | 12 | 0 | 0 | 0 |
| 10-world-water.js | Block: the water on the walking grid | 2 | 32 | 1,388 | 1,488 | 25 | 0 | 0 | 0 |
| 10-world-water.js | Lay: the lakes and rivers, in the land's frame | 8 | 128 | 6,013 | 6,120 | 82 | 0 | 0 | 0 |
| 10-world.js | (top of the file) | 1 | 1 | 138 | 158 | 2 | 0 | 0 | 0 |
| 10-world.js | The world | 10 | 293 | 10,468 | 10,572 | 132 | 0 | 0 | 0 |
| 11-orders.js | (top of the file) | 1 | 1 | 61 | 81 | 1 | 0 | 0 | 0 |
| 11-orders.js | Orders anyone can give (the computers use the same ones) | 32 | 306 | 11,660 | 11,760 | 56 | 8 | 0 | 0 |
| 11-orders.js | Diplomacy: one table of relations, one way to change them | 17 | 225 | 9,334 | 9,434 | 36 | 0 | 0 | 0 |
| 11-orders.js | A lord's hand on a vassal: cut them loose, demand, force tribute, call | 14 | 103 | 3,719 | 3,725 | 26 | 0 | 0 | 0 |
| 11-orders.js | Combat you steer: charge, fall back, prisoners | 7 | 81 | 3,171 | 3,271 | 23 | 0 | 0 | 0 |
| 11-orders.js | Teach: a soldier of an older kind learns a newer one at the School. It | 10 | 71 | 2,647 | 2,651 | 18 | 0 | 0 | 0 |
| 11-orders.js | Trade, zeal, spies, hiring | 17 | 114 | 4,974 | 5,074 | 27 | 3 | 0 | 0 |
| 11-orders.js | Villager orders | 12 | 124 | 5,149 | 5,255 | 26 | 3 | 0 | 0 |
| 11-orders.js | the player's placing and box orders (the finger's work is in 26-input. | 3 | 84 | 2,686 | 2,690 | 27 | 1 | 0 | 0 |
| 11-orders.js | Orders you can follow: a group sent somewhere is stamped with its orde | 8 | 123 | 4,116 | 4,120 | 40 | 0 | 0 | 0 |
| 12-sim-core.js | (top of the file) | 1 | 1 | 104 | 124 | 1 | 0 | 0 | 0 |
| 12-sim-core.js | The simulation | 13 | 432 | 17,162 | 17,267 | 202 | 7 | 0 | 0 |
| 12-sim-core.js | Buildings | 5 | 174 | 6,261 | 6,361 | 70 | 9 | 0 | 0 |
| 12-sim-core.js | Villagers: gather, hunt, carry, mend, shelter | 5 | 21 | 659 | 759 | 4 | 1 | 0 | 0 |
| 12-sim-core.js | Where a worker gathers: the forager's rate (Build 59) | 10 | 187 | 9,612 | 9,670 | 81 | 8 | 0 | 0 |
| 13-sim-civil.js | (top of the file) | 18 | 688 | 27,846 | 27,886 | 214 | 13 | 0 | 0 |
| 13-sim-civil.js | Other people | 6 | 188 | 5,788 | 5,888 | 62 | 2 | 0 | 0 |
| 14-sim-troops.js | (top of the file) | 5 | 119 | 4,563 | 4,604 | 58 | 1 | 0 | 0 |
| 14-sim-troops.js | Soldiers | 7 | 336 | 12,971 | 13,071 | 135 | 5 | 0 | 0 |
| 14-sim-troops.js | The wild | 7 | 206 | 7,539 | 7,639 | 84 | 6 | 0 | 0 |
| 15-sim-spatial.js | (top of the file) | 1 | 1 | 80 | 100 | 1 | 0 | 0 | 0 |
| 15-sim-spatial.js | Finding foes, and hitting them | 9 | 63 | 2,977 | 3,077 | 35 | 2 | 0 | 0 |
| 15-sim-spatial.js | Who a soldier fights (Build 59) | 15 | 130 | 5,432 | 5,485 | 47 | 1 | 0 | 0 |
| 16-sim-fight.js | (top of the file) | 10 | 274 | 12,079 | 12,101 | 119 | 5 | 0 | 0 |
| 16-sim-fight.js | Plunder, falls, the score | 11 | 179 | 5,701 | 5,802 | 30 | 6 | 0 | 0 |
| 17-ai.js | (top of the file) | 1 | 1 | 46 | 66 | 1 | 0 | 0 | 0 |
| 17-ai.js | The computer brain: one brain, three personalities, the same rules as  | 5 | 31 | 1,620 | 1,720 | 13 | 1 | 0 | 0 |
| 17-ai.js | By need (answer 10, D-068; D4; W6; N7; the shift to plots): one plan,  | 22 | 680 | 31,213 | 31,278 | 294 | 9 | 0 | 0 |
| 17-ai.js | Dynamic Diplomacy (the Tension setting): when one side runs far ahead, | 3 | 29 | 1,649 | 1,653 | 8 | 0 | 0 | 0 |
| 17-ai.js | The A/B test of the computers (Albert, Nov 3, 11:10: "a b test this"): | 5 | 41 | 2,327 | 2,331 | 24 | 0 | 0 | 0 |
| 18-figures.js | (top of the file) | 1 | 1 | 65 | 85 | 1 | 0 | 0 | 0 |
| 18-figures.js | Figures: every unit drawn once per look, colour, pose and zoom, then s | 14 | 67 | 2,360 | 2,460 | 71 | 0 | 0 | 0 |
| 18-figures.js | a person, built from parts. o: { tunic, trim, body, head, helm, crest, | 5 | 847 | 18,488 | 18,492 | 1,173 | 5 | 0 | 0 |
| 18-figures.js | a horse, side on. o: { coat, barding: 'cloth'/'scale'/'mail', cloth } | 6 | 376 | 7,932 | 7,936 | 399 | 0 | 0 | 0 |
| 18-figures.js | each look: how its figure is put together. c = side colour, t = tier. | 4 | 708 | 15,269 | 15,273 | 845 | 0 | 0 | 0 |
| 18-figures.js | the sprite cache: one canvas per look, colour, tier, pose and zoom ste | 7 | 68 | 1,845 | 1,849 | 54 | 0 | 0 | 0 |
| 19-building-art.js | (top of the file) | 1 | 1 | 48 | 68 | 1 | 0 | 0 | 0 |
| 19-building-art.js | Buildings: each drawn once per kind, colour and zoom, then stamped | 3 | 17 | 1,019 | 1,120 | 39 | 0 | 0 | 0 |
| 19-building-art.js | the light (Build 61, after the best of the genre: one warm sun from th | 23 | 474 | 11,317 | 11,326 | 389 | 0 | 0 | 0 |
| 19-building-art.js | the props the yards share (Build 61) | 29 | 2,575 | 64,025 | 64,033 | 4,581 | 19 | 0 | 0 |
| 20-view-base.js | (top of the file) | 1 | 1 | 82 | 102 | 1 | 0 | 0 | 0 |
| 20-view-base.js | The view: a tilted table, seen from the south | 39 | 262 | 10,164 | 10,278 | 193 | 0 | 0 | 0 |
| 21-view-frame.js | (top of the file) | 6 | 384 | 15,684 | 15,704 | 389 | 1 | 0 | 0 |
| 22-view-fog.js | (top of the file) | 18 | 174 | 7,034 | 7,054 | 156 | 2 | 0 | 0 |
| 23-view-things.js | (top of the file) | 14 | 446 | 18,753 | 18,773 | 476 | 5 | 0 | 0 |
| 23-view-things.js | Fire (Build 55): one element for every flame in the game. A row names  | 3 | 13 | 964 | 973 | 22 | 0 | 0 | 0 |
| 23-view-things.js | Shadows (Build 55, Albert: shadows match the light). A thing of height | 26 | 312 | 14,149 | 14,167 | 364 | 2 | 0 | 0 |
| 23-view-things.js | theatrics: one pop curve, three sizes of celebration. 1 a building is  | 25 | 827 | 24,234 | 24,238 | 988 | 25 | 0 | 0 |
| 24-view-overlays.js | (top of the file) | 34 | 720 | 27,775 | 27,802 | 661 | 7 | 0 | 0 |
| 25-view-weather.js | (top of the file) | 1 | 1 | 70 | 90 | 1 | 0 | 0 | 0 |
| 25-view-weather.js | Weather on the glass, after SoRen's model: rain is a pool of drops who | 11 | 229 | 8,272 | 8,276 | 257 | 3 | 0 | 0 |
| 26-input.js | (top of the file) | 1 | 1 | 61 | 81 | 1 | 0 | 0 | 0 |
| 26-input.js | Touch: drag to look, pinch to zoom, tap to ask, press and slide to pla | 33 | 668 | 21,327 | 21,431 | 160 | 12 | 0 | 0 |
| 27-cards-core.js | (top of the file) | 1 | 1 | 103 | 123 | 1 | 0 | 0 | 0 |
| 27-cards-core.js | The cards: one engine, one table | 14 | 103 | 4,716 | 4,818 | 11 | 5 | 0 | 0 |
| 27-cards-core.js | the pieces every card is made of. The slot is a button; the Formation  | 9 | 51 | 3,746 | 3,758 | 34 | 0 | 0 | 0 |
| 27-cards-core.js | the controls (v80, the control sheet, Albert Oct 31), each built once  | 39 | 371 | 18,681 | 18,709 | 116 | 16 | 0 | 0 |
| 28-army-quick.js | (top of the file) | 1 | 1 | 102 | 122 | 1 | 0 | 0 | 0 |
| 28-army-quick.js | Attack with: on an enemy or a find card, from the whole army or one ba | 4 | 56 | 1,885 | 1,891 | 8 | 1 | 0 | 0 |
| 28-army-quick.js | who can be sent | 9 | 52 | 2,749 | 2,754 | 17 | 0 | 0 | 0 |
| 28-army-quick.js | The quick action (Albert, Nov 3: "a tap on the ground like a right cli | 4 | 34 | 1,529 | 1,539 | 6 | 0 | 0 | 0 |
| 28-army-quick.js | The War Director (06-rules-tuning, DIRECT): a tap on a kind in the sta | 6 | 31 | 2,007 | 2,011 | 8 | 0 | 0 | 0 |
| 28-army-quick.js | The choke and the ambush (Albert, Nov 3, 11:08: "allowing the player t | 13 | 216 | 10,089 | 10,093 | 97 | 8 | 0 | 0 |
| 28-army-quick.js | Muster for a squad: what it still lacks, by soldier kind to train | 2 | 19 | 744 | 748 | 9 | 0 | 0 | 0 |
| 29-card-pages.js | (top of the file) | 1 | 1 | 106 | 126 | 1 | 0 | 0 | 0 |
| 29-card-pages.js | What a building's page says, by kind | 30 | 575 | 30,110 | 30,296 | 214 | 2 | 0 | 0 |
| 30-cards.js | (top of the file) | 1 | 1 | 85 | 105 | 1 | 0 | 0 | 0 |
| 30-cards.js | The cards, one entry each | 6 | 845 | 38,721 | 38,903 | 185 | 14 | 0 | 0 |
| 31-guide.js | (top of the file) | 3 | 173 | 5,374 | 5,417 | 9 | 0 | 0 | 0 |
| 31-guide.js | History (beta): the dated things of the game in order, searchable, eac | 8 | 96 | 4,198 | 4,206 | 4 | 0 | 0 | 0 |
| 32-frame.js | (top of the file) | 1 | 1 | 84 | 104 | 1 | 0 | 0 | 0 |
| 32-frame.js | The frame: the screen round the map, and its refresh | 20 | 276 | 16,788 | 16,914 | 540 | 0 | 0 | 0 |
| 32-frame.js | Messages (Build 64, Albert) | 9 | 24 | 1,604 | 1,707 | 8 | 0 | 0 | 0 |
| 32-frame.js | How news reaches you (Build 59; TELL in 06, the Post line of research) | 22 | 411 | 20,660 | 20,774 | 222 | 6 | 0 | 0 |
| 33-verbs.js | (top of the file) | 1 | 1 | 46 | 66 | 1 | 0 | 0 | 0 |
| 33-verbs.js | What every button does: one table | 12 | 1,137 | 31,709 | 31,827 | 199 | 15 | 0 | 0 |
| 34-save.js | (top of the file) | 1 | 1 | 41 | 61 | 1 | 0 | 0 | 0 |
| 34-save.js | Saving: on this phone, every 10 seconds and when you leave | 19 | 770 | 27,421 | 27,534 | 210 | 6 | 0 | 0 |
| 35-sound.js | (top of the file) | 1 | 1 | 46 | 66 | 1 | 0 | 0 | 0 |
| 35-sound.js | Sound | 9 | 111 | 3,111 | 3,211 | 28 | 0 | 0 | 0 |
| 35-sound.js | Materials (Build 56, after SoRen): what a struck thing is made of is t | 15 | 332 | 10,515 | 10,527 | 446 | 1 | 0 | 0 |
| 35-sound.js | Touch you can feel: one table of felt events, three strengths, never m | 7 | 34 | 1,235 | 1,239 | 13 | 0 | 0 | 0 |
| 36-economy.js | (top of the file) | 1 | 1 | 94 | 114 | 1 | 0 | 0 | 0 |
| 36-economy.js | Goods, trade routes, nature, sickness and food | 13 | 75 | 3,354 | 3,454 | 37 | 2 | 0 | 0 |
| 36-economy.js | prices: base, more where it is wanted, more the farther it travels | 19 | 186 | 7,106 | 7,111 | 54 | 15 | 0 | 0 |
| 36-economy.js | the calendar: weather every minute, the seasons' work, the year's harv | 3 | 103 | 3,941 | 3,945 | 49 | 7 | 0 | 0 |
| 36-economy.js | fire: wood and thatch burn, catch from their neighbours, and villagers | 8 | 79 | 3,454 | 3,460 | 41 | 3 | 0 | 0 |
| 36-economy.js | sickness: a few fall ill now and then, more in summer and winter; clea | 4 | 95 | 3,142 | 3,147 | 34 | 0 | 0 | 0 |
| 36-economy.js | food upkeep: everyone eats, every second, wherever they are | 5 | 60 | 2,139 | 2,143 | 19 | 1 | 0 | 0 |
| 36-economy.js | the computers: a Market, one workshop each, caravans with routes, post | 2 | 54 | 1,915 | 1,919 | 28 | 2 | 0 | 0 |
| 36-economy.js | food upkeep | 4 | 21 | 872 | 876 | 7 | 1 | 0 | 0 |
| 36-economy.js | prices float with what is sold and bought, and drift back | 9 | 76 | 2,999 | 3,006 | 22 | 0 | 0 | 0 |
| 36-economy.js | vassals: tax, loyalty, unrest, rebellion and coalition | 9 | 205 | 7,412 | 7,416 | 81 | 3 | 0 | 0 |
| 37-events.js | (top of the file) | 1 | 1 | 74 | 94 | 1 | 0 | 0 | 0 |
| 37-events.js | The Challenge and the spectacle: one scheduler, one table of events, o | 21 | 548 | 16,545 | 16,645 | 296 | 7 | 0 | 0 |
| 37-events.js | The climate (Build 54): one tick a second. The air's temperature from  | 28 | 212 | 11,280 | 11,307 | 150 | 4 | 0 | 0 |
| 38-camps.js | (top of the file) | 14 | 222 | 10,914 | 10,939 | 104 | 11 | 0 | 0 |
| 38-camps.js | step 2: supplies, the caravan's run, wear and mending, the camp as a p | 6 | 84 | 3,392 | 3,396 | 36 | 2 | 1 | 0 |
| 38-natives.js | (top of the file) | 1 | 1 | 57 | 77 | 1 | 0 | 0 | 0 |
| 38-natives.js | The Natives: the fifth side's one brain, and the Throne | 24 | 361 | 14,809 | 14,914 | 117 | 13 | 0 | 0 |
| 39-games.js | (top of the file) | 18 | 207 | 9,991 | 10,020 | 79 | 0 | 0 | 0 |
| 39-huddle.js | (top of the file) | 12 | 43 | 2,721 | 2,754 | 37 | 1 | 0 | 0 |
| 39-huddle.js | the pages | 4 | 26 | 1,078 | 1,082 | 16 | 0 | 0 | 0 |
| 39-huddle.js | aiming: the crosshair, moved by a tap on the map while the War or Trai | 14 | 126 | 4,791 | 4,799 | 28 | 1 | 0 | 0 |
| 39-huddle.js | each second: where a mission is, how it goes, what to say | 6 | 90 | 3,122 | 3,126 | 18 | 0 | 0 | 0 |
| 39-huddle.js | the row: three pages on one mold. Rank one is the page's six things, r | 8 | 161 | 7,795 | 7,806 | 108 | 0 | 0 | 0 |
| 39-huddle.js | the squad card (MENU-SPEC §8, picture Mission Flow): the squad builder | 6 | 115 | 6,103 | 6,126 | 45 | 0 | 0 | 0 |
| 39-huddle.js | The match log (Albert, Nov 3, 22:34: "If I play a game can you analyze | 5 | 77 | 3,937 | 3,942 | 39 | 1 | 0 | 0 |
| 40-emergency.js | (top of the file) | 16 | 166 | 6,691 | 6,712 | 58 | 4 | 0 | 0 |
| 41-boot.js | (top of the file) | 1 | 1 | 62 | 82 | 1 | 0 | 0 | 0 |
| 41-boot.js | The loop and the start | 11 | 749 | 12,285 | 12,385 | 110 | 0 | 0 | 0 |

## Staging (steps 4 and 5): the temp books, every line of Mid as it is; and the sort (step 6)

| Temp book | Group | Parts | Lines | Characters | Bytes | Sorted (step 6) |
|---|---|---|---|---|---|---|
| capabilities.js | Element cards | 2 | 27 | 2,176 | 2,196 | 2 in v100, 0 bring, 0 cut, 0 parked |
| numbers.js | Numbers | 5 | 2,581 | 103,299 | 104,141 | 112 in v100, 13 bring, 13 cut, 1 parked |
| tech.js | Ages and tech | 1 | 3,375 | 73,123 | 73,159 | 3 in v100, 1 bring, 2 cut, 0 parked |
| words.js | Words | 1 | 1,215 | 103,803 | 104,005 | 10 in v100, 6 bring, 1 cut, 0 parked |
| core.js | Core | 2 | 957 | 47,164 | 47,714 | 148 in v100, 17 bring, 12 cut, 0 parked |
| paths.js | Walking grid | 1 | 846 | 34,215 | 34,437 | 36 in v100, 0 bring, 9 cut, 0 parked |
| world.js | World | 7 | 1,095 | 52,496 | 53,361 | 11 in v100, 8 bring, 37 cut, 0 parked |
| econ.js | Orders and economy | 4 | 3,878 | 151,377 | 152,607 | 216 in v100, 2 bring, 10 cut, 0 parked |
| combat.js | War | 3 | 1,523 | 61,958 | 62,375 | 63 in v100, 3 bring, 1 cut, 0 parked |
| ai.js | Computers | 1 | 782 | 36,855 | 37,048 | 27 in v100, 3 bring, 1 cut, 0 parked |
| sprites.js | Art | 2 | 5,134 | 122,368 | 122,642 | 77 in v100, 3 bring, 3 cut, 0 parked |
| display.js | View | 6 | 3,369 | 127,181 | 127,457 | 124 in v100, 9 bring, 34 cut, 0 parked |
| touch.js | Touch | 1 | 669 | 21,388 | 21,512 | 30 in v100, 0 bring, 2 cut, 0 parked |
| menu.js | Menus | 8 | 4,871 | 212,969 | 214,200 | 99 in v100, 104 bring, 21 cut, 0 parked |
| save.js | Saving | 1 | 771 | 27,462 | 27,595 | 0 in v100, 17 bring, 1 cut, 0 parked |
| sound.js | Sound | 1 | 478 | 14,907 | 15,043 | 21 in v100, 0 bring, 2 cut, 5 parked |
| events.js | Events, camps, natives, peace | 4 | 1,636 | 67,062 | 67,392 | 83 in v100, 13 bring, 9 cut, 0 parked |
| start.js | Start | 1 | 750 | 12,347 | 12,467 | 3 in v100, 6 bring, 1 cut, 0 parked |
| **all** | 18 temp books | 51 | 33,957 | 1,272,150 | 1,279,351 | 1435 of 1,435 pieces |
