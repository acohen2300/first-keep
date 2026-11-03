// ═════ 38-natives.js: the Natives and the Throne ═════
// ───────────────────────── The Natives: the fifth side's one brain, and the Throne ─────────────────────────
// Regard is what they think of each side (0..100). It is the one number behind peace, alliance, raids and the gate.
const throneB = () => G.blds.find((b) => b.kind === 'throne' && b.hp > 0) || null;
// where a side or a group is found: the Natives at the Throne; a misfit group at its nearest camp (or its horde) to at
const homeOf = (o, at) => (o === WILD ? throneB() : GANG[o] ? nearest(G.units, at || { x: MID, y: MID }, (v) => v.hp > 0 && gangOf(v) === o) : keepOf(o));
const natState = () => G.nat || (G.nat = { handT: {}, said: {} }); // what is the Natives' own: the handover, the raids, the garrison's regrowth
// Regard (answer 1b): each misfit group (GANG) keeps its own regard for each side, and its own stance with it (the Natives': G.rel).
const gangState = (g) =>
	(G.gang ??= {})[g] ||
	(G.gang[g] = {
		regard: G.P.map(() => REGARD.regard0),
		gifts: G.P.map(() => []),
		warBy: {},
		hitT: {},
		...(g === 'nat' ? {} : { rel: G.P.map(() => 'war') }),
	});
const regardOf = (o, g = 'nat') => gangState(g).regard[o];
function addRegard(o, g, d) {
	const N = gangState(g);
	N.regard[o] = clamp(N.regard[o] + d, 0, 100);
	gangSync(o, g);
}
// a side's stance with a group is set: the Natives through the fifth side's relations, the others in their own list
function gangSet(o, g, want) {
	if (g === 'nat') {
		G.rel[o][WILD] = G.rel[WILD][o] = want;
		G.navDirty = true; // the Natives' gates open to a friend
	} else gangState(g).rel[o] = want;
}
// peace and war follow regard; an alliance needs an emissary and ends the moment regard falls under the line
function gangSync(o, g) {
	if (o === WILD || !G.P[o].alive) return;
	const r = regardOf(o, g),
		rel = gangRel(o, g),
		N = gangState(g);
	if (rel === 'ally' && r < REGARD.allyAt - 10) {
		if (g === 'nat') makePeace(o, WILD);
		else gangSet(o, g, 'peace');
		if (o === 0) news('realm', `The ${GANG[g]} end the alliance: regard fell.`, 'warn', TOAST.mid);
	} else if (rel !== 'ally') {
		if (N.warBy[o] && r >= REGARD.allyAt) N.warBy[o] = false;
		const want = N.warBy[o] ? 'war' : r >= REGARD.peaceAt ? 'peace' : 'war';
		if (want !== rel) {
			gangSet(o, g, want);
			if (o === 0)
				news(
					'realm',
					want === 'peace'
						? `The ${GANG[g]} leave you be: regard above ${REGARD.peaceAt}.`
						: `The ${GANG[g]} turn on you: regard under ${REGARD.peaceAt}.`,
					want === 'peace' ? 'good' : 'warn',
					TOAST.mid,
				);
		}
	}
}
// gifts (bribes): the Danegeld rule, each buys less than the last within the window
const giftsRecent = (o, g) => gangState(g).gifts[o].filter((t) => G.t - t < REGARD.giftWindow).length;
const giftGain = (o, amt, g) => Math.max(1, Math.round(amt / 10 / (1 + REGARD.danegeld * giftsRecent(o, g))));
function giftWhy(o, amt, g) {
	if (g === 'nat' && !throneB()) return 'The Throne is taken.';
	if (G.P[o].res.g < amt) return `Not enough gold: ${amt}.`;
	return null;
}
function giveGift(o, amt, g) {
	if (giftWhy(o, amt, g)) return false;
	const gain = giftGain(o, amt, g);
	spend(G.P[o], 'g', amt, 'tribute');
	gangState(g).gifts[o].push(G.t);
	addRegard(o, g, gain);
	if (o === 0)
		news(
			'realm',
			`${GANG[g]}: ${amt} gold, regard +${gain}${giftsRecent(o, g) > 1 ? '. They expect more' : ''}.`,
			'good',
			TOAST.mid,
		);
	return true;
}
// an emissary to a group: the Natives' answer, copied for every misfit group (Albert, Nov 1; their own logic is v81's)
function judgeGang(g, from, envoy, ask) {
	if (ask !== 'ally') {
		reply(from, envoy, `The ${GANG[g]} answer only to regard, not to words.`);
		return;
	}
	if (regardOf(from, g) < REGARD.allyAt) {
		reply(from, envoy, `The ${GANG[g]} send your emissary back: regard ${Math.round(regardOf(from, g))} of ${REGARD.allyAt}.`);
		return;
	}
	if (g === 'nat') {
		makeAlly(WILD, from);
		reply(from, envoy, 'The Natives accept you. Their gate opens to you.');
	} else {
		gangSet(from, g, 'ally');
		reply(from, envoy, `The ${GANG[g]} accept you as a friend.`);
	}
}
// the citadel's garrison: warriors in the yard, bowmen on the walls; it grows back while the Natives hold the Throne
// Albert's rule: skilled, swift, light and many, with the ground on their side; not brawny, not advanced. Gunpowder is the game-changer: once a side has it, the garrison thins and guns tell
const gunAge = () => G.P.some((p) => p.id !== WILD && p.alive && p.age >= NATIVE.gunAge);
const garrisonMax = () =>
	Math.round(
		(NATIVE.garrison + NATIVE.perAge * Math.max(0, ...G.P.filter((p) => p.id !== WILD && p.alive).map((p) => p.age))) *
			(gunAge() ? NATIVE.gunMax : 1),
	);
function natSpawn(T, kind) {
	const u = addUnit(WILD, kind, T.x + rnd(-30, 30), T.y + 44 + rnd(-6, 6));
	u.hb = T.id;
	u.state = 'home';
	u.native = true;
	return u;
}
const throneHold = () => THRONE.hold * (MODES[G.mode].secs ? MODES[G.mode].secs / 3600 : 1);
// the Throne changes hands: broken down, or sworn over by allied Natives; the walls and towers go with it, the garrison does not
function takeThrone(o, sworn) {
	const T = G.blds.find((b) => b.kind === 'throne' && !b.gone);
	if (!T) return;
	const was = G.throne ? G.throne.owner : WILD;
	T.hp = sworn ? maxHpB(o, 'throne') : maxHpB(o, 'throne') / 3;
	T.mx = maxHpB(o, 'throne');
	T.owner = o;
	T.by = undefined;
	for (const b of G.blds)
		if (b.citadel && b.hp > 0) {
			b.owner = o;
			b.by = undefined;
		}
	for (const u of G.units)
		if (u.native && u.hp > 0) {
			if (sworn) {
				u.owner = o;
				u.native = false;
				u.state = 'home';
			} else {
				u.hp = 0;
				u.gone = true;
			}
		}
	G.throne = { owner: o, since: G.t };
	G.navDirty = true;
	qcDrop();
	news('realm', 
		o === 0
			? sworn
				? 'The Natives swear: the Throne is yours.'
				: 'The Throne is yours. Hold it.'
			: `${G.P[o].name} ${sworn ? 'were sworn' : 'took'} the Throne!`,
		o === 0 ? 'good' : 'warn',
		TOAST.long,
		T,
	);
	sfx(o === 0 ? 'win' : 'horn');
	if (was !== WILD && was !== o && G.P[was]) G.P[was].wave = null;
}
// Traps: hidden buildings (pits, nets, stakes) of any side. A foe who steps on one springs it; a scout within reach finds it for its side, who then step round it;
// allies walk free; a net takes a man, not an engine. The Natives keep four on each causeway and lay fresh ones while they hold the Throne.
const trapAt = (owner, kind, x, y) => {
	const b = mkBld(owner, kind, x, y, 1);
	b.seen = {};
	G.blds.push(b);
	return b;
};
function layTraps() {
	if (!throneB() || (G.throne && G.throne.owner !== WILD)) return;
	for (const [dx, dy] of [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	]) {
		const have = G.blds.filter(
			(b) =>
				BLD[b.kind].trap &&
				b.owner === WILD &&
				b.hp > 0 &&
				Math.sign(Math.round((b.x - MID) / 50)) === dx &&
				Math.sign(Math.round((b.y - MID) / 50)) === dy,
		).length;
		for (let i = have; i < NATIVE.traps; i++) {
			const d = THRONE.r + 20 + rnd(10, LAKE0.r - THRONE.r - 40),
				s = rnd(-THRONE.cause / 2 + 6, THRONE.cause / 2 - 6);
			trapAt(WILD, i % 2 ? 'net' : 'pit', MID + dx * d + dy * s, MID + dy * d + dx * s);
		}
	}
}
function trapsTick() {
	for (const b of G.blds) {
		if (!BLD[b.kind].trap || b.prog < 1 || b.hp <= 0) continue;
		const kind = BLD[b.kind].trap;
		unitsNear(b, NATIVE.scoutSees, (v) => {
			if (
				b.hp <= 0 ||
				v.hp <= 0 ||
				v.fly ||
				v.herd ||
				v.inside ||
				v.owner === b.owner ||
				friendly(v.owner, b.owner) ||
				(v.owner === WILD && !v.horde) ||
				(b.owner === WILD && calm4b(v.owner)) // 4b: the Natives' pits and nets start nothing with a computer
			)
				return;
			if (v.kind === 'scout' && !b.seen[v.owner]) {
				b.seen[v.owner] = 1;
				if (v.owner === 0)
					news('war', 
						`Your scout found ${kind === 'pit' ? 'a pit' : kind === 'net' ? 'a net' : kind === 'caltrops' ? 'caltrops' : 'stakes'} at ${coord(b.x, b.y)}.`,
						'good',
						TOAST.mid,
						b,
					);
				return;
			}
			if (b.seen[v.owner] || dist(v, b) > NATIVE.trapR) return;
			if (kind === 'caltrops') {
				// a square of caltrops takes CALTROPS.hits before it is trodden flat; horse worst, then foot; seen by the side once sprung
				if (G.t - (v.spikeT || -9) < CALTROPS.again) return;
				v.spikeT = G.t;
				const horse = hasTag(v.kind, 'mounted');
				v.hp -= v.max * (horse ? CALTROPS.horse : CALTROPS.foot);
				v.hurtT = G.t;
				v.flashT = G.t;
				if (horse) v.stuck = G.t + CALTROPS.stuck;
				b.hits = (b.hits || 0) + 1;
				b.seen[v.owner] = 1;
				if (b.hits >= CALTROPS.hits) {
					b.hp = 0;
					b.gone = true;
				}
				if (v.owner === 0) news('war', `Caltrops! Your ${UNIT[v.kind].name.toLowerCase()} is hurt${horse ? ' and lamed' : ''}.`, 'warn', TOAST.mid, b);
				else if (b.owner === 0 && (G.tick + b.id) % 90 === 0) news('war', `Your caltrops caught a ${UNIT[v.kind].name.toLowerCase()} of ${G.P[v.owner].name}.`, 'good', TOAST.mid, b);
				return;
			}
			b.hp = 0;
			b.gone = true;
			scarStrike(b.x, b.y);
			if (kind === 'pit') {
				v.hp -= v.max * NATIVE.pit;
				v.hurtT = G.t;
				v.stuck = G.t + NATIVE.stuck;
				if (v.owner === 0) news('war', `A pit! Your ${UNIT[v.kind].name.toLowerCase()} is hurt and stuck.`, 'warn', TOAST.mid, b);
				else if (b.owner === 0)
					news('war', `Your pit took a ${UNIT[v.kind].name.toLowerCase()} of ${G.P[v.owner].name}.`, 'good', TOAST.mid, b);
			} else if (kind === 'stakes') {
				v.hp -= v.max * (hasTag(v.kind, 'mounted') ? 0.45 : 0.25);
				v.hurtT = G.t;
				v.flashT = G.t;
				if (b.owner === 0)
					news('war', `Your stakes caught a ${UNIT[v.kind].name.toLowerCase()} of ${G.P[v.owner].name}.`, 'good', TOAST.mid, b);
			} else if ((isSoldier(v) && !hasTag(v.kind, 'siege')) || v.kind === 'vil') takePrisoner(b.owner, v);
		});
	}
}
// Outlaw raids: every few minutes the camp nearest the side they regard least sends robbers at one of its people, who come back after a spell
function natRaid() {
	// random and fair (Albert, Build 41): none before minute 10 (Easy: 16); then a random wait of 3 to 8 minutes (Hordes and gangs: half that); the band goes to a side at war with the Natives,
	// the less regarded more likely, never the one raided last when another is open; it grows with that side's age
	const N = natState(),
		from = NATIVE.raidFrom + (G.diff === 'easy' ? EASY_SAFE : 0),
		gap = () => rnd(NATIVE.raidGap[0], NATIVE.raidGap[1]) / (hz('horde') ? 2 : 1);
	if (!N.raidAt) N.raidAt = from + gap() / 2;
	if (G.t < N.raidAt) return;
	N.raidAt = G.t + gap();
	let sides = G.P.filter((p) => p.id !== WILD && !calm4b(p.id) && p.alive && keepOf(p.id) && gangRel(p.id, 'rob') === 'war'); // the raiders are robbers: their stance alone decides (Albert, Nov 1); 4b: never a computer
	if (sides.length > 1) sides = sides.filter((p) => p.id !== N.raidLast);
	if (!sides.length) return;
	const q = sides[roulette(sides.map((p) => 1 + (100 - regardOf(p.id, 'rob')) / 25))];
	N.raidLast = q.id;
	const k = keepOf(q.id),
		camps = G.finds
			.filter((f) => f.kind === 'camp' && !f.done && guardsLeft(f))
			.sort((a, b) => dist(a, k) - dist(b, k));
	if (!camps.length) return;
	const f = camps[0],
		R = G.units.filter((u) => u.find === f.id && u.hp > 0 && UNIT[u.kind].dmg).slice(0, NATIVE.raidN + q.age);
	if (!R.length) return;
	// the mark (N16a, Albert: chance weighted toward a load in transport, an army near puts them off, only what they can beat): of the side's
	// villagers and caravans the band beats with their guard by the square law (the canBeat form), each is drawn with p_i = w_i / Σw,
	// w_i = (1 + β·load_i / CARRY) / (1 + γ·guard_i), guard_i the armed strength within GROUP_R of it over the band's (roulette wheel, seeded dice)
	const band = R.reduce((s, u) => s + unitPower(u), 0),
		T = [],
		W = [];
	for (const v of G.units) {
		if (v.owner !== q.id || v.hp <= 0 || v.inside || (v.kind !== 'vil' && v.kind !== 'caravan')) continue;
		let guard = 0;
		unitsNear(v, GROUP_R, (s) => {
			if (s.owner === v.owner && isSoldier(s) && s.hp > 0 && !s.inside) guard += unitPower(s);
		});
		if (lanchester(band / Math.max(1e-6, unitPower(v) + guard)) <= 0.5) continue;
		const load = (v.carry || 0) + Object.values(v.goods || {}).reduce((a, b) => a + b, 0);
		T.push(v);
		W.push((1 + (NATIVE.raidLoad * load) / CARRY) / (1 + (NATIVE.raidGuard * guard) / band));
	}
	if (!T.length) return;
	const mark = T[roulette(W)];
	for (const u of R) {
		u.camp = { x: u.hx, y: u.hy };
		u.hx = mark.x;
		u.hy = mark.y;
		u.aggro = mark;
		u.horde = true;
		u.back = G.t + NATIVE.raidSecs;
	}
	if (q.id === 0)
		news('war', `Robbers ride for your ${(BLD[mark.kind] ? bldName(0, mark.kind) : UNIT[mark.kind].name).toLowerCase()} (${coord(mark.x, mark.y)}).`, 'warn', TOAST.long, mark);
}
function nativesTick(dt) {
	if (G.tick % 10 === 5) trapsTick();
	if (G.tick % (NATIVE.relay * 30) === 900) layTraps(); // fresh traps for the Natives, every relay
	for (const u of G.units)
		if (u.back && G.t > u.back) {
			u.back = 0;
			u.horde = false;
			if (u.camp) {
				u.hx = u.camp.x;
				u.hy = u.camp.y;
			}
		} // raiders go home
	if (!every(BEAT.natives)) return; // the rest on the slow beat
	const N = natState(),
		T = throneB(),
		held = G.throne && G.throne.owner !== WILD;
	for (const g in GANG) {
		const R = gangState(g);
		for (const p of G.P)
			if (p.id !== WILD && p.alive) {
				R.regard[p.id] += (((REGARD.regard0 - R.regard[p.id]) * REGARD.decay) / 100) * BEAT.natives[0];
				gangSync(p.id, g);
			}
	}
	for (const c in G.struck || {}) {
		for (const id in G.struck[c]) if (G.t - G.struck[c][id] >= NATIVE.struck) delete G.struck[c][id];
		if (!Object.keys(G.struck[c]).length) delete G.struck[c];
	} // 4b: a camp forgets who struck it after a minute
	if (
		T &&
		!held &&
		G.units.filter((u) => u.native && u.hp > 0).length < garrisonMax() &&
		G.t - (N.grewT || 0) > NATIVE.regrow * (gunAge() ? NATIVE.gunRegrow : 1)
	) {
		N.grewT = G.t;
		natSpawn(T, rng() < 0.4 ? 'nativebow' : 'native');
	}
	natRaid();
	prisonersTick();
	// the sworn handover: an ally with soldiers inside for a minute
	if (T && !held)
		for (const p of G.P)
			if (p.id !== WILD && p.alive && G.rel[p.id][WILD] === 'ally') {
				const n = G.units.filter((u) => u.owner === p.id && isSoldier(u) && dist(u, T) < THRONE.r).length;
				if (n >= NATIVE.handoverMen) {
					N.handT[p.id] = (N.handT[p.id] || 0) + BEAT.natives[0];
					if (p.id === 0 && N.handT[0] === BEAT.natives[0])
						news('realm', `Hold ${NATIVE.handoverMen} inside ${NATIVE.handover} s: they swear to you.`, 'good', TOAST.mid);
					if (N.handT[p.id] >= NATIVE.handover) takeThrone(p.id, true);
				} else N.handT[p.id] = 0;
			}
	// the holder's score and the clock
	if (held && G.P[G.throne.owner].alive)
		G.P[G.throne.owner].gathered += (THRONE.score * SCORE.wealth * BEAT.natives[0]) / 60; // THRONE.score a minute, as wealth, a beat's share
}
