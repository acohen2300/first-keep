# First Keep: handoff (Oct 29, 2026, end of day; Build 59 on the preview)

Read in this order: this file, then `RULES.md` (how the game is built and how to work with Albert), then `SCIENCE.md` (every real-world number and its source), then `CUTS.md` (every change, per build, with measurements). The handoff before Oct 29 is kept whole in `docs/HANDOFF-to-oct29.md`; its build notes (40 to 52) are history, this file is current.

## What it is
Albert's single-file HTML mobile real-time strategy game, Age of Empires style, grounded in real history, science and math. Albert (Albert Labs) is not a coder; he designs, decides and tests on his phone.
- **Live:** https://acohen2300.github.io/first-keep (`index.html`): untouched since the Build 44 era. Live changes only on Albert's word.
- **Preview:** https://acohen2300.github.io/first-keep/preview/ : Build 59.
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
| 59 | The forager rule for villagers (with crowding); attack-value targeting; news by sight, hearing and messenger (the Post line); the market demand curve; spoilage; five computer fixes; controls by age; figures 0.66; tap counts; the button budget; save size and frame time measured. |

Also on Oct 29, decided in talk: the three mockups (31 army merge, 32 controls by age, 36 bigger figures; pictures in `mockups/`); the pricing direction; merging the small research steps killed (Albert: "I like tech"); the talk list folded into the to-do list.

## The harness, before and after (12 seeds, 40 minutes, the computers in all four seats)
| | Build 47 | Build 58 | Build 59 |
|---|---|---|---|
| Bronze age (median) | about 7 min | 7.2 min | 4.9 min |
| Classical age | 19 min | 19.6 min, 28 of 48 sides | 10.0 min, 46 of 48 |
| Medieval age | 2 of 80 sides (45 min) | 0 of 48 | 18 of 48, median 29.6 min |
| Hidden age opened | | 0 of 12 games | 2 of 12 |
| Blocked villager-seconds a game (median) | about 186 | 206 | 85 |
| Sides that fell | | 6 of 48 | 0 of 48 |
| Fortress seat wins | 12 of 20 | 7 of 12 | 7 of 12 |
Raw results: `tests/balance-57.json`, `-58.json`, `-59.json`. The Fortress winning most is accepted as fair (Albert: "mind your own business and do the right thing and likely win. Like life.").

## Repo layout
- `src/` joined in name order by `build.py` into `first-keep.html`; `wrap.py` writes `native/index.html` (the App Store wrapper); `publish.py [--preview] "message"` runs the gate, then commits and pushes. `preview/` is the preview copy.
- Rules, numbers only: `01-rules-basics` (ages, players, seasons) · `02-rules-units` · `03-rules-buildings` (also `GOODS`, `PRICE`, `SPOIL`) · `04-rules-tech` (the research tree, 230 steps in lines) · `05-rules-wild` (finds, Natives, Throne, the personalities `PERS`) · `06-rules-tuning` (climate, health, events, `TELL`, `SAVE`, `SCENARIOS`, `UI_BUDGET`).
- Words: `07-text` (every word: `WHY`, help, `EV_TEXT`, `EV_WHY`, `SCEN_TEXT`, `LEDGER_WORD`). No apostrophes in game words.
- Core: `08-core` (state, helpers, the sun and moon, `earn`/`spend`/`LEDGER`, `lanchester`, `nextIn`/`hazard`, `rangeFrom`, `stats`, `sightOf`) · `09-nav` (paths, the danger map) · `10-world` (the map, `newGame`, `applyScenario`).
- Simulation: `11-orders` (what a side can do; diplomacy; the market; `moveVil`) · `12-sim-core` (`step`; `forage`, `bestNode`, `pickVil`, `FORAGE`) · `13-sim-civil` (villagers) · `14-sim-troops` · `15-sim-spatial` (`bestFoe`, `foeValue`, `canBeat`) · `16-sim-fight` (`hurt`, `finish`, score) · `17-ai` (the computers, `think`) · `36-economy` (stores, trade, health, seasons, spoilage, the market price) · `37-events` (climate, sky, events, the horde) · `38-natives` · `39-games` (peace, Games, hidden age, crowns, chronicle) · `39-huddle` · `40-emergency`.
- View: `18-figures` (cached sprites) · `19-building-art` · `20-view-base` (`FIG`) · `21-view-frame` · `22-view-fog` · `23-view-things` (fire, light, shadows) · `24-view-overlays` · `25-view-weather` (lightning: keep its 0.34 s gap).
- Touch and cards: `26-input` · `27-cards-core` · `28-army-strip` · `29-card-pages` · `30-cards` (the `CARDS` table, including Tap counts) · `31-guide` · `32-frame` (top bar, `say`, `tell`, `postTick`, `showByAge`, end screen) · `33-verbs` (every button; `tapCount`).
- The rest: `34-save` (save v35, `MIGRATE` steps) · `35-sound` (`MAT`, `knock`) · `41-boot` (`window.__fk`, the test hook) · `shell-head.html` (CSS and markup).
- Records: `RULES.md`, `SCIENCE.md`, `CUTS.md` (with the parked list), `GUIDE.md` (regenerated from the game), `APP-PREP.md` (the path to the App Store), `docs/` (history), `mockups/`, `mock/`.

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
10. **The computers past Medieval**: 18 of 48 sides reach it by 40 minutes; probe what holds them next (`tests/probe.py`), one cause at a time.

## Up in the air (open, not yet on the to-do list)
- **Albert's phone test** of Build 59 on his own phone (he ran the stranger test before; it looked fine).
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
