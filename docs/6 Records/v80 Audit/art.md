# Art audit: src/18-figures.js (2,043) and src/19-building-art.js (2,821), v70

Every line of both files read. Method: line reading, plus three scripts in
`/tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/ag-art/`:

- `xcheck.js`: loads rules 01-06 in a VM and checks every UNIT look, BLD kind, civ and TECH.at against LOOKS, LOOKBOX, ART, WONDERART, BLDTOP.
- `harness.js` + `runtests.js`: a stub 2D context that tracks the transform, save/restore depth, NaN coordinates, invalid fillStyle values and every point drawn outside the sprite canvas. It renders every look × tier 0-3 × every frame (vil 0-3 and 10-21) × kit 0-3 (1,024 sprites), and every building kind × owner × civ (wonder) × tower step × season (92 sprites).
- `tiers.js`: applies the same matching rule as `stats()` (08-core.js:513-514) to list which techs raise each unit's art tier.
- `keys.js`: brute-forces the sprite cache keys for collisions.
- `flat.py` + `sim/`: rewrites each `P_([[x,y],...])` to a flat list and reformats with the repo's own `.prettierrc`, to measure the size claim.

## S1 crashes

None found (VERIFIED). No `fault()` in 1,116 renders, no NaN coordinates, no save/restore imbalance (depth 0 and no underflow everywhere), no bad gradient stops.

## S2 wrong behaviour

### 1. Placing a pit or stakes shows a house ghost (VERIFIED)
- 19:2617 `(ART[b.kind] || ART.house)(...)`. ART has no pit, net or stakes; trap art lives in 23-view-things.js:3-45.
- drawGhost (24-view-overlays.js:222-298) only branches for `wallish` and `wall`. pit and stakes are in the build menu (03:676), so they reach `bldSprite({kind:'pit'})` at 24:293-294.
- Harness: a `pit` sprite issues 71 ops, the same count as `house`.
- Fix: one home for trap art. Move it into ART (pit, net, stakes) and drop the `|| ART.house` fallback so a kind with no art faults instead of hiding.

### 2. The elite pennant shows without the elite research (VERIFIED)
- 18:1988-1990 and 18:2032 draw the pennant when `tier > 0 && ELITE_LOOK.has(look)`. The comment claims the common kinds "never reach a tier".
- tier counts every tech whose `tier.unit` is the kind or its base (08:513). `tiers.js` shows:
  - legion: `arms` (common Men-at-arms) and `elite_roman`
  - immortal: `arms` and `elite_persian`
  - malihorse: `knighthood` and `elite_mali`
- So Rome, Persia and Mali get the gold "elite" pennant from common research. Tiers 1 and 2 are also cached as two identical images.
- Fix: pass the elite flag (`p.techs.has('elite_'+civ)`) instead of reading it from tier. Correct the comment.

### 3. Spear art follows the number of techs, not which tech (VERIFIED by logic)
- 18:1369-1389 uses t===0, t===1, else pike.
- phalanx, pikesquare and halberd have no `need` between them (04:1037-1103). A side with only Pike square has tier 1, so it draws the Hoplite (corinth, aspis) while the name reads Pikeman. Halberd alone does the same.
- Halberdier has no art of its own and reuses the pike.
- Fix: choose the art by the highest tier tech held (a table: tech id to look parts), not by count.

### 4. Sprites cropped by LOOKBOX/BLDTOP (VERIFIED, harness; overflow in local units)

| look | overflow | when |
|---|---|---|
| caravan [36,30] | horse muzzle cut by ~4.6 | every frame |
| chariot t0 [36,34] | same, horse at dx 9 | every frame |
| native (no entry, default [26,30]) | spear tip cut by ~7 | every frame |
| troll [26,46] | club cut by ~15 | attack |
| arquebus [40,30] | muzzle flash cut by ~4.4 | attack |
| spear t2 [52,34] | pike cut by ~2 | attack |
| deer | antlers cut by 0.3 | negligible |
| throne (no BLDTOP, default 40) | crown and spires cut by ~6 | always |

- Fix: correct the entries (caravan/chariot ~52 wide, native 44, troll ~60, arquebus ~50, throne ~80), or measure the bounds once. LOOKBOX also sizes shadows (23:247) and dots (23:724).

### 5. `win(..., true)` passes a boolean as the fill colour (VERIFIED, harness flagged)
- At 19:810, 923, 924 and 2096 (house, barracks, mint), `win`'s 5th parameter is `col`, so `fillStyle = true`. The canvas ignores it and the windows paint in the leftover fillStyle.
- Fix: drop the `true`.

### 6. Research marks: missing on 7 kinds, oversized on small props (VERIFIED)
- The comment at 19:75 says research shows on its building. Harness op counts at UP 0 and UP 2 are identical for tower (3 techs), range (8), temple (5), aqueduct (4), dock (10), workshop (7) and quarry (5). Their keys still vary by `up`, which makes useless cache copies.
- UP applies to every nested `block()` call (19:151-199). The 3-tall footing covers the whole market well (h 2.4, 19:1097) and the stalls (h 2.6, 19:1122), and pokes above them.
- Fix: draw the marks once per building in bldSprite (footing on the plot or the main block only), and drop `up` from the key where it is not drawn.

### 7. banner() ignores its colour, and its draw branch is dead (VERIFIED)
- FLAGS is always `[]` while ART runs (19:2615), so 19:418-427 never runs. flagsOn (23:327) paints every flag in the owner's colour.
- Theatre's `'#3b5fa6'` second banner (19:1384) shows in the owner's colour.
- Fix: drop the parameter and the branch, or carry the colour into `c.flags`.

### 8. Native `shieldCol` (18:1880) is never read (VERIFIED)
`shield()` uses `o.trim || o.tunic`, so the hide shield draws in the tunic colour.

### 9. Cache waste (VERIFIED) and possible thrash (SUSPECTED)
- Stampede bison get `u.tier = 0..9` (37-events.js:73), but LOOKS.bison ignores tier: 10 identical sprite sets per frame and scale.
- Farm key includes `b.node.type`, which the art ignores. Spring and Summer trees are cached separately but are identical.
- SPR caps at 600 and evicts FIFO (a `get` never refreshes), so the hottest early sprites, the villager frames, go first. Not measured live.

## S3 bloat and rule violations

### Size
- 1,091 of 2,044 lines in 18 and 1,450 of 2,822 lines in 19 are 14 characters or shorter.
- 926 lines are a lone `[x, y],`. 213 `P_` calls take 2,223 lines, about 10.4 each.
- **Measured:** flattening the point arrays alone and running the repo's prettier gives 4,864 to **3,345 lines (−31%)**. Behaviour is unchanged and the result parses.

### Duplicates (estimated savings)
1. **Axis-aligned rectangles as 4-point polygons:** 60 in 19, 8 in 18, about 716 lines. A `R_(x0,y0,x1,y1,f,s,w)` helper makes each one line. About 110 lines more on top of the flattening.
2. **Rider on horse**, copied 6 times: 18:1319-1323, 1518-1522, 1527-1543, 1545-1561, 1564-1571, 1574-1578. `rider(horse, person, fr)` saves ~25.
3. **Pole arms:** spear, pike, jav and lance (18:579-616, 768-798) are one shape: shaft plus point at an angle. One table row each saves ~55. axe, pick, hammer, club and bigclub (627-704) share the preamble, and club/bigclub differ only in numbers: ~30.
4. **Bow string:** bow, xbow and ballista (18:720-757, 1706-1714) share curve plus string: ~15.
5. **Tone gradient** `LG(..,[shade(c,1.15-1.25), c, shade(c,.7-.75)])` appears ~10 times (18:185, 194, 824, 840, 866, 966, 1016, 1105, 1211, 1279).
6. **Side-colour stripe** `L_(-w/2, d/2-0.5, w/2, d/2-0.5, c, 1.2)` appears 15 times in 19 (811, 830, 874, 881, 887, 905, 1069, 1179, 1244, 1268, 1469, 1489, 1802, 2143, plus 715 and 805 at 1.4). It belongs in bldSprite or block once: ~15.
7. **Turret with pyramid cap:** keep bell tower (19:666-711) and castle towers (758-799) are the same code. ART.tower (1614-1626), aqueduct (834-846) and wall (1685-1696) repeat the sides + front + stone texture that `block()` already does. `turret()` saves ~60.
8. **Pediment:** library (1233-1243), temple (1439-1449) and courthouse (1456-1466) all call ridgeRoof then draw a triangle, and ridgeRoof's own comment says "the pediment is drawn after". Folding it in saves ~25.
9. **Lean-to yard:** workshop 1880-1887 and foundry 1920-1927 are the same code. The back hut in barracks 919-925 and stable 997-999 is the same too: ~20.
10. **Crane:** dock 1545-1549 and quarry 2045-2057. Spear rack: barracks 937 and range 982. Water ellipse `['#5fa0c4','#2f5f80']`: 3 copies.
11. **Pole + pennant in c:** 6 copies (bombard 1492, ram 1624, stower 1663, treb 1750, performer 1824, elitePennant 1989): ~25.
12. **Three tint functions:**
    - `shade` (18:13) and `NS_c` (19:2634) are the same function.
    - `lit` and `mix` (19:24-33) are a second system.
    - `NS_poly` (19:2639) copies `P_`.
    - The seeded PRNG is written 4 times (19:294, 502, 1082, 2633) and again in 25-view-weather:93.
    - About 35 lines, and a one-home violation.
13. **Palette constants bypassed:** `'#6b4a2c'` appears 14 times in 18 although `LEATHER` holds it. `'#5a3a1c'`/`'#5a3a1e'` and `'#8a6a3a'` are repeated without names.

### Dead code (VERIFIED)
- `o.cross` (18:256-275): no look sets it.
- `weapon2` branch (303-316): only ever set to null (1387).
- `if (w === 'staff')` inside case 'staff' (710) is always true.
- `Math.abs(i) * 0` (1610).
- `texture()`'s `wall` parameter is never read.
- The final `return r` in block (19:268) is unreachable.
- The bare `{}` block at 19:775-796.
- The banner branch and parameter (S2-7) and `shieldCol` (S2-8).
- In bldSprite, the keep/town branches of `var_` are the same, and library and wonder read G.P again instead of `v`.

### Could it be halved? Yes, to about 2,400-2,600 lines
Roughly 1,500 lines are formatting alone (measured). Another ~500-700 come from the rect helper, rider, pole-arm/weapon table, turret, pediment, stripe, one tint, one PRNG and the dead code (estimated). Making LOOKS a pure data table of person parts per tier would take it further.

## Cross-check of kinds (VERIFIED, xcheck.js)
- All 43 looks used by 48 unit kinds have a LOOKS entry, and every LOOKS and LOOKBOX key is used.
- Every non-trap BLD kind has ART, and every ART and BLDTOP key is a BLD kind. All 6 civs have WONDERART.
- Gaps: the traps (pit, net, stakes) have no ART and are drawn in 23 instead, which causes S2-1.

## S4 minor
- Comments that contradict the code: 18:1990 (common kinds never tier), 19:75 (research shows on its building), and 19:1679 ("gun ports" labels the arrow-slit branch). The parts comment at 18:69 omits lean, sash, cross, weapon2 and the *Col fields.
- One-letter mutable global `g`, plus `KIT`, `UP` and `FLAGS` passed as implicit globals. The global function named `trim` sits in the shared scope.
- `lessMotion`, `DRAW` and `still()` (the draw budget) live in the figures file, not the view base.
- The simulation rule holds: no Math.random or clock in 18/19, the PRNG is seeded, and no game state is written.

## Not checked
- Pixel output: no real canvas, so colour and look are judged from code only.
- Live cache hit rate and eviction thrash.
- Callers outside the art files beyond the sprite entry points.
