# The failing tests, dug into (Nov 13, on S4 code)

Full run: 59 tests ran; 21 fail. Verdicts: STALE = a ruling changed the standard (named); REAL = the game is off a standard; BROKEN = the test itself is wrong; MID = an "equals Mid's number" check, to be rebuilt as ruling + outcome (G5B, Albert 7B); OPEN = not yet traced.

## Worst finding
- The gate's own proof (t-proof: does the gate stop planted breaks) aimed at a line that no longer exists; the crash stopped every full run before that stage. Unverified since when. Fixed (G5b): all five plants stopped.
- One broken key in t-mind hid five checks behind one NaN; fixing it showed `plans` passes.
- 28 of about 45 failing checks are MID: they test equality with Mid's frozen numbers, not whether the game does what you ruled. They can't tell drift from a ruling.

## By test
| Test | Failing checks | Verdict |
|---|---|---|
| t-a1 | quarry | OPEN: stone first arrives at 60 s, the test's window ends at 60 s (STALE timing, longer walks since N19). Also REAL?: a quarry worker walks stone home, 0.17 stone/s against its rate 0.45 |
| t-land | pocket (2) | OPEN: home finds sit 13-14 tiles out, outside the test's pocket ring; one of the two drifted since N19 doubled the land |
| t-peace | books | MID |
| t-civs | figures (72 drawn as Mid's) | MID |
| t-sight | los, mini | OPEN: los partly STALE (N24 #13, computers see in circles); mini not traced |
| t-stage | books; lights; shed | MID; STALE (N13: every building has torches, so lantern not hearth); STALE (N29 shedding) |
| t-wild | books, events, raid | MID (events and raid replay Mid's dice) |
| t-fire | books | MID |
| t-mind | books, moon, ground, flood | MID; OPEN; STALE (B24+B25 wetness by TWI); OPEN |
| t-realm | nums, camp, ans | MID; OPEN; MID (Mid's judgeEnvoy) |
| t-trade | stops | OPEN (eight trade stops' placement) |
| t-alarm | refused, told | OPEN |
| t-orders | 3 checks | OPEN (runs since G5A) |
| t-war | vs table | MID |
| t-kinds | one row | MID |
| t-physics | edge and hours | OPEN (likely STALE: N19 slower days) |
| t-food | same, flips, draws; order | MID; REAL (your Nov 11 ruling: an order costs food, not built) |
| t-same | wet | OPEN (likely STALE: N19/N20 weather pace) |
| t-odds | power and odds | MID |
| t-gather | throws | BROKEN (a find's `way` is gone) |
| t-walls | crew, repair, refund, caps, lines, rings, price | MID; refund touches G15 (refund on cancel, open) |

## Flaky
- t-n29 `homeOnce` failed on one full run and passed on the next, same code.

## Next
1. Trace every OPEN check (about 14).
2. G5B: each MID check becomes ruling + outcome; a number with no ruling behind it is drift.

## Update, Nov 13 12:30 (S5)
- t-a1 quarry: REAL, fixed. A villager sent to work a building kept her old standing spot and walked back and forth: farms, quarries, mints all worked under half their time. t-a1 passes.
- t-land pocket: STALE test, fixed (the Z1 spots moved on Nov 8-10; the test still looked inside the old ring). Passes. Z2-no-woods: OPEN, about ten small trees a corner in a line 520-600 units out.
- t-food order: my G5A check was wrong. Orders cost food by the march ration (1.37 x); the check now tests that and passes. Its other three are MID.
- t-trade stops: REAL lead: 6 trade stops on the map, the book says 8 (two missing on route 1). Not fixed.
- t-sight los: STALE half (N24 #13, computers see in circles); mini OPEN.
- t-n25 fought: flaky under load before; now steady (fighting is priority 2).
- Still OPEN, not traced: t-alarm (refused, told), t-orders (3), t-physics (edge and hours), t-same (wet), t-mind (moon, flood), t-realm (camp), t-sight (mini), t-gather (broken). MID checks (28): G5B, not started.

## Update, Nov 13 13:30 (G5c)
- Now passing: t-alarm (STALE: lake fords left no unreachable ground on a coarse sweep), t-orders (STALE: Design 08 taps; Choke parked), t-a1, t-n25.
- 18 tests still fail. OPEN with leads: t-sight `felled` (player does not see past a felled tree at once) and `mini`; t-physics blizzard hours; t-same `wet`; t-mind `moon`, `flood`; t-realm `camp`; t-trade (6 of 8 stops); t-land (stray trees in Z2). BROKEN: t-gather (Mid replica reads a field that is gone). The rest are MID checks: G5B.
