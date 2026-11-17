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

## 7. Streamline (Albert 15:21: fonts, thickness, colours, verbs, one home, group, shells and ticks, the 12 values)
Measured. The menus' CSS is already all variables (menu.js:49 to 95, 251 selectors, 0 typed px or rgba): the drift sits in the books behind the variables.
- Type (SN type): six roles at 18/14/12/12/12/12; Design 14 adds 11, 16, 17. Idea: 11 · 14 · 17 (1.25 scale), weights 400 and 600, IM Fell for Welcome only.
- Lines: hair, edge, SN ring thin 1 and thick 2, SN controller stroke 1.5. Idea: 1 and 2.
- Corners: --r, --rc, --rb (set twice: blue edges void), --cd, --gap. Idea: pill and tile.
- Blur: SN controller.blur 7 still used (menu.js css, filter blur twice). Design 14 rules tint: cut.
- Gradients: six kinds. Idea: one.
- Colours book: 173 hex values, 145 distinct; 17 stored in 2 to 5 places; two golds (C gold #e6b947, menu.gold #f2cf55); reds #ff6b5b, #a3262a, #ff3b2f, #d8432f; blues #6aaeff, #2f8cff; resource colours twice (menu vs bundle, all five differ). 47 menu entries. Idea: about 14 menu tokens; one per meaning.
- CSS vars: --kc and --n set twice; --display, --sq, --track, --ring, --sqi never read.
- Circles: SN kbar dot 26, controller dot 28, kbar float 40. Idea: one, drawn 40, tapped 44.
- Words: 1,333 strings; 71 in 2+ places (Hold, Garrison, Home 3 each). Idea: one button-word table.
- Verbs: 123; v-verbs 13. Idea: one verb a tick family, about 35.
- Shells and ticks already there to reuse: SN card (tab → tick; Manage has none), SN tap (who × target → verb), SN ring.verbs (colour by verb: idea, colour by state).
- Answer page: items 35 to 53 (https://claude.ai/artifact/XkZM2q1bKADA1r68i7Q6TC).
