# First Keep — The List

Agreed Nov 20. One build between previews. Order is top to bottom.

## Handoff, Nov 23 07:30 (start the next chat here)
Audit of Fri 21:16 → v102 (Albert, 06:10: "lost in the weeds"): code healthy (check PASS), rules drifted. His plan, agreed 06:31: feature freeze until the cleanup is done; then, in order:
1. [x] Honest tests: two-groups back to under 1 tile (b2c80fa had loosened it to 2); front_line now fails if ours pass their front or we lose more than they do (it passed at 16 lost against 2)
2. [x] Rule gates (ceilings only go down): typed numbers per code file (rule 1), unused comments 36, loose citations 78, and `tools/build.txt` (rule 11: only named files may change)
3. [ ] Cleanup builds, one rule each, each `--same-play`: dead book entries; typed numbers into the books; the 1,735 numbers with no unit
4. [x] The soldier build (Nov 23, his "Build" 07:34; moved ahead of 3 because the two honest tests blocked every preview). Traced before touching the fight code; what was found:
   - the 16-lost-against-2 was the test, not the soldiers: its `MINE` is the game's own drawing list, so its ten foot were never ordered and twenty archers fought alone, and side 2's dealt wave joined in. Set right (OURS, waves held): we lose 0 of 20, they lose 18
   - "soldiers never picked pushed 1.6 tiles" was not a shove: formHome re-dressed the yard each time a class marched off (four riders walked 4.4 tiles), and a siege engine was still walking to its first place. Fixed: a soldier away on an order keeps his place in the block; the test measures each man by himself from when all stand (worst ends 0.5 tiles off)
   - found by the honest tests: a broken soldier's flight could end inside the tower's reach, where he held and was shot dead. Fixed: he walks on out of reach (backOff) before he stands (six at a tower: 4 live, were 3 by luck)
   - Claude's audit claim withdrawn: unjam, backOff, apart and stand are not five patches on one part (stand is the Wall, backOff is towers' reach, apart is the unreachable test, unjam alone is the jam rule). No rebuild was called for
5. [ ] LIST.md split: RULINGS.md (live calls only) and an archived log
Rule fixes that go in the cleanup: the Train tile's what-beats-what back (N386; 308f76e took it out, fix the crowding instead); one load weight, 2.5 kg a wood and a full load of 8, not 10 (the 18-20 kg cap, Knapik N400; slower trips); cold ration 0.385 cited to N275 (open the source first); the laws' fog text (QAN) says fog of war is a Start-page option; the five paid research that do nothing get their effects (Midwives, Local guides, Law code, Magistrates, Chimney's warmth; changes play, own build)
His calls Nov 23, after the freeze: the computers may sell surplus (lifts N202's ban); making them try new things is its own job; weather fog stays in; pioneers by person in early ages, by machine later, with sources; sides are seats coloured red, blue, green (maybe yellow), the strategy behind each hidden; his side is blue, the rivals red, green and white for now (07:33; yellow and white clash with the idle and wild ring colours, C24: for the colour talk); zeal and priests to fix, not a priority; the stampede gets real damage only with sources and a warning and a defence; the circus he has never seen; every sound present and making sense, the under-attack sound first (none found: the horn plays on his own march order); 8 sounds written but never played (zeal, stampede, circus, roar, rumble, hand guns, siege guns, tribute); green/red double meanings, prices, bell, top bar, steppers go to the colour talk, and what matters is a 44 px tap area, not the size shown
Welcome back full width (c532df9): a design change, not urgent. Sprints may suspend the rules (his reason Sat night: cover ground)

## Handoff, Nov 23 06:10 (start the next chat here)
- Latest build: v103 (https://acohen2300.github.io/first-keep/fresh/v103/). Every publish goes to its own fresh/vN/ folder; fresh/ forwards to the newest. A game stays on the build it started on.
- Built since the Nov 22 handoff: army Mode (Hold on/off overrides courage; Normal/Focused/To death; Formation door: Line, Specialty, Wide), stuck orders, 18 review fixes (review/STATUS.md on fresh-notes), Build A, route tracker, Build C (more far resources, 40% fewer trees), save safety, the Steward (Store tab).
- Waiting for his "build": passive rivals. Findings: his 277-minute match was on Easy (diff 0: odds +0.1, waves +3, 6 min safe); computers attack only when they think they win (odds vs his visible army and towers, need 0.5-0.65); 7 waves in 277 min; no raids outside waves. Proposed, same rules for every side: (a) raids that do not wait for odds, (b) odds judged at the strike point only, (c) use it or lose it when the army is full and idle, (d) spread the targets. Open: does Easy get them too (Claude: yes, gentler)
- Next after that: bridges (spec-roads option A); freezes (Build 3 frame findings); rule clean-up last
- Still no repro: "tap to move and they don't move" (ask for the log right after)
- Rule for Claude: flag any build that changes map-making before publishing

## Handoff, Nov 22 (after his 277-minute match, a win; logs read in chat)

Read this first. The reviewers' 18 reports are on the branch `fresh-notes`, folder `review/`. Where each finding stands: `review/STATUS.md` (Nov 22): round 2 fixed most; 18 more fixed Nov 22; 9 wait for his call; the frame findings go with Build 3, the rule clean-up last.

What the match showed, worst first: armies broke all at once at every Town Center (no courage, Hold does not hold); the economy did not run itself (idle villagers, winter starvation until he doubled food workers by hand, 300k banked with nothing to buy, pop cap 180, "That line is full" 553 times); no information (no scout report, no warning before winter, a resource running out or a break); orders that never arrived (T27 sat 46 min, V25 12 min; "no way" on 79 men at 98:32); rivals sat on hoards and did not attack for long stretches; freezes up to 1.5 s in fights.

Nov 22 evening (Albert 18:51-18:55, "Can you do A B and C?", built while he drove):
- [x] A (26f0fac1): mission with nobody picked says Pick troops first; red box = set on missions, none on Exit; spent fields/shafts show idle; Allies switch works; rivals named by dealt personality; rival towns vary (seeded site pick); willows (trees read the relief); fallen alert place (a felled building's by was overwritten by its killer); alerts use shown unit names; Pioneer out of army orders
- [x] B part 1 (eae3a055): route tracker, the march line follows the real path
- [ ] B part 2, bridges (spec-roads option A): not started; needs new building art, a deck rule in walkable and hAt, placement on water, save rebuild, burn rule, and the computers' use. Too big to finish safely unattended
- [x] C (b2c80fa5, his answer 19:58: few resources outside the home pocket, too many trees): far gold, stone, iron piles 3x Mid's, the ring's 3 → 5 piles; trees a corner 2586 → 1550 (map trees about 8,100 → 4,900); gold piles outside home on seed 7: 62 → 90 (tuning)
- [x] saves (Albert 20:54, a reload lost a whole game: Build C changed the map, the save was refused, one slot, the new game wrote over it): every build now has its own link fresh/vN/ (v101 first), fresh/ sends you to the newest; a refused save is kept, never written over; v101 took up the game left in fresh/. Fix 2 (self-contained saves) held: argued once, see chat
- Rule for Claude: a build that changes map-making is flagged before publishing
- [ ] still to look into: "tap to move and they don't move" (no repro yet; copy the log when it happens)
Build order agreed (Albert, Nov 22 14:03 "Build"), one area per build, one preview each:
1. The army: War card Step 5 Mode (formations and courage, his Nov 21 design below), Hold that holds (die in place), stuck orders and "no way"
   - [x] built Nov 22 (preview f636767c): Mode tiles (Line, Specialty, Wide; Normal, Focused, To death), Hold never breaks or leaves its spot, jammed orders arrive (D452–D454, N565–N566). Still open: Focused/To death do not yet keep their target on retarget; Wide and crescent trade nothing in combat yet (tuning); 'no way' in his log is soldiers with no path to foes behind walls (D400 handles it); Hold only strikes foes within reach
2. The economy: idle villagers find work, a winter food target, low-resource warnings, training that does not jam, the pop cap
3. Freezes in fights; rival passivity and hoards
4. Small: the fallen-building alert names the wrong place ("attacked at I28", "fallen at I1"); "Your cataphract" when he had none; the Pioneer has no order of its own and a tap sends it to whatever is under the finger; tapping your own soldier during an order changes the pick

His calls, open:
1. Season rhythm (winter to build and research, spring to war): yes or no
2. Steward: [x] built v102 (Nov 23, N569): a tab on the Store (research-only, Age 1); Off / Idle & new / All workers; a mix per resource (tap adds a part, 0-5); idle and new villagers go where the mix is short; All moves one worker a turn; each tile shows the share asked and the share now at work; computers keep their own management. Open: a yield with no find in reach is skipped silently
3. Forward base: A, a Camp he places (rally, supply, healing, status), or B, any castle far from home counts
4. Surplus: keep "no surplus selling" (Nov 5, N202) or give it an outlet; the rivals selling surplus is held back for this
5. Garrison villagers' slot on the War card; Idle pulling a posted group; box-select starting with a touch-and-hold (his no long press rule)
6. The night's found list (under The night push) and the two specs (roads, camera)
7. Soldiers "less wimpy": his examples, or today's logs

Talked through Nov 22, nothing decided, nothing built: the Steward; the season rhythm; a Surveyor (reports soil, mud, towers) and route options like a maps app (time, food, why; every number from the real pathfinder, run only when asked); the Pioneer's own "Clear road" order and a card that says what it does; walls drawn by drag, allowed to touch trees, rocks and water, with gaps shown; the forward base; an audit table of every hardship (its warning, its lever, its cost)

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
    - Formations, three (Albert, 09:23 to 09:27): 1 Line / Wall, hold the line. 2 Specialty, by troop: archers a crescent; siege staggered, spread to cover ground, close enough to hit the same target, far enough apart that one charge cannot kill them all and the ends cover each other; cavalry a wedge, foot a square (Albert, 09:33: that works). Names (Albert, Nov 22 14:58): foot Square, archers Crescent, cavalry Wedge, siege **Battery** (not Spread: too close to Wide; not File: a file is a column). Built Nov 22 with siege laid out as Wide's staggered rows; the name Battery is not in the game yet. Mode rework (Albert, Nov 22 15:07–15:27, not built): Hold and courage are the main controls, set on the fly for the picked group only (not the whole army, not in the army buildings); formations go behind a door. Proposed layout: Hold (on/off) | Normal | Focused | To death | Formation › (Line, Specialty, Wide, back) | spare; Hold leaves the Mission row. Ruled 17:03 (replaces 15:32 and 15:43): Hold means stand your ground, do not move, and it overrides courage: a group on Hold never breaks, whatever its courage (back to Nov 21 09:35, die in place, as built Nov 22); a Move or any new order ends it; courage only matters for groups not on Hold. Courage tiles stay live while on Hold (17:04): the setting is kept and takes over when Hold ends. Open: To death has no cost yet (raised, not ruled). Seen on the phone: set tiles show green lines not the red box, Mission stays boxed while Mode is open, SPECIALTY is cut off. Line and Wall are one formation (09:33). Every formation can be set to hold; Line does not hold by itself, it moves with the situation, advancing or pulling back as a line (09:35). Hold means die in place (09:35): they do not move, chase or break. 3 Wide, alternating rows. Mode's tiles: these three and the three courage levels
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
- [ ] The night push (Albert, Nov 21 20:29: "Whatever you have to fix… do it now… Make your best calls"; 20:54: one helper per book; up to 20 helpers at once, the session's limit)
  - [x] routes found however far round (see Army control); plain A* (the 1.5 weighting moved villagers round a bush and was taken out); the no-way memory kept per side, kind, crossing mode and ice-shyness and forgotten at a new match
  - [x] rivals differ each match (N460): each computer side dealt its own plan from the seed (personality, attack timing, liked class, a grudge target, walls/Wonder/spies/diplomacy on or off, goal order); a goal stuck 7 min is dropped for 15; a villager cap. In test mode the aggressive plans now attack within two minutes, so the army-control checks make peace first
  - [x] front-line attack (N490): a tap on one of a group makes the group the target; each soldier takes the front man nearest him, none past the front; the band holds while they come. Seed 7 with the other rivals at peace: we lose 1, they lose 13
  - [x] soldiers break the wall or gate in the way (N470); with nothing to break they step out of the towers' reach
  - [x] a full line sends training to the least busy building of the same kind ("That line is full: training at another barracks")
  - [x] drowning: every walker needs ice that holds him; the bowman's step back checks the ice for himself
  - [x] alarm: villagers go to the nearest shelter they can reach without running through the raid, else beside the Town Center (idle in the open 29 → 0)
  - [x] War card Step 4: the mission row (Attack, Move, Hold, Defend, Fall back, Retreat, the bell), the eye in place of On/Off screen, the other controllers dimmed, the hint line; a mission with nobody picked picks All; opening: All picked, Attack lit
  - [x] stat lookups 3-4x faster; the path search reads a tile's height once; tree leaf stages and rock pictures no longer redrawn needlessly; shell lists made once
  - [x] the books: dead entries out (comments, colours, measure, sprites, screen, words, mass, laws), numbers with no unit said 2,253 → 1,745 (the ceiling lowered to match), 8 sources read and opened, laws say what the code does, research prices in the top bar's order
  - [x] design pass: one resource order everywhere and "1k" in prices; counts as n/max; 44 px rows and round buttons; Welcome back full width with a 44 px help row; Train tiles as the Town Center's (name, cost); sound tiles say their name; the pause sheet boxes the current speed; Mail rows wrap; "Demolish" for sites, "Dismiss" for a villager; Cavalry and Siege in full
  - [ ] his calls, found tonight: QAN says "no memory, no shroud" but the game keeps fog and remembered sights; five research do nothing (Midwives, Local guides, Law code, Magistrates, Chimney's warmth); Pioneer corps can't be had before the Gunpowder age; a load weighs 2.5 kg (D53, his) or 1.4 kg (W24); the ration rise in cold 0.4 vs the source's 0.25; green means both Raiders and ally, red both Rivals and war; the stampede, circus and zeal are silent; three-part prices still squeezed on Build tiles (count on the name line, a taller tile, or shorter prices); Welcome back full width and the Train tile without the counter icon reverse his Nov 9 and N386 calls (each its own commit); the top bar is 30 px (44 adds 14 px); the Jobs steppers are 32 px wide (12 in a row); rivals' personalities drawn independently (one match in nine all three alike) or one of each
  - [ ] options written for him: bridges and roads (/home/claude/review/spec-roads.md: a bridge placed like a wall, 1-6 pieces; a ford road; speed roads not worth it); the camera tools (/home/claude/review/spec-camera.md: follow as a third round button; idle soldiers as a pin on the War card's top line)
  - [x] round 2 (21:27 to 22:20): rivals build houses again from age 2 (the Apartment they could never raise stalled their people and piled up their banks) and their research no longer stalls; each rival town faces its own way, its choke and waves aim at its dealt foe and target; every soldier kind trained again; a recall calls back only the wave; the horde goes for the weakest side at war with the Outlaws; one way to make allies; front-line band strikes back at whoever hits it, lets a group go into its own town, drops a front it can't see; Fall back can be left, clamped to the board, a refused move keeps fighting; queue exploit closed (taking out the first item no longer ages up at once), camp crews counted fresh, an age-up lost with its building, phantom workers; villagers sent their own way in the alarm stay there; ice rules for those already on it; saves keep Fall back groups, ice holes and cracks; a new game starts clean (flood, mirage, lightning); a save is refused only from a different map; unreachable targets fail at once (200 soldiers at an island: worst step 1396 → 75 ms); a death no longer repaints the land (17 → 4 repaints for 8 deaths); drawing caches (levelOf, ranks, kits, trains 14-17x); shared sight no longer goes stale; shadows hide what the draw hides; traps can't stop the drawing; meat drawn at its depth; Mail/Welcome/clock/menu fixes; a sound for every tap. Held back for him: the computers selling surplus at the market (reverses his Nov 5 'no surplus selling', N202) and a hoard-spending rule that didn't show it spent more
  - [ ] reviewers' reports in /home/claude/review (each part of the code, each of tonight's fixes): to go through and fix
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
    - [x] long detours fail (fixed Nov 21, N447): the search weights the distance still to go by 1.5 (Pohl 1970) and every search that names no budget goes up to 200,000 tiles, stopping when it finds the way; a way found not to exist is remembered 5 s per side, kind, start area and goal. On his Timberland map (seed 3382234986) D28 to D4 (380 steps round the forest) is found; AB4 and AB28 take under 1 ms (were 12 to 22 ms or failing). In the check (farway). A coarse route layer is no longer needed for this
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
