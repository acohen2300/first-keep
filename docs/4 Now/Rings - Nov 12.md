# The ring inventory (list D1; build list #6 and #23) [2026-11-12 09:10]

Read from the code of N29, Nov 12. Nothing here is built. #23's six meanings: draining ring = time or progress; green = active; blue = next; gold outline = selected; red fade = can't afford; dim = not available. [2026-11-12 09:10]

## Where a ring, arc or outline is drawn [2026-11-12 09:10]
| Where | What it is today | Colours today | Against the six meanings |
|---|---|---|---|
| Menu boxes (one mold, the Screen book's `ring`, SN32) | dim = not chosen, lit = chosen, run = thick and draining | white, brown (buildings), red (soldiers), blue (scout, envoy, spy), gold (trade), green (villager), by what the box trains or does | The draining part fits. The colour means "family", not one of the six. |
| Tech tiles (N27) | waiting = blue, running = green and draining | blue, green | Fits (#18). |
| The help line's ring | lit white | white | Not one of the six. |
| A unit's foot ring (Colours book, C24) | picked, working, idle; a foe's side colour; the wild white | green picked, blue working, yellow idle | **Clash.** Selected should be a gold outline. Green here means picked. |
| A hidden find's ring through the trees (N27, E1029) | dashed, the find's own colour | gold for gold, and so on | Not one of the six. |
| The crosshair and its sonar ring | aim | green yours, red foe, blue ally, white nature | Its own code. |
| The quick action's aimer | plain white ring, four ticks | white | Its own code. |
| The small map's incoming mark | pulsing ring | red | Its own code. |
| Ripples on tap and on a finished building | expanding ring | white, gold | Decoration. |
| Health and nerve bars, the build bar | bars, not rings | green, amber, red | Progress, but not a draining ring. |
[2026-11-12 09:10]
Canvas calls that draw an ellipse or arc: 50 in index.html (most are art: wheels, heads, shields), 5 in menu.js, 4 in combat.js. [2026-11-12 09:10]

## Clashes found (list E5, "rings and taps inconsistent") [2026-11-12 09:10]
1. **Picked green against the Raiders' green.** Picked is `#21e05a`. The Raiders' side colour is `#5fd08a`. A Raider soldier's ring reads as one of yours, picked. Seen in a test picture on N29. [2026-11-12 09:10]
2. **Working blue against your own side blue.** Working is `#2f8cff`, your side `#6aaeff`. [2026-11-12 09:10]
3. **The wild's white against the Fortress's cream** (`#ffffff`, `#ece5d3`). [2026-11-12 09:10]
4. **Selected is green on the map and gold in the Controller** (the armed button has a gold edge). [2026-11-12 09:10]

## For Albert to decide [2026-11-12 09:10]
1. **Problem:** selected is green on the map, gold on buttons, and the Raiders are green. **Idea:** a picked unit wears a gold outline everywhere (#23). **Weakness:** idle is yellow (`#ffd21f`), close to gold; idle would need another mark (the "z" badge it already has, and no ring colour). [2026-11-12 09:10]
2. **Problem:** your working ring is nearly your side colour. **Idea:** a unit's ring is always its side's colour; state rides on marks (picked = gold outline, idle = badge). One ring, one meaning: whose it is. [2026-11-12 09:10]
3. **Problem:** menu ring colours mean "family" (brown, red, blue, gold, green), which #23 has no place for. **Idea:** keep family as the box's tint, and keep the ring for time only. [2026-11-12 09:10]
