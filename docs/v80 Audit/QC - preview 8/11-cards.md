# QC 11: cards and input (26 to 30), v80 HEAD c3b4964 against v70 88b2cb2

v80 touched only 3 lines in these files (27:155-160, 28:62, 30:457). Batch 8 (group E) is not built, so every E item stands as in v70.
Tags: C traced, sure · K fairly sure · S suspect.

## 1. Prior findings and the cold review

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| E1 | STILL. Army card "Train soldiers" passes an array to acts(): commas between cells, every rank half empty | 30-cards.js:593 | C | visible bug on a main card | `list(trainButtons(kinds))` |
| E2 | STILL. Workshop "N made" reads the worker's lifetime gathering (w.st.got); the making ring (fr) reads the same number, so the ring is wrong too; worker found with no owner check | 29-card-pages.js:268-272, 277 | C | wrong number, wrong progress ring | count `b.made` on the building where shops stash; ring from the shop's own clock |
| E3 | STILL. Mail keeps 30, shows newest 6, no paging (N13 decided: 6 a page, Previous/Next) | 30-cards.js:650 | C | 24 lines unreachable | page index in G, slice(p*6, p*6+6), a Previous/Next pair |
| E4 | STILL. hitAt node loop has no fog test: a tap on a fogged mine opens its card with its amount | 26-input.js:312-319 | C | information leak through fog | add the draw's fog test (`!G.fogOn \|\| fogAt(n.x,n.y) > 0`) |
| E5 | STILL. Second finger sets drag=null but never clears G.box / G.hud.drag; only pointercancel does | 26-input.js:83-87, 200-204 (cf. 240-248) | C | stuck box and crosshair glow | one dropDrag() called from pinch start, pinch end, cancel |
| E6 | STILL. Dim Train button (hungry, line full) shows its cost in the green "can" style, no reason | 27-cards-core.js:194-210 | C | says "you can" when you cannot | when `why` and no case matched, sub = why, fr undefined |
| E7 | STILL. Pause decided once in openCard; ktab verb never re-checks, so Relations pauses or not by route | 27-cards-core.js:19-31; 33-verbs.js:388-390 | C | inconsistent pause | decide pause in renderCard from the card on show |
| E8 | STILL. Code unchanged; the gate's card list still lacks Research, the Relations tab, Milestones and an Army card with Battalions | tests/gate.py:12-15; 30-cards.js:493-602, 685, 524, 531, 408; 29-card-pages.js:561 | K | overflow and sub-44 taps the gate cannot see | add those four states to CARDS in the gate |
| E9 | STILL. acts() with fixed columns leaves holes (28:30, 30:543, 29:181, 29:223, 30:343-346, 30:578, 29:564, 30:727, 30:790, 30:795); s15/c4 1.5-slot cells (29:98, 29:65, 29:455); raw `<button>` in ~10 places | as listed | K | off the mold (§1, §3) | route through list() and btn() |
| E10 | Claim corrected (no doc contradiction), but the card is still v70: Natives c4 rank, half-empty peace/war, paragraph, per-player Ally/Neutral/Hostile acting at once, no ✓; "Relations, final" (Build List #20) not built | 29-card-pages.js:139-256 | C | agreed design not in code | build Relations Final as one rank a player |
| E11 | STILL. Market returns before the shared page: no Send help, no health cell when burning | 30-cards.js:64 | C | burning Market cannot get help from its card | fold Market into BLD_PAGE.market, drop early return |
| CR1 | STILL. Relations tab sub hand-typed "ally, neutral, hostile" (agreed: friend, neutral, foe, Build List #32); REL_WORD still Ally/Neutral/Hostile; the order toast says "set Hostile" | 30-cards.js:123; 01-rules-basics.js:62; 26-input.js:469, 494 | C | wrong words; tab label is a second home for REL_WORD | rename in REL_WORD; build the tab sub from REL_WORD |
| CR2 | STILL. Army card's Emergency is one double in a c2 rank: half-empty, off the grid | 30-cards.js:534 | C | hole in the mold | put it in the list with Recall/Attack, or c1 |
| CR3 | STILL. Locked queue place reads "+1 / research", not the research's name | 29-card-pages.js:131-135 | C | player cannot tell what opens it | `<small>${more.short \|\| more.name}</small>` |
| CR4 | Steel War/Train panel under the cycle button: not in these files (39-huddle / shell CSS) | n/a | - | - | reviewer for 39 |

## 2. v80 changes in these files

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| V1 | Title bar dims × when cardLocked(), and back on Resume: matches ACT.close (33:37) and cardback (33:45). Correct | 27-cards-core.js:155-160 | C | ok | none |
| V2 | sendable() now skips students (C10), but qsPool() was not changed: "Attack with" / "Send" on enemy and find cards still sends students out of school, guards off escorts. C10 is half done | 28-army-quick.js:4 vs 62 | C | the fix does not reach the card send path | qsPool = sendable().filter(battalion) |
| V3 | Setup note "could not be read" for a damaged save: correct (keepAside sets 'damaged', 34-save:316) | 30-cards.js:457 | C | ok | none |

## 3. New and carried bugs

| id | finding | file:line | tag | matters | one-line fix |
|---|---|---|---|---|---|
| N1 | Three different "who counts" for one army: sendable (spy, shrine, escort, school), qsPool (spy, shrine), the counts on qsfrom (spy only), council squads and "Orders go to" (none). Numbers on cards do not match who goes | 28-army-quick.js:4, 25, 62; 29-card-pages.js:62; 30-cards.js:540 | C | stale-looking counts, two homes | one sendable(bn) used by all five |
| N2 | Three squad pickers, two relation-button maps, market card size in renderCard as well as SIZE_OF | 28:18-31, 30:535-544, 29:57-65; 29:164-182 vs 241-251; 30:835-836 vs 810 | C | two homes per action | squadPick(), relBtn(), market in SIZE_OF |
| N3 | order() skips the war check for Native units (owner WILD), unlike foeOf: picked soldiers tapped on a Native at peace get a march toast and walk; the sim drops the focus (14-sim-troops:288); no "not at war" message | 26-input.js:467-468 vs 28-army-quick.js:131-132 | K | silent no-op order | test `e.native` like foeOf before the WILD shortcut |
| N4 | Research book still says "Cost and time ×(0.5+0.1w)"; N11 decided to delete it (fits 109 of 224) | 27-cards-core.js:128 | C | false number on every tech | delete the clause |
| N5 | Here card: "New soldiers here" toggles; with a rally elsewhere a tap clears it instead of moving it | 30-cards.js:343; 33-verbs.js:870-873 | C | button does the opposite | set if spot differs, clear only if same spot |
| N6 | Dim book button still toggles G.infoOpen (dis does not stop verbs) | 27-cards-core.js:159; 33-verbs.js:121-125 | C | a dim button acts | return in info() when no book |
| N7 | Queue cancel by index while the card re-renders every 150 ms; "+n more" cancels last with no confirm | 29-card-pages.js:118, 128 | S | can cancel the wrong order | job ids |
| N8 | boxPick picks students, escorts and shrine priests (armyOf(0)); the next tap order() pulls them off | 26-input.js:587-589 | K | same leak as V2 by another door | filter by sendable() plus villagers |
| N9 | Milestone chips read MS_TEXT[m.id][0] with no guard: a kept milestone whose id was cut throws and the card fails | 30-cards.js:685 | S | crash on old saves after a cut | filter M by MS_TEXT[m.id] |
| N10 | Caravan "Send it to" with no stop puts a `<p>` inside a .fm c1 grid | 29-card-pages.js:531-541 | S | text in a slot grid | the empty case outside acts() |
| N11 | trainButtons tests ready(0,U.at), trainWhy uses the "also" buildings: "needs a …" can be wrong | 27-cards-core.js:198 | K | wrong reason | use the same readyAt |
| N12 | Literal colours: wild health bar #c9b48a, order ripple #ffd35e (E17) | 30-cards.js:295; 26-input.js:546 | C | off COLORS.md | tokens |
| N13 | Dead code: SET_WHY.diff/fog/tension, FULL 'end', INFO 'bnabout', bonusText `&& false`, `cc = G.card`, qsHTML writes G.qs.from while rendering | 29:580-593; 30:807; 27:133; 27:392; 30:833; 28:17 | C | bloat | cut, log in CUTS.md |
| N14 | Wrong comment: "you tapped Build: build what the ghost shows…" above cancelPlace | 26-input.js:576 | C | misleads | move or delete |

Counts: C 23, K 5, S 3 (rows CR4 not tagged). Prior E1 to E11 and CR1 to CR3: all still present, none fixed, none worse; V2 makes one new inconsistency.
