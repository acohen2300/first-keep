// ═════ 10-world-movers.js: layer 5, Movers: the first people, the game, the boar, the finds that walk or are carried off, the camps ═════
// Their spots were claimed before the forest (laySpots in makeMap, so the trees leave them their clearings); here they are placed in them.
function layMovers(p, kx, ky, spot, shape, P) {
	const f = towardMid({ x: kx, y: ky }, PLACES.start, LMID);
	for (let i = 0; i < START_VILS; i++) {
		const v = addUnit(p.id, 'vil', f.x + (i - (START_VILS - 1) / 2) * 14, f.y + 6);
		v.job = i === 1 ? 'wood' : 'food';
	}
	const sc = towardMid({ x: kx, y: ky }, 60, LMID);
	addUnit(p.id, 'scout', sc.x, sc.y);
	// the wild near home: two herds of game, and danger a little farther out
	for (const id of ['deerA', 'deerB'].filter((id) => spot[id])) for (const o of shape[id]) wildAt('deer', ...P(id)(...o));
	if (spot.boar) wildAt('boar', ...P('boar')(0, 0));
	for (const id of ['chest', 'ruins', 'den', 'cemetery', 'vagabonds'].filter((id) => spot[id])) addFind(id, ...P(id)(0, 0));
}
// a robbers' camp at the middle of each map edge, at the end of a trade route
function layCamps() {
	for (const [x, y] of cross(LMID - PLACES.camp)) addFind('camp', x, y);
}
function wildAt(kind, x, y, find) {
	const u = addUnit(WILD, kind, x, y);
	u.hx = x;
	u.hy = y;
	if (find) u.find = find.id;
	return u;
}
function addFind(kind, x, y) {
	const F = FINDS[kind],
		f = { id: NID++, kind, x, y, owner: null, cap: null, done: false, guards: [] };
	if (F.guard) {
		const [real, fan, n] = F.guard,
			gk = G.fantasy ? fan : real;
		for (let i = 0; i < n; i++) {
			const a = (i / n) * 6.28 + rnd(0, 1);
			f.guards.push(wildAt(gk, x + Math.cos(a) * 26, y + Math.sin(a) * 26, f).id);
		}
	}
	if (F.hire) for (let i = 0; i < F.hire.n; i++) wildAt('vagabond', x + (i - 1) * 12, y + 14, f);
	G.finds.push(f);
	return f;
}
