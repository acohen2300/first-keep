# idx3 — index.html lines 601–900 (building art, node art, trees, figures)

Snapshot /home/claude/rv @ 1d0379ea, read-only. Numbers were checked with node against the books (scripts in /tmp/idx3). The game was not run.
Counts: CRASH 1 (latent) · PLAY 5 (one latent) · FRAMES 2 · RULE 1.
Art numbers in code are not flagged (LIST.md: "outside the art", "Building shapes as data: parked").

---

## 1. CRASH (latent): looks pit/net/stakes/caltrops have no ART entry, and 3 loops still call bldSprite on traps
- Where: index.html:593–800 (the ART table), callers index.html:1561, 1719–1720, 1769
- books/shells.js:59–62: BF1–BF4 have `"look": "pit"`, `"net"`, `"stakes"`, `"caltrops"`, `"ticks": ["Trap", "Health"]`. ART has no keys with those names. The keys run from abatis to wonder, and nothing else adds to ART.
- 1235, inside bldSprite's paint: `ART[art](col, 0, lv, civ, want)`.
- drawThings guards traps: 1733 `if (has(t, 'Trap')) { if (!dots) trapArt(x, y, s, t); continue; }`. Three other loops have no such guard:
  - covers(), which runs every frame while zoomed in (1728 `if (!dots) { drawWoods(); drawShadows(s); covers(s); }`). 1719 `...rest().map((t) => (t.kind === 'bld' ? [..., () => bldSprite(t.code, ...` and 1720 `boxOf(spr(), x, y, f)`.
  - rims() at night, 1561: `for (const t of blds()) { if (t.done < 1 || fire('hide', t)) continue; ... lit(bldSprite(t.code, ...`
  - hitAt() on a tap, 1769: `for (const t of things) { if (t.kind !== 'bld' || fire('hide', t)) continue; ... c = bldSprite(t.code, ...`
- What happens: on the first zoomed-in frame with any trap on the map, covers() throws `TypeError: ART[art] is not a function`. The catch in loop() (418) calls fault(). fault() (422, E656) logs the error once and then ignores the same error; it pauses only when a second, different error comes. So the match keeps running, but every zoomed-in frame stops drawing at covers(). The ground, woods and shadows are drawn; no buildings, no units, and nothing that draw() paints after drawThings. Also, sprite() sets `g = null` only after `paint()` returns, so `g` is left pointing at the scratch canvas. drawShadows (1475) would also cast a building-height shadow for a pit: `(BLDTOP[...] || 40) * 0.7`.
- Can it happen now? No. No code in this snapshot creates BF1–BF4. screen.js SN3 says "the traps … are the Natives' booby traps", and sides.js I3 has `"nat": []`. It will crash the day the Natives lay a trap.
- Fix: skip traps the way drawThings already does.
```diff
--- a/index.html
+++ b/index.html
@@ -1561 +1561 @@
-  for (const t of blds()) { if (t.done < 1 || fire('hide', t)) continue; const [x, y] = toScreen(t.vx, t.vy); if (x < -cw || y < -ch || x > cw + cw || y > ch + ch) continue; lit(bldSprite(t.code, t.col, z, ...levelOf(t), true, SIDES[t.side] && SIDES[t.side].civ), x, y, z); } } // E966
+  for (const t of blds()) { if (t.done < 1 || has(t, 'Trap') || fire('hide', t)) continue; const [x, y] = toScreen(t.vx, t.vy); if (x < -cw || y < -ch || x > cw + cw || y > ch + ch) continue; lit(bldSprite(t.code, t.col, z, ...levelOf(t), true, SIDES[t.side] && SIDES[t.side].civ), x, y, z); } } // E966
@@ -1719 +1719 @@
-  const live = [...units.filter((u) => !u.inside && (u.side === ME || inSight(u))).map((u) => [u, vAt(u), () => unitSprite(u, F), F, at(u.k)]), ...rest().map((t) => (t.kind === 'bld' ? [t, [t.vx, t.vy], () => bldSprite(t.code, t.col, s, ...levelOf(t), true, SIDES[t.side] && SIDES[t.side].civ), s, [t.i, t.j, t.n]] : [t, [t.vx, t.vy], () => nodeSprite(t.kind, t.v, s * artOf(t.kind) * t.size, t.wide), s * artOf(t.kind) * t.size, at(t.k)]))];
+  const live = [...units.filter((u) => !u.inside && (u.side === ME || inSight(u))).map((u) => [u, vAt(u), () => unitSprite(u, F), F, at(u.k)]), ...rest().filter((t) => !has(t, 'Trap')).map((t) => (t.kind === 'bld' ? [t, [t.vx, t.vy], () => bldSprite(t.code, t.col, s, ...levelOf(t), true, SIDES[t.side] && SIDES[t.side].civ), s, [t.i, t.j, t.n]] : [t, [t.vx, t.vy], () => nodeSprite(t.kind, t.v, s * artOf(t.kind) * t.size, t.wide), s * artOf(t.kind) * t.size, at(t.k)]))];
@@ -1769 +1769 @@
-  if (!near) { let top = null; for (const t of things) { if (t.kind !== 'bld' || fire('hide', t)) continue; const [x, y] = toScreen(t.vx, t.vy), c = bldSprite(t.code, t.col, cam.z, ...levelOf(t), true, SIDES[t.side] && SIDES[t.side].civ), f = cam.z / c.q, X = (px - x + c.ax * cam.z) / f, Y = (py - y + c.ay * cam.z) / f; if (X < 0 || Y < 0 || X >= c.width || Y >= c.height || (top && top.vy > t.vy)) continue; if (c.getContext('2d').getImageData(Math.floor(X), Math.floor(Y), 1, 1).data.at(-1)) top = t; } if (top) return [top.j * N + top.i, null]; } // E864
+  if (!near) { let top = null; for (const t of things) { if (t.kind !== 'bld' || has(t, 'Trap') || fire('hide', t)) continue; const [x, y] = toScreen(t.vx, t.vy), c = bldSprite(t.code, t.col, cam.z, ...levelOf(t), true, SIDES[t.side] && SIDES[t.side].civ), f = cam.z / c.q, X = (px - x + c.ax * cam.z) / f, Y = (py - y + c.ay * cam.z) / f; if (X < 0 || Y < 0 || X >= c.width || Y >= c.height || (top && top.vy > t.vy)) continue; if (c.getContext('2d').getImageData(Math.floor(X), Math.floor(Y), 1, 1).data.at(-1)) top = t; } if (top) return [top.j * N + top.i, null]; } // E864
```

## 2. PLAY: the per-tree leaf lag (E777) is about 0, so every tree changes leaf stage at the same moment
- Where: index.html:826 `const f = (yt() / D.season + NS_rng(TREE.seed + v)() * TREE.lag) % TREE.year;`. E777 says "each tree a little later or earlier by its own seed (lag)".
- Cause: NS_rng (1230) is Park–Miller, and its first draw is seed × 16807 / (2^31 − 1). With TREE.seed 11 and v 0..35 that draw is 0.00009–0.00036. So the lag comes out at 0.00002–0.00009 of a season, which is 0.008–0.03 s (D.season is 360 s). The book means up to 90 s (TREE.lag 0.25 × 360). Checked with node.
- What happens: at every stage change (9 a year), every tree variant changes on the same frame. The staggered turning of the woods never happens.
- Only the art reads leafStage (treeArt, treeLook, nodeSprite, drawWoods), so this fix changes no match. The fix takes the second draw, which spreads the lags over 2.3–89.9 s (checked), and keeps one value per variant. That also ends a closure allocation on every call (see 4).
```diff
--- a/index.html
+++ b/index.html
@@ -826 +826 @@
-const leafStage = (v) => { const f = (yt() / D.season + NS_rng(TREE.seed + v)() * TREE.lag) % TREE.year; return TREE.stages.reduce((s, st, i) => (f >= st.from ? i : s), 0); }; // E777
+const LAG = [], leafStage = (v) => { const f = (yt() / D.season + (LAG[v] ??= ((r) => (r(), r()))(NS_rng(TREE.seed + v))) * TREE.lag) % TREE.year; return TREE.stages.reduce((s, st, i) => (f >= st.from ? i : s), 0); }; // E777
```

## 3. FRAMES: covers() builds a sprite for every building and node on the whole map, every frame, before checking whether it is on screen
- Where: index.html:1719–1720. This is outside my lines; I found it while tracing who calls the art.
- 1720: `const [x, y] = toScreen(...v), b0 = boxOf(spr(), x, y, f), [bx, by, bw, bh] = b0; if (bx > cw || ...) continue;`. Here `live` holds all of `rest()` = `things.filter((t) => !WOODS.has(t.kind))` (192). That is every building of every side, seen or not, plus every node that is not a tree.
- Cost each frame, zoomed in:
  - For every building: levelOf (arrays and a filter), a string key, and an SPR Map delete plus set.
  - For every node: leafStage (a closure and a reduce), a string key, and the same Map work.
- Zoom hitch: on each √2 zoom step, q in the sprite key changes. Every building and node sprite on the map is then drawn again in that one frame, not just the ones on screen.
- Unsure (an estimate; I did not measure it): late in a game at q 4, where a 3×3 building is about 111k px, the whole-map set can pass D.caches.sprites (16,000,000 px). fitCache would then evict sprites the same frame still needs, and they would be drawn again every frame.
- Fix: cull by the anchor first, with the margin rims() already uses at 1561. Things whose anchor is more than a screen away cannot reach the screen, because no sprite is a screen tall at any zoom. So the result is unchanged.
```diff
--- a/index.html
+++ b/index.html
@@ -1720 +1720 @@
-  for (const [u, v, spr, f, [i, j, n]] of live) { const [x, y] = toScreen(...v), b0 = boxOf(spr(), x, y, f), [bx, by, bw, bh] = b0; if (bx > cw || by > ch || bx + bw < 0 || by + bh < 0) continue;
+  for (const [u, v, spr, f, [i, j, n]] of live) { const [x, y] = toScreen(...v); if (x < -cw || y < -ch || x > cw + cw || y > ch + ch) continue; const b0 = boxOf(spr(), x, y, f), [bx, by, bw, bh] = b0; if (bx > cw || by > ch || bx + bw < 0 || by + bh < 0) continue;
```

## 4. FRAMES (small): nodeSprite keys every kind of node by leaf stage
- Where: index.html:1232 `sprite(kind + v + treeLook(v) + w, ...`, which uses treeLook from 827.
- What happens: rocks, bushes, fish and meat never change with the season. nodeArt (813–822) sends only trees to treeArt. They still get a new cache key at each of the 9 stages and at each snow change, so each (kind, v, scale) has up to 18 cached copies. Each is drawn again at every change, and leafStage runs for every node on every frame (for the whole map, because of item 3).
- Fix: use the stage in the key only for trees.
```diff
--- a/index.html
+++ b/index.html
@@ -1232 +1232 @@
-const nodeSprite = (kind, v, s, w = 1) => sprite(kind + v + treeLook(v) + w, 46 * w, 58, 17 * w, 54, 17 * w, 54, 0, s, () => { g.scale(w, 1); nodeArt(kind, v, NS_rng(11 + v * 7 + kind.length)); });
+const nodeSprite = (kind, v, s, w = 1) => sprite(kind + v + (kind === 'tree' ? treeLook(v) : '') + w, 46 * w, 58, 17 * w, 54, 17 * w, 54, 0, s, () => { g.scale(w, 1); nodeArt(kind, v, NS_rng(11 + v * 7 + kind.length)); });
```

## 5. PLAY: the Bar is drawn 26 wide on a footprint 20 wide
- Where: index.html:706 `tavern(c) { const r = block(26, 16, ...)`. block's depth defaults to w, so the drawing is 26 × 26, and the sign reaches x 9..14.
- The shells book gives BCR2 Bar `"size": "D8"`: 2 tiles, which is 20 units with D.tile 10. bldSprite takes `w = n * D.tile` (1234).
- What happens: the Bar spills past its tiles by 3 units on the left, 4 on the right (the sign) and about 2 in front. It covers whatever stands on the next tile. A tap on that tile can pick the Bar, because hitAt picks by the sprite's alpha. Every other 2-tile look is 20–22 wide: house block(20), tents 22, camp tower 20.
- Fix (play unchanged): scale the drawing to fit the footprint. The other way is to make the Bar D9 (3 tiles), which changes play and is Albert's call.
- Other width mismatches. I am unsure whether these are meant:
  - Town Center (keep block(50), base ±26) and Castle (`const w = 50`) on D11 = 60: drawn about 17% inside the footprint.
  - Tower tier 2 batter, `b = w + 5` = ±17, so 34 wide, and the tier 1 hoard roof at ±14, both on D8 = 20.
  - Aqueduct ±17/±18 (34–36) on 30.
  - War Council spears reaching ±18 (36) on 30.
```diff
--- a/index.html
+++ b/index.html
@@ -706 +706 @@
-tavern(c) { const r = block(26, 16, '#6b4a2c', 'timber', 'gable', SLATE, 9); const d = r.d; door(-5, d / 2, 5, 9, '#2a1a0c'); win(4, d / 2 - 6, 2.6, 2.6, '#e8b85a');
+tavern(c) { g.save(); g.scale(20 / 26, 20 / 26); const r = block(26, 16, '#6b4a2c', 'timber', 'gable', SLATE, 9); const d = r.d; door(-5, d / 2, 5, 9, '#2a1a0c'); win(4, d / 2 - 6, 2.6, 2.6, '#e8b85a');
@@ -708 +708 @@
-[9, d / 2 - 7], ], '#8a5a2a', LINE, 0.4, ); E_(11.5, d / 2 - 9, 1.6, 1.6, '#e8c860'); banner(-8, d / 2 - 14, c, 6); },
+[9, d / 2 - 7], ], '#8a5a2a', LINE, 0.4, ); E_(11.5, d / 2 - 9, 1.6, 1.6, '#e8c860'); banner(-8, d / 2 - 14, c, 6); g.restore(); },
```

## 6. PLAY: when placing a Hall, the build ghost never shows the player's civ
- Where: menu.js:331, with the hall art at index.html:634–642.
- menu.js:331: `FK.bldSprite(g.code, SIDES[ME].col, s, ...FK.levelOf({ code: g.code, side: ME }))` passes no fly and no civ. ART.hall gets `civ === undefined` and draws the generic hall: stone, plank, gable roof. Built halls are drawn with `SIDES[t.side].civ` (1561, 1592, 1719).
- What happens: a Mongol player places a Hall, sees a stone hall as the ghost, and a yurt goes up. It is the same mismatch for every civ:
  - Mali gets a mud hall with towers.
  - Roman gets plaster.
  - Han gets red walls and a hip roof.
  - Persian and Maurya get a different roof colour.
- The Hall (BP9) is on the Build menu; it is not in the SN3 offmenu list.
```diff
--- a/menu.js
+++ b/menu.js
@@ -331 +331 @@
-    ctx.stroke(); const sp = tinted(FK.bldSprite(g.code, SIDES[ME].col, s, ...FK.levelOf({ code: g.code, side: ME })), g.ok ? COL.rg : COL.rr), [gx, gy] = at(ci, cj); FK.tag(ctx, g.ok ? `${ECON.nameOf(g.code)} · ${costText(D.cost[g.code] || {})}` : g.why, gx, gy - sp.ay * s - P.lift * P.half); ctx.globalAlpha = P.ghost; FK.blit(sp, gx, gy, s); } // E699
+    ctx.stroke(); const sp = tinted(FK.bldSprite(g.code, SIDES[ME].col, s, ...FK.levelOf({ code: g.code, side: ME }), false, SIDES[ME].civ), g.ok ? COL.rg : COL.rr), [gx, gy] = at(ci, cj); FK.tag(ctx, g.ok ? `${ECON.nameOf(g.code)} · ${costText(D.cost[g.code] || {})}` : g.why, gx, gy - sp.ay * s - P.lift * P.half); ctx.globalAlpha = P.ghost; FK.blit(sp, gx, gy, s); } // E699
```

## 7. PLAY (latent): the Throne's roof tips are cut off
- Where: index.html:761 throne. The Sprites book has no `top` for it, so it gets the default 40.
- bldSprite: `top = BLDTOP[art] || 40, pad = 12` (1234). The canvas therefore starts at art y = −52.
- throne draws `g.scale(1.25, 1.25); ART.castle(c, o)`:
  - The castle's left tower apex is at −56 from the tower base at `d / 2 - 2`, with d = 50 × ART_T = 33.9. That is −41.1, ×1.25 = −51.3, and −55.2 after the 0.17 skew.
  - The throne spire apex, `d / 2 - 74` with d = 62 × ART_T, is at −53.0.
- So both points are cut flat, by 3.2 and 1.0 units, at every zoom. The castle has PB1 top 66; the throne has no entry.
- Latent: no code places BS1 yet (sides I7: "the Throne waits for Albert").
- Fix: add a book entry. 83 = the castle's 66 × the throne's 1.25. It is a tuning number; 44 or more would be enough. PB17 is free.
```diff
--- a/books/sprites.js
+++ b/books/sprites.js
@@ -23,0 +24 @@
+ "PB17": {"key":"throne","value":{"top":83},"name":"the throne building picture: ART.throne draws the castle 1.25 times, so the castle's top 66 × 1.25 (tuning: at least 44 stops the clip)","cite":["N151"],"law":[]},
```

## 8. PLAY (visual, small): snow flecks on a Yew land off its crown
- Where: index.html:842 and 866.
- For a 'lumpy' crown, env() rolls new random lumps on every call: `L = e.type === 'lumpy' ? Array.from({ length: TREE.lumps }, () => [cx + (r() - HALF) * ...`.
- The fleck loop calls env() once per fleck: `for (let i = TREE.flecks; i--; ) { const E = env(S.crown), ...; if (E.in(x, y))`. So each of the 26 flecks is tested against a different set of lumps from the one leaves() painted. Snow dots float beside the crown, and parts of the crown get none.
- Only the Yew is both evergreen and lumpy; the Cypress is a spindle. This happens at render time only, because the sprite is cached.
- Fix: one env per crown per paint, remembered inside treeArt. This also stops the gloss call from rolling the lumps again. It is art only and changes the pictures a little.
```diff
--- a/index.html
+++ b/index.html
@@ -842 +842 @@
-  const env = (e) => { if (e.type === 'ellipse' || e.type === 'lumpy') { const [cx, cy] = e.c, [rx, ry] = e.r, L = e.type === 'lumpy' ? Array.from({ length: TREE.lumps }, () => [cx + (r() - HALF) * rx * e.lump[0], cy + (r() - HALF) * ry * e.lump[1], rx * (e.lump[2] + r() * e.lump[3]), ry * (e.lump[2] + r() * e.lump[3])]) : [[cx, cy, rx, ry]], m = e.type === 'lumpy' ? e.lump[0] : 1;
+  const ENV = new Map(), env = (e) => ENV.get(e) ?? ENV.set(e, envOf(e)).get(e), envOf = (e) => { if (e.type === 'ellipse' || e.type === 'lumpy') { const [cx, cy] = e.c, [rx, ry] = e.r, L = e.type === 'lumpy' ? Array.from({ length: TREE.lumps }, () => [cx + (r() - HALF) * rx * e.lump[0], cy + (r() - HALF) * ry * e.lump[1], rx * (e.lump[2] + r() * e.lump[3]), ry * (e.lump[2] + r() * e.lump[3])]) : [[cx, cy, rx, ry]], m = e.type === 'lumpy' ? e.lump[0] : 1;
```

## 9. RULE (dead code)
- index.html:864 `S.pads.leaf || TREE.padLeaf`: S.pads is a JSON array (Pine: `[[-4.5,-22.5,4,1.8], ...]`), so `.leaf` is always undefined.
- index.html:813 `const n = { kind }` builds an object only to read `n.kind`; it should just use `kind`. That is a small rename, not in the diff.
- books/sprites.js:23 PB2 `{"key":"town","value":{"top":52}}`: no shell has the look "town" (the Town Center uses "keep"), and nothing reads SPRITE.town or BLDTOP.town.
- Every ART entry takes `o`, but bldSprite always passes 0 (`ART[art](col, 0, lv, civ, want)`). Only throne uses it, to pass it on to castle.
```diff
--- a/index.html
+++ b/index.html
@@ -864 +864 @@
-  if (S.pads) for (const [x, y, rx, ry] of S.pads) { leaves({ type: 'ellipse', c: [x, y], r: [rx, ry] }, col, 1, S.pads.leaf || TREE.padLeaf, TREE.padN); if (snow) { g.fillStyle = C.ground.snow; g.beginPath(); g.ellipse(x - HALF * HALF, y - ry * HALF, rx * TREE.tier.cap[0], ry * HALF, 0, 0, Math.PI + Math.PI); g.fill(); } }
+  if (S.pads) for (const [x, y, rx, ry] of S.pads) { leaves({ type: 'ellipse', c: [x, y], r: [rx, ry] }, col, 1, TREE.padLeaf, TREE.padN); if (snow) { g.fillStyle = C.ground.snow; g.beginPath(); g.ellipse(x - HALF * HALF, y - ry * HALF, rx * TREE.tier.cap[0], ry * HALF, 0, 0, Math.PI + Math.PI); g.fill(); } }
--- a/books/sprites.js
+++ b/books/sprites.js
@@ -23 +22,0 @@
- "PB2": {"key":"town","value":{"top":52},"name":"the town building picture","cite":["N151"],"law":[]},
```

---

## Checked and fine (to save other reviewers the trip)
- All of the art in 601–900 is drawn only inside sprite() caches: bldSprite, nodeSprite, figure, and the woods sheet. No line in this range draws on every frame.
- farm `crop[v]`: v = season(), which is 0..3. The four arrays are complete.
- tower `TOWER_LOOK[tier]`: there are 2 "tower" tier techs (O139, O140), so tier is 0..2.
- pasture: at D.flock.max (12) sheep the rows stay inside the plot.
- texture('mud') exists (540). Every hall civ is in words J26.
- Every look except the 4 traps has an ART entry. The camp looks are reached through D.camps; the Throne is not placed yet.
- Trees: col is used for tiers and pads only by evergreens, so no undefined colour reaches LG or shade. Tier n is 7 or 8, so there is no divide by zero. treeKindAt has kinds with weight above 0 for wet, plain and hill.
- figure(): the kit is part of the cache key, and KIT and RIM are reset in a finally.
