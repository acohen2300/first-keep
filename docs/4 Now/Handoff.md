# First Keep: handoff (Nov 10, 2026, 07:15; live v100 at N10b, N11 on preview)

**A new chat starts here.** Read this file, then `Session Nov 9-10.md` (what the last window decided and learned), `Next build list.md` (how each item was decided, and the Built N1–N11 log), `Parked.md` (every cut), `N6 progress.md`. Albert's standing rules are in Claude's memory too. Then wait for his go.

## Where it stands
- **Live:** https://acohen2300.github.io/first-keep/frankenstein-refresh/v100/ (N10b). Source: `frankenstein-refresh/v100/` on `main`.
- **Preview:** https://acohen2300.github.io/first-keep/frankenstein-refresh/preview-n11/ (N11, the paper ground, with one blade tile). The preview folder is a plain copy of v100 with N11 in it, on `main`.
- **N11 source:** branch `n11` (v100 with N11: sheets, water by shore distance, season tint, blades, flowers by year, snow sheet, glints; meadow picture and `cels.js` cut). The preview's one-tile change is on the branch too. On Albert's go: merge `n11` into `main`, fix the N11 items below, publish v100, delete `preview-n11/`.
- **Gate:** `python3 index.py` in v100 (permit.json: `build`, `agreed`, `opens`, `grow`; numbers only in books; code comments are bare E-codes, their words in the comments book; each E-code named by code; init order: anything at the top of index.html runs before `ONE`/`ZERO` exist, use `D.count.one`).
- **Publish:** `python3 publish.py --smoke "<message>"` (gate + smoke, seal, commit, push). It stops at `git pull` when docs are unstaged: `git add -A`, `git commit --amend` as Albert with the trailers, `git pull --rebase`, `git push`. Check the Pages run: `gh run list -L 1`.
- **Tests:** `python3 test.py` (full, about 40 min); a throwing test is that rule's FAIL and the suite runs on. Tests held to Mid's calendar set `FK.D.startIn = 0`. `python3 smoke.py` (6 checks; the reload's frames are timed apart from the match's).

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
- List the changes first; build only on his double confirm ("yes yes", "go go go"). No exceptions to a rule: if a rule fails somewhere, the rule or the builder is the problem.
- Claude builds everything itself: no helpers, bots, agents or builders.
- Mock first (a page he can open on his phone), then build. Check v100, Mid (`frankenstein-refresh/mid/src`) and v80 (root `index.html`) before proposing new logic.
- Big changes go to a preview first, not straight to live.
- QC: every build runs the gate, smoke and a values line per item; overnight, the full `test.py`, a fresh-eyes review, and every slip becomes a gate rule.
- Commits as `Albert <acohen2300@users.noreply.github.com>` with the session's trailers; the repo is public.

## Open: the one list (Nov 10, 07:10; replaces the Nov 9 "OPEN" list)
**N11 paper ground (on preview)**
1. Hilltops draw as blocky brown crosses: make them grass.
2. Blades too dark and dense at mid zoom: one tile on preview now, his look owed.
3. Hill light too strong (reads as cloud shadow).
4. ~~Patchwork seams~~ N12 (preview, Nov 10 08:15): chunks cut, one picture at every zoom; Albert's look owed.
5. Dark zig-zag wedges on map-edge cliffs.
6. Rivers and lakes look like trenches: water to fill close to the grass.
7. ~~Blade-less pieces~~ N12: blades are one sheet over the land, cut to the grass.
8. Mud and frost: back later as steps, like snow.
9. Publish N11 live (his go).

**Locked designs never built (Nov 9, `Next build list.md` items 9–12)**
10. Controller colours (SN38): columns 1–2 brown, 3–4 gunmetal, 5–6 crimson, white ink.
11. Top Info Ribbon (SN39): nine segments; what each holds is not set.
12. Colour sheet not used: menu.js keeps its own palette (`COL`); crimson R4 not in the Colours book. One home.
13. Screen-book code clash: SN32–SN35 used for other things than the planned research buttons.
14. Re-check every Nov 9 lock against the code.

**Waiting on Albert**
15. Where "Show all" lives (with all six shown it makes a third row).
16. Phone `?test` meter numbers.
17. Stance buttons (gift/bribe, war, terms, ally): what each does.
18. Training existing units when tech improves them (school and tuition idea).

**Small faults**
19. Long names clipped (queue, Mail). 20. Sight not saved across a reload. 21. Steep banks' cliff faces at high zoom.

**Tests failing since before N5**
22. t-land (home gold and stone outside the 300 m pocket). 23. t-civs, t-kinds (figures differ from Mid). 24. t-orders (Choke and wheel left with the Yard). 25. t-sight (minimap mark). 26. t-stage, t-wild, t-fire, t-mind, t-realm, t-alarm, t-same, t-odds, t-gather, t-walls. 27. t-proof crashes (its plant no longer matches menu.js).

**Code health**
28. The zero rule: about 6,150 typed numbers left (mostly sprite coordinates).

**Later, by his word**
29. Choke and Bombard. 30. Help inside each card; a help line for every action. 31. The Guide (nothing opens it). 32. Hunting modes. 33. "Mind your own business." 34. Squads. 35. The 52 Base differences. 36. Each research shows what it helps and by how much. 37. Computers held to sight. 38. B32–B36 (Nov 8 plan). 39. `Owed.md` (the v80 list, never checked line by line). 40. Season repaint only on a visible colour step.
