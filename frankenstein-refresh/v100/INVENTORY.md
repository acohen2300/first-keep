# First Keep v100 · Inventory

Written by `index.py` at every build, never by hand. Version 100 · 12; the change in brackets is against the last seal.

| Group | Items | Lines | Characters | Bytes |
|---|---|---|---|---|
| Game code | 28 | 2,567 | 380,111 | 380,245 |
| Books | 1608 | 0 | 398,178 | 398,657 |
| Laws | 84 | 0 | 14,676 | 15,088 |
| Tools | 4 | 1,302 | 210,095 | 210,263 |

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
| index.html#floor-3-non-movables | 46 | 5,301 | 5,305 | 81 |
| index.html#drawn-once-in-the-view-frame | 47 | 4,130 | 4,134 | 123 |
| index.html#the-view | 9 | 916 | 920 | 14 |
| index.html#the-door | 59 | 6,382 | 6,386 | 69 |
| index.html#the-brushes | 10 | 1,097 | 1,101 | 26 |
| index.html#the-building-art | 324 | 50,704 | 50,708 | 4096 |
| index.html#the-node-art | 26 | 4,085 | 4,089 | 244 |
| index.html#the-figures | 143 | 23,309 | 23,313 | 1543 |
| index.html#b-the-buildings | 15 | 1,369 | 1,373 | 20 |
| index.html#floor-5-movables | 124 | 13,793 | 13,797 | 95 |
| index.html#the-body-s-laws | 31 | 2,581 | 2,585 | 35 |
| index.html#the-things-drawn-each-frame-back-to-fr | 30 | 4,341 | 4,345 | 92 |
| index.html#floor-6-climate | 70 | 9,117 | 9,129 | 256 |
| index.html#floor-7-display | 45 | 5,888 | 5,892 | 75 |
| index.html#the-woods-cache | 51 | 4,966 | 4,970 | 79 |
| index.html#touch | 49 | 6,239 | 6,243 | 55 |
| menu.js | 364 | 64,046 | 64,088 | 588 |
| econ.js | 494 | 89,049 | 89,049 | 75 |
| combat.js | 312 | 51,446 | 51,446 | 84 |
| ai.js | 77 | 10,585 | 10,585 | 34 |
| sound.js | 56 | 5,632 | 5,632 | 66 |

## The books

| Book | Entries | Bytes |
|---|---|---|
| angles | 5 | 734 |
| capabilities | 46 | 13,236 |
| citations | 201 | 35,424 |
| colours | 13 | 1,363 |
| comments | 523 | 87,768 |
| ground | 6 | 1,524 |
| mass | 24 | 3,740 |
| measure | 281 | 83,197 |
| rules | 62 | 19,288 |
| screen | 10 | 2,959 |
| shells | 97 | 19,255 |
| sides | 7 | 1,869 |
| sound | 51 | 11,159 |
| sprites | 61 | 23,313 |
| tech | 204 | 59,183 |
| words | 17 | 51,656 |

## The shells

| Layer | Shells | Ticking nothing yet |
|---|---|---|
| 100 | 12 | 1 |
| 110 | 50 | 11 |
| 120 | 35 | 0 |

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
| X54 | t-pace | page | a walker's pace on dry, flat, firm ground in still air is Mid's frozen paceOf for the same walkers: the walk with its research added once (Forced marches), a full load (Mid's 0.9, by W24) and sickness; wild things too; mud's and snow's costs are Mid's under the effects law (Roads and Field drains one on what the other left, Snow clearing); ground ice grows and thaws as Mid's groundTick; on the page a walker in mud steps at its pace and one on ice slips once, stands, is told once and walks on wary |
| X55 | t-kinds | page | every soldier is the Unit shell with Mid's settings: each kind's class, age, look, teach, price, train time, health, blow, reach, sight and speed (by the foot's 3.4 mph) are Mid's UNIT and TEACH_TO; with research its name, rank, kit, health, blow, reach, speed, sight, armour and train time are Mid's frozen stats() with the shares added; each army building trains exactly its class's kinds, each from its age, and the army stops at the ceiling; every kind's figure at each rank and kit is Mid's own, pixel for pixel |
| X56 | t-physics | page | the physics of F17b: a villager walks exactly 1.52 m/s on flat firm ground, unloaded, in still air, and every load, grade, mud, snow and headwind gives the speed at which Pandolf's equation (with Pugh's drag as a grade) returns its power, each slower; the effects law adds boosts once and applies cuts one at a time, never reaching 0 nor the base, and every cut in the Tech book is a share between 0 and 1; the falling particles are the pool times the strength, the rates, wind and visibility the law's, and the blizzard flag turns exactly at the NWS's wind and visibility and after three game hours; a step slips exactly when the friction it needs exceeds what the ground offers; Crampons give studs to villagers, foot, archers and the engines' haulers and not riders, Horseshoes to riders; the scout's pace and reach are Mid's |
| X57 | t-war | page | the blow, nerve and the rout, a soldier's day, squads and muster (F19+F20): every kind's counters on every kind are Mid's frozen vsMul over its UNIT; a tower reaches as far as Mid's rangeFrom within 1% (the arrow's drag, QAJ); a foe's worth in reach is Mid's foeValue; the nerve, flank, yard, kite, shelter, shapes, tempers, plunder and wear are Mid's numbers; on the page a blow from behind lands × D141, a skirmish breaks a soldier who runs and comes back, a fallen tower pays D233 of its price, and Muster brings a squad's lack at twice the price |
| X58 | t-orders | page | the finger, orders you can follow and the War Director (F21+F22): Mid's numbers (HOLD_MS, PRESS_SHOW, DBL_MS, HUD, ARMY_STILL, DIRECT, CHOKE, AMBUSH, CHARGE, FALLBACK, AB) in the books; Mid's frozen etaOf and reinforcePlan's waves for the same soldiers; on the page a box picks many, a tap is their order with its line and time, Go makes a mission, the charge quickens then tires, the choke stands as many files as the gap, an ambush hides |
| X59 | t-alarm | page | the Alarm and the end, with the start's first jobs, builders that tell and reachable sites (F23): Mid's DANGER_R, SHELTER, EMG, WONDER_HOLD, SHARE_FALLEN, PLUNDER, SCORE and room in the books; who is a threat is Mid's frozen isThreat; Shelter fills the buildings as Mid's frozen villagersIn does; a rival's fall pays what Mid's frozen fall pays, shares the room and scores as its scoreAll; your fall, a wonder held and the bell end the game as its judge; and on the page every villager has a job within 3 s of a new game, a villager leaves a find a foe stands by, Work sends them back, a site in reach is built, one out of reach says why and a free villager is sent to one in reach, and a spot nobody can walk to is refused |
| X60 | t-troops | page | Teach, prisoners, priests, medics, Zeal and spies (F24): Mid's TEACH, TEACH_TO, PRISON, CONVERT, ZEAL, SAB, the spy's stealth, heal and hrng, the priest's, medic's and spy's rows and the 18 research steps in the books; Mid's frozen teachCost and teachSecs for every kind that learns, its ransom, spySeen and healTick's lag for the same wound; on the page a spear learns to be a sword at the School keeping its share of health, a runner is taken, serves its captor after the wait and another is ransomed with the gold moved, Zeal costs Mid's gold and lifts the blow by its share for its seconds, a priest turns a villager in Mid's time, a medic binds a wound, a spy is unseen at 6 tiles and seen at 3, and sabotage stalls a barracks and burns a mill |
| X61 | t-trade | page | the Market, coin, bank and ventures, goods and workshops, trade and caravans (F26+F27): Mid's TRADE, SELL, BUY, MKT_SELL, MKT_BUY, GOODS, PRICE, MINT, VENTURE, BANK_CAP, SCALE, LOAD, CARAVAN, POST, TRADE_CAP, TRADE_DIV, PLACES.stop and WARES in the books, and every building priced, timed and with its health; eight stops on the two routes wanting Mid's wares in turn; three lots sold, two bought, the coin debased and a slow beat's drift give Mid's frozen marketTrade, debase and priceDrift's gold and stock; a caravan's run to a held stop loads and is paid as Mid's frozen priceAt and loadable, less the keeper's cut; an ally's run, five minutes of a workshop with the loom, Learning by doing, a venture with Banking and the Bank's interest are Mid's frozen numbers; guards keep to a caravan, a guarded caravan is Mid's frozen guardedCart's, a robbed one Mid's frozen robbed |
| X62 | t-realm | page | the war camp, field traps, relations and vassals (F25+F28): Mid's CAMP, CALTROPS, STAKES, NATIVE's traps, NOTICE, PEACE.truce, REGARD, GANG, REL_WORD, VASSAL, DEMAND and its fair TAX as the tribute in the books, and the camp pieces', traps', wagons', envoy's and rebels' rows; both camps' layouts at three facings are Mid's frozen campLayout snapped; the small camp unpacks as sites and a soldier's hands raise a piece at D279's build of a villager's; a medical tent binds a wound as Mid's healTick's lag; a caravan's supply run costs Mid's fee and food and stocks the depot; soldiers eat from it, and unsupplied they slow; caltrops on a rider and a spearman, and a pit a scout found, are Mid's frozen trapsTick; war comes after Mid's notice; an envoy's five answers and a truce's price are Mid's frozen judgeEnvoy on the same odds; ten minutes of a vassal's tribute, loyalty and unrest are Mid's frozen vassalTick; gifts buy Mid's giftGain (QCD) |

1724 items sealed · 1608 book entries · 84 laws · 201 citations, 37 still to open · 7 known
