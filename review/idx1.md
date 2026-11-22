# idx1: index.html lines 1-300 (map making, books loading, helpers)

Snapshot: /home/claude/rv (1d0379ea), read only. Node was used only on the books and on two loops copied to /tmp/idx1.

**Counts:** CRASH 0 · PLAY 5 (2 of them marked unsure) · FRAMES 1 · RULE 4 (10 findings)

I found no crash path in lines 1-300. Every `// E` code in the range (92 of them) exists in comments.js. Every `D.*` / `A.*` path the range reads exists. No code is used in two books (the CODE map, line 39), and no book has duplicate keys or a key that is also a prefix of another (fromBook, line 37). A prefix clash like that would throw under 'use strict'.

---

## 1. PLAY: index.html:263 (openWays), with :1780 (start) and :1338. A new game's map and units are made while K.flood still holds the last game's flood

Lines relied on:
- 263: `const n = k + d, w = cost[k] + FOR[n]; if (!walkable(n) || fixed.has(n) || w >= cost[n]) continue;`
- 1052: `const walkable = (k, who) => … && !(flooded(k) && !(who && stat('', who.side, 'flood')));`
- 1347: `const flooded = (k) => K.flood > K.t && H[k] > 0 && BANK[k] <= FLD.rise`
- 1780: `function start(sd, S = null) { … K.t = K.snow = K.fds = K.gfd = … = 0; … makeGround(…); makeUnits(dice(seed + 1)); fire('start'); …`. K.flood is not reset here.
- 1338: `on('start', () => { RUTS.fill(0); Object.assign(K, { ahead: [], flood: -Infinity, …`. This is the only reset, and it fires after makeGround and makeUnits.
- 102 / 1349: BANK is rebuilt by makeShore, which runs after makeThings (and so after openWays).

**Scenario.** A flood fires in game 1 (`flood()` sets `K.flood = K.t + 90`). Albert then starts a new game (FK.restart, which calls start()). start() sets K.t to 0 but leaves K.flood at, say, 2090, so `K.flood > K.t` is true through all of makeGround and makeUnits. BANK still holds the old map at that point. As a result, every land tile of the new map within FLD.rise (4) tiles of the **old** map's rivers and lakes counts as flooded, which means not walkable. Four things read that:
- the openWays search (263)
- the wild groups' spot tries (1178-1179, `!walkable(k)`)
- the find guards (near1 at 1356, called from guard() at 1182)
- the boar (1175)

A refused try shifts `roll` for everything after it. The same seed on a fresh page has no stale flood, so animals and guards stand elsewhere. That breaks "same seed, same match". The same thing happens after loading a save made after any flood (load assigns S.K) and then starting a new game.

**Unsure:** whether the woods openWays cuts (FOR, so `things` and a save's BASE0 indices) differ on a real map. The lattice woods rarely force a cut. Units are saved whole, so they load fine either way.

**Fix** (adds one name to the existing reset chain; fresh-page maps don't change). Line 1780 is one long line; only `K.flood = ` is added:
```diff
-function start(sd, S = null) { … seenErr.clear(); K.t = K.snow = K.fds = K.gfd = K.wet = …
+function start(sd, S = null) { … seenErr.clear(); K.t = K.flood = K.snow = K.fds = K.gfd = K.wet = …
```
With K.flood and K.t both 0, flooded() is false. The start hook still sets K.flood to -Infinity afterwards.

## 2. PLAY: index.html:829 (treeKindAt, called from makeTrees at :247). Every tree counts as standing on the plain, so Willow never grows

Lines relied on:
- 829: `const h = H[k], where = h > D.land ? 'hill' : h < TREE.wet ? 'wet' : 'plain', …`
- 179: `if (k < 0 || H[k] !== D.land || …) continue;`. Lattice trees only go on H === D.land.
- 193: `const flatAt = (k) => k >= 0 && H[k] >= D.land && …`. Grove trees (cluster) need free(), which needs flatAt.
- Every write to H (lines 93, 130, 137, 153, 156, 241; nothing in the other files) keeps H ≤ D.land (24). The hills live only in RELIEF (143-144).

So every tree tile has H === 24, and `where` is always `'plain'`. In the sprites book (PT1, trees.kinds), Willow is `{"wet":4}`, which gives it plain weight 0: it is never chosen. Spruce, Fir, Pine, Cypress and Yew come only from their small plain weights, about 7.5%, 3.8%, 7.5%, 2.3% and 3.8% of all trees. E774 says the kind is "weighed by where it stands (wet low ground, the plain, the hills)".

**Fix** (smallest; it changes the look of every map, so talk first). Read the drawn relief, which has the hills and hollows:
```diff
-function treeKindAt(k, roll) { const h = H[k], where = h > D.land ? 'hill' : h < TREE.wet ? 'wet' : 'plain', W8 = TREE.kinds.map((s) => s.where[where] || 0), sum = W8.reduce((a, b) => a + b), x = roll() * sum; // E774
+function treeKindAt(k, roll) { const h = RELIEF[k], where = h > D.land ? 'hill' : h < TREE.wet ? 'wet' : 'plain', W8 = TREE.kinds.map((s) => s.where[where] || 0), sum = W8.reduce((a, b) => a + b), x = roll() * sum; // E774
```
The number of roll() calls is the same, so no other roll moves.

**Unsure:** what share of trees would become hill or wet with RELIEF. The thresholds D.land and TREE.wet were set against H. MTWI (the wetness index, line 153) may be the truer test for 'wet'.

## 3. PLAY: index.html:266 (lay). A carcass goes on the end of `things`, so it is drawn on top of everything in front of it

Lines relied on:
- 266: `const lay = (kind, bx, by, amount) => { put(kind, tileAt(bx, by), rng); return Object.assign(things.at(-1), { amount }); };`
- 199 (put): `things.push({ kind, k, bx, by, vx, vy, amount, size, v })`
- 229: `things.sort((a, b) => a.vy - b.vy); // E50` (drawn back to front)
- 1729-1730: `for (const t of things) { while (n < us.length && us[n].vy <= t.vy) unit(us[n++]); …`. This merge assumes `things` is sorted by vy. build() keeps that order with a splice (E710); lay() does not.

**Scenario.** A villager kills a boar (combat.js:68 `FK.lay('meat', t.bx, t.by, D.meat[t.code])`). The meat is last in `things`, so it is painted after every tree, building and unit. It covers the villagers standing in front of it (south of it) and any tree there. The same happens after a load, because things keep their saved order.

**Fix** (the same as E710):
```diff
-const lay = (kind, bx, by, amount) => { put(kind, tileAt(bx, by), rng); return Object.assign(things.at(-1), { amount }); }; // E345
+const lay = (kind, bx, by, amount) => { put(kind, tileAt(bx, by), rng); const t = Object.assign(things.pop(), { amount }), at = things.findIndex((x) => x.vy > t.vy); things.splice(at < 0 ? things.length : at, 0, t); return t; }; // E345
```

## 4. FRAMES (load): index.html:98-100 (makeGround, the drawn corners, E21). Five new arrays and a sort at each of 157,609 grid corners

Line relied on, 99: `const round = [[ci - 1, cj - 1, 3], …].filter(…).map(([i, j, slot]) => [dh(i, j), (j * N + i) * 4 + slot]).sort((a, b) => a[0] - b[0]);`

This runs on every new map and on every save load (start → makeGround). I copied the loop into node with a 396 × 396 test height field (/tmp/idx1/bench2.js). The CPU is shared, so the times are rough: **311 ms → 51 ms** warm (658 → 181 ms cold), and CH came out identical (0 of 627,264 slots differ).

**Fix:**
```diff
-  for (let cj = 0; cj <= N; cj++) for (let ci = 0; ci <= N; ci++) {
-    const round = [[ci - 1, cj - 1, 3], [ci, cj - 1, 2], [ci - 1, cj, 1], [ci, cj, 0]].filter(([i, j]) => i >= 0 && j >= 0 && i < N && j < N).map(([i, j, slot]) => [dh(i, j), (j * N + i) * 4 + slot]).sort((a, b) => a[0] - b[0]);
-    for (let a = 0; a < round.length; ) { let b = a + 1; while (b < round.length && round[b][0] - round[b - 1][0] <= REPOSE) b++; let sum = 0; for (let q = a; q < b; q++) sum += round[q][0]; for (let q = a; q < b; q++) CH[round[q][1]] = sum / (b - a); a = b; }
-  }
+  const ROUND = [[-1, -1, 3], [0, -1, 2], [-1, 0, 1], [0, 0, 0]], hs = [], ix = [];
+  for (let cj = 0; cj <= N; cj++) for (let ci = 0; ci <= N; ci++) {
+    let m = 0; for (const [di, dj, slot] of ROUND) { const i = ci + di, j = cj + dj; if (i < 0 || j < 0 || i >= N || j >= N) continue; const h = dh(i, j), at = (j * N + i) * 4 + slot; let p = m++; while (p && hs[p - 1] > h) { hs[p] = hs[p - 1]; ix[p] = ix[p - 1]; p--; } hs[p] = h; ix[p] = at; }
+    for (let a = 0; a < m; ) { let b = a + 1; while (b < m && hs[b] - hs[b - 1] <= REPOSE) b++; let sum = 0; for (let q = a; q < b; q++) sum += hs[q]; for (let q = a; q < b; q++) CH[ix[q]] = sum / (b - a); a = b; }
+  }
```
The insertion sort keeps equal heights in the same order as the old sort, so the grouping is the same.

## 5. PLAY (unsure whether intended): index.html:178 (makeForest). Each corner's tree lattice runs to MID, the site's centre coordinate, instead of half the board

Line relied on, 178: `for (let v = D.edge + FR.edge; v < MID; v += FR.step) for (let u = D.edge + FR.edge; u < MID; u += FR.step) { … [bx, by] = corner(c, tu, tv) …`

u and v are distances from the board corner: corner() adds them to CORNERS[c], which sit at B0/B1. MID is `D.site / 2` = 1980, while half the board is `D.board / 2` = 1530. So each corner sows its lattice 450 units past the centre lines into its neighbours' quarters. The 900-wide cross through the middle gets two lattices (four in the centre square, minus the D.middle disc), so about twice the candidate trees.

It is the same for every side, so it is fair. But it mixes a site coordinate with a corner offset. Changing it changes every map, and FR.trees (2586, "the top trees a corner") was tuned against the current bound. Albert's call.
```diff
-    for (let v = D.edge + FR.edge; v < MID; v += FR.step) for (let u = D.edge + FR.edge; u < MID; u += FR.step) {
+    for (let v = D.edge + FR.edge; v < D.board / 2; v += FR.step) for (let u = D.edge + FR.edge; u < D.board / 2; u += FR.step) {
```

## 6. PLAY (unsure how much it matters): index.html:222. Robbers' camps skip the open-ring test that E674 asks of every guarded find

Lines relied on:
- 222: `const k = nearest(MID + ax * d * D.tile, MID + ay * d * D.tile, TR.find * D.tile); if (~k) { put('camp', k, fr); clearing('camp', …`
- 216: spot() also requires `open(kind, bx, by)` for every other guarded find (the ring of FN.ring + 1 tiles is all land with no find on it, line 215).
- E674: "it is laid only where the ring is open land".
- The camp is MG7, whose finds row has `"guard":["MH3",4]`.

**Scenario.** A camp's nearest free tile is beside a river, a lake or a Z4 pile. Its 4 guards are laid by guard() (1182-1183) through near1(), which looks within FN.ring tiles for a walkable tile. The guards can bunch up, or one can be dropped (`if (~k)`). I did not trace how often this happens.

**Fix:** give nearest() an optional test and have the camp pass the ring test:
```diff
-const nearest = (bx, by, r) => { let best = null; stamp(bx, by, r, (k, d) => { if (free(k) && (!best || d < best[0])) best = [d, k]; }); return best ? best[1] : -1; }; // E44
+const nearest = (bx, by, r, ok = free) => { let best = null; stamp(bx, by, r, (k, d) => { if (ok(k) && (!best || d < best[0])) best = [d, k]; }); return best ? best[1] : -1; }; // E44
-  … const k = nearest(MID + ax * d * D.tile, MID + ay * d * D.tile, TR.find * D.tile); …
+  … const k = nearest(MID + ax * d * D.tile, MID + ay * d * D.tile, TR.find * D.tile, (q) => free(q) && open('camp', ...at(q))); …
```
This changes where camps stand on some seeds, so talk first.

## 7. RULE: numbers chosen in code (rule 1)

- 71: `fractal(roll, 10, 1.25)`, twice (the coast's wave count and dimension). 75: `clamp((out - 0.2) / 0.3, 0, 1)` (where cliffs start and end).
- 125-126 (wanderLine): `fractal(roll, 6, 1.3)` and `t += 4 / len`. The road entry D379 cites "the paths' own wander, 6 at 1.3" as if a book held it, but none does. Meanwhile D345's `bends: 3` ("three winding paths (bends bends …)") is read nowhere (grep finds 0 uses).
- 162 (fords): `i % 10 === 0`, `R.pts.length * 0.3`, `* 0.7`.
- 201 (reachOf): `+ 1.5 * D.tile`.
- 209: `dice(seed ^ 0x9e3779b9)`. The other two map seeds (LS.seed, FN.seed) are in the books; this one is not.
- 216: `t < 200`, although D.tries.spot (100) exists and spot3 (209) uses it.
- 197 (put): `v = Math.floor(roll() * 3)` (the sprite variant count; the sprites book has TREE.variants = 3).
- 138 and 1024: `for (let c = 0; c < 4; c++)`, where the rest of the file uses RING.length or CORNERS.forEach.

**Fix:** one book entry each, keeping today's values so maps don't move. For example:
```diff
-  const spot = (r, roll2 = roll, kind = null) => { for (let t = 0; t < 200; t++) {
+  const spot = (r, roll2 = roll, kind = null) => { for (let t = 0; t < D.tries.find; t++) {
```
plus `"find": 200` (with its reason) in the value of D230 in books/measure.js. The other numbers follow the same pattern.

## 8. RULE: one value, five homes for "half" (rules 1 and 12)

- 91 and 198: a literal `0.5` for the tile middle.
- 137/140: `half = 1 / 2`.
- 167 (forest jitter) and 220 (trade seat tiles): `D.place.half`, which belongs to the placement UI.
- 291 (grass blade lean and odds) and 294 (cloud octave weights): `TREE.half`, which belongs to the tree sprites. Tuning a tree's look would change the grass and the clouds.

**Fix:** use one entry everywhere (the drawing code already has `DRW.half` = D.draw.half), or a measure entry for the tile middle.

## 9. RULE: dead code

- 269: stratum's `h >= D.land + D.bare ? DT` branch, 279: STRATA's last band `[D.land + D.bare, Infinity, DT]`, and 829: treeKindAt's `'hill'`. None of these can happen, because H ≤ D.land everywhere (see #2), so the band from 24 to 36 and above (D.bare = 12) is never reached. E52 and E55 still describe "bare dirt again high over the land".
- D345 `bends` is never read (see #7).
- E38's text still describes "a wall round every home at D50 … none in Z1 and Z2", which E720 says is gone.

**Fix:** remove the branch and the band, or feed them RELIEF (see #2). Rewrite E38.

## 10. RULE: prose comments in the page (comments should be codes)

- 11: `/* the slot and the gap come from the Screen book (SN1), set by menu.js */`
- 14: `/* the floors' own readout, kept for the tests; the glass (menu.js) is what is seen */`

**Fix:** replace each with `/* E… */` and move the text to books/comments.js.

---

### Checked and fine
- heapQ (131); the priority flood, flow and channel trace (146-153); lake fill (158-159); river trace (160); the A* road legs (234-236; the Euclidean guide never overestimates because every step costs at least 1); Chaikin rounding (237); the chamfer sweeps (242-243, 273-276). All correct.
- Map making draws all its randomness from `dice(seed …)`. No Math.random, Date.now or performance.now feeds a rule. The performance.now in drawClouds (296) only affects the look.
- Rec.put's `o.s.push(...c)` (285): renderGround passes one subpath per call, so there is no risk of too many arguments.
- `put(…, k = -1)` (an off-map tile) can't come from lay(), because prey always stands on the grid.
- RD.clear = 48.77 tiles looks huge but is right: D379 is Winchester's 200 ft at 8 units/m.
