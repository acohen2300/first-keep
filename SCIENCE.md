# First Keep: the science (Build 53, Oct 29, 2026)

Every number that stands for the real world, with its label and its source. Rule 4 of `RULES.md`.
- **verified**: checked against the source in the session named.
- **cited**: a standard value from a known source, from prior knowledge; spot-check before it goes live.
- **design**: a choice inside a measured boundary, said plainly. A "Game:" line in the history notes marks it in the app.

Each equation has a test in `tests/science.py` against known values (from Build 54; run by the gate), so it cannot drift.

## In the game today

| Where | What | Value or form | Label | Source |
|---|---|---|---|---|
| `11-orders` `17-ai` `27-cards-core` `39-huddle` | Battle odds | r² / (1 + r²), r the power ratio | cited | Lanchester, *Aircraft in Warfare* (1916), the square law of aimed fire. The game's own note says ancient melee followed it less well. Written in four places: to merge (Build 58). |
| `08-core` `lookout` | A building's sight from its height | 60 + 24 √h | design, from physics | The horizon from a height h is √(2Rh): sight grows with the square root of height. The 60 and 24 are the game's scale. |
| `25-view-weather` | Raindrop fall speed by size | v = 9.65 − 10.3 e^(−0.6 D) m/s | cited | Atlas, Srivastava & Sekhon (1973), a fit to Gunn & Kinzer (1949); sizes by Marshall & Palmer (1948). Borrowed from SoRen, which verified them. |
| `25-view-weather` `FLASH_GAP` | Lightning: least gap between flashes | 0.34 s (under 3 a second) | verified Oct 29 | WCAG 2.3.1 (three flashes or below threshold). Thunder by distance in `35-sound`. |
| `01-rules-basics` `DAY_LEN` `SEASON_LEN` | A day 2 minutes, a season 3 | 120 s, 180 s | design | The game's clock; a year is 12 minutes. |
| `06-rules-tuning` `MOON` | The moon's month | 8 game days | design | The real month is 29.5 days; replaced by the real moon in Build 55. |
| `08-core` `nightness` | Night as a share of the day | fixed 0.62 to 0.94 of the day | design | Replaced by the sun's real arc by season in Build 55. |
| `06-rules-tuning` `FERT` | Soil wears 10% a year worked, rests back 40% a season, never under 60% | | design | Fallowing and rotation are real (the three-field system); the rates are the game's. |
| `03-rules-buildings` `UPKEEP` | A person eats 30 food in 8 minutes; a foot soldier 1.5 shares, a rider 3 | | design | The ratios follow real rations: a horse eats several times what a man does. |
| `06-rules-tuning` `HEALTH` | Sickness: 6% a minute to break out, spreads to 8% nearby | | design | Replaced by the SIR model in Build 56. |
| `06-rules-tuning` `CLIMATE` | Air temperature: mean 10 °C, ±12 over the year, ±5 over the day; hottest mid-Summer and mid-afternoon | | design | A temperate land about 45° N; a 6-day year (Build 54). |
| `CLIMATE.chain` | The sky as a two-state chain: P(wet next \| dry) 0.3, P(wet next \| wet) 0.7 (Summer 0.15, 0.5) | | cited, rounded | Gabriel & Neumann, *QJRMS* 88 (1962): Tel Aviv winter 0.25 and 0.66. Summer and the hazards are design. |
| `CLIMATE.tau` `eq` | Wetness closes 63% of its gap in 20 s getting wet, 50 s drying | M(t) = Me + (M0 − Me) e^(−t/τ) | cited, scaled | The timelag fuel-moisture model (10-hour fuels); scaled to the 2-minute day. Where it settles under each sky is design. |
| `rothermel` `fireMul` | Fire against wetness | η = 1 − 2.59r + 5.11r² − 3.52r³, r ≤ 1, as a share of a clear day | verified Oct 29 | Rothermel (1972); USDA RMRS-GTR-371. |
| `CLIMATE.terrain` `groundSpd` | Walking: speed = 1/η; η = 1 + 0.8·mud + 0.6·snow | | cited | Pandolf, Givoni & Goldman (1977): dirt 1.1, swamp 1.8, soft snow about 1.6, over a hard road 1.0; the mud and snow shares are the game's. |
| `CLIMATE.snow` `ice` | Snow melts 0.004 of full depth a second per degree above 0; ice forms on wet ground below 0 and thaws by the degree | | design, by the degree-day method | The form is the standard degree-day model; the rates fit the game's day. |
| `04-rules-tech` | Every research step's date and place | in `07-text` `WHY` | cited | Each line names a place and a date; "about" unless exact; Game: lines where compressed. The history batch (Build 58) re-checks about 25 of them. |

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
| 56 | Sickness | dS/dt = −βSI/N, dI/dt = βSI/N − γI, dR/dt = γI | Kermack & McKendrick (1927) |
| 56 | Flocks | dN/dt = rN(1 − N/K) | Verhulst (1838), logistic growth |
| 56 | Arrow range from height | R = (v cos θ / g)(v sin θ + √((v sin θ)² + 2gh)) | projectile motion; air drag left out and said so |
| 56 | Sound by material | ring time τ/f per mode; glass long, wood a blink, steel longest | Klatzky, Pai & Krotkov (2000), as in SoRen's `MAT` |
| talk | Market prices | P = P0 (Q/Q0)^(−1/ε) | constant-elasticity demand |
