// ═════ 28-army-quick.js: the army: who can be sent, how many, and the sends; the quick action ═════
// ── Attack with: on an enemy or a find card, from the whole army or one battalion, how many of each type, then go. The nearest of each type go.
const qsPool = () =>
	armyFree(0, 'spy', 'shrine').filter((u) => G.qs.from === 'all' || u.bn === G.qs.from);
function qsPick(to) {
	const by = {};
	for (const u of qsPool()) (by[u.kind] = by[u.kind] || []).push(u);
	const out = [],
		key = (u) => (idleSoldier(u) ? 0 : 1e6) + dist(u, to); // idle soldiers first, then the nearest busy ones
	for (const k in by) {
		by[k].sort((a, b) => key(a) - key(b));
		out.push(...by[k].slice(0, Math.min(by[k].length, G.qs.n[k] ?? by[k].length)));
	}
	return out;
}
function qsHTML(verb, label, to) {
	if (!hasCmd()) G.qs.from = 'all';
	let h = hasCmd()
		? list(
				[['all', 'All'], ...BN.map((n, i) => [i, n])].map(([k, n]) =>
					btn(
						`qsfrom:${k}`,
						n,
						String(armyOf(0).filter((u) => u.kind !== 'spy' && (k === 'all' || u.bn === k)).length),
						G.qs.from === k ? 'on' : '',
					),
				),
			)
		: '';
	const by = {};
	for (const u of qsPool()) by[u.kind] = (by[u.kind] || 0) + 1;
	if (!Object.keys(by).length)
		return verb.startsWith('qgo')
			? h // a find with no soldiers to send: nothing to say
			: h +
					`<p>No soldiers${G.qs.from === 'all' ? ' yet: train them at a Barracks, Range or Stable' : ' in ' + BN[G.qs.from]}.</p>`;
	h += Object.entries(by)
		.map(
			([k, have]) =>
				`<div class="qs"><b>${stats(0, k).name}</b>${btn(`qsn:${k},-`, '−')}<span>${Math.min(have, G.qs.n[k] ?? have)} of ${have}</span>${btn(`qsn:${k},+`, '+')}</div>`,
		)
		.join('');
	const S = qsPick(to),
		foe = to.owner !== undefined && to.owner !== 0 && to.owner !== WILD ? to.owner : null;
	return (
		h +
		acts(
			btn(
				verb,
				`${label} ${S.length}`,
				foe !== null ? oddsText(S, foe) : '',
				S.length ? (foe !== null ? 'warn' : 'go') : 'dis',
			),
			'c1',
		)
	);
}
// ── who can be sent
const sendable = () => armyFree(0, 'spy', 'shrine', 'escort', 'school'); // guards keep to what they guard
// What each soldier is doing, in one word (Albert, Build 42), worked out from the soldier alone:
// rally (just trained or called home, walking to its place), march (on your order), fight, hold (stopped: at its place or at the spot you sent it), rout (nerve broke, running).
// 'other' is a guard, a priest at a shrine, a student, a spy. A soldier that has not moved for two and a half seconds is holding, even if it never got there.
const ARMY_STILL = 2.5;
function armyStatus(u) {
	if (u.state === 'rout') return 'rout';
	if (u.state === 'garrison') return 'hold'; // defending inside a building
	if (u.tgt && u.tgt.hp > 0) return 'fight';
	if (u.state === 'attack') return 'march';
	if (u.state === 'goto') {
		if (u.idleT > 1 || G.t - (u.mvT ?? -9) > ARMY_STILL) return 'hold';
		return !u.ord && G.rally0 && hyp(u.px - G.rally0.x, u.py - G.rally0.y) < 4 ? 'rally' : 'march'; // a new soldier walking to your rally flag is rallying
	}
	if (u.state === 'home') return u.hax !== undefined && hyp(u.x - u.hax, u.y - u.hay) > 14 ? 'rally' : 'hold';
	return 'other';
}
const idleSoldier = (u) => {
	const s = armyStatus(u);
	return s === 'hold' || s === 'rally';
};
// Rest: idle soldiers only, so a group on the march is never pulled off its way. All is everyone but guards (Build 44)
const free = () => sendable().filter(idleSoldier);
// why nobody can be sent: nobody exists, or who is busy doing what
function freeWhy() {
	if (!sendable().length) return 'No soldiers yet. Train some.';
	const c = { march: 0, fight: 0, rout: 0 };
	for (const u of sendable()) if (c[armyStatus(u)] !== undefined) c[armyStatus(u)]++;
	const parts = [
		c.march && `${c.march} marching`,
		c.fight && `${c.fight} fighting`,
		c.rout && `${c.rout} routed`,
	].filter(Boolean);
	return `None idle: ${parts.slice(0, 2).join(', ') || 'all are guarding'}.`;
}
const guardsOf = (t, id) =>
	armyOf(0).filter((u) => u.state === 'escort' && (t === 'f' ? u.escF === id : u.escId === id)); // up to 12 soldiers escort one caravan or garrison one trade stop
function guardRow(t, id) {
	const n = guardsOf(t, id).length,
		free = sendable().length,
		verb = t === 'f' ? 'Garrison' : 'Escort';
	return acts(
		btn(
			`guard:${t},${id}`,
			`${verb} +4`,
			n >= POST.guard ? `full: ${n}/${POST.guard}` : free ? `${n}/${POST.guard} · ${free} free` : 'no free soldiers',
			n < POST.guard && free ? '' : 'dis',
		) + btn(`unguard:${t},${id}`, 'Release', n ? `${n} go home` : 'none here', n ? '' : 'dis'),
	);
}
// an enemy the finger can send soldiers at: a beast that is not game (game is hunted from the bar) always; anyone else, the Natives and
// their Throne too, while you are at war
const foeOf = (e) =>
	e.owner !== 0 && e.hp > 0 && (e.owner === WILD && !e.q && !e.native ? !UNIT[e.kind].meat : atWar(0, e.owner));
// ── The hold (MENU-SPEC §7, Albert Nov 2, 15:35): hold the ground or an enemy and a point under the finger grows into a ring, white to
// red, "Hold to launch attack" over it; at full every soldier goes there and the ring snaps out. Lift or drag first and nothing is sent (a
// drag is the box, 26-input). A plain tap on the ground shows the words a moment, which teaches it. G.launch: what is held (h, as hitAt gives
// it), when it started, when it fired; G.hint: the words a tap left.
let launchT = 0;
function launchAt(h) {
	cancelLaunch();
	if (!sendable().length) return hintAt(h, HOLD_WORD.none), false;
	G.hint = null;
	G.launch = { h, t0: performance.now() };
	launchT = setTimeout(fireLaunch, LAUNCH.ms);
	feel('tick');
	return true;
}
function cancelLaunch() {
	clearTimeout(launchT);
	if (G.launch && !G.launch.fired) G.launch = null;
}
function fireLaunch() {
	const C = G.launch;
	if (!C || C.fired) return;
	clearTimeout(launchT);
	const S = sendable();
	if (S.length) order(S, C.h);
	else say(freeWhy(), '', TOAST.mid);
	C.fired = performance.now();
	feel('snap');
}
const hintAt = (h, w = HOLD_WORD.attack) => (G.hint = { h, w, t: performance.now() });
// the ring and the words, on the map, over the spot (the canvas, each frame; 21-view-frame)
function drawLaunch() {
	const now = performance.now(),
		C = G.launch,
		I = G.hint,
		word = (x, y, w, a) => {
			ctx.globalAlpha = a;
			ctx.strokeStyle = 'rgba(0,0,0,.75)';
			ctx.lineWidth = 3;
			ctx.strokeText(w, x, y);
			ctx.fillStyle = codeOf('w');
			ctx.fillText(w, x, y);
		};
	if (I && now - I.t > timeOf('settle')) G.hint = null;
	if (!C && !G.hint) return;
	ctx.save();
	ctx.font = mapFont();
	ctx.textAlign = 'center';
	ctx.lineJoin = 'round';
	if (G.hint) word(SX(I.h.e.x), SY(I.h.e.y) - LAUNCH.r - 14, I.w, 1 - (now - I.t) / timeOf('settle'));
	if (C) {
		const x = SX(C.h.e.x),
			y = SY(C.h.e.y),
			f = C.fired ? 1 : clamp((now - C.t0) / LAUNCH.ms, 0, 1),
			out = C.fired ? clamp((now - C.fired) / timeOf('quick'), 0, 1) : 0, // at full it snaps out: a little wider, gone
			r = (4 + (LAUNCH.r - 4) * f) * (1 + 0.4 * out),
			col = grad(-f); // white to red, the one gradient
		if (out >= 1) G.launch = null;
		else {
			ctx.shadowColor = 'rgba(0,0,0,.85)';
			ctx.shadowBlur = 3;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 7);
			ctx.globalAlpha = (1 - out) * 0.1 * f;
			ctx.fillStyle = col;
			ctx.fill();
			ctx.globalAlpha = 1 - out;
			ctx.strokeStyle = col;
			ctx.lineWidth = 1.6 + 1.2 * f;
			ctx.stroke();
			ctx.shadowBlur = 0;
			if (!C.fired) word(x, y - LAUNCH.r - 14, HOLD_WORD.attack, 1);
		}
	}
	ctx.restore();
}
// what the game thinks fits a spot (Albert, Build 41): each reason scores a kind, the best one is marked and its menu opens.
// A drop-off for what grows there with none near; more of what stands around you (houses: a house; fields: a mill, then a field; army buildings: the one you lack);
// a narrow way between forest, water or buildings: a wall, or a gate beside your wall; and a house when room is short.
const SUGGEST = { r: 140, drop: 3, kin: 3.5, choke: [0.35, 0.75], chokeW: 4, room: 2 };
function suggestAt(x, y) {
	const p = G.P[0],
		sc = {},
		add = (k, v) => {
			if (k && BLD[k] && BLD[k].age <= p.age && !capWhy(0, k)) sc[k] = (sc[k] || 0) + v;
		};
	{
		const drops = new Set();
		for (const nd of G.nodes)
			if (nd.amt > 0 && !nd.farm && hyp(nd.x - x, nd.y - y) < SUGGEST.r * 0.85) {
				const k = nd.kind === 'fish' ? 'dock' : nd.type === 'wood' ? 'lumber' : nd.type === 'food' ? 'mill' : 'mining',
					d = dropFor(0, nd.type, nd);
				if (!d || dist(d, nd) > 110) drops.add(k);
			}
		for (const k of drops) add(k, SUGGEST.drop);
	} // each drop-off it lacks counts once
	const near = G.blds.filter((b) => b.owner === 0 && b.hp > 0 && hyp(b.x - x, b.y - y) < SUGGEST.r),
		has = (k) => near.some((b) => b.kind === k);
	for (const b of near) {
		const m = MENUS.find((M) => M.items.includes(b.kind));
		if (!m) continue;
		if (m.id === 'home') add(b.kind === 'apartment' ? 'apartment' : 'house', SUGGEST.kin);
		else if (b.kind === 'farm' || b.kind === 'pasture') add(has('mill') ? 'farm' : 'mill', SUGGEST.kin);
		else if (m.id === 'mil')
			add(m.items.find((k) => !bldsOf(0, k).length && BLD[k].age <= p.age) || b.kind, SUGGEST.kin);
		else if (b.kind === 'wall') add('gate', SUGGEST.kin);
		else add(b.kind === 'keep' ? 'house' : null, 1);
	}
	{
		const cx = Math.floor(x / NAVC),
			cy = Math.floor(y / NAVC);
		let solid = 0,
			n = 0;
		for (let j = -4; j <= 4; j++)
			for (let i = -4; i <= 4; i++) {
				const gx = cx + i,
					gy = cy + j;
				if (gx < 0 || gy < 0 || gx >= NC || gy >= NC || i * i + j * j > 16) continue;
				n++;
				if (NAV.solid[gy * NC + gx]) solid++;
			}
		const f = solid / (n || 1);
		if (f > SUGGEST.choke[0] && f < SUGGEST.choke[1] && !NAV.solid[cy * NC + cx])
			add(has('wall') ? 'gate' : 'wall', SUGGEST.chokeW);
	}
	if (capOf(0) - popOf(0) - queuedOf(0) <= SUGGEST.room) add('house', 1.5);
	const best = Object.entries(sc).sort((a, b) => b[1] - a[1])[0];
	return best ? best[0] : null;
}
// The two dials of an army or one battalion (a: 'all' or its number): temper, and shape once Formations is researched. One button each, a tap steps round; a gold ring marks what is not the plain setting.
const dialBtns = (a) => {
	const tm = dialOf('temper', a),
		sh = dialOf('form', a);
	return [
		btn(`temper:${a}`, 'Temper: ' + (tm < 0 ? 'mixed' : TEMPER[tm].name), '', tm >= 0 && tm !== T_GUARD ? 'on' : ''),
		G.P[0].techs.has('formations') ? btn(`shape:${a}`, 'Shape: ' + (sh < 0 ? 'mixed' : FORM[sh].name), '', sh > 0 ? 'on' : '') : '',
	].filter(Boolean); // the cells, for a list: one is the whole rank
};
// ── Muster for a squad: what it still lacks, by soldier kind to train
function musterGap(i) {
	// its plan by kind (Foot, Archers, Riders, Siege), less the members it has and the soldiers already mustering for it, trained as each
	// kind's soldier of this age (kindOf, 39-huddle)
	const gap = { ...G.bnPlan[i] },
		less = (k, n) => {
			const c = CLS[clsOf(k)];
			if (c && gap[c[0]]) gap[c[0]] -= n;
		};
	for (const u of armyOf(0)) if (u.bn === i) less(u.kind, 1);
	for (const b of G.blds)
		if (b.owner === 0) for (const j of b.q) if (j.muster && j.bn === i) for (const k in j.muster) less(k, j.muster[k]);
	const out = {};
	CLS.forEach((c, t) => {
		const k = kindOf(t);
		if (gap[c[0]] > 0 && k) out[k] = gap[c[0]];
	});
	return out;
}
