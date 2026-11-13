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

---

# The shell form (Albert, Nov 13 17:24-17:36, stream of consciousness; his words, sorted, not yet built)

"If everything is a shell: first thing is how do we define anything in the world?"

## The questions (every shell answers every one)
1. **Identity:** What is it called. What is its unique index number.
2. **Form:** What is the shape. The mass. The colour. The height. The width. Sprite index number.
3. **Place:** What layers does it live over. What layers live over it. Is it always visible.
4. **Movement:** Does it move. Does it move on its own (self). Does it move from an action (caused by). Does it move from usage. How does it move. What direction does it move. In what dimensions can it move. In what direction does it grow. In what direction / dimension is it blocked from movement. What restricts movement: list restriction index.
5. **Life:** Does it spawn. Who spawns it. How is it made. Does it always exist. Does it cease to exist. How does it cease to exist. What impacts its existence. In what way does its existence get impacted. Does it evolve.
6. **Interaction:** What does it interact with. Is it tappable. Does it have a card. What layers does it impact. What shells does it impact in the first degree: list shell index. What shells does it impact in the second degree: list shell index.
7. **Abilities:** Does it spawn others (spawn things). Does it have tech: tech index numbers. Does it act: action index numbers.
8. **Governed by:** Math? (math index). Physics? (physics index). Friction? Gravity? Weather? Movement? Actions? What are the exceptions.

## The answers (his rulings, 17:30-17:36)
- An answer is points or an index. **Yes is 1 point. No is 0 points.** An index points into a book.
- **No answers are typed.** A position holds a 1, a 0, or an index that exists. The only typing is inside a book, once.
- "A string can define a thing by sequence. You can also add it up. You can also group by index."
  - The sequence of 1s and 0s defines what the thing is.
  - The sum gives tiers: "0-10 points get x, 11-20 points get y".
  - "If you give the answers indexes and points you can group them by common attribute and apply ticks in groups."
- "All the shells that have a 1 in slot 3 get a new math equation": a law names a slot; changing it changes every shell with a 1 there.

## Claude's notes (not rulings; for Albert's word)
- Slot numbers are permanent: new questions go on the end, a retired slot is left empty, never reused.
- "Exceptions": his own rule says an exception means the logic is wrong. Either it means "not governed by X" (a 0, no slot needed) or it should become a new tick. Open.
- Impacts by index go stale as shells are added: list by slot ("everything with a 1 in Burn"); let a script derive the second degree.
- Every yes counts the same, so a whole-form sum measures how much a thing does, not its worth: for cost or priority, sum one section.
- Missing from the list: its state now (working, walking, resting) and its priority.
- Answers set by group; a shell states only where it differs from its group.
- Test before building: fill the form for a berry bush, a villager, a lake, the Build menu and one research; where the form cannot describe one, the logic needs to be better.
- Real-world models: Entity-Component-System archetypes (things with the same answers stored and run together); taxonomy by shared traits; points-costed units in tabletop war games.
