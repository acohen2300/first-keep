# Controller notes, preview 46 [2026-11-03 18:15]

Albert's list of Nov 3 ("yes yes"): People and Town swap, the Map tile to (6, 1), Hide. Builder: the controller only. Cards and the quick action were not touched. [2026-11-03 18:15]

## What was built [2026-11-03 18:15]
- **Swap.** Column 1 is Jobs over People (`peopleCell`, the old `train:vil` tile, same classes and aria). Column 7 is War over Town (the research badge moved with it). The Town page holds Build (2, 1), Research (6, 1), Relations (6, 2). [2026-11-03 18:15]
- **Map tile.** A tile at (6, 1), same size and look as the others, toggles `H.map`. The small map stays the centre 3 x 2. At rest the Food job (tile and its - +) shows at (2, 1) and (2, 2); Iron only on Jobs. Jobs and War (full pages) have no small map and no Map tile. [2026-11-03 18:15]
- **Hide.** One `.fab` button, `#hideB` (shell, one home), right edge, bottom = row height + gap, directly above War, showing a minus; tapped it folds the row (`G.hud.shut`, verb `ctlshut` kept as the one fold verb). Folded, the same button drops to the bottom-right corner (`#hideB.shut`) and shows a plus. `fit()` is unchanged: it measures the empty row, so the map foot runs to the bottom and `--ob` is only the gap. [2026-11-03 18:15]
- `.cardUp .fab{visibility:hidden}` added for the cards builder. Words in `HIDE_WORD` (07-text.js; not in `ROW_WORD`, which the gate measures as slot words); the help text updated. [2026-11-03 18:15]
- Tests: `tests/gate.py` (rest, Town, Map tile position and size, no map on Jobs and War, swap positions, Hide above War and in the corner), `tests/cards.py` needed no edit (it clicks only `mapt` at rest). Plants `p46` in `tests/handoff.py`: People moved out of column 1, Map tile in column 7, Hide with no plus. Three older plants updated to the new code (Build, Map tile, Hide/Close, Town badge). [2026-11-03 18:15]

## What was cut [2026-11-03 18:15]
- The hold on the Map tile that folded the row (`data-hold="ctlshut"`) and the up-arrow fold tile at (7, 2): replaced by the Hide button; the tile was a second home for one job. [2026-11-03 18:15]
- `H.mapOn`, the full-page branch of `mapShown`, the full-page branch of the `mapt` verb, and the Map tile's old place (7, 2): Albert, "In Jobs, no map". Nothing replaced them; `mapShown` is now one line. [2026-11-03 18:15]
- People on the Town page: it lives in column 1 on every page. [2026-11-03 18:15]
- The Map tile on the Town page (see Unsure). [2026-11-03 18:15]

## Decisions for Albert [2026-11-03 18:15]
- The Hide button is a `.fab` (44 wide); the War tile under it is 51 wide, so its left edge is 7 in from War's. Right edges line up. [2026-11-03 18:15]

## Unsure (not acted on beyond the smallest choice) [2026-11-03 18:15]
- **Town page vs Map tile.** Research is kept at (6, 1) as listed, which is also the Map tile's place. I left the Map tile off the Town page; the small map follows `H.map` there as today, so it cannot be toggled while Town is open. Alternative: Research under Build at (2, 2) with the Map tile kept. Needs his word. [2026-11-03 18:15]
- The Hide button is visible on every page, including Jobs and War. The list did not say otherwise. [2026-11-03 18:15]
- `MENU-SPEC.md` section 6 still describes the old layout. Not edited (his rule: change only what is listed); the lead should update it. [2026-11-03 18:15]
- Not run: the four older plants I re-pointed (Build, Map tile, Hide, Town badge); they are in the full handoff. Not verified: 375 x 667, the native build, a real phone, the full gate and the full handoff. [2026-11-03 18:15]

## Draft for CUTS.md [2026-11-03 18:15]
- Controller: People and Town swap (People under Jobs, Town under War); the Map tile moves to (6, 1) and is a tile; the Food job shows at rest beside the map. [2026-11-03 18:15]
- Cut: the per-page map (`H.mapOn`, `mapt` on a full page), the Map tile at (7, 2) with its hold-to-fold, the up-arrow fold tile. Replaced by: Hide (`#hideB`), a minus over War, a plus in the corner when folded. [2026-11-03 18:15]
- Cut: People on the Town page (it moved to column 1). [2026-11-03 18:15]
