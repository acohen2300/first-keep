// ═════ 03-core.js ═════
// ───────────────────────── Small helpers ─────────────────────────
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hyp = (x, y) => Math.sqrt(x * x + y * y);
const dist = (a, b) => {
	const dx = a.x - b.x,
		dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
};
const clock = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const costText = (c) =>
	Object.entries(c || {})
		.filter(([, v]) => v)
		.map(([k, v]) => Math.round(v) + k)
		.join(' ');
const afford = (p, c) => Object.entries(c || {}).every(([k, v]) => p.res[k] >= v);
const pay = (p, c) => {
	for (const [k, v] of Object.entries(c || {})) p.res[k] -= v;
};
const addRes = (a, c, f = 1) => {
	for (const [k, v] of Object.entries(c || {})) a[k] = (a[k] || 0) + v * f;
	return a;
};
const sumCost = (c) => Object.values(c || {}).reduce((s, v) => s + v, 0);
const fmt = (n) =>
	n >= 10000 ? Math.round(n / 1000) + 'k' : n >= 1000 ? Math.floor(n / 100) / 10 + 'k' : String(Math.floor(n));
const towardMid = (e, d) => {
	const tx = MID - e.x,
		ty = MID - e.y,
		l = hyp(tx, ty) || 1;
	return { x: e.x + (tx / l) * d, y: e.y + (ty / l) * d };
};
function nearest(list, from, ok, maxD = 1e9) {
	let best = null,
		bd = maxD;
	for (const e of list) {
		if (ok && !ok(e)) continue;
		const d = dist(from, e);
		if (d < bd) {
			bd = d;
			best = e;
		}
	}
	return best;
}
// The simulation's dice are seeded, so a game can be replayed and tested; looks use Math.random.
function rng() {
	let t = (G.rs = (G.rs + 0x6d2b79f5) | 0);
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rnd = (a, b) => a + rng() * (b - a);
let NID = 1;
// one wolf, two wolves; one spearman, two spearmen; one man-at-arms, two men-at-arms
const plural = (n) =>
	/^man-at-arms$/i.test(n)
		? n.replace(/^(m)an/i, '$1en')
		: /man$/.test(n)
			? n.slice(0, -3) + 'men'
			: /wolf$/i.test(n)
				? n.slice(0, -1) + 'ves'
				: /[^aeiou]y$/.test(n)
					? n.slice(0, -1) + 'ies'
					: /(s|x|ch|sh)$/.test(n)
						? n + 'es'
						: n + 's';
const some = (k, n) => (k === 1 ? n : plural(n));

// Settings remembered on this phone.
const SET = {
	diff: 'normal',
	tips: true,
	msgs: true,
	fog: true,
	civ: 'roman',
	fantasy: false,
	mode: 't60',
	sound: true,
	vol: 0.6,
	mix: {},
	hush: {},
	mini: undefined,
	mapSeen: false,
	vibe: true,
	learned: {},
};
try {
	Object.assign(SET, JSON.parse(localStorage.getItem('firstkeep.settings') || '{}'));
} catch (e) {}
if (!CIVS[SET.civ]) SET.civ = 'roman';
if (!(SET.setV >= 38)) {
	let old = false;
	try {
		old = !!localStorage.getItem('firstkeep.settings');
	} catch (e) {}
	if (old && SET.diff === 'easy' && SET.mode === 't30') {
		SET.diff = 'normal';
		SET.mode = 't60';
	}
	SET.setV = 38;
} // Build 38: Normal and an hour by default; a phone that kept Easy and 30 minutes from the old default moves once, and a choice made after stays
SET.mix = Object.assign({ fx: 1, amb: 1, alert: 1 }, SET.mix); // three volumes: effects, ambience, alerts
function saveSet() {
	try {
		localStorage.setItem('firstkeep.settings', JSON.stringify(SET));
	} catch (e) {}
}
// Research lines: the steps of one line at one building come in table order; a step waits on the one before it and on what it names in need
const lineOf = (t) => TECH.filter((x) => x.at === t.at && x.line === t.line && (!x.civ || x.civ === t.civ));
const prevOf = (t) => {
	const L = lineOf(t),
		i = L.indexOf(t);
	return i > 0 ? L[i - 1] : null;
};
const needsOf = (t) => {
	const pv = prevOf(t);
	return (pv ? [pv.id] : []).concat(t.need || []);
};
const nextStep = (o, t) => {
	const L = lineOf(t);
	return L.find((x) => !G.P[o].techs.has(x.id)) || null;
}; // the first unknown step of t's line
const isNext = (o, t) => nextStep(o, t) === t;
const todaySeed = () => {
	const d = new Date();
	return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}; // the same map for everyone that day
const MODES = {
	conquest: { name: 'Conquest', secs: 0 },
	t30: { name: '30 minutes', secs: 1800 },
	t60: { name: '60 minutes', secs: 3600 },
};

// ───────────────────────── Queries ─────────────────────────
// The Town Center, the head count and the room of each side are asked for by every unit every step: answered once a step, from one small cache
const QC = { g: null, tick: -1, keep: [], pop: [], cap: [] };
function qc() {
	if (QC.g !== G || QC.tick !== G.tick || QC.v !== G.fxv) {
		QC.g = G;
		QC.tick = G.tick;
		QC.v = G.fxv;
		QC.keep.length = QC.pop.length = QC.cap.length = 0;
		QC.bak = null;
	}
	return QC;
}
const keepOf = (o) => {
	const C = qc();
	if (C.keep[o] === undefined || (C.keep[o] && C.keep[o].hp <= 0))
		C.keep[o] = G.blds.find((b) => b.owner === o && b.kind === 'keep' && b.hp > 0) || null;
	return C.keep[o];
};
const qcDrop = () => {
	QC.tick = -1;
}; // a building came or went inside a step: ask again
const bldsOf = (o, kind) => G.blds.filter((b) => b.owner === o && b.kind === kind && b.hp > 0);
const ready = (o, kind) => bldsOf(o, kind).filter((b) => b.prog >= 1);
const readyAt = (o, U) => [U.at, ...(U.also || [])].flatMap((k) => ready(o, k)); // where a unit can be trained: its building, and any other that also trains it
const unitsOf = (o, kind) => G.units.filter((u) => u.owner === o && u.hp > 0 && (!kind || u.kind === kind)); // the living: the dead leave the list only at the end of a step
const isSoldier = (u) => UNIT[u.kind].tick === 'sol';
const soldiersOf = (o) => G.units.filter((u) => u.owner === o && u.hp > 0 && isSoldier(u));
const armyOf = (o) => G.units.filter((u) => u.owner === o && u.hp > 0 && UNIT[u.kind].cls === 'army');
const popOf = (o) => {
	const C = qc();
	if (C.pop[o] === undefined) {
		let n = 0;
		for (const u of G.units) if (u.owner === o && UNIT[u.kind].cls) n++;
		C.pop[o] = n;
	}
	return C.pop[o];
};
const roomOf = (o, kind) => (BLD[kind].room ? BLD[kind].room + fxv(o, 'room', [kind]).a : 0); // people one home shelters, after research
const capOf = (o) => {
	const C = qc();
	if (C.cap[o] === undefined)
		C.cap[o] = Math.min(
			POPMAX,
			G.blds.reduce((n, b) => n + (b.owner === o && b.prog >= 1 && b.hp > 0 ? roomOf(o, b.kind) : 0), 0),
		);
	return C.cap[o];
};
// soldiers you may keep: each finished training place, castle, temple, courthouse or hospital makes room; at most ARMYMAX
const armyRoom = (o) =>
	Math.min(
		ARMYMAX + (G.P[o].capA || 0),
		G.blds.reduce(
			(n, b) =>
				n +
				(b.owner === o && b.prog >= 1 && b.hp > 0 && BLD[b.kind].armyRoom
					? BLD[b.kind].armyRoom + fxv(o, 'armyroom', [b.kind]).a
					: 0),
			0,
		),
	);
const clsMax = (c, o) => (c === 'civ' ? VILMAX + (G.P[o].capV || 0) : armyRoom(o));
const armyFull = (o) => `Army full, ${clsCount(o, 'army')}/${armyRoom(o)}. ${ARMY_ADDS}.`; // the limit, and what lifts it, wherever it bites
const qMax = (o) => QUEUE + fxv(o, 'queue').a; // orders one building's line holds (Written records, Guilds add to it)
const lineFree = (o, kinds) => kinds.some((k) => ready(o, k).some((b) => b.q.length < qMax(o)));
// how many of a building you may have now: by age, plus research
const capFor = (o, kind) =>
	BLD[kind].nocap ? Infinity : (BLD[kind].cap ? BLD[kind].cap[G.P[o].age] : 1) + fxv(o, 'limit', [kind]).a;
const atCap = (o, kind) => bldsOf(o, kind).length >= capFor(o, kind);
function capWhy(o, kind) {
	// why no more of this building, or null
	if (!atCap(o, kind)) return null;
	const c = capFor(o, kind),
		A = G.P[o].age,
		cp = BLD[kind].cap,
		more = cp && A < 4 && cp[A + 1] > cp[A];
	return c ? `At the limit of ${c}` + (more ? '. A new age allows more' : '') : 'A later age allows it';
}
const clsCount = (o, c) =>
	G.units.filter((u) => u.owner === o && UNIT[u.kind].cls === c).length +
	G.blds.reduce(
		(n, b) =>
			n +
			(b.owner === o
				? b.q.reduce(
						(m, j) =>
							m +
							(j.kind && UNIT[j.kind].cls === c
								? 1
								: j.muster && c === 'army'
									? Object.values(j.muster).reduce((x, y) => x + y, 0)
									: 0),
						0,
					)
				: 0),
		0,
	); // a muster counts all it will bring
const queuedOf = (o, kind) =>
	G.blds.reduce(
		(n, b) =>
			n +
			(b.owner === o
				? b.q.filter((j) => j.kind && (!kind || j.kind === kind || UNIT[j.kind].replaces === kind)).length
				: 0),
		0,
	);
const orderSet = () =>
	armyOf(0).filter((u) => u.kind !== 'spy' && u.state !== 'shrine' && (G.sel === 'all' || u.bn === G.sel)); // spies and priests holding a shrine keep their own work
const selName = () => (G.sel === 'all' ? 'army' : BN[G.sel]);
const hasCmd = () => G.P[0].techs.has('command');
const formOf = (u) => (u.owner === 0 && u.bn !== undefined && G.P[0].techs.has('formations') ? G.form[u.bn] || 0 : 0);
// Battalions, once Command is researched: each holds what you set for it, by type; members stay put, gaps fill from the rest, the rest are the reserve
function rebattalion() {
	const S = armyOf(0).filter((u) => u.kind !== 'spy');
	if (!hasCmd()) {
		for (const u of S) u.bn = undefined;
		return;
	}
	const have = BN.map(() => ({})),
		take = (u, i) => {
			have[i][u.kind] = (have[i][u.kind] || 0) + 1;
			u.bn = i;
		};
	for (const u of S)
		if (u.bn !== undefined) {
			if ((have[u.bn][u.kind] || 0) < (G.bnPlan[u.bn][u.kind] || 0)) take(u, u.bn);
			else u.bn = undefined;
		}
	for (const u of S)
		if (u.bn === undefined)
			for (let i = 0; i < BNS; i++)
				if ((have[i][u.kind] || 0) < (G.bnPlan[i][u.kind] || 0)) {
					take(u, i);
					break;
				}
}
const atWar = (a, b) => a !== b && G.rel[a][b] === 'war';
const friendly = (a, b) => a === b || G.rel[a][b] === 'ally';
const season = () => SEASONS[Math.floor(G.t / SEASON_LEN) % 4];
function nightness() {
	const ph = (G.t % DAY_LEN) / DAY_LEN;
	return ph < 0.62 ? 0 : ph < 0.7 ? (ph - 0.62) / 0.08 : ph < 0.94 ? 1 : 1 - (ph - 0.94) / 0.06;
}
const civOf = (o) => CIVS[G.P[o].civ];
// the kind a side actually trains for a common unit (its civilisation's own, if it has one)
const civKind = (o, kind) => {
	const c = G.P[o] && civOf(o);
	return c && UNIT[c.uu].replaces === kind ? c.uu : kind;
};
const baseKind = (kind) => UNIT[kind].replaces || kind;
const bldName = (o, kind) =>
	kind === 'wonder' && civOf(o)
		? civOf(o).wonder
		: BLD[kind].name3 && G.P[o].age >= 3
			? BLD[kind].name3
			: BLD[kind].name;

// ───────────────────────── Effects: research, civilisation and buildings, by table ─────────────────────────
// Each side keeps a small cache of its active effects; it is rebuilt when research finishes or a building with effects stands or falls.
function fxList(o) {
	const p = G.P[o];
	if (p.fxc && p.fxc.v === G.fxv) return p.fxc;
	const c = { v: G.fxv },
		add = (list) => {
			for (const f of list || []) (c[f.s] = c[f.s] || []).push(f);
		};
	for (const id of p.techs) add(TECHBY[id].fx);
	if (p.civ) add(CIVS[p.civ].fx);
	const seen = new Set();
	for (const b of G.blds)
		if (b.owner === o && b.prog >= 1 && b.hp > 0 && BLD[b.kind].fx && !seen.has(b.kind)) {
			seen.add(b.kind);
			add(BLD[b.kind].fx);
		}
	p.fxc = c;
	p.uc = {};
	return c;
}
// the combined effect on one stat for something with these keys: m multiplies, a adds, min keeps the lowest
const FX1 = { m: 1, a: 0, min: 1 };
function fxv(o, stat, keys) {
	// answered once per side, stat and keys until the effects change: no new object on the hot paths
	if (o === WILD) return FX1;
	const c = fxList(o),
		L = c[stat];
	if (!L) return FX1;
	const key = keys ? stat + '|' + keys.join() : stat,
		M = c.memo || (c.memo = {});
	if (M[key]) return M[key];
	let m = 1,
		a = 0,
		mn = 1;
	for (const f of L)
		if (!f.k || f.k === '*' || (keys && keys.includes(f.k))) {
			if (f.m) m *= f.m;
			if (f.a) a += f.a;
			if (f.min) mn = Math.min(mn, f.min);
		}
	return (M[key] = { m, a, min: mn });
}
const fxDirty = () => {
	G.fxv++;
};
const unitKeys = (kind) => {
	const U = UNIT[kind],
		k = [kind, baseKind(kind)];
	for (const t of U.tags || []) k.push('#' + t);
	if (U.tick === 'sol') k.push('#soldier');
	return k;
};
const bldKeys = (kind) => {
	const B = BLD[kind],
		k = [kind];
	if (B.wallish) k.push('#wallish');
	if (B.dmg && !B.spyonly) k.push('#guard');
	return k;
};
// what a side's unit of this kind is, after its research: name, health, damage, reach, speed, what it beats
function stats(o, kind) {
	if (o === WILD) return UNIT[kind];
	const p = G.P[o];
	fxList(o);
	if (p.uc[kind]) return p.uc[kind];
	const U = UNIT[kind],
		base = baseKind(kind),
		keys = unitKeys(kind);
	let name = U.name,
		hp = U.hp,
		dmg = U.dmg || 0,
		rng_ = U.rng || 0,
		spd = U.spd,
		vs = U.vs || {},
		tier = 0;
	for (const T of TECH)
		if (T.tier && (T.tier.unit === base || T.tier.unit === kind) && p.techs.has(T.id)) {
			const R = T.tier;
			tier++;
			if (!U.civ || R.unit === kind) name = R.name;
			hp *= R.hp || 1;
			dmg += R.dmg || 0;
			rng_ += R.rng || 0;
			spd *= R.spd || 1;
			if (R.vs) vs = { ...vs, ...R.vs }; // a people's own soldier keeps its name through the common ranks, and takes its elite one
		}
	const S = {
		name,
		tier,
		kit: ['leather', 'chain', 'plate'].filter((id) => p.techs.has(id)).length,
		hp: hp * fxv(o, 'uhp', keys).m,
		dmg: U.dmg ? dmg + fxv(o, 'dmg', keys).a : 0,
		rng: rng_ + fxv(o, 'rng', keys).a,
		spd: spd * fxv(o, 'spd', keys).m,
		vs,
		armor: fxv(o, 'armor', keys).min,
		train: fxv(o, 'train', keys).m,
	};
	return (p.uc[kind] = S);
}
const maxHpU = (o, kind) => stats(o, kind).hp;
const maxHpB = (o, kind) => BLD[kind].hp * (o === WILD ? 1 : fxv(o, 'bhp', ['*', ...bldKeys(kind)]).m);
const dmgOf = (u) =>
	stats(u.owner, u.kind).dmg *
	(u.owner === WILD ? 1 : wearMul(u.owner)) *
	(FORM[formOf(u)].dmg && hasTag(u.kind, 'mounted') ? FORM[formOf(u)].dmg : 1) *
	(u.zeal > G.t ? ZEAL.mul : 1) *
	(u.sick > G.t ? 0.6 : 1) *
	hungerOf(u.owner) *
	EVM.dmg *
	(u.chg > G.t ? CHARGE.dmg * fxv(u.owner, 'charge').m : 1);
const rngOf = (u) => {
	const r = stats(u.owner, u.kind).rng;
	return r > 20 ? r * ((WEATHER[G.wx] && WEATHER[G.wx].rng) || 1) : r;
};
const sightOf = (e) =>
	(((UNIT[e.kind] || BLD[e.kind]).sight || 100) +
		(e.owner !== undefined && e.owner !== WILD && e.owner !== null
			? fxv(e.owner, 'sight', ['*', ...(UNIT[e.kind] ? unitKeys(e.kind) : bldKeys(e.kind))]).a
			: 0)) *
	(1 - (1 - NIGHT_SIGHT * (0.6 + 0.4 * moonLight())) * G.night) *
	EVM.sight *
	(WEATHER[G.wx].sight || 1); // night, the moon, an eclipse or fog, a blizzard
const carryOf = (o) => CARRY + fxv(o, 'carry').a;
function gatherMul(o, n) {
	let m = fxv(o, 'gather', [n.type, n.kind]).m * EVM.gather * (WEATHER[G.wx].gather || 1);
	if (n.farm && n.farm.locust > G.t) return 0; // a field stripped by locusts gives nothing for a while
	if (n.kind === 'farm') {
		m *= fxv(o, 'crop', [n.type]).m;
		if (n.type === 'food') {
			m *=
				season().farm *
				(hz('winter') && season().name === 'Winter' ? 0.6 : 1) *
				(G.harvest || 1) *
				(WEATHER[G.wx].crop || 1) *
				(n.farm.fert ?? 1);
		}
		if (BLD[n.farm.kind].makes) m *= fxv(o, 'make', [n.type]).m;
	}
	return m;
}
const makeOf = (b) => (BLD[b.kind].makes ? BLD[b.kind].makes[b.cropT || BLD[b.kind].crop] : null); // what a workshop makes now: from what, how fast
// after research or a new building: every unit and building of that side takes its new health at once (same share of it)
function rehealth(o) {
	fxDirty();
	for (const u of G.units)
		if (u.owner === o) {
			const M = maxHpU(o, u.kind);
			if (Math.abs(M - u.max) > 0.01) {
				u.hp *= M / u.max;
				u.max = M;
			}
		}
	for (const b of G.blds)
		if (b.owner === o && b.prog >= 1) {
			const M = maxHpB(o, b.kind);
			if (b.mx && Math.abs(M - b.mx) > 0.01) b.hp *= M / b.mx;
			b.mx = M;
		}
}
const unitPower = (u) => ((u.hp * Math.max(1, dmgOf(u))) / 6) * (UNIT[u.kind].bonly ? 0.3 : 1);
const powerOf = (list) => list.reduce((s, u) => s + (isSoldier(u) ? unitPower(u) : 0), 0);
