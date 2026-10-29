// ═════ 13-sim-civil.js: villagers, hunters, repairers, scouts, envoys, caravans, spies ═════
function vilTick(u, dt, SP) {
	u.idle = false;
	const kk = keepOf(u.owner),
		rb = (u.hid && G.blds.find((b) => b.id === u.hid && b.hp > 0 && b.prog >= 1)) || kk; // where it hides: the Town Center, or a tower with room
	if (u.inside) {
		// sheltering: out again when no enemy soldier is near the place
		if (!rb) {
			u.inside = false;
			return;
		}
		if (!u.emg && (G.tick + u.id) % 10 === 0 && !nearU(rb, SHELTER.clear, (v) => v.thr && atWar(u.owner, v.owner))) {
			u.inside = false;
			u.scared = false;
			u.hid = 0;
			u.x = rb.x + u.ox * 0.8;
			u.y = rb.y + 30;
		}
		return;
	}
	if ((G.tick + u.id) % 5 === 0) {
		const was = u.scared,
			r = was ? SHELTER.flee * 1.6 : SHELTER.flee;
		let wild = 0,
			foe = 0; // enemy soldiers scare everyone near; a lone beast or robber scares only the one it hits, three or more (a pack) scare all; once running, keeps running until well clear
		unitsNear(u, r, (v) => {
			if (v.thr && v !== u.hunt && atWar(u.owner, v.owner) && dist(u, v) < r) {
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
					G.units.filter((v) => v.inside && v.hid === b.id).length < BLD[b.kind].shelter,
				220,
			);
			u.hid = tw && dist(u, tw) < dist(u, kk) ? tw.id : kk.id;
		}
	}
	if (u.scared && kk) {
		if (u.safe) {
			moveTo(u, u.safe.x, u.safe.y, dt, 6, SP); // no room inside: waits behind the Town Center
			return;
		}
		if (moveTo(u, rb.x, rb.y, dt, BLD[rb.kind].fp * 5 + 4, SP)) {
			u.inside = true;
			setJob(u, u.job);
			u.node = null;
			u.hunt = null;
		}
		return;
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
			const got = Math.round(u.carry);
			stash(u.owner, u.carryType, got);
			u.st.got += got;
			u.st.trips++;
			u.carry = 0;
		}
		if (u.carry > 0 || u.hunt || !u.node || u.node.amt > 0) return;
	}
	if (u.job === 'repair') {
		repairTick(u, dt, SP);
		return;
	}
	if (!u.job) {
		u.idle = true;
		if (u.post) moveTo(u, u.post.x, u.post.y, dt, 2, SP);
		else if (kk) moveTo(u, kk.x + u.ox, kk.y + u.oy, dt, 2, SP);
		return;
	} // sent somewhere by the finger, it stands there; else it waits by the Town Center
	if (
		(G.tick + u.id) % 20 === 0 &&
		((u.node && u.node.kind !== 'farm' && unsafe(u.node)) || (u.hunt && unsafe(u.hunt)))
	) {
		if (u.node && u.node.farm) u.node.wk = Math.max(0, (u.node.wk || 0) - 1);
		u.node = null;
		u.hunt = null;
	} // work or game has strayed beside a guarded find: leave it
	if (u.hunt) {
		huntTick(u, dt, SP);
		return;
	}
	const flock = u.node && u.node.farm && BLD[u.node.farm.kind].sheep && u.node.farm.hp > 0; // a shepherd stays with the flock between shearings
	if (flock && u.node.farm.prog >= 1 && dist(u, u.node) < 40) {
		const b = u.node.farm,
			m = (b.sheep || 0) * BLD[b.kind].milk * dt * gatherMul(u.owner, u.node) * hungerOf(u.owner);
		if (m > 0) {
			stash(u.owner, 'food', m);
			u.st.got += m;
			u.work = G.t;
		}
	} // milk and meat go straight to the stores
	if (
		!flock &&
		(!u.node || u.node.amt <= 0 || !nodeFits(u.node, u.job) || (u.node.farm && u.node.wk > slotsOf(u.node)))
	) {
		if (u.node && u.node.farm) u.node.wk = Math.max(0, (u.node.wk || 0) - 1);
		if (u.nnT > G.t) {
			u.node = null;
			u.idle = true;
			return;
		} // nothing was found a moment ago: wait, do not search every step
		const n = nearestNode(u, u.job);
		if (!n && !u.patch) u.nnT = G.t + 2 + rng();
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
			u.node = null;
			return;
		}
		u.node = n;
		if (n && n.farm) n.wk = (n.wk || 0) + 1;
	} else if (u.job === 'food' && u.node.kind !== 'farm' && G.t > (u.chk || 0)) {
		// a field has come free: fields first
		u.chk = G.t + 3 + rng() * 2;
		const f = nearestNode(u, 'food');
		if (f && f.kind === 'farm') {
			u.node = f;
			f.wk = (f.wk || 0) + 1;
		}
	}
	const n = u.node;
	if (!n) {
		u.idle = true;
		return;
	}
	// a worker already at work keeps its place a little further out (4 more), so crowd spacing and walking in no longer fight
	if (
		moveTo(
			u,
			n.x,
			n.y,
			dt,
			(n.kind === 'fish' ? 13 : n.kind === 'farm' ? 4 : 9) + (G.t - (u.work || -9) < 0.5 ? 4 : 0),
			SP,
		)
	) {
		const rate = n.rate || RATE_OF[n.kind];
		let g = Math.min(
			rate *
				dt *
				gatherMul(u.owner, n) *
				(u.sick > G.t ? 0.5 : 1) *
				hungerOf(u.owner) *
				(u.cheer > G.t ? EVENTS.circus.mul : 1),
			n.amt,
			cap - u.carry,
		);
		if (starving(u.owner)) g = 0;
		const mk = n.farm && makeOf(n.farm),
			from = mk && mk.from; // a workshop turns what is in store into something else: 2 wool make 1 cloth, 3 wood 1 iron
		if (from) {
			const P = G.P[u.owner],
				box = (k) => (k in P.res ? P.res : P.goods);
			for (const k in from) g = Math.min(g, (box(k)[k] || 0) / from[k]);
			if (g <= 1e-6) {
				u.wait = true;
				return;
			}
			for (const k in from) box(k)[k] -= g * from[k];
		}
		u.wait = false;
		n.amt -= g;
		u.carry += g;
		n.workT = G.t;
		u.carryType = n.type;
		u.work = G.t;
		u.fx = Math.sign(n.x - u.x) || u.fx;
		if ((G.tick + u.id) % 40 === 0) sfx(n.type === 'wood' ? 'chop' : n.type === 'food' ? 'pick' : 'mine', u.x, u.y);
	}
}
function huntTick(u, dt, SP) {
	const a = u.hunt;
	if (!a || a.hp <= 0) {
		u.hunt = null;
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
function repairTick(u, dt, SP) {
	let b = u.rep;
	const o = u.owner,
		p = G.P[o];
	if (b && b.hp > 0 && b.owner === o && b.prog >= 1 && u.building) {
		// the site it was raising is done: the next unfinished piece of wall nearby, else back to what it was doing
		u.building = false;
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
			const pj = u.pj;
			u.pj = null;
			setJob(u, pj && pj !== 'repair' ? pj : null);
			return;
		}
	}
	if (u.fireman && !(b && b.hp > 0 && b.fire > 0)) {
		u.fireman = false;
		const pj = u.pj;
		u.pj = null;
		setJob(u, pj && pj !== 'repair' ? pj : null);
		return;
	} // the fire is out: back to work
	if (!b || b.hp <= 0 || b.owner !== o) {
		u.building = false;
		setJob(u, null);
		return;
	}
	if (b.fire > 0) {
		if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return;
		if (!b.smoke && (b.spread || b.hp < maxHpB(o, b.kind) / 2) && rng() < FIRE_SMOKE * dt) {
			b.smoke = true;
			u.hp = 0;
			if (o === 0) say(`Smoke killed a villager at the ${bldName(0, b.kind).toLowerCase()}.`, 'warn', 6, b);
			return;
		} // a big fire can take one of its fighters
		b.fire = Math.max(0, b.fire - 0.2 * dt);
		u.work = G.t;
		if (!b.fire && b.owner === 0) say(`The fire at the ${bldName(0, b.kind).toLowerCase()} is out.`, 'good', 4, b);
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
		setJob(u, null);
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
		setJob(u, null);
		if (o === 0 && G.t - (G.repSay || -99) > 5) {
			G.repSay = G.t;
			say('Not enough to pay for repairs.', '', 3);
		}
		return;
	}
	for (const k in due) {
		const whole = Math.floor(due[k]);
		p.res[k] -= whole;
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
		const c = [
			[MID, MAP - 420],
			[MAP - 420, MID],
			[MID, 420],
			[420, MID],
			[520, 520],
			[MAP - 520, 520],
			[MAP - 520, MAP - 520],
			[520, MAP - 520],
			[MID - 300, MID - 300],
			[MID + 300, MID + 300],
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
		const k = homeOf(u.target);
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
		const f = nearestFoe(o, u, 24);
		if (f) hurt(o, u, f, 4);
	} // armed caravans strike back
	if (u.route) {
		routeTick(u, dt, SP);
		return;
	}
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
			G.P[o].res.g += u.cargo;
			G.P[o].gathered += u.cargo;
			if (o === 0 && u.cargo) {
				say(`A caravan earns ${u.cargo} gold from your ally.`, 'good', 3, d);
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
		const [sR, bR] = UNIT.spy.stealth;
		if (o !== 0)
			u.exposed =
				atWar(0, o) &&
				(G.units.some((v) => v.owner === 0 && dist(v, u) < sR) ||
					G.blds.some((b) => b.owner === 0 && watchtower(b) && dist(b, u) < bR));
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
		if (u.state === 'look' && (G.tick + u.id) % 15 === 0) {
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
