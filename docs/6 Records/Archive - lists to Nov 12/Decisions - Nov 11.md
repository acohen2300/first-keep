# Decisions and the agreed build list, Nov 11 [2026-11-11 20:45]

Written during the Nov 11 talk session, before N25. **N25 built only the Controller and the army routing** (see `frankenstein-refresh/v100/BUILDS.md`, N25). Build-list items 1 to 23 below are agreed and NOT built, except where N25's entry says so. The Controller sections record how the design moved; the built shape is `docs/3 Locks/Designs/07 Controller.md`. One correction: the per-tap order food cost was already cut in N24 build 1, so item 4 is a new charge by ground marched, not a change to a live one.

Working base: branch n11, N24 build 2 (gate passes, 2,529 items sealed). Build 3 parked on n24-build3.

## Findings
- Each ground tap with 20 soldiers picked stalls the game: single steps up to 104 ms, a tap on water 215 ms (test machine). Cause: one route search per soldier per tap.
- Tests t-n15 (torches, 1 of 7 lit at start) and t-sight (tree hides one way only; small-map check) fail and were being skipped.
- Measure book: 337 numbers, none carries a unit as data; 92 are counted in tiles.
- Nov 9 design pictures (locked-all, colour sheet, rings, kit4, Paused/Sound) were never saved to the repo. Only the written spec is (Next build list, section 9 on).

## Build list (agreed)
1. Strip rain-straight-down (E1000) and debase (E1001) from build 3; cut the dormant debase code; log in Parked.
2. Every number gets a unit and a subject, as book fields listed in the index. No comments in code. Gate enforces.
3. Check five board-size numbers one by one (chase 2500, path tries 20000, ai reach 30, vassal reach 45, news far 90). No blanket rule.
4. Order food cost stays, but charged by ground marched (Pandolf, D224), not per tap.
5. "Daily" becomes "Daily Challenge".
6. One ring standard for the whole game: the six-colour draining ring sheet. Inventory every ring, box and tile first.
7. Pause: restore the Nov 9 design (x1 x2 x3 under the pause button). Draw the board once while paused or on the start menu; no black screen.
8. Tech book icon, the two yellow lines and the building animation: review and mock.
9. Hidden resources: outline through the canopy for things you can act on. Gold drawn over trees is a draw-order bug.
10. Workers per resource: find real figures (picking, felling, mining) with sources. Do not make up.
11. Every drop-off offers its plot; placed with the ghost; no auto-place.
12. Build ghost starts at screen centre, snapped by the existing suggest code.
13. Cost fade on the whole line; the missing resource marked extra.
14. Sharpness: sharp is the target; remove the 2x cap once speed is fixed.
15. Tap flow, one rule for villagers and soldiers: tap = picked (one ring style); ground = go; bush = gather; site = build.
16. Builder rule: finish the build order; then work the last resource building built in that run; else return to the previous job; else idle and counted.
17. Focus: a focused villager stays on its job as a reasonable worker would; an abnormal circumstance (raid, Protect, alarm) takes over, then it returns.
18. Tech without the queue: tap as many as wanted; pay at the tap (as today); queued = blue, active = green with draining ring; runs in tap order; tap again cancels. Blue shows time until start, green shows time until done (the timer takes the cost line).
19. One schedule module (time until start, time until done) for tech tiles, a villager's stops and building queues. Timers are estimates and recount.
20. Villager card shows its stops like a route: now, next, times, done. Only when it has more than one stop.
21. Redo every item card (villager, berry, deer, wolf and so on) from the MR kit: title ribbon, one state line, one action row.
22. No food: the People icon wears the red can't-afford fade. Not greyed out.
23. Six visual meanings only: draining ring = time or progress; green = active; blue = next; gold outline = selected; red fade = can't afford; dim = not available.

## Bugs to trace (read-only)
Winner button; Lumber camp with no builder; villager builds a bit then stands; tap tree then idle; tower not shooting; villagers disappearing; torches; one-way sight; small-map check; why soldiers break off the group; actual food income of 30 food workers; rings and taps inconsistent (blue, green, fat blue; single vs double tap).

## Controller (SN38) decisions so far
- War icon: our own shield (curved top, 9.6 wide, outline 1.0) over crossed straight solid swords at 39 degrees, 33 x 25 px. File: War icon - F 39.svg.
- Boxes shade top to bottom by two colour-sheet steps.
- Default is jobs, always. The War button opens the war page and shows it can be closed.
- Brown side as Albert set it: Home, People, Build / Garrison, Protect.
- Protect opens Split, Lure, Seek; overflow from full buildings does the chosen one (Garrison limits: D256).
- Defend = go to whoever is being attacked (reactive, no spot). Return = retreat home.
- Squads-first proposal (Claude): red boxes All, Foot, Archers, Riders; tap a squad, tap a target (enemy = attack, ground = move); settings shown already set; a Go step so stray taps send nothing.
- Open: Go step; All lit by default; where jobs live in war mode; map as the resting centre.

## Prep (new idea, liked; not on the build list yet)
All villagers stop and board up the nearest buildings. Wood: +50% health, cheaper, faster. Stone: +100%, dearer, slower. Unboarding loses half of what boarding added. Repair restores. No cooldown, no timer: if the building falls, it falls. Existing techs (Fortified posts, Masonry, Architecture) make it cheaper and faster.

## Process
- Non-control fixes first (Build 1), Controller second (Build 2): Claude's recommendation; Albert has not confirmed two builds.
- Before the Controller build: list everything today's controls can do, so nothing is lost by accident.
- Saved to the repo with N25 (this file; the mock-ups in `mockups/controller-*`).

## Controller, final shape (Nov 11 evening; replaces the locked 14-box SN38)
- Default is jobs. War opens the war page.
- Three pads, each one box with an inset cross divider (corners as today's tiles), four buttons per pad, each a 58 x 44 tap cell:
  - Brown: People, Garrison / Build, Protect
  - Blue: Defend, Attack / Orders, Retreat
  - Red: Class, All / Squad, Idle
- Top row: small round buttons, as tight as makes sense, grouped over the left and right pads. Left: Home (snaps to the Town Center), back, restart. Right: hide, close, War. Execute pill in the middle; dim until an order is ready, green when it is.
- Style: 80% colour tint, no blur, on the pads; glass on the small top buttons; thin-line icons (1.5, one size), no repeated pictures; War keeps its shield and swords.
- Flow: who (red) is preset to All; pick an action (blue); Attack asks for a spot; tap the board; Execute. Defend and Retreat act on the first tap.
- Class opens Foot, Archers, Cavalry, Siege. Squad opens Alpha, Bravo, Charlie, Set up.
- Orders opens four settings shown already set (proposed: Focus, Formation, Stance, Target).
- Colours and rings on it: gold outline = selected; green = ready; draining ring = time to arrive; red fade = can't feed; dim = empty.
- Open: the peace page in the pad style; whether squads are built now or dimmed; the Orders four; one build or two.
