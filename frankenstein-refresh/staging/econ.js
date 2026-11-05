// ═════ 11-orders.js: what a side can do, and why not ═════
// ───────────────────────── Orders anyone can give (the computers use the same ones) ─────────────────────────
// what an order costs this side now: one scaling for units (Informers make spies cheaper) and research (the Encyclopedie, key #research)
const scaled = (cost, m) => {
	if (m === 1) return cost;
	const c = {};
	for (const r in cost) c[r] = Math.round(cost[r] * m);
	return c;
};
const unitCost = (o, k) => scaled(UNIT[k].cost, fxv(o, 'cost', unitKeys(k)).m);
const techCost = (o, T) => scaled(T.cost, fxv(o, 'cost', ['#research']).m);
function trainWhy(o, kind) {
	// why a unit cannot be ordered right now, or null
	const k = civKind(o, kind),
		U = UNIT[k],
		p = G.P[o];
	if (U.age > p.age) return `${plural(U.name)} need the ${AGES[U.age].name} age.`;
	if (!readyAt(o, U).length) return `Build a ${BLD[U.at].name.toLowerCase()} first.`;
	if (U.camp && campWhyTrain(o, U.camp)) return campWhyTrain(o, U.camp);
	if (U.cls && clsCount(o, U.cls) >= clsMax(U.cls, o))
		return U.cls === 'civ' ? `People at the ceiling: ${POPMAX}.` : armyFull(o);
	if (p.hungry) return 'Your people are hungry: put villagers on Food.';
	if (!afford(p, unitCost(o, k))) return `Not enough: ${costText(unitCost(o, k))}.`;
	if (!readyAt(o, U).some((b) => b.q.length < qMax(o))) return `That line is full (${qMax(o)} waiting).`;
	return null;
}
function train(o, kind) {
	if (trainWhy(o, kind)) return false;
	const k = civKind(o, kind),
		U = UNIT[k],
		p = G.P[o],
		at = tentOrNot(o, U, k, shortest(readyAt(o, U)));
	const t = U.t * stats(o, k).train,
		c = tentCost(o, at, unitCost(o, k));
	pay(p, c);
	at.q.push({ kind: k, left: t, total: t, paid: c });
	return true;
}
// a training tent charges CAMP.extra over the price (Field logistics: CAMP.extraLog); one that cannot be paid for gives way to a building that can
const tentCost = (o, at, c) => (at && at.kind === 'traintent' ? Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round(v * (1 + CAMP.extra * fxv(o, 'tentcost').m))])) : c);
const tentOrNot = (o, U, k, at) => (at && at.kind === 'traintent' && !afford(G.P[o], tentCost(o, at, unitCost(o, k))) ? shortest(readyAt(o, U).filter((b) => b.kind !== 'traintent')) || at : at);
// cancel one order in a building's line: what was paid for it comes back in full, the way it went out (every order keeps what it paid)
const whyOf = (j) => (j.tech || j.age ? 'research' : 'units');
// what an order gives back when it goes: the purse, the ledger and the research spent, one home for a cancel and for an order an old save cannot keep
function refund(p, j) {
	payBack(p, j.paid, whyOf(j));
	if (j.tech || j.age) p.spent -= sumCost(j.paid);
}
function cancelOrder(o, b, i) {
	const j = b.q[i],
		p = G.P[o];
	if (!j || b.owner !== o) return false;
	b.q.splice(i, 1);
	refund(p, j);
	if (j.age) p.aging = false;
	return true;
}
function unTrain(o, kind) {
	// cancel the newest villager waiting in any queue
	for (const b of G.blds)
		if (b.owner === o)
			for (let i = b.q.length - 1; i >= 0; i--) {
				const j = b.q[i];
				if (j.kind === kind || (j.kind && UNIT[j.kind].replaces === kind)) return cancelOrder(o, b, i);
			}
	return false;
}
// Muster: a whole battalion in one order at the War Council: twice the cost and a quarter longer; the time is shared by every building that trains each kind
const musterN = (plan) => Object.values(plan).reduce((n, k) => n + k, 0);
function musterCost(o, plan) {
	const cost = {};
	let t = 0;
	for (const k in plan) {
		const U = UNIT[k],
			n = plan[k];
		const c = unitCost(o, k); // research discounts count (C16)
		for (const r in c) cost[r] = (cost[r] || 0) + c[r] * n * 2;
		t = Math.max(t, (n * U.t * stats(o, k).train) / Math.max(1, readyAt(o, U).length));
	}
	return { cost, t: Math.ceil(t * 1.25) };
}
function musterWhy(o, plan) {
	const p = G.P[o],
		n = musterN(plan);
	if (!p.techs.has('muster')) return 'Needs Muster.';
	if (!n) return 'Nothing missing.';
	if (!lineFree(o, ['council'])) return 'Needs a War Council.';
	for (const k in plan) {
		const U = UNIT[k];
		if (U.age > p.age || !readyAt(o, U).length) return `Needs a ${BLD[U.at].name.toLowerCase()}.`;
	}
	if (clsCount(o, 'army') + n > armyRoom(o)) return armyFull(o);
	if (popOf(o) + n > capOf(o)) return 'Needs room: build homes.';
	if (p.hungry) return 'Your people are hungry.';
	const { cost } = musterCost(o, plan);
	if (!afford(p, cost)) return `Not enough: ${costText(cost)}.`;
	return null;
}
function muster(o, plan, bn) {
	if (musterWhy(o, plan)) return false;
	const { cost, t } = musterCost(o, plan),
		at = shortest(ready(o, 'council'));
	pay(G.P[o], cost, 'units');
	at.q.push({ muster: plan, bn, left: t, total: t, paid: cost });
	return true;
}
function researchWhy(o, id) {
	const T = TECHBY[id],
		p = G.P[o];
	if (p.techs.has(id)) return 'Already known.';
	if (T.civ && T.civ !== p.civ) return 'Belongs to another people.';
	if (T.age > p.age) return `Needs the ${AGES[T.age].name} age.`;
	for (const n of needsOf(T)) if (!p.techs.has(n)) return `Needs ${TECHBY[n].name}.`;
	if (G.blds.some((b) => b.owner === o && b.q.some((j) => j.tech === id))) return 'Being researched.';
	const at = shortest(ready(o, T.at));
	if (!at) return `Needs a ${BLD[T.at].name.toLowerCase()}.`;
	if (at.q.length >= qMax(o)) return 'That line is full.';
	const c = techCost(o, T);
	if (!afford(p, c)) return `Not enough: ${costText(c)}.`;
	return null;
}
function research(o, id) {
	if (researchWhy(o, id)) return false;
	const T = TECHBY[id],
		p = G.P[o],
		at = shortest(ready(o, T.at)),
		tt = T.t * fxv(o, 'research').m,
		c = techCost(o, T);
	pay(p, c, 'research');
	p.spent += sumCost(c);
	at.q.push({ tech: id, left: tt, total: tt, paid: c });
	return true;
}
function ageUp(o) {
	const p = G.P[o],
		A = nextAge(o),
		k = keepOf(o);
	if (!A || p.aging || !k || !afford(p, A.cost) || k.q.length >= qMax(o)) return false;
	pay(p, A.cost, 'research');
	p.spent += sumCost(A.cost);
	k.q.push({ age: p.age + 1, left: A.t, total: A.t, paid: A.cost });
	p.aging = true;
	return true;
}
let navHold = false,
	navLate = false;
// pieces laid in one go rebuild the grid once, after them (B13: forty pieces stalled a frame 131 ms; hunt A #8: the computers' wall plan too)
function navOnce(fn) {
	navHold = true;
	navLate = false;
	try {
		fn();
	} finally {
		navHold = false;
		if (navLate) navRebuild();
	}
}
function build(o, kind, x, y) {
	const B = BLD[kind],
		p = G.P[o];
	if (B.age > p.age || !afford(p, B.cost) || !keepOf(o) || canPlace(o, kind, x, y)) return null;
	const sp = snapPos(kind, x, y);
	if (kind === 'gate') {
		const w = NAV.occ[sp.gy * NC + sp.gx];
		if (w && w.kind === 'wall') {
			w.hp = 0;
			w.gone = true;
		}
	} // a gate takes the place of a wall square
	pay(p, B.cost, 'buildings');
	const b = mkBld(o, kind, x, y, 0);
	G.blds.push(b);
	if (navHold) navLate = true;
	else navRebuild(); // a line laid in one go builds the grid once after it (navOnce)
	qcDrop();
	if (o === 0) learn('build:' + kind);
	if (B.atStop) {
		const f = G.finds.find((f) => f.kind === 'stop' && Math.abs(f.x - b.x) < 24 && Math.abs(f.y - b.y) < 24);
		b.sid = f && f.id;
	}
	if (o === 0) sfx('place');
	autoBuilder(o, b);
	return b;
}
// A site rises only while villagers work it. The nearest free villager goes at once; a line of wall gets two at most, who then work down it.
function autoBuilder(o, b) {
	if (o === 0 && G.buildBy && G.buildBy.length) {
		const V = G.buildBy.map((id) => byId(G.units, id)).filter((u) => u && u.hp > 0 && u.kind === 'vil');
		G.buildBy = null;
		if (V.length) {
			V.forEach((v) => {
				sendBuilder(v, b);
				v.post = null;
			});
			return;
		}
	} // the villagers you picked raise it
	if (
		BLD[b.kind].wallish &&
		G.blds.filter(
			(s) =>
				s.owner === o &&
				s.prog < 1 &&
				BLD[s.kind].wallish &&
				unitsOf(o, 'vil').some((v) => v.rep === s && v.job === 'repair'),
		).length >= 2
	)
		return;
	let v = pickVil(o, b, typesOf(b.kind), null, hand(o));
	if (!v && hand(o)) {
		// nobody idle (Albert, Nov 2, 08:05, D-091): the nearest villager raises it, a posted one too, then goes back to exactly what it was doing
		v = nearest(
			unitsOf(o, 'vil').filter((u) => !u.inside && u.job !== 'repair' && !u.focus),
			b,
		);
		if (v) v.back = true;
	}
	if (v) sendBuilder(v, b);
	else if (hand(o)) say(NO_HANDS, 'warn', TOAST.short);
}
// a builder remembers what it left (its job, its find or building, where it was placed), so backToWork takes it back to that
function sendBuilder(v, b) {
	if (v.job !== 'repair') {
		v.pj = v.job;
		v.pn = v.node ? v.node.id : null;
		v.pa = v.anchor;
	}
	setJob(v, 'repair');
	v.rep = b;
	v.building = true;
}
// Send one more to a site
function sendBuild(o, id) {
	const b = G.blds.find((x) => x.id === id && x.owner === o && x.hp > 0 && x.prog < 1);
	if (!b) return false;
	const v = pickVil(o, b, typesOf(b.kind), b, hand(o));
	if (!v) {
		if (o === 0) say(NO_HANDS, 'warn', TOAST.short);
		return false;
	}
	sendBuilder(v, b);
	if (o === 0) say(`A villager goes to raise the ${bldName(o, b.kind).toLowerCase()}.`, '', TOAST.short);
	return true;
}
// Replant a plot that is cut out or worked out (Build 61, Albert): half its cost, and it is full again; a coppice regrows from its stumps
function replantWhy(o, b) {
	const B = BLD[b.kind];
	if (!b.node || !B.reserve) return 'Nothing to replant.';
	if (b.node.amt > 0) return 'Still growing.';
	if (!afford(G.P[o], scaled(B.cost, 0.5))) return `Not enough: ${costText(scaled(B.cost, 0.5))}.`;
	return null;
}
function replant(o, id) {
	const b = G.blds.find((x) => x.id === id && x.owner === o && x.hp > 0);
	if (!b || replantWhy(o, b)) return false;
	pay(G.P[o], scaled(BLD[b.kind].cost, 0.5), 'buildings');
	b.node.amt = b.node.max = BLD[b.kind].reserve;
	G.treeV = (G.treeV || 0) + 1;
	if (o === 0) say(`${bldName(0, b.kind)} replanted.`, 'good', TOAST.short);
	return true;
}
// Replant all (Albert, Nov 4): from a drop-off, every cut-out plot of what it takes, as many as can be paid for, nearest first
const cutOut = (o, types) =>
	G.blds.filter((b) => b.owner === o && b.hp > 0 && b.node && BLD[b.kind].reserve && b.node.amt <= 0 && types.includes(b.node.type));
function replantAll(o, at) {
	let n = 0;
	for (const b of cutOut(o, BLD[at.kind].drop || []).sort((a, c) => dist(a, at) - dist(c, at)))
		if (!replantWhy(o, b)) {
			pay(G.P[o], scaled(BLD[b.kind].cost, 0.5), 'buildings');
			b.node.amt = b.node.max = BLD[b.kind].reserve;
			n++;
		}
	if (n) G.treeV = (G.treeV || 0) + 1;
	if (o === 0) say(n ? `${n} replanted.` : 'Not enough to replant.', n ? 'good' : '', TOAST.short);
	return n;
}
// Take a building down: half its cost back (all of it in the first 15% of the build); every order waiting inside is cancelled, so what
// was paid for it comes back in full (a muster's too: before, a muster in the line was lost). Never the Town Center.
function shellBack(b) {
	const back = {};
	addRes(back, BLD[b.kind].cost, b.prog < 0.15 ? 1 : 0.5);
	for (const k in back) back[k] = Math.floor(back[k]);
	return back;
}
function refundOf(b) {
	const back = shellBack(b);
	for (const j of b.q) addRes(back, j.paid);
	return back;
}
function demolish(o, id) {
	const b = G.blds.find((x) => x.id === id && x.owner === o && x.hp > 0);
	if (!b || b.kind === 'keep') return false;
	const p = G.P[o],
		back = refundOf(b),
		full = b.prog < 0.15;
	while (b.q.length) cancelOrder(o, b, b.q.length - 1);
	payBack(p, shellBack(b), 'buildings');
	b.by = undefined;
	b.hp = 0;
	b.q = [];
	b.gone = true;
	G.navDirty = true;
	if (BLD[b.kind].fx) fxDirty();
	if (o === 0) say(`${bldName(o, b.kind)} ${full ? 'cancelled' : 'taken down'}: ${costText(back)} back.`, '', TOAST.mid);
	return true;
}

// ───────────────────────── Diplomacy: one table of relations, one way to change them ─────────────────────────
// Relations are ally, peace (neutral) or war (hostile), the same for every side. Hostile is declared with NOTICE seconds' warning (Rome's fetial
// priests declared war before a campaign; no ambush from peace). Neutral is granted at once by an ally, or asked of an enemy by an envoy.
// Ally needs the other side's yes, carried by an envoy. The computers answer by their odds, and change their own minds the same way.
function declareWar(a, b, why) {
	if (a === b || a === WILD || b === WILD || G.rel[a][b] === 'war') return;
	const wasAlly = G.rel[a][b] === 'ally';
	G.rel[a][b] = G.rel[b][a] = 'war';
	G.navDirty = true;
	delete G.warAt[a + ',' + b];
	delete G.warAt[b + ',' + a];
	if (G.P[a].ally === b) G.P[a].ally = null;
	if (G.P[b].ally === a) G.P[b].ally = null;
	if (a === 0 || b === 0)
		news('realm', `${G.P[a === 0 ? b : a].name}: ${wasAlly ? 'the alliance is broken; ' : ''}war, ${why}.`, 'warn', TOAST.mid);
	else news('chronicle', `${G.P[a].name} and ${G.P[b].name} are now at war.`, '', TOAST.mid, keepOf(a)); // news between other courts comes by the post
	chron(`${a === 0 ? 'You' : G.P[a].name} and ${b === 0 ? 'you' : G.P[b].name}: war, ${why}.`);
}
function makePeace(a, b) {
	if (G.rel[a][b] === 'war')
		chron(`Peace between ${a === 0 ? 'you' : G.P[a].name} and ${b === 0 ? 'you' : G.P[b].name}.`);
	G.rel[a][b] = G.rel[b][a] = 'peace';
	G.navDirty = true;
	if (G.P[a].ally === b) G.P[a].ally = null;
	if (G.P[b].ally === a) G.P[b].ally = null;
	for (const u of G.units)
		if (
			(u.owner === a && u.state === 'attack' && u.target === b) ||
			(u.owner === b && u.state === 'attack' && u.target === a)
		)
			u.state = 'home';
}
function makeAlly(a, b) {
	G.rel[a][b] = G.rel[b][a] = 'ally';
	G.P[a].ally = b;
	G.P[b].ally = a;
	G.navDirty = true;
	if (b !== 0 && a !== 0) news('realm', `${G.P[a].name} allied with ${G.P[b].name}.`, 'warn', TOAST.mid, keepOf(a));
	chron(`${a === 0 ? 'You' : G.P[a].name} allied with ${b === 0 ? 'you' : G.P[b].name}.`);
}
const noticeLeft = (a, b) => {
	const t = G.warAt[a + ',' + b];
	return t === undefined ? 0 : Math.max(0, Math.ceil(t - G.t));
};
// why a side cannot take this stance toward another right now, or null
// a misfit group (GANG) on a Relations row, by its key; the Natives are also the fifth side (WILD)
const gangKey = (q) => (q === WILD ? 'nat' : typeof q === 'string' && GANG[q] ? q : null);
function relWhy(o, q, want) {
	const g = gangKey(q);
	const p = G.P[o];
	if (g) {
		// a misfit group, the Natives' flow for each (Albert, Nov 1): peace by regard; a friend at REGARD.allyAt, by an emissary; war is yours
		const rel = gangRel(o, g);
		if (want === rel) return 'Already.';
		if (want === 'war') return null;
		if (regardOf(o, g) < REGARD[want === 'peace' ? 'peaceAt' : 'allyAt']) return `Needs regard ${REGARD[want === 'peace' ? 'peaceAt' : 'allyAt']}.`;
		return want === 'peace' ? null : envoyWhy(p, rel);
	}
	const Q = G.P[q],
		rel = G.rel[o][q];
	if (q === o || !Q.alive) return 'Not now.';
	if (Q.lord === o && !Q.rebel) return 'Your vassal: see their card.';
	if (p.lord === q && !p.rebel) return 'Your overlord.';
	if (want === rel) return 'Already.';
	if (want === 'war' && G.sworn > G.t) return `A sworn peace holds ${clock(G.sworn - G.t)} more.`; // a scenario's term of peace (the Olympic truce was sworn for the festival)
	if (want === 'war') return noticeLeft(o, q) ? `Notice given: ${noticeLeft(o, q)} s.` : null;
	return envoyWhy(p, rel, want);
}
// what stops an emissary going: one for courts and groups alike
function envoyWhy(p, rel, want = 'ally') {
	if (want === 'ally' && rel === 'war') return 'Make peace first.';
	if (p.envoyOut) return 'Your emissary is out.';
	if (p.age < 1) return 'Needs the Bronze age.';
	if (!afford(p, UNIT.envoy.cost)) return `Not enough: ${costText(UNIT.envoy.cost)}.`;
	return null;
}
function setRel(o, q, want) {
	if (relWhy(o, q, want)) return false;
	const g = gangKey(q),
		rel = G.rel[o][q];
	if (g && want === 'war') {
		if (g === 'nat') makePeace(o, WILD);
		gangSet(o, g, 'war');
		gangState(g).warBy[o] = true;
		addRegard(o, g, -REGARD.warCost);
		return true;
	} // turning on a group costs regard, and needs no notice: they are not a court; it holds until you make peace
	if (g && want === 'peace') {
		gangState(g).warBy[o] = false;
		if (g === 'nat') makePeace(o, WILD);
		else gangSet(o, g, 'peace');
		return true;
	}
	if (want === 'war') {
		if (rel === 'ally') makePeace(o, q);
		G.warAt[o + ',' + q] = G.t + NOTICE;
		if (o === 0 || q === 0)
			news('realm', `${G.P[o === 0 ? q : o].name}: ${REL_WORD.war.toLowerCase()} in ${NOTICE} s${o === 0 ? ' (notice given)' : ''}.`, 'warn', TOAST.mid);
		return true;
	}
	delete G.warAt[o + ',' + q]; // a side that was giving notice has thought again
	if (want === 'peace' && rel === 'ally') {
		makePeace(o, q);
		if (q === 0) news('realm', `${G.P[o].name} ended the alliance.`, 'warn', TOAST.mid);
		return true;
	}
	return sendEnvoy(o, q, want); // peace from war, or an alliance: carried over, answered there
}
function noticeTick() {
	for (const k in G.warAt)
		if (G.t >= G.warAt[k]) {
			const [a, b] = k.split(',').map(Number);
			declareWar(a, b, 'the notice ran out');
		}
}
function sendEnvoy(o, to, ask) {
	const p = G.P[o],
		k = keepOf(o),
		tk = homeOf(to, k);
	if (!k || !tk || p.envoyOut || p.age < 1 || !afford(p, UNIT.envoy.cost)) return false;
	pay(p, UNIT.envoy.cost);
	const u = addUnit(o, 'envoy', k.x, k.y);
	u.state = 'envoy';
	u.target = to;
	u.ask = ask || 'ally';
	p.envoyOut = true;
	p.envoyAt = G.t;
	if (o === 0) say(`Your emissary rides to the ${GANG[gangKey(to)] || G.P[to].name}: ${ask === 'peace' ? 'peace' : 'alliance'}.`, '', TOAST.mid);
	return true;
}
// the square law on strength, bent by who counters whom: the odds q gives itself against o
const oddsOf = (q, o) => {
	const S = soldiersOf(q),
		r = (powerOf(S) / estPower(q, o)) * matchup(S, soldiersOf(o));
	return lanchester(r);
};
function judgeEnvoy(to, from, envoy) {
	const g = gangKey(to),
		ask = envoy.ask || 'ally';
	if ((g ? gangRel(from, g) : G.rel[to][from]) === 'war' && ask !== 'peace') {
		envoy.hp = 0;
		if (from === 0) news('realm', `The ${g ? GANG[g] : G.P[to].name} killed your emissary.`, 'warn', TOAST.mid);
		return;
	}
	if (g) return judgeGang(g, from, envoy, ask);
	const T = G.P[to];
	if (to === 0) {
		envoy.state = 'return';
		news('realm', `${G.P[from].name} offer ${ask === 'peace' ? 'peace' : 'an alliance'}: answer at your Town Center.`, 'soft', TOAST.long);
		return;
	} // the player answers for themselves, on the Relations side
	const busy = G.P.some((q) => q.alive && q.id !== WILD && q.id !== from && atWar(to, q.id)); // another war on their hands
	if (ask === 'peace') {
		if (G.rel[to][from] !== 'war') {
			reply(from, envoy, `The ${T.name} are already at peace with you.`);
			return;
		}
		if (oddsOf(to, from) > 0.6 + fxv(from, 'diplo').a && !busy && !T.rebel) {
			// a truce has a price: tribute, as the Danegeld of 991 bought off the Danes
			const price = Math.round((PEACE.truce.gold * (1 + PEACE.truce.odds * oddsOf(to, from))) / 10) * 10;
			if (G.P[from].res.g < price) {
				reply(from, envoy, `The ${T.name} want more of this war, or ${price} gold.`);
				return;
			}
			spend(G.P[from], 'g', price, 'tribute');
			earn(T, 'g', price, 'tribute');
			makePeace(to, from);
			reply(from, envoy, `The ${T.name} accept peace for ${price} gold.`);
			return;
		}
		makePeace(to, from);
		reply(from, envoy, `The ${T.name} accept peace.`);
		return;
	}
	if (T.ally !== null && T.ally !== from) {
		reply(from, envoy, `The ${T.name} are already allied with ${G.P[T.ally].name}.`);
		return;
	}
	if (T.ally === from) {
		reply(from, envoy, `The ${T.name} are already your ally.`);
		return;
	}
	if (oddsOf(from, to) < 0.3) {
		reply(from, envoy, `The ${T.name} see no strength in you worth an alliance.`);
		return;
	}
	if (!busy && oddsOf(to, from) > 0.7 + fxv(from, 'diplo').a) {
		reply(from, envoy, `The ${T.name} need no ally today.`);
		return;
	}
	makeAlly(to, from);
	reply(from, envoy, `The ${T.name} accept. You are allies.`);
}
function reply(from, envoy, text) {
	envoy.state = 'return';
	if (from === 0) news('realm', text, text.includes('accept') ? 'good' : '', TOAST.long);
}
// an ally sends half of what stands at home to a friend's town under attack (every computer does this for its ally, the Fortress included)
function sendHelp(f, pt, tell) {
	const mine = soldiersOf(f).filter((u) => u.state === 'home'),
		keep = Math.ceil(mine.length * 0.5),
		go = mine.slice(keep);
	if (!go.length || !pt) return false;
	go.forEach((u) => {
		u.state = 'assist';
		u.px = pt.x;
		u.py = pt.y;
		u.idleT = 0;
	});
	if (tell) news('war', `${G.P[f].name} send ${some(go.length, 'soldier')} to help.`, 'good', TOAST.mid);
	return true;
}
// an ally twice your strength may be offered overlordship: they become your vassal at a light tax
function overlordWhy(o, q) {
	const Q = G.P[q];
	if (!Q.alive || G.rel[o][q] !== 'ally') return 'Only an ally.';
	if (powerOf(soldiersOf(o)) < 2 * powerOf(soldiersOf(q))) return 'Needs twice their army.';
	return null;
}
function offerOverlord(o, q) {
	if (overlordWhy(o, q)) return false;
	makeVassal(q, o, 'light');
	return true;
}

// ── A lord's hand on a vassal: cut them loose, demand, force tribute, call up their soldiers (Assyria taxed at spear-point; Rome's client kings sent auxiliaries)
function breakTies(L, q) {
	const Q = G.P[q];
	if (Q.lord !== L) return false;
	Q.lord = null;
	Q.rebel = null;
	for (const u of G.units) if (u.levy === q && u.owner === L) releaseLevy(u);
	for (const v of vassalsOf(L)) v.unrest = clamp((v.unrest || 0) + DEMAND.tributeUnrest, 0, 100); // the others grow warier of you
	declareWar(L, q, L === 0 ? 'you cut them loose' : `${G.P[L].name} cut them loose`);
	return true;
}
const demandCost = (Q) => DEMAND.loyal * (1 + (Q.demands || []).filter((t) => G.t - t < DEMAND.recent).length);
function demandWhy(L, q, r) {
	const Q = G.P[q];
	if (Q.lord !== L || Q.rebel) return 'Not now.';
	if (!(Q.res[r] > 0)) return `They have no ${LONG[r]}.`;
	return null;
}
function demand(L, q, r) {
	if (demandWhy(L, q, r)) return false;
	const Q = G.P[q],
		x = Math.min(DEMAND.amt, Math.floor(Q.res[r])),
		cost = demandCost(Q);
	spend(Q, r, x, 'tax');
	earn(G.P[L], r, x, 'tax');
	Q.loyal = Math.max(0, (Q.loyal || 0) - cost);
	(Q.demands = Q.demands || []).push(G.t);
	if (L === 0) news('realm', `${Q.name} hand over ${x} ${LONG[r]}: loyalty −${cost}.`, '', TOAST.mid);
	return true;
}
const menAt = (L, q) => {
	const k = keepOf(q);
	return k ? G.units.filter((u) => u.owner === L && isSoldier(u) && dist(u, k) < VASSAL.r).length : 0;
};
function tributeWhy(L, q) {
	const Q = G.P[q];
	if (Q.lord !== L || Q.rebel) return 'Not now.';
	if (Q.forced > G.t) return `Already forced: ${Math.ceil(Q.forced - G.t)} s.`;
	if (menAt(L, q) < DEMAND.tributeMen) return `${DEMAND.tributeMen} soldiers at their town first.`;
	return null;
}
function forceTribute(L, q) {
	if (tributeWhy(L, q)) return false;
	const Q = G.P[q];
	Q.forced = G.t + DEMAND.tribute;
	Q.unrest = clamp((Q.unrest || 0) + DEMAND.tributeUnrest, 0, 100);
	if (L === 0) news('realm', `${Q.name} pay double for ${DEMAND.tribute / 60} minutes.`, '', TOAST.mid);
	return true;
}
const levyOf = (L, q) => G.units.filter((u) => u.owner === L && u.levy === q && u.hp > 0);
// how many more may be called up: half of all their soldiers, counting those already marching for you (Build 48: half of what was left, again and again)
const levyRoom = (L, q) => {
	const out = levyOf(L, q).length;
	return Math.max(0, Math.ceil((soldiersOf(q).length + out) * DEMAND.levyMax) - out);
};
function levyWhy(L, q, n) {
	const Q = G.P[q],
		home = soldiersOf(q).filter((u) => u.state === 'home');
	if (Q.lord !== L || Q.rebel) return 'Not now.';
	if (!home.length) return 'None at home.';
	if (n < 1 || n > levyRoom(L, q)) return 'Half at most.';
	return null;
}
function levy(L, q, n) {
	// their soldiers march under your colours until released; their dead cost loyalty
	if (levyWhy(L, q, n)) return false;
	const home = soldiersOf(q)
			.filter((u) => u.state === 'home')
			.slice(0, n),
		k = keepOf(L);
	for (const u of home) {
		u.owner = L;
		u.levy = q;
		u.state = 'goto';
		u.px = k ? k.x : u.x;
		u.py = k ? k.y : u.y;
		u.idleT = 0;
		u.hb = undefined;
		u.bn = G.sel !== 'all' && L === 0 ? G.sel : undefined;
	}
	if (L === 0) {
		news('realm', `${home.length} soldiers of ${G.P[q].name} march to you.`, 'good', TOAST.mid);
		march(home, k || home[0], 'your town');
	}
	return true;
}
function releaseLevy(u) {
	const q = u.levy;
	u.levy = undefined;
	u.owner = q;
	u.state = 'home';
	u.bn = undefined;
	u.ord = undefined;
	u.focus = null;
	u.tgt = null;
}
function releaseAll(L, q) {
	const S = levyOf(L, q);
	S.forEach(releaseLevy);
	if (L === 0 && S.length) news('realm', `${S.length} soldiers go home to ${G.P[q].name}.`, '', TOAST.mid);
	return S.length > 0;
}

// ───────────────────────── Combat you steer: charge, fall back, prisoners ─────────────────────────
const chargeWhy = (o, S, bn) => {
	const t = (G.chargeT || {})[o + ':' + (bn ?? 'all')];
	if (!S.some((u) => isSoldier(u) && !UNIT[u.kind].bonly)) return 'Nobody to charge.';
	if (t > G.t) return `Winded: ${Math.ceil(t - G.t)} s.`;
	return null;
};
function charge(o, S, bn, quiet) {
	// a burst of speed and blows for a few seconds, then tired; once a half minute a battalion
	if (chargeWhy(o, S, bn)) return false;
	(G.chargeT = G.chargeT || {})[o + ':' + (bn ?? 'all')] = G.t + CHARGE.cd * fxv(o, 'chargecd').m; // the Mongol Remounts: a charge comes round sooner (p44)
	for (const u of S)
		if (isSoldier(u) && !UNIT[u.kind].bonly) {
			u.chg = G.t + CHARGE.secs;
			u.mor = Math.min(1, u.mor + 0.1);
		}
	if (o === 0 && !quiet) {
		say(`${bn !== undefined ? BN[bn] : 'The army'} charge!`, 'good', TOAST.mid);
		sfx('horn');
	} // the Director says and sounds its own (quiet)
	return true;
}
function fallBack(o, S, bn, quiet) {
	// withdraw in order toward home: fewer losses than a rout, and no rout while it lasts
	const h = homeOf(o);
	if (!h) return false;
	let n = 0;
	for (const u of S) {
		if (!isSoldier(u)) continue;
		const f = nearestFoe(o, u, 200),
			dx = f ? u.x - f.x : h.x - u.x,
			dy = f ? u.y - f.y : h.y - u.y,
			dd = hyp(dx, dy) || 1;
		u.fb = G.t + FALLBACK.secs;
		u.state = 'goto';
		u.px = clamp(u.x + (dx / dd) * FALLBACK.back, 20, MAP - 20);
		u.py = clamp(u.y + (dy / dd) * FALLBACK.back, 20, MAP - 20);
		u.idleT = 0;
		u.tgt = null;
		u.focus = null;
		u.ord = undefined;
		n++;
	}
	if (o === 0 && n && !quiet) say(`${bn !== undefined ? BN[bn] : 'The army'} fall back.`, '', TOAST.mid);
	return n > 0;
}
// Prisoners: a runner touched by a foe, or a man netted by the Natives. The owner may ransom them back; unransomed, they serve the captor.
function takePrisoner(by, v) {
	if (v.owner === WILD) {
		v.hp = 0;
		v.gone = true;
		return;
	} // the wild are not ransomed: a netted robber or warrior is simply gone
	const ransom = Math.round(Math.max(40, sumCost(UNIT[v.kind].cost || { f: 40 }) * PRISON.ransom));
	(G.prisoners = G.prisoners || []).push({ o: v.owner, by, kind: v.kind, t: G.t, ransom });
	v.hp = 0;
	v.gone = true;
	if (v.owner === 0)
		news('war', 
			`${by === WILD ? 'Netted' : G.P[by].name + ' took a prisoner'}: your ${UNIT[v.kind].name.toLowerCase()}. Ransom ${ransom}g.`,
			'warn',
			TOAST.long,
			v,
		);
	else if (by === 0) news('war', `A prisoner taken: their ${UNIT[v.kind].name.toLowerCase()}.`, 'good', TOAST.mid, v);
}
const prisonersOf = (o) => (G.prisoners || []).filter((x) => x.o === o);
function payRansom(o, i) {
	const x = prisonersOf(o)[i];
	if (!x || G.P[o].res.g < x.ransom) return false;
	spend(G.P[o], 'g', x.ransom, 'ransom');
	if (x.by !== WILD && G.P[x.by]) earn(G.P[x.by], 'g', x.ransom, 'ransom');
	G.prisoners.splice(G.prisoners.indexOf(x), 1);
	const k = keepOf(o);
	if (k) {
		const u = addUnit(o, x.kind, k.x + 40, k.y + 40);
		u.state = 'home';
	}
	if (o === 0) news('war', `Ransom paid: your ${UNIT[x.kind].name.toLowerCase()} walks home.`, 'good', TOAST.mid);
	return true;
}
// ── Teach: a soldier of an older kind learns a newer one at the School. It stands frozen for the lesson; tuition is paid up front.
const teachTo = (u) => {
	const k = TEACH_TO[baseKind(u.kind)];
	return k && UNIT[k].age > UNIT[baseKind(u.kind)].age ? k : null;
};
const teachGap = (u) => UNIT[teachTo(u)].age - UNIT[baseKind(u.kind)].age;
function teachCost(o, u) {
	const A = unitCost(o, baseKind(u.kind)),
		B = unitCost(o, teachTo(u)),
		c = {};
	for (const r in B) if ((B[r] || 0) - (A[r] || 0) > 0) c[r] = B[r] - (A[r] || 0);
	c.g = (c.g || 0) + TEACH.tuition * teachGap(u);
	return c;
}
const teachSecs = (o, u) => UNIT[teachTo(u)].t * TEACH.mul * teachGap(u) * fxv(o, 'teach').m;
const schooling = (o) => G.units.filter((v) => v.owner === o && v.state === 'school' && v.hp > 0).length;
function teachWhy(o, u) {
	const p = G.P[o],
		to = teachTo(u);
	if (!to) return 'Nothing newer to learn.';
	if (u.state === 'school') return 'Already learning.';
	if (fxv(o, 'teach').a < 1) return 'Research Veterans at the Barracks.';
	if (UNIT[to].age > p.age) return `Needs the ${AGES[UNIT[to].age].name} age.`;
	const S = ready(o, 'school');
	if (!S.length) return 'Needs a School.';
	if (schooling(o) >= TEACH.seats * S.length) return 'The School is full.';
	if (!afford(p, teachCost(o, u))) return `Not enough: ${costText(teachCost(o, u))}.`;
	return null;
}
function teach(o, u) {
	if (teachWhy(o, u)) return false;
	pay(G.P[o], teachCost(o, u), 'research');
	u.state = 'school';
	u.schoolT = G.t + teachSecs(o, u);
	u.tgt = null;
	u.fb = 0;
	u.chg = 0;
	return true;
}
function graduate(u) {
	const o = u.owner,
		to = civKind(o, teachTo(u)),
		f = u.hp / u.max;
	u.kind = to; // its place in its squad stays: a squad holds a kind, and a lesson keeps to the kind (TEACH_TO; Build 70)
	u.max = maxHpU(o, to);
	u.hp = Math.max(1, u.max * f);
	u.state = 'home';
	u.schoolT = 0;
	if (o === 0) news('war', `Taught: a ${stats(0, to).name.toLowerCase()} joins the ranks.`, 'good', TOAST.mid, u);
}
function prisonersTick() {
	// every five seconds: the unransomed change sides
	for (const x of (G.prisoners || []).slice())
		if (G.t - x.t > PRISON.secs) {
			G.prisoners.splice(G.prisoners.indexOf(x), 1);
			const T = throneB(),
				k = x.by === WILD ? T : keepOf(x.by);
			if (x.by === WILD) {
				if (T) natSpawn(T, 'native');
			} else if (k && G.P[x.by].alive) {
				const u = addUnit(x.by, x.kind, k.x + 30, k.y + 30);
				u.state = 'home';
			}
			if (x.o === 0)
				news('war', 
					`Unransomed: your ${UNIT[x.kind].name.toLowerCase()} serves ${x.by === WILD ? 'the Natives' : G.P[x.by].name} now.`,
					'warn',
					TOAST.mid,
				);
		}
}
// ───────────────────────── Trade, zeal, spies, hiring ─────────────────────────
// The Market, one rule for everything it trades: resources by the 100, goods by the 10; it pays 80% of worth (90% with Coinage)
// and charges 125%, both moved by the going price. A trade stop pays full worth and more, which is why caravans go there.
const LOT = (k) => (TRADE[k] ? 100 : 10);
const worth = (k) => (TRADE[k] ? TRADE[k] / 100 : GOODS[k].buy || GOODS[k].base); // spice is worth what it costs at a stop
const coinOf = (o) => (G.P[o].debased ? MINT.price : 1); // debased coin: dearer to buy, less for what you sell
const sellPrice = (o, k) => Math.floor((LOT(k) * worth(k) * (SELL + fxv(o, 'sell').a) * mkt(k, o)) / coinOf(o));
const buyPrice = (o, k) => Math.ceil(LOT(k) * worth(k) * BUY * mkt(k, o) * coinOf(o));
const haveOf = (p, k) => (TRADE[k] ? p.res[k] : p.goods[k] || 0);
function marketTrade(o, k, dir) {
	const p = G.P[o],
		n = LOT(k);
	if (!ready(o, 'market').length) return false;
	if (dir === 'sell') {
		if (!MKT_SELL.includes(k) || haveOf(p, k) < n) return false;
		const v = sellPrice(o, k);
		if (TRADE[k]) spend(p, k, n, 'market');
		else p.goods[k] -= n;
		earn(p, 'g', v, 'market', !TRADE[k]); // raw sold for gold is a swap, not a gain; a good sold counts
		mktHit(k, n, -1);
	} else {
		if (!MKT_BUY.includes(k)) return false;
		const c = buyPrice(o, k);
		if (p.res.g < c) return false;
		spend(p, 'g', c, 'market');
		if (TRADE[k]) earn(p, k, n, 'market', false);
		else p.goods[k] = (p.goods[k] || 0) + n;
		mktHit(k, n, 1);
	}
	if (o === 0) sfx('coin');
	return true;
}
const zealCost = (o) => ({ g: Math.round(ZEAL.cost.g * fxv(o, 'zealcost').m) });
function zealWhy(o, list) {
	const p = G.P[o];
	if (!ready(o, 'temple').length) return 'Zeal needs a finished Temple.';
	if (p.zealT > G.t) return `Zeal is resting: ${Math.ceil(p.zealT - G.t)} s.`;
	if (!afford(p, zealCost(o))) return `Not enough gold: ${costText(zealCost(o))}.`;
	if (!list.some(isSoldier)) return 'Nobody to bless in that battalion.';
	if (!G.units.some((u) => u.owner === o && u.kind === 'priest' && list.some((v) => dist(u, v) < 120)))
		return 'A priest has to be with them.';
	return null;
}
function zeal(o, list) {
	if (zealWhy(o, list)) return false;
	const p = G.P[o];
	pay(p, zealCost(o), 'zeal');
	p.zealT = G.t + ZEAL.cd * fxv(o, 'zealcd').m;
	for (const u of list) if (isSoldier(u)) u.zeal = G.t + ZEAL.secs + fxv(o, 'zealsecs').a;
	if (o === 0) {
		say(`Zeal on the ${selName()} for ${ZEAL.secs} s.`, 'good', TOAST.mid);
		sfx('zeal');
	}
	return true;
}
// a spy stands unseen beyond 45 of soldiers and 140 of towers, the Town Center and Courthouses
const watchtower = (b) => b.prog >= 1 && b.hp > 0 && (BLD[b.kind].dmg || BLD[b.kind].spyonly);
const guarded = (b) =>
	G.blds.some((d) => d.owner === b.owner && watchtower(d) && dist(d, b) < spySeen(d.owner, d)); // the distance a tower sees a spy, not its shot range (B14)
function sabotage(u, b) {
	const how = BLD[b.kind].sab;
	if (!how) return false;
	if (how === 'burn') {
		b.hp -= maxHpB(b.owner, b.kind) * SAB.burn;
		if (b.hp > 0) ignite(b, 'sabotage');
	} else {
		b.stall = G.t + SAB.stall;
		const j = b.q.shift();
		if (j && j.age) G.P[b.owner].aging = false;
		if (j && (j.tech || j.age)) G.P[b.owner].spent -= sumCost(j.paid);
	} // lost research is not counted as research paid
	if (b.hp <= 0) b.by = undefined; // a fire pays nobody
	u.hp = 0;
	sfx(how === 'burn' ? 'crash' : 'err', b.x, b.y);
	const nm = bldName(b.owner, b.kind);
	if (b.owner === 0) {
		const what = how === 'burn' ? 'on fire' : `stopped ${SAB.stall} s`;
		news('war', `Sabotage at ${coord(b.x, b.y)}: ${nm} ${what}.`, 'warn', TOAST.long, b);
	} else if (u.owner === 0)
		news('war', `Your spy ${how === 'burn' ? 'set fire to' : 'stalled'} their ${nm.toLowerCase()}.`, 'good', TOAST.mid);
	return true;
}
function intel(o, owner) {
	if (o !== 0) return;
	const q = G.P[owner],
		army = {};
	for (const u of G.units) if (u.owner === owner && UNIT[u.kind].cls === 'army') army[u.kind] = (army[u.kind] || 0) + 1;
	G.intel[owner] = { t: G.t, res: { ...q.res }, age: q.age, techs: q.techs.size, army };
}
function hireWhy(o, f) {
	const H = FINDS[f.kind].hire;
	if (!H || f.done) return 'Gone.';
	if (!G.units.some((u) => u.owner === o && u.kind !== 'envoy' && dist(u, f) < 80)) return 'Send a unit there first.';
	if (clsCount(o, 'army') + H.n > armyRoom(o)) return armyFull(o); // the same ceiling as training (C16)
	if (!afford(G.P[o], H.cost)) return `Not enough: ${costText(H.cost)}.`;
	return null;
}
function hire(o, f) {
	if (hireWhy(o, f)) return false;
	const H = FINDS[f.kind].hire;
	pay(G.P[o], H.cost);
	f.done = true;
	f.owner = o;
	for (const v of G.units)
		if (v.find === f.id && v.kind === 'vagabond') {
			v.hp = 0;
			v.gone = true;
			const s = addUnit(o, civKind(o, H.unit), v.x, v.y);
			s.state = 'home';
		}
	if (o === 0) news('realm', `${H.n} vagabonds join your army.`, 'good', TOAST.mid);
	return true;
}

// ───────────────────────── Villager orders ─────────────────────────
function setJob(u, job, n, at) {
	if (u.node && u.node.farm) crowd(u.node, -1);
	u.job = job;
	u.node = n || null;
	u.at = null; // a spot held at the old find is let go: the new order is cap-checked on arrival (fresh review #1)
	u.was = n ? n.kind : null; // a fresh order: any find of the job until it has worked one
	if (n) {
		u.fn = n.id; // where it was put: Focus holds it there (D-093)
		u.fpos = { x: n.x, y: n.y };
	}
	if (!job || (n && !n.farm)) u.plot = null; // stopped, or sent to the land: no longer posted (D-089)
	else if (n && n.farm) u.plot = n.farm.id; // given a building: posted to it until you tap it off or it falls
	u.anchor = at ? { x: at.x, y: at.y } : null; // the spot it was placed: its search starts there and stays within the cap (decision 1)
	u.wait = false;
	u.sent = false; // set by your own orders after this (sendVil, order): it outlasts a fright (13-sim-civil)
	if (job) u.post = null;
	if (n && n.farm) crowd(n, 1);
	if (job !== 'repair') u.rep = null;
	else u.hunt = null; // sent to build: a hunt it was on is dropped (fresh review #1); a builder bitten takes the beast on its own job (hurt)
}
// a villager at a workshop, a mint or a foundry, walking there or working inside: + and the computers leave it be; − and Send out free it
const atShop = (u) => !!(u.node && u.node.farm && BLD[u.node.farm.kind].makes);
// the + and − under a job (D-089): + takes an idle villager, else the roaming one earning least on another job; − frees an idle one on this
// job, else the roaming one earning least. Neither ever takes a posted villager: it leaves its building only when you tap it off
const NO_HANDS = 'No free hands: train more villagers.';
function moveVil(o, job, down) {
	const V = unitsOf(o, 'vil').filter((u) => !u.inside && !posted(u) && !u.focus),
		low = (L) => L.reduce((b, u) => (!b || forageNow(u) < forageNow(b) ? u : b), null);
	if (down) {
		const L = V.filter((u) => u.job === job),
			v = L.find(freeVil) || low(L);
		if (v) setJob(v, null);
		return;
	}
	const v = V.find(freeVil) || low(V.filter((u) => u.job && u.job !== job && u.job !== 'repair' && !GOODK.includes(u.job)));
	if (v) setJob(v, job);
	else if (o === 0) say(NO_HANDS, 'warn', TOAST.short);
}
// Stop: a villager drops its job and stands where it is (or where it is sent), ready for a new order (Build 61)
function stopVil(u, post) {
	if (u.inside && u.shop) stepOut(u, byId(G.blds, u.shop));
	u.shop = 0;
	setJob(u, null);
	u.hunt = null;
	u.patch = null;
	u.rep = null;
	u.post = post;
}
// Send out (a field, a pasture or a shop's card): the last villager sent there goes home; a shop worker steps out of the door
function sendOut(o, id) {
	const v = unitsOf(o, 'vil')
		.filter((u) => u.node && u.node.id === id)
		.pop();
	if (v) setJob(v, null);
	return !!v;
}
function sendVil(o, id) {
	const n = byId(G.nodes, id);
	if (!n || (n.amt <= 0 && n.kind !== 'farm')) return false;
	if (n.farm && (n.wk || 0) >= slotsOf(n)) {
		if (o === 0) say('Already worked: one to each.', '', TOAST.short);
		return false;
	}
	const job = n.type,
		v = pickVil(o, n, job, null, hand(o) && !!n.farm); // to a building of yours: an idle villager only (D-089)
	if (!v) {
		if (o === 0) say(NO_HANDS, 'warn', TOAST.short);
		return false;
	}
	if (o === 0 && !n.farm && unsafe(n, 0)) {
		const why = dangerWhy(n, 0);
		if (!why.scare) {
			say(`${why.w}: nobody will work the ${nodeName(n).toLowerCase()} yet.`, 'warn', TOAST.mid);
			return false;
		}
	} // a real danger there: said, and nobody sent (Albert, Nov 3: it went, then quietly came off)
	setJob(v, job, n, n);
	v.sent = o === 0;
	if (o === 0) say(`A villager heads for the ${nodeName(n).toLowerCase()}.`, '', TOAST.short);
	return true;
}
function sendHunt(o, id) {
	// tap game, send a hunter: the nearest idle villager, else one from another job
	const a = G.units.find((x) => x.id === id && x.hp > 0 && x.owner === WILD && UNIT[x.kind].meat);
	if (!a) return false;
	const v = pickVil(o, a, 'food');
	if (!v) {
		if (o === 0) say(NO_HANDS, 'warn', TOAST.short);
		return false;
	}
	setJob(v, 'food');
	v.hunt = a;
	if (o === 0) say(`A villager goes hunting ${UNIT[a.kind].name.toLowerCase()}.`, '', TOAST.short);
	return true;
}
function sendRepair(o, id) {
	const b = G.blds.find((x) => x.id === id && standing(x, o));
	if (!b || b.hp >= maxHpB(o, b.kind) - 0.5) return false;
	const v = pickVil(o, b, null, null, hand(o));
	if (!v) {
		if (o === 0) say(NO_HANDS, 'warn', TOAST.short);
		return false;
	}
	setJob(v, 'repair');
	v.rep = b;
	if (o === 0) say(`A villager goes to mend the ${bldName(o, b.kind).toLowerCase()}.`, '', TOAST.short);
	return true;
}
const repairCost = (o, b) => {
	const M = maxHpB(o, b.kind);
	return Object.fromEntries(
		Object.entries(BLD[b.kind].cost || { w: 200, s: 100 }).map(([k, v]) => [k, Math.ceil(v * 0.25 * (1 - b.hp / M))]),
	);
};
const nodeName = (n) =>
	n.kind === 'farm'
		? n.type === 'wood'
			? 'Tree farm'
			: 'Field'
		: { tree: 'Tree', bush: 'Berry bush', fish: 'Fish', stone: 'Stone', gold: 'Gold', iron: 'Iron', meat: 'Carcass' }[
				n.kind
			];

// ── the player's placing and box orders (the finger's work is in 26-input.js; what it orders is here)
function commitPlace() {
	const pl = G.place;
	if (!pl || !pl.at) return;
	const kind = pl.kind,
		B = BLD[kind],
		p = G.P[0];
	if (lineKind(kind)) {
		const cells = pl.cells && pl.cells.length ? pl.cells : [toCell(pl.at)];
		let built = 0,
			blocked = 0,
			broke = false;
		navOnce(() => {
			for (const c of cells) {
				if (!afford(p, B.cost)) {
					broke = true;
					break;
				}
				if (build(0, kind, c.gx * NAVC + 5, c.gy * NAVC + 5)) built++;
				else blocked++;
			}
		});
		say(
			built
				? `${built} ${kind === 'wall' ? 'wall piece' + (built > 1 ? 's' : '') : B.name.toLowerCase()} going up${blocked ? `; ${blocked} blocked` : ''}${broke ? '; out of ' + LONG[Object.keys(B.cost)[0]] : ''}.` // a trap is named by its plural already; its own resource runs out (p44)
				: broke
					? `Not enough: ${costText(B.cost)} a piece.`
					: 'Something is in the way.',
			'',
			TOAST.mid,
		);
		pl.cells = null;
		pl.pts = [];
		pl.at = null;
		ui(true);
		return;
	}
	const why = canPlace(0, kind, pl.at.x, pl.at.y);
	if (why) {
		say(why + '.', '', TOAST.short);
		sfx('err');
		return;
	}
	if (!afford(p, B.cost)) {
		say(`Not enough for a ${B.name.toLowerCase()}: ${costText(B.cost)}.`, '', TOAST.short);
		sfx('err');
		return;
	}
	const b = build(0, kind, pl.at.x, pl.at.y);
	if (b && !capWhy(0, kind) && afford(p, B.cost)) {
		// keep placing (Build 61, Albert: anything you can make more of right now): the next spot beside it, until the limit or the purse says no;
		// wooden buildings leave a cell between them, so a fire has a gap to cross (Build 61: measured, houses one cell apart caught in a third of fires)
		const n = B.fp * NAVC + NAVC * (B.wood ? 2 : 1),
			spots = [
				[n, 0],
				[0, n],
				[-n, 0],
				[0, -n],
			].map(([dx, dy]) => snapPos(kind, b.x + dx, b.y + dy));
		pl.at = spots.find((s) => !canPlace(0, kind, s.x, s.y)) || null;
		if (!pl.at) cancelPlace();
	} else cancelPlace();
	ui(true);
}
function boxCut(r, n) {
	// send n villagers to cut the trees in the box, then back to their work
	const mid = { x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2 },
		V = unitsOf(0, 'vil')
			.filter((u) => !u.inside && !u.patch && u.job !== 'repair')
			.sort((a, b) => !!a.job - !!b.job || dist(a, mid) - dist(b, mid)); // idle first, then the nearest
	let sent = 0;
	for (const v of V.slice(0, n)) {
		v.pj = v.job === 'wood' ? null : v.job;
		setJob(v, 'wood');
		v.patch = { ...r };
		sent++;
	}
	say(
		sent ? `${sent} villager${sent > 1 ? 's go' : ' goes'} to cut the trees in the box.` : 'No villager is free.',
		'',
		TOAST.mid,
	);
}

// ── Orders you can follow: a group sent somewhere is stamped with its order; the map draws a line to where it is going, the People card
// lists it, and the game says when it gets there (Build 38: an attack that marched 90 seconds with no sign looked like it never left)
// A group sent somewhere is an order: it has a line and a ring on the map, a count and a time on the Army card, and a message when everyone has stopped.
// k is how much longer the walk is than the straight line (one path found when the order is given); the time shown is the slowest marcher's.
// the centre of a group, how much longer the walk is than the straight line (one path found), and the slowest marcher's time to arrive: the weather on the screen is counted, nothing extra is added
const centreOf = (S) => ({
	x: S.reduce((s, u) => s + u.x, 0) / S.length,
	y: S.reduce((s, u) => s + u.y, 0) / S.length,
});
function routeK(c, to) {
	const p = astar(c.x, c.y, to.x, to.y, 0),
		len = p.pts.reduce(
			(s, q, i) => s + (i ? hyp(q.x - p.pts[i - 1].x, q.y - p.pts[i - 1].y) : dist(q, c)),
			0,
		);
	return p.pts.length ? clamp(len / Math.max(1, dist(to, c)), 1, 3) : 1;
}
const etaOf = (S, to, k) =>
	Math.max(0, ...S.map((u) => (dist(u, to) * k) / Math.max(1, paceOf(u, sideSpd(0)))));
function march(S, to, label) {
	if (!S.length) return;
	const id = (G.ordN = (G.ordN || 0) + 1);
	(G.ords = G.ords || {})[id] = {
		id,
		x: Math.round(to.x),
		y: Math.round(to.y),
		label,
		t: G.t,
		arrived: false,
		k: routeK(centreOf(S), to),
	};
	for (const u of S) {
		u.ord = id;
		u.mvT = G.t; // just ordered: counts as moving until it proves otherwise
	}
	say(`${S.length} marching: ${label}.`, '', TOAST.short);
}
// soldiers called home: off whatever they were doing and off their order
function sendHome(S) {
	for (const u of S) {
		u.state = 'home';
		u.fid = null;
		u.focus = null;
		u.tgt = null;
		u.ord = undefined;
	}
}
function incomingTick() {
	// the nearest hostile group you can see that is heading for your buildings: how many, and how long until it arrives (Build 42)
	const mine = G.blds.filter((b) => b.owner === 0 && b.hp > 0);
	let best = null,
		bd = 520;
	if (mine.length)
		for (const u of G.units) {
			if (u.hp <= 0 || u.owner === 0 || friendly(0, u.owner) || !isSoldier(u) || u.state !== 'attack' || !seen0(u))
				continue;
			for (const b of mine) {
				const d = dist(u, b);
				if (d < bd) {
					bd = d;
					best = u;
				}
			}
		}
	if (!best) {
		G.incoming = null;
		return;
	}
	const n = G.units.filter(
		(u) =>
			u.hp > 0 && u.owner === best.owner && u.state === 'attack' && dist(u, best) < 140 && seen0(u),
	).length; // the ones you can see
	G.incoming = {
		x: best.x,
		y: best.y,
		n,
		what: n > 1 ? 'enemy soldiers' : 'enemy soldier',
		eta: Math.ceil(bd / Math.max(1, paceOf(best, sideSpd(best.owner)))),
	};
}
function ordersTick() {
	// once a second: who is still on each order, how many are still walking, and has everyone stopped
	incomingTick();
	if (!G.ords) return;
	const by = {};
	for (const u of G.units) if (u.owner === 0 && u.ord && u.hp > 0) (by[u.ord] = by[u.ord] || []).push(u);
	for (const id in G.ords) {
		const O = G.ords[id],
			S = by[id];
		if (!S) {
			delete G.ords[id];
			continue;
		}
		let x = 0,
			y = 0,
			walk = 0,
			fight = 0,
			rout = 0,
			eta = 0;
		for (const u of S) {
			x += u.x;
			y += u.y;
			const st = armyStatus(u);
			if (st === 'march') {
				walk++;
				eta = Math.max(eta, etaOf([u], O, O.k || 1));
			} else if (st === 'fight') fight++;
			else if (st === 'rout') rout++;
		}
		O.cx = x / S.length;
		O.cy = y / S.length;
		O.n = S.length;
		O.walk = walk;
		O.fight = fight > 0;
		if (!O.arrived && !walk && !fight && !rout && G.t - O.t > 3) {
			O.arrived = true;
			news('war', `${S.length} arrived: ${O.label}.`, 'good', TOAST.mid, O);
		} // every one has stopped: a straggler that never got there is counted as stopped too
		O.eta = O.arrived ? 0 : Math.ceil(eta);
	}
	missionsTick();
	for (const u of G.units) if (u.ord && (!G.ords[u.ord] || u.state === 'home')) u.ord = undefined; // called home: no longer on that order
}
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
	for (const u of G.units) if (u.owner === WILD) u.wk = 0;
	for (const u of G.units)
		if (u.kind === 'vil') {
			if (u.node) u.node.wk++;
			else if (u.hunt) crowd(u.hunt, 1);
		} // a hunted animal counts its hunters, as a find its workers: the crowd is the same rule (item 6)
}
// layers worn in series (decision N10): heat loss Q = ΔT / R_total and R_total = R_body + Σ R_i, so the cold's or the rain's toll on a march
// goes as 1 / (1 + Σ a_i), each a_i a layer's resistance as a multiple of what the soldier already wears: a = 1 halves it, two such a third, never none
const insulate = (a) => 1 / (1 + a);
// what the season and the weather take off a march, for one side: moveTo and the mission clocks read the same number
function sideSpd(o) {
	const sp = season().spd * (hz('winter') && season().name === 'Winter' ? 0.8 : 1),
		wsp = WEATHER[G.wx].spd || 1;
	return o === WILD
		? sp * wsp
		: (1 - (1 - sp) * fxv(o, 'mud').m * (season().name === 'Winter' ? insulate(fxv(o, 'cold').a) : 1)) *
				(1 - (1 - wsp) * (precip(G.wx) ? insulate(fxv(o, 'wet').a) : 1));
}
function step(dt) {
	if (G.over) return;
	G.t += dt;
	G.tick++;
	G.night = evOn('eclipse') ? 1 : nightness();
	G.threats = [];
	for (const v of G.units) {
		if ((v.thr = isThreat(v))) G.threats.push(v);
		v.lx = v.x; // where it stood before this step: the frame between two steps is drawn between the two (Build 63)
		v.ly = v.y;
	}
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
		if (YARD_ON) matchLog();
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
			if (b.owner === 0) news('home', `${bldName(0, b.kind)} cut out: tap it to replant.`, '', TOAST.mid, b);
		} else if (b.spent && b.node && b.node.amt > 0) b.spent = false; // a coppice plot, spent: it stands, stumps and all, until it is replanted (Build 61; it used to vanish)
	for (const b of G.blds)
		if (b.kind === 'throne' && b.hp <= 0 && !b.gone) {
			if (b.by !== undefined && b.by !== WILD && G.t - (b.byT || 0) < 20) takeThrone(b.by);
			else b.hp = 1;
		} // the Throne is taken, never broken
	for (const b of G.blds)
		if (b.hp <= 0) {
			if (!b.gone && b.prog >= 1 && !BLD[b.kind].wallish) scarBurn(b);
			if (b.node) b.node.amt = 0;
			if (b.by !== undefined && G.t - (b.byT || 0) < 20) plunderBld(b); // a flood twenty minutes after a scratch is nobody's kill (Build 63)
			if (BLD[b.kind].fx) fxChange = true;
			if (G.wonder && G.wonder.id === b.id) {
				news('realm', 
					`${G.P[b.owner].name === 'You' ? 'Your wonder' : 'The wonder of ' + G.P[b.owner].name} has fallen.`,
					b.owner === 0 ? 'warn' : 'good',
					TOAST.long,
				);
				const w2 = G.blds.find((x) => x !== b && x.kind === 'wonder' && x.prog >= 1 && x.hp > 0 && x.wend);
				G.wonder = w2 ? { owner: w2.owner, id: w2.id, end: w2.wend } : null; // another wonder still stands: its own clock goes on (B6)
			}
		}
	if (fxChange) fxDirty();
	if (G.lootT && G.t - G.lootT > 1.5) {
		news('trade', `Plunder: ${costText(G.loot)}.`, 'good', TOAST.mid);
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
		let spent = false,
			tree = false;
		for (const n of G.nodes)
			if (!(n.amt > 0 || (n.farm && n.farm.hp > 0))) {
				spent = true;
				if (n.kind === 'tree') {
					tree = true;
					break;
				}
			}
		if (spent) G.nodes = G.nodes.filter((n) => n.amt > 0 || (n.farm && n.farm.hp > 0));
		if (tree) G.navDirty = true;
	} // a tree felled opens its ground the same step (held longer, cutters beside it stall); only a tree blocks the grid, so only a tree
	// rebuilds it (hunt A #7: a picked bush or a butchered deer cost a whole rebuild); the list is copied only when something is spent
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
			D = drillOn(a[0]) ? a[0].drill : null, // a drill of the War Director (28-army-quick: dress), until a new order
			shape = D ? D.shape : shapeOf(a[0]).shape; // a battalion takes its shape: a narrow column on the march, then the line, the point-first wedge or the closed square
		const cols =
				shape === 'column'
					? Math.min(n, 3)
					: shape === 'square'
						? Math.ceil(Math.sqrt(n))
						: shape === 'front'
							? n // one rank
							: shape === 'choke'
								? clamp((D && D.cols) || 3, CHOKE.min, CHOKE.max) // as many files as the gap holds
								: D && shape === 'line'
									? n <= 6 ? n : Math.ceil(n / 2) // a shield wall: one rank, two past six
									: clamp(Math.round(Math.sqrt(n * GRID.rows)), 1, 14),
			wr = (i) => Math.floor((Math.sqrt(8 * i + 1) - 1) / 2);
		// the line faces along the march; ranks trail behind the first, and a unit standing at its place faces the same way
		const t = { x: a[0].px, y: a[0].py },
			fx0 = D ? D.fx : k ? t.x - k.x : 0,
			fy0 = D ? D.fy : k ? t.y - k.y : 1,
			fl = hyp(fx0, fy0) || 1,
			fx = fx0 / fl,
			fy = fy0 / fl;
		const cm = regionAt(t, a[0].owner),
			mates = new Set(a); // the battalion's own stand in its shape: only others take a place
		if (shape === 'support') a.sort((p, q) => (UNIT[p.kind].rng > 20) - (UNIT[q.kind].rng > 20) || p.id - q.id); // the foot first: they take the ring
		const nf = shape === 'support' ? a.filter((u) => (UNIT[u.kind].rng || 0) <= 20).length : 0,
			rOut = (Math.max(nf, 6) * GRID.gap) / (2 * Math.PI); // the ring's radius: the foot GRID.gap apart round it
		for (let i = 0; i < n; i++) {
			const ri = shape === 'wedge' ? wr(i) : Math.floor(i / cols),
				c = (shape === 'wedge' ? i - (ri * (ri + 1)) / 2 - ri / 2 : (i % cols) - (cols - 1) / 2) * GRID.gap,
				r = -ri * GRID.gap,
				u = a[i],
				sk = t.x + ',' + t.y + ',' + i + ',' + n + ',' + shape + ',' + fx.toFixed(2) + ',' + NAV.v;
			if (u.sk !== sk) {
				// a place in the shape goes through the one spot check (item 5): one that falls in a tree, a lake or a building, across a wall,
				// off the map or on someone else moves to the nearest free spot round it, on the spot's side (Build 48)
				let gx = -fy * c + fx * r,
					gy = fx * c + fy * r;
				if (shape === 'support') {
					const onRing = i < nf,
						m = onRing ? nf : n - nf,
						j = onRing ? i : i - nf,
						th = (j / Math.max(1, m)) * 2 * Math.PI,
						rr = onRing ? rOut : Math.max(0, rOut - GRID.gap) * Math.sqrt((j + 0.5) / Math.max(1, m)); // the shooters spread inside, denser at the middle
					gx = Math.cos(th) * rr;
					gy = Math.sin(th) * rr;
				} // support: foot on the ring, shooters within
				if (D && shape === 'arc') {
					const A = D.arc,
						ph = Math.atan2(t.y - A.y, t.x - A.x),
						th = ph + (i - (n - 1) / 2) * Math.min(GRID.gap / A.r, (2 * Math.PI) / 3 / Math.max(1, n - 1)); // GRID.gap apart along the arc, the whole within 120°
					gx = A.x + Math.cos(th) * A.r - t.x;
					gy = A.y + Math.sin(th) * A.r - t.y;
				} // the archers' arc: one rank on the circle round the foe, all at the same reach
				const p = { x: t.x + gx, y: t.y + gy };
				if (!spotFree(p, u.owner, cm, mates)) {
					const f = takeSpots([u], p, null, cm).get(u);
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
			if (v.owner === u.owner && isSoldier(v) && v.hp > 0 && dist(u, v) < MORALE.lossR) near.push(v); // a circle, not the grid's box (C15)
		});
		const share = 1 / (MORALE.breakAt * (near.length + 1));
		for (const v of near) v.mor -= share;
	}
	if (u.node && u.node.farm) crowd(u.node, -1);
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
				if (v.job !== 'repair') v.node = m; // a builder leaves the meat to the others and goes back to its site
			}
	}
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
				if (G.t < lim - m + 5) news('realm', `${m / 60} minute${m > 60 ? 's' : ''} left: top score wins.`, 'warn', TOAST.long);
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
			const j2 = b.q[1]; // Midwives (J2): a second villager in the line trains alongside the first, room allowing
			if (j2 && j.kind === 'vil' && j2.kind === 'vil' && fxv(o, 'twin', ['vil']).a > 0 && popOf(o) + 1 < capOf(o)) j2.left -= dt;
			if (j.left <= 0) {
				b.q.shift();
				jobDone(b, j);
				if (j2 && j2.left <= 0) {
					b.q.shift();
					jobDone(b, j2);
				}
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
					news('war', `Foes at your tower at ${coord(b.x, b.y)}.`, 'warn', TOAST.mid, b);
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
	b.mx = maxHpB(o, b.kind);
	if (o === 0) {
		sfx(B.armyRoom || (B.dmg && !B.spyonly) || B.wallish ? 'doneWar' : 'done', b.x, b.y);
		celebrate(b.kind === 'wonder' ? 3 : 1, b.x, b.y);
	} // a drum for a place of war, a knock for a home
	for (const u of G.units) if (u.rep === b && u.job === 'repair') u.st.built++;
	if (B.sheep && b.node) b.node.amt = (b.sheep || 0) * FLEECE * 0.5; // a new flock comes with half a year's wool on its back
	if (b.kind === 'wonder') {
		b.wend = G.t + WONDER_HOLD; // each wonder keeps its own clock; the one standing longest is the one the game shows
		if (!G.wonder) G.wonder = { owner: o, id: b.id, end: b.wend };
		news('realm', 
			o === 0
				? `Your wonder stands. Hold it ${WONDER_HOLD / 60} min to win.`
				: `${G.P[o].name} built a wonder: break it in ${WONDER_HOLD / 60} min!`,
			o === 0 ? 'good' : 'warn',
			TOAST.long,
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
				const ki = Math.max(
					0,
					CLS.findIndex((c) => c[2] === UNIT[j.kind].at),
				);
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
			news('war', `${j.bn !== undefined ? BN[j.bn] : 'A battalion'} mustered: ${musterN(j.muster)} soldiers.`, 'good', TOAST.mid, b);
		}
	} else if (j.tech) {
		learnTech(o, j.tech);
	} else if (j.age) {
		p.age = j.age;
		p.aging = false;
		fxDirty();
		if (o === 0) {
			news('realm', `You enter the ${AGES[p.age].name} age.`, 'good', TOAST.mid);
			sfx('age');
			const k = keepOf(0);
			if (k) {
				k.doneT = G.t;
				celebrate(3, k.x, k.y);
			}
		} else if (fxv(0, 'news').a >= 5 || !G.fogOn) news('chronicle', `${p.name} entered the ${AGES[p.age].name} age.`, '', TOAST.mid); // another court's age: in the news sheets
		chron(`${o === 0 ? 'You' : p.name} entered the ${AGES[p.age].name} age.`);
	}
}
function learnTech(o, id) {
	const T = TECHBY[id];
	G.P[o].techs.add(id);
	rehealth(o);
	if (T.age === 5) enlightenTick(o);
	if (o === 0) {
		news('realm', 
			T.tier
				? `${T.name}: your ${plural(UNIT[T.tier.unit].name.toLowerCase())} are now ${plural(stats(0, civKind(0, T.tier.unit)).name.toLowerCase())}.`
				: `${T.name} learned.`,
			'good',
			TOAST.mid,
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
		(b) => standing(b, o) && BLD[b.kind].drop && BLD[b.kind].drop.includes(type),
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
const unsafe = (p, o) => DANGER[o][gcell(p.x, p.y)] >= 2; // on the side's danger map (09-nav: dangerMap); a field is never left for it
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
		v = stats(o, 'vil').spd * groundSpd(o, unitKeys('vil')),
		others =
			n.kind === 'farm' ? 0 : n.hunt ? Math.max(0, (n.hunt.wk || 0) - (u.hunt === n.hunt ? 1 : 0)) : Math.max(0, (n.wk || 0) - (u.node === n ? 1 : 0)),
		g =
			((n.hunt ? RATE_OF.meat : n.rate || RATE_OF[n.kind]) *
				gatherMul(o, n.hunt ? { type: 'food', kind: 'meat' } : n)) /
			(1 + others / (FORAGE.room[n.hunt ? 'carcass' : n.kind] || 2)),
		A = n.hunt
			? UNIT[n.hunt.kind].meat
			: n.kind === 'farm' || (u.node === n && n.kind === 'tree')
				? c * FORAGE.life
				: Math.max(1, n.amt), // a tree you started counts as worth finishing: its stump opens the way (Build 63; Charnov would leave it)
		at = n.hunt || n,
		dr = (drops ? nearest(drops, at) : dropFor(o, n.type || 'food', at)) || keepOf(o), // fish too: the walk home counts (C13)
		d = dr ? dist(dr, at) : 0,
		w = dist(u, at);
	return c / (c / Math.max(1e-6, g) + (2 * d) / v + (w * c) / (Math.min(A, c * FORAGE.life) * v));
}
// The turtle plan (Albert, Build 63): what the next age costs in villager-minutes from this Town Center, with the walk counted. For each
// resource the best find the side knows from home gives a villager's rate there (the forager's rate, walk and all); the shortfall over that
// rate is the villager-minutes; split the villagers by those and the time to the bell follows. The Town Center's card shows it.
function turtlePlan(o, A = nextAge(o)) {
	const p = G.P[o],
		k = keepOf(o);
	if (!A || !k) return null;
	const probe = { x: k.x, y: k.y, owner: o, node: null, carry: 0 },
		rows = [];
	let mins = 0;
	for (const [key, cost] of Object.entries(A.cost)) {
		const need = Math.max(0, cost - (p.res[key] || 0));
		if (!need) continue;
		const r = RES.find((x) => KEY[x] === key);
		let best = 0;
		for (const n of G.nodes)
			if (n.amt > 0 && n.type === r && (o !== 0 || !G.fogOn || known0(n)) && dist(n, k) < 400)
				best = Math.max(best, forage(probe, n));
		for (const b of G.blds)
			if (b.owner === o && b.prog >= 1 && b.node && b.node.amt > 0 && b.node.type === r)
				best = Math.max(best, forage(probe, b.node));
		const vm = best > 0 ? need / (best * 60) : Infinity;
		rows.push({ key, r, need, vm, rate: best * 60 });
		mins += vm;
	}
	const V = Math.max(1, unitsOf(o, 'vil').length),
		split = rows.map((x) => ({
			r: x.r,
			n: isFinite(x.vm) && mins > 0 ? Math.max(1, Math.round((V * x.vm) / mins)) : 0,
		}));
	return { age: A, rows, mins, villagers: V, time: isFinite(mins) ? mins / V : Infinity, split };
}
// the rate a worker earns where it is now: 0 idle or off gathering
const forageNow = (u) =>
	!u.job || u.job === 'repair'
		? 0
		: u.hunt
			? forage(u, { hunt: u.hunt })
			: u.node && u.node.amt > 0 && !(u.node.farm && BLD[u.node.farm.kind].makes)
				? forage(u, u.node)
				: 0;
// the best find for this worker and its rate: fields, berries, trees, stone, gold, iron, fish, a carcass, or game within reach of home.
// seek (decision 1, a lost find): the point the search is measured from. Then it may take a find of the same kind its side has seen within
// the search radius of that point, or one a friend (its own side) is working; a placed villager none past the cap (x + y) from where it was
// placed, the rest none past the leash (REACH, the home band's edge) from the find's nearest drop-off. Of those, the best by the forager's rate R.
function bestNode(u, job, seek, cm) {
	let best = null,
		bR = 0,
		drops = null,
		mates = null;
	for (const n of G.nodes) {
		if (
			(n.amt <= 0 && !(n.farm && BLD[n.farm.kind].sheep)) ||
			!nodeFits(n, job) ||
			(n.kind !== 'farm' && unsafe(n, u.owner)) ||
			(u.bad && u.bad[n.id] > G.t) ||
			(u.owner === 0 && !known0(n))
		)
			continue; // your people work only what you have found (Build 60: under fog they set out for finds nobody had seen, into whatever stood there)
		if (n.kind === 'farm') {
			if (
				u.wild ||
				n.farm.owner !== u.owner ||
				n.farm.prog < 1 ||
				n.farm.hp <= 0 ||
				(n.wk || 0) - (u.node === n ? 1 : 0) >= slotsOf(n)
			)
				continue;
			if (BLD[n.farm.kind].makes || BLD[n.farm.kind].sheep) continue; // a workshop or a pasture is a post, not a find: it is staffed by its builder or by hand
			if (u.was && u.was !== 'farm') continue; // a worker from the wild never drifts onto a plot (Build 61: land work and wild work are two kinds)
		} else {
			if (u.was === 'farm') continue; // nor a plot worker into the wild
			if (u.was && n.kind !== u.was) continue; // the same kind of find (decision 1)
			if (n.kind === 'fish' && !dockNear(u.owner, n)) continue;
			if (n.kind === 'tree' && (!n.open || (u.patch && !inBox(n, u.patch)))) continue;
			if ((n.wk || 0) - (u.node === n ? 1 : 0) >= findCap(n)) continue; // full: every working spot taken (findCap)
		}
		if (!drops)
			drops = G.blds.filter(
				(b) => standing(b, u.owner) && BLD[b.kind].drop && BLD[b.kind].drop.includes(job),
			);
		if (u.was && n.kind !== 'farm') {
			const from = seek || u;
			if (dist(from, n) > searchR(u)) {
				if (!seek) continue; // looking round its own find: only within the radius
				if (!mates) {
					mates = new Set();
					for (const v of G.units) if (v.owner === u.owner && v !== u && v.node) mates.add(v.node);
				}
				if (!mates.has(n)) continue; // past the radius only a find a friend is working
			}
			if (seek && (u.anchor ? dist(u.anchor, n) > REACH : dist(nearest(drops, n) || keepOf(u.owner) || n, n) > REACH))
				continue; // the cap from where it was placed; else the leash from a drop-off
		}
		const R = forage(u, n, drops);
		if (R > bR && (!cm || reachFrom(n, cm, u.owner))) {
			bR = R;
			best = n;
		}
	}
	if (job === 'food' && u.owner !== 0) {
		// a computer's forager takes game on its own; yours hunts only when you send it (Build 61, Albert), or when an animal attacks
		const k = keepOf(u.owner);
		for (const a of G.units)
			if (
				a.owner === WILD &&
				a.hp > 0 &&
				UNIT[a.kind].meat &&
				UNIT[a.kind].tick === 'wild' &&
				k &&
				dist(a, k) < 420 &&
				!unsafe(a, u.owner)
			) {
				const R = forage(u, { hunt: a }, drops);
				if (R > bR && (!cm || reachFrom(a, cm, u.owner))) {
					bR = R;
					best = { hunt: a };
				}
			}
	}
	return best && { n: best, R: bR };
}
// cm: when given, only a find whose foot (an open square within two of it) lies in that walking region counts: a find out of reach is no find
const reachFrom = (n, cm, o) => !!freeNear(Math.floor(n.x / NAVC), Math.floor(n.y / NAVC), o, 2, n.x, n.y, 1, cm);
const nearestNode = (u, job, seek) => (bestNode(u, job, seek) || { n: null }).n; // the one find a worker should take now
// who to send: an idle villager first, the nearest; with strict (your orders to a building, D-089) nobody else. Otherwise, of the roaming
// workers on the same resource (types), the one earning least; then the one earning least on any gathering job. A posted villager keeps
// its building, a builder its site. (Albert, Oct 29: a new field takes the berry picker farthest from home, not a woodcutter)
function pickVil(o, to, types, site, strict) {
	const V = unitsOf(o, 'vil').filter((u) => !u.inside && !(site && u.rep === site) && !posted(u) && !u.focus),
		idle = V.filter(freeVil);
	if (idle.length) return nearest(idle, to);
	if (strict) return null;
	const T = types ? [].concat(types) : null,
		free = V.filter((u) => u.job && u.job !== 'repair' && !GOODK.includes(u.job) && !u.sent), // A (Albert, Nov 4): one you placed by hand stays placed
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
	if (!inLand(p.x, p.y, SPACE) || blockedCell(c, o) || (cm && NAV.comp[c] !== cm)) return false;
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
			// B (Albert, Nov 4: "when they finish they don't know what to do"): its find is gone, so the focus ends and it looks for the
			// next find of the same kind, as any worker does (was: it waited on the spot for ever, D-093)
			if (u.node && !u.node.farm) u.was = u.node.kind;
			u.focus = null;
			u.fn = null;
			u.node = null;
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
				...[
					[LMID, SQUARE - e],
					[SQUARE - e, LMID],
					[LMID, e],
					[e, LMID],
				].map(([x, y]) => [landAt(x, y).x, landAt(x, y).y]), // the land's four edges, in the world (preview 51)
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
// ═════ 36-economy.js: trade, weather, fire, sickness, vassals, the computers' economy ═════
// ───────────────────────── Goods, trade routes, nature, sickness and food ─────────────────────────
// Real ratios on a compressed calendar: one year is 12 minutes, and every rate below is set against that clock.
const FLEECE = 7,
	LAMBS = 0.6,
	FLOCK = 12, // wool per sheep at the spring shearing; a flock grows by logistic growth (Verhulst), r = 0.6 a spring toward a pasture that carries 12 (Build 56)
	FISH = { amt: 350, r0: 60, r: 0.5 }, // I (Albert, Nov 4): a spot's stock at a lake of radius r0; fish regrow each spring by Verhulst's law, r a year, to the spot's own K: fished past half they come back slower, fished out they are gone (Schaefer 1954)
	MUTTON = 100; // H (Albert, Nov 4): food a sheep gives at slaughter (from memory: AoE's sheep 100); the take is Schaefer's (1954): the flock held at half the pasture, K/2, where it regrows fastest, so the yield, rK/4 a year, lasts for ever

const stopsAll = () => G.finds.filter((f) => f.kind === 'stop');
const postAt = (f) => G.blds.find((b) => b.kind === 'tpost' && b.sid === f.id && b.hp > 0);
const stopsHeld = (o, r) => stopsAll().filter((f) => f.route === r && f.owner === o).length; // of one route's four stops
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
const flowOf = (p, k, last, now) =>
	p.rate && Object.keys(p.rate).length ? (last && last[k]) || 0 : (((now && now[k]) || 0) * 60) / Math.max(10, (G.tick % 1800) / 30);
const outOf = (p, k) => flowOf(p, k, p.orate, p.spent1); // what went out a minute (a computer's crew per resource reads it, 17-ai)
const netOf = (p, k) => flowOf(p, k, p.rate, p.flow) - outOf(p, k);
// a store's velocity on the one gradient: its net flow a minute over VEL.ref (tanh: a gentle middle, a firm end); falling with under two
// minutes left is the worst there is
const VEL = { ref: 40 };
function velOf(p, k) {
	const net = netOf(p, k);
	if (net < -0.5 && (p.res[k] || 0) < -net * 2) return -1;
	return Math.tanh(net / VEL.ref);
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
const giveTo = (p, k, q, why = 'trade') =>
	TRADE[k] ? earn(p, k, q, why, false) : (p.goods[k] = (p.goods[k] || 0) + q);
function priceAt(o, good, place, from) {
	let m = 1;
	if (place.kind === 'stop' && good === 'spice') return 0; // a stop sells spice; it does not buy it
	m = place.want === good ? POST.want : 1;
	return baseOf(good) * m * mkt(good, o) * (from ? distF(dist(from, place)) : 1) * fxv(o, 'trade').m;
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
const targetOf = (r) => r && (r.s ? byId(G.finds, r.to) : G.blds.find((b) => b.id === r.to && b.hp > 0));
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
			news('trade', 
				`A caravan ${sold.length ? `sold ${sold.join(', ')} for ${gold} gold` : 'reached the stop'}${u.goods.spice ? `, bought ${u.goods.spice} spice` : ''}.`,
				'good',
				TOAST.mid,
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
		if (u.foreign && G.plague && G.plague.until > G.t && rng() < HEALTH.plagueCart * (hz('plague') ? 2 : 1))
			outbreak(o, 0.05, true, u); // a few cases come home with the cart; the spread does the rest (SIR). The hazard's "twice as fast along the roads" (Build 60: it was never doubled)
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
	if (u.owner === 0) news('trade', `Caravan robbed${v ? ` (${Math.round(v)}g)` : ''}. Break their camp.`, 'warn', TOAST.long, u);
}

// ── the calendar: weather every minute, the seasons' work, the year's harvest
function natureTick() {
	const sn = Math.floor(G.t / SEASON_LEN);
	if (sn !== G.seasonN) {
		G.seasonN = sn;
		seasonTurn();
	}
	if (storm() && hazard(1 / 20)) {
		const s = landAt(rnd(80, SQUARE - 80), rnd(80, SQUARE - 80));
		strike(s.x, s.y);
	} // a strike on open ground, one every 20 s in a storm on average
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
	if (every(BEAT.slow)) {
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
				if (p.id === 0 && lost >= 20) news('home', `${lost} food spoiled in store this season.`, 'soft', TOAST.mid);
			}
		}
	if (s === 'Spring') for (const n of G.nodes) if (n.kind === 'fish' && n.amt > 0 && n.amt < n.max) n.amt = Math.min(n.max, logistic(n.amt, FISH.r, n.max));
	for (const b of G.blds)
		if (b.kind === 'pasture' && b.prog >= 1 && b.hp > 0) {
			if (s === 'Spring') {
				b.node.amt += (b.sheep || 0) * FLEECE;
				b.sheep = Math.min(FLOCK, Math.round(logistic(b.sheep || 0, LAMBS, FLOCK))); // Verhulst: fast while the pasture is empty, slowing as it fills
				const cull = b.node.wk > 0 ? Math.max(0, b.sheep - FLOCK / 2) : 0; // a shepherd culls the flock back to half: meat, and the most lambs next spring
				if (cull) {
					b.sheep -= cull;
					stash(b.owner, 'food', cull * MUTTON);
					if (b.owner === 0) news('land', `${cull} sheep to the butcher: ${cull * MUTTON} food.`, 'good', TOAST.short, b);
				}
			}
			const wolf = G.units.find(
				(v) =>
					v.owner === WILD && (v.kind === 'wolf' || v.kind === 'direwolf' || v.kind === 'bear') && dist(v, b) < 260,
			);
			if (wolf && b.sheep > 0) {
				const lost = Math.min(b.sheep, 1 + Math.floor(rng() * 2));
				b.sheep -= lost;
				if (b.owner === 0) news('land', `Wolves took ${lost} sheep at ${coord(b.x, b.y)}.`, 'warn', TOAST.mid, b);
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
					news('land', H.text, 'warn', TOAST.long);
					break;
				}
			}
		}
		if (
			G.P.some((p) => p.alive && p.id !== WILD && unitsOf(p.id, 'caravan').some((c) => c.route)) &&
			hazard(HEALTH.plague * (hz('plague') ? 3 : 1))
		) {
			G.plague = { until: G.t + SEASON_LEN * 2 };
			news('home', 'Plague on the roads: build a Hospital.', 'warn', TOAST.long);
		}
		if (G.blds.some((b) => b.owner === 0 && b.kind === 'pasture')) news('land', 'Spring: sheep shorn, lambs born.', 'good', TOAST.mid);
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
		.slice(0, 2); // two buckets for every side (B9: the comment said two, the computers got three)
	for (const v of near) {
		v.pj = v.job;
		setJob(v, 'repair');
		v.rep = b;
		v.fireman = true;
	}
	if (b.owner === 0)
		news('home', 
			`Fire at the ${bldName(0, b.kind).toLowerCase()} (${why}). ${near.length ? (near.length > 1 ? 'Two neighbours' : 'A neighbour') + ' run with buckets.' : 'Nobody is near it.'}`,
			'warn help',
			TOAST.long,
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
			if (b.owner === 0) news('home', `The ${bldName(0, b.kind).toLowerCase()} burned down.`, 'warn', TOAST.mid, b);
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

// ── sickness: a few fall ill now and then, more in summer and winter; clean water, sewers and quarantine lower the spread (MEASURED, 04-rules-tech); medicine cures and saves lives
function sickRisk(o) {
	const s = season().name;
	return (
		HEALTH.risk *
		(s === 'Summer' || s === 'Winter' ? 1.2 : 1) *
		fxv(o, 'sick').m *
		(s === 'Winter' ? fxv(o, 'warm').m : 1)
	); // warm homes: a milder winter
}
function outbreak(o, share, plague, at) {
	const p = G.P[o],
		k = keepOf(o);
	if (!k || p.alive === false) return;
	const ppl = G.units.filter(
		(u) => u.owner === o && UNIT[u.kind].cls && !u.inside && (dist(u, k) < 500 || depotNear(u)) && !(u.sick > G.t), // a camp is a town for sickness (CAMP)
	);
	const n = Math.max(1, Math.round(ppl.length * share * (plague ? fxv(o, 'plague').m : 1)));
	for (let i = 0; i < n && ppl.length; i++) {
		const u = ppl.splice(Math.floor(rng() * ppl.length), 1)[0];
		u.sick = G.t + HEALTH.sickFor;
		u.plague = !!plague;
	}
	if (plague) p.plagueDead = 0;
	if (o === 0)
		news('home', plague ? 'Plague, brought by a caravan!' : `Sickness: ${n} ill. A Hospital cures them.`, 'warn', TOAST.long, at);
}
function healthTick() {
	// every 5 seconds
	const H = [];
	for (const b of G.blds) if (BLD[b.kind].heal && b.prog >= 1 && b.hp > 0) H.push(b);
	for (const u of G.units) if (UNIT[u.kind].heal) H.push(u);
	for (const p of G.P)
		if (p.alive && p.id !== WILD) {
			p.ai.sickT = (p.ai.sickT ?? HEALTH.every) - BEAT.health[0];
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
			if (u.owner === p.id && UNIT[u.kind].cls && !u.inside && (dist(u, k) < 500 || depotNear(u))) {
				if (u.sick > G.t) {
					I++;
					plague = plague || u.plague;
				} else S.push(u);
			}
		if (!I || !S.length) continue;
		const N = I + S.length,
			beta = ((HEALTH.R0 * (plague ? HEALTH.plagueR0 : 1)) / HEALTH.sickFor) * BEAT.health[0] * fxv(p.id, 'spread').m,
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
			// a villager working a bush, a field, fish or game eats from it, not from the store (Albert, Nov 1)
			const per = UPKEEP.share, // a share; what each eats of it is fx 'eat' by the unit's keys: cooked food feeds better (hearth, everyone), the Store's ration (soldiers)
				eats = (u) => shareOf(u) * per * fxv(o, 'eat', unitKeys(u.kind)).m;
			let sh = 0;
			for (const u of G.units)
				if (u.owner === o) {
					const n = u.kind === 'vil' && u.job === 'food' && !u.inside ? u.node || u.hunt : null;
					if (n && (n.amt > 0 || n.hp > 0)) {
						if (n.amt > 0 && isFinite(n.amt)) n.amt = Math.max(0, n.amt - eats(u));
					} else sh += eats(u);
				}
			sh = Math.max(0, sh - campEat(o, eats)); // the soldiers in a camp eat from its depot (CAMP)
			const eat = sh;
			p.eats = eat * 60;
			starveTick(p);
			if (p.res.f >= eat) {
				spend(p, 'f', eat, 'upkeep');
				if (p.hungry && p.res.f > 20) {
					p.hungry = false;
					if (o === 0) news('home', 'Your people are fed again.', 'good', TOAST.mid);
				}
			} else {
				spend(p, 'f', p.res.f, 'upkeep'); // what is left is eaten
				if (!p.hungry) {
					p.hungry = true;
					if (o === 0 && foodInReach(0)) news('home', 'Food stores empty: put villagers on food.', 'warn', TOAST.long); // with none in reach the famine toast speaks
				}
			}
		}
}

// the Bank (G): once a minute, interest on the gold held, to BANK_CAP
const BANK_CAP = 40;
function bankTick() {
	for (const p of G.P) {
		if (p.id === WILD || !p.alive) continue;
		const r = fxv(p.id, 'interest').a;
		if (r > 0 && p.res.g > 0) stash(p.id, 'gold', Math.min(BANK_CAP, Math.floor(p.res.g * r)));
	}
}
function econTick(dt) {
	if (G.tick % 30 === 0) {
		natureTick();
		upkeepTick();
		if (G.tick % 1800 === 0) {
			campWearTick(); // a minute of weather on the camps
			bankTick();
		}
	}
	if (every(BEAT.health)) healthTick();
	fireTick(dt);
}

// ── the computers: a Market, one workshop each, caravans with routes, posts on the free stops near them. Saving for an age, it buys none of
// it (D3: about a dozen purchases ignored the saving); a plot's post is staffed only while the plot beats the wild (the plot test, 17-ai)
function aiEconomy(p, k, R, put, has, saving) {
	const o = p.id,
		per = PERS[p.pers];
	if (p.age < 1 || G.t < 200) return;
	for (const b of G.blds)
		if (
			b.owner === o &&
			b.prog >= 1 &&
			b.node &&
			b.node.type !== 'food' &&
			b.node.type !== 'wood' &&
			!(b.node.wk > 0) &&
			(!PLOTS[b.kind] || plotPays(o, b.kind, k))
		) {
			sendVil(o, b.node.id);
			break;
		}
	if (saving) return;
	const A = nextAge(o);
	if (p.age >= VENTURE.age && p.res.g - ((A && A.cost.g) || 0) > 900 && (p.ventures || []).length < 2) venture(o, 250); // a surplus over the next age's gold (D3: 900 was the Gunpowder price itself)
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
	const cs = unitsOf(o, 'caravan');
	if (cs.length + queuedOf(o, 'caravan') < 2 && ready(o, 'market').length && afford(p, UNIT.caravan.cost))
		train(o, 'caravan');
	for (const c of cs)
		if (!c.route && (G.tick + c.id) % 300 < 30) {
			const t = bestTarget(o, c);
			if (t) setRoute(c, t, true, false); // no spice: a computer never sells it, so it bought what it never used (D3)
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
// an order's cost (ORDER): the soldiers' meals from the store, and the tiredness; what it ate, for the toast
function orderCost(o, S) {
	let f = 0;
	for (const u of S) {
		f += shareOf(u) * UPKEEP.share * 60 * ORDER.mins; // a share is UPKEEP.share food a second
		if (isSoldier(u) && !(u.chg > G.t)) u.tired = Math.max(u.tired || 0, G.t + ORDER.tired);
	}
	f = Math.min(Math.round(f), Math.floor(G.P[o].res.f));
	spend(G.P[o], 'f', f, 'orders');
	return f;
}
const hungerOf = (o) => (G.P[o] && (G.P[o].famT || 0) >= STARVE.grace ? UPKEEP.hunger : 1); // full strength for the first two days of a famine

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
const mkt = (k, o) => {
	if (!G.mkt) return 1;
	const m = clamp(Math.max(0.01, G.mkt[k] ?? 1) ** (-1 / PRICE.eps[k]), PRICE.floor, PRICE.cap);
	return o === undefined ? m : 1 + (m - 1) * fxv(o, 'band').m; // the price multiplier from the stock; a side with a Store sees it swing less (fx 'band': the ever-normal granary)
};
function debase(o) {
	// Rome's denarius: more coin at once, worth less for good
	const p = G.P[o];
	if (p.debased || !ready(o, 'mint').length) return false;
	p.debased = true;
	earn(p, 'g', MINT.debase, 'mint');
	if (o === 0) news('trade', `Debased: +${MINT.debase} gold, prices ×${MINT.price} for good.`, 'warn', TOAST.long);
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
		G.mkt[k] = relax(G.mkt[k], aim ** -PRICE.eps[k], PRICE.tau, BEAT.slow[0]); // each slow beat, toward the stock that gives the aimed price
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
	if (o === 0) news('trade', `${amt} gold sent out. Back in a year.`, '', TOAST.mid);
	return true;
}
function ventureTick() {
	for (const p of G.P)
		if (p.ventures && p.ventures.length)
			p.ventures = p.ventures.filter((v) => {
				if (v.due > G.t) return true;
				if (rng() < VENTURE.lost) {
					if (p.id === 0) news('trade', `Robbers took a venture of ${v.amt} gold.`, 'warn', TOAST.mid);
				} else {
					const back = Math.round(shareUp(p.id, v.amt * (VENTURE.back + fxv(p.id, 'venture').a)));
					earn(p, 'g', back, 'venture');
					p.gathered -= v.amt; // only the profit counts as gathered
					if (p.id === 0) news('trade', `A venture comes home: ${back} gold for ${v.amt}.`, 'good', TOAST.mid);
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
			invest += BLD[b.kind].invest ?? VASSAL.invest;
	const n = G.units.filter((u) => u.owner === L && isSoldier(u) && dist(u, k) < r).length,
		garrison = Math.min(VASSAL.garrisonMax, n * VASSAL.garrison);
	const protect = Math.round(p.protect || 0),
		hate = TAX[p.tax || 'fair'].hate * fxv(L, 'hate').m * fxv(L, 'taxhate').m; // a tavern in the lord's town: the tax grumbles less; the Mauryan sixth
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
	news('realm', 
		L === 0 ? `${p.name} kneel: your vassal now.` : `${p.name} became a vassal of ${G.P[L].name}.`,
		L === 0 ? 'good' : '',
		TOAST.long,
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
		if (o === 0) news('realm', why, '', TOAST.mid);
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
		n = Math.ceil(V.length * VASSAL.rise);
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
		news('realm', 
			coalition
				? `Vassals rise: ${n} rebels march on you!`
				: `${p.name} rebel! Crush them in ${VASSAL.freeAfter / 60} min.`,
			'warn',
			TOAST.long,
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
				if (L.id === 0) news('realm', `Rebellion in the lands of ${p.name} crushed.`, 'good', TOAST.long);
			} else if (G.t - p.rebel.t0 > VASSAL.freeAfter) {
				p.rebel = null;
				p.lord = null;
				levyOf(L.id, p.id).forEach(releaseLevy);
				if (L.id === 0) news('realm', `${p.name} have thrown off your rule.`, 'warn', TOAST.long);
			}
			continue;
		}
		for (const u of levyOf(L.id, p.id)) if (!keepOf(L.id)) releaseLevy(u); // a levy serves its lord while the lord stands
		const d = Math.max(0, p.gathered - (p.taxBase || 0));
		p.taxBase = p.gathered; // tax: a share of what they gathered, from their stores
		let take = d * TAX[p.tax].take * (p.forced > G.t ? 2 : 1) * (p.lord !== undefined && p.lord !== null ? fxv(p.lord, 'taxtake').m : 1); // the lord's Satrapies: a fifth more
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
		p.loyal = relax(p.loyal || 0, parts.target, VASSAL.tau, BEAT.slow[0]); // loyalty settles toward what you have earned, 63% of the way in VASSAL.tau
		p.unrest = clamp(
			(p.unrest || 0) + TAX[p.tax].push * fxv(L.id, 'push').m + (p.forced > G.t ? 1 : 0) - p.loyal / 25,
			0,
			100,
		); // magistrates slow the climb
		if (p.loyal >= VASSAL.giftAt && every([VASSAL.gift, BEAT.slow[1]])) {
			const gift = {};
			for (const r of ['f', 'w', 's', 'g', 'i']) {
				const x = Math.floor((p.res[r] * 0.1 * (p.loyal - 50)) / 100);
				if (x > 0) {
					spend(p, r, x, 'tax');
					earn(L, r, x, 'tax');
					gift[r] = x;
				}
			}
			if (L.id === 0 && Object.keys(gift).length) news('realm', `${p.name} send a gift: ${costText(gift)}.`, 'good', TOAST.mid);
		}
		if (L.id === 0 && p.unrest > 70 && G.t - (p.warnT || -99) > 60) {
			p.warnT = G.t;
			news('realm', `${p.name}: unrest ${Math.round(p.unrest)}%. Cut tax.`, 'warn', TOAST.long, keepOf(p.id));
		}
		if (p.unrest >= 100) rebel(p);
	}
	if (G.tick % 1800 === 150)
		for (const L of G.P) {
			// coalition: many restless vassals may rise together
			const V = vassalsOf(L.id).filter((p) => !p.rebel);
			if (V.length < 2) continue;
			const risk = V.reduce((s, p) => s + (p.unrest / 100) ** 2, 0) * 0.08 * V.length;
			if (L.id === 0 && risk > 0.1 && G.t - (L.coalT || -99) > 120) {
				L.coalT = G.t;
				news('realm', 'Talk of revolt spreads among your vassals.', 'warn', TOAST.long);
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
