// ═════ 06-rules-tuning.js: combat, morale, weather, hazards, events, routes, market and land numbers ═════
const TRADE = { f: 80, w: 80, s: 110, i: 120 },
	TRADE_CAP = 80,
	TRADE_DIV = 16000,
	SELL = 0.8,
	BUY = 1.25; // TRADE_CAP, TRADE_DIV: an ally run pays distance² ÷ 16000, at most 80 gold
const ZEAL = { cost: { g: 60 }, secs: 45, cd: 120, mul: 1.2 };
const SAB = { burn: 0.6, stall: 40 };
const FLANK = 1.3; // a blow from behind lands 30% harder
// ───────────────────────── Combat you steer: nerve, flanks, charge and fall back, prisoners, conversion ─────────────────────────
// Every soldier has nerve (0..1). Blows drain it by the share of health they take, times hit (a flank blow twice, a rear blow three times), being outnumbered drains it, losses beside it drain it;
// quiet restores it, as do a wall or tower of its own, its Town Center, a priest, and Engagement at the War Council (a shorter rout). At zero it routs:
// runs for home for a spell, takes more harm, and can be taken prisoner by any foe who lays a hand on it. Most real battles ended in a rout.
const MORALE = {
	hit: 1.2,
	side: 2,
	rear: 3,
	kill: 0.04,
	loss: 0.03,
	odds: 0.02,
	rest: 0.03,
	shelter: 0.02,
	priest: 0.03,
	priestR: 120,
	rout: 8,
	routHit: 1.5,
	routSpd: 1.3,
	after: 0.35,
	capR: 10,
};
const CHARGE = { secs: 6, spd: 1.5, dmg: 1.3, tired: 10, tiredSpd: 0.8, cd: 30 }; // a burst, then tired
// The ground remembers the weather: rain leaves mud for days, frost leaves ice, a blizzard leaves snow. Each is 0..1 and shows on the map.
// Research at the Library (Weather line), Stable (horseshoes), Barracks (cloaks) and Smithy (tempering, oiling) takes the edge off, never all of it at once.
const GROUND = {
	rain: 0.004,
	storm: 0.01,
	dry: 0.0008,
	mudSlow: 0.35, // mud: a second of rain adds, a dry second takes; at full mud marching is a third slower
	frost: 0.006,
	thaw: 0.003,
	slip: 0.02,
	slipSecs: 1.5, // ice: a chance a second of a slip that holds a man in place
	blizzard: 0.012,
	melt: 0.0015,
	snowSlow: 0.3,
	miss: 0.5,
	missHurt: 0.08, // snow: marching slower; an engine slides and its shot falls short, hurting its own crew
	wear: 0.15,
}; // frost makes blades brittle and rain rusts them: weapons do 15% less until tempered and oiled
const FIREARMS = { chance: 0.12, blast: 0.3, splash: 40, splashHit: 0.3 }; // fire arrows and burning shot ignite a wooden building on a hit (rain halves it); a petard bombard ignites and shakes the neighbours too
const GARRISON = { r: 70, heal: 0.6 }; // soldiers resting by their own Castle, Barracks or Town Center heal; Garrison wards double it
const TEACH = { seats: 4, mul: 1.5, tuition: 40 }; // Teach: a soldier learns a newer kind at the School, four at a time; time ×1.5 per age climbed, tuition in gold per age; opened by Veterans
const TEACH_TO = {
	spear: 'sword',
	archer: 'crossbow',
	jav: 'arquebus',
	crossbow: 'arquebus',
	chariot: 'cata',
	harcher: 'cata',
	ram: 'catapult',
	catapult: 'treb',
	ballista: 'bombard',
}; // what a soldier can be taught to become
const FALLBACK = { secs: 6, back: 200, hit: 0.7 }; // withdraw in order: fewer losses than a rout
const PRISON = { secs: 180, ransom: 1.0 }; // a prisoner unransomed in three minutes serves the captor
const CONVERT = { r: 40, secs: 12, cd: 60 }; // a priest beside an enemy for a spell turns them; the counter is to kill the priest
const BUILDER_POW = 0.7; // a crew of n builds n^0.7 times as fast as one: two builders ≈ 1.6×, three ≈ 2.1×
// Formations (research Formations at the War Council): each battalion takes one. spd: march speed; hit: damage taken; dmg: damage dealt by its riders; vsMounted: damage taken from riders
const FORM = [
	{ name: 'Line', shape: 'line', note: 'as they stand' },
	{ name: 'Column', shape: 'column', spd: 1.15, hit: 1.1, note: '15% faster, 10% more damage taken' },
	{ name: 'Wedge', shape: 'wedge', dmg: 1.15, hit: 1.1, note: 'riders hit 15% harder, take 10% more' },
	{ name: 'Square', shape: 'square', spd: 0.8, vsMounted: 0.7, note: '30% less from riders, 20% slower' },
];
const GRID = { gap: 15, rows: 2.0 }; // an army stands in a grid: 15 apart, about twice as wide as deep
const FIELD_NEAR = 160; // a Food worker takes a free field within this before anything else
const DOCKR = 150; // fish are caught only within 150 of a finished dock of yours
const KITE = 45; // a shooter steps back from a foe this close while it reloads
// a battalion's stance (the computers choose theirs: shooters skirmish, foot at home hold a wall)
const STANCE = [
	{ name: 'Line', note: 'fight as they stand' },
	{ name: 'Shield wall', hit: 0.8, spd: 0.65, note: 'foot soldiers take a fifth less damage and march a third slower' },
	{ name: 'Skirmish', note: 'shooters step back from anyone who closes in while they reload' },
];
const SHELTER = { flee: 70, clear: 150, raid: 3, hurt: 6 }; // villagers run into the nearest Town Center or tower when an enemy soldier comes within 70, when three or more beasts or robbers do, or when a lone beast or robber hits them (it scares only the one it hits); out when none within 150 of it; each adds an arrow up to the limit (the room is the same)
const SCORE = { unit: 5, bld: 5, tech: 5, wealth: 10 }; // score = value held / 5, research / 5, everything gathered / 10

// ───────────────────────── The world's own numbers: weather, soil, sickness, the trade routes, the market ─────────────────────────
const FERT = { loss: 0.1, floor: 0.6, rest: 0.4 }; // soil: 10% a year worked, never below 60%; a season of rest gives back 40%
const HARVEST = [
	{ p: 1 / 20, m: 0.5, text: 'A failed harvest this year: fields give half.' },
	{ p: 1 / 6, m: 0.7, text: 'A poor harvest this year: fields give 30% less.' },
];
const WEATHER = {
	clear: { name: 'Clear' },
	rain: { name: 'Rain', spd: 0.8, rng: 0.85, fire: 0.5, text: 'Rain: marching is slower and bows reach less.' },
	drought: { name: 'Drought', crop: 0.7, fire: 2, text: 'Drought: fields give 30% less and fires spread fast.' },
	frost: { name: 'Frost', stone: 0.5, text: 'Frost: mortar will not set, stone builds at half speed.' },
	blizzard: {
		name: 'Blizzard',
		spd: 0.6,
		sight: 0.35,
		gather: 0.5,
		fire: 0.3,
		text: 'Blizzard: a whiteout. Marches crawl, sight is gone, gathering halves.',
	}, // Harsh winters only
};
const WX_ODDS = {
		Spring: { rain: 0.45 },
		Summer: { drought: 0.3, rain: 0.15 },
		Autumn: { rain: 0.45 },
		Winter: { frost: 0.6 },
	},
	WX_EVERY = 60;
const MOON = 8; // days from new moon to new moon (the real month is 29.5; the game's day is two minutes): at new moon the night is darker and sight shorter

// ───────────────────────── The Challenge: hazards you switch on. Their points are your level; the level multiplies your score ─────────────────────────
// Random when, never random whether: everything a hazard sends is announced first. Easy keeps the old polite game whatever is switched on.
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
		desc: 'No food for a minute: work stops. After two, a villager leaves and a soldier deserts every half minute.',
	},
	winter: {
		pts: 2,
		name: 'Bad weather',
		desc: 'Winter fields give a quarter and marches crawl; blizzards blind the small map; tremors come every few minutes and hit hard.',
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
	HZ_DEFAULT = { hard: 1, starve: 1 },
	TODAY_HZ = { hard: 1, starve: 1, horde: 1, winter: 1 }; // a new game starts at level 5; The challenge today is level 10 on the day's seed
const STARVE = { stop: 60, leave: 120, every: 30 },
	HARD = { bold: -0.1, raid: 2, winterBold: -0.2, waitForWinter: 90 },
	HORDE = { from: 1200, to: 2400, warn: SEASON_LEN * 2, n: 16, perAge: 6 },
	QUAKE = { every: 240, r: 350, hit: 0.1, wall: 0.3, fire: 0.15 };
// Spectacle: something happens every minute or three, announced WARN seconds ahead; gorgeous first, mostly harmless, always real. Each entry's numbers; the doing is in 37-events.
const EV_GAP = [60, 180],
	EV_WARN = 12;
const EVENTS = {
	eclipse: { name: 'Eclipse', secs: 20, dmg: 0.6, spd: 0.7, sight: 0.7, harm: 1 },
	storm: { name: 'Thunderstorm', secs: 40, band: 260 },
	stampede: { name: 'Stampede', secs: 30, n: 10, harm: 1 },
	flood: { name: 'Flood', secs: 90, rise: 40, hit: 0.02, harm: 1 },
	locusts: { name: 'Locusts', secs: 30, r: 70, strip: 90, harm: 1 },
	meteor: { name: 'Falling star', secs: 3 },
	wildfire: { name: 'Wildfire', secs: 60, spread: 0.2, r: 32, burn: 0.12, most: 20, need: 'drought', harm: 1 }, // most: trees alight at once
	fog: { name: 'Fog', secs: 60, sight: 0.4 },
	tremor: { name: 'Tremor', secs: 2, r: 220, hit: 0.05, wall: 0.2, fire: 0.05 },
	sinkhole: { name: 'Sinkhole', secs: 2, hit: 0.4 },
	quicksand: { name: 'Quicksand', secs: 120, r: 60, slow: 0.3 },
	heatwave: { name: 'Heat', secs: 60, dmg: 0.85, spd: 0.9, need: 'drought', season: 'Summer' },
	mirage: { name: 'Mirage', secs: 30, n: 12, season: 'Summer' },
	circus: { name: 'Travelling show', secs: 60, n: 5, r: 150, cheer: 120, mul: 1.1, gift: 1 },
	wagon: { name: 'Wagon train', secs: 90, gift: 1 },
	mercs: { name: 'Mercenaries', secs: 180, gift: 1 },
	dragon: { name: 'Dragon', secs: 25, fantasy: true, harm: 1 },
	troll: { name: 'Troll', secs: 90, fantasy: true },
	aurora: { name: 'Northern lights', secs: 45, fantasy: true, night: true },
};
const EVK = Object.keys(EVENTS),
	NEWS_EVERY = 150;
// two old trade routes, west to east and north to south, each with four stops; they bend around the great lake
const ROUTES = [
	[
		[510, 1000],
		[680, 1000],
		[1320, 1000],
		[1490, 1000],
	],
	[
		[1000, 510],
		[1000, 680],
		[1000, 1320],
		[1000, 1490],
	],
];
const POST = { all: 2, cut: [0, 0.2, 0.25, 0.3, 0.4], safe: 120, guard: 12, far: 2.5, want: 1.5 }; // each route has four stops. all: gold a second to whoever holds all four of a route; cut: of other sides' sales at a stop, by how many of its route you hold; guard: soldiers per stop or caravan
const HEALTH = {
	every: 60,
	risk: 0.06,
	sickFor: 60,
	spread: 0.08,
	death: 0.004,
	cure: 0.3,
	plague: 0.15,
	plagueCap: 0.1,
}; // risk: the chance a minute that sickness breaks out
const MKT_SELL = ['f', 'w', 's', 'i', ...WARES],
	MKT_BUY = ['f', 'w', 's', 'i', 'spice']; // wool goes to a Workshop, not to market; spice is the only good not made here
const MKTK = [...GOODK, 'f', 'w', 's', 'i'];
const RATE_OF = { bush: 0.9, fish: 0.8, tree: 0.75, stone: 0.55, gold: 0.6, iron: 0.5, meat: 1.2 }; // what a villager gathers a second from each kind of find (fields carry their own rate)

// The land's character: each game rolls one, the same for all four corners (fair), so no two games share a map. amt: what each resource
// is worth there; extra: one more deposit of its specialty, farther out; spread: how far the rings may stretch; turn: how far the home pocket may swing.
const LAND = {
	fertile: { name: 'Fertile land', amt: { food: 1.4, wood: 1, stone: 0.8, gold: 1, iron: 1 }, extra: 'bush' },
	timber: { name: 'Timberland', amt: { food: 1, wood: 1.35, stone: 1, gold: 0.8, iron: 1 }, extra: null },
	stony: { name: 'Stony hills', amt: { food: 0.85, wood: 1, stone: 1.5, gold: 1, iron: 1.2 }, extra: 'stone' },
	golden: { name: 'Gold country', amt: { food: 1, wood: 0.85, stone: 1, gold: 1.5, iron: 1 }, extra: 'gold' },
};
const LANDK = Object.keys(LAND),
	SPREAD = [0.85, 1.25],
	TURN = 0.5;
