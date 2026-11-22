# combat.js review (reviewer "combat"), snapshot /home/claude/rv at 1d0379ea

I read all of combat.js, plus the parts of index.html (findPath/NOWAY, walkTo, unitsNear, pack, start) and tools/check.py (front_line) that it relies on. I did not run anything. Line numbers are from the snapshot.

Counts: PLAY 8 (finding 5 is in index.html), FRAMES 6, RULE 1, CRASH 0.

---

## The front_line lead (after the merge: ours lost 20 of 20 and killed 1; on the helper's branch 5ef6bc4a: lost 0, killed 15)

Between 5ef6bc4a and the merge 022dc04b, 6505a7f8 is the only commit that changes the simulation. It does three things to this fight:

1. **Band soldiers now use the far search and the NOWAY memory.** E1565 (combat.js:133) sets `t = u.focus = f` on every tick. So in `toward` (combat.js:78), `u.focus === t ? undefined : D.chase` always picks `undefined` for a band soldier, and findPath goes down the NOWAY branch (index.html:1069). On the branch the same call passed `D.tries.way`, a named budget with no memory.
2. **Every search is now weighted by 1.5** (index.html:1079, `push(q, g + TW * hx(q))`), including named budgets: the foes' chases (`D.chase`) and the convoy joins (`CY.tries`). Path shapes change for both sides: weighted A* walks diagonally first, then straight.
3. **convoy() uses the far search** (combat.js:90).

**What it cannot do by itself:** on open ground, every `toward()` search succeeds under either budget. The goal is a man's 8 neighbours, or a 9-tile square for an archer, and that is always reachable. NOWAY only acts after a search has failed:
`const p = searchPath(...); if (!p) { ... NOWAY.set(key, K.t + T.forget); }`
So points 1 and 3 change nothing in this fight unless some search fails.

**If a search fails, this is the mechanism (it is in the code; unsure whether it fires in this test):**
- The key is `side|code|16-tile start cell|near`, and `near` is the man's tile (`ringOf` returns `t.k`).
- One soldier's failed search answers "no way" for 5 s to every soldier of his kind in his 16x16 square who aims at the same man. E1564 gives many soldiers the same nearest front man, so a whole squad shares one key.
- Each of them then runs combat.js:285, `befall(u.ord, 'no way'); u.target = null; u.job = 'idle'; u.rp = 3 * D.repath;`.
- On the next tick E1565 aims him at the same man again (line 148: `fight(u, t, true); u.path = null`). He stands for 3 s, asks again, and NOWAY answers null again while the man stays on that tile, which he does while fighting.
- The squad stands still. It strikes only men who walk into reach, which fits "killed 1".
- Before the merge, each soldier searched again himself, with no memory.

**One way a search can fail mid-battle (unsure):** E1541 (combat.js:284) lets an archer step back in a straight line `[[x, y]]`. It checks only 3 sample points, spaced 0.93 tiles apart, and never checks cut corners, which `around()` forbids. So he can end on a tile that pathfinding cannot leave, and every search from there fails. Before the merge, that cost only him. Now his failure is remembered under his key, so every archer of his kind in his 16-tile square aiming at the same man freezes as described above.

**Other ways the weighting alone (point 2) can flip a 20 v 20:**
- The band's targeting is sensitive to geometry: soldiers ignore anyone who hits them from outside "the front" (finding 9).
- The tapped man is never part of his own group (finding 4).
- An archer's square ring leaves him outside his reach (finding 3).

A change in approach shape can turn 15:0 into 1:20 through any of these. This is unproven.

**A cheap check for whoever may run the test (I may not):**
1. Add `MINE.map((u) => u.ord && u.ord.ev)` to LOOK. E1296 counts `'no way'` on each order. If it is above 0, the NOWAY loop above is the cause.
2. If it is 0, run front_line at 022dc04b with only `D.tries.weight` set to 1 in books. If ours win again, the cause is the weighting acting through the band's geometry.

Smallest code change that gives band soldiers back the branch's exact budget (no memory), while a single ordered target keeps the far search:

```diff
--- a/combat.js
+++ b/combat.js
@@ -78 +78 @@
-..., toward = (u, t) => { return FK.walkTo(u, ...ringOf(u, t), u.focus === t ? undefined : D.chase); }; // E234
+..., toward = (u, t) => { return FK.walkTo(u, ...ringOf(u, t), u.focus !== t ? D.chase : u.ord && u.ord.band ? D.tries.way : undefined); }; // E234
```

---

## Findings (best first)

### 1. PLAY: Fall back takes over any later order: Retreat, Attack, Move, Wall, Ambush (combat.js:232-234)
**What happens:** fallBack sets `fall: F, fb: Infinity`, and no other order clears them.
- `order()` (182), `mark()` (171), `homeAll()` (97), `DIRECTS.wall` (236) and `ambushAt` (254) all leave `fall` and `fb` alone.
- fallTick runs every beat: `for (const [F, G] of by) if (!G.some((u) => status(u) === 'march')) { ... fight(u, L.reduce(...nearest...), true); }`.

**Scenario:** tap Fall back, then Retreat. homeAll sets `job: 'rout', routAt: null`, so status() is `'rally'`, not `'march'`. At the next beat each soldier gets `fight(nearest old foe, true)` with focus. `fight()` keeps the home path, so he walks home, then goes back out at the enemy.
- An Attack order is taken over at the next beat: its status is `'fight'`, not `'march'`.
- A Move order is taken over on arrival.
- Until then `fb = Infinity` also means no rout and blows at FB.hit (0.7).

```diff
--- a/combat.js
+++ b/combat.js
@@ -97 +97 @@
-function homeAll(S) { for (const u of S) { const h = home(u.side); Object.assign(u, { job: 'rout', routAt: null, target: null, goal: null, then: 'idle', ord: null, sent: false, drill: null, wall: false, amb: null, hid: false, esc: null });
+function homeAll(S) { for (const u of S) { const h = home(u.side); Object.assign(u, { job: 'rout', routAt: null, target: null, goal: null, then: 'idle', ord: null, sent: false, drill: null, wall: false, amb: null, hid: false, esc: null, fall: null, fb: null });
@@ -171 +171 @@
-... Object.assign(u, { ord: O, mvT: K.t }); } ...
+... Object.assign(u, { ord: O, mvT: K.t, fall: null, fb: null }); } ...
@@ -236 +236 @@
-... for (const u of S) Object.assign(u, { wall: true, focus: null, target: null, ord: null }); ...
+... for (const u of S) Object.assign(u, { wall: true, focus: null, target: null, ord: null, fall: null, fb: null }); ...
@@ -254 +254 @@
-  for (const u of S) Object.assign(u, { target: null, focus: null, ord: null, hid: false }); dress(S, q, 'square'); ...
+  for (const u of S) Object.assign(u, { target: null, focus: null, ord: null, hid: false, fall: null, fb: null }); dress(S, q, 'square'); ...
```

### 2. PLAY: a refused route freezes soldiers in the middle of a fight (combat.js:101)
`if (!drill && !L) { for (const u of S) u.job = 'idle'; return false; }` changes the job but leaves `u.target` set.

**Scenario:** soldiers are fighting on a shore. One of these happens:
- the player taps Move or Fall back to a spot the convoy can't reach (or whose key NOWAY remembers), or
- an AI `attack()` route fails.

Each soldier is now `'idle'` (or `'hold'` via line 152) with a live target. In brain, the next look keeps him on the same man (`if (cur && (... d(cur) <= s.rng ...)) c = cur`). `if (t && u.target !== t)` is then false, so `fight()` is never called again. The tick loop skips him (`if (u.job !== 'fight') continue;`), so he does not strike back. E1019 doesn't wake him either, because it needs `!v.target`. This lasts until his man dies or he switches to another one.

Also, `attack()` (98) sets `waves[side]` and returns `army.length` even when dress failed, so the AI believes a wave is out.

```diff
--- a/combat.js
+++ b/combat.js
@@ -98 +98 @@
-function attack(side, k, army = orders(side)) { if (!army.length) return 0; waves[side] = { n0: army.length, k, t: 0, hp: 0 }; dress(army, k); if (side === ME) ...
+function attack(side, k, army = orders(side)) { if (!army.length || !dress(army, k)) return 0; waves[side] = { n0: army.length, k, t: 0, hp: 0 }; if (side === ME) ...
@@ -101 +101 @@
-function dress(S, k, form, drill) { const L = drill ? null : convoy(S, atK(k), k); if (!drill && !L) { for (const u of S) u.job = 'idle'; return false; } ...
+function dress(S, k, form, drill) { const L = drill ? null : convoy(S, atK(k), k); if (!drill && !L) return false; ...
```
(A refused order now leaves everyone as they were, which is what the "no way" line already tells the player.)

### 3. PLAY: square goal ring against a round reach, so archers and siege stop out of reach and stand there (combat.js:78 vs 283-285)
**The mismatch:**
- The goal is a square: `(q) => q !== t.k && nearK(q, t.k, r)` for a man, and `i >= t.i - r && i < t.i + t.n + r && ...` for a building. `nearK` is `|di| <= r && |dj| <= r`.
- Reach is a circle: `edgeDist(u, t) <= hillReach(s.rng, ...) + 0.5`.

**The numbers:** an Archer (UM2) has rng 9.5, so the ring runs to 9 tiles each way and reach on flat ground is about 10 tiles.
- Approaching a man at an angle, the first ring tile found is around offset (6,9), 10.8 tiles away, up to (9,9), 12.7 tiles.
- Approaching a building, the ring corner is 8.5 tiles each way from the footprint corner, 12.0 tiles.

**The loop:** out of reach, so line 285 calls `toward()`. Its first pop is his own tile, which is in the ring, so the path is `[u.k]` (E93). He walks to his tile's middle, waits 1 s, and repeats.
- Against a building this is forever: archers sent at a town centre from the south-west never shoot.
- Against a man it lasts while the man stays on his tile.

Melee is safe: rng 1.2 gives a reach of 1.7, which covers the diagonal at 1.41.

```diff
--- a/combat.js
+++ b/combat.js
@@ -78 +78 @@
-const ringOf = (u, t) => { const r = Math.max(1, stat(u).rng); return [t.kind === 'bld' ? (q) => { const i = q % N, j = (q - i) / N; return i >= t.i - r && i < t.i + t.n + r && j >= t.j - r && j < t.j + t.n + r; } : (q) => q !== t.k && nearK(q, t.k, r), t.kind === 'bld' ? FK.tileAt(t.bx, t.by) : t.k]; }, toward = ...
+const ringOf = (u, t) => { const r = Math.max(Math.SQRT2, stat(u).rng); return [(q) => q !== t.k && edgeDist(mid(q), t) <= r, t.kind === 'bld' ? FK.tileAt(t.bx, t.by) : t.k]; }, toward = ...
```
- This measures from the tile's middle with the same `edgeDist` the reach check uses.
- √2 keeps a man's 8 neighbours as goals.
- Footprint tiles count as goals but are never stepped on.
- `mid()` allocates once per tested tile. That is fine for chase-length searches; it could be inlined if wanted.

### 4. PLAY: the tapped man is never in his own group (combat.js:177)
`FK.unitsNear(t, ...)` skips `from` (index.html:1169: `if (v !== from && ...)`), so `G` never holds `t`.
- If you tap the man at the front, the band fights the nearest of the others, and he hits them unanswered (see finding 9).
- A man with one comrade gets `G.length === 1`, so the result is `null`, "alone". This contradicts E1561, which says one man alone is no group, but two men are a group.

```diff
-const FR = D.front, bandOn = (u0, t) => { const G = []; FK.unitsNear(t, FR.group * T, ...
+const FR = D.front, bandOn = (u0, t) => { const G = [t]; FK.unitsNear(t, FR.group * T, ...
```

### 5. PLAY/RULE: NOWAY survives a new match and a load (index.html:1069, 1780)
**The problem:** `start()` resets `K.t = 0` and clears FOR/OCC/GATES/SEEN..., but never `NOWAY`.
- An entry from the last match, `K.t + T.forget` (say minute 40, so 2,405), says "no way" for that side, unit kind, start square and goal tile for the first 40 minutes of the next match, on a different map. Seats sit in the same corner zones (D2), so town-centre goals can repeat.
- The same seed then plays differently depending on what was played before it in the tab, which breaks the "same seed same match" rule.
- `run.game` taps Start and then calls `fk.reset(seed)`, so entries from the first start can also leak into the first 5 s of the tested match.

```diff
--- a/index.html
+++ b/index.html
@@ -1780 +1780 @@
-function start(sd, S = null) { FOR.fill(0); OCC.fill(0); ...
+function start(sd, S = null) { NOWAY.clear(); FOR.fill(0); OCC.fill(0); ...
```
(`load()` runs inside `start(null, S)`, so loads are covered too.)

### 6. PLAY: the NOWAY key ignores the goal, so E1036's fallback is dead (combat.js:153; key at index.html:1069)
E1309 says the memory is "per side, kind, start area and goal", but the key uses `near`, not the goal. Searches with different goals and the same `near` share one answer.

**At line 153:**
1. `if (FK.walkable(hk) && FK.go(u, hk)) ...` runs first. `walkable` here has no `who`, so it can pass for a tile this unit can't reach.
2. When that exact search fails, it stores NOWAY for `near = hk`.
3. The fallback right after it, `else if (FK.walkTo(u, (q) => FK.walkable(q) && nearK(q, hk, AR.homeR), hk))`, has the same key. It gets `null` without searching.
4. So `u.home = { bx: u.bx, by: u.by }`: he gives up his post even when a tile beside it was reachable. Before 6505a7f8, the fallback searched.

The same key sharing is what lets one soldier's failure stop a whole squad (see the lead).

```diff
-... else if (FK.walkTo(u, (q) => FK.walkable(q) && nearK(q, hk, AR.homeR), hk)) { ...
+... else if (FK.walkTo(u, (q) => FK.walkable(q) && nearK(q, hk, AR.homeR), hk, D.tries.way)) { ...
```
(A named budget skips the memory. The general fix belongs in the key; see the index.html reviewer.)

### 7. FRAMES: a search for a tile nobody can stand on now opens the whole map (combat.js:126, 321, 379)
`go(u, k)` has the goal `q === k`. An unwalkable `k` is never pushed (`around` → `stepOk` → `walkable`), so the search runs until the heap is empty.
- Since 6505a7f8 that is every tile the unit can reach, because `far` (200,000) is more than the ~94k land tiles. Before, it stopped at 20,000.
- E1036's own measure: failed searches were half of all rule time.

**Callers that can aim at water, woods, a building or off the board:**
- flee: 6 tiles straight away, every 1 s per routing soldier.
- follow: a tile behind the leader, every look (0.5 s) per healer or monk.
- scout: jittered waypoints near the board edge.

NOWAY only helps when the same tile is asked for twice. A routing band of 20 by a lake asks for 20 different tiles, which means up to 20 whole-map floods within a second, and again every 5 s while they stay stuck.

```diff
@@ -126 +126 @@
-  if (FK.go(u, FK.tileAt(u.bx + dx * MO.run * T, u.by + dy * MO.run * T))) u.then = 'rout'; }
+  const k = FK.tileAt(u.bx + dx * MO.run * T, u.by + dy * MO.run * T); if (FK.walkable(k, u) && FK.go(u, k)) u.then = 'rout'; }
@@ -321 +321 @@
-... if (gap(u, mid(k)) > FO.near && FK.go(u, k)) Object.assign(u, { job: 'follow', then: 'follow' }); }
+... if (gap(u, mid(k)) > FO.near && FK.walkable(k, u) && FK.go(u, k)) Object.assign(u, { job: 'follow', then: 'follow' }); }
@@ -379 +379 @@
-... u.rp = D.repath; if (FK.go(u, FK.tileAt(w.bx, w.by))) u.then = 'scout'; else u.wp = -~u.wp; } return true; }
+... u.rp = D.repath; const k = FK.tileAt(w.bx, w.by); if (FK.walkable(k, u) && FK.go(u, k)) u.then = 'scout'; else u.wp = -~u.wp; } return true; }
```

### 8. FRAMES: bestFoe works out its own group's power again for every foe in sight (combat.js:71-74)
`canBeat = (u, v) => groupPower(u) * ...`, and `groupPower` is a `unitsNear` over 6 tiles. bestFoe calls `canBeat(u, v)` once per candidate in sight (13 to 15 tiles), and brain:138 calls it twice more.
- In a 100 v 100 fight that is about (enemies in sight × friends within 6) per soldier per look, roughly 1M callbacks a second.
- `vs()` also builds a fresh object every call (`Object.assign({}, ...)`), 4 calls per candidate.

```diff
-const canBeat = (u, v) => groupPower(u) * vs(u, v) > power1(v) * vs(v, u); // E389
+const canBeat = (u, v, g = groupPower(u)) => g * vs(u, v) > power1(v) * vs(v, u); // E389
-function bestFoe(u, r) { let best = null, bv = -Infinity, bb = false; FK.unitsNear(u, r * T, (v) => { ... const beat = canBeat(u, v), ...
+function bestFoe(u, r) { let best = null, bv = -Infinity, bb = false; const g = groupPower(u); FK.unitsNear(u, r * T, (v) => { ... const beat = canBeat(u, v, g), ...
```

### 9. PLAY: a band soldier never answers a man who hits him from outside "the front" (combat.js:133, 154, 180)
E1565 forces his target to "the nearest of the front", measured from the band's middle within `near + deep` (2 tiles). Line 135 keeps a focused target, and the look block is skipped while there is a focus.
- A foe wrapping round a flank is farther than `near + 2` from the band's middle, so he is not on the front.
- The soldier he hits keeps aiming at a front man out of reach. While the group is still closing he is also held still: `u.path = null; u.rp = D.repath` (E1566).
- E1019 can't help, because it only wakes soldiers with `!v.target`.

This is the "60 of 102 stood idle while attacked" case again, inside a band.

```diff
-function onFront(u, look) { const B = frontOf(u.ord), F = ...; if (!look && F.includes(u.focus)) return u.focus; return F.reduce(...); } // E1564
+function onFront(u, look) { const B = frontOf(u.ord), h = u.hitBy; if (h && K.t - u.hitT < D.scan && B.live.includes(h)) return h; const F = ...; if (!look && F.includes(u.focus)) return u.focus; return F.reduce(...); } // E1564
```
(`FK.harm` sets `hitBy` and `hitT`. The book line E1564 would need its words updated.)

### 10. PLAY (save): after a load, Fall back no longer moves as one group (combat.js:232-234; pack at index.html:428-433)
E1432 says "one shared list, so the group is known". But pack() only re-links shared plain objects (`v.constructor === Object`). Arrays are written out once per holder.
- After a load, each soldier's `u.fall` is its own array.
- `by.get(u.fall)` then makes one group per soldier, so each goes back in alone the moment he stops.
- A loaded game plays differently from the same game never saved.

```diff
-  for (const u of G) Object.assign(u, { fall: F, fb: Infinity, focus: null, ord: null, sent: false }); return G.length; } // E1432
+  const R = { F }; for (const u of G) Object.assign(u, { fall: R, fb: Infinity, focus: null, ord: null, sent: false }); return G.length; } // E1432
-  for (const [F, G] of by) if (!G.some((u) => status(u) === 'march')) { const L = F.filter(alive); ...
+  for (const [R, G] of by) if (!G.some((u) => status(u) === 'march')) { const L = R.F.filter(alive); ...
```

### 11. FRAMES: iceShy runs again for every drowned man (combat.js:63-64)
`FK.on('drown', (u) => { ...; die(u, null, 'drowned'); iceShy(side); })`. The ice tick fires `'drown'` once per man who falls in.
- Each iceShy loops every unit and calls `march(v, goal)`, a far search, for every marcher of that side.
- If a hole takes 8 men while 40 are marching, that is 320 far searches in one step.

```diff
-const iceShy = (side) => { if (!SIDES[side]) return; for (const v of units()) ...
+const shyAt = {}, iceShy = (side) => { if (!SIDES[side] || shyAt[side] === K.t) return; shyAt[side] = K.t; for (const v of units()) ...
```

### 12. FRAMES: the escort check scans every unit, for every trader, every tick (combat.js:96)
`for (const c of units()) if (FK.has(c, 'Trade') ...) { const G = guardsOf(c).filter(alive); ...` costs O(traders × units) at 30 Hz, plus two new arrays per trader.

```diff
-FK.on('tick', () => { for (const c of units()) if (FK.has(c, 'Trade') && c.side >= 0) { const G = guardsOf(c).filter(alive); c.convoy = G.length > 0 && G.some((g) => gap(g, c) > D.trade.near * D.trade.wait); } }); // E1046
+FK.on('tick', () => { const G = new Map(); for (const u of units()) if (u.esc && alive(u)) (G.get(u.esc) || G.set(u.esc, []).get(u.esc)).push(u); for (const c of units()) if (FK.has(c, 'Trade') && c.side >= 0) c.convoy = (G.get(c) || []).some((g) => gap(g, c) > D.trade.near * D.trade.wait); }); // E1046
```

### 13. FRAMES: nerve does a 10-tile scan and builds two arrays for every fighting soldier every tick (combat.js:119)
`const us = [u], them = []; FK.unitsNear(u, MO.crowd * T, ...)` runs every step, not once per look. That is O(n²) per tick in a big fight.

```diff
-  nerve(u, dt); if (routing(u)) return true; ...                      (line 129)
+  nerve(u, dt, look); if (routing(u)) return true; ...
-function nerve(u, dt) { ...                                            (line 117)
+function nerve(u, dt, look) { ...
-  else { const us = [u], them = []; FK.unitsNear(u, MO.crowd * T, (v) => { if (armed(v) && alive(v)) (v.side === u.side ? us : atWar(u.side, v.side) ? them : []).push(v); }); if (them.length > us.length * MO.outnumbered) m -= MO.odds * dt; }
+  else { if (look) { let us = 1, them = 0; FK.unitsNear(u, MO.crowd * T, (v) => { if (armed(v) && alive(v)) { if (v.side === u.side) us++; else if (atWar(u.side, v.side)) them++; } }); u.odd = them > us * MO.outnumbered; } if (u.odd) m -= MO.odds * dt; }
```
(This changes play slightly, since the count refreshes every D.scan, so the kept match must be kept again.)

### 14. FRAMES (minor): a band order keeps scanning all units after its group is dead, and its convoy is thrown away (combat.js:178, 193)
- frontOf builds `us = units().filter(...)` before it checks `!F.length`. So an order whose group is all dead still scans every unit every tick, for as long as any soldier keeps that `ord`.
- In `order()`, the convoy (1 far search plus 2 searches of up to 600 tiles per soldier) is discarded on the first tick: E1565 retargets and line 148 sets `u.path = null`. It never keeps `t`, because of finding 4.

```diff
-function frontOf(O) { const B = O.band; if (B.at === K.t) return B; const us = units().filter((v) => v.ord === O && alive(v)), F = B.foes.filter((v) => alive(v) && v.side === B.side); Object.assign(B, { at: K.t, live: F, c: null }); if (!F.length || !us.length) return B; // E1562
+function frontOf(O) { const B = O.band; if (B.at === K.t) return B; const F = B.foes.filter((v) => alive(v) && v.side === B.side); Object.assign(B, { at: K.t, live: F, c: null }); if (!F.length) return B; const us = units().filter((v) => v.ord === O && alive(v)); if (!us.length) return B; // E1562
```

### 15. RULE: chosen numbers in code (combat.js:84, 150, 283, 285, 294)
- `atK = ... nearK(q, k, FK.walkable(k) ? 0 : 4)` (84) and `nearK(u.k, u.goal, FK.walkable(u.goal) ? 1 : 4)` (150): a snap radius of 4 tiles.
- `... : s.rng) + 0.5` (283): reach slack.
- `u.rp = 3 * D.repath` (285): wait after "no way".
- `B.h * 2 * s` (294): plank spacing.

All need book entries (for example `D.convoy.snap0`, `D.reach.slack`, `D.noWayWait`, `D.prep.plankGap`). Every E-code used in combat.js does exist in books/comments.js; I checked them all.

---

Not findings, checked and fine:
- every `units().filter` inside per-unit code is cached per tick (frontOf), or runs on a beat or an event (winning, fallTick, mUnits);
- no wall-clock or Math.random in sim code here (`performance.now()` at 261 is drawing only);
- unit refs in ORD/MS/waves round-trip through pack.
