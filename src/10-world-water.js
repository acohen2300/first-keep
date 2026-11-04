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
			if (i % WATER.fish === 0) N.push(node('fish', 'food', L.x, L.y, 350 * RICH));
			return;
		}
		const n = Math.round(L.r / 10);
		shoreWalk(L, -8, n, (fx, fy) => {
			if (!onLand(worldXY(fx, fy).x, worldXY(fx, fy).y)) N.push(node('fish', 'food', fx, fy, 350 * RICH)); // onLand reads the world's frame (preview 51)
		});
	});
}
