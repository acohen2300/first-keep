# The start QC for any hand-off (Build 80). One command, the same checks every time:
#   python3 tests/handoff.py            everything: state, build, lint, the gate, the planted-bug check, what is owed
#   python3 tests/handoff.py --plant    only the planted-bug check (can the tests still fail?)
#   python3 tests/handoff.py --state    only the state and what is owed (no build, no tests)
# Exit 0 only if every check passed. A new session runs this first and reports every FAIL before it touches anything.
import os, re, shutil, subprocess, sys, tempfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PY = sys.executable
fails = []

def run(args, cwd=ROOT, timeout=900):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=timeout)
    return r.returncode, (r.stdout + r.stderr)

def say(ok, what, detail=''):
    print(('PASS ' if ok else 'FAIL ') + what + ((' ' + detail) if detail and not ok else ''))
    if not ok: fails.append(what)

# Each planted bug: a file, the text that is there now, the bug that replaces it, the test that must then FAIL, why, and the words the test's
# FAIL line must carry. If a planted bug passes, that test can no longer catch what it was written to catch. The test is first run on the
# clean copy (it must pass), and a planted bug counts as caught only by a test failure that names it: a crash, a page error or a build that
# breaks catches nothing (Build 80 preview 9; before, any non-zero exit counted).
PLANTS = [
  # save safety (tests/saves.py)
  ('34-save.js', 'seenErr.size >= 2 || holdSave) return;', 'seenErr.size >= 2 || (holdSave && !force)) return;', 'tests/saves.py', 'a forced save overwrites the Resume save', 'a forced save overwrote'),
  ('34-save.js', "localStorage.removeItem(SAVEKEY + '.bak'); // the backup goes too", '// the backup goes too', 'tests/saves.py', 'a finished game comes back from its backup', 'clearSave left'),
  ('34-save.js', "if (cardLocked() && !e.target.closest('#card')) e.stopPropagation();", ';', 'tests/saves.py', 'a tap outside the Welcome back card opens another card', 'got through'),
  ('34-save.js', "localStorage.setItem(SAVEKEY + '.old' + S.v,", "localStorage.setItem(SAVEKEY + '.old',", 'tests/saves.py', 'stale saves share one slot', 'share one slot'),
  ('34-save.js', "e.kind === 'wildfire') endEvent();", "e.kind === 'wildfire') G.ev.cur = null;", 'tests/saves.py', 'an event dropped on load is not ended', 'was not ended'),
  ('35-sound.js', "CHAN[name] === 'alert' || n <=", 'n <=', 'tests/saves.py', 'an alert waits for a voice', 'an alert waits'),
  ('40-emergency.js', "on('hands') || 'warn'", "'warn'", 'tests/saves.py', 'All hands never shows on', 'All hands is on'),
  # movement and work (tests/moves.py)
  ('12-sim-core.js', "dr = (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),", "dr = n.kind === 'fish' ? null : (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),", 'tests/moves.py', 'fish pay no walk home', 'a fish far from'),
  ('16-sim-fight.js', 'if (dx === 0 && dy === 0) {', 'if (false) {', 'tests/moves.py', 'two units on one spot never part', 'did not part'),
  ('40-emergency.js', " && u.state !== 'school'); // a student", '); // a student', 'tests/moves.py', 'a student is pulled out of the School', 'out of the School'),
  ('14-sim-troops.js', 'sx = ((nx - u.x) / rd) * sp * dt,', 'sx = clamp(nx - u.x, -1, 1) * sp * dt,', 'tests/moves.py', 'a deer runs faster on a diagonal', 'a deer runs'),
  ('08-core.js', 'if (b.mx && b.mx !== M) b.hp =', 'if (false) b.hp =', 'tests/moves.py', 'Masonry leaves a Town Center at 77%', 'Masonry left'),
  ('10-world.js', 'if (!onLand(fx, fy))', 'if (true)', 'tests/moves.py', 'fish sit on land', 'a fish sits on land'),
  ('37-events.js', "(G.diff === 'easy' ? 1 : 1 + levelOf(G.hz) / 10)", '(1 + levelOf(G.hz) / 10)', 'tests/moves.py', 'Easy keeps a hazard bonus', 'Easy keeps'),
  ('16-sim-fight.js', "b.kind === 'throne' && b.owner === p.id && !b.gone", "b.kind === 'throne' && false", 'tests/moves.py', 'a fallen holder deletes the Throne', 'the Throne was deleted'),
  ('13-sim-civil.js', 'if (b.hp >= maxHpB(o, b.kind) - 0.5) {\n\t\tbackToWork(u);', 'if (b.hp >= maxHpB(o, b.kind) - 0.5) {\n\t\tsetJob(u, null);', 'tests/moves.py', 'a repair that ends forgets the old job', 'is whole does not send'),
  # Build 80 preview 9, one or more for each fix
  ('15-sim-spatial.js', 'if (U.temper) return !(onMe(v, me) || (', 'if (U.temper) return !(false || (', 'tests/moves.py', 'a soldier bitten by a wolf does not fight back', 'a wolf biting it'),
  ('08-core.js', 'm.owner === o && isSoldier(m) && m.hp > 0', 'm.owner === o && m.hp > 0', 'tests/moves.py', 'the attacked villager is one of the eyes', "side's eyes"),
  ('13-sim-civil.js', 'u.next = n && !n.hunt ? n.id : null;', 'u.next = null;', 'tests/moves.py', 'the find seen when the last ran out is forgotten', 'was never taken'),
  ('13-sim-civil.js', 'lost ? u.anchor || dropFor(u.owner, u.job, u) || u : undefined', 'lost ? u : undefined', 'tests/moves.py', 'the search runs from where the villager stands, not the anchor', 'did not start from the drop-off'),
  ('12-sim-core.js', ': dist(nearest(drops, n) || keepOf(u.owner) || n, n) > DANGER_R.far))', ': false))', 'tests/moves.py', 'no leash from the drop-off', 'past the leash'),
  ('12-sim-core.js', 'if (!mates.has(n)) continue;', 'continue;', 'tests/moves.py', 'a friend\'s find does not count', 'a friend is working'),
  ('13-sim-civil.js', 'u.nnT = G.t + SEARCH.again + rng(); // nothing in reach', 'setJob(u, null); // nothing in reach', 'tests/moves.py', 'a villager with nothing in reach gives up its job', 'gave up its job'),
  ('13-sim-civil.js', 'if (!u.job || u.hunt || (u.node && u.node.amt > 0)) {', 'if (!u.job || u.hunt) {', 'tests/moves.py', 'the search clock survives a new find', 'kept the old search clock'),
  ('13-sim-civil.js', 'const p = spotAt(b, u.spot.i);', 'const p = spotAt(b, 0);', 'tests/moves.py', 'every waiter is sent to one point', 'not at their own spots'),
  ('16-sim-fight.js', 'if (!blockedCell(gcell(ax, ay), a.owner)) stepTo(a, ax, ay);', 'if (!blockedCell(gcell(ax, ay), a.owner)) (a.x = ax), (a.y = ay);', 'tests/moves.py', 'a push glides', 'a push moves'),
  ('09-nav.js', 'stepTo(u, nx, ny); // the walk counts', 'u.x = nx; u.y = ny; if (m > 0.3) u.st.walk += m; // the walk counts', 'tests/moves.py', 'a small move glides', 'under 0.3'),
  ('14-sim-troops.js', 'U.raid ? U.raid + 40 : WILD_LOOK,', "U.temper === 'defend' ? 45 : U.raid ? U.raid + 40 : WILD_LOOK,", 'tests/moves.py', 'boar and bear react only at 45', 'does not react'),
  ('23-view-things.js', 'B.h * Math.min(1, e.prog)', 'B.h', 'tests/moves.py', 'a site casts a full building\'s shadow', 'quarter raised'),
  ('23-view-things.js', 'if (HEX.k === k) return HEX.pts;', '', 'tests/moves.py', 'the shadow shape is made again every time', 'made again'),
  ('13-sim-civil.js', 't = ((i % k) * 2 * R) / k - R;', 't = ((i % k) * 2 * R) / k - R + R / k / 2;', 'tests/moves.py', 'waiting spots crowd at the corners', 'ft apart, under'),
  ('12-sim-core.js', 'u.anchor ? dist(u.anchor, n) > SEARCH.x + SEARCH.y :', 'u.anchor ? false :', 'tests/moves.py', 'no cap for a placed villager', 'past the cap'),
  ('13-sim-civil.js', 'lost ? u.anchor || dropFor(u.owner, u.job, u) || u : undefined', 'lost ? dropFor(u.owner, u.job, u) || u : undefined', 'tests/moves.py', 'a placed villager searches from the drop-off', 'search from where it was placed'),
  ('34-save.js', "['pointerdown', 'pointermove', 'pointerup', 'click', 'wheel']", "['pointerdown', 'pointermove', 'pointerup', 'click']", 'tests/saves.py', 'the wheel zooms behind the Welcome back card', 'the wheel zoomed'),
  ('08-core.js', '(C <= V ? 1 : V / C)', '(C <= V ? 1 : 1)', 'tests/science.py', 'Hawk-Dove always fights', 'hawk V<C'),
  # the combat batch (Build 80, Nov 1): one or more for each item, in tests/combat.py
  ('08-core.js', "return g === 'beast' || gangRel(o, g) === 'war';", "return gangRel(o, 'nat') === 'war';", 'tests/combat.py', 'the whole wild follows the Natives\' relations', 'C1:'),
  ('16-sim-fight.js', "beast = !!a && hasTag(a.kind, 'animal');", 'beast = o === WILD && t.owner !== WILD;', 'tests/combat.py', 'the half-strength rule tests the owner', 'C4:'),
  ('16-sim-fight.js', '((MORALE.hit * d * (TEMPER', '((MORALE.hit * base * (TEMPER', 'tests/combat.py', 'the nerve drains from the raw blow', 'C5:'),
  ('16-sim-fight.js', 'fx = t.fx, // its own facing first', 'fx = 0, // its own facing first', 'tests/combat.py', 'a lone man takes every blow from the side', 'C3:'),
  ('15-sim-spatial.js', 'let p = unitPower(u); // itself', 'let p = 0; // itself', 'tests/combat.py', 'the group leaves the soldier out', 'C2:'),
  ('14-sim-troops.js', 'G.t - tgt.routAt > MORALE.capAfter &&', 'G.t - tgt.routAt >= 0 &&', 'tests/combat.py', 'no grace before a runner is taken', 'C6:'),
  ('14-sim-troops.js', "if (best) u.hp = relax(u.hp, u.max, u.max / (best * fxv(u.owner, 'heal').m), dt * 3);", 'if (best) u.hp = Math.min(u.max, u.hp + best * dt * 3);', 'tests/combat.py', 'a wound heals at the linear rate', 'C7:'),
  ('14-sim-troops.js', 't.native = false; // a Native turned', '; // a Native turned', 'tests/combat.py', 'a convert keeps the Native mark', 'C8:'),
  ('14-sim-troops.js', 'full = !!t && clsCount(u.owner, UNIT[t.kind].cls) >= clsMax(UNIT[t.kind].cls, u.owner);', 'full = false;', 'tests/combat.py', 'a priest converts past the ceiling', 'C8:'),
  ('14-sim-troops.js', 'const reach = reachOf(U.rng, t);', 'const reach = reachOf(U.rng, t) + (t.q ? halfOf(t) : 0);', 'tests/combat.py', 'the wild counts a building\'s half twice', 'C9:'),
  ('16-sim-fight.js', '\t\t\t\t\tn.by = o;\n\t\t\t\t\tn.byT = G.t;\n', '', 'tests/combat.py', 'a petard splash records no attacker', 'C9:'),
  ('13-sim-civil.js', 'u.post = p ? { x: p.x, y: p.y, b: key, i: p.i } : { x: at.x, y: at.y };', 'u.post = { x: at.x, y: at.y };', 'tests/combat.py', 'villagers sent to a point share it', 'item 5: villagers'),
  ('13-sim-civil.js', 'const p = b && (takeSpots([u], b, b.id)', 'const p = false && (takeSpots([u], b, b.id)', 'tests/combat.py', 'out of a building onto no spot', 'item 5: a villager out'),
  ('08-core.js', "\t\t: !UNIT[x.kind]\n\t\t\t? 'nat'", "\t\t: !UNIT[x.kind]\n\t\t\t? 'beast'", 'tests/combat.py', "the Natives' pits are foes to their allies", 'their pit'),
  ('06-rules-tuning.js', 'ARRIVE = SPACE / 4;', 'ARRIVE = 9;', 'tests/combat.py', 'a villager counts as arrived past half the spacing', "nearer another's spot"),
  ('13-sim-civil.js', ' || blockedCell(c, o) || (cm', ' || (cm', 'tests/combat.py', 'a spot on a blocked square', 'blocked square'),
  ('13-sim-civil.js', 'if (p.x < SPACE || p.y < SPACE || p.x > MAP - SPACE || p.y > MAP - SPACE || blockedCell', 'if (blockedCell', 'tests/combat.py', 'a spot at the map edge', 'map edge'),
  ('13-sim-civil.js', ' || (cm && NAV.comp[c] !== cm)) return false;', ') return false;', 'tests/combat.py', 'a spot across a wall', 'far side of a wall'),
  ('13-sim-civil.js', 'if (!stood && !skip.has(v) && v.hp > 0 && !v.inside) stood = true;', ';', 'tests/combat.py', 'a spot where someone stands', 'already standing'),
  ('13-sim-civil.js', 'if (!claimed.has(i) && spotFree(p, o, cm, mine))', 'if (spotFree(p, o, cm, mine))', 'tests/combat.py', "a second tap takes the first's spots", 'second tap'),
  ('12-sim-core.js', 'n.hunt ? Math.max(0, (n.hunt.wk || 0) - (u.hunt === n.hunt ? 1 : 0))', 'n.hunt ? 0', 'tests/combat.py', 'hunters count no crowd', 'sent to one'),
  ('12-sim-core.js', 'if (R > bR && (!cm || reachFrom(n, cm, u.owner))) {', 'if (R > bR) {', 'tests/combat.py', 'a waiter is sent to a find out of reach', 'cannot walk to'),
  ('34-save.js', "u.routAt = u.routT - MORALE.rout * (p && (p.techs || []).includes('engage') ? 0.5 : 1);", 'u.routAt = u.routT;', 'tests/saves.py', 'an old rout keeps its end as its start', 'C6: an old rout'),
  ('17-ai.js', '\t\t\tif (!best) continue;\n\t\t\tsetJob(v, best.r', '\t\t\tcontinue;\n\t\t\tsetJob(v, best.r', 'tests/combat.py', 'a computer\'s waiting villager is never moved', 'item 6:'),
  # the cards of v80 (Setup stacked, Relations final, the controls, Mail pages, the audit's E items, the cold review of v70) and the type rules
  ('29-card-pages.js', "const setRow = (name, opts, cur) => acts(lab(name, 's' + (6 - opts.length)) + choice(", 'const setRow = (name, opts, cur) => acts(choice(', 'tests/cards.py', 'a setting has no name on its rank', 'settings stand on their own rank'),
  ('29-card-pages.js', "const offOn = (key, on) => [[`${key}:0`, 'Off', false], [`${key}:1`, 'On', true]]", "const offOn = (key, on) => [[`${key}:0`, 'Off', false], [`${key}:1`, cap1(key), true]]", 'tests/cards.py', 'Fog says its word twice', 'says its word'),
  ('29-card-pages.js', "\t\t\tsym(`relok:${q}`, ICON.ok, gift || want ? (why ? 'dis' : 'go') : 'dis', `Send to the ${relName(q)}`),", "\t\t\t'',", 'tests/cards.py', 'Relations has no check mark on a row', 'a check mark per row'),
  ('29-card-pages.js', "relOf(q) === 'ally' ? 'A gift to a friend is locked.' : null);", 'null);', 'tests/cards.py', "a friend's bribe is not locked", 'bribe is not locked'),
  ('33-verbs.js', '\t\tdelete G.relPick[q];', '\t\tG.relPick = {};', 'tests/cards.py', "a row's check mark drops the other rows' picks", "sent another row's pick"),
  ('01-rules-basics.js', "const REL_WORD = { war: 'Foe', peace: 'Neutral', ally: 'Friend' };", "const REL_WORD = { war: 'Hostile', peace: 'Neutral', ally: 'Ally' };", 'tests/cards.py', 'the stances say ally, neutral, hostile', 'not friend, neutral, foe'),
  ('32-frame.js', 'page: 6 };', 'page: 30 };', 'tests/cards.py', 'the mail shows every line on one page', 'six lines a page'),
  ('29-card-pages.js', "acts(choice(MKT_SELL.map((g) => [`mpick:${g}`, `<b>${nm(g)}</b><small>${fmt(Math.floor(haveOf(p, g)))}</small>`, g === k]), 's6', true), 'c1')", "acts(MKT_SELL.map((g) => btn(`mpick:${g}`, nm(g), fmt(Math.floor(haveOf(p, g))), g === k ? 'on' : '')).join(''), 'c6')", 'tests/cards.py', 'the goods are singles, not one selector', 'not one selector'),
  ('30-cards.js', '\t\tif (!(mine && kp)) h += infoRank(b, factOf(b, X, crew));', "\t\tif (mine && done && b.kind === 'market') return h + X.page + more();\n\t\tif (!(mine && kp)) h += infoRank(b, factOf(b, X, crew));", 'tests/cards.py', 'the Market skips the shared page (E11)', 'skips the shared page'),
  ('30-cards.js', "fold('armytrain', 'Train soldiers', list(trainButtons(kinds)))", "fold('armytrain', 'Train soldiers', acts(trainButtons(kinds)))", 'tests/cards.py', "commas between the Army card's Train buttons (E1)", 'commas'),
  ('29-card-pages.js', '\t\t\t`${Math.floor(made)} made`,', '\t\t\t`${w ? Math.floor(w.st.got || 0) : 0} made`,', 'tests/cards.py', "a workshop counts its worker's gathering (E2)", 'E2: the workshop says'),
  ('26-input.js', "if (n.kind !== 'farm' && (!G.fogOn || fogAt(n.x, n.y) > 0)) {", "if (n.kind !== 'farm') {", 'tests/cards.py', 'a find under the fog can be tapped (E4)', 'under the fog was tapped'),
  ('26-input.js', '\tif (G.hud) G.hud.drag = false;\n\tG.box = null;\n\tdrag = null;\n}', '\tdrag = null;\n}', 'tests/cards.py', 'a pinch leaves the box and the glow (E5)', 'a pinch left the box'),
  ('27-cards-core.js', "\t\t\tsub = why && told === costText(cost) ? why.replace(/\\.$/, '') : told;", '\t\t\tsub = told;', 'tests/cards.py', 'a dim Train button shows its cost as payable (E6)', 'does not say why'),
  ('30-cards.js', '\tcardPause(c);\n', '', 'tests/cards.py', 'the pause is decided once at open (E7)', 'did not pause'),
  ('29-card-pages.js', '<small>${more.short || more.name}</small></button>`,', '<small>research</small></button>`,', 'tests/cards.py', 'a locked place says research, not its name', 'not its research'),
  ('shell-head.html', '#hudB,#emgB{width:calc((100% - 7 * var(--gap)) / 6)}', '#hudB{width:calc((100% - 7 * var(--gap)) / 6)}#emgB{width:var(--slot)}', 'tests/cards.py', 'the Emergency button is 44 wide, off the grid', 'not a slot on the cycle button'),
  ('shell-head.html', 'top:calc(-1 * var(--rank) - var(--gap));', 'top:0;', 'tests/cards.py', 'the steel panel stops under the cycle button', 'steel panel stops'),
  ('24-view-overlays.js', 'const labelK = () => Math.max(LABEL.floor / LABEL.px, cam.z / ZOOM_START);', 'const labelK = () => Math.max(0.9, cam.z * 0.6) * 11 / 12;', 'tests/cards.py', 'a map label is 10 at the start and does not scale whole', "the map's labels are"),
  ('29-card-pages.js', '\t\t\t\t\t\t`${Math.min(DEMAND.amt, Math.floor(P.res[r]))}/${Math.floor(P.res[r])}`,', '\t\t\t\t\t\t`${Math.min(DEMAND.amt, Math.floor(P.res[r]))} of ${Math.floor(P.res[r])} in their store`,', 'tests/cards.py', "the vassal's Demand rank grows past its 44", 'Demand rank grows'),
  ('shell-head.html', '--fs-s:12px;--fs-l:18px;', '--fs-s:12px;--fs-m:15px;--fs-l:19px;', 'tests/palette.py', 'three text sizes, 12, 15 and 19', 'not the two: 12 and 18'),
  ('shell-head.html', 'button b{font-size:var(--fs-s);text-wrap:balance}', 'button b{font-weight:700;font-size:var(--fs-s);text-wrap:balance}', 'tests/palette.py', 'a second Barlow weight', 'one weight, 600'),
  ('27-cards-core.js', '" data-f="slt-${inp}"><button', '"><button', 'tests/cards.py', 'the gift slider is rebuilt under the finger when it turns on', 'a drag across the gift slider'),
  ('13-sim-civil.js', '\t\tb.made = (b.made || 0) + g;', '\t\t;', 'tests/cards.py', 'the workshop counter is gone (E2)', 'made nothing'),
  ('29-card-pages.js', ': war ? `${REL_WORD.war.toLowerCase()} in ${nl} s` : REL_WORD[rel],', ": REL_WORD[rel] + (nl ? ` · ${nl} s` : ''),", 'tests/cards.py', 'a side under notice reads Neutral', 'foe in 30 s'),
  ('30-cards.js', "${linkOf(m) || 'mailp:0'}", "${linkOf(m) || 'mail'}", 'tests/cards.py', 'a mail line sends the mail back to page 1', 'a tap on a line on page 3'),
  ('27-cards-core.js', "${cls ? ' ' + cls : ''} ${span}", "${cls ? ' ' + cls : opts.length > +span.slice(1) ? ' thin' : ''} ${span}", 'tests/cards.py', 'every selector with more parts than slots is skipped as thin', 'marked thin'),
  ('29-card-pages.js', '\t\t\t\t\t`relwant:${q},${k}`,', '\t\t\t\t\t`relwnt:${q},${k}`,', 'tests/verbs.py', 'a choice verb with no handler', 'no handler'),
  ('29-card-pages.js', 'slt(`relon:${q}`, `relgift:${q}`,', 'slt(`relon:${q}`, `relgif:${q}`,', 'tests/verbs.py', "the slider's verb with no handler", 'no handler'),
  ('24-view-overlays.js', '${FONTW || (FONTW = getComputedStyle(document.body).fontWeight)}', '600', 'tests/palette.py', 'mapFont writes its own weight', 'mapFont does not read'),
  ('27-cards-core.js', '\twhile (show.length < MSG.page) show.push(pad);\n', '', 'tests/cards.py', 'a short mail page shrinks the card', 'Next moves between pages'),
  ('30-cards.js', "\t\treturn h + acts(rows, 'c1') + nav;", "\t\treturn h + (g && g !== 'reply' ? acts(btn(`mailtog:${g}`, 'Hide the previews', 'now: a preview, then here'), 'c1') : '') + acts(rows, 'c1') + nav;", 'tests/cards.py', 'the preview switch takes a rank of its own', 'scrolls'),
  ('39-huddle.js', '\tctx.font = mapFont(); // pinned to the screen', "\tctx.font = '700 12px system-ui, sans-serif';", 'tests/palette.py', "the phone's own font on a map label", 'not through mapFont'),
  # the map (decisions 2 and 5a, D1, B4; tests/map.py, at 25 seeds and one phone size here: FK_PLANT)
  ('09-nav.js', 'm = B.wallish ? 0 : LANE;', 'm = B.wallish ? 0 : 1;', 'tests/map.py', 'a one-square gap between buildings is allowed', 'two squares between buildings'),
  ('17-ai.js', 'const stalled = G.t - w.pt > WAVE.stall;', 'const stalled = !out.some((u) => G.t - (u.hitT || -99) < 30) && G.t - w.t > 45;', 'tests/map.py', 'a wave walking nearer is recalled at 45 s', 'judged by its progress'),
  ('17-ai.js', 'if (stalled && !w.bid) p.ai.cool[w.to] = G.t + WAVE.cool;', ';', 'tests/map.py', 'a stalled wave goes straight back at the same target', 'judged by its progress'),
  ('17-ai.js', 'if (stalled && !w.bid) p.ai.cool[w.to]', 'if (stalled) p.ai.cool[w.to]', 'tests/map.py', 'a stalled wave on the Throne cools its holder', 'judged by its progress'),
  ('17-ai.js', 'if (!threat && (p.ai.cool[q.id] || 0) > G.t) continue;', 'if ((p.ai.cool[q.id] || 0) > G.t) continue;', 'tests/map.py', 'a side building a wonder is waited out', 'judged by its progress'),
  ('09-nav.js', 'COORDN = Math.ceil(MAP / COORD);', 'COORDN = 20;', 'tests/map.py', 'the map labels stop at the old 2000', 'labels reach its edge'),
  ('10-world.js', "180 * RICH * HOME.rich", "180 * RICH", 'tests/map.py', 'the home berries without HOME_RICH', 'the home zone'),
  ('10-world.js', 'if (home ? near < b0 || near > b1 : near < b1) continue;', 'if (home ? near < b0 || near > b1 : false) continue;', 'tests/map.py', 'a wild find with nodes inside the home band', 'the home zone'),
  ('10-world.js', 'if (home ? near < b0 || near > b1 : near < b1) continue;', 'if (home ? false : near < b1) continue;', 'tests/map.py', 'home finds laid by their middles, not their nodes', 'the home zone'),
  ('10-world.js', 'for (let t = 0; t < SEEK.most; t++) {', 'for (let t = 0; t < 30; t++) {', 'tests/map.py', 'a find with no room is dropped, not searched outward', 'the home zone'),
  ('10-world.js', 'for (let r = SEEK.step; wet(p) && r < MID; r += SEEK.step)', 'for (let r = SEEK.step; false; r += SEEK.step)', 'tests/map.py', 'a runway deposit left where it clashes', 'the home zone'),
  ('10-world.js', '...at(12, 0), 500 * RICH)', '...at(-10, 0), 500 * RICH)', 'tests/map.py', 'a lode nearer one corner than the other', 'the home zone'),
  ('10-world.js', '\topenWays(woods);', '', 'tests/map.py', 'finds walled in by forest (B4)', 'the home zone'),
  ('10-world.js', '(c + i) * NAVC, (c + j) * NAVC)', '(c + i + 0.5) * NAVC, (c + j + 0.5) * NAVC)', 'tests/map.py', "the Throne's ring half a square off", 'the citadel the same'),
  ('10-world.js', "addFind('shrine', MID, MID);", "addFind('shrine', MID - 52, MID + 46);", 'tests/map.py', 'the shrine in one yard', 'the citadel the same'),
  ('10-world.js', '\t\t[1, 1],\n\t\t[-1, 1],\n', '\t\t[1, 1],\n', 'tests/map.py', 'three towers', 'the citadel the same'),
  ('34-save.js', 'for (const b of S.blds || []) (b.gx += D / NAVC), (b.gy += D / NAVC);', ';', 'tests/map.py', 'an old save leaves buildings on their old squares', 'opens in the middle'),
  ('34-save.js', "if (S.tread) S.tread = grid(S.tread, 2);", ';', 'tests/map.py', 'an old save leaves its ruts where they were', 'opens in the middle'),
  ('34-save.js', 'u.grazeAt = { x: u.gx, y: u.gy };', 'u.grazeAt = { x: u.gx - D, y: u.gy - D };', 'tests/map.py', 'an old animal grazes on the old map', 'opens in the middle'),
  ('34-save.js', '\t\t\tdelete p.ai.wallPlan;', '\t\t\t;', 'tests/map.py', 'an old save keeps the wall plan on the old squares', 'wall plan'),
  ('20-view-base.js', 'cam.x = clamp(cam.x, Math.min(hw, MID), Math.max(MAP - hw, MID));', 'cam.x = clamp(cam.x, Math.min(hw * 2, MID), Math.max(MAP - hw * 2, MID));', 'tests/map.py', 'the camera stops short of the map edge', 'seen and tapped'),
  # the research and text batch (N9 to N12, N14; Albert, Nov 1): research keyed to its finds, layers in series, the barometer, the card's formula, the oddities, the text from the tables
  ('08-core.js', "const nodeKey = (n) => [n.kind === 'farm' ? n.farm.kind : n.kind];", 'const nodeKey = (n) => [n.type, n.kind];', 'tests/tables.py', 'research keyed by the resource reaches the Mint', 'N9:'),
  ('04-rules-tech.js', "fx: [{ s: 'gather', k: 'farm', m: 1.1 }],", "fx: [{ s: 'gather', k: 'food', m: 1.1 }],", 'tests/tables.py', 'Sickles keyed to all food', 'Sickles misses the field'),
  ('04-rules-tech.js', "fx: [{ s: 'gather', k: 'farm', m: 1.1 }],", "fx: [{ s: 'gather', k: ['farm', 'bush'], m: 1.1 }],", 'tests/tables.py', 'Sickles on bushes (fields and mines only)', 'Sickles reaches the bush'),
  ('04-rules-tech.js', "need: ['science', 'weathersigns'],", "need: ['science'],", 'tests/tables.py', 'Weather glass without Weather signs', 'N10: Weather glass can be had'),
  ('37-events.js', 'if (lead && A[lead - 1] !== (lead > 1 ? A[lead - 2] : c.wet))', 'if (lead && A[0] !== c.wet)', 'tests/tables.py', 'the warning comes a minute late', 'N10: Weather glass did not warn'),
  ('34-save.js', '(S.P[b.owner] && refund(S.P[b.owner], j), false)', '(S.P[b.owner] && addRes(S.P[b.owner].res, j.paid || {}), false)', 'tests/saves.py', 'the Printing refund skips the ledger and research spent', 'N12: the Printing refund'),
  ('04-rules-tech.js', 'within ${UNIT.caravan.armed.rng} for ${UNIT.caravan.armed.dmg}', 'within ${UNIT.caravan.armed.dmg} for ${UNIT.caravan.armed.rng}', 'tests/tables.py', 'the Armed caravans card swaps reach and hit', 'N12: the Armed caravans card'),
  ('12-sim-core.js', "? insulate(fxv(o, 'cold').a) : 1", "? 1 - Math.min(1, fxv(o, 'cold').a) : 1", 'tests/science.py', 'climate steps add up to immunity', 'one cloak halves'),
  ('37-events.js', 'while (A.length < Math.max(1, lead))', 'while (A.length < 1)', 'tests/tables.py', 'Weather glass tells nothing more', 'N10: Weather glass and'),
  ('27-cards-core.js', "${t.w ? ` · weight ${t.w} of 10` : ''}: ${t.desc}", "${t.w ? ` · weight ${t.w} of 10` : ''}: ${t.desc} Cost and time ×${(0.5 + 0.1 * t.w).toFixed(1)} for its age.", 'tests/tables.py', 'the research card claims a cost formula', 'N11:'),
  ('13-sim-civil.js', 'if (f) hurt(o, u, f, A.dmg);', 'if (f) hurt(o, u, f, 4);', 'tests/tables.py', 'the caravan strike is typed, not read from its row', "N12: the caravan's strike"),
  ('04-rules-tech.js', 'age: BLD.foundry.age, // with the Foundry', 'age: 1, // with the Foundry', 'tests/tables.py', 'Charcoal burning two ages before the Foundry', 'N12: Charcoal'),
  ('34-save.js', "id === 'printing' ? 'press' : id", 'id', 'tests/saves.py', 'an old save keeps Printing', 'N12: an old save keeps'),
  ('10-world.js', 'for (let i = 0; i < START_VILS; i++) {', 'for (let i = 0; i < 5; i++) {', 'tests/tables.py', 'the Open start gives other than its text says', 'F1: the Open start'),
  ('07-text.js', 'deep snow slows a walker ${slowPct(CLIMATE.terrain.snow)}%, deep mud ${slowPct(CLIMATE.terrain.mud)}%', 'soft snow costs a walker more than mud', 'tests/tables.py', 'the snow line says snow costs more than mud', 'F1: the snow line'),
  ('34-save.js', '\t\t\ttread:', '\t\t\ttrod:', 'tests/tables.py', 'the save drops the ruts the ground marks line says it keeps', 'F1: the ground marks'),
  ('27-cards-core.js', '(c.type in READ_CARDS ||', '(true ||', 'tests/tables.py', 'every card pauses, as the rules say none but the reading ones do', 'F1: a building card pauses'),
  # the wild batch (branch wild81, Nov 1): the wild by kind, 4b, answers 11 and 12, the hunt A and B, the Victory sightings; tests/wild.py
  ('08-core.js', "\t\t\t\t\t: UNIT[x.kind].gang || 'nat';", "\t\t\t\t\t: 'nat';", 'tests/wild.py', 'bandits and robbers follow the Natives\' stance', '1b:'),
  ('38-natives.js', '\taddRegard(o, g, gain);', "\taddRegard(o, 'nat', gain);", 'tests/wild.py', 'a bribe goes to the Natives whoever it was for', '1b:'),
  ('14-sim-troops.js', '\t\t\t\t\tisFoe(WILD, v, u) && //', '\t\t\t\t\ttrue && //', 'tests/wild.py', 'a guard ignores its group\'s stance and 4b', '4b:'),
  ('08-core.js', '(!calm4b(x.owner) || struckBy(me, x))', '(true)', 'tests/wild.py', 'the wild starts fights with computers', '4b:'),
  ('08-core.js', 'G.t - (L[x.id] ?? -1e9) < NATIVE.struck &&', 'true &&', 'tests/wild.py', 'a camp never forgets who struck it', '4b:'),
  ('08-core.js', '&& hyp(x.x - h.x, x.y - h.y) < h.r;', ';', 'tests/wild.py', 'a camp chases its instigator anywhere', '4b:'),
  ('38-natives.js', '\t\t\tp.id !== WILD &&\n\t\t\t!calm4b(p.id) &&\n', '\t\t\tp.id !== WILD &&\n', 'tests/wild.py', 'raids ride for computers', '4b:'),
  ('14-sim-troops.js', "\t\tif (full && u.owner === 0) say('At Maximum Occupancy Capacity', '', 3);", '', 'tests/wild.py', 'a conversion refused at the ceiling says nothing', '11:'),
  ('15-sim-spatial.js', '|| inWood(x, y);', ';', 'tests/wild.py', 'no ambush from a wood', '12:'),
  ('15-sim-spatial.js', '|| (r >= THRONE.r && r < THRONE.isle) ||', '||', 'tests/wild.py', "no ambush from the camp's edge", '12:'),
  ('39-games.js', 'if (G.truce !== null && G.t - (G.gamesT ?? 0) >= PEACE.games.every) {', 'if (G.t - (G.gamesT ?? 0) >= PEACE.games.every) {', 'tests/wild.py', 'the Games are held at war', 'A1:'),
  ('09-nav.js', '=> Math.floor(Math.sqrt(R * R - (i - R) ** 2))', '=> Math.round(Math.sqrt(R * R - (i - R) ** 2))', 'tests/wild.py', 'the row disc is not the disc', 'A2:'),
  ('16-sim-fight.js', "\t\t\t\tif (v.job === 'repair') continue;", '', 'tests/wild.py', 'a bitten builder leaves its site', 'A3:'),
  ('14-sim-troops.js', '|| (t && !(t.hp > 0 && !t.inside))) {', '|| !(t && t.hp > 0 && !t.inside)) {', 'tests/wild.py', 'the wild looks every tick', 'A4:'),
  ('09-nav.js', 'if (u.pi !== pi0 || T - (u.laT ?? -9) >= 0.25) {', 'if (true) {', 'tests/wild.py', 'the look-ahead runs every tick', 'A5:'),
  ('09-nav.js', 'C0 = COMPS[o] || (COMPS[o] = { comp: new Int32Array(NC * NC) });', 'C0 = { ...COMPS[o], comp: new Int32Array(NC * NC) };\n\tCOMPS[o] = C0;', 'tests/wild.py', 'a new region buffer each flood', 'A6:'),
  ('12-sim-core.js', '\t\tif (tree) G.navDirty = true;', '\t\tif (spent) G.navDirty = true;', 'tests/wild.py', 'a picked bush rebuilds the grid', 'A7:'),
  ('17-ai.js', '\t\tnavOnce(() => {\n\t\t\tfor (const c of plan) {', '\t\t((f) => f())(() => {\n\t\t\tfor (const c of plan) {', 'tests/wild.py', "the computers' wall plan rebuilds the grid each piece", 'A8:'),
  ('36-economy.js', '\t\tseasonN: 0,\n', '\t\tseasonN: 0,\n\t\tyearN: 0,\n', 'tests/wild.py', 'a dead field is made again', 'A9:'),
  ('38-natives.js', '* REGARD.decay) / 100) * BEAT.natives[0];', '* REGARD.decay) / 100) * 5;', 'tests/wild.py', 'the regard drift types its own beat', 'A10:'),
  ('32-frame.js', "\tif ($('place').hidden === !!G.place) $('place').hidden = !G.place;", '', 'tests/wild.py', 'the place bar outlives its game', 'B5:'),
  ('30-cards.js', "done && B.wood\n\t\t\t\t\t\t? btn(", "b.fire > 0\n\t\t\t\t\t\t? btn(", 'tests/wild.py', 'a fire adds a rank to the building card', 'B6:'),
  ('34-save.js', '\t\t\talertT: G.alertT,\n', '', 'tests/wild.py', 'the alarm clock is not saved', 'B7:'),
  ('30-cards.js', '\t\tif (GUIDE_PG.key === key) return GUIDE_PG.h;', '', 'tests/wild.py', 'the Guide rebuilds on every redraw', 'B8:'),
  ('20-view-base.js', '\t} finally {\n\t\tctx = was;\n\t}', '\t} catch (e) {\n\t\tthrow e;\n\t}\n\tctx = was;', 'tests/wild.py', 'a throw in sprite art keeps the sprite ctx', 'B10:'),
  ('39-games.js', "\t\t\t'<p class=\"chl\"></p>',", "\t\t\t'',", 'tests/wild.py', 'a short chronicle page shrinks the end card', 'Victory sighting 1'),
  ('39-games.js', "\t\t\tL.map((c) => `<p class=\"chl\">", "\t\t\tL.map((c) => `<p>", 'tests/wild.py', 'a long chronicle line wraps and grows the card', 'Victory sighting 1'),
  ('shell-head.html', '#end{position:absolute;z-index:var(--z-end);', '#end{position:absolute;', 'tests/wild.py', 'the floating buttons draw over the end card', 'Victory sighting 2'),
  # Relations in two pages and the stance change (answers 1, 1b; Albert Nov 1, 08:14 and 08:16)
  ('29-card-pages.js', '\t\t\t(g\n\t\t\t\t? slt(', '\t\t\t(true\n\t\t\t\t? slt(', 'tests/cards.py', "a computer's row keeps a gift slot", 'gift slot'),
  ('29-card-pages.js', "const MISFITS = [WILD, 'out', 'ban', 'rob'];", 'const MISFITS = [WILD];', 'tests/cards.py', 'Misfits holds the Natives only', 'Misfits: the rows are'),
  ('29-card-pages.js', 'const relKey = (a) => (GANG[a] ? a : Number(a));', 'const relKey = (a) => Number(a);', 'tests/cards.py', "a group's verb is read as a number", 'Relations'),
  ('29-card-pages.js', 'const relOf = (q) => (gangKey(q) ? gangRel(0, gangKey(q)) : G.rel[0][q]);', 'const relOf = (q) => G.rel[0][q];', 'tests/cards.py', "a group's row reads the fifth side's stance", 'Misfits:'),
  ('29-card-pages.js', '\t\t\twant && !lord && !war\n', '\t\t\tfalse && want\n', 'tests/cards.py', 'a picked stance shows no change', 'Foe → Neutral'),
  ('29-card-pages.js', "\t\t\t\t\t? `<small class=\"chg\">${sw(rel)} →</small><small class=\"chg\">${sw(want)}</small>`\n", "\t\t\t\t\t? `<small class=\"chg\">${sw(rel)} → ${sw(want)}</small>`\n", 'tests/wild.py', 'the change on one line in a one-slot name', 'cut in its slot at 375'),
  # the outside review's four (Nov 1): tests/wild.py R1 to R4
  ('32-frame.js', "const STATUS_CUT = ['stSea'];", 'const STATUS_CUT = [];', 'tests/wild.py', 'the strip lets no cell go when Iron is hidden', 'R1:'),
  ('32-frame.js', '\t\t\t\tel.hidden = off;', '\t\t\t\tel.hidden = off || id === STATUS[STATUS.length - 1][0] && n < STATUS.length;', 'tests/wild.py', 'the strip drops the soldier count', 'R1:'),
  ('39-huddle.js', '`<div class="duo">${sym(`sqpk', '`<div>${sym(`sqpk', 'tests/wild.py', "the squad's − and + do not split their tile", 'R2:'),
  ('33-verbs.js', '\t\tcloseCard(); // the map behind a paused card', '\t\t// the map behind a paused card', 'tests/wild.py', 'a jump leaves the card open', 'R3:'),
  ('33-verbs.js', "\tconst off = el.closest('.dis, .lock');", "\tconst off = /(^|\\s)(dis|lock)(\\s|$)/.test(el.className) ? el : null;", 'tests/wild.py', "a locked slider's switch counts as used", 'R4:'),
]

def plant_check():
    print(f'planted bugs: {len(PLANTS)}')
    os.environ['FK_PLANT'] = '1'   # tests/map.py runs 25 seeds and one phone size for each plant (the gate runs it whole)
    tmp = tempfile.mkdtemp(prefix='fk-plant-')
    try:
        for name in os.listdir(ROOT):
            if name in ('.git', 'node_modules', '__pycache__'): continue
            s, d = os.path.join(ROOT, name), os.path.join(tmp, name)
            (shutil.copytree if os.path.isdir(s) else shutil.copy2)(s, d)
        c, out = run([PY, 'build.py'], cwd=tmp)
        say(c == 0, 'the clean copy builds', out[-300:])
        clean_ok = {}
        for test in sorted({p[3] for p in PLANTS}):
            c, out = run([PY, test], cwd=tmp)
            clean_ok[test] = c == 0
            say(c == 0, f'{test} passes on the clean copy (the control run)', out[-300:])
        clean = {}
        for f, old, new, test, why, expect in PLANTS:
            p = os.path.join(tmp, 'src', f)
            if f not in clean: clean[f] = open(p).read()
            src = clean[f]
            if old not in src:
                say(False, f'planted bug "{why}"', f'the text to plant in {f} is gone: update PLANTS in tests/handoff.py')
                continue
            if not clean_ok[test]:
                say(False, f'planted bug "{why}"', f'{test} fails on the clean copy, so it proves nothing'); continue
            open(p, 'w').write(src.replace(old, new, 1))
            try:
                c, out = run([PY, 'build.py'], cwd=tmp)
                if c: say(False, f'planted bug "{why}"', 'the build failed with the bug in: a broken build is not a caught bug'); continue
                c, out = run([PY, test], cwd=tmp)
                fail_line = any(l.startswith('FAIL ') and expect in l for l in out.splitlines())
                crashed = 'Traceback' in out
                say(c != 0 and fail_line and not crashed, f'planted bug "{why}" is caught by {test}',
                    'the test PASSED with the bug in: it cannot fail' if c == 0 else 'the test crashed instead of failing' if crashed else f'the test failed, but not with "{expect}": ' + out.strip()[-200:])
            finally:
                open(p, 'w').write(src)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

def state():
    c, out = run(['git', 'status', '--short'])
    say(not out.strip(), 'the working tree is clean (nothing uncommitted)', out.strip().replace('\n', ' | ')[:200])
    c, out = run(['git', 'log', '-1', '--format=%h %an <%ae> %s'])
    print('last commit:', out.strip())
    say('acohen2300@users.noreply.github.com' in out, 'the last commit is Albert\'s noreply address', out.strip())
    print('preview: https://acohen2300.github.io/first-keep/preview/   live: only on Albert\'s word')

def owed():
    # one maintained list: the "Owed" section of the Build List (Build 80 preview 9; before, old CUTS lines were grepped, and built items printed as owed)
    print('\nOWED (docs/Build List - v80 - Post Clean - Working.md, section "Owed"; read these before building anything):')
    lines = open(os.path.join(ROOT, 'docs', 'Build List - v80 - Post Clean - Working.md')).read().split('\n## Owed', 1)
    if len(lines) < 2: say(False, 'the Build List has an "Owed" section'); return
    for line in lines[1].split('\n## ', 1)[0].splitlines()[1:]:
        if line.startswith('- '): print('  ' + line)
    print('  the decision record and the audit are in docs/v80 Audit/')

if __name__ == '__main__':
    only = sys.argv[1] if len(sys.argv) > 1 else ''
    state()
    if only != '--state':
        if only != '--plant':
            for a, name in (([PY, 'build.py'], 'build.py'), ([PY, 'wrap.py'], 'wrap.py'), ([PY, 'tests/lint.py'], 'lint')):
                c, out = run(a); say(c == 0, name + ' is clean', out[-300:])
            c, out = run([PY, 'tests/gate.py'], timeout=1200)
            for l in out.splitlines():
                if l.startswith('FAIL'): fails.append(l[:200]); print(l[:300])
            say(c == 0, 'the gate passes (science, history, tables, saves, moves, palette, words, four phone sizes, baseline)')
        plant_check()
    owed()
    print('\n' + ('START QC PASSED' if not fails else 'START QC FAILED: ' + str(len(fails)) + ' problem(s) above; report them before touching anything'))
    sys.exit(1 if fails else 0)
