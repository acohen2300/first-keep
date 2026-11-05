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
