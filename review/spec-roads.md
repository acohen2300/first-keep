# Roads and bridges: 3 options (spec-roads, Nov 21)

Talk only. Nothing gets built until you say "build".

## First, the facts
- On all 31 seeds every town can already reach every other by land. No bridge is needed to connect them.
- The trouble is long walks: up to 1.81x the straight line (421 tiles where 249 would do). Crossings of 1-5 tiles of deep water would cut those walks.
- "Find the route no matter what": the survey ran on an older branch with a 20,000-step search. Today's build gives every order with no budget of its own 200,000 steps (`D.tries.far`, books/measure.js D230).
  - That covers `march` (combat.js:85, `walkTo` with no budget) and `convoy` (combat.js:90, `undefined`).
  - The survey's worst failure needed about 52,000 steps, so the "can't find it" part looks fixed already.
  - Only two searches are still short: `join` (600 steps, a short hop onto a column) and the wall seal test (20,000).
- Correction to the survey: a bridge cannot just reuse `GATES`. In `walkable()` (index.html:1052) the depth test `H[k] > -D.wade / 2` comes first, and deep water fails it before the gate test is ever reached.

## How I priced them (one yardstick)
- The game's stone wall piece (1 tile, 1.25 m) takes 10 s (D125 BW1).
- Real world: "A group of 12 should be able to build around four to six metres of wall per day" ([lowimpact.org](https://www.lowimpact.org/how-to-build-or-repair-a-dry-stone-wall/)). That's 20-30 worker-hours a tile, assuming an 8-hour day.
- So 1 game second of one villager is about 2-3 real worker-hours. I used this to turn every real rate below into game seconds.

---

## Option A: Bridge (a wall you walk on)
**What you do (taps only)**
1. Build, Keep tab (it has a free 6th slot), Bridge.
2. Tap the near bank, then tap the far bank. The ghost shows the pieces, and a piece turns red if it sits on land or the bridge is longer than 6.
3. Tap Build. Villagers you picked go to build it; otherwise the nearest builder goes, the same as with walls.

**Rules**
- 1 tile wide, 1-6 pieces long. The survey's widest crossing was 5, and one crossing was only 1 tile.
- Everyone can walk on it, like the map's own fords. It has hit points and can burn (Palisade-style `Burn` tick).

**Cost and time**
- Time: **6 s a piece**, the same as a Palisade piece.
  - Source: at the Berezina, about 400 engineers built a bridge "around 100m long and 4-5m wide" on "23 trestles", with its deck "about a foot above the water". They started the night of Nov 25-26 and finished by 1 pm; a second bridge was done by 3-4 pm ([historyofwar.org](https://www.historyofwar.org/articles/battles_berezina.html)).
  - That works out to about 34 worker-hours a metre at full width. Unsure: the start hour isn't given and I split the men evenly between the two bridges.
  - For a 1-tile-wide deck that's about 11-14 worker-hours a piece, so 4-7 s on the yardstick.
  - Caesar's Rhine bridge was 140-400 m long and built in 10 days ([Wikipedia](https://en.wikipedia.org/wiki/Caesar%27s_Rhine_bridges)). That backs "days, not months".
- Cost: **20 wood a piece** (tuning). Real backing: crossings are the dear part of a road. Wade's Highland roads cost about £90 a mile, while one bridge (Aberfeldy) cost over £4,000 ([Wikipedia](https://en.wikipedia.org/wiki/Military_roads_of_Scotland)). I found no timber-per-metre figure, so the number 20 itself is a balance pick.

**Computer sides (same rules)**
- Once per match, each side runs the survey's test: its walk to each other town, with short water crossings allowed.
- Any crossing of 6 tiles or less that cuts its walk by a quarter or more (tuning) goes on its list.
- It builds that bridge when it can pay and is marching or trading that way.
- It treats an enemy bridge like an enemy wall piece and may burn it in war.
- Run one search per think step (ai.js already thinks in steps with `yield`, line 106), because one search took up to 0.33 s in the survey.

**How it fits the code**
- `placeWhy` (econ.js:52) refuses water ("flat") and refuses a piece that isn't next to ground you can reach. Needs its own branch: every piece on water, both ends touching land, and only the end piece tested for reach.
- `build()` (index.html:1017) also refuses water. Add the same kind of branch the Shore buildings already have.
- `walkable()`: add a `DECK` array to the depth test, `(H[k] > -D.wade / 2 || DECK[k] || iced...)`, and use the Open style (OCC 3).
- `hAt()` (index.html:1047): a deck tile must report water level. Otherwise the step from a 1-1.5 m deep bed fails the slope limit (`REPOSE`, about 0.84 m a tile).
- When a piece finishes: `DECK[k] = 1; WALKV++; opened(k)`, exactly as `fell()` does (index.html:1129).
- Builders work outward from the bank on their own: econ.js:324 already makes a site wait until it can be reached, and each finished piece opens the next.
- Save: rebuild `DECK` in `load()` from the bridge pieces, the way `GATES` is rebuilt (index.html:454). No new save field.

**Risk: low to medium**
- Units standing on a piece when it burns would be over deep water. Use the ice rule (they fall in), or step them off like `offIce`. One rule for both.
- `reach()` keeps an old answer for a few seconds after a change (`D.beats.slow`), so a burnt bridge may still count as "reachable" for a moment.
- While the outer pieces wait, `sites()` (econ.js:323-324) would show the "can't reach this site" message. Bridge pieces need to skip that message.

---

## Option B: Ford road (fill the water, like the map's own fords)
**What you do:** same taps as A (Build, Ford, near bank, far bank, Build).

**Rules**
- 1-6 tiles. When finished, the bed rises to the map's own ford depth: `H = max(H, -D.wade * D.lakeFord.deep)`, which is 0.125 m. This is the map's own rule (`wadeTo`, index.html:137, law QBI).
- Permanent: it can't burn and everyone walks it.

**Cost and time**
- Fill a tile needs: 1.25 x 1.25 m x (1.0 - 0.125) m = about 1.4 m³ in a river (D29, 1 m deep), and about 2.1 m³ in a lake's middle (D27, 1.5 m).
- ILO labour rates: loading 8.5 m³, wheelbarrow haul up to 20 m 8.5 m³, spreading 13.5 m³ per worker-day ([ILO task rates](https://webapps.ilo.org/public/spanish/employment/recon/eiip/download/tasas.pdf)). That's 0.31 worker-days per m³, so 3.4-5.4 worker-hours a tile.
- Time: **3 s a piece** (1-3 s on the yardstick).
- Cost: **10 stone a piece** (tuning: twice a wall piece, because it's a solid bed of 1.4-2.1 m³).

**Computer sides:** the same test and list as A, but it builds fords. Fords can't be removed, so they help the enemy too.

**How it fits the code**
- It changes the map while the game runs. `H`, `CH` (corner heights), `DEP` (ice edge), fish spots (`byWater`) and the drawn ground (`renderGround`, index.html:298, which today runs only at start and load) all read the heights.
- Save: the map is regrown from the seed on load, so fords need a new save list that is re-applied before `renderGround()` in `load()`.

**Risk: medium to high**
- A full ground redraw on a phone mid-game (cost unmeasured).
- A new save field that has to round-trip.
- Many systems read `H`.

---

## Option C: Roads that speed walking
**What you do:** same taps (Build, Road, tap start, tap corners, Build).

**Cost and time**
- A road tile with a 0.15 m gravel layer is 0.23 m³. With ILO digging (3.5 m³ a day), the rates above, and hand compaction (9 m³ a day), that's about 1.3 worker-hours a tile.
- Time: **1 s a piece**. Cost: **1 stone a piece** (tuning).
- Wade's roads: £90 a mile, 100-man parties ([Wikipedia](https://en.wikipedia.org/wiki/Military_roads_of_Scotland)).

**Speed: the honest catch**
- Soule & Goldman (already in books, N401): blacktop 1.0, dirt road 1.1, light brush 1.2, heavy brush 1.5, swampy bog 1.8.
- In the game, dry open ground already counts as 1.0 (`pace()`, index.html:1059). So a road is only faster in mud, snow or woods. On a dry day it adds nothing.
- `searchPath` must also make road steps cheaper, or units won't use the roads.

**Computer sides:** they would need a new plan for where roads pay. That is new AI work.

**Risk: low code risk, but it misses the goal.** It doesn't cross water, so it does nothing about the 421-tile detours.

---

## My call
1. **The "find the route" part is probably fixed already** (fact 3). Test it on seed 3382234986, from town 0 to town 1, before building anything.
2. **Then A, Bridge.** It's the only option that:
   - reuses a tool you already know (the wall tap tool),
   - leaves the map heights alone,
   - adds play (burnable),
   - needs no new save field.
3. **B** is the fallback if you want crossings that can't be destroyed. It costs the most code risk.
4. **Skip C.** It doesn't shorten the detours, and on dry ground it's no faster.
