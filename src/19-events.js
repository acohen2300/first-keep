// ═════ 19-events.js ═════
// ───────────────────────── The Challenge and the spectacle: one scheduler, one table of events, one set of knobs ─────────────────────────
// EVM: the knobs an event turns (every unit reads them: damage, speed, sight, gathering). A hazard is a switch in G.hz; a spectacle is a row of EVENTS.
// Random when, never random whether: the next event is picked when the last ends, announced EV_WARN seconds ahead, then run for its seconds.
const EVM = { dmg: 1, spd: 1, sight: 1, gather: 1 };
const hz = (id) => !!(G.hz && G.hz[id]) && G.diff !== 'easy'; // Easy keeps the polite game whatever is switched on
const levelOf = (h) => HZK.reduce((s, k) => s + (h && h[k] ? HAZARDS[k].pts : 0), 0);
const levelMul = () => 1 + levelOf(G.hz) / 10; // the score's multiplier for the level played
const evOn = (kind) => !!(G.ev.cur && G.ev.cur.kind === kind);
const edgeSpot = () => {
	const e = Math.floor(rng() * 4),
		t = rnd(300, MAP - 300);
	return e === 0
		? { x: t, y: 40 }
		: e === 1
			? { x: MAP - 40, y: t }
			: e === 2
				? { x: t, y: MAP - 40 }
				: { x: 40, y: t };
};
const across = (a) => ({ x: MAP - a.x, y: MAP - a.y }); // the far side of the map from a spot
const wildSpot = () => {
	for (let i = 0; i < 40; i++) {
		const s = { x: rnd(200, MAP - 200), y: rnd(200, MAP - 200) };
		if (
			lakeGap(s.x, s.y) > 60 &&
			!G.P.some((p) => p.id !== WILD && p.alive && keepOf(p.id) && dist(keepOf(p.id), s) < 420)
		)
			return s;
	}
	return { x: MID, y: MID - 300 };
};
const canEv = (k) => {
	const E = EVENTS[k];
	return (
		!(E.fantasy && !G.fantasy) &&
		!(E.need && G.wx !== E.need) &&
		!(E.season && season().name !== E.season) &&
		!(E.night && G.night < 0.5) &&
		!(k === 'quicksand' && G.wx !== 'rain') &&
		!(k === 'flood' && G.wx !== 'rain')
	);
};
function pickEvent() {
	const can = EVK.filter(canEv);
	let k = can[Math.floor(rng() * can.length)];
	if (k === G.ev.last && can.length > 1) k = can[(can.indexOf(k) + 1) % can.length];
	return k;
}
// the swarm, the herd and the cloud all cross the map the same way: from one edge to the far side, in E.secs
const crossing = (e) => {
	e.a = e.a || edgeSpot();
	e.b = e.b || across(e.a);
	const f = clamp((G.t - e.t0) / (e.until - e.t0), 0, 1);
	return { x: e.a.x + (e.b.x - e.a.x) * f, y: e.a.y + (e.b.y - e.a.y) * f, f };
};
const herdAt = (kind, n, a, b, spread) => {
	const out = [];
	for (let i = 0; i < n; i++) {
		const u = addUnit(WILD, kind, a.x + rnd(-spread, spread), a.y + rnd(-spread, spread));
		u.px = b.x + rnd(-spread, spread);
		u.py = b.y + rnd(-spread, spread);
		u.hx = u.x;
		u.hy = u.y;
		u.herd = true;
		u.tier = i;
		out.push(u);
	}
	return out;
}; // tier: which coat a performer wears
const EV = {
	eclipse: {
		start(e) {
			EVM.dmg = EVENTS.eclipse.dmg;
			EVM.spd = EVENTS.eclipse.spd;
			EVM.sight = EVENTS.eclipse.sight;
			sfx('hush');
		},
		end() {
			EVM.dmg = EVM.spd = EVM.sight = 1;
		},
	},
	storm: {
		start(e) {
			e.a = { x: -EVENTS.storm.band, y: MID };
			e.b = { x: MAP + EVENTS.storm.band, y: MID };
			sfx('wind');
		},
		tick(e) {
			const c = crossing(e);
			e.x = c.x;
			if (G.tick % 60 === 0) {
				const x = clamp(e.x + rnd(-EVENTS.storm.band, EVENTS.storm.band), 40, MAP - 40),
					y = rnd(80, MAP - 80),
					W = G.blds.filter(
						(b) => BLD[b.kind].wood && b.prog >= 1 && Math.abs(b.x - e.x) < EVENTS.storm.band && rng() < 0.3,
					);
				const b = W.length && rng() < 0.25 ? W[Math.floor(rng() * W.length)] : null;
				strike(b ? b.x : x, b ? b.y : y, b);
			}
		},
	},
	stampede: {
		start(e) {
			e.a = edgeSpot();
			e.b = across(e.a);
			e.units = herdAt('bison', EVENTS.stampede.n, e.a, e.b, 40);
			sfx('hooves');
		},
		tick(e) {
			if (G.tick % 90 === 0) sfx('hooves', e.units[0] && e.units[0].x, e.units[0] && e.units[0].y);
		},
		end(e) {
			for (const u of e.units)
				if (u.hp > 0 && dist(u, { x: u.px, y: u.py }) < 120) {
					u.hp = 0;
					u.gone = true;
				}
		},
	},
	flood: {
		start(e) {
			G.flood = e.until;
			G.navDirty = true;
		},
		tick(e) {
			if (G.tick % 30 !== 0) return;
			for (const b of G.blds)
				if (
					b.prog >= 1 &&
					b.owner !== WILD &&
					fxv(b.owner, 'flood').a < 1 &&
					lakeGap(b.x, b.y) < EVENTS.flood.rise - halfOf(b)
				) {
					b.hp -= maxHpB(b.owner, b.kind) * EVENTS.flood.hit;
					if (b.owner === 0 && G.tick % 300 === 0)
						say(`Water at the ${bldName(0, b.kind).toLowerCase()} (${coord(b.x, b.y)}).`, 'warn', 5, b);
				}
		},
		end() {
			G.flood = 0;
			G.navDirty = true;
		},
	},
	locusts: {
		start(e) {
			e.a = edgeSpot();
			e.b = across(e.a);
			sfx('buzz');
		},
		tick(e) {
			const c = crossing(e);
			e.x = c.x;
			e.y = c.y;
			if (G.tick % 15 === 0)
				for (const b of G.blds)
					if (b.kind === 'farm' && b.prog >= 1 && dist(b, c) < EVENTS.locusts.r && !(b.locust > G.t)) {
						b.locust = G.t + EVENTS.locusts.strip;
						b.fert = FERT.floor;
						if (b.owner === 0) say(`Locusts on the field at ${coord(b.x, b.y)}.`, 'warn', 4, b);
					}
		},
	},
	meteor: {
		start(e) {
			e.at = wildSpot();
			e.a = { x: e.at.x - 900, y: e.at.y - 700 };
		},
		end(e) {
			addFind('meteor', e.at.x, e.at.y);
			scarStrike(e.at.x, e.at.y);
			scarStrike(e.at.x + 6, e.at.y + 4);
			sfx('boom', e.at.x, e.at.y);
			G.whiteT = G.t;
			say(EV_TEXT.meteor[1], 'good', 7, e.at);
		},
	},
	wildfire: {
		start(e) {
			const far = G.nodes.filter(
				(n) =>
					n.kind === 'tree' &&
					n.amt > 0 &&
					!G.P.some((p) => p.id !== WILD && p.alive && keepOf(p.id) && dist(keepOf(p.id), n) < 300),
			);
			const t = far[Math.floor(rng() * far.length)];
			e.burn = t ? [t] : [];
			e.at = t ? { x: t.x, y: t.y } : null;
			G.fire = e.burn;
			sfx('crash', t && t.x, t && t.y);
		},
		tick(e) {
			if (G.wx === 'rain') {
				e.until = G.t;
				return;
			}
			const E = EVENTS.wildfire,
				next = [];
			for (const n of e.burn) {
				n.amt -= n.max * E.burn;
				if (n.amt > 0) next.push(n);
				else {
					scarStrike(n.x, n.y);
				}
				nodesNear(n.x, n.y, E.r, (m) => {
					if (m.kind === 'tree' && m.amt > 0 && !e.burn.includes(m) && !next.includes(m) && rng() < E.spread)
						next.push(m);
				});
				bldsNear(n.x, n.y, 40, (b) => {
					if (BLD[b.kind].wood && b.prog >= 1) ignite(b, 'the wildfire');
				});
			}
			e.burn = next.slice(0, E.most);
			G.fire = e.burn;
			if (!e.burn.length) e.until = G.t;
		},
		end() {
			G.fire = null;
		},
	},
	fog: {
		start() {
			EVM.sight = EVENTS.fog.sight;
		},
		end() {
			EVM.sight = 1;
		},
	},
	tremor: {
		start(e) {
			quake(e, EVENTS.tremor, hz('winter') ? QUAKE : null);
		},
	},
	sinkhole: {
		start(e) {
			const B = G.blds.filter((b) => b.prog >= 1 && !BLD[b.kind].wallish && b.kind !== 'keep');
			const b = B[Math.floor(rng() * B.length)];
			if (!b) return;
			b.hp -= maxHpB(b.owner, b.kind) * EVENTS.sinkhole.hit;
			scarStrike(b.x, b.y - 4);
			scarStrike(b.x + 5, b.y + 3);
			G.shake = G.t + 1;
			sfx('rumble', b.x, b.y);
			if (b.owner === 0)
				say(`A sinkhole under the ${bldName(0, b.kind).toLowerCase()} (${coord(b.x, b.y)}).`, 'warn', 6, b);
		},
	},
	quicksand: {
		start(e) {
			e.at = wildSpot();
			G.sand = { x: e.at.x, y: e.at.y, r: EVENTS.quicksand.r, until: e.until };
		},
		end() {
			G.sand = null;
		},
	},
	heatwave: {
		start() {
			EVM.dmg = EVENTS.heatwave.dmg;
			EVM.spd = EVENTS.heatwave.spd;
		},
		end() {
			EVM.dmg = EVM.spd = 1;
		},
	},
	mirage: {
		start(e) {
			const k = keepOf(0);
			e.at = k ? towardMid(k, 500) : { x: MID, y: MID };
			G.mirage = { x: e.at.x, y: e.at.y, n: EVENTS.mirage.n, until: e.until };
			say(`An army seen at ${coord(e.at.x, e.at.y)}.`, 'warn', 5, e.at);
		},
		end() {
			G.mirage = null;
			say('The army at that spot was a mirage.', '', 5);
		},
	},
	circus: {
		start(e) {
			e.a = edgeSpot();
			e.b = across(e.a);
			e.units = herdAt('performer', EVENTS.circus.n, e.a, e.b, 14);
			sfx('jingle');
		},
		tick(e) {
			if (G.tick % 30 !== 0) return;
			for (const p of e.units)
				if (p.hp > 0)
					unitsNear(p, EVENTS.circus.r, (v) => {
						if (v.kind === 'vil' && !v.inside) v.cheer = G.t + EVENTS.circus.cheer;
					});
		},
		end(e) {
			for (const u of e.units) {
				u.hp = 0;
				u.gone = true;
			}
		},
	},
	wagon: {
		start(e) {
			const a = edgeSpot(),
				b = across(a),
				w = addUnit(WILD, 'wagon', a.x, a.y);
			w.px = b.x;
			w.py = b.y;
			e.units = [w];
		},
	},
	mercs: {
		start(e) {
			const a = edgeSpot();
			e.f = addFind('mercs', clamp(a.x, 120, MAP - 120), clamp(a.y, 120, MAP - 120));
			e.f.until = e.until;
		},
		end(e) {
			if (e.f && !e.f.done) {
				e.f.done = true;
				for (const v of G.units)
					if (v.find === e.f.id) {
						v.hp = 0;
						v.gone = true;
					}
			}
		},
	},
	dragon: {
		start(e) {
			e.a = edgeSpot();
			e.b = across(e.a);
			e.units = herdAt('dragon', 1, e.a, e.b, 0);
			sfx('roar');
		},
		tick(e) {
			const d = e.units[0];
			if (!d || d.hp <= 0 || G.tick % 10) return;
			nodesNear(d.x, d.y, UNIT.dragon.scorch, (n) => {
				if (n.kind === 'tree' && n.amt > 0 && rng() < 0.5) {
					n.amt = 0;
					scarStrike(n.x, n.y);
				}
			});
			unitsNear(d, UNIT.dragon.scorch, (v) => {
				if (v !== d && v.hp > 0) {
					v.hp -= 10;
					v.hurtT = G.t;
				}
			});
			bldsNear(d.x, d.y, 40, (b) => {
				if (BLD[b.kind].wood && b.prog >= 1) ignite(b, 'the dragon');
			});
		},
		end(e) {
			for (const u of e.units) {
				u.hp = 0;
				u.gone = true;
			}
		},
	},
	troll: {
		start(e) {
			const q = G.P.filter((p) => p.id !== WILD && p.alive && keepOf(p.id)),
				p = q[Math.floor(rng() * q.length)],
				k = keepOf(p.id),
				at = towardMid(k, 260);
			e.units = [wildAt('troll', at.x, at.y)];
			sfx('roar', at.x, at.y);
		},
		end(e) {
			for (const u of e.units)
				if (u.hp > 0) {
					u.hp = 0;
					u.gone = true;
				}
		},
	},
	aurora: {},
};
// a tremor, or an earthquake when the hazard is on: everything within r loses a share of its health, walls more, and wood may catch
function quake(e, E, Q) {
	const r = Q ? Q.r : E.r,
		hit = Q ? Q.hit : E.hit,
		wall = Q ? Q.wall : E.wall,
		fire = Q ? Q.fire : E.fire;
	e.at = { x: rnd(200, MAP - 200), y: rnd(200, MAP - 200) };
	G.shake = G.t + 1.5;
	sfx('rumble', e.at.x, e.at.y);
	let mine = 0;
	bldsNear(e.at.x, e.at.y, r, (b) => {
		if (b.prog < 1 || dist(b, e.at) > r) return;
		b.hp -= maxHpB(b.owner, b.kind) * (BLD[b.kind].wallish ? wall : hit);
		if (b.hp > 0 && BLD[b.kind].wood && rng() < fire) ignite(b, 'the tremor');
		if (b.owner === 0) mine++;
	});
	if (mine)
		say(`${Q ? 'Earthquake' : 'Tremor'} at ${coord(e.at.x, e.at.y)}: ${mine} of yours damaged.`, 'warn', 6, e.at);
}
function startEvent(kind) {
	const E = EVENTS[kind],
		e = { kind, t0: G.t, until: G.t + E.secs };
	G.ev.cur = e;
	G.ev.last = kind;
	G.ev.warned = null;
	if (EV[kind].start) EV[kind].start(e);
	if (EV_TEXT[kind] && kind !== 'meteor' && kind !== 'mirage')
		say(EV_TEXT[kind][1], E.harm ? 'warn' : E.gift ? 'good' : 'soft', 6, e.at || (e.units && e.units[0]) || null); // only what can hurt you takes the line
}
function endEvent() {
	const e = G.ev.cur;
	if (!e) return;
	if (EV[e.kind].end) EV[e.kind].end(e);
	G.ev.cur = null;
	G.ev.next = G.t + rnd(EV_GAP[0], EV_GAP[1]);
}
function eventsTick() {
	// once a second
	const V = G.ev;
	if (!V.next) V.next = G.t + rnd(EV_GAP[0], EV_GAP[1]);
	if (V.cur) {
		if (EV[V.cur.kind].tick) EV[V.cur.kind].tick(V.cur);
		if (G.t >= V.cur.until) endEvent();
	} else if (!V.warned && G.t >= V.next - EV_WARN) {
		V.warned = pickEvent();
		say(EV_TEXT[V.warned][0], 'soft', EV_WARN);
	} // the warning is quiet: in the list, not on the line
	else if (V.warned && G.t >= V.next) {
		if (canEv(V.warned)) startEvent(V.warned);
		else {
			V.warned = null;
			V.next = G.t + 30;
		}
	}
	hordeTick();
	newsTick();
	if (hz('winter') && G.t >= (V.quakeAt || (V.quakeAt = G.t + QUAKE.every))) {
		V.quakeAt = G.t + QUAKE.every;
		if (!V.cur) {
			say(EV_TEXT.tremor[0], 'warn', 8);
			V.warned = 'tremor';
			V.next = G.t + 8;
		}
	}
}
// The horde (the hazard): announced two seasons ahead, then one; from an edge or out of the wild, for the weakest side; its number grows with the age
function hordeTick() {
	if (!hz('horde') || G.horde === 'done') return;
	if (!G.horde) {
		G.horde = { at: rnd(HORDE.from, HORDE.to), said: 0 };
		return;
	}
	const H = G.horde,
		left = H.at - G.t;
	if (H.said < 1 && left <= HORDE.warn) {
		H.said = 1;
		say(EV_TEXT.horde[0], 'warn', 8);
	}
	if (H.said < 2 && left <= HORDE.warn / 2) {
		H.said = 2;
		say(EV_TEXT.horde[1], 'warn', 8);
	}
	if (left > 0) return;
	const sides = G.P.filter((p) => p.id !== WILD && p.alive && keepOf(p.id)),
		weak = sides.sort((a, b) => estPower(WILD, a.id) - estPower(WILD, b.id))[0];
	if (!weak) {
		G.horde = 'done';
		return;
	}
	const from = rng() < 0.5 ? edgeSpot() : wildSpot(),
		age = Math.max(...sides.map((p) => p.age)),
		n = HORDE.n + HORDE.perAge * age,
		k = keepOf(weak.id),
		kinds = G.fantasy ? ['goblin', 'goblin', 'troll'] : ['bandit', 'robber', 'bandit'];
	for (let i = 0; i < n; i++) {
		const u = wildAt(kinds[i % 3], from.x + rnd(-40, 40), from.y + rnd(-40, 40));
		u.hx = k.x;
		u.hy = k.y;
		u.horde = true;
	}
	say(EV_TEXT.horde[2], 'warn', 10, from);
	sfx('horn');
	G.horde = 'done';
}
// the ground after the weather: mud, ice and snow build while it rains, freezes or blows, and go slowly after
function groundTick(dt) {
	const g = G.ground,
		wx = G.wx,
		storm = !!(G.ev.cur && G.ev.cur.kind === 'storm');
	g.mud = clamp(g.mud + (wx === 'rain' ? (storm ? GROUND.storm : GROUND.rain) : -GROUND.dry) * dt, 0, 1);
	g.ice = clamp(
		g.ice + (wx === 'frost' ? GROUND.frost : -GROUND.thaw * (season().name === 'Winter' ? 0.3 : 1)) * dt,
		0,
		1,
	);
	g.snow = clamp(
		g.snow +
			(wx === 'blizzard'
				? GROUND.blizzard
				: -GROUND.melt * (season().name === 'Winter' ? 0.2 : season().name === 'Summer' ? 3 : 1)) *
				dt,
		0,
		1,
	);
}
const groundSpd = (o, keys) =>
	(1 - GROUND.mudSlow * G.ground.mud * fxv(o, 'mud', keys).m) *
	(1 - GROUND.snowSlow * G.ground.snow * (1 - fxv(o, 'snow', keys).a)); // what the ground takes off a march
const wearMul = (o) =>
	G.wx === 'frost' || G.wx === 'rain' || G.wx === 'blizzard'
		? 1 - GROUND.wear * (1 - Math.min(1, fxv(o, 'wear').a))
		: 1; // brittle in frost, rusted in rain
function newsTick() {
	if (G.t - (G.ev.newsT || 0) < NEWS_EVERY || G.t < 60) return;
	G.ev.newsT = G.t;
	const L = NEWS[Math.min(G.P[0].age, NEWS.length - 1)],
		i = (G.ev.newsI = (G.ev.newsI || 0) + 1) % L.length;
	say(L[i], 'news', 8);
}
// a herd crosses: bison trample what they run over; performers only pass; a dragon flies (it is drawn above everything and walks through walls)
function herdTick(u, dt, SP) {
	const U = UNIT[u.kind];
	if (U.look === 'dragon') {
		const d = hyp(u.px - u.x, u.py - u.y) || 1;
		u.x += ((u.px - u.x) / d) * U.spd * dt;
		u.y += ((u.py - u.y) / d) * U.spd * dt;
		u.fx = Math.sign(u.px - u.x) || u.fx;
		u.mvT = G.t;
		u.fly = 34;
		return;
	}
	if (moveTo(u, u.px, u.py, dt, 10, 1)) {
		u.hp = 0;
		u.gone = true;
		return;
	}
	if (U.trample && (G.tick + u.id) % 6 === 0) {
		unitsNear(u, 12, (v) => {
			if (v !== u && !v.herd && v.hp > 0 && dist(u, v) < 12) {
				v.hp -= U.trample;
				v.hurtT = G.t;
				v.flashT = G.t;
				v.x += (v.x - u.x) * 0.6;
				v.y += (v.y - u.y) * 0.6;
			}
		});
		const n = G.nodes.find((m) => m.kind === 'farm' && m.farm && m.type === 'food' && dist(m, u) < 20);
		if (n && n.farm.fert > FERT.floor) n.farm.fert = Math.max(FERT.floor, n.farm.fert - 0.02);
	}
}
// the moon: the night is darker and sight shorter toward the new moon (the real month compressed to MOON days)
const moonLight = () => 0.5 + 0.5 * Math.cos((G.t / (DAY_LEN * MOON)) * 2 * Math.PI); // 1 at full moon, 0 at new
// starvation (the hazard): work stops after a minute without food; after two, people leave
function starveTick(p) {
	if (!hz('starve') || !p.hungry) {
		p.hungryT = 0;
		return;
	}
	p.hungryT = (p.hungryT || 0) + 1;
	const o = p.id;
	if (p.hungryT === STARVE.stop && o === 0) say('Starving: work has stopped. Food, now.', 'warn', 8);
	if (p.hungryT >= STARVE.leave && (p.hungryT - STARVE.leave) % STARVE.every === 0) {
		const v = unitsOf(o, 'vil').sort((a, b) => a.carry - b.carry)[0],
			s = soldiersOf(o).filter((u) => u.state === 'home')[0];
		for (const u of [v, s])
			if (u) {
				u.hp = 0;
				u.gone = true;
			}
		if (o === 0 && (v || s))
			say(`Starving: ${v ? 'a villager left' : ''}${v && s ? ', ' : ''}${s ? 'a soldier deserted' : ''}.`, 'warn', 6);
	}
}
const starving = (o) => hz('starve') && (G.P[o].hungryT || 0) >= STARVE.stop; // nobody works
