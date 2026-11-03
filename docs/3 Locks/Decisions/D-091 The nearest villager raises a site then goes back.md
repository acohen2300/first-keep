# D-091 The nearest villager raises a site, then goes back [2026-11-02 09:06]

- Date: 2026-11-02 08:05; yes yes 08:53 [2026-11-02 09:06]
- Status: locked; amends D-089 W4 for placing a building [2026-11-02 09:06]
- Albert's words: "Closest person builds then go back where they were if there is no idle." "Yes yes" (08:53). [2026-11-02 09:06]
- The rule: a building you place takes the nearest idle villager; with none idle, the nearest villager of any kind (a posted one too, never a focused one) raises it, then goes straight back to exactly what it was doing: its job, the very find or building it left, where it was placed (sendBuilder keeps them; backToWork restores them; u.back sends it home at the end instead of starting the new building's work or the next site). The other building orders (a site's +, a field, a repair, a fire) stay idle-only (D-089 W4). [2026-11-02 09:06]
- Real-world check: Age of Empires II sends whoever is nearest (from memory, not opened). [2026-11-02 09:06]
- Code home: `11-orders.js` autoBuilder, sendBuilder; `13-sim-civil.js` backToWork, repairTick. Test: `tests/moves.py` (with nobody idle the nearest raises the house and goes back to its own bush the moment it is done); plants p15. [2026-11-02 09:06]
- Nov 3 (Albert's sighting, 06:09): checked, not changed. The builder of a mine pulled off its work already goes to the gold beside it; the test (`tests/moves.py`) passes with and without the change made in preview 33, so that change was taken out in preview 34. Albert's villager was turned away by the danger map (now said aloud, preview 33). [2026-11-03 09:05]
