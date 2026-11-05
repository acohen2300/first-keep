# First Keep v100 · Inventory

Written by `index.py` at every build, never by hand. Version 100 · 11; the change in brackets is against the last seal.

| Group | Items | Lines | Characters | Bytes |
|---|---|---|---|---|
| Game code | 28 | 1,604 | 232,003 | 232,301 |
| Books | 496 | 0 | 81,406 | 81,618 |
| Laws | 73 | 0 | 7,081 | 7,320 |
| Tools | 4 | 249 | 23,068 | 23,126 |

## The trades (code)

| Item | Lines | Characters | Bytes | Typed numbers |
|---|---|---|---|---|
| index.html#page | 27 | 1,620 | 1,620 | 11 |
| index.html#frames | 13 | 1,525 | 1,526 | 3 |
| index.html#the-frames | 12 | 1,462 | 1,466 | 13 |
| index.html#qbf-the-dice | 8 | 1,366 | 1,378 | 31 |
| index.html#the-coast | 11 | 965 | 976 | 19 |
| index.html#the-ground | 28 | 2,447 | 2,451 | 38 |
| index.html#floor-2-terrain | 81 | 11,224 | 11,273 | 134 |
| index.html#floor-3-non-movables | 41 | 6,322 | 6,347 | 89 |
| index.html#drawn-once-in-the-view-frame | 47 | 4,860 | 4,865 | 126 |
| index.html#the-view | 9 | 1,076 | 1,080 | 16 |
| index.html#the-door | 40 | 3,622 | 3,626 | 70 |
| index.html#the-brushes | 10 | 1,196 | 1,200 | 28 |
| index.html#the-building-art | 314 | 49,445 | 49,449 | 4101 |
| index.html#the-node-art | 26 | 3,893 | 3,897 | 244 |
| index.html#the-figures | 144 | 23,445 | 23,451 | 1620 |
| index.html#b-the-buildings | 15 | 1,856 | 1,868 | 23 |
| index.html#floor-5-movables | 68 | 8,064 | 8,084 | 110 |
| index.html#the-body-s-laws | 30 | 2,996 | 3,006 | 37 |
| index.html#the-things-drawn-each-frame-back-to-fr | 24 | 3,644 | 3,649 | 92 |
| index.html#floor-6-climate | 61 | 9,926 | 9,961 | 297 |
| index.html#floor-7-display | 28 | 3,972 | 3,977 | 77 |
| index.html#the-woods-cache | 51 | 5,372 | 5,377 | 89 |
| index.html#touch | 40 | 4,611 | 4,615 | 62 |
| menu.js | 250 | 43,962 | 44,005 | 643 |
| econ.js | 76 | 12,005 | 12,010 | 104 |
| combat.js | 53 | 8,736 | 8,742 | 105 |
| ai.js | 44 | 6,191 | 6,194 | 55 |
| sound.js | 53 | 6,200 | 6,208 | 69 |

## The books

| Book | Entries | Bytes |
|---|---|---|
| angles | 3 | 599 |
| capabilities | 25 | 5,927 |
| citations | 88 | 9,705 |
| colours | 9 | 1,118 |
| ground | 4 | 819 |
| mass | 16 | 2,515 |
| measure | 166 | 27,046 |
| rules | 33 | 6,193 |
| screen | 10 | 2,928 |
| shells | 74 | 15,941 |
| sound | 37 | 7,884 |
| sprites | 31 | 7,102 |

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
| X2 | cited | books | a book entry with no citation, or citing an N not in the Citations book |
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
| X21 | pages | seal | INDEX.md, BOOKS.md or INVENTORY.md not what the books say (on GitHub) |
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

601 items sealed · 496 book entries · 73 laws · 88 citations, 17 still to open · 25 known
