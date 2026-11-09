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
