# Quick action notes, preview 46 [2026-11-03 18:12]

Builder: the quick action and the enemy tap (Albert's "yes yes", Nov 3). Pictures in this folder (390 x 844): `1-block-open-ground-zoom.png`, `2-share-step-zoom.png`, `4-enemy-block-zoom.png`, `5-enemy-squads-zoom.png`. [2026-11-03 18:12]

## What was built [2026-11-03 18:12]
- **One joined block** (`#qa`, `src/shell-head.html`; cells and steps in `src/28-army-quick.js`): no panel, no gaps, one white outline (`--ring-w`, 1px, radius 9 = `--rad-o`), Brown 1 fill, dividers 8 short of the edge copied from `.pill .cell+.cell::before`, four cells of 44 tall, each one controller column wide ((screen - 12 - 18) / 7; 51.4 at 390), so the block is 102.8 x 88 at 390. It sits where the finger touched (same clamp: below the top bar, above the controller). [2026-11-03 18:12]
- **Open ground:** Sword · Close / Build · Rally, icon over word. Sword shows All n · 1/2 n · 1/4 n / More, the counts being the idle soldiers through `shareN` and `SHARE` (the one home); the third tap sends that share of the nearest idle soldiers (`nearestTo`, now also used by `shareFor`) at once, and the bullseye (`drawReticle`, called through `drawQuickFlash`, green) shows on the spot for 1 s. No confirm tap. [2026-11-03 18:12]
- **Build** opens the Build card with the spot on the card (`at`); `startPlace` puts the ghost there (else the middle of the screen as before); a turned tab keeps it (`ACT.menu`). **Rally** sets `G.rally0` at the spot through `setRally`, no extra tap. [2026-11-03 18:12]
- **A foe** (nothing picked; a unit or building you are at war with, a wild beast, a find that still has guards): Sword · Close / Squad · More. Sword sends every idle soldier to attack it; Squad turns the block into Alpha, Bravo, Charlie (idle count each, dim at 0) plus Close, and the one tapped attacks at once; More opens that foe's own card. With soldiers picked a tap on a foe attacks at once, as before. [2026-11-03 18:12]
- New: `ICON.more` (four small squares), `QUICK_WORD` (07-text), verb `qa` (33-verbs), `isEnemy` (26-input). [2026-11-03 18:12]

## Tests and plants [2026-11-03 18:12]
- `tests/quick.py` (new, in the gate's list): Q1 joined block, Q2 shares and bullseye, Q3 Build, Q4 Rally, Q5 foe and Squad. The old chip checks left `tests/gate.py` (the hold-ring check stays there); `tests/handoff.py` plants for the old chips now point at `tests/quick.py`, the "sword sends nobody" plant is cut with `qsword`. [2026-11-03 18:12]
- Seven plants for `--only=p46` (gaps, every share sends all, no bullseye, Build in the middle, Rally sets nothing, foe shows no block, Squad sends everyone): all caught. Not run: the full gate, the full handoff. Also passing: `tests/verbs.py`, `tests/lint.py` (one old warning, `wcell`), `tests/palette.py`, `tests/text81.py`. [2026-11-03 18:12]

## Cuts [2026-11-03 18:12]
- The two round chips (sword, ✕) and their CSS (`#qa.left`, `#qa .cell` round chip, 22 px icons): replaced by the joined block. [2026-11-03 18:12]
- Verbs `qsword` and `qclose` (33-verbs) and `quickGo` (28): replaced by the one verb `qa` and `quickDo`. [2026-11-03 18:12]
- `HOLD_WORD` (07-text, 41-boot export): dead; "No soldiers yet" now comes from `freeWhy()` ("No soldiers yet. Train some." or who is busy). The gate line that checked `HOLD_WORD.attack` went with it. [2026-11-03 18:12]
- The gate's old quick block (chips, sword, ✕) moved to `tests/quick.py`. [2026-11-03 18:12]
- Parked: nothing cut was an idea; if Albert wants the sword to send busy soldiers too (the old sword sent every soldier, now only the idle ones), that is a new decision. [2026-11-03 18:12]

## Decisions for Albert [2026-11-03 18:12]
- **The block is 102.8 wide, not 88:** the brief gives both "one controller column wide" (51.4 each, 102.8 for two) and "88 wide". I built the formula (columns); 88 wide would make each cell 44 wide. Say if you want 44-wide cells. [2026-11-03 18:12]
- **The Sword now sends the idle soldiers only** (All, 1/2, 1/4 of the idle). Before it sent every soldier that can be sent, busy ones too. If none are idle it says why ("None idle: 4 marching."). [2026-11-03 18:12]
- **A second tap on the same ground within 320 ms is still a double tap and does nothing** (existing rule), so the block cannot be re-opened that fast. [2026-11-03 18:12]

## Unsure, not acted on [2026-11-03 18:12]
- **More on open ground: there is no Here card.** It was cut in Nov 2 (`26-input`: "the Here card is cut"); only `suggestAt` (dead code) is left of its logic. I did not rebuild it: More on open ground says "More comes later." and closes. Albert's larger menu replaces it. [2026-11-03 18:12]
- **Squad sends with `order`, not `hudFire`,** so a squad sent from the block takes no mission slot (no time and odds on the War page). `hudFire` needs the crosshair set and a free slot. Say if squads from the block should be missions. [2026-11-03 18:12]
- **A wild beast counts as a foe** (`isFoe`): a tap on a deer-like animal with nothing picked now shows the block, where before it ringed it. Not checked in play which wild animals `isFoe` covers. [2026-11-03 18:12]
- **Squad with no Battalions:** the Squad cell is dim and says "Squads come with Battalions."; not drawn in a picture. [2026-11-03 18:12]
- Not verified: a real phone (touch, the 320 ms double tap in play), the bullseye over the controller's map, the 375 x 667 size (the gate measures it). [2026-11-03 18:12]

## For the lead [2026-11-03 18:12]
- MENU-SPEC section 7 still says "two round chips"; its wording is the lead's job. [2026-11-03 18:12]
- Outside my area, stale: the Orders card's "About orders" fold in `30-cards.js` still reads "Tap open ground, then the sword: All or the idle ones go there, or + aims a mission there." [2026-11-03 18:12]
- Small edits outside my files, each needed by the change: `startPlace` and the tap branch (26-input), `ACT.menu` keeps `at` (33-verbs), one call in `21-view-frame.js`, `ICON.more` (32-frame), exports (41-boot). I did not touch 39-huddle, 30-cards, 27-cards-core or card CSS. [2026-11-03 18:12]

## Draft for CUTS.md [2026-11-03 18:12]
- Quick action (Albert, Nov 3, yes yes): the two round chips become one joined 2 x 2 block (Sword · Close / Build · Rally); Sword opens All · 1/2 · 1/4 · More, the third tap sends that share of the nearest idle soldiers at once with the bullseye for a second; Build opens the Build card with the ghost on the spot; Rally sets the point there; a foe gets Sword · Close / Squad · More. [2026-11-03 18:12]
- Cut: the chips and their CSS, verbs `qsword`, `qclose`, function `quickGo`, `HOLD_WORD`, the gate's chip checks (moved to `tests/quick.py`), the plant "the sword sends nobody". [2026-11-03 18:12]
- Added: `ICON.more`, `QUICK_WORD`, verb `qa`, `isEnemy`, `nearestTo`, `tests/quick.py` and seven plants (`--only=p46`). [2026-11-03 18:12]
