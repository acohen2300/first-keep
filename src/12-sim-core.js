// ═════ 12-sim-core.js: the step, formations, deaths, victory, buildings built, research learned ═════
// ───────────────────────── The simulation ─────────────────────────
const isThreat = (v) => {
	const U = UNIT[v.kind];
	return !v.inside && v.hp > 0 && (U.tick === 'sol' ? !U.bonly : U.tick === 'wild' && U.dmg && !U.flee && !U.passive);
};
// once a second, and at once after a load: finds with live guards (villagers keep away from work beside them), and how many work each find (so workers spread out)
function recount() {
	G.guarded = G.finds.filter((f) => !f.done && guardsLeft(f));
	dangerMap();
	for (const n of G.nodes) n.wk = 0;
	for (const u of G.units) if (u.node && u.kind === 'vil') u.node.wk++;
}
// what the season and the weather take off a march, for one side: moveTo and the mission clocks read the same number
function sideSpd(o) {
	const sp = season().spd * (hz('winter') && season().name === 'Winter' ? 0.8 : 1),
		wsp = WEATHER[G.wx].spd || 1;
	return o === WILD
		? sp * wsp
		: (1 - (1 - sp) * fxv(o, 'mud').m * (season().name === 'Winter' ? 1 - Math.min(1, fxv(o, 'cold').a) : 1)) *
				(1 - (1 - wsp) * (precip(G.wx) ? 1 - Math.min(1, fxv(o, 'wet').a) : 1));
}
function step(dt) {
	if (G.over) return;
	G.t += dt;
	G.tick++;
	G.night = evOn('eclipse') ? 1 : nightness();
	G.threats = [];
	for (const v of G.units) if ((v.thr = isThreat(v))) G.threats.push(v);
	buildGrid();
	if (G.navDirty) navRebuild();
	NAV.budget = 4;
	const SPS = [0, 1, 2, 3, 4].map(sideSpd);
	for (const b of G.blds) if (b.hp > 0) bldTick(b, dt);
	econTick(dt);
	if (G.tick % 3 === 0) formUp();
	if (G.tick % 30 === 1) {
		recount();
		ordersTick();
		noticeTick();
	}
	if (G.tick % 30 === 2) {
		eventsTick();
		climateTick(1);
		peaceTick();
	}
	if (G.fogOn && G.tick % 10 === 0) fogTick();
	{
		const U = G.units,
			n = U.length,
			s0 = n ? G.tick % n : 0;
		for (let i = 0; i < n; i++) {
			const u = U[(s0 + i) % n];
			if (u.hp > 0) TICK[UNIT[u.kind].tick](u, dt, SPS[u.owner]);
		}
	} // the start rotates each tick, so the path budget is not always spent on the same few
	healTick(dt);
	collide();
	if (G.tick % 15 === 0) findsTick(0.5);
	wayfarers(dt);
	reap();
	for (const tr of G.tracers) tr.life -= dt;
	if ((G.tracers.length && G.tracers[G.tracers.length - 1].life <= 0) || G.tracers.some((tr) => tr.life <= 0))
		G.tracers = G.tracers.filter((tr) => tr.life > 0);
	sidesTick(dt);
	watchHome();
	judge();
}
// the dead and the spent: the fallen leave, buildings that burned or ran dry go, lists shrink once
function reap() {
	for (const u of G.units) if (u.hp <= 0) died(u);
	for (const u of G.units)
		if (u.hp <= 0 && !u.gone && !u.inside) {
			scarFall(u);
			fallen(u);
		}
	{
		let gone = false;
		for (const u of G.units)
			if (u.hp <= 0) {
				gone = true;
				break;
			}
		if (gone) G.units = G.units.filter((u) => u.hp > 0);
	}
	G.ugTick = -1;
	let fxChange = false;
	for (const b of G.blds)
		if (b.node && b.node.amt <= 0 && b.hp > 0 && BLD[b.kind].reserve > 0 && !b.spent) {
			b.spent = true;
			if (b.owner === 0) say(`${bldName(0, b.kind)} cut out: tap it to replant.`, '', 5, b);
		} else if (b.spent && b.node && b.node.amt > 0) b.spent = false; // a coppice plot, spent: it stands, stumps and all, until it is replanted (Build 61; it used to vanish)
	for (const b of G.blds)
		if (b.kind === 'throne' && b.hp <= 0 && !b.gone) {
			if (b.by !== undefined && b.by !== WILD) takeThrone(b.by);
			else b.hp = 1;
		} // the Throne is taken, never broken
	for (const b of G.blds)
		if (b.hp <= 0) {
			if (!b.gone && b.prog >= 1 && !BLD[b.kind].wallish) scarBurn(b);
			if (b.node) b.node.amt = 0;
			if (b.by !== undefined) plunderBld(b);
			if (BLD[b.kind].fx) fxChange = true;
			if (G.wonder && G.wonder.id === b.id) {
				say(
					`${G.P[b.owner].name === 'You' ? 'Your wonder' : 'The wonder of ' + G.P[b.owner].name} has fallen.`,
					b.owner === 0 ? 'warn' : 'good',
					7,
				);
				G.wonder = null;
			}
		}
	if (fxChange) fxDirty();
	if (G.lootT && G.t - G.lootT > 1.5) {
		say(`Plunder: ${costText(G.loot)}.`, 'good', 6);
		G.loot = {};
		G.lootT = 0;
	}
	{
		let gone = false;
		for (const b of G.blds)
			if (b.hp <= 0) {
				gone = true;
				break;
			}
		if (gone) {
			G.blds = G.blds.filter((b) => b.hp > 0);
			G.navDirty = true;
			qcDrop();
		}
	}
	{
		let spent = false;
		for (const n of G.nodes)
			if (!(n.amt > 0 || (n.farm && n.farm.hp > 0))) {
				spent = true;
				break;
			}
		if (spent) {
			G.nodes = G.nodes.filter((n) => n.amt > 0 || (n.farm && n.farm.hp > 0));
			G.navDirty = true;
		}
	} // a tree felled opens its ground the same step (held longer, cutters beside it stall); the list is copied only when something is spent
}
// the computers think, the Natives act, a side without a keep falls, scores and battalions refresh
function sidesTick(dt) {
	for (const p of G.P)
		if (p.id && p.id !== WILD && p.alive) {
			p.ai.t -= dt;
			if (p.ai.t <= 0) {
				p.ai.t = react();
				think(p);
			}
		}
	nativesTick(dt);
	for (const p of G.P) if (p.alive && p.id !== WILD && !keepOf(p.id)) fall(p);
	if (G.tick % 30 === 0) {
		scoreAll();
		rebattalion();
	}
}
// An army stands in a grid: soldiers of one side that wait at home, or are going to the same spot, form rows, battalion beside battalion.
function formUp() {
	// At home an army stands where it was trained: in the yard of its own building, one block per battalion
	// (the reserve last), in ranks across the screen: foot soldiers in front, shooters behind (Build 39: a diagonal grid by the Town Center read as a crowd)
	const homes = new Map(),
		grp = new Map(),
		byId = new Map(G.blds.map((b) => [b.id, b]));
	for (const u of G.units) {
		if (
			u.hp <= 0 ||
			u.inside ||
			UNIT[u.kind].tick !== 'sol' ||
			(u.state !== 'home' && u.state !== 'goto' && u.state !== 'assist')
		)
			continue;
		if (u.state === 'home') {
			const hb = u.hb !== undefined ? byId.get(u.hb) : null,
				b = hb && hb.hp > 0 && hb.prog >= 1 ? hb : keepOf(u.owner);
			if (!b) continue;
			const H = homes.get(b.id) || (homes.set(b.id, { b, blocks: new Map() }), homes.get(b.id)),
				bk = u.bn ?? 9;
			(H.blocks.get(bk) || (H.blocks.set(bk, []), H.blocks.get(bk))).push(u);
			continue;
		}
		const key = u.owner + 'g' + Math.round(u.px / 50) + ',' + Math.round(u.py / 50);
		const a = grp.get(key);
		if (a) a.push(u);
		else grp.set(key, [u]);
	}
	const gap = GRID.gap,
		shoots = (u) => (UNIT[u.kind].rng || 0) > 20;
	for (const { b, blocks } of homes.values()) {
		const at = { x: b.x, y: b.y + BLD[b.kind].fp * 5 + 24 },
			fx = Math.sign(MID - b.x) || 1; // the yard on the side you see (below the building on screen), never hidden behind its roof
		const list = [...blocks.keys()]
			.sort((p, q) => p - q)
			.map((k) => blocks.get(k).sort((p, q) => shoots(p) - shoots(q) || p.id - q.id));
		const cols = list.map((a) => clamp(Math.ceil(Math.sqrt(a.length * 2.5)), 1, 10)),
			width = cols.reduce((w, c) => w + c * gap, 0) + gap * (list.length - 1);
		let x0 = at.x - width / 2;
		list.forEach((a, bi) => {
			const c = cols[bi];
			a.forEach((u, i) => {
				const ri = Math.floor(i / c),
					ci = i % c; // the front rank (foot) next to the building, the ranks behind it (shooters last) further out
				u.hax = x0 + (ci + 0.5) * gap;
				u.hay = at.y + ri * gap;
				u.gx = 0;
				u.gy = 0;
				if (!u.tgt && G.t - (u.mvT || -9) > 0.3) {
					u.fx = fx;
					u.fy = 0;
				}
			});
			x0 += c * gap + gap;
		});
	}
	for (const [, a] of grp) {
		a.sort((p, q) => (p.bn ?? 9) - (q.bn ?? 9) || p.id - q.id);
		const n = a.length,
			k = keepOf(a[0].owner),
			shape = shapeOf(a[0]).shape; // a battalion takes its shape: a narrow column on the march, then the line, the point-first wedge or the closed square
		const cols =
				shape === 'column'
					? Math.min(n, 3)
					: shape === 'square'
						? Math.ceil(Math.sqrt(n))
						: clamp(Math.round(Math.sqrt(n * GRID.rows)), 1, 14),
			wr = (i) => Math.floor((Math.sqrt(8 * i + 1) - 1) / 2);
		// the line faces along the march; ranks trail behind the first, and a unit standing at its place faces the same way
		const t = { x: a[0].px, y: a[0].py },
			fx0 = k ? t.x - k.x : 0,
			fy0 = k ? t.y - k.y : 1,
			fl = hyp(fx0, fy0) || 1,
			fx = fx0 / fl,
			fy = fy0 / fl;
		const cm = NAV.comp[gcell(t.x, t.y)];
		for (let i = 0; i < n; i++) {
			const ri = shape === 'wedge' ? wr(i) : Math.floor(i / cols),
				c = (shape === 'wedge' ? i - (ri * (ri + 1)) / 2 - ri / 2 : (i % cols) - (cols - 1) / 2) * GRID.gap,
				r = -ri * GRID.gap,
				u = a[i],
				sk = t.x + ',' + t.y + ',' + i + ',' + n + ',' + shape + ',' + NAV.v;
			if (u.sk !== sk) {
				// a place in the shape that falls in a tree, a lake or a building, or across a wall, moves to the nearest open ground on the spot's side (Build 48)
				let gx = -fy * c + fx * r,
					gy = fx * c + fy * r;
				const cell = gcell(t.x + gx, t.y + gy);
				if (blockedCell(cell, u.owner) || (cm && NAV.comp[cell] !== cm)) {
					const f = freeNear(cell % NC, Math.floor(cell / NC), u.owner, 6, t.x + gx, t.y + gy, 1, cm);
					if (f) {
						gx = f.x - t.x;
						gy = f.y - t.y;
					}
				}
				u.sk = sk;
				u.sgx = gx;
				u.sgy = gy;
			}
			a[i].gx = u.sgx;
			a[i].gy = u.sgy;
			a[i].hax = undefined;
			if (!a[i].tgt && G.t - (a[i].mvT || -9) > 0.3) {
				a[i].fx = fx;
				a[i].fy = fy;
			}
		}
		{
			let slow = 1e9;
			for (const u of a) if (!hasTag(u.kind, 'siege')) slow = Math.min(slow, stats(u.owner, u.kind).spd);
			for (const u of a) u.cap = u.tgt || slow === 1e9 || hasTag(u.kind, 'siege') ? 0 : slow;
		} // a marching group keeps together at its slowest; engaged units run free; siege trails at its own pace
	}
	const atk = new Map(); // an attack goes at the pace of its battalion until a foe is in sight
	for (const u of G.units)
		if (u.hp > 0 && !u.inside && u.state === 'attack' && isSoldier(u)) {
			if (hasTag(u.kind, 'siege')) continue;
			const key = u.owner + ':' + (u.bn ?? 9) + ':' + (u.bid || 0);
			const s = stats(u.owner, u.kind).spd;
			atk.set(key, Math.min(atk.get(key) ?? 1e9, s));
		} // raiders sent at a camp make their own group
	for (const u of G.units)
		if (u.hp > 0 && isSoldier(u)) {
			if (u.state === 'attack')
				u.cap = u.tgt || hasTag(u.kind, 'siege') ? 0 : atk.get(u.owner + ':' + (u.bn ?? 9) + ':' + (u.bid || 0)) || 0;
			else if (u.state !== 'goto' && u.state !== 'assist') u.cap = 0;
		}
}
const DF = () => DIFF[G.diff] || DIFF.normal;
const react = () => DF().react; // seconds between computer decisions: human-like, no cheats
function died(u) {
	if (isSoldier(u) && !u.gone) {
		// a loss beside you shakes the nerve by its share of the group: a group of n breaks after breakAt × n losses (Dupuy's break point)
		const near = [];
		unitsNear(u, MORALE.lossR, (v) => {
			if (v.owner === u.owner && isSoldier(v) && v.hp > 0) near.push(v);
		});
		const share = 1 / (MORALE.breakAt * (near.length + 1));
		for (const v of near) v.mor -= share;
	}
	if (u.node && u.node.farm) u.node.wk = Math.max(0, (u.node.wk || 0) - 1);
	if (u.kind === 'envoy') G.P[u.owner].envoyOut = false;
	if (u.kind === 'caravan' && u.by === WILD) robbed(u);
	else if (u.kind === 'caravan' && u.by !== undefined && u.by !== WILD) {
		if (u.cargo > 0) plunder(u.by, { g: u.cargo });
		for (const k in u.goods || {}) giveTo(G.P[u.by], k, u.goods[k], 'loot');
	}
	const U = UNIT[u.kind];
	if (U.meat && !u.gone) {
		// game falls where it stands; the hunter butchers it there
		const m = node('meat', 'food', u.x, u.y, U.meat * RICH);
		G.nodes.push(m);
		for (const v of G.units)
			if (v.hunt === u) {
				v.hunt = null;
				v.node = m;
			}
	}
	if (u.owner === 0 && isSoldier(u) && !u.gone) G.lost = (G.lost || 0) + 1;
	if (u.levy !== undefined && G.P[u.levy]) G.P[u.levy].loyal = Math.max(0, (G.P[u.levy].loyal || 0) - DEMAND.levyLoyal); // a vassal's soldier lost under your colours
	if (u.by !== undefined && isSoldier(u))
		for (const p of G.P)
			if (p.lord === u.by && !p.rebel && atWar(p.id, u.owner)) {
				const k = keepOf(p.id);
				if (k && dist(u, k) < VASSAL.r) p.protect = Math.min(VASSAL.protectMax, (p.protect || 0) + VASSAL.kill);
			} // the lord who kills their enemies near them earns their thanks
}
function judge() {
	if (G.over) return;
	if (!G.P[0].alive) {
		finish(false, `Your keep fell. You held out ${clock(G.t)}.`);
		return;
	}
	if (G.free) return; // free play: nothing to win; only your own fall ends it
	if (!G.P[1].alive && !G.P[2].alive && !G.P[3].alive) {
		finish(true, `Every rival has fallen. ${clock(G.t)}`);
		return;
	}
	if (G.throne && G.throne.owner !== WILD && G.t - G.throne.since >= throneHold()) {
		const o = G.throne.owner;
		finish(
			o === 0,
			o === 0
				? `You held the Throne ${Math.round(throneHold() / 60)} minutes.`
				: `${G.P[o].name} held the Throne ${Math.round(throneHold() / 60)} minutes.`,
		);
		return;
	}
	{
		const ruled = (i) => !G.P[i].alive || (G.P[i].lord === 0 && !G.P[i].rebel); // or rule them as vassals for five minutes
		if (ruled(1) && ruled(2) && ruled(3)) {
			G.reignT = G.reignT ?? G.t;
			if (G.t - G.reignT >= VASSAL.reign) {
				finish(true, `You have ruled every rival for ${VASSAL.reign / 60} minutes. ${clock(G.t)}`);
				return;
			}
		} else G.reignT = null;
	}
	if (G.wonder && G.t >= G.wonder.end) {
		const o = G.wonder.owner;
		finish(
			o === 0,
			o === 0
				? `Your ${civOf(0).wonder} stood for ${WONDER_HOLD / 60} minutes.`
				: `The ${civOf(o).wonder} of ${G.P[o].name} stood for ${WONDER_HOLD / 60} minutes.`,
		);
		return;
	}
	const lim = MODES[G.mode].secs;
	if (lim && !G.bell) G.bell = {};
	if (lim)
		for (const m of [300, 60])
			if (G.t >= lim - m && !G.bell[m]) {
				G.bell[m] = 1;
				if (G.t < lim - m + 5) say(`${m / 60} minute${m > 60 ? 's' : ''} left: top score wins.`, 'warn', 7);
			}
	if (lim && G.t >= lim) {
		scoreAll();
		const top = G.P.filter((p) => p.id !== WILD && p.alive).sort((a, b) => b.score.total - a.score.total)[0];
		finish(
			top.id === 0,
			top.id === 0
				? `The bell: you lead with ${fmt(top.score.total)}.`
				: `The bell: ${top.name} lead with ${fmt(top.score.total)}; you have ${fmt(G.P[0].score.total)}.`,
		);
	}
}

// ───────────────────────── Buildings ─────────────────────────
function bldTick(b, dt) {
	const B = BLD[b.kind],
		o = b.owner;
	if (b.prog < 1) {
		const n = b.crew || 0;
		b.crew = 0; // builders who worked it since the last look: one takes the listed time, more help with diminishing returns
		if (!n) return;
		const BT = B.t * fxv(o, 'build').m,
			M = maxHpB(o, b.kind),
			k = (dt / BT) * Math.pow(n, BUILDER_POW) * ((B.cost && B.cost.s && WEATHER[G.wx].stone) || 1); // frost: mortar will not set
		b.prog = Math.min(1, b.prog + k);
		b.hp = Math.min(M, b.hp + M * 0.9 * k);
		if (b.prog >= 1) built(b);
		else if (o === 0 && (G.tick + b.id) % 40 === 0) sfx('hammer', b.x, b.y);
		return;
	}
	const j = b.q[0];
	if (j && !(b.stall > G.t)) {
		if ((j.kind && UNIT[j.kind].cls && popOf(o) >= capOf(o)) || (j.muster && popOf(o) + musterN(j.muster) > capOf(o)))
			b.blocked = true;
		else {
			b.blocked = false;
			j.left -= dt;
			if (j.left <= 0) {
				b.q.shift();
				jobDone(b, j);
			}
		}
	} else if (!j) b.blocked = false;
	if (B.dmg) {
		b.cd = Math.max(0, b.cd - dt);
		if (b.cd <= 0) {
			const keys = bldKeys(b.kind),
				reach = rangeOf(o, b.kind);
			const t = B.spyonly
				? G.units.find((v) => v.kind === 'spy' && atWar(o, v.owner) && dist(v, b) < Math.min(reach, spySeen(o, b))) // a spy it sees, within bowshot
				: nearestFoe(o, b, reach);
			if (t) {
				const sheltered = BLD[b.kind].shelter
					? Math.min(shelterOf(o, b.kind), G.units.filter((u) => u.inside && u.hid === b.id).length)
					: 0;
				hurt(o, null, t, B.dmg + sheltered + (B.spyonly ? 0 : fxv(o, 'dmg', keys).a));
				b.cd = B.cd;
				if (o === 0 && b.kind === 'tower' && G.t - (b.alarmT || -99) > 20) {
					b.alarmT = G.t;
					say(`Foes at your tower at ${coord(b.x, b.y)}.`, 'warn', 6, b);
					sfx('horn', b.x, b.y);
				}
				shot(b.x, b.y, B.h, t.x, t.y);
			}
		}
	}
}
function built(b) {
	const o = b.owner,
		B = BLD[b.kind];
	b.mx = maxHpB(o, b.kind);
	b.hp = Math.max(b.hp, b.mx * 0.999);
	if (!G.fogOn || friendly(0, b.owner)) wearGround(b); // another side's worn ground shows when you first see the building (fog)
	G.bldV = (G.bldV || 0) + 1; // a new place to drop at: every villager picks again
	if (b.kind === 'gate') G.navDirty = true;
	if (B.trap) b.seen = b.seen || {};
	if (B.fx) fxDirty();
	b.doneT = G.t;
	if (o === 0) {
		sfx(B.armyRoom || (B.dmg && !B.spyonly) || B.wallish ? 'doneWar' : 'done', b.x, b.y);
		celebrate(b.kind === 'wonder' ? 3 : 1, b.x, b.y);
	} // a drum for a place of war, a knock for a home
	for (const u of G.units) if (u.rep === b && u.job === 'repair') u.st.built++;
	if (B.sheep && b.node) b.node.amt = (b.sheep || 0) * FLEECE * 0.5; // a new flock comes with half a year's wool on its back
	if (b.kind === 'wonder') {
		G.wonder = { owner: o, id: b.id, end: G.t + WONDER_HOLD };
		say(
			o === 0
				? `Your wonder stands. Hold it ${WONDER_HOLD / 60} min to win.`
				: `${G.P[o].name} built a wonder: break it in ${WONDER_HOLD / 60} min!`,
			o === 0 ? 'good' : 'warn',
			10,
			b,
		);
		sfx('age');
	}
}
function jobDone(b, j) {
	const o = b.owner,
		p = G.P[o],
		B = BLD[b.kind];
	if (j.kind) {
		const s = towardMid(b, B.fp * 5 + 12),
			u = addUnit(o, j.kind, s.x + rnd(-8, 8), s.y + rnd(-8, 8));
		u.hb = b.id;
		u.bornT = G.t;
		if (o === 0) sfx(isSoldier(u) ? 'readySol' : 'ready', b.x, b.y); // a brass call for a soldier, a chime for anyone else
		if (j.kind === 'vil') u.job = o === 0 ? p.rally : null;
		else if (j.kind === 'caravan') u.lastId = b.id;
		else if (o === 0 && UNIT[j.kind].cls === 'army') {
			if (G.recruitSq !== null && G.recruitSq !== undefined && hasCmd()) u.bn = G.recruitSq; // Orders: the squad new soldiers join (Build 63)
			if (G.rally0) {
				// sorted by kind at the rally (Albert, Build 63): each kind has its own stand, a step apart, so a new man finds his own
				const ki = Math.max(0, CLS.findIndex((c) => c[2] === UNIT[j.kind].at));
				u.state = 'goto';
				u.px = G.rally0.x + (ki - 1.5) * 22;
				u.py = G.rally0.y;
			}
		}
	} else if (j.muster) {
		for (const k in j.muster)
			for (let i = 0; i < j.muster[k]; i++) {
				const s = towardMid(b, B.fp * 5 + 12),
					u = addUnit(o, k, s.x + rnd(-14, 14), s.y + rnd(-14, 14));
				u.bornT = G.t;
				u.hb = b.id;
				if (j.bn !== undefined) u.bn = j.bn;
			}
		if (o === 0) {
			sfx('done', b.x, b.y);
			say(`${j.bn !== undefined ? BN[j.bn] : 'A battalion'} mustered: ${musterN(j.muster)} soldiers.`, 'good', 5, b);
		}
	} else if (j.tech) {
		learnTech(o, j.tech);
	} else if (j.age) {
		p.age = j.age;
		p.aging = false;
		fxDirty();
		if (o === 0) {
			say(`You enter the ${AGES[p.age].name} age.`, 'good', 6);
			sfx('age');
			const k = keepOf(0);
			if (k) {
				k.doneT = G.t;
				celebrate(3, k.x, k.y);
			}
		} else if (fxv(0, 'news').a >= 5 || !G.fogOn) say(`${p.name} entered the ${AGES[p.age].name} age.`, '', 4); // another court's age: in the news sheets
		chron(`${o === 0 ? 'You' : p.name} entered the ${AGES[p.age].name} age.`);
	}
}
function learnTech(o, id) {
	const T = TECHBY[id];
	G.P[o].techs.add(id);
	rehealth(o);
	if (T.age === 5) enlightenTick(o);
	if (o === 0) {
		say(
			T.tier
				? `${T.name}: your ${plural(UNIT[T.tier.unit].name.toLowerCase())} are now ${plural(stats(0, civKind(0, T.tier.unit)).name.toLowerCase())}.`
				: `${T.name} learned.`,
			'good',
			5,
		);
		sfx('done');
		const hit = T.tier
			? (u) => u.owner === 0 && baseKind(u.kind) === T.tier.unit
			: (T.fx || []).some((f) => f.k === '#soldier')
				? (u) => u.owner === 0 && isSoldier(u)
				: null;
		if (hit && G.units.some(hit)) {
			const c = keepOf(0);
			celebrate(2, c ? c.x : 0, c ? c.y : 0, hit);
		}
	}
}

// ───────────────────────── Villagers: gather, hunt, carry, mend, shelter ─────────────────────────
function dropFor(o, type, from) {
	return nearest(
		G.blds,
		from,
		(b) => b.owner === o && b.prog >= 1 && b.hp > 0 && BLD[b.kind].drop && BLD[b.kind].drop.includes(type),
	);
}
const dockNear = (o, n) =>
	G.blds.some(
		(b) =>
			b.owner === o &&
			b.kind === 'dock' &&
			b.prog >= 1 &&
			b.hp > 0 &&
			Math.abs(b.x - n.x) < DOCKR &&
			Math.abs(b.y - n.y) < DOCKR &&
			dist(b, n) < DOCKR,
	);
const nodeFits = (n, job) => n.type === job;
const unsafe = (p, o) => !!DANGER[o][gcell(p.x, p.y)]; // on the side's danger map (09-nav: dangerMap); a field is never left for it
// ───────────────────────── Where a worker gathers: the forager's rate (Build 59)
// A villager is a forager, and nature's rule is the rate of return (Holling 1959; Charnov 1976, the marginal value theorem): over the rest
// of a find's life, what it brings home a second. With c the load, g the gathering rate, d the walk from the find to its drop-off, v the
// walking speed, w the walk to reach the find and A what the find has left:
//     R = c (1 − δ) / (c/g + 2d/v + w·c/(A·v))
// The first term is the time to fill a load, the second the trip home and back, the third the one walk out shared over every load the find
// still holds. δ is the danger (Lima & Dill 1990): the danger map is yes-or-no today, so a find on it is not taken at all, as before.
// One rule for every choice: which find to work, who to send to a new field or site, who leaves a job, and when to move (FORAGE.move).
// Crowding: foragers on one find get in each other's way, so each takes less (the ideal free distribution, Fretwell & Lucas 1970, with
// interference, Sutherland 1983): g ÷ (1 + others ÷ room), room the workers a find holds before they stand idle. Without it every worker
// chose the same best tree and stood in line (Build 59's first harness run: blocked villager-seconds four times higher).
const FORAGE = { move: 1.18, life: 20, room: { tree: 1, bush: 2, fish: 2, stone: 3, gold: 3, iron: 3, carcass: 2 } }; // move when 18% better (Albert, Oct 29); a field's life counts as 20 loads; room is design
function forage(u, n, drops) {
	const o = u.owner,
		c = carryOf(o),
		v = stats(o, 'vil').spd * groundSpd(o, ['foot']),
		others = n.hunt || n.kind === 'farm' ? 0 : Math.max(0, (n.wk || 0) - (u.node === n ? 1 : 0)),
		g = ((n.hunt ? RATE_OF.meat : n.rate || RATE_OF[n.kind]) * gatherMul(o, n.hunt ? { type: 'food', kind: 'meat' } : n)) / (1 + others / (FORAGE.room[n.kind] || 2)),
		A = n.hunt ? UNIT[n.hunt.kind].meat : n.kind === 'farm' ? c * FORAGE.life : Math.max(1, n.amt),
		at = n.hunt || n,
		dr = n.kind === 'fish' ? null : (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o),
		d = dr ? dist(dr, at) : 0,
		w = dist(u, at);
	return (c / (c / Math.max(1e-6, g) + (2 * d) / v + (w * c) / (Math.min(A, c * FORAGE.life) * v)));
}
// the rate a worker earns where it is now: 0 idle or off gathering
const forageNow = (u) => (!u.job || u.job === 'repair' ? 0 : u.hunt ? forage(u, { hunt: u.hunt }) : u.node && u.node.amt > 0 && !(u.node.farm && BLD[u.node.farm.kind].makes) ? forage(u, u.node) : 0);
// the best find for this worker and its rate: fields, berries, trees, stone, gold, iron, fish, a carcass, or game within reach of home
function bestNode(u, job) {
	let best = null,
		bR = 0,
		drops = null;
	for (const n of G.nodes) {
		if ((n.amt <= 0 && !(n.farm && BLD[n.farm.kind].sheep)) || !nodeFits(n, job) || (n.kind !== 'farm' && unsafe(n, u.owner)) || (u.bad && u.bad[n.id] > G.t) || (u.owner === 0 && !known0(n))) continue; // your people work only what you have found (Build 60: under fog they set out for finds nobody had seen, into whatever stood there)
		if (n.kind === 'farm') {
			if (n.farm.owner !== u.owner || n.farm.prog < 1 || n.farm.hp <= 0 || (n.wk || 0) - (u.node === n ? 1 : 0) >= slotsOf(n)) continue;
			if (BLD[n.farm.kind].makes || BLD[n.farm.kind].sheep) continue; // a workshop or a pasture is a post, not a find: it is staffed by its builder or by hand
			if (u.was && u.was !== 'farm') continue; // a worker from the wild never drifts onto a plot (Build 61: land work and wild work are two kinds)
		} else {
			if (u.was === 'farm') continue; // nor a plot worker into the wild
			if (u.was && (n.kind !== u.was || dist(u, n) > sightOf(u))) continue; // the same kind of find, and only one it can see from where it stands
			if (n.kind === 'fish' && !dockNear(u.owner, n)) continue;
			if (n.kind === 'tree' && (!n.open || (u.patch && !inBox(n, u.patch)))) continue;
		}
		if (!drops) drops = G.blds.filter((b) => b.owner === u.owner && b.prog >= 1 && b.hp > 0 && BLD[b.kind].drop && BLD[b.kind].drop.includes(job));
		const R = forage(u, n, drops);
		if (R > bR) {
			bR = R;
			best = n;
		}
	}
	if (job === 'food' && u.owner !== 0) {
		// a computer's forager takes game on its own; yours hunts only when you send it (Build 61, Albert), or when an animal attacks
		const k = keepOf(u.owner);
		for (const a of G.units)
			if (a.owner === WILD && a.hp > 0 && UNIT[a.kind].meat && UNIT[a.kind].tick === 'wild' && k && dist(a, k) < 420 && !unsafe(a, u.owner)) {
				const R = forage(u, { hunt: a }, drops);
				if (R > bR) {
					bR = R;
					best = { hunt: a };
				}
			}
	}
	return best && { n: best, R: bR };
}
const nearestNode = (u, job) => (bestNode(u, job) || { n: null }).n; // the one find a worker should take now
// who to send: an idle villager first, the nearest; then, of the workers on the same resource (types), the one earning least; then the one
// earning least on any gathering job. Weavers, brewers, shepherds and builders keep their posts. (Albert, Oct 29: a new field takes the
// berry picker farthest from home, not a woodcutter)
function pickVil(o, to, types, site) {
	const V = unitsOf(o, 'vil').filter((u) => !u.inside && !(site && u.rep === site)),
		idle = V.filter(freeVil);
	if (idle.length) return nearest(idle, to);
	const T = types ? [].concat(types) : null,
		free = V.filter((u) => u.job && u.job !== 'repair' && !GOODK.includes(u.job) && !(u.node && u.node.farm && (BLD[u.node.farm.kind].makes || BLD[u.node.farm.kind].sheep))),
		same = T ? free.filter((u) => T.includes(u.job)) : [],
		pool = same.length ? same : free;
	if (!pool.length) return null; // nobody is pulled off a site or a post: with all hands busy, the order waits
	let best = null,
		bR = Infinity;
	for (const u of pool) {
		const R = forageNow(u);
		if (R < bR) {
			bR = R;
			best = u;
		}
	}
	return best;
}
// the resource a building serves: a field its crop, a drop-off what it takes in
const typesOf = (kind) => {
	const B = BLD[kind];
	return B.crop && !B.makes && !B.sheep ? [B.crop] : B.drop && B.drop.length && B.drop.length < 4 ? B.drop : null;
};
