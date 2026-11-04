# Economy and villagers: the deep dive (Nov 4, 2026, 06:30 to 07:10; Albert: "Yes you should analyze all this first ... Go") [2026-11-04 07:10]

What this is: the numbers as the game has them, measured, not read; the villager logic as the code has it, with the one rule that makes a placed villager leave; what the best games do; the math nature uses; the history of each of the six peoples; then the list for Albert's yes or no, one at a time. Nothing here is built. Sources: measured in the game (`tests/`-style harness, scratch), the code by file and line, and outside facts marked "opened" or "from memory" (`docs/1 How we work/05 Truth method.md`). [2026-11-04 07:10]

## 1. The numbers, measured [2026-11-04 07:10]

Method: a fresh game (seed 11, Fertile land), no hazards, your side at the last age so every building places, two villagers put on each source by hand for four minutes of spring. The figure is what reached the store per worker per minute, walking and eating included (a villager eats 5.4 food a minute: `UPKEEP.share`, 03-rules-buildings). The nominal rate is `RATE_OF` (06-rules-tuning), what the hand takes a second, before walking. [2026-11-04 07:10]

| Source | Nominal a minute | Measured, per worker a minute | Note |
|---|---|---|---|
| Berries (bush) | 54 food | **24 food** (net of eating; 30 gross) | the bush 122 from the Town Center; 300 in it: two foragers empty it in 5 minutes |
| Farm | 48 food | **37 food** (42 gross) | the best food there is; 60 wood; soil tires over years |
| Pasture | 90 (rate 1.5) | **5 food** | six sheep give milk at 0.03 a second each; the 1.5 is the wool; as food it is the worst thing in the game |
| Trees | 45 wood | **28 wood** | 125 to 354 in a tree |
| Tree farm | 33 wood | **26 wood** | 500 then replant |
| Stone (hills) | 33 stone | **13 stone** | the quarry face 185 out: the walk eats most of it |
| Quarry (building) | 27 stone | **23 stone** | never runs out; beats the hills by a lot from home |
| Gold (mine) | 36 gold | **15 gold** | the mine 180 out; 885 to 1,330 in each; four within 340, about 3,500 gold in all |
| Mint | 12 gold | **14 gold** (from 14 stone) | one stone to one gold; a quarry worker feeds 1.6 mints |
| Iron (vein) | 30 iron | **13 iron** | |
| Foundry | 12 iron | **12 iron** (from 24 wood) | |
| Fish | 48 food | not measured (needs a shore and a Dock) | |

What the table says: [2026-11-04 07:10]
- **Walking takes half.** Every wild find at 120 to 200 from the Town Center pays 40 to 55% of its nominal rate. That is the real cost of the 4-minute bush: not the rate, the trips (a basket holds 10, `CARRY`, 01-rules-basics). [2026-11-04 07:10]
- **The mint is not weak; it is late.** Measured, a mint worker makes as much gold as a miner at a home mine. The problem is the age: the mint is Medieval (`age: 3`), 300 stone and 200 gold, with a cap of 0 until then. The mines run dry in Bronze or Classical. So there is a gap of one or two ages with no gold source but the far mines, in the band where the robbers, the horde and the rivals walk. (I said earlier the mint was a sixth of a mine; that was the nominal rate against a nominal rate; measured with the walk, they are even. Corrected.) [2026-11-04 07:10]
- **The pasture is broken as food.** Its `rate: 1.5` is the wool; food is milk at 0.03 a sheep a second. Five food a minute a worker, against 37 for a farm. Nobody should build it for food, and the computers do. [2026-11-04 07:10]
- **The ages against the gold:** Classical 200 gold, Medieval 500, Gunpowder 900 (`AGES`, 01-rules-basics): 1,600 for the ages alone, plus archers, horse, research. Home gold is 3,500. It is enough for the ages and nothing else, and only if every mine is worked out to the last and nobody dies doing it. [2026-11-04 07:10]
- **Eating:** 45 villagers eat 243 food a minute. One farmer feeds 7.8 people; one forager 5.5. A side of 45 needs 6 farmers just to stand still. The computers' food trouble in long games is this bill. [2026-11-04 07:10]
- **Albert's log of Nov 3 (24 minutes):** his gathering was level with the Raiders' and above the other two; gold stood at 56 for minutes 17 to 20 with 1,000 food in store; the Town Center trained nothing 52% of the time; 18 villagers lost from minute 13. So: not the economy's rate, but gold's source, the Town Center's idle time, and the losses. [2026-11-04 07:10]

## 2. The villagers, as the code has them [2026-11-04 07:10]

**Why a placed villager leaves when you tap something else.** `pickVil` (12-sim-core, 784): an order with no idle villager takes "the roaming one earning least on another job" (D-089). Earning is `forageNow`, which is 0 for a villager still walking to its find. So the villager you placed ten seconds ago, still on its way, is always the cheapest to take, and the next tap takes it. It is not a bug in the walking; it is the choice rule choosing the freshest order first. `u.sent` (your own order) is set but `pickVil` does not look at it; only `u.focus` (Focus, D-093) protects one. [2026-11-04 07:10]

**The rest of the logic, read:** [2026-11-04 07:10]
- A villager given a find takes the find as its anchor (`setJob`, 11-orders 888) and may step to a better find of the same kind within reach (`bestNode`, every 8 to 12 seconds with an empty basket, 13-sim-civil 470), only when it pays `FORAGE.move` times better. A posted worker (a field, a mint) and a focused one stay put. [2026-11-04 07:10]
- Reach is the home band (`REACH = WALL_R`, 06-rules-tuning 418). Past that, nothing is found on its own: the villager stands idle, and that is the "switch locations every 4 minutes": not the rate, the reach, once the home finds are gone. [2026-11-04 07:10]
- A frightened villager leaves a find and says so; a sent one stays through a remembered fright (13-sim-civil 339). [2026-11-04 07:10]
- A tap on a find with villagers picked places them and lets go of the pick (26-input 416); with nothing picked, the tap calls `sendVil`, which calls `pickVil`: the steal. [2026-11-04 07:10]
- The computers (17-ai) move workers by need every second and never stand idle; they also take the pasture as food (it is not). [2026-11-04 07:10]

## 3. What the best games do [2026-11-04 07:10]

- **Age of Empires II** (from memory; the fandom wiki for AoE I was opened and gives 0.45 to 0.6 a second for AoE I): a villager gathers about 0.3 to 0.4 a second of anything, a basket of 10, so the walk matters there too; drop-offs beside the find are the whole early game. A villager whose find is gone walks to the nearest find of the same kind on its own, within a radius; farms reseed from a queue at the mill; sheep and boar are brought home to be eaten at the Town Center (the walk made zero). An order never pulls a working villager: only the selected go. Auto-queue of villagers is a button in DE. Opened: aoe2-guide.pages.dev gives "~0.4 of one resource per second". [2026-11-04 07:10]
- **Age of Empires IV** (from memory): the same, with sheep as a pure food source at the Mill, and gold from trade and relics once the mines go: the late gold is trade and sacred sites, by design, so a game does not end on the last mine. [2026-11-04 07:10]
- **Northgard** (from memory): villagers are assigned to buildings, not finds; a tile has a food value; no micromanagement at all; the player manages the ratio of jobs. Food is one resource from fish, hunting, fields and sheep. [2026-11-04 07:10]
- **The common thread:** one food resource, many sources; the walk is the lever; the player never babysits a villager; late gold is trade, tax or relics, not more mines. [2026-11-04 07:10]

## 4. The math nature uses [2026-11-04 07:10]

- **Charnov's marginal value theorem (1976):** a forager leaves a patch when its rate there falls to the average of the land. Already the game's rule for when to move (`bestNode`, `FORAGE.move`; SCIENCE.md). The missing half: the average of the land is measured within reach, and reach is too short for the late game. [2026-11-04 07:10]
- **Logistic growth, Verhulst 1838:** dN/dt = rN(1 − N/K). A flock, a fishery, a berry patch, game in a forest all grow this way. **Schaefer (1954):** the most you can take from such a stock forever is at half its size, rK/4 a year (the Maximum Sustainable Yield; opened: the Wikipedia page, citing Bolden and Robinson 1999). This is the equation for fish in a lake and for a herd: a stock that regrows, with a yield that is sustainable at half and crashes past it. A bigger lake is a bigger K: more fish, by the law, not by a bonus. [2026-11-04 07:10]
- **Liebig's law of the minimum (1840):** a crop grows to the limit of its scarcest input. The game's soil fatigue is this in one dimension; a three-field rotation (medieval, 8th century on) raised the cultivated share from a half to two thirds. [2026-11-04 07:10]
- **Lotka–Volterra (1925):** wolves and sheep. The pasture already loses sheep to wolves; the flock's own growth (lambs in spring) is the other half. [2026-11-04 07:10]
- **The Fisher identity, MV = PT (1911):** a treasury that does nothing earns nothing; money at work (trade, lending) is what grows. The bank's interest is this made simple; its cap keeps a hoard from running away. [2026-11-04 07:10]

## 5. The six peoples: how each got its gold and its food, from history [2026-11-04 07:10]

(From memory unless marked opened. Each is a step the Hall could give, in that people's line, or a flavour the same mechanic wears.) [2026-11-04 07:10]
- **Roman:** the *tributum* and later the grain *annona*; Egypt and Sicily as the granary; tax farmers (*publicani*) bidding for the right to collect; the *denarius*. The tax line and the grain dole are Rome's. [2026-11-04 07:10]
- **Han:** the state monopolies on salt and iron (the *Discourses on Salt and Iron*, 81 BC); the land tax at one thirtieth under Emperor Wen; the ever-normal granary (already in the Hall, preview 42). Han's gold is a monopoly on a trade good. [2026-11-04 07:10]
- **Persian (Achaemenid):** tribute from the satrapies, set in silver by Darius (Herodotus III.89–95 lists them); the gold *daric*; the Royal Road (already a step); *qanats* for fields in dry land. Persia's gold is tribute from vassals, which the game already has, and coin. [2026-11-04 07:10]
- **Maurya:** the *Arthashastra*: the king's sixth of the produce (already "The sixth", preview 42); state farms (*sita*) worked by the crown; a treasury as the root of the state. Maurya's gold is tax on the land. [2026-11-04 07:10]
- **Mongol:** herds as wealth, moved with the season; the *qubchir* levy on livestock; the Yam (already a step); airag, meat and felt from the flock. The Mongol's food is the pasture, and their gold is what the herd sells and what the conquered pay. The pasture must be made real for them most of all. [2026-11-04 07:10]
- **Mali (Sankore, Timbuktu):** the gold of Bure and Bambuk traded north for Saharan salt; Mansa Musa's 1324 pilgrimage (already a ticker line); cowries as money; the king's claim on every nugget. Mali's gold is trade across a distance: the caravan line, and a gold vein worth more. [2026-11-04 07:10]

## 6. What follows (for Albert's yes or no, one at a time, in chat) [2026-11-04 07:10]

A. **Never steal the freshest villager.** `pickVil` leaves alone a villager sent by hand (`u.sent`) that has not yet worked its find, and one placed within the last minute; "earning least" is judged among those at work. Your placement sticks. [2026-11-04 07:10]
B. **A villager finds its own next find, farther.** When nothing of its kind is left within reach, it looks past reach along the side it was working, as far as the nearest drop-off allows, and says once where it went; idle only when the map has none. (AoE2's rule; Charnov across the land.) [2026-11-04 07:10]
C. **Fewer, bigger finds.** A bush 1,000 to 1,200 (12 minutes for two), a tree 400, so a patch outlasts a season; the count of finds down to keep the land's total. [2026-11-04 07:10]
D. **The mint comes to Bronze**, cheaper (150 stone, 100 gold), cap 1 then 2; Medieval keeps the bigger caps. The gold gap closes. [2026-11-04 07:10]
E. **Tax** (Bronze, Courthouse or Town Center): a share of what your people gather, as gold; the vassal tax mold pointed home; tuned so 45 villagers pay about one miner's worth. The people's lines flavour it (Rome's tributum, Maurya's sixth, Han's thirtieth). [2026-11-04 07:10]
F. **Surplus sells itself:** a Market toggle, "sell food above 800", so a full store turns to gold on its own. [2026-11-04 07:10]
G. **The bank** (Medieval, with Letters of credit): interest on gold held, a small share a minute, up to a cap; past the cap nothing. [2026-11-04 07:10]
H. **The pasture made real:** the flock grows by the logistic law (lambs to a cap), food is meat at a sustainable take (Schaefer's half), wool stays; the Mongol line doubles it. [2026-11-04 07:10]
I. **Fish by the lake:** the stock K by the lake's area, regrowth logistic, the whole water tappable, boats drawn out from the Dock; a salmon run in autumn on rivers. [2026-11-04 07:10]
J. **Auto-queue villagers as a Stone-age step** at the Town Center (about 100 food), then a toggle on People. [2026-11-04 07:10]
K. **The computers keep training villagers while saving for an age** (the Raiders' edge, given to all). [2026-11-04 07:10]
L. **The match log adds villagers by job and a line when a find runs dry.** [2026-11-04 07:10]
