# D-086 Famine only when no food is in reach [2026-11-01 11:55]

- Date: 2026-11-01 11:32 [2026-11-01 11:55]
- Status: locked [2026-11-01 11:55]
- Albert's words: "Yes (after: Don't forget they have water. And true famine is only if there are no farms or berries. We are tracking storage not personal eating though … we can flash a message)" [2026-11-01 11:55]
- The rule: An empty store is not a famine: villagers eat at the bush, farm, fish or game they work. True famine is an empty store and no reachable food source: then 2 game days at full strength, then weakening, then a trickle leaves (one every 30 s). The computers watch a food runway (store ÷ net burn) and move workers to food early. Toasts: 'Food stores empty: put villagers on food.' and 'Famine: no food in reach. Two days to recover.' [2026-11-01 11:55]
- Its source: the rule of threes (general knowledge); Keys et al. 1950 for the weakening (to open before building); the reorder point (inventory management). [2026-11-01 11:55]
- Its code home: the wild build (branch wild81): `08-core.js` (isFoe), `38-natives.js`, `37-events.js`, `17-ai.js`. [2026-11-01 11:55]
