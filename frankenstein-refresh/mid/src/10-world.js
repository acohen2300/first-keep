// ═════ 10-world.js: a game, its players, and the map laid in layers (10-world-ground, -water, -forest, -plots, -movers, -citadel) ═════
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
		keep: (() => {
			const l = landXY(d.keep[0], d.keep[1]);
			return [l.x, l.y];
		})(), // in the land's frame while the map is laid; turnLand puts it in the world's (where PLAYERS names it)
		civ,
		res: { ...START_RES },
		goods: Object.fromEntries(GOODK.map((k) => [k, 0])),
		ventures: [],
		hungry: false,
		lord: null,
		tax: 'fair',
		unrest: 0,
		loyal: 0,
		war: 0, // the War crown: the cost value of enemy people and buildings destroyed (N6)
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
		ab: (SET.ab && SET.ab[i]) || 'A', // the A/B test of the computers (tests/ab.py; AB in 17-ai): A as shipped, B without the handicap and with greed raids and choke claims
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
	const woods = makeMap();
	turnLand(); // the land, laid square, turned into the world (preview 51)
	openWays(woods); // nothing walled in, judged on the world's walking grid
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
	// EXCEPTIONS #16 (LIVE TEST IN PROCESS): each computer's handicap, built beside its Town Center by the placing rules (HANDICAP in 06)
	G.kills = G.P.map(() => G.P.map(() => 0)); // who killed whose, side by side (16-sim-fight hurt; tests/ab.py reads it)
	for (let o = 1; o < WILD; o++)
		for (const kind of HANDICAP.blds) {
			if (G.P[o].ab === 'B') break; // the B side of the test plays without the handicap
			const k = keepOf(o),
				s = k && findSpot(o, kind, k.x, k.y, HANDICAP.r[0], HANDICAP.r[1]);
			if (!s) continue;
			G.blds.push(mkBld(o, kind, s.x, s.y, 1));
			navRebuild();
		}
	makeBg();
	for (const b of G.blds) if (!G.fogOn || friendly(0, b.owner)) wearGround(b);
	dangerMap(); // a fresh danger map: the last game's must not steer the first second of this one
	evmSet();
	const k = G.P[0].keep;
	cam.x = k[0] + 70;
	cam.y = k[1] + 70; // a little toward the middle of the screen's height in the turned view (x + y is down): the Town Center sits just above centre (preview 50)
	cam.z = ZOOM_START;
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
			TOAST.long,
			null,
			null,
			drawn.join(', ') || 'none',
		); // which ones in its why: the mail shows it
	} else news('land', `${LAND[G.land].name}. Gather, grow, explore.`, '', TOAST.long);
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
	news('realm', `${SCEN_TEXT[id][0]}: ${SCEN_TEXT[id][1]}`, 'soft', TOAST.long);
}
const inBox = (p, r) => p.x >= r.x0 && p.x <= r.x1 && p.y >= r.y0 && p.y <= r.y1;
const node = (kind, type, x, y, amt) => ({ id: NID++, kind, type, x, y, amt, max: amt });
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
