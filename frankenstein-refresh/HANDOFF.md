# Frankenstein Refresh: hand-off (Nov 7, 2026, evening)

Read this first in a fresh chat, then `BUILD-BRIEF.md` (the method and the core values), `clean/decisions.json` (Albert's binding calls; the Nov 7 calls are the newest), and the end of `../docs/4 Now/Parked.md` (open items, newest last). `../START-HERE.md` describes the old v80 structure; for this work, this file is the start.

## The measure for every build (Albert, Nov 7 15:44)
Gameplay: Base (`base/`, preview 49). Features: Mid (`mid/`). Structure: v100 (`v100/`). Where they disagree, Base wins on how it plays, Mid on what it has, v100 on where it lives.

## Where things stand
- Mid's gameplay is in v100's structure (F10–F39), plus today's: A1+A2 (speed and the F39 audit's fixes; the migration bugs; phone care), M1/M1b (Base's menus, first part; the fonts carried inside), F1 (Base's flow: morning light, the ghost's label and grab-or-pan, the top bar stores · mute · pause · map, the Pause screen, the error screen's line), G1 (Albert's Nov 7 calls: Mid's pocket by law QCS, the computers' free Mill and Farm, lightning by the NLDN record, CALVIS visibility, inverse-square glow), S1 (22 source corrections), R1 (review fixes).
- Preview: https://acohen2300.github.io/first-keep/frankenstein-refresh/v100/ · Base: .../base/ · Mid: .../mid/
- Speed: 59 fps on the setup screen; a match 48–57 fps, 1.6x slower after a reload than before (open).
- Testing (Albert, Nov 7 10:34): a build publishes on the gate (`python3 index.py`) and the smoke test (`publish.py --smoke "message"`, ~3 min). The full `test.py` run (30+ min) is OWED: run it overnight and fix what it finds; never weaken a check.
- Still to build: the skin's remaining polish (Base's look is largely in; compare in clear weather), the number sweep (report in the Nov 7 chat: 4 builds clear ~60%), the test trim, the repo cleanup (one start page), F40 the Throne (waits for Albert), the Games, Reduce motion as a setting, the sightlines UI (mockup first), the scale change (smaller people, bigger board).

## How to build
Write `v100/permit.json`, build per `BUILD-BRIEF.md`, run `python3 index.py` (PASS), then from `v100/`: `TRAILER="Co-Authored-By: ...\nClaude-Session: ..." python3 publish.py --smoke "message"`. Without `--smoke`, publish runs the full test.py (background it, 2-hour timeout).
