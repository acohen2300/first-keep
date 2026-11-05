# First Keep v100 · Inventory

Written by `index.py` at every build, never by hand. Version 100 · 12; the change in brackets is against the last seal.

| Group | Items | Lines | Characters | Bytes |
|---|---|---|---|---|
| Game code | 28 | 1,886 | 251,258 | 251,390 |
| Books | 1136 | 0 | 199,633 | 199,937 |
| Laws | 78 | 0 | 9,951 | 10,259 |
| Tools | 4 | 813 | 111,396 | 111,547 |

## The trades (code)

| Item | Lines | Characters | Bytes | Typed numbers |
|---|---|---|---|---|
| index.html#page | 30 | 1,736 | 1,736 | 11 |
| index.html#frames | 13 | 1,035 | 1,035 | 3 |
| index.html#the-frames | 12 | 1,023 | 1,027 | 13 |
| index.html#qbf-the-dice | 10 | 1,071 | 1,075 | 25 |
| index.html#the-coast | 11 | 472 | 476 | 17 |
| index.html#the-ground | 28 | 1,803 | 1,807 | 38 |
| index.html#floor-2-terrain | 81 | 7,995 | 7,999 | 131 |
| index.html#floor-3-non-movables | 45 | 4,943 | 4,947 | 82 |
| index.html#drawn-once-in-the-view-frame | 47 | 4,130 | 4,134 | 123 |
| index.html#the-view | 9 | 916 | 920 | 14 |
| index.html#the-door | 54 | 5,163 | 5,167 | 69 |
| index.html#the-brushes | 10 | 1,097 | 1,101 | 26 |
| index.html#the-building-art | 324 | 50,704 | 50,708 | 4096 |
| index.html#the-node-art | 26 | 4,085 | 4,089 | 244 |
| index.html#the-figures | 144 | 23,202 | 23,206 | 1610 |
| index.html#b-the-buildings | 15 | 1,369 | 1,373 | 20 |
| index.html#floor-5-movables | 107 | 11,172 | 11,176 | 96 |
| index.html#the-body-s-laws | 30 | 2,348 | 2,352 | 35 |
| index.html#the-things-drawn-each-frame-back-to-fr | 24 | 3,282 | 3,286 | 92 |
| index.html#floor-6-climate | 63 | 7,867 | 7,879 | 288 |
| index.html#floor-7-display | 28 | 2,927 | 2,931 | 75 |
| index.html#the-woods-cache | 51 | 4,849 | 4,853 | 79 |
| index.html#touch | 40 | 4,505 | 4,509 | 59 |
| menu.js | 303 | 50,935 | 50,975 | 595 |
| econ.js | 213 | 31,127 | 31,127 | 79 |
| combat.js | 63 | 9,411 | 9,411 | 101 |
| ai.js | 49 | 6,459 | 6,459 | 37 |
| sound.js | 56 | 5,632 | 5,632 | 66 |

## The books

| Book | Entries | Bytes |
|---|---|---|
| angles | 4 | 583 |
| capabilities | 31 | 7,877 |
| citations | 172 | 22,612 |
| colours | 9 | 951 |
| comments | 359 | 53,641 |
| ground | 4 | 640 |
| mass | 18 | 2,663 |
| measure | 217 | 37,659 |
| rules | 53 | 12,080 |
| screen | 10 | 2,689 |
| shells | 78 | 13,536 |
| sides | 4 | 1,202 |
| sound | 51 | 11,159 |
| sprites | 38 | 8,372 |
| tech | 79 | 22,636 |
| words | 9 | 15,176 |

## The shells

| Layer | Shells | Ticking nothing yet |
|---|---|---|
| 100 | 11 | 1 |
| 110 | 46 | 28 |
| 120 | 21 | 0 |

## The rules

| Code | Rule | Stage | Stops |
|---|---|---|---|
| X1 | home | books | a code that has two homes (two books) |
| X2 | cited | books | an entry with no citation, a citation not in the Citations book, or one typed as text instead of its code |
| X3 | laws | books | an entry or a law naming a Q or an N that does not exist |
| X4 | mold | books | a shell lacking what its layer's mold needs |
| X5 | needs | books | a shell ticking what it cannot back |
| X6 | orphan | books | a slot on a shell that nothing it ticks asks for |
| X7 | pointers | books | a slot pointing at nothing: a D code, a body, a kit, a look, a sound |
| X8 | sounds | books | an event playing a sound that is not in the Sound book |
| X9 | tabs | books | a Build tab over nine, or listing something that is not a building |
| X10 | once | books | a building missing from the Build menu or listed twice (unless named off it) |
| X11 | names | code | opened code naming a shell instead of asking by tick or by book |
| X12 | typedD | code | numbers typed into D instead of the Measurements book |
| X13 | swallowed | code | a comment that ends in a statement: it may have swallowed code |
| X14 | version | code | the version typed into the page instead of read from D171 |
| X15 | parse | code | a code file that does not parse on its own |
| X16 | joined | code | the whole game, joined, not parsing (a name declared twice) |
| X17 | permit | seal | a change the permit does not open (a build carries one whole module: Albert, Nov 5 13:30) |
| X18 | seals | seal | a locked item differing from its seal by a single byte |
| X19 | ratchet | seal | opened code typing more numbers or colours than when sealed |
| X20 | budget | seal | opened code growing past its sealed size without growth the permit grants |
| X21 | pages | seal | a page (INDEX, CITATIONS, INDEX-CITATIONS, INVENTORY) not what the books say (on GitHub) |
| X22 | rules | seal | a rule in this book that nothing runs |
| X23 | t-version | page | the page shows the version from the book |
| X24 | t-top | page | the top is one ribbon of the cells the Screen book names |
| X25 | t-tabs | page | Build renders the book's tabs, each with its buildings |
| X26 | t-height | page | every page that is not Tall shares one height |
| X27 | t-tall | page | the Tall pages keep their own height |
| X28 | t-solid | page | the panel is solid |
| X29 | t-queue | page | the seat's queue is the mold's six single slots, filling in order |
| X30 | t-cards | page | a card shows the rows its subject ticks: a villager, a find, the seat |
| X31 | t-place | page | a building picked from Build is placed as a site |
| X32 | t-errors | page | the page runs with no errors |
| X33 | t-proof | page | the gate stops each planted break: a second home, a bad tick, a shell named in code, swallowed code, one byte of a locked law |
| X34 | t-start | page | a new game starts with the book's stores (D172), and a restart resets them and the weather |
| X35 | t-fog | page | the fog is drawn only when the Start page turns it on |
| X36 | t-wait | page | a paid unit with no room to stand waits in the queue, then appears |
| X37 | t-bell | page | the bell rings at the length chosen at Start; the default is the book's |
| X38 | t-gone | page | a find used up is gone at once, and never chosen again |
| X39 | t-ai | page | the computer raises its army buildings in the book's order (D179) |
| X40 | byname | survey | code that asks what a thing is by a typed name (kind === 'tree'): ask by tick |
| X41 | frozen | survey | the reference copy differs from its seal, or its parts, or the temp books read back in its order, do not rebuild it byte for byte |
| X42 | t-match | page | a sound brought from Mid makes the same parts as Mid's own code makes it (same action, same result) |
| X43 | sorted | survey | a temp book being sorted leaves a piece of Mid without its line (in v100, bring, cut or parked) |
| X44 | t-same | page | same seed, same game: two pages on one seed draw alike and stand alike after 300 s with the weather in it; the rules' dice are Mid's rng draw for draw, BEAT and the grid squares Mid's; unitsNear finds exactly what a full scan finds, bldsNear every building a scan finds |
| X45 | comments | code | a comment in code written in words instead of its code, a code not in the Comments book, or a Comments entry no code names |
| X46 | t-ledger | page | every store in or out goes through earn and spend: an earning, a Home built and scrapped at 10%, a villager queued and taken back, an age, the people eating, a spend and the minute's turn leave the stores, the minute's flow, its velocity and the ledger and its lines as Mid's frozen code leaves them; fmt, plural, some, orList, slowPct and coord read as Mid's; 300 s of four sides' play balance the ledger to the unit |
| X47 | t-effects | page | a kind's numbers after research are Mid's stats(), maxHpB, unitCost, techCost and rehealth with its shares added, not multiplied (QCA); a Home's health is D139 × (1 + Σ shares); the lowest is kept; a find's rate and the walk read the law |
| X48 | t-odds | page | the odds of a battle are Mid's frozen unitPower, powerOf, powerFrom, matchup and lanchester for the same armies and towers (Mid's values, a tower 120, the people 250); a villager walled in from every find does not crash and ends idle or waiting |
| X49 | t-foe | page | who is a foe is Mid's frozen isFoe, gangOf, atWar and friendly for the same sides, groups and stances: animals everyone's foe, each wild group by its own stance, a treaty binding only its signers; a soldier and a tower strike only a foe |
| X50 | t-research | page | ages and research are Mid's frozen code for the same orders: the age queued at the seat at its price and wait, the seat training nothing while it rises, the lines in order at each step's price and time (research-speed steps applied), a step out of order, queued, before its age or its needs refused; after each step the wood rate, the load, a home's room and the camp's footing Mid's with its shares added; the Hall names a step and an age, the age button and info card the next age and its own wait, the hidden age never next, the keep's level at Gunpowder drawn, Z1 from Mid's first age |
| X51 | t-gather | page | ten villagers sent to one bush patch each stand on a spot of their own on its ring, the spots and the bodies a pace apart, never more on a find than Mid's frozen findCap; each one's crowd share and forager's rate are Mid's frozen forage for the same load, walk, crowd and walked length; Mid's frozen makeNow on the same five minutes of work gathers the same food within 2% (the walk is v100's: paths, and the push by mass) |
| X52 | t-walls | page | builders, repair, limits, placing and walls are Mid's frozen code for the same actions: a crew's build time and a site's health (bldTick, n^0.7), a repair's time and stores spent (repairTick) and its price (repairCost), every price Mid's BLD and UNIT cost, the refund taken down (shellBack), every building's limit by age with research (capFor, capWhy), placing's refusals (canPlace), a wall laid corner to corner (wallLine) and the seal's gap (sealPath); on the page the nearest free villager is sent and one pulled off its work goes back to it, the ghost snaps a lane apart, a gate opens to its own and an ally and shuts to a foe, and the computer lays its ring |
| X53 | t-food | page | a year and a season of food is Mid's frozen code for the same town (20 villagers, five at bushes, 5 foot, 5 riders, 4 farms worked and resting, a tended pasture of 11 with a wolf at two turns, half-fished fish, the hearth, the ice house and seed selection known, the store run dry and fed again): what is eaten (shareOf, upkeepTick, starveTick, foodInReach, hungerOf), spoiled and regrown at each turn (seasonTurn), the soil left (natureTick), the flock and its mutton, and the fields' harvest by season, soil and the year's roll (gatherMul) all equal Mid's; an order's meals are Mid's orderCost; a boar hunted falls as its meat and is butchered; fish are worked only near a dock |

1246 items sealed · 1136 book entries · 78 laws · 172 citations, 24 still to open · 7 known
