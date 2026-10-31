# Cold Review - v70 - Clean Up Session
*Oct 31, 2026, by a reviewer who had not seen the work. Screenshots were working files, not kept. Every finding rolled to the v80 list (items 30 to 36).*


Read: Build Plan v70, MENU-SPEC, COLORS, RULES §0, EXCEPTIONS, the four builders' notes, mockups/70.
Built: first-keep.html at 90c806b (main), opened as tests/gate.py does (SETUP: Medieval, rich, 12 spears, 7 villagers queued).
Screenshots:  (390x844-* and 375x667-*; play-jobs, row-war, row-train, quick-ground, quick-sword, quick-enemy, card-emergency/keep/market/buildmenu/villager/stores/house/mail/squad/farm). Script: shots.py, probe.cjs in the same folder.
No page errors at either size. Items the notes already list as open or bent are left out.

## Verdict
Nothing found that breaks play. The grid holds where measured (slots 58 x 44 at 390, half slots 26, ranks 50 apart, cycle button 6 above slot 1, top bar 44 at 6 / gap 6 / strip 19, text only 12 / 15 / 19, corners 0 or 6). The cut list in Build Plan item 1 and the Quick Action / Row cut lists left no live remnants (door, Realm, Build page, Squad page, bldThumb, strip, Battle stations, fairness, retired colour names: only save-migration lines mention them, as they should).

## Mismatches, most serious first

1. **The steel page stops short of the cycle button** (visibly wrong).
   Agreed: `Row Pages`, `Words Under Icons`, `In Game War` pictures draw one steel panel that holds the cycle button and both ranks; COLORS: Steel 1 is "the page behind the row".
   Built: `#orders` steel band starts at the row's top (y 744 at 390); the cycle button (y 694) floats above it on the map. Shots: 390x844-row-war.png, 390x844-row-train.png, 375x667-row-war.png.
   Fix: let the page band start one rank higher, under the cycle button.

2. **The Emergency button is off the grid and has no word** (visibly wrong, minor).
   Agreed: MENU-SPEC §1 every width is whole slots; §6 "an icon that pictures a thing carries its word".
   Built: `#emgB` is 44 x 44 (a slot is 58), right-aligned one rank above the cycle button's rank, castle icon with no word. Shot: 390x844-play-jobs.png.
   Fix: make it a slot (58 x 44) with its word, on the cycle button's rank.

3. **Relations tab says "ally, neutral, hostile"** (minor, wording).
   Agreed: `Town Center Card` picture: "friend, neutral, foe"; the Relations stances are Friend / Neutral / Foe (MENU-SPEC §8, `Words Under Icons`). One name for one thing.
   Built: `src/30-cards.js` line 123. Shot: 390x844-card-keep.png.
   Fix: change the words to "friend, neutral, foe".

4. **The line's locked place says "+1 research", not which research** (minor).
   Agreed: `States and Text` 4b draws "+2 Guilds"; MENU-SPEC §8 "+n where a tech unlocks more".
   Built: "+1 / research" on the Town Center and Market (a tap names it). Shots: 390x844-card-keep.png, 390x844-card-market.png.
   Fix: put the research's short name under the +n.

5. **Squad card: the four kinds are quarter-width cells, off the six-slot grid; Cancel and Save lack their ✕ / ✓** (minor).
   Agreed: MENU-SPEC §1 "every width is a whole number of slots"; `Mission Flow` draws ✕ cancel and ✓ save. (The picture itself draws four columns, so the spec and the picture disagree there: Albert's call, not a builder error.)
   Built: kinds ~90 pt wide each, − + pairs not under slot edges; Cancel / Save words only. Shot: 390x844-card-squad.png.
   Fix: decide spec vs picture for the four kinds; add the symbols to Cancel / Save.

6. **A second motion: the status strip's blue cell pulses** (minor).
   Agreed: MENU-SPEC §9 / RULES §1: states are rings; only danger breathes.
   Built: `#status>.go{animation:glowb ...}` in `src/shell-head.html` (states layer) makes a "ready" strip cell glow in and out (the book count, blue, in every shot). May predate v70; it now contradicts the §9 rule written this session.
   Fix: drop the glow, or name it in EXCEPTIONS.

7. **Icons that differ from the agreed pictures** (minor, probably waits for the icon pass).
   The quick action's sword is a filled blade; MENU-SPEC §1 and `Sword Options` agree the outline ("today") sword. The squads on War use the three-figure icon; `In Game War` / `Words Under Icons` draw a shield. The Build Plan says icons stay rough until the icon pass, so this is a note, not a fault. Shots: 390x844-quick-ground.png, 390x844-row-war.png.

## RULES §0, noticed in passing
- Nothing new. Dead code from the cut lists is gone; colours outside `:root` are only the ones EXCEPTIONS #11 lists. Two homes already known (`mmss` / `clock`, Dismiss in the Town Center book) are in the Cards notes.

## Checked and matching (no report needed)
Title bar (back · name · book · ×, name at 19); top bar measures; Jobs (People over Build, five jobs with − +, rally job gold); quick action 2 x 2, swap in place, red ring on an enemy; Emergency four orders with All hands red; Town Center, Market, Build menu (folder, doubles, collapsing list), Villager, Stores (no header rank), House, Farm, Mail (six fixed filters); working ring as a conic edge ring, red ring breathes and goes still and 3 wide under Reduce Motion.
