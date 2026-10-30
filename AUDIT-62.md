# First Keep: the audit (Build 62, Oct 30, 2026)

One reader, one method: by element, not by interaction (Albert's way). Each section is an inventory made by a script, then what the table shows, then the fix or the reason it stays. Nothing here was built without its own list; the measurements are from this machine (headless Chromium, software drawing) unless the phone is named. Albert's own questions, and the ones he has not asked yet, are at the end.

## 1. Optimization (measured)

**Method.** Chromium's sampling profiler (CDP `Profiler`) over 60 frames of `draw()` on seed 2, Hard, fog on, 15 minutes in (241 units), at three zooms, each native canvas call charged to the game function that made it. Software rasterization: the shares are what matter, the milliseconds are not the phone's.

| Pass | Before (share of a frame) | After | What changed |
|---|---|---|---|
| Building and figure shadows (`shadowOf`, one translucent ellipse fill each) | 28% at z0.6, 53% at z2.2 | 0.5–1% | One path, one fill for every sun shadow (`sunShadows`): trees, buildings, people. Two shadows that overlap now darken once, as real ones do. |
| The research badge (`researchBadge`, vector each frame) | 10% at z0.6 | 0.1% | Drawn once per count and zoom into a cache (`BADGE`), stamped; the bob stays in the stamp. |
| The stores' piles by the camps (`pileAt`, up to 18 small shapes a building a frame) | 29% at z1.2 | 0.1% | One picture per kind, counts and zoom (`PSPR`), trimmed to 60. |
| Sprites stamped (`stamp`, `drawImage`) | 50–60% | 50–60% | The cost of a sprite game: the number of things on screen. Nothing to take without drawing less. |
| The ruts (`drawGround`, new) | — | 0.3–11% at z0.6 | At the smallest zoom every rut cell is an ellipse. Below: quantise to four depths, four paths. Not built: it is one line, and a measurement on the phone decides. |

**The draw budget** (`DRAW` in `18-figures`, `shed` in `41-boot`): one order now, with a way back. Level 1 drops the trees' shadows and the rain rings (the dearest cosmetic passes), level 2 the moving extras, level 3 half the pixels; ten seconds under 7 ms climbs one level back. Before, `lessMotion` (the person's accessibility setting) was set by the load shedder and never unset: a slow spell turned Reduce motion on for the rest of the session. Now `still()` reads the setting or the load, and the setting is never written.

**The file.** 1,121,655 bytes (Build 61) → 1,136,000 (Build 62): up 14 kB. The equations and their sources at the line cost more than the sweep took (the dock's CSS, the second traffic map, three linear lerps, the old outline colour). The source got simpler, not shorter. Where the bytes are: words 86 kB, the research table 61 kB, building art 70 kB, figures 45 kB, the four fonts 120 kB (already subset to 226 and 103 glyphs: nothing to take there without woff2, which needs brotli, not on this machine today). Measured: comments and indentation are 197 kB of the 977 kB of source, 20%; a safe minifier that keeps names (terser, no mangle) would take about 35% of the shipped file. Parked: no registry access this session, and a build step that ships something other than the source is a decision for Albert (stack traces in `fault()` would point at columns, not lines).

**The simulation.** `step()` is under 1% of a frame at every zoom (the sampling finds `step`, `fogTick`, `dangerMap`, `nearU` at 0.1–0.2% each). The game is draw-bound. The computers' `think` does not show at all.

## 2. Logic

| Found | Where | Verdict |
|---|---|---|
| Three words for "idle": `!u.job`, `u.idle`, `!u.node && !u.hunt` | 12 call sites | Two real things with one word. **Fixed:** `freeVil(u)` (no job, not inside: can be given one) for the tile's count, Send idle, Idle to me and the computers; `u.idle` (standing with nothing this tick) for the mark over the head. The sheltering villager was counted as idle on the tile before. |
| Five hand-written relaxations (wetness, market stock, loyalty, nerve, wounds) | 5 files | **Fixed:** one `relax(x, level, tau, dt)` in `08-core`. The flocks' logistic likewise (`logistic`). |
| The load shedder wrote the accessibility flag | `41-boot` | **Fixed** (above). |
| Two traffic maps: the view's `TRODE` (paint) and nothing in the sim | `20-view-base` | **Fixed:** one `ruts` map in the sim, read by the picture; the simulation no longer calls a drawing function (`tread(u)` from `moveTo`). |
| The flank rule read one figure's facing | `16-sim-fight` | **Fixed** (Albert, mid-build): the line's facing, only when the man cannot turn, never through a comrade. |
| Unrest is an integrator (push − loyalty/25 a step), not a lag toward a level | `36-economy` | **Stays, flagged.** It was listed as a lag; on reading it is not one, and inventing a target would fake it. The form is honest: a stock of grievance that loyalty drains. |
| `BUILDER_POW` 0.7 was already the crew law | `06-rules-tuning` | **Cited** (Thomas & Smith 1990), tested; no change. |
| The computers hunt on their own; you do not | `12-sim-core` | Stays (they have no finger); said in the Guide. |
| Sight is blocked by woods, not buildings | `22-view-fog` | Stays; a building-sized occluder is the next step if it matters in play. |
| Ice is one thickness for all water (one air temperature) | `37-events` | Stays: honest for one climate; a crossing is parked with its own list. |
| The harness's "blocked" count rose in Build 61 (107 → 222 median) while a probed seed fell | `tests/balance.py` | Open (to-do 11). The Build 62 harness is below. |
| Bare numbers in the simulation: 60 (×50), 20 (×44), 40 (×39), 30 (×33), 300 (×22) | `11`–`17`, `36`, `37`, `39` | Most are seconds and reaches. A pass to name the ones that mean something (a minute, a sight, a reach) is cheap and worth a list; not done unasked. |

**Longest functions:** `texture` 1,805 lines (it is the whole ART table after it, a regex artefact), `pickEvent` 384, `drawFind` 340, `think` 272, `vilTick` 267, `person` 263, `solTick` 262. `vilTick` and `solTick` are the two that would pay for a split by state (walk, work, flee, fight); `think` by decision. Each is a list item, not a tidy.

## 3. Patterns (the rule says threes, one mold, one standard)

- **Verbs:** 174 in `33-verbs`; every button has one; `tapCount` keeps every tap. One mold holds.
- **Cards:** 20 kinds in `30-cards`, all through `CARDS`; the title row is one component (book, close, pinned).
- **Toasts:** `say` kinds: plain 100, warn 47, good 41, soft 7, and two strays (`soldier` ×1, `news` ×1). The two strays should be one of the four, or the four should be five on purpose. One line each.
- **Research effects:** 63 `fx` kinds across 225 steps, all read through `fxv`; no step is wired by hand.
- **Icons:** 31 in `ICON`, one table. The emoji in the top pill (🌱, ❄, 🌙) are the one place the game uses the phone's own glyphs: by design (Albert likes them); they render differently on Android.
- **Threes:** the three ends, three crowns, three pages of the jobs row, three text sizes in the rule — and seven in the CSS (next section).

## 4. The group audit (what we use a lot, what should be one thing)

Made by a script over `shell-head.html` (34 kB of CSS): each value by how often it is used.

| Element | Distinct values | Uses | What the table says | Proposed common denominator |
|---|---|---|---|---|
| Font sizes | 7 (13px ×24, 12px ×18, 15px ×8, 20px ×5, 16px ×5, 19px ×3, 14px ×3) | 66 | The rule says three sizes (12, 15, 19). The most used size, 13px, is not one of them; 14, 16 and 20 are strays. | Three tokens `--t1 12px --t2 15px --t3 19px`; 13 → 12 or 15 by place (card captions 12, body 15); 20 → 19; 16 → 15; 14 → 15. One list, 24 lines. |
| Colours | 95 hex + 32 rgba; 24 tokens defined, 163 token uses | 245 | Four colours carry the game (`#f2d27a` gold, `#2a1c10` ink, `#4fb06a` green, `#ffb23d` amber) and are written by hand 9, 9, 7, 6 times beside their tokens. 70 colours are used once. | Every colour used twice or more becomes a token; the once-used ones are reviewed by eye (most are the red/green/blue of the War room lamps and the age tints, which can be three tokens each). Target: 24 tokens → about 30, hand-written hex → 0. |
| Radii | 15 (`--r` ×7, 10px ×6, 6px ×4, 8px ×3, 22px ×2 …) | 34 | One token exists and is used a fifth of the time. | Three radii: `--r` (cards and tiles), a small one (chips, 6px), a pill (22px). |
| Heights | 44px ×30, then 16/18/26/20 | 62 | The tap rule (44) is one standard and holds. The small ones are icon boxes and lamp lines. | Keep 44; name the icon box (26) and the lamp (3) once. |
| Gaps | 10 (4px ×22, 3px ×7, 6px ×6, 8px ×3) | 45 | Four is the gap. | `--gap 4px`; 3 and 6 fold into it unless a screenshot says otherwise. |
| Paddings | 27 | 43 | The most spread value in the file. | `--pad` exists (×5); make it the rule: 0, `--pad`, or `0 --pad`. |
| Letter-spacing | 7 (.04 to .16em) | 10 | Uppercase labels use five different trackings. | One: `.08em` for every uppercase label. |
| Weights | 700 ×33, 500 ×5, 400 ×2 | 40 | Three weights, used as three. Holds. | — |
| Box shadows | 18 (none ×13, one real one ×7) | 38 | One shadow is the shadow. | `--shadow`; the War room's glow is its own token. |

Icon sizes: the top pill's glyphs are 20px, the chip 26px, the close 26px (Build 61), the strip's thumbs 28px — three sizes in practice (20, 26, 28); 28 → 26 makes it two. The three places a number is drawn (the tile's count, the pill's count, a card's count) use `wd()` from one mold.

**Not done here.** These merges change what the screen looks like in 150 places; the gate measures contrast, tap size and fit, not sameness. The list above is the list; each row is a yes or a no.

## 5. UI (the sheet, 375 × 667 and 390 × 844, twelve screens)

Looked at as one picture (`mockups/ui-62-375.png`, `mockups/ui-62-390.png`; the gate keeps the numbers).
- One standard holds across the cards: title row, book, close, the same two-column button mold, the gold "on" state.
- The Market card scrolls at 375 × 667 (the SE): known, accepted (the rule says 390 × 844 up).
- The War room's "Tap the map to aim" sits on top of whatever is under the crosshair at a small zoom; it should sit in the chip's row, not on the map. One line.
- The Help card still said "Send ¼ or All" and "the War Council opens battalions": stale since Build 61. **Fixed** in this build (three strings).
- The people tile reads "3/3" in green and the build tile brown (Build 61): the only two tinted tiles; the chip at the left tints by page. Three tints, three meanings. Holds.
- The end screen drew the march ring's "156s" through it (Albert's screenshot, Oct 30). **Fixed**: the rings are not drawn once the game is over.

## 6. UX (the player's hands)

- **The first ten minutes** are quiet by design (Build 60), and the first thing a new player sees is a paused game with "Paused · ▶ to carry on". The pause is right (a card is open); the first card should be the one that says what to do first. The Help card does; it is not the first card. A list item: the first card after Setup is Help, once, and the Guide's first entry is "Your first minute".
- **The three pages of the jobs row** are reached by one chip; the chip's word is the page you are on, and the arrow says there is another. A new player will not know there are three until they tap it. The first time the row has a soldier, the chip could pulse once. One line, listed.
- **Replant by tap** and **keep placing** both act on a tap with nothing picked; a player who taps a spent farm to look at it replants it. That is what Albert asked for; it is also the one place a tap spends money without a card. Said here so it is a choice, not an accident.
- **Every number has a why** (the Guide, `WHY`, the why-lines): this is the game's real differentiator in the genre, and nothing on the play screen points at it. The book icon on a card is the way in; the top pill's book count is the hint. Enough, or not: Albert's call.
- **Sound:** every sound now falls off by one law (ISO 9613-2) and thunder by the same; the iPhone silent switch is still the open question (to-do 6).

## 7. Game theory: where it would pay first (Albert, Oct 30: "align with what the world already solved")

Not built; a list for the double yes. The game already uses the forager's rate (Charnov) and the attack-value rule (Churchill) for individuals, and Lanchester for a fight. The computers' *decisions* between sides are where the established results are not yet used:
1. **War or peace between two sides** is a repeated Prisoner's Dilemma with a shadow of the future (Axelrod 1984): the computers should play tit-for-tat with forgiveness — cooperate (truce, trade) until struck, strike back once, forgive — and the player's record against each side is the state. Today each computer's personality (`PERS`) sets a fixed nerve; a memory of who struck whom would make the diplomacy readable and fair.
2. **Tribute and the price of peace** (`PEACE.truce`, 120 × (1 + 2 × their odds)): the Nash bargaining solution gives the split between two sides that each would accept over fighting, from the odds (Lanchester) and what each stands to lose (its buildings' worth). One formula replaces a design constant, and the price would move with what is at stake.
3. **The market with four sides** is a Cournot game: each side's selling lowers the price for all. The isoelastic curve is in; the sides selling into it blindly is the missing half. The computers would hold goods when the price is low, which is what merchants do.
4. **The board truce** (everyone at peace, the Games): a public-goods game; each side gains from the truce and gains more by breaking it last. The established remedy is the one the game already has in words (the sworn peace, a cost to the breaker); the cost should be the one that makes the truce a Nash equilibrium — the breaker's loss ≥ its gain from striking first — and the game can compute that from the odds.
5. **Where to put a tower** is a facility-location problem; the computers place by a hand score. The p-median on the nav grid is small enough to solve exactly at their pace (one decision every few seconds).

Order of pay: 1, 2, 4 (they are the peace path, which Albert made a real path), then 3, then 5.

## 8. What the game should have, and the questions to ask (if I were you)

**Things the genre's best have that First Keep does not, said plainly:**
- A **first-session path**: one scripted ten minutes that teaches the finger, the jobs, the first house, the first soldier, the chip. Not a tutorial card: a scenario (the game has scenarios; it has no first one).
- **An end-of-game screen worth the game** (to-do 2): charts, the chronicle, the comparison with your past games. Today the Victory screen is three numbers and three buttons. For a player who just gave an hour, this is the memory.
- **Saved games as a list** (more than one), and a replay of the best moment. The save is one slot.
- **A pause that explains**: tap a soldier while paused and see what it will do next and why (the why-lines exist; they are on cards, not on the thing).
- **Sound as an identity**: three or four signature sounds a player would know with eyes closed (the bell, the horn, the Town Center's done-thock). The materials are real now; the signature is not chosen.
- **A difficulty that is a style, not a multiplier**: Easy/Normal/Hard scale `DIFF`; the genre's best make Hard a smarter computer, not a richer one. The game theory list above is how.

**Questions I would ask myself about this game:**
1. Who is it for: the player who wants an hour, or the one who wants ten minutes on a train? The game is built for the hour (three paths, 225 steps); the phone is held for ten minutes. The 15-minute mode exists; is it the front door?
2. What is the one sentence a player tells a friend? "A real-world strategy game where every number has a why" is mine. If that is the sentence, the why has to be one tap from everything, not three.
3. What does the player do with their thumbs in minute two, when nothing is happening? The quiet is by design; the hands still need something. Scouting, the finds, the first house: is the order on screen?
4. What is the game's "one more turn"? Real-time games earn it with a clock a player can see (the age bell, the next season, the next harvest). The clock is in the pill; is it the thing the eye returns to?
5. What is the plan for the save when the game changes shape? Every build migrates (v37 now); at some point the rule becomes "a new build starts a new game", and that should be said before it is forced.
6. How will you know the balance is right without you playing forty games? The harness plays computers; the fingerprint keeps the sim honest; neither plays like a human. One recorded human game a build (yours), kept as a file, is the measurement that is missing.
7. What is the frame rate on your phone? Every number here is headless. One reading from your hands, zoomed in at a busy town, is worth all of them.
8. What should the game never do? (Pay to win is already answered.) Ask the same of notifications, of the silent switch, of battery.
9. Is Albert Labs one game or a method? SoRen and First Keep share the sky, the fire, the rain, the sounds by material, the fonts. The shared things are already a library in all but name.
10. When is it done? Not the to-do list: the sentence that says "a player can play the three paths to their ends, on a phone, and every number has its why, and the computers are fair." Measured, it is close on the first and third, and not yet on the second (the phone) or the fourth (the computers' decisions).

## 9. The harness and the soak for this build

See `CUTS.md`, Build 62: the twelve-seed harness before and after, the soak, the gate.
