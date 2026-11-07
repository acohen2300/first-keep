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
QK Visibility: V = −ln(0.02) ÷ β = 3.912 ÷ β, β (km⁻¹) the sum over what is in the air, each as NOAA's CALVIS gives it from its water content C g/m³: fog 144.7 C^0.88 (Kunkel), rain 2.24 C^0.75 with C = 0.072 R^0.88 (Marshall–Palmer, R mm/h), snow 10.36 C^0.7776 (Stallabrass) with C = S ÷ (3.6 × the flake's fall speed m/s), S mm/h of water · N10, N210, N245
QL Lightning: flashes ≥ 0.34 s apart; thunder delay = distance / 340 m/s · N11
QM Random events: wait = −mean · ln U; chance a step = 1 − e^(−rate · dt) · N12
Ground and impacts
QN Walking cost: the terrain factor η = 1 + a·mud + b·snow (Pandolf's η, D106, a by how deep the walker sinks), read inside the pace (QCB), never as a divisor of its own · N13
QO Melt: degree-day, melt = k (T − 0); rain on snow faster · N14, N15
QP Settle: x(t) = L + (x0 − L) e^(−t/τ) (wetness, healing, decay, nerve, loyalty) · N16
QQ Ice growth: thickness ∝ √(freezing degree-seconds) · N17
QR Slip: each second a walker's step lands on ice with the chance of the ground's ice cover (QQ), else on its cover (dry to mud by the mud, to snow by the snow, G5–G7); it slips exactly when the friction its step needs (G9, by what steps) exceeds what that ground offers (the ice's G8 by the air, melting to hard, or the studs' G10 where iron bites); a slip holds it G10's seconds, and it walks on with a shortened step, its pace × what is offered ÷ what is needed on its share of ice, until it is off the ice · N179, N178, N174, N18
QS Ruts: depth ∝ passes^0.5 (Wronski & Humphreys: z/D = 4.61 n^0.5 (CI/NGP)^−2.6) · N20
QT Fire vs wetness: η = 1 − 2.59r + 5.11r² − 3.52r³ · N21
QU Fire growth ∝ t²; heat to a neighbour ∝ (near / (gap + near))² · N22
Work and economy
QV Forager's rate: R = c(1 − δ) / (c/g + 2d/v + w·c/(A·v)), d the walked length from the find to its drop-off (A*, QBL), w the straight walk out, A what is left up to D195's life in loads; a villager takes the find of best R · N23, N24
QW Move on: only when the new find pays enough more (D132) · N24
QX Crowding: g ÷ (1 + others / room), room D195's hold; a find takes as many as its ring has spots a pace apart, ⌊2π·r ÷ d⌋, a tree one · N25, N26
QY Growth: ΔN = r N (K − N) ÷ K, once a spring: fish toward their spot's own stock (D218), lambs toward the pasture's most (D219, rounded) · N27
QZ Sustainable take: hold the stock at K/2, yield r K / 4; a tended flock is culled to K/2 each spring, mutton a sheep (D219) · N28
QAA Soil: a field's fertility f falls loss ÷ a year each second it is worked and rises rest ÷ a season each second at rest, held within floor + Σ research adds and 1 (D214); the field gives its rate × f × the season's yield (D216) × the year's harvest (D215) · N29
QAB Learning curve: labour falls a set share per doubling · N30
QAC Crew: n builders work n^p times as fast · N31
QAD Spoilage: Q = Q0 e^(−k t); at each season's turn the store loses ⌊Q (1 − e^(−k))⌋, k = −ln(1 − D217's year) × season ÷ year × (1 + Σ research shares) · N32, N33
QAE Price: P = P0 (Q / Q0)^(−1/ε); the price a side meets is that to the power of its band (D239, the Han granary halving the swing in the logarithm) · N34
QCA Effects: a kind's number = (base + Σ flat adds) × (1 + Σ boosts) × (1 − c1) × (1 − c2) …: boosts added, never multiplied, and applied once; cuts applied one at a time, each on what is left, every cut a share between 0 and 1, so the number never reaches 0 nor stays at its base; then a "lowest" effect keeps the minimum; a price rounds to the whole unit. A rank (Mid's tier) is a step whose shares and adds reach one kind like any other, raising its level and renaming it: a Halberdier's health is 60 × (1 + 0.25 + 0.15 + 0.10 + Σ the rest), not Mid's 60 × 1.25 × 1.15 × 1.1; a soldier's share of a blow (D228) keeps the lowest its armour reaches. The base is the book's: walking D86 (3.4 mph), a unit's D138, a building's health D139, a price D123. When the shares move, every unit and building of the side keeps its share of health · N154, N155, N156, N176, N185
QCB Pace: Pandolf, Givoni & Goldman's walking cost M = 1.5W + 2(W + L)(L/W)² + η(W + L)(1.5V² + 0.35VG), W the body's (or mount's) mass (W), L its load (W24 a unit carried), η the ground (QN), G the grade in percent from the ground's height along its step (up only), and the wind's drag F = ½ρCdA·v|v| (v the walk less the wind along it; CdA a person's, × (W ÷ 70 kg)^⅔) counted as a grade, 100F ÷ (W + L)g (Pugh); the walker's power M is set so it walks its base (D86 with research, QCA) on flat firm ground, unloaded, in still air; V solves the quadratic; then × each state it is in (D224: sickness) and, after a slip on ice, × the shortened step (QR). Mass, gravity, the floor and the weather, never the season or the calendar · N13, N181, N19, N179, N185
QCI Standing spots: each stands on a spot of its own a pace d apart: n of them on the hex lattice round a point fill a disc R ≈ 0.525·d·√n (packing density π/(2√3)); round a building on its outline, k = ⌊2R ÷ d⌋ a side; round a find on its working ring, m spots at radius r ≥ d ÷ (2 sin(π/m)) · N165
QCJ Separation: two closer than d part along the line between them to d, each moved by the other's share of their mass (m_b ÷ (m_a + m_b)), so their centre of mass stays, and as much again × D196's pass to each one's right, so two who meet head-on slip by (pedestrians' side preference) rather than stall; two on one point part along a direction fixed by their places in the roll; none is pushed onto ground it cannot walk · N163, N167
QCK Mending: each villager mends M ÷ (k × T) health a second, M the building's health, T its build time (D125), k D201's time; it pays D201's cost × the price × the health mended ÷ M as it goes, the fractions carried; short of any part, it stops and goes back to its work · N168
QCL Weather: one intensity I, uniform 0 to 1 from the rules' dice, drawn when a wet spell begins and held through it (calm when dry): rain R = I × most, snow S = I × most (D229); wind I × most m/s, signed by the same draw, gusting mean ± swing of it on a fractal of the day's dice; visibility V = 3912 ÷ (0.312 R^0.67 + S ÷ c + 144.7 C^0.88) m (QK); fog's water C: the air keeps its dew point Td, set to the air's own while rain or snow falls; cooled under it in calm air (wind ≤ 3.6 m/s, 7 knots), C = (e_s(Td) − e_s(T)) × 10⁵ ÷ (461.5 (T + 273.15)) g/m³, e_s by Magnus 6.112 exp(17.62 T ÷ (243.12 + T)) hPa, at most 0.05 g/m³ (the rest settles as dew, lowering Td); it lifts as the sun warms the air past Td; fog when V < 1 km (WMO); a storm from D103; a blizzard when snow falls with wind or gusts ≥ 35 mph (15.65 m/s) and visibility < 1/4 mile (402 m) for 3 hours or more, by the NWS. The picture: a fixed pool whose active count is the strength, drops sized by Marshall–Palmer at R (λ = 4.1 R^−0.21) falling at QJ's speed, flakes slower, both carried by the wind, drawn from the looks' dice · N9, N10, N180, N182, N183, N184, N186, N187, N210, N211, N212, N213, N214
QCE Trade pay: a caravan's run to an ally's Market pays min(cap, d² ÷ div × the trade share), d the run's length in tiles; a good a caravan sells at a stop or an ally's Market fetches base × want (if the stop wants it) × the going price (QAE) × min(far, 1 + d ÷ per) × the trade share (QCA), d from its own Market; a keeper of the stop takes min(cutMax, cut by the stops of that route it holds + research) of another side's take · N195, N197
QCF Returns: the Bank pays min(cap, ⌊gold × i⌋) a minute, i the interest research gives; a venture of g gold comes home after a year as round(g × (back + research)), or with chance lost not at all; only its profit counts as gathered · N195
QCD Danegeld: a gift of g gold buys max(1, round(g ÷ (10 × (1 + d × n)))) regard, n the gifts already given in the window and d D282's danegeld: each buys less than the last, as each payment of the Danegeld after 991 bought a shorter peace (Mid 38-natives.js giftGain) · N201, N198
QCG Tribute and unrest: each slow beat a vassal pays take × (G − G₀) × f, G − G₀ what it gathered since the last beat and f 2 while tribute is forced, else 1, spread over its five stores by their shares; its loyalty settles toward base + Σ invest + min(cap, ½ × the lord's soldiers within r) + protect − hate by QP (τ D283's tau); its unrest moves by push (+1 forced) − loyalty ÷ calm, held to 0…100, and at 100 it rebels; a coalition of n restless vassals rises with chance k × n × Σ(unrest ÷ 100)² a minute (Mid 36-economy.js vassalTick; Assyria's tribute, Rome's client kings) · N198
QCH Messenger: a line from a place out of your sight is told now if your people see it, heard at once if a fight is within D324's hear of your people (its way only, of eight), else brought after delay = the walked length (QBL) from your Town Center to the place ÷ the courier's speed, a runner's on foot (D86's scout) or, from the Post's ridesAt level, a rider's (D86's post), if the Post reaches that far; never if it does not · N223
QCM By need: for each yield, the shortfall s against the goal (the next age, a building or a wave, and what is due) and the income I = n × ρ − draw (n hands, ρ what one earns now, QV); its time s ÷ I; the hands go to the longest time (food first when its store runs out first); a hand leaves a yield only if its time stays under that one's, or its store holds: store ÷ (demand − n ρ) ≥ max(⌈gap ÷ ρ⌉ × the turn + load ÷ ρ, the time left to the goal), the reorder point; one more villager or a plot is made when its gain pays its price in the time left, ΔR × T > c (marginal value, payback) · N24, N202
QCN Counter: a kind's score = the mean over the foe's soldiers of (its blow's multiplier on the foe ÷ max(f, the foe's on it)) ÷ (its price ÷ p)^k; the best two trained in turn · N202
QCO Night sight: sight × (1 − (1 − s (a + b k)) n), k the moon's lit fraction (QC), n = clamp(−sun's altitude ÷ 12°, 0, 1), full at nautical twilight · N2, N203
Combat and behaviour
QAF Battle odds: r² / (1 + r²) · N35
QAG Who to fight: first one its group can beat (QAF, its side within reach summed against the foe alone), then the most: the foe's damage a second ÷ (time to kill it + time to reach it) · N36, N37, N188
QAH Fight or not: probability V / C · N38
QAI Nerve: steady at 1; each loss nearby drains 1 / (break × n); a blow that lands drains hit × harm ÷ most health, × side or rear by where it comes from, × the temper's nerve; a kill gives kill; outnumbered drains odds a second; at rest it settles back by QP; at 0 it runs (QAO) · N76, N188
QAJ Arrow flight: projectile motion under gravity with quadratic drag, F = ½ ρ Cd A v²; the range is where it lands (replaces the no-drag range formula) · N39, N40
QAL Sight: range = min(√(D⊕ h), R_day × (1 − (1 − a)(1 − lamp)), V) with a = clamp(ln(E ÷ E_night) ÷ ln(E_ref ÷ E_night), 0, 1), E_night the end of nautical twilight (acuity linear in the log of the light, Sloan 1968); the light E = E_sun(height, between the table's rows by the logarithm) + E_full × lit^log2(E_full ÷ E_quarter) × sin(moon's height) + E_stars, × E_overcast ÷ E_stars under cloud; D⊕ the Earth's diameter, h the eye's height (a person's 1.7 m, a building's its own, research adds); R_day 1,500 m (an individual made out by day); V the weather's visibility (QK) · N41, N215, N216, N217, N218, N220
QAM Line of sight: seen when, along the grid line from the eye (ground + eye height) to the target's top (ground + its height), no tile's top (ground, a standing tree's height, a building's) rises above the straight line; the two footprints aside · N42, N219
QAN Many eyes: a side sees what any of its units or finished buildings sees now, and nothing else: no memory, no shroud; the computers by the same check · N43, N44, N220
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
QBN Gathering: a load fills at the find's rate a second (D88) until it holds D87 or the find is gone; then the walk to the nearest drop-off of the side, and back to the find or the one of best rate (QV) within D197, the look widening while it waits at the drop-off · N70
QCP The woods' edge: each tile the woods may grow on is ranked by the woods' rolled surface (its share of the tiles below it); it is wooded when that rank passes 1 − d, d the tree share at its distance from the corner: Z4's own, and across Z3 the straight line from the inner edge's to the outer edge's (an ecotone), so the woods thicken toward Z4 and every map holds the shares in the book · N228, N231
QCQ The way home: from each Town Center's spot a 0-1 search over the land (a wooded tile costs one, open ground none, water never); a find of that corner whose cheapest neighbour costs more than none has the trees cleared along that way, the fewest trees between it and home (Mid's wayHome) · N229, N233
QCR Frame budget: a frame runs at most k slices of the slow work, round-robin over the jobs; a turn of n slices taking T ms spreads over ⌈n ÷ k⌉ frames at about T × k ÷ n ms a frame, kept under 1000 / 60 ms less the step and the drawing; counted in slices so the game is the same on any machine · N237
QCS The pocket's store, Mid's (Z1): zone 1 need(food) = the next age's price(food) + vils × a villager's food, need(wood) = the price(wood) + houses × a house's wood, laid as bushes and trees piles whose amounts sum to the need; the home finds: for each kind, piles × a pile × RICH × HOME.rich × FIND_SIZE(kind), laid as that many piles each carrying its share; a later zone's finds of a kind = ⌈x(kind) × the pocket's total ÷ a pile⌉, x the zone's share of the pocket per store · N242
QCT Lightning through the year: in a storm, the mean seconds between strikes = the summer interval × share(summer) ÷ share(season), each strike's wait drawn exponential on that mean; the seasonal shares are the record's (NLDN) · N243
QCU A flame's glow on the ground: brightness E(d) = p ÷ (d² + s²), the inverse-square law with the source's size s so the centre is finite; the reach r where E falls to the eye's threshold grows as √p (so r = k √p); drawn as the share (E(d) − E(r)) ÷ (E(0) − E(r)) of the flame's alpha · N246
QBO The blow: damage = blow × wear × shape × temper × hunger × counter, and on a soldier × the armour share (D228) × its shape's hit (× against riders) × flank (D141) when a blade strikes from behind its line (the cosine to its facing under D232's behind; the front when it can turn or a comrade covers that side), × roofed against missiles; the counter is the most of the striker's vs (D138, its ranks' added) over the struck one's kind, class and tags; a building takes blow × the striker's bld · N69, N188
QBP Upkeep: every unit of a side eats D131 × its share (its Upkeep, D211, × (1 + Σ research shares), QCA) a day from its store, never below nothing; a villager working food eats from its find instead (a field and game for nothing); with the store empty and no food in reach (a famine), after D212's days its work and blows are × D212's work; an order of yours costs its soldiers' shares for D213's seconds · N170, N171
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
Day 120 s, season 180 s, year 12 min · gather rates · fire 20 s · melt 0.004 · ice 500 °C·s · ruts 300 and 600 s · wet 20 s, dry 50 s · mud 0.8, snow 0.6 · friction 0.7, 0.45, 0.3, 0.08–0.25 · personal space 3 ft · spoilage 5% a year · eating 30 food in 8 min · R0 2 · rain-chain odds · crew 0.7 · move-on 18% (fog's sight comes from QK, not typed)
