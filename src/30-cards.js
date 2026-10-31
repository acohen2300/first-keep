// ═════ 30-cards.js: the CARDS table, one entry per card type, and renderCard ═════
// ───────────────────────── The cards, one entry each ─────────────────────────
// Each takes the card's description (G.card) and returns its page, or null when what it showed is gone.
const CARDS = {
	bld(c) {
		const b = G.blds.find((x) => x.id === c.id);
		if (!b) return null;
		const p = G.P[0],
			B = BLD[b.kind],
			mine = b.owner === 0,
			P = G.P[b.owner],
			done = b.prog >= 1,
			kp = b.kind === 'keep',
			rel = kp && G.ktab === 'rel',
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
		let h = title(
				bldName(b.owner, b.kind),
				mine
					? 'yours'
					: P.name +
							' · ' +
							(P.lord === 0 ? (P.rebel ? 'in revolt' : 'your vassal') : REL_WORD[G.rel[0][b.owner]].toLowerCase()),
			),
			end = '', // the last rank: Repair and Take down
			book = X.book || ''; // the book: what its kind explains, then what was researched here, then what it is and why
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
			// Repair and Take down share the last rank, both always there so nothing jumps (Albert, Build 63): Repair dim while the building is whole
			end =
				btn(
					`repair:${b.id}`,
					'Repair',
					hurt ? (menders ? `${menders} mending` : costText(repairCost(0, b))) : 'whole',
					hurt ? 'go' : 'dis',
				) +
				(b.prog < 0.15
					? btn(`takedown:${b.id}`, 'Cancel', 'all back')
					: G.confirm === b.id
						? btn(`takedown:${b.id}`, 'Tap again', 'to take down · ' + costText(back), 'warn')
						: btn(`takedown:${b.id}`, 'Take down', costText(back) + ' back')); // last on the card: it is the one you rarely want
		}
		if (mine && done && b.kind === 'market') return h + marketHTML(b, end) + more();
		if (!(mine && kp)) h += infoRank(b, factOf(b, X, crew));
		if (mine) {
			const tr = done && !rel ? trainsAt(b.kind) : [],
				techs = done && !rel ? TECH.filter((t) => ownTech(t) && t.at === b.kind && isNext(0, t)) : [], // one step a line: the next
				did = TECH.filter((t) => t.at === b.kind && p.techs.has(t.id));
			// things you do here now, double-wide, a list: help with a fire, replant, send a builder, send a worker or one out
			h += list(
				[
					b.fire > 0 ? btn(`douse:${b.id}`, 'Send help', 'two more with buckets', 'warn') : '',
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
				list(trainButtons(tr)) +
				(tr.length || b.q.length ? slotsHTML(b) : '') +
				list(
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
						['town', 'Town', 'train and tech'],
						['rel', 'Relations', 'ally, neutral, hostile'],
					],
					rel ? 'rel' : 'town',
					rel ? relHTML() : page + list(end ? [end] : []),
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
		return h + (kp || !end ? '' : acts(end)) + more();
	},
	find(c) {
		const f = G.finds.find((x) => x.id === c.id);
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
		const u = G.units.find((x) => x.id === c.id);
		if (!u) return null;
		const U = UNIT[u.kind],
			o = u.owner,
			S = o === WILD ? U : stats(o, u.kind),
			P = G.P[o],
			mine = o === 0 && u.kind === 'vil';
		if (mine) {
			// the villager's card (MENU-SPEC §8, picture Easy Cards): what they are doing, then health, age and speed, as info cells; Stop · Send
			// home · Dismiss; the job picker, the job ribbon reskinned (Build: whatever is placed next, this one raises it). The rest is in the book
			const [now, more] = statusOf(u).split(' · '),
				sick = u.sick > G.t,
				sure = G.confirm === 'v' + u.id;
			return (
				title(S.name, 'yours') +
				acts(
					info(cap1(now), more || '', 'left line s3') +
						info(`${Math.round(u.hp)}/${Math.round(u.max)}`, sick ? (u.plague ? 'plague' : 'sick') : 'health') +
						info(clock(G.t - (u.bornT || 0)), 'age') +
						info(Math.round(S.spd), 'speed'),
					'c6',
				) +
				acts(
					btn(`vstop:${u.id}`, 'Stop', '', u.job || u.post ? '' : 'dis') +
						btn(`vhome:${u.id}`, 'Send home') +
						btn(`vgo:${u.id}`, sure ? 'Sure?' : 'Dismiss', sure ? 'tap again' : '', sure ? 'warn' : ''),
					'c3',
				) +
				rowHTML(
					JOBS.map((j) => [`vjob:${u.id},${j}`, ICON[j], cap1(j), u.job === j ? 'on' : '']).concat([
						[`pbuild:${u.id}`, ICON.hammer, 'Build', u.job === 'repair' ? 'on' : ''],
					]),
				) +
				fold(
					'about',
					'About',
					`<p><i>Life:</i> ${lifeText(u)}. Hits ${Math.round(S.dmg * 10) / 10}, reach ${Math.round(S.rng)}.</p>` +
						(sick
							? `<p><b>${u.plague ? 'Plague' : 'Sick'}:</b> works and fights at half strength. A Hospital or a medic nearby cures it.</p>`
							: '') +
						`<p>${U.desc}</p>` +
						(WHY[u.kind] ? `<p><i>Why:</i> ${WHY[u.kind]}</p>` : ''),
				)
			);
		}
		let h =
			title(
				S.name,
				o === 0
					? 'yours' + (u.bn !== undefined ? ' · ' + BN[u.bn] : '')
					: o === WILD
						? 'the wild'
						: P.name + (P.civ ? ' · ' + CIVS[P.civ].name : ''),
			) + hpBar(u.hp / u.max, o === WILD ? '#c9b48a' : P.color);
		h += `<p>Health ${Math.round(u.hp)}/${Math.round(u.max)}${U.dmg ? ` · hits ${Math.round(S.dmg * 10) / 10} · reach ${Math.round(S.rng)}` : ''} · speed ${Math.round(S.spd)}${o !== WILD && isSoldier(u) ? ` · takes ${Math.round(S.armor * 100)}% damage` : ''}.</p>`;
		if (o === 0) h += `<p><i>Now:</i> ${statusOf(u)}.</p><p><i>Life:</i> ${lifeText(u)}.</p>`;
		if (o === WILD && U.meat && U.tick === 'wild') {
			const who = unitsOf(0, 'vil').filter((v) => v.hunt === u).length;
			h += acts(btn(`hunt:${u.id}`, 'Send a hunter', who ? `${who} hunting` : 'nobody yet', 'go'), 'c1');
		}
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
	ground(c) {
		// ☰ on the quick action: the rally point, the scout, the spy
		const at = `${Math.round(c.x)},${Math.round(c.y)}`;
		return (
			title('Here', coord(c.x, c.y)) +
			acts(btn(`rally:${at}`, 'New soldiers here', G.rally0 ? 'set: tap to clear' : 'off')) +
			acts(
				(unitsOf(0, 'scout').length ? btn(`scoutgo:${at}`, 'Send the scout', '') : '') +
					(unitsOf(0, 'spy').length ? btn(`spygo:${at}`, 'Send a spy here', 'to look') : ''),
			) +
			fold(
				'about',
				'About',
				`<p>Soldiers you send hold the spot and fight what comes. Drag the map to look around; tap the small map to jump.</p>`,
			)
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
					G.blds.filter((b) => b.owner === 0 && b.prog >= 1 && b.hp > 0 && BLD[b.kind].makes && f(BLD[b.kind].makes)),
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
	setup() {
		// the annoying part before the fun part (Albert): the settings first, then your people, the challenge as ticks, and Start at the foot
		const C = CIVS[SET.civ],
			H = SET.daily ? TODAY_HZ : SET.hz || {},
			lv = levelOf(H), // none ticked: the hazards are drawn by lot when the game starts (Build 70)
			short = (k) => cap1(UNIT[CIVS[k].uu].name.replace(new RegExp('^' + CIVS[k].name + ' ', 'i'), ''));
		let h =
			title('A new game', '') +
			settingsHTML() +
			acts(CIVK.map((k) => btn(`civ:${k}`, CIVS[k].name, '', SET.civ === k ? 'on' : '')).join(''), 'c6 civs') +
			// the people line opens on its history: tap it for why (Albert, Oct 29: put the Why back; one line, so the card still fits one page)
			`<details class="fold civline" data-f="civwhy"${FOLD.has('civwhy') ? ' open' : ''}><summary><b>${short(SET.civ)}</b> · ${C.bonus}</summary>${`<p>Unique soldier: ${UNIT[C.uu].name}, in place of the ${UNIT[UNIT[C.uu].replaces].name.toLowerCase()}. Wonder: ${C.wonder}.</p><p>${WHY['bonus:' + SET.civ]}</p><p>The other three sides take three of the other peoples at random. Every people has the same rules; only the unique soldier, the bonus and the wonder differ.</p>`}</details>` +
			`<button class="tick daily${SET.daily ? ' on' : ''}" data-act="daily"><b>Daily challenge: level ${levelOf(TODAY_HZ)}</b><small>one map for all, today</small></button>` + // one tick, written out (Albert)
			acts(HZK.map((k) => `<button class="tick${H[k] ? ' on' : ''}" data-act="hz:${k}"><b>${HAZARDS[k].name}</b><small>${HAZARDS[k].pts}</small></button>`).join(''), 'c3') +
			fold(
				'about',
				'What each hazard does',
				HZK.map((k) => `<p><b>${HAZARDS[k].name}:</b> ${HAZARDS[k].desc}</p>`).join('') +
					`<p><b>Daily challenge:</b> the same map and the same hazards for everyone, all day. Tick a hazard yourself and it becomes your own game again.</p><p><b>None ticked:</b> each hazard is drawn by lot, even odds, for every side alike; the first message says the level.</p>`,
			);
		if (staleSave)
			h += `<p class="dim">Your last game came from an older version (${staleSave}) and cannot be opened. It is kept aside, not deleted.</p>`;
		return (
			h +
			acts(
				btn(
					SET.daily ? 'today' : 'fresh',
					'Start',
					`${C.name} · ${SET.daily ? 'daily challenge' : MODES[SET.mode].name} · ${lv ? `level ${lv} · score ×${(1 + lv / 10).toFixed(1)}` : 'hazards at random'}`,
					'main',
				),
				'c1',
			) +
			`<p class="dim copy">© Albert Labs, all rights reserved</p>`
		);
	},
	node(c) {
		const n = G.nodes.find((x) => x.id === c.id);
		if (!n) return null;
		const who = unitsOf(0, 'vil').filter((u) => u.node === n).length,
			dr = dropFor(0, n.type, n),
			far = dr ? Math.round(dist(dr, n)) : null,
			dropName = RESOURCES[n.type].drop;
		return (
			title(nodeName(n), `${coord(n.x, n.y)} · ${Math.round(n.amt)} ${n.type} left`) +
			(n.max > 0 && isFinite(n.max) ? hpBar(Math.min(1, n.amt / n.max), RESOURCES[n.type].col) : '') +
			acts(btn(`sendvil:${n.id}`, 'Send a villager here', who ? `${who} working` : 'nobody there yet', 'go'), 'c1') +
			yieldText(n, 0) +
			`<p>${far === null ? `No drop-off for ${n.type} yet: build a ${dropName}.` : far > 110 ? `Nearest drop-off is ${far} away: build a ${dropName} closer.` : `Nearest drop-off: ${far} away.`}</p>` +
			fold(
				'about',
				'About',
				`<p>The nearest idle villager goes; if none is idle, one from the job you hold the most of.</p>`,
			)
		);
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
		{
			// who is doing what, soldier by soldier (Build 42)
			const c = { hold: 0, rally: 0, march: 0, fight: 0, rout: 0 },
				W = { hold: 'holding', rally: 'rallying', march: 'marching', fight: 'fighting', rout: 'routed' };
			for (const u of S) if (c[armyStatus(u)] !== undefined) c[armyStatus(u)]++;
			const line = Object.keys(c)
				.filter((k) => c[k])
				.map((k) => `<b>${c[k]}</b> ${W[k]}`)
				.join(' · ');
			if (line) h += `<p>${line}</p>`;
		}
		const ords = Object.values(G.ords || {}).filter((O) => O.n),
			inc = G.incoming;
		if (inc)
			h +=
				sec('Coming at you') +
				`<p data-act="jump:${Math.round(inc.x)},${Math.round(inc.y)}"><b>${inc.n}</b> ${inc.what} · ${inc.eta} s away</p>`;
		if (ords.length)
			h +=
				sec('Out on orders') +
				ords
					.map(
						(O) =>
							`<p data-act="ordpick:${O.id}"><b>${O.n}</b> ${O.fight ? 'fighting near' : O.arrived ? 'at' : 'marching to'} ${O.label}${!O.arrived && O.eta ? ` · ${O.eta} s` : ''}</p>`,
					)
					.join(''); // tap a line: that group is picked, and the camera goes to it
		h += acts(btn('card:emergency', 'Emergency', 'town square · all hands · shelter', G.emg ? 'warn' : ''));
		if (S.length && hasCmd())
			h +=
				sec('Orders go to') +
				acts(
					[['all', 'All', S.length]]
						.concat(BN.map((n, i) => [i, n, S.filter((u) => u.bn === i).length]))
						.map(([k, n, cnt]) => btn(`sel:${k}`, n, `${cnt}`, G.sel === k ? 'on' : ''))
						.join(''),
					'c4',
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
			h += acts(dialBtns(G.sel));
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
		h += fold('armytrain', 'Train soldiers', acts(trainButtons(kinds)));
		return (
			h +
			fold(
				'about',
				'About orders',
				`<p>Tap open ground, then the sword: All or the idle ones go there, or + aims a mission there. A squad is built on its card (tap it on the War page); War sends squads with a time and odds; a gold ring marks the one picked here.</p><p><b>Temper:</b> ${TEMPER.map((s) => `${s.name}: ${s.note}`).join('. ')}.</p><p><b>Shape:</b> ${FORM.map((F) => `${F.name}: ${F.note}`).join('. ')}. On the march an army goes in column.</p>`,
			)
		);
	},
	menu(c) {
		// the Build menu (MENU-SPEC §8, picture Build Menu): six tabs, a folder; the buildings double-wide, three a rank, words only: the name,
		// how many of how many, the cost. Blue: it fits where you tapped; dim: a later age, or all built. The page holds the height of the
		// biggest tab, so the tabs never move under the finger
		const p = G.P[0],
			M = MENUS.find((m) => m.id === c.id);
		G.lastMenu = c.id;
		const item = (k) => {
			const B = BLD[k],
				lock = B.age > p.age,
				cp = capFor(0, k),
				n = bldsOf(0, k).length,
				full = !lock && n >= cp,
				fits = G.buildAt && G.buildAt.hint === k,
				can = afford(p, B.cost);
			return btn(
				`build:${k}`,
				B.short || bldName(0, k),
				lock
					? `${AGES[B.age].name} age`
					: (cp < 99 ? `${n}/${cp} · ` : '') +
							(full ? 'all built' : can ? costText(B.cost) : `short ${need(B.cost)}`) +
							(fits ? ' · fits here' : ''),
				lock || full ? 'dis' : fits ? 'go' : '',
				lock || full ? undefined : can ? 1 : fillOf(B.cost),
			);
		};
		return (
			title('Build', G.buildAt && G.buildAt.x !== undefined ? 'here' : '') +
			folder(
				'menu',
				MENUS.map((m) => {
					const open = m.items.filter((k) => BLD[k].age <= p.age); // every building the age allows at its limit: the tab says so with a check (Build 61)
					return [m.id, m.name, open.length && open.every((k) => bldsOf(0, k).length >= capFor(0, k)) ? '✓' : ''];
				}),
				c.id,
				`<div class="hold" style="--n:${Math.ceil(Math.max(...MENUS.map((m) => m.items.length)) / 3)}">${list(M.items.map(item))}</div>`,
				'c6',
			) +
			fold('menu', 'What each one does', M.items.map((k) => `<p><b>${bldName(0, k)}:</b> ${BLD[k].desc}</p>`).join(''))
		);
	},
	research: () => researchHTML(),
	// the mail (Build 64): every line kept, newest first, by group; a group can hide its previews here or from the preview's ×
	mail() {
		const M = G.mail || [],
			g = G.mailG,
			show = M.filter((m) => !g || m.grp === g).slice(0, 6);
		let h = title('Mail', g ? GROUPS[g] : `${M.length} kept`);
		h += acts(
			[
				btn('mailg:', 'All', '', g ? '' : 'on'),
				...MAIL_FILTERS.map((k) => btn(`mailg:${k}`, GROUPS[k], hiddenG(k) ? 'hidden' : '', g === k ? 'on' : '')),
			].join(''),
			'c6',
		); // the six filters, one rank, always the same six in the same places
		if (g && g !== 'reply')
			h += acts(
				btn(
					`mailtog:${g}`,
					hiddenG(g) ? 'Show as it comes' : 'Hide the previews',
					hiddenG(g) ? 'now: quietly to the mail, red still shows' : 'now: a preview, then here',
				),
				'c1',
			);
		return (
			h +
			(show.length
				? `<div class="mrows">${show.map((m) => `<button class="mr" data-act="${linkOf(m) || 'mail'}" style="--cc:${ccOf(m.cls)}"><b>${m.text}${m.n > 1 ? ` ×${m.n}` : ''}</b><small>${GROUPS[m.grp]} · ${clock(m.t)}${m.why ? ' · ' + m.why : ''}</small></button>`).join('')}</div>`
				: acts(info('Nothing here yet', 'each message is kept here as it comes', 'left line'), 'c1'))
		);
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
			? `<div class="chips">${M.map((m) => `<span class="chip" data-act="card:milestone,${m.id}">${clock(m.t)} · ${MS_TEXT[m.id][0].split(':')[0].replace(/\.$/, '')}</span>`).join('')}</div>`
			: '<p class="dim">None yet. Each first (a house, a field, a soldier, a squad, an age) and each hard moment (mud, snow, ice, hunger, fire, a rout) is one, with its why and its fix.</p>';
		return h;
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
			acts(btn('help', 'How to play', 'the guide, the rules, the settings'), 'c1')
		);
	},
	guide(c) {
		const pg = c.page || 'bld';
		return (
			title('Guide', 'what leads to what, and why') +
			acts(
				[
					['bld', 'Buildings'],
					['unit', 'Units'],
					['tech', 'Research'],
					['age', 'Ages'],
					['civ', 'Peoples'],
					['rule', 'Rules'],
					['hist', 'History'],
				]
					.map(([k, n]) => btn(`guide:${k}`, n, '', pg === k ? 'on' : ''))
					.join(''),
				pg === 'hist' ? 'c4' : 'c3',
			) +
			(pg === 'hist'
				? `<p><b>History · beta.</b> ${HIST_NOTE}</p><input id="gq" class="q" type="search" placeholder="Search: a thing, a place, a date" value="${(G.gq || '').replace(/"/g, '')}" oninput="window.__fkq(this.value)"><div class="row"><button class="lnk" data-act="copyhist">Copy the whole timeline</button></div><div id="gres">${histHTML(G.gq)}</div><p>${HIST_ASK}</p>`
				: guideHTML(pg))
		);
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
			title('How to play', `build ${BUILD}`) +
			acts(
				btn('guide:bld', 'Guide', 'what leads to what, and why', 'go') +
					btn('guide:rule', 'Rules', 'what triggers what'),
			) +
			`<p><b>Grow:</b> train villagers at the Town Center; + and − under each job move one on or off. Houses give room.</p>
      <p><b>Build:</b> the hammer under People opens every building; it wears a green ring while one goes up. A building waits above your finger: drag it, then tap Build. The cycle button above People turns the row: Jobs, War, Train.</p>
      <p><b>Messages</b> arrive at the top and fade; tap one to see where. × on a group of news asks to hide that group: it then goes quietly to the mail, and red still shows. Numbers wear one colour scale: green gaining, white steady, red losing.</p>
      <p><b>The finger:</b> tap a building or a place and its page opens; tap one of your people to pick them, twice for their page; hold to pick more, or hold and drag on open ground to box a group. With yours picked, tap a target: they attack, hunt, gather, build, mend or walk there. Tap open ground: the quick action at your finger, to send soldiers, build or read about the place. Pause shows the speeds under the button.</p>
      <p><b>Army:</b> tap open ground with nothing picked, then the sword: All or the idle ones go there; tap an enemy and the same answers come at once. The War page holds your squads (tap one for what it is made of) and the Train page what is being trained.</p>
      <p><b>Forest:</b> trees are a wall until cut. Hold, then drag a box over trees to cut a road.</p>
      <p><b>Trade:</b> caravans sell goods at the four trade stops, or trade with an ally. A Trade post holds a stop.</p>
      <p><b>The world:</b> seasons, weather, harvests and sickness change what pays. Guarded finds wait in every corner.</p>
      <p><b>Win</b> by conquest, a wonder held ${WONDER_HOLD / 60} minutes, or the top score at the bell. Score is top right. The Guide and Rules above hold every number.</p>` +
			settingsHTML() +
			acts(
				btn('tips', 'Tips', SET.tips ? 'on' : 'off', SET.tips ? 'on' : '') +
					btn('msgs', 'Messages', SET.msgs !== false ? 'on' : 'off', SET.msgs !== false ? 'on' : '') +
					btn('news', 'World news', SET.news !== false ? 'on' : 'off', SET.news !== false ? 'on' : '') +
					btn('lights', 'Lights', SET.lights !== false ? 'on' : 'off', SET.lights !== false ? 'on' : '') +
					btn(
						'cardpause',
						'Pause on cards',
						SET.cardPause !== false ? 'on' : 'off',
						SET.cardPause !== false ? 'on' : '',
					) +
					btn('soundpage', 'Sound', SND.on ? Math.round(SND.vol * 100) + '%' : 'off') +
					btn('card:taps', 'Tap counts', 'this phone only'),
				'c3',
			) +
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
			) +
			`<p>The game saves itself every ${SAVE_EVERY} seconds on this phone. World, game length and people take effect in the next game.</p>`
		);
	},
};
const FULL = new Set(['setup', 'resume', 'help', 'guide', 'score', 'end', 'research', 'menu']); // the cards that take the whole height
// three sizes, one mold each (Albert, Build 63), counted in ranks in the style sheet: lg every rank that fits above the row (the Build
// card, the Guide, Help, Setup); md a thing's card, 10 at most; sm a short one, 8 at most
const SIZE_OF = (t) => (FULL.has(t) ? 'lg' : t === 'squad' || t === 'emergency' ? 'sm' : 'md');
function renderCard() {
	const c = G.card;
	if (!c || !CARDS[c.type]) return;
	infoBuf = [];
	cardHead = ['', ''];
	let h = CARDS[c.type](c);
	if (h === null) {
		closeCard();
		return;
	}
	const book = infoBuf.join(''),
		bookOn = !!book && G.infoOpen,
		tip = G.techTip && TECHBY[G.techTip];
	h =
		titleBar(cardHead, !!book, bookOn) +
		(bookOn ? `<div class="infoP">${book}</div>` : '') +
		(tip ? `<div class="infoP">${techBook(tip)}<p>Cost ${costText(tip.cost)} · ${tip.t} s to research.</p></div>` : '') +
		h;
	if (h !== cardSig) {
		cardSig = h;
		patchHTML(cardIn, h);
	}
	const cc = G.card;
	$('card').classList.toggle('setup', cc.type === 'setup');
	const size =
		cc.type === 'bld' && (G.blds.find((b) => b.id === cc.id) || {}).kind === 'market' ? 'lg' : SIZE_OF(cc.type);
	for (const s of ['lg', 'md', 'sm']) $('card').classList.toggle(s, size === s);
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
