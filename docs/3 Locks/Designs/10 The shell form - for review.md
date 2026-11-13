# Design 10: the shell form, redone for review (Claude, from Albert's Nov 13 17:24-17:36 words; NOT ruled, NOT built)

Design 09 keeps his words as he said them. This page is the cleaned proposal. Every line here waits for his word.

## 1. Three kinds of thing, not one
1. **World shells:** things on the board. Units, animals, buildings, finds, and bodies of land and water (this lake, this river, the ground).
2. **Screen shells:** things on the glass. Menus, cards, rows, buttons, rings.
3. **Information:** lives in a book and is applied to shells. Numbers, words, colours, sprites, sounds, research, states.
- Why: a form built for mass, gravity and movement gives a menu forty zeros. Research does not sit on the board; it changes a shell's answers. Forcing all three into one form is the over-build.

## 2. The answers
- A slot holds **1, 0, or an index** into a book. Nothing typed.
- Slot numbers are permanent. New slots go on the end of their section; a retired slot stays empty.
- Answers are set **by group** (all buildings, all foot soldiers). A shell lists only where it differs from its group.
- A **law** names the slots it needs and runs on every shell with a 1 there. Written once.

## 3. The world form (9 sections)
| Section | Slots | Answer |
|---|---|---|
| A. Identity | name; index code; group; side it belongs to | index |
| B. Form | sprite; size (height, width, footprint); mass; colour; sound | index |
| C. Place | layer; blocks walking; blocks sight; always visible | index, then 1/0 |
| D. Life | made by (who or what); cost; ends; ends by (used up, killed, burned, expires); comes back or grows | index and 1/0 |
| E. Movement | moves by itself; can be pushed; can be carried; held back by (water, woods, walls, slope) | 1/0, then index list |
| F. Touch | tappable; has a card; can be worked (and by how many); can be attacked; can be entered | 1/0 and index |
| G. Abilities | spawns others; researches; gathers; builds; repairs; fights; shoots; heals; stores; shelters; trades; and the rest of today's 53 ticks | 1/0, each one a law |
| H. Governed by | ground and slope; weather; fire; hunger; tiredness; nerve; day and night | 1/0, each one a law |
| I. States | which states it can be in: working, moving, resting, fighting, fleeing, inside, being built, burning | 1/0; priority sits on the state, in the States book |

## 4. The screen form (short)
Mold (which arrangement of the six slots); rows; cells (single or double); words (index); icon (index); what a tap does (index to an action); ring (1/0); opens from (index). To be worked out with Albert as the menu grammar.

## 5. What changed from his list
**Kept:** one questionnaire per kind; 1, 0 or index; nothing typed; a slot groups shells for a law; one line changes every shell with a 1 there.
**Added (he asked for what he forgot):** group and "differs only"; side; sound; cost; blocks walking and blocks sight; can be worked, attacked, entered; states and their priority; hunger, tiredness, nerve under Governed by.
**Removed:**
- "Exceptions": by his own rule an exception means the logic is wrong. A 0 already says "not governed by".
- "Does math apply / does physics apply": everything with a number uses math. Replaced by the named laws in section H and index pointers.
- "Impacts which shells, first and second degree, by index": goes stale with every new shell. A law names a slot instead; a script prints who is reached.
- The three repeats of "does it move".
- Adding up the whole form into tiers: every yes counts the same, so the total says little. Parked until a use needs it.

## 6. What this does and does not do
- Does: gives every behaviour one home; stops asking things their names; makes drift checkable by the gate.
- Does not: write the laws. Each law is still work. Code only shrinks where several things share one law.

## 7. How to apply (measured, one slice at a time)
1. Paper test, no code: fill the form for a berry bush, a villager, a lake, the Town Center and the Build menu from today's books. Mark every slot the books cannot answer.
2. Slice one: the States book (section I). The 22 job names leave the code; priority moves there.
3. Measure after the slice: game code size, the gate's two drift counts, bugs found. Go on only if they moved.
4. Then, in order: Abilities and the dead ticks (G); Touch, which is the tap law and the ring (F); land and water as shells (C, D); the screen form with Albert.
