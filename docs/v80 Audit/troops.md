# Fresh-eyes audit: 14-sim-troops.js, 15-sim-spatial.js, 16-sim-fight.js (v70)

Scope: every line of the three files (603 + 212 + 383). Helpers they call were looked up in 08-core, 09-nav, 11-orders, 12-sim-core, 38-natives as needed.
Repro scripts: /tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/agt-scripts/ (run.py + wild.js, gp.js, nat.js, flank.js), run against the copied build at /tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/ag-troops/first-keep.html. Source copy diffed identical to the repo.

No S1 (crash, data loss, determinism break) found. No Math.random or clock in these files. The only browser-storage use is localStorage in `finish` (see S3-6).

## S2: wrong behaviour

### S2-1 VERIFIED: a side at peace or allied with the Natives cannot fight wolves, bandits, robbers or the horde
- WILD is one side holding both the Natives and every animal and outlaw. `natSync` (38-natives.js:16-38) sets `G.rel[o][WILD]` to 'peace' (regard 40 and up) or 'ally'.
- The search for foes goes through `atWar`: `nearestFoe` and `bestFoe` (15:46, 15:102), and so do towers (12-sim-core.js:431, which calls nearestFoe). `nearestFoeBld` (15:142) does too.
- `wildTick` attacks with no relation check (14:463-473 uses `nearU` with `v.owner !== WILD`), and `hurt` never declares war on WILD (16:120).
- Repro (wild.js, relation pinned each tick): at war, the swordsman kills the wolf (sword 70→52.5, wolf 45→-2.6). At peace, the wolf takes the swordsman 70→47.5 while its own health stays at 45, because the swordsman never targets it.
- The horde breaks only the buildings of sides at war (`nearestFoeBld(WILD…)` at 14:475) but attacks everyone's units: the rule is not even applied the same way inside WILD.
- Fix: decide relations per faction: Natives (`u.native`, the citadel) follow `G.rel`, and the rest of the wild is always hostile. One predicate, `hostile(o, v)`, used by atWar's callers and by wildTick.

### S2-2 VERIFIED: `groupPower` leaves out the soldier itself
- 15:78-82: `unitsNear` skips `from` (15:191, 15:203), then `Math.max(p, unitPower(u))` takes the larger of the two where the sum is meant. The comment at 15:72 says "itself in".
- Repro (gp.js): one sword gives 79.3, and two swords side by side also give 79.3 where 158.7 is expected. Every `canBeat` judgement undercounts by one soldier. For a pair, the error is half the group.
- Fix: `return (u.gp = p + unitPower(u))`.

### S2-3 VERIFIED: a lone soldier's flanks are wrong (FLANK and the nerve weights)
- `fromWhere` (16:13-25) builds the line's facing only from comrades (unitsNear skips `t`; the `v === t` test at 16:17 is dead). With no comrade within 40, fx = fy = 0 and it returns 0, which counts as "from the side" for every blow.
- Repro (flank.js), a lone engaged sword: struck from the front, nerve −0.171; struck from behind, nerve −0.171 and hp −10. Both get the side weight of ×1.5, and the rear blow never gets FLANK ×1.3. With a comrade present: front −0.114, behind −0.229 and hp −13 (correct).
- Fix: seed fx, fy with `t.fx, t.fy` before the loop.

### S2-4 VERIFIED: every WILD attacker is treated as an animal: Native warriors and citadel towers do half damage and never shake nerve
- 16:59 `if (o === WILD && t.owner !== WILD) d *= MORALE.wild`, and 16:63 `if (o !== WILD)` gates the nerve drain. MORALE.wild (06-rules-tuning) is documented as "animals hit soldiers at half strength".
- Natives are owner WILD and run solTick, and the citadel towers are WILD buildings (bldTick → `hurt(WILD, null, …)`).
- Repro (nat.js): a Native's blow of 10 gives hp −5.00 and nerve −0.000; a rival spear's blow of 10 gives hp −10.00 and nerve −0.114.
- Same root: a citadel tower's arrow raises the alert "Wolves attack at …" (16:130, `UNIT[a ? a.kind : 'wolf']`). Bandits, robbers, trolls and the horde are also halved and do not shake nerve. If that is meant, the comment and the help text are wrong.
- Fix: gate on the attacker being an animal (`hasTag(a.kind,'animal')`), not on its owner.

### S2-5 VERIFIED: nerve drain reads the blow before armour, shape and FLANK
- 16:62-66 subtract nerve using `d` before 16:71-77 apply armour, `shapeOf().hit`, `vsMounted` and FLANK.
- The help text (07-text.js:916) says "a blow drains it by the share of health it takes". Armour research and formations therefore do not protect nerve, and the rear ×1.3 is not counted.
- Fix: compute the final `d` first, then drain nerve once from it.

### S2-6 VERIFIED (arithmetic): Engagement removes the two-second grace before a router can be taken prisoner
- 14:233 sets `routT = G.t + MORALE.rout * 0.5` (4 s) with 'engage'. 14:329 tests `tgt.routT - G.t < MORALE.rout - 2`, which is a fixed 6.
- With Engagement, 4 − ε < 6 is true at once, so the soldier is capturable on the first tick. Without it, capture opens after 2 s. A benefit tech makes your routers easier to take.
- Fix: store `u.routAt = G.t` and test `G.t - u.routAt > 2`.

### S2-7 VERIFIED (reading): healing does not match its documented rule or the player's help
- 14:89-91 say "τ = max / heal, a half-dead soldier takes the time it did". 07-text.js:966 says "heal 3 health a second".
- With the lag, the rate is heal × (max − hp)/max. A half-dead swordsman (35 of 70, heal 3) took 11.7 s to full on the linear rate. On the lag, getting within 1 hp takes τ·ln 35 = 23.3 × 3.56 ≈ 83 s, about 7× longer.
- Fix: correct the comment and the help text (or choose τ so the stated time holds), and say in SCIENCE.md which one it is.

### S2-8 VERIFIED (reading): two heal paths stack, against "they do not add up"
- The solTick garrison heal (14:156-170) runs alongside `healTick` (14:92-111). A soldier by its Barracks and a Hospital gets both.
- The Castle, Barracks and Town Center list is hand-written (14:166), not read from `BLD`.
- Fix: give those buildings `heal`/`hrng` in BLD and delete 14:156-170 (−15 lines). One path, best-of.

### S2-9 VERIFIED (reading): conversion leaves stale identity on the converted unit
- 14:41-51 do not clear `t.native`. A converted Native keeps the causeway ambush bonus (16:68), costs its new owner's attackers regard (16:88), and is killed or sworn away by `takeThrone` (38-natives.js:104-113, which loops over `u.native`).
- No army-ceiling check either: wayfarers respect `clsMax` (14:524), conversion does not.
- Fix: reset `native` and check the ceiling (or refuse) in the conversion.

### S2-10 VERIFIED (reading): wild attackers measure reach to a building twice
- 14:485 `reach = U.rng + 5 + (t.q ? halfOf(t) : 0)`, then 14:486 tests `edge(u,t) <= reach`. But `edge` for a building is already the gap to its wall (09-nav.js:467).
- The horde hits a 6-cell building from up to rng + 35 off its wall. solTick does it correctly (14:325, no halfOf in the test).
- Fix: use halfOf only in the moveTo radius.

### S2-11 VERIFIED (reading): splash from a petard bombard
- 16:41-43 damage the neighbours with no `by`/`byT`, so a building killed by splash pays no plunder. The test runs over all of `G.blds` on every shot (use `bldsNear`).
- `fxv(o,'blast',…)` is computed twice per blow (16:37, 16:41).

### S2-12 SUSPECTED: units at the exact same point never separate
- `pushApart` 16:152 `if (d > 0 && d < 8)`: d = 0 does nothing.
- Fix: a deterministic nudge by id when d = 0.

### S2-13 SUSPECTED: grid staleness inside a step
- The unit grid is built once per step (15:8). Units then move (up to about 3 px a tick) and are knocked back (up to 5 px) before later queries.
- nearestFoe and bestFoe pad by 3. `nearU` and `unitsNear` pad by 0, so a unit that crossed a cell edge this step can be missed at the border.
- Fix: pad all four queries by the largest move in one step plus the largest knock (8).

## S3: rule violations and bloat

1. VERIFIED. `canBeat` does not match SCIENCE.md:66, which says "against the power of the foe's group"; the code uses the single foe's `unitPower(v)`. Also, `lanchester(r) > 0.5` is exactly `r > 1`, so the square-law call adds nothing but a name. The odds form r²/(1+r²) is not in Lanchester 1916 (the square law gives a deterministic winner, αN² vs βM²). It is a ratio-form contest function (Tullock 1980 / Hirshleifer 1989, exponent 2), and SCIENCE.md:14 labels it "verified Lanchester". Rule 5 asks for the established form with its true source.
2. VERIFIED. There are two measures of fighting worth. `unitPower` uses dmgOf per blow (no cooldown, all buffs); `foeValue` uses stats dmg per second (cooldown, no zeal, charge or temper). The same comparison can disagree. Pick one: dps from dmgOf.
3. VERIFIED. The grid walk is copied four times (nearestFoe, bestFoe, nearU, unitsNear: the bounds block, the triple loop and the fallback). One `eachUnitNear(x, y, r, fn)` saves about 35 lines and fixes S2-13 in one place.
4. VERIFIED. The Engagement tech has `fx: []` (04-rules-tech.js:2604), but its effects are hard-coded: rout × 0.5 (14:233) and the kiting switch (08-core.js:343). This hides an effect from the table and from the tech's own description ("Stances for the army.").
5. VERIFIED. Loose numbers outside 01-06:
   - 320 four times (14:121 ×2, 14:282-283)
   - 260 twice (14:6, 14:312)
   - 24 and 0.3 in followArmy
   - the 50 food fallback (14:527)
   - the fantasy ×1.5, also written again in 30-cards.js:205
   - GROUP_R 60 in 15
   - the 220 and 3-drop limits in startWork
   - the 1.4 chase factor
6. VERIFIED. `finish` (16:322-344) is storage plus view (localStorage, showEnd, celebrate) sitting in a simulation file, with two silent `catch (e) {}`. `startWork` and `slotsOf` (16:359-383) are economy in "fight". `slotsOf = () => 1` ignores the argument every caller passes (11-orders.js:892, 13-sim-civil.js:193…); make it a constant in 01.
7. VERIFIED. Comments that contradict the code:
   - 14:196 "four times a second" vs 14:261 "about seven times a second", for the same `% 4` at 30 Hz (it is 7.5).
   - 14:170 "garrisoned" (it is near, not inside).
   - 16:3 / 16:5 `t.fx === undefined` is dead: addUnit always sets fx = 1.
   - 16:17 `v === t` is dead.
8. VERIFIED. Redundant branches:
   - `v.owner === WILD ? UNIT : stats(…)` at 15:66 and 15:207: `stats` already returns UNIT for WILD (08-core.js:498).
   - `o === 0` at 14:295, since temperOf is T_GUARD for others.
   - `!isB` at 16:68, inside the else branch.
   - `nearestFoeBld` called twice at 14:265.
9. VERIFIED. The `fall` share uses the constant `ARMYMAX` rather than the fallen side's room, and computes the expression twice (16:280, 16:284). `fall` resets `ally` but not `G.rel`.
10. VERIFIED. Ledger reasons: shrine income goes through `earn(…'loot')` (14:565), while the other finds use 'finds'.
11. solTick is 273 lines. Split it into `moraleTick` (14:156-247, garrison heal plus nerve, about 90 lines), `pickTarget` (14:248-323) and `strike` (14:324-377). The split itself is line-neutral; with S2-8 and the duplicated reach/hold expression (14:299 = 14:325) folded in, it saves about 20 lines.

## S4: minor
- The `wildTick` flee step clamps x and y separately, so a fleeing animal runs √2 faster on diagonals (14:427). Grazing passes SP = 1, so weather is ignored (14:453).
- Escort: 14:305 replaces `tgt` locally but leaves `u.tgt` on the far foe, so nearestFoe runs every tick and `u.tgt` is wrong for heft and nerve. `escortPick` by `escId` does not check the owner after a conversion.
- `TECH.find((T) => …)` shadows `const T` (14:583).
- The shrine capture counts dead and inside priests (14:546).
- `watchHome` ignores the horde (16:316). The fall news is 'good' even for your ally (16:294).
- `wayfarerTick` sets `v.job` directly instead of using `setJob` (14:526).
- Unreachable in practice: `declareWar` inside hurt (16:120). All callers already require atWar.

## Not checked
- The bodies of moveTo, formUp, takePrisoner, bldTick, natSync and the save field list beyond lookups.
- Performance under load (no soak, per the rules).
- Balance effects of the fixes.
- Whether S2-4 halving for bandits is wanted (the documentation says animals).
