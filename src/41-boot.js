// ═════ 41-boot.js: start-up, and closes the one scope ═════
// ───────────────────────── The loop and the start ─────────────────────────
let last = performance.now(),
	acc = 0,
	lastSave = 0,
	inputT = 0;
const CATCHUP = 6;
// The safety net: an error costs a frame, never the game, and each kind is logged once. A second kind in one session saves the game, pauses it and offers a restart.
const seenErr = new Set();
function fault(e) {
	const m = String((e && e.stack) || e);
	if (seenErr.has(m)) return;
	seenErr.add(m);
	try {
		console.error(m);
		if (seenErr.size >= 2 && G && !G.over) {
			setPause(true); // no save from here on (saveGame checks): the last good save stands, never one made after things broke (Build 60)
			openCard({ type: 'fault' });
		}
	} catch (x) {}
}
window.addEventListener('error', (e) => fault(e.error || e.message));
window.addEventListener('unhandledrejection', (e) => fault(e.reason));
// Load (DRAW in 18-figures): over 12 ms of work a frame for two seconds sheds one level; under 7 ms for ten seconds climbs one back.
function shed(work) {
	DRAW.ema += (work - DRAW.ema) * 0.05;
	if (DRAW.ema > 12 && DRAW.lvl < 3) {
		DRAW.fast = 0;
		if (++DRAW.slow > 120) {
			DRAW.lvl++;
			DRAW.slow = 0;
			DRAW.ema = 0;
			if (DRAW.lvl === 3) fit();
		}
	} else if (DRAW.ema < 7 && DRAW.lvl > 0) {
		DRAW.slow = 0;
		if (++DRAW.fast > 600) {
			DRAW.lvl--;
			DRAW.fast = 0;
			DRAW.ema = 0;
			if (DRAW.lvl === 2) fit();
		}
	} else DRAW.slow = DRAW.fast = 0;
}
// the speed counter (Albert, Nov 3): once a second, frames a second (the last second's count), the draw level (0 full detail; it climbs as a
// phone sheds detail, 18-figures), the step's cost in ms, the units on the map, the memory where the browser tells it, the game clock
const PERF = { n: 0, t0: 0, min: 99 };
function perfTick(now, run) {
	PERF.n++;
	if (now - PERF.t0 < 1000) return;
	const fps = Math.round((PERF.n * 1000) / (now - PERF.t0)),
		mem = performance.memory ? ` · ${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB` : '';
	PERF.min = Math.min(PERF.min, fps);
	PERF.n = 0;
	PERF.t0 = now;
	$('perf').textContent = `${fps} fps (low ${PERF.min}) · draw ${DRAW.lvl} · step ${DRAW.ema.toFixed(1)} ms · ${G.units.length} units${mem} · ${clock(G.t)}${run ? '' : ' · paused'}`;
}
// One frame. When nothing moves (paused, over, hidden, no touch for a second) it waits: 15 frames a second instead of 60.
function frame(now) {
	const run = !G.over && !G.paused && !document.hidden,
		idle = !run && now - inputT > 1000,
		d = Math.min(0.1, (now - last) / 1000),
		t0 = performance.now();
	last = now;
	try {
		if (run) {
			acc += d * G.speed;
			let n = 0;
			while (acc >= DT && n < CATCHUP) {
				step(DT);
				acc -= DT;
				n++;
			}
			if (n >= CATCHUP) acc = 0;
			DRAW.alpha = clamp(acc / DT, 0, 1);
			ambience(d);
		}
		if (now - lastSave > SAVE_EVERY * 1000) {
			lastSave = now;
			if (run) saveGame();
		}
		if (SET.perf) perfTick(now, run);
		edgeScroll(d);
		if (cv.width !== Math.round(cv.clientWidth * dpr) || cv.height !== Math.round(cv.clientHeight * dpr)) fit(); // the drawing no longer matches the map's box: measure again (the squashed map, Nov 2; the box observer misses a bad first measure)
		draw();
		ui();
		if (run) shed(performance.now() - t0);
	} catch (e) {
		fault(e);
	}
	if (idle) setTimeout(() => requestAnimationFrame(frame), 66);
	else requestAnimationFrame(frame);
}
for (const ev of ['pointerdown', 'pointermove', 'wheel'])
	document.addEventListener(
		ev,
		() => {
			inputT = performance.now();
		},
		{ passive: true, capture: true },
	);
window.addEventListener('resize', fit);
buildPanel();
$('perf').hidden = !SET.perf;
fit();
newGame();
scoreAll();
ui(true);
// the speeds drop down under the play button whenever the game is paused; play or a speed closes them (Albert, Build 41)
function spdPop(open) {
	const pb = $('pauseB'),
		pop = $('spdPop');
	if (!open) {
		pop.hidden = true;
		return;
	}
	for (const b of pop.children) b.classList.toggle('on', b.dataset.act === 'spd:' + G.speed);
	pop.hidden = false;
	const r = pb.getBoundingClientRect(),
		st = $('stage').getBoundingClientRect();
	pop.style.top = r.bottom - st.top + 4 + 'px';
	pop.style.left =
		Math.max(4, Math.min(st.width - pop.offsetWidth - 4, r.left - st.left + r.width / 2 - pop.offsetWidth / 2)) +
		'px';
}
// The test field (Albert, Nov 3: "a test game where it's just me and one other enemy"): the page opened with ?test. You and one rival, at
// war, no fog, no events, 5,000 of everything, the War Council's ladder researched, both armies on the field 600 apart, and a mine site
// beside gold with a wolf at it. Never saved: your real game stays as it was.
const TEST_FIELD = /[?&]test\b/.test(location.search);
function testField() {
	newGame(11);
	G.test = true;
	G.fogOn = false;
	G.ev.next = 1e9;
	for (let o = 1; o < WILD; o++)
		if (o !== 1) {
			G.P[o].alive = false;
			G.units = G.units.filter((u) => u.owner !== o);
			G.blds = G.blds.filter((b) => b.owner !== o);
		}
	G.rel[0][1] = G.rel[1][0] = 'war';
	navRebuild();
	const P = G.P[0],
		k = keepOf(0),
		open = (x, y) => x > 40 && y > 40 && x < MAP - 40 && y < MAP - 40 && !blockedCell(gcell(x, y), 0);
	let ux = 0,
		uy = 1,
		best = -1;
	for (let a = 0; a < 32; a++) {
		const cx = Math.cos((a * Math.PI) / 16),
			cy = Math.sin((a * Math.PI) / 16);
		let n = 0;
		for (let r = 100; r <= 820; r += 20) for (const sd of [-60, 0, 60]) n += open(k.x + cx * r - cy * sd, k.y + cy * r + cx * sd);
		const sc = n + 20 * Math.abs(cy); // the most open way out, and up or down the screen so both armies fit on it
		if (sc > best) [best, ux, uy] = [sc, cx, cy];
	}
	const at = (r, side) => ({ x: k.x + ux * r - uy * side, y: k.y + uy * r + ux * side });
	for (const r of Object.keys(P.res)) P.res[r] = 5000;
	P.age = Math.max(P.age, 2);
	for (const t of ['engage', 'command', 'formations']) P.techs.add(t);
	fxDirty();
	const army = (o, r, list) =>
		list.forEach(([kind, n], j) => {
			for (let i = 0; i < n; i++) {
				const p = at(r + j * 14, (i - (n - 1) / 2) * 12),
					u = addUnit(o, kind, p.x, p.y);
				if (u) {
					u.state = 'goto';
					u.px = p.x;
					u.py = p.y;
				}
			}
		});
	army(0, 150, [['spear', 10], ['archer', 8], ['chariot', 4], ['catapult', 2]]);
	army(1, 750, [['spear', 10], ['archer', 8], ['chariot', 4]]);
	const g = at(140, 160),
		gold = { id: NID++, kind: 'gold', type: 'gold', x: g.x, y: g.y, amt: 800, max: 800 };
	G.nodes.push(gold);
	const s = findSpot(0, 'mining', g.x - ux * 40, g.y - uy * 40, 10, 80);
	if (s) build(0, 'mining', s.x, s.y);
	addUnit(WILD, 'wolf', g.x + 24, g.y);
	navRebuild();
	const c = at(450, 0);
	cam.x = c.x;
	cam.y = c.y;
	cam.z = 0.8;
	clampCam();
	say('Test field: one rival, both armies out. Never saved.', 'tip', TOAST.long);
}
if (TEST_FIELD) {
	testField();
	setPause(false);
	lastSave = performance.now();
} else {
	const sv = readSave();
	if (sv && sv.t > 20) {
		holdSave = true;
		setPause(true);
		openCard({ type: 'resume', t: sv.t, age: sv.P[0].age, civ: sv.P[0].civ });
	} else {
		setPause(true);
		openCard({ type: 'setup' });
	}
	lastSave = performance.now();
}
requestAnimationFrame(frame);
window.__fkq = (v) => {
	G.gq = v;
	const el = $('gres');
	if (el) el.innerHTML = histHTML(v);
}; // the History search: the list follows the typing, the field keeps its focus
const clip = (text) => {
	try {
		navigator.clipboard.writeText(text).then(
			() => say('Copied.', 'good', TOAST.short),
			() => say('Could not copy here.', '', TOAST.short),
		);
	} catch (e) {
		say('Could not copy here.', '', TOAST.short);
	}
};
window.__fk = {
	suggestAt,
	whoIs,
	isNext,
	nextStep,
	needsOf,
	teachWhy,
	teachCost,
	teachSecs,
	teach,
	teachTo,
	graduate,
	groundSpd,
	wearMul,
	say,
	showQuick,
	sharePick,
	shareFor,
	toWorld,
	lakeRAt,
	lakeRTo,
	orderCost,
	drillHold,
	chokeAt,
	ambushAt,
	coverNear,
	AMBUSH,
	CAMP,
	campLayout,
	campWhy,
	campUnpack,
	campCap,
	campsOut,
	campWhyTrain,
	campEat,
	supplyRun,
	campWearTick,
	depotNear,
	readyAt,
	tentCost,
	JUICE,
	ORDER,
	SHARE,
	quickGo,
	direct,
	shapeOf,
	temperOf,
	T_HOLD,
	DIRECT_OF,
	ofKind,
	HOLD_WORD,
	hideQuick,
	capFor,
	armyRoom,
	capOf,
	atCap,
	capWhy,
	SCENARIOS,
	fxDirty,
	techCost,
	sendOut,
	replant,
	replantWhy,
	stopVil,
	wayLen,
	techState,
	get G() {
		return G;
	},
	get cam() {
		return cam;
	},
	get view() {
		return { cw, ch, vy, bandH };
	},
	clampCam,
	set G(v) {
		G = v;
	},
	SET,
	NAV,
	BLD,
	UNIT,
	TECH,
	TECHBY,
	CIVS,
	FINDS,
	MENUS,
	AGES,
	PERS,
	step,
	act,
	train,
	trainWhy,
	build,
	research,
	researchWhy,
	ageUp,
	addUnit,
	canBeat,
	groupPower,
	wildAt,
	addFind,
	declareWar,
	keepOf,
	stats,
	GRID,
	fxv,
	sendEnvoy,
	canPlace,
	drawGhost,
	wallPlan,
	snapPos,
	GUIDE_R,
	snapGhost,
	findSpot,
	think,
	react,
	astar,
	navRebuild,
	moveTo,
	wallLine,
	toCell,
	commitPlace,
	startPlace,
	zoomAt,
	guideModel,
	guideMd,
	coord,
	minZ,
	tapAt,
	emgStart,
	emgStop,
	hudFire,
	hudAbort,
	hudPage,
	sqPlan,
	sqUnits,
	hudReinforce,
	reinforcePlan,
	missionsTick,
	aimAt,
	openCard,
	blankGame,
	clearSave,
	maxHpB,
	hawkP,
	groupSees,
	nearestFoe,
	searchR,
	SEARCH,
	REACH,
	SPACE,
	FOOT,
	WILD_LOOK,
	DANGER_R,
	spotAt,
	takeSpots,
	spotFree,
	regionAt,
	FORAGE,
	postTo,
	stepOut,
	LATTICE,
	isFoe,
	stampDanger,
	DANGER,
	navOnce,
	BEAT,
	peaceTick,
	GUIDE_PG,
	drawOnce,
	get ctxNow() {
		return ctx;
	},
	CARDS,
	crownsHTML,
	showEnd,
	reap,
	dangerMap,
	lineClear,
	sendBuilder,
	chron,
	natRaid,
	leaveWork,
	NATIVE,
	YARD,
	REGARD,
	GANG,
	calm4b,
	unitPower,
	fromWhere,
	solTick,
	priestTick,
	nearestFoeBld,
	bestNode,
	natSpawn,
	clsMax,
	stepTo,
	boxShadow,
	hexOf,
	SHADE,
	cardLocked,
	get ctx() {
		return ctx;
	},
	vilTick,
	blockedCell,
	gcell,
	ARRIVE,
	halfOf,
	recount,
	voiceFree,
	VOICES,
	TILT,
	FIG,
	pushApart,
	troops,
	backToWork,
	wildTick,
	sendable,
	MIGRATE,
	renderCard,
	demolish,
	sendRepair,
	saveGame,
	readSave,
	loadGame,
	sendVil,
	setJob,
	moveVil,
	posted,
	idlePost,
	freeVil,
	orderSet,
	clsCount,
	nearestNode,
	collide,
	newGame,
	lakeSize,
	airTemp,
	sunAlt,
	sunAltAt,
	sunVec,
	moonVec,
	sunShadows,
	rangeFrom,
	rangeOf,
	moonPhase,
	rothermel,
	fireMul,
	CLIMATE,
	PEACE,
	nextIn,
	forage,
	SAVEKEY,
	UI_BUDGET,
	mktHit,
	PRICE,
	SPOIL,
	forageNow,
	pickVil,
	lanchester,
	unitsOf,
	soldiersOf,
	WHY,
	hazard,
	HEALTH,
	truceAll,
	truceFor,
	crownsOf,
	holdGames,
	standDown,
	queuedOf,
	aiEconomy,
	plotPays,
	firstNeed,
	armyAim,
	armyCap,
	goalOf,
	needOf,
	famineNear,
	roulette,
	VENTURE,
	sightOf,
	sightClear,
	visCap,
	fireHeat,
	relax,
	turtlePlan,
	migrateChain,
	SAVEV,
	BUILDER_POW,
	hearing,
	SOUND,
	groundTick,
	muOf,
	TEACH_TO,
	unitKeys,
	ARMYMAX,
	armyFull,
	isSoldier,
	EV_TEXT,
	DIFF,
	TEACH,
	MEASURED,
	spyTick,
	died,
	musterCost,
	hireWhy,
	unitCost,
	ready,
	workMul,
	dockNear,
	NEWS,
	techWhy,
	tierLines,
	iceMu,
	groundNeed,
	studded,
	sideSpd,
	insulate,
	nodeKey,
	skyTurn,
	SEASON_LEN,
	START_VILS,
	START_RES,
	HANDICAP,
	AB,
	gapOnRoad,
	chokeClaim,
	SCEN_TEXT,
	TRIGGERS,
	techBook,
	READ_CARDS,
	slipChance,
	rutOf,
	ruts,
	logistic,
	MORALE,
	VASSAL,
	FIRE,
	shelterOf,
	bldName,
	statusOf,
	WATER,
	CLEAR,
	MAP,
	MID,
	CORNER,
	NC,
	NAVC,
	LAKE0,
	THRONE,
	PLACES,
	cross,
	compOf,
	decideWar,
	HOME,
	WALL_R,
	BACK,
	BACK_MARGIN,
	LANE,
	LAND,
	RICH,
	LAYOUT,
	WAVE,
	scoreAll,
	hurt,
	sabotage,
	hire,
	zeal,
	zealWhy,
	learnTech,
	plunder,
	fall,
	sfx,
	SND,
	sprite,
	bldSprite,
	LOOKS,
	draw,
	fit,
	ui,
	civKind,
	marketTrade,
	findsTick,
	rehealth,
	setPause,
	GOODS,
	WEATHER,
	ignite,
	outbreak,
	setRoute,
	postAt,
	stopsAll,
	priceAt,
	estPay,
	tradeTargets,
	sickRisk,
	seasonTurn,
	upkeepTick,
	healthTick,
	guardedCart,
	dmgOf,
	rngOf,
	TICK,
	route,
	standOff,
	built,
	loyaltyParts,
	surrenderWhy,
	vassalsOf,
	makeVassal,
	rebel,
	mkt,
	hitAt,
	setPick,
	picked,
	order,
	setRel,
	relWhy,
	noticeLeft,
	demand,
	forceTribute,
	levy,
	releaseAll,
	breakTies,
	cancelOrder,
	qMax,
	debase,
	SFX,
	lifeText,
	SX,
	SY,
	mkBld,
	qcDrop,
	startEvent,
	endEvent,
	EVENTS,
	EV,
	HAZARDS,
	throneB,
	takeThrone,
	regardOf,
	chargeWhy,
	charge,
	fallBack,
	fogTick,
	fogAt,
	visibleTo0,
	prisonersOf,
	addRegard,
	gangState,
	gangOf,
	gangRel,
	struckBy,
	giveGift,
	natState,
	layTraps,
	throneHold,
	payRansom,
	onLand,
	lakeGap,
	hz,
	levelOf,
	levelMul,
	EVM,
	moonLight,
	eventsTick,
	ZOOM_MAX,
	ZOOM_START,
	LABEL,
	MS_TEXT,
	labelK,
	MSG,
	WILD,
	REL_WORD,
	closeCard,
	trainButtons,
	camH,
	news,
	march,
	armyStatus,
	advise,
	popOf,
	hordeTick,
	starveTick,
	hungerOf,
	findCap,
	WORK_R,
	STARVE,
	todaySeed,
	gatherMul,
	sealPath,
	RATE_OF,
	makeOf,
	shareOf,
	UPKEEP,
	POST,
	TAX,
	BTIER,
	BN,
	CLS,
	RES,
	RESOURCES,
	ROW_WORD,
	POPMAX,
	nodeName,
	TITLE_SHORT,
	get holdSave() {
		return holdSave;
	},
	setHold(v) {
		holdSave = v;
	},
	get caches() {
		return { SPR, BSPR, NSPR, deepTrees };
	},
};

})();
