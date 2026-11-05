// ═════ 01-rules-basics.js: the map, speeds, difficulty, resources, jobs, players, ages, seasons ═════
// ───────────────────────── The rules: every number lives in a table ─────────────────────────
const BUILD = 0; // written by build.py from the latest "## Build NN" in CUTS.md: the number has one home
const BUILD_NAME = 'Restoration'; // the version's name, shown as "v70 · Restoration" (Albert, Oct 31)
// The land and the world (preview 51, Albert's pictures of Nov 4: a square map on the screen, its tiles on the diagonal, sawtooth edges, the
// homes in the corners). The map-maker lays the land as it always has, a square SQUARE a side with a home in each corner (decision 5a, LOCKED
// at +8%); then turnLand (10-world) turns every laid thing −45° about the centre into the world, an array MAP a side (√2 larger) that the
// walking grid, the fog and the view cover. Seen through the turned view (20-view-base), the land stands square on the screen again, with
// the walking grid's squares on the diagonal; what the array holds outside the land is off-map (solid, sea and cliffs). worldXY and landXY
// go between the two frames; inLand says whether a world point is on the land.
const SQUARE = 2160, // the land's side, as the map-maker lays it
	LMID = SQUARE / 2,
	MAP = 3060, // the world: 306 walking squares a side (the land's diagonal is 3055); the middle, 1530, is a square's corner, where the 6-square Throne centres
	MID = MAP / 2,
	DT = 1 / 30;
const BN = ['Alpha', 'Bravo', 'Charlie'], // three squads, slots 2 to 4 of the station's middle, the fourth tile Set Up (Albert, Nov 2; four before, six before that; Alpha to Charlie, the NATO names)
	BNS = BN.length; // the battalions, once Command is researched
// The four kinds of soldier, by the building that trains them: [id, name, building, the word in a line]. A squad holds so many of each (Build 70)
const CLS = [
	['foot', 'Foot', 'barracks', 'foot'],
	['arch', 'Archers', 'range', 'archers'],
	['horse', 'Riders', 'stable', 'riders'],
	['siege', 'Siege', 'siege', 'siege'],
];
const POPMAX = 180,
	ARMYMAX = 120,
	BNSIZE = 40,
	SHARE_FALLEN = 0.5; // a fallen side's room: half of it is split among whoever is left   // six battalions, once Command is researched at a War Council; BNSIZE: the most one Zeal blesses
const RICH = 2.5,
	PLUNDER = 0.25,
	CARRY = 10,
	NAVC = 10, // NAVC: the walking grid, 10 units a square (never shown)
	FOOT = 2.65; // world units a foot: a villager is drawn 22.1 figure units tall × FIG 0.66 = 14.6 units, taken as an adult of 5.5 ft (SCIENCE.md; tests/science.py holds it to the drawing)
const LAKE0 = { x: LMID, y: LMID, r: 170 }; // laid at the land's middle (turned to the world's middle, the same point) // the great lake in the middle, round the Throne's island; the other lakes and the rivers fall at random (G.lakes)
const SEASON_LEN = 180, // seconds a season
	YEAR = SEASON_LEN * 4,
	DAY_LEN = 120, // seconds a day: six days a year
	NIGHT_SIGHT = 0.6,
	SYNODIC = 29.53; // days from new moon to new moon (Meeus 49.1), in game days
const EASY_SAFE = 360,
	SAVE_EVERY = 10; // Easy: no raid before 6:00; the game saves every 10 s
// Difficulty turns the computers' minds, never their stores (Albert, Build 41): react, seconds between decisions; bold, added to the odds they need to attack (lower is bolder);
// opp, how much more a side with another war on its hands tempts them; allyAt, when they start courting allies; gang, whether they ally against the score leader even at peace; envoy, seconds between emissaries
const DIFF = {
	easy: { react: 2, bold: 0.1, opp: 0.8, allyAt: 900, gang: 0, envoy: 240 },
	normal: { react: 1, bold: 0, opp: 1, allyAt: 600, gang: 0, envoy: 180 },
	hard: { react: 0.5, bold: -0.08, opp: 1.4, allyAt: 300, gang: 1, envoy: 120 },
};
const DIFK = Object.keys(DIFF);
const ZOOM_MAX = 4,
	ZOOM_START = 1.3, // the camera's zoom when a game opens: a map label is LABEL.px there (labelK, 24-view-overlays)
	LABEL = { px: 12, floor: 9 }, // a map label: 12 at the starting zoom, never under 9 zoomed out (Albert, Oct 31: "base 3"); what is pinned to the screen stays 12
	TILT = 0.55, // the camera's pitch: the ground squashed to 0.55 (near AoE2's 2:1; was 0.66 to preview 49; at 0.5 two pairs of buildings read alike at half zoom)
	VIEW = { angle: 15 }, // the camera's turn in degrees, the one home (Albert, Nov 4, 12:31: "Angle index: from 45 to 30"; 12:47: "30 still too much. Go to 15 or 10"; 45 from preview 50 to 53). The view turns the world +angle; the land is laid turned −angle into the world, so it stands square on the screen whatever the angle. Everything below derives from it; the sim's square grid never knows
	TA = (VIEW.angle * Math.PI) / 180,
	TC = Math.cos(TA),
	TS = Math.sin(TA), // the turn's cosine and sine (20-view-base: SX, SY, wmat; the small map; the ghost's box)
	TURN = TC + TS, // how wide a world square's diagonal reads across the screen at zoom 1 (√2 at 45°; was 1/√2, the one number of a 45° turn)
	RIM = 640, // the scenery beyond the map's edge, in world units: sea on the near sides, cliffs and sky on the far (fills the phone's corners when the view meets an edge)
	SIDE = 0.4;
// the land's frame and the world's (preview 51): a land point (lx, ly) stands in the world at the centre plus (lx − LMID, ly − LMID) turned −angle,
// so that through the view turned +angle the land's x runs across the screen and its y down it, as the straight view had them
const worldXY = (x, y) => {
	const dx = x - LMID,
		dy = y - LMID;
	return { x: MID + dx * TC + dy * TS, y: MID - dx * TS + dy * TC };
}; // turned −angle about the centre
const landXY = (x, y) => {
	const dx = x - MID,
		dy = y - MID;
	return { x: LMID + dx * TC - dy * TS, y: LMID + dx * TS + dy * TC };
}; // and back
const landAt = (lx, ly) => worldXY(lx, ly); // a land point as a world point, for the rules that name the land's edges and middle lines
const inLand = (x, y, m = 0) => {
	const l = landXY(x, y);
	return l.x >= m && l.y >= m && l.x <= SQUARE - m && l.y <= SQUARE - m;
}; // SIDE: how far right the back of a building sits, per unit of depth, so its east wall shows
const FOG = 40,
	FOGN = Math.ceil(MAP / 40); // fog of war: squares of 40; unseen, explored (stays lit, dim), in sight now
const WILD = 4; // the fifth side: animals, bandits, robbers, monsters

// One table for the four resources: short key, colour, name, where it is dropped off.
const RESOURCES = {
	food: { k: 'f', name: 'Food', col: '#e0708a', drop: 'Mill' },
	wood: { k: 'w', name: 'Wood', col: '#c08a58', drop: 'Lumber camp' },
	stone: { k: 's', name: 'Stone', col: '#b4bbc0', drop: 'Mine' },
	gold: { k: 'g', name: 'Gold', col: '#f2cf55', drop: 'Mine' },
	iron: { k: 'i', name: 'Iron', col: '#8fa3b5', drop: 'Mine' }, // the metal of the Iron age: weapons and armour from the Classical age on
};
const RES = Object.keys(RESOURCES),
	KEY = Object.fromEntries(RES.map((r) => [r, RESOURCES[r].k])),
	LONG = Object.fromEntries(RES.map((r) => [RESOURCES[r].k, r]));
const JOBS = RES; // a job for each resource

// Relations: ally (friend) | peace (neutral) | war (foe). Peace holds until a side gives NOTICE; alliance needs the other side's yes.
const REL_WORD = { war: 'Foe', peace: 'Neutral', ally: 'Friend' }; // the one home of the stance words (cold review of v70: friend, neutral, foe), in the Relations card's order
// The four corners (a base rule): each Town Center about CORNER from the middle on both axes of the land, so the Throne is the same
// distance from all four. Decision 5a: 695 to about 751 (+8%), the agreed figure; it was 755, snapped to the land's grid; since preview 51
// the keeps are snapped in the world (KEEP_W below) and CORNER is 753.1. Neighbours about 1,506 apart; about 327 behind each Town Center.
const CORNER = 1065 * Math.SQRT1_2; // in the land's frame: 753.1 (was 755); a keep stands about CORNER out on both axes
// The keeps' places (preview 51): named in the world, where each must sit on the centre of its five squares (a coordinate ending in 5)
// while the Throne, six squares, centres on the world's middle (ending in 0); the four a quarter turn apart about the Throne, all the same
// distance from it. The land's frame sees them a little off its diagonals (KEEP_OFF), which the map-maker's margins allow.
const KEEP_W = (() => {
	// You at the land's bottom-left corner (the bottom of the screen), then the others a quarter turn apart round the Throne (Raiders left, Rivals top,
	// Fortress right): the first is the land corner turned into the world and snapped to the centre of a five-square footprint (each coordinate
	// ending in 5), the rest are that point turned a quarter about MID, which keeps the ending (MID ends in 0). At 45° this is the old table.
	const w = worldXY(LMID - CORNER, LMID + CORNER),
		on5 = (v) => Math.round((v - 5) / NAVC) * NAVC + 5,
		K = [[on5(w.x), on5(w.y)]];
	for (let i = 1; i < 4; i++) K.push([MID - (K[i - 1][1] - MID), MID + (K[i - 1][0] - MID)]);
	return K;
})();
// how far a keep stands off the land's diagonal once snapped (3.5 at 45°; more at other angles): the map-maker's margins read it
const KEEP_OFF = Math.max(...KEEP_W.map(([x, y]) => { const l = landXY(x, y); return Math.max(Math.abs(Math.abs(l.x - LMID) - CORNER), Math.abs(Math.abs(l.y - LMID) - CORNER)); })) + 0.5;
const PLAYERS = [
	{ name: 'You', pers: 'human', color: '#4f93e6', keep: KEEP_W[0] },
	{ name: 'Raiders', pers: 'aggr', color: '#de5a44', keep: KEEP_W[1] },
	{ name: 'Rivals', pers: 'bal', color: '#b07ae6', keep: KEEP_W[2] },
	{ name: 'Fortress', pers: 'fort', color: '#5fb08a', keep: KEEP_W[3] },
	{ name: 'Natives', pers: 'wild', color: '#9b8b72', keep: [MID, MID] },
]; // the keeps in the world's frame; the map-maker reads them in the land's (landXY)

const FORT = 3; // a player like the others since Build 40: it defends first, and strikes whoever is weak or busy

const AGES = [
	{ name: 'Stone' },
	{ name: 'Bronze', cost: { f: 300, w: 100 }, t: 40 },
	{ name: 'Classical', cost: { f: 600, g: 200 }, t: 60 },
	{ name: 'Medieval', cost: { f: 1000, g: 500, s: 200 }, t: 80 },
	{ name: 'Gunpowder', cost: { f: 1600, g: 900, s: 300, i: 400 }, t: 100 },
	{ name: 'Enlightenment', cost: { f: 2000, g: 1400, s: 400, i: 400 }, t: 120, hidden: true }, // opens only after a year of peace across the board (39-games); six research steps, no units; its last step ends the match
];
const SEASONS = [
	// one year is 12 minutes; real effects, simplified
	{ name: 'Spring', spd: 0.85, farm: 1.0, tint: null },
	{ name: 'Summer', spd: 1.0, farm: 1.1, tint: null },
	{ name: 'Autumn', spd: 1.0, farm: 1.25, tint: 'rgba(190,120,40,.12)' },
	{ name: 'Winter', spd: 0.8, farm: 0.4, tint: 'rgba(225,232,240,.30)' },
];
// ═════ 02-rules-units.js: every unit: cost, strength, speed, what it counters ═════
// Units. cls: which limit it counts toward (civ = the 60 villagers and workers, army = the 90). tick: which routine runs it.
// tags say what it is; vs says what it beats (×, by tag or kind; the best match counts). bld: × against buildings.
// rarmor: × it takes from arrows and bolts. tiers come from research (TECH.tier).
// War camps (Albert, Nov 3, "build it today"): a wagon from the Stable drives to a spot and unpacks into tents of 2 × 2 squares; foot
// soldiers raise them at `build` of a villager's pace (Field logistics: full); a tent trains at `extra` over the price (Field logistics: `extraLog`);
// a wounded soldier under `sendHome` of full, or a sick one, by a medical tent walks home to the hospital; the yard of a Camp holds `hold`
// (Hyginus §1: eight men a tent, four tents); the trees under a camp are burned. The wagon is a cart on the road: anyone at war can kill it.
// Step 2 (Nov 3, 10:55: "supplies ... caravans ... mud and weather ... wear"): the depot holds `supply` food; soldiers within `reach` of it eat from
// it, and with it empty they are unsupplied (tired, no mending); a Market caravan with nothing to do runs `load` food out to a depot under half,
// for the food and a delivery fee of `fee` gold a hundred of the road (the carter's hire; the cursus clabularis moved an army's stores by ox
// cart, Procopius' and Ammianus' complaint); a wagon's wheels sink `wheelMud` times as deep as a foot (Pandolf's terrain factor on a cart, design);
// rain, snow and frost take `wear` of a piece's health a minute (the same weathers that take CLIMATE.wear off blades), and soldiers mend a
// piece under `mend` of its health as they raise one; a camp is a pool for sickness and plague like the town (HEALTH, the SIR spread)
const CAMP = { build: 0.6, extra: 0.25, extraLog: 0.1, sendHome: 0.5, hold: 32, side: 14, burn: 1, tentHeal: 2, tentRng: 70, supply: 600, load: 200, fee: 2, reach: 120, wheelMud: 2, wear: 0.03, mend: 0.6, need: 'store', keep: { f: 150, g: 50 } }; // keep: what a supply run leaves in the store (p44) // side: the Camp's palisade, squares; need: the building a Camp wagon draws on (the Store, Albert 13:15) // cover: forest within so many walking squares; find: how far from the tap cover is looked for
const UNIT = {
	vil: {
		name: 'Villager',
		cls: 'civ',
		tick: 'vil',
		tags: ['civ'],
		hp: 25,
		spd: 24,
		sight: 90,
		dmg: 3,
		rng: 30,
		cd: 1.5,
		cost: { f: 50 },
		t: 8,
		at: 'keep',
		also: ['town', 'traintent'],
		age: 0,
		look: 'vil',
		desc: 'Gathers food, wood, stone and gold and carries it to the nearest drop-off. Hunts deer and boar with a javelin.',
	},
	scout: {
		// on foot in the Stone Age (the horse was tamed on the steppe about 3500 BC); Horse breeding mounts it (TECH.tier). Build 58.
		name: 'Scout',
		cls: 'civ',
		tick: 'scout',
		tags: ['civ'],
		hp: 45,
		spd: 27,
		sight: 170,
		dmg: 3,
		rng: 12,
		cd: 1.5,
		cost: { f: 80 },
		t: 12,
		at: 'keep',
		age: 0,
		look: 'scout',
		desc: 'A runner, a rider once horses are bred. Tours the map and picks up any treasure nobody guards. Tap the map to send it.',
	},
	envoy: {
		name: 'Emissary',
		cls: null,
		tick: 'envoy',
		tags: ['civ'],
		hp: 20,
		spd: 36,
		sight: 100,
		cost: { g: 40 },
		t: 0,
		age: 1,
		look: 'envoy',
		desc: 'Carries your offer of peace or alliance to another side. Killing one is an act of war.',
	},
	outpostcart: {
		name: 'Outpost wagon',
		cls: null, // a team and a cart, not a mouth: no room taken
		tick: 'wagon',
		tags: ['civ', 'wagon'],
		hp: 60,
		spd: 14,
		sight: 90,
		cost: { w: 200, f: 120, g: 60 },
		t: 30,
		at: 'stable',
		age: 1,
		camp: 'outpost',
		look: 'wagon',
		desc: 'A wagon and team from the Stable, packed with an outpost: send it to a spot and it unpacks into four tents and a tower in a strip; your foot soldiers raise them. One at a time; a second from the Classical age. On the road anyone at war with you can kill it.',
	},
	campcart: {
		name: 'Camp wagon',
		cls: null, // a team and a cart, not a mouth: no room taken
		tick: 'wagon',
		tags: ['civ', 'wagon'],
		hp: 90,
		spd: 12,
		sight: 90,
		cost: { w: 450, f: 250, g: 150 },
		t: 45,
		at: 'stable',
		age: 2,
		camp: 'camp',
		look: 'wagon',
		desc: 'Two wagons packed with a war camp: a palisade with a gate, four towers at the corners, the four tents inside and a yard for 32 soldiers. Needs Camp wagons researched at the Stable. One at a time; a second from the Medieval age.',
	},
	caravan: {
		name: 'Caravan',
		cls: 'civ',
		tick: 'caravan',
		tags: ['civ'],
		hp: 40,
		spd: 16,
		sight: 100,
		cost: { w: 80, f: 40 },
		t: 14,
		at: 'market',
		age: 1,
		look: 'caravan',
		armed: { dmg: 4, rng: 24 }, // with Armed caravans its guards strike the nearest foe in reach, once a second (the research card reads this)
		desc: 'An ox cart: about two thirds of walking pace. With no route it runs between your Markets for gold, the farther the more. Give it a route on its card and it carries goods from your Market to a trade stop. Robbers come for it near their camps.',
	},
	spy: {
		name: 'Spy',
		cls: 'army',
		tick: 'spy',
		tags: ['civ'],
		hp: 20,
		spd: 24,
		sight: 120,
		cost: { f: 30, g: 60 },
		t: 12,
		at: 'courthouse',
		age: 1,
		stealth: [45, 140],
		look: 'spy',
		desc: 'Hidden: soldiers see it only within 45, towers, the Town Center and Courthouses within 140. Near an enemy building it reads their stores, age, research and army. Sent to sabotage, it is used up.',
	},
	priest: {
		name: 'Priest',
		cls: 'army',
		tick: 'priest',
		tags: ['civ'],
		hp: 30,
		spd: 24,
		sight: 120,
		cost: { f: 40, g: 60 },
		t: 14,
		at: 'temple',
		age: 1,
		look: 'priest',
		desc: 'Does not fight. Walks with the army so you can call Zeal, and takes holy sites: stand it at a shrine for 10 s and the shrine pays you gold.',
	},
	medic: {
		name: 'Medic',
		cls: 'army',
		tick: 'medic',
		tags: ['civ'],
		hp: 30,
		spd: 24,
		sight: 120,
		heal: 3,
		hrng: 55,
		cost: { f: 40, g: 40 },
		t: 12,
		at: 'hospital',
		age: 2,
		look: 'medic',
		desc: 'Walks with the army and binds wounds: soldiers within 55 heal 3 health a second. Keep it behind the line.',
	},
	spear: {
		name: 'Spearman',
		cls: 'army',
		tick: 'sol',
		tags: ['infantry', 'spear'],
		also: ['traintent'],
		hp: 60,
		spd: 24,
		sight: 130,
		dmg: 6,
		rng: 12,
		cd: 1.2,
		cost: { f: 50, w: 25 },
		t: 10,
		at: 'barracks',
		age: 0,
		vs: { mounted: 3 },
		look: 'spear',
		desc: 'Front line. Cheap and tough. Strong against anything on horseback.',
	},
	sword: {
		name: 'Swordsman',
		cls: 'army',
		tick: 'sol',
		tags: ['infantry'],
		also: ['traintent'],
		hp: 70,
		spd: 24,
		sight: 130,
		dmg: 8,
		rng: 12,
		cd: 1.2,
		cost: { f: 60, g: 25 },
		t: 12,
		at: 'barracks',
		age: 1,
		vs: { infantry: 1.5, siege: 2 },
		bld: 1.5,
		look: 'sword',
		desc: 'Heavy infantry. Beats other foot soldiers and breaks buildings faster than most.',
	},
	archer: {
		name: 'Archer',
		cls: 'army',
		tick: 'sol',
		tags: ['infantry', 'archer', 'ranged'],
		also: ['traintent'],
		hp: 30,
		spd: 24,
		sight: 150,
		dmg: 5,
		rng: 95,
		cd: 1.6,
		cost: { f: 30, w: 45 },
		t: 10,
		at: 'range',
		age: 1,
		vs: { spear: 2, infantry: 1.3 },
		bld: 0.4,
		look: 'archer',
		desc: 'Back line. Shoots from range; strong against foot soldiers, weak to riders and javelins.',
	},
	jav: {
		name: 'Javelineer',
		cls: 'army',
		tick: 'sol',
		tags: ['infantry', 'ranged'],
		also: ['traintent'],
		hp: 40,
		spd: 24,
		sight: 140,
		dmg: 4,
		rng: 55,
		cd: 1.3,
		cost: { f: 40, w: 25 },
		t: 9,
		at: 'range',
		age: 1,
		vs: { archer: 3 },
		bld: 0.3,
		look: 'jav',
		desc: 'Light, quick, cheap. Throws javelins: the answer to archers.',
	},
	crossbow: {
		name: 'Crossbowman',
		cls: 'army',
		tick: 'sol',
		tags: ['infantry', 'archer', 'ranged'],
		also: ['traintent'],
		hp: 35,
		spd: 24,
		sight: 150,
		dmg: 9,
		rng: 100,
		cd: 2.3,
		cost: { f: 40, w: 40, g: 40 },
		t: 12,
		at: 'range',
		age: 3,
		vs: { heavy: 2.2, infantry: 1.5 },
		bld: 0.4,
		look: 'crossbow',
		desc: 'Slow to reload, hits hard. Bolts pierce armour: strong against knights and heavy foot.',
	},
	chariot: {
		name: 'Chariot',
		cls: 'army',
		tick: 'sol',
		tags: ['mounted', 'light'],
		hp: 70,
		spd: 36,
		sight: 140,
		dmg: 6,
		rng: 12,
		cd: 1.1,
		cost: { f: 60, w: 60 },
		t: 12,
		at: 'stable',
		age: 1,
		vs: { archer: 2.5, siege: 2 },
		look: 'chariot',
		desc: 'Fast. Runs archers and siege down. Weak against spears.',
	},
	cata: {
		name: 'Cataphract',
		cls: 'army',
		knock: 4,
		tick: 'sol',
		tags: ['mounted', 'heavy'],
		hp: 120,
		spd: 36,
		sight: 140,
		dmg: 10,
		rng: 12,
		cd: 1.3,
		cost: { f: 90, g: 45, i: 45 },
		t: 16,
		at: 'stable',
		age: 2,
		vs: { archer: 2, infantry: 1.3, siege: 2 },
		look: 'cata',
		desc: 'Horse and rider in armour. Breaks lines and archers; spears and crossbows stop it.',
	},
	harcher: {
		name: 'Horse archer',
		cls: 'army',
		kite: 1,
		tick: 'sol',
		tags: ['mounted', 'archer', 'ranged'],
		hp: 55,
		spd: 36,
		sight: 150,
		dmg: 5,
		rng: 80,
		cd: 1.6,
		cost: { f: 60, w: 40, g: 40 },
		t: 14,
		at: 'stable',
		age: 2,
		vs: { spear: 2, infantry: 1.5 },
		bld: 0.3,
		look: 'harcher',
		desc: 'Shoots from the saddle and rides away. Strong against slow foot; javelins and riders catch it.',
	},
	elephant: {
		name: 'War elephant',
		cls: 'army',
		knock: 5,
		tick: 'sol',
		tags: ['mounted', 'heavy', 'elephant'],
		hp: 260,
		spd: 22,
		sight: 140,
		dmg: 15,
		rng: 14,
		cd: 2,
		cost: { f: 150, g: 120 },
		t: 28,
		at: 'stable',
		age: 2,
		vs: { infantry: 1.5, mounted: 1.3 },
		bld: 2,
		look: 'elephant',
		desc: 'Huge, slow and frightening. Tramples foot and horse and breaks gates. Spears and javelins bring it down.',
	},
	ram: {
		name: 'Ram',
		cls: 'army',
		tick: 'sol',
		tags: ['siege'],
		hp: 200,
		spd: 12,
		sight: 80,
		dmg: 25,
		rng: 10,
		cd: 2,
		cost: { w: 150, g: 50 },
		t: 20,
		at: 'siege',
		age: 2,
		bonly: true,
		rarmor: 0.4,
		look: 'ram',
		desc: 'Breaks buildings, walls and gates. Roofed: arrows glance off. It ignores soldiers, so keep it covered.',
	},
	stower: {
		name: 'Siege tower',
		cls: 'army',
		tick: 'sol',
		tags: ['siege'],
		hp: 260,
		spd: 12,
		sight: 150,
		dmg: 6,
		rng: 110,
		cd: 1.0,
		cost: { w: 200, g: 60 },
		t: 24,
		at: 'siege',
		age: 2,
		rarmor: 0.5,
		bld: 0.6,
		look: 'stower',
		desc: 'A rolling tower with archers inside. Outshoots a watchtower and shrugs off arrows; swords and riders take it apart.',
	},
	catapult: {
		name: 'Catapult',
		cls: 'army',
		tick: 'sol',
		tags: ['siege'],
		hp: 70,
		spd: 12,
		sight: 140,
		dmg: 22,
		rng: 170,
		cd: 4,
		cost: { w: 200, g: 100 },
		t: 25,
		at: 'siege',
		age: 2,
		bonly: true,
		look: 'catapult',
		desc: 'Hurls stones at buildings from beyond bowshot. Fragile: guard it.',
	},
	bombard: {
		name: 'Bombard',
		cls: 'army',
		knock: 3,
		tick: 'sol',
		tags: ['siege', 'gun'],
		hp: 110,
		spd: 10,
		sight: 150,
		dmg: 100,
		rng: 190,
		cd: 8,
		cost: { w: 200, g: 250, i: 250 },
		t: 40,
		at: 'siege',
		age: 4,
		bonly: true,
		gun: true,
		look: 'bombard',
		desc: 'A great iron-banded gun. One ball breaks what a trebuchet needs two for. Slow to move, slower to load, and helpless up close.',
	},
	ballista: {
		name: 'Ballista',
		cls: 'army',
		tick: 'sol',
		tags: ['siege'],
		hp: 60,
		spd: 12,
		sight: 150,
		dmg: 14,
		rng: 150,
		cd: 3,
		cost: { w: 160, g: 80 },
		t: 22,
		at: 'siege',
		age: 2,
		vs: { elephant: 2, infantry: 1.5, mounted: 1.3, siege: 1.5 },
		bld: 0.5,
		look: 'ballista',
		desc: 'A giant crossbow on a stand. Shoots soldiers from far off, best against elephants and packed foot.',
	},
	arquebus: {
		name: 'Arquebusier',
		cls: 'army',
		tick: 'sol',
		tags: ['infantry', 'ranged', 'gun'],
		also: ['traintent'],
		hp: 40,
		spd: 24,
		sight: 150,
		dmg: 16,
		rng: 90,
		cd: 3.4,
		cost: { f: 50, g: 50, i: 40 },
		t: 14,
		at: 'range',
		age: 4,
		vs: { heavy: 2, mounted: 1.5, infantry: 1.4 },
		bld: 0.4,
		gun: true,
		look: 'arquebus',
		desc: 'A matchlock gun: a slow reload and a heavy blow at 90. Cheap to train, hard to stop. Strong against knights and riders; archers and riders catch it reloading.',
	},
	treb: {
		name: 'Trebuchet',
		cls: 'army',
		knock: 4,
		tick: 'sol',
		tags: ['siege'],
		hp: 90,
		spd: 12,
		sight: 150,
		dmg: 60,
		rng: 230,
		cd: 6,
		cost: { w: 300, g: 200 },
		t: 35,
		at: 'siege',
		age: 3,
		bonly: true,
		look: 'treb',
		desc: 'The counterweight engine: smashes walls and keeps from very far. Slow and helpless up close.',
	},
	rebel: {
		name: 'Rebel',
		tick: 'sol',
		cls: 'army',
		at: 'barracks', // never trained (no cost, no age): it says which kind of soldier it fights as, so a rebel taken into your army is Foot (Build 48)
		tags: ['infantry'],
		also: ['traintent'],
		hp: 40,
		spd: 24,
		sight: 130,
		dmg: 5,
		rng: 12,
		cd: 1.3,
		look: 'bandit',
		desc: 'Villagers of a vassal who have taken up arms against their overlord.',
	},
	// the wild: no owner but itself
	deer: {
		name: 'Deer',
		tick: 'wild',
		tags: ['animal'],
		temper: 'flee', // runs when staying costs more than running (Ydenberg and Dill 1986)
		hp: 30,
		spd: 40,
		sight: 90,
		meat: 200,
		flee: true,
		look: 'deer',
		desc: 'Runs from people. Villagers on Food hunt it.',
	},
	boar: {
		name: 'Boar',
		tick: 'wild',
		tags: ['animal'],
		temper: 'defend', // fights what provokes or startles it (Hawk-Dove, Maynard Smith and Price 1973)
		hp: 70,
		spd: 30,
		sight: 70,
		dmg: 4,
		rng: 10,
		cd: 1.4,
		meat: 340,
		look: 'boar',
		desc: 'Good meat, and it fights back.',
	},
	wolf: {
		name: 'Wolf',
		tick: 'wild',
		tags: ['animal'],
		temper: 'hunt', // attacks what it can beat (prey choice, Charnov 1976)
		hp: 45,
		spd: 40,
		sight: 110,
		dmg: 5,
		rng: 10,
		cd: 1.1,
		look: 'wolf',
		desc: 'Hunts in packs and guards nothing but its den. Attacks anyone close.',
	},
	bear: {
		name: 'Bear',
		tick: 'wild',
		tags: ['animal'],
		temper: 'defend', // fights what provokes or startles it (Hawk-Dove, Maynard Smith and Price 1973)
		hp: 150,
		spd: 30,
		sight: 90,
		dmg: 10,
		rng: 12,
		cd: 1.6,
		meat: 300,
		look: 'bear',
		desc: 'Strong and short-tempered. Stays near its den.',
	},
	bandit: {
		name: 'Bandit',
		tick: 'wild',
		tags: ['infantry', 'outlaw'],
		gang: 'ban',
		hp: 55,
		spd: 26,
		sight: 120,
		dmg: 6,
		rng: 12,
		cd: 1.2,
		look: 'bandit',
		desc: 'Outlaws holed up in old ruins.',
	},
	robber: {
		name: 'Robber',
		tick: 'wild',
		tags: ['infantry', 'outlaw'],
		gang: 'rob',
		hp: 60,
		spd: 32,
		sight: 140,
		dmg: 7,
		rng: 12,
		cd: 1.2,
		vs: { civ: 1.5 },
		raid: 260,
		look: 'robber',
		desc: 'Robs caravans and villagers that come near the camp.',
	},
	wayfarer: {
		name: 'Wayfarer',
		tick: 'wayfarer',
		tags: ['civ'],
		hp: 30,
		spd: 22,
		sight: 60,
		joins: 1,
		look: 'wayfarer',
		desc: 'A traveller looking for a place to settle. The first side to meet him gains a villager.',
	},
	wagon: {
		name: 'Wagon train',
		tick: 'wayfarer',
		tags: ['civ'],
		hp: 60,
		spd: 16,
		sight: 60,
		joins: 3,
		look: 'caravan',
		desc: 'Settlers with everything they own. They join whoever reaches them first: three villagers.',
	},
	bison: {
		name: 'Bison',
		tick: 'herd',
		tags: ['animal'],
		hp: 120,
		spd: 70,
		sight: 60,
		meat: 400,
		trample: 6,
		look: 'bison',
		desc: 'A herd on the move tramples fields and anyone in its path. Good meat, if you can bring one down.',
	},
	performer: {
		name: 'Performer',
		tick: 'herd',
		tags: ['civ'],
		hp: 30,
		spd: 20,
		sight: 60,
		cheer: 150,
		look: 'performer',
		desc: 'A travelling show. Villagers who see it pass work a little harder for a while.',
	},
	vagabond: {
		name: 'Vagabond',
		tick: 'wild',
		tags: ['civ'],
		hp: 30,
		spd: 20,
		sight: 40,
		passive: true,
		look: 'vagabond',
		desc: 'Drifters by a fire. They will fight for whoever pays.',
	},
	// the fantasy toggle swaps the guards for these
	direwolf: {
		name: 'Dire wolf',
		tick: 'wild',
		tags: ['animal'],
		hp: 90,
		spd: 42,
		sight: 120,
		dmg: 9,
		rng: 10,
		cd: 1.1,
		fantasy: true,
		look: 'direwolf',
		desc: 'A wolf the size of a pony.',
	},
	goblin: {
		name: 'Goblin',
		tick: 'wild',
		tags: ['infantry', 'outlaw'],
		gang: 'ban',
		hp: 40,
		spd: 30,
		sight: 120,
		dmg: 5,
		rng: 12,
		cd: 1.0,
		fantasy: true,
		look: 'goblin',
		desc: 'Small, quick and greedy.',
	},
	skeleton: {
		name: 'Skeleton',
		tick: 'wild',
		tags: ['infantry', 'outlaw'],
		gang: 'rob',
		hp: 50,
		spd: 22,
		sight: 110,
		dmg: 6,
		rng: 12,
		cd: 1.3,
		fantasy: true,
		rarmor: 0.5,
		look: 'skeleton',
		desc: 'The dead guard their graves. Arrows pass through the ribs.',
	},
	troll: {
		name: 'Troll',
		tick: 'wild',
		tags: ['infantry', 'heavy', 'outlaw'],
		gang: 'rob',
		hp: 320,
		spd: 22,
		sight: 130,
		dmg: 18,
		rng: 14,
		cd: 2.2,
		fantasy: true,
		raid: 200,
		look: 'troll',
		desc: 'Lives under the bridge of the robbers. Hits like a ram.',
	},
	native: {
		name: 'Warrior',
		tick: 'sol',
		cls: 'army',
		at: 'barracks', // never trained: a warrior sworn to you is Foot in the army, the battalions and the huddle (Build 48: they were in none)
		tags: ['infantry', 'spear', 'native'],
		also: ['traintent'],
		hp: 55,
		spd: 32,
		sight: 140,
		dmg: 6,
		rng: 12,
		cd: 1.1,
		vs: { mounted: 2.5 },
		look: 'native',
		desc: 'The guard of the Throne: light, swift and many. A spear and a hide shield, and the ground on their side.',
	},
	nativebow: {
		name: 'Bowman',
		tick: 'sol',
		cls: 'army',
		at: 'range', // never trained: a sworn bowman is an archer
		tags: ['infantry', 'archer', 'ranged', 'native'],
		also: ['traintent'],
		hp: 36,
		spd: 32,
		sight: 160,
		dmg: 5,
		rng: 85,
		cd: 1.3,
		vs: { infantry: 1.3 },
		look: 'nativebow',
		desc: 'The archers of the Throne, on the walls and at the causeways.',
	},
	dragon: {
		name: 'Dragon',
		tick: 'herd',
		tags: ['animal'],
		hp: 900,
		spd: 90,
		sight: 200,
		fantasy: true,
		scorch: 30,
		look: 'dragon',
		desc: 'Passes over now and then. What it flies over, burns.',
	},
};
const hasTag = (kind, tag) => (UNIT[kind].tags || []).includes(tag) || kind === tag;
// ═════ 03-rules-buildings.js: goods, prices, taxes, vassals, every building kind, menus ═════
// Goods: made, stored and carried, apart from the four resources. base: gold for one at a Market next door; it pays more far away and where it is wanted.
const GOODS = {
	wool: { name: 'Wool', col: '#ece5d3', base: 2, raw: true },
	cloth: { name: 'Cloth', col: '#8fb0d8', base: 7 },
	beer: { name: 'Beer', col: '#d9a35a', base: 5 },
	spice: { name: 'Spice', col: '#c4552e', base: 9, buy: 5 }, // not grown here: bought at trade stops for 5, as it came by caravan from far away
};
const GOODK = Object.keys(GOODS),
	WARES = GOODK.filter((k) => !GOODS[k].raw);
const LOAD = 20,
	CARAVAN = { keep: 600 }, // a caravan also carries what a store holds beyond this much of food, wood, stone or iron
	RAW_NAME = { f: 'Food', w: 'Wood', s: 'Stone', i: 'Iron' },
	CARRIED = [...WARES, 'f', 'w', 's', 'i'];
// Food upkeep: one share is what a person eats; a villager gathering food brings in about 30 a minute, enough for 8 shares.
const UPKEEP = { share: 30 / 8 / 60, foot: 1.5, mounted: 3, cart: 2, hunger: 0.72 }; // hunger: work and blows after STARVE.grace without food; the Minnesota study's fall in grip strength, 58.2 to 41.8 kg (Keys et al. 1950, via Hargrove, Heinz & Heinz 2008, Table 1)
// Vassals. Every 10 seconds: tax takes a share of what the vassal gathered; unrest moves by the tax push minus loyalty/25 (0..100).
// Loyalty moves 5% of the way to its target: 20 + investment + garrison + protection − the tax's resentment (0..100).
const TAX = {
	light: { take: 0.1, push: 0.3, hate: 0 },
	fair: { take: 0.2, push: 1.5, hate: 10 },
	heavy: { take: 0.35, push: 4, hate: 30 },
};
const VASSAL = {
	r: 450,
	tau: 195, // seconds for loyalty to close 63% of the gap to its target (the first-order lag; the old 5% a 10 s step, kept exactly)
	garrison: 0.5,
	garrisonMax: 15,
	kill: 1,
	protectMax: 20,
	decay: 0.98,
	gift: 60,
	share: 0.25,
	shareAt: 50,
	giftAt: 60,
	crushed: 0.25,
	rise: 0.33, // the share of a vassal's villagers that take up arms in a rebellion
	freeAfter: 240,
	reign: 300,
	invest: 3, // the loyalty a building of the lord's buys near the vassal when its own table names none (BLD invest)
};
const VENTURE = { age: 3, back: 1.4, lost: 0.2, max: 3, sizes: [100, 250, 500] };
// Prices answer the market's stock on the constant-elasticity demand curve, P = P0 (Q/Q0)^(−1/ε) (Marshall's price elasticity; the standard
// isoelastic form). Q/Q0 is the stock against its normal (G.mkt holds it); what is sold adds to it, what is bought takes from it, and it
// returns to normal on a first-order lag of tau seconds as the wider world eats and makes. ε: staples are inelastic (under 1: the study of
// 160 food studies by Andreyeva, Long & Brownell, 2010, finds 0.27 to 0.81), luxuries elastic (over 1). The values per good are design in that range.
// Food in store spoils on first-order decay, Q = Q0 e^(−kt), the standard model of storage loss (food-science kinetics); k from the FAO's field
// figure, about 5% a year lost in traditional grain stores (FAO, Grain storage techniques, ch. 6: 2 to 10% by crop and place). Salting and
// the ice house each halve it. Taken at every season's turn.
const SPOIL = { year: 0.05 };
const PRICE = {
	eps: { f: 0.5, w: 0.8, s: 1, i: 1, wool: 0.8, cloth: 1.2, beer: 0.8, spice: 1.5 },
	q0: { raw: 1000, good: 100 }, // a market's normal stock: a thousand of a raw good, a hundred of a made one
	tau: 100,
	floor: 0.5,
	cap: 2.5,
}; // a caravan carries 20 goods
// Buildings. fp = squares a side (10 units each). h = how tall it stands. room = people it shelters.
// sab: what a spy does to it (burn: loses 60% health; stall: stops 40 s and loses the job in hand). No sab: too well guarded.
const BLD = {
	keep: {
		shelter: 8,
		name: 'Town Center',
		short: 'Town', // on a research step's line: 40f 30g · Town
		fp: 5,
		hp: 2400,
		h: 34,
		dmg: 7,
		bow: 106,
		cd: 1.0,
		drop: [...RES, ...GOODK],
		room: 5,
		desc: 'Your seat. Trains villagers and scouts, advances the age and sends emissaries. Shoots nearby enemies; villagers who shelter inside add their arrows. If it falls, you lose.',
	},
	house: {
		nocap: 1,
		invest: 1,
		name: 'House',
		fp: 2,
		hp: 200,
		h: 16,
		cost: { w: 30 },
		t: 12,
		age: 0,
		room: 5,
		sab: 'burn',
		wood: true,
		desc: 'Shelter for five more people.',
	},
	farm: {
		cap: [6, 8, 10, 12, 12],
		invest: 2,
		name: 'Farm',
		fp: 3,
		hp: 120,
		h: 1,
		cost: { w: 60 },
		t: 10,
		age: 0,
		crop: 'food',
		rate: 0.8,
		walk: true,
		sab: 'burn',
		desc: 'Wheat, for food. One villager works it. Barely grows in winter; best at harvest. Soil tires when worked year after year and recovers when the field rests.',
	},
	treefarm: {
		cap: [6, 8, 10, 12, 12],
		name: 'Tree farm',
		fp: 3,
		hp: 120,
		h: 1,
		cost: { w: 80 },
		t: 12,
		age: 0,
		crop: 'wood',
		reserve: 1200, // about 36 minutes of one worker at 1x (0.55 a second; Albert, Nov 4: "36 and 12")
		rate: 0.55,
		walk: true,
		sab: 'burn',
		desc: 'A coppice plot: 1,200 wood, then it is cut out; tap it to replant for half the cost and it regrows from the stumps. One villager tends it. Slower than a wild forest, but safe at home.',
	},
	mill: {
		cap: [3, 3, 3, 3, 3],
		name: 'Mill',
		fp: 3,
		hp: 250,
		h: 18,
		cost: { w: 80 },
		t: 15,
		age: 0,
		drop: ['food'],
		sab: 'burn',
		wood: true,
		desc: 'Drop-off for food. Put it by berries, fields or game.',
	},
	// the Store (Albert, Nov 3, 13:15: "a Store building the age before the wagons ... cheaper ... doesn't spoil ... feeds the army better"):
	// the ever-normal granary of Geng Shouchang (54 BC) and the Roman horrea on raised floors. Its effects are fx on the side: food spoils half
	// as fast (raised, sealed stores against the open pit: SCIENCE), the army eats 10% less (a measured ration, the annona's 5 modii a month),
	// prices swing half as far for its owner (the granary bought cheap and sold at the set price). A Camp wagon needs one. The Scale line
	// researches here.
	store: {
		cap: [0, 1, 1, 2, 2],
		invest: 2,
		name: 'Store',
		fp: 3,
		hp: 400,
		h: 20,
		cost: { w: 150, s: 80 },
		t: 30,
		age: 1,
		drop: [...RES],
		fx: [
			{ s: 'spoil', m: 0.5 },
			{ s: 'eat', k: '#soldier', m: 0.9 },
			{ s: 'band', m: 0.5 },
		],
		sab: 'burn',
		desc: 'A raised, sealed storehouse and a drop-off for everything. Food spoils half as fast, soldiers eat 10% less, and prices swing half as far for you. A Camp wagon needs one. Researches the Scale line.',
	},
	lumber: {
		cap: [4, 4, 4, 4, 4],
		short: 'Lumber',
		name: 'Lumber camp',
		fp: 3,
		hp: 250,
		h: 14,
		cost: { w: 80 },
		t: 15,
		age: 0,
		drop: ['wood'],
		sab: 'burn',
		wood: true,
		desc: 'Drop-off for wood. Put it by a forest.',
	},
	mining: {
		cap: [4, 4, 4, 4, 4],
		name: 'Mine',
		fp: 3,
		hp: 250,
		h: 14,
		cost: { w: 80 },
		t: 15,
		age: 0,
		drop: ['stone', 'gold', 'iron'],
		sab: 'burn',
		desc: 'Drop-off for stone, gold and iron. Put it by a quarry, a gold seam or an iron vein.',
	},
	barracks: {
		cap: [1, 2, 2, 3, 3],
		name: 'Barracks',
		fp: 4,
		hp: 450,
		h: 22,
		cost: { w: 150 },
		t: 25,
		age: 0,
		sab: 'stall',
		wood: true,
		desc: 'Trains the foot: spearmen, then swordsmen.',
	},
	wall: {
		nocap: 1,
		name: 'Wall',
		fp: 1,
		hp: 100,
		h: 18,
		cost: { s: 5 },
		t: 10,
		age: 0,
		wallish: true,
		desc: 'One square of stone. It blocks everyone, you too: leave a Gate. Drag to draw a line of them.',
	},
	pit: {
		nocap: 1,
		name: 'Pit',
		fp: 1,
		hp: 60,
		h: 0,
		cost: { w: 20 },
		t: 8,
		age: 1,
		trap: 'pit',
		walk: true,
		desc: 'A hidden pit: a foe who steps in is hurt and stuck. Your people walk round it. An enemy scout finds it.',
	},
	net: {
		nocap: 1,
		name: 'Net',
		fp: 1,
		hp: 60,
		h: 0,
		t: 8,
		age: 0,
		trap: 'net',
		walk: true,
		desc: 'A hidden net on the causeway, laid by the Natives: a man who steps in is taken prisoner.',
	},
	stakes: {
		nocap: 1,
		name: 'Stakes',
		fp: 1,
		hp: 60,
		h: 0,
		cost: { w: 30 },
		t: 8,
		age: 1,
		trap: 'stakes',
		walk: true,
		desc: 'Sharpened stakes hidden in the grass: a foe who runs onto them is hurt, horses worst. Your people walk round them.',
	},
	// caltrops (Albert, Nov 3, field defences: yes): the Roman tribulus, four spikes with one always up, sown against horse; a strip drawn
	// like a wall, hidden until sprung; each square takes CALTROPS.hits before it is trodden flat; a foe on horse is hurt more and stuck (38-natives trapsTick)
	caltrops: {
		nocap: 1,
		name: 'Caltrops',
		fp: 1,
		hp: 40,
		h: 0,
		cost: { i: 6 },
		t: 4,
		age: 2,
		tech: 'caltrops',
		trap: 'caltrops',
		walk: true,
		desc: 'Iron spikes sown on the ground, hidden: a horse that crosses is hurt and stuck, a foot soldier hurt a little; each square takes three before it is trodden flat. Drag to sow a strip. Needs Caltrops at the Smithy.',
	},
	gate: {
		nocap: 1,
		name: 'Gate',
		fp: 1,
		hp: 150,
		h: 18,
		cost: { s: 10, w: 10 },
		t: 12,
		age: 0,
		wallish: true,
		wood: true,
		desc: 'A gap in your wall. Your people, your allies and anyone at peace with you walk through. Enemies have to break it.',
	},
	tower: {
		cap: [3, 4, 6, 8, 8],
		invest: 6,
		shelter: 5,
		name: 'Watchtower',
		short: 'Tower',
		fp: 2,
		hp: 500,
		h: 44,
		cost: { s: 100, w: 40 },
		t: 25,
		age: 0,
		dmg: 10,
		bow: 106,
		cd: 1.2,
		desc: 'Shoots enemies in range and sounds the horn. Up to 5 villagers shelter inside and each adds an arrow.',
	},
	range: {
		cap: [1, 2, 2, 3, 3],
		short: 'Range',
		name: 'Archery range',
		fp: 4,
		hp: 400,
		h: 20,
		cost: { w: 150 },
		t: 25,
		age: 1,
		sab: 'stall',
		wood: true,
		desc: 'Trains archers and javelineers, later crossbowmen.',
	},
	stable: {
		cap: [1, 2, 2, 3, 3],
		name: 'Stable',
		fp: 4,
		hp: 450,
		h: 22,
		cost: { w: 175 },
		t: 25,
		age: 1,
		sab: 'stall',
		wood: true,
		desc: 'Trains chariots, then cataphracts, horse archers and war elephants.',
	},
	smith: {
		name: 'Smithy',
		fp: 3,
		hp: 400,
		h: 20,
		cost: { w: 120 },
		t: 25,
		age: 1,
		sab: 'stall',
		desc: 'Researches weapons and armour for your soldiers, and defences for your walls.',
	},
	market: {
		invest: 10,
		name: 'Market',
		fp: 3,
		hp: 350,
		h: 18,
		cost: { w: 150, s: 50 },
		t: 25,
		age: 0,
		drop: GOODK,
		sab: 'stall',
		wood: true,
		desc: 'Swap 100 of a resource for gold or gold for a resource, and sell goods. Stores your goods and loads your caravans: give a caravan a route and it carries goods to a trade stop. Prices rise and fall with what everyone buys and sells. From the Medieval age it takes ventures.',
	},
	school: {
		name: 'School',
		fp: 3,
		hp: 350,
		h: 22,
		cost: { w: 120, s: 50 },
		t: 25,
		age: 1,
		sab: 'stall',
		desc: 'Reading, writing and numbers. Researches Writing and Mathematics.',
	},
	temple: {
		name: 'Temple',
		fp: 4,
		hp: 600,
		h: 34,
		cost: { s: 300, g: 150, w: 100 },
		t: 45,
		age: 1,
		sab: 'stall',
		desc: 'Very costly. Trains priests, who take holy sites, and lets you call Zeal on a battalion.',
	},
	// Recreation (Build 56, Albert: "why is it just war?"): three places a town lives in, each from the record, each with a real effect on health,
	// nerve or the vassal's temper, and each counting as investment in a vassal's town. One per age band.
	baths: {
		invest: 5,
		name: 'Baths',
		fp: 3,
		hp: 400,
		h: 18,
		cost: { s: 200, w: 60 },
		t: 32,
		age: 2,
		fx: [{ s: 'sick', m: 0.75 }],
		sab: 'stall',
		desc: 'Public baths: a clean people falls sick a quarter less. Counts as care for a vassal town.',
	},
	theatre: {
		invest: 6,
		name: 'Theatre',
		fp: 4,
		hp: 450,
		h: 20,
		cost: { s: 240, w: 120 },
		t: 36,
		age: 2,
		fx: [{ s: 'rest', m: 1.3 }],
		sab: 'stall',
		desc: 'An open theatre: soldiers at rest recover their nerve 30% faster. Counts as care for a vassal town.',
	},
	tavern: {
		invest: 4,
		name: 'Tavern',
		fp: 2,
		hp: 260,
		h: 16,
		cost: { w: 120, f: 60 },
		t: 20,
		age: 3,
		fx: [{ s: 'hate', m: 0.7 }],
		sab: 'burn',
		wood: true,
		desc: 'An alehouse: a people with somewhere to drink grumbles 30% less at your tax. Counts as care for a vassal town.',
	},
	courthouse: {
		name: 'Courthouse',
		fp: 3,
		hp: 450,
		h: 24,
		cost: { w: 150, g: 60 },
		t: 30,
		age: 1,
		spyonly: true,
		dmg: 12,
		bow: 106,
		cd: 1.5,
		desc: 'Written law and the watch. Trains spies, and its guards shoot the enemy spies they see, within bowshot. Nothing else.',
	},
	apartment: {
		nocap: 1,
		name: 'Apartment',
		fp: 3,
		hp: 500,
		h: 30,
		cost: { w: 100, s: 50 },
		t: 30,
		age: 2,
		room: 20,
		sab: 'burn',
		desc: 'A tall block with room for twenty more people. Costs stone, and a bigger target than a house.',
	},
	// the war camp's pieces (CAMP; 38-camps): never built by hand, they come off a wagon; the wagon's price paid for them
	medtent: {
		nocap: 1,
		camp: 1,
		name: 'Medical tent',
		fp: 2,
		hp: 120,
		h: 14,
		cost: {},
		t: 20,
		age: 1,
		heal: 2,
		hrng: 70,
		sab: 'burn',
		wood: true,
		desc: 'Binds wounds within 70, 2 health a second, and sends the badly hurt and the sick home to the Hospital.',
	},
	traintent: {
		nocap: 1,
		camp: 1,
		name: 'Training tent',
		fp: 2,
		hp: 120,
		h: 14,
		cost: {},
		t: 20,
		age: 1,
		sab: 'stall',
		wood: true,
		desc: 'Trains foot soldiers and villagers in the field, at a quarter more than the price (Field logistics: a tenth).',
	},
	messtent: {
		nocap: 1,
		camp: 1,
		name: 'Mess tent',
		fp: 2,
		hp: 120,
		h: 14,
		cost: {},
		t: 20,
		age: 1,
		sab: 'burn',
		wood: true,
		desc: 'Soldiers resting by it mend as at the Barracks.',
	},
	depot: {
		nocap: 1,
		camp: 1,
		name: 'Supply depot',
		fp: 2,
		hp: 150,
		h: 14,
		cost: {},
		t: 20,
		age: 1,
		drop: [...RES],
		sab: 'burn',
		wood: true,
		desc: 'A drop-off in the field: villagers near the camp bring what they gather here.',
	},
	camptower: {
		nocap: 1,
		camp: 1,
		name: 'Camp tower',
		fp: 2,
		hp: 300,
		h: 30,
		cost: {},
		t: 25,
		age: 1,
		dmg: 6,
		bow: 90,
		cd: 1.4,
		wood: true,
		desc: 'A timber tower: shoots enemies in range and sounds the horn.',
	},
	abatis: {
		nocap: 1,
		camp: 1,
		name: 'Abatis',
		fp: 1,
		hp: 80,
		h: 10,
		cost: {},
		t: 1,
		age: 1,
		wallish: true,
		wood: true,
		desc: 'Felled trees laid toward the enemy, their branches sharpened: the trees that stood where a camp was cut, kept as its outer work. Blocks everyone.',
	},
	palisade: {
		nocap: 1,
		camp: 1,
		name: 'Palisade',
		fp: 1,
		hp: 60,
		h: 14,
		cost: {},
		t: 6,
		age: 1,
		wallish: true,
		wood: true,
		desc: 'One square of stakes round the camp. It blocks everyone, you too: the gate is the way in.',
	},
	hospital: {
		name: 'Hospital',
		fp: 3,
		hp: 400,
		h: 20,
		cost: { w: 150, s: 100 },
		t: 30,
		age: 2,
		heal: 3,
		hrng: 90,
		sab: 'burn',
		desc: 'Heals your soldiers within 90, 3 health a second, and trains medics who heal in the field.',
	},
	library: {
		name: 'Library',
		name3: 'University',
		fp: 4,
		hp: 450,
		h: 26,
		cost: { w: 200, s: 150, g: 50 },
		t: 40,
		age: 2,
		sab: 'stall',
		desc: 'Scholars together: researches Architecture, Roads and Medicine. In the Medieval age it is a University.',
	},
	siege: {
		cap: [1, 2, 2, 3, 3],
		short: 'Siege',
		name: 'Siege workshop',
		fp: 4,
		hp: 450,
		h: 22,
		cost: { w: 250, s: 100 },
		t: 30,
		age: 2,
		sab: 'stall',
		desc: 'Builds rams, siege towers, catapults and ballistae, later trebuchets.',
	},
	aqueduct: {
		nocap: 1,
		name: 'Aqueduct',
		fp: 3,
		hp: 600,
		h: 28,
		cost: { s: 250, w: 150 },
		t: 40,
		age: 2,
		fx: [{ s: 'sick', m: 0.8 }],
		sab: 'burn',
		desc: 'Water for a city: its people fall sick a fifth less, and an Apartment needs one. It houses no one.',
	},
	dock: {
		cap: [2, 2, 2, 2, 2],
		name: 'Dock',
		fp: 2,
		hp: 200,
		h: 6,
		cost: { w: 100 },
		t: 15,
		age: 0,
		shore: true,
		drop: ['food'],
		sab: 'burn',
		wood: true,
		desc: 'Stands on a shore. Villagers on Food fish from it and bring the catch here. No dock, no fishing.',
	},
	town: {
		cap: [0, 0, 1, 2, 2],
		invest: 15,
		shelter: 6,
		short: 'Town',
		name: 'Town Center',
		fp: 4,
		hp: 1800,
		h: 30,
		cost: { w: 400, s: 300, f: 200 },
		t: 60,
		age: 2,
		dmg: 6,
		bow: 106,
		cd: 1.2,
		drop: [...RES, ...GOODK],
		room: 5,
		desc: 'A second town: trains villagers, takes every drop-off, shoots and shelters villagers. Losing it does not lose the game; losing your first does.',
	},
	castle: {
		cap: [0, 0, 0, 1, 2],
		invest: 20,
		shelter: 10,
		name: 'Castle',
		fp: 5,
		hp: 3200,
		h: 40,
		cost: { s: 900, w: 300 },
		t: 90,
		age: 3,
		dmg: 12,
		bow: 140,
		cd: 1.0,
		desc: 'A stone castle: the strongest building there is. Shoots far and shelters ten villagers who add their arrows. Built in the lands of a vassal, it keeps them safe and loyal.',
	},
	pasture: {
		cap: [2, 3, 4, 4, 4],
		invest: 2,
		name: 'Pasture',
		fp: 3,
		hp: 120,
		h: 1,
		cost: { w: 60, f: 60 },
		t: 10,
		age: 0,
		crop: 'wool',
		reserve: 0,
		rate: 1.5,
		walk: true,
		sheep: 6,
		milk: 0.03,
		sab: 'burn',
		desc: 'A fenced flock. While a shepherd tends it every sheep gives milk and meat: food straight to your stores. Sheep are shorn in spring, and the wool waits for a Workshop; lambs come in spring (up to 12). Wolves take sheep.',
	},
	council: {
		invest: 6,
		short: 'Council',
		name: 'War Council',
		fp: 3,
		hp: 600,
		h: 22,
		cost: { w: 200, s: 150, g: 50 },
		t: 35,
		age: 2,
		sab: 'stall',
		desc: 'Where your generals plan. Research Engagement, then Battalions, then Formations, then in the Gunpowder age Muster.',
	},
	tpost: {
		nocap: 1,
		invest: 6,
		name: 'Trade post',
		fp: 2,
		hp: 300,
		h: 20,
		cost: { w: 100, s: 30 },
		t: 20,
		age: 1,
		atStop: true,
		dmg: 5,
		bow: 106,
		cd: 1.6,
		sab: 'burn',
		desc: 'Built on a trade stop once its guards are gone. You own the stop: a cut of the sales of everyone else there, 20% for one stop of its route up to 40% for all four; all four of a route also pay gold every second. Up to 12 soldiers can garrison it.',
	},
	// A building that shoots has a bow (what its weapon reaches from the ground: a bow 106, the engines on a castle's or the Throne's walls 140)
	// and a height (h); its range is the two by projectile arithmetic (rangeOf in 08-core, Build 56): a tower shoots farther because it is tall.
	// Workshops turn what is in store into something else; one villager works each. makes: what it can make, from what, how fast; the card picks which.
	workshop: {
		name: 'Workshop',
		fp: 3,
		hp: 250,
		h: 16,
		cost: { w: 120, s: 30 },
		t: 20,
		age: 1,
		crop: 'cloth',
		makes: { cloth: { from: { wool: 2 }, rate: 0.12 }, beer: { from: { f: 3 }, rate: 0.15 } },
		drop: ['wool'],
		sab: 'burn',
		wood: true,
		open: true,
		desc: 'Spins and weaves wool into cloth (2 wool make 1), or brews ale from your grain (3 food make 1 beer): goods to trade. One villager works it; the card picks what it makes.',
	},
	mint: {
		cap: [0, 0, 2, 6, 12], // two in Classical (Albert, Nov 4: the mint at the third age; rate and cost tuned after play)
		invest: 6,
		name: 'Mint',
		fp: 3,
		hp: 500,
		h: 22,
		cost: { s: 300, g: 200 },
		t: 45,
		age: 2,
		crop: 'gold',
		makes: { gold: { from: { s: 1 }, rate: 0.2 } },
		fx: [{ s: 'gather', k: ['gold', 'mint'], m: 1.15 }],
		sab: 'stall',
		desc: 'Strikes coin from the silver in your stone: 1 stone makes 1 gold, and gold gathered pays 15% more. Or debase the coin, once: a heap of gold now, and dearer prices at your Market for the rest of the game.',
	},
	foundry: {
		cap: [0, 0, 0, 6, 12],
		name: 'Foundry',
		fp: 3,
		hp: 500,
		h: 24,
		cost: { s: 250, w: 150 },
		t: 40,
		age: 3,
		crop: 'iron',
		makes: { iron: { from: { w: 2 }, rate: 0.2 } },
		sab: 'stall',
		open: true,
		desc: 'Smelts iron from bog ore with charcoal: 2 wood make 1 iron. One villager works it. Iron in-house, without a vein.',
	},
	quarry: {
		cap: [0, 0, 4, 8, 12],
		name: 'Quarry',
		fp: 3,
		hp: 150,
		h: 1,
		cost: { w: 80 },
		t: 15,
		age: 2,
		crop: 'stone',
		rate: 0.45,
		walk: true,
		sab: 'burn',
		desc: 'Cut stone from the bedrock, anywhere: one villager works it, slower than a quarry face in the hills, but it never runs out.',
	},
	throne: {
		nocap: 1,
		name: 'Throne',
		fp: 6,
		hp: 3600,
		h: 56,
		dmg: 8,
		bow: 140,
		cd: 1.5,
		shelter: 12,
		drop: [],
		desc: 'The old citadel in the middle of the world. Whoever holds it takes a tithe of the gathering of everyone else and climbs the score; hold it long enough and the game is won. It is taken, not broken: break it down and it is yours at a third of its strength.',
	},
	// the Hall (Albert, Nov 3, 13:15: "a special building that gives the tech for the very special Civ stuff"): one a side, Classical, named
	// by the people (CIVS.hall: the Forum, the Taixue, the Satrap's Court, the Ordu, the Mantriparishad, Sankore); it holds that people's three
	// specialities as research (TECH with civ, at 'hall'), each from history with its number (SCIENCE), and its card tells the history
	hall: {
		name: 'Hall',
		fp: 3,
		hp: 600,
		h: 26,
		cost: { w: 220, s: 160, g: 120 },
		t: 45,
		age: 2,
		one: true,
		invest: 3,
		sab: 'stall',
		desc: 'The seat of what makes your people themselves: it researches your three specialities, each from history.',
	},
	wonder: {
		name: 'Wonder',
		fp: 6,
		hp: 4000,
		h: 60,
		cost: { f: 1500, w: 1500, s: 1500, g: 1500 },
		t: 240,
		age: 2,
		one: true,
		desc: 'The great work of your civilisation. When it is finished every side is told, and if it still stands 8 minutes later, you win.',
	},
};
const WONDER_HOLD = 480;
const QUEUE = 5; // orders a building holds in its line, before Written records and Guilds
const MINT = { debase: 600, price: 1.3 }; // debasing: gold at once, and every Market price multiplied for the rest of the game
const NOTICE = 30; // seconds between declaring a side hostile and the first blow: no ambush from peace
// what a lord may ask of a vassal: a demand of one resource (loyalty cost grows with each demand in the last two minutes), forced tribute
// (double tax for a spell, only with soldiers at their town), a levy of their soldiers (their dead cost loyalty)
const DEMAND = {
	amt: 100,
	loyal: 5,
	recent: 120,
	tribute: 180,
	tributeMen: 8,
	tributeUnrest: 10,
	levyLoyal: 2,
	levyMax: 0.5,
};
// Each building's limits sit on the building itself: cap (how many in each age, Stone … Gunpowder; not listed: one), nocap (room and stone bound it),
// invest (loyalty for a vassal within 450 of it; others: 3), shelter (arrows villagers add inside it).
const TRAINERS = new Set(['keep', ...Object.values(UNIT).flatMap((U) => (U.at ? [U.at, ...(U.also || [])] : []))]); // buildings that send people out keep a free square round them; the rest may touch

// The build menus. "soon" is on the list but not built: it stays visible until built or deliberately dropped (and logged).
const MENUS = [
	{ id: 'home', name: 'Home', blurb: 'room to live', items: ['house', 'apartment', 'aqueduct', 'town'] },
	{
		id: 'land',
		name: 'Land',
		blurb: 'food, wood, stone, gold',
		items: ['farm', 'pasture', 'treefarm', 'quarry', 'mill', 'store', 'dock', 'lumber', 'mining'],
	},
	{
		id: 'mil',
		name: 'War',
		blurb: 'where soldiers are trained',
		items: ['barracks', 'range', 'stable', 'siege', 'smith', 'council'],
	},
	{
		id: 'def',
		name: 'Walls',
		blurb: 'towers, walls and gates',
		items: ['tower', 'castle', 'wall', 'gate', 'pit', 'stakes', 'caltrops'],
	},
	{ id: 'shop', name: 'Trade', blurb: 'markets, goods and caravans', items: ['market', 'workshop', 'mint', 'foundry'] },
	{
		id: 'cult',
		name: 'Culture',
		blurb: 'faith, law, learning, wonders',
		items: ['school', 'library', 'hospital', 'temple', 'courthouse', 'baths', 'theatre', 'tavern', 'hall', 'wonder'],
	},
];
// ═════ 05-rules-wild.js: finds in the wild, the Natives, the Throne, the computers' personalities ═════
// What you can find in the wild. Each corner gets the same set, turned toward the middle.
// guard: [real kind, fantasy kind, how many]. got: what the first side to reach it (guards dead) takes. fantasy adds half.
const FINDS = {
	chest: {
		name: 'Treasure chest',
		guard: ['wolf', 'direwolf', 2],
		got: { f: 100, g: 150 },
		desc: 'Someone buried this and never came back. Kill the guards, then touch it.',
	},
	ruins: {
		name: 'Ruins',
		guard: ['bandit', 'goblin', 3],
		got: { g: 50 },
		tech: true,
		desc: 'An old library in ruins, held by outlaws. Clear it and you find a scroll: one research of your age, free.',
	},
	cemetery: {
		name: 'Old cemetery',
		guard: ['robber', 'skeleton', 2],
		got: { g: 250 },
		desc: 'Grave goods, and grave robbers already at work. Clear them and the gold is yours.',
	},
	camp: {
		name: 'Robber camp',
		guard: ['robber', 'troll', 4],
		got: { f: 200, w: 200, g: 250 },
		desc: 'Robbers who prey on caravans and villagers near the map edge. Break the camp and take its hoard.',
	},
	den: {
		name: 'Bear den',
		guard: ['bear', 'bear', 1],
		got: { f: 60 },
		desc: 'A bear and its stores. The meat is good too.',
	},
	stop: {
		name: 'Trade stop',
		guard: ['bandit', 'goblin', 3],
		stop: true,
		desc: 'A stop on an old trade route. Caravans sell goods here and buy spice. Clear its guards and build a Trade post to own it.',
	},
	shrine: {
		name: 'Shrine',
		capture: 10,
		pay: 0.25,
		r: 50, // a priest within this of its middle holds it: the Throne's half (30) and a figure's reach; the shrine shares the Throne's square (Albert, Nov 1)
		desc: 'The one holy site, in the Throne itself. Stand a priest at the foot of the Throne for 10 s and it pays its keeper 15 gold a minute. A priest of another side can take it back.',
	},
	vagabonds: {
		name: 'Vagabonds',
		hire: { cost: { g: 90 }, unit: 'spear', n: 3 },
		desc: 'Three drifters will fight for whoever pays 90 gold. A unit of yours has to be within 80.',
	},
	mercs: {
		name: 'Mercenaries',
		hire: { cost: { g: 240 }, unit: 'sword', n: 6 },
		gone: 180,
		desc: 'A free company camped by the road: six swords for 240 gold, for three minutes, then they move on.',
	},
	meteor: {
		name: 'Fallen star',
		got: { i: 300, g: 100 },
		desc: 'Iron from the sky. Before smelting, this was where iron came from; the dagger of Tutankhamun was forged from it.',
	},
};
const WAYFARER_EVERY = 240;
const WILD_LOOK = 140; // how far a beast or a guard looks for a stranger near its home (v70's distance, restored in Build 80 preview 9); a defender (boar, bear) then weighs it by Hawk-Dove V/C

// the Fortress posts a job: break one guarded find, first side to take it is paid
// ───────────────────────── The Natives: the fifth side, with one brain ─────────────────────────
// They hold the Throne, a citadel on the great lake's island, reached by four causeways (the choke points). Their regard for each side moves
// with gifts, blows and time; at PEACE they leave you be, at ALLY their gate opens. Gifts follow the Danegeld rule: each one buys less than
// the last. Pits and nets on the causeways; prisoners for ransom; outlaw raids on whoever they regard least. They command the camps.
// Regard (answer 1b, Albert Nov 1): the Natives' flow, one for each of the four misfit groups. What a group thinks of each side (0..100): gifts
// raise it (the Danegeld rule, each buys less than the last), blows on the group lower it, it drifts back to regard0; at peaceAt the group
// leaves the side be, under it the group is a foe. At allyAt an emissary makes a friend of any group, as of the Natives (Albert, Nov 1). Special rules per group come later (v81).
const REGARD = {
	regard0: 20,
	peaceAt: 40,
	allyAt: 70,
	decay: 0.1,
	hitCost: 2,
	warCost: 20, // turning on a group yourself
	giftMax: 300, // the gift slider on Relations runs 0 to 300 (v70's two gifts were 100 and 300) and snaps to 50 (Albert, Oct 31)
	giftStep: 50,
	danegeld: 0.5,
	giftWindow: 600,
};
// The wild's groups (answer 1b): animals are everyone's foe, always; the four misfit groups each keep their own regard for each side.
// Who belongs: the Natives (their warriors, walls, towers and pits), the outlaws (the horde), the bandits and the robbers (by kind: UNIT.gang).
const GANG = { nat: 'Natives', out: 'Outlaws', ban: 'Bandits', rob: 'Robbers' };
const NATIVE = {
	garrison: 24,
	perAge: 8,
	regrow: 20,
	gunAge: 4,
	gunMax: 0.6,
	gunRegrow: 2,
	gunHit: 1.5,
	traps: 4,
	trapR: 10,
	pit: 0.4,
	stuck: 4,
	relay: 90,
	scoutSees: 60,
	raidGap: [180, 480],
	raidN: 2,
	raidFrom: 600,
	raidSecs: 45,
	raidLoad: 2, // N16a: β, the pull of a load in transport, w = (1 + β·load / CARRY) / (1 + γ·guard) (38-natives natRaid)
	raidGuard: 1, // γ, the push of an armed guard within GROUP_R, as a share of the band's strength
	handover: 60,
	handoverMen: 8,
	struck: 60, // decision 4b: how long a camp remembers a computer's unit that struck it (s)
};
const THRONE = { hold: 900, tithe: 0.1, score: 50, r: 80, isle: 100, cause: 30, causeTo: LAKE0.r + 60 }; // isle: the island's radius; cause: a causeway's width, causeTo: how far from the middle it runs (over the great lake's shore): the walking grid and the ground picture read the same (preview 52) // hold: seconds to win in a 60-minute game (scaled to the game's length); tithe of every other side's gathering; score a minute

// A wave is judged by its progress (D1, docs/6 Records/v80 Audit/ai.md): it goes home when beaten (under broke of the soldiers it set out with), or
// when for stall seconds it has neither come step nearer its goal (the mean of its soldiers' distances) nor fought (a blow within fight
// seconds). A side it stalled against is left alone for cool seconds, unless that side holds a wonder or the Throne (a win at stake). It was recalled at 45 s without a blow, so a walk of 58 s to a
// neighbour failed unless something fought it on the way, and the same soldiers went straight back at the same target.
const WAVE = { broke: 0.35, stall: 45, step: 30, fight: 30, cool: 180 };

// The three computer personalities: one brain, three settings. Every behaviour is a field, never a name check.
// build: [kind, from age, how many, needs army of at least, needs stock] (plots are not listed: they follow the plot test, 17-ai); techs in the order they want them.
const PERS = {
	aggr: {
		crown: 'war', // the crown this personality chases (39-games)
		goals: ['army', 'age', 'build'], // what its hands work toward: the first of these it wants (17-ai goalOf; answer 10)
		mix: { food: 0.5, wood: 0.35, gold: 0.15, stone: 0, iron: 0.08 },
		extraBarracks: 1,
		armyCap: 34,
		waveMin: 5,
		bold: 0.5,
		guard: 0.15,
		raid: 3,
		towers: 0,
		walls: false,
		early: 6,
		ageArmy: 6,
		diplo: true,
		trade: true,
		spy: true,
		loot: true,
		wonder: false,
		siege: 1,
		shrine: false,
		build: [
			['barracks', 0, 1, 0],
			['range', 1, 1, 0],
			['stable', 1, 1, 4],
			['smith', 1, 1, 6],
			['market', 1, 1, 6, { w: 250, g: 100 }],
			['courthouse', 1, 1, 8, { w: 250, g: 100 }],
			['siege', 2, 1, 10, { w: 300 }],
			['council', 2, 1, 12, { w: 250, s: 150 }],
		],
		techs: [
			'drill',
			'bronze',
			'axes',
			'plough',
			'horses',
			'leather',
			'composite',
			'iron',
			'cavalry',
			'engage',
			'phalanx',
			'chain',
		],
	},
	bal: {
		crown: 'wealth',
		goals: ['age', 'build', 'army'],
		mix: { food: 0.4, wood: 0.3, gold: 0.2, stone: 0.1, iron: 0.1 },
		extraBarracks: 0,
		armyCap: 34,
		waveMin: 10,
		bold: 0.65,
		guard: 0.3,
		raid: 2,
		towers: 1,
		walls: true,
		early: 12,
		ageArmy: 0,
		diplo: true,
		trade: true,
		spy: true,
		loot: true,
		wonder: true,
		siege: 2,
		shrine: true,
		build: [
			['barracks', 0, 1, 0],
			['range', 1, 1, 0],
			['smith', 1, 1, 0],
			['stable', 1, 1, 4],
			['market', 1, 1, 6, { w: 250, g: 100 }],
			['school', 1, 1, 8, { w: 300, s: 100 }],
			['temple', 1, 1, 10, { s: 450, g: 300 }],
			['courthouse', 1, 1, 8, { w: 250, g: 100 }],
			['siege', 2, 1, 8, { w: 300, s: 100 }],
			['hospital', 2, 1, 10, { w: 250, s: 200 }],
			['library', 2, 1, 10, { w: 400, s: 300 }],
			['council', 2, 1, 12, { w: 250, s: 150 }],
		],
		techs: [
			'axes',
			'picks',
			'plough',
			'bronze',
			'leather',
			'drill',
			'coppice',
			'composite',
			'writing',
			'maths',
			'horses',
			'iron',
			'chain',
			'engage',
			'phalanx',
			'cavalry',
			'deep',
			'masonry',
			'architecture',
			'medicine',
			'roads',
			'coinage',
			'ovens',
			'rotation',
			'wheelbarrow',
			'arms',
			'knighthood',
			'longbow',
			'plate',
			'heavyplough',
			'pikesquare',
			'slits',
			'fortify',
			'muster',
		],
	},
	fort: {
		crown: 'wellbeing',
		goals: ['build', 'age', 'army'],
		mix: { food: 0.4, wood: 0.3, gold: 0.15, stone: 0.15, iron: 0.08 },
		extraBarracks: 0,
		armyCap: 30,
		waveMin: 12,
		bold: 0.85,
		guard: 0.5,
		raid: 1,
		towers: 3,
		walls: true,
		opportunist: 1.3,
		early: 12,
		ageArmy: 0,
		diplo: true,
		trade: true,
		spy: true,
		loot: true,
		wonder: true,
		siege: 1,
		shrine: true,
		build: [
			['barracks', 0, 1, 0],
			['range', 1, 1, 0],
			['smith', 1, 1, 0],
			['stable', 1, 1, 6],
			['school', 1, 1, 6, { w: 300, s: 100 }],
			['temple', 1, 1, 8, { s: 450, g: 300 }],
			['courthouse', 1, 1, 6, { w: 250, g: 100 }],
			['hospital', 2, 1, 8, { w: 250, s: 200 }],
			['library', 2, 1, 8, { w: 400, s: 300 }],
			['aqueduct', 2, 1, 8, { s: 400 }],
			['castle', 3, 1, 12, { s: 1100, w: 400 }],
			['council', 2, 1, 10, { w: 250, s: 150 }],
		],
		techs: [
			'masonry',
			'leather',
			'axes',
			'picks',
			'bronze',
			'plough',
			'coppice',
			'writing',
			'maths',
			'chain',
			'iron',
			'drill',
			'deep',
			'architecture',
			'medicine',
			'slits',
			'rotation',
			'wheelbarrow',
			'engage',
			'phalanx',
			'fortify',
			'plate',
			'heavyplough',
			'pikesquare',
			'longbow',
		],
	},
};
// ═════ 06-rules-tuning.js: combat, morale, weather, hazards, events, routes, market and land numbers ═════
const TRADE = { f: 80, w: 80, s: 110, i: 120 },
	TRADE_CAP = 80,
	TRADE_DIV = 16000,
	SELL = 0.8,
	BUY = 1.25; // TRADE_CAP, TRADE_DIV: an ally run pays distance² ÷ 16000, at most 80 gold
const ZEAL = { cost: { g: 60 }, secs: 45, cd: 120, mul: 1.2 };
const SAB = { burn: 0.6, stall: 40 };
const FLANK = 1.3; // a blow from behind lands 30% harder
// Where a blow comes from (Build 62, Albert: "a big group's orientation is random; that is not a flank"): a blow counts as from the side or
// behind only when the man cannot turn to meet it (engaged with another, slipped, or broken) and no comrade stands between him and it
// within cover (the line covers its own); the facing is the group's line (the mean facing within line), not the one figure's. The unit-level
// facing of wargaming (the ancient line was turned only at its ends) rather than per-figure chance.
const FLANKING = { cover: 30, line: 40 };
// ───────────────────────── Combat you steer: nerve, flanks, charge and fall back, prisoners, conversion ─────────────────────────
// Every soldier has nerve (0..1). Blows drain it by the share of health they take, times hit (a flank blow 1.5 times, a rear blow twice); being
// outnumbered drains it; a loss beside it drains it by its share of the group (Dupuy's break point, Build 62: a force breaks when its losses reach
// a share, breakAt, of its number; Dupuy, *Numbers, Predictions and War*, 1979, and *Understanding War*, 1987, ch. 8: historical breakpoints
// 10% to 40%). Quiet restores it as the first-order lag toward 1 (tau seconds to 63%); a wall or tower of its own, its Town Center and a priest
// shorten that time; Engagement at the War Council shortens the rout. At zero it routs: runs for home for a spell, takes more harm, and can be
// taken prisoner by any foe who lays a hand on it. Most real battles ended in a rout.
const MORALE = {
	hit: 0.8,
	side: 1.5,
	rear: 2,
	kill: 0.04,
	breakAt: 0.3,
	lossR: 40,
	odds: 0.02,
	tau: 15,
	shelter: 1.5,
	priest: 2,
	priestR: 120,
	rout: 8,
	routHit: 1.5,
	routSpd: 1.3,
	after: 0.6,
	wild: 0.5, // an animal (its kind, not its owner: N4) hits a soldier at half strength and does not shake its nerve (Build 44)
	capR: 10,
	capAfter: 2, // seconds a runner has to get away before a hand may take it prisoner
};
const CHARGE = { secs: 6, spd: 1.5, dmg: 1.3, tired: 10, tiredSpd: 0.8, cd: 30 }; // a burst, then tired
// the juice pass (Albert, Nov 3; Bad North, Iron Marines: every blow felt): a charging blow shoves the one it lands on back shove units and
// jolts the screen jolt px for joltS s with a thud; a soldier hit recoils recoil px for recoilS s; one under stagger of its health sways
// the cost of an order (Albert, Nov 3, 11:14: "in real life you can't just move people around … it should cost something, a little extra
// food, maybe makes them a little more tired"): a drill of the Director or a squad sent eats, for each soldier, mins minutes' worth of its
// share (shareOf, 36-economy: a foot soldier 1.5 shares, a rider 3, as Engels has a soldier's grain at 3 to 4 lb a day and a horse's at 10
// with 10 of fodder), and leaves it tired for tired s (CHARGE.tiredSpd): give many orders and the army slows. With no food in the store
// the order still goes; the hunger rule (UPKEEP.hunger) is the price then
const ORDER = { mins: 0.5, tired: 6 };
// scale (the Store's Learning by doing; Wright 1936: unit labour falls a constant share per doubling of the quantity made; here a plot's
// yield rises per standing plot of its kind past the first, to a cap): yield × (1 + per × min(cap, n − 1)) with fx 'scale'
const SCALE = { per: 0.05, cap: 4, kinds: ['farm', 'treefarm', 'quarry', 'mint', 'foundry'] }; // kinds: the five the step names (p44)
// field defences (Albert, Nov 3, "yes" to the report docs/4 Now/Field defences.md): caltrops, a sown square takes `hits` before it is flat; a horse
// loses `horse` of its health and is stuck `stuck` s, a foot soldier `foot`; one unit is spiked once in `again` s. The archers' stakes: a
// shooter that has stood `plant` s with Archers' stakes researched has its stake in the ground; a horse that strikes it takes `dmg` of its
// health, its charge ends and it is thrown back; the stake comes up when the shooter moves
const CALTROPS = { hits: 3, horse: 0.3, foot: 0.08, stuck: 3, again: 2 };
const STAKES = { plant: 5, dmg: 0.25, shove: 10 };
// forming (Albert, Nov 3, 10:48; his outside note of 09:35): while soldiers walk to their places in a shape, the one of lower precedence
// gives way (foot, then archers, then riders, then siege: CLS order), and the push between two forming is soft; past share of the drill's
// time, one not share of the way to its place holds where it stands and fights from there (the x% by x% rule)
const FORMING = { soft: 0.5, share: 0.7 };
const JUICE = { shove: 5, jolt: 2, joltS: 0.08, recoil: 2.5, recoilS: 0.2, stagger: 0.3 };
// ───────────────────────── The climate (Build 54): the whole game reads three numbers, the air's temperature, the ground's wetness and the sky's run ─────────────────────────
// Temperature: a yearly swing and a daily swing round a mean (design: a temperate land about 45° north). The sky runs as a chain: whether the
// next minute is wet depends on this one (Gabriel & Neumann, QJRMS 1962, Tel Aviv: P(wet|dry) 0.25, P(wet|wet) 0.66, rounded here; dry
// summers by design). What falls is set by the temperature: rain above freezing, snow below. Wetness closes on where the sky puts it on an
// exponential timelag (the 10-hour fuel class, scaled to the game's 2-minute day). Mud is wetness past a threshold, deeper by water (pooling).
// Snow melts by degree-days; ice forms on wet ground below freezing and thaws above it. Walking pays Pandolf's terrain factors (1977:
// over dirt, swamp 1.8, soft snow about 1.6). Fire follows Rothermel's moisture damping (1972; USDA RMRS-GTR-371). Every number: SCIENCE.md.
// Research at the Library (Weather line), Stable (horseshoes), Barracks (cloaks) and Smithy (tempering, oiling) takes the edge off, never all of it at once.
const CLIMATE = {
	lat: 45, // degrees north: the land's place, which sets the sun's arc and the day's length by season
	equinox: 80, // the game's year begins in Spring: day 80 of the real year (about March 21)
	noon: 0.28, // the game day's fraction at which the sun is highest (midnight at 0.78, as the old night was)
	mean: 10,
	year: 12,
	day: 5, // °C: the yearly mean, half the swing of the year, half the swing of the day
	peakDay: 0.375,
	peakHour: 0.42, // when the year is hottest (mid-Summer) and the day (mid-afternoon)
	chain: { Spring: [0.3, 0.7], Summer: [0.15, 0.5], Autumn: [0.3, 0.7], Winter: [0.3, 0.7] }, // P(wet next | dry now), P(wet next | wet now)
	hazard: { drought: [0.05, 0.3], winter: [0.45, 0.8] }, // the chain under the Drought hazard (Summer) and the Harsh winter hazard (Winter)
	drought: { dry: 4, temp: 16 }, // a drought: this many dry minutes in a row with the air above this
	blizzard: 0.6, // under the Harsh winter hazard, this share of snowfalls is a blizzard
	tau: { wet: 20, dry: 50 }, // seconds for wetness to close 63% of its gap, getting wet and drying
	eq: { rain: 1, snow: 0.85, blizzard: 0.85, clear: 0.12, frost: 0.12, drought: 0.04 }, // where wetness settles under each sky
	mud: [0.45, 0.95], // wetness where mud begins and is full
	shore: 1.5, // mud within reach of water is this much deeper (pooling)
	// The ground (Build 62): one water balance. Rain wets the ground (the timelag above); snow and ice melt by the degree-day method, and
	// what melts goes into the ground's water (nothing vanishes); water freezes into ice by Stefan's law, thickness ∝ √(freezing degree-seconds).
	snowAt: 1, // °C and below, what falls is snow (Jennings, Winchell, Livneh & Molotch, Nature Comm. 9, 2018: the 50% rain–snow air temperature, 1.0 °C in humid air)
	snow: { fall: 0.02, melt: 0.004, rain: 0.5, water: 0.5 }, // depth a second of snowfall (a blizzard twice); melt a second per °C above 0 (the degree-day factor; Hock 2003); rain on snow melts it this much faster per °C (the rain's heat, USACE 1956, scaled); full snow holds this much ground water
	ice: { fdd: 500, melt: 0.0064, water: 0.3 }, // Stefan (1891): thickness = √(freezing degree-seconds / fdd), full at fdd; melt a second per °C above 0, 1.6 × snow (Hock 2003: ice is darker); full ice holds this much ground water
	terrain: { mud: 0.8, snow: 0.6 }, // Pandolf's factors over dirt: swamp +0.8 at full mud, soft snow +0.6 at full depth
	rut: { n0: 300, deep: 1, tau: 600 }, // mud by traffic: a square trodden n0 unit-seconds has rut depth deep × full mud; depth ∝ passes^0.4 (USFS trafficability, Build 62); ruts heal with tau
	// Traction (Build 62): the friction a surface offers against what a step needs. Measured coefficients, boot on surface: dry soil 0.7, wet soil 0.45,
	// packed snow 0.3, ice 0.08 near 0 °C rising to 0.25 at −20 (Bowden & Hughes 1939: the melt film is what makes ice slick, and deep cold has none).
	// A walker needs about 0.2 (Hanson, Redfern & Mazumdar, Ergonomics 42, 1999); the chance of a slip rises as what is on offer falls below it.
	// Bare boots on wet ice measure 0.08, on cold dry ice 0.20 (Hsu et al., Ergonomics 59, 2016). Iron studs bite the ice: studded tyres on ice
	// and snow 0.28 at −5 °C and below, more nearer 0 (Ichihara & Mizoguchi, HRB Special Report 115, Table 2; the lowest bin taken). Horseshoes
	// (hooves) and Crampons (boots) give the ice term at least `studs`; each is on its own contact, so they never add (D-064).
	mu: {
		dry: 0.7,
		mud: 0.45,
		snow: 0.3,
		ice0: 0.08,
		iceCold: 0.25,
		coldAt: 20,
		need: { foot: 0.2, horse: 0.25, siege: 0.3 },
		studs: 0.28,
		soft: 0.03,
		stride: 0.25,
	},
	slipSecs: 1.5, // a slip holds a man in place this long
	miss: 0.5,
	missHurt: 0.08, // snow: an engine slides and its shot falls short, hurting its own crew
	wear: 0.15, // frost makes blades brittle and rain rusts them: weapons do 15% less until tempered and oiled
};
// Fire between buildings (Build 61): a fire grows as the square of its age (the t² design fire, NFPA 72 / Heskestad 1984), and what a neighbour
// receives falls with the configuration factor of radiant heat, about (near / (gap + near))² (the view-factor method of BR 187 / Approved
// Document B, "space separation"). rate: the chance a second a full fire lights a touching wooden neighbour, times the ground's dryness
// (Rothermel); grow: seconds to a full fire (design: a house burns down in 50); near: the gap, in units, at which the heat is a quarter; reach: beyond this none.
const FIRE = { rate: 0.12, grow: 20, near: 10, reach: 40 };
const FIREARMS = { chance: 0.12, blast: 0.3, splash: 40, splashHit: 0.3 }; // fire arrows and burning shot ignite a wooden building on a hit (rain halves it); a petard bombard ignites and shakes the neighbours too
// Sound by distance (Build 62; the ear at the camera's height since Build 64): ISO 9613-2, L = L0 − 20 log10(s / d0) − α s, s the slant
// distance from the camera, full within d0 (the camera's height at the closest zoom), then the inverse-square law, less the air's absorption α: 5 dB a kilometre at 1 kHz, 20 °C, 50% humidity (ISO 9613-1), over a world unit of 0.14 m.
// Thunder reaches the ear after the flash at 340 m/s over the same metre. floor: below this share it is not played.
const SOUND = { fov: 60, alphaKm: 5, metre: 0.14, floor: 0.03, c: 340 }; // fov: the camera's field of view, degrees, which turns the zoom into a height (Albert, Build 64)
// The slow ticks (hunt A #10): each runs every so many seconds (at its own phase in ticks, so they do not land on one step), and its body
// reads the same seconds (every, 08-core): one home for the period. slow: prices, ventures, vassals, the league; health: sickness; natives: regard, the garrison, raids
const BEAT = { slow: [10, 150], health: [5, 75], natives: [5, 7] };
const YARD = 320; // a soldier at home fights within this of its post or its Town Center (the Natives: of the Throne, their camp's radius in 4b)
const GARRISON = { r: 70, heal: 0.6 }; // soldiers resting by their own Castle, Barracks or Town Center heal; Garrison wards double it
const TEACH = { seats: 4, mul: 1.5, tuition: 40 }; // Teach: a soldier learns a newer kind at the School, four at a time; time ×1.5 per age climbed, tuition in gold per age; opened by Veterans
const TEACH_TO = {
	spear: 'sword',
	archer: 'crossbow',
	jav: 'arquebus',
	crossbow: 'arquebus',
	chariot: 'cata',
	catapult: 'treb',
	ballista: 'bombard',
}; // what a soldier can be taught to become: always a later age (D16: horse archer to cataphract and ram to catapult were one age, never usable)
const FALLBACK = { secs: 6, back: 200, hit: 0.7 }; // withdraw in order: fewer losses than a rout
const PRISON = { secs: 180, ransom: 1.0 }; // a prisoner unransomed in three minutes serves the captor
const CONVERT = { r: 40, secs: 12, cd: 60 }; // a priest beside an enemy for a spell turns them; the counter is to kill the priest
const BUILDER_POW = 0.7; // a crew of n builds n^0.7 times as fast as one: two builders ≈ 1.6×, three ≈ 2.1×. Crowding on a site: output per worker falls as n^−0.25 to n^−0.3 (Thomas & Smith, *Loss of Construction Labor Productivity due to Inefficiencies and Disruptions*, 1990; the overmanning curves), so the crew does n^0.7 (Build 62: cited)
// Shape (research Formations at the War Council): each battalion takes one, three in all. spd: march speed; hit: damage taken; dmg: damage dealt by its riders; vsMounted: damage taken from riders
// An army marches in a column (COLUMN, never picked: armies did) and stands to its shape on contact: the Roman three lines, the medieval three battles.
const FORM = [
	{ name: 'Line', shape: 'line', note: 'as they stand' },
	{ name: 'Wedge', shape: 'wedge', dmg: 1.15, hit: 1.1, note: 'riders hit 15% harder, take 10% more' },
	{
		name: 'Square',
		shape: 'square',
		spd: 0.8,
		hit: 0.9,
		vsMounted: 0.7,
		note: '10% less damage, 30% less from riders, 20% slower',
	},
	// three more (Albert, Nov 3, 11:06), each a trade the ground decides: a front line is one rank, every man at the blade, and a charge
	// breaks it (the skirmish line; vsMounted); a choke is deep and narrow, hard to break, only its front fights (the phalanx in the pass at
	// Thermopylae, from memory); support is a ring of foot with the shooters inside, slow, the inside safe (the Roman orbis, the hollow
	// square against riders, from memory)
	{ name: 'Front', shape: 'front', vsMounted: 1.3, note: 'one rank: every man fights, riders break it (30% more from them)' },
	{ name: 'Choke', shape: 'choke', spd: 0.85, hit: 0.85, vsMounted: 0.8, note: 'deep and narrow: 15% less damage, 20% less from riders, 15% slower; only the front fights' },
	{ name: 'Support', shape: 'support', spd: 0.85, hit: 0.95, note: 'foot round the shooters: 5% less damage, 15% slower; the inside is safe' },
];
// the choke drawn on the map (hold the shape on War, then drag across the gap): as many files as the gap holds, GRID.gap apart, facing across
// the drag; the ambush (hold Rally, then tap cover): the soldiers hide within cover of forest and spring on a foe within spring, with a
// charge's burst; hidden, no foe takes them for a mark
const CHOKE = { min: 1, max: 12 };
const AMBUSH = { cover: 1, spring: 45, find: 90 };
const COLUMN = { name: 'Column', shape: 'column', spd: 1.15, hit: 1.1 };
const GRID = { gap: 15, rows: 2.0, fan: 90, share: 40 }; // an army stands in a grid: 15 apart, about twice as wide as deep; on the march it follows one way to the spot and opens into its shape in the last 90 (as real armies marched in column and deployed); a soldier within 40 of where a path began takes that path too
const DOCKR = 150; // fish are caught only within 150 of a finished dock of yours
const KITE = 45; // a shooter steps back from a foe this close while it reloads
// a battalion's temper, three in all (the computers keep Guard). nerve: how fast blows break it; dmg: blows dealt; chase: how far past its sight it follows a foe
const TEMPER = [
	{ name: 'Hold', nerve: 0.8, note: 'fight only what comes within reach, no chase, steadier nerve' },
	{ name: 'Guard', note: 'fight what comes; shooters step back from anyone who closes in' },
	{
		name: 'Press',
		nerve: 1.3,
		dmg: 1.1,
		chase: 1.3,
		note: 'chase and charge: blows 10% harder, nerve breaks 30% faster',
	},
];
const T_HOLD = 0,
	T_GUARD = 1,
	T_PRESS = 2;
const SHELTER = { flee: 70, clear: 150, raid: 3, hurt: 6 }; // villagers run into the nearest Town Center or tower when an enemy soldier comes within 70, when three or more beasts or robbers do, or when a lone beast or robber hits them (it scares only the one it hits); out when none within 150 of it; each adds an arrow up to the limit (the room is the same)
const LOOKOUT = { base: 60, k: 24 }; // a building sees 60 + 24 × the square root of its height: the horizon from a height grows with its square root, so a 44 tower sees 220, a 16 house 156, a field 84 (Build 51: every building but six saw a flat 90, and no research reached them)
// Where a villager looks for the next find (decision 1; area-restricted search, tight near the last find and wider with time since it was lost):
// r(t) = x + y min(1, t/tau), from where it was placed, else from its nearest drop-off; x + y is a placed villager's cap. Nothing found: it keeps
// its job and waits at the drop-off, looking again every 'again' seconds (plus up to one of dice), with no end.
// Personal space, one number (Albert: Hall's personal distance, 2.5 to 4 ft; OSHA 1910.142(b)(3), 36 inches between beds): 3 ft. Spots are laid
// SPACE apart, two bodies nearer than SPACE are pushed apart, a villager at work arrives within SPACE (the push's reach: decision 10a), and
// one at its own spot within ARRIVE, a quarter of it: under half the spacing, so it always stands nearer its own spot than any other's (item 5).
// where a gatherer stands to work a find: within this of its middle (fish from the shore, further out); the ring its working spots sit on
const WORK_R = { fish: 13, other: 9 };
const SPACE = 3 * FOOT,
	ARRIVE = SPACE / 4;
// SEARCH and searchR (where a villager looks for work) are below HOME: the search reaches the home band (REACH).
const DANGER_R = { near: 110, reach: 30, fire: 60, mem: 80, secs: 45, far: 200, keep: 8 }; // a gatherer will not work within 110 of an enemy or a hunting beast, inside an enemy tower's reach plus 30, within 60 of a fire, or for 45 s within 80 of where one of its side was frightened more than 200 from home (the last 8 such places are kept)
// How long a toast stays (Nov 2, M7: 219 calls typed their own seconds, from 2 to 10): three lengths, by how much there is to read.
// At about 200 words a minute (adult silent reading, 238 in Brysbaert's 2019 review, from memory, not opened) a short line of a few words
// needs 2 to 3 s, a sentence 4 to 5, two sentences 7 to 8. 2 and 3 became short; 4, 5 and 6 mid; 7 to 10 long.
// The War Director (Albert, Nov 2: "a war director"): one move a kind, every soldier of that kind at once, from the battle station. Each move
// is a drill the rules already hold, so no new number but these: how long a shield wall stands (secs), how long the volley's reload is lined
// up (loose), and the wait after Wheel (wheel). wall: the Square shape's numbers while it stands (FORM[2]: 10% less damage, 30% less from
// riders, 20% slower) and the Hold temper (no chase, steadier nerve), their target dropped. loose: every archer's reload set to zero together, so they release
// in one instant; each arrow does its usual harm, but Dupuy's break point (MORALE.breakAt) is counted on losses in one blow, which is why
// massed volleys broke armies the same losses spread out would not (Crécy, Agincourt; from memory). charge: CHARGE. wheel: the riders ride
// to the far side of the enemy nearest the crosshair and hit from behind (FLANK, MORALE.rear). bombard: the engines on the nearest enemy
// building to the crosshair, burning once Burning shot is researched (FIREARMS). back: FALLBACK.
const DIRECT = { wall: 12, loose: 6, wheel: 15, behind: 70, arc: 0.8 }; // arc: the archers' arc stands at 80% of the shortest bow's reach (Albert, Nov 3: 'fall back a bit, form an arc'); wall: seconds a shield wall stands; loose: seconds before the archers may volley again (an audit, Nov 2: with none, a tap a frame was a machine gun); wheel: seconds before riders may wheel again; behind: how far past the foe they ride, away from home
const TOAST = { short: 3, mid: 5, long: 8 };
const SCORE = { unit: 5, bld: 5, tech: 5, wealth: 10 }; // score = value held / 5, research / 5, everything gathered / 10

// ───────────────────────── The world's own numbers: weather, soil, sickness, the trade routes, the market ─────────────────────────
const FERT = { loss: 0.1, floor: 0.6, rest: 0.4 }; // soil: 10% a year worked, never below 60%; a season of rest gives back 40%
const HARVEST = [
	{ p: 1 / 20, m: 0.5, text: 'A failed harvest this year: fields give half.' },
	{ p: 1 / 6, m: 0.7, text: 'A poor harvest this year: fields give 30% less.' },
];
// the skies and what each does beyond the ground (the ground, mud, snow, ice and fire come from the climate): bows in rain, fields in drought, mortar in frost, sight in a whiteout.
// vis: the visibility in haze, snow or fog, in game units: nothing sees farther than it, a tower no more than a man (Koschmieder 1924: V = 3.912 / β,
// the distance at which contrast falls to 2%; the game has no metre, so the values are design, the form is his). An eclipse dims the light instead (sight ×).
const WEATHER = {
	clear: { name: 'Clear' },
	rain: { name: 'Rain', rng: 0.85, text: 'Rain: the ground softens and bows reach less.' },
	drought: { name: 'Drought', crop: 0.7, text: 'Drought: fields give 30% less and fire catches at a touch.' },
	frost: { name: 'Frost', stone: 0.5, text: 'Frost: mortar will not set, stone builds at half speed.' },
	snow: { name: 'Snow', vis: 160, text: 'Snow: the ground deepens and sight shortens.' },
	blizzard: {
		name: 'Blizzard',
		spd: 0.6,
		vis: 60,
		gather: 0.5,
		text: 'Blizzard: a whiteout. Marches crawl, sight is gone, gathering halves.',
	}, // Harsh winters only
};
const WX_EVERY = 60;

// ───────────────────────── The Challenge: hazards you switch on. Their points are your level; the level multiplies your score ─────────────────────────
// Random when, never random whether: everything a hazard sends is announced first, and hazards drawn by lot are told in the first line (Build 70). Easy keeps the old polite game whatever is switched on.
const HAZARDS = {
	// six, in two columns (Albert, Build 41)
	hard: {
		pts: 3,
		name: 'Hardest',
		desc: 'The computers strike in winter, send more riders at your villagers and drop-offs, and need shorter odds to come.',
	},
	starve: {
		pts: 2,
		name: 'Famine',
		desc: 'Two days of famine (no food in store or in reach): a villager leaves and a soldier deserts every half minute.',
	},
	winter: {
		pts: 2,
		name: 'Bad weather',
		short: 'Weather', // its one slot on Setup
		desc: 'Winter fields give a quarter and marches crawl; blizzards blind the small map.',
	},
	drought: {
		pts: 2,
		name: 'Drought',
		desc: 'Summers run dry three times as often and springs can too: fields give 30% less and fires spread fast.',
	},
	horde: {
		pts: 3,
		name: 'Outlaws',
		desc: 'Between minute 20 and 40 a horde comes for the weakest side, announced two seasons ahead; outlaws raid twice as often.',
	},
	plague: {
		pts: 2,
		name: 'Plague',
		desc: 'Plague is three times as likely and spreads twice as fast along the roads. Hospitals matter.',
	},
};
const HZK = Object.keys(HAZARDS),
	HZ_ODDS = 0.5, // none picked (Build 70, Albert's A): each hazard is on at even odds, drawn by lot for the game (design: a coin, the plainest random)
	TODAY_HZ = { hard: 1, starve: 1, horde: 1, winter: 1 }; // the challenge today is level 10 on the day's seed
// Hunger (Albert, Nov 1). An empty store is not a famine: people working food eat from it, and the rest work on. A famine is an empty store
// with no bush, field, fish or game in reach: full strength for grace (two days: with water, hunger takes weeks, the rule of threes), then
// work and blows at UPKEEP.hunger; then, under the Famine hazard, one leaves every every seconds
const STARVE = { grace: 2 * DAY_LEN, every: 30 },
	HARD = { bold: -0.1, raid: 2, winterBold: -0.2, waitForWinter: 90 },
	HORDE = { min: 1200, mean: 1800, warn: SEASON_LEN * 2, n: 16, perAge: 6 }; // the horde comes after min seconds, at an exponential wait about mean (nextIn)
// Spectacle: something happens every minute or three, announced WARN seconds ahead; gorgeous first, mostly harmless, always real. Each entry's numbers; the doing is in 37-events.
// How news reaches you (Build 59, Albert: "you can't have alerts if you can't see or hear them"): seen in your sight, heard by your people,
// or told by a messenger who walks or rides the distance. The post research (keep, line Post) decides how far a messenger serves and how fast.
//   level 1 Runners: your near lands, on foot · 2 Royal Road: your far lands, riders · 3 Yam: your allies' lands · 4 Post riders: the whole
//   board, the other courts' news too · 5 News sheets: the digest of the board's doings (the age news)
const TELL = {
	near: 320, // your near lands: within this of one of your buildings
	far: 900, // your far lands
	hear: 380, // the noise of a fight carries this far from any of your people (shouts and clash of arms: a few hundred paces; gunfire farther)
	gun: 2, // gunfire is heard twice as far
	foot: 27, // a runner's speed (the scout on foot)
	ride: 49, // a rider's (the scout on a horse)
	spy: 120, // a spy's report of an army holds this long (design): the odds you are shown use it, else only the soldiers you see
};
const UI_BUDGET = 33; // always-visible buttons on the play screen, at most (Build 59, from the Google audit): a new control must replace one (the gate counts them)
const SAVE = { step: 0.02, stall: 90, spend: 45 }; // a computer saving for an age: progress counts in steps of 2%; 90 s without one and it spends for 45 s (17-ai)
const EV_MEAN = 120, // the mean wait between events (an exponential wait, nextIn); EV_MIN keeps two from stacking
	EV_MIN = 30,
	EV_WARN = 12;
const EVENTS = {
	eclipse: { name: 'Eclipse', secs: 20, dmg: 0.6, spd: 0.7, sight: 0.7, harm: 1 },
	storm: { name: 'Thunderstorm', secs: 40, band: 260 },
	stampede: { name: 'Stampede', secs: 30, n: 10, harm: 1 },
	flood: { name: 'Flood', secs: 90, rise: 40, hit: 0.004, harm: 1 },
	meteor: { name: 'Falling star', secs: 3 },
	wildfire: {
		name: 'Wildfire',
		secs: 60,
		spread: 0.2,
		r: 32,
		burn: 0.12,
		most: 20,
		season: ['Summer', 'Autumn'],
		harm: 12,
	}, // most: trees alight at once; the dry seasons, drought or not
	fog: { name: 'Fog', secs: 60, vis: 70 },
	sinkhole: { name: 'Sinkhole', secs: 2, hit: 0.4 },
	quicksand: { name: 'Quicksand', secs: 120, r: 60, slow: 0.3 },
	heatwave: { name: 'Heat', secs: 60, dmg: 0.85, spd: 0.9, need: 'drought', season: 'Summer' },
	mirage: { name: 'Mirage', secs: 30, n: 12, season: 'Summer' },
	circus: { name: 'Circus', secs: 60, n: 5, r: 150, cheer: 120, mul: 1.1, gift: 1 },
	wagon: { name: 'Wagon train', secs: 90, gift: 1 },
	mercs: { name: 'Mercenaries', secs: 180, gift: 1 },
	dragon: { name: 'Dragon', secs: 25, fantasy: true, harm: 1 },
	troll: { name: 'Troll', secs: 90, fantasy: true },
	aurora: { name: 'Aurora', secs: 45, fantasy: true, night: true },
};
const EVK = Object.keys(EVENTS),
	NEWS_EVERY = 150;
// Where the shared places stand, each from what it belongs to (5a step 1: no map coordinate typed by hand). From the middle: stop, the
// trade stops' two distances along each middle line; lode, the gold and stone by the great lake; scout, the inner corners of a scout's loop.
// From the edge: camp, the robbers' camp at the end of each trade route; scout, its loop's points on the middle lines. From a Town Center,
// toward the middle on both axes: scout, its loop's corner points.
// start: the first villagers stand this far from their Town Center toward the middle.
const PLACES = { stop: [490, 320], lode: 270, camp: 160, scout: { mid: 300, edge: 420, keep: 215 }, start: 15 }; // start: how far past the Town Center's footprint its first people stand, toward the middle (doorOf, 08; it was 40 from the centre, the same point at 45°)
const cross = (d) => [
	[LMID, LMID - d],
	[LMID, LMID + d],
	[LMID - d, LMID],
	[LMID + d, LMID],
]; // the four points d from the middle on the middle lines: north, south, west, east
// two old trade routes, west to east and north to south, each with four stops; they bend around the great lake
const ROUTES_L = [0, 1].map((ax) => [-PLACES.stop[0], -PLACES.stop[1], PLACES.stop[1], PLACES.stop[0]].map((d) => (ax ? [LMID, LMID + d] : [LMID + d, LMID]))), // in the land's frame, for the map-maker
	ROUTES = ROUTES_L.map((r) =>
		r.map(([x, y]) => {
			const w = worldXY(x, y); // the same stops in the world's frame, for the game (preview 51)
			return [w.x, w.y];
		}),
	);
const POST = { all: 2, cut: [0, 0.2, 0.25, 0.3, 0.4], safe: 120, guard: 12, far: 2.5, want: 1.5 }; // each route has four stops. all: gold a second to whoever holds all four of a route; cut: of other sides' sales at a stop, by how many of its route you hold; guard: soldiers per stop or caravan
// Sickness as the SIR model (Kermack & McKendrick 1927; Build 56): among a side's people, those who are well (S), sick (I) and over it (R, well
// again after the course, as the game has no lasting immunity). New cases a tick = β S I / N, the mass-action law; the course lasts sickFor
// (recovery γ = 1/sickFor). R0 = β/γ: 2 here, in the range of influenza (1.5 to 3; measles would be 12 to 18). Clean water, sewers and
// quarantine lower β; medicine raises the cure and lowers the death. A case is seeded now and then (risk) as if from outside; plague on the roads
// multiplies R0 and the death.
const HEALTH = {
	every: 60,
	risk: 0.06, // the chance a minute that a case arrives from outside
	sickFor: 60, // the course of the illness, seconds (γ = 1/60)
	R0: 2, // cases one case makes in a well population
	death: 0.004,
	cure: 0.3,
	plague: 0.15,
	plagueR0: 1.5, // plague: R0 × this, death × 4
	plagueCap: 0.1,
	plagueCart: 0.5, // the share of carts back from abroad in a plague year that bring cases home; the Plague hazard doubles it
};
const MKT_SELL = ['f', 'w', 's', 'i', ...WARES],
	MKT_BUY = ['f', 'w', 's', 'i', 'spice']; // wool goes to a Workshop, not to market; spice is the only good not made here
const MKTK = [...GOODK, 'f', 'w', 's', 'i'];
const RATE_OF = { bush: 0.9, fish: 0.8, tree: 0.75, stone: 0.55, gold: 0.6, iron: 0.5, meat: 1.2 }; // what a villager gathers a second from each kind of find (fields carry their own rate)

// Bigger finds (Albert, Nov 4, C): a patch lasts long enough that villagers are not moved every few minutes, and gold lasts into the late
// game instead of running dry; one multiplier a kind, on every find of that kind (fish keep their own law, layFish). Tuned after play.
const FIND_SIZE = { bush: 3, tree: 2, gold: 2.5, stone: 1.5, iron: 1.5 };
// The land's character: each game rolls one, the same for all four corners (fair), so no two games share a map. amt: what each resource
// is worth there; extra: one more deposit of its specialty, farther out; spread: how far the rings may stretch.
const LAND = {
	fertile: { name: 'Fertile land', amt: { food: 1.4, wood: 1, stone: 0.8, gold: 1, iron: 1 }, extra: 'bush' },
	timber: { name: 'Timberland', amt: { food: 1, wood: 1.35, stone: 1, gold: 0.8, iron: 1 }, extra: null },
	stony: { name: 'Stony hills', amt: { food: 0.85, wood: 1, stone: 1.5, gold: 1, iron: 1.2 }, extra: 'stone' },
	golden: { name: 'Gold country', amt: { food: 1, wood: 0.85, stone: 1, gold: 1.5, iron: 1 }, extra: 'gold' },
};
const LANDK = Object.keys(LAND),
	SPREAD = [0.85, 1.25];
// The map's base rules (Albert, Build 70): a flat page, four corners (CORNER), the same zones and home finds in every corner, the Throne at
// the middle. All else is random from the one randomizer, laid once: no measure, no reshuffle. CLEAR: no water within it of a Town Center.
const CLEAR = 360;
// Between two buildings (decision 2, Albert, Oct 31): LANE squares at least. A gap is passable only if wider than a figure (2r); the slit rule
// shuts a one-square gap because the drawn figure is wider than it (Build 41), so two. Walls, gates and crops may touch.
const LANE = 2;
// The four zones (Albert, Nov 2, 07:07 to 07:14, D-090; the same in every corner), measured on the finds' own nodes (each bush, tree, rock):
//   1 close: behind the Town Center, between it and its corner (BACK below): enough to reach Bronze;
//   2 your zone: the rest of the clearing, to HOME.clear (220, Albert's number): no forest, open ground to build on, and the five home finds
//     (HOME_IDS in 10), each the same walk from the Town Center in every corner (HOME.at), in a random direction (fair, not mirrored: the
//     same deal, a different layout). The nearer the find, the sooner it is needed: food, wood, gold, stone, iron, the order the ages ask for
//     them (AGES), as von Thünen laid the land most worked nearest the town (von Thünen 1826, from memory, not opened);
//   3 the wall band: the computers' wall ring (WALL_R), two squares past the clearing; no finds; the forest starts past the ring (HOME.out);
//   4 further: the rest of the map, every wild find and the forest from HOME.out on.
// HOME.near: the first home find's walk, v70's nearest bush (147, measured Nov 1 on seed 1; v62 to v70 was the map Albert called great),
// rounded to 150; HOME.step spreads the five evenly from there to the clearing, the iron pair's room (10) inside it.
const HOME = { clear: 220, near: 150, rich: 1.18 };
HOME.step = (HOME.clear - 10 - HOME.near) / 4;
HOME.at = (k) => HOME.near + k * HOME.step;
// The computers' wall ring (wallPlan in 17): the clearing, then the margin a ring square can reach (its diagonal, NAVC √2: the ring is
// drawn on the grid), then LANE squares, rounded up to whole squares (260), so no find stands within the gap of any square of the ring.
const WALL_R = Math.ceil((HOME.clear + NAVC * Math.SQRT2 + LANE * NAVC) / NAVC) * NAVC;
// The wall band's far side, by the same rule from the ring (300): the forest and every wild find lie wholly past it, so every ring closes.
HOME.out = Math.ceil((WALL_R + NAVC * Math.SQRT2 + LANE * NAVC) / NAVC) * NAVC;
// Reach (D-088, Albert's sighting of Nov 1: villagers asleep at the mill with full bushes in sight; D-090 moved the finds in): a villager
// looks for work, and is leashed, within the wall ring of its drop-off. Every home find's every node lies inside it (HOME.clear < WALL_R),
// the wild past it is reached from a drop-off built out there. r(t) keeps its form (decision 1): half of REACH at the loss, all from tau on.
const REACH = WALL_R;
const SEARCH = { x: REACH / 2, y: REACH * 1.5, tau: 20, again: 2 }; // B (Nov 4): the look grows from half the ring to twice it over 20 s; the drop-off leash and the forager's rate still decide
const searchR = (u) => SEARCH.x + SEARCH.y * Math.min(1, (G.t - (u.lostT ?? G.t)) / SEARCH.tau);
// Zone 1 (Albert, Nov 1; on, Nov 2: "Close was supposed to have enough to get you to the first age between you and the corner"): a berry
// patch and a small grove that hold Bronze's cost with a margin for the villagers and houses on the way (600 food, 250 wood), worked out from
// the costs, not typed; on every land the same (no land's amt). Each node behind the Town Center (on the corner's side of both its axes),
// from near (the Town Center's half and LANE squares: the find gap from its wall) to the clearing, LANE squares or more from any other
// find's, and edge or more from the map's edge: whole squares enough for half a tap (22 px) at the opening zoom on the tilted axis, so the
// corner's finds can be seen and tapped (tests/map.py's camera check; LANE squares gave 19 px). Laid first: a corner it does not fit fails.
const BACK_MARGIN = { vils: 6, houses: 5 },
	BACK = {
		near: (BLD.keep.fp * NAVC) / 2 + LANE * NAVC,
		bushes: 2, // Albert, Nov 1 14:13: fewer, bigger finds (300 and 125), so a drop-off by them is worth its cost
		trees: 2,
		edge: Math.ceil(22 / (ZOOM_START * TILT) / NAVC) * NAVC,
		food: AGES[1].cost.f + BACK_MARGIN.vils * UNIT.vil.cost.f,
		wood: AGES[1].cost.w + BACK_MARGIN.houses * BLD.house.cost.w,
	};
// Lakes and rivers (Build 70: random; it was one lake and one river of one width a corner). lakes: how many beside the great lake; r: from a
// pond five houses across to a lake short of the great lake's 170, on the power law of lake sizes (lakeSize; Downing et al. 2006: the number
// of lakes larger than an area falls as area^−c, c 1.06). On 60 seeds about nine tenths of the old water and fish (fish 31 to 105, median 58;
// it was 50 to 73, median 64). gap: open ground from the middle lines (roads, trade routes) and between waters; shore: from the great lake.
// A lake drains to its nearer map edge (else the other), as most lakes in a wet climate do, by a river w × its radius wide (Leopold & Maddock
// 1953: width ∝ √flow, the flow taken ∝ the lake's area): pools every step × the width, bending up to bend; fords at about a third and two
// thirds, each at least ford of dry ground; a fish every third pool.
const WATER = {
	lakes: [4, 9],
	// the shore (Albert, Nov 3: "lakes too circular"): a lake's edge is its radius times 1 + Σ a_k cos(kθ + φ_k), k from 2 to harm, the
	// amplitudes a_k = amp · k^(−H) with H = 2 − D for a fractal shore of dimension D (Mandelbrot 1967, Science 156, a coast's D a little
	// over 1; Britain's about 1.25, from memory). The shoreline development DL = P / 2√(πA) (Hutchinson 1957, opened on Wikipedia: 1 for a
	// circle, higher the more bays) is computed for every lake and held in shore[]; the map test keeps it in the range
	amp: 0.3,
	H: 0.75,
	harm: 12,
	shore: [1.15, 1.6],
	r: [50, 160],
	c: 1.06,
	gap: 70,
	clear: 110,
	w: 0.25,
	step: 0.9,
	bend: 45,
	waves: 1.6,
	ford1: [0.28, 0.4],
	ford2: [0.6, 0.72],
	ford: 32,
	fish: 3,
};

// Scenarios (Build 58, item 41): three set starts on the same rules, each a table of what differs, read by applyScenario in 10-world.
// Nothing here is a new rule: an age, a store, relations, hazards, buildings already in the game, and the mode.
// the villagers every side starts with, beside its keep and scout; a scenario's vils come on top (F1: the Open text said five)
const START_VILS = 3;
// the stores every side starts with (Albert, Nov 1 14:18): 200 of food, wood, stone and gold, no iron
const START_RES = { f: 200, w: 200, s: 200, g: 200, i: 0 };
// EXCEPTIONS #16, LIVE TEST IN PROCESS (Albert, Nov 1 14:23): each computer starts with these already built beside its Town Center, the
// player not. The computers play worse than a person, so this is a handicap (Go's handicap stones). Laid by the placing rules (findSpot,
// canPlace: the lanes, the gap from finds) within r of the Town Center. Remove it when the computers reach Classical as fast without it as
// v70 did (8.2 min median, tests/balance.py).
const HANDICAP = { blds: ['mill', 'farm'], r: [60, 170] };
const SCENARIOS = {
	open: {}, // the ordinary start
	siege: {
		// The Siege: a Medieval town behind its walls, a full store, every rival at war with you, the horde a few minutes out
		age: 3,
		res: { f: 1200, w: 900, s: 900, g: 500, i: 150 },
		techs: ['masonry', 'greattower'], // a step brings the steps it waits on
		rel: 'war',
		hz: { hard: 1, starve: 1, horde: 1 },
		hordeAt: 420,
		walls: true,
		blds: [
			['tower', 150],
			['tower', -150],
			['barracks', 110],
			['range', -110],
		],
		vils: 8,
		mode: 't30',
	},
	road: {
		// The Silk Road: every court Classical and at peace, markets up, the board truce already running
		age: 2,
		all: true, // the ages and stores go to every court
		res: { f: 800, w: 600, s: 300, g: 600, i: 50 },
		rel: 'peace',
		truce: true,
		sworn: 600, // no court may declare war for ten minutes: the peace is sworn, as the Olympic truce was
		blds: [['market', 120]],
		vils: 6,
		mode: 't60',
	},
	last: {
		// Last Keep: three courts allied against you from the first minute, nothing else changed
		league: true,
		rel: 'war',
		mode: 'conquest',
	},
};
