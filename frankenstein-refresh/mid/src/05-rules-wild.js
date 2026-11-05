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
