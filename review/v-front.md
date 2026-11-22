# v-front: review of 5ef6bc4a (attack a group by its front line) and 141c5f48 combat.js (Fall back)

Snapshot /home/claude/rv at 1d0379ea. Read-only. Nothing was run (no game, no check.py), so every claim below comes from reading the code. Anything I could not prove is marked "unsure".

Counts: CRASH 0 · PLAY 6 · FRAMES 1 · RULE 1

---

## Live lead: front_line went from "lost 0, killed 15" (branch alone) to "lost 20, killed 1" (merged)

### What I could rule out from the code

| Candidate | Verdict | Evidence |
|---|---|---|
| fallTick on the order beat | **Ruled out** | It only collects units with `u.fall` set: `for (const u of units()) if (u.fall && alive(u)) ...` (combat.js:233). `fall` is only ever set in fallBack (combat.js:232, the only `fall:` writer in the source). The front_line test never falls back. |
| alarm / prep / shelter (econ.js) | **Ruled out** | `fright` only runs for gatherers: `if (FK.has(u, 'Gather') && SIDES[u.side]) fright(u, ...)` (econ.js:249). `alarm`, `prep` and `shelter` only take `villagersOf(ME)` or units the bell picks (econ.js:291-313), and they only run when the player taps (menu.js:113). `watch()` (econ.js:318-321) only sets `FK.near` and a message. |
| AI plan (ai.js E1400-E1407, combat.js `loot`) | **Does not steer either army** | The test makes its wave with `WAR.attack(2, P, FOES)`, which sets `waves[2]` with no `S`. So decideWar takes the `if (w) return;` at ai.js:149, and `loot` returns on `waves[o]` (combat.js:368). **But** `deal()` changes what side 2 builds and trains from t=0, and every spawn draws from the shared dice (`u.cd = FK.rng()`, combat.js:266). So the 40 units the test spawns at 10 s get different jitter and first cooldowns. This is not the same match as the branch run (unsure how much that alone moves the result). |
| Kite line (E1541, combat.js:284) | **Too small to explain it** | It now checks the 3 points of the step-back line instead of only the end, so archers step back less often. It cannot stop foot from striking. |
| Route change (6505a7f8, merged into main *before* the front-line merge, so it was never in the branch run) | **No disabling path found; it changes how the foes arrive** | (a) toward() for a focused target now goes through the "no way" memo (index.html:1069). When the memo answers null, the soldier hits the `'no way'` branch at combat.js:285 (`u.target = null; u.job = 'idle'; u.rp = 3 * D.repath`). The band re-targets him the next tick, but he won't path again for 3 s, and the memo keeps answering null for 5 s for every soldier of the same type in the same 16-tile cell going for the same man. This only happens after a search really *fails*. On open ground with a 200,000-tile budget I found no failing case. (b) The 1.5 weighting changes the shape of **every** path, including the foes' convoy road. All 20 foes walk one road `L` (dress, combat.js:101 then `lineUp(u, to, join(u, L, to), i)`, combat.js:107) to P, and P is our own foot's tile. So the way the foes arrive differs from the branch run. |

### Most likely mechanism (unsure: needs one logged run)

The band rule decides the fight. Nerve then makes the result all-or-nothing, and the merged changes flip which side wins.

1. **Each soldier only ever strikes "his man", even while someone else is hitting him.** E1565 (combat.js:133) overwrites the target every tick: `const B = u.ord && u.ord.band; if (B) { const f = onFront(u, look); if (f) t = u.focus = f; }`. Because `u.focus` is always set, the free choice `if (look && !u.focus) { ... bestFoe ... }` (combat.js:136) never runs. The fight loop (combat.js:283-285) only hits `u.target`. A foe striking him who is not his man is never answered. The comrade-help rule in hit() (E1019, combat.js:58) also skips him (`!v.target`).
2. **The "front" is measured from our own band's middle, not from the soldier.** `near: Math.min(...F.map((v) => gap(c, v)))` (combat.js:179) and `gap(B.c, v) <= B.near + FR.deep` (combat.js:180). In this test the foes' goal is our foot's own tile (`WAR.attack(2, P, FOES)` in check.py SET). They walk into our middle, so the "front" becomes the few foes deepest in our middle. All 20 of ours share those few men: archers pile arrows on 1-2 men, and men at the edges ignore whoever hits them.
3. **While the group is still coming, a soldier whose man is out of reach stands still** (E1566, combat.js:154: `if (B && B.come && ... d(t) > s.rng ...) { u.path = null; u.rp = D.repath; }`). The back ranks of a 20-man block keep walking toward their goal, our middle. So `come` (combat.js:179, middle moving more than 0.2 tiles/s toward us over 1 s) can stay true after the front ranks are already fighting.
4. **Nerve makes it all-or-nothing.** Each loss drains every comrade within 10 tiles by `1 / (D.breakAt × (near+1))` (combat.js:67), with breakAt 0.3. So roughly the first 6 losses break a 20-man band. Routing men take 1.5× damage and are captured after 2 s (caught, combat.js:317). "Lost 0, killed 15" and "lost 20, killed 1" are the two outcomes where one side broke first: 20/1 means we lost about 6 men before killing a second. A change in how the foes arrive (route weighting) or in the dice (AI plan) can flip one outcome into the other.

So I believe the 20/1 result is the band's weakness (points 1-3) showing up once the approach changed, not a new bug in the merged code. The front_line rule ("we lost fewer than they did", one seed) is a single sample of an all-or-nothing fight. It can flip for unrelated reasons, so it is a poor tool for bisecting.

**How to confirm (for whoever may run the game):**
- Set `D.tries.weight` to 1 in books/measure.js D230 (no code change) and rerun front_line. Then separately revert E234's `undefined` to `D.tries.way`.
- In one run, log once a second for our 20: how many have `u.target` in reach, how many were struck in the last second (`hitT`) by a foe that is **not** their `u.target`, `u.ord.band.come`, and the first second any of ours has `job === 'rout'`.

If point 1 is confirmed, the fix is finding 4 below.

---

## Findings (best first)

### 1. PLAY: an order given during a Fall back is undone by fallTick; Retreat within 1 s
**combat.js:232-234, 97, 171; menu.js:101, 129**

fallBack stores `fall: F, fb: Infinity` (combat.js:232). Nothing except fallTick ever clears them. Not homeAll (`Object.assign(u, { job: 'rout', routAt: null, target: null, goal: null, ... ord: null, ... })`, combat.js:97), not mark (combat.js:171), not Hold (menu.js:129 `{ path: null, goal: u.k, job: 'hold', target: null, ord: null }`), not the wall or the ambush.

fallTick fires once nobody in the group has `status === 'march'`: `if (!G.some((u) => status(u) === 'march')) { ... Object.assign(u, { fall: null, fb: null }); if (L.length) fight(u, <nearest of L>, true); }` (combat.js:234), on every 1 s beat (combat.js:286, HU.beat = 1).

**Scenario:**
- Tap Fall back, then Retreat. homeAll makes them `job: 'rout'` with `routAt: null`, so status is 'rally', not 'march'. At the next beat every one of them turns and attacks the nearest enemy they had left.
- Hold does the same within 1 s.
- Move or Wall: they arrive at the new spot, then walk back into the old enemy.
- Attack on a building or a lone man is switched to the old enemy.
- Until fallTick runs, they also keep `fb: Infinity`. They cannot rout (combat.js:120) and take ×0.7 blows (combat.js:54), even on the new order. Fall back followed by Move gives an army that cannot break.

**Fix:** leave the fall back once anything else has taken the soldier. Remember the fall-back spot; a set `ord` or a changed `goal` means a new order.
```diff
--- a/combat.js
+++ b/combat.js
@@ -232,3 +232,3 @@
-  for (const u of G) Object.assign(u, { fall: F, fb: Infinity, focus: null, ord: null, sent: false }); return G.length; } // E1432
-function fallTick() { const by = new Map(); for (const u of units()) if (u.fall && alive(u)) (by.get(u.fall) || by.set(u.fall, []).get(u.fall)).push(u); // E1433
+  for (const u of G) Object.assign(u, { fall: F, fb: Infinity, fk: u.goal, focus: null, ord: null, sent: false }); return G.length; } // E1432
+function fallTick() { const by = new Map(); for (const u of units()) if (u.fall && alive(u)) { if (u.ord || u.goal !== u.fk) { Object.assign(u, { fall: null, fb: null }); continue; } (by.get(u.fall) || by.set(u.fall, []).get(u.fall)).push(u); } // E1433
```
(`u.goal` is the dress spot from lineUp; a mid-march fight puts it back via `u.was`. Edge case left open: Hold tapped while standing exactly on the fall-back tile. E1432/E1433 text needs a word.)

### 2. PLAY: Fall back near any map edge sends the soldiers to the map's top-left corner
**combat.js:231; index.html:113; combat.js:84, 101**

The spot is `FK.tileAt(f.bx + dx * out * T, f.by + dy * out * T)`, with `out` = the foes' longest reach + 4 × 1.5 tiles, so 7-13 tiles past the foe. Off the map, tileAt returns -1 (`return i < 0 || j < 0 || i >= N || j >= N ? -1 : j * N + i;`, index.html:113). The old code guarded this (`march(u, FK.walkable(k) ? k : u.k)`); the new code passes it straight to `dress(G, -1)`.

In dress, `convoy(S, atK(-1), -1)` uses `atK(k) = (q) => q === k || nearK(q, k, FK.walkable(k) ? 0 : 4)` (combat.js:84). Since walkable(-1) is false, nearK(q, -1, 4) is true for every tile with column ≤ 3 and row ≤ 3 (`-1 % N` is -1 and `Math.floor(-1 / N)` is -1).

**Scenario:** soldiers fighting with their backs a few to about 12 tiles from any edge tap Fall back. The spot lands `out` tiles past the foe, so off the map. All of them march to the 4×4 tiles at the grid's (0,0) corner (columns 0-3, rows 0-3). If that corner can't be reached, a 200,000-tile search runs and they all go idle (finding 3). The `loose` volley at combat.js:238 has the same off-map pattern, older.

**Fix:** see the combined diff under finding 3.

### 3. PLAY: a Fall back that cannot reach its spot leaves the soldiers idle beside their foes, and the note says "no enemy near"
**combat.js:231, 101; menu.js:101**

When dress fails it does `for (const u of S) u.job = 'idle'; return false;` (combat.js:101), and fallBack returns 0. Comment E1431 says "or nothing happens when they cannot get there". In fact every picked soldier's job is set to idle while `target`/`focus` are kept. The fight loop skips anyone not in 'fight' (`if (u.job !== 'fight') continue;`, combat.js:282). Brain does not restart the fight: `if (t && u.target !== t)` (combat.js:148) is false, because the target did not change. So a soldier with a told target stands idle next to it until it dies or leaves sight. The menu also shows `CW.why.noFoe` for r = 0 (menu.js:101), which is the wrong message here.

**Fix** (also fixes finding 2):
```diff
--- a/combat.js
+++ b/combat.js
@@ -231 +231 @@
-  const out = Math.max(...F.map((v) => stat(v).rng)) + FB.ranks * GR.gap, [dx, dy] = dir(c.bx - f.bx, c.by - f.by); if (!dress(G, FK.tileAt(f.bx + dx * out * T, f.by + dy * out * T))) return 0; // E1431
+  const out = Math.max(...F.map((v) => stat(v).rng)) + FB.ranks * GR.gap, [dx, dy] = dir(c.bx - f.bx, c.by - f.by), k = FK.tileAt(f.bx + dx * out * T, f.by + dy * out * T), was = G.map((u) => u.job); if (k < 0 || !dress(G, k)) { G.forEach((u, n) => (u.job = was[n])); return 0; } // E1431
```
A separate "can't get there" note needs a new Words entry, which is Albert's call (Rule 10).

### 4. PLAY (design; likely behind the front_line flip): a soldier on a band order never answers a foe striking him unless that foe is his man
**combat.js:133, 136, 154, 179-180**

See points 1-3 of the lead above.

**Scenario:** a 20-man block pushes into our band. Our men at the edge are hit by foes who are not "on the front" (the front is measured from our band's middle). They don't strike back, and while the block is still coming they don't move either.

**Smallest fix:** let a man answer whoever just struck him if that foe is of the group and within his reach. This changes the agreed rule, so it needs Albert's OK. Recency uses D.scan; there is no new number.
```diff
--- a/combat.js
+++ b/combat.js
@@ -180 +180 @@
-function onFront(u, look) { const B = frontOf(u.ord), F = B.c ? B.live.filter((v) => enemies(u, v) && gap(B.c, v) <= B.near + FR.deep) : []; if (!look && F.includes(u.focus)) return u.focus; return F.reduce((a, v) => (!a || gap(u, v) < gap(u, a) ? v : a), null); } // E1564
+function onFront(u, look) { const B = frontOf(u.ord), h = u.hitBy; if (B.c && h && K.t - u.hitT < D.scan && B.live.includes(h) && enemies(u, h) && edgeDist(u, h) <= stat(u).rng) return h; const F = B.c ? B.live.filter((v) => enemies(u, v) && gap(B.c, v) <= B.near + FR.deep) : []; if (!look && F.includes(u.focus)) return u.focus; return F.reduce((a, v) => (!a || gap(u, v) < gap(u, a) ? v : a), null); } // E1564
```
(`hitBy`/`hitT` are set on the victim by `harm`, index.html:1100.)

Related, also unsure: the claim "one rule for every side" only holds on paper. Only `order()` makes a band (combat.js:195), and the computer sides never call `order()`; ai.js uses `WAR.attack`/`dress`. So in play, only the player's soldiers fight by the front.

### 5. FRAMES: every band soldier filters the whole group with enemies() on every tick, not only on looks
**combat.js:180**

`F = B.c ? B.live.filter((v) => enemies(u, v) && gap(B.c, v) <= B.near + FR.deep) : []` runs before the `if (!look && F.includes(u.focus)) return u.focus;` shortcut, so it runs every tick. 100 soldiers against a 100-man group means 10,000 enemies() calls (each with an inSight check) per tick.

Also, frontOf runs `units().filter((v) => v.ord === O ...)` (combat.js:178) once per band order per tick. And the convoy plus per-soldier join paths that order() builds toward the tapped man (combat.js:193) are thrown away on the next tick by `u.path = null` (combat.js:148).

**Fix:** work out the front once per tick in frontOf, and test enemies() only when choosing.
```diff
--- a/combat.js
+++ b/combat.js
@@ -179,2 +179,2 @@
-  const c = centreOf(us), f = centreOf(F), [dx, dy] = dir(c.bx - f.bx, c.by - f.by), dt = K.t - B.t0; if (dt >= FR.span) Object.assign(B, { come: ((f.bx - B.f.bx) * dx + (f.by - B.f.by) * dy) / T / dt > FR.come, f, t0: K.t }); return Object.assign(B, { c, near: Math.min(...F.map((v) => gap(c, v))) }); } // E1563
-function onFront(u, look) { const B = frontOf(u.ord), F = B.c ? B.live.filter((v) => enemies(u, v) && gap(B.c, v) <= B.near + FR.deep) : []; if (!look && F.includes(u.focus)) return u.focus; return F.reduce((a, v) => (!a || gap(u, v) < gap(u, a) ? v : a), null); } // E1564
+  const c = centreOf(us), f = centreOf(F), [dx, dy] = dir(c.bx - f.bx, c.by - f.by), dt = K.t - B.t0, near = Math.min(...F.map((v) => gap(c, v))); if (dt >= FR.span) Object.assign(B, { come: ((f.bx - B.f.bx) * dx + (f.by - B.f.by) * dy) / T / dt > FR.come, f, t0: K.t }); return Object.assign(B, { c, near, front: F.filter((v) => gap(c, v) <= near + FR.deep) }); } // E1563
+function onFront(u, look) { const B = frontOf(u.ord), F = B.c ? B.front : []; if (!look && F.includes(u.focus)) return u.focus; return F.reduce((a, v) => (enemies(u, v) && (!a || gap(u, v) < gap(u, a)) ? v : a), null); } // E1564
```

### 6. PLAY: after a save and load mid-Fall-back, each soldier goes back in alone
**combat.js:232-233; index.html:429-433**

E1432 relies on "one shared list, so the group is known", and fallTick groups soldiers by that array's identity (`by.get(u.fall)`). pack only de-duplicates plain objects: `if (v.constructor === Object) { if (seen.has(v)) return void twice.add(v); ... }` (index.html:429). Arrays are written out once per holder (`if (!k || v.constructor !== Object || ids.has(v)) return v;`, index.html:433). So after a load every soldier has his own copy of the list, fallTick sees groups of one, and each soldier turns back in as soon as he himself stops, instead of the group re-forming first.

**Fix:** share a plain object (these round-trip through the own/same tags).
```diff
--- a/combat.js
+++ b/combat.js
@@ -232,3 +232,3 @@
-  for (const u of G) Object.assign(u, { fall: F, fb: Infinity, focus: null, ord: null, sent: false }); return G.length; } // E1432
+  const fl = { foes: F }; for (const u of G) Object.assign(u, { fall: fl, fb: Infinity, focus: null, ord: null, sent: false }); return G.length; } // E1432
 function fallTick() { const by = new Map(); for (const u of units()) if (u.fall && alive(u)) (by.get(u.fall) || by.set(u.fall, []).get(u.fall)).push(u); // E1433
-  for (const [F, G] of by) if (!G.some((u) => status(u) === 'march')) { const L = F.filter(alive); ...
+  for (const [F, G] of by) if (!G.some((u) => status(u) === 'march')) { const L = F.foes.filter(alive); ...
```
(Line 232 is also changed by finding 1's diff. Combine the two by hand: `fall: fl, fb: Infinity, fk: u.goal, ...`.)

### 7. PLAY (unsure how often): the "no way" memo is shared by soldiers who could in fact get through
**index.html:1069; combat.js:78, 285**

The key is `${who.side}|${who.code}|<16-tile cell of from>|${near}`. It leaves out the goal test and the walker's own state: `iceChoice(who)`, `onIce(who)` (which picks the 'fail' or 'safe' load, E1540), `who.shy > K.t`, and woods access (`woodsIn` depends on `iceOf(who)` for side 0). Since today, toward() sends every focused chase through this memo (`u.focus === t ? undefined : D.chase`, combat.js:78), and the band makes every soldier focused.

**Scenario:** one soldier who is shy of ice after a crack fails to find a way to a man across the ice. For 5 s every soldier of the same type in that 16-tile cell gets null for the same man and takes the `'no way'` branch (`u.target = null; u.job = 'idle'; u.rp = 3 * D.repath`, combat.js:285), although they could cross.

**Fix:** put the walker's own pathing state into the key.
```diff
--- a/index.html
+++ b/index.html
@@ -1069 +1069 @@
-... const T = D.tries, key = `${who ? who.side : ''}|${who ? who.code : ''}|${Math.floor((from % N) / T.cell)}|...
+... const T = D.tries, key = `${who ? who.side : ''}|${who ? who.code : ''}|${who ? [iceChoice(who), onIce(who), who.shy > K.t] : ''}|${Math.floor((from % N) / T.cell)}|...
```
Leaving the goal test out of the key also means `go(u, k)` and `toward()` to a man standing on k share one entry. That is low risk, because a man cannot stand on an unwalkable tile.

### 8. RULE: dead comment codes
**books/comments.js E1302, E1304**

No `// E1302` or `// E1304` is left anywhere in the code. E1304's last use was replaced by `// E1442` on the FLOATS line in today's 141c5f48 (menu.js). E1302 has had none since 773424b2.

**Fix:** delete both entries from books/comments.js, or re-point them if they are meant to stay.

---

## Checked and fine
- **Band:** no crash path found. frontOf guards `!F.length || !us.length` before `Math.min(...)`. A converted foe drops out through `v.side === B.side`. Saving and loading O.band works: O is shared through `u.ord`, so the own/same tags keep it together and its arrays sit inside it.
- **Fall back:** `fb: Infinity` survives a save as `{TG.num: 'Infinity'}` (index.html:431).
- No Math.random, Date.now or performance.now in the new sim code. The only performance.now in combat.js is the drawing dash offset (combat.js:261).
- No new chosen numbers in the reviewed lines beyond counting. All new codes (E1309, E1400-E1407, E1430-E1436, E1500-E1505, E1520-E1521, E1540-E1541, E1560-E1567) are present in comments.js.
