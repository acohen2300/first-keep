# menu2: menu.js 257-513 (render, War card, dark patch, press, input), plus what they call

Snapshot /home/claude/rv (1d0379ea). Read-only. Nothing was run in a browser (the brief forbids it), so every ms figure below is an estimate and is marked that way.

## How often render runs (the facts the frame findings rest on)

- Beat: `FK.on('tick', …) acc += real; if (acc >= D.beatUi) { acc = 0; render(); }` (392-393), with D162 `beatUi` 0.25 s of real time. That is about 4 calls a second while the game runs and none while it is paused.
- `tick` fires inside the sim step: `const sim = (dt) => { climate(dt); step(dt); fire('tick', dt); … }` (index.html:417), called from the catch-up loop `while (… performance.now() - w0 < SIM.budget)` (index.html:418, D343 budget 12 ms). So render's time is charged to the sim's 12 ms budget, on the frame it lands in.
- A non-forced call builds every string (`read()`, top bar, `page()`, `mold()`, `mline`, `mbase`) and then stops at `if (!force && sig === S.last) return;` (283). It only does the full DOM pass (puts, rings, fit, **patches**, measuring) when the card or rank text changed. That happens on most beats with War open during a fight (the who-row counts), a building site picked (`${Math.floor(t.done * MO.pct)}%`, 247), a crew picked (`stateOf(L)`), or a resource picked (`reading(t)`). It also happens on every tap: `act()` ends in `render(true)` (184), and so do `heard`, `pickToggle` and others.
- **The patch is not per frame.** `patches()` has one caller, render (285; `MENU.patches` is exported but nothing calls it: grep of index/combat/econ/ai/sound). It runs at most once per full render.

Findings 1-6 are ranked by frames saved. 7-15 are not about frames.

---

## 1. FRAMES: a full render forces 3-5 synchronous layouts, because it writes and reads the page in turn (menu.js:284-286)

```
284  put($('panel'), html); $('panel').className = …; w2(); put($('card'), card); … ui.classList.toggle('sheet', …); ringMount(ui); chevs(); // E205
285  put($('base'), bh); $('base').className = 'mb'; ringMount($('base')); put($('rank'), rk6); fit(ui); patches(); { … [$('card'), $('panel'), $('rank'), $('base')].filter((e) => e.offsetHeight).map((e) => e.getBoundingClientRect().top) … }
286  ringMount(spdEl); chevs(); …
```
`w2()` reads `ui.clientWidth` (276). `ringMount` reads `getComputedStyle`, `clientWidth` and `offsetWidth` for each ring (63). `fit` reads `offsetWidth` (67). `patches` reads rects (39). The block after `patches()` reads `offsetHeight` and rects. Each of these reads comes right after a `put()` or a style write, so the browser has to lay the page out on the spot, several times within one call:
put panel → `w2` read (layout) → … → put base → `ringMount(base)` (layout) → put rank → `fit` (layout) → `patches` writes → bars read (small layout).
Waste on top of that: `ringMount(ui)` already measured the rings in the **old** `#base` before `put(base)`, and the first `chevs()` is redone by the document-wide one at 286.
What a player sees: about 4 times a second (War in a fight, a site or crew picked) and on every tap, one frame gets 2-3 extra full-page layouts, plus a second pass over every ring in the bottom card. Because this runs inside the sim step, a slow phone also loses catch-up steps that frame (the 12 ms budget). Cost on a phone is unsure; my guess is about 0.5-1.5 ms per extra layout for this DOM.
Fix: do all the writes first, then the reads, and make one ring pass:
```diff
@@ menu.js:284-285 (fragments; the rest of each line unchanged) @@
-  put($('panel'), html); $('panel').className = …; w2(); put($('card'), card); $('card').className = card && !S.tab ? 'on' : ''; ui.classList.toggle('sheet', sheet() || !!card); ringMount(ui); chevs(); // E205
-  put($('base'), bh); $('base').className = 'mb'; ringMount($('base')); put($('rank'), rk6); fit(ui); patches(); {
+  put($('panel'), html); $('panel').className = …; put($('card'), card); $('card').className = card && !S.tab ? 'on' : ''; ui.classList.toggle('sheet', sheet() || !!card); // E205
+  put($('base'), bh); $('base').className = 'mb'; put($('rank'), rk6); w2(); ringMount(ui); fit(ui); patches(); {
```
`w2()` still runs before `ringMount(ui)`, so the narrow cards have their width when their rings are measured. The `chevs()` at 286 still covers every `.ihr`. This pairs with menu1 #6, which fixes the read/write order inside `ringMount`.

## 2. FRAMES: `fit()` forces one layout for each newly built tile (menu.js:67, called at 285)

```
for (const c of …'.mt .cell'…) for (const n of [...c.childNodes]) { … e = document.createElement('span'); n.replaceWith(e); e.append(n); } … const k = (c.clientWidth - pad) / e.offsetWidth; e.style.transform = …
```
`put()` swaps a cell whose markup changed for a new element, and the new element's words are bare text again. So for each such cell, `fit` does a DOM insert and then immediately reads `offsetWidth`, which forces a layout. What a player sees: when a row of tiles is rebuilt (Build prices changing colour, job counts, a new card opening), there is one forced layout per tile, about 6 in one frame.
Fix: three passes (wrap everything, read everything, then write the transforms):
```diff
@@ menu.js:67 @@
-function fit(root) { const F = SCR.dock.fit, pad = SCR.css.edge; for (const c of root.querySelectorAll(SEL)) for (const n of [...c.childNodes]) { …wrap… } else if (!n.matches('small, span:not(.bar):not(.t)')) continue; const k = (c.clientWidth - pad) / e.offsetWidth; e.style.transform = k < 1 ? `scaleX(${Math.max(F, k)})` : ''; } } // E1120
+function fit(root) { const F = SCR.dock.fit, pad = SCR.css.edge, L = []; for (const c of root.querySelectorAll(SEL)) for (const n of [...c.childNodes]) { …wrap… } else if (!n.matches('small, span:not(.bar):not(.t)')) continue; L.push([c, e]); } const K = L.map(([c, e]) => (c.clientWidth - pad) / e.offsetWidth); L.forEach(([, e], i) => { e.style.transform = K[i] < 1 ? `scaleX(${Math.max(F, K[i])})` : ''; }); } // E1120
```
(SEL is the unchanged selector string. A transform doesn't change `offsetWidth`, so the results are the same.)

## 3. FRAMES (spike): an army on thin ice triggers one full forced render per cracking tile, all in the same tick (menu.js:365)

```
FK.on('cracking', (k, mine) => { if (!mine) return; …; S.crack = { px: x, py: y, t: FK.K.t }; say(WI.crack); render(true); }); // E795
```
index.html:1043 fires `cracking` once for each overloaded tile in one ice beat (`for (const [k, kg] of load) … fire('cracking', k, …)`). `render(true)` skips the `sig` check, so 8 tiles under a marching army mean 8 complete forced renders, each with finding 1's layouts, in one sim step. That is a frame spike every time he crosses ice (unsure, maybe 10-40 ms).
Fix: let the next beat draw it (at most 0.25 s later):
```diff
@@ menu.js:365 @@
-… S.crack = { px: x, py: y, t: FK.K.t }; say(WI.crack); render(true); }); // E795
+… S.crack = { px: x, py: y, t: FK.K.t }; say(WI.crack); S.last = ''; }); // E795
```

## 4. FRAMES and look: the dark patch (E1303-E1306): what it costs, and where it goes stale (menu.js:38-40, 285)

**What it costs.** Each full render (not each frame), `floaters()` walks every text node in `#rank` and `#base .mctl` (about 5-25 words: the War who-row is around 16 text nodes, with no card picked about 4). For each word it does up to 3 `closest()` calls and `e.textContent.trim()` twice (inside `key`), and measures one rect. A bare word is measured through a new `Range`. It then allocates a `DOMRect`, a string key and a `Map` entry. `patches()` then writes className and four style values for each patch. It is also the first read after `put(rank)` + `fit`, so it is the one that triggers that layout. My estimate is 0.2-1 ms per full render on a phone (unsure), at most about 4 a second plus taps. **It isn't the main frame cost.** Findings 1-3 are, and E1306's per-word brightness read, which was the real per-frame cost, is gone. Removing the patch alone wouldn't stop the hitches; doing 1-3 would.
**Where it goes stale** (it is measured only when the card text changes):
- After a tap on a floating word (Home, Jobs, Build, a War tab, a who-row word, the fold "−"), `act()` → `render(true)` → `patches()` measures the button while E1307 has it at `scale(1.06)`. The rect includes the transform (`getBoundingClientRect`, and Range rects), and `repress` sets the scale with no transition. When the button springs back, the patch stays about 6% too big. It stays that way until the next full render, which in a quiet state (no card picked) may not come until his next tap.
- When the web fonts swap in (fonts.css uses `font-display: swap`), nothing measures again. Unsure whether it is visible.
- At game end, see finding 8.
Proposal (talk, not build; RULES 10): draw the patch with CSS as the floating element's own background (`.bx`/`.tt` take it as is; bare words need a span with the patch padding `SCR.mold.gap + SCR.css.edge` / `hair + edge`, and an equal negative margin so nothing moves). That costs nothing per render, scales with the press, follows fonts and resizes, and goes away with its word. It would replace E1304-E1306 and `#patch`.

## 5. FRAMES (low): in War, the top bar is written before the War card reads the layout (menu.js:279 vs 222, 253, 257)

`put(topEl, topbar(r))` (279) runs first, and the top bar text changes on most beats (the clock, the stores). Then `mold()` → `MOLD.war` → `framer()` → `rimOf('.strip','bottom')`/`rimOf('#rank','top')` (`getBoundingClientRect`, 222). So every War render lays out once for the top bar alone, and then again after the card's puts.
Fix: build the strings first, then put the top bar:
```diff
@@ menu.js:279-283 (fragments) @@
-  const tbNew = put(topEl, topbar(r)); if (tbNew || force) ringMount(topEl);
+  const top = () => { if (put(topEl, topbar(r)) || force) ringMount(topEl); };
-  if (r.result) { S.tab = null; …
+  if (r.result) { top(); S.tab = null; …
-    … sig = html + card + S.tab + rk6 + bh; if (!force && sig === S.last) return; S.last = sig; // E955
+    … sig = html + card + S.tab + rk6 + bh; top(); if (!force && sig === S.last) return; S.last = sig; // E955
```
(`topbar(r)` only reads, so moving it is safe. The O(n²) `F.includes` is in menu1 #6.)

## 6. FRAMES (low): the book marks over buildings scan all 260 techs for each building every game second, in a draw handler (menu.js:381-382, 463)

`READY = FK.blds().map((t) => [t, ready(t)])` → `ready` → `lines(t)` → `linesAt(t.code)` → `stepsAt(b)` = `Object.keys(TB).filter(…)`. That is the full tech book (260 entries, counted with node). `lines` calls it again for every line (`stepsAt(t.code).find(…)`). With 40 own buildings that is over 10k callbacks and 40+ key arrays, every `RB.every` = 1 game second, multiplied by the game speed. Fix: memoise `stepsAt` by building code for the match (the civ is fixed per match). index.html:519 already builds `TECHAT` (techs by building), which is a second home for the same list (RULE 1).

---

## 7. PLAY (high): "New game" on the end card does nothing; he has to reload the app (menu.js:280)

```
if (r.result) { S.tab = null; S.ghost = null; … put($('card'), `…${vcell('new')}${vcell('copylog')}…`); $('panel').className = ''; return; }
```
`new.run` sets `S.tab = 'Start'; FK.pause(true)` (95), then `act` → `render(true)`. But `ECON.result()` stays set until the next `start` (econ.js:253), so render takes this branch again, puts `S.tab` back to null and draws the end card again. The Start page can never open while the result stands. The only thing the tap does is pause the game.
Fix:
```diff
@@ menu.js:280 @@
-  if (r.result) { S.tab = null; S.ghost = null; const you = r.result.winner === 0; …
+  if (r.result && S.tab !== 'Start') { S.tab = null; S.ghost = null; const you = r.result.winner === 0; …
```
Back from Start returns `S.tab` to `S.prev`, which is null, so the end card shows again. Start's own button fires `start`, which clears the result.

## 8. PLAY (look): when the game ends, the dark patches stay on the map with no words on them (menu.js:280)

The result branch adds `sheet` (which hides `#rank` and `#base`) and then returns before `patches()` (285). The patches for the War hint (`.nx`, above the top line), the fold "−" and the words that the end card doesn't cover stay as dark rounded boxes over the map. How much the card covers is unsure. Fix: in the same branch, `-put($('card'), …);` `+if (put($('card'), …)) patches();` (`put` returns true only the first time, so this runs once).

## 9. PLAY: a new match keeps the last match's ice question and its "Clear" pop-up (menu.js:440)

`FK.on('start', …)` resets `subject, ghost, aim, qa, tool, more, tap, line, eta, last`, but not `S.ice`, `S.crack` or `S.sq`. `mold()` puts `S.ice` first (261), so if a new game starts while the ice question is open, the new match opens on the old units' ice card. `S.crack.t` holds the old match's `K.t`, so the clear test in 367, `FK.K.t - S.crack.t > CR.show`, stays false until the new clock passes the old one, and the Clear pop-up stays up that long. Fix:
```diff
@@ menu.js:440 @@
-… line: null, eta: null, last: '' }); …
+… line: null, eta: null, last: '', ice: null, crack: null, sq: null }); …
```
(Whether `S.war` should also reset, so the new match doesn't open in War, is Albert's call; unsure.)

## 10. PLAY (look): pressing pause, mail or the eye looks wrong (E1307; menu.js:28, 31, 32)

`[data-v].pr { … filter: brightness(lift) … }` (31) replaces the clear icons' `filter: drop-shadow(…)` (`.tdots > .dot`, 28), because both rules have the same specificity and 31 comes later. While pressed, pause and mail lose their legibility shadow. And because the two filter lists don't match, the change snaps instead of springing. The eye is the reverse: `.mpath .eye { filter: drop-shadow }` (32) comes after 31, so it never brightens, against E1307's "every button … brightens". Fix: one rule after 32:
```diff
+css.textContent += `.tdots > .dot, .mpath .eye { filter: drop-shadow(var(--none) var(--none) var(--hb) var(--b1)) brightness(1); } .tdots > .dot.pr, .mpath .eye.pr { filter: drop-shadow(var(--none) var(--none) var(--hb) var(--b1)) brightness(${SCR.press.lift}); }`; // E1307
```
Separately, E1308's `repress` does `void b.offsetWidth` inside `put()`. That is one more forced layout in the middle of a render, once per tap that swaps the pressed button. Small.

## 11. PLAY (low): a second finger undoes E943's "don't redraw while a finger is on a button" (menu.js:296)

`pointerdown: … S.down = !!b;` and `pointerup/cancel (window): S.down = false`. With a thumb resting on a button, a second finger that touches the map (`b` null) or lifts anywhere clears `S.down`. The next beat can then swap the button under the thumb, and that tap is lost (the N17 #7 bug). Fix: keep the pointer, `S.down = b ? { id: e.pointerId } : S.down` on down, and `if (S.down && S.down.id === e.pointerId) S.down = false` on up/cancel.

## 12. FRAMES (low): two full renders for one gesture (menu.js:379, 290)

`FK.on('drop', …)`: a short hold-release calls `FK.tap(…)` → `heard` → `render(true)`, and then the handler's own `render(true)` runs too. A tap on `#qa` does `act()` (which renders), then `if (b.closest('#qa')) render(true)`. Fix: `if (…< TO.box) return void FK.tap(p.x, p.y);`, and drop the extra render in `click`.

## 13. PLAY (unsure): a War tap on the map sends healers, priests and spies; the mission tile doesn't (menu.js:349-350 vs 182)

`heard`: `P = soldiers()` → `send(C.act, P, …)`, so all picked soldiers, support included. `mord`'s aimed path: `P = host()` (support excluded, E1286) → `send(o, P, …)`. Same order, different units depending on which button he used. Unsure which is intended. If it's `host()`, use `P = host()` in `heard`.

## 14. RULE: dead code reached from render (menu.js:38, 282-285, 440)

- `card = ''` (282) is a constant. `put($('card'), card)`, `$('card').className = card && …` and `|| !!card` (284), and `card` in `sig`, all do nothing.
- `line = (t) => …` (285) is never used, and it shadows `line()` from 85.
- `FK.miniBox(null)` (285) is the only call of `miniBox`, so `MINIBOX` is always null. index.html:1634-1647 (`drawMini`, `miniAt`, `inMini`, and the mini `press`/`drag` handlers) can never run. The call only does `dirty()`, which while paused forces a full map redraw after every tap.
- `'#base .nx'` in `FLOATS` (38) matches nothing, because `.nx` is built by `mline` and lives in `#rank`.
- `const [cw] = FK.size()` (440) is never used. `S.line` and `S.eta` (440) are never read (`S.qa`/`S.tool`: menu1 #8).

## 15. RULE: numbers in code and a second copy (menu.js:280, 300, 328, 351)

- `tileUnder` (300) re-derives hitAt's tile maths (index.html:1766 `fromBoard(vx, (vy + D.land * UP) / TILT)`) with literal `cw / 2`, `ch / 2` and `Math.PI / 180`, where index.html has `TILT`/`UP` (48). That is a second home (RULE 1).
- `2 * Math.PI` (328) and `… * 2 < SCR.mold.slot` (351), where the file uses `P.half` elsewhere.
- `r.result.winner === 0` (280) hardcodes "I am side 0", but `result` already carries `won` (econ.js:336). Use `r.result.won`.

---
Checked and fine: every `data-v` verb in markup and every book `verb` exists in `VERBS` (script cross-check, 0 missing); `inSight(undefined)` is safe (index.html:1470); `FK.select(unit)` takes one unit (`[].concat(u)`); pack/unpack handle `Set`/`Map`, so `S.opt.hz` and `shown` survive a save; all E-codes in 257-513 exist in comments.js.
