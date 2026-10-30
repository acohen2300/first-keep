// ═════ 16-sim-fight.js: damage, pushing apart, plunder, falling, scoring, finishing ═════
function hurt(o, a, t, base) {
	const A = a ? UNIT[a.kind] : {},
		isB = !!t.q;
	let d = base;
	if (isB) {
		d *= A.bld ?? 1;
		if (a && o !== WILD && t.prog >= 1 && BLD[t.kind].wood && !t.fire) {
			const keys = unitKeys(a.kind),
				blast = A.gun && fxv(o, 'blast', keys).a >= 1;
			if (
				(blast || fxv(o, 'fire', keys).a >= 1) &&
				rng() < (blast ? FIREARMS.blast : FIREARMS.chance) * fireMul()
			)
				ignite(t, 'a shot');
		} // fire arrows, burning shot, petards
		if (a && A.gun && fxv(o, 'blast', unitKeys(a.kind)).a >= 1)
			for (const n of G.blds)
				if (n !== t && n.hp > 0 && n.owner === t.owner && dist(n, t) < FIREARMS.splash) n.hp -= d * FIREARMS.splashHit; // the blast shakes the neighbours
	} else {
		if (a) d *= vsMul(a, t);
		if (a && o === WILD && t.kind === 'vil' && t.owner !== WILD && UNIT[a.kind].meat && !t.hunt) {
			// an animal attacks a villager: it and the two nearest villagers who can see it turn on the beast, kill it and butcher it, then go back to work (Build 61)
			const helpers = unitsOf(t.owner, 'vil').filter((v) => v !== t && !v.inside && !v.hunt && v.job !== 'repair' && dist(v, a) < sightOf(v)).sort((p, q) => dist(p, a) - dist(q, a)).slice(0, 2);
			for (const v of [t, ...helpers]) {
				v.pj = v.job === 'food' ? null : v.job;
				setJob(v, 'food');
				v.hunt = a;
			}
		}
		if (isSoldier(t)) {
			if (o === WILD && t.owner !== WILD) d *= MORALE.wild;
			if (t.state === 'rout') d *= MORALE.routHit;
			else if (t.fb > G.t) d *= FALLBACK.hit;
			const dot = a && t.fx !== undefined ? ((a.x - t.x) * t.fx + (a.y - t.y) * t.fy) / (dist(a, t) || 1) : 1;
			if (o !== WILD)
				t.mor -= ((MORALE.hit * d * (TEMPER[temperOf(t)].nerve || 1)) / t.max) * (dot < -0.5 ? MORALE.rear : dot < 0.5 ? MORALE.side : 1);
		} // nerve: a blow from the side counts half again, from behind twice; animals do not shake it
		if (a && a.native && !isB && onLand(t.x, t.y) && hyp(t.x - MID, t.y - MID) > THRONE.isle - 10) d *= NATIVE.ambush; // the Natives at the causeways: the ground is theirs
		if (a && A.gun && hasTag(t.kind, 'native')) d *= NATIVE.gunHit; // gunpowder against hide shields
		if (isSoldier(t) && t.owner !== WILD) {
			d *= stats(t.owner, t.kind).armor;
			{
				const F = shapeOf(t);
				d *= F.hit || 1;
				if (F.vsMounted && a && hasTag(a.kind, 'mounted')) d *= F.vsMounted;
			} // the battalion's shape
			if (a && A.rng <= 20 && t.fx !== undefined && (a.x - t.x) * t.fx + (a.y - t.y) * t.fy < -0.5 * (dist(a, t) || 1))
				d *= FLANK; // from behind the way it faces
		}
		if (UNIT[t.kind].rarmor && (!a || A.rng > 20)) d *= UNIT[t.kind].rarmor; // roofed: arrows and bolts glance off
	}
	t.hp -= d;
	t.hurtT = G.t;
	if (a && t.hp <= 0 && !isB && a.st) {
		a.st.kills++;
		if (a.owner !== WILD && t.owner !== a.owner) G.P[a.owner].kills = (G.P[a.owner].kills || 0) + 1;
		if (isSoldier(a)) a.mor = Math.min(1, a.mor + MORALE.kill);
	}
	if (t.native && o !== WILD && G.t - (natState().hitT ? natState().hitT[o] || -9 : -9) > 3) {
		(natState().hitT = natState().hitT || {})[o] = G.t;
		natRegard(o, -NATIVE.hitCost);
	} // blows on the Natives cost regard
	if (a && A.knock && !isB && t.hp > 0 && t.kind !== 'caravan') {
		// a heavy blow drives the target back and flashes it
		const dx = t.x - a.x,
			dy = t.y - a.y,
			dd = hyp(dx, dy) || 1,
			nx = t.x + (dx / dd) * A.knock,
			ny = t.y + (dy / dd) * A.knock;
		if (!blockedCell(gcell(nx, ny), t.owner)) {
			t.x = clamp(nx, 8, MAP - 8);
			t.y = clamp(ny, 8, MAP - 8);
		}
		t.flashT = G.t;
	}
	if (isB || t.kind === 'caravan') {
		if (o !== t.owner) t.by = o;
	} else if (t.owner === WILD) {
		t.aggro = a;
		t.by = o;
	}
	if (!lessMotion && SPARKS.length < 40) SPARKS.push({ x: t.x, y: t.y, t: G.t });
	sfx(
		A.gun ? (hasTag(a.kind, 'siege') ? 'boom' : 'shot') : isB ? 'bhit' : A.rng > 20 || !a ? 'arrow' : 'hit',
		t.x,
		t.y,
	);
	if (o !== WILD && t.owner !== WILD && !atWar(o, t.owner) && o !== t.owner)
		declareWar(o, t.owner, o === 0 ? 'you attacked them' : `${G.P[o].name} attacked`);
	if (t.owner === 0 && o !== 0) {
		G.hitT = G.t;
		G.hitWild = o === WILD;
		if (G.t - G.alertT > 12) {
			G.alertT = G.t;
			if (o !== WILD) sfx('horn');
			say(
				o === WILD
					? `${plural(UNIT[a ? a.kind : 'wolf'].name)} attack at ${coord(t.x, t.y)}`
					: `Under attack at ${coord(t.x, t.y)}`,
				'warn',
				7,
				t,
			);
		}
	}
}
// Crowd spacing, neighbours only: units are sorted into squares of 8 and each is compared with the units in its own and the next squares.
const CHW = Math.ceil(MAP / 8) + 1,
	CHEAD = new Int32Array(CHW * CHW),
	CHCELL = [];
let CHNEXT = new Int32Array(1024);
// Who gives way (Build 48; it was always half and half): one at work or in a fight hardly moves, one walking moves one standing about,
// one standing gives way. Nobody is pushed into a tree, a wall or water.
const heft = (u) => (u.tgt || G.t - (u.work ?? -9) < 0.5 ? 9 : G.t - (u.mvT ?? -9) < 0.25 ? 3 : 1);
function pushApart(a, b) {
	const dx = b.x - a.x,
		dy = b.y - a.y;
	if (dx > 8 || dx < -8 || dy > 8 || dy < -8) return;
	const d = hyp(dx, dy);
	if (d > 0 && d < 8) {
		const ha = heft(a),
			hb = heft(b),
			k = (8 - d) / d,
			pa = (k * hb) / (ha + hb),
			pb = (k * ha) / (ha + hb),
			ax = a.x - dx * pa,
			ay = a.y - dy * pa,
			bx = b.x + dx * pb,
			by = b.y + dy * pb;
		if (!blockedCell(gcell(ax, ay), a.owner)) {
			a.x = ax;
			a.y = ay;
		}
		if (!blockedCell(gcell(bx, by), b.owner)) {
			b.x = bx;
			b.y = by;
		}
	}
}
function collide() {
	const U = G.units,
		n = U.length;
	if (CHNEXT.length < n) CHNEXT = new Int32Array(n * 2);
	CHEAD.fill(-1);
	for (let i = 0; i < n; i++) {
		const u = U[i];
		if (u.inside) {
			CHCELL[i] = -1;
			continue;
		}
		const c = clamp((u.y / 8) | 0, 0, CHW - 1) * CHW + clamp((u.x / 8) | 0, 0, CHW - 1);
		CHCELL[i] = c;
		CHNEXT[i] = CHEAD[c];
		CHEAD[c] = i;
	}
	for (let i = 0; i < n; i++) {
		const c = CHCELL[i];
		if (c < 0) continue;
		const a = U[i],
			cx = c % CHW;
		for (let j = CHNEXT[i]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
		if (cx + 1 < CHW) for (let j = CHEAD[c + 1]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
		if (c + CHW < CHW * CHW) {
			for (let j = CHEAD[c + CHW]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
			if (cx + 1 < CHW) for (let j = CHEAD[c + CHW + 1]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
			if (cx > 0) for (let j = CHEAD[c + CHW - 1]; j >= 0; j = CHNEXT[j]) pushApart(a, U[j]);
		}
	}
	for (const u of U) {
		if (u.inside) continue;
		for (const L of G.lakes) {
			if (Math.abs(u.x - L.x) > L.r + 60 || Math.abs(u.y - L.y) > L.r + 60) continue; // far from this one: the cheap test first
			const dl = hyp(u.x - L.x, u.y - L.y),
				lr = lakeR(L);
			if (dl < lr + 6 && !u.fly && !onLand(u.x, u.y)) {
				const s = (lr + 6) / (dl || 1);
				u.x = L.x + (u.x - L.x) * s;
				u.y = L.y + (u.y - L.y) * s;
			}
		}
		u.x = clamp(u.x, 6, MAP - 6);
		u.y = clamp(u.y, 6, MAP - 6);
		if (blockedCell(gcell(u.x, u.y), u.owner)) {
			const f = freeNear(Math.floor(u.x / NAVC), Math.floor(u.y / NAVC), u.owner, 8, u.x, u.y);
			if (f) {
				u.x = f.x;
				u.y = f.y;
				u.path = null;
			}
		}
	}
}

// ───────────────────────── Plunder, falls, the score ─────────────────────────
// A destroyed building pays its destroyer a quarter of its cost; a fallen Town Center pays the whole stockpile and a quarter of everything left standing.
function plunder(to, got) {
	const P = G.P[to];
	let any = false;
	for (const [k, v] of Object.entries(got))
		if (v > 0) {
			earn(P, k, v, 'loot');
			any = true;
			if (to === 0) G.loot[k] = (G.loot[k] || 0) + v;
		}
	if (to === 0 && any) {
		G.lootT = G.t;
		sfx('coin');
	}
}
function plunderBld(b) {
	const to = b.by;
	b.by = undefined;
	if (to === b.owner || !G.P[to] || to === WILD) return;
	if (b.kind === 'keep') G.P[b.owner].killer = to;
	const got = {};
	for (const [k, v] of Object.entries(BLD[b.kind].cost || {})) got[k] = Math.floor(v * PLUNDER);
	plunder(to, got);
	sfx('crash', b.x, b.y);
}
function fall(p) {
	p.alive = false;
	const to = p.killer;
	if (to !== undefined && G.P[to] && to !== WILD) {
		const got = { ...p.res };
		for (const b of G.blds)
			if (b.owner === p.id && b.hp > 0) {
				for (const [k, v] of Object.entries(BLD[b.kind].cost || {})) got[k] = (got[k] || 0) + Math.floor(v * PLUNDER);
				b.by = undefined;
			}
		plunder(to, got);
		for (const k of Object.keys(p.res)) spend(p, k, p.res[k], 'loot'); // the fallen side's stores go with it
	}
	G.units.forEach((u) => {
		if (u.owner === p.id) {
			u.hp = 0;
			u.gone = true;
		}
	});
	G.blds.forEach((b) => {
		if (b.owner === p.id) {
			b.hp = 0;
			b.gone = true;
		}
	});
	{
		const left = G.P.filter((q) => q.alive && q.id !== WILD);
		for (const q of left) {
			q.capV = (q.capV || 0) + Math.floor((VILMAX * SHARE_FALLEN) / left.length);
			q.capA = (q.capA || 0) + Math.floor((ARMYMAX * SHARE_FALLEN) / left.length);
		}
		if (left.some((q) => q.id === 0))
			say(
				`Shared out: +${Math.floor((VILMAX * SHARE_FALLEN) / left.length)} villagers, +${Math.floor((ARMYMAX * SHARE_FALLEN) / left.length)} soldiers.`,
				'good',
				7,
			);
	} // a fallen side's room is shared
	for (const f of G.finds) if (f.owner === p.id && FINDS[f.kind].capture) f.owner = null;
	if (p.ally !== null) {
		const q = G.P[p.ally];
		if (q.ally === p.id) q.ally = null;
	}
	if (p.id) say(`${p.name} has fallen.`, 'good', 7);
	chron(`${p.id === 0 ? 'Your keep' : p.name} fell.`);
}
function scoreAll() {
	for (const p of G.P) {
		if (p.id === WILD) continue;
		const s = { people: 0, army: 0, tech: p.spent / SCORE.tech, bld: 0, wealth: p.gathered / SCORE.wealth };
		if (p.alive) {
			for (const u of G.units)
				if (u.owner === p.id && UNIT[u.kind].cls)
					s[UNIT[u.kind].cls === 'army' ? 'army' : 'people'] += sumCost(UNIT[u.kind].cost) / SCORE.unit;
			for (const b of G.blds)
				if (b.owner === p.id && b.prog >= 1 && b.hp > 0) s.bld += sumCost(BLD[b.kind].cost) / SCORE.bld;
		}
		for (const k in s) s[k] = Math.round(s[k]);
		s.total = s.people + s.army + s.tech + s.bld + s.wealth;
		p.score = s;
	}
}
function watchHome() {
	const k = keepOf(0);
	if (!k || G.tick % 15) return;
	const near = G.units.find((u) => atWar(0, u.owner) && u.owner !== WILD && isSoldier(u) && dist(u, k) < 340);
	if (near && G.t - G.warnT > 20) {
		G.warnT = G.t;
		say('Enemies at your town!', 'warn', 7, near);
	}
}
function finish(won, text, all) {
	G.over = won ? 'won' : 'lost';
	if (!all) chron(won ? 'Victory.' : 'Defeat.');
	clearSave();
	sfx(won ? 'win' : 'lose');
	scoreAll();
	if (won) {
		const k = keepOf(0);
		if (k) celebrate(3, k.x, k.y);
	}
	let best = null;
	try {
		best = Number(localStorage.getItem(keyOf('best'))) || null;
	} catch (e) {}
	const sc = Math.round(G.P[0].score.total * levelMul()); // the level played multiplies the score
	if (won && (!best || sc > best)) {
		best = sc;
		try {
			localStorage.setItem(keyOf('best'), String(sc));
		} catch (e) {}
	}
	showEnd(won, `${text} Score ${fmt(sc)}${best ? ' · best ' + fmt(best) : ''}.`, all);
}
const TICK = {
	vil: vilTick,
	scout: scoutTick,
	envoy: envoyTick,
	caravan: caravanTick,
	spy: spyTick,
	priest: priestTick,
	medic: medicTick,
	sol: solTick,
	wild: wildTick,
	wayfarer: wayfarerTick,
	herd: herdTick,
};

// builders who finish a place of work start on it: fields and workshops take them up to their places, a dock sets them fishing, a camp sends them to what it is for
const slotsOf = () => 1; // one worker to a field, a quarry, a workshop
function startWork(u, b) {
	const B = BLD[b.kind],
		take = (job, n) => {
			u.pj = null;
			setJob(u, job, n);
			return true;
		};
	if (B.crop && b.node) return (b.node.wk || 0) < slotsOf(b.node) && take(b.node.type, b.node);
	if (b.kind === 'dock') {
		const f = nearest(G.nodes, b, (n) => n.kind === 'fish' && n.amt > 0, DOCKR);
		return !!f && take('food', f);
	}
	if (B.drop && B.drop.length <= 3) {
		const n = nearest(
			G.nodes,
			b,
			(n) => B.drop.includes(n.type) && n.kind !== 'farm' && n.amt > 0 && (n.kind !== 'tree' || n.open),
			220,
		);
		return !!n && take(n.type, n);
	}
	return false;
}
