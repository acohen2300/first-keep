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
// Every soldier has nerve (0..1). Blows drain it by the share of health they take, times hit (a flank blow 1.5 times, a rear blow twice), being outnumbered drains it, losses beside it drain it;
// quiet restores it, as do a wall or tower of its own, its Town Center, a priest, and Engagement at the War Council (a shorter rout). At zero it routs:
// runs for home for a spell, takes more harm, and can be taken prisoner by any foe who lays a hand on it. Most real battles ended in a rout.
const MORALE = {
	hit: 0.8,
	side: 1.5,
	rear: 2,
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
	after: 0.6,
	wild: 0.5, // animals hit soldiers at half strength and do not shake their nerve (Build 44)
	capR: 10,
};
const CHARGE = { secs: 6, spd: 1.5, dmg: 1.3, tired: 10, tiredSpd: 0.8, cd: 30 }; // a burst, then tired
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
	snow: { fall: 0.02, melt: 0.004 }, // depth a second of snowfall adds (a blizzard twice); melt a second per degree above 0
	ice: { freeze: 0.01, thaw: 0.004 }, // a second below 0 on wet ground; thaw a second per degree above
	terrain: { mud: 0.8, snow: 0.6 }, // Pandolf's factors over dirt: swamp +0.8 at full mud, soft snow +0.6 at full depth
	slip: 0.02,
	slipSecs: 1.5, // ice: a chance a second of a slip that holds a man in place
	miss: 0.5,
	missHurt: 0.08, // snow: an engine slides and its shot falls short, hurting its own crew
	wear: 0.15, // frost makes blades brittle and rain rusts them: weapons do 15% less until tempered and oiled
};
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
// Shape (research Formations at the War Council): each battalion takes one, three in all. spd: march speed; hit: damage taken; dmg: damage dealt by its riders; vsMounted: damage taken from riders
// An army marches in a column (COLUMN, never picked: armies did) and stands to its shape on contact: the Roman three lines, the medieval three battles.
const FORM = [
	{ name: 'Line', shape: 'line', note: 'as they stand' },
	{ name: 'Wedge', shape: 'wedge', dmg: 1.15, hit: 1.1, note: 'riders hit 15% harder, take 10% more' },
	{ name: 'Square', shape: 'square', spd: 0.8, hit: 0.9, vsMounted: 0.7, note: '10% less damage, 30% less from riders, 20% slower' },
];
const COLUMN = { name: 'Column', shape: 'column', spd: 1.15, hit: 1.1 };
const GRID = { gap: 15, rows: 2.0, fan: 90, share: 40 }; // an army stands in a grid: 15 apart, about twice as wide as deep; on the march it follows one way to the spot and opens into its shape in the last 90 (as real armies marched in column and deployed); a soldier within 40 of where a path began takes that path too
const FIELD_NEAR = 160; // a Food worker takes a free field within this before anything else
const DOCKR = 150; // fish are caught only within 150 of a finished dock of yours
const KITE = 45; // a shooter steps back from a foe this close while it reloads
// a battalion's temper, three in all (the computers keep Guard). nerve: how fast blows break it; dmg: blows dealt; chase: how far past its sight it follows a foe
const TEMPER = [
	{ name: 'Hold', nerve: 0.8, note: 'fight only what comes within reach, no chase, steadier nerve' },
	{ name: 'Guard', note: 'fight what comes; shooters step back from anyone who closes in' },
	{ name: 'Press', nerve: 1.3, dmg: 1.1, chase: 1.3, note: 'chase and charge: blows 10% harder, nerve breaks 30% faster' },
];
const T_HOLD = 0,
	T_GUARD = 1,
	T_PRESS = 2;
const SHELTER = { flee: 70, clear: 150, raid: 3, hurt: 6 }; // villagers run into the nearest Town Center or tower when an enemy soldier comes within 70, when three or more beasts or robbers do, or when a lone beast or robber hits them (it scares only the one it hits); out when none within 150 of it; each adds an arrow up to the limit (the room is the same)
const LOOKOUT = { base: 60, k: 24 }; // a building sees 60 + 24 × the square root of its height: the horizon from a height grows with its square root, so a 44 tower sees 220, a 16 house 156, a field 84 (Build 51: every building but six saw a flat 90, and no research reached them)
const DANGER_R = { near: 110, reach: 30, fire: 60, mem: 80, secs: 45, far: 200, keep: 8 }; // a gatherer will not work within 110 of an enemy or a hunting beast, inside an enemy tower's reach plus 30, within 60 of a fire, or for 45 s within 80 of where one of its side was frightened more than 200 from home (the last 8 such places are kept)
const SCORE = { unit: 5, bld: 5, tech: 5, wealth: 10 }; // score = value held / 5, research / 5, everything gathered / 10

// ───────────────────────── The world's own numbers: weather, soil, sickness, the trade routes, the market ─────────────────────────
const FERT = { loss: 0.1, floor: 0.6, rest: 0.4 }; // soil: 10% a year worked, never below 60%; a season of rest gives back 40%
const HARVEST = [
	{ p: 1 / 20, m: 0.5, text: 'A failed harvest this year: fields give half.' },
	{ p: 1 / 6, m: 0.7, text: 'A poor harvest this year: fields give 30% less.' },
];
// the skies and what each does beyond the ground (the ground, mud, snow, ice and fire come from the climate): bows in rain, fields in drought, mortar in frost, sight in a whiteout
const WEATHER = {
	clear: { name: 'Clear' },
	rain: { name: 'Rain', rng: 0.85, text: 'Rain: the ground softens and bows reach less.' },
	drought: { name: 'Drought', crop: 0.7, text: 'Drought: fields give 30% less and fire catches at a touch.' },
	frost: { name: 'Frost', stone: 0.5, text: 'Frost: mortar will not set, stone builds at half speed.' },
	snow: { name: 'Snow', sight: 0.7, text: 'Snow: the ground deepens and sight shortens.' },
	blizzard: {
		name: 'Blizzard',
		spd: 0.6,
		sight: 0.35,
		gather: 0.5,
		text: 'Blizzard: a whiteout. Marches crawl, sight is gone, gathering halves.',
	}, // Harsh winters only
};
const WX_EVERY = 60;

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
	HZ_DEFAULT = { hard: 1, starve: 1 },
	TODAY_HZ = { hard: 1, starve: 1, horde: 1, winter: 1 }; // a new game starts at level 5; The challenge today is level 10 on the day's seed
const STARVE = { stop: 60, leave: 120, every: 30 },
	HARD = { bold: -0.1, raid: 2, winterBold: -0.2, waitForWinter: 90 },
	HORDE = { from: 1200, to: 2400, warn: SEASON_LEN * 2, n: 16, perAge: 6 };
// Spectacle: something happens every minute or three, announced WARN seconds ahead; gorgeous first, mostly harmless, always real. Each entry's numbers; the doing is in 37-events.
const EV_GAP = [60, 180],
	EV_WARN = 12;
const EVENTS = {
	eclipse: { name: 'Eclipse', secs: 20, dmg: 0.6, spd: 0.7, sight: 0.7, harm: 1 },
	storm: { name: 'Thunderstorm', secs: 40, band: 260 },
	stampede: { name: 'Stampede', secs: 30, n: 10, harm: 1 },
	flood: { name: 'Flood', secs: 90, rise: 40, hit: 0.004, harm: 1 },
	meteor: { name: 'Falling star', secs: 3 },
	wildfire: { name: 'Wildfire', secs: 60, spread: 0.2, r: 32, burn: 0.12, most: 20, season: ['Summer', 'Autumn'], harm: 1 }, // most: trees alight at once; the dry seasons, drought or not
	fog: { name: 'Fog', secs: 60, sight: 0.4 },
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
};
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
// Fair, not copied (Build 49): every corner gets the same finds at the same distances from home, each at its own angle, with its own lake and its own forest.
// Then the map is measured: from each Town Center, the walk to its nearest food, wood, stone, gold and iron, to the Throne's island and to its nearest neighbour.
// If the sides differ by more than a tenth in any of the three, the map is laid out again (up to 20 times) and the fairest is kept.
const FAIR = { tries: 20, spread: 0.1 };
const RIVER = { w: [20, 26], step: 0.9, bend: 45, waves: 1.6, ford1: [0.28, 0.4], ford2: [0.6, 0.72], fish: 3 }; // a corner's river: pools 20 to 26 across in radius, one every 0.9 of that (smooth banks), bending up to 45 aside; fords at about a third and two thirds; a fish in every third pool
