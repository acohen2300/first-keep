# v-war: War card Step 4 (141c5f48), independent check

Snapshot /home/claude/rv at 1d0379ea. Line numbers are the snapshot's. Read only; nothing run but `node`/`python` on the books and the font file.
Most lines here are one very long line, so the diffs show only the changed part of the line, with `…` for the parts that stay the same.
Albert's rules quoted from LIST.md:22 ("red box = chosen, on the choice and on its controller"), LIST.md:29 ("Defend takes a target: tap Defend, tap a building, a unit or a spot"), LIST.md:37 (his 17:55 answers: 2 "a tap on a foe already attacks and a tap on ground moves"; 7 "Defend: tap Defend, then the unit or building, which shows it is being defended"; "No long press and no double tap").

Counts: CRASH 0 · PLAY 8 · FRAMES 0 · RULE 7

---

## 1. PLAY: after Fall back, every later order is overwritten (a state you can't leave)
combat.js:232-234, menu.js:129, menu.js:449

`fallBack` tags the group: `for (const u of G) Object.assign(u, { fall: F, fb: Infinity, focus: null, ord: null, sent: false });` (232).
`u.fall` is cleared in only one place (grep: no other `fall` write in combat.js, menu.js, ai.js, econ.js, index.html):
```
for (const [F, G] of by) if (!G.some((u) => status(u) === 'march')) { const L = F.filter(alive); for (const u of G) { Object.assign(u, { fall: null, fb: null }); if (L.length) fight(u, L.reduce(...), true); } }   // 234
```
Hold does not clear it: `Object.assign(u, { path: null, goal: u.k, job: 'hold', target: null, ord: null })` (menu.js:129).
What happens:
- Pick Bow, tap Fall back, then tap Hold while they walk away. On the next order beat nobody is marching, so `fallTick` calls `fight(u, nearest old foe, true)` and they run back in. The Hold is lost.
- Retreat (`WAR.homeAll`): they march home, and when they arrive they stop marching and walk back out to the enemies they left.
- A tap on a new foe sets a target, so their status is 'fight', not 'march'. Within one beat they are turned back onto the old group.
- Move and Defend: the same thing happens when they arrive.
Smallest fix: drop the tag when any other order goes out. Every War-card order goes through `ordered` or `send`:
```diff
--- a/menu.js
+++ b/menu.js
@@ -260 +260 @@
-const send = (o, P, t, k) => { if (o === MW.orders[0]) { …
+const send = (o, P, t, k) => { for (const u of P) u.fall = u.fb = null; if (o === MW.orders[0]) { …
@@ -449 +449 @@
-const ordered = (what, P, k, t) => { S.ctl.fresh = S.told = true; if (P.length) …
+const ordered = (what, P, k, t) => { S.ctl.fresh = S.told = true; if (what !== 'fall') for (const u of P) u.fall = u.fb = null; if (P.length) …
```
A cleaner home would be combat.js's `order`/`march`/`fight` when `told`, which keeps the same rule for every side. Today only the player can Fall back, because ai.js never calls it.

## 2. RULE (Albert): Defend does not take a target and shows nothing on the defended thing
menu.js:182, menu.js:101, combat.js:196-197

`if (o === 'defend' || o === 'fall' || o === 'retreat') return VERBS.cact.run(o);` (182) → `const r = WAR.defend(U); … note(r ? CW.said.defend… : r === 0 ? CW.why.busy : CW.why.noAttack)` (101) → `F = attacked(); if (!F.length) return null; … [f] = F.sort((a, b) => val(b.target) - val(a.target) || …), at = f.target; order(G, f);` (196-197).
What happens: the siege is walking to a spot and you want foot to defend it. You tap Defend and get "No one is under attack", and nothing happens. When something is under attack, the game picks what to defend (the Town Center first) and sends them at the attacker. Your tap on a target is never asked for, and nothing marks the defended unit or building. Step 4 is "Missions" (LIST.md:38), and his answer 7 is exactly this flow.
Fix (a sketch, not drop-in: it needs a combat-side `defendAt`, and the existing `guard` at combat.js:94 is the trader escort, capped by `D.trade.guard`; the "being defended" mark may be Step 7, markers):
```diff
@@ menu.js:182 (mord)
-… if (o === 'defend' || o === 'fall' || o === 'retreat') return VERBS.cact.run(o); …
+… if (o === 'fall' || o === 'retreat') return VERBS.cact.run(o); …   // Defend arms like Move and waits for its target
@@ menu.js:350 (War map tap)
-if (isSoldier(u)) { pickToggle(u); return ['pick', u]; } if (P.length && C.act && onB(k)) { … send(C.act, P, t && !own(t) ? t : null, k); …
+if (isSoldier(u) && C.act !== 'defend') { pickToggle(u); return ['pick', u]; } if (P.length && C.act && onB(k)) { … send(C.act, P, t && (C.act === 'defend' || !own(t)) ? t : null, k); …
@@ menu.js:260 (send)
-… } else { WAR.order(P, null, k); ordered(o, P, k); } …
+… } else if (o === 'defend') { WAR.defendAt(P, t, k); ordered(o, P, k, t); } else { WAR.order(P, null, k); ordered(o, P, k); } …
```
(The first test on line 349, `!(u && own(u) && !isSoldier(u))`, also sends taps on your own villagers or traders out of the War branch. Defending one of them needs that changed too.)

## 3. PLAY: the hint lies after you tap a spot or a foe
menu.js:231, menu.js:350

`nextW = () => … !host().length ? MW.next.pick : S.ctl.act ? MW.next.map : MW.next.aim` (231).
With troops picked and nothing armed, a map tap in War only aims: `… else { aimSpot(k, u); C.spot = onB(k); }` (350).
What happens: pick Foot. The hint says "tap an enemy or a spot". Tap a foe: a ring appears, nobody moves, and the hint still says "tap an enemy or a spot". Tap the foe again, as told, and the aim is cleared: `if (C.spot && S.aim && (u ? S.aim.t === u : S.aim.k === k)) { C.spot = false; S.aim = null; }`. The real next step, a mission, is never named. It also differs from his answer 2 (a tap on a foe attacks, a tap on ground moves), which the War branch does not do.
Smallest fix (the words "pick a mission" were already proposed in LIST.md:38):
```diff
@@ menu.js:231
-nextW = () => `<i class="nx">${!host().length ? MW.next.pick : S.ctl.act ? MW.next.map : MW.next.aim}</i>`;
+nextW = () => `<i class="nx">${!host().length ? MW.next.pick : S.ctl.act ? MW.next.map : S.ctl.spot && S.aim ? MW.next.mission : MW.next.aim}</i>`;
@@ books/words.js:61 (J61 next)
-"next": {"pick": "pick troops", "aim": "tap an enemy or a spot", "map": "tap the map"}
+"next": {"pick": "pick troops", "aim": "tap an enemy or a spot", "map": "tap the map", "mission": "pick a mission"}
```

## 4. PLAY: arming Attack or Move says "then Execute", and there is no Execute
menu.js:182, books/words.js:50

`C.act = C.act === o ? null : o; if (C.act) note(CW.why.spot);` (182), and J50 has `"spot": "Tap a spot on the map, then Execute"`. menu.js draws no Execute button (grep: only the CSS var `--cexec` and a `.exec.name` selector). A map tap while armed sends straight away (350). The new hint says "tap the map" at the same moment, so the two lines disagree.
```diff
@@ books/words.js:50 (J50 why)
-"spot": "Tap a spot on the map, then Execute"
+"spot": "Tap a spot on the map"
```

## 5. PLAY: a mission tapped with nobody picked turns the eye off and orders the whole army
menu.js:182, menu.js:177, menu.js:222

`if (o !== 'squad' && !host().length) VERBS.mwho.run('');` (182) → `if (!c) { Object.assign(C, every()); return byWords(); }` (177) → `every = () => ({ who: 'all', cls: [], idle: false, scr: [true, true] })` (222).
What happens: you turn the eye on (only troops on screen) with no troops on screen. Nobody is picked, which check.py's own "eye on → 0" case expects. You tap Retreat: the eye silently goes off and every soldier on the map is sent home. An Idle box is wiped the same way. check.py's `missions()` only tries this with the eye off.
```diff
@@ menu.js:182
-if (o !== 'squad' && !host().length) VERBS.mwho.run('');
+if (o !== 'squad' && !host().length) { const { scr, idle } = S.ctl; Object.assign(S.ctl, every(), { scr, idle }); byWords(); if (!host().length) return note(CW.why.none); }
```

## 6. PLAY: mission tiles are drawn dim but act on every soldier
menu.js:254, menu.js:82

The tile class is `${!P.length ? 'dim' : ''}` (254). Everywhere else, dim means a whyNot is set (`ab`, 230: `VERBS[verb].whyNot(…) ? 'dim' : ''`). Every order ends the pick (82, `endPick`, run by `act` when `S.told`). So after every order the whole row is dim, and the next tap on a "dim" tile orders the entire army (finding 5). The look says "off", but the tap is the biggest order in the game.
```diff
@@ menu.js:254
-… ${!P.length ? 'dim' : ''}" data-v="mord|${o}|"> …
+… ${VERBS.mord.whyNot(o) ? 'dim' : ''}" data-v="mord|${o}|"> …
```

## 7. PLAY: Fall back says "No enemy near" when an enemy is near, and a failed Fall back stops the troops
menu.js:101, combat.js:230-231, combat.js:101

`note(r ? CW.said.fall.replace('{n}', r) : CW.why.noFoe)` (101). `fallBack` returns `null` when none of the picked is `armed` (230), and `0` when `dress` finds no way (231: `if (!dress(G, …)) return 0;`). `dress`'s failure path is `if (!drill && !L) { for (const u of S) u.job = 'idle'; return false; }` (101).
What happens: with your back to water or the map edge, the walk-away spot can't be reached. Every picked soldier's job is set to 'idle' in the middle of the fight, and the note says "No enemy near" while the enemy is beside them. Picking only units that are not `armed` gives the same false note.
```diff
@@ combat.js:231
-… if (!dress(G, FK.tileAt(f.bx + dx * out * T, f.by + dy * out * T))) return 0; // E1431
+… if (!dress(G, FK.tileAt(f.bx + dx * out * T, f.by + dy * out * T))) return -1; // E1431
@@ menu.js:101 (cact, the fall branch)
-const r = WAR.fallBack(U); if (r) { C.act = null; S.ro = a; ordered(a, U); } note(r ? CW.said.fall.replace('{n}', r) : CW.why.noFoe);
+const r = WAR.fallBack(U); if (r > 0) { C.act = null; S.ro = a; ordered(a, U); } note(r > 0 ? CW.said.fall.replace('{n}', r) : r < 0 ? CW.why.noWay : CW.why.noFoe);
```
The side effect of setting jobs to 'idle' stays (dress is shared). I'm unsure whether 'idle' with `target` still set actually stalls a fighting unit.

## 8. PLAY: Retreat's note says "fall back", and "No soldiers picked" shows when you have no soldiers
books/words.js:50

J50 has `"said": {… "retreat": "{n} fall back home", … "fall": "{n} fall back"}`: two different missions now report in almost the same words (Rule 12: same words for the same thing). `mord.whyNot` returns `CW.why.none` ("No soldiers picked") only when no soldier exists at all, because picking is automatic now. The book already has J11 `"none": "No soldiers yet. Train some."`.
```diff
@@ books/words.js:50
-"retreat": "{n} fall back home"
+"retreat": "{n} retreat home"
@@ menu.js:182 (mord.whyNot)
-… WAR.armyOf(ME).some((u) => !isSup(u)) ? '' : CW.why.none),
+… WAR.armyOf(ME).some((u) => !isSup(u)) ? '' : WD.orders.none),
```

## 9. PLAY (unsure): a save and load splits a Fall back group
combat.js:233, index.html:429-433

`fallTick` groups units by the identity of the shared `u.fall` array: `by.get(u.fall) || by.set(u.fall, []) …` (233). `pack`'s `walk` dedups plain Objects only: `if (v.constructor === Object) { if (seen.has(v)) return void twice.add(v); … }`. Arrays are written once per unit. After a load, each unit has its own array, so each one turns back in on its own as soon as it stops, instead of waiting to re-form with the group.
Fix: share a plain object, which pack's own/same tags keep as one object:
```diff
@@ combat.js:232
-for (const u of G) Object.assign(u, { fall: F, fb: Infinity, focus: null, ord: null, sent: false });
+const grp = { F }; for (const u of G) Object.assign(u, { fall: grp, fb: Infinity, focus: null, ord: null, sent: false });
@@ combat.js:234
-… { const L = F.filter(alive); …
+… { const L = F.F.filter(alive); …
```

## 10. RULE (Albert, red box = set): a set mission is not a red box
menu.js:254, menu.js:27

`C.act === o ? (o === MW.orders[0] ? 'arm' : 'sel') : S.ro === o ? 'sel' : ''` (254). `.mt .cell.arm { background: var(--rr); … }` gives Attack a red fill. `.mt .cell.sel { box-shadow: inset 0 0 0 var(--edge) var(--rw); }` gives Move armed, and a just-sent Hold, Defend, Fall back or Retreat, a white ring. The Mission controller shows a red box while the Move tile shows white. LIST.md:22 says red box "on the choice and on its controller". This may be left for Step 7 (markers); if so, ignore it.
```diff
@@ menu.js:254
-${C.act === o ? (o === MW.orders[0] ? 'arm' : 'sel') : S.ro === o ? 'sel' : ''}
+${C.act === o || S.ro === o ? 'set' : ''}
@@ menu.js:32 (E1443 css)
+ .mt.M .cell.set { border-color: var(--rr); box-shadow: var(--none) var(--none) var(--gap) var(--rr); }
```
(The "Attack glowing" opening of answer 9 would then need its own look.)

## 11. RULE (Albert, every button animates): the eye loses the press brighten
menu.js:31 (E1307), menu.js:32 (E1443)

`[data-v].pr { transform: scale(…); filter: brightness(${SCR.press.lift}); … }` comes before `.mpath .eye { … filter: drop-shadow(…); }`. Both have specificity 0,2,0, so the later drop-shadow wins and the eye only grows, without brightening. `.tdots > .dot` comes earlier, so it still brightens.
```diff
@@ menu.js:32
+ .mpath .eye.pr { filter: brightness(${SCR.press.lift}) drop-shadow(var(--none) var(--none) var(--hb) var(--b1)); }
```

## 12. RULE: the hint's patch selector `#base .nx` never matches
menu.js:38, menu.js:262, menu.js:285

`FLOATS = '#rank, #base .mctl, #base .nx'`. But the hint is built in `mline` (262), and `mline` goes into #rank: `rk6 = M ? mline(M) : ''` … `put($('rank'), rk6)` (283-285). The patch still appears because `#rank` is already in the list. The new selector is dead.
```diff
-const FLOATS = '#rank, #base .mctl, #base .nx', …
+const FLOATS = '#rank, #base .mctl', …
```

## 13. RULE: Mode ("Not built yet") no longer looks different from a working controller
menu.js:32, menu.js:27

`.jb.war .fl.off { opacity: initial; color: color-mix(… calc(var(--jdim) * 100%) …) }` (0,4,0) cancels `.fl.dim { opacity: var(--cdim); }` (0,2,0). Mode is always both `dim` and `off`, so it now looks exactly like Troops or Mission when they are closed: 45% white for all three, with jdim = cdim = 0.45. Before this commit, Mode was the only dim one.
```diff
@@ menu.js:32
+ .jb.war .fl.off.dim { opacity: var(--cdim); }
```

## 14. RULE: the bell's tap area is 28 x 44 px at 390
menu.js:32, books/screen.js:45, books/screen.js:36

`.mt.M { grid-template-columns: repeat(var(--slots), 1fr) ${SCR.mission.bell}fr; }` with 6 + 0.5 fr and a 2 px gap. #ui is 378 px wide, so the bell is 28.2 px wide and a mission tile 56.3 px. SN48 says "every tap area 44 (SN1 slot)". `.cell { overflow: hidden }` means an `::after` can't widen it. He picked a narrow tile, so this is flagged for him only, with no fix.

## 15. RULE (from before this commit, unsure if wanted): the mission words were meant to be italic and aren't
menu.js:27

On line 27, `.mt.R .cell { font-style: italic; text-transform: uppercase; }` (offset 1347) comes before `.mt.R .cell { font: var(--head); }` (offset 5064). The `font` shorthand resets `font-style` to normal, so the italic is dead. If italic is meant, use `font: italic var(--head)`, the same pattern this commit uses for `.nx`. If not, delete `font-style: italic`.

---

## Checked and fine
- **Words at 390 px.** I measured with the game's own Barlow Semi Condensed 600 file at 14 px, uppercase, no kerning. FALL BACK is 61.6 px in a 52.3 px box, so `fit()` squeezes it to 0.85; the floor is 0.77 (SN44). RETREAT is 51.6 px and fits unsqueezed. At 360 px FALL BACK needs 0.774 and just fits; at 320 it would clip. The widest hint, "tap an enemy or a spot", is about 123 px.
- **Nothing left pointing at removed things.** `MW.alarm`, `MW.scr` and `scrs()` have no remaining uses. `SVG.fall`, `SVG.eye` and `SVG.bell` exist in SN19, `MO.icon.fall` in SN48, and `VERBS.work`/`shelter` at menu.js:112-113.
- **The eye works.** Its tap area is 44 through `::after`, and `.dot` is `position: relative`, so it doesn't cover the controllers. It toggles both ways, and a red ring means set.
- **Six missions, in order, no paging.** 6 = T6, and the bell is the tail, so `tiles` doesn't paginate.
- **No long press or double tap was added.** Every new button has `data-v`, so the pointerdown press (menu.js:296) reaches it.
- **Armed states can be left.** Tapping the mission again, any order, or closing War clears `act`.
