// ═════ 39-huddle.js: the huddle: four missions you plan, fire, watch and call off, over the same bar the jobs use ═════
// The sword button swaps the job bar for the attack bar. Column 1: Ready over Aim, each with a light (red: not set, green: set).
// Columns 2-5: while drafting, how many Foot, Archers, Horse and Siege go (the idle ones); while viewing, the four missions (Alpha to Delta).
// Column 6: Fire over Abort. A mission is a march order (G.ords) with a slot (G.msn) that keeps its promise: when it should arrive, how the fight goes, how it ended.
const MSN = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
const CLS = [
	['foot', 'Foot', 'barracks', 'foot'],
	['arch', 'Arch', 'range', 'archers'],
	['horse', 'Horse', 'stable', 'riders'],
	['siege', 'Siege', 'siege', 'siege'],
];
const HUD = {
	near: 140, // a fight is what hostile soldiers within this reach of the group make
	lose: 0.4, // a tile flashes red below this chance, and stops above clear
	clear: 0.5,
	win: 0.75, // green above this: the extra soldiers can be spared
	keep: 0.65, // sparing never takes the chance below this
	smooth: 0.3, // the chance moves a third of the way each second: about three seconds to settle
	gap: 8, // reinforcements arriving within this many seconds of each other are one wave
	waves: 3,
};
const clsOf = (u) => CLS.findIndex((c) => c[2] === UNIT[u.kind].at);
const mUnits = (m) => G.units.filter((u) => u.owner === 0 && u.ord === m.ord && u.hp > 0);
const hostile = (v) =>
	v.owner !== 0 &&
	v.hp > 0 &&
	!v.inside &&
	atWar(0, v.owner) &&
	(isSoldier(v) || (v.owner === WILD && UNIT[v.kind].tick === 'wild'));
function foesNear(c) {
	const out = [];
	unitsNear(c, HUD.near, (v) => hostile(v) && out.push(v));
	return out;
}
const powerSum = (L) => L.reduce((s, u) => s + unitPower(u), 0);
// the chance to win: the engine every odds line uses (power against power, the matchup of arms), as r²/(1+r²)
function chance(S, foes) {
	const r = (powerSum(S) / Math.max(1, powerSum(foes))) * matchup(S, foes);
	return (r * r) / (1 + r * r);
}
const dpsOf = (L) => L.reduce((s, v) => s + dmgOf(v) / (UNIT[v.kind].cd || 1.5), 0);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const wxWord = () => (G.wx !== 'clear' && WEATHER[G.wx] ? WEATHER[G.wx].name : season().name);

// ── the draft: who goes, and where
const hudPool = () =>
	(G.hud.pre ? G.hud.pre.map((id) => G.units.find((u) => u.id === id)).filter((u) => u && u.hp > 0) : free()).filter(
		(u) => clsOf(u) >= 0,
	);
const hudHave = (pool, c) => pool.filter((u) => clsOf(u) === c).length;
// a draft holds a battalion at most (BNSIZE): the classes fill it in their order, each from what is left
const hudN = (pool, c) => {
	let room = BNSIZE;
	for (let i = 0; i < c; i++) room -= Math.min(hudHave(pool, i), G.hud.n[i] ?? 1e9, room);
	return Math.min(hudHave(pool, c), G.hud.n[c] ?? 1e9, room);
};
const hudRoom = (pool) => CLS.reduce((r, _, i) => r - hudN(pool, i), BNSIZE);
function hudPick() {
	const pool = hudPool(),
		to = G.hud.h && G.hud.h.e;
	return CLS.flatMap((_, c) => {
		const a = pool.filter((u) => clsOf(u) === c);
		if (to) a.sort((p, q) => dist(p, to) - dist(q, to));
		return a.slice(0, hudN(pool, c));
	});
}
const hudSlot = () => G.hud.slot ?? G.msn.findIndex((m) => !m);
// the time the draft would take to arrive, worked out again when the target, the numbers or (every few seconds) the weather change
function hudEta() {
	const H = G.hud,
		S = hudPick();
	if (!H.h || !S.length) return 0;
	const key = `${H.h.e.x | 0},${H.h.e.y | 0},${S.length},${G.wx},${(G.t / 3) | 0}`;
	if (H.etaKey !== key) {
		H.etaKey = key;
		H.eta = etaOf(S, H.h.e, routeK(centreOf(S), H.h.e));
	}
	return H.eta;
}
// The steps of one plan, one button at a time (red: next and blinking, blue: in hand, green: done):
// 0 Ready, 1 Armed (Aim next), 2 aiming (the crosshair is up), 3 aiming with a tap made (Lock), 4 Locked (set the counts, Set next), 5 Set (Fire next)
const hudStage = () => {
	const H = G.hud;
	return !H.armed ? 0 : H.set ? 5 : H.locked ? 4 : H.aim ? (H.moved ? 3 : 2) : 1;
};
function hudReset() {
	const H = G.hud;
	H.armed = H.aim = H.moved = H.locked = H.set = false;
	H.h = H.pre = H.slot = null;
	H.n = {};
}
// Ready arms the plan; tapped again, Armed puts it down
function hudReady() {
	const H = G.hud;
	H.carry = null;
	if (H.armed) {
		hudReset();
		H.view = G.msn.some(Boolean);
	} else {
		H.armed = true;
		H.view = false;
	}
}
// Aim shows the crosshair at the middle of the view (a tap on the map moves it); Lock sets it; Locked opens it again
function hudAim() {
	const H = G.hud;
	if (!H.armed) return;
	if (H.aim) return hudLock();
	H.aim = true;
	H.aimT = performance.now();
	H.moved = H.locked = H.set = false;
	if (!H.h) H.h = { t: 'ground', e: { x: cam.x, y: cam.y } };
	H.etaKey = '';
}
function hudLock() {
	const H = G.hud;
	H.aim = false;
	H.locked = true;
	feel('snap');
}
function hudSet() {
	if (hudStage() === 4 && hudPick().length) {
		G.hud.set = true;
		feel('tick');
	}
}
// the spot under a finger while aiming: a mission goes to the ground, a find or a foe
function aimSpot(sx, sy) {
	const H = G.hud;
	let h = hitAt(sx, sy);
	const foe = (h.t === 'unit' || h.t === 'bld') && h.e.owner !== 0;
	if (!(h.t === 'ground' || h.t === 'find' || foe)) h = { t: 'ground', e: { x: h.e.x, y: h.e.y } };
	H.h = h;
	H.moved = true;
	H.etaKey = '';
}
// hold the crosshair and drag it
const aimNear = (sx, sy) => {
	const H = G.hud;
	return H.aim && H.h && hyp(sx - SX(H.h.e.x), sy - SY(H.h.e.y)) < 56;
};
// a tap on the map while aiming moves the crosshair; two quick taps in one place lock it
function aimAt(sx, sy) {
	const H = G.hud,
		now = performance.now();
	aimSpot(sx, sy);
	ripple(H.h.e.x, H.h.e.y, '#ffb23d');
	feel('tick');
	if (H.tapAt && now - H.tapAt.t < 350 && hyp(sx - H.tapAt.x, sy - H.tapAt.y) < 28) hudLock();
	H.tapAt = { t: now, x: sx, y: sy };
}
function hudOpen(on) {
	const H = G.hud;
	H.on = on;
	hudReset();
	H.view = false;
	H.carry = H.sel = null;
	if (on) closeCard();
}
// Fire: the draft marches as one order and takes the slot
function hudFire() {
	const H = G.hud,
		slot = hudSlot(),
		S = hudPick();
	if (slot < 0 || G.msn[slot]) return say('All four missions are out.', '', 3);
	if (!H.h || !S.length) return;
	const before = G.ordN || 0;
	order(S, H.h);
	if ((G.ordN || 0) === before) return; // refused: the reason was said
	const O = G.ords[G.ordN];
	G.msn[slot] = {
		name: MSN[slot],
		ord: G.ordN,
		n0: S.length,
		what: H.h.t === 'unit' || (H.h.t === 'bld' && H.h.e.owner !== 0) ? 'Attack' : 'Go to',
		label: O.label,
		x: O.x,
		y: O.y,
		t: G.t,
		due: G.t + etaOf(S, O, O.k),
		st: 'go',
		odds: 0.5,
	};
	hudReset();
	H.view = true;
	H.sel = slot;
	H.firedT = performance.now();
	feel('thock');
}
// a mission leaves: the soldiers go home, the slot is free
function hudAbort(slot) {
	const m = G.msn[slot];
	if (!m) return;
	sendHome(mUnits(m));
	G.msn[slot] = null;
	if (G.hud.sel === slot) G.hud.sel = null;
	if (G.card && G.card.type === 'mission') closeCard();
	say(`${m.name} called home.`, '', 3);
}
function hudAbortAll() {
	G.msn.forEach((_, i) => hudAbort(i));
}
// the draft's Abort: clears the draft, or (viewing) the picked mission
function hudCancel() {
	const H = G.hud;
	if (H.view && H.sel !== null && G.msn[H.sel]) hudAbort(H.sel);
	else {
		hudReset();
		H.view = G.msn.some(Boolean);
	}
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
		m.spare = [];
		if (m.odds > HUD.win) {
			m.flash = 'win';
			let rest = S.slice();
			for (const u of S.slice().sort((p, q) => unitPower(p) - unitPower(q))) {
				const next = rest.filter((v) => v !== u);
				if (!next.length || chance(next, foes) < HUD.keep) break;
				rest = next;
				m.spare.push(u.id);
			}
		} else if (m.flash === 'win') m.flash = null;
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
// units moved into a mission (a reinforcement, a spare soldier from another): they march to its middle and join its order
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
const spareOf = (m) => (m.spare || []).map((id) => G.units.find((u) => u.id === id)).filter((u) => u && u.hp > 0);
// spare soldiers go: to another mission (reinforce), an empty slot (a new draft of just them), or Ready (home)
function hudDrop(from, to) {
	const m = G.msn[from],
		S = m ? spareOf(m) : [];
	G.hud.carry = null;
	if (!S.length) return;
	if (to === 'home') {
		sendHome(S);
		say(`${S.length} home from ${m.name}.`, '', 3);
	} else if (G.msn[to] && to !== from) {
		hudJoin(S, G.msn[to]);
		say(`${S.length} from ${m.name} to ${G.msn[to].name}.`, 'good', 3);
	} else if (!G.msn[to]) {
		const H = G.hud;
		H.pre = S.map((u) => u.id);
		H.n = {};
		H.h = null;
		H.slot = to;
		H.armed = true;
		H.view = false;
		hudAim();
		say(`Tap where ${MSN[to]} goes.`, '', 3);
	}
	m.spare = [];
	m.flash = null;
}
function hudTile(slot) {
	const m = G.msn[slot];
	if (G.hud.carry !== null && G.hud.carry !== undefined) return hudDrop(G.hud.carry, slot);
	if (m) openCard({ type: 'mission', slot });
	G.hud.sel = m ? slot : null;
}

// ── the bar
const odds2 = (p) => `hsl(${Math.round(Math.max(0, Math.min(1, p)) * 120)} 75% 58%)`;
function mStatus(m) {
	if (m.st === 'go') return [mmss(m.eta || 0), '#7db4ff'];
	if (m.st === 'act') return ['ACTIVE', odds2(m.odds)];
	if (m.st === 'lost') return ['LOST', '#ff6a5a'];
	return [m.late ? `LATE +${m.late}s` : '✓ DONE', m.late ? '#ffd35e' : '#5fd08a'];
}
function huddleHTML() {
	const H = G.hud,
		stage = hudStage(),
		pool = hudPool(),
		lamp = (c, blink) => ` bar lamp-${c}${blink ? ' blink' : ''}`,
		st = (act, t, cls, extra = '') => `<button class="cell st w ${cls || ''}" data-act="${act}"${extra}>${t}</button>`,
		draft = !H.view,
		fired = performance.now() - (H.firedT || -1e9) < 1500,
		ready = H.armed
			? `<button class="cell${lamp('green')}" data-act="hready" aria-label="Armed: put the plan down"><span class="wd mid">Armed</span></button>`
			: `<button class="cell${lamp('red', 1)}" data-act="hready" aria-label="Ready"><span class="wd mid">Ready</span></button>`,
		aim = [
			st('haim', 'Aim', 'dis'),
			st('haim', 'Aim', lamp('red', 1)),
			st('haim', 'Aim', lamp('blue')),
			st('haim', 'Lock', lamp('blue')),
			st('haim', 'Locked', lamp('green')),
			st('haim', 'Locked', lamp('green')),
		][stage],
		counts = stage < 4 ? ' dis' : stage === 4 ? lamp('blue') : lamp('green'),
		mid = (draft ? CLS : MSN)
			.map((x, i) => {
				if (draft) {
					return `<div class="col"><button class="cell${counts}" data-act="hudc:${i}"><span class="top"><span class="c">${hudN(pool, i)}</span></span>${wd(x[1])}</button><div class="pm">${st(`hudn:${i},-`, '−')}${st(`hudn:${i},+`, '+')}</div></div>`;
				}
				const m = G.msn[i];
				if (!m)
					return `<div class="col"><button class="cell msn empty" data-slot="${i}" data-act="hslot:${i}"><span class="wd mid">${x}</span></button>${st(`hslot:${i}`, '', 'msn empty', ` data-slot="${i}"`)}</div>`;
				const [t, color] = mStatus(m),
					n = mUnits(m).length,
					fl = m.flash ? ' ' + m.flash : '';
				return `<div class="col"><button class="cell msn${fl}${H.sel === i ? ' sel' : ''}" data-slot="${i}" data-act="mcard:${i}" style="--mc:${color}"><span class="top"><span class="c">${n}</span></span>${wd(m.name)}</button><button class="cell st w msn${fl}" data-slot="${i}" data-act="mcard:${i}" style="color:${color}">${t}</button></div>`;
			})
			.join(''),
		set = `<button class="cell${stage === 4 && hudPick().length ? lamp('red', 1) : stage > 4 ? lamp('green') : ' dis'}" data-act="hset" aria-label="Set the counts"><span class="wd mid">Set</span></button>`,
		last = !draft
			? st('habort', 'Abort')
			: stage === 5
				? `<button class="cell${lamp('red', 1)}" data-act="hfire" aria-label="Fire"><span class="wd mid">Fire</span></button>`
				: `<button class="cell${fired ? lamp('green') : ' dis'}" data-act="hfire" aria-label="Fire"><span class="wd mid">Fire</span></button>`;
	return `<div class="col">${ready}${aim}</div>${mid}<div class="col">${set}${last}</div>`;
}
function huddleUI() {
	const H = G.hud,
		el = $('huddle'),
		flip = el.hidden === H.on;
	if (flip) {
		el.hidden = !H.on;
		$('jobs').hidden = H.on;
		$('orders').classList.toggle('hud', H.on);
		$('hudB').classList.toggle('sel', H.on);
		$('hudB').innerHTML = H.on ? ICON.close : ICON.sword;
		$('hudB').setAttribute('aria-label', H.on ? 'Leave the huddle' : 'Huddle: plan an attack');
	}
	if (H.on) {
		const h = huddleHTML();
		if (el.sigH !== h) {
			el.sigH = h;
			el.innerHTML = h;
		}
	}
	$('emgB').classList.toggle('on', !!G.emg);
	if (flip) fit(); // the bar is whole again: the corner buttons sit on top of it
}
// the reticle (mock 24): brackets, three turning chevrons, a scan line, a sonar ring and short scope lines; amber while aiming, green once locked
function drawReticle() {
	const H = G.hud;
	if (!H.on || !H.h) return;
	const x = SX(H.h.e.x),
		y = SY(H.h.e.y),
		L = H.aim ? 0 : 1,
		R = Math.max(30, 16 * cam.z + 6) * (H.aim ? 1 : 0.8),
		t = lessMotion ? 0 : (performance.now() - (H.aimT || 0)) / 1000,
		eta = hudEta(),
		line = (a, b, c, d) => (ctx.moveTo(x + a, y + b), ctx.lineTo(x + c, y + d));
	ctx.save();
	ctx.strokeStyle = ctx.fillStyle = L ? '#4fe0a0' : '#ffb23d';
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
	if (H.aim) ctx.fillText(H.moved ? 'Hold and drag, or tap' : 'Tap the map to move it', x, y + R + 30);
	ctx.fillText(eta ? `${mmss(eta)} · ${coord(H.h.e.x, H.h.e.y)}` : coord(H.h.e.x, H.h.e.y), x, y - R - 8);
	ctx.restore();
}
// the details card for one mission: who, what, where, when, status, and what you can do
CARDS.mission = (c) => {
	const m = G.msn[c.slot];
	if (!m) return null;
	const S = mUnits(m),
		cls = CLS.map((k, i) => [k[1], S.filter((u) => clsOf(u) === i).length])
			.filter((r) => r[1])
			.map((r) => `${r[1]} ${r[0]}`)
			.join(', '),
		[word] = mStatus(m),
		plan = m.st === 'act' ? reinforcePlan(m) : null,
		spare = spareOf(m),
		slow = sideSpd(0),
		row = (k, v) => `<p><b>${k}</b> ${v}</p>`;
	return (
		title(m.name, m.st === 'act' ? `${Math.round(m.odds * 100)}%` : word) +
		row('Who', `${S.length} of ${m.n0}${cls ? ' · ' + cls : ''}`) +
		row('What', `${m.what} ${m.label}`) +
		`<p data-act="jump:${m.x},${m.y}"><b>Where</b> ${coord(m.x, m.y)} · tap to go</p>` +
		row('When', m.st === 'go' ? `Due in ${mmss(m.eta || 0)}` : m.late ? `${m.late} s late` : 'On time') +
		row('Status', m.st === 'act' ? `Active · ${Math.round(m.odds * 100)}% to win` : word) +
		(slow < 0.98
			? row(G.wx !== 'clear' ? 'Weather' : 'Season', `${wxWord()}, walking ×${slow.toFixed(2)}, included`)
			: '') +
		(m.st === 'act' || spare.length
			? acts(
					(m.st === 'act'
						? btn(
								`hudrein:${c.slot}`,
								plan && plan.go.length ? `Reinforce +${plan.go.length}` : 'Reinforce',
								plan && plan.go.length
									? waveLine(plan)
									: plan && plan.even
										? 'Already even'
										: plan && plan.late
											? 'Too late'
											: 'No reserve',
								plan && plan.go.length ? 'go' : 'dis',
							)
						: '') + (spare.length ? btn(`hspare:${c.slot}`, `Spare ${spare.length}`, 'then tap a tile', 'go') : ''),
				)
			: '') +
		acts(btn(`hdel:${c.slot}`, 'Abort', 'soldiers go home', 'warn') + btn('habortall', 'Abort all', '', 'warn'))
	);
};
// drag a green tile's spare soldiers: onto a mission, an empty slot, or Ready
function hudDrag(ev) {
	const t = ev.target.closest && ev.target.closest('#huddle [data-slot]'),
		m = t && G.msn[t.dataset.slot];
	if (!m || !m.spare || !m.spare.length) return;
	const from = Number(t.dataset.slot),
		x0 = ev.clientX,
		y0 = ev.clientY;
	let ghost = null;
	const move = (e) => {
			if (!ghost && Math.hypot(e.clientX - x0, e.clientY - y0) > 10) {
				ghost = document.createElement('div');
				ghost.className = 'hudGhost';
				ghost.textContent = `Spare ${m.spare.length}`;
				document.body.appendChild(ghost);
			}
			if (ghost) ghost.style.transform = `translate(${e.clientX - 40}px,${e.clientY - 60}px)`;
		},
		end = (e) => {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', end);
			window.removeEventListener('pointercancel', end);
			if (!ghost) return;
			ghost.remove();
			G.hud.dragged = performance.now();
			const d = document.elementFromPoint(e.clientX, e.clientY),
				slot = d && d.closest('[data-slot]'),
				ready = d && d.closest('[data-act="hready"]');
			if (ready) hudDrop(from, 'home');
			else if (slot) hudDrop(from, Number(slot.dataset.slot));
			refresh();
		};
	window.addEventListener('pointermove', move);
	window.addEventListener('pointerup', end);
	window.addEventListener('pointercancel', end);
}
document.addEventListener('pointerdown', hudDrag);
