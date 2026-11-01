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
15. The docs system (07:30–07:33):
   - Docs in a reading order, in folders: how we work, rules, locks (decisions and designs, one numbered file each), now, logs, records.
   - Docs per version: docs/Builds/v80/, with a subfolder per preview.
   - Every edited line in a living doc carries a timestamp, enforced by a check in START QC.
   - START-HERE.md is the entry point.

Batch approved (07:33, "Yes yes yes"):
- the docs system first;
- then A, 4b;
- B, the hunt fixes;
- C, the computers batch (N6, N7 with the payback test, N8, N16a, D2 to D5, item 10 by need, with the shift to plots);
- D, the combat leftovers (C11, C12, C15, C16, arrival for animals, spots for priests and medics, the ambush at chokepoints, the occupancy message);
- E, text (F2 to F9, D16, the Aqueduct text, the plague by cited studies, Weather glass, Charcoal's price, the ice friction, GUIDE.md regenerated at each preview);
- F, the owed tests;
- G, the sources opened;
- the map's three zones;
- Relations with a Misfits page;
- outlaws following their own regard;
- then the full QC and the preview.
The research-truth audit of all 229 steps runs after this batch.
