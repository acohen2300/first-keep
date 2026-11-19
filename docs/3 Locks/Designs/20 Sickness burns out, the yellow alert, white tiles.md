# Design 20: sickness burns out, the yellow alert, white tiles (Albert, Nov 18 2026, 20:46 to 22:02)

His words (The List 35 and 37):
- 20:55: "The villagers die on their own. I saw it with my own eyes. Just fell and disappeared."
- 21:29, on the recovered staying immune: "Is there math for that?" 22:02: "Yes".
- 20:58: "It would be nice to get a warning. We have the red alert. We should have a yellow and orange". 22:02: "Yellow = health crisis / orange kill for now".
- 20:55: "Tile text was supposed to be white and only the cost was supposed to shift from red to white to green." 22:02: "Confirmed".

## A. Sickness burns out (SIR)
- The math: Kermack and McKendrick (1927), Proc. R. Soc. A 115 (N47, already the book's citation). dS/dt = −βSI/N, dI/dt = βSI/N − γI, dR/dt = γI, with β = R0/sickFor and γ = 1/sickFor (D311). N is the whole town: S + I + R.
- The fault (proven Nov 18, `docs/4 Now/tools/sick.py`): the code had no R. A villager who got well was susceptible again, so the sick share sat at 1 − 1/R0 (half the town, R0 2) for the whole game: 37 of 60 dead in 45 minutes with full food.
- The ruling: whoever gets well, by time or by a healer, is immune for good. An outbreak then reaches a share z of the town, z = 1 − e^(−R0·z) (about 0.80 at R0 2), and ends. Each case dies with chance 1 − (1 − death)^(sickFor/beat) = 4.7%: about 2 of 60 an outbreak.
- New villagers are not immune; an outbreak can return as the town turns over.
- Nobody at risk, no outbreak, and no letter saying one began.

## B. The yellow alert
- One alert circle on the line, coloured by the highest alert: red while something of mine is attacked, yellow while any of mine is sick and nothing is attacked. A tap on yellow jumps to the sick, one after the other, as red does for attacks.
- Why one circle (Claude's call): alert scales show one level, the highest (weather warnings, threat levels); and two circles cut the card's "Talk" off the line at 390 px.
- Orange: killed for now (Parked).

## C. White tiles
- A tile's text is white (the cream of every tile). Only the cost changes: red short, white exact, green over (N70's rule, unchanged). On a building's card the whole tile no longer takes the cost's colour (supersedes Nov 17 05:27).

## Claude's calls, his to overrule
- One immunity for sickness and plague alike (a plague survivor does not catch the ordinary sickness again, and the other way round). Two would be truer to life and more code.
- "Health crisis" = anyone of mine sick, soldiers included. No threshold.
- The yellow circle uses the red alert's sign; the colour tells them apart.
