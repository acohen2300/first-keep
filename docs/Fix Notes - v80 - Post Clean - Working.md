# Fix Notes - v80 - Post Clean - Working
*Build 80 preview 9, Oct 31, 2026. The builder's notes for the eight fixes and four test and record items Albert approved (his double yes). Branch `fix80`, made from `main` at c3b4964; not pushed, not published.*

## Start QC, before any change
`python3 tests/handoff.py` on c3b4964: START QC PASSED (build, wrap, lint, the gate at four sizes, 12 planted bugs caught). No FAIL to report.

## Step 1: the eight fixes

**1. Self-defence (decision 8, amended Oct 31, 20:38).** Built.
One home for who a side strikes: `strikes(o, v, me)` in `15-sim-spatial` (a foe at war, or anything attacking the one looking, at peace too, less what it leaves alone), used by `nearestFoe` and `bestFoe`. `ignorable` lets an animal through when it is on the one looking (`onMe`). A soldier keeps a foe that is on it wherever it stands (`solTick`: the held-target test and the home filter). The rest of decision 8 is unchanged: animals are otherwise left alone unless ordered, or on a civilian in sight. Test: a wolf on a spear at peace with the wild is a foe, and the spear strikes it within 8 s.

**2. Group sight's eyes (decision 8b).** Built. `groupSees` counts only soldiers and finished buildings; the attacked civilian is no longer an eye. Test: a boar on a villager that no soldier or building sees is left alone; one soldier in sight makes the whole side see it (a far soldier goes for it).

**3. The villager search, decision 1 as written.** Built.
- The moment a wild find runs out the villager looks from that spot (radius x = 90) and remembers the best it sees (`u.next`, an id). It delivers what it carries (the carry branch runs first, unchanged), then goes straight to it.
- If none: it searches from its anchor, where the player placed it (`setJob`'s new fourth argument, set by a tap on a find and by a find card's Send), else its nearest drop-off. r(t) = 90 + 90·min(1, t/10 s), t since the find ran out.
- Candidates (`bestNode`, given the point it searches from): same-kind finds its side has seen within r, or any a friend (its own side) is working. A placed villager takes none past the cap x + y = 180 from its anchor; the rest none past the leash, 200 (DANGER_R.far) from the find's nearest drop-off. Chosen by R.
- Nothing found: it keeps its job, walks to the drop-off, shows Zs, and looks again every 2 s plus up to 1 s of the seeded dice (`SEARCH.again`), with no end.
- `give: 25` is cut (never decided), and with it the give-up branch (job dropped, one shared post point).
- The search clock, the waiting spot and the remembered find are cleared in one place at the top of `vilTick` whenever the villager has a find by any path (the player's order too) or no job.
- A villager whose hunt or chore is over (`pj`) still goes back to its old job at once when no find is in reach (as v70; v80 had made it wait 35 s).

**4. Waiting spots round the whole building.** Built.
- The scale: nothing stated it ("the game has no metre", SCIENCE.md). Measured from the drawing: a villager's body is 22.1 figure units tall × FIG 0.66 = 14.6 world units; taken as an adult of 5.5 ft, 1 ft = 2.65 units (`FOOT` in `01-rules-basics`, a row in SCIENCE.md, held to the drawing by `tests/science.py`).
- The spacing: `SEARCH.gap` 3 ft (7.95 units) in the rules table. Sources checked this session: OSHA 1910.142(b)(3), "spaced not closer than 36 inches both laterally and end to end" (opened); Hall's personal distance, far phase 2.5 to 4 ft (Wikipedia opened, the book not).
- `spotAt(b, i)`: spot i of N on the outline, the middle of the free lane square, clockwise from the top-left corner, all four sides; N = the outline over 3 ft (a Town Center holds 25). `waitAt`: a waiter takes the free spot nearest it (ties: the lower number), skipping walled or water squares, keeps it until it has a find. Deterministic: no dice; the step's order settles a tie on one tick; the test runs it twice.
- Honest note: a villager stops within ARRIVE (9, decision 10a) of its spot, so it stands within about 3 ft of it, not on it. ARRIVE is larger than the spacing; I did not change 10a.

**5. Walking: any real move is a step.** Built.
- One home, `stepTo(u, x, y)` in `09-nav`: it moves the unit and adds the distance to `u.st.walk`. Used by `moveTo`, the deer's flee step, `pushApart`, the knockback, the lake push, the map-edge clamp, the wall rescue, the dragon's flight and the bison's shove.
- The view no longer reads `mvT` to decide a figure is stepping: it notes when each unit's walk last grew (a WeakMap, view only) and steps the legs for 0.15 s after. So "mark the unit as moving" is done through the walk itself, with no new saved field.
- The 0.3 threshold: its comment said it served both (facing and starting the walk). Kept for the facing and for `mvT` only, because `mvT` is read by the simulation as "meant to move" (who gives way in a push, marching, the quick action's hold); counting pushes there would change the fights and the economy. A small move now moves the legs.
- `moveTo` now counts the ground really covered: a unit against a wall no longer walks in place (QC G2).
- Not counted as steps, on purpose: a unit popping out of a building (it was not on the map).

**6. Boar and bear react at 140 again.** Built. `STARTLE` (45) is cut; `WILD_LOOK = 140` in `05-rules-wild`, v70's distance for every beast and guard that is not a raider. The Hawk-Dove V/C weighing is unchanged.

**7. Building shadows (decision 14).** Built, by a different method than first tried.
- First tried: one unit square as a Path2D, laid three times per building by matrix (footprint, footprint moved, the band the diagonal sweeps). Measured slower than the old hull (3 Path2D adds per building), so not kept.
- Built: the shadow is a hexagon whose corners are the footprint's, each kept, moved by L, or both. Which corners lead depends only on the light's direction; that shape is made once per direction (`hexOf`, cached) and each building only moves and stretches it by its w and L: no hull, no sort, no arrays per building. Same path and one fill as before.
- A site casts by its progress: h × prog.
- Frame cost (headless, a fixed scene: a new game, 60 buildings added round the Town Center, the sun of 12:15, median of 7 × 30 frames, three runs each):
  - whole frame, zoom 0.9: before 10.4 to 11.2 ms, after 10.6 to 11.5 ms; zoom 2: before 9.1 to 11.1 ms, after 9.0 to 11.4 ms. No difference above the noise.
  - the shadow pass alone, 105 buildings: before 142 and 143 µs (zoom 0.9 and 2), after 115 and 135 µs.
- Not done (not asked): the shadow is still cast at the roof's top height, and the art's eastward shear is not followed (QC S2, S5).

**8. Welcome back holds the whole screen.** Built. One listener on the stage, beside `cardLocked` in `34-save`: while the Resume card (or the setup card it opened, while the save is held) is up, a tap, drag or wheel anywhere but on the card goes no further. Test: with a real save waiting, boot shows the card; real taps on the stores count, the map and a wheel leave it up; its own Resume answers.

## Step 2: tests and records

**9. The planted-bug check.** Rebuilt in `tests/handoff.py`: the clean copy builds, each named test passes on it (the control run), and a planted bug counts as caught only when the test fails with a FAIL line carrying the words named for that plant; a crash, a page error or a broken build catches nothing. 31 plants (was 12; the records said 13). The first run caught two tests that could not fail (the anchor test, and the event-on-load test), both fixed. Now all 31 caught.

**10. Tests that could pass while the behaviour was wrong.** Fixed:
- group sight: the old test put both soldiers on one spot; now a far soldier, a blind side and the attacked villager as a non-eye.
- back to work: the old test called the helper; now three repair exits run in the game (building whole, building gone, fire out).
- the save checks that only looked for text: the event on load, the alert voice, All hands shown on, stale saves' slots are now run (an event really saved and loaded; `voiceFree`, the alert rule, made one testable home; the Emergency card rendered; two stale saves read). The Resume checks now come from a real boot with a save waiting, not a hold set by hand.
- The 3-second search check and the helper-only check are removed (replaced).
- Left as text checks: the House fix (`card:menu,land`), and the two code rules (no Math.random in the simulation, no purse change outside earn, spend and payBack), which are rules about the code itself.

**11. Tests for every step 1 item,** each shown failing on its planted bug: listed in `tests/handoff.py` PLANTS (self-defence, the eyes, the remembered find, the anchor, the leash, friends' finds, no end, the clock reset, the spots, a push, a small move, 140, the site's shadow, the shadow cache, the lock).

**12. Records.** HANDOFF.md says the preview is Build 80 and what is in it. The owed list is one section of the Build List, printed by `tests/handoff.py` (no CUTS grep, no SCIENCE grep), brought up to date. SCIENCE.md has rows for the scale, the spacing, the search, the walk, the eyes, the self-defence rule, 140, the wall slide, the tie-break and arrival, and the shadow, each source marked opened or from memory; the deer and Hawk-Dove rows corrected (R4, R6). Decision 8's amendment is in the Build List and SCIENCE.md.

## Results
Gate (four sizes), lint, START QC (31 of 31 plants caught), soak 1 to 3 × 20 min: all pass. Fingerprint accepted with the true cause (140 and self-defence, each found by taking it out alone).

## Rules bent
- RULES §0 "one home": `voiceFree` adds a small predicate to make the alert rule testable; it is the rule's one home now, `sfx` reads it.
- Two exports for tests only (`ctx` getter, `hexOf`) in the test hook.
- No other rule bent that I know of.

## Decisions for Albert
1. Computers' villagers now wait with no end too (same rule for every side). Their brain moves only villagers with no job, so a computer's waiter is not moved to other work. Balance against v70 (4 seeds × 30 min): Bronze 4.4 to 4.5 min, Classical 8.2 to 9.2, Medieval 20.0 to 21.2; blocked villager-seconds 75.5 to 111.5. Classical a minute later is not yet traced to one change; I would trace it before live.
2. "Skip the danger map" (decision 1): read as "leave finds on the danger map out", as before. Say if you meant the other reading.
3. A villager waiting for a find shows Zs but is not counted by the idle counter or the idle button (it has a job). One meaning of idle?
4. At peace with the Natives, a wolf on your villager is still not fought by your soldiers (the C1 hostility split, not built); a soldier bitten itself now fights back. Build C1 next?
5. A soldier fighting back a Native that struck it will cost regard (blows on the Natives cost regard). Today Natives at peace do not strike, so it does not arise; it will with 4b.
6. The QC audit reports (13 files and the fresh review) are in the session's scratchpad, not in the repo. Copy them into `docs/v80 Audit/`?
