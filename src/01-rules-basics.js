// ═════ 01-rules-basics.js: the map, speeds, difficulty, resources, jobs, players, ages, seasons ═════
// ───────────────────────── The rules: every number lives in a table ─────────────────────────
const BUILD = 41;
const MAP = 2000,
	MID = MAP / 2,
	DT = 1 / 30;
const BN = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'],
	BNS = BN.length; // the battalions, once Command is researched
const POPMAX = 180,
	VILMAX = 60,
	ARMYMAX = 120,
	BNSIZE = 40,
	SHARE_FALLEN = 0.5; // a fallen side's room: half of it is split among whoever is left   // six battalions, once Command is researched at a War Council; BNSIZE: the most one Zeal blesses
const RICH = 2.5,
	PLUNDER = 0.25,
	CARRY = 10,
	NAVC = 10; // NAVC: the walking grid, 10 units a square (never shown)
const LAKE0 = { x: MID, y: MID, r: 170 }; // the great lake in the middle; each corner also gets a lake of its own (G.lakes)
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
	TILT = 0.66,
	SIDE = 0.4; // SIDE: how far right the back of a building sits, per unit of depth, so its east wall shows
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

// Relations: ally | peace (neutral) | war (hostile). Peace holds until a side gives NOTICE; alliance needs the other side's yes.
const REL_WORD = { ally: 'Ally', peace: 'Neutral', war: 'Hostile' };
const PLAYERS = [
	{ name: 'You', pers: 'human', color: '#4f93e6', keep: [300, 1700] },
	{ name: 'Raiders', pers: 'aggr', color: '#de5a44', keep: [300, 300] },
	{ name: 'Rivals', pers: 'bal', color: '#b07ae6', keep: [1700, 300] },
	{ name: 'Fortress', pers: 'fort', color: '#5fb08a', keep: [1700, 1700] },
	{ name: 'Natives', pers: 'wild', color: '#9b8b72', keep: [MID, MID] },
];
const FORT = 3; // a player like the others since Build 40: it defends first, and strikes whoever is weak or busy

const AGES = [
	{ name: 'Stone' },
	{ name: 'Bronze', cost: { f: 300, w: 100 }, t: 40 },
	{ name: 'Classical', cost: { f: 600, g: 200 }, t: 60 },
	{ name: 'Medieval', cost: { f: 1000, g: 500, s: 200 }, t: 80 },
	{ name: 'Gunpowder', cost: { f: 1600, g: 900, s: 300, i: 400 }, t: 100 },
];
const SEASONS = [
	// one year is 12 minutes; real effects, simplified
	{ name: 'Spring', spd: 0.85, farm: 1.0, tint: null },
	{ name: 'Summer', spd: 1.0, farm: 1.1, tint: null },
	{ name: 'Autumn', spd: 1.0, farm: 1.25, tint: 'rgba(190,120,40,.12)' },
	{ name: 'Winter', spd: 0.8, farm: 0.4, tint: 'rgba(225,232,240,.30)' },
];
