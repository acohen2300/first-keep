# First Keep: cut, merged or held (Build 13 rebuild, kept up to date to Build 18)

Nothing disappears unless it is listed here. Old game kept as reference: `first-keep-b12.html`.

## Cut on Albert's instruction
- **Fog of war.** Everyone sees the whole map. Night still shortens how far units look for targets. Enemy spies stay hidden unless near your units or towers.
- **Heroes.** Never built.
- **Cell-grid placement.** Replaced by free placement that snaps beside your buildings, with a lifted ghost and a Build button.

## Cut or merged by the rebuild (simplest design)
- **Flat top-down view.** One tilted view only; one drawing routine per thing (was two).
- **Rider and Knight as separate units.** Now upgrade lines: Chariot → Horseman (Cavalry); Cataphract → Knight (Knighthood).
- **Counterweight tech.** Replaced by the Trebuchet, its own unit in the Medieval age (history audit).
- **Pikes tech.** Split into Phalanx (Classical) and Pike square (Medieval), upgrading the spearman in place.
- **Forestry tech.** Renamed Coppicing (the real early practice).
- **Fletching tech.** Replaced by Composite bow (range from the bow, not the feathers).
- **University as a separate building.** Now the Library, renamed University in the Medieval age.
- **Priests healing.** Healing moved to the Medic and the Hospital; priests call Zeal and take shrines.
- **"Iron" age.** Ages are now Settlement, Bronze, Classical, Medieval; Iron weapons is a tech.
- **Dead code** listed in the inventory (unused functions, dock branches, unused styles): not carried over.

## Changed in Build 14
- **Tree farm no longer endless.** A plot holds 500 wood, then it is cut out and you plant another. Farms (food) stay endless. Decided by Albert (option C).
- **Straight-line fallback for units out of path budget.** Replaced by waiting a tick for a route.
- **Path search cap** cut from 12,000 to 4,000 squares; goals cut off by solid ground are found without searching.

## Build 15 (reviews 3 and 4)
- **Hills** (high ground): dropped on Albert's say-so. Not built.
- **Shield wall formation lines** (units locking into a rank facing the foe): not built. The stance has the armour and speed effect only.
- **Formation line by long-press and drag**: not built. Orders mode sends a battalion to a spot; the units fan out round it as before.
- **Fortress escort-the-caravan job**: not built (needs a new walking-unit behaviour). The "clear a guarded find" job is in.
- **Scars and worn paths** are drawn on a layer, not on the ground picture, so a new game clears them. Not saved with the game.
- **Straight tracer lines** replaced by arcing missiles.

## Build 16 (towers)
- **Tower damage** 7 → 10 base. **Garrison:** up to 5 villagers shelter in a tower and each adds an arrow (before, only the Keep took people in). **Horn** when foes first enter a tower's range. **Machicolations** (Medieval, Smithy): towers hit 5 harder.
- **Soldier garrison** (soldiers entering a tower by order): not built; villagers only.

## Build 17 (cleaner cards)
- **Explanations folded.** Menus, building, unit, army, find, node and setup cards show actions and numbers first; the descriptions and Why lines sit behind a small "+" line, closed by default and kept open if you open one. Nothing was deleted: the full text is in the folds and in the Guide.
- **Take down** moved to the bottom of a building card. **Army card** hides orders, stance and hold until you have soldiers.

## Held for later
- **Gunpowder** and a fifth age.
- **Ships and naval units.**
- **Iron as a fifth resource.**
- **Music** (sound effects and ambience are in).
- **Palisade, moat, boiling oil.**
- **Defend stance** (Hold ground is in), **per-battalion rally point**, **tutorial**.
- **Courthouse treaty tie-in** and **spoiling stockpiles**.
- **Computers using take-down and repair.**

- **Cut by Albert (trade economy):** shipping on water and pirates on water (lake ships). Trade stays on land; the threat is people looting caravans.

- **Replays (parked by Albert, Oct 27):** record your orders by tick and replay the match. When it comes back: a scrubber and high speed; replay only what you see (your kingdom) at first, others later. Needs the computers' choices checked for determinism.
- **Declined by Albert:** drawn formations (drag a line for units to fill) and a map and scenario editor.

## Known limits in tests (not cut, still open)
- Computers rarely build a Wonder or train elephants, horse archers or trebuchets.
- Computers lean on javelineers when their enemies field archers.
- All balance numbers are first guesses; tested only in a desktop browser, not on an iPhone.

## Build 18 (Albert's list 1-7, plus the animal and fear fixes)
- **Drawn roads.** Removed (they did nothing). The Roads tech stays; it still halves mud. Robbers' camps and wayfarers now sit at the map *edges* in the text. Worn paths still appear where villagers walk.
- **One lake.** Replaced by five: a bigger great lake in the middle (radius 170, was 140) and one lake per corner (radius 85-120, same in every corner, mirrored). Shrines still stand at the great lake.
- **Fixed resource spots.** Replaced by a random layout each game: one corner is laid out at random and copied to the other three, so it is fair but never the same. Covers berries, groves, stone, gold, deer, boar and the six finds.
- **Fishing without a dock.** Gone. Fish are caught only within 150 of a finished Dock (100 wood, on a shore). Lighthouse still adds 30%. *Computers do not build docks, so they do not fish (open).*
- **More food at the start.** Two berry patches and two deer herds near each keep (was one and one), plus the far berries.
- **Deer running from hunters.** Deer now ignore villagers until hit (soldiers still scare them); a hit deer limps at 45% speed for 6 seconds. Hunters' javelins hit 5x (was 3x). Fixes the toward/away loop.
- **Tap game to hunt.** Deer and boar cards get *Send a hunter*.
- **Whole group fleeing from one foe.** An enemy soldier still scares villagers near it. A lone beast or robber scares only the villager it hits; three or more scare everyone nearby.
- **Work beside guarded finds.** Villagers no longer gather or hunt within 120 of a find that still has live guards.
- **Random scatter at home.** Soldiers waiting at home or sent to the same spot now stand in a grid (battalions side by side, rows toward home).
- **Work looks like walking.** Villagers now have their own pose for chopping, foraging, mining, farming, fishing and mending.

## Build 19 (builders, and the review's real findings)
- **Builders:** a building is a site at 0% and rises only while villagers work it. Placing it sends the nearest free villager; "Send a villager" on the site adds the next; tap a villager and pick a site under "Build" to choose who. Two builders ≈ 1.6× (crew^0.7). A line of wall gets two builders who work down it. The builder returns to his old job. A dead builder leaves the site waiting. Computers send builders the same way. Keep and starting buildings exempt. Replaces the build-radius idea.
- **Cut/changed:** buildings no longer build themselves (old rule removed). Early buildings do not build faster: one builder takes the listed time plus the walk.
- **Drop-off scoring:** villagers pick a tree, rock or bush by the walk to it (40%) plus the walk home with the load (60%).
- **Formations:** the grid now faces the way it looks (out from the keep at home, along the march when sent). Marching groups, and attacks until a foe is in sight, move at their slowest unit's pace.
- **Threat radar:** a red marker on the screen edge, with a count, pointing at enemy soldiers within 520 of your Keep that are off screen. Tap to look.
- **Ghost panning:** with a building in hand, a drag that starts away from it looks around; a tap there moves it; dragging it near a screen edge scrolls the map.
- **Fixes:** repair now checks the whole bill before paying; kiting archers no longer step into water or off the map; dead code removed.
- **Checked and not changed (review claims that did not hold):** crowd push through 1-tile walls (90 units pressed on an unbreakable wall for 40 s: 0 crossed), pathfinding "freeze" (4 paths a tick is enough), battalion slots for support units (by design), blood-stain squash (correct perspective), hills (Albert said no).
- **Still open:** scout aura (needs a yes: breaks "No fog"), siege splash and delayed shots, compact battle HUD.

## Build 19, second pass (from the new audit)
- **Builders are never taken off a site** by another order (a villager building is skipped; with all hands busy the order waits). Before: 4 houses with 3 villagers left house 3 at 0% forever.
- **Orphaned sites:** computers check every 90 ticks and send the nearest free villager to any site with nobody on it (a killed builder used to freeze a computer's housing). You get a tip: "A building site has nobody working it". A builder who finishes chains to the nearest unstaffed site within 220.
- **March pace:** siege no longer sets the pace for others (it trails at its own speed). Computer attack groups split by target, so raiders sent at a camp keep their speed.
- **Orders:** spies get no battalion and are never in army orders; a priest holding a shrine is not pulled off it.
- **Formations:** at home the first rank stands furthest out; units standing at their place face the formation direction.
- **Checked, not changed:** wall push-through (not reproduced again).

## Build 27 (economy as strategy: chores cut; Quick send; the War Council; cards that fit)
**Cut (Albert's list, 1–8):**
- **Wheat/barley toggle on each field.** Barley is gone as a good; the Brewery brews from food (3 food make 1 beer). Fields grow wheat only.
- **Ale going stale** each season.
- **Quarantine and inspection** (the Business Center's trade switch). Plague still comes along the routes in some springs; a Hospital and medics cure it.
- **The Exchange**, merged into the Market: prices float from the first minute for everyone; the Market sells goods (10 at a time) and buys spice; from the Medieval age it takes ventures. The Market card has two pages: Trade, and Caravans and ventures.
- **The Lighthouse.** Its +30% fish is now **Fishing nets**, researched at the Dock (Bronze age).
- **Health % (crowding, dirty water, an army camped at home).** Sickness now breaks out now and then, a little more in summer and winter; Clean water (at an Aqueduct) halves it; the Aqueduct is otherwise housing.
- **Army supply:** the Courier station, supply radius and rations (bread, beer, spice +5% each). Everyone still eats from your stores, wherever they are.

**Changed:**
- **Fire:** the neighbours working right beside it (at most two) run with buckets on their own. The warning has **send help** (two more). A big fire (it spread, or the building is below half) can overcome one of its fighters with smoke, about one big fire in three, never more than one.
- **Quick send:** tap bare ground: each type of soldier you have with − and + (all, until you change it), then Send; the nearest of each type go. Tap an enemy building or soldier: the same, then Attack, with the odds. It remembers your numbers.
- **War Council** (Classical, Military menu): research **Command** for six battalions, **Alpha to Zeta**; set what each holds by type; new soldiers fill them, the rest are the reserve. Then **Formations**: Line (as now), Column (15% faster, 10% more damage taken), Wedge (riders hit 15% harder, take 10% more), Square (30% less from riders, 20% slower). Marching, a battalion takes its shape. Quick send can send a battalion by name.
- **Cut with it:** the battalion buttons on the map (they could not be closed) and Orders mode. Before Command there are no battalions at all.
- **Home button** under the zoom buttons: back to your Town Center at the same zoom.
- **Cards fit:** a card may now use the whole map area; a finished building's description sits behind "What it does"; done research shows as small green-ringed chips; the Town card folds your people and the research tree; game settings fold on the new-game card. At 390 × 844 and up every card but Help fits without scrolling (the gate checks it). At 375 × 667 (iPhone SE) nine still scroll: Market, Stable, Town Center, setup, Range, Barracks, a vassal, Smith, Army.
- **Audio limiter** on the master volume: a battle's many hits do not clip.
- **Attack-move: already there.** Soldiers sent to a spot fight whatever comes within sight on the way, then carry on; nothing to add.

**Found while testing:**
- **The disappearing town (your report).** The map left out anything whose centre was more than 80 px off the screen edge, but since Build 25 the turned view makes buildings wider than that: zoomed in, the Town Center's east side and the tops of tall buildings vanished at the edge, then popped back. The margin is now measured in world units, wide enough for the widest and tallest building. Found by the optimization audit.
- Saves from Build 26 do not open (the save's shape changed: version 27). They are kept aside.

## Build 26 (win choices, villager card, research you can see, buildings that grow)
- **Win screen:** three buttons. **Add another conquest** (new map, same size; you keep your civilization, age and research; fresh rivals), **Continue as free play** (no clock, no victory; only your own fall ends it; saved), **New game**. A defeat shows only New game. **Play again** was broken before: it opened the setup card on top of the end screen. Now it hides the end screen, and backing out of New game brings it back. At 5 and 1 minutes to the bell, a warning says whoever leads on score wins (the 30-minute game ended on time for you without warning).
- **Red edge glow:** when something of yours is hit by an enemy or the wild, a red glow round the screen edge fades over 1.6 s.
- **Tips:** a tip shows for 6 s, then at most one more every 45 s, none in the first 20 s. Warnings (hunger, unrest, plague, fire) stay until fixed.
- **Fields show their workers:** three dots under a field (tree farm too): filled where someone works, hollow where there is room.
- **Resource meter:** tapping berries, stone, gold, iron or a tree shows a bar of what is left against what it started with.
- **Counts:** the Villagers button shows how many you have and the Army button how many soldiers of 90; the top line says homes 6/10 (house room), not "people".
- **Villager card:** tap a villager: six work buttons (tap the current one to rest) and a two-tap Dismiss.
- **Research:** done techs stay in the building's row with a green ring and tick (they used to move to a text line). A green arrow dot floats above a building when you can afford something to research there. The Town card lists the whole tree by age: done, under way, ready.
- **Buildings grow with research:** a building with research gets a stone footing once some is done, and at half or more, corner stones and a gilded ridge (`UP`, 09-buildings.js). Buildings with no research (houses, walls) do not change.
- **Not done:** the Train and Research tabs I first proposed: you already tap the building, and a second way in would be a second thing to learn. **Theatrics** is parked until you pick from a list.
- **Found while testing:** a missing closing quote in one line broke the whole page; the gate caught it on the first run.

## Build 25 (what the best mobile strategy games do: readable, touchable, honest odds)
- **Turned view:** each building now shows its front, its shaded east wall and its roof (`SIDE` = 0.4 of its depth), with the far roof slope where it shows over the ridge, gable ends on the east wall, and both slopes of a pediment roof (temple, library, courthouse). Only the drawing changed: the map, taps, paths and footprints are as before. Walls and gates stay square to the view: they join into lines, and turned pieces would give a line a sawtooth top.
- **Tap targets of 44 points (Apple's rule):** the top-bar buttons, zoom, battalion pills, menus, card close, tip close, Why/About folds and the Build/Cancel bar. The **?** left the top bar so the five numbers still fit at 375; it is now **How to play** in the Town card. The battalion pills sit beside the zoom column. **Kept by choice:** the job row's − and + (12 of them cannot reach 44 at 375 px); the gate skips them.
- **Buildings you can tell apart:** the gate renders every building at half zoom and fails if two share both colour and size. Changed to pass: Barracks roof red-brown, Siege workshop roof tarred black, Archery range roof turf, School roof slate, Bakery limewashed, Pasture grass lighter. At full zoom-out a building is a few pixels: no shape survives that; owner colour and the minimap carry it.
- **See the threat coming:** the red edge marker now also shows for any army marching on you, however far, not only within 520 of your Town Center. Tap it to look.
- **Odds:** Attack and Attack nearest say strong, even or weak: the same square-law odds the computers use (your battalion against their army, towers and Town Center, bent by who counters whom). No new math.
- **First game is 30 minutes:** the setting starts at 30 minutes; Conquest is one tap away and is remembered once chosen.
- **Found while testing:** a new helper named `nearestFoe` silently replaced the towers' own (same name) and broke them. Renamed to `foeNearest`. The build joins files without catching two functions of one name.

## Build 24 (iron, a richer runway, builders who stay, hints that retire)
- **Iron, the fifth resource:** gathered like stone and gold (0.5 a second), dropped at the Mine, in the top bar and the job row, sold and bought at the Market (base 120), floats with the Exchange. From the Classical age it pays for Iron weapons (200f 100i), Chain mail (200f 150i), Plate armour (300f 200i), Men-at-arms (200f 150i), Knighthood (250f 100g 100i) and the Cataphract (90f 45g 45i). Computers gather it from Classical.
- **Runway:** along each corner's three paths, beside the road: a berry patch and stone toward one neighbour, gold and iron toward the other, berries and iron toward the lake; never in a lake. The middle's four gold and stone spots each gain an iron vein. More of what was there: home berry patches 8 bushes (from 6), home stone and gold 350 each (from 250). Tested on 20 seeds: every Town Center, find, deposit and bush reachable.
- **Builders stay:** fields and tree farms take up to 3 workers (from 1), and whoever built one starts on it. Pasture, Weaver and Brewery take 1. A Dock's builders fish; a Mill's, Lumber camp's or Mine's builders start on the nearest food, wood, stone, gold or iron. Others go back to their old job.
- **Hints retire:** each teaching hint stops after you have done what it teaches 3 times (kept on this phone, across games). Warnings always show: hunger, fire, plague, a restless vassal.
- **Computers, found while testing iron:** they built no Mill and almost no farms while berries lasted, so they starved each winter and never reached Classical. Now: a Mill by the berries, fields when berries run short or food workers outnumber bushes, and a food store of 4 minutes' eating in autumn and winter (2 the rest of the year). Rivals reach Classical at about 18–20 minutes and gather iron.
- **Top bar at 375 and 430:** five numbers now fit (12–13 px; the gate checks that the last one is not cut off).
- **Stress test:** 7.1–7.3 ms a tick.

## Build 23 (the forest)
- **Dense forest:** about 1,600 trees, laid out for one corner and mirrored. Trees sit on a 26-unit lattice where an organic field runs high, thicker away from home. Clear: 360 round each Town Center, lakes, finds, stops, camps, the central gold and stone, the trade lanes, and three winding paths per corner (to each neighbour's nearest stop and to the great lake). Anything left walled in is joined to home by a straight cut. Tested on 10 seeds: every Town Center, find, stone and gold reachable.
- **Trees block:** each fills the 3×3 squares round it. A tree can be cut only from open ground beside it, so forest is worked from its edge inward; a felled tree opens its ground. Forest trees hold 150 wood (grove trees near home 300).
- **Select (⬚):** drag a box. Over trees: send 1, 3 or 5 villagers; they cut inward (from the nearest open tree if the box is closed), then go back to their job. Over villagers: put them all on one job, or send them to build. Soldiers stay on battalions. Tested: 3 villagers cleared a closed box of 3 trees in about 11 minutes of game time.
- **Crowding fix found by the forest:** workers now spread across bushes and trees (+25 to a find's score for each villager already on it). Before, 15 Rivals queued at one berry bush and never aged.
- **Cut:** the four edge forests (the dense forest replaces them; the robbers' camps stay).
- **Drawing:** zoomed out, the forest is one picture (also the small map); close in, trees are drawn 40% larger to show the ground they block.
- **Cost:** stress test 8.3–8.5 ms a tick (B22 7.6–9). Caravan trips take longer by road.
- **Parked:** biomes (forest, desert, arctic maps).

## Build 22 (from SoRen: lean, phone-ready)
- **One frame loop:** when paused, over or hidden, with no touch for a second, it draws 15 frames a second instead of 60 (measured: 15 vs 56).
- **Load shedding:** over 12 ms of work a frame for two seconds: the moving extras go (as Reduce Motion); again: half the pixels.
- **Safety net:** one error costs a frame and is logged once; a second kind saves the game, pauses it and offers Restart. Failed promises count.
- **Silent switch:** `audioSession = 'ambient'`: the iPhone's mute switch silences the game.
- **Haptics:** one table (tick, snap, thock, crack), at most one every 50 ms, tied to the sounds (place, done, ready, horn, crash, thunder). Native app: the taptic engine; Android browser: vibrate; iPhone Safari: none. Vibration on/off in Help.
- **Weather:** rain (streaks, splashes when close), snow in frost, lightning in summer storms: a flash, a bolt from the top of the screen, a scorch, and thunder after it at the speed of sound (farther = later and quieter). About one ground strike every 20 s in a storm; buildings as before.
- **Native copy:** `wrap.py` writes `native/index.html` (viewport-fit, safe areas, a lock-down Content-Security-Policy). The policy is only in the native copy: the web page's host adds its own. `APP-PREP.md`: the path to the App Store.
- **Gate:** `tests/gate.py` at 375×667, 390×844, 393×852 and 430×932, web and native: no errors, nothing wider or taller than the screen, no clipped button text, text ≥ 12 px, contrast ≥ 4.5:1. It found: the score's rank at 11 px (now 12), disabled buttons and the guide's small print at 2.6–3.7:1 (the dim grey is lighter: 4.9:1). All pass.
- **Parked:** a screen-reader layer (SoRen has one); clouds, sky and other weather (not seen from above).

## Build 21 (food, markets, vassals, Town Center and Castle)
- **Names:** the first building is the **Town Center** (a timber hall with a bell tower). **Castle** is now its own building (Medieval, 900 stone 300 wood, shoots 170, shelters 10, supplies soldiers). A **second Town Center** (Classical, 400w 300s 200f) trains villagers, takes every drop-off, shelters and supplies; losing it does not lose the game. The Fortress stays the Fortress; a tower is a tower.
- **Cut:** the Castle *research* (it turned your Keep into a castle) is gone: replaced by the Castle building. The computers' research lists drop it; the Fortress builds a Castle in the Medieval age.
- **Food upkeep:** every second, food is eaten: villager 1 share, foot soldier 1.5, rider or elephant 3, cart 2; a share = 30/8 food a minute (one food villager feeds about 8). No food: work and damage ×0.75, no training, nobody starves. Computers add food workers to cover what they eat.
- **Trade gate:** open → inspect (carts wait 30 s at the gate, plague risk ×0.2) → quarantine (a season, nothing leaves).
- **Exchange (Classical):** when the first one stands anywhere, prices float: each unit sold lowers its price 0.4%, each bought raises it, within ×0.5 to ×2.5, drifting back 10% of the gap every 10 s. Spice drifts to ×1.4 in plague years and ×1.2 when someone holds a whole route. Sell 10 goods here at the going price; buy spice here at 1.5× the stop price. Market prices for food, wood and stone float too.
- **Ventures (Medieval, at the Exchange):** 100, 250 or 500 gold, up to 3 out; a year later 1.4× back, or lost (1 in 5).
- **Vassals (the math):** demand surrender when 8+ of your soldiers stand within 300 of their Town Center and their army's power is under 40% of those soldiers'. Or, as the Fortress's ally with twice its army, offer to be its overlord (light tax, loyalty 50). Every 10 s:
  - tax = rate × what they gathered (light 10%, fair 20%, heavy 35%), taken from their stores in proportion;
  - loyalty moves 5% toward 20 + investment + garrison + protection − resentment; investment = your finished buildings within 450 of their Town Center (castle 20, town 15, exchange 10, tower/market/post/Business Center 6, courier 4, field/pasture 2, house 1, others 3); garrison = 0.5 per soldier of yours there, up to 15; protection = +1 per enemy soldier you kill there, up to 20, fading 2% each 10 s; resentment = 0 / 10 / 30 by tax;
  - unrest += tax push (0.3 / 1.5 / 4) − loyalty/25, held 0–100;
  - loyalty ≥ 60: every minute a gift of (loyalty − 50)% × 10% of their stores; loyalty ≥ 50: you get 25% of their trade profit (caravans, posts, ventures).
- **Rebellion:** unrest 100: a third of their villagers become rebels; their army turns on you. Their force falls below a quarter: crushed (rebels gone, unrest 30, loyalty −10). They hold out 4 minutes: free.
- **Coalition:** with 2+ vassals, every minute risk = Σ(unrest/100)² × 0.08 × number of vassals; warned above 0.1; all with unrest ≥ 50 rise together, allied.
- **Conquest:** also won by ruling both the Raiders and the Rivals as calm vassals (not in revolt) for 5 minutes.
- **Limits:** only you can take vassals (the computers do not vassalise each other or you). Tested in headless Chromium, not on an iPhone.

## Build 20 (trade, nature, health, supply: one build)
- **Gold:** Market costs 150w 50s (no gold), Settlement age. Caravans cost 80w 40f (no gold). Tip when gold is low.
- **Goods:** wool, barley (raw); cloth, beer, spice. Pasture (sheep, shorn each spring, lambs in spring, wolves take sheep) → Weaver (2 wool = 1 cloth). Fields grow wheat or barley (card button) → Brewery (2 barley = 1 beer; half the ale goes stale each season). Spice is not grown: bought at trade stops for 5g. Business Center stores goods and loads caravans.
- **Wants:** each side wants two goods (×1.5), mirrored. Price = base × wanted × distance (×1 next door up to ×2.5).
- **Logistics:** a caravan given a route (its card) loads at the Business Center, sells at a Market or Keep of anyone at peace, or at a trade stop, buys spice at stops, repeats. Without a route it does the old Market-to-Market gold runs. Ox cart speed 16 (0.65× walking).
- **Trade routes:** two fixed routes (west–east, north–south) with 4 stops each, guarded by 3 bandits. Clear them, build a Trade post (100w 30s, Bronze, needs a builder): the stop is yours. 6 gold a minute per stop, +25% per extra stop on the same route, ×2 for the whole route; 20% of other sides' sales there; you set what it wants. Stops sell spice and do not buy it.
- **Robbers:** robbers near camps attack unguarded caravans; the load goes into the camp's hoard and comes back to whoever breaks the camp. Safe within 120 of your post or tower, or with a soldier near.
- **Safe roads:** workers and carts route around guarded ground (soft cost), unless already in it or going into it.
- **Speeds (real ratios):** foot and villagers 24; loaded villagers −10%; horses 36 (1.5×); Mongol horse archer 40; Mali horseman 38; elephant 22; siege 12 (0.5×); caravan 16.
- **Nature:** weather each minute (rain −20% march, −15% bow range, fewer fires; drought −30% crops, more fires; frost: stone building at half speed). Soil 10%/year worked, floor 60%, a season of rest restores. Harvest each spring: 1 in 6 poor (−30%), 1 in 20 failed (−50%). *I could not verify these odds against the English records: the paper's abstract has no figures. They are estimates, softened so a bad year costs but does not ruin.*
- **Fire:** wooden buildings (not fields) catch from sabotage, summer lightning, sparks at a bakery or smithy; 2%/s damage; two villagers run with buckets and go back to work after; spreads to wooden neighbours.
- **Health:** risk from crowding (people near the housing limit, 40+) and a big army at home (20+); summer and winter ×1.2; aqueduct ×0.7 (none with 40+ people ×1.3); Clean water ×0.5 (new research, Aqueduct). Sick: half work, −40% damage, −20% speed, 60 s; a few die; Hospital or medics cure. Medical school (new, University) halves deaths, doubles cures. Plague in some springs travels with caravans; capped at 10% of your people; Quarantine (Business Center) stops trade for a season; Stone granary (new, Mill) halves plague.
- **Supply:** soldiers within 300 of the Keep or a Courier station (new, 60w 20s) get rations: bread (a Bakery), beer, spice: +5% damage each; they use beer and spice. Away from supply: fed, no bonus.
- **Computers:** build posts on free stops near them, clear stop guards; Rivals build a Market, Business Center, Pasture and Weaver and run caravans; Raiders seldom get to trade (they spend on war); quarantine in plague years.
- **Known:** an idle player now falls about two minutes sooner (armies arrive together at one pace). Stress test 8.6–9.7 ms/tick at 720 units (B19 6–7). Not tried on an iPhone.

## Design rule (Albert): pay to help, never pay to win
- Purchases change only variety (civilisations, maps, scenarios: all balanced), looks, and convenience without power (hints, replays). Never resources, speed, or unit strength. A free player with better play must always beat a paid one. Single-player helps never count in multiplayer. Prefer a paid app or one unlock plus expansions; no repeat boosts.

## Still waiting for Albert's yes (Build 20: forest)
- Dense forest of cuttable trees with winding paths, box-select trees, landscape layout.

## Build 24b (save versions)
- The save carries its own version (`SAVEV`), no longer the build number, so an ordinary build keeps your game. Raise it only when the saved shape changes, with a step in `MIGRATE` for the old one.
- A save that cannot be opened is kept aside (`firstkeep.save.old`), and the new-game card says so. Nothing is silently dropped.

## Build 26b
- **Edge glow colour:** red when a rival side hits you, orange when bandits or animals do.
- **Building keeps your zoom:** starting a build used to zoom you in to 1.3 if you were further out. It no longer does; the ghost snaps by a tolerance that grows as you zoom out.
- **Checked and ruled out for the "part of the town disappears" report:** sprite memory (all 20 building kinds at every zoom, at 3× pixels, with all research done: about 14 million pixels, 54 MB, well under what iPhones allow). A save and resume. Every building with every research tier. A long fast game with research finishing. None dropped anything or logged an error. Still open; needs a screenshot or what you did just before.

## Build 28
- **The lost Town Center (found):** a villager carrying cloth, wool or beer made the drawing throw (the carry-colour lookup knew only the five raw resources). The picture is drawn back to front, so everything below that villager, Town Center and houses too, was missing until it put its load down. Fixed, and each drawn piece is now guarded so one bad piece can never take the rest of the frame.
- **Gunpowder, the fifth age** (1600 food, 900 gold, 300 stone, 400 iron; 100 s): Arquebusier (Range; strong against knights and riders, slow reload), Bombard (Siege Workshop; 100 damage, buildings only), Musket (Musketeer) and Star fort (walls +50%, towers, castles and Town Centers +30%) research; Town Center gains a stone bastion with a gun. The Balanced computer now goes up to this age. Cut by choice: no separate powder resource; iron and gold are the cost.
- **Armour shows:** each of Leather, Chain and Plate adds a visible layer to every soldier (shoulder guard, mail and helm, plate with plume and cape). Unit sprites are cached per level.
- **Theatrics:** one pop curve for buildings and new soldiers; finished buildings glow for 8 s and cool; an upgrade rolls a gold flash through that kind of unit; a new age, a wonder or a victory flashes the screen white and spreads its chord across the ears. Never two celebrations within 0.34 s; the "unit ready" chime is at most one every 0.34 s.
- **Speed and safety:** vignette moved to a CSS layer; far out, people are dots; the map corner redraws seven times a second; the screen is only resized when its size really changes; evicted sprite canvases are freed at once; softer limiter (-3 dB, 4:1, 5 ms attack, 250 ms release). Removed dead code `crnd`, `lakeAt`, `lookOf`.
- **Controls:** How to play is a "?" button at the top of the map buttons; zoom +/- removed (pinch); the green research dot sits right above its building.
- **Checked and not changed (from the outside review):** soldiers sent at a moving foe do chase it (the spot is only a fallback while the foe lives); a battalion only refills from the reserve, never from another battalion; 60 soldiers in Line, Column, Wedge or Square crossed the forest to a rival with none stuck. Not done: villager threat scan (about 12,000 comparisons a second, negligible); minimap forest picture (already redrawn once a second at most).

## Build 29 (a bigger map)
- **Top bar, one line:** food, wood, stone, gold, iron, homes (people / cap, as a resource), one-line score (★ and number; rank is in the score card), one pace button (×1 → ×2 → ×3 → paused), "?" far right. On 375 px phones the homes icon is hidden to fit; side margins are 8 px at 400 px and under.
- **Status line removed.** The age is on the Town button. Season and weather icon, clock and zoom % sit bottom-left of the map beside the Home button. Cut: whole-map button (pinch does it), zoom ± (earlier), the separate pause button, the Town-card How-to-play button.
- **Buildings can sit side by side** (flush gap preferred), except in the lane around trainers.
- **Messages:** every toast and tip is 10 words or fewer, one of each at a time, two lines at most. "Messages" on/off beside "Tips"; warnings stay on. The gate fails on a longer one (`tests/words.py`).
- **Home pocket:** berries, grove, stone, gold and iron behind the Town Center, away from the raid side.
- **Gate rules kept:** taps stay 44 px, type 12 px or more. Old saves load as Messages on.

## Build 30 (sound, population, guide)
- **Sound wakes up again:** iPhone leaves the audio "interrupted" after a call, a lock or another app; the game only woke it from "suspended", so it stayed silent until a reload. It now wakes on the next tap whatever the state. Audio starts on the finger lifting (Safari's rule), not landing. Still follows the silent switch; "silent switch mutes" sits under Louder.
- **Cut: people / homes from the top bar.** Villagers now read like Army: "12 of 60", "40 of 90". When homes are full both say "full" (at 150 people, "max 150"). Cut with it: the villager cost on the button (it is on the Town Center card and in the guide) and the "room!" note.
- **Guide:** regenerated for Build 30, with new rows for the screen and for messages and sound; building row says side by side, with a lane only around trainers.

## Build 31 (preview: send strip, silence, sound page, two-sided cards, War Council ladder)
- **Counts show the real ceiling:** Villagers "3/22", Army "12/31": what you have over what your homes allow now, up to 60 and 90. "full" is gone (22/22 says it).
- **Cut: the big send card on open ground.** Tapping open ground now shows a small strip at the finger: Send ¼ (a quarter of each type, nearest first), All, each battalion by name, ⋯ and ✕. The per-type pickers stay on enemy and find cards ("Attack with"). The rally point, scout and spy moved behind ⋯ (the old ground card, without the send part).
- **Silence:** every message and tip has 🔕. It mutes that kind (numbers ignored) until "Unmute all messages" in How to play; a warning comes back after 2 minutes. Merged: the tip's × (hid one tip for the game) is now the same 🔕. Changed from the plan: silence lasts across games, not one game, because a setting is simpler than a new save field and is what a mute usually means. Albert to confirm.
- **Sound page:** Sound and Vibration on/off, then volumes for All, Effects, Ambience (birds, wind, crickets, thunder) and Alerts (horn, ready, done, a new age, win). Mute button in the top bar. Cut from How to play: the Sound, Vibration, Quieter and Louder rows (one Sound button opens the page).
- **? , pause and mute** drawn at 32 px; their 44 px tap areas touch each other.
- **Building cards, one mold:** a building that trains and researches shows two tabs, Train and Research. The Town Center: Train (villager, scout), Research (the next age). Everything else (about these soldiers, about this research, what it does, why, and on the Town Center: dismiss villager, your people, food, goods, the research tree) sits under one closed More. The Town Center card went from 452 px to 222 px tall. Cut: the separate folds "About these soldiers", "About this research", "What it does", "Your people and goods", "Research: n of 40 done" (all inside More now). The Market's Trade / Caravans tabs use the same mold.
- **Lost taps (found):** a card with live numbers was rebuilt about once a second; a tap that straddled a rebuild landed on a button that no longer existed. Now a card is not rebuilt while a finger is on it or for 0.4 s after. Honest note: this is a guard on the rebuild, not a cure; the cure is a card that patches only the numbers that changed (SoRen's card engine). Offered for Build 32.
- **War Council ladder:** Engagement (stances; they were free before), Battalions (was Command, same id so old games load), Formations, Muster (Gunpowder age: a battalion's missing soldiers in one order at 2x cost and 1.25x time, the time shared by the buildings that train each kind; needs room and the army limit like any training). The computers now build a War Council and research Engagement (the Balanced one also Muster); before, their stances were free. Old saves (version 27) get Engagement if they had Command; save version 28.

## Build 32 (preview: foundation, trade in two lanes)
- **Trade in two lanes.** Lane one: a caravan with a route takes goods from the Business Center to a trade stop (the world's old markets) and sells them. Lane two: a caravan with no route runs from your Market to an ally's Market or Town Center and back, paid by distance (distance² ÷ 16000, at most 80 gold) on arrival.
  - Cut: caravans between two of your own Markets, and the dashed lines between your Markets on the map. Their pay rule moved to lane two.
  - Cut: selling goods by caravan at any Market (yours or a neighbour's at peace) or at a neighbour's Town Center. Stops for goods, allies for gold runs.
  - Cut: a stop paying its keeper 6 gold a minute, +25% for each more on the route, ×2 for all four. Now: whoever holds all four stops of a route gets 120 gold a minute from it (2 a second; there are two routes).
  - The keeper's cut of other sides' sales at a stop grows with how many of that route's four stops they hold: 20%, 25%, 30%, 40% (was a flat 20%).
  - Guards: up to 12 soldiers escort one caravan (caravan card: Escort +4, Release) or garrison one stop you hold (stop card). Cut: the Army card's "Escort caravans" (whole selection, no cap); the caravan card does it now. Escorts and garrisons are left out of Send ¼ and All.
  - Three trade researches: Armed caravans (Market, Classical: caravans ×2 health and strike back), Fortified posts (Trade post, Medieval: ×1.5 health, +5 arrow damage), Letters of credit (Market, Medieval: trade sales +25%).
  - The computers build one Market (not a second far one) and train caravans once they have an ally or a Business Center.
- **The Market, one rule:** resources by the 100, goods by the 10, one Sell grid and one Buy grid. It pays 80% of worth (Coinage 90%) and charges 125%. Changed: goods sold at the Market now get 80% of their worth like resources (they got 100%), so a trade stop always pays better; spice at the Market costs 25% over a stop (was 50%). Cut: the separate "Sell 10 here" goods grid, `exchange` and `exTrade` (now `marketTrade`).
- **Cards are patched, not rebuilt (the cure for lost taps).** Live numbers update in place; a line that appears above a button moves it down, the same button. Cut: the Build 31 guard that froze a card under a finger. The banner uses the same patch.
- **Text reads its numbers from the rule tables:** Market, trade, seasons, weather, saving, difficulty, winning. New constants: `EASY_SAFE` (6:00), `SAVE_EVERY` (10 s), `REACT` (2 s / 1 s). Merged: the two seasons rows in the Rules into one. How to play cut to one line a topic; every number lives in the Guide and Rules.
- **Speed:** the on-screen trees, bushes and rocks are kept sorted until the view moves 40 units, and the few moving things are merged in; villagers test distance before anything else when picking work. Measured: a frame and a game step each about 5 to 10% faster. Honest note: the sort was not the main cost; drawing the pictures is.
- **Cut, unused:** the zoom +/− action and `ZOOM_STEP`, the test-only `goto` order (t7 uses the send strip now), the `.soon` style. Merged: the two `#endActs` rules, the map button styles (`#tools`, renamed from `#zoom`, and `#corner`), a repeated top-bar rule. `isSoldier` used everywhere (was typed out 15 times).
- **The build refuses bad code:** a syntax error, or one top-level name declared twice across files (how the towers broke in Build 23).
- **Fonts inside the file:** the two typefaces, cut to the letters the game uses (about 110 KB), so nothing loads from the web. The native copy's security rule now allows fonts only from the file. Licences (OFL) in `src/fonts`.

## Build 33
- Cut: the ⬚ select-box button and Select mode (`selmode`, `G.selMode`, `#tools`). Replaced by hold, then drag, on open ground.
- Cut: the map-corner chip (`#corner`). The state chip and Home moved to a second top row; the minimap moved behind a map button, shut by default after the first look.
- Cut: the gold ring on selected buttons. Selected is now a muted fill.
- Cut: the screen-space rain rings drawn over buildings. Rings now sit on the ground, fixed to the world; 110 streaks became 70.
- Cut: the age button inside the Research tab of the Town Center. It now sits at the top of the card, and the bottom Town button is the age button itself.
- Placement rule: one cell gap beside any non-wall, non-crop building, so a building's east wall never sits under its neighbour.
- Not changed: sprite sharpness. Sprites are re-cut per zoom up to 6x; nothing to fix.
- Fix (Build 33): the menu card was taller than the map by its own padding (box-sizing), so its top was clipped on short screens. Now border-box. The map-button highlight no longer fills a 44 px square. New-game peoples are three across, to save a row.
- Cut (Build 33): the one button that cycled ×1, ×2, ×3, pause. Pause is its own button (top row); ×1/×2/×3 is a second button on the state row and never pauses.
- Fix (Build 33): my hold-to-box ring used `G.hold`, which is the Hold-ground array. Renamed to `G.press`.
- Cut (Build 33): the Train | Research tabs on building cards. One page: Train, then Research (layout 2 of the mockups). The next age is the first Research button.
- Cut (Build 33): the Why? and More folds on cards. All explaining text sits behind one book icon left of the ✕.
- Cut (Build 33): the blue health bar on buildings. It appears, in red, only when the building is hurt.
- Cut (Build 33): the gold-ring and heavy spacing in the top rows; every control is 32 px high with 8 px between.

## Build 34 (preview)
- Cut: the second top row. One 32 px bar: resources, ★score and rank on one line, sound, pause, ?.
- Moved: map icon to the top right of the map (opens the minimap, ✕ closes it); home to the bottom left, shown only when the Town Center is out of sight; speed, season, weather, clock and zoom to one pill at the bottom right.
- Cut: the menu row (Home, Military, Defense, Trade, Culture). One Build card with those five as filters.
- Cut: the Army, Town (age) and Fortress buttons. People holds villagers and army; the age is research at the Town Center; the Fortress is its star on the minimap, or its name in the score table.
- Changed: + only places an idle villager; with nobody idle it does nothing and says so. New games start with food as the chosen job.
- Added: idle count on + Villager; Town Centers as stars and castles as diamonds on the minimap; cards open at most 62% of the map (setup, help, guide, score and the Market can use all of it).

## Build 35 (caps, army room, full-screen map)
- Cut: the People tile and the Research tile (bottom row is now + Villager and Build). Their jobs moved to the status pill (bottom right, replaces the clock pill): tap it for the People card, which now opens with a Research button.
- Cut: the solid top bar and bottom rows; the map is full screen and they float on it as indigo pills.
- Cut: the map's × (now a small − on the minimap's corner).
- Cut: separate sound, pause and ? chips (now one pill with dividers); job tiles are one tile each (name, count, − and + with inset dividers).
- Cut: green dot with arrow research marker (now a book badge with a count).
- Not done on purpose: the computers do not research the capacity techs; mercenaries from finds ignore army room (they are hired, not trained); old saves keep buildings above a new limit.
- Camera: the view centres between the top and bottom pills; the camera no longer scrolls past the map's bottom edge.

## Build 35 (later changes, logged late)
- Cut: the "Settlement" age name (now "Stone", shown "Stone age").
- Cut: the separate speed pill; speed sits in the single top bar next to pause.
- Cut: the score tile from the top bar; it moved into the status pill.
- Cut: the line under card titles; Build menu tabs now touch and the chosen tab is filled red.
- Added: ghost buttons so every Build menu is the same height.

## Build 36: the screen layout (built, live)
The bottom of a 390 x 844 phone went from about 290 px (29%) to 91 px (11%); the top from three rows to a 46 px pill and a 28 px strip. One mold (`.cell`), two type sizes, named sizes.
- Cut: the "?" button (How to play is now a button in the People card).
- Cut: the Farm job. Food takes a free field within 160 first, else berries, game or fish; a food worker moves onto a field when one comes free. The old "fields only" control is gone. Save version 28 to 29 turns saved Farm workers (and the Farm rally choice) into Food.
- Cut: the old bottom row (+ Villager | Build): People is now the first column (icon, have/room count; - cancels a villager waiting to train and gives the cost back, + trains one, tap opens the People card). Build is a 44 px corner button bottom right; it swaps the jobs for one row: Home, War, Walls, Trade, Culture, and a close button.
- Cut: the status pill (people, army, research, age, season, clock, zoom %, civ name) and the clock pill. Age, season and clock now sit in a thin strip under the top bar; idle villagers show there in gold only when there are some; score and rank (just "1st") sit at the right of it.
- Cut: the Research tile and the research-ready glow/badge on the status pill. Replaced by: the age text in the strip glows gold when the next age or any research is ready; tapping it opens the Town Center card. Research stays under the People card.
- Cut: Army and marching counts. Training and researching counts (they showed only in the status pill). Training now shows as "have+waiting" in the People tile.
- Cut: zoom % and the civ name from the screen.
- Renamed everywhere (card tabs too): Military to War, Defense to Walls (Walls still holds towers, castles and gates).
- Cut: the job names were replaced by icon, count and a one-word name under it; the indigo glass look gave way to the dark panel look of Build 30.
- Gate: the tap-size exception now covers only the - and + tiles under each job (26 to 29 points wide; the tile above each is 44 high). Everything else is at least 44 x 44.

## Build 37: the rebuild (Oct 27, 2026)
Cut, merged or folded while taking the code apart and putting it back by element. The game plays the same except where noted.
- **79 old test scripts** (`tests/e2e/`). None could run from the checkout and 11 called things that no longer exist. The gate now taps real buttons instead (Build menu, People − and +, a job's +, People, Score, Pause, save and reload) and refuses a build where a button has no handler.
- **The session log** (`logs/session-1.jsonl`, 1.8 MB, held an email address). Out of the repo; `logs/` is ignored.
- **The mockup images** (`mockups/`, 8 MB of PNGs and the layout lab). They were Build 36's working drawings; the live screen is the record.
- **The dead art.** The Han hat and the torch (no look used them), the pagoda roof (the Han wonder draws its own eaves), the `plaster` texture (it drew nothing), `mix()`. **Kept and wired instead:** the Mali horseman's own look, drawn but never used; the unit now shows it.
- **The indigo glass** on the map button (`.ic`, `.hb`, `--glass*`): a leftover of Build 35. The map button is now a `.fab` like Home and Build.
- **Second copies of the icons.** The five resources, the hammer and the book were drawn twice (markup and `RIC`). One `ICON` table now; the markup is built from it.
- **The tables outside the rules file.** `CAPS`, `UNCAPPED`, `ARMYROOM`, `INVEST` and `SHELTER.arrows` are fields on each building (`cap`, `nocap`, `armyRoom`, `invest`, `shelter`). `WEATHER`, `HARVEST`, `FERT`, `POST`, `HEALTH`, `ROUTES`, `MKT_SELL`, `MKT_BUY`, `MKTK`, `RATE_OF` moved to `01-rules.js`.
- **Hand-typed numbers in the help text.** The Guide's rules now read `FIELD_NEAR`, `DOCKR`, `UPKEEP`, `TAX`, `BUILDER_POW`, `POST.far`, `POST.want`, the buildings' `heal`, `cap`, `armyRoom`, `shelter` and `invest`. A number changed in a table changes in the Guide.
- **Duplicates.** `JOBS` is `RES`; `BNS` is `BN.length`; the unique units are counted from the table, not a typed list. Unused fields: the peoples' `color`, the seasons' `note`, the computers' `hunt`.
- **Four full-screen tints a frame** (dusk, night, drought/rain/frost). One fill, blended.
- **The clear before the map** when the map fills the screen.
- **Tried and reverted:** holding spent trees in the node list for 10 steps (to redraw the walking grid less often). An independent review found two of seven cutters stalled beside a camp for a minute; back to the same step, without the copy when nothing is spent.
- **The `build` action** was missing since Build 34 (deleted with the old Age button): tapping a building in a Build menu did nothing. Restored.
- **Broken text** from the Keep → Town Center rename ("Town Centers the game readable", "Town Center it behind the line"), a stale send-strip row in the Guide, "Food or Farm" after Farm was folded.

### Parked (ideas from the review, not built)
- **An event bus** between the game and the screen (the sim calls `say`, `sfx`, `celebrate` in about 87 places). `say()` already is the one door; a bus would move 87 lines for no change the player sees. Revisit if the screen is ever rebuilt again.
- **Stripping the test hook from the App Store build.** The gate measures the native page through it, so it stays. On an iPhone no player reaches a console.
- **Saving only the node amounts** and regenerating the map from its seed. The save is a third the size now (trees as five numbers, hundredths); the rest can wait.
- **Rewriting git history** to purge the session log: needs a force-push; asked separately.

- **Play fingerprint accepted:** first baseline: Build 37 as pushed, before the fingerprint existed

## Build 38: Albert's first long play, three Argon reviews (Oct 28, 2026)
- **The Build row** (Home · War · Walls · Trade · Culture · close above the jobs). The Build card already has the five tabs; the Build button now opens the card on the last menu used.
- **The 🔕 emoji** on messages and tips: a drawn bell from the icon table, in the text colour.
- **Long messages.** 30 messages that wrapped to two lines at 375 px rewritten to one line (e.g. "Gather, grow, explore. Tap anything."); the gate now renders every message at 375 px, the small map open and shut, and fails any that wraps. The word sieve now reads both sides of a ternary.
- **Easy and 30 minutes as the default.** Normal and 60 minutes now; a phone that kept the old default moves once, a later choice stays.
- **The minimap's minus** off the map (it hid the purple Rivals' corner); beside it now.
- **Card buttons on equal footing.** What you can afford: a bright raised face. What you cannot: flat, dashed, with a red line saying what is short ("Short 20w").
- **A page without a viewport line.** The site rendered at 980 px on an iPhone (the tall, narrow column Albert saw); build.py now writes a whole page (doctype, head with viewport, body) and the gate checks the phone width in mobile mode. wrap.py adds the native header to that page's head instead of wrapping it in a body.
- **Fixed from the Argon audit:** rebel count counted the new rebels twice; dead units counted as alive until the step ended (Dismiss while paused); sabotage left lost research in the Tech score; iron miners swung an axe; a battalion's plan could exceed 30; automatic picks pulled weavers and brewers off their posts; a loaded game waited a second to know its dangers and field crews.
- **A gate under construction was solid wall.** It is now an opening for its own side; computers build their gate first. Rivals now wall too (Raiders stay a raiding side).
- **Added:** quick sends of 8 and 12; "All" and "¼" send free troops only (a raid or march you ordered keeps going); a dashed line from each marching group to its target; "arrived" messages; an "Out on orders" list in the People card.
- **build.py** refuses a // comment that swallowed code, as SoRen's does (caught this build's own battalion line).
- **After the fresh-eyes review:** orders now save and load (a reload restarted the order counter, so a new send swallowed an old group and could lock idle troops out of the strip); a group counts as arrived when every member has stopped; the settings move touches only the old Easy + 30-minute default (it reset a Conquest choice); + on an old over-30 battalion plan no longer lowers it.

### Parked (Albert, Oct 28)
- **Higher caps: 80 villagers and 120 soldiers per side** (today 60 and 90). Parked by Albert. Before raising them: a speed pass on the soldiers' foe search and an 800-unit test run on his phone; a 700-unit battle already uses about 22 of the 33 ms a step has at phone speed.

- **Play fingerprint accepted:** Build 39: every game rolls its land (character, amounts, an extra deposit, stretched rings, a turned home pocket); soldiers at home keep a foe near the Town Center again (the Build 37 spin) and form up by their building

## Build 39: Albert's second play (Oct 28, 2026)
- **New soldiers spun in place.** From Build 37's speed work: a soldier at home found a foe near the Town Center, dropped it the next step, and stepped back and forth 14 times a second. It keeps the foe again, as in Build 36.
- **Woodcutters swung at air.** A tree blocks a 3×3 patch of ground (forest is a wall until cut), so a cutter stands 20 to 39 away. It is now drawn leaning in to the trunk while it chops; the game does not move it.
- **Soldiers formed a diagonal grid by the Town Center.** They now stand in the yard of the building that trained them (below it on screen, never behind its roof), one block per battalion, foot in the front rank, shooters behind.
- **The banner and the tip box** (two places for messages, overlapping the map button): one ticker under the strip. Newest message, tap to see where; the list button holds the last five, each with its silence bell; the arrow hides it all and a bell in the strip counts what comes. Tips arrive in it like any message.
- **The same map every game.** Each game now rolls its land: Fertile land, Timberland, Stony hills or Gold country (what is rich, what is poor, one extra deposit of its specialty), with the rings of resources stretched and the home pocket turned. All four corners stay mirrored. The opening message names the land.
- **Added:** an Elite rank for each people's own soldier at the Castle in the Medieval age (Praetorian, Elite crossbowman, Apple-bearer, Keshig, Royal elephant, Elite horseman). Only that people sees and researches it; the computers research theirs last. Art comes later.
- **Caught before it shipped:** a comment swallowed the numbers of every rank upgrade (names changed, stats did not). build.py now also refuses a comment holding a chain of statements.
- **Play fingerprint accepted** with the land roll and the spin fix as the reason.
- **Fresh review, six regressions fixed before shipping:** soldiers trained at a far barracks now guard their own yard and the Town Center; urgent warnings stay in the ticker while they hold; tips show with Messages off; the paused line wins unless a warning is up; the land roll retries looser before any fallback, turns the fallback with the home pocket and keeps clear of the shrine (unreachable deposits over 200 seeds: 11 → 5); the ticker steps aside the moment a card opens, so cards keep their full room.
- **Play fingerprint accepted:** Build 39 review: the land roll retries looser before any fallback and keeps clear of the shrine, so deposits sit in new spots

## Build 40: the one shot (Oct 28, 2026)
Albert's call: everything up to the old Build 44 in one build, one gate, one push. Five stages, each gated on Claude's side; one review at the end.

### Stage 1: Albert's third play
- **The finger, one rule:** a tap picks (a green ring on yours, red on a foe's, gold on the wild and the land), a double tap opens the page, a hold picks more (on open ground, a box). With yours picked, a tap on a target is the order: attack, hunt, gather, build, mend, walk; no menu, no words. An order waits a blink (320 ms) in case a second tap wants the page; picking never waits. A person wins the hit test over the ground it stands on. **Cut:** the box card's "Put the N on" and "Build" rows (a box now picks the people inside it; a box of trees alone still cuts a road). Verbs boxjob and boxbuild removed.
- **Relations in one place:** the Town Center card holds a row per side: Ally, Neutral, Hostile. Hostile takes effect after 30 s notice (Rome's fetial priests); Neutral is granted at once by an ally, asked of an enemy by an envoy; Ally needs their yes. One engine (setRel, judgeEnvoy) for you and the computers: a losing computer asks for peace; one at peace with nobody to fight and good odds gives notice. Heralds are sacred: nobody shoots an emissary. The Fortress keeps its own judgement until stage 3. **Cut:** the Fortress card's own Send-emissary button (the row does it).
- **A lord's hand on a vassal:** Demand now (100 of one resource; loyalty cost grows with each demand in two minutes), Force tribute (double tax for three minutes, needs 8 soldiers at their town, unrest +10), Call up their soldiers (4, 8 or half; they march under your colours until released; their dead cost 2 loyalty each), Break ties (war, and your other vassals grow warier). Loyalty maths moved behind the book.
- **Sounds by kind:** a wooden knock for a home or a field, a drum and horn for a place of war; a chime for a villager, a brass call for a soldier.
- **The Mint** (Medieval, Trade menu): gold gathered pays 15% more; Debase once for 600 gold and Market prices ×1.3 for the rest of the game.
- **Farms measured:** a farmer delivers about 29 food a minute in spring and summer, 38 in autumn, 15 in winter; a person eats 3.75, a foot soldier 5.6, a horse 11. A hundred people need about 19 farmers over a year, 12 with the plough research; the third age's 45 field places more than cover it. The numbers stay; the information was missing: the Stores card (tap any count on the tally) shows have, in, out and who is on it, and the food tip now reads the real deficit.
- **The army limit explains itself:** "Army full, 43/43. A barracks, range or stable adds 8." on the message and in red on the button.
- **Trade stops:** choose which goods your caravans sell at a stop you hold; Send a caravan here puts the nearest free caravan on the route. The roads: a worn track through each route's four stops, drawn once into the ground, bending round the great lake. The bazaar look, traders and awnings wait for stage 5.
- **Build:** the button becomes a parchment tab on the card's top edge while the menu is open, and closes it. Home split into Home (house, apartment, aqueduct, town) and Land (farm, pasture, tree farm, mill, bakery, dock, lumber, mine); six tabs, four buildings a row, every menu two rows (ghost places keep the height). Short names on the menu (Range, Siege, Business, Council, Lumber, Theatre, Town).
- **Queue slots:** a building's line is a row of slots (5, 6 with Written records, 8 with Guilds); a filled slot shows the order and its progress; tap it to cancel, the cost comes back (cancelOrder is the one rule; unTrain uses it).
- **Goods you can see:** the Stores card lists them with the last minute's flow. **Sheep that matter:** a tended pasture gives milk and meat, 0.03 food a second a sheep straight to the stores (11 a minute for 6 sheep, 22 for 12); the card says when wool waits for a Weaver.
- **Unit cards:** stats, what it is doing now in words (statusOf), and its life (age, gathered and trips, buildings raised, kills, distance walked; every unit carries a small tally, saved). **Resource cards:** what a worker takes a minute, how many are on it, how long it lasts, taken so far.
- **Deferred to stage 3:** the shrine as a landmark (it moves inside the Throne citadel there; the four shore shrines are cut then).
- Save shape 30: the tally on every unit, the stores' flow, notice given; old saves migrate.

- **Play fingerprint accepted:** Build 40 stage 2: spectacle events, hard computers and the moon draw on the dice and change the computers' timing

### Stage 2: the Challenge and the spectacle
- **The Challenge:** seven hazards as switches on the new-game card, each with points; the sum is the level and the level multiplies the final score (level 5 ×1.5). A new game starts at level 5 (hard enemies, starvation). Easy keeps the polite game whatever is on. Everything a hazard sends is announced first. Hard enemies: bolder, two more riders at your drop-offs, they wait for winter and strike in it. Starvation: a minute without food stops work; after two, a villager leaves and a soldier deserts every half minute. Harsh winters: fields at a quarter, marches slower, blizzards (whiteouts that blank the small map). Plague: three times as likely, spreads twice as fast. The horde: between minute 20 and 40, from an edge or the wild, 16 + 6 an age, for the weakest side, announced two seasons ahead and one. Earthquakes: every four minutes, 350 across, walls lose 30%, wood may catch. No tips.
- **Today's challenge:** the day's seed and level 10 (hard, starvation, horde, earthquakes), one tap on the new-game card.
- **Spectacle:** one scheduler, one table of 19 events, one set of knobs (EVM: damage, speed, sight, gathering) every unit reads. Something every one to three minutes, announced 12 s ahead. Real: eclipse (20 s of night, both armies at 60%), thunderstorm (a cloud walks east, lightning under it), stampede (ten bison cross, trampling fields and anyone in the way; good meat), flood (after rain: lakes rise 40 for 90 s, buildings on the shore take water), locusts (a cloud strips the fields it crosses for 90 s), falling star (iron in the wild: a Fallen star find), wildfire (in drought: trees burn and spread, 20 alight at once, wood near them catches; rain ends it), fog (sight at 40%), tremor, sinkhole (one building loses 40%), quicksand (after rain: a patch that slows to 30% for two minutes), heat (summer drought: fight at 85%), mirage (an army on the small map that is not there). Grounded and absurd: a travelling show (villagers who see it work 10% harder for two minutes), a wagon train (reach it first, three villagers), mercenaries (six swords for 240 gold, gone in three minutes). Fantasy only: a dragon (burns what it flies over), a troll out for 90 s, northern lights.
- **The moon:** eight days from new moon to new moon; the night is darker and sight shorter toward the new moon (🌑 on the strip).
- **World news:** a line from the rest of history every two and a half minutes, matched to your age, real events at real dates.
- **Sounds:** hush (eclipse), hooves, buzz, rumble, jingle, roar.
- **Cut:** the Build card's blurb (Albert: people will figure it out).
- Play fingerprint accepted (the dice and the computers' timing changed).

- **Play fingerprint accepted:** Build 40 stage 3: the Natives hold the Throne, the Fortress plays, the shore shrines are gone

- **Play fingerprint accepted:** Build 40 stage 3: the Natives tuned light, swift and many; gunpowder tells against them

### Stage 3: the Natives, the Throne, the Fortress as a player
- **The fifth side has one brain.** The Wild is the Natives. Regard (0..100, starts 20) is the one number behind everything: gifts raise it under the Danegeld rule (each gift in ten minutes buys less than the last; the card says so), blows on them lower it (2 a blow, at most once in 3 s), it drifts back to 20 slowly (about twenty minutes from 90). Regard 40: peace, they leave you be. Regard 70: an emissary makes them allies and their gate opens; the alliance ends if regard falls under 60. Turning hostile on them costs 20 regard and needs no notice.
- **The Throne:** a walled citadel on the great lake's island, four stone causeways with a gate on each, two towers, the one shrine at its foot (the four shore shrines are cut). Taken, never broken: at zero health it changes hands at a third of its strength, walls and towers with it, the garrison dies (sworn over, the garrison serves the new lord). Whoever holds it takes a 10% tithe of every other side's gathering and 50 score a minute, and every court turns on them; hold it 15 minutes in a 60-minute game (scaled) and the game is won. As the Natives' ally, 8 soldiers inside for 60 s and they swear to you. A mark that changed hands is dropped by the soldiers sent at it.
- **The garrison, Albert's rule:** light, swift and many (55 health, speed 32, 24 + 8 an age, back to strength in 20 s a man), no research, no armour; blows they land on anyone standing on a causeway hit 30% harder. Gunpowder is the turn: once any side reaches that age the garrison thins to 60%, grows back half as fast, and guns hit them 50% harder.
- **Traps:** four a causeway, pits (40% of health, stuck 4 s) and nets (a prisoner; ransom the unit's cost; unransomed in 3 minutes they join the Natives), relaid every 90 s while the Natives hold the Throne. A scout within 60 finds them and that side steps round them; allies walk free; a net takes a man, not an engine.
- **Outlaws on a plan:** every 3 minutes the camp nearest the side the Natives regard least sends four robbers at its nearest drop-off, home after 45 s.
- **The Fortress is a player:** defends first (bold .85, keeps half at home), opportunist (a target already at war with someone else looks 1.3× better), trades, spies, courts allies. **Cut:** the Fortress's jobs (contracts), its terms and tribute, Ask-for-troops, its own card and the Send-emissary button; the computers' Fortress-courting line. **Kept and widened:** an ally sends half of what stands at home to a friend's town under attack (every computer does it now).
- **Diplomacy for the computers:** a side at war courts a neutral as an ally after minute 10; whoever holds the Throne gets notice from every court. From the Medieval age a computer with 20 at home, siege (or the Natives' alliance) and the odds marches on the Throne.
- **Conquest:** every rival fallen or ruled (the Fortress counts now).
- **Alerts reworked (Albert):** world news and the spectacle's "coming" lines are quiet: they go to the list and count on the list button, never take the line; only events that can hurt you take it. World news has an off switch in Help.
- The citadel is drawn once into the ground: a paved island and four stone causeways; traps show when sprung, or armed when your scout found them.
- Play fingerprint accepted twice (the Natives' raids and the Fortress's new mind move the dice).

- **Play fingerprint accepted:** Stage 4: the Natives' 16 causeway traps are hidden buildings from the first minute; new research (Baskets, Irrigation, Informers…) and unit costs by tech shift the early economy

## Build 40, stage 4 — combat, fog, the deeper tree

Built: nerve, rout, charge, fall back, prisoners and ransom; priests convert; fog of war (toggle in Help); traps as hidden buildings (pit, stakes, net) for every side; Workshop, Mint, Foundry, Quarry make goods in-house; shared caps (a fallen rival's room split among the living); 50 researches across every building with an age tab row shaded by age; the Town Center folds to two sides, Town and Relations.

Cut: Business centre, Weaver, Brewery, Bakery, Amphitheatre (single-function buildings; their work is now research or the Workshop); the Fortress card and its contracts (the Fortress is a player now); a generic elite guide line (each people has its own).
Fixed on the way: stale references to the cut buildings in the farm and pasture cards, the sprite test and the native wrapper.

- **Play fingerprint accepted:** Stage 4b: the research tree is rebuilt from history (206 steps in lines, costs by weight); the computers follow the lines; the ground keeps mud, snow and ice

## Build 40, stage 4b — the tree from history, the ground, Teach

Built: the research tree rebuilt from history: 206 steps in lines (Smithy: Blades, Armour, Walls …), one button per line showing its next step; each step needs the one before and sometimes one elsewhere; cost and time from the weight of the step (1–10); the book gives the date and what it changed. Stone age thin, Gunpowder thick, as the record is. The computers follow the lines too.
The ground keeps the weather: mud, ice and snow build and fade over days and show on the map; mud and snow slow marches, ice makes men slip, engines on snow slide and shoot short, frost and rain blunt blades. Research answers each: drains, snow clearing, crampons, levees, cloaks, oiled cloaks, tempering, oiling, horseshoes, the weather glass.
Fire arrows, burning shot and petards set wooden buildings alight (rain halves it); petards shake the neighbours. Soldiers resting by a Castle, Barracks or Town Center heal (Garrison wards double it). Teach: Veterans + a School let a soldier learn a newer kind, frozen at its post for the lesson, four a School.

Cut: the age tabs on research (built in stage 4, replaced by lines the same morning); apostrophes in the new text (Albert: none needed).
Parked: old text still has apostrophes (a sweep for stage 5 or later); region fill treats flood water as solid for everyone, so a levee side wades it only on short routes.

## Build 40, stage 5 — the war table, the weather on the glass, art

Built: every card in the war-table dress (lacquered wood, brass rims on what you can do, the lit lantern on the open tab; the Build button is the card's lit tab); menu categories as file tabs on a brass rule; research steps wear their age's colour on the top edge. Rain as a pool of drops with real sizes and fall speeds, leaning with the wind; lightning as SoRen's three-stroke bolt with forks, a sky flash that decays in a tenth of a second, far sheet flashes, one flash at a time; the sky band under the top bars takes the hour and the weather, clouds cross it. The shrine in the Throne (steps, columns, gold dome, the holder's finial); the trade stop as a bazaar stall; a gold pennant on each people's elite rank. No apostrophes anywhere in the game's text.
Cut: the parchment card (the ledger look of Build 39); the old streak rain and the two-stroke bolt.

Also in stage 5 — **History (beta)**, Albert's idea for people with homework: a Guide page with every dated thing in order (20,000 BC on), a search field (a thing, a place, a date), Look it up (a Wikipedia search for the name), Copy on each entry and for the whole timeline, an honesty line at the top, and the corrections address (GitHub issues) at the foot.

- **Play fingerprint accepted:** Review fixes: the Natives hold a declared war, the computers walk the open lines on a counter, orders go on the first tap, the unit loop rotates, the Council and Furnace lines open

## Build 40, review fixes (my reviewer, Argon, Flash)

Fixed: saving died after the first rout (fleeFrom kept a foe object); Mint and Foundry cards threw; the War Council line began with Muster and the Furnace line with a cycle (fourteen steps unreachable); the Natives can now be set Hostile or Neutral at the Town Center and a declared war holds until you make peace; the computers answer their own emissaries, the player answers theirs; the computers walk the open research lines on a counter, not phase luck; Workshop, Mint and Foundry rates after a reload (NaN stores); a ruins scroll now follows the lines; a converted villager leaves its slot; prisoners taken from the wild are simply gone; guide and help text brought up to Build 40 (no four shrines, no Fortress contracts, fog of war, the Throne win); the apostrophe sweep finished and the gate now refuses apostrophes; grammar the first sweep broke; trap relay reads its rule; nerve floor constant and other unread rules removed; dead branches (castle tech, Room to grow) removed; charge cooldowns saved; the small map keeps the wild behind the fog; a comment that had swallowed a loop, and the build check now catches that shape.
Changed by the reviews: an order goes on the first tap (a second tap on the same thing opens its card); the unit loop rotates its start so the path budget is shared.
Not done (design, for Albert): auto-pause on management cards; a battalion dock above the job bar; drag to set facing; stronger silhouettes at low zoom; events without counterplay (sinkhole, mirage); an overworld campaign (the lands build); pruning the tree to milestone choices (against the lines just built).

Also, from the reviews, with Albert's yes: **Pause on cards** (any card pauses the game, closing it carries on; a toggle in Help) and the **army dock** (once Battalions is researched: All and each battalion above the job bar, one tap picks it; Charge, Fall back and Teach follow on the pick bar; a chevron folds the dock to a tab).

## Build 41 — Albert's notebook (three pages)

Built: one button for play, pause and speed (tap plays or pauses; hold opens ×1 ×2 ×3); the freed top cell is the Map (the small map starts closed, sits flush in its corner). New game: settings first (Game: Easy, Normal, Real, Fantasy; Length), then your people (the soldier without the people's name again), the challenge as ticks with a ? beside each, and a big lit Start at the foot with the challenge of the day under it. The map scrolls until its edges sit at the bars, never under the jobs. Pick rings lie on the ground under what they mark. The message list has Clear all and a cross. Buildings, fields and finds open on one tap. The queue reads Slot 1 to 5, and a locked slot says which research opens it. A tap on open ground: hammer (the Build card opens on what fits there, marked, and the ghost starts at the spot), sword (All, half, more), dots, cross.
Cut: the speed cell; the floating map and shrink buttons; the old setup card (its long Start line, the settings fold, the hazards fold); the "Hold, then drag" hint on the strip (it is in Help).
