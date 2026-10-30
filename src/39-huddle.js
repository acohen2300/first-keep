// ═════ 39-huddle.js: the one row and its pages (Build 63, Albert's "unicorn layout") ═════
// One row, six slots, three shapes, five pages. A slot is a fixed place the thumb learns; what fills it is one of three shapes: WHOLE (one
// button the height of the slot), SPLIT (two buttons touching, top and bottom: people over build, create over cycle, ✓ over ✕) or PM (an icon
// and a count above, − and + below with air between: the jobs). The chip at the row's left end is the one constant: it cycles the pages
// Jobs → Realm → Build → War → Squad → Train (Build 64), and every page is always there (dimmed until the game opens it), so the order never changes under
// the hand. The sixth slot is ✓ over ✕ on every page that confirms. The same row is a card's action bar (the worker card), so there is one
// element to learn. The Huddle's sequence (ready, aim, fire, abort) lives on in the War page's missions.
const CLS = [
	['foot', 'Foot', 'barracks', 'foot'],
	['arch', 'Archers', 'range', 'archers'],
	['horse', 'Riders', 'stable', 'riders'],
	['siege', 'Siege', 'siege', 'siege'],
];
const HUD = {
	near: 140, // a fight is what hostile soldiers within this reach of the group make
	lose: 0.4, // a tile flashes red below this chance, and stops above clear
	clear: 0.5,
	win: 0.75, // green above this
	smooth: 0.3, // the chance moves a third of the way each second: about three seconds to settle
	gap: 8, // reinforcements arriving within this many seconds of each other are one wave
	waves: 3,
};
const PAGES = ['jobs', 'realm', 'build', 'war', 'squad', 'train']; // Build 64: fixed for everyone. Jobs is home; the Realm is the dashboard; then Build and the three military pages side by side
const pageName = { jobs: 'Jobs', realm: 'Realm', war: 'War', build: 'Build', squad: 'Squad', train: 'Train' };
const pageIcon = () => ({
	jobs: ICON.list,
	realm: ICON.def,
	war: ICON.sword,
	build: ICON.hammer,
	squad: ICON.squad,
	train: ICON.shield,
});
const FAV0 = ['house', 'farm', 'barracks', 'tower', 'wall']; // the Build page's five hot keys until you pin your own (★ on the Build card)
const shortName = (k) =>
	stats(0, k)
		.name.replace(/^[A-Z][a-z]+ (?=[A-Z])/, '')
		.split(' ')[0]
		.replace(/m[ae]n$/, '')
		.slice(0, 7); // one short word on a tile: Spear, Archer, Chariot
const clsOf = (u) => CLS.findIndex((c) => c[2] === UNIT[u.kind].at);
const mUnits = (m) => G.units.filter((u) => u.owner === 0 && u.ord === m.ord && u.hp > 0);
const sqUnits = (i) => armyOf(0).filter((u) => u.bn === i && u.kind !== 'spy');
const sqOut = (i) => G.msn[i] && !G.msn[i].end; // the squad is out on a mission
const hostile = (v) =>
	v.owner !== 0 &&
	v.hp > 0 &&
	!v.inside &&
	atWar(0, v.owner) &&
	(isSoldier(v) || (v.owner === WILD && UNIT[v.kind].tick === 'wild'));
function foesNear(c) {
	const out = [];
	unitsNear(c, HUD.near, (v) => hostile(v) && visibleTo0(v) && out.push(v)); // the foes your people see (Build 60)
	return out;
}
const powerSum = (L) => L.reduce((s, u) => s + unitPower(u), 0);
// the chance to win: the engine every odds line uses (power against power, the matchup of arms), as r²/(1+r²)
function chance(S, foes) {
	const r = (powerSum(S) / Math.max(1, powerSum(foes))) * matchup(S, foes);
	return lanchester(r);
}
const dpsOf = (L) => L.reduce((s, v) => s + dmgOf(v) / (UNIT[v.kind].cd || 1.5), 0);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const wxWord = () => (G.wx !== 'clear' && WEATHER[G.wx] ? WEATHER[G.wx].name : season().name);
// a squad's pace in a word, from its slowest member (an elephant makes it slow, horse alone fast): what the card and the tile say (Albert, Build 63)
function paceWord(S) {
	if (!S.length) return '';
	const v = Math.min(...S.map((u) => paceOf(u, 1)));
	return v < 14 ? 'slow' : v < 22 ? 'medium' : 'fast';
}

// ── the pages
function hudPage(page) {
	const H = G.hud;
	H.page = page;
	H.on = page === 'war' || page === 'train';
	if (H.on) {
		H.aim = true;
		H.mode = page === 'train' ? 'rally' : 'war';
		H.aimT = performance.now();
		if (page === 'train' && G.rally0) H.h = { t: 'ground', e: { x: G.rally0.x, y: G.rally0.y } };
		if (!H.h) H.h = { t: 'ground', e: { x: cam.x, y: cam.y } };
		H.etaKey = '';
	} else H.aim = false;
	if (page !== 'jobs') closeCard();
	if (!H.sq) H.sq = { i: 0, tile: null, unit: {} };
}
function hudOpen(on) {
	hudPage(on ? 'war' : 'jobs');
}
function pageCycle() {
	const i = PAGES.indexOf(G.hud.page || 'jobs');
	hudPage(PAGES[(i + 1) % PAGES.length]);
	feel('tick');
}
// ── the Squad page
const sqKinds = (tile) =>
	ARMYK.filter((k) => !UNIT[k].civ && UNIT[k].cost && k !== 'spy')
		.map((k) => civKind(0, k))
		.filter((k, i, a) => a.indexOf(k) === i && UNIT[k].at === CLS[tile][2] && UNIT[k].age <= G.P[0].age); // what that building can train now
const sqUnit = (tile) => {
	const K = sqKinds(tile),
		u = G.hud.sq.unit[tile];
	return K.includes(u) ? u : K[0];
};
function sqNew() {
	const j = BN.findIndex((_, i) => !Object.values(G.bnPlan[i]).some(Boolean) && !sqUnits(i).length);
	if (j < 0) return say('All squads made: pick one to change.', '', 3);
	G.hud.sq.i = j;
	G.hud.sq.tile = null;
	say(`${BN[j]}: set what it holds with − and +.`, '', 3);
	feel('tick');
}
function sqCycle() {
	const Q = G.hud.sq;
	if (Q.tile !== null) {
		const K = sqKinds(Q.tile);
		if (K.length) Q.unit[Q.tile] = K[(K.indexOf(sqUnit(Q.tile)) + 1) % K.length];
	} else Q.i = (Q.i + 1) % BNS;
	feel('tick');
}
function sqPlan(i, k, d) {
	// a squad holds BNSIZE at most, every kind together; the step is 1 under ten, 5 above
	const P = G.bnPlan[i],
		cur = P[k] || 0,
		st = d > 0 ? (cur < 10 ? 1 : 5) : cur <= 10 ? 1 : 5,
		others = Object.entries(P).reduce((n, [q, v]) => n + (q === k ? 0 : v), 0);
	P[k] = clamp(cur + d * st, 0, Math.max(cur, BNSIZE - others));
	if (!P[k]) delete P[k];
	rebattalion();
}
// ★ Best: a helper, not a cheat (Albert, Build 63). It fills the squad's plan from the soldiers at home by the same odds the War page shows:
// against the foes seen near the crosshair it takes the kinds the matchup favours first; with no foe in sight it takes the strongest first,
// two foot to one shooter. It never picks for you: the plan is yours to change with − and +.
function sqBest(i) {
	const H = G.hud,
		home = free().filter((u) => u.bn === undefined || u.bn === i || !sqUnits(u.bn).length),
		foes = H.h ? foesNear(H.h.e) : [],
		score = (u) => unitPower(u) * (foes.length ? matchup([u], foes) : 1) * (foes.length || clsOf(u) === 0 ? 1 : 0.6);
	if (!home.length) return say('Nobody at home to put in it.', '', 3);
	const P = {};
	let n = 0;
	for (const u of home.sort((a, b) => score(b) - score(a))) {
		if (n >= BNSIZE) break;
		P[u.kind] = (P[u.kind] || 0) + 1;
		n++;
	}
	G.bnPlan[i] = P;
	rebattalion();
	say(`${BN[i]}: ${n} picked${foes.length ? ' for the foe in sight' : ''}.`, 'good', 3);
	feel('thock');
}
// ── aiming: the crosshair, moved by a tap on the map while the War or Train page is open
function aimSpot(sx, sy) {
	const H = G.hud;
	let h = hitAt(sx, sy);
	const foe = (h.t === 'unit' || h.t === 'bld') && h.e.owner !== 0;
	if (!(h.t === 'ground' || h.t === 'find' || foe)) h = { t: 'ground', e: { x: h.e.x, y: h.e.y } };
	H.h = h;
	H.moved = true;
	H.etaKey = '';
}
const aimNear = (sx, sy) => {
	const H = G.hud;
	return H.aim && H.h && hyp(sx - SX(H.h.e.x), sy - SY(H.h.e.y)) < 56;
};
function aimAt(sx, sy) {
	const H = G.hud;
	aimSpot(sx, sy);
	ripple(H.h.e.x, H.h.e.y, aimColor());
	feel('tick');
}
// the crosshair's colour says what is under it (Albert, Build 63): green yours, blue an ally, white nothing (nature), red an enemy or a hazard
function aimColor() {
	const H = G.hud,
		h = H.h;
	if (!h) return '#ffffff';
	if (h.t === 'unit' || h.t === 'bld') {
		const o = h.e.owner;
		if (o === 0) return '#4fe0a0';
		if (o === WILD || atWar(0, o)) return '#ff5a4a';
		if (friendly(0, o)) return '#6fb1ff';
		return '#ffffff';
	}
	const near = nearU(h.e, 60, (v) => v.owner !== 0 && v.hp > 0 && hostile(v) && visibleTo0(v));
	if (near || hazardAt(h.e.x, h.e.y)) return '#ff5a4a';
	return '#ffffff';
}
const hazardAt = (x, y) =>
	(G.sand && hyp(x - G.sand.x, y - G.sand.y) < G.sand.r) ||
	G.blds.some((b) => b.fire > 0 && dist(b, { x, y }) < 60) ||
	(G.cracks || []).some((c) => hyp(x - c.x, y - c.y) < 40);
// who a squad sends: its idle members; with no squads yet, every idle soldier
const sqFree = (i) => (i === null || i === undefined ? free() : free().filter((u) => u.bn === i));
function hudEta(i = G.hud.sel) {
	const H = G.hud,
		S = sqFree(i);
	if (!H.h || !S.length) return 0;
	const key = `${i}:${H.h.e.x | 0},${H.h.e.y | 0},${S.length},${G.wx},${(G.t / 3) | 0}`;
	if (H.etaKey !== key) {
		H.etaKey = key;
		H.eta = etaOf(S, H.h.e, routeK(centreOf(S), H.h.e));
	}
	return H.eta;
}
// Go: a squad marches on the crosshair as one order and takes its slot (with no squads yet, every idle soldier takes the first free slot)
function hudFire(i) {
	const H = G.hud,
		S = sqFree(i),
		slot = i ?? G.msn.findIndex((m) => !m || m.end);
	if (!H.h) H.h = { t: 'ground', e: { x: cam.x, y: cam.y } };
	if (slot < 0) return say('Every slot is out.', '', 3);
	if (!S.length) return say(i === null || i === undefined ? freeWhy() : `${BN[i]}: nobody idle in it.`, '', 3);
	if (sqOut(slot)) hudAbort(slot, true);
	const before = G.ordN || 0;
	order(S, H.h);
	if ((G.ordN || 0) === before) return; // refused: the reason was said
	const O = G.ords[G.ordN],
		kinds = {};
	for (const u of S) kinds[u.kind] = (kinds[u.kind] || 0) + 1;
	G.msn[slot] = {
		name: i === null || i === undefined ? 'The army' : BN[i],
		sq: i ?? null,
		ord: G.ordN,
		n0: S.length,
		kinds,
		what: H.h.t === 'unit' || (H.h.t === 'bld' && H.h.e.owner !== 0) ? 'Attack' : 'Go to',
		intent: i !== null && i !== undefined ? G.bnIntent[i] || 0 : 0,
		label: O.label,
		x: O.x,
		y: O.y,
		t: G.t,
		due: G.t + etaOf(S, O, O.k),
		st: 'go',
		odds: 0.5,
	};
	H.sel = slot;
	H.firedT = performance.now();
	feel('thock');
}
// a mission leaves: the soldiers go home, the slot is free
function hudAbort(slot, quiet) {
	const m = G.msn[slot];
	if (!m) return;
	sendHome(mUnits(m));
	G.msn[slot] = null;
	if (G.card && G.card.type === 'squad' && G.card.i === slot) refresh();
	if (!quiet) say(`${m.name} called home.`, '', 3);
}
function hudAbortAll() {
	G.msn.forEach((_, i) => hudAbort(i));
}
// Home: everyone back, every mission off
function hudHome() {
	hudAbortAll();
	sendHome(sendable());
	say('Everyone home.', '', 3);
}
// Orders (the Train page): where new soldiers go when they are made, and which squad they join; ✓ on the crosshair sets it
function setRally() {
	const H = G.hud;
	if (!H.h) return;
	G.rally0 = { x: Math.round(H.h.e.x), y: Math.round(H.h.e.y) };
	say('New soldiers will go there.', 'good', 3);
	feel('thock');
}

// ── each second: where a mission is, how it goes, what to say
function missionsTick() {
	G.msn.forEach((m, i) => {
		if (!m || m.end) return;
		const S = mUnits(m),
			O = G.ords && G.ords[m.ord];
		if (!S.length) {
			m.end = G.t;
			m.st = 'lost';
			m.flash = null;
			say(`${m.name} is lost.`, 'warn', 4);
			return;
		}
		const c = centreOf(S),
			foes = foesNear(c),
			walk = S.filter((u) => armyStatus(u) === 'march').length,
			fight = S.some((u) => armyStatus(u) === 'fight');
		m.eta = O && !O.arrived ? O.eta || 0 : 0;
		if (fight || (!walk && foes.length)) m.st = 'act';
		else if (!walk) {
			m.st = 'done';
			m.end = G.t;
			m.flash = null;
			m.late = Math.max(0, Math.round(G.t - m.due));
			return;
		} else m.st = 'go';
		if (m.st !== 'act') return;
		m.odds += (chance(S, foes) - m.odds) * HUD.smooth;
		if (m.odds < HUD.lose && m.flash !== 'lose') {
			m.flash = 'lose';
			say(`${m.name} is losing.`, 'warn', 4);
		} else if (m.flash === 'lose' && m.odds > HUD.clear) m.flash = null;
		if (m.odds > HUD.win) m.flash = 'win';
		else if (m.flash === 'win') m.flash = null;
	});
}
// who can still reach a fight in time, fastest first, and how many it takes to even it: waves by arrival
function reinforcePlan(m) {
	const S = mUnits(m);
	if (!S.length) return null;
	const c = centreOf(S),
		foes = foesNear(c);
	if (!foes.length) return null;
	const res = free().filter((u) => !S.includes(u)),
		k = res.length ? routeK(centreOf(res), c) : 1,
		survive = S.reduce((s, u) => s + u.hp, 0) / Math.max(1, dpsOf(foes)),
		mu = matchup(S, foes),
		foe = Math.max(1, powerSum(foes)),
		cand = res.map((u) => ({ u, t: (dist(u, c) * k) / Math.max(1, paceOf(u, sideSpd(0))) })).sort((p, q) => p.t - q.t),
		go = [];
	let pow = powerSum(S);
	const even = (pow / foe) * mu >= 1;
	for (const r of cand) {
		if (r.t > survive || (pow / foe) * mu >= 1) break; // too late for the rest, or the fight is even
		go.push(r);
		pow += unitPower(r.u);
	}
	const waves = [];
	for (const r of go) {
		const w = waves[waves.length - 1];
		if (w && (r.t - w.t < HUD.gap || waves.length === HUD.waves)) w.list.push(r);
		else waves.push({ t: r.t, list: [r] });
	}
	return { c, go: go.map((r) => r.u), waves, even, late: !go.length && !even && cand.length > 0 };
}
function waveLine(plan) {
	const word = (list) => {
		const k = new Set(list.map((r) => clsOf(r.u)));
		return k.size === 1 ? CLS[[...k][0]][3] : 'soldiers';
	};
	return plan.waves
		.map((w, i) => `${w.list.length} ${i ? 'more' : word(w.list)} ${i ? 'by' : 'in'} ${mmss(w.t)}`)
		.join(', ');
}
// units moved into a mission (a reinforcement): they march to its middle and join its order
function hudJoin(S, m) {
	if (!S.length) return;
	const c = centreOf(mUnits(m)),
		before = G.ordN || 0;
	order(S, { t: 'ground', e: c });
	if ((G.ordN || 0) === before) return;
	const id = G.ordN;
	for (const u of S) u.ord = m.ord;
	delete G.ords[id];
}
function hudReinforce(slot) {
	const m = G.msn[slot],
		plan = m && reinforcePlan(m);
	if (!plan || !plan.go.length) return say('Too late: nobody can get there in time.', '', 3);
	hudJoin(plan.go, m);
	say(`${plan.go.length} reinforce ${m.name}.`, 'good', 3);
}

// ── the row: six slots, three shapes
const odds2 = (p) => `hsl(${Math.round(Math.max(0, Math.min(1, p)) * 120)} 75% 58%)`;
function mStatus(m) {
	if (m.st === 'go') return [mmss(m.eta || 0), codeOf('b')];
	if (m.st === 'act') return ['FIGHTING', odds2(m.odds)];
	if (m.st === 'lost') return ['LOST', codeOf('r')];
	return [m.late ? `LATE +${m.late}s` : '✓ DONE', m.late ? 'var(--gold)' : codeOf('g')]; // on its way blue, lost red, done green, late gold: the code
}
const stB = (act, t, cls = '', extra = '') => `<button class="cell st ${cls}" data-act="${act}"${extra}>${t}</button>`;
const cellB = (act, top, word, cls = '', extra = '') =>
	`<button class="cell ${cls}" data-act="${act}"${extra}>${top}${wd(word)}</button>`;
const topOf = (icon, n) =>
	`<span class="top">${icon}${n === undefined || n === null ? '' : `<span class="c">${n}</span>`}</span>`;
// the three shapes. whole: one button the slot's height. split: two touching. pm: a tile over − and +.
const WHOLE = (act, top, word, cls = '', extra = '') =>
	`<div class="col whole">${cellB(act, top, word, cls + ' tall', extra)}</div>`;
const SPLIT = (a, b) => `<div class="col join">${a}${b}</div>`;
const PM = (tile, minus, plus) => `<div class="col">${tile}<div class="pm">${minus}${plus}</div></div>`;
function warPageHTML() {
	const H = G.hud,
		sel = H.sel,
		cmd = hasCmd(),
		canGo = !!H.h && sqFree(cmd ? sel : null).length > 0;
	let h = SPLIT(
		stB('waim', ICON.aim, 'war', ' aria-label="Aim: the crosshair to the middle of the screen"'),
		stB('whome', ICON.home, 'war', ' aria-label="Everyone home"'),
	); // Albert's notebook (Oct 30): the War page is aim and home, four squads with − and +, Go over Abort
	BN.forEach((nm, i) => {
		const S = cmd ? sqUnits(i) : [],
			n = S.length,
			m = sqOut(i) ? G.msn[i] : null,
			[t, color] = m ? mStatus(m) : ['', ''],
			fl = m && m.flash ? ' ' + m.flash : '',
			eta = !m && sel === i && n ? hudEta(i) : 0,
			word = !cmd
				? 'Command'
				: m
					? `<span style="color:${color}">${t}</span>`
					: eta
						? `${nm[0]} · ${mmss(eta)}`
						: n
							? `${nm[0]} · ${paceWord(S)}`
							: nm;
		h += PM(
			cellB(
				`wsq:${i}`,
				topOf(ICON.squad, cmd ? n : null),
				word,
				`msn${fl}${sel === i ? ' sel' : ''}${cmd ? '' : ' dis'}`,
				` style="--mc:${color || 'transparent'}"`,
			),
			stB(`wback:${i}`, '−', m ? '' : 'dis', ' aria-label="Call back"'),
			stB(`wgo:${i}`, '+', n ? '' : 'dis', ' aria-label="Send"'),
		);
	});
	h += SPLIT(
		stB('wfire', ICON.ok, canGo ? 'go' : 'dis', ' aria-label="Go"'),
		stB('wabort', ICON.close, 'no', ' aria-label="Abort"'),
	);
	return h;
}
const favKinds = () => (SET.fav && SET.fav.length ? SET.fav : FAV0).slice(0, 5);
// What the town needs (Build 65: one table; the tips, the Build page and the Stores domain read it, where each had its own copy). Each test
// is the reason; the tips add their words and the Build page its colour.
const goldTight = (p) => p.res.g < 50 && (p.res.w > 300 || p.res.s > 300 || p.res.f > 300); // gold short while another store is full
const NEEDS = {
	house: () => popOf(0) >= capOf(0) - 1 && capOf(0) < POPMAX && !G.blds.some((b) => b.owner === 0 && b.kind === 'house' && b.prog < 1),
	barracks: () => !bldsOf(0, 'barracks').length && G.t > 75,
	lumber: () => unitsOf(0, 'vil').filter((u) => u.job === 'wood').length >= 3 && !bldsOf(0, 'lumber').length,
	farm: () => {
		const k = keepOf(0);
		return !!k && G.nodes.filter((n) => n.kind === 'bush' && dist(n, k) < 300).length < 3 && !bldsOf(0, 'farm').length;
	},
	market: () => goldTight(G.P[0]) && !bldsOf(0, 'market').length,
	hospital: () => G.units.some((u) => u.owner === 0 && u.sick > G.t) && !bldsOf(0, 'hospital').length && G.P[0].age >= 2,
};
const buildWants = () => Object.keys(NEEDS).filter((k) => NEEDS[k]());
// The Build page (Build 64): what the town needs, in the colour code. Blue: wanted and you can build it now; green: going up; red: wanted
// but blocked, with the reason (what it is short of, or what it needs first); then your pinned favourites, white. The sixth is the Build card.
function buildItems() {
	const p = G.P[0],
		out = [],
		has = (k) => out.some((x) => x.k === k);
	for (const b of G.blds)
		if (out.length < 2 && b.owner === 0 && b.hp > 0 && b.prog < 1)
			out.push({ k: b.kind, st: 'green', word: `${Math.floor(b.prog * 100)}%`, act: `card:bld,${b.id}` });
	for (const k of buildWants()) {
		if (out.length >= 4 || has(k) || !BLD[k]) continue;
		const why = capWhy(0, k);
		out.push(
			why
				? { k, st: 'red', word: BLD[k].age > p.age ? AGES[BLD[k].age].name : 'blocked', act: `build:${k}`, why }
				: afford(p, BLD[k].cost)
					? { k, st: 'blue', word: BLD[k].short || BLD[k].name, act: `build:${k}` }
					: { k, st: 'red', word: `short ${need(BLD[k].cost)}`, act: `build:${k}` },
		);
	}
	for (const k of favKinds()) if (out.length < 4 && !has(k) && BLD[k]) out.push({ k, st: '', word: BLD[k].short || BLD[k].name, act: `build:${k}` });
	return out;
}
function buildPageHTML() {
	const V = unitsOf(0, 'vil').length,
		room = Math.max(0, capOf(0) - popOf(0));
	let h = WHOLE('train:vil', topOf(ICON.people), `${V}/${V + room}`, trainWhy(0, 'vil') ? 'dis' : '', ' aria-label="Train a villager"'); // People, whole: the door lives on Jobs
	for (const it of buildItems())
		h += WHOLE(it.act, `<span class="top thumb">${bldThumb(it.k)}</span>`, it.word, `build st-${it.st || 'white'}`, ` aria-label="${BLD[it.k].name}${it.why ? ': ' + it.why : ''}"`);
	h += WHOLE('buildrow', topOf(ICON.hammer), 'All', 'build', ' id="buildT" aria-label="The Build card"');
	return h;
}
// a small picture of a building for the Build page: its sprite, drawn once per kind and colour
const THUMB = new Map();
function bldThumb(kind) {
	const key = kind + G.P[0].color;
	let u = THUMB.get(key);
	if (!u) {
		const sp = bldSprite({ kind, owner: 0, prog: 1, hp: 1, id: 0, x: 0, y: 0 }, 2),
			c = document.createElement('canvas'),
			S = 80;
		c.width = c.height = S;
		// the picture is the sprite's own box, not its canvas (a sprite's canvas has air for the flags and the shadow)
		const px = sp.getContext('2d').getImageData(0, 0, sp.width, sp.height).data;
		let x0 = sp.width,
			y0 = sp.height,
			x1 = 0,
			y1 = 0;
		for (let i = 3; i < px.length; i += 4)
			if (px[i] > 40) {
				const q = (i - 3) / 4,
					x = q % sp.width,
					y = (q / sp.width) | 0;
				if (x < x0) x0 = x;
				if (x > x1) x1 = x;
				if (y < y0) y0 = y;
				if (y > y1) y1 = y;
			}
		const w = Math.max(1, x1 - x0 + 1),
			hh = Math.max(1, y1 - y0 + 1),
			g2 = c.getContext('2d'),
			k = Math.min(S / w, S / hh) * 0.94;
		g2.drawImage(sp, x0, y0, w, hh, (S - w * k) / 2, (S - hh * k) / 2, w * k, hh * k);
		u = `<img src="${c.toDataURL()}" width="40" height="40" alt="">`;
		THUMB.set(key, u);
	}
	return u;
}
function favToggle(kind) {
	const F = (SET.fav && SET.fav.length ? SET.fav : FAV0).slice(0, 5),
		i = F.indexOf(kind);
	if (i >= 0) F.splice(i, 1);
	else {
		if (F.length >= 5) F.shift(); // the oldest pin goes
		F.push(kind);
	}
	SET.fav = F;
	saveSet();
	say(i >= 0 ? `${BLD[kind].name} off the Build page.` : `${BLD[kind].name} pinned to the Build page.`, '', 3);
}
function squadPageHTML() {
	const Q = G.hud.sq,
		i = Q.i,
		cmd = hasCmd();
	let h = SPLIT(
		stB('sqnew', `${ICON.squad}<b class="plus">＋</b>`, 'sq' + (cmd ? '' : ' dis'), ' aria-label="A new squad"'),
		stB('sqcycle', `${ICON.cycle}<b class="plus">${BN[i][0]}</b>`, 'sq' + (cmd ? '' : ' dis'), ' aria-label="Cycle the squads"'),
	); // the notebook: 1A create, 1B cycle; 2 to 5 the buildings; 6 done over best
	CLS.forEach((c, t) => {
		const k = sqUnit(t),
			built = cmd && k && ready(0, c[2]).length,
			have = k ? sqUnits(i).filter((u) => u.kind === k).length : 0,
			want = k ? G.bnPlan[i][k] || 0 : 0;
		h += PM(
			cellB(
				`sqtile:${t}`,
				topOf(ICON.cls[c[0]], k && cmd ? `${have}/${want}` : '–'),
				!cmd ? 'Command' : k ? shortName(k) : BLD[c[2]].name,
				'sq' + (Q.tile === t ? ' sel' : '') + (built ? '' : ' dis'),
			),
			stB(`sqn:${t},-`, '−', 'sq' + (built ? '' : ' dis')),
			stB(`sqn:${t},+`, '+', 'sq' + (built ? '' : ' dis')),
		);
	});
	h += SPLIT(
		stB('sqdone', ICON.ok, cmd ? 'go' : 'dis', ' aria-label="Done: to the War page"'),
		stB(`sqbest:${i}`, ICON.star, 'sq' + (cmd ? '' : ' dis'), ' aria-label="Best: fill from the soldiers at home"'),
	);
	return h;
}
function trainPageHTML() {
	const H = G.hud,
		rs = G.recruitSq;
	let h = SPLIT(
		stB('torders', ICON.aim, 'train' + (H.aim ? ' sel' : ''), ' aria-label="Orders: where new soldiers go"'),
		stB('tsq', `${ICON.squad}<b class="plus">${rs === undefined || rs === null ? '·' : BN[rs][0]}</b>`, 'train' + (hasCmd() ? '' : ' dis'), ' aria-label="Which squad new soldiers join"'),
	); // the notebook: "Army training: train reinforcements without going home… must contain an Orders button"
	CLS.forEach((c, t) => {
		const k = sqUnit(t),
			at = k ? readyAt(0, UNIT[k]) : [],
			q = at.flatMap((b) => b.q.filter((j) => j.kind === k)),
			first = q.length ? Math.max(0, Math.ceil(q[0].left)) : 0,
			why = k ? trainWhy(0, k) : 'none';
		h += PM(
			cellB(
				`sqtile:${t}`,
				topOf(ICON.cls[c[0]], at.length ? q.length : '–'),
				!at.length ? 'none' : q.length ? mmss(first) : shortName(k),
				'train' + (H.sq.tile === t ? ' sel' : '') + (at.length ? '' : ' dis'),
			),
			stB(`tq:${t},-`, '−', 'train' + (q.length ? '' : ' dis')),
			stB(`tq:${t},+`, '+', 'train' + (why ? ' dis' : ''), why ? ` title="${why}"` : ''),
		);
	});
	h += SPLIT(
		stB('tok', ICON.ok, H.aim ? 'go' : 'dis', ' aria-label="Set the orders on the crosshair"'),
		stB('tcancel', ICON.close, 'no', ' aria-label="Cancel"'),
	);
	return h;
}
function huddleUI() {
	const H = G.hud,
		page = H.page || 'jobs',
		el = $('huddle'),
		flip = el.hidden === (page !== 'jobs');
	if (flip) {
		el.hidden = page === 'jobs';
		$('jobs').hidden = page !== 'jobs';
	}
	$('orders').className =
		$('orders')
			.className.replace(/\bpg-\w+/g, '')
			.trim() +
		' pg-' +
		page;
	const chip = $('hudB');
	chip.innerHTML = `${pageIcon()[page]}<b>▸</b>`;
	chip.className = 'fab chip ' + page;
	chip.setAttribute('aria-label', `${pageName[page]}: the next page`);
	if (page !== 'jobs') {
		const h = { war: warPageHTML, build: buildPageHTML, squad: squadPageHTML, train: trainPageHTML, realm: realmPageHTML }[page]();
		if (el.sigH !== h) {
			el.sigH = h;
			el.innerHTML = h;
		}
	}
	if (flip) fit(); // the bar is whole again: the corner buttons sit on top of it
}
// the reticle (mock 24): brackets, three turning chevrons, a scan line, a sonar ring and short scope lines; its colour says what is under it; green once fired
function drawReticle() {
	const H = G.hud;
	if (!H.on || !H.h) return;
	const x = SX(H.h.e.x),
		y = SY(H.h.e.y),
		L = performance.now() - (H.firedT || -1e9) < 1200 ? 1 : 0,
		R = Math.max(30, 16 * cam.z + 6) * (L ? 0.8 : 1),
		t = still() ? 0 : (performance.now() - (H.aimT || 0)) / 1000,
		eta = H.mode === 'rally' ? 0 : hudEta(),
		line = (a, b, c, d) => (ctx.moveTo(x + a, y + b), ctx.lineTo(x + c, y + d));
	ctx.save();
	ctx.strokeStyle = ctx.fillStyle = L ? '#4fe0a0' : aimColor();
	ctx.lineWidth = 1.5;
	if (H.drag) {
		ctx.globalAlpha = 0.14;
		ctx.beginPath();
		ctx.arc(x, y, R + 12, 0, 7);
		ctx.fill();
		ctx.globalAlpha = 1;
	}
	ctx.beginPath();
	const q = R * 0.4;
	for (const [a, b] of [
		[-1, -1],
		[1, -1],
		[1, 1],
		[-1, 1],
	]) {
		line(a * R, b * (R - q), a * R, b * R);
		line(a * R, b * R, a * (R - q), b * R);
	}
	ctx.stroke();
	if (!L) {
		const p = (t * 0.5) % 1,
			ph = t * 1.2;
		ctx.globalAlpha = Math.pow(1 - p, 1.4) * 0.8;
		ctx.beginPath();
		ctx.arc(x, y, 4 + p * R * 1.3, 0, 7);
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.beginPath();
		for (let i = 0; i < 3; i++) {
			const a = ph + (i * 2 * Math.PI) / 3,
				c = Math.cos(a),
				s = Math.sin(a),
				rot = (u, v) => [u * c - v * s, u * s + v * c],
				p0 = rot(R * 0.62, -5),
				p1 = rot(R * 0.62 + 7, 0),
				p2 = rot(R * 0.62, 5);
			line(p0[0], p0[1], p1[0], p1[1]);
			line(p2[0], p2[1], p1[0], p1[1]);
		}
		const sy = Math.sin(t * 3) * (R - 4);
		line(-R + 3, sy, R - 3, sy);
		ctx.stroke();
	}
	const g = 8;
	ctx.beginPath();
	line(-R - 14, 0, -g, 0);
	line(g, 0, R + 14, 0);
	line(0, -R - 14, 0, -g);
	line(0, g, 0, R + 14);
	ctx.stroke();
	ctx.font = '700 12px system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText(eta ? `${mmss(eta)} · ${coord(H.h.e.x, H.h.e.y)}` : coord(H.h.e.x, H.h.e.y), x, y - R - 8);
	ctx.restore();
}
// ── the squad card: the editor while it is home, the live view while it is out (Build 61, one card, two states)
// Commander's intent (Build 63): what the squad is for, in the words the doctrine uses. The row and the card show it; the soldiers read it in solTick.
// three intents (the doctrine's words): Engage fights what it meets, soldiers before buildings; No pursuit walks to the spot and fights only
// what comes within reach; Buildings first takes the nearest building and leaves the soldiers to the rest
const INTENT = [
	{ name: 'Engage', note: 'fight what you meet' },
	{ name: 'No pursuit', note: 'to the spot, fight only what blocks' },
	{ name: 'Buildings first', note: 'the nearest building, then the rest' },
];
function squadEditHTML(i) {
	const p = G.P[0],
		plan = G.bnPlan[i],
		S = sqUnits(i),
		can = ARMYK.filter((k) => !UNIT[k].civ && UNIT[k].cost && k !== 'spy')
			.map((k) => civKind(0, k))
			.filter((k) => UNIT[k].age <= p.age && readyAt(0, UNIT[k]).length),
		kinds = [...new Set([...S.map((u) => u.kind), ...Object.keys(plan), ...can])];
	let h = kinds.length
		? `<div class="qs hdr"><b>Kind</b><span>have</span><span>want</span><span></span></div>` +
			kinds
				.map(
					(k) =>
						`<div class="qs"><b>${stats(0, k).name}</b>${btn(`sqpk:${i},${k},-`, '−')}<span>${S.filter((u) => u.kind === k).length} · ${plan[k] || 0}</span>${btn(`sqpk:${i},${k},+`, '+')}</div>`,
				)
				.join('')
		: '<p>Train soldiers first.</p>';
	h += `<p class="dim">Soldiers at home fill the plan by themselves. The rest are the reserve.${S.length ? ` Pace: ${paceWord(S)}.` : ''}</p>`;
	h += acts(dialBtns(i) + btn(`intent:${i}`, 'Intent', INTENT[G.bnIntent[i] || 0].name), 'c3');
	if (p.techs.has('muster')) {
		const miss = musterGap(i),
			why = musterWhy(0, miss),
			mc = musterCost(0, miss);
		h += acts(
			btn(
				`muster:${i}`,
				`Train new: +${musterN(miss)}`,
				why ? why.replace(/\.$/, '') : `${costText(mc.cost)} · ${mc.t} s`,
				why ? 'dis' : 'go',
			),
			'c1',
		);
	} else h += `<p class="dim">Muster, at the War Council, trains what a squad lacks in one order.</p>`;
	return h;
}
CARDS.squad = (c) => {
	const i = c.i,
		m = sqOut(i) ? G.msn[i] : null;
	if (!m) return title(BN[i], `at home · ${sqUnits(i).length} in it`) + squadEditHTML(i);
	const S = mUnits(m),
		[word] = mStatus(m),
		plan = m.st === 'act' ? reinforcePlan(m) : null,
		slow = sideSpd(0),
		hp =
			S.reduce((s, u) => s + u.hp, 0) /
			Math.max(
				1,
				S.reduce((s, u) => s + u.max, 0),
			),
		rows = Object.entries(m.kinds || {})
			.map(([k, n0]) => {
				const alive = S.filter((u) => u.kind === k).length;
				return `<tr><td>${stats(0, k).name}</td><td>${alive} / ${n0}</td><td class="${n0 - alive ? 'low' : ''}">${n0 - alive ? n0 - alive + ' fell' : '—'}</td></tr>`;
			})
			.join('');
	return (
		title(m.name, m.st === 'act' ? `fighting · ${Math.round(m.odds * 100)}% to win` : word.toLowerCase()) +
		hpBar(hp, hp > 0.5 ? '#5fd08a' : hp > 0.25 ? '#e6b947' : '#c0392b') +
		`<p><i>Health ${Math.round(hp * 100)}%</i> · ${S.length} of ${m.n0} standing · ${m.what.toLowerCase()} ${m.label}${m.st === 'go' ? `, ${mmss(m.eta || 0)} to arrive` : m.late ? `, ${m.late} s late` : ''} · ${paceWord(S)}</p>` +
		`<table style="width:100%;border-collapse:collapse"><tr><th>Kind</th><th>Alive</th><th>Lost</th></tr>${rows}</table>` +
		(slow < 0.98
			? `<p class="dim">${G.wx !== 'clear' ? 'Weather' : 'Season'}: ${wxWord()}, walking ×${slow.toFixed(2)}.</p>`
			: '') +
		acts(
			btn(
				`hudrein:${i}`,
				plan && plan.go.length ? `Send more +${plan.go.length}` : 'Send more',
				plan && plan.go.length
					? waveLine(plan)
					: plan && plan.even
						? 'already even'
						: plan && plan.late
							? 'too late'
							: 'no reserve',
				plan && plan.go.length ? 'go' : 'dis',
			) +
				btn(`shape:${i}`, 'Formation', FORM[dialOf('form', i)].name, G.P[0].techs.has('formations') ? '' : 'dis') +
				btn(`intent:${i}`, 'Intent', INTENT[G.bnIntent[i] || 0].name),
			'c3',
		) +
		`<p data-act="jump:${m.x},${m.y}" class="dim"><b>Where</b> ${coord(m.x, m.y)} · tap to go</p>` +
		acts(btn(`hdel:${i}`, 'Abort', 'they come home', 'warn'), 'c1')
	);
};

// ═════ The door and its domains (Albert, Build 64) ═════
// Five domains, each a verdict the game already computes, in the colour code: red something wrong, blue available (act on it now),
// green active, white all is well. The door, under People in the row's first slot, shows the highest red, else the highest blue, in
// this order of importance: the realm (what is coming at you), the people, the work, the stores, the tech. A tap goes where that is
// fixed; a second tap on the same problem, or when all is well, opens the Realm page: the mail and the five, in the row. Colour is never
// alone: each tile has its icon and its word.
const DOMAIN_ORDER = ['realm', 'people', 'work', 'stores', 'tech'];
const DOMAIN_NAME = { realm: 'Realm', people: 'People', work: 'Work', stores: 'Stores', tech: 'Tech' };
const domainIcon = () => ({ realm: ICON.def, people: ICON.head, work: ICON.hammer, stores: ICON.gold, tech: ICON.book });
function domains() {
	const p = G.P[0],
		V = unitsOf(0, 'vil'),
		D = {},
		at = (q) => (q ? `jump:${Math.round(q.x)},${Math.round(q.y)}` : '');
	// the realm: what is coming at you, and your squads out
	{
		const I = G.incoming,
			ev = G.ev || {},
			ek = ev.cur ? ev.cur.kind : ev.warned,
			E = ek && EVENTS[ek],
			H = G.horde,
			rout = soldiersOf(0).some((u) => u.state === 'rout'),
			out = BN.some((_, i) => sqOut(i));
		D.realm = I
			? { st: 'red', word: `Raid ${Math.ceil(I.eta)}s`, why: `${I.n} ${I.what} coming`, go: 'page:war' }
			: G.t - (G.warnT ?? -99) < 20
				? { st: 'red', word: 'Foes here', go: 'page:war' }
				: H && H !== 'done' && H.said && H.at - G.t <= 45
					? { st: 'red', word: `Horde ${Math.max(0, Math.ceil(H.at - G.t))}s`, why: EV_LINE.horde, go: 'page:war' }
					: E && E.harm
						? { st: 'red', word: E.door || E.name, why: EV_LINE[ek], go: at(ev.cur && (ev.cur.at || (ev.cur.x !== undefined ? ev.cur : null))) || 'card:guide,rule' }
						: rout
							? { st: 'red', word: 'Rout', go: 'page:war' }
							: E && E.gift
								? { st: 'blue', word: E.door || E.name, why: EV_LINE[ek], go: at(ev.cur && ev.cur.at) || 'card:guide,rule' }
								: out
									? { st: 'green', word: 'Squads out', go: 'page:war' }
									: { st: 'white', word: 'Quiet', go: 'page:war' };
	}
	// the people: room and food
	{
		const pop = popOf(0),
			cap = capOf(0),
			raising = G.blds.some((b) => b.owner === 0 && b.hp > 0 && b.prog < 1 && (b.kind === 'house' || b.kind === 'apartment')),
			canHouse = afford(p, BLD.house.cost) && !capWhy(0, 'house'),
			q = queuedOf(0, 'vil');
		D.people = p.hungry
			? { st: 'red', word: 'Hungry', go: 'job:food' }
			: pop >= cap && cap < POPMAX && !raising && !canHouse
				? { st: 'red', word: 'No room', go: 'page:build' }
				: pop >= cap - 1 && cap < POPMAX && !raising && canHouse
					? { st: 'blue', word: 'A house', go: 'build:house' }
					: q || raising
						? { st: 'green', word: 'Growing', go: 'page:build' }
						: { st: 'white', word: `${pop}/${cap}`, go: 'page:build' };
	}
	// the work: idle hands, a site nobody builds, a field nobody works
	{
		const idle = V.filter(freeVil).length,
			site = G.blds.find((b) => b.owner === 0 && b.hp > 0 && b.prog < 1 && !V.some((v) => v.rep === b && v.job === 'repair')),
			field = bldsOf(0, 'farm').find((b) => b.prog >= 1 && b.node && !(b.node.wk > 0)),
			busy = G.blds.some((b) => b.owner === 0 && b.hp > 0 && b.prog < 1);
		D.work =
			idle && G.t > 20
				? { st: 'red', word: `${idle} idle`, go: 'idlego' }
				: site
					? { st: 'red', word: 'Site waits', go: `card:bld,${site.id}` }
					: field
						? { st: 'red', word: 'No farmer', go: 'job:food' }
						: busy
							? { st: 'green', word: 'Building', go: 'page:jobs' }
							: { st: 'white', word: 'At work', go: 'page:jobs' };
	}
	// the stores: what runs out within two minutes, and what a market would turn into gold
	{
		const low = RES.map((r) => KEY[r]).find((k) => p.res[k] !== undefined && velOf(p, k) <= -1 && $('r' + k) && !$('r' + k).parentElement.hidden),
			sell = goldTight(p) && ready(0, 'market').length;
		D.stores = low
			? { st: 'red', word: `${RESOURCES[LONG[low]].name} low`, go: `job:${LONG[low]}` }
			: sell
				? { st: 'blue', word: 'Sell', go: `card:bld,${ready(0, 'market')[0].id}` }
				: { st: 'white', word: 'Steady', go: 'card:stores' };
	}
	// the tech: research you can start, research under way
	{
		let n = 0;
		for (const v of (G.rdy || new Map()).values()) n += v;
		const learning = p.aging || G.blds.some((b) => b.owner === 0 && b.q.some((j) => j.tech));
		D.tech = n
			? { st: 'blue', word: `${n} ready`, go: 'card:research' }
			: learning
				? { st: 'green', word: 'Learning', go: 'card:research' }
				: { st: 'white', word: 'Nothing new', go: 'card:research' };
	}
	const list = DOMAIN_ORDER.map((id) => ({ id, name: DOMAIN_NAME[id], ...D[id] })),
		top = list.find((d) => d.st === 'red') || list.find((d) => d.st === 'blue') || null;
	return { list, top, n: list.filter((d) => d.st === 'red' || d.st === 'blue').length };
}
// The Realm page: the mail, then the five domains, each a whole tile in the colour code; a tap goes where it is fixed. The realm's own
// tile opens the emergency actions (the bell, shelter, battle stations): the button that sat on the map's right went into it.
function realmPageHTML() {
	const D = domains(),
		un = G.mailN || 0;
	let h = WHOLE('mail', topOf(ICON.mail), un ? `${un} new` : 'Mail', 'realm' + (un ? ' st-blue' : ''), ' aria-label="The mail"');
	for (const d of D.list)
		h += WHOLE(d.id === 'realm' ? 'card:emergency' : d.go, topOf(domainIcon()[d.id]), d.word, `realm st-${d.st}`, ` aria-label="${d.name}: ${d.word}${d.why ? ', ' + d.why : ''}"`);
	return h;
}
// where a destination is: a page of the row, or a card
const atGo = (go) =>
	go.startsWith('page:') ? (G.hud.page || 'jobs') === go.slice(5) : go.startsWith('card:') ? !!G.card && go.slice(5).startsWith(G.card.type) : false;
function doorTap() {
	const T = DOOR.top; // what the door shows, not a fresh read: a change inside the 150 ms between draws cannot send you elsewhere (Build 65)
	if (T && DOOR.went !== DOOR.key && !atGo(T.go)) {
		DOOR.went = DOOR.key; // one tap a problem: the second opens the Realm, so an action (the food rally, a house) is never repeated or undone
		closeCard();
		act(T.go);
	} else hudPage('realm'); // all is well, already there, or the second tap: the Realm page
	feel('tick');
}
const doorHTML = () =>
	`<button class="cell st door" id="doorB" data-act="door" aria-label="The door: the most important thing now"><span class="top"></span>${wd('')}</button>`;
let DOOR = { sig: '', key: '', top: null, went: '' }; // top: what the door shows, which its tap follows; went: the problem it last took you to
function doorUI() {
	if (!G || G.over) return;
	const D = domains(),
		T = D.top,
		st = T ? T.st : 'white',
		icon = T ? domainIcon()[T.id] : ICON.ok,
		word = T ? T.word : 'All well',
		sig = st + icon + word + D.n,
		key = T ? T.id + T.st : '',
		fresh = key !== DOOR.key;
	DOOR.top = T;
	const el = $('doorB');
	if (el.sig !== sig) {
		el.sig = sig;
		el.className = 'cell st door ' + st;
		el.children[0].innerHTML = icon;
		el.children[1].textContent = word;
		const pl = el.querySelector('.dn');
		if (pl) pl.remove();
		if (D.n > 1) el.insertAdjacentHTML('beforeend', `<span class="dn">${D.n}</span>`);
		el.setAttribute('aria-label', T ? `${T.name}: ${word}` : 'All is well: the Realm');
	}
	if (fresh && T) {
		el.classList.remove('pulse');
		void el.offsetWidth;
		el.classList.add('pulse'); // a new red or blue pulses the door once and is heard: seen and heard, as every alert must be
	}
	if (fresh) {
		DOOR.key = key;
		if (T) {
			if (T.id !== 'realm' && G.t > 5) sfx(T.st === 'red' ? 'err' : 'pick'); // the realm's alarms already sound (the horn, the bell)
		}
	}
}
