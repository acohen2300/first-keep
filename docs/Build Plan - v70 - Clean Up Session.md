# Build Plan - v70 - Clean Up Session
*Made in v70 - Clean Up Session, Oct 30–31, 2026. Changed only with Albert's word: a later session edits this file and its title, and does not start a copy.*
**the agreed list (Albert's double yes, Oct 31, 06:35: "Yes. Go go.")**
What was agreed, word for word as listed to Albert, so nothing drifts. The drawings are `MENU-SPEC.md` and `COLORS.md`; the pictures are in `mockups/70/`. Every part is checked against `RULES.md` §0 (the Build Rules) before and after.

## The list
1. **Base:** today's main (Build 66 plus the Build 70 mockup commit). Hammer under People stays. The door, the Realm page, the Build page and the Squad page are cut, their code deleted completely (the mockup left guards such as `if (!el) return` in `doorUI`; those go with the rest). Menu pictures and pins cut (check `bldThumb` and its cache: delete if nothing else uses them).
2. **The grid:** 6 gap, 44 slots, radius 6 (9 for an outline), the six colours renamed with Steel for War and Train, the five states, text at 12 / 15 / 19 only.
3. **Title bar:** back · name · book · ×, the short names, the title-fit gate test.
4. **Top bar** snapped to the grid (bar 44 at 6, gap 6, strip 19).
5. **Row:** the cycle button, Jobs → War → Train. War is the HUD; the squad builder moves to the squad's card.
6. **Quick action:** the tight 2 × 2, the red circle on enemies and hazards.
7. **Emergency** with four: Stop, Town square, All hands, Shelter. Town square gets real logic: everyone (villagers and soldiers) gathers round the Town Center; villagers' jobs are noted so Stop sends them back. Battle stations is cut (Town square replaces it).
8. **Cards:** Relations, Town, Market, Build menu, Squad, Villager, Stores, House (every building card), Mail, Emergency.
9. **Map list 1–7**, hazards as A (below).

**Stays as today:** Setup and the full Research list (only the title bar changes on them); icons (rough until the icon pass); the computers (the AI economy fix is a separate test, not in this build).

## Decisions made for Albert (he may override)
- **Back arrow:** returns to the card you came from; on the first card it closes.
- **Gifts:** the Natives only, as today; the rivals' gift slot shows dim.
- **Title font 19**, by the rule book's three sizes.
- **Queued units can be cancelled:** tap one in the queue, its cost comes back.
- **The quick action's menu (☰)** opens the Here card for that spot.
- **Idle to me** (Town tab) is cut: the quick action's idle sends the idle ones to the spot. **Stop all** is Emergency's Town square.

## The rule book changes (RULES.md, in Albert's words)
1. "A state is a ring and a glow, never a fill" becomes: a state is a ring; the one fill on a card is its main action (gold), and progress is a green bar.
2. "The first slot holds the door" becomes: slot 1 is People over the hammer; the cycle button sits above it.
3. "Every button with air around it" holds on the grid; a floating menu is one tight block.
4. One font, three sizes (12, 15, 19): the title moves from 20 to 19.
5. The menu spec and the colour index are named as the one homes for layout and colour.

## The map list (agreed in talk Oct 30; Albert's ballot V19–V23)
1. Cut the re-roll: one seed, one layout.
2. The Throne is a base rule: the centre, the same distance from every keep.
3. Lakes and rivers random: count, size, place (today every corner gets one river of one width, for fairness).
4. Wild resources, finds and animals: random, as now.
5. Cut `fairness()`, `FAIR` and the gate test "maps fair on ten seeds"; keep the turtle measure (the computers use it).
6. RULES.md in Albert's words: base rules (flat page, four corners, clearance, home resources, the Throne central); random everything else; no reshuffle.
7. CUTS.md log with measurements, and the fingerprint's reason.
- **Hazards: A.** Random when none are picked; a pick in Setup still decides.

## How the work is done
- One line of work in `/home/claude/first-keep` (the map in its own worktree, merged after). Local commits as Albert, marked "Build 70 work in progress"; no push and no publish until the end.
- The rebuild method (RULES.md §3): find every home, write it once, delete the old completely, migrate the save, log the cut.
- Size and line count before and after, reported. Before: 30,580 source lines, 1,192,288 bytes built (main at 768b9c0).
- At the end: a cold review of the diff by a reviewer who has not seen the work; the gate at four sizes; lint; the soak; the 12-seed harness for the map change and the fingerprint accepted with its reason; CUTS, HANDOFF, GUIDE, EXCEPTIONS; one publish to the preview.

## Added Oct 31 morning (Albert's yes yes, 08:06)
1. The ring is the slot's edge, for words and icons alike; one ring at a time, danger beats working.
2. Working is a green ring on the edge that recedes as the time runs out (SoRen's timer ring); the green bar goes.
3. Words under picture icons (18 icon, its number beside it, the word at 12 under it); symbols and the quick action stay bare; a gate test for slot words at 375 pt.
4. Danger breathes; with Reduce Motion it stays still and is drawn 3 wide.
5. Chosen stays gold. Locked stays as the foundation built it (flat, quiet words, nothing faded).
6. The five resource colours are named in the colour index; EXCEPTIONS #11 holds for the land, the art, the players' colours and the shadows.
7. The session's documents and pictures carry "- v70 - Clean Up Session"; the menu spec and the colour index keep their file names and carry it in their titles; "LOCKED" reads "locked in v70".
8. Every build gets a version stamp (a git tag): v60 to v66 stamped Oct 31 (v66 never published); v70 when it publishes; the stamps go up with it.
9. Previews as the work lands (Albert: "Let's get a preview going so we can make more changes"): preview 1, the foundation and the map, published Oct 31 morning.

## The v70 line (Albert, Oct 31, 08:20)
"Everything agreed on, from the time you read this, is v70. Anything that isn't yet agreed on will move to 80, which will include my comments on 70." v70 is built to the end of what was agreed (the row and the rings, the quick action and Emergency, the cards), then stamped and retired as the fix and clean-up set ("I'm going to retire the 70 set as a fix and clean up set. The next list is 80"). Everything else goes on `docs/Build List - v80.md`.
