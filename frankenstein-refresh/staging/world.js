// ═════ 10-world-citadel.js: the Throne, its ring, the island and the causeways ═════
// The Throne: a walled citadel on the great lake's island, four gates at the four causeways, a tower at each corner of the ring, the one
// shrine in the Throne itself, the Natives' garrison in its yard. A base rule (Build 70): the Throne stands at the middle, the same distance
// from every Town Center (CORNER in 01); everything of the citadel is the same seen from every corner (Albert, Nov 1: four towers, the
// shrine on the Throne's square; tests/map.py turns each piece a quarter round the Throne and looks for its twin).
function makeCitadel() {
	const c = LMID / NAVC,
		E = THRONE.r / NAVC - 0.5, // the ring's squares, in squares from the middle: their centres at ±0.5 to ±E, the same on every side
		put = (kind, x, y) => {
			const b = mkBld(WILD, kind, x, y, 1);
			b.citadel = true;
			G.blds.push(b);
			return b;
		};
	const T = put('throne', LMID, LMID);
	for (const [sx, sy] of [
		[-1, -1],
		[1, -1],
		[1, 1],
		[-1, 1],
	])
		put('tower', LMID + sx * (THRONE.r - NAVC), LMID + sy * (THRONE.r - NAVC)); // a tower on each corner of the ring, its two squares by the corner its own
	for (let i = -E; i <= E; i++)
		for (let j = -E; j <= E; j++) {
			if (Math.max(Math.abs(i), Math.abs(j)) !== E || Math.min(Math.abs(i), Math.abs(j)) >= E - 1) continue; // the ring, but not under a tower
			put(Math.min(Math.abs(i), Math.abs(j)) === 0.5 ? 'gate' : 'wall', (c + i) * NAVC, (c + j) * NAVC); // a gate: the two middle squares of a side
		} // symmetric about the Throne (QC 05 N1: it was laid on squares about LMID + 5, so two gates stood 10 nearer the Throne than the others)
	addFind('shrine', LMID, LMID); // in the Throne: taken by a priest at its foot (FINDS.shrine.r)
	for (let i = 0; i < NATIVE.garrison; i++) natSpawn(T, i % 3 === 2 ? 'nativebow' : 'native');
	G.throne = null;
	G.prisoners = [];
	natState();
	layTraps();
}
// ═════ 10-world-forest.js: layer 3, Forest: the trees, the paths through them, and the deposits along the paths ═════
// The dense forest, laid out for each corner on its own (local: keep at 0,0, the middle at CORNER, CORNER). Trees on a FOREST.step lattice
// where an organic field runs high, thicker away from home; clear round the Town Center, the water, every find, stop and camp, along the
// trade lanes, and along three winding paths: to each neighbour's nearest stop and to the great lake. Anything left cut off is joined to home
// by a straight cut (openWays, on the walking grid). About FOREST.trees a corner. The forest reads the taken list (10-world-ground): what the
// plots and movers claimed before it (their spots), so it leaves them their clearings.
const FOREST = { step: 26, trees: 375, path: 34, cut: 30, lane: 45, edge: 40 }; // edge: no tree nearer the land's edge; cut: half the width of a cut home (openWays): open ground three squares wide between trees that fill three; lane: the trade lanes' half width
// One tree (preview 52; it was five rules in five files): it fills the 3 × 3 walking squares round it (block); its crown is drawn r wide and its
// floor an ellipse (paint); its size follows what is left of it (grow), a tree 1.4 times a bush's; a tree with deep or more standing neighbours
// on the lattice is deep forest: no shadow, the canopy covers it. The forest picture (far zoom, the small map) draws the crown in two rings.
const TREE = { block: 1, crown: [15, 11], floor: [17, 12], wide: 1.4, deep: 6 };
const nodeScale = (n) => (0.6 + 0.4 * Math.min(1, n.amt / n.max)) * (n.kind === 'tree' ? TREE.wide : 1); // how big a node is drawn: what is left of it
const findRoom = (id) => ROOM.tree[id.startsWith('grove') ? 'grove' : id.startsWith('bush') ? 'bush' : 'find'];
function makeForest(taken) {
	const ph = [0, 1, 2, 3].map(() => rnd(0, 6.28)),
		field = (x, y) =>
			Math.sin(x * 0.011 + ph[0]) +
			Math.sin(y * 0.013 + ph[1]) +
			Math.sin((x + y) * 0.007 + ph[2]) +
			Math.sin((x - y) * 0.009 + ph[3]) +
			Math.max(0, hyp(x, y) - 450) * 0.004;
	// no tree within its room of anything taken: a lake by its true shore (the fix), the rest by ROOM.tree
	const treeHeld = (x, y) =>
		taken.some((t) =>
			t.L
				? takenGap(t, x, y) < ROOM.tree.lake
				: hyp(t.x - x, t.y - y) < (t.k === 'find' ? findRoom(t.id) : t.k === 'home' || t.k === 'lake0' ? t.r + ROOM.tree[t.k] : ROOM.tree[t.k]),
		);
	const out = [0, 1].map((ax) =>
		taken
			.filter((l) => l.k === 'stop' && Math.abs((ax ? l.x : l.y) - CORNER) < KEEP_OFF + 2) // a keep stands a little off the land's diagonal (KEEP_OFF, 01)
			.reduce((a, l) => (hyp(l.x, l.y) < hyp(a.x, a.y) ? l : a)),
	); // the stop nearest home on each middle line: a neighbour's way
	const camp = PLACES.camp - (LMID - CORNER), // the trade lanes run in from the robbers' camp
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
	// a deposit keeps ROOM.dep from the quarter's edges, from everything held (the home zones, the water by its shore, the finds, the deposits
	// before it) and from the corner's notch (QC 05 N5); the shared places on the middle lines are not held against it
	const wet = (p) =>
		!inQuarterL(p.x, p.y, ROOM.dep) ||
		taken.some((t) => t.k !== 'stop' && t.k !== 'camp' && t.k !== 'lode' && takenGap(t, p.x, p.y) < ROOM.dep) ||
		(p.x <= ROOM.dep && p.y <= ROOM.dep && hyp(p.x, p.y) < LMID - CORNER + ROOM.dep);
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
		for (let r = SEEK.step; wet(p) && r < LMID; r += SEEK.step)
			for (let a = 0, n = Math.ceil((2 * Math.PI * r) / SEEK.step); a < n && wet(p); a++)
				p = { x: p0.x + Math.cos((a / n) * 2 * Math.PI) * r, y: p0.y + Math.sin((a / n) * 2 * Math.PI) * r }; // then outward from it, ring by ring: every corner gets every deposit
		taken.push({ ...p, r: 0, k: 'dep' });
		return { kind, ...p };
	});
	let T = [];
	const x0 = CORNER - LMID + FOREST.edge;
	for (let y = x0; y < CORNER; y += FOREST.step)
		for (let x = x0; x < CORNER; x += FOREST.step) {
			const tx = x + rnd(-6, 6),
				ty = y + rnd(-6, 6);
			if (treeHeld(tx, ty) || lane(tx, ty) || onPath(tx, ty, paths, FOREST.path)) continue;
			T.push({ x: tx, y: ty, f: field(tx, ty) });
		}
	T.sort((a, b) => b.f - a.f);
	T = T.slice(0, FOREST.trees);
	return { trees: T, dep };
}
// how far a point stands from the segment a to b
const segGap = (x, y, a, b) => {
	const dx = b.x - a.x,
		dy = b.y - a.y,
		t = clamp(((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
	return hyp(x - a.x - dx * t, y - a.y - dy * t);
};
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
			const home = near(doorOf(w.k), C); // where the first villagers stand: the keep's door
			if (near(w.g, C, home)) continue;
			const P = wayHome(w.g, C, home);
			for (const [o, t] of woods) if (o === w.o && P.some((q) => dist(q, t) < FOREST.cut)) cut.add(t);
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
	for (let c = end; c >= 0; c = from[c])
		P.push({ x: (c % NC) * NAVC + NAVC / 2, y: Math.floor(c / NC) * NAVC + NAVC / 2 });
	return P;
}
// the deep forest: a tree with TREE.deep or more standing neighbours on the lattice; its shadow would lie under the canopy, so none is drawn
let DEEP = { v: -1, G: null, set: null };
function deepTrees() {
	if (DEEP.G === G && DEEP.v === G.treeV) return DEEP.set;
	const cell = new Map(),
		k = (x, y) => `${Math.round(x / FOREST.step)},${Math.round(y / FOREST.step)}`;
	for (const n of G.nodes) if (n.kind === 'tree' && n.amt > 0) cell.set(k(n.x, n.y), (cell.get(k(n.x, n.y)) || 0) + 1);
	const deep = new Set();
	for (const n of G.nodes)
		if (n.kind === 'tree' && n.amt > 0) {
			const cx = Math.round(n.x / FOREST.step),
				cy = Math.round(n.y / FOREST.step);
			let m = 0;
			for (let dy = -1; dy <= 1; dy++)
				for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && cell.get(`${cx + dx},${cy + dy}`)) m++;
			if (m >= TREE.deep) deep.add(n.id);
		}
	DEEP = { v: G.treeV, G, set: deep };
	return deep;
}
// ═════ 10-world-ground.js: layer 1, Ground: the land's square, its corners, the turn into the world, and the taken list ═════
// The land is laid square (SQUARE a side, LMID its middle; 01) with a home in each corner, then turned −45° into the world (turnLand). Each
// corner is laid in its own frame: the keep at (0, 0), x and y growing toward the middle, the corner's quarter the box QUARTER (preview 52).
// ───────────────────────── A corner's quarter ─────────────────────────
const QUARTER = { lo: CORNER - LMID, hi: CORNER }; // in the corner's frame: from the land's edge (−327) to its middle lines (753)
const inQuarterL = (x, y, m = 0) => Math.min(x, y) >= QUARTER.lo + m && Math.max(x, y) <= QUARTER.hi - m; // m: a margin kept from its edges
// in the quarter of the map whose Town Center is k, read in the world: what stands on a middle line (a stop, a camp, a lode) is in both quarters beside it
const inQuarter = (q, k) => {
	const lq = landXY(q.x, q.y),
		lk = landXY(k.x, k.y),
		e = 0.01; // the corner's quarter of the land, read in the world (preview 51)
	return (lk.x < LMID ? lq.x <= LMID + e : lq.x >= LMID - e) && (lk.y < LMID ? lq.y <= LMID + e : lq.y >= LMID - e);
};
// ───────────────────────── The taken list ─────────────────────────
// Everything already laid in a corner is one list, taken (preview 52; it was four: taken, room, keepOut and held, each with its own copy of the
// lakes and margins). An entry is a place, a radius and what it is; ROOM says how near each later thing may come to each kind. The numbers
// are the old ones, unchanged: a find keeps 25 past a lake's edge; a tree 35 past a lake, 40 past the great lake, 45 from a bush find, 70 from
// any other, none from a grove (it stands in the forest), 80 from a stop, 90 from a camp, 60 from a lode, 45 from a deposit; a deposit 45 from
// everything. A lake's edge is its true shore (lakeRAt), not its radius: that is the fix.
const ROOM = {
	find: { lake0: 25, lake: 25 }, // a find's room past the water; from another find, the two finds' own room (laySpots)
	tree: { lake0: 40, lake: 35, home: 0, grove: 0, bush: 45, find: 70, stop: 80, camp: 90, lode: 60, dep: 45 },
	dep: 45, // a deposit, from everything held and from the quarter's edges
};
// the gap from a corner-frame point to a taken entry's edge: a lake's by its shore, the rest by radius
const takenGap = (t, x, y) => {
	if (t.L) {
		const X = t.kx + x * t.sx,
			Y = t.ky + y * t.sy; // back in the land's frame, where the lake's harmonics are drawn
		return hyp(X - t.L.x, Y - t.L.y) - lakeRAt(t.L, Math.atan2(Y - t.L.y, X - t.L.x));
	}
	return hyp(t.x - x, t.y - y) - t.r;
};
// ───────────────────────── The turn (preview 51) ─────────────────────────
// Everything the map-maker laid in the land's frame goes to the world's. A point turns by worldXY; a lake's shore harmonics turn with it (a land
// angle is the world angle plus 45°, so ph becomes ph + k·45°); a building is snapped to the world's squares again, so its footprint sits on
// them; a field's node follows its building. The keeps' coordinates too, and the start camera reads them after. The map-maker itself never
// knows: every rule it has is a distance or a ring, the same in both frames.
function turnLand() {
	const at = (e) => {
		const w = worldXY(e.x, e.y);
		e.x = w.x;
		e.y = w.y;
	};
	for (const n of G.nodes) if (!n.farm) at(n);
	for (const f of G.finds) at(f);
	for (const L of G.lakes) {
		at(L);
		if (L.w) for (const h of L.w) h[2] += h[0] * TA; // cos(k·a + ph) in the land's frame is cos(k·a_w + ph + k·angle) in the world's (a = a_w + angle)
	}
	for (const b of G.blds) {
		const w = worldXY(b.x, b.y),
			sp = snapPos(b.kind, w.x, w.y);
		b.x = sp.x;
		b.y = sp.y;
		b.gx = sp.gx;
		b.gy = sp.gy;
		if (b.node) {
			b.node.x = b.x;
			b.node.y = b.y;
		}
	}
	const PAIRS = [
		['x', 'y'],
		['px', 'py'],
		['hx', 'hy'],
		['hax', 'hay'],
		['kx', 'ky'],
	];
	for (const u of G.units) {
		for (const [a, b] of PAIRS)
			if (typeof u[a] === 'number' && typeof u[b] === 'number' && (a === 'x' || u[a] || u[b])) {
				const w = worldXY(u[a], u[b]);
				u[a] = w.x;
				u[b] = w.y;
			}
		for (const key of ['grazeAt', 'post', 'fpos', 'anchor']) if (u[key] && typeof u[key].x === 'number') at(u[key]);
		if (Array.isArray(u.route)) for (const q of u.route) at(q);
	}
	for (const p of G.P) {
		const w = worldXY(p.keep[0], p.keep[1]);
		p.keep = [w.x, w.y];
	}
	lakeFor = null; // the lakes moved: the water grid is laid again at the next rebuild
	navOffLand(); // the squares outside the land are solid for good
}
// off the land: the world's squares whose middle lies outside the turned land are solid, the same in every rebuild (block)
function navOffLand() {
	NAV.off = new Uint8Array(NC * NC);
	for (let gy = 0; gy < NC; gy++) for (let gx = 0; gx < NC; gx++) if (!inLand(gx * NAVC + 5, gy * NAVC + 5)) NAV.off[gy * NC + gx] = 1;
}
// ═════ 10-world-movers.js: layer 5, Movers: the first people, the game, the boar, the finds that walk or are carried off, the camps ═════
// Their spots were claimed before the forest (laySpots in makeMap, so the trees leave them their clearings); here they are placed in them.
function layMovers(p, kx, ky, spot, shape, P) {
	const kw = snapPos('keep', worldXY(kx, ky).x, worldXY(kx, ky).y), // where the keep will stand once turned and snapped (turnLand)
		dw = doorOf(kw),
		f = landXY(dw.x, dw.y); // the keep's door, found in the world (where the footprint is a square) and laid in the land's frame
	for (let i = 0; i < START_VILS; i++) {
		const v = addUnit(p.id, 'vil', f.x + (i - (START_VILS - 1) / 2) * 14, f.y + 6);
		v.job = i === 1 ? 'wood' : 'food';
	}
	const sc = towardMid({ x: kx, y: ky }, 60, LMID);
	addUnit(p.id, 'scout', sc.x, sc.y);
	// the wild near home: two herds of game, and danger a little farther out
	for (const id of ['deerA', 'deerB'].filter((id) => spot[id])) for (const o of shape[id]) wildAt('deer', ...P(id)(...o));
	if (spot.boar) wildAt('boar', ...P('boar')(0, 0));
	for (const id of ['chest', 'ruins', 'den', 'cemetery', 'vagabonds'].filter((id) => spot[id])) addFind(id, ...P(id)(0, 0));
}
// a robbers' camp at the middle of each map edge, at the end of a trade route
function layCamps() {
	for (const [x, y] of cross(LMID - PLACES.camp)) addFind('camp', x, y);
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
		// places on its two middle lines (a keep stands a little off the diagonal, KEEP_OFF: the quarter read that much wider); then what is laid
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
			].flatMap(([k, L]) => L.map(toLoc).filter((l) => inQuarterL(l.x, l.y, -(KEEP_OFF + 2))).map((l) => ({ ...l, r: 0, k }))),
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
		const m = fixed.has(n) ? 1 : (Ld.amt[n.type] || 1) * (FIND_SIZE[n.kind] || 1); // zone 1 is Bronze's cost, worked out: left as it is
		if (m !== 1) {
			n.amt *= m;
			n.max *= m;
		}
	} // what the land is rich and poor in
	makeCitadel();
	return woods; // openWays runs once the land is turned into the world: the walking grid is the world's (preview 51)
}
// ═════ 10-world-water.js: layer 2, Water: the great lake, the lakes, the rivers and their fords, the fish ═════
// One shore (preview 52, Albert's layers): a lake's edge has one shape, lakeRAt, and one reach in flood, lakeRTo; every reader of the water
// (the map-maker's keep-outs, the walking grid, the ground picture, the flood, the ripples, the fish) walks the same shore by shoreWalk. Before
// this the shore was traced three times (72, 72 and 48 points), the flood's rise added in three places, and the map-maker kept trees out of
// lakes as if they were circles while the grid used the true shore: 20 trees stood in water over 20 seeds.
// The rules (WATER, LAKE0) live in 06 and 01; this file is the layer: lay (makeWater, makeRiver, layFish), block (lakeGrid), and the shape.
// ───────────────────────── The shape ─────────────────────────
const SHORE = 5; // squares from water that count as its shore
let lakeFor = null,
	lakeHi = false; // the lakes the grid was drawn for, and whether in flood
const inFlood = () => G.flood > G.t,
	floodRise = () => (inFlood() ? EVENTS.flood.rise : 0); // the one place the flood's rise is added to a shore
const lakeR = (L) => L.r + floodRise(); // a lake's radius in flood
// the shore at an angle from the lake's middle: the radius with its harmonics (WATER; lakeShape); a round pool has none; never under half its radius
const lakeRAt = (L, a) => (L.w ? L.r * Math.max(0.5, 1 + L.w.reduce((s, [k, amp, ph]) => s + amp * Math.cos(k * a + ph), 0)) : L.r);
const lakeRTo = (L, x, y) => lakeRAt(L, Math.atan2(y - L.y, x - L.x)) + floodRise(); // the shore toward a point, in flood too
// the shore walked once round, n points at extra beyond the water's edge: fn(x, y, r, a) at each; the one tracer (the grid's radius, the ground
// picture, the flood, a lake's shoreline development all read it)
const shoreWalk = (L, extra, n, fn) => {
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2,
			r = lakeRAt(L, a) + extra;
		fn(L.x + Math.cos(a) * r, L.y + Math.sin(a) * r, r, a);
	}
};
const shorePath = (c, L, extra = 0, n = 72) => {
	c.beginPath();
	shoreWalk(L, extra, n, (x, y, r, a) => c[a ? 'lineTo' : 'moveTo'](x, y));
	c.closePath();
}; // a lake's outline on a canvas, in world units
// how far a point stands from the nearest lake's edge (negative: in it); the Throne's island and causeways are land
const onLand = (x, y) => {
	const l = landXY(x, y); // the causeways run on the land's middle lines (preview 51)
	return ((Math.abs(l.x - LMID) < THRONE.cause / 2 || Math.abs(l.y - LMID) < THRONE.cause / 2) && hyp(x - MID, y - MID) < THRONE.causeTo) || hyp(x - MID, y - MID) < THRONE.isle;
};
const lakeGap = (x, y) => (onLand(x, y) ? 1e9 : G.lakes.reduce((m, L) => Math.min(m, hyp(x - L.x, y - L.y) - lakeRTo(L, x, y)), 1e9));
// ───────────────────────── Block: the water on the walking grid ─────────────────────────
// lake cells: 1 water, 2 flood water only, which a side with levees wades
function lakeGrid() {
	NAV.lake.fill(0);
	for (const L of G.lakes) {
		const R = Math.ceil((lakeR(L) * (L.rmax || 1) + 2) / NAVC) + 1, // out to the farthest shore (lakeShape's rmax)
			cx = Math.floor(L.x / NAVC),
			cy = Math.floor(L.y / NAVC); // only the squares round each lake (Build 50: a river is many small pools)
		for (let y = Math.max(0, cy - R); y <= Math.min(NC - 1, cy + R); y++)
			for (let x = Math.max(0, cx - R); x <= Math.min(NC - 1, cx + R); x++) {
				const px = x * NAVC + 5,
					py = y * NAVC + 5,
					d = hyp(px - L.x, py - L.y);
				if (d < lakeRTo(L, px, py) + 2 && !onLand(px, py)) {
					const c = y * NC + x;
					if (NAV.lake[c] !== 1) NAV.lake[c] = d < lakeRAt(L, Math.atan2(py - L.y, px - L.x)) + 2 ? 1 : 2; // deep water stays deep where pools overlap
				}
			}
	}
	NAV.shore.fill(0);
	for (let y = 0; y < NC; y++)
		for (let x = 0; x < NC; x++)
			if (NAV.lake[y * NC + x])
				for (let j = -SHORE; j <= SHORE; j++)
					for (let i = -SHORE; i <= SHORE; i++) {
						const X = x + i,
							Y = y + j;
						if (X >= 0 && Y >= 0 && X < NC && Y < NC) NAV.shore[Y * NC + X] = 1;
					} // the ground by water: mud pools here first (Build 54)
	lakeFor = G.lakes;
	lakeHi = inFlood();
}
// ───────────────────────── Lay: the lakes and rivers, in the land's frame ─────────────────────────
// Lakes at random over the whole map, never within a clear radius, by a middle line, at the great lake's shore or against other water (WATER);
// a lake with no room left is not laid. Each drains to its nearer map edge, else the other, by a river on the same rules, or keeps none when it
// finds no way or is too short for its two fords.
// lakeSize: the power law cut to WATER.r and inverted, u from 0 to 1 giving the smallest to the largest: r = r0 (1 − u (1 − (r0/r1)^2c))^(−1/2c).
const lakeSize = (u) => WATER.r[0] * (1 - u * (1 - (WATER.r[0] / WATER.r[1]) ** (2 * WATER.c))) ** (-1 / (2 * WATER.c));
// a lake's shore (WATER.amp, H, harm): the harmonics drawn by the map's own dice, so one seed is one shore; a river's pools stay round
function lakeShape(L) {
	for (let t = 0; t < 12; t++) {
		lakeHarm(L);
		if (L.dl >= WATER.shore[0] && L.dl <= WATER.shore[1]) break; // drawn again until it is a lake with a bay or two, never a circle, never wild
	}
	return L;
}
function lakeHarm(L) {
	L.w = [];
	for (let k = 2; k <= WATER.harm; k++) L.w.push([k, WATER.amp * k ** -WATER.H * (rng() < 0.5 ? -1 : 1) * (0.6 + 0.4 * rng()), rng() * Math.PI * 2]);
	let P = 0,
		A = 0,
		px = L.x + lakeRAt(L, 0),
		py = L.y,
		x0 = px,
		y0 = py;
	L.rmax = 1;
	shoreWalk(L, 0, 72, (x, y, r, a) => {
		L.rmax = Math.max(L.rmax, r / L.r);
		if (!a) return;
		P += hyp(x - px, y - py);
		A += ((px - L.x) * (y - L.y) - (x - L.x) * (py - L.y)) / 2;
		px = x;
		py = y;
	});
	P += hyp(x0 - px, y0 - py);
	A += ((px - L.x) * (y0 - L.y) - (x0 - L.x) * (py - L.y)) / 2; // closed back to the first point
	L.dl = P / (2 * Math.sqrt(Math.PI * Math.abs(A))); // the shoreline development: 1 is a circle
	return L;
}
function makeWater() {
	const keeps = PLAYERS.slice(0, WILD).map((d) => landXY(d.keep[0], d.keep[1])),
		W = [],
		dry = (x, y, r, from) =>
			keeps.every((k) => hyp(x - k.x, y - k.y) >= CLEAR + r) &&
			Math.min(Math.abs(x - LMID), Math.abs(y - LMID)) >= r + WATER.gap &&
			hyp(x - LMID, y - LMID) >= r + LAKE0.r + WATER.clear &&
			W.every((q) => q === from || hyp(x - q.x, y - q.y) >= r + q.r + WATER.gap);
	const n = WATER.lakes[0] + Math.floor(rng() * (WATER.lakes[1] - WATER.lakes[0] + 1));
	for (let i = 0; i < n; i++) {
		const r = lakeSize(rng());
		for (let t = 0; t < 60; t++) {
			const x = rnd(r, SQUARE - r),
				y = rnd(r, SQUARE - r);
			if (!dry(x, y, r)) continue;
			W.push(lakeShape({ x, y, r }));
			break;
		}
	}
	for (const L of W.slice()) {
		const w = WATER.w * L.r,
			toX = Math.min(L.x, SQUARE - L.x) < Math.min(L.y, SQUARE - L.y);
		for (const ax of [toX, !toX]) {
			const C = makeRiver(L, w, ax);
			if (!C || !C.every((p) => dry(p.x, p.y, w, L))) continue;
			for (const p of C) p.src = W.indexOf(L) + 1; // the lake it leaves, as its place in G.lakes (the great lake is 0)
			W.push(...C);
			break;
		}
	}
	return W;
}
// A river (Build 50): a lake drains to the map edge, to the left or right one (toX) or the top or bottom one, as a chain of small round pools
// that overlap (the water and the walking grid are made of circles already). Where the chain breaks there is a ford: two, about a third and two
// thirds down. A river is water like any lake: nobody walks or builds on it; it is crossed at a ford, and fished and docked like a lake.
// Each pool carries its stretch (run: 0 above the first ford, 1 between, 2 below) so the ground picture draws each stretch as one stream
// without guessing the fords back from the gaps (preview 52).
function makeRiver(L, w, toX) {
	const E = toX ? { x: L.x < LMID ? 0 : SQUARE, y: L.y + rnd(-60, 60) } : { x: L.x + rnd(-60, 60), y: L.y < LMID ? 0 : SQUARE },
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
		if (dist(p, last) >= w * WATER.step || !C.length) {
			C.push({ x: p.x, y: p.y, r: w, river: true });
			last = p;
		}
	}
	const h = Math.ceil((WATER.ford / 2 + w) / (WATER.step * w)) - 1, // pools cut each side of a ford's middle: at least WATER.ford of dry ground at any width (one at the old widths, 20 to 26)
		i1 = Math.round(rnd(WATER.ford1[0], WATER.ford1[1]) * (C.length - 1)),
		i2 = Math.round(rnd(WATER.ford2[0], WATER.ford2[1]) * (C.length - 1));
	if (Math.min(i1 - h, i2 - i1 - 2 * h - 1, C.length - 1 - i2 - h) < h + 1) return null; // too short: each run of water at least half a ford, or no river
	C.forEach((p, i) => (p.run = i < i1 ? 0 : i < i2 ? 1 : 2));
	return C.filter((p, i) => Math.abs(i - i1) > h && Math.abs(i - i2) > h);
}
// the stretches of river, each the pools of one run in order, for the painting
const riverRuns = () => {
	const runs = new Map();
	G.lakes.forEach((L, i) => {
		if (!L.river) return;
		const k = `${L.src}:${L.run}`;
		if (!runs.has(k)) runs.set(k, []);
		runs.get(k).push(L);
	});
	return [...runs.values()];
};
// the fish: a river is fished at every few pools, in mid-stream; a lake round its shore, in the water, none on the great lake's causeways (B15)
function layFish(N) {
	G.lakes.forEach((L, i) => {
		if (L.river) {
			if (i % WATER.fish === 0) N.push(node('fish', 'food', L.x, L.y, FISH.amt * RICH));
			return;
		}
		const n = Math.round(L.r / 10),
			a = Math.round(FISH.amt * RICH * (L.r / FISH.r0)); // I (Nov 4): the spots go with the shore (r), each spot's stock with r too, so a lake's stock goes with its area (r²)
		shoreWalk(L, -8, n, (fx, fy) => {
			if (!onLand(worldXY(fx, fy).x, worldXY(fx, fy).y)) N.push(node('fish', 'food', fx, fy, a)); // onLand reads the world's frame (preview 51)
		});
	});
}
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
