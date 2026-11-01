# First Keep v70: fresh-eyes player and UI report

Build: the frozen v70 `first-keep.html` (my own copy in `scratchpad/ag-player`). Driven headless with playwright and chromium at 390x844 (and 375x667), device scale 2, fog off for every picture. All numbers below come from `getBoundingClientRect` and `getComputedStyle` on the live page. I opened every screenshot listed at the end and looked at it. I did not run publish, gate, soak, balance or probe.

VERIFIED = I measured it or saw it in a screenshot I looked at. SUSPECTED = an inference I did not prove.

## 1. Findings by severity

### High (they break the first ten minutes)
1. **The house tip is shown once, then never again, and the game stalls at 5/5.** VERIFIED (simulation, seed 3, "train when you can" player): "You are full: Build → House (30w)" is the top advice from 0:10 to 10:00. It was shown on the ticker once, at 0:20, for 6 seconds. The town stayed at 5/5 for nine and a half minutes, with 510 food and 420 wood unspent. It is the "a tip is said once" rule in `ui()` (32-frame.js ~l.533–541). A tip that blocks all growth needs to repeat or stay up.
2. **People shows a blue "ready" ring while the town is full.** VERIFIED (screenshot 55: People has a blue ring next to a red 5/5; the class is `cell go`). Blue means "can do", but training is blocked. This is the colour code contradicting itself at the moment the player most needs it.
3. **The scout dies in the first minute on every seed tried, and the player can do nothing about it.** VERIFIED (simulation, seeds 1, 2 and 3): the scout was gone at 0:24, 0:58 and 0:24, after "Bears/Boars/Wolves attack at F14/F15" at about 0:15. It stood at "home" while its health fell. The Here card still offers "Send the scout" after that.
4. **Hands-off, nothing happens and the raid finishes the town off.** VERIFIED (simulation): with no input the town stays at 3 villagers for 10 minutes. Raiders "march on you" at about 4:45 and attack at 7 to 9 minutes; seed 1 ended at 1 villager and seed 2 at 2. Nothing on screen says to build a Barracks before 1:16, and that tip shows once.
5. **When the berries run out, villagers go idle with no pointer to Farms.** VERIFIED: the mail says "No bush in sight: one waits at the town center. x4" (about 7:13). The idle tip that follows says "Tap + under a job", which sends them back to a job that has nothing to gather. The farm advice ranks below the idle advice in `advise()`.
6. **Relations (Town Center, tab 2) scrolls at 390x844 and is not the agreed card.** VERIFIED: scroll height 528 against a 500 visible height. Cells grow to 48.9. The cells are 90 pt quarters, not slots. The Natives row wraps onto two ranks. A loose paragraph ("The board: …") sits between ranks. The agreed ✓ commit rank is missing. The gate opens only the Town tab, so it never sees this (screenshot 30).

### Medium
7. **Help can only be reached through Score.** VERIFIED: the play screen has no `data-act=help`. The only way in is ★ 1st → "How to play". The book in a title bar opens that card's history text instead.
8. **The Build menu opens on the Land tab; House is on Home.** VERIFIED (screenshot 12). The one tip a player gets says "Build → House", and the House is not on the tab that opens.
9. **After you tap Build, placement stays on.** VERIFIED: `G.place` is still true after the tap and 30 s later. The ghost house and "tap Build" bar stay up (screenshots 53, 54). A new player will tap again and pay for a second house.
10. **The Emergency button is 44x44, off the grid.** VERIFIED. The CSS token `--slot` is 44 px (a height), and `.fab` uses it for its width. See the table.
11. **Strip cells: the ticker covers their tap room.** VERIFIED: the strip cells are 44 tall at y 56 to 100, but the ticker covers y 81 to 127 (`elementFromPoint` at y 85 to 98 returns `#pv`). With a message showing (nearly always), each strip target is about 25 pt tall.
12. **Every card with a subtitle shows an empty band about 31 pt tall at its bottom.** VERIFIED: Town Center, Stores, Mail, Villager, House and Market all measure 31 pt from the last control to the card's foot. Emergency and Build, which have no subtitle, measure 3 pt. The subtitle's 22 pt is rounded up to a whole rank.
13. **Research card.** VERIFIED (screenshots 14, 14b): the "READY" header is a loose line, so the ranks start at 636 instead of 644. In the Ready rank, the tech is a double plus a single ›, and slots 4 to 6 are empty: the second column of the two-column layout has nothing in it. In the opened Locked list, cells grow to 48.9 and titles are clipped under the age-mark bar (Hafted axes, Timber framing, Calendar, Runners, Fieldcraft). The text repeats itself: "Needs a lumber camp · Lumber camp".
14. **The War page's squads are inert until Battalions is researched.** VERIFIED: tapping Squad A opens nothing. The ticker says "Squads come with Battalions."
15. **The Train page's ✓ wears a blue ready ring with no Barracks.** VERIFIED (screenshot 23). Tapping + gives "Build a barracks first."
16. **At 375x667, the Setup card hides Start.** VERIFIED (screenshot 04: it scrolls, 593 against 450). The gate allows this, but it is the very first screen.

### Low
17. **Stores shows "−300 out" for food at 0:01** after one villager (50f) was queued. VERIFIED that it shows; SUSPECTED that the per-minute figure is extrapolated from a very short window.
18. **Rank falls to "4th" within 30 s of training villagers.** VERIFIED (screenshot 54); the cause is SUSPECTED. It goes unexplained and discourages the player.
19. **The Villager card shows the Iron job lit** while the row shows it dim (screenshot 17). VERIFIED.
20. **The House card's info cells are 90 pt wide; the Barracks card's are 186 pt.** VERIFIED. They do not match each other and do not sit on the grid.
21. **The Squad card's kinds are 90 pt quarters.** VERIFIED: the − and + under each (26 each) leave a 32 pt hole under every box (screenshot 64).
22. **The place bar is 58 pt tall** (not 44 or a whole rank), and it overlaps the Emergency button by 8 pt. VERIFIED (screenshot 52).
23. **At 375, the sky cell's emoji touch the divider** (42 of 45.4 pt). VERIFIED (screenshot 09b).

## 2. Measured spec divergences (390x844 unless noted)
| Item | Spec | Measured |
|---|---|---|
| (a) Emergency button | slot 58x44, on the column lines | 44x44 at x 340–384 (slot 6 is 326–384); at 375: 44 against 55.5. Vertically on the rank (644 = row − 2 ranks). No word under the icon. |
| (b) Research, Ready rank | no holes | tech 6–128 + › 134–192; 198–384 empty; the header line shifts ranks 8 pt; locked cells 48.9 |
| (c) Status strip | 19 tall, cells free inside | the strip is 19 ✓; 7 cells at 54 (8 at 47.3 from Bronze); 375: 45.4. Powder text 36 pt and Peace 30 pt both fit, no clipping. The tap rects are 44 tall but the ticker covers 19 of them. |
| (d) Cycle button | 58x44 | 58x44 at (6,694) ✓; 55.5x44 at 375 ✓ |
| (e) Scrolls at 390 | none but Help and Guide | Relations tab 528>500 ✗; Research with Locked open 1450>650 (allowed by the gate); Help and Guide (allowed) |
| Row, title bars, quick action, Build, Emergency, Villager, Mail, Stores | slots, gap 6, margin 6, 44 tall | all on the grid ✓ (the quick action's cells are 57.98x44, radius 9) |
| Off-grid cells | slot multiples | Relations 90 · Squad kinds 90 · House info 90 · Score headers 69.8, 56, 76.2 · Setup segments 94, 70.5, 61, 141 (Setup has not been redrawn) · the place bar 58 tall |
| Grown cells | ≤ 44 | Research locked 48.9; Relations 48.9 |
| Text < 12 px | none | none ✓ (only 12, 15 and 19 found) |
| Tap targets < 44 (not half slots) | none | none by their rects; effectively the 7 strip cells (~25 tall under the ticker) |
| Colours not in the index | none | cost green #9dddb7; short pink #f4aca5 and #f0c1be; the velocity gradient on the counts (e.g. rgb 183,226,203). RULES mentions the gradient, but COLORS.md does not list it. |

## 3. First ten minutes, as a new player: what confuses
- **Setup.** It never says what Scenario, Tension, World or the hazard boxes mean, or what their numbers 2 and 3 are. It defaults to 60 minutes. There is no "first game" choice. × and ← both start the game.
- **The first message** is "Stony hills. Hazards at random: level 9." Nothing says what to do. The first tip comes at about 0:20, lasts 6 seconds, and never comes back.
- **Map references** ("F15", "D17") point at a grid the map never draws.
- **Pressing People** gives no feedback on the row: the queue is invisible until you open the Town Center.
- **+ under a job** with nobody idle does nothing ("Use − on another job"): moving a villager takes two taps.
- **The Town Center card** shows "×1" on Villager, "+1 research" in the queue (it reads as "one research ready"), "Short 150f" in pink, and age bars across the tops of the cells. None of these is explained.
- **The Build menu** shows "Fits here" on Mill; the House has a cost but no "0/n" count.
- **The quick action is icons only.** "+" for "a mission" and a sleeping person for "idle" are opaque.
- **The War and Train pages** put an unexplained crosshair in the middle of the map. Squads A to D look usable and are not.
- **Emergency's** "All hands" wears a permanent red ring while "Nothing coming"; Shelter's "3 villagers inside" reads as "already inside".
- **The ticker** puts trivia ("Jericho builds a wall…") on the same one line as the only instructions.
- **Score** shows "4th" within seconds; a new player cannot tell why.

## 4. Not checked
Real touch gestures (drag, hold, box select); sound; `native/index.html`; 393 and 430 widths; Fantasy, Siege, Silk Road and Last Keep; actual combat outcomes against the raid; Go and Abort on the War page; Market buy and sell with a real economy; saving and loading; Reduce Motion; contrast (the gate measures it); performance.

## 5. Screenshots (`scratchpad/reports/shots/`)
01-first-open, 02-game-start, 03-passive-3min, 04-setup-375, 05-setup-closed-with-x, 06-main-375, 07-keep-375, 08-build-375, 09-strip-375-age4, 09b-strip-375-3icons, 10-townhall, 11-keep-card, 12-build-menu, 13-stores, 14-research, 14b-research-locked-open, 15-emergency, 16-mail, 17-villager, 18-help, 19-guide, 20-troops, 21-score, 22-row-war, 23-row-train, 24-strip-powder, 30-relations, 40-quick-ground, 41-quick-sword, 42-here-card, 43-quick-enemy, 50-queued-3, 51-build-home-tab, 52-placing-house, 53-house-placed, 54-t30, 55-naive-10min, 60-market, 61-house, 62-barracks, 63-squad-tap-no-tech, 64-squad-card, 65-war-hud-command, 70-after-dismiss, 80-keep-book, 81-train-plus-no-barracks (all .png)

## 6. Overall
On the grid, v70 mostly holds: the row, the title bars, the quick action and most cards measure true. The exceptions are the Emergency button, Relations, Research, Squad, House and the subtitle cards' dead band. As a game for a first-timer it does not lead. The one tip that unblocks growth is said once and then goes silent. The colour code tells the player they can train when they cannot. The scout dies before the player knows it exists, and a passive or naive player is stuck or overrun inside ten minutes.
