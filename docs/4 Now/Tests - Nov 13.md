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
