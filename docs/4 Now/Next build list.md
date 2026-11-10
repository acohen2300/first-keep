# Next build list (started Nov 9, 2026)

Items agreed in talk mode, to build on Albert's go. Newest last.

## OPEN: the one list (rebuilt Nov 10 14:20 from the three latest hand-offs and every list; the only open list) [2026-11-10 14:20]
Rule: when Albert answers or a build closes an item, change it here in the same commit. The numbered sections below are the record of how things were decided, not open items. [2026-11-10 14:20]

**A. Waiting on Albert** [2026-11-10 14:20]
1. Show all on the Build menu: he dislikes it; talk it through (today a tab with locked buildings gets a 7th box, a third row). [2026-11-10 14:20]
2. His phone's `?test` meter numbers (he will send). [2026-11-10 14:20]
3. #8, refund on cancel: he checks in his game (t-n15 says a cancelled unit is paid back in full). [2026-11-10 14:20]
4. The GitHub Pages source setting (from the Nov 9 hand-off; Albert's to set). [2026-11-10 14:20]

**B. To build (decided; each needs his go)** [2026-11-10 14:20]
1. Stance buttons (gift, bribe, war, terms, ally) do nothing yet. [2026-11-10 14:20]
2. Controller menus. [2026-11-10 14:20]
3. Colour check (every colour against the Colours book and the colour sheet). [2026-11-10 14:20]
4. Menu check (every menu against the MR kit). [2026-11-10 14:20]
5. B2's remainder, the zero rule: about 330 numbers still typed in code move to their books; then the gate refuses any typed number (about 3 h). [2026-11-10 14:20]
6. Audit item 5: sort the 15 old failing tests, bug or stale, one line each (about 2 h, overnight). [2026-11-10 14:20]
7. Flame brightness from real data: lumens per flame (Nordhaus) and light per person in history (Fouquet and Pearson, 1300-2000); settles the torch head. [2026-11-10 14:20]
8. B32: conversions wait for a house; building health by material; villagers fight (Lanchester); animals by the randomizer. [2026-11-10 14:20]
9. B33: quick start, race mode, simple mode. [2026-11-10 14:20]
10. B34-B36: the Nov 8 triage's "do" items (`Triage - Nov 8.md`, about 55), not yet checked one by one against the code. [2026-11-10 14:20]
11. Small: long names clipped in Mail; the colour and season cels (parked in N10). [2026-11-10 14:20]

**C. Later, by Albert's word** [2026-11-10 14:20]
Choke and Bombard (with the war module); help inside each card and a help line for every action; the Guide; hunting modes; "mind your own business"; squads; the 52 Base differences; computers held to sight; the Throne; the triage's "later" items. [2026-11-10 14:20]

**D. Closed (so no chat asks again)** [2026-11-10 14:20]
The Nov 9 questions (quick action, Rally and Shelter, Guard, thicker rings, Fast and Yard, the Sound card, Fog on Start, the v80 card picks) were answered Nov 9 19:37 and built in N6. Hold only for the box drag, tap a building's drawn shape, fog and sight, SoRen's renderer: built N6 to N8. First placed, first built: N17. [2026-11-10 14:20]

**E. Known faults** [2026-11-10 14:20]
`test.py t-walls` crashes (a harness fault); t-proof's plant no longer matches menu.js; the match smooth check's stutter warning; the Garrison box is dim when no foe is near. [2026-11-10 14:20]

## 1. Font issue and changes (Albert, Nov 9, 07:37–07:44)
Cap exception: this run may open more than 10 items (Albert, 07:44).

Decided:
- Font: Barlow Semi Condensed, two styles: **14 · 600** (labels, and everything that was 18) and **12 · 400** (choices).
- Everything at 18 moves to 14 · 600: card and menu titles, Start, the Jobs − / +, card headings (`#card h2`).
- Barlow 400 is carried inside the game (from google/fonts, OFL), beside the 600. The 500 and 700 are not carried.
- Open: titles stay IM Fell English SC at 14, or switch to Barlow (cuts IM Fell).

To do:
1. A Type entry in the Screen book: fonts, sizes, weights, cited. CSS reads it as variables set once at start; the canvas reads the same entry.
2. Game-wide: menus, cards, toasts, help line, map words, the speed meter (now `13px system-ui`).
3. Remove every stray: every size, weight, number or colour typed in code goes to its book, cited, or is cut. Known: `font-size: smaller`, weights 400/500/bold in menu.js, the 14px and 18px in menu.js, `n / 2 + 3` (start spawn), `3 × tile` and `2 × tile` (wildlife), `(out − 0.2) / 0.3` (coast).
4. Fix the gate: the number count must catch numbers with units (`14px`, `0.3s`, `.5`); the ratchet becomes a zero rule (a typed number fails, not only more of them).

Why strays got through: the gate's number count (`NUM` in `index.py`) skips any number followed by a letter, so every CSS size passed; and the ratchet only stopped growth, so numbers typed before the seal were grandfathered.

## 2. Menus anchor to the bottom (Albert, Nov 9, 07:55–07:59)
- Every menu is a bottom sheet: anchored to the screen's bottom edge, covering the base rows (People, Jobs). No exceptions: "if a rule doesn't work everywhere, the rule (logic) or the builder is the problem, not the item."
- Applies to all: the new game setup, Build, Town Center, every card.
- Precedent: iOS bottom sheets (Maps, Music); thumb reach is best in the bottom third (Hoober). The menu top drops about 100 pt, more board shows.
- Keeps the one fixed menu height (Nov 4); only the anchor moves.
- Later, in the menu review: one standard close (✕) on every menu, by a set formula.

## 3. The villager square and the Build icon (Albert, Nov 9, 08:02–08:18)
- One card made of four 44 × 44 tiles (was four 62 boxes, 3 apart); inset dividers that stop short of the walls; each tile's tap area is its full 44 (the dividers are only drawn). Icons 14, words 12 · 400 (item 1).
- Build icon: mallet A (tilted, no claw), head up-right, handle down-left; replaces the claw hammer everywhere Build shows.
- Glass: the square, and every pop-up and menu (one rule; replaces the Nov 5 "menus solid"): 55% of the panel colour with a blur behind (iOS frosted material).
- Glass falls back to solid when the phone struggles: one more step on the existing shed ladder (`draw.lv` in the Measurements book, `shed()`), so a phone that sheds detail drops the blur first, with the ladder's own climb-back delay so it doesn't flicker. Also solid when the phone asks for less transparency (Reduce Transparency), where the browser reports it.

## 4. Rain, snow and fog (Albert, Nov 9, 08:28–08:35)
- Bug: rain and snow are never drawn on a phone that sheds "motion" (step 2) or has Reduce Motion on (`still()` in `drawSky`, E379–E380): Albert's phone sheds to step 3, so he has never seen a drop. Weather is information, not decoration: a shedding phone draws fewer, simpler drops (fewer, straight), never none; Reduce Motion gets slow drops, not zero.
- Fog: keep the law (QK, Koschmieder V = 3.912 ÷ β, NOAA CALVIS); fix how it is drawn. Delete the flat sheet (`wash(SKYC.fog, K.fog * 0.8)`, E144). Light through fog: T = e^(−β × path) (Beer–Lambert); radiation fog is a shallow ground layer, so the path is set by the camera's height (the zoom): zoomed out, the whole layer (white); zoomed in, a short path (you see). Fog pools in low ground and over water, thins on hills (the height map). One home with the zoom-aware haze (E381). Find and cite the layer depth.
- The drop and haze code types about 20 numbers (colours, sizes, 0.8): into the books with item 1's sweep.

## 5. Why the phone sheds (Albert, Nov 9, 08:35–08:38)
- The trigger is too strict: `shed()` (E605) steps down when a frame's work averages over 12 ms for 2 s (`draw` in the Measurements book), but the game aims at 30 frames a second, a 33 ms budget; it climbs back only under 7 ms held 10 s, so it stays down.
- The work it measures includes the simulation: at ×3 the sim runs three times a frame, and shedding drawing cannot fix sim cost.
- Fix: measure against the real frame budget of the target rate; time the sim and the drawing apart and shed drawing only for drawing's cost; read real numbers first from Albert's phone (the preview with `?test` shows the meter). Low Power Mode and heat not ruled out.
- Measured (Nov 9, 10 s of a match, 161 units, ×3, desktop): sight under 0.5% of the work; the meadow painting (`sweep`, E-meadow) the top named cost at 4.8%; about 35% the browser drawing (canvas, compositing). The targets for shedding are the meadow and the drawing; the phone's own numbers first.

## 6. Sight, fog of war and memory (Albert, Nov 9, 08:38–08:49)
Albert's sighting: opponents' villagers blink and come back elsewhere; buildings pop out of nowhere; squares and L shapes on the ground (picture, 08:38).
Causes:
- The squares and L shapes: every finished building stamps its wear onto the one shared ground picture (econ.js → `wear()`), seen or not: the footprints of hidden buildings show (a fairness leak). The grey puffs above them likely the same (chimney smoke), to confirm.
- The blink: sight is checked twice a second (`sight.tick` 0.5) pair by pair (`look()`, `sees()`), yes or no, no fade, no memory.
- The pop: the fog of war and the remembered buildings were cut Nov 6 (Parked.md, "Cut: the fog of war and the made-up sight").
Build:
1. One sight map per side, by tile, with a count of eyes on each tile (StarCraft 2's way); casting by shadowcasting (Bergström's recursive shadowcasting), buildings and trees by height casting shadows (the Nov 7 rule).
2. An eye casts when it steps onto a new tile, never on a timer (no sight beat).
3. Dominated eyes skip the cast (Albert, 08:45–08:49): an eye whose sight rim is already all seen by others adds nothing (art gallery pruning); checking the rim (about 2πr tiles) costs far less than the disc it saves (πr²).
4. Fog of war back, with the real sight (not the cut made-up ranges): unexplored, explored (dimmed), in sight.
5. Remembered buildings, as last seen, until seen again.
6. Units fade in and out at the edge of sight; never blink.
7. Everything drawn or heard asks the one map: units, buildings, ground wear, smoke, fire, sounds; wear per side's view, not the shared ground.
8. The Start page's Fog on/off: Albert's call at build time.
Also: unit drawing types `side !== 0` (a stray number; a latent bug if the player is ever not side 0): read "me".

## 7. SoRen's renderer, for First Keep (Albert, Nov 9, 08:51–08:56)
Albert: "Everything needs to be smooth. I won't accept less." Any rule must also simplify the code. Rain and snow stay drop by drop (never one sheet).
From SoRen's live code (`acohen2300/soren`, index.html):
1. Steps shown smooth: SoRen repaints its sky once a minute, at low resolution, in slices (a few rows a frame, at most 3 ms), on two canvases that cross-fade over 2.4 s (`PSKY`, `updateSky`). For First Keep: the sun, shadows, season, meadow and night tint change in steps, every step cross-faded.
2. Layers baked once, keyed: each land layer painted into a canvas keyed by world, pixel density and stage, repainted only when the key changes (`ensureLand`). For First Keep: one Bake module for every cached layer (replaces the separate ground, woods, scar and meadow caches).
3. Stacked layers, the GPU mixes: the sky its own canvas, weather never touches it; glass tiles are the browser's backdrop blur over it. For First Keep: separate canvases for ground, things, weather and the night wash; a pan moves the cached ground instead of repainting it.
4. Rest pacing: paused, or a card or sheet open, a frame every 66–150 ms; dark, 250 (`tick`). Smooth where it matters, near zero where nothing moves.
5. Sprites made once: clouds, glows, grain (`makeSprites`).
Into items 4 and 5: SoRen draws rain and snow drop by drop from a pool, and Reduce Motion holds them still, never removes them (`updateWeather`); First Keep copied the drops but added "off when shedding". SoRen's 12 ms shed trigger fits its 60 frames a second (16.7 ms); First Keep copied 12 ms at 30 frames a second (33 ms).

## 8. Open items from before Nov 9, decided (Albert, Nov 9, 09:01)
1. The black bar: yes, publish one stitched file (the source stays split; publish writes one page), so a phone can't mix a new page with an old book.
2. The "Something is in the way" card scaled with the zoom. Rule: words never scale with zoom; "zoom is just what you see, not what you read." Applies to every word and card on the map.
3. The pause menu: the whole thing doesn't work; fix it. Found (Nov 9): the pause panel (`#spd`, menu.js E718) is added to the page outside the three places that listen for taps (`ui`, `topEl`, `qaEl`, menu.js line ~302), so its buttons (×1, ×2, ×3, New game, Fast, the gear, Effects, Alerts, Ambience) never run; the gear is still labelled "Yard" (the Yard was removed Nov 7); the first row ("Paused · tap to carry on") is in the markup but not seen. Fix by one tap listener for the whole screen (one home), not a fourth listener.
4. Choke and Bombard: in, but with the war module, not now.
5. Tap-and-hold: allowed only for the box (square or rectangle) drag to select. Nowhere else.
6. Help inside each item's own card: later, too big for this build.
7. A tap on a building (anywhere on its drawn shape) opens the building's card.
8. Hunting modes, 9. "Mind your own business": later, too big for this build.
- Later (Albert, 09:03): B32, B33, the Nov 8 triage (B34–B36) and the overnight full test run wait until after this build list.

## Built
- N1 (Nov 9, Build A): the shed now times drawing only, against shares of the frame's real interval at the rate it runs (D321 slow 0.72, fast 0.42, from SoRen's 12 and 7 of 16.7 ms); one `rate()` for the loop and the shed (E822); rain and snow never off (a shedding phone draws half, Reduce motion holds them still; D229 drops, C17 rain and flake); the pause menu's buttons answer (one tap listener for the whole screen, E821); Smoke 6/6. N1b: the stitched page came back out: the deploy workflow is sealed by the old `v100-ground-up` gate (the one GitHub runs, a folder not to touch), so the stitch failed the site's check; N1c (Albert, 09:25: unlock, edit, relock): the old gate opened for `pages.yml` alone, the stitch added, the old gate resealed and its permit cleared; the site serves v100 as one stitched page. Still open from these items: read the phone's numbers (`?test`); the pause panel's gear still says "Yard" and its first row "Paused · tap to carry on" does not show.

## 9. Menu redesign, Albert directing step by step (Nov 9, from 10:01)
Type rule (09:59): card titles in the fancy font (IM Fell English SC) at 18; first lines 14 · 600 (tabs, options, research titles, labels); second lines 12 · 400 (costs, second rows). Replaces item 1's "everything at 18 moves to 14".
### The jobs rows: LOCKED (Albert, 10:10) (10:03–10:08; mocks jobs-2 to jobs-4)
- Icon, count and word all at 12 (12 · 400), in People, Food, Wood, Stone, Gold, Iron and Build.
- The − and + of a job 3 px apart; the two rows 3 px apart; only side to side between columns stays 6.
- One ink and one fill for every cell in the base rows, in every state, Build included: no dim ink, no darker fill ("for now").
- Build's icon: the mallet (item 3).
### "Menu ribbon 6 box": LOCKED (Albert, 10:13–10:24; mock jobs-bar4)
- Six boxes in a row, each 44 tall, 6 px apart, the first and last 6 px from the screen's edges; each box keeps its own full rounded outline and fill.
- Behind them a backing tray, one shade darker than the boxes, filling the gaps so no ground shows between them, 1 px past the boxes on every side (46 tall, 5 px from the screen's edges).
- A new mold of its own (one home in the Screen book), to be used where Albert places it.
### "Menu ribbon 3 box": LOCKED (Albert, 10:25–10:26; mock jobs-bar5)
- The 6 box ribbon's mold with boxes 1+2, 3+4 and 5+6 merged: three double-wide boxes (two slots and the 6 px gap between them, 122 wide on a 390 screen), one outline each; same tray, gaps, edges and height. Same grid, different spans.
### "Menu ribbon title": LOCKED (Albert, 10:28–10:32; mocks jobs-bar6 to jobs-bar8)
- On the 6 box ribbon's tray: one wide box (where slots 1–4 were) and three small boxes (the space of slots 5–6 split in three), all four 3 px apart; the small boxes about 38.7 wide on a 390 screen, the wide box taking the rest (253). Same tray, edges and height (44 boxes on a 46 tray).
- Note: the wide box ends 3 px past the six-slot grid line (the three small boxes keep their width).
- The small boxes are under Apple's 44 tap width (about 39): flagged.
### "Menu ribbon footer 2": LOCKED (Albert, 10:34–10:36; mock jobs-bar10)
- The full-width dark tray (as the 6 box ribbon: 46 tall, 5 px from the screen's edges) with only the menu ribbon title's three small boxes, on the right (about 38.7 wide, 3 px apart, 6 px from the right edge); the left of the tray open, no box.
### Short names (Albert, 10:37–10:38)
- Every menu ribbon is "MR": MR6 (menu ribbon 6 box), MR3 (menu ribbon 3 box), MR title (menu ribbon title), MR footer 2 (menu ribbon footer 2). Checked: no "MR" code is used anywhere in the repo. Registered in the Screen book when built (the M shell family, MG/MH/MW/MT, is separate).
### "MR footer 1": LOCKED (Albert, 10:39; mock jobs-bar11)
- The MR6 mold with all six slots as one box: a single outline across the full width (378 × 44 on a 390 screen), on the same dark tray (46 tall, 1 px rim, 5 px from the screen's edges).
### "Controller": LOCKED (Albert, 10:43–10:54; mocks jobs-12, fills, tri2; replaces the 10:48 twelve-box version)
- The Job Ribbon Main shape: two rows of six full boxes (no − / + pairs), plus one more box on top of column 1 and of column 6 (3 px above), so columns 1 and 6 stand three tall and columns 2–5 two: 14 boxes. Spacing as the jobs rows: 44 tall, 3 px between rows, 6 px between columns and to the screen's edges.
- Colours: columns 1–2 brown (today's cell fill; column 1's top box brown); columns 3–4 gunmetal (S1, #2c3238); columns 5–6 crimson (R4, #a3262a; column 6's top box crimson); white ink (#ece5d3; 10.3:1 on gunmetal, 5.8:1 on crimson). Colours into the Colours book when built.
- What each box holds: not yet set.
- Flag: brown and gunmetal are close in brightness (they part by hue), which may blur in dim light or for colour-blind players.

### "Job Ribbon Main": LOCKED (Albert, 10:51–11:12; mock jobs-3stack)
- The jobs rows as locked, with one more box on top of column 1 and of column 6 (3 px above), so those two columns stand three boxes tall and columns 2–5 two; 138 tall at the corners, 91 in the middle. The column 6 top box is crimson (R4, as the controller; Albert, 10:52), where War sits today; the column 1 top box brown. What the two top boxes hold: not yet set.
### "Job Ribbon Hide": LOCKED (Albert, 10:56–11:12; mock jobs-main3)
- Job Ribbon Main with one more brown box on top of column 6's crimson box (3 px above): column 6 four tall (brown, crimson, then the two job boxes), column 1 three tall, columns 2–5 two; 185 tall at column 6. What the new box holds: not yet set.
### "Job Ribbon Hide - short": LOCKED (Albert, 10:58–11:12; mock jobs-hide2)
- Job Ribbon Hide without its bottom row (the − / + row, which also held Build), everything shifted down one row: the job boxes (People, Food, Wood, Stone, Gold, Iron) on the bottom; column 1 one brown box above People; column 6 crimson above Iron and brown above that; 138 tall at column 6, 44 in the middle. Open: where Build goes.
### "Queue": LOCKED (Albert, 11:12–11:22; mock mr6-gm)
- MR6 with all six boxes gunmetal (S1, #2c3238, grey outline), on the same dark brown tray.
### "Info Help Ribbon 1": LOCKED (Albert, 11:14–11:21; mocks f1-half, f1-light2, f1-four, f1-blue, f1-gm)
- MR footer 1 at half height: one full-width box 22 tall on its tray (24, 1 px rim, 5 px from the screen's edges).
- Fill gunmetal (S1, #2c3238); outline ring blue (#2f8cff, the working villager's ring, Colours C24 "work"); text white (#ece5d3) at 12 · 400, upright (not italic); contrast 10.3:1.
- Tried and not chosen: glass (Albert: "that didn't work"); the three browns (tray, normal, lighter by the tray-to-box step x = 17, 12, 9); mint C6 (white ink fails, 1.5:1); italic.
- 22 is half Apple's 44 tap height: if it is tapped, its tap area stays 44 while the bar draws 22.
### Research buttons: LOCKED (Albert, 11:23–11:31; mocks mr3-soft, mr3-states, mr3-thick, colour-sheet)
Each a box in gunmetal (S1, #2c3238) on the MR tray; only the outline changes.
- "Research Buttons - Blue Dim": 1 px, inactive blue #284c7c.
- "Research Buttons - Blue Active": 1 px, ring blue #2f8cff.
- "Research Buttons - Blue Double": 2 px, ring blue #2f8cff.
- "Research Buttons - Green Dim": 1 px, inactive green #3d6b47 (by the inactive rule; seen and locked 11:32).
- "Research Buttons - Green Active": 1 px, mint #5fd08a (C6).
- "Research Buttons - Green Double": 2 px, mint #5fd08a.
### Colour sheet, active and inactive: LOCKED (Albert, 11:32; colour-sheet2)
- Inactive = the active colour mixed 55% into the tray brown (#221811). Pairs (active → inactive): ring blue #2f8cff → #284c7c; crimson R4 #a3262a → #5c1e1c; gunmetal S1 #2c3238 → #262423; brown box #33241a → #2a1d15; lighter brown #443023 → #312319; gold #e6b947 → #7a6029; white ink #ece5d3 → #7d7468; mint C6 #5fd08a → #3d6b47.
- The browns step by x = (17, 12, 9): tray #221811, box #33241a, lighter #443023.
- Outlines: dim and active 1 px, double 2 px.
- Flag: the dark colours (browns, gunmetal) barely change when inactive; their inactive state needs another cue.

## 10. Index of the Nov 9 locks (Albert, 11:33)
Codes checked unused everywhere in the repo (books, code, docs, Base, Mid). Screen book (SN, next after SN19) for the molds; Colours book (C, next after C26) for the colours. They become book entries when built.
| Code | Locked item |
|---|---|
| SN20 | Type rule (card titles IM Fell 18; first lines 14 · 600; second lines 12 · 400) |
| SN21 | Jobs rows |
| SN22 | Job Ribbon Main |
| SN23 | Job Ribbon Hide |
| SN24 | Job Ribbon Hide - short |
| SN25 | MR6 (menu ribbon 6 box) |
| SN26 | MR3 (menu ribbon 3 box) |
| SN27 | MR title |
| SN28 | MR footer 1 |
| SN29 | MR footer 2 |
| SN30 | Queue |
| SN31 | Info Help Ribbon 1 |
| SN32 | Research Buttons - Blue Dim |
| SN33 | Research Buttons - Blue Active |
| SN34 | Research Buttons - Blue Double |
| SN35 | Research Buttons - Green Dim |
| SN36 | Research Buttons - Green Active |
| SN37 | Research Buttons - Green Double |
| SN38 | Controller |
| C27 | Colour sheet: the inactive rule and the eight active/inactive pairs |
| C28 | The brown ladder: tray, box, lighter (step x = 17, 12, 9) |
| C29 | Gunmetal S1 #2c3238 |
| C30 | Crimson R4 #a3262a |

## 11. Menu shells (Albert, 11:36–11:37)
- Menus are shells; shells have ticks. A menu shell's ticks:
  - Ribbons: the ordered list of ribbon codes, top to bottom (e.g. SN27 MR title · SN26 MR3 · SN25 MR6 · SN28 MR footer 1). Its length is the ribbon count, which sets the height; its order is the ribbon order; each code is the ribbon type.
  - Name / title (shown in MR title, IM Fell 18); Source (the book its content comes from); Guide link.
- Each box in a ribbon carries its own slots: Verb (from VERBS), Text (first line, optional second line; the type rule sets the sizes), Icon (optional), Colour (from the colour sheet, e.g. C29), State (dim, active, double: SN32–SN37).
- By rule for every menu, no tick: bottom-anchored over the base rows, glass, the ✕ in MR title.
- Height: by ribbon count, for now (replaces Nov 4's one fixed height and Nov 5's Town Center / Start height exceptions). A cap to be set later.

### "Top Info Ribbon": LOCKED (Albert, 11:39–11:44; mocks t9, t9b) · SN39 (checked unused)
- At Info Help Ribbon 1's height (SN31: 22 on a 24 tray, 1 px rim, 5 px from the screen's edges): one continuous brown bar (no box outlines), split into nine equal segments by eight straight vertical dividers, 1 px, in the outline colour (#6b5230), each stopping 5 px short of the top and bottom.

## 12. Progress rings and the colour map: LOCKED (Albert, 12:03–12:16; mocks queue-ring*, queue-ring-all)
The ring: a 2 px outline around a box, pinned at 12 o'clock, receding clockwise, over its 1 px dim track (the colour's inactive pair); gone at 100% (the work is done). Following the box's rounded corners, so one rule for any box size.
- Replaces the queue's green fill (menu.js `queue6`). Three states, the research buttons' own (SN32–SN37): Dim (1 px, the dim colour) = not chosen; single bright (1 px, bright) = chosen, waiting in the queue; Double bright (2 px) = active, the one ringing down (Albert, 12:19).
- Replaces the research family tints (Colours C26, B29): the tint book goes, logged in Parked.md when cut.
- Rule: the colour says what kind of work, the ring how much is left. What is made decides the colour; raising a building is always brown; what happens inside it takes its domain's colour; no building has a colour of its own.
| Colour | Means |
|---|---|
| White | The age-up (Albert, 12:19). Info: the Info Help bar, toasts, pop-ups; the ring recedes over the time to read the text: a short base + words ÷ (238 / 60) s (adult silent reading, 238 words a minute: Brysbaert 2019, to cite); a tap holds it (WCAG 2.2.1) |
| Red | War: soldiers trained, war research, war timers (order cooldowns, fire, ransom); arms or trains people |
| Green | People and economy: villagers trained, economy and health research (axes, picks, sickles, ploughs), a field's or tree farm's life |
| Brown | Building: any building rising or repaired, building research (masonry, cranes, brick); walls, towers, gates and research that strengthens a structure. The ring in the wood colour (the icon's tan), not the outline brown, so it reads |
| Gold | Money: mint output, trade runs, tribute, bribes, the bank |
| Blue | Knowledge, sight and relations: learning research (writing, medicine, maths, optics), speed research, scouting and familiarity fading, envoys, alliances, contracts |
Research families mapped: economy → green, health → green, war → red, speed → blue, sight → blue, other → blue.
Flags: gold already marks "selected" (the gold 2 px inset); one must move. The age-up gives white a second meaning (info and milestone).

## Built N2 (Nov 9, B1 the look pass)
- Type rule (SN20): titles IM Fell 18; first lines 14 · 600; second lines 12 · 400; Barlow 400 carried inside the game (fonts.css, OFL, N283).
- Menus and cards are bottom sheets: they hide the base rows while open and are as tall as their own rows (the fixed height cut).
- Glass on menus, cards and the villager square (SN40); solid as soon as the phone sheds (D321 lv.glass).
- The jobs rows (SN21): 12 type, 3 px between rows and pairs, one ink and fill.
- The villager square: one 44 card, inset dividers, 14 icons; the mallet (SN19).
- Info Help Ribbon 1 (SN31): under the top ribbon, coming and going with each message; and the footer of every menu, always there, a tap opens Help (Albert, 12:29).
- New colours: C28 brown ladder, C29 gunmetal.
- Open: the Help page shows the message twice (its text and its footer); the pause panel still drops from the top; the meter's font still its own.

## Built N3 (Nov 9, B2 the rings)
- The ring (SN32, one home for the six button states: SN33–SN37 folded into it): dim, lit, run; pinned at 12, receding clockwise, drawn on each box's own outline.
- The colour map (C27): white the age-up and the help line; red soldiers and war research; green villagers, economy and health; brown building research; gold caravans; blue scouts, envoys, spies, speed and sight research; dim by one share into the tray brown.
- Where: the queue (first item runs, the rest lit), the research buttons (dim, lit when armed), the help line under the top ribbon (white, over its reading time: D356, Brysbaert 2019 to open).
- Cut: the research tints (C26) and the queue's fill.
- Open: train buttons have no ring yet; long queue names are clipped in the queue slots.

## Built N4 (Nov 9, the MR kit)
- All solid: glass cut (SN40, lv.glass, the solid toggle); menus and cards on the tray brown.
- Type (SN20): titles IM Fell 18; column-1 row headers 14 · 600; inside boxes 12 · 600 and 12 · 400; one font helper (E839).
- The title row (SN27): the title's wide box, then ← · book · ✕ (E836).
- Help lines: the chevron when the text runs past one line; a tap opens two lines (E837, E838); the toast keeps its white ring at the ribbon's width.
- Rings on the head buttons by the verb map (SN32 verbs).
- Open for N5: each menu rebuilt (item 13's list below).

## Built N5 (Nov 9, each menu from the kit)
- New game: one line each (Difficulty, Length, Scenario, Tension, Daily); World gone; the side's words in the help line.
- Help: the earlier messages, newest first (D357 keeps 20); the latest stays in the help line.
- Mail and Welcome back: two columns wide (SN33), centred; Mail's title on its own row, ← · book · ✕ beneath; Welcome back only Resume and New game.
- Paused under the pause button: the speeds and its help line (test builds also keep Fast and Yard there). Sound under mute: the three volumes (icons from HX10) and its help line; mute shows it, a tap again hides it.
- The book button opens Welcome back mid-match (paused); with no game it is dim.
- Relations and Misfits: the name over two columns, then gift (bribe) · war · terms · ally, ringed gold, red, gold, blue (SN32 stances); not built yet.
- Cards: the title row (← · book · ✕); train and research as wide boxes, ringed; All tech.
- Help lines: the chevron sits first so it shows on a clipped line.
- Open: the stances do nothing yet; the queue row shows only while something is queued; Mail's long letters are clipped in the narrow card.

## Built N6 (Nov 9 evening, the whole open list; detail in `N6 progress.md`)
- Menus: first lines 14 · 600; TRAIN / RESEARCH labels; card and box gradients; plain header (← · book · ✕); rings on the box's edge; Paused: speeds and New game; Welcome back's line; Fog of war On / Off on New game.
- Build menu: Home, Resources, Military, Defence, Trade, Arts, two rows of three; Dwelling first; locked hidden behind Show all; the Apartment raised from a Dwelling, the Tree farm planted from a Lumber camp.
- Tap a unit (green glowing ring), tap a thing: it does it; the ground: it goes; then the pick clears. The quick action: a square, Attack · Build · Squad · More; All · ½ · ¼ · Idle; three taps in one spot send all.
- First placed, first built. Spring start; the camera further out; v80's gold, stone and iron; the grass at twice the resolution.
- Woods walkable for foot and riders with the ice's crossing modes; Pandolf heavy brush; arrows lost in the trunks; one-on-one fights.
- Sight by rays that stop at the first block (trees, walls, buildings, ground; trunks thin it inside woods; weather shortens it); only the outermost eyes cast; fog of war with memory; weather fog by Beer-Lambert from the zoom.
- A tap anywhere on a building's drawn shape; a hold only for the box drag. The gate counts numbers with units; menu.js's sizes swept into the Screen book.
- Open: the zero rule (about 6,150 typed numbers left, mostly sprite coordinates); stacked canvases; fog pooling in low ground; silhouettes under the canopy; long names clipped in the queue and Mail; sight not saved across a reload; the stances do nothing.

## Built N7 (Nov 9 20:24-20:45, Albert: "Do all 4")
- The docs do not ship: `frankenstein-refresh/v100/ship.py` writes the live page (one stitched file; each book's cite and law gone, and its name where the name is a description; tech and shells keep their names, which the game shows; the JSON without spaces): 1,122 KB to 942 KB. The Pages workflow runs it (the old gate unlocked for `pages.yml`, resealed, relocked). Correction: the comments and citations books were never loaded by the page; what shipped was the name, cite and law text inside the books the game loads.
- SoRen's keyed layers: the land (ground, meadow, scars, skin, grid) drawn once and copied back while the camera holds still, drawn again when it moves, while the meadow sweeps, or every 250 ms (D363, E880). Measured: drawImage from 32% to 3% of the work.
- The grass by the phone: full resolution (2) while it keeps up, a quarter the pixels (4) once it sheds its first step (D353 resShed, E881); no reading needed by hand.
- The fog of war saved with the game: the ground each side has seen, the buildings it remembers, fog on or off (E879).
- Fixed: the quick action's ½, All, ¼ could throw once the square closed (share() read a closed square).

## Built N8 (Nov 9 20:44-21:05, Albert: "Proceed"; the cels)
- The cel mold (layer 90, SC47) with two shells: Blades (CL1: tapered blades, light and shade only, so they take the meadow's season colour; Poisson-disk spacing, Roberts' ring, 8 tries; built once from the map's seed in pieces that never repeat; fade in by zoom) and Clear coat (CL2: the land laid over itself in a soft light, deeper and crisper, never blurred: Albert 20:52-20:53, an anti-reflective screen, not a matte). One module, `cels.js` (ticks Blades, Coat); values in D364 and C32; cited N295-N298.
- Sheets (E893, one helper, `slideSheet`): the land and the fog of war are each a picture 64 px larger than the screen, slid pixel for pixel with a pan, painted again only past the margin, on a zoom, when their key changes, or (the land) every second (D363). A cel piece (64 view units) is built in the browser's idle time, never inside a frame.
- Measured (desktop, software drawing, at the opening zoom): a pan from 64 ms a frame (N7) to 33 ms; N5 at the same zoom 18 ms. On a phone's graphics chip the slides cost far less; the meter's numbers will tell. Code: +4.5 KB (cels.js); nothing removed yet. Rule 12 (save code) not met: the meadow's sweep stays, as it carries the paths, mud, puddles, frost and snow.
- Open: the colour and season cels (the meadow's three tones and its tint as cels of their own) and the woods and fog of war as cels; the spikes on a long pan (build pieces ahead while idle).

## 13. Menus from the MR kit, Albert's markup (Nov 9, 12:57–13:12; mocks kit2, kit3, kit4)
- All solid, no glass (undo N2's glass); the tray brown fills the 1 px seams so the stack reads as one card.
- Title: always ← · book · ✕ on the right (SN27).
- Type (13:12, replaces 09:59): 14 · 600 only for row headers in column 1; everything inside a box at 12 (first line 12 · 600, second line 12 · 400); card titles IM Fell 18.
- New game: Fantasy and the World row gone; every item its own line (Difficulty, Length, Scenario, Tension, Daily); the side's description moves into the help line.
- Help line: a chevron (⌄) when the text runs past one line; a tap opens it to two lines.
- Build and Town Center: folder tabs, the open tab joined to a gold outline round the card's body.
- Relations and Misfits: one mold, MR6 with slots 1+2 merged for the name, then gift (bribe on Misfits) · war · terms · ally; the ✓ confirm gone.
- Mail, Welcome back, Paused: small, two columns wide (122 on a 390 screen). Mail centred: title on its own row, ← · book · ✕ beneath it. Welcome back centred: only Resume, New game and the info bar, no title, no nav (13:14). Paused under the pause button (columns 5–6): only the speeds ×1 ×2 ×3 and the info bar, no title, no nav; a tap on ▶ plays again (13:14). Sound (13:17): Effects, Alerts and Ambience as a card like Paused, two columns wide, hanging under the mute button, with the info bar; a tap on mute mutes and shows it, a tap again unmutes and hides it (as pause and play). A help line too long for its card shows the chevron (13:25). New game mid-match: the Welcome back card (Resume, New game), opened from the book (guide) button (13:25).
- Barracks: train row, research rows, "All tech" for the rest.
- Rings on everything: build tiles brown; train red (villagers green); research by family; gift, terms, bribe gold; war red; ally blue; options and speeds white, the chosen one lit (gold stays for money and the folder tabs).

## 14. Albert's play notes, Nov 9 evening (talk mode, 18:09–19:21; mocks quick-action-mock, army-strip-mock, look-mock)
Decided:
- Rings: a ring is the box's outline, on its edge (as on research); never a second line inside. Back, book and ✕ all take the same white ring. The top help line and the cards' help lines: the ring replaces the blue border.
- New game: a box in the Paused card, under the speeds (Albert: A).
- Welcome back's help line: "Resume where you left off, or start a New game."
- Start's label: 14 · 600.
- Build menu: six tabs of two rows of three (36): Home (Dwelling, Town Center, Tavern, Baths, Hospital, Aqueduct) · Resources (Farm, Mill, Lumber camp, Mining camp, Quarry, Pasture) · Military (Barracks, Range, Stable, Siege workshop, Smith, Foundry) · Defence (Wall, Gate, Tower, Castle, War Council, Courthouse: it trains spies and shoots only spies) · Trade (Market, Trade post, Dock, Store, Mint, Workshop) · Arts (School, Library, Temple, Theatre, Hall, Wonder). Off the menu: Abatis (the players' field-defence cut, Nov 8), Apartment (a Dwelling's raise, on its card), Tree farm (planted from the Lumber camp's card). Opens on Home, Dwelling first, top left. Not yet available: hidden, with a "show all".
- Selecting: tap a villager or soldier: a thick green ring at the feet (the menu ring code). Tap anything: it does that (gather, build, attack a foe or an animal). Tap the ground: it goes there, even if nothing is there. One order, then the selection clears. The floating square over the villager goes.
- Build order: one villager builds first placed, first built (today `nextSite` takes the nearest).
- Woods: walkable for foot and riders (riders slower); siege and wagons never enter. Reuse the ice crossing (modes, the permission gate, the edge cost by depth); default "remembered for this game", never "ask". The slowdown figure still needs a source.
- Look: games start in spring (the grass follows the year; a start in late winter reads straw); the camera opens further out, as v80; a dark fog edge (built with items 4b and 6). Keep v100's trees; bring v80's gold, stone and iron piles.

Proposed, waiting on Albert's yes:
- The quick action (tap open ground, nothing picked): v80's ground strip (root `index.html`, `showStrip`, Build 40), in the kit: Build · **Attack** · More; Attack → ½ · **All** · More; More → ¼ · 5 · 10 · 20 nearest · each squad. The bold box sits under the finger, so three taps in one spot send all. A tap outside closes it (no ✕). Replaces today's Attack + ✕.
- Where the square's Rally and Shelter go (proposed: the Town Center's card); Info and Focus parked.

Still open from N5: Fast and Yard in the Paused card (test builds); the Sound card only while muted.

## Built N9 and the overnight QC (Nov 10, 01:00-, Albert: "Continue your build without me")
- N9: grass pieces one ring beyond the view built ahead in idle time (E895); queue names wrap; your own people under the canopy drawn as a ring (E897, D360 sil, ring); the weather's fog as a sheet that pools in the hollows (E896, D362 step).
- Build keeps two rows of three on every tab: empty slots fill where locked buildings hide (E898; his Nov 9 note 5). One case left: Show all on a tab with locked ones makes 7 cells, a third row. For Albert: put Show all somewhere else (the tab row? the header?).
- The Guide says how each off-menu building comes (J29): the Apartment raised from a Dwelling's card, the Tree farm planted from a Lumber camp's card, the Depot with the camp wagon, the field defences the Natives'.
- Full test.py run end to end for the first time since N5 (it crashed partway before). Compared rule by rule with N5: no rule broke from N6-N9 code. The four that looked broken (t-pace, t-physics, t-food, t-ledger) were the tests' clocks, set before the year began later in spring (D359).
- Tests brought to Albert's calls: Build tabs and Show all, panel gradient, card heads, guide lines on edges, Welcome back on reopen, fog of war, caltrops and stakes cut, cel shells with no look, the tree height's home.
- Gate rule from the slips: a test that throws is its rule's FAIL and the suite runs on.
- Still failing, all also failing at N5 (old, for a later pass): t-land (home gold and stone sit past the pocket's 300 m from the corner), t-civs and t-kinds (unit figures differ from Mid's by pixels), t-stage, t-wild, t-fire, t-mind, t-realm, t-alarm, t-orders (Choke and the wheel left with the Yard), t-same, t-odds, t-gather, t-walls, t-sight's small-map mark, t-proof (its plant no longer matches menu.js).

## Built N10 (Nov 10, 02:52-, Albert: "Proceed w n10. Go go.")
- N10 as written (colour and season cels in place of the meadow sweep) was held to its own test: hills and states must look right and the code must shrink. It fails both. The states are thresholds per tile (mud past a soak, pools, snow lying first in hollows), and a cel only fades as a whole. The sweep must stay for paths, mud and snow, so cels would add code on top of it. Not built; logged in Parked.
- Measured instead (core value 11: a real problem): the meadow is painted again every ~3.3 s of play (the season's step, and the ruts healing every 10 s). Each repaint took an eighth of the meadow per frame: up to 32 ms in one frame on a desktop, likely 3-5× that on a phone.
- Built: the repaint runs in small strips (1/128) until a tenth of the frame is spent (D.meadow frame 0.1; RAIL, N299; E899). Per frame now 2.6 ms median, 2.9 ms 95th (desktop, headless). Total work the same. Code +1 line.
- Found: the smoke's "known mid-match stutter" was the frame right after a reload (the ground rebuilt, 83-100 ms), not mid-match. Smoke now times the reload's ten seconds apart from the match's; the match check passes.
- For Albert: phone `?test` meter numbers before and after would confirm the phone gain.
- N10b (fresh-eyes review of N10): the land sheet's key held the meadow's strip row, so the whole land (ground, meadow, grass pieces, scars) was painted again at every strip. N10's smaller strips made that worse. The meadow now runs on its own before the land, and the land is painted again once, when the meadow is done (E899). Measured over 30 s of play (desktop, headless): dropped frames (over 20 ms) 62-69 → 18-21; 99th-percentile frame 50 → 33 ms; frames drawn 1,700 → 1,780.

## N17: Albert's N15 notes, answered Nov 10 12:26 (build on his "yes yes") [2026-11-10 12:30]
Answer sheet: claude.ai artifact "N15 Answer Sheet". Each item: his answer, then the idea. [2026-11-10 12:30]
1. Yes. New Game: the white selection ring 1 px bigger so it sits on the pill's edge. [2026-11-10 12:30]
2. Yes. Daily first; on locks everything below, off frees it. [2026-11-10 12:30]
3. Yes. Start's label 14/600; all else 12/400. [2026-11-10 12:30]
4. Yes. First placed, first built: a new site never pulls a builder off an unfinished one; he finishes, then walks to the next (AoE2's build queue). This is the cause of #19/#27/#36. [2026-11-10 12:30]
5. Yes. Torches flicker by real flame flicker (about 1-10 Hz, a few % brightness); the glow follows the flame. Find and cite the source. [2026-11-10 12:30]
6. Yes. Rings on Build and People draw tiny in the top left: `#base .cell.ic svg` sizes the ring svg as an icon; the ring must fill its button. [2026-11-10 12:30]
7. Fix it. Taps depress but don't act: likely the card redrawing (queue clocks) replaces the button under the finger; hold redraws while a pointer is down. Verify first. [2026-11-10 12:30]
8. Albert checks again (units not refunded on cancel). [2026-11-10 12:30]
9. Yes. The foot ring is green from an order until they arrive. [2026-11-10 12:30]
10. Albert: plus works, minus does not; plus takes someone from another job (so it already does a minus there). Make minus act at once: the count drops, the villager drops the load and goes idle. [2026-11-10 12:30]
11. Yes, and the ring at the feet: in the woods a flat ghost silhouette in the side's colour, not the drawn unit, plus the foot ring. [2026-11-10 12:30]
12. Yes. At night two or more working or standing together set a campfire (the campfire light), out at dawn. [2026-11-10 12:30]
13. Yes. The shortfall colour red → white → green as Base and Mid: compare with their code and match. [2026-11-10 12:30]
14. Both must show: the queue's ring and the gold outline of the Train and Research sections; "there should be enough room, it was designed carefully". [2026-11-10 12:30]
15. Lightning: Base and Mid had good lightning; make it better, louder, brighter and more startling. Read their code first. [2026-11-10 12:30]
16. Villagers twitch when gathering together: find the cause first. [2026-11-10 12:30]
17. Yes. "Build another" only on repeatable buildings (a Repeat tick on shells): farm, tree farm, mint, quarry, mill, lumber, mining camp, dwelling, foundry, walls, towers. [2026-11-10 12:30]
18. Not in all cases: find the locked techs that don't say why (age or other) and make every one say it. [2026-11-10 12:30]

## Built N17 (Nov 10, 12:38-, Albert: "Build N17 yes yes") [2026-11-10 14:30]
Preview: `frankenstein-refresh/preview-n17/`. Gate PASS, smoke 6/6 (the match smooth check passes too), new rule t-n17 holds. [2026-11-10 14:30]
- #1 New Game's selection ring 1 px out, on the pill's edge. #2 Daily first; on locks everything below it (civ, difficulty, length, scenario, fog, dangers). #3 Start 14/600, every other line on the sheet 12/400. [2026-11-10 14:30]
- #4 First placed, first built (E945): a site placed with a busy builder picked joins his list; he finishes, then walks to the next. Verified headless: he stays on the first, then goes to the second. [2026-11-10 14:30]
- #5 Torch flicker by the real puffing rate, f = 1.5 ÷ √D (Cetegen and Ahmed, via Xia and Zhang, arXiv 1803.10400; QCV): about 5 Hz for an 8 cm torch head, the glow swinging 4%, on the wall clock. [2026-11-10 14:30]
- #6 Rings on Build and People fill their buttons (the icon rule no longer sizes the ring). [2026-11-10 14:30]
- #7 Dead taps: verified first (a tap held 0.4 s or more on Train did nothing; the card's clocks redrew the button under the finger). Menus now hold their redraw while a finger is on a button. Verified: held 0.05, 0.4 and 1.2 s all train. [2026-11-10 14:30]
- #8 Not touched: Albert checks (units not refunded on cancel). [2026-11-10 14:30]
- #9 The foot ring is green from an order until the walk ends. #10 Minus acts at once: the count drops, the villager drops the load and stands idle. #11 In the woods: a flat ghost in your colour plus the foot ring. [2026-11-10 14:30]
- #12 Campfires after dark where two or more of a side stand or work within 3.5 m (the edge of Hall's social distance, N312); out at dawn. #13 Cost line on Base's ramp: red at nothing, white as you near it, light green (0.55) once you can pay. [2026-11-10 14:30]
- #14 Town Center: the queue moved inside the gold frame, so the Town tab joins the frame and the queue's ring and the gold outline both show (+7 px). [2026-11-10 14:30]
- #15 Lightning (read Base and Mid first; v100 had Mid's): each flash is 3-5 return strokes 60 ms apart (CIGRÉ TB 549), each re-lighting the bolt and the sky; wider, brighter bolt; the near white-out up to 0.9; on the wall clock (at ×3 it was a third as long); thunder's crack, rumble and roll louder and longer; the strike buzz 80 ms. [2026-11-10 14:30]
- #16 Twitch, cause found: neighbours' gather spots sit closer than a person's room, so each frame the push moved them and the walk back returned them. Fixed at the rule: spots now keep the full 3 ft (OSHA 1910.142(b)(3), N166), no exception in the push. Measured: moving while gathering 5.3% of frames → 0.4%, back-and-forth 13 → 0. [2026-11-10 14:30]
- #17 Repeat tick on the twelve repeatable buildings; only they offer the next one beside the last. #18 Every locked research says why on its button (age, the step before, busy, full, its building); only the purse shows the shortfall. [2026-11-10 14:30]


### N17 values lines (the 12 core values, per item; ✓ all unless named) [2026-11-10 15:20]
- #1 ring on pill edge ✓ (9 source: design, your call). #2 Daily first, locks all ✓ (9: design). #3 Start 14/600 ✓ (9: design; 12 saves code: setup spans now one book row). [2026-11-10 15:20]
- #4 first placed, first built ✓ (3 real-life: AoE2's build queue; 12: one list, no new loop). #5 torch flicker ✓ (4/9: QCV, N309; the 8 cm head is design). #6 rings fill ✓ (12: one selector). [2026-11-10 15:20]
- #7 held taps ✓ (11 solves a real problem, verified first). #9 green foot ring ✓ (9: design). #10 minus at once ✓ (12: shorter than before). #11 woods ghost ✓ (9: design). [2026-11-10 15:20]
- #12 campfires ✓ (9: Hall's social distance, N312). #13 cost ramp ✓ (one home with Base and Mid, N308). #14 queue in frame ✓ (12: no new rule). [2026-11-10 15:20]
- #15 lightning ✓ (4/9: CIGRÉ TB 549, N310; brightness and loudness are design). #16 twitch ✓ (2 our rules: fixed at OSHA 3 ft, N166; 12: one condition, the patch removed). #17 Repeat tick ✓ (ECS: a tick on shells). #18 locked reasons ✓ (12: one label rule). [2026-11-10 15:20]

### N17 audit (Albert, Nov 10 13:29 "yes yes") [2026-11-10 15:20]
- Twitch fixed at the rule (spots keep the full 3 ft), exception removed. Lakes keep off the trade stops (t-trade 8/8). t-match records your louder thunder. Numbers moved to books (lightning drawing, foot ring, New Game rows, clock, colour mix). Inline font moved to the stylesheet. [2026-11-10 15:20]
- New tests for the builds that had none: t-ground (N11–N14), t-n15, t-n16. t-n15 confirms a queued unit taken out is paid back in full (your #8). [2026-11-10 15:20]
- Sealed N11–N17 on n11 (not published to live). From here: one build, one permit, 10 changes max. [2026-11-10 15:20]
