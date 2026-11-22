# idx6 review: index.html 1501-1794 (lights, stage, marks, units, minimap, meadow, woods, drawThings, touch, start, FK) plus the draw loop and slideSheet

Snapshot /home/claude/rv (1d0379ea). Read only. Nothing was run in a browser. All line numbers are from the snapshot.

Counts: CRASH 0 · PLAY 2 · FRAMES 12 · RULE 1. I found no crash in 1501-1794. Spots I checked: `artOf('campfire')` (KIND.campfire exists, MG3), the `t.n` NaN on camps and standards (never read on those branches), and `SIDES[t.side]` guards in drawMini and pileAt.

Diff note: many lines in this file are 300-1,500 characters long. Where a `-`/`+` line ends or starts with `…`, the rest of the line is unchanged and left out.

## How I ranked
The phone: iPhone, dpr capped at 2 (387 `Math.min(2, devicePixelRatio || 1)`), portrait 390×844 CSS px, with 300 units, 60 buildings and a big map (N = 3960/10 = 396 tiles a side). FRAMES items are ranked by my estimate of frame time saved. The operation counts come from the code. The millisecond figures are estimates, not measurements (nothing was run). To check any of them, use `?fps`: the meter's second line (words `laps`: land, clouds, things, fog, marks, sky, lights) shows ms per layer. Finding 1 shows up as spikes in "land" during a battle. Findings 2-5, 7, 8 and 11 show up in "things". Finding 9 is drawn in the `over` hook after "lights", so no lap covers it.

Why this matters more than it seems: `shed()` (1517-1520, books D.draw `slow 0.72, lv.fps 1, fps 30, res [1,1,1,0.75,0.5]`) drops the game to a 30 fps cap once draw time stays above 0.72 × 16.7 ms ≈ 12 ms for 2 s. If it stays slow it then drops resolution. So every item below that takes the draw under ~12 ms puts the phone back at 60 fps.

**Correction to the brief's premise (slideSheet ~458).** slideSheet does **not** copy the whole land picture every frame. Each frame it makes one screen-sized `drawImage` (462). The sheet is the screen plus a 64 px margin, and the copy is clipped to the screen. That copy is cheap. What costs is the **full repaint** of the sheet: it repaints the ground paths for the whole map at the current zoom, the grass-blade pattern fills, the paper light map, flowers, scars and skin. Findings 1 and 6 cover when that repaint fires far too often.

---

### 1. FRAMES (biggest in battles): every unit death anywhere on the map repaints the whole land sheet next frame
`index.html:374`, `:467`, `:1339`, `combat.js:68`
- Chain: `combat.js:68 … FK.fire('gone', t)` → `1339 on('gone', (t) => { if (t.kind === 'unit') fallen(t); })` → `376 fallen(u) … blot(...)` → `374 blot = (x, y, rx, ry, fill) => { … scarX.fill(); SCARV++; }` → `467 slideSheet(LANDS, [show.K, SEASON.key, snowStep(), BLOOMY, SCARV].join(), …` → the key no longer matches, so `461 if (k !== S.key || …) { … paint(); }` repaints the whole land.
- Scenario: a 300-unit battle with ~5 deaths a second gives ~5 full land repaints a second. The same happens for a deer killed by a hunter (wild animals are units, side −1), for an unseen enemy dying in fog, or for a death off screen. The sheet repaints even when the scar can't be seen. That shows up as a hitch several times a second during exactly the fights where frame rate matters. Those hitches feed `shed()`, which then caps the game at 30 fps and can lower the resolution. Cost per repaint: unsure. It is the heaviest single paint in the game.
- Smallest fix: paint the new blot straight onto the live land sheet as well as the scar canvas, and take SCARV out of the key. Source-over is associative, so the result nearly matches a full repaint (anti-aliasing differs slightly, because the scar canvas is drawn scaled from `SC.res`). Two small differences until the next repaint (≤10 s or the next pan past the margin): the blot sits over the snow skin, and the soldier's cut line and rubble rects (377, 379) only appear then.
```diff
-const oval = (c, x, y, rx, ry) => c.ellipse(x, y, rx, ry, 0, -Math.PI, Math.PI), blot = (x, y, rx, ry, fill) => { scarX.fillStyle = fill; scarX.beginPath(); oval(scarX, x, y, rx, ry * TILT); scarX.fill(); SCARV++; }, onGround = (bx, by) => { const [x, y] = toView(bx, by, H[tileAt(bx, by)]); return [x + ox, y + oy]; };
+const oval = (c, x, y, rx, ry) => c.ellipse(x, y, rx, ry, 0, -Math.PI, Math.PI), onSheet = (f) => { const S = LANDS, M = D.landCache.margin, z = S.z; if (!S.key) return; S.x.save(); S.x.setTransform(dpr * z, 0, 0, dpr * z, dpr * (M + cw * DRW.half - (ox + S.cx) * z), dpr * (M + ch * DRW.half - (oy + S.cy) * z)); f(S.x); S.x.restore(); }, blot = (x, y, rx, ry, fill) => { scarX.fillStyle = fill; scarX.beginPath(); oval(scarX, x, y, rx, ry * TILT); scarX.fill(); onSheet((c) => { c.fillStyle = fill; c.beginPath(); oval(c, x, y, rx, ry * TILT); c.fill(); }); }, onGround = (bx, by) => { const [x, y] = toView(bx, by, H[tileAt(bx, by)]); return [x + ox, y + oy]; };
-  seasonNow(); slideSheet(LANDS, [show.K, SEASON.key, snowStep(), BLOOMY, SCARV].join(), // E1061
+  seasonNow(); slideSheet(LANDS, [show.K, SEASON.key, snowStep(), BLOOMY].join(), // E1061
```
  Then drop `SCARV` from 373 (`let scarX = null, SCARV = null;`), since 373, 374 and 467 are its only uses. The mapping matches the paint at 468: `gx = toScreen(-ox,-oy)[0]` at paint time is `cw/2 − (ox + S.cx)·S.z`, and the scar canvas works in ground units (`scarX.scale(SC.res)`, 304) and is drawn at `gw * cam.z`. `LANDS` and `DRW` are only read at run time, so there is no TDZ problem. A cheaper half-measure: bump SCARV only when the blot lands inside the current sheet. That fixes off-screen and fogged deaths, but not the deaths you are watching.
- Also: the D363 book text says "every ms milliseconds so a new scar or hole shows within a second", but `ms` is 10000. The text and the number disagree.

### 2. FRAMES (big when an army is selected): one blurred stroke per selected unit per frame
`index.html:1725`
- Quote: `const on = pick.includes(u); ctx.lineWidth = on ? DRS.pick : DRS.foot; ctx.shadowColor = R.pick; ctx.shadowBlur = on ? DRS.glow : 0; ctx.beginPath(); ctx.ellipse(...); ctx.stroke(); ctx.shadowBlur = 0;` with books `dress.glow = 8`.
- Scenario: select 100 soldiers and fight. That is 100 shadow-blur passes every frame. In Safari each canvas shadow is a separate offscreen blur, one of the most expensive 2D calls. Estimate: several ms a frame at 100 selected (unsure of the exact figure). `pick.includes(u)` also runs twice per unit, which is O(units × picked) every frame.
- Smallest fix: stroke all selected rings as one path with one blur, as a ground layer before the sorted pass, and skip them in `unit()`. Visual change: a selected ring now sits under everything in the frame, including the front edge of a building just behind the unit.
```diff
   MINE.length = HID.length = 0; COVER.clear(); COVERED.clear(); if (!dots) { drawWoods(); drawShadows(s); covers(s); }
+  const PK = new Set(pick); if (!dots && show.U && PK.size) { const P = new Path2D(), rx = DRS.ring * s * FIG(); for (const u of PK) { if (u.gone || u.inside || (u.side !== ME && (!inSight(u) || u.veil))) continue; const [x, y] = toScreen(...vAt(u)); P.moveTo(x + rx, y); P.ellipse(x, y, rx, rx * DRW.half, 0, 0, Math.PI * 2); } ctx.save(); ctx.strokeStyle = ctx.shadowColor = C.foot.pick; ctx.lineWidth = DRS.pick; ctx.shadowBlur = DRS.glow; ctx.stroke(P); ctx.restore(); }
-    if (!dots) { const R = C.foot; ctx.strokeStyle = pick.includes(u) ? R.pick : u.side !== ME ? (u.side >= 0 ? SIDES[u.side].col : R.wild) : isIdle(u) && !moving(u) ? R.idle : R.work; const on = pick.includes(u); ctx.lineWidth = on ? DRS.pick : DRS.foot; ctx.shadowColor = R.pick; ctx.shadowBlur = on ? DRS.glow : 0; ctx.beginPath(); ctx.ellipse(x, y, DRS.ring * s * FIG(), DRS.ring * DRW.half * s * FIG(), 0, 0, Math.PI * 2); ctx.stroke(); ctx.shadowBlur = 0; } // E766
+    if (!dots && !PK.has(u)) { const R = C.foot; ctx.strokeStyle = u.side !== ME ? (u.side >= 0 ? SIDES[u.side].col : R.wild) : isIdle(u) && !moving(u) ? R.idle : R.work; ctx.lineWidth = DRS.foot; ctx.beginPath(); ctx.ellipse(x, y, DRS.ring * s * FIG(), DRS.ring * DRW.half * s * FIG(), 0, 0, Math.PI * 2); ctx.stroke(); } // E766
```
  (`unit` is first called inside the `for (const t of things)` loop, after `PK` is declared, so there is no TDZ.)

### 3. FRAMES (every frame, zoomed in): `covers()` looks up a sprite for every unit and every non-tree thing on the whole map, then scans 169+ tiles for each on-screen one
`index.html:1718-1721`
- Quote 1719: `const live = [...units.filter((u) => !u.inside && (u.side === ME || inSight(u))).map((u) => [u, vAt(u), () => unitSprite(u, F), F, at(u.k)]), ...rest().map((t) => (t.kind === 'bld' ? [t, [t.vx, t.vy], () => bldSprite(...` and 1720: `const [x, y] = toScreen(...v), b0 = boxOf(spr(), x, y, f), [bx, by, bw, bh] = b0; if (bx > cw || by > ch || bx + bw < 0 || by + bh < 0) continue;`. The screen test comes after `spr()`.
- Scenario: with 300 units and ~300 buildings, mines, berries and animals, and the camera showing a tenth of the map, each frame builds ~5 allocations per entry (~3,000 objects). It also runs ~600 sprite lookups (key strings, `Math.log`, LRU `delete`+`set`, plus finding 4's allocations), ~90% of them for things off screen. Each on-screen entry then scans `(n + 2·woods.cover)²` = 13×13 = 169 `TMAP.m.get` (196-289 for buildings): ~100 on-screen units gives ~17,000 Map lookups a frame. Estimate 2-4 ms a frame.
- Smallest fix: cull on the anchor before the sprite is touched, with the same margin as drawThings. That margin is `70 * s` today; finding 15 proposes moving it to a book entry, written `DRW.cull` here. Until then, use the same `70 * s`.
```diff
-  for (const [u, v, spr, f, [i, j, n]] of live) { const [x, y] = toScreen(...v), b0 = boxOf(spr(), x, y, f), [bx, by, bw, bh] = b0; if (bx > cw || by > ch || bx + bw < 0 || by + bh < 0) continue;
+  const m = DRW.cull * s; for (const [u, v, spr, f, [i, j, n]] of live) { const [x, y] = toScreen(...v); if (x < -m || x > cw + m || y < -m || y > ch + m) continue; const b0 = boxOf(spr(), x, y, f), [bx, by, bw, bh] = b0; if (bx > cw || by > ch || bx + bw < 0 || by + bh < 0) continue;
```
  Next step, not in the diff: skip the 169-tile scan when none of the chunks it touches has a deep tree (`DEEP[c].length`, already kept per 32×32 chunk). Build `live` lazily so off-screen entries allocate nothing.

### 4. FRAMES (every frame, scales with units × 3-4): sprite lookups allocate on every call. `rankOf`/`kitOf` per unit, `levelOf` per building
`index.html:1217-1218`, `:409`, `:520-521` (called from 1592, 1624, 1719, 1733, 1461, 1560-1561)
- Quote 409: `ranks = (code, side) => (RANKS[code] || []).filter((c) => (known.get(side) || new Set()).has(c)), … kitOf = (side, code) => KITS.filter((c) => SH[code].class && (known.get(side) || new Set()).has(c)).length;`. Every call makes 2 arrays, plus a `new Set()` per element when the side knows no tech (wild side −1, early game).
- Quote 521: `… : [...k].filter((c) => BOOKS.tech[c].value.tier === art).length` spreads every tech the side knows into a new array per call (260 techs in the book).
- Scenario: `unitSprite` runs 3-4 times per unit per frame: drawUnit 1624, covers 1719, hides 1461 and rims 1560 at night. `levelOf` runs 3-4 times per building per frame: 1592, 1733, 1719 and 1561. With 300 units and 60 late-game buildings that is ~1,000 unitSprite calls, ~2,000-8,000 short-lived objects and ~20,000 tech-array element copies a frame, plus key strings and an LRU `SPR.delete(k); SPR.set(k, c)` per call (1225). This shows up as GC pauses on the phone. Estimate 1-3 ms a frame plus GC spikes.
- Smallest fix: memoize per side in the existing `FXC` memo. It is already cleared by `learn()` (411 `FXC.delete(side)`), `load()` (452 `FXC.clear()`) and `start` (393), the only places `known` changes.
```diff
-const ranks = (code, side) => (RANKS[code] || []).filter((c) => (known.get(side) || new Set()).has(c)), rankOf = (code, side) => ranks(code, side).length, kitOf = (side, code) => KITS.filter((c) => SH[code].class && (known.get(side) || new Set()).has(c)).length;
+const memoOf = (side, id, f) => { const M = FXC.get(side) || FXC.set(side, new Map()).get(side); if (!M.has(id)) M.set(id, f()); return M.get(id); };
+const ranks = (code, side) => (RANKS[code] || []).filter((c) => (known.get(side) || new Set()).has(c)), rankOf = (code, side) => memoOf(side, code + ' #rank', () => ranks(code, side).length), kitOf = (side, code) => memoOf(side, code + ' #kit', () => KITS.filter((c) => SH[code].class && (known.get(side) || new Set()).has(c)).length);
-const levelOf = (t) => { const [, , , art] = B[t.code], L = SPRITE[art]?.level, k = known.get(t.side) || new Set(), at = TECHAT[t.code] || [], n = at.filter((c) => k.has(c)).length;
-  return [!L ? L : L.season ? season() : L.spent ? +!t.amount : L.flock ? t.sheep : L.age ? +((SIDES[t.side] || {}).age >= L.age) : [...k].filter((c) => BOOKS.tech[c].value.tier === art).length, +!!n + +(!!n && n >= at.length * UPA.half)]; };
+const levelOf = (t) => { const [, , , art] = B[t.code], L = SPRITE[art]?.level, at = TECHAT[t.code] || [], [n, tier] = memoOf(t.side, t.code + ' #level', () => { const k = known.get(t.side) || new Set(); return [at.filter((c) => k.has(c)).length, [...k].filter((c) => BOOKS.tech[c].value.tier === art).length]; });
+  return [!L ? L : L.season ? season() : L.spent ? +!t.amount : L.flock ? t.sheep : L.age ? +((SIDES[t.side] || {}).age >= L.age) : tier, +!!n + +(!!n && n >= at.length * UPA.half)]; };
```
  Follow-up: reuse one sprite per unit per frame. Every caller passes the same `cam.z * FIG()`, so a per-frame `Map(u → canvas)` cleared at the top of drawThings would remove 2-3 of the 4 lookups.

### 5. FRAMES (zoomed out, cam.z < 0.5): every tree on screen is its own `fillStyle` + `fillRect`
`index.html:1731`, `:1736`, `:1727`, `:1238`
- Quote 1731: `if (t.deep && !dots && !COVER.has(t) && !K.burn.has(t)) continue;`. In dots mode deep trees are not skipped, and the woods sheet isn't drawn (1728 `if (!dots) { drawWoods(); …`). Quote 1736: `else if (dots) rect(x - 1, y - 1, 2, 2, DOT[t.kind]);` with `rect = (x, y, w, h, fill) => { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }`.
- Scenario: at the whole-board view that `fit()` sets (386: `(cw − 24) / D.board` ≈ 0.12 on a 390-px-wide phone), or at any view under D.lod/D.tile = 0.5, the screen covers a large part of the 396×396-tile map. That means thousands of trees (count unsure, it depends on forest cover) and thousands of separate canvas calls a frame, plus a `toScreen` array per thing. Units add one call each.
- Smallest fix: batch the dots per colour into one Path2D, fill once per colour after the pass, things first and units on top:
```diff
-  const s = cam.z, dots = s * D.tile < D.lod, m = 70 * s, us = units.slice().sort((a, b) => a.vy - b.vy); let n = 0;
+  const s = cam.z, dots = s * D.tile < D.lod, m = 70 * s, us = units.slice().sort((a, b) => a.vy - b.vy), TD = new Map(), UD = new Map(), dot = (M, x, y, col) => (M.get(col) || M.set(col, new Path2D()).get(col)).rect(x - 1, y - 1, 2, 2); let n = 0;
-    if (dots) rect(x - 1, y - 1, 2, 2, u.side >= 0 ? SIDES[u.side].col : C.white); else { …
+    if (dots) dot(UD, x, y, u.side >= 0 ? SIDES[u.side].col : C.white); else { …
-    else if (dots) rect(x - 1, y - 1, 2, 2, DOT[t.kind]); else { …
+    else if (dots) dot(TD, x, y, DOT[t.kind]); else { …
   while (n < us.length) unit(us[n++]);
+  for (const M of [TD, UD]) for (const [col, p] of M) { ctx.fillStyle = col; ctx.fill(p); }
```
  Visual change: tree dots no longer hide behind building sprites at that zoom (buildings are a few px there). Better still: paint the static dots into the woods sheet in dots mode so they cost one blit.

### 6. FRAMES (stutter while panning or pinching out): every sheet repaints each time the camera crosses 64 px, or zooms out ~13%
`index.html:458-462`, `:469`, `books/measure.js:308` (D363)
- Quote 461: `if (k !== S.key || r !== 1 || Math.abs(dx) > M || Math.abs(dy) > M || now - S.t > ms) { … paint(); … }` with `"margin": 64`. For zoom-out, the stretched branch (460) needs `ox <= 0`, i.e. `r ≥ (ch/2)/(ch/2 + M)` = 422/486 = 0.87 on an 844-px-tall screen.
- Scenario: a drag at 10 px a frame repaints LANDS + WOODSH + FOGS every ~7th frame (~9 times a second). All three share `cam` and `M`, so they cross the edge on the same frame and that one frame pays for three full repaints. A pinch-out repaints every ~13% of zoom.
- Smallest fix (book only, tuning): `margin` 64 → 192. That gives 3× fewer pan repaints, and zoom-out falls back to the existing √2 (`STEP`) limit (0.69 < 0.707). Cost: each sheet grows from 2.0 M to 3.8 M device px (8 → 15 MB; ≈ +21 MB for three sheets), and each repaint fills ~1.9× the pixels.
```diff
- "D363": {"key": "landCache", "value": {"ms": 10000, "margin": 64, "settle": 160}, …
+ "D363": {"key": "landCache", "value": {"ms": 10000, "margin": 192, "settle": 160}, …
```
  Also, on 469: when there is no mist (`mk === ''`) the FOGS sheet holds a single scaled `drawImage` of the 99×99 fog canvas (1467). Caching that in a full-screen sheet saves nothing, because the frame still blits a full-screen image. The cache costs a repaint every fog beat (`fogPaint` → `FOGV++`, D.sight.tick 0.5 s) and every pan past the margin, plus 8 MB. Draw `FOGC` straight to the screen then (drawFog needs its `+ M` offset dropped). Likewise, skip the WOODSH blit when `paintWoods` found no deep tree on screen. Right now that is a full-screen transparent blit for nothing. The real fix, later: scroll the sheet onto itself and paint only the exposed strip, or use fixed world tiles per zoom step.

### 7. FRAMES (every frame, zoomed in): `hides()` tests every drawn thing against every own unit already drawn
`index.html:1461`
- Quote: `for (const m of MINE) { m.b = m.b || boxOf(unitSprite(m.u, m.z), m.x, m.y, m.z); const [bx, by, bw, bh] = m.b; if (meets(m.b, o) && inkAt(...)) HID.push([m, c, o]); }`. Called for every building and every non-deep node drawn (1733, 1736).
- Scenario: 150 own units and 200 drawn things on screen means up to ~30,000 box tests a frame, each destructuring three arrays through the iterator protocol (here and inside `meets`). Estimate 0.5-2 ms. Separately, `inkAt` (1460) calls `getImageData` on each new sprite canvas, a GPU readback. Every √2 zoom step makes new sprite canvases, so pinching causes a burst of readbacks (one-off hitches, unsure size).
- Smallest fix: index compare and early reject (same truth table as `meets`):
```diff
-const hides = (c, x, y, z) => { if (!MINE.length) return; const o = boxOf(c, x, y, z); for (const m of MINE) { m.b = m.b || boxOf(unitSprite(m.u, m.z), m.x, m.y, m.z); const [bx, by, bw, bh] = m.b; if (meets(m.b, o) && inkAt(c, o, bx + bw * DRW.half, by + bh * DRW.half)) HID.push([m, c, o]); } };
+const hides = (c, x, y, z) => { if (!MINE.length) return; const o = boxOf(c, x, y, z), ox2 = o[0] + o[2], oy2 = o[1] + o[3]; for (const m of MINE) { const b = m.b || (m.b = boxOf(unitSprite(m.u, m.z), m.x, m.y, m.z)); if (b[0] >= ox2 || o[0] >= b[0] + b[2] || b[1] >= oy2 || o[1] >= b[1] + b[3]) continue; if (inkAt(c, o, b[0] + b[2] * DRW.half, b[1] + b[3] * DRW.half)) HID.push([m, c, o]); } };
```
  Structural follow-up: keep MINE sorted by box x and binary-search the range.

### 8. FRAMES (daytime, every frame): one `fill()` per unit shadow
`index.html:1480-1481` (called from 1728)
- Quote: `for (const u of units) { … ctx.beginPath(); ctx.ellipse(...); ctx.fill(); }`. Tree shadows two lines below (1482-1483) already batch into one path and one fill.
- Scenario: 300 units on screen means 300 separate fills a frame with the same colour and alpha. With one path: 1 fill. Visual change: overlapping unit shadows no longer double-darken, which matches the tree shadows (and real shadows). The diff also carries the PLAY fix from finding 13.
```diff
-  for (const u of units) { if (u.inside || !inSight(u)) continue; const [x, y] = toScreen(...vAt(u)); if (x < -40 * s || x > cw + 40 * s || y < -40 * s || y > ch + 40 * s) continue; const h = 18, f = s * FIG();
-    ctx.beginPath(); ctx.ellipse(x + (dx * h * f) / 2, y + (dy * h * f) / 2, Math.max(4 * f, (Math.hypot(dx, dy) * h * f) / 2), 2.5 * f, Math.atan2(dy, dx), 0, 7); ctx.fill(); }
+  ctx.beginPath(); for (const u of units) { if (u.inside || !inSight(u) || (u.side !== ME && u.veil)) continue; const [x, y] = toScreen(...vAt(u)); if (x < -40 * s || x > cw + 40 * s || y < -40 * s || y > ch + 40 * s) continue; const h = 18, f = s * FIG(), ex = x + (dx * h * f) / 2, ey = y + (dy * h * f) / 2, rx = Math.max(4 * f, (Math.hypot(dx, dy) * h * f) / 2), th = Math.atan2(dy, dx);
+    ctx.moveTo(ex + rx * Math.cos(th), ey + rx * Math.sin(th)); ctx.ellipse(ex, ey, rx, 2.5 * f, th, 0, 7); } ctx.fill();
```
  (The `moveTo` to each ellipse's start point is needed, or the fill draws wedges between consecutive shadows. The chosen numbers 40/18/4/2.5/7 belong to that range's reviewer.)

### 9. FRAMES (every frame): the minimap is redrawn from scratch each frame
`index.html:1635-1644` (via the `over` hook, 1581)
- Quote 1639: `for (const t of things) { if (t.kind !== 'bld') { if (GIFT[(KIND[t.kind] || {}).look]) { … sq(...) } continue; } if (!SIDES[t.side] || has(t, 'Trap') || fire('hide', t)) continue; … c.fillStyle = SIDES[t.side].col;` and 1641: `for (const u of units) if (…) { c.fillStyle = SIDES[u.side].col; sq(...at(u.vx, u.vy), MNI.dot); }`. Plus a scaled `drawImage(ground, …)` of the whole land picture (1637).
- Scenario: a 172-px picture that changes at sim speed costs a loop over every thing on the map (thousands of trees just to `continue`) plus ~2 canvas calls per unit and building, ~800 calls a frame with 300 units.
- Fix (sketch): paint the body (ground, finds, buildings, unit dots) into an offscreen canvas only when `FOGV` changes (it already bumps every 0.5 s fog beat) or when `MINIBOX` changes. Each frame, blit that, then draw the live parts: blink ring (1643) and view box (1644). Unit dots would lag at most 0.5 s, ≈1 minimap px.

### 10. FRAMES (every frame at cam.z ≥ 1.5): `drawGlints()` projects every glint on the whole map, with 3 allocations each
`index.html:1690`, `:1668`
- Quote 1690: `for (const [x, y, ph, len] of GLINTS) { const [sx, sy] = toScreen(...V(x, y, 0)); if (sx < 0 || …) continue;`. `V` makes 2 arrays (54) and toScreen a third. GLINTS holds one per ~12 deep-water tiles over the whole 396×396 map (`PL.glint.per 0.08`; count unsure, it depends on the sea). After that, each lit glint is its own `stroke()`.
- Smallest fix: the view point is static (h = 0), so store it once and use inline math. The RNG order is unchanged (x, y, ph, len are still drawn in the same order):
```diff
-  GLINTS = []; for (let k = 0; k < N * N; k++) if (H[k] < -D.wade && r() < PL.glint.per) GLINTS.push([((k % N) + r()) * T, (Math.floor(k / N) + r()) * T, r() * TAU, PL.glint.len[0] + r() * PL.glint.len[1]]); }
+  GLINTS = []; for (let k = 0; k < N * N; k++) if (H[k] < -D.wade && r() < PL.glint.per) GLINTS.push([...V(((k % N) + r()) * T, (Math.floor(k / N) + r()) * T, 0), r() * TAU, PL.glint.len[0] + r() * PL.glint.len[1]]); }
-  for (const [x, y, ph, len] of GLINTS) { const [sx, sy] = toScreen(...V(x, y, 0)); if (sx < 0 || sy < 0 || sx > cw || sy > ch) continue; const a = Math.sin(t * G2.rate + ph); if (a <= 0) continue; ctx.globalAlpha = a * G2.a; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + len * z, sy); ctx.stroke(); }
+  for (const [vx, vy, ph, len] of GLINTS) { const sx = (vx - cam.x) * z + cw * DRW.half, sy = (vy - cam.y) * z + ch * DRW.half; if (sx < 0 || sy < 0 || sx > cw || sy > ch) continue; const a = Math.sin(t * G2.rate + ph); if (a <= 0) continue; ctx.globalAlpha = a * G2.a; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + len * z, sy); ctx.stroke(); }
```
  (GLINTS is read only at 1689-1690.)

### 11. FRAMES (every frame): `save()`/`restore()` and up to three matrix calls per unit
`index.html:1625-1626`, `:1590`
- Quote 1625: `ctx.save(); ctx.translate(bx, by); if (th) ctx.rotate(th); if (u.face < 0) ctx.scale(-1, 1); blit(sp, …); …` and 1626: `… blit(sp, null, null, s); } ctx.restore();`. Also `bar()` (1590) does its own `save/restore` per low-morale soldier.
- Scenario: 300 units means 300 state copies and restores a frame. Smaller than items 1-10 (estimate 0.3-1 ms, unsure).
- Smallest fix: one transform call, then reset to the frame's base transform. Reset alpha and composite explicitly. Every later draw in 1627-1632 sets its own styles, so the bundle's fill/stroke no longer needs restoring.
```diff
-  ctx.save(); ctx.translate(bx, by); if (th) ctx.rotate(th); if (u.face < 0) ctx.scale(-1, 1); blit(sp, null, null, s * pop); …
+  const f0 = u.face < 0 ? -1 : 1, co = Math.cos(th || 0), si = Math.sin(th || 0); ctx.transform(f0 * co, f0 * si, -si, co, bx, by); blit(sp, null, null, s * pop); …
-  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = gal * Math.sin((ga / gl) * Math.PI); blit(sp, null, null, s); } ctx.restore();
+  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = gal * Math.sin((ga / gl) * Math.PI); blit(sp, null, null, s); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; } ctx.setTransform(DRAW.t0);
```
  plus `DRAW.t0 = ctx.getTransform();` once at the top of `drawThings()` (it keeps the jolt shake).

### 12. FRAMES (night and work buildings, every frame): gradients, colour parsing and text made fresh each frame
`index.html:1543`, `:1545-1553`, `:1607`, `:1588`
- 1543 `flame()`: `h = c.createRadialGradient(...); h.addColorStop(0, rgba(hexRGB(CLT.core).join(), ca));` makes a new gradient and parses a hex string per torch, campfire and blaze per frame.
- 1545-1553 `lightsOf()`: rebuilds the whole light list every frame (loops over `rest()` and all units, with `fire('hide', t)` per building). Once a second the camp count runs `dropFor` (a `closest()` over buildings) for every gatherer.
- 1607 `workMark()`: `g = ctx.createRadialGradient(x, cy, 0, x, cy, R)` per worked 'Make' building per frame, day and night, inside a `save/restore`.
- 1588 `idleMark()`: `ctx.strokeText(...); ctx.fillText(...)` for every idle villager, idle work building and unstaffed site each frame. Text is among the slowest canvas calls.
- Smallest fixes: hoist the constant colour; cache the core and the work glow as pre-drawn canvases per kind and size, the same way `GLOWS` already does (1537); compute `lightsOf()` on the fog beat (0.5 s) instead of every frame; draw the idle glyph once into a `sprite()` and blit it.
```diff
-const FLAME_RGB = Object.fromEntries(Object.entries(FLM).map(([k, f]) => [k, kelvinRGB(f.K)])), flameLife = (k) => (FLM[k].covered || !(K.rain > 0 || K.snowing > 0) ? 1 : LGT.wet);
+const FLAME_RGB = Object.fromEntries(Object.entries(FLM).map(([k, f]) => [k, kelvinRGB(f.K)])), CORE_RGB = hexRGB(CLT.core).join(), flameLife = (k) => (FLM[k].covered || !(K.rain > 0 || K.snowing > 0) ? 1 : LGT.wet);
-… h.addColorStop(0, rgba(hexRGB(CLT.core).join(), ca)); …
+… h.addColorStop(0, rgba(CORE_RGB, ca)); …
```
  (`flame()` also returns early when `still()`, so at shed level ≥ 2 only the glows remain.)

### 13. PLAY: a sneaking enemy spy or scout is invisible, but its shadow is drawn
`index.html:1480` (called from drawThings 1728)
- Quote 1480: `for (const u of units) { if (u.inside || !inSight(u)) continue;`. Every other place that draws or picks units also hides `u.veil`: 1724 `(u.side !== 0 && (!inSight(u) || u.veil))`, 1560 rims, 1641 minimap, 1767 tap. The veil is set in `combat.js:373 u.veil = !!u.sneak && veilOf(u)` and `combat.js:334`.
- Scenario: by day, an enemy scout with sneak on walks through ground you can see. No body, no ring, no minimap dot, no tap target, but a dark ellipse slides across the grass. The stealth mechanic is given away.
- Fix: add `|| (u.side !== ME && u.veil)` to the skip (already in finding 8's diff). As a one-line diff on its own:
```diff
-  for (const u of units) { if (u.inside || !inSight(u)) continue; const [x, y] = toScreen(...vAt(u));
+  for (const u of units) { if (u.inside || !inSight(u) || (u.side !== ME && u.veil)) continue; const [x, y] = toScreen(...vAt(u));
```

### 14. PLAY: at peace, each stood-down soldier visibly dies (falls over, leaves a blood scar), then a villager pops up
`econ.js:605`, `index.html:1339`, `:1489` (the 'gone' hooks; outside my lines, flagging in case nobody else does)
- Quote econ.js:605: `for (const u of go) { … u.gone = true; u.why = 'stood down'; FK.fire('gone', u); const [vil] = FK.trains(h.code), v = FK.spawn(vil, side, u.k, FK.rng) …`. The hooks don't look at `u.why`: 1339 `on('gone', (t) => { if (t.kind === 'unit') fallen(t); })` paints a fall blot and, for soldiers, a cut line. 1489 `on('gone', (u) => { if (u.kind === 'unit' && !u.under && … ) FALL.push({ u, t: K.t }); })` plays the falling-body animation.
- Scenario: a truce stands down 30 of your soldiers. Thirty bodies topple, 30 blood marks stay on the ground, and 30 villagers appear on the same tiles. It also forces a land repaint (finding 1).
- Fix: mark the stood-down unit and skip both hooks for it. Don't test `!u.why`: `combat.js:66 die()` sets `t.why = by ? null : why || 'unknown'`, so every death with no killer carries a `why` too (`'unknown'` or the cause), and those should still fall. The flag is a new field (rule 10), but it never reaches a save, because the unit has already been spliced out of `units`.
```diff
-  for (const u of go) { const us = units(); us.splice(us.indexOf(u), 1); u.gone = true; u.why = 'stood down'; FK.fire('gone', u); …
+  for (const u of go) { const us = units(); us.splice(us.indexOf(u), 1); u.gone = true; u.why = 'stood down'; u.stood = true; FK.fire('gone', u); …
-on('gone', (t) => { if (t.kind === 'unit') fallen(t); }); …
+on('gone', (t) => { if (t.kind === 'unit' && !t.stood) fallen(t); }); …
-on('gone', (u) => { if (u.kind === 'unit' && !u.under && FALL.length < FD.most && …
+on('gone', (u) => { if (u.kind === 'unit' && !u.under && !u.stood && FALL.length < FD.most && …
```

### 15. RULE (with a visible pop): chosen numbers and a hard-coded side in 1701-1784
- `1723 m = 70 * s` is a chosen number, and it is too small for the tallest art. A building's art rises about `top` art units above its anchor; its sprite box rises `c.ay = top + pad + SKEW·k/2` (1234-1235, `pad = 12`). Books: tower top 84, wonder 72, castle 66, keep 62. A tower whose base sits more than 70·s below the bottom edge has the top 14·s px of its roof still on screen (28 px at s = 2; up to 26·s counting the box) but is culled at 1732, so it pops in and out while you pan. Wonders do the same by a hair (72 > 70). Fix: move it to a book entry derived from the tallest art (e.g. `D.draw.cull`, tuning, "tallest art top + pad"), and use the same entry in `covers()` (finding 3). New book entry, so it needs Albert's OK (rule 10). Unsure: whether tall trees being cut (non-deep, drawn here) pop the same way. That depends on `artOf(tree)`, which needs a runtime canvas to know.
- `1724 (u.side !== 0 && …` should be `u.side !== ME`. Every other check uses ME (1560, 1641, 1767). Today ME = D.players[0] = 0, so the behaviour is the same, but it breaks one-home and same-logic.
- `1777 Math.exp(-e.deltaY * 0.0015)` is the wheel zoom rate. `1784 Math.floor(Math.random() * 4294967296)` is the new-seed range (2³²; Math.random is fine here, it is not sim). `1727/1736 rect(x - 1, y - 1, 2, 2, …)` is the dot size; the book already has `D.mini.dot = 2`. `1701 const CS = 32` is the woods chunk size. All should come from books.
- `BLDTOP` (592) collects every sprite entry with a `top`, including `touch.top = -1.5708` and `standard.top`, which are angles. It's harmless today, but it's the same word for two things (rule 12).
```diff
-  const unit = (u) => { if (!show.U || u.inside || (u.side !== 0 && (!inSight(u) || u.veil))) return; …
+  const unit = (u) => { if (!show.U || u.inside || (u.side !== ME && (!inSight(u) || u.veil))) return; …
```

---
Not findings, checked and fine: `slideSheet` setting `S.c.width` every repaint (I believe WebKit clears a same-size buffer without reallocating; unsure); `GLOWS` keyed by kind but built at the dpr of first use (only drawn scaled); `followCam` allocating via `FK.picked()` (only while following); `units.slice().sort()` per frame (~0.05 ms at 300).
