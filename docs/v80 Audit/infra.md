# First Keep v70: infrastructure, docs, hygiene, privacy, locks (fresh-eyes review)

Repo: /home/claude/acohen2300/first-keep, HEAD 6f757ef, a **shallow clone** (graft at 14abcde, Oct 30 11:19; 70 commits present).
Work copy for running: scratchpad/ag-infra. Not run: gate.py, soak.py, balance.py, probe.py, publish.py.
Run here: palette.py (PASS, 16 names), words.py (PASS, 264), lint.py (rc 0), history.py (PASS, 230 steps, 10 undated), tables.py (PASS), science.py (PASS), verbs() (none missing), a rebuild (first-keep.html sha 1008840d… = v70-restoration/index.html = preview/index.html, so v70 rebuilds byte-for-byte).

---

## 1. Ranked findings

### S1. The live lock does not exist in this clone, and is not a lock anywhere (VERIFIED)
- `.git/hooks/` holds only `*.sample` files. publish.py:21 installs the pre-push hook only when publish.py runs. A `git push` from this clone, now, is not checked.
- Even where installed it is a client-side hook: `git push --no-verify`, any other clone, the GitHub web editor, or `sha256sum index.html | cut -c1-64 > tests/gate-passed.sha` (a tracked, hand-editable file) all pass it. There is no server-side check (no `.github/`; branch protection not checkable from here).
- It guards `index.html` only. `preview/index.html` and the "frozen, never edited" `v70-restoration/index.html` have no guard at all.
- Current state is consistent: `sha256(index.html)` = `ce70544a…` = tests/gate-passed.sha.
- What actually stops a bad push today: nothing but the habit of running publish.py.
- Fix: a GitHub Action on push to main that rebuilds from src/ and fails unless index.html equals the gate-passed sha and v70-restoration/ equals its stamp; plus branch protection requiring it.

### S2. Docs claim checks the gate does not run (VERIFIED)
- `docs/Checks - v80 …md:35`: "checked by a pre-push hook. A push by hand is refused too." False here (S1).
- `docs/Checks…:20`: "Events do what they say: Town square, All hands, Shelter, Stop." gate.py:204-215 tests `square` and `hands` only; Shelter is never run.
- `docs/Checks…:19`: taps cover "… Emergency …". PLAY (gate.py:97-148) never taps Emergency; the Emergency card is only measured for layout.
- `docs/Checks…:22`: map rules "(four corners, clearance, home resources, the Throne central)". gate.py:285-290 checks Throne equidistance, water in clear radius, connectivity. Four corners and home resources are not checked.
- gate.py:246 exempts card `'research'` from the scroll check, but `CARDS` (gate.py:12-15) has no research card: the Research card (a FULL card, 30-cards.js:807) is never measured. Also never measured: ground (Here), node, find, box, info, sound, resume.
- Fix: correct the doc lines, or add the three missing checks; add research/ground/sound to CARDS.

### S3. Tests that pass while the thing is broken (VERIFIED)
- **words.py apostrophe rule** (words.py:99-103): only catches `\'` and possessives inside template lines. Proven with a test file: `say("The keep's walls hold.")` and `say('Albert’s keep stands.')` both pass (`words ok`, rc 0).
- **science.py, tautologies**: several checks never call game logic: `break point` (l.31) checks only the constant `MORALE.breakAt`; `spoil a year` (l.81) recomputes the formula inside the test; `SIR final size` (l.66) iterates its own equation and is skipped unless R0 === 2; `crew of two/four` (l.52) checks a constant. They pass whatever the simulation does.
- **science.py:13, a dead check**: `near('air periodic', …)` sits inside the `//` comment on the same line. It never runs.
- **soak.py save check**: soak.log shows `save 0 kB` with PASS on seeds 1 and 3. After `G.over`, saveGame returns early (34-save.js:171) and the save is cleared (16-sim-fight.js:325), but `readSave()` falls back to `.bak` (34-save.js:288), so "the save of a big game did not read back" cannot fire. The save size rests on one seed (CUTS.md:961 admits it).
- **history.py**: 10 undated steps pass silently (sawpits, pollard, fieldcraft, rites, six elite_*).
- **verbs()** (gate.py:217-225): regex-only. 9+ data-acts built from templates (`data-act="${a…`, `${l…`) are invisible to it.
- **build.py duplicate-name check** (build.py:10-14): it matches only names at the start of a line. Names declared on later lines of a `const a = …,\n b = …` list are not checked (e.g. `STORE` and `keyOf`, 08-core.js:159-160).
- **Contrast** (gate.py:19): the background is the nearest solid `background-color`. Gradients, the conic ring and the canvas map are ignored; text over the map is compared with an assumed `#121715`.
- **Tap exception** (gate.py:29): anything inside any `.h` escapes the 44 pt rule, which is wider than EXCEPTIONS #2's named list.
- **Button budget** (gate.py:293-297): counted on the Jobs page only, in one state.
- **Fingerprint** (gate.py:154-172): it can fail (exact match), but it covers 5 minutes and seat counts only. `--accept` needs nothing but a string, so any session can re-baseline. That is not "like SoRen's locked physics block" (gate.py:152).

### S4. Hard-coded values that will drift (VERIFIED)
- palette.py:44 hard-codes `12px/15px/19px`; RULES.md §6 says v80 agreed 12 and 18. palette.py:20 requires ≥16 names; :37 hard-codes the contrast pairs; :12 hard-codes "UI files" as 26-33 and ≥39 by number.
- palette.py scans only shell-head.html for font sizes. JS sets `ctx.font = '700 12px system-ui'` (39-huddle.js:437): a third font family, unchecked.
- palette.py flags only hex values that equal a named colour. 8 other hex and 2 rgb() literals sit outside `:root` (EXCEPTIONS #11 covers some by description, not by list).
- lint.py:7 hard-codes `/opt/node22/lib/node_modules/eslint/bin/eslint.js`. lint.py:1 says "not part of the gate", but publish.py:30 refuses without it (fail-closed, but the header misleads). no-unused-vars is `warn`, so lint exits 0 with warnings.
- build.py and lint.py write to fixed `/tmp/fk-build` and `/tmp/fk-lint`, so parallel worktree builds collide (the Checks doc's own method, "builders in separate copies").
- build.py:40 takes the build number from the max `## Build NN` in a 217 KB log, so CUTS.md can never be trimmed without moving that.

### S5. publish.py faults (VERIFIED by reading)
- publish.py:34 `git add -A` commits everything not ignored. That is how `tests/__pycache__/gate.cpython-313.pyc` got tracked (.gitignore lacks it).
- publish.py:36 fetches but never merges or rebases, so the fetch does nothing. The push simply fails when behind, after the commit is already made locally.
- The gate-passed stamp is written (l.31) before commit/push succeed. A failed push leaves the stamp and index.html changed locally.
- The trailers are optional (the `TRAILER` env var); nothing enforces CLAUDE.md:16's "keep the trailers". (HEAD's reachable history in this clone is 1 commit, `git rev-list --count HEAD` = 1, because of the shallow graft; the other 69 commit objects are present but unreachable from HEAD.)

### S6. STAMPS.md (VERIFIED where possible)
- v60 60bcdbb4, v61 112f6a31, v62 e7d8fae3: **not in this clone** (`git cat-file -e` fails; shallow at 14abcde). Unverifiable here; the GitHub API was refused (no access).
- v63 d0bcd1f, v64 ed50a4f, v65 5e83812, v70 88b2cb2: present, and dates match.
- v66 8d02473 is "Handoff for a fresh chat…". At that commit CUTS.md tops out at `## Build 65` and preview/ has `BUILD = 65`; Build 66 existed only as WIP e212c89. The stamp marks a handoff, not a Build 66 build.
- STAMPS.md:1 "Every published version" contradicts the v66 row "Never published".
- STAMPS.md:2 "The git tags … exist in the working copy": `git tag` is empty in this clone.
- No src/, build.py or tests/ change since v70 (`git diff --stat 88b2cb25 HEAD -- src build.py tests` is empty).

### S7. Docs: other false, stale or contradictory claims (VERIFIED unless noted)
| Where | Claim | Reality |
|---|---|---|
| HANDOFF.md:25 | "six named colours" | COLORS.md and palette.py: 16 tokens |
| RULES.md:99 (§6) | "One font" | Two embedded families (IM Fell English SC, Barlow Semi Condensed, shell-head.html:21) plus system-ui on canvas |
| RULES.md:94 (§6) | "Rules (numbers only) in 01 to 06" | `name: '…'` strings: 247 in 04, 51 in 03, 42 in 02 … |
| RULES.md:94 (§6) | simulation in "36 to 40" | 39-huddle.js is the row (UI) and uses performance.now (39-huddle.js:53,164); palette.py:12 counts 39+ as UI. Contradiction |
| RULES.md:95 (§6) | no Math.random in simulation files | 10-world.js:116 (the seed when none is given; harmless, unlisted in EXCEPTIONS #8) |
| RULES.md:105 (§7) | "the gate; it also runs science.py and history.py" | It also runs tables, palette, words; lint is required by publish but absent from §7 |
| EXCEPTIONS.md:16 (#10) | live is "the Build 44 era" | Shipped index.html says `const BUILD = 41`. SUSPECTED stale constant (build.py:38 notes the code "said 41 for nineteen builds"), so unprovable either way |
| EXCEPTIONS.md:8 (#2) | named half slots only | The gate exempts any `.h` descendant |
| Checks:35, :20, :19, :22 | see S2 | |
| lint.py:1 | "not part of the gate" | Publish requires it |
| gate.py:152 | fingerprint "exact, like SoRen's locked physics block" | Re-baselined by any `--accept` |
| CUTS.md:1048 | 30,209 source lines | `wc -l src/*.js src/shell-*.html` = 30,211 (minor; method may differ) |

Checked and true: UI_BUDGET 33 (06-rules-tuning.js:238); 16 colour names; preview = v70 byte for byte; all doc links to docs/ files resolve; GUIDE.md equals `F.guideMd()` (one trailing newline apart); the four gate sizes; the records in RULES §6 (TELL, FORAGE, PEACE, … all defined).

---

## 2. Hygiene: cut list (sizes in bytes, all tracked)
| Cut | Size | Why |
|---|---|---|
| tests/__pycache__/gate.cpython-313.pyc | 35,259 | compiled; add `__pycache__/` and `*.pyc` to .gitignore |
| docs/trials/planner-66.patch | 10,729 | a stored patch from the mess builds |
| docs/trials/bal_lvl.py, ledger_probe.py | 11,349 | one-off trials; bal_lvl.py:12 hard-codes /home/claude |
| mockups/*.png and door-64.html at root (pre-70: ui-62-390, ui-62-375, door-64, mock31-army, pages-64, mock36-figures, mock32-age, row-63) | 7,709,972 | superseded pictures; in history anyway |
| mock/menus.html | 14,100 | a second mock folder; merge into mockups/ or cut |
| tests/balance-57…70.json (8 files) | 115,412 | stored outputs, not tests; keep the latest in CUTS |
| src/fonts/barlow-600.woff | 23,236 | never embedded (build.py:47 uses 500 and 700 only) |
| AUDIT-62.md | 17,843 | superseded by v70 |
| docs/HANDOFF-to-oct29.md, HANDOFF-to-oct30.md | 68,222 | old handoffs; history holds them |
| CUTS.md | 217,520 | split: keep the current version's builds, archive the rest (move the build number out of it first, S4) |
| GUIDE.md | 119,264 | generated from the game; generate on demand or keep it out of the root |
| tests/fmt.py, bot.py, econ.py | — | tools rather than tests; bot.py and econ.py are referenced by no current doc (RULES §7 and Checks list neither) |

Totals: about 7.9 MB of pictures and records cut from the tree. The mockups folder is 19.8 MB tracked; .git is 20 MB even shallow. Every live publish adds two 1.17 MB blobs (index.html and preview/), and a frozen copy adds a third.
.gitignore (`first-keep.html, native/, logs/, tests/balance-last.json`) misses `__pycache__/`, `*.pyc`, `.DS_Store`, `node_modules/`.

---

## 3. Privacy and security
- **Commit identities** (70 commits in this clone): all author and committer `Albert <acohen2300@users.noreply.github.com>`, SSH-signed. VERIFIED. HANDOFF-to-oct29.md:16 says history was rewritten on Oct 28 to remove a Gmail. Commits before the shallow graft can't be checked here, and GitHub may keep pre-rewrite objects (cached views, forks, PR refs). SUSPECTED residual risk: check on GitHub, and ask GitHub Support to purge if any fork or ref survived.
- **Tracked files**: the only emails are the noreply (5 docs) and the font author's (OFL-fell.txt). No tokens or keys (grep for api key, secret, ghp_, AKIA, BEGIN … PRIVATE: only game prose). No phone numbers. The personal Gmail appears in no tracked file. The 57 PNGs carry no tEXt, iTXt, zTXt or eXIf chunks. `/home/claude` paths appear in 6 docs: environment paths, not personal. Session links (`claude.ai/code/session_…`) sit in commit trailers, and a claude.ai artifact link sits in docs/HANDOFF-to-oct29.md:47. Both need sign-in; low risk, but they are public pointers.
- **Not checked**: the pixel content of the 57 mockup screenshots.
- **localStorage** (v70, 08-core.js:156-176 and 34-save.js): `firstkeep.[preview.|vNN-name.]settings`, `.taps`, `.best`, `.save`, `.save.bak`, `.save.old`. "taps" counts uses per button verb (41-boot area, "never sent anywhere": VERIFIED, no network code). No personal data. A first run of a preview or frozen copy copies the live keys.
- **Network**: no fetch, XHR, WebSocket, beacon or import. One outbound link: a Wikipedia search with `target="_blank" rel="noopener"` (30-cards/31-guide). It sends the research-step name only on a tap. One `navigator.clipboard.writeText` on a user action (41-boot.js:136).
- **Inline code**: the entire game is one inline `<script>`, plus one inline handler `oninput="window.__fkq(this.value)"` (30-cards.js:730) and about 14 inline `style="…"` templates. `innerHTML` is used throughout; the only user text echoed is the search box, its own value (self-only).
- **CSP**: the web index.html ships none. The native copy (wrap.py:6-8) already ships one, and the gate runs native/index.html at all four sizes. A run here (hist page, typing into #gq, 300 ticks) showed 0 CSP violations and 0 page errors.

**Proposed CSP for the web build** (put the meta first in `<head>`, emitted by build.py so web and native share one home):
```
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; font-src data:; img-src data: blob:; media-src data: blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
```
What it has to allow compared with SoRen's: inline script and inline style (as SoRen), `data:` fonts (SoRen uses `font-src 'none'`), and no `'self'` scripts, workers, manifest or connect targets (First Keep has no SW or manifest; SoRen has both plus two APIs). Web Audio buffers need no media-src; it is kept to match wrap.py.

Risks: `'unsafe-inline'` makes script-src nearly worthless against injection. The stronger form is `script-src 'sha256-<hash of the one script>'` computed by build.py, after moving the `oninput` to addEventListener (otherwise `'unsafe-hashes'` is needed). A meta CSP cannot set `frame-ancestors` (Pages sends no headers). Anything added later (a manifest, a service worker, a share link, a fetch) breaks silently until the policy is updated, so the gate's existing native run is the guard. Low functional risk today: the native build already runs under nearly the same policy.

---

## 4. PROPOSAL: locks for settled systems

**Mechanism (simplest):**
1. Mark each settled block in src with `// LOCK <name> begin` / `// LOCK <name> end`.
2. `tests/locks.json`: `{ "<name>": "<first 12 hex of sha256 of the block's text, trailing spaces stripped>" }`.
3. **build.py**, not the gate (build.py runs on every preview, publish and local build), hashes each block and refuses on a mismatch: `build refused: locked block <name> changed (was X, now Y). Unlock needs Albert's word.`
4. **Deliberate unlock**: build.py accepts a new hash only if CUTS.md holds a line `- **Unlocked <name> → <newhash>:** <Albert's words>`, and then rewrites locks.json itself. The change can't happen without a written, dated record naming the new hash. Like SoRen, the game shows the IDs (Help → "Which version": "economy locked since v70 (a1b2c3…)") so a silent change is visible on the phone.
5. Honest limit: any session with write access can edit both files. This is a tripwire with a paper trail, not security. Pair it with S1's GitHub Action, which recomputes the hashes server-side.

**Candidates (settled, tested, few callers):**
| # | System | Range | Already tested by |
|---|---|---|---|
| 1 | Seeded dice, Poisson waits, relax, logistic | src/08-core.js:100-118 | science.py, fingerprint |
| 2 | The ledger: earn, spend, pay | src/08-core.js:36-61 | tables.py (cancel gives back) |
| 3 | Storage keys per place | src/08-core.js:156-176 | — |
| 4 | Save read, migrate chain (MIGRATE append-only: lock 285-306, and let new steps append) | src/34-save.js:285-306 | gate PLAY save chain |
| 5 | Colour index and timings `:root` (COLORS.md says "locked in v70") | src/shell-head.html:9-22 | palette.py |
| 6 | Climate and ground physics (airTemp to fireMul) | src/37-events.js:553-686 | science.py |
| 7 | Sky: sun and moon | src/08-core.js:380-409 | science.py |
| 8 | Market curve: mkt, mktHit, priceDrift | src/36-economy.js:644-672 | science.py |
(Also possible: sound falloff, src/35-sound.js:397-406; spatial grids and Lanchester, src/15-sim-spatial.js:1-212 with 08-core.js:629.)

---

## 5. Not checked
GitHub-side state (branch protection, Pages settings, forks, pre-rewrite objects); v60–v62 commits; the content of the 57 screenshots; whether the four Oct 31 previews really passed gate, lint, soak and fingerprint (HANDOFF.md:25; only CUTS text exists); APP-PREP.md, MENU-SPEC.md, SCIENCE.md claims; the gate itself (not run, per instructions).

## 6. Overall
The build is reproducible and the sub-tests that exist mostly measure real things. But the headline safeguard, the "live lock", is a local hook that this clone doesn't have and anyone can bypass, and the main checklist document claims checks (Shelter, Emergency taps, home resources, four corners, research card layout) that the gate never runs. Several "science" checks and the apostrophe rule pass whatever the code does, and the repo carries about 8 MB of superseded pictures and records against its own "cut what is dead" rule.
