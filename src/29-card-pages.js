// ═════ 29-card-pages.js: what a building adds to its card: market, council, workshop and the rest ═════
// ───────────────────────── What a building's page says, by kind ─────────────────────────
// The generic page (health, crew, train, research, more) is one function; what a kind adds to it is one line here, never a branch in the page.
const BLD_PAGE = {
	castle: (b) => {
		const n = G.units.filter((u) => u.owner === 0 && isSoldier(u) && u.hp < u.max && dist(u, b) < GARRISON.r).length;
		return `<p>Soldiers resting here heal ${GARRISON.heal * fxv(0, 'garrison').m} a second${n ? `: ${n} mending now` : ''}.</p>`;
	},
	school: (b) => {
		const n = schooling(0),
			S = ready(0, 'school').length;
		return `<p>Teaching ${n} of ${TEACH.seats * S} seats${fxv(0, 'teach').a < 1 ? ' · research Veterans at the Barracks to send soldiers' : ' · tap a soldier, then Teach'}.</p>`;
	},
	farm: (b) =>
		`<p>Worked by ${b.node && b.node.wk > 0 ? slotText(b.node) : 'nobody yet: tap Send a villager' + (b.node && b.node.type === 'food' ? ', or + under Food' : '')}. This season: ${season().name}, ×${season().farm}${G.harvest !== 1 ? ` · the harvest this year ×${G.harvest}` : ''}${WEATHER[G.wx].crop ? ` · ${WEATHER[G.wx].name.toLowerCase()} ×${WEATHER[G.wx].crop}` : ''} · soil ${Math.round((b.fert ?? 1) * 100)}%.</p>` +
		(b.node ? yieldText(b.node, 0) : ''),
	treefarm: (b) =>
		`<p>Tended by ${b.node && b.node.wk > 0 ? slotText(b.node) : 'nobody yet: tap Send a villager, or + under Wood'}. ${Math.round(b.node ? b.node.amt : 0)} wood left, then the plot is cut out.</p>`,
	pasture: (b) =>
		`<p>${b.sheep || 0} sheep: ${b.node && b.node.wk > 0 ? `milk and meat, about ${Math.round((b.sheep || 0) * BLD.pasture.milk * 60 * gatherMul(0, b.node))} food a minute` : 'nobody tends them: tap Send a villager'}. ${Math.floor(b.node ? b.node.amt : 0)} wool to bring in${ready(0, 'workshop').length ? '' : ' · <b>wool waits for a Workshop</b>'}. Shorn each spring, when lambs come too.</p>`,
	throne: (b) => {
		const T = G.throne,
			mine = b.owner === 0;
		return `<p>${!T ? 'The Natives hold it. Regard opens its gate; siege breaks it.' : `${mine ? 'Yours' : G.P[T.owner].name + ' hold it'} since ${clock(T.since)}: ${clock(Math.max(0, throneHold() - (G.t - T.since)))} to ${mine ? 'win' : 'their win'}. A tithe of ${THRONE.tithe * 100}% of the gathering of everyone else, ${THRONE.score} score a minute.`}</p>`;
	},
	tpost: (b) => {
		const f = G.finds.find((x) => x.id === b.sid);
		return f ? `<p>Holds the stop at ${coord(f.x, f.y)}: tap the stop for prices and what it wants.</p>` : '';
	},
	council: (b) => councilHTML(b),
	mint: () =>
		G.P[0].debased
			? `<p>The coin is debased: prices at your Market are ×${MINT.price}.</p>`
			: acts(
					btn('debase', 'Debase the coin', `+${MINT.debase} gold now · Market prices ×${MINT.price} for good`, 'warn'),
					'c1',
				),
	market: (b) => marketHTML(b),
};
// A building's line: one slot per order it can hold. A filled slot shows the order and how far along it is; tap it and the order is cancelled, its cost back.
function slotsHTML(b) {
	const n = qMax(0),
		cells = [];
	for (let i = 0; i < n; i++) {
		const j = b.q[i];
		cells.push(
			j
				? `<button class="slot" data-act="qcancel:${b.id},${i}" style="--p:${i === 0 ? Math.round(100 * (1 - j.left / j.total)) : 0}%" aria-label="Cancel ${qName(j)}">${qName(j)}${i === 0 ? `<br>${Math.ceil(j.left)} s` : ''}<i></i></button>`
				: `<button class="slot empty" disabled>Slot ${i + 1}</button>`,
		);
	}
	const more = TECH.find((t) => (t.fx || []).some((f) => f.s === 'queue') && !G.P[0].techs.has(t.id)); // the next slot, locked: a tap says how to open it
	if (more)
		cells.push(
			`<button class="slot lock" data-act="qlock:${more.id}" aria-label="A locked slot">🔒 Slot ${n + 1}</button>`,
		);
	return (
		`<div class="slots" style="--qn:${cells.length}">${cells.join('')}</div>` +
		(b.blocked
			? '<p><b>Needs room: House, Apartment or Aqueduct.</b></p>'
			: b.stall > G.t
				? `<p><b>Stopped by sabotage: ${Math.ceil(b.stall - G.t)} s.</b></p>`
				: '')
	);
}
// Relations, at the Town Center: one row per side, the stance you take toward them. Neutral keeps both swords sheathed; Hostile takes effect after notice; Ally needs their yes.
function nativesHTML() {
	const o = 0,
		r = Math.round(regardOf(o)),
		rel = G.rel[0][WILD],
		P = (G.prisoners || []).filter((x) => x.o === 0);
	let h = acts(
		`<div class="lbl"><b>Natives</b><small>regard ${r} · ${REL_WORD[rel].toLowerCase()}</small></div>` +
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
			`<div class="lbl"><b>${q.name}</b><small>${nl ? `hostile in ${nl} s` : q.ally !== null && q.ally !== 0 ? `with ${G.P[q.ally].name}` : q.civ ? CIVS[q.civ].name : ''}</small></div>` +
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
// a workshop turns what is in store into goods: the same line for every one of them
function workshopHTML(b) {
	const p = G.P[0],
		n = b.node,
		B = BLD[b.kind],
		cur = b.cropT || B.crop,
		mk = B.makes[cur],
		[k, r] = Object.entries(mk.from)[0],
		kn = GOODS[k] ? GOODS[k].name.toLowerCase() : LONG[k],
		nm = (t) => (GOODS[t] ? GOODS[t].name : (RESOURCES[t] || RESOURCES[LONG[t]]).name),
		keys = Object.keys(B.makes);
	return (
		(keys.length > 1
			? acts(
					keys
						.map((t) =>
							btn(
								`make:${b.id},${t}`,
								nm(t),
								`${Object.entries(B.makes[t].from)
									.map(([a, q]) => q + ' ' + (GOODS[a] ? GOODS[a].name.toLowerCase() : LONG[a]))
									.join(', ')} make 1`,
								t === cur ? 'on' : '',
							),
						)
						.join(''),
					'c2',
				)
			: '') +
		`<p>In store: ${Math.floor(k in p.res ? p.res[k] : p.goods[k] || 0)} ${kn} (${r} make 1 ${nm(cur).toLowerCase()}, ${Math.round(mk.rate * 60 * fxv(0, 'make', [cur]).m)} a minute). Worked by ${n && n.wk > 0 ? (G.units.some((u) => u.node === n && u.wait) ? 'a villager, waiting for ' + kn : 'a villager') : 'nobody yet: tap Send a villager'}.</p>`
	);
}
function marketHTML(b) {
	// the Market's two sides: trade, and caravans and ventures
	const p = G.P[0],
		more = G.mtab === 'more',
		V = p.ventures || [],
		nm = (k) => (GOODS[k] ? GOODS[k].name : RESOURCES[LONG[k]].name);
	let h = '';
	if (!more) {
		h +=
			sec('Sell · 100 of a resource, 10 of a good') +
			acts(
				MKT_SELL.map((k) =>
					btn(`trade:sell:${k}`, nm(k), `+${sellPrice(0, k)}g`, haveOf(p, k) < LOT(k) ? 'dis' : ''),
				).join(''),
				'c4',
			) +
			sec('Buy') +
			acts(
				MKT_BUY.map((k) =>
					btn(`trade:buy:${k}`, nm(k), `${buyPrice(0, k)}g`, p.res.g < buyPrice(0, k) ? 'dis' : ''),
				).join(''),
				'c4',
			);
		h += fold(
			'prices',
			'Going prices',
			`<p>${MKTK.map((k) => `${nm(k)} ×${mkt(k).toFixed(2)}`).join(' · ')} (1 = normal)</p>`,
		);
	} else {
		h += `<p>Two lanes. One: a caravan with a route takes goods from here to a trade stop and sells them. Two: a caravan with no route runs to an ally's Market or Town Center and earns distance² ÷ ${TRADE_DIV}, at most ${TRADE_CAP} gold. ${unitsOf(0, 'caravan').length} caravans; ${allyMarket(0, b) ? 'an ally to trade with' : 'no ally yet'}.</p>`;
		h +=
			sec('Ventures') +
			`<p>${p.age < VENTURE.age ? 'From the Medieval age: put gold into a merchant venture.' : `Back in a year with ${Math.round((VENTURE.back - 1) * 100)}% more; about 1 in ${Math.round(1 / VENTURE.lost)} is lost.`} ${V.length ? 'Out: ' + V.map((v) => `${v.amt}g (${clock(Math.max(0, v.due - G.t))})`).join(', ') + '.' : ''}</p>`;
		if (p.age >= VENTURE.age)
			h += acts(
				VENTURE.sizes
					.map((a) => btn(`venture:${a}`, `${a} gold`, '', p.res.g < a || V.length >= VENTURE.max ? 'dis' : ''))
					.join(''),
				'c3',
			);
	}
	return h;
}
function councilHTML(b) {
	const p = G.P[0];
	if (!hasCmd())
		return `<p>${p.techs.has('engage') ? 'Stances are open: set them in the Army card. Next: Battalions, six of them, Alpha to Zeta.' : 'Research Engagement first: stances for your army. Then Battalions, Formations and Muster.'}</p>`;
	const i = G.bnEdit,
		plan = G.bnPlan[i],
		S = armyOf(0).filter((u) => u.kind !== 'spy');
	let h =
		sec('Battalions') +
		acts(
			BN.map((n, j) => btn(`bned:${j}`, n, `${S.filter((u) => u.bn === j).length} in it`, j === i ? 'on' : '')).join(
				'',
			),
			'c3',
		);
	const kinds = [...new Set([...S.map((u) => u.kind), ...Object.keys(plan)])];
	h +=
		sec(`${BN[i]} holds`) +
		(kinds.length
			? kinds
					.map(
						(k) =>
							`<div class="qs"><b>${stats(0, k).name}</b>${btn(`bnn:${k},-`, '−')}<span>${plan[k] || 0} · has ${S.filter((u) => u.bn === i && u.kind === k).length}</span>${btn(`bnn:${k},+`, '+')}</div>`,
					)
					.join('')
			: '<p>Train soldiers first.</p>');
	const f = FORM[G.form[i] || 0];
	h += acts(
		btn('bnstance', 'Stance: ' + STANCE[G.stance[i] || 0].name, '') +
			(p.techs.has('formations') ? btn('bnform', 'Formation: ' + f.name, f.note) : ''),
	);
	if (p.techs.has('muster')) {
		const miss = musterGap(i),
			why = musterWhy(0, miss),
			mc = musterCost(0, miss);
		h += acts(
			btn(
				`muster:${i}`,
				`Muster ${BN[i]}: +${musterN(miss)}`,
				why ? why.replace(/\.$/, '') : `${costText(mc.cost)} · ${mc.t} s`,
				why ? 'dis' : 'go',
			),
			'c1',
		);
	}
	return (
		h +
		fold(
			'bnabout',
			'About battalions',
			`<p>New soldiers fill each battalion up to what you set; the rest are the reserve. Send a battalion from the strip: tap open ground, then its name.</p><p><b>Formations:</b> ${FORM.map((F) => `${F.name}: ${F.note}`).join('. ')}.</p>`,
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
		half = Math.ceil(soldiersOf(P.id).length * DEMAND.levyMax);
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
		ageA = AGES[p.age + 1];
	for (const t of TECH) {
		if (!ownTech(t) || !isNext(0, t)) continue;
		const s = techState(t);
		if (s !== 'done') by[s].push(t);
	}
	const grid = (L) => acts(L.map((t) => techBtn(t, true)).join('')),
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
		'World',
		[
			['fantasy:0', 'Real', false],
			['fantasy:1', 'Fantasy', true],
		],
		!!SET.fantasy,
	);
