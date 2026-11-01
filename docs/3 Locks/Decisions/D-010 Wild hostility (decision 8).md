# D-010 Wild hostility (decision 8) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked; amended by D-055 (a soldier fights back) and D-058 (outlaws, bandits and robbers follow their own regard) [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: the record below [2026-11-01 07:45]
- Its source: none named in the record [2026-11-01 07:45]
- Its code home: Code home: 05-rules-wild.js, 38-natives.js, the shared hostility test. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 738-739, 811-817 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

Wild hostility (C1):
 Natives follow relations, animals and outlaws always hostile: agreed?

8. Wild hostility. DECIDED (Albert, Oct 31).
People hazards that are not Natives (bandits, robbers, camp guards) are always enemies to everyone. Only the Natives follow relations. Treaty logic: 
pacta tertiis nec nocent nec prosunt
 (a treaty binds only its signers); Olson 1993, roving vs stationary bandit. Code home: 05-rules-wild.js, 38-natives.js, the shared hostility test.
Animals get a temperament field, not a name check. Flee (deer): Ydenberg &amp; Dill 1986, flee when cost of staying exceeds cost of fleeing; wildTick flee step and DANGER_R. Defend (boar, bear, den): Hawk-Dove game, Maynard Smith &amp; Price 1973, Nature 246, fight with probability V/C. Hunt (wolf): prey-choice model, Charnov 1976, attack only if gain / handling time beats the average rate; the existing canBeat and groupPower test. Use the math when the code is written.
Soldiers do not touch animals unless the player orders it, or a civilian is targeted and the animal is within a soldier's line of sight. Touches the spawn-pursuit bug (4) and the ignorable test in 15-sim-spatial.js.
Open consequence: raids no longer follow Natives' regard, so the outlaw raid target needs its own rule at 4b.
