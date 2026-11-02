// ═════ 29-card-pages.js: what a building adds to its card: market, council, workshop and the rest ═════
// ───────────────────────── What a building's page says, by kind ─────────────────────────
// A building's card (MENU-SPEC §8): an info rank (what it holds or does, health, age), its line, its techs, Help · Repair · Raze. What a kind
// adds is one entry here, never a branch in the page: fact, the first cell of the info rank ([value, label]); book, its explaining text,
// behind the book icon; page, the slots it adds. Every number on the face is a value in a cell; every sentence goes to the book.
const BLD_PAGE = {
	castle: (b) => {
		const n = G.units.filter((u) => u.owner === 0 && isSoldier(u) && u.hp < u.max && dist(u, b) < GARRISON.r).length;
		return { fact: [`${n} mending`, `heals ${GARRISON.heal * fxv(0, 'garrison').m} a second`] };
	},
	school: () => ({
		fact: [
			`${schooling(0)} of ${TEACH.seats * ready(0, 'school').length} seats`,
			fxv(0, 'teach').a < 1 ? 'research Veterans first' : 'tap a soldier, then Teach',
		],
		book: '<p>Research Veterans at the Barracks to send soldiers here; then tap a soldier and Teach.</p>',
	}),
	farm: (b) => ({
		fact: [
			b.node && b.node.wk > 0 ? `${slotText(b.node)} at work` : 'Nobody at work',
			`${season().name} ×${season().farm} · soil ${Math.round((b.fert ?? 1) * 100)}%`,
		],
		book:
			`<p>This season: ${season().name}, ×${season().farm}${G.harvest !== 1 ? ` · the harvest this year ×${G.harvest}` : ''}${WEATHER[G.wx].crop ? ` · ${WEATHER[G.wx].name.toLowerCase()} ×${WEATHER[G.wx].crop}` : ''}. Tap Send a villager${b.node && b.node.type === 'food' ? ', or + under Food' : ''}.</p>` +
			(b.node ? yieldText(b.node, 0) : ''),
	}),
	treefarm: (b) => ({
		fact: [
			`${Math.round(b.node ? b.node.amt : 0)} wood left`,
			b.node && b.node.wk > 0 ? `${slotText(b.node)} tending` : 'nobody tending',
		],
		book: '<p>Tended by the villagers you send, or + under Wood. When its wood is gone the plot is cut out: replant it at half the cost.</p>',
	}),
	pasture: (b) => ({
		fact: [
			`${b.sheep || 0} sheep`,
			`${b.node && b.node.wk > 0 ? `${Math.round((b.sheep || 0) * BLD.pasture.milk * 60 * gatherMul(0, b.node))} food a minute` : 'nobody tends them'} · ${Math.floor(b.node ? b.node.amt : 0)} wool`,
		],
		book: `<p>Milk and meat while tended; wool to bring in${ready(0, 'workshop').length ? '' : ', which waits for a Workshop'}. Shorn each spring, when lambs come too.</p>`,
	}),
	throne: () => {
		const T = G.throne;
		return {
			fact: T
				? [
						`${clock(Math.max(0, throneHold() - (G.t - T.since)))} to ${T.owner === 0 ? 'win' : 'their win'}`,
						`${T.owner === 0 ? 'yours' : G.P[T.owner].name} since ${clock(T.since)}`,
					]
				: ['The Natives hold it', 'regard opens its gate'],
			book: `<p>Regard opens its gate; siege breaks it. Who holds it takes a tithe of ${THRONE.tithe * 100}% of the gathering of everyone else, and ${THRONE.score} score a minute.</p>`,
		};
	},
	tpost: (b) => {
		const f = byId(G.finds, b.sid);
		return f ? { fact: [`Holds ${coord(f.x, f.y)}`, 'tap the stop for prices'] } : {};
	},
	council: () =>
		hasCmd()
			? {
					page: list(
						BN.map((n, j) => btn(`wsq:${j}`, n, `${armyOf(0).filter((u) => u.kind !== 'spy' && u.bn === j).length} in it`)),
					), // each opens its card, where it is built (39-huddle); four are two and two
					book: `<p>New soldiers fill each squad up to what you set on its card; the rest are the reserve. Send them from the War page with Go.</p><p><b>Shape:</b> ${FORM.map((F) => `${F.name}: ${F.note}`).join('. ')}.</p>`,
				}
			: {
					fact: ['No squads yet', G.P[0].techs.has('engage') ? 'next: Battalions' : 'first: Engagement'],
					book: `<p>${G.P[0].techs.has('engage') ? 'Temper is open: set it in the Army card. Next: Battalions, four squads.' : 'Research Engagement first: shooters step back. Then Battalions, Formations and Muster.'}</p>`,
				},
	market: (b) => marketPage(b),
	mint: () =>
		G.P[0].debased
			? { fact: ['Coin debased', `Market prices ×${MINT.price}`] }
			: {
					page: acts(
						btn(
							'debase',
							'Debase the coin',
							`+${MINT.debase} gold now · Market prices ×${MINT.price} for good`,
							'warn',
						),
						'c1',
					),
				},
};
// the first cell of a building's info rank: going up, burning, a wonder's clock, or what its kind says; else the room it gives
function factOf(b, X, crew) {
	const B = BLD[b.kind];
	if (b.prog < 1) return [`Building ${Math.round(b.prog * 100)}%`, '']; // who works it, Send a villager says
	if (b.owner === 0 && b.fire > 0) return ['On fire', `${crew.length} with buckets`];
	if (G.wonder && G.wonder.id === b.id)
		return [`${clock(Math.max(0, G.wonder.end - G.t))} to ${b.owner === 0 ? 'win' : 'their win'}`, 'the wonder stands'];
	return X.fact || (B.room ? [`Room for ${B.room}`, ''] : null);
}
// the info rank: the fact as a sentence (four slots), then health and age a slot each; with no fact, health and age take two triples (no
// holes). Whole slots (E9: they were one and a half)
function infoRank(b, f) {
	const s = f ? 's1' : 's3';
	return acts(
		(f ? info(f[0], f[1], 'left line s4') : '') +
			info(`${Math.round(b.hp)}/${Math.round(maxHpB(b.owner, b.kind))}`, 'health', s) +
			info(AGES[BLD[b.kind].age || 0].name, 'age', s),
	);
}
// A building's line (MENU-SPEC §3, §8): a fixed capacity, one single a place, the first working (its green ring what is left of it, red when
// it cannot go on: no room, or sabotage). Tap a filled one and its order is cancelled, its cost back; an empty place is a faint outline.
// Six singles a rank: past six the last reads +n (a tap cancels the last order); short of six, the place a research would add reads +n, locked.
function slotsHTML(b) {
	const n = qMax(0),
		q = b.q,
		cells = [],
		stop = b.blocked ? 'needs room' : b.stall > G.t ? `sabotage ${Math.ceil(b.stall - G.t)} s` : '';
	let t = 0;
	for (let i = 0; i < Math.min(n, 6); i++) {
		const j = q[i];
		if (i === 5 && q.length > 6) {
			cells.push(
				`<button class="slot" data-act="qcancel:${b.id},${q.length - 1}" aria-label="Cancel the last order"><b>+${q.length - 5}</b><small>more</small></button>`,
			);
			break;
		}
		if (!j) {
			cells.push(empty());
			continue;
		}
		t += i ? j.total : j.left;
		cells.push(
			`<button class="slot${i ? '' : stop ? ' warn' : ' work'}" data-act="qcancel:${b.id},${i}"${i ? '' : ` style="${toGo(j.left / j.total)}"`} aria-label="Cancel ${qName(j)}"><b>${qName(j)}</b><small>${i || !stop ? clock(t) : stop}</small></button>`,
		);
	}
	const more = n < 6 && TECH.find((t) => (t.fx || []).some((f) => f.s === 'queue') && !G.P[0].techs.has(t.id)); // the next places, locked: a tap says how to open them
	if (more)
		cells.push(
			`<button class="slot dis" data-act="qlock:${more.id}" aria-label="More places: ${more.name}"><b>+${more.fx.find((f) => f.s === 'queue').a}</b><small>${more.short || more.name}</small></button>`, // the research that opens them, by name ("+2 Guilds", cold review of v70)
		);
	return acts(cells.join(''), 'c6 queue'); // the queue's steel box (Q1)
}
// Relations, at the Town Center (v80, Albert Oct 31: "we are locking into the final"; picture Relations Final; decision 3: a ✓ for each
// row): one rank a side. The name, its stance under it in the stance's colour; the gift, a slider with its switch (a bribe is a step for
// anyone not a friend, so a friend's gift is locked; the misfit groups take one, the computers none); the stance, three icons in two slots;
// the row's ✓. What is picked waits on the card (G.relPick) until that row's ✓ sends it: the picked icon wears the gold ring, the stance
// held now stays in the name's colour, and the ✓ turns blue. The last rank says what the last ✓ touched will do, and the board
// Two pages (answers 1 and 1b, Albert Nov 1; picture Relations Misfits): Relations, the computers, a stance only (no gifts to rivals); Misfits,
// the Natives (WILD) and the outlaws, bandits and robbers (by their GANG key), each a bribe and a stance
const relSides = () => G.P.filter((q) => q.id !== 0 && q.id !== WILD && q.alive).map((q) => q.id);
const MISFITS = [WILD, 'out', 'ban', 'rob'];
const relKey = (a) => (GANG[a] ? a : Number(a)); // a row's key from a verb: a group's key, or a side's number
// a side whose stance is not yours to pick here: your vassal (their own page) or your overlord
const relLord = (q) => !gangKey(q) && ((G.P[q].lord === 0 && !G.P[q].rebel) || (G.P[0].lord === q && !G.P[0].rebel));
const relName = (q) => (gangKey(q) ? GANG[gangKey(q)] : G.P[q].name);
// a stance this row cannot take, so its icon is dim and a tap on it picks nothing: your vassal or overlord (their own page). Every misfit
// group can be pushed to friend, as the Natives (Albert, Nov 1), so none of theirs is dim
const stanceOff = (q) => relLord(q);
const relOf = (q) => (gangKey(q) ? gangRel(0, gangKey(q)) : G.rel[0][q]); // the stance held now
const giftLock = (q) => (!gangKey(q) ? 'No gifts to rivals.' : relOf(q) === 'ally' ? 'A gift to a friend is locked.' : null);
// what the row's ✓ would send: [gift or 0, stance or null], and why it cannot, or null
function relDraft(q) {
	const d = (G.relPick || {})[q] || {},
		rel = relOf(q),
		gift = d.on && d.gift > 0 && !giftLock(q) ? d.gift : 0,
		want = d.want && d.want !== rel ? d.want : null;
	return [gift, want, (gift && giftWhy(0, gift, gangKey(q))) || (want && relWhy(0, q, want)) || null];
}
const relPickOf = (q) => {
	G.relPick = G.relPick || {};
	G.relPick.last = q;
	return G.relPick[q] || (G.relPick[q] = {});
};
function relRow(q) {
	const g = gangKey(q),
		rel = relOf(q),
		d = (G.relPick || {})[q] || {},
		lord = relLord(q),
		lock = giftLock(q),
		[gift, want, why] = relDraft(q),
		nl = g ? 0 : noticeLeft(0, q) || noticeLeft(q, 0),
		war = !lord && nl, // under notice: the stance it is becoming, and when
		word = lord ? (G.P[q].lord === 0 ? 'vassal' : 'overlord') : war ? `${REL_WORD.war.toLowerCase()} in ${nl} s` : REL_WORD[rel],
		sw = (k) => `<span class="stance-${k}">${REL_WORD[k]}</span>`,
		// a stance picked and not yet sent: the change, each word in its stance's colour (Albert, Nov 1); once sent, the new stance alone
		// (a Misfits row's name is one slot: the change takes two lines there, "Foe →" over "Neutral", so it fits at 375)
		line =
			want && !lord && !war
				? g
					? `<small class="chg">${sw(rel)} →</small><small class="chg">${sw(want)}</small>`
					: `<small class="chg">${sw(rel)} → ${sw(want)}</small>`
				: `<small class="${lord ? '' : 'stance-' + (war ? 'war' : rel)}">${word}</small>`;
	return acts(
		`<div class="info left line ${g ? 's1' : 's3'}"><b>${relName(q)}</b>${line}</div>` +
			(g
				? slt(`relon:${q}`, `relgift:${q}`, 'Bribe', lock ? '—' : `${d.gift || 0}g`, lock ? 0 : d.gift || 0, REGARD.giftMax, REGARD.giftStep, d.on, !!lock)
				: '') +
			choice(
				Object.keys(REL_WORD).map((k) => [
					`relwant:${q},${k}`,
					ICON[k],
					(d.want || rel) === k,
					`stance-${k}${stanceOff(q, k) ? ' dis' : ''}`,
					REL_WORD[k],
				]),
				's2',
				true,
				'thin', // three icons in two slots: under 44 each (EXCEPTIONS #13)
			) +
			sym(`relok:${q}`, ICON.ok, gift || want ? (why ? 'dis' : 'go') : 'dis', `Send to the ${relName(q)}`),
		'c6',
	);
}
// what the last ✓ touched will do, in a line; and the board: at peace or not, the Games, the Natives' regard
function relStatus(mis) {
	const q = (G.relPick || {}).last,
		tf = truceFor(),
		next = Math.max(0, PEACE.games.every - (G.t - (G.gamesT ?? 0))),
		board = mis
			? `regard ${MISFITS.map((k) => Math.round(regardOf(0, gangKey(k)))).join(' · ')}, peace at ${REGARD.peaceAt}` // the rows' order
			: `${G.truce === null ? 'not at peace' : `at peace ${clock(tf)}`} · ${next > 0 ? `Games in ${clock(next)}` : 'Games at the next peace'}`;
	let line = mis ? 'Pick a bribe or a stance, then its ✓' : 'Pick a stance, then its ✓';
	if (q !== undefined && (mis ? MISFITS.includes(q) : !gangKey(q))) {
		const [gift, want, why] = relDraft(q);
		if (why) line = `${relName(q)}: ${why.replace(/\.$/, '')}`;
		else if (gift || want)
			line = `${relName(q)}: ${[gift ? `send ${gift}g` : '', want ? REL_WORD[want].toLowerCase() : ''].filter(Boolean).join(' · ')}`; // the stance in its one word (REL_WORD)
	}
	return acts(info(line, board, 'left line'), 'c1');
}
function relHTML(mis) {
	const spare = Math.max(
			0,
			soldiersOf(0).filter((u) => u.state === 'home' && !u.inside).length - Math.ceil(soldiersOf(0).length * PEACE.stand.keep),
		),
		P = (G.prisoners || []).filter((x) => x.o === 0),
		H = (G.prisoners || []).filter((x) => x.by === 0);
	fold(
		'about',
		'About',
		`<p><b>The sides:</b> ${relSides()
			.map((q) => `${G.P[q].name}, ${G.P[q].civ ? CIVS[G.P[q].civ].name : 'no people'}${G.P[q].ally !== null && G.P[q].ally !== undefined && G.P[q].ally !== 0 ? `, with ${G.P[G.P[q].ally].name}` : ''}`)
			.join('; ')}.</p>` +
			`<p><b>Misfits:</b> the Natives, the outlaws (the horde), the bandits and the robbers each keep their own regard for you. A bribe raises it, each buying less than the last for ${REGARD.giftWindow / 60} minutes; blows on them lower it. At ${REGARD.peaceAt} they leave you be; under it they are foes. At ${REGARD.allyAt} an emissary can make any of them a friend; a bribe to a friend is locked. Animals are foes to all. No gifts to rivals.</p>` +
			`<p><b>Stance:</b> neutral keeps both swords sheathed; a foe after ${NOTICE} s of notice (a misfit group at once, for ${REGARD.warCost} regard); a friend needs their yes, carried by an emissary.</p>` +
			`<p><b>The board:</b> ${G.enlight ? `the ${AGES[5].name} is open.` : `a year of peace opens the ${AGES[5].name}${G.truce === null ? '' : ` (${clock(Math.max(0, PEACE.age.truce - truceFor()))} to go)`}.`} Laurels: ${G.P[0].laurels || 0}.</p>` +
			(H.length
				? `<p><b>You hold ${H.length}:</b> ${H.map((x) => `a ${UNIT[x.kind].name.toLowerCase()} of ${G.P[x.o].name}`).join(', ')}. Unransomed in ${PRISON.secs / 60} minutes, they serve you.</p>`
				: ''),
	);
	return (
		(mis ? MISFITS : relSides()).map(relRow).join('') +
		relStatus(mis) +
		list([
			...P.map((x, i) =>
				btn(
					`ransom:${i}`,
					`Ransom ${UNIT[x.kind].name.toLowerCase()}`,
					`${x.ransom}g · ${x.by === WILD ? 'Natives' : G.P[x.by].name} · ${clock(Math.max(0, x.t + PRISON.secs - G.t))}`,
					G.P[0].res.g >= x.ransom ? 'warn' : 'dis',
				),
			),
			spare ? btn('stand', 'Stand down', `${spare} spare soldiers to the fields`, 'warn') : '',
		].filter(Boolean))
	);
}
// a workshop turns what is in store into goods: the same page for every one of them. The making is a slot of its own, its green ring the
// share of the next one still to go; what it makes is a picker, the chosen one gold. The count made and the store are the fact
function workshopPage(b) {
	const p = G.P[0],
		B = BLD[b.kind],
		cur = b.cropT || B.crop,
		mk = B.makes[cur],
		[k, r] = Object.entries(mk.from)[0],
		low = (a) => (GOODS[a] ? GOODS[a].name.toLowerCase() : LONG[a]),
		nm = (t) => (GOODS[t] ? GOODS[t].name : (RESOURCES[t] || RESOURCES[LONG[t]]).name),
		keys = Object.keys(B.makes),
		w = G.units.find((u) => u.owner === 0 && u.node === b.node),
		made = b.made || 0,
		fr = made % 1; // the next one, part made
	return {
		fact: [
			`${Math.floor(made)} made`,
			`${Math.floor(k in p.res ? p.res[k] : p.goods[k] || 0)} ${low(k)} in store`,
		],
		book: `<p>${r} ${low(k)} make one ${nm(cur).toLowerCase()}; ${Math.round(mk.rate * 60 * fxv(0, 'make', [cur]).m)} a minute when worked.</p>`,
		page: list([
			`<button class="${w ? 'work' : 'dis'}" disabled style="${toGo(1 - fr)}"><b>${nm(cur)}</b><small>${!w ? 'nobody yet' : w.wait ? `waiting for ${low(k)}` : w.inside ? 'making' : 'walking in'}</small></button>`,
			...(keys.length > 1
				? keys.map((t) =>
						btn(
							`make:${b.id},${t}`,
							nm(t),
							`${Object.entries(B.makes[t].from)
								.map(([a, q]) => q + ' ' + low(a))
								.join(', ')} make 1`,
							t === cur ? 'on' : '',
						),
					)
				: []),
		]),
	};
}
// the Market (MENU-SPEC §8, picture Market Card; v80 keeps v70's layout, no new drawing): on the shared building page (E11: it had skipped
// it, so a burning Market had no Send help and no health); its fact the caravans; the goods one selector with what you have, the picked
// one gold; its price, one Sell and one Buy for it; ventures from their age
function marketPage(b) {
	const p = G.P[0],
		V = p.ventures || [],
		k = MKT_SELL.includes(G.mktK) ? G.mktK : MKT_SELL[0],
		nm = (g) => (GOODS[g] ? GOODS[g].name : RESOURCES[LONG[g]].name),
		cv = unitsOf(0, 'caravan').length,
		buy = MKT_BUY.includes(k);
	return {
		fact: [`${cv} ${some(cv, 'caravan')}`, V.length ? `${V.length} ${some(V.length, 'venture')} out` : 'tap a good, then Sell or Buy'],
		book: `<p>Sell or buy a lot at a time: 100 of a resource, 10 of a good. Prices rise and fall with what everyone buys and sells.</p><p>Two lanes. One: a caravan with a route takes goods from here to a trade stop and sells them. Two: a caravan with no route runs to an ally's Market or Town Center and earns distance² ÷ ${TRADE_DIV}, at most ${TRADE_CAP} gold. ${allyMarket(0, b) ? 'An ally to trade with.' : 'No ally yet.'}</p><p>${p.age < VENTURE.age ? `From the ${AGES[VENTURE.age].name} age: put gold into a merchant venture.` : `A venture comes back in a year with ${Math.round((VENTURE.back - 1) * 100)}% more; about 1 in ${Math.round(1 / VENTURE.lost)} is lost.`}${V.length ? ' Out: ' + V.map((v) => `${v.amt}g (${clock(Math.max(0, v.due - G.t))})`).join(', ') + '.' : ''}</p>`,
		page:
			acts(choice(MKT_SELL.map((g) => [`mpick:${g}`, `<b>${nm(g)}</b><small>${fmt(Math.floor(haveOf(p, g)))}</small>`, g === k]), 's6', true), 'c1') +
			acts(
				info(`×${mkt(k).toFixed(2)}`, 'price') +
					btn(`trade:sell:${k}`, 'Sell', `${LOT(k)} for +${sellPrice(0, k)}g`, haveOf(p, k) < LOT(k) ? 'dis' : '') +
					btn(`trade:buy:${k}`, 'Buy', buy ? `${LOT(k)} for ${buyPrice(0, k)}g` : 'not sold here', !buy || p.res.g < buyPrice(0, k) ? 'dis' : ''),
				'c3',
			) +
			(p.age >= VENTURE.age
				? list(
						VENTURE.sizes.map((a) =>
							btn(`venture:${a}`, `Venture ${a}g`, `back ×${VENTURE.back} in a year`, p.res.g < a || V.length >= VENTURE.max ? 'dis' : ''),
						),
					)
				: ''),
	};
}
function keepMoreHTML() {
	// the Town Center's More: your people, goods and the whole research tree
	const p = G.P[0],
		C = CIVS[p.civ];
	let h = acts(btn('dismiss', 'Dismiss villager', 'frees a place'), 'c1');
	h += `<p><i>${C.name}.</i> ${C.bonus} Unique soldier: ${UNIT[C.uu].name}. Wonder: ${C.wonder}.</p>`;
	h += `<p><i>Food:</i> your people eat ${Math.round(p.eats || 0)} a minute${p.hungry ? ' · <b>none left: work and fighting −25%, no training</b>' : ''}. ${
		vassalsOf(0).length
			? `<i>Vassals:</i> ${vassalsOf(0)
					.map((q) => `${q.name} (${q.rebel ? 'in revolt' : `unrest ${Math.round(q.unrest)}%`})`)
					.join(', ')}.`
			: ''
	}</p>`;
	h += `<p><i>Goods:</i> ${goodsText(p.goods) || 'none yet'}. <i>Wanted by others here:</i> ${G.P.filter(
		(q) => q.id && q.id !== WILD && q.alive,
	)
		.map((q) => `${q.name} ${q.wants.map((k) => GOODS[k].name.toLowerCase()).join(' and ')}`)
		.join('; ')}.</p>`;
	const done = TECH.filter((t) => p.techs.has(t.id)),
		going = [],
		open = TECH.filter((t) => ownTech(t) && !p.techs.has(t.id) && !researchWhy(0, t.id));
	for (const b of G.blds)
		if (b.owner === 0)
			b.q.forEach((j, i) => {
				if (j.tech) going.push(`${TECHBY[j.tech].name}${i === 0 ? ` (${Math.ceil(j.left)} s)` : ' (waiting)'}`);
			});
	h += `<p><b>Research: ${done.length} of ${TECH.filter(ownTech).length} done.</b>${going.length ? ` <i>Under way:</i> ${going.join(' · ')}.` : ''}${open.length ? ` <i>Ready now:</i> ${open.map((t) => `${t.name} (${BLD[t.at].name})`).join(' · ')}.` : ''}</p>`;
	h += AGES.map((A, i) => {
		const T = TECH.filter((t) => ownTech(t) && t.age === i);
		return T.length
			? `<p><b>${A.name}:</b> ${T.map((t) => (p.techs.has(t.id) ? `<span class="done">✓ ${t.name}</span>` : `<span class="dim">${t.name}</span>`)).join(' · ')}</p>`
			: '';
	}).join('');
	return h;
}
function vassalHTML(P) {
	const L = loyaltyParts(P);
	let h = `<p><b>Your vassal.</b> ${P.rebel ? `<b>In revolt</b> since ${clock(G.t - P.rebel.t0)}: kill three quarters of their force to crush it, or they are free in ${clock(Math.max(0, VASSAL.freeAfter - (G.t - P.rebel.t0)))}.` : `Unrest ${Math.round(P.unrest)}% · loyalty ${Math.round(P.loyal)}% · paid ${Math.round(P.paid || 0)} in the last 10 s.`}</p>`;
	if (P.rebel) return h;
	h +=
		sec('Tax · a share of what they gather') +
		acts(
			Object.keys(TAX)
				.map((t) =>
					btn(
						`tax:${P.id},${t}`,
						t[0].toUpperCase() + t.slice(1),
						`${Math.round(TAX[t].take * 100)}%`,
						P.tax === t ? 'on' : '',
					),
				)
				.join(''),
			'c3',
		);
	fold(
		'about',
		'Loyalty',
		`<p><i>Loyalty heads for</i> 20 + ${L.invest} (your buildings near them) + ${L.garrison} (your soldiers there) + ${L.protect} (enemies you killed near them) − ${L.hate} (the tax) = <b>${Math.round(L.target)}</b>. Unrest moves by ${TAX[P.tax].push} − loyalty/25 every 10 s.${P.loyal >= VASSAL.shareAt ? ` You get ${VASSAL.share * 100}% of their trade profit.` : ` At ${VASSAL.shareAt} loyalty you get ${VASSAL.share * 100}% of their trade profit;`} ${P.loyal >= VASSAL.giftAt ? 'They send gifts.' : `at ${VASSAL.giftAt} they send gifts.`}</p><p>A demand costs more loyalty each time within two minutes. Forced tribute needs ${DEMAND.tributeMen} of your soldiers at their town. A levied soldier who dies costs ${DEMAND.levyLoyal} loyalty.</p>`,
	);
	// a lord's hand: demand, force, call up, cut loose
	const dc = demandCost(P);
	h +=
		sec(`Demand now · loyalty −${dc}`) +
		acts(
			['f', 'w', 's', 'g', 'i']
				.map((r) =>
					btn(
						`demand:${P.id},${r}`,
						RESOURCES[LONG[r]].name,
						`${Math.min(DEMAND.amt, Math.floor(P.res[r]))}/${Math.floor(P.res[r])}`, // what you would take of what they hold, on one line: the rank keeps its 44 (v80; EXCEPTIONS #12 gone)
						P.res[r] > 0 ? '' : 'dis',
					),
				)
				.join(''),
			'c5',
		);
	const tw = tributeWhy(0, P.id),
		lv = levyOf(0, P.id).length,
		half = levyRoom(0, P.id);
	h += acts(
		btn(
			`tribute:${P.id}`,
			'Force tribute',
			P.forced > G.t
				? `double tax: ${Math.ceil(P.forced - G.t)} s`
				: tw
					? tw.replace(/\.$/, '')
					: `double tax ${DEMAND.tribute / 60} min · unrest +${DEMAND.tributeUnrest}`,
			P.forced > G.t ? 'on' : tw ? 'dis' : 'warn',
		) +
			btn(
				`breakties:${P.id}`,
				G.confirm === 'bt' + P.id ? 'Tap again' : 'Break ties',
				G.confirm === 'bt' + P.id ? 'war, and the others grow wary' : 'cut them loose',
				'warn',
			),
	);
	h +=
		sec(`Call up their soldiers · ${lv} with you`) +
		list([
			...[4, 8].map((n) =>
				btn(
					`levy:${P.id},${n}`,
					`+${n}`,
					levyWhy(0, P.id, n) ? levyWhy(0, P.id, n).replace(/\.$/, '') : 'march to you',
					levyWhy(0, P.id, n) ? 'dis' : '',
				),
			),
			btn(`levy:${P.id},0`, 'Half', `${half}`, levyWhy(0, P.id, half) ? 'dis' : ''),
			btn(`release:${P.id}`, 'Release', lv ? `${lv} go home` : 'none', lv ? '' : 'dis'),
		]);
	return h;
}
function stopHTML(f) {
	const p = G.P[0],
		from = homeBiz(0, f) || keepOf(0),
		pt = postAt(f),
		mine = f.owner === 0,
		held = stopsHeld(mine ? 0 : f.owner, f.route);
	let h = `<p>Route ${f.route === 0 ? 'west–east' : 'north–south'}. ${f.owner === null ? (pt ? 'A post is going up.' : 'Nobody holds it.') : mine ? `Yours: ${Math.round(POST.cut[held] * 100)}% of the sales of everyone else here (you hold ${held} of this route's 4${held === 4 ? `, so it pays ${Math.round(POST.all * 60)} gold a minute` : ''}).` : `Held by ${G.P[f.owner].name}: they take ${Math.round(POST.cut[held] * 100)}% of your sales here.`} Wants <b>${GOODS[f.want].name.toLowerCase()}</b> (×${POST.want}).</p>`;
	h += `<p><i>Paid here, per good from your ${homeBiz(0, f) ? 'Market' : 'Town Center'}:</i> ${WARES.filter(
		(k) => k !== 'spice',
	)
		.map((k) => `${GOODS[k].name} ${Math.round(priceAt(0, k, f, from))}g`)
		.join(' · ')}. Spice costs ${GOODS.spice.buy}g here.</p>`;
	if (!pt && !guardsLeft(f))
		h += acts(
			btn(
				`tpost:${f.id}`,
				'Build a Trade post',
				p.age < 1 ? 'Bronze age' : costText(BLD.tpost.cost),
				p.age < 1 || !afford(p, BLD.tpost.cost) ? 'dis' : 'go',
			),
			'c1',
		);
	if (mine) {
		const sl = f.sell || {};
		h +=
			guardRow('f', f.id) +
			acts(
				btn(`want:${f.id}`, `Wanted: ${GOODS[f.want].name.toLowerCase()}`, 'yours: tap to change what it buys dear'),
				'c1',
			) +
			sec('Your caravans sell here') +
			acts(
				WARES.filter((k) => k !== 'spice')
					.map((k) =>
						btn(
							`sellat:${f.id},${k}`,
							GOODS[k].name,
							(f.sell ? sl[k] : 1) ? `${Math.floor(p.goods[k] || 0)} in store` : 'kept home',
							(f.sell ? sl[k] : 1) ? 'on' : '',
						),
					)
					.join(''),
				'c3',
			);
	}
	h += acts(
		btn(
			`routeto:${f.id}`,
			'Send a caravan here',
			homeBiz(0, f)
				? `${unitsOf(0, 'caravan').filter((c) => c.route && c.route.to === f.id).length} on this route`
				: 'needs a Market',
			homeBiz(0, f) && unitsOf(0, 'caravan').length ? 'go' : 'dis',
		),
		'c1',
	);
	return h;
}
function caravanHTML(u) {
	const r = u.route,
		t = targetOf(r),
		h0 = homeBiz(0, u),
		d = !r && u.dest ? byId(G.blds, u.dest) : null;
	let h = `<p>${r && t ? `Lane one: to the trade stop at ${coord(t.x, t.y)}${r.rep ? ', again and again' : ''}. ${u.leg === 'go' ? 'Carrying ' + (goodsText(u.goods || {}) || 'nothing') : u.leg === 'back' ? 'Coming home' + (u.goods && u.goods.spice ? ' with ' + u.goods.spice + ' spice' : '') : 'Loading'}.` : d && d.owner !== 0 ? `Lane two: to the ${bldName(d.owner, d.kind).toLowerCase()} of ${G.P[d.owner].name}, ${u.cargo} gold on arrival.` : allyMarket(0, u) ? 'Lane two: on its way to trade with your ally.' : 'No route, and no ally to trade with: it waits at your Market.'}</p>`;
	h += guardRow('c', u.id);
	if (!h0) return h + '<p>Build a Market (Trade) to send goods to the trade stops.</p>';
	const T = tradeTargets(0)
		.map((t) => [t, estPay(0, t, h0)])
		.sort((a, b) => b[1] - a[1])
		.slice(0, 4);
	h +=
		sec('Send it to') +
		acts(
			T.map(([t, v]) =>
				btn(
					`route:${u.id},s,${t.id}`,
					`Trade stop ${coord(t.x, t.y)}`,
					`about ${v}g a load · ${Math.round(dist(h0, t))} away`,
					r && t === targetOf(r) ? 'on' : '',
				),
			).join('') || '<p>No stop open: clear one of its guards first.</p>',
			'c1',
		);
	if (r)
		h += acts(
			btn(`rrep:${u.id}`, 'Repeat', r.rep ? 'on' : 'off', r.rep ? 'on' : '') +
				btn(`rsp:${u.id}`, 'Buy spice', r.spice ? 'on' : 'off', r.spice ? 'on' : '') +
				btn(`rclr:${u.id}`, 'No route', 'trade with an ally'),
		);
	return h;
}
function researchHTML() {
	// everything you can research, across every building: ready first, then short, then locked
	const p = G.P[0],
		by = { ready: [], short: [], busy: [], locked: [] },
		ageA = nextAge(0);
	for (const t of TECH) {
		if (!ownTech(t) || !isNext(0, t)) continue;
		const s = techState(t);
		if (s !== 'done') by[s].push(t);
	}
	const grid = (L) =>
		acts(L.map((t) => `<div class="trow">${techBtn(t, true)}<button class="goto" data-act="techgo:${t.id}" aria-label="Go to the ${BLD[t.at].name}">›</button></div>`).join('')), // › takes you to the building (Albert: a purist goes there; the row itself stays the shortcut)
		ageR = ageA && !p.aging && afford(p, ageA.cost) && keepOf(0);
	let h = title('Research', `${by.ready.length + (ageR ? 1 : 0)} ready now`);
	if (ageR) h += sec('Next age') + acts(keepAgeBtn(), 'c1');
	if (by.ready.length) h += sec('Ready') + grid(by.ready);
	if (!by.ready.length && !ageR) h += `<p>Nothing to start right now.</p>`;
	if (by.busy.length) h += sec('Under way') + grid(by.busy);
	if (by.short.length) h += sec('Short of something') + grid(by.short);
	if (by.locked.length) h += fold('lockedR', `Locked · ${by.locked.length}`, grid(by.locked));
	return h;
}
// Setup (v80, Albert Oct 31, pictures Setup Stacked with Names, Setup Stacked): each setting its own rank, its name quiet in the slots on the
// left, its choices right-justified as one selector, a slot a choice. Fog and Daily are two-choice settings like the rest (Off | On), so
// each says its word once, in its name. What each choice does is in the book
const setRow = (name, opts, cur) => acts(lab(name, 's' + (6 - opts.length)) + choice(opts.map(([act, w, v]) => [act, w, v === cur]), 's' + opts.length, true), 'c6');
const offOn = (key, on) => [[`${key}:0`, 'Off', false], [`${key}:1`, 'On', true]].map(([a, w, v]) => [a, w, v === on]);
const SET_WHY = {
	diff: {
		easy: 'Easy: the computers build and raid slowly.',
		normal: 'Normal: the computers play a fair game.',
		hard: 'Hard: the computers plan well and raid early.',
	},
	fantasy: {
		0: 'Real: wolves, boar and bandits; nothing that is not history.',
		1: 'Fantasy: trolls guard the finds, which pay half again.',
	},
	fog: { 1: 'Fog on: you see what your people see.', 0: 'Fog off: the whole map, as the computers see it.' },
	tension: {
		winner: 'Winner takes all: war until one stands.',
		diplomacy: 'Dynamic diplomacy: truces, tribute, allies and vassals.',
	},
};
const settingsWhy = () =>
	`<p>${[SET_WHY.diff[SET.diff], SET_WHY.fantasy[SET.fantasy ? 1 : 0], SET_WHY.fog[SET.fog !== false ? 1 : 0], SET_WHY.tension[SET.tension]].filter(Boolean).join(' ')}</p>`;
const settingsHTML = () =>
	setRow('Difficulty', DIFK.map((k) => [`diff:${k}`, k, k]), SET.diff) +
	setRow('Length', Object.entries(MODES).map(([k, m]) => [`mode:${k}`, m.name.replace('minutes', 'min'), k]), SET.mode) +
	setRow('Scenario', Object.keys(SCENARIOS).map((k) => [`scen:${k}`, SCEN_TEXT[k][0].replace('The ', ''), k]), SET.scen || 'open') +
	setRow('World', [['fantasy:0', 'Real', false], ['fantasy:1', 'Fantasy', true]], !!SET.fantasy) +
	acts(lab('Fog', 's4') + choice(offOn('fog', SET.fog !== false), 's2', true), 'c6') +
	setRow('Tension', [['tension:winner', 'Winner', 'winner'], ['tension:diplomacy', 'Diplomacy', 'diplomacy']], SET.tension);
