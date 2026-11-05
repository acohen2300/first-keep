# Frankenstein Refresh

Mid's game, rehomed into v100's structure, wearing Base's look and feel. Albert, Nov 5, 2026.

v100 is the skeleton, Mid gives the organs, and Base gives the skin. The original `v100-ground-up/` and `preview/` stay frozen while this runs. All work happens here, and when it's done and played, this copy becomes the next v100.

## The folders

- `mid/`: Mid, copied from `preview/index.html` with its 51 source parts (`mid/src/`), sealed in `mid/seal.json`. Never edited.
- `v100/`: a copy of v100 with its books, gate, tests and seal. Its gate also reads Mid (`--survey`).
- `map/`: the survey. `MAP.md` (the whole, by group, by part, by section) and `PIECES.md` (every top-level name) are written by the gate. `groups.json` is step 3, the only file here written by hand.
- `staging/`: the temp books (steps 4 and 5). Never edited after step 5; the gate holds them to Mid.
- `clean/`: the cleaned temp books (step 6). Not made yet.

## The steps

1. Freeze Mid: done (sealed; the gate stops on one changed byte).
2. Map: done (`map/MAP.md`, `map/PIECES.md`).
3. Group: done (`map/groups.json`, 18 groups, each with its v100 home).
4. Temp books: done (`staging/`, 18, one per group; `order.json` reads them back in Mid's order).
5. Divide: done. Every line of Mid is in them as it is, and the gate proves they rebuild Mid byte for byte.
6. Clean, one temp book at a time, against the gate's code rules. Every cut goes in Parked.md.
7. Move into v100's clean books, each piece matched against Mid (same action, same result).
8. Migrate, 10 per build, through the gate.
9. Base's skin: its look and feel as book entries.

## Run

    python3 v100/index.py --survey ../mid ../map    (paths are from v100/; --stage made staging/ once)
