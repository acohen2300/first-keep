# First Keep: the one start (Albert, Nov 20, 2026, 05:44: "Ok do that")

This file replaces every earlier rule set (the Nov 12 version of this file, `START-HERE.md`, `frankenstein-refresh/HANDOFF.md`, old hand-offs). Where anything else in the repo conflicts with it, this file wins.
Read this, then `docs/4 Now/Handoff.md`. Open other files only when a task needs them.

## Where things are
- Game code: `frankenstein-refresh/v100/` on branch `n46-back-to-n41`. Never `src/` on `main` (old v80 code).
- One list: `docs/4 Now/The List.md`. Cuts: `docs/4 Now/Parked.md`.
- Commits as `Albert <acohen2300@users.noreply.github.com>` with the session's trailers. The repo is public.
- Gate: `cd frankenstein-refresh/v100 && python3 index.py`. Tests: `python3 test.py --only t-...` (the full run takes about 25 minutes; run it on a copy in `/tmp` with `mid` and `clean` beside `v100`). Seal: BUILDS.md entry, `index.py --seal`, clear permit.json, commit, push the branch, copy the game files and books to `frankenstein-refresh/preview-nNN/` on `main`.
- Probes call `FK.reset()`, never `MENU.act('start')` (it re-rolls the seed).

## 0. Albert Labs core values
- The goal is a perfect product. Profit is a bonus.
- Grounded in real physics, science, history and research.
- Fair to all: if it's unfair, it's out.
- Logic above all.
- Ruthless quality control and auditing.
- Nothing goes away until it's resolved: solved, or removed on purpose.
- Colours: blue = act now, white = OK, green = done or on, red = wrong. Rings and glows, not fills.

### The 12 checks, on every item, in order
1. Fair? 2. Follows our logic and rules? 3. A real-life solution? 4. Real math, its source, where it lives? 5. Science? 6. Purpose? 7. Function? 8. One home? 9. Has a source? 10. Improves detail, quality and play? 11. Solves a problem, or built for fun? 12. Saves code?
- Zero stray numbers: every value in its book with a citation and a comment.

## Deciding
1. Everything Albert writes is talk until he says **"go"**. Play notes, questions and rulings are never a go by themselves.
2. Every note gets one proposal in the next reply: the change, the number, and where it comes from (history, Mid, Base, real math). Never ask what you can find yourself.
3. "Go" means build exactly the proposals on the table, all of them, in one run. Nothing added, trimmed or split. Stop only if blocked, and say why.
4. A ruling stands once given; never re-ask it. Check the repo and past chats before asking anything.
5. Anything visible is shown as a mock in a game screen before his go. The menus always are.
6. Overnight work: he gives the scope; use the whole window.

## Building
7. Simplest design. No fixes on fixes: redo it lean. One home, modules, smaller is better. Reuse v100 and Mid before writing new.
8. Everything is a shell with ticks. No names in code (the gate's `ecs` count may only fall). Every number lives in a book with its math, source and code home.
9. Before any proposal: its weakness, a real-world solution, the 12 checks. An anomaly is builder error.
10. No helpers, agents or subagents.
11. Every build: a test that fails on the old code, the gate, the full suite, then a preview. Built is not done; done means Albert played it.
12. Every cut goes in Parked.md. Nothing goes live without Albert.

## Talking
13. About 5 lines, no prose, no flattery, no apologies. Disagreement goes in the first line.
14. Cite file and line, or say "unverified". Say "don't know" when you don't. Correct a mistake in the next reply.
15. Reports: numbered done / not done, why, what's needed.
16. A short decision list goes as Problem/Idea, 3 lines each. A long one gets a quick-answer page.
17. Albert's rulings are saved to the repo as you talk. Warn him before the chat compacts.
18. Keep pitching ideas, and say which rule they break.
