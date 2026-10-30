// ═════ 14-sim-troops.js: priests, medics, soldiers, wild animals, wayfarers, finds ═════
// priests and medics walk with the battalion that is out; a priest sent to a shrine stands there
function followArmy(u, dt, SP) {
	const o = u.owner;
	let a = null,
		ad = 260;
	for (const v of G.sol) {
		if (
			v.owner !== o ||
			(u.bn !== undefined && v.bn !== u.bn) ||
			(v.state !== 'attack' && v.state !== 'goto' && v.state !== 'escort' && v.state !== 'assist')
		)
			continue;
		const d = dist(u, v);
		if (d < ad) {
			ad = d;
			a = v;
		}
	}
	if (a) {
		moveTo(u, a.x - (a.fx || 0) * 24 + u.ox * 0.3, a.y - (a.fy || 0) * 24 + u.oy * 0.3, dt, 10, SP);
		return true;
	}
	return false;
}
function priestTick(u, dt, SP) {
	if (u.state === 'convert') {
		// beside an enemy for a spell, the priest turns them; the counter is to kill the priest
		const t = G.units.find(
			(v) => v.id === u.cv && v.hp > 0 && !v.inside && atWar(u.owner, v.owner) && UNIT[v.kind].cls,
		);
		if (!t || u.cvCd > G.t) {
			u.state = 'home';
			u.cv = null;
			return;
		}
		if (dist(u, t) <= CONVERT.r) {
			u.cvT = (u.cvT || 0) + dt;
			u.work = G.t;
			if (u.cvT >= CONVERT.secs * fxv(u.owner, 'convert').m) {
				const was = t.owner;
				t.owner = u.owner;
				t.state = 'home';
				t.tgt = null;
				t.focus = null;
				t.bn = undefined;
				t.hb = undefined;
				setJob(t, t.kind === 'vil' ? G.P[u.owner].rally : null);
				t.levy = undefined;
				t.max = maxHpU(u.owner, t.kind);
				t.hp = Math.min(t.hp, t.max);
				u.cvCd = G.t + CONVERT.cd;
				u.cvT = 0;
				u.state = 'home';
				if (u.owner === 0) say(`Converted: their ${UNIT[t.kind].name.toLowerCase()} is yours.`, 'good', 5, t);
				else if (was === 0) say(`A priest turned your ${UNIT[t.kind].name.toLowerCase()}!`, 'warn', 5, t);
			}
		} else {
			u.cvT = Math.max(0, (u.cvT || 0) - dt);
			moveTo(u, t.x, t.y, dt, CONVERT.r - 6, SP);
		}
		return;
	}
	if (u.state === 'shrine') {
		const f = G.finds.find((x) => x.id === u.fid);
		if (f) {
			moveTo(u, f.x + u.ox * 0.2, f.y + 22, dt, 4, SP);
			return;
		}
		u.state = 'home';
	}
	if (followArmy(u, dt, SP)) return;
	if (u.state === 'goto' || u.state === 'assist') {
		moveTo(u, u.px + u.ox * 0.6, u.py + u.oy * 0.6, dt, 3, SP);
		return;
	}
	const h = homeSpot(u, 90);
	if (h) moveTo(u, h.x, h.y, dt, 3, SP);
}
function medicTick(u, dt, SP) {
	if (followArmy(u, dt, SP)) return;
	if (u.state === 'goto' || u.state === 'assist') {
		moveTo(u, u.px + u.ox * 0.6, u.py + u.oy * 0.6, dt, 3, SP);
		return;
	}
	const h = homeSpot(u, 90);
	if (h) moveTo(u, h.x, h.y, dt, 3, SP);
}
// Healing: a hospital or a medic heals your own soldiers within reach. The best one in reach counts; they do not add up. A wound closes
// toward full as the first-order lag (the delayed exponential of Cukjati, Reberšek & Miklavčič 2001: fast while the wound is wide, slowing
// as it closes); the healer's `heal` is the hit points a second a linear rate would give, so τ = max / heal and a half-dead soldier takes the time it did.
function healTick(dt) {
	if (G.tick % 3) return;
	const H = [];
	for (const b of G.blds) {
		const h = BLD[b.kind].heal;
		if (h && b.prog >= 1 && b.hp > 0) H.push(b.x, b.y, BLD[b.kind].hrng, h, b.owner);
	}
	for (const u of G.units) {
		const h = UNIT[u.kind].heal;
		if (h && !u.inside) H.push(u.x, u.y, UNIT[u.kind].hrng, h, u.owner);
	}
	if (!H.length) return;
	for (const u of G.units) {
		if (u.hp >= u.max - 0.01 || UNIT[u.kind].cls !== 'army') continue;
		let best = 0;
		for (let i = 0; i < H.length; i += 5)
			if (H[i + 4] === u.owner && H[i + 3] > best && hyp(H[i] - u.x, H[i + 1] - u.y) < H[i + 2]) best = H[i + 3];
		if (best) u.hp = relax(u.hp, u.max, u.max / (best * fxv(u.owner, 'heal').m), dt * 3);
	}
}

// ───────────────────────── Soldiers ─────────────────────────
// a missile in the air: it flies for a time that grows with the distance, on a curve that rises with it
function shot(x1, y1, h1, x2, y2, fire) {
	const d = hyp(x2 - x1, y2 - y1),
		dur = 0.12 + d / 600;
	G.tracers.push({ x1, y1, h1, x2, y2, life: dur, dur, arc: 4 + d * 0.16, fire: !!fire });
}
// a soldier at home guards the ground round its own yard and round the Town Center (Build 39 review: a yard far from the Town Center was left undefended)
const nearHome = (u, t, k) => (u.hax !== undefined && hyp(t.x - u.hax, t.y - u.hay) < 320) || (!!k && dist(t, k) < 320);
function solTick(u, dt, SP) {
	const U = UNIT[u.kind],
		o = u.owner,
		k = keepOf(o);
	u.cd = Math.max(0, u.cd - dt);
	u.kiting = kiteOf(u); // a shooter steps back from a foe on top of it, unless it presses; a horse archer always rides away
	if (u.state === 'school') {
		u.idleT = 0;
		if (G.t >= u.schoolT) graduate(u);
		return;
	} // at the School: it stands, learns, and comes out a newer soldier
	if (u.state === 'garrison') {
		// Battle stations: it walks to its building, goes inside and adds an arrow, and stays until given a new order
		const b = G.blds.find((x) => x.id === u.gar && x.hp > 0 && x.prog >= 1);
		if (!b) u.state = 'home';
		else {
			u.idleT = 0;
			if (!u.inside && moveTo(u, b.x, b.y, dt, BLD[b.kind].fp * 5 + 4, SP)) {
				u.inside = true;
				u.hid = b.id;
			}
			return;
		}
	}
	if (u.inside) {
		// a new order: out of the building
		const b = G.blds.find((x) => x.id === u.hid);
		u.inside = false;
		u.hid = 0;
		if (b) {
			u.x = b.x + u.ox * 0.8;
			u.y = b.y + 30;
		}
	}
	if (
		u.hp < u.max &&
		!u.tgt &&
		o !== WILD &&
		(G.tick + u.id) % 30 === 0 &&
		G.blds.some(
			(b) =>
				b.owner === o &&
				b.hp > 0 &&
				b.prog >= 1 &&
				(b.kind === 'castle' || b.kind === 'barracks' || b.kind === 'keep') &&
				dist(b, u) < GARRISON.r,
		)
	)
		u.hp = relax(u.hp, u.max, u.max / (GARRISON.heal * fxv(o, 'garrison').m), 1); // garrisoned: the wound closes, once a second
	if (u.state === 'rout') {
		// broken: it runs from the nearest foe toward home, then comes to itself
		if (G.t > u.routT) {
			u.state = 'home';
			u.mor = MORALE.after;
			u.fleeFrom = null;
			return;
		}
		const f = (G.tick + u.id) % 6 === 0 || !u.fleeFrom ? (u.fleeFrom = nearestFoe(o, u, 220)) : u.fleeFrom,
			h = homeOf(o) || u;
		const dx = f ? u.x - f.x : h.x - u.x,
			dy = f ? u.y - f.y : h.y - u.y,
			dd = hyp(dx, dy) || 1;
		moveTo(
			u,
			clamp(u.x + (dx / dd) * 60, 20, MAP - 20),
			clamp(u.y + (dy / dd) * 60, 20, MAP - 20),
			dt,
			3,
			SP * MORALE.routSpd,
		);
		u.idleT = 0;
		return;
	}
	if ((G.tick + u.id) % 4 === 0) {
		// the nerve breathes, four times a second: quiet lets it settle back toward 1 (the first-order lag, MORALE.tau), faster by a wall or
		// tower of its own and by a priest; being outnumbered drains it
		const d4 = dt * 4;
		let m = u.mor;
		if (!u.tgt) {
			let rate = fxv(o, 'rest').m;
			if (
				bldsNear(
					u.x,
					u.y,
					60,
					(b) =>
						b.owner === o && b.prog >= 1 && b.hp > 0 && (BLD[b.kind].dmg || BLD[b.kind].wallish) && dist(b, u) < 60,
				)
			)
				rate *= MORALE.shelter * fxv(o, 'shelter').m;
			if (
				G.priests.some(
					(p) => p.owner === o && Math.abs(p.x - u.x) < MORALE.priestR && Math.abs(p.y - u.y) < MORALE.priestR,
				)
			)
				rate *= MORALE.priest;
			m = relax(m, 1, MORALE.tau / rate, d4);
		}
		if (u.tgt) {
			let us = 0,
				them = 0;
			unitsNear(u, 100, (v) => {
				if (!isSoldier(v) || v.hp <= 0 || v.inside) return;
				if (v.owner === o) us++;
				else if (atWar(o, v.owner)) them++;
			});
			if (them > (us + 1) * 1.5) m -= MORALE.odds * d4;
		}
		u.mor = clamp(m, 0, 1);
		if (u.mor <= 0 && !(u.fb > G.t) && !U.bonly) {
			u.state = 'rout';
			u.routT = G.t + MORALE.rout * (G.P[o].techs.has('engage') ? 0.5 : 1);
			u.tgt = null;
			u.focus = null;
			u.fleeFrom = null;
			if (o === 0 && G.t - (G.routSay || -99) > 8) {
				G.routSay = G.t;
				say(`${u.bn !== undefined ? BN[u.bn] : 'Your soldiers'} break and run!`, 'warn', 5, u);
			}
			return;
		}
		if (u.chg && G.t > u.chg) {
			u.tired = G.t + CHARGE.tired;
			u.chg = 0;
		}
	}
	let tgt = u.tgt; // looks for the best foe a few times a second (bestFoe), and keeps the one it has unless another is clearly better
	if (
		tgt &&
		!(
			tgt.hp > 0 &&
			!tgt.inside &&
			atWar(o, tgt.owner) &&
			(edge(u, tgt) < sightOf(u) * 1.4 * (TEMPER[temperOf(u)].chase || 1) ||
				(u.state === 'home' && nearHome(u, tgt, k)))
		)
	)
		tgt = u.tgt = null; // the one it had is gone; a soldier at home keeps a foe it was sent after near the Town Center (Build 38: dropping it the next step made new soldiers spin)
	if ((G.tick + u.id) % 4 === 0) {
		// its turn to look, about seven times a second: with a foe or without. Commander's intent (Build 63, your squads): Engage looks as far
		// as it sees; No pursuit only to the reach of its blade while it walks; Priority: buildings takes the nearest building first
		const it = o === 0 && u.bn !== undefined && G.bnIntent ? G.bnIntent[u.bn] || 0 : 0,
			look = it === 1 && u.state === 'goto' ? rngOf(u) + 10 : sightOf(u);
		if (U.bonly || (it === 2 && nearestFoeBld(o, u, undefined, look))) tgt = nearestFoeBld(o, u, undefined, look);
		else {
			// the best foe in sight by the attack-value rule; the one it is fighting is kept unless the new one is FORAGE.move better
			const c = bestFoe(o, u, look),
				cur = u.tgt && !u.tgt.q ? u.tgt : null,
				inReach = cur && edge(u, cur) <= rngOf(u) + 8, // a foe already at the blade is never dropped for one farther off (Build 63)
				keep =
					cur &&
					(!c ||
						inReach ||
						(canBeat(u, cur) >= canBeat(u, c) &&
							foeValue(u, c, dist(u, c)) < FORAGE.move * foeValue(u, cur, dist(u, cur))));
			tgt = keep ? cur : c;
		}
		if (u.state === 'home' && tgt && !nearHome(u, tgt, k)) tgt = null;
		if (!tgt && u.state === 'home' && !U.bonly)
			tgt =
				(u.hax !== undefined && nearestFoe(o, u, 320, { x: u.hax, y: u.hay })) ||
				(k && nearestFoe(o, u, 320, k)) ||
				null; // a foe near its own yard first, then near the Town Center
		u.tgt = tgt;
	}
	if (u.focus) {
		if (u.focus.hp > 0 && !u.focus.inside && atWar(o, u.focus.owner)) {
			tgt = u.focus;
			u.tgt = tgt;
		} else u.focus = null;
	} // told to hit this one
	if (
		tgt &&
		o === 0 &&
		u.state !== 'attack' &&
		!u.focus &&
		temperOf(u) === T_HOLD &&
		edge(u, tgt) > rngOf(u) + (tgt.q ? 2 : 5)
	)
		tgt = null; // hold ground: fight only what comes within reach
	if (u.state === 'escort') {
		escortPick(u);
		if (!u.esc) u.state = 'home';
		else if (tgt && dist(tgt, u.esc) > 110) tgt = nearestFoe(o, u, 110, u.esc);
	}
	if (!tgt && u.blocker && u.blocker.hp > 0 && atWar(o, u.blocker.owner) && G.t - u.blockT < 1) tgt = u.blocker;
	if (!tgt && u.state === 'attack') {
		if (!(u.bt && u.bt.hp > 0 && u.bt.owner === u.target && atWar(o, u.bt.owner)) || (G.tick + u.id) % 5 === 0)
			u.bt =
				(u.bid && G.blds.find((b) => b.id === u.bid && b.hp > 0 && atWar(o, b.owner))) ||
				nearestFoeBld(o, u, u.target, 260); // a mark that changed hands is no mark
		tgt = u.bt;
		if (!tgt) {
			const kp = keepOf(u.target);
			if (kp && edge(u, kp) > 40) {
				moveTo(u, kp.x + u.ox * 0.5, kp.y + u.oy * 0.5, dt, 20, SP);
				return;
			}
			tgt = nearestFoeBld(o, u, u.target);
			if (!tgt) u.state = 'home';
		}
	}
	if (tgt) {
		const reach = rngOf(u) + (tgt.q ? 2 : 5);
		if (
			!tgt.q &&
			tgt.state === 'rout' &&
			tgt.routT - G.t < MORALE.rout - 2 &&
			dist(u, tgt) <= MORALE.capR &&
			!U.bonly
		) {
			takePrisoner(o, tgt);
			u.tgt = null;
			return;
		} // a hand on a runner who did not get away: a prisoner (riders catch the foot)
		if (edge(u, tgt) <= reach) {
			const fd = dist(u, tgt) || 1;
			u.fx = (tgt.x - u.x) / fd;
			u.fy = (tgt.y - u.y) / fd;
			if (u.kiting && u.cd > 0 && (G.tick + u.id) % 3 === 0) {
				// reloading with a foe on top of it: step back
				const f = nearestFoe(o, u, KITE);
				if (f && !f.q && UNIT[f.kind].rng <= 20) {
					const dx = u.x - f.x,
						dy = u.y - f.y,
						dd = hyp(dx, dy) || 1;
					const kx = clamp(u.x + (dx / dd) * 28, 15, MAP - 15),
						ky = clamp(u.y + (dy / dd) * 28, 15, MAP - 15);
					if (!blockedCell(gcell(kx, ky), o)) {
						u.kx = kx;
						u.ky = ky;
						u.kT = G.t;
					}
				}
			}
			if (u.kT > G.t - 0.5 && u.cd > 0) {
				moveTo(u, u.kx, u.ky, dt, 2, SP);
				return;
			}
			if (u.cd <= 0) {
				u.cd = U.cd;
				u.hitT = G.t;
				if (hasTag(u.kind, 'siege') && G.clim.snow > 0 && rng() < CLIMATE.miss * G.clim.snow * (1 - fxv(o, 'snow').a)) {
					u.hp -= u.max * CLIMATE.missHurt;
					scarStrike(u.x + u.fx * 30, u.y + u.fy * 30);
					if (o === 0 && (G.tick + u.id) % 90 < 3) say('Snow: the engine slid, shot short.', 'warn', 4, u);
				} // an engine on snow
				else {
					hurt(o, u, tgt, dmgOf(u));
					if (U.rng > 20) shot(u.x, u.y, 9, tgt.x, tgt.y, fxv(o, 'fire', unitKeys(u.kind)).a >= 1); // fire arrows burn on the way
				}
			}
		} else moveTo(u, tgt.x, tgt.y, dt, Math.max(2, reach - 2 + (tgt.q ? halfOf(tgt) : 0)), SP);
		u.idleT = 0;
		return;
	}
	if (u.state === 'escort' && u.esc) {
		moveTo(u, u.esc.x + u.ox * 0.5, u.esc.y + u.oy * 0.5, dt, 14, SP);
		return;
	}
	if (u.state === 'goto' || u.state === 'assist') {
		const ak = u.px + ',' + u.py;
		if (u.fanK !== ak && hyp(u.px - u.x, u.py - u.y) < GRID.fan) u.fanK = ak; // near the spot: from here to its own place in the shape
		const fan = u.fanK === ak; // (Build 48: each soldier walked its own way to its own place, and the army split round woods)
		if (moveTo(u, u.px + (fan ? (u.gx ?? u.ox * 0.6) : 0), u.py + (fan ? (u.gy ?? u.oy * 0.6) : 0), dt, 3, SP)) {
			u.idleT += dt;
			if (u.state === 'assist' && u.idleT > 20) u.state = 'home';
		}
		return;
	}
	const h = homeSpot(u, 90);
	if (h) moveTo(u, h.x, h.y, dt, 3, SP);
}
// a guard keeps to what it guards: a caravan (escort) or a trade stop you hold (garrison); when that is gone, it goes home
function escortPick(u) {
	if (u.escF !== undefined) {
		const f = G.finds.find((x) => x.id === u.escF);
		u.esc = f && f.owner === u.owner ? f : null;
		if (!u.esc) u.escF = undefined;
		return;
	}
	if (u.esc && u.esc.hp > 0 && (G.tick + u.id) % 20) return;
	u.esc =
		u.escId !== undefined
			? G.units.find((v) => v.id === u.escId && v.hp > 0) || null
			: nearest(G.units, u, (v) => v.kind === 'caravan' && v.owner === u.owner);
	if (!u.esc) u.escId = undefined;
}

// ───────────────────────── The wild ─────────────────────────
// Guards stay by what they guard and attack whoever comes close; game grazes and runs; robbers raid within their reach.
function wildTick(u, dt, SP) {
	const U = UNIT[u.kind];
	if (U.passive) return;
	if (U.flee) {
		const hurtNow = G.t - (u.hurtT || -99) < 6; // game ignores villagers (they are the hunters) until hit; soldiers always scare it
		if ((G.tick + u.id) % 6 === 0) {
			const t = nearU(u, 70, (v) => v.owner !== WILD && !v.inside && (hurtNow || v.kind !== 'vil'));
			u.run = t ? { x: u.x + (u.x - t.x), y: u.y + (u.y - t.y) } : null;
		}
		if (u.run) {
			const nx = clamp(u.run.x, 20, MAP - 20),
				ny = clamp(u.run.y, 20, MAP - 20);
			const sp = U.spd * (hurtNow ? 0.45 : 1);
			// a step that slides along a wall, as moveTo does (Build 63: the old step walked into the building and jumped out: the glitch)
			let x1 = u.x + clamp(nx - u.x, -1, 1) * sp * dt,
				y1 = u.y + clamp(ny - u.y, -1, 1) * sp * dt;
			if (blockedCell(gcell(x1, y1), WILD)) {
				if (!blockedCell(gcell(x1, u.y), WILD)) y1 = u.y;
				else if (!blockedCell(gcell(u.x, y1), WILD)) x1 = u.x;
				else {
					x1 = u.x;
					y1 = u.y;
					u.run = null; // cornered: it stops, and picks a new way off next look
				}
			}
			u.fx = Math.sign(nx - u.x) || u.fx;
			u.x = x1;
			u.y = y1;
			u.mvT = G.t;
		} else if (G.t > (u.graze || 0)) {
			u.graze = G.t + rnd(3, 8);
			const gx = u.hx + rnd(-40, 40),
				gy = u.hy + rnd(-30, 30),
				f = blockedCell(gcell(gx, gy), WILD)
					? freeNear(Math.floor(gx / NAVC), Math.floor(gy / NAVC), WILD, 3, gx, gy)
					: { x: gx, y: gy };
			if (f) {
				u.gx = f.x; // graze only where it fits: a spot inside a building had it nosing the wall (Build 63)
				u.gy = f.y;
			}
		} else if (u.gx !== undefined) moveTo(u, u.gx, u.gy, dt * 0.3, 3, 1);
		return;
	}
	u.cd = Math.max(0, u.cd - dt);
	const home = { x: u.hx, y: u.hy },
		leash = u.horde ? 1e9 : (U.raid || 120) + 60;
	let t = u.tgt;
	if ((G.tick + u.id) % 5 === 0 || !(t && t.hp > 0 && !t.inside)) {
		t = null;
		if (u.aggro && u.aggro.hp > 0 && !u.aggro.inside && dist(u.aggro, home) < leash) t = u.aggro;
		if (!t)
			t = nearU(
				u,
				U.raid ? U.raid + 40 : 140,
				(v) =>
					v.owner !== WILD &&
					!v.inside &&
					v.kind !== 'envoy' &&
					(u.horde || dist(v, home) < (U.raid && hasTag(v.kind, 'civ') ? U.raid : 90)) &&
					!(U.raid && guardedCart(v)),
			);
		if (!t && u.horde) {
			const b = nearestFoeBld(WILD, u, undefined, 200);
			if (b) t = b;
		} // the horde breaks buildings too
		u.tgt = t;
	}
	if (t && dist(t, home) > leash) {
		t = u.tgt = null;
		u.aggro = null;
	}
	if (t) {
		const reach = U.rng + 5 + (t.q ? halfOf(t) : 0);
		if (edge(u, t) <= reach) {
			u.fx = Math.sign(t.x - u.x) || u.fx;
			if (u.cd <= 0) {
				hurt(WILD, u, t, U.dmg);
				u.cd = U.cd;
				u.hitT = G.t;
			}
		} else moveTo(u, t.x, t.y, dt, reach - 2, SP);
		return;
	}
	if (dist(u, home) > 30) moveTo(u, u.hx + u.ox * 0.5, u.hy + u.oy * 0.5, dt, 6, SP);
}
function wayfarers(dt) {
	G.wayT -= dt;
	if (G.wayT > 0) return;
	G.wayT = WAYFARER_EVERY;
	const E = [
			[MID, 60],
			[MAP - 60, MID],
			[MID, MAP - 60],
			[60, MID],
		],
		i = G.wayI++ % 4,
		a = E[i],
		b = E[(i + 2) % 4];
	const w = addUnit(WILD, 'wayfarer', a[0], a[1]);
	w.px = b[0];
	w.py = b[1];
	say('A wayfarer: reach him first to gain him.', '', 6, w);
}
function wayfarerTick(u, dt, SP) {
	if ((G.tick + u.id) % 6 === 0) {
		const m = nearU(u, 22, (v) => v.owner !== WILD && v.kind !== 'envoy' && !v.inside);
		if (m) {
			const o = m.owner;
			u.hp = 0;
			u.gone = true;
			for (let i = 0; i < (UNIT[u.kind].joins || 1); i++)
				if (clsCount(o, 'civ') < clsMax('civ', o)) {
					const v = addUnit(o, 'vil', u.x + i * 6, u.y);
					v.job = o === 0 ? G.P[0].rally : null;
				} else earn(G.P[o], 'f', 50, 'finds'); // no room: what it carried
			if (o === 0)
				say(UNIT[u.kind].joins > 1 ? 'The settlers join your people.' : 'A wayfarer joins your people.', 'good', 5);
			return;
		}
	}
	if (moveTo(u, u.px, u.py, dt, 10, SP)) {
		u.hp = 0;
		u.gone = true;
	}
}
const guardsLeft = (f) =>
	f.guards.length && G.units.some((v) => v.find === f.id && v.owner === WILD && v.hp > 0 && v.kind !== 'vagabond');
function findsTick(dt) {
	for (const f of G.finds) {
		if (f.done && !FINDS[f.kind].capture) continue;
		const F = FINDS[f.kind];
		if (F.capture) {
			// a holy site: priests take it, it pays its keeper
			const here = G.units.filter((u) => u.kind === 'priest' && dist(u, f) < 30),
				sides = [...new Set(here.map((u) => u.owner))];
			if (sides.length === 1 && sides[0] !== f.owner) {
				const o = sides[0];
				if (!f.cap || f.cap.o !== o) f.cap = { o, t: 0 };
				f.cap.t += dt;
				if (f.cap.t >= F.capture) {
					const was = f.owner;
					f.owner = o;
					f.cap = null;
					if (o === 0) say('Your priest holds the shrine.', 'good', 5);
					else if (was === 0) say(`${G.P[o].name} took your shrine.`, 'warn', 5, f);
				}
			} else if (!sides.length) f.cap = null;
			if (f.owner !== null && G.P[f.owner].alive) {
				f.acc = (f.acc || 0) + F.pay * dt;
				if (f.acc >= 1) {
					const g = Math.floor(f.acc);
					f.acc -= g;
					earn(G.P[f.owner], 'g', g, 'loot');
				}
			}
			continue;
		}
		if (!F.got || guardsLeft(f)) continue;
		const m = nearU(f, 26, (v) => v.owner !== WILD && v.kind !== 'envoy' && !v.inside);
		if (!m) continue;
		const o = m.owner,
			got = {};
		addRes(got, F.got, G.fantasy ? 1.5 : 1);
		if (f.hoard) got.g = (got.g || 0) + f.hoard;
		for (const k in got) got[k] = Math.round(got[k]);
		f.done = true;
		f.owner = o;
		for (const k in got) earn(G.P[o], k, got[k], 'finds');
		let extra = '';
		if (F.tech) {
			const T = TECH.find(
				(T) =>
					!G.P[o].techs.has(T.id) &&
					T.age <= G.P[o].age &&
					(!T.civ || T.civ === G.P[o].civ) &&
					isNext(o, T) &&
					needsOf(T).every((n) => G.P[o].techs.has(n)) &&
					!T.tier &&
					!G.blds.some((b) => b.owner === o && b.q.some((j) => j.tech === T.id)),
			);
			if (T) {
				learnTech(o, T.id);
				extra = ` and a scroll: ${T.name}`;
			}
		}
		if (o === 0) {
			say(`${F.name}: ${costText(got)}${extra}.`, 'good', 6);
			sfx('coin');
		}
	}
}
