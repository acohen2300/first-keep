// ═════ 00-elements.js: the cards, one an element (Albert, Nov 4: names, not numbers; a slot missing refuses the build) ═════
// A card says where an element lives: every name on it points at one thing that exists. The slots (docs/0 Index/00 Books.md):
//   impacts    the resources or node kinds it changes            acts      the functions that are its behaviour
//   logic      the tables and functions it reads                 math      its equations, by their name in SCIENCE.md
//   orders     the player's verbs on it (ACT, PLAY)                  pings     the counts it reports (functions)
//   buildings  the buildings it works at (BLD)                   layers    the layers of the board it writes to (LAYERS)
//   art        the drawing it uses                               exempt    what it never touches: a name that must not appear in its acts' files
// build.py refuses a card with a slot missing, a name in acts, logic, pings or art that is not declared exactly once, or a layer not in LAYERS;
// tests/elements.py (the gate) checks the rest against the running game. INDEX.md prints every card; tests/index.py --diff logs what changed.
// This file runs alone under node (no game in scope), so it holds names as strings and nothing else.
const LAYERS = ['ground', 'water', 'forest', 'plots', 'movers', 'weather', 'units', 'buildings', 'menus']; // Albert's layers, Nov 4
const ELEMENTS = {
	gather: {
		impacts: ['food', 'wood', 'stone', 'gold', 'iron', 'bush', 'tree', 'fish'],
		acts: ['vilTick', 'makeNow', 'forage', 'bestNode', 'nearestNode', 'pickVil', 'setJob', 'leaveWork', 'waitAt', 'backToWork'],
		logic: ['moveTo', 'astar', 'dropFor', 'carryOf', 'gatherMul', 'forageNow', 'findCap', 'crowd', 'unsafe', 'dangerWhy', 'SEARCH', 'REACH', 'WORK_R', 'RATE_OF', 'FORAGE', 'CARRY', 'SHELTER'],
		math: ['forage', 'SEARCH', 'UPKEEP'],
		orders: ['job', 'sendvil', 'vstop', 'vfocus', 'vhome', 'idlego', 'pjob'],
		pings: ['popOf', 'freeVil'],
		buildings: ['keep', 'mill', 'lumber', 'mining', 'dock'],
		layers: ['units'],
		art: ['person', 'WORKTOOL', 'LOOKS', 'drawUnit'],
		exempt: ['lakeGrid', 'makeWater', 'drawFlood'],
	},
};
