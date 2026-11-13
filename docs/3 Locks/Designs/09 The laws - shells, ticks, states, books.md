# Design 09: the laws (Albert, Nov 13 2026, 11:24-11:59, N346)

Draft from Albert's words. Lines marked (?) are Claude's and wait for his word.

## The five words
1. **Shell.** Everything in the game is a shell: an empty vessel. A unit, a building, a find, a lake, the ground, a menu, a card, a button. "Everything should be a shell."
2. **Tick.** What a shell is and can do is ticked on it: is it a resource, does it move, does it get reduced, does it have a sprite (and where), does it spawn, does it research, can a villager work it, what is its size, its priority. A tick points to a book for its facts.
3. **State.** (?) A tick that switches on and off while playing: working, walking, resting, picked, active, burning. Priority, the ring and the tap read states.
4. **Law.** One behaviour, written once, for one tick or state, and applied to every shell that has it. "Wherever that thing repeats it gets applied": the tap, the ring, the queue, the push.
5. **Book.** Anything that is not a shell is information, and it lives in one book with its index code: math, measures, colours, words, sounds, sprites, citations, comments. The index, citations and comments cross-check each other, written by the gate.

## The rules
- A shell may be made of layers (the ground: water, sand, dirt, grass; a lake a cut through them).
- Code never asks a shell its name (its job, kind, civ or code). It asks its tick or its state.
- A law reads only shells and books. No number, colour or word typed in it.
- Shells are set by group: all units, all finds, all buildings, all menus.
- If something does not fit, the logic is wrong, not the thing: find the better logic. No exceptions built in.
- (?) One shell a body, not a tile: this lake, this river, the ground. Not one shell for each square of grass (tens of thousands, and the heat problem back).

## Where we stand (gate rule `ecs`, X112, Nov 13)
- 309 places in code ask a thing its name. 7 ticks no law asks for (Carry, Health, Hire, Repair, Research, Take, Yield). Both counts may only fall.
- Not shells yet: menus, jobs and states, land and water, the tap, the ring.

## The steps
1. This page, agreed.
2. The gate counts the drift and lets it only fall. DONE Nov 13 (L1).
3. Jobs and states as ticks, in a book, with their priority. The 121 job names in code become questions to the tick.
4. The tap law and the ring law, each once, for units, finds, buildings, research and menus.
5. Menus as shells: the menu grammar, with Albert.
6. Land and water as shells with layers.
7. The 7 dead ticks: wired to a law or cut (logged in Parked).
8. Each step: tests written against the law (not against Mid), the code and both counts smaller after than before, Albert's play.
