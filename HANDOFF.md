# First Keep: handoff (Build 41j)

## What it is
Albert's single-file HTML mobile RTS (Age of Empires style). Albert is not a coder.
- Live: https://acohen2300.github.io/first-keep (`index.html`). Preview copy: `/preview`.
- Repo: https://github.com/acohen2300/first-keep, branch `main` (public). Pages deploys 1-2 minutes after a push. Sessions usually cannot reach github.io, so Albert checks the live link.

## How to work with Albert (standing rules)
- Talk it out first. Make a list; build only after his double confirm ("yes yes", "go", "Sure go"). His standing vote on a list is "do all", with exceptions named by him.
- Mockups first, then ONE build, ONE gate run, ONE push. No build per tweak. Look at every render yourself (and measure it) before showing him.
- Simplest, leanest design. No fixes on fixes: redo it cleanly. Merge, cut bloat. One mold, uniform sizes. Analyze by element (does it exist, why, where is its source, where else can it be reused).
- Log every cut in `CUTS.md`.
- Honest, neutral pushback. No flattery. Keep pitching good ideas, flagging which rule they break.
- Tell him before switching models (he switches them).
- **Git identity: the repo is public, so commit as `Albert <acohen2300@users.noreply.github.com>`, never his Gmail** (`git config user.email` before the first commit; history was rewritten on Oct 28 to remove it).
- Real game design: real science and history; fun and hard, not annoying; pay to help, never pay to win.
- SoRen (`acohen2300/soren-archive`, `p16/src`) is the yardstick for clean structure: one `cell()` mold, one `ICON` table, cards as a table plus one engine, files named by element.

## Repo layout (Build 41)
Source in `src/`, joined by `build.py` into `first-keep.html` (refuses syntax errors and duplicate top-level names; embeds the fonts). `wrap.py` writes `native/index.html` for the App Store wrapper.
- `00-pre` opens the one scope · `01-rules` **every number** (buildings carry their own `cap`, `nocap`, `armyRoom`, `invest`, `shelter`; weather, soil, sickness, routes, market, gather rates) · `02-text` every word (`WHY`, `TRIGGERS`; numbers read from the tables) · `03-core` helpers, settings, queries (`keepOf`/`popOf`/`capOf` answered once a step via `qc()`), effects (`fxv` memoised) · `04-nav` the walking grid and paths · `05-world` the map, `newGame`, `mkBld`, `addUnit`
- `06-orders` what a side can do and why not (`trainWhy`/`train` pairs), placing and box orders · `07-sim` the step, every tick, foes and grids (`nearestFoe`, `unitsNear`, `bldsNear`, `nodesNear`) · `08-ai` the computers
- `09-figures` people and beasts (data-driven looks) · `10-buildings` building art · `11-view` the camera and the draw (one tint fill; `scarStrike`) · `12-input` the finger
- `13-cards` the card engine (`openCard`, `renderCard`, patch) and the `CARDS` table, one entry per card type; `BLD_PAGE` for what a building kind adds · `14-guide` the Guide written from the tables · `15-frame` `ICON`, `cell()`, `buildPanel()` (the markup is built from the table), `ui()` (writes only changed words), messages, tips, `fit()`, `showEnd()` · `16-verbs` `ACT` and `PLAY`: every button's verb
- `17-save` (`SAVEV` 29, `MIGRATE`; trees as five numbers, hundredths, never mid-fight) · `18-sound` (and haptics) · `19-economy` trade, weather, fire, sickness, vassals, the computers' economy · `19-events` spectacle, hazards, the ground · `19-natives` the fifth side · `20-boot` the loop and the `window.__fk` test hook
- `shell-head.html` CSS and the static markup (the tally and corner buttons are empty shells filled by `buildPanel`).
- Check: `python3 build.py && python3 wrap.py && python3 tests/gate.py` (from the repo root; add `--soak` for `tests/soak.py`: three seeds, 20 game minutes, Hard, every hazard on, fails on any error, NaN or negative stock; about 3 minutes; run it before a big release, the fingerprint only plays five minutes). **Publish only with `python3 publish.py "Build NN: what changed"`**: it builds, runs the whole gate, and only then copies to `index.html` and `preview/`, commits and pushes. It installs a pre-push hook that refuses any push whose `index.html` the gate has not passed (`tests/gate-passed.sha`), so a push by hand is refused. Commit trailers go in the `TRAILER` environment variable.
- **The play fingerprint** (`tests/baseline.json`): the gate plays a fixed scripted game on seed 7 and compares every side's counts at each minute. The game cannot play differently by accident. A deliberate rule or balance change is accepted with `python3 tests/gate.py --accept "why"`, which rewrites the baseline and logs the reason in CUTS.md. This is First Keep's equivalent of SoRen's locked physics block.
- Notes: `CUTS.md` (every cut, per build; Build 37 lists the rebuild), `GUIDE.md` (player guide, regenerated from the game at Build 41j; regenerate with `F.guideMd()` after rule changes, it is written from the tables), `APP-PREP.md`.

## The gate (`tests/gate.py`, `tests/words.py`)
4 sizes × web and native: no page errors; taps at least 44×44 (except `.pm`); text at least 12 px; contrast at least 4.5:1; no clipped words; no card scroll from 390×844 up (except Help and Guide); buildings tell apart at half zoom; toasts and tips at most 10 words. **Build 37 added:** every button verb has a handler (static); every Guide entry has a why; real taps: Build row → Home menu → House starts placing, People − and +, + under Wood, People and Score cards, Pause, save and reload. **Also:** the play fingerprint (above). Last run: all PASS.

## The screen (Build 36 layout; Build 41 changed it, the grammar below and CUTS.md are current)
One pill of 8 cells on top (five counts, mute, pause, speed), the strip (age · season · clock, idle, score), six columns at the bottom (People, then a tile and − | + per job), Build as a corner button that swaps the row for Home, War, Walls, Trade, Culture, close. Map button top right, Home bottom left when away: all three are `.fab`. Tokens `--row:44px --strip:28px --t2:14px --r:8px --hair --sheet`. `fit()` sets `--ob` from the real height of `#orders`.

## Key technical notes
- Fixed timestep (DT 1/30), global `G`, nav grid, cached sprites, turned view (`SIDE`, `TILT`). Player keep at (300,1700); local frame mirrors per corner.
- Grids: units in squares of 48 (`UG`), buildings and nodes in squares of 100 (`SG`, rebuilt when a list changes). Spent nodes leave the list the same step (holding them stalls cutters beside them; the list is only copied when one is spent); the walking grid bumps `NAV.v` (throwing paths away) only when a square really changed.
- Draw: per-item try/catch to `fault(e)`, which now also puts the canvas back; sprite builders report through `fault` too.
- Toasts: `say(text, cls, secs, at, act)`; `SET.msgs`, `SET.tips`, `advise()` ('!' = urgent). Pace: `speed()`, `paceBtn()`, `setPause()`.
- Measured (phone-speed emulation, Build 36 → 37): one step early game 2.5 → 2.1 ms; 700-unit battle 27.5 → 22.4 ms; idle screen rewrites 37/s → 0.2/s; save 350 → 159 KB.

## Design
The long-game design doc (Oct 28): https://claude.ai/artifact/P3ThRoHEPXSjQXHaLTAiYM. Diagnosis, the Throne, politics, teeth (a Challenge level borrowed from SoRen), spectacle and world news, combat you steer, variety, look and sound, scale, and the build order 39-43. Read it before proposing features.

## Build 40 (one shot, five stages; see CUTS.md for each)
- **Relations at the Town Center** (Town | Relations sides): Ally / Neutral / Hostile per side, 30 s notice before war; emissaries judged by odds; vassal verbs (break ties, demand, force tribute, levy). `setRel`, `judgeEnvoy`, `noticeTick` in `06-orders`.
- **The Natives**, the fifth side with one brain (`19-natives`): the Throne citadel in the centre with the shrine inside, causeways, hidden traps (pit, stakes, net, as buildings of any side), regard (gifts with the Danegeld rule), raids, the sworn handover, the Throne as a win. The Fortress is a player (`PERS.fort`).
- **Events and hazards** (`19-events`): `EVENTS` scheduler (storm, flood, locusts, meteor, eclipse, quake, wildfire …), `HAZARDS` as the Challenge, the moon, news, the horde.
- **Combat**: nerve/rout, charge, fall back, prisoners and ransom, priest convert; shared caps (`capV`/`capA`); a fallen rival's room split among the living.
- **Fog of war** (`G.fog`, toggle in Help). **Tap rules**: tap selects, double tap opens the card, hold adds more (`12-input`).
- **Goods in-house**: Workshop (`BLD.makes`), Mint, Foundry, Quarry.
- **The research tree from history** (`TECH` in `01-rules`): 206 steps in lines (`line`), only the next step of a line shows; `need` for cross-unlocks; `w` (weight 1–10) sets cost and time; `when` is the date; `WHY[id]` the book. Helpers `lineOf/prevOf/needsOf/nextStep/isNext` in `03-core`. The generator that built the table lives in the session scratchpad (`techs.py`, `gen.py`); edit the table by hand from here on.
- **The ground remembers the weather** (`G.ground` mud/snow/ice, `groundTick`/`groundSpd`/`wearMul` in `19-events`): slows marches, ice slips, engines slide on snow, blades blunt; `GROUND` in rules. Levees: flood cells are 2 in `NAV.lake`.
- **Fire weapons** (`fire`/`blast` fx stats, in `hurt`), **garrison healing** (`GARRISON`, in `solTick`), **Teach** (`TEACH`, `TEACH_TO`, `teachWhy/teach/graduate` in `06-orders`; unit state `school`).
- **The look**: the war table (`shell-head.html`, `#card` block); the Build button is the card's lit tab; research steps carry `a{age}` for the age stripe. Rain pool, three-stroke lightning, sky band (`drawWeather`, `drawSky` in `11-view`).
- New fx stats the engine reads: soil, shelter, venture, diplo, convert, push, rest, cost, cut, zealsecs, spread, snow, ice, cold, wet, wear, flood, fire, blast, teach, garrison, charge, sight.
- Text rule: no apostrophes in game text (Albert, Build 40).

## The screen grammar (Albert, Build 41): every new control goes in one of these four, or it does not go in
- **Top bars: status, controls and info.** Tappable doors: each number or word opens the place it describes (age → Research, the People numbers → Army, ★ → Score and How to play, the bell → messages).
- **The game screen:** the world. One tap opens a building or a place; units are picked; open ground gives the quick strip (three taps in one spot: open, sword, All).
- **The action bar:** what is happening now and your control of it (what you picked, what it can do: jobs and Build, or Charge, Fall back, Hold, Teach; a deer: Hunt).
- **The bottom row: quick actions.** People makes a villager in one tap, Build under it; the five jobs with − and +.

## Build 41 (a to j, Oct 28; CUTS.md has each)
Play, pause and speed in one button; the Map cell; new-game setup on one page (settings as sliding toggles, Easy / Normal / Hard, the challenge as ticks, the daily challenge as a tick); the action bar (More, Done; Charge, Fall back, Hold, Teach; Hunt); three-tap dispatch from open ground; People makes a villager in one tap with Build under it; the Build card opens on what fits; tap a foe to name it. Six hazards: Hardest, Famine, Bad weather, Drought, Outlaws, Plague. Outlaw raids start at minute 10 (Easy 16), random 3 to 8 minutes apart, aimed fairly. `build.py` now also refuses a comment that ends in an assignment.

## Open items
1. Albert's real-phone test of Build 41j (tap sizes, the action bar, three-tap dispatch, People tile, 375 px).
2. Sound on the iPhone silent switch: undecided.
3. Gunpowder balance is a first guess.
4. **The computers starve for food (found Oct 28, not fixed; a balance change, so Albert decides).** In 36-minute games on seeds 1 and 3 (Normal, no hazards, an idle but defended player) the computer sides sat at age 1 or 2 of 5 (the Balanced one may go to 4). Food is the bottleneck: Classical needs 600 food and they hover at 10 to 150 while their armies grow; the aggressive side on seed 3 held about 5000 wood, 4000 gold and 4000 stone while 94 food short of the age. Options: the AI sells surplus at the market for food while saving for an age; more fields when saving. Any change needs `python3 tests/gate.py --accept "why"`.
5. Idea backlog (ask first): replays, biomes, interpolation, optional Auto jobs, "Add another conquest" step-up, slower first raid; the parked list at the end of CUTS.md.
