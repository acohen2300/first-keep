// ═════ 10-world-plots.js: layer 4, Plots: the home zones, the finds (bushes, groves, stone, gold, iron), the deposits, the land's richness; and the map laid ═════
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
	// zone 1 (BACK in 06): behind the Town Center, its room worked out from its shape (laySpots)
	['bushH', BACK.near, HOME.clear, 0],
	['groveH', BACK.near, HOME.clear, 0],
	// zone 2 (HOME in 06, D-090): the five home finds, each the same walk in every corner (HOME.at, in the order the ages need them), in a
	// random direction round the front; every other find past the wall band (makeMap)
	['bushP', HOME.at(0), HOME.at(0), 38],
	['groveP', HOME.at(1), HOME.at(1), 56],
	['goldP', HOME.at(2), HOME.at(2), 24],
	['stoneP', HOME.at(3), HOME.at(3), 24],
	['ironP', HOME.at(4), HOME.at(4), 24],
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
const BACK_IDS = new Set(['bushH', 'groveH']),
	HOME_IDS = new Set(['bushP', 'groveP', 'stoneP', 'goldP', 'ironP']),
	MOVE_IDS = new Set(['deerA', 'deerB', 'boar', 'chest', 'ruins', 'den', 'cemetery', 'vagabonds']);
// one corner's finds, each at random in its own ring, judged by its own nodes (shape: each bush, tree, rock or animal from the find's
// middle): a zone 1 find's every node behind the Town Center, from BACK.near to the clearing, BACK.edge in from the map's edge; a home
// find's middle at its own walk (HOME.at), in a random direction, every node inside the clearing; any other find's nodes all past the wall
// band (HOME.out); and no node but zone 1's in zone 1. Each
// with its room clear of what was laid before (the taken list: the finds before it, the water by its shore) and inside this corner's quarter
// of the map. A find that has no room searches outward: its ring widens by a step every few tries, so every corner gets every find (equal
// content; tests/map.py holds it on 100 seeds). Zone 1 never searches outward: it fits, or the test fails.
const SEEK = { tries: 50, step: 20, most: 4000 };
function laySpots(lay, taken, spot, shape) {
	const gap = LANE * NAVC,
		inBack = (x, y) => x <= 0 && y <= 0 && hyp(x, y) <= HOME.clear, // zone 1: between the Town Center and its corner, inside the clearing (D-090)
		held = (x, y, clr) =>
			taken.some((t) =>
				t.k === 'find' ? hyp(t.x - x, t.y - y) < t.r + clr : t.k === 'lake0' ? hyp(t.x - x, t.y - y) < t.r + ROOM.find.lake0 + clr : t.L ? takenGap(t, x, y) < ROOM.find.lake + clr : false,
			); // the finds before it and the water by its true shore (preview 52: by the radius, a bush find stood in a bay on seed 55 of 100; the wild finds of a corner with a lake near them roll again); the home zones are the ring rules above, the shared places stand past the band
	for (const [id, r0, r1, c0] of lay) {
		const S = shape[id],
			ext = Math.max(...S.map(([ox, oy]) => hyp(ox, oy))),
			back = BACK_IDS.has(id),
			home = HOME_IDS.has(id),
			clr = back ? ext + gap / 2 : c0; // zone 1's room: its shape and half a lane, so two finds keep LANE squares between their nodes
		for (let t = 0; t < SEEK.most; t++) {
			const a = back ? rnd(-Math.PI, -Math.PI / 2) : rnd(-Math.PI, Math.PI),
				d = back ? rnd(r0, r1) : home ? r0 : rnd(r0, r1 + ext + Math.floor(t / SEEK.tries) * SEEK.step), // a home find: its walk, the same in every corner
				x = Math.cos(a) * d,
				y = Math.sin(a) * d,
				N = S.map(([ox, oy]) => [x + ox, y + oy]),
				near = Math.min(...N.map(([nx, ny]) => hyp(nx, ny))),
				far = Math.max(...N.map(([nx, ny]) => hyp(nx, ny)));
			if (back) {
				if (!N.every(([nx, ny]) => inBack(nx, ny) && hyp(nx, ny) >= r0 && hyp(nx, ny) <= r1 && Math.min(nx, ny) >= QUARTER.lo + BACK.edge)) continue;
			} else if ((home ? near < BACK.near || far > HOME.clear : near - (MOVE_IDS.has(id) ? c0 : 0) < HOME.out) || N.some(([nx, ny]) => inBack(nx, ny))) continue; // a carried find or game: its own room past the band too (a find keeps a wall off by its box, canPlace)
			if (!inQuarterL(x, y, clr)) continue;
			if (held(x, y, clr)) continue;
			spot[id] = { x, y, r: clr };
			taken.push({ x, y, r: clr, k: 'find', id });
			break;
		}
	}
	return spot;
}
// a cluster of nodes of one kind: the shape's offsets round a middle, each with amt (the one placer; it was bunch, the deposits' loop and the lodes)
const cluster = (N, kind, at, offsets, amt, type = kind === 'bush' ? 'food' : kind === 'tree' ? 'wood' : kind) => {
	for (const [ox, oy] of offsets) N.push(node(kind, type, ...at(ox, oy), amt));
};
// The map in layers (Albert, Build 63 and Nov 4), on the base rules (CLEAR and HOME in 06), laid once from the seed, in the land's frame:
//   1 ground: the land's square and the corners (10-world-ground);
//   2 water: the great lake, the lakes and rivers, at random over the whole map and never in a clear radius (makeWater), so laid first;
//   3 forest: the trees and the paths, round what 4 and 5 claimed (their spots are rolled before it, laid after);
//   4 plots: the home zones (D-090), the finds beyond the pocket, the deposits along the paths, the land's richness;
//   5 movers: the game, the boar, the finds that walk or are carried off (chest, ruins, den, cemetery, vagabonds); the camps (10-world-movers);
//   then the citadel, and the weather (the first sky, in newGame, once the economy stands).
// Fair is not mirror: each corner is its own roll of the same element, and the land between is random (Build 70: no measure, no reshuffle).
// Equal content and, for the home finds, equal walks (D-090); every find past the wall band is rolled for each corner on its own.
function makeMap() {
	const N = G.nodes;
	// this game's land: its character, how far its rings stretch (Build 39: every map felt the same)
	G.land = LANDK[Math.floor(rng() * LANDK.length)];
	const Ld = LAND[G.land],
		k = rnd(SPREAD[0], SPREAD[1]),
		out = HOME.out; // every find but zones 1 and 2 lies wholly past the wall band
	const lay = (Ld.extra ? [...LAYOUT, ['extra', 240, 380, 30]] : LAYOUT).map(([id, r0, r1, clr]) => {
		if (HOME_IDS.has(id) || BACK_IDS.has(id)) return [id, r0, r1, clr];
		const lo = Math.min(560, r0 * k),
			hi = Math.min(640, r1 * k),
			up = Math.max(0, out - lo);
		return [id, lo + up, hi + up, clr];
	}); // stretched, never past the old outer ring, then moved out to start at the band's edge (laySpots keeps every node past it)
	const layHome = lay.filter(([id]) => BACK_IDS.has(id) || HOME_IDS.has(id)), // zone 1 first, then zone 2
		layWild = lay.filter(([id]) => !BACK_IDS.has(id) && !HOME_IDS.has(id) && !MOVE_IDS.has(id)),
		layMove = lay.filter(([id]) => MOVE_IDS.has(id));
	G.lakes = [{ ...LAKE0 }, ...makeWater()]; // 2 water
	const fixed = new Set(), // zone 1's nodes: no land's amt
		woods = []; // [side, tree]: the forest and wild groves, what a cut home may clear
	for (const p of G.P) {
		if (p.id === WILD) continue;
		const [kx, ky] = p.keep,
			sx = kx < LMID ? 1 : -1,
			sy = ky < LMID ? 1 : -1,
			at = (dx, dy) => [kx + dx * sx, ky + dy * sy],
			toLoc = ([X, Y]) => ({ x: (X - kx) * sx, y: (Y - ky) * sy });
		// the taken list of this corner: the home zones and the wall band, the great lake, this corner's water (by its true shore), the shared
		// places on its two middle lines (a keep stands up to 3.5 off the diagonal, KEEP_W: the quarter read 6 wide); then what is laid
		const taken = [
			{ x: 0, y: 0, r: HOME.out, k: 'home' },
			{ x: CORNER, y: CORNER, r: LAKE0.r, k: 'lake0' },
			...G.lakes
				.slice(1)
				.map((L) => ({ ...toLoc([L.x, L.y]), r: L.r, k: 'lake', L, kx, ky, sx, sy }))
				.filter((l) => l.x < CORNER && l.y < CORNER),
			...[
				['stop', ROUTES_L.flat()],
				['camp', cross(LMID - PLACES.camp)],
				['lode', cross(PLACES.lode)],
			].flatMap(([k, L]) => L.map(toLoc).filter((l) => inQuarterL(l.x, l.y, -6)).map((l) => ({ ...l, r: 0, k }))),
		];
		// every find's shape first (its nodes from its middle), so it is laid by its nodes
		const lattice = (n, cols, gap) =>
				Array.from({ length: n }, (_, i) => [
					((i % cols) - (cols - 1) / 2) * gap + rnd(-4, 4),
					(Math.floor(i / cols) - (Math.ceil(n / cols) - 1) / 2) * gap + rnd(-4, 4),
				]),
			scatter = (n, r) => Array.from({ length: n }, () => [rnd(-r, r), rnd(-r, r)]),
			shape = {
				bushH: SHAPE.bushes.slice(0, BACK.bushes),
				groveH: lattice(BACK.trees, Math.ceil(Math.sqrt(BACK.trees)), 22),
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
		// 4 plots, the home zones first
		const spot = laySpots(layHome, taken, {}, shape),
			P = (id) => (ox, oy) => at(spot[id].x + ox, spot[id].y + oy),
			bunch = (id, kind, amt) => {
				if (spot[id]) cluster(N, kind, P(id), shape[id], amt);
			};
		const n0 = N.length;
		bunch('bushH', 'bush', BACK.food / BACK.bushes); // zone 1: Bronze's cost with its margin, on every land the same
		bunch('groveH', 'tree', BACK.wood / BACK.trees);
		for (const n of N.slice(n0)) fixed.add(n);
		bunch('bushP', 'bush', 180 * RICH * HOME.rich); // zone 2: enough to start on
		bunch('groveP', 'tree', 120 * RICH * HOME.rich);
		for (const kind of ['stone', 'gold', 'iron']) bunch(kind + 'P', kind, 300 * RICH * HOME.rich);
		G.blds.push(mkBld(p.id, 'keep', kx, ky, 1));
		// the claims: the wild finds' and the movers' spots are rolled before the forest, so it leaves them their clearings; the movers are placed in 5
		laySpots(layWild, taken, spot, shape);
		laySpots(layMove, taken, spot, shape);
		// 3 forest
		const { trees: forest, dep } = makeForest(taken);
		// 4 plots, the wild finds
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
		for (const d of dep)
			if (d.kind === 'bush') cluster(N, 'bush', (ox, oy) => at(d.x + ox, d.y + oy), SHAPE.bushes.slice(0, 4), 180 * RICH);
			else cluster(N, d.kind, (ox, oy) => at(d.x + ox, d.y + oy), SHAPE.pair, 300 * RICH);
		// 5 movers
		layMovers(p, kx, ky, spot, shape, P);
	}
	layCamps(); // shared ground: a robbers' camp at the middle of each map edge, at the end of a trade route
	for (const [x, y] of cross(PLACES.lode)) {
		// gold and stone near the great lake: the same for both corners beside each lode
		const ux = Math.sign(x - LMID),
			uy = Math.sign(y - LMID),
			at = (a, o) => [x + uy * a + ux * o, y + ux * a + uy * o]; // a: across its middle line, o: out from the middle
		N.push(
			node('gold', 'gold', ...at(-12, 0), 500 * RICH),
			node('gold', 'gold', ...at(12, 0), 500 * RICH),
			node('iron', 'iron', ...at(0, 20), 500 * RICH),
			node('stone', 'stone', ...at(0, -16), 400 * RICH),
		);
	}
	layFish(N); // 2 water: the fish
	for (const n of N) {
		const m = fixed.has(n) ? 1 : Ld.amt[n.type] || 1;
		if (m !== 1) {
			n.amt *= m;
			n.max *= m;
		}
	} // what the land is rich and poor in
	makeCitadel();
	return woods; // openWays runs once the land is turned into the world: the walking grid is the world's (preview 51)
}
