# Audit, Nov 17 2026 (before n67)

Asked by Albert 15:15: ECS mapping of the new controls, the 12 core values, code attitude. Scripts: measured, not read line by line. Nothing changed in the game.

## 1. Does Design 14 map to ECS? Yes, as one law
- Every card is one shell: fixed line (Home › path › name › buttons › War), control row (toggle, middle, last), tile row.
- What fills it is ticks, not names: Spawn → Train, Field → Plant, Make → Build (the toggle word); Research → Learn; Health → Repair; Move → Stop/Garrison; Yield → a find's reading; an action index → Skill.
- The path's middle word = the shell's Build group (a book field).
- Real-world anchor: AoE II's command card (one grid, filled from the unit's abilities); ECS archetype queries.
- Weakness: if any card needs an "if Barracks" the law is broken. Test: every card drawn from ticks alone.

## 2. Numbers
- Game code: 645,168 (N46) → 661,624 bytes (N66), +16,456 in 20 builds. 7 of the last 9 builds grew under grants.
- ecs named: 309 → 295. The ceiling in the Rules book (X112) is still 309: 14 of slack, a rise would pass the gate.
- The gate's ecs pattern counts only `job|then|kind|civ|code === 'x'` (295). Broader: 576 string comparisons, 169 shell names typed in code, 35 `case 'x'` in index.html.
- Typed numbers: index.html 3,839 (2,377 building art, 1,097 figures: art, allowed); menu.js 48; sound.js 28; combat.js 8; econ.js 2.
- Lines over 300 characters: 454 (menu.js 150 of 619). Longest 2,513 (econ.js).
- Dead code: menu.js offScreen (347); index.html YIELD, bodyOf. Verbs with no caller: squads, mid, allHome, callHome, ambush, reinforce, recallP, whyNot.
- menu.js: 123 verbs (24.8 KB), 13 card tabs, 9 screens.

## 3. Core values: what broke last week
1. One home (8): N66 left two card systems live (kbar/kbox and cardDock/ctop). Alert built in N56 (WAR.attacked) and asked again in Design 14. Squads exist (combat.js:25 SQ, menu.js:158) and a new Squad was proposed. Support moved into army control (N55), now ruled back out.
2. Saves code (12): 7 grants in 9 builds; N66 +9,249 with nothing out.
3. Logic (2): roads rebuilt four builds running (N57 to N60): fixes stacked on fixes.
4. Proof: N66 left the test runner broken (t-queue, t-cards, t-research); full suite not run since N65; t-n60 flaky.

## 4. Code attitude
- Lean and mean: no. Old and new live side by side.
- Light and tight: no. 454 lines over 300 characters.
- Clear and right: partly. Books and E-codes hold; long lines don't read.
- Simple and elegant: the books are; the menus are not (123 verbs).

## 5. What the new controls let us cut (estimate, unverified until built)
- Army: war, cwho, cpage, cact, cexec, cnav, muster, squad, squads, dial, plan, stance, attack, allHome, callHome, ambush, reinforce, move, chargeP, fallBackP, holdP, recallP, hunt3, follow, fight, here, sneak, who, more, escort, release, route, helpers → who ± and one order verb and squad.
- Villager: vgar, vdump, vatt, vgroup, vstop, vorder, vpage, vjob, vexit, vreset, vhide, vclose, vgo, exitU, recall, stop, gather, send → stop, garrison, remove, skill.
- Card: ctab, kx, unq, fromCard, the old cardDock/ctop, CARD's 13 tabs → one tile verb, toggle, more, repair, demolish, close.
- Jobs: job, people, work, yield → one ± verb.
- Roughly 123 verbs → about 35.

## 6. Features with no home in Design 14 (his ruling needed, each: keep where, or cut to Parked)
Market (Sell, Buy, Bulk, sellK), Relations, Misfits, Intel, Plan, Mail, Score, Stores, Ice, Layers, teach, zeal, ransom, scrap, raise, replant/replantAll, hire, escort, ambush, ageUp, the old squads (plan, formation, temper, intent, Battalions).
