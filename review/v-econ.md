# v-econ review: alarm/shelter, thin ice, training overflow

Snapshot: /home/claude/rv @ 1d0379ea (read-only). Commits read: 5803a7c9, 2729a067, ac6046c2 (alarm/shelter, E1500-E1505); dfbf2874, c069fb93 (ice walker E1540, kite line E1541); 08135091 (training overflow, E1520-E1524).
I ran no game, browser or check.py. The only thing I ran was `node -e` over books/mass.js and books/shells.js to get unit masses.

Counts: PLAY 6, FRAMES 1, RULE 1. No CRASH found.

Horse archer (UM11 and UM20, `"kite": 1` in D138; shells.js:74 and :111): person 70 + horse 500 + bow = **572 kg**. With D350 `load: {safe: 3.5, fail: 10.5}`, it breaks ice thinner than 7.38 cm outright. It cracks ice thinner than 12.78 cm, which can then break. Ice "holds a person at the safe load" from 4.47 cm.

---

## 1. PLAY: the kite line checks ice for "a person", not for the bowman, so horse archers kite onto ice that cannot hold them and drown (every side)
**combat.js:284** (c069fb93, E1541)
```js
n = Math.ceil(D.kite.back); if (Array.from({ length: n }, (_, s) => FK.tileAt(...)).every((k) => FK.walkable(k))) { Object.assign(u, { path: [[x, y]], ...
```
`FK.walkable(k)` is called without `who`. In onIceOk (index.html:1049), `who` undefined means the test is `ICE.load.safe * thick(k) ** 2 >= W.person.kg`, so any ice of 4.47 cm or more passes. The kiting unit's own E1540 rule is skipped: its mass, ×CROSS.ai (3) for the computer and the wild, "go around", and ice-shy.
Scenario: a horse archer (either side) fights spearmen on a lake shore in winter. While reloading it steps back 2.8 tiles in a straight line onto 5-7 cm ice. 572 kg is over the failing load there. The next ice beat cracks the tile, and after `warn` (1.5 s) `kg >= fail` breaks it (index.html:1044), so the archer drowns. He usually cannot walk off unless land is next to him: E1540's rule for him, standing on ice, refuses every ice tile below 7.38 cm (below 12.78 cm for the computer's, ×3). A player bowman on "go around" can also kite onto ice. Then every ice tile is refused for him (avoid), and he is stranded 2-3 tiles out (see #4).
The commit's goal ("every tile ... must be walkable", citing E1540) holds only for a 70 kg person.
```diff
--- a/combat.js
+++ b/combat.js
@@ -284 +284 @@
-      ... .every((k) => FK.walkable(k))) { Object.assign(u, { path: [[x, y]], at: 0, then: 'fight', kT: K.t }); continue; } } // E1541
+      ... .every((k) => FK.walkable(k, u))) { Object.assign(u, { path: [[x, y]], at: 0, then: 'fight', kT: K.t }); continue; } } // E1541
```
(The rest of the line is unchanged. With `u`, his own gates and woods are also judged correctly.)

## 2. PLAY: E1503 pulls Split, Lure and Seek villagers, and Prep's "wait behind the hall" villagers, back to the Town Center as soon as they arrive
**econ.js:275** (5803a7c9)
```js
if (u.emg && !u.den && !u.path && isIdle(u)) { if (!shelter(u) && !FK.atB(u, h)) seat(u); return; } // E1503
```
alarm() sets `emg: true` on every villager (econ.js:297), and prep() does the same (:313). The ones left over still get their own orders: Split `walkTo(u, … AL.split …)` and Lure/Seek `FK.goBy(u, b)`, both with `then: 'idle'` (:300), and Prep `walkTo(u, h.bx, h.by + (h.n + AL.behind) * T0)` (:308).
On arrival the walker sets `u.job = u.then || 'idle'` and `u.path = null` (index.html:1145). Within one flee look (D254 `look: [0.17, 0]`), E1503 fires: shelter() finds no room (they were the overflow), and `!FK.atB(u, h)` is true, since BAND is about 2 tiles, the Split spot is 20 tiles out and the Prep spot is 6 + h.n/2 tiles out. So seat() walks every one of them to the Town Center.
- Split (E1031 "scatter … so a raiding band must break up to chase") turns into a regroup at the TC, inside the raid.
- Lure leaves the tower for the TC unless that tower is the TC.
- Prep's wait spot behind the TC, which this same commit wrote into D255, is left as soon as they reach it.
The new `alarmed` check only rings `'shelter'`, so this is not covered.
Fix: E1503 applies only to villagers with no order of their own. Mark the ones that got one.
```diff
--- a/econ.js
+++ b/econ.js
@@ -275 +275 @@
-  if (u.emg && !u.den && !u.path && isIdle(u)) { if (!shelter(u) && !FK.atB(u, h)) seat(u); return; } // E1503
+  if (u.emg === true && !u.den && !u.path && isIdle(u)) { if (!shelter(u) && !FK.atB(u, h)) seat(u); return; } // E1503
@@ -301 +301 @@
-      else seat(u); }); } // E1505
+      else seat(u); if (u.job === 'walk' && (kind === 'split' || b)) u.emg = kind; }); } // E1505
@@ -308 +308 @@
-function boardIn(u) { const b = nextBoard(u); if (b && boardAt(u, b)) return; u.target = null; if (!shelter(u)) { const h = FK.seatOf(ME); if (h) walkTo(u, h.bx, h.by + (h.n + AL.behind) * T0); else idle(u); } }
+function boardIn(u) { const b = nextBoard(u); if (b && boardAt(u, b)) return; u.target = null; if (!shelter(u)) { const h = FK.seatOf(ME); if (h) { walkTo(u, h.bx, h.by + (h.n + AL.behind) * T0); if (u.job === 'walk') u.emg = 'prep'; } else idle(u); } }
```
All other `emg` reads are truthiness checks (`!u.emg`, `u.emg ||`), and out() still sets it to false, so a string value is safe and saves as JSON.

## 3. PLAY: anyone standing on ice gets the failing load for the whole route, not just the way off, so a re-path from the thick edge crosses the thin middle (the drowning dfbf2874 fixed comes back)
**index.html:1049** (dfbf2874, E1540)
```js
onIceOk = (k, who) => !CRACK.has(k) && ICE.load[who && onIce(who) ? 'fail' : 'safe'] * thick(k) ** 2 >= (who ? massOf(who.code) * (iceChoice(who) ? 1 : CROSS.ai) : W.person.kg) && ...
```
`onIce(who)` reads only the unit's current tile (index.html:1035), and searchPath applies it to every tile it expands. A unit on ice with a crossing mode (×1) may therefore route over any ice that holds it at failure.
Scenario: deep middles freeze later and thinner (D350 onset per metre), so a lake has thick shore ice and a thin centre. A spearman (77.5 kg) standing on 6 cm edge ice is re-pathed: a new order, combat.js:150's `FK.go(u, u.goal)` repath, or `toward()` chasing a foe. His route may cross 3 cm ice. Its safe capacity is 31.5 kg and its failing capacity 94.5 kg, so one man has a break chance of about 0.53 each beat after `warn`. Two on one tile is 155 kg, over fail, so the tile breaks at once.
This is Albert's seed-3382234986 drowning again, now triggered by any order given on the ice. The `thin_ice` check only starts walkers on land, so it does not catch this.
Side effect: reach(side) (index.html:1084) takes `who = units.find((u) => u.side === side)`, and its cache key (E1014) has no ice state. So a side's reach map now also depends on whether that arbitrary first unit is standing on ice. Unsure how often that shows.
Fix: allow the failing load only once his own tile no longer holds him at the safe load. That is the "way off" case E1540 describes.
```diff
--- a/index.html
+++ b/index.html
@@ -1049 +1049 @@
-const iceChoice = (u) => u.ice || (u.side === ME && K.iceMem && (K.iceMem.year < 0 || K.iceMem.year === year()) ? K.iceMem.mode : null), onIceOk = (k, who) => !CRACK.has(k) && ICE.load[who && onIce(who) ? 'fail' : 'safe'] * thick(k) ** 2 >= (who ? massOf(who.code) * (iceChoice(who) ? 1 : CROSS.ai) : W.person.kg) && !(who && (who.shy > K.t || (iceChoice(who) && CROSS.rules[iceChoice(who)].avoid))); // E1540
+const iceChoice = (u) => u.ice || (u.side === ME && K.iceMem && (K.iceMem.year < 0 || K.iceMem.year === year()) ? K.iceMem.mode : null), bears = (k, who, at) => ICE.load[at] * thick(k) ** 2 >= (who ? massOf(who.code) * (iceChoice(who) ? 1 : CROSS.ai) : W.person.kg), onIceOk = (k, who) => !CRACK.has(k) && (bears(k, who, 'safe') || (!!who && onIce(who) && !bears(who.k, who, 'safe') && bears(k, who, 'fail'))) && !(who && (who.shy > K.t || (iceChoice(who) && CROSS.rules[iceChoice(who)].avoid))); // E1540
```

## 4. PLAY (old logic carried into the rewrite): for one already on the ice, ice-shy or "go around" still closes every way off, against E1540's "the way off is never shut"
**index.html:1049**, tail of the line: `&& !(who && (who.shy > K.t || (iceChoice(who) && CROSS.rules[iceChoice(who)].avoid)))`. This applies whether or not `who` is on the ice.
Scenario A: a tile cracks, iceShy (combat.js:63) runs offIce(v), which gives v a path ashore, then sets `v.shy = K.t + D.season`. A soldier fighting on the ice has `u.path = null` set by combat.js:283 while his target is in reach. When the target dies, `march(u, u.was)` searches with shy set, every ice tile is refused, he goes idle on the ice and stays there until the next crack.
Scenario B: the player picks "go around" (K.iceMem) while a group is mid-lake. Every unit there without its own `u.ice` can no longer path at all until he taps "clear the ice" (menu.js:136).
Fix (unsure it is wanted, because a shy or "around" unit on the ice could then route along ice it can bear rather than straight to shore):
```diff
-... && !(who && (who.shy > K.t || (iceChoice(who) && CROSS.rules[iceChoice(who)].avoid))); // E1540
+... && !(who && !onIce(who) && (who.shy > K.t || (iceChoice(who) && CROSS.rules[iceChoice(who)].avoid))); // E1540
```

## 5. FRAMES: every alarm villager waiting beside a full Town Center reruns shelter() about 6 times a game-second, at O(foes + buildings × units) each, with array allocations
**econ.js:284** (ac6046c2), called from **econ.js:275** at every flee look (econ.js:249 `if (FK.every(FL.look)) for (const u of units()) … fright(u, …)`, D254 look 0.17 s).
```js
function shelter(u) { const F = units().filter((v) => foeOf(u.side, v)), R = FK.blds().filter((b) => … hold(b) && inN(b) < hold(b)).sort(…), …
```
`inN(b)` is `units().filter((u) => u.inside === b || u.den === b).length` (econ.js:269): a full pass over all units plus a new array, for every own building that has room. F is also built every time, even when R ends up empty.
Using the commit's own test (41 villagers beside the TC, every building full), with about 200 units and about 12 shelters: 41 × (200 foeOf + 12 × 200) ≈ 107k element visits and about 530 arrays per look, all to answer "still no room". That is about 640k visits and about 3,200 arrays per game-second, and it multiplies with game speed. ac6046c2 cut only the `things()` scan.
Fix: one occupancy pass per call, and stop before building F.
```diff
--- a/econ.js
+++ b/econ.js
@@ -284 +284 @@
-function shelter(u) { const F = units().filter((v) => foeOf(u.side, v)), R = FK.blds().filter((b) => b.side === u.side && up(b) && hold(b) && inN(b) < hold(b)).sort((a, c) => dist(u, a) - dist(u, c)), b = R.find((b) => !F.some((f) => runsAt(u, b, f))) || R.find((b) => FK.has(b, 'Seat')); if (!b) return false; Object.assign(u, { den: b, scared: true }); enter(u); return !!(u.den || u.inside); } // E1501
+function shelter(u) { const n = new Map(); for (const v of units()) { const q = v.inside || v.den; if (q) n.set(q, (n.get(q) || 0) + 1); } const R = FK.blds().filter((b) => b.side === u.side && up(b) && hold(b) && (n.get(b) || 0) < hold(b)); if (!R.length) return false; R.sort((a, c) => dist(u, a) - dist(u, c)); const F = units().filter((v) => foeOf(u.side, v)), b = R.find((b) => !F.some((f) => runsAt(u, b, f))) || R.find((b) => FK.has(b, 'Seat')); if (!b) return false; Object.assign(u, { den: b, scared: true }); enter(u); return !!(u.den || u.inside); } // E1501
```
The count matches inN as long as no unit has both `inside` and `den` set, and enter() never leaves both set (econ.js:272). Repeated path failures inside shelter()/seat() are already cheap because of NOWAY (index.html:1069).

## 6. PLAY: a villager whose building falls while the Alarm rings goes back to work instead of "looking again" as E1503 says
**econ.js:233** with **econ.js:273**
```js
if (u.inside && (u.inside.gone || u.job !== 'inside') && out(u) && FK.has(u, 'Gather') && isIdle(u)) resume(u);
const out = (u) => Object.assign(u, { inside: null, hid: false, emg: false, scared: false, … })
```
out() clears `emg`, so E1503 never sees her, and resume() sends her back to her work target, possibly inside the raid. E1503 names "her building fell" as one of its cases; only a villager still walking to her `den` is covered (enter(), :270).
```diff
--- a/econ.js
+++ b/econ.js
@@ -233 +233 @@
-  for (const u of units()) { if (u.inside && (u.inside.gone || u.job !== 'inside') && out(u) && FK.has(u, 'Gather') && isIdle(u)) resume(u); if (u.job === 'shelter' && !u.path) enter(u); if (!FK.has(u, 'Gather') || u.path || u.inside || u.den) continue; const t = u.target;
+  for (const u of units()) { if (u.inside && (u.inside.gone || u.job !== 'inside')) { const e = u.emg && u.inside.gone; out(u); if (e) u.emg = u.scared = true; else if (FK.has(u, 'Gather') && isIdle(u)) resume(u); } if (u.job === 'shelter' && !u.path) enter(u); if (!FK.has(u, 'Gather') || u.path || u.inside || u.den) continue; const t = u.target;
```

## 7. RULE: E785 is orphaned and now contradicts E1540; E1031 is stale; E1503/E1501 overclaim "every side"
- dfbf2874 relabelled the only `// E785` (the onIceOk line) to E1540. books/comments.js:58 `"E785": {"text": "who may step on ice: yours unless told to go around; …"}` is now unused, and it states the old rule ("yours unless told to go around").
- books/comments.js:924 E1031 still says "With none to run to, they wait behind the hall as before". Since 5803a7c9 they `seat()` beside the TC (E1505).
- E1503 says "on every side", but `u.emg` is only set by alarm() and prep(), both ME-only (econ.js:291, :313). Computer villagers never take this path. The code is fine; the text is wrong.
```diff
--- a/books/comments.js
+++ b/books/comments.js
@@ -58 +57,0 @@
-"E785": {"text": "who may step on ice: yours unless told to go around; the computer and the wild only where the ice holds several of them at the safe load"},
@@ -924 +923 @@
- ... Seek: they run to your nearest building that trains soldiers. With none to run to, they wait behind the hall as before. Gather and All hands ...
+ ... Seek: they run to your nearest building that trains soldiers. With none to run to, they gather beside the Town Center (E1505). Gather and All hands ...
```

## 8. PLAY/FRAMES, low (the corner case is unsure): the kite line is sampled about every 0.93 tiles and allocates an array on each look
**combat.js:284**: `n = Math.ceil(D.kite.back)` (2.8 → 3 samples) and `Array.from({ length: n }, …)`. A segment between samples can clip the corner of a tile it never samples. A diagonal, 8-connected one-tile channel could be crossed between samples (unsure whether the map makes such channels). The allocation is small (one array of 3 per kiting look) but sits in the per-unit combat loop. Possible fix, the same line as #1 written as a loop with no allocation:
```diff
-n = Math.ceil(D.kite.back); if (Array.from({ length: n }, (_, s) => FK.tileAt(u.bx + ((x - u.bx) * (s + 1)) / n, u.by + ((y - u.by) * (s + 1)) / n)).every((k) => FK.walkable(k))) {
+n = Math.ceil(D.kite.back); let ok = true; for (let s = 1; ok && s <= n; s++) ok = FK.walkable(FK.tileAt(u.bx + ((x - u.bx) * s) / n, u.by + ((y - u.by) * s) / n), u); if (ok) {
```

---

## Checked and found clean
- **Training overflow (08135091)**: no defect found.
  - The return value changed from `true` to the building. All callers only test truthiness: ai.js:46 `return !!b && ECON.queue(b, code)`, ai.js:98, and menu.js:143 `train.run`. The people button (menu.js:117) now calls `VERBS.train.run(born(), hall())`, which matches `(c, b)`, so the argument order is right.
  - Price: `queue` charges `priceOf(b.side, code, t)` and `order(t, …)`. `unqueue(t)` refunds `priceOf(…, t)`, so the refund matches. tentCost depends only on `b.camp`, and camp lines have their own codes (D287: BTC6 Training tent), so `t.code === b.code` never mixes a camp line with a town line and the label price equals the charged price.
  - The note stores only `{bx, by}` (menu.js:405), so saves are unaffected.
  - lineAt costs one `lines()` scan, and only when the tapped line is full.
- **Alarm and soldiers**: 5803a7c9, 2729a067 and ac6046c2 touch only `villagersOf(ME)` and Gather units. Garrison's soldiers still go through fillRank (econ.js:295) as before. prep() takes villagers only.
- **runsAt (E1500)**: the clamp and the `|| 1` guard handle a zero-length trip, and s = 0 gives `d === dist(u, f)`, so a villager running away from a foe is never counted as running toward him. seat() and shelter() cope with a missing TC and a failed path (job set to 'idle'), and failed repeats are cached by NOWAY.
- **Determinism**: none of these changes use Math.random, Date.now or performance.now. All sorts are by distance over the same ordered lists.
