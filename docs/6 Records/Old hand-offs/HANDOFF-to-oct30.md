# First Keep: handoff (Oct 30, 2026, evening; Build 65 on the preview, Build 66 in progress)

Read in this order: this file, then `RULES.md` (how the game is built and how to work with Albert), then `SCIENCE.md` (every real-world number and its source), then `CUTS.md` (every change, per build, with measurements), then `AUDIT-62.md` (the Oct 30 audit: measurements, the group tables, game theory, and the questions Albert should ask). The handoff before Oct 29 is kept whole in `docs/HANDOFF-to-oct29.md`; its build notes (40 to 52) are history, this file is current.

## What it is
Albert's single-file HTML mobile real-time strategy game, Age of Empires style, grounded in real history, science and math. Albert (Albert Labs) is not a coder; he designs, decides and tests on his phone.
- **Live:** https://acohen2300.github.io/first-keep (`index.html`): untouched since the Build 44 era. Live changes only on Albert's word.
- **Preview:** https://acohen2300.github.io/first-keep/preview/ : Build 65. It keeps its own save (`firstkeep.preview.*`), apart from the live game's.
- **Repo:** https://github.com/acohen2300/first-keep, branch `main`, public. Pages deploys a minute or two after a push.
- **Commits:** as `Albert <acohen2300@users.noreply.github.com>` (never his Gmail; the repo is public), with the session's `Co-Authored-By` and `Claude-Session` trailers (`publish.py` takes them from the `TRAILER` environment variable).

## Where things stand (one paragraph)
The game has three ways to end (conquest, holding the Throne, finishing the Enlightenment) and three crowns that name a winner on each path (Wealth, War, Wellbeing), plus an overall. The world runs on established models: a real sun and moon, a Markov sky, a temperature and wetness climate, Rothermel fire, Pandolf walking, SIR sickness, logistic flocks, projectile range from height, the forager's rate for villagers, the attack-value rule for soldiers, a demand curve for the market, first-order spoilage, Poisson random events. Build 59 fixed the computers' stall in the Classical age (five logic errors, found by probing). The open problem: the computers reach Medieval in 21 of 48 sides by 40 minutes (Build 63) and do not yet reach the end of the peace path on their own.

## Oct 30 evening: start here (the computers, the map; nothing built yet)
Build 66 is work in progress (commit e212c89: the SoRen three: `tests/palette.py`, four named timings, `EXCEPTIONS.md`), not yet published. Everything below is findings and decisions in talk; the next step on each is Albert's.

**What the measurements found (scratch probes, no game change):**
- **The population runs** (8 seeds × 40 min against Build 63's same seeds). Lane round buildings off: Medieval 15 → 19 of 32 sides, blocked villager-seconds 260 → 121, wins move to the balanced style. Harsher army upkeep (foot 2, mounted 5): Medieval 18 of 32, blocked 103. Neither moved the time to Medieval (about 22 min) nor the war crown (aggressive 6–7 of 8).
- **The cost report** (the ledger, 15 sides in Classical, 263 side-minutes; `docs/trials/ledger_probe.py`). A side earns food 304, gold 134 and stone 53 a minute, and spends all of it: food on upkeep 121, units 119 and research 74; gold on research 50, trade 51 and units 32; stone on buildings 32 and research 17. About nothing is left toward Medieval (f1000 g500 s200). Saving only, the age would take about 6 minutes; it takes 20 or more, or never. **The cause is spending that does not wait for the save**, not too few villagers (an earlier guess, wrong). Not yet split by saving state; the suspects are the 90 s stall valve (`SAVE`) and the purchases with no `!saving` check (towers, priests, medics, siege, zeal, hiring at finds).
- **No age cap, but the playbook stops at Medieval:** the three personalities' build lists have 3 / 18 / 12 / 4 / 0 / 0 entries from Stone to Enlightenment. The ages after Medieval came later and the lists never followed.
- **The four starts on one map are within about 10%** (the fairness check); between maps they differ two- to threefold (wood 57–135, gold 13–44 in a 450 reach).

**Agreed in talk (Albert, point by point):**
- Personalities are taken out for now: level all sides first, measure, then add personality back as weights.
- The computers' logic: a random goal (a crown) from the side's own seeded stream; the goal picks a group of research (war: barracks, range, stable, smith, siege; wealth: mill, lumber, mining, market, dock, trading post; wellbeing: hospital, temple, school, courthouse); the layout, graded A/B/C per resource, sets the cost of each step; the cheapest path through the group (A*-style search; uniform-cost, since a group has no single end) with seeded mix-up; re-planned at every age change. The door's problem list (feed, house, defend) keeps the town alive on the way.
- Game theory (a mixed strategy from the harness's payoff table) comes after the economy works, not before.
- **The trial** (`docs/trials/planner-66.patch` on `src/05-rules-wild.js` and `src/17-ai.js`; `docs/trials/bal_lvl.py`, all four seats on the leveled `lvl`, all at war). Albert's test: 80 games should split evenly if the logic holds. A 40-game control with the old logic, leveled the same way, is needed, because leveled sides on fair maps may split evenly anyway. Results so far: the first 10 games, winners by seat 2, 1, 1, 1, 1, 0, 3, 1, 2, 2. The full 80 + 40 were left running in the Oct 30 session; rerun with `LV=lvl python3 docs/trials/bal_lvl.py --seeds 80 --minutes 30 --jobs 2 --html <built trial copy> --out lvl-80.json`, then `LV=bal` for the control.

**Map: a list waiting for Albert's double yes** (it goes in Build 66 with the SoRen three):
1. Cut the re-roll: one seed, one layout.
2. The Throne is a base rule: the centre, the same distance from every keep (Albert: "Fine. You're right").
3. Lakes and rivers random: count, size, place (today every corner gets one river of one width, for fairness).
4. Wild resources, finds and animals: random, as now.
5. Cut `fairness()`, `FAIR` and the gate test "maps fair on ten seeds"; keep the turtle measure (the computers use it).
6. RULES.md in Albert's words: base rules (flat page, four corners, clearance, home resources, the Throne central); random everything else; no reshuffle.
7. CUTS.md log with measurements, and the fingerprint's reason.
- **Open:** hazards. (a) random when none are picked, or (b) always random with the Setup choice removed?

**Open decisions for Albert:** War counts kills only (kills minus losses?); Wealth counts what is held (gathered only?); the score and the crowns measure doing well two ways (should the score be the crowns?); the lane round buildings (off?).

## Oct 29: what we did (Builds 48 to 59, all on the preview; CUTS.md has every detail and measurement)
| Build | What |
|---|---|
| 48 | Fixes: pocket trees, the danger map (`DANGER`), march then fan out, shared paths, a caravan crash since 45; the balance harness `tests/balance.py`. |
| 49 | Fair maps: each corner laid out on its own, measured by `fairness()`, re-rolled until fair. |
| 50 | Rivers from each corner's lake to the edge, with fords. |
| 51 | Sight from height (`lookout`), fog memory, three tower steps. |
| 52, 52b | Motion and life (steps, falls, flags, smoke, worn ground); an independent review's fixes. |
| 53 | Rivers as one stream; shop workers inside their shop; `RULES.md` and `SCIENCE.md` written. |
| 54 | The climate (`CLIMATE`): temperature, wetness, Markov weather, mud, snow, ice, Pandolf walking, Rothermel fire; `tests/science.py`. Locusts cut (Albert). |
| 55 | Sun and moon on the calendar, night from the sun's depth, one fire table (colour from temperature, inverse-square light), the Lights switch, shadows. Lightning untouched (Albert likes it). |
| 56 | SIR sickness, logistic flocks, range from height, the hearth line (hearth, ice house, chimney, lanterns), Baths, Theatre, Tavern, sounds by material. |
| 57 | Peace as a path (`39-games.js`): board truce, tribute, standing down, the Games, the hidden Enlightenment age, the crowns and the chronicle; random events as a Poisson process. |
| 58 | One home for every coin (`earn`, `spend`, the ledger); net-flow colours; selection sounds; the scout on foot; why-lines; 15-minute mode; three scenarios; the square law in one place; the history batch with `tests/history.py`. |
| 60 | The audit: refunds give back what was paid, limits in every age, the Anatomy loop, the shop trap, one shepherd a flock, stand down, spies, the Encyclopedie, the side doors, fog that holds (radar, alerts, odds, villagers), fog chosen at the start, the preview's own save, the card title pinned, `tests/tables.py`. |
| 59 | The forager rule for villagers (with crowding); attack-value targeting; news by sight, hearing and messenger (the Post line); the market demand curve; spoilage; five computer fixes; controls by age; figures 0.66; tap counts; the button budget; save size and frame time measured. |
| 65 (Oct 30) | The outside audit's three bugs as rules (red first in the preview, the people cell fits three digits, the door's tap follows what it shows); a fresh-eyes review of Build 64 and every finding fixed or cut: the door's second tap opens the Realm, one page backing, lines during a full card counted, 22 news lines grouped; one home for the colour code (the style sheet), for what the town needs (`NEEDS`), for the song; sixteen dead icons and verbs, the dead styles and the near-black gone; lint with no warnings; the book and × on the title's line. |
| 64 (Oct 30) | The door under People (five domains in the colour code: the realm, people, work, stores, tech; a tap to the fix, else the dashboard with the mail); the Build page as what the town needs; the pages fixed, Jobs, Build, War, Squad, Train; one gradient for every number (costs by distance, stores and jobs by velocity); the colour code (blue available, white well, green active, red wrong, gold chosen); messages as previews that fade, by group, a group hidden to the mail, repeats as a count; the ticker and the alert bar folded in; the thin status strip under the tally's columns; sound by the camera's height; ambience from what is in view; lint required to publish. |
| 63 (Oct 30) | Albert's third list and three outside audits: the one row (six slots, three shapes, five pages cycled by the one chip, tints by page, ✓/✕ in the sixth slot, ETA and pace before Go, the crosshair by colour, Orders for recruits, the Squad builder with ★ best, Build hot keys, intents); the map tap as muscle memory (sword, then All, under the thumb); cards in three sizes with the header line, rows that never jump, the Build menu as pictures with pins, the small worker card, the Stores drill-down both ways, the turtle plan, the bonuses named, Setup explained; one population (homes only; the aqueduct a water work; queues make what is asked); the audits' five bugs (group power, the tree finished, hostile gates as walls, stand down, stale plunder) and three small ones; milestones that teach; clearance on three sides, lanes round buildings, animals that slide along walls; frames drawn between steps; the save kept twice with a migration test; the map in five layers with the turtle measure of fairness; alignment guides with a light pull. |
| 62 (Oct 30) | The equations: one home for the first-order lag and logistic growth; nerve on Dupuy's break point with exponential recovery; flanks by the line, not the figure; wounds as a lag; loyalty on the lag; the ground as one chain (snow at 1 °C, degree-day melt, Stefan ice, water conserved, traction by friction, ruts by traffic in one map); sound by ISO 9613-2; the camera on a critically damped spring; Briggs plume; the crew law cited. The lean pass: the old buildings on the one light, `freeVil`, one draw budget with a way back, the dock CSS and the second traffic map gone. Optimization: every sun shadow one path, the badge and the piles cached (measured). `AUDIT-62.md`. |
| 61 (Oct 30) | Albert's second list after his first full games: land workers stay put and wild workers move only within sight; no auto-hunting on your side; Replant (half cost, stumps); keep placing; Stop, Dismiss, Stop all, Idle to me; open yards (Workshop, Foundry); the Jobs row's three pages (Jobs, Squad room, War room: four squads, missions with a promised time; the Huddle and the dock gone, half/quarter/nearest cut); the map tap's 👤 / ⚔; the Market card rebuilt; built-out kinds dim with ✓; tree shadows from the sun; fire as t² and the view factor; sight blocked by woods and capped by Koschmieder in fog and snow; more room at the start; the water blended; concept III art for fourteen buildings with one light and a plot family; the build grid; save v37. New rule: use the recognised real-world equation where one fits, flag it where it cannot. |

Also on Oct 29, decided in talk: the three mockups (31 army merge, 32 controls by age, 36 bigger figures; pictures in `mockups/`); the pricing direction; merging the small research steps killed (Albert: "I like tech"); the talk list folded into the to-do list.

## The harness, before and after (12 seeds, 40 minutes, the computers in all four seats)
| | Build 47 | Build 58 | Build 59 | Build 61 | Build 62 | Build 63 |
|---|---|---|---|---|---|---|
| Bronze age (median) | about 7 min | 7.2 min | 4.9 min | 4.6 min | 4.4 min | 4.5 min |
| Classical age | 19 min | 19.6 min, 28 of 48 sides | 10.0 min, 46 of 48 | 8.8 min, 48 of 48 | 8.6 min, 48 of 48 | 8.8 min, 46 of 48 |
| Medieval age | 2 of 80 sides (45 min) | 0 of 48 | 18 of 48, median 29.6 min | 30 of 48, median 21.1 min; Gunpowder 3 of 48 | 27 of 48, median 21.7 min; Gunpowder 3 of 48 | 21 of 48, median 19.5 min; Gunpowder 2 of 48 |
| Hidden age opened | | 0 of 12 games | 2 of 12 | 1 of 12 | 1 of 12 | 1 of 12 |
| Blocked villager-seconds a game (median) | about 186 | 206 | 85 | 222 (seed 4 probed: lower than 60) | 134.5 | 178.5 |
| Sides that fell | | 6 of 48 | 0 of 48 | 0 of 48 | 0 of 48 | 1 of 48 |
| Fortress seat wins | 12 of 20 | 7 of 12 | 7 of 12 | 4 of 12 | 6 of 12 | 1 of 12 (Aggressive 4, Balanced 4 and 3) |
Raw results: `tests/balance-57.json`, `-58.json`, `-59.json`, `-60.json`, `-61.json`, `-62.json`, `-63.json`. Build 63's swing (the Fortress 6 → 1, the war crown to the Aggressive seat 11 of 12, two sides short of Classical) follows the rules Albert changed on purpose (one population, targets by the group, the lane round every building); flagged, not tuned (CUTS.md, Build 63). Build 61's villager rules moved the computers' play: more sides reach Medieval, three reach Gunpowder; the blocked count rose at the median and fell on the one seed probed (CUTS, Build 61). Build 60 played every harness game identically to 59 (computers only, fog off): its fixes act on your side, the fog and later ages. The Fortress winning most is accepted as fair (Albert: "mind your own business and do the right thing and likely win. Like life.").

## Repo layout
- `src/` joined in name order by `build.py` into `first-keep.html`; `wrap.py` writes `native/index.html` (the App Store wrapper); `publish.py [--preview] "message"` runs the gate, then commits and pushes. `preview/` is the preview copy.
- Rules, numbers only: `01-rules-basics` (ages, players, seasons) · `02-rules-units` · `03-rules-buildings` (also `GOODS`, `PRICE`, `SPOIL`) · `04-rules-tech` (the research tree, 230 steps in lines) · `05-rules-wild` (finds, Natives, Throne, the personalities `PERS`) · `06-rules-tuning` (climate, health, events, `TELL`, `SAVE`, `SCENARIOS`, `UI_BUDGET`).
- Words: `07-text` (every word: `WHY`, help, `EV_TEXT`, `EV_WHY`, `SCEN_TEXT`, `LEDGER_WORD`). No apostrophes in game words.
- Core: `08-core` (state, helpers, the sun and moon, `earn`/`spend`/`LEDGER`, `lanchester`, `nextIn`/`hazard`, `relax`/`logistic`, `freeVil`, `rangeFrom`, `stats`, `sightOf`) · `09-nav` (paths, the danger map) · `10-world` (the map, `newGame`, `applyScenario`).
- Simulation: `11-orders` (what a side can do; diplomacy; the market; `moveVil`, `replant`, `stopVil`, `sendOut`) · `12-sim-core` (`step`; `forage`, `bestNode`, `pickVil`, `FORAGE`) · `13-sim-civil` (villagers) · `14-sim-troops` · `15-sim-spatial` (`bestFoe`, `foeValue`, `canBeat`) · `16-sim-fight` (`hurt`, `finish`, score) · `17-ai` (the computers, `think`) · `36-economy` (stores, trade, health, seasons, spoilage, the market price) · `37-events` (climate, sky, the ground chain `groundTick`/`muOf`/`ruts`, events, the horde) · `38-natives` · `39-games` (peace, Games, hidden age, crowns, chronicle) · `39-huddle` (the Jobs row's three pages: the Squad room's plans, the War room's missions) · `40-emergency`.
- View: `18-figures` (cached sprites) · `19-building-art` (one light: `lit`, `ao`, `rim`; the plot family `field`; the yard props) · `20-view-base` (`FIG`, the camera's spring `camGo`) · `21-view-frame` · `22-view-fog` (woods block sight: `woodsGrid`, `openLine`) · `23-view-things` (fire, light; `sunShadows`: every sun shadow in one path; the badge and pile caches) · `24-view-overlays` · `25-view-weather` (lightning: keep its 0.34 s gap).
- Touch and cards: `26-input` · `27-cards-core` · `28-army-strip` · `29-card-pages` · `30-cards` (the `CARDS` table, including Tap counts) · `31-guide` · `32-frame` (top bar, `say`, `tell`, `postTick`, `showByAge`, end screen) · `33-verbs` (every button; `tapCount`).
- The rest: `34-save` (save v37, `MIGRATE` steps) · `35-sound` (`MAT`, `knock`) · `41-boot` (`window.__fk`, the test hook) · `shell-head.html` (CSS and markup).
- Records: `RULES.md`, `SCIENCE.md`, `CUTS.md` (with the parked list), `AUDIT-62.md`, `GUIDE.md` (regenerated from the game), `APP-PREP.md` (the path to the App Store), `docs/` (history), `mockups/` (also the UI sheets `ui-62-*.png`), `mock/`.

## Tests (run from the repo root)
- `python3 build.py && python3 wrap.py && python3 tests/gate.py`: four phone sizes, web and native; no errors; taps 44 px; text 12 px; contrast; no clipped words; cards fit one page; buildings tell apart; toasts ten words at most; every button has a verb; **the equations against their sources** (`tests/science.py`); **every research step in its age** (`tests/history.py`); **the button budget** (33); maps fair on ten seeds; **the play fingerprint** (`tests/baseline.json`: a deliberate change is accepted with `--accept "why"`, and the reason goes in CUTS.md).
- `python3 tests/soak.py [seeds] [minutes]`: long games on Hard with every hazard; fails on any error, NaN or negative stock; reports the save's size (about 240 kB at 20 minutes; WebKit keeps about 5 MB a site) and a frame's draw time on this machine.
- `python3 tests/balance.py [--seeds] [--minutes] [--jobs] [--html] [--out]`: the harness above; also peace, Games, the hidden age and the crowns by seat.
- `python3 tests/probe.py [seeds] [minutes]`: what each computer does every five minutes (age, jobs, store, saving, spending by reason). This is how Build 59 found the stall's causes.
- `python3 tests/econ.py [--live]`: the economy alone.

## To do (agreed with Albert; each still gets a list and his double yes before building)
1. **Milestones**: built (Build 63, fourteen moments). To extend with Albert: which moments, and whether a milestone should open the Guide page rather than the card.
2. **Home Screen and end screen**: after a match, a page to see what happened: the crowns, timeline charts (score, army, gathering by the minute), the chronicle that jumps the map to each moment, comparison with past games on the phone; then best-moment ghost replays; full replays later (native). Mockup first.
3. **The Games as a stadium**: the Throne island at night from above, floodlights from the light system, a green oval, four champions racing, a crowd in court colours. Albert: "a football stadium at night, from a helicopter". Mockup first.
4. **Merge the two army systems** (mockup 31): one Army row, one set of names, the dock gone.
5. **Deepen the home economy** (Albert: deepen, not cut).
6. **Sounds**: to talk when Albert is ready, the iPhone silent switch included.
7. **Pricing (decided direction)**: free, with one or two paid unlocks, a subscription possible, never pay to win. Build when the game goes native.
8. **Core direction review**: after Build 59 (now).
9. **Why the computers' caravans die so often**: one computer rebuilt 20 in fifteen minutes; find the cause before more trade work.
10. **The computers past Medieval**: 21 of 48 sides reach it by 40 minutes (Build 63; 30 in Build 61); probe what holds them next (`tests/probe.py`), one cause at a time.
11. **Blocked villagers** (Build 61): the harness median doubled (107 → 222 villager-seconds) while seed 4 fell; probe the seats with the high totals before any rule moves.
12. **Game theory for the computers' decisions** (Albert, Oct 30; `AUDIT-62.md` §7): tit-for-tat diplomacy (Axelrod), the Nash bargain for the price of peace, Cournot selling at the Market, the truce as an equilibrium, tower placement as p-median. In that order. Needs its list and the double yes.
13. **The group merges** (`AUDIT-62.md` §4): three text sizes (the CSS has seven; 13px, the most used, is not in the rule), every colour used twice a token (95 hand-written), three radii, one gap, one tracking for uppercase. A list of about 150 places; the gate measures contrast and taps, a screenshot judges sameness.
14. **Minification and woff2**: a name-keeping minifier would take about 35% of the shipped file (comments and indentation are 20% of the source); woff2 a third of the fonts. Both need a decision (stack traces by column) and a network with the registries.
15. **A frozen crossing**: the ice thickness exists (Stefan); letting people cross the lake in winter is a rule change for the Fortress's wall. Its own list.
16. **From the audit, small and listed**: the two stray toast kinds; the War room's aim words off the map; the chip pulsing once when the row first has a soldier; the first card after Setup; the end screen worth the game (to-do 2).
17. **The Build page as a Town Hall bar** (Albert, on the Build 63 mockup: "Build should maybe become like a Town Hall bar instead with just important stuff. We can review later"): the hot keys are built as agreed; the bar is his to define.
18. **The Library's tech view** (Albert's item 24: "In library you can do the tech in a different format. We talk more later re this").
19. **A civilian emergency / group-control page** (Albert: "not overkill though"): held until the row has been played.
20. **Build 64 on his phone**: the door (does the order of importance feel right; is the pulse enough to notice), the Build page's picks, the gradient's reds and greens, the preview's 4 s and the group hiding, the thin strip's cells, the quieter zoom-out. Then: **the population question** (Albert, Oct 30: "we have to talk about the population thing"): with one population the Aggressive seat keeps an army the old room cap stopped (the war crown 11 of 12 in the Build 63 harness); the likely brake is upkeep or the computers answering a neighbour's army, and the lane round every building is to be measured on its own first. **The milestones' place** (Albert: their own element, where and when to decide).
21. **The one row on his phone** (Build 63): the five pages, the tints, the chip's icon, the ✓/✕ slot, the ETA line, the crosshair colours; the pin on the Build card; the frames between steps (smooth or not); the first sky (frost or snow at the start is the model's: day 80, night).
22. **The map layers**: whether the first sky should stay or the game should open clear (a one-line change in `newGame`); whether the lane round every building is too strict for the computers' towns (the harness after Build 63 says).

## Up in the air (open, not yet on the to-do list)
- **Albert's phone test** of Build 62 on his own phone: the camera glide (Follow, Home, the small map), ice on a thaw-freeze morning, ruts on the lanes in rain, the sound falling off by distance, the frame rate with the shadows in one path; then of Build 61: the three pages of the Jobs row and the squad flow, the map tap, Replant by tap, the new art at his zoom, and the frame rate with tree shadows (measured only headless here: 9.7–12.3 ms a frame either way, noise).
- **Albert's calls from Build 61**: built-out kinds dim with ✓ rather than tint red (his words were red); the Warehouse / Stores view (27) parked; the computers still hunt on their own (they have no finger).
- **Sight**: woods block the line of sight, buildings do not; the Koschmieder values are design (no metre in the game).
- **Room**: the aqueduct lost its 15 room in Build 63 (apartments carry it); the computers' towns may feel it. The computers still hunt on their own.
- **Score and transfers**: tribute, ransom, tax and loot count as wealth for the side that receives them, and nothing comes off the payer's. A question for Albert (from the audit).
- **Your villagers under fog work only what you have found** (Build 60): measured a cost when nobody scouts (gathered at 10 minutes down on two of three seeds). Albert to judge in play; one line to undo.
- **The catch-up cap** drops game time on a slow phone at top speed: measure on the phone before changing.
- **The computers see the whole map**: kept as an assumption of the game, said in the Guide; fog for them would be a large job.
- **The news system's feel**: early games are quieter by design; Albert should play one and say if it is too quiet.
- **Frame time**: 7 to 14 ms a frame here across runs, not controlled; a measured run on the phone is the real number.
- **Gunpowder balance** is still a first guess.
- **The Maurya** won none of the harness games again (4 plays a run: small sample).
- **Native only:** items 49 and 50 of the Oct 29 list.
- **Idea backlog** (ask first): biomes, optional Auto jobs, "Add another conquest" step-up, slower first raid; the parked list at the end of CUTS.md.
- **Market elasticity numbers** are labelled "cited", not "verified": the source page could not be opened this session.

## Decisions on record (Oct 29)
- Lightning stays exactly as it is (0.34 s gap).
- Locusts cut.
- Merging the small research steps killed: all 230 stay; hiding by age answers the clutter.
- Cutting the home economy rejected: deepen it.
- The Fortress seat winning most is fair.
- Peace is a real path: "I build to match life. They decide."
- Pricing direction: free plus one or two unlocks, a subscription possible, never pay to win.
- The move threshold for workers and soldiers: 18% (Albert).
- Fog stays, and holds: what you know comes from sight, hearing, a messenger or a spy (Albert, Oct 29). Fog is chosen at the start of a game.
- The first-person spy view: killed (Albert, Oct 29: "Bad idea. Kill it.").
