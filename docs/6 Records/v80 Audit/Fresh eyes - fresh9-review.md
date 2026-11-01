# Fresh review: branch fix80 (Build 80 preview 9)

Reviewer copy: detached worktree of fix80 (5e62170); main (c3b4964) built in a separate detached worktree of /home/claude/first-keep. Both removed after. One browser at a time.

## What I ran
- `python3 build.py` on both: sizes 1,189,980 (fix80) and 1,183,716 (main), as CUTS says.
- `tests/moves.py`, `tests/saves.py`, `tests/science.py`: PASS.
- `tests/handoff.py` (START QC) in full: PASS. All 31 planted bugs were caught, the control runs passed, and the gate passed at four sizes with the baseline.
- Fingerprint on both builds: each matches its own baseline.json exactly.
- Fingerprint with changes taken out (my own copy):
  - Boar/bear 45 back **and** self-defence out: identical to main, every minute.
  - Self-defence out alone: identical to fix80. It changes nothing on its own.
  - Boar/bear 45 back alone: main everywhere except minute 5, side 1 (264/130/100/20/23/9 against main's 262/130/100/270/24/9) and the wild count (141 against 140).
- My own planted bugs, each on its own:
  - Remove the 180 cap for placed villagers: moves.py PASSES.
  - Search from the drop-off instead of a placed villager's anchor: moves.py PASSES.
  - Drop `wheel` from the card lock: saves.py PASSES.
  - Remove the leash: caught. Spot gap of 2 ft: caught. (These two check that my method works.)
- Played the probes:
  - Spot spacing for every drop-off kind.
  - 29 villagers waiting at the Town Center for 40 s.
  - Welcome back card: wheel, drag, minimap, the four HUD buttons and keys, on both builds.
  - 24-minute game, seed 2, normal: villagers with a job and no find, per side, both builds.

## Findings, most serious first

### 1. Waiting spots break the 3 ft rule at the corners (item 4). Read and ran. Matters: medium.
`src/13-sim-civil.js:65` `spotAt` spaces spots 3 ft apart along the outline (8 units). The outline turns at the corners, so the two spots either side of a corner are only √2·4 = 5.66 units apart: 2.13 ft.

Measured minimum spacing:

| Building | Spots | Closest pair |
|---|---|---|
| Town Center (keep) | 30 | 2.13 ft |
| town | 25 | 2.13 ft |
| dock | 15 | 2.13 ft |
| throne | 35 | 2.13 ft |
| mill, lumber, mining, market, workshop | 20 | 3.02 ft |

The main drop-off is the one that breaks the rule. The spots test (`tests/moves.py:114`) checks only the 3 to 5 spots in use, so it passes while the rule is broken.

Simplest fix: put a spot on each corner, so that N is a multiple of 4.

Separately, the whole-building claim is checked only as "at least 2 sides" (`tests/moves.py:115`).

### 2. Two parts of decision 1 have no test (item 3). Ran. Matters: medium (test gap, not a behaviour bug).
- **The 180 cap for placed villagers** (`src/12-sim-core.js:705`): removing it passes moves.py.
- **Searching from a placed villager's anchor** (`src/13-sim-civil.js`, the `nearestNode(... u.anchor || dropFor ...)` line): replacing it with the drop-off passes moves.py.

The cause: in the "placed" case of the leash/cap test, the find is 72 from the spent spot, so the first look finds it, and the anchor search and the cap never run.

### 3. The Welcome back test checks only that no other card opened (item 8). Ran. Matters: low.
The behaviour is right. On fix80, wheel, drag, minimap, HUD buttons and keys all do nothing while the card is up. On main, wheel zoomed (1.3 to 0.71) and the tally and status opened cards.

The test is the weak part. Removing `wheel` from the lock at `src/34-save.js:170` still passes, because the zoom is never checked (`tests/saves.py:68`).

### 4. The fingerprint reason in CUTS.md is true, worded slightly loosely. Ran. Matters: low.
The two named changes, taken out together, give main's fingerprint exactly. That confirms the search, eyes, spots and steps do not move the first five minutes.

But "self-defence (side 1, minute 5)" shows up only when measured against boar/bear at 45. In the shipped build, self-defence alone changes nothing; all the difference comes from the boar and bear distance (which also moves the wild count at minute 5).

### 5. New numbers or rules not on the approved list. Read. Matters: low; each is small, but Albert should know.
- `FOOT = 2.65` (`src/01-rules-basics.js:25`) assumes a villager is an adult of 5.5 ft. The 5.5 is new. The derivation is in SCIENCE.md and pinned by `tests/science.py`.
- Spots sit `NAVC/2` (5 units, about 1.9 ft) out from the wall, with a minimum of 4 spots (`spotAt`). Both are new.
- `onMe` (`src/15-sim-spatial.js:28`, `:35`) applies to whoever is asking, not only soldiers: towers via `src/12-sim-core.js:432`, armed carts, and fleeing or falling-back soldiers. Played: no animal ever targets a building, and armed carts already struck a wolf on main. So nothing changes in play today, but the rule is wider than "a soldier".
- A soldier at home chases a unit attacking it past its home radius (`src/14-sim-troops.js` near 338). This follows from "fights back".

### 6. Decision 1 is not fully "exact"; the branch says so itself. Read. Matters: decision for Albert.
These are all listed under Owed in the Build List, not hidden:
- "Skip the danger map" is read as "still exclude danger-map finds" (`src/12-sim-core.js:670`).
- Computers see every find; only the player is held to sight (`:672`).
- Waiting villagers are not counted by the idle counter or the idle button.
- When the side is at peace with the wild/Natives (owner 4), soldiers do not defend a villager from an animal (`strikes`, `:35`). So item 1 does not hold in that state.

Two more points the record does not raise:
- The search clock starts when the find runs out, not after delivering. A villager whose delivery walk takes more than 10 s therefore starts at the full 180 radius. The decision text ("deliver, then search ... growing over tau") can be read either way.
- The "look from the spent spot" uses where the villager stands (`src/13-sim-civil.js:180`), not the spent find. This only differs when the find is emptied by someone else while the villager is on its way.

### 7. Items checked and found as approved
- **Item 1**: wolf/boar biting a soldier is fought back, at peace too. Otherwise animals are ignored unless on a civilian in sight.
- **Item 2**: the eyes are soldiers and finished buildings only (`src/08-core.js:599`).
- **Item 3**: the 25 s give-up is gone. A waiter keeps its job with no end, re-looks every 2 + up to 1 s, and takes a new find after a minute of waiting (moves.py).
- **Item 5**: every sim position write is now `stepTo`. The remaining direct writes are the step out of a building's door (`src/11-orders.js:874`, `13-sim-civil.js:12`, `:116`, `14-sim-troops.js:152`, `40-emergency.js:70`); they are appearances, not walking.
  - 29 waiters at the Town Center showed no leg jitter: 0 walk in 10 s once settled.
  - Waiters stand up to 9.4 units off their spot after crowding.
- **Item 6**: `WILD_LOOK = 140` for all (`src/05-rules-wild.js:66`, `src/14-sim-troops.js:474`). Hawk-Dove weighing kept.
- **Item 7**: one hexagon per light direction, shared by every kind. Same winding as the ovals, so one path and one fill still works. A site's shadow is scaled by progress. The sampled shape matches the old hull in 8 directions (moves.py).
- **Item 8**: as in finding 3.
- **Plant check**: a control run and a named FAIL line are now required. The 31 plants are all caught.

### 8. Did anything that worked on main break? Ran. Matters: none found.
- **24-minute game, seed 2:** no computer villagers stuck waiting. Villager-seconds with a job and no find, per side (player, then the three computers):

  | Build | Player | Computer 1 | Computer 2 | Computer 3 |
  |---|---|---|---|---|
  | fix80 | 22 | 42 | 100 | 136 |
  | main | 6 | 101 | 439 | 152 |

- **The unattended player** lost all 3 villagers by minute 16 on fix80; on main 1 was still alive at minute 24. This is likely the boar/bear at 140 (v70's behaviour, approved).
- **Side 3 at minute 24:** age 2 with 20 villagers on fix80, against age 3 with 23 on main. This is one seed. It is in line with CUTS's "Classical about a minute later, not traced".

The latent `hasTag` crash, when an animal targets a building, exists on main too and cannot be reached in play: only the horde targets buildings, and the horde has no animals.
