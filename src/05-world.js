// ═════ 05-world.js ═════
// ───────────────────────── The world ─────────────────────────
let G;
function blankGame(seed) {
	return {
		t: 0,
		tick: 0,
		speed: G ? G.speed : 1,
		over: null,
		seed,
		rs: seed,
		units: [],
		blds: [],
		nodes: [],
		finds: [],
		tracers: [],
		log: [],
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
		hold: Array(BNS + 1).fill(0),
		stance: Array(BNS + 1).fill(0),
		bnPlan: BN.map(() => ({})),
		form: BN.map(() => 0),
		bnEdit: 0,
		qs: { from: 'all', n: {} },
		intel: {},
		fantasy: SET.fantasy,
		mode: SET.mode,
		diff: SET.diff,
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
		ground: { mud: 0, snow: 0, ice: 0 },
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
		ai: { t: 1 + i * 0.3, lastHelp: 0, cyc: 0 },
		gathered: 0,
		spent: 0,
		flow: {},
		rate: {},
		score: { people: 0, army: 0, tech: 0, bld: 0, wealth: 0, total: 0 },
		fxc: null,
		uc: {},
	};
}
function newGame(seed, carry) {
	seed = seed === undefined ? (Math.random() * 2 ** 31) | 0 : seed;
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
	G.hz = seed === todaySeed() ? { ...TODAY_HZ } : { ...(SET.hz || HZ_DEFAULT) }; // today's challenge: the day's seed and the day's hazards
	makeMap();
	initEconomy();
	makeBg();
	navRebuild();
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
	} else say(`${LAND[G.land].name}. Gather, grow, explore.`, '', 8);
}
const inBox = (p, r) => p.x >= r.x0 && p.x <= r.x1 && p.y >= r.y0 && p.y <= r.y1;
const node = (kind, type, x, y, amt) => ({ id: NID++, kind, type, x, y, amt, max: amt });
// One corner is laid out at random, then copied (mirrored) to all four, so every side is equal and no two games are alike.
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
	// what, nearest, farthest from the keep, room it needs; the last two (an angle range) put the home pocket in the corner behind the Town Center, away from every neighbour
	['bushP', 80, 140, 38, -2.9, -1.75],
	['groveP', 110, 190, 56, -2.9, -1.75],
	['stoneP', 120, 190, 24, -2.9, -1.75],
	['goldP', 140, 200, 24, -2.9, -1.75],
	['ironP', 150, 210, 24, -2.9, -1.75],
	['bushA', 90, 125, 38],
	['groveA', 150, 230, 72],
	['bushB', 135, 190, 38],
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
function makeLakes() {
	// the great lake, and one more for each corner (same size, same place in each)
	const local = [];
	for (let t = 0; t < 80 && !local.length; t++) {
		const a = rnd(0.2, 1.37),
			d = rnd(430, 580),
			r = rnd(85, 120),
			x = Math.cos(a) * d,
			y = Math.sin(a) * d;
		if (x + r + 70 > 700 || y + r + 70 > 700) continue; // a wide lane along the middle lines
		if (hyp(x - 700, y - 700) < r + LAKE0.r + 110) continue; // and between it and the great lake
		local.push({ x, y, r });
	}
	if (!local.length) local.push({ x: 430, y: 330, r: 90 });
	return local;
}
// The dense forest, laid out for one corner and mirrored to all four like everything else (local: keep at 0,0, the middle at 700,700).
// Trees on a 26-unit lattice where an organic field runs high, thicker away from home; clear round the Town Center, the lakes, every find,
// stop and camp, along the trade lanes, and along three winding paths: to each neighbour's nearest stop and to the great lake. Anything left
// cut off is joined to home by a straight cut. About 375 trees a corner.
const FOREST = { step: 26, trees: 375, home: 360, path: 18, lane: 45 };
function makeForest(spot, loc) {
	const ph = [0, 1, 2, 3].map(() => rnd(0, 6.28)),
		field = (x, y) =>
			Math.sin(x * 0.011 + ph[0]) +
			Math.sin(y * 0.013 + ph[1]) +
			Math.sin((x + y) * 0.007 + ph[2]) +
			Math.sin((x - y) * 0.009 + ph[3]) +
			Math.max(0, hyp(x, y) - 450) * 0.004;
	const keepOut = [
		{ x: 0, y: 0, r: FOREST.home },
		{ x: 700, y: 700, r: LAKE0.r + 40 },
		...loc.map((l) => ({ x: l.x, y: l.y, r: l.r + 35 })),
		...Object.entries(spot).map(([id, s]) => ({
			x: s.x,
			y: s.y,
			r: id.startsWith('grove') ? 0 : id.startsWith('bush') ? 45 : 70,
		})),
		...[
			[210, 700],
			[380, 700],
			[700, 210],
			[700, 380],
		].map(([x, y]) => ({ x, y, r: 80 })),
		{ x: -140, y: 700, r: 90 },
		{ x: 700, y: -140, r: 90 },
		{ x: 700, y: 430, r: 60 },
		{ x: 430, y: 700, r: 60 },
		{ x: 516, y: 516, r: 60 },
	];
	const lane = (x, y) =>
		(y > 700 - FOREST.lane && x > -160 && x < 560) || (x > 700 - FOREST.lane && y > -160 && y < 560);
	const segGap = (x, y, a, b) => {
		const dx = b.x - a.x,
			dy = b.y - a.y,
			t = clamp(((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
		return hyp(x - a.x - dx * t, y - a.y - dy * t);
	};
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
		wind({ x: 0, y: 0 }, { x: 700, y: 210 }),
		wind({ x: 0, y: 0 }, { x: 210, y: 700 }),
		wind({ x: 0, y: 0 }, { x: 570, y: 570 }),
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
	const wet = (p) => [{ x: 700, y: 700, r: LAKE0.r }, ...loc].some((l) => hyp(p.x - l.x, p.y - l.y) < l.r + 45); // never in or at the edge of a lake: slide along the path until dry
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
			p = along(paths[pi], clamp(f + (k % 2 ? -1 : 1) * Math.ceil(k / 2) * 0.08, 0.2, 0.95));
		return { kind, ...p };
	});
	keepOut.push(...dep.map((d) => ({ x: d.x, y: d.y, r: 45 })));
	let T = [];
	for (let y = -290; y < 690; y += FOREST.step)
		for (let x = -290; x < 690; x += FOREST.step) {
			const tx = x + rnd(-6, 6),
				ty = y + rnd(-6, 6);
			if (keepOut.some((q) => hyp(q.x - tx, q.y - ty) < q.r) || lane(tx, ty) || onPath(tx, ty, paths, FOREST.path))
				continue;
			T.push({ x: tx, y: ty, f: field(tx, ty) });
		}
	T.sort((a, b) => b.f - a.f);
	T = T.slice(0, FOREST.trees);
	// nothing may be walled in: join to home anything the trees cut off
	const W = 100,
		cell = (x, y) => clamp(Math.floor((y + 300) / 10), 0, W - 1) * W + clamp(Math.floor((x + 300) / 10), 0, W - 1);
	const reach = () => {
		const solid = new Uint8Array(W * W),
			seen = new Uint8Array(W * W);
		for (const l of [{ x: 700, y: 700, r: LAKE0.r }, ...loc])
			for (let c = 0; c < W * W; c++) {
				const x = (c % W) * 10 - 295,
					y = Math.floor(c / W) * 10 - 295;
				if (hyp(x - l.x, y - l.y) < l.r) solid[c] = 1;
			}
		for (const t of T)
			for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) solid[cell(t.x + i * 10, t.y + j * 10)] = 1;
		const Q = [cell(0, 30)];
		seen[Q[0]] = 1;
		for (let h = 0; h < Q.length; h++) {
			const c = Q[h],
				x = c % W;
			for (const n of [x > 0 ? c - 1 : -1, x < W - 1 ? c + 1 : -1, c - W, c + W])
				if (n >= 0 && n < W * W && !seen[n] && !solid[n]) {
					seen[n] = 1;
					Q.push(n);
				}
		}
		return seen;
	};
	const goals = [
		...Object.values(spot),
		...dep,
		...[
			[210, 700],
			[380, 700],
			[700, 210],
			[700, 380],
			[-140, 700],
			[700, -140],
			[700, 430],
			[430, 700],
			[516, 516],
		].map(([x, y]) => ({ x, y })),
	];
	for (let pass = 0; pass < 12; pass++) {
		const seen = reach(),
			g = goals.find((q) => !seen[cell(q.x, q.y)]);
		if (!g) break;
		T = T.filter((t) => segGap(t.x, t.y, g, { x: 0, y: 0 }) > FOREST.path);
	}
	return { trees: T, dep };
}
function makeMap() {
	const N = G.nodes,
		loc = makeLakes(),
		taken = [],
		spot = {};
	const sh = (hyp(700, 700) - LAKE0.r - 90) / Math.SQRT2,
		room = [
			{ x: 700, y: 700, r: LAKE0.r + 25 },
			{ x: sh, y: sh, r: 50 },
			...loc.map((l) => ({ x: l.x, y: l.y, r: l.r + 25 })),
		]; // the great lake, this corner's shrine on its shore, the corner's lakes
	// this game's land: its character, how far its rings stretch, which way its home pocket turns (Build 39: every map felt the same)
	G.land = LANDK[Math.floor(rng() * LANDK.length)];
	const Ld = LAND[G.land],
		k = rnd(SPREAD[0], SPREAD[1]),
		turn = rnd(-TURN, TURN);
	const lay = LAYOUT.map(([id, r0, r1, clr, a0, a1]) => [
		id,
		Math.min(560, r0 * (a0 === undefined ? k : 1)),
		Math.min(640, r1 * (a0 === undefined ? k : 1)),
		clr,
		a0 === undefined ? a0 : a0 + turn,
		a1 === undefined ? a1 : a1 + turn,
	]); // stretched, never past the old outer ring
	if (Ld.extra) lay.push(['extra', 240, 380, 30]);
	for (const [id, r0, r1, clr, a0, a1] of lay) {
		let best = null;
		for (let t = 0; t < 300 && !best; t++) {
			// 150 tries as set; then 150 more with the ring widened and the room halved, before any fallback
			const loose = t >= 150,
				w = loose ? 0.25 : 0,
				a = a0 === undefined ? rnd(-Math.PI, Math.PI) : rnd(a0 - w, a1 + w),
				d = rnd(r0 * (loose ? 0.85 : 1), r1 * (loose ? 1.15 : 1)),
				x = Math.cos(a) * d,
				y = Math.sin(a) * d,
				c = loose ? clr / 2 : clr;
			if (x < -190 || y < -190 || x > 640 || y > 640) continue;
			if (taken.some((q) => hyp(q.x - x, q.y - y) < q.r + c) || room.some((q) => hyp(q.x - x, q.y - y) < q.r + c))
				continue;
			best = { x, y };
		}
		const am = a0 === undefined ? Math.PI / 4 : (a0 + a1) / 2,
			dm = ((r0 + r1) / 2) * 0.7; // the fallback: the middle of its own range, turned with the home pocket
		spot[id] = best || { x: Math.cos(am) * dm, y: Math.sin(am) * dm };
		taken.push({ x: spot[id].x, y: spot[id].y, r: clr });
	}
	const { trees: forest, dep } = makeForest(spot, loc);
	G.lakes = [{ ...LAKE0 }];
	for (const p of G.P) {
		if (p.id === WILD) continue;
		const [kx, ky] = p.keep,
			sx = kx < MID ? 1 : -1,
			sy = ky < MID ? 1 : -1,
			at = (dx, dy) => [kx + dx * sx, ky + dy * sy];
		for (const l of loc) {
			const [x, y] = at(l.x, l.y);
			G.lakes.push({ x, y, r: l.r });
		}
		const c = (id) => at(spot[id].x, spot[id].y),
			P = (id, [dx, dy]) => at(spot[id].x + dx, spot[id].y + dy);
		for (const id of ['bushA', 'bushB'])
			for (const o of SHAPE.bushes) N.push(node('bush', 'food', ...P(id, o), 180 * RICH));
		for (let i = 0; i < 20; i++)
			N.push(
				node(
					'tree',
					'wood',
					...P('groveA', [((i % 5) - 2) * 22 + rnd(-4, 4), (Math.floor(i / 5) - 1.5) * 22 + rnd(-4, 4)]),
					120 * RICH,
				),
			);
		for (let i = 0; i < 14; i++)
			N.push(
				node(
					'tree',
					'wood',
					...P('groveB', [((i % 5) - 2) * 20 + rnd(-4, 4), (Math.floor(i / 5) - 1) * 20 + rnd(-4, 4)]),
					120 * RICH,
				),
			);
		for (const o of SHAPE.bushes.slice(0, 5)) N.push(node('bush', 'food', ...P('bushP', o), 180 * RICH)); // the home pocket: enough to start on, far from every neighbour
		for (let i = 0; i < 12; i++)
			N.push(
				node(
					'tree',
					'wood',
					...P('groveP', [((i % 4) - 1.5) * 22 + rnd(-4, 4), (Math.floor(i / 4) - 1) * 22 + rnd(-4, 4)]),
					120 * RICH,
				),
			);
		for (const [id, kind] of [
			['stoneP', 'stone'],
			['goldP', 'gold'],
			['ironP', 'iron'],
		])
			for (const o of SHAPE.pair) N.push(node(kind, kind, ...P(id, o), 300 * RICH));
		for (const o of SHAPE.pair) N.push(node('stone', 'stone', ...P('stone', o), 350 * RICH));
		for (const o of SHAPE.pair) N.push(node('gold', 'gold', ...P('gold', o), 350 * RICH));
		if (Ld.extra === 'bush') for (const o of SHAPE.bushes) N.push(node('bush', 'food', ...P('extra', o), 180 * RICH));
		else if (Ld.extra) for (const o of SHAPE.pair) N.push(node(Ld.extra, Ld.extra, ...P('extra', o), 350 * RICH)); // the land's specialty, once more
		for (let i = 0; i < 6; i++) N.push(node('bush', 'food', ...P('bushFar', [rnd(-24, 24), rnd(-24, 24)]), 180 * RICH));
		for (const t of forest) N.push(node('tree', 'wood', ...at(t.x, t.y), 60 * RICH));
		for (const d of dep) {
			if (d.kind === 'bush')
				for (const [ox, oy] of SHAPE.bushes.slice(0, 4))
					N.push(node('bush', 'food', ...at(d.x + ox, d.y + oy), 180 * RICH));
			else for (const [ox, oy] of SHAPE.pair) N.push(node(d.kind, d.kind, ...at(d.x + ox, d.y + oy), 300 * RICH));
		} // a forest tree: half a grove tree's wood, so a way can be cut through
		G.blds.push(mkBld(p.id, 'keep', kx, ky, 1));
		const f = towardMid({ x: kx, y: ky }, 40);
		for (let i = 0; i < 3; i++) {
			const v = addUnit(p.id, 'vil', f.x + (i - 1) * 14, f.y + 6);
			v.job = i === 1 ? 'wood' : 'food';
		}
		const sc = towardMid({ x: kx, y: ky }, 60);
		addUnit(p.id, 'scout', sc.x, sc.y);
		// the wild near home: two herds of game, and danger a little farther out
		for (const id of ['deerA', 'deerB'])
			for (let i = 0; i < 4; i++) wildAt('deer', ...P(id, [rnd(-20, 20), rnd(-20, 20)]));
		wildAt('boar', ...c('boar'));
		for (const id of ['chest', 'ruins', 'den', 'cemetery', 'vagabonds']) addFind(id, ...c(id));
	}
	// shared ground: a robbers' camp at the middle of each map edge, at the end of a trade route; gold and stone near the great lake
	for (const [x, y] of [
		[MID, 160],
		[MID, MAP - 160],
		[160, MID],
		[MAP - 160, MID],
	])
		addFind('camp', x, y);
	for (const [x, y] of [
		[MID, MID - 270],
		[MID, MID + 270],
		[MID - 270, MID],
		[MID + 270, MID],
	])
		N.push(
			node('gold', 'gold', x - 12, y, 500 * RICH),
			node('gold', 'gold', x + 12, y + 6, 500 * RICH),
			node('iron', 'iron', x - 2, y + 20, 500 * RICH),
			node('stone', 'stone', x + 4, y - 16, 400 * RICH),
		);
	for (const L of G.lakes) {
		const n = Math.round(L.r / 10);
		for (let a = 0; a < n; a++) {
			const ang = (a / n) * Math.PI * 2;
			N.push(node('fish', 'food', L.x + Math.cos(ang) * (L.r - 8), L.y + Math.sin(ang) * (L.r - 8), 350 * RICH));
		}
	}
	for (const n of N) {
		const m = Ld.amt[n.type] || 1;
		if (m !== 1) {
			n.amt *= m;
			n.max *= m;
		}
	} // what the land is rich and poor in
	makeCitadel();
}
// The Throne: a walled citadel on the great lake's island, four gates at the four causeways, a tower at each corner, the one shrine at its foot, the Natives' garrison in its yard
function makeCitadel() {
	const c = Math.floor(MID / NAVC),
		R = THRONE.r / NAVC,
		put = (kind, x, y) => {
			const b = mkBld(WILD, kind, x, y, 1);
			b.citadel = true;
			G.blds.push(b);
			return b;
		};
	const T = put('throne', MID, MID);
	for (let gx = c - R; gx <= c + R; gx++)
		for (let gy = c - R; gy <= c + R; gy++) {
			if (Math.max(Math.abs(gx - c), Math.abs(gy - c)) !== R) continue;
			const corner = Math.abs(gx - c) === R && Math.abs(gy - c) === R,
				gate = (gx === c && Math.abs(gy - c) === R) || (gy === c && Math.abs(gx - c) === R);
			if (corner) continue;
			put(gate ? 'gate' : 'wall', gx * NAVC + 5, gy * NAVC + 5);
		}
	for (const [sx, sy] of [
		[-1, -1],
		[1, 1],
	])
		put('tower', MID + sx * (THRONE.r - 5), MID + sy * (THRONE.r - 5)); // two towers: a citadel that can be broken by a real army, not an ambush
	addFind('shrine', MID - 52, MID + 46);
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
