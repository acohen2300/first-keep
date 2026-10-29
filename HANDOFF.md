# First Keep: handoff (Build 46, preview only)

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
- Albert's thread rules (Oct 28): "Do it all, pristine, no patches or fixes, simpler the better; use the buttons we have, reskin them and point them somewhere else; this is an overlay on concepts most games already have." Preview first, live only when he says so. Keep pitching good ideas even if they break a rule. Commit trailers go in the `TRAILER` env var. No fixes on fixes. Fewest words.
- Tell him before switching models (he switches them).
- **Git identity: the repo is public, so commit as `Albert <acohen2300@users.noreply.github.com>`, never his Gmail** (`git config user.email` before the first commit; history was rewritten on Oct 28 to remove it).
- Real game design: real science and history; fun and hard, not annoying; pay to help, never pay to win.
- SoRen (`acohen2300/soren-archive`, `p16/src`) is the yardstick for clean structure: one `cell()` mold, one `ICON` table, cards as a table plus one engine, files named by element.

## Repo layout (Build 42)
Source in `src/`, 40 files joined in name order by `build.py` into `first-keep.html` (refuses syntax errors, duplicate top-level names and comments that swallow code; embeds the fonts). `wrap.py` writes `native/index.html` for the App Store wrapper. Each file opens with `// ═════ NN-name.js: what it holds ═════`.
- Rules (numbers only): `01-rules-basics` `02-rules-units` `03-rules-buildings` `04-rules-tech` `05-rules-wild` `06-rules-tuning` (events, weather, market, tuning) · `07-text` every word (`EV_TEXT`, `EV_LINE`, `TRIGGERS`) · `08-core` state, helpers, `say` · `09-nav` paths (`astar`, `route`, shared-path cache) · `10-world` map making
- Doing: `11-orders` what a side can do (`train`, `build`, `march`, `ordersTick`, `incomingTick`) · `12-sim-core` `step` (calls `reap`, `sidesTick`) · `13-sim-civil` `14-sim-troops` `15-sim-spatial` `16-sim-fight` · `17-ai` the computers (`think`)
- Seeing: `18-figures` `19-building-art` `20-view-base` (camera, `followCam`) `21-view-frame` (`draw`, a list of named layers) `22-view-fog` `23-view-things` `24-view-overlays` (the layers: orders, tracers, light, cracks, events) `25-view-weather`
- Touch and cards: `26-input` `27-cards-core` `28-army-strip` (`armyStatus`, the Army list) `29-card-pages` `30-cards` (the `CARDS` table) `31-guide` `32-frame` (ticker, `alertNow`, `advise`, pick bar) `33-verbs` (the buttons)
- The rest: `34-save` `35-sound` `36-economy` `37-events` `38-natives` `39-huddle` `40-emergency` `41-boot` (`window.__fk`, the test hook).
- `shell-head.html` CSS and the static markup.
- Tools: `tests/fmt.py` (Prettier, tabs, width 120) · `tests/lint.py` (ESLint) · `tests/bot.py [seed] [minutes]` (plays the first minutes from the ticker alone; a test tool) · `tests/soak.py`.
- Check: `python3 build.py && python3 wrap.py && python3 tests/gate.py` (from the repo root; add `--soak` for `tests/soak.py`: three seeds, 20 game minutes, Hard, every hazard on, fails on any error, NaN or negative stock; about 3 minutes; run it before a big release, the fingerprint only plays five minutes). **Publish only with `python3 publish.py "Build NN: what changed"`**: it builds, runs the whole gate, and only then copies to `index.html` and `preview/`, commits and pushes. It installs a pre-push hook that refuses any push whose `index.html` the gate has not passed (`tests/gate-passed.sha`), so a push by hand is refused. Commit trailers go in the `TRAILER` environment variable.
- **The play fingerprint** (`tests/baseline.json`): the gate plays a fixed scripted game on seed 7 and compares every side's counts at each minute. The game cannot play differently by accident. A deliberate rule or balance change is accepted with `python3 tests/gate.py --accept "why"`, which rewrites the baseline and logs the reason in CUTS.md. This is First Keep's equivalent of SoRen's locked physics block.
- Notes: `CUTS.md` (every cut, per build; Build 37 lists the rebuild), `GUIDE.md` (player guide, regenerated from the game at Build 42; regenerate with `F.guideMd()` after rule changes, it is written from the tables), `APP-PREP.md`.

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

## Build 44 (preview only; CUTS.md has each)
- **The huddle** (`39-huddle`): the sword fab swaps the job bar for the attack bar (`#huddle`, same six-column grid). Column 1 Ready over Aim (lamp line: red not set, green set); columns 2-5 Foot/Arch/Horse/Siege steppers while drafting, the four missions (Alpha to Delta) while viewing; column 6 Fire over Abort. One step at a time, `hudStage()` 0 to 5 (Ready, Armed, aiming, Lock, Locked, Set), each button red (next, blinking), blue (in hand) or green (done); taps on the map move the crosshair (`aimAt` in `tapAt`), a double tap locks. Fire goes through `order()` and takes a slot in `G.msn` (saved); the mission is a normal march order (`G.ords`) plus a promise (`due`), a status (go, act, done, lost) and odds.
- **ETA** counts the weather on screen (`sideSpd`, `paceOf`, `etaOf`), no leeway; later weather is bad luck. **Odds** reuse `unitPower`/`matchup` as r²/(1+r²), smoothed about 3 s. Below 40% the tile flashes red (clears at 50%) with one toast; above 75% it flashes green and `spare` lists who can leave while keeping 65%.
- **Reinforce** (`reinforcePlan`): idle reserve only, fastest first, only those who arrive before the mission's survival time (HP over enemy damage a second), enough to even the fight, shown as up to three waves. **Spare** drags (or tap "Spare N" then a tile): onto a mission, an empty slot (a new draft of just them) or Ready (home).
- **Emergency** (`40-emergency`, the shield button `#emgB`, the Army card and the red attack alert): Shelter, Battle stations, All hands on deck, Resume. One ranking: shelter buildings by current hit points, room breaks ties; each filled with the nearest units (shooters first for soldiers); the rest wait behind the Town Center (villagers) or hold a line toward the threat (soldiers). Soldiers garrison (`state 'garrison'`, add arrows, DEFENDING) and stay until a new order; Resume only restores villagers (`G.emg.snap`). Pressing one leaves the huddle and snaps the camera home.
- **Army controls**: All = everyone but guards, Rest = idle ones, nearest-N/half/quarter use idle only; Attack-with takes idle first, then nearest; its counts reset on every card; `sendto/qgo/qatk/qfoe` go through `order()`.
- **Balance**: animals hit soldiers at half and cost no nerve; nerve hit 0.8, side 1.5, rear 2, rout return 0.6.
- Files: `39-huddle`, `40-emergency` are new; `41-boot` is the old `39-boot`.

## Build 45 (preview only; CUTS.md has each)
- **Dials:** `FORM`/`COLUMN`/`TEMPER` in `06-rules-tuning`; `shapeOf`, `kiteOf`, `temperOf`, `dialOf`, `cycle` in `08-core`; verbs `shape` and `temper`; `dialBtns` in `28-army-strip` is the one home of the buttons (Army card and battalion page). Save v32.
- **People and economy:** one worker per building (`slotsOf` returns 1); caps 60 villagers, 120 soldiers, 180 people, battalion 40; 12 farms, mints, foundries and quarries at the last age; mint 1:1, foundry 2:1. `tests/econ.py [--live]` measures it (the live run feeds the villagers and gives the farms two mills; without mills the walk to the keep halves the yield).
- **Income:** `CARAVAN.keep`, `CARRIED`, `loadable`, `takeFrom` in `36-economy` (raw surplus on caravans); the `tribute` sound. Vassal tax and held trade routes were already a drip.
- **Tension:** `SET.tension` / `G.tension` (`winner`, `diplomacy`); `leagueTick` in `17-ai`, called every 10 s from the economy beat.
- Earthquakes and the Shield wall are cut.

## Queue (agreed in talk, not built; each needs Albert's go; Oct 29)
- **Build 48, fixes:** stuck villagers (open trees only via sealed pockets: component size filter, standing spot from the unit's own region); danger check for gatherers (hostile unit within about 110 of a node, in both the node pick and the recheck); snap formation slots to free ground; armies march to one shared anchor and fan out only in the last 90 units, so one path search serves all (the path cache is keyed by target cell, and formation offsets spread soldiers over several cells, so they miss it and wait on the budget of 4 searches per tick; confirmed in `route()` and `solTick`); villagers drop a target when `u.noPath` is set (nothing in `vilTick` reads it today; confirmed); `standOff` picks a spot in the unit's own nav region; danger also counts wolves, boars, enemy archers, enemy towers and fire, with a 45 s memory of where a villager was scared; reset `EVM` on new game and load; huddle default shares BNSIZE across classes; Natives and rebels get an army class; War Council plans any unlocked unit type; levy cap counts levied soldiers; graduates keep their battalion; Battle Stations restores tempers on Resume; War Council pauses the game.
- **Build 49, maps:** each corner gets the same resource package placed independently, plus a fairness check at generation (resources in reach, walk to the Throne and nearest neighbour within about 10%); build the check before the generator.
- **Build 50, rivers:** a river is a chain of overlapping lakes with fords where the chain breaks. Hills later.
- **Build 51, sight and towers:** building sight from height (tall sees far) plus tech lines (beacons, spyglass); tower evolutions in place (watchtower, stone tower, bastion) from one tiers table; fog memory of what towers saw.
- **Build 52, looks:** every building varies by age tier (three variants: palette plus one or two features from a central table); animation pass for units (walk cycle, swing, death) and smoke and flags for buildings.
- **Decide before Build 49 (from the second Google audit, Oct 29):** two grouping systems share near-identical names: War Council battalions (`BN`: Alpha to Zeta, `u.bn`) and Huddle missions (`MSN`: Alpha to Delta, `G.msn`). Confirmed in code. One system with one set of names is the fix; needs a mockup first because it removes the dock. Same pass: fewer taps to launch a Huddle mission (pick, point, fire), and the computers use the same `order()` as the player.
- **Also queued, new from that audit:** one threat map (a coarse grid refilled each second from hostile units, wolves, towers, fire) read by node choice, pathing and the computers' war choice, as the one home for danger; flow field per army order instead of path searches per soldier (only if the anchor march is not enough; measure first); piles of stock drawn outside camps, mills and mines; a net-flow colour on each resource tile (also in the list below); one Trade and Empire ledger behind the Gold tile; unit selection sounds by class (clink, twang, hoof, creak); end-of-match chronicle of the player's own dates; a Stone Age scout on foot that mounts at horses (the horses tech dates them to the Bronze Age); Immortals and Legionaries sit in the Bronze Age because they copy the sword (move or note it, with the history batch); a "why it happened" line on weather and events; ground aprons under buildings and forests; scale figures up from 0.55 to about 0.66 only after a phone mockup (they may crowd).
- **From Google's wrap-up (Oct 29), accepted into the queue:** (a) a balance harness before any balance change: computers play both sides headless for about 200 seeds and log win rate by civ, minutes to each age, damage per resource by unit, stuck seconds, trade return; it is a tool in `tests/`, not a game change, and it settles the tech, economy and defender questions with numbers; (b) Build 48 also gets unequal push in `pushApart` (today a flat half and half, confirmed): working units barely move, marching units move idle ones, idle units yield; test that idle soldiers are not shoved into trees; (c) local-only tap counters per button (used, and tapped while disabled) shown in a debug card, nothing sent anywhere; (d) a UI budget rule for the guide: a fixed number of always-visible tap targets, and a new control must replace one; (e) measure save size and frame cost for the iPhone web view (the save is one `localStorage` write; the audit's 5 MB and thermal limits are plausible but unmeasured); (f) a checklist for Albert's stranger test on a real phone, run before Build 48 if he can.
- **From Google's wrap-up, held for talk (not queued as work):** cutting the in-base economy to 40 to 50 percent so armies must leave home (conflicts with Albert's Oct 28 direction that the player who hunkers must not stall; Build 45 did the opposite on purpose; measure with the harness first); melee target stickiness (re-check every 4 ticks is confirmed, swapping is not; measure the swap rate before changing); cutting two thirds of the small techs (matches the open tech-choices decision; conflicts with the history-first rule only if the text goes too; keep the text, merge the steps).
- **Market notes (Google, Oct 29):** two models: free download with one unlock (about 4.99 to 7.99) or paid upfront. Albert's own stance is pay to help, never pay to win, so any age gate has to leave the free game fully beatable. Decide later; nothing to build.
- **Also queued:** history text batch (about 25 fixes, "Game:" labels, date-against-age test); reveal controls by age; resource health colours; banners with a group health arc; 15-minute mode; scenarios; safe code merges. Full detail: the audit doc.

## Open items
1. Albert's real-phone test of Build 41j (tap sizes, the action bar, three-tap dispatch, People tile, 375 px).
2. Sound on the iPhone silent switch: undecided.
3. Gunpowder balance is a first guess.
4. Build 42 fixed the computers' food (they buy food with surplus when saving for an age, and shift villagers to food). Watch 36-minute games on seeds 1 and 3 for the ages they reach.
5. Idea backlog (ask first): replays, biomes, interpolation, optional Auto jobs, "Add another conquest" step-up, slower first raid; the parked list at the end of CUTS.md.
6. Item 18 (batch stroke calls in unit drawing) waits for Albert's phone test.
7. The setup card's Why fold is inside a comment (old, harmless): decide to cut or restore.
