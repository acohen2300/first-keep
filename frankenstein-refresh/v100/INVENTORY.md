# First Keep v100 · Inventory

Written by `index.py` at every build, never by hand. Version 100 · 12; the change in brackets is against the last seal.

| Group | Items | Lines | Characters | Bytes |
|---|---|---|---|---|
| Game code | 28 | 1,646 | 211,795 | 211,925 |
| Books | 890 | 0 | 118,217 | 118,471 |
| Laws | 74 | 0 | 7,375 | 7,617 |
| Tools | 4 | 425 | 49,105 | 49,186 |

## The trades (code)

| Item | Lines | Characters | Bytes | Typed numbers |
|---|---|---|---|---|
| index.html#page | 28 | 1,659 | 1,659 | 11 |
| index.html#frames | 13 | 1,035 | 1,035 | 3 |
| index.html#the-frames | 12 | 1,023 | 1,027 | 13 |
| index.html#qbf-the-dice | 10 | 1,071 | 1,075 | 25 |
| index.html#the-coast | 11 | 472 | 476 | 17 |
| index.html#the-ground | 28 | 1,803 | 1,807 | 38 |
| index.html#floor-2-terrain | 81 | 7,995 | 7,999 | 131 |
| index.html#floor-3-non-movables | 41 | 4,171 | 4,175 | 82 |
| index.html#drawn-once-in-the-view-frame | 47 | 4,130 | 4,134 | 123 |
| index.html#the-view | 9 | 916 | 920 | 14 |
| index.html#the-door | 41 | 3,247 | 3,251 | 69 |
| index.html#the-brushes | 10 | 1,097 | 1,101 | 26 |
| index.html#the-building-art | 314 | 49,153 | 49,157 | 4096 |
| index.html#the-node-art | 26 | 3,804 | 3,808 | 244 |
| index.html#the-figures | 144 | 23,020 | 23,024 | 1610 |
| index.html#b-the-buildings | 15 | 1,290 | 1,294 | 20 |
| index.html#floor-5-movables | 77 | 7,498 | 7,502 | 97 |
| index.html#the-body-s-laws | 30 | 2,342 | 2,346 | 36 |
| index.html#the-things-drawn-each-frame-back-to-fr | 24 | 3,188 | 3,192 | 92 |
| index.html#floor-6-climate | 63 | 7,867 | 7,879 | 288 |
| index.html#floor-7-display | 28 | 2,927 | 2,931 | 75 |
| index.html#the-woods-cache | 51 | 4,814 | 4,818 | 89 |
| index.html#touch | 40 | 4,348 | 4,352 | 59 |
| menu.js | 259 | 41,707 | 41,745 | 641 |
| econ.js | 91 | 12,732 | 12,732 | 102 |
| combat.js | 53 | 7,637 | 7,637 | 101 |
| ai.js | 44 | 5,217 | 5,217 | 41 |
| sound.js | 56 | 5,632 | 5,632 | 66 |

## The books

| Book | Entries | Bytes |
|---|---|---|
| angles | 3 | 461 |
| capabilities | 25 | 5,321 |
| citations | 153 | 16,473 |
| colours | 9 | 951 |
| comments | 276 | 36,420 |
| ground | 4 | 640 |
| mass | 16 | 2,354 |
| measure | 186 | 24,519 |
| rules | 46 | 8,186 |
| screen | 10 | 2,597 |
| shells | 74 | 12,258 |
| sound | 51 | 11,159 |
| sprites | 31 | 5,485 |
| words | 6 | 1,881 |

## The shells

| Layer | Shells | Ticking nothing yet |
|---|---|---|
| 100 | 9 | 1 |
| 110 | 46 | 31 |
| 120 | 19 | 0 |

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
| X17 | permit | seal | a permit opening more than ten items, or a change it does not open |
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

996 items sealed · 890 book entries · 74 laws · 153 citations, 17 still to open · 7 known
