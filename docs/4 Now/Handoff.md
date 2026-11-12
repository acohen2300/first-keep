# First Keep: hand-off (Nov 12, 2026, 17:45)

Rules: `CLAUDE.md` (the one start). Open list: `The List.md`. Order and audit: `The Plan.md`.

## Where it stands
- Code: `frankenstein-refresh/v100/`, branch `n29-the-list`, N31 sealed. Not merged to `main`.
- Preview Albert plays: https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n31/ (copy on `main`).
- Live v100 on `main`: untouched since N10b. Going live is Albert's call only.
- Other branches (`n11`, `n24-build3`, `n25`–`n28`, older): archive. `n24-build3` holds two things Albert said no to.

## Why we stopped building (Albert, Nov 12 14:50)
Days of play, patch, play built fixes on fixes. Found on Nov 12:
1. The list had many homes (The List, The Plan, Next build list, Decisions - Nov 11, Owed, v81 List, Triage). Now: The List only.
2. Builds stacked on unmerged branches.
3. 22 old tests fail, unsorted (G5): no safety net.
4. One-home audit (`The Plan.md` Part 1): 75 places write a unit's job, 35 its target, 25 its path. P2 (the job door) was planned, then skipped.
5. Focus (E1027): set on every tap, pinned to one find. If that find is full the villager works another but stays focused on the full one, and returns to it after a raid (`combat.js:176`, `econ.js:145`, `econ.js:257`). Albert's rule #17: stays on its *job* like a reasonable worker.
6. Menus never checked against the kit (G2).

## Done Nov 12 afternoon (Albert 15:08 yes yes)
1. Housekeeping: old lists archived to `docs/6 Records/Archive - lists to Nov 12/`; The List is the one list; `n29-the-list` the one working branch.
2. The 22 failing tests sorted, first pass: `Failing tests - Nov 12.md`. Group B needs Albert's call.
3. Gate `proof` (X99) built, sealed (S3 in BUILDS.md), proven by planting bad lines. 16 DONE lines without real proof moved to BUILT.

## Nov 12 16:45
- Albert's call spec for villagers and army is written (`docs/3 Locks/Designs/08 ...`): P2's yardstick. The List section 7 holds his answers (the freeze is snow, H3).

## Nov 12 17:45: P2a built and sealed (BUILDS.md P2a); preview-n32 on main for Albert to play. Next: P2b (the card, mock first), P2c (one end of job).

## Next (CLAUDE.md section 6)
1. Housekeeping: archive the other lists into The List, one working branch.
2. Sort the 22 failing tests.
3. P2, the job door, with Focus and the bug traces.
4. Menu check (G2) and rings (P4).
5. The rest of The List.

## Now
- P2b built (preview-n33), his play owed. Next: H3 (snow freeze), P2c. Was: P2a works (Albert played it). P2b: the card mock in `mockups/p2b/`, for his pick. Then H3 (snow freeze), P2c.
- How a fix works, and how to take over: `CLAUDE.md` 8c and 8d.

## Waiting on Albert (about 12 calls)
Row 5 (V4), the three ring decisions (D1), four rebalance numbers (D4), nerve (E7), caravans (C5), mock picks (D5), and G15. Give him one quick-answer page, 1–3 lines an item, not one at a time in chat.

## Albert's notes, Nov 12 afternoon (on The List after housekeeping)
- Gold felt short; in one minute of Medieval: +345 in, −1000 out (a purchase), 17 on gold. Not a bug as far as seen.
- Winter food: about 300 in, 307–360 out with ~101 people, right after the Medieval age-up. He wants a check that the eating numbers add up (Out looked low for 101 people) and a heads-up before winter. Not verified in v100.
- Research done: the top RTS villager-control complaints (idle with no warning, orders overridden by automation, babysitting chores, long walks). Lesson: automate chores, never override the player's order.
