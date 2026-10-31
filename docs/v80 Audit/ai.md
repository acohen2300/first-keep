# Audit: the computers (v70 Restoration)
Files: src/17-ai.js (558), src/36-economy.js (906), src/38-natives.js (297), src/39-games.js (215); PERS in src/05-rules-wild.js read for the AI question.
Every line of the four assigned files read. Measurements: my own probe on a copy of the built tree, 3 seeds x 30 min, Normal, fog off, all four seats computers (seat 0 set to 'bal', the same setup as tests/probe.py).
Scripts and raw output: /tmp/claude-0/-home-claude/4d769247-862d-5cce-8273-144de5189f34/scratchpad/ag-ai/probe/ (waves.py, out.jsonl, stuck.py, stuck2.py, mix.js).
The read-only rule was kept: nothing in /home/claude/acohen2300/first-keep was changed.

## Probe summary (3 seeds, 30 min, 12 sides)
- 55 attack waves in total. **6 (11%) got within 300 px of the target's Town Center.** 32 were recalled by the 45 s "stalled" rule.
- Seed 3: the Raiders (aggr) sent **24 waves in 20 minutes; 22 were recalled at exactly 45-46 s, and none got closer than 791 px.** At t=720 the 12 spearmen stood still 80 px from a robber guarding a cemetery find. They were locked on it with cd 0 and never struck it. They were recalled, then relaunched from the same spot a second later.
- The Fortress launched **0 waves** in 3 games. The Rivals (seat 2, bal) launched 2.
- Muster was used 0 times. No Throne march happened (throneRun needs 20 soldiers at home in Medieval; armies ran 6 to 18).
- Spice hoarded by the end: 35, 194, 100, 60, 95, 40, 152, 107, 223 on the sides that ran routes. It is never sold.
- All 12 sides were at war with the Natives the whole game (regard 0 to 20).
- Medieval reached by 30 min: 5 of 12. The Raiders reached it once (28.8 min).
- The save state was reset 3 to 14 times a game per side, against 2 to 3 legitimate age-ups.

## Findings by severity

### S1 (makes the computers' war fail)
1. **The wave loop: recall without progress, then relaunch at once.** 17-ai.js:471 recalls a wave when `!hit && G.t - p.wave.t > 45`. Nothing records why the wave failed, and the next think (17-ai.js:478) sends the same soldiers at the same target. Troops locked on a wild target they cannot reach (14/15 targeting, not in my files) stand still, so the AI repeats a doomed wave every 46 s for the rest of the game. VERIFIED (seed 3 numbers above). There is also a timing problem with 45 s: an adjacent corner is about 1390 px away and foot soldiers move at spd 24, so the walk alone is about 58 s. Only a fight on the way keeps a wave alive. Fix: judge a wave by its progress (distance to the target shrinking) rather than by hits, give a failed target a cool-down, and have attackers ignore WILD targets they are not blocked by (the troops reviewer should look at why they stand at 80 px).

### S2 (wrong behaviour)
2. **The saving gate is undone by aiEconomy.** 17-ai.js:213 keeps caravans to 3 and blocks them while saving ("nor a lost caravan", Build 59). 36-economy.js:610 trains caravans again to 2 with no saving check, from the same think (17-ai.js:222). That is two homes for one decision, and the Build 59 fix is defeated. aiEconomy as a whole (36-economy.js:570-617: trade posts, market, pasture, workshop, ventures, caravans) never checks `saving`. VERIFIED by reading. Fix: pass `saving` into aiEconomy and delete the 17-ai caravan block.
3. **Ventures eat the Gunpowder gold.** 36-economy.js:574 sends 250 gold whenever gold > 900 at age 3 or more. The Gunpowder age costs exactly g 900 (01-rules-basics.js:80), so while food or iron is short, every time gold reaches the cost it is spent. VERIFIED by reading (the probe never reached age 3 with 900 gold, so it is not measured).
4. **The spice sink.** aiEconomy sets every computer route with `spice: true` (36-economy.js:615). At each stop the caravan buys `min(LOAD, gold / price)` spice (36-economy.js:206-213). The computers never sell spice: their marketTrade calls (17-ai.js:114-119, 216-219) cover only f/w/s/i, and a stop's price for spice is 0 (36-economy.js:92). VERIFIED (probe: up to 223 spice, about 1100 gold, idle). Fix: route with `spice: false` for the computers, or sell spice in the existing surplus block.
5. **The job mix fights the save.** 17-ai.js:267-286. (a) The saving gap is *added* to the personality mix instead of replacing it, so hands stay on resources the age does not need. (b) The `have > 600 → ×0.4` damping (17-ai.js:282) also cuts a resource the age still needs (Medieval f 1000, Gunpowder f 1600, g 900). (c) The "enough hands to feed everyone" term (17-ai.js:274) is diluted when the mix is normalised, so it yields far fewer than eats/30 workers. VERIFIED with mix.js: Balanced at Classical, saving for Medieval, 26 villagers. At food 590 the target is 12.9 on food; at food 610 it drops to **7.3 on food**, still 390 short, while 3.5 go to iron, which Medieval does not cost. Fix: while saving, set the mix from the gap and upkeep alone, and damp only above `need + margin`.
6. **The Natives are a closed path for the computers.** Only the player's verb calls giveGift (33-verbs.js:879), and aiDiplomacy skips WILD. Regard starts at 20 against a peace line of 40, so every computer is at war with the Natives for good. That makes them raid targets, removes the sworn Throne, leaves `per.shrine` dead (17-ai.js:175) and means throneRun always needs 2 siege. VERIFIED (probe: relNat 'war' for 12 of 12). This also breaks the "same rules, every path" rule.
7. **The Fortress cannot declare war.** 17-ai.js:320 needs `odds > bold + 0.15 + D.bold`, which is 0.85 + 0.15 = 1.0 on Normal and 1.1 on Easy, and lanchester is always below 1. In decideWar it needs r > 2.4 with half its army at home. VERIFIED by arithmetic, and by the probe (0 waves). Whether this is intended is unclear. As written it falls out of a number, not a rule.
8. **The league writes relations directly.** 17-ai.js:554 sets `G.rel[..]='ally'` without makeAlly or makePeace. `p.ally` stays null, so allyDuty never fires and aiDiplomacy may court a second ally. Units in 'attack' against a new ally are not sent home, pending `G.warAt` notices between members still run out into war, and the alliances outlive the league. VERIFIED by reading (consequences SUSPECTED, not run). It is also a second home for relations, against the 11-orders header "one way to change them".
9. **Unequal fire help.** 36-economy.js:375 `.slice(0, b.owner === 0 ? 2 : 3)`: the computers get three bucket villagers and you get two, while the comment says "at most two". VERIFIED. This is a fairness violation. Fix: 2 for all, as the comment says.
10. **The crowns do not measure what their comments say** (39-games.js:142-160).
   - Wellbeing multiplies by `p.health/100`, but `p.health` is set to 100 in 10-world.js:88 and never written again, so the term is dead. VERIFIED by grep.
   - War is `p.kills`, which also counts animals killed while hunting: 16-sim-fight.js:85 counts any non-WILD attacker killing a different owner, and a hunter's `hurt` is at 13-sim-civil.js:365. VERIFIED by reading.
   - Wealth is `gathered + held`, which counts held stores twice. It also counts the Throne's phantom +gathered (38-natives.js:296, written outside earn) and vassal tax twice (a vassal's gathering, then the lord's `earn(...,'tax')` with counts=true).
11. **Saving resets on every dip.** 17-ai.js:94 drops `p.ai.save` (best and stall timer) whenever `ageReady` is false for one think, for example a villager death or the Raiders' army below `ageArmy` 6 after a wave dies. VERIFIED: the probe counted 3 to 14 resets a game per side against 2 to 3 age-ups. The Raiders' own waves break their save.
12. **Standing down is undone.** standDown (39-games.js:83) turns soldiers into villagers under a truce. think has no peace mode, so 17-ai.js:246-253 trains back up to armyCap at once. SUSPECTED (not measured).
13. **Muster pays double.** 17-ai.js:242 musters whenever affordable, at twice the cost (11-orders.js:68). The comment says "with gold to spare" but there is no such check. VERIFIED by reading. Low impact (0 musters in 30 min).
14. **The trade-stop sell toggle drops raw loads.** 36-economy.js:171: once `t.sell` exists (33-verbs.js:696, wares only), raw f/w/s/i are skipped because `t.sell[k]` is undefined. estPay (36-economy.js:123) ignores `t.sell`, so bestTarget over-values the stop. SUSPECTED (player-facing).

### S3 (rule violations and bloat)
15. **Magic numbers that copy a table** (one home): 17-ai.js:58 apartment `s>=60, w>=120` (cost w100 s50); :77 `R.w>=60` (farm); :80 `80` (treefarm); :145 `R.s>=120` (tower s100 w40, wood not checked); :171 `g>=100` (zeal 60); :213 `R.g>=100` for a caravan that costs no gold (w80 f40); :227 spy `g150 f60` (cost g60 f30); :298 hire `g>=200` (costs 90 and 240); 38-natives.js:33 "regard above 40 / under 40" (NATIVE.peaceAt); :20 `allyAt - 10`. Fix: one `spare(p, cost, margin)` helper reading the tables.
16. **Duplicated decisions:**
   - caravans (#2);
   - more barracks twice (17-ai.js:134 extraBarracks and :137-144 busy lines);
   - the mill twice (17-ai.js:82 and the drop-off loop :60-73);
   - ageUp twice (17-ai.js:88 and 39-games.js:209);
   - care buildings twice: Fortress `per.build` has temple and hospital with stock buffers, while chaseCrown (39-games.js:208) builds them as soon as the bare cost is affordable, skipping the buffer and the save;
   - two hand-written weighted picks (38-natives.js:223-227 and 39-games.js:119-125) with different comparison forms; make one `pickW(weights)` in 08.
17. **Dead code:**
   - `if (per.bold < 2)` (17-ai.js:300): every bold is below 1;
   - `ageReady && !p.aging` (17-ai.js:92): ageReady already includes !p.aging;
   - `PEACE.games.first` never binds: gamesT starts at 0 and `every` (1440 s) is greater than `first` (720 s), so the first Games come at 24:00 and `?? 0` is dead too;
   - `if (!N.warBy)` (38-natives.js:25): natState already creates it;
   - `let m = 1` (36-economy.js:91), overwritten on the next line;
   - `full` (17-ai.js:503) is never reached in practice (armies of 6 to 18 against caps of 34 or more).
18. **Stale or contradicting comments:**
   - 17-ai.js:83-84 has the same line twice;
   - 39-games.js:202 says "the wealth chaser trades", but chaseCrown has no wealth branch;
   - 17-ai.js:241 "with gold to spare";
   - 17-ai.js:279 "less than two minutes", though it is four in Autumn and Winter;
   - 36-economy.js:369 "at most two" (#9);
   - 39-games.js:20 and 142 "people × health" (#10).
19. **think() is 271 lines** (17-ai.js:33-303). Split it into shelter/drop-offs (about 45), age and save (about 35), what to build (about 40), faith and care (about 25), siege and trade (about 25), research (about 10), army (about 12), jobs (about 40). Removing items 2, 15, 16 and 17 saves about 25 to 30 lines across the four files.
20. **Not through earn:** 38-natives.js:296 writes `gathered` directly; 36-economy.js:21-23 stashes goods into `gathered` and `flow` with no ledger entry.

### S4 (minor)
- bestCounter checks `ready(o, UNIT[k].at)` and ignores `U.also` (readyAt).
- crownsOf breaks ties by array order.
- natureTick: the spice price rises when any route is fully held, not only the holder's.
- makeVassal does not clear the vassal's pending `warAt` notices against third parties (SUSPECTED).
- takeThrone clears the old holder's `p.wave` but leaves its units in 'attack' (orphan attackers).
- netOf falls back to the part-minute when a whole minute had no flow.

Nothing was found that breaks determinism (no Math.random or clock in these files; the bolt seed comes from coordinates). No crash path was found in these files.

## Why the computers play badly, ranked by likely impact
1. **They cannot finish an attack** (#1). A wave that meets an unreachable wild target, or walks longer than 45 s without a fight, is recalled and relaunched with no memory. Measured: 11% of waves arrived; one side spent 20 minutes in the loop. The War crown and conquest are mostly beyond them.
2. **Flat villager ceilings** (17-ai.js:121, `per.vils` 16/26/28 for the whole game, against POPMAX 180). The Raiders stay at 16 workers and feed 15 to 20 soldiers. Already in the Fairness Test, not taken into v70.
3. **Spending that ignores the save** (#2, #3; also towers :145, walls :150, wonder :159, priests and zeal :170-173, medics :193, siege :196, spy :223, hire :298, extraBarracks :134, chaseCrown :208). Six of these were in the Fairness Test; aiEconomy, ventures and chaseCrown were not named there.
4. **The job mix fights the save** (#5), with the measured 12.9 → 7.3 food-worker drop at 600 food.
5. **Resets of the save window** (#11), with the Raiders' own waves causing them.
6. **Gold leaks**: spice (#4), Muster at double price (#13), ventures (#3).
7. **Closed paths**: the Natives (#6) and the Fortress's war (#7). Two of the four ways to play are partly shut for the computers.
8. **Peace is not played**: standing down is undone (#12), and the wealth crown has no behaviour.

## Working back from a crown: what is already in the code
- `per.crown` exists (05-rules-wild.js:107, 153, 228: war, wealth, wellbeing).
- It is read in two places only: 17-ai.js:321 (only the war chaser declares under a board truce) and 39-games.js:207 (the wellbeing chaser builds CARE). The wealth crown changes nothing.
- docs/trials/planner-66.patch already prototypes a goal leading to a group of buildings, with a cheapest-path search re-planned each age. It is not in v70.
- **Where it would plug in:** the objectives are `crownsOf().val` (39-games.js:145-160). think() would rank candidates by crown gained over time and cost (RULES §5's rate-of-return form). That would replace four hand lists: `per.build` (17-ai.js:124), `per.techs` (:233), `per.mix` (:255) and the `bold`/`waveMin` war gate (:300 and decideWar). Run it once per age change, as planner-66 does.
- **Fix the crowns before chasing them** (#10). As defined now:
  - a War chaser would hunt deer (animal kills count);
  - a Wealth chaser would hoard, since held stores count twice and the Throne adds phantom wealth;
  - the Wellbeing chaser would only count heads, since health is a constant.
- **Fix the wave loop (#1) first.** A War-crown planner cannot win while its attacks never arrive.

## Not checked
- The root cause of the soldiers standing 80 px from the robber (troop targeting and nav in 14, 15 and 09).
- Balance harness numbers beyond my 3-seed probe; Easy and Hard; fog on.
- Save and load of the `p.ai` fields across MIGRATE.
- PERS tables beyond the fields think reads.
- Player-side trade verbs.

## Overall assessment
The computers' brain is a 271-line list of hand thresholds. Several of them contradict one another: two caravan homes, the save gate bypassed in a dozen places, and a job mix that cuts the very resource being saved. A wave recall rule leaves them unable to finish an attack: measured, about one wave in nine reached its target. Most of "they play badly" comes from these code flaws, not from their personalities. The crowns they would chase are themselves mis-measured, so "work back from a crown" needs the crowns and the wave loop fixed first.
