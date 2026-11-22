# idx5 review: index.html 1201-1500 (weather, light, fog, events, sight, shadows)
Snapshot /home/claude/rv (1d0379ea). The reviewer could not write this file itself; full diffs are in /tmp/idx5/diffs.txt.
12 findings: CRASH 0, PLAY 5, FRAMES 5, RULE 2.
1. PLAY 1447 look(): a shared-sight skip goes stale — if the unit whose sight another shares leaves or dies, the other sees nothing (fog, enemies beside it not drawn) until a tree falls or it moves. Fix: `if (c && c.key === key && !c.skip) { byCell.set(key, e); continue; }`.
2. PLAY 1475/1480 drawShadows: no hide checks — enemy traps, disguised spies and unseen enemy buildings show shadows. Fix: `if (fire('hide', t)) continue;` and `|| (u.veil && u.side !== ME)`.
3. PLAY 425/452: HOLES and CRACK not saved — after a winter reload broken ice is solid again. Fix: add holes/crack to pack() and refill in load().
4. PLAY 1338: new game carries K.mirage, K.flashT and CRACK into the next match (no bolts until K.t passes the old match length). Fix: clear them in on('start').
5. FRAMES 1293: a hidden #clock is rewritten every sim step (dead UI); remove with sunPhase/hhmm.
6. PLAY (Albert's call) 1452/1468: familiarity barely bites (fam ≈ 1 almost always).
7. FRAMES 1292: saved bolts timed by performance.now survive a reload as invisible work every frame. Fix: `wallT() >= b.w &&`.
8. FRAMES 1446: every felled tree throws away every computer eye's sight circle (apply only with 1).
9. FRAMES 1404: rgb() parses hex with a regex ~10 times a frame; cache.
10. FRAMES 1393: horde() scans every thing before checking the horde is on.
11. RULE: HOUR = D.day / 24 should read D.clock[0]; chosen numbers in climate, sky, shadows and sprites (list in diffs).
12. RULE: E146 says computers see by the same rule; they use circle() (E992).
