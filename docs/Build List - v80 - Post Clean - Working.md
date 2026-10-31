# Build List - v80 - Post Clean - Working
*Started Oct 31, 2026, 08:20, at the v70 line. Nothing here is agreed yet: each item waits for Albert's yes.*

## Agreed for v80
- Two text sizes in the whole game, 12 and 18 (Albert, Oct 31, 09:00): "19 moves to 18. Anything 15 and under is 12. We have 12. We have 18. That's it." Words and numbers in tiles are 12 (08:55; picture: Setup and the War row at 12 against 15; every word fits a single at 375 pt). Today's 19s (card titles, Start, the row's − +, the War and Train symbols, the › arrows, the old map strip) become 18 or, inside tiles, 12; today's 15s and the map's 11 and 13 become 12. Replaces the three sizes (12, 15, 19) in RULES.md and MENU-SPEC §9 when v80 is built.
- On the map: "If you can zoom it, it needs to scale" (Albert, Oct 31, 09:06): a map label scales whole with its pill and icon, never on its own. 12 at the starting zoom, growing as you zoom in, shrinking as you zoom out to a floor of 9 ("I'd zoom down to 9 as it's base 3", 09:09): the research badge's count (10 today at the start), the idle "z" (11), the wonder's clock (12), an overlay tag (13), an arrival countdown (11). The one place text goes under 12, and only zoomed out. What is pinned to the screen (the edge arrows, the crosshair's map reference) stays 12. Picture: the badge three ways.

- Fonts (Albert, Oct 31, 09:10–09:16): two fonts only: IM Fell English SC for titles, Barlow Semi Condensed for everything else, the map included (the phone's own font on three map labels goes).
- MAYBE (Albert: "I suppose. Let's do and flag it as maybe"): one weight, 600, for all of Barlow, 12 and 18 alike (Start at 900 was "too fat"; 300 was too thin at 12). Quiet lines are told apart by colour (Cream 2), not weight. One packed Barlow file instead of two; the unused 600 file today and the 500 and 700 go. Pictures: the weights A and B, the pick, Start at 900 against 600.

- Setup (Albert, 09:21–09:23): each setting its own row, its choices right-justified, the setting's name in slot 1 (quiet, 12). Open: the civ and hazard rows are full (no slot 1 for a name); Fog and Daily say their word twice. Pictures: Setup Singles, Setup New Rules, Setup Stacked, Setup Stacked with Names.
- Controls kept (Albert, 09:28), each two or three slots wide, corners 6 (the round pill is killed): the check box (ticked: a gold tick and the slot's gold ring; three slots add a quiet line), the toggle (word left, switch right; on: the switch slides and turns gold, the slot rings), the slider (word and value over the track, gold to the knob, no ring), the slider with a toggle (off: the track goes quiet and keeps its value), the selector (two or three words in one shape, a gold selector slides 0.4 s to rest over the choice; three words need three slots). Pictures: Check Box Toggle Slider, Slider with Toggle, Selector (its grid half).

- Toggles kept (Albert, 09:36): the one-slot toggle (switch over its word, 58 x 44); two ranks tall in the job footprint, B (the word over its switch) and C (the word over Off | On, the a / b pair). Pictures: Toggle One Slot, Toggle Two Ranks.
- Kept (Albert, 09:39, "Save these"): the slider two ranks tall (A one tall slot, B the word over a track, C the word over − +) and the variants (2 x 2 word | switch over a slider; 2 x 2 four boxes; 3 x 2; columns like the jobs; a settings row). Picture: Slider Two Ranks and Variants.

- One border (Albert, 09:41, kept): any control may sit in one outline (corners 9, down the middle of the gap) with nothing inside but its content; a chosen part keeps its ring; the big one is 3 x 4. Picture: One Border per Control.
- The control sheet (Albert, 09:41): every kept control in seven groups: 1 check boxes, 2 toggles, 3 sliders, 4 toggles + sliders, 5 selectors, 6 pairs (the job grammar), 7 one border. Pictures: Control Sheet 1 and 2.

## Needs Albert's call now (it touches v70)
1. Mail has no door once the Realm page goes: the Realm page's Mail tile was its only way in. Where does Mail open from?
2. The status strip: Gunpowder does not fit the age cell. The ballot's change (the People icon back, age and people three cells each) was refused by the tap-size check: the other cells fell to 40 pt at 375.
3. Relations: how a stance looks once picked but not yet sent with ✓.
4. Whether v70 goes live (live is the Oct 28 build).

## Half done in v70
5. Loose lines left on some cards: section labels, paragraphs, the health bar (the cards builder takes these).
6. Setup and Market are exactly 13 ranks at 390 x 844, so a queued caravan makes Market scroll; on 375 x 667, Army and a Town Center with a queue scroll (exception #3).
7. The map's labels are drawn at 11 px; the three text sizes hold for menus, not yet for the map.
8. Colours still written by hand: the wild animals' health colour, the map ripple, the native wrapper's background.
9. Records: HANDOFF and GUIDE still describe the fairness check; Build 63's "wins by seat" are crown counts (fixed at the v70 close).

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

## Housekeeping
23. The automatic check that asks for commits in Claude's name and a push: removing it needs a permission Claude does not have.

## Albert's comments on v70
