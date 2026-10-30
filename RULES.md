# First Keep: the rule book (Oct 30, 2026; Build 64 on the preview)

One home for how this game is built and how the work is done. Every build is checked against it. Where an older note disagrees, this file wins; where Albert restates a rule in the moment, his words win.

## 1. Albert's build values (his words, gathered Oct 24 to Oct 29)
- Simple is better. Elegant. Honest. Transparent. Simplicity sells. Logic above all.
- Don't use more words than you need. Don't use fewer words than you need.
- Grounded in science, nature and history. When in doubt, real life rules overrule everything. If nature solved it, don't try to do it better. Fake only when it is right, and say so.
- Everything has to live in one place. We don't do things twice: do it once and point to it. One home, central, with the skins and the screens pointing to it.
- We use what we can. Whatever can be standardized is standardized; optimized is optimized; reused is reused; kept static is kept static. Anything that can become a module, element or overlay to run lean, should.
- Smaller is better. Always seek optimization. Merge where possible, cut bloat, keep the code light, tidy and clean.
- No patches, no fixes on top of fixes: tear apart, rebuild, make sure everything is perfect. Find the common denominators.
- An exception to the logic does not redefine the logic. An anomaly is builder error, not logic error.
- Patterns are in threes. Alliteration. Modular. Uniform: one standard, one mold.
- Colours, shade, tint, rings and toggles for variables, to keep the visuals light.
- Intuitive. Coherent, cohesive, with an identity. Consistent colours, style, language and grammar. Universal language.
- Fair for all. What's good for the goose is good for the gander; if it is unfair, it is out. Pay to help, never pay to win.
- Treat users like family. Honest, with integrity.
- Don't skimp on the compute: use as much as you need.
- Nothing goes away until resolved: a shelved problem or a postponed feature stays on the list until it is solved or deliberately removed.
- "I build to match life. They decide." Whether a player chooses war, trade, the Games or growth is theirs, not ours: every path must work as well as the others under the same rules.
- "You can't have alerts if you can't see or hear them." What a player knows comes from sight, hearing or a messenger.
- "I like tech." The research tree stays deep; clutter is answered by showing things when their age comes, not by cutting.
- Wherever code can be replaced with the established, recognized equation that matches the real world, use it (Oct 30). Where the equation does not fit the game (its scale, its clock), say so and flag it rather than fake it.
- "One could always reason that life isn't fair because random isn't fair. But life isn't a choice. The game is. So it's correct to make it fair without sacrificing truth." (Oct 30.) Fair is not mirror: mirror is illusion, reality is random. Fair is the same constants and the same randomizer for every side, measured (the walks and the villager-minutes to the next age, `fairness()`), with everything else random.
- When one change answers more than one question while being closer to reality, that is the goal of the build rules (Oct 30). Prefer it over several small answers.
- The vocabulary (Oct 30): a **module** is a menu or a mold (the one row's slot, a card size); an **overlay** is the words laid on it; an **element** is the thing itself, made of modules and overlays. Element + random = output, with one randomizer for everything random.
- "Real life is the beat." (Oct 30, on the preview of Build 63.) No music. The sounds are the work itself: a stroke sounds when a stroke lands, at the find's own rate, so crews fall into rhythm on their own, and the birds and wind sit on top at random. It plays like meditation; it stays that way.
- The colour code for every game (Oct 30): **blue** available, act on it now (it is your choice: an ally on the crosshair asks "are you sure"); **white** all is well; **green** active, on, or done right; **red** something wrong; **gold** the chosen thing. Numbers fade on one gradient: red, pink, white, light green, green (cost rows by distance from enough; store and job counts by velocity). Colour is never alone: an icon or the number says the same thing. A state is a ring and a glow, never a fill (Albert, Oct 30).
- The bottom row is static (Oct 30): it is the most important row in the game and never moves, shrinks or is covered. Everything else grows upward from it, on its six-column mold, one row, two rows or full height. Its first slot holds the door: the most important thing now, in the colour code; a tap swaps the row's page to the one that deals with it, and always leads back to Jobs in one tap.
- One job per control (Oct 30): a button is a button and an indicator is an indicator; a button that also flashes for an emergency becomes a second element and is built as one (the door).
- Muscle memory (Oct 30): the same tap in the same place does the same thing. The map tap puts the sword, then All, under the thumb: tap one the screen, tap two the sword, tap three All.

## 2. How a change happens
1. Talk first. Bottom line up front. Lists when he has to scan. Neutral pushback, no flattery; say when unsure; ask when unclear; never act when unsure.
2. Explain plainly. When Albert says "I don't understand", say it again in everyday words, with an example from the game, before anything else.
3. Make the list of changes, in his words. Mark anything that bends a rule and name the rule. Keep pitching good ideas that break a rule, flagged.
4. Build only after his double yes. His standing vote on a list is "do all", with exceptions he names. Mockups and measurements need no yes and come before a build.
5. One build per agreed batch, one gate run, one push. No build per tweak.
6. Preview only. Live only on his explicit word.
7. Every cut, trim, kill or replacement goes in `CUTS.md` with what went, what replaced it and why. The parked list at its end holds ideas kept for later.
8. Mid-build asks from Albert are taken into the build in progress when they fit the agreed list; anything bigger is answered in a message and put on the to-do list.
9. Albert switches models; say so before suggesting a switch.

## 3. The rebuild method (how new replaces old; the no-patch rule in practice)
1. Find every home the element has today. Name them.
2. Write the new element once: one module, one table at its top, from the established equation or the record, with its source cited at the line.
3. Delete the old code completely. No wrapper, no "if new then old", no second copy. Every caller points to the new home.
4. Migrate the save (`MIGRATE` in `34-save`) so older games still load.
5. Log the removal in `CUTS.md`.
6. Measure before and after: the gate, the soak, the balance harness, a screenshot looked at. Then one build, one push.

## 4. Finding a problem (the anomaly rule in practice; Build 59)
- Do not guess a cause to have an answer. Measure first: `tests/probe.py` logs what each computer side does every five minutes (jobs, store, saving, spending by reason); `tests/balance.py` measures the whole game over many seeds.
- A stall is a chain of causes. Fix the one the numbers show, measure again, and follow the next. Build 59 found five this way (farms counted three a field; saving windows that reset; age caps in a table; lost scouts and caravans replaced while saving; a job mix blind to what the age costs).
- A fix that moves one number can break another. Read the whole harness report after every change (Build 59's forager rule cut the stall and quadrupled crowding until the crowding term went in).
- Say what was not done and why, with the measurement (Build 59: batching strokes saves nothing because figures are cached sprites).

## 5. Science, history and math
- Every number that stands for the real world has one of three labels in `SCIENCE.md`: **verified** (checked against the source this session), **cited** (a standard value from a known source, to spot-check before live) or **design** (a choice inside a measured boundary, said plainly).
- Every equation is the established, relied-upon form, named with its source, and has a test in `tests/science.py` against known values so it cannot drift.
- Use one form for one kind of question. A choice of where to spend effort is a rate of return: what is gained over the time it costs, discounted by risk. The villager's find (the forager's rate, Charnov 1976) and the soldier's foe (the attack-value rule, Churchill et al. 2012) are the same shape on purpose.
- Random "when" is a Poisson process (`nextIn`, `hazard`); odds of a fight are the square law (`lanchester`); a thing that settles toward a level is a first-order lag (wetness, the market's stock, spoilage).
- History text gives dates ("about" unless exact), credits more than one place where the record allows, and says where historians disagree. Where the game compresses history, the note says so with a "Game:" line. `tests/history.py` holds every dated research step inside its age or demands that note.
- Safety limits are kept: at most three light flashes a second (WCAG 2.3.1); Reduce motion honoured. The lightning keeps its 0.34 s gap.

## 6. Code structure
- `src/` joined in filename order by `build.py`; it refuses syntax errors, duplicate top-level names, comments that swallow code, and a research id used twice. Rules (numbers only) in `01` to `06`; every word in `07`; state and helpers in `08`; the simulation in `09` to `17` and `36` to `40`; the view in `18` to `25`; touch and cards in `26` to `33`; save in `34`; sound in `35`; boot and the test hook in `41`.
- The simulation is deterministic from the seed: no `Math.random`, no clock, in simulation files. The view may use both.
- One record per thing (`BLD`, `UNIT`, `TECH`, `CIVS`, `EVENTS`, `WEATHER`, `FINDS`, `PEACE`, `SCENARIOS`, `TELL`, `FORAGE`, `PRICE`, the dial tables, the verbs). New words go in the tables, never inline twice.
- One home for every coin: every resource in or out goes through `earn` or `spend` with a reason (the ledger).
- What the screen shows is read from the rules tables (`showByAge` reads the first age anything costs a resource), never a hand list.
- One font, three text sizes (12, 15, 19). Dark, flat, every button with air around it. Taps 44 px and up. Text 12 px and up. Contrast 4.5:1 and up (7:1 the target). No apostrophes in game words. Toasts and tips ten words at most. A card fits one page at 390 × 844.
- The screen grammar (Build 41): every new control goes in one of the four places (the top pill, the strip, the bottom row, a corner button) or it does not go in. The play screen keeps to `UI_BUDGET` (33) always-visible buttons; a new one replaces one.

## 7. Tests (before any push)
```
python3 build.py && python3 wrap.py && python3 tests/gate.py        # the gate; it also runs tests/science.py and tests/history.py
python3 tests/soak.py 1,2,3 20                                       # long games; the save's size and a frame's time
python3 tests/balance.py --seeds 12 --minutes 40 --jobs 3            # when a rule or number moved
python3 tests/probe.py 1,2 40                                        # when the computers misbehave
```
The play fingerprint (`tests/baseline.json`) must match, or the change is accepted on purpose with `--accept "why"` and the reason logged. A test must be able to fail: measure the real thing. Look at every screenshot yourself before showing it.

## 8. Records, every build
`CUTS.md` (the build's section, with the harness before and after), `HANDOFF.md` (what stands, the to-do list, what is up in the air, decisions), `GUIDE.md` regenerated from the game (`F.guideMd()`), `SCIENCE.md` when a number rests on the science. Commits as Albert (`acohen2300@users.noreply.github.com`; the repo is public), with the session's trailers. If a session must stop mid-build, commit the source as "work in progress" without publishing.

## 9. Things that went wrong before (don't repeat)
- A caravan's raw load crashed the game for seven builds because the goods table was read for a raw key (Build 45 to 52): one home means one lookup (`baseOf`, `nameOf`, `colOf`, `giveTo`).
- A danger map that survived into the next game: reset state on a new game.
- A screenshot test taken with the fog on reads as a black screen: turn the fog off for pictures.
- Saying "two research steps touch the tower" when seven did: count before stating.
- The science test existed for four builds but the gate never ran it (fixed in 58): check that a new test is actually called.
- Two research steps shared an id with older ones, so the new ones were unreachable (Build 57): the build now refuses it.
- A comment in the code counted three workers to a field while the rule said one (Build 59): a comment is not the rule; read the function.
- A new helper named like an old one (`worth`, `chance`): the build refuses duplicates; pick a name that says what it is (`forage`, `hazard`).
- Making a hidden fold visible pushed a card past one page (Build 59): measure the card at every size after any change to it.
- The lightning: keep its flash gap (0.34 s). Albert likes it as it is.
