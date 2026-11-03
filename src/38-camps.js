// ═════ 38-camps.js: war camps (Albert, Nov 3): the wagon, the strip and the square, the soldiers who raise them ═════
// An Outpost is a thin strip: four tents and a tower in one file, broadside to the way home (Hyginus §1: a century's tents in one line).
// A Camp is a square of CAMP.side squares: a palisade with a gate in the home side, a tower at each corner, the four tents inside along
// the walls, the yard in the middle for CAMP.hold soldiers (§1: eight men a tent; §4: the hospital away from the workshops, here across
// the yard). The pieces come off the wagon as sites; villagers and foot soldiers raise them (CAMP.build). Trees under the camp burn.
const CAMP_TENTS = ['medtent', 'traintent', 'messtent', 'depot'];
// the pieces of a camp of a kind at (x, y), facing fx, fy (toward home: the gate side): [{kind, x, y}]
function campLayout(kind, x, y, fx, fy) {
	const L = [],
		R = (ax, ay) => ({ x: x + (-fy * ax + fx * ay) * NAVC, y: y + (fx * ax + fy * ay) * NAVC }), // across, along (toward home)
		put = (k, ax, ay) => L.push({ kind: k, ...R(ax, ay) });
	if (kind === 'outpost') {
		[...CAMP_TENTS, 'camptower'].forEach((k, i) => put(k, (i - 2) * 3, 0)); // five 2 × 2 in a file, a square between each
		return L;
	}
	const h = CAMP.side / 2; // the palisade on the square's edge, the gate the two middle squares of the home side
	for (let i = -h; i < h; i++) {
		const g = i === -1 || i === 0; // the gate's two squares
		put(g ? 'gate' : 'palisade', i + 0.5, h - 0.5); // the home side (toward home)
		put('palisade', i + 0.5, -h + 0.5);
		if (i > -h && i < h - 1) {
			put('palisade', -h + 0.5, i + 0.5); // the two sides, the corners already laid
			put('palisade', h - 0.5, i + 0.5);
		}
	}
	for (const [sx, sy] of [
		[-1, -1],
		[1, -1],
		[-1, 1],
		[1, 1],
	])
		put('camptower', sx * (h - 2), sy * (h - 2)); // the corners, inside the stakes
	put('medtent', -(h - 2), 0); // the hospital on one side, the workshops' side across the yard (§4)
	put('traintent', h - 2, 0);
	put('messtent', 0, -(h - 2)); // the mess at the back
	put('depot', 0, h - 4); // the depot inside the gate
	return L;
}
// facing: from the spot toward the owner's Town Center (the gate side), else south
function campFacing(o, x, y) {
	const k = keepOf(o),
		dx = k ? k.x - x : 0,
		dy = k ? k.y - y : 1,
		d = hyp(dx, dy) || 1;
	return { x: dx / d, y: dy / d };
}
// the square of ground a camp takes: every piece's footprint plus a lane, as canPlace keeps for a building
function campCells(L) {
	const cells = new Set();
	for (const p of L) {
		const n = BLD[p.kind].fp,
			sp = snapPos(p.kind, p.x, p.y),
			m = BLD[p.kind].wallish ? 0 : 1;
		for (let j = -m; j < n + m; j++) for (let i = -m; i < n + m; i++) cells.add((sp.gy + j) * NC + (sp.gx + i));
	}
	return cells;
}
// why a camp cannot stand here, or null: off the map, on water, on a building or a find; trees are allowed (they burn)
function campWhy(o, kind, x, y) {
	const L = campLayout(kind, x, y, ...Object.values(campFacing(o, x, y)));
	for (const p of L) {
		const sp = snapPos(p.kind, p.x, p.y),
			n = BLD[p.kind].fp;
		if (sp.gx < 2 || sp.gy < 2 || sp.gx + n > NC - 2 || sp.gy + n > NC - 2) return 'Too near the edge of the map.';
	}
	for (const c of campCells(L)) {
		if (NAV.lake[c]) return 'A camp cannot stand in water.';
		if (NAV.occ[c]) return 'A building stands there.';
	}
	const cx = x,
		cy = y,
		reach = (kind === 'camp' ? CAMP.side / 2 + 1 : 9) * NAVC;
	for (const f of G.finds) if (!f.gone && hyp(f.x - cx, f.y - cy) < reach + (FINDS[f.kind].r || 30)) return 'Too near a find.';
	return null;
}
// the wagon unpacks: the trees under the camp burn, the sites are laid, the wagon is gone
function campUnpack(u) {
	const o = u.owner,
		kind = UNIT[u.kind].camp,
		why = campWhy(o, kind, u.x, u.y);
	if (why) {
		if (o === 0) say(why + ' Send the wagon elsewhere.', 'warn', TOAST.mid);
		u.state = 'home';
		return false;
	}
	const f = campFacing(o, u.x, u.y),
		L = campLayout(kind, u.x, u.y, f.x, f.y),
		cells = campCells(L),
		burnt = [];
	for (const n of G.nodes)
		if (n.kind === 'tree' && n.amt > 0) {
			const cx = Math.floor(n.x / NAVC),
				cy = Math.floor(n.y / NAVC);
			let hit = false;
			for (let j = -CAMP.burn; j <= CAMP.burn && !hit; j++) for (let i = -CAMP.burn; i <= CAMP.burn && !hit; i++) if (cells.has((cy + j) * NC + cx + i)) hit = true;
			if (hit) burnt.push(n);
		}
	for (const n of burnt) n.amt = 0;
	if (burnt.length) G.nodes = G.nodes.filter((n) => !burnt.includes(n));
	// the abatis (Albert, Nov 3, field defences: yes): a Camp's felled trees outside the palisade are laid as its outer work, a wall of
	// branches on the forest side, for nothing; a tree inside the square is burned and gone
	const abatis = [];
	if (kind === 'camp') {
		const h = CAMP.side / 2,
			inSquare = (n) => Math.abs(-f.y * (n.x - u.x) + f.x * (n.y - u.y)) < h * NAVC && Math.abs(f.x * (n.x - u.x) + f.y * (n.y - u.y)) < h * NAVC;
		for (const n of burnt) if (!inSquare(n)) abatis.push(n);
	}
	const id = NID++;
	navOnce(() => {
		for (const p of L) {
			const b = mkBld(o, p.kind, p.x, p.y, 0);
			b.camp = id;
			b.campKind = kind;
			G.blds.push(b);
			G.navDirty = true;
		}
		for (const n of abatis) {
			const sp = snapPos('abatis', n.x, n.y);
			if (cells.has(sp.gy * NC + sp.gx) || NAV.occ[sp.gy * NC + sp.gx] || G.blds.some((b) => b.camp === id && b.gx === sp.gx && b.gy === sp.gy)) continue;
			const b = mkBld(o, 'abatis', n.x, n.y, 1);
			b.camp = id;
			b.campKind = kind;
			G.blds.push(b);
		}
		navRebuild();
	});
	u.hp = 0;
	u.gone = true;
	if (o === 0) {
		news('war', `${kind === 'camp' ? 'The camp' : 'The outpost'} is unpacked at ${coord(u.x, u.y)}: ${burnt.length ? burnt.length + ' trees felled' + (abatis.length ? ', an abatis laid' : '') + '; ' : ''}soldiers and villagers raise it.`, 'good', TOAST.mid, { x: u.x, y: u.y });
		sfx('thock', u.x, u.y);
	}
	return true;
}
// the wagon on the road: sent to a spot it drives there and unpacks; at home it waits by the Stable
function wagonTick(u, dt, SP) {
	if (u.state === 'goto') {
		if (moveTo(u, u.px, u.py, dt, 6, SP)) campUnpack(u);
		return;
	}
	const h = homeSpot(u, 90);
	if (h) moveTo(u, h.x, h.y, dt, 3, SP);
}
// how many camps of a kind a side may have out at once, wagons on the road and in the line counted: one, two from the age after
const campCap = (o, kind) => {
	const p = G.P[o];
	if (kind === 'camp' && (!p.techs.has('campwagons') || !bldsOf(o, CAMP.need).some((b) => standing(b, o)))) return 0; // a Store standing (the stores a camp draws on)
	const first = kind === 'camp' ? 2 : 1;
	return p.age < first ? 0 : p.age >= first + 1 ? 2 : 1;
};
const campsOut = (o, kind) => {
	const ids = new Set();
	for (const b of G.blds) if (b.owner === o && b.hp > 0 && b.campKind === kind) ids.add(b.camp);
	let n = ids.size;
	for (const u of G.units) if (u.owner === o && u.hp > 0 && UNIT[u.kind].camp === kind) n++;
	for (const b of G.blds) if (b.owner === o && b.hp > 0) for (const j of b.q) if (j.kind && UNIT[j.kind].camp === kind) n++;
	return n;
};
const campWhyTrain = (o, kind) => {
	const cap = campCap(o, kind);
	if (!cap) return kind === 'camp' ? (G.P[o].age < 2 ? 'Camp wagons need the Classical age.' : !bldsOf(o, CAMP.need).some((b) => standing(b, o)) ? 'A camp draws on a Store: build one first.' : 'Research Camp wagons at the Stable first.') : 'Outpost wagons need the Bronze age.';
	if (campsOut(o, kind) >= cap) return cap === 1 ? `One ${kind} at a time; a second comes with the next age.` : `Two ${kind}s at a time.`;
	return null;
};
// a foot soldier (unmounted, no engine) standing idle near an unraised piece of its own side's camp lends a hand (CAMP.build of a villager)
const canRaise = (u) => isSoldier(u) && !UNIT[u.kind].tags.includes('mounted') && !UNIT[u.kind].tags.includes('siege') && !u.tgt && (u.state === 'home' || (u.state === 'goto' && hyp(u.px - u.x, u.py - u.y) < 60)) && !(u.chg > G.t) && !u.goingHome; // at home or arrived where it was sent
function campRaise(u, dt, SP) {
	const needs = (b) => b.prog < 1 || b.hp < maxHpB(b.owner, b.kind) * CAMP.mend; // unraised, or worn under CAMP.mend
	if (u.site && (!needs(u.site) || u.site.hp <= 0)) u.site = null;
	if (!u.site) {
		if ((G.tick + u.id) % 15 !== 0 || !canRaise(u)) return false;
		let best = null,
			bd = 160;
		const taken = new Map(); // who is already on each piece: the hands spread over the pieces (a crowd on one piece builds it little faster)
		for (const v of G.units) if (v.site && v.owner === u.owner && v !== u) taken.set(v.site, (taken.get(v.site) || 0) + 1);
		for (const b of G.blds)
			if (b.owner === u.owner && b.camp && needs(b) && b.hp > 0) {
				const d = dist(u, b) + 60 * (taken.get(b) || 0);
				if (d < bd + 60 * 3 && (best === null || d < bd)) {
					bd = d;
					best = b;
				}
			}
		u.site = best;
		u.siteK = u.state + u.px + ',' + u.py; // a new order (a new spot) takes it off the work
		if (!best) return false;
	}
	const b = u.site;
	if (!b || !needs(b) || b.hp <= 0 || u.tgt || u.state === 'rout' || u.chg > G.t || u.goingHome || u.siteK !== u.state + u.px + ',' + u.py) {
		u.site = null;
		return false;
	}
	if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return true; // as a villager raising a site (13-sim-civil repairTick)
	{
		const hands = CAMP.build * fxv(u.owner, 'campbuild').m;
		if (b.prog < 1) b.crew = (b.crew || 0) + hands;
		else b.hp = Math.min(maxHpB(b.owner, b.kind), b.hp + ((maxHpB(b.owner, b.kind) * 0.9 * hands) / BLD[b.kind].t) * dt); // mending at the raising rate
		u.work = G.t;
	}
	return true;
}
// a soldier by a medical tent that is badly hurt or sick walks home to the Hospital (none: it stays and is bound where it is)
function campSendHome(u) {
	if (u.owner === WILD || (G.tick + u.id) % 30 !== 0 || u.tgt || u.state === 'rout' || u.goingHome) return;
	if (!(u.hp < u.max * CAMP.sendHome || u.sick > G.t)) return;
	const tent = G.blds.find((b) => b.owner === u.owner && b.kind === 'medtent' && b.prog >= 1 && b.hp > 0 && dist(b, u) < BLD.medtent.hrng);
	if (!tent) return;
	const hosp = G.blds.find((b) => b.owner === u.owner && b.kind === 'hospital' && b.prog >= 1 && b.hp > 0);
	if (!hosp) return;
	u.state = 'goto';
	u.px = hosp.x + 30;
	u.py = hosp.y + 30;
	u.goingHome = true;
	u.drill = null;
	u.amb = null;
	u.focus = null;
	if (u.owner === 0) say(`${UNIT[u.kind].name} sent home to the Hospital.`, '', TOAST.short);
}

// ── step 2: supplies, the caravan's run, wear and mending, the camp as a pool for sickness
const depotsOf = (o) => G.blds.filter((b) => b.owner === o && b.kind === 'depot' && b.prog >= 1 && b.hp > 0);
const depotNear = (u) => depotsOf(u.owner).find((b) => dist(b, u) < CAMP.reach) || null; // the depot a unit eats from
// every second (36-economy upkeepTick): the soldiers in a camp's reach eat from its depot (eats(u): the food a unit eats a second); with it empty they are unsupplied
function campEat(o, eats) {
	const D = depotsOf(o);
	if (!D.length) return 0;
	let fed = 0;
	for (const u of G.units) {
		if (u.owner !== o || !isSoldier(u) || u.inside) continue;
		const d = D.find((b) => dist(b, u) < CAMP.reach);
		if (!d) {
			u.unfed = 0;
			continue;
		}
		const eat = eats(u);
		if ((d.supply || 0) >= eat) {
			d.supply -= eat;
			fed += eat;
			u.unfed = 0;
		} else {
			u.unfed = (u.unfed || 0) + 1;
			u.tired = Math.max(u.tired || 0, G.t + 2); // unsupplied: slow, and no mending (14-sim-troops)
			if (o === 0 && !(G.unfedT > G.t - 60)) {
				G.unfedT = G.t;
				news('war', 'The camp is out of food: a caravan brings it.', 'warn', TOAST.long, d);
			}
		}
	}
	return fed; // the food eaten here, off the town's bill
}
// a Market caravan with nothing to carry runs food to a depot under half (caravanTick): the food from the store and the carter's fee in gold
function supplyRun(u, dt, SP) {
	const o = u.owner,
		p = G.P[o];
	if (!u.sup) {
		if ((G.tick + u.id) % 30) return false;
		const home = nearest(G.blds, u, (b) => b.owner === o && b.kind === 'market' && b.prog >= 1 && b.hp > 0);
		if (!home) return false;
		const d = nearest(depotsOf(o), home, (b) => (b.supply || 0) < CAMP.supply / 2 && !G.units.some((v) => v.sup && v.sup.b === b.id && v.hp > 0));
		if (!d) return false;
		const fee = Math.ceil((CAMP.fee * dist(home, d)) / 100),
			food = Math.min(CAMP.load, Math.floor(p.res.f - 50));
		if (food < 20 || p.res.g < fee) return false;
		u.sup = { b: d.id, h: home.id, leg: 'load', food, fee };
		return true;
	}
	const S = u.sup,
		d = byId(G.blds, S.b),
		h = byId(G.blds, S.h);
	if (!d || d.hp <= 0 || !h || h.hp <= 0) {
		u.sup = null;
		return false;
	}
	if (S.leg === 'load') {
		if (!moveTo(u, h.x, h.y, dt, halfOf(h) + 4, SP)) return true;
		const food = Math.min(S.food, Math.floor(p.res.f));
		if (food < 20 || p.res.g < S.fee) {
			u.sup = null;
			return false;
		}
		spend(p, 'f', food, 'camps');
		spend(p, 'g', S.fee, 'camps');
		S.food = food;
		S.leg = 'go';
		return true;
	}
	if (S.leg === 'go') {
		if (!moveTo(u, d.x, d.y, dt, halfOf(d) + 14, SP)) return true;
		d.supply = Math.min(CAMP.supply, (d.supply || 0) + S.food);
		if (o === 0) say(`Depot stocked: ${S.food} food, ${S.fee} gold for the road.`, 'good', TOAST.short);
		S.leg = 'back';
		return true;
	}
	if (!moveTo(u, h.x, h.y, dt, halfOf(h) + 4, SP)) return true;
	u.sup = null;
	return false;
}
// a minute of rain, snow or frost takes CAMP.wear of a camp piece's health (every minute; 36-economy econTick)
function campWearTick() {
	const wet = G.wx === 'rain' || G.wx === 'snow' || G.wx === 'frost' || G.wx === 'blizzard';
	if (!wet) return;
	for (const b of G.blds) if (b.camp && b.prog >= 1 && b.hp > 0) b.hp = Math.max(1, b.hp - CAMP.wear * maxHpB(b.owner, b.kind));
}
