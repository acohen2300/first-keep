// ═════ 01-rules.js ═════
// ───────────────────────── The rules: every number lives in a table ─────────────────────────
const BUILD = 30;
const MAP = 2000, MID = MAP / 2, DT = 1 / 30;
const POPMAX = 150, VILMAX = 60, ARMYMAX = 90, BNSIZE = 30, BNS = 6;   // six battalions, once Command is researched at a War Council; BNSIZE: the most one Zeal blesses
const RICH = 2.5, PLUNDER = 0.25, CARRY = 10, NAVC = 10;                // NAVC: the walking grid, 10 units a square (never shown)
const LAKE0 = { x: MID, y: MID, r: 170 };                              // the great lake in the middle; each corner also gets a lake of its own (G.lakes)
const SEASON_LEN = 180, DAY_LEN = 120, NIGHT_SIGHT = 0.6;
const ZOOM_MAX = 4, ZOOM_STEP = 1.3, TILT = 0.66, SIDE = 0.4;   // SIDE: how far right the back of a building sits, per unit of depth, so its east wall shows
const WILD = 4;                                                          // the fifth side: animals, bandits, robbers, monsters

// One table for the four resources: short key, colour, name, where it is dropped off.
const RESOURCES = {
  food:  { k: 'f', name: 'Food',  col: '#e0708a', drop: 'Mill' },
  wood:  { k: 'w', name: 'Wood',  col: '#c08a58', drop: 'Lumber camp' },
  stone: { k: 's', name: 'Stone', col: '#b4bbc0', drop: 'Mine' },
  gold:  { k: 'g', name: 'Gold',  col: '#f2cf55', drop: 'Mine' },
  iron:  { k: 'i', name: 'Iron',  col: '#8fa3b5', drop: 'Mine' },   // the metal of the Iron age: weapons and armour from the Classical age on
};
const RES = Object.keys(RESOURCES), KEY = Object.fromEntries(RES.map(r => [r, RESOURCES[r].k])), LONG = Object.fromEntries(RES.map(r => [RESOURCES[r].k, r]));
const JOBS = ['food', 'farm', 'wood', 'stone', 'gold', 'iron'];

const PLAYERS = [
  { name: 'You',      pers: 'human', color: '#4f93e6', keep: [300, 1700] },
  { name: 'Raiders',  pers: 'aggr',  color: '#de5a44', keep: [300, 300] },
  { name: 'Rivals',   pers: 'bal',   color: '#b07ae6', keep: [1700, 300] },
  { name: 'Fortress', pers: 'fort',  color: '#5fb08a', keep: [1700, 1700] },
  { name: 'The wild', pers: 'wild',  color: '#9b8b72', keep: [MID, MID] },
];
const FORT = 3;   // the neutral side that can be won as an ally

const AGES = [
  { name: 'Settlement' },
  { name: 'Bronze',    cost: { f: 300, w: 100 },         t: 40 },
  { name: 'Classical', cost: { f: 600, g: 200 },         t: 60 },
  { name: 'Medieval',  cost: { f: 1000, g: 500, s: 200 }, t: 80 },
  { name: 'Gunpowder', cost: { f: 1600, g: 900, s: 300, i: 400 }, t: 100 },
];
const SEASONS = [   // one year is 12 minutes; real effects, simplified
  { name: 'Spring', spd: 0.85, farm: 1.0,  note: 'mud slows marching',                 tint: null },
  { name: 'Summer', spd: 1.0,  farm: 1.1,  note: 'good marching weather',              tint: null },
  { name: 'Autumn', spd: 1.0,  farm: 1.25, note: 'harvest',                            tint: 'rgba(190,120,40,.12)' },
  { name: 'Winter', spd: 0.8,  farm: 0.4,  note: 'cold slows armies; farms barely grow', tint: 'rgba(225,232,240,.30)' },
];

// Units. cls: which limit it counts toward (civ = the 60 villagers and workers, army = the 90). tick: which routine runs it.
// tags say what it is; vs says what it beats (×, by tag or kind; the best match counts). bld: × against buildings.
// rarmor: × it takes from arrows and bolts. tiers come from research (TECH.tier).
const UNIT = {
  vil:      { name: 'Villager',  cls: 'civ', tick: 'vil', tags: ['civ'], hp: 25, spd: 24, sight: 90, dmg: 3, rng: 30, cd: 1.5, cost: { f: 50 }, t: 8, at: 'keep', also: ['town'], age: 0, look: 'vil', desc: 'Gathers food, wood, stone and gold and carries it to the nearest drop-off. Hunts deer and boar with a javelin.' },
  scout:    { name: 'Scout',     cls: 'civ', tick: 'scout', tags: ['civ', 'mounted'], hp: 45, spd: 36, sight: 220, dmg: 3, rng: 12, cd: 1.5, cost: { f: 80 }, t: 12, at: 'keep', age: 0, look: 'scout', desc: 'A fast rider. Tours the map and picks up any treasure nobody guards. Tap the map to send it.' },
  envoy:    { name: 'Emissary',  cls: null,  tick: 'envoy', tags: ['civ'], hp: 20, spd: 36, sight: 100, cost: { g: 40 }, t: 0, age: 1, look: 'envoy', desc: 'Carries your offer to the Fortress. Killing one is an act of war.' },
  caravan:  { name: 'Caravan',   cls: 'civ', tick: 'caravan', tags: ['civ'], hp: 40, spd: 16, sight: 100, cost: { w: 80, f: 40 }, t: 14, at: 'market', age: 1, look: 'caravan', desc: 'An ox cart: about two thirds of walking pace. With no route it runs between your Markets for gold, the farther the more. Give it a route on its card and it carries goods from your Business Center to a Market or a trade stop. Robbers come for it near their camps.' },
  spy:      { name: 'Spy',       cls: 'army', tick: 'spy', tags: ['civ'], hp: 20, spd: 24, sight: 120, cost: { f: 30, g: 60 }, t: 12, at: 'courthouse', age: 1, stealth: [45, 140], look: 'spy', desc: 'Hidden: soldiers see it only within 45, towers, the Town Center and Courthouses within 140. Near an enemy building it reads their stores, age, research and army. Sent to sabotage, it is used up.' },
  priest:   { name: 'Priest',    cls: 'army', tick: 'priest', tags: ['civ'], hp: 30, spd: 24, sight: 120, cost: { f: 40, g: 60 }, t: 14, at: 'temple', age: 1, look: 'priest', desc: 'Does not fight. Walks with the army so you can call Zeal, and takes holy sites: stand it at a shrine for 10 s and the shrine pays you gold.' },
  medic:    { name: 'Medic',     cls: 'army', tick: 'medic', tags: ['civ'], hp: 30, spd: 24, sight: 120, heal: 3, hrng: 55, cost: { f: 40, g: 40 }, t: 12, at: 'hospital', age: 2, look: 'medic', desc: 'Walks with the army and binds wounds: soldiers within 55 heal 3 health a second. Town Center it behind the line.' },
  spear:    { name: 'Spearman',  cls: 'army', tick: 'sol', tags: ['infantry', 'spear'], hp: 60, spd: 24, sight: 130, dmg: 6, rng: 12, cd: 1.2, cost: { f: 50, w: 25 }, t: 10, at: 'barracks', age: 0, vs: { mounted: 3 }, look: 'spear', desc: 'Front line. Cheap and tough. Strong against anything on horseback.' },
  sword:    { name: 'Swordsman', cls: 'army', tick: 'sol', tags: ['infantry'], hp: 70, spd: 24, sight: 130, dmg: 8, rng: 12, cd: 1.2, cost: { f: 60, g: 25 }, t: 12, at: 'barracks', age: 1, vs: { infantry: 1.5, siege: 2 }, bld: 1.5, look: 'sword', desc: 'Heavy infantry. Beats other foot soldiers and breaks buildings faster than most.' },
  archer:   { name: 'Archer',    cls: 'army', tick: 'sol', tags: ['infantry', 'archer', 'ranged'], hp: 30, spd: 24, sight: 150, dmg: 5, rng: 95, cd: 1.6, cost: { f: 30, w: 45 }, t: 10, at: 'range', age: 1, vs: { spear: 2, infantry: 1.3 }, bld: 0.4, look: 'archer', desc: 'Back line. Shoots from range; strong against foot soldiers, weak to riders and javelins.' },
  jav:      { name: 'Javelineer',cls: 'army', tick: 'sol', tags: ['infantry', 'ranged'], hp: 40, spd: 24, sight: 140, dmg: 4, rng: 55, cd: 1.3, cost: { f: 40, w: 25 }, t: 9, at: 'range', age: 1, vs: { archer: 3 }, bld: 0.3, look: 'jav', desc: 'Light, quick, cheap. Throws javelins: the answer to archers.' },
  crossbow: { name: 'Crossbowman', cls: 'army', tick: 'sol', tags: ['infantry', 'archer', 'ranged'], hp: 35, spd: 24, sight: 150, dmg: 9, rng: 100, cd: 2.3, cost: { f: 40, w: 40, g: 40 }, t: 12, at: 'range', age: 3, vs: { heavy: 2.2, infantry: 1.5 }, bld: 0.4, look: 'crossbow', desc: 'Slow to reload, hits hard. Bolts pierce armour: strong against knights and heavy foot.' },
  chariot:  { name: 'Chariot',   cls: 'army', tick: 'sol', tags: ['mounted', 'light'], hp: 70, spd: 36, sight: 140, dmg: 6, rng: 12, cd: 1.1, cost: { f: 60, w: 60 }, t: 12, at: 'stable', age: 1, vs: { archer: 2.5, siege: 2 }, look: 'chariot', desc: 'Fast. Runs archers and siege down. Weak against spears.' },
  cata:     { name: 'Cataphract',cls: 'army', knock: 4, tick: 'sol', tags: ['mounted', 'heavy'], hp: 120, spd: 36, sight: 140, dmg: 10, rng: 12, cd: 1.3, cost: { f: 90, g: 45, i: 45 }, t: 16, at: 'stable', age: 2, vs: { archer: 2, infantry: 1.3, siege: 2 }, look: 'cata', desc: 'Horse and rider in armour. Breaks lines and archers; spears and crossbows stop it.' },
  harcher:  { name: 'Horse archer', cls: 'army', kite: 1, tick: 'sol', tags: ['mounted', 'archer', 'ranged'], hp: 55, spd: 36, sight: 150, dmg: 5, rng: 80, cd: 1.6, cost: { f: 60, w: 40, g: 40 }, t: 14, at: 'stable', age: 2, vs: { spear: 2, infantry: 1.5 }, bld: 0.3, look: 'harcher', desc: 'Shoots from the saddle and rides away. Strong against slow foot; javelins and riders catch it.' },
  elephant: { name: 'War elephant', cls: 'army', knock: 5, tick: 'sol', tags: ['mounted', 'heavy', 'elephant'], hp: 260, spd: 22, sight: 140, dmg: 15, rng: 14, cd: 2, cost: { f: 150, g: 120 }, t: 28, at: 'stable', age: 2, vs: { infantry: 1.5, mounted: 1.3 }, bld: 2, look: 'elephant', desc: 'Huge, slow and frightening. Tramples foot and horse and breaks gates. Spears and javelins bring it down.' },
  ram:      { name: 'Ram',       cls: 'army', tick: 'sol', tags: ['siege'], hp: 200, spd: 12, sight: 80, dmg: 25, rng: 10, cd: 2, cost: { w: 150, g: 50 }, t: 20, at: 'siege', age: 2, bonly: true, rarmor: 0.4, look: 'ram', desc: 'Breaks buildings, walls and gates. Roofed: arrows glance off. It ignores soldiers, so keep it covered.' },
  stower:   { name: 'Siege tower', cls: 'army', tick: 'sol', tags: ['siege'], hp: 260, spd: 12, sight: 150, dmg: 6, rng: 110, cd: 1.0, cost: { w: 200, g: 60 }, t: 24, at: 'siege', age: 2, rarmor: 0.5, bld: 0.6, look: 'stower', desc: 'A rolling tower with archers inside. Outshoots a watchtower and shrugs off arrows; swords and riders take it apart.' },
  catapult: { name: 'Catapult',  cls: 'army', tick: 'sol', tags: ['siege'], hp: 70, spd: 12, sight: 140, dmg: 22, rng: 170, cd: 4, cost: { w: 200, g: 100 }, t: 25, at: 'siege', age: 2, bonly: true, look: 'catapult', desc: 'Hurls stones at buildings from beyond bowshot. Fragile: guard it.' },
  bombard:  { name: 'Bombard',   cls: 'army', knock: 3, tick: 'sol', tags: ['siege', 'gun'], hp: 110, spd: 10, sight: 150, dmg: 100, rng: 190, cd: 8, cost: { w: 200, g: 250, i: 250 }, t: 40, at: 'siege', age: 4, bonly: true, gun: true, look: 'bombard', desc: 'A great iron-banded gun. One ball breaks what a trebuchet needs two for. Slow to move, slower to load, and helpless up close.' },
  ballista: { name: 'Ballista',  cls: 'army', tick: 'sol', tags: ['siege'], hp: 60, spd: 12, sight: 150, dmg: 14, rng: 150, cd: 3, cost: { w: 160, g: 80 }, t: 22, at: 'siege', age: 2, vs: { elephant: 2, infantry: 1.5, mounted: 1.3, siege: 1.5 }, bld: 0.5, look: 'ballista', desc: 'A giant crossbow on a stand. Shoots soldiers from far off, best against elephants and packed foot.' },
  arquebus: { name: 'Arquebusier', cls: 'army', tick: 'sol', tags: ['infantry', 'ranged', 'gun'], hp: 40, spd: 24, sight: 150, dmg: 16, rng: 90, cd: 3.4, cost: { f: 50, g: 50, i: 40 }, t: 14, at: 'range', age: 4, vs: { heavy: 2, mounted: 1.5, infantry: 1.4 }, bld: 0.4, gun: true, look: 'arquebus', desc: 'A matchlock gun: a slow reload and a heavy blow at 90. Cheap to train, hard to stop. Strong against knights and riders; archers and riders catch it reloading.' },
  treb:     { name: 'Trebuchet', cls: 'army', knock: 4, tick: 'sol', tags: ['siege'], hp: 90, spd: 12, sight: 150, dmg: 60, rng: 230, cd: 6, cost: { w: 300, g: 200 }, t: 35, at: 'siege', age: 3, bonly: true, look: 'treb', desc: 'The counterweight engine: smashes walls and keeps from very far. Slow and helpless up close.' },
  rebel:    { name: 'Rebel',     tick: 'sol', tags: ['infantry'], hp: 40, spd: 24, sight: 130, dmg: 5, rng: 12, cd: 1.3, look: 'bandit', desc: 'Villagers of a vassal who have taken up arms against their overlord.' },
  // the wild: no owner but itself
  deer:     { name: 'Deer',      tick: 'wild', tags: ['animal'], hp: 30, spd: 40, sight: 90, meat: 200, flee: true, look: 'deer', desc: 'Runs from people. Villagers on Food hunt it.' },
  boar:     { name: 'Boar',      tick: 'wild', tags: ['animal'], hp: 70, spd: 30, sight: 70, dmg: 4, rng: 10, cd: 1.4, meat: 340, look: 'boar', desc: 'Good meat, and it fights back.' },
  wolf:     { name: 'Wolf',      tick: 'wild', tags: ['animal'], hp: 45, spd: 40, sight: 110, dmg: 5, rng: 10, cd: 1.1, look: 'wolf', desc: 'Hunts in packs and guards nothing but its den. Attacks anyone close.' },
  bear:     { name: 'Bear',      tick: 'wild', tags: ['animal'], hp: 150, spd: 30, sight: 90, dmg: 10, rng: 12, cd: 1.6, meat: 300, look: 'bear', desc: 'Strong and short-tempered. Stays near its den.' },
  bandit:   { name: 'Bandit',    tick: 'wild', tags: ['infantry'], hp: 55, spd: 26, sight: 120, dmg: 6, rng: 12, cd: 1.2, look: 'bandit', desc: 'Outlaws holed up in old ruins.' },
  robber:   { name: 'Robber',    tick: 'wild', tags: ['infantry'], hp: 60, spd: 32, sight: 140, dmg: 7, rng: 12, cd: 1.2, vs: { civ: 1.5 }, raid: 260, look: 'robber', desc: 'Robs caravans and villagers that come near the camp.' },
  wayfarer: { name: 'Wayfarer',  tick: 'wayfarer', tags: ['civ'], hp: 30, spd: 22, sight: 60, look: 'wayfarer', desc: 'A traveller looking for a place to settle. The first side to meet him gains a villager.' },
  vagabond: { name: 'Vagabond',  tick: 'wild', tags: ['civ'], hp: 30, spd: 20, sight: 40, passive: true, look: 'vagabond', desc: 'Drifters by a fire. They will fight for whoever pays.' },
  // the fantasy toggle swaps the guards for these
  direwolf: { name: 'Dire wolf', tick: 'wild', tags: ['animal'], hp: 90, spd: 42, sight: 120, dmg: 9, rng: 10, cd: 1.1, fantasy: true, look: 'direwolf', desc: 'A wolf the size of a pony.' },
  goblin:   { name: 'Goblin',    tick: 'wild', tags: ['infantry'], hp: 40, spd: 30, sight: 120, dmg: 5, rng: 12, cd: 1.0, fantasy: true, look: 'goblin', desc: 'Small, quick and greedy.' },
  skeleton: { name: 'Skeleton',  tick: 'wild', tags: ['infantry'], hp: 50, spd: 22, sight: 110, dmg: 6, rng: 12, cd: 1.3, fantasy: true, rarmor: 0.5, look: 'skeleton', desc: 'The dead guard their graves. Arrows pass through the ribs.' },
  troll:    { name: 'Troll',     tick: 'wild', tags: ['infantry', 'heavy'], hp: 320, spd: 22, sight: 130, dmg: 18, rng: 14, cd: 2.2, fantasy: true, raid: 200, look: 'troll', desc: 'Lives under the robbers\' bridge. Hits like a ram.' },
};
const ARMYK = Object.keys(UNIT).filter(k => UNIT[k].cls === 'army');
const SOLDIERK = Object.keys(UNIT).filter(k => UNIT[k].tick === 'sol');
const hasTag = (kind, tag) => (UNIT[kind].tags || []).includes(tag) || kind === tag;

// Goods: made, stored and carried, apart from the four resources. base: gold for one at a Market next door; it pays more far away and where it is wanted.
const GOODS = {
  wool:   { name: 'Wool',   col: '#ece5d3', base: 2, raw: true },
  cloth:  { name: 'Cloth',  col: '#8fb0d8', base: 7 },
  beer:   { name: 'Beer',   col: '#d9a35a', base: 5 },
  spice:  { name: 'Spice',  col: '#c4552e', base: 9, buy: 5 },   // not grown here: bought at trade stops for 5, as it came by caravan from far away
};
const GOODK = Object.keys(GOODS), WARES = GOODK.filter(k => !GOODS[k].raw);
const LOAD = 20;
// Food upkeep: one share is what a person eats; a villager gathering food brings in about 30 a minute, enough for 8 shares.
const UPKEEP = { share: 30 / 8 / 60, foot: 1.5, mounted: 3, cart: 2, hunger: 0.75 };
// Vassals. Every 10 seconds: tax takes a share of what the vassal gathered; unrest moves by the tax push minus loyalty/25 (0..100).
// Loyalty moves 5% of the way to its target: 20 + investment + garrison + protection − the tax's resentment (0..100).
const TAX = { light: { take: 0.10, push: 0.3, hate: 0 }, fair: { take: 0.20, push: 1.5, hate: 10 }, heavy: { take: 0.35, push: 4, hate: 30 } };
const INVEST = { castle: 20, town: 15, market: 10, tower: 6, tpost: 6, bizc: 6, council: 6, farm: 2, pasture: 2, house: 1 };   // loyalty for each building of yours within 450 of their Town Center (others: 3)
const VASSAL = { r: 450, garrison: 0.5, garrisonMax: 15, kill: 1, protectMax: 20, decay: 0.98, gift: 60, share: 0.25, shareAt: 50, giftAt: 60, rise: 0.3, crushed: 0.25, freeAfter: 240, reign: 300 };
const VENTURE = { age: 3, back: 1.4, lost: 0.2, max: 3, sizes: [100, 250, 500] };
const PRICE = { hit: 0.004, floor: 0.5, cap: 2.5, drift: 0.02 };   // each unit sold lowers the price 0.4%, bought raises it; prices drift 2% back toward normal every 10 s   // a caravan carries 20 goods
// Buildings. fp = squares a side (10 units each). h = how tall it stands. room = people it shelters.
// sab: what a spy does to it (burn: loses 60% health; stall: stops 40 s and loses the job in hand). No sab: too well guarded.
const BLD = {
  keep:      { name: 'Town Center', fp: 5, hp: 2400, h: 34, sight: 200, dmg: 7, rng: 130, cd: 1.0, drop: [...RES, ...GOODK], room: 5, desc: 'Your seat. Trains villagers and scouts, advances the age and sends emissaries. Shoots nearby enemies; villagers who shelter inside add their arrows. If it falls, you lose.' },
  house:     { name: 'House', fp: 2, hp: 200, h: 16, cost: { w: 30 }, t: 12, age: 0, room: 5, repeat: true, sab: 'burn', wood: true, desc: 'Shelter for five more people.' },
  farm:      { name: 'Farm', fp: 3, slots: 3, hp: 120, h: 1, cost: { w: 60 }, t: 10, age: 0, crop: 'food', rate: 0.7, walk: true, repeat: true, sab: 'burn', desc: 'Wheat, for food. Up to three villagers work it. Barely grows in winter; best at harvest. Soil tires when worked year after year and recovers when the field rests.' },
  treefarm:  { name: 'Tree farm', fp: 3, slots: 3, hp: 120, h: 1, cost: { w: 80 }, t: 12, age: 0, crop: 'wood', reserve: 500, rate: 0.55, walk: true, repeat: true, sab: 'burn', desc: 'A coppice plot: 500 wood, then it is cut out and must regrow, so you plant another. Up to three villagers tend it. Slower than a wild forest, but safe at home.' },
  mill:      { name: 'Mill', fp: 3, hp: 250, h: 18, cost: { w: 80 }, t: 15, age: 0, drop: ['food'], sab: 'burn', wood: true, desc: 'Drop-off for food. Put it by berries, fields or game.' },
  lumber:    { name: 'Lumber camp', fp: 3, hp: 250, h: 14, cost: { w: 80 }, t: 15, age: 0, drop: ['wood'], sab: 'burn', wood: true, desc: 'Drop-off for wood. Put it by a forest.' },
  mining:    { name: 'Mine', fp: 3, hp: 250, h: 14, cost: { w: 80 }, t: 15, age: 0, drop: ['stone', 'gold', 'iron'], sab: 'burn', desc: 'Drop-off for stone, gold and iron. Put it by a quarry, a gold seam or an iron vein.' },
  barracks:  { name: 'Barracks', fp: 4, hp: 450, h: 22, cost: { w: 150 }, t: 25, age: 0, sab: 'stall', wood: true, desc: 'Trains the foot: spearmen, then swordsmen.' },
  wall:      { name: 'Wall', fp: 1, hp: 100, h: 18, cost: { s: 5 }, t: 10, age: 0, wallish: true, desc: 'One square of stone. It blocks everyone, you too: leave a Gate. Drag to draw a line of them.' },
  gate:      { name: 'Gate', fp: 1, hp: 150, h: 18, cost: { s: 10, w: 10 }, t: 12, age: 0, wallish: true, repeat: true, wood: true, desc: 'A gap in your wall. Your people, your allies and anyone at peace with you walk through. Enemies have to break it.' },
  tower:     { name: 'Tower', fp: 2, hp: 500, h: 44, cost: { s: 100, w: 40 }, t: 25, age: 0, sight: 220, dmg: 10, rng: 140, cd: 1.2, desc: 'Shoots enemies in range and sounds the horn. Up to 5 villagers shelter inside and each adds an arrow.' },
  range:     { name: 'Archery range', fp: 4, hp: 400, h: 20, cost: { w: 150 }, t: 25, age: 1, sab: 'stall', wood: true, desc: 'Trains archers and javelineers, later crossbowmen.' },
  stable:    { name: 'Stable', fp: 4, hp: 450, h: 22, cost: { w: 175 }, t: 25, age: 1, sab: 'stall', wood: true, desc: 'Trains chariots, then cataphracts, horse archers and war elephants.' },
  smith:     { name: 'Smithy', fp: 3, hp: 400, h: 20, cost: { w: 120 }, t: 25, age: 1, sab: 'stall', desc: 'Researches weapons and armour for your soldiers, and defences for your walls.' },
  market:    { name: 'Market', fp: 3, hp: 350, h: 18, cost: { w: 150, s: 50 }, t: 25, age: 0, sab: 'stall', wood: true, desc: 'Swap 100 of a resource for gold or gold for a resource, and sell goods. Prices rise and fall with what everyone buys and sells. From the Medieval age it takes ventures. Trains caravans, which run to your other Markets: build one far away for bigger pay.' },
  school:    { name: 'School', fp: 3, hp: 350, h: 22, cost: { w: 120, s: 50 }, t: 25, age: 1, sab: 'stall', desc: 'Reading, writing and numbers. Researches Writing and Mathematics.' },
  temple:    { name: 'Temple', fp: 4, hp: 600, h: 34, cost: { s: 300, g: 150, w: 100 }, t: 45, age: 1, sab: 'stall', desc: 'Very costly. Trains priests, who take holy sites, and lets you call Zeal on a battalion.' },
  courthouse:{ name: 'Courthouse', fp: 3, hp: 450, h: 24, cost: { w: 150, g: 60 }, t: 30, age: 1, spyonly: true, dmg: 12, rng: 140, cd: 1.5, desc: 'Written law and the watch. Trains spies, and its guards shoot enemy spies within 140. Nothing else.' },
  bakery:    { name: 'Bakery', fp: 3, hp: 300, h: 18, cost: { w: 120, s: 40 }, t: 25, age: 1, aura: { crop: 'food', r: 220, m: 1.15 }, sab: 'burn', desc: 'Bread from the same grain: farms within 220 give 15% more food. Several bakeries do not add up.' },
  apartment: { name: 'Apartment', fp: 3, hp: 500, h: 30, cost: { w: 100, s: 50 }, t: 30, age: 2, room: 20, sab: 'burn', desc: 'A tall block with room for twenty more people. Costs stone, and a bigger target than a house.' },
  hospital:  { name: 'Hospital', fp: 3, hp: 400, h: 20, cost: { w: 150, s: 100 }, t: 30, age: 2, heal: 3, hrng: 90, sab: 'burn', desc: 'Heals your soldiers within 90, 3 health a second, and trains medics who heal in the field.' },
  library:   { name: 'Library', name3: 'University', fp: 4, hp: 450, h: 26, cost: { w: 200, s: 150, g: 50 }, t: 40, age: 2, sab: 'stall', desc: 'Scholars together: researches Architecture, Roads and Medicine. In the Medieval age it is a University.' },
  siege:     { name: 'Siege workshop', fp: 4, hp: 450, h: 22, cost: { w: 250, s: 100 }, t: 30, age: 2, sab: 'stall', desc: 'Builds rams, siege towers, catapults and ballistae, later trebuchets.' },
  amphi:     { name: 'Amphitheatre', fp: 5, hp: 800, h: 26, cost: { s: 400, w: 200, g: 150 }, t: 60, age: 2, fx: [{ s: 'zealcost', m: 0.5 }, { s: 'zealcd', m: 0.7 }], sab: 'stall', desc: 'Games for the people: Zeal costs half and rests 30% less. Gladiators fought here; they never marched with an army.' },
  aqueduct:  { name: 'Aqueduct', fp: 3, hp: 600, h: 28, cost: { s: 250, w: 150 }, t: 40, age: 2, room: 15, sab: 'burn', desc: 'Water for a city: room for fifteen more people.' },
  dock:      { name: 'Dock', fp: 2, hp: 200, h: 6, cost: { w: 100 }, t: 15, age: 0, shore: true, drop: ['food'], sab: 'burn', wood: true, desc: 'Stands on a shore. Villagers on Food fish from it and bring the catch here. No dock, no fishing.' },
  town:      { name: 'Town Center', fp: 4, hp: 1800, h: 30, cost: { w: 400, s: 300, f: 200 }, t: 60, age: 2, sight: 180, dmg: 6, rng: 120, cd: 1.2, drop: [...RES, ...GOODK], room: 5, desc: 'A second town: trains villagers, takes every drop-off, shoots and shelters villagers. Losing it does not lose the game; losing your first does.' },
  castle:    { name: 'Castle', fp: 5, hp: 3200, h: 40, cost: { s: 900, w: 300 }, t: 90, age: 3, sight: 240, dmg: 12, rng: 170, cd: 1.0, desc: 'A stone castle: the strongest building there is. Shoots far and shelters ten villagers who add their arrows. Built in a vassal\'s lands, it keeps them safe and loyal.' },
  pasture:   { name: 'Pasture', fp: 3, hp: 120, h: 1, cost: { w: 60, f: 60 }, t: 10, age: 0, crop: 'wool', reserve: 0, rate: 1.5, walk: true, sheep: 6, sab: 'burn', desc: 'A fenced flock. Sheep are shorn once a year in spring; lambs come in spring if the flock has room (up to 12). A shepherd brings the wool in. Wolves take sheep.' },
  weaver:    { name: 'Weaver', fp: 3, hp: 250, h: 16, cost: { w: 120, s: 30 }, t: 20, age: 1, crop: 'cloth', from: { wool: 2 }, rate: 0.12, drop: ['wool'], sab: 'burn', wood: true, desc: 'Spins and weaves wool into cloth: 2 wool make 1 cloth. Spinning is the slow part. One villager works it.' },
  brewery:   { name: 'Brewery', fp: 3, hp: 250, h: 18, cost: { w: 100, s: 40 }, t: 20, age: 1, crop: 'beer', from: { f: 3 }, rate: 0.15, sab: 'burn', wood: true, desc: 'Brews ale from your grain: 3 food make 1 beer, a good to trade. One villager works it.' },
  bizc:      { name: 'Business Center', fp: 4, hp: 450, h: 24, cost: { w: 200, s: 100 }, t: 30, age: 1, drop: GOODK, sab: 'stall', desc: 'Stores your goods and loads your caravans. Give a caravan a route and it shuttles goods to a Market or a trade stop.' },
  council:   { name: 'War Council', fp: 3, hp: 600, h: 22, cost: { w: 200, s: 150, g: 50 }, t: 35, age: 2, sab: 'stall', desc: 'Where your generals plan. Research Command here for six battalions, then Formations; set what each battalion holds and how it stands.' },
  tpost:     { name: 'Trade post', fp: 2, hp: 300, h: 20, cost: { w: 100, s: 30 }, t: 20, age: 1, atStop: true, sight: 140, dmg: 5, rng: 120, cd: 1.6, sab: 'burn', desc: 'Built on a trade stop once its guards are gone. You own the stop: a cut of every sale there, gold every minute, more for each stop you hold on the same route, double for the whole route. Caravans within 120 are safe from robbers.' },
  wonder:    { name: 'Wonder', fp: 6, hp: 4000, h: 60, cost: { f: 1500, w: 1500, s: 1500, g: 1500 }, t: 240, age: 2, one: true, desc: 'Your civilisation\'s great work. When it is finished every side is told, and if it still stands 8 minutes later, you win.' },
};
const WONDER_HOLD = 480;
const TRAINERS = new Set(['keep', ...Object.values(UNIT).flatMap(U => U.at ? [U.at, ...(U.also || [])] : [])]);   // buildings that send people out keep a free square round them; the rest may touch

// The build menus. "soon" is on the list but not built: it stays visible until built or deliberately dropped (and logged).
const MENUS = [
  { id: 'home', name: 'Home',     blurb: 'room to live, food, wood, stone', items: ['house', 'apartment', 'aqueduct', 'town', 'farm', 'pasture', 'treefarm', 'mill', 'dock', 'lumber', 'mining', 'bakery'] },
  { id: 'mil',  name: 'Military', blurb: 'where soldiers are trained',      items: ['barracks', 'range', 'stable', 'siege', 'smith', 'council'] },
  { id: 'def',  name: 'Defense',  blurb: 'towers, walls and gates',         items: ['tower', 'castle', 'wall', 'gate'] },
  { id: 'shop', name: 'Trade',    blurb: 'markets, goods and caravans',       items: ['market', 'bizc', 'weaver', 'brewery'] },
  { id: 'cult', name: 'Culture',  blurb: 'learning, faith, law and wonders', items: ['school', 'library', 'hospital', 'temple', 'courthouse', 'amphi', 'wonder'] },
];

// Research. fx: what it changes, by stat; k narrows it (a resource, a unit kind or #tag, a building kind or #wallish).
// m multiplies, a adds, min keeps the lowest (armour does not stack). tier: upgrades a unit in place and renames it.
const TECH = [
  { id: 'axes',    name: 'Stone axes',     at: 'lumber', age: 0, cost: { f: 100, w: 50 },  t: 25, fx: [{ s: 'gather', k: 'wood', m: 1.2 }], desc: 'Wood gathered 20% faster.' },
  { id: 'picks',   name: 'Antler picks',   at: 'mining', age: 0, cost: { f: 100, w: 75 },  t: 25, fx: [{ s: 'gather', k: 'stone', m: 1.2 }, { s: 'gather', k: 'gold', m: 1.2 }], desc: 'Stone and gold gathered 20% faster.' },
  { id: 'coppice', name: 'Coppicing',      at: 'lumber', age: 0, need: 'axes', cost: { f: 100, w: 100 }, t: 30, fx: [{ s: 'crop', k: 'wood', m: 1.25 }], desc: 'Tree farms give 25% more wood.' },
  { id: 'plough',  name: 'Plough',         at: 'mill',   age: 1, cost: { f: 150, w: 100 }, t: 30, fx: [{ s: 'gather', k: 'food', m: 1.2 }], desc: 'Food gathered 20% faster.' },
  { id: 'masonry', name: 'Masonry',        at: 'mining', age: 1, cost: { s: 150 },         t: 30, fx: [{ s: 'bhp', k: '*', m: 1.3 }], desc: 'All buildings and walls 30% sturdier.' },
  { id: 'drill',   name: 'Drill',          at: 'barracks', age: 1, cost: { f: 100, g: 50 }, t: 30, fx: [{ s: 'uhp', k: '#soldier', m: 1.15 }], desc: 'Soldiers have 15% more health.' },
  { id: 'bronze',  name: 'Bronze weapons', at: 'smith',  age: 1, cost: { f: 150, g: 50 },  t: 30, fx: [{ s: 'dmg', k: '#soldier', a: 1 }, { s: 'dmg', k: '#guard', a: 1 }], desc: 'Soldiers, towers and the Town Center hit 1 harder.' },
  { id: 'leather', name: 'Leather armour', at: 'smith',  age: 1, cost: { f: 100, w: 50 },  t: 25, fx: [{ s: 'armor', k: '#soldier', min: 0.85 }], desc: 'Soldiers take 15% less damage.' },
  { id: 'composite', name: 'Composite bow', at: 'range', age: 1, cost: { w: 100, g: 50 }, t: 30, fx: [{ s: 'rng', k: '#archer', a: 15 }], desc: 'Archers of every kind shoot 15 farther.' },
  { id: 'horses',  name: 'Horse breeding', at: 'stable', age: 1, cost: { f: 150, g: 100 }, t: 40, fx: [{ s: 'spd', k: '#mounted', m: 1.12 }], desc: 'Everything on horseback is 12% faster.' },
  { id: 'writing', name: 'Writing',        at: 'school', age: 1, cost: { w: 100, g: 50 },  t: 30, fx: [{ s: 'research', m: 0.85 }], desc: 'All research takes 15% less time.' },
  { id: 'maths',   name: 'Mathematics',    at: 'school', age: 1, need: 'writing', cost: { f: 100, g: 100 }, t: 35, fx: [{ s: 'dmg', k: '#guard', a: 2 }], desc: 'Towers and the Town Center hit 2 harder.' },
  { id: 'iron',    name: 'Iron weapons',   at: 'smith',  age: 2, need: 'bronze', cost: { f: 200, i: 100 }, t: 40, fx: [{ s: 'dmg', k: '#soldier', a: 2 }, { s: 'dmg', k: '#guard', a: 2 }], desc: 'Hit 2 harder again.' },
  { id: 'chain',   name: 'Chain mail',     at: 'smith',  age: 2, need: 'leather', cost: { f: 200, i: 150 }, t: 40, fx: [{ s: 'armor', k: '#soldier', min: 0.7 }], desc: 'Soldiers take 30% less damage.' },
  { id: 'slits',   name: 'Arrow slits',    at: 'smith',  age: 2, need: 'masonry', cost: { s: 150, g: 50 }, t: 30, fx: [{ s: 'rng', k: '#guard', a: 20 }], desc: 'Towers and the Town Center shoot 20 farther.' },
  { id: 'deep',    name: 'Deep mining',    at: 'mining', age: 2, need: 'picks', cost: { f: 150, g: 100 }, t: 40, fx: [{ s: 'gather', k: 'stone', m: 1.2 }, { s: 'gather', k: 'gold', m: 1.2 }], desc: 'Stone and gold gathered 20% faster again.' },
  { id: 'phalanx', name: 'Phalanx',        at: 'barracks', age: 2, need: 'drill', cost: { f: 150, g: 100 }, t: 40, tier: { unit: 'spear', name: 'Hoplite', hp: 1.25, dmg: 2 }, desc: 'Spearmen become hoplites: 25% more health, hit 2 harder.' },
  { id: 'cavalry', name: 'Cavalry',        at: 'stable', age: 2, cost: { f: 150, g: 75 }, t: 40, tier: { unit: 'chariot', name: 'Horseman', hp: 1.15, spd: 1.12 }, desc: 'Chariots give way to horsemen: 15% more health, 12% faster.' },
  { id: 'medicine',name: 'Medicine',       at: 'library', age: 2, cost: { f: 200, g: 150 }, t: 45, fx: [{ s: 'heal', m: 1.5 }], desc: 'Hospitals and medics heal 50% faster.' },
  { id: 'architecture', name: 'Architecture', at: 'library', age: 2, need: 'maths', cost: { w: 200, s: 150 }, t: 45, fx: [{ s: 'build', m: 0.8 }], desc: 'Buildings go up 20% faster.' },
  { id: 'roads',   name: 'Roads',          at: 'library', age: 2, cost: { s: 200, g: 100 }, t: 45, fx: [{ s: 'mud', m: 0.5 }, { s: 'trade', m: 1.15 }], desc: 'Halves the slowing of spring mud and winter cold; caravans earn 15% more.' },
  { id: 'coinage', name: 'Coinage',        at: 'market', age: 2, cost: { s: 100, g: 150 }, t: 40, fx: [{ s: 'sell', a: 0.1 }], desc: 'The Market pays 90% of a resource\'s worth instead of 80%.' },
  { id: 'rotation',name: 'Crop rotation',  at: 'mill',   age: 3, need: 'plough', cost: { f: 200, w: 100 }, t: 40, fx: [{ s: 'crop', k: 'food', m: 1.2 }], desc: 'Fields give 20% more food.' },
  { id: 'heavyplough', name: 'Heavy plough', at: 'mill', age: 3, need: 'plough', cost: { f: 250, w: 150 }, t: 45, fx: [{ s: 'crop', k: 'food', m: 1.15 }], desc: 'Fields give 15% more food again.' },
  { id: 'wheelbarrow', name: 'Wheelbarrow', at: 'mill', age: 3, cost: { f: 150, w: 100 }, t: 35, fx: [{ s: 'carry', a: 5 }], desc: 'Villagers carry 15 instead of 10: fewer trips.' },
  { id: 'pikesquare', name: 'Pike square', at: 'barracks', age: 3, need: 'phalanx', cost: { f: 250, g: 150 }, t: 50, tier: { unit: 'spear', name: 'Pikeman', hp: 1.15, dmg: 1, vs: { mounted: 4 } }, desc: 'Hoplites become pikemen: tougher still, and four times as deadly to horses.' },
  { id: 'arms',    name: 'Men-at-arms',    at: 'barracks', age: 3, cost: { f: 200, i: 150 }, t: 45, tier: { unit: 'sword', name: 'Man-at-arms', hp: 1.3, dmg: 3 }, desc: 'Swordsmen become men-at-arms: 30% more health, hit 3 harder.' },
  { id: 'longbow', name: 'Longbow',        at: 'range',  age: 3, need: 'composite', cost: { w: 200, g: 150 }, t: 45, tier: { unit: 'archer', name: 'Longbowman', rng: 20, dmg: 1 }, desc: 'Archers become longbowmen: 20 farther, hit 1 harder.' },
  { id: 'knighthood', name: 'Knighthood',  at: 'stable', age: 3, cost: { f: 250, g: 100, i: 100 }, t: 50, tier: { unit: 'cata', name: 'Knight', hp: 1.2, dmg: 2, spd: 1.1 }, desc: 'Cataphracts become knights: 20% more health, hit 2 harder, 10% faster.' },
  { id: 'plate',   name: 'Plate armour',   at: 'smith',  age: 3, need: 'chain', cost: { f: 300, i: 200 }, t: 50, fx: [{ s: 'armor', k: '#soldier', min: 0.6 }], desc: 'Soldiers take 40% less damage.' },
  { id: 'fortify', name: 'Fortification',  at: 'smith',  age: 3, need: 'masonry', cost: { s: 300, g: 100 }, t: 45, fx: [{ s: 'bhp', k: '#wallish', m: 1.6 }, { s: 'bhp', k: 'tower', m: 1.4 }], desc: 'Walls and gates 60% sturdier, towers 40%.' },
  { id: 'machic', name: 'Machicolations', at: 'smith',  age: 3, need: 'fortify', cost: { s: 250, g: 100 }, t: 40, fx: [{ s: 'dmg', k: 'tower', a: 5 }], desc: 'Towers drop and shoot through floor openings: they hit 5 harder.' },
  { id: 'musket', name: 'Musket', at: 'range', age: 4, cost: { f: 300, g: 250, i: 150 }, t: 50, tier: { unit: 'arquebus', name: 'Musketeer', hp: 1.1, dmg: 4, rng: 10 }, desc: 'Arquebusiers become musketeers: 10% more health, hit 4 harder, shoot 10 farther.' },
  { id: 'starfort', name: 'Star fort', at: 'smith', age: 4, need: 'fortify', cost: { s: 500, g: 300, i: 200 }, t: 60, fx: [{ s: 'bhp', k: '#wallish', m: 1.5 }, { s: 'bhp', k: '#guard', m: 1.3 }], desc: 'Low angled bastions turn cannon balls: walls 50% sturdier; towers, castles and Town Centers 30%.' },
  { id: 'granary', name: 'Stone granary',  at: 'mill',   age: 1, cost: { s: 150, w: 50 }, t: 30, fx: [{ s: 'plague', m: 0.5 }], desc: 'Grain kept in stone, not wood: fewer rats, half the risk of plague.' },
  { id: 'command', name: 'Command',        at: 'council', age: 2, cost: { f: 200, g: 150 }, t: 40, fx: [], desc: 'Six battalions, Alpha to Zeta: set what each holds here, then send any of them from Quick send.' },
  { id: 'formations', name: 'Formations', at: 'council', age: 2, need: 'command', cost: { f: 250, g: 200 }, t: 45, fx: [], desc: 'Each battalion takes a formation: Line, Column, Wedge or Square.' },
  { id: 'nets',    name: 'Fishing nets',   at: 'dock', age: 1, cost: { w: 100, g: 50 }, t: 25, fx: [{ s: 'gather', k: 'fish', m: 1.3 }], desc: 'Fishing brings in 30% more.' },
  { id: 'cleanwater', name: 'Clean water', at: 'aqueduct', age: 2, cost: { s: 200, g: 100 }, t: 40, fx: [{ s: 'sick', m: 0.5 }], desc: 'Settling tanks and clean channels: half the risk of sickness.' },
  { id: 'medschool', name: 'Medical school', at: 'library', age: 3, need: 'medicine', cost: { f: 200, g: 200 }, t: 50, fx: [{ s: 'death', m: 0.5 }, { s: 'cure', m: 2 }], desc: 'Trained physicians: half as many of the sick die, and they are cured twice as fast.' },
];
const TECHBY = Object.fromEntries(TECH.map(t => [t.id, t]));

// Six civilisations: one unique unit (replaces a common one, same role, a little better), one small bonus, one wonder (same cost and effect for all).
const CIVS = {
  roman:   { name: 'Roman',   color: '#b33a2e', uu: 'legion',   fx: [{ s: 'build', m: 0.85 }], bonus: 'Engineers: buildings go up 15% faster.', wonder: 'Colosseum' },
  han:     { name: 'Han',     color: '#c9a227', uu: 'hanxbow',  fx: [{ s: 'crop', k: 'food', m: 1.1 }], bonus: 'Iron ploughs and new field systems: fields give 10% more food.', wonder: 'Weiyang Palace' },
  persian: { name: 'Persian', color: '#3f6fb5', uu: 'immortal', fx: [{ s: 'trade', m: 1.2 }], bonus: 'The Royal Road: caravans earn 20% more.', wonder: 'Apadana of Persepolis' },
  mongol:  { name: 'Mongol',  color: '#6e8b3d', uu: 'mongolha', fx: [{ s: 'spd', k: '#mounted', m: 1.1 }], bonus: 'Every rider kept spare horses: everything on horseback is 10% faster.', wonder: 'Karakorum and the Silver Tree' },
  maurya:  { name: 'Maurya',  color: '#c46b2a', uu: 'mauryael', fx: [{ s: 'train', k: '#mounted', m: 0.75 }], bonus: 'The king held all horses and elephants: everything on horseback trains 25% faster.', wonder: 'Great Stupa at Sanchi' },
  mali:    { name: 'Mali',    color: '#8a5a2b', uu: 'malihorse', fx: [{ s: 'gather', k: 'gold', m: 1.15 }], bonus: 'The gold fields: gold gathered 15% faster.', wonder: 'Djinguereber Mosque' },
};
const CIVK = Object.keys(CIVS);
// The unique units: each takes the place of a common one for its civilisation only.
Object.assign(UNIT, {
  legion:   { ...UNIT.sword,   name: 'Legionary', civ: 'roman', replaces: 'sword', hp: 80, dmg: 9, look: 'legion', desc: 'Heavy infantry with a throwing spear and a short sword. Beats other foot soldiers and breaks buildings faster.' },
  hanxbow:  { ...UNIT.crossbow, name: 'Han crossbowman', civ: 'han', replaces: 'crossbow', age: 2, cd: 2.0, look: 'crossbow', desc: 'The crossbow a whole age early, and quicker to reload.' },
  immortal: { ...UNIT.sword,   name: 'Immortal', civ: 'persian', replaces: 'sword', hp: 75, vs: { infantry: 1.5, mounted: 1.6, siege: 2 }, look: 'immortal', desc: 'Elite guard with spear, bow and wicker shield. Beats foot soldiers and holds against horse.' },
  mongolha: { ...UNIT.harcher, name: 'Mongol horse archer', civ: 'mongol', replaces: 'harcher', rng: 90, spd: 40, look: 'harcher', desc: 'Shoots farther and rides faster than any other horse archer.' },
  mauryael: { ...UNIT.elephant, name: 'Maurya war elephant', civ: 'maurya', replaces: 'elephant', hp: 320, look: 'elephant', desc: 'The royal elephant corps: a quarter tougher than any other war elephant.' },
  malihorse:{ ...UNIT.cata,    name: 'Mali horseman', civ: 'mali', replaces: 'cata', hp: 135, spd: 38, look: 'cata', desc: 'Mali\'s standing cavalry, with lance and bow: tougher and quicker than a cataphract.' },
});
for (const k of ['legion', 'hanxbow', 'immortal', 'mongolha', 'mauryael', 'malihorse']) { ARMYK.push(k); SOLDIERK.push(k); }

// What you can find in the wild. Each corner gets the same set, turned toward the middle.
// guard: [real kind, fantasy kind, how many]. got: what the first side to reach it (guards dead) takes. fantasy adds half.
const FINDS = {
  chest:    { name: 'Treasure chest', guard: ['wolf', 'direwolf', 2], got: { f: 100, g: 150 }, desc: 'Someone buried this and never came back. Kill the guards, then touch it.' },
  ruins:    { name: 'Ruins', guard: ['bandit', 'goblin', 3], got: { g: 50 }, tech: true, desc: 'An old library in ruins, held by outlaws. Clear it and you find a scroll: one research of your age, free.' },
  cemetery: { name: 'Old cemetery', guard: ['robber', 'skeleton', 2], got: { g: 250 }, desc: 'Grave goods, and grave robbers already at work. Clear them and the gold is yours.' },
  camp:     { name: 'Robbers\' camp', guard: ['robber', 'troll', 4], got: { f: 200, w: 200, g: 250 }, desc: 'Robbers who prey on caravans and villagers near the map edge. Break the camp and take its hoard.' },
  den:      { name: 'Bear den', guard: ['bear', 'bear', 1], got: { f: 60 }, desc: 'A bear and its stores. The meat is good too.' },
  stop:     { name: 'Trade stop', guard: ['bandit', 'goblin', 3], stop: true, desc: 'A stop on an old trade route. Caravans sell goods here and buy spice. Clear its guards and build a Trade post to own it.' },
  shrine:   { name: 'Shrine', capture: 10, pay: 0.25, desc: 'A holy site. Stand a priest by it for 10 s and it pays its keeper 15 gold a minute. Another side\'s priest can take it back.' },
  vagabonds:{ name: 'Vagabonds', hire: { cost: { g: 90 }, unit: 'spear', n: 3 }, desc: 'Three drifters will fight for whoever pays 90 gold. A unit of yours has to be within 80.' },
};
const WAYFARER_EVERY = 240;
// the Fortress posts a job: break one guarded find, first side to take it is paid
const CONTRACT = { every: 240, secs: 300, pay: { g: 200 }, kinds: ['camp', 'cemetery', 'chest', 'den', 'ruins'] };

// The three computer personalities: one brain, three settings. Every behaviour is a field, never a name check.
// build: [kind, from age, how many, needs army of at least, needs stock]; techs in the order they want them.
const PERS = {
  aggr: { vils: 16, mix: { food: .5, wood: .35, gold: .15, stone: 0, iron: .08 }, ageTo: 2, extraBarracks: 1, armyCap: 34, waveMin: 5, bold: .5, guard: .15, raid: 3, towers: 0, walls: false,
          early: 6, ageArmy: 6, diplo: true, trade: true, spy: true, loot: true, hunt: true, wonder: false, siege: 1, shrine: false,
          build: [['barracks', 0, 1, 0], ['range', 1, 1, 0], ['stable', 1, 1, 4], ['smith', 1, 1, 6], ['market', 1, 1, 6, { w: 250, g: 100 }], ['courthouse', 1, 1, 8, { w: 250, g: 100 }], ['siege', 2, 1, 10, { w: 300 }]],
          techs: ['drill', 'bronze', 'axes', 'plough', 'horses', 'leather', 'composite', 'iron', 'cavalry', 'phalanx', 'chain'] },
  bal:  { vils: 26, mix: { food: .4, wood: .3, gold: .2, stone: .1, iron: .1 }, ageTo: 4, extraBarracks: 0, armyCap: 34, waveMin: 10, bold: .65, guard: .3, raid: 2, towers: 1, walls: false,
          early: 12, ageArmy: 0, diplo: true, trade: true, spy: true, loot: true, hunt: true, wonder: true, siege: 2, shrine: true,
          build: [['barracks', 0, 1, 0], ['range', 1, 1, 0], ['smith', 1, 1, 0], ['stable', 1, 1, 4], ['market', 1, 1, 6, { w: 250, g: 100 }], ['school', 1, 1, 8, { w: 300, s: 100 }], ['temple', 1, 1, 10, { s: 450, g: 300 }], ['courthouse', 1, 1, 8, { w: 250, g: 100 }], ['bakery', 1, 1, 6, { w: 200 }],
                  ['siege', 2, 1, 8, { w: 300, s: 100 }], ['hospital', 2, 1, 10, { w: 250, s: 200 }], ['library', 2, 1, 10, { w: 400, s: 300 }], ['amphi', 2, 1, 14, { s: 600, w: 300, g: 300 }]],
          techs: ['axes', 'picks', 'plough', 'bronze', 'leather', 'drill', 'coppice', 'composite', 'writing', 'maths', 'horses', 'iron', 'chain', 'phalanx', 'cavalry', 'deep', 'masonry', 'architecture', 'medicine', 'roads', 'coinage', 'rotation', 'wheelbarrow', 'arms', 'knighthood', 'longbow', 'plate', 'heavyplough', 'pikesquare', 'slits', 'fortify'] },
  fort: { vils: 28, mix: { food: .4, wood: .3, gold: .15, stone: .15, iron: .08 }, ageTo: 3, extraBarracks: 0, armyCap: 26, waveMin: 999, bold: 9, guard: 1, towers: 3, walls: true,
          early: 12, ageArmy: 0, diplo: false, trade: false, spy: false, loot: false, hunt: true, wonder: true, siege: 0, shrine: true,
          build: [['barracks', 0, 1, 0], ['range', 1, 1, 0], ['smith', 1, 1, 0], ['stable', 1, 1, 6], ['school', 1, 1, 6, { w: 300, s: 100 }], ['temple', 1, 1, 8, { s: 450, g: 300 }], ['courthouse', 1, 1, 6, { w: 250, g: 100 }], ['bakery', 1, 1, 4, { w: 200 }],
                  ['hospital', 2, 1, 8, { w: 250, s: 200 }], ['library', 2, 1, 8, { w: 400, s: 300 }], ['aqueduct', 2, 1, 8, { s: 400 }], ['castle', 3, 1, 12, { s: 1100, w: 400 }]],
          techs: ['masonry', 'leather', 'axes', 'picks', 'bronze', 'plough', 'coppice', 'writing', 'maths', 'chain', 'iron', 'drill', 'deep', 'architecture', 'medicine', 'slits', 'rotation', 'wheelbarrow', 'phalanx', 'fortify', 'plate', 'heavyplough', 'pikesquare', 'longbow'] },
};
const TRADE = { f: 80, w: 80, s: 110, i: 120 }, TRADE_CAP = 80, TRADE_DIV = 16000, SELL = 0.8, BUY = 1.25;
const ZEAL = { cost: { g: 60 }, secs: 45, cd: 120, mul: 1.2 };
const SAB = { burn: 0.6, stall: 40 };
const FLANK = 1.3;      // a blow from behind lands 30% harder
const BUILDER_POW = 0.7;   // a crew of n builds n^0.7 times as fast as one: two builders ≈ 1.6×, three ≈ 2.1×
// Formations (research Formations at the War Council): each battalion takes one. spd: march speed; hit: damage taken; dmg: damage dealt by its riders; vsMounted: damage taken from riders
const FORM = [
  { name: 'Line',   shape: 'line',   note: 'as they stand' },
  { name: 'Column', shape: 'column', spd: 1.15, hit: 1.1, note: '15% faster, 10% more damage taken' },
  { name: 'Wedge',  shape: 'wedge',  dmg: 1.15, hit: 1.1, note: 'riders hit 15% harder, take 10% more' },
  { name: 'Square', shape: 'square', spd: 0.8, vsMounted: 0.7, note: '30% less from riders, 20% slower' },
];
const GRID = { gap: 15, rows: 2.0 };   // an army stands in a grid: 15 apart, about twice as wide as deep
const DOCKR = 150;     // fish are caught only within 150 of a finished dock of yours
const KITE = 45;        // a shooter steps back from a foe this close while it reloads
// a battalion's stance (the computers choose theirs: shooters skirmish, foot at home hold a wall)
const STANCE = [
  { name: 'Line', note: 'fight as they stand' },
  { name: 'Shield wall', hit: 0.8, spd: 0.65, note: 'foot soldiers take a fifth less damage and march a third slower' },
  { name: 'Skirmish', note: 'shooters step back from anyone who closes in while they reload' },
];
const SHELTER = { flee: 70, clear: 150, raid: 3, hurt: 6, arrows: { keep: 8, tower: 5, castle: 10, town: 6 } };   // villagers run into the nearest Town Center or tower when an enemy soldier comes within 70, when three or more beasts or robbers do, or when a lone beast or robber hits them (it scares only the one it hits); out when none within 150 of it; each adds an arrow up to the limit (the room is the same)
const SCORE = { unit: 5, bld: 5, tech: 5, wealth: 10 }; // score = value held / 5, research / 5, everything gathered / 10

