# Design 17: the n69 play fixes (N70)

Albert, Nov 18 2026, 12:36 to 14:51 (his n69 notes, two pages, `docs/4 Now/Notes/2026-11-18 n69 notes*.jpg`; talk one by one; mocks `mockups/dock/200` to `221`; every word in The List, section 32). His go, 14:51: "Go go go go go go do it".

## The line (10, 11, 13, 14)
- Home glows a faint white halo, W a faint red one (14:46); Jobs | Build glow; the closed one of the two dims (13:47, D).
- The hint sits in one fixed spot right after Jobs | Build, italic, left (12:53): "tap Build to switch" when Jobs is open (13:49).
- Build's group words follow a →; the open one is underlined (14).
- A floating − above the line's right end (above Tech, the same spot on every screen) hides Jobs | Build and closes the rows; the line is then ⌂ + … W, and the floating + brings them back (14:16 to 14:21). Home and W always stay. A game starts open. His play decides the spot.

## Jobs (24, 25, 27)
- People: a white ring (14:47), "people | house max" over "Train: 50f" (14:49), the cost coloured by the cost rule. A tap on People trains one villager; each tap adds one. No + over People.
- "Idle n" in a small box with a pin over People, 12 px, dim at 0, gold when any (14:44); a tap moves the camera to the next idle villager and picks it.
- A job tile tapped sets the rally (new villagers go there); tapped again clears it; − + never touch it (14:34).

## Cost (21)
- Red: short of anything. White: exact. Green: one or more over everything (14:22). No gradient.

## Villager (3)
- A villager sent to a job while carrying another kind goes to the new job (econ.js, the drop branch re-picked the old kind).

## Placing and sites (4, 16, 18; 13:28)
- A still tap on the green ghost builds it; a drag moves it; Build still builds.
- A site under construction: tap it, it turns red and a small trash shows where you tapped (and Delete in the dock); tap again, it comes down. The refund is the share not built (AoE II: cost × (1 − completion)). Its row: "House → 40%", Delete | Cancel.

## The building card (19, 26; 14:50, 14:51)
- The line: → Train | Learn | Talk (the open side green for Train, blue for Learn); the crumb row "Town Center → Train", then Repair | Demolish | Cancel.
- A unit tile tapped trains one; each tap adds one ("There is no first pick. It's a plain tap train system"). The queue shows in the crumb ("Town Center → 2 Villager") with Stop (drops the last one).

## War (5, 6; 13:34)
- Shelter | Work come back (ECON.alarm('shelter'), the all-clear) and Out (let the garrisoned out), in the same spot.

## Pause card (2; 13:02)
- Line: ‖ Paused | Resume · Help | Copy log · close. Row: Pause → Settings, New | Cancel. "Speed (tap one)": ×1 ×2 ×3. "Sounds (tap to cycle)": three. A card, not a dock menu. No tables, no blue help bar.

## Ribbon (7, 8, 9)
- A resource tapped opens the in/out table; the score cell opens the scores (its own card).

## Halo and books (17, 23)
- The halo's middle at lift 0.12 of the width, moved left 0.10 (14:15). A book tapped flashes.

## Not in N70
- Quit on the pause card (sketched; what it does is not ruled).
- The shell/ring/text audit (1, 15, 20, 22: SOON); the War menu under the law; a pause setting to hide hints (LATER).
