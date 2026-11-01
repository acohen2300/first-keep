# Cold review: cards80 (520e4eb on 38001b9)

Checked: the diff, the Build List "Agreed for v80" section, the Decision Record E1 to E11 and N13, the Relations Final and Setup Stacked with Names pictures, and RULES §0. Ran `build.py`, `lint.py` and `palette.py`: all clean, and the tree stayed clean. All 58 plant strings occur exactly once. I did not run the gate or the soak.

## Blockers
1. **The gift slider drops the drag as soon as it turns on.** `src/27-cards-core.js:64` (`sig`) and `:66-86` (`patchKids`).
   - The `.slt` div has no `data-act`, so its signature is its class. The first move off 0 sets `d.on` (`33-verbs.js` `relgift`), and the class changes from `slt s2` to `slt s2 on`.
   - The signature no longer matches, so `patchKids` inserts a new node and removes the old one, including the `<input>` the finger is dragging. The drag stops at 50 on the first move.
   - The same happens when the slider is dragged back to 0, and whenever `dis` flips.
   - The new range-value line in `patch` (`:94`) never helps, because the node is replaced, not patched.
   - Fix: give `.slt` a stable key (for example a `data-f`), or put on/dis on the children. No test covers dragging.
2. **A rival's gift is locked against the agreed text.** `29-card-pages.js:151` (`giftLock`).
   - Build List, Relations final: "a friend's gift locked: a bribe is a step for anyone not a friend, which changes v70's Natives only". The Relations Final picture shows 100g to the Raiders.
   - As built, every rival's slider is dim "—" with "Gifts go to the Natives only." The notes list this as Albert's decision 4, but it was already agreed.
   - Either build it or get Albert's explicit reversal.
3. **No cuts were logged in CUTS.md.** It is not in the diff; the notes only contain a "Draft for CUTS.md". This breaks the standing rule that every cut is logged.

## Should fix
4. **The stale word "Hostile" is still on screen.** `26-input.js:475` and `:500` say "set Hostile at your Town Center first." With the new REL_WORD this reads "Neutral: set Hostile…". The notes claim "Hostile" was cut. `cards.py` only greps the Relations card text, so it cannot catch this toast.
5. **Tapping a mail line resets the page to 1.** `30-cards.js:674`: a line with no link has `data-act="mail"`. `ACT.mail` (`33-verbs.js:282-285`) sets `G.mailP = 0` and calls `openCard`, which also resets `relPick` and the scroll. On page 3, tapping such a line jumps to page 1. Use a no-op or `pvx`-like verb.
6. **The stance words live in three places.** `REL_WORD` (01:64), `STANCE` (29:142, 'foe'/'neutral'/'friend', which also names the ICON keys), and `W` inside `relStatus` (29:197, 'a foe of'…). This breaks the one-home rule.
7. **The map label numbers are hand-typed and the weight is written twice.**
   - 12 and the 9 floor are typed in `labelK` (24:135) and at six call sites as `12 * labelK()` / `mapFont(12)` (20:139, 22:59, 23:144, 24:138/147/519, 39-huddle:437). 12 is already `--fs-s`.
   - The 600 in `mapFont` (24:136) is a second home for the body's `font-weight:600`.
   - Suggested: one `LABEL = {px, floor}` and one weight constant.
8. **During notice, the row says "Neutral · 30 s".** `29-card-pages.js:172`: while notice runs, `rel` is still 'peace', so the word is "Neutral · 30 s". The old card said "hostile in 30 s". It should read "foe in 30 s".
9. **The gate's tap-size skip is wider than EXCEPTIONS #13.** `.thin` is added to any `choice()` with more parts than slots (27:141). `gate.py` then skips every `.thin` button. That exempts the Market's 7-good selector, but #13 names only the slider halves and the stance icons.
10. **E2's test cannot catch a broken count.** `cards.py` only checks that "512 made" is absent. Delete `b.made += g` (13-sim-civil:23) and the card shows "0 made", which still passes. No plant covers the counter.
11. **The verb check misses `choice()` verbs and the slider's input verb.** `gate.py verbs()` reads `data-act=`, `btn(`, `slt(`/`sym(` first args and `data-in="` literals.
    - `choice()` verbs (relwant, mpick, civ, hz, diff, fog, daily…) are never read.
    - `slt`'s second argument (relgift) is never read.
    - The note's claim "`data-in`, `slt` and `sym` verbs checked" is only partly true; a misspelled selector verb would pass.
12. **Dead CSS.** `.cin p.why` (shell-head:151) is no longer emitted, since `settingsWhy` dropped `class="dim why"`.

## Notes
13. **E4's test can pass without checking anything.** `cards.py` E4 runs inside `if (n)`: with no fogged gold on seed 5, nothing is checked.
14. **palette.py matches source text, not behaviour.** It checks `labelK` and `mapFont` by exact regex on the source, so a correct refactor fails it.
15. **Setup and Fog/Daily differ from the picture.** `setRow` would emit an invalid `s0` label for a setting with 6 choices (29:537); none has 6 today. Separately, the picture draws Fog and Daily as one-slot toggles; the build makes them Off · On selectors (flagged as decision 2).
16. **The Market differs from "keeps v70 layout".** Its goods became a selector, and the caravans moved to the fact rank (MENU-SPEC §8 Market row still says "goods as singles").
17. **The Army card always takes full height, and its comment is two comments run together.** `FULL` now holds 'troops' unconditionally, not only with Battalions; `30-cards.js:807` has two `//` comments run together.
18. **cardPause has two pause edge cases.**
    - Its unpause branch (27:42-44) has no `!G.over` guard, unlike `closeCard`.
    - Turning back to the Town tab unpauses even if the player paused by hand while on Relations, as long as `cardPaused` is still set.
19. **Emergency now hides while placing.** `#emgB` was added to `#stage.busy` hiding (shell-head); this is a behaviour change not in the list or the notes.
20. **"20 regard" is typed by hand.** The book text (29:213) repeats the `-20` in `setRel` (11-orders:330); there is no `NATIVE` key for it.
21. **The Lucide notice is not in the shipped HTML.** The ISC licence text exists only in `src/fonts/ISC-lucide.txt`, and the notes say it was written from memory. Check both before going live.
22. **Each slider move redraws twice.** The `input` listener (33-verbs:1134) calls `act()`, which already refreshes for PLAY verbs, then `refresh()` again.

## Verified as claimed
- REL_WORD reads friend, neutral, foe.
- EXCEPTIONS #12 and the gate's vassal skip are removed.
- Mail: `MSG.page` 6, the page is clamped, Previous/Next dim at the ends.
- E1 list, E5 `dropDrag`, E6 reason text, the E9 lists.
- `s15`, `seg`, `.tick`, `.chips`, `--fs-m`, `nativesHTML`, `marketHTML`, the `rel`/`gift` verbs and `NATIVE.gifts` are all gone from src and tests.
- Fonts: build and palette agree on `barlow.woff` 600 and `fell-sc.woff` 400.
- Saves: the new field `b.made` is read as `|| 0`, so old saves load; nothing removed was ever saved.
- The 23 new plants: each `old` string exists once, and `plant_check` requires a FAIL line with the expected text.
