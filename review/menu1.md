# menu1: menu.js lines 1-256 (the CSS, the verbs, the tile rows, the War verbs)

Snapshot: /home/claude/rv (1d0379ea). Read-only. Checks I ran: eslint `no-undef` / `no-unused-vars` on a copy of menu.js (no undefined names; the unused ones are listed in #8); the books loaded in node; `clock()` run in node; greps for every CSS variable, verb and state field across index.html, menu.js, combat.js, econ.js, ai.js, sound.js, books/*.js and tools/.

Counts: PLAY 5, FRAMES 2, RULE 4 (one of them is an Albert rule, marked unsure). No CRASH found in 1-256: every verb either has a whyNot that guards it, or the path that would throw can't be reached (see #8).

---

## 1. PLAY: every countdown shows the wrong minute for the last second of each minute (menu.js:71)

```js
const clock = (t) => `${Math.floor(t / 60)}:${String(Math.ceil(t % 60) % 60).padStart(2, '0')}`;
```
The minutes are rounded down and the seconds rounded up, so they disagree just below each whole minute. Run in node:
`120 → 2:00`, `119.9 → 1:00`, `119.2 → 1:00`, `119 → 1:59`, `60 → 1:00`, `59.9 → 0:00`, `59.1 → 0:00`, `59 → 0:59`.
Scenario: the match bell (RIB.bell `clock(r.left)`), the wonder countdown, research and training times (`research.label` `clock(e.start/e.done)`), the age-up timer (`ageUp.label` `clock(r.aging)`) and econ.js:331 (`MENU.clock`) all read "0:00" for a whole second with about a minute still to go, and "1:00" where it should say "2:00". Renders run every 0.25 s, so the player sees it.
```diff
--- a/menu.js
+++ b/menu.js
@@ -71 +71 @@
-const clock = (t) => `${Math.floor(t / 60)}:${String(Math.ceil(t % 60) % 60).padStart(2, '0')}`;
+const clock = (t) => { const s = Math.ceil(t); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
```
(Checked in node: 119.9 → 2:00, 59.9 → 1:00, 0.5 → 0:01.)

## 2. PLAY: tapping a locked tech whose building isn't built doesn't open Build, and leaves the Build tab stuck "on" (menu.js:122-123, used by mold() at 261)

```js
locked: (c) => { ... const at = TV(n).at, b = FK.blds().find((t) => own(t) && t.code === at && t.done >= 1); S.arm = b ? n : at;
  if (!b) { S.ghost = null; S.tab = 'Build'; S.group = Object.keys(GROUPS).find((g) => GROUPS[g].includes(at)) || S.group; } else if ...
```
`mold()` checks the subject before the tab: `... : S.subject && own(S.subject) && S.subject.done != null ? MOLD.bld(S.subject) : S.subject ? MOLD.find(S.subject) : S.tab === 'Build' || S.ghost ? MOLD.build() : ...`.
Scenario: town center card, Learn tab, tap a tech that needs a tech from a building you haven't built. `act()` posts the "needs" note and calls `locked`, which sets `S.tab = 'Build'` but leaves `S.subject` = the town center, so the town center card stays up. The jobs line now underlines "Build" (`jb()`: `S.tab === m ? 'on'`). Tapping Build runs `mtab` (`tab: S.tab === m ? null : m`), which turns it off and shows an empty bar, so it takes a second tap to reach Build. Also, `S.arm = at` (a building code) is only ever compared with tech codes (`research.label`: `S.arm === c`), so the building you need is never highlighted.
```diff
--- a/menu.js
+++ b/menu.js
@@ -123 +123 @@
-      if (!b) { S.ghost = null; S.tab = 'Build'; S.group = Object.keys(GROUPS).find((g) => GROUPS[g].includes(at)) || S.group; } else if (S.subject !== b) {
+      if (!b) { S.ghost = S.subject = null; S.tab = 'Build'; S.group = Object.keys(GROUPS).find((g) => GROUPS[g].includes(at)) || S.group; } else if (S.subject !== b) {
```

## 3. PLAY: on Start, "Allies" does nothing, and "Random" is allowed on a Daily, so the Daily is no longer the same match for everyone (menu.js:162, 256; consumed at 291-292)

```js
mrule: { label: (r) => MW.setup.rule[r], whyNot: (r) => (r === 'fog' ? VERBS.opt.whyNot('fog') : ''), run: (r) => { if (r === 'fog') ... else if (r === 'allies') S.opt.tension = ruleOn('allies') ? 0 : 1; else S.opt.random = !S.opt.random; } }, // E1229
```
- Allies: `tension` shows up only in menu.js:45 (`tension: 1`), 162 and 256 (`ruleOn`), plus the words and screen books. No sim file (index.html, econ.js, combat.js, ai.js) reads `opt.tension` or `game.tension`. The tile toggles and lights (it is lit by default), but the match plays the same either way. `opt` already blocks unbuilt options through `BUILT` ("Not built yet"); `mrule` skips that check.
- Random on a Daily: `hazard.whyNot` blocks hand-picked hazards on a Daily (`daily() ? WD.daily.set`), but `mrule('random')` doesn't. At begin (292): `if (S.opt.random) for (const [, id] of OPTS.hazard) if (FK.rng() < D.hazards.lot) FK.HZ.add(id);`. FK.rng is the seeded sim random (index.html:61, `rng = () => play()`). So a Daily with Random on gets extra hazards and draws 6 more numbers from the sim random stream at begin, which shifts every roll after that. Two players on the same Daily get different matches.
```diff
--- a/menu.js
+++ b/menu.js
@@ -162 +162 @@
-  mrule: { label: (r) => MW.setup.rule[r], whyNot: (r) => (r === 'fog' ? VERBS.opt.whyNot('fog') : ''), run: (r) => {
+  mrule: { label: (r) => MW.setup.rule[r], whyNot: (r) => (r === 'fog' ? VERBS.opt.whyNot('fog') : r === 'allies' ? VERBS.opt.whyNot('tension') : daily() ? WD.daily.set : ''), run: (r) => {
```
(`BUILT.tension` is undefined, so Allies goes dim with "Not built yet". You may also want line 45's `tension: 1` set to 0 so it doesn't show lit.)

## 4. PLAY: "New game" and "Delete" (exitU) confirm on a quick double tap, unlike demolish (scrap); exitU never disarms; Start has no way back (menu.js:140, 142 vs 153)

scrap guards both: `if (S.dm !== t) { S.dm = t; S.dmT = now; setTimeout(() => { ... S.dm = null ... }, KB.disarm); return; } if (now - S.dmT < TO.dbl) return;`. The other two arm-and-confirm verbs do neither:
```js
newgame: { ... run: () => { if (!S.sure) { S.sure = true; return; } S.sure = false; S.prev = null; S.tab = 'Start'; FK.pause(true); } }, // E703
exitU: { ... run: (u) => { if (S.exit !== u) { S.exit = u; render(true); return; } letGo(); FK.harm(u, u.hp); WAR.die(u, null, 'removed by you'); render(true); } }, // E1055
```
`touch-action: manipulation` is set (index.html), so a quick double tap arrives as two clicks.
- Pause screen: double tap "New game" skips "Sure? Tap again" and lands on Start. Start has no back or close: `SCR.sheets.Start` has no `head` row, and `S.prev = null`. The `.sheet` class hides #rank and #base, so the home dot and W are gone. The only ways back to the paused match are opening and closing Mail or Stores in the top bar.
- Crew card: double tap "Delete" kills the unit at once. Arm it once and walk away, and it stays "Tap again" until some later `letGo()`, so a stray tap minutes later still deletes. With several units picked, it deletes only the first (`arg: "unit"` → `FROM.unit(L)` with `L = P[0]`), while the title reads "×n".
Smallest fix: give both the same guard. Better (rule 12, one home): a single arm/confirm helper that all three verbs use.
```diff
--- a/menu.js
+++ b/menu.js
@@ -140 +140 @@
-  newgame: { label: () => (S.sure ? TP_.sure : TP_.newGame), whyNot: () => '', run: () => { if (!S.sure) { S.sure = true; return; } S.sure = false;
+  newgame: { label: () => (S.sure ? TP_.sure : TP_.newGame), whyNot: () => '', run: () => { const now = performance.now(); if (!S.sure) { S.sure = now; return; } if (now - S.sure < TO.dbl) return; S.sure = false;
@@ -142 +142 @@
-  exitU: { label: (u) => (S.exit === u ? W2.exitArm : W2.exit), whyNot: () => '', run: (u) => { if (S.exit !== u) { S.exit = u; render(true); return; } letGo();
+  exitU: { label: (u) => (S.exit === u ? W2.exitArm : W2.exit), whyNot: () => '', run: (u) => { const now = performance.now(); if (S.exit !== u) { S.exit = u; S.exitT = now; setTimeout(() => { if (S.exit === u && S.exitT === now) { S.exit = null; render(true); } }, KB.disarm); render(true); return; } if (now - S.exitT < TO.dbl) return; letGo();
```
(`IS.sure` is `!!S.sure` and `click()` resets it to `false`, so a timestamp works there. Whether Start should get a Cancel when it's reached from a running match is Albert's call.)

## 5. FRAMES: every drawn frame, every progress ring gets a document query and two DOM writes, even when nothing changed (menu.js:68)

```js
FK.on('over', () => { for (const r of document.querySelectorAll('.rg .rr')) { const m = r.closest('svg').parentElement.querySelector(':scope > .rk'), p = ringP(m); r.setAttribute('stroke-dasharray', `${1 - p + (p ? 0 : RS.seam)} ${2}`); r.setAttribute('stroke-dashoffset', -p); } }); // E834
```
'over' fires from the frame loop (index.html:470, `fire('over', ctx, cam.z)`), and it keeps firing while paused. Scenario: a barracks with a queue open, game paused. Every frame still runs the selector plus two `setAttribute` calls per ring, all with the same values. (Unsure whether the browser skips a same-value write; if it doesn't, each one invalidates SVG style and paint.) The `'sites'` branch of `ringP` is dead: no `data-src` exists anywhere.
```diff
--- a/menu.js
+++ b/menu.js
@@ -68 +68 @@
-FK.on('over', () => { for (const r of document.querySelectorAll('.rg .rr')) { const m = r.closest('svg').parentElement.querySelector(':scope > .rk'), p = ringP(m); r.setAttribute(
+FK.on('over', () => { for (const r of document.querySelectorAll('.rg .rr')) { const m = r.closest('svg').parentElement.querySelector(':scope > .rk'), p = ringP(m); if (r.p === p) continue; r.p = p; r.setAttribute(
```

## 6. FRAMES (low, not measured): ringMount reads layout and writes the DOM in turn, so each new ring forces its own layout (menu.js:63-65); plus O(n²) `F.includes` on the War card (223, 253)

`ringMount` reads `el.clientWidth/clientHeight` for each `.rk`, then for each changed ring does `insertAdjacentHTML`, which marks layout dirty, so the next ring's `clientWidth` forces another layout. It runs after every render whose signature changed. With a queue open that's at least once a second: the clock text changes, `mend()` replaces that button, and its ring mounts again. Opening a sheet with about 20 rings (Start: opt, hazard and civ cells are all `RS.verbs.*` ringed) means up to about 20 forced layouts in one render.
Fix: do two passes. First measure every ring (w, h, pill, shown); then write, using only the stored numbers. Line 64's `parseFloat(cs.getPropertyValue('--rc'))` has to move into the first pass too. Abridged (`...` = unchanged):
```diff
--- a/menu.js
+++ b/menu.js
@@ -63,2 +63,2 @@
-function ringMount(root) { for (const m of root.querySelectorAll('.rk')) { const el = m.parentElement, cs = getComputedStyle(el), seg = ..., out = ..., w = el.clientWidth + out, h = el.clientHeight + out, s = m.dataset.rs, key = [w, h, m.dataset.ring, s].join(); if (!el.offsetWidth || el.rgk === key) continue; ...
-  const pill = parseFloat(cs.getPropertyValue('--rc')), ...
+function ringMount(root) { const R = [...root.querySelectorAll('.rk')].map((m) => { const el = m.parentElement, cs = getComputedStyle(el), seg = ..., out = ..., w = el.clientWidth + out, h = el.clientHeight + out; return [m, el, seg, w, h, parseFloat(cs.getPropertyValue('--rc')), el.offsetWidth]; }); for (const [m, el, seg, w, h, pill, shown] of R) { const s = m.dataset.rs, key = [w, h, m.dataset.ring, s].join(); if (!shown || el.rgk === key) continue; ...
+  const L = ..., ...
```
(Today every `el.clientWidth` read that follows an `insertAdjacentHTML` forces a fresh layout. Pre-reading alone wouldn't fix that; the write pass must not read layout at all.) War card: `pool = C.idle ? base.filter((u) => F.includes(u))`, `base.filter((u) => F.includes(u)).length` and `suits()`'s `F.includes(u)` are army × free on every 0.25 s render. Use `const F = new Set(WAR.free())` with `F.has(u)`.

## 7. RULE: dead CSS variables. All 16 the helper named are confirmed, plus 18 more never read, plus `--cd`, whose only rule is overridden (menu.js:20, 25, 26)

I grepped every file for `var(--x)` and `'--x'` reads. These are set and never read:
- Helper's list, all confirmed: `--sq --sqi --inset --chit --cic --chalf --cexec --kd --kf --kpic --ktint --kw --kt --scr --halo --odim`.
- Also unread on line 20: `--label` (`fnt(SCR.type.label)`), `--track`, `--ring` (`FK.C.foot.work`), `--caps` (and the `k === 'caps' ? 'em' : 'px'` special case exists only for it), `--kb` (only feeds `--kc`), the pads `--pbrown --pblue --pred --pglass --pgo --pink` (only `--pedge` and `--pline` are read), and from the `COL` spread `--s1 --page --age0 --age2 --age3 --age4` (`COL.page` is used directly, not as a var).
- Line 26: `.T { --kc: var(--rg); } .L { --kc: var(--kb); } .N { --kc: var(--rw); }`: nothing reads `var(--kc)`.
- Read but with no effect: `--cd`. Its only reader is line 25's `.dot { width: var(--cd); }`, and line 27's later `.dot { ... width: var(--csm); ... }` (same selector) always overrides it. So `SCR.controller.dot` is dead too.
Book values that are read only to feed these: screen `mold.sq`, `mold.sqIcon`, `mold.inset`, `controller.dot/hit/half/exec`, `kbar.dot/float/pic/tint/share`, `mold2.scr/halo/odim`, `type.label`, `type.track`, `css.caps` (grep: no other JS read). `CT.icon` is still used by `thin()`. Check other `C.foot` users before dropping `foot.work`.
Fix (abridged: the unchanged parts of line 20 are shown as `...`):
```diff
--- a/menu.js
+++ b/menu.js
@@ -20 +20 @@
-... --sq: ${SCR.mold.sq}px; --sqi: ${SCR.mold.sqIcon}px; --ln-i: ${SCR.mold.lnIcon}px; --inset: ${SCR.mold.inset}px; ... --label: ${fnt(SCR.type.label, 'ui')}; --tab: ${fnt(SCR.type.tab, 'ui')}; --track: ${SCR.type.track}em; ${Object.entries(SCR.css).map(([k, v]) => `--${k}: ${v}${k === 'caps' ? 'em' : 'px'};`).join(' ')} --ring: ${FK.C.foot.work}; --cd: ${SCR.controller.dot}px; --chit: ${SCR.controller.hit}px; --cic: ${SCR.controller.icon}px; --chalf: ${SCR.controller.half}%; --cfull: ${SCR.controller.full}%; --cdim: ${SCR.controller.dim}; --cexec: ${SCR.controller.exec}px; --kd: ${SCR.kbar.dot}px; --kf: ${SCR.kbar.float}px; --kpic: ${SCR.kbar.pic}px; --ktint: ${SCR.kbar.tint}%; --kw: ${SCR.kbar.share}%; --kt: ${SCR.type.title[1]}px; --kb: ${CB.blue}; ${Object.entries(FK.C.pads).map(([k, v]) => `--p${k}: ${v};`).join(' ')} ... --scr: ${SCR.mold2.scr}px; ... --glow: ${SCR.mold2.glow}px; --halo: ${SCR.mold2.halo}%; --odim: ${SCR.mold2.odim}%; ...
+... --ln-i: ${SCR.mold.lnIcon}px; ... --tab: ${fnt(SCR.type.tab, 'ui')}; ${Object.entries(SCR.css).map(([k, v]) => `--${k}: ${v}px;`).join(' ')} --cfull: ${SCR.controller.full}%; --cdim: ${SCR.controller.dim}; --pedge: ${FK.C.pads.edge}; --pline: ${FK.C.pads.line}; ... --glow: ${SCR.mold2.glow}px; ...
@@ -25 +25 @@
-... .cell.red { ... } .dot { width: var(--cd); } /* the top: framed bars with dividers */
+... .cell.red { ... } /* the top: framed bars with dividers */
@@ -26 +26 @@
-... .T { --kc: var(--rg); } .L { --kc: var(--kb); } .N { --kc: var(--rw); } /* the mold (Design 14) ...
+... /* the mold (Design 14) ...
```
(Remove `caps` from screen `css` in the same commit. The COL vars come from spreading the whole menu palette; trimming them needs a book decision, so there's no diff here.)

## 8. RULE: dead code in 1-256 (verbs nobody can reach, branches that can't run, unused names and state)

- **Verbs never rendered or called** (grepped every `vcell/ab/dot/data-v/VERBS.x/act(` in code, every `"verb"` in the books, and tools/): `later` (114), `people` (118-119), `follow` (131), `stop` (150), `gather` (151), `fight` (154). Only `train` is called from tools/check.py.
- **Branches that can't run**: `jpm`'s `'people'` branch (168). `MOLD.jobs` gives index 0 (`people`) the idle button, not `jpm`. That's fortunate, because `VERBS.train.whyNot(born(), hall())` with no hall would throw on `b.done`. `back`'s unqueue branch (98): `docked = free` needs `!S.tab`, but `back` is only drawn by `head()` on sheets, where `S.tab` is set. `ringP`'s `'sites'` branch (66). `mback`'s `if (i >= S.cn - 1) return;` (171): `S.cn` is only ever 2 (`row2`: `(S.cn = 2) &&`) and the only crumb is 0. The `fit()` selectors `.exec.name, .kr .cell` (67): no markup has class `exec` or `kr`.
- **Written, never read**: `K.v.push(verb)` and `K.sel = {...}` (187, 227). `cardSides` returns `sel`, but its only caller does `const [sides] = cardSides(t)` (248). `S.lock` plus its `localStorage.getItem('fk.lock')` parse at boot (45-46). `S.eat`, `S.snd`, `S.qa`, `S.aimT` (45) and `S.tool` (only `S.tool = null` at 100).
- **Unused consts** (eslint): `kindOf` (9), `tall` (10), `HUD` (49), `bar` (195), `loses` (209), `kOf` (212), `crumb` (218), `groupOf` (224), `exit` (232).
Fix: delete them. (No diff: these are many one-name deletions on long lines, and each one is safe on its own.)

## 9. RULE: words and chosen numbers in code (menu.js:153, 142, 25, 23-24, 27, 60, 68)

- 153 scrap: ``note(`${B[t.code][0]} ${t.done < 1 ? 'cancelled' : 'taken down'}: ${costText(ECON.refund(t))} back`)``. The English words "cancelled", "taken down" and "back" are in code; they belong in the words book (e.g. `WD.mold.scrapped`).
- 142 exitU: `WAR.die(u, null, 'removed by you')` is stored as `t.why` (combat.js:66), the same as other death causes. Use a cause word from the books.
- 25: `.cell.red { background: color-mix(in srgb, var(--rr) 22%, var(--s2)); border-color: color-mix(in srgb, var(--rr) 30%, var(--s3)); }`: 22% and 30% are chosen numbers.
- 23: `.row6 { grid-template-columns: repeat(6, 1fr); }`: the 6 is `SCR.mold.slots`. Use `repeat(var(--slots), 1fr)` like `.mt`. 24/27: `.frame`, `.pads` `repeat(3, 1fr)`; `line-height: 1.1 / 1.2 / 1.3` (21, 23, 24); `.cell.tp button { width: 50% }` (27).
- 60: `['Scout', 'Envoy', 'Spy']` is a tick list hard-coded in `ringOf`. 221 `isSup` has another (`Heal/Convert/Spy`).
- 68 (and 61, 62, 64, 65): numbers wrapped as `${2}`, `${0} ${0} ${1}`, `pathLength="${1}"` look like a way around the number check. `${2}` is a real chosen number. Unsure whether check.py is meant to catch this.
```diff
--- a/menu.js
+++ b/menu.js
@@ -23 +23 @@
-.row6 { display: grid; grid-template-columns: repeat(6, 1fr);
+.row6 { display: grid; grid-template-columns: repeat(var(--slots), 1fr);
```

## 10. RULE (Albert's "red box = set", unsure whether he ruled on this case): every card's Exit button has a permanent red box (menu.js:26 CSS; book rows `{"verb":"mback"|"mclose","word":"mold.cancel","box":true,"cls":"ex"}`)

```css
.ex .bx, .who .bx, .jb.war .bx { border-color: var(--rr); box-shadow: var(--none) var(--none) var(--gap) var(--rr); }
```
On the War line a red box correctly means "set": `wd()` boxes only `on`, and `jbw()` boxes Troops/Mission only when picked or armed. But Exit (`mold.cancel` = "Exit") is drawn red-boxed on the crew, bld, site, find, ice and build cards at all times, and Exit is never "set". `.tt.red` also boxes the War title in red, though only while the War line is folded (line 262 draws the eye instead of the title when it's unfolded). If the rule holds, `.ex .bx` should use the plain style:
```diff
--- a/menu.js
+++ b/menu.js
@@ -26 +26 @@
-... .ex .bx, .who .bx, .jb.war .bx { border-color: var(--rr);
+... .who .bx, .jb.war .bx { border-color: var(--rr);
```
(With that change Exit falls back to the default green `.bx`. Albert should choose the colour.)

## 11. PLAY (low): the "+n more" tile shows the wrong count on the last page (menu.js:226)

```js
C = pages > 1 ? [...L.slice(p * k, p * k + k), vcell('more', L.length - k, `${p + 1}/${pages}`)] : L;
```
`L.length - k` is the same on every page. With 13 techs: pages 1 and 2 show 5 tiles and "+8" (right), but page 3 shows 3 tiles and still "+8" when 10 are hidden.
```diff
--- a/menu.js
+++ b/menu.js
@@ -226 +226 @@
-const tiles = (L, cls = '', tail = '') => { const n = T6, k = n - 1, pages = L.length > n ? Math.ceil(L.length / k) : 1, p = (S.cpage || 0) % pages, C = pages > 1 ? [...L.slice(p * k, p * k + k), vcell('more', L.length - k, `${p + 1}/${pages}`)] : L;
+const tiles = (L, cls = '', tail = '') => { const n = T6, k = n - 1, pages = L.length > n ? Math.ceil(L.length / k) : 1, p = (S.cpage || 0) % pages, on = L.slice(p * k, p * k + k), C = pages > 1 ? [...on, vcell('more', L.length - on.length, `${p + 1}/${pages}`)] : L;
```

---

### Notes (not counted)
- Albert's "no long press, no double tap" rule is broken outside my lines: menu.js:354-355 double-tapping the map opens a card (`dbl = ... now - L.t < TO.dbl ...; if (dbl) { ... S.subject = t; ... return ['open', t]; }`), and index.html:1752 holding (`TO.hold`) starts a box select (`fire('hold', ...)`; `press.mode = 'box'`). Pass these to whoever has those lines.
- Stubs by design that do nothing and are shown dim: War's "Mode" tab (`mview.whyNot` → "Not built yet") and the "gift" stance (`WT_.later`).
- `ageUp.label` (124) calls the full `read()` (scores for two sides, `ECON.result()` and more) just to get `next`/`aging`/`ageCost`, once per render while the Learn tab is open. Small, but `D.ages[ECON.nextAge(ME)]`, `SIDES[ME].aging` and `ECON.ageCost(ME)` are enough.
- `S.who` (the Talk sub-list) survives Exit (`mback`/`mclose` don't clear it), so reopening the town center shows the last side's stance list. You can get out by tapping the Talk tab.
