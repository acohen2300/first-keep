# Camera tools: spec (spec-camera, Nov 21)

Read-only. Snapshot /home/claude/rv. Nothing built. Lines are snapshot lines.

Your rules, checked against the code:
- Tap animation: you get it for free. Any button with `data-v` gets the press (menu.js:31 `[data-v].pr`, menu.js:296). Every option below uses `data-v`.
- Red ring/box = set: the follow icon gets one while it is on. The idle jump never does, because it is a jump and leaves nothing set.
- No long press, no double tap: none of the options below use either. The game already has both (see the end).

---

## 1. Follow a tapped unit

### What exists
- menu.js:131: a `follow` verb that turns `FK.cam.follow` on and off, with a crosshair icon (`SVG.direct`). Nothing draws it, so it is dead today.
- index.html:1526-1528: `followCam` (E608). It keeps the middle of the picked units in the centre of the screen and stops when nothing is picked.
- What already ends it: dragging the map (index.html:1761), the minimap (1646), a new game (1574), and every jump: Home, alert, mail, Idle, Research (menu.js:123, 130, 133, 138, 164).
- Flaw 1: it follows the live pick, and every order clears the pick (your N435: menu.js:80 → `endPick` menu.js:82). So follow drops the moment you send the unit, which is exactly when you want to watch it.
- Flaw 2: index.html:1761 runs on every finger move with no threshold. On a phone, the small finger movement in an ordinary tap (for example tapping where to send him) probably ends follow (unsure; needs a phone test). Only a real drag should end it. `press.moved` already tells a drag from a tap (index.html:1757).

### Pick A (recommended): crosshair as the third circle at the top right
- Where: under the top bar, next to pause and mail, making a set of three (RULES 12). Same clear round look as they have.
- Dim when nothing is picked (a tap says "Pick a unit first").
- Tap: the camera locks onto the picked unit (or the middle of a picked group) and keeps it in the middle. A red ring means it is following.
- Second tap: if the pick is the same (or there is none), follow turns off. If you have picked someone new, the camera switches to them and stays on.
- Ends by itself when you drag the map, tap the minimap, use Home/alert/Idle, or every followed unit is dead or gone.
- Orders do not end it, so you can send him and watch him walk. A pinch still ends it (as today); a plain tap on the map no longer does.
- One place for villagers and soldiers alike, and it does not crowd the War card's full top line.

### Pick B: crosshair on the card's top line, just left of War
- On a villager's card it sits after the name; on the War card, after the eye. Same tap rules as A.
- Closer to the thumb.
- Cost: the War card's line becomes Home, Troops | Mode | Mission, eye, crosshair, W. It may clip on a 375-pt-wide phone (unsure, because `.mpath` clips at menu.js:26).

### Pick C: no button, tap the picked unit again
- Tap a unit to pick it, then tap it again to lock on. A tap on the ground or a drag ends it.
- Cost: it is hidden. Today that second tap unpicks (menu.js:368), and inside the double-tap window it opens the unit's card (menu.js:354-355). Both would have to change.

### Smallest change for A
```diff
--- books/screen.js:41 (SN55)
-"value": ["pause", "mail"]
+"value": ["pause", "mail", "follow"]
--- menu.js:131
-  follow: { label: () => `<span class="t">${SVG.direct}</span>`, whyNot: () => '', run: () => { FK.cam.follow = !FK.cam.follow; FK.dirty(); } },
+  follow: { label: () => `<span class="t">${SVG.direct}</span>`, whyNot: () => (FK.cam.follow || FK.picked().some((u) => u.kind === 'unit') ? '' : MW.hint.pickOne), run: () => { const P = FK.picked().filter((u) => u.kind === 'unit'), same = FK.cam.follow && P.every((u) => FK.cam.who.includes(u)); FK.cam.who = P; FK.cam.follow = !same && P.length > 0; FK.dirty(); } }, // E608
--- menu.js:272 (TOPDOT, add one entry)
+  follow: () => `<button class="dot fol ${FK.cam.follow ? 'on' : FK.picked().some((u) => u.kind === 'unit') ? '' : 'dim'}" data-v="follow||">${VERBS.follow.label()}</button>`,
--- index.html:1526
-function followCam(dt) { if (cam.follow) { const P = FK.picked().filter((u) => u.kind === 'unit'); if (!P.length) cam.follow = false; else {
+function followCam(dt) { if (cam.follow) { const P = (cam.who = cam.who.filter((u) => !u.gone && u.hp > 0)); if (!P.length) cam.follow = false; else {
--- index.html:1761
-  cam.follow = false; camStop(); keepOn(); dirty();
+  if (!press || press.moved) cam.follow = false; camStop(); keepOn(); dirty();
```
Also needed:
- One CSS rule for the red ring: `.tdots > .dot.fol.on { border-color: var(--rr); box-shadow: ... var(--rr) }`. Today the top dots' `.on` is white (menu.js:28).
- Words: `pickOne` (new).
- Comments: E608 reworded ("follows the units it was turned on with, through orders").
- Start `cam` with `who: []` (index.html:382), to be safe.
- Safe for saving: the camera is not in the save (pack, index.html:425), and `start` turns follow off (1574).

---

## 2. Snap to idle soldiers

### What exists
- menu.js:164: the `idle` verb (E1249). It jumps to the next idle villager and picks him. It is drawn as the Jobs card's Idle box (menu.js:243) and covers villagers only (`ECON.idlers`).
- menu.js:138 `look` + menu.js:217 `spots()` (E1103): tapping the same button again goes to the next spot, and after the last it starts over. Only alert and sick are drawn (menu.js:262). The Nov 15 army-groups jump (`spots()` → `WAR.fronts()`, E1104) is no longer drawn, so that path is dead.
- combat.js:173: `WAR.free()` returns idle soldiers (holding or rallying, not sent). The War card's Idle word uses it (menu.js:253-254), but only as a filter. It never moves the camera (menu.js:177).

### Pick A (recommended): a round pin icon on the War card's top line, left of the eye
- The pin is the Jobs card's Idle mark, so the same icon means the same thing.
- Dim when no soldier is idle (a tap says "Nobody is idle", which already exists as `MW.hint.noIdle`).
- Tap: the camera glides to the next place where idle soldiers stand and picks them. Soldiers are grouped by the order that put them there; the ones at home count as one place. Custom+ gets the red box (as when you tap soldiers, `ctlPick` menu.js:219), so a mission tile works next.
- Second tap: the next place. After the last place it starts over, like the alert button.
- Ends: nothing stays on, so there is no red ring, just the press. The pick ends with your next order (N435).
- The eye does not limit where it goes, because its job is to bring off-screen soldiers onto the screen. After the jump they are on screen anyway.
- Risk: line width (unsure). If it clips, float the pin above the line where the alert floats (`.dot.up`, menu.js:26), with the alert taking that spot while you are under attack.

### Pick B: the War card's Idle word does it
- First tap: Idle gets the red box, the idle soldiers are picked, and the camera goes to the first place. Each further tap goes to the next place. All, or a class word, ends it.
- No new icon, and it works exactly like the Jobs card's Idle box (a tap goes to the next one), which keeps the menus consistent.
- Cost: Idle stops being an on/off filter that combines with Foot/Bow (N433), so "idle bowmen only" goes.

### Pick C: bring back the Nov 15 army button (banner)
- All its code is still there. It needs one render line in menu.js:262: `dot('look', 'army', 'army', ...)`.
- It jumps to each group out of town, whether busy or idle. It does not pick them.
- Cost: it is not idle-only.

### Smallest change for A
```diff
--- menu.js:217 (after spots)
+const idleBands = () => { const G = new Map(); for (const u of WAR.free()) if (!isSup(u)) { const k = u.ord ?? null; (G.get(k) || G.set(k, []).get(k)).push(u); } return [...G.values()]; }; // E-new
--- menu.js:164 (after idle)
+  sidle: { label: () => '', whyNot: () => (idleBands().length ? '' : MW.hint.noIdle), run: () => { const L = idleBands(); S.sidleI = ((S.sidleI ?? -1) + 1) % L.length; const G = L[S.sidleI], c = WAR.centreOf(G); FK.cam.follow = false; FK.camGo(...FK.toView(c.bx, c.by, D.land)); FK.select(G); ctlPick(); } }, // E-new
--- menu.js:262 (mline, War branch: pin before the eye)
-${S.war && !S.fold ? eye() :
+${S.war && !S.fold ? `<button class="dot eye ${idleBands().length ? '' : 'dim'}" data-v="sidle||">${SVG.pin}</button>` + eye() :
```
Also needed:
- CSS: `.mpath .eye + .eye { margin-left: var(--none); }`. Otherwise the two auto margins at menu.js:32 split the space and the icons drift apart.
- A new E-code line in books/comments.js.

Unsure:
- Two orders that ended at the same spot make two stops there.
- The places shift as soldiers wake up, so a tap can skip one place (`VERBS.idle` has the same issue).

---

## Rule clashes already in the game (outside this task, for your call)
- Long press: holding the map draws a box pick (index.html:1752, E865).
- Double tap: tapping the same thing twice within `TO.dbl` opens its card (menu.js:354-355, E429).
