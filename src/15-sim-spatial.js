// ═════ 15-sim-spatial.js: who is near what: the unit and building grids ═════
// ───────────────────────── Finding foes, and hitting them ─────────────────────────
// Units are sorted into squares of 48 at the start of each step, so a search looks only at the squares around it.
const UG = 48,
	UGN = Math.ceil(MAP / UG),
	UGH = new Int32Array(UGN * UGN);
let UGX = new Int32Array(1024);
function buildGrid() {
	const U = G.units,
		n = U.length;
	if (UGX.length < n) UGX = new Int32Array(n * 2);
	UGH.fill(-1);
	G.sol = [];
	G.priests = [];
	for (let i = 0; i < n; i++) {
		const u = U[i],
			c = clamp((u.y / UG) | 0, 0, UGN - 1) * UGN + clamp((u.x / UG) | 0, 0, UGN - 1);
		UGX[i] = UGH[c];
		UGH[c] = i;
		if (isSoldier(u)) G.sol.push(u);
		else if (u.kind === 'priest' && u.hp > 0) G.priests.push(u);
	}
	G.ugTick = G.tick;
}
// soldiers ignore grazing deer, drifters and wayfarers; spies are seen only up close
// An animal (it has a temper) is left alone unless it is on one of your civilians and your side can see it do it (decisions 8, 8b, 13).
const ignorable = (v, o) => {
	const U = UNIT[v.kind];
	if (U.temper) return !(o !== undefined && v.tgt && v.tgt.hp > 0 && v.tgt.owner === o && hasTag(v.tgt.kind, 'civ') && groupSees(o, v));
	return U.flee || U.passive || U.tick === 'wayfarer' || U.tick === 'envoy';
}; // a herald is sacred: nobody shoots at an emissary on its way (it dies only by a side's own order)
function nearestFoe(o, from, range, anchor) {
	const a = anchor || from,
		U = G.units,
		sR = spySeen(o, from);
	let best = null,
		bd = range;
	const grid = G.ugTick === G.tick,
		r = range + 3;
	const x0 = grid ? clamp(((a.x - r) / UG) | 0, 0, UGN - 1) : 0,
		x1 = grid ? clamp(((a.x + r) / UG) | 0, 0, UGN - 1) : 0,
		y0 = grid ? clamp(((a.y - r) / UG) | 0, 0, UGN - 1) : 0,
		y1 = grid ? clamp(((a.y + r) / UG) | 0, 0, UGN - 1) : 0;
	for (let cy = y0; cy <= y1; cy++)
		for (let cx = x0; cx <= x1; cx++)
			for (let i = grid ? UGH[cy * UGN + cx] : U.length - 1; i >= 0; i = grid ? UGX[i] : i - 1) {
				const v = U[i];
				if (v.inside || v.hp <= 0 || !atWar(o, v.owner) || ignorable(v, o)) continue;
				const dx = a.x - v.x,
					dy = a.y - v.y,
					d = Math.sqrt(dx * dx + dy * dy);
				if (d < bd && !(v.kind === 'spy' && d > sR)) {
					bd = d;
					best = v;
				}
			}
	return best;
}
// ───────────────────────── Who a soldier fights (Build 59)
// The attack-value rule: strike first the foe that takes the most of the enemy's damage off the field per second of your effort, its damage a
// second over the time to reach and kill it (Churchill, Saffidine & Buro 2012, "Fast heuristic search for RTS game combat"; the cμ rule of
// queueing, Cox & Smith 1961). The same shape as the forager's rate: what is gained over the time it costs.
//     V = (its damage a second against you) / (its health ÷ your damage a second against it + the walk to reach it ÷ your speed)
// Only a foe it can beat one on one (the square law above one half) is chosen while one is in sight; finish who you started, unless it runs
// out of reach or another is FORAGE.move (18%) better. The danger map is not used here: a soldier's danger is the foe itself.
function foeValue(u, v, d) {
	const su = stats(u.owner, u.kind),
		sv = v.owner === WILD ? UNIT[v.kind] : stats(v.owner, v.kind),
		mine = ((su.dmg || 0) * vsMul(u, v)) / (UNIT[u.kind].cd || 1),
		theirs = ((sv.dmg || 0) * vsMul(v, u)) / (UNIT[v.kind].cd || 1) + 0.1, // a foe that cannot hurt you is still worth taking, last
		reach = Math.max(0, d - (su.rng || 0)) / Math.max(1, su.spd);
	return mine > 0 ? theirs / (v.hp / mine + reach) : 0;
}
// can we beat it: the soldier's own group (its side within GROUP_R of it, itself in) against that one foe, by the square law. A line of
// twelve swordsmen can beat an elephant though no one of them can (Build 63: judged one on one, they left the elephant for a villager)
const GROUP_R = 60;
function groupPower(u) {
	if (u.gpT === G.tick) return u.gp;
	let p = 0;
	unitsNear(u, GROUP_R, (v) => {
		if (v.owner === u.owner && isSoldier(v) && v.hp > 0 && !v.inside) p += unitPower(v);
	});
	u.gpT = G.tick;
	return (u.gp = Math.max(p, unitPower(u)));
}
const canBeat = (u, v) => lanchester((groupPower(u) * vsMul(u, v)) / Math.max(1e-6, unitPower(v) * vsMul(v, u))) > 0.5;
function bestFoe(o, from, range, anchor) {
	const a = anchor || from,
		U = G.units,
		sR = spySeen(o, from);
	let best = null,
		bV = -1,
		bBeat = false;
	const grid = G.ugTick === G.tick,
		r = range + 3;
	const x0 = grid ? clamp(((a.x - r) / UG) | 0, 0, UGN - 1) : 0,
		x1 = grid ? clamp(((a.x + r) / UG) | 0, 0, UGN - 1) : 0,
		y0 = grid ? clamp(((a.y - r) / UG) | 0, 0, UGN - 1) : 0,
		y1 = grid ? clamp(((a.y + r) / UG) | 0, 0, UGN - 1) : 0;
	for (let cy = y0; cy <= y1; cy++)
		for (let cx = x0; cx <= x1; cx++)
			for (let i = grid ? UGH[cy * UGN + cx] : U.length - 1; i >= 0; i = grid ? UGX[i] : i - 1) {
				const v = U[i];
				if (v.inside || v.hp <= 0 || !atWar(o, v.owner) || ignorable(v, o)) continue;
				const d = hyp(a.x - v.x, a.y - v.y);
				if (d > range || (v.kind === 'spy' && d > sR)) continue;
				const beat = canBeat(from, v),
					V = foeValue(from, v, dist(from, v));
				if ((beat && !bBeat) || (beat === bBeat && V > bV)) {
					best = v;
					bV = V;
					bBeat = beat;
				}
			}
	return best;
}
// the nearest unit within r that passes ok, looking only at the squares around (the grid is rebuilt each step)
function nearU(from, r, ok) {
	if (G.ugTick !== G.tick) return nearest(G.units, from, (v) => v !== from && v.hp > 0 && ok(v), r); // never itself nor the fallen, as the grid path
	const U = G.units,
		x0 = clamp(((from.x - r) / UG) | 0, 0, UGN - 1),
		x1 = clamp(((from.x + r) / UG) | 0, 0, UGN - 1),
		y0 = clamp(((from.y - r) / UG) | 0, 0, UGN - 1),
		y1 = clamp(((from.y + r) / UG) | 0, 0, UGN - 1);
	let best = null,
		bd = r;
	for (let cy = y0; cy <= y1; cy++)
		for (let cx = x0; cx <= x1; cx++)
			for (let i = UGH[cy * UGN + cx]; i >= 0; i = UGX[i]) {
				const v = U[i];
				if (v === from || v.hp <= 0) continue;
				const d = dist(from, v);
				if (d < bd && ok(v)) {
					bd = d;
					best = v;
				}
			}
	return best;
}
function nearestFoeBld(o, from, owner, range) {
	let best = null,
		bd = range || 1e9;
	const ok = (b) => {
		if (b.hp > 0 && atWar(o, b.owner) && (owner === undefined || b.owner === owner)) {
			const d = rectGap(from.x, from.y, b);
			if (d < bd) {
				bd = d;
				best = b;
			}
		}
	};
	if (range) bldsNear(from.x, from.y, range + 40, ok);
	else for (const b of G.blds) ok(b);
	return best;
}
// Buildings and nodes stand still, so each is sorted into squares of 100 once, and redone only when one comes or goes.
const SGC = 100,
	SGN = Math.ceil(MAP / SGC);
const SG = { b: { ref: null, len: 0, cells: [] }, n: { ref: null, len: 0, cells: [] } };
function sgrid(which, list) {
	const g = SG[which];
	if (g.ref === list && g.len === list.length) return g.cells;
	const cells = g.cells;
	cells.length = SGN * SGN;
	for (let i = 0; i < cells.length; i++) cells[i] = null;
	for (const e of list) {
		const c = clamp((e.y / SGC) | 0, 0, SGN - 1) * SGN + clamp((e.x / SGC) | 0, 0, SGN - 1);
		(cells[c] || (cells[c] = [])).push(e);
	}
	g.ref = list;
	g.len = list.length;
	return cells;
}
// calls fn for everything within r of (x, y) by its square (a little beyond r on the edges); stops and returns true when fn does
function sgNear(which, list, x, y, r, fn) {
	const cells = sgrid(which, list),
		x0 = clamp(((x - r) / SGC) | 0, 0, SGN - 1),
		x1 = clamp(((x + r) / SGC) | 0, 0, SGN - 1),
		y0 = clamp(((y - r) / SGC) | 0, 0, SGN - 1),
		y1 = clamp(((y + r) / SGC) | 0, 0, SGN - 1);
	for (let cy = y0; cy <= y1; cy++)
		for (let cx = x0; cx <= x1; cx++) {
			const L = cells[cy * SGN + cx];
			if (L) for (const e of L) if (fn(e)) return true;
		}
	return false;
}
const bldsNear = (x, y, r, fn) => sgNear('b', G.blds, x, y, r, fn),
	nodesNear = (x, y, r, fn) => sgNear('n', G.nodes, x, y, r, fn);
// the units within r of from, by the unit grid
function unitsNear(from, r, fn) {
	if (G.ugTick !== G.tick) {
		for (const v of G.units) if (v !== from && Math.abs(v.x - from.x) < r && Math.abs(v.y - from.y) < r) fn(v);
		return;
	}
	const U = G.units,
		x0 = clamp(((from.x - r) / UG) | 0, 0, UGN - 1),
		x1 = clamp(((from.x + r) / UG) | 0, 0, UGN - 1),
		y0 = clamp(((from.y - r) / UG) | 0, 0, UGN - 1),
		y1 = clamp(((from.y + r) / UG) | 0, 0, UGN - 1);
	for (let cy = y0; cy <= y1; cy++)
		for (let cx = x0; cx <= x1; cx++)
			for (let i = UGH[cy * UGN + cx]; i >= 0; i = UGX[i]) {
				const v = U[i];
				if (v !== from && Math.abs(v.x - from.x) < r && Math.abs(v.y - from.y) < r) fn(v);
			}
}
function vsMul(a, t) {
	const vs = a.owner === WILD ? UNIT[a.kind].vs : stats(a.owner, a.kind).vs;
	if (!vs) return 1;
	let m = vs[t.kind] || vs[baseKind(t.kind)] || 1;
	for (const tag of UNIT[t.kind].tags || []) if (vs[tag] > m) m = vs[tag];
	return m;
}
