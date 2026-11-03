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
// ── The quick action (Albert, Nov 3: "a tap on the ground like a right click"): with units picked, a tap is their order (26-input, order);
// with nothing picked, a tap on open ground puts two chips there, the sword and ✕. The sword sends every soldier to the spot; ✕, a pan, or a
// tap anywhere else closes them (that tap does nothing more). With no soldiers the sword is dim and says so. G.qa: the spot and the finger.
function showQuick(sx, sy, x, y) {
	const el = $('qa'),
		r = $('stage').getBoundingClientRect(),
		css = getComputedStyle(el),
		gap = parseFloat(css.getPropertyValue('--gap')),
		s = parseFloat(css.getPropertyValue('--slot')),
		left = sx > r.width / 2, // the ✕ opens toward the middle
		up = $('hud').getBoundingClientRect().bottom - r.top + gap,
		down = $('orders').getBoundingClientRect().top - r.top - gap - s;
	G.qa = { x, y };
	el.hidden = false;
	el.classList.toggle('left', left);
	patchHTML(el, sym('qsword', ICON.sword, sendable().length ? 'go' : 'dis', 'Send every soldier here') + sym('qclose', ICON.close, '', 'Close'));
	const w = el.offsetWidth;
	el.style.left = clamp(left ? sx + s / 2 - w : sx - s / 2, gap, r.width - w - gap) + 'px';
	el.style.top = clamp(sy - s / 2, up, down) + 'px';
	feel('tick');
}
function hideQuick() {
	$('qa').hidden = true;
	G.qa = null;
}
// ── The share (Albert, Nov 3, 10:06: the tap cycle, the slider cut): a tap on a kind in War · Kinds picks all of it; tapping it again picks
// half, then a quarter, then all again; its count shows on the tile. The ones that go are those nearest the target, chosen when the map is
// tapped (shareFor); till then the rings show the ones nearest the middle of the screen. G.share: { t, ids, n }. Strategy games run on these
// roles (all, half, a few): no slider, no edge gesture, no eyes off the battle.
const SHARE = [1, 0.5, 0.25]; // the steps of the cycle
const shareN = (N, i) => Math.max(1, Math.ceil(N * SHARE[i]));
function sharePick(t) {
	const S = ofKind(t),
		Sh = G.share,
		i = Sh && Sh.t === t && shareOn() ? (Sh.i + 1) % SHARE.length : 0,
		c = toWorld(cw / 2, ch / 2 + vy),
		near = (p) => (a, b) => hyp(a.x - p.x, a.y - p.y) - hyp(b.x - p.x, b.y - p.y);
	if (!S.length) return 0;
	const ids = S.slice().sort(near(c)).map((u) => u.id);
	G.share = { t, i, ids, n: shareN(ids.length, i) };
	setPick(ids.slice(0, G.share.n).map((id) => ({ t: 'unit', id })));
	return G.share.n;
}
// the pick is the share's own (a new pick, a tap on one of yours, an empty pick: the share is over)
const shareOn = () => {
	const Sh = G.share;
	if (!Sh) return false;
	const P = G.pick.filter((k) => k.t === 'unit');
	return P.length === Sh.n && P.every((k) => Sh.ids.includes(k.id));
};
// a tap on the map with the share picked: the n of the kind nearest that spot go, the rest stay as they are
function shareFor(h) {
	if (!shareOn()) return null;
	const p = h.e,
		U = G.share.ids.map((id) => byId(G.units, id)).filter((u) => u && u.hp > 0);
	U.sort((a, b) => hyp(a.x - p.x, a.y - p.y) - hyp(b.x - p.x, b.y - p.y));
	const go = U.slice(0, G.share.n);
	setPick(go.map((u) => ({ t: 'unit', id: u.id })));
	G.share.ids = go.map((u) => u.id).concat(G.share.ids.filter((id) => !go.some((u) => u.id === id)));
	return go;
}
function quickGo() {
	const Q = G.qa,
		S = sendable();
	hideQuick();
	if (!Q) return;
	if (!S.length) return say(HOLD_WORD.none, '', TOAST.short);
	order(S, { t: 'ground', e: { x: Q.x, y: Q.y } });
	feel('thock');
}
// ── The War Director (06-rules-tuning, DIRECT): a hold on a kind in War · Kinds is its drill (a tap picks the kind, 33-verbs kpick). Every
// soldier of that kind that can be sent goes at once; the crosshair (G.hud.h), or the camera's middle, is where. Each returns what was said.
const ofKind = (t) => sendable().filter((u) => clsOf(u.kind) === t);
const aimH = () => G.hud.h || { t: 'ground', e: { x: cam.x, y: cam.y } };
// a drill's shape on the ground (Albert, Nov 3: "form a line", "a semi circle or arc"): every soldier of S to its place round the point at,
// facing dir, for secs; shape 'line' (one or two ranks across dir) or 'arc' (one rank on a circle round arc.x, arc.y of radius arc.r).
// The shape lives on each soldier (u.drill) and is laid out by the army's own grid (12-sim-core), so any new order ends it.
const drillOn = (u) => !!(u.drill && u.drill.until > G.t && u.drill.px === u.px && u.drill.py === u.py && u.state === 'goto');
function dress(S, at, dir, shape, secs, arc) {
	for (const u of S) {
		u.state = 'goto';
		u.px = at.x;
		u.py = at.y;
		u.idleT = 0;
		u.drill = { shape, fx: dir.x, fy: dir.y, t0: G.t, until: G.t + secs, px: at.x, py: at.y, arc: arc || null, from: { x: u.x, y: u.y } };
	}
}
// the x% by x% rule (FORMING.share): past that share of the drill's time, a soldier not that share of the way from where it started to its
// place holds where it stands: in tight quarters they do the best they can as quick as they can (Albert, Nov 3)
function drillHold(u) {
	const D = u.drill;
	if (!D || D.held || !D.from || u.gx === undefined || G.t - D.t0 < (D.until - D.t0) * FORMING.share) return; // a drill from before this rule (a save) has no start
	const all = hyp(D.px + u.gx - D.from.x, D.py + u.gy - D.from.y) || 1,
		left = hyp(D.px + u.gx - u.x, D.py + u.gy - u.y);
	if (1 - left / all >= FORMING.share) return;
	D.held = true;
	u.px = D.px = u.x;
	u.py = D.py = u.y; // its place is where it stands (its own spot now, no offset)
	u.gx = u.gy = 0;
}
// ── The choke and the ambush (Albert, Nov 3, 11:08: "allowing the player to use the land to pick a formation that works")
// the choke: a drag across a gap on the map (hold the shape on War); the picked soldiers, else everyone, stand in it as many files as
// the gap holds (CHOKE), facing across it toward the nearest foes, else away from home; a standing order (a drill with no end)
const toolSet = () => {
	const P = picked().filter(isSoldier);
	return P.length ? P : sendable();
};
function chokeAt(a, b) {
	const U = toolSet();
	if (!U.length) return say('No soldiers to hold it.', '', TOAST.short);
	const w = hyp(b.x - a.x, b.y - a.y);
	if (w < GRID.gap) return say('Drag across the gap, end to end.', '', TOAST.short);
	const cols = clamp(Math.round(w / GRID.gap), CHOKE.min, CHOKE.max),
		mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
		F = foesNear(mid),
		home = homeOf(0),
		ref = F.length ? centreOf(F) : home ? { x: 2 * mid.x - home.x, y: 2 * mid.y - home.y } : null;
	let fx = -(b.y - a.y) / w,
		fy = (b.x - a.x) / w;
	if (ref && fx * (ref.x - mid.x) + fy * (ref.y - mid.y) < 0) {
		fx = -fx;
		fy = -fy;
	}
	dress(U, mid, { x: fx, y: fy }, 'choke', 1e9);
	for (const u of U) u.drill.cols = cols;
	say(`${U.length} hold the gap, ${cols} across.`, 'good', TOAST.short);
	sfx('horn');
	feel('thock');
}
// the ambush: the nearest cover to the tap (an open square with forest within AMBUSH.cover squares, looked for within AMBUSH.find); the
// soldiers go there and go to ground (u.hid once in place: no foe takes them for a mark, 15-sim-spatial); a foe within AMBUSH.spring, or a
// blow, springs the whole ambush with a charge's burst (14-sim-troops)
function coverNear(x, y) {
	const cx = Math.floor(x / NAVC),
		cy = Math.floor(y / NAVC),
		R = Math.ceil(AMBUSH.find / NAVC),
		tree = (gx, gy) => gx >= 0 && gy >= 0 && gx < NC && gy < NC && NAV.solid[gy * NC + gx] && !NAV.lake[gy * NC + gx] && !NAV.occ[gy * NC + gx];
	let best = null,
		bd = 1e9;
	for (let gy = cy - R; gy <= cy + R; gy++)
		for (let gx = cx - R; gx <= cx + R; gx++) {
			if (gx < 0 || gy < 0 || gx >= NC || gy >= NC || NAV.solid[gy * NC + gx]) continue;
			const d = hyp(gx * NAVC + 5 - x, gy * NAVC + 5 - y);
			if (d >= bd || d > AMBUSH.find) continue;
			let near = false;
			for (let j = -AMBUSH.cover; j <= AMBUSH.cover && !near; j++) for (let i = -AMBUSH.cover; i <= AMBUSH.cover && !near; i++) if ((i || j) && tree(gx + i, gy + j)) near = true;
			if (near) {
				bd = d;
				best = { x: gx * NAVC + 5, y: gy * NAVC + 5 };
			}
		}
	return best;
}
function ambushAt(h) {
	const U = toolSet();
	if (!U.length) return say('No soldiers to hide.', '', TOAST.short);
	const spot = coverNear(h.e.x, h.e.y);
	if (!spot) return say('No cover there: an ambush wants forest.', '', TOAST.short);
	for (const u of U) {
		u.state = 'goto';
		u.px = spot.x;
		u.py = spot.y;
		u.idleT = 0;
		u.tgt = null;
		u.focus = null;
		u.drill = null;
		u.amb = { x: spot.x, y: spot.y }; // bound for cover; hid once there
		u.hid = false;
	}
	say(`${U.length} go to ground at ${coord(spot.x, spot.y)}.`, 'good', TOAST.short);
	feel('thock');
}
const DIRECT_WHY = { none: 'Nobody of that kind.' };
const DIRECTS = {
	wall: (S) => {
		const c = centreOf(S),
			F = foesNear(c),
			to = F.length ? centreOf(F) : aimH().e,
			d = hyp(to.x - c.x, to.y - c.y) || 1;
		for (const u of S) {
			u.wall = G.t + DIRECT.wall;
			u.focus = null;
			u.tgt = null; // (an audit, Nov 2: a foe it was chasing would have pulled it out of the wall)
		}
		dress(S, c, { x: (to.x - c.x) / d, y: (to.y - c.y) / d }, 'line', DIRECT.wall);
		return 'Shield wall!';
	},
	loose: (S) => {
		if (G.looseT > G.t) return `Reloading: ${Math.ceil(G.looseT - G.t)} s.`;
		const c = centreOf(S),
			F = foesNear(c);
		if (F.length) {
			const f = centreOf(F),
				d = hyp(c.x - f.x, c.y - f.y) || 1,
				r = Math.min(...S.map((u) => stats(0, u.kind).rng)) * DIRECT.arc, // inside every bow's reach
				at = { x: f.x + ((c.x - f.x) / d) * r, y: f.y + ((c.y - f.y) / d) * r };
			dress(S, at, { x: -(c.x - f.x) / d, y: -(c.y - f.y) / d }, 'arc', DIRECT.loose * 3, { x: f.x, y: f.y, r });
		} else order(S, aimH()); // no foe in sight: they go where the crosshair is, as before
		for (const u of S) u.cd = 0; // the reload lined up: everyone in reach releases on the next step
		G.looseT = G.t + DIRECT.loose;
		return 'Archers, loose!';
	},
	charge: (S) => {
		const why = chargeWhy(0, S);
		if (why) return why; // winded: nobody moves (an audit, Nov 2: they were ordered off before the check)
		order(S, aimH());
		charge(0, S, undefined, true);
		return 'Riders, charge!';
	},
	bombard: (S) => {
		const h = aimH(),
			b = nearestFoeBld(0, h.e, undefined, 300);
		order(S, b ? { t: 'bld', e: b } : h);
		return b ? `Bombard the ${bldName(b.owner, b.kind).toLowerCase()}!` : 'Engines, forward!';
	},
};
// the four kinds' moves: [tap, hold], with the word each says, and the sound
// the four kinds' drills (a hold on a kind in War · Kinds), with the word each says and its sound. The second moves (Advance, Fall back,
// Wheel, Pull back) are cut (Albert, Nov 3): pick the kind, then tap where
const DIRECT_OF = [
	['wall', 'Shield wall', 'hit'],
	['loose', 'Loose!', 'arrow'],
	['charge', 'Charge', 'horn'],
	['bombard', 'Bombard', 'boom'],
];
function direct(t) {
	const [id, word, snd] = DIRECT_OF[t],
		S = ofKind(t);
	if (!S.length) return say(DIRECT_WHY.none, '', TOAST.short);
	const said = DIRECTS[id](S, word);
	if (!/!$/.test(said)) return say(said, '', TOAST.short); // a reason ends with a stop: nobody moved, no horn
	const f = orderCost(0, S); // the drill's price (ORDER): their meals, and the tiredness after
	say(f ? `${said} (${f} food)` : said, 'good', TOAST.short);
	sfx(snd);
	feel('snap');
}
// the wait a kind's tap still has to sit out, in seconds (0 when it is ready): the archers' reload, the riders' charge; the hold keeps its own
const directWait = (t) => Math.max(0, Math.ceil((t === 1 ? G.looseT || 0 : t === 2 ? (G.chargeT || {})['0:all'] || 0 : 0) - G.t));
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
