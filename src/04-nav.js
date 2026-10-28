// ═════ 04-nav.js ═════
// ───────────────────────── The walking grid: where things stand, and how people get around ─────────────────────────
// Squares of 10, never shown. Buildings fill whole squares and leave one free around them. Walls are one square each.
const NC = MAP / NAVC;
const NAV = {
	solid: new Uint8Array(NC * NC),
	gate: new Uint8Array(NC * NC),
	lake: new Uint8Array(NC * NC),
	comp: new Int32Array(NC * NC),
	occ: new Array(NC * NC).fill(null),
	prev: new Uint8Array(NC * NC),
	prevG: new Uint8Array(NC * NC),
	v: 0,
	budget: 4,
};
let lakeFor = null,
	lakeHi = false; // the lakes the grid was drawn for, and whether in flood
const lakeR = (L) => L.r + (G.flood > G.t ? EVENTS.flood.rise : 0); // a lake in flood reaches farther up its shore
// how far a point stands from water (negative: in it). The great lake holds the Throne's island and four causeways, which are land.
const onLand = (x, y) =>
	((Math.abs(x - MID) < THRONE.cause / 2 || Math.abs(y - MID) < THRONE.cause / 2) &&
		hyp(x - MID, y - MID) < LAKE0.r + 60) ||
	hyp(x - MID, y - MID) < THRONE.isle;
const lakeGap = (x, y) =>
	onLand(x, y) ? 1e9 : G.lakes.reduce((m, L) => Math.min(m, hyp(x - L.x, y - L.y) - lakeR(L)), 1e9); // how far from the nearest lake's edge
// lake cells: 1 water, 2 flood water only, which a side with levees wades
function lakeGrid() {
	NAV.lake.fill(0);
	for (const L of G.lakes)
		for (let y = 0; y < NC; y++)
			for (let x = 0; x < NC; x++)
				if (hyp(x * NAVC + 5 - L.x, y * NAVC + 5 - L.y) < lakeR(L) + 2 && !onLand(x * NAVC + 5, y * NAVC + 5))
					NAV.lake[y * NC + x] = hyp(x * NAVC + 5 - L.x, y * NAVC + 5 - L.y) < L.r + 2 ? 1 : 2;
	lakeFor = G.lakes;
	lakeHi = G.flood > G.t;
}
const gcell = (x, y) => clamp(Math.floor(y / NAVC), 0, NC - 1) * NC + clamp(Math.floor(x / NAVC), 0, NC - 1);
const toCell = (w) => ({ gx: clamp(Math.floor(w.x / NAVC), 0, NC - 1), gy: clamp(Math.floor(w.y / NAVC), 0, NC - 1) });
const coord = (x, y) =>
	String.fromCharCode(65 + clamp(Math.floor(x / 100), 0, 19)) + (clamp(Math.floor(y / 100), 0, 19) + 1);
function snapPos(kind, x, y) {
	// the squares a building would cover if centred near (x, y)
	const n = BLD[kind].fp,
		gx = Math.round(x / NAVC - n / 2),
		gy = Math.round(y / NAVC - n / 2);
	return { gx, gy, x: (gx + n / 2) * NAVC, y: (gy + n / 2) * NAVC };
}
function navRebuild() {
	if (lakeFor !== G.lakes || lakeHi !== G.flood > G.t) lakeGrid();
	NAV.prev.set(NAV.solid);
	NAV.prevG.set(NAV.gate);
	NAV.solid.set(NAV.lake);
	NAV.gate.fill(0);
	NAV.occ.fill(null);
	// a tree fills the 3×3 squares round it: forest is a wall until it is cut
	const T = G.nodes.filter((n) => n.kind === 'tree' && n.amt > 0);
	for (const n of T) {
		const cx = Math.floor(n.x / NAVC),
			cy = Math.floor(n.y / NAVC);
		for (let j = -1; j <= 1; j++)
			for (let i = -1; i <= 1; i++) {
				const x = cx + i,
					y = cy + j;
				if (x >= 0 && y >= 0 && x < NC && y < NC) NAV.solid[y * NC + x] = 1;
			}
	}
	for (const b of G.blds)
		if (b.hp > 0) {
			const B = BLD[b.kind],
				n = B.fp;
			for (let j = 0; j < n; j++)
				for (let i = 0; i < n; i++) {
					const c = (b.gy + j) * NC + b.gx + i;
					if (c < 0 || c >= NC * NC) continue;
					NAV.occ[c] = b;
					if (b.kind === 'gate') NAV.gate[c] = b.owner + 1;
					else if (!B.walk) NAV.solid[c] = 1; // a gate, even half built, is an opening for its own side (Build 38: an unbuilt gate sealed the Fortress in)
				}
		}
	// a one-square slit between two buildings is shut: a figure is wider than the gap and read as walking through the wall (Albert, Build 41)
	for (let y = 1; y < NC - 1; y++)
		for (let x = 1; x < NC - 1; x++) {
			const c = y * NC + x;
			if (NAV.solid[c] || NAV.occ[c] || NAV.gate[c]) continue;
			const B = (d) => {
				const b = NAV.occ[d];
				return b && !BLD[b.kind].walk && b.kind !== 'gate';
			};
			if ((B(c - 1) && B(c + 1)) || (B(c - NC) && B(c + NC))) NAV.solid[c] = 1;
		}
	// which squares are joined by open ground (gates counted open: the finest cut is made by the search itself)
	const C = NAV.comp,
		Q = AS.q;
	C.fill(0);
	let id = 0;
	for (let s = 0; s < NC * NC; s++) {
		if (C[s] || NAV.solid[s]) continue;
		C[s] = ++id;
		let h = 0,
			t = 0;
		Q[t++] = s;
		while (h < t) {
			const i = Q[h++],
				x = i % NC,
				j1 = x > 0 ? i - 1 : -1,
				j2 = x < NC - 1 ? i + 1 : -1,
				j3 = i - NC,
				j4 = i + NC;
			if (j1 >= 0 && !C[j1] && !NAV.solid[j1]) {
				C[j1] = id;
				Q[t++] = j1;
			}
			if (j2 >= 0 && !C[j2] && !NAV.solid[j2]) {
				C[j2] = id;
				Q[t++] = j2;
			}
			if (j3 >= 0 && !C[j3] && !NAV.solid[j3]) {
				C[j3] = id;
				Q[t++] = j3;
			}
			if (j4 < NC * NC && !C[j4] && !NAV.solid[j4]) {
				C[j4] = id;
				Q[t++] = j4;
			}
		}
	}
	// a tree can be cut only from open ground beside it: the forest is worked from its edge inward
	for (const n of T) {
		const cx = Math.floor(n.x / NAVC),
			cy = Math.floor(n.y / NAVC);
		n.open = false;
		for (const [i, j] of [
			[2, 0],
			[-2, 0],
			[0, 2],
			[0, -2],
			[2, 2],
			[-2, 2],
			[2, -2],
			[-2, -2],
		]) {
			const x = cx + i,
				y = cy + j;
			if (x >= 0 && y >= 0 && x < NC && y < NC && !NAV.solid[y * NC + x]) {
				n.open = true;
				break;
			}
		}
	}
	// every path is thrown away only when a square really opened or closed: a spent bush or carcass changes nothing for walkers
	let same = true;
	for (let i = 0; i < NC * NC; i++)
		if (NAV.solid[i] !== NAV.prev[i] || NAV.gate[i] !== NAV.prevG[i]) {
			same = false;
			break;
		}
	if (!same) NAV.v++;
	G.navDirty = false;
	G.treeV = (G.treeV || 0) + 1;
}
// can this side's unit not stand on this square? (a gate is shut only to those at war with its owner)
function blockedCell(c, o) {
	if (NAV.solid[c]) return NAV.solid[c] !== 2 || o === WILD || fxv(o, 'flood').a < 1;
	const g = NAV.gate[c];
	return g !== 0 && atWar(o, g - 1);
}
function lineClear(x1, y1, x2, y2, o, avoid) {
	const dx = x2 - x1,
		dy = y2 - y1,
		n = Math.ceil(hyp(dx, dy) / 4);
	for (let i = 1; i <= n; i++) {
		const c = gcell(x1 + (dx * i) / n, y1 + (dy * i) / n);
		if (blockedCell(c, o) || (avoid && DANGER[c])) return false;
	}
	return true;
}
// the free square nearest (px, py) among the rings around square (cx, cy)
function freeNear(cx, cy, o, R, px, py, slack = 2) {
	let best = null,
		bd = 1e9,
		found = -1;
	for (let rad = 0; rad <= R; rad++) {
		if (found >= 0 && rad > found + slack) break;
		for (let dy = -rad; dy <= rad; dy++)
			for (let dx = -rad; dx <= rad; dx++) {
				if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue;
				const x = cx + dx,
					y = cy + dy;
				if (x < 0 || y < 0 || x >= NC || y >= NC || blockedCell(y * NC + x, o)) continue;
				if (found < 0) found = rad;
				const d = hyp(x * NAVC + 5 - px, y * NAVC + 5 - py);
				if (d < bd) {
					bd = d;
					best = { x: x * NAVC + 5, y: y * NAVC + 5, cx: x, cy: y };
				}
			}
	}
	return best;
}
// Where guards and robbers wait: workers and carts walk round it (a soft cost, not a wall). Rebuilt every second from the finds still guarded.
const DANGER = new Uint8Array(NC * NC);
function dangerMap() {
	DANGER.fill(0);
	for (const f of G.guarded || []) {
		const F = FINDS[f.kind],
			gk = F.guard && F.guard[G.fantasy ? 1 : 0],
			R = Math.ceil(((gk && UNIT[gk].raid) || 90) / NAVC) + 4,
			cx = Math.floor(f.x / NAVC),
			cy = Math.floor(f.y / NAVC);
		for (let y = Math.max(0, cy - R); y <= Math.min(NC - 1, cy + R); y++)
			for (let x = Math.max(0, cx - R); x <= Math.min(NC - 1, cx + R); x++)
				if ((x - cx) ** 2 + (y - cy) ** 2 <= R * R) DANGER[y * NC + x] = 1;
	}
}
const AS = {
	g: new Float32Array(NC * NC),
	from: new Int32Array(NC * NC),
	seen: new Uint32Array(NC * NC),
	done: new Uint32Array(NC * NC),
	q: new Int32Array(NC * NC),
	hf: new Float32Array(40000),
	hi: new Int32Array(40000),
	gen: 0,
};
const DX8 = [1, -1, 0, 0, 1, 1, -1, -1],
	DY8 = [0, 0, 1, -1, 1, -1, 1, -1];
// A*: the shortest way round, no cutting corners. If the goal cannot be reached it returns the way to the nearest point (partial).
function astar(sx, sy, tx, ty, o, avoid) {
	const scx = clamp(Math.floor(sx / NAVC), 0, NC - 1),
		scy = clamp(Math.floor(sy / NAVC), 0, NC - 1);
	const S = blockedCell(scy * NC + scx, o) ? freeNear(scx, scy, o, 6, sx, sy) : { cx: scx, cy: scy };
	const gcx = clamp(Math.floor(tx / NAVC), 0, NC - 1),
		gcy = clamp(Math.floor(ty / NAVC), 0, NC - 1),
		goalFree = !blockedCell(gcy * NC + gcx, o);
	let T = goalFree ? { cx: gcx, cy: gcy } : freeNear(gcx, gcy, o, 14, sx, sy),
		cut = false;
	if (!S || !T) return { pts: [], partial: true };
	const si = S.cy * NC + S.cx,
		gen = ++AS.gen,
		hf = AS.hf,
		hi = AS.hi;
	let gi = T.cy * NC + T.cx,
		hn = 0;
	if (NAV.comp[gi] !== NAV.comp[si]) {
		// the goal is cut off by solid ground: go to the nearest square on this side, no search of the whole world
		let bd = 1e9;
		cut = true;
		for (let r = 1; r <= 60; r++) {
			for (let dy = -r; dy <= r; dy++)
				for (let dx = -r; dx <= r; dx++) {
					if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
					const x = T.cx + dx,
						y = T.cy + dy;
					if (x < 0 || y < 0 || x >= NC || y >= NC || NAV.comp[y * NC + x] !== NAV.comp[si]) continue;
					const d = dx * dx + dy * dy;
					if (d < bd) {
						bd = d;
						gi = y * NC + x;
					}
				}
			if (bd < 1e9 && r * r > bd) break;
		}
		if (bd === 1e9) return { pts: [], partial: true };
		T = { cx: gi % NC, cy: (gi / NC) | 0 };
	}
	const H = (i) => {
		const dx = Math.abs((i % NC) - T.cx),
			dy = Math.abs(((i / NC) | 0) - T.cy);
		return dx + dy - 0.586 * Math.min(dx, dy);
	};
	const swap = (a, b) => {
		const f = hf[a],
			n = hi[a];
		hf[a] = hf[b];
		hi[a] = hi[b];
		hf[b] = f;
		hi[b] = n;
	};
	const push = (f, i) => {
		let k = hn++;
		hf[k] = f;
		hi[k] = i;
		while (k > 0) {
			const p = (k - 1) >> 1;
			if (hf[p] <= hf[k]) break;
			swap(p, k);
			k = p;
		}
	};
	const pop = () => {
		const i = hi[0];
		hn--;
		if (hn) {
			hf[0] = hf[hn];
			hi[0] = hi[hn];
			let k = 0;
			for (;;) {
				const l = 2 * k + 1,
					r = l + 1;
				let m = k;
				if (l < hn && hf[l] < hf[m]) m = l;
				if (r < hn && hf[r] < hf[m]) m = r;
				if (m === k) break;
				swap(m, k);
				k = m;
			}
		}
		return i;
	};
	AS.g[si] = 0;
	AS.seen[si] = gen;
	AS.from[si] = -1;
	push(H(si), si);
	let found = false,
		best = si,
		bh = H(si),
		exp = 0;
	while (hn && exp < (avoid ? 9000 : 4000)) {
		const i = pop();
		if (AS.done[i] === gen) continue;
		AS.done[i] = gen;
		exp++;
		if (i === gi) {
			found = true;
			break;
		}
		const h = H(i);
		if (h < bh) {
			bh = h;
			best = i;
		}
		const cx = i % NC,
			cy = (i / NC) | 0;
		for (let d = 0; d < 8; d++) {
			const nx = cx + DX8[d],
				ny = cy + DY8[d];
			if (nx < 0 || ny < 0 || nx >= NC || ny >= NC) continue;
			const ni = ny * NC + nx;
			if (AS.done[ni] === gen || blockedCell(ni, o)) continue;
			if (d >= 4 && (blockedCell(cy * NC + nx, o) || blockedCell(ny * NC + cx, o))) continue;
			const ng = AS.g[i] + (d >= 4 ? 1.414 : 1) + (avoid && DANGER[ni] ? 3 : 0);
			if (AS.seen[ni] !== gen || ng < AS.g[ni]) {
				AS.seen[ni] = gen;
				AS.g[ni] = ng;
				AS.from[ni] = i;
				push(ng + H(ni), ni);
			}
		}
	}
	const end = found ? gi : best,
		pts = [];
	for (let i = end; i !== -1 && i !== si; i = AS.from[i])
		pts.push({ x: (i % NC) * NAVC + 5, y: ((i / NC) | 0) * NAVC + 5 });
	pts.reverse();
	if (found && goalFree && !cut && pts.length) pts[pts.length - 1] = { x: tx, y: ty };
	return { pts, partial: !found || cut };
}
const halfOf = (b) => (BLD[b.kind].fp * NAVC) / 2;
function rectGap(px, py, b) {
	const h = halfOf(b);
	return hyp(Math.max(Math.abs(px - b.x) - h, 0), Math.max(Math.abs(py - b.y) - h, 0));
}
const edge = (u, t) => (BLD[t.kind] && t.q ? rectGap(u.x, u.y, t) : dist(u, t));
function findBlocker(u) {
	// an enemy building right beside u: what is in the way
	const cx = Math.floor(u.x / NAVC),
		cy = Math.floor(u.y / NAVC);
	let best = null,
		bd = 1e9;
	for (let dy = -2; dy <= 2; dy++)
		for (let dx = -2; dx <= 2; dx++) {
			const x = cx + dx,
				y = cy + dy;
			if (x < 0 || y < 0 || x >= NC || y >= NC) continue;
			const b = NAV.occ[y * NC + x];
			if (b && b.hp > 0 && atWar(u.owner, b.owner)) {
				const d = rectGap(u.x, u.y, b);
				if (d < bd) {
					bd = d;
					best = b;
				}
			}
		}
	return best;
}
function standOff(u, x, y) {
	// the free square nearest the goal on the side the unit is on
	const k = gcell(x, y);
	if (u.so && u.so.k === k && u.so.v === NAV.v) return u.so;
	const f = freeNear(Math.floor(x / NAVC), Math.floor(y / NAVC), u.owner, 14, u.x, u.y, 0) || { x: u.x, y: u.y };
	return (u.so = { k, v: NAV.v, x: f.x, y: f.y });
}
// where to head next on the way to (tx, ty)
function route(u, tx, ty) {
	const o = u.owner,
		T = G.t,
		avoid = UNIT[u.kind].cls === 'civ' && !DANGER[gcell(u.x, u.y)] && !DANGER[gcell(tx, ty)]; // workers and carts keep off guarded ground, unless they are already on it or going into it
	if (!u.path) {
		if (T - (u.lcT || -9) < 0.25 && u.lcOK) return { x: tx, y: ty, direct: true };
		u.lcT = T;
		u.lcOK = lineClear(u.x, u.y, tx, ty, o, avoid);
		if (u.lcOK) return { x: tx, y: ty, direct: true };
	} else if (T - u.lcT > 0.5) {
		u.lcT = T;
		if (lineClear(u.x, u.y, tx, ty, o, avoid)) {
			u.path = null;
			u.lcOK = true;
			return { x: tx, y: ty, direct: true };
		}
	}
	const key = gcell(tx, ty);
	if (!u.path || u.pv !== NAV.v || u.pk !== key) {
		if (u.pfK === key && u.pfV === NAV.v && T - u.pfT < 3) return { x: tx, y: ty, direct: true }; // already known: no way
		if (NAV.budget <= 0) return { x: u.x, y: u.y, direct: true }; // out of thinking time this moment: wait where it stands, ask again next tick
		NAV.budget--;
		const p = astar(u.x, u.y, tx, ty, o, avoid);
		u.pi = 0;
		u.pv = NAV.v;
		u.pk = key;
		u.partial = p.partial;
		if (!p.pts.length) {
			u.path = null;
			u.pfK = key;
			u.pfV = NAV.v;
			u.pfT = T;
			return { x: tx, y: ty, direct: true };
		}
		u.path = p.pts;
	}
	const P = u.path;
	while (u.pi < P.length - 1 && hyp(P[u.pi].x - u.x, P[u.pi].y - u.y) < 7) u.pi++;
	for (let k = Math.min(P.length - 1, u.pi + 4); k > u.pi; k--)
		if (lineClear(u.x, u.y, P[k].x, P[k].y, o, avoid)) {
			u.pi = k;
			break;
		}
	const last = u.pi === P.length - 1;
	if (last && u.partial && hyp(P[u.pi].x - u.x, P[u.pi].y - u.y) < 9) {
		u.noPath = true;
		u.noPathT = T;
		const b = findBlocker(u);
		if (b) {
			u.blocker = b;
			u.blockT = T;
		}
	}
	return { x: P[u.pi].x, y: P[u.pi].y, direct: last };
}
// one step toward (x, y); true once within r. A building as the goal means "arrive beside it".
function moveTo(u, x, y, dt, r, SP) {
	if (u.stuck > G.t) return false; // in a pit, or slipped on ice
	if (
		G.ground.ice > 0 &&
		!u.fly &&
		u.owner !== WILD &&
		(G.tick + u.id) % 30 === 0 &&
		rng() < GROUND.slip * G.ground.ice * (1 - fxv(u.owner, 'ice', unitKeys(u.kind)).a)
	) {
		u.stuck = G.t + GROUND.slipSecs;
		if (u.owner === 0 && !(G.slipT > G.t - 20)) {
			G.slipT = G.t;
			say('Ice: your people slip and fall.', 'soft', 4, u);
		}
		return false;
	}
	const o = u.owner,
		gc = gcell(x, y),
		gb = NAV.occ[gc];
	let tx = x,
		ty = y,
		stand = false;
	if (gb && !BLD[gb.kind].walk) {
		if (rectGap(u.x, u.y, gb) <= Math.max(6, r - halfOf(gb))) return true;
		stand = true;
	} else if (blockedCell(gc, o)) stand = true;
	else if (hyp(x - u.x, y - u.y) <= r + 0.5) return true;
	if (stand) {
		const so = standOff(u, x, y);
		tx = so.x;
		ty = so.y;
		if (hyp(tx - u.x, ty - u.y) <= 7) return true;
	}
	const wp = route(u, tx, ty);
	const dx = wp.x - u.x,
		dy = wp.y - u.y,
		dd = hyp(dx, dy) || 1e-6;
	const lim = wp.direct ? (stand ? dd : Math.max(0, dd - r)) : dd;
	const m = Math.min(
		Math.min(stats(o, u.kind).spd, u.cap || 1e9) *
			(u.kind === 'vil' && u.carry > 0 ? 0.9 : 1) *
			(u.sick > G.t ? 0.8 : 1) *
			SP *
			dt *
			(u.stance === 1 ? STANCE[1].spd : 1) *
			(FORM[formOf(u)].spd || 1) *
			EVM.spd *
			(o === WILD ? 1 : groundSpd(o, unitKeys(u.kind))) *
			(G.sand && hyp(u.x - G.sand.x, u.y - G.sand.y) < G.sand.r ? EVENTS.quicksand.slow : 1) *
			(u.chg > G.t ? CHARGE.spd : u.tired > G.t ? CHARGE.tiredSpd : 1),
		lim,
	);
	let nx = u.x + (dx / dd) * m,
		ny = u.y + (dy / dd) * m;
	if (blockedCell(gcell(nx, ny), o)) {
		if (!blockedCell(gcell(nx, u.y), o)) ny = u.y;
		else if (!blockedCell(gcell(u.x, ny), o)) nx = u.x;
		else {
			nx = u.x;
			ny = u.y;
		}
	}
	u.x = nx;
	u.y = ny;
	if (m > 0.3) {
		if (!(u.kT > G.t - 0.5)) {
			u.fx = dx / dd;
			u.fy = dy / dd;
		}
		u.mvT = G.t;
		u.st.walk += m;
		if (u.kind === 'vil') tread(u);
	} // real steps only: a small nudge neither turns the figure round nor starts its walk
	if (stand) return hyp(tx - u.x, ty - u.y) <= 7;
	return hyp(x - u.x, y - u.y) <= r + 0.5;
}

// ───────────────────────── Placement ─────────────────────────
// Buildings that train people keep one free square around them so the new ones can walk out; everything else may touch (walls and gates too).
function canPlace(o, kind, x, y) {
	const B = BLD[kind],
		n = B.fp,
		sp = snapPos(kind, x, y),
		m = B.wallish ? 0 : 1;
	if (sp.gx < 1 || sp.gy < 1 || sp.gx + n > NC - 1 || sp.gy + n > NC - 1) return 'Too close to the edge';
	const cw_ = capWhy(o, kind);
	if (cw_) return cw_;
	for (let j = -m; j < n + m; j++)
		for (let i = -m; i < n + m; i++) {
			const c = (sp.gy + j) * NC + sp.gx + i,
				inside = i >= 0 && j >= 0 && i < n && j < n;
			if (inside && NAV.lake[c]) return 'That is the lake';
			const q = NAV.occ[c];
			if (!q) continue;
			if (inside) {
				if (kind === 'gate' && q.kind === 'wall' && q.owner === o) continue;
				return 'Something is in the way';
			}
			if (
				!B.wallish &&
				!B.crop &&
				j >= 0 &&
				j < n &&
				(i === -1 || i === n) &&
				!BLD[q.kind].wallish &&
				!BLD[q.kind].crop
			)
				return 'Leave a gap: a wall shows on each side';
			if (!BLD[q.kind].wallish && (TRAINERS.has(kind) || TRAINERS.has(q.kind)))
				return 'Leave a lane around buildings that train people';
		}
	if (!B.wallish) {
		const h = n * 5 + 6;
		if (
			nodesNear(
				sp.x,
				sp.y,
				h,
				(nd) => nd.kind !== 'farm' && nd.kind !== 'fish' && Math.abs(nd.x - sp.x) < h && Math.abs(nd.y - sp.y) < h,
			)
		)
			return 'Clear of trees and rocks, please';
	}
	let stop = null;
	if (B.atStop) {
		// a trade post stands only on a trade stop, once its guards are gone
		stop = G.finds.find((f) => f.kind === 'stop' && Math.abs(f.x - sp.x) < 24 && Math.abs(f.y - sp.y) < 24);
		if (!stop) return 'Only on a trade stop';
		if (guardsLeft(stop)) return 'Clear its guards first';
		if (postAt(stop)) return 'This stop already has a post';
	}
	for (const f of G.finds)
		if (f !== stop && !f.done && Math.abs(f.x - sp.x) < n * 5 + 30 && Math.abs(f.y - sp.y) < n * 5 + 30)
			return 'Too close to the ' + FINDS[f.kind].name.toLowerCase();
	if (B.shore && lakeGap(sp.x, sp.y) > 70) return 'It has to stand by a lake';
	if (B.one && G.blds.some((b) => b.owner === o && b.kind === kind && b.hp > 0)) return 'You can have only one';
	return null;
}
// Where the ghost lands: the nearest spot that lines up with a building of yours, touching or with one lane between, else where the finger is.
function snapGhost(o, kind, x, y, tol) {
	const B = BLD[kind],
		h = (B.fp * NAVC) / 2,
		base = snapPos(kind, x, y);
	if (B.wallish) return base;
	let best = null,
		bd = tol;
	for (const b of G.blds) {
		if (b.owner !== o || b.hp <= 0 || BLD[b.kind].wallish) continue;
		const bh = halfOf(b);
		if (Math.abs(b.x - x) > bh + h + tol + 40 || Math.abs(b.y - y) > bh + h + tol + 40) continue;
		const alignX = [b.x, b.x - bh + h, b.x + bh - h],
			alignY = [b.y, b.y - bh + h, b.y + bh - h];
		for (const gap of [bh + h, bh + NAVC + h]) {
			// flush first, then with a lane between
			for (const cx of [b.x - gap, b.x + gap]) for (const cy of alignY.concat([y])) consider(cx, cy);
			for (const cy of [b.y - gap, b.y + gap]) for (const cx of alignX.concat([x])) consider(cx, cy);
		}
	}
	function consider(cx, cy) {
		const s = snapPos(kind, cx, cy),
			d = hyp(s.x - x, s.y - y);
		if (d < bd && !canPlace(o, kind, s.x, s.y)) {
			bd = d;
			best = s;
		}
	}
	return best || base;
}
// The computers' way of finding a spot: rings out from a centre, the first place that fits.
function findSpot(o, kind, cx, cy, rMin, rMax) {
	for (let wide = 0; wide < 3; wide++) {
		// the ring grows when it is full
		const R = rMax + wide * 90;
		for (let i = 0; i < 60; i++) {
			const r = rMin + (R - rMin) * (i / 60) + rnd(0, 10),
				a = rnd(0, Math.PI * 2);
			const x = cx + Math.cos(a) * r,
				y = cy + Math.sin(a) * r;
			if (!canPlace(o, kind, x, y)) return { x, y };
		}
	}
	return null;
}
// a straight run of squares from a to b, four-connected so nothing can slip through; near-straight drags snap to straight
function wallLine(a, b) {
	let dx = b.gx - a.gx,
		dy = b.gy - a.gy;
	if (Math.abs(dy) * 3 < Math.abs(dx)) dy = 0;
	else if (Math.abs(dx) * 3 < Math.abs(dy)) dx = 0;
	const n = Math.max(Math.abs(dx), Math.abs(dy)),
		cells = [{ gx: a.gx, gy: a.gy }];
	let px = a.gx,
		py = a.gy;
	for (let i = 1; i <= n; i++) {
		const gx = Math.round(a.gx + (dx * i) / n),
			gy = Math.round(a.gy + (dy * i) / n);
		if (gx !== px && gy !== py) cells.push({ gx, gy: py });
		cells.push({ gx, gy });
		px = gx;
		py = gy;
	}
	return cells;
}
