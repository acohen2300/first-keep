// ═════ 13-sim-civil.js: villagers, hunters, repairers, scouts, envoys, caravans, spies ═════
// A worker at a workshop, a mint or a foundry works inside it (Build 53, Albert: "a worker who works in a shop should be in the shop"):
// it walks to the door and goes in; what it makes goes straight to the stores, as a shepherd's milk does; it comes out when its work
// there ends, or the building does. Indoors it is not drawn, not scared and not shot; a raider must break the building. No standing
// spot beside the wall is ever needed (the boxed-in villager of Build 52b stood in a one-square pocket at a workshop's corner).
function shopTick(u, dt) {
	const n = u.node,
		b = n && n.farm;
	if (!b || b.id !== u.shop || b.hp <= 0 || u.job !== n.type || !makeOf(b)) {
		if (u.inside) stepOut(u, b);
		u.shop = 0;
		return;
	}
	const g = makeNow(u, n, dt, Infinity);
	if (g > 0) {
		stash(u.owner, n.type, g);
		u.st.got += g;
		b.made = (b.made || 0) + g; // what this workshop has made, counted on the building (E2: its card read the worker's lifetime gathering)
	}
}
// what a worker's own state does to its work: sick, weakened by a famine (hungerOf), cheered by the circus (one home: C15)
const workMul = (u) =>
	(u.sick > G.t ? 0.5 : 1) * hungerOf(u.owner) * (u.cheer > G.t ? EVENTS.circus.mul : 1);
// what a worker makes in this moment from a field, a find or a workshop's inputs (which it takes from the stores), at most `room`
function makeNow(u, n, dt, room) {
	const rate = n.rate || RATE_OF[n.kind];
	let g = Math.min(rate * dt * gatherMul(u.owner, n) * workMul(u), n.amt, room);
	const mk = n.farm && makeOf(n.farm),
		from = mk && mk.from; // a workshop turns what is in store into something else: 2 wool make 1 cloth, 3 wood 1 iron
	if (from) {
		const P = G.P[u.owner],
			box = (k) => (k in P.res ? P.res : P.goods);
		for (const k in from) g = Math.min(g, (box(k)[k] || 0) / from[k]);
		if (g <= 1e-6) {
			u.wait = true;
			return 0;
		}
		for (const k in from) {
			if (k in P.res)
				spend(P, k, g * from[k], 'shops'); // what a shop uses is spent like any coin, so the stores' colour tells the truth
			else P.goods[k] -= g * from[k];
		}
	}
	u.wait = false;
	n.amt -= g;
	n.workT = G.t;
	u.work = G.t;
	return g;
}
// Where each one stands: one home for every spot (decision 1; item 5). The waiters at a drop-off, the villagers sent to a tapped point, anyone
// stepping out of a building and the places of a battalion's shape each stand on a spot of their own, SPACE (3 ft) apart.
// A building's spots run round its outline, all four sides, on the free lane square's middle. The outline is cut into the same whole number
// of parts, k, on every side, each at least SPACE, with a spot on every corner: then no two spots are closer than SPACE, the corners too (a
// turn puts its two neighbours √2 parts apart). Spot i of N = 4k walks it clockwise from the top-left corner.
// A point's spots lie on the hex lattice round it, nearest first: n of them fill a disc of radius R ≈ 0.525·d·√n (hex packing: n circles of
// diameter d cover π/(2√3) = 0.9069 of the disc, so πR²·0.9069 = n·π(d/2)², R = (d/2)·√(n/0.9069)). Rings enough for everyone (POPMAX + ARMYMAX),
// two to spare for spots that are not free.
const LATTICE = (() => {
	const P = [],
		R = Math.ceil(0.525 * Math.sqrt(POPMAX + ARMYMAX)) + 2;
	for (let r = -R; r <= R; r++)
		for (let q = -R; q <= R; q++) {
			const x = q + r / 2,
				y = (r * Math.sqrt(3)) / 2,
				d = hyp(x, y);
			if (d <= R + 1e-9) P.push({ x, y, d: Math.round(d * 1e6), a: Math.atan2(y, x) });
		}
	return P.sort((p, q) => p.d - q.d || p.a - q.a);
})();
function spotAt(b, i) {
	if (!BLD[b.kind]) {
		const h = LATTICE[i];
		return { N: LATTICE.length, x: b.x + h.x * SPACE, y: b.y + h.y * SPACE };
	}
	const R = halfOf(b) + NAVC / 2,
		k = Math.max(1, Math.floor((2 * R) / SPACE)),
		N = 4 * k,
		e = Math.floor((i % N) / k),
		t = ((i % k) * 2 * R) / k - R;
	return { N, ...[{ x: b.x + t, y: b.y - R }, { x: b.x + R, y: b.y + t }, { x: b.x - t, y: b.y + R }, { x: b.x - R, y: b.y - t }][e] };
}
// How many can work a find at once (Albert, Nov 1, 12:57): the working spots on the ring it is worked from (WORK_R), SPACE apart; a tree
// takes one feller (OSHA 29 CFR 1910.266(d)(6)(ii): fellers at least two tree lengths apart). Fields keep their own one (slotsOf)
const findCap = (n) => (n.kind === 'tree' ? 1 : Math.max(1, Math.floor((2 * Math.PI * (WORK_R[n.kind] ?? WORK_R.other)) / SPACE)));
// the walking region a point belongs to: its own square's, else the nearest open square's (a tap on a tree or a wall)
const regionAt = (p, o) => {
	const c = gcell(p.x, p.y);
	if (!blockedCell(c, o)) return NAV.comp[c];
	const f = freeNear(Math.floor(p.x / NAVC), Math.floor(p.y / NAVC), o, 3, p.x, p.y);
	return f ? NAV.comp[f.cy * NC + f.cx] : 0;
};
// A spot is free for o when it keeps personal space from the map's edge, its square is open, it lies in the region cm (when given: the same
// side of water and walls), and nobody but the units in skip stands within half of SPACE.
function spotFree(p, o, cm, skip) {
	const c = gcell(p.x, p.y);
	if (p.x < SPACE || p.y < SPACE || p.x > MAP - SPACE || p.y > MAP - SPACE || blockedCell(c, o) || (cm && NAV.comp[c] !== cm)) return false;
	let stood = false;
	unitsNear(p, SPACE / 2, (v) => {
		if (!stood && !skip.has(v) && v.hp > 0 && !v.inside) stood = true;
	});
	return !stood;
}
// The spots at a (a building's outline or a point's lattice; key names it in a claim) for the units in list: free (spotFree) and claimed by
// no one else (a waiter's spot, a post). A building offers its whole outline, a point its nearest list.length free spots. Then the pairs, the
// cheapest walk first (greedy assignment): each unit its own spot, and one whose nearest is taken takes the next free one. The sort is stable
// and the pairs are laid unit by unit, so a tie goes to the earlier unit, then the lower spot: one seed stands them one way.
function takeSpots(list, a, key, cm = BLD[a.kind] ? 0 : regionAt(a, list[0].owner)) {
	const N = spotAt(a, 0).N,
		want = BLD[a.kind] ? N : list.length,
		o = list[0].owner,
		mine = new Set(list),
		claimed = new Set(),
		free = [];
	if (key != null)
		for (const v of G.units) {
			const s = !mine.has(v) && (v.spot || v.post);
			if (s && s.b === key) claimed.add(s.i);
		}
	for (let i = 0; i < N && free.length < want; i++) {
		const p = spotAt(a, i);
		if (!claimed.has(i) && spotFree(p, o, cm, mine)) free.push({ i, x: p.x, y: p.y });
	}
	const got = new Map();
	if (!BLD[a.kind]) {
		// a group sent to a point (item 5): the first to arrive takes the far side, the last the near side, so nobody has to push through
		// those already standing (the nearest-first pairing sent the last ones across the crowd, and the push kept them off for good)
		const cx = list.reduce((s, u) => s + u.x, 0) / list.length - a.x,
			cy = list.reduce((s, u) => s + u.y, 0) / list.length - a.y,
			L = [...list].sort((u, v) => dist(u, a) - dist(v, a)),
			S = [...free].sort((p, q) => (p.x - a.x) * cx + (p.y - a.y) * cy - ((q.x - a.x) * cx + (q.y - a.y) * cy));
		L.forEach((u, i) => S[i] && got.set(u, S[i]));
		return got;
	}
	const pairs = [];
	for (const u of list) for (const p of free) pairs.push({ u, p, c: dist(p, u) });
	pairs.sort((x, y) => x.c - y.c);
	const used = new Set();
	for (const { u, p } of pairs)
		if (!got.has(u) && !used.has(p.i)) {
			got.set(u, p);
			used.add(p.i);
		}
	return got;
}
// villagers sent to a tapped point: each walks to its own spot round it and stops there (item 5; they all made for the one point)
function postTo(list, at) {
	if (!list.length) return;
	const key = `${Math.round(at.x)},${Math.round(at.y)}`,
		got = takeSpots(list, at, key);
	for (const u of list) {
		const p = got.get(u);
		u.post = p ? { x: p.x, y: p.y, b: key, i: p.i } : { x: at.x, y: at.y };
	}
}
// out of a building: onto the nearest free spot of its outline (item 5; it was set down 30 below the middle, whatever stood there); with the
// whole outline taken, onto the nearest free spot of the lattice round it, the next ring out (its inner rings fall on the building's squares)
function stepOut(u, b) {
	u.inside = false;
	const p = b && (takeSpots([u], b, b.id).get(u) || takeSpots([u], { x: b.x, y: b.y }, null).get(u));
	if (p) {
		u.x = p.x;
		u.y = p.y;
	}
}
// A waiter takes the free spot nearest it at its drop-off, once, and keeps it until it has a find again.
function waitAt(u, dt, SP) {
	let b = u.spot && G.blds.find((x) => x.id === u.spot.b && x.hp > 0);
	if (!b) {
		// a spot on the nearest drop-off for its job; when every spot there is taken, the next drop-off, nearest first (Build 80 preview 13:
		// the overflow froze where it stood, a pile on one side of the mill). Only with no spot on any does it stand where it is and ask again
		let p = null;
		for (const c of G.blds
			.filter((x) => standing(x, u.owner) && BLD[x.kind].drop && BLD[x.kind].drop.includes(u.job))
			.sort((x, y) => dist(x, u) - dist(y, u))) {
			p = takeSpots([u], c, c.id).get(u);
			if (p) {
				b = c;
				break;
			}
		}
		if (!p) return;
		u.spot = { b: b.id, i: p.i };
		if (u.owner === 0) {
			const full = G.nodes.some((n) => n.kind === u.was && n.amt > 0 && (n.wk || 0) >= findCap(n)); // some stand, every spot on them taken
			news(
				'home',
				full
					? `Every ${u.was} is full: one waits at the ${bldName(0, b.kind).toLowerCase()}.`
					: `No ${u.was === 'tree' ? 'trees' : u.was} in sight: one waits at the ${bldName(0, b.kind).toLowerCase()}.`,
				'',
				TOAST.mid,
				u,
			);
		}
	}
	const p = spotAt(b, u.spot.i);
	moveTo(u, p.x, p.y, dt, 2, SP, true);
}
function vilTick(u, dt, SP) {
	u.idle = false;
	if (u.inside && u.shop) {
		shopTick(u, dt);
		return;
	}
	const kk = keepOf(u.owner),
		rb = (u.hid && G.blds.find((b) => b.id === u.hid && b.hp > 0 && b.prog >= 1)) || kk; // where it hides: the Town Center, or a tower with room
	if (u.inside) {
		// sheltering: out again when no enemy soldier is near the place
		if (!rb) {
			u.inside = false;
			return;
		}
		if (!u.emg && (G.tick + u.id) % 10 === 0 && !nearU(rb, SHELTER.clear, (v) => v.thr && isFoe(u.owner, v))) {
			stepOut(u, rb);
			u.scared = false;
			u.hid = 0;
		}
		return;
	}
	if ((G.tick + u.id) % 5 === 0) {
		const was = u.scared,
			r = was ? SHELTER.flee * 1.6 : SHELTER.flee;
		let wild = 0,
			foe = 0; // enemy soldiers scare everyone near; a lone beast or robber scares only the one it hits, three or more (a pack) scare all; once running, keeps running until well clear
		unitsNear(u, r, (v) => {
			if (v.thr && v !== u.hunt && isFoe(u.owner, v) && dist(u, v) < r) {
				if (v.owner === WILD) wild++;
				else foe++;
			}
		});
		u.scared =
			!!kk && (u.emg || foe > 0 || (wild > 0 && (wild >= SHELTER.raid || G.t - (u.hurtT || -99) < SHELTER.hurt)));
		if (u.scared && !was) {
			const tw = nearest(
				G.blds,
				u,
				(b) =>
					b.owner === u.owner &&
					b.kind !== 'keep' &&
					BLD[b.kind].shelter &&
					b.prog >= 1 &&
					b.hp > 0 &&
					G.units.filter((v) => v.inside && v.hid === b.id).length < shelterOf(b.owner, b.kind),
				220,
			);
			u.hid = tw && dist(u, tw) < dist(u, kk) ? tw.id : kk.id;
			const P = G.P[u.owner],
				S = P.scares || (P.scares = []);
			if (dist(u, kk) > DANGER_R.far && !S.some((s) => dist(s, u) < DANGER_R.mem)) {
				S.push({ x: Math.round(u.x), y: Math.round(u.y), t: G.t + DANGER_R.secs });
				if (S.length > DANGER_R.keep) S.shift();
			}
		} // out in the open, the side remembers where it was frightened, and keeps its workers off that ground for a while (Build 48: they walked straight back to the wolves)
	}
	if (u.scared && kk) {
		if (u.safe) {
			moveTo(u, u.safe.x, u.safe.y, dt, 6, SP); // no room inside: waits behind the Town Center
			return;
		}
		if (moveTo(u, rb.x, rb.y, dt, BLD[rb.kind].fp * 5 + 4, SP)) {
			u.inside = true;
			u.shop = 0;
			setJob(u, u.job);
			u.node = null;
			u.hunt = null;
		}
		return;
	}
	// decision 1, the lost find. The search clock (lostT), the waiting spot and the find seen on the way live only while a villager has no find:
	// any find, by any path (the player's order too), clears them here, the one home. The moment a wild find runs out, it looks from that spot
	// and remembers the best it sees; it delivers what it carries first, then goes straight there.
	if (!u.job || u.hunt || (u.node && u.node.amt > 0)) {
		u.lostT = undefined;
		u.spot = null;
		u.next = null;
	} else if (u.lostT === undefined && u.node && !u.node.farm) {
		u.was = u.node.kind;
		u.lostT = G.t;
		const n = nearestNode(u, u.job, u);
		u.next = n && !n.hunt ? n.id : null;
	}
	const cap = carryOf(u.owner);
	if (
		u.carry > 0 &&
		(u.carry >= cap - 1e-6 || u.carryType !== u.job || !u.job || (!u.hunt && (!u.node || u.node.amt <= 0)))
	) {
		if (
			!(
				u.drop &&
				u.drop.hp > 0 &&
				u.dropT === u.carryType &&
				u.dropN === G.blds.length &&
				u.dropR === G.blds &&
				u.dropV === G.bldV &&
				u.dropAt === u.node
			)
		) {
			u.drop = dropFor(u.owner, u.carryType, u);
			u.dropT = u.carryType;
			u.dropN = G.blds.length;
			u.dropR = G.blds;
			u.dropV = G.bldV;
			u.dropAt = u.node;
		}
		const drop = u.drop;
		if (!drop) {
			u.idle = true;
			return;
		}
		if (moveTo(u, drop.x, drop.y, dt, halfOf(drop) + 4, SP)) {
			const got = u.carry; // the load as carried: rounding made and lost resources at the drop-off (C11)
			stash(u.owner, u.carryType, got);
			u.st.got += got;
			u.st.trips++;
			u.carry = 0;
		}
		if (u.carry > 0 || u.hunt || !u.node || u.node.amt > 0) return;
	}
	if (u.job === 'repair') {
		if (u.hunt)
			huntTick(u, dt, SP); // bitten at its site: the beast first (hunt A #3)
		else repairTick(u, dt, SP);
		return;
	}
	if (!u.job) {
		u.idle = true;
		if (u.post) moveTo(u, u.post.x, u.post.y, dt, 2, SP, !!u.post.b); // its own spot (a lattice place): within ARRIVE; a bare point shared with others (the Emergency's ring): within personal space, standing where it was pushed (10a; Nov 3: seven on one point shuffled for ever)
		else if (kk) moveTo(u, kk.x + u.ox, kk.y + u.oy, dt, 2, SP);
		return;
	} // sent somewhere by the finger, it stands there; else it waits by the Town Center
	if (
		(G.tick + u.id) % 20 === 0 &&
		((u.node && u.node.kind !== 'farm' && unsafe(u.node, u.owner)) ||
			(u.hunt && unsafe(u.hunt, u.owner)) ||
			(u.node && u.node.kind === 'fish' && !dockNear(u.owner, u.node)))
	) {
		const at = u.hunt || u.node,
			why = u.node && u.node.kind === 'fish' && !dockNear(u.owner, u.node) ? { w: 'No dock near' } : dangerWhy(at, u.owner);
		if (!(why.scare && u.sent && u.node && u.fn === u.node.id)) {
			if (u.owner === 0 && u.sent) say(`${why.scare ? 'Someone was frightened here' : why.w}: a villager leaves the ${u.node ? nodeName(u.node).toLowerCase() : 'hunt'}.`, 'warn', TOAST.mid);
			u.sent = false;
			if (u.node && u.node.farm) crowd(u.node, -1);
			u.node = null;
			u.hunt = null;
		} // your own order outlasts a fright remembered there (Albert, Nov 3); a real danger it does not, and it says why
	} // work or game is on dangerous ground now, or a fisher's dock is gone (C15): leave it
	if (u.hunt) {
		huntTick(u, dt, SP);
		return;
	}
	const flock =
		u.node && u.node.farm && BLD[u.node.farm.kind].sheep && u.node.farm.hp > 0 && u.node.wk <= slotsOf(u.node); // a shepherd stays with the flock between shearings; one to a flock, as one to a field (Build 60: any number stacked, each milking the whole flock)
	if (flock && u.node.farm.prog >= 1 && dist(u, u.node) < 40) {
		const b = u.node.farm,
			m = (b.sheep || 0) * BLD[b.kind].milk * dt * gatherMul(u.owner, u.node) * workMul(u);
		if (m > 0) {
			stash(u.owner, 'food', m);
			u.st.got += m;
			u.work = G.t;
		}
	} // milk and meat go straight to the stores
	if (
		!flock &&
		u.node &&
		u.node.farm &&
		u.node.amt <= 0 &&
		u.node.farm.hp > 0 &&
		nodeFits(u.node, u.job) &&
		u.node.wk <= slotsOf(u.node)
	) {
		// a plot cut out or worked out: its worker stays with it, waiting for it to be replanted (Build 61: it used to walk off into the woods)
		u.wait = true;
		u.idle = true;
		if (u.owner !== 0 && G.P[u.owner].alive && (G.tick + u.id) % 150 === 0) replant(u.owner, u.node.farm.id); // a computer replants by itself: it has no finger
		moveTo(u, u.node.x, u.node.y, dt, 4, SP);
		return;
	}
	if (u.focus && !u.plot && !u.hunt && u.job && u.fn != null && (!u.node || u.node.amt <= 0)) {
		// focused on a find (D-093): back to that very find after shelter or a site; when it runs out, it waits on the spot (Z and F), and the
		// game never sends it to another
		const n = G.nodes.find((x) => x.id === u.fn && x.amt > 0);
		if (n && nodeFits(n, u.job) && (n.wk || 0) - (u.node === n ? 1 : 0) < findCap(n)) {
			if (u.node !== n) crowd(n, 1);
			u.node = n;
		} else {
			u.node = null;
			u.idle = true;
			if (u.fpos) moveTo(u, u.fpos.x, u.fpos.y, dt, WORK_R.other, SP);
			return;
		}
	}
	if (u.plot && !u.node && !u.hunt && u.job) {
		// posted (D-089): back from shelter, the Emergency, a fire or a site, it goes back to its own building; with its building not ready or
		// its place taken, it waits there. Only a fallen building sets it free to roam
		const b = byId(G.blds, u.plot);
		if (!b || b.hp <= 0) u.plot = null;
		else if (b.node && nodeFits(b.node, u.job)) {
			if (b.prog >= 1 && (b.node.wk || 0) < slotsOf(b.node)) {
				u.node = b.node;
				crowd(b.node, 1);
				u.was = 'farm';
			} else {
				// it waits on a spot of its own round its building (D-092: they made for its middle and shuffled), as waiters do at a drop-off
				u.idle = true;
				if (!u.spot || u.spot.b !== b.id) {
					const p = takeSpots([u], b, b.id).get(u);
					u.spot = p ? { b: b.id, i: p.i } : null;
				}
				const q = u.spot ? spotAt(b, u.spot.i) : b;
				moveTo(u, q.x, q.y, dt, u.spot ? 2 : halfOf(b) + 6, SP, true);
				return;
			}
		}
	}
	if (
		!flock &&
		(!u.node || u.node.amt <= 0 || !nodeFits(u.node, u.job) || (u.node.farm && u.node.wk > slotsOf(u.node)))
	) {
		if (u.node && u.node.farm) crowd(u.node, -1);
		if (posted(u)) {
			u.node = null;
			return;
		} // posted (D-089): it never looks for another building; next tick it goes back to its own, or waits there
		if (u.node) u.was = u.node.kind; // what it worked last: the next find must be of the same kind, in sight
		const lost = u.was && u.was !== 'farm' && !u.patch;
		if (u.nnT > G.t) {
			u.node = null;
			u.idle = true;
			if (lost) waitAt(u, dt, SP);
			return;
		} // nothing was found a moment ago: wait, do not search every step
		const seen = lost && u.next != null ? G.nodes.find((x) => x.id === u.next && x.amt > 0) : null;
		u.next = null;
		const n = seen || nearestNode(u, u.job, lost ? u.anchor || dropFor(u.owner, u.job, u) || u : undefined); // from the anchor: where it was placed, else its nearest drop-off
		if (!n && lost && u.pj && u.pj !== u.job) {
			const pj = u.pj;
			u.pj = null;
			setJob(u, pj); // a hunt or a chore is over: back to what it was doing
			return;
		}
		if (!n && !u.patch) {
			u.node = null;
			u.nnT = G.t + SEARCH.again + rng(); // nothing in reach: it keeps its job, waits (at the drop-off when its find was lost), and looks again, with no end
		}
		if (!n && u.patch) {
			// nothing open inside the box: cut in from the nearest open tree outside it; when the box is clear, back to work
			const r = u.patch,
				mid = { x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2 },
				left = G.nodes.some((t) => t.kind === 'tree' && t.amt > 0 && inBox(t, r));
			const way = left && nearest(G.nodes, mid, (t) => t.kind === 'tree' && t.amt > 0 && t.open, 260);
			if (way) {
				u.node = way;
				return;
			}
			u.patch = null;
			const pj = u.pj;
			u.pj = null;
			if (pj && pj !== u.job) setJob(u, pj);
			return;
		}
		if (n && n.hunt) {
			u.hunt = n.hunt;
			crowd(u.hunt, 1); // counted at once, as a find (recount sets it true every second)
			u.node = null;
			return;
		}
		u.node = n;
		if (n) crowd(n, 1); // counted at once, so the next worker this second sees the crowd (recount sets it true every second)
	} else if (
		!flock &&
		u.carry === 0 &&
		(u.evalV !== G.bldV || G.t > (u.chk || 0)) &&
		!(u.node.farm && BLD[u.node.farm.kind].makes)
	) {
		// look again, with an empty basket: after a new field or drop-off is built, and every so often (a field comes free, a find runs low).
		// Move only when the rate there is FORAGE.move better: nobody churns between two finds that pay the same.
		u.evalV = G.bldV;
		u.chk = G.t + 8 + rng() * 4;
		if (!u.node.farm) u.was = u.node.kind;
		const b = u.node.farm || u.focus ? null : bestNode(u, u.job); // a plot worker and a focused one stay put; a wild worker may step to a better find of the same kind in sight
		if (b && b.n !== u.node && b.R > FORAGE.move * forageNow(u)) {
			if (u.node.farm) crowd(u.node, -1);
			if (b.n.hunt) {
				u.hunt = b.n.hunt;
				u.node = null;
				return;
			}
			if (!u.node.farm) crowd(u.node, -1);
			u.node = b.n;
			crowd(b.n, 1);
		}
	}
	const n = u.node;
	if (!n) {
		u.idle = true;
		return;
	}
	if (n.farm && BLD[n.farm.kind].makes) {
		// a shop: in at the door (once it stands), and the work goes on inside. An open yard (BLD.open: the workshop, the foundry; Build 61,
		// Albert: "anything where a worker works inside should be open air") keeps the worker standing at its front, in sight and in reach
		const b = n.farm,
			open = BLD[b.kind].open;
		if (open && u.shop === b.id) {
			shopTick(u, dt);
			if (u.shop) {
				u.fx = 1;
				if ((G.tick + u.id) % 40 === 0) sfx(n.type === 'iron' ? 'mine' : 'pick', u.x, u.y);
			}
			return;
		}
		if (moveTo(u, b.x, open ? b.y + halfOf(b) + 3 : b.y, dt, open ? 3 : halfOf(b) + 4, SP) && b.prog >= 1) {
			if (u.carry > 0) {
				stash(u.owner, u.carryType, u.carry);
				u.st.got += u.carry;
				u.carry = 0;
			}
			u.inside = !open;
			u.shop = b.id;
		} else if (u.noPathT === G.t) leaveWork(u, n);
		return;
	}
	if (n.kind !== 'farm' && u.at !== n.id && (n.kind === 'tree' || dist(u, n) < (WORK_R[n.kind] ?? WORK_R.other) + 8)) {
		let held = 0;
		for (const v of G.units) if (v !== u && v.node === n && v.at === n.id) held++;
		if (held >= findCap(n)) {
			crowd(n, -1);
			u.node = null;
			return;
		} // a full find: a newcomer looks again (the search skips full finds); one that holds a spot keeps it
		u.at = n.id; // its spot is taken on arrival (a tree's at once: its feller stands short of it, in the clump)
	}
	// a worker already at work keeps its place a little further out (4 more), so crowd spacing and walking in no longer fight
	if (
		moveTo(
			u,
			n.x,
			n.y,
			dt,
			(n.kind === 'farm' ? 4 : (WORK_R[n.kind] ?? WORK_R.other)) + (G.t - (u.work || -9) < 0.5 ? 4 : 0),
			SP,
		)
	) {
		const g = makeNow(u, n, dt, cap - u.carry);
		if (g <= 0) return;
		u.carry += g;
		u.carryType = n.type;
		u.fx = Math.sign(n.x - u.x) || u.fx;
		if ((G.tick + u.id) % 40 === 0) sfx(n.type === 'wood' ? 'chop' : n.type === 'food' ? 'pick' : 'mine', u.x, u.y);
	} else if (u.noPathT === G.t) leaveWork(u, n);
}
// the way to this work ended short of it: there is no way there. Leave it for a while and take other work (Build 48: it stood at the dead end for good)
function leaveWork(u, n) {
	const B = u.bad || (u.bad = {});
	for (const id in B) if (B[id] <= G.t) delete B[id];
	B[n.id] = G.t + DANGER_R.secs;
	if (n.farm) crowd(n, -1);
	u.node = null;
	u.at = null;
}
function huntTick(u, dt, SP) {
	const a = u.hunt;
	if (!a || a.hp <= 0) {
		u.hunt = null;
		u.was = null; // the kill is butchered next, whatever it worked before
		return;
	}
	u.cd = Math.max(0, u.cd - dt);
	if (dist(u, a) <= UNIT.vil.rng) {
		if (u.cd <= 0) {
			hurt(u.owner, u, a, UNIT.vil.dmg * 5);
			u.cd = UNIT.vil.cd;
			u.hitT = G.t;
			shot(u.x, u.y, 6, a.x, a.y);
		}
		u.fx = Math.sign(a.x - u.x) || u.fx;
	} else moveTo(u, a.x, a.y, dt, UNIT.vil.rng - 4, SP);
}
// Mending: three times the build time for a full repair, a quarter of the cost, paid as the work goes.
// every way a repair or a fire ends sends the villager back to what it was doing before, or to nothing (C14: three exits did three things)
function backToWork(u) {
	const pj = u.pj,
		n = u.pn != null ? G.nodes.find((x) => x.id === u.pn && (x.amt > 0 || x.farm)) : null; // the very find or building it left, if it stands
	u.pj = null;
	u.rep = null;
	u.fireman = false;
	u.back = false;
	u.pn = null;
	setJob(u, pj && pj !== 'repair' ? pj : null, n && pj && nodeFits(n, pj) ? n : undefined, n ? u.pa || undefined : undefined); // a job with no find keeps its post (D-089)
	u.pa = null;
}
function repairTick(u, dt, SP) {
	let b = u.rep;
	const o = u.owner,
		p = G.P[o];
	if (b && b.hp > 0 && b.owner === o && b.prog >= 1 && u.building) {
		// the site it was raising is done: the next unfinished piece of wall nearby, else back to what it was doing
		u.building = false;
		if (u.back) {
			if (BLD[b.kind].drop && !u.plot && startWork(u, b)) {
				u.back = false;
				u.pn = u.pa = null;
				return;
			} // a mine, mill or lumber camp: its builder works the nearest find it serves (Albert, Nov 3, D-091 amended; Age of Empires II's camps)
			backToWork(u);
			return;
		} // pulled off its work to raise this one (D-091): straight back to it
		if (startWork(u, b)) return; // a field, a workshop, a dock or a camp: the builders start working it
		const open = (s) =>
			s.owner === o && s.hp > 0 && s.prog < 1 && !G.units.some((v) => v !== u && v.rep === s && v.job === 'repair');
		const nx =
			(BLD[b.kind].wallish &&
				nearest(G.blds, u, (s) => s.owner === o && s.hp > 0 && s.prog < 1 && BLD[s.kind].wallish, 60)) ||
			nearest(G.blds, u, open, 220);
		if (nx) {
			u.rep = b = nx;
			u.building = true;
		} else {
			backToWork(u);
			return;
		}
	}
	if (u.fireman && !(b && b.hp > 0 && b.fire > 0)) {
		u.fireman = false;
		backToWork(u);
		return;
	} // the fire is out: back to work
	if (!b || b.hp <= 0 || b.owner !== o) {
		u.building = false;
		backToWork(u);
		return;
	}
	if (b.fire > 0) {
		if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return;
		if (!b.smoke && (b.spread || b.hp < maxHpB(o, b.kind) / 2) && rng() < FIRE_SMOKE * dt) {
			b.smoke = true;
			u.hp = 0;
			if (o === 0) news('home', `Smoke killed a villager at the ${bldName(0, b.kind).toLowerCase()}.`, 'warn', TOAST.mid, b);
			return;
		} // a big fire can take one of its fighters
		b.fire = Math.max(0, b.fire - 0.2 * dt);
		u.work = G.t;
		if (!b.fire && b.owner === 0) news('home', `The fire at the ${bldName(0, b.kind).toLowerCase()} is out.`, 'good', TOAST.mid, b);
		return;
	}
	if (b.prog < 1) {
		// raising a site: walk there and work it
		u.building = true;
		if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return;
		b.crew = (b.crew || 0) + 1;
		u.work = G.t;
		return;
	}
	if (b.hp >= maxHpB(o, b.kind) - 0.5) {
		backToWork(u);
		return;
	}
	if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return;
	const M = maxHpB(o, b.kind),
		heal = Math.min(M - b.hp, (M / (BLD[b.kind].t || 60) / 3) * dt),
		cost = BLD[b.kind].cost || { w: 200, s: 100 };
	b.rd = b.rd || {};
	const due = {};
	let short = false; // check every part of the bill before paying any of it
	for (const [k, v] of Object.entries(cost)) {
		const r = (b.rd[k] || 0) + (v * 0.25 * heal) / M,
			whole = Math.floor(r);
		due[k] = r;
		if (whole > 0 && p.res[k] < whole) short = true;
	}
	if (short) {
		backToWork(u);
		if (o === 0 && G.t - (G.repSay || -99) > 5) {
			G.repSay = G.t;
			say('Not enough to pay for repairs.', '', TOAST.short);
		}
		return;
	}
	for (const k in due) {
		const whole = Math.floor(due[k]);
		spend(p, k, whole, 'repairs');
		b.rd[k] = due[k] - whole;
	}
	b.hp += heal;
	u.work = G.t;
}

// ───────────────────────── Other people ─────────────────────────
const homeSpot = (u, d) => {
	if (u.hax !== undefined && u.state === 'home') return { x: u.hax, y: u.hay };
	const k = keepOf(u.owner);
	if (!k) return null;
	const g = towardMid(k, d);
	return { x: g.x + (u.gx ?? u.ox), y: g.y + (u.gy ?? u.oy) };
};
function scoutTick(u, dt, SP) {
	if (u.state === 'goto') {
		if (moveTo(u, u.px, u.py, dt, 6, SP)) u.state = 'home';
		return;
	}
	// free treasure first (no guards left), then a loop of the map
	if ((G.tick + u.id) % 30 === 0) {
		const f = nearest(
			G.finds,
			u,
			(f) =>
				!f.done &&
				FINDS[f.kind].got &&
				!guardsLeft(f) &&
				!G.units.some((v) => v.owner !== u.owner && v.owner !== WILD && dist(v, f) < 30),
			900,
		);
		u.goal = f ? { x: f.x, y: f.y } : null;
	}
	if (u.goal) {
		if (moveTo(u, u.goal.x, u.goal.y, dt, 8, SP)) u.goal = null;
		return;
	}
	if (!u.route) {
		const S = PLACES.scout,
			e = S.edge,
			c = [
				[MID, MAP - e],
				[MAP - e, MID],
				[MID, e],
				[e, MID],
				...[1, 2, 3, 0].map((o) => G.P[o].keep.map((v) => v + Math.sign(MID - v) * S.keep)), // in front of each Town Center, where it stands
				[MID - S.mid, MID - S.mid],
				[MID + S.mid, MID + S.mid],
			];
		u.route = c
			.map(([x, y]) => ({ x: x + rnd(-40, 40), y: y + rnd(-40, 40) }))
			.sort((a, b) => Math.atan2(a.y - MID, a.x - MID) - Math.atan2(b.y - MID, b.x - MID));
		u.wp = u.route.reduce((bi, w, i, A) => (dist(w, u) < dist(A[bi], u) ? i : bi), 0);
	}
	const w = u.route[u.wp % u.route.length];
	if (moveTo(u, w.x, w.y, dt, 8, SP)) u.wp = (u.wp + 1) % u.route.length;
}
function envoyTick(u, dt, SP) {
	if (u.state === 'envoy') {
		const k = homeOf(u.target, u);
		if (!k) {
			u.state = 'return';
			return;
		}
		if (moveTo(u, k.x, k.y, dt, 30, SP)) judgeEnvoy(u.target, u.owner, u);
	} else {
		const k = keepOf(u.owner);
		if (!k || moveTo(u, k.x, k.y, dt, 20, SP)) {
			u.hp = 0;
			u.gone = true;
		}
	}
}
// a caravan with no route trades with an ally: out from your Market to theirs, paid by distance on arrival, then home again
function caravanTick(u, dt, SP) {
	const o = u.owner;
	u.idle = false;
	if (G.P[o].techs.has('armedcart') && (G.tick + u.id) % 30 === 0) {
		const A = UNIT.caravan.armed,
			f = nearestFoe(o, u, A.rng);
		if (f) hurt(o, u, f, A.dmg);
	} // armed caravans strike back
	if (u.route) {
		routeTick(u, dt, SP);
		return;
	}
	if (supplyRun(u, dt, SP)) return; // food out to a camp's depot (CAMP)
	const home =
		G.blds.find((b) => b.id === u.lastId && b.hp > 0 && b.owner === o && b.kind === 'market') ||
		nearest(G.blds, u, (b) => b.owner === o && b.kind === 'market' && b.prog >= 1 && b.hp > 0);
	let d = u.dest ? G.blds.find((b) => b.id === u.dest && b.hp > 0) : null;
	if (d && d.owner !== o && G.rel[o][d.owner] !== 'ally') d = null; // the alliance broke: turn back
	if (!d) {
		const to = home && allyMarket(o, home);
		if (!to) {
			u.idle = true;
			u.dest = null;
			u.cargo = 0;
			if (home && dist(u, home) > halfOf(home) + 8) moveTo(u, home.x, home.y, dt, halfOf(home) + 4, SP);
			return;
		}
		u.dest = to.id;
		d = to;
		u.cargo = Math.min(TRADE_CAP, Math.floor((dist(home, to) ** 2 / TRADE_DIV) * fxv(o, 'trade').m));
		u.lastId = home.id;
	}
	if (moveTo(u, d.x, d.y, dt, halfOf(d) + 4, SP)) {
		if (d.owner !== o) {
			earn(G.P[o], 'g', u.cargo, 'trade');
			if (o === 0 && u.cargo) {
				news('trade', `A caravan earns ${u.cargo} gold from your ally.`, 'good', TOAST.short, d);
				sfx('tribute');
			}
			u.dest = u.lastId;
			u.cargo = 0;
		} else u.dest = null; // home: the next run
	}
}
function spyTick(u, dt, SP) {
	const o = u.owner,
		k = keepOf(o);
	u.idle = false;
	if ((G.tick + u.id) % 5 === 0) {
		if (o !== 0)
			u.exposed =
				atWar(0, o) &&
				(G.units.some((v) => v.owner === 0 && dist(v, u) < spySeen(0, v)) ||
					G.blds.some((b) => b.owner === 0 && watchtower(b) && dist(b, u) < spySeen(0, b)));
		for (const b of G.blds)
			if (atWar(o, b.owner) && b.owner !== WILD && b.hp > 0 && edge(u, b) < 60) {
				intel(o, b.owner);
				break;
			}
	}
	if (u.state === 'sab') {
		const b = G.blds.find((x) => x.id === u.tid && x.hp > 0);
		if (!b || !atWar(o, b.owner)) {
			u.state = 'home';
			return;
		}
		if (edge(u, b) <= 14) {
			if (!sabotage(u, b)) u.state = 'home';
			return;
		}
		moveTo(u, b.x, b.y, dt, 12 + halfOf(b), SP);
		return;
	}
	if (u.state === 'goto') {
		if (moveTo(u, u.px, u.py, dt, 4, SP) && o !== 0) u.state = 'look';
		return;
	}
	if (o !== 0) {
		// the computers' spy: stand off an enemy keep, take the first undefended target it can see
		if (u.state === 'look') {
			if ((G.tick + u.id) % 15) return; // it watches between checks, never walks home (C12)
			const best = nearest(
				G.blds,
				u,
				(b) => atWar(o, b.owner) && b.hp > 0 && BLD[b.kind].sab && !guarded(b),
				sightOf(u),
			);
			if (best) {
				u.state = 'sab';
				u.tid = best.id;
				return;
			}
			if (!u.lookT || G.t - u.lookT > 15) {
				u.lookT = G.t;
				u.ang = (u.ang || 0) + 1.3;
				const tk = u.tk !== undefined && keepOf(u.tk);
				if (tk) {
					u.px = clamp(tk.x + Math.cos(u.ang) * 230, 20, MAP - 20);
					u.py = clamp(tk.y + Math.sin(u.ang) * 230, 20, MAP - 20);
					u.state = 'goto';
				}
			}
			return;
		}
		if (u.state === 'home') {
			const q = G.P.find((q) => q.alive && q.id !== WILD && atWar(o, q.id) && keepOf(q.id));
			if (q && k) {
				const kp = keepOf(q.id);
				u.tk = q.id;
				u.px = kp.x + (k.x - kp.x) * 0.25;
				u.py = kp.y + (k.y - kp.y) * 0.25;
				u.state = 'goto';
				return;
			}
		}
	}
	if (k && (u.state === 'home' || u.state === 'look')) moveTo(u, k.x + u.ox, k.y + u.oy, dt, 2, SP);
}
