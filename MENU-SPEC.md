# First Keep: the menu spec
The architectural drawings for every menu, page and card: one home for layout. Colours live in `COLORS.md`. Drawn with Albert in mockup mode, Oct 30 evening to Oct 31 morning; the pictures named here are in `mockups/70/`. Nothing here changes without Albert's word.

**The law:** the Formation is the template for everything. Every row, page, menu and card is a manipulation of it. "Maybe the menus are all the same at static and just words change" (Albert, the Build Rules in `RULES.md` §0).

## 1. Standards (LOCKED)
- **One number: 6.** The gap between slots, between half slots, between ranks, and to the screen edge.
- **Height 44** for every slot and half slot (Apple's minimum tap height).
- **Corner radius 6** on every slot and half slot. An outline drawn round slots (the tab folder, a floating menu) takes 6 + 3 = **9**, so curves nest.
- **Slot width** = (screen width − 7 × 6) ÷ 6: 375 pt 55.5 · 390 pt 58 · 393 pt 58.5 · 430 pt 64.3.
- **Half slot width** = (slot width − 6) ÷ 2 (26 at 390). The gap counts inside the slot, so a split slot is exactly as wide as a whole one and every edge lines up top to bottom.
- Half slots are narrower than Apple's 44: the named exception (`EXCEPTIONS.md` #2).
- **One rank = 44 + 6 = 50.** Every height is a whole number of ranks, as every width is a whole number of slots. No loose lines between ranks: text lives in a slot or takes a rank of its own. One exception, locked: the subtitle line under the title bar (§4).
- **A half rank is 19** (19 + 6 + 19 = one rank). Used once: the status strip (§5).
- **Cards are counted in ranks**, never a share of the screen.
- **The screen stacks in ranks:** top bar, strip, map, card, job ribbon; cards rise from the bottom in whole ranks over the map.
- **One flat layer** on the grid. A floating menu (the quick action, §7) is one tight block: no gaps inside it, one outer border at radius 9, thin divider lines.
- **Tabs are a file folder:** the open tab joins one outline (Gold 1, radius 9) round its whole page; the outline runs down the middle of the 6 gap, so it adds no width or height.
- Colours: only the names in `COLORS.md`. No literal colours in the code.
- It drills down to every icon: sizes and strokes from the grid, at the icon pass (later).

## 2. Components (LOCKED)
| Name | What it is |
|---|---|
| Half slot | a or b |
| Slot | half slot + gap + half slot |
| Rank Ribbon | 6 slots, numbered 1–6 left to right |
| Formation | a Rank Ribbon over 12 half slots (1a 1b … 6a 6b) |

**The grammar:** a slot is a word; a column is a sentence (top: what, the state; under it the a / b pair: how much or whether); a rank is a line; a card is a page. The **a / b pair is one component**: − / +, ✓ / ✕ or anything else is only its overlay. By convention − / + changes an amount; ✓ / ✕ commits once. **A column is one control:** the top controls (on / off), the bottom refines.

The empty Formation is the **module**; words, icons and colours laid over it are the **overlay**; each finished use is an **element**.

**The info cell** (a fourth piece): no frame; value in Cream 1 at 15, its label in Cream 2 at 12 under it. Sentences align left; numbers in columns centre.

## 3. Templates and moves (LOCKED; picture `09-formation-ways.png`, `22-slot-kit.png`)
Ten templates: the Formation · two whole ranks · all half slots · inverted · pillar (slot 1 spans two ranks) · wide pair (5 + 6 merged) · banner (one bar over six) · thirds (three doubles) · halves (two triples) · three ranks (a card).
Three moves: **split** (a | b), **merge across**, **merge down**. Never split a slot top and bottom.
- **A box is one decision, not one option:** choices from one set share one bar, split by thin lines inside.
- **Things you do are double-wide; queues and pickers are singles.**
- **Empty slots:** a list collapses (no holes: two items take two triples). A fixed capacity shows faint plain outlines (the queue), with "+n" where a tech unlocks more. Never dashed.

## 4. The title bar (LOCKED; picture `13-title-back.png`): the title for the entire game
- One Rank Ribbon: slot 1 **back** · slots 2–4 merged, **the name only** · slot 5 **the book** · slot 6 **×**. Each a full slot.
- Name in IM Fell English SC, **19** (Gold 1). Icons Cream 1. Slots Brown 2 with a Brown 3 edge, on a Brown 1 card.
- The subtitle ("yours", "Fortress · hostile", a full name) sits on the line under the bar in Cream 2, never in it.
- **Back** returns to the card you came from; on the first card it closes the card.
- Short title names where the full one does not fit slots 2–4 at 375 pt: Karakorum, Great Stupa, Djinguereber, Apadana, Horse archer, War elephant, Crossbowman, Error (for "Something went wrong"). Full names stay in the card's text.
- **Nothing that doesn't fit this:** a gate test measures every title in slots 2–4 at 375 pt and refuses the publish if one overflows.
- Measured: 375 pt 55.5 / 178.5 / 55.5 / 55.5 · 390 pt 58 / 186 / 58 / 58 · 430 pt 64.7 / 206 / 64.7 / 64.7.

## 5. The top of the screen (AGREED Oct 31; picture `57-top-today-vs-grid.png`)
- Today's design kept: one framed bar with dividers (five resources, mute, play, map), then the strip (age, sky, clock, people, idle, tech, rank). The outer edges land on the grid; the cells inside are free.
- Snapped: bar **44** tall at **6** from the top (plus the safe area) · gap **6** · strip **19** (the half rank). Strip cells keep 44 of tap room round them.

## 6. The row (AGREED Oct 31; pictures `03-slot1-gap.png`, `60-row-pages.png` for Jobs and Train, `61-mission-flow.png` for War)
- **The cycle button** 🔄 sits on its own rank above slot 1 (one slot, 58 × 44, gap 6), the same icon on every page. The page shows by its tint. The cycle is **Jobs → War → Train**.
- **Jobs:** slot 1 is People over the hammer, two whole slots with the 6 gap between; slots 2–6 the five jobs, each with − + under it. The hammer opens the Build menu: building is a job (Albert), the one way to build.
- **War is the HUD:** slot 1 the target (aim) over Home; slots 2–5 the four squads, each showing its size and ETA, its pace under it as an info cell (fast, slow, fighting); slot 6 Go ✓ over Abort ✕. Tapping a squad opens its card, the squad builder (§8). An empty squad opens a new one.
- **Train** as today: Orders over the squad recruits join; four kinds with − +; ✓ over ✕.
- **Tints:** Jobs as now; War and Train in Steel (`COLORS.md`).
- **Cut:** the door, the Realm page, the Build page (two versions: Build 64's shuffling "what the town needs" page and the fixed two-rank draft, `59-build-page.png`), the Squad page (its work moves into the squad card).

## 7. The quick action (AGREED Oct 31; picture `64-quick-action-tight.png`)
- A 2 × 2 of 58 × 44 slots, icons only, opened right under the tap: one tight block, one border (radius 9), thin dividers inside.
- **Tap empty ground:** sword (under the thumb) · hammer / menu · ✕. The hammer opens the Build menu for that spot; the menu opens the Here card (everything about that spot).
- **Tap the sword:** all · idle / + · ✕, swapped in place so the thumb never moves. All sends every soldier, idle the idle ones, **+** is a mission: it opens the War HUD with the target set.
- **Tap an enemy or a hazard:** a red circle under it (yours have green) and the quick action opens straight at step 2.
- Near a screen edge the block flips so the first icon stays under the thumb.

## 8. Cards (pictures in `mockups/70/`)
| Card | Layout | Picture |
|---|---|---|
| Relations (Town Center, tab 2) | AGREED. 7 ranks: title · tabs (folder) · one rank per player: Player · Gift · − + · Friend · Neutral · Foe · last rank: status (slots 1–5) + ✓ (slot 6). One ✓ commits the card's changes. Stance = gold ring. A friend's gift dims. Gifts stay with the Natives for now (rivals' gift dim). Bribe is a step, not a state. | `37-relations-across.png` |
| Town Center (tab 1) | DRAFT, in use. No labels. Train: units double-wide, add only (no −) · the queue directly under (singles, the first filling green; past 6 the last reads "+n"; the line holds 5, up to 8 with Written records and Guilds; tap a queued unit to cancel it and get its cost back) · Tech: three double-wide a rank (blue ring ready, dim locked) · All tech ›. | `45-town-flow.png` |
| Market | DRAFT. Caravan and the market's techs, double-wide · the goods as singles with what you have (tap to pick; gold ring) · one Sell and one Buy for the picked good, with its price rate · caravans · Repair · Take down. | `46-market.png` |
| Build menu | DRAFT. Six tabs = six slots (folder) · buildings double-wide, three a rank, words only (no pictures, no pins): name, how many of how many, cost · blue ring fits here, dim a later age. | `47-build-menu.png` |
| Squad (from the War HUD) | DRAFT. Title · the four kinds (Foot, Archers, Riders, Siege) with − + · the three intents (Engage, No pursuit, Buildings first; one chosen) · Cancel and Save (✓, the card's gold fill). | `61-mission-flow.png` |
| Emergency | DRAFT. What is coming (an info rank) · four orders as two doubles a rank: **Stop** (everyone back to work) · **Town square** (everyone to the Town Center) / **All hands** (villagers and soldiers fight, red ring) · **Shelter** (villagers inside). | `51-easy-cards.png` |
| Villager | DRAFT. What they are doing + health, age, speed as info cells · Stop · Send home · Dismiss · the job picker (the job ribbon reskinned). | `51-easy-cards.png` |
| Stores | DRAFT. One rank per resource: name · have · in (green) · out (red) · on it · ›. No header rank. | `52-standards.png` |
| A building (House and the rest) | DRAFT. An info rank (room, health, age) · its techs, collapsing (no holes) · Repair · Take down. | `52-standards.png` |
| Mail | DRAFT. The six groups as one rank of filters · the messages, a coloured edge for the group. | `51-easy-cards.png` |
| Setup, Research (full list) | Not redrawn yet: only the title bar changes in Build 70. | |

## 9. States and text (AGREED Oct 30, 23:40; picture `52-standards.png`)
- **States:** blue ring = ready, can do · gold ring = chosen, on · green fill bar = working, in progress · red ring = danger, wrong · dim = locked · plain = nothing to say. **One gold fill per card at most**, for its main action (Start, Save ✓).
- **Text: three sizes only:** 19 big moments (titles, Start, a question) · 15 buttons and values · 12 subtitles and labels. Nothing smaller.
