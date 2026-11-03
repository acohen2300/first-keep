// ═════ 39-huddle.js: the row below the map and its three pages, the War HUD's missions, the squad card ═════
// The row (MENU-SPEC §6, Albert's drawings of Oct 30 and 31): one Formation two ranks tall, the same six columns on every page, turned by one
// button that sits on its own rank above slot 1 and says the page's name: Jobs → War → Train. Slot 1 is two whole slots with the 6 gap
// between; slots 2 to 5 (to 6 on Jobs) are the page's things, each with − and + under it or, on War, its time and pace; slot 6 is ✓ over ✕.
// Building is a job: the hammer under People is the one way to the Build menu. War is the HUD: the target over Home, the three squads, Go over
// Abort; a squad is built on its card. Every slot is a picture icon with its number and its word, or a symbol alone (pic, sym in 32-frame);
// its state is a ring (the states in the style sheet). The Huddle's sequence (ready, aim, fire, abort) lives on in the War page's missions.
const HUD = {
	near: 140, // a fight is what hostile soldiers within this reach of the group make
	lose: 0.4, // a mission below this chance says it is losing, once until it climbs above clear
	clear: 0.5,
	smooth: 0.3, // the chance moves a third of the way each second: about three seconds to settle
	gap: 8, // reinforcements arriving within this many seconds of each other are one wave
	waves: 3,
};
const mUnits = (m) => G.units.filter((u) => u.owner === 0 && u.ord === m.ord && u.hp > 0);
const sqUnits = (i) => armyOf(0).filter((u) => u.bn === i && u.kind !== 'spy');
const sqOut = (i) => G.msn[i] && !G.msn[i].end; // the squad is out on a mission
const hostile = (v) =>
	v.owner !== 0 &&
	v.hp > 0 &&
	!v.inside &&
	isFoe(0, v) &&
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
const wxWord = () => (G.wx !== 'clear' && WEATHER[G.wx] ? WEATHER[G.wx].name : season().name);
// a squad's pace in a word, from its slowest member (an elephant makes it slow, horse alone fast): what the squad card says (Albert, Build 63)
function paceWord(S) {
	if (!S.length) return '';
	const v = Math.min(...S.map((u) => paceOf(u, 1)));
	return ROW_WORD.pace[v < 14 ? 0 : v < 22 ? 1 : 2];
}
// ── the pages
function hudPage(page) {
	const H = G.hud;
	H.page = page || null;
	H.sub = null;
	H.aim = false;
	if (H.page) closeCard();
} // a page by name (a milestone's button, the tests)
// the kind a class trains from the Train page, and fills a muster with: the first its building trains in this age (a people's own unit in its place)
const kindOf = (t) =>
	ARMYK.filter((k) => !UNIT[k].civ && UNIT[k].cost && k !== 'spy')
		.map((k) => civKind(0, k))
		.find((k) => UNIT[k].at === CLS[t][2] && UNIT[k].age <= G.P[0].age);
function sqPlan(i, c, d) {
	// a squad holds BNSIZE at most, every kind together; the step is 1 under ten, 5 above. c: the kind's id in CLS (foot, arch, horse, siege)
	const P = G.bnPlan[i],
		cur = P[c] || 0,
		st = d > 0 ? (cur < 10 ? 1 : 5) : cur <= 10 ? 1 : 5,
		others = Object.entries(P).reduce((n, [q, v]) => n + (q === c ? 0 : v), 0);
	P[c] = clamp(cur + d * st, 0, Math.max(cur, BNSIZE - others));
	if (!P[c]) delete P[c];
	rebattalion();
}
// ── aiming: the crosshair, moved by a tap on the map while the War or Train page is open
function aimSpot(sx, sy) {
	const H = G.hud;
	let h = hitAt(sx, sy);
	const foe = (h.t === 'unit' || h.t === 'bld') && h.e.owner !== 0;
	if (!(h.t === 'ground' || h.t === 'find' || foe)) h = { t: 'ground', e: { x: h.e.x, y: h.e.y } };
	H.h = h;
	H.moved = true;
}
const aimNear = (sx, sy) => {
	const H = G.hud;
	return H.aim && H.h && hyp(sx - SX(H.h.e.x), sy - SY(H.h.e.y)) < 56;
};
function aimAt(sx, sy) {
	const H = G.hud;
	aimSpot(sx, sy);
	if (H.aim === 'rally') {
		H.aim = false;
		return setRally();
	} // Rally (the controller): the tap is where new soldiers go
	if (H.aim === 'ambush') {
		H.aim = false;
		return ambushAt(H.h); // the ambush tool: the tap is the cover
	}
	ripple(H.h.e.x, H.h.e.y, aimColor());
	feel('tick');
}
// the crosshair's colour says what is under it (Albert, Build 63): green yours, blue an ally, white nothing (nature), red an enemy or a hazard
function aimColor(h = G.hud.h) {
	if (!h) return codeOf('w');
	if (h.t === 'unit' || h.t === 'bld') {
		const o = h.e.owner;
		if (o === 0) return codeOf('g');
		if (isFoe(0, h.e)) return codeOf('r');
		if (friendly(0, o)) return codeOf('b');
		return codeOf('w');
	}
	const near = nearU(h.e, 60, (v) => v.owner !== 0 && v.hp > 0 && hostile(v) && visibleTo0(v));
	if (near || hazardAt(h.e.x, h.e.y)) return codeOf('r');
	return codeOf('w');
}
const hazardAt = (x, y) =>
	(G.sand && hyp(x - G.sand.x, y - G.sand.y) < G.sand.r) ||
	G.blds.some((b) => b.fire > 0 && dist(b, { x, y }) < 60) ||
	(G.cracks || []).some((c) => hyp(x - c.x, y - c.y) < 40);
// who a squad sends: its idle members; with no squads yet, every idle soldier
const sqFree = (i) => (i === null || i === undefined ? free() : free().filter((u) => u.bn === i));
// a squad's time to the crosshair (null: every idle soldier), kept for each squad until the target, the squad, the sky or three seconds change
function hudEta(i = null) {
	const H = G.hud,
		S = sqFree(i);
	if (!H.h || !S.length) return 0;
	const key = `${H.h.e.x | 0},${H.h.e.y | 0},${S.length},${G.wx},${(G.t / 3) | 0}`,
		E = (H.eta = H.eta || {}),
		e = (E[i] = E[i] || {});
	if (e.key !== key) {
		e.key = key;
		e.v = etaOf(S, H.h.e, routeK(centreOf(S), H.h.e));
	}
	return e.v;
}
// Go: a squad marches on the crosshair as one order and takes its slot (with no squads yet, every idle soldier takes the first free slot)
function hudFire(i) {
	const H = G.hud,
		S = sqFree(i),
		slot = i ?? G.msn.findIndex((m) => !m || m.end);
	if (!H.h) H.h = { t: 'ground', e: { x: cam.x, y: cam.y } };
	if (slot < 0) return say('Every slot is out.', '', TOAST.short);
	if (!S.length) return say(i === null || i === undefined ? freeWhy() : `${BN[i]}: nobody idle in it.`, '', TOAST.short);
	if (sqOut(slot)) hudAbort(slot, true);
	const before = G.ordN || 0;
	order(S, H.h);
	if ((G.ordN || 0) === before) return; // refused: the reason was said
	const O = G.ords[G.ordN],
		kinds = {};
	for (const u of S) kinds[u.kind] = (kinds[u.kind] || 0) + 1;
	G.msn[slot] = {
		name: i === null || i === undefined ? ROW_WORD.army : BN[i],
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
	H.firedT = performance.now();
	orderCost(0, S); // a squad sent: its meals, and tired after (ORDER)
	feel('thock');
}
// Go (✓ on War): every squad at home and ready (its blue ring) marches on the crosshair, each its own mission; with none ready, or before
// Battalions, every idle soldier goes as one
function hudGo() {
	const ready = hasCmd() ? BN.map((_, i) => i).filter((i) => !sqOut(i) && sqFree(i).length) : [];
	if (ready.length) ready.forEach((i) => hudFire(i));
	else hudFire(null);
}
// a mission leaves: the soldiers go home, the slot is free
function hudAbort(slot, quiet) {
	const m = G.msn[slot];
	if (!m) return;
	sendHome(mUnits(m));
	G.msn[slot] = null;
	if (G.card && G.card.type === 'squad' && G.card.i === slot) refresh();
	if (!quiet) say(`${m.name} called home.`, '', TOAST.short);
}
function hudAbortAll() {
	G.msn.forEach((_, i) => hudAbort(i));
}
// Home: everyone back, every mission off
function hudHome() {
	hudAbortAll();
	sendHome(sendable());
	say('Everyone home.', '', TOAST.short);
}
// Orders (the Train page): where new soldiers go when they are made, and which squad they join; ✓ on the crosshair sets it
function setRally() {
	const H = G.hud;
	if (!H.h) return;
	G.rally0 = { x: Math.round(H.h.e.x), y: Math.round(H.h.e.y) };
	say('New soldiers will go there.', 'good', TOAST.short);
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
			say(`${m.name} is lost.`, 'warn', TOAST.mid);
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
			say(`${m.name} is losing.`, 'warn', TOAST.mid);
		} else if (m.flash === 'lose' && m.odds > HUD.clear) m.flash = null;
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
		const k = new Set(list.map((r) => clsOf(r.u.kind)));
		return k.size === 1 ? CLS[[...k][0]][3] : 'soldiers';
	};
	return plan.waves
		.map((w, i) => `${w.list.length} ${i ? 'more' : word(w.list)} ${i ? 'by' : 'in'} ${clock(w.t)}`)
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
	if (!plan || !plan.go.length) return say('Too late: nobody can get there in time.', '', TOAST.short);
	hudJoin(plan.go, m);
	say(`${plan.go.length} reinforce ${m.name}.`, 'good', TOAST.short);
}
// ── The controller (Albert, Nov 3, "yes yes" 08:51; MENU-SPEC §6): the bottom row is seven columns, 6 at the screen's edges and 3 between,
// two ranks of 44. Four tiles never move: Jobs over Town in column 1 (the villagers, brown), War over Close in column 7 (war, steel). The
// five columns between show what the lit tile opens, one step at a time: Jobs, the five jobs with − and + under each (as before); Town,
// one column (People over Build), and Build, the build groups, then a group's buildings; War, the war display, and its three pages
// (Kinds, Train, Alarm). At rest, and while only Town's column is open, the small map stands 3 × 2 in columns 3 to 5 with its tile (Map,
// lit while it shows) in column 6. Close folds the whole row to one tile. G.hud: page (null at rest, 'jobs', 'town', 'war'), sub (Town:
// 'build' or a build group; War: 'kinds', 'train', 'alarm'), map (the small map shown), shut (the row folded).
const CTL = { cols: 7, map: [3, 5], back: [6, 2] }; // the map's columns; where Back stands on every page that has one; the Map tile is (7, 2)
const at = (h, c, r) => h.replace('<button ', `<button style="grid-column:${c};grid-row:${r}" `); // a cell in its column and rank
const badge = (h, n) => (n ? h.replace('</button>', `<span class="bd">${n}</span></button>`) : h); // a count on a tile's corner (idle villagers, soldiers)
const wcell = (act, word, sub, cls = '', attrs = '') => `<button class="cell wc ${cls}" data-act="${act}"${attrs}><b>${word}</b>${sub ? `<small>${sub}</small>` : ''}</button>`; // a word cell: a building has a picture on the map, not an icon
// the five between, from column 2: cells in rank order, ten at most, Back in its place
const fill = (cells, c0 = 2) =>
	cells
		.map((h, i) => (h ? at(h, c0 + (i % 5), 1 + Math.floor(i / 5)) : ''))
		.join('');
const backCell = (cls) => at(pic('ctlback', ICON.back, 'Back', cls), ...CTL.back);
const pmPair = (c, minus, plus, cls, on = true) =>
	`<div class="pm" style="grid-column:${c};grid-row:2">${sym(minus, ICON.minus, `${cls} h${on ? '' : ' dis'}`, 'One fewer')}${sym(plus, ICON.plus, `${cls} h${on ? '' : ' dis'}`, 'One more')}</div>`;
function jobsCells() {
	const p = G.P[0],
		V = unitsOf(0, 'vil');
	return JOBS.map((r, i) => {
		const k = KEY[r],
			on = resOn(k), // a job not open yet is locked, with no count (32-frame, resOn)
			n = V.filter((v) => v.job === r).length;
		return (
			at(on ? pic(`job:${r}`, ICON[r], RESOURCES[r].name, 'vb' + (p.rally === r ? ' on' : ''), n, ` style="--nc:${grad(velOf(p, k))}"`) : pic(`job:${r}`, ICON[r], RESOURCES[r].name, 'vb dis'), 2 + i, 1) +
			pmPair(2 + i, `less:${r}`, `move:${r}`, 'vb', on)
		);
	}).join('');
}
// Town: People over Build (column 2); Build: the six groups, Research, Relations; a group: its buildings, words only (name, cost)
function townCells(sub) {
	const p = G.P[0],
		V = unitsOf(0, 'vil'),
		site = G.blds.find((b) => b.owner === 0 && b.hp > 0 && b.prog < 1);
	if (!sub)
		return (
			at(pic('train:vil', ICON.people, ROW_WORD.people, 'vb' + (V.some(freeVil) ? ' go' : trainWhy(0, 'vil') ? ' dis' : ''), null, ' aria-label="People: train a villager"'), 2, 1) +
			at(pic('ctlsub:build', ICON.hammer, ROW_WORD.build, 'vb' + (site ? ' work' : ''), null, site ? ` style="${toGo(1 - site.prog)}"` : ''), 2, 2)
		);
	// Build (Albert, Nov 3, 13:13: "a button that brings up the full building menu"): every building of your age, in the groups' order, as word
	// cells (name, and under it 'short' or 'all built'); eight a page, More › turning the page, Back; Research and Relations hold the first
	// page's last two places. A building of a later age is not shown (it was a dim word; the Guide lists them). The groups page is cut.
	const rs = researchable(),
		all = MENUS.flatMap((m) => m.items).filter((k) => BLD[k].age <= p.age),
		pageN = Math.max(1, Math.ceil((all.length + 2) / 8)),
		pg = Math.min(G.hud.bpage || 0, pageN - 1),
		fixed = pg === 0 ? [pic('card:research', ICON.book, ROW_WORD.research, 'vo' + (rs ? '' : ' dis'), rs || null), pic('relopen', ICON.ally, ROW_WORD.relations, 'vo')] : [],
		from = pg === 0 ? 0 : 6 + (pg - 1) * 8,
		here = all.slice(from, from + 8 - fixed.length),
		cell = (k) => {
			const B = BLD[k],
				full = bldsOf(0, k).length >= capFor(0, k);
			return wcell(`build:${k}`, B.short || bldName(0, k), full ? 'all built' : afford(p, B.cost) ? '' : 'short', 'v2' + (full ? ' dis' : ''), ` aria-label="${bldName(0, k)}: ${costText(B.cost)}"`);
		};
	return (
		fill([...fixed, ...here.map(cell)]) +
		(pageN > 1 ? at(pic('bpage', ICON.next, `${pg + 1} of ${pageN}`, 'v2'), 6, 1) : '') +
		backCell('v2')
	);
}
// War: Aim · Go (tap: the crosshair up; again: everyone goes; hold: everyone home), the three squads (tap: send; hold: its card), Kinds ›,
// then Alarm › (brown: the villagers' orders), Rally, Formation (steps the army's shape), Train ›, Set Up. Kinds: tap picks every soldier of
// the kind, a hold is its drill (the War Director); Idle picks the soldiers standing at home. Train: the four kinds with − and +.
function warCells(sub) {
	const H = G.hud,
		W = ROW_WORD.emgW;
	if (sub === 'kinds')
		return (
			fill([
				...CLS.map((c, t) => {
					const n = ofKind(t).length,
						w = directWait(t),
						tap = DIRECT_OF[t],
						Sh = G.share && G.share.t === t && shareOn() ? G.share : null; // the share picked: its count, and the step it is on
					return pic(`kpick:${t}`, ICON.cls[c[0]], w ? `${w} s` : Sh && Sh.i ? `${c[1]} ${['', '½', '¼'][Sh.i]}` : c[1], 'w2' + (n ? '' : ' dis') + (Sh ? ' on' : ''), Sh ? Sh.n : n || null, ` data-hold="direct:${t}" aria-label="${c[1]}: tap for all, half, a quarter; hold: ${tap[1]}"`);
				}),
				pic('kidle', ICON.idle, ROW_WORD.idle, 'w2' + (idleSoldiers().length ? '' : ' dis'), idleSoldiers().length || null),
			]) + backCell('w2')
		);
	if (sub === 'train')
		return (
			CLS.map((c, t) => {
				const k = kindOf(t),
					A = k ? readyAt(0, UNIT[k]) : [],
					n = A.reduce((s, b) => s + b.q.filter((j) => j.kind === k).length, 0);
				return at(pic(`tq:${t},+`, ICON.cls[c[0]], c[1], 'w2' + (A.length ? '' : ' dis'), A.length ? n : null), 2 + t, 1) + pmPair(2 + t, `tq:${t},-`, `tq:${t},+`, 'w2', A.length > 0);
			}).join('') + backCell('w2')
		);
	if (sub === 'alarm') {
		const on = (kind) => (G.emg && G.emg.kind === kind ? '●' : null);
		return (
			fill([
				pic('emgstop', ICON.ok, W[0][0], 'v2' + (G.emg ? '' : ' dis')),
				pic('emg:square', ICON.gather, W[1][0], 'v2', on('square')),
				pic('emg:hands', ICON.def, W[2][0], 'v2', on('hands')),
				pic('emg:shelter', ICON.shield, W[3][0], 'v2' + (unitsOf(0, 'vil').length ? '' : ' dis'), on('shelter')),
			]) + backCell('v2')
		);
	}
	const sh = dialOf('form', 'all');
	return fill([
		pic('aimgo', ICON.aim, H.aim ? ROW_WORD.go : ROW_WORD.aim, 'wo' + (H.aim ? ' on' : ''), null, ' data-hold="whome"'),
		...BN.map((nm, i) => {
			const m = sqOut(i) ? G.msn[i] : null,
				S = m ? mUnits(m) : hasCmd() ? sqUnits(i) : [];
			return pic(`wsq:${i}`, ICON.squad, m ? m.name : nm, 'wo' + (hasCmd() || m ? '' : ' dis'), S.length, ` data-hold="sqcard:${i}"`);
		}),
		pic('ctlsub:kinds', ICON.kinds, ROW_WORD.kinds, 'wo'),
		pic('ctlsub:alarm', ICON.bell, ROW_WORD.alarm, 'vo' + (G.emg ? ' warn' : '')),
		pic('rallyat', ICON.flag, H.aim === 'ambush' ? ROW_WORD.ambush : ROW_WORD.rally, 'wo' + (H.aim === 'rally' || H.aim === 'ambush' ? ' on' : ''), null, ' data-hold="ambushtool"'),
		pic('shape:all', ICON.list, H.aim === 'choke' ? ROW_WORD.choke : sh < 0 ? 'Mixed' : FORM[sh].name, 'wo' + (G.P[0].techs.has('formations') ? '' : ' dis') + (H.aim === 'choke' ? ' on' : ''), null, ' data-hold="choketool"'),
		pic('ctlsub:train', ICON.train, ROW_WORD.train, 'wo'),
		pic('sqsetup', ICON.gear, ROW_WORD.setup, 'wo' + (hasCmd() ? '' : ' dis')),
	]);
}
const researchable = () => [...G.rdy.values()].reduce((a, v) => a + v, 0); // research you can start now (the count the strip shows)
const idleSoldiers = () => sendable().filter((u) => u.state === 'home');
const MENU_WORD = { mil: 'Barracks' }; // (the groups page is cut, Nov 3; the words stay for the Guide) // a build group's word on the controller where the menu's own would clash with a tile (War)
const MENU_ICON = { home: 'home', land: 'wood', mil: 'tent', def: 'def', shop: 'gold', cult: 'star' }; // a build group's picture
const fullPage = () => (G.hud.page === 'town' ? !!G.hud.sub : !!G.hud.page); // a page that fills the five columns (not rest, not Town's column)
const mapShown = () => (fullPage() ? G.hud.mapOn === G.hud.page + (G.hud.sub || '') : !!G.hud.map);
function ctlHTML() {
	const H = G.hud,
		page = H.page,
		idle = unitsOf(0, 'vil').filter(freeVil).length + G.blds.filter(idlePost).length, // every Z on the map: idle people and empty posts (D-089)
		sol = armyOf(0).filter((u) => u.kind !== 'spy').length;
	if (H.shut) return at(sym('ctlshut', ICON.up, 'vb mb', 'Open the controls'), 7, 2);
	let h =
		at(badge(pic('ctl:jobs', ICON.basket, ROW_WORD.jobs, page === 'jobs' ? 'vo' : 'vb'), idle && `z ${idle}`), 1, 1) +
		at(badge(pic('ctl:town', ICON.town, ROW_WORD.town, page === 'town' ? 'vo' : 'vb'), researchable() || null), 1, 2) +
		at(badge(pic('ctl:war', ICON.swordup, ROW_WORD.war, (page === 'war' ? 'wo' : 'wb') + (G.incoming ? ' raid' : '')), sol), 7, 1) +
		at(pic('mapt', ICON.map, ROW_WORD.map, 'vb mb' + (mapShown() ? ' on' : ''), null, ' data-hold="ctlshut"'), 7, 2);
	if (page === 'jobs') h += jobsCells();
	else if (page === 'town') h += townCells(H.sub);
	else if (page === 'war') h += warCells(H.sub);
	if (mapShown()) h += `<div class="mapb" style="grid-column:${CTL.map[0]} / ${CTL.map[1] + 1};grid-row:1 / 3"></div>`;
	// the Map tile in one spot on every page, under War (Albert, Nov 3, 13:13: "same spot always"; 11:00: "it can replace whatever icons it
	// covers if a person wants"): at rest and beside Town's column the small map, 3 × 2, shows while H.map; on a full page it shows only
	// where the person turned it on (H.mapOn names the page), over columns 3 to 5, covering what is under it. The tile took Close's place,
	// so a hold on it folds the row
	return h;
}
// a tile: its page opens, the lit one closes back to rest; a page's own step (Build, a group, Kinds, Train, Alarm), and Back one step up
function ctlOpen(page) {
	const H = G.hud;
	H.page = H.page === page ? null : page;
	H.sub = null;
	H.mapOn = null; // the map on a full page lasts while that page is open
	H.aim = false; // the crosshair goes up only by Aim (war's first cell)
	if (H.page) closeCard();
}
function ctlBack() {
	const H = G.hud;
	H.sub = H.page === 'town' && H.sub && H.sub !== 'build' ? 'build' : null;
}
// the row on show, patched in place (a button under a finger stays the same button); the small map's one home is its box
function rowUI() {
	const el = $('row'),
		h = ctlHTML();
	if (el.sigH !== h) {
		el.sigH = h;
		patchHTML(el, h);
	}
	const mb = el.querySelector('.mapb');
	if (mb && mini.parentNode !== mb) mb.appendChild(mini);
	else if (!mb && mini.parentNode !== $('stage')) $('stage').appendChild(mini);
	const sig = (G.hud.page || '') + (G.hud.shut ? 's' : '');
	if (el.pg !== sig) {
		el.pg = sig;
		$('orders').className = 'ctl pg-' + (G.hud.page || 'rest');
		fit(); // the row is drawn anew: the map's bottom edge is measured again
	}
}
// the crosshair (Albert, Nov 3: "a very basic one from best practices"; mock 24's chevrons, scan line and sonar ring cut): a thin cross with a
// gap at the middle and a dot, a dark edge under it so it reads on any ground, its colour what is under it (aimColor), green once fired; the
// arrival time and the place above it. Held (H.drag): a faint disc shows the finger has it.
function drawReticle() {
	const H = G.hud;
	if (!H.aim || !H.h) return;
	const x = SX(H.h.e.x),
		y = SY(H.h.e.y),
		L = performance.now() - (H.firedT || -1e9) < timeOf('settle') ? 1 : 0,
		R = Math.max(22, 12 * cam.z + 6),
		g = 6, // the gap round the middle
		eta = hudEta(),
		cross = () => {
			ctx.beginPath();
			ctx.moveTo(x - R, y);
			ctx.lineTo(x - g, y);
			ctx.moveTo(x + g, y);
			ctx.lineTo(x + R, y);
			ctx.moveTo(x, y - R);
			ctx.lineTo(x, y - g);
			ctx.moveTo(x, y + g);
			ctx.lineTo(x, y + R);
			ctx.stroke();
		};
	ctx.save();
	ctx.lineCap = 'round';
	if (H.drag) {
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = codeOf('w');
		ctx.beginPath();
		ctx.arc(x, y, R + 10, 0, 7);
		ctx.fill();
		ctx.globalAlpha = 1;
	}
	ctx.strokeStyle = 'rgba(0,0,0,.6)';
	ctx.lineWidth = 4;
	cross();
	ctx.strokeStyle = ctx.fillStyle = L ? codeOf('g') : aimColor(H.h);
	ctx.lineWidth = 2;
	cross();
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, 7);
	ctx.fill();
	ctx.font = mapFont(); // pinned to the screen
	ctx.textAlign = 'center';
	ctx.lineJoin = 'round';
	ctx.strokeStyle = 'rgba(0,0,0,.75)';
	ctx.lineWidth = 3;
	const w = eta ? `${clock(eta)} · ${coord(H.h.e.x, H.h.e.y)}` : coord(H.h.e.x, H.h.e.y);
	ctx.strokeText(w, x, y - R - 8);
	ctx.fillText(w, x, y - R - 8);
	ctx.restore();
}
// ── the squad card (MENU-SPEC §8, picture Mission Flow): the squad builder while it is home, the live view while it is out (Build 61, one card, two states)
// Commander's intent (Build 63): what the squad is for, in the words the doctrine uses. The card shows it; the soldiers read it in solTick.
// three intents (the doctrine's words): Engage fights what it meets, soldiers before buildings; No pursuit walks to the spot and fights only
// what comes within reach; Buildings first takes the nearest building and leaves the soldiers to the rest
const INTENT = [
	{ name: 'Engage', note: 'fight what you meet' },
	{ name: 'No pursuit', note: 'fight what blocks' },
	{ name: 'Buildings first', note: 'then the soldiers' },
]; // each note one line under its name, so the rank keeps its 44 (MENU-SPEC §1)
// the three intents, one chosen (its gold ring); it can change on the way
const intentsHTML = (i) =>
	acts(INTENT.map((t, k) => btn(`intent:${i},${k}`, t.name, t.note, (G.bnIntent[i] || 0) === k ? 'on' : '')).join(''), 'c3');
// At home: the four kinds, each with how many the squad holds and − + under it (soldiers at home step in by themselves); the intents; Muster
// once researched; then Cancel, back to what it held when the card opened, and Save ✓, the card's one gold fill. A kind goes to its building.
function squadHomeHTML(c) {
	const i = c.i,
		P = G.bnPlan[i],
		n = Object.values(P).reduce((s, v) => s + v, 0),
		H = G.hud,
		eta = H.h && sqFree(i).length ? hudEta(i) : 0;
	title(BN[i], `${sqUnits(i).length} at home${eta ? ` · ${clock(eta)} to ${coord(H.h.e.x, H.h.e.y)}` : ''}`);
	fold('about', 'About squads', '<p>Soldiers at home fill what a squad holds by themselves; the rest are the reserve. Send it from the War page with Go.</p>');
	let h =
		acts(CLS.map((k, t) => pic(`bldgo:${k[2]}`, ICON.cls[k[0]], k[1], '', P[k[0]] || 0)).join(''), 'c4') +
		acts(
			CLS.map(
				(k, t) =>
					`<div class="duo">${sym(`sqpk:${i},${t},-`, ICON.minus, P[k[0]] ? 'h' : 'h dis', `One fewer ${k[3]}`)}${sym(`sqpk:${i},${t},+`, ICON.plus, n < BNSIZE ? 'h' : 'h dis', `One more ${k[3]}`)}</div>`, // − and + share the tile's width above them
			).join(''),
			'c4',
		) +
		intentsHTML(i);
	if (G.P[0].techs.has('muster')) {
		const miss = musterGap(i),
			why = musterWhy(0, miss),
			mc = musterCost(0, miss);
		h += acts(btn(`muster:${i}`, `Train new: +${musterN(miss)}`, why ? why.replace(/\.$/, '') : `${costText(mc.cost)} · ${mc.t} s`, why ? 'dis' : 'go'), 'c1');
	}
	return h + acts('<i></i>' + btn('sqcancel', 'Cancel') + btn('sqsave', 'Save', '', 'main'), 'c3');
}
// Out: how it stands, what it lost, send more from the idle reserve, its shape and intent, where it is, Abort
function squadOutHTML(i, m) {
	const S = mUnits(m),
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
	title(m.name, m.st === 'act' ? `fighting · ${Math.round(m.odds * 100)}% to win` : `${clock(m.eta || 0)} to arrive`);
	return (
		hpBar(hp, hp > 0.5 ? codeOf('g') : hp > 0.25 ? 'var(--gold-1)' : codeOf('r')) +
		`<p><i>Health ${Math.round(hp * 100)}%</i> · ${S.length} of ${m.n0} standing · ${m.what.toLowerCase()} ${m.label}${m.st === 'go' ? `, ${clock(m.eta || 0)} to arrive` : ''} · ${paceWord(S)}</p>` +
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
			) + btn(`shape:${i}`, 'Formation', FORM[dialOf('form', i)].name, G.P[0].techs.has('formations') ? '' : 'dis'),
		) +
		intentsHTML(i) +
		`<p data-act="jump:${m.x},${m.y}" class="dim"><b>Where</b> ${coord(m.x, m.y)} · tap to go</p>` +
		acts(btn(`hdel:${i}`, 'Abort', 'they come home', 'warn'), 'c1')
	);
}
CARDS.squad = (c) => {
	c.was = c.was || { plan: { ...G.bnPlan[c.i] }, intent: G.bnIntent[c.i] || 0 }; // what Cancel goes back to: the squad as the card found it
	return sqOut(c.i) ? squadOutHTML(c.i, G.msn[c.i]) : squadHomeHTML(c);
};
// Set Up (Albert, Nov 2): the Squad page's fourth tile. The three squads in one rank, each with what it is set to hold; a tap opens that squad's card, where it is built.
CARDS.sqsetup = () => {
	title('Set Up', 'build your squads');
	return (
		list(
			BN.map((n, i) => {
				const P = G.bnPlan[i],
					held = CLS.filter((c) => P[c[0]]).map((c) => `${P[c[0]]} ${c[3]}`).join(' · ');
				return btn(`sqcard:${i}`, n, held || 'empty');
			}),
		) + `<p>New soldiers fill each squad up to what you set on its card; the rest are the reserve.</p>`
	);
};
