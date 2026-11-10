# First Keep: handoff (Nov 9, 2026, 20:30; v100 at N6, live)

**A new chat starts here.** Read this file, then `Next build list.md` (every Nov 9 decision, items 1–13, and the Built N1–N5 log), `Calls - Nov 8.md` and `Build plan - Nov 8.md`. Albert's standing rules live in Claude's memory too. Then wait for his go.

## Where it stands
- **N14 build 1 (Nov 10, 12:30, on preview):** https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n14/ . Source: branch `n11` (v100 with N11–N13 and build 1). Albert's N13 notebook answers: build 1 = save + ground (#38, #1–#9) done; build 2 menus (11–18, 20, 21, 24), build 3 villagers + queue (10, 19/27/36, 23, 25, 28, 29, 31, 33, 34, 35), build 4 army + light (32, 22, 26, 30, 37) wait. His answers: the N13 sheet artifact (claude.ai/artifact/ACJQFotja4w4BbEgb6Z4V4). Decisions: #37 quick action is 4 taps (ground, sword, All/½/¼/Squad, aim then send); #26 torches by every door (two on large buildings), no light by zoom; #12 text in boxes 12/400; #32 soldiers chase only enemies or animals that attack them; #21 build progress as the receding double ring on Build, and on People while training. [2026-11-10 12:30]
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

## Open: waiting on Albert
The full open list, checked against the code: the top of `Next build list.md` ("OPEN: the one list").
1. Fast and Yard (test-build tools) sit in the Paused card, which breaks "speeds only" there. Move them where?
2. The Sound card shows only while muted, so volumes change only while muted (per his markup). Right?
3. Reminders: Choke and Bombard; the map's hold gesture (box pick); what a tap on a building does; hunting; a "mind your own business" setting.

## Open in the menus (N5)
- The stance boxes (gift, bribe, war, terms, ally) do nothing yet.
- The queue row shows only while something is queued; long letters clip in the narrow Mail card.
- Barracks was not reached in the test game; only the Town Center card was checked.
- Controller and job-ribbon contents are Albert's call.

## Next (start only on his go)
- Item 1: the stray sweep and the gate fix (count numbers with units; the ratchet becomes a zero rule).
- Item 4b: fog drawn by Beer–Lambert by zoom. Item 6: sight map, fog of war, memory. Item 7: SoRen's renderer.
- B32: conversions over the cap wait for a house; building health by age material; villagers fight (Lanchester); animals by the randomizer. B33: quick start, race mode, simple mode. B34–B36: the Nov 8 triage (`Triage - Nov 8.md`).
- Pages source setting (Albert). B32/B33 triage. The overnight full `test.py`.

## Known
- `python3 test.py t-walls` crashes the same way before and after B31a: a harness fault, owed.
- The match smooth check warns (a known mid-match stutter, logged in Parked.md; Albert: publish to preview anyway).
- Garrison in the square is dim with no foe near.
