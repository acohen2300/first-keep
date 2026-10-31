# Cards and input audit: v70 (26-input, 27-cards-core, 28-army-quick, 29-card-pages, 30-cards)

Every line of the five files was read (2,805 lines). Probes ran on a copy built from the same source (`scratchpad/ag-cards`, `diff -rq` clean), in headless Chromium, with the gate's own SETUP. Probe scripts: `scratchpad/ag-cards-probe/p1.py` to `p6.py`. No crashes found. No page errors in any probe.

## S2: wrong behaviour

1. **The Army card's "Train soldiers" fold prints a comma between every button.** VERIFIED. `30-cards.js:593` `acts(trainButtons(kinds))`. `trainButtons` returns an array (`27-cards-core.js:184-211`, "the cells, for a list"), and `acts` interpolates it with `${h}`, so it joins with `,`. Probe p1: 18 text nodes `","` inside the grid, 37 grid children instead of 19. Each comma becomes its own grid item, so every rank is half empty (row fill 0.49). Fix: `list(trainButtons(kinds))`, as every other caller does.
2. **The workshop's "N made" shows the worker's lifetime gathering, not goods made.** VERIFIED. `29-card-pages.js:268-272` reads `w.st.got`. `13-sim-civil.js:164` adds every gathering trip to `st.got`, and `:22` adds the workshop's output too. Probe p3: a villager with 512 gathered, put on the workshop, shows "512 made". The worker is also found by `G.units.find(u => u.node === b.node)` with no owner check and only the first worker counted. Fix: a count of goods made, kept on the building (`b.made`) and incremented where `stash` is called for shops.
3. **The Mail card keeps 30 lines but only the newest 6 can be reached.** VERIFIED. `30-cards.js:650` uses `.slice(0, 6)` and there is no paging. Probe p6: subtitle "21 kept", 6 rows shown. Fix: show all rows under the filter (the card scrolls or grows by rank), or keep 6.
4. **A tap on a fogged resource opens its card.** VERIFIED. `26-input.js:310-320`: `hitAt` checks nodes with no `known0` or fog test. Finds have the test (`:307`) and buildings have `knownB` (`:293`). Probe p4: a gold mine at `fogAt = 0` returns `hit: node`, and its card reads "Gold · B19 · 750 gold left". This leaks information through the fog. Fix: add `&& (!G.fogOn || fogAt(n.x, n.y) > 0)` to the node loop, the same test the drawing uses (`23-view-things.js:237`).
5. **The hold-box and the crosshair glow stay stuck after a pinch.** VERIFIED. When a second finger lands, `pointerdown` (`26-input.js:83-87`) and the pinch branch of `pointerup` (`:200-204`) set `drag = null`, but they never clear `G.box` or `G.hud.drag`. Those are cleared only at `:210`, `:215` and `:244`. Probe p5: after hold, pinch and lift, `G.box` is still `{mode:'box',…}`, so it is still drawn (`24-view-overlays.js:682`). The same path leaves `G.hud.drag` true, so the crosshair glow stays on (`39-huddle.js:387`). Fix: one `dropDrag()` that clears box, hud.drag and EDGE, called from the pinch start, the pinch end and pointercancel.
6. **A dimmed Train button says it can be paid for.** VERIFIED. `27-cards-core.js:192-208`: `sub` has no case for hunger or for a full line, both of which `trainWhy` refuses (`11-orders.js:21,23`). Probe p6, hungry: `train:vil` has class `dis`, reads "50f ×5", and its cost carries the green `can` class. Fix: when `why` is set and no case above matched, show `why` (as `techBtn` does with `lockedWhy`).
7. **Pausing on cards depends on how you got there.** VERIFIED (p3). `openCard` (`27-cards-core.js:19-31`) only ever pauses. Research then a building card: the game stays paused (`pausedOnHouseAfterResearch: true`). Open the house card directly: not paused. Town Center opened on the Relations tab: paused. The same card switched to Relations with its tab: not paused, because `ktab` is a PLAY verb that never re-runs the check. Fix: work out the pause on every `renderCard` from the card on show, not once at open.
8. **Cancelling a queued order goes by index.** SUSPECTED (by reading). `29-card-pages.js:118,128` puts `qcancel:id,i` on each slot. The card re-renders every 150 ms (`32-frame.js:507`). If the head of the line finishes between the render and the tap, `cancelOrder(0,B,i)` (`11-orders.js:40`) cancels the order after the one tapped. The "+n more" slot also cancels the last order silently, with no confirmation. Fix: give each job an id and cancel by that id.
9. **"New soldiers here" clears the rally instead of moving it.** VERIFIED (by reading). `33-verbs.js:857-860` toggles `G.rally0`. With a rally already set elsewhere, a tap on the Here card clears it ("set: tap to clear", `30-cards.js:343`). Moving the rally takes two taps on two cards.
10. **The Market card skips the shared building page.** VERIFIED (by reading). `30-cards.js:64` returns before the "things you do" list at `:71-104`, so a burning Market has no "Send help" and no health cell. Fix: fold the market into BLD_PAGE (`page`) like the other kinds and remove the early return.

## S3: rule violations and bloat

11. **Cards that do not fit one page at 390 × 844 (RULES §6), and cells taller than their rank (MENU-SPEC §1).** VERIFIED (p2).
    - Army card with Battalions researched: `--rk` 11 against the md cap of 10, and it scrolls (542 / 500). The gate never researches `command`, so it misses this.
    - Research card: `.trow` cells grow to 49 px (the "needs …" second line plus "· House"). The gate does not open the Research card.
    - Relations tab at 375: Natives rank cells are 49 px. The gate never opens `ktab='rel'`; EXCEPTIONS #12 excuses only the vassal page.
    - Milestone chips are 124 × 22 tap targets (`30-cards.js:685`; the CSS chip is padding 3 px). They break the 44 pt rule and are not on the exceptions list.
    - `<p data-act>` lines on the Army card (`:524,:531`) and `<span data-act>` in the Stores book (`:408`) are taps under 44 pt as well.
12. **Holes where the list should collapse (MENU-SPEC §3).** VERIFIED (p1 row-fill). Each of these is `acts()` with a fixed class where `list()` exists:
    - c4 with 5 items: the squad pickers (`28-army-quick.js:19-31`, `30-cards.js:536-544`).
    - c4 with 2 items: Natives peace/war (`29-card-pages.js:164-182`).
    - c3 with 7: Help toggles (`30-cards.js:777-790`).
    - c2 with 1: Emergency (`:534`), New game (`:795`), Stand down (`29:216`), Here's rally (`30:343`) and scout/spy (`:344`), the dial pair when Formations is not researched (`:578`), and the next age on Research (`29:564`).
    - c3 or c4 with 7: Guide tabs (`30:715-727`).
13. **Widths that are not whole slots.** VERIFIED (by CSS, `shell-head.html:42-43`). `c4` (span 3 = 1.5 slots) and `s15` lay cells 1.5 slots wide. MENU-SPEC §1 says "every width is a whole number of slots". Used in `infoRank` (`29:98`), the council squads (`29:65`), Relations (`29:162,181,252`), the levy row (`29:455`), the squad pickers and the Guide's history tabs.
14. **Layout laid by hand outside the Formation.** VERIFIED.
    - `.qs` (`28:43`) repeats `.fm`'s 12-column grid.
    - `.trow` (`29:561`) is a nested 6-column grid.
    - `.seg` / `.seg2` (`29:574-627`) and `.tick` buttons (`30:448-449`) are their own grids.
    - `.mrows` (`30:671`) is a flex column.
    - `.chips` (`30:685`) is a flex wrap.
    - The Score `<table>` (`30:706`).
    - Raw `<button class=…>` markup in 10 places that bypass `btn()`: `slotsHTML` ×3, workshop, mail, ticks, trow, the score link and the guide link.
15. **Literal colours in UI code.** VERIFIED. `30-cards.js:295` `'#c9b48a'` (the wild unit's health bar, not on COLORS.md). `26-input.js:546` `'#ffd35e'` (the order ripple; arguably map paint under EXCEPTIONS #11, but that row names "the art and its ripples" loosely). Inline `style="color:…"` from `grad()` (`30:392`) and `costCol` (`27:104`) are computed from tokens and are acceptable.
16. **Code that does the same job in more than one place.**
    - Three squad pickers: `qsHTML` `:18-31`, the Army card's "Orders go to" `:535-544`, and the council `29:57-65`. One `squadPick(act, cur)` would save about 25 lines.
    - Two relation-button maps: `29:164-182` and `:241-251`. Saves about 20.
    - `why ? why.replace(/\.$/,'') : …` with `why ? 'dis' : 'go'`, 15 times. One `whyBtn(act, title, why, okSub, okCls)` would save about 50.
    - The on/off toggle `btn(k, n, X?'on':'off', X?'on':'')`, 9 times. Saves about 20.
    - The "Sick / Plague" paragraph is written twice (`30:280`, `:325`).
    - The "set Hostile at your Town Center first" `say` is written twice (`26:469`, `:494`).
    - The Market's card size is special-cased inside `renderCard` (`30:835-836`) instead of in `SIZE_OF`. That makes two homes for the card size.
17. **Dead code.** VERIFIED by grep.
    - `SET_WHY.diff`, `.fog` and `.tension` (`29:580-584,589-593`): only `fantasy` is read (`:596`). About 10 lines.
    - `FULL` lists `'end'`, which has no card (`30:807`).
    - `INFO` lists `'bnabout'`, which is used nowhere (`27:133`).
    - `bonusText`'s `|| (f.k[0] === '#' && false)` can never be true (`27:390`).
    - `qsHTML` sets `G.qs.from` while rendering (`28:17`).
    - In `renderCard`, `const cc = G.card` repeats `c` (`30:833`).
18. **Comments that contradict or no longer fit the code.** VERIFIED.
    - `26:576` "you tapped Build: build what the ghost shows; houses, fields and gates offer the next spot…" sits above `cancelPlace`; it describes `commitPlace`, which lives elsewhere.
    - `30:239` "one row of peoples, their soldier in the line under it" is on the find card; it describes Setup.
    - `30:808` "lg … (the Build card, the Guide, Help, Setup)" leaves out Score, Research, Resume and the forced Market.
    - `28:83` "Rest: idle soldiers only" uses "Rest", a word the game no longer uses.
19. **Functions too long to read at once.** `CARDS.bld` is 192 lines. `troops` 110, `statusOf` 87, `help` 45, `vassalHTML` 80. Moving the Market into BLD_PAGE and adding `whyBtn` would take about 40 lines out of `bld`.
20. **Loose lines between ranks (MENU-SPEC §1: "text lives in a slot or takes a rank").** `sec()` labels, `<p>` sentences on the face and `hpBar` sit between ranks on the Army, Relations, vassal, stop, caravan, research, box, find, soldier and node cards. The Town Center row says "No labels"; the keep tab content complies.

## MENU-SPEC §8, card by card

| Card | Divergence |
|---|---|
| Relations (AGREED) | Not built as drawn. The spec has 7 ranks: Player · Gift · − + · Friend · Neutral · Foe, with one ✓ that commits. The code has a `sec('Relations')` label, a Natives rank in c4 with fixed Gift 100g/300g buttons (no − +), a half-empty peace/war rank, a paragraph about the board, Stand down, and one c4 rank per player with Ally/Neutral/Hostile that act at once (no ✓). Stances use the gold ring as the spec says. EXCEPTIONS #12 calls Relations "Albert's open decision" while MENU-SPEC marks it AGREED: the two documents disagree. |
| Town Center | Close. "Send help" and replant land above the tabs. Techs are laid by `list()`, so 4 come out as 2+2 triples, not "three double-wide a rank" (consistent with §3). |
| Market | Adds a training queue (`slotsHTML`) and ventures, neither in the spec. No info rank. Forced to `lg` by a special case. Goods and price and Sell/Buy fill exactly two c6 ranks: correct. |
| Build menu | Matches. Six tabs as a folder, words only, blue = fits, dim = later age. |
| Villager | Matches. |
| Stores | Matches. |
| A building | The info rank uses 1.5-slot cells (`s15`) when there is a fact. Otherwise matches. |
| Mail | The edge colour follows the message's class (`ccOf(m.cls)`), not its group as the spec says. Only 6 rows are reachable. An extra "Hide the previews" rank appears under a filter. |
| Squad, Emergency | Outside these files (39, 40). |
| Army card (`troops`) | Has no row in §8. It is still reachable from the strip, it overflows (item 11), and its tab-like squad picker is not a folder. |
| Guide | Its tabs are `acts` with an `on` ring, not the folder of §1, and 7 tabs leave a hole. |

Title bar (§4), quick action (§7) and back (§4) match the spec. The flip logic was checked by reading, and the gate tests it.

## S4: minor
- Back to a card whose subject is gone closes the whole stack instead of stepping further back (`renderCard` → `closeCard`). Round trips between Research and a building grow the `from` chain without limit.
- The count on the "Attack with" squad picker includes priests at a shrine, but the pool it sends from excludes them (`28:25` against `:4`).
- After a pinch, the remaining finger cannot pan until it is lifted.
- `trainButtons` uses `ready(0,U.at)` while `trainWhy` uses `readyAt` (the `also` buildings), so "needs a …" can be wrong when the unit is trained at its second building.
- A dim book button still toggles `G.infoOpen`.

## Not checked
- Squad and Emergency cards (39, 40).
- The verbs in 33 beyond those the cards call.
- The guide body (31).
- Every card at 393 and 430 widths; only 390 and 375 were probed.
- iOS Safari touch behaviour; the input probes were synthetic PointerEvents in Chromium.

## Overall
The engine is sound. Patch-diffing, the folder, the title bar and back are compact and correct, and nothing crashed. The pages built on it are not one mold. About a third of the card code bypasses `list()` and the Formation, so cards have holes, half-slot widths, hand-laid grids and duplicated pickers. One outright rendering bug (the commas) and two wrong numbers (workshop "made", the dim-but-green train cost) shipped because the gate measures only a fixed set of cards in one setup.
