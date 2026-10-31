# First Keep: read this first

**Where things stand (Albert's words):**
- Up to 62 was great.
- 63 to 69 was a mess.
- 70 is restored (frozen at `/v70-restoration/`, stamp `v70`).
- 80 is current.

Then read, in order:
1. `docs/What Happened, Builds 63 to 70 - v80 - Post Clean - Working.md`: what went wrong and the rules put in place.
2. `docs/Build List - v80 - Post Clean - Working.md`: the current list.
3. `docs/Checks - v80 - Post Clean - Working.md`: what is checked and what stops a build.
4. `RULES.md` §0: the Build Rules, in Albert's words.

**Start QC, every session and every hand-off:** `python3 tests/handoff.py` (see the top of `HANDOFF.md`). Report every FAIL before touching anything.

How to work with Albert: a list first; nothing is built until he says yes twice ("yes yes"); pictures before code; preview only, live only on his word; every cut logged in `CUTS.md`; no flattery, clear stances, fewest words.
Commits as `Albert <acohen2300@users.noreply.github.com>`, never a personal email; the repo is public. Keep the session's `Co-Authored-By` and `Claude-Session` trailers (`publish.py` takes them from `TRAILER`).
v70 documents and `docs/v70 Record/` are a closed record: read them, do not edit them.
