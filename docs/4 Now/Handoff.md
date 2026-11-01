# First Keep: handoff (Nov 1, 2026, 14:40; Build 80 preview 11 in progress) [2026-11-01 14:40]

**Read START-HERE.md first.** This file is the live state of the coordinating session, so any agent can pick up if the chat is compacted or lost. [2026-11-01 14:40]

## Where things stand [2026-11-01 14:40]
- Up to 62 was great. 63 to 69 was a mess. 70 is restored (frozen at `/v70-restoration/`). 80 is current. [2026-11-01 14:40]
- **Live:** an older build, untouched. Live changes only on Albert's word. [2026-11-01 14:40]
- **Preview on GitHub:** still preview 9 (`main` on the remote is 38001b9). Nothing since has been pushed. [2026-11-01 14:40]
- **Local main** holds, merged and checked: the cards, the map (+8%), research and text (N9–N12, N14), combat (C1–C9, items 5 and 6), the docs system, the hunt report, and the v81 list. [2026-11-01 14:40]

## Builders running now, each in its own worktree (merge each into main with --no-ff, append its CUTS draft, run START QC) [2026-11-01 14:40]
1. **wild81** (`/home/claude/fk-wild`): the wild by kind (D-058), 4b (D-083), Relations with a third Misfits tab and "Foe → Neutral" (D-077), the hunt fixes, Argon's four bugs, the idle meter, the famine floor (D-086), gatherer caps per find, and item 5's spots on six seeds. Notes: `WILD-NOTES.md`. Last seen passing START QC. [2026-11-01 14:40]
2. **zones81** (`/home/claude/fk-zones`): three home zones; placement as the ghost only, tinted, with line-up guides; every building 2 squares from every find; finds moved to 220–280 so the walls clear them; zone 1 bigger finds (2 bushes × 300, 2 trees × 125; hold zone 1 out if Classical by 10 min doesn't come back to within ~10% of main); starting stores 200 each of food, wood, stone and gold, iron 0, in the rules table; EXCEPTIONS #16 (LIVE TEST IN PROCESS): computers start with a mill and a farm. Notes: `ZONES-NOTES.md`. Its START QC failed only on combat item 5, which is fixed on wild81 and arrives through main. [2026-11-01 14:40]
3. **ai81** (`/home/claude/fk-ai`, from wild81 d6bbc07): the computers batch: answer 10 by need (theory of constraints), the famine runway, shifting to plots (marginal value plus payback), N7 (no ceiling, payback test), N8 peace mode, N6 crowns, N16a raids (robbers'), D2–D5. Notes: `AI-NOTES.md`. [2026-11-01 14:40]
4. **text81** (`/home/claude/fk-text`): the Aqueduct text, plague from cited studies, Weather glass (work and health), Charcoal priced to its age, ice friction for Horseshoes and Crampons, text F2–F9 and D16, combat C11, C12, C15, C16. Notes: `TEXT-NOTES.md`. [2026-11-01 14:40]

## Each builder gets a fresh-eyes review before merge (a cold agent reads the diff against the agreement) [2026-11-01 14:40]

## Final checks before publishing preview 11 (Albert, Nov 1) [2026-11-01 14:40]
- Full START QC on the merged main. [2026-11-01 14:40]
- Soak and balance, 3 games each at 120, 180 and 240 minutes (Albert, 14:25), all before the preview; plus the usual soak 6 × 30 and balance 4 × 30 against v70. Add these long runs to the QC standard (`docs/1 How we work/06 QC standard.md`). [2026-11-01 14:40]
- A last fresh-eyes review of the seams, then `python3 publish.py --preview "…"` with TRAILER set. [2026-11-01 14:40]
- Albert wants everything in one preview, as soon as possible. [2026-11-01 14:40]

## Albert's answers today [2026-11-01 14:40]
All of them are in `docs/6 Records/v80 Audit/Answers - Nov 1 full day.md`. W1–W6 are locked as D-081 to D-086. Still to lock as D-files at the merge: Z1–Z4 (zones), P1–P3 (placement, caps, the find gap), S1 (stores and EXCEPTIONS #16), and the long tests. [2026-11-01 14:40]

## Open, waiting for Albert [2026-11-01 14:40]
- Mail's door (v81). [2026-11-01 14:40]
- The v81 list (13 items in `docs/4 Now/v81 List.md`). [2026-11-01 14:40]
- 6 rivals and a giant map: Albert asked; the answer was measure first. Not on the v81 list yet. [2026-11-01 14:40]

## Not First Keep [2026-11-01 14:40]
- First Term (Albert Labs' next game) is parked; its mockup is a Design artifact, "First Term Pool". [2026-11-01 14:40]
- SoRen design talk (the tappable State bar) happened in the same session. SoRen's newest public preview is p16 (Oct 25). [2026-11-01 14:40]
