# D-076 Relations: a picked stance shows "Foe → Neutral" until ✓ sends it [2026-11-01 08:17]

- Date: 2026-11-01 08:16 (decided Oct 31, reconfirmed Nov 1, 08:16) [2026-11-01 08:17]
- Status: locked; answers the open question "Relations: how a stance looks once picked but not yet sent with ✓" (`docs/4 Now/Parked.md`) [2026-11-01 08:17]
- Albert's words: not recorded word for word; passed on by the coordinating session as decided Oct 31 and reconfirmed Nov 1, 08:16 [2026-11-01 08:17]
- The rule: once a stance is picked and before the row's ✓ sends it, the quiet line under the side's name reads the change, old to new, for example "Foe → Neutral". The ✓ sends it and the line goes back to the stance. [2026-11-01 08:17]
- Its source: none (a screen rule). Nearest principle: show a pending change before it is committed (as D-003's error prevention for hard-to-undo actions). [2026-11-01 08:17]
- Its code home: the Relations rows in `29-card-pages.js` (the stance line under the name); `G.relPick` holds the pick until ✓. [2026-11-01 08:17]
- Design: `docs/3 Locks/Designs/02 Relations.md`. [2026-11-01 08:17]
