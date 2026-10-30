// ═════ 36-economy.js: trade, weather, fire, sickness, vassals, the computers' economy ═════
// ───────────────────────── Goods, trade routes, nature, sickness and food ─────────────────────────
// Real ratios on a compressed calendar: one year is 12 minutes, and every rate below is set against that clock.
const FLEECE = 7,
	LAMBS = 0.6,
	FLOCK = 12; // wool per sheep at the spring shearing; a flock grows by logistic growth (Verhulst), r = 0.6 a spring toward a pasture that carries 12 (Build 56)

const stopsAll = () => G.finds.filter((f) => f.kind === 'stop');
const postAt = (f) => G.blds.find((b) => b.kind === 'tpost' && b.sid === f.id && b.hp > 0);
const stopsHeld = (o, r) => stopsAll().filter((f) => f.route === r && f.owner === o).length; // of one route's four stops
const goodsOf = (o) => G.P[o].goods;
function stash(o, type, amt) {
	const p = G.P[o],
		k = KEY[type] || type;
	if (KEY[type] && G.throne && G.throne.owner !== o && G.throne.owner !== WILD && G.P[G.throne.owner].alive) {
		const t = amt * THRONE.tithe;
		amt -= t;
		earn(G.P[G.throne.owner], k, t, 'tithe');
	} // the Throne's tithe
	if (KEY[type]) earn(p, k, amt, 'gather');
	else {
		p.goods[k] = (p.goods[k] || 0) + amt;
		p.gathered += amt;
		p.flow[k] = (p.flow[k] || 0) + amt;
	}
}
// what came in over the last minute, by resource and good: kept for the stores card (the flow is counted as it is stashed, read once a minute)
// a resource's net flow a minute: what came in over the last full minute less what went out (the minute so far, scaled, before there is one)
function netOf(p, k) {
	const el = (G.tick % 1800) / 30,
		full = p.rate && Object.keys(p.rate).length,
		inn = full ? p.rate[k] || 0 : ((p.flow[k] || 0) * 60) / Math.max(10, el),
		out = full ? (p.orate && p.orate[k]) || 0 : ((p.spent1[k] || 0) * 60) / Math.max(10, el);
	return inn - out;
}
function flowTick() {
	for (const p of G.P)
		if (p.id !== WILD) {
			p.rate = p.flow;
			p.flow = {};
			p.orate = p.spent1;
			p.spent1 = {};
			p.rateBy = p.flowBy || {};
			p.flowBy = {};
			p.orateBy = p.spentBy || {};
			p.spentBy = {};
		}
}

function initEconomy() {
	Object.assign(G, {
		wx: 'clear',
		wxT: WX_EVERY,
		harvest: 1,
		plague: null,
		seasonN: 0,
		yearN: 0,
		mkt: Object.fromEntries(MKTK.map((k) => [k, 1])),
	}); // prices float from the start
	ROUTES.forEach((r, ri) =>
		r.forEach(([x, y], i) => {
			const f = addFind('stop', x, y);
			f.route = ri;
			f.want = WARES[(ri + i) % WARES.length];
		}),
	);
	G.P.forEach((p, i) => {
		if (i !== WILD) p.wants = [WARES[i % 3], WARES[(i + 1) % 3]];
	});
}

// ── prices: base, more where it is wanted, more the farther it travels
const distF = (d) => clamp(1 + d / 1000, 1, POST.far);
const baseOf = (k) => (GOODS[k] ? GOODS[k].base : TRADE[k] / 100); // a made good's price, or a raw find's (the Market's lot price ÷ 100)
const nameOf = (k) => (GOODS[k] ? GOODS[k].name : RAW_NAME[k]).toLowerCase();
const colOf = (k) => (GOODS[k] ? GOODS[k].col : RESOURCES[LONG[k]].col); // a cart's load shows its colour: a good's own, or the resource's
const loadable = (p, k) => (TRADE[k] ? Math.max(0, (p.res[k] || 0) - CARAVAN.keep) : p.goods[k] || 0); // what a caravan may take: all of a made good, a raw find's surplus
// a load taken up or put down: raw through the money home (spent on, or back from, trade; a load is not gathered), a good with the goods
// (Build 52: a raw load taken from a cart made the goods count NaN; Build 60: raw loads left and came back unlogged)
const takeFrom = (p, k, q) => (TRADE[k] ? spend(p, k, q, 'trade') : (p.goods[k] -= q));
const giveTo = (p, k, q, why = 'trade') => (TRADE[k] ? earn(p, k, q, why, false) : (p.goods[k] = (p.goods[k] || 0) + q));
function priceAt(o, good, place, from) {
	let m = 1;
	if (place.kind === 'stop' && good === 'spice') return 0; // a stop sells spice; it does not buy it
	m = place.want === good ? POST.want : 1;
	return baseOf(good) * m * mkt(good) * (from ? distF(dist(from, place)) : 1) * fxv(o, 'trade').m;
}
// Trade has two lanes. One: a caravan with a route carries goods to a trade stop, the world's old markets, and sells them.
// Two: a caravan with no route runs between your Market and an ally's Market or Town Center, paid by distance.
const tradeTargets = (o) =>
	stopsAll().filter((f) => !guardsLeft(f) && !(f.owner !== null && f.owner !== o && atWar(o, f.owner) && postAt(f)));
function allyMarket(o, from) {
	let best = null,
		bd = -1;
	for (const b of G.blds)
		if (
			b.hp > 0 &&
			b.prog >= 1 &&
			(b.kind === 'market' || b.kind === 'keep') &&
			b.owner !== o &&
			b.owner !== WILD &&
			G.P[b.owner].alive &&
			G.rel[o][b.owner] === 'ally'
		) {
			const d = dist(from, b);
			if (d > bd) {
				bd = d;
				best = b;
			}
		}
	return best;
}
const targetOf = (r) => r && (r.s ? G.finds.find((f) => f.id === r.to) : G.blds.find((b) => b.id === r.to && b.hp > 0));
const homeBiz = (o, u) => nearest(G.blds, u, (b) => b.owner === o && b.kind === 'market' && b.prog >= 1 && b.hp > 0); // the Market stores goods and loads caravans
function estPay(o, place, from) {
	let n = LOAD,
		s = 0;
	for (const k of CARRIED.slice().sort((a, b) => priceAt(o, b, place, from) - priceAt(o, a, place, from))) {
		const q = priceAt(o, k, place, from) > 0 ? Math.min(n, Math.floor(loadable(G.P[o], k))) : 0;
		s += q * priceAt(o, k, place, from);
		n -= q;
	}
	return Math.round(s);
}
function setRoute(c, place, rep, spice) {
	c.route = { to: place.id, s: place.kind === 'stop', rep: !!rep, spice: !!spice };
	c.leg = 'load';
	c.dest = null;
	c.cargo = 0;
}
function bestTarget(o, c) {
	const h = homeBiz(o, c);
	if (!h) return null;
	let best = null,
		bv = 0;
	for (const t of tradeTargets(o)) {
		const v = estPay(o, t, h) + (t.kind === 'stop' ? 40 : 0);
		if (v > bv) {
			bv = v;
			best = t;
		}
	}
	return best;
}

// A caravan on a route: load at the Market, sell at the far end (and buy spice at a stop), bring the spice home, again if it repeats.
function routeTick(u, dt, SP) {
	const o = u.owner,
		p = G.P[o],
		r = u.route,
		t = targetOf(r),
		h = homeBiz(o, u);
	if (!t || !h || (t.owner !== undefined && t.kind !== 'stop' && atWar(o, t.owner))) {
		u.route = null;
		u.idle = true;
		return;
	}
	if (u.leg === 'load') {
		if (!moveTo(u, h.x, h.y, dt, halfOf(h) + 4, SP)) return;
		u.goods = {};
		let n = LOAD;
		for (const k of CARRIED.slice().sort((a, b) => priceAt(o, b, t, h) - priceAt(o, a, t, h))) {
			if (t.sell && !t.sell[k]) continue;
			const q = priceAt(o, k, t, h) > 0 ? Math.min(n, Math.floor(loadable(p, k))) : 0;
			if (q > 0) {
				u.goods[k] = q;
				takeFrom(p, k, q);
				n -= q;
			}
		} // a stop you hold sells what you chose for it
		if (n === LOAD && !(r.spice && t.kind === 'stop')) {
			u.idle = true;
			return;
		} // nothing to carry: wait for goods
		u.leg = 'go';
		u.from = { x: h.x, y: h.y };
		return;
	}
	if (u.leg === 'go') {
		if (!moveTo(u, t.x, t.y, dt, (t.q ? halfOf(t) : 0) + 14, SP)) return;
		let gold = 0,
			sold = [];
		for (const k in u.goods) {
			const v = u.goods[k] * priceAt(o, k, t, u.from);
			gold += v;
			sold.push(u.goods[k] + ' ' + nameOf(k));
		}
		const keeper = t.kind === 'stop' ? t.owner : null;
		if (keeper !== null && keeper !== o && gold > 0) {
			const cut = gold * Math.min(0.6, POST.cut[stopsHeld(keeper, t.route)] + fxv(keeper, 'cut').a);
			gold -= cut;
			earn(G.P[keeper], 'g', cut, 'trade');
		}
		for (const k in u.goods) mktHit(k, u.goods[k], -1);
		gold = Math.round(shareUp(o, gold));
		earn(p, 'g', gold, 'trade');
		u.goods = {};
		if (r.spice && t.kind === 'stop') {
			const c = spiceCost(),
				q = Math.min(LOAD, Math.floor(p.res.g / c));
			if (q > 0) {
				spend(p, 'g', Math.round(q * c), 'trade');
				u.goods.spice = q;
				mktHit('spice', q, 1);
			}
		}
		if (o === 0 && (gold || u.goods.spice)) {
			say(
				`A caravan ${sold.length ? `sold ${sold.join(', ')} for ${gold} gold` : 'reached the stop'}${u.goods.spice ? `, bought ${u.goods.spice} spice` : ''}.`,
				'good',
				4,
				t,
			);
			sfx('tribute');
		}
		u.foreign = t.kind === 'stop' || t.owner !== o;
		u.leg = 'back';
		return;
	}
	if (moveTo(u, h.x, h.y, dt, halfOf(h) + 4, SP)) {
		// home
		for (const k in u.goods || {}) giveTo(p, k, u.goods[k]);
		u.goods = {};
		if (u.foreign && G.plague && G.plague.until > G.t && rng() < HEALTH.plagueCart * (hz('plague') ? 2 : 1)) outbreak(o, 0.05, true, u); // a few cases come home with the cart; the spread does the rest (SIR). The hazard's "twice as fast along the roads" (Build 60: it was never doubled)
		u.inspected = false;
		u.inspT = 0; // plague came home with the carts
		u.foreign = false;
		if (r.rep) u.leg = 'load';
		else {
			u.route = null;
			u.idle = true;
		}
	}
}
// caravans within reach of a trade post or tower of yours, or with a soldier of yours close by, are left alone by robbers
const guardedCart = (v) =>
	v.kind === 'caravan' &&
	(G.blds.some(
		(b) =>
			b.owner === v.owner &&
			(b.kind === 'tpost' || b.kind === 'tower') &&
			b.prog >= 1 &&
			b.hp > 0 &&
			dist(b, v) < POST.safe,
	) ||
		G.units.some((s) => s.owner === v.owner && isSoldier(s) && Math.abs(s.x - v.x) < 60 && Math.abs(s.y - v.y) < 60));
// a robbed caravan's load goes into the nearest robbers' camp, and comes back to whoever breaks the camp
function robbed(u) {
	let v = u.cargo || 0;
	for (const k in u.goods || {}) v += u.goods[k] * baseOf(k); // a raw load is robbed too (Build 48: it threw)
	const f = nearest(G.finds, u, (f) => f.kind === 'camp' && !f.done);
	if (f && v > 0) f.hoard = (f.hoard || 0) + Math.round(v);
	if (u.owner === 0) say(`Caravan robbed${v ? ` (${Math.round(v)}g)` : ''}. Break their camp.`, 'warn', 7, u);
}

// ── the calendar: weather every minute, the seasons' work, the year's harvest
function natureTick() {
	const sn = Math.floor(G.t / SEASON_LEN);
	if (sn !== G.seasonN) {
		G.seasonN = sn;
		seasonTurn();
	}
	if (storm() && hazard(1 / 20)) strike(rnd(80, MAP - 80), rnd(80, MAP - 80)); // a strike on open ground, one every 20 s in a storm on average
	for (const b of G.blds)
		if (b.node && BLD[b.kind].crop && b.prog >= 1 && b.node.type === 'food') {
			// soil tires when worked and rests when not
			const worked = G.t - (b.node.workT || -9) < 2;
			b.fert = clamp(
				(b.fert ?? 1) + (worked ? -FERT.loss / YEAR : FERT.rest / SEASON_LEN),
				FERT.floor + fxv(b.owner, 'soil').a,
				1,
			); // irrigation lifts the floor
		}
	// trade posts: whoever holds all four stops is paid every second
	for (const f of stopsAll()) {
		const pt = postAt(f);
		f.owner = pt && pt.prog >= 1 ? pt.owner : null;
	}
	for (let r = 0; r < ROUTES.length; r++) {
		const S = stopsAll().filter((f) => f.route === r),
			o = S[0] && S[0].owner;
		if (o !== null && o !== undefined && S.every((f) => f.owner === o) && G.P[o].alive) {
			const g = shareUp(o, POST.all);
			earn(G.P[o], 'g', g, 'trade');
			if (o === 0 && G.tick % 300 === 0) sfx('tribute'); // held routes pay all the time: a chime every ten seconds
		}
	}
	if (G.tick % 300 === 150) {
		priceDrift();
		ventureTick();
		vassalTick();
		if (G.tension === 'diplomacy') leagueTick();
	}
	if (G.tick % 1800 === 0) flowTick();
}
function seasonTurn() {
	const s = season().name;
	for (const p of G.P)
		if (p.alive && p.id !== WILD && p.res.f > 0) {
			const k = (-Math.log(1 - SPOIL.year) / 4) * fxv(p.id, 'spoil').m, // a season's rate
				lost = Math.floor(p.res.f * (1 - Math.exp(-k)));
			if (lost > 0) {
				spend(p, 'f', lost, 'spoiled');
				if (p.id === 0 && lost >= 20) say(`${lost} food spoiled in store this season.`, 'soft', 5);
			}
		}
	for (const b of G.blds)
		if (b.kind === 'pasture' && b.prog >= 1 && b.hp > 0) {
			if (s === 'Spring') {
				b.node.amt += (b.sheep || 0) * FLEECE;
				b.sheep = Math.min(FLOCK, Math.round(logistic(b.sheep || 0, LAMBS, FLOCK))); // Verhulst: fast while the pasture is empty, slowing as it fills
			}
			const wolf = G.units.find(
				(v) =>
					v.owner === WILD && (v.kind === 'wolf' || v.kind === 'direwolf' || v.kind === 'bear') && dist(v, b) < 260,
			);
			if (wolf && b.sheep > 0) {
				const lost = Math.min(b.sheep, 1 + Math.floor(rng() * 2));
				b.sheep -= lost;
				if (b.owner === 0) say(`Wolves took ${lost} sheep at ${coord(b.x, b.y)}.`, 'warn', 5, b);
			}
		}
	if (s === 'Spring') {
		if (G.t > 1) {
			const r = rng();
			G.harvest = 1;
			let acc = 0;
			for (const H of HARVEST) {
				acc += H.p;
				if (r < acc) {
					G.harvest = H.m;
					say(H.text, 'warn', 8);
					break;
				}
			}
		}
		if (
			G.P.some((p) => p.alive && p.id !== WILD && unitsOf(p.id, 'caravan').some((c) => c.route)) &&
			hazard(HEALTH.plague * (hz('plague') ? 3 : 1))
		) {
			G.plague = { until: G.t + SEASON_LEN * 2 };
			say('Plague on the roads: build a Hospital.', 'warn', 10);
		}
		if (G.blds.some((b) => b.owner === 0 && b.kind === 'pasture')) say('Spring: sheep shorn, lambs born.', 'good', 5);
	}
	if (s !== 'Spring' && s !== 'Summer' && G.plague && G.plague.until <= G.t) G.plague = null;
}

// ── fire: wood and thatch burn, catch from their neighbours, and villagers put it out
// the heat a neighbour receives from a fire of this age across this gap, as a share of a full fire touching it: the t² design fire
// (NFPA 72 / Heskestad) times the radiant view factor (near / (gap + near))² (BR 187). One home; tests/science.py checks it.
const fireHeat = (age, gap) => Math.min(1, (age / FIRE.grow) ** 2) * (FIRE.near / (gap + FIRE.near)) ** 2;
const FIRE_SMOKE = 0.008; // a second, for each villager fighting a big fire (spread, or the building below half): about one death in three big fires, never more than one
function ignite(b, why) {
	if (!BLD[b.kind].wood || b.fire > 0 || b.hp <= 0 || b.prog < 1) return;
	b.fire = 1;
	b.fireT = G.t;
	b.spread = why === 'it spread';
	b.smoke = false;
	// the neighbours run with buckets: at most two, and only those working right by it
	const near = G.units
		.filter(
			(u) => u.owner === b.owner && u.kind === 'vil' && !u.inside && u.job !== 'repair' && rectGap(u.x, u.y, b) < 60,
		)
		.sort((a, c) => dist(a, b) - dist(c, b))
		.slice(0, b.owner === 0 ? 2 : 3);
	for (const v of near) {
		v.pj = v.job;
		setJob(v, 'repair');
		v.rep = b;
		v.fireman = true;
	}
	if (b.owner === 0)
		say(
			`Fire at the ${bldName(0, b.kind).toLowerCase()} (${why}). ${near.length ? (near.length > 1 ? 'Two neighbours' : 'A neighbour') + ' run with buckets.' : 'Nobody is near it.'}`,
			'warn help',
			9,
			b,
			'douse:' + b.id,
		);
}
// Summer storms: lightning strikes open ground now and then, and sometimes a wooden building; bakeries and smithies throw sparks.
const storm = () => season().name === 'Summer' && (G.wx === 'rain' || G.wx === 'drought');
function strike(x, y, b) {
	(G.bolts = G.bolts || []).push({ x, y, t: G.t, seed: (((x * 12.9898 + y * 78.233) % 1) + 1) % 1 }); // the bolt's shape from where it fell: no Math.random in the simulation
	scarStrike(x, y);
	thunder(x, y);
	if (b) ignite(b, 'lightning');
}
function lightning() {
	// once a minute
	if (storm())
		for (const p of G.P)
			if (p.alive && p.id !== WILD && hazard(G.wx === 'drought' ? 0.1 : 0.04)) {
				const W = G.blds.filter((b) => b.owner === p.id && BLD[b.kind].wood && b.prog >= 1);
				if (W.length) {
					const b = W[Math.floor(rng() * W.length)];
					strike(b.x, b.y, b);
				}
			}
	for (const b of G.blds)
		if ((b.kind === 'foundry' || b.kind === 'smith') && b.prog >= 1 && hazard(0.01)) {
			const n = nearest(G.blds, b, (c) => c !== b && c.owner === b.owner && BLD[c.kind].wood && c.prog >= 1, 60);
			if (n) ignite(n, `sparks from the ${BLD[b.kind].name.toLowerCase()}`);
		}
}
function fireTick(dt) {
	const fm = fireMul();
	for (const b of G.blds) {
		if (!(b.fire > 0) || b.hp <= 0) continue;
		b.hp -= maxHpB(b.owner, b.kind) * 0.02 * dt * b.fire;
		if (b.hp <= 0) {
			b.by = undefined;
			if (b.owner === 0) say(`The ${bldName(0, b.kind).toLowerCase()} burned down.`, 'warn', 6, b);
			continue;
		}
		if ((G.tick + b.id) % 90 === 0) {
			const age = G.t - (b.fireT ?? G.t);
			for (const c of G.blds)
				if (c !== b && BLD[c.kind].wood && !(c.fire > 0) && c.prog >= 1) {
					const gap = Math.max(0, dist(b, c) - halfOf(b) - halfOf(c));
					if (gap < FIRE.reach && hazard(FIRE.rate * fm * fireHeat(age, gap), 3)) ignite(c, 'it spread'); // every 3 s, with the heat a neighbour receives
				}
		}
	}
}

// ── sickness: a few fall ill now and then, more in summer and winter; Clean water halves it; medicine cures and saves lives
function sickRisk(o) {
	const s = season().name;
	return HEALTH.risk * (s === 'Summer' || s === 'Winter' ? 1.2 : 1) * fxv(o, 'sick').m * (s === 'Winter' ? fxv(o, 'warm').m : 1); // warm homes: a milder winter
}
function outbreak(o, share, plague, at) {
	const p = G.P[o],
		k = keepOf(o);
	if (!k || p.alive === false) return;
	const ppl = G.units.filter(
		(u) => u.owner === o && UNIT[u.kind].cls && !u.inside && dist(u, k) < 500 && !(u.sick > G.t),
	);
	const n = Math.max(1, Math.round(ppl.length * share * (plague ? fxv(o, 'plague').m : 1)));
	for (let i = 0; i < n && ppl.length; i++) {
		const u = ppl.splice(Math.floor(rng() * ppl.length), 1)[0];
		u.sick = G.t + HEALTH.sickFor;
		u.plague = !!plague;
	}
	if (plague) p.plagueDead = 0;
	if (o === 0)
		say(plague ? 'Plague, brought by a caravan!' : `Sickness: ${n} ill. A Hospital cures them.`, 'warn', 9, at);
}
function healthTick() {
	// every 5 seconds
	const H = [];
	for (const b of G.blds) if (BLD[b.kind].heal && b.prog >= 1 && b.hp > 0) H.push(b);
	for (const u of G.units) if (UNIT[u.kind].heal) H.push(u);
	for (const p of G.P)
		if (p.alive && p.id !== WILD) {
			p.ai.sickT = (p.ai.sickT ?? HEALTH.every) - 5;
			if (p.ai.sickT <= 0) {
				p.ai.sickT = HEALTH.every;
				if (hazard(sickRisk(p.id))) outbreak(p.id, 0, false);
			}
		}
	// the spread, by side: β S I / N new cases in these five seconds (SIR), among the people near home
	for (const p of G.P) {
		if (!p.alive || p.id === WILD) continue;
		const k = keepOf(p.id);
		if (!k) continue;
		const S = [];
		let I = 0,
			plague = false;
		for (const u of G.units)
			if (u.owner === p.id && UNIT[u.kind].cls && !u.inside && dist(u, k) < 500) {
				if (u.sick > G.t) {
					I++;
					plague = plague || u.plague;
				} else S.push(u);
			}
		if (!I || !S.length) continue;
		const N = I + S.length,
			beta = ((HEALTH.R0 * (plague ? HEALTH.plagueR0 : 1)) / HEALTH.sickFor) * 5 * fxv(p.id, 'spread').m,
			x = (beta * S.length * I) / N;
		let n = Math.floor(x);
		if (rng() < x - n) n++;
		for (let i = 0; i < n && S.length; i++) {
			const v = S.splice(Math.floor(rng() * S.length), 1)[0];
			v.sick = G.t + HEALTH.sickFor;
			v.plague = plague;
		}
	}
	for (const u of G.units) {
		if (!(u.sick > G.t)) {
			if (u.sick) {
				u.sick = 0;
				u.plague = false;
			}
			continue;
		}
		const o = u.owner,
			P = G.P[o];
		if (
			H.some((h) => h.owner === o && dist(h, u) < (BLD[h.kind] || UNIT[h.kind]).hrng) &&
			rng() < HEALTH.cure * fxv(o, 'cure').m
		) {
			u.sick = 0;
			u.plague = false;
			continue;
		}
		const capOk = !u.plague || (P.plagueDead || 0) < Math.max(1, popOf(o) * HEALTH.plagueCap);
		if (capOk && rng() < HEALTH.death * (u.plague ? 4 : 1) * fxv(o, 'death').m) {
			u.hp = 0;
			u.gone = true;
			if (u.plague) P.plagueDead = (P.plagueDead || 0) + 1;
			continue;
		}
	}
}

// ── food upkeep: everyone eats, every second, wherever they are
function upkeepTick() {
	// every second
	for (const p of G.P)
		if (p.alive && p.id !== WILD) {
			const o = p.id;
			// everyone eats: a share a person, more for soldiers and far more for horses
			let sh = 0;
			for (const u of G.units) if (u.owner === o) sh += shareOf(u);
			const eat = sh * UPKEEP.share * fxv(o, 'eat').m; // cooked food feeds better (hearth)
			p.eats = eat * 60;
			starveTick(p);
			if (p.res.f >= eat) {
				spend(p, 'f', eat, 'upkeep');
				if (p.hungry && p.res.f > 20) {
					p.hungry = false;
					if (o === 0) say('Your people are fed again.', 'good', 4);
				}
			} else {
				spend(p, 'f', p.res.f, 'upkeep'); // what is left is eaten
				if (!p.hungry) {
					p.hungry = true;
					if (o === 0) say('No food. Work slows. Put villagers on Food.', 'warn', 8);
				}
			}
		}
}

function econTick(dt) {
	if (G.tick % 30 === 0) {
		natureTick();
		upkeepTick();
	}
	if (G.tick % 150 === 75) healthTick();
	fireTick(dt);
}

// ── the computers: a Market, one workshop each, caravans with routes, posts on the free stops near them
function aiEconomy(p, k, R, put, has) {
	const o = p.id,
		per = PERS[p.pers];
	if (p.age < 1 || G.t < 200) return;
	if (p.age >= VENTURE.age && p.res.g > 900 && (p.ventures || []).length < 2) venture(o, 250);
	if (R.w >= 140 && R.s >= 40) {
		const f = nearest(stopsAll(), k, (f) => !guardsLeft(f) && !postAt(f), 1100);
		if (f && !canPlace(o, 'tpost', f.x, f.y)) {
			build(o, 'tpost', f.x, f.y);
			return;
		}
	}
	if (!per.trade) return;
	if (!has('market')) {
		if (R.w >= 150 && R.s >= 50) put('market', k.x, k.y, 90, 210);
		return;
	}
	const brew = p.pers === 'aggr';
	if (!brew && !has('pasture') && R.w >= 80 && R.f >= 80) {
		put('pasture', k.x, k.y, 80, 200);
		return;
	}
	if (!has('workshop') && R.w >= 140 && R.s >= 40) {
		const b = put('workshop', k.x, k.y, 80, 200);
		if (b && brew) setMake(b, 'beer');
		return;
	}
	for (const b of G.blds)
		if (
			b.owner === o &&
			b.prog >= 1 &&
			b.node &&
			b.node.type !== 'food' &&
			b.node.type !== 'wood' &&
			!(b.node.wk > 0)
		) {
			sendVil(o, b.node.id);
			break;
		}
	const cs = unitsOf(o, 'caravan');
	if (cs.length + queuedOf(o, 'caravan') < 2 && ready(o, 'market').length && afford(p, UNIT.caravan.cost))
		train(o, 'caravan');
	for (const c of cs)
		if (!c.route && (G.tick + c.id) % 300 < 30) {
			const t = bestTarget(o, c);
			if (t) setRoute(c, t, true, true);
		}
}

// ── food upkeep
function shareOf(u) {
	const U = UNIT[u.kind];
	if (u.kind === 'caravan') return UPKEEP.cart;
	if (!U.cls) return 0;
	if (hasTag(u.kind, 'mounted') || hasTag(u.kind, 'elephant')) return UPKEEP.mounted;
	return U.tick === 'sol' ? UPKEEP.foot : 1;
}
const hungerOf = (o) => (G.P[o] && G.P[o].hungry ? UPKEEP.hunger : 1);

// ── prices float with what is sold and bought, and drift back
// a workshop's choice: what it makes now (the node's type and rate follow)
function setMake(b, type) {
	const mk = BLD[b.kind].makes && BLD[b.kind].makes[type];
	if (!mk || !b.node) return false;
	b.cropT = type;
	b.node.type = type;
	b.node.rate = mk.rate;
	for (const u of G.units)
		if (u.node === b.node) {
			u.job = type;
			u.carry = 0;
		}
	return true;
}
const mkt = (k) => (G.mkt ? clamp(Math.max(0.01, G.mkt[k] ?? 1) ** (-1 / PRICE.eps[k]), PRICE.floor, PRICE.cap) : 1); // the price multiplier from the stock
function debase(o) {
	// Rome's denarius: more coin at once, worth less for good
	const p = G.P[o];
	if (p.debased || !ready(o, 'mint').length) return false;
	p.debased = true;
	earn(p, 'g', MINT.debase, 'mint');
	if (o === 0) say(`Debased: +${MINT.debase} gold, prices ×${MINT.price} for good.`, 'warn', 7);
	return true;
}
function mktHit(k, q, dir) {
	// q of good k sold (dir −1: the stock grows) or bought (dir 1: it shrinks)
	if (!G.mkt) return;
	G.mkt[k] = Math.max(0.01, (G.mkt[k] ?? 1) - (dir * q) / (TRADE[k] ? PRICE.q0.raw : PRICE.q0.good));
}
const spiceCost = () => GOODS.spice.buy * mkt('spice');
function priceDrift() {
	if (!G.mkt) return;
	const full = ROUTES.some((r, i) => {
		const o = stopsAll()
			.filter((f) => f.route === i)
			.map((f) => f.owner);
		return o[0] !== null && o.every((x) => x === o[0]);
	});
	for (const k of MKTK) {
		const aim = k === 'spice' ? (G.plague && G.plague.until > G.t ? 1.4 : 1) * (full ? 1.2 : 1) : 1;
		G.mkt[k] = relax(G.mkt[k], aim ** -PRICE.eps[k], PRICE.tau, 10); // every 10 s, toward the stock that gives the aimed price
	}
}
// ventures: gold put into a merchant voyage; a year later it comes back with 40% more, or not at all
function venture(o, amt) {
	const p = G.P[o];
	p.ventures = p.ventures || [];
	if (p.age < VENTURE.age || !ready(o, 'market').length || p.res.g < amt || p.ventures.length >= VENTURE.max)
		return false;
	spend(p, 'g', amt, 'venture');
	p.ventures.push({ amt, due: G.t + YEAR });
	if (o === 0) say(`${amt} gold sent out. Back in a year.`, '', 5);
	return true;
}
function ventureTick() {
	for (const p of G.P)
		if (p.ventures && p.ventures.length)
			p.ventures = p.ventures.filter((v) => {
				if (v.due > G.t) return true;
				if (rng() < VENTURE.lost) {
					if (p.id === 0) say(`Robbers took a venture of ${v.amt} gold.`, 'warn', 6);
				} else {
					const back = Math.round(shareUp(p.id, v.amt * (VENTURE.back + fxv(p.id, 'venture').a)));
					earn(p, 'g', back, 'venture');
					p.gathered -= v.amt; // only the profit counts as gathered
					if (p.id === 0) say(`A venture comes home: ${back} gold for ${v.amt}.`, 'good', 6);
				}
				return false;
			});
}

// ── vassals: tax, loyalty, unrest, rebellion and coalition
const vassalsOf = (L) => G.P.filter((p) => p.alive && p.id !== WILD && p.lord === L);
// a loyal vassal shares a quarter of its trade profit with its lord
function shareUp(o, gold) {
	const p = G.P[o];
	if (p.lord === null || p.lord === undefined || p.rebel || (p.loyal || 0) < VASSAL.shareAt || gold <= 0) return gold;
	const s = gold * VASSAL.share;
	earn(G.P[p.lord], 'g', s, 'tax');
	return gold - s;
}
function loyaltyParts(p) {
	const L = p.lord,
		k = keepOf(p.id),
		r = VASSAL.r;
	if (!k) return { invest: 0, garrison: 0, protect: 0, hate: 0, target: 0 };
	let invest = 0;
	for (const b of G.blds)
		if (
			b.owner === L &&
			b.prog >= 1 &&
			b.hp > 0 &&
			Math.abs(b.x - k.x) < r &&
			Math.abs(b.y - k.y) < r &&
			dist(b, k) < r
		)
			invest += BLD[b.kind].invest ?? 3;
	const n = G.units.filter((u) => u.owner === L && isSoldier(u) && dist(u, k) < r).length,
		garrison = Math.min(VASSAL.garrisonMax, n * VASSAL.garrison);
	const protect = Math.round(p.protect || 0),
		hate = TAX[p.tax || 'fair'].hate * fxv(L, 'hate').m; // a tavern in the lord's town: the tax grumbles less
	return { invest, garrison, protect, hate, target: clamp(20 + invest + garrison + protect - hate, 0, 100) };
}
function makeVassal(q, L, tax) {
	const p = G.P[q];
	Object.assign(p, {
		lord: L,
		tax: tax || 'fair',
		unrest: 20,
		loyal: tax === 'light' ? 50 : 20,
		protect: 0,
		taxBase: p.gathered,
		rebel: null,
		wave: null,
		paid: 0,
	});
	for (let r = 0; r <= WILD; r++)
		if (r !== q && r !== WILD) {
			const rel = r === L ? 'ally' : G.rel[L][r] === 'war' ? 'war' : 'peace';
			G.rel[q][r] = G.rel[r][q] = rel;
		}
	for (const u of G.units) if (u.owner === q && u.state === 'attack') u.state = 'home';
	for (const u of G.units) if (u.owner === L && u.state === 'attack' && u.target === q) u.state = 'home';
	say(
		L === 0 ? `${p.name} kneel: your vassal now.` : `${p.name} became a vassal of ${G.P[L].name}.`,
		L === 0 ? 'good' : '',
		8,
		keepOf(q),
	);
}
// can this side be made to surrender? Their army is beaten and yours stands at their Town Center.
function surrenderWhy(o, q) {
	const P = G.P[q],
		k = keepOf(q);
	if (!k || !P.alive || q === WILD || P.lord === o) return 'Not now.';
	if (!atWar(o, q)) return 'Only an enemy can be made to surrender.';
	const mine = G.units.filter((u) => u.owner === o && isSoldier(u) && dist(u, k) < 300);
	if (mine.length < 8) return 'Stand at least 8 soldiers by their Town Center first.';
	if (powerOf(soldiersOf(q)) > powerOf(mine) * 0.4) return 'Their army is still too strong.';
	return null;
}
function demandSurrender(o, q) {
	const why = surrenderWhy(o, q);
	if (why) {
		if (o === 0) say(why, '', 4);
		return false;
	}
	makeVassal(q, o, 'fair');
	return true;
}
function rebel(p, coalition) {
	if (p.rebel || !keepOf(p.id)) return;
	const L = p.lord;
	levyOf(L, p.id).forEach(releaseLevy);
	const V = G.units.filter((u) => u.owner === p.id && u.kind === 'vil'),
		n = Math.ceil(V.length * 0.33);
	for (const v of V.slice(0, n)) {
		v.hp = 0;
		v.gone = true;
		const r = addUnit(p.id, 'rebel', v.x, v.y);
		r.state = 'attack';
		r.target = L;
	}
	G.rel[p.id][L] = G.rel[L][p.id] = 'war';
	for (const u of G.units)
		if (u.owner === p.id && isSoldier(u)) {
			u.state = 'attack';
			u.target = L;
			u.bid = null;
		}
	p.rebel = { t0: G.t, n0: Math.max(1, soldiersOf(p.id).length) }; // the new rebels are already soldiers: counted once
	if (L === 0) {
		say(
			coalition
				? `Vassals rise: ${n} rebels march on you!`
				: `${p.name} rebel! Crush them in ${VASSAL.freeAfter / 60} min.`,
			'warn',
			10,
			keepOf(p.id),
		);
		sfx('horn');
	}
}
function vassalTick() {
	// every 10 seconds
	for (const p of G.P) {
		if (!p.alive || p.lord === null || p.lord === undefined || p.id === WILD) continue;
		const L = G.P[p.lord];
		if (!L.alive) {
			p.lord = null;
			p.rebel = null;
			continue;
		}
		if (p.rebel) {
			// crushed, or free
			const force = soldiersOf(p.id).length;
			if (force < p.rebel.n0 * VASSAL.crushed) {
				p.rebel = null;
				p.unrest = 30;
				p.loyal = Math.max(0, (p.loyal || 0) - 10);
				G.rel[p.id][L.id] = G.rel[L.id][p.id] = 'ally';
				for (const u of G.units)
					if (u.owner === p.id && (u.kind === 'rebel' || u.state === 'attack')) {
						if (u.kind === 'rebel') {
							u.hp = 0;
							u.gone = true;
						} else u.state = 'home';
					}
				if (L.id === 0) say(`Rebellion in the lands of ${p.name} crushed.`, 'good', 7);
			} else if (G.t - p.rebel.t0 > VASSAL.freeAfter) {
				p.rebel = null;
				p.lord = null;
				levyOf(L.id, p.id).forEach(releaseLevy);
				if (L.id === 0) say(`${p.name} have thrown off your rule.`, 'warn', 8);
			}
			continue;
		}
		for (const u of levyOf(L.id, p.id)) if (!keepOf(L.id)) releaseLevy(u); // a levy serves its lord while the lord stands
		const d = Math.max(0, p.gathered - (p.taxBase || 0));
		p.taxBase = p.gathered; // tax: a share of what they gathered, from their stores
		let take = d * TAX[p.tax].take * (p.forced > G.t ? 2 : 1);
		const tot = p.res.f + p.res.w + p.res.s + p.res.g + p.res.i;
		p.paid = 0;
		if (tot > 0 && take > 0)
			for (const r of ['f', 'w', 's', 'g', 'i']) {
				const x = Math.min(p.res[r], (take * p.res[r]) / tot);
				spend(p, r, x, 'tax');
				earn(L, r, x, 'tax');
				p.paid += x;
			}
		if (L.id === 0 && p.paid > 0) sfx('tribute');
		p.protect = (p.protect || 0) * VASSAL.decay;
		const parts = loyaltyParts(p);
		p.loyal = relax(p.loyal || 0, parts.target, VASSAL.tau, 10); // loyalty settles toward what you have earned, 63% of the way in VASSAL.tau
		p.unrest = clamp(
			(p.unrest || 0) + TAX[p.tax].push * fxv(L.id, 'push').m + (p.forced > G.t ? 1 : 0) - p.loyal / 25,
			0,
			100,
		); // magistrates slow the climb
		if (p.loyal >= VASSAL.giftAt && G.tick % (30 * VASSAL.gift) === 150) {
			const gift = {};
			for (const r of ['f', 'w', 's', 'g', 'i']) {
				const x = Math.floor((p.res[r] * 0.1 * (p.loyal - 50)) / 100);
				if (x > 0) {
					spend(p, r, x, 'tax');
					earn(L, r, x, 'tax');
					gift[r] = x;
				}
			}
			if (L.id === 0 && Object.keys(gift).length) say(`${p.name} send a gift: ${costText(gift)}.`, 'good', 5);
		}
		if (L.id === 0 && p.unrest > 70 && G.t - (p.warnT || -99) > 60) {
			p.warnT = G.t;
			say(`${p.name}: unrest ${Math.round(p.unrest)}%. Cut tax.`, 'warn', 7, keepOf(p.id));
		}
		if (p.unrest >= 100) rebel(p);
	}
	if (G.tick % 1800 === 150)
		for (const L of G.P) {
			// coalition: many restless vassals may rise together
			const V = vassalsOf(L.id).filter((p) => !p.rebel);
			if (V.length < 2) continue;
			const risk = V.reduce((s, p) => s + (p.unrest / 100) ** 2, 0) * 0.08 * V.length;
			L.coalRisk = risk;
			if (L.id === 0 && risk > 0.1 && G.t - (L.coalT || -99) > 120) {
				L.coalT = G.t;
				say('Talk of revolt spreads among your vassals.', 'warn', 7);
			}
			if (rng() < risk) {
				const R = V.filter((p) => p.unrest >= 50);
				if (R.length >= 2) {
					for (const a of R) for (const b of R) if (a !== b) G.rel[a.id][b.id] = 'ally';
					R.forEach((p) => rebel(p, true));
				}
			}
		}
}
