# Checks - v80 - Post Clean - Working
*Made Oct 31, 2026. What is checked, when, and what stops a build. Changed only with Albert's word. The code and test pointers below are as of v70 and move with the v80 build.*

## The order of work (people before code)
1. **A list first.** Every change is written as a list and shown to Albert.
2. **Pictures before code.** A screen is drawn and agreed as a mockup first.
3. **A double yes.** Nothing is built until Albert says yes twice ("yes yes").
4. **Builders in separate copies.** Each part is built in its own copy (a git worktree and branch). The builder leaves notes, a draft for the cuts log, and its open decisions. Nothing joins the main copy until it passes every check below.
5. **Preview, then live.** A build goes to the preview link only. It goes live only on Albert's word.
6. **Stamps.** Every published build gets a version stamp (a git tag), so any build can be reopened exactly.

## Before every preview (all automatic; any failure stops the publish)
`publish.py --preview` runs these in order and stops at the first failure: nothing is copied, committed or pushed.
1. **The build** (`build.py`, `wrap.py`): the game and its native copy.
2. **The gate** (`tests/gate.py`), at four phone sizes (375 × 667, 390 × 844, 393 × 852, 430 × 932):
   - **Layout, on the play screen and every card:** no page errors; nothing wider than the screen; every word inside its button; text at least 12 px; contrast at least 4.5:1; no card needs scrolling from 390 × 844 up; every tap target at least 44 × 44 (except the named half slots, exception #2); no card cell grows past its rank.
   - **Fit:** every message fits the preview at 375; every card title fits its slots; every word a row slot can show fits; every name fits a double-wide slot on one line.
   - **The quick action:** opens under the finger, flips near an edge.
   - **Taps do what they say:** a scripted player taps through the game (build, train, queue and cancel, sell, the quick action, Emergency, the squad) and every tap must do its job.
   - **Events do what they say:** Town square, All hands, Shelter, Stop.
   - **The fingerprint:** five minutes of a recorded game must play out exactly as the baseline. Any change to how the game plays fails it. A deliberate rule change is accepted only with a written reason.
   - **The map's base rules** hold on ten seeds (four corners, clearance, home resources, the Throne central).
   - **The button budget:** the play screen shows at most 33 buttons.
   - **Words:** every button verb has a handler; toasts and tips are 10 words at most; no raw code on any card; every guide entry says why; buildings tell apart at half zoom.
   - **Sub-checks:** science (each equation against its source), history (each research step in its age), tables (the rule tables hold together), palette (every colour by its name in the colour index, the text sizes and the timings).
3. **Lint** (`tests/lint.py`): no undefined names, duplicate keys or unreachable code.

## Before each merge and at a version's close (run by hand; results go in the cuts log)
- **The soak** (`tests/soak.py`): 3 seeds × 20 minutes, Hard, every hazard. Fails on any error, any impossible number, any resource below zero. Save size recorded.
- **The balance harness** (`tests/balance.py`): the computers in all four seats over many seeds. A measuring tool, not a pass or fail. Run when a game rule changes.
- **A cold review** at the close: one reviewer who has not seen the work compares what was agreed with what was built.
- **Size:** source lines and built bytes, before and after, in the cuts log.

## The lock
- **Live is locked.** A push is refused unless the live page is exactly a build the gate passed (a fingerprint of the file, stored by `publish.py`; checked by a pre-push hook). A push by hand is refused too.
- **Previews** run the full gate every time but do not move the live lock.
- **Albert's "locks"** (locking settled parts so a later session cannot change them without his word) are an open item on the v80 list, not built.

## The records every build keeps
- **CUTS.md:** every change and every cut, per build, with the checks' results.
- **EXCEPTIONS.md:** every place the game knowingly bends its own rules, with Albert's yes.
- **The builders' notes:** what was built, open decisions, rules bent.
