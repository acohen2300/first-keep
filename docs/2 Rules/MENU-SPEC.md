# Menu Spec - v70 - Clean Up Session
*Made in v70 - Clean Up Session, Oct 30–31, 2026. Changed only with Albert's word: a later session edits this file and its title, and does not start a copy.*
The architectural drawings for every menu, page and card: one home for layout. Colours live in `COLORS.md`. Drawn with Albert in mockup mode, Oct 30 evening to Oct 31 morning; the pictures named here are in `mockups/70/`, each under its name with "- v70 - Clean Up Session". Nothing here changes without Albert's word.

**The law:** the Formation is the template for everything. Every row, page, menu and card is a manipulation of it. "Maybe the menus are all the same at static and just words change" (Albert, the Build Rules in `RULES.md` §0).

## 1. Standards (locked in v70)
- **One number: 6.** The gap between slots, between half slots, between ranks, and to the screen edge.
- **Height 44** for every slot and half slot (Apple's minimum tap height).
- **Corner radius 6** on every slot and half slot. An outline drawn round slots (the tab folder, a floating menu) takes 6 + 3 = **9**, so curves nest.
- **Slot width** = (screen width − 7 × 6) ÷ 6: 375 pt 55.5 · 390 pt 58 · 393 pt 58.5 · 430 pt 64.3.
- **Half slot width** = (slot width − 6) ÷ 2 (26 at 390). The gap counts inside the slot, so a split slot is exactly as wide as a whole one and every edge lines up top to bottom.
- Half slots are narrower than Apple's 44: the named exception (`EXCEPTIONS.md` #2).
- **One rank = 44 + 6 = 50.** Every height is a whole number of ranks, as every width is a whole number of slots. No loose lines between ranks: text lives in a slot or takes a rank of its own. One exception, locked: the subtitle line under the title bar (§4).
- **A half rank is 19** (19 + 6 + 19 = one rank). Used once: the status strip (§5).
- **Cards are counted in ranks**, never a share of the screen.
- **A card is at most 7 ranks tall, its title rank included, and 6 slots across** (D-094, Albert Nov 2): on the smallest phone (375 x 667) it leaves 130 pt of map; what is taller goes into pages, tabs or folds. [2026-11-02 11:26]
- **Research and building cards are words only: no icons** (D-094). [2026-11-02 11:26]
- **The screen stacks in ranks:** top bar, strip, map, card, job ribbon; cards rise from the bottom over the map, as tall as they hold, their last rank one gap above the row (Nov 2: bottom-anchored; was whole ranks, which left up to a rank of padding). [2026-11-02 14:38]
- **One flat layer** on the grid. A floating menu (the quick action, §7) is one tight block: no gaps inside it, one outer border at radius 9, thin divider lines.
- **Tabs are a file folder:** the open tab joins one outline (Gold 1, radius 9) round its whole page; the outline runs down the middle of the 6 gap, so it adds no width or height.
- Colours: only the names in `COLORS.md`. No literal colours in the code.
- It drills down to every icon: sizes and strokes from the grid, at the icon pass (later). Talk, Oct 31: the line set shown is liked as it is, the sword included, in outline (`Sword Options`, `Sword Filled`); 24 alone, 18 with a number or a word, 12 in a line of text.

## 2. Components (locked in v70)
| Name | What it is |
|---|---|
| Half slot | a or b |
| Slot | half slot + gap + half slot |
| Rank Ribbon | 6 slots, numbered 1–6 left to right |
| Formation | a Rank Ribbon over 12 half slots (1a 1b … 6a 6b) |

**The grammar:** a slot is a word; a column is a sentence (top: what, the state; under it the a / b pair: how much or whether); a rank is a line; a card is a page. The **a / b pair is one component**: − / +, ✓ / ✕ or anything else is only its overlay. By convention − / + changes an amount; ✓ / ✕ commits once. **A column is one control:** the top controls (on / off), the bottom refines.

The empty Formation is the **module**; words, icons and colours laid over it are the **overlay**; each finished use is an **element**.

**The info cell** (a fourth piece): no frame; value in Cream 1, its label in Cream 2 under it, both at 12 (v80). Sentences align left; numbers in columns centre.

## 3. Templates and moves (locked in v70; picture `Formation Templates`, `Slot Kit`)
Ten templates: the Formation · two whole ranks · all half slots · inverted · pillar (slot 1 spans two ranks) · wide pair (5 + 6 merged) · banner (one bar over six) · thirds (three doubles) · halves (two triples) · three ranks (a card).
Three moves: **split** (a | b), **merge across**, **merge down**. Never split a slot top and bottom.
- **A box is one decision, not one option:** choices from one set share one bar, split by thin lines inside.
- **Things you do are double-wide; queues and pickers are singles.**
- **Empty slots:** a list collapses (no holes: two items take two triples). A fixed capacity shows faint plain outlines (the queue), with "+n" where a tech unlocks more. Never dashed.

## 4. The title bar (locked in v70; picture `Title Bar`): the title for the entire game
- One Rank Ribbon: slot 1 **back** · slots 2–4 merged, **the name only** · slot 5 **the book** · slot 6 **×**. Each a full slot.
- Name in IM Fell English SC, **18** (Gold 1; v80). Icons Cream 1. Slots Brown 2 with a Brown 3 edge, on a Brown 1 card.
- The subtitle ("yours", "Fortress · hostile", a full name) sits on the line under the bar in Cream 2, never in it.
- **Back** returns to the card you came from; on the first card it closes the card.
- Short title names where the full one does not fit slots 2–4 at 375 pt: Karakorum, Great Stupa, Djinguereber, Apadana, Horse archer, War elephant, Crossbowman, Error (for "Something went wrong"). Full names stay in the card's text.
- **Nothing that doesn't fit this:** a gate test measures every title in slots 2–4 at 375 pt and refuses the publish if one overflows.
- Measured: 375 pt 55.5 / 178.5 / 55.5 / 55.5 · 390 pt 58 / 186 / 58 / 58 · 430 pt 64.7 / 206 / 64.7 / 64.7.

## 5. The top of the screen (AGREED Oct 31; picture `Top Bar`)
- Today's design kept: one framed bar with dividers (five resources, mute, play, map), then the strip (age, sky, clock, people, idle, tech, rank). The outer edges land on the grid; the cells inside are free.
- Snapped: bar **44** tall at **6** from the top (plus the safe area) · gap **6** · strip **19** (the half rank). Strip cells keep 44 of tap room round them.

## 6. The row (AGREED Oct 31; pictures `Slot 1 Gap`, `Row Pages` for Jobs and Train, `Mission Flow` for War)
- **The cycle button** 🔄 sits on its own rank above slot 1 (one slot, 58 × 44, gap 6), the same icon on every page. The page shows by its tint. The cycle is **Jobs → War → Train**.
- **Jobs:** slot 1 is People over the hammer, two whole slots with the 6 gap between; slots 2–6 the five jobs, each with − + under it. The hammer opens the Build menu: building is a job (Albert), the one way to build.
- **War is the HUD:** slot 1 the target (aim) over Home; slots 2–5 the four squads, each showing its size and ETA, its pace under it as an info cell (fast, slow, fighting); slot 6 Go ✓ over Abort ✕. Tapping a squad opens its card, the squad builder (§8). An empty squad opens a new one.
- **Train** as today: Orders over the squad recruits join; four kinds with − +; ✓ over ✕.
- **Words under picture icons** (Oct 31; `Words Under Icons`, `In Game Jobs`, `In Game War`): an icon that pictures a thing carries its word: the 18 icon with its number beside it, the word at 12 under it (People, the jobs, Build, Target, Home, the squads, the cycle button's page name; on cards the stances and Gift). Symbols stand alone at 24: ✓ ✕ − + back × ☰, and the quick action (no words). A gate test measures every slot word at 375 pt and refuses the publish if one overflows, as for the titles.
- **Tints:** Jobs as now; War and Train in Steel (`COLORS.md`). No panel behind the row on any page (Nov 2): the map shows between the slots. **The cycle button** is the same on every page: a chevron › over three page dots, the one you are on filled (↻ reads as reload). Cards are glass: Brown 1 at 92%, the map's shapes through it; no blur (it costs every frame). [2026-11-02 13:28]
- **Cut:** the door, the Realm page, the Build page (two versions: Build 64's shuffling "what the town needs" page and the fixed two-rank draft, `Build Page (cut)`), the Squad page (its work moves into the squad card).

## 7. The quick action (AGREED Oct 31; redrawn Albert, Nov 2) [2026-11-02 13:28]
- For emergencies, small: round chips one slot across (44), the first centred under the finger: a bullseye, its rings blue, red on an enemy (Nov 2). [2026-11-02 13:28]
- **Tap open ground:** a bullseye. **Tap it:** All in its place, Idle beside it toward the middle of the screen. **Tap All:** every soldier goes. Three taps, the finger never moves. [2026-11-02 13:28]
- **Tap an enemy or a hazard:** a red circle under it, and it opens straight at All, ringed red. [2026-11-02 13:28]
- A tap anywhere else closes it. **Press and hold the ground:** the Here card for that spot. With yours picked, a tap is their obvious order, no menu (Build 40). [2026-11-02 13:28]
- Cut (Nov 2): the 2 × 2 block, the hammer (Build is bottom left), the menu (press and hold), ✕ (a tap elsewhere), + (missions live on the War page). [2026-11-02 13:28]

## 8. Cards (pictures in `mockups/70/`)
| Card | Layout | Picture |
|---|---|---|
| Relations (Town Center, tab 2) | BUILT v80 (Relations final, Albert Oct 31; decision 3). Title · tabs (folder) · one rank a side: the name over its stance in its colour (1 slot) · the gift, a slider with its switch, snapping to 50 (2) · the stance, three icons in two slots, gold on the one picked (2) · its ✓, blue when what was picked can be sent (1) · last rank: what the last ✓ touched will do, and the board. A friend's gift is locked; only the Natives take gifts (rivals' gift dim). Bribe is a step, not a state. | `Relations Final` (mockups/80) |
| Town Center (tab 1) | DRAFT, in use. No labels. Train: units double-wide, add only (no −) · the queue directly under (singles, the first filling green; past 6 the last reads "+n"; the line holds 5, up to 8 with Written records and Guilds; tap a queued unit to cancel it and get its cost back) · Tech: three double-wide a rank (blue ring ready, dim locked) · All tech ›. | `Town Center Card` |
| Market | DRAFT. Caravan and the market's techs, double-wide · the goods one selector with what you have (tap to pick; the gold ring slides; v80) · one Sell and one Buy for the picked good, with its price rate · caravans · Repair · Take down. | `Market Card` |
| Build menu | DRAFT. Six tabs = six slots (folder) · buildings double-wide, three a rank, words only (no pictures, no pins): name, how many of how many, cost · a short rank filled with empty places, every tab (T2, `grid3`) · blue ring fits here, dim a later age. | `Build Menu` | [2026-11-02 12:05]
| Squad (from the War HUD) | DRAFT. Title · the four kinds (Foot, Archers, Riders, Siege) with − + · the three intents (Engage, No pursuit, Buildings first; one chosen) · Cancel and Save (✓, the card's gold fill). | `Mission Flow` |
| The Alarm (was Emergency) | A page of the row (Nov 2), not a card: the red Alarm button turns the row to Work (the all clear) · Gather · Garrison · Shelter, what each does under it, what is coming beside them (tap to look), ✕ back. Age of Empires' Town Bell and Back to Work. The button is red always and breathes while something is coming. | — | [2026-11-02 14:15]
| Villager | DRAFT. What they are doing + health, age, speed as info cells · Stop · Send home · Dismiss · the job picker (the job ribbon reskinned). | `Easy Cards` |
| Stores | DRAFT. One rank per resource: name · have · in (green) · out (red) · on it · ›. No header rank. | `States and Text` |
| A building (House and the rest) | DRAFT. Bottom-anchored (Nov 2, 14:33): as tall as it holds, its last rank always one gap above the row, so the thumb's ranks never move; the fixed heights of 13:54 cut (they padded the Barracks 106 px over the row). The Market the whole height. **The title box** says the rest: its age the top edge (as a tech's), its health a bar under the name (length and colour), a building going up the green ring; room, health and age in words in the book. Train and Research double-wide, three a rank (§10) · the last rank Help · Repair · Raze (S2). | `States and Text` | [2026-11-02 14:38]
| Mail | The six groups as one rank of filters · six messages a page, a rank each, a coloured edge · Previous and Next (the 30 kept are five pages; nothing scrolls; N13, Albert Oct 31). | `Easy Cards` |
| Setup | BUILT v80. Each setting its own rank: its name quiet on the left, its choices one selector right-justified (Difficulty, Length, Scenario, World, Fog Off · On, Tension) · the peoples, one selector · the people's soldier and bonus · Daily, Off · On · the hazards, one bar · Start. The whys in the book. | `Setup Stacked with Names` (mockups/80) |
| Research (full list) | Not redrawn yet. | |

## 9. States and text (AGREED Oct 30, 23:40; revised Oct 31 morning; pictures `States and Text`, `Rings Round the Icon`, `Ring Round Icon and Word`, `Receding Ring`)
- **The ring is the slot's edge**, for a slot of words and a slot of icon and word alike (Oct 31: Albert tried the ring round the icon only, SoRen's way, and round the icon and its word, and chose the edge). One ring at a time: danger beats working.
- **States:** blue ring = ready, can do · gold ring = chosen, on · **green ring that recedes = working**: whole when the work starts, shrinking back to 12 o'clock as the time runs out (SoRen's timer ring; it replaced the green bar, Oct 31) · red ring = danger, wrong, and it **breathes** (its glow rises and falls); with the phone's Reduce Motion it stays still and is drawn 3 wide, so it never rests on colour alone · dim = locked: flat, quiet words, nothing faded · plain = nothing to say. **One gold fill per card at most**, for its main action (Start, Save ✓).
- **Text: two sizes only (v80, Albert Oct 31):** 18 titles and the big moments (Start) · 12 everything else, every word and number in a tile included. Two fonts: IM Fell English SC for titles, Barlow Semi Condensed for the rest, the map included; Barlow at one weight, 600 (MAYBE). On the map a label scales whole with its pill and icon: 12 at the starting zoom, 9 the floor zoomed out; what is pinned to the screen stays 12.

## 10. Train and Research on a building card (Albert, Nov 2, T1) [2026-11-02 11:03]
- Every Train and every Research button on a building card is double-wide (2 slots), three a rank, in every building, the Town Center too. [2026-11-02 11:03]
- A short rank is filled with empty places: the mold's `empty()`, a faint plain outline (never dashed), so the rank keeps its shape and nothing moves when a button comes or goes. [2026-11-02 11:03]
- Its words fit a double slot: a refused Train button says its reason in a few words (no building, the age, short of room, short of a resource, line full, hungry), never a sentence. [2026-11-02 11:03]
- One home: `grid3` in `27-cards-core.js`; tested by `tests/cards.py` T1. The Army card's Train fold is not a building card and keeps the list rule. [2026-11-02 11:03]
- **The last rank of a building card (S2, Albert Nov 2):** Help (on what can burn) · Repair · Raze, one slot each, in that order; the second tap of Raze reads "Sure?", as Dismiss does on the villager card. "Send help" became "Help" to fit one slot at 375 pt. [2026-11-02 11:43]
- **No "yours" line on your own building (S1):** the subtitle line names the owner only on another side's building. [2026-11-02 11:43]
- **The line above Train (Q1, Albert Nov 2):** what is training sits over what you can train; its places are steel (Steel 2 with a Steel 3 edge, empty places Steel 1) with the card's brown between them: no box, no outline (both drawn and turned down). One home: `slotsHTML` (29-card-pages) gives the rank the `queue` class; the look lives in `shell-head.html` `.fm.queue`. Tested by `tests/cards.py` Q1. [2026-11-02 12:45]
- **A folder's open tab at the card's edge (F1):** the first or last tab meets the page's outline square, no rounded corner left behind it. [2026-11-02 12:05]
