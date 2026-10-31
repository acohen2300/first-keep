// ═════ 33-verbs.js: every button verb ═════
// ───────────────────────── What every button does: one table ─────────────────────────
// every button's verb, in one table
const ACT = {
	pause() {
		setPause(!G.paused);
		spdPop(G.paused && !G.card);
	}, // paused: the speeds drop down under the button
	spd(a) {
		G.speed = clamp(Number(a), 1, 3);
		spdPop(false);
		if (G.paused) setPause(false);
		paceBtn();
	}, // from the speed drop-down under the play button
	again() {
		$('end').hidden = true;
		openCard({ type: 'setup' });
	},
	free() {
		G.over = null;
		G.free = true;
		$('end').hidden = true;
		setPause(false);
		say('Free play: no clock, no victory.', '', 6);
	},
	next() {
		const p = G.P[0],
			keep = { age: p.age, techs: [...p.techs] };
		$('end').hidden = true;
		newGame(undefined, keep);
		setPause(false);
		say('New land. Your age and research stay.', 'good', 8);
		saveGame(true);
	},
	close() {
		if (G.card && (G.card.type === 'resume' || G.card.type === 'setup') && G.paused) {
			setPause(false);
		}
		closeCard();
		if (G.over) $('end').hidden = false;
	}, // backing out of New game brings the end screen back
	cardback() {
		if (G.card && G.card.from) openCard(G.card.from, true);
		else ACT.close();
	}, // the title bar's back (MENU-SPEC §4): to the card this one was opened from; on the first card it closes
	cancel() {
		cancelPlace();
	},
	placeok() {
		commitPlace();
	},
	wundo() {
		const pl = G.place;
		if (pl && pl.pts) {
			pl.pts.pop();
			wallSet(pl);
			ui(true);
		}
	},
	help() {
		openCard({ type: 'help' });
	},
	reload() {
		location.reload();
	},
	vibe() {
		SET.vibe = !SET.vibe;
		saveSet();
		feel('snap');
		refresh();
	},
	menu(a) {
		const keep = G.card && G.card.type === 'menu';
		openCard({ type: 'menu', id: a });
		if (keep) $('card').scrollTop = 0;
	},
	buildrow() {
		G.buildBy = null;
		if (G.card && G.card.type === 'menu') {
			G.buildAt = null;
			closeCard();
			return;
		}
		const sel = G.card && G.card.type === 'bld' && G.blds.find((b) => b.id === G.card.id && b.owner === 0),
			w = sel || toWorld(cw / 2, ch / 2 + vy),
			hint = suggestAt(w.x, w.y),
			M = hint && MENUS.find((m) => m.items.includes(hint));
		G.buildAt = hint ? { hint } : null;
		openCard({ type: 'menu', id: M ? M.id : G.lastMenu || MENUS[0].id });
	}, // Build opens on what fits the middle of the view   // Build opens the Build card on the menu last used; again, it closes
	idlego() {
		const u = unitsOf(0, 'vil').find(freeVil);
		if (!u) return;
		camGo(u.x, u.y);
		closeCard();
	},
	seek(a) {
		const o = Number(a),
			k = keepOf(o) || G.blds.find((b) => b.owner === o);
		if (!k) {
			say('Nothing of theirs stands.', '', 3);
			return;
		}
		camGo(k.x, k.y);
		if (k.kind === 'keep') openCard({ type: 'bld', id: k.id });
		else closeCard();
	},
	guide(a) {
		openCard({ type: 'guide', page: a });
	},
	copy(id) {
		const t = histRows().find((x) => x.id === id);
		if (t) clip(histText(t));
	},
	copyhist() {
		clip(`First Keep history (build ${BUILD}). ${HIST_NOTE}\n\n` + histRows().map(histText).join('\n'));
	},
	info() {
		G.infoOpen = !G.infoOpen;
		cardSig = '';
		renderCard();
	},
	map() {
		SET.mini = !SET.mini;
		saveSet();
		applyMini();
	},
	home() {
		const k = keepOf(0);
		if (k) camGo(k.x, k.y);
	},
	resume() {
		const S = readSave();
		if (S) loadGame(S);
		else {
			closeCard();
			setPause(false);
		}
		refresh();
	},
	fresh() {
		clearSave();
		holdSave = false;
		newGame();
		closeCard();
		setPause(false);
		saveGame(true);
		refresh();
	},
	newgame() {
		if (G.confirm === 'new') {
			openCard({ type: 'setup' });
			return;
		}
		G.confirm = 'new';
		refresh();
	},
	civ(a) {
		SET.civ = a;
		saveSet();
		refresh();
	},
	tension(a) {
		SET.tension = a;
		saveSet();
		refresh();
	},
	diff(a) {
		SET.diff = a;
		SET.tension = a === 'easy' ? 'winner' : 'diplomacy'; // the difficulty sets the tension; the toggle below can change it
		G.diff = a;
		saveSet();
		refresh();
	},
	mode(a) {
		SET.mode = a;
		saveSet();
		refresh();
	},
	scen(a) {
		SET.scen = SCENARIOS[a] ? a : 'open';
		saveSet();
		refresh();
	},
	fantasy(a) {
		SET.fantasy = a === '1';
		saveSet();
		refresh();
	},
	daily() {
		SET.daily = !SET.daily;
		saveSet();
		refresh();
	}, // the challenge of the day: its map and its hazards
	hz(a) {
		if (SET.daily) {
			SET.daily = false;
			SET.hz = { ...TODAY_HZ };
		} else SET.hz = { ...SET.hz };
		SET.hz[a] = SET.hz[a] ? 0 : 1;
		saveSet();
		refresh();
	}, // a hazard on or off; the points add up to the level
	today() {
		clearSave();
		holdSave = false;
		newGame(todaySeed());
		closeCard();
		setPause(false);
		saveGame(true);
		refresh();
		say(`Challenge of the day: level ${levelOf(G.hz)}.`, 'good', 8);
	},
	tips() {
		SET.tips = !SET.tips;
		saveSet();
		refresh();
	},
	msgs() {
		SET.msgs = SET.msgs === false;
		saveSet();
		refresh();
	},
	news() {
		SET.news = SET.news === false;
		saveSet();
		refresh();
	},
	fog(a) {
		SET.fog = a === '1'; // for the next game; a game keeps the fog it started with
		saveSet();
		refresh();
	},
	lights() {
		SET.lights = SET.lights === false;
		saveSet();
		refresh();
	},
	cardpause() {
		SET.cardPause = SET.cardPause === false;
		saveSet();
		refresh();
	},
	qlock(id) {
		const t = TECHBY[id];
		say(`Research ${t.name} at the ${BLD[t.at].name} for more slots.`, '', 5);
	},
	page(a) {
		hudPage(a);
		feel('tick');
	}, // a page of the row by name (a milestone's button)
	pvx() {
		const m = shownMsg();
		if (!m) return;
		m.ru = 0;
		if (m.grp !== 'reply' && !urgentCls(m.cls) && !hiddenG(m.grp)) G.pvAsk = m.grp; // × on news asks once: hide this group?
		ui(true);
	},
	pvhide(g) {
		(SET.hideG = SET.hideG || {})[g] = 1;
		saveSet();
		G.pvAsk = null;
		say(`${GROUPS[g]} now goes quietly to the mail.`, '', 3);
	}, // the group goes to the mail without a preview; red still comes through
	pvkeep() {
		G.pvAsk = null;
		ui(true);
	},
	mail() {
		G.mailN = 0;
		openCard({ type: 'mail' });
	},
	mailg(g) {
		G.mailG = g && G.mailG !== g ? g : null;
		refresh();
	},
	mailtog(g) {
		const H = (SET.hideG = SET.hideG || {});
		if (H[g]) delete H[g];
		else H[g] = 1;
		saveSet();
		refresh();
	},
	mailall() {
		SET.hideG = {};
		saveSet();
		refresh();
	},
	sound() {
		SND.on = !SND.on;
		saveSnd();
		sndInit();
		sfx('tap');
		muteBtn();
		refresh();
	},
	soundpage() {
		openCard({ type: 'sound' });
	},
	// one step rule for every volume: tenths, 0 to 100%
	vol(a) {
		const [k, d] = a.split(','),
			step = (v) => clamp(Math.round((v + (d === '+' ? 0.1 : -0.1)) * 10) / 10, 0, 1);
		if (k === 'all') SND.vol = step(SND.vol);
		else SET.mix[k] = step(SET.mix[k]);
		saveSnd();
		sndInit();
		sfx(k === 'amb' ? 'bird' : k === 'alert' ? 'ready' : 'tap');
		refresh();
	},
	ordpick(a) {
		const id = Number(a),
			O = G.ords && G.ords[id],
			S = G.units.filter((u) => u.owner === 0 && u.ord === id && u.hp > 0 && !u.inside);
		if (!S.length) return;
		closeCard();
		setPick(S.map((u) => ({ t: 'unit', id: u.id })));
		if (O && O.cx !== undefined) camGo(O.cx, O.cy);
	}, // a group on the march: picked, and the camera goes to it (the Army card line, the ring on the map)
	pfollow() {
		G.follow = !G.follow;
		ui(true);
	}, // the camera follows what is picked, until you drag, pinch or tap the small map
	techgo(id) {
		ACT.bldgo(TECHBY[id].at);
	}, // the research card's ›: to the building where it is learned, its card open
	bldgo(kind) {
		const k = keepOf(0),
			B = G.blds.filter((b) => b.owner === 0 && b.kind === kind && b.prog >= 1 && b.hp > 0).sort((a, b) => (k ? dist(a, k) - dist(b, k) : 0))[0];
		if (!B) return say(`Build a ${BLD[kind].name} first.`, '', 3);
		camGo(B.x, B.y);
		openCard({ type: 'bld', id: B.id });
	}, // to your nearest finished building of a kind, its card open: a kind of soldier on the Train page or a squad's card goes to where it is trained
	jump(a) {
		const [x, y] = a.split(',').map(Number);
		camGo(x, y);
	},
	card(a) {
		const [type, page] = a.split(',');
		openCard(page ? { type, page } : { type });
	},
	storesk(a) {
		G.storesK = G.storesK === a ? null : a;
		refresh();
	}, // the Stores card: tap a row for its why
	open(a) {
		const [type, id] = a.split(',');
		openCard({ type, id: Number(id) });
	},
};
// a job is locked until its age (32-frame, resOn): a tap on it says when it opens
const shut = (r) => !resOn(KEY[r]) && (say(`${RESOURCES[r].name} opens in the ${AGES[resAge(KEY[r])].name} age.`, '', 3), true);
// orders that change the game: refused once it is over
const PLAY = {
	job(a) {
		if (shut(a)) return;
		G.P[0].rally = G.P[0].rally === a ? null : a; // tap the lit tile again and no job is the default: new villagers wait at the Town Center (Build 61)
		if (G.P[0].rally)
			unitsOf(0, 'vil').forEach((u) => {
				if (!u.job) u.job = a;
			});
	},
	move(a) {
		if (shut(a)) return;
		if (!unitsOf(0, 'vil').some(freeVil)) {
			say('Nobody is idle. Use − on another job.', '', 3);
			return;
		}
		moveVil(0, a);
	},
	less(a) {
		moveVil(0, a, true);
	},
	ktab(a) {
		G.ktab = a;
	},
	sel(a) {
		G.sel = a === 'all' ? 'all' : Number(a);
	},
	sendto(a) {
		const [f, x, y] = a.split(','),
			e = { x: Number(x), y: Number(y) },
			S = sendPick(/^(all|rest)$/.test(f) ? f : Number(f), e);
		if (S.length) order(S, { t: 'ground', e });
		else say(freeWhy(), '', 4);
		hideStrip();
	},
	emg(a) {
		emgStart(a);
		hudPage('jobs');
		ACT.home();
		closeCard();
	},
	emgresume() {
		emgResume();
		closeCard();
	},
	pagecycle() {
		pageCycle();
	}, // the cycle button above slot 1: Jobs, War, Train (Build 70)
	tsq() {
		const n = G.recruitSq;
		G.recruitSq = n === null || n === undefined ? 0 : n + 1 >= BNS ? null : n + 1;
		feel('tick');
	}, // which squad new soldiers join: none, Squad A … Squad D
	tq(a) {
		const [t, d] = a.split(','),
			k = kindOf(Number(t));
		if (!k) return say(`Build a ${BLD[CLS[t][2]].name} first.`, '', 3);
		if (d === '+') {
			const why = trainWhy(0, k);
			if (why) say(why, '', 3);
			else train(0, k);
		} else if (!unTrain(0, k)) say('Nothing of that kind is waiting.', '', 3);
	}, // the Train page: one more or one fewer of a kind, at the building with the shortest line
	tok() {
		setRally();
	},
	tcancel() {
		G.hud.aim = false;
		hudPage('jobs');
	},
	intent(a) {
		const [i, k] = a.split(',').map(Number);
		G.bnIntent[i] = k;
		feel('tick');
	}, // a squad's intent: one of three, chosen
	back(a) {
		const u = G.units.find((v) => v.id === Number(a));
		if (!u) return;
		if (u.pj || u.was) setJob(u, u.pj || u.was);
		else if (G.P[0].rally) setJob(u, G.P[0].rally);
		else return say('No work to go back to.', '', 3);
		u.post = null;
		closeCard();
	}, // the worker card: back to the work it had
	waim() {
		const H = G.hud;
		H.aim = true;
		H.h = { t: 'ground', e: { x: cam.x, y: cam.y } };
		H.moved = false;
		feel('tick');
	}, // the crosshair to the middle of the screen
	torders() {
		const H = G.hud;
		H.aim = true;
		H.mode = 'rally';
		if (G.rally0) H.h = { t: 'ground', e: { x: G.rally0.x, y: G.rally0.y } };
		say('Tap where new soldiers should go, then ✓.', '', 4);
		feel('tick');
	},
	sqpk(a) {
		const [i, t, d] = a.split(',');
		sqPlan(Number(i), CLS[t][0], d === '+' ? 1 : -1);
	}, // a squad card's − and + under a kind
	sqcancel() {
		const c = G.card;
		G.bnPlan[c.i] = { ...c.was.plan };
		G.bnIntent[c.i] = c.was.intent;
		rebattalion();
		ACT.cardback();
	}, // Cancel: the squad as the card found it, and back
	sqsave() {
		ACT.cardback();
	}, // Save ✓: the changes stand (they took at once), and back
	whome() {
		hudHome();
	},
	wsq(a) {
		const i = Number(a);
		if (!hasCmd() && !sqOut(i)) return say('Squads come with Battalions.', '', 3);
		openCard({ type: 'squad', i });
	}, // a squad's card: built at home, watched on its mission; an empty squad opens as a new one
	wfire() {
		hudGo();
	},
	wabort() {
		hudAbortAll();
	}, // Abort: every mission out comes home
	hdel(a) {
		hudAbort(Number(a));
	},
	hudrein(a) {
		hudReinforce(Number(a));
	},
	nostrip() {
		hideStrip();
	},
	commander() {
		const s = G.stripAt;
		hideStrip();
		hudPage('war');
		if (s) G.hud.h = { t: 'ground', e: { x: s.x, y: s.y } };
		G.hud.moved = true;
	}, // the strip's third answer: the War page, its crosshair already on the spot
	nofree() {
		say(freeWhy(), '', 4);
		hideStrip();
	}, // the sword with nobody to send says why
	striparmy() {
		const s = G.stripAt;
		if (s) showStrip(s.sx, s.sy, s.x, s.y, 1);
	},
	strippeople() {
		const s = G.stripAt;
		if (s) showStrip(s.sx, s.sy, s.x, s.y, 2);
	},
	idleto(a) {
		const [x, y] = a.split(',').map(Number);
		let n = 0;
		for (const u of unitsOf(0, 'vil'))
			if (freeVil(u) && !postedAt({ x, y }).includes(u)) ((u.post = { x: x + u.ox, y: y + u.oy }), n++);
		say(n ? `${n} idle villagers come here.` : 'No villager is idle.', '', 3);
		hideStrip();
	},
	wkhere(a) {
		// dial the villagers standing at a spot: + brings one more (an idle one, else the one earning least), − sends one home
		const [d, x, y] = a.split(','),
			to = { x: Number(x), y: Number(y) },
			s = G.stripAt;
		if (d === '+') {
			const v = pickVil(0, to);
			if (!v) say('No villager is free.', '', 3);
			else stopVil(v, { x: to.x + v.ox, y: to.y + v.oy });
		} else {
			const v = postedAt(to).pop();
			if (v) v.post = null;
		}
		if (s) showStrip(s.sx, s.sy, s.x, s.y, 2);
	},
	buildhere(a) {
		const [x, y] = a.split(',').map(Number),
			hint = suggestAt(x, y),
			M = hint && MENUS.find((m) => m.items.includes(hint));
		hideStrip();
		G.buildAt = { x, y, hint };
		openCard({ type: 'menu', id: M ? M.id : G.lastMenu || MENUS[0].id });
	}, // the hammer on open ground: the menu, on what fits there
	more(a) {
		const [x, y] = a.split(',').map(Number);
		openCard({ type: 'ground', x, y });
	},
	qsfrom(a) {
		G.qs.from = a === 'all' ? 'all' : Number(a);
	},
	qsn(a) {
		const [k, d] = a.split(','),
			have = qsPool().filter((u) => u.kind === k).length,
			cur = Math.min(have, G.qs.n[k] ?? have);
		G.qs.n[k] = clamp(cur + (d === '+' ? 1 : -1), 0, have);
	},
	qgo(a) {
		const [x, y] = a.split(',').map(Number),
			e = { x, y };
		order(qsPick(e), { t: 'ground', e });
		closeCard();
	},
	qatk(a) {
		const e = G.blds.find((x) => x.id === Number(a) && x.hp > 0);
		if (e) order(qsPick(e), { t: 'bld', e });
		closeCard();
	},
	qfoe(a) {
		const e = G.units.find((x) => x.id === Number(a) && x.hp > 0);
		if (e) order(qsPick(e), { t: 'unit', e });
		closeCard();
	},
	muster(a) {
		const i = Number(a);
		if (muster(0, musterGap(i), i)) sfx('place');
		else sfx('err');
	},
	shape(a) {
		cycle('form', a, FORM.length);
	},
	temper(a) {
		cycle('temper', a, TEMPER.length);
	},
	sendvil(a) {
		sendVil(0, Number(a));
	},
	sendout(a) {
		sendOut(0, Number(a));
	},
	vstop(a) {
		const u = unitsOf(0, 'vil').find((x) => x.id === Number(a));
		if (u) stopVil(u, null);
	},
	vhome(a) {
		const u = unitsOf(0, 'vil').find((x) => x.id === Number(a)),
			k = keepOf(0);
		if (u) stopVil(u, k ? { x: k.x + u.ox, y: k.y + halfOf(k) + 8 + u.oy } : null);
		closeCard();
	}, // the worker card: Home, to the Town Center and idle
	stopall() {
		const k = keepOf(0);
		let n = 0;
		for (const u of unitsOf(0, 'vil'))
			if (u.job || u.post) (stopVil(u, k ? { x: k.x + u.ox, y: k.y + halfOf(k) + 8 + u.oy } : null), n++);
		say(n ? `${n} villagers stop: to the Town Center.` : 'Nobody was working.', '', 4);
	},
	idlehere() {
		const c = toWorld(cw / 2, ch / 2);
		let n = 0;
		for (const u of unitsOf(0, 'vil')) if (freeVil(u)) ((u.post = { x: c.x + u.ox, y: c.y + u.oy }), n++);
		say(n ? `${n} idle villagers come here.` : 'No villager is idle.', '', 4);
		closeCard();
	},
	replant(a) {
		const b = G.blds.find((x) => x.id === Number(a) && x.owner === 0);
		if (!b) return;
		const why = replantWhy(0, b);
		if (why) say(why, '', 3);
		else replant(0, b.id);
	},
	boxcut(a) {
		if (G.card && G.card.type === 'box') boxCut(G.card.r, Number(a));
		closeCard();
	},
	unpick() {
		setPick([]);
	},
	pattack(id) {
		const e = G.units.find((u) => u.id === Number(id));
		const S = armyOf(0).filter(isSoldier);
		if (e && S.length) {
			order(S, { t: 'unit', e });
			setPick([]);
		}
	},
	look(id) {
		const e = G.units.find((u) => u.id === Number(id));
		if (e) {
			setPick([]);
			openCard({ type: 'unit', id: e.id });
		}
	},
	pjob(j) {
		for (const u of picked())
			if (u.kind === 'vil') {
				setJob(u, j);
				u.pj = null;
				u.post = null;
				u.idleT = 0;
			}
		say(`To ${j}.`, '', 2);
		setPick([]);
	},
	pbuild() {
		G.buildBy = picked()
			.filter((u) => u.kind === 'vil')
			.map((u) => u.id);
		setPick([]);
		openCard({ type: 'menu', id: G.lastMenu || MENUS[0].id });
	}, // whatever you place next, the picked villagers raise it
	phold() {
		for (const u of picked())
			if (isSoldier(u)) {
				u.state = 'goto';
				u.px = u.x;
				u.py = u.y;
				u.focus = null;
				u.tgt = null;
				u.idleT = 2; // stopped at once: Holding, and free for the next send
				u.ord = undefined; // and off the old order
			}
		say('Holding here.', '', 2);
	},
	precall() {
		sendHome(picked().filter(isSoldier));
		say('Called home.', '', 2);
	},
	pvil() {
		setPick(
			picked()
				.filter((u) => u.kind === 'vil')
				.map((u) => ({ t: 'unit', id: u.id })),
		);
	},
	pcharge() {
		const S = picked();
		if (!charge(0, S)) say(chargeWhy(0, S) || 'Not now.', '', 3);
	},
	pfall() {
		fallBack(0, picked());
	},
	pteach() {
		const S = picked().filter((u) => isSoldier(u) && teachTo(u));
		let n = 0,
			why = null;
		for (const u of S) {
			if (teach(0, u)) n++;
			else why = why || teachWhy(0, u);
		}
		say(n ? `${n} to the School.` : why || 'Nobody here can be taught.', n ? 'good' : '', 3);
	},
	teach(id) {
		const u = G.units.find((x) => x.id === +id);
		if (u && !teach(0, u)) say(teachWhy(0, u) || 'Not now.', '', 3);
	},
	charge() {
		const S = orderSet(),
			bn = G.sel === 'all' ? undefined : G.sel;
		if (!charge(0, S, bn)) say(chargeWhy(0, S, bn) || 'Not now.', '', 3);
	},
	fallback() {
		fallBack(0, orderSet(), G.sel === 'all' ? undefined : G.sel);
		closeCard();
	},
	// relations and a lord's hand: one verb each, the reason on the card when it cannot be done
	rel(a) {
		const [q, want] = a.split(',');
		if (!setRel(0, Number(q), want)) say(relWhy(0, Number(q), want) || 'Not now.', '', 3);
	},
	breakties(a) {
		if (G.confirm !== 'bt' + a) {
			G.confirm = 'bt' + a;
			return;
		}
		G.confirm = null;
		breakTies(0, Number(a));
	},
	demand(a) {
		const [q, r] = a.split(',');
		if (!demand(0, Number(q), r)) say(demandWhy(0, Number(q), r) || 'Not now.', '', 3);
	},
	tribute(a) {
		if (!forceTribute(0, Number(a))) say(tributeWhy(0, Number(a)) || 'Not now.', '', 3);
	},
	levy(a) {
		const [q, n] = a.split(',').map(Number);
		if (!levy(0, q, n === 0 ? levyRoom(0, q) : n)) say(levyWhy(0, q, n || 1) || 'Not now.', '', 3);
	},
	release(a) {
		releaseAll(0, Number(a));
	},
	qcancel(a) {
		const [b, i] = a.split(',').map(Number),
			B = G.blds.find((x) => x.id === b);
		if (B && cancelOrder(0, B, i)) sfx('err');
	},
	sellat(a) {
		const [f, k] = a.split(','),
			F = G.finds.find((x) => x.id === Number(f));
		if (F && F.owner === 0) {
			F.sell = F.sell || Object.fromEntries(WARES.map((w) => [w, 1]));
			F.sell[k] = F.sell[k] ? 0 : 1;
		}
	},
	debase() {
		if (!debase(0)) say('Needs a finished Mint, once a game.', '', 3);
	},
	surrender(a) {
		demandSurrender(0, Number(a));
		closeCard();
	},
	overlord(a) {
		if (!offerOverlord(0, Number(a))) say(overlordWhy(0, Number(a)) || 'Not now.', '', 3);
	},
	tax(a) {
		const [q, t] = a.split(','),
			P = G.P[Number(q)];
		if (P && P.lord === 0 && TAX[t]) {
			P.tax = t;
			say(`Tax on ${P.name}: ${t}.`, '', 3);
		}
	},
	venture(a) {
		if (!venture(0, Number(a))) say('Needs Medieval age, gold; 3 at most.', '', 4);
	},
	douse(a) {
		const b = G.blds.find((x) => x.id === Number(a) && x.owner === 0);
		let n = 0;
		if (b && b.fire > 0)
			for (let i = 0; i < 2; i++) {
				const v = pickVil(0, b, null, b);
				if (v) {
					if (v.job !== 'repair') v.pj = v.job;
					setJob(v, 'repair');
					v.rep = b;
					v.fireman = true;
					n++;
				}
			}
		G.mail = (G.mail || []).filter((m) => m.act !== 'douse:' + a);
		if (n) say(`${n} more run to the fire.`, '', 3);
		else if (b && b.fire > 0) say('No villager is free.', '', 3);
	},
	tpost(a) {
		const f = G.finds.find((x) => x.id === Number(a));
		if (!f) return;
		const why = canPlace(0, 'tpost', f.x, f.y);
		if (why) {
			say(why + '.', '', 3);
			return;
		}
		if (!afford(G.P[0], BLD.tpost.cost)) {
			say(`Not enough: ${costText(BLD.tpost.cost)}.`, '', 3);
			return;
		}
		if (G.P[0].age < BLD.tpost.age) {
			say('Trade posts need the Bronze age.', '', 3);
			return;
		}
		build(0, 'tpost', f.x, f.y);
		say('A villager sets out to build the trade post.', '', 4);
	},
	want(a) {
		const f = G.finds.find((x) => x.id === Number(a));
		if (f && f.owner === 0) {
			f.want = WARES[(WARES.indexOf(f.want) + 1) % WARES.length];
		}
	},
	route(a) {
		const [cid, s, id] = a.split(','),
			c = G.units.find((u) => u.id === Number(cid) && u.owner === 0),
			t = s === 's' ? G.finds.find((f) => f.id === Number(id)) : G.blds.find((b) => b.id === Number(id));
		if (c && t) {
			if (!homeBiz(0, c)) {
				say('Build a Market first.', '', 4);
				return;
			}
			setRoute(c, t, true, s === 's');
			say('The caravan runs the route on repeat.', '', 3);
		}
	},
	make(a) {
		const [b, t] = a.split(','),
			B = G.blds.find((x) => x.id === Number(b) && x.owner === 0);
		if (B) setMake(B, t);
	},
	routeto(a) {
		const f = G.finds.find((x) => x.id === Number(a));
		if (!f || !homeBiz(0, f)) {
			say('Build a Market first.', '', 4);
			return;
		}
		const c = unitsOf(0, 'caravan').sort((p, q) => !!p.route - !!q.route || dist(p, f) - dist(q, f))[0];
		if (!c) {
			say('No caravan: train one at the Market.', '', 3);
			return;
		}
		setRoute(c, f, true, true);
		say('A caravan takes the route, on repeat.', '', 3);
	},
	rrep(a) {
		const c = G.units.find((u) => u.id === Number(a));
		if (c && c.route) c.route.rep = !c.route.rep;
	},
	rsp(a) {
		const c = G.units.find((u) => u.id === Number(a));
		if (c && c.route) c.route.spice = !c.route.spice;
	},
	rclr(a) {
		const c = G.units.find((u) => u.id === Number(a));
		if (c) {
			c.route = null;
			c.dest = null;
		}
	},
	sendbld(a) {
		sendBuild(0, Number(a));
	},
	buildat(a) {
		const [v, s] = a.split(',').map(Number);
		sendBuild(0, s, v);
	},
	hunt3(a) {
		for (let i = 0; i < 3; i++) sendHunt(0, Number(a));
	},
	hunt(a) {
		sendHunt(0, Number(a));
	},
	repair(a) {
		sendRepair(0, Number(a));
	},
	takedown(a) {
		const id = Number(a),
			b = G.blds.find((x) => x.id === id && x.owner === 0);
		if (b && b.kind !== 'keep') {
			if (BLD[b.kind].wallish || b.prog < 0.15 || G.confirm === id) {
				demolish(0, id);
				G.confirm = null;
				closeCard();
			} else G.confirm = id;
		}
	},
	train(a) {
		if (!train(0, a)) say(trainWhy(0, a) || 'Not now.', '', 3);
	},
	tech(a) {
		if (!research(0, a)) say(researchWhy(0, a) || 'Not now.', '', 3);
	},
	age() {
		ageUp(0);
	},
	build(a) {
		startPlace(a);
	},
	scoutgo(a) {
		const [x, y] = a.split(',').map(Number),
			s = unitsOf(0, 'scout')[0];
		if (s) {
			s.state = 'goto';
			s.px = x;
			s.py = y;
			say('The scout rides out.', '', 3);
		}
		closeCard();
	},
	rally(a) {
		const [x, y] = a.split(',').map(Number);
		G.rally0 = G.rally0 ? null : { x, y };
	},
	recall() {
		sendHome(orderSet());
		closeCard();
	},
	attack(a) {
		const target = a === 'near' ? foeNearest() : Number(a);
		if (target !== null) {
			orderSet().forEach((u) => {
				u.state = 'attack';
				u.target = target;
				u.bid = null;
			});
			say(`Marching on the ${G.P[target].name}.`, '', 3);
		}
		closeCard();
	},
	gift(a) {
		const [, amt] = a.split(',').map(Number);
		if (!giveGift(0, amt)) say(giftWhy(0, amt) || 'Not now.', '', 3);
	},
	ransom(a) {
		if (!payRansom(0, Number(a))) say('Not enough gold.', '', 3);
	},
	stand() {
		if (!standDown(0)) say('No spare soldiers at home to stand down.', '', 3);
	},
	vjob(a) {
		const [id, j] = a.split(','),
			u = G.units.find((x) => x.id === Number(id));
		if (u && u.owner === 0) {
			setJob(u, u.job === j ? null : j);
			u.pj = null;
			u.idleT = 0;
		}
	},
	vgo(a) {
		const u = G.units.find((x) => x.id === Number(a));
		if (!u) return;
		if (G.confirm !== 'v' + u.id) {
			G.confirm = 'v' + u.id;
			return;
		}
		G.confirm = null;
		setJob(u, null);
		u.hp = 0;
		u.gone = true;
		say('A villager was sent home.', '', 3);
		closeCard();
	},
	dismiss() {
		const v = unitsOf(0, 'vil').sort((a, b) => a.carry - b.carry)[0];
		if (v) {
			setJob(v, null);
			v.hp = 0;
			v.gone = true;
			say('A villager was sent home.', '', 3);
		}
	},
	sab(a) {
		const b = G.blds.find((x) => x.id === Number(a)),
			sp =
				b &&
				unitsOf(0, 'spy')
					.filter((u) => u.state !== 'sab')
					.sort((x, y) => dist(x, b) - dist(y, b))[0];
		if (!b || !BLD[b.kind].sab || !sp) {
			say(!sp ? 'You have no free spy.' : 'That cannot be sabotaged.', '', 3);
			return;
		}
		sp.state = 'sab';
		sp.tid = b.id;
		say('A spy slips away to sabotage it.', '', 4);
		closeCard();
	},
	spygo(a) {
		const [x, y] = a.split(',').map(Number),
			sp = unitsOf(0, 'spy')
				.filter((u) => u.state !== 'sab')
				.sort((p, q) => dist(p, { x, y }) - dist(q, { x, y }))[0];
		if (!sp) {
			say('You have no free spy.', '', 3);
			return;
		}
		sp.state = 'goto';
		sp.px = x;
		sp.py = y;
		say('A spy goes to look.', '', 3);
		closeCard();
	},
	shrine(a) {
		const f = G.finds.find((x) => x.id === Number(a)),
			pr = f && unitsOf(0, 'priest').sort((p, q) => dist(p, f) - dist(q, f))[0];
		if (!pr) {
			say('You have no priest: Build → Temple.', '', 3);
			return;
		}
		pr.state = 'shrine';
		pr.fid = f.id;
		say('A priest walks to the shrine.', '', 3);
		closeCard();
	},
	hire(a) {
		const f = G.finds.find((x) => x.id === Number(a));
		if (f && !hire(0, f)) say(hireWhy(0, f), '', 3);
	},
	guard(a) {
		const [t, i] = a.split(','),
			id = Number(i),
			at = t === 'f' ? G.finds.find((f) => f.id === id) : G.units.find((v) => v.id === id);
		if (!at) return;
		const room = POST.guard - guardsOf(t, id).length,
			S = sendable()
				.sort((p, q) => dist(p, at) - dist(q, at))
				.slice(0, Math.max(0, Math.min(4, room)));
		S.forEach((u) => {
			u.state = 'escort';
			u.esc = null;
			u.focus = null;
			if (t === 'f') {
				u.escF = id;
				u.escId = undefined;
			} else {
				u.escId = id;
				u.escF = undefined;
			}
		});
		if (S.length) ripple(at.x, at.y, '#ffd35e');
	},
	unguard(a) {
		const [t, i] = a.split(',');
		guardsOf(t, Number(i)).forEach((u) => {
			u.state = 'home';
			u.esc = null;
			u.escId = u.escF = undefined;
		});
	},
	trade(a) {
		const [dir, k] = a.split(':');
		if (!marketTrade(0, k, dir)) say(dir === 'sell' ? 'Not enough to sell.' : 'Not enough gold.', '', 3);
	},
	zeal() {
		if (!zeal(0, orderSet())) say(zealWhy(0, orderSet()) || 'Not now.', '', 3);
	},
};
function act(a) {
	const [verb, arg] = a.split(/:(.*)/s);
	if (ACT[verb]) {
		ACT[verb](arg);
		return;
	}
	if (G.over || !PLAY[verb]) return;
	PLAY[verb](arg);
	learnAct(verb, arg);
	refresh();
}
// Hints retire once learned: each counts the times you did what it teaches, kept on this phone; at 3 it is not shown again. Warnings (hunger, fire, plague, unrest) always show.
const L = (k) => ((SET.learned || {})[k] || 0) >= 3;
function learn(k) {
	SET.learned = SET.learned || {};
	if ((SET.learned[k] || 0) >= 3) return;
	SET.learned[k] = (SET.learned[k] || 0) + 1;
	saveSet();
}
function learnAct(verb, arg) {
	if (verb === 'train') learn('train:' + arg);
	else if (verb === 'move' || verb === 'job') {
		learn('job');
		learn('job:' + arg);
	} else if (verb === 'sendvil') {
		learn('job');
		const n = G.nodes.find((x) => x.id === Number(arg));
		if (n) learn('job:' + (n.kind === 'farm' && n.type === 'food' ? 'field' : n.type));
	} else if (['sendbld', 'buildat', 'age', 'trade'].includes(verb)) learn(verb === 'buildat' ? 'sendbld' : verb);
}
let lpT = 0,
	lpDone = false;
const lpStop = () => clearTimeout(lpT);
document.addEventListener('pointerdown', (e) => {
	lpStop();
	lpDone = false;
	const el = e.target.closest('[data-act^="tech:"]');
	if (el)
		lpT = setTimeout(() => {
			lpDone = true;
			feel('snap');
			G.techTip = el.dataset.act.slice(5);
			renderCard();
		}, 450);
}); // hold a research step: what it does, the number, the date, the weight and why, the cost
for (const ev of ['pointerup', 'pointercancel', 'pointermove'])
	document.addEventListener(ev, lpStop, { passive: true });
// Tap counts (Build 59, from the Google audit): how often each button is used, and tapped while it could not act. Kept on this phone only,
// never sent anywhere; read on the Tap counts card (Help). A button nobody uses, or one tapped greyed out again and again, is a design question.
let TAPS = {};
try {
	TAPS = JSON.parse(localStorage.getItem(keyOf('taps')) || '{}');
} catch (e) {}
function tapCount(act, dis) {
	const k = String(act).split(':')[0],
		t = TAPS[k] || (TAPS[k] = [0, 0]);
	t[dis ? 1 : 0]++;
	try {
		localStorage.setItem(keyOf('taps'), JSON.stringify(TAPS)); // every tap (Build 60: one in ten were kept, so a reload lost most of them)
	} catch (e) {}
}
document.addEventListener('click', (e) => {
	const el = e.target.closest('[data-act]');
	if (!el) return;
	e.stopPropagation();
	if (lpDone) {
		lpDone = false;
		return;
	}
	if (G.techTip) {
		G.techTip = null;
		renderCard();
	}
	sndInit();
	sfx('tap');
	tapCount(el.dataset.act, /(^|\s)(dis|lock)(\s|$)/.test(el.className));
	if (/(^|\s)(dis|lock)(\s|$)/.test(el.className)) {
		el.classList.add('nope');
		setTimeout(() => el.classList.remove('nope'), 450);
	} // a tap it cannot do glows red a moment
	cardTap = !!el.closest('#card'); // what it opens remembers this card (back)
	try {
		act(el.dataset.act);
	} finally {
		cardTap = false;
	}
});
for (const ev of ['pointerup', 'touchend']) document.addEventListener(ev, sndInit, { passive: true }); // Safari unlocks audio on the finger lifting, not landing
