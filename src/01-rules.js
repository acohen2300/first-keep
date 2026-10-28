// ═════ 01-rules.js ═════
// ───────────────────────── The rules: every number lives in a table ─────────────────────────
const BUILD = 40;
const MAP = 2000, MID = MAP / 2, DT = 1 / 30;
const BN = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'], BNS = BN.length;   // the battalions, once Command is researched
const POPMAX = 150, VILMAX = 60, ARMYMAX = 90, BNSIZE = 30, SHARE_FALLEN = 0.5;   // a fallen side's room: half of it is split among whoever is left   // six battalions, once Command is researched at a War Council; BNSIZE: the most one Zeal blesses
const RICH = 2.5, PLUNDER = 0.25, CARRY = 10, NAVC = 10;                // NAVC: the walking grid, 10 units a square (never shown)
const LAKE0 = { x: MID, y: MID, r: 170 };                              // the great lake in the middle; each corner also gets a lake of its own (G.lakes)
const SEASON_LEN = 180, DAY_LEN = 120, NIGHT_SIGHT = 0.6;
const EASY_SAFE = 360, SAVE_EVERY = 10, REACT = { easy: 2, normal: 1 };   // Easy: no raid before 6:00; the game saves every 10 s; seconds between computer decisions
const ZOOM_MAX = 4, TILT = 0.66, SIDE = 0.4;   // SIDE: how far right the back of a building sits, per unit of depth, so its east wall shows
const FOG = 40, FOGN = Math.ceil(MAP / 40);   // fog of war: squares of 40; unseen, explored (stays lit, dim), in sight now
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
const JOBS = RES;   // a job for each resource

// Relations: ally | peace (neutral) | war (hostile). Peace holds until a side gives NOTICE; alliance needs the other side's yes.
const REL_WORD = { ally: 'Ally', peace: 'Neutral', war: 'Hostile' };
const PLAYERS = [
  { name: 'You',      pers: 'human', color: '#4f93e6', keep: [300, 1700] },
  { name: 'Raiders',  pers: 'aggr',  color: '#de5a44', keep: [300, 300] },
  { name: 'Rivals',   pers: 'bal',   color: '#b07ae6', keep: [1700, 300] },
  { name: 'Fortress', pers: 'fort',  color: '#5fb08a', keep: [1700, 1700] },
  { name: 'Natives',  pers: 'wild',  color: '#9b8b72', keep: [MID, MID] },
];
const FORT = 3;   // a player like the others since Build 40: it defends first, and strikes whoever is weak or busy

const AGES = [
  { name: 'Stone' },
  { name: 'Bronze',    cost: { f: 300, w: 100 },         t: 40 },
  { name: 'Classical', cost: { f: 600, g: 200 },         t: 60 },
  { name: 'Medieval',  cost: { f: 1000, g: 500, s: 200 }, t: 80 },
  { name: 'Gunpowder', cost: { f: 1600, g: 900, s: 300, i: 400 }, t: 100 },
];
const SEASONS = [   // one year is 12 minutes; real effects, simplified
  { name: 'Spring', spd: 0.85, farm: 1.0, tint: null },
  { name: 'Summer', spd: 1.0,  farm: 1.1, tint: null },
  { name: 'Autumn', spd: 1.0,  farm: 1.25, tint: 'rgba(190,120,40,.12)' },
  { name: 'Winter', spd: 0.8,  farm: 0.4, tint: 'rgba(225,232,240,.30)' },
];

// Units. cls: which limit it counts toward (civ = the 60 villagers and workers, army = the 90). tick: which routine runs it.
// tags say what it is; vs says what it beats (×, by tag or kind; the best match counts). bld: × against buildings.
// rarmor: × it takes from arrows and bolts. tiers come from research (TECH.tier).
const UNIT = {
  vil:      { name: 'Villager',  cls: 'civ', tick: 'vil', tags: ['civ'], hp: 25, spd: 24, sight: 90, dmg: 3, rng: 30, cd: 1.5, cost: { f: 50 }, t: 8, at: 'keep', also: ['town'], age: 0, look: 'vil', desc: 'Gathers food, wood, stone and gold and carries it to the nearest drop-off. Hunts deer and boar with a javelin.' },
  scout:    { name: 'Scout',     cls: 'civ', tick: 'scout', tags: ['civ', 'mounted'], hp: 45, spd: 36, sight: 220, dmg: 3, rng: 12, cd: 1.5, cost: { f: 80 }, t: 12, at: 'keep', age: 0, look: 'scout', desc: 'A fast rider. Tours the map and picks up any treasure nobody guards. Tap the map to send it.' },
  envoy:    { name: 'Emissary',  cls: null,  tick: 'envoy', tags: ['civ'], hp: 20, spd: 36, sight: 100, cost: { g: 40 }, t: 0, age: 1, look: 'envoy', desc: 'Carries your offer of peace or alliance to another side. Killing one is an act of war.' },
  caravan:  { name: 'Caravan',   cls: 'civ', tick: 'caravan', tags: ['civ'], hp: 40, spd: 16, sight: 100, cost: { w: 80, f: 40 }, t: 14, at: 'market', age: 1, look: 'caravan', desc: 'An ox cart: about two thirds of walking pace. With no route it runs between your Markets for gold, the farther the more. Give it a route on its card and it carries goods from your Business Center to a Market or a trade stop. Robbers come for it near their camps.' },
  spy:      { name: 'Spy',       cls: 'army', tick: 'spy', tags: ['civ'], hp: 20, spd: 24, sight: 120, cost: { f: 30, g: 60 }, t: 12, at: 'courthouse', age: 1, stealth: [45, 140], look: 'spy', desc: 'Hidden: soldiers see it only within 45, towers, the Town Center and Courthouses within 140. Near an enemy building it reads their stores, age, research and army. Sent to sabotage, it is used up.' },
  priest:   { name: 'Priest',    cls: 'army', tick: 'priest', tags: ['civ'], hp: 30, spd: 24, sight: 120, cost: { f: 40, g: 60 }, t: 14, at: 'temple', age: 1, look: 'priest', desc: 'Does not fight. Walks with the army so you can call Zeal, and takes holy sites: stand it at a shrine for 10 s and the shrine pays you gold.' },
  medic:    { name: 'Medic',     cls: 'army', tick: 'medic', tags: ['civ'], hp: 30, spd: 24, sight: 120, heal: 3, hrng: 55, cost: { f: 40, g: 40 }, t: 12, at: 'hospital', age: 2, look: 'medic', desc: 'Walks with the army and binds wounds: soldiers within 55 heal 3 health a second. Keep it behind the line.' },
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
  wayfarer: { name: 'Wayfarer',  tick: 'wayfarer', tags: ['civ'], hp: 30, spd: 22, sight: 60, joins: 1, look: 'wayfarer', desc: 'A traveller looking for a place to settle. The first side to meet him gains a villager.' },
  wagon:    { name: 'Wagon train', tick: 'wayfarer', tags: ['civ'], hp: 60, spd: 16, sight: 60, joins: 3, look: 'caravan', desc: 'Settlers with everything they own. They join whoever reaches them first: three villagers.' },
  bison:    { name: 'Bison',     tick: 'herd', tags: ['animal'], hp: 120, spd: 70, sight: 60, meat: 400, trample: 6, look: 'bison', desc: 'A herd on the move tramples fields and anyone in its path. Good meat, if you can bring one down.' },
  performer:{ name: 'Performer', tick: 'herd', tags: ['civ'], hp: 30, spd: 20, sight: 60, cheer: 150, look: 'performer', desc: 'A travelling show. Villagers who see it pass work a little harder for a while.' },
  vagabond: { name: 'Vagabond',  tick: 'wild', tags: ['civ'], hp: 30, spd: 20, sight: 40, passive: true, look: 'vagabond', desc: 'Drifters by a fire. They will fight for whoever pays.' },
  // the fantasy toggle swaps the guards for these
  direwolf: { name: 'Dire wolf', tick: 'wild', tags: ['animal'], hp: 90, spd: 42, sight: 120, dmg: 9, rng: 10, cd: 1.1, fantasy: true, look: 'direwolf', desc: 'A wolf the size of a pony.' },
  goblin:   { name: 'Goblin',    tick: 'wild', tags: ['infantry'], hp: 40, spd: 30, sight: 120, dmg: 5, rng: 12, cd: 1.0, fantasy: true, look: 'goblin', desc: 'Small, quick and greedy.' },
  skeleton: { name: 'Skeleton',  tick: 'wild', tags: ['infantry'], hp: 50, spd: 22, sight: 110, dmg: 6, rng: 12, cd: 1.3, fantasy: true, rarmor: 0.5, look: 'skeleton', desc: 'The dead guard their graves. Arrows pass through the ribs.' },
  troll:    { name: 'Troll',     tick: 'wild', tags: ['infantry', 'heavy'], hp: 320, spd: 22, sight: 130, dmg: 18, rng: 14, cd: 2.2, fantasy: true, raid: 200, look: 'troll', desc: 'Lives under the robbers\' bridge. Hits like a ram.' },
  native:   { name: 'Warrior',   tick: 'sol', tags: ['infantry', 'spear', 'native'], hp: 55, spd: 32, sight: 140, dmg: 6, rng: 12, cd: 1.1, vs: { mounted: 2.5 }, look: 'native', desc: 'The Throne\'s own guard: light, swift and many. A spear and a hide shield, and the ground on their side.' },
  nativebow:{ name: 'Bowman',    tick: 'sol', tags: ['infantry', 'archer', 'ranged', 'native'], hp: 36, spd: 32, sight: 160, dmg: 5, rng: 85, cd: 1.3, vs: { infantry: 1.3 }, look: 'nativebow', desc: 'The Throne\'s archers, on the walls and at the causeways.' },
  dragon:   { name: 'Dragon',    tick: 'herd', tags: ['animal'], hp: 900, spd: 90, sight: 200, fantasy: true, scorch: 30, look: 'dragon', desc: 'Passes over now and then. What it flies over, burns.' },
};
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
const VASSAL = { r: 450, garrison: 0.5, garrisonMax: 15, kill: 1, protectMax: 20, decay: 0.98, gift: 60, share: 0.25, shareAt: 50, giftAt: 60, rise: 0.3, crushed: 0.25, freeAfter: 240, reign: 300 };
const VENTURE = { age: 3, back: 1.4, lost: 0.2, max: 3, sizes: [100, 250, 500] };
const PRICE = { hit: 0.004, floor: 0.5, cap: 2.5, drift: 0.02 };   // each unit sold lowers the price 0.4%, bought raises it; prices drift 2% back toward normal every 10 s   // a caravan carries 20 goods
// Buildings. fp = squares a side (10 units each). h = how tall it stands. room = people it shelters.
// sab: what a spy does to it (burn: loses 60% health; stall: stops 40 s and loses the job in hand). No sab: too well guarded.
const BLD = {
  keep:      { shelter: 8, name: 'Town Center', fp: 5, hp: 2400, h: 34, sight: 200, dmg: 7, rng: 130, cd: 1.0, drop: [...RES, ...GOODK], room: 5, desc: 'Your seat. Trains villagers and scouts, advances the age and sends emissaries. Shoots nearby enemies; villagers who shelter inside add their arrows. If it falls, you lose.' },
  house:     { nocap: 1, invest: 1, name: 'House', fp: 2, hp: 200, h: 16, cost: { w: 30 }, t: 12, age: 0, room: 5, repeat: true, sab: 'burn', wood: true, desc: 'Shelter for five more people.' },
  farm:      { cap: [6, 9, 12, 15, 18], invest: 2, name: 'Farm', fp: 3, slots: 3, hp: 120, h: 1, cost: { w: 60 }, t: 10, age: 0, crop: 'food', rate: 0.7, walk: true, repeat: true, sab: 'burn', desc: 'Wheat, for food. Up to three villagers work it. Barely grows in winter; best at harvest. Soil tires when worked year after year and recovers when the field rests.' },
  treefarm:  { cap: [6, 9, 12, 15, 18], name: 'Tree farm', fp: 3, slots: 3, hp: 120, h: 1, cost: { w: 80 }, t: 12, age: 0, crop: 'wood', reserve: 500, rate: 0.55, walk: true, repeat: true, sab: 'burn', desc: 'A coppice plot: 500 wood, then it is cut out and must regrow, so you plant another. Up to three villagers tend it. Slower than a wild forest, but safe at home.' },
  mill:      { cap: [3, 3, 3, 3, 3], name: 'Mill', fp: 3, hp: 250, h: 18, cost: { w: 80 }, t: 15, age: 0, drop: ['food'], sab: 'burn', wood: true, desc: 'Drop-off for food. Put it by berries, fields or game.' },
  lumber:    { cap: [4, 4, 4, 4, 4], short: 'Lumber', name: 'Lumber camp', fp: 3, hp: 250, h: 14, cost: { w: 80 }, t: 15, age: 0, drop: ['wood'], sab: 'burn', wood: true, desc: 'Drop-off for wood. Put it by a forest.' },
  mining:    { cap: [4, 4, 4, 4, 4], name: 'Mine', fp: 3, hp: 250, h: 14, cost: { w: 80 }, t: 15, age: 0, drop: ['stone', 'gold', 'iron'], sab: 'burn', desc: 'Drop-off for stone, gold and iron. Put it by a quarry, a gold seam or an iron vein.' },
  barracks:  { cap: [1, 2, 2, 3, 3], armyRoom: 8, name: 'Barracks', fp: 4, hp: 450, h: 22, cost: { w: 150 }, t: 25, age: 0, sab: 'stall', wood: true, desc: 'Trains the foot: spearmen, then swordsmen.' },
  wall:      { nocap: 1, name: 'Wall', fp: 1, hp: 100, h: 18, cost: { s: 5 }, t: 10, age: 0, wallish: true, desc: 'One square of stone. It blocks everyone, you too: leave a Gate. Drag to draw a line of them.' },
  pit:       { nocap: 1, name: 'Pit', fp: 1, hp: 60, h: 0, cost: { w: 20 }, t: 8, age: 1, trap: 'pit', walk: true, desc: 'A hidden pit: a foe who steps in is hurt and stuck. Your people walk round it. An enemy scout finds it.' },
  net:       { nocap: 1, name: 'Net', fp: 1, hp: 60, h: 0, t: 8, age: 0, trap: 'net', walk: true, desc: 'A hidden net on the causeway, the Natives\' own: a man who steps in is taken prisoner.' },
  stakes:    { nocap: 1, name: 'Stakes', fp: 1, hp: 60, h: 0, cost: { w: 30 }, t: 8, age: 1, trap: 'stakes', walk: true, desc: 'Sharpened stakes hidden in the grass: a foe who runs onto them is hurt, horses worst. Your people walk round them.' },
  gate:      { nocap: 1, name: 'Gate', fp: 1, hp: 150, h: 18, cost: { s: 10, w: 10 }, t: 12, age: 0, wallish: true, repeat: true, wood: true, desc: 'A gap in your wall. Your people, your allies and anyone at peace with you walk through. Enemies have to break it.' },
  tower:     { cap: [3, 4, 6, 8, 8], invest: 6, shelter: 5, name: 'Tower', fp: 2, hp: 500, h: 44, cost: { s: 100, w: 40 }, t: 25, age: 0, sight: 220, dmg: 10, rng: 140, cd: 1.2, desc: 'Shoots enemies in range and sounds the horn. Up to 5 villagers shelter inside and each adds an arrow.' },
  range:     { cap: [1, 2, 2, 3, 3], armyRoom: 8, short: 'Range', name: 'Archery range', fp: 4, hp: 400, h: 20, cost: { w: 150 }, t: 25, age: 1, sab: 'stall', wood: true, desc: 'Trains archers and javelineers, later crossbowmen.' },
  stable:    { cap: [1, 2, 2, 3, 3], armyRoom: 8, name: 'Stable', fp: 4, hp: 450, h: 22, cost: { w: 175 }, t: 25, age: 1, sab: 'stall', wood: true, desc: 'Trains chariots, then cataphracts, horse archers and war elephants.' },
  smith:     { name: 'Smithy', fp: 3, hp: 400, h: 20, cost: { w: 120 }, t: 25, age: 1, sab: 'stall', desc: 'Researches weapons and armour for your soldiers, and defences for your walls.' },
  market:    { invest: 10, name: 'Market', fp: 3, hp: 350, h: 18, cost: { w: 150, s: 50 }, t: 25, age: 0, drop: GOODK, sab: 'stall', wood: true, desc: 'Swap 100 of a resource for gold or gold for a resource, and sell goods. Stores your goods and loads your caravans: give a caravan a route and it carries goods to a trade stop. Prices rise and fall with what everyone buys and sells. From the Medieval age it takes ventures.' },
  school:    { name: 'School', fp: 3, hp: 350, h: 22, cost: { w: 120, s: 50 }, t: 25, age: 1, sab: 'stall', desc: 'Reading, writing and numbers. Researches Writing and Mathematics.' },
  temple:    { armyRoom: 3, name: 'Temple', fp: 4, hp: 600, h: 34, cost: { s: 300, g: 150, w: 100 }, t: 45, age: 1, sab: 'stall', desc: 'Very costly. Trains priests, who take holy sites, and lets you call Zeal on a battalion.' },
  courthouse:{ armyRoom: 3, name: 'Courthouse', fp: 3, hp: 450, h: 24, cost: { w: 150, g: 60 }, t: 30, age: 1, spyonly: true, dmg: 12, rng: 140, cd: 1.5, desc: 'Written law and the watch. Trains spies, and its guards shoot enemy spies within 140. Nothing else.' },
  apartment: { nocap: 1, name: 'Apartment', fp: 3, hp: 500, h: 30, cost: { w: 100, s: 50 }, t: 30, age: 2, room: 20, sab: 'burn', desc: 'A tall block with room for twenty more people. Costs stone, and a bigger target than a house.' },
  hospital:  { armyRoom: 3, name: 'Hospital', fp: 3, hp: 400, h: 20, cost: { w: 150, s: 100 }, t: 30, age: 2, heal: 3, hrng: 90, sab: 'burn', desc: 'Heals your soldiers within 90, 3 health a second, and trains medics who heal in the field.' },
  library:   { name: 'Library', name3: 'University', fp: 4, hp: 450, h: 26, cost: { w: 200, s: 150, g: 50 }, t: 40, age: 2, sab: 'stall', desc: 'Scholars together: researches Architecture, Roads and Medicine. In the Medieval age it is a University.' },
  siege:     { cap: [1, 2, 2, 3, 3], armyRoom: 8, short: 'Siege', name: 'Siege workshop', fp: 4, hp: 450, h: 22, cost: { w: 250, s: 100 }, t: 30, age: 2, sab: 'stall', desc: 'Builds rams, siege towers, catapults and ballistae, later trebuchets.' },
  aqueduct:  { nocap: 1, name: 'Aqueduct', fp: 3, hp: 600, h: 28, cost: { s: 250, w: 150 }, t: 40, age: 2, room: 15, sab: 'burn', desc: 'Water for a city: room for fifteen more people.' },
  dock:      { cap: [2, 2, 2, 2, 2], name: 'Dock', fp: 2, hp: 200, h: 6, cost: { w: 100 }, t: 15, age: 0, shore: true, drop: ['food'], sab: 'burn', wood: true, desc: 'Stands on a shore. Villagers on Food fish from it and bring the catch here. No dock, no fishing.' },
  town:      { cap: [0, 0, 1, 2, 2], invest: 15, shelter: 6, short: 'Town', name: 'Town Center', fp: 4, hp: 1800, h: 30, cost: { w: 400, s: 300, f: 200 }, t: 60, age: 2, sight: 180, dmg: 6, rng: 120, cd: 1.2, drop: [...RES, ...GOODK], room: 5, desc: 'A second town: trains villagers, takes every drop-off, shoots and shelters villagers. Losing it does not lose the game; losing your first does.' },
  castle:    { cap: [0, 0, 0, 1, 2], armyRoom: 10, invest: 20, shelter: 10, name: 'Castle', fp: 5, hp: 3200, h: 40, cost: { s: 900, w: 300 }, t: 90, age: 3, sight: 240, dmg: 12, rng: 170, cd: 1.0, desc: 'A stone castle: the strongest building there is. Shoots far and shelters ten villagers who add their arrows. Built in a vassal\'s lands, it keeps them safe and loyal.' },
  pasture:   { cap: [2, 3, 4, 4, 4], invest: 2, name: 'Pasture', fp: 3, hp: 120, h: 1, cost: { w: 60, f: 60 }, t: 10, age: 0, crop: 'wool', reserve: 0, rate: 1.5, walk: true, sheep: 6, milk: 0.03, sab: 'burn', desc: 'A fenced flock. While a shepherd tends it every sheep gives milk and meat: food straight to your stores. Sheep are shorn in spring, and the wool waits for a Weaver; lambs come in spring (up to 12). Wolves take sheep.' },
  council:   { invest: 6, short: 'Council', name: 'War Council', fp: 3, hp: 600, h: 22, cost: { w: 200, s: 150, g: 50 }, t: 35, age: 2, sab: 'stall', desc: 'Where your generals plan. Research Engagement, then Battalions, then Formations, then in the Gunpowder age Muster.' },
  tpost:     { nocap: 1, invest: 6, name: 'Trade post', fp: 2, hp: 300, h: 20, cost: { w: 100, s: 30 }, t: 20, age: 1, atStop: true, sight: 140, dmg: 5, rng: 120, cd: 1.6, sab: 'burn', desc: 'Built on a trade stop once its guards are gone. You own the stop: a cut of everyone else\'s sales there, 20% for one stop of its route up to 40% for all four; all four of a route also pay gold every second. Up to 12 soldiers can garrison it.' },
  // Workshops turn what is in store into something else; one villager works each. makes: what it can make, from what, how fast; the card picks which.
  workshop:  { name: 'Workshop', fp: 3, hp: 250, h: 16, cost: { w: 120, s: 30 }, t: 20, age: 1, crop: 'cloth', makes: { cloth: { from: { wool: 2 }, rate: 0.12 }, beer: { from: { f: 3 }, rate: 0.15 } }, drop: ['wool'], sab: 'burn', wood: true, desc: 'Spins and weaves wool into cloth (2 wool make 1), or brews ale from your grain (3 food make 1 beer): goods to trade. One villager works it; the card picks what it makes.' },
  mint:      { cap: [0, 0, 0, 1, 1], invest: 6, name: 'Mint', fp: 3, hp: 500, h: 22, cost: { s: 300, g: 200 }, t: 45, age: 3, crop: 'gold', makes: { gold: { from: { s: 3 }, rate: 0.2 } }, fx: [{ s: 'gather', k: 'gold', m: 1.15 }], sab: 'stall', desc: 'Strikes coin from the silver in your stone: 3 stone make 1 gold, and gold gathered pays 15% more. Or debase the coin, once: a heap of gold now, and dearer prices at your Market for the rest of the game.' },
  foundry:   { cap: [0, 0, 0, 1, 2], name: 'Foundry', fp: 3, hp: 500, h: 24, cost: { s: 250, w: 150 }, t: 40, age: 3, crop: 'iron', makes: { iron: { from: { w: 3 }, rate: 0.2 } }, sab: 'stall', desc: 'Smelts iron from bog ore with charcoal: 3 wood make 1 iron. One villager works it. Iron in-house, without a vein.' },
  quarry:    { cap: [0, 0, 2, 3, 3], name: 'Quarry', fp: 3, slots: 2, hp: 150, h: 1, cost: { w: 80 }, t: 15, age: 2, crop: 'stone', rate: 0.45, walk: true, sab: 'burn', desc: 'Cut stone from the bedrock, anywhere: two villagers work it, slower than a quarry face in the hills, but it never runs out.' },
  throne:    { nocap: 1, name: 'Throne', fp: 6, hp: 3600, h: 56, sight: 260, dmg: 8, rng: 180, cd: 1.5, shelter: 12, drop: [], desc: 'The old citadel in the middle of the world. Whoever holds it takes a tithe of everyone else\'s gathering and climbs the score; hold it long enough and the game is won. It is taken, not broken: break it down and it is yours at a third of its strength.' },
  wonder:    { name: 'Wonder', fp: 6, hp: 4000, h: 60, cost: { f: 1500, w: 1500, s: 1500, g: 1500 }, t: 240, age: 2, one: true, desc: 'Your civilisation\'s great work. When it is finished every side is told, and if it still stands 8 minutes later, you win.' },
};
const WONDER_HOLD = 480;
const QUEUE = 5;   // orders a building holds in its line, before Written records and Guilds
const MINT = { debase: 600, price: 1.3 };   // debasing: gold at once, and every Market price multiplied for the rest of the game
const NOTICE = 30;   // seconds between declaring a side hostile and the first blow: no ambush from peace
// what a lord may ask of a vassal: a demand of one resource (loyalty cost grows with each demand in the last two minutes), forced tribute
// (double tax for a spell, only with soldiers at their town), a levy of their soldiers (their dead cost loyalty)
const DEMAND = { amt: 100, loyal: 5, recent: 120, tribute: 180, tributeMen: 8, tributeUnrest: 10, levyLoyal: 2, levyMax: 0.5 };
// Each building's limits sit on the building itself: cap (how many in each age, Stone … Gunpowder; not listed: one), nocap (room and stone bound it),
// armyRoom (soldiers it makes room for, once built; research adds more), invest (loyalty for a vassal within 450 of it; others: 3), shelter (arrows villagers add inside it).
const ARMY_ADDS = 'A barracks, range or stable adds 8';   // what to do about a full army, said wherever the limit bites
const TRAINERS = new Set(['keep', ...Object.values(UNIT).flatMap(U => U.at ? [U.at, ...(U.also || [])] : [])]);   // buildings that send people out keep a free square round them; the rest may touch

// The build menus. "soon" is on the list but not built: it stays visible until built or deliberately dropped (and logged).
const MENUS = [
  { id: 'home', name: 'Home',     blurb: 'room to live',                   items: ['house', 'apartment', 'aqueduct', 'town'] },
  { id: 'land', name: 'Land',     blurb: 'food, wood, stone, gold',        items: ['farm', 'pasture', 'treefarm', 'quarry', 'mill', 'dock', 'lumber', 'mining'] },
  { id: 'mil',  name: 'War',      blurb: 'where soldiers are trained',      items: ['barracks', 'range', 'stable', 'siege', 'smith', 'council'] },
  { id: 'def',  name: 'Walls',    blurb: 'towers, walls and gates',         items: ['tower', 'castle', 'wall', 'gate', 'pit', 'stakes'] },
  { id: 'shop', name: 'Trade',    blurb: 'markets, goods and caravans',       items: ['market', 'workshop', 'mint', 'foundry'] },
  { id: 'cult', name: 'Culture',  blurb: 'faith, law, learning, wonders', items: ['school', 'library', 'hospital', 'temple', 'courthouse', 'wonder'] },
];

// Research. fx: what it changes, by stat; k narrows it (a resource, a unit kind or #tag, a building kind or #wallish).
// m multiplies, a adds, min keeps the lowest (armour does not stack). tier: upgrades a unit in place and renames it.
// Research, from history. line: the steps of a line come one after another, only the next shows; w: how much the step changed the world, 1-10, which sets its cost and time; when: the date, in the book; need: other steps it waits on.
const TECH = [
  { id: 'hafting', name: 'Hafted axes', at: 'lumber', line: 'Felling', age: 0, w: 5, when: '6000 BC', cost: { f: 50, w: 40 }, t: 18, fx: [{ s: 'gather', k: 'wood', m: 1.1 }], desc: 'Wood comes in 10% faster.' },
  { id: 'axes', name: 'Bronze axes', at: 'lumber', line: 'Felling', age: 1, w: 5, when: '3000 BC', cost: { f: 100, w: 70 }, t: 28, fx: [{ s: 'gather', k: 'wood', m: 1.15 }], desc: 'Wood comes in 15% faster.' },
  { id: 'ironaxe', name: 'Iron axes', at: 'lumber', line: 'Felling', age: 2, w: 6, when: '1000 BC', cost: { f: 180, w: 120 }, t: 41, fx: [{ s: 'gather', k: 'wood', m: 1.15 }], need: ['iron'], desc: 'Wood comes in 15% faster.' },
  { id: 'sawpits', name: 'Saw pits', at: 'lumber', line: 'Felling', age: 2, w: 3, when: 'Roman', cost: { f: 130, w: 90 }, t: 32, fx: [{ s: 'gather', k: 'wood', m: 1.1 }], desc: 'Wood comes in 10% faster.' },
  { id: 'twosaw', name: 'Crosscut saw', at: 'lumber', line: 'Felling', age: 3, w: 4, when: '1400s', cost: { f: 240, w: 160 }, t: 48, fx: [{ s: 'gather', k: 'wood', m: 1.15 }], desc: 'Wood comes in 15% faster.' },
  { id: 'sawmill', name: 'Sawmill', at: 'lumber', line: 'Felling', age: 4, w: 7, when: '1500s', cost: { f: 470, w: 310 }, t: 77, fx: [{ s: 'crop', k: 'wood', m: 1.3 }], need: ['windmill'], desc: 'Tree farms give 30% more.' },
  { id: 'coppice', name: 'Coppicing', at: 'lumber', line: 'Woodland', age: 0, w: 4, when: '4000 BC', cost: { f: 50, w: 30 }, t: 17, fx: [{ s: 'crop', k: 'wood', m: 1.25 }], desc: 'Tree farms give 25% more.' },
  { id: 'pollard', name: 'Pollarding', at: 'lumber', line: 'Woodland', age: 1, w: 2, when: 'Bronze age', cost: { f: 70, w: 50 }, t: 21, fx: [{ s: 'crop', k: 'wood', m: 1.1 }], desc: 'Tree farms give 10% more.' },
  { id: 'forestry', name: 'Forest law', at: 'lumber', line: 'Woodland', age: 3, w: 4, when: '1100s', cost: { f: 240, w: 160 }, t: 48, fx: [{ s: 'limit', k: 'treefarm', a: 2 }], desc: 'Two more tree farms.' },
  { id: 'plantation', name: 'Plantations', at: 'lumber', line: 'Woodland', age: 4, w: 4, when: '1600s', cost: { f: 350, w: 230 }, t: 61, fx: [{ s: 'crop', k: 'wood', m: 1.2 }], desc: 'Tree farms give 20% more.' },
  { id: 'timber', name: 'Timber framing', at: 'lumber', line: 'Carpentry', age: 1, w: 5, when: '2000 BC', cost: { f: 100, w: 70 }, t: 28, fx: [{ s: 'room', k: 'house', a: 1 }], desc: 'Houses hold one more.' },
  { id: 'charcoal', name: 'Charcoal burning', at: 'lumber', line: 'Carpentry', age: 2, w: 5, when: '1000 BC', cost: { f: 170, w: 110 }, t: 38, fx: [{ s: 'make', k: 'iron', m: 1.15 }], desc: 'Foundries make 15% more iron.' },
  { id: 'carts', name: 'Wagons', at: 'lumber', line: 'Carpentry', age: 3, w: 5, when: '1000s', cost: { f: 260, w: 180 }, t: 52, fx: [{ s: 'carry', a: 3 }], desc: 'Villagers carry 3 more.' },
  { id: 'logdrive', name: 'Log driving', at: 'lumber', line: 'Carpentry', age: 4, w: 3, when: '1500s', cost: { f: 310, w: 210 }, t: 55, fx: [{ s: 'crop', k: 'wood', m: 1.15 }], desc: 'Tree farms give 15% more.' },
  { id: 'sickles', name: 'Sickles', at: 'mill', line: 'Harvest', age: 0, w: 5, when: '9000 BC', cost: { f: 50, w: 40 }, t: 18, fx: [{ s: 'gather', k: 'food', m: 1.1 }], desc: 'Fields and bushes yield 10% faster.' },
  { id: 'threshing', name: 'Threshing sledge', at: 'mill', line: 'Harvest', age: 1, w: 3, when: '6000 BC', cost: { f: 80, w: 50 }, t: 24, fx: [{ s: 'gather', k: 'food', m: 1.1 }], desc: 'Fields yield 10% faster.' },
  { id: 'plough', name: 'Plough', at: 'mill', line: 'Harvest', age: 1, w: 9, when: '3500 BC', cost: { f: 140, w: 100 }, t: 37, fx: [{ s: 'gather', k: 'food', m: 1.2 }], desc: 'Fields yield 20% faster.' },
  { id: 'noria', name: 'Water wheel', at: 'mill', line: 'Harvest', age: 2, w: 6, when: '300 BC', cost: { f: 180, w: 120 }, t: 41, fx: [{ s: 'crop', k: 'food', m: 1.1 }], desc: 'Farms give 10% more.' },
  { id: 'horsecollar', name: 'Horse collar', at: 'mill', line: 'Harvest', age: 3, w: 7, when: '900s', cost: { f: 320, w: 210 }, t: 60, fx: [{ s: 'gather', k: 'food', m: 1.15 }], need: ['horses'], desc: 'Fields yield 15% faster.' },
  { id: 'heavyplough', name: 'Heavy plough', at: 'mill', line: 'Harvest', age: 3, w: 8, when: '1000s', cost: { f: 340, w: 230 }, t: 64, fx: [{ s: 'crop', k: 'food', m: 1.15 }], desc: 'Farms give 15% more.' },
  { id: 'windmill', name: 'Windmill', at: 'mill', line: 'Harvest', age: 4, w: 6, when: '1180s', cost: { f: 430, w: 290 }, t: 71, fx: [{ s: 'crop', k: 'food', m: 1.1 }], desc: 'Farms give 10% more.' },
  { id: 'seeddrill', name: 'Seed drill', at: 'mill', line: 'Harvest', age: 4, w: 6, when: '1701', cost: { f: 430, w: 290 }, t: 71, fx: [{ s: 'crop', k: 'food', m: 1.15 }], desc: 'Farms give 15% more.' },
  { id: 'seedstore', name: 'Seed selection', at: 'mill', line: 'Soil', age: 0, w: 6, when: '8000 BC', cost: { f: 60, w: 40 }, t: 19, fx: [{ s: 'soil', a: 0.1 }], desc: 'Soil tires less.' },
  { id: 'manure', name: 'Manuring', at: 'mill', line: 'Soil', age: 1, w: 4, when: '2000 BC', cost: { f: 90, w: 60 }, t: 26, fx: [{ s: 'soil', a: 0.1 }], desc: 'Soil tires less.' },
  { id: 'irrigation', name: 'Irrigation', at: 'mill', line: 'Soil', age: 2, w: 7, when: '3000 BC', cost: { f: 200, w: 130 }, t: 44, fx: [{ s: 'soil', a: 0.15 }], desc: 'Soil tires less still.' },
  { id: 'rotation', name: 'Crop rotation', at: 'mill', line: 'Soil', age: 3, w: 8, when: '800s', cost: { f: 340, w: 230 }, t: 64, fx: [{ s: 'crop', k: 'food', m: 1.2 }, { s: 'limit', k: 'farm', a: 3 }], desc: 'Farms give 20% more; three more farms.' },
  { id: 'enclosure', name: 'Enclosure', at: 'mill', line: 'Soil', age: 4, w: 5, when: '1500s', cost: { f: 390, w: 260 }, t: 66, fx: [{ s: 'limit', k: 'farm', a: 3 }], desc: 'Three more farms.' },
  { id: 'potato', name: 'New World crops', at: 'mill', line: 'Soil', age: 4, w: 8, when: '1570s', cost: { f: 510, w: 340 }, t: 82, fx: [{ s: 'crop', k: 'food', m: 1.2 }], need: ['deepboats'], desc: 'Farms give 20% more.' },
  { id: 'ovens', name: 'Bread ovens', at: 'mill', line: 'Stores', age: 1, w: 4, when: '3000 BC', cost: { f: 90, w: 60 }, t: 26, fx: [{ s: 'crop', k: 'food', m: 1.1 }], desc: 'Farms give 10% more.' },
  { id: 'granary', name: 'Stone granary', at: 'mill', line: 'Stores', age: 1, w: 6, when: '2500 BC', cost: { f: 110, w: 70 }, t: 30, fx: [{ s: 'plague', m: 0.5 }], need: ['masonry'], desc: 'Plague spreads half as fast.' },
  { id: 'wheelbarrow', name: 'Wheelbarrow', at: 'mill', line: 'Stores', age: 3, w: 4, when: '1100s', cost: { f: 240, w: 160 }, t: 48, fx: [{ s: 'carry', a: 5 }], desc: 'Villagers carry 5 more.' },
  { id: 'picks', name: 'Antler picks', at: 'mining', line: 'Digging', age: 0, w: 4, when: '4000 BC', cost: { f: 50, s: 30 }, t: 17, fx: [{ s: 'gather', k: 'stone', m: 1.2 }, { s: 'gather', k: 'gold', m: 1.2 }], desc: 'Stone and gold come in 20% faster.' },
  { id: 'firesetting', name: 'Fire-setting', at: 'mining', line: 'Digging', age: 1, w: 4, when: '3000 BC', cost: { f: 90, s: 60 }, t: 26, fx: [{ s: 'gather', k: 'stone', m: 1.1 }, { s: 'gather', k: 'gold', m: 1.1 }], desc: 'Stone and gold come in 10% faster.' },
  { id: 'deep', name: 'Deep shafts', at: 'mining', line: 'Digging', age: 2, w: 5, when: '500 BC', cost: { f: 170, s: 110 }, t: 38, fx: [{ s: 'gather', k: 'stone', m: 1.2 }, { s: 'gather', k: 'gold', m: 1.2 }], desc: 'Stone and gold come in 20% faster.' },
  { id: 'pumps', name: 'Mine pumps', at: 'mining', line: 'Digging', age: 3, w: 5, when: '1400s', cost: { f: 260, s: 180 }, t: 52, fx: [{ s: 'gather', k: 'stone', m: 1.15 }, { s: 'gather', k: 'gold', m: 1.15 }, { s: 'gather', k: 'iron', m: 1.15 }], desc: 'Every ore comes in 15% faster.' },
  { id: 'rails', name: 'Mine wagons', at: 'mining', line: 'Digging', age: 4, w: 4, when: '1500s', cost: { f: 350, s: 230 }, t: 61, fx: [{ s: 'carry', a: 3 }], desc: 'Villagers carry 3 more.' },
  { id: 'blasting', name: 'Blasting', at: 'mining', line: 'Digging', age: 4, w: 7, when: '1627', cost: { f: 470, s: 310 }, t: 77, fx: [{ s: 'gather', k: 'stone', m: 1.25 }, { s: 'gather', k: 'iron', m: 1.25 }], need: ['corned'], desc: 'Stone and iron come in 25% faster.' },
  { id: 'masonry', name: 'Masonry', at: 'mining', line: 'Building', age: 1, w: 7, when: '2600 BC', cost: { f: 120, s: 80 }, t: 32, fx: [{ s: 'bhp', k: '*', m: 1.3 }], desc: 'Buildings are 30% tougher.' },
  { id: 'brick', name: 'Fired brick', at: 'mining', line: 'Building', age: 2, w: 5, when: '3000 BC', cost: { f: 170, s: 110 }, t: 38, fx: [{ s: 'room', k: 'house', a: 1 }, { s: 'room', k: 'apartment', a: 4 }], desc: 'Houses hold 1 more, apartments 4.' },
  { id: 'ventilation', name: 'Ventilation', at: 'mining', line: 'Building', age: 4, w: 3, when: '1500s', cost: { f: 310, s: 210 }, t: 55, fx: [{ s: 'gather', k: 'iron', m: 1.2 }], desc: 'Iron comes in 20% faster.' },
  { id: 'wedges', name: 'Iron wedges', at: 'quarry', line: 'Cutting', age: 2, w: 4, when: '500 BC', cost: { w: 150, i: 100 }, t: 35, fx: [{ s: 'crop', k: 'stone', m: 1.2 }], need: ['iron'], desc: 'Quarries give 20% more.' },
  { id: 'chisels', name: 'Steel chisels', at: 'quarry', line: 'Cutting', age: 3, w: 3, when: '1200s', cost: { w: 210, i: 140 }, t: 44, fx: [{ s: 'crop', k: 'stone', m: 1.15 }], desc: 'Quarries give 15% more.' },
  { id: 'stonesaw', name: 'Stone saws', at: 'quarry', line: 'Cutting', age: 4, w: 4, when: '1500s', cost: { w: 350, i: 230 }, t: 61, fx: [{ s: 'crop', k: 'stone', m: 1.2 }], need: ['sawmill'], desc: 'Quarries give 20% more.' },
  { id: 'rollers', name: 'Rollers and sledges', at: 'quarry', line: 'Hauling', age: 2, w: 3, when: '2500 BC', cost: { w: 130, i: 90 }, t: 32, fx: [{ s: 'carry', a: 2 }], desc: 'Villagers carry 2 more.' },
  { id: 'cranes', name: 'Treadwheel crane', at: 'quarry', line: 'Hauling', age: 3, w: 6, when: '1200s', cost: { w: 290, i: 190 }, t: 56, fx: [{ s: 'crop', k: 'stone', m: 1.2 }], desc: 'Quarries give 20% more.' },
  { id: 'fishtraps', name: 'Fish traps', at: 'dock', line: 'Fishing', age: 0, w: 3, when: '8000 BC', cost: { w: 40, f: 30 }, t: 15, fx: [{ s: 'gather', k: 'fish', m: 1.15 }], desc: 'Fish come in 15% faster.' },
  { id: 'nets', name: 'Nets', at: 'dock', line: 'Fishing', age: 1, w: 5, when: '6000 BC', cost: { w: 100, f: 70 }, t: 28, fx: [{ s: 'gather', k: 'fish', m: 1.3 }], desc: 'Fish come in 30% faster.' },
  { id: 'salting', name: 'Salting', at: 'dock', line: 'Fishing', age: 2, w: 5, when: '300 BC', cost: { w: 170, f: 110 }, t: 38, fx: [{ s: 'gather', k: 'fish', m: 1.2 }], desc: 'Fish come in 20% faster.' },
  { id: 'deepboats', name: 'Decked boats', at: 'dock', line: 'Fishing', age: 3, w: 6, when: '1300s', cost: { w: 290, f: 190 }, t: 56, fx: [{ s: 'gather', k: 'fish', m: 1.3 }], desc: 'Fish come in 30% faster.' },
  { id: 'trawl', name: 'Trawl nets', at: 'dock', line: 'Fishing', age: 4, w: 4, when: '1376', cost: { w: 350, f: 230 }, t: 61, fx: [{ s: 'gather', k: 'fish', m: 1.2 }], desc: 'Fish come in 20% faster.' },
  { id: 'dugouts', name: 'Dugout canoes', at: 'dock', line: 'Harbour', age: 0, w: 4, when: '8000 BC', cost: { w: 50, f: 30 }, t: 17, fx: [{ s: 'gather', k: 'fish', m: 1.1 }], desc: 'Fish come in 10% faster.' },
  { id: 'sails', name: 'Sails', at: 'dock', line: 'Harbour', age: 1, w: 7, when: '3000 BC', cost: { w: 120, f: 80 }, t: 32, fx: [{ s: 'gather', k: 'fish', m: 1.15 }], desc: 'Fish come in 15% faster.' },
  { id: 'harbours', name: 'Harbour works', at: 'dock', line: 'Harbour', age: 2, w: 5, when: '300 BC', cost: { w: 170, f: 110 }, t: 38, fx: [{ s: 'bhp', k: 'dock', m: 1.5 }], need: ['masonry'], desc: 'Docks are 50% tougher.' },
  { id: 'compass', name: 'Compass', at: 'dock', line: 'Harbour', age: 3, w: 7, when: '1100s', cost: { w: 320, f: 210 }, t: 60, fx: [{ s: 'sight', k: '#civ', a: 30 }], desc: 'Villagers, scouts and caravans see farther.' },
  { id: 'lighthouse', name: 'Lighthouse', at: 'dock', line: 'Harbour', age: 4, w: 3, when: '1500s', cost: { w: 310, f: 210 }, t: 55, fx: [{ s: 'sight', k: 'dock', a: 60 }], desc: 'Docks see farther.' },
  { id: 'tally', name: 'Tally sticks', at: 'keep', line: 'Household', age: 0, w: 3, when: '20,000 BC', cost: { f: 40, g: 30 }, t: 15, fx: [{ s: 'research', m: 0.95 }], desc: 'Research is 5% faster.' },
  { id: 'baskets', name: 'Baskets', at: 'keep', line: 'Household', age: 0, w: 3, when: '8000 BC', cost: { f: 40, g: 30 }, t: 15, fx: [{ s: 'carry', a: 3 }], desc: 'Villagers carry 3 more.' },
  { id: 'census', name: 'Census', at: 'keep', line: 'Household', age: 2, w: 5, when: '500 BC', cost: { f: 170, g: 110 }, t: 38, fx: [{ s: 'train', k: 'vil', m: 0.8 }], need: ['writing'], desc: 'Villagers train 20% faster.' },
  { id: 'charter', name: 'Town charter', at: 'keep', line: 'Household', age: 3, w: 6, when: '1100s', cost: { f: 290, g: 190 }, t: 56, fx: [{ s: 'room', k: 'house', a: 1 }], desc: 'Houses hold one more.' },
  { id: 'printing', name: 'Printing', at: 'keep', line: 'Household', age: 4, w: 9, when: '1450s', cost: { f: 550, g: 360 }, t: 87, fx: [{ s: 'research', m: 0.85 }], need: ['press'], desc: 'Research is 15% faster.' },
  { id: 'townwatch', name: 'Town watch', at: 'keep', line: 'Watch', age: 1, w: 4, when: '1200s', cost: { f: 90, g: 60 }, t: 26, fx: [{ s: 'rng', k: 'keep', a: 15 }, { s: 'rng', k: 'town', a: 15 }], desc: 'The Town Center shoots farther.' },
  { id: 'calendar', name: 'Calendar', at: 'keep', line: 'Watch', age: 2, w: 6, when: '45 BC', cost: { f: 180, g: 120 }, t: 41, fx: [{ s: 'crop', k: 'food', m: 1.05 }, { s: 'research', m: 0.95 }], need: ['writing'], desc: 'Farms give 5% more; research 5% faster.' },
  { id: 'pride', name: 'Civic pride', at: 'keep', line: 'Watch', age: 3, w: 4, when: '1300s', cost: { f: 240, g: 160 }, t: 48, fx: [{ s: 'shelter', m: 2 }], desc: 'Walls and towers steady nerve twice as much.' },
  { id: 'postal', name: 'Post riders', at: 'keep', line: 'Watch', age: 4, w: 5, when: '1490', cost: { f: 390, g: 260 }, t: 66, fx: [{ s: 'diplo', a: 0.1 }], desc: 'Emissaries are heard more readily.' },
  { id: 'shields', name: 'Shields', at: 'barracks', line: 'Ranks', age: 0, w: 5, when: '3000 BC', cost: { f: 50, g: 40 }, t: 18, fx: [{ s: 'armor', k: '#infantry', min: 0.92 }], desc: 'Infantry take 8% less harm.' },
  { id: 'spearwall', name: 'Spear wall', at: 'barracks', line: 'Ranks', age: 1, w: 5, when: '2500 BC', cost: { f: 100, g: 70 }, t: 28, fx: [{ s: 'uhp', k: '#spear', m: 1.1 }], desc: 'Spearmen are 10% tougher.' },
  { id: 'drill', name: 'Drill', at: 'barracks', line: 'Ranks', age: 1, w: 6, when: '700 BC', cost: { f: 110, g: 70 }, t: 30, fx: [{ s: 'uhp', k: '#soldier', m: 1.15 }], desc: 'Soldiers are 15% tougher.' },
  { id: 'phalanx', name: 'Phalanx', at: 'barracks', line: 'Ranks', age: 2, w: 7, when: '650 BC', cost: { f: 200, g: 130 }, t: 44, tier: { unit: 'spear', name: 'Hoplite', hp: 1.25, dmg: 2 }, desc: 'Spearmen become Hoplites.' },
  { id: 'legion', name: 'Legion', at: 'barracks', line: 'Ranks', age: 2, w: 8, when: '300 BC', cost: { f: 220, g: 150 }, t: 47, fx: [{ s: 'uhp', k: '#infantry', m: 1.1 }, { s: 'dmg', k: '#infantry', a: 1 }], need: ['phalanx'], desc: 'Infantry 10% tougher, hit harder.' },
  { id: 'pikesquare', name: 'Pike square', at: 'barracks', line: 'Ranks', age: 3, w: 7, when: '1300s', cost: { f: 320, g: 210 }, t: 60, tier: { unit: 'spear', name: 'Pikeman', hp: 1.15, dmg: 1, vs: { mounted: 4 } }, desc: 'Spearmen become Pikemen: death to horse.' },
  { id: 'arms', name: 'Men-at-arms', at: 'barracks', line: 'Ranks', age: 3, w: 5, when: '1300s', cost: { f: 260, g: 180 }, t: 52, tier: { unit: 'sword', name: 'Man-at-arms', hp: 1.3, dmg: 3 }, need: ['plate'], desc: 'Swordsmen become Men-at-arms.' },
  { id: 'halberd', name: 'Halberd', at: 'barracks', line: 'Ranks', age: 4, w: 5, when: '1315', cost: { f: 390, g: 260 }, t: 66, tier: { unit: 'spear', name: 'Halberdier', hp: 1.1, dmg: 2, vs: { mounted: 4.5 } }, desc: 'Spearmen become Halberdiers.' },
  { id: 'tercio', name: 'Tercio', at: 'barracks', line: 'Ranks', age: 4, w: 7, when: '1534', cost: { f: 470, g: 310 }, t: 77, fx: [{ s: 'uhp', k: '#infantry', m: 1.15 }], need: ['volley'], desc: 'Infantry are 15% tougher.' },
  { id: 'bayonet', name: 'Bayonet', at: 'barracks', line: 'Ranks', age: 4, w: 6, when: '1670s', cost: { f: 430, g: 290 }, t: 71, fx: [{ s: 'dmg', k: 'arquebus', a: 3 }], need: ['musket'], desc: 'Musketeers hit harder.' },
  { id: 'fieldcraft', name: 'Fieldcraft', at: 'barracks', line: 'March', age: 0, w: 3, when: 'Stone age', cost: { f: 40, g: 30 }, t: 15, fx: [{ s: 'sight', k: '#infantry', a: 10 }], desc: 'Infantry see farther.' },
  { id: 'camps', name: 'Marching camps', at: 'barracks', line: 'March', age: 1, w: 5, when: '400 BC', cost: { f: 100, g: 70 }, t: 28, fx: [{ s: 'rest', m: 1.3 }], desc: 'Resting soldiers recover nerve 30% faster.' },
  { id: 'marching', name: 'Forced marches', at: 'barracks', line: 'March', age: 2, w: 5, when: '200 BC', cost: { f: 170, g: 110 }, t: 38, fx: [{ s: 'spd', k: '#infantry', m: 1.08 }], desc: 'Infantry march 8% faster.' },
  { id: 'warmclothes', name: 'Wool cloaks', at: 'barracks', line: 'March', age: 3, w: 4, when: '1000s', cost: { f: 240, g: 160 }, t: 48, fx: [{ s: 'cold', a: 0.5 }], need: ['spinwheel'], desc: 'Winter slows soldiers half as much.' },
  { id: 'waterproof', name: 'Oiled cloaks', at: 'barracks', line: 'March', age: 4, w: 3, when: '1500s', cost: { f: 310, g: 210 }, t: 55, fx: [{ s: 'wet', a: 0.5 }], need: ['warmclothes'], desc: 'Rain slows soldiers half as much.' },
  { id: 'drillyard', name: 'Drill yard', at: 'barracks', line: 'Levy', age: 2, w: 4, when: '300 BC', cost: { f: 150, g: 100 }, t: 35, fx: [{ s: 'armyroom', a: 2 }], desc: 'Room for 2 more soldiers.' },
  { id: 'veterans', name: 'Veterans', at: 'barracks', line: 'Levy', age: 2, w: 6, when: '100 BC', cost: { f: 180, g: 120 }, t: 41, fx: [{ s: 'teach', a: 1 }], need: ['writing'], desc: 'Soldiers can be taught up to a newer kind.' },
  { id: 'feudal', name: 'Feudal levy', at: 'barracks', line: 'Levy', age: 3, w: 4, when: '900s', cost: { f: 240, g: 160 }, t: 48, fx: [{ s: 'cost', k: '#infantry', m: 0.9 }], desc: 'Infantry cost 10% less.' },
  { id: 'muster', name: 'Muster', at: 'council', line: 'Command', age: 4, w: 6, when: '1600s', cost: { f: 430, g: 290 }, t: 71, fx: [], desc: 'Set formations for whole battalions.' },
  { id: 'slings', name: 'Slings', at: 'range', line: 'Shot', age: 1, w: 3, when: '7000 BC', cost: { w: 80, g: 50 }, t: 24, fx: [{ s: 'dmg', k: 'jav', a: 1 }], desc: 'Javelineers hit harder.' },
  { id: 'composite', name: 'Composite bow', at: 'range', line: 'Shot', age: 1, w: 7, when: '2000 BC', cost: { w: 120, g: 80 }, t: 32, fx: [{ s: 'rng', k: '#archer', a: 15 }], desc: 'Archers reach farther.' },
  { id: 'bodkin', name: 'Bodkin points', at: 'range', line: 'Shot', age: 2, w: 4, when: '1000s', cost: { w: 150, g: 100 }, t: 35, fx: [{ s: 'dmg', k: '#archer', a: 1 }], need: ['iron'], desc: 'Archers hit harder.' },
  { id: 'firearrows', name: 'Fire arrows', at: 'range', line: 'Shot', age: 2, w: 5, when: '900s', cost: { w: 170, g: 110 }, t: 38, fx: [{ s: 'fire', k: '#archer', a: 1 }], need: ['composite'], desc: 'Archers set wooden buildings alight.' },
  { id: 'longbow', name: 'Longbow', at: 'range', line: 'Shot', age: 3, w: 6, when: '1300s', cost: { w: 290, g: 190 }, t: 56, tier: { unit: 'archer', name: 'Longbowman', rng: 20, dmg: 1 }, desc: 'Archers become Longbowmen.' },
  { id: 'xbowdrill', name: 'Crossbow drill', at: 'range', line: 'Shot', age: 3, w: 4, when: '1200s', cost: { w: 240, g: 160 }, t: 48, fx: [{ s: 'dmg', k: 'crossbow', a: 2 }], desc: 'Crossbowmen hit harder.' },
  { id: 'musket', name: 'Musket', at: 'range', line: 'Shot', age: 4, w: 8, when: '1520s', cost: { w: 510, g: 340 }, t: 82, tier: { unit: 'arquebus', name: 'Musketeer', hp: 1.1, dmg: 4, rng: 10 }, need: ['corned'], desc: 'Arquebusiers become Musketeers.' },
  { id: 'volley', name: 'Volley fire', at: 'range', line: 'Shot', age: 4, w: 7, when: '1590s', cost: { w: 470, g: 310 }, t: 77, fx: [{ s: 'dmg', k: '#gun', a: 4 }], need: ['musket'], desc: 'Guns hit harder.' },
  { id: 'horses', name: 'Horse breeding', at: 'stable', line: 'Horse', age: 1, w: 8, when: '3500 BC', cost: { f: 130, g: 90 }, t: 35, fx: [{ s: 'spd', k: '#mounted', m: 1.12 }], desc: 'Mounted units are 12% faster.' },
  { id: 'bridles', name: 'Bits and bridles', at: 'stable', line: 'Horse', age: 1, w: 3, when: '2000 BC', cost: { f: 80, g: 50 }, t: 24, fx: [{ s: 'spd', k: '#mounted', m: 1.05 }], desc: 'Mounted units are 5% faster.' },
  { id: 'saddles', name: 'Saddles', at: 'stable', line: 'Horse', age: 2, w: 4, when: '200 BC', cost: { f: 150, g: 100 }, t: 35, fx: [{ s: 'uhp', k: '#mounted', m: 1.1 }], desc: 'Mounted units are 10% tougher.' },
  { id: 'stirrups', name: 'Stirrups', at: 'stable', line: 'Horse', age: 2, w: 8, when: '300s', cost: { f: 220, g: 150 }, t: 47, fx: [{ s: 'dmg', k: '#mounted', a: 1 }], need: ['saddles'], desc: 'Mounted units hit harder.' },
  { id: 'horseshoes', name: 'Horseshoes', at: 'stable', line: 'Horse', age: 3, w: 5, when: '900s', cost: { f: 260, g: 180 }, t: 52, fx: [{ s: 'ice', k: '#mounted', a: 0.5 }, { s: 'mud', k: '#mounted', m: 0.8 }], desc: 'Horses slip and bog down less.' },
  { id: 'remounts', name: 'Stud farms', at: 'stable', line: 'Horse', age: 4, w: 4, when: '1500s', cost: { f: 350, g: 230 }, t: 61, fx: [{ s: 'train', k: '#mounted', m: 0.8 }], desc: 'Mounted units train 20% faster.' },
  { id: 'cavalry', name: 'Cavalry', at: 'stable', line: 'Rider', age: 2, w: 7, when: '700 BC', cost: { f: 200, g: 130 }, t: 44, tier: { unit: 'chariot', name: 'Horseman', hp: 1.15, spd: 1.12 }, desc: 'Chariots become Horsemen.' },
  { id: 'knighthood', name: 'Knighthood', at: 'stable', line: 'Rider', age: 3, w: 7, when: '1000s', cost: { f: 320, g: 210 }, t: 60, tier: { unit: 'cata', name: 'Knight', hp: 1.2, dmg: 2, spd: 1.1 }, need: ['stirrups'], desc: 'Cataphracts become Knights.' },
  { id: 'dragoons', name: 'Dragoons', at: 'stable', line: 'Rider', age: 4, w: 5, when: '1600s', cost: { f: 390, g: 260 }, t: 66, fx: [{ s: 'spd', k: '#mounted', m: 1.1 }], need: ['musket'], desc: 'Mounted units are 10% faster.' },
  { id: 'bronze', name: 'Bronze', at: 'smith', line: 'Blades', age: 1, w: 9, when: '3300 BC', cost: { g: 100 }, t: 37, fx: [{ s: 'dmg', k: '#soldier', a: 1 }, { s: 'dmg', k: '#guard', a: 1 }], desc: 'Soldiers and towers hit harder.' },
  { id: 'spearheads', name: 'Socketed heads', at: 'smith', line: 'Blades', age: 1, w: 4, when: '2000 BC', cost: { g: 60 }, t: 26, fx: [{ s: 'dmg', k: '#spear', a: 1 }], desc: 'Spearmen hit harder.' },
  { id: 'iron', name: 'Iron working', at: 'smith', line: 'Blades', age: 2, w: 9, when: '1200 BC', cost: { g: 240, i: 160 }, t: 50, fx: [{ s: 'dmg', k: '#soldier', a: 2 }, { s: 'dmg', k: '#guard', a: 2 }], desc: 'Soldiers and towers hit harder still.' },
  { id: 'tempering', name: 'Tempering', at: 'smith', line: 'Blades', age: 3, w: 6, when: '1200s', cost: { g: 290, i: 190 }, t: 56, fx: [{ s: 'wear', a: 0.5 }], desc: 'Blades do not go brittle in frost.' },
  { id: 'casehard', name: 'Case hardening', at: 'smith', line: 'Blades', age: 4, w: 4, when: '1500s', cost: { g: 350, i: 230 }, t: 61, fx: [{ s: 'dmg', k: '#soldier', a: 1 }], desc: 'Soldiers hit harder.' },
  { id: 'leather', name: 'Leather armour', at: 'smith', line: 'Armour', age: 1, w: 4, when: '2000 BC', cost: { g: 60 }, t: 26, fx: [{ s: 'armor', k: '#soldier', min: 0.85 }], desc: 'Soldiers take 15% less harm.' },
  { id: 'helmets', name: 'Helmets', at: 'smith', line: 'Armour', age: 1, w: 4, when: '2500 BC', cost: { g: 60 }, t: 26, fx: [{ s: 'armor', k: '#infantry', min: 0.9 }], desc: 'Infantry take 10% less harm.' },
  { id: 'scale', name: 'Scale armour', at: 'smith', line: 'Armour', age: 2, w: 4, when: '900 BC', cost: { g: 150, i: 100 }, t: 35, fx: [{ s: 'armor', k: '#mounted', min: 0.8 }], desc: 'Mounted units take 20% less harm.' },
  { id: 'chain', name: 'Chain mail', at: 'smith', line: 'Armour', age: 2, w: 6, when: '300 BC', cost: { g: 180, i: 120 }, t: 41, fx: [{ s: 'armor', k: '#soldier', min: 0.7 }], need: ['iron'], desc: 'Soldiers take 30% less harm.' },
  { id: 'plate', name: 'Plate armour', at: 'smith', line: 'Armour', age: 3, w: 7, when: '1350s', cost: { g: 320, i: 210 }, t: 60, fx: [{ s: 'armor', k: '#soldier', min: 0.6 }], need: ['chain', 'bellows'], desc: 'Soldiers take 40% less harm.' },
  { id: 'oiling', name: 'Oiled steel', at: 'smith', line: 'Armour', age: 4, w: 3, when: '1500s', cost: { g: 310, i: 210 }, t: 55, fx: [{ s: 'wear', a: 0.5 }], need: ['tempering'], desc: 'Blades and armour do not rust in rain.' },
  { id: 'slits', name: 'Arrow slits', at: 'smith', line: 'Walls', age: 2, w: 4, when: '200 BC', cost: { g: 150, i: 100 }, t: 35, fx: [{ s: 'rng', k: '#guard', a: 20 }], desc: 'Towers shoot farther.' },
  { id: 'fortify', name: 'Curtain walls', at: 'smith', line: 'Walls', age: 3, w: 6, when: '1100s', cost: { g: 290, i: 190 }, t: 56, fx: [{ s: 'bhp', k: '#wallish', m: 1.6 }, { s: 'bhp', k: 'tower', m: 1.4 }], need: ['masonry'], desc: 'Walls 60% tougher, towers 40%.' },
  { id: 'machic', name: 'Machicolations', at: 'smith', line: 'Walls', age: 3, w: 4, when: '1200s', cost: { g: 240, i: 160 }, t: 48, fx: [{ s: 'dmg', k: 'tower', a: 5 }], need: ['fortify'], desc: 'Towers hit harder.' },
  { id: 'guncast', name: 'Gun founding', at: 'smith', line: 'Walls', age: 4, w: 7, when: '1400s', cost: { g: 470, i: 310 }, t: 77, fx: [{ s: 'dmg', k: '#gun', a: 10 }], need: ['blast'], desc: 'Guns hit harder.' },
  { id: 'starfort', name: 'Star fort', at: 'smith', line: 'Walls', age: 4, w: 8, when: '1500s', cost: { g: 510, i: 340 }, t: 82, fx: [{ s: 'bhp', k: '#wallish', m: 1.5 }, { s: 'bhp', k: '#guard', m: 1.3 }], need: ['guncast'], desc: 'Walls 50% tougher, towers 30%.' },
  { id: 'engineers', name: 'Siege engineers', at: 'siege', line: 'Engines', age: 2, w: 5, when: '300 BC', cost: { w: 170, g: 110 }, t: 38, fx: [{ s: 'train', k: '#siege', m: 0.75 }], desc: 'Engines build 25% faster.' },
  { id: 'torsion', name: 'Torsion springs', at: 'siege', line: 'Engines', age: 2, w: 6, when: '399 BC', cost: { w: 180, g: 120 }, t: 41, fx: [{ s: 'rng', k: 'catapult', a: 15 }, { s: 'rng', k: 'ballista', a: 15 }], desc: 'Catapults and ballistae reach farther.' },
  { id: 'counterweight', name: 'Counterweight', at: 'siege', line: 'Engines', age: 3, w: 7, when: '1100s', cost: { w: 320, g: 210 }, t: 60, fx: [{ s: 'dmg', k: 'treb', a: 10 }], desc: 'Trebuchets hit harder.' },
  { id: 'burningshot', name: 'Burning shot', at: 'siege', line: 'Engines', age: 3, w: 5, when: '600s', cost: { w: 260, g: 180 }, t: 52, fx: [{ s: 'fire', k: '#siege', a: 1 }], need: ['firearrows'], desc: 'Engines set buildings alight.' },
  { id: 'corned', name: 'Corned powder', at: 'siege', line: 'Engines', age: 4, w: 8, when: '1420s', cost: { w: 510, g: 340 }, t: 82, fx: [{ s: 'dmg', k: 'bombard', a: 20 }], desc: 'Bombards hit harder.' },
  { id: 'limbers', name: 'Gun carriages', at: 'siege', line: 'Engines', age: 4, w: 6, when: '1470s', cost: { w: 430, g: 290 }, t: 71, fx: [{ s: 'spd', k: '#siege', m: 1.25 }], need: ['corned'], desc: 'Engines move 25% faster.' },
  { id: 'petards', name: 'Petards', at: 'siege', line: 'Engines', age: 4, w: 5, when: '1570s', cost: { w: 390, g: 260 }, t: 66, fx: [{ s: 'blast', k: '#gun', a: 1 }], need: ['corned'], desc: 'Bombards set what they hit alight.' },
  { id: 'standing', name: 'Standing army', at: 'castle', line: 'Garrison', age: 3, w: 6, when: '1445', cost: { g: 290, i: 190 }, t: 56, fx: [{ s: 'armyroom', a: 2 }, { s: 'armyroom', k: 'castle', a: 2 }], desc: 'Room for 4 more soldiers.' },
  { id: 'drawbridge', name: 'Drawbridge', at: 'castle', line: 'Garrison', age: 3, w: 4, when: '1200s', cost: { g: 240, i: 160 }, t: 48, fx: [{ s: 'bhp', k: 'castle', m: 1.2 }], desc: 'Castles are 20% tougher.' },
  { id: 'garrison', name: 'Garrison wards', at: 'castle', line: 'Garrison', age: 4, w: 5, when: '1500s', cost: { g: 390, i: 260 }, t: 66, fx: [{ s: 'armyroom', k: 'castle', a: 4 }, { s: 'garrison', m: 2 }], need: ['hospitals'], desc: 'Castles hold 4 more; soldiers inside heal twice as fast.' },
  { id: 'bastion', name: 'Bastions', at: 'castle', line: 'Garrison', age: 4, w: 6, when: '1530s', cost: { g: 430, i: 290 }, t: 71, fx: [{ s: 'dmg', k: 'castle', a: 8 }], need: ['starfort'], desc: 'Castles hit harder.' },
  { id: 'writing', name: 'Writing', at: 'school', line: 'Letters', age: 1, w: 10, when: '3200 BC', cost: { w: 150, g: 100 }, t: 39, fx: [{ s: 'research', m: 0.85 }], desc: 'Research is 15% faster.' },
  { id: 'records', name: 'Record keeping', at: 'school', line: 'Letters', age: 1, w: 5, when: '3000 BC', cost: { w: 100, g: 70 }, t: 28, fx: [{ s: 'queue', a: 1 }], desc: 'One more order in every queue.' },
  { id: 'rhetoric', name: 'Rhetoric', at: 'school', line: 'Letters', age: 2, w: 5, when: '400 BC', cost: { w: 170, g: 110 }, t: 38, fx: [{ s: 'diplo', a: 0.1 }], desc: 'Emissaries are heard more readily.' },
  { id: 'universities', name: 'Universities', at: 'school', line: 'Letters', age: 3, w: 7, when: '1088', cost: { w: 320, g: 210 }, t: 60, fx: [{ s: 'research', m: 0.9 }], desc: 'Research is 10% faster.' },
  { id: 'science', name: 'Natural philosophy', at: 'school', line: 'Letters', age: 4, w: 9, when: '1600s', cost: { w: 550, g: 360 }, t: 87, fx: [{ s: 'research', m: 0.85 }], need: ['press'], desc: 'Research is 15% faster.' },
  { id: 'maths', name: 'Geometry', at: 'school', line: 'Numbers', age: 1, w: 6, when: '300 BC', cost: { w: 110, g: 70 }, t: 30, fx: [{ s: 'dmg', k: '#guard', a: 2 }], desc: 'Towers hit harder.' },
  { id: 'algebra', name: 'Algebra', at: 'school', line: 'Numbers', age: 3, w: 6, when: '820', cost: { w: 290, g: 190 }, t: 56, fx: [{ s: 'rng', k: '#siege', a: 10 }], desc: 'Engines reach farther.' },
  { id: 'ballistics', name: 'Ballistics', at: 'school', line: 'Numbers', age: 4, w: 6, when: '1537', cost: { w: 430, g: 290 }, t: 71, fx: [{ s: 'dmg', k: '#siege', a: 5 }], need: ['algebra'], desc: 'Engines hit harder.' },
  { id: 'apprentices', name: 'Apprenticeship', at: 'school', line: 'Teaching', age: 1, w: 4, when: '1700 BC', cost: { w: 90, g: 60 }, t: 26, fx: [{ s: 'train', m: 0.9 }], desc: 'Everything trains 10% faster.' },
  { id: 'academy', name: 'Academy', at: 'school', line: 'Teaching', age: 2, w: 5, when: '387 BC', cost: { w: 170, g: 110 }, t: 38, fx: [{ s: 'teach', m: 0.7 }], need: ['veterans'], desc: 'Teaching soldiers takes 30% less time.' },
  { id: 'military_academy', name: 'War college', at: 'school', line: 'Teaching', age: 4, w: 5, when: '1617', cost: { w: 390, g: 260 }, t: 66, fx: [{ s: 'teach', m: 0.7 }], need: ['academy'], desc: 'Teaching soldiers takes 30% less time.' },
  { id: 'medicine', name: 'Medicine', at: 'library', line: 'Learning', age: 2, w: 6, when: '400 BC', cost: { g: 180, s: 120 }, t: 41, fx: [{ s: 'heal', m: 1.5 }], desc: 'Healing is 50% faster.' },
  { id: 'architecture', name: 'Architecture', at: 'library', line: 'Learning', age: 2, w: 6, when: '25 BC', cost: { g: 180, s: 120 }, t: 41, fx: [{ s: 'build', m: 0.8 }], need: ['masonry'], desc: 'Building is 20% faster.' },
  { id: 'guilds', name: 'Guilds', at: 'library', line: 'Learning', age: 3, w: 5, when: '1100s', cost: { g: 260, s: 180 }, t: 52, fx: [{ s: 'queue', a: 2 }], desc: 'Two more orders in every queue.' },
  { id: 'medschool', name: 'Medical school', at: 'library', line: 'Learning', age: 3, w: 6, when: '1000s', cost: { g: 290, s: 190 }, t: 56, fx: [{ s: 'death', m: 0.5 }, { s: 'cure', m: 2 }], need: ['medicine'], desc: 'Half as many die of plague; cures twice as fast.' },
  { id: 'press', name: 'Printing press', at: 'library', line: 'Learning', age: 4, w: 9, when: '1450s', cost: { g: 550, s: 360 }, t: 87, fx: [{ s: 'research', m: 0.8 }], desc: 'Research is 20% faster.' },
  { id: 'optics', name: 'Optics', at: 'library', line: 'Learning', age: 4, w: 6, when: '1608', cost: { g: 430, s: 290 }, t: 71, fx: [{ s: 'sight', k: '*', a: 20 }], need: ['press'], desc: 'Everyone sees farther.' },
  { id: 'roads', name: 'Roads', at: 'library', line: 'Weather', age: 2, w: 7, when: '300 BC', cost: { g: 200, s: 130 }, t: 44, fx: [{ s: 'mud', m: 0.5 }, { s: 'trade', m: 1.15 }], desc: 'Mud slows half as much; trade pays 15% more.' },
  { id: 'drainage', name: 'Field drains', at: 'library', line: 'Weather', age: 2, w: 5, when: '100 BC', cost: { g: 170, s: 110 }, t: 38, fx: [{ s: 'mud', m: 0.7 }], desc: 'Mud slows 30% less.' },
  { id: 'snowclear', name: 'Snow clearing', at: 'library', line: 'Weather', age: 3, w: 4, when: '1200s', cost: { g: 240, s: 160 }, t: 48, fx: [{ s: 'snow', a: 0.5 }], desc: 'Snow slows half as much.' },
  { id: 'crampons', name: 'Crampons', at: 'library', line: 'Weather', age: 3, w: 4, when: '1500s', cost: { g: 240, s: 160 }, t: 48, fx: [{ s: 'ice', a: 0.5 }], need: ['horseshoes'], desc: 'Men slip half as often on ice.' },
  { id: 'levees', name: 'Levees', at: 'library', line: 'Weather', age: 3, w: 6, when: '1000s', cost: { g: 290, s: 190 }, t: 56, fx: [{ s: 'flood', a: 1 }], need: ['irrigation'], desc: 'Floods stop short of your buildings.' },
  { id: 'meteorology', name: 'Weather glass', at: 'library', line: 'Weather', age: 4, w: 6, when: '1643', cost: { g: 430, s: 290 }, t: 71, fx: [{ s: 'wet', a: 0.5 }, { s: 'cold', a: 0.5 }], need: ['science'], desc: 'Rain and winter slow half as much more.' },
  { id: 'bandages', name: 'Bandages', at: 'hospital', line: 'Wards', age: 2, w: 4, when: '400 BC', cost: { f: 150, g: 100 }, t: 35, fx: [{ s: 'heal', m: 1.3 }], desc: 'Healing is 30% faster.' },
  { id: 'herbs', name: 'Herbals', at: 'hospital', line: 'Wards', age: 2, w: 3, when: '50 AD', cost: { f: 130, g: 90 }, t: 32, fx: [{ s: 'cure', m: 1.3 }], desc: 'Cures are 30% faster.' },
  { id: 'hospitals', name: 'Hospitals', at: 'hospital', line: 'Wards', age: 3, w: 6, when: '800s', cost: { f: 290, g: 190 }, t: 56, fx: [{ s: 'death', m: 0.7 }], desc: '30% fewer die of plague.' },
  { id: 'pharmacy', name: 'Pharmacy', at: 'hospital', line: 'Wards', age: 3, w: 6, when: '1025', cost: { f: 290, g: 190 }, t: 56, fx: [{ s: 'cure', m: 1.5 }], need: ['herbs'], desc: 'Cures are 50% faster.' },
  { id: 'quarantine', name: 'Quarantine', at: 'hospital', line: 'Wards', age: 3, w: 7, when: '1377', cost: { f: 320, g: 210 }, t: 60, fx: [{ s: 'spread', m: 0.5 }], desc: 'Plague spreads half as fast.' },
  { id: 'surgeons', name: 'Surgeons', at: 'hospital', line: 'Wards', age: 4, w: 6, when: '1545', cost: { f: 430, g: 290 }, t: 71, fx: [{ s: 'heal', m: 1.5 }], desc: 'Healing is 50% faster.' },
  { id: 'anatomy', name: 'Anatomy', at: 'hospital', line: 'Wards', age: 4, w: 6, when: '1543', cost: { f: 430, g: 290 }, t: 71, fx: [{ s: 'heal', m: 1.2 }], need: ['surgeons'], desc: 'Healing is 20% faster.' },
  { id: 'inoculation', name: 'Inoculation', at: 'hospital', line: 'Wards', age: 4, w: 8, when: '1500s', cost: { f: 510, g: 340 }, t: 82, fx: [{ s: 'plague', m: 0.3 }], need: ['quarantine'], desc: 'Plague strikes 70% less.' },
  { id: 'rites', name: 'Rites', at: 'temple', line: 'Faith', age: 1, w: 4, when: 'Bronze age', cost: { g: 90, s: 60 }, t: 26, fx: [{ s: 'zealsecs', a: 15 }], desc: 'Zeal lasts 15 s longer.' },
  { id: 'games', name: 'Sacred games', at: 'temple', line: 'Faith', age: 2, w: 4, when: '776 BC', cost: { g: 150, s: 100 }, t: 35, fx: [{ s: 'zealcost', m: 0.5 }, { s: 'zealcd', m: 0.7 }], desc: 'Zeal costs half, returns sooner.' },
  { id: 'relics', name: 'Relics', at: 'temple', line: 'Faith', age: 3, w: 4, when: '800s', cost: { g: 240, s: 160 }, t: 48, fx: [{ s: 'convert', m: 0.75 }], desc: 'Priests convert 25% faster.' },
  { id: 'sermons', name: 'Preaching orders', at: 'temple', line: 'Faith', age: 3, w: 4, when: '1210s', cost: { g: 240, s: 160 }, t: 48, fx: [{ s: 'rest', m: 1.2 }], desc: 'Resting soldiers recover nerve 20% faster.' },
  { id: 'reform', name: 'Reformation', at: 'temple', line: 'Faith', age: 4, w: 7, when: '1517', cost: { g: 470, s: 310 }, t: 77, fx: [{ s: 'zealcost', m: 0.7 }], need: ['press'], desc: 'Zeal costs 30% less.' },
  { id: 'watch', name: 'Night watch', at: 'courthouse', line: 'Order', age: 1, w: 3, when: '1200s', cost: { g: 80, w: 50 }, t: 24, fx: [{ s: 'spysight', a: 60 }], desc: 'Spies are seen from farther.' },
  { id: 'codes', name: 'Law code', at: 'courthouse', line: 'Order', age: 2, w: 7, when: '1750 BC', cost: { g: 200, w: 130 }, t: 44, fx: [{ s: 'push', m: 0.85 }], need: ['writing'], desc: 'Vassal unrest climbs 15% slower.' },
  { id: 'magistrates', name: 'Magistrates', at: 'courthouse', line: 'Order', age: 3, w: 5, when: '1100s', cost: { g: 260, w: 180 }, t: 52, fx: [{ s: 'push', m: 0.8 }], desc: 'Vassal unrest climbs 20% slower.' },
  { id: 'informers', name: 'Informers', at: 'courthouse', line: 'Order', age: 4, w: 4, when: '1500s', cost: { g: 350, w: 230 }, t: 61, fx: [{ s: 'cost', k: 'spy', m: 0.7 }], desc: 'Spies cost 30% less.' },
  { id: 'tolls', name: 'Tolls', at: 'courthouse', line: 'Revenue', age: 2, w: 4, when: '100s', cost: { g: 150, w: 100 }, t: 35, fx: [{ s: 'trade', m: 1.1 }], desc: 'Trade pays 10% more.' },
  { id: 'assizes', name: 'Assizes', at: 'courthouse', line: 'Revenue', age: 3, w: 4, when: '1166', cost: { g: 240, w: 160 }, t: 48, fx: [{ s: 'spysight', a: 40 }], desc: 'Spies are seen from farther still.' },
  { id: 'police', name: 'Police', at: 'courthouse', line: 'Revenue', age: 4, w: 5, when: '1667', cost: { g: 390, w: 260 }, t: 66, fx: [{ s: 'cost', k: 'spy', m: 0.85 }, { s: 'spysight', a: 40 }], need: ['informers'], desc: 'Spies cheaper, seen farther.' },
  { id: 'engage', name: 'Engagement', at: 'council', line: 'Command', age: 2, w: 6, when: '500 BC', cost: { f: 180, g: 120 }, t: 41, fx: [], desc: 'Stances for the army.' },
  { id: 'command', name: 'Battalions', at: 'council', line: 'Command', age: 2, w: 6, when: '300 BC', cost: { f: 180, g: 120 }, t: 41, fx: [], need: ['engage'], desc: 'Six battalions, Alpha to Zeta.' },
  { id: 'formations', name: 'Formations', at: 'council', line: 'Command', age: 2, w: 5, when: '300 BC', cost: { f: 170, g: 110 }, t: 38, fx: [], need: ['command'], desc: 'Set the shape of a battalion.' },
  { id: 'standards', name: 'Standards', at: 'council', line: 'Command', age: 3, w: 5, when: '100 BC', cost: { f: 260, g: 180 }, t: 52, fx: [{ s: 'rest', m: 1.5 }], desc: 'Resting soldiers recover nerve 50% faster.' },
  { id: 'supply', name: 'Supply trains', at: 'council', line: 'Command', age: 3, w: 5, when: '1200s', cost: { f: 260, g: 180 }, t: 52, fx: [{ s: 'rest', m: 1.2 }], desc: 'Resting soldiers recover nerve 20% faster.' },
  { id: 'staff', name: 'General staff', at: 'council', line: 'Command', age: 4, w: 6, when: '1630s', cost: { f: 430, g: 290 }, t: 71, fx: [{ s: 'charge', m: 1.2 }], need: ['muster'], desc: 'Charges hit 20% harder.' },
  { id: 'weights', name: 'Weights and measures', at: 'market', line: 'Trade', age: 1, w: 5, when: '3000 BC', cost: { g: 100, s: 70 }, t: 28, fx: [{ s: 'sell', a: 0.05 }], desc: 'Goods sell 5% dearer.' },
  { id: 'coinage', name: 'Coinage', at: 'market', line: 'Trade', age: 2, w: 8, when: '600 BC', cost: { g: 220, s: 150 }, t: 47, fx: [{ s: 'sell', a: 0.1 }], desc: 'Goods sell 10% dearer.' },
  { id: 'credit', name: 'Letters of credit', at: 'market', line: 'Trade', age: 3, w: 6, when: '1200s', cost: { g: 290, s: 190 }, t: 56, fx: [{ s: 'trade', m: 1.25 }], need: ['coinage'], desc: 'Trade pays 25% more.' },
  { id: 'banking', name: 'Banking', at: 'market', line: 'Trade', age: 4, w: 7, when: '1400s', cost: { g: 470, s: 310 }, t: 77, fx: [{ s: 'venture', a: 0.2 }], need: ['credit'], desc: 'Ventures bring 20% more home.' },
  { id: 'exchange', name: 'Bourse', at: 'market', line: 'Trade', age: 4, w: 5, when: '1531', cost: { g: 390, s: 260 }, t: 66, fx: [{ s: 'trade', m: 1.15 }], need: ['banking'], desc: 'Trade pays 15% more.' },
  { id: 'armedcart', name: 'Armed caravans', at: 'market', line: 'Caravans', age: 2, w: 4, when: '100s', cost: { g: 150, s: 100 }, t: 35, fx: [{ s: 'uhp', k: 'caravan', m: 2 }], desc: 'Caravans are twice as tough.' },
  { id: 'convoys', name: 'Convoys', at: 'market', line: 'Caravans', age: 4, w: 4, when: '1560s', cost: { g: 350, s: 230 }, t: 61, fx: [{ s: 'uhp', k: 'caravan', m: 1.5 }], desc: 'Caravans are 50% tougher.' },
  { id: 'milestones', name: 'Milestones', at: 'tpost', line: 'Roads', age: 2, w: 3, when: '250 BC', cost: { w: 130, g: 90 }, t: 32, fx: [{ s: 'trade', m: 1.05 }], desc: 'Trade pays 5% more.' },
  { id: 'caravanserai', name: 'Caravanserai', at: 'tpost', line: 'Roads', age: 2, w: 5, when: '500 BC', cost: { w: 170, g: 110 }, t: 38, fx: [{ s: 'uhp', k: 'caravan', m: 1.5 }], desc: 'Caravans are 50% tougher.' },
  { id: 'fortpost', name: 'Fortified posts', at: 'tpost', line: 'Roads', age: 3, w: 5, when: '1100s', cost: { w: 260, g: 180 }, t: 52, fx: [{ s: 'bhp', k: 'tpost', m: 1.5 }, { s: 'dmg', k: 'tpost', a: 5 }], need: ['fortify'], desc: 'Posts are 50% tougher and shoot harder.' },
  { id: 'postroads', name: 'Post roads', at: 'tpost', line: 'Roads', age: 4, w: 5, when: '1500s', cost: { w: 390, g: 260 }, t: 66, fx: [{ s: 'trade', m: 1.1 }], need: ['roads'], desc: 'Trade pays 10% more.' },
  { id: 'customs', name: 'Customs', at: 'tpost', line: 'Roads', age: 4, w: 5, when: '1300s', cost: { w: 390, g: 260 }, t: 66, fx: [{ s: 'cut', a: 0.1 }], desc: 'Your posts take 10% more from passing trade.' },
  { id: 'looms', name: 'Warp-weighted loom', at: 'workshop', line: 'Cloth', age: 1, w: 5, when: '5000 BC', cost: { w: 100, g: 70 }, t: 28, fx: [{ s: 'make', k: 'cloth', m: 1.15 }], desc: 'Workshops make 15% more cloth.' },
  { id: 'spinwheel', name: 'Spinning wheel', at: 'workshop', line: 'Cloth', age: 2, w: 6, when: '1000s', cost: { w: 180, g: 120 }, t: 41, fx: [{ s: 'make', k: 'cloth', m: 1.3 }], desc: 'Workshops make 30% more cloth.' },
  { id: 'fulling', name: 'Fulling mill', at: 'workshop', line: 'Cloth', age: 3, w: 5, when: '1000s', cost: { w: 260, g: 180 }, t: 52, fx: [{ s: 'make', k: 'cloth', m: 1.3 }], need: ['noria'], desc: 'Workshops make 30% more cloth.' },
  { id: 'frame', name: 'Stocking frame', at: 'workshop', line: 'Cloth', age: 4, w: 5, when: '1589', cost: { w: 390, g: 260 }, t: 66, fx: [{ s: 'make', k: 'cloth', m: 1.3 }], desc: 'Workshops make 30% more cloth.' },
  { id: 'hops', name: 'Hops', at: 'workshop', line: 'Drink', age: 2, w: 4, when: '1100s', cost: { w: 150, g: 100 }, t: 35, fx: [{ s: 'make', k: 'beer', m: 1.3 }], desc: 'Workshops make 30% more beer.' },
  { id: 'brewhouse', name: 'Common brewhouse', at: 'workshop', line: 'Drink', age: 3, w: 3, when: '1300s', cost: { w: 210, g: 140 }, t: 44, fx: [{ s: 'make', k: 'beer', m: 1.2 }], desc: 'Workshops make 20% more beer.' },
  { id: 'lager', name: 'Cold brewing', at: 'workshop', line: 'Drink', age: 4, w: 3, when: '1500s', cost: { w: 310, g: 210 }, t: 55, fx: [{ s: 'make', k: 'beer', m: 1.2 }], desc: 'Workshops make 20% more beer.' },
  { id: 'dies', name: 'Engraved dies', at: 'mint', line: 'Coin', age: 3, w: 4, when: '500 BC', cost: { g: 240, i: 160 }, t: 48, fx: [{ s: 'make', k: 'gold', m: 1.2 }], desc: 'The Mint makes 20% more.' },
  { id: 'assay', name: 'Assaying', at: 'mint', line: 'Coin', age: 4, w: 5, when: '1200s', cost: { g: 390, i: 260 }, t: 66, fx: [{ s: 'make', k: 'gold', m: 1.5 }], desc: 'The Mint makes 50% more.' },
  { id: 'milled', name: 'Milled coin', at: 'mint', line: 'Coin', age: 4, w: 5, when: '1550s', cost: { g: 390, i: 260 }, t: 66, fx: [{ s: 'sell', a: 0.05 }], need: ['assay'], desc: 'Goods sell 5% dearer.' },
  { id: 'castiron', name: 'Cast iron', at: 'foundry', line: 'Furnace', age: 3, w: 6, when: '500 BC', cost: { w: 290, s: 190 }, t: 56, fx: [{ s: 'make', k: 'iron', m: 1.15 }], need: ['bellows'], desc: 'Foundries make 15% more iron.' },
  { id: 'bellows', name: 'Water bellows', at: 'foundry', line: 'Furnace', age: 3, w: 6, when: '31 AD', cost: { w: 290, s: 190 }, t: 56, fx: [{ s: 'make', k: 'iron', m: 1.2 }], desc: 'Foundries make 20% more iron.' },
  { id: 'blast', name: 'Blast furnace', at: 'foundry', line: 'Furnace', age: 4, w: 8, when: '1300s', cost: { w: 510, s: 340 }, t: 82, fx: [{ s: 'make', k: 'iron', m: 1.5 }], need: ['castiron'], desc: 'Foundries make 50% more iron.' },
  { id: 'finery', name: 'Finery forge', at: 'foundry', line: 'Furnace', age: 4, w: 5, when: '1400s', cost: { w: 390, s: 260 }, t: 66, fx: [{ s: 'make', k: 'iron', m: 1.15 }], need: ['blast'], desc: 'Foundries make 15% more iron.' },
  { id: 'cleanwater', name: 'Clean water', at: 'aqueduct', line: 'Water', age: 2, w: 7, when: '312 BC', cost: { s: 200, g: 130 }, t: 44, fx: [{ s: 'sick', m: 0.5 }], desc: 'Sickness strikes half as often.' },
  { id: 'sewers', name: 'Sewers', at: 'aqueduct', line: 'Water', age: 3, w: 7, when: '600 BC', cost: { s: 320, g: 210 }, t: 60, fx: [{ s: 'plague', m: 0.6 }], desc: 'Plague strikes 40% less.' },
  { id: 'plumbing', name: 'Plumbing', at: 'aqueduct', line: 'Water', age: 3, w: 5, when: '100s', cost: { s: 260, g: 180 }, t: 52, fx: [{ s: 'room', k: 'apartment', a: 4 }], desc: 'Apartments hold 4 more.' },
  { id: 'waterworks', name: 'Waterworks', at: 'aqueduct', line: 'Water', age: 4, w: 5, when: '1582', cost: { s: 390, g: 260 }, t: 66, fx: [{ s: 'room', k: 'apartment', a: 2 }, { s: 'sick', m: 0.8 }], need: ['pumps'], desc: 'Apartments hold 2 more; sickness strikes 20% less.' },
];
// Elite ranks (Build 39): each people's unique soldier gains a top rank at the Castle in the Medieval age, as Age of Empires' Paladin crowns its cavalry.
// Only that people can research it. Numbers first; the art (armour, a banner, a richer colour) comes in the look-and-sound build.
for (const [civ, uu, name, fx] of [
  ['roman', 'legion', 'Praetorian', { hp: 1.25, dmg: 3 }], ['han', 'hanxbow', 'Elite crossbowman', { dmg: 2, rng: 15 }], ['persian', 'immortal', 'Apple-bearer', { hp: 1.25, dmg: 2 }],
  ['mongol', 'mongolha', 'Keshig', { hp: 1.2, dmg: 2, spd: 1.08 }], ['maurya', 'mauryael', 'Royal elephant', { hp: 1.25, dmg: 3 }], ['mali', 'malihorse', 'Elite horseman', { hp: 1.2, dmg: 2, spd: 1.08 }],
]) TECH.push({ id: 'elite_' + civ, civ, name: `Elite: ${name}`, at: 'castle', age: 3, cost: { f: 400, g: 400, i: 150 }, t: 60, tier: { unit: uu, name, ...fx }, line: 'Elite', w: 6, when: 'Medieval', desc: `The soldiers of your people become ${name}s, their finest: tougher, harder hitting.` });
const TECHBY = Object.fromEntries(TECH.map(t => [t.id, t]));

// Six civilisations: one unique unit (replaces a common one, same role, a little better), one small bonus, one wonder (same cost and effect for all).
const CIVS = {
  roman:   { name: 'Roman', uu: 'legion',   fx: [{ s: 'build', m: 0.85 }], bonus: 'Engineers: buildings go up 15% faster.', wonder: 'Colosseum' },
  han:     { name: 'Han', uu: 'hanxbow',  fx: [{ s: 'crop', k: 'food', m: 1.1 }], bonus: 'Iron ploughs and new field systems: fields give 10% more food.', wonder: 'Weiyang Palace' },
  persian: { name: 'Persian', uu: 'immortal', fx: [{ s: 'trade', m: 1.2 }], bonus: 'The Royal Road: caravans earn 20% more.', wonder: 'Apadana of Persepolis' },
  mongol:  { name: 'Mongol', uu: 'mongolha', fx: [{ s: 'spd', k: '#mounted', m: 1.1 }], bonus: 'Every rider kept spare horses: everything on horseback is 10% faster.', wonder: 'Karakorum and the Silver Tree' },
  maurya:  { name: 'Maurya', uu: 'mauryael', fx: [{ s: 'train', k: '#mounted', m: 0.75 }], bonus: 'The king held all horses and elephants: everything on horseback trains 25% faster.', wonder: 'Great Stupa at Sanchi' },
  mali:    { name: 'Mali', uu: 'malihorse', fx: [{ s: 'gather', k: 'gold', m: 1.15 }], bonus: 'The gold fields: gold gathered 15% faster.', wonder: 'Djinguereber Mosque' },
};
const CIVK = Object.keys(CIVS);
// The unique units: each takes the place of a common one for its civilisation only.
Object.assign(UNIT, {
  legion:   { ...UNIT.sword,   name: 'Legionary', civ: 'roman', replaces: 'sword', hp: 80, dmg: 9, look: 'legion', desc: 'Heavy infantry with a throwing spear and a short sword. Beats other foot soldiers and breaks buildings faster.' },
  hanxbow:  { ...UNIT.crossbow, name: 'Han crossbowman', civ: 'han', replaces: 'crossbow', age: 2, cd: 2.0, look: 'crossbow', desc: 'The crossbow a whole age early, and quicker to reload.' },
  immortal: { ...UNIT.sword,   name: 'Immortal', civ: 'persian', replaces: 'sword', hp: 75, vs: { infantry: 1.5, mounted: 1.6, siege: 2 }, look: 'immortal', desc: 'Elite guard with spear, bow and wicker shield. Beats foot soldiers and holds against horse.' },
  mongolha: { ...UNIT.harcher, name: 'Mongol horse archer', civ: 'mongol', replaces: 'harcher', rng: 90, spd: 40, look: 'harcher', desc: 'Shoots farther and rides faster than any other horse archer.' },
  mauryael: { ...UNIT.elephant, name: 'Maurya war elephant', civ: 'maurya', replaces: 'elephant', hp: 320, look: 'elephant', desc: 'The royal elephant corps: a quarter tougher than any other war elephant.' },
  malihorse:{ ...UNIT.cata,    name: 'Mali horseman', civ: 'mali', replaces: 'cata', hp: 135, spd: 38, look: 'malihorse', desc: 'Mali\'s standing cavalry, with lance and bow: tougher and quicker than a cataphract.' },
});
const ARMYK = Object.keys(UNIT).filter(k => UNIT[k].cls === 'army'), SOLDIERK = Object.keys(UNIT).filter(k => UNIT[k].tick === 'sol');   // counted once every unit, the peoples' own included, is in the table

// What you can find in the wild. Each corner gets the same set, turned toward the middle.
// guard: [real kind, fantasy kind, how many]. got: what the first side to reach it (guards dead) takes. fantasy adds half.
const FINDS = {
  chest:    { name: 'Treasure chest', guard: ['wolf', 'direwolf', 2], got: { f: 100, g: 150 }, desc: 'Someone buried this and never came back. Kill the guards, then touch it.' },
  ruins:    { name: 'Ruins', guard: ['bandit', 'goblin', 3], got: { g: 50 }, tech: true, desc: 'An old library in ruins, held by outlaws. Clear it and you find a scroll: one research of your age, free.' },
  cemetery: { name: 'Old cemetery', guard: ['robber', 'skeleton', 2], got: { g: 250 }, desc: 'Grave goods, and grave robbers already at work. Clear them and the gold is yours.' },
  camp:     { name: 'Robbers\' camp', guard: ['robber', 'troll', 4], got: { f: 200, w: 200, g: 250 }, desc: 'Robbers who prey on caravans and villagers near the map edge. Break the camp and take its hoard.' },
  den:      { name: 'Bear den', guard: ['bear', 'bear', 1], got: { f: 60 }, desc: 'A bear and its stores. The meat is good too.' },
  stop:     { name: 'Trade stop', guard: ['bandit', 'goblin', 3], stop: true, desc: 'A stop on an old trade route. Caravans sell goods here and buy spice. Clear its guards and build a Trade post to own it.' },
  shrine:   { name: 'Shrine', capture: 10, pay: 0.25, desc: 'The one holy site, at the foot of the Throne. Stand a priest by it for 10 s and it pays its keeper 15 gold a minute. Another side\'s priest can take it back.' },
  vagabonds:{ name: 'Vagabonds', hire: { cost: { g: 90 }, unit: 'spear', n: 3 }, desc: 'Three drifters will fight for whoever pays 90 gold. A unit of yours has to be within 80.' },
  mercs:    { name: 'Mercenaries', hire: { cost: { g: 240 }, unit: 'sword', n: 6 }, gone: 180, desc: 'A free company camped by the road: six swords for 240 gold, for three minutes, then they move on.' },
  meteor:   { name: 'Fallen star', got: { i: 300, g: 100 }, desc: 'Iron from the sky. Before smelting, this was where iron came from; Tutankhamun\'s dagger was forged from it.' },
};
const WAYFARER_EVERY = 240;
// the Fortress posts a job: break one guarded find, first side to take it is paid
// ───────────────────────── The Natives: the fifth side, with one brain ─────────────────────────
// They hold the Throne, a citadel on the great lake's island, reached by four causeways (the choke points). Their regard for each side moves
// with gifts, blows and time; at PEACE they leave you be, at ALLY their gate opens. Gifts follow the Danegeld rule: each one buys less than
// the last. Pits and nets on the causeways; prisoners for ransom; outlaw raids on whoever they regard least. They command the camps.
const NATIVE = { regard0: 20, peaceAt: 40, allyAt: 70, decay: 0.1, hitCost: 2, gifts: [100, 300], danegeld: 0.5, giftWindow: 600, garrison: 24, perAge: 8, regrow: 20, ambush: 1.3, gunAge: 4, gunMax: 0.6, gunRegrow: 2, gunHit: 1.5,
  traps: 4, trapR: 10, pit: 0.4, stuck: 4, relay: 90, scoutSees: 60, raidEvery: 180, raidN: 4, raidSecs: 45, handover: 60, handoverMen: 8 };
const THRONE = { hold: 900, tithe: 0.1, score: 50, r: 80, isle: 100, cause: 30 };   // hold: seconds to win in a 60-minute game (scaled to the game's length); tithe of every other side's gathering; score a minute

// The three computer personalities: one brain, three settings. Every behaviour is a field, never a name check.
// build: [kind, from age, how many, needs army of at least, needs stock]; techs in the order they want them.
const PERS = {
  aggr: { vils: 16, mix: { food: .5, wood: .35, gold: .15, stone: 0, iron: .08 }, ageTo: 2, extraBarracks: 1, armyCap: 34, waveMin: 5, bold: .5, guard: .15, raid: 3, towers: 0, walls: false,
          early: 6, ageArmy: 6, diplo: true, trade: true, spy: true, loot: true, wonder: false, siege: 1, shrine: false,
          build: [['barracks', 0, 1, 0], ['range', 1, 1, 0], ['stable', 1, 1, 4], ['smith', 1, 1, 6], ['market', 1, 1, 6, { w: 250, g: 100 }], ['courthouse', 1, 1, 8, { w: 250, g: 100 }], ['siege', 2, 1, 10, { w: 300 }], ['council', 2, 1, 12, { w: 250, s: 150 }]],
          techs: ['drill', 'bronze', 'axes', 'plough', 'horses', 'leather', 'composite', 'iron', 'cavalry', 'engage', 'phalanx', 'chain'] },
  bal:  { vils: 26, mix: { food: .4, wood: .3, gold: .2, stone: .1, iron: .1 }, ageTo: 4, extraBarracks: 0, armyCap: 34, waveMin: 10, bold: .65, guard: .3, raid: 2, towers: 1, walls: true,
          early: 12, ageArmy: 0, diplo: true, trade: true, spy: true, loot: true, wonder: true, siege: 2, shrine: true,
          build: [['barracks', 0, 1, 0], ['range', 1, 1, 0], ['smith', 1, 1, 0], ['stable', 1, 1, 4], ['market', 1, 1, 6, { w: 250, g: 100 }], ['school', 1, 1, 8, { w: 300, s: 100 }], ['temple', 1, 1, 10, { s: 450, g: 300 }], ['courthouse', 1, 1, 8, { w: 250, g: 100 }],
                  ['siege', 2, 1, 8, { w: 300, s: 100 }], ['hospital', 2, 1, 10, { w: 250, s: 200 }], ['library', 2, 1, 10, { w: 400, s: 300 }], ['council', 2, 1, 12, { w: 250, s: 150 }], ['quarry', 2, 1, 8, { w: 150 }], ['foundry', 3, 1, 10, { s: 400, w: 300 }], ['mint', 3, 1, 10, { s: 500, g: 300 }]],
          techs: ['axes', 'picks', 'plough', 'bronze', 'leather', 'drill', 'coppice', 'composite', 'writing', 'maths', 'horses', 'iron', 'chain', 'engage', 'phalanx', 'cavalry', 'deep', 'masonry', 'architecture', 'medicine', 'roads', 'coinage', 'ovens', 'rotation', 'wheelbarrow', 'arms', 'knighthood', 'longbow', 'plate', 'heavyplough', 'pikesquare', 'slits', 'fortify', 'muster'] },
  fort: { vils: 28, mix: { food: .4, wood: .3, gold: .15, stone: .15, iron: .08 }, ageTo: 3, extraBarracks: 0, armyCap: 30, waveMin: 12, bold: .85, guard: .5, raid: 1, towers: 3, walls: true, opportunist: 1.3,
          early: 12, ageArmy: 0, diplo: true, trade: true, spy: true, loot: true, wonder: true, siege: 1, shrine: true,
          build: [['barracks', 0, 1, 0], ['range', 1, 1, 0], ['smith', 1, 1, 0], ['stable', 1, 1, 6], ['school', 1, 1, 6, { w: 300, s: 100 }], ['temple', 1, 1, 8, { s: 450, g: 300 }], ['courthouse', 1, 1, 6, { w: 250, g: 100 }], ['quarry', 2, 1, 6, { w: 150 }], ['foundry', 3, 1, 8, { s: 400, w: 300 }],
                  ['hospital', 2, 1, 8, { w: 250, s: 200 }], ['library', 2, 1, 8, { w: 400, s: 300 }], ['aqueduct', 2, 1, 8, { s: 400 }], ['castle', 3, 1, 12, { s: 1100, w: 400 }], ['council', 2, 1, 10, { w: 250, s: 150 }]],
          techs: ['masonry', 'leather', 'axes', 'picks', 'bronze', 'plough', 'coppice', 'writing', 'maths', 'chain', 'iron', 'drill', 'deep', 'architecture', 'medicine', 'slits', 'rotation', 'wheelbarrow', 'engage', 'phalanx', 'fortify', 'plate', 'heavyplough', 'pikesquare', 'longbow'] },
};
const TRADE = { f: 80, w: 80, s: 110, i: 120 }, TRADE_CAP = 80, TRADE_DIV = 16000, SELL = 0.8, BUY = 1.25;   // TRADE_CAP, TRADE_DIV: an ally run pays distance² ÷ 16000, at most 80 gold
const ZEAL = { cost: { g: 60 }, secs: 45, cd: 120, mul: 1.2 };
const SAB = { burn: 0.6, stall: 40 };
const FLANK = 1.3;      // a blow from behind lands 30% harder
// ───────────────────────── Combat you steer: nerve, flanks, charge and fall back, prisoners, conversion ─────────────────────────
// Every soldier has nerve (0..1). Blows drain it by the share of health they take, times hit (a flank blow twice, a rear blow three times), being outnumbered drains it, losses beside it drain it;
// quiet restores it, as do a wall or tower of its own, its Town Center, a priest, and Engagement at the War Council (a floor). At zero it routs:
// runs for home for a spell, takes more harm, and can be taken prisoner by any foe who lays a hand on it. Most real battles ended in a rout.
const MORALE = { hit: 1.2, side: 2, rear: 3, kill: 0.04, loss: 0.03, odds: 0.02, rest: 0.03, shelter: 0.02, priest: 0.03, priestR: 120, floor: 0.2, rout: 8, routHit: 1.5, routSpd: 1.3, after: 0.35, capR: 10 };
const CHARGE = { secs: 6, spd: 1.5, dmg: 1.3, tired: 10, tiredSpd: 0.8, cd: 30 };   // a burst, then tired
// The ground remembers the weather: rain leaves mud for days, frost leaves ice, a blizzard leaves snow. Each is 0..1 and shows on the map.
// Research at the Library (Weather line), Stable (horseshoes), Barracks (cloaks) and Smithy (tempering, oiling) takes the edge off, never all of it at once.
const GROUND = { rain: 0.004, storm: 0.01, dry: 0.0008, mudSlow: 0.35,   // mud: a second of rain adds, a dry second takes; at full mud marching is a third slower
  frost: 0.006, thaw: 0.003, slip: 0.02, slipSecs: 1.5,   // ice: a chance a second of a slip that holds a man in place
  blizzard: 0.012, melt: 0.0015, snowSlow: 0.3, miss: 0.5, missHurt: 0.08,   // snow: marching slower; an engine slides and its shot falls short, hurting its own crew
  wear: 0.15 };   // frost makes blades brittle and rain rusts them: weapons do 15% less until tempered and oiled
const FIREARMS = { chance: 0.12, blast: 0.3, splash: 40, splashHit: 0.3 };   // fire arrows and burning shot ignite a wooden building on a hit (rain halves it); a petard bombard ignites and shakes the neighbours too
const GARRISON = { r: 70, heal: 0.6 };   // soldiers resting by their own Castle, Barracks or Town Center heal; Garrison wards double it
const TEACH = { seats: 4, mul: 1.5, tuition: 40 };   // Teach: a soldier learns a newer kind at the School, four at a time; time ×1.5 per age climbed, tuition in gold per age; opened by Veterans
const TEACH_TO = { spear: 'sword', archer: 'crossbow', jav: 'arquebus', crossbow: 'arquebus', chariot: 'cata', harcher: 'cata', ram: 'catapult', catapult: 'treb', ballista: 'bombard' };   // what a soldier can be taught to become
const FALLBACK = { secs: 6, back: 200, hit: 0.7 };   // withdraw in order: fewer losses than a rout
const PRISON = { secs: 180, ransom: 1.0 };   // a prisoner unransomed in three minutes serves the captor
const CONVERT = { r: 40, secs: 12, cd: 60 };   // a priest beside an enemy for a spell turns them; the counter is to kill the priest
const BUILDER_POW = 0.7;   // a crew of n builds n^0.7 times as fast as one: two builders ≈ 1.6×, three ≈ 2.1×
// Formations (research Formations at the War Council): each battalion takes one. spd: march speed; hit: damage taken; dmg: damage dealt by its riders; vsMounted: damage taken from riders
const FORM = [
  { name: 'Line',   shape: 'line',   note: 'as they stand' },
  { name: 'Column', shape: 'column', spd: 1.15, hit: 1.1, note: '15% faster, 10% more damage taken' },
  { name: 'Wedge',  shape: 'wedge',  dmg: 1.15, hit: 1.1, note: 'riders hit 15% harder, take 10% more' },
  { name: 'Square', shape: 'square', spd: 0.8, vsMounted: 0.7, note: '30% less from riders, 20% slower' },
];
const GRID = { gap: 15, rows: 2.0 };   // an army stands in a grid: 15 apart, about twice as wide as deep
const FIELD_NEAR = 160;   // a Food worker takes a free field within this before anything else
const DOCKR = 150;     // fish are caught only within 150 of a finished dock of yours
const KITE = 45;        // a shooter steps back from a foe this close while it reloads
// a battalion's stance (the computers choose theirs: shooters skirmish, foot at home hold a wall)
const STANCE = [
  { name: 'Line', note: 'fight as they stand' },
  { name: 'Shield wall', hit: 0.8, spd: 0.65, note: 'foot soldiers take a fifth less damage and march a third slower' },
  { name: 'Skirmish', note: 'shooters step back from anyone who closes in while they reload' },
];
const SHELTER = { flee: 70, clear: 150, raid: 3, hurt: 6 };   // villagers run into the nearest Town Center or tower when an enemy soldier comes within 70, when three or more beasts or robbers do, or when a lone beast or robber hits them (it scares only the one it hits); out when none within 150 of it; each adds an arrow up to the limit (the room is the same)
const SCORE = { unit: 5, bld: 5, tech: 5, wealth: 10 }; // score = value held / 5, research / 5, everything gathered / 10

// ───────────────────────── The world's own numbers: weather, soil, sickness, the trade routes, the market ─────────────────────────
const FERT = { loss: 0.1, floor: 0.6, rest: 0.4 };    // soil: 10% a year worked, never below 60%; a season of rest gives back 40%
const HARVEST = [{ p: 1 / 20, m: 0.5, text: 'A failed harvest this year: fields give half.' }, { p: 1 / 6, m: 0.7, text: 'A poor harvest this year: fields give 30% less.' }];
const WEATHER = {
  clear:   { name: 'Clear' },
  rain:    { name: 'Rain',    spd: 0.8, rng: 0.85, fire: 0.5, text: 'Rain: marching is slower and bows reach less.' },
  drought: { name: 'Drought', crop: 0.7, fire: 2,           text: 'Drought: fields give 30% less and fires spread fast.' },
  frost:   { name: 'Frost',   stone: 0.5,                    text: 'Frost: mortar will not set, stone buildings go up at half speed.' },
  blizzard:{ name: 'Blizzard', spd: 0.6, sight: 0.35, gather: 0.5, fire: 0.3, text: 'Blizzard: a whiteout. Marches crawl, sight is gone, gathering halves.' },   // Harsh winters only
};
const WX_ODDS = { Spring: { rain: 0.45 }, Summer: { drought: 0.3, rain: 0.15 }, Autumn: { rain: 0.45 }, Winter: { frost: 0.6 } }, WX_EVERY = 60;
const MOON = 8;   // days from new moon to new moon (the real month is 29.5; the game's day is two minutes): at new moon the night is darker and sight shorter

// ───────────────────────── The Challenge: hazards you switch on. Their points are your level; the level multiplies your score ─────────────────────────
// Random when, never random whether: everything a hazard sends is announced first. Easy keeps the old polite game whatever is switched on.
const HAZARDS = {
  hard:   { pts: 3, name: 'Hard enemies', desc: 'They strike in winter, send more riders at your villagers and drop-offs, and need shorter odds.' },
  starve: { pts: 2, name: 'Starvation', desc: 'No food for a minute: work stops. After two, a villager leaves and a soldier deserts every half minute.' },
  winter: { pts: 2, name: 'Harsh winters', desc: 'Winter fields give a quarter, marches crawl, and blizzards come: whiteouts that blind the small map.' },
  plague: { pts: 2, name: 'Plague', desc: 'Plague is three times as likely and spreads twice as fast along the roads. Hospitals matter.' },
  horde:  { pts: 3, name: 'The horde', desc: 'Between minute 20 and 40 a horde comes, from an edge or out of the wild, for the weakest side. Announced two seasons ahead.' },
  quake:  { pts: 2, name: 'Earthquakes', desc: 'Tremors come every few minutes and hit harder: stone cracks, walls fall, wood catches fire.' },
  notips: { pts: 1, name: 'No tips', desc: 'The advisor is silent.' },
};
const HZK = Object.keys(HAZARDS), HZ_DEFAULT = { hard: 1, starve: 1 }, TODAY_HZ = { hard: 1, starve: 1, horde: 1, quake: 1 };   // a new game starts at level 5; Today's challenge is level 10 on the day's seed
const STARVE = { stop: 60, leave: 120, every: 30 }, HARD = { bold: -0.1, raid: 2, winterBold: -0.2, waitForWinter: 90 }, HORDE = { from: 1200, to: 2400, warn: SEASON_LEN * 2, n: 16, perAge: 6 }, QUAKE = { every: 240, r: 350, hit: 0.1, wall: 0.3, fire: 0.15 };
// Spectacle: something happens every minute or three, announced WARN seconds ahead; gorgeous first, mostly harmless, always real. Each entry's numbers; the doing is in 19-events.
const EV_GAP = [60, 180], EV_WARN = 12;
const EVENTS = {
  eclipse:  { name: 'Eclipse',        secs: 20,  dmg: 0.6, spd: 0.7, sight: 0.7, harm: 1 },
  storm:    { name: 'Thunderstorm',   secs: 40,  band: 260, strike: 2 },
  stampede: { name: 'Stampede',       secs: 30,  n: 10, harm: 1 },
  flood:    { name: 'Flood',          secs: 90,  rise: 40, hit: 0.02, harm: 1 },
  locusts:  { name: 'Locusts',        secs: 30,  r: 70, strip: 90, harm: 1 },
  meteor:   { name: 'Falling star',   secs: 3 },
  wildfire: { name: 'Wildfire',       secs: 60,  spread: 0.2, r: 32, burn: 0.12, most: 20, need: 'drought', harm: 1 },   // most: trees alight at once
  fog:      { name: 'Fog',            secs: 60,  sight: 0.4 },
  tremor:   { name: 'Tremor',         secs: 2,   r: 220, hit: 0.05, wall: 0.2, fire: 0.05 },
  sinkhole: { name: 'Sinkhole',       secs: 2,   hit: 0.4 },
  quicksand:{ name: 'Quicksand',      secs: 120, r: 60, slow: 0.3 },
  heatwave: { name: 'Heat',           secs: 60,  dmg: 0.85, spd: 0.9, need: 'drought', season: 'Summer' },
  mirage:   { name: 'Mirage',         secs: 30,  n: 12, season: 'Summer' },
  circus:   { name: 'Travelling show', secs: 60, n: 5, r: 150, cheer: 120, mul: 1.1, gift: 1 },
  wagon:    { name: 'Wagon train',    secs: 90, gift: 1 },
  mercs:    { name: 'Mercenaries',    secs: 180, gift: 1 },
  dragon:   { name: 'Dragon',         secs: 25,  fantasy: true, harm: 1 },
  troll:    { name: 'Troll',          secs: 90,  fantasy: true },
  aurora:   { name: 'Northern lights', secs: 45, fantasy: true, night: true },
};
const EVK = Object.keys(EVENTS), NEWS_EVERY = 150;
// two old trade routes, west to east and north to south, each with four stops; they bend around the great lake
const ROUTES = [[[510, 1000], [680, 1000], [1320, 1000], [1490, 1000]], [[1000, 510], [1000, 680], [1000, 1320], [1000, 1490]]];
const POST = { all: 2, cut: [0, 0.2, 0.25, 0.3, 0.4], safe: 120, guard: 12, far: 2.5, want: 1.5 };   // each route has four stops. all: gold a second to whoever holds all four of a route; cut: of other sides' sales at a stop, by how many of its route you hold; guard: soldiers per stop or caravan
const HEALTH = { every: 60, risk: 0.06, sickFor: 60, spread: 0.08, death: 0.004, cure: 0.3, plague: 0.15, plagueCap: 0.1 };   // risk: the chance a minute that sickness breaks out
const MKT_SELL = ['f', 'w', 's', 'i', ...WARES], MKT_BUY = ['f', 'w', 's', 'i', 'spice'];   // wool goes to a Weaver, not to market; spice is the only good not made here
const MKTK = [...GOODK, 'f', 'w', 's', 'i'];
const RATE_OF = { bush: 0.9, fish: 0.8, tree: 0.75, stone: 0.55, gold: 0.6, iron: 0.5, meat: 1.2 };   // what a villager gathers a second from each kind of find (fields carry their own rate)

// The land's character: each game rolls one, the same for all four corners (fair), so no two games share a map. amt: what each resource
// is worth there; extra: one more deposit of its specialty, farther out; spread: how far the rings may stretch; turn: how far the home pocket may swing.
const LAND = {
  fertile: { name: 'Fertile land', amt: { food: 1.4, wood: 1, stone: 0.8, gold: 1, iron: 1 }, extra: 'bush' },
  timber:  { name: 'Timberland',   amt: { food: 1, wood: 1.35, stone: 1, gold: 0.8, iron: 1 }, extra: null },
  stony:   { name: 'Stony hills',  amt: { food: 0.85, wood: 1, stone: 1.5, gold: 1, iron: 1.2 }, extra: 'stone' },
  golden:  { name: 'Gold country', amt: { food: 1, wood: 0.85, stone: 1, gold: 1.5, iron: 1 }, extra: 'gold' },
};
const LANDK = Object.keys(LAND), SPREAD = [0.85, 1.25], TURN = 0.5;
