# idx2 review: index.html lines 301-600 (snapshot /home/claude/rv at 1d0379ea)

Range: the end of renderGround (301-365), the ground replay and scars (367-379), the view (381-388), hooks, stat, learn, loop (390-418), save and load (420-456), the sheets slideSheet (457-462), draw (463-471), the brushes and building art (472-600).

Counts: CRASH 2, PLAY 3, FRAMES 4, RULE 3 (12 findings).

How I checked the save: I ran the snapshot's own pack()/unpack() text (index.html 424-438, read from the file, with stubs for the globals) in node: /tmp/idx2/rt.js, rt2.js, rt3.js.

---

## 1. PLAY: a save breaks up every Fall back group (u.fall)
**combat.js:232-234, index.html:429, 433** (E681, E1432)

What the lines say:
- combat.js:232 `for (const u of G) Object.assign(u, { fall: F, fb: Infinity, focus: null, ord: null, sent: false });` gives the soldiers one shared list. E1432 says "one shared list, so the group is known".
- combat.js:233 `(by.get(u.fall) || by.set(u.fall, []).get(u.fall)).push(u)` groups them by **which list object** they hold.
- index.html:429 `walk`: `if (v.constructor === Object) { if (seen.has(v)) return void twice.add(v); seen.add(v); }` counts only plain records. Lists, Maps and Sets are never counted.
- index.html:433 `if (!k || v.constructor !== Object || ids.has(v)) return v;` writes a list out in full every time it is met. E681 promises one record "held in two places" only for plain records.

Run result (rt.js): `u1.fall === u2.fall after load: false`, `fall-back groups before load: 1, after load: 2`. In the same run O.band, u.ord, the ORD Set and MS keep one shared order, and `fb: Infinity` comes back as Infinity.

What happens: he sends 12 soldiers on Fall back, switches apps, and the phone drops the tab (save(true) runs on visibilitychange). When he reopens, each soldier is a group of one. E1434's rule ("once none of a group is still marching ... each goes back in") is now checked one soldier at a time. The first soldier to reach his spot turns and goes back in alone, then the next one, and so on.

Smallest fix: keep the shared list inside a shared plain record, which the save already keeps as one. rt2.js gives `after load: 1`.
```diff
--- a/combat.js
+++ b/combat.js
@@ -232 +232 @@
-  for (const u of G) Object.assign(u, { fall: F, fb: Infinity, focus: null, ord: null, sent: false }); return G.length; } // E1432
+  const W = { foes: F }; for (const u of G) Object.assign(u, { fall: W, fb: Infinity, focus: null, ord: null, sent: false }); return G.length; } // E1432
@@ -234 +234 @@
-  for (const [F, G] of by) if (!G.some((u) => status(u) === 'march')) { const L = F.filter(alive); for (const u of G) { Object.assign(u, { fall: null, fb: null }); if (L.length) fight(u, L.reduce((a, b) => (gap(u, a) <= gap(u, b) ? a : b)), true); } } } // E1434
+  for (const [W, G] of by) if (!G.some((u) => status(u) === 'march')) { const L = W.foes.filter(alive); for (const u of G) { Object.assign(u, { fall: null, fb: null }); if (L.length) fight(u, L.reduce((a, b) => (gap(u, a) <= gap(u, b) ? a : b)), true); } } } // E1434
```
E1432's text in books/comments.js would then say "one shared record". Nothing else reads u.fall (I grepped all 6 files). General rule for the future: anything held in two places that must stay one thing after a load has to be a plain record, not a list, Map or Set.

## 2. CRASH: a save from an earlier publish is laid onto the new build's map by position, with no check
**index.html:425, 427, 434, 428/453, 439**

What the lines say:
- 427: a thing from the fresh map is saved only as its position, `const n = base.get(t); ... return Object.keys(d).length ? { [TG.base]: n, ...d } : n;`.
- 434: `typeof e === 'number' ? fresh[e] : TG.base in e ? Object.assign(fresh[e[TG.base]], e) : e)); S.things.forEach((t) => delete t[TG.base]);`
- 428/453: H, OCC, FOR, MARSH and RUTS are restored by cell number.
- 439: the slot key is `SV.key + location.pathname`, so it is the same slot across every publish to /first-keep/fresh/. pack's `S` (425) holds no stamp of the build or of the map it was laid on.

What happens: Albert publishes a build that changes any number that places trees, rocks or ground. The phone reopens and boot() loads the old save onto a map made by the new rules.
- (a) If the new map has fewer starting things, `fresh[e]` is undefined. rt3.js: `unpack threw: TypeError: Cannot convert undefined or null to object`. boot's catch (1781) then starts a new game, and its first autosave writes over the old game. The game is lost.
- (b) If the count is the same, the saved changes land on whatever thing now has that position. rt3.js: a cut tree's `{amount: 0, gone: true}` landed on a gold mine (`{"kind":"gold","amount":0,"gone":true}`). The world is quietly wrong.
- (c) Related: if a research id is renamed in books, the loaded `known` still holds the old id, and stat() at 400 `BOOKS.tech[t].value.fx` throws on the first lookup for that side (TypeError).

Smallest fix: stamp the save with the count of starting things and refuse a save that doesn't match. boot then names the reason with WS.saveBad. Saves with no stamp still load. Catching (b) completely would take a stamp of the map itself, for example D.version, but then every publish would refuse the old save. That is his call.
```diff
--- a/index.html
+++ b/index.html
@@ -425 +425 @@
-function pack() { const all = [...things, ...units], ids = new Map(all.map((t, n) => [t, n])), base = new Map(BASE0.things.map((t, n) => [t, n])), S = { seed, dice: play.at(), things: [], units, K, SIDES, known, HZ, arr: {}, fog: { on: FOGON, exp: [...EXPL].map(([s, a]) => [s, a.reduce((o, v, c) => (v ? (o.push(c), o) : o), [])]), mem: MEM } }; // E657
+function pack() { const all = [...things, ...units], ids = new Map(all.map((t, n) => [t, n])), base = new Map(BASE0.things.map((t, n) => [t, n])), S = { seed, base: BASE0.things.length, dice: play.at(), things: [], units, K, SIDES, known, HZ, arr: {}, fog: { on: FOGON, exp: [...EXPL].map(([s, a]) => [s, a.reduce((o, v, c) => (v ? (o.push(c), o) : o), [])]), mem: MEM } }; // E657
@@ -434 +434 @@
-function unpack(S) { const fresh = BASE0.things; S.things = S.things.map(
+function unpack(S) { const fresh = BASE0.things; if (S.base != null && S.base !== fresh.length) throw new Error(WS.saveBad); S.things = S.things.map(
```
(The rest of line 434 is unchanged.)

## 3. CRASH (I found no sure trigger): one error while a sheet paints leaves every later frame drawing off screen
**index.html:461** (E889, E893)

What the line says: `S.n = (S.n || 0) + 1; S.key = k; S.t = now; ... const main = ctx; ctx = S.x; ctx.setTransform(dpr, 0, 0, dpr, M * dpr, M * dpr); paint(); ctx = main;`

What happens: if anything inside paint throws, `ctx = main` never runs. That covers drawGround, drawPaper, drawSkin, drawFog and drawMist. loop's catch (418) only calls fault(), so the global `ctx` is still the sheet's context. On the next frame `const main = ctx` captures the sheet again, and every frame from then on draws into the hidden sheet. The map on screen stops changing until he reloads, while the HTML menus keep working. S.key and S.t were also set before painting, so the half-painted sheet is treated as good for up to 10 s (D363 ms). fault() only pauses and shows a message from the second different error (422), so the first one just freezes the map. I found no certain throw in those paints today, so how likely this is: unsure.
```diff
--- a/index.html
+++ b/index.html
@@ -461 +461 @@
-  if (k !== S.key || r !== 1 || Math.abs(dx) > M || Math.abs(dy) > M || now - S.t > ms) { S.n = (S.n || 0) + 1; S.key = k; S.t = now; S.cx = cam.x; S.cy = cam.y; S.z = cam.z; dx = dy = 0; S.c.width = Math.ceil((cw + M + M) * dpr); S.c.height = Math.ceil((ch + M + M) * dpr); const main = ctx; ctx = S.x; ctx.setTransform(dpr, 0, 0, dpr, M * dpr, M * dpr); paint(); ctx = main; }
+  if (k !== S.key || r !== 1 || Math.abs(dx) > M || Math.abs(dy) > M || now - S.t > ms) { S.n = (S.n || 0) + 1; S.key = k; S.t = now; S.cx = cam.x; S.cy = cam.y; S.z = cam.z; dx = dy = 0; S.c.width = Math.ceil((cw + M + M) * dpr); S.c.height = Math.ceil((ch + M + M) * dpr); const main = ctx; ctx = S.x; try { ctx.setTransform(dpr, 0, 0, dpr, M * dpr, M * dpr); paint(); } catch (e) { S.key = ''; throw e; } finally { ctx = main; } }
```
The rest of slideSheet checks out. I worked through the stretch offset `ox = cw/2 - (cw/2 + M) * r + dx`: it maps the sheet's corner to the right spot on screen at the new zoom. The cover test, the √2 step (STEP, 1220), settle and dirty() together make sure a fresh paint follows a pinch. Key changes for size or dpr force a repaint. MISTS (1454) and STEP are defined before the first draw.

## 4. PLAY: after a load every idle villager counts as idle "since time 0" and walks home at once
**index.html:452** (E661), read by econ.js:265 (E1300)

What the lines say:
- 452 `things = S.things; units = S.units; units.forEach(jobDoor); Object.assign(K, S.K);`, so jobDoor runs before K is restored.
- jobDoor (1094) stamps `u[JB] = { j, was: null, t: K.t }`. At that moment K.t is still the 0 that start() set (1780 `K.t = ... = 0`). JB is a Symbol (1093), so the real record is never in the save.
- econ.js:265 homeIdle skips a villager while `FK.K.t - FK.jobWas(u).t < IH.home` (E1300: "idle a minute ... walks to the nearest town center").

What happens: he leaves three villagers idle by the woods for 5 s and switches apps. On reopen, K.t minus 0 is well over a minute, so every idle gatherer who isn't parked (and wasn't sent home in the last minute, `u.homeT`, which is saved) starts walking to the town center straight away instead of a minute later. The smallest fix stamps the record with the save's time, so after a load they wait a full minute. An exact fix would need the record saved, and a Symbol key keeps it out of the save.
```diff
--- a/index.html
+++ b/index.html
@@ -452 +452 @@
-function load(R) { WALKV++; TV++; const S = unpack(R); things = S.things; units = S.units; units.forEach(jobDoor); Object.assign(K, S.K); S.SIDES.forEach((s, n) => Object.assign(SIDES[n], s)); refill(known, S.known); FXC.clear(); refill(HZ, S.HZ); if (S.dice != null) play.at(S.dice); // E661
+function load(R) { WALKV++; TV++; const S = unpack(R); things = S.things; units = S.units; Object.assign(K, S.K); units.forEach(jobDoor); S.SIDES.forEach((s, n) => Object.assign(SIDES[n], s)); refill(known, S.known); FXC.clear(); refill(HZ, S.HZ); if (S.dice != null) play.at(S.dice); // E661
```

## 5. PLAY: every reload wipes the battle marks off the ground
**index.html:304, 376-379, 454** (E546, E549, E550)

What the lines say:
- 304 (inside renderGround): `scarCv.width = ...; scarX = scarCv.getContext('2d'); ... for (const t of things) if (t.kind === 'bld' && ...) wear(t);` clears the layer and puts back only the worn earth round buildings.
- fallen() (376) and burnt() (378) draw straight onto the layer. They are called only at death (1339), and nothing records them.
- load() calls renderGround() (454). pack() saves nothing about scars.

What happens: after a battle the ground shows where men fell and the burnt rubble of a lost house. The phone drops the tab and on reopen the field is clean. E549 and E550 marks are lost on every reload. The game is unchanged; only the look is lost.

Smallest fix: record what each mark needs, save it, and replay it after the ground is laid again. renderGround clears the list, so a new map starts empty and a load fills it back by replaying. Each mark adds about 60 bytes to the save.
```diff
--- a/index.html
+++ b/index.html
@@ -304 +304 @@
-  scarCv.width = Math.ceil(gw * SC.res); scarCv.height = Math.ceil(gh * SC.res); scarX = scarCv.getContext('2d'); scarX.scale(SC.res, SC.res); for (const t of things) if (t.kind === 'bld' && (t.side === ME || memOf(ME).has(t))) wear(t); // E546
+  scarCv.width = Math.ceil(gw * SC.res); scarCv.height = Math.ceil(gh * SC.res); scarX = scarCv.getContext('2d'); scarX.scale(SC.res, SC.res); SCARS.length = 0; for (const t of things) if (t.kind === 'bld' && (t.side === ME || memOf(ME).has(t))) wear(t); // E546
@@ -373 +373 @@
-const SC = D.scars, SCAR = C.scar, scarCv = document.createElement('canvas'); let scarX = null, SCARV = null; // E547
+const SC = D.scars, SCAR = C.scar, scarCv = document.createElement('canvas'), SCARS = []; let scarX = null, SCARV = null; // E547
@@ -376 +376 @@
-function fallen(u) { const F = SC.fall, [x, y] = onGround(u.bx, u.by), [w] = LOOKBOX[SH[u.code].look] || []; blot(x, y, w > F.big ? F.rx + F.more : F.rx, F.ry, SCAR.fall); if (!ECON.soldier(u.code)) return; // E549
+function fallen(u) { SCARS.push({ f: 1, bx: u.bx, by: u.by, code: u.code }); const F = SC.fall, [x, y] = onGround(u.bx, u.by), [w] = LOOKBOX[SH[u.code].look] || []; blot(x, y, w > F.big ? F.rx + F.more : F.rx, F.ry, SCAR.fall); if (!ECON.soldier(u.code)) return; // E549
@@ -378 +378 @@
-function burnt(b) { if (b.done < 1 || has(b, 'Line') || has(b, 'Gate')) return; const [rx, ry, out, n, turn, step, least, w, h] = SC.burn, r0 = b.n * D.tile * D.place.half, [x, y] = onGround(b.bx, b.by); blot(x, y, r0 * rx, r0 * ry, SCAR.burn); scarX.fillStyle = SCAR.rubble; // E550
+function burnt(b) { if (b.done < 1 || has(b, 'Line') || has(b, 'Gate')) return; SCARS.push({ bx: b.bx, by: b.by, code: b.code, n: b.n, i: b.i, j: b.j, done: b.done }); const [rx, ry, out, n, turn, step, least, w, h] = SC.burn, r0 = b.n * D.tile * D.place.half, [x, y] = onGround(b.bx, b.by); blot(x, y, r0 * rx, r0 * ry, SCAR.burn); scarX.fillStyle = SCAR.rubble; // E550
@@ -425 @@  (in S: add the list)
-... S = { seed, dice: play.at(), things: [], ...
+... S = { seed, dice: play.at(), scars: SCARS, things: [], ...
@@ -454 +454 @@
-  GATES.clear(); for (const t of things) if (has(t, 'Gate')) GATES.set(t.j * N + t.i, t.side); for (const d of DEEP) d.length = 0; DEEPV++; for (const t of things) if (t.kind === 'tree') deepen(t); regrid(); renderGround(); fire('load', S); }
+  GATES.clear(); for (const t of things) if (has(t, 'Gate')) GATES.set(t.j * N + t.i, t.side); for (const d of DEEP) d.length = 0; DEEPV++; for (const t of things) if (t.kind === 'tree') deepen(t); regrid(); renderGround(); for (const s of S.scars || []) (s.f ? fallen : burnt)(s); fire('load', S); }
```
The record carries every field these functions read: has() reads `t.code` (line 44), fallen() reads bx, by and code, and burnt() reads bx, by, code, n, i, j and done. E546 says the layer is "cleared with each map". Whether reopening the app counts as a new map is his call.

## 6. FRAMES: levelOf() copies and filters a side's whole research list for every building, two or three times a frame
**index.html:520-521**, called from 1561, 1592 and 1733 (all per building per frame) and 1719

What the lines say:
- 520: `k = known.get(t.side) || new Set(), at = TECHAT[t.code] || [], n = at.filter((c) => k.has(c)).length;`
- 521: `... : [...k].filter((c) => BOOKS.tech[c].value.tier === art).length, ...`

What happens: with 80 buildings on screen that is more than 160 calls a frame. Each call makes a new Set when the side knows nothing yet, a filtered list, a full copy of the side's research Set (`[...k]`) and a 2-item array. These counts change only when the side learns something. FXC is already the per-side store that learn() (411), start and load clear, so the work can be done once per side and code.
```diff
--- a/index.html
+++ b/index.html
@@ -520,2 +520,3 @@
-const levelOf = (t) => { const [, , , art] = B[t.code], L = SPRITE[art]?.level, k = known.get(t.side) || new Set(), at = TECHAT[t.code] || [], n = at.filter((c) => k.has(c)).length;
-  return [!L ? L : L.season ? season() : L.spent ? +!t.amount : L.flock ? t.sheep : L.age ? +((SIDES[t.side] || {}).age >= L.age) : [...k].filter((c) => BOOKS.tech[c].value.tier === art).length, +!!n + +(!!n && n >= at.length * UPA.half)]; };
+const levelOf = (t) => { const [, , , art] = B[t.code], L = SPRITE[art]?.level, memo = FXC.get(t.side) || FXC.set(t.side, new Map()).get(t.side), id = t.code + ' lv';
+  if (!memo.has(id)) { const k = known.get(t.side) || new Set(), at = TECHAT[t.code] || [], n = at.filter((c) => k.has(c)).length; memo.set(id, [[...k].filter((c) => BOOKS.tech[c].value.tier === art).length, +!!n + +(!!n && n >= at.length * UPA.half)]); }
+  const [tier, up] = memo.get(id); return [!L ? L : L.season ? season() : L.spent ? +!t.amount : L.flock ? t.sheep : L.age ? +((SIDES[t.side] || {}).age >= L.age) : tier, up]; };
```
How many ms this costs on his phone: unsure. I did not run the game.

## 7. FRAMES (load): laying the ground calls contour() 5 x 157,000 times, and each call allocates before checking whether its layer applies
**index.html:333, 348-356** (E759, E779)

What the lines say:
- 333: `for (let p = 0; p < STRATA.length; p++) { ... for (j) for (i) contour(i, j, p); }`. N = D.site / D.tile = 396 and STRATA has 5 layers.
- 348: contour starts by building `cell` (5 lists), `ks`, `v`, `up` and `bs`. Water cells also build `pts` and 4 closures before 356 `if (pass < lo || pass > hi) return;`

What happens: every new game and every load (renderGround) makes roughly 10 million short-lived objects. Nothing is drawn for a pass outside [lo, hi]. I checked each branch: masks need `!pass && !lo`, water needs `!hi && !pass`, and fill needs `pass === lo`. So an early return on the four corner strata, with no allocation, changes nothing. A rough node copy of the allocation pattern ran 414-649 ms as written against 317-360 ms with the early return, on this shared desktop CPU. That is a stand-in, not his phone.
```diff
--- a/index.html
+++ b/index.html
@@ -348 +348 @@
-  function contour(i, j, pass) { const cell = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], ks = cell.map(([x, y]) => y * N + x), v = ks.map((k) => H[k]), up = v.map((h) => Math.max(0, h)), bs = v.map(stratum), lo = Math.min(...bs), hi = Math.max(...bs); // E759
+  function contour(i, j, pass) { const k0 = j * N + i, b0 = stratum(H[k0]), b1 = stratum(H[k0 + 1]), b2 = stratum(H[k0 + N + 1]), b3 = stratum(H[k0 + N]); if (pass < Math.min(b0, b1, b2, b3) || pass > Math.max(b0, b1, b2, b3)) return; const cell = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], ks = cell.map(([x, y]) => y * N + x), v = ks.map((k) => H[k]), up = v.map((h) => Math.max(0, h)), bs = v.map(stratum), lo = Math.min(...bs), hi = Math.max(...bs); // E759
```

## 8. FRAMES (unsure): each sheet repaint sets the canvas size again even when it hasn't changed
**index.html:461**

What the line says: `S.c.width = Math.ceil((cw + M + M) * dpr); S.c.height = Math.ceil((ch + M + M) * dpr);` runs on every repaint. That is each 64 px of pan (M = D363 margin), each zoom that settles, every 10 s for the land, and each fog change for FOGS.

What happens: setting width or height clears the bitmap and resets the context, even to the same value (HTML spec). Whether Safari or Chrome also allocate a new backing store each time depends on the engine (unsure). At 2x that store is about 8 MB on a phone, and iOS has a hard cap on total canvas memory. Smallest fix: resize only when the size differs. Otherwise clear by hand. The land paint fills the whole sheet anyway, but the fog and mist sheets need the clear. The paints would then inherit context state from their last run, so each paint must set its own state, which I did not verify for drawFog and drawMist (unsure).
```diff
-... dx = dy = 0; S.c.width = Math.ceil((cw + M + M) * dpr); S.c.height = Math.ceil((ch + M + M) * dpr); const main = ctx; ...
+... dx = dy = 0; const sw = Math.ceil((cw + M + M) * dpr), sh = Math.ceil((ch + M + M) * dpr); if (S.c.width !== sw || S.c.height !== sh) { S.c.width = sw; S.c.height = sh; } else { S.x.setTransform(1, 0, 0, 1, 0, 0); S.x.clearRect(0, 0, sw, sh); } const main = ctx; ...
```

## 9. FRAMES (unsure): after a refusal the wake lock is asked for again on every sim step (30 a second)
**index.html:455-456** (E696)

What the lines say:
- 456 `on('tick', () => { ... wakeOn(!document.hidden && !resting()); })`
- 455 `if (on && !wakeL && navigator.wakeLock) { ... wakeL = await navigator.wakeLock.request('screen'); } ... } catch (e) { wakeL = null; }`

What happens: when the browser refuses, for example in a home-screen web app on older iOS or in battery saver, wakeL stays null and the next tick asks again. That is 30 refused promises and error objects a second for the whole match. Whether his phone refuses: unsure. Fix: stop asking after a refusal until the page is shown again.
```diff
-let wakeL = null, wakeP = false; const wakeOn = async (on) => { if (wakeP) return; try { if (on && !wakeL && navigator.wakeLock) { wakeP = true; wakeL = await navigator.wakeLock.request('screen'); } else if (!on && wakeL) { const w = wakeL; wakeL = null; await w.release(); } } catch (e) { wakeL = null; } wakeP = false; }; // E696
+let wakeL = null, wakeP = false, wakeNo = false; const wakeOn = async (on) => { if (wakeP) return; try { if (on && !wakeL && !wakeNo && navigator.wakeLock) { wakeP = true; wakeL = await navigator.wakeLock.request('screen'); } else if (!on && wakeL) { const w = wakeL; wakeL = null; await w.release(); } } catch (e) { wakeL = null; wakeNo = !!on; } wakeP = false; }; // E696
-... document.addEventListener('visibilitychange', () => { if (document.hidden) { save(true); wakeOn(false); } });
+... document.addEventListener('visibilitychange', () => { if (document.hidden) { save(true); wakeOn(false); } else wakeNo = false; });
```

## 10. RULE: numbers chosen in the view and ground code, and fit() has no code
**index.html:303, 321, 361, 386, 387**

What the lines say:
- 386 `cam.z = Math.min((cw - 24) / (r - l), (ch - 200) / (b - t)); zmin = cam.z / 2;` (24 px, 200 px, half). fit() has no E-code.
- 387 `dpr = Math.min(2, devicePixelRatio || 1)`
- 303 `m.width = Math.ceil(gw / 4); ... q.scale(0.25, 0.25)`
- 321 `q.lineTo(b[0] + 2, b[1]); ... d[1] + 2` (2 px bleed)
- 361 `if (tl - bl < 0.01 && tr - br < 0.01) continue;`

A side risk, unsure if he ever gets there: on a window 200 px tall or less (split screen), `ch - 200 <= 0` makes cam.z zero or negative, and the map draws flipped or not at all. Fix: move these into the measure book with a reason and give fit() a code.
```diff
-function fit() { const [l, t] = toView(B0, B0, D.land), [r, b] = toView(B1, B1, 0); cam.x = (l + r) / 2; cam.y = (t + b) / 2; cam.z = Math.min((cw - 24) / (r - l), (ch - 200) / (b - t)); zmin = cam.z / 2; }
+function fit() { const F = D.open.fit, [l, t] = toView(B0, B0, D.land), [r, b] = toView(B1, B1, 0); cam.x = (l + r) / 2; cam.y = (t + b) / 2; cam.z = Math.min((cw - F.side) / (r - l), Math.max(F.least, ch - F.top) / (b - t)); zmin = cam.z * F.out; } // E(new)
```
The book entry `open.fit {side, top, least, out}` and the dpr cap need adding in books/measure.js. The names are mine.

## 11. RULE: dead code
**index.html:472; 390 with 1752**
- 472 `function path(points) { ctx.beginPath(); ... }` is never called. Searching all 6 files for `path(` outside a property finds only this definition, and FK does not export it. The `path` at 351, 1078 and 1456 are local variables.
- 390 HOOK `hold: []` has no listener in any file, so `fire('hold', press, ...)` at 1752 always returns false.
```diff
-function path(points) { ctx.beginPath(); points.forEach((p, n) => (n ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); }
```

## 12. RULE: the building art is drawn with fixed numbers and colours in code
**index.html:480-600** (E71, E72)

Examples:
- 480 wheel: `'#3a2814'`, `0.5`, `6` spokes
- 483 TOWER_LOOK `{ w: 8, h: 44, wall: '#a29d90', flag: 7 }`
- 484-492 STONE, PLASTER and the other colour constants
- 532 `NS_rng(5)` and `i < 40`
- 536 texture `[2.6, 4.4]` and `x0 + (r % 2) * 2.2`
- 540 `i < 30`, `7.3`, `3.7`
- 594 `block(50, 22, PLASTER, 'timber', 'gable', TILE, 12)`

E72 calls this art "drawn from its own point lists". If he has agreed that the hand-drawn art is exempt from rule 1, ignore this finding. If not, there is no small diff: the art needs a SPRITE book pass.

---

## Checked and found sound (asked about by the main session)
- **O.band**: lives inside the order O, a plain record shared by u.ord, combat's ORD and MS. It is saved once and comes back as one object with `foes` and `live` pointing at the live units (rt.js). `frontOf`'s `B.at === K.t` cache stays consistent because K is restored.
- **u.aim `{t, told, w}`**: not in this snapshot (1d0379ea). It is in the main repo HEAD 35ae3f84, combat.js:100-102, which I read only. Each unit gets its own plain record with `t` and `w` as unit or thing links, so they save as positions in the lists and come back as the same objects. The 'gone' hook's `u.target === u.aim.w` still matches after a load. A dead `t` comes back as a detached copy, which `alive()` rejects. It round-trips.
- **AI plans**: each side's dealt plan (`hand`, ai.js:15-22) is rebuilt from the seed. makeGround takes S.seed on load, and nothing writes into the dealt plan after dealing. Per-side state (`mind`, including skip, mark, markT and the Infinity in plan.t) plus clock, rings, claimT, helped and league go through the 'save' hook and refill(). In-flight think generators (TASKS) are dropped. start clears them, and the AI simply thinks again on its next clock beat.
- Units that reference a unit or thing no longer in the lists (dead targets) come back as one detached copy per object. These copies are shared correctly through own/same, and `alive()` is false on them.
- Infinity, -Infinity and NaN (`$N`), Map and Set tags, the fog's explored cells and memory, the K fields, and the H/OCC/FOR/MARSH/RUTS diffs (start re-lays and clears them before BASE0 is taken, 1780) all round-trip. pack silently drops any typed array or class instance. I searched for one on a unit or order field and found none. The typed arrays I found are module caches (PF, DANGER), and they are rebuilt.
- Every `on('x')` name exists in HOOK. menu.js's `on('wood')` and `on('gold')` are a local counter function, not the hook.

Scratch files: /tmp/idx2/rt.js, /tmp/idx2/rt2.js, /tmp/idx2/rt3.js, /tmp/idx2/bench.js
