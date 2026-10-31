# View audit: src/20 to 25 (v70 Restoration)

Scope: every line of 20-view-base.js (215), 21-view-frame.js (338), 22-view-fog.js (170), 23-view-things.js (1232), 24-view-overlays.js (691), 25-view-weather.js (229). Read-only on the repo. Probes ran on my own copy (`scratchpad/ag-view/ag.html`, the built v70 with one line added before the closing `})();` that exposes internals as `window.__ag`). Scripts: `scratchpad/ag-check.js`, `ag-probe.py`, `ag-probe2.py`, `ag-probe3.py`, `ag-probe4.py`.

## S1: the view changes the simulation

### 1. drawFogLayer calls the simulation's fogTick, and the outcome changes. VERIFIED
- `24-view-overlays.js:484` `if (fogT < 0) fogTick();`. `fogTick` (`22-view-fog.js:115`) writes `G.fog`, `G.seenB` and calls `wearGround`. The simulation reads that fog: `known0` in `bestNode` (`12-sim-core.js:665`, your villagers work only nodes they have found) and in `12-sim-core.js:629`, and `seen0` in `11-orders.js:1084,1100`.
- `fogT` starts at -1 (`22:77`). Only `fogTick` sets it, and nothing resets it on a new game or a load. The view therefore calls fogTick exactly once in a page's life: on the first frame drawn, at tick 0, before the simulation's first call (tick 10, `12-sim-core.js:51`). After the boot game, the probe reads `fogT === 0`, which proves the view made that call. The simulation never calls fogTick at tick 0.
- Proof (`ag-probe4.py`): seed 7, fog on, Normal, 6 minutes stepped, run twice each way. Without the view call: minute 6 is `734,292,393,346,550|u191`. With one `draw()` before the first step: `734,197,424,355,550|u187`. The runs diverge from minute 1 and repeat exactly. So the first game in every page session (the boot game, a loaded save, or today's challenge if it is the first game) plays differently from the same seed started later. The gate's fingerprint starts `newGame(3)` after the boot game, so it can never catch this.
- Fix: the simulation lights the fog itself in `newGame` and after a load. Delete `fogT` and the view call.

### 2. Other view writes to G (no outcome change found, but each breaks the rule)
- `25-view-weather.js:75` and `:83`: the view creates and filters `G.bolts` and pushes bolts seeded by `Math.random`. It also sets `b.lit` on bolts the simulation made (`36-economy.js:394`). Nothing in the simulation reads `G.bolts`, and it is not saved. VERIFIED. Fix: keep the bolts in a view array (`BOLTS`), which the strike in 36 pushes to the same way `SPARKS` works.
- `24:249,261` (`pl.why`) and `24:156-158` (`pl.seal`, `sealT`, `sealN`): the ghost draw computes the `canPlace` verdict that gates the Place button (`32-frame.js:646-653`). That is UI state, not simulation, but it means the verdict has two homes. VERIFIED.
- `23:445-460` `celebrate`: called from the simulation (12, 16, 39). It lives in a view file and writes `G.celT`, `G.whiteT` and `u.glowT`. It is deterministic, so this is S4 placement only.
- `stats()` and `fxv()` called from the view fill memo caches (`p.uc`, `c.memo`). The memo values are pure. Observed, not a finding.

## S2: wrong behaviour

### 3. Fog leaks (you know only what you see). VERIFIED by code
- `21:316,322`: `sparkDraw` and `drawTracers` run after `drawFogLayer` (`21:315`) and check no visibility. `SPARKS` are pushed for every hit on the map (`16-sim-fight.js:114`) and tracers for every shot (`14-sim-troops.js:118`). Arrows and hit sparks therefore show at full strength over black, unexplored fog. Fix: draw them before the fog, or filter them with `fogAt === 2`.
- `21:275` buildings: `knownB` admits a remembered building, which is then drawn live under the dim fog (fog alpha 110/255, so about 57% shows through). You can read its current HP bar (`23:142`), a site rising with `b.prog` (`23:53-83`), fire (`blaze`), and chimney smoke that shows it is training or researching (`23:135`, `b.q.length`). A building destroyed out of sight vanishes from memory. `drawLight` (`24:589-592`) runs after the fog and draws the blaze glow of a remembered building at under half HP over the fog. The window flicker (`24:583`) gives away the enemy's `chimney` tech. Fix: draw a remembered (not seen-now) building from a snapshot taken when last seen: kind, prog and hp bucket, with no smoke, fire or bar.
- `23:1208-1231` `drawPicks`: an enemy you picked stays ringed at its live position after it walks into fog. No `setPick` caller prunes on sight. It is drawn before the fog, so the ring shows at 57% in explored ground. Fix: skip the entries that fail `visibleTo0` and `knownB`.
- `20:36-82` scars: `scarFall` and `scarBurn` paint every death and every burned building on the map into `scarCv`, with no fog gate (unlike `wearGround`, which is gated through `seenB`). Fresh blood shows in explored ground you are not watching.
- `24:48` `drawCracks` runs after the fog with no fog check. `21:278` finds are pushed with no `known0` check (8% shows through unexplored fog, including the robbers' camp flame).

### 4. The rut paint is culled with the wrong maths. VERIFIED
`24:13-16` builds the rows as `cam.y ± h/2/z`, dropping both `TILT` and `vy`. The true rows are `toWorld(0,0)` to `toWorld(cw,ch)`. Probe (`ag-probe2.py`, 390×844, z 1): visible rows 26-49, drawn 31-49. About 130 px at the top of the screen never shows ruts or mud pooling (more at other zooms). Fix: use `toWorld`, as `drawRainRings` does.

### 5. The build grid is half a square off for odd footprints. VERIFIED
`24:264-265`: `g0x = Math.round(sp.x/NAVC) - B.fp/2 - 4`. `sp` comes from `snapPos` (`09-nav.js:66`). For fp 1, 3 and 5 (26 of 41 buildings), `sp.x/NAVC` is a half-integer, so the lines fall 5 units off the walking grid. The footprint box (drawn correctly from `sp.x - n/2`) sits across them, and the taken-square shading straddles two cells. `ag-check.js` shows fp 3: footprint at x 510..540, grid lines at 475, 485, … Fix: `g0x = Math.round(sp.x/NAVC - B.fp/2) - 4` (and the same for y).

### 6. The pile and badge caches remake a canvas on every zoom frame. VERIFIED
`23:361` keys on `z.toFixed(2)`. `20:87` keys on `s.toFixed(2)` with `s = max(0.9, z*0.6)`. Probe (`ag-probe3.py`): one lumber camp, 40 pinch frames, 40 new canvases (`lumber:6:0.80`, `0.82` …). Every one is created, drawn as vectors and then trimmed, which costs more than not caching at all, and that is exactly the cost the Build 62 comment says the cache removed. Neither key includes `dpr`, so after `DRAW.lvl` 3 sets `dpr = 1` (`32-frame.js:227`), a canvas cached at dpr 2 is reused at twice the size (probe: the same canvas object is reused across the dpr change). Fix: key on `quant(z*dpr)` plus dpr, and stamp as the sprites do.

### 7. drawSky reads the computed style every frame. VERIFIED
`25:166` calls `getComputedStyle($('stage')).getPropertyValue('--hb')`. Probe: 10 calls in 10 frames. That forces a style recalculation inside every frame on a phone. Fix: read it once in `fit()` (or keep it beside `vy` and `bandH`).

### 8. Torch shadows use last frame's standards. VERIFIED
`drawUnit` (`23:740`) reads `STANDARDS`, but `drawStandards` fills it after the unit pass (`21:314`). The positions are one frame stale in screen space and empty on the first frame. The light is placed at the pole's foot (`s.y`) while the flame is drawn 30z above it. `flameShadow` also runs at noon for every unit × standard and returns only after computing `hypot` (no early exit on `G.night`).

### 9. One error inside a piece can clip the whole game. SUSPECTED (needs a throw)
`21:305-311`: the catch resets the transform, alpha, composite and dash, but not the save stack. A throw after `ctx.save()`/`clip()` (`drawBld` site `23:64-67`, `drawFind` `873`, `drawFallen`, a flipped `stamp`) leaves that save open for good, and canvas state persists across frames. A leftover clip rectangle would then crop every later frame. Fix: `ctx.save()` before each piece and `ctx.restore()` in `finally`, or `ctx.reset()` at the top of `draw`.

### 10. Smaller wrong behaviour
- `25:68`: `now - sheetT > 2.5 + 6*Math.random()` draws a new threshold every frame. Simulated: median gap 2.87 s, p95 3.25 s, max 3.67 s, against the intended 2.5-8.5 s. VERIFIED. Fix: draw the next gap once, when a flash fires.
- `21:250-253`: the shake translate comes after the ground is drawn and is never undone. The ground stays still while the scars on it shake, and every overlay drawn after it shifts, including the radar marker, whose tap target (`RADAR.sx`) is computed unshaken.
- `24:323-324`: `m.imageSmoothingEnabled = false` is set on the minimap and never restored, so from the second draw on, the 1000 px forest layer is shrunk to 172 px with no smoothing.
- `20:238`: after `makeBg` builds a new `grassPat`, the `grassM` guard still holds the old values. If the camera did not move (a restart on the same seed), the new pattern is never scaled. VERIFIED by code, low impact.
- `24:152`: the seal refreshes on `G.t`, so while paused it refreshes only when the wall's cell count changes. SUSPECTED.
- `25:197-204`, `23:193`, `22:82`: the forest layer, `deepTrees` and `woodsGrid` all key on `G.treeV`, which `navRebuild` bumps every time (`09-nav.js:195`), whether or not a tree changed: every building, gate or spent node. The comment says "redrawn when trees fall". With the minimap on (polled every 150 ms), the 2,000-tree forest layer (4,000 arcs into a 1000² canvas) redraws about once a second all game. `deepTrees` builds about 20k template-string keys per rebuild. SUSPECTED as a periodic hitch.

## S3: bloat and rule breaks (estimated lines saved)
- `drawFind` (`23:867-1205`, 339 lines) draws static vector art every frame, with 7 new gradients per frame across ruins, den and shrine. Make it a sprite cached per kind, owner colour and scale, as nodes and buildings are, with only the flame and the capture ring live. Put the shapes in a table. About 220 lines saved. The shrine dome is drawn twice, the second time clipped (`1033` and `1034-1039`): the same pixels again, dead code, 6 lines.
- "One element for every flame" (`23:152-155`) is not true. The wildfire (`24:463-480`), the vagabonds' fire (`23:1184-1200`) and the shrine flame (`23:1042`) each draw their own flame and throw no `glow`. About 25 lines.
- Snow is drawn twice: `drawEvents` (`24:96-107`, snow and blizzard) and `drawWeather` (`25:55-66`, frost and blizzard), with the same `i*71.9`/`i*113.7` formula. A blizzard draws 320 flakes, and frost, which is ground frost, shows falling flakes. About 12 lines.
- `drawFogLayer` (`24:482-505`) copies `layer()` (`21:216-235`) with a different scale. Make it `layer(img, k)`. About 15 lines.
- The additive glow stamp is written three times (`23:89-95`, `772-780`, `781-787`). The flag cloth is written twice (`23:330-343` and `644-656`), with a third flag in `flagAt`. About 25 lines.
- A one-line comment is repeated at both the head and the tail of eight functions (`24:388/398`, `400/415`, `437/440`, `462/479`, `481/504`, `565/567`, `625/628`, `653/660`). About 10 lines.
- Hand-typed constants copy tables: the unit head heights (`23:788-789`: 32, 26, 22, 18, 13) shadow `LOOKBOX[h]`; the `(LOOKBOX[..] || [26])` fallback appears 5 times with two different defaults; `workOf` (`23:581-596`) is a 16-line ternary that should be a table; the radar's 520, 150 and 40 and its HUD dodges 84, 80 and 40 (`22:15-33`); the sky's fallback 86 (`25:166`).
- "Is it burning" has two homes: `blaze` (`23:425`) and `drawLight` (`24:592`).
- Simulation code sits in a view file: `fogTick`, `woodsGrid`, `openLine`, `fogAt`, `seen0`, `known0` and `knownB` (`22:70-142`) are read by 11 and 12. RULES §6 puts the simulation in 09-17. Move them to 15-sim-spatial.
- Text rules: `drawOrders` uses `'700 11px system-ui'` (`24:514`, not `fontF`, under 12 px); `idleMark` can go to 11 px (`24:133`); the badge numeral is `sans-serif` at about 10 px (`20:139`); `tag` is 13 px, not one of 12/15/19 (`24:141`).
- `makeBg` (192 lines) uses `Math.random`, so the ground (blots, flowers, grass) changes on every load of the same save. RULES §1 says "laid once from the seed: no reshuffle". Exception #8 covers "some drawing", but the ground is the map. Use a local PRNG seeded from `G.seed` (never the simulation's `rng`). It also has `R` shadowed by `THRONE.isle` (`21:107`).
- Per-frame allocations: `[y,t,e]` triples for everything on screen (`21:273-285`); `drawStandards` builds a Map and string keys over every unit, not culled (`23:604-616`); 240 rain-drop style strings (`25:47`); a `createRadialGradient` per light per frame (`23:311`); `fogLayer` rebuilds and puts 2,500 cells per frame, and again for the minimap, though the fog changes once every 10 ticks (`22:150-158`, key it on `fogT`); `drawGround` computes the rut bucket `**0.4` four times per cell (`24:24`).

## S4
- Misplaced or stale comments: the `22:1` header says "the minimap" (it is in 24); `22:67-68` holds `hg` (used only in 24) and an orphan comment about spies; the `24:149` comment sits over `drawSeal`, not `drawGhost`; `23:165-169` gives a shadow length of h·d/(H−h) while the code uses h·d/H (`23:262`), and in practice the length is always capped because h > H; "read by every unit and building" is false (flame shadows fall on units only); `23:354` says "once per … zoom".
- `trapShown` (`22:170`): `b.owner === 0 ||` is redundant with `friendly`. `bgK` is `let` but never reassigned. Only 3 of the 6 scar writers guard `scarX`. `drawUnit` shadows its own `s` in the `STANDARDS` loop. `ctx.lineCap='round'` (`25:35`) and `lineJoin` (`24:57`) are left set.
- UI overlays (orders, rally flag, picks) are drawn under the night tint, so they dim at night; the radar, touch and ghost are drawn over it.
- Outside my files, noticed in passing: `nodeSprite` (18) made 34-36 canvases in 40 zoom frames in the probe. Worth a look by whoever has 18.

## Not checked
The art helpers in 18 and 19 (`sprite`, `bldSprite`, `nodeSprite`, `E_`, `P_`, `L_`, `LG`), the event draws in `37-events` called from `drawEvents`, `drawReticle`, and real-device frame times (no phone; costs are inferred from call counts). I ran no gate, soak, balance or probe tests.
