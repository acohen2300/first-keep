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
  - [ ] defend not tested (it needs an enemy attacking; the test field's rival walks home)
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
    - Courage (Albert, Nov 21 09:46): Normal breaks when losing badly; Focused ignores distractions and stays on the target given; To death never breaks. His case for Focused: soldiers sent at a tower each leave when hit, the tower picks off the next, all run and the tower stands; had they stayed, it would have shot one while the rest took it down. To reproduce and test: this is likely the "wimpy" complaint of Nov 20
    - Fall back (new; Albert, 08:48): take 4 steps back, quickly form up, re-engage; "basically retreat enough to regroup for strength". So the distance is whatever breaks contact (out of the enemy's reach, four rank spacings at least), then re-form, then fight again
    - Open: what Focused courage does; where Garrison villagers goes; Priest, Medic, Spy have no class; targets have no tile; the screen boxes are under the 44 tap size; Jobs keeps − + above its tiles
  - [ ] soldiers less wimpy, more common sense (Albert to give examples)
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
