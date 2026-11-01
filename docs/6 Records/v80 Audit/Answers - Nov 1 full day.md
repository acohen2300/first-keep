# Albert's answers, Nov 1 morning (the calls before the "everything open" batch)
1. Gifts to rivals: **No.** No gifts to other players. Only the Natives, outlaws, bandits and robbers can be bribed (07:02).
1b. Outlaws, bandits, robbers: **copy the Natives' flow for now** (regard, bribes raise it, peace or war follow it); special rules later. Relations gets a second page: page one the computers, page two "Misfits" (the Natives, outlaws, bandits, robbers) (07:04).
   Consequence (to confirm with Albert): C1 changes. Animals stay always hostile; outlaws, bandits and robbers each follow their own regard, like the Natives. The computers' rows have no gift slot.
2. Home zone: **three zones** (07:07). Zone 1, between the Town Center and the corner (200–325): Bronze's cost with a margin, about 600 food and 250 wood (one berry patch, one small grove); if it can't fit, the map test fails. Zone 2, the 200–260 band round the front: the other home finds. Zone 3 beyond: the random wild.
3. Aqueduct: **houses no one** (07:09). Fix the text to say what it does in the code.
4. Plague: **each defence helps** (clean water, sewers, quarantine), each by the effect measured in real, cited studies that are easy to find and very reliable; sources opened, not "from memory" (07:10). Candidates to open: Cutler and Miller 2005 (Demography, water filtration and chlorination in US cities); Alsan and Goldin 2019 (Journal of Political Economy, water and sewerage in Massachusetts); Markel et al. 2007 (JAMA, non-pharmaceutical interventions in 1918); Snow 1855.
5. Weather glass: **knowing the weather helps work and health** (07:11): know what is coming, dress for it, work better and get sick less. Build: it cuts bad weather's toll on gathering and the sickness chance from cold and wet, by an effect taken from a real, cited study (opened). Candidate: Rosenzweig and Udry, forecasts and farm returns (NBER, 2013/2019). The cut forecast-only effect from last night is replaced.
6. Charcoal burning: **scale its price to its age** (07:12), by the rule its age follows.
7. Riders on ice (07:14): **from real science first.** Work out what Horseshoes (studded shoes) and Crampons really change (the friction coefficient on ice, with and without studs or cleats), then how that changes traction and the physics of a step (slip when the needed friction exceeds the available μ). Use measured values from easy-to-find, cited studies, opened. They combine as physics says, never to full immunity unless the measured μ says so.
Standing rule from answers 4, 5 and 7: every research effect is the real-world difference, measured in a reliable cited study, turned into the game's physics. No invented numbers.
8. Scope (07:17): **everything as true to life as possible**, except the named exceptions (EXCEPTIONS.md). The method, for every rule and research step:
   1. Check whether there is science for it (physics, chemistry, biology, geology, medicine and so on).
   2. Check whether there is an accepted consensus.
   3. Find the math.
   4. Apply it accordingly.
   5. State the reasons, cite the sources (opened), and verify.
   "Like a proper project." Planned: a research-truth audit of all 229 steps and the rule tables, run after this batch, logged in SCIENCE.md, with each step without a source listed for Albert.
9. EXCEPTIONS #13 (parts of a control under 44 pt) and #14 (stance icons and words in red, white, green): **approved** (07:17).
10. A computer's waiting villagers, **by need** (07:20). Personality picks the goal (the next age, a building, an army). For each resource, the computer works out the time to afford the goal: shortfall ÷ income. The villager goes to the resource with the longest time (the bottleneck; theory of constraints, Goldratt 1984), at its best uncrowded, reachable find.
    Albert added: the computer must also shift from natural finds to the Mint, farms, tree farms, foundries and quarries when that is the better choice. Rule: build or staff a plot when the plot's rate beats the best natural find's rate net of walking (the same marginal-value test), and when the plot pays back its cost in the time left (payback test, as N7).
11. Conversion refused at the ceiling (07:22): the message reads **"At Maximum Occupancy Capacity"**. Conversion past the cap is **parked**: Albert's idea of up to 2% over against the crowding idea (over the room raises sickness by density). Goes in PARKED.md.
12. The Natives' ambush ×1.3 (07:23): **only at chokepoints and cover**: the causeways, forest and their camp's edge. Plain full strength in the open. The size of the bonus is to come from a cited source where one exists (standing method).
13. GUIDE.md (07:24): **regenerate it at every preview** (publish.py), and keep the v70 copy in docs/v70 Record/ as the closed record.
14. Records (07:25): **the commit rule is no longer needed, as long as Albert's email is not in a commit.** The old commits stay as they are. Turning off the automatic check was denied by the permission system, so it stays on; the reply to it stays the same. The QC reports going into the repo is still to be answered.

## The wild build's questions (Nov 1, from 11:12)
W1. The horde is the outlaws massed, and follows the outlaws' regard: **yes** (11:12).
W2. Raids follow the robbers alone (not 'at war with the Natives and the robbers'): **yes** (11:12).
W3. 4b, with the horde only for the player and the traps skipping computers: **keep**, an experiment to make the computers competitive; EXCEPTIONS #15 approved (11:13).
W4. **Every Misfit group can be pushed to Friend and then fights for you** (11:14). The logic to get there is to be decided (v81 Misfit logic); for now they copy the Natives' ally flow.
W5. The ambush (11:22): **remove the flat ×1.3 now.** v81 adds two rules for everyone, from real numbers:
   - **surprise:** an attacker unseen by its target gets ×1.1 (minor) to ×2.2 (complete), fading by a third per step (Dupuy, via The Dupuy Institute, "The Combat Value of Surprise"; Dupuy's own judgment, never validated);
   - **home-ground movement:** locals keep road speed on their own ground (ATP 3-21.18: 4 km/h with rests), while outsiders move cross-country at about 60% (FM 21-18, about 2.4 km/h by day; from memory, to be opened before building). Cutting the woods removes the gap.
   No invented morale bonus.
W6. The starvation trap (11:27). **Both**: (1) the computers' food-runway meter, runway = store ÷ (eaten − gathered); when it is shorter than the time to rebuild food income, they shift villagers to food early (the reorder point; folds into answer 10's need test). (2) A floor for everyone: at zero food, villagers keep working at **full strength for 2 game days**, then weaken (the size of the drop from Keys 1950, opened before building); food first. There is always a way back.
W6, revised (11:29–11:32). The store is not eating: villagers working a bush, farm, fish or game eat from it.
- **Store empty while food sources can be reached:** no famine. Normal work. The computers' runway meter shifts workers to food. Message: "Food stores empty: put villagers on food."
- **True famine** (store empty and no reachable farm, bush, fish or game):
  1. Full strength for 2 game days (240 s). People have water, so starvation takes weeks (the rule of threes).
  2. Then they weaken.
  3. Then a trickle leaves, one every 30 s (STARVE.every); leaving waits until the weakening.
  Message: "Famine: no food in reach. Two days to recover."
v81 idea: clean water (research, the Aqueduct) lengthens famine survival, from a cited source.
P1. Placement (12:40–12:48, yes yes): **kill the build grid and the footprint box**. The ghost building itself tints green when it fits and red when it doesn't, with the reason in its label. The line-up guides (the PDF-style snap lines) stay. Rejected on the way: the footprint shadow with a local grid, and skewing the grid to the buildings' lean (the ground is square; the lean is the walls' height).
P2. Gatherer caps (12:57, 'Perfect yes. Put that in asap'): the cap is derived from the find. Bushes, rocks and mines: the number of working spots round the find's edge at SPACE (3 ft), so about 6 for a typical bush. Trees: 1 feller a tree (OSHA 1910.266(d)(6)(ii), two tree lengths between fellers; from memory). When a find is full, the next villager goes to the nearest find with a free spot (the same need and rate test).
P3. Buildings keep 2 squares from every find (13:00, yes yes): every building stays 2 squares (LANE, the same gap as between buildings) from every tree, bush, rock and deposit. No exceptions: quarry and mine plots are not tied to finds. Docks still need the shore (water, not a find). It applies to the computers too.
Z1. Zone 1 is an extra on top of the home finds (14:11): 'Leave the extra'.
Z2. Zone 1, bigger finds (14:13, 'Yes bigger'): test 2 bushes of 300 and 2 trees of 125. If Classical does not come back, hold zone 1 out of this preview and rework it in v81.
Z3. Zone 1's wood stays at 250 (14:14, 'Leave the more').
Z4. Walls and the gap (14:16, 'Push the trees to 220'): the home finds move out so the walls never clash. Clearing 200 → 220, home band 200–260 → 220–280 (the same 60 width), zone 1 from 220. A wall at 190 plus 2 squares (20 units) ends at 210, clear of 220. Walls then need no exemption.
S1. Starting stores and the computers' handicap (14:18–14:23, yes and then 'Mark the mill and farm as live test in process'):
- Everyone starts with 200 each of food, wood, stone and gold, and iron at 0, held in the rules table (one home).
- EXCEPTIONS #16, flagged LIVE TEST IN PROCESS: each computer starts with a mill and a farm built beside its Town Center; the player does not. Why: the computers play worse than a person, so this is a handicap, like stones in Go. Ends when the computers reach Classical as fast without it as v70 did (8.2 min).
