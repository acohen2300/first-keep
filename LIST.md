# First Keep — The List

Open work only. Calls live in RULINGS.md; what was done and why is in `docs/log/` (the old list up to Nov 23: `docs/log/LIST-to-2026-11-23.md`) and in the commits.

## Now
- Latest build: v106 (https://acohen2300.github.io/first-keep/fresh/v106/)
- Cleanup (feature freeze until done), in order:
  1. [x] Units (Nov 23): every number in the Measurements book says its unit, 1,731 -> 0; the gate is 0. Coarse on purpose: a few art arrays say only "drawing" (sinkhole crack, scars, flag curve, pile box, figure marks), for the art cleanup
  2. [x] Sources (Nov 23): 5 linked, 8 retired (docs/log/sources-retired-2026-11-23.md); every source has a kind; 905 entries: Sourced 371, Derived 97, Chosen 437, every Chosen one says why
  2b. [x] Units book (Nov 23): books/units.js, 120 words; 160 spellings down to one each (s/seconds, px/pixels, °C/degrees C; "power" the exponent is now "exponent", upkeep's "shares" are "person shares", the world's "units" are "world units"); the check refuses a unit not in the book
  3. [ ] Rule fixes that change play, one build each with his playtest: what-beats-what back on the Train tile; full load 8 at 2.5 kg (one weight, D53 vs W24); cold ration 0.385 (open N275 first); the laws' fog text (QAN); the five dead research get their effects
  - From the look-up (docs/log/chosen-lookup-2026-11-23.md, 25 of 60 done), for his call, each its own build: wade to 1.0 m (D24) or deepen the river; wolf packs of about 6; mortar's line at 4.4 °C; the boar 1.14 of a deer; the day's swing about 11 °C; the winter −2 °C; decide what a unit of food weighs before the load at 8
- After the freeze: the computers selling surplus; computers trying new things; pioneers by person, then machine; sounds (the under-attack sound first; 8 written but never played); bridges (spec on branch fresh-notes, review/spec-roads.md); zeal and priests

## Raised Nov 23, not decided (his to call)
- The people cell: no warning before the cap, and it switches format at the cap; the army ceiling is a second hidden limit (options A, B, C in chat; Claude: A)
- The copy log counts paused time as a slow frame
- Mode (Hold, courage) is locked behind the Formations research; is that meant?
- The alarm sends the whole town into hiding for one raid on one camp (52 idle for two minutes)
- Rival 1 starves from about minute 23 (27 villagers, food at 0 to 30)
- Groups break at about 30% losses and archer-heavy armies broke in every fight
- His amok elephant killed 4 of his own (working as ruled; noted)
- A band holds while the foe comes on, also under archers who stop at range (partly fixed: they run in)

## From his v106 match, Nov 23 (155 min, seed 1845505063, stony; read from the copied log, not yet traced in code)
- A rival over the people cap: white at 186 of 180 from minute 107 to 117
- 8 of his villagers lost to "stampede" at 137:00 with no elephants of his own; cause unknown; no warning he would see
- Own-side kills: 1 of his at 134:00; 3 of white's by white at 154:00 (white had war elephants: amok?)
- The copied log orders the sides two ways: stores and armies as you, red, green, white; losses as you, green, red, white
- Warnings don't reach him: he never opened the news feed in 155 minutes (the stampede, the wall, the elephant under attack were all there); they belong in sound and on the map (with the sounds work). The feed also printed about 60 wall lines for one choke point
- Frames of 1.0 s at minute 98 and 1.1 s at minute 121 (ask: paused?)
- He starved at food 0 to 1 from 147 to 153 holding 13,900 stone; upkeep took about 70% of income at a full army (D211 as built; a balance call, his)
- 129 taps met "That line is full", 37 "No room: build a dwelling" (evidence for the people-cell item above); Mode refused twice behind Formations
- A rival sat on 25,000 wood, 14,000 stone, 12,000 iron with a full army and no goal (the selling-surplus job)
- Keep this log as the benchmark for after step 3

## From his second v106 match, Nov 23 (237 min, seed 3378513659, golden; read from the copied log)
- [x] A fallen side's store went to nobody (his find: "why am I not getting food from killing other towns?"): the side-falls line read the building's old by, since Nov 22 its board row; fixed, with a test that fells a side (v107)
- White's villagers drowned in batches, about 88 in the match (13 at minute 93, 14 at 96, 41 from 202 to 208); cause unknown
- "No way": 30 or more orders, up to 104 soldiers at once, on his attacks at A9 to A11 and on town centers
- Stampede killed soldiers too (2 of his, 1 of red's, minute 201)
- Over the cap again: red 171 to 174 of 168, green 186 of 180
- 350 taps met "That line is full", 63 "No room"; he removed 25 of his own villagers to fit soldiers
- Red sat on 24 villagers and 9 soldiers to minute 48; white sat at 180 with no goal for over 100 minutes; no rival touched a building of his until minute 206 (his town: a river north, sea south and west, one wall with towers east)
- His two Mints likely turned 8,800 stone into gold he did not need: stone at 0 from minute 116 (not traced)
- Frames of 1.9 s at minute 115 and 1.2 s at minute 141 (ask: paused?)
- Traps: the code runs each beat but nothing lays one; drop the trap look-up until the natives' design pass
- For after the freeze (his asks, Nov 23 22:27): a side fights on after its last seat falls, until its last person is dead, its people shown on the map; food from conquest

## Open, older
- "Tap to move and they don't move": no repro yet (copy the log right after it happens)
- Tapping one of your own soldiers while giving an order changes the pick
- A soldier whose chase finds no way drops his target and stands
- The computers place fields against any building (his house rule is 1 tile, 2 from the rest)
- A villager sent to a find still runs from robbers there and goes back, so she shuttles
- The workplace flag's place and size and the glow's strength are Claude's; to look at on the phone
- His calls waiting from Nov 22: the season rhythm; a forward base (A a Camp, B any far castle); Idle pulling a posted group
- Human-side test (plays every age, building, unit, card and button); then the 217 unsorted functions
- The colour talk: what red, green, blue, gold and cream mean; one look each for chosen, ready, unavailable; text sizes
- Build 4: pictures in memory, cap the cache; simulation speed last
- Prose out of the books into the comments book; lock finished parts byte for byte
