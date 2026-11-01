// ═════ 10-world.js: the map and what is on it ═════
// ───────────────────────── The world ─────────────────────────
let G;
function blankGame(seed) {
	return {
		t: 0,
		tick: 0,
		threats: [], // read by the emergency card and the nav before the first step (C17)
		speed: G ? G.speed : 1,
		over: null,
		seed,
		fogOn: SET.fog, // fog of war is chosen at the start and kept for the whole game (Build 60: it could be switched off mid-game from Help)
		rs: seed,
		units: [],
		blds: [],
		seenB: {}, // the other sides' buildings you have seen (the fog's memory)
		nodes: [],
		finds: [],
		tracers: [],
		mail: [], // every line, newest first (the dashboard's mail)
		P: [],
		rel: [],
		card: null,
		place: null,
		sel: 'all',
		alertT: -99,
		warnT: -99,
		confirm: null,
		night: 0,
		loot: {},
		lootT: 0,
		temper: Array(BNS + 1).fill(T_GUARD),
		bnPlan: BN.map(() => ({})),
		bnIntent: BN.map(() => 0), // commander's intent per squad (INTENT in 39)
		ms: [], // the milestones passed (MS_TEXT), read back on their card
		recruitSq: null, // the squad new soldiers join (the Train page)
		form: BN.map(() => 0),
		qs: { from: 'all', n: {} },
		hud: { page: 'jobs' }, // the row's page and the crosshair (39-huddle); never saved: a game opens on Jobs
		msn: [null, null, null, null],
		emg: null,
		intel: {},
		fantasy: SET.fantasy,
		mode: SET.mode,
		diff: SET.diff,
		tension: SET.tension,
		league: null,
		wayT: WAYFARER_EVERY * 0.5,
		wayI: 0,
		wonder: null,
		navDirty: true,
		fxv: 1,
		warAt: {},
		pick: [],
		hz: {},
		ev: {},
		horde: null,
		flood: 0,
		clim: blankClim(),
		truce: null, // when the whole board came to peace, or null (39-games)
		sworn: 0,
		post: [], // news on its way to you by messenger (32-frame: tell) // until when no court may declare war (a scenario's term)
		scen: null,
		enlight: false,
		stood: false,
		gamesT: 0,
		gamesN: 0,
		chron: [], // the climate: the air's temperature, the ground's wetness, snow, ice, mud, the sky's run (37-events)
		fog: new Uint8Array(FOGN * FOGN),
	}; // warAt: notice given, 'a,b' → when it falls due; pick: what the finger holds; hz: the hazards on; ev: the spectacle's state
}
function mkPlayer(i, civ) {
	const d = PLAYERS[i];
	return {
		id: i,
		name: d.name,
		pers: d.pers,
		color: d.color,
		keep: d.keep.slice(),
		civ,
		res: { f: 200, w: 200, s: 100, g: 50, i: 0 },
		goods: Object.fromEntries(GOODK.map((k) => [k, 0])),
		ventures: [],
		hungry: false,
		lord: null,
		tax: 'fair',
		unrest: 0,
		loyal: 0,
		health: 100,
		ration: 1,
		rations: {},
		age: 0,
		aging: false,
		techs: new Set(),
		rally: 'food',
		ally: null,
		alive: i !== WILD,
		envoyOut: false,
		envoyAt: -999,
		zealT: 0,
		wave: null,
		killer: undefined,
		ai: { t: 1 + i * 0.3, lastHelp: 0, cyc: 0, cool: {} }, // cool: side → until when a stalled wave leaves it alone (WAVE)
		gathered: 0,
		spent: 0,
		flow: {},
		rate: {},
		spent1: {},
		orate: {},
		ledger: { in: {}, out: {} },
		score: { people: 0, army: 0, tech: 0, bld: 0, wealth: 0, total: 0 },
		fxc: null,
		uc: {},
	};
}
function newGame(seed, carry, daily) {
	seed = seed === undefined ? (Math.random() * 2 ** 31) | 0 : seed;
	// one seed, one layout (Build 70): the world is laid out once, never measured and laid again
	NID = 1;
	G = blankGame(seed);
	resetScars();
	const others = CIVK.filter((k) => k !== SET.civ);
	for (let i = others.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[others[i], others[j]] = [others[j], others[i]];
	}
	for (let i = 0; i <= WILD; i++) G.P.push(mkPlayer(i, i === 0 ? SET.civ : i === WILD ? null : others[i - 1]));
	// relations: 'war' | 'peace' | 'ally'. Raiders and Rivals are at war with everyone but the Fortress; the Fortress is at peace with all; the wild is at war with all.
	for (let a = 0; a <= WILD; a++) {
		G.rel[a] = [];
		for (let b = 0; b <= WILD; b++)
			G.rel[a][b] = a === b ? 'self' : a === WILD || b === WILD ? 'war' : a === FORT || b === FORT ? 'peace' : 'war';
	}
	makeMap();
	initEconomy();
	// the hazards, chosen here once for every side (Build 70, Albert's A): a pick decides (the day's challenge, a scenario's, the Setup
	// ticks); with none picked each is drawn by lot. Drawn after the map, so the map is the same whatever was picked.
	const scen = !carry && !daily ? SCENARIOS[SET.scen] : null, // the caller says it is the day's challenge: no date is read in here (B2)
		pick = daily ? TODAY_HZ : (scen && scen.hz) || SET.hz || {},
		lot = !HZK.some((k) => pick[k]);
	G.hz = lot ? Object.fromEntries(HZK.map((k) => [k, rng() < HZ_ODDS ? 1 : 0])) : { ...pick };
	G.clim.T = airTemp();
	skyTurn(); // 5 weather: the first sky from the season's chain, not always clear
	navRebuild();
	makeBg();
	for (const b of G.blds) if (!G.fogOn || friendly(0, b.owner)) wearGround(b);
	dangerMap(); // a fresh danger map: the last game's must not steer the first second of this one
	evmSet();
	const k = G.P[0].keep;
	cam.x = k[0] + 120;
	cam.y = k[1] - 120;
	cam.z = 1.3;
	clampCam();
	if (carry) {
		const p = G.P[0];
		p.age = carry.age;
		p.techs = new Set(carry.techs);
		fxDirty();
	} else if (lot) {
		const drawn = HZK.filter((h) => G.hz[h]).map((h) => HAZARDS[h].name);
		news(
			'land',
			`${LAND[G.land].name}. Hazards at random: level ${levelOf(G.hz)}.`,
			'',
			8,
			null,
			null,
			drawn.join(', ') || 'none',
		); // which ones in its why: the mail shows it
	} else news('land', `${LAND[G.land].name}. Gather, grow, explore.`, '', 8);
	if (scen) applyScenario(SET.scen);
	if (G.fogOn) fogTick(); // lit here, not by the first frame drawn: the same seed plays the same whether or not a frame came first (B1)
}
// a scenario is the ordinary game with some things set (SCENARIOS in 06): an age, a store, relations, a few buildings already up (its hazards are chosen with every game's, in newGame)
function applyScenario(id) {
	const S = SCENARIOS[id];
	if (!S || !Object.keys(S).length) return;
	G.scen = id;
	const sides = S.all ? G.P.filter((p) => p.id !== WILD) : [G.P[0]];
	for (const p of sides) {
		const grant = (t) => {
			if (p.techs.has(t)) return;
			for (const n of needsOf(TECHBY[t])) grant(n);
			p.techs.add(t);
		}; // a research step comes with the steps it waits on, as if researched in order (the gate checks every name is a real step)
		if (S.age) p.age = Math.max(p.age, S.age);
		if (S.res) for (const k in S.res) p.res[k] = Math.max(p.res[k], S.res[k]);
		if (S.techs) for (const t of S.techs) grant(t);
		if (S.mode) G.mode = S.mode;
	}
	if (S.rel)
		for (let q = 1; q < WILD; q++) {
			G.rel[0][q] = G.rel[q][0] = S.rel;
			if (S.rel === 'peace') for (let r = 1; r < WILD; r++) if (q !== r) G.rel[q][r] = G.rel[r][q] = 'peace';
		}
	if (S.league) {
		for (let q = 1; q < WILD; q++) for (let r = 1; r < WILD; r++) if (q !== r) G.rel[q][r] = G.rel[r][q] = 'ally';
		G.P[1].ally = 2;
		G.P[2].ally = 1;
	} // three against one: the third stands with the two, allied in all but the one-ally slot
	if (S.truce) G.truce = 0;
	if (S.sworn) G.sworn = S.sworn;
	const k = keepOf(0);
	for (const [kind, dx] of S.blds || []) {
		const s = findSpot(0, kind, k.x + dx, k.y, 0, 120);
		if (!s) continue;
		G.blds.push(mkBld(0, kind, s.x, s.y, 1));
		navRebuild(); // the next one sees this one (Build 60: they were all placed on an empty grid, so they could overlap)
	}
	if (S.walls) {
		for (const c of wallPlan(k))
			if (!NAV.occ[c.gy * NC + c.gx] && !canPlace(0, c.kind, c.gx * NAVC + 5, c.gy * NAVC + 5))
				G.blds.push(mkBld(0, c.kind, c.gx * NAVC + 5, c.gy * NAVC + 5, 1));
	}
	for (let i = 0; i < (S.vils || 0); i++) addUnit(0, 'vil', k.x + 30 + i * 8, k.y + 40);
	navRebuild();
	fxDirty();
	if (S.hordeAt) G.horde = { at: S.hordeAt, said: 0 };
	news('realm', `${SCEN_TEXT[id][0]}: ${SCEN_TEXT[id][1]}`, 'soft', 10);
}
const inBox = (p, r) => p.x >= r.x0 && p.x <= r.x1 && p.y >= r.y0 && p.y <= r.y1;
const node = (kind, type, x, y, amt) => ({ id: NID++, kind, type, x, y, amt, max: amt });
// Each corner is laid out on its own (Build 49; it was one corner mirrored to all four); decision 5a: the same home zone, everything else rolled for it alone.
// Local coordinates: the keep is (0,0); x and y grow toward the middle of the map.
const SHAPE = {
	bushes: [
		[-9, -15],
		[3, -1],
		[-17, 7],
		[11, -13],
		[-3, 15],
		[17, 5],
		[-19, -5],
		[9, 16],
	],
	pair: [
		[-8, -6],
		[8, 6],
	],
};
const LAYOUT = [
	// what, nearest, farthest from the keep, room it needs
	// the home zone (HOME in 06, decision 5a): the five home finds at random positions in the band, all round the Town Center; every other find outside it (makeMap)
	['bushP', HOME.clear, HOME.clear + HOME.band, 38],
	['groveP', HOME.clear, HOME.clear + HOME.band, 56],
	['stoneP', HOME.clear, HOME.clear + HOME.band, 24],
	['goldP', HOME.clear, HOME.clear + HOME.band, 24],
	['ironP', HOME.clear, HOME.clear + HOME.band, 24],
	['bushA', 150, 190, 38],
	['groveA', 170, 250, 72],
	['bushB', 180, 230, 38],
	['stone', 170, 260, 24],
	['gold', 190, 280, 24],
	['groveB', 200, 290, 56],
	['deerA', 160, 250, 44],
	['deerB', 250, 350, 44],
	['boar', 280, 380, 26],
	['bushFar', 300, 420, 44],
	['chest', 380, 520, 46],
	['ruins', 330, 500, 46],
	['den', 420, 560, 46],
	['cemetery', 480, 640, 46],
	['vagabonds', 480, 640, 46],
];
// 2 ground (Build 70): lakes at random over the whole map, never within a clear radius, by a middle line, at the great lake's shore or
// against other water (WATER); a lake with no room left is not laid. Each drains to its nearer map edge, else the other, by a river on the
// same rules, or keeps none when it finds no way or is too short for its two fords.
// lakeSize: the power law cut to WATER.r and inverted, u from 0 to 1 giving the smallest to the largest: r = r0 (1 − u (1 − (r0/r1)^2c))^(−1/2c).
const lakeSize = (u) => WATER.r[0] * (1 - u * (1 - (WATER.r[0] / WATER.r[1]) ** (2 * WATER.c))) ** (-1 / (2 * WATER.c));
function makeWater() {
	const keeps = PLAYERS.slice(0, WILD).map((d) => ({ x: d.keep[0], y: d.keep[1] })),
		W = [],
		dry = (x, y, r, from) =>
			keeps.every((k) => hyp(x - k.x, y - k.y) >= CLEAR + r) &&
			Math.min(Math.abs(x - MID), Math.abs(y - MID)) >= r + WATER.gap &&
			hyp(x - MID, y - MID) >= r + LAKE0.r + WATER.shore &&
			W.every((q) => q === from || hyp(x - q.x, y - q.y) >= r + q.r + WATER.gap);
	const n = WATER.lakes[0] + Math.floor(rng() * (WATER.lakes[1] - WATER.lakes[0] + 1));
	for (let i = 0; i < n; i++) {
		const r = lakeSize(rng());
		for (let t = 0; t < 60; t++) {
			const x = rnd(r, MAP - r),
				y = rnd(r, MAP - r);
			if (!dry(x, y, r)) continue;
			W.push({ x, y, r });
			break;
		}
	}
	for (const L of W.slice()) {
		const w = WATER.w * L.r,
			toX = Math.min(L.x, MAP - L.x) < Math.min(L.y, MAP - L.y);
		for (const ax of [toX, !toX]) {
			const C = makeRiver(L, w, ax);
			if (!C || !C.every((p) => dry(p.x, p.y, w, L))) continue;
			W.push(...C);
			break;
		}
	}
	return W;
}
// The dense forest, laid out for each corner on its own (local: keep at 0,0, the middle at CORNER, CORNER).
// Trees on a 26-unit lattice where an organic field runs high, thicker away from home; clear round the Town Center, the lakes, every find,
// stop and camp, along the trade lanes, and along three winding paths: to each neighbour's nearest stop and to the great lake. Anything left
// cut off is joined to home by a straight cut (openWays, on the walking grid). About 375 trees a corner.
const FOREST = { step: 26, trees: 375, path: 18, cut: 30, lane: 45, edge: 15, clear: { stop: 80, camp: 90, lode: 60 } }; // clear round the Town Center: CLEAR (06); edge: no tree nearer the map's edge; clear: round each shared place; cut: half the width of a cut home (openWays): open ground three squares wide between trees that fill three
function makeForest(spot, loc, near) {
	const ph = [0, 1, 2, 3].map(() => rnd(0, 6.28)),
		field = (x, y) =>
			Math.sin(x * 0.011 + ph[0]) +
			Math.sin(y * 0.013 + ph[1]) +
			Math.sin((x + y) * 0.007 + ph[2]) +
			Math.sin((x - y) * 0.009 + ph[3]) +
			Math.max(0, hyp(x, y) - 450) * 0.004;
	const keepOut = [
		{ x: 0, y: 0, r: CLEAR },
		{ x: CORNER, y: CORNER, r: LAKE0.r + 40 },
		...loc.map((l) => ({ x: l.x, y: l.y, r: l.r + 35 })),
		...Object.entries(spot).map(([id, s]) => ({
			x: s.x,
			y: s.y,
			r: id.startsWith('grove') ? 0 : id.startsWith('bush') ? 45 : 70,
		})),
		...Object.entries(near).flatMap(([k, L]) => L.map((l) => ({ ...l, r: FOREST.clear[k] }))), // the shared places on this corner's two middle lines
	];
	const out = [0, 1].map((ax) =>
		near.stop.filter((l) => Math.abs((ax ? l.x : l.y) - CORNER) < 1).reduce((a, l) => (hyp(l.x, l.y) < hyp(a.x, a.y) ? l : a)),
	); // the stop nearest home on each middle line: a neighbour's way
	const camp = PLACES.camp - (MID - CORNER), // the trade lanes run in from the robbers' camp
		lane = (x, y) => (y > CORNER - FOREST.lane && x > camp) || (x > CORNER - FOREST.lane && y > camp);
	const wind = (a, b) => {
		const pts = [a];
		for (let i = 1; i < 4; i++) {
			const t = i / 4,
				nx = -(b.y - a.y),
				ny = b.x - a.x,
				l = hyp(nx, ny) || 1,
				w = rnd(-70, 70);
			pts.push({ x: a.x + (b.x - a.x) * t + (nx / l) * w, y: a.y + (b.y - a.y) * t + (ny / l) * w });
		}
		pts.push(b);
		return pts;
	};
	const paths = [
		wind({ x: 0, y: 0 }, out[1]),
		wind({ x: 0, y: 0 }, out[0]),
		wind({ x: 0, y: 0 }, { x: CORNER - LAKE0.r / Math.SQRT2, y: CORNER - LAKE0.r / Math.SQRT2 }), // to the great lake's shore
	];
	const onPath = (x, y, P, r) => P.some((pts) => pts.some((p, i) => i && segGap(x, y, pts[i - 1], p) < r));
	// the runway: finds along each path, beside it, so going out pays as you go (berries and stone toward one neighbour, gold and iron toward the other, berries and iron toward the lake)
	const along = (pts, f) => {
		const i = Math.min(pts.length - 2, Math.floor(f * (pts.length - 1))),
			t = f * (pts.length - 1) - i,
			a = pts[i],
			b = pts[i + 1],
			nx = -(b.y - a.y),
			ny = b.x - a.x,
			l = hyp(nx, ny) || 1;
		return { x: a.x + (b.x - a.x) * t + (nx / l) * 36, y: a.y + (b.y - a.y) * t + (ny / l) * 36 };
	};
	const held = [
			{ x: 0, y: 0, r: HOME.clear + HOME.band }, // the home zone
			{ x: CORNER, y: CORNER, r: LAKE0.r },
			...loc,
			...Object.values(spot),
		],
		wet = (p) =>
			Math.min(p.x, p.y) < CORNER - MID + 45 ||
			Math.max(p.x, p.y) > CORNER - 45 ||
			held.some((l) => hyp(p.x - l.x, p.y - l.y) < l.r + 45); // in this corner's quarter, never in or at the edge of a lake, a find or the home zone (QC 05 N5)
	const dep = [
		['bush', 0, 0.45],
		['stone', 0, 0.75],
		['gold', 1, 0.45],
		['iron', 1, 0.75],
		['bush', 2, 0.5],
		['iron', 2, 0.8],
	].map(([kind, pi, f]) => {
		let p = along(paths[pi], f);
		for (let k = 1; k < 8 && wet(p); k++)
			p = along(paths[pi], clamp(f + (k % 2 ? -1 : 1) * Math.ceil(k / 2) * 0.08, 0.2, 0.95)); // slide along the path
		const p0 = p;
		for (let r = SEEK.step; wet(p) && r < MID; r += SEEK.step)
			for (let a = 0, n = Math.ceil((2 * Math.PI * r) / SEEK.step); a < n && wet(p); a++)
				p = { x: p0.x + Math.cos((a / n) * 2 * Math.PI) * r, y: p0.y + Math.sin((a / n) * 2 * Math.PI) * r }; // then outward from it, ring by ring: every corner gets every deposit
		held.push({ ...p, r: 0 });
		return { kind, ...p };
	});
	keepOut.push(...dep.map((d) => ({ x: d.x, y: d.y, r: 45 })));
	let T = [];
	const x0 = CORNER - MID + FOREST.edge;
	for (let y = x0; y < CORNER; y += FOREST.step)
		for (let x = x0; x < CORNER; x += FOREST.step) {
			const tx = x + rnd(-6, 6),
				ty = y + rnd(-6, 6);
			if (keepOut.some((q) => hyp(q.x - tx, q.y - ty) < q.r) || lane(tx, ty) || onPath(tx, ty, paths, FOREST.path))
				continue;
			T.push({ x: tx, y: ty, f: field(tx, ty) });
		}
	T.sort((a, b) => b.f - a.f);
	T = T.slice(0, FOREST.trees);
	return { trees: T, dep };
}
// A river (Build 50): a lake drains to the map edge, to the left or right one (toX) or the top or bottom one, as a chain of small round pools
// that overlap (the water and the walking grid are made of circles already). Where the chain breaks there is a ford: two, about a third and two thirds down.
// A river is water like any lake: nobody walks or builds on it; it is crossed at a ford, and fished and docked like a lake.
function makeRiver(L, w, toX) {
	const E = toX ? { x: L.x < MID ? 0 : MAP, y: L.y + rnd(-60, 60) } : { x: L.x + rnd(-60, 60), y: L.y < MID ? 0 : MAP },
		dx = E.x - L.x,
		dy = E.y - L.y,
		len = hyp(dx, dy),
		ux = dx / len,
		uy = dy / len,
		S = { x: L.x + ux * L.r * 0.8, y: L.y + uy * L.r * 0.8 },
		ph = rnd(0, 6.28),
		at = (t) => {
			const m = Math.sin(Math.PI * t) * WATER.bend * Math.sin(t * Math.PI * WATER.waves + ph); // a bend that fades at both ends
			return { x: S.x + (E.x - S.x) * t - uy * m, y: S.y + (E.y - S.y) * t + ux * m };
		};
	const C = [];
	let last = at(0);
	for (let t = 0; t <= 1; t += 0.002) {
		const p = at(t);
		if (hyp(p.x - last.x, p.y - last.y) >= w * WATER.step || !C.length) {
			C.push({ x: p.x, y: p.y, r: w, river: true });
			last = p;
		}
	}
	const h = Math.ceil((WATER.ford / 2 + w) / (WATER.step * w)) - 1, // pools cut each side of a ford's middle: at least WATER.ford of dry ground at any width (one at the old widths, 20 to 26)
		i1 = Math.round(rnd(WATER.ford1[0], WATER.ford1[1]) * (C.length - 1)),
		i2 = Math.round(rnd(WATER.ford2[0], WATER.ford2[1]) * (C.length - 1));
	if (Math.min(i1 - h, i2 - i1 - 2 * h - 1, C.length - 1 - i2 - h) < h + 1) return null; // too short: each run of water at least half a ford, or no river
	return C.filter((_, i) => Math.abs(i - i1) > h && Math.abs(i - i2) > h);
}
// one corner's finds, each at random in its own ring, at any angle, judged by its own nodes (shape: each bush, tree, rock or animal from
// the find's middle): a home find's nearest node in the band and none inside the clearing; any other find's nodes all past the band. Each
// with its room clear of what was laid before and of the water, and inside this corner's quarter of the map (local: keep 0,0, edge at
// CORNER − MID, the middle lines at CORNER). A find that has no room searches outward: its ring widens by a step every few tries, so every
// corner gets every find (equal content; tests/map.py holds it on 100 seeds).
const SEEK = { tries: 50, step: 20, most: 4000 };
function laySpots(lay, loc, spot, shape) {
	const taken = Object.values(spot),
		room = [{ x: CORNER, y: CORNER, r: LAKE0.r + 25 }, ...loc.map((l) => ({ x: l.x, y: l.y, r: l.r + 25 }))], // the great lake, the water in this corner
		lo = CORNER - MID,
		b0 = HOME.clear,
		b1 = HOME.clear + HOME.band;
	for (const [id, r0, r1, clr] of lay) {
		const S = shape[id],
			ext = Math.max(...S.map(([ox, oy]) => hyp(ox, oy))),
			home = HOME_IDS.has(id);
		for (let t = 0; t < SEEK.most; t++) {
			const a = rnd(-Math.PI, Math.PI),
				d = rnd(r0, r1 + ext + Math.floor(t / SEEK.tries) * SEEK.step),
				x = Math.cos(a) * d,
				y = Math.sin(a) * d,
				near = Math.min(...S.map(([ox, oy]) => hyp(x + ox, y + oy)));
			if (home ? near < b0 || near > b1 : near < b1) continue;
			if (Math.min(x, y) - clr < lo || Math.max(x, y) + clr > CORNER) continue;
			if (taken.some((q) => hyp(q.x - x, q.y - y) < q.r + clr) || room.some((q) => hyp(q.x - x, q.y - y) < q.r + clr))
				continue;
			spot[id] = { x, y, r: clr };
			taken.push(spot[id]);
			break;
		}
	}
	return spot;
}
// The map in five layers (Albert, Build 63), on the base rules (CLEAR and HOME in 06), laid once from the seed:
//   1 home: the home zone round each Town Center (decision 5a): the same clearing, the same five finds at random in the same band, the same radius;
//   2 ground: the lakes and rivers, at random over the whole map and never in a clear radius (makeWater), so laid first;
//   3 wild: the finds beyond the pocket, the forest, the deposits in it;
//   4 movables: the game, the boar, the finds that walk or are carried off (chest, ruins, den, cemetery, vagabonds);
//   5 weather: the first sky, rolled from the season's chain (in newGame, once the economy stands).
// Fair is not mirror: each corner is its own roll of the same element, and the land between is random (Build 70: no measure, no reshuffle).
// Decision 5a: equal content, not equal distances; every find outside the zone is rolled for each corner on its own.
const HOME_IDS = new Set(['bushP', 'groveP', 'stoneP', 'goldP', 'ironP']),
	MOVE_IDS = new Set(['deerA', 'deerB', 'boar', 'chest', 'ruins', 'den', 'cemetery', 'vagabonds']);
function makeMap() {
	const N = G.nodes;
	// this game's land: its character, how far its rings stretch (Build 39: every map felt the same)
	G.land = LANDK[Math.floor(rng() * LANDK.length)];
	const Ld = LAND[G.land],
		k = rnd(SPREAD[0], SPREAD[1]),
		out = HOME.clear + HOME.band; // every find but the home five lies wholly outside the band
	const lay = (Ld.extra ? [...LAYOUT, ['extra', 240, 380, 30]] : LAYOUT).map(([id, r0, r1, clr]) => {
		if (HOME_IDS.has(id)) return [id, r0, r1, clr];
		const lo = Math.min(560, r0 * k),
			hi = Math.min(640, r1 * k),
			up = Math.max(0, out - lo);
		return [id, lo + up, hi + up, clr];
	}); // stretched, never past the old outer ring, then moved out to start at the band's edge (laySpots keeps every node past it)
	const layHome = lay.filter(([id]) => HOME_IDS.has(id)),
		layWild = lay.filter(([id]) => !HOME_IDS.has(id) && !MOVE_IDS.has(id)),
		layMove = lay.filter(([id]) => MOVE_IDS.has(id));
	G.lakes = [{ ...LAKE0 }, ...makeWater()]; // 2 ground
	const woods = []; // [side, tree]: the forest and wild groves, what a cut home may clear
	for (const p of G.P) {
		if (p.id === WILD) continue;
		const [kx, ky] = p.keep,
			sx = kx < MID ? 1 : -1,
			sy = ky < MID ? 1 : -1,
			at = (dx, dy) => [kx + dx * sx, ky + dy * sy],
			loc = G.lakes
				.slice(1)
				.map((L) => ({ x: (L.x - kx) * sx, y: (L.y - ky) * sy, r: L.r }))
				.filter((l) => l.x < CORNER && l.y < CORNER); // the water in this corner, in its own frame
		// every find's shape first (its nodes from its middle), so it is laid by its nodes
		const lattice = (n, cols, gap) =>
				Array.from({ length: n }, (_, i) => [
					((i % cols) - (cols - 1) / 2) * gap + rnd(-4, 4),
					(Math.floor(i / cols) - (Math.ceil(n / cols) - 1) / 2) * gap + rnd(-4, 4),
				]),
			scatter = (n, r) => Array.from({ length: n }, () => [rnd(-r, r), rnd(-r, r)]),
			shape = {
				bushP: SHAPE.bushes.slice(0, 5),
				groveP: lattice(12, 4, 22),
				stoneP: SHAPE.pair,
				goldP: SHAPE.pair,
				ironP: SHAPE.pair,
				bushA: SHAPE.bushes,
				bushB: SHAPE.bushes,
				groveA: lattice(20, 5, 22),
				groveB: lattice(14, 5, 20),
				stone: SHAPE.pair,
				gold: SHAPE.pair,
				extra: Ld.extra === 'bush' ? SHAPE.bushes : SHAPE.pair,
				bushFar: scatter(6, 24),
				deerA: scatter(4, 20),
				deerB: scatter(4, 20),
				...Object.fromEntries(['boar', 'chest', 'ruins', 'den', 'cemetery', 'vagabonds'].map((id) => [id, [[0, 0]]])),
			};
		// 1 home
		const spot = laySpots(layHome, loc, {}, shape),
			P = (id, [dx, dy]) => at(spot[id].x + dx, spot[id].y + dy),
			bunch = (id, kind, amt) => {
				if (spot[id]) for (const o of shape[id]) N.push(node(kind, kind === 'bush' ? 'food' : kind === 'tree' ? 'wood' : kind, ...P(id, o), amt));
			};
		bunch('bushP', 'bush', 180 * RICH * HOME.rich); // the home zone: enough to start on
		bunch('groveP', 'tree', 120 * RICH * HOME.rich);
		for (const kind of ['stone', 'gold', 'iron']) bunch(kind + 'P', kind, 300 * RICH * HOME.rich);
		G.blds.push(mkBld(p.id, 'keep', kx, ky, 1));
		// 3 wild (the movables' spots are rolled here too, before the forest, so it leaves them their clearings; they are placed in 4)
		laySpots(layWild, loc, spot, shape);
		laySpots(layMove, loc, spot, shape);
		const toLoc = ([X, Y]) => ({ x: (X - kx) * sx, y: (Y - ky) * sy }),
			mine = (L) => L.map(toLoc).filter((l) => l.x <= CORNER && l.y <= CORNER),
			near = { stop: mine(ROUTES.flat()), camp: mine(cross(MID - PLACES.camp)), lode: mine(cross(PLACES.lode)) };
		const { trees: forest, dep } = makeForest(spot, loc, near);
		bunch('bushA', 'bush', 180 * RICH);
		bunch('bushB', 'bush', 180 * RICH);
		const w0 = N.length;
		bunch('groveA', 'tree', 120 * RICH);
		bunch('groveB', 'tree', 120 * RICH);
		for (const t of N.slice(w0)) woods.push([p.id, t]); // a wild grove may be cut through too: it stands in the forest
		bunch('stone', 'stone', 350 * RICH);
		bunch('gold', 'gold', 350 * RICH);
		if (Ld.extra) bunch('extra', Ld.extra, (Ld.extra === 'bush' ? 180 : 350) * RICH); // the land's specialty, once more
		bunch('bushFar', 'bush', 180 * RICH);
		for (const t of forest) woods.push([p.id, N[N.push(node('tree', 'wood', ...at(t.x, t.y), 60 * RICH)) - 1]]); // a forest tree: half a grove tree's wood, so a way can be cut through
		for (const d of dep) {
			if (d.kind === 'bush')
				for (const [ox, oy] of SHAPE.bushes.slice(0, 4))
					N.push(node('bush', 'food', ...at(d.x + ox, d.y + oy), 180 * RICH));
			else for (const [ox, oy] of SHAPE.pair) N.push(node(d.kind, d.kind, ...at(d.x + ox, d.y + oy), 300 * RICH));
		}
		// 4 movables
		const f = towardMid({ x: kx, y: ky }, PLACES.start);
		for (let i = 0; i < 3; i++) {
			const v = addUnit(p.id, 'vil', f.x + (i - 1) * 14, f.y + 6);
			v.job = i === 1 ? 'wood' : 'food';
		}
		const sc = towardMid({ x: kx, y: ky }, 60);
		addUnit(p.id, 'scout', sc.x, sc.y);
		// the wild near home: two herds of game, and danger a little farther out
		for (const id of ['deerA', 'deerB'].filter((id) => spot[id])) for (const o of shape[id]) wildAt('deer', ...P(id, o));
		if (spot.boar) wildAt('boar', ...P('boar', [0, 0]));
		for (const id of ['chest', 'ruins', 'den', 'cemetery', 'vagabonds'].filter((id) => spot[id])) addFind(id, ...P(id, [0, 0]));
	}
	// shared ground: a robbers' camp at the middle of each map edge, at the end of a trade route; gold and stone near the great lake
	for (const [x, y] of cross(MID - PLACES.camp)) addFind('camp', x, y);
	for (const [x, y] of cross(PLACES.lode)) {
		const ux = Math.sign(x - MID),
			uy = Math.sign(y - MID),
			at = (a, o) => [x + uy * a + ux * o, y + ux * a + uy * o]; // a: across its middle line, o: out from the middle; the same for both corners beside it
		N.push(
			node('gold', 'gold', ...at(-12, 0), 500 * RICH),
			node('gold', 'gold', ...at(12, 0), 500 * RICH),
			node('iron', 'iron', ...at(0, 20), 500 * RICH),
			node('stone', 'stone', ...at(0, -16), 400 * RICH),
		);
	}
	G.lakes.forEach((L, i) => {
		if (L.river) {
			if (i % WATER.fish === 0) N.push(node('fish', 'food', L.x, L.y, 350 * RICH));
			return;
		} // a river is fished at every few pools, in mid-stream
		const n = Math.round(L.r / 10);
		for (let a = 0; a < n; a++) {
			const ang = (a / n) * Math.PI * 2;
			const fx = L.x + Math.cos(ang) * (L.r - 8),
				fy = L.y + Math.sin(ang) * (L.r - 8);
			if (!onLand(fx, fy)) N.push(node('fish', 'food', fx, fy, 350 * RICH)); // fish swim in water: none on the great lake's causeways (B15)
		}
	});
	for (const n of N) {
		const m = Ld.amt[n.type] || 1;
		if (m !== 1) {
			n.amt *= m;
			n.max *= m;
		}
	} // what the land is rich and poor in
	makeCitadel();
	openWays(woods);
}
// Nothing may be walled in (B4): every find and every bush, rock and lode in a corner's quarter of the map is reached from its Town Center
// on the real walking grid (navRebuild: trees, buildings, the slit and clearance rules); one cut off gets a cut home through that
// corner's forest along the way with the fewest trees, round water (wayHome); what stands on a middle line counts for both corners beside
// it (inQuarter). It was judged on a grid of its own, which missed what the walking grid shuts (19 bushes, a gold and two ruins in 30 seeds, QC 05).
function openWays(woods) {
	const ways = [];
	for (let o = 0; o < WILD; o++) {
		const k = keepOf(o);
		for (const q of [...G.nodes.filter((n) => n.kind !== 'tree' && n.kind !== 'fish' && !n.farm), ...G.finds])
			if (inQuarter(q, k) && q.kind !== 'shrine') ways.push({ o, k, g: q }); // the shrine is reached through the gates, in the Throne
	}
	const near = (q, C, id) => {
		const cx = Math.floor(q.x / NAVC),
			cy = Math.floor(q.y / NAVC);
		let best = 0;
		for (let j = -2; j <= 2; j++)
			for (let i = -2; i <= 2; i++) {
				const x = cx + i,
					y = cy + j,
					c = x >= 0 && y >= 0 && x < NC && y < NC ? C[y * NC + x] : 0;
				if (c && (id ? c === id : NAV.size[c] > NAV.size[best])) best = c;
			}
		return best;
	}; // the largest region with a square within two of q, or q's way into region id
	for (let pass = 0; pass < 12; pass++) {
		navRebuild();
		const C = NAV.comp,
			cut = new Set();
		for (const w of ways) {
			const home = near(towardMid(w.k, PLACES.start), C); // where the first villagers stand
			if (near(w.g, C, home)) continue;
			const P = wayHome(w.g, C, home);
			for (const [o, t] of woods) if (o === w.o && P.some((q) => hyp(q.x - t.x, q.y - t.y) < FOREST.cut)) cut.add(t);
		}
		if (!cut.size) return;
		G.nodes = G.nodes.filter((n) => !cut.has(n));
		woods = woods.filter(([, t]) => !cut.has(t));
	}
}
// The way home for a find cut off (openWays): the fewest shut squares between it and its home region, never across water (a 0-1 search
// on the walking grid: open ground costs nothing, a square shut by trees or the clearance rule one). Returns the way's points, a square apart.
function wayHome(g, C, home) {
	const n = NC * NC,
		cost = new Int32Array(n).fill(-1),
		from = new Int32Array(n).fill(-1),
		Q = new Int32Array(2 * n);
	let h = n,
		t = n,
		end = -1;
	const s = gcell(g.x, g.y);
	cost[s] = 0;
	Q[t++] = s;
	while (h < t) {
		const c = Q[h++];
		if (C[c] === home) {
			end = c;
			break;
		}
		const x = c % NC;
		for (const d of [x > 0 ? c - 1 : -1, x < NC - 1 ? c + 1 : -1, c - NC, c + NC]) {
			if (d < 0 || d >= n || NAV.lake[d]) continue;
			const w = cost[c] + (NAV.solid[d] ? 1 : 0);
			if (cost[d] >= 0 && cost[d] <= w) continue;
			cost[d] = w;
			from[d] = c;
			if (w === cost[c]) Q[--h] = d;
			else Q[t++] = d;
		}
	}
	const P = [];
	for (let c = end; c >= 0; c = from[c]) P.push({ x: (c % NC) * NAVC + NAVC / 2, y: Math.floor(c / NC) * NAVC + NAVC / 2 });
	return P;
}
// in the quarter of the map whose Town Center is k: what stands on a middle line (a stop, a camp, a lode) is in both quarters beside it
const inQuarter = (q, k) => (k.x < MID ? q.x <= MID : q.x >= MID) && (k.y < MID ? q.y <= MID : q.y >= MID);
// how far a point stands from the segment a to b
const segGap = (x, y, a, b) => {
	const dx = b.x - a.x,
		dy = b.y - a.y,
		t = clamp(((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
	return hyp(x - a.x - dx * t, y - a.y - dy * t);
};
// The Throne: a walled citadel on the great lake's island, four gates at the four causeways, a tower at each corner of the ring, the one
// shrine in the Throne itself, the Natives' garrison in its yard. A base rule (Build 70): the Throne stands at the middle, the same distance
// from every Town Center (CORNER in 01); everything of the citadel is the same seen from every corner (Albert, Nov 1: four towers, the
// shrine on the Throne's square; tests/map.py turns each piece a quarter round the Throne and looks for its twin).
function makeCitadel() {
	const c = MID / NAVC,
		E = THRONE.r / NAVC - 0.5, // the ring's squares, in squares from the middle: their centres at ±0.5 to ±E, the same on every side
		put = (kind, x, y) => {
			const b = mkBld(WILD, kind, x, y, 1);
			b.citadel = true;
			G.blds.push(b);
			return b;
		};
	const T = put('throne', MID, MID);
	for (const [sx, sy] of [
		[-1, -1],
		[1, -1],
		[1, 1],
		[-1, 1],
	])
		put('tower', MID + sx * (THRONE.r - NAVC), MID + sy * (THRONE.r - NAVC)); // a tower on each corner of the ring, its two squares by the corner its own
	for (let i = -E; i <= E; i++)
		for (let j = -E; j <= E; j++) {
			if (Math.max(Math.abs(i), Math.abs(j)) !== E || Math.min(Math.abs(i), Math.abs(j)) >= E - 1) continue; // the ring, but not under a tower
			put(Math.min(Math.abs(i), Math.abs(j)) === 0.5 ? 'gate' : 'wall', (c + i) * NAVC, (c + j) * NAVC); // a gate: the two middle squares of a side
		} // symmetric about the Throne (QC 05 N1: it was laid on squares about MID + 5, so two gates stood 10 nearer the Throne than the others)
	addFind('shrine', MID, MID); // in the Throne: taken by a priest at its foot (FINDS.shrine.r)
	for (let i = 0; i < NATIVE.garrison; i++) natSpawn(T, i % 3 === 2 ? 'nativebow' : 'native');
	G.throne = null;
	G.prisoners = [];
	natState();
	layTraps();
}
function wildAt(kind, x, y, find) {
	const u = addUnit(WILD, kind, x, y);
	u.hx = x;
	u.hy = y;
	if (find) u.find = find.id;
	return u;
}
function addFind(kind, x, y) {
	const F = FINDS[kind],
		f = { id: NID++, kind, x, y, owner: null, cap: null, done: false, guards: [] };
	if (F.guard) {
		const [real, fan, n] = F.guard,
			gk = G.fantasy ? fan : real;
		for (let i = 0; i < n; i++) {
			const a = (i / n) * 6.28 + rnd(0, 1);
			f.guards.push(wildAt(gk, x + Math.cos(a) * 26, y + Math.sin(a) * 26, f).id);
		}
	}
	if (F.hire) for (let i = 0; i < F.hire.n; i++) wildAt('vagabond', x + (i - 1) * 12, y + 14, f);
	G.finds.push(f);
	return f;
}
function mkBld(owner, kind, x, y, prog) {
	const sp = snapPos(kind, x, y),
		B = BLD[kind];
	const b = { id: NID++, owner, kind, x: sp.x, y: sp.y, gx: sp.gx, gy: sp.gy, prog, hp: 0, cd: 0, q: [] };
	b.hp = prog >= 1 ? maxHpB(owner, kind) : maxHpB(owner, kind) * 0.1;
	if (prog >= 1) b.mx = b.hp; // the full health it was made with: research that moves it moves the health with it (B7)
	if (B.sheep) b.sheep = B.sheep;
	if (B.crop) {
		const r = 'reserve' in B ? B.reserve : Infinity,
			mk = B.makes && B.makes[B.crop];
		b.node = {
			id: NID++,
			kind: 'farm',
			type: B.crop,
			rate: mk ? mk.rate : B.rate,
			x: b.x,
			y: b.y,
			amt: r,
			max: r || Infinity,
			farm: b,
			worker: null,
		};
		G.nodes.push(b.node);
	}
	return b;
}
function addUnit(owner, kind, x, y) {
	const U = UNIT[kind];
	const u = {
		id: NID++,
		owner,
		kind,
		x,
		y,
		hp: 1,
		max: 1,
		cd: 0,
		carry: 0,
		carryType: null,
		job: null,
		node: null,
		state: 'home',
		px: 0,
		py: 0,
		ox: rnd(-30, 30),
		oy: rnd(-30, 30),
		target: null,
		idleT: 0,
		fx: 1,
		fy: 0,
		bornT: G.t,
		mor: 1,
		st: { got: 0, trips: 0, walk: 0, kills: 0, built: 0 },
	}; // mor: nerve   // st: a life's tally, for its card
	u.max = u.hp = owner === WILD ? U.hp : maxHpU(owner, kind);
	G.units.push(u);
	return u;
}
