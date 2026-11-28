# First Keep — Rulings

Albert's live calls, one line each, newest wording only. Read with RULES.md before any work.
These rulings evolve: a newer call replaces the old line (Nov 23).
A changed call replaces its line here (the old one goes to the log, `docs/log/`). Date = when he ruled.

## How we work
- Talk and build are separate; nothing is built until he says "build" (Nov 21)
- When he says something that goes against RULES.md or a ruling here, Claude names the rule or ruling before acting on it; then his call stands, and this file is updated (Nov 23)
- On a call he has made, Claude may argue back at most twice, with backup each time; then his call stands (Nov 20)
- The feature freeze during the cleanup is best effort, not a hard rule: things evolve (Nov 25; a hard freeze Nov 23); a build that should not change play must play exactly as kept (`--same-play`) (Nov 23)
- A sprint may suspend the rules to cover ground; it ends with a rule audit before the next build (Nov 23)
- Every build publishes to its own link, fresh/vN/; fresh/ forwards to the newest; a game stays on the build it started on (Nov 22)
- A save that will not open is never written over (Nov 22)
- Flag any build that changes map-making before publishing (Nov 22)

## Truth and fairness
- Real life first: whatever is closest to real life, with a source; if the source says that's the cost, that's the cost (Nov 23)
- The same logic for every side; the computers play their best to win, with no rules on what they may do (Nov 22, Nov 23)
- The computers may sell surplus (lifts the Nov 5 ban) (Nov 23)
- Rivals must not play the same way every game; making them try new things is its own job (Nov 22, Nov 23)
- A real-life hardship goes in only where the player can see it coming and answer it, and each needs a counter (a research or an action); looks with no effect on play are fine if they cost next to nothing (Nov 22, Nov 25)

## Sides and colours
- Each colour is a side (a seat); the strategy dealt behind it is hidden and changes each match (Nov 23)
- Blue is his; the rivals red, green and white for now; the clash with the ring colours waits for the colour talk (Nov 23)
- Rival personalities are drawn at random (Nov 23)
- The Start page's Allies switch lets the computers or him join together (Nov 22)

## Controls and screen
- No long press and no double tap (Nov 21). One exception, his call: the drag box starts after a 0.25 s hold ("The drag box I use a lot… keep for now", Nov 26; it was 0.32)
- The copied log covers the whole match and what the thumbs did, and copies in marked parts of a safe size, as many as the match needs (Nov 26)
- The building ghost snaps beside one of yours at the smallest gap that pair may keep: 1 between houses, touching for farms, 2 otherwise. On a spot that already fits it stays under the finger (Nov 26; it used to stop one lane out)
- What matters is a 44 px tap area, not the size shown (Nov 23). The bar's frame of Nov 26 goes under it by his drawing: a tab reaches up over the map to 47 px, the tall row is 46, but a thin-row box takes 30 px and a pad switch 23
- The bar's frame, on every card (Nov 26): six equal columns; three rows, the tab row 19 px, the thin row 21, the tall row 46; 6 px between the rows, 3 px between boxes and to the screen's edges ("My ideal padding for everything is 3px"); every box shaded, with gaps, no white bars except inside War's pad; a green edge is where you are (the open tab, the open Build group), a red edge what is picked or switched on
- Exit is on every card, top right in the tab row, the same size as Home, Jobs, Build and War ("Exit is on all menus and it's weird to not have it bc of muscle memory", Nov 26; replaces Exit on each card's own row and the "No Exit" on War of Nov 25)
- Jobs (Nov 26): the thin row is Idle, then a minus and plus over each job; the tall row People and the five jobs, icons kept
- Build (Nov 26): the thin row is Town, Work, Army, Keep, Tech as boxes a column wide, smaller letters than the tabs; the tall row the six buildings
- Top bar: one strip of readings (five stores, people, season, rank); pause and Mail are clear icons under it at the right (Nov 20)
- Words floating over the map get a dark glow behind them, strong over a bright ground and gone over a dark one (Nov 21)
- Everything has a sound, and each must make sense; the under-attack sound first (Nov 23)
- What-beats-what on the Train tile comes back; fix its crowding, not the feature (Nov 23)
- Welcome back full width: a design change, not urgent (Nov 23)
- The picture never drops below full resolution to save frames, and the game holds one frame rate, 30 (Nov 25, after Build 41 beside v111; replaces the dynamic resolution of Nov 10 and the 60 of Nov 8). The check gates it
- The quick action (a tap on open ground for Attack, Build, Rally) is dropped (Nov 25)
- No blur on menus: too expensive (Nov 25; replaces the frosted glass of Nov 9)
- The small map was lost by accident, not cut: its drawing is still in the code with no place on screen (Nov 25); where it goes is his to call

## Commanding soldiers: the rule sheet (Nov 26, built in v115; arming put back Nov 27, v119; replaces every earlier tap rule for soldiers)
- Picking, three ways and no others: a tap on a soldier (he joins the pick; a tap on one already in drops him), the drag box (soldiers only when it holds any), the boxes on the War card. The card always shows the pick: a type box is lit when any of its soldiers are picked and reads picked/there
- With soldiers picked, a tap on the map is the order, no button: on an enemy unit or building they attack it and seek it; on ground they march there. The pick ends when the order goes out; an order that cannot be carried out says why and keeps the pick
- With nobody picked, a tap on an enemy unit or building primes it (a yellow ring) and opens War; open ground primes only while War is open. One target at a time: a new tap replaces it, a tap on it lets it go, Exit drops it. With War closed a tap on open ground does nothing. Enemies have no card ("There is no need")
- Attack and Move arm (Nov 27, v119; "never arm" is withdrawn: 15 of his 16 taps on them were refused in his v118 match, and he had asked for arming). Three doors, one command, "just the door is different": the troops first, then the command, then the map; the command first, then the troops, then the map; the target first, then the troops, then the command. A tap with no target lights the box, with or without soldiers picked; the next tap on the map is the order and the light goes out; tapped again it goes out; the other one takes the light; closing War puts it out. Picking troops never sends anyone. A tap on an enemy always attacks, even with Move lit. With a target primed and troops picked they fire at once, as before. Dim only when you have no soldiers. Attack toward open ground and move beside an enemy still wait for the engine work; until then Attack at ground is the same march as Move
- A tap on one of your own buildings is never a troop order: it opens the building's card and lets the soldiers go. Villagers keep the Nov 12 tap table
- Rings on the map: green on picked soldiers, yellow on the primed target, red on whatever your soldiers have been sent at. No ring on soldiers under an order. No dashed white ring. The full colour table (picked, primed, under attack, defended, where you are) is still owed
- The switches (Hold, To Death, Stop, Retreat) act at once and keep the pick, so a ground tap after one still sends them
- Cut: place-first, double tap, re-picking a group by its old Move ring, every hold but the box (the armed Attack and Move were cut here on Nov 26 and are back, above)
- Parked: garrisoning soldiers in buildings; Dismiss for a soldier (there is none today; the soldier's own card was empty and is gone); the Defend ring with its count of guards (his idea, Nov 26: yellow, any number of guards on any number of things)

## The War card (army control)
- The tab row on every card: Home, Jobs, Build, War and Exit as words, each in its own shaded box, all one size, no pipes, no outlines; the open one glows green as Town does in Build. The round Home, the round W, the gold title and the fold arrow are gone; Idle on Jobs is boxed like the minus and plus (Nov 25, Nov 26)
- War is one card (Nov 26; replaces the two small cards of Nov 25). Thin row: New, Foot, Archers, Cavalry, Siege, then one minus and one plus. Tall row: Attack, Move, Hold as their own boxes, an empty slot, then one pad of four switches split by bars, no gaps: To Death, Defend, Stop, Retreat. No hint line. How it commands: the rule sheet above
- The War card reads in words only, no icons; a switch that is on lights its whole box, no ring inside a box (Nov 25); To Death takes a capital D (Nov 26)
- Troop row: New | Foot | Archers | Cavalry | Siege, then one minus and one plus that act on the type last tapped; quantity by type stays. A type box tapped adds all of that type, tapped again drops them. All, Idle and In view are cut: every type lit is All ("Why do we need all if you can just tap all the sections at the same time", Nov 26; replaces Nov 25; Custom+ cut and parked Nov 25)
- New: a simple selector that picks only the newly made soldiers from the town (Nov 26). Built as: a soldier trained and never given an order; any order takes him out of New for good
- Attack is loose and picks a target; there is no formation on an attack. Move is the strategic order (Nov 25)
- Advance and Fall back are not built; their place on the Nov 26 card is not set (Nov 25: only while Hold is on)
- Hold: stop where you stand and stay; a switch; it survives a Move; it overrides courage (a holding group never breaks) (Nov 22, Nov 25)
- Attack on a holding group: in reach they keep holding, out of reach Hold switches off (Nov 25)
- Formation: wait for one another and form up; independent of Hold (either, both or neither) (Nov 25; built so far: the shapes only). Shapes: Line, Specialty (foot Square, archers Crescent, cavalry Wedge, siege Battery), Wide (Nov 21)
- To death: one switch for attacks that are not holding; they never run. Normal is the default and has no button; Focused is cut from the card (Nov 25; replaces the three courages of Nov 21)
- Stop ("Stop is pause", Nov 26; was Pause): a switch on the pad; stopped troops hold fire; being hit ends it (Nov 25)
- Retreat is a switch (Nov 26): on, the picked group walks home and the box is lit; tapped again they stop where they stand, in the state a move that has arrived leaves them in, not on Hold; the light goes out when they arrive or get a new order; turning it on switches Hold off
- Advance and Fall back: step orders for a holding group, loose or formed, shown only while Hold is on; Fall back is the mirror of Advance; the old Fall back (out of reach, re-form, go back in) is off the card (Nov 25; replaces Nov 21)
- Defend: tap Defend, then the unit or building; the defended one shows it is defended (Nov 21)
- With nobody picked, Defend and Retreat do nothing and say so (Nov 22)
- Shelter and Prep are off the War card; where they go is his to call ("I'll work on this later today", Nov 26; replaces Nov 25). Until then neither has a button
- The formation page is his to design next ("What we lost so far is a proper formation page", "I'll work on that next", Nov 26). Until then formations have no button; a formation still needs Retreat and Hold beside it ("You still need retreat in formations. And you need hold")
- Garrison villagers stays on the War card (Nov 21)
- Wanted, not built: a camera snap to idle soldiers, a follow camera (Nov 21)
- Attacking a group: hit its front line, move with them, not past them (Nov 21)
- A group on the march that is struck kills the thing and keeps going (Nov 20, Nov 23)
- Soldiers sent at archers should try to get at them (Nov 23)
- Shields against arrows: kept for the foot's shield wall / Specialty, not now (Nov 23)

## Units
- Elephants: trample, fear on foot and horse, panic under missiles, an amok elephant tramples its own side, Elephant armour research, upkeep by food energy (Nov 23)
- Later: Zama counters (noise, open lanes), the mahout's chisel (Nov 23)
- Pioneers: by person in early ages, by machine later, with sources (Nov 23)
- Zeal and priests: to be fixed, not the priority (Nov 23)

## Economy and world
- The clock (Nov 19, 12:37; lost in the Nov 20 purge, restored Nov 24): a year is an hour (3,600 s), four seasons of 900 s, three days a season (a day 300 s, 12 a year), night 25% of the day (75 s); the economy kept per minute of play; work speed kept as a declared game rule. Night at 25% is his call, not nature's (real night averages half the day); it replaces the Nov 11 "length as nature's" for length (the gradual transitions stay)
- A full load is 8 (2.5 kg a wood) (Nov 23)
- Cold ration 0.385, cited to its source (Nov 23)
- Fog of war is a Start-page option; weather fog stays in (Nov 23)
- Wind stays: it carries rain, snow and fog; it does not slow anyone walking and does not move arrows (no way to aim against it). Ripples on water are wanted as looks only, if they cost next to nothing (Nov 25; replaces the cut of Nov 4). No wind chill is added: exposure is cold and wet, each with its research
- The five paid research that do nothing get their effects built (Midwives, Local guides, Law code, Magistrates, Chimney's warmth) (Nov 23)
- The stampede gets real damage only if sourced, with a warning and a way to protect against it (Nov 23)
- The ending: when a side's last Town Center falls, the side that felled it takes the whole store at once; the fallen keep the starting stores and fight on; their villagers try to rebuild; a side is beaten when its last villager is dead; its soldiers left fight on until killed (Nov 24)
- Ice: one set of rules for every side; the rivals have the crossing choice too, and may drown as you may (Nov 24)
- The home pocket keeps the same finds every game; their layout and the home water may differ each game (Nov 24)
- Caps show: people over room, and the army's ceiling (Nov 24)
- The villager card has Build as well as the jobs (Nov 24)
- The Steward: a tab on a research-only building; he sets a mix, idle and new villagers go where it is short; moving workers already at work is a toggle; same for every side (Nov 23)
- Villagers on a spent field or mine show idle (Nov 22)
- More resources outside the home pocket, fewer trees (Nov 22)
- The song line ("There is no music in life…") is kept for a future page (Nov 23)

## Kept features (Nov 20; fix after the cleanup)
- Keep, works: garrison, ice and floods, the copy log, replant all, later-age building art, fronts, unit history
- Keep, to fix: camps and wagons, charge, shelter / reinforce / boarding up (one villager-defence feature with garrison), priests, spies, schooling, diplomacy, traps / ambushes / ransom (with the natives), guide and help, trade, hunt, the bank (redesign), repair, rebellion (with vassals), the replant button
- Parked: one art palette (dropped), sprite colours into the sprites book, building shapes as data

## Older calls, sorted Nov 25 (so parked means written down)
- Keep: quick start (a Mill, a Lumber camp, two houses, a mine, a richer pocket; Nov 8), design talk first
- To discuss: race mode and simple mode (Nov 8)
- Parked: the Games and town recreation, the hidden age a full truce unlocks (Oct 29)
- Wanted, not now: the after-match screen (replay, compare with past games; Oct 29)
- Meant to be in, to test and fix: the scouting timer, stealth, bribes and contracts, the outlaw's bounty and pardon (Nov 8). Bribe for misfits and the spy's stealth are in; no bounty, pardon, contract or scouting timer found
- In, not good enough: torches and lights at night (Nov 10)
- Cut: the Apartment (its shell, cost and Fired brick's room are leftovers to clean)

## Nov 27: the audit of v118 and what he ruled (the audit: docs/log/Audit-2026-11-27.md)
- The next ghost after a building continues the pattern (v119): the same step as the last two, at the smallest gap the pair may keep (1 between houses; it stepped 2); blocked, it starts the next row beside the row's first building. "Don't touch the grid lines in green I love them"
- Fire and tight building: no extra gap rule. "If fire can jump from one house to another with a 1 space gap then it should get burnt down I suppose"
- Help is a sheet with a title row and Close (v119). A second fault shows the real pause screen (v119)
- His keep, cut and park calls on what is built with no way in: Schooling park · Vassals keep ("a very good and important system"; needs its rule sheet, a card and the computers using it; design first, built last) · the old battalion system (squads, plans, direct orders) cut, but Muster stays · Charge keep and give a home ("more important we need advance and fall back") · Trade post keep and fix · the small map keep and fix · the follow camera keep and refine · the Build tab's hint cut · traps and ambushes parked until natives are built, the trap code turned off until then · Crowns park · Formations "Priority. Keep. Fix. Refine. Build out." · Shelter, All clear and Prep "refine and build"
- Muster, his redesign: one per class, the button in that class's building (Barracks for foot, Stable for cavalry, and so on), and a research in each building for its muster once the main Muster is learned
- Order he agreed for those: the cleanup build, Shelter and Prep, Formations with Advance and Fall back, the quick homes (Trade post, follow camera, small map, Charge), Vassals last
- After the catch-up his match notes drive the order, not the audit's list
- Open, his to make: how long an undefended player should last on each difficulty (today 63 minutes on Hard, 71 on Normal; Claude's starting offer 12, 20 and 30) · what Hold means during a march (today it ends the march and says nothing) · Gift: build it or remove the button · outlaws and natives only ever fight him, never the computers: intended or not · whether computers should shelter and sell surplus · whether an order should keep the pick while War is open · "Buildings first" and "No pursuit" · the War card's touch sizes (below)
- The War card's touch sizes cannot reach 44 px inside the Nov 26 frame (thin row 21, tall row 46, 6 between: the thin row takes a 30 px touch, the four switches 23 each). It needs taller rows; Claude owes him two or three frame options with pixel numbers, and he picks

## Nov 28: his v118 and v119 matches, the work sheet, and what he ruled (the sheet: https://claude.ai/artifact/GywjwNrJKD9VrZys4wzwDw)
- v120 is the safety net, built first ("Yes"; "Ok build 120"): every error kept, said in the mail and written into the copied log with its line; a failed step no longer skips the drawing; one failing soldier, villager, building or part of a tick cannot stop the rest; a failed save says why; time in the pause menu is not a slow frame. The freeze of his 254-minute v118 match was not found in a day of tests; the next one names its line
- When a side falls (not built; replaces "no Town Center and no villagers"): no Town Center, no units of any kind (soldier, villager or other) and no building standing that can make a unit. Buildings stay. "I like hunting down each player." A beaten side's last units show on his map no more than they do today ("Leave as is now")
- Loot stays as built: the whole store to whoever takes down a side's last Town Center, a share of each other building to whoever takes that one down
- A map tap means do it now: "go now, or attack now, or gather now, or build now"
- He ages up late on purpose ("a tech and economy foundation first"); it is not a fault to flag
- The computers should try to win ("So whatever that may be"). The four rules he took (not built; "All four"): use the whole army, not one wave at a time; allies attack together and weigh the odds on their joint strength; every character fills its army by the middle of a match; keep attacking a losing rival until it falls. Measured on v119: against a strong player none of 15 attacks in two hours went at him; each computer read its own odds against him as 0
- Difficulty is thinking speed only (slow, mid, human) and Easy keeps its 6-minute safe start (not built; "Sure. Yes to both"). This closes Nov 27's "how long an undefended player should last"
- Rings (not built; "Yes"): colour says whose it is, shape says what it is doing. Picked: his own blue with a white outer glow. No second ring while War is open. The target he is attacking: a broken red ring. A target tapped and waiting: the same broken ring in gold. Wild: grey and dashed. Sizes 7, 11 and 15 px: on foot, mounted, elephants and siege. The green grid lines stay
- Train and Learn show both at once on a building card (not built; "Both at once"): units, a hairline, then research. Where the two do not fit in six tiles (the Stable, the Siege workshop) the last tile opens the research
- The War card (not built; his call over Claude's two-row pick, and it settles the touch sizes left open on Nov 27): the Nov 26 frame stays. The gap beside Hold becomes Form, a full tile that steps Loose, Line, Specialty, Wide. The pad follows Hold: To Death, Defend, Stop, Retreat while Hold is off; Advance, Fall back, Stop, Retreat while it is on ("I like your fix")
- Advance and Fall back (not built): the Nov 25 step orders stand ("Advance is Nov 25"). A step is 5 tiles. Forward is the direction of the last Move ("toward the direction of motion from the move action"), shown by a small arrow ahead of the group while Hold is lit; soldiers never moved are told "Move first". Each tap adds a step. The pace is the slowest in the pick. On blocked ground "who ever can go goes then the ones who can't go catch up to the group when they can". Fall back gets no damage cut ("No")
- Charge is cut, for the computers too (reverses Nov 27's keep): "Why do we need charge"; "Cut charge". The sprint a melee soldier makes when closing on archers stays
- Hold pressed during a march says so ("Yes"); what it means is Nov 22's: stop where you stand and stay
- Trebuchets left alone keep taking the nearest building ("leave as is now")
- Homes (not built; "Agree to all"): Shelter and All clear as one switch on the Town Center card, Prep beside it; Work during an alarm on Jobs; Muster one per class in that class's building; the Trade post on the Build tab beside the Market; the small map top right, folding away; the follow camera by a tap on the unit's name on its card ("Fine tap name in its card to follow"; he dropped following on every pick); Vassals under Relations, rule sheet first, built last
- The order he agreed: the safety net (v120) · rings · the cleanup · rules bugs (the raid timer below, the new fall rule, the audit's list) · the two cards · homes · the computers try to win · speed and memory on his phone · Vassals last
- Found, for the rules-bugs build: a native raid never ends. Its go-home time and the fall-back tile share one name on the unit (`back`); the time is wiped on the next step, so the raiders stay where they struck for the rest of the match and count as outlaws
- Open, his to make: Gift (build it or remove the button) · outlaws and natives only ever fighting him · whether computers shelter and sell surplus · whether an order keeps the pick while War is open · "Buildings first" and "No pursuit" · after a second kind of error the game still stops saving (the old rule, kept in v120): with errors guarded now, should it go on saving?
