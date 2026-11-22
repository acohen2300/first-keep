# v-routes: review of 6505a7f8 (weighted A*, far search, NOWAY failure memory)

Snapshot /home/claude/rv (1d0379ea). Read-only. In the diffs, `…` stands for text that does not change. That keeps the very long lines readable.

Numbers I measured (node, on this 2-CPU box, at low priority). /tmp/v-routes/bench.js copies searchPath's heap and loop (index.html:1070-1082) onto the real world size, N = D.site / D.tile = 3960 / 10 = 396 (the whole world is 156,816 tiles). Land is the 306-tile board. A target that can't be reached means a failing search, and it **always ran to the 200,000 cap**: 200,000 pops, 93,206 distinct tiles (lazy-deletion duplicates more than double the pops), **73-109 ms**. With w = 1 it hits the cap after 74,274 tiles. The commit's own browser figure (50,000 tiles in 25 ms) also gives about 100 ms per failure. Before the change a failure cost 20,000 pops, about 10 ms. I don't have a phone figure, so it's unsure; expect slower.

Counts: CRASH 0 · PLAY 5 · FRAMES 2 · RULE 1.

---

## 1. PLAY: NOWAY survives a new match, so the same seed plays a different match
index.html:1069 `const NOWAY = new Map(); function findPath(…) { … if (NOWAY.get(key) > K.t) return null; … NOWAY.set(key, K.t + T.forget); …`
index.html:1780 `function start(sd, S = null) { FOR.fill(0); OCC.fill(0); … GATES.clear(); … K.t = K.snow = … = 0; …` resets game time (K.t is game time: index.html:1280 `K.t += dt`), but it never clears NOWAY.
index.html:1784 `restart: (daily) => { history.replaceState(…); start(); }`, called in place (no page reload) from menu.js:116, `FK.restart(o('daily'))`.

Scenario: a 50-minute match on today's daily seed. Near the end, a rival's wave is walled out of my town, so NOWAY holds `2|<code>|<cell>|<my TC tile>` with expiry about 3005. I press Start with the daily seed again: same map, same seats, same codes, K.t = 0. Every wave of that code leaving that cell for my TC now gets `null` with no search, for the first 50 minutes, even though no walls exist yet. march() sets `u.job = 'idle'; block(u)`. So the same seed gives a different match, and the result depends on what ran earlier in the page. tools/check.py can't see this because each `run.game` is a fresh page.
```diff
-function start(sd, S = null) { FOR.fill(0); OCC.fill(0); MARSH.fill(0); SEEN.clear(); …
+function start(sd, S = null) { FOR.fill(0); OCC.fill(0); MARSH.fill(0); NOWAY.clear(); SEEN.clear(); …
```

## 2. FRAMES: 200 soldiers at a building on an island freeze the game, and the memory doesn't stop the burst
- At the tap, combat.js:193 `L = convoy(sol, …ringOf(<shortest reach>, t))` runs one failing far search. Then combat.js:171 mark() → combat.js:168 routeK `FK.findPath(a, (q) => q === b, b, undefined, who)` runs with `b = kOf(t)`, the building's own tile. For any building whose style isn't 'Open', that tile is OCC 2 and never walkable (index.html:1013 `e.style === 'Open' ? 1 : 0`, 1018 `B[code][2] ? 3 : 2`, 1052 admits only 0 and 3), so this search **can never succeed**. That makes 2 × about 100 ms inside the tap handler.
- combat.js:193 `else u.rp = Math.min(CY.most, n * CY.stagger)` (D372: stagger 0.05, most 2). Soldiers 40-199 all come due on the **same tick**, 2.0 s later. Each one calls toward() (combat.js:78, `u.focus === t ? undefined : D.chase`), which is a far search.
- The key is `side|code|16-tile cell|near`, so dedup happens only within one code and one 16×16 cell. 200 soldiers cover about 2-3 cells each way. With 4 codes × 6 cells that's about 24 floods of about 100 ms each, roughly 2.4 s in one frame on this box (my estimate; the number of cells is a guess). Before the change, about 160 × 20k pops was about 1.6 s. So the burst isn't fixed, and with more codes or cells it's worse. E1309's "a band of fifty does not search fifty times" holds only per code per cell.
- Player soldiers then stop for good (see 4), so this is one freeze per order, and it comes back on every new order more than 5 s later.

Smallest fix: key on the area the failed search actually flooded instead of the 16-tile cell. Every tile popped in that search has `PF.done[k] === gen`, so one failure covers every soldier standing in that component, and soldiers across the water still search. This also makes D.tries.cell dead (remove it from D230). It goes together with the key change in 5:
```diff
-const NOWAY = new Map(); function findPath(from, goal, near, most, who = null) { if (most != null) return searchPath(from, goal, near, most, who); const T = D.tries, key = `${who ? who.side : ''}|${who ? who.code : ''}|${Math.floor((from % N) / T.cell)}|${Math.floor(from / N / T.cell)}|${near}`; if (NOWAY.get(key) > K.t) return null; const p = searchPath(from, goal, near, T.far, who); if (!p) { if (NOWAY.size > T.keep) NOWAY.clear(); NOWAY.set(key, K.t + T.forget); } return p; } // E1309
+const NOWAY = new Map(); function findPath(from, goal, near, most, who = null) { if (most != null) return searchPath(from, goal, near, most, who); const T = D.tries, key = `${who ? who.side : ''}|${who ? who.code : ''}|${near}|${WALKV}|${K.iceOn}|${K.flood > K.t}`, m = NOWAY.get(key); if (m && m.t > K.t && PF.done[from] === m.gen) return null; const p = searchPath(from, goal, near, T.far, who); if (!p) { if (NOWAY.size > T.keep) NOWAY.clear(); NOWAY.set(key, { t: K.t + T.forget, gen: PF.n }); } return p; } // E1309
```
(A search that hit the cap leaves some tiles unpopped. Soldiers on those tiles just search again, which is the safe side.)

## 3. FRAMES: walkers whose target differs per unit now pay 200k pops for every failure, and the memory never helps them
The far search applies to every caller that names no budget (index.html:1102-1108 walkTo/go/goBeside/goBy, wayLen 1110, march, routeK). The memory only pays off when the same side, code, cell and **near** repeat. These callers each have their own near:
- **Flee**, combat.js:126 `if (FK.go(u, FK.tileAt(u.bx + dx * MO.run * T, u.by + dy * MO.run * T))) u.then = 'rout';`. The tile 6 tiles away (D231 run) is never checked for walkability. Water, a building, the sea margin or off the board means an exact-tile goal that can never be met, so a full 200k search. A line "breaks together" (D231), so a line routed against a lake or a town means 10-20 soldiers × about 100 ms on **one tick**. Each then searches again every 5 s (NOWAY forget) while routing. Before, each was about 10 ms.
- **Wander**, index.html:1148 `const k = tileAt(u.bx + rnd(-D.reach, D.reach), …); if (walkable(k, u)) go(u, k);`. The spot is walkable but may be across a river. The far search now either walks the animal all the way round the lake to reach a spot 6 tiles away (D95 reach 60 = 6 tiles; that's odd play), or floods 200k when there's no way.
- Scout waypoints (combat.js:379), envoys (econ.js:493), traders (econ.js:397) and villagers (econ.js:151-152) work the same way, one near each.
- E1036's own text measured "2,009 of 2,149 searches in two minutes failed" in a four-side match, so failing searches are common in real play. Each one now costs about 10× more.

Smallest fix: give the two short walks back the pre-commit budget. Better still, restore `most = D.tries.way` as the default and pass `D.tries.far` only from toward-with-focus and convoy, the two places the commit was about.
```diff
-  if (FK.go(u, FK.tileAt(u.bx + dx * MO.run * T, u.by + dy * MO.run * T))) u.then = 'rout'; }
+  const k = FK.tileAt(u.bx + dx * MO.run * T, u.by + dy * MO.run * T); if (FK.walkable(k) && FK.walkTo(u, (q) => q === k, k, D.tries.way)) u.then = 'rout'; }
```
```diff
-… if (walkable(k, u)) go(u, k); } else u.wait -= dt; }
+… if (walkable(k, u)) walkTo(u, (q) => q === k, k, D.tries.way); } else u.wait -= dt; }
```
(D230's name now says D.tries.way is "the seal test of a wall ring". Update it.)

## 4. PLAY: the key ignores the goal, so archers are refused a target they could shoot
E1309 says failures are remembered per "goal", but the key holds `near`, which is only the heuristic's tile. Different goals that share a near collide:
- combat.js:193 runs the convoy on the **shortest-reach** soldier's ring (r = 1 for foot), but combat.js:90 `FK.findPath(lead.k, goal, near, undefined, lead)` stores the failure under the **lead's** code (the soldier nearest the middle, any code). combat.js:168, via mark(), stores the exact-tile failure under `u0.code` (sol[0]) with the same near, `kOf(t)`.
- Each archer's toward() (combat.js:78) searches its own ring, `r = Math.max(1, stat(u).rng)`, under key `0|archer|cell|kOf(t)`.
- Scenario: a rival tower just across a river narrower than archer range, and foot plus archers ordered at it. The foot ring is unreachable, so the convoy and routeK fail and are stored under the archer code (lead or sol[0] is an archer). Archers in the middle cells then get `null` from memory: combat.js:285 `befall(u.ord, 'no way'); u.target = null; u.job = 'idle'; …`. Their `u.focus` is still set, and combat.js:136 `if (look && !u.focus)` never runs, so they **stand until the tower falls**. Archers on the army's edges shoot. Before the change, every archer searched for himself.
- The same collision in one tick happens at combat.js:153 (E1036). `FK.go(u, hk)` fails, and the fallback `FK.walkTo(u, (q) => FK.walkable(q) && nearK(q, hk, AR.homeR), hk)` has the same key, so it is answered from memory and never searches (dead code whenever hk is walkable). The result does match E1036's words ("if no way leads there he is home where he stands").

Smallest fix: searches whose failure doesn't stand for the soldier's own goal name their budget, so they neither read nor write the memory:
```diff
-function convoy(S, goal, near) { const c = centreOf(S), lead = S.reduce((a, b) => (far(a, c) <= far(b, c) ? a : b)); return FK.findPath(lead.k, goal, near, undefined, lead); } // E1000
+function convoy(S, goal, near) { const c = centreOf(S), lead = S.reduce((a, b) => (far(a, c) <= far(b, c) ? a : b)); return FK.findPath(lead.k, goal, near, D.tries.far, lead); } // E1000
-function routeK(a, b, who, p0) { if (p0) [a] = p0; const p = a !== b && (p0 || FK.findPath(a, (q) => q === b, b, undefined, who)), …
+function routeK(a, b, who, p0) { if (p0) [a] = p0; const p = a !== b && (p0 || FK.findPath(a, (q) => q === b, b, D.tries.way, who)), …
```
(routeK is only an ETA ratio. With L null and a building target its search can never succeed, so the old 20k cap is enough. Skipping the search when `!FK.walkable(b)` would be better.)

## 5. PLAY: a remembered failure outlives a breach, a felled tree or new ice
The key and value don't look at walkability. WALKV is bumped by a wall or building taken down (index.html:1022 unbuild), a tree felled (1129) and a building raised (1018). Ice and floods change K.iceOn (1290) and K.flood. reach() (1085) keys on all of these for exactly this reason. NOWAY ignores them for 5 s.

Scenario: rams break the rival's wall, and I tap Attack on their town centre within 5 s of a refused attempt from the same cell. Every soldier gets 'no way' from memory and, as in 4, stands for good with focus kept. The same happens the day a lake freezes over.

Also: NOWAY isn't in the save (pack E681), so for up to 5 s after a save point a loaded game can play differently from playing straight through. That's minor.

Fix: the key in the diff for 2 (`|${WALKV}|${K.iceOn}|${K.flood > K.t}`). Unsure: gates. walkable() asks `fire('shut', gate, who)`, and I didn't confirm whether a gate's answer can change without a WALKV bump. The 5 s cap limits it either way.

## 6. PLAY: weight 1.5 equals D.woods.eta 1.5, so routes go straight through woods instead of round
index.html:1079 `g = G[k] + step + (inWoods(q) ? step * (D.woods.eta - 1) …)` and `push(q, g + TW * hx(q))`. A straight step into woods toward the goal adds 1.5 to g and takes 1.5 off TW·h, so f stays flat. Any step round the wood raises f. /tmp/v-routes/woods.js uses the same loop and woods term, with an 80-deep, 60-wide wood between start and goal:
- w=1: cost 184.9, 0 woods tiles (goes round)
- w=1.2: cost 200.0, 80 woods tiles
- w=1.5: cost 200.0, 80 woods tiles (straight through, 8% slower)

Albert's Timberland map is mostly forest. Orders and villagers will cut through woods they used to go round ("The woods slow the march and break the line", J47). That's visible. Unsure: the player's "stick to edges" ice cost (D351 edge 4) is weakened the same way, since any path within 1.5× of the best can be returned. The commit message says named budgets "stay exact", but TW applies to them too (join, D.chase, the seal test). Only their budget stays the same.

Fix (Albert's call, since it costs speed): weight only the far search and keep the exact search where it suffices. Thread `w` as searchPath's last argument and run exact first:
```diff
-function searchPath(from, goal, near, most, who) { // E90
-  const TW = D.tries.weight, EDGE = …
+function searchPath(from, goal, near, most, who, TW = 1) { // E90
+  const EDGE = …
-… const p = searchPath(from, goal, near, T.far, who); …
+… const p = searchPath(from, goal, near, T.way, who) || searchPath(from, goal, near, T.far, who, T.weight); …
```
This brings back up to 20k exact pops (the old 12-22 ms) on long ways before the weighted search runs.

## 7. PLAY: a march resumed by go() can never reach a building target, and now costs 200k
combat.js:150 `… else if (due(u.rp)) { u.rp = D.repath; if (!FK.go(u, u.goal)) u.job = 'hold'; }`. march() (combat.js:85) walks to `atK(k)`, which means "within 4 when k can't be stood on". This line asks for **exactly** u.goal. For a goal on a building tile (E237 waves; econ.js:455 hospital, 579 levy, 582 rebels all march to `FK.tileAt(<building>)`), the search can't succeed. It floods 200k (was 20k), the unit holds short of its goal, and it stores the failure under the same key march() uses. The logic was there before; the cost and the poisoning are new.
```diff
-… if (!FK.go(u, u.goal)) u.job = 'hold'; } }
+… if (!FK.walkTo(u, atK(u.goal), u.goal)) u.job = 'hold'; } }
```

## 8. RULE: book and comment text
- books/comments.js:176 E90: "…before giving up The search is weighted…" is missing a full stop. "Tiles it may open" is wrong: `n` counts heap pops including stale duplicates (200,000 pops opened 93,206 tiles above).
- D230 far = 200,000 is more than the whole world (156,816 tiles). "Four times that kept" is true only of pops. Name it as pops.
- E1309 says the key holds the "goal". It holds `near` (finding 4).
- N446 is marked "From memory, to open." The bound it cites isn't opened yet.

Checked and fine: K.t is game time (index.html:1280), and NOWAY is deterministic within one run. The key's `Math.floor(from / N / T.cell)` equals the row's cell. A missing entry compares `undefined > K.t`, which is false. A null `who` is handled. sealPath (econ.js:87) now names D.tries.way, so it never uses the memory. I found no crash.
