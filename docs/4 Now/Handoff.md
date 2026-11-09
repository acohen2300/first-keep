# First Keep: handoff (Nov 9, 2026, 06:50; v100 at B31b, live)

**A new chat starts here.** Read this file, then `Calls - Nov 8.md` (every decision), `Build plan - Nov 8.md` (plan and log) and `Next build list.md` (agreed items waiting to build, Nov 9 on). Albert's standing rules live in Claude's memory too.

## Where it stands
- Code: `frankenstein-refresh/v100/` (index.html, combat.js, econ.js, menu.js, books/*.js). Live: https://acohen2300.github.io/first-keep/frankenstein-refresh/v100/
- Last builds, all pushed: B24–B30 (Nov 8 plan), B31a (PDF guide lines back and locked, the stuck-finger tap bug, pop-ups above the finger, map words one size), B31b (the villager's 2×2 square; scroll past the board: sea on the sides and below, sky above).
- Gate: `python3 index.py` (permit.json: opens, grow; numbers only in books; comments only as one E-code per line). Publish: `python3 publish.py --smoke "<message>"` then commit as Albert with the trailer; push. Two quick pushes collide on Pages: fold docs into the build push.

## The core values (Albert Labs: check every piece against them, in order)
1. Is it fair? (what's good for the goose is good for the gander; if it's unfair, it's out)
2. Does it follow our logic and rules?
3. Is there a real-life solution? (nature, science, history, another game)
4. Real-life math? (the equation, its source, where it lives in the code)
5. Science?
6. Purpose?
7. Function?
8. One home?
Rigid on zero stray numbers: every value in its book, with a citation and a comment, with a rhyme or reason. Beside them: the goal is a perfect product (profit is a bonus); logic above all; ruthless quality control; nothing goes away until it is solved or deliberately removed.

## Rules (Albert)
- No building without a double confirm ("yes yes"); mock screens first; talk mode when asked.
- ECS: one home, books hold every number and word, cited; no patches, redo cleanly; log every cut in `Parked.md`.
- Check v100 and Mid (`frankenstein-refresh/mid/src`) for logic to reuse before proposing new.
- Concise. Decisions as short Problem/Idea, 3–5 at a time; record answers as we go. No tap-and-hold. Real math with sources. Objective pushback.

## Open, waiting on Albert
1. **The black bar** (the ghost's label without words, his phone, 21:49): likely his phone mixed a new page with an old book file (B31a moved the label's nudge into SN14). Asked him to reload and check. Proposed fix if confirmed: **publish one stitched file** (source stays split; publish writes one page), so a phone can't mix builds. He called per-file version tags a bandaid.
2. **The "Something is in the way" card**: he said it's oddly sized; asked what looked off; held.
3. **The paused panel** sits where the help line shows; they can overlap. Not raised as a build yet.
4. Reminders he asked for: Choke and Bombard; the map's hold gesture (box pick) still exists; help moved into each item's own card; what a tap on a building does; hunting; mind-your-own-business setting.

## Next in the plan (start only on his go)
- B32: conversions over the cap wait for a house; building health by age material; **villagers fight** (Lanchester; the square's Attack only hunts until then); animals by the randomizer.
- B33: quick start, race mode, simple mode. B34–B36: the rest of the Nov 8 triage (`Triage - Nov 8.md`, 96 answered).

## Known
- `python3 test.py t-walls` crashes the same way before and after B31a: a harness fault, owed.
- Garrison in the square is dim with no foe near (a sheltered villager leaves when none is near, as fright's rule).
