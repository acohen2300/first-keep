# First Keep v100 · Inventory

Written by `index.py` at every build, never by hand. Version 100 · 12; the change in brackets is against the last seal.

| Group | Items | Lines | Characters | Bytes |
|---|---|---|---|---|
| Game code | 31 | 3,481 | 594,366 | 594,514 |
| Books | 2365 | 0 | 704,189 | 705,096 |
| Laws | 94 | 0 | 20,111 | 20,649 |
| Tools | 5 | 1,926 | 312,317 | 312,562 |

## The trades (code)

| Item | Lines | Characters | Bytes | Typed numbers |
|---|---|---|---|---|
| index.html#page | 32 | 1,874 | 1,874 | 11 |
| index.html#frames | 13 | 1,111 | 1,111 | 3 |
| index.html#the-frames | 12 | 1,023 | 1,027 | 13 |
| index.html#qbf-the-dice | 10 | 1,133 | 1,137 | 25 |
| index.html#the-coast | 11 | 472 | 476 | 17 |
| index.html#the-ground | 28 | 1,914 | 1,918 | 38 |
| index.html#floor-2-terrain | 84 | 9,478 | 9,482 | 115 |
| index.html#floor-3-non-movables | 67 | 9,797 | 9,801 | 54 |
| index.html#drawn-once-in-the-view-frame | 98 | 19,098 | 19,102 | 92 |
| index.html#the-view | 9 | 1,046 | 1,050 | 13 |
| index.html#the-door | 100 | 17,348 | 17,352 | 63 |
| index.html#the-brushes | 9 | 1,337 | 1,341 | 24 |
| index.html#the-building-art | 326 | 51,204 | 51,208 | 4094 |
| index.html#the-node-art | 18 | 2,711 | 2,715 | 125 |
| index.html#the-trees | 44 | 9,922 | 9,926 | 16 |
| index.html#the-figures | 144 | 24,571 | 24,575 | 1473 |
| index.html#b-the-buildings | 15 | 1,464 | 1,468 | 20 |
| index.html#floor-5-movables | 149 | 19,647 | 19,651 | 78 |
| index.html#the-body-s-laws | 32 | 2,819 | 2,823 | 32 |
| index.html#the-things-drawn-each-frame-back-to-fr | 37 | 5,956 | 5,960 | 90 |
| index.html#floor-6-climate | 172 | 30,246 | 30,258 | 126 |
| index.html#floor-7-display | 76 | 16,415 | 16,419 | 54 |
| index.html#the-view-s-eyes-lights-and-stage | 136 | 28,494 | 28,498 | 0 |
| index.html#the-ground-s-soil-and-paper | 55 | 10,104 | 10,108 | 0 |
| index.html#the-woods-cache | 41 | 4,935 | 4,939 | 32 |
| index.html#touch | 53 | 9,515 | 9,519 | 54 |
| menu.js | 533 | 109,168 | 109,212 | 526 |
| econ.js | 593 | 109,146 | 109,146 | 72 |
| combat.js | 355 | 58,850 | 58,850 | 84 |
| ai.js | 171 | 27,330 | 27,330 | 25 |
| sound.js | 58 | 6,238 | 6,238 | 66 |

## The books

| Book | Entries | Bytes |
|---|---|---|
| angles | 6 | 1,006 |
| capabilities | 52 | 15,461 |
| citations | 317 | 76,596 |
| colours | 32 | 8,966 |
| comments | 930 | 166,253 |
| ground | 8 | 2,942 |
| mass | 27 | 4,587 |
| measure | 335 | 162,932 |
| rules | 85 | 32,305 |
| screen | 25 | 11,058 |
| shells | 110 | 23,521 |
| sides | 7 | 1,869 |
| sound | 55 | 12,731 |
| sprites | 70 | 35,550 |
| tech | 259 | 75,824 |
| words | 47 | 96,938 |

## The shells

| Layer | Shells | Ticking nothing yet |
|---|---|---|
| 100 | 17 | 0 |
| 110 | 50 | 1 |
| 120 | 43 | 0 |

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
| X26 | t-height | page | every Build tab shares one height, two rows of three (Albert Nov 9: fit two rows; since N2 the other menus are bottom sheets that hug their rows) |
| X27 | t-tall | page | the Tall pages keep their own height |
| X28 | t-solid | page | the panel is solid |
| X29 | t-queue | page | the seat's queue is the mold's six single slots, filling in order |
| X30 | t-cards | page | a card shows the rows its subject ticks: a villager, a find, the seat |
| X31 | t-place | page | a building picked from Build is placed as a site |
| X32 | t-errors | page | the page runs with no errors |
| X33 | t-proof | page | the gate stops each planted break: a second home, a bad tick, a shell named in code, swallowed code, one byte of a locked law |
| X34 | t-start | page | a new game starts with the book's stores (D172), and a restart resets them and the weather |
| X36 | t-wait | page | a paid unit with no room to stand beside its building appears further out and the queue empties (A2, Albert Nov 7: every paid unit must appear; before, it waited in the queue) |
| X37 | t-bell | page | the bell rings at the length chosen at Start; the default is the book's |
| X38 | t-gone | page | a find used up is gone at once, and never chosen again |
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
| X63 | t-mind | page | the computers' minds and the sky, the moon and the ground (F29+F30): Mid's PERS, PLAYERS, WAVE, SAVE, DIFF, EASY_SAFE, SYNODIC, CLIMATE.rut, CLIMATE.shore and EVENTS.flood in the books; a computer's plan by need each minute over four minutes is Mid's frozen needOf and runsOut on the same hands, rates, stores, goal and draw, and every computer grows its town; the moon's phase and light are Mid's (the night's sight is now QAL's, t-sight); a walker wears the ground a unit-second a second, and the ruts heal, deepen the mud and pool by water as Mid's frozen rutHeal, rutOf and mudAt; a flood blocks the land within its rise and harms a building there unless Levees, and goes |
| X64 | t-wild | page | finds, wild guards, drifters, events and the hazards (F31): Mid's FINDS (guards, spoils, the ruins' scroll, the drifters' price), WAYFARER_EVERY, WILD_LOOK, the leash, NATIVE's raids, GROUP_R, EV_MEAN, EV_MIN, EV_WARN, the kept EVENTS, HAZARDS, HORDE and the bandit's and robber's UNIT rows in the books; on the seed every find laid with its guards on its ring (drifters by their fire); with every hazard on, the events in order with their warnings and the horde's warnings, arrival and number, fed one string of dice, are Mid's frozen eventsTick and hordeTick's (each event's doing set aside); a robbers' raid's band and mark are Mid's frozen natRaid's for the same camp, people and strengths; a drifter's refusals, price and three foot soldiers are Mid's frozen hireWhy and hire's; a chest taken pays Mid's frozen findsTick's spoils, the ruins a free research |
| X65 | t-fire | page | fire and sickness (F32): Mid's FIRE, FIRE_SMOKE, FIREARMS and HEALTH in the books, its wooden buildings the ones that Burn, its water, sewer and quarantine research the measured shares (MEASURED); fireHeat and Rothermel's η are Mid's; a summer storm's strike on a wooden town of two clusters: the home with villagers beside it saved, its neighbour untouched, and the other cluster's three burning down one from another, each when Mid's frozen lightning, ignite, fireTick and repairTick's buckets do on the same town and dice (to the 3 s look); then an outbreak, beat by beat, sickens and cures the same people as Mid's frozen outbreak and healthTick |
| X66 | t-sight | page | sight by real math, with the fog of war (Albert Nov 9, D361; his Nov 6 call had none): a person's range equals QAL worked from the books alone at noon, dusk, a full and a half moon, starlight, an overcast night and a fog; a tree between two villagers hides each from the other's side, felled it opens both ways, a fog thinner than their distance hides them, and once your last eye is gone you see nothing, while the foe's eye still sees that ground; the fog of war drawn, none of the old fog-of-war numbers; the small map's incoming mark lands on the soldiers seen and a tap there glides the camera |
| X67 | t-stage | page | lights, the glide, theatrics and the draw budget (F34): Mid's FLAME, LIGHT, CAM_W, the pop and the shed thresholds in the books; a glide to the Town Center follows Mid's frozen spring and followCam frame by frame; after dark the Town Center, a finished house, a burning house, a badly hurt and a lanterned camp give the lights Mid's frozen drawLight gives; each flame's colour and its life in the rain are Mid's kelvinRGB and flameLife; the finished house's pop runs Mid's popC frame by frame; a slow phone sheds and climbs back on Mid's frozen shed |
| X68 | t-dew | page | fog by the atmosphere (Albert, Nov 6 14:44): on a dry calm evening with the dew point just under the air, the air cools to it and fog forms (visibility under the WMO's 1 km); the visibility equals CALVIS's 3.912 ÷ (144.7 C^0.88) for the vapour above saturation by Magnus, never past the typical fog's water; a breeze past 7 knots clears it; the sun lifts it once the air warms past the dew point |
| X69 | t-peace | page | peace, the crowns, the mail, the messengers, milestones and tips (F35): a board truce stands a computer's soldiers above Mid's armyAim down to villagers one for one as Mid's frozen standDown; a year of it opens the hidden age as Mid's nextAge; a kill credits its cost as warCredit; the Wealth, War, Wellbeing and overall crowns equal Mid's crownsOf on the same sides; news of a foe out of sight is never told, told by a runner or a rider at Mid's tell's delay for the same walked metres, or heard as a fight with its way, as Mid's tell; repeats merge; the world's news and the first-house line equal Mid's NEWS and MS_TEXT; a tip done three times retires; the Games wait with the Throne |
| X70 | t-civs | page | the civilisations (F36): each of the six trains its own kind in place of the common one and no other side does; the kind's numbers, cost, time, age and pace equal Mid's UNIT; its bonus applied by QCA equals Mid's fxv for the civ; its elite rank equals Mid's tier; its Hall rows equal Mid's and only its side may research them; the legionary, Immortal and Mali horseman draw as Mid's figures; every standing tree in the woods stands its kind's Forest Service height (D326) in line of sight |
| X71 | t-land | page | the map's character, new game and scenarios (F37), with Albert's map calls: the lands and the scenarios equal Mid's frozen LAND, SCENARIOS and MODES, and each scenario plays as its row (age, store, research, relations, buildings by their spot, villagers, its line); past the pocket each find is worth its land's share; no find of your quarter is walled in by trees (only water may cut it off); your Town Center is at the bottom left of the screen; the pocket holds QBJ's amounts from the costs and the Bronze price; Z3 thickens toward Z4, is more open than Z4, Z2 has no woods, and Z3's finds are more than the pocket's and less than the wilds' |
| X72 | t-save | page | saving, the safety net and the test tools (F38): the save beat, the fight wait, the failure's minute and the button budget equal Mid's frozen SAVE_EVERY, saveGame and UI_BUDGET; a save waits out a fight up to its limit, keeps the one before, and opens to the same units, finds, buildings, stores, climate, relations and mail; saves roll through their slots; a damaged save is skipped and the one before opens; a new match adds nothing to the browser's history (Albert, Nov 10, #38); no seen or remembered state is saved; a thrown error costs a frame and the game runs on; taps are counted; the match log rows a minute; the test field (?test) is you and one rival at war with both armies out, never saved; the game opens where you left it |
| X73 | t-guide | page | the Guide and History, written from the books (F39): Mid's frozen guideModel and histRows, run on v100's tables, list the same buildings, units, research, ages, peoples, finds and rules, with the same numbers, names, lines and order as v100's guide() and hist(); every rule's numbers and names are filled from the books (none left open), each building, unit and find has its history line where the Words book holds one, and the Markdown holds one row an entry |
| X75 | rawstats | code | G1: code reading the raw stats table (D.stats[…]) outside stat's own home: ask FK.stat |
| X76 | ticked | books | G2: a shell named in a build, research, train or computer table that lacks the tick that table asks (Health, Research, Spawn, Field or Make) |
| X74 | t-a1 | page | speed and the audit's fixes (A1): Reinforce sends its soldiers into the fight's order; a drill holds its shape past its first frame; a save opened keeps a war order, a camp and an ambush as one record each (the camp count unchanged) and the fresh map unmarked; a civilisation's own kind shows on its building's card and trains from it; a soldier with a support unit beside it still picks the armed foe; the Apartment adds Mid's room and the Quarry is worked for Mid's stone; New World crops, Town watch and every step's needs equal Mid's TECH; a side's reach equals the walk the pathfinder finds; the new-game screen runs with no frame over D338 |
| X77 | unique | code | an object (a table in code or a book) that holds the same key twice: the later one silently wins (B6: two home verbs) |
| X78 | t-n17 | page | N17, Albert's N15 notes: a site placed with a busy builder waits its turn and he walks to it when his first is done; minus drops the job count at once; gatherers at work hold their spots (under 2% of their frames move); Repeat is ticked on exactly the twelve repeatable buildings; every locked research says why on its button; a tap held a second on Train still trains |
| X79 | t-ground | page | the paper ground (N11-N14): on the opening view, open water well below the land is drawn blue and open land well above it green, nine in ten points or more, away from shores, finds and trees |
| X80 | t-n15 | page | N15 (Albert's N13 notebook): the Daily challenge locks civ, difficulty, length, scenario and fog, and off frees them; any queued unit taken out is paid back in full; the Top Info Ribbon shows each of its readings; every finished building but walls and fields has its door torch after dark |
| X81 | t-n16 | page | N16, the quick action: open ground gives Attack, Build, Rally; Attack gives All, half, quarter and Squad; Build gives the six groups; a message with a place shows Go on a menu's help line |
| X82 | t-n18 | page | N18 build 1, Albert's N17 notes on the menus: a pill keeps its curved ends; the selected ring lies on the pill's own outline, its ends on the pill's corners; row titles 14/600, options 12/400; a hazard's ring is the options' white; with Daily on a locked option is flat and dark with no ring; the paused Play button wears the ring at its own size; the Paused card hangs below the Top Info Ribbon; the quick action's ring is its box's size; the tap that opens the quick action does not press the box under the finger |
| X83 | t-n18b | page | N18 build 2, Albert's N17 notes: People's ring recedes while a villager trains; a line said while another shows waits its turn; soldiers trained while a rally flag stands are dressed into one formation there; at night a campfire burns by a drop-off where villagers work and the army's standard carries a torch; no figure is clipped by its box (the horse's head); three blade tiles; a rock's sprite is cached at or above its size; a person behind a building shows through it |
| X84 | t-n18c | page | N18 build 3: the quick action's aim step is one box above the aimer; a steady pinch over a second and a half draws the land sheet afresh at most three times (it is stretched between) and once more when the zoom stands still |
| X85 | t-n19 | page | N19: a day is 240 s, a season 360 s, a person eats 3.75 food a minute as before; the played land is 306 tiles a side |
| X86 | t-n20 | page | N20: ten swordsmen a side hold until two or more of a side have fallen and fight on to an end; the top row is one row of nine; three times the trees; storms from 0.6 |
| X87 | t-n21 | page | N21 speed: over a third of the trees are drawn from the woods' cache; a paused, still screen is not redrawn; asking for a picture twice in a frame draws it once |

2495 items sealed · 2365 book entries · 94 laws · 317 citations, 33 still to open · 0 known
