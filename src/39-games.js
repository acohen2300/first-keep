// ═════ 39-games.js: peace as a path (Build 57) ═════
// Albert, Oct 29: "Why is it just war?" and "I build to match life. They decide." One module for everything that rewards a board at peace:
// the board truce, the price of a truce, standing down, the Games on the Throne island, the hidden age that only a full truce opens,
// the three crowns and the chronicle that ends a match. Every number sits in PEACE; every date is in WHY.
const PEACE = {
	truce: { gold: 120, odds: 2 }, // tribute buys peace from a side that wants more war: gold × (1 + odds × their odds), rounded to 10 (Danegeld, 991)
	stand: { after: 90, keep: 0.5 }, // after 90 s of board truce a computer sends the soldiers above half its army cap home to the fields
	games: {
		every: 2 * YEAR, // the Olympiad: every second year (776 BC on, every four; the game's year is 12 minutes)
		first: YEAR, // none in the first year: nobody has anyone to send
		events: [
			// each event asks one number of a side, the best it has in the field; the winner is rolled on the square of it (the square law, as battle)
			{ id: 'stadion', name: 'the footrace', of: (o) => bestOf(o, (s) => s.spd) },
			{ id: 'pale', name: 'the wrestling', of: (o) => bestOf(o, (s) => (s.rng <= 20 ? s.dmg * s.hp : 0)) },
			{ id: 'akon', name: 'the javelin', of: (o) => bestOf(o, (s) => (s.rng > 20 ? s.dmg * s.rng : 0)) },
			{ id: 'tethrippon', name: 'the chariot race', of: (o) => bestOf(o, (s) => (s.mounted ? s.spd * s.hp : 0)) },
		],
	},
	age: { truce: YEAR }, // the hidden age opens for every side once the whole board has kept the peace for one year
	crown: { bld: 8, laurel: 5, people: 1 }, // the Wellbeing crown: people × health, plus each place of care or recreation, plus each laurel
	chron: 80, // lines kept in the chronicle
};
const CARE = ['hospital', 'temple', 'baths', 'theatre', 'tavern']; // what counts as care for the Wellbeing crown
// the best a side has of some measure, over the soldier kinds it has alive (a side with no soldiers sends its villagers: 1)
function bestOf(o, f) {
	let best = 0;
	const seen = new Set();
	for (const u of G.units) {
		if (u.owner !== o || u.hp <= 0 || !isSoldier(u) || seen.has(u.kind)) continue;
		seen.add(u.kind);
		const s = stats(o, u.kind);
		best = Math.max(best, f({ ...s, mounted: (UNIT[u.kind].tags || []).includes('mounted') }) || 0);
	}
	return best || 1;
}
const livingSides = () => G.P.filter((p) => p.alive && p.id !== WILD);
// a board truce: no two living courts at war, and no notice running
function truceAll() {
	const L = livingSides();
	for (const a of L) for (const b of L) if (a.id < b.id && (atWar(a.id, b.id) || noticeLeft(a.id, b.id) || noticeLeft(b.id, a.id))) return false;
	return true;
}
const truceFor = () => (G.truce === null ? 0 : G.t - G.truce); // seconds the whole board has been at peace
const ageOpen = (n) => !AGES[n] || !AGES[n].hidden || G.enlight; // the hidden age, once opened, stays open for every side
const nextAge = (o) => (ageOpen(G.P[o].age + 1) ? AGES[G.P[o].age + 1] || null : null);
function chron(text) {
	(G.chron || (G.chron = [])).push({ t: Math.round(G.t), text });
	if (G.chron.length > PEACE.chron) G.chron.shift();
}
// once a second from the simulation: the truce clock, the hidden age, standing down, the Games
function peaceTick() {
	const was = G.truce;
	if (truceAll()) {
		if (G.truce === null) {
			G.truce = G.t;
			if (G.t > 30) {
				say('The whole board is at peace.', 'soft', 6);
				chron('The whole board at peace.');
			}
		}
	} else if (G.truce !== null) {
		G.truce = null;
		G.stood = false;
	}
	if (!G.enlight && truceFor() >= PEACE.age.truce) {
		G.enlight = true;
		say(`A year of peace: the ${AGES[5].name} opens.`, 'good', 9);
		chron(`A year of peace opened the ${AGES[5].name}.`);
	}
	if (G.truce !== null && !G.stood && truceFor() >= PEACE.stand.after) {
		G.stood = true;
		for (const p of livingSides()) if (p.id !== 0) standDown(p.id, true);
	}
	if (G.t >= PEACE.games.first && G.t - (G.gamesT ?? 0) >= PEACE.games.every) {
		G.gamesT = G.t;
		holdGames();
	}
	if (was === null && G.truce !== null) fxDirty();
}
// soldiers above the keep share go home and take up the villager's tools; the room they held is freed (demobilisation, as every peace since Rome)
function standDown(o, quiet) {
	const p = G.P[o],
		k = keepOf(o),
		S = soldiersOf(o).filter((u) => u.state === 'home' && !u.inside),
		keep = Math.ceil((o === 0 ? soldiersOf(0).length : armyCap(p)) * PEACE.stand.keep), // yours: half of what you have (Build 63: it was half the ceiling, 60, so nothing stood down)
		go = S.slice(keep);
	if (!k || !go.length) return 0;
	let n = 0;
	for (const u of go) {
		if (clsCount(o, 'civ') >= clsMax('civ', o)) break; // one for one, so housing never stops it; the worker limit does (Build 60: it checked the houses and not the limit)
		u.hp = 0;
		u.gone = true;
		const v = addUnit(o, 'vil', u.x, u.y);
		if (v) {
			v.job = o === 0 ? p.rally : null; // to your gathering job, as a new villager goes; a computer's think gives its own
			n++;
		}
	}
	if (n) {
		if (o === 0) say(`${n} soldiers stood down to work.`, 'good', 6);
		else if (!quiet) say(`${p.name} stood down ${n} soldiers.`, '', 4);
		chron(`${o === 0 ? 'You' : p.name} stood down ${n} soldiers.`);
	}
	return n;
}
// the Games: held on the Throne island under the truce of the whole board, as the ekecheiria held Olympia; war cancels them
function holdGames() {
	const L = livingSides();
	if (L.length < 2) return;
	if (!truceAll()) {
		say('No Games this year: war.', '', 5);
		chron('The Games were not held: war.');
		return;
	}
	const won = [];
	for (const ev of PEACE.games.events) {
		const w = L.map((p) => {
			const v = ev.of(p.id);
			return v * v;
		});
		let r = rng() * w.reduce((a, b) => a + b, 0),
			i = 0;
		while (i < L.length - 1 && r >= w[i]) r -= w[i++];
		const p = L[i];
		p.laurels = (p.laurels || 0) + 1;
		won.push(`${p.id === 0 ? 'you' : p.name} ${ev.name}`);
	}
	G.gamesN = (G.gamesN || 0) + 1;
	const mine = won.filter((w) => w.startsWith('you')).length;
	chron(`The Games at the Throne: ${won.join(', ')}.`);
	say(`The Games: ${mine ? mine + (mine === 1 ? ' laurel' : ' laurels') + ' for you' : 'no laurel for you'}.`, mine ? 'good' : 'soft', 8, { x: MID, y: MID });
	celebrate(3, MID, MID);
	if (mine) sfx('age');
}
// the three crowns and the overall: Wealth is all a side ever gathered and holds; War is its kills; Wellbeing is its people in health, its care and its laurels
function crownsOf() {
	const L = G.P.filter((p) => p.id !== WILD),
		val = {
			wealth: (p) => Math.round(p.gathered + Object.values(p.res).reduce((a, b) => a + b, 0)),
			war: (p) => p.kills || 0,
			wellbeing: (p) =>
				Math.round(
					(p.alive ? G.units.filter((u) => u.owner === p.id && UNIT[u.kind].cls === 'civ').length * PEACE.crown.people * (p.health / 100) : 0) +
						(p.alive ? G.blds.filter((b) => b.owner === p.id && b.hp > 0 && b.prog >= 1 && CARE.includes(b.kind)).length * PEACE.crown.bld : 0) +
						(p.laurels || 0) * PEACE.crown.laurel,
				),
		},
		pts = Object.fromEntries(L.map((p) => [p.id, 0])),
		out = {};
	for (const c in val) {
		const R = L.map((p) => ({ id: p.id, v: val[c](p) })).sort((a, b) => b.v - a.v);
		R.forEach((r, i) => (pts[r.id] += r.v > 0 ? L.length - 1 - i : 0));
		out[c] = R;
	}
	scoreAll();
	out.overall = L.map((p) => ({ id: p.id, v: pts[p.id], tie: p.score.total })).sort((a, b) => b.v - a.v || b.tie - a.tie);
	return out;
}
const CROWN_NAME = { wealth: 'Wealth', war: 'War', wellbeing: 'Wellbeing' };
function crownsHTML() {
	const C = crownsOf(),
		nm = (id) => (id === 0 ? 'You' : G.P[id].name),
		unit = { wealth: '', war: ' kills', wellbeing: '' };
	let h = '<div class="crowns">';
	for (const c of ['wealth', 'war', 'wellbeing']) {
		const r = C[c][0];
		h += `<p><b>${CROWN_NAME[c]}</b> ${r.v > 0 ? `${nm(r.id)} · ${fmt(r.v)}${unit[c]}` : 'no one'}</p>`;
	}
	h += `<p><b>Overall</b> ${nm(C.overall[0].id)}</p></div>`;
	if (G.chron && G.chron.length)
		h += `<details><summary>Chronicle · ${G.chron.length}</summary>${G.chron.map((c) => `<p><small>${clock(c.t)}</small> ${c.text}</p>`).join('')}</details>`;
	return h;
}
// the last step of the hidden age ends the match for everyone: the crowns are pointed to, and play can carry on
function enlightenTick(o) {
	if (!AGES[5] || G.P[o].age < 5 || G.over || G.free) return;
	const last = TECH.filter((t) => t.age === 5 && !t.civ);
	if (!last.every((t) => G.P[o].techs.has(t.id))) return;
	chron(`${o === 0 ? 'You' : G.P[o].name} finished the ${AGES[5].name}.`);
	finish(true, `${o === 0 ? 'You' : G.P[o].name} finished the ${AGES[5].name}. Everyone wins; the crowns say who won what.`, true);
}
// a personality chases its crown: the war chaser breaks truces, the wealth chaser trades, the wellbeing chaser builds care; under a board truce only the war chaser declares
function chaseCrown(p, put) {
	const per = PERS[p.pers],
		o = p.id,
		has = (kind) => bldsOf(o, kind).length;
	if (per.crown === 'wellbeing')
		for (const kind of CARE) if (p.age >= BLD[kind].age && !has(kind) && afford(p, BLD[kind].cost) && put(kind)) break;
	if (G.enlight && p.age === 4 && !p.aging) ageUp(o); // every court takes the hidden age when it opens
	if (p.age === 5) {
		// and runs its six steps: the match is a race to the last of them
		if (!has('library')) put('library');
		else for (const t of TECH) if (t.age === 5 && !t.civ && isNext(o, t) && research(o, t.id)) break;
	}
}
