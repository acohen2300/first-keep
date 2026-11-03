// ═════ 30-cards.js: the CARDS table, one entry per card type, and renderCard ═════
// ───────────────────────── The cards, one entry each ─────────────────────────
// Each takes the card's description (G.card) and returns its page, or null when what it showed is gone.
const CARDS = {
	bld(c) {
		const b = byId(G.blds, c.id);
		if (!b) return null;
		const p = G.P[0],
			B = BLD[b.kind],
			mine = b.owner === 0,
			P = G.P[b.owner],
			done = b.prog >= 1,
			kp = b.kind === 'keep',
			rel = kp && (G.ktab === 'rel' || G.ktab === 'mis'),
			M = maxHpB(b.owner, b.kind),
			hurt = done && b.hp < M - 1,
			crew = unitsOf(0, 'vil').filter((u) => u.rep === b && u.job === 'repair'),
			X =
				(mine || b.kind === 'throne') && done
					? BLD_PAGE[b.kind]
						? BLD_PAGE[b.kind](b)
						: B.makes
							? workshopPage(b)
							: {}
					: {};
		const f = G.wonder && G.wonder.id === b.id ? factOf(b, X, crew) : X.fact; // what only this kind says (a castle mending, a field's crop) keeps the line; room goes to the book
		let h = title(
				bldName(b.owner, b.kind),
				[
					mine ? '' : P.name, // your own building: no "yours" line (S1, Albert Nov 2); another side's says whose
					mine ? '' : P.lord === 0 ? (P.rebel ? 'in revolt' : 'your vassal') : REL_WORD[G.rel[0][b.owner]].toLowerCase(),
					f && f.filter(Boolean).join(' '),
				]
					.filter(Boolean)
					.join(' · '),
				{ age: B.age || 0, hp: clamp(b.hp / M, 0, 1), work: done ? undefined : b.prog }, // the title box says the rest: its age on the top edge, its health a bar, its building the green ring (Albert, Nov 2)
			),
			end = '', // the last rank: Help, Repair, Raze
			book = `<p>Health ${Math.round(b.hp)}/${Math.round(M)} · ${AGES[B.age || 0].name} age${B.room ? ` · room for ${B.room}` : ''}.</p>` + (X.book || ''); // the book: health, age and room first (they left the card, Nov 2), then what its kind explains, then what was researched here, then what it is and why
		const more = () =>
			fold(
				'bmore',
				'More',
				book +
					(b.kind === 'wonder' && P.civ ? `<p><i>${CIVS[P.civ].wonder}:</i> ${WHY['wonder:' + P.civ]}</p>` : '') +
					`<p>${B.desc}</p>` +
					(WHY[b.kind] ? `<p><i>Why:</i> ${WHY[b.kind]}</p>` : ''),
			);
		if (mine && kp) {
			if (hurt) end = btn(`repair:${b.id}`, 'Repair', costText(repairCost(0, b)), 'go');
		} else if (mine) {
			const back = refundOf(b),
				menders = crew.filter((u) => !u.inside).length;
			// Repair and Raze share the last rank, both always there so nothing jumps (Albert, Build 63): Repair dim while the building is whole
			// the last rank (S2, Albert Nov 2): Help · Repair · Raze, each one slot wide, on every building card; Send help always there
			// on what can burn, so a fire moves nothing (hunt B #6)
			end =
				(done && B.wood
					? btn(`douse:${b.id}`, 'Help', b.fire > 0 ? 'two more' : 'no fire', b.fire > 0 ? 'warn' : 'dis') // Help: "Send help" is wider than one slot at 375 pt (the gate)
					: '') +
				btn(
					`repair:${b.id}`,
					'Repair',
					hurt ? (menders ? `${menders} mending` : costText(repairCost(0, b))) : 'whole',
					hurt ? 'go' : 'dis',
				) +
				(b.prog < 0.15
					? btn(`takedown:${b.id}`, 'Cancel', 'all back')
					: G.confirm === b.id
						? btn(`takedown:${b.id}`, 'Sure?', costText(back), 'warn') // the second tap, as Dismiss asks on the villager card
						: btn(`takedown:${b.id}`, 'Raze', costText(back))); // last on the card: the one you rarely want; one slot: Raze, its refund under it (Albert, Nov 2: "A")
		}
		if (mine) {
			const tr = done && !rel ? trainsAt(b.kind) : [],
				techs = done && !rel ? TECH.filter((t) => ownTech(t) && t.at === b.kind && isNext(0, t)) : [], // one step a line: the next
				did = TECH.filter((t) => t.at === b.kind && p.techs.has(t.id));
			// things you do here now, double-wide, a list: help with a fire, replant, send a builder, send a worker or one out
			h += list(
				[
					done && B.reserve && b.node && b.node.amt <= 0
						? btn(
								`replant:${b.id}`,
								'Replant',
								replantWhy(0, b)
									? replantWhy(0, b).replace(/\.$/, '')
									: `${costText(scaled(B.cost, 0.5))} · half the cost`,
								replantWhy(0, b) ? 'dis' : 'go',
							)
						: '',
					!done
						? btn(
								`sendbld:${b.id}`,
								'Send a villager',
								crew.length ? `${crew.length} building` : 'nobody yet',
								crew.length ? '' : 'go',
							)
						: '',
					B.crop && done && b.node
						? btn(`sendvil:${b.node.id}`, 'Send a villager', slotText(b.node), b.node.wk > 0 ? '' : 'go')
						: '',
					B.crop && done && b.node
						? btn(
								`sendout:${b.node.id}`,
								'Send out',
								b.node.wk > 0 ? 'one goes home' : 'nobody on it',
								b.node.wk > 0 ? '' : 'dis',
							)
						: '',
				].filter(Boolean),
			);
			// the page (MENU-SPEC §8): what it trains, double-wide, add only; its line directly under; its techs, three a rank (the Town Center's
			// next age first and All tech last); what its kind adds. No labels
			const page =
				(tr.length || b.q.length ? slotsHTML(b) : '') + // the queue first, in its steel box (Q1, Albert Nov 2): what is training over what you can train
				grid3(trainButtons(tr)) +
				grid3(
					[
						kp && !rel ? keepAgeBtn() : '',
						...techs.map((t) => techBtn(t)),
						kp && !rel ? btn('card:research', 'All tech', '›') : '',
					].filter(Boolean),
				) +
				(X.page || '');
			if (kp)
				h += folder(
					'ktab',
					[
						['town', 'Town'],
						['rel', 'Relations'],
						['mis', 'Misfits'],
					], // the tabs say their name only (pictures Relations Final, Relations Misfits); the stances are friend, neutral, foe (REL_WORD)
					rel ? G.ktab : 'town',
					rel ? relHTML(G.ktab === 'mis') : page + list(end ? [end] : []),
					'c3',
				);
			else h += page;
			if (done) {
				const T = kp && turtlePlan(0);
				book +=
					(did.length ? `<p><i>Researched here:</i> ${did.map((t) => t.name).join(' · ')}.</p>` : '') +
					(tr.length && !kp && b.kind !== 'town' ? tr.map((k) => unitLine(0, civKind(0, k))).join('') : '') +
					techs.map(techBook).join('') +
					(T && T.rows.length
						? `<p><i>To ${T.age.name} by the fields:</i> ${T.rows.map((x) => `${Math.round(x.need)} ${x.r}${isFinite(x.vm) ? ` (${x.vm.toFixed(1)} villager-min)` : ' (none known)'}`).join(', ')}. With ${T.villagers} villagers about ${isFinite(T.time) ? clock(T.time * 60) : '—'}: ${T.split
								.filter((s) => s.n)
								.map((s) => `${s.n} on ${cap1(s.r)}`)
								.join(', ')}.</p>`
						: '') +
					(kp ? keepMoreHTML() : '');
			}
		}
		if (!mine && b.kind === 'keep' && P.lord === 0) h += vassalHTML(P);
		else if (!mine && b.kind === 'keep' && G.rel[0][b.owner] === 'ally') {
			const why = overlordWhy(0, b.owner);
			h += acts(
				btn(
					`overlord:${b.owner}`,
					'Offer overlordship',
					why ? why.replace(/\.$/, '') : 'they become your vassal at a light tax',
					why ? 'dis' : 'go',
				),
				'c1',
			);
		} else if (!mine && atWar(0, b.owner)) {
			const I = G.intel[b.owner],
				spies = unitsOf(0, 'spy').length;
			if (I)
				h += `<p><b>Report of a spy</b> (${clock(G.t - I.t)} ago): ${costText(I.res)} in store · ${AGES[I.age].name} age · ${I.techs} researched · ${
					Object.entries(I.army)
						.map(([k, n]) => n + ' ' + stats(b.owner, k).name.toLowerCase())
						.join(', ') || 'no army'
				}.</p>`;
			if (b.kind === 'keep') {
				const why = surrenderWhy(0, b.owner);
				h += acts(
					btn(
						`surrender:${b.owner}`,
						'Demand surrender',
						why ? why.replace(/\.$/, '') : 'they become your vassal and pay tax',
						why ? 'dis' : 'go',
					),
					'c1',
				);
			}
			h +=
				acts(
					btn(
						`sab:${b.id}`,
						'Sabotage',
						!B.sab
							? 'too well guarded'
							: !spies
								? 'needs a spy: Build → Courthouse'
								: guarded(b)
									? 'defended: the spy would be shot'
									: 'a spy goes and is used up',
						B.sab && spies ? 'warn' : 'dis',
					),
					'c1',
				) + qsHTML(`qatk:${b.id}`, 'Attack with', b);
		}
		return h + (kp || !end ? '' : acts(end, 'c6')) + more();
	},
	find(c) {
		const f = byId(G.finds, c.id);
		if (!f) return null;
		const F = FINDS[f.kind],
			gl = G.units.filter((v) => v.find === f.id && v.owner === WILD && v.hp > 0 && v.kind !== 'vagabond'),
			at = `${Math.round(f.x)},${Math.round(f.y)}`;
		let h = title(F.name, coord(f.x, f.y) + (f.done && !F.capture ? ' · taken' : '')) + `<p>${F.desc}</p>`;
		if (gl.length) h += `<p>Guarded by ${gl.length} ${some(gl.length, UNIT[gl[0].kind].name.toLowerCase())}.</p>`;
		if (F.got && !f.done)
			h += `<p>Inside: ${costText(Object.fromEntries(Object.entries(F.got).map(([k, v]) => [k, Math.round(v * (G.fantasy ? 1.5 : 1))])))}${F.tech ? ' and a free research' : ''}.</p>`;
		if (F.capture) {
			h += `<p>${f.owner === null ? 'Nobody holds it.' : f.owner === 0 ? 'Yours: it pays you.' : `Held by ${G.P[f.owner].name}.`}</p>`;
			if (f.owner !== 0) {
				const pr = unitsOf(0, 'priest').length;
				h += acts(
					btn(
						`shrine:${f.id}`,
						'Send a priest',
						pr ? 'it stands there and takes it' : 'needs a priest: Build → Temple',
						pr ? 'go' : 'dis',
					),
					'c1',
				);
			}
		}
		if (F.hire && !f.done) {
			const why = hireWhy(0, f);
			h += acts(
				btn(
					`hire:${f.id}`,
					`Hire ${F.hire.n} vagabonds`,
					why ? why.replace(/\.$/, '') : costText(F.hire.cost),
					why ? 'dis' : 'go',
				),
				'c1',
			);
		}
		h +=
			qsHTML(`qgo:${at}`, 'Send', f) +
			(unitsOf(0, 'scout').length
				? acts(btn(`scoutgo:${at}`, 'Send the scout', 'fast, but it does not fight'), 'c1')
				: '');
		if (F.stop) h += stopHTML(f);
		return h + fold('why', 'Why?', `<p>${WHY[f.kind]}</p>`); // one row of peoples, their soldier in the line under it: the whole card on one page (Albert)
	},
	unit(c) {
		const u = byId(G.units, c.id);
		if (!u) return null;
		const U = UNIT[u.kind],
			o = u.owner,
			S = o === WILD ? U : stats(o, u.kind),
			P = G.P[o],
			mine = o === 0 && u.kind === 'vil';
		if (mine) {
			// the villager's card (MENU-SPEC §8, the mold, Albert Nov 3): Go · Build · Job / Doing · Health · Carrying / Stop · Home · Dismiss.
			// Go picks them, so the next tap on the ground is their order; Job is the next job in the ribbon's order (the vjob verb)
			const sick = u.sick > G.t,
				sure = G.confirm === 'v' + u.id,
				car = Math.round(u.carry || 0),
				job = JOBS[(JOBS.indexOf(u.job) + 1) % JOBS.length];
			return mold(ICON.people, [
				mbtn(`vwalk:${u.id}`, ICON.flag, MOLD_WORD.go, G.pickSet && G.pickSet.has('unit' + u.id) ? 'on' : ''),
				mbtn(`pbuild:${u.id}`, ICON.hammer, ROW_WORD.build, u.job === 'repair' ? 'on' : ''),
				mbtn(`vjob:${u.id},${job}`, ICON.basket, MOLD_WORD.job),
				info(doingWord(u), MOLD_WORD.doing),
				info(`${Math.round(u.hp)}/${Math.round(u.max)}`, sick ? (u.plague ? 'plague' : 'sick') : MOLD_WORD.health),
				car > 0 ? info(car, cap1(u.carryType)) : info(MOLD_WORD.nothing, MOLD_WORD.carry),
				mbtn(`vstop:${u.id}`, ICON.stop, MOLD_WORD.stop, u.job || u.post ? '' : 'dis'),
				mbtn(`vhome:${u.id}`, ICON.home, MOLD_WORD.home),
				mbtn(`vgo:${u.id}`, sure ? ICON.ok : ICON.close, sure ? MOLD_WORD.sure : MOLD_WORD.dismiss, sure ? 'warn' : ''),
			]);
		}
		if (o === WILD && U.tags.includes('animal')) {
			// an animal's card, the item mold: Send a hunter · Locate · Info / Left · Drop · Bonus / Health · Danger · Loot
			const dr = U.meat ? dropFor(0, 'food', u) : null;
			fold('about', 'About', `<p>${U.desc}</p>` + (WHY[u.kind] ? `<p><i>Why:</i> ${WHY[u.kind]}</p>` : ''));
			return mold(U.dmg ? ICON.sword : ICON.food, [
				U.meat && U.tick === 'wild' ? mbtn(`hunt:${u.id}`, ICON.next, MOLD_WORD.hunter, 'go') : empty(),
				mbtn(`jump:${Math.round(u.x)},${Math.round(u.y)}`, ICON.aim, MOLD_WORD.locate),
				mbtn('info', ICON.book, MOLD_WORD.info, G.infoOpen ? 'on' : ''),
				empty(),
				U.meat ? info(dr ? Math.round(dist(dr, u)) : MOLD_WORD.none, MOLD_WORD.drop) : empty(),
				empty(),
				info(`${Math.round(u.hp)}/${Math.round(u.max)}`, MOLD_WORD.health),
				U.dmg ? info(Math.round(S.dmg), MOLD_WORD.danger) : empty(),
				U.meat ? info(U.meat, MOLD_WORD.loot) : empty(),
			]);
		}
		let h =
			title(
				S.name,
				o === 0
					? 'yours' + (u.bn !== undefined ? ' · ' + BN[u.bn] : '')
					: o === WILD
						? 'the wild'
						: P.name + (P.civ ? ' · ' + CIVS[P.civ].name : ''),
			) + hpBar(u.hp / u.max, P.color); // the wild in the Natives' own colour (COLORS, Nov 2)
		h += `<p>Health ${Math.round(u.hp)}/${Math.round(u.max)}${U.dmg ? ` · hits ${Math.round(S.dmg * 10) / 10} · reach ${Math.round(S.rng)}` : ''} · speed ${Math.round(S.spd)}${o !== WILD && isSoldier(u) ? ` · takes ${Math.round(S.armor * 100)}% damage` : ''}.</p>`;
		if (o === 0) h += `<p><i>Now:</i> ${statusOf(u)}.</p><p><i>Life:</i> ${lifeText(u)}.</p>`;
		if (o === 0 && u.kind === 'caravan') h += caravanHTML(u);
		if (o === 0 && isSoldier(u) && teachTo(u)) {
			const why = teachWhy(0, u);
			h += acts(
				u.state === 'school'
					? btn(
							`teach:${u.id}`,
							`Learning: ${stats(0, teachTo(u)).name}`,
							`${Math.ceil(u.schoolT - G.t)} s left`,
							'dis',
						)
					: btn(
							`teach:${u.id}`,
							`Teach: ${stats(0, teachTo(u)).name}`,
							why
								? why.replace(/\.$/, '')
								: `${costText(teachCost(0, u))} · ${Math.round(teachSecs(0, u))} s at the School`,
							why ? 'dis' : 'go',
						),
				'c1',
			);
		} // a soldier learns a newer kind
		if (u.sick > G.t)
			h += `<p><b>${u.plague ? 'Plague' : 'Sick'}:</b> works and fights at half strength. A Hospital or a medic nearby cures it.</p>`;
		const bt = o !== WILD && beatsText(o, u.kind);
		if (bt) h += `<p><i>Strong against:</i> ${bt}.</p>`;
		if (o !== 0 && atWar(0, o)) h += qsHTML(`qfoe:${u.id}`, 'Attack with', u);
		return h + fold('about', 'About', `<p>${U.desc}</p>` + (WHY[u.kind] ? `<p><i>Why:</i> ${WHY[u.kind]}</p>` : ''));
	},
	info(c) {
		const B = BLD[c.kind];
		return (
			title(bldName(0, c.kind), `${AGES[B.age].name} age · ${costText(B.cost)}`) +
			`<p>${B.desc}</p><p>Unlocks in the ${AGES[B.age].name} age. Advance at your Town Center.</p>`
		);
	},
	box(c) {
		const left = G.nodes.filter((n) => n.kind === 'tree' && n.amt > 0 && inBox(n, c.r)).length;
		if (!left) return null;
		return (
			title('Trees', `${left} in the box`) +
			sec('Cut these trees') +
			acts(
				[1, 3, 5].map((n) => btn(`boxcut:${n}`, `Send ${n}`, n === 1 ? 'villager' : 'villagers', 'go')).join(''),
				'c3',
			) +
			`<p>They cut from the edge inward, then go back to their work. Cut a way through to open a road.</p>`
		);
	},
	stores() {
		// one rank a resource (MENU-SPEC §8, picture States and Text): its name, what you have, what came in and went out over the last minute,
		// who is on it, and ›, which opens the book on its why. No header rank: each number carries its own label
		const p = G.P[0],
			V = unitsOf(0, 'vil'),
			el = (G.tick % 1800) / 30,
			full = p.rate && Object.keys(p.rate).length,
			pace = (o) => Object.fromEntries(Object.entries(o || {}).map(([k, v]) => [k, (v * 60) / Math.max(10, el)])), // the last full minute; before there is one, the pace so far
			rt = full ? p.rate : pace(p.flow),
			ot = full ? p.orate || {} : pace(p.spent1),
			K = G.storesK,
			line = (o) =>
				Object.entries(o || {})
					.filter(([, v]) => v >= 0.5)
					.sort((a, b) => b[1] - a[1])
					.map(([w, v]) => `${LEDGER_WORD[w] || w} ${fmt(v)}`)
					.join(' · ') || 'nothing yet';
		let h = title('Stores', 'the last minute');
		for (const r of RES) {
			const k = KEY[r],
				i = Math.round(rt[k] || 0),
				o = Math.round(ot[k] || 0);
			h += acts(
				info(RESOURCES[r].name, '', 'left line') +
					info(`<span style="color:${grad(velOf(p, k))}">${fmt(p.res[k])}</span>`, 'have') +
					info(i ? '+' + i : 0, 'in', i ? 'gain' : '') +
					info(o ? '−' + o : 0, 'out', o ? 'loss' : '') +
					info(V.filter((u) => u.job === r).length, 'on it') +
					btn(`storesk:${k}`, '›', '', K === k && G.infoOpen ? 'on' : ''),
				'c6',
			);
		}
		if (K) {
			// the why of one resource (Albert, Build 63), both ways. By reason: where the minute's in and out came from and went. By who: the
			// villagers on it, and the buildings that make it or take it (shops, the mint, the foundry)
			const r = RES.find((x) => KEY[x] === K),
				own = (f) =>
					G.blds.filter((b) => standing(b, 0) && BLD[b.kind].makes && f(BLD[b.kind].makes)),
				makers = own((m) => K in m),
				takers = own((m) => Object.values(m).some((x) => x.from && K in x.from)),
				who = (L) => L.map((b) => `<span data-act="open:bld,${b.id}">${bldName(0, b.kind)}</span>`).join(', ');
			fold(
				'about',
				'About',
				`<p><b>${RESOURCES[r].name}, the last minute.</b> <i>In:</i> ${line((p.rateBy || {})[K] || (p.flowBy || {})[K])}. <i>Out:</i> ${line((p.orateBy || {})[K] || (p.spentBy || {})[K])}.</p>` +
					`<p><i>Who:</i> ${V.filter((u) => u.job === r).length} villagers on it${makers.length ? `; made at ${who(makers)}` : ''}${takers.length ? `; taken by ${who(takers)}` : ''}.</p>`,
			);
		}
		const L = p.ledger || { in: {}, out: {} }; // the ledger: every resource that ever came in or went out, by where it came from and went (earn and spend, 08-core)
		return (
			h +
			fold(
				'about',
				'About',
				`<p><i>Goods:</i> ${GOODK.map((k) => `${GOODS[k].name} ${Math.floor(p.goods[k] || 0)}${rt[k] ? ` (+${Math.round(rt[k])})` : ''}`).join(' · ')}. Goods wait at your Market for caravans; wool for a Workshop.</p>` +
					`<p>In and Out: the last minute. What you have is green while it gains, deeper the faster; white while it holds; red as it loses, reddest with under two minutes left${p.hungry ? ' · <b>they are hungry</b>' : ''}.</p>` +
					`<p><b>Ledger, the whole game.</b> <i>In:</i> ${line(L.in)}. <i>Out:</i> ${line(L.out)}.</p><p>Trade is caravans, routes held and the cut of other caravans at your stops; the Market is sales and buys; tax is what vassals send; tribute is gifts and peace bought.</p>`,
			)
		);
	},
	fault: () =>
		title('Something went wrong', 'your last save is kept') +
		`<p>Restart to carry on from the last save. Carry on and nothing more is saved.</p>` +
		acts(btn('reload', 'Restart', 'from the last save', 'go') + btn('close', 'Carry on', 'not saved')),
	resume: (c) =>
		title('Welcome back', 'saved on this phone') +
		`<p>Your game from ${clock(c.t)}: ${CIVS[c.civ] ? CIVS[c.civ].name + ', ' : ''}${AGES[c.age].name} age. Resume it, or start a new one.</p>` +
		acts(btn('resume', 'Resume', clock(c.t), 'go') + btn('card:setup', 'New game', '')),
	setup(c) {
		// the annoying part before the fun part (Albert): every setting its own line, your people (no label), the hazards under a label line,
		// ONE info line (what the last option tapped means) and Start at the foot (v80; Nov 3). The people's soldier and the none-ticked rule wait behind the book
		const C = CIVS[SET.civ],
			H = SET.daily ? TODAY_HZ : SET.hz || {},
			lv = levelOf(H), // none ticked: the hazards are drawn by lot when the game starts (Build 70)
			[tip1, tip2] = tipOf(c.tip || 'civ:' + SET.civ);
		fold(
			'about',
			'About',
			`<p><b>${civShort(SET.civ)}:</b> ${UNIT[C.uu].name}, in place of the ${UNIT[UNIT[C.uu].replaces].name.toLowerCase()}. Wonder: ${C.wonder}. ${WHY['bonus:' + SET.civ]}</p><p>The other three sides take three of the other peoples at random. Every people has the same rules; only the unique soldier, the bonus and the wonder differ.</p><p><b>None ticked:</b> each hazard is drawn by lot, even odds, for every side alike; the first message says the level.</p><p class="copy">© Albert Labs, all rights reserved</p>`,
		);
		return (
			title('A new game', '') +
			settingsHTML(true) +
			acts(choice(CIVK.map((k) => [`civ:${k}`, CIVS[k].name, SET.civ === k]), 's6', true), 'c1') +
			acts(lab(SET_WORD.hazards, 's6'), 'c6') +
			acts(choice(HZK.map((k) => [`hz:${k}`, `<b>${HAZARDS[k].short || HAZARDS[k].name}</b><small>${HAZARDS[k].pts}</small>`, !!H[k]]), 's6'), 'c1') +
			(staleSave
				? acts(info(`Your last game ${staleSave === 'damaged' ? 'could not be read' : `came from an older version (${staleSave})`}`, 'kept aside, not deleted', 'left line'), 'c1')
				: '') +
			acts(info(tip1, tip2 || '', 'left line say'), 'c1') +
			acts(
				btn(
					SET.daily ? 'today' : 'fresh',
					'Start',
					`${C.name} · ${SET.daily ? `daily challenge, level ${levelOf(TODAY_HZ)}` : MODES[SET.mode].name.replace('minutes', 'min')} · ${lv ? `level ${lv} · score ×${(1 + lv / 10).toFixed(1)}` : 'hazards at random'}`,
					'main',
				),
				'c1',
			)
		);
	},
	node(c) {
		const n = byId(G.nodes, c.id);
		if (!n) return null;
		// an item card (MENU-SPEC section 8, the mold): Send · Locate · Info; Left · Drop · Bonus; what a find says (who works it, what each takes
		// a minute, what a trip carries). The coordinates, the yield maths and the drop-off sentence wait behind Info
		const dr = dropFor(0, n.type, n),
			far = dr ? Math.round(dist(dr, n)) : null,
			dropName = RESOURCES[n.type].drop,
			mul = gatherMul(0, n);
		fold(
			'about',
			'About',
			`<p>${nodeName(n)} at ${coord(n.x, n.y)}. The nearest idle villager goes; if none is idle, one from the job you hold the most of.</p>` +
				yieldText(n, 0) +
				`<p>${far === null ? `No drop-off for ${n.type} yet: build a ${dropName}.` : far > 110 ? `Nearest drop-off is ${far} away: build a ${dropName} closer.` : `Nearest drop-off: ${far} away.`}</p>`,
		);
		return mold(ICON[n.type] || ICON.food, [
			mbtn(`sendvil:${n.id}`, ICON.next, MOLD_WORD.villager, 'go'),
			mbtn(`jump:${Math.round(n.x)},${Math.round(n.y)}`, ICON.aim, MOLD_WORD.locate),
			mbtn('info', ICON.book, MOLD_WORD.info, G.infoOpen ? 'on' : ''),
			info(isFinite(n.amt) ? Math.round(n.amt) : '∞', MOLD_WORD.left),
			info(far === null ? MOLD_WORD.none : far, MOLD_WORD.drop),
			Math.abs(mul - 1) < 0.005 ? info(MOLD_WORD.none, MOLD_WORD.bonus) : info(`${mul > 1 ? '+' : ''}${Math.round((mul - 1) * 100)}%`, MOLD_WORD.bonus),
			info(`${n.wk || 0}/${n.kind === 'farm' ? slotsOf(n) : findCap(n)}`, MOLD_WORD.working),
			info(Math.round((n.rate || RATE_OF[n.kind]) * mul * 60), MOLD_WORD.rate),
			info(carryOf(0), MOLD_WORD.trip),
		]);
	},
	troops() {
		// the Army card (Albert, Build 41): from the sword under Build
		const p = G.P[0],
			S = armyOf(0),
			by = {};
		for (const u of S) {
			const nm = stats(0, u.kind).name;
			by[nm] = (by[nm] || 0) + 1;
		}
		let h =
			title('Army', `${S.length} soldiers`) +
			`<p>${
				Object.entries(by)
					.map(([n, k]) => `${k} ${some(k, n.toLowerCase())}`)
					.join(' · ') || 'Nobody yet: train soldiers below.'
			}</p>`;
		// the live lines go under every button, so their coming and going moves nothing under the finger (hunt B #6)
		let live = '';
		{
			// who is doing what, soldier by soldier (Build 42)
			const c = { hold: 0, rally: 0, march: 0, fight: 0, rout: 0 },
				W = { hold: 'holding', rally: 'rallying', march: 'marching', fight: 'fighting', rout: 'routed' };
			for (const u of S) if (c[armyStatus(u)] !== undefined) c[armyStatus(u)]++;
			const line = Object.keys(c)
				.filter((k) => c[k])
				.map((k) => `<b>${c[k]}</b> ${W[k]}`)
				.join(' · ');
			if (line) live += `<p>${line}</p>`;
		}
		const ords = Object.values(G.ords || {}).filter((O) => O.n),
			inc = G.incoming;
		if (inc)
			live +=
				sec('Coming at you') +
				`<p data-act="jump:${Math.round(inc.x)},${Math.round(inc.y)}"><b>${inc.n}</b> ${inc.what} · ${inc.eta} s away</p>`;
		if (ords.length)
			live +=
				sec('Out on orders') +
				ords
					.map(
						(O) =>
							`<p data-act="ordpick:${O.id}"><b>${O.n}</b> ${O.fight ? 'fighting near' : O.arrived ? 'at' : 'marching to'} ${O.label}${!O.arrived && O.eta ? ` · ${O.eta} s` : ''}</p>`,
					)
					.join(''); // tap a line: that group is picked, and the camera goes to it
		h += acts(btn('alarmpg', 'Alarm', 'gather · garrison · shelter', G.emg ? 'warn' : ''), 'c1');
		if (S.length && hasCmd())
			h +=
				sec('Orders go to') +
				list(
					[['all', 'All', S.length]]
						.concat(BN.map((n, i) => [i, n, S.filter((u) => u.bn === i).length]))
						.map(([k, n, cnt]) => btn(`sel:${k}`, n, `${cnt}`, G.sel === k ? 'on' : '')),
				);
		if (S.length) {
			h +=
				sec(`Orders for the ${selName()}`) +
				acts(
					btn('recall', 'Recall home', '') +
						btn(
							'attack:near',
							'Attack nearest',
							oddsText(orderSet(), foeNearest()),
							orderSet().length ? 'warn' : 'dis',
						),
				);
			{
				const bn = G.sel === 'all' ? undefined : G.sel,
					cw = chargeWhy(0, orderSet(), bn),
					S = orderSet(),
					nerve = S.length ? Math.round((100 * S.reduce((a, u) => a + (u.mor ?? 1), 0)) / S.length) : 0;
				h +=
					acts(
						btn(
							'charge',
							'Charge',
							cw ? cw.replace(/\.$/, '') : `${CHARGE.secs} s of speed and blows, then tired`,
							cw ? 'dis' : 'warn',
						) + btn('fallback', 'Fall back', `withdraw ${FALLBACK.back}, fewer losses`),
					) +
					`<p><i>Nerve:</i> ${nerve}%${nerve < 40 ? ' · <b>close to breaking</b>' : ''}.</p>` +
					fold(
						'about',
						'Nerve',
						'<p>Blows from the side and behind drain nerve; rest, a wall, a tower or a priest restore it. Under 20% a soldier runs.</p>',
					);
			}
			h += list(dialBtns(G.sel));
			if (ready(0, 'temple').length) {
				const why = zealWhy(0, orderSet());
				h += acts(
					btn(
						'zeal',
						'Zeal',
						why ? why.replace(/\.$/, '') : `${costText(zealCost(0))} · ${ZEAL.secs} s of harder blows`,
						why ? 'dis' : 'go',
					),
					'c1',
				);
			}
		}
		const kinds = ARMYK.filter((k) => !UNIT[k].civ && UNIT[civKind(0, k)].age <= p.age + 1);
		h += fold('armytrain', 'Train soldiers', list(trainButtons(kinds)));
		return (
			h +
			fold(
				'about',
				'About orders',
				`<p>Tap open ground, then the sword: All or the idle ones go there, or + aims a mission there. A squad is built on its card (tap it on the War page); War sends squads with a time and odds; a gold ring marks the one picked here.</p><p><b>Temper:</b> ${TEMPER.map((s) => `${s.name}: ${s.note}`).join('. ')}.</p><p><b>Shape:</b> ${FORM.map((F) => `${F.name}: ${F.note}`).join('. ')}. On the march an army goes in column.</p>`,
			) +
			live
		);
	},
	menu(c) {
		// the Build card (preview 33, back by Albert's yes yes, Nov 3, 15:50; MENU-SPEC §8): six tabs, a folder; the buildings four a rank,
		// words only: the name, how many of how many, the cost. Dim: a later age, or all built; short: the first thing it waits on, in red. The
		// page holds the height of the biggest tab, so the tabs never move under the finger
		const p = G.P[0],
			M = MENUS.find((m) => m.id === c.id) || MENUS[0];
		G.lastMenu = M.id;
		const item = (k) => {
			const B = BLD[k],
				lock = B.age > p.age,
				cp = capFor(0, k),
				n = bldsOf(0, k).length,
				full = !lock && n >= cp,
				can = afford(p, B.cost),
				short = need(B.cost).split(' ')[0]; // the first resource it waits on: every tile two lines
			return btn(
				`build:${k}`,
				B.short || bldName(0, k),
				lock ? `${AGES[B.age].name} age` : (cp > 1 && cp < 99 ? `${n}/${cp} · ` : '') + (full ? 'all built' : can ? costText(B.cost) : `short ${short}`), // one of a kind shows no count: two lines a tile
				lock || full ? 'dis' : '',
				lock || full ? undefined : can ? 1 : fillOf(B.cost),
			);
		},
			grid4 = (cells) => acts(cells.join('') + empty().repeat((4 - (cells.length % 4)) % 4), 'c4');
		return (
			title('Build') +
			folder(
				'menu',
				MENUS.map((m) => {
					const open = m.items.filter((k) => BLD[k].age <= p.age); // every building the age allows at its limit: the tab says so with a check (Build 61)
					return [m.id, m.name, open.length && open.every((k) => bldsOf(0, k).length >= capFor(0, k)) ? '✓' : ''];
				}),
				M.id,
				`<div class="hold" style="--n:${Math.ceil(Math.max(...MENUS.map((m) => m.items.length)) / 4)}">${grid4(M.items.map(item))}</div>`,
				'c6',
			) +
			fold('menu', 'What each one does', M.items.map((k) => `<p><b>${bldName(0, k)}:</b> ${BLD[k].desc}</p>`).join(''))
		);
	},
	research: () => researchHTML(),
	// the mail (Build 64): every line kept, newest first, by group; a group can hide its previews here or from the preview's ×. Six lines a
	// page, Previous and Next: the 30 kept are five pages, nothing scrolls (N13, Albert Oct 31: "a page system, nothing more")
	mail() {
		const M = G.mail || [],
			g = G.mailG,
			all = M.filter((m) => !g || m.grp === g);
		let h = title('Mail', g ? GROUPS[g] : `${M.length} kept`);
		h += acts(
			[
				btn('mailg:', 'All', '', g ? '' : 'on'),
				...MAIL_FILTERS.map((k) => btn(`mailg:${k}`, GROUPS[k], hiddenG(k) ? 'hidden' : '', g === k ? 'on' : '')),
			].join(''),
			'c6',
		); // the six filters, one rank, always the same six in the same places
		// six places a page, always: a short page keeps its height with empty places, so the card never shrinks and Next stays under the finger;
		// a group's preview switch sits between Previous and Next (it had a rank of its own: 11 ranks, and the pager fell below the card)
		const [pg, rows, nav] = pager(
			all.length
				? all.map(
						(m) =>
							`<button class="mr" data-act="${linkOf(m) || 'mailp:0'}" style="--cc:${ccOf(m.cls)}"><b>${m.text}${m.n > 1 ? ` ×${m.n}` : ''}</b><small>${GROUPS[m.grp]} · ${clock(m.t)}${m.why ? ' · ' + m.why : ''}</small></button>`,
					)
				: [info('Nothing here yet', 'each message is kept here as it comes', 'left line')],
			G.mailP,
			'mailp',
			empty(),
			all.length ? `${all.length} ${some(all.length, 'line')}` : '',
			g && g !== 'reply'
				? btn(
						`mailtog:${g}`,
						hiddenG(g) ? 'Show previews' : 'Hide previews',
						hiddenG(g) ? 'red still shows' : 'a preview, then here',
					)
				: empty(),
		);
		G.mailP = pg;
		return h + acts(rows, 'c1') + nav;
	},
	milestone(c) {
		const id = c.page,
			T = id && MS_TEXT[id],
			M = G.ms || [];
		let h = title('Milestones', `${M.length} of ${Object.keys(MS_TEXT).length}`);
		if (T) {
			const [line, why, fix, act] = T;
			h += `<p><b>${msFill(line)}</b></p><p>${msFill(why)}</p>` + acts(btn(act, fix, '', 'go'), 'c1');
		}
		h += M.length
			? list(M.filter((m) => MS_TEXT[m.id]).map((m) => btn(`card:milestone,${m.id}`, MS_TEXT[m.id][0].split(':')[0].replace(/\.$/, ''), clock(m.t), m.id === id ? 'on' : '')), 2) // a slot each, two a rank (E8: chips were 22 tall taps); a milestone cut from the text is left out (N9)
			: '<p class="dim">None yet. Each first (a house, a field, a soldier, a squad, an age) and each hard moment (mud, snow, ice, hunger, fire, a rout) is one, with its why and its fix.</p>';
		return h;
	},
	// the Status page (Albert, Nov 3: the thin strip cut; its state of the realm lives here): the age, the season and the sky, the clock, the rank, then the doors to the Stores, the Score, the Mail and the Sound
	status() {
		scoreAll();
		const p = G.P[0],
			rank = 1 + G.P.filter((q) => q.id && q.id !== WILD && q.score.total > p.score.total).length,
			lim = MODES[G.mode].secs,
			clk = G.wonder ? `${clock(Math.max(0, G.wonder.end - G.t))} to the wonder` : lim ? `${clock(Math.max(0, lim - G.t))} left` : clock(G.t),
			sky = `${season().name}${WEATHER[G.wx] && G.wx !== 'clear' ? ', ' + WEATHER[G.wx].name.toLowerCase() : ''}${G.night > 0.5 ? ', night' : ''}`;
		return (
			title('Status', AGES[p.age].name + ' age') +
			list([
				btn('card:score', `★ ${['1st', '2nd', '3rd', '4th', '5th'][rank - 1] || rank + 'th'}`, `${Math.round(p.score.total)} points`),
				btn('card:stores', 'Stores', 'what you have, and why'),
				btn('mail', 'Mail', G.mailN ? `${G.mailN} unread` : 'nothing new'),
				btn('sound', 'Sound', SND.on ? 'on' : 'off', SND.on ? '' : 'on'),
			]) +
			`<p><b>${clk}</b> · ${sky}.</p>`
		);
	},
	score() {
		scoreAll();
		const rows = G.P.filter((q) => q.id !== WILD),
			cats = [
				['people', 'People'],
				['army', 'Army'],
				['tech', 'Tech'],
				['bld', 'Buildings'],
				['wealth', 'Wealth'],
				['total', 'Score'],
			];
		return (
			title(
				'Score',
				(MODES[G.mode].secs ? `${clock(Math.max(0, MODES[G.mode].secs - G.t))} to the bell` : 'conquest') +
					(levelOf(G.hz) ? ` · level ${levelOf(G.hz)} ×${levelMul().toFixed(1)}` : ''),
			) +
			`<table><tr><th></th>${rows.map((q) => `<th style="border-bottom:3px solid ${q.color}">${q.id === 0 ? 'You' : `<button class="lnk" data-act="seek:${q.id}">${q.name}</button>`}</th>`).join('')}</tr>${cats.map(([k, n]) => `<tr><td>${n}</td>${rows.map((q) => `<td>${q.alive || k === 'total' ? fmt(q.score[k]) : '–'}</td>`).join('')}</tr>`).join('')}</table>` +
			`<p>People and Army: what you hold, cost ÷ ${SCORE.unit}. Tech: research and ages paid ÷ ${SCORE.tech}. Buildings: standing, cost ÷ ${SCORE.bld}. Wealth: everything gathered, traded, found and plundered ÷ ${SCORE.wealth}. ${G.wonder ? `A wonder stands: ${clock(Math.max(0, G.wonder.end - G.t))} left.` : ''}</p>` +
			acts(btn('card:milestone', 'Milestones', `${(G.ms || []).length} of ${Object.keys(MS_TEXT).length}`) + btn('help', 'How to play', 'the guide, the rules, the settings')) // Milestones' door (D-080, Nov 2)
		);
	},
	guide(c) {
		const pg = c.page || 'bld',
			key = `${pg}|${G.P[0].age}|${G.P[0].techs.size}|${G.gq || ''}`; // what the page reads; the Guide pauses the game, so it changes only by a tap
		if (GUIDE_PG.key === key) return GUIDE_PG.h; // hunt B #8: it was rebuilt seven times a second
		GUIDE_PG.key = key;
		return (GUIDE_PG.h =
			title('Guide', 'what leads to what, and why') +
			list(
				[
					['bld', 'Buildings'],
					['unit', 'Units'],
					['tech', 'Research'],
					['age', 'Ages'],
					['civ', 'Peoples'],
					['rule', 'Rules'],
					['hist', 'History'],
				]
					.map(([k, n]) => btn(`guide:${k}`, n, '', pg === k ? 'on' : '')),
			) +
			(pg === 'hist'
				? `<p><b>History · beta.</b> ${HIST_NOTE}</p><input id="gq" class="q" type="search" placeholder="Search: a thing, a place, a date" value="${(G.gq || '').replace(/"/g, '')}" oninput="window.__fkq(this.value)"><div class="row"><button class="lnk" data-act="copyhist">Copy the whole timeline</button></div><div id="gres">${histHTML(G.gq)}</div><p>${HIST_ASK}</p>`
				: guideHTML(pg)));
	},
	sound() {
		const row = (k, name, v) => acts(btn(`vol:${k},-`, '−', '') + info(name, `${Math.round(v * 100)}%`) + btn(`vol:${k},+`, '+', ''), 'c3');
		return (
			title('Sound', '') +
			acts(
				btn('sound', 'Sound', SND.on ? 'on' : 'off', SND.on ? 'on' : '') +
					btn('vibe', 'Vibration', SET.vibe ? 'on' : 'off', SET.vibe ? 'on' : ''),
			) +
			row('all', 'All', SND.vol) +
			row('fx', 'Effects', SET.mix.fx) +
			row('amb', 'Ambience', SET.mix.amb) +
			row('alert', 'Alerts', SET.mix.alert) +
			`<p>Effects: work and battle. Ambience: birds, wind, crickets, thunder. Alerts: horn, ready, done, a new age. The silent switch of your phone mutes the game.</p><p class="dim">${SONG}</p>`
		);
	},
	taps() {
		// what you tap, kept on this phone (33-verbs: tapCount)
		const L = Object.entries(TAPS).sort((a, b) => b[1][0] + b[1][1] - (a[1][0] + a[1][1]));
		return (
			title('Tap counts', 'on this phone only') +
			(L.length
				? `<table><tr><th>Button</th><th>Used</th><th>Greyed</th></tr>${L.map(([k, [n, d]]) => `<tr><td>${k}</td><td>${n}</td><td>${d || ''}</td></tr>`).join('')}</table>`
				: '<p>No taps counted yet.</p>') +
			`<p>Nothing here leaves the phone. Greyed: tapped while the button could not act.</p>`
		);
	},
	help() {
		return (
			title('How to play', `v${BUILD} · ${BUILD_NAME}`) +
			acts(
				btn('guide:bld', 'Guide', 'what leads to what, and why', 'go') +
					btn('guide:rule', 'Rules', 'what triggers what'),
			) +
			`<p><b>Grow:</b> train villagers at the Town Center; + and − under each job move one on or off. Houses give room.</p>
      <p><b>Build:</b> the hammer under People opens every building; it wears a green ring while one goes up. A building waits above your finger: drag it, then tap Build. The cycle button above People turns the row: Jobs, War, Train.</p>
      <p><b>Messages</b> arrive at the top and fade; tap one to see where. × on a group of news asks to hide that group: it then goes quietly to the mail, and red still shows. Numbers wear one colour scale: green gaining, white steady, red losing.</p>
      <p><b>The finger:</b> tap a building or a place and its page opens; tap one of your people to pick them, twice for their page; hold to pick more, or hold and drag on open ground to box a group. With yours picked, tap a target: they attack, hunt, gather, build, mend or walk there. Tap open ground with nobody picked: the sword and ✕ at your finger; the sword sends every soldier there. Pause shows the speeds under the button.</p>
      <p><b>Army:</b> tap open ground with nothing picked, then the sword: All or the idle ones go there; tap an enemy and the same answers come at once. The War page holds your squads (tap one for what it is made of) and the Train page what is being trained.</p>
      <p><b>Forest:</b> trees are a wall until cut. Hold, then drag a box over trees to cut a road.</p>
      <p><b>Trade:</b> caravans sell goods at the four trade stops, or trade with an ally. A Trade post holds a stop.</p>
      <p><b>The world:</b> seasons, weather, harvests and sickness change what pays. Guarded finds wait in every corner.</p>
      <p><b>Win</b> by conquest, a wonder held ${WONDER_HOLD / 60} minutes, or the top score at the bell. Score is top right. The Guide and Rules above hold every number.</p>` +
			settingsHTML() +
			list([
				btn('tips', 'Tips', SET.tips ? 'on' : 'off', SET.tips ? 'on' : ''),
				btn('msgs', 'Messages', SET.msgs !== false ? 'on' : 'off', SET.msgs !== false ? 'on' : ''),
				btn('news', 'World news', SET.news !== false ? 'on' : 'off', SET.news !== false ? 'on' : ''),
				btn('lights', 'Lights', SET.lights !== false ? 'on' : 'off', SET.lights !== false ? 'on' : ''),
				btn('cardpause', 'Pause on cards', SET.cardPause !== false ? 'on' : 'off', SET.cardPause !== false ? 'on' : ''),
				btn('perf', 'Speed counter', SET.perf ? 'on' : 'off', SET.perf ? 'on' : ''),
				btn('soundpage', 'Sound', SND.on ? Math.round(SND.vol * 100) + '%' : 'off'),
				btn('card:taps', 'Tap counts', 'this phone only'),
			]) +
			(SET.hideG && Object.keys(SET.hideG).length
				? acts(btn('mailall', 'Show every group again', Object.keys(SET.hideG).map((g) => GROUPS[g]).join(', ') + ' hidden'), 'c1')
				: '') +
			acts(
				btn(
					'newgame',
					G.confirm === 'new' ? 'Tap again' : 'New game',
					G.confirm === 'new' ? 'this one is lost' : 'pick your people',
					G.confirm === 'new' ? 'warn' : '',
				),
				'c1',
			) +
			`<p>The game saves itself every ${SAVE_EVERY} seconds on this phone. World, game length and people take effect in the next game.</p>`
		);
	},
};
const GUIDE_PG = { key: '', h: '' }; // the Guide's page, built once a page (CARDS.guide)
const FULL = new Set(['setup', 'resume', 'help', 'guide', 'score', 'research', 'menu', 'troops']); // the cards that take the whole height; the Army card with Battalions needs 11 ranks (E8)
const UP_CARDS = new Set(['setup', 'resume']); // the cards that may rise over the top bar (Albert, Nov 3); every other card stops under it, the counts in sight
// three sizes, one mold each (Albert, Build 63), counted in ranks in the style sheet from the floor up: lg every rank that fits under the top
// bar (the Build card, the Guide, Help, Setup); md a thing's card, 10 at most; sm a short one, 8 at most; mold the villager's and an item's
const SIZE_OF = (c) =>
	FULL.has(c.type) || (c.type === 'bld' && (byId(G.blds, c.id) || {}).kind === 'market')
		? 'lg'
		: c.type === 'squad'
			? 'sm'
			: 'md'; // one home for a card's size: the Market is a building card the height of a full one
function renderCard() {
	const c = G.card;
	if (!c || !CARDS[c.type]) return;
	cardPause(c);
	infoBuf = [];
	cardHead = ['', ''];
	cardMold = false;
	let h = CARDS[c.type](c);
	if (h === null) {
		closeCard();
		return;
	}
	const book = infoBuf.join(''),
		bookOn = !!book && G.infoOpen,
		tip = G.techTip && TECHBY[G.techTip];
	h =
		(cardMold ? '' : titleBar(cardHead, !!book, bookOn)) + // a mold card has no title bar: its Info cell opens the book
		(bookOn ? `<div class="infoP">${book}</div>` : '') +
		(tip ? `<div class="infoP">${techBook(tip)}<p>Cost ${costText(tip.cost)} · ${tip.t} s to research.</p></div>` : '') +
		h;
	if (h !== cardSig) {
		cardSig = h;
		patchHTML(cardIn, h);
	}
	const size = cardMold ? 'mold' : SIZE_OF(c);
	for (const s of ['lg', 'md', 'sm', 'mold']) $('card').classList.toggle(s, size === s);
	$('card').classList.toggle('up', UP_CARDS.has(c.type)); // New game and Welcome back rise over the top bar too: no game runs under them
	$('app').classList.add('cardUp'); // the floating buttons step aside while a card stands on the floor (shell-head)
	$('card').hidden = false;
}
$('card').addEventListener(
	'toggle',
	(e) => {
		const id = e.target.dataset && e.target.dataset.f;
		if (id) {
			if (e.target.open) FOLD.add(id);
			else FOLD.delete(id);
		}
	},
	true,
);
