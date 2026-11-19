# Traces of his n71 play notes (Nov 18, 2026) — causes only, nothing changed

Each run: `python3 "docs/4 Now/tools/probe.py" <v100 dir> "docs/4 Now/tools/<file>.js" 20261105`. Run on N73's code.

## 1. "They don't hold when commanded" — PROVEN (`hold.js`)
- 20 Spearmen told to Hold; 6 enemy archers 8 tiles off. At once all 20 are on `fight`; by 15 s every one is more than 3 tiles from his post (the farthest 13). After the fight 16 go back to `hold`, 4 stay on `march` for good, 6 end more than 3 tiles from their post.
- So Hold today means "stand until a foe is seen, then chase". Nothing keeps a holder on his spot. Where: holdP sets `job: 'hold'` (menu.js:118); the fight takes any soldier who sees a foe (combat.js; the line that takes a holder not traced to a number).

## 2. "Many run from few" — the cause is in the numbers; not seen in a small fight (`nerve.js`)
- Nerve (combat.js:113 to 120; D.nerve): each comrade who dies near costs every soldier near 1 / (breakAt × (near + 1)) of his nerve (combat.js:66; breakAt 0.3). In a group of 20 that is 0.16 a death: six or seven dead and all twenty rout, whoever is winning. Nerve comes back only with no target (combat.js:117), and a kill gives 0.04.
- Being outnumbered 1.5 to 1 also drains it (0.02 a second); outnumbering the foe gives nothing back.
- Run: 20 holding Spearmen against 10 archers: all 10 archers dead, 3 of mine dead, lowest nerve 0.49, nobody routed. So twenty do not run from five in the open; they would with about six dead near them (towers, a castle, elephants, engines).
- Real-life anchor: units did break near 30% losses, but while losing. The model has no "we are winning" term.

## 3. "A food villager stuck for a moment turns into the idle counter" — PROVEN in code
- `idleU = isIdle(u) || u.job === 'wait'` (econ.js:124), and the Idle box counts `idlers` = no job and idleU. A gatherer is put on `wait` for about 2 s (D.search.again) when her find has no free spot or she has no way to a drop-off (econ.js:150, 172), and `jobOf` reads only gather, carry and walk (econ.js:123): so she counts as idle until she finds a spot.
- Not N71's doing: N71 made the box and the tip read the same law; `wait` was in it before.

## 4. "When there are a lot of people they get confused or blocked… divide into two plots they gather much faster" — PART seen (`crowd.js`)
- A find holds a set number of villagers (D.forage.hold: bush 2, tree 4, gold 4, stone 3, iron 3, fish 2; a farm 1). Past that they are pushed to the next find or wait (3 above).
- 36 on one berry plot of 15 bushes (13 tiles from the Town Center): 1,614 food in 3 minutes, 45 a head; 12 on the same plot: 658, 55 a head. So a crowd costs about 18% a head here, and 25 to 28 of the 36 are walking at any moment: the walk to the drop-off is the larger loss.
- Not reproduced: his log's 28 villagers on `wait` at minute 17 (19 at 21, 17 at 30). Cause not found.

## 5. "A weird way the game is counting villagers and units and population" — NOT traced: needs his example
- What the code does: people = every unit of his, soldiers too, plus everyone queued (econ.js:35); room = Town Center 10, House 5, Apartment 20, never past 180 (D.popMax; econ.js:37). The Score page's "People" and "Army" rows are points, not heads.
- The computer with 148 villagers was at the 180 limit with its soldiers; he peaked at 65 villagers and 48 soldiers (113).

## 6. The full suite on N72 (frozen copy): 62 of 90 hold (N71: 62 of 89)
- No new failure. t-a1 and t-n60 were red in the run and pass alone (t-n60 fails about one run in three: known); t-p2 was green.
- Still red, the 26 of N71's list less t-p2, not traced: t-civs, t-fire, t-food, t-gather, t-kinds, t-land, t-mind, t-n17, t-n24b, t-n27, t-n29, t-n30, t-n42, t-odds, t-orders, t-peace, t-physics, t-realm, t-research, t-same, t-sight, t-stage, t-trade, t-walls, t-war, t-wild.
