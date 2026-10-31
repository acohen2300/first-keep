# First Keep v70: review of src/32-frame.js, 33-verbs.js, 34-save.js

Reviewer: fresh eyes, read-only. Every line of the three files read. Tests run in a private copy
(scratchpad/ag-frame, Playwright, headless Chromium, 390x844), scripts in scratchpad/agf-scripts/t1..t9.py.
gate.py, soak.py, balance.py and probe.py were not run.

## S1: crashes and data loss

### S1-1 VERIFIED. The Resume card does not protect the save it offers: one trip out of the app wipes the game
34-save.js:171, 469-472; 41-boot.js:116-121; 33-verbs.js:35-41.
`holdSave` is meant to stop anything overwriting the save while "Welcome back" waits (comment at 34-save.js:166), but
`saveGame(force)` skips that check when `force` is true, and the visibilitychange and pagehide handlers always pass
`force`. At boot, G holds the throwaway `newGame()` made at 41-boot.js:89 (t = 0).
Test t4/t9: a game saved at 2:00, page reloaded, Resume card up, then:
- one pagehide: main = 0:00 game, .bak = 2:00 game. Tapping Resume loads the **0:00 blank game** (readSave reads
  main, which parses, so .bak is never tried). The next boot shows Setup, not Resume.
- two forced saves (visibilitychange followed by pagehide, which is what closing a tab does): main = 0, .bak = 0. **The
  game is gone for good.**
On a phone: open the app, see Welcome back, switch to another app or let the screen lock, and the game is replaced.
Fix: `if (holdSave) return;` with no force exception (the only forced saves that should pass are after `loadGame`, `fresh`
and `today`, which already clear holdSave first).

### S1-2 VERIFIED. ✕ or Back on the Resume card plays a random game that never autosaves and later overwrites the real one
33-verbs.js:35-45; 34-save.js:171.
`ACT.close` on the resume card un-pauses and closes it, but leaves `holdSave = true`. Test t9: after ✕, the boot's
random seed game runs (G.t 12 s later = 12) and the 10 s autosave never fires (main stayed at 2:00). The first hide or
close then force-saves this unwanted game over the real one (see S1-1). `cardback` on the first card calls `close`, so
the title bar's Back does the same. `ACT.resume` has the same hole in its `else` branch (no save to read: it closes and
plays with holdSave still set).
Fix: the Resume card is not closable. Either ✕ means Resume, or it opens Setup. Clear holdSave only where a game is
actually chosen.

### S1-3 VERIFIED. A finished game comes back as "Welcome back"
16-sim-fight.js:325 (`finish` calls `clearSave`); 34-save.js:288, 298, 307-311.
`clearSave` removes the main key only. `.bak` survives, and `readSave` falls back to it when main is missing. Test t5:
a game won or lost, then reload, offers Resume for the game that already ended, at its state of 10 s earlier. Same leak
in `ACT.fresh` and `ACT.today`: the previous game's .bak lingers and is what loads if the new game's first save is ever
broken.
Fix: clearSave removes `SAVEKEY` and `SAVEKEY + '.bak'` (2 lines).

### S1-4 VERIFIED. The ".old" shelf is overwritten: "kept aside, never lost" is false
34-save.js:290-295.
When the main save is newer than this build's SAVEV it moves to `.old` and main is removed, but `.bak` is not. The next
boot finds main missing, reads `.bak` (also too new), and writes **it** over `.old`. Test t6 #2: `.old` held the 1:00
game after the first boot and the older 0:30 game after the second. It is rewritten on every boot after that. This is the
exact case for v70 and preview sharing a phone with a newer build on the preview path (keys are separate per path, see
"Keys" below, but a preview that rolls back from SAVEV 40 to 39 hits this).
Fix: do the stale check once on the key read, never overwrite an existing `.old` that holds a newer v, and remove or
skip the stale .bak.

### S1-5 VERIFIED. A migration or load that throws makes the save unreadable and it is then silently deleted
34-save.js:289, 297-299 (readSave); 34-save.js:312-468 (loadGame); 33-verbs.js:132-140.
- MIGRATE[35] calls `UNIT[j.kind].cost` / `TECHBY[j.tech].cost` without a guard. A queued order of a unit or tech cut
  since then throws. Test t6 #3: readSave returns null, the save stays in main (not moved to .old, `staleSave` not set,
  the Setup card says nothing), and the next `fresh` (`clearSave`) or two autosaves delete it.
- `loadGame` validates buildings and units but not `S.ev.cur.kind` (line 446 reads `EV[e.kind].tick`), queue entries,
  `p.techs` ids or `p.civ`. Test t6 #4: an event kind not in EV throws in the middle of loadGame, after G was already
  replaced and half filled (165 units in). `ACT.resume` has no try, so the error goes to the click handler and on to
  `fault`. The Resume card stays, holdSave stays true, and G is a half-loaded game, which a hide then force-saves.
Fix: wrap migrate and load in one try. On failure, move the raw string to `.old`, set staleSave, and rebuild a clean G.
Give MIGRATE[35] a `?.cost || {}`.

### S1-6 VERIFIED (mechanism) / SUSPECTED (impact). A reloaded game does not continue the same game
Test t2/t3: the save restores `rs` exactly, yet after one step from load the rng state and unit positions differ from the
game that was never saved, and resources and building counts drift apart by 20 s. Turning off the hundredths rounding
(t3) removes the position drift at step 1 but not the rng divergence. The cause is the SKIP_U fields (`tgt`, `focus`,
`path`, `so`, `pv`, `pk`, `pf*`, `drop*` …): every unit re-decides on load and spends rng. No crash. But "deterministic
from the seed" stops at a save. A mid-battle load drops every target (the fight hold at 167-173 only delays the save by up
to 60 s; it does not fix this). The gate's save check (gate.py:144) only compares G.t, so it cannot see this.
Fix: accept it and say so in the save's comment, or save the cheap fields that change decisions (tgt id, focus id, path).

## S2: wrong behaviour

### S2-1 VERIFIED. An urgent tip's count climbs about 7 times a second, paused or not, and never resets
32-frame.js:538-542 with 349-356.
Each `ui()` (about every 150 ms, paused included) re-sends an urgent tip, and the merge check (`G.t - m.t < MSG.merge`)
never expires because `same.t = G.t` is refreshed every call, and G.t is frozen while paused. Test t8: 20 ui calls gave
"Hungry ×20". In play this reads "Advice ×400". It also keeps the red line showing for as long as the condition holds.
Fix: re-say an urgent tip on a timer (every MSG.merge seconds), not every frame.

### S2-2 VERIFIED. "Warnings always show" is false: hunger, unrest and fire rank under routine tips
32-frame.js:415-480 vs the comment at 33-verbs.js:1016.
`advise()` returns the first match, and `!Hungry` (462), `!A vassal is restless` (469) and `!Fire!` (475) come after a
dozen beginner tips. Test t6 #1: with `hungry = true`, the line shown was "More villagers, more of everything." The
urgent lines are reached only once every earlier tip is learned (L ≥ 3) or false.
Fix: test the three `!` lines first.

### S2-3 VERIFIED. Difficulty changes the running game; Easy mid-game turns off every hazard and keeps the hazard score multiplier
33-verbs.js:168-174 (`G.diff = a`); 29-card-pages.js settingsHTML is on the Help card mid-game (30-cards.js:776);
37-events.js:13 (`hz()` is false on Easy); 37-events.js:15 (`levelMul` reads G.hz only).
The Help card text says these settings "take effect in the next game". Difficulty does not: it takes effect now. A Hard
game with hazards switched to Easy loses its hazards and its raid timing but keeps "score ×1.x". Fairness rule broken.
Fix: drop `G.diff = a` (one line).

### S2-4 VERIFIED. Disabled buttons still run their verb
33-verbs.js:1080-1088. The handler flashes `.nope` and then calls `act()` anyway. Most verbs check again and say why;
`attack` does not. Test t6 #5: "Attack nearest" (drawn `dis`) with no soldiers says "Marching on the Raiders." This is
one rule for every button: a `dis`/`lock` tap should never reach the verb, or every verb must check again. Today it is
neither.
Fix: `return` after the nope flash for `dis` (keep `lock` → shut() if that is the intended teaching path).

### S2-5 VERIFIED. Unit orders bypass the one order door
33-verbs.js:606-618 (phold), 846-856 (scoutgo), 861-876 (attack), 935-949 (spygo), 966-996 (guard/unguard).
These write `u.state`, `px/py`, `target`, `focus` and `tgt` directly, while the quick action uses `order()`.
`attack` does not clear `u.ord`, `tgt` or `focus`, so a unit already on a march order keeps its ord and its old target.
`phold` clears ord; attack and scoutgo do not. One home is broken, and the leftover ord keeps the old order's ring and
Army-card line alive.
Fix: route them through `order()` / `sendHome()` with a target type.

### S2-6 VERIFIED (by reading). Milestones are tested from the view, at frame rate, and fire while paused
32-frame.js:528. `G.tick % 90 === 7` is sampled only when ui() runs (about every 4-5 ticks at 1×, rarer at 3×), so the
check runs at random, roughly once in 4 to 13 game-seconds. When the game is paused on a tick ≡ 7, it fires on every ui
call. Test t8: one milestone fired with the game paused. G.ms is saved sim state written by the view.
Fix: call milestoneTick from the once-a-second events tick.

### S2-7 VERIFIED. Two hints never retire
32-frame.js:452-461. `L('goto')` and `L('envoy')` are read, but nothing ever calls `learn('goto')` or `learn('envoy')`
(grep: learn is called only in learnAct and 11-orders.js:153). "Treasure nearby" and "A neutral side could be your ally"
come back for ever.

### S2-8 VERIFIED (reading). State carried across games
- `fightHold` (34-save.js:168) and `saveFailT` (169) are never reset on newGame or load. After a fight at t = 500 in one
  game, the next game skips non-forced saves during any fight until t = 560 (not 60 s), and save failures are silent
  until then.
- `staleSave` is never cleared: Setup keeps saying "your last game came from an older version" for the rest of the
  session, even after a new game is saved.
- The mail (`G.mail`, `mailN`) is not saved: every message is lost on Resume (round trip t1: 9 → 1). It may be intended,
  but the frame's comment says "every line is kept in the mail".

### S2-9 SUSPECTED. Hold to read a research step barely works on touch
33-verbs.js:1050. Any `pointermove` cancels the 450 ms hold timer. On touch, a resting finger reports moves of 1 px.
Use a distance threshold, as 26-input does for its own hold.

### S2-10 VERIFIED. The age short name "Peace" is not the age's name
32-frame.js:151. `AGE_SHORT` turns "Enlightenment" into "Peace", a different word, not a short one. It is also a second
copy of AGES' names (index-parallel: an age added or reordered goes silently wrong). Put `short` on AGES (01) and read
`A.short || A.name`.

### S2-11 VERIFIED (reading). Smaller ones
- `readSave` (34-save.js:296): a save without 5 sides returns null without trying .bak or moving it to .old, and is then
  overwritten. A save with no `v` gets `staleSave = undefined`, so no message.
- `muteBtn` (32-frame.js:194-195) sets both `off` and `on` to "muted". `on` is the gold "chosen" ring in COLORS, which
  contradicts the colour code. Drop the `on` line.
- `tell()` hears only `cls === 'warn'` while `urgentCls` uses `startsWith('warn')`. No `warnX` class exists, so
  startsWith is dead generality.
- `PLAY.tpost` checks cost before age: a Stone-age player is told "Not enough", not "needs Bronze".
- After a load, `$('qa')` (the quick action) is not hidden (loadGame closes the card and placement, not the quick block).

## S3: rule violations and bloat (estimated lines saved)
- Pairs that differ only by `picked()` vs `orderSet()`: charge/pcharge, fallback/pfall, recall/precall. Also vgo/dismiss
  (the same five lines to send a villager home). One verb each with a source argument: about 25 lines.
- resume/fresh/today repeat the clearSave, holdSave, newGame, closeCard, setPause, saveGame, refresh sequence: one
  `startGame(seed)`, about 10 lines.
- `qbuild` and `buildrow` share the suggestAt→MENUS lookup line for line, and `pbuild` repeats the
  `G.lastMenu || MENUS[0].id` fallback. One `openBuild(at)`: about 8 lines.
- loadGame restores about 70 fields by hand, in two styles (inside the Object.assign and as separate lines after it),
  each with its own default that copies blankGame's. saveGame lists the same 70 by hand. A field list (or "save every key
  of blankGame except a VIEW set") would cut about 120 lines and stop the next "forgot to save X". The current lists
  agree (checked by script: saved = loaded, 72 keys).
- Hand lists that copy tables: `['f','w','s','g','i']` (32-frame.js:513), buildPanel's `[['f','Food'],…]` (165-170,
  copies RESOURCES' names), `AGE_SHORT`, and STATUS vs the parallel `S` array in ui() (index-matched). About 15 lines,
  and four places that silently go wrong when a resource or status cell is added.
- Silent catches: 32-frame.js:391-392 (a broken milestone test vanishes), 34-save.js:414 and 421 (a bad fog or tread
  string is silently skipped; acceptable), 33-verbs.js:1057 and 1064. The milestone one hides real errors.
- Dead code: `typeof spdPop === 'function'` (32-frame.js:207; it is a hoisted function in the same scope). `ACT.spd`
  calls paceBtn again after setPause already did. MIGRATE[33] is an empty step (fine as a chain link). `G.lost` is
  written in 12-sim-core.js:324 and read nowhere.
- Stale or contradictory comments: 33-verbs.js:90 has two comments back to back; 33-verbs.js:1016 "Warnings always
  show" (see S2-2); 34-save.js:166 "nothing may overwrite the save it offers" (see S1-1); 34-save.js:295 "never lost"
  (see S1-4); 32-frame.js:341, where the "Messages off" comment sits on the line after the code it describes.
- `ui()` is 150 lines doing seven jobs (tally, research count, tips, status pill, pick bar, placement text, preview).
  The pick bar (583-639) and the tip state (529-542) should be their own functions.

## S4: minor
- `tapCount` writes the whole TAPS JSON to localStorage on every tap (synchronous; fine at this size).
- The `dis|lock` regex is evaluated twice in the click handler.
- `pvhide` does not call `ui(true)` (the next say does it indirectly).

## Keys: live, preview and v70
The brief said the keys are shared in v70. **They are not.** keyOf (08-core.js:158-160) prefixes `firstkeep.preview.` or
`firstkeep.v70-restoration.` from the URL path, and live (still Build 41, SAVEV 31, `firstkeep.save` hard-coded) uses
`firstkeep.`. Preview and v70 copy the live settings, taps, best and the newer of live's save/.old into their own keys,
once. I found no way for these builds to clobber each other. The remaining risk is inside one path when a build with a
lower SAVEV runs after a higher one (S1-4).

## Round-trip results (t1)
Mid-game (4 min, 215 units, 101 buildings): save 210 kB. No entity object references in the serialised units, buildings,
sides or top-level fields. No non-finite numbers. Saved and loaded field lists agree (72 keys). After load: t, tick and rs
match. Resources differ only by rounding. Node `wk` 43 → 41 (transient, recount fixes it). Mail 9 → 1. Divergence after
load: see S1-6.

## Not checked
How older saves (shapes 27 to 38) behave in play beyond the gate's walk through the chain. iOS-specific event order
(visibilitychange vs pagehide). Every card renderer that emits a verb (I matched names, and every emitted verb has a
handler). The sim functions the verbs call.
