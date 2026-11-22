# econ.js review: reviewer "econ" (snapshot /home/claude/rv at 1d0379ea, read-only)

Scope: all of econ.js (639 lines). Covered: gathering, the train/research queues, lineAt (E1520/E1521), the alarm and shelter (E1500-E1505), building and camps, walls and the seal test, trade, research lookups, upkeep, health, vassals.
Method: I read every line. Comment codes were checked against books/comments.js. Tuning numbers came from loading the books in node. Every diff below was applied to a scratch copy and passed `node --check`. Each diff stands alone against the snapshot. F2 and F7 both touch campRaise, so merge them by hand.

**Counts: CRASH 0 · PLAY 9 · FRAMES 4 · RULE 1** (14 findings, most important first)

Tick rate is D.step.hz = 30, so "every tick" means 30 times a second.

---
## 1. PLAY: removing the first queued item makes the next one finish at once (instant age-up or tech)
econ.js:94: `const [code] = b.q.splice(i, 1); if (!i) b.qt = 0; // E931`
E931 says: "taking out the first restarts the clock". The code does not restart it. It sets the clock to 0. The next tick (econ.js:230) runs `t.qt -= dt; ... if (t.qt <= 0) { ... t.q.shift(); ... else if (!u) rise(t.side); ...` so the new head finishes on the very next tick.
Scenario: the Town Center queue is [Villager, Age II]. The player presses Back. menu.js:98 removes the last unit, `i = q.findLastIndex((c) => FK.SH[c])`, which is index 0. The villager is refunded in full and Age II completes 1/30 s later. The same happens with a lab queue [Tech A, Tech B] when Tech A is tapped (menu.js:121 `ECON.unqueue(q.b, q.i)`), and with the unq verb (menu.js:145). This is a free instant age-up or research for the player. The AI never unqueues, so the two sides also play by different rules.
```diff
--- a/econ.js
+++ b/econ.js
@@ -94 +94 @@
-function unqueue(b, i = b.q && b.q.length - 1) { if (!b.q || !b.q[i]) return; const [code] = b.q.splice(i, 1); if (!i) b.qt = 0; // E931
+function unqueue(b, i = b.q && b.q.length - 1) { if (!b.q || !b.q[i]) return; const [code] = b.q.splice(i, 1); if (!i) b.qt = b.q.length ? timeOf(b.side, b.q[0]) : 0; // E931
```

## 2. PLAY: camp pieces raised by soldiers slow down without limit (crew is never reset)
econ.js:449 `else if (FK.atB(u, b)) { b.crew += hands(u); at1.push(u); }` and econ.js:452 `k = ((hands(u) * Math.pow(b.crew, D.crew)) / b.crew) * dt / T1`.
`crew` is cleared only for things in WK (econ.js:232 `for (const t of WK) t.wk = t.crew = 0;`). A thing gets into WK only when some unit has `u.target === t`. Raising soldiers have `target: null`: raiser() requires `!u.target`, and line 451 sets `site`, not `target`. So a piece raised only by soldiers adds hands to b.crew on every tick, forever.
With D.crew = 0.7, the rate per hand is crew^-0.3. After N ticks it has fallen by a factor of N^-0.3: 0.18 after 10 s and 0.105 after 60 s. Worked example: one soldier (hands = D.camp.build 0.6 × campbuild 1) on a piece whose build stat is 30 s takes about 9 minutes instead of about 43 s, roughly 13x longer. E500 says hands "raise it as a villager's would (D204)". When a villager also builds the piece, WK clears it and the rate is right, so the result depends on who builds.
Fix: count soldier hands in a per-tick map and add villager crew, which WK clears every tick.
```diff
--- a/econ.js
+++ b/econ.js
@@ -448,2 +448,2 @@
-function campRaise(dt) { const S = things().filter((b) => b.camp && alive(b) && needs(b)), look = FK.every(CA.look), at1 = [];
-  for (const u of units()) { if (u.job === 'raise') { const b = u.site; if (!b || b.gone || !needs(b) || u.target) { u.site = null; u.job = 'idle'; } else if (FK.atB(u, b)) { b.crew += hands(u); at1.push(u); } else if (!u.path && !FK.goBy(u, b)) u.job = 'idle'; continue; }
+function campRaise(dt) { const S = things().filter((b) => b.camp && alive(b) && needs(b)), look = FK.every(CA.look), at1 = [], hand = new Map();
+  for (const u of units()) { if (u.job === 'raise') { const b = u.site; if (!b || b.gone || !needs(b) || u.target) { u.site = null; u.job = 'idle'; } else if (FK.atB(u, b)) { hand.set(b, (hand.get(b) || 0) + hands(u)); at1.push(u); } else if (!u.path && !FK.goBy(u, b)) u.job = 'idle'; continue; }
@@ -452 +452 @@
-  for (const u of at1) { const b = u.site, T1 = FK.stat(b.code, b.side, 'build'), k = ((hands(u) * Math.pow(b.crew, D.crew)) / b.crew) * dt / T1;
+  for (const u of at1) { const b = u.site, T1 = FK.stat(b.code, b.side, 'build'), c = ~~b.crew + hand.get(b), k = ((hands(u) * Math.pow(c, D.crew)) / c) * dt / T1;
```

## 3. PLAY: the Split, Lure and Seek alarm orders undo themselves on arrival; villagers walk back to the Town Center
econ.js:275 `if (u.emg && !u.den && !u.path && isIdle(u)) { if (!shelter(u) && !FK.atB(u, h)) seat(u); return; } // E1503`
alarm() (econ.js:297-301) sets `emg: true` on every villager. It then sends the ones who got no shelter on `walkTo(...)` (Split) or to the nearest shooting or training building (Lure, Seek), with `then: 'idle'`. When the walk ends, index.html:1145 sets `u.job = u.then || 'idle'`. The next fright() call (every FL.look = 0.17 s, econ.js:249) sees an emg villager who is idle and has no path. It tries shelter(), which is still full, because that is why she was in `left`. Then it calls seat(u), and she walks back to the Town Center.
E1031: "Split: they scatter ... so a raiding band must break up to chase. Lure: they run to your nearest building that shoots." E1503 lists only "her walk failed, her building fell, she reached the Town Center". It does not cover an alarm errand that has finished. Net effect: Split, Lure and Seek all end up the same as Shelter, a few seconds late. Along the way, every one of these villagers runs shelter() (a full `units()` scan plus a sort of the buildings) every 0.17 s.
Fix: mark the errand and let E1503 skip it. out() clears the mark, and allClear calls out().
```diff
--- a/econ.js
+++ b/econ.js
@@ -273 +273 @@
-const out = (u) => Object.assign(u, { inside: null, hid: false, emg: false, scared: false, job: u.job === 'inside' ? 'idle' : u.job }), focused = (u) => !!(u.focus && alive(u.focus)), resume = (u) => { const s = u.stay; u.stay = null; if (s && alive(s)) { if (!u.load) return gatherAt(u, s); u.target = s; return carry(u); } return u.load ? carry(u) : focused(u) ? gatherAt(u, u.focus) : u.carry ? look(u) : idle(u); }; // E1027
+const out = (u) => Object.assign(u, { inside: null, hid: false, emg: false, scared: false, fled: false, job: u.job === 'inside' ? 'idle' : u.job }), focused = (u) => !!(u.focus && alive(u.focus)), resume = (u) => { const s = u.stay; u.stay = null; if (s && alive(s)) { if (!u.load) return gatherAt(u, s); u.target = s; return carry(u); } return u.load ? carry(u) : focused(u) ? gatherAt(u, u.focus) : u.carry ? look(u) : idle(u); }; // E1027
@@ -275 +275 @@
-  if (u.emg && !u.den && !u.path && isIdle(u)) { if (!shelter(u) && !FK.atB(u, h)) seat(u); return; } // E1503
+  if (u.emg && !u.den && !u.path && isIdle(u)) { if (!u.fled && !shelter(u) && !FK.atB(u, h)) seat(u); return; } // E1503
@@ -301 +301 @@
-      else seat(u); }); } // E1505
+      else seat(u); u.fled = (kind === 'split' || !!b) && u.job === 'walk'; }); } // E1505
```

## 4. PLAY: a side whose age-up building falls can never age up again (while it still has another Town Center)
econ.js:107 `if (!n || s.aging || !h || !room(h) || ...) return false;`. `aging` is cleared only by rise() (line 108) and unqueue() (line 95). No 'gone' handler clears it (lines 251-252).
BTC1 (Town Center, ticks include Seat) has caps [0,0,1,2,2], so from age index 2 a side can hold 2-3 Town Centers. FK.seatOf returns the first one (index.html:1783). Scenario: the AI or the player queues Age III at its first TC. An enemy razes that TC, but the second TC stands, so line 252 does not call fall(). The queue vanishes with the building and `SIDES[side].aging` stays above 0 forever. ageUp() refuses for good. The menu shows "rising" forever (menu.js:124), and ai.js:67 `!s.aging` blocks the AI for good.
```diff
--- a/econ.js
+++ b/econ.js
@@ -251 +251 @@
-FK.on('gone', (t) => { t.gone = true; });
+FK.on('gone', (t) => { t.gone = true; if (SIDES[t.side] && (t.q || []).some((c) => D.ages.includes(c))) SIDES[t.side].aging = 0; });
```

## 5. PLAY: a failed path leaves a phantom worker on the find, so farms and posts can become unusable for good
econ.js:151: `t.wk = ~~t.wk + (u.target !== t); u.target = t; ...` then `if (!(t.kind === 'bld' ? FK.goBy(u, t) : FK.toSpot(u, t))) { (t.noPath = ...)[u.side] = bell; u.target = u.path = null; ... }`
wk is raised before the path is tried. When the path fails, the target is dropped but wk is not lowered. WK (econ.js:232) clears only things that some unit targeted last tick, and nothing targets t now, so the +1 stays. D.forage.cap.bld = 1, so `full(u, t)` (econ.js:130) is now true for every unit of every side. bestFind skips the building, gatherAt and startWork refuse it, and nothing will ever target it again to clear the count. `idlePost(b)` (`!b.wk`) also stops flagging it as idle.
Scenario: a farm, mill or tree farm gets walled off for a moment, or a far villager's path search runs out of budget (D.tries.way). After that the building is dead for the rest of the match, and the save keeps wk. E222 promises a different behaviour: "left alone a while (D137), and the next beat chooses again". Trees (cap 4) lose a worker slot each time this happens.
```diff
--- a/econ.js
+++ b/econ.js
@@ -151 +151 @@
-  if (u.target !== t && (full(u, t) || (t.kind !== 'bld' && !FK.spotFor(u, t)))) { u.carry = yieldOf(t); u.lost = { x: t.bx, y: t.by, t: bell }; return look(u); } t.wk = ~~t.wk + (u.target !== t); u.target = t; if (post(t)) u.told = t; u.carry = yieldOf(t); u.lost = null; if (t.kind === 'bld') u.spot = null; if (beside(u, t)) { u.job = 'gather'; return; } u.job = 'walk'; u.then = 'gather'; if (!(t.kind === 'bld' ? FK.goBy(u, t) : FK.toSpot(u, t))) { (t.noPath = t.noPath || {})[u.side] = bell; u.target = u.path = null; u.job = 'gather'; } } // E222
+  if (u.target !== t && (full(u, t) || (t.kind !== 'bld' && !FK.spotFor(u, t)))) { u.carry = yieldOf(t); u.lost = { x: t.bx, y: t.by, t: bell }; return look(u); } const nw = +(u.target !== t); t.wk = ~~t.wk + nw; u.target = t; if (post(t)) u.told = t; u.carry = yieldOf(t); u.lost = null; if (t.kind === 'bld') u.spot = null; if (beside(u, t)) { u.job = 'gather'; return; } u.job = 'walk'; u.then = 'gather'; if (!(t.kind === 'bld' ? FK.goBy(u, t) : FK.toSpot(u, t))) { (t.noPath = t.noPath || {})[u.side] = bell; t.wk -= nw; u.target = u.path = null; u.job = 'gather'; } } // E222
```

## 6. PLAY: 5 paid techs do nothing (confirmed): O42 Midwives `twin`, O260 Local guides `guides`, O163 Law code and O164 Magistrates `push`, O47 Chimney `warm`
How I confirmed it: tech fx reach play only through `stat(code, side, key)` (index.html:398-403), and I listed every stat call in index.html, econ.js, combat.js, ai.js and menu.js (script /tmp/econ/s.py). All of them use a literal key, except the two generic readers: index.html:400, and statRow at index.html:406, which only walks D.stats[code] keys. No D.stats or D.tower row has twin, guides, push or warm. No quoted 'twin', 'guides', 'push' or 'warm' appears in any code file. (`VA.push` at econ.js:589 and `ECON.guides` at econ.js:67 are unrelated names.) O47's other effect, `chill` c 0.5, does work through exposure (index.html:1507). I ran the same scan over all 70 fx stat names. The other 66 each appear as a quoted key somewhere in the code, and these 4 (5 techs) never do.
Second problem: D.bases (measure.js:194, D239) has guides: 1 but no twin, push or warm. stat() returns `base == null ? base : ...` (index.html:402), which is **undefined**. So adding a reader alone would give undefined, or NaN in arithmetic. Each reader also needs a base: twin 0, push 1, warm 0.
Where a reader would go (unsure about what each one is meant to mean, so ask Albert):
- `twin` (BTC1 Household line, k UV, a 1): the train-done step at econ.js:230, right after `const u = FK.SH[code] ? spawnBy(t, code) : null`. A villager could bring a second spawnBy at a book-set chance times stat(code, side, 'twin').
- `push` (BP8 Courthouse, Order line, c 0.15 and 0.2): vassal unrest at econ.js:589, `s.unrest + VA.tribute.push + VA.push[forced] - ...`. Whose techs should count (the vassal's or the lord's) is unsure. Example below, using the vassal `q`; it needs D.bases.push = 1 first:
```diff
--- a/econ.js
+++ b/econ.js
@@ -589 +589 @@
-    s.protect = (s.protect || LO) * VA.decay; s.loyal = FK.relax(s.loyal, loyaltyParts(q).target, VA.tau, SLOW); s.unrest = Math.min(HI, Math.max(LO, s.unrest + VA.tribute.push + VA.push[forced] - s.loyal / VA.calm));
+    s.protect = (s.protect || LO) * VA.decay; s.loyal = FK.relax(s.loyal, loyaltyParts(q).target, VA.tau, SLOW); s.unrest = Math.min(HI, Math.max(LO, s.unrest + (VA.tribute.push + VA.push[forced]) * FK.stat('', q, 'push') - s.loyal / VA.calm));
```
- `guides` (BM1 Barracks, Ground line, c 0.5 on base 1): most likely a soldier's terrain or woods walking cost. The reader would sit in the eta at index.html:1061 (`... * (inWoods(u.k) ? D.woods.eta : 1)`). Unsure.
- `warm` (BR1 House, Dwelling line, a 0.05): most likely sickness or cold. The reader would be sickRisk at econ.js:535 or exposure at index.html:1507. Unsure.

## 7. FRAMES: campRaise scans every non-tree thing every tick, and on look beats it scans every unit inside a sort
econ.js:448 `const S = things().filter((b) => b.camp && alive(b) && needs(b)), look = FK.every(CA.look)`. S is read only when `look` is true (line 450), but it is built 30 times a second.
On look beats (CA.look = 0.5 s), econ.js:450 runs `taken = (b) => units().filter((v) => v.site === b && v.job === 'raise').length` inside `S.filter(... by(q) ...)` and `.sort((p, q) => by(p) - by(q))` for **every idle soldier**. That costs O(soldiers × S·log S × units) per beat. For example, 100 idle soldiers, a 40-piece camp and 500 units come to about 20M unit checks every 0.5 s while any piece needs work.
Fix: build S only on a look beat, and count crews once.
```diff
--- a/econ.js
+++ b/econ.js
@@ -448 +448 @@
-function campRaise(dt) { const S = things().filter((b) => b.camp && alive(b) && needs(b)), look = FK.every(CA.look), at1 = [];
+function campRaise(dt) { const look = FK.every(CA.look), S = look ? things().filter((b) => b.camp && alive(b) && needs(b)) : [], at1 = [], taken = new Map(); if (S.length) for (const v of units()) if (v.job === 'raise' && v.site) taken.set(v.site, (taken.get(v.site) || 0) + 1);
@@ -450,2 +450,2 @@
-    if (!look || !S.length || !raiser(u)) continue; const taken = (b) => units().filter((v) => v.site === b && v.job === 'raise').length, by = (b) => dist(u, b) / D.tile + CA.crowd * taken(b), [b] = S.filter((q) => q.side === u.side && by(q) < CA.raise).sort((p, q) => by(p) - by(q));
-    if (b) { Object.assign(u, { job: 'raise', then: 'raise', site: b, goal: null }); if (!FK.atB(u, b) && !FK.goBy(u, b)) u.job = 'idle'; } }
+    if (!look || !S.length || !raiser(u)) continue; const by = (b) => dist(u, b) / D.tile + CA.crowd * (taken.get(b) || 0), [b] = S.filter((q) => q.side === u.side && by(q) < CA.raise).sort((p, q) => by(p) - by(q));
+    if (b) { Object.assign(u, { job: 'raise', then: 'raise', site: b, goal: null }); if (!FK.atB(u, b) && !FK.goBy(u, b)) u.job = 'idle'; else taken.set(b, (taken.get(b) || 0) + 1); } }
```

## 8. FRAMES: every idle trade cart scans all buildings and all things on every tick, looking for an ally
econ.js:412 `if (u.route) route(u); else if (!supply(u, beat)) run(u);`. supply() returns false off-beat, so run() runs every tick. In run() (econ.js:406-407), `homeOf(u)` scans FK.blds() and `allyMarket(side, home)` runs `things().filter(...)` with `WAR.stance` per building. With no ally, which is the usual case, `to` is null and the cart stands at home and repeats this 30 times a second, for every cart on every side.
```diff
--- a/econ.js
+++ b/econ.js
@@ -412 +412 @@
-  for (const u of units()) if (FK.has(u, 'Trade') && SIDES[u.side] && !(u.rest > bell)) { if (beat && FK.stat(u.code, u.side, 'armed')) { const f = units().filter((v) => WAR.enemies(u, v) && dist(u, v) <= FK.stat(u.code, u.side, 'rng') * D.tile).reduce((a, b) => (!a || dist(b, u) < dist(a, u) ? b : a), null); if (f) WAR.hit(u, f); } if (u.route) route(u); else if (!supply(u, beat)) run(u); }
+  for (const u of units()) if (FK.has(u, 'Trade') && SIDES[u.side] && !(u.rest > bell)) { if (beat && FK.stat(u.code, u.side, 'armed')) { const f = units().filter((v) => WAR.enemies(u, v) && dist(u, v) <= FK.stat(u.code, u.side, 'rng') * D.tile).reduce((a, b) => (!a || dist(b, u) < dist(a, u) ? b : a), null); if (f) WAR.hit(u, f); } if (u.route) route(u); else if (!supply(u, beat) && (beat || u.dest)) run(u); }
```

## 9. FRAMES: sites() costs O(wall pieces² × units) every 2 s while a long wall is unbuilt
econ.js:323 runs `units().some(...)` for each unbuilt site. econ.js:324 calls `wallsBusy(t.side)` for each wall site, and wallsBusy (econ.js:163) is `things().filter(... wallish(s) && units().some(...))`. Laying 100 pieces with 500 units costs about 100 × (100 × 500) = 5M checks per DG.beat (2 s). lay() calls autoBuilder, and so wallsBusy, once per piece as well, which causes a hitch when the wall is laid.
Fix: build one set of targets per call, and add each new builder's site to it as she is sent.
```diff
--- a/econ.js
+++ b/econ.js
@@ -163 +163 @@
-const wallsBusy = (side) => things().filter((s) => s.side === side && !up(s) && wallish(s) && units().some((v) => v.target === s && jobOf(v) === 'build')).length >= D.builders.crew;
+const raising = () => new Set(units().filter((v) => v.target && jobOf(v) === 'build').map((v) => v.target)), wallsBusy = (side, on = raising()) => things().filter((s) => s.side === side && !up(s) && wallish(s) && on.has(s)).length >= D.builders.crew;
@@ -323,3 +323,3 @@
-function sites() { if (emg) return; for (const t of FK.blds()) if (SIDES[t.side] && !up(t) && !units().some((v) => v.target === t && jobOf(v) === 'build')) { const R = FK.reach(t.side);
-  if (!FK.reached(t.side, t, t.bx, t.by)) { if (t.side === ME && !t.told) tell(SAY.site, { b: FK.SH[t.code].name }); t.told = true; continue; } t.told = false; if (wallish(t) && wallsBusy(t.side)) continue;
-  const [v] = villagersOf(t.side).filter((v) => (idleU(v)) && !v.inside && !v.den && !v.emg && R.has(v.k)).sort((a, b) => dist(a, t) - dist(b, t)); if (v) buildAt(v, t); } }
+function sites() { if (emg) return; const on = raising(); for (const t of FK.blds()) if (SIDES[t.side] && !up(t) && !on.has(t)) { const R = FK.reach(t.side);
+  if (!FK.reached(t.side, t, t.bx, t.by)) { if (t.side === ME && !t.told) tell(SAY.site, { b: FK.SH[t.code].name }); t.told = true; continue; } t.told = false; if (wallish(t) && wallsBusy(t.side, on)) continue;
+  const [v] = villagersOf(t.side).filter((v) => (idleU(v)) && !v.inside && !v.den && !v.emg && R.has(v.k)).sort((a, b) => dist(a, t) - dist(b, t)); if (v) { buildAt(v, t); if (jobOf(v) === 'build') on.add(t); } } }
```

## 10. PLAY (small): spice bought by a caravan ignores the side's 'band' tech
econ.js:403 `const c = GD[SPICE].buy * goingPrice(SPICE), q = ...`. goingPrice is `(k, side) => ... ** FK.stat('', side, 'band')` (econ.js:366). With side undefined, stat reads no techs and returns D.bases.band = 1. O236 changping (band c 0.5) is applied to market prices and to estPay, but not to this purchase.
```diff
--- a/econ.js
+++ b/econ.js
@@ -403 +403 @@
-    if (r.spice && isStop(t)) { const c = GD[SPICE].buy * goingPrice(SPICE), q = Math.min(TR.load, Math.floor(SIDES[side].store.gold / c)); if (q >= TR.least) { spend(side, 'gold', Math.round(q * c), 'trade'); u.goods[SPICE] = q; stockHit(SPICE, q); } }
+    if (r.spice && isStop(t)) { const c = GD[SPICE].buy * goingPrice(SPICE, side), q = Math.min(TR.load, Math.floor(SIDES[side].store.gold / c)); if (q >= TR.least) { spend(side, 'gold', Math.round(q * c), 'trade'); u.goods[SPICE] = q; stockHit(SPICE, q); } }
```

## 11. PLAY (unsure whether intended): a villager on a spent farm or shaft 'works' it forever, producing 0, and never counts as idle
econ.js:234 `if (!t || !alive(t)) { lose(u); continue; }`. alive() (econ.js:15) is always true for a building, even at amount 0. The gather step then does `n = Math.min(g, t.amount ?? g, cap - u.load)`, which is 0, so she gets nothing, and at a drop-off line 239 sends a posted villager back to `cur`.
Results: jobOf() still reports 'food', so idlers() and the Idle button miss her. `t.workT = bell` keeps the soil marked as worked, so it never rests (econ.js:209). The work sound keeps firing. E1053 says a Focus villager "when it runs out, sends her to the Town Center to wait", and that never happens for posts. If waiting at the spot until a replant is intended, then at least she should count as idle. The fix below makes her leave (lose(), which looks for another find or goes home):
```diff
--- a/econ.js
+++ b/econ.js
@@ -234 +234 @@
-    if (u.job === 'gather') { if (!t || !alive(t)) { lose(u); continue; } if (!beside(u, t)) { gatherAt(u, t); continue; }
+    if (u.job === 'gather') { if (!t || !alive(t) || (t.kind === 'bld' && t.max && !(t.amount > 0))) { lose(u); continue; } if (!beside(u, t)) { gatherAt(u, t); continue; }
```

## 12. PLAY (rare): a ruins scroll can teach another civilization's own tech
econ.js:510 picks the free research with `!s.techs.has(c) && T[c].value.age <= s.age && !T[c].value.rank && needsOf(c).every(...)`. It has no civ test. researchWhy (econ.js:121) has one: `T[c].value.civ && T[c].value.civ !== s.civ ? 'civ'`. Civ techs come later in the book (first is O232 viamil, age 2, no needs), so this only bites a side that already knows the earlier eligible techs. When it does, that side gets a rival civ's unique bonus.
```diff
--- a/econ.js
+++ b/econ.js
@@ -510 +510 @@
-    const c = F.tech && Object.keys(T).find((c) => !s.techs.has(c) && T[c].value.age <= s.age && !T[c].value.rank && needsOf(c).every((n) => s.techs.has(n)) && !things().some((b) => b.side === o && (b.q || []).includes(c))); if (c) { learn(o, c); extra = WW.scroll.replace('{name}', T[c].name); }
+    const c = F.tech && Object.keys(T).find((c) => !s.techs.has(c) && (!T[c].value.civ || T[c].value.civ === s.civ) && T[c].value.age <= s.age && !T[c].value.rank && needsOf(c).every((n) => s.techs.has(n)) && !things().some((b) => b.side === o && (b.q || []).includes(c))); if (c) { learn(o, c); extra = WW.scroll.replace('{name}', T[c].name); }
```

## 13. RULE: raiseTo (E852) is dead code
econ.js:75 is exported at line 638, but nothing calls `raiseTo` (grep over the whole snapshot finds only econ.js). If it is ever wired up, note that it calls `FK.unbuild(t)` without the `while (t.q && t.q.length) unqueue(t)` that cancel() (econ.js:79) does. Everything queued would be lost with no refund, and a queued age would leave `aging` stuck as in finding 4. Smallest fix: remove it. Both lines must change, or the module throws a ReferenceError at load.
```diff
--- a/econ.js
+++ b/econ.js
@@ -75 +74,0 @@
-function raiseTo(side, t, code) { const { i, j } = t, hp = t.hp, old = t.code; if (!canPay(side, D.cost[code] || {}) || capWhy(side, code)) return null; FK.unbuild(t); const u = plan(side, code, i, j); if (u) return u; const b = FK.build(old, i, j, SIDES[side].col); if (b) b.hp = hp; return null; } // E852
@@ -638 +637 @@
-return { toJob, letOut, idlers, isFull: (u, t) => !!t && t.kind !== 'bld' && t.kind !== 'unit' && (full(u, t) || !FK.spotFor(u, t)), garrison, lot, focused, queuedAt, schedule, spawnBy, lockWhy, raiseTo, danger, shelter, guides, spot, yieldAge, limitOf, priceOf, peaceAll, truceAll, truceFor, opened: () => opened, peaceTick, standDown, crowns, chron, setCiv, deal: (d) => { deal = d; }, finds, hireWhy, hire, ignite, douse, burn, lightning, shot, fireMul, eta, heat, sickRisk, outbreak, health, plague: () => plague, campLayout, campCells, campWhy, campCap, campsOut, campWhyTrain, campOf, unpack, sendWagon, depots, supply, tentCost, declareWar, makePeace, makeAlly, noticeLeft, relWhy, envoyWhy, setRel, sendEnvoy, judgeEnvoy, sendHelp, regardOf, addRegard, giftGain, giftWhy, giveGift, struck, vassalsOf, shareUp, loyaltyParts, makeVassal, surrenderWhy, demandSurrender, overlordWhy, offerOverlord, breakTies, demandCost, demandWhy, demand, tributeWhy, forceTribute, levyOf, levyRoom, levyWhy, levy, releaseLevy, releaseAll, rebel, vassals, investText, tell, nameOf2, stock: () => stock, goingPrice, sellPrice, buyPrice, marketTrade, bulkPay, wonderLeft: () => { const w = wonderUp(); return w && { mine: w.side === ME, left: w.held - bell, word: EW.count }; }, debase, venture, returnOf, interest, makeOf, setMake, scaleOf, stops, postOn, priceAt, cargo, estPay, setRoute, bestTarget, allyMarket, guarded, teachTo, teachCost, teachSecs, teachWhy, teach, graduate, takePrisoner, prisonersOf, payRansom, ransomOf, zealCost, zealWhy, zeal, intel, threat, alarm, allClear, prep, boardCost, alarmOn: () => !!emg, unsafe, dangerWhy, within, hold, fall, fell: (side) => fell.has(side), eats, hungerOf, docked, nature, upkeep, seasonTurn, rateOf, harvest: () => harvest.m, replantCost, replantWhy, replant, cutOut, replantAll, hunt, at, capWhy, placeWhy, snap, refund, repairCost, wallLine, lay, sealPath, wallish, autoBuilder, builder, room, lineFor, lineAt, forage, forageNow, capOf, searchR, boxCut, sendOut, posted, idlePost, startWork, setBell: (s) => { limit = s; }, bell: () => limit, plan, site, cancel, canPlace, canPay, pay, payBack, earn, spend, addRes, sumCost, flowOf, outOf, netOf, velOf, queue, unqueue, timeOf, nameOf, musterN, musterCost, musterWhy, muster, ageUp, ageCost, nextAge, research, researchWhy, lineOf, prevOf, needsOf, nextStep, assign, jobs, jobOf, popOf, popCap, armyRoom, armyFull, soldier, villagersOf, gatherAt, buildAt, carry, idle, bestFind, yieldOf, up, score, time: () => bell, result: () => result, YIELDS }; // E1522
+return { toJob, letOut, idlers, isFull: (u, t) => !!t && t.kind !== 'bld' && t.kind !== 'unit' && (full(u, t) || !FK.spotFor(u, t)), garrison, lot, focused, queuedAt, schedule, spawnBy, lockWhy, danger, shelter, guides, spot, yieldAge, limitOf, priceOf, peaceAll, truceAll, truceFor, opened: () => opened, peaceTick, standDown, crowns, chron, setCiv, deal: (d) => { deal = d; }, finds, hireWhy, hire, ignite, douse, burn, lightning, shot, fireMul, eta, heat, sickRisk, outbreak, health, plague: () => plague, campLayout, campCells, campWhy, campCap, campsOut, campWhyTrain, campOf, unpack, sendWagon, depots, supply, tentCost, declareWar, makePeace, makeAlly, noticeLeft, relWhy, envoyWhy, setRel, sendEnvoy, judgeEnvoy, sendHelp, regardOf, addRegard, giftGain, giftWhy, giveGift, struck, vassalsOf, shareUp, loyaltyParts, makeVassal, surrenderWhy, demandSurrender, overlordWhy, offerOverlord, breakTies, demandCost, demandWhy, demand, tributeWhy, forceTribute, levyOf, levyRoom, levyWhy, levy, releaseLevy, releaseAll, rebel, vassals, investText, tell, nameOf2, stock: () => stock, goingPrice, sellPrice, buyPrice, marketTrade, bulkPay, wonderLeft: () => { const w = wonderUp(); return w && { mine: w.side === ME, left: w.held - bell, word: EW.count }; }, debase, venture, returnOf, interest, makeOf, setMake, scaleOf, stops, postOn, priceAt, cargo, estPay, setRoute, bestTarget, allyMarket, guarded, teachTo, teachCost, teachSecs, teachWhy, teach, graduate, takePrisoner, prisonersOf, payRansom, ransomOf, zealCost, zealWhy, zeal, intel, threat, alarm, allClear, prep, boardCost, alarmOn: () => !!emg, unsafe, dangerWhy, within, hold, fall, fell: (side) => fell.has(side), eats, hungerOf, docked, nature, upkeep, seasonTurn, rateOf, harvest: () => harvest.m, replantCost, replantWhy, replant, cutOut, replantAll, hunt, at, capWhy, placeWhy, snap, refund, repairCost, wallLine, lay, sealPath, wallish, autoBuilder, builder, room, lineFor, lineAt, forage, forageNow, capOf, searchR, boxCut, sendOut, posted, idlePost, startWork, setBell: (s) => { limit = s; }, bell: () => limit, plan, site, cancel, canPlace, canPay, pay, payBack, earn, spend, addRes, sumCost, flowOf, outOf, netOf, velOf, queue, unqueue, timeOf, nameOf, musterN, musterCost, musterWhy, muster, ageUp, ageCost, nextAge, research, researchWhy, lineOf, prevOf, needsOf, nextStep, assign, jobs, jobOf, popOf, popCap, armyRoom, armyFull, soldier, villagersOf, gatherAt, buildAt, carry, idle, bestFind, yieldOf, up, score, time: () => bell, result: () => result, YIELDS }; // E1522
```

## 14. FRAMES (moderate): town() and camped() rebuild the depot list once per unit
econ.js:534 `town` runs `!!depotFor(u)` per unit, and depotFor runs `depots(u.side)`, which is `FK.blds().filter(...).filter(alive)`, a fresh array each time. town() runs for every side on every health beat (5 s) and in outbreak(). upkeep → camped() (econ.js:458) does the same for every armed unit on every peace beat. Fix: compute the depots once per call.
```diff
--- a/econ.js
+++ b/econ.js
@@ -534 +534 @@
-const town = (side, k) => units().filter((u) => u.side === side && !u.inside && !u.gone && u.hp > 0 && (dist(u, k) < HE.near * D.tile || !!depotFor(u)));
+const town = (side, k, ds = depots(side)) => units().filter((u) => u.side === side && !u.inside && !u.gone && u.hp > 0 && (dist(u, k) < HE.near * D.tile || ds.some((d) => dist(d, u) < CA.reach * D.tile)));
```
---
### Checked and found sound (no finding)
- Save/load: the econ save (line 636) and load (line 637) round-trip. pack() handles the Maps and Sets (`emg`, `fell`, `lit`, `notice`, `gangs`) and unit refs, `harvest` is a plain row, and refill() restores the kept containers. The save handler returns true after `result`, which refuses the save on purpose.
- No Math.random, Date.now or performance.now in econ.js. All randomness goes through FK.rng. `localStorage` (finish, line 335) only stores the best score.
- lineAt and queue (E1520/E1521) match their comments. A not-yet-built tapped building refuses even when a sister line has room (`!up(b)` is checked after lineAt). That is minor and arguably correct.
- Comments E349 ("a field and game for nothing") and E486 ("a way it cannot walk ends its run") explain two things that look like bugs (farmers eat free, and a caravan route ends on a failed path), so neither is reported.
- Small allocations, not worth reporting: `units().slice()` 3 times per tick (lines 360, 469, 596). The one at line 360 isn't needed, because graduate() removes nothing.
