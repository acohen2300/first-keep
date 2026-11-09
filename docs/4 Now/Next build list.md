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
