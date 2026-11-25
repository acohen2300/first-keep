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
- No long press and no double tap (Nov 21)
- What matters is a 44 px tap area, not the size shown (Nov 23)
- Top bar: one strip of readings (five stores, people, season, rank); pause and Mail are clear icons under it at the right (Nov 20)
- Words floating over the map get a dark glow behind them, strong over a bright ground and gone over a dark one (Nov 21)
- Everything has a sound, and each must make sense; the under-attack sound first (Nov 23)
- What-beats-what on the Train tile comes back; fix its crowding, not the feature (Nov 23)
- Welcome back full width: a design change, not urgent (Nov 23)
- The picture never drops below full resolution to save frames, and the game holds one frame rate, 30 (Nov 25, after Build 41 beside v111; replaces the dynamic resolution of Nov 10 and the 60 of Nov 8). The check gates it
- The quick action (a tap on open ground for Attack, Build, Rally) is dropped (Nov 25)
- No blur on menus: too expensive (Nov 25; replaces the frosted glass of Nov 9)
- The small map was lost by accident, not cut: its drawing is still in the code with no place on screen (Nov 25); where it goes is his to call

## The War card (army control)
- Title line: Home, Troops | Mode | Mission, a small eye icon (on screen only), W (Nov 21)
- Control line: All | Idle | Foot | Bow | Cav | Siege | Custom+; no stance row (Nov 21)
- Six missions, the same for every troop: Attack, Move, Hold, Defend, Fall back, Retreat; no Patrol (Nov 21; Hold moved to Mode Nov 22)
- Defend: tap Defend, then the unit or building; the defended one shows it is defended (Nov 21)
- Fall back: out of the foe's reach plus about four ranks, re-form, go back in (Nov 21)
- Mode: Hold and courage are the main controls, set on the fly for the picked group only; formations behind a door (Nov 22)
- Hold: stand your ground, do not move; it overrides courage (a holding group never breaks); courage stays set and carries on after (Nov 22)
- Courage: Normal; Focused runs only at three times the losses that break Normal; To death never runs (Nov 21)
- Formations: Line (moves with the situation), Specialty (foot Square, archers Crescent, cavalry Wedge, siege Battery), Wide; any can be set to Hold (Nov 21, Nov 22)
- A mission tapped with nobody picked does nothing and says so; a set mission wears the red box (Nov 22)
- Garrison villagers stays on the War card (Nov 21)
- Custom+: three saved groups (Nov 21)
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
