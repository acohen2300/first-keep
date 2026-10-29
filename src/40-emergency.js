// ═════ 40-emergency.js: Shelter, Battle stations, All hands on deck, Resume ═════
// One ranking for everyone: buildings that shelter, the sturdiest first (current hit points, then room); each is filled to its room with the nearest units who can go there;
// whoever is left over goes to a safe spot behind the Town Center. Villagers go in and stay until Resume (a note of each one's job and spot is kept).
// Soldiers who garrison a building add an arrow like villagers do and stay in the plan (DEFENDING) until you give them a new order; Resume does not touch them.
const EMERGENCY = [
	['shelter', 'Shelter', 'villagers take cover'],
	['battle', 'Battle stations', 'soldiers to the walls and the line'],
	['hands', 'All hands on deck', 'villagers and soldiers'],
];
const EMG = { line: 110, row: 12, perRow: 12, behind: 60 };
const shelterRank = () =>
	G.blds
		.filter((b) => b.owner === 0 && b.hp > 0 && b.prog >= 1 && BLD[b.kind].shelter)
		.sort((a, b) => b.hp - a.hp || shelterOf(0, b.kind) - shelterOf(0, a.kind));
const roomIn = (b) =>
	shelterOf(b.owner, b.kind) -
	G.units.filter((u) => (u.hid === b.id && u.inside) || (u.state === 'garrison' && u.gar === b.id)).length;
// the way the danger lies from the Town Center: the attack coming, else the nearest threat, else across the map
function threatDir(k) {
	const t = G.incoming || nearest(G.threats, k, (v) => atWar(0, v.owner), 700) || { x: MID, y: MID },
		d = hyp(t.x - k.x, t.y - k.y) || 1;
	return { x: (t.x - k.x) / d, y: (t.y - k.y) / d };
}
// fill the ranked buildings with the nearest of these units (shooters first when asked); what is left over is returned
function fillRank(units, pick) {
	let rest = units.slice();
	for (const b of shelterRank()) {
		const take = rest
			.sort((p, q) => (pick.first ? pick.first(p) - pick.first(q) : 0) || dist(p, b) - dist(q, b))
			.slice(0, Math.max(0, roomIn(b)));
		take.forEach((u) => pick.into(u, b));
		rest = rest.filter((u) => !take.includes(u));
	}
	return rest;
}
// once, at the first call: the picture Resume goes back to, every villager's work and every battalion's temper
// (Build 48: Battle Stations kept no picture, so its Hold stayed on every battalion for good)
function emgSnap(kind) {
	if (!G.emg)
		G.emg = {
			kind,
			snap: unitsOf(0, 'vil').map((u) => ({ id: u.id, job: u.job, nid: u.node ? u.node.id : null, post: u.post })),
			temper: G.temper.slice(),
		};
}
function villagersIn() {
	const V = unitsOf(0, 'vil'),
		k = keepOf(0);
	const left = fillRank(V, {
		into: (u, b) => {
			u.emg = true;
			u.scared = true;
			u.safe = null;
			u.hid = b.id;
		},
	});
	if (!k) return;
	const d = threatDir(k);
	left.forEach((u, i) => {
		u.emg = true;
		u.scared = true;
		u.hid = 0;
		u.safe = {
			x: clamp(k.x - d.x * EMG.behind + (i % 6) * 10 - 25, 20, MAP - 20),
			y: clamp(k.y - d.y * EMG.behind + Math.floor(i / 6) * 10, 20, MAP - 20),
		};
	});
}
function soldiersIn() {
	hudAbortAll();
	const k = keepOf(0),
		S = armyOf(0).filter((u) => isSoldier(u) && u.state !== 'escort' && u.state !== 'rout');
	if (!k || !S.length) return;
	for (const u of S) {
		u.ord = undefined;
		u.focus = u.tgt = null;
		u.fid = null;
	}
	const left = fillRank(S, {
		first: (u) => (UNIT[u.kind].rng > 20 ? 0 : 1),
		into: (u, b) => {
			u.state = 'garrison';
			u.gar = b.id;
		},
	});
	const d = threatDir(k),
		cx = k.x + d.x * EMG.line,
		cy = k.y + d.y * EMG.line;
	G.temper = Array(BNS + 1).fill(T_HOLD); // hold: they fight what comes within reach and keep the line
	left.forEach((u, i) => {
		const row = Math.floor(i / EMG.perRow),
			col = (i % EMG.perRow) - (Math.min(left.length, EMG.perRow) - 1) / 2;
		u.state = 'goto';
		u.px = clamp(cx - d.x * row * EMG.row - d.y * col * EMG.row, 20, MAP - 20);
		u.py = clamp(cy - d.y * row * EMG.row + d.x * col * EMG.row, 20, MAP - 20);
		u.idleT = 0;
	});
}
function emgStart(kind) {
	emgSnap(kind);
	if (kind === 'battle' || kind === 'hands') soldiersIn(); // soldiers first: the strongest places are theirs
	if (kind === 'shelter' || kind === 'hands') villagersIn();
	if (G.emg) G.emg.kind = kind;
	say(`${EMERGENCY.find((e) => e[0] === kind)[1]}.`, 'warn', 4);
	feel('crack');
}
// Resume: every villager back to what it was doing; soldiers stay where the plan put them
function emgResume() {
	if (!G.emg) return;
	for (const n of G.emg.snap) {
		const u = G.units.find((v) => v.id === n.id && v.hp > 0),
			node = n.nid && G.nodes.find((x) => x.id === n.nid && x.amt > 0);
		if (!u) continue;
		u.emg = false;
		u.scared = false;
		u.safe = null;
		if (u.inside) {
			const b = G.blds.find((x) => x.id === u.hid);
			u.inside = false;
			if (b) {
				u.x = b.x + u.ox * 0.8;
				u.y = b.y + 30;
			}
		}
		u.hid = 0;
		setJob(u, n.job, node && node.farm ? node : null);
		if (node && !node.farm) u.node = node;
		u.post = n.post;
	}
	if (G.emg.temper) G.temper = G.emg.temper;
	G.emg = null;
	say('Back to work.', 'good', 3);
}
CARDS.emergency = () => {
	const I = G.incoming,
		kids = unitsOf(0, 'vil').length,
		def = armyOf(0).filter((u) => u.state === 'garrison').length;
	return (
		title('Emergency', G.emg ? EMERGENCY.find((e) => e[0] === G.emg.kind)[1] : 'calm') +
		(I
			? `<p data-act="jump:${Math.round(I.x)},${Math.round(I.y)}"><b>${I.n}</b> ${I.what} · ${I.eta} s away · tap to go</p>`
			: '') +
		acts(
			btn('emg:shelter', 'Shelter', `${kids} villagers`, kids ? 'warn' : 'dis') +
				btn('emg:battle', 'Battle stations', def ? `${def} defending` : 'soldiers', 'warn'),
		) +
		acts(
			btn('emg:hands', 'All hands on deck', 'everyone', 'warn') +
				btn('emgresume', 'Resume', 'villagers back to work', G.emg ? 'go' : 'dis'),
		) +
		fold(
			'why',
			'How it works',
			`<p>Buildings that shelter are filled sturdiest first, each with the nearest units; any left over wait behind the Town Center. Soldiers inside add arrows and stay defending until you send them somewhere. Resume sends the villagers back to their jobs.</p>`,
		)
	);
};
