# First Keep: handoff (Build 36, live)

## What it is
Albert's single-file HTML mobile RTS (Age of Empires style). Albert is not a coder.
- Live: https://acohen2300.github.io/first-keep (`index.html`). Preview copy: `/preview` (same file as live right now).
- Repo: https://github.com/acohen2300/first-keep, branch `main`. Pages deploys 1-2 minutes after a push. Sessions usually cannot reach github.io, so Albert checks the live link.
- Last commit: Build 36 (5e98b58).

## How to work with Albert (standing rules)
- Talk it out first. Make a list; build only after his double confirm ("yes yes", "go", "Sure go"). His standing vote on a list is "do all", with exceptions named by him.
- Mockups first, then ONE build, ONE gate run, ONE push. No build per tweak. Look at every render yourself (and measure it) before showing him.
- Simplest, leanest design. No fixes on fixes: redo it cleanly. Merge, cut bloat. One mold, uniform sizes.
- Log every cut in `CUTS.md`.
- Honest, neutral pushback. No flattery. Keep pitching good ideas, flagging which rule they break. Analyze by element (does it exist, why, where is its source, where else can it be reused).
- Tell him before switching models (he switches them).
- Be brief and move fast: he said the Build 36 layout work was "too painful for no reason". Real game design: real science and history; fun and hard, not annoying; pay to help, never pay to win.
- SoRen (`/home/claude/soren-archive`, his other app) is read-only for ideas.

## Repo layout
- `src/NN-*.js` (00-pre ... 16-boot) + `src/shell-head.html` + `src/shell-tail.html`. `build.py` joins them into `first-keep.html` (refuses syntax errors and duplicate top-level names; embeds fonts from `src/fonts`). `wrap.py` writes `native/index.html`.
- Check: `python3 build.py && python3 wrap.py && python3 tests/gate.py` (run from the repo root).
- Publish: copy `first-keep.html` to `index.html` (live) and `preview/index.html`, commit, `git fetch`, push to `main`. Commit trailers: `Co-Authored-By: ...` and `Claude-Session: ...` lines as the session instructs.
- Notes: `CUTS.md` (every cut, per build), `GUIDE.md` (player guide; the two lines for the screen and jobs are current, the rest is as of Build 29), `APP-PREP.md`, `mockups/` (layout images; `build36-*.png` are the final screens), `logs/session-1.jsonl` (raw first-session log).
- The gate (`tests/gate.py`, with `tests/words.py`): 4 sizes (375x667, 390x844, 393x852, 430x932) x web and native; no page errors; taps at least 44x44 (except the - and + tiles, `.pm`); text at least 12 px; contrast at least 4.5:1; no clipped words; no card scroll from 390x844 up (except Help and Guide); buildings tell apart at half zoom; toasts and tips at most 10 words. Last run: all PASS.
- `tests/e2e/` holds ~79 old Playwright scripts. They point at `file:///home/claude/first-keep/first-keep.html`. `t27.py` is stale (reads #sClock, #bVil, #bArmy, which no longer exist).

## The screen (Build 36)
Built to fix a bottom area that took ~29% of a phone. Source of truth: `src/shell-head.html` (CSS and markup) and `buildPanel()`, `setBuildRow()`, `ui()` in `src/12-ui.js`.
- One mold: `.cell` (icon spot `.gl`, word spot `.wd`), tokens `--row:44px --strip:28px --t2:14px --r:8px --hair --sheet`. `button.cell` uses `all:unset`; do not style controls through the global `button{}` rule or the old `.row` grid (they leaked into earlier attempts). Use unique class names.
- Top: one pill of 8 equal cells (Food, Wood, Stone, Gold, Iron counts; mute; pause; speed). Strip under it (28 px to see, 44 px to tap): age + season + clock on the left (glows gold when the next age or any research is ready; tap = Town Center card), idle villagers in gold when above 0, score + rank on the right (tap = score card). Map button top right (minimap toggle).
- Bottom: six columns: People, Food, Wood, Stone, Gold, Iron. Each is a 44 px tile plus a - | + pair beneath. People tile opens the People card (`card:army`, which now holds Research and How to play); its - (`unvil`, `unTrain()` in 05-orders.js) cancels the newest waiting villager and refunds it; + trains one. Count shows have/room, or have+waiting.
- Build: 44 px corner button bottom right (Home mirrors it bottom left, only when the Town Center is off screen). It swaps the jobs for one row: Home, War, Walls, Trade, Culture, close. Each opens its existing 12-slot card.
- Layout variables: `fit()` in `10-view.js` sets `--ob` (bottom offset) from the real height of `#orders`; `--hb` (top) is 78 px + the safe area in CSS. Anything that changes those heights must call `fit()`.
- Cut or folded this build (details in CUTS.md): "?" button, Farm job (now Food), old +Villager|Build row, status and clock pills, Research tile and glow, Army and marching counts, zoom % and civ name. Menus renamed: Military is War, Defense is Walls (ids `mil`, `def` unchanged).
- Farm folded into Food: `JOBS` has five entries. Food workers take a free field within 160, else berries, game or fish; they move onto a field when one frees up. Save version 29 (`MIGRATE[28]` turns saved Farm workers and rally into Food).

## Key technical notes
- Fixed timestep (DT 1/30), global `G`, nav grid, cached sprites, turned view (`SIDE`, `TILT`). Player keep at (300,1700); local frame mirrors per corner.
- Villager cap 60, army 90. Gunpowder is age 5; units flagged `gun`.
- Draw: per-item try/catch to `fault(e)` (saves and pauses after 2 distinct errors).
- Toasts: `say(text, cls, secs, at, act)`; `SET.msgs`, `SET.tips`, `advise()` ('!' = urgent). Pace: `speed()`, `paceBtn()`, `setPause()`. Every button verb lives in the `ACT` table in `12-ui.js`.
- Save: `SAVEV` (shape only) plus `MIGRATE` steps; old saves are kept aside, never lost.
- Test hook: `window.__fk` exposes `G`, `act`, `openCard`, `saveGame`, `ui`, `setPause` and more (see `16-boot.js`).

## Open items
1. Albert's real-phone test of Build 36: tap sizes, strip taps, Build row, People - and +, the gold glow, 375 px width. Fix whatever he reports in ONE batch.
2. Sound obeys the iPhone silent switch; he has not decided whether it should play on silent.
3. Gunpowder balance (costs, bombard damage, AI timing) is a first guess.
4. Idea backlog (ask first): replays, biomes, interpolation, optional Auto jobs, readability cleanup before the App Store, bundled fonts for native, "Add another conquest" step-up, slower first raid (~5 min).
5. Agreed roadmap before Build 36 changed priorities: Build 34 the world (weather, wind, snow, battlefields, world settings), Build 35 the front door (demo world behind the menu, story, facts, tech map, new score card), a roads idea (dragged like walls, +10% work, never required; undecided). Check CUTS.md for what actually shipped before assuming any of these is still open.
6. GUIDE.md still needs the Build 29-36 changes outside the screen and jobs lines.
