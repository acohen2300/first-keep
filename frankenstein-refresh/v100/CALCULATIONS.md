# First Keep v100 · Book 1, Laws: Q Calculations

Q is letters only, so a calculation can never be mistaken for a number. N is a letter and a number. INDEX-CITATIONS.md matches the two both ways and is written from this page, never by hand. Pulled from the old game and SoRen on Nov 4, cleaned: no wind, no fantasy, no made-up arrow arc, no duplicates; every decay, wetness, wound and loyalty is one calculation, QP.

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
QBH A lake's size drawn from the power law (QBA): area = a_min · U^(−1/c), U uniform, capped at a_max (the Pareto draw) · N61
QBI Roads cross rivers at fords: where a river meets one of the four roads its bed rises to wading depth · N68
QBK The art frame: a building's picture is painted with its front edge along x and sheared by sin A2 · sin A1 so that edge follows the turned grid; its depth is (sin A2 · cos A1 + shear · sin A1) a unit of width, the back standing sin A1 to the right (QBD worked for a picture painted flat) · N66
QBL The way: A* over the tiles, eight neighbours, a straight step 1 and a diagonal √2, the octile distance as the heuristic; a diagonal never cuts a blocked corner · N74
QBM Walking: a shell moves its speed in metres a second (D86) times the units a metre (D85) along its way, tile middle to tile middle; a person walks at quick time, 120 steps of 30 in a minute, 1.52 m/s · N71, N72, N73, N79
QBN Gathering: a load fills at the find's rate a second (D88) until it holds D87 or the find is gone; then the walk to the nearest drop-off of the side, and back to the find or the nearest of its kind within D89 · N70
QBJ Z1's store: food = (age up + villagers × a villager) × (1 + margin); wood = (mill + lumber camp + homes × a home + barracks) × (1 + margin); bushes = ⌈food / a bush⌉, trees = ⌈wood / a tree⌉ (Albert's rule; the prices are the genre's until the Content pull) · N69
QBO The blow: damage = max(1, base × counter × flank − armour); counter D140 when the striker's kind counters the struck's, flank D141 from behind; an engine strikes a building with its own blow · N69
QBP Upkeep: every unit of a side eats D131 food a day from its store, never below nothing · design
QBQ The break: a wave goes home when fewer than D142 of the soldiers it set out with still stand · N76
QBR The score: people and army held at cost ÷ 5, buildings standing at cost ÷ 5, ages paid ÷ 5, everything gathered ÷ 10 · N75
QBS Wounded balance: lost = 1 − health ÷ most health, read as blood lost. Under D167's class III edge (0.30) the body holds: no sway (classes I and II, compensated). From 0.30 to 0.40 the sway grows from nothing to the tipping angle; past 0.40 (class IV) it stays there. Tipping angle θ = atan((foot ÷ 2) ÷ centre of mass); its rhythm f = √(g ÷ centre of mass) ÷ 2π (a standing body as an inverted pendulum); both from the body (W) · N77, N78, N80
QBT Impact: a blow sends the struck one off at v = m_s · v_s ÷ (m_s + m_t), the perfectly inelastic collision, where m_s and v_s are the whole moving striker (body, mount and kit) at its speed when it moves, else its weapon's striking mass and speed (W); m_t is the struck one's mass. It slides to rest over d = v² ÷ (2 μ g), μ the ground under it (G), and stops at anything it cannot stand on. The screen jolts with v when it passes D166's least, and the thud sounds · N81, N82, N83, N18
QBU The stride: a walker's frame = ⌊frames a stride (D96) × metres walked ÷ its stride (W)⌋ mod D96, the stride its mount's if it rides; the picture turns with the ground covered, so the feet never slide, and in mud it steps slower · N79
QBW The opening view: the game opens on the player's Town Center, the camera's zoom set so the Town Center spans D165 of the screen's width · design (Albert, Nov 5)
QBX The air's top: snow cover lowers the highest pitch that carries, from HX5's open to its snow value (fresh snow soaks up the high sounds); rain masks a quiet sound by HX5's share of its strength · N88
QBY How far a sound carries: a sound with a reach R (HX7) is heard at full within floor × R and falls as 1 ÷ distance beyond (the inverse-square law in amplitude, as QAX), so it fades to the quietest heard exactly at R; thunder's R is about 10 miles, so it is heard across the whole board · N89

## N Citations
The citations have their own book: `books/citations.js` (N1 to N88), shown in INDEX.md. A Q here names its N; INDEX-CITATIONS.md matches the two both ways.

## Old values, for reference only (the game never reads these; each moves into a book when its law is built)
Day 120 s, season 180 s, year 12 min · gather rates · fire 20 s · melt 0.004 · ice 500 °C·s · ruts 300 and 600 s · wet 20 s, dry 50 s · mud 0.8, snow 0.6 · friction 0.7, 0.45, 0.3, 0.08–0.25 · personal space 3 ft · spoilage 5% a year · eating 30 food in 8 min · R0 2 · rain-chain odds · crew 0.7 · move-on 18% (fog sight comes from QK, not typed)
