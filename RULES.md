# First Keep: the rule book

The one home for how First Keep is built. Every build is checked against it. Gathered from Albert's words (his build guide, the Albert Labs values, his rules restated Oct 28 and Oct 29) and SoRen's rule book where he set the same rule there.

## How we work
- Talk it out first. Make a list; build only after Albert's double yes. Mockups and demos need no yes.
- Mockups first, then everything at once: one build per batch, one gate run, one push. No build per tweak.
- Preview only. Live only on Albert's explicit word.
- Honest, open, transparent. No flattery. Neutral pushback: the goal is the best product, not his approval. Say when something is not right, flag when unsure, ask when unclear, do not act when unsure.
- Keep pitching good ideas, even ones that break these rules, and say which rule they break.
- Research and make design, art and sound calls ourselves; do not send him to "hire an expert".
- Break a problem apart: is it a real problem for this game, or one inherited from others (app norms, genre habits)? Reassemble and solve for this game.
- Analyse by element, not by interaction: does it exist, why, where is its one home, where else can it be reused, reskinned.

## How we build
- Always the simplest possible design. Smaller is better. Simplicity sells. Logic above all.
- No patches, no fixes on top of fixes. Tear apart, rebuild the simplest, clearest, leanest way, and find the common denominators.
- Everything has ONE home, central, with the skins and the screens pointing to it. We do not do things twice: do it once and point to it.
- Whatever can be standardised is; whatever can be reused is; whatever can be kept static is; whatever can be optimised is; whatever can be a module, an element or an overlay is.
- Merge where possible. Cut bloat. Keep the code light, tidy and clean.
- An exception to the logic does not redefine the logic: an anomaly is builder error, not logic error.
- Always seek optimisation; do not skimp on what the work needs.
- Replacing a system means: find every current home of it, write the new one once (one module, one table, sources at its lines), delete the old completely (no wrapper, no second path), point every caller to it, migrate the save, log the cut, measure before and after.

## What it is made of
- Grounded in real-world math, science, physics, history, research. When in doubt, real life rules. If nature solved it, do not try to do it better.
- Every number is labelled: verified (checked against a source), cited (a standard value still to spot-check) or design (a choice inside measured limits). Where the game compresses reality, the history note says "Game:".
- Every equation is a known, relied-upon one, cited at its line, with a gate test against known values.
- Fair for all: what is good for one side is good for every side. If it is unfair, it is out.
- Pay to help, never pay to win.
- "I build to match life; they decide": war, trade, the Games and peaceful growth must each be a real way to play and to win, under the same rules.

## How it looks, reads and feels
- Elegant, concise, streamlined, uniform: one standard, one mold. Static elements.
- Logic and flow work. Intuitive. Smarter, better, faster, safer.
- Fewest words needed, never fewer than needed. Universal language.
- Coherent and cohesive, with an identity. Consistent colours, style, language and grammar.
- Patterns in threes. Alliteration where it helps. Modular.
- Colours, shade, tint, rings and toggles carry variables, to keep the picture light.
- Treat players like family. Honest, with integrity.
- One font, three text sizes. Change shapes before colours.

## Records
- Every cut is logged in `CUTS.md` with what replaced it, and parked ideas stay listed.
- Nothing goes away until it is solved or deliberately removed.
- Ruthless quality control: the gate (`tests/gate.py`), the long games (`tests/soak.py`), the balance harness (`tests/balance.py`).
- Commits as Albert's noreply address (the repo is public), with the session's trailers.
