# First Keep: handoff (Build 35 pushed; Build 36 = layout, mockups only; see CUTS.md)

## What it is
Single-file HTML mobile RTS (Albert). Live: https://claude.ai/artifact/BYdPKYCJDQS3xw5fwxvjYV (version 34, Build 29). Updated in place each build with a label.

## Layout
- `src/NN-*.js` (00-pre, 01-rules … 16-boot) + `src/shell-head.html` + `src/shell-tail.html`; `build.py` joins them into `first-keep.html`; `wrap.py` makes `native/index.html`.
- `src` is its own git repo (last commit: Build 29). Backups: `first-keep-bNN.html`.
- Tests: `tests/gate.py` (4 iPhone sizes x web/native, 44 px taps, 12 px type, half-zoom tell-apart, calls `tests/words.py`: toasts/tips max 10 words). Playwright scripts are in `tests/e2e/` (see below).
- Notes: `CUTS.md` (every cut, per build), `GUIDE.md` (player guide; not regenerated for B29), `APP-PREP.md`.
- Build/check: `python3 build.py && python3 wrap.py && python3 tests/gate.py`. Syntax-check the combined script from `first-keep.html`, not per file (IIFE spans files).

## Working rules (Albert, standing)
- Make a list first; execute only after his double confirm ("yes yes", "go go go", "Sure go"). His standing vote on a list is "do all", exceptions named by him.
- Talk things out first. Simplest, leanest design; no fixes on fixes; merge; log every cut in CUTS.md.
- Honest, neutral pushback; no flattery. Real science and history. Bad events are an inconvenience, never game-ruining. Pay to help, never pay to win. Fun and hard, not annoying.
- Tell him before switching to Opus (he switches the model).
- SoRen (`/home/claude/soren-archive`) is read-only for ideas; no changes without his yes yes.

## Key technical notes
- Fixed timestep (DT 1/30, global `G`), nav grid NC=200 x NAVC=10, cached sprites (`SPR`, `BSPR`, `NSPR`), turned view (`SIDE`, `TILT`).
- Player keep at global (300,1700). Local frame: keep (0,0), `at(dx,dy)` mirrors per corner. Forest cleared within `FOREST.home`=360. Home pocket (berries, grove, stone, gold, iron) behind the keep via `LAYOUT` rows with angle ranges.
- Gunpowder is age 5 (`AGES[4]`): arquebus, bombard, musket, starfort; units flagged `gun`, not `archer`.
- Armour kit `KIT` 0-3 is part of the sprite cache key. Theatrics: `popC`, `celebrate`, `b.doneT`, `u.bornT`, `u.glowT`.
- Draw: painter list sorted by y, per-item try/catch -> `fault(e)` (saves and pauses after 2 distinct errors). Past bug: villagers carrying cloth/wool/beer threw in `drawUnit` and hid the Town Center.
- Toasts: `say(text, cls, secs, at, act)`; one of each at a time; `SET.msgs`, `SET.tips`, `advise()` ('!' = urgent). Pace: `speed()`, `paceBtn()`, `setPause()`.
- Save `SAVEV` = 27; old saves load with Messages on.
- Top bar at 375 px: homes icon hidden (`@media max-width:380px`); side padding 8 px at <=400 px.

## Open items
1. GitHub: DONE. Repo https://github.com/acohen2300/first-keep (main, game as `index.html`, Pages on). Phone link: https://acohen2300.github.io/first-keep. To publish a build: attach the repo with add_repo (push), copy `first-keep.html` to `index.html`, commit and push to `main`. Pages deploys in 1-2 minutes. The Claude GitHub app is installed on his account. This session could not reach github.io or the Pages API, so Albert checks the live link.
2. Sound: obeys the iPhone silent switch (`navigator.audioSession.type='ambient'`). Albert has not decided whether it should play on silent.
3. Real-phone test list: pinch zoom, box-select, build ghost, villager card, field dots, research dots, 30-minute bell, new top bar and corner chip, pace button.
4. Gunpowder balance (costs, bombard damage, AI timing) is first-guess.
5. Parked ideas: replays, biomes, interpolation, optional Auto jobs, readability cleanup before App Store, bundled fonts for native, "Add another conquest" step-up, slower first raid (~5 min), job row as one line (mockup B, he chose the old bottom).
6. GUIDE.md needs Build 29 changes (top bar, corner chip, one pace button, Messages toggle, side-by-side building).

## Status (Oct 27, evening)
- Live (index.html, Pages root): **Build 30**. Preview (preview/index.html, acohen2300.github.io/first-keep/preview): **Build 32**, waiting for Albert's phone test before it goes live (copy preview/index.html to index.html).
- Build 31-32 changes: see CUTS.md. Build 31: send strip, silence, Sound page, two-sided building cards, War Council ladder (Engagement, Battalions, Formations, Muster), save version 28. Build 32: trade in two lanes (stops, allies), guards (12 per caravan or stop), three trade researches, one Market rule, cards patched not rebuilt, text from tables, speed, fonts inside the file, build check.
- Scorecard doc (best in class vs First Keep): https://claude.ai/artifact/3rJiUoFJHj4t6BfWKgpsXv
- Agreed order: Build 33 elite touch and access; 34 the world (weather, wind, snow, battlefields, world settings: night/weather/seasons on/off or fixed); 35 the front door (demo world behind the menu with a visible finger, look around, story, did-you-know facts, tech map, new score card); 36 roads (counter-offer: dragged like walls, speed and +10% work, never required; Albert to decide). Then an elite pressure test against measurable bars, then a new list.
- Build checks: `python3 build.py` refuses syntax errors and duplicate top-level names; fonts are embedded from src/fonts at build time.

## Status at handoff (Oct 27)
Build 29 is live at the artifact URL (version 34) and on GitHub Pages. Nothing in progress. Next: his phone test of Build 29 and the sound-on-silent answer.

## Full transcript
`logs/session-1.jsonl` (raw log of the first session, 1.2 MB) is in the repo.

## Tests in the repo
`tests/gate.py` and `tests/words.py` are the release gate. `tests/e2e/` holds the 79 Playwright scripts used during development (t32 orders, t34 gunpowder, t37 formations, t38 draw-error hunt, t41 top-bar width, stress.py, shot*.py). They point at `file:///home/claude/first-keep/first-keep.html`; change the path to run them.


## Build 33 (preview)
Hold-to-box (no ⬚), state chip and Home on a second top row, map button (minimap shut after the first look), rank under the score, age button at the top of the Town Center card and as the bottom button, book and hammer tab icons, muted selected fill, rain rings on the ground, one-cell gap between buildings, parchment and ink cards (night dims them). Gate passes. Next: Build 34 the world, Build 35 the front door, Build 36 roads.

## Build 34 (preview, separate artifact)
One top bar; map, home and clock on the map corners; bottom = job row, ± row, then + Villager | People | Build. Build card with five filters. Score names jump to players. Minimap stars and diamonds. Build 33 stays at its own preview artifact for comparison.


## Build 36: the screen layout (OPEN, mockups only, nothing built in src/)
**Problem (Albert, Oct 27):** the bottom of the screen is "crazy": ~29% of a 390x844 phone (status pill + 6 job tiles with -/+ + Villager/Build row, ~290 px). He wants far less, and wants it to look good. Work in quick mockups, then one build, one test run, one push. He confirms with "yes yes".

**Albert's rules for this screen:** icons, not words, where possible; fewest rows; everything touching or evenly spaced; resource COUNTS belong top left; the "?" button should go and the map icon take its place; age on the top left and score on the top right (thin pills, middle clear, room for the iPhone pill); jobs are used a lot; a gap between groups; Build and People should look like the resource tiles.

**Facts that bound the design**
- Job tiles are Food, Farm, Wood, Stone, Gold, Iron. Albert thinks Farm should go (fold into Food: food workers already use free fields first). Hints and old saves mention "+ under Farm".
- Build has 5 categories (MENUS): Home, Military, Defense, Trade, Culture. Each opens a 12-slot card.
- 44 px tap rule (tests/gate.py). Six job tiles across 390 px leave ~30 px per - and +, so the gate needs an exception, OR one shared -|+ (see C).
- Status info that needs a home: age, season, clock, score and rank, training count, researching/ready (glows), idle villagers, army count and marching.
- Zoom % and civ name are being dropped from the status line.

**Layouts tried (all in `mockups/`)**
- A. Always-visible single row (Build icon | People | 5 job tiles), age/clock/score in a thin strip attached under the top bar, resources top left: ~76 px top + 86 px bottom. Image: `layout-always-visible.png`.
- B. Resources merged into the job tiles (each tile = icon + stock + workers + -|+), top bar holds age, clock, score: smallest, but pushes resource counts to the bottom (Albert prefers top left). Image: `layout-merged-tiles.png`.
- C. LATEST idea (Albert's): two collapsed icon pills at the bottom corners (Build left, Jobs right, ~56 px); tap one and the bottom row becomes that thing. Jobs row = hide arrow, People, 5 resources, ONE shared -|+ acting on the selected one (48 px wide each). Build row = hide arrow + 5 category tabs that open the existing card. Image: `layout-three-states.png`. Closed is the most map; costs 2-3 taps to change a job. Open question: keep a one-tap + Villager beside the Jobs pill when closed (my recommendation), and the idle badge on the Jobs pill.

**Files:** `mockups/layout-lab.html` is a playable scratch build with layout C (use `__mock.open('s0'|'sj'|'sb')`); `mockups/layout-lab.diff` is its change against `src/`. The scratch copy's JS wiring for C is at the end of its `16-boot.js`; the list stub elements in `shell-head.html` (#vilc, #bVil, #bBuild) only exist to keep old code from throwing. Rebuild C properly in `src/`, not from the diff, and delete the stubs.

**If Albert says "yes yes" to a layout, the full Build 36 list is:** the layout; Farm folded into Food; "?" removed (help into People card); map icon in the top bar; minimap and tip message repositioned under the new top strip; army count and research glow in the status strip; People - cancels a queued villager, tapping People opens the People card; every cut logged in CUTS.md (civ name and zoom % from the status line, Farm job, "?", job names); then ONE build, one `tests/gate.py` run at 4 sizes, one push, preview artifact update. Also update: stale tests that click #bArmy/#bRes (tests/e2e, b33.py), GUIDE.md, and the two hint texts that say "+ under Farm".

**Build 35 state:** preview https://claude.ai/artifact/GU58PoGRonFiVFanonJ5Rj (version 3); commit f41d288 on main; live `index.html` is still Build 30. Promote with `cp preview/index.html index.html`, commit, push, only when he decides.
