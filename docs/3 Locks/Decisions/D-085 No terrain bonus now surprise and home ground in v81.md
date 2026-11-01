# D-085 No terrain bonus now surprise and home ground in v81 [2026-11-01 11:55]

- Date: 2026-11-01 11:22 [2026-11-01 11:55]
- Status: locked; removes the flat ×1.3 ambush; supersedes D-071's ambush rule [2026-11-01 11:55]
- Albert's words: "Yes (after: The bonus should apply though conditionally because if it's not a surprise ambush whats the advantage then … Can you try to find real math for this)" [2026-11-01 11:55]
- The rule: No terrain or ambush bonus for anyone now. In v81, two rules for every side: surprise (an attacker unseen by its target gets ×1.1 to ×2.2, fading by a third per step) and home-ground movement (locals keep road speed on their own ground; outsiders move cross-country at about 60%). [2026-11-01 11:55]
- Its source: Dupuy's surprise values via The Dupuy Institute, 'The Combat Value of Surprise' (2018; Dupuy's judgment, not validated); ATP 3-21.18 (4 km/h with rests, road); FM 21-18 cross-country about 2.4 km/h (from memory, to open before building). [2026-11-01 11:55]
- Its code home: the wild build (branch wild81): `08-core.js` (isFoe), `38-natives.js`, `37-events.js`, `17-ai.js`. [2026-11-01 11:55]
