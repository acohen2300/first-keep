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
