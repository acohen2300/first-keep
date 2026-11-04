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
	TURN = Math.SQRT1_2, // the view turned 45° (Albert, Nov 4, 06:58: "take the whole map and rotate it. Like a picture"): world x runs down-right on the screen, world y down-left; the sim's square grid never knows (20-view-base, SX and SY)
	RIM = 640, // the scenery beyond the map's edge, in world units: sea on the near sides, cliffs and sky on the far (fills the phone's corners when the view meets an edge)
	SIDE = 0.4;
// the land's frame and the world's (preview 51): a land point (lx, ly) stands in the world at the centre plus (lx − LMID, ly − LMID) turned −45°,
// so that through the turned view the land's x runs across the screen and its y down it, as the straight view had them
const worldXY = (x, y) => {
	const dx = x - LMID,
		dy = y - LMID;
	return { x: MID + (dx + dy) * TURN, y: MID + (dy - dx) * TURN };
};
const landXY = (x, y) => {
	const dx = x - MID,
		dy = y - MID;
	return { x: LMID + (dx - dy) * TURN, y: LMID + (dx + dy) * TURN };
};
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
// while the Throne, six squares, centres on the world's middle (ending in 0); so each keep stands 1,065 from the middle along one axis and
// 5 to the side along the other, the four turned a quarter about the Throne, all the same distance from it. The land's frame sees them
// about 3.5 off its diagonals, which the map-maker's margins allow.
const KEEP_W = [
	[MID + 5, MID + 1065], // You: the bottom of the screen
	[MID - 1065, MID + 5], // Raiders: the left
	[MID - 5, MID - 1065], // Rivals: the top
	[MID + 1065, MID - 5], // Fortress: the right
];
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
