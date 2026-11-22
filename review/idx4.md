# idx4: index.html lines 901-1200 (snapshot /home/claude/rv @ 1d0379ea)

Reviewer idx4. Read-only. Line numbers are snapshot lines. Main focus: the path search changed in 6505a7f8 (weighted A*, the 200,000-tile far search, the NOWAY memory).

## The two questions, answered first

**Can one unit's failure wrongly block others of the same kind in the same cell?** Yes, in three ways. The key at 1069 is `side|code|16-tile block of from|near`. It leaves out the goal predicate. It leaves out the unit's own walk state (shy, crossing mode, standing on ice). And a 16-tile block can lie across a wall or water. See findings 2 and 1. One exception to your example: **at a single call site** the predicate never differs per unit. `byB(b)`, `nextTo(k)` and `atK(k)` depend only on the target. `ringOf` uses `stat(u).rng` with `const stat = (u) => FK.statRow(u.code, u.side)` (combat.js:8), which is the same for every unit of a code and side. Collisions come from **different call sites or groups that share a goal tile**, and from per-unit walk state.

**What does a failed far search cost?** It costs the whole connected area, in one sim step. N = 3960/10 = 396, so N² = 156,816, which is less than `far` = 200,000. The land is about 306² = 93,636 tiles (H < 0 outside B0..B1, line 93). So the 200,000 budget never stops a search: a search for a goal it cannot reach opens every walkable tile it can get to. I copied lines 1067-1082 (searchPath, around, the heap) into node on a 396² board with 85,698 walkable land tiles (/tmp/idx4/bench.js and bench4.js). One failed search took **156,208 heap pops, closed 85,673 tiles, 266 ms CPU (median of 5)**. The old 20,000 cap took 38 ms. A found 340-step way took about 1-2 ms. My copy's walkable() is cheaper than the real one (no iced, GATES, flooded or has() lookups), so the real cost is higher. A phone will be several times slower (an estimate; I did not measure on a phone). The 12 ms frame budget (D `step.budget`) is checked between steps, so it cannot cut a search short in the middle.

---

## 1. PLAY: NOWAY survives a new match and a load (index.html:1069, start() at 1780, load at 454)

Quoted:
- 1069: `const NOWAY = new Map(); function findPath(...) { ... if (NOWAY.get(key) > K.t) return null; ... NOWAY.set(key, K.t + T.forget); ...`
- 1780: `function start(sd, S = null) { ... GATES.clear(); ... K.t = K.snow = ... = 0; ...`

`NOWAY` appears only on line 1069. No `on('start')` or `on('load')` clears it.

Scenario: match 1 runs 40 min (K.t ≈ 2400). At K.t = 2398, a side-0 villager in the block next to its Town Center fails a way to the TC centre tile (for example, it was walled out). That sets the entry `0|<villager>|cx|cy|<TC centre>` = 2403. The player starts match 2 in the same page, and start() sets K.t = 0. makeBuildings puts each seat on the same corner tile every match (`corner(c, ...D.tc)`), so with the same civ the key is identical. For the first 2403 s (40 min) of match 2, every `goBy` to that TC by side-0 villagers in that block returns null at once. carry() then goes to `wait`, retries 2 s later, and gets null again. Loading an earlier save in the same session does the same for the time gap. This also breaks "same seed same match": a search's result depends on the matches played earlier in the page.

```diff
-const NOWAY = new Map(); function findPath(from, goal, near, most, who = null) {
+const NOWAY = new Map(); on('start', () => NOWAY.clear()); on('load', () => NOWAY.clear()); function findPath(from, goal, near, most, who = null) {
```

## 2. PLAY: the NOWAY key ignores the goal predicate and the walker's own state (index.html:1069; 1049, 1050)

(a) **Different predicates, same goal tile, same key.** combat.js:193 is `L = convoy(sol, ...ringOf(sol.reduce((a, b) => (stat(a).rng <= stat(b).rng ? a : b)), t))`, and convoy() (combat.js:90) calls `FK.findPath(lead.k, goal, near, undefined, lead)`. The predicate comes from the shortest-reach soldier, but the key uses `lead.code`. Scenario: archers and spearmen are told to attack a tower across a 2-tile moat. The spearman's ring of 1 tile cannot be reached, so the search fails. If the lead is an archer, the entry `ME|archer|block|tower centre` is set. Within 5 s the player sends only the archers. Their ring, at their own reach, can be reached from the bank, but the search returns null and they say "no way". goBy (ring 1, line 1108), wayLen (ring 1, 1110) and toward (ring = reach) all use the building's centre tile as `near`. So does march `atK(k)` (exact tile, or within 4 tiles) when the tapped tile k is that centre. So they can block each other the same way.

(b) **Per-unit walk state is not in the key.** onIceOk (1049) reads `who.shy > K.t`, `iceChoice(who)` and `onIce(who)` ('fail' or 'safe' load). woodsIn (1050) reads `iceOf(who) === 'around'`. iceShy (combat.js:63) sets `v.shy = K.t + D.season` on every unit of the side that is alive at the crack, so units trained later are not shy. Scenario: in winter after a crack, a shy spearman's way over the ice fails. For 5 s, new non-shy spearmen in the same block ordered to the same tile also get null. A group set to "around" (menu.js:135 `u.ice = m`) blocks same-kind units on "normal" the same way.

(c) **The block lies across a barrier.** Scenario: a villager stands outside a closed wall ring, or across a channel, in the same 16×16 block as villagers inside. Its search to the TC fails cheaply. The villagers inside then get null for 5 s. carry() (econ.js:152) retries every `SR.again` = 2 s (D197), so the outside villager sets the entry again about every 6 s. Villagers inside that block can rarely start a carry to that drop-off. (Unsure: the exact retry path after `wait`.)

Smallest fix for (a) and (b): put the walk state in the key, and use the memory only for goals that carry a tag. The shared factories get tags. An untagged goal still searches, but is not remembered.
```diff
-const NOWAY = new Map(); function findPath(from, goal, near, most, who = null) { if (most != null) return searchPath(from, goal, near, most, who); const T = D.tries, key = `${who ? who.side : ''}|${who ? who.code : ''}|${Math.floor((from % N) / T.cell)}|${Math.floor(from / N / T.cell)}|${near}`;
+const NOWAY = new Map(); function findPath(from, goal, near, most, who = null) { if (most != null) return searchPath(from, goal, near, most, who); if (!goal.tag) return searchPath(from, goal, near, D.tries.far, who); const T = D.tries, key = `${who ? `${who.side}|${who.code}|${who.shy > K.t}|${iceChoice(who)}|${onIce(who)}` : ''}|${goal.tag}|${Math.floor((from % N) / T.cell)}|${Math.floor(from / N / T.cell)}|${near}`;
-const nextTo = (k) => (q) => Math.abs((q % N) - (k % N)) <= 1 && Math.abs(Math.floor(q / N) - Math.floor(k / N)) <= 1 && q !== k;
+const nextTo = (k) => Object.assign((q) => Math.abs((q % N) - (k % N)) <= 1 && Math.abs(Math.floor(q / N) - Math.floor(k / N)) <= 1 && q !== k, { tag: 'n' });
-function go(u, k) { return walkTo(u, (q) => q === k, k); } // E94
+function go(u, k) { return walkTo(u, Object.assign((q) => q === k, { tag: 'k' }), k); } // E94
-const byB = (b, r = 1) => (q) => { const i = q % N, j = (q - i) / N; return i >= b.i - r && i < b.i + b.n + r && j >= b.j - r && j < b.j + b.n + r; }, goBy = ...
+const byB = (b, r = 1) => Object.assign((q) => { const i = q % N, j = (q - i) / N; return i >= b.i - r && i < b.i + b.n + r && j >= b.j - r && j < b.j + b.n + r; }, { tag: 'b' + r }), goBy = ...
```
In combat.js, give `atK` the tag `'a'` and the ringOf predicates `'r' + r`, so orders keep the memory. (c) needs a decision: keying on the exact `from` tile stops the cross-barrier block, but then each straggler of a band pays its own full search (finding 3).

## 3. FRAMES: a far search that fails opens the whole area in one step (index.html:1069, 1076)

The numbers are in the answer at the top. These cases pay the full cost, once per (side, code, block, goal tile) every 5 s:
- told attacks on a town behind walls (gates are shut to foes: combat.js:309 `FK.on('shut', (side, u) => !u || isFoe(side, u))`), and each straggler's own search (march; toward with focus)
- gathering at a find that cannot be reached (econ.js:151): once per find per side per `D.noPath` (60 s)
- Wander (1148) to a walkable tile in another area
- the news delay (menu.js:400), which has no walker (see finding 5)

An AI siege of a walled town, with 3 kinds spread over 4 blocks, is 12 full searches every 5 s.

Smallest fix: give a budget back to the background callers whose failure is harmless. Wander is an idle hop of 6 tiles or less. The news delay already falls back to straight distance. Orders keep the far search.
```diff
-      if (u.wait <= 0) { u.wait = -D.wait * Math.log(1 - rng()); const k = tileAt(u.bx + rnd(-D.reach, D.reach), u.by + rnd(-D.reach, D.reach)); if (walkable(k, u)) go(u, k); } else u.wait -= dt; }
+      if (u.wait <= 0) { u.wait = -D.wait * Math.log(1 - rng()); const k = tileAt(u.bx + rnd(-D.reach, D.reach), u.by + rnd(-D.reach, D.reach)); if (walkable(k, u)) walkTo(u, (q) => q === k, k, D.tries.way); } else u.wait -= dt; }
-... wayLen = (k, b, who) => { const p = byB(b, BAND)(k) ? [k] : findPath(k, byB(b), tileAt(b.bx, b.by), undefined, who);
+... wayLen = (k, b, who, most) => { const p = byB(b, BAND)(k) ? [k] : findPath(k, byB(b), tileAt(b.bx, b.by), most, who);
```
(menu.js:400 would pass `undefined, D.tries.way`.) The full fix is a cheap reachability test before the far search: `reach()` and `reached()` at 1084-1090 already flood fill from the seat. That is a design call, and unsure: reach() uses the side's first unit as its walker, so its idea of what can be walked can differ from the searching unit's.

## 4. PLAY: "one at a time" waits on every unit of yours in any woods or on any ice, anywhere on the map (index.html:1037-1038)

Quoted: `for (const v of units) if (v !== u && v.side === u.side && inCross(v)) { n++; ... } return near || (R.most && n >= R.most);` and `inCross = (u) => onIce(u) || inWoods(u.k)` (1051).

E787 says "one at a time waits while others of yours are on the ice". The code also counts any of your units standing on a woods tile anywhere on the map. Scenario: on Timberland, crossing mode "one" (most 1). A soldier reaches the shore of a frozen lake while woodcutters work inside a forest across the map. `n` is never 0, so holdBack stays true and the soldier waits at the shore for as long as anyone is in the woods. Unsure whether woods were meant to count for an ice crossing (E874 says the modes are shared), but E787 names only the ice.
```diff
-  for (const v of units) if (v !== u && v.side === u.side && inCross(v)) {
+  for (const v of units) if (v !== u && v.side === u.side && (iced(w) ? onIce(v) : inWoods(v.k))) {
```

## 5. PLAY: a search with no walker treats every forest and every gate as a wall (index.html:1050, 1052; menu.js:400)

`woodsIn = (who) => !!(who && who.code && ...)` is false for null, and the 'shut' handler `!u || isFoe(side, u)` is true for null, so every gate is shut, your own included. menu.js:400 calls `FK.wayLen(FK.tileAt(at.bx, at.by), h)` with no walker, so the news delay routes around every forest and through no gate. On a forest map the event is often unreachable: the far search fails (finding 3), and the delay falls back to straight distance. Or it finds a long detour that a villager would never walk. Fix: give the search a real walker.
```diff
-  if (lvl < need || !h) return null; const L = FK.wayLen(FK.tileAt(at.bx, at.by), h);
+  if (lvl < need || !h) return null; const L = FK.wayLen(FK.tileAt(at.bx, at.by), h, FK.units().find((u) => u.side === ME && FK.has(u, 'Gather')));
```

## 6. FRAMES: the building grid is rebuilt from every thing on every sim step (index.html:1150, 1168)

`step()` ends with `regrid(); collide();`, and `regrid = () => { UG = grid(units, D.grid.unit); SG = grid(things.filter((t) => t.kind === 'bld'), D.grid.bld); SGn = things.length; }`. That filters about 10,400 trees and finds (D345: 2586 trees a corner) and builds a new Map, 30 times a second (D step hz 30). Buildings change only when TV changes. bldsNear already rebuilds the grid lazily when the count changes.
```diff
-let UG = new Map(), SG = new Map(), SGn; const regrid = () => { UG = grid(units, D.grid.unit); SG = grid(things.filter((t) => t.kind === 'bld'), D.grid.bld); SGn = things.length; };
+let UG = new Map(), SG = new Map(), SGn, SGv = NaN; const regrid = () => { UG = grid(units, D.grid.unit); if (SGv !== TV || SGn !== things.length) { SG = grid(things.filter((t) => t.kind === 'bld'), D.grid.bld); SGv = TV; } SGn = things.length; };
```
(Unsure: load() should bump TV or reset SGv. It calls regrid() at 454 after replacing things.)

## 7. FRAMES: spotFor on a building scores every ring spot against every unit (index.html:1122, 1125)

For a building, `d = c.kind ? Math.hypot(...) : i` and `if (!c.kind && best) break;` never fires (kind is 'bld'). So it walks all RINGS + 1 rings: RINGS = ceil(0.525 × √180) = 8, about 650 spots for a 4-tile building. For each spot, `vacant()` runs `units.some(...)` over every unit, plus a tileAt that allocates. That is about 0.5M checks per call, and combat.js:175 (`walkTo(v, p)` → toSpot) calls it per villager when a group is sent to a building. Unsure how often in play. Smallest fix: stop at the first free spot, as on the lattice. This picks the first free spot on the nearest ring rather than the nearest spot overall, a small play change.
```diff
-    if (vacant(u, p) && (!best || d < best.d)) best = { c, x, y, d }; if (!c.kind && best) break; }
+    if (vacant(u, p) && (!best || d < best.d)) best = { c, x, y, d }; if ((!c.kind || c.kind === 'bld') && best) break; }
```

## 8. RULE: chosen numbers in code (index.html:1097, 1175, 1178, 1179, 1194)

- 1097 `t: roll() * 10`
- 1175 `stamp(t.bx, t.by, (t.n / 2 + 3) * D.tile, ...)`
- 1178 `inZ4(bx, by, 2 * D.tile)`
- 1179 `stamp(bx, by, 3 * D.tile, ...)`
- 1194 `moving = a.mps > 0.1`

Each should live in a book. Example:
```diff
-  const b = blowOf(a.code), moving = a.mps > 0.1, ms = ...
+  const b = blowOf(a.code), moving = a.mps > D.jolt.moving, ms = ...
```
(Plus `"moving": 0.1` in the D jolt entry, marked as tuning.) The sprite painters in 901-1008 (helm, weapon, shield, horse, quad, caravan, wagon) also draw from literal coordinates and colours in code, while the `draw` brushes take theirs from books/sprites.js through sketch() (E367). This is a rule-direction note only; it is too large for one diff.

## 9. Unsure, robustness: `splice(indexOf(x), 1)` with no check for -1 (index.html:1022 unbuild, 1132 take, 1185 vanish)

If a thing or unit is removed twice, `indexOf` returns -1 and `splice(-1, 1)` removes the **last** element of `things` or `units`, which is some unrelated object. The callers I checked guard against this (econ.js:234 `!alive(t)`; 1368 `!u.gone`), so I could not show a path that reaches it.
```diff
-const vanish = (u) => { u.gone = true; units.splice(units.indexOf(u), 1); }
+const vanish = (u) => { u.gone = true; const i = units.indexOf(u); if (i >= 0) units.splice(i, 1); }
```
(Same guard for unbuild and take.)

---
Checked and fine: the weighted A* with a closed set and no reopening still gives a way at most 1.5 times the best, because every step costs at least its length, so the octile h is admissible. A path of 1 (walkTo `at = min(1, len-1)`) is fine. from = -1 does not crash: typed-array writes at -1 are ignored, and `hAt(-1)` gives NaN, so there are no neighbours. I measured the heap's destructuring swaps against temp-variable swaps in alternating runs and found no difference, so that is not a finding.
