# First Keep v100 · what was pulled from the old game and SoRen (Nov 4): equations and time values only, for reference. Not law: the dictionary and CALCULATIONS.md are.
Labels: V verified against source · C cited, from known source · D design (the game's choice)

## Time
- Day 120 s · Season 180 s · Year 12 min (D)
- Moon: synodic month 29.53 days; lit fraction (1 − cos i)/2 (V, Meeus 48.1, 49.1)
- Sun height: sin a = sin φ sin δ + cos φ cos δ cos H; δ = −23.44° cos(360°(N+10)/365); latitude 45° N (V)
- Night from sun depth: civil −6°, nautical −12° (C)
- Age-up times: Bronze 40 s · Classical 60 · Medieval 80 · Gunpowder 100 · Enlightenment 120 (D)

## K Climate
- Temperature: mean 10 °C, ±12 over the year, ±5 over the day; hottest mid-summer, mid-afternoon (D)
- Rain or dry: two-state chain, P(wet|dry) 0.3, P(wet|wet) 0.7; summer 0.15, 0.5 (C, Gabriel & Neumann 1962)
- Snow falls at or below 1 °C (V, Jennings et al. 2018)
- Lightning: flashes at least 0.34 s apart (V, WCAG 2.3.1); thunder delay at 340 m/s (C)
- Raindrop fall speed: v = 9.65 − 10.3 e^(−0.6 D) (C, Atlas et al. 1973)
- Fog sight 70, snow 160, blizzard 60 (D)
- Events (seconds): eclipse 20, storm 40, flood 90, meteor 3, wildfire 60, fog 60, heatwave 60, aurora 45 (D)
- Random events: wait t = −mean · ln U; chance per step 1 − e^(−rate·dt) (V, Poisson process)

## KI Impacts
- Wetness: M(t) = Me + (M0 − Me) e^(−t/τ); τ 20 s getting wet, 50 s drying (C, timelag fuel moisture)
- Walking speed on ground: speed = 1/η; η = 1 + 0.8·mud + 0.6·snow (C, Pandolf, Givoni & Goldman 1977)
- Snow melt by degree-day: 0.004 a °C a second; ice 1.6× (0.0064); rain on snow ×1.5 (C form, D rates)
- Ice thickness ∝ √(freezing degree-seconds); full at 500 °C·s (V form, Stefan 1891)
- Traction (friction): ground friction blended by cover; ice slickest just below freezing; a step needing more than the ground offers slips (C)
- Ruts / mud by traffic: depth ∝ passes^0.4, full at 300 unit-seconds a square, heals τ 600 s (C)
- Fire vs wetness: η = 1 − 2.59r + 5.11r² − 3.52r³ (V, Rothermel 1972)
- Fire spread: grows as t² (20 s); a neighbour receives (near/(gap + near))², near 10, reach 40 (C/D)
- Frost: stone builds at half speed · Drought: fields −30% · Rain: bows reach 85% · Blizzard: speed 60%, gathering 50% (D)
- Wagon wheels sink: mud term ×2 for wagons (D, on Pandolf)

## R Resources and work
- Gather per second: berries 0.9, fish 0.8, trees 0.75, gold 0.6, stone 0.55, iron 0.5, meat 1.2 (D)
- Forager's rate: R = c(1 − δ)/(c/g + 2d/v + w·c/(A·v)) (C, Holling 1959, Charnov 1976)
- Move on when 18% better (C form, Charnov; D value)
- Crowding: g ÷ (1 + others/room) (C, Fretwell & Lucas 1970, Sutherland 1983)
- Soil: −10% a year worked, floor 60%, rest +40% a season (D, three-field system)
- Regrowth: ΔN = rN(1 − N/K) (V, Verhulst 1838); sustainable take at K/2 (C, Schaefer 1954)
- Learning by doing: +5% per plot of a kind, to four (C)
- Builders: a crew of n builds n^0.7 times as fast (C, Thomas & Smith 1990)
- Spoilage: Q = Q0 e^(−kt), about 5% a year (C, FAO)
- Market price: P = P0 (Q/Q0)^(−1/ε); ε food 0.5, wood 0.8, stone/iron 1 (C form)
- Eating: a person 30 food in 8 minutes; foot ×1.5, rider ×3, cart ×2 (D)

## S Shell: combat and behaviour
- Battle odds: r²/(1 + r²) (V, Lanchester 1916 square law)
- Who to fight: damage a second ÷ (time to kill + time to reach) (C, Churchill et al. 2012)
- Fight or not: probability V/C (C, hawk–dove)
- Nerve: a loss nearby drains 1/(breakAt × n); group breaks at 30% losses; recovers τ 15 s; rout 8 s, runs 1.3× (D)
- Flank and rear hits: side ×1.5, rear ×2 (D)
- Healing: HP(t) = max − (max − HP0) e^(−t/τ), τ = max/heal (V form)
- Deer flee when staying costs more than running (C, Ydenberg & Dill 1986, from memory)
- Range from height (arrow arc at 45°, no drag): R = (R0/2)(1 + √(1 + 4h/R0)) (V, projectile motion)
- Sight from height: 60 + 24√h (D, horizon ∝ √h)
- Cold and wet: heat loss Q = ΔT / R_total, layers in series (C)
- An order costs half a minute of meals, tired 6 s (D)
- Sickness: SIR, R0 2 (plague 1.5×), recovery 1/60 s (V, Kermack & McKendrick 1927)

## Look and sound (Book 2, later)
- Shadows: h·cot(altitude), capped 3h (C, geometry)
- Flame colour: candle 1850 K, wood/torch 1900 K, oil 2000 K, building 2200 K; reach ∝ √power (C)
- Smoke: height ∝ x^(2/3), width ∝ x^0.9 (C, Briggs 1969, Pasquill–Gifford)
- Camera: critically damped spring, ω 9 (V form)
- Sound: inverse square less air absorption (C, ISO 9613-2); material by decay rate (C, Klatzky et al. 2000)
- Lake sizes: power law N(>a) ∝ a^−1.06 (V); river half-width 0.25 × lake radius (C form, Leopold & Maddock 1953); shoreline index D_L = P/(2√(πA)) (C)

## Second sweep (citations buried in code comments)
- Arrow path (drawing only): flight time 0.12 + d/600 s; height a parabola 4·arc·f(1−f), arc = 4 + 0.16·d (D; disagrees with the range formula)
- Ground friction: dry soil 0.7, wet soil 0.45, packed snow 0.3, ice 0.08 near 0 °C rising to 0.25 at −20 (C, Bowden & Hughes 1939); what a step needs by mover (C, Hanson et al. 1999)
- Fog visibility: V = 3.912/β (C, Koschmieder 1924)
- Melt: degree-day factor (C, Hock 2003); rain on snow (C, USACE 1956)
- Fire grows as t² (C, NFPA 72 / Heskestad 1984)
- Many eyes: a side sees what any of its eyes sees (C, Pulliam 1973, Lima 1995)
- Learning curve: labour falls a set share per doubling (C, Wright 1936)
- Demand elasticity of food 0.27–0.81 (C, Andreyeva, Long & Brownell 2010)
- Hunger: grip strength 58.2 → 41.8 kg without food (C, Keys et al. 1950); hunger factor 0.72
- Quarantine cuts spread about 40% (C, Bootsma & Ferguson 2007)
- Fight or not: hawk–dove (C, Maynard Smith & Price 1973)
- Weighted random pick: roulette wheel, p = w_i/Σw (C, Goldberg 1989)
- Coastline: fractal, amplitude a_k = amp·k^(−H), H = 2 − D (C, Mandelbrot 1967); lake sizes power law (C, Downing et al. 2006)
- Personal space: 3 ft (C, Hall; OSHA 1910.142)
- Shadow projection (C, Blinn 1988)

## The dice (randomizer engine, 08-core) — healthy, keep
- Game dice `rng`: Mulberry32 (constant 0x6d2b79f5), seeded per game; its state is saved, so a game replays exactly. Rules only.
- Look dice `lookDice`: Park & Miller minimal standard (1988), a = 16807, m = 2³¹ − 1, seed 7919. Sky, sound, ground texture, smoke; never rules.
- Seed of the day: YYYYMMDD, the same map for everyone that day.
- Dials: rnd(a, b) uniform · roulette(w) weighted (p = w_i/Σw) · nextIn(mean) exponential wait, −mean·ln U · hazard(rate, dt) chance 1 − e^(−rate·dt)
- One-home helpers beside it: relax (first-order lag) · logistic (Verhulst)

## Third sweep
- Sight lines: woods block sight; a fog square with 3+ trees is a wall; you see the edge, not behind; Bresenham's line (C, geometry). Keep.
- Spoilage: Q = Q0 e^(−kt), 5% a year; the Store halves it (C, FAO; Labuza). Keep.
- Decay: camp pieces lose 3% health a minute in rain, snow, frost (D) · weapons −15% in frost or rain until tempered/oiled (D) · ruts heal τ 600 s · vassal protection and native regard drift back to baseline. Fix: every decay is the same first-order lag (relax); one home.
- No general building decay.

## Not found in the code
- Drag on arrows: none (the range formula leaves it out on purpose)
- Arrow flight arcs: no flight equation; only the range-from-height formula

## From SoRen (acohen2300/soren, live index.html)
- Sky, all from Meeus (Astronomical Algorithms, 2nd ed.) or JPL: true sun and moon (to ~0.1° and 0.25°), obliquity (Meeus 22.2), coordinate turns (13.3, 13.4); sunrise and dusk at the sun 0.833° under the horizon (refraction)
- Planets: Keplerian elements at J2000 and rates (JPL "Approximate Positions of the Planets", 1800–2050)
- Stars: colour from colour index B−V (Mallama & Hilton 2018) → temperature (Ballesteros 2012) → black-body colour
- Meteor showers: the IAU working list, peaks and nights
- Eclipses, solar and lunar (Meeus 54, by geometry)
- Satellites: SGP4 (Vallado et al. 2006)
- Drag on a sphere: ½ρ·Cd·A·v² (fills the arrow drag gap)
- Hertz contact; Auerbach's law for the crack threshold; Weibull for strength by size (possible use: walls and siege damage)
- Skipped (wind, cut from First Keep): Ornstein–Uhlenbeck gusts, Kaimal spectrum, Weibull wind, Saffir–Simpson storms

## War formations (06-rules-tuning: FORM, COLUMN, GRID, TEMPER, CHARGE, FALLBACK, FORMING, CHOKE, AMBUSH)
- Shapes: Line (as they stand) · Wedge (riders +15% damage, take +10%) · Square (−10% damage, −30% from riders, 20% slower) · Front (one rank, all fight, +30% from riders) · Choke (deep, narrow, −15% damage, −20% from riders, 15% slower, only the front fights) · Support (foot ring round shooters, −5% damage, 15% slower)
- March: Column (+15% speed, +10% damage taken); opens into its shape in the last 90
- Grid: 15 apart, twice as wide as deep
- Temper: Hold (no chase, nerve ×0.8) · Guard (shooters step back) · Press (chase ×1.3, blows +10%, nerve breaks 30% faster)
- Charge: 6 s burst, speed ×1.5, damage ×1.3, then tired 10 s at 80%, every 30 s
- Fall back: 6 s, 200 back, damage taken ×0.7
- Forming: lower rank gives way (foot, archers, riders, siege); soft push 0.5; past 70% of the time, one not 70% there holds and fights
- Choke 1–12 files; Ambush: hide in cover, spring at 45, cover looked for within 90
- Dirt: two generations of shapes (Line/Wedge/Square and Front/Choke/Support); sources "from memory"; Temper repeats SP Personality (Press≈Bold, Guard≈Steady, Hold≈Wary) → one home

## Squads (01-rules-basics BN; 39-huddle sqPlan)
- 3 squads, NATO names: Alpha, Bravo, Charlie (were 4, then 6)
- A squad holds 40 at most (BNSIZE), every kind together; set by kind with − + (step 1 under 10, then 5)
- New soldiers of a kind fill the squad's plan; the rest are the reserve
- Unlocked by Command research (War Council)
- Army cap 120 = three squads of 40 (POPMAX 180)

## Type and screen tokens (shell-head.html)
- Fonts: UI "Barlow Semi Condensed" (fallback Arial Narrow, system-ui); display "IM Fell English SC" (fallback Georgia)
- Sizes: 14 and 18 · weight 600
- Slot 44 (Apple's minimum tap) · gap 6
- Timings: quick 0.15 s (a state changes) · sweep 0.4 s (a thing moves) · settle 1.2 s (comes to rest) · long 2.4 s (two rests)
- Ring colours: blue #6aaeff · green #5fd08a · red #ff6b5b · white #ece5d3 · background brown #2a1d13
