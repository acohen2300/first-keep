# First Keep: handoff (Oct 30, 2026, afternoon; Build 62 on the preview)

Read in this order: this file, then `RULES.md` (how the game is built and how to work with Albert), then `SCIENCE.md` (every real-world number and its source), then `CUTS.md` (every change, per build, with measurements), then `AUDIT-62.md` (the Oct 30 audit: measurements, the group tables, game theory, and the questions Albert should ask). The handoff before Oct 29 is kept whole in `docs/HANDOFF-to-oct29.md`; its build notes (40 to 52) are history, this file is current.

## What it is
Albert's single-file HTML mobile real-time strategy game, Age of Empires style, grounded in real history, science and math. Albert (Albert Labs) is not a coder; he designs, decides and tests on his phone.
- **Live:** https://acohen2300.github.io/first-keep (`index.html`): untouched since the Build 44 era. Live changes only on Albert's word.
- **Preview:** https://acohen2300.github.io/first-keep/preview/ : Build 62. It keeps its own save (`firstkeep.preview.*`), apart from the live game's.
- **Repo:** https://github.com/acohen2300/first-keep, branch `main`, public. Pages deploys a minute or two after a push.
- **Commits:** as `Albert <acohen2300@users.noreply.github.com>` (never his Gmail; the repo is public), with the session's `Co-Authored-By` and `Claude-Session` trailers (`publish.py` takes them from the `TRAILER` environment variable).

## Where things stand (one paragraph)
The game has three ways to end (conquest, holding the Throne, finishing the Enlightenment) and three crowns that name a winner on each path (Wealth, War, Wellbeing), plus an overall. The world runs on established models: a real sun and moon, a Markov sky, a temperature and wetness climate, Rothermel fire, Pandolf walking, SIR sickness, logistic flocks, projectile range from height, the forager's rate for villagers, the attack-value rule for soldiers, a demand curve for the market, first-order spoilage, Poisson random events. Build 59 fixed the computers' stall in the Classical age (five logic errors, found by probing). The open problem: the computers reach Medieval in 18 of 48 sides by 40 minutes and do not yet reach the end of the peace path on their own.

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
| 62 (Oct 30) | The equations: one home for the first-order lag and logistic growth; nerve on Dupuy's break point with exponential recovery; flanks by the line, not the figure; wounds as a lag; loyalty on the lag; the ground as one chain (snow at 1 °C, degree-day melt, Stefan ice, water conserved, traction by friction, ruts by traffic in one map); sound by ISO 9613-2; the camera on a critically damped spring; Briggs plume; the crew law cited. The lean pass: the old buildings on the one light, `freeVil`, one draw budget with a way back, the dock CSS and the second traffic map gone. Optimization: every sun shadow one path, the badge and the piles cached (measured). `AUDIT-62.md`. |
| 61 (Oct 30) | Albert's second list after his first full games: land workers stay put and wild workers move only within sight; no auto-hunting on your side; Replant (half cost, stumps); keep placing; Stop, Dismiss, Stop all, Idle to me; open yards (Workshop, Foundry); the Jobs row's three pages (Jobs, Squad room, War room: four squads, missions with a promised time; the Huddle and the dock gone, half/quarter/nearest cut); the map tap's 👤 / ⚔; the Market card rebuilt; built-out kinds dim with ✓; tree shadows from the sun; fire as t² and the view factor; sight blocked by woods and capped by Koschmieder in fog and snow; more room at the start; the water blended; concept III art for fourteen buildings with one light and a plot family; the build grid; save v37. New rule: use the recognised real-world equation where one fits, flag it where it cannot. |

Also on Oct 29, decided in talk: the three mockups (31 army merge, 32 controls by age, 36 bigger figures; pictures in `mockups/`); the pricing direction; merging the small research steps killed (Albert: "I like tech"); the talk list folded into the to-do list.

## The harness, before and after (12 seeds, 40 minutes, the computers in all four seats)
| | Build 47 | Build 58 | Build 59 | Build 61 | Build 62 |
|---|---|---|---|---|---|
| Bronze age (median) | about 7 min | 7.2 min | 4.9 min | 4.6 min | 4.4 min |
| Classical age | 19 min | 19.6 min, 28 of 48 sides | 10.0 min, 46 of 48 | 8.8 min, 48 of 48 | 8.6 min, 48 of 48 |
| Medieval age | 2 of 80 sides (45 min) | 0 of 48 | 18 of 48, median 29.6 min | 30 of 48, median 21.1 min; Gunpowder 3 of 48 | 27 of 48, median 21.7 min; Gunpowder 3 of 48 |
| Hidden age opened | | 0 of 12 games | 2 of 12 | 1 of 12 | 1 of 12 |
| Blocked villager-seconds a game (median) | about 186 | 206 | 85 | 222 (seed 4 probed: lower than 60) | 134.5 |
| Sides that fell | | 6 of 48 | 0 of 48 | 0 of 48 | 0 of 48 |
| Fortress seat wins | 12 of 20 | 7 of 12 | 7 of 12 | 4 of 12 | 6 of 12 |
Raw results: `tests/balance-57.json`, `-58.json`, `-59.json`, `-60.json`, `-61.json`, `-62.json`. Build 61's villager rules moved the computers' play: more sides reach Medieval, three reach Gunpowder; the blocked count rose at the median and fell on the one seed probed (CUTS, Build 61). Build 60 played every harness game identically to 59 (computers only, fog off): its fixes act on your side, the fog and later ages. The Fortress winning most is accepted as fair (Albert: "mind your own business and do the right thing and likely win. Like life.").

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
1. **Milestones**: Albert's idea, to define with him. Remind him.
2. **Home Screen and end screen**: after a match, a page to see what happened: the crowns, timeline charts (score, army, gathering by the minute), the chronicle that jumps the map to each moment, comparison with past games on the phone; then best-moment ghost replays; full replays later (native). Mockup first.
3. **The Games as a stadium**: the Throne island at night from above, floodlights from the light system, a green oval, four champions racing, a crowd in court colours. Albert: "a football stadium at night, from a helicopter". Mockup first.
4. **Merge the two army systems** (mockup 31): one Army row, one set of names, the dock gone.
5. **Deepen the home economy** (Albert: deepen, not cut).
6. **Sounds**: to talk when Albert is ready, the iPhone silent switch included.
7. **Pricing (decided direction)**: free, with one or two paid unlocks, a subscription possible, never pay to win. Build when the game goes native.
8. **Core direction review**: after Build 59 (now).
9. **Why the computers' caravans die so often**: one computer rebuilt 20 in fifteen minutes; find the cause before more trade work.
10. **The computers past Medieval**: 30 of 48 sides reach it by 40 minutes (Build 61); probe what holds them next (`tests/probe.py`), one cause at a time.
11. **Blocked villagers** (Build 61): the harness median doubled (107 → 222 villager-seconds) while seed 4 fell; probe the seats with the high totals before any rule moves.
12. **Game theory for the computers' decisions** (Albert, Oct 30; `AUDIT-62.md` §7): tit-for-tat diplomacy (Axelrod), the Nash bargain for the price of peace, Cournot selling at the Market, the truce as an equilibrium, tower placement as p-median. In that order. Needs its list and the double yes.
13. **The group merges** (`AUDIT-62.md` §4): three text sizes (the CSS has seven; 13px, the most used, is not in the rule), every colour used twice a token (95 hand-written), three radii, one gap, one tracking for uppercase. A list of about 150 places; the gate measures contrast and taps, a screenshot judges sameness.
14. **Minification and woff2**: a name-keeping minifier would take about 35% of the shipped file (comments and indentation are 20% of the source); woff2 a third of the fonts. Both need a decision (stack traces by column) and a network with the registries.
15. **A frozen crossing**: the ice thickness exists (Stefan); letting people cross the lake in winter is a rule change for the Fortress's wall. Its own list.
16. **From the audit, small and listed**: the two stray toast kinds; the War room's aim words off the map; the chip pulsing once when the row first has a soldier; the first card after Setup; the end screen worth the game (to-do 2).

## Up in the air (open, not yet on the to-do list)
- **Albert's phone test** of Build 62 on his own phone: the camera glide (Follow, Home, the small map), ice on a thaw-freeze morning, ruts on the lanes in rain, the sound falling off by distance, the frame rate with the shadows in one path; then of Build 61: the three pages of the Jobs row and the squad flow, the map tap, Replant by tap, the new art at his zoom, and the frame rate with tree shadows (measured only headless here: 9.7–12.3 ms a frame either way, noise).
- **Albert's calls from Build 61**: built-out kinds dim with ✓ rather than tint red (his words were red); the Warehouse / Stores view (27) parked; the computers still hunt on their own (they have no finger).
- **Sight**: woods block the line of sight, buildings do not; the Koschmieder values are design (no metre in the game).
- **Score and transfers**: tribute, ransom, tax and loot count as wealth for the side that receives them, and nothing comes off the payer's. A question for Albert (from the audit).
- **Your villagers under fog work only what you have found** (Build 60): measured a cost when nobody scouts (gathered at 10 minutes down on two of three seeds). Albert to judge in play; one line to undo.
- **The catch-up cap** drops game time on a slow phone at top speed: measure on the phone before changing.
- **The computers see the whole map**: kept as an assumption of the game, said in the Guide; fog for them would be a large job.
- **The news system's feel**: early games are quieter by design; Albert should play one and say if it is too quiet.
- **Frame time**: 7 to 14 ms a frame here across runs, not controlled; a measured run on the phone is the real number.
- **Gunpowder balance** is still a first guess.
- **The Maurya** won none of the harness games again (4 plays a run: small sample).
- **Native only:** items 49 and 50 of the Oct 29 list.
- **Idea backlog** (ask first): biomes, interpolation, optional Auto jobs, "Add another conquest" step-up, slower first raid; the parked list at the end of CUTS.md.
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
