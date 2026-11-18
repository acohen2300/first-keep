# Audit, Nov 18 (N70, branch n46-back-to-n41): the 12 core values + the code attitude test
Albert asked for this at 17:17, from dinner. Read only: nothing in the game changed. Measured by scripts on the sealed N70 (gate PASS, 0 modified).

## Measures
- Game code (scripts): 653,949 bytes. index.html 301,109 · menu.js 133,454 · econ.js 119,927 · combat.js 65,500 · ai.js 27,519 · sound.js 6,440. Mid 1,402,247, Base 1,345,127.
- Books 932,752 bytes; v100 markdown (BUILDS, INDEX, COMMENTS, MASTER, CITATIONS…) about 1.8 MB. The Comments book (215,668) is bigger than menu.js.
- ecs: named 293 (ceiling 293), named2 32 (32), dead ticks 6 (6): Carry, Repair, Health, Yield, Take, Hire. Flat since N67.
- Size over the last three builds: menu.js 124,190 → 133,494 (+9,304), all sealed under grants. CLAUDE.md 6 says a build that grows the code is not sealed.
- Tests: 55 of 101 fail at the N70 baseline (Handoff).

## The 12 core values
1. Fair: unverified in code. Open: H10 (computer economy) held; one computer's +14,000 gold a minute (Handoff, open bug 3).
2. Follows our rules: PARTLY. Gate passes; the size rule is broken by N68 to N70 (grants). ecs counts are at their ceilings, not falling.
3. Real-life solution: in the books (388 citations); not checkable line by line.
4. Real math, source, home: logic files YES (typed numbers: econ.js 1, combat.js 4, ai.js 0). Art NO: index.html "The building art" and "The figures" hold about 3,040 numbers and 424 colours (the gate exempts paint).
5. Science: as 4.
6. Purpose: 6 ticks no code asks for (above); 2 functions nobody calls: YIELD (index.html:1059), bodyOf (index.html:1214).
7. Function: unproven: 55 tests red; his play is the only proof.
8. One home: FAIL in places:
   - idle has 3 meanings: ECON.idlers (econ.js:124: no job, idleU, not inside, not den); idleV (menu.js:247: idle or wait); advise (menu.js:443: no job or idle). `job === 'idle'` is typed 37 times in the code.
   - jobOf is two functions with different meanings: index.html:1122 and econ.js:123.
   - "Something is in the way" is typed 3 times outside the Words book (econ.js:51, menu.js:142, menu.js:335); about 41 English strings sit in menu.js and 5 in econ.js.
   - About 40 SVG icons are typed in menu.js:18 to 40, not in the Sprites book; game lengths (menu.js:12) are typed in code.
9. Has a source: yes for numbers in books.
10. Improves play: his play decides.
11. Solves a problem: yes; each build comes from his notes.
12. Saves code: FAIL for N68 to N70 (+9.3 KB); N67 saved 15.7 KB.

## The code attitude test
- Tight and right: NOT PROVEN. 55 of 101 tests are red; "right" can't be claimed from tests today.
- Lean and mean: the code YES (half of Mid's size). The paperwork NO: books plus notes are about 4 times the code.
- Clean and clear: NO for a reader. 442 lines over 300 characters; menu.js:53 is one 11,606-character line (all the CSS); 52 names are defined in 2 or more places (reach 4 times, spot 3, free 2: scoped, not bugs, but confusing).
- Simple and elegant: half-way. 293 places still ask a thing its name, not its tick; the count hasn't fallen in four builds.
- Shell system: followed in the books and in the gate; not yet in the code's asks (the 293).
- Nothing in code, all in books: true for the logic (econ, combat, ai); false for the art, the icons and about 46 English strings.

## Fixes offered (not ruled; his word needed)
1. One idle law (a tick or one function): remove the 3 meanings and most of the 37 asks.
2. Words: the 46 strings into the Words book, one home each.
3. Icons: menu.js SVGs into the Sprites book.
4. Remove the dead: YIELD, bodyOf; the 6 dead ticks used or cut (log in Parked).
5. Size: no more grants; the next build must come out smaller.
6. Tests: the 55 red ones rewritten or retired, so "right" can be proven.
7. Paperwork diet: the Comments book is bigger than menu.js; a lighter form.
