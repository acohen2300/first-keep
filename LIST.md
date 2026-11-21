# First Keep — The List

Agreed Nov 20. One build between previews. Order is top to bottom.

## Cleanup

- [x] Build 1: publish from `fresh`, the check, comments and citations books back
- [x] Build 2 (plays the same, proven on four seeded matches): restart no longer inherits the last game's unpaid upkeep · 0 and 1 back (1,552 uses) · null as zero gone (105) · the build ghost, two fallbacks and the load tolerance · the 120 unset units · the two debug overlays cut
- [ ] Left over from Build 2: 2,259 numbers inside book tables have no unit said (the 120 were only the labelled ones) · about 50 measured numbers still typed in `index.html` outside the art (the sun's tilt 23.44 among them) · book entries nothing reads (next, single, forestScale, sea and others) · some null may still stand for a number
- [x] Menu audit: the menus were already one mold (a fixed line, a control row, a tile row) with one cell maker; what was left in code was what each menu holds
- [ ] Army control, first (Albert, Nov 20 21:25: "Most important. Army control. Terrible")
  - [x] two groups keep their own orders (an order no longer sweeps in every soldier within 21 tiles; it joins a group only when its spot lands inside it). In the check
  - [x] Wall connected (it was in the code, nothing called it): the picked foot lock a line, the picked archers hold theirs behind, until the next order or a second tap. Its button took the place of Exit on the war control line (Exit repeated the W circle beside it); Garrison villagers keeps its tile. Loose (the volley) and Charge are still not connected
  - [x] attack, hold and retreat tested with two groups (Nov 21). Found and fixed: soldiers told to attack a foe who walked out of sight stopped where they stood and said they had arrived; they now go on to where he was last seen (in the check). An order tapped beside a held or walled group pulled single soldiers out of it; it no longer does. Wall tested under attack: it held, all still in the wall after the fight
  - [x] Defend tested (Nov 21): the army 60 tiles off, ten raiders on the town centre; the picked foot go at the raiders, the archers stay. In the check
  - [x] the tower case (Albert, Nov 21): ten spearmen sent at a tower broke at three dead with the tower at 588 of 1020, then walked back in one at a time and all died. Now a band keeps its nerve while it is winning against the building it was sent at (the tower falls, five alive), and a soldier who did break picks no building to attack until his next order (six at a tower: they break, three live, none go back). Both in the check. The rule holds for every side, so two of the three long matches play differently; their marks are re-kept
  - [ ] tapping one of your own soldiers while giving an order changes the pick instead of setting the spot
  - [ ] the War card (Albert, Nov 21 07:51: "I think this is the card"). Drawn, not built: https://claude.ai/artifact/RgaC4KuRTnHPbwcLBmFkN4
    - Title line: Home, Troops | Mode | Mission, On Screen and Off Screen boxes, W. No "War" box
    - Control line: All | Idle | Foot | Bow | Cav | Siege | Custom+ at the left; Fight | Hold | Guard at the right
    - Six tiles below change with the controller: troops (classes, or a class's types, − + inside each tile), mode (Line, Wall, Wedge; Normal, Focused, To death), mission (Attack, Move, Defend, Retreat, Patrol later)
    - Signals: red box = chosen, on the choice and on its controller; gold glow = tap me now; three boxes = complete, tap the map. No underlines, no GO button
    - Opens ready: Troops, All, both screen boxes, Fight boxed; mission tiles showing; Attack glowing
    - Same footprint as the other cards (130) in every state
    - Build order: 1 Troops, 2 Mode (Hold and Wall move here), 3 Mission and the markers, 4 Custom+ groups
    - Nov 21 08:43, Albert: back to the card as it stood before Google's audit, the iteration without underlines. Not taken: pills, readouts on the top line, the single Map pill, stance moved into Mode, changes to the other cards. His objective: the most control in one area without overwhelming, and everything in the right order; clarity was never his problem
    - Missions, the same six for every troop (Albert, Nov 21 08:46): Attack, Move, Hold, Defend, Fall back, Retreat. No Patrol. The mission tiles stay in place when a troop word is tapped; the type tiles open from the word Troops (Claude's reading of "the same for every unit", to confirm in play)
    - Hold is stand your ground and works in both domains: the tile stops them where they stand and sets the stance Hold. Defend and Guard are the same thing in the two domains: the Defend tile sets the stance Guard (Albert, 08:48). So three missions set a stance (Attack: Fight, Hold: Hold, Defend: Guard) and three only move (Move, Fall back, Retreat)
    - No stance row (Albert, Nov 21 09:16): Fight is Attack, Hold is the Hold tile, Guard is Defend. The control line holds only the seven troop words. Defend takes a target: tap Defend, tap a building, a unit or a spot. A picked group shows its current mission boxed
    - Formations, three (Albert, 09:23 to 09:27): 1 Line / Wall, hold the line. 2 Specialty, by troop: archers a crescent; siege staggered, spread to cover ground, close enough to hit the same target, far enough apart that one charge cannot kill them all and the ends cover each other; cavalry a wedge, foot a square (Albert, 09:33: that works). Line and Wall are one formation (09:33). Every formation can be set to hold; Line does not hold by itself, it moves with the situation, advancing or pulling back as a line (09:35). Hold means die in place (09:35): they do not move, chase or break. 3 Wide, alternating rows. Mode's tiles: these three and the three courage levels
    - Courage, a ladder (Albert, Nov 21 09:46 and 09:51): Normal reacts to whatever hits him and runs when losing; Focused stays on his target and runs only when losing badly; To death stays on his target and never runs. His case for Focused: soldiers sent at a tower each leave when hit, the tower picks off the next, all run and the tower stands; had they stayed, it would have shot one while the rest took it down. To reproduce and test: this is likely the "wimpy" complaint of Nov 20
    - Fall back (new; Albert, 08:48): take 4 steps back, quickly form up, re-engage; "basically retreat enough to regroup for strength". So the distance is whatever breaks contact (out of the enemy's reach, four rank spacings at least), then re-form, then fight again
    - [x] built, step 3, Troops (Nov 21): the top line, the two screen boxes, the seven troop words, the troop tiles with − + inside. In the check. Claude's choices, his to overrule: classes add up until an order goes out, then the next class word starts a new pick; a lit screen box means included, the last lit one cannot be put out; + takes the nearest to the middle of the view, idle first, − drops busy and farthest first; only kinds he owns get a tile, the four classes stand in when no class is boxed; adding a class keeps a count trimmed with −; Custom+ saves a hand-made or trimmed pick and otherwise recalls the saved group, until its own step; Wall stays on the control line and Mode says "Not built yet" until Mode is built; the order tiles are the old five plus Garrison villagers until Missions is built
    - [x] the counts are back on the troop words, how many each would pick now (Albert, 16:43: "I'm missing the class count"); the Wall button is gone (16:50: "get rid of wall already"): until Mode is built no formation can be called from the card; the wall itself stays in the game for Mode (N442)
    - Found in step 3, his to rule: "idle" counts soldiers he has placed and left standing (anyone not marching or fighting), so Idle will pull a group he posted on purpose
    - Open: what Focused courage does; where Garrison villagers goes; Priest, Medic, Spy have no class; targets have no tile; the screen boxes are under the 44 tap size; Jobs keeps − + above its tiles
    - His answers to the ten open calls (Nov 21 17:55): 1 Garrison villagers stays on the War card (no slot: the six missions fill the six tiles; offered a narrow seventh tile, a bell and "Alarm" (Claude's pick), seven narrower tiles, or the Troops page; his to pick); 2 Attack does not need tapping: a tap on a foe already attacks and a tap on ground moves; the Attack tile adds fighting the way to a spot; 3 a group keeps its Mode until changed, new soldiers start Normal ("Fair"); 4 Specialty in a mixed group: foot a square, cavalry a wedge, archers a crescent behind, siege spread at the back; 5 Wide: staggered rows, a one-man gap; 6 Focused runs only after three times the losses that break Normal (his number); 7 Defend: tap Defend, then the unit or building, which shows it is being defended; 8 Fall back: out of the foe's reach plus four ranks, re-form, go back in on their own; 9 opening: All picked, Attack glowing (kept, 18:22); 10 Custom+: three saved groups, tap Custom+, pick, the green check saves
    - Proposed with the calls, in Step 4 unless he says otherwise: the open controller bright and the other two dimmed (the Home | Jobs | Build rule), the red box keeps meaning set; a hint line above Troops in the italic hint style ("pick a mission", then "tap the map")
    - New from him (17:55): a camera snap to idle soldiers; a follow camera for a tapped unit; "a smart way to say attack these people but focus on their front line so move with them. And not past them". No long press and no double tap (18:00). Found: both camera tools are in the code already (the follow verb and cam.follow; the idle jump behind the Jobs card's Idle box), to reuse; a tap on a foe sends every picked soldier at that one man (each fights the one tapped), so they push through the front to reach him. Proposed: a tap on one of a group makes the group the target, each soldier takes the one nearest him and none past their front, the band keeps its shape and moves with their front (stands while they come, walks up when they stop), and courage makes the exception (Normal fights the front, Focused and To death go for the one tapped); his to decide. Box-select starts with a touch-and-hold today: his to rule
    - Build order now (Nov 21 18:05): the whole-game build (the dark patch, the tap animation) → 4 Missions → 5 Mode → 6 fighting a group → 7 markers and the opening → 8 Custom+ → 9 the camera tools
  - [x] the dark patch behind floating words (Albert, Nov 21 17:16 to 17:45, N443): the red ring's box filled with the cards' dark, as strong as the ground behind is bright (none below 0.65, full from 0.8), fading; every card's floating words and the clear icons. In the check
  - [x] the tap animation (17:19, N445): a button grows and brightens under the finger and springs back. In the check
  - [ ] soldiers less wimpy, more common sense (Albert to give examples)
- [x] His bug list from the 125-minute match (Albert, Nov 21 12:07; answers 14:25 to 14:38), one commit each, each in the check:
  - [x] a tap on your own building site only picks it: no "undefined" circle (the trash icon was looked up in the wrong table), no second tap that takes it down; Delete is on the card (N434)
  - [x] every order ends the pick, soldiers and villagers alike; villagers sent to a full find go to the nearest of its kind instead of staying picked (N435)
  - [x] an order at a foe leaves no dashed ring or line behind; the short flash on the target stays; a move keeps its ring (N436)
  - [x] villagers keep to the find you sent them to (a load no longer makes them forget; no switching at drop-offs; the danger map does not pull them off; back to it after sheltering); the Jobs row can still move them. Workers at a farm, pasture, tree farm, quarry, mint or foundry stay when raiders come, wait at it if it stops, go back to it after the Alarm. Sent where no path reaches, they say so (N437)
  - [x] farm, tree farm, pasture, quarry, mint and foundry may touch one another; a house keeps 1 tile from another house, 2 from the rest (N438)
  - [x] workplaces show who works them: worked, a flag in its colour (farm and pasture green, the rest what they yield) and a glow on the mint and foundry; empty, the idle z (N439)
  - [x] the copy log says how each band order ended (foe dead, lost sight, no way, broke, new order, dead; 'no way' and 'broke' logged at once) and what killed anyone with no killer (removed by you, drowned, sickness and the rest) (N440)
  - [x] a villager with nothing left to gather goes idle, not waiting for ever; idle a minute, she walks to the nearest town center; one you walked to a spot stays; workers at their building wait there (N441)
  - Found while tracing, open:
    - [ ] long detours fail: a way is given up after 20,000 tiles searched (D230), so a place that needs a long way round (a bush 165 tiles off needed 334 steps round a lake: 70,000 searched) cannot be reached; villagers now say so, soldiers say "They can't get there". The likely cause of things stopping on long orders. A real fix is a coarse route layer (plan the way by regions, then walk it), its own build; a bigger budget alone costs 35 ms a villager
    - [ ] a soldier whose chase finds no way drops his target and stands idle (now logged as 'no way'); the archers stuck between stone and forest are the case to look for in his next log
    - [ ] the computers still place their own fields against any building (their own rule since before Nov 19); bring them in line with his? (N438)
    - [ ] a villager told to a find still runs from attackers there and goes back after, so robbers at the find make her shuttle
    - [ ] the flag's place, size and the glow's strength are Claude's; look at them on the phone
- [x] The copy log tracks more (Albert, Nov 20 22:36): the build, his orders, losses and to whom, refused taps, how it ended, errors, slowest frame, news with repeats folded, each rival's army by kind, people against room, army aim, goal, attacks.
- [ ] Human-side test: a test that plays as a person (every age, building, unit, card and button). It is the proof for the menu build, shrinks the 217 unsorted functions, and later proves each lost feature fixed
- [ ] Talk session, decisions only (before the standards step of Build 3): what red, green, blue, gold and cream mean; one look each for chosen, ready and unavailable; the text sizes; tap size 44
- [ ] Build 3, the menu build: what each menu holds becomes lists in the Screen book, every screen identical (proven by `tools/screens.py`, 173 screens)
  - [x] part 1: the control row's actions (SN52), the tile rows for jobs, build, a crew and ice (SN53), the card sections (SN54)
  - [x] part 2: the top bar is a single strip again (Albert, Nov 20): five stores, people, pause, Mail. The war controls and the jobs row are unique and stay as they are (Albert, Nov 20). Left to convert: the resource card's line, the top line
  - [x] homes found (Albert, Nov 20): bar = readings only (five stores, villagers and army, season with time left or hour, rank that opens Score); pause and Mail are clear circles under the bar at the right; age on the Stores sheet; idle on the Jobs row. The score number reads only on the Score sheet
  - [x] part 3: the sheets as lists of parts in the Screen book (SN56): new game, Help, Stores, Score, Mail, Back, and the pause banner's buttons and tiles. Still code: the Help book's pages, the two tables' columns
  - [x] part 4: the screen updated in place: only the parts that changed are swapped (one function, put). Measured on seed 7, two minutes of play: 7,810 parts built before, 1,286 after; a full redraw 1.8 ms before, 0.2 ms after. The markup is still assembled as text first
  - [ ] then the standards, as edits to those lists and the stylesheet: colour meanings, one look each for chosen, ready and unavailable, the text sizes, tap size 44
  - Not covered by the screens test (no such thing on the board in its match): the Make, Sell and Buy sections, the ice menu, later-age buildings
- [ ] Build 4: pictures in memory (the big sheets first), cap the cache
- [ ] Sources, alongside: every number Sourced, Derived or Chosen with its reason; open reasons listed for Albert
- [ ] Units: the 2,259 numbers inside tables with no unit said
- [ ] Lost features (list below), one at a time
- [ ] Simulation speed, last: no freezing on the phone since about Nov 16 (Albert, Nov 20). Measured on a desktop: late Hard games with about 320 units cost 15 to 24 s of computer time a game minute, mostly path-finding and animals. Phone test with the frame meter first
- [ ] Prose out of the books into the comments book, with index numbers; lock finished parts byte for byte

## Parked (Albert, Nov 20)

- Merging the art's colours into one palette: dropped, not worth the time
- Sprite colours into the sprites book (about 50 buildings, the soldier parts and props are still typed in the code; colours can move unchanged, proven pixel for pixel): parked
- Building shapes as data: parked; the drawings are code with about 100 branches, a redesign of its own

## Function rulings (Albert, Nov 20)

Cut: the two debug overlays (done)

Kept (Albert, Nov 20, ruled again): rebellion, it goes with vassals · the replant button, it is not a duplicate

Keep, works: garrison · ice and floods · copy log · replant all · later-age building art · fronts (finds the army's groups for the look button) · unit history on the card

Keep, to fix after cleanup (lost features):
- Camps and wagons: tried, does not work
- Charge: broken
- Shelter, reinforce, boarding up: unfinished; one villager-defence feature with garrison
- Priests, spies, schooling, zeal: never seen
- Diplomacy (envoys, gifts, vassals, tribute): about 90% never seen
- Traps, ambushes, ransom: wait on the natives, which need a design pass
- Guide and help: not built out
- Trade: works, hard to use; must explain itself
- Hunt: design needs correcting
- Bank: keep; redesign (today it only pays interest on gold held, 1% a minute, at most 40)
- Repair: untested
- Army orders and commands as a whole: a pain point; nothing cut until the control redesign

Open: about 217 functions not yet sorted, waiting on a test that plays the human side
