# Owed: the one open list [2026-11-01 07:45]

What is owed, in one place. `tests/handoff.py` prints the "Owed" section below. Strike a line when it is built, add one when something is put off. [2026-11-01 07:45]
Next version: `docs/4 Now/v81 List.md` (Albert, Nov 1, 07:36). Parked ideas: `docs/4 Now/Parked.md`. Locked decisions: `docs/3 Locks/`. [2026-11-01 07:45]

## Owed
The one maintained list of what is owed (Build 80 preview 10, Nov 1). `tests/handoff.py` prints this section; nothing else. Strike a line when it is built, add one when something is put off.
- Balance: preview 10's run against v70 is in `CUTS.md` (Bronze 5.7 against 4.4 min, Classical 9.4 against 8.2, Medieval 24.8 against 20.0, 7 of 16 sides). Read it before live. Every later rule change needs its own run. Owed: a 20-seed run on blocked villager-seconds (6.5 on e4d0c82, 37 now; a carrier jam older than tonight).
- Batch 3, not built:
  - the live test 4b (Natives and computers);
  - the wolf's prey choice (canBeat; the tempers 'flee' and 'hunt' are labels nothing reads, and the deer carries both `flee` and `temper`);
  - the arrival radius for animals; spots for priests, medics, the Town Center idle and the Emergency ring;
  - bug 4's leftovers (a held target is not re-tested by `ignorable`; the 320 home sweep is not gated by sight);
  - the spawn-chase re-test after decision 8;
  - bug 5 (walking under buildings) stays a live test.
- Decision 1, to settle with Albert:
  - "skip the danger map" is read as "leave finds on the danger map out" (as before);
  - computers see every find; only the player is held to sight (QC D9);
  - a villager waiting for a find shows Zs but is not counted idle (QC D10);
  - since Nov 1 (item 6) a computer's waiting villager is moved to the best crowded rate; yours wait for your word.
- Batch 4, not built: B3, B10, B11 (Albert's call).
- Batches 5 to 10, not built:
  - combat C11, C12, C15, C16; a message for a conversion refused at the army ceiling;
  - computers D2 to D8, N6 crowns, N7 ceiling, N8 peace mode (gifts to rivals wait on it), N16a raids;
  - text F2 to F9 and D16; the Aqueduct room and plague lines (settled by D-060 and D-061); `GUIDE.md` is now written by `publish.py` at each preview (D-071), the Build 70 snapshot kept in `docs/6 Records/v70/`; [2026-11-01 07:45]
  - the cards' hand-written markup left by E9, loose lines on cards, the icon pass, woff2;
  - cleanup; repository.
- The hunt of Nov 1 (report only, `docs/6 Records/v80 Audit/Hunt - Nov 1.md`): every fix waits for Albert's yes. [2026-11-01 07:45]
- Tests the audit found escaping:
  - 13 of the 15 mutation escapes (M1 to M12) are not planted;
  - the science tautologies (H2);
  - the gate's fixed card list (H3);
  - a field-by-field save round trip (M9);
  - the whole save chain v39 → 42 as one test;
  - the House fix check is still a text check;
  - the crosshair's colour and the notice toast's word have no test.
- Sources marked "from memory" in `SCIENCE.md` must be opened and checked before live: Pulliam, Lima, Reynolds (1987, 1999), Ydenberg and Dill, Blinn, the producer-scrounger idea, the Maynard Smith and Price paper itself, ISO 9920 and ASHRAE 55 (clo), Charnov; the Lucide licence text.
- Records: previews 1 to 6 were committed as "Claude <noreply@anthropic.com>"; Albert to say whether to rewrite them. The QC audit of preview 8 (13 reports and the fresh review) is in the session's scratchpad, not in the repo; Albert to say whether it goes into `docs/6 Records/v80 Audit/`. [2026-11-01 07:45]

- The Nov 1 batch (D-074, Albert 07:33, "Yes yes yes"), not built: A, 4b; B, the hunt fixes; C, the computers batch (D-068 by need, with the shift to plots); D, the combat leftovers (D-069 the occupancy message, D-070 the ambush); E, text (D-060 to D-064, D-071); F, the owed tests; G, the sources opened; the map's three zones (D-059); Relations with a Misfits page as a third tab and no gift slot for rivals (D-057, D-058, D-077), a picked stance shown as "Foe → Neutral" until ✓ (D-076); outlaws following their own regard (D-058); then the full QC and the preview. The docs system, first in the batch, is built in preview 11 (`docs/5 Builds/v80/p11/Docs Notes.md`). [2026-11-01 08:17]
- The research-truth audit of all 229 steps, after the batch (D-066). [2026-11-01 07:45]
- The v81 list: `docs/4 Now/v81 List.md`. [2026-11-01 07:45]

## Half done in v70
5. Loose lines left on some cards: section labels, paragraphs, the health bar (the cards builder takes these).
6. Setup and Market are exactly 13 ranks at 390 x 844, so a queued caravan makes Market scroll; on 375 x 667, Army and a Town Center with a queue scroll (exception #3).
7. The map's labels are drawn at 11 px; the three text sizes hold for menus, not yet for the map.
8. Colours still written by hand: the wild animals' health colour, the map ripple, the native wrapper's background.
9. Records: HANDOFF and GUIDE still describe the fairness check; Build 63's "wins by seat" are crown counts (fixed at the v70 close).

## Housekeeping
23. The automatic check that asks for commits in Claude's name and a push: removing it needs a permission Claude does not have.
24b. The stamps (git tags) cannot be pushed from Claude's session (refused); `STAMPS.md` lists each stamp's commit instead. Albert can push the tags from a computer, or leave it.

## Where the Build List went [2026-11-01 07:45]
Build 80 preview 11 split the v80 Build List: its agreed and amended items are locks (`docs/3 Locks/Decisions/` D-044 to D-056), its Owed, Half done and Housekeeping sections are here, its open questions and not-decided items are in `docs/4 Now/Parked.md`, and Albert's comments on v70 are in `docs/5 Builds/v70/Albert's comments on v70.md`. Its first two lines: [2026-11-01 07:45]

# Build List - v80 - Post Clean - Working
*Started Oct 31, 2026, 08:20, at the v70 line. Nothing here is agreed yet: each item waits for Albert's yes.*

## Gatherer caps: AoE2 comparison [2026-11-01 17:06]
Albert asked how AoE2 DE handles gatherers per resource. No opened source states a cap (Villager wiki, Berry Bush wiki, forgottenempires.net, aoe2-guide checked). From memory, unopened: no fixed cap, the limit is the room round the node; farms one farmer; depleted node sends the villager to the nearest same type. Open for the research-truth audit; Albert said to wait and see how the preview plays first.
- Preview 13 (Nov 2): soak and balance on the merged build with REACH (not yet run: D-088); Albert's steps for the idle count in the strip (D, not reproduced) and for farmers leaving a field (not reproduced: three tapped onto three finished fields stayed 5 minutes); the clearing question (Parked.md). [2026-11-02 00:10]
- From preview 13's balance run (Nov 2, CUTS.md): the computers' age-up on the merged build (Bronze 8.2 against v70's 4.4, Classical 12.9 against 8.2, with EXCEPTIONS #16 in); the aggressive seat taking every crown in 4 of 4; no computer caravans (D3's gold rule). Each needs Albert's call and a 20-seed run before a rule moves. [2026-11-02 00:45]
- From preview 14 (Nov 2): blocked villager-seconds rose to 169.5 a game (finds nearer the Town Center, more traffic round it: to trace); the aggressive seat wins 4 of 4 and every crown (since preview 12); the computers still near no caravans; EXCEPTIONS #16 (their mill and farm at the start) to re-measure without it now the finds are near; your call on W4 at placement: a house placed with no idle villager gets no builder (as asked), unless you pick builders first. [2026-11-02 07:48]
- From preview 15 (Nov 2): the Grower test needs 60 to 90 minute games (in 30 minutes it plays as the balanced brain); S (the re-think at each age-up, for every personality but the aggressive control) waits on it. [2026-11-02 09:16]
- The code size (Albert, Nov 2: "far too large"; a surface check, report only): the shipped file is 1.24 MB; the script 1,098 KB, 371 KB over the wire (gzip); comments are 19% of the source and ship in the file (2,353 of them); stripping comments and indentation at build time, the source untouched, gives about 809 KB and 263 KB over the wire (rough measure, Nov 2); a full minifier would cut more but could not be installed here (the registry was refused). No dead top-level names (1,306 checked). Largest files: 07-text 93 KB, 19-building-art 68, 04-rules-tech 62. Waits on Albert's yes. [2026-11-02 09:16]
- The parts map (`docs/4 Now/Parts map.md`, Nov 2): 13 base parts, their homes and what goes around them; the proposed order. Each fix waits on Albert's list and yes yes. [2026-11-02 10:19]

## Owed from Nov 4 (previews 52 to 54) [2026-11-04 13:40]
- The planted-bug set end to end on 54 (the run on 52 reached 80 of 381 in its 2 hours); the four plants that need a look (`docs/4 Now/Handoff.md`, Testing). [2026-11-04 13:40]
- The gate's one failure on 53's first publish, not yet identified. [2026-11-04 13:40]
- A balance run on the 15° map (every map lays on new squares since 54). [2026-11-04 13:40]
- The state of the modules page; more cards, element by element, once their pointers are named (the villager's states first). [2026-11-04 13:40]
