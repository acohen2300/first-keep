// ═════ 16-sim-fight.js: damage, pushing apart, plunder, falling, scoring, finishing ═════
// where a blow comes from, as the cosine between the line's facing and the attacker: 1 from the front, 0 from the side, −1 from behind.
// The front, whenever the man can turn to meet it or a comrade stands in the way (FLANKING).
function fromWhere(t, a) {
	if (t.fx === undefined) return 1;
	if (!((t.tgt && t.tgt !== a) || t.stuck > G.t || t.state === 'rout')) return 1; // free to turn: no blow is from behind
	const dx = a.x - t.x,
		dy = a.y - t.y,
		d = hyp(dx, dy) || 1;
	let covered = false,
		fx = t.fx, // its own facing first, then its group's (C3: a lone man summed nothing and took every blow from the side)
		fy = t.fy || 0;
	unitsNear(t, FLANKING.line, (v) => {
		if (v.owner !== t.owner || !isSoldier(v) || v.hp <= 0 || v.inside) return;
		fx += v.fx || 0;
		fy += v.fy || 0;
		if (covered) return;
		const ex = v.x - t.x,
			ey = v.y - t.y,
			e = hyp(ex, ey) || 1;
		if (e < FLANKING.cover && (ex * dx + ey * dy) / (e * d) > 0.5) covered = true;
	});
	if (covered) return 1;
	const f = hyp(fx, fy) || 1;
	return (dx * (fx / f) + dy * (fy / f)) / d;
}
function hurt(o, a, t, base) {
	const A = a ? UNIT[a.kind] : {},
		isB = !!t.q,
		beast = !!a && hasTag(a.kind, 'animal'); // the kind, not the owner (N4): a Native, an outlaw or a citadel tower hits full and shakes the nerve
	let d = base,
		from; // where the blow comes from, found once a blow (the damage and the nerve both read it)
	const fromOf = () => (from ??= a ? fromWhere(t, a) : 1);
	if (isB) {
		d *= (A.bld ?? 1) * (a && o !== WILD ? fxv(o, 'bld', unitKeys(a.kind)).m : 1); // against buildings: the unit's own factor, and research keyed to it (Hastin)
		if (a && o !== WILD && t.prog >= 1 && BLD[t.kind].wood && !t.fire) {
			const keys = unitKeys(a.kind),
				blast = A.gun && fxv(o, 'blast', keys).a >= 1;
			if ((blast || fxv(o, 'fire', keys).a >= 1) && rng() < (blast ? FIREARMS.blast : FIREARMS.chance) * fireMul())
				ignite(t, 'a shot');
		} // fire arrows, burning shot, petards
		if (a && A.gun && fxv(o, 'blast', unitKeys(a.kind)).a >= 1)
			for (const n of G.blds)
				if (n !== t && n.hp > 0 && n.owner === t.owner && dist(n, t) < FIREARMS.splash) {
					n.hp -= d * FIREARMS.splashHit;
					n.by = o;
					n.byT = G.t;
				} // the blast shakes the neighbours, and a neighbour it brings down pays its plunder (C9)
	} else {
		if (a) d *= vsMul(a, t);
		if (a && o === WILD && t.kind === 'vil' && t.owner !== WILD && UNIT[a.kind].meat && !t.hunt) {
			// an animal attacks a villager: it and the two nearest villagers who can see it turn on the beast, kill it and butcher it, then go back to work (Build 61)
			const helpers = unitsOf(t.owner, 'vil')
				.filter((v) => v !== t && !v.inside && !v.hunt && v.job !== 'repair' && dist(v, a) < sightOf(v))
				.sort((p, q) => dist(p, a) - dist(q, a))
				.slice(0, 2);
			for (const v of [t, ...helpers]) {
				v.hunt = a;
				if (v.job === 'repair') continue; // a builder fights back on its own job, then goes back to its site (hunt A #3: it lost both)
				v.pj = v.job === 'food' ? null : v.job;
				setJob(v, 'food');
			}
		}
		if (isSoldier(t)) {
			if (beast) d *= MORALE.wild;
			if (t.state === 'rout') d *= MORALE.routHit;
			else if (t.fb > G.t) d *= FALLBACK.hit;
		}
		if (a && A.gun && hasTag(t.kind, 'native')) d *= NATIVE.gunHit; // gunpowder against hide shields
		if (isSoldier(t) && t.owner !== WILD) {
			d *= stats(t.owner, t.kind).armor;
			{
				const F = shapeOf(t);
				d *= F.hit || 1;
				if (F.vsMounted && a && hasTag(a.kind, 'mounted')) d *= F.vsMounted;
			} // the battalion's shape
			if (a && A.rng <= 20 && fromOf() < -0.5) d *= FLANK; // from behind the line it holds
		}
		if (UNIT[t.kind].rarmor && (!a || A.rng > 20)) d *= UNIT[t.kind].rarmor; // roofed: arrows and bolts glance off
		if (isSoldier(t) && !beast) {
			const dot = fromOf();
			t.mor -=
				((MORALE.hit * d * (TEMPER[temperOf(t)].nerve || 1)) / t.max) *
				(dot < -0.5 ? MORALE.rear : dot < 0.5 ? MORALE.side : 1);
		} // nerve, from the blow that lands (C5: after armour, the shape and the flank); from the side half again, from behind twice; an animal does not shake it
	}
	t.hp -= d;
	t.hurtT = G.t;
	if (a && !isB && t.staked && !a.q && hasTag(a.kind, 'mounted') && G.t - (a.stakeT || -9) > 2) {
		// a horse rides onto a shooter's stake (STAKES): it is hurt, its charge ends, and it is thrown back
		a.stakeT = G.t;
		a.hp -= a.max * STAKES.dmg;
		a.hurtT = G.t;
		a.flashT = G.t;
		a.chg = 0;
		const dx = a.x - t.x,
			dy = a.y - t.y,
			dd = hyp(dx, dy) || 1;
		if (!blockedCell(gcell(a.x + (dx / dd) * STAKES.shove, a.y + (dy / dd) * STAKES.shove), a.owner)) stepTo(a, a.x + (dx / dd) * STAKES.shove, a.y + (dy / dd) * STAKES.shove);
		if (t.owner === 0 && (G.tick + t.id) % 60 === 0) say('A horse on the stakes!', 'good', TOAST.short);
	}
	if (a && !isB && a.chg > G.t && isSoldier(t) && !t.inside && G.t - (t.shoveT || -9) > 1) {
		const dx = t.x - a.x,
			dy = t.y - a.y,
			dd = hyp(dx, dy) || 1;
		t.shoveT = G.t;
		if (!blockedCell(gcell(t.x + (dx / dd) * JUICE.shove, t.y + (dy / dd) * JUICE.shove), t.owner)) stepTo(t, t.x + (dx / dd) * JUICE.shove, t.y + (dy / dd) * JUICE.shove);
		if (onScreen(t.x, t.y)) {
			G.jolt = G.t + JUICE.joltS;
			sfx('thud', t.x, t.y);
		}
	} // a charge lands (the juice pass): the one it hits is shoved back, the screen jolts, a thud
	if (a && t.hp <= 0 && !isB && a.st) {
		a.st.kills++;
		warCredit(a.owner, t.owner, UNIT[t.kind].cost); // an animal costs nothing, so it counts nothing
		if (G.kills && G.kills[a.owner] && G.kills[a.owner][t.owner] !== undefined) G.kills[a.owner][t.owner]++;
		if (isSoldier(a)) a.mor = Math.min(1, a.mor + MORALE.kill);
	}
	const tg = o === WILD ? null : gangOf(t);
	if (tg && tg !== 'beast') {
		if (a && calm4b(o) && (tg !== 'nat' || t.native || !UNIT[t.kind])) ((G.struck ??= {})[campOf(t)] ??= {})[a.id] = G.t; // 4b: the camp remembers who struck it
		const R = gangState(tg);
		if ((tg !== 'nat' || t.native) && G.t - (R.hitT[o] ?? -9) > 3) {
			R.hitT[o] = G.t;
			addRegard(o, tg, -REGARD.hitCost);
		}
	} // blows on a group (a Native warrior, a bandit, a robber, the horde) cost that group's regard
	if (a && A.knock && !isB && t.hp > 0 && t.kind !== 'caravan') {
		// a heavy blow drives the target back and flashes it
		const dx = t.x - a.x,
			dy = t.y - a.y,
			dd = hyp(dx, dy) || 1,
			nx = t.x + (dx / dd) * A.knock,
			ny = t.y + (dy / dd) * A.knock;
		if (!blockedCell(gcell(nx, ny), t.owner)) stepTo(t, clamp(nx, 8, MAP - 8), clamp(ny, 8, MAP - 8));
		t.flashT = G.t;
	}
	if (isB || t.kind === 'caravan') {
		if (o !== t.owner) {
			t.by = o;
			t.byT = G.t;
		}
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
			news('war', 
				o === WILD
					? `${plural(UNIT[a ? a.kind : 'wolf'].name)} attack at ${coord(t.x, t.y)}`
					: `Under attack at ${coord(t.x, t.y)}`,
				'warn',
				TOAST.long,
				t,
			);
		}
	}
}
// Crowd spacing, neighbours only: units are sorted into squares as wide as personal space (no push reaches past the next square) and each is
// compared with the units in its own and the next squares.
const CHS = Math.ceil(SPACE),
	CHW = Math.ceil(MAP / CHS) + 1,
	CHEAD = new Int32Array(CHW * CHW),
	CHCELL = [];
let CHNEXT = new Int32Array(1024);
// Who gives way (Build 48; it was always half and half): one at work or in a fight hardly moves, one walking moves one standing about,
// one standing gives way. Nobody is pushed into a tree, a wall or water.
const heft = (u) => (u.tgt || G.t - (u.work ?? -9) < 0.5 ? 9 : G.t - (u.mvT ?? -9) < 0.25 ? 3 : 1);
// forming (FORMING): walking to its place in a shape (its gx set, not there yet); the precedence of its kind, lower giving way
const forming = (u) => u.state === 'goto' && u.gx !== undefined && !u.tgt && hyp(u.px + u.gx - u.x, u.py + u.gy - u.y) > 6,
	rankOf = (u) => (isSoldier(u) ? 4 - Math.max(0, clsOf(u.kind)) : 0);
function pushApart(a, b) {
	let dx = b.x - a.x,
		dy = b.y - a.y;
	if (dx > SPACE || dx < -SPACE || dy > SPACE || dy < -SPACE) return;
	if (a.post && b.post && a.post.b != null && a.post.b === b.post.b && !a.job && !b.job) return; // two of one group sent to their own spots round a point (item 5): the spots keep them SPACE apart, so neither shoves the other off its way
	if (dx === 0 && dy === 0) {
		// two on one spot part along a direction fixed by their ids, the same every time (decision 10, Reynolds separation)
		const g = ((a.id * 31 + b.id * 17) % 360) * (Math.PI / 180);
		dx = Math.cos(g) * 0.01;
		dy = Math.sin(g) * 0.01;
	}
	const d = hyp(dx, dy);
	if (d > 0 && d < SPACE) {
		const fa = forming(a),
			fb = forming(b),
			ha = fa && fb ? (rankOf(a) > rankOf(b) ? 9 : rankOf(a) < rankOf(b) ? 1 : 3) : heft(a),
			hb = fa && fb ? (rankOf(b) > rankOf(a) ? 9 : rankOf(b) < rankOf(a) ? 1 : 3) : heft(b),
			k = ((SPACE - d) / d) * (fa && fb ? FORMING.soft : 1), // two forming: the lower kind gives way, and the push is soft
			pa = (k * hb) / (ha + hb),
			pb = (k * ha) / (ha + hb),
			ax = a.x - dx * pa,
			ay = a.y - dy * pa,
			bx = b.x + dx * pb,
			by = b.y + dy * pb,
			ra = atRest(a),
			rb = atRest(b);
		if (!blockedCell(gcell(ax, ay), a.owner)) stepTo(a, ax, ay);
		if (!blockedCell(gcell(bx, by), b.owner)) stepTo(b, bx, by);
		if (ra) settle(a);
		if (rb) settle(b);
	}
}
// at rest (D-092): a stopped villager on a point of its own (not a group's spot), or a grazer between bites. Nudged, it stays where it was
// nudged instead of walking back and being nudged again (the shuffle): a crowd at rest settles, as people standing in a room shift and stay
const atRest = (u) => (u.kind === 'vil' ? !u.job && u.post && u.post.b == null : !!u.grazeAt && !u.run) && G.t - (u.mvT ?? -9) >= 0.25,
	settle = (u) => {
		if (u.kind === 'vil') u.post = { x: u.x, y: u.y };
		else u.grazeAt = { x: u.x, y: u.y };
	};
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
		const c = clamp((u.y / CHS) | 0, 0, CHW - 1) * CHW + clamp((u.x / CHS) | 0, 0, CHW - 1);
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
			if (Math.abs(u.x - L.x) > L.r * 1.4 + 60 || Math.abs(u.y - L.y) > L.r * 1.4 + 60) continue; // far from this one: the cheap test first
			const dl = dist(u, L),
				lr = lakeRTo(L, u.x, u.y);
			if (dl < lr + 6 && !u.fly && !onLand(u.x, u.y)) {
				const s = (lr + 6) / (dl || 1);
				stepTo(u, L.x + (u.x - L.x) * s, L.y + (u.y - L.y) * s);
			}
		}
		stepTo(u, clamp(u.x, 6, MAP - 6), clamp(u.y, 6, MAP - 6));
		if (blockedCell(gcell(u.x, u.y), u.owner)) {
			const f = freeNear(Math.floor(u.x / NAVC), Math.floor(u.y / NAVC), u.owner, 8, u.x, u.y);
			if (f) {
				stepTo(u, f.x, f.y);
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
// the War crown (N6): the cost value of an enemy's people or building destroyed, to the side that destroyed it; animals are not counted
function warCredit(to, from, cost) {
	if (to === from || to === WILD || !G.P[to]) return;
	G.P[to].war = (G.P[to].war || 0) + sumCost(cost);
}
function plunderBld(b) {
	const to = b.by;
	b.by = undefined;
	warCredit(to, b.owner, BLD[b.kind].cost);
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
	{
		// a fallen holder hands the Throne back to the Natives: it is not deleted with the rest, and the game does not name a dead side its holder (B5)
		const T = G.blds.find((b) => b.kind === 'throne' && b.owner === p.id && !b.gone);
		if (T) {
			for (const b of G.blds)
				if (b.owner === p.id && (b === T || b.citadel)) {
					b.owner = WILD;
					b.by = undefined;
				}
			T.hp = Math.max(T.hp, maxHpB(WILD, 'throne') / 3);
			G.throne = { owner: WILD, since: G.t };
			G.navDirty = true;
		}
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
			q.capA = (q.capA || 0) + Math.floor((ARMYMAX * SHARE_FALLEN) / left.length);
		}
		if (left.some((q) => q.id === 0))
			news('realm', 
				`Shared out: the ceiling rises by ${Math.floor((ARMYMAX * SHARE_FALLEN) / left.length)} soldiers.`,
				'good',
				TOAST.long,
			);
	} // a fallen side's room is shared
	for (const f of G.finds) if (f.owner === p.id && FINDS[f.kind].capture) f.owner = null;
	if (p.ally !== null) {
		const q = G.P[p.ally];
		if (q.ally === p.id) q.ally = null;
	}
	if (p.id) news('war', `${p.name} has fallen.`, 'good', TOAST.long);
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
				if (standing(b, p.id)) s.bld += sumCost(BLD[b.kind].cost) / SCORE.bld;
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
		news('war', 'Enemies at your town!', 'warn', TOAST.long, near);
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
	wagon: wagonTick,
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
