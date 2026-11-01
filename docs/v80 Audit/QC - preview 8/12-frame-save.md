# QC 12: frame, save, sound, events, row, Emergency, boot (v80 HEAD c3b4964 vs v70 88b2cb2)
Read in full: 32-frame, 34-save, 35-sound, 37-events, 39-huddle, 40-emergency, 41-boot; save paths in 33-verbs; tests/saves.py. Read only, no browser.
Tags: C traced, sure · K fairly sure · S suspect.

## 1. Prior findings: status

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| P1 | A1 FIXED. Forced saves (switch away, close tab) now stop while Resume waits | 34-save.js:180, 489-492 | C | was total save loss | - |
| P2 | A2 STILL OPEN BY ANOTHER DOOR. ✕ and Back are locked, but the top bar and the row stay tappable under the Resume card (#card sits above #orders). A tally tap opens Stores over Resume (from = null, cardTap false); ✕ on Stores closes it; play runs the boot's random game with holdSave still true: it never saves, and next launch Resume shows the old game. Pause also unpauses the game behind the card | 33-verbs.js:5-8, 37, 351-354; 27-cards-core.js:10; 34-save.js:167, 180 | K | a whole session of play silently unsaved | in act(): while cardLocked(), run only resume, card:setup and the setup verbs |
| P3 | A2 remainder: ACT.resume with no save to read closes and unpauses with holdSave still true (rare: save gone between boot and tap) | 33-verbs.js:147-150 | K | same silent no-save | clear holdSave there, or open Setup instead |
| P4 | A3 FIXED. clearSave removes .bak; finish calls it | 34-save.js:325-330; 16-sim-fight.js:345 | C | - | - |
| P5 | A4 PARTLY FIXED. .old is per shape now, but the stale branch removes main only; .bak (same newer shape) stays. Next boot: main missing, .bak read, migrated as far as it goes, then written over .old<v>: the newer game is replaced by the older backup, every boot until a new save | 34-save.js:297-303 | C | the "kept aside" save is the wrong one | in the stale branch move .bak aside too (or remove it); never overwrite an existing .old<v> |
| P6 | A5 MOSTLY FIXED (MIGRATE[35] guarded, readSave catch keeps aside, Resume wrapped). But when loadGame throws, keepAside moves main to .lost and offers a new game without trying .bak (often a good save 10 s older); Start then runs clearSave and deletes .bak. If the failing S came from .bak itself, nothing is kept aside (main is empty) yet the card says "kept aside" | 33-verbs.js:136-146, 154; 34-save.js:311-318 | K | a recoverable game is deleted | on load failure try readSave('.bak') before Setup; keepAside the key actually read |
| P7 | .lost is one slot: a second damaged save overwrites the first (the same fault A4 had, fixed for .old only) | 34-save.js:314 | C | earlier damaged save lost | '.lost' + Date.now(), or keep the first |
| P8 | Damaged main with a good .bak: staleSave = 'damaged' is set, Resume is offered and works, but staleSave is not cleared by loadGame, so New game later says "your last game could not be read" | 34-save.js:307, 486; 30-cards.js:456 | K | wrong message | staleSave = 0 in loadGame |
| P9 | A6 per N1: rs saved, targets re-picked; unchanged since v70, as decided | 34-save.js:129-165, 208 | C | accepted | - |
| P10 | A7 PARTLY FIXED. endEvent now runs on load (quicksand, mirage, meteor, wildfire end). Mercenaries: evSave drops e.f, so end() finds no find: hired mercs never leave and the camp stays hireable. Troll: e.units is rebuilt from u.herd, the troll (wildAt) has no herd flag, so end() kills nothing: it lives for good | 34-save.js:123-127, 462-466; 37-events.js:354-369, 404-419; 10-world.js:703 | C | the exact A7 cases still live | save e.f id and unit ids in evSave (or mark the troll herd/evt) and relink on load |
| P11 | Fog has no tick and no knobs, so it is dropped on load, against the comment "a fog goes on" | 34-save.js:465-466 | C | low | fix the comment or the test |
| P12 | A8 FIXED for fresh, today and next (freshSlate clears seenErr) | 33-verbs.js:30, 156, 219; 34-save.js:169-174 | C | - | - |
| P13 | A9 STILL OPEN (it was in batch 2): G.mail and mailN not saved; every message lost on Resume; 32-frame comment says "every line is kept in the mail" | 34-save.js:201-280; 32-frame.js:259 | C | low | save mail (30 lines) or change the comment |
| P14 | A10 FIXED for deliberate new games (fightHold, saveFailT, staleSave) | 34-save.js:169-174 | C | - | - |
| P15 | A11 FIXED ('menu:land') | 07-text.js:605 | C | - | - |
| P16 | B8 FIXED per N2: Easy has no bonus (×1, the sound reading of "zero the multiplier"); difficulty applies from the next game | 37-events.js:15; 33-verbs.js:181-185 | C | - | - |
| P17 | C17 FIXED: threats in blankGame | 10-world.js:8 | C | - | - |
| P18 | C18 FIXED: All hands shows on (gold), red only when off | 40-emergency.js:201 | C | - | - |
| P19 | C19 FIXED, but over-wide: every alert now skips the cap, and the alert channel holds coin, done, ready, readySol, tribute (common sounds, 4 to 7 voices each). A busy economy can hold the voice count over the fx and amb limits so hits and ambience drop out. VOICES.keep.alert is now dead | 35-sound.js:346-378 | S | battle sounds may go quiet | split a 'must' set (horn, win, lose, age, roar) that skips the cap; keep the rest capped |
| P20 | frame S2-1 STILL: an urgent tip is re-said on every ui() (about 7 a second, paused too); the merge never expires, so "Hungry ×400" | 32-frame.js:538-541, 349-356 | C | noisy, wrong count | re-say an urgent tip every MSG.merge s |
| P21 | frame S2-2 STILL: Hungry, restless vassal, Fire rank below beginner tips | 32-frame.js:462, 469, 475 | C | warnings hidden | test the three '!' lines first |
| P22 | frame S2-6 STILL: milestones tested from the view at frame rate (G.tick % 90 === 7), fire repeatedly while paused on that tick | 32-frame.js:528 | C | sim state written by view | call milestoneTick from eventsTick |
| P23 | frame S2-7 STILL: 'goto' and 'envoy' hints never retire (no learn call) | 32-frame.js:452, 459; 33-verbs.js:1037-1046 | C | low | learn them in learnAct |
| P24 | frame S2-10 STILL: AGE_SHORT 'Peace' for Enlightenment, a second copy of AGES names | 32-frame.js:151 | C | low | short on AGES |
| P25 | frame S2-11 STILL: a save without 5 sides returns null without trying .bak or keeping it aside; the boot's t=0 game then overwrites it on the first switch-away. A save with no v goes to '.oldundefined' with no message | 34-save.js:299-305 | C | low, save lost | treat as damaged: keepAside, then .bak |
| P26 | muteBtn sets both off and on | 32-frame.js:194-195 | C | low | drop the on line |
| P27 | dead `typeof spdPop === 'function'` | 32-frame.js:207 | C | low | drop the test |
| P28 | tell() hears only cls === 'warn', urgentCls uses startsWith | 32-frame.js:278, 296 | C | low | one rule |

## 2. v80 changes and what tests/saves.py misses

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| D1 | Storage only grows: .old<v> per shape and .lost are never removed, and keyOf prefixes share one github.io origin (live, preview, v70, about 0.2 MB a save, x2 with .bak). If setItem('.old'+v) throws on quota, the catch calls keepAside('damaged'); if that throws too, main stays, nothing is said, and the next Start (clearSave) deletes the old save | 34-save.js:300, 307, 311-318 | S | old save lost under quota | catch the stale write separately; on failure leave main and say so; cap the shelf |
| D2 | The test sets holdSave itself (setHold), so boot's holdSave = true is never tested; setHold ships in the live __fk | tests/saves.py:9-11; 41-boot.js:119, 458-460 | C | a regression at boot passes the gate | drive the boot path (save, reload, check holdSave) and drop setHold |

What tests/saves.py does not test: real visibilitychange/pagehide events (it calls saveGame(true)); boot setting holdSave; the top bar and row doors around the Resume card (P2); ACT.resume (success clears holdSave, load failure, no-save branch); a new game after two errors actually saving (A8) and freshSlate (A10); the finish() path end to end; the .bak fallback; stale .bak overwriting .old (P5); a migration or loadGame that throws (only MIGRATE[35] is called directly, and the "damaged" case is bad JSON only); .lost overwrite; P.length !== 5; quota; A7 beyond a string match (mercs and troll still fail, P10); C18, C19 by regex only.

## 3. New bugs

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | hudFire aborts the slot's running mission before order(); if order refuses, the old mission was sent home for nothing | 39-huddle.js:141-144 | K | low | abort after the order succeeds |
| N2 | Before Battalions the army's mission takes the first free slot; once Battalions arrives, Go on that squad silently aborts the army mission | 39-huddle.js:137, 141, 149-150 | S | low | refuse or say so when the slot holds sq null |
| N3 | Must-play sounds (horde horn, win/lose) are refused while AudioContext is suspended or interrupted (after a lock or a call); it is only woken by a tap | 35-sound.js:37-41, 376 | S | horn silent after a lock | try AC.resume() in sfx for the must set |

Timers and flags between games: checked EVM (evmSet in newGame and load), fightHold, saveFailT, staleSave, seenErr (freshSlate), holdSave (loadGame, fresh, today), G.emg, G.hud, G.msn (inside G). Nothing else carries, except P8 (staleSave after Resume) and P2/P3 (holdSave left true).
