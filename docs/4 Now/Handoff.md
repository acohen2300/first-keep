# First Keep: handoff (Nov 10, 2026, 14:20; N17 and its audit on preview, sealed on branch n11)

**A new chat starts here.** Read this file, then the top of `Next build list.md` ("OPEN: the one list"); everything below that heading in the list is the record. Albert's standing rules live in Claude's memory too. Then wait for his go.

## Where it stands
- **Preview:** https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n17/ (N11 to N17 and the N17 audit). Source: branch `n11`, sealed Nov 10 (BUILDS.md: every item locked, permit empty). Live v100 (`main`) untouched since N10b. [2026-11-10 14:20]
- **Publishing a preview:** `publish.py` pushes to `main`, which is live; for a preview, seal on `n11` by hand (append BUILDS.md, `index.py --seal`, clear the permit) and copy the game files into `frankenstein-refresh/preview-nNN/` on `main`. Going live is Albert's call only. [2026-11-10 14:20]
- Code: `frankenstein-refresh/v100/` (index.html, combat.js, econ.js, menu.js, books/*.js). Live: https://acohen2300.github.io/first-keep/frankenstein-refresh/v100/
- Nov 9 builds, all pushed: N1 (item 8's open items), N2 (the look pass, Barlow), N3 (progress rings, colour map C27), N4 (the MR kit: all solid, glass cut, 12 inside boxes, title row ← · book · ✕, help-line chevron), N5 (every menu rebuilt from the kit), N6 (the whole open list in one build: menus, Build menu, tap model, quick action square, woods, sight by rays, fog of war; `N6 progress.md` has every step, measurement and cut).
- Gate: `python3 index.py` (permit.json: `opens` and `grow`, key `code:menu.js`; numbers only in books; comments one E-code per line, each named by code). Publish: `python3 publish.py --smoke "<message>"`; it stops at `git pull` with docs unstaged, so fold the docs into the build commit: `git add`, `git commit --amend` as Albert with the trailers, `git pull --rebase`, `git push`. Then clear permit.json (publish does).
- Menu structure: menu.js. SCREENS (pages), ROWS (card rows), VERBS, `head` / `headS` (title rows), `vcell` (a box with its ring by the SN32 verb map), `.pop` cards (Paused, Sound) hung under their top buttons by `hang`, `w2` (the two-column width).

## The core values (check every piece against them, in order)
1. Fair? 2. Follows our logic and rules? 3. A real-life solution (nature, science, history, another game)? 4. Real math, its source, where it lives? 5. Science? 6. Purpose? 7. Function? 8. One home?
And four more for anything new (Albert, Nov 9 20:41):
9. Does it have a source? Math, science, physics, a real-life anchor?
10. Will it improve detail, quality and game play?
11. Does it solve a problem, or is it just being built for fun?
12. Will it save code?
Zero stray numbers: every value in its book with a citation and an E-code comment. Logic above all. Nothing goes away until solved or deliberately removed; every cut is logged in `Parked.md`.

## How Albert works (all him)
- Concise, no prose; a compacted chat is bad news. "Talk mode" is chat only.
- List the changes first; build only on his double confirm ("yes yes"). No exceptions to a rule: if a rule fails somewhere, the rule or the builder is the problem.
- Claude builds everything itself: no helpers, bots, agents or builders.
- Mock screens first. Check v100 and Mid (`frankenstein-refresh/mid/src`) before proposing new logic.
- QC tiers: every build runs the gate, the smoke test and a values line for each changed item; overnight, the full `test.py`, a fresh-eyes review, and every slip becomes a gate rule.
- Commits as `Albert <acohen2300@users.noreply.github.com>` with the session's trailers; the repo is public.

## Open
The only open list: the top of `Next build list.md` ("OPEN: the one list", rebuilt Nov 10 14:20). Do not ask Albert anything that list marks closed. [2026-11-10 14:20]

## N15 (Nov 10, Albert 11:32 "Just do it all": builds 2-4 of the N13 notebook) [2026-11-10 12:40]
- Preview: `frankenstein-refresh/preview-n15/` (source: branch `n11`). Live v100 untouched. Gate PASS, smoke 6/6. [2026-11-10 12:40]
- Built: #11 #12 #13 #14 #15 #16 #17 #18 #20 #21 #24 (menus, Top Info Ribbon SN39), #10 #23 #25 #29 #31 #33 #34 #35 (villagers, queue), #26 #32 (torches, army by type, no tame-beast chase). [2026-11-10 12:40]
- Found: #34 was the walk cycle's 4th frame drawing the strike pose (D strideFrames now [0,1,0,2]). #28 already true: research and training share each building's one queue. [2026-11-10 12:40]
- Not built yet: #22 sun on trees, #30 (which blue box), #37 quick action (4 taps), #19/#27/#36 builders leaving (a single builder finishes cleanly in a headless test; needs Albert's case). [2026-11-10 12:40]
- N16 (Nov 10, Albert 11:51 "Go"): `preview-n16/`. #37 quick action in four taps (Attack · Build · Rally; All · ½ · ¼ · Squad; the reticle under the finger sends), Build as six groups then six buildings; #22 a baked sun gloss on leafy crowns; #30 Go on the blue info bar when a message has a place; Daily locks civ, difficulty, length and the dangers; Lanterns brighten the torches by the inverse-square law. Gate PASS, smoke 6/6. Open: #19/#27/#36 builders (Albert checks in his game). [2026-11-10 12:55]
- N17 (Nov 10, Albert 12:38 "Build N17 yes yes"): `preview-n17/`, the 18 items of his N15 notes (detail in Next build list.md, "Built N17"). #8 (refund on cancel) waits for his check. Gate PASS, smoke 6/6, t-n17 holds. [2026-11-10 14:30]

