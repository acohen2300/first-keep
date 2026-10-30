# First Keep: the science (Build 59, Oct 29, 2026)

Every number that stands for the real world, with its label and its source. Rule 4 of `RULES.md`.
- **verified**: checked against the source in the session named.
- **cited**: a standard value from a known source, from prior knowledge; spot-check before it goes live.
- **design**: a choice inside a measured boundary, said plainly. A "Game:" line in the history notes marks it in the app.

Each equation has a test in `tests/science.py` against known values (from Build 54; run by the gate), so it cannot drift.

## In the game today

| Where | What | Value or form | Label | Source |
|---|---|---|---|---|
| `08-core` `lanchester` | Battle odds | r² / (1 + r²), r the power ratio | verified Oct 29 | Lanchester, *Aircraft in Warfare* (1916), the square law of aimed fire; one home since Build 58, checked in `tests/science.py` (even strength 0.5, double 0.8). The game's own note says ancient melee followed it less well. |
| `08-core` `lookout` | A building's sight from its height | 60 + 24 √h | design, from physics | The horizon from a height h is √(2Rh): sight grows with the square root of height. The 60 and 24 are the game's scale. |
| `25-view-weather` | Raindrop fall speed by size | v = 9.65 − 10.3 e^(−0.6 D) m/s | cited | Atlas, Srivastava & Sekhon (1973), a fit to Gunn & Kinzer (1949); sizes by Marshall & Palmer (1948). Borrowed from SoRen, which verified them. |
| `25-view-weather` `FLASH_GAP` | Lightning: least gap between flashes | 0.34 s (under 3 a second) | verified Oct 29 | WCAG 2.3.1 (three flashes or below threshold). Thunder by distance in `35-sound`. |
| `01-rules-basics` `DAY_LEN` `SEASON_LEN` | A day 2 minutes, a season 3 | 120 s, 180 s | design | The game's clock; a year is 12 minutes. |
| `01-rules-basics` `SYNODIC` `moonPhase` `moonLight` | The moon's month 29.53 days; its lit fraction (1 − cos i)/2 | | verified Oct 29 | Meeus, *Astronomical Algorithms* 49.1 (the mean synodic month) and 48.1 (the illuminated fraction). The game's day is 2 minutes, so a month is about an hour. |
| `08-core` `sunAltAt` `skyVec` | The sun's height and bearing from the day of the year, the hour and the latitude (45° N) | sin a = sin φ sin δ + cos φ cos δ cos H; δ = −23.44° cos(360°(N + 10)/365) | verified Oct 29 | The sunrise equation and the standard declination approximation (Meeus ch. 25 gives the exact form). Checked in `tests/science.py`: 12.0 h of daylight at the equinox, 15.4 at midsummer, 8.6 at midwinter at 45° N. Game: six days a year, so each game day holds one real day's declination two months apart. |
| `08-core` `nightOf` | Night from the sun's depth | 0 with the sun up, 1 at −12° (nautical twilight), civil twilight at −6° | cited | The standard twilight definitions. |
| `08-core` `moonVec` | Where the moon stands | ahead of the sun by its phase; declination the sun's at new, the opposite at full | design | First order only; the true moon (Meeus ch. 47) is in SoRen and can replace it when its place is needed for more than shadows. |
| `23-view-things` `CAST` `shadowOf` | Shadows | away from the light, h·cot(altitude) long (capped at 3 h); from a flame, h·d/(H − h), fading as 1/d² | cited (geometry) | Plane geometry; the darkness values are design. |
| `23-view-things` `FLAME` `kelvinRGB` | Flame colour from temperature; light's reach | candle 1850 K, wood and torch 1900 K, oil lamp 2000 K, a building ablaze 2200 K; reach ∝ √power (inverse square) | cited | Flame temperatures: standard values (a candle's outer flame about 1400 °C). Colour: a black body by Tanner Helland's fit, as SoRen's stars. The powers are design. |
| `06-rules-tuning` `FERT` | Soil wears 10% a year worked, rests back 40% a season, never under 60% | | design | Fallowing and rotation are real (the three-field system); the rates are the game's. |
| `03-rules-buildings` `UPKEEP` | A person eats 30 food in 8 minutes; a foot soldier 1.5 shares, a rider 3 | | design | The ratios follow real rations: a horse eats several times what a man does. |
| `06-rules-tuning` `HEALTH` `healthTick` | Sickness as SIR: new cases = β S I / N a tick; recovery γ = 1/60 s; R0 = β/γ = 2 (plague ×1.5) | | verified Oct 29 | Kermack & McKendrick, *Proc. R. Soc. A* 115 (1927). R0 of 2 sits in the influenza range (1.5 to 3); measles would be 12 to 18. Game: recovery returns to susceptible (no lasting immunity); baths ×0.75 is design. `HEALTH.plagueCart` 0.5, the share of carts from abroad bringing plague home, doubled by the Plague hazard (Build 60): design. `tests/science.py` checks the chain. |
| `36-economy` `LAMBS` `FLOCK` | Flocks: ΔN = r N (1 − N/K) each spring, r 0.6, K 12 | | verified Oct 29 | Verhulst (1838), logistic growth. The rates are the game's. |
| `08-core` `rangeFrom` | A building's range from its height | R = (R0/2)(1 + √(1 + 4h/R0)), R0 the range from the ground | verified Oct 29 | Projectile motion at the 45° optimum, air drag left out (it would shorten every range by the same share, so the ratio between towers stands). R0 (`BLD.bow`) is design, set so the Watchtower keeps 140. |
| `35-sound` `MAT` `knock` | Sounds by material: wood, stone, metal; each a decaying mode, metal longest, wood shortest | | cited | Klatzky, Pai & Krotkov, *Presence* 9 (2000): listeners tell materials by decay rate; as in SoRen's `MAT`. |
| `04-rules-tech` hearth, icehouse, chimney, lanterns; `03` baths, theatre, tavern | Dates and places | in `WHY` | cited | Persepolis yakhchāl about 400 BC; the chimney in 12th-century Europe (Conisbrough); Antioch's street lamps 300s AD, London 1417; Pompeii's Stabian Baths 2nd century BC; Epidaurus about 340 BC; the alehouse in Hammurabi's code. The effects (−10% eating, +15% fish and meat, ×0.5 winter sickness, ×0.75 sickness, ×1.3 nerve, ×0.7 grumbling) are design, said so in each line. |
| `06-rules-tuning` `CLIMATE` | Air temperature: mean 10 °C, ±12 over the year, ±5 over the day; hottest mid-Summer and mid-afternoon | | design | A temperate land about 45° N; a 6-day year (Build 54). |
| `CLIMATE.chain` | The sky as a two-state chain: P(wet next \| dry) 0.3, P(wet next \| wet) 0.7 (Summer 0.15, 0.5) | | cited, rounded | Gabriel & Neumann, *QJRMS* 88 (1962): Tel Aviv winter 0.25 and 0.66. Summer and the hazards are design. |
| `CLIMATE.tau` `eq` | Wetness closes 63% of its gap in 20 s getting wet, 50 s drying | M(t) = Me + (M0 − Me) e^(−t/τ) | cited, scaled | The timelag fuel-moisture model (10-hour fuels); scaled to the 2-minute day. Where it settles under each sky is design. |
| `rothermel` `fireMul` | Fire against wetness | η = 1 − 2.59r + 5.11r² − 3.52r³, r ≤ 1, as a share of a clear day | verified Oct 29 | Rothermel (1972); USDA RMRS-GTR-371. |
| `CLIMATE.terrain` `groundSpd` | Walking: speed = 1/η; η = 1 + 0.8·mud + 0.6·snow | | cited | Pandolf, Givoni & Goldman (1977): dirt 1.1, swamp 1.8, soft snow about 1.6, over a hard road 1.0; the mud and snow shares are the game's. |
| `CLIMATE.snow` `ice` | Snow melts 0.004 of full depth a second per degree above 0; ice forms on wet ground below 0 and thaws by the degree | | design, by the degree-day method | The form is the standard degree-day model; the rates fit the game's day. |
| `08-core` `nextIn` `hazard` | Random events: the wait to the next is exponential, t = −mean · ln U; the chance over a step is 1 − e^(−rate·dt) | | verified Oct 29 | The Poisson process (Poisson 1837; Feller, *An Introduction to Probability Theory*, vol. 1, ch. XVII). `tests/science.py` checks the mean and the standard deviation of 20,000 waits and the step chance. The rates (an event every 120 s on average, the horde at 20 + 10 minutes, a strike every 20 s in a storm) are design. |
| `39-games` `holdGames` | The Games: a court's odds in an event go with the square of its best strength | | cited | The same square law as battle (Lanchester 1916), chosen so one engine serves both; said so in the help. The events are Olympia's (776 BC; the chariot race from 680 BC). |
| `39-games` `PEACE.truce` | Peace bought with gold | 120 × (1 + 2 × their odds) | design | Tribute for peace is the record (the Danegeld, 991: 10,000 pounds of silver); the price is the game's. |
| `12-sim-core` `forage` | Where a villager works: R = c(1 − δ)/(c/g + 2d/v + w·c/(A·v)) | | cited | Holling, *Can. Entomol.* 91 (1959), the disc equation; Charnov, *Theor. Pop. Biol.* 9 (1976), the marginal value theorem; danger after Lima & Dill, *Can. J. Zool.* 68 (1990). The 18% to move is design (Albert). `tests/science.py`: at the door R equals the gathering rate; farther pays less. |
| `15-sim-spatial` `foeValue` | Who a soldier fights: its damage a second ÷ (time to kill + time to reach) | | cited | Churchill, Saffidine & Buro, AIIDE 2012 ("Attack-Value"); the cμ rule (Cox & Smith, *Queues*, 1961). |
| `03-rules-buildings` `PRICE` | Market price from stock: P = P0 (Q/Q0)^(−1/ε) | ε food 0.5, wood 0.8, stone and iron 1, wool and beer 0.8, cloth 1.2, spice 1.5 | cited (form); design (values in range) | The isoelastic demand curve. Food elasticities 0.27 to 0.81 in 160 studies (Andreyeva, Long & Brownell, *AJPH* 100, 2010); luxuries above 1 by definition. Not re-opened this session (the page was behind a check). |
| `03-rules-buildings` `SPOIL` | Food spoils: Q = Q0 e^(−kt), about 5% a year | | cited | First-order loss kinetics (food science, Labuza); the 5% from FAO, *Grain storage techniques*, ch. 6 (2 to 10% by crop and place). |
| `06-rules-tuning` `TELL` | News: seen, heard (a fight carries about 380, gunfire twice), told at a runner's or a rider's speed | | design, on the record | Herodotus 8.98 (the Royal Road), Marco Polo (the yam), Thurn und Taxis 1490, the Relation of Strasbourg 1605, Theophrastus, *On Weather Signs*. Distances and speeds in game units. Build 60: the messenger rides the path (`wayLen`, A*), not the straight line: measured 15% longer at the median, 40% at most, over 235 paths on five seeds. `TELL.spy` 120 s, how long a spy's report of an army counts for the odds: design. |
| `04-rules-tech` | Every research step's date and place | in `07-text` `WHY` | cited | Each line names a place and a date; "about" unless exact; Game: lines where compressed. `tests/history.py` (Build 58) holds every dated step inside its age (Stone to 3300 BC, Bronze to 800 BC, Classical to AD 500, Medieval to 1450, Gunpowder to 1700, the Enlightenment to 1800, 150 years of slack) or demands a Game: note. |

## To add, with their sources (checked Oct 29 against the sources named; see HANDOFF.md item 14)

| Build | What | Form | Source |
|---|---|---|---|
| 54 | Day length by season and latitude | cos ω = −tan φ tan δ, δ = −23.44° cos(360°(N + 10)/365); twilight at −6° | the sunrise equation; Meeus, *Astronomical Algorithms* (2nd ed.) ch. 25 for the sun, via SoRen's `25-sky-model.js` |
| 54 | Fire against moisture | η = 1 − 2.59 r + 5.11 r² − 3.52 r³, r = M / Mx ≤ 1 | Rothermel (1972); coefficients confirmed in USDA Forest Service RMRS-GTR-371 |
| 54 | Drying after rain | M(t) = Me + (M0 − Me) e^(−t/τ) | the timelag fuel moisture model (Byram); 1-, 10-, 100-hour fuels |
| 54 | Weather that persists | P(wet tomorrow) depends on today | Gabriel & Neumann, *QJRMS* 88 (1962) 90–95 |
| 54 | Walking on ground | terrain factors: road 1.0, dirt 1.1, packed snow 1.3, swamp 1.8, loose sand 2.1 | Pandolf, Givoni & Goldman (1977), the US Army walking-energy equation |
| 54 | Snow melt | degree-days above 0 °C | the degree-day method (standard in hydrology) |
| 55 | The moon's phase and the sun's place | Meeus ch. 25 and 47 | SoRen's `25-sky-model.js`, cited by line |
| 55 | Fire colour from flame temperature | a black-body fit | Tanner Helland's fit, as in SoRen's `bvRGB`; candle about 1850 K, wood fire about 1900 K, oil lamp about 2000 K |
| 55 | Light's reach | inverse square | physics |
| 58 | The post by age: a delay on alerts bought down by each step | design on the record | the Royal Road (Herodotus 8.98), the cursus publicus, the Mongol yam, Thurn und Taxis 1490 |
