# First Keep: handoff (Nov 3, 2026, 20:40; Build 80 preview 47 · Restore and Fix) [2026-11-03 20:40]

**Read START-HERE.md §1 first, then this file.** This is the live state. Do not run the full QC to start. [2026-11-03 20:40]

## What preview 47 is (Albert, Nov 3, 19:49: "First keep is driving me nuts. I need to go back to like preview 33 or 34") [2026-11-03 20:40]
- His call, 19:52: "33 is good. 34 kill. 35-36 kill. 37-41 keep. 42-44 keep. 45-46 kill. Let's call it 47 - Restore and Fix." [2026-11-03 20:40]
- So: the base is preview 33 (`1cf47ab`, 06:47), its screens untouched; previews 37 to 44 are ported onto it as systems (the commits replayed, the controller's doors dropped); 34 to 36 and 45 to 46 are cut, kept whole on the branch `p46-controller` (`8b44259`, the head of main before this). `docs/5 Builds/v80/CUTS.md`, the preview 47 section, lists every piece. [2026-11-03 20:40]
- The Yard (Albert, 19:55: "dumping all the functions we need a home for in a menu for now"): a card (`CARDS.yard`, 39-huddle) behind a button at the left end of War's rank (`#yardB`), shown on previews, tests and frozen versions, never on the live game (`YARD_ON`, 08-core). In it: Choke, Ambush, Idle soldiers. Each wants a home on 33's screens; the card goes when they have one. [2026-11-03 20:40]
- The screens as they stand: the Jobs page (People, Build, the five jobs with − and +), the battle station of preview 27 (the Alarm's four, the small map, Train, Squad, Direct, Attack; the crosshair up while it is open), the Build card with its six tabs, the thin strip, the clock pill. Rally: hold Train. [2026-11-03 20:40]
- Rules of the port: a system came over whole (shores, camps, field defences, the Store, the Hall, the orders' cost, forming, Front/Choke/Support, the audit's fixes); a thing that was a door on the controller did not (the Build page as a list, the Map tile, Aim · Go, Rally by tap, Kinds, the share tap cycle, the Status page). [2026-11-03 20:40]

## Where it stands [2026-11-03 20:40]
- Preview 47 is pushed (`/preview/`; the test field at `/preview/?test`). Live is the older build; it goes live only on Albert's word, after the Live QC. Albert plays tonight. [2026-11-03 20:40]
- The gate passed on preview 47 (`publish.py --preview` runs it). The planted-bug set (`python3 tests/handoff.py --plant`) was not run end to end on 47; the plants of p37 to p44 point at code that came over, so they should still catch, and that is to be checked before live. [2026-11-03 20:40]
- The A/B record (20 seeds, Raiders win every game on score) stands; `docs/6 Records/v80 Audit/AB test - Nov 3.md`. [2026-11-03 20:40]

## For Albert to decide [2026-11-03 20:40]
- A home for each of the Yard's three (Choke, Ambush, Idle soldiers) on 33's screens; then the Yard goes. [2026-11-03 20:40]
- Whether anything on `p46-controller` ever comes back (the floor cards, the 3 × 3 villager card, the Status page). Nothing does without his word. [2026-11-03 20:40]
- The A/B result and the audit's opinions in `Parked.md`, as before; Peace and the Games ("we have to talk"): not yet talked. [2026-11-03 20:40]

## Owed from today [2026-11-03 20:40]
- Before live: the planted-bug set end to end on 47; the "from memory" sources in SCIENCE.md (Josephus, Vegetius, Roth, the Theodosian law's number, Smith's pin factory) opened; the balance run on the new shores. [2026-11-03 20:40]
- The computers do not use camps, the Store's line beyond the research order, chokes (outside the B test) or ambushes. [2026-11-03 20:40]
- Still open: `Owed.md`. Parked today: `Parked.md`, the last section. [2026-11-03 20:40]
