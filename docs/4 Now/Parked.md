# Parked: every idea kept for later [2026-11-01 07:45]

One list of every parked idea, cut idea to review, and question not yet decided, each with its source. Nothing goes away until it is solved or Albert removes it (RULES §1). A new parked idea is added here in the build that parks it. [2026-11-01 07:45]

## Parked since the v80 audit [2026-11-01 07:45]

- Conversion past the army cap: Albert's idea of up to 2% over, against the crowding idea (over the room raises sickness by density). Source: D-069 (Nov 1, answer 11). On the v81 list. [2026-11-01 07:45]
- The research table rewrite (6), locks (7a), CSP (7b). Source: D-009. [2026-11-01 07:45]
- Regard scaled inverse to score, B = 45 + 20 x (1 - score / leader's score), as a later test. Source: D-004. [2026-11-01 07:45]
- Usage spend (N17): on the to-do list, not decided. Source: D-042. [2026-11-01 07:45]
- Albert's idea of the misfits' special rules (outlaws, bandits, robbers): v80 copies the Natives' flow for now. Source: D-058. On the v81 list. [2026-11-01 07:45]

- **App Store path** (parked by Albert, Nov 1, 09:10; from two outside reviews, Argon, Nov 1, checked). For the app build: iOS can purge localStorage when storage is low, so an app build needs native storage (Capacitor Preferences); external links through SFSafariViewController; suspend audio when the app is in the background; gate the test harness out of production; Game Center for milestones and the daily challenge; Apple's guideline 4.2 on wrapped websites; pricing: free to try plus a one-time unlock; no data collected. Their market and revenue figures had no sources and are not kept. See `docs/4 Now/App prep.md`. [2026-11-01 09:10]

## Needs Albert's call now (it touches v70)
1. Mail has no door once the Realm page goes: the Realm page's Mail tile was its only way in. Where does Mail open from? On the v81 list (D-080, Nov 1, 09:10): the status strip's clock, or Mail and Milestones rows on Help or Score; Albert decides after playing the coming preview. [2026-11-01 09:10]
2. The status strip: Gunpowder does not fit the age cell. The ballot's change (the People icon back, age and people three cells each) was refused by the tap-size check: the other cells fell to 40 pt at 375.
3. Relations: how a stance looks once picked but not yet sent with ✓. Settled: "Foe → Neutral" under the name until ✓ sends it (D-076, Nov 1, 08:16). [2026-11-01 08:17]
4. Whether v70 goes live (live is the Oct 28 build).
## Not decided yet
10. The computers: the economy fix (V24, tested on 62, parked); fog for the computers (V25).
11. Scoring: what the war crown counts (V26), what the wealth crown counts (V27), the score as the crowns (V28).
12. A save kept twice (V16): in the game since Build 63, never voted.
13. Squad ★ best (parked to review; Albert asked for its logic and math).
14. Albert's ideas of Oct 30: free ages; the win as the most money and villagers at a set time.
15. Teaching: "this game needs hand holding"; Setup and the first minutes do not lead yet.
16. Setup and the full Research list, redrawn on the Formation.
17. The drafts in use (Albert's notes so far): the Build menu "too heavy", Town "not flowing"; also Market, Villager, Stores, the buildings, Mail, Emergency.
18. The quick action on your own unit or building (only empty ground and an enemy or hazard are drawn).
19. The icon pass: the line set shown Oct 31 (Lucide, its licence file) and the five icons not drawn: foot, archer, rider, siege, the sky and seasons.
20. A smaller file: compact at build time, trim the fonts to what the game uses.
21. The map: the citadel's gates two squares wide (its walls sit half a square off centre); rivers 2.3 a map, not 4; the Town Center's plan counts fish without a dock; the harness and fingerprint draw hazards per seed; a carried "New land" game does not name its hazards; berry pockets walled in by forest (before Build 70 too).
22. Albert's idea: lock the clean systems so a build does not review or touch them.

## From the notebook (Oct 30, on no list until Oct 31; `docs/6 Records/v70 Record/Notebook`) [2026-11-01 07:45]
24. "Isolate the slow Problems. We should have similar code from the Probability Reinforcement math." (page 13)
25. A kind of foe as a squad's priority: "or Take down Buildings or Knights". (page 13)
26. "RSS ↓ Corner & Map. Talked abot." What was talked about is not written anywhere: Albert to say. (page 14)
27. "Bonus thing. Visual tie in to the Milestones." (page 14)
28. Marks with no words, for Albert to say what they mean: screenshots 1, 4, 11, 12 and 15; page 3's "Is that the job file? Moved?" and "Function in control →".
29. Page 8: the job icon "shouldnt be a word"; v70 puts a word under the cycle button.

## From the cold review of v70 (Oct 31; nothing breaks play; `docs/6 Records/v70 Record/Cold Review`) [2026-11-01 07:45]
30. The steel War and Train panel stops under the cycle button; the pictures draw one panel holding the button and both ranks.
31. The Emergency button is off the grid: 44 wide where a slot is 58, a rank above the cycle button, no word under it.
32. The Town Center's Relations tab says "ally, neutral, hostile"; agreed: "friend, neutral, foe".
33. A locked place in the line says "+1 research"; the picture names it ("+2 Guilds").
34. The squad card's four soldier kinds are quarter-width boxes, as its picture draws them, against the six-slot grid: Albert to choose. Cancel and Save lack their ✕ and ✓.
35. A "ready" cell in the status strip breathes; only danger moves.
36. The quick action's sword is solid (the outline was chosen); the War squads use three figures, not a shield: the icon pass.

## Parked in CUTS (copied word for word; CUTS keeps them too) [2026-11-01 07:45]

### `docs/5 Builds/v70/CUTS.md`, Held for later, line 43 to 52 [2026-11-01 07:45]
## Held for later
- **Gunpowder** and a fifth age.
- **Ships and naval units.**
- **Iron as a fifth resource.**
- **Music** (sound effects and ambience are in).
- **Palisade, moat, boiling oil.**
- **Defend stance** (Hold ground is in), **per-battalion rally point**, **tutorial**.
- **Courthouse treaty tie-in** and **spoiling stockpiles**.
- **Computers using take-down and repair.**

### `docs/5 Builds/v70/CUTS.md`, Held for later, line 55 to 57 [2026-11-01 07:45]
- **Replays (parked by Albert, Oct 27):** record your orders by tick and replay the match. When it comes back: a scrubber and high speed; replay only what you see (your kingdom) at first, others later. Needs the computers' choices checked for determinism.
- **Declined by Albert:** drawn formations (drag a line for units to fill) and a map and scenario editor.

### `docs/5 Builds/v70/CUTS.md`, Build 26 (win choices, villager card, research you can see, buildings that grow), line 129 [2026-11-01 07:45]
- **Not done:** the Train and Research tabs I first proposed: you already tap the building, and a second way in would be a second thing to learn. **Theatrics** is parked until you pick from a list.

### `docs/5 Builds/v70/CUTS.md`, Build 23 (the forest), line 158 [2026-11-01 07:45]
- **Parked:** biomes (forest, desert, arctic maps).

### `docs/5 Builds/v70/CUTS.md`, Build 22 (from SoRen: lean, phone-ready), line 169 [2026-11-01 07:45]
- **Parked:** a screen-reader layer (SoRen has one); clouds, sky and other weather (not seen from above).

### `docs/5 Builds/v70/CUTS.md`, Still waiting for Albert's yes (Build 20: forest), line 207 to 208 [2026-11-01 07:45]
## Still waiting for Albert's yes (Build 20: forest)
- Dense forest of cuttable trees with winding paths, box-select trees, landscape layout.

### `docs/5 Builds/v70/CUTS.md`, Build 37: the rebuild (Oct 27, 2026), line 338 to 342 [2026-11-01 07:45]
### Parked (ideas from the review, not built)
- **An event bus** between the game and the screen (the sim calls `say`, `sfx`, `celebrate` in about 87 places). `say()` already is the one door; a bus would move 87 lines for no change the player sees. Revisit if the screen is ever rebuilt again.
- **Stripping the test hook from the App Store build.** The gate measures the native page through it, so it stays. On an iPhone no player reaches a console.
- **Saving only the node amounts** and regenerating the map from its seed. The save is a third the size now (trees as five numbers, hundredths); the rest can wait.
- **Rewriting git history** to purge the session log: needs a force-push; asked separately.

### `docs/5 Builds/v70/CUTS.md`, Build 38: Albert's first long play, three Argon reviews (Oct 28, 2026), line 360 to 361 [2026-11-01 07:45]
### Parked (Albert, Oct 28)
- **Higher caps: 80 villagers and 120 soldiers per side** (today 60 and 90). Parked by Albert. Before raising them: a speed pass on the soldiers' foe search and an 800-unit test run on his phone; a 700-unit battle already uses about 22 of the 33 ms a step has at phone speed.

### `docs/5 Builds/v70/CUTS.md`, Build 40, stage 4b — the tree from history, the ground, Teach, line 443 [2026-11-01 07:45]
Parked: old text still has apostrophes (a sweep for stage 5 or later); region fill treats flood water as solid for everyone, so a levee side wades it only on short routes.

### `docs/5 Builds/v70/CUTS.md`, Build 45 preview (not live), line 550 to 554 [2026-11-01 07:45]
### Parked after Build 45 (build once the numbers hold)
- Gold upkeep per soldier.
- Land resources that run down.
- Merging battalions with missions.
- Charters (East India Company style) and named Silk Road routes.

### `docs/5 Builds/v70/CUTS.md`, Build 54 preview (not live): the climate, line 653 to 654 [2026-11-01 07:45]
### Parked after Build 54
- **Locusts** (cut on Albert's word, Oct 29): a swarm that crossed the map and stripped the fields under it for 90 s. Code last in Build 53's `37-events.js` (`EV.locusts`), `EVENTS.locusts`, `EV_TEXT.locusts`, the `buzz` sound. Brings it back: a want for a crop hazard that is not weather.

### `docs/5 Builds/v70/CUTS.md`, Build 61 preview (not live): the second list, line 784 [2026-11-01 07:45]
- **Parked**: a Warehouse / Stores view (27).

### `docs/5 Builds/v70/CUTS.md`, Build 62 preview (not live): the equations, the ground, the lean pass, the audit, line 807 [2026-11-01 07:45]
- Ice is one thickness for all water (one air temperature). A frozen crossing is parked with its own list (it is a rule change: the Fortress's lake is its wall).

### `docs/5 Builds/v70/CUTS.md`, Build 62 preview (not live): the equations, the ground, the lean pass, the audit, line 821 to 822 [2026-11-01 07:45]
- Fonts: already subset (226 and 103 glyphs); woff2 would take about a third but needs brotli, not on this machine today. Parked.
- Measured, not built: comments and indentation are 20% of the source (197 kB); a name-keeping minifier would take about 35% of the shipped file. Parked for Albert's word (stack traces would point at columns).

### `docs/5 Builds/v70/CUTS.md`, Build 70 mockup (preview, Oct 30 evening): Build 62's controls back on Build 66, line 934 [2026-11-01 07:45]
- **Cut, review for later:** the door under People (Albert: no); the Realm page (no); pictures and ★ pins on the Build menu (no; the Build page keeps its pictures).

## The clearing against the human's economy (Albert, Nov 1, "why it's so hard to get food") [2026-11-02 00:10]
- Settled by D-090 (Nov 2): the home finds are back inside the clearing, each the same walk in every corner; food at minute 8 on seed 1 with the same plain play 689 (v70 633, preview 12 430). [2026-11-02 07:45]
- Measured (preview 12, seed 1, the same simple policy): v70's nearest bush 147 from the Town Center, 24 food per villager-minute, 633 food at minute 8; preview 12's nearest bush 251, 14 per villager-minute, 430 at minute 8. The walk doubled (10 food a trip, 500 round). Cause: HOME.clear is set from the computers' wall ring (WALL_R 190 + a square's diagonal + 2 lanes = 230), so the human's economy is sized by the computers' wall; the computers got a mill and a farm for it (EXCEPTIONS #16), the player nothing. Zone 1 (BACK.on) does not help: its bushes also obey the clearing (275 on seed 1). Options for Albert: the player gets what the computers got (a mill at start); or the clearing shrinks and the wall ring with it; or leave it and teach the mill. [2026-11-02 00:10]

## O5 and O6 from the parts map (Nov 2) [2026-11-02 10:41]
- O5, the messages' one home: 85 plain, 95 with names or numbers filled in; moving them all makes 95 small functions. Albert's call: keep them where they fire, or move all. [2026-11-02 10:41]
- O6, the card mold's missing parts: the mail row (`mr`), the queue slot (`slot`), the link (`lnk`), the HUD cell (`cell`). To be drawn with the Formation (parts map item 9). [2026-11-02 10:41]

## The 6 x 7 grid for every menu (Albert, Nov 2, 10:42; parked 10:51) [2026-11-02 11:03]
- Measured Nov 2 at 390 x 844, title included: 13 of 22 cards are taller than 7 ranks (Help and Guide 13, Setup 12, Market and Army with squads 11, Vassal and Mail 10, Research, Misfits, Milestones and Army 9, Score and Relations 8). To fit, rows move into pages, tabs or folds: drawn first, for Albert. Open: is it 6 slots across by 7 ranks tall, the title rank counted? [2026-11-02 11:03]

## Left out of the colour levels (Nov 2) [2026-11-02 12:45]
- The two see-through panels (the War page's steel at 84%, the end card's brown at 90%) are glass, not a level; one number for both would change the War page's look. [2026-11-02 12:45]
- The map's own colours stay out of the index (EXCEPTIONS #11): the ground (#20301c), the ripple's gold (#ffd35e, a canvas paint), the night's canvas colours in 37-events. [2026-11-02 12:45]

## The War Director and after (Albert, Nov 2, 16:36 to 16:50) [2026-11-02 16:56]
- Battle plans: missions, orders and squads as plans that play out; rehearsals on a life-size mock screen. The next layer after the Director. [2026-11-02 16:56]
- Fog that drifts with the wind on the small map (Albert: "maybe too much"). [2026-11-02 16:56]

