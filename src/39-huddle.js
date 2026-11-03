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
	H.page = page;
	H.aim = page === 'war'; // the station puts the crosshair up: a tap on the map moves it
	if (H.aim) {
		H.aimT = performance.now();
		if (!H.h) H.h = { t: 'ground', e: { x: cam.x, y: cam.y } };
		closeCard();
	}
}
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
// ── the row: three pages on one mold. Rank one is the page's six things, rank two what each is under it; grid order lays them
// Jobs: People over the hammer; each job with its count (in its store's colour) and − + under it. People rings blue while people stand idle;
// the hammer wears the working ring while a building goes up (the first site still going up: what is left of it); a job opens with its age.
function jobsPage() {
	const p = G.P[0],
		V = unitsOf(0, 'vil'),
		site = G.blds.find((b) => b.owner === 0 && b.hp > 0 && b.prog < 1);
	let top = pic('train:vil', ICON.people, ROW_WORD.people, V.some(freeVil) ? 'go' : trainWhy(0, 'vil') ? 'dis' : '', null, ' aria-label="People: train a villager"'),
		low = pic('buildrow', ICON.hammer, ROW_WORD.build, site ? 'work' : '', null, ` aria-label="The Build menu"${site ? ` style="${toGo(1 - site.prog)}"` : ''}`);
	for (const r of JOBS) {
		const k = KEY[r],
			on = resOn(k), // a job not open yet is locked, with no count (32-frame, resOn)
			n = V.filter((v) => v.job === r).length;
		top += on ? pic(`job:${r}`, ICON[r], RESOURCES[r].name, p.rally === r ? 'on' : '', n, ` style="--nc:${grad(velOf(p, k))}"`) : pic(`job:${r}`, ICON[r], RESOURCES[r].name, 'dis');
		low += sym(`less:${r}`, ICON.minus, on ? 'h' : 'h dis', `One fewer on ${r}`) + sym(`move:${r}`, ICON.plus, on ? 'h' : 'h dis', `One more on ${r}`);
	}
	return top + low;
}
// The battle station (Albert, Nov 2, his drawings: "the controller"; the War Director, 28-army-quick): one page in place of War and Train, the row's 6 x 2 as three 2 x 2
// blocks. Left, the Alarm's four orders (40-emergency). Middle, one joined block that changes: the small map (tap: the camera goes there;
// hold: the army is launched there), or the four squads (tap: send it to the crosshair; hold: its card), or the four kinds to train (tap:
// one more; hold: one fewer), or the Director's four (tap: the kind's move; hold: its second). Right: Train (hold: new soldiers go to the
// crosshair), Squad and Direct turn the middle, Attack sends every
// ready squad there (hold: everyone home). The villagers' block brown (vb), the war block steel tinted red (wb), no state rings (EXCEPTIONS: a battle station is all live); a tap flashes red and
// snaps off (the click handler, 33-verbs). The crosshair is up while it is open: a tap on the map moves it.
const SMID = { map: 'map', squad: 'squad', train: 'train', direct: 'direct' }; // what the station's middle shows
function stationPage() {
	const H = G.hud,
		mid = H.mid || SMID.map,
		V = unitsOf(0, 'vil').length,
		on = (kind) => (G.emg && G.emg.kind === kind ? '●' : null),
		W = ROW_WORD.emgW;
	let h =
		pic('emgstop', ICON.stop, W[0][0], 'vb' + (G.emg ? '' : ' dis')) +
		pic('emg:square', ICON.home, W[1][0], 'vb', on('square')) +
		`<div class="midb${mid === SMID.map ? ' map' : ''}">` +
		(mid === SMID.squad
			? BN.map((nm, i) => {
					const m = sqOut(i) ? G.msn[i] : null,
						S = m ? mUnits(m) : hasCmd() ? sqUnits(i) : [];
					return pic(`wsq:${i}`, ICON.squad, m ? m.name : nm, hasCmd() || m ? '' : 'dis', S.length, ` data-hold="sqcard:${i}"`);
				}).join('') + pic('sqsetup', ICON.gear, ROW_WORD.setup, hasCmd() ? '' : 'dis')
			: mid === SMID.direct
				? CLS.map((c, t) => {
						const n = ofKind(t).length,
							w = directWait(t),
							[tap, hold] = DIRECT_OF[t];
						return pic(`direct:${t}`, ICON.cls[c[0]], w ? `${w} s` : tap[1], n && !w ? '' : 'dis', n || null, ` data-hold="directh:${t}" aria-label="${c[1]}: ${tap[1]}; hold: ${hold[1]}"`);
					}).join('')
				: mid === SMID.train
				? CLS.map((c, t) => {
						const k = kindOf(t),
							at = k ? readyAt(0, UNIT[k]) : [],
							n = at.reduce((s, b) => s + b.q.filter((j) => j.kind === k).length, 0);
						return pic(`tq:${t},+`, ICON.cls[c[0]], c[1], at.length ? '' : 'dis', at.length ? n : null, ` data-hold="tq:${t},-"`);
					}).join('')
				: '') +
		'</div>' +
		pic('wmid:train', ICON.mil, ROW_WORD.train, 'wb', null, ' data-hold="tok"') +
		pic('wmid:squad', ICON.squad, ROW_WORD.squad, 'wb') +
		pic('emg:hands', ICON.sword, W[2][0], 'vb', on('hands')) +
		pic('emg:shelter', ICON.shield, W[3][0], 'vb' + (V ? '' : ' dis'), on('shelter')) +
		pic('wmid:direct', ICON.aim, ROW_WORD.direct, 'wb') +
		pic('wfire', ICON.sword, ROW_WORD.attack, 'wb' + (H.h && free().length ? '' : ' dis'), null, ' data-hold="whome"');
	return h;
}
const ROWS = { jobs: jobsPage, war: stationPage };
// the row on show, patched in place (a button under a finger stays the same button); the cycle button above slot 1 wears the page's name
// and its tint
function rowUI() {
	const page = G.hud.page,
		el = $('row'),
		h = ROWS[page](),
		chip = $('emgB');
	if (el.sigH !== h) {
		el.sigH = h;
		patchHTML(el, h);
	}
	chip.classList.toggle('warn', !!G.incoming); // the red War button breathes while something is coming
	const mb = el.querySelector('.midb.map');
	if (mb && mini.parentNode !== mb) mb.appendChild(mini); // the small map's one home is the station's middle (Albert, Nov 2); it waits on the stage, hidden, between
	else if (!mb && mini.parentNode !== $('stage')) $('stage').appendChild(mini);
	if (chip.pg !== page) {
		chip.pg = page;
		$('orders').className = 'pg-' + page;
		chip.innerHTML = page === 'war' ? ICON.close : topOf(ICON.def) + wd(ROW_WORD.emg); // War, the one button that turns the row; while the station is up it reads ✕ (Albert, Nov 2)
		chip.classList.toggle('sym', page === 'war');
		chip.setAttribute('aria-label', page === 'war' ? 'Close the battle station' : 'War: the battle station');
		fit(); // the row is drawn anew: the map's bottom edge is measured again
	}
}
// the reticle (mock 24): brackets, three turning chevrons, a scan line, a sonar ring and short scope lines; its colour says what is under it; green once fired
function drawReticle() {
	const K = G.strike && G.strike.stage === 2 ? G.strike : null, // the strike's second stage is this same reticle (Albert, Nov 2)
		H = K ? { h: { t: 'ground', e: K }, aimT: K.t0, drag: false } : G.hud;
	if (!K && (!H.aim || !H.h)) return;
	const x = SX(H.h.e.x),
		y = SY(H.h.e.y),
		L = performance.now() - (H.firedT || -1e9) < timeOf('settle') ? 1 : 0,
		R = Math.max(30, 16 * cam.z + 6) * (L ? 0.8 : 1),
		t = still() ? 0 : (performance.now() - (H.aimT || 0)) / 1000,
		eta = K ? K.eta : hudEta(),
		line = (a, b, c, d) => (ctx.moveTo(x + a, y + b), ctx.lineTo(x + c, y + d));
	ctx.save();
	ctx.strokeStyle = ctx.fillStyle = L ? codeOf('g') : aimColor(H.h);
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
	ctx.font = mapFont(); // pinned to the screen
	ctx.textAlign = 'center';
	ctx.fillText(eta ? `${clock(eta)} · ${coord(H.h.e.x, H.h.e.y)}` : coord(H.h.e.x, H.h.e.y), x, y - R - 8);
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
