# Cards Notes - v80 - Post Clean - Working
*The cards builder, Nov 1, 2026 (Albert's double yes, 01:17). Branch `cards80` from main 38001b9. Preview only; not pushed, not published.*

## What was built
1. **Type, whole game.** Two text sizes, 12 and 18 (`--fs-s`, `--fs-l`; `--fs-m` is gone). Every 15 is 12; titles, Start and the › are 18. Two fonts: IM Fell English SC for titles, Barlow Semi Condensed for everything else, the map included (the phone's own font on three map labels is gone). Barlow at one weight, 600, set once on the body (**MAYBE**, as Albert said); quiet lines are told apart by Cream 2. One Barlow file (`src/fonts/barlow.woff`, the old 600 file; the 500 and 700 files are cut). Map labels: one helper, `mapFont`, and one scale, `labelK` (24-view-overlays): a label scales whole with its pill and icon, 12 at the starting zoom (`ZOOM_START` 1.3, its one home in 01-rules-basics), larger zoomed in, 9 the floor; the edge arrows and the crosshair's reference are pinned at 12. Applies to the research badge (count and tab), the idle z, the wonder's clock, the overlay tags and the arrival countdown.
2. **Setup stacked.** Each setting its own rank: its name quiet (Cream 2, 12) in the slots its choices leave on the left, its choices one selector, right-justified, a slot a choice. Then the peoples (one selector), their soldier and bonus (an info rank), Daily (Off · On), the hazards (one bar, each ringed when on), Start.
3. **The controls,** built once in `27-cards-core` with their CSS: `choice` (a bar; with `one` it is the selector, its gold ring sliding 0.4 s to rest over the choice; corners 6), `lab` (a setting's name), `slt` (the slider with its switch). Only the pieces the cards use. No round pill.
4. **Relations, final.** Town | Relations tabs, the folder round the open page. One rank a side: the name over its stance word in its colour · the gift, a slider with its switch, snapping to 50 · the stance, three icons in two slots (sword red, scales white, handshake green) · the row's ✓. What is picked waits on the card until that row's ✓ sends it; the last rank says what the last ✓ touched will do, and the board (peace, the Games, the Natives' regard). A friend's gift is locked. Words: friend, neutral, foe (`REL_WORD`). The vassal's Demand rank keeps its 44 ("300/1200" on one line): EXCEPTIONS #12 and the gate's skip for it are gone.
5. **Market:** no v80 drawing, so v70's layout is kept. The type rules apply; the good picker is the selector (seven goods in one shape, six slots wide, each part 50 pt or more). It now stands on the shared building page (E11), so it has its info rank and Send help.
6. **Cards fixes.** E1 the Army card's Train fold is a list (no commas). E2 a workshop counts what it made on the building (`b.made`), and its ring reads the same. E3/N13 Mail: six lines a page, a rank each, Previous and Next, five pages for the 30 kept, nothing scrolls. E4 a find under the fog cannot be tapped. E5 one `dropDrag()` lets go of the box, the crosshair's glow and the edge on a pinch and a cancel. E6 a dim Train button says why ("line full"), never the cost as payable. E7 the pause is decided each time what the card shows changes (`cardPause`): the Relations tab pauses whichever way you came, the Town tab carries on. E8 the gate opens Relations, Research, every milestone and the Army card with Battalions; what those showed is fixed (below). E9 fixed-column ranks with holes are lists (squad pickers, Orders go to, Here, the dials, Help's seven, the Guide's seven tabs, the council's squads, the levy), single buttons take the whole rank, the 1.5-slot cells (`s15`, the building info rank) are whole slots. E10 Relations (4). E11 the Market (5). Cold review: friend, neutral, foe; Emergency a slot (58 at 390) on the cycle button's rank, its word under its icon; a locked place in the line names its research ("+1 Records", "+2 Guilds"); one steel panel holds the row and the cycle button's rank.
7. **What E8 showed, fixed:** a locked research step said "Needs a lumber camp · Lumber camp" and grew its rank: it now says what it lacks ("no lumber camp") and its › goes to the building; a ready step names its building short ("· Town"); a Train button with no building says "no siege workshop"; milestones are slots (they were 22-tall chips), two a rank; the Army card with Battalions needs 11 ranks, so it takes the full height (`FULL`).

## Each picture against the build
| Picture | Matched? |
|---|---|
| Setup Stacked with Names | Yes, at 390 and 375 (375 scrolls, as EXCEPTIONS #3 allows). Differences: words without the stand-in icons (the pictures say icons are stand-ins; the icon pass is owed); Fog and Daily are Off · On (decision 2); no thin dividers inside a selector (the Selector picture has none); the Legionary line is an info rank. |
| Setup Stacked | Superseded by the one with names (the list asks for names in slot 1). |
| Setup New Rules, Setup Singles | Earlier drafts; not built (the list chose stacked). |
| Control Sheet 1 and 2 | Built only what the cards use: the selector (5), the bar, the slider with its switch (4). Not built (no card uses them yet): check boxes, the toggles (one slot, two ranks), the sliders alone and their variants, the pairs, one border. |
| Check Box Toggle Slider | The slider part, inside the slider with its switch. Check box and toggle: not used. |
| Slider with Toggle | Yes: word, value and switch over the track, gold to the knob; off goes quiet and keeps the value; on rings the control gold. |
| Selector | Yes, "on the grid: corners 6", the ring sliding 0.4 s. The pill is not built. |
| Toggle One Slot, Toggle Two Ranks, Slider Two Ranks and Variants, One Border per Control | Not used by a card; not built. |
| Stance Icons in Two Slots | Yes, sword · scales · handshake (not the dove), Lucide line icons. |
| Relations Final | Yes except the ✓ is one per row (decision 1), so the name takes one slot and the civ ("Mali") moved to the book; the ✓ is a blue ring when ready, not the gold fill. |
| Relations on the Control Sheet, Relations with Gift Slider | The options that led to Final; Final was built. |
| Research Badge Three Ways | Built as the list says: the badge scales whole, 12 at the start, 9 the floor. |
| The 19s (two pictures), Words 12 Against 15 | Yes: every 19 is 18 or 12, every 15 is 12. |
| Weights A and B, Weights Pick, Start 900 Against 600 | 600 for all of Barlow (MAYBE). |

## Decisions for Albert
1. **Relations, a ✓ per row (decision 3) against the picture's one ✓.** The row is name (1 slot) · gift (2) · stance (2) · ✓ (1). The name's slot holds the name and its stance word; the civ moved to the book. The ✓ is a blue ring when its row can be sent (several rows may be ready, and a card has one gold fill at most).
2. **Setup's open items (Build List).** Fog and Daily are two-choice settings like the rest (Off · On), so each says its word once, in its name; Daily's name carries its level ("Daily · level 10"). The peoples and the hazards stay full rows with no name, as drawn: what they are is plain.
3. **A stance picked but not sent (Needs Albert's call #3):** the gold ring moves to the picked icon; the word under the name keeps the stance held now, in its colour; the row's ✓ turns blue; the last rank says what it will do.
4. **Gifts to rivals: not built.** The picture shows 100g to the Raiders, but the game has no gift to a computer side (a sim rule, not a card), so a rival's gift is dim "—" ("Gifts go to the Natives only"), as v70 had it. A friend's gift is locked (the Natives as friends). Say if a bribe to rivals should be a rule.
5. **The gift slider runs 0 to 300, snapping to 50** (`NATIVE.giftMax`, `giftStep`; v70's two gifts were 100 and 300).
6. **Kept on Relations though not in the picture:** Stand down and the ransoms, under the last rank, only when they apply. The board paragraph and the prisoners you hold went to the book.
7. **Setup's whys, the people's history and the copyright line** are in the book now (the picture has none of them on the face).
8. **The tabs lost their sub-lines** ("train and tech", "ally, neutral, hostile"), as the picture draws them.
9. **The Market** gains its info rank (caravans, health, age) and Caravan has its own rank: the shared page (E11).
10. **The Army card takes the full height** (E8: 11 ranks with Battalions).
11. **"no lumber camp" instead of "Needs a lumber camp · Lumber camp"** on Research and "no siege workshop" on Train: the old text grew the rank at 375.
12. **The switch inside a control keeps its round ends,** as every control picture draws it; the killed pill is the selector's.
13. **Mail lines longer than a row end in …** (a rank never grows); every message fits the preview at 375 already, and the mail row is wider.
14. **Barlow at 600 is MAYBE**, as Albert said.

## Rules bent (named)
- **EXCEPTIONS #13 (new, for Albert's yes):** a part inside a control may be under 44 pt: the slider with its switch is two halves 22 tall; the stance's three icons share two slots (40 pt each at 390). The gate names them (`.hr`, `.thin`).
- **EXCEPTIONS #14 (new; Albert named it in the Relations line):** the stance icons and the stance word wear red, white and green, not Cream 1.
- **EXCEPTIONS #12 removed:** the vassal's Demand rank fits its 44; the gate measures the vassal page like every other.
- Map text keeps its own pigments (EXCEPTIONS #11): the wonder clock's gold and the tag's white are map paint.

## Not done, and why
- E9's raw markup: the line's places (`slotsHTML`), the workshop's making slot, the mail rows, the research › rows (`.trow`, a nested grid), the score table and two text links are still written by hand: each needs a piece the mold does not have (a two-line clamp single, a disabled working slot, a coloured edge). The squad kind grid (`.qs`) too.
- Loose lines on the Army, caravan, stop and research cards (section labels, sentences): not in this list.
- The icon pass (Setup's stand-in icons, the hazards' icons).
- woff2 (a third of the font bytes): brotli is not on this machine.
- The Lucide ISC licence text in `src/fonts/ISC-lucide.txt` is written from memory: check it against lucide.dev before live.

## Size
`first-keep.html` 1,190,299 bytes (main 38001b9) → 1,170,919 (−19,380). Fonts in `src/fonts`: four files, 112,620 bytes → two, 66,596. Source `src/`: 469 lines in, 426 out.

## Draft for CUTS.md
**Cards v80 (branch `cards80`): the type rules, Setup stacked, the controls, Relations final, the Market's picker, the audit's E1 to E11 with N13, the cold review of v70.**

Changes
- Two text sizes, 12 and 18; two fonts; Barlow at one weight, 600 (MAYBE), one file; map labels through `mapFont`, scaled by `labelK` (12 at `ZOOM_START`, floor 9).
- Setup: a rank a setting, name quiet on the left, one selector right-justified; peoples, Daily (Off · On), hazards as bars.
- The controls: `choice` (bar and selector), `lab`, `slt` in `27-cards-core`; a slider's `data-in` verb (33-verbs); the patch keeps a slider's value (27).
- Relations final: `relRow`, `relStatus`, `relHTML` (29); verbs `relwant`, `relgift`, `relon`, `relok`; `REL_WORD` friend, neutral, foe; stance icons from Lucide (`ICON.foe`, `neutral`, `friend`).
- Market on the shared page (`BLD_PAGE.market`, `marketPage`); its size in `SIZE_OF` (one home).
- E1, E2 (`b.made`), E3/N13 (`MSG.page`, `mailp`), E4, E5 (`dropDrag`), E6, E7 (`cardPause`), E8, E9, E11 as above.
- Emergency a slot with its word on the cycle button's rank (`ROW_WORD.emg`); one steel panel for the row and that rank; "+1 Records" (`TECH` short), "+2 Guilds".
- Short names: Bad weather "Weather" (Setup), Record keeping "Records", the Town Center "Town".

Cut
- `src/fonts/barlow-500.woff`, `barlow-700.woff` (the 600 file renamed `barlow.woff`): one weight.
- `--fs-m` and every `font-weight` but the body's 600 and Fell's 400.
- The Setup tick boxes and their CSS (`.tick`, `.tick.daily`), the segmented rows (`seg`, `.seg`, `.segT`, `.seg2`), `.civs`, the civ fold on the face (`civline` and its small-phone rule), the `setup` class on the card, the copyright line on the face (to the book), the one-line `settingsWhy` under the settings (to the book).
- `nativesHTML`, the old `relHTML` rows (Ally/Neutral/Hostile acting at once), the verbs `rel` and `gift`, `NATIVE.gifts` ([100, 300] → `giftMax` 300, `giftStep` 50), the board paragraph on the face (to the book), the tab sub-lines.
- `marketHTML` and the Market's early return in `CARDS.bld`; the Market size case in `renderCard`.
- `.mrows`, `.chips`, `.chip`; the `s15` span; `'end'` in `FULL` (no card); the pause decided in `openCard`.
- EXCEPTIONS #12 and the gate's `name != 'vassal'` skip.
- The words "Hostile", "ally, neutral, hostile", "+1 research".

Tests
- New `tests/cards.py` (in the gate): Setup stacked, Relations final (a ✓ a row, the friend's gift locked, a ✓ sends its row only, the words), Mail pages, the Market selector, E1, E2, E4, E5, E6, E7, E11, the locked place's name, Emergency on the grid, the steel panel, the map label scale, the vassal's Demand rank. Every check fails on main 38001b9 (run with the same exports added to a scratch copy): 24 failures (the vassal check came after that run; its planted bug is caught).
- `tests/palette.py`: 12 and 18 only; two fonts; one weight, 600, once; two font files packed; every map label through `mapFont`; no phone font. Fails on 38001b9.
- `tests/gate.py`: opens Relations, Research, the milestones and the Army card with Battalions (E8); measures every text's size (12 or 18), font and weight on every card at four sizes; a card's line cut short fails; parts of a control (`.hr`, `.thin`) named; the vassal no longer skipped; `data-in`, `slt` and `sym` verbs checked.
- 23 new planted bugs in `tests/handoff.py` (58 in all), each caught.
- Results: build, wrap, lint clean; the gate passes (31 of 31; four sizes, both pages); `tests/handoff.py`: every check passes but "the working tree is clean" before this commit; the play fingerprint matches the baseline (the cards change no simulation; `b.made` is a count nothing reads in play); soak seeds 1, 2, 3 for 20 minutes pass (saves 250 to 258 kB; a frame 8.7 to 52 ms with another builder on the same two CPUs).
