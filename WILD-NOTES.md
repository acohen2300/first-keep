# Wild notes (branch wild81, from main 66a68a5, Nov 1)

**Mockup (Albert agreed it Nov 1 08:14, "I like it", as a third tab):**
- `mockups/80/Relations Misfits.png`: page two, Misfits (390×844).
- `mockups/80/Relations Misfits - page one.png`: page one, the computers, stance only.
- Built screenshots of both pages: `mockups/80/Relations Misfits - built, Relations.png` and `mockups/80/Relations Misfits - built, Misfits.png`.

## What was built
1. **The wild by kind (answer 1b).** Animals are everyone's foe, always. The Natives, outlaws, bandits and robbers each keep their own regard (0 to 100) and stance per side, copying the Natives' flow: bribes raise regard (the Danegeld rule), blows lower it, it drifts back to 20, and at 40 the group leaves you be.
   - `REGARD` (the shared numbers, moved out of `NATIVE`) and `GANG` in `05-rules-wild`.
   - Who belongs: `gangOf` in `08-core`. Bandits are bandit and goblin; robbers are robber, skeleton and troll (`UNIT.gang`); the outlaws are the horde; the Natives are their warriors, walls, towers and pits.
   - `isFoe` reads each group's stance (`gangRel`). The guards' look in `wildTick` now goes through `isFoe`, so a group at peace with you leaves you be.
   - State: `G.gang` (`gangState`, `addRegard`, `gangSync`, `giveGift(o, amt, g)` in `38-natives`). Save shape 42 → 43, with one MIGRATE step (the Natives' regard moves from `G.nat` to `G.gang.nat`, and the dead fields are dropped).
   - Turning on a group costs `REGARD.warCost` (20, the old hand-typed number).
2. **Decision 4b (EXCEPTIONS #15, an experiment).** The Natives and the misfit groups never start a fight with a computer.
   - A camp remembers who struck it for `NATIVE.struck` (60 s; `G.struck`, saved), fights only those units, and only on its own ground: the Natives within `YARD` (320, now one constant, `nearHome`'s number) of the Throne; a guard within its leash (`wildLeash`).
   - Raids, the horde and the Natives' pits and nets skip the computers (`calm4b`, the one home).
   - The player's rules are unchanged. The entry ends when the computers can buy peace.
3. **Relations, three tabs: Town | Relations | Misfits.**
   - Relations: the computers, the stance only (`s3` name, no gift slot).
   - Misfits: the Natives, outlaws, bandits and robbers, each with a Bribe (the slider with its switch) and a stance. Only the Natives can be friends; the handshake is dim for the others ("They take gold, not oaths.").
   - The status line on Misfits: "regard 20 · 20 · 45 · 20, peace at 40", in row order.
   - A picked stance not yet sent reads "Foe → Neutral" under the name, each word in its stance colour; once sent, the line shows the stance alone (Albert, 08:16). On a Misfits row the name is one slot, so the change takes two lines there ("Foe →" over "Neutral"). It fits at 375 and the row keeps its 44 (measured: "Neutral →" 49 of 49 px). No mockup with the arrow was found in `mockups/` or the docs.
4. **Answer 11.** A conversion refused at the army ceiling says "At Maximum Occupancy Capacity" (`priestTick`).
5. **Answer 12.** The ambush ×1.3 applies only when the Native stands on its ground (`natGround`, `15-sim-spatial`): a causeway, a wood (a fog square of 3+ trees, the same cell that blocks sight; `woodsGrid` moved from the view to the sim), or the camp's edge (between the wall ring and the shore).
   - On main it already applied only on the causeways and the island's rim. The wood is the new part.
   - The 1.3 is kept and now cited (see the SCIENCE draft).
6. **The hunt.**
   - **A #1, Victory sighting 3:** the Games are held at the first board peace after they fall due. `holdGames`' war branch and `PEACE.games.first` are deleted. The Relations line reads "Games at the next peace" when the Games are due during a war, not 0:00.
   - **A #2:** `stampDanger` fills each row of a disc (`discRows`, worked out once per radius). It is identical to the old disc (tested on 60 random discs).
   - **A #3:** a builder bitten by a boar or bear fights back on its own job, then goes back to its site. It keeps its site and its old job, and leaves the meat to others.
   - **A #4:** the wild looks every fifth tick, and at once when the foe it held is lost.
   - **A #5:** the path look-ahead runs when a corner is passed or four times a second; `gcell` is inlined in `lineClear`.
   - **A #6:** one `flood` for "joined regions" (`navRebuild` and `compOf`); a side's buffer is made once.
   - **A #7:** only a spent tree marks the grid dirty.
   - **A #8:** `navOnce` (one home) wraps the player's wall line and the computers' wall plan.
   - **A #9:** `G.yearN`, `G.gamesN`, `G.lost`, `L.coalRisk`, `p.ration` and `p.rations` are gone, along with the `if (v)` after `addUnit`. `tests/balance.py` counts the Games from laurels.
   - **A #10:** `BEAT` (06) and `every()` (08). Each slow tick's body reads its own period: prices, vassals, the vassal gift, health, and the Natives' regard, handover and Throne score.
   - **B #1, Victory sighting 1:** the Chronicle on the end card is paged like the Mail, newest first: 6 one-line rows, Previous and Next, a short page padded, no fold. It uses one `pager()` helper (`27-cards-core`), shared with the Mail.
   - **B #2, Victory sighting 2:** `#end` sits above every layer. The z-order lives in one token set (`--z-sticky` … `--z-end`).
   - **B #5:** the place bar follows `G.place` in `ui()`.
   - **B #6:** "Send help" is always on a wooden building (dim with no fire). The Army card's live lines (status, Coming at you, Out on orders) moved under every button.
   - **B #7:** `alertT` and `warnT` are saved.
   - **B #8:** the Guide's page is built once per page, age, research count and search (`GUIDE_PG`).
   - **B #10:** `drawOnce` (one home, `try/finally`) for the research badge and the store piles.
   - **Tidy:** the dead `'bnabout'` fold id.
7. **The outside review's four (coordinator, Nov 1), each with a test (tests/wild.py R1 to R4) and a plant:**
   - **Status strip:** the strip still has one cell per tally cell. When Iron is hidden (the Stone age), it now lets go of the sky cell (`stSea`; `STATUS_CUT`, the order of what goes first), not the soldier count. The sky is on the map itself; the soldiers can be trained from the start.
   - **Squad builder:** − and + sit in one `.duo` cell, a grid piece that splits any span into two even halves, under each class tile. The empty filler is gone.
   - **`ACT.jump`:** it closes the card first, as `idlego` and `seek` do. A mail line with a place now closes the mail.
   - **Locked controls:** the click listener reads `el.closest('.dis, .lock')`, so a switch inside a locked slider (and any part of a dim control) counts as greyed in the tap log and glows red. The red ring is put on after the verb runs, so the card's redraw does not wipe it.
8. **Tests.** `tests/wild.py` is new and runs in the gate, with every item, the three Victory sightings and the stance change at 375. `tests/cards.py` covers Relations in two pages. The gate measures the Misfits card at all four sizes. `tests/moves.py`' boar and bear check now looks on the boar's look tick (A #4).
   - Every new check fails on main: run against main with only the exports added, every item fails with its own message.
   - 34 new plants, each caught. 10 plants were updated to the new code (C1, C8, the pits, the mail pad and the preview switch, the slider and choice verbs, the friend's lock, the notice). The A8 plant was fixed so that its run actually runs the loop.

## Measured (node, seed 2, minute 10, machine loaded; before → after)
- `dangerMap`: 45.1 → 4.9 ms a call.
- `compOf`: 2.1 → 0.65 ms.
- One minute of play (10:00–11:00): 11.5 → 4.9 s. This includes the behaviour changes.
- Calls in that minute:
  - `nearU`: 124,212 → 33,852.
  - `lineClear`: 78,148 → 9,329.
  - `navRebuild`: 26 → 12.

## Fingerprint (accepted once, with each change's share)
Each change was turned off in turn (node runs the gate's own FINGERPRINT script; it gives main's baseline exactly):
- 4b (`calm4b`) moves all 5 minutes, and so does the guards' look through `isFoe`.
- A #5 moves 5 of 5.
- A #4 moves 3 of 5.
- 1b's regard, the raid rule, A #1, #3, #7, #8 and 12 move nothing in these 5 minutes.
- All off gives the old baseline exactly.

## Balance (4 seeds × 30 min, jobs 1)
| | main 66a68a5 | wild81 |
|---|---|---|
| Bronze (median) | 5.7 min | AFTER_BRONZE |
| Classical | 9.4 min | AFTER_CLASSICAL |
| Medieval | 24.8 min, 7 of 16 | AFTER_MEDIEVAL |
| Sides that fell | 0 of 16 | AFTER_FELL |
| Wins by seat | aggr 1, bal 3 | AFTER_WINS |
| Blocked villager-seconds (median) | 37.0 | AFTER_BLOCKED |
| Games held per game | 0 (always at war) | AFTER_GAMES |

## Checks run
AFTER_CHECKS

## Size
- `first-keep.html`: 1,195,604 → 1,208,586 bytes (+13.0 KB).
- src: 30,570 → 30,804 lines (+234), across 30 files (+557 −322).
- `tests/fmt.py` was run on the files this batch touches only. It reformats much of main, which breaks plant texts, so the unrelated churn was taken back out.

## Decisions for Albert
1. **Who the "outlaws" are.** I made them the horde (bribing a horde is the Danegeld itself). Bandits are bandit and goblin; robbers are robber, skeleton and troll. Is the horde right for "outlaws"?
2. **Raids.** The raiders are robbers sent by the Natives, so a side is raided only when it is at war with both the Natives and the robbers. Keep it, or let the Natives' stance alone decide?
3. **4b reach.** The horde now goes for the player only (it starts nothing with a computer), and the Natives' pits and nets skip computers. Both follow from "never start a fight with a computer". Confirm.
4. **Alliances.** Only the Natives can be friends; outlaws, bandits and robbers take gold but no alliance ("special rules later").
5. **The ambush number.** 1.3 matches Dupuy's QJM factors for "rolling, mixed" terrain (1.3) and a hasty defence (1.3), as quoted from *Numbers, Predictions and War* (1985) by The Dupuy Institute. I could not open a forest-specific ("wooded") value. The secondary source gives "rugged, mixed" 1.5. Keep 1.3, or use 1.5 for woods?
6. **The arrow on Misfits takes two lines.** "Neutral → Friend" cannot fit a one-slot name at 375 on one line. Two lines fit exactly; the alternative is to drop the name while picking.
7. **The Games.** They now wait for the board's peace. Since the computers are at war from the start, a game may see none at all (the balance shows it).

## Rules bent
- `woodsGrid` moved from `22-view-fog` to `15-sim-spatial`, because the sim now reads it. The view reads the same function: one home.
- The plant for "a group's verb is read as a number" is caught as a crash inside the Relations check ("could not run"), not a named message.
- `EXCEPTIONS.md` #15 was added without Albert's yes on the row itself (4b was his decision; the row is his to confirm).

## Not done
- **Hunt B small items, left with reasons:**
  - B #11 (the History search's two homes): moving it to `renderCard` risks the search field's focus.
  - B #15 (Attack with pulls students and guards): a behaviour change, for the combat batch.
  - B #18 (canvas colours that repeat tokens): for the palette pass.
  - B #22 (a tap-count write per tap): Build 60 chose every tap on purpose.
  - B #9's end-card spacing numbers: the z-tokens part is done.
  - B #16 and #17's `&& false` were already gone on main.
- **Hunt A #11–#27** (not asked), except #11 and #12, which are done with A #1. G.bolts (A #17) is not done.
- **`docs/Checks …` and HANDOFF** should list `tests/wild.py`. I edited no other docs.
- **SCIENCE.md:** the draft is below, for the merger.

## Draft for SCIENCE.md
| Where | What | Value or form | Label | Source |
|---|---|---|---|---|
| `05-rules-wild` `NATIVE.ambush`; `15-sim-spatial` `natGround`; `16-sim-fight` `hurt` | The Natives' ambush: a blow struck from their ground (a causeway, a wood, the camp's edge) is ×1.3; in the open, plain strength | 1.3 | cited (secondary, opened) | Dupuy, *Numbers, Predictions and War* (1985), QJM Table 1 (terrain: rolling-mixed 1.3, rugged-mixed 1.5) and Table 5 (posture: hasty defence 1.3), as quoted by C. A. Lawrence, "The Defensive Value of Urban Terrain According to the QJM", The Dupuy Institute, Aug 16, 2022 (opened Nov 1). The book itself was not opened; no "wooded" row was found. |
| `06-rules-tuning` `BEAT`; `08-core` `every` | The slow ticks: one period, read by the tick and by its body | slow 10 s, health 5 s, Natives 5 s | design | The first-order lag (`relax`) and the decay take the beat's seconds, so the result does not depend on the beat (`tests/wild.py` A10). |

## Draft for CUTS.md
- **wild81 (Nov 1):**
  - The wild by kind (answer 1b): four misfit groups with their own regard; `REGARD` split from `NATIVE`.
  - Decision 4b as an experiment (EXCEPTIONS #15).
  - Relations: Town | Relations | Misfits; no gifts to rivals; the stance change reads "Foe → Neutral" until sent.
  - Answers 11 and 12.
  - Hunt A #1–#10 and B #1, #2, #5–#8, #10, with Albert's three Victory sightings.
  - Save shape 43.
- **Cut:**
  - `wildFoe` (replaced by `gangOf`).
  - `holdGames`' war branch and its chronicle line ("The Games were not held: war.").
  - `PEACE.games.first`.
  - The Chronicle's fold.
  - `G.yearN`, `G.gamesN`, `G.lost`, `L.coalRisk`, `p.ration`, `p.rations`, the `if (v)` after `addUnit`.
  - The two hand-typed `ctx` swaps.
  - `compOf`'s own flood.
  - The six bare z-index numbers.
  - The `'bnabout'` fold id.
  - The cancel-place and start-place writes to `#place`.
  - The computers' gift slot on Relations.
- **Play fingerprint accepted:** wild81: decision 4b (the wild starts nothing with a computer: isFoe, and the guards' look reads it) moves all 5 minutes; hunt A #5 (look-ahead four times a second) all 5; hunt A #4 (the wild looks every fifth tick) 3 of 5. Each change turned off in turn; all of them off gives the old baseline exactly. Answer 1b, 12, A1, A3, A7, A8 move nothing in these 5 minutes.
- **Parked:** conversion past the cap (Albert's up to 2% over, against crowding raising sickness by density). This goes to PARKED.md (answer 11).
