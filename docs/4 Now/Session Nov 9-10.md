# Session log, Nov 9 evening to Nov 10 morning (for the next chat)

What this window decided and learned that is not obvious from the code. Read after `Handoff.md`.

## Builds
- N6–N8 (Nov 9 evening): the open list, sheets, cels. N9 (overnight): grass pieces built ahead, queue names wrap, canopy rings, valley fog, Build keeps two rows. Overnight QC: full `test.py` ran end to end for the first time since N5; no rule broke from N6–N9; stale tests brought to his calls.
- N10/N10b: the meadow repaint was the stutter (up to 32 ms a frame); fixed by strips within a tenth of a frame and painting the land once per repaint. Dropped frames 62–69 → 18–21 per 30 s (desktop). The smoke's "mid-match stutter" was the frame after a reload.
- N11 (preview + branch `n11`): the paper ground. See below.

## The ground: Albert's design (Nov 10, 05:41–06:36)
- He asked "exactly how we colour the ground"; there were 13 layers. His design: **four sheets: water, sand, dirt, grass**. Lakes, rivers, streams and marshes are **a cut through the top three**, not built. Flowers and pebbles in a grass layer; one more grass layer (blades); a **season layer** on top.
- The season is **dynamic**: light spring green → emerald → dark green → dull green (fall) → greyer dull green (winter) → back. **Grass is mostly evergreen** (no tan winter).
- **Water fills close to the grass** (lakes are not deep at the rise): a thin dirt lip, a narrow beach. Marsh = shallow water with reeds (not a dry pit).
- **Flowers come up in new places each season/year.** Blades must not shake on zoom. v80's blades (root `index.html`, ~line 15723: a 128 px tile, 260 strokes, two inks, faded in by zoom) were his reference for crisp grass.
- **Snow:** a crisp sheet in six steps, hollows first. Mud and frost: cut for now, back later as steps (Albert: fine). **No cloud shadows** (Albert: no).
- Misfits = the people hazards (placed by the randomizer with everything else).
- Mocks (claude.ai artifacts, private to Albert): the first stack mock (rejected: "doesn't work for me"); the **paper ground mock, version 5, approved ("perfect", "this is good, let's implement")**.
- Research (top RTS games): all use a few base materials (WC3 16, SC2 8), hide repeats by position variants (AoE2 4 per mask), grass detail scattered on top, look kept apart from play (AoE2), snow in steps (0 A.D. 25/50/75/100%), almost none recolour grass by season. Sources in the chat; key ones: openage blendomatic docs, Hive Workshop w3e format, SC2Mapster, Wildfire Games seasons page.

## N11 as built (branch `n11`)
- Strata: wet sand (0–2), sand (2–6), dirt lip (6–10), grass (≥10); hilltops still dirt (item 1 of the open list says make them grass).
- Water sheets by **distance from shore** (chamfer), not depth: depth gave stair-steps.
- Grass is a light neutral; a second sheet (half resolution) holds the grass mask and takes the season colour by multiply, recoloured only when the colour moves a step.
- Blades: the old stroke tile restyled to v80's inks, scale 0.06, faded by zoom (1.1–1.8). Two tiles (192, 139: Cicada Principle) → **one tile** on Albert's "try it without the second tile".
- Hill light + soft patches: one N×N picture. Snow: marching-squares sheet from play's own drift (`snowAt`), six steps. Glints: short strokes on water, per frame. Reeds baked in marsh tiles.
- Cut: the meadow picture and its repaint, `cels.js` and its books. Logged in Parked.

## Albert's feedback on the N11 preview (07:02–07:05)
- "There are many problems": hilltop crosses, blades too dark (rain-like), light blotches like cloud shadow, patchwork seams, cliff wedges, rivers like trenches (open list items 1–7).
- **His locked designs were never built:** controller colours (SN38), Top Info Ribbon (SN39). My slip: the Nov 9 19:30 "one list" left them out. Also: **"we made a sheet with locked colours and menu templates with colours, and new colours, and it's not being used"** → menu.js keeps its own `COL` palette instead of the Colours book; crimson R4 never added (items 10–14).

## Lessons (gate rules or habits)
- Code comments are bare E-codes; words go in the comments book (the gate enforces it).
- A `//` comment inserted mid-line swallows the rest of the line: put E-codes at line ends.
- Top-level code in index.html runs before `ONE`/`ZERO` exist: use `D.count.one` there.
- A test that throws no longer stops the suite (test.py).
- Always check every locked design list against the code before saying "the list".
