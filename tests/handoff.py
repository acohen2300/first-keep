# The start QC for any hand-off (Build 80). One command, the same checks every time:
#   python3 tests/handoff.py            everything: state, build, lint, the gate, the planted-bug check, what is owed
#   python3 tests/handoff.py --plant    only the planted-bug check (can the tests still fail?); --plant --only=word runs just the plants named with that word
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
  ('39-huddle.js', "pic('emg:hands', ICON.sword, W[2][0], '', on('hands'))", "pic('emg:hands', ICON.sword, W[2][0], '', null)", 'tests/saves.py', 'Garrison never shows on', 'Garrison is on'),
  ('33-verbs.js', "		hudPage(G.hud.page === 'war' ? 'jobs' : 'war');", "		hudPage('war');", 'tests/cards.py', 'the station: the Alarm button does not turn back', 'again went to'),
  ('33-verbs.js', "		H.mid = H.mid === a ? SMID.map : a;", "		H.mid = a;", 'tests/cards.py', 'the station: Train again does not bring the map back', 'bring the small map back'),
  # movement and work (tests/moves.py)
  ('12-sim-core.js', "dr = (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),", "dr = n.kind === 'fish' ? null : (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),", 'tests/moves.py', 'fish pay no walk home', 'a fish far from'),
  ('16-sim-fight.js', 'if (dx === 0 && dy === 0) {', 'if (false) {', 'tests/moves.py', 'two units on one spot never part', 'did not part'),
  ('40-emergency.js', "armyFree(0, 'unarmed', 'escort', 'rout', 'school');", "armyFree(0, 'unarmed', 'escort', 'rout');", 'tests/moves.py', 'a student is pulled out of the School', 'out of the School'),   # repointed Nov 2 (O2: one army home)
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
  ('12-sim-core.js', ': dist(nearest(drops, n) || keepOf(u.owner) || n, n) > REACH))', ': false))', 'tests/moves.py', 'no leash from the drop-off', 'past the leash'),
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
  ('12-sim-core.js', 'u.anchor ? dist(u.anchor, n) > REACH :', 'u.anchor ? false :', 'tests/moves.py', 'no cap for a placed villager', 'past the cap'),
  ('13-sim-civil.js', 'lost ? u.anchor || dropFor(u.owner, u.job, u) || u : undefined', 'lost ? dropFor(u.owner, u.job, u) || u : undefined', 'tests/moves.py', 'a placed villager searches from the drop-off', 'search from where it was placed'),
  # Build 80 preview 19: S1, S2 (--only=S1 / S2)
  ('30-cards.js', "mine ? '' : P.name, // your own building", "mine ? 'yours' : P.name, // your own building", 'tests/cards.py', 'S1: your own building says yours', 'S1:'),
  ('30-cards.js', "acts(end, 'c6')", "acts(end)", 'tests/cards.py', 'S2: the last rank is not one slot each', 'S2:'),
  # Build 80 preview 18: T1, Train and Research double-wide, a short rank filled (--only=T1)
  ('27-cards-core.js', "empty().repeat((3 - (cells.length % 3)) % 3)", "empty().repeat(0)", 'tests/cards.py', 'T1: a short Train or Research rank is not filled', 'T1:'),
  ('29-card-pages.js', "acts(cells.join(''), 'c6 queue')", "acts(cells.join(''), 'c6')", 'tests/cards.py', 'Q1: the training line loses its steel box', 'Q1:'),
  ('shell-head.html', 'max-height:var(--capH);', 'height:var(--capH);', 'tests/cards.py', 'card sizes: a card pads itself to its cap, a gap over the row', 'card sizes'),
  ('08-core.js', "const shapeOf = (u) => (u.wall > G.t ? FORM[2] :", "const shapeOf = (u) => (false ? FORM[2] :", 'tests/gate.py', 'director: a shield wall stands to no shape', 'Shield wall did not'),
  ('28-army-quick.js', "		for (const u of S) u.cd = 0; // the reload lined up", "		// the reload lined up", 'tests/gate.py', 'director: Loose lines up no reload', 'Loose did not line up'),
  ('28-army-quick.js', "		G.looseT = G.t + DIRECT.loose;", "", 'tests/gate.py', 'director: the volley is a machine gun (no reload wait)', 'volley again at once'),
  ('28-army-quick.js', "		if (why) return why; // winded", "		// winded", 'tests/gate.py', 'director: winded riders are still sent off', 'winded riders'),
  ('33-verbs.js', "hyp(e.clientX - lpAt.x, e.clientY - lpAt.y) < 8", "false", 'tests/gate.py', 'hold: a thumb that rolls a pixel loses its hold', 'rolls'),
  ('39-huddle.js', "w ? `${w} s` : tap[1]", "tap[1]", 'tests/gate.py', "director: the wait of the riders never shows", 'is not on their slot'),
  ('28-army-quick.js', "			b = nearestFoeBld(0, h.e, undefined, 300);", "			b = null;", 'tests/gate.py', 'director: Bombard ignores the enemy building', 'did not aim the engines'),
  ('26-input.js', "		miniAt.pan = true;", "", 'tests/gate.py', 'the small map: a drag does not sweep the camera', 'did not sweep'),
  ('32-frame.js', "		txt('mailN', (G.mailN || 0) > 99 ? '99+' : String(G.mailN || 0));", "		txt('mailN', '0');", 'tests/gate.py', 'mail: the button never counts the unread', 'count the unread'),
  ('shell-head.html', '#mailB .top{top:50%;gap:0}', '#mailB .top{top:13px;gap:0}', 'tests/gate.py', 'mail: the icon rides high in its slot', 'mail icon is not centred'),
  ('shell-head.html', '#mailB.dis .top .c{display:none}', '', 'tests/gate.py', 'mail: the badge shows at 0', 'badge shows at 0'),
  ('01-rules-basics.js', "const BN = ['Alpha', 'Bravo', 'Charlie'],", "const BN = ['Alpha', 'Bravo', 'Charlie', 'Delta'],", 'tests/gate.py', 'squads: a fourth squad comes back', 'not Alpha, Bravo and Charlie'),
  ('39-huddle.js', " + pic('sqsetup', ICON.gear, ROW_WORD.setup, hasCmd() ? '' : 'dis')", '', 'tests/gate.py', 'squads: the Set Up tile is gone', 'not Alpha, Bravo, Charlie and Set Up'),
  ('34-save.js', "		if (typeof S.sel === 'number' && S.sel >= BNS) S.sel = 'all';\n		S.v = 44;", '		S.v = 44;', 'tests/saves.py', 'squads: an old save keeps a selection of the fourth squad', 'selection or temper is wrong'),
  ('26-input.js', "		showQuick(sx, sy, h.e.x, h.e.y);\n		return;", "		return;", 'tests/gate.py', 'quick: a tap on open ground puts no sword down', 'put no sword down'),
  ('33-verbs.js', "	qsword() {\n		quickGo();", "	qsword() {", 'tests/gate.py', 'quick: the sword sends nobody', 'did not send the army'),
  ('26-input.js', "	if (G.qa) return hideQuick(); // the sword and", "	if (false) return hideQuick(); // the sword and", 'tests/gate.py', 'quick: a tap elsewhere leaves the chips up', 'a tap elsewhere left the chips up'),
  ('26-input.js', "	if (mine.length) {\n		order(mine, h);", "	if (false) {\n		order(mine, h);", 'tests/gate.py', 'quick: a tap ignores the units you picked', 'with a soldier picked'),
  ('26-input.js', "	PRESS_SHOW = 250,", "	PRESS_SHOW = 90,", 'tests/gate.py', 'quick: the hold ring flashes on every tap', "the hold's ring shows"),
  ('13-sim-civil.js', "			if (BLD[b.kind].drop && !u.plot && startWork(u, b)) {", "			if (false) {", 'tests/moves.py', 'mine: its builder goes back instead of working the gold', 'did not work the gold beside it'),
  ('11-orders.js', "		if (!why.scare) {\n			say(", "		if (false) {\n			say(", 'tests/moves.py', 'mine: a send to a guarded find says nothing and goes', 'a wolf stands by'),
  ('13-sim-civil.js', "		if (!(why.scare && u.sent && u.node && u.fn === u.node.id)) {", "		if (true) {", 'tests/moves.py', 'mine: your order gives way to a fright remembered', 'your own villager left the gold'),
  ('28-army-quick.js', "		dress(S, c, { x: (to.x - c.x) / d, y: (to.y - c.y) / d }, 'line', DIRECT.wall);", "", 'tests/gate.py', 'director: Shield wall forms no line', 'Shield wall set no line'),
  ('12-sim-core.js', "				if (D && shape === 'arc') {", "				if (false) {", 'tests/gate.py', 'director: the archers stand in no arc', 'not on one arc'),
  ('14-sim-troops.js', "	if (tgt && drillOn(u)) {", "	if (false) {", 'tests/gate.py', 'director: a drilled soldier chases out of its place', 'left its place to chase'),
  ('34-save.js', "	if (!G || G.over || G.test || seenErr.size", "	if (!G || G.over || seenErr.size", 'tests/testfield.py', 'test field: saved over the real game', 'saved over the real game'),
  ('25-view-weather.js', "	ctx.fillRect(0, 0, cw, top); // the sky runs to the top", "	// the sky runs to the top", 'tests/gate.py', 'sky: stops under the bars again', 'does not run to the top'),
  ('41-boot.js', "		if (cv.width !== Math.round(cv.clientWidth * dpr) || cv.height !== Math.round(cv.clientHeight * dpr)) fit();", "", 'tests/gate.py', 'guard: the map is not measured again when its drawing is off', 'measured again on the next frame'),
  ('39-huddle.js', "	if (mb && mini.parentNode !== mb) mb.appendChild(mini);", "	if (false) mb.appendChild(mini);", 'tests/cards.py', 'the station: the small map never comes into the middle', 'the small map'),
  ('27-cards-core.js', "' work' : ' life'}", "' work' : ''}", 'tests/cards.py', 'title: the health bar is gone from the title box', 'the title box'),
  ('shell-head.html', '--glass:92%;', '--glass:75%;', 'tests/palette.py', 'glass: the card too see-through to read', 'glass card'),
  ('28-army-quick.js', "	if (S.length) order(S, C.h);", "	if (S.length && false) order(S, C.h);", 'tests/gate.py', 'hold: a full ring sends nobody', 'did not send every soldier'),
  ('26-input.js', "	if (h.t !== 'ground' || picked().length) return tapAt(sx, sy);", "	return tapAt(sx, sy);", 'tests/gate.py', 'a hold on the ground no longer opens the Here card', 'hold on the ground'),
  ('shell-head.html', '[data-act^="tech:"].dis:not(.pill>*){border-color:var(--white-faint)}', '', 'tests/cards.py', 'levels: a dim tech loses its faint white edge', 'the levels'),
  ('shell-head.html', '--dim:80%;', '--dim:50%;', 'tests/palette.py', 'levels: the dim white too faint to read', 'the dim white'),
  # Build 80 preview 15: D-091 to D-093 (--only=p15)
  ('11-orders.js', '\tif (!v && hand(o)) {', '\tif (false) {', 'tests/moves.py', 'p15: a site placed with nobody idle gets no builder', 'got no builder'),
  ('11-orders.js', "\t\tv.pn = v.node ? v.node.id : null;", "\t\tv.pn = null;", 'tests/moves.py', 'p15: a builder goes back to any find, not the one it left', 'the very find it left'),
  ('13-sim-civil.js', 'u.spot = p ? { b: b.id, i: p.i } : null;', 'u.spot = null;', 'tests/moves.py', 'p15: a posted waiter has no spot of its own', 'no spot of its own'),
  ('16-sim-fight.js', '\t\tif (ra) settle(a);\n\t\tif (rb) settle(b);', '', 'tests/moves.py', 'p15: villagers at rest shuffle', 'still shuffle'),
  ('13-sim-civil.js', 'if (u.focus && !u.plot && !u.hunt', 'if (false && !u.plot && !u.hunt', 'tests/moves.py', 'p15: a focused villager moves on when its bush is spent', 'a focused villager whose bush ran out'),
  ('11-orders.js', "const V = unitsOf(o, 'vil').filter((u) => !u.inside && !posted(u) && !u.focus),", "const V = unitsOf(o, 'vil').filter((u) => !u.inside && !posted(u)),", 'tests/moves.py', 'p15: + takes a focused villager', 'took a focused villager'),
  # Build 80 preview 14: D-089, posted and roaming (--only=posted)
  ('13-sim-civil.js', 'if (u.plot && !u.node && !u.hunt && u.job) {', 'if (false) {', 'tests/moves.py', 'posted: a farmer back from shelter takes the best rate, not its field', 'left its field'),
  ('11-orders.js', 'else if (n && n.farm) u.plot = n.farm.id;', 'else if (false) u.plot = 0;', 'tests/moves.py', 'posted: an order to a field does not post the villager', 'left its field'),
  ('11-orders.js', "const V = unitsOf(o, 'vil').filter((u) => !u.inside && !posted(u) && !u.focus),", "const V = unitsOf(o, 'vil').filter((u) => !u.inside && !u.focus),", 'tests/moves.py', 'posted: + and − take a farmer', 'took the farmer'),
  ('40-emergency.js', 'u.plot = pl; // posted', '// posted', 'tests/moves.py', 'posted: the Town square frees a farmer', 'standing in the Town square'),
  ('12-sim-core.js', '\tif (strict) return null;\n', '', 'tests/moves.py', 'posted: a building order pulls a villager at work', 'who was at work'),
  ('32-frame.js', ' + G.blds.filter(idlePost).length', '', 'tests/moves.py', 'posted: the strip leaves out the empty fields', 'the strip shows z'),
  # Build 80 preview 13: reach and the overflow of waiters
  ('06-rules-tuning.js', 'const REACH = WALL_R;', 'const REACH = 200;', 'tests/science.py', 'the reach is typed, not the wall ring', 'reach'),
  ('06-rules-tuning.js', 'const SEARCH = { x: REACH / 2, y: REACH / 2, tau: 10, again: 2 };', 'const SEARCH = { x: 90, y: 90, tau: 10, again: 2 };', 'tests/moves.py', 'the search stops at 180 again', 'sleeps beside berries'),
  ('13-sim-civil.js', '.filter((x) => standing(x, u.owner) && BLD[x.kind].drop && BLD[x.kind].drop.includes(u.job))', '.filter((x) => x === dropFor(u.owner, u.job, u))', 'tests/moves.py', 'the overflow of waiters piles up at a full drop-off', 'a pile'),
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
  ('30-cards.js', "				{ age: B.age || 0, hp:", "				mine && b.kind === 'market' ? null : { age: B.age || 0, hp:", 'tests/cards.py', 'the Market skips the title box (E11)', 'skips the shared page'),
  ('30-cards.js', "fold('armytrain', 'Train soldiers', list(trainButtons(kinds)))", "fold('armytrain', 'Train soldiers', acts(trainButtons(kinds)))", 'tests/cards.py', "commas between the Army card's Train buttons (E1)", 'commas'),
  ('29-card-pages.js', '\t\t\t`${Math.floor(made)} made`,', '\t\t\t`${w ? Math.floor(w.st.got || 0) : 0} made`,', 'tests/cards.py', "a workshop counts its worker's gathering (E2)", 'E2: the workshop says'),
  ('26-input.js', "if (n.kind !== 'farm' && (!G.fogOn || fogAt(n.x, n.y) > 0)) {", "if (n.kind !== 'farm') {", 'tests/cards.py', 'a find under the fog can be tapped (E4)', 'under the fog was tapped'),
  ('26-input.js', '\tif (G.hud) G.hud.drag = false;\n\tG.box = null;\n\tdrag = null;\n}', '\tdrag = null;\n}', 'tests/cards.py', 'a pinch leaves the box and the glow (E5)', 'a pinch left the box'),
  ('27-cards-core.js', "\t\t\tsub = why && told === costText(cost) ? (p.hungry ? 'hungry' : 'line full') : told;", '\t\t\tsub = told;', 'tests/cards.py', 'a dim Train button shows its cost as payable (E6)', 'does not say why'),
  ('30-cards.js', '\tcardPause(c);\n', '', 'tests/cards.py', 'the pause is decided once at open (E7)', 'did not pause'),
  ('29-card-pages.js', '<small>${more.short || more.name}</small></button>`,', '<small>research</small></button>`,', 'tests/cards.py', 'a locked place says research, not its name', 'not its research'),
  ('shell-head.html', '#row button{box-shadow:var(--shade)}', '#row button{box-shadow:var(--shade)}#orders::before{content:""}', 'tests/cards.py', 'a panel comes back behind the row', 'a panel is drawn'),
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
  ('10-world.js', '(home ? near < BACK.near || far > HOME.clear : near - (MOVE_IDS.has(id) ? c0 : 0) < HOME.out)', '(home ? near < BACK.near || far > HOME.clear : false)', 'tests/map.py', 'a wild find with nodes inside the wall band', 'the home zone'),
  ('10-world.js', '(home ? near < BACK.near || far > HOME.clear : near - (MOVE_IDS.has(id) ? c0 : 0) < HOME.out)', '(home ? false : near - (MOVE_IDS.has(id) ? c0 : 0) < HOME.out)', 'tests/map.py', 'home finds past the clearing', 'the home zone'),
  ('10-world.js', 'd = back ? rnd(r0, r1) : home ? r0 :', 'd = back ? rnd(r0, r1) : home ? rnd(r0 - 30, r0 + 30) :', 'tests/map.py', 'home finds at random walks, not the same in every corner', 'the home zone'),
  ('10-world.js', "['goldP', HOME.at(2), HOME.at(2), 24],\n\t['stoneP', HOME.at(3), HOME.at(3), 24],", "['goldP', HOME.at(3), HOME.at(3), 24],\n\t['stoneP', HOME.at(2), HOME.at(2), 24],", 'tests/map.py', 'stone nearer than gold, against the order the ages need them', 'the home zone'),
  ('10-world.js', '{ x: 0, y: 0, r: HOME.out }, // the forest starts past the wall band', '{ x: 0, y: 0, r: HOME.clear }, // the forest starts past the wall band', 'tests/map.py', 'forest in the wall band', 'the home zone'),
  # the three zones (Albert, Nov 1, answer 2): zone 1 behind the Town Center with Bronze's cost and its margin
  ('10-world.js', 'if (!N.every(([nx, ny]) => inBack(nx, ny) &&', 'if (!N.every(([nx, ny]) => true &&', 'tests/map.py', 'zone 1 laid out front, not behind the Town Center', 'the home zones'),
  ('06-rules-tuning.js', 'food: AGES[1].cost.f + BACK_MARGIN.vils * UNIT.vil.cost.f,', 'food: 550,', 'tests/map.py', "zone 1's food typed, not worked out from the costs", 'the home zones'),
  ('10-world.js', 'const m = fixed.has(n) ? 1 : Ld.amt[n.type] || 1;', 'const m = Ld.amt[n.type] || 1;', 'tests/map.py', "zone 1 scaled by the land's amt", 'the home zones'),
  ('10-world.js', ' || N.some(([nx, ny]) => inBack(nx, ny))) continue;', ') continue;', 'tests/map.py', 'zone 2 and the wild laid in zone 1', 'the home zones'),
  ('10-world.js', 'Math.min(nx, ny) >= lo + BACK.edge))', 'Math.min(nx, ny) >= lo + gap))', 'tests/map.py', 'zone 1 two squares from the map edge, under half a tap', 'the home zones'),
  ('10-world.js', 'clr = back ? ext + gap / 2 : c0;', 'clr = back ? ext : c0;', 'tests/map.py', 'zone 1 without its two-square gaps', 'the home zones'),
  # every building two squares from every find (Albert, Nov 1 13:00)
  ('09-nav.js', 'gapF = LANE * NAVC,', 'gapF = 6,', 'tests/map.py', 'a building within two squares of a tree', 'any find'),
  ('09-nav.js', "edge(nd) < gapF))", "Math.abs(nd.x - sp.x) < half + gapF && Math.abs(nd.y - sp.y) < half + gapF))", 'tests/map.py', 'the find gap a square box, not from the footprint edge', 'any find'),
  ('06-rules-tuning.js', 'const WALL_R = Math.ceil((HOME.clear + NAVC * Math.SQRT2 + LANE * NAVC) / NAVC) * NAVC;', 'const WALL_R = HOME.clear + LANE * NAVC + NAVC;', 'tests/map.py', "the wall ring inside a find's gap", 'any find'),
  # the start (Albert, Nov 1 14:18, 14:23): 200 of each but iron; EXCEPTIONS #16, the computers' handicap
  ('10-world.js', 'res: { ...START_RES },', 'res: { f: 200, w: 200, s: 100, g: 50, i: 0 },', 'tests/map.py', 'the old typed starting stores', 'the start:'),
  ('10-world.js', 'for (let o = 1; o < WILD; o++)\n\t\tfor (const kind of HANDICAP.blds)', 'for (let o = 0; o < WILD; o++)\n\t\tfor (const kind of HANDICAP.blds)', 'tests/map.py', 'the player gets the handicap too', 'the start:'),
  ('10-world.js', 'G.blds.push(mkBld(o, kind, s.x, s.y, 1));\n\t\t\tnavRebuild();', 'G.blds.push(mkBld(o, kind, s.x, s.y, 1));', 'tests/map.py', 'the handicap laid on an empty grid (it can overlap)', 'the start:'),
  ('10-world.js', 's = k && findSpot(o, kind, k.x, k.y, HANDICAP.r[0], HANDICAP.r[1]);', 's = k && { x: k.x + 70, y: k.y + 40 };', 'tests/map.py', 'the handicap laid by hand, not by the rules', 'the start:'),
  # the ghost (Albert, Nov 1 12:48): no build grid, no footprint box; the art tinted by canPlace
  ('24-view-overlays.js', '\tdrawGuides(sp, n / 2);\n\tconst s = quant', '\tctx.beginPath();\n\tfor (let i = 0; i <= B.fp; i++) ctx.lineTo(SX(sp.x + i * NAVC), SY(sp.y));\n\tctx.stroke();\n\tdrawGuides(sp, n / 2);\n\tconst s = quant', 'tests/map.py', 'the build grid drawn under the ghost', 'the ghost:'),
  ('24-view-overlays.js', '\tdrawGuides(sp, n / 2);\n\tconst s = quant', '\tctx.strokeRect(SX(sp.x - n / 2), SY(sp.y - n / 2), n * z, n * z * TILT);\n\tdrawGuides(sp, n / 2);\n\tconst s = quant', 'tests/map.py', 'the footprint box drawn round the ghost', 'the ghost:'),
  ('24-view-overlays.js', 'stamp(ghostTint(c, ok),', 'stamp(ghostTint(c, !ok),', 'tests/map.py', 'the ghost tinted against canPlace', 'the ghost:'),
  ('24-view-overlays.js', 'stamp(ghostTint(c, ok),', 'stamp(c,', 'tests/map.py', 'the ghost not tinted', 'the ghost:'),
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
  ('37-events.js', 'if (lead && A[lead - 1] !== (lead > 1 ? A[lead - 2] : c.wet))', 'if (lead && A[lead - 1] === (lead > 1 ? A[lead - 2] : c.wet))', 'tests/tables.py', 'the sky is told when it does not change (D-062: one minute, Weather signs only)', 'N10: Weather signs did not warn'),
  ('34-save.js', '(S.P[b.owner] && refund(S.P[b.owner], j), false)', '(S.P[b.owner] && addRes(S.P[b.owner].res, j.paid || {}), false)', 'tests/saves.py', 'the Printing refund skips the ledger and research spent', 'N12: the Printing refund'),
  ('04-rules-tech.js', 'within ${UNIT.caravan.armed.rng} for ${UNIT.caravan.armed.dmg}', 'within ${UNIT.caravan.armed.dmg} for ${UNIT.caravan.armed.rng}', 'tests/tables.py', 'the Armed caravans card swaps reach and hit', 'N12: the Armed caravans card'),
  ('12-sim-core.js', "? insulate(fxv(o, 'cold').a) : 1", "? 1 - Math.min(1, fxv(o, 'cold').a) : 1", 'tests/science.py', 'climate steps add up to immunity', 'one cloak halves'),
  ('37-events.js', 'while (A.length < Math.max(1, lead))', 'while (A.length < 2)', 'tests/tables.py', 'the sky is rolled further ahead than the forecast', 'N10: Weather signs roll'),
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
  ('08-core.js', '(!calm4b(x.owner) || struckBy(me, x))', '(true)', 'tests/wild.py', 'the wild starts fights with computers', 'never struck it for a foe'),
  ('08-core.js', '!(G.t - (L[x.id] ?? -1e9) < NATIVE.struck)) return false;', 'false) return false;', 'tests/wild.py', 'a camp never forgets who struck it', 'after a minute'),
  ('08-core.js', '\treturn dist(x, h) < h.r;', '\treturn true;', 'tests/wild.py', 'a camp chases its instigator anywhere', 'off its own ground'),
  ('38-natives.js', "(p) => p.id !== WILD && !calm4b(p.id) && p.alive && keepOf(p.id) && gangRel(p.id, 'rob')", "(p) => p.id !== WILD && p.alive && keepOf(p.id) && gangRel(p.id, 'rob')", 'tests/wild.py', 'raids ride for computers', 'a raid rode'),
  ('14-sim-troops.js', "\t\tif (full && u.owner === 0) say('At Maximum Occupancy Capacity', '', TOAST.short);", '', 'tests/wild.py', 'a conversion refused at the ceiling says nothing', '11:'),
  ('39-games.js', 'if (G.truce !== null && G.t - (G.gamesT ?? 0) >= PEACE.games.every) {', 'if (G.t - (G.gamesT ?? 0) >= PEACE.games.every) {', 'tests/wild.py', 'the Games are held at war', 'A1:'),
  ('09-nav.js', '=> Math.floor(Math.sqrt(R * R - (i - R) ** 2))', '=> Math.round(Math.sqrt(R * R - (i - R) ** 2))', 'tests/wild.py', 'the row disc is not the disc', 'A2:'),
  ('16-sim-fight.js', "\t\t\t\tif (v.job === 'repair') continue;", '', 'tests/wild.py', 'a bitten builder leaves its site', 'A3:'),
  ('14-sim-troops.js', '|| (t && !(t.hp > 0 && !t.inside))) {', '|| !(t && t.hp > 0 && !t.inside)) {', 'tests/wild.py', 'the wild looks every tick', 'A4:'),
  ('09-nav.js', 'const gx = Math.floor((x1 + (dx * i) / n) / NAVC),', 'const gx = Math.round((x1 + (dx * i) / n) / NAVC),', 'tests/wild.py', 'the inlined line test rounds its square', 'A5:'),
  ('09-nav.js', 'C0 = COMPS[o] || (COMPS[o] = { comp: new Int32Array(NC * NC) });', 'C0 = { ...COMPS[o], comp: new Int32Array(NC * NC) };\n\tCOMPS[o] = C0;', 'tests/wild.py', 'a new region buffer each flood', 'A6:'),
  ('12-sim-core.js', '\t\tif (tree) G.navDirty = true;', '\t\tif (spent) G.navDirty = true;', 'tests/wild.py', 'a picked bush rebuilds the grid', 'A7:'),
  ('17-ai.js', '\t\tnavOnce(() => {\n\t\t\tfor (const c of plan) {', '\t\t((f) => f())(() => {\n\t\t\tfor (const c of plan) {', 'tests/wild.py', "the computers' wall plan rebuilds the grid each piece", 'A8:'),
  ('36-economy.js', '\t\tseasonN: 0,\n', '\t\tseasonN: 0,\n\t\tyearN: 0,\n', 'tests/wild.py', 'a dead field is made again', 'A9:'),
  ('38-natives.js', '* REGARD.decay) / 100) * BEAT.natives[0];', '* REGARD.decay) / 100) * 5;', 'tests/wild.py', 'the regard drift types its own beat', 'A10:'),
  ('32-frame.js', "\tif ($('place').hidden === !!G.place) $('place').hidden = !G.place;", '', 'tests/wild.py', 'the place bar outlives its game', 'B5:'),
  ('30-cards.js', "done && B.wood\n\t\t\t\t\t? btn(", "b.fire > 0\n\t\t\t\t\t? btn(", 'tests/wild.py', 'a fire adds a rank to the building card', 'B6:'),
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
  # the fresh review of wild81 (Nov 1)
  ('11-orders.js', '\telse u.hunt = null; // sent to build', '\t; // sent to build', 'tests/wild.py', 'a hunter sent to build hunts first', 'A3: a hunter sent to build'),
  ('09-nav.js', '\t\t\tif (!gk || isFoe(WILD, { owner: o, id: -1, x: f.x, y: f.y }, { owner: WILD, kind: gk, find: f.id, hx: f.x, hy: f.y }))\n', '\t\t\tif (true)\n', 'tests/wild.py', 'a guarded find is danger whatever the stance', 'D1:'),
  ('09-nav.js', 'if (v.owner === WILD ? isFoe(WILD, { owner: o, id: -1, x: v.x, y: v.y }, v) : isFoe(o, v))', 'if (isFoe(o, v))', 'tests/wild.py', 'the wild is danger by the side\'s view, not its own', 'D1:'),
  ('37-events.js', "p.id !== WILD && !calm4b(p.id) && p.alive && keepOf(p.id) && gangRel(p.id, 'out') === 'war'), // 4b", "p.id !== WILD && p.alive && keepOf(p.id) && gangRel(p.id, 'out') === 'war'), // 4b", 'tests/wild.py', 'the horde goes for a computer', '4b horde:'),
  ('38-natives.js', ' ||\n\t\t\t\t(b.owner === WILD && calm4b(v.owner)) // 4b', ' // 4b', 'tests/wild.py', "the Natives' pits take computers", '4b pits:'),
  ('08-core.js', '? { ...(throneB() || me || { x: MID, y: MID }), r: YARD }', '? { ...(throneB() || me || { x: MID, y: MID }), r: 1e9 }', 'tests/wild.py', 'the Natives chase past their yard', '4b leash:'),
  # Albert's answers of Nov 1, 11:12 to 11:14: every group can be a friend; raids follow the robbers alone
  ('29-card-pages.js', 'const stanceOff = (q) => relLord(q);', "const stanceOff = (q, k) => relLord(q) || (k === 'ally' && !!gangKey(q) && gangKey(q) !== 'nat');", 'tests/wild.py', "a group's handshake is dim", 'S1:'),
  ('33-verbs.js', '\t\tif (stanceOff(n, w)) return say(', '\t\tif (false) return say(', 'tests/wild.py', 'a dim icon takes the pick', 'S1:'),
  ('38-natives.js', "\t\tgangSet(from, g, 'ally');", '\t\t;', 'tests/wild.py', 'a group never takes you as a friend', 'G1:'),
  ('38-natives.js', "keepOf(p.id) && gangRel(p.id, 'rob') === 'war'); // the raiders", "keepOf(p.id) && G.rel[p.id][WILD] === 'war' && gangRel(p.id, 'rob') === 'war'); // the raiders", 'tests/wild.py', 'raids need war with the Natives too', 'G2:'),
  # decision 5 (no ambush) and decision 6 (hunger) of Nov 1
  ('16-sim-fight.js', "\t\tif (a && A.gun && hasTag(t.kind, 'native')) d *= NATIVE.gunHit;", "\t\tif (a && a.native && !isB && !onLand(a.x, a.y)) d *= 1.3;\n\t\tif (a && A.gun && hasTag(t.kind, 'native')) d *= NATIVE.gunHit;", 'tests/wild.py', 'an ambush bonus comes back', '12:'),
  ('37-events.js', '\tp.famT = p.hungry && !foodInReach(o) ? (p.famT || 0) + 1 : 0;', '\tp.famT = p.hungry ? (p.famT || 0) + 1 : 0;', 'tests/wild.py', 'an empty store with food in reach is a famine', 'H1:'),
  ('36-economy.js', "\t\t\t\t\tif (o === 0 && foodInReach(0)) news('home', 'Food stores empty: put villagers on food.', 'warn', TOAST.long); // with none in reach the famine toast speaks", '', 'tests/wild.py', 'no toast for an empty store', 'H1:'),
  ('37-events.js', "\tif (o === 0 && p.famT === 1) news('home', 'Famine: no food in reach. Two days to recover.', 'warn', TOAST.long);", '', 'tests/wild.py', 'no toast when a famine starts', 'H2:'),
  ('36-economy.js', '(G.P[o].famT || 0) >= STARVE.grace ? UPKEEP.hunger : 1);', '(G.P[o].famT || 0) >= 0 ? UPKEEP.hunger : 1);', 'tests/wild.py', 'a famine weakens the work at once', 'H2:'),
  ('37-events.js', "if (!hz('starve') || p.famT < STARVE.grace || (p.famT", "if (!hz('starve') || (p.famT", 'tests/wild.py', 'people leave before the famine weakens them', 'H3:'),
  ('36-economy.js', '\t\t\t\t\tif (n && (n.amt > 0 || n.hp > 0)) {', '\t\t\t\t\tif (false) {', 'tests/wild.py', 'those working food eat from the store', 'H4:'),
  # Albert's sighting of Nov 1 (QC D10): the idle count
  ('08-core.js', "const freeVil = (u) => u.kind === 'vil' && !u.inside && (!u.job || !!u.idle);", "const freeVil = (u) => !u.job && !u.inside;", 'tests/wild.py', 'a waiting villager is not idle to the strip and the idle button', 'D10:'),
  # the docs (Build 80 preview 11, Albert, Nov 1): tests/docs.py
  ('docs/4 Now/Owed.md', '# Owed: the one open list [2026-11-01 07:45]', '# Owed: the one open list', 'tests/docs.py', 'a living line edited with no stamp', 'ends with a stamp'),
  ('docs/6 Records/v70 Record/Picks - v70 - Clean Up Session.md', 'Picks', 'Pick', 'tests/docs.py', 'a closed record edited', 'closed records'),
  ('./START-HERE.md', '`docs/4 Now/Owed.md`', '`docs/4 Now/Owe.md`', 'tests/docs.py', 'a file in the reading order is missing', 'reading order exists'),
  # gatherer caps (Albert, Nov 1, 12:57)
  ('13-sim-civil.js', "const findCap = (n) => (n.kind === 'tree' ? 1 :", "const findCap = (n) => (n.kind === 'tree' ? 3 :", 'tests/wild.py', 'a tree takes three fellers', 'K2:'),
  ('13-sim-civil.js', '\t\tif (held >= findCap(n)) {', '\t\tif (false) {', 'tests/wild.py', 'a full find lets newcomers crowd in', 'K1:'),
  ('12-sim-core.js', '\t\t\tif ((n.wk || 0) - (u.node === n ? 1 : 0) >= findCap(n)) continue; // full', '\t\t\t; // full', 'tests/wild.py', 'the search sends to a full find', 'K3:'),
  ('13-sim-civil.js', "Math.max(1, Math.floor((2 * Math.PI * (WORK_R[n.kind] ?? WORK_R.other)) / SPACE))", "Math.max(1, 3)", 'tests/wild.py', 'a find holds a typed number', 'K1:'),
  # item 5 on six seeds (the map-zones builder's find, Nov 1)
  ('16-sim-fight.js', '\tif (a.post && b.post && a.post.b != null && a.post.b === b.post.b && !a.job && !b.job) return;', '\tif (false) return;', 'tests/combat.py', 'villagers on their way to their own spots shove each other off', 'item 5 (seed'),
  ('13-sim-civil.js', '\tif (!BLD[a.kind]) {\n\t\t// a group sent to a point (item 5)', '\tif (false) {\n\t\t// a group sent to a point (item 5)', 'tests/combat.py', 'the last to arrive is sent across the crowd', 'item 5 (seed'),
  # fresh review of wild81 (Nov 1): spots let go, trees capped, one toast per case, the horde and the raids by stance, the migration's content
  ('11-orders.js', '\tu.at = null; // a spot held at the old find is let go', '\t// ', 'tests/wild.py', 'an order leaves the old spot held', 'K4:'),
  ('13-sim-civil.js', '\tu.node = null;\n\tu.at = null;\n}', '\tu.node = null;\n}', 'tests/wild.py', 'leaving a find leaves its spot held', 'K4:'),
  ('13-sim-civil.js', "(n.kind === 'tree' || dist(u, n) <", "(dist(u, n) <", 'tests/wild.py', 'a tree is never cap-checked: its feller stands short of it', 'K2:'),
  ('37-events.js', " && keepOf(p.id) && gangRel(p.id, 'out') === 'war'), // 4b", " && keepOf(p.id)), // 4b", 'tests/wild.py', 'the horde rides for a side at peace with the outlaws', 'horde at peace:'),
  ('38-natives.js', " && keepOf(p.id) && gangRel(p.id, 'rob') === 'war'); // the raiders", " && keepOf(p.id)); // the raiders", 'tests/wild.py', 'raids ride for a side at peace with the robbers', 'G2 reverse:'),
  ('34-save.js', 'warBy: N.warBy || {}, hitT: N.hitT || {} },', 'warBy: {}, hitT: {} },', 'tests/wild.py', 'the migration drops the Natives warBy and hitT', 'M42:'),
  ('36-economy.js', "if (o === 0 && foodInReach(0)) news('home', 'Food stores empty", "if (o === 0) news('home', 'Food stores empty", 'tests/wild.py', 'both toasts speak in a true famine', 'H2:'),
  ('06-rules-tuning.js', 'grace: 2 * DAY_LEN', 'grace: 3 * DAY_LEN', 'tests/wild.py', 'the grace changed', 'H2:'),
  ('06-rules-tuning.js', 'every: 30 }', 'every: 20 }', 'tests/wild.py', 'the leaving pace changed', 'H3:'),
  ('03-rules-buildings.js', 'hunger: 0.72', 'hunger: 0.75', 'tests/wild.py', 'the weakening changed', 'H2:'),
  # the Nov 1 text, science and combat batch (branch text81)
  ('07-text.js', 'Room opens when a House or Apartment finishes or a unit dies; an Aqueduct houses no one.', 'Room opens when a House, Apartment or Aqueduct finishes or a unit dies.', 'tests/text81.py', 'a line says the Aqueduct makes room (D-060)', 'D-060'),
  ('04-rules-tech.js', "fx: [{ s: 'spread', m: MEASURED.water }],", "fx: [{ s: 'sick', m: 0.5 }],", 'tests/text81.py', 'Clean water keeps its invented sickness half (D-061)', 'D-061 cleanwater'),
  ('04-rules-tech.js', 'isolate: 0.6,', 'isolate: 0.5,', 'tests/text81.py', 'quarantine off its measured cut (D-061)', 'D-061 isolation'),
  ('04-rules-tech.js', "fx: [{ s: 'crop', k: 'food', m: MEASURED.forecast }],", "fx: [{ s: 'forecast', a: 1 }],", 'tests/tables.py', 'Weather glass back to a forecast only (D-062)', 'D-062'),
  ('04-rules-tech.js', 'cost: { f: 260, w: 180 }, // the price of a weight-5', 'cost: { f: 170, w: 110 }, // the price of a weight-5', 'tests/text81.py', "Charcoal burning off its age's price (D-063)", 'D-063'),
  ('04-rules-tech.js', "fx: [{ s: 'studs', k: ['#infantry', '#civ', '#siege'], a: 1 }],", "fx: [{ s: 'studs', a: 1 }],", 'tests/science.py', "a rider's Crampons grip for the horse (D-064)", 'a horse with Crampons only'),
  ('37-events.js', 'return studs ? Math.max(ice, M.studs) : ice;', 'return studs ? 1 : ice;', 'tests/science.py', 'studs make ice as good as dry ground (D-064)', 'a walker with Crampons'),
  ('07-text.js', 'and the map. Under it a thin strip', 'and speed. Under it a thin strip', 'tests/text81.py', 'the screen help names a speed button (F2)', 'F2'),
  ('07-text.js', 'for (const t of TECH) if (t.tier && !t.civ) (by', 'for (const t of TECH) if (t.tier && !t.civ && !by[t.tier.unit]) (by', 'tests/text81.py', 'the upgrade list leaves ranks out (F3)', 'F3'),
  ('07-text.js', "const techWhy = (id) => WHY['tech:' + id] ?? WHY[id];", 'const techWhy = (id) => WHY[id];', 'tests/text81.py', 'the Legion research shows the Roman unit note (F4)', 'F4'),
  ('07-text.js', "'Great Pyramid done: 2.3 million blocks, no complaints.'", "'The Great Pyramid at Giza is finished. 2.3 million blocks, no complaints filed.'", 'tests/text81.py', 'a chronicle line of 13 words (F5)', 'F5'),
  ('07-text.js', 'by Trajan ten aqueducts', 'by Trajan eleven aqueducts', 'tests/text81.py', 'eleven aqueducts by Trajan (F6)', 'F6'),
  ('07-text.js', "the best paid in the army. Game: an elite rank at the Castle, in the Medieval age, after its own time.'", "the best paid in the army.'", 'tests/history.py', 'an elite dated 27 BC in the Medieval age with no Game: note (F8)', 'elite_roman'),
  ('04-rules-tech.js', 'desc: `The soldiers of your people become ${many},', 'desc: `The soldiers of your people become ${name}s,', 'tests/text81.py', 'Elite crossbowmans (F8)', 'F8'),
  ('07-text.js', '${TEACH.seats} learn at a time per School.', 'Four learn at a time per School.', 'tests/text81.py', 'a hand-copied number in the rules (F9)', 'F9'),
  ('06-rules-tuning.js', "\tchariot: 'cata',\n\tcatapult: 'treb',", "\tchariot: 'cata',\n\tharcher: 'cata',\n\tcatapult: 'treb',", 'tests/text81.py', 'a lesson to the same age (D16)', 'D16'),
  ('13-sim-civil.js', 'const got = u.carry; // the load', 'const got = Math.round(u.carry); // the load', 'tests/text81.py', 'a load rounded at the drop-off (C11)', 'C11'),
  ('13-sim-civil.js', "stash(u.owner, u.carryType, u.carry);\n\t\t\t\tu.st.got += u.carry;", "stash(u.owner, u.carryType, Math.round(u.carry));\n\t\t\t\tu.st.got += u.carry;", 'tests/text81.py', 'a load rounded at the workshop door (C11)', 'C11 shop'),
  ('13-sim-civil.js', "if (u.state === 'look') {\n\t\t\tif ((G.tick + u.id) % 15) return;", "if (u.state === 'look' && (G.tick + u.id) % 15 === 0) {\n\t\t\tif (false) return;", 'tests/text81.py', 'a spy on the look-out walks home (C12)', 'C12'),
  ('13-sim-civil.js', '* gatherMul(u.owner, u.node) * workMul(u);', '* gatherMul(u.owner, u.node) * hungerOf(u.owner);', 'tests/text81.py', 'a sick shepherd milks at full (C15)', 'C15 a sick shepherd'),
  ('13-sim-civil.js', "(u.node && u.node.kind === 'fish' && !dockNear(u.owner, u.node)))", 'false)', 'tests/text81.py', 'a fisher keeps fishing with no dock (C15)', 'C15: a fisher'),
  ('12-sim-core.js', '&& dist(u, v) < MORALE.lossR) near.push(v);', ') near.push(v);', 'tests/text81.py', 'a loss shakes the box, not the circle (C15)', 'C15: a loss shakes'),
  ('11-orders.js', 'const c = unitCost(o, k); // research discounts count (C16)', 'const c = UNIT[k].cost; // research discounts count (C16)', 'tests/text81.py', 'muster ignores research discounts (C16)', 'C16 muster'),
  ('11-orders.js', '> armyRoom(o)) return armyFull(o); // the same ceiling', "> ARMYMAX) return 'Army limit.'; // the same ceiling", 'tests/text81.py', 'hiring uses the wrong army limit (C16)', 'C16: hiring'),
  ('11-orders.js', 'const at = shortest(ready(o, T.at));', 'const at = ready(o, T.at)[0];', 'tests/text81.py', 'research waits at the first building (C16)', 'C16: research'),
  # the computers batch (branch ai81, Nov 1): answer 10 by need, W6, plots, N6, N7, N8, N16a, D2 to D5; tests/ai.py
  ('17-ai.js', '\t\t\tfor (const r of order) {\n\t\t\t\tconst b = bestNode(probe, r, undefined, cm);', '\t\t\tfor (const r of []) {\n\t\t\t\tconst b = bestNode(probe, r, undefined, cm);', 'tests/ai.py', 'a waiting villager goes to the best rate, not the bottleneck', 'A10:'),   # retargeted Nov 2: the old text left with the ai81 merge, so the plant could not run
  ('17-ai.js', 'famine = famineNear(p, plan),', 'famine = false,', 'tests/ai.py', 'no famine runway', 'W6:'),
  ('17-ai.js', 'return plot > wild && (plot - wild) * T > sumCost(B.cost);', 'return plot > wild + 1;', 'tests/ai.py', 'a plot must beat the wild by a margin it never does', 'P1:'),
  ('17-ai.js', 'return plot > wild && (plot - wild) * T', 'return true || plot > wild && (plot - wild) * T', 'tests/ai.py', 'a plot is built whatever the wild pays', 'P2:'),
  ('17-ai.js', 'T = Math.min(timeLeft(), B.reserve', 'T = Math.min(Infinity, B.reserve', 'tests/ai.py', "a plot's payback ignores the time left", 'P3:'),
  ('17-ai.js', "Math.max(...RES.map((r) => rateFrom(o, r, k))) * timeLeft() > sumCost(unitCost(o, 'vil'))", 'true', 'tests/ai.py', 'a villager is trained whatever its payback', 'N7: a villager trained'),
  ('17-ai.js', 'if (k.q.length < 2 && (!saving', 'if (k.q.length < 2 && vils.length < 26 && (!saving', 'tests/ai.py', 'the flat villager ceiling is back', 'N7: 30 villagers'),   # retargeted Nov 2, as above
  ('17-ai.js', '(peaceAll(p.id) ? PEACE.stand.keep : 1)', '(false ? PEACE.stand.keep : 1)', 'tests/ai.py', 'no peace mode', 'N8:'),
  ('39-games.js', 'wealth: (p) => Math.round(p.gathered),', 'wealth: (p) => Math.round(p.gathered + Object.values(p.res).reduce((a, b) => a + b, 0)),', 'tests/ai.py', 'Wealth counts the stores again', 'N6: Wealth'),
  ('16-sim-fight.js', 'warCredit(a.owner, t.owner, UNIT[t.kind].cost);', 'warCredit(a.owner, t.owner, { n: 1 });', 'tests/ai.py', 'War counts kills, not their cost', 'N6: War'),
  ('39-games.js', 'well = ppl.filter((u) => !(u.sick > G.t)).length;', 'well = ppl.length;', 'tests/ai.py', 'Wellbeing ignores the sick', 'N6: Wellbeing'),
  ('38-natives.js', 'if (lanchester(band / Math.max(1e-6, unitPower(v) + guard)) <= 0.5) continue;', ';', 'tests/ai.py', 'the raid ignores what it cannot beat', 'raided'),
  ('38-natives.js', 'NATIVE.raidLoad * load', '0 * load', 'tests/ai.py', 'the raid ignores the load', 'the loaded villager'),
  ('08-core.js', 'let x = rng() * w.reduce', 'let x = Math.random() * w.reduce', 'tests/ai.py', 'the weighted draw uses Math.random', 'seeded dice'),
  ('17-ai.js', 'research(o, firstNeed(o, id) || id)', 'research(o, id)', 'tests/ai.py', 'research skips the step it waits on', 'D2:'),
  ('36-economy.js', '\tif (saving) return;\n', '\n', 'tests/ai.py', "saving for an age, the computers' economy still buys", 'D3: saving'),
  ('36-economy.js', 'p.res.g - ((A && A.cost.g) || 0) > 900', 'p.res.g > 900', 'tests/ai.py', 'a venture from gold the next age needs', 'D3: a venture'),
  ('36-economy.js', 'setRoute(c, t, true, false)', 'setRoute(c, t, true, true)', 'tests/ai.py', 'computer caravans buy spice', 'spice'),
  ('17-ai.js', 'short = Math.max(0, (cost[key] || 0) - (p.res[key] || 0));', 'short = (p.res[key] || 0) > 600 ? 0 : Math.max(0, (cost[key] || 0) - (p.res[key] || 0));', 'tests/ai.py', 'a store over 600 counts as not short', 'D4:'),
  ('17-ai.js', '((p.ai.save && p.ai.save.age === p.age + 1) ||', '((false) ||', 'tests/ai.py', 'a save for an age resets under the mark', 'D5:'),
  # Build 80 preview 37 (--only=p37): the lakes' shore, the juice, the cost of orders, the forming traffic, the shapes and the two map tools
  ('10-world.js', 'for (let k = 2; k <= WATER.harm; k++) L.w.push(', 'for (let k = 2; k <= 1; k++) L.w.push(', 'tests/map.py', 'p37: the lakes are circles again', 'shoreline development'),
  ('16-sim-fight.js', "if (!blockedCell(gcell(t.x + (dx / dd) * JUICE.shove, t.y + (dy / dd) * JUICE.shove), t.owner)) stepTo(t, t.x + (dx / dd) * JUICE.shove, t.y + (dy / dd) * JUICE.shove);", ';', 'tests/combat.py', 'p37: a charge shoves nobody', 'did not shove'),
  ('36-economy.js', 'if (isSoldier(u) && !(u.chg > G.t)) u.tired = Math.max(u.tired || 0, G.t + ORDER.tired);', ';', 'tests/combat.py', 'p37: an order tires nobody', 'not tired'),
  ('16-sim-fight.js', 'ha = fa && fb ? (rankOf(a) > rankOf(b) ? 9 : rankOf(a) < rankOf(b) ? 1 : 3) : heft(a),', 'ha = heft(a),', 'tests/gate.py', 'p37: the ranks no longer give way to each other', 'did not give way'),
  ('12-sim-core.js', "? n // one rank", '? Math.min(n, 3) // p37 plant', 'tests/gate.py', 'p37: the Front stands in column', 'more than one rank'),
  ('08-core.js', "&& !(u.state === 'goto' && u.fanK === u.px + ',' + u.py);", ';', 'tests/gate.py', 'p37: the column snaps back while the shape forms', 'did not give the Front'),
  ('14-sim-troops.js', "if (hyp(u.px + (u.gx || 0) - u.x, u.py + (u.gy || 0) - u.y) < 8) u.hid = true;", ';', 'tests/gate.py', 'p37: nobody goes to ground', 'did not go to ground'),
  ('15-sim-spatial.js', '!v.inside && !v.hid && v.hp > 0', '!v.inside && v.hp > 0', 'tests/gate.py', 'p37: a hidden soldier is a mark', 'saw the ambush'),
  ('28-army-quick.js', 'for (const u of U) u.drill.cols = cols;', 'for (const u of U) u.drill.cols = CHOKE.max;', 'tests/gate.py', 'p37: the choke ignores the width of the gap', 'files'),
  # Build 80 preview 38 (--only=p38): war camps, step 1
  ('38-camps.js', "[...CAMP_TENTS, 'camptower'].forEach((k, i) => put(k, (i - 2) * 3, 0));", "[...CAMP_TENTS, 'camptower'].forEach((k, i) => put(k, (i % 2) * 3, Math.floor(i / 2) * 3));", 'tests/combat.py', 'p38: the outpost is a block, not a strip', 'thin strip'),
  ('38-camps.js', "put(g ? 'gate' : 'palisade', i + 0.5, h - 0.5); // the home side (toward home)", "put(g ? 'gate' : 'palisade', i + 0.5, -h + 0.5); put('palisade', i + 0.5, h - 0.5);", 'tests/combat.py', 'p38: the gate faces away from home', 'facing home'),
  ('38-camps.js', "if (kind === 'camp' && (!p.techs.has('campwagons') || !p.techs.has(CAMP.need))) return 0;", ";", 'tests/combat.py', 'p38: a Camp wagon without the research', 'without the research'),
  ('38-camps.js', "\tfor (const n of burnt) n.amt = 0;", "\tburnt.length = 0;", 'tests/combat.py', 'p38: the trees under a camp stand', 'still stand under'),
  ('38-camps.js', "const hands = CAMP.build * fxv(u.owner, 'campbuild').m;", "const hands = 1;", 'tests/combat.py', "p38: a soldier raises a camp at a villager's pace", '60% of a villager'),
  ('11-orders.js', "Math.round(v * (1 + CAMP.extra * fxv(o, 'tentcost').m))", "Math.round(v * (1 + CAMP.extra))", 'tests/combat.py', 'p38: Field logistics leaves the tent price', 'with Field logistics the tent charges'),
  ('38-camps.js', "if (!(u.hp < u.max * CAMP.sendHome || u.sick > G.t)) return;", "if (!(u.hp < u.max * 0.1 || u.sick > G.t)) return;", 'tests/combat.py', 'p38: the badly hurt are kept by the tent', 'was not sent home'),
  # Build 80 preview 38, step 2 (--only=p38)
  ('38-camps.js', "d.supply -= eat;", "d.supply -= 0;", 'tests/combat.py', 'p38: the soldiers in camp eat nothing from the depot', 'did not eat from it'),
  ('38-camps.js', "u.tired = Math.max(u.tired || 0, G.t + 2); // unsupplied", "// unsupplied", 'tests/combat.py', 'p38: an empty depot tires nobody', 'left the soldiers supplied'),
  ('38-camps.js', "spend(p, 'g', S.fee, 'camps');", ";", 'tests/combat.py', 'p38: the carter goes unpaid', 'did not take'),
  ('38-camps.js', "d.supply = Math.min(CAMP.supply, (d.supply || 0) + S.food);", "d.supply = d.supply || 0;", 'tests/combat.py', 'p38: the caravan delivers nothing', 'did not deliver'),
  ('38-camps.js', "if (!wet) return;", "if (wet) return;", 'tests/combat.py', 'p38: clear weather wears the camp', 'wore'),
  ('37-events.js', "(keys.includes('#wagon') ? CAMP.wheelMud : 1)", "1", 'tests/combat.py', 'p38: a wagon walks through mud like a man', 'in mud is not slower'),
  # Build 80 preview 39 and 40 (--only=p40): the Store and the Scale line
  ('36-economy.js', "return o === undefined ? m : 1 + (m - 1) * fxv(o, 'band').m;", "return m;", 'tests/combat.py', 'p40: the Store does not steady prices', 'price swing'),
  ('08-core.js', "if (n.kind === 'farm' && fxv(o, 'scale').a) m *= 1 + SCALE.per", "if (false) m *= 1 + SCALE.per", 'tests/combat.py', 'p40: Learning by doing teaches nothing', 'Learning by doing gives'),
  ('38-camps.js', "!bldsOf(o, CAMP.need).some((b) => standing(b, o)))) return 0;", "false)) return 0;", 'tests/combat.py', 'p40: a Camp wagon without a Store', 'with no Store standing'),
  ('36-economy.js', "eats = (u) => shareOf(u) * per * fxv(o, 'eat', unitKeys(u.kind)).m;", "eats = (u) => shareOf(u) * per * fxv(o, 'eat').m;", 'tests/combat.py', "p40: the Store's ration feeds nobody", 'tenth of the share'),
  # Build 80 preview 41 (--only=p41): field defences
  ('38-natives.js', "if (horse) v.stuck = G.t + CALTROPS.stuck;", ";", 'tests/combat.py', 'p41: caltrops lame no horse', 'not hurt and stuck'),
  ('38-natives.js', "if (b.hits >= CALTROPS.hits) {", "if (true) {", 'tests/combat.py', 'p41: one horse treads the caltrops flat', 'trod the caltrops flat'),
  # (no plant for the trap's lane: two clauses of canPlace each exempt it on their own, so no one line breaks it)
  ('14-sim-troops.js', "&& G.P[o].techs.has('archerstakes');", "&& true;", 'tests/combat.py', 'p41: every shooter has a stake', 'without the research has a stake'),
  ('16-sim-fight.js', "\t\ta.chg = 0;\n\t\tconst dx = a.x - t.x,", "\t\tconst dx = a.x - t.x,", 'tests/combat.py', "p41: the stake does not end the charge", 'not hurt, stopped and thrown back'),
  ('08-core.js', "if (BLD[kind].tech && !G.P[o].techs.has(BLD[kind].tech))", "if (false)", 'tests/combat.py', 'p41: caltrops without the research', 'without the research'),
  # Build 80 preview 42 (--only=p42): the Hall
  ('16-sim-fight.js', "d *= (A.bld ?? 1) * (a && o !== WILD ? fxv(o, 'bld', unitKeys(a.kind)).m : 1);", "d *= A.bld ?? 1;", 'tests/combat.py', 'p42: research against buildings is not read', 'Hastin does not'),
  ('11-orders.js', "if (T.civ && T.civ !== p.civ) return 'Belongs to another people.';", ";", 'tests/combat.py', "p42: another people's speciality is open to all", 'open to Rome'),
  ('08-core.js', "\t\t: kind === 'hall' && civOf(o)\n\t\t\t? civOf(o).hall", "\t\t: false\n\t\t\t? civOf(o).hall", 'tests/combat.py', 'p42: the Hall is not named by its people', 'is not the Forum'),
  # Build 80 preview 44 (--only=p44): the audit of Nov 3 (every claim checked), argon's three amendments
  ('04-rules-tech.js', "{ id: 'mongolyam', civ: 'mongol'", "{ id: 'yam', civ: 'mongol'", 'tests/tables.py', 'p44: a Hall step takes the id of a Keep step', 'yam'),
  ('04-rules-tech.js', "k: ['harcher', 'mongolha']", "k: ['horsearcher', 'mongolha']", 'tests/tables.py', 'p44: a step names a unit that is not there', 'horsearcher'),
  ('34-save.js', "\t'site', // the camp piece a soldier raises: a reference, found again after a load (p44)\n", '', 'tests/saves.py', 'p44: a soldier raises a copy of its camp piece after a load', 'detached copy'),
  ('11-orders.js', "G.t + CHARGE.cd * fxv(o, 'chargecd').m;", 'G.t + CHARGE.cd;', 'tests/combat.py', 'p44: Remounts do not shorten the charge', 'Remounts'),
  ('08-core.js', "\tsightFx(e).m * //", '\t1 * //', 'tests/combat.py', 'p44: the Yam gives no sight', 'Yam'),
  ('10-world.js', "Math.cos(ang) * (lakeRAt(L, ang) - 8), //", 'Math.cos(ang) * (L.r - 8), //', 'tests/combat.py', 'p44: fish on dry land in a bay', 'fish'),
  ('17-ai.js', "\tfor (const u of soldiersOf(o)) if (u.state === 'goto' && u.drill && u.drill.until <= G.t) u.state = 'home'; // a hold that ended: back in the pool (p44)\n", '', 'tests/combat.py', 'p44: the B side loses the soldiers it sent to a choke', 'B side'),
  ('38-camps.js', "for (const f of G.finds) if (!f.done &&", "for (const f of G.finds) if (!f.gone &&", 'tests/combat.py', 'p44: a cleared find blocks a camp', 'cleared find'),
  ('38-camps.js', "\tfor (const n of G.nodes) if (n.kind !== 'tree' && n.amt > 0 && cells.has(", "\tfor (const n of []) if (n.kind !== 'tree' && n.amt > 0 && cells.has(", 'tests/combat.py', 'p44: a camp on a stone find', 'stone find'),
  ('38-camps.js', "&& b.campKind === kind && !BLD[b.kind].wallish) ids.add(b.camp);", '&& b.campKind === kind) ids.add(b.camp);', 'tests/combat.py', 'p44: a last palisade tile counts as a camp', 'palisade'),
  ('26-input.js', "if (why) return say(why + ' Send the wagon elsewhere.', 'warn', TOAST.mid);", 'if (why) {}', 'tests/combat.py', 'p44: a wagon drives to a spot it cannot take', 'without a word'),
  ('26-input.js', "\tif (sol.length) orderCost(0, sol); // an order by tap costs the same meals as one from the controller (p44)\n", '', 'tests/combat.py', 'p44: an order by tap is free', 'took no meals'),
  ('14-sim-troops.js', "tgt.tgt.drill.py === u.drill.py ? GRID.gap : 0;", 'tgt.tgt.drill.py === u.drill.py ? 0 : 0;', 'tests/combat.py', 'p44: a drilled soldier stands under the arrows', 'step toward'),
  ('04-rules-tech.js', "{ s: 'make', k: ['workshop'], m: 1.1 }, //", "{ s: 'make', k: '*', m: 1.1 }, //", 'tests/combat.py', 'p44: the mint takes Division of labour twice', 'Division'),
  ('08-core.js', "if (n.kind === 'farm' && SCALE.kinds.includes(n.farm.kind) && fxv(o, 'scale').a)", "if (n.kind === 'farm' && fxv(o, 'scale').a)", 'tests/combat.py', 'p44: Learning by doing reaches the pasture', 'pasture'),
]

def plant_check():
    only = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--only=')), None)   # --only=word: just the plants whose name has the word (a builder checks its own in minutes; the whole set runs overnight)
    plants = [p for p in PLANTS if not only or only in p[4]]
    print(f'planted bugs: {len(plants)}' + (f' of {len(PLANTS)} (--only={only})' if only else ''))
    os.environ['FK_PLANT'] = '1'; os.environ['FK_REPO'] = ROOT   # tests/docs.py reads the last commit from the real repository   # tests/map.py runs 25 seeds and one phone size for each plant (the gate runs it whole)
    tmp = tempfile.mkdtemp(prefix='fk-plant-')
    try:
        for name in os.listdir(ROOT):
            if name in ('.git', 'node_modules', '__pycache__'): continue
            s, d = os.path.join(ROOT, name), os.path.join(tmp, name)
            (shutil.copytree if os.path.isdir(s) else shutil.copy2)(s, d)
        c, out = run([PY, 'build.py'], cwd=tmp)
        say(c == 0, 'the clean copy builds', out[-300:])
        clean_ok = {}
        for test in sorted({p[3] for p in plants}):
            c, out = run([PY, test], cwd=tmp)
            clean_ok[test] = c == 0
            say(c == 0, f'{test} passes on the clean copy (the control run)', out[-300:])
        clean = {}
        for f, old, new, test, why, expect in plants:
            p = os.path.join(tmp, f if '/' in f else os.path.join('src', f))   # a path with a folder is from the root (the docs plants)
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
    print('\nOWED (docs/4 Now/Owed.md, section "Owed"; read these before building anything):')
    lines = open(os.path.join(ROOT, 'docs', '4 Now', 'Owed.md')).read().split('\n## Owed', 1)
    if len(lines) < 2: say(False, 'docs/4 Now/Owed.md has an "Owed" section'); return
    for line in lines[1].split('\n## ', 1)[0].splitlines()[1:]:
        if line.startswith('- '): print('  ' + line)
    print('  the locked decisions are in docs/3 Locks/; the decision record and the audit in docs/6 Records/v80 Audit/')

if __name__ == '__main__':
    only = sys.argv[1] if len(sys.argv) > 1 else ''
    state()
    if only != '--plant':
        c, out = run([PY, 'tests/docs.py'])
        for l in out.splitlines(): print(l[:300])
        say(c == 0, 'the docs check passes (stamps, closed records, the reading order)')
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
    print('\n' + ('LIVE QC PASSED' if not fails else 'LIVE QC FAILED: ' + str(len(fails)) + ' problem(s) above; report them before touching anything'))
    sys.exit(1 if fails else 0)
