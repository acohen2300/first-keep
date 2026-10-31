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
		edgeScroll(d);
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
{
	SET.mapSeen = true;
	if (SET.mini === undefined) SET.mini = false;
	saveSet();
} // the small map starts closed; the map cell at the top opens it   // the first look shows the map; after that it stays shut until opened
buildPanel();
applyMini();
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
{
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
			() => say('Copied.', 'good', 2),
			() => say('Could not copy here.', '', 3),
		);
	} catch (e) {
		say('Could not copy here.', '', 3);
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
	fxv,
	sendEnvoy,
	canPlace,
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
	pageCycle,
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
	groupSees,
	nearestFoe,
	searchR,
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
	natRegard,
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
	camH,
	news,
	march,
	armyStatus,
	advise,
	popOf,
	hordeTick,
	starveTick,
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
