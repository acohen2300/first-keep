# v-ai review: rival variety (9f49f045, merged in 1d0379ea)

Read-only. Snapshot /home/claude/rv at 1d0379ea. Line numbers are snapshot lines. I ran plain node on a word-for-word copy of `deal()` (ai.js:16-21) and the books (/tmp/v-ai/deal.js): 20,000 random seeds plus seeds 1, 2, 3, 7, 42 and 3382234986. No game, no browser.

Counts: CRASH 0, PLAY 7, FRAMES 0, RULE 1.

## The live lead: front_line, 0/18 before, 20/1 after

**Answer: no. The dealt plan cannot recall or redirect the 20 FOES in that test.** The swing comes from somewhere else (see "what to run" below).

The test is tools/check.py:293-306, run on `SEED, MINUTES = 7, 5` (line 12). `fk.reset` is `start` (index.html:1784), so the match seed is 7.
- Its SET sends the foes with `WAR.attack(2, P, FOES)`. That runs combat.js:98, which sets `waves[side] = { n0: army.length, k, t: 0, hp: 0 }`. This wave has **no `S`**, and `dress` gives every foe a `goal`.
- **AI recall / redirect.** The AI only steers waves that have `S` (ai.js:145 `if (w && w.S) { ... WAR.recall(side) ... }`). For any other wave it stops at ai.js:149 `if (w) return;`, so no recall and no new wave. Even without that line, the foes have a `goal`, so they fail the `free` filter (`!u.goal && !u.drill && !u.esc`). ai.js:131 skips the choke while the wave stands (`if (!WAR.waves[side]) chokeClaim(...)`).
- **Loot.** combat.js:368 returns early: `if (!P || !P.loot || army.length < L.army || waves[o]) return;`. Also, `loot` is true in all three personalities (D303), and D390's `flip` does not turn it over, so loot acts the same before and after.
- **Other recall paths** are not driven by the plan:
  - combat.js:287 breaks the wave when fewer than D142 0.3 × 20 = 6 soldiers stand. "Theirs lost 1" rules that out.
  - econ.js:474 `recallAt` only acts when `w.k === FK.tileAt(seat)`. P is 30 tiles from our seat.
  - Vassalage (econ.js:565).
- **No earlier AI wave.** Every side starts with villagers only (index.html:1175), so no computer wave existed before SET.

What the plan does change at seed 7 (from the copy of `deal`):

| Side | Before | After |
|---|---|---|
| 1 | aggr | fort |
| 2 | bal | aggr (waveMin 4, bold 0.45, guard 0.16, grudge on you × 1.49) |
| 3 | fort | bal |

Those plans change villager jobs and building sites in the first 24 s. Through econ.js's 15 `FK.rng()` calls, and the test's `fk.spawn(..., fk.rng)`, that can change the order of draws on the shared stream. *Unsure* that this alone explains a full flip.

What to run (one local edit, not for commit): at 1d0379ea, set ai.js:22 to `const dealt = (side) => A.pers[A.pers.of[side]];` and run front_line.
- If 0/18 comes back, the plan is the cause. Then bisect: personality pick, then the numbers, then the flips.
- If it doesn't, the cause is stream divergence. In that case "lost fewer than they have" is a one-seed check and should be measured over a few seeds.

Also compare the right builds: before = eeaa629e, after = 1d0379ea. The agent-ai branch starts from 773424b2, which lacks 5ef6bc4a ("attack a group by its front line"), c069fb93 and 2729a067. If "before" was measured on that base, the front-line change itself lies in between.

## Checked and fine

- **Same plan after save/load.** `start` runs `makeGround(S ? S.seed : ...)` (index.html:1780), so `FK.seed()` comes back, and `dealt` keys its cache on it (ai.js:22). `mind` (skip, mark, markT) is saved and refilled (ai.js:179-180) and cleared on start (ai.js:177). Each seed dealt twice gave identical JSON every time.
- **Reset deals again.** `restart` writes a new `#seed` and calls `start()`. `hand.seed !== sd` then deals again.
- **No nonsense numbers.**
  - armyCap minus (waveMin + Easy's wave 3) is at least 2 over 20,000 seeds.
  - The villager cap is at least 68.
  - The lowest counts are raid 1, early 4 and waveMin 3; no cap comes out 0.
  - The job-mix shares are scaled one by one, but ai.js:128 divides by their total, so they still work as shares.
- **Liked class.** A liked class that can't be trained yet falls back to every kind: `fav.length && ...` at ai.js:73. With foes in sight, ai.js:74 only multiplies the score.
- **Every side alike.**
  - Each personality comes up about 1/3 for each side.
  - The grudge falls evenly on the other three sides, so you are each computer's grudge 1/3 of the time.
  - Every side starts at war with every other (sides.js I2 "start": "war").
  - A grudge side that later falls or makes peace is skipped (ai.js:151 `ECON.fell(q) || !WAR.atWar(side, q)`). The grudge just goes dead and is never re-picked.
- **Frames.** `per()` is O(1) after the first deal. No new per-unit work.

## Findings

### 1. PLAY: with no foe in sight, half the soldier kinds are never trained
ai.js:73 `pool = fav.length && i % CO.mix ? fav : can; return pool[i % pool.length];`
`can` is only read on even turns (CO.mix = 2), so with an even number of kinds only even slots are ever picked. Take 4 kinds [UM1 Foot, UM2 Archers, UM3 Riders, UM4 Foot] with Riders liked: over 40 turns it picks UM1 10 times and UM3 30 times; **UM2 and UM4 are never picked**. The old line `can[i % can.length]` cycled through all of them. So this change cuts variety, and E1405 ("every other soldier is of it") is not what happens.
```diff
--- a/ai.js
+++ b/ai.js
@@ -73 +73 @@
-  if (!foes.length) { const fav = can.filter((c) => FK.SH[c].class === P.likes), pool = fav.length && i % CO.mix ? fav : can; return pool[i % pool.length]; } // E1405
+  if (!foes.length) { const fav = can.filter((c) => FK.SH[c].class === P.likes), pool = fav.length && i % CO.mix ? fav : can; return pool[Math.floor(i / (fav.length ? CO.mix : 1)) % pool.length]; } // E1405
```

### 2. PLAY: the villager cap still leaves no room for the army aim at full (the N460 stall can come back)
ai.js:98 `vs.length < Math.min(P.vills, D.popMax - aim(side))`
- **Peace widens the cap.** `aim` is halved when the side is at peace with everyone (ai.js:64 `DP.stand`). The cap widens by cap/2, villagers fill it, and when war returns the full army aim doesn't fit.
- **Other units aren't counted.** `ECON.popOf` counts every unit (econ.js:35): caravans (up to 3), priests (up to 3), medics (2), a spy and a scout, so up to about 10. The cap leaves them out.
- **Example:** a fort dealt vills 121 and armyCap 38 at age 3 has cap 68, so villagers stop at 112. Add about 10 other units and only about 58 places are left for soldiers, under the aim of 68.

So E1404's "at full there is always room for soldiers" doesn't hold. The army aim stalls for 420 s, is put aside for 900 s, and repeats. *Unsure:* whether `ECON.soldier` counts priests and medics; that changes the gap between 5 and 10, but the fix is right either way.
```diff
--- a/ai.js
+++ b/ai.js
@@ -98 +98 @@
-  if (grow && vs.length < Math.min(P.vills, D.popMax - aim(side)) && (!saving || R[FOOD] >= of(need[FOOD]) + AT.spare)) {
+  if (grow && vs.length < Math.min(P.vills, D.popMax - cap(side) - (ECON.popOf(side) - vs.length - inArmy(side))) && (!saving || R[FOOD] >= of(need[FOOD]) + AT.spare)) {
```
(The rest of the line is unchanged.)

### 3. PLAY (older code, now more frequent): a recall sends home every soldier of that computer, not just the wave
combat.js:93 `function recall(side) { waves[side] = null; homeAll(orders(side)); }`
For a computer, `orders(side)` is every soldier not routing (combat.js:40 `armyFree(side, 'rout').filter((u) => side !== ME || ...)`). `homeAll` (combat.js:97) also clears `esc`, `drill` and `goal`.

So when an AI wave breaks or stalls (ai.js:148, combat.js:287), all of these walk home too: the home guard, choke holders, looters, caravan escorts, and any band fighting somewhere else. This is the "recall an army it was ordered to attack with" mechanism. The new plans make AI waves, and so recalls, more frequent: waveMin goes as low as 3, bold as low as 0.43, and the grudge multiplies odds by up to 1.6. It does not fire in front_line, because the wave there has no `S` and doesn't break.
```diff
--- a/combat.js
+++ b/combat.js
@@ -93 +93 @@
-function recall(side) { waves[side] = null; homeAll(orders(side)); }
+function recall(side) { const w = waves[side]; waves[side] = null; homeAll(w && w.S ? w.S.filter((u) => !u.gone) : orders(side)); }
```

### 4. PLAY: some dealt forts almost never attack
D390 `"opportunist": [0.5, 1.5]` times fort 1.3 gives 0.65 to 1.95, then times D304 opp (Easy 0.8, Normal 1).
- **The temptation becomes a deterrent.** In 26.7% of fort plans on Normal (46% on Easy) the product is below 1, so a foe at another war reads *less* tempting, the opposite of D303/D304. Every side starts at war with every other, so `busy` is true for every target. In 15.2% of fort plans on Normal, `prob * opp < bold` for any odds below 1. That fort only marches near a full army (ai.js:153 settle 0.4) or at its grudge side.
- **Bold over 1.** `bold` [0.85, 1.15] plus Easy's +0.1 reaches 1.08. That happens in 10% of all plans on Easy (`WAR.odds` < 1, combat.js:313).
```diff
--- a/books/measure.js
+++ b/books/measure.js
@@ D390 @@
-"bold": [0.85, 1.15], ... "opportunist": [0.5, 1.5],
+"bold": [0.85, 1.05], ... "opportunist": [0.8, 1.5],
```
These are tuning numbers; Albert should approve them.

### 5. PLAY (design call for Albert): side names no longer match how they play
words.js:17 J13 `"sides": ["You", "Raiders", "Rivals", "Fortress"]`, and D122's text "Mid's Raiders (1), Rivals (2) and Fortress (3)".
The personality is now drawn at random (ai.js:17 `one(V.pick)`):
- "Fortress" plays aggressive (aggr) in about 1/3 of matches.
- "Raiders" may build walls and a Wonder.
- In 11% of matches all three computers get the same personality.

ai.js:156 still announces "Fortress march on you with {n} soldiers." Two options: (a) keep each side's own personality and vary only its numbers, flips, goals, liked class and grudge; or (b) name each side after the personality it was dealt. Option (a):
```diff
--- a/ai.js
+++ b/ai.js
@@ -17 +17 @@
-  return SIDES.map((_, side) => { if (!A.pers.of[side]) return null; const name = one(V.pick), P = { ...structuredClone(A.pers[name]), name, vills: U.vills[name] }; // E1400
+  return SIDES.map((_, side) => { if (!A.pers.of[side]) return null; const name = A.pers.of[side], P = { ...structuredClone(A.pers[name]), name, vills: U.vills[name] }; // E1400
```
(Option (a) leaves D390 `pick` unused; remove it in the same commit.)

### 6. PLAY (low): a save loaded on a newer build can switch a computer's personality mid-match
ai.js:179 `X.ai = { clock, rings, claimT, helped, league, mind }`. The plan isn't saved; it's re-dealt from the seed and the books. If D303 or D390 changes between builds (they're tuning), an old save deals a different plan mid-match, e.g. aggr becomes fort. `mind` (want, skip, mark, save) still carries the old plan's state. Within one build it is fine.
```diff
--- a/ai.js
+++ b/ai.js
@@ -179,2 +179,2 @@
-FK.on('save', (X) => { X.ai = { clock, rings, claimT, helped, league, mind }; }); // E668
-FK.on('load', ({ ai: M }) => { league = M.league; const keep = { clock, rings, claimT, helped, mind }; for (const k in keep) FK.refill(keep[k], M[k]); rates.clear(); level(); });
+FK.on('save', (X) => { X.ai = { clock, rings, claimT, helped, league, mind, hand }; }); // E668
+FK.on('load', ({ ai: M }) => { league = M.league; hand = M.hand || null; const keep = { clock, rings, claimT, helped, mind }; for (const k in keep) FK.refill(keep[k], M[k]); rates.clear(); level(); });
```

### 7. PLAY (low, unsure): an aggr dealt walls rarely builds them
D303 aggr `"mix": [0.5, 0.35, 0.15, 0, 0.08]`. Its stone share is 0, and scaling keeps 0 at 0 (ai.js:18 `Math.round(0 * s)`). After age 0 the job mix puts nobody on stone (ai.js:127 `M1 = s.age ? M0 : young(...)`), and walls need `R[STONE] >= WP.stone` (ai.js:106). So the walls flip (35% of aggr plans) mostly does nothing; stone only comes in when a goal's price has stone. Not checked in play. If confirmed, either don't flip walls for a zero-stone mix, or give a walled plan a stone share.

### 8. RULE (low): E1402's text overstates
E1402 says an aim put aside is passed over, including "the age". But ai.js:66 returns `if (saving) return age;` before `off()`, so while saving the age is never put aside. The mark at ai.js:121 still sets `skip.age`, which only matters in D290's spend window. The behaviour is reasonable; fix the comment: "the age, except while saving (D290)".
