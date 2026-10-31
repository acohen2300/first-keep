// ═════ 29-card-pages.js: what a building adds to its card: market, council, workshop and the rest ═════
// ───────────────────────── What a building's page says, by kind ─────────────────────────
// A building's card (MENU-SPEC §8): an info rank (what it holds or does, health, age), its line, its techs, Repair · Take down. What a kind
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
		const f = G.finds.find((x) => x.id === b.sid);
		return f ? { fact: [`Holds ${coord(f.x, f.y)}`, 'tap the stop for prices'] } : {};
	},
	council: () =>
		hasCmd()
			? {
					page: acts(
						BN.map((n, j) =>
							btn(`wsq:${j}`, n, `${armyOf(0).filter((u) => u.kind !== 'spy' && u.bn === j).length} in it`),
						).join(''),
						'c4',
					), // each opens its card, where it is built (39-huddle)
					book: `<p>New soldiers fill each squad up to what you set on its card; the rest are the reserve. Send them from the War page with Go.</p><p><b>Shape:</b> ${FORM.map((F) => `${F.name}: ${F.note}`).join('. ')}.</p>`,
				}
			: {
					fact: ['No squads yet', G.P[0].techs.has('engage') ? 'next: Battalions' : 'first: Engagement'],
					book: `<p>${G.P[0].techs.has('engage') ? 'Temper is open: set it in the Army card. Next: Battalions, four squads.' : 'Research Engagement first: shooters step back. Then Battalions, Formations and Muster.'}</p>`,
				},
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
// the info rank: the fact as a sentence (three slots), then health and age; with no fact, health and age take two triples (no holes)
function infoRank(b, f) {
	const s = f ? 's15' : 's3';
	return acts(
		(f ? info(f[0], f[1], 'left line s3') : '') +
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
			`<button class="slot dis" data-act="qlock:${more.id}" aria-label="More places: ${more.name}"><b>+${more.fx.find((f) => f.s === 'queue').a}</b><small>research</small></button>`,
		);
	return acts(cells.join(''), 'c6');
}
// Relations, at the Town Center: one row per side, the stance you take toward them. Neutral keeps both swords sheathed; Hostile takes effect after notice; Ally needs their yes.
function nativesHTML() {
	const o = 0,
		r = Math.round(regardOf(o)),
		rel = G.rel[0][WILD],
		P = (G.prisoners || []).filter((x) => x.o === 0);
	let h = acts(
		info('Natives', `regard ${r} · ${REL_WORD[rel].toLowerCase()}`, 'left') +
			NATIVE.gifts
				.map((a) =>
					btn(
						`gift:${WILD},${a}`,
						`Gift ${a}g`,
						giftWhy(0, a) ? giftWhy(0, a).replace(/\.$/, '') : `regard +${giftGain(0, a)}`,
						giftWhy(0, a) ? 'dis' : '',
					),
				)
				.join('') +
			btn(
				`rel:${WILD},ally`,
				'Ally',
				rel === 'ally' ? '' : relWhy(0, WILD, 'ally') ? relWhy(0, WILD, 'ally').replace(/\.$/, '') : 'by emissary',
				rel === 'ally' ? 'on' : relWhy(0, WILD, 'ally') ? 'dis' : '',
			),
		'c4',
	);
	h += acts(
		['peace', 'war']
			.map((w) =>
				btn(
					`rel:${WILD},${w}`,
					REL_WORD[w],
					rel === w
						? ''
						: relWhy(0, WILD, w)
							? relWhy(0, WILD, w).replace(/\.$/, '')
							: w === 'war'
								? 'costs 20 regard, no notice'
								: 'the swords go up',
					rel === w ? 'on' : relWhy(0, WILD, w) ? 'dis' : w === 'war' ? 'warn' : '',
				),
			)
			.join(''),
		'c4',
	);
	if (P.length)
		h +=
			sec('Your people held') +
			acts(
				P.map((x, i) =>
					btn(
						`ransom:${i}`,
						`Ransom ${UNIT[x.kind].name.toLowerCase()}`,
						`${x.ransom}g · ${x.by === WILD ? 'Natives' : G.P[x.by].name} · ${clock(Math.max(0, x.t + PRISON.secs - G.t))}`,
						G.P[0].res.g >= x.ransom ? 'warn' : 'dis',
					),
				).join(''),
				'c2',
			);
	{
		const H = (G.prisoners || []).filter((x) => x.by === 0);
		if (H.length)
			h += `<p><i>You hold ${H.length}:</i> ${H.map((x) => `a ${UNIT[x.kind].name.toLowerCase()} of ${G.P[x.o].name}`).join(', ')}. Unransomed in ${PRISON.secs / 60} minutes, they serve you.</p>`;
	}
	return h;
}
function relHTML() {
	let h = sec('Relations') + nativesHTML();
	{
		// the board: at peace or not, the hidden age, the Games, standing down
		const tf = truceFor(),
			spare = Math.max(
				0,
				soldiersOf(0).filter((u) => u.state === 'home' && !u.inside).length -
					Math.ceil(soldiersOf(0).length * PEACE.stand.keep),
			),
			next = Math.max(0, PEACE.games.every - (G.t - (G.gamesT ?? 0)));
		h += `<p><i>The board:</i> ${G.truce === null ? 'not at peace.' : `at peace for ${clock(tf)}.`} ${G.enlight ? `The ${AGES[5].name} is open.` : `A year of peace opens the ${AGES[5].name}${G.truce === null ? '' : ` (${clock(Math.max(0, PEACE.age.truce - tf))} to go)`}.`} Games in ${clock(next)}${G.truce === null ? ', if the board is at peace' : ''}. Laurels: ${G.P[0].laurels || 0}.</p>`;
		h += acts(
			btn(
				'stand',
				'Stand down',
				spare ? `${spare} spare soldiers to the fields` : 'no spare soldiers at home',
				spare ? 'warn' : 'dis',
			),
			'c2',
		);
	}
	for (const q of G.P) {
		if (q.id === 0 || q.id === WILD || !q.alive) continue;
		const rel = G.rel[0][q.id],
			nl = noticeLeft(0, q.id) || noticeLeft(q.id, 0),
			who = `${q.name}${q.civ ? ' · ' + CIVS[q.civ].name : ''}`;
		if (q.lord === 0 && !q.rebel) {
			h += `<p><i>${who}:</i> your vassal.</p>`;
			continue;
		}
		if (G.P[0].lord === q.id && !G.P[0].rebel) {
			h += `<p><i>${who}:</i> your overlord.</p>`;
			continue;
		}
		h += acts(
			info(q.name, nl ? `hostile in ${nl} s` : q.ally !== null && q.ally !== 0 ? `with ${G.P[q.ally].name}` : q.civ ? CIVS[q.civ].name : '', 'left') +
				['ally', 'peace', 'war']
					.map((w) => {
						const why = relWhy(0, q.id, w);
						return btn(
							`rel:${q.id},${w}`,
							REL_WORD[w],
							w === rel ? '' : why ? why.replace(/\.$/, '') : w === 'war' ? `${NOTICE} s notice` : 'by emissary',
							w === rel ? 'on' : why ? 'dis' : w === 'war' ? 'warn' : '',
						);
					})
					.join(''),
			'c4',
		);
	}
	return h;
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
		w = G.units.find((u) => u.node === b.node),
		fr = w ? (w.st.got || 0) % 1 : 0;
	return {
		fact: [
			`${w ? Math.floor(w.st.got || 0) : 0} made`,
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
// the Market (MENU-SPEC §8, picture Market Card): Caravan and its techs; the goods as singles with what you have, one picked (gold); one
// Sell and one Buy for the picked good with its price; ventures from their age; the caravans, Repair, Take down
function marketHTML(b, end) {
	const p = G.P[0],
		V = p.ventures || [],
		k = MKT_SELL.includes(G.mktK) ? G.mktK : MKT_SELL[0],
		nm = (g) => (GOODS[g] ? GOODS[g].name : RESOURCES[LONG[g]].name),
		cv = unitsOf(0, 'caravan').length,
		buy = MKT_BUY.includes(k);
	fold(
		'bmore',
		'More',
		`<p>Sell or buy a lot at a time: 100 of a resource, 10 of a good. Prices rise and fall with what everyone buys and sells.</p><p>Two lanes. One: a caravan with a route takes goods from here to a trade stop and sells them. Two: a caravan with no route runs to an ally's Market or Town Center and earns distance² ÷ ${TRADE_DIV}, at most ${TRADE_CAP} gold. ${allyMarket(0, b) ? 'An ally to trade with.' : 'No ally yet.'}</p><p>${p.age < VENTURE.age ? `From the ${AGES[VENTURE.age].name} age: put gold into a merchant venture.` : `A venture comes back in a year with ${Math.round((VENTURE.back - 1) * 100)}% more; about 1 in ${Math.round(1 / VENTURE.lost)} is lost.`}${V.length ? ' Out: ' + V.map((v) => `${v.amt}g (${clock(Math.max(0, v.due - G.t))})`).join(', ') + '.' : ''}</p>`,
	);
	return (
		list([
			...trainButtons(trainsAt('market')),
			...TECH.filter((t) => ownTech(t) && t.at === 'market' && isNext(0, t)).map((t) => techBtn(t)),
		]) +
		slotsHTML(b) +
		acts(
			MKT_SELL.map((g) => btn(`mpick:${g}`, nm(g), fmt(Math.floor(haveOf(p, g))), g === k ? 'on' : '')).join('') +
				info(`×${mkt(k).toFixed(2)}`, 'price') +
				btn(`trade:sell:${k}`, 'Sell', `${LOT(k)} for +${sellPrice(0, k)}g`, haveOf(p, k) < LOT(k) ? 'dis s2' : 's2') +
				btn(
					`trade:buy:${k}`,
					'Buy',
					buy ? `${LOT(k)} for ${buyPrice(0, k)}g` : 'not sold here',
					!buy || p.res.g < buyPrice(0, k) ? 'dis s2' : 's2',
				),
			'c6',
		) +
		(p.age >= VENTURE.age
			? list(
					VENTURE.sizes.map((a) =>
						btn(
							`venture:${a}`,
							`Venture ${a}g`,
							`back ×${VENTURE.back} in a year`,
							p.res.g < a || V.length >= VENTURE.max ? 'dis' : '',
						),
					),
				)
			: '') +
		acts(
			info(`${cv} ${some(cv, 'caravan')}`, V.length ? `${V.length} ${some(V.length, 'venture')} out` : '') + end,
			'c3',
		)
	);
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
						`${Math.min(DEMAND.amt, Math.floor(P.res[r]))} of ${Math.floor(P.res[r])}`,
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
		acts(
			[4, 8]
				.map((n) =>
					btn(
						`levy:${P.id},${n}`,
						`+${n}`,
						levyWhy(0, P.id, n) ? levyWhy(0, P.id, n).replace(/\.$/, '') : 'march to you',
						levyWhy(0, P.id, n) ? 'dis' : '',
					),
				)
				.join('') +
				btn(`levy:${P.id},0`, 'Half', `${half}`, levyWhy(0, P.id, half) ? 'dis' : '') +
				btn(`release:${P.id}`, 'Release', lv ? `${lv} go home` : 'none', lv ? '' : 'dis'),
			'c4',
		);
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
		d = !r && u.dest ? G.blds.find((b) => b.id === u.dest) : null;
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
	if (ageR) h += sec('Next age') + acts(keepAgeBtn());
	if (by.ready.length) h += sec('Ready') + grid(by.ready);
	if (!by.ready.length && !ageR) h += `<p>Nothing to start right now.</p>`;
	if (by.busy.length) h += sec('Under way') + grid(by.busy);
	if (by.short.length) h += sec('Short of something') + grid(by.short);
	if (by.locked.length) h += fold('lockedR', `Locked · ${by.locked.length}`, grid(by.locked));
	return h;
}
// the Challenge: each hazard a switch with its points; the sum is the level, and the level multiplies the score
// one mold for a setting (Albert, Build 41): the label on the left, a sliding toggle on the right; the lit part slides to the choice
const seg = (label, opts, cur) => {
	const n = opts.length;
	return `<div class="seg"><b>${label}</b><div class="segT" style="--n:${n}">${opts.map(([act, name, v]) => `<button data-act="${act}" class="${v === cur ? 'on' : ''}" aria-pressed="${v === cur}">${name}</button>`).join('')}</div></div>`;
};
// one line under the settings says what the current choices do (Build 63: "Fantasy" explained nothing)
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
// the one word a new player cannot guess is the World (Albert: "fantasy means I fly on a magic carpet?"); one line, so the card still fits a page
const settingsWhy = () => `<p class="dim why">${SET_WHY.fantasy[SET.fantasy ? 1 : 0]}</p>`;
const settingsHTML = () =>
	seg(
		'Difficulty',
		DIFK.map((k) => [`diff:${k}`, cap1(k), k]),
		SET.diff,
	) +
	seg(
		'Length',
		Object.entries(MODES).map(([k, m]) => [`mode:${k}`, m.name.replace(' minutes', ''), k]),
		SET.mode,
	) +
	seg(
		'Scenario',
		Object.keys(SCENARIOS).map((k) => [`scen:${k}`, SCEN_TEXT[k][0].replace('The ', ''), k]),
		SET.scen || 'open',
	) +
	`<div class="seg2">${seg(
		'World',
		[
			['fantasy:0', 'Real', false],
			['fantasy:1', 'Fantasy', true],
		],
		!!SET.fantasy,
	)}${seg(
		'Fog',
		[
			['fog:1', 'On', true],
			['fog:0', 'Off', false],
		],
		SET.fog !== false,
	)}</div>` + // two choices of two share a row, so the setup card still fits one page
	seg(
		'Tension',
		[
			['tension:winner', 'Winner Takes All', 'winner'],
			['tension:diplomacy', 'Dynamic Diplomacy', 'diplomacy'],
		],
		SET.tension,
	) +
	settingsWhy();
