# First Keep v100 · Q Calculations and N Citations

Q is letters only, so a calculation can never be mistaken for a number. N is a letter and a number. INDEX.md matches the two both ways and is written from this page, never by hand. Pulled from the old game and SoRen on Nov 4, cleaned: no wind, no fantasy, no made-up arrow arc, no duplicates; every decay, wetness, wound and loyalty is one calculation, QP.

## Q Calculations
Sky and time
QA Sun height: sin a = sin φ sin δ + cos φ cos δ cos H · N1, N2
QB True sun, moon and planets: Meeus and JPL elements · N2, N3
QC Moon lit fraction: (1 − cos i) / 2 · N2
QD Day's edges: sunrise at −0.833°, civil −6°, nautical −12° · N2
QE Eclipses, by geometry · N2
QF Colour from temperature: black body (stars via colour index, flames by kelvin) · N4, N5, N54
Climate
QH Rain or dry: two-state chain, P(wet|dry), P(wet|wet) · N7
QI Snow line: snow at or below 1 °C · N8
QJ Raindrop speed: v = 9.65 − 10.3 e^(−0.6 D) · N9
QK Visibility: V = 3.912 / β · N10
QL Lightning: flashes ≥ 0.34 s apart; thunder delay = distance / 340 m/s · N11
QM Random events: wait = −mean · ln U; chance a step = 1 − e^(−rate · dt) · N12
Ground and impacts
QN Walking cost: speed = 1 / η, η = 1 + a·mud + b·snow · N13
QO Melt: degree-day, melt = k (T − 0); rain on snow faster · N14, N15
QP Settle: x(t) = L + (x0 − L) e^(−t/τ) (wetness, healing, decay, nerve, loyalty) · N16
QQ Ice growth: thickness ∝ √(freezing degree-seconds) · N17
QR Slip: chance rises as a step needs more grip than the ground gives · N18, N19
QS Ruts: depth ∝ passes^0.4 · N20
QT Fire vs wetness: η = 1 − 2.59r + 5.11r² − 3.52r³ · N21
QU Fire growth ∝ t²; heat to a neighbour ∝ (near / (gap + near))² · N22
Work and economy
QV Forager's rate: R = c(1 − δ) / (c/g + 2d/v + w·c/(A·v)) · N23, N24
QW Move on: only when the new find pays enough more · N24
QX Crowding: g ÷ (1 + others / room) · N25, N26
QY Growth: ΔN = r N (1 − N/K) · N27
QZ Sustainable take: hold the stock at K/2, yield r K / 4 · N28
QAA Soil: wears when worked, rests back, never below a floor · N29
QAB Learning curve: labour falls a set share per doubling · N30
QAC Crew: n builders work n^p times as fast · N31
QAD Spoilage: Q = Q0 e^(−k t) · N32, N33
QAE Price: P = P0 (Q / Q0)^(−1/ε) · N34
Combat and behaviour
QAF Battle odds: r² / (1 + r²) · N35
QAG Who to fight: damage a second ÷ (time to kill + time to reach) · N36, N37
QAH Fight or not: probability V / C · N38
QAI Nerve: each loss nearby drains 1 / (break × n) · design
QAJ Arrow flight: projectile motion under gravity with quadratic drag, F = ½ ρ Cd A v²; the range is where it lands (replaces the no-drag range formula) · N39, N40
QAL Sight from height: a + b √h · N41
QAM Line of sight: grid line; woods block · N42
QAN Many eyes: a side sees what any of its eyes sees · N43, N44
QAO Flee: run when staying costs more than running · N45
QAP Cold and wet: heat loss = ΔT / Σ R · N46
QAQ Sickness: new = β S I / N, recovery γ, R0 = β/γ; quarantine cuts β · N47, N48
QAR Weighted pick: p = w_i / Σ w · N49
QAS Breaking: Hertz contact, Auerbach crack threshold, Weibull strength · N50, N51, N52
Look and sound (Book 2)
QAT Shadow: length = h · cot(altitude) · N53
QAU Light reach ∝ √power (flame colour uses QF, colour from temperature) · N54
QAV Smoke: rise ∝ x^(2/3), spread ∝ x^0.9 · N55, N56
QAW Camera: critically damped spring · N57
QAX Sound: inverse square less air absorption · N58
QAY Material sound by decay rate · N59
QAZ Coastline: fractal, a_k = amp · k^(−H), H = 2 − D · N60
QBA Lake sizes: N(> a) ∝ a^(−c) · N61
QBB River width grows with the lake as a power · N62
QBC Shoreline index: D_L = P / (2 √(π A)) · N63
The board (floor 1)
QBD The view: the grid turned by A1 about the site's middle; a point's depth on the screen is y · sin(A2), its height h · cos(A2) (parallel projection; the camera A2 over the ground) · N66
QBE Slope or face: a step between two tiles steeper than the angle of repose (A3) is a face; gentler, the tiles meet as a slope · N64
QBF The dice: one seed; Mulberry32; the seed of the day is the date YYYYMMDD · N65
QBG Headlands and bays: where the coast stands out the waves gather and cut a cliff; where it bends in they spread and lay a beach · N67

## N Citations
N1 Spherical astronomy, the altitude formula (standard)
N2 Meeus, Astronomical Algorithms, 2nd ed. (1998)
N3 JPL, Approximate Positions of the Planets (1800–2050)
N4 Mallama & Hilton (2018), colour indices
N5 Ballesteros (2012), colour index to temperature
N6 (retired: satellites cut, Stone Age)
N7 Gabriel & Neumann (1962), QJRMS 88
N8 Jennings, Winchell, Livneh & Molotch (2018), Nature Communications 9:1148
N9 Atlas, Srivastava & Sekhon (1973); Gunn & Kinzer (1949)
N10 Koschmieder (1924)
N11 WCAG 2.3.1, three flashes
N12 Poisson (1837); Feller, An Introduction to Probability Theory, vol. 1
N13 Pandolf, Givoni & Goldman (1977)
N14 Hock (2003), degree-day melt
N15 US Army Corps of Engineers (1956), Snow Hydrology
N16 First-order lag (standard); Cukjati, Reberšek & Miklavčič (2001)
N17 Stefan (1891)
N18 Bowden & Hughes (1939), friction on ice and snow
N19 Hanson et al. (1999), slip and the grip a step needs
N20 Bekker (1960), Off-the-Road Locomotion: pressure–sinkage p = (kc/b + kφ) zⁿ; Wong, Theory of Ground Vehicles (multi-pass) — from memory, to open; Botta et al. (2009), Soil & Tillage Research 103: rut depth grows with passes (opened, abstract only)
N21 Rothermel (1972); USDA RMRS-GTR-371
N22 Heskestad (1984); NFPA 72, the t² fire
N23 Holling (1959), Can. Entomol. 91
N24 Charnov (1976), Theor. Pop. Biol. 9
N25 Fretwell & Lucas (1970)
N26 Sutherland (1983)
N27 Verhulst (1838)
N28 Schaefer (1954)
N29 White (1962), Medieval Technology and Social Change: three-field rotation raised the sown share from 1/2 to 2/3 — from memory; Rothamsted Broadbalk (since 1843): unfertilised wheat falls to a low, stable yield, the floor — from memory, to open
N30 Wright (1936), learning curve
N31 Thomas & Smith (1990), overmanning
N32 Labuza, first-order food loss
N33 FAO, Grain storage techniques, ch. 6
N34 Andreyeva, Long & Brownell (2010), food price elasticities
N35 Lanchester (1916), Aircraft in Warfare
N36 Churchill, Saffidine & Buro (2012), AIIDE
N37 Cox & Smith (1961), Queues
N38 Maynard Smith & Price (1973), hawk–dove
N39 Projectile motion from a height (standard)
N40 Drag on a sphere (standard fluid dynamics)
N41 Horizon from a height, √(2Rh) (standard)
N42 Bresenham (1965), grid line
N43 Pulliam (1973)
N44 Lima (1995)
N45 Ydenberg & Dill (1986)
N46 Thermal resistance in series (standard)
N47 Kermack & McKendrick (1927), Proc. R. Soc. A 115
N48 Bootsma & Ferguson (2007), PNAS 104(18)
N49 Goldberg (1989), roulette-wheel selection
N50 Hertz (1882), contact
N51 Auerbach (1891), crack threshold
N52 Weibull (1951), strength by size
N53 Plane geometry, shadow length
N54 Black-body colour; inverse-square light
N55 Briggs (1969), plume rise
N56 Pasquill–Gifford dispersion
N57 Damped harmonic oscillator (standard)
N58 ISO 9613-2, sound outdoors
N59 Klatzky, Pai & Krotkov (2000), Presence 9
N60 Mandelbrot (1967), Science 156
N61 Downing et al. (2006), lake sizes
N62 Leopold & Maddock (1953), USGS Paper 252
N63 Hutchinson (1957), shoreline development
N64 Angle of repose, dry sand about 34° (Al-Hashemi & Al-Amoudi 2018, Powder Technology 330, a review; from memory, to open)
N65 Ettinger (2017), Mulberry32, a 32-bit generator; the seed of the day is the game's own rule
N66 Parallel (dimetric) projection; the classic turned-view RTS draws the ground at 2:1, a camera 30° over the ground (from memory: Age of Empires II's tiles are 2:1)
N67 Wave refraction on an indented coast: energy converges on headlands, diverges in bays (coastal geomorphology, standard; Bird, Coastal Geomorphology, 2008; from memory)

## Values these use (numbers; floor 1's are in D now, the rest go to D at their floor)
Day 120 s, season 180 s, year 12 min · gather rates · fire 20 s · melt 0.004 · ice 500 °C·s · ruts 300 and 600 s · wet 20 s, dry 50 s · mud 0.8, snow 0.6 · friction 0.7, 0.45, 0.3, 0.08–0.25 · personal space 3 ft · spoilage 5% a year · eating 30 food in 8 min · R0 2 · rain-chain odds · crew 0.7 · move-on 18% (fog sight comes from QK, not typed)
