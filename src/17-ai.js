// ═════ 17-ai.js: the computers' minds ═════
// ───────────────────────── The computer brain: one brain, three personalities, the same rules as you ─────────────────────────
// The computers have no fog: they see the whole map, so their estimates are the real numbers. Yours come from what you see and what your
// spies report (knownPower, 27). An assumption of the game, said in the Guide (Build 60).
const powerFrom = (sol, towers) => powerOf(sol) + towers * 120 + 250; // a side's strength: its soldiers, its towers, its people
const estPower = (o, of) => powerFrom(soldiersOf(of), bldsOf(of, 'tower').length);
const nearestType = (type, from, kind) =>
	nearest(G.nodes, from, (n) => n.type === type && n.amt > 0 && n.kind !== 'farm' && (!kind || n.kind === kind));
// the soldier that best answers what the enemies field, among those this side can train now
function bestCounter(o) {
	const foes = G.sol.filter((v) => atWar(o, v.owner) && v.owner !== WILD),
		p = G.P[o];
	const can = SOLDIERK.filter(
		(k) =>
			!UNIT[k].civ &&
			!UNIT[k].bonly &&
			UNIT[k].tick === 'sol' &&
			!hasTag(k, 'siege') &&
			UNIT[civKind(o, k)].age <= p.age &&
			ready(o, UNIT[k].at).length,
	);
	if (!can.length) return null;
	if (!foes.length) return can[p.ai.cyc++ % can.length];
	const sc = can.map((k) => {
		const me = { owner: o, kind: civKind(o, k) };
		let s = 0;
		for (const v of foes) s += vsMul(me, v) / Math.max(0.5, vsMul(v, me));
		return [k, s / foes.length / (sumCost(UNIT[k].cost) / 100) ** 0.3];
	});
	sc.sort((a, b) => b[1] - a[1]);
	return sc[p.ai.cyc++ % Math.min(2, sc.length)][0]; // the best, mixed with the next best so an army is never one kind
}
// ───────────────────────── By need (answer 10, D-068; D4; W6; N7; the shift to plots): one plan, read by every choice of work
// T_left, the seconds to the bell. A conquest has no bell: its horizon is open, so there only the rate tests bind
const timeLeft = () => (MODES[G.mode].secs ? Math.max(0, MODES[G.mode].secs - G.t) : Infinity);
// what one more worker earns on r from home: the forager's rate R at the best free find it can walk to, walk and crowd counted (decision 1);
// wild: natural finds only, no plot
function rateFrom(o, r, k, wild) {
	const b = bestNode({ x: k.x, y: k.y, owner: o, node: null, carry: 0, wild }, r, undefined, regionAt(k, o));
	return b ? b.R : 0;
}
// the goal: the first the personality wants of the next age, a building, an army (PERS.goals); its cost is what the hands work toward.
// The next age is a goal from the start; once the town is big enough to save for it (ageReady, below), it is the goal for every personality
function goalOf(p, per, A, saving) {
	const o = p.id,
		armyN = soldiersOf(o).length + queuedOf(o) - queuedOf(o, 'vil');
	if (saving) return { what: 'age', cost: A.cost }; // once the town saves for the age, every personality works toward it
	for (const g of per.goals) {
		if (g === 'age' && A && !p.aging) return { what: 'age', cost: A.cost };
		if (g === 'army' && armyN < armyAim(p)) {
			const want = civKind(o, p.ai.want || 'spear'),
				at = UNIT[want].at;
			if (!bldsOf(o, at).length) return { what: at, cost: BLD[at].cost }; // an army starts with the place that trains it
			return { what: 'army', cost: scaled(unitCost(o, want), Math.min(per.waveMin, armyAim(p) - armyN)) }; // the next wave
		}
		if (g === 'build') {
			const b = per.build.find(([kind, age, n, army]) => p.age >= age && bldsOf(o, kind).length < n && armyN >= army);
			if (b) return { what: b[0], cost: BLD[b[0]].cost };
		}
	}
	return null;
}
// For each resource: the hands on it (n), what one earns there now (rho, a second), the income (less its steady draw: what the store
// feeds, and a growing town's villagers), the
// shortfall against the goal and the time to afford it (shortfall ÷ income, Albert's rule)
function needOf(p, vils, cost, k, draw = {}) {
	const o = p.id,
		plan = {};
	for (const r of RES) {
		const key = KEY[r];
		let n = 0,
			sum = 0,
			m = 0;
		for (const v of vils)
			if (v.job === r) {
				n++;
				const x = forageNow(v);
				if (x > 0) {
					sum += x;
					m++;
				}
			}
		const rho = m ? sum / m : rateFrom(o, r, k),
			inc = n * rho - (draw[r] || 0),
			short = Math.max(0, (cost[key] || 0) - (p.res[key] || 0));
		plan[r] = { n, rho, inc, short, t: short ? (inc > 0 ? short / inc : Infinity) : 0 };
	}
	return plan;
}
// The reorder point (W6, the famine runway; and any resource a worker would leave): runway = (store − what the goal holds of it) ÷
// (demand − gathered). Under the lead time to rebuild the income (the hands it takes, moved one a beat, plus the first load at the find,
// c ÷ rho), or under the time until the goal is afforded, the store runs out first (reorder point = demand over the lead time). For food
// the demand is what the store feeds
function runsOut(p, r, P, n, demand, hold = 0, until = 0) {
	const gap = demand - n * P.rho;
	if (gap <= 0) return false;
	const hands = P.rho > 0 ? Math.ceil(gap / P.rho) : Infinity,
		lead = hands * react() + carryOf(p.id) / Math.max(1e-6, P.rho);
	return ((p.res[KEY[r]] || 0) - hold) / gap < Math.max(lead, until);
}
const famineNear = (p, plan) => runsOut(p, 'food', plan.food, plan.food.n, (p.eats || 0) / 60);
// The shift to plots (Albert, answer 10): a field, a tree farm, a quarry, the Mint or a foundry is built, or a free one staffed, when its rate
// beats the best natural find's (the forager's rate, walk counted: the marginal value test) and the gain pays its cost in the time left, or
// in the plot's own life if shorter (payback: (R_plot − R_wild) × T > cost)
const PLOTS = { farm: 'food', treefarm: 'wood', quarry: 'stone', mint: 'gold', foundry: 'iron' },
	PLOT_AT = [60, 170]; // a plot goes 60 to 170 from the Town Center; judged at the middle of that band
function plotPays(o, kind, k) {
	const B = BLD[kind],
		r = B.crop,
		mk = B.makes && B.makes[r],
		n = { kind: 'farm', type: r, rate: mk ? mk.rate : B.rate, x: k.x, y: k.y + (PLOT_AT[0] + PLOT_AT[1]) / 2, amt: Infinity, farm: { kind, owner: o } },
		plot = forage({ x: n.x, y: n.y, owner: o, node: n, carry: 0 }, n),
		wild = rateFrom(o, r, k, true),
		T = Math.min(timeLeft(), B.reserve ? B.reserve / Math.max(1e-6, plot) : Infinity);
	return plot > wild && (plot - wild) * T > sumCost(B.cost);
}
// the army a side keeps: its ceiling, and at peace with every court the share it keeps when it stands down (N8: it retrained them at once)
const peaceAll = (o) =>
	!G.P.some((q) => q.alive && q.id !== WILD && q.id !== o && (atWar(o, q.id) || noticeLeft(o, q.id) || noticeLeft(q.id, o)));
const armyAim = (p) => Math.ceil(armyCap(p) * (peaceAll(p.id) ? PEACE.stand.keep : 1));
// the first step a wanted research waits on (D2: the lists name what they want; the steps before it are found, not typed)
function firstNeed(o, id) {
	const p = G.P[o],
		T = TECHBY[id];
	if (!T || p.techs.has(id) || (T.civ && T.civ !== p.civ)) return null;
	for (const n of needsOf(T)) if (!p.techs.has(n)) return firstNeed(o, n);
	return id;
}
function think(p) {
	const o = p.id,
		per = PERS[p.pers],
		k = keepOf(o);
	if (!k) return;
	const R = p.res,
		vils = unitsOf(o, 'vil'),
		building = (kind) => bldsOf(o, kind).some((b) => b.prog < 1);
	const has = (kind) => bldsOf(o, kind).length,
		armyN = soldiersOf(o).length,
		jobsN = (j) => vils.filter((v) => v.job === j).length;
	const put = (kind, x, y, r0, r1) => {
		const s = findSpot(o, kind, x, y, r0, r1);
		return s ? build(o, kind, s.x, s.y) : null;
	};
	// a site nobody is working (its builder died or was scared off) gets the nearest free villager
	if (G.t - (p.ai.siteT ?? -99) >= 3) {
		p.ai.siteT = G.t; // every few seconds; it was tick % 90, which a think that runs on its own timer hit only by luck (Build 42)
		for (const b of G.blds)
			if (b.owner === o && b.hp > 0 && b.prog < 1 && !vils.some((v) => v.rep === b && v.job === 'repair'))
				autoBuilder(o, b);
	}
	// shelter before it is needed; a house it cannot yet afford is due, and the hands work toward it (by need, below)
	const due = {};
	if (
		!building('house') &&
		!building('apartment') &&
		popOf(o) + queuedOf(o) >= capOf(o) - 2 &&
		capOf(o) < POPMAX &&
		!put(p.age >= 2 && R.s >= 60 && R.w >= 120 ? 'apartment' : 'house', k.x, k.y, 60, 190) &&
		!afford(p, BLD.house.cost)
	)
		addRes(due, BLD.house.cost);
	// drop-offs where the work is
	for (const [type, kind] of [
		['food', 'mill'],
		['wood', 'lumber'],
		['gold', 'mining'],
		['stone', 'mining'],
		['iron', 'mining'],
	]) {
		if (jobsN(type) < 2 || building(kind)) continue;
		const n = nearestType(type, k);
		if (!n) continue;
		const d = dropFor(o, type, n);
		if (d && dist(d, n) < 110) continue;
		put(kind, n.x, n.y, 30, 70);
	}
	// plots (the shift to plots): one at a time, no more than the hands on its resource, while the plot beats the wild and pays its cost back;
	// one it wants and cannot yet afford is due, as a house is
	for (const [kind, r] of Object.entries(PLOTS))
		if (p.age >= BLD[kind].age && !building(kind) && has(kind) * slotsOf() < jobsN(r) && plotPays(o, kind, k)) {
			if (put(kind, k.x, k.y, PLOT_AT[0], PLOT_AT[1])) break;
			if (!afford(p, BLD[kind].cost)) addRes(due, BLD[kind].cost);
			break;
		}
	if (has('farm') >= 3 && !has('mill')) put('mill', k.x, k.y, 90, 170);
	// the ages: once the town is big enough, save for the next one. Every personality climbs every age it can reach (Build 59: Raiders stopped at
	// Classical and the Fortress at Medieval by a number in PERS, so neither could reach the peace age; a personality is how a side plays, not where it stops).
	// A save once begun holds until the age is bought or out of reach (D5: it was dropped whenever a death took the town under the mark, 3 to 14 times a game)
	const nx = nextAge(o),
		ageReady =
			!!nx &&
			!p.aging &&
			((p.ai.save && p.ai.save.age === p.age + 1) || (vils.length >= 12 + p.age * 4 && armyN >= per.ageArmy));
	if (ageReady) ageUp(o);
	// saving holds while it works: other spending waits as long as the store is still filling toward the age; only when it has not grown for
	// SAVE.stall seconds (a resource out of reach) does the side spend freely for SAVE.spend seconds. Until Build 59 the window opened every 150 s
	// whatever happened, and a minute of spending emptied what 90 s had saved, so a side could "save" for twenty minutes and never arrive.
	const A = ageReady && !p.aging ? nx : null,
		have = A ? Object.entries(A.cost).reduce((s, [r, c]) => s + Math.min(R[r] || 0, c), 0) / sumCost(A.cost) : 0;
	if (!A) p.ai.save = null;
	else {
		const S = p.ai.save || (p.ai.save = { age: p.age + 1, best: have, at: G.t, until: 0 });
		if (have > S.best + SAVE.step) {
			S.best = have;
			S.at = G.t;
		}
		if (G.t >= S.until && G.t - S.at > SAVE.stall) {
			S.until = G.t + SAVE.spend;
			S.at = S.until;
			S.best = 0;
		}
	}
	const threat = G.threats.some((v) => atWar(o, v.owner) && v.owner !== WILD && dist(v, k) < 400);
	const saving = !!A && !threat && !(p.ai.save && G.t < p.ai.save.until),
		need = saving ? A.cost : {};
	p.ai.saving = saving ? 1 : threat && A ? 2 : 0; // for the harness: 1 saving, 2 not saving because of a threat at home
	if (saving && (need.f || 0) > R.f && ready(o, 'market').length) {
		// saving for an age and short of food: sell a surplus for gold, then buy food with the gold above the age cost (Build 42)
		for (const r of ['w', 's', 'i'])
			if (R[r] > (need[r] || 0) + 600) {
				marketTrade(o, r, 'sell');
				break;
			}
		if (R.g > (need.g || 0) + 150) marketTrade(o, 'f', 'buy');
	}
	// villagers: housing is the only ceiling, as for every side (N7). The town grows while one more villager pays its cost in the time left:
	// ΔR × T_left > c, ΔR the rate at the best free find from home (the payback test on Charnov's marginal value). Growing is a steady draw:
	// one villager's cost and its share of a house over its training time, the Town Center kept busy (by need, below)
	const grow =
			clsCount(o, 'civ') < clsMax('civ', o) &&
			Math.max(...RES.map((r) => rateFrom(o, r, k))) * timeLeft() > sumCost(unitCost(o, 'vil')),
		draw = { food: (p.eats || 0) / 60 };
	if (grow) {
		if (k.q.length < 2 && (!saving || R.f >= (need.f || 0) + 50)) train(o, 'vil');
		const each = addRes(addRes({}, unitCost(o, 'vil')), BLD.house.cost, 1 / Math.max(1, roomOf(o, 'house'))); // a villager and its share of a house
		for (const [key, c] of Object.entries(each)) {
			const r = RES.find((x) => KEY[x] === key);
			draw[r] = (draw[r] || 0) + c / (UNIT.vil.t * stats(o, 'vil').train);
		}
	}
	if (!saving && !unitsOf(o, 'scout').length && G.t > 60 && R.f > 200 && !queuedOf(o, 'scout')) train(o, 'scout'); // a lost scout is not replaced while saving for an age (Build 59: up to 13 a game were, 80 food each)
	// what to build, in this personality's order
	for (const [kind, age, n, army, stock] of per.build)
		if (
			p.age >= age &&
			has(kind) < n &&
			armyN >= army &&
			(!stock || afford(p, stock)) &&
			(!saving || kind === 'barracks')
		) {
			if (put(kind, k.x, k.y, 90, 210)) break;
		}
	if (per.extraBarracks && ready(o, 'barracks').length && has('barracks') < 1 + per.extraBarracks && R.w > 250)
		put('barracks', k.x, k.y, 90, 220);
	// a second place to train when the lines are long (one population, Build 63: no army room to fill), the kind it has fewest of
	const lines = G.blds.filter((b) => b.owner === o && b.prog >= 1 && ['barracks', 'range', 'stable'].includes(b.kind)),
		busy = lines.length && lines.every((b) => b.q.length >= 2);
	if (!saving && busy && clsCount(o, 'army') < armyCap(p) && R.w >= 250) {
		const kind = ['barracks', 'range', 'stable']
			.filter((x) => p.age >= BLD[x].age && !building(x) && !atCap(o, x))
			.sort((a, b) => has(a) - has(b))[0];
		if (kind) put(kind, k.x, k.y, 90, 220);
	}
	if (per.towers > has('tower') && p.age >= 1 && R.s >= 120) {
		const t = towardMid(k, 140);
		put('tower', t.x, t.y, 0, 90);
	}
	chaseCrown(p, (kind) => put(kind, k.x, k.y, 90, 210));
	if (per.walls && p.age >= 1 && R.s >= 60) {
		const plan = p.ai.wallPlan || (p.ai.wallPlan = wallPlan(k));
		let nb = 0;
		navOnce(() => {
			for (const c of plan) {
				if (nb >= 3 || p.res.s < 40) break;
				if (NAV.occ[c.gy * NC + c.gx]) continue;
				if (build(o, c.kind, c.gx * NAVC + 5, c.gy * NAVC + 5)) nb++;
			}
		});
	}
	if (
		per.wonder &&
		p.age >= 2 &&
		!has('wonder') &&
		!G.wonder &&
		afford(p, addRes({ f: 300, w: 300, s: 300, g: 300 }, BLD.wonder.cost)) &&
		armyN >= 12
	)
		put('wonder', k.x, k.y, 120, 260);
	// faith and care
	if (ready(o, 'temple').length) {
		if (armyN >= 8 && unitsOf(o, 'priest').length + queuedOf(o, 'priest') < (per.shrine ? 3 : 1)) train(o, 'priest');
		if (!(p.zealT > G.t) && R.g >= 100) {
			const eng = soldiersOf(o).filter((u) => u.tgt && u.tgt.hp > 0 && !(u.zeal > G.t));
			if (eng.length >= 8) zeal(o, eng.slice(0, BNSIZE));
		}
		if (per.shrine && (G.rel[o][WILD] !== 'war' || (G.throne && G.throne.owner === o))) {
			const pr = unitsOf(o, 'priest').find((u) => u.state !== 'shrine');
			const f =
				pr &&
				nearest(
					G.finds,
					k,
					(f) =>
						FINDS[f.kind].capture &&
						f.owner !== o &&
						!G.units.some((v) => v.kind === 'priest' && v.owner === o && v.fid === f.id),
				);
			if (f) {
				pr.state = 'shrine';
				pr.fid = f.id;
			}
		}
	}
	if (ready(o, 'hospital').length && armyN >= 10 && unitsOf(o, 'medic').length + queuedOf(o, 'medic') < 2)
		train(o, 'medic');
	// siege, to break what soldiers cannot
	if (per.siege && ready(o, 'siege').length) {
		const sg =
			soldiersOf(o).filter((u) => hasTag(u.kind, 'siege')).length +
			['ram', 'catapult', 'stower', 'ballista', 'treb', 'bombard'].reduce((n, x) => n + queuedOf(o, x), 0);
		if (sg < per.siege + Math.floor(armyN / 12))
			train(
				o,
				p.age >= 4 && sg % 3 === 2
					? 'bombard'
					: p.age >= 3 && sg % 3 === 2
						? 'treb'
						: ['ram', 'catapult', 'stower', 'ballista'][sg % 4],
			);
	}
	// trade: a couple of caravans once there is somewhere to take them (an ally, or goods for the stops); swap a big surplus for gold
	if (per.trade && p.age >= 1 && armyN >= 6) {
		const m = ready(o, 'market')[0];
		if (!saving && m && unitsOf(o, 'caravan').length + queuedOf(o, 'caravan') < 3 && R.w >= 150 && R.g >= 100)
			train(o, 'caravan'); // nor a lost caravan (Build 59: 20 in fifteen minutes, raided as fast as they were made)
		if (ready(o, 'market').length)
			for (const r of ['f', 'w', 's', 'i'])
				if (R[r] > 1200 && R.g < 150) {
					marketTrade(o, r, 'sell');
					break;
				}
	}
	aiEconomy(p, k, R, put, has, saving);
	if (
		per.spy &&
		ready(o, 'courthouse').length &&
		unitsOf(o, 'spy').length + queuedOf(o, 'spy') < 1 &&
		R.g >= 150 &&
		R.f >= 60
	)
		train(o, 'spy');
	if (!saving) {
		let did = false;
		for (const id of p.civ ? [...per.techs, 'elite_' + p.civ] : per.techs)
			if (research(o, firstNeed(o, id) || id)) {
				did = true;
				break;
			} // their own elite rank last
		if (!did && (p.ai.n = (p.ai.n || 0) + 1) % 10 === 0)
			for (const t of TECH) if ((!t.civ || t.civ === p.civ) && isNext(o, t) && research(o, t.id)) break;
	} // then whatever line is open: the tree is deep now
	// the army: the counter to what the enemies field; with Muster and gold to spare, eight at once from the War Council
	// the army it keeps (armyAim: at peace with every court, the share it stood down to, N8)
	if (!saving && p.techs.has('muster') && armyN + queuedOf(o) - queuedOf(o, 'vil') + 8 <= armyAim(p)) {
		const want = (p.ai.want = bestCounter(o));
		if (want) muster(o, { [civKind(o, want)]: 8 });
	}
	if (!saving && armyN + queuedOf(o) - queuedOf(o, 'vil') < armyAim(p) && vils.length >= per.early) {
		const want = (p.ai.want = bestCounter(o));
		if (want) train(o, want);
	}
	// jobs, by need (answer 10, D4): the goal plus what the town must buy now (a house when it is due, a plot it wants and cannot afford) is
	// the cost; the bottleneck is the resource with the longest time to afford it (food first when the famine runway is short). A new villager
	// goes there; one worker a beat moves there from a resource the goal does not need whose store does not then run out (the reorder point),
	// or from one whose time stays under the bottleneck's after the move (minimax). With nothing short, the personality's mix as before.
	const goal = goalOf(p, per, nx, saving),
		cost = addRes({ ...(goal ? goal.cost : {}) }, due),
		plan = needOf(p, vils, cost, k, draw),
		famine = famineNear(p, plan),
		order = RES.filter((r) => plan[r].t > 0 || (famine && r === 'food')).sort(
			(a, b) => (famine ? (b === 'food') - (a === 'food') : 0) || plan[b].t - plan[a].t,
		);
	p.ai.goal = goal && goal.what; // for the harness
	p.ai.need = order[0] || null;
	const idle = vils.find((v) => !v.job && !v.inside); // a villager with no job yet (a waiting one is placed by need below)
	if (order.length) {
		const b = order[0],
			tb = famine && b === 'food' ? Infinity : plan[b].t;
		if (idle) idle.job = b;
		else {
			let d = null,
				dv = -Infinity;
			for (const r of RES) {
				const P = plan[r];
				if (r === b || P.n < 1 || (famine && r === 'food')) continue;
				const after = P.short ? (P.inc - P.rho > 0 ? P.short / (P.inc - P.rho) : Infinity) : 0;
				if (P.short ? after >= tb : runsOut(p, r, P, P.n - 1, outOf(p, KEY[r]) / 60, cost[KEY[r]] || 0, isFinite(tb) ? tb : 0))
					continue;
				const v = P.short ? tb - after : Infinity; // a resource the goal does not need gives first
				if (v > dv) {
					dv = v;
					d = r;
				}
			}
			const v = d && vils.find((x) => x.job === d && x.carry < 3 && !atShop(x)); // never a shop worker (Build 60: a Mint or Foundry was emptied each time gold or iron ran over)
			if (v) setJob(v, b);
		}
	} else {
		const mix = { ...per.mix };
		if (p.age === 0) {
			mix.food += mix.stone * 0.5 + mix.gold * 0.3;
			mix.wood += mix.stone * 0.5 + mix.gold * 0.2;
			mix.stone = 0;
			mix.gold *= 0.5;
		}
		if (p.age < 2) {
			mix.wood += mix.iron;
			mix.iron = 0;
		} // iron is wanted from the Classical age
		if (per.wonder && p.age >= 2) for (const r of RES) mix[r] += 0.1;
		const tot = RES.reduce((s, r) => s + mix[r], 0) || 1,
			short = RES.map((r) => [r, (mix[r] / tot) * vils.length - plan[r].n]).sort((a, b) => b[1] - a[1]);
		if (idle) idle.job = short[0][0];
		else if (short[0][1] >= 1) {
			const v = vils.find((x) => x.job === short[short.length - 1][0] && x.carry < 3 && !atShop(x));
			if (v) setJob(v, short[0][0]);
		}
	}
	// a villager waiting with no find in reach (its Zs) goes to the bottleneck's best free find it can walk to, then the next in need (answer 10;
	// it was the best rate of any job, item 6); with nothing short, or no find for anything short, the job whose best free find pays most: the forager's rate R at that find,
	// its walk out counted and the crowd already there (g ÷ (1 + others ÷ room), a hunt too; Charnov 1976). Each one sent counts in the crowd
	// at once, so the next waiter sees it. Yours wait for your word (item 6)
	for (const v of vils)
		if (RES.includes(v.job) && v.idle && !v.node && !v.hunt && !v.inside) {
			const probe = { x: v.x, y: v.y, owner: o, node: null, carry: 0 }, // a fresh order: any find of the job, not only the kind it lost
				cm = regionAt(v, o);
			let best = null;
			for (const r of order) {
				const b = bestNode(probe, r, undefined, cm);
				if (b) {
					best = { ...b, r }; // by need: the first in need that has a find
					break;
				}
			}
			if (!best)
				for (const r of RES) {
					const b = bestNode(probe, r, undefined, cm);
					if (b && (!best || b.R > best.R)) best = { ...b, r };
				}
			if (!best) continue;
			setJob(v, best.r, best.n.hunt ? null : best.n);
			if (best.n.hunt) {
				v.hunt = best.n.hunt;
				crowd(v.hunt, 1);
			} else if (!best.n.farm) crowd(best.n, 1); // setJob counts a field
		}
	// finds: a detachment clears the nearest guarded one when nothing else is going on; it hires vagabonds it walks past
	if (per.loot && armyN >= 10 && !p.wave) lootRun(p);
	throneRun(p, per);
	for (const f of G.finds) if (FINDS[f.kind].hire && !f.done && R.g >= 200) hire(o, f);
	// war: attack only when the odds beat this personality's nerve; a rival's wonder is attacked at once
	if (per.bold < 2) decideWar(p, per);
	if (p.ab === 'B') chokeClaim(p); // the B side of the test holds a gap on the road to its nearest foe (AB)
	for (const u of soldiersOf(o)) if (u.state === 'goto' && u.drill && u.drill.until <= G.t) u.state = 'home'; // a hold that ended: back in the pool (p44)
	if (per.diplo) aiDiplomacy(p, per);
	allyDuty(p);
}
// A computer's relations move by its odds, the way a court's did: losing badly, it asks for peace; at peace with nobody to fight and the odds in its favour, it gives notice
function aiDiplomacy(p, per) {
	const o = p.id,
		D = DF();
	if (p.age < 1 || p.envoyOut || G.t - p.envoyAt < D.envoy) return;
	const lead = G.P.filter((r) => r.alive && r.id !== WILD).sort((a, b) => b.score.total - a.score.total)[0]; // Hard: the courts close ranks against whoever leads
	const warOn = G.P.some((r) => r.alive && r.id !== WILD && r.id !== o && atWar(o, r.id) && !(r.lord === o));
	for (const q of G.P) {
		if (!q.alive || q.id === o || q.id === WILD || q.lord === o || p.lord === q.id) continue;
		if (atWar(o, q.id) && oddsOf(o, q.id) < 0.3 && soldiersOf(o).length < per.waveMin) {
			if (setRel(o, q.id, 'peace')) return;
		}
		if (
			!warOn &&
			G.rel[o][q.id] === 'peace' &&
			!noticeLeft(o, q.id) &&
			oddsOf(o, q.id) > per.bold + 0.15 + D.bold &&
			(per.crown === 'war' || G.truce === null)
		) {
			if (setRel(o, q.id, 'war')) return;
		}
		if (
			p.ally === null &&
			q.ally === null &&
			G.rel[o][q.id] === 'peace' &&
			G.t > D.allyAt &&
			(warOn || (D.gang && lead && lead.id !== o && lead.id !== q.id))
		) {
			if (setRel(o, q.id, 'ally')) return;
		} // at war with someone, or on Hard against the leader: court a friend
	}
	if (
		G.throne &&
		G.throne.owner !== o &&
		G.throne.owner !== WILD &&
		G.rel[o][G.throne.owner] !== 'war' &&
		!noticeLeft(o, G.throne.owner) &&
		G.P[G.throne.owner].lord !== o &&
		p.lord !== G.throne.owner
	)
		setRel(o, G.throne.owner, 'war'); // whoever takes the Throne finds every court against them
}
// an ally defends a friend's town under attack, never at the cost of its own
function allyDuty(p) {
	const o = p.id;
	if (p.ally === null || G.t - p.ai.lastHelp < 30) return;
	const ak = keepOf(p.ally),
		mk = keepOf(o),
		near = (k, side) =>
			k && G.units.some((u) => atWar(side, u.owner) && u.owner !== WILD && isSoldier(u) && dist(u, k) < 320);
	if (ak && mk && !near(mk, o) && near(ak, p.ally)) {
		p.ai.lastHelp = G.t;
		sendHelp(o, ak, p.ally === 0);
	}
}
// the army a side keeps grows with its age
const armyCap = (p) => Math.min(ARMYMAX, PERS[p.pers].armyCap + 10 * p.age);
function lootRun(p) {
	const o = p.id,
		k = keepOf(o),
		out = soldiersOf(o).filter((u) => u.state === 'goto' && u.loot);
	if (out.length) {
		const f = G.finds.find((f) => f.id === out[0].loot);
		if (!f || f.done || (!guardsLeft(f) && G.t - out[0].lootT > 30))
			out.forEach((u) => {
				u.state = 'home';
				u.loot = null;
			});
		return;
	}
	const f = nearest(
		G.finds,
		k,
		(f) =>
			!f.done &&
			(FINDS[f.kind].got || FINDS[f.kind].hire || (FINDS[f.kind].stop && guardsLeft(f) && p.age >= 1)) &&
			dist(f, k) < (FINDS[f.kind].stop ? 1000 : 800),
	);
	if (!f) return;
	const home = soldiersOf(o).filter((u) => u.state === 'home' && !UNIT[u.kind].bonly),
		go = home.slice(0, Math.min(10, Math.ceil(home.length * 0.5)));
	if (go.length < 5) return;
	go.forEach((u) => {
		u.state = 'goto';
		u.px = f.x;
		u.py = f.y;
		u.loot = f.id;
		u.lootT = G.t;
		u.idleT = 0;
	});
}
// the Throne: from the Medieval age a side with siege and a big army marches on the citadel, or walks in as the Natives' ally
function throneRun(p, per) {
	const o = p.id,
		T = G.blds.find((b) => b.kind === 'throne' && b.hp > 0);
	if (!T || p.wave || p.age < 3 || (G.throne && G.throne.owner === o)) return;
	const holder = G.throne ? G.throne.owner : WILD;
	const home = soldiersOf(o).filter((u) => u.state === 'home'),
		sg = home.filter((u) => hasTag(u.kind, 'siege')).length;
	const odds = powerOf(home) / (powerOf(soldiersOf(holder).filter((u) => dist(u, T) < 300)) + 800);
	if (
		home.length < 20 ||
		(holder === WILD && sg < 2 && G.rel[o][WILD] !== 'ally') ||
		odds < 1.2 ||
		(holder !== WILD && !atWar(o, holder))
	)
		return;
	home.forEach((u) => {
		u.state = 'attack';
		u.target = holder;
		u.bid = T.id;
	});
	p.wave = newWave(home.length, holder, T.id);
	news('war', `${p.name} march on the Throne.`, 'warn', TOAST.long, T);
}
function wallPlan(k) {
	// an arc WALL_R (06) out from the keep, facing the middle of the map; the two squares nearest the middle are the gate
	const base = Math.atan2(MID - k.y, MID - k.x),
		cells = [],
		seen = new Set();
	let pc = null;
	const add = (gx, gy) => {
		const key = gy * NC + gx;
		if (seen.has(key)) return;
		seen.add(key);
		const a = Math.atan2(gy * NAVC + 5 - k.y, gx * NAVC + 5 - k.x);
		cells.push({ gx, gy, kind: 'wall', da: Math.abs(Math.atan2(Math.sin(a - base), Math.cos(a - base))) });
	};
	for (let i = -66; i <= 66; i++) {
		const a = base + i * 0.019,
			gx = Math.floor((k.x + Math.cos(a) * WALL_R) / NAVC),
			gy = Math.floor((k.y + Math.sin(a) * WALL_R) / NAVC);
		if (pc && gx !== pc.gx && gy !== pc.gy) add(gx, pc.gy); // four-connected: no gap to slip through
		add(gx, gy);
		pc = { gx, gy };
	}
	cells
		.slice()
		.sort((a, b) => a.da - b.da)
		.slice(0, 2)
		.forEach((c) => (c.kind = 'gate'));
	return cells.filter((c) => c.kind === 'gate').concat(cells.filter((c) => c.kind !== 'gate')); // the gate first, so the ring never closes without one
}
// how the two armies' units fare against each other: spearmen against horse, archers against spearmen
function matchup(A, B) {
	const a = A.slice(0, 10),
		b = B.slice(0, 10);
	if (!a.length || !b.length) return 1;
	let x = 0,
		y = 0;
	for (const u of a)
		for (const v of b) {
			x += vsMul(u, v);
			y += vsMul(v, u);
		}
	return clamp(x / y, 0.6, 1.6);
}
// a wave: how many set out, at whom, its mark (a building id or null: the Town Center), its best distance so far and when it last made progress
const newWave = (n, to, bid) => ({ n, t: G.t, to, bid, d: 1e9, pt: G.t });
function decideWar(p, per) {
	const o = p.id,
		home = soldiersOf(o).filter((u) => u.state === 'home' && !UNIT[u.kind].heal),
		out = soldiersOf(o).filter((u) => u.state === 'attack');
	if (p.wave) {
		const w = p.wave,
			goal = (w.bid && G.blds.find((b) => b.id === w.bid && b.hp > 0)) || keepOf(w.to),
			d = goal && out.length ? out.reduce((s, u) => s + dist(u, goal), 0) / out.length : w.d;
		if (out.some((u) => G.t - (u.hitT || -99) < WAVE.fight) || d < w.d - WAVE.step) {
			w.d = Math.min(w.d, d);
			w.pt = G.t;
		} // progress: a blow, or a step nearer
		if (!w.charged && out.some((u) => u.tgt && !u.tgt.q)) {
			w.charged = true;
			charge(o, out);
		} // on contact, once a wave
		const stalled = G.t - w.pt > WAVE.stall;
		if (out.length < w.n * WAVE.broke || stalled) {
			out.forEach((u) => (u.state = 'home'));
			if (stalled && !w.bid) p.ai.cool[w.to] = G.t + WAVE.cool;
			p.wave = null;
		} // beaten, or stalled: go home, and a stalled side waits; a wonder or the Throne (w.bid, a win at stake) never does
		return;
	}
	const W = G.wonder && G.wonder.owner !== o && atWar(o, G.wonder.owner) ? G.wonder : null;
	if (home.length < (W ? 4 : per.waveMin + (G.diff === 'easy' ? 3 : 0))) return;
	const sn = season().name,
		toWinter = sn === 'Autumn' && SEASON_LEN - (G.t % SEASON_LEN) < HARD.waitForWinter;
	if (hz('hard') && toWinter && !W) return; // hard: winter is a month away; they wait for it, as raiders did
	const bold = per.bold + DF().bold + (hz('hard') ? HARD.bold + (sn === 'Winter' ? HARD.winterBold : 0) : 0);
	const go = home.slice(Math.floor(home.length * (W ? 0 : per.guard))),
		mine = powerOf(go);
	let best = null,
		bp = 0;
	for (const q of G.P)
		if (q.alive && q.id !== WILD && atWar(o, q.id)) {
			const threat = (W && W.owner === q.id) || (G.throne && G.throne.owner === q.id); // a win at stake: never waited out
			if (!threat && (p.ai.cool[q.id] || 0) > G.t) continue;
			if (q.id === 0 && G.diff === 'easy' && G.t < EASY_SAFE && !W) continue; // Easy: nobody comes for you in the first six minutes
			const r = (mine / estPower(o, q.id)) * matchup(go, soldiersOf(q.id)),
				prob = lanchester(r); // the square law, as odds, bent by who counters whom
			const busy =
				per.opportunist &&
				G.P.some((x) => x.alive && x.id !== WILD && x.id !== o && x.id !== q.id && atWar(q.id, x.id)); // the opportunist: a side with another war on its hands
			const greed = p.ab === 'B' ? 1 + AB.greed * (storesOf(q.id) / Math.max(1, ...G.P.filter((x) => x.alive && x.id !== WILD && x.id !== o).map((x) => storesOf(x.id)))) : 1; // B: the richest foe draws it
			const pr = (threat ? Math.max(prob, 0.75) : prob * (busy ? per.opportunist * DF().opp : 1)) * greed;
			if (pr > bp) {
				bp = pr;
				best = q.id;
			}
		}
	// a full army that sits at home is wasted: at its limit a side settles for even odds
	const full = soldiersOf(o).length >= armyCap(p) - 2;
	if (best !== null && bp > (full ? Math.min(bold, 0.4) : bold)) {
		const TB = G.throne && G.throne.owner === best && G.blds.find((b) => b.kind === 'throne' && b.hp > 0);
		go.forEach((u) => {
			u.state = 'attack';
			u.target = best;
			u.bid = W && W.owner === best ? W.id : TB ? TB.id : null;
			u.loot = null;
		});
		p.wave = newWave(go.length, best, W && W.owner === best ? W.id : TB ? TB.id : null);
		if (per.raid || p.ab === 'B') {
			// a few riders go for the foe's lumber camps and mines instead of the Town Center: it draws the defence apart (B: more of them, and
			// the drop-off with the most villagers about it, where the loot is)
			const fast = go
					.filter((u) => (UNIT[u.kind].tags || []).includes('mounted'))
					.slice(0, (per.raid || 0) + (hz('hard') ? HARD.raid : 0) + (p.ab === 'B' ? AB.raid : 0)),
				k = keepOf(o);
			const busyAt = (b) => G.units.reduce((n, v) => n + (v.owner === best && v.kind === 'vil' && dist(v, b) < 90 ? 1 : 0), 0);
			const mark =
				k &&
				(p.ab === 'B'
					? G.blds.filter((b) => standing(b, best) && b.kind !== 'keep' && BLD[b.kind].drop).sort((a, b) => busyAt(b) - busyAt(a))[0] || null
					: nearest(G.blds, k, (b) => standing(b, best) && b.kind !== 'keep' && BLD[b.kind].drop));
			if (mark)
				fast.forEach((u) => {
					u.bid = mark.id;
				});
		}
		if (best === 0) news('realm', `${p.name} march on you with ${go.length} soldiers.`, 'warn', TOAST.long, go[0]);
	}
}

// ── Dynamic Diplomacy (the Tension setting): when one side runs far ahead, the computers behind it unite against it, as Greek and Italian
// states did against Athens and Syracuse and the powers of Europe did against Napoleon. They make peace and ally among themselves and make war on the leader;
// the leader's own vassals stay faithful. It ends when the leader falls back. Winner Takes All skips all of this.
const LEAGUE = { lead: 1.4, release: 1.15 }; // the leader's score against the next best: it forms above lead, and breaks up below release
function leagueTick() {
	const S = G.P.filter((p) => p.id !== WILD && p.alive && !(p.lord !== null && p.lord !== undefined && !p.rebel));
	if (S.length < 3) return;
	S.sort((a, b) => b.score.total - a.score.total);
	const lead = S[0],
		ratio = lead.score.total / Math.max(1, S[1].score.total);
	if (G.league === null || G.league === undefined) {
		if (ratio < LEAGUE.lead) return;
		G.league = lead.id;
	} else if (G.league !== lead.id || ratio < LEAGUE.release) {
		G.league = null;
		news('realm', 'The league against the leader breaks up.', '', TOAST.mid);
		return;
	}
	const M = S.slice(1).filter((p) => p.id !== 0 && p.lord !== lead.id);
	if (!M.length) return;
	const fresh = M.some((p) => G.rel[p.id][lead.id] !== 'war');
	for (const p of M) {
		if (G.rel[p.id][lead.id] !== 'war') declareWar(p.id, lead.id, 'the league against the leader');
		for (const q of M) if (q !== p && G.rel[p.id][q.id] !== 'ally') G.rel[p.id][q.id] = 'ally';
	}
	G.navDirty = true;
	if (fresh) news('realm', `${M.map((p) => p.name).join(', ')} unite against ${lead.name}, the leader.`, 'warn', TOAST.long);
}

// ── The A/B test of the computers (Albert, Nov 3, 11:10: "a b test this"): A plays as shipped, with the handicap (HANDICAP: a free mill and
// farm); B plays without it and with pressure instead: AB.raid more riders on the drop-off where the villagers are, the richest foe weighed
// by AB.greed, and a choke claim: with AB.foot foot soldiers idle at home it holds the narrowest gap on the road to its nearest foe (the
// drawn choke of preview 37, dress 'choke'), AB.hold seconds at a time, every AB.every. tests/ab.py seats A and B by the seed and reports.
const AB = { raid: 2, greed: 0.3, foot: 6, hold: 180, every: 240, gapMin: 2, gapMax: 10, step: 40 };
const storesOf = (o) => Object.values(G.P[o].res).reduce((a, b) => a + b, 0);
// the narrowest gap on the road: the point on the straight line to the foe where the open run across it is shortest (in squares)
function gapOnRoad(o, q) {
	const k = keepOf(o),
		f = keepOf(q);
	if (!k || !f) return null;
	const d = dist(k, f),
		ux = (f.x - k.x) / d,
		uy = (f.y - k.y) / d;
	let best = null;
	for (let t = 150; t < d / 2; t += AB.step) {
		const x = k.x + ux * t,
			y = k.y + uy * t;
		if (blockedCell(gcell(x, y), o)) continue;
		let w = 1;
		for (const sgn of [1, -1]) for (let i = 1; i <= AB.gapMax; i++) if (!blockedCell(gcell(x - uy * sgn * i * NAVC, y + ux * sgn * i * NAVC), o)) w++; else break;
		if (w >= AB.gapMin && w <= AB.gapMax && (!best || w < best.w)) best = { x, y, w, fx: ux, fy: uy };
	}
	return best;
}
function chokeClaim(p) {
	const o = p.id;
	if ((p.ai.chokeT || 0) > G.t) return;
	p.ai.chokeT = G.t + AB.every;
	const k = keepOf(o),
		foe = k && G.P.filter((q) => q.alive && q.id !== WILD && q.id !== o && atWar(o, q.id) && keepOf(q.id)).sort((a, b) => dist(k, keepOf(a.id)) - dist(k, keepOf(b.id)))[0];
	if (!foe) return;
	const foot = soldiersOf(o).filter((u) => u.state === 'home' && !u.tgt && !UNIT[u.kind].heal && !(UNIT[u.kind].tags || []).includes('mounted') && !(UNIT[u.kind].tags || []).includes('siege'));
	if (foot.length < AB.foot) return;
	const g = gapOnRoad(o, foe.id);
	if (!g) return;
	const S = foot.slice(0, Math.min(foot.length, g.w * 3));
	dress(S, { x: g.x, y: g.y }, { x: g.fx, y: g.fy }, 'choke', AB.hold);
	for (const u of S) u.drill.cols = clamp(g.w, CHOKE.min, CHOKE.max);
	p.ai.chokes = (p.ai.chokes || 0) + 1;
}
