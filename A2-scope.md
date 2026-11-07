# A2 scope (Albert, Nov 7 07:12: yes; starts after A1 publishes)

Confirmed migration bugs (from the claim check, Mid shows the working behaviour):
1. Muster past ~12 loses units (econ.js:86 spawnBy null): place all, paid units never lost.
2. `who` null outside walkTo/reach: walkable takes the walker explicitly (wayLen, vacant, shove, slide, routeK); sealPath keeps gates shut by intent (E329).
3. AI soldiers stuck in 'hold' after chokes/ally help: release as Mid did (17-ai:464).
4. Ransom paid, unit lost when TC ring full: spawn first, pay only on success (or wider ring).
5. VERBS.train label/whyNot: use priceOf (discounts, camp 1.25x).
6. Sight techs dead: horizon vs day cap and aggro reading D.stats sight, not FK.stat.
7. Line of sight: sites by done share; sees() start at n/2.
8. Saves: keep the play RNG state; fightT reset in start, hunting not fighting.
10. t.noPath per side.
Plus partly-true: loot party attacking drifters (exclude drifters as Mid), held finger sliding off eats next top-bar tap (cancel hold on move from down point; reset held on all surfaces), captive via WAR.die (take without death/morale).
Small: Hall vs card queue times agree; Guide gaps (Throne why, homeOf, wild units); ARGS cleared on start/scoped; plague caravans not resetting plagueDead cap.

Gate rules (Albert yes):
G1. Code may not read the raw stats table (D.stats[...]) where FK.stat exists.
G2. Every shell named in a build, tech or computer table must have its ticks.

From SoRen (Albert yes, Nov 7 07:39):
R1. One work queue with a frame budget (book): AI thinks, reach floods, long path searches run in slices.
R2. Idle frame rate (book): drops when paused, behind a full menu, or nothing moving.
R3. Release the sound engine (AudioContext close) when the app is hidden; rebuild on return, as SoRen (index.html:1064, 4339).
R4. Screen wake lock during a running match; released when paused or hidden (SoRen requestWake).
R5. Safety net: on a second distinct fault, save to the backup slot only (never the main), pause, offer restart (SoRen fault()).
Later (menus F41-49): Reduce motion as a player setting (Off | Some | Most) pointing at the existing shed levels.
