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
