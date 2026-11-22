# Review: ai.js (all) + sound.js — reviewer "ai"

Snapshot /home/claude/rv (1d0379ea). Read-only. Book facts checked with node on books/*.js. Nothing was run in a browser. Line numbers are snapshot lines.

Counts: CRASH 0 · PLAY 9 · FRAMES 0 (one PLAY item is also a slice-cost issue) · RULE 2

Same seed, same match: ai.js has no Math.random, Date or performance.now. deal() draws only from `FK.NS_rng(seed + V.seed)`, turns are counted in slices (index.html:414) and times come from `FK.K.t`. sound.js uses `AC.currentTime` and `FK.glance` (the looks stream, `shown = dice(seed ^ D.looks)`, index.html:1173) and never `FK.rng`, so it cannot change the match. The one gap is #10 (the dealt plan is not saved).

---

## 1. PLAY — ai.js:86-87: computers stop building homes at age 2, so their population freezes and their bank grows (most likely cause of the "huge banks")

```
86  yield; const due = {}, flat = s.age >= AT.apart.age && ECON.canPay(side, AT.apart.cost) ? A.apartment : HOUSE; // E530
87  if (!rising(side, HOUSE) && ... && !put(flat, h, RG.home) && !ECON.canPay(side, D.cost[HOUSE])) ECON.addRes(due, D.cost[HOUSE]);
```
- From age 2 (`ai.turn.apart.age`), any computer holding 60 stone and 120 wood picks the Apartment (BR2).
- BR2 needs a standing Aqueduct (`bldNeeds {"BR2":"BP7"}`, and econ.js:45 lockWhy returns "standing" without one). That makes `raise()` return null (ai.js:26: `|| ECON.capWhy(side, code)) return null`).
- The fallback adds the House cost to `due` only when it *can't* pay for a House. It never places a House.
- Who builds an Aqueduct: aggr and bal have no BP7 in their `build` list. fort builds one only at age 2 with an army of 8 and 400 stone.
- Scenario: bal gathers stone from Bronze on (mix stone 0.1; fort 0.15). From Classical onward it never adds room again. Its population sticks at whatever it had, so it can't add villagers or soldiers past that, and every resource piles up. aggr is hit whenever it holds 60 stone for a goal. fort is hit until its Aqueduct stands.
- This is the only home-building path for computers (no other `House` builder in econ/combat/index).

```diff
-  yield; const due = {}, flat = s.age >= AT.apart.age && ECON.canPay(side, AT.apart.cost) ? A.apartment : HOUSE; // E530
+  yield; const due = {}, flat = s.age >= AT.apart.age && ECON.canPay(side, AT.apart.cost) && !ECON.capWhy(side, A.apartment) ? A.apartment : HOUSE; // E530
```

## 2. PLAY (same every game) — ai.js:24-25: every building goes to the same corner of its ring

```
25  for (let r = rmin; r < rmax; r++) for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i += j === cj - r || j === cj + r ? 1 : 2 * r) if (ECON.canPlace(...)) return [i, j];
```
- spot() takes the first free tile of each ring, scanning from the north-west corner along the north row, then the sides, then the south.
- So in every game, every computer builds its free Mill and Farm (ai.js:175, `A.start`) north-west of its hall. Houses line the north edge of ring 6, the barracks takes the NW corner of ring 9, and so on. The deal changes none of this.
- Fix: deal each side one of the 8 ways a square can be turned or mirrored, and scan in that frame. Add `"turns": 8` to D390 (a count, not tuning) and a new comment code (E1408 here).

```diff
-    return Object.assign(P, { likes: one(V.likes), liking: span(V.liking), foe: one(D.players.filter((q) => q !== side)), grudge: span(V.grudge) }); }); } // E1400
+    return Object.assign(P, { likes: one(V.likes), liking: span(V.liking), foe: one(D.players.filter((q) => q !== side)), grudge: span(V.grudge), turn: Math.floor(r() * V.turns) }); }); } // E1400
-function spot(code, bx, by, rmin = 0, side, rmax = D.ai.reach) { const n = B[code][1], [sx, sy] = FK.fromBoard(bx, by), ci = Math.floor(sx / D.tile - n / 2), cj = Math.floor(sy / D.tile - n / 2);
-  for (let r = rmin; r < rmax; r++) for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i += j === cj - r || j === cj + r ? 1 : 2 * r) if (ECON.canPlace(code, i, j, side, true, true)) return [i, j]; return null; }
+function spot(code, bx, by, rmin = 0, side, rmax = D.ai.reach) { const n = B[code][1], [sx, sy] = FK.fromBoard(bx, by), ci = Math.floor(sx / D.tile - n / 2), cj = Math.floor(sy / D.tile - n / 2), w = (per(side) || {}).turn || 0; // E1408
+  const at = (a, b) => { const [x, y] = w & 1 ? [b, a] : [a, b]; return [ci + (w & 2 ? -x : x), cj + (w & 4 ? -y : y)]; };
+  for (let r = rmin; r < rmax; r++) for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i += j === -r || j === r ? 1 : 2 * r) { const [x, y] = at(i, j); if (ECON.canPlace(code, x, y, side, true, true)) return [x, y]; } return null; }
```
(`per(ME)` is null, so your side keeps w = 0. spot() has no callers outside ai.js.)

## 3. PLAY (same every game) — ai.js:131: every computer holds a choke on the road to you

```
131  if (P.bold < AT.never) decideWar(side, P); if (!WAR.waves[side]) chokeClaim(side, D.players.find((p) => WAR.atWar(side, p) && home(p)));
```
- Every side starts at war with every other (sides.js I2 `"start": "war"`). `D.players` is `[0, 2, 1, 3]`, so `find` always returns 0 (you).
- Scenario: in every game, each computer with 6 or more idle foot soldiers parks them in the narrowest gap on the straight road toward your hall, holding 180 s out of every 240 s (D251). The dealt `foe` is ignored here.
- diplomacy (ai.js:160-165) loops in the same order, so you are also always the first side each computer weighs for peace, war or alliance.

```diff
-  if (P.bold < AT.never) decideWar(side, P); if (!WAR.waves[side]) chokeClaim(side, D.players.find((p) => WAR.atWar(side, p) && home(p)));
+  if (P.bold < AT.never) decideWar(side, P); if (!WAR.waves[side]) chokeClaim(side, [P.foe, ...D.players].find((p) => WAR.atWar(side, p) && home(p)));
```

## 4. PLAY (same every game) — ai.js:153-155: every wave marches at the Town Center; riders hit the drop-off nearest the attacker

```
153  ... const at = Wd && Wd.side === best ? Wd : home(best); if (!WAR.attack(side, FK.tileAt(at.bx, at.by), go)) return; // E545
154  Object.assign(WAR.waves[side], { S: go, to: best, bid: at !== home(best), d: Infinity, pt: t }); ...
155  const [mark] = blds(best).filter(... FK.has(b, 'Drop-off')).sort((a, b) => dist(a, h0(side)) - dist(b, h0(side)));
```
- Every attack takes the same hall-to-hall line and ends at the same building.
- Fix: deal an aim per side (`"aims": ["seat", "near", "drop"]` in D390). `bid` must stay "a Wonder bid", or the stall cooldown at line 148 stops applying.

```diff
-  if (best == null || bp <= (WAR.armyOf(side).length >= cap(side) - WV.full ? Math.min(bold, WV.settle) : bold)) return; const at = Wd && Wd.side === best ? Wd : home(best); if (!WAR.attack(side, FK.tileAt(at.bx, at.by), go)) return; // E545
-  Object.assign(WAR.waves[side], { S: go, to: best, bid: at !== home(best), d: Infinity, pt: t }); const fast = ...
+  if (best == null || bp <= (WAR.armyOf(side).length >= cap(side) - WV.full ? Math.min(bold, WV.settle) : bold)) return; const bid = !!Wd && Wd.side === best, [near] = P.aim === 'seat' ? [] : blds(best).filter((b) => up(b) && !ECON.wallish(b) && (P.aim !== 'drop' || (FK.has(b, 'Drop-off') && !FK.has(b, 'Seat')))).sort((a, b) => dist(a, h0(side)) - dist(b, h0(side))), at = bid ? Wd : near || home(best); if (!WAR.attack(side, FK.tileAt(at.bx, at.by), go)) return; // E545
+  Object.assign(WAR.waves[side], { S: go, to: best, bid, d: Infinity, pt: t }); const fast = ...
```
In deal(), add `aim: one(V.aims)` to the `Object.assign` at line 21.

## 5. PLAY (hoarding) — ai.js:64, 98, 127: income has no matching outlet once the town is built

- Villagers stop at `P.vills` (D391: 80/100/105, times 0.85-1.15).
- Spending is capped: the army stops at `armyCap + 10 × age`. Each `build` entry is 1 of each building. Towers, the Wonder, spies and caravans have small caps. Ventures are 2 × 250 gold.
- The job mix (line 127) keeps about 6-12% of villagers on iron from age 2 on (`mix.iron: 2`). Iron is only spent by 5 costs (UM3, UM9, UM14, UM22, BF4), ages 4-5 (400 each) and 32 of 260 techs.
- So even after #1, a full computer gathers far more than it can spend, and iron and stone show up as the biggest piles.
- Smallest fix: let the bank raise the army it keeps. Add a tuning number `ai.turn.rich` in D291, e.g. "each rich banked adds an age's worth of army". Because villagers already stop at `popMax − aim` (D391), a rich side then turns its surplus into soldiers instead of more gatherers.

```diff
-const cap = (side) => Math.min(D.armyMax, per(side).armyCap + AT.armyAge * SIDES[side].age), aim = ...
+const cap = (side) => Math.min(D.armyMax, per(side).armyCap + AT.armyAge * (SIDES[side].age + Math.floor(total(Y, (y) => SIDES[side].store[y]) / AT.rich))), aim = ...
```
Optional second line, in the mix branch (line 127): drop the share of any yield whose store is over `AT.rich`, so iron and stone stop piling up.

## 6. PLAY (+ slice cost) — ai.js:116 and 178: the research fallback stalls a computer's turn for seconds, and Hard is no faster than Normal

```
116  ... && !((m.n = of(m.n) + 1) % AT.research)) for (const c of Object.keys(BOOKS.tech)) { if (ECON.research(side, c)) break; yield; } // E538
```
- How much time a turn gets: `work()` (index.html:414) runs 4 slices a step at 30 steps/s, shared round-robin. With 3 computers, each gets about 40 slices/s.
- How long a normal turn is: I counted about 40-50 yields in one turn, so about 1.1 s. This is an estimate from counting yields, not a measurement.
- The cost: this fallback runs on every 10th turn where no listed tech could start, which is most turns. It yields once per tech, and BOOKS.tech has 260 (counted). That is up to about 6.5 s in which this computer trains nothing, assigns no villagers and doesn't manage its wave (decideWar runs after this line).
- Also, `FK.task` drops a new turn while the last one is still queued. So Hard's `react: 0.5` can't beat the ~1.1 s turn, and Hard and Normal think at the same speed.
- Fix: check all techs in one slice, about 260 `researchWhy` calls. Each is a lookup plus a scan of the side's buildings, so well under a ms (unsure, not measured).

```diff
-  ... && !((m.n = of(m.n) + 1) % AT.research)) for (const c of Object.keys(BOOKS.tech)) { if (ECON.research(side, c)) break; yield; } // E538
+  ... && !((m.n = of(m.n) + 1) % AT.research)) Object.keys(BOOKS.tech).some((c) => ECON.research(side, c)); // E538
```

## 7. PLAY (stuck forever) — ai.js:149: after a successful rebellion the computer never attacks, loots or holds a choke again

- `econ.js:583` rebel() calls `WAR.attack(q, …)`, which creates `waves[q] = { n0, k, t, hp }` with no `S`.
- On freedom (econ.js:586: `s.rebel = s.lord = null; …`) nothing recalls that wave. Only "crushed" recalls (econ.js:585).
- In decideWar, `if (w && w.S) {…}` is skipped and then `if (w) return;` (line 149) runs, every turn.
- chokeClaim needs `!WAR.waves[side]`, and loot needs `!waves[o]` (combat.js:368).
- The wave only clears if the army drops under 30% of its rebel-time size (combat.js:287).

```diff
-  if (w) return; const Wd = things().find(...
+  if (w) { if (!SIDES[side].rebel) WAR.recall(side); return; } const Wd = things().find(...
```
(Equivalent fix in econ.js:586: `if (WAR.waves[q]) WAR.recall(q);` when freed.)

## 8. PLAY (design, unsure if intended) — ai.js:17 and words `end.sides`: the side names no longer match how the sides play

- words.js `"sides": ["You", "Raiders", "Rivals", "Fortress"]` is fixed by side.
- deal() now gives any side any personality (`one(V.pick)`). So "Fortress" can play aggr and rush you, and "Raiders" can play fort and wall up.
- The march news uses these names (ai.js:156 `ECON.tell(... end.sides[side] ...)`), so the game names a side for a style it may not have.
- Options: name sides by their dealt personality (duplicates possible, since all three draws are independent), or use names that don't promise a style. Albert's call.

## 9. PLAY — ai.js:69: the build goal ignores the entry's `stock` and locks

```
69  if (g === 'build') { const [c] = P.build.find(([c, age, m, army]) => !off(c) && s.age >= age && count(side, c) < m && n >= army) || []; if (c) return { what: c, cost: D.cost[c] }; } }
```
- The build loop (line 102) waits for `stock`, but the goal only asks the gatherers for `D.cost`.
- Example: fort's Castle asks for 900 stone and 300 wood. The loop waits for 1100 stone and 400 wood. Once 900/300 is in, `short` is 0, so the planner treats the goal as funded and drops to the mix.
- E1403 then parks the goal for 900 s after 420 s with no change, and the cycle repeats.
- Locked entries (`capWhy`) are also picked as goals.

```diff
-    if (g === 'build') { const [c] = P.build.find(([c, age, m, army]) => !off(c) && s.age >= age && count(side, c) < m && n >= army) || []; if (c) return { what: c, cost: D.cost[c] }; } } // E1402
+    if (g === 'build') { const [c, , , , st] = P.build.find(([c, age, m, army]) => !off(c) && s.age >= age && count(side, c) < m && n >= army && !ECON.capWhy(side, c)) || []; if (c) return { what: c, cost: Object.fromEntries(Y.map((y) => [y, Math.max(of(D.cost[c][y]), of(st && st[y]))])) }; } } // E1402
```

## 10. PLAY (save/load across builds) — ai.js:22, 179-180: the dealt plan is not saved

- `hand` is rebuilt from the seed on load. Any change to D390's ranges, `V.pick`, or the order of draws in deal() (such as #2 or #4) re-deals saved games: a computer can switch personality mid-match after an update.
- Within one build the save round-trips.

```diff
-FK.on('save', (X) => { X.ai = { clock, rings, claimT, helped, league, mind }; }); // E668
-FK.on('load', ({ ai: M }) => { league = M.league; const keep = ...
+FK.on('save', (X) => { X.ai = { clock, rings, claimT, helped, league, mind, hand }; }); // E668
+FK.on('load', ({ ai: M }) => { league = M.league; hand = M.hand || null; const keep = ...
```

## 11. RULE — sound.js: chosen numbers in code

| Line | Numbers |
|---|---|
| 16 | `master.gain.value = 0.5` |
| 21 | `0.0001`, `0.0002`, `0.01` |
| 22-24 | `0.03`, `0.2`, `6000`, `6`, `2` |
| 25 | `0.04`, `1.2`, `9.2`, `0.5` |
| 31 | `0.1`, `0.8` |
| 35 | `-9` |
| 49 | `ambT = 1` |
| 50 | `/ 5` (snow), `2` (time constant) |
| 52 | `FK.season() === 3` (winter, a magic index) |

Fix: move them into the sound book (HB). For example:

```diff
-  master = AC.createGain(); master.gain.value = 0.5; master.connect(air);
+  master = AC.createGain(); master.gain.value = HB.master; master.connect(air);
```

## 12. RULE / low — sound.js:17 and :11

- **sound.js:17:** the noise buffer takes about 48,000 draws (`AC.sampleRate`) from the looks stream (`FK.glance`) on your first tap. Every later look draw (rain drops, bolt shapes, jolt) then depends on when you first tapped and on the device's sample rate. The match is unaffected; visuals are not reproducible from the seed. Fix: `const g = FK.NS_rng(FK.seed() + HB.noiseSeed)` and fill from `g()`.
- **sound.js:11 (unsure, console only):** `.then(() => { stuck = AC.state !== 'running'; })` reads the module-level `AC`. If a later `wake()` closed it and failed to make a new one, `AC` is null and the promise rejects without a handler.

---

## What computers still do the same every game (not touched by the deal)

- **Where they build:** spot() starts at the north-west corner every time (#2), including the free Mill and Farm at the start.
- **Opening:**
  - Every personality's first `build` entry is BM1 (Barracks), and each list's order is fixed. The deal shuffles only `goals`.
  - The first soldier is always Spearmen: in the Stone age only the barracks trains, and `bestCounter` starts at `m.cyc` 0, so it picks `can[0]`.
  - The scout always comes at 60 s with 200 food (`ai.turn.scout`). Its route (combat.js:378) always circles the map in the same direction, by angle.
- **Age timing:** `A.ageAt [12, 4]` is not dealt (ai.js:92), so a personality ages at nearly the same villager count each game.
- **Research:** `P.techs` order is fixed per personality.
- **Choke and diplomacy:** both always face you first (#3).
- **Where attacks land:** always the seat; riders always go for the drop-off nearest the attacker (#4).
- **Towers and walls:** the tower always goes toward the middle, and the wall arc faces the middle. This is map-dependent and by design.
- **Now varied by the deal:** which side gets attacked first. When nobody has seen anyone's army, the odds tie and the tie used to go to you (first in `D.players`). The grudge now breaks it toward the dealt foe.

## The 3 cheapest changes with the most visible difference between games

The bug in #1 should be fixed regardless. It is one clause, and it is what lets rivals keep growing past Classical instead of sitting on a bank.

1. **Deal each town a facing** (#2): 3 lines plus `"turns": 8`. Every rival's layout, including the start Mill and Farm, differs from game to game.
2. **Hold the choke toward the dealt foe** (#3): 1 line, no book change. Rivals stop all camping on your road; which one blocks you changes each game.
3. **Deal each side a wave aim** (#4): 2 lines plus `"aims"` in D390. Some rivals go for your Town Center, some burn the nearest buildings, some hit a drop-off, so attacks arrive differently each game.

Runner-up: put `ageAt` into the dealt plan (in deal(), set `P.ageAt = [...A.ageAt]` and add it to `V.by`; read `P.ageAt` at line 92). Rivals would then reach each age at different times.
