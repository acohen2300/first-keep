# First Keep: handoff (Build 29)

## What it is
Single-file HTML mobile RTS (Albert). Live: https://claude.ai/artifact/BYdPKYCJDQS3xw5fwxvjYV (version 34, Build 29). Updated in place each build with a label.

## Layout
- `src/NN-*.js` (00-pre, 01-rules … 16-boot) + `src/shell-head.html` + `src/shell-tail.html`; `build.py` joins them into `first-keep.html`; `wrap.py` makes `native/index.html`.
- `src` is its own git repo (last commit: Build 29). Backups: `first-keep-bNN.html`.
- Tests: `tests/gate.py` (4 iPhone sizes x web/native, 44 px taps, 12 px type, half-zoom tell-apart, calls `tests/words.py`: toasts/tips max 10 words). Playwright scripts in `/tmp/t/` (t32 orders, t34 gunpowder, t37 formations, t38 draw-error hunt, t41 top-bar measure, stress.py) are not in the repo and are lost with the container; rebuild if needed.
- Notes: `CUTS.md` (every cut, per build), `GUIDE.md` (player guide; not regenerated for B29), `APP-PREP.md`.
- Build/check: `python3 build.py && python3 wrap.py && python3 tests/gate.py`. Syntax-check the combined script from `first-keep.html`, not per file (IIFE spans files).

## Working rules (Albert, standing)
- Make a list first; execute only after his double confirm ("yes yes", "go go go", "Sure go"). His standing vote on a list is "do all", exceptions named by him.
- Talk things out first. Simplest, leanest design; no fixes on fixes; merge; log every cut in CUTS.md.
- Honest, neutral pushback; no flattery. Real science and history. Bad events are an inconvenience, never game-ruining. Pay to help, never pay to win. Fun and hard, not annoying.
- Tell him before switching to Opus (he switches the model).
- SoRen (`/home/claude/soren-archive`) is read-only for ideas; no changes without his yes yes.

## Key technical notes
- Fixed timestep (DT 1/30, global `G`), nav grid NC=200 x NAVC=10, cached sprites (`SPR`, `BSPR`, `NSPR`), turned view (`SIDE`, `TILT`).
- Player keep at global (300,1700). Local frame: keep (0,0), `at(dx,dy)` mirrors per corner. Forest cleared within `FOREST.home`=360. Home pocket (berries, grove, stone, gold, iron) behind the keep via `LAYOUT` rows with angle ranges.
- Gunpowder is age 5 (`AGES[4]`): arquebus, bombard, musket, starfort; units flagged `gun`, not `archer`.
- Armour kit `KIT` 0-3 is part of the sprite cache key. Theatrics: `popC`, `celebrate`, `b.doneT`, `u.bornT`, `u.glowT`.
- Draw: painter list sorted by y, per-item try/catch -> `fault(e)` (saves and pauses after 2 distinct errors). Past bug: villagers carrying cloth/wool/beer threw in `drawUnit` and hid the Town Center.
- Toasts: `say(text, cls, secs, at, act)`; one of each at a time; `SET.msgs`, `SET.tips`, `advise()` ('!' = urgent). Pace: `speed()`, `paceBtn()`, `setPause()`.
- Save `SAVEV` = 27; old saves load with Messages on.
- Top bar at 375 px: homes icon hidden (`@media max-width:380px`); side padding 8 px at <=400 px.

## Open items
1. GitHub: DONE. Repo https://github.com/acohen2300/first-keep (main, game as `index.html`, Pages on). Phone link: https://acohen2300.github.io/first-keep. To publish a build: attach the repo with add_repo (push), copy `first-keep.html` to `index.html`, commit and push to `main`. Pages deploys in 1-2 minutes. The Claude GitHub app is installed on his account. This session could not reach github.io or the Pages API, so Albert checks the live link.
2. Sound: obeys the iPhone silent switch (`navigator.audioSession.type='ambient'`). Albert has not decided whether it should play on silent.
3. Real-phone test list: pinch zoom, box-select, build ghost, villager card, field dots, research dots, 30-minute bell, new top bar and corner chip, pace button.
4. Gunpowder balance (costs, bombard damage, AI timing) is first-guess.
5. Parked ideas: replays, biomes, interpolation, optional Auto jobs, readability cleanup before App Store, bundled fonts for native, "Add another conquest" step-up, slower first raid (~5 min), job row as one line (mockup B, he chose the old bottom).
6. GUIDE.md needs Build 29 changes (top bar, corner chip, one pace button, Messages toggle, side-by-side building).

## Status at handoff (Oct 27)
Build 29 is live at the artifact URL (version 34) and on GitHub Pages. Nothing in progress. Next: his phone test of Build 29 and the sound-on-silent answer.

## Full transcript
`logs/session-1.jsonl` (raw log of the first session, 1.2 MB) is in the repo.

## Tests in the repo
`tests/gate.py` and `tests/words.py` are the release gate. `tests/e2e/` holds the 79 Playwright scripts used during development (t32 orders, t34 gunpowder, t37 formations, t38 draw-error hunt, t41 top-bar width, stress.py, shot*.py). They point at `file:///home/claude/first-keep/first-keep.html`; change the path to run them.
