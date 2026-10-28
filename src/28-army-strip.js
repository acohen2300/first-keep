// ═════ 28-army-strip.js: the army strip: who can be sent, how many, and the sends ═════
// ── Attack with: on an enemy or a find card, from the whole army or one battalion, how many of each type, then go. The nearest of each type go.
const qsPool = () =>
	armyOf(0).filter((u) => u.kind !== 'spy' && u.state !== 'shrine' && (G.qs.from === 'all' || u.bn === G.qs.from));
function qsPick(to) {
	const by = {};
	for (const u of qsPool()) (by[u.kind] = by[u.kind] || []).push(u);
	const out = [];
	for (const k in by) {
		by[k].sort((a, b) => dist(a, to) - dist(b, to));
		out.push(...by[k].slice(0, Math.min(by[k].length, G.qs.n[k] ?? by[k].length)));
	}
	return out;
}
function qsHTML(verb, label, to) {
	if (!hasCmd()) G.qs.from = 'all';
	let h = hasCmd()
		? acts(
				[['all', 'All'], ...BN.map((n, i) => [i, n])]
					.map(([k, n]) =>
						btn(
							`qsfrom:${k}`,
							n,
							String(armyOf(0).filter((u) => u.kind !== 'spy' && (k === 'all' || u.bn === k)).length),
							G.qs.from === k ? 'on' : '',
						),
					)
					.join(''),
				'c4',
			)
		: '';
	const by = {};
	for (const u of qsPool()) by[u.kind] = (by[u.kind] || 0) + 1;
	if (!Object.keys(by).length)
		return (
			h +
			`<p>No soldiers${G.qs.from === 'all' ? ' yet: train them at a Barracks, Range or Stable' : ' in ' + BN[G.qs.from]}.</p>`
		);
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
// ── The send strip: tap open ground and a small row of choices sits at your finger: a quarter, all, a battalion, more, cancel.
// A quarter takes a quarter of each type, nearest first, so the mix of the army goes along.
const sendable = () => armyOf(0).filter((u) => u.kind !== 'spy' && u.state !== 'shrine' && u.state !== 'escort'); // guards keep to what they guard
// What each soldier is doing, in one word (Albert, Build 42), worked out from the soldier alone:
// rally (just trained or called home, walking to its place), march (on your order), fight, hold (stopped: at its place or at the spot you sent it), rout (nerve broke, running).
// 'other' is a guard, a priest at a shrine, a student, a spy. A soldier that has not moved for two and a half seconds is holding, even if it never got there.
const ARMY_STILL = 2.5;
function armyStatus(u) {
	if (u.state === 'rout') return 'rout';
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
// All, a half, a quarter, the nearest five, ten, twenty: idle soldiers only, so a group on the march is never pulled off its way (Build 38; Build 42: counted soldier by soldier)
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
function sendPick(from, to) {
	// 'q' a quarter of each type, 'all', 'n8' the nearest eight, or a battalion by its number
	if (from === 'h') {
		const A = free(),
			by = {};
		for (const u of A) (by[u.kind] = by[u.kind] || []).push(u);
		const out = [];
		for (const k in by)
			out.push(...by[k].sort((p, q) => dist(p, to) - dist(q, to)).slice(0, Math.ceil(by[k].length / 2)));
		return out;
	} // half of each type, nearest first
	if (typeof from === 'string' && from[0] === 'n')
		return free()
			.sort((p, q) => dist(p, to) - dist(q, to))
			.slice(0, Number(from.slice(1)));
	const A = typeof from === 'number' ? sendable() : free(),
		by = {};
	for (const u of A) if (from === 'q' || from === 'all' || u.bn === from) (by[u.kind] = by[u.kind] || []).push(u);
	const out = [];
	for (const k in by) {
		const a = by[k].sort((p, q) => dist(p, to) - dist(q, to));
		out.push(...a.slice(0, from === 'q' ? Math.ceil(a.length / 4) : a.length));
	}
	return out;
}
// A tap on open ground (Albert, Build 40): a small row of icons. Hammer: build here (the menu opens on what fits the spot). Sword: the army, in place:
// All, half, and more (a quarter, the nearest few, a battalion). Three dots: more about the place. Cross: away.
function showStrip(sx, sy, x, y, step) {
	if (step === undefined) closeCard();
	const el = $('strip'),
		at = `${Math.round(x)},${Math.round(y)}`,
		to = { x, y },
		n = (from) => sendPick(from, to).length,
		nAll = n('all'),
		ic = (act, icon, label, cls) =>
			`<button data-act="${act}" class="ic ${cls || ''}" aria-label="${label}">${icon}</button>`;
	const sh = { sx, sy, x, y };
	G.stripAt = sh;
	if (!step)
		el.innerHTML =
			ic(`buildhere:${at}`, ICON.hammer, 'Build here') +
			ic(nAll ? 'striparmy' : 'nofree', ICON.sword, 'Send soldiers here', nAll ? 'go thumb' : 'dis thumb') +
			ic(`more:${at}`, '⋯', 'More about this place') +
			ic('nostrip', ICON.close, 'Cancel');
	else if (step === 1)
		el.innerHTML =
			btn(`sendto:h,${at}`, '½', String(n('h')), 'ic') +
			btn(`sendto:all,${at}`, 'All', `${nAll} idle`, 'ic go thumb') +
			ic('stripmore', '⋯', 'More ways to send') +
			ic('nostrip', ICON.close, 'Cancel');
	// three taps in one spot: open, sword, All (Albert: a fast dispatch)
	else {
		const bns = hasCmd() ? BN.map((nm, i) => [i, nm]).filter(([i]) => n(i)) : [];
		el.innerHTML =
			btn(`sendto:q,${at}`, '¼', String(n('q'))) +
			[5, 10, 20]
				.filter((k) => nAll > k)
				.map((k) => btn(`sendto:n${k},${at}`, String(k), 'nearest'))
				.join('') +
			bns.map(([i, nm]) => btn(`sendto:${i},${at}`, nm, String(n(i)))).join('') +
			ic('nostrip', ICON.close, 'Cancel');
	}
	el.hidden = false;
	G.strip = to;
	if (step === 1 || step === 2) return; // the next step stays exactly where it was: the thumb does not move
	const r = $('stage').getBoundingClientRect(),
		w = el.offsetWidth,
		h = el.offsetHeight,
		th = el.querySelector('.thumb'),
		tx = th ? th.offsetLeft + th.offsetWidth / 2 : w / 2,
		ty = th ? th.offsetTop + th.offsetHeight / 2 : h / 2;
	el.style.left = clamp(sx - tx, 4, r.width - w - 4) + 'px';
	el.style.top = clamp(sy - ty, 4, r.height - h - 4) + 'px'; // the sword opens under the finger
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
function hideStrip() {
	const el = $('strip');
	if (el && !el.hidden) {
		el.hidden = true;
		if (G) G.strip = null;
	}
}
// ── the War Council: six battalions, what each holds by type, its stance and formation
function musterGap(i) {
	// what a battalion still lacks: its plan, less the members it has and the soldiers already mustering for it
	const gap = { ...G.bnPlan[i] };
	for (const u of armyOf(0)) if (u.bn === i && gap[u.kind]) gap[u.kind]--;
	for (const b of G.blds)
		if (b.owner === 0)
			for (const j of b.q) if (j.muster && j.bn === i) for (const k in j.muster) gap[k] = (gap[k] || 0) - j.muster[k];
	for (const k in gap) if (gap[k] <= 0) delete gap[k];
	return gap;
}
