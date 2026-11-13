# Day work, Nov 13 (Albert 06:53: research, bump, G2, G5; try H10; G1; G5A; G5B)

## 1. Research: computer economies in the genre
- AoE2's own AI is scripted by gatherer shares (`sn-food-gatherer-percentage`) and builds farms to match. Its top complaints: idle villagers when finds run out ("economic death spiral"), flip-flopping jobs, the whole economy garrisoned when attacked, villager training stopped after harassment, "fake" (cheating) economies.
- What "thriving" means, from player guides: never stop training villagers until about 110-130 of 200, keep 60-80 of the population for the army, near-zero idle time, no resource left floating.

## 2. Who bumps the gatherers (P2-end): found
- Your own villagers walking to and from the bush (and gatherers at a neighbouring find) step inside a gatherer's space; `collide` (`index.html:1151-1159`) then shoves both by their mass.
- The load rule does not cause it. The old rule fails the same check (2-7% moving) when the run skips t-n17's builder steps; t-n17 passed by its set-up, not by the rule.
- Real-world: people walk around someone standing still (social force model). Idea: a gatherer at her spot does not move; the walker takes the whole push. Needs your yes.

## 3. G2: menus against the Slot Kit (report, nothing changed)
- Slots stretch to the screen (56 wide on a 390 phone, not 44); a two-wide cell is 113 in the Town Center's tabs but 117 in its Train row.
- New game: option rows are segmented strips (cells touching, gap 0), not boxes 6 apart; cells 58-60 wide.
- Mail is a narrow card, not the six-slot width.
- The Town Center's title has a coloured underline no other menu has; one cell in the Town Center and Build is 51 tall.
- Fonts all match the type book (IM Fell 18, Barlow 12/400, 12/600, 14/600).
- Probe: `g2-probe.py` (measures every menu's cells, gaps and fonts).

## 4. G5: the tests, one by one
- Fixed and running (G5A, sealed): t-n15 (passes), t-orders, t-war, t-food (its order check is your Nov 11 ruling and fails until built), t-walls (no longer throws).
- Still throws: t-gather (a find's `way` is gone).
- Read so far: t-stage (lantern vs hearth, the shed: stale by N18/N29); t-wild, t-realm (equal-to-Mid: group B); t-mind (its dry test tile is not found on today's map, giving NaN: likely stale); t-sight (2 of 5, as in N22).
- Not read yet: t-trade `stops`, t-alarm `refused`/`told`, t-physics `edge and hours`, t-walls (7 checks), t-same, t-orders (3 checks), t-war (1 check).

## 5. H10, the computers' economy: tried 5 versions, none thriving (held)
50 minutes, no player, two seeds; per side: villagers, idle, hungry samples (of 1,000), army peak.
| Version | Villagers | Hungry | Army | Verdict |
|---|---|---|---|---|
| Today | 21-70 | 23-138 | 7-28 | starves, small |
| v1 famine counts training + idle sent out | 21-79 | 62-130 | 7-41 | small gain |
| v2/v3/v5 food reserve before soldiers | 29-151 | 3-45 | 0-13 | fed, but no army: harmless |
| reserve before villagers | 6-14 | 104-524 | 17-41 | collapse |
| **v4** famine counts training and the army's draw + idle sent out | 38-122 | 22-110 | 11-68 | grows and fights, still hungry |
- Finding: hunger only goes away by starving the army. Food income cannot carry the population, the same as your own Nov 11 game (full farms could not feed the town). That is the food balance (farm yields by history, on The List), not the computer's mind.
- v4 saved as `Held - H10 v4 computer economy.patch`; the probe as `h10-probe.py`.

## 6. G1: done (sealed, `dbcc9fe`)
- 19 menu colours into the Colours book (C38); rings, gold and gunmetal read from their own entries; s2 merged into gunmetal. Gate rule `hues` refuses a typed colour (proven by planting one). Menus pixel-identical (2/255 at most).
- Correction: the night's "26 loose in index.html" was wrong. 2 were (page background and text); the rest is the brushes' own paint, which the book keeps in the art.

## 7. G5B (rulings and outcomes instead of Mid's numbers): not started
