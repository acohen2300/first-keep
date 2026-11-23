# First Keep — Rules

Read this before any work. Nothing else is required reading.

## Code

1. One home for everything. No copies. No measured or chosen number in code; 0 and 1 for counting are allowed.
2. Shared parts first: group what's common, reuse before writing new.
3. Real-world math and science by default. Frame rate and playability win ties.
4. Real numbers are cited and indexed. Balance numbers are marked as tuning, with the reason.
5. Fit problems to the system. If it won't fit after two tries, review the system.
6. Rebuild the smallest broken part. No patches on patches.
7. The fix is simpler than the problem.
8. Static wherever possible.
9. Clean and clear. Tight and right. Lean and mean. Simple and elegant. Never oversimplified.
10. Nothing new unless we both agree.
11. Tests check the rules, not just the build. Untouched code is proven untouched by diff.
12. Patterns everywhere: same logic, same menus, same colours, same words for the same thing. Default to sets of 3; break it when the content needs it.

## Workflow

- Talk and build are separate. Nothing is built until Albert says "build".
- One build between previews. Each change inside it is its own commit, so one can be undone without the rest.
- Each build starts by writing `tools/build.txt`: the commit it starts from, then every file it may change. The check fails if any other file changed (rule 11).
- No changing a call mid-build. A changed call goes in the next build.
- Before publishing: `python3 tools/check.py` must print PASS. `python3 tools/publish.py "what it is"` runs it and puts the build on the phone at `/first-keep/fresh/`.
- No helper agents unless Albert asks for one.
