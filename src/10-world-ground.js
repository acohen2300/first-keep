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
