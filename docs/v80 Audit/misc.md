# First Keep v70: audit of 35-sound, 37-events, 39-huddle, 40-emergency, 41-boot, shell-head.html, shell-tail.html

Every line of the seven files was read. src/ is identical to the built copy in scratchpad/fk, and that copy was used for runtime checks (playwright, `ag-misc/rt.py`). Severity: S1 crash, determinism or iPhone-breaking; S2 wrong behaviour; S3 rule or bloat; S4 minor. VERIFIED means proved by a run or an exact read of every caller. SUSPECTED means found by reading but not proved.

## S1
None found. Determinism holds in 37, 39 and 40. They contain no `Math.random`. 37 seeds `crackAt` from `G.tick` and draws everything else through `rng`. 39 calls `performance.now()` three times (39:53, 164, 379/381), but only for `G.hud.aimT` and `G.hud.firedT`, which only the reticle reads. `G.hud` is never saved and never read by the simulation, so no game state depends on it. That breaks the letter of RULES §6 (no clock in a simulation file) without breaking determinism. Fix: move `hudPage`/`hudFire`'s timestamps and `drawReticle` into the view, or keep them in a view-side variable. The simulation calls `sfx`, `thunder` and `feel`, which read the camera and the clock but write no game state. Nothing in the sound code can throw on iPhone. Every node it creates is behind `AC`, and every `resume()` failure is caught.

## S2: wrong behaviour

1. **Events dropped on load leave their effects behind for good** (VERIFIED, run). `34-save.js:443-446` drops any event that has no `tick` and no `KNOBS` entry, but it never runs that event's `end()`.
   - Quicksand: after a load, `G.sand` stays set at 200 s, although `until` was 120 s. `paceOf` (09-nav:598) and `hazardAt` (39:114) never check `until`, so you get an invisible patch that slows units and turns the crosshair red, permanently.
   - Mercenaries: 240 s after a load the find is still `done:false` with 6 vagabonds for hire. `FINDS.mercs.gone: 180` (05-rules-wild:56) is read nowhere, and neither is `e.f.until` (37:358).
   - Troll: still alive 150 s after a load, though its event lasts 90 s.
   - Mirage: the "it was a mirage" line is never said.
   - Falling star: it never lands, so no find and no boom.
   - The comment at 34-save:446 says "An eclipse, a fog or a heat wave goes on", but fog is dropped (run: `ev.cur` is null after a load during fog). The comment contradicts the code.
   - `G.ev.next` is left in the past (run: `null`/stale), so the next event is warned straight away and the `EV_MIN` gap is skipped.

   Fix: on a drop, call `EV[e.kind].end?.(e)` after `e.units` is rebuilt, or keep every event and save what `end` needs. Then reset `next` the way `endEvent` does.

2. **Easy multiplies the score for hazards it switches off** (VERIFIED, run). `hz()` (37:13) returns false on Easy, but `levelMul()` (37:15) counts `G.hz` anyway. Run: Easy with hard+horde gives `hz('horde')=false` and `levelMul()=1.6`. With nothing ticked, the lot draws hazards on Easy too, so the multiplier is free and random. That score goes into the `best` score in 16-sim-fight:336, which is not split by difficulty (`keyOf('best')`). Fix: `levelOf` returns 0 when `G.diff==='easy'`, or `levelMul` reads `hz(k)`.

3. **Emergency and Home pull soldiers out of the School, and the tuition is lost** (VERIFIED, run). `troops()` (40:22) and `sendable()` (28-army-quick:62) do not exclude `state==='school'`. Run: a soldier at the School goes to `goto` after Town square, and to `home` after Home. The paid tuition is gone and `schoolT` is left set. Fix: exclude `'school'` in `sendable`, and build `troops` on `sendable`.

4. **"An alert always has one voice" is false** (VERIFIED, by count). The voice cap (35:370-378) compares against the current count; it reserves nothing. One `hooves` starts 16 voices, and the ambience gate lets it start at 9, so the count reaches 25. A `horn` (an alert: "the horde arrives") is then refused until they end. `coin` (an alert, 0.1 s rate) starts 7 voices of ringing metal that last up to 1.2 s. Voice counts per sound were measured with stubbed `tone`/`hiss`: hooves 16, coin 7, done 6, pickHoof 6, win 5, jingle 5. Fix: let alerts skip the cap, or check `voices + cost(name)`.

5. **A fault blocks saving for the rest of the session, new games included** (VERIFIED, run). `seenErr` (41:9) is never cleared. After two errors, the fault card's "Carry on" (or a new game from Setup) never saves again, with no message. Run: `savedAfterFault:false` on a fresh game. Fix: clear `seenErr` in `newGame`, or say so on Setup.

6. **All hands never shows that it is on** (VERIFIED, run). 40:201 passes `'warn'` every time and never `on('hands')`. Run: with All hands active the button's class is `warn`. So it breathes red all the time, active or not. This contradicts 40:172 and 178 ("the order on wears its ring") and RULES' "danger breathes" (here a resting button breathes). Fix: `on('hands') || 'warn'` without the breath, or a ring only when on.

7. **`threatDir` crashes before the first step** (VERIFIED, run; SUSPECTED as reachable in play). `nearest(G.threats, …)` (40:37) gets `undefined` until `step` sets `G.threats`. Run: All hands right after `newGame` throws "list is not iterable". 09-nav:287 guards the same read (`G.threats || []`); 40 does not. Fix: set `threats: []` in `blankGame`.

8. **Troll start crashes with no living side that has a keep** (SUSPECTED). At 37:406-408, `q` empty gives `p.id`, a TypeError. Fix: `if (!p) return;`.

## S3: rules and bloat

1. **Dead branch in `hudFire`** (VERIFIED). 39:141 `if (sqOut(slot)) hudAbort(slot, true)` cannot run. The only caller is `hudGo` (33-verbs:462), which passes only squads that are not out, or `null`, which picks a free slot. Cut: 1 line.
2. **`mmss` is a copy of `clock`** (VERIFIED). 39:38 is character for character `clock` (08-core:29). Point the 8 uses at `clock`. Saves 1 line and one name.
3. **Leaving a building is written four times** (VERIFIED): 40:66-74 `release`, 13-sim-civil:72-78, 14-sim-troops:146-154, 11-orders:866-873 (and 13-sim-civil:11-16). Each places the unit at `b.x + u.ox*0.8, b.y + 30` or at the door. One `outOf(u)` would save about 20 lines.
4. **Taking a soldier off its order is written three times**: `stand` (40:24-34), the `soldiersIn` loop (40:104-108, which `stand` and `garrison` both make redundant), and `sendHome` (11-orders:1068-1076). Cutting the 40:104-108 loop saves 5 lines.
5. **Rows of `canEv` repeat the table** (VERIFIED). 37:47-48 hard-code that quicksand and flood need rain. Put `need:'rain'` on their EVENTS rows. Saves 2 lines.
6. **A hand list in `startEvent`** (37:472): `kind !== 'meteor' && kind !== 'mirage'`. Use a table flag, or put the text where those two already say their own news.
7. **Dead CSS** (VERIFIED: selectors pulled out and searched for in all JS and markup; script in `ag-misc/cssdead.txt`):
   - `.fm>.s1` (no `s1` anywhere)
   - `.fm>.r2` (only a comment at 27-cards-core:101)
   - `.qs.hdr>*` (no `hdr`)

   The reverse also exists: the JS sets class names that no CSS reads:
   - `mapOn` (32-frame:212; plus dead `SET.mapSeen`, see 10)
   - `yes` (32-frame:674)

   Cut: 3 rules, 1 toggle.
8. **Inline style repeats the sheet** (VERIFIED). 39:505 `<table style="width:100%;border-collapse:collapse">`, while `.cin table` (shell-head:141) already sets both.
9. **Colours missing from COLORS.md** (VERIFIED). The age edge colours `.cin .a0` to `.a4` (shell-head:156: #9a9890, #b5793a, #c9c2a6, #4d6b9e, #8e2f2a) are not tokens and not on the colour page. That breaks RULES §6 "nothing is coloured that is not on those two pages". `#stage{background:#20301c}` (78) is arguably map paint (EXCEPTIONS #11).
10. **Boot patches a default, and its comments contradict** (VERIFIED). 41:88-92 writes `SET.mapSeen = true`, which nothing reads (08-core:152 is its only other use), and `SET.mini = false` over a default of `undefined` (08-core:151). The two comments on line 92 disagree: "starts closed" vs "the first look shows the map". Fix: set `mini:false` in 08 and cut the block (5 lines).
11. **The `typeof spdPop === 'function'` guard is dead** (32-frame:207). Function declarations are hoisted in the one scope. Separately, `spdPop` and `clip` (41:100-143) are UI and verb code living in the boot file. Move them to 32/33.
12. **Most of the test hook is unused** (VERIFIED). `window.__fk` exports 289 names. About 200 of them appear in no file under tests/ (list in this session; e.g. `suggestAt`, `whoIs`, `teach*`, `sunVec`, `natRegard`, `EVM`, `SFX`, `SND`). gate.py:243 calls `F.closeCard && F.closeCard()`, but `closeCard` is not exported, so that cleanup silently does nothing. Fix: export what the tests use (plus `closeCard`), and cut about 200 lines.
13. **`SND` is a getter and setter layer that only renames `SET.sound`/`SET.vol`** (35:4-17). Fourteen lines exist to give one value a second home. Read `SET` directly.
14. **`HAPTIC.thunder` is dead.** `thunder()` (35:435) does not go through `sfx`, so the strike's 'crack' is never felt. `thunder` also skips the voice cap and the rate gate.
15. **Player-facing words outside 07-text** (RULES §6 "every word in 07"): `EMERGENCY` and its fold text (40:8-12, 182), `INTENT` (39:446-450), and about 16 `say`/`news` strings in 37, 39 and 40.
16. **Second font on the canvas.** `drawReticle` (39:437) uses `system-ui, sans-serif` instead of `fontF()`.
17. **`m.late` is written and never read** (39:224).

## S4: minor
- `thunder` computes `hearing(d/4)` with floor×4 (35:438), but the comment says "quieter by the same law as every sound".
- Crickets play at random spots on screen, water included (35:430), but the comment says "from the open ground".
- `hearing` ignores `TILT`, but `onScreen` uses it.
- The wildfire cap `slice(0, E.most)` (37:263) silently puts out trees that are half-burned.
- If no tree is far from the keeps, Wildfire is still announced (37:230-234) and ends at once.
- The dragon crosses about 2,700 at speed 90, which takes about 30 s, but the event lasts 25 s (06:267), so it is removed mid-map.
- `hudReinforce` makes two toasts ("N marching", then "N reinforce"), and `hudJoin` creates an order only to delete it (39:278-282).
- `hudAbortAll` from an Emergency toasts once per mission.
- `fault` tells errors apart by full stack, so one bug reached by two paths opens the fault card.
- Town square on a shop worker: `release` runs before `stopVil` and clears `inside` with no door position, so the worker walks out of the building's middle (40:139-141).
- The Stop button says "everyone back to work", but soldiers stay.
- In the style sheet, font weights 600 and 500/400 ask for faces that are not embedded (only 500/700 are built).
- `button` repeats the inherited `-webkit-tap-highlight-color`.
- The 18 px icon size is written four times and the one-slot width twice (#hudB, #qa).
- `<meta name="claude:viewport-fit-sides">` ships in the game for no stated reason.
- `drawFlash` (meteor, ages) is not counted by the lightning `flashOK` limiter (SUSPECTED: can stack with a bolt inside 0.34 s).

## Checked and clean
- The physics in 37 matches its comments: the climate chain, the `??` order of precedence, Stefan's law, degree-day melt, `rutHeal` running every 10 s, Rothermel's damping coefficients, and the horde warnings two seasons and then one season ahead.
- Every `SFX` name is used.
- The amplitude law in `hearing` is correct.
- `emgSnap`/`emgStop` restore work and tempers.
- `roomIn` counts soldiers on their way in.
- The idle throttle and the catch-up cap in `frame`.
- Reduce Motion: the CSS kills the animations and gives `.warn` a still fallback, and the reticle freezes under `still()`.

## Not checked
- Runtime gate, soak, balance and probe (not run, as instructed).
- iPhone hardware audio and haptics.
- Actual Safari support of `round()`, `color-mix` and `mask … exclude`.
- `G.bolts` written from the view (25-view-weather, not assigned).
