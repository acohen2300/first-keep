# Next build list (started Nov 9, 2026)

Items agreed in talk mode, to build on Albert's go. Newest last.

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
