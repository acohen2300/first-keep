# First Keep: the rule book (Oct 29, 2026; Build 52b on the preview)

One home for how this game is built. Every build is checked against it. Where an older note disagrees, this file wins; where Albert restates a rule in the moment, his words win.

## 1. Albert's build values (his words, gathered from Oct 24 to Oct 29)
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

## 2. How a change happens
1. Talk first. Bottom line up front. Lists when he has to scan. Neutral pushback, no flattery; say when unsure; ask when unclear; never act when unsure.
2. Make the list of changes, in his words. Mark anything that bends a rule and name the rule. Keep pitching good ideas that break a rule, flagged.
3. Build only after his double yes. His standing vote on a list is "do all", with exceptions he names. Mockups and measurements need no yes and come before a build.
4. One build per agreed batch, one gate run, one push. No build per tweak.
5. Preview only. Live only on his explicit word.
6. Every cut, trim or replacement goes in `CUTS.md` with what went, what replaced it and why. The parked list at its end holds ideas kept for later.
7. Tell him before switching models. He switches them.

## 3. The rebuild method (how new replaces old; the no-patch rule in practice)
1. Find every home the element has today. Name them.
2. Write the new element once: one module, one table at its top, from the established equation or the record, with its source cited at the line.
3. Delete the old code completely. No wrapper, no "if new then old", no second copy. Every caller points to the new home.
4. Migrate the save (`MIGRATE` in `34-save`) so older games still load.
5. Log the removal in `CUTS.md`.
6. Measure before and after: the gate, the soak, the balance harness, a screenshot looked at. Then one build, one push.

## 4. Science, history and math
- Every number that stands for the real world has one of three labels in `SCIENCE.md`: **verified** (checked against the source this session), **cited** (a standard value from a known source, to spot-check before live) or **design** (a choice inside a measured boundary, said plainly).
- Every equation is the established, relied-upon form, named with its source, and has a gate test against known values so it cannot drift.
- History text gives dates ("about" unless exact), credits more than one place where the record allows, and says where historians disagree. Where the game compresses history, the note says so with a "Game:" line.
- Safety limits are kept: at most three light flashes a second (WCAG 2.3.1); Reduce motion honoured.

## 5. Code structure
- `src/` joined in filename order by `build.py`; it refuses syntax errors, duplicate top-level names and comments that swallow code. Rules (numbers only) in `01` to `06`; every word in `07`; state and helpers in `08`; the simulation in `09` to `17` and `36` to `40`; the view in `18` to `25`; touch and cards in `26` to `33`; save in `34`; sound in `35`; boot and the test hook in `41`.
- The simulation is deterministic from the seed: no `Math.random`, no clock, in simulation files. The view may use both.
- One record per thing (`BLD`, `UNIT`, `TECH`, `CIVS`, `EVENTS`, `WEATHER`, `FINDS`, the dial tables, the verbs). New words go in the tables, never inline twice.
- One font, three text sizes (12, 15, 19). Dark, flat, every button with air around it. Taps 44 px and up. Text 12 px and up. Contrast 4.5:1 and up (7:1 the target).
- The screen grammar (Build 41): every new control goes in one of the four places (the top pill, the strip, the bottom row, a corner button) or it does not go in. A new always-visible control replaces one.

## 6. Tests (before any push)
```
python3 build.py && python3 wrap.py && python3 tests/gate.py        # the gate, four iPhone sizes; add --soak for the long games
python3 tests/balance.py [--seeds N] [--minutes M] [--html file]     # the balance harness, when a rule or number moved
```
The play fingerprint (`tests/baseline.json`) must match, or the change is accepted on purpose with `--accept "why"` and the reason logged. A test must be able to fail: measure the real thing.

## 7. Records, every build
`CUTS.md` (the build's section), `HANDOFF.md` (what stands, the queue, open items), `GUIDE.md` regenerated from the game (`F.guideMd()`), `SCIENCE.md` when a number rests on the science. Commits as Albert (`acohen2300@users.noreply.github.com`; the repo is public), with the session's trailers.

## 8. Things that went wrong before (don't repeat)
- A caravan's raw load crashed the game for seven builds because the goods table was read for a raw key (Build 45 to 52): one home means one lookup (`baseOf`, `nameOf`, `colOf`, `giveTo`).
- A danger map that survived into the next game: reset state on a new game.
- A screenshot test taken with the fog on reads as a black screen: turn the fog off for pictures.
- Saying "two research steps touch the tower" when seven did: count before stating.
- The lightning: keep its flash gap (0.34 s). Albert likes it as it is.
