# N6: the whole open list in one build (Albert, Nov 9 19:37: "One build. All at the same time. Do the whole list… Go go go")

Albert's answers (19:37) to the numbered questions:
1–2. Quick action: the 2×2 square with squad (not found in any build; built as each step a 2×2, thumb under the finger: Attack, Build, Squad, More; Attack → ½, All, ¼, nearest; v80's strip logic). Shelter: the existing alarm/shelter logic. Rally: where spawned units go.
3. Guard = his note 12: tap the ground, it goes there. 4. Rings = the selected unit's glowing, bigger ring at the feet (13–15).
5. Fast and Yard: the Yard was removed Nov 7; both out of Paused.
6. Sound card only while muted: yes.
7. Train and research: keep three boxes a row ("two rows, three boxes each").
8. First lines inside boxes 14 · 600: yes. 9. TRAIN / RESEARCH labels: try. 10. Card gradient: try. 11. Box gradient: try. 12–13. Plain header, keep ←. 14. Meadow full resolution: try. 15. Fog on/off on Start: yes ("it should have been there"). 16. Phone numbers: yes (Albert sends).
17. One build. 18. All of it: stray sweep, fog and sight, SoRen's renderer, hold and building tap.

Order of work (each step committed locally; one push at the end):
- [x] T1 menus  - [x] T2 Build menu  - [x] T3 selection  - [x] T4 quick action  - [x] T5 build order
- [x] T6 look  - [x] T7 woods  - [ ] T8 hold, building tap, small fixes  - [ ] T9 stray sweep, gate
- [ ] T10 fog, sight, fog of war  - [ ] T11 SoRen renderer  - [ ] T12 check and publish

## Done, with cuts (for Parked.md at the end)
- T1: first lines 14 · 600, labels (SN20 label, track), TRAIN / RESEARCH (J43, E849), card and box gradients (C28 box, lighter), the plain header (← · book · ✕ no box, no ring), rings on the edge (E850: a ringed box drops its border; the help lines' blue border gone, a white ring instead), Paused: speeds and New game; Welcome back's line. Cut: Fast and the Yard from Paused (the Yard removed Nov 7); the book's white ring; the help lines' blue border; the frame's fixed row height (label rows size to their words).
- T2: Build menu six tabs of six (SN2), Dwelling first, opens on Home every time; locked buildings hidden, Show all / Hide locked (E853, ECON.lockWhy E851); the Apartment raised from a Dwelling's card where it stands (ECON.raiseTo E852; needs what the Apartment needs: the Aqueduct), the Tree farm planted from a Lumber camp's card (AI.raise), SN34 fromCard; tabs at 12 · 600 (SN20 tab). Cut: the Abatis for players (SN3 offmenu); Base's tab order (up to nine a tab); the Build menu jumping to the suggested building's tab (the hint still marks it blue).
- T3: a picked unit's green ring at the feet, thick and glowing (D320 pick, glow; E855); the next tap is its one order (a thing: it does it; the ground: it goes), then the pick clears for soldiers too (E856). Cut: the villager square (Build, Send to, Attack, More; Garrison, Rally, Info, Focus) and its words (J41); villagers no longer drop the pick on a ground tap; soldiers no longer stay picked after an order.
- T4: the quick action, a square of four, the first box under the finger (E857, E860): Attack · Build · Squad · More; Attack → All · ½ · ¼ · Idle (D358 send, nearest first, E858); Squad → the squads by name (WAR.send); More → Rally (new units gather here) · Shelter · Garrison (the alarm's own cells) · Villager (the nearest idle one goes); Build opens the Build menu on Home with the ghost at the spot (E859). Rings by the colour map (SN32 quick). v80's strip (N288). Cut: the ✕ box (a tap outside closes it); the old Attack + ✕ pair.
- T5: a builder's next site is the first laid, then the nearest (E861; t.laid). Cut: nearest-first for sites (a wall line keeps it).
- T6: games start late in spring (D359 startIn 0.75 of a season; one year clock yt(), E862, for seasons, leaves, the meadow, weather, harvest); the camera opens further out (D open.px 20, was 40); v80's gold, stone and iron piles at v80's size (W27 outcrop 3 m, was 1.2; the art was already v80's); the meadow at res 2 (D353, was 4: four times the pixels, to measure on the phone). Cut: the start in late winter.
- T7: the woods walkable (E863, D360): a person at half pace, a rider at 0.35 (FM 21-18, from memory, to open: N289); engines, wagons and beasts never enter; the pathfinder pays the lost time, so gatherers keep to the edge unless the trees are much shorter; one rule for every side. Not reused: the ice crossing's modes and its ask (the woods need no ask: Albert, never "ask"; one rule, so no mode to remember). Owed: units under the canopy drawn as a silhouette, and foes there seen only by sight (with T10).
