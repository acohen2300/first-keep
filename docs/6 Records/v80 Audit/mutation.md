# First Keep v70: can the tests fail? Mutation test of the gate

Tester: fresh-eyes agent, 2026-10-31. Read-only on the repo. All work was done in
`/tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/ag-mutation`, a copy of `scratchpad/fk`.
At the end its `src/` matched the repo again (checked with `diff -rq`), and it was rebuilt clean.

## Method

1. **Control (VERIFIED).** A full `tests/gate.py` on the clean copy passes with exit 0. It took 1 min 59 s, not 8 to 10 min. `tests/lint.py` exits 0 with no warnings.
2. **Harness.** `scratchpad/mut/run.sh` runs these in order: build.py, wrap.py, lint.py, tables.py, palette.py, words.py, science.py and history.py. Then `scratchpad/mut/lite.py` runs gate-lite. Gate-lite runs gate.py's own JS strings verbatim, loaded with `exec` from `tests/gate.py`: verbs(), SETUP, CARDS, MEASURE and QUICK at 390x844, then PLAY, EVENTS_TEST and the play fingerprint. It drops only the other 7 viewport passes and the TITLES, SLOT_WORDS, DOUBLES and map checks, which none of the mutations touch. The control passes gate-lite.
3. **One mutation at a time.** For each: apply it, run the harness, then restore `src/` from the repo with `revert.sh`.
4. **Stacked run.** All 18 escaped edits were applied together and the **full official gate** was run once more. That makes 2 gate runs out of the 8 allowed.
5. **Proof the escapes are bugs.** A browser probe (`scratchpad/mut/probe12.py`) ran the clean build and the stacked build side by side. This shows the escaped edits change real behaviour and are not harmless.

## Results

| # | Mutation (file:line) | Caught by | Status |
|---|---|---|---|
| M1 | Catapult cost w 200 to 20 (`src/02-rules-units.js:352`) | nothing | **ESCAPED**, VERIFIED |
| M1b | Spearman cost w 25 to 20 (`src/02-rules-units.js:132`) | gate: "the game plays as the baseline says" (minute 3: wood 200 now 210) | CAUGHT, VERIFIED |
| M2 | Debase button verb `'debase'` to `'debaseCoin'`, on a multi-line `btn(` call (`src/29-card-pages.js:78`) | nothing | **ESCAPED**, VERIFIED |
| M2b | `sellat:` to `sellAt:` in a template (`src/29-card-pages.js:494`) | nothing (`verbs()` returns []) | **ESCAPED**, VERIFIED |
| M2c | `btn('sqcancel'` to `btn('sqcancl'` (`src/39-huddle.js:482`) | verbs(): `['sqcancl']` | CAUGHT, VERIFIED |
| M2d | `` btn(`storesk:`` to `` btn(`storesK:`` (`src/30-cards.js:396`) | verbs(): `['stores']`, the right failure for the wrong reason (the regex keeps the lowercase prefix) | CAUGHT, VERIFIED |
| M3 | "+N more" cancel slot index `q.length - 1` to `q.length` (`src/29-card-pages.js:118`) | nothing | **ESCAPED**, VERIFIED (that the tap now does nothing is inferred from `cancelOrder`, which returns on `!j`) |
| M4 | Bits and bridles effect `s: 'spd'` to `s: 'speed'` (`src/04-rules-tech.js:1373`) | nothing | **ESCAPED**, VERIFIED. Probe: chariot speed with bridles is 37.8 clean, 36 mutated |
| M5 | `rng()` to `Math.random()` in villager re-check (`src/13-sim-civil.js:285`) | gate fingerprint, minute 1 | CAUGHT, VERIFIED |
| M5b | `rng()` to `Math.random()` in firearms hit (`src/16-sim-fight.js:38`) | nothing | **ESCAPED**, VERIFIED |
| M6 | newGame danger-map reset removed (`src/10-world.js:146`) | nothing | **ESCAPED**, VERIFIED. Its effect on play (a stale threat map in the new game's first second) is SUSPECTED |
| M7 | `#e6b947` (Gold 1) written by hand in the Stores card (`src/30-cards.js:391`), also tried as `#E6B947` | palette.py: "#e6b947 (--gold-1) is written by hand 1 times" | CAUGHT, VERIFIED |
| M7b | Same colour as `rgb(230,185,71)` | nothing | **ESCAPED**, VERIFIED |
| M7c | `#e6b947` in a view file (`src/24-view-overlays.js:110`) | nothing (palette's `ui` scope is files 26-33 and 39+) | **ESCAPED**, VERIFIED |
| M8 | Four extra ranks on the Stores card (`src/30-cards.js:385`) | gate cards: `stores: scroll:522>500` | CAUGHT, VERIFIED |
| M8b | Here card: 12 extra ranks, a 9 px text line and a 900 px-wide div (`src/30-cards.js:342`) | nothing. The card is opened by PLAY but never measured | **ESCAPED**, VERIFIED |
| M9 | `mkt` and `ms` dropped from the save (`src/34-save.js:206`, `:249`) | nothing. Probe: the clean build saves `mkt.f 1.37` and the milestones; the mutated build saves `null, null` | **ESCAPED**, VERIFIED |
| M10 | Debase gold and the wayfarer's food written straight to `p.res`, skipping `earn()` (`src/36-economy.js:650`, `src/14-sim-troops.js:527`) | nothing. Probe: ledger.in is `{"mint":600}` clean, `{}` mutated | **ESCAPED**, VERIFIED |
| M11a | Cancelling an age-up: `j.age` dropped from `whyOf` and from the `spent` give-back (`src/11-orders.js:39`, `:46`) | nothing. Probe: the resources come back wrong, the ledger keeps "research 400" and `spent` goes 0 to 400 | **ESCAPED**, VERIFIED |
| M11b | Refund only for research: `if (j.tech) payBack(...)` (`src/11-orders.js:45`) | nothing. Probe: cancelling a villager gives back 0 food (clean: 50) | **ESCAPED**, VERIFIED |
| M12 | Milestone text key `house` renamed (`src/07-text.js:601`) | nothing. In play: **TypeError in milestoneTick at the first finished house, thrown from `ui()` every frame** (probe) | **ESCAPED**, VERIFIED |

**Stacked confirmation (VERIFIED).** With all 18 escaped edits applied at once (M1, M2, M2b, M3, M4, M5b, M6, M7b, M7c, M8b, M9 x2, M10 x2, M11a x2, M11b, M12), the full official `python3 tests/gate.py` prints PASS on all 29 lines and exits 0. lint.py also passes.

**Score.** 6 caught, 15 escaped, out of 21 single mutations.

## Why each escape got through: the structural gaps

1. **Nothing checks resources for units.** tables.py tests one cancel only: a Stone Age research at the Town Center. No check covers cancelling a unit, cancelling an age-up, or the "+more" slot. PLAY counts the queue length after `qcancel`, not the money. *Would catch it:* a tables.py loop over every order type (unit, tech, age, muster) that asserts the resources, `spent1`, `ledger.out` and `p.spent` all come back exactly.
2. **The fingerprint is narrow.** One seed, 5 minutes, Stone to Bronze, and only villagers, spearmen, a house, barracks and a farm. It catches only changes on that path (M1b, M5). Catapults, firearms, techs, Bronze-plus units and events are invisible to it. *Would catch it:* a second fingerprint script that reaches Age 3+ and trains every `at` building's units, or a determinism check (run the same seed twice and compare a hash of `G`). The determinism check would catch any `Math.random` in the simulation regardless of path. Simplest of all: a static grep forbidding `Math.random` in `src/1[0-7]-*.js`, apart from the seed line in newGame.
3. **No check that research effects are read.** An `fx.s` that no code reads is a silent no-op. *Would catch it:* tables.py collects every `fx[].s` and asserts each one appears in a `fxv(o, '<s>'` call in the source. A one-line set comparison, the same pattern as verbs().
4. **The save is never compared field by field.** PLAY checks only that `G.t` survives a reload. *Would catch it:* save, load, then deep-compare `G` minus a documented skip list. Or at least assert that every key of `blankGame()` is in `S` or on an explicit "not saved" list.
5. **The ledger rule is not enforced.** The comment in 08-core says "every resource in or out goes through earn and spend", but no test checks it. *Would catch it:* a static grep that fails on `res\.[a-z]\s*[+-]=` or `res\[[^\]]+\]\s*[+-]=` outside `earn`, `spend` and `payBack`. A scenario reset with `=` would need its own allowance.
6. **The verb check is blind to half the handlers.** `verbs()` regex-matches only `data-act="verb` and a single-line `btn('verb` or ``btn(`verb``. 85 of 169 handlers are never seen at a call site: their verbs are built in templates (`` `sellat:...` ``), sit on the next line of a Prettier-wrapped `btn(`, or pass through `linkOf`, `act` variables or chips. The check catches only *unknown* verbs it can see. It cannot see a handler that has lost its only caller. *Would catch it:* at runtime, open every card type and wrap `act()` to record misses, or walk the DOM and assert that every `[data-act]` verb is in `ACT` or `PLAY`. That is a few lines added to MEASURE.
7. **Most cards are never measured.** MEASURE runs on 17 fixed cards. ground, find, node, box, milestone, info, every menu tab but Home, about 30 building cards, non-villager units and the research pages are never measured. *Would catch it:* make the card list from `Object.keys(CARDS)`, every `menu` tab and every `BLD` kind.
8. **A missing text key never runs under test.** `milestoneTick` runs only inside `ui()`, and the fingerprint calls `F.step` without `ui`. *Would catch it:* a static check that every key of `MS_TEST` is in `MS_TEXT` (and the same for `EV_TEXT` against `EV`), or calling `F.ui(true)` once a simulated second in the fingerprint loop while collecting page errors.
9. **palette.py checks a narrow scope.** It matches the exact hex string only, in files 26-33 and 39+ (ring colours in all JS). `rgb()` forms and the view and art files are unchecked. This may be by design for the map art, but nothing documents the gap for 20-25.
10. **lint.py is not part of the gate.** It would not have caught any of these mutations, but undefined names and dead code are left to whoever remembers to run it.

## Coverage gaps ranked by risk (player harm × likelihood of the edit)

1. **Economy correctness: refunds, the ledger, cost tables outside the fingerprint (M1, M10, M11a/b).** Players lose resources with nothing failing. These are frequent edit sites. HIGH.
2. **Save integrity (M9).** A dropped field silently corrupts every resumed game. HIGH.
3. **A runtime throw in UI-only code paths (M12).** A per-frame exception from a text key. HIGH: it is a crash in front of the player, and the gate only collects page errors from flows that never call it.
4. **Research effects that do nothing (M4).** Players pay for research with no effect. 230 steps and no check. MEDIUM-HIGH.
5. **Determinism off the fingerprint path (M5b).** It breaks the replay and baseline promise in late-game fights. MEDIUM.
6. **Dead buttons from verb renames (M2, M2b, M3).** This is the exact class of bug the gate's own comment says it exists for (the Build 34-36 dead Build menu). MEDIUM-HIGH.
7. **Layout of unmeasured cards (M8b).** MEDIUM.
8. **New-game state leaks (M6).** LOW-MEDIUM. The effect is SUSPECTED to be small.
9. **Colour discipline outside the UI files (M7b, M7c).** LOW.

## Verdict

**Yes, the tests can fail, but only along the narrow paths they were written for.** The individual checks are real: each one that fired failed loudly with a clear, correct message (fingerprint, card scroll, palette hex, verbs on single-line `btn`). But they are point samples. Out of 21 realistic careless edits, 15 passed the full gate. 18 of them stacked together still give a clean `PASS` on every line, including a player-facing crash, a save that loses data, unit cancels that refund nothing, and a research step that does nothing. The project rule "a test must be able to fail" is met per test. "Measure the real thing" is not met for the economy, the save, research effects or most cards.

A gate PASS means: the 17 sampled cards fit 4 phones; the first 5 minutes of one scripted Stone Age game are unchanged; one research cancel refunds; and the verbs visible to a regex exist. It does **not** mean the rules, the ledger, the save or the buttons are correct.

The cheapest fixes, in order of value: a refund round-trip for every order type; a static `fx.s`-is-read check; a save/load deep-compare; a static earn-only grep and a no-`Math.random`-in-sim grep; static checks that `MS_TEST`/`EV` keys have text; and a runtime `[data-act]` check run on all cards. Each is under about 15 lines in the existing test style. Together they would catch 9 of the 15 escapes: M2, M2b, M4, M5b, M9, M10, M11a, M11b and M12. This is SUSPECTED: the checks are not written yet. The rest need more work. M1 needs a wider fingerprint. M3 needs a tap test of the "+more" slot. M8b needs the card list made complete. M6 needs a check for state left over from the previous game. M7b and M7c need palette.py's scope widened.

## Artefacts

- Harness: `/tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/mut/` (run.sh, lite.py, mut.py, revert.sh, probe12.py, verbs.py)
- Per-mutation logs: `/tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/mut/m*.log`
- Gate logs: `/tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/mut/gate0.log` (clean) and `/tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/mut/gate-all.log` (all escapes stacked, PASS)
- Stacked mutated build: `/tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/mut/mutated-all.html`
