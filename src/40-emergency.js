// ═════ 40-emergency.js: Emergency: Stop, Town square, All hands, Shelter ═════
// Four orders (MENU-SPEC §8, picture Easy Cards). At the first of them the game notes the picture Stop goes back to: every villager's work
// and spot, and the squads' tempers. Town square: everyone, villagers and soldiers, gathers round the Town Center, each on its own side of
// it. All hands: villagers and soldiers fight from the buildings: one ranking for everyone, the buildings that shelter, the sturdiest first
// (current hit points, then room), each filled to its room with the nearest; soldiers first, shooters before them, and the soldiers left
// over hold a line toward the danger. Shelter: the villagers alone, the same way. Villagers left over wait behind the Town Center. Stop:
// every villager back to its work; soldiers stay where the order put them (a garrison adds arrows, DEFENDING) until you send them.
const EMERGENCY = [
	['square', 'Town square', 'everyone to the Town Center'],
	['hands', 'All hands', 'villagers and soldiers fight'],
	['shelter', 'Shelter', 'villagers inside'],
];
const EMG = { line: 110, row: 12, perRow: 12, behind: 60, square: 20 }; // square: the villagers stand this far out from the Town Center's walls, the soldiers three times as far
const shelterRank = () =>
	G.blds
		.filter((b) => b.owner === 0 && b.hp > 0 && b.prog >= 1 && BLD[b.kind].shelter)
		.sort((a, b) => b.hp - a.hp || shelterOf(0, b.kind) - shelterOf(0, a.kind));
const roomIn = (b) =>
	shelterOf(b.owner, b.kind) -
	G.units.filter((u) => u.hid === b.id || (u.state === 'garrison' && u.gar === b.id)).length; // in, or on the way in (Build 60: a second Shelter counted only those in, and over-filled)
// the soldiers an emergency moves: every one but the guards (they keep to what they guard) and the routed (they run for home)
const troops = () => armyOf(0).filter((u) => isSoldier(u) && u.state !== 'escort' && u.state !== 'rout');
// a soldier off its order, to stand at a spot and fight what comes
const stand = (u, x, y) =>
	Object.assign(u, {
		ord: undefined,
		focus: null,
		tgt: null,
		fid: null,
		state: 'goto',
		px: clamp(x, 20, MAP - 20),
		py: clamp(y, 20, MAP - 20),
		idleT: 0,
	});
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
// once, at the first order: the picture Stop goes back to, every villager's work and every squad's temper; a villager born since is noted at the next
function emgSnap(kind) {
	if (!G.emg) G.emg = { kind, snap: [], temper: G.temper.slice() };
	G.emg.kind = kind;
	for (const u of unitsOf(0, 'vil'))
		if (!G.emg.snap.some((n) => n.id === u.id))
			G.emg.snap.push({ id: u.id, job: u.job, nid: u.node ? u.node.id : null, post: u.post });
}
// a villager let go by the emergency: not frightened, out of the building it went into
function release(u) {
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
}
function villagersIn() {
	const V = unitsOf(0, 'vil').filter((u) => !(u.inside && u.shop) && !u.hid), // those at work indoors are indoors already; those sent in stay sent
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
		S = troops();
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
		stand(u, cx - d.x * row * EMG.row - d.y * col * EMG.row, cy - d.y * row * EMG.row + d.x * col * EMG.row);
	});
}
// Town square: everyone round the Town Center, each on its own side: the villagers just out from its walls, the soldiers beyond them; every
// mission comes home. A villager inside a shelter comes out to it
function townSquare() {
	const k = keepOf(0);
	if (!k) return;
	hudAbortAll();
	const at = (u, r) => {
		const d = hyp(u.x - k.x, u.y - k.y) || 1;
		return {
			x: clamp(k.x + ((u.x - k.x) / d) * r + u.ox * 0.5, 20, MAP - 20),
			y: clamp(k.y + ((u.y - k.y) / d) * r + u.oy * 0.5, 20, MAP - 20),
		};
	};
	for (const u of unitsOf(0, 'vil')) {
		release(u);
		stopVil(u, at(u, halfOf(k) + EMG.square));
	}
	for (const u of troops()) {
		const p = at(u, halfOf(k) + EMG.square * 3);
		stand(u, p.x, p.y);
	}
}
function emgStart(kind) {
	emgSnap(kind);
	if (kind === 'square') townSquare();
	if (kind === 'hands') soldiersIn(); // soldiers first: the strongest places are theirs
	if (kind === 'shelter' || kind === 'hands') villagersIn();
	say(`${EMERGENCY.find((e) => e[0] === kind)[1]}.`, 'warn', 4);
	feel('crack');
}
// Stop: every villager back to what it was doing; soldiers stay where the order put them
function emgStop() {
	if (!G.emg) return;
	for (const n of G.emg.snap) {
		const u = G.units.find((v) => v.id === n.id && v.hp > 0),
			node = n.nid && G.nodes.find((x) => x.id === n.nid && x.amt > 0);
		if (!u) continue;
		release(u);
		setJob(u, n.job, node && node.farm ? node : null);
		if (node && !node.farm) u.node = node;
		u.post = n.post;
	}
	G.temper = G.emg.temper;
	G.emg = null;
	say('Back to work.', 'good', 3);
}
// the card: what is coming (tap it to look), then the four orders, two a rank; the order on is gold, All hands is red
CARDS.emergency = () => {
	const I = G.incoming,
		k = keepOf(0),
		V = unitsOf(0, 'vil').length,
		on = (kind) => (G.emg && G.emg.kind === kind ? 'on' : '');
	title('Emergency'); // no subtitle: what is coming says the rest, and the order on wears its ring
	fold(
		'why',
		'How it works',
		`<p>Town square: everyone gathers round the Town Center, the soldiers outside the villagers. All hands: soldiers fill the sturdiest buildings first, shooters first (they add arrows), and the rest hold a line toward the danger; villagers fill what room is left. Shelter: the villagers alone. Whoever finds no room waits behind the Town Center. Stop sends every villager back to the work it had; soldiers stay until you send them.</p>`,
	);
	return (
		acts(
			I
				? info(
						`${I.n} ${I.what}`,
						`${k ? `coming from the ${dirOf(k, I)} · ` : ''}${mmss(I.eta)} · tap to look`,
						's6',
						`jump:${Math.round(I.x)},${Math.round(I.y)}`,
					)
				: info('Nothing coming', 'no attack in sight', 's6'),
			'c1',
		) +
		acts(
			btn('emgstop', 'Stop', 'everyone back to work', G.emg ? 'go' : 'dis') +
				btn('emg:square', EMERGENCY[0][1], EMERGENCY[0][2], on('square')),
		) +
		acts(
			btn('emg:hands', EMERGENCY[1][1], EMERGENCY[1][2], 'warn') +
				btn('emg:shelter', EMERGENCY[2][1], `${V} ${EMERGENCY[2][2]}`, V ? on('shelter') : 'dis'),
		)
	);
};
