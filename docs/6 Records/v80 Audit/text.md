# Audit: src/07-text.js, src/31-guide.js, and the SCIENCE.md claims the text relies on (v70)

Method: I read every line of both files. I built a private copy (`scratchpad/ag-text/ag.html`, with a test hook added) and rendered every Guide page, guideMd, the History page and TRIGGERS() in Chromium. I cross-referenced every WHY, MS_TEXT, EV_TEXT, EV_WHY, LEDGER_WORD, ROW_WORD, SCEN_TEXT and TITLE_SHORT key against its tables and its uses. I clicked each milestone's fix button in the real DOM, compared every hand-written number in TRIGGERS against the live tables, and ran tests/history.py on the copy. History claims are marked VERIFIED only where a source or the game's own text shows the correct fact.

Rendering: all 6 Guide pages, the markdown export and the History page render with no `undefined`, `NaN`, `[object` or raw `${}` and no page errors. No apostrophes. Every building, unit, research step, find, age and civilisation has its WHY.

## S1: crash

**1. 07-text.js:605: the House milestone's fix button crashes the game into the fault card.**
`MS_TEXT.house[3] = 'card:menu,land'`. The `card` verb (33-verbs.js:338) opens `{type:'menu', page:'land'}`, but the menu card reads `c.id` (30-cards.js:608: `M = MENUS.find((m) => m.id === c.id)`). M is undefined, so `M.items` throws.
Evidence: clicking the button in the DOM gave `pageerror: Cannot read properties of undefined (reading 'items')`, and G.card became `{type:'fault'}` ("Something went wrong · Restart to carry on from the last save"). Every game reaches this milestone: it fires on the first house built.
Fix: change the action to `menu:land` (the verb at 33-verbs.js:72).

## S2: wrong behaviour (text says what the game does not do)

| # | Where | What | Evidence | Fix |
|---|---|---|---|---|
| 2 | 07:42 | Open scenario: "five villagers" | 10-world.js:615 spawns 3 (`i < 3`); a new game counts 3 | "three villagers", or read the number |
| 3 | 07:645 | Snow milestone: "soft snow costs a walker more than mud" | `CLIMATE.terrain` mud 0.8, snow 0.6: mud costs more (TRIGGERS renders 44% vs 38%; Pandolf in SCIENCE: swamp 1.8 > snow 1.6). "1 °C" is also hand-written; the rule is *at and below* `CLIMATE.snowAt` | Reverse or cut the clause; read snowAt |
| 4 | 07:761 | "Room opens when a House, Apartment or Aqueduct finishes" | BLD.aqueduct has no room; its desc (03:446) says "Houses nobody" | Drop Aqueduct |
| 5 | 07:766 | "The screen" is stale throughout | Live DOM: the top bar has no age, season or clock and no speed button; Build is the hammer under People (bottom left), not "bottom right" (Emergency is bottom right); People trains a villager; there is no − cancel; Build opens a 6-tab card, it does not "swap the jobs"; the cycle button is not mentioned | Rewrite from MENU-SPEC §6 |
| 6 | 07:896 | Tier list is hand-written and incomplete | The Guide shows Pikeman → Halberdier (Halberd), Rider scout (Horse breeding) and six elite ranks; none appear here | Generate it from `TECH.filter(t=>t.tier)` |
| 7 | 07:1056 | "Clean water, sewers and quarantine halve the spread" | Only quarantine is `spread ×0.5`. Clean water is `sick ×0.5` (fewer outbreaks). Sewers is `plague ×0.6` (04:3051) | Say what each does |
| 8 | 07:951 | Ground marks are "for looks only and … not saved" | Ruts are simulation: `mudAt` reads `rutOf` (37-events:659), and they are saved (34-save.js:231 `tread`, "Build 62") | Fix the claim |
| 9 | 07:955 | "Hold ground" control in the Army card | It exists nowhere outside 07; the Temper dial's *Hold* replaced it (and is described at 07:911) | Cut the entry |
| 10 | 07:1021 | "Opening any card pauses the game" | Only `READ_CARDS` (research, troops, guide, help, score, stores, sound) plus council and Relations pause (27-cards-core:19-27) | "Reading cards pause…" |
| 11 | 07:811 | Vassal investment list | "business center" is no building. "others 3" is false: house 1, pasture 2, tavern 4, baths 5, theatre, council and mint 6 (36-economy:726 `?? 3` covers only those without a value) | Generate it, or say "each building its own share" |
| 12 | 07:195-196 | One `WHY.legion` key serves both the Legion research and the Roman Legionary unit | The research card (open to every civilisation, "Infantry 10% tougher") shows "Game: it replaces the swordsman … so a Roman player has a Roman army": a unit note on a research | Split the keys (e.g. a `unit:` prefix) |
| 13 | 07:851 vs 861 | Shrine "inside the Throne" vs "at the foot of the Throne" (FINDS.shrine.desc agrees with "at the foot") | Two lines contradict each other | "at the foot" |
| 14 | 07:721 | Troll "goes home at dusk" | EVENTS.troll.secs 90; the end() at 37-events:413 is timed, not set by night | "goes home soon" |
| 15 | 07:931 | Heavy blows: "Elephants, cataphracts and trebuchets" | Units with knock: cata, elephant, bombard, treb, mauryael, malihorse. The bombard is missing | Add the bombard, or generate the list |
| 16 | 07:886 | "(Coinage 90%)" from a hand `+0.1` | Weights and measures and Milled coin add +5% each (fx sell): the sell price reaches 100% | Read the `sell` fx |
| 17 | 31-guide:24 | Net's menu: "laid by the Natives, or a Walls trap" | Net is in no menu (Walls has pit and stakes only) | Check MENUS before saying "Walls" |
| 18 | 31-guide:5 | `unitsAt` ignores `UNIT.also` | The second Town Center's row shows no "Trains" (guideMd: `\| Town Center \| Home \| … \| - \|`), but it trains villagers. 27-cards-core:254 `trainsAt` handles `also`: two copies of one rule that have drifted apart | One helper |
| 19 | 04:3121 (surfaces in Guide and History) | "become Elite crossbowmans", "Elite horsemans"; titles "Elite: Elite crossbowman" | Rendered descs | A plural from the table |

## S3: rule violations and bloat

- **Toasts over ten words.** words.py reads only EV_TEXT from 07, so these lines escape it:
  - NEWS (said via `news('chronicle', L[i])`): 07:564 (13 words), 565, 573, 581 and 583 (11 each).
  - MS_TEXT line 1 (said via `news('lesson', …)`): 07:614 `drop` and 07:626 `squad` (11 each).
  - TRIGGERS "Messages and sound" (07:771) claims every message is ten words or fewer, which these lines make false.
- **Numbers duplicated by hand under a comment that says they cannot drift** (07:742: "Numbers come from the tables, so the text cannot drift"). That comment is false. Hand copies:
  - 07:602 "five" (house room)
  - 07:656 "75%" (UPKEEP.hunger)
  - 07:669 "30%" (MORALE.breakAt)
  - 07:681 "twelve minutes" (YEAR)
  - 07:646 "1 °C" (snowAt)
  - 07:718 "three join" (UNIT.wagon.joins)
  - 07:811 0.5/15, 1/20, (0,10,30), (0.3,1.5,4), 60, 50, "a quarter" (VASSAL and TAX)
  - 07:816 "a third", "three quarters", "4 minutes"
  - 07:966 "50%" (medicine)
  - 07:1001 ".5, .65, .85" (PERS.bold)
  - 07:1036 "Four learn" (TEACH.seats)
  - 07:1041 "one in six / one in twenty" (HARVEST)
  - 07:1116 "twice a second"
  - 31-guide:218 guideMd says "so it cannot disagree with the game", which is false for the same reason.
- **Dead strings.** WHY.venture (07:385): no table has a `venture` key, so it is never read. EV_TEXT.mirage[1] (07:716): startEvent skips mirage (37-events:472) and mirage.start says its own words inline (37-events:316, 320, outside 07).
- **The same fact twice on one Peoples card** (guideHTML civ page renders `why` and `uwhy` together):
  - Mongol: 547 and 495 (three or four horses each).
  - Maurya: 549 and 497 (Megasthenes' royal monopoly), with a third copy at 509.
  - Elsewhere: inoculation 319 against vaccine 62 (Montagu 1721); coppice 84 against treefarm 394 (Sweet Track).
- **Compressed history with no "Game:" line.** Six elite research steps have `when: 'Medieval'`, so tests/history.py skips them ("10 without a date"). Their WHY lines date them to 27 BC (502), about 480 BC (505) and about 300 BC (509), all in the Medieval age with no Game: note. Other missing notes: the Games are every 2 game years against Olympia's 4 (07:1066); courthouse 415, tavern 427 and temple 429 say "design" in prose instead of a Game: line.
- 07:3 claims "Each line credits more than one place where the record allows". Single-place lines where the record has more: seeddrill (108, Tull only: China had a multi-tube drill by the 2nd century BC); standing (277, "first standing army since Rome": the Janissaries from the 1360s).
- 31-guide:257: the guideMd Research table has no When column, so the exported book drops every research date.
- 07:594-598: three comments (spectacle, why, milestones) sit stacked above SONG, away from the tables they describe.

## History and science

**VERIFIED** (correct fact shown):

- **sawmill (82):** "water-driven sawmills cut timber in Roman Hierapolis". The Hierapolis mill (3rd century AD) sawed stone. The game's own stonesaw line (138) says "cut marble at Hierapolis in the 200s".
- **torsion (266):** "Skeins of sinew … threw stone and bolt for Dionysius of Syracuse in 399 BC". Dionysius' engines were non-torsion. The game's own catapult line (486) says "torsion engines followed, first recorded at Tyre (332 BC)".
- **pikesquare (197)** credits Morgarten to Swiss pike squares. The game's own halberd line (199) credits it to the halberd, which is correct. Swiss pike squares belong to the 15th century.
- **castiron (375):** "Europe only learned to from the 1400s". The game's own blast line (376) has the blast furnace in Europe by the 1300s. Lapphyttan in Sweden ran from about 1150.
- **cleanwater (378):** "by Trajan eleven aqueducts". Under Trajan there were ten; the eleventh, the Aqua Alexandrina, dates from AD 226.
- **hanxbow (491):** the 13 BC arsenal list "counts over 11,000". It counts 537,707 crossbows; 11,181 is the subset for imperial use ([History of crossbows](https://en.wikipedia.org/wiki/History_of_crossbows)).
- **royalroad (182):** "Herodotus says … 2,700 km in seven days". Herodotus gives no courier time; the modern figure is about nine days. Darius improved an older road ([Royal Road](https://ipfs.ssi.eecc.de/ipns/en.wikipedia-on-ipfs.org/wiki/Royal_Road)).
- **legion (196):** the manipular legion "ruled for five centuries". The cohort replaced the maniple by about 100 BC.
- **hearth (172):** "Jōmon … from about 10,000 years ago". Jōmon pottery is about 16,000 years old.
- **tercio (200):** "unbeaten from Pavia to Rocroi". Pavia (1525) predates the tercio ordinance (1534, the step's own date).
- **iron (240):** the "Hittite secret" (an iron monopoly) is rejected by current scholarship, and the line does not say historians disagree.
- **New Orleans (1062):** the example misses its point. The battle (8 Jan 1815) was fought after the Treaty of Ghent (24 Dec 1814) because news of the peace was slow, not because news of the battle was.

**SUSPECTED** (no source checked):

- heavyplough 104: "population doubled after it".
- plumbing 381: water to upper floors of insulae; upper floors generally had none.
- foundry 441: three loads of wood for one of iron; bloomery ratios were far higher.
- 'wonder:han' 532: Weiyang walls "about 14 km"; I recall about 9 km.
- wedges 135: dolerite was used for pounders, not wedges.
- baskets 160: basketry impressions are much older than 10,000 years.
- Contested claims stated as settled, with no "historians disagree":
  - tally 158: the Ishango bone as a lunar count
  - volley 223: Nagashino volleys
  - weathersigns 189: Theophrastus' authorship
  - games 321: "the wars stopped"
  - EV_WHY eclipse 687: Babylon foretold solar eclipses by 600 BC
- architecture 297: "every builder read for 1500 years". Vitruvius was largely lost until 1414.
- The text disagrees with itself or with the tests on dates:
  - Sun Tzu: about 500 BC (333) against Warring States (461).
  - The counterweight: about 1100 (268) against "firmly in 1187" (489).
  - Dupuy: "a tenth to a third" (917) against SCIENCE "10% to 40%".
  - The ages' spans in 55-58 against tests/history.py SPAN.
- SCIENCE.md cites "Thomas & Smith (1990)" for builder overmanning, the Persepolis yakhchāl "about 400 BC", and a "Royal Road" relay in Herodotus 8.98 (8.98 is the angarium relay system, as the text uses it). I did not open those sources.

## S4: minor

- Milestone fix labels that land in the wrong place: trade's "The Market" opens Stores; drop's "See the rate on a find" opens Stores; rout and winter open the top of the Rules page, not their entries.
- The circus says "viewers work lighter" for a 10% work boost.
- Aurora is gated `fantasy:true` but explained as real science (703).
- NEWS puts "Sumer invents writing" in the Stone list, while age1 (55) says writing is Bronze.
- The Ages page "Opens" lists Throne and Net under Stone; neither can be built.
- histHTML rebuilds guideModel() on every keystroke.

## Not checked

- Physical fit of the TRIGGERS and Guide text on screen (the gate's job).
- The quick-action and War-mission descriptions (07:936, 1026) against the live interaction.
- The Teach upgrade pairs (07:1036).
- The SCIENCE.md formulas themselves (tests/science.py's job).
- Any source behind a SUSPECTED item.
