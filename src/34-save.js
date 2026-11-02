// ═════ 34-save.js: save and load ═════
// ───────────────────────── Saving: on this phone, every 10 seconds and when you leave ─────────────────────────
const SAVEKEY = keyOf('save'),
	SAVEV = 43; // the save's shape, not the build: raise it only when the shape changes, and add a step to MIGRATE for the old one
const MIGRATE = {
	// { 24: S => S-in-the-shape-of-25 }, run in order
	27: (S) => {
		for (const p of S.P)
			if (p.techs && p.techs.includes('command') && !p.techs.includes('engage')) p.techs.push('engage');
		S.v = 28;
		return S;
	}, // Build 31: Engagement comes before Battalions; who had them keeps stances
	28: (S) => {
		for (const u of S.units) if (u.job === 'farm') u.job = 'food';
		for (const p of S.P) if (p.rally === 'farm') p.rally = 'food';
		S.v = 29;
		return S;
	}, // Build 36: Farm is folded into Food
	29: (S) => {
		for (const u of S.units) u.st = u.st || { got: 0, trips: 0, walk: 0, kills: 0, built: 0 };
		for (const p of S.P) {
			p.flow = p.flow || {};
			p.spent1 = p.spent1 || {};
			p.orate = p.orate || {};
			p.ledger = p.ledger || { in: {}, out: {} };
			p.rate = p.rate || {};
		}
		S.warAt = S.warAt || {};
		S.v = 30;
		return S;
	}, // Build 40: a life's tally on every unit, the stores' flow, notice given
	30: (S) => {
		const gone = new Set(['bizc', 'weaver', 'brewery', 'bakery', 'amphi']);
		S.blds = S.blds.filter((b) => !gone.has(b.kind));
		for (const u of S.units) {
			if (u.mor === undefined) u.mor = 1;
		}
		S.v = 31;
		return S;
	}, // Build 40: the one-job buildings folded into research and the Workshop; nerve on every soldier
	31: (S) => {
		S.temper = Array(BNS + 1)
			.fill(T_GUARD)
			.map((x, i) => (S.hold && S.hold[i] ? T_HOLD : x)); // hold ground became Hold; every other stance became Guard (Shield wall folded into Square, Skirmish into Guard)
		S.form = (S.form || []).map((f) => [0, 0, 1, 2][f] ?? 0); // Line, Column, Wedge, Square: the column is no longer chosen
		delete S.hold;
		delete S.stance;
		S.v = 32;
		return S;
	}, // Build 45: Shape and Temper replace stance, formation and hold ground
	32: (S) => {
		const g = S.ground || {};
		S.clim = {
			T: CLIMATE.mean,
			W: Math.max(CLIMATE.eq.clear, g.mud || 0),
			snow: g.snow || 0,
			ice: g.ice || 0,
			mud: g.mud || 0,
			wet: S.wx === 'rain',
			dry: 0,
		};
		delete S.ground;
		S.v = 33;
		return S;
	}, // Build 54: the climate replaces the ground counters
	33: (S) => {
		S.v = 34;
		return S;
	}, // Build 57: the truce, the hidden age, the Games and the chronicle; all read with defaults
	34: (S) => {
		if (S.mkt) for (const k in S.mkt) S.mkt[k] = S.mkt[k] ** -(PRICE.eps[k] || 1);
		S.v = 35;
		return S;
	}, // Build 59: the market keeps its stock, not its price (P = P0 (Q/Q0)^(−1/ε)): a saved price p is the stock p^(−ε)
	35: (S) => {
		for (const b of S.blds || [])
			for (const j of b.q || [])
				if (!j.paid)
					j.paid = j.kind
						? UNIT[j.kind]?.cost || {} // a kind since cut costs nothing: an old save still opens (A5)
						: j.tech
							? TECHBY[j.tech]?.cost || {}
							: j.age
								? AGES[j.age]?.cost || {}
								: j.muster
									? Object.entries(j.muster).reduce((c, [k, n]) => addRes(c, UNIT[k]?.cost || {}, 2 * n), {})
									: {};
		S.v = 36;
		return S;
	}, // Build 60: every order keeps what it paid, so a cancel gives back exactly that; an order saved before is taken at its list price
	36: (S) => {
		if (S.bnPlan) S.bnPlan = S.bnPlan.slice(0, BNS);
		if (S.form) S.form = S.form.slice(0, BNS);
		if (S.temper) S.temper = S.temper.slice(0, BNS).concat([S.temper[S.temper.length - 1] ?? T_GUARD]);
		for (const u of S.units || []) if (u.bn !== undefined && u.bn >= BNS) u.bn = undefined;
		for (const b of S.blds || []) for (const j of b.q || []) if (j.muster && j.bn >= BNS) j.bn = undefined;
		S.msn = (S.msn || []).slice(0, BNS);
		if (typeof S.sel === 'number' && S.sel >= BNS) S.sel = 'all';
		S.v = 37;
		return S;
	}, // Build 61: four squads (Alpha to Delta), the row's four middle tiles; Epsilon and Zeta fold into the reserve
	37: (S) => {
		S.bnPlan = (S.bnPlan || []).map((P) => {
			const Q = {};
			for (const k in P) {
				const c = UNIT[k] && CLS[clsOf(k)];
				if (c && P[k] > 0) Q[c[0]] = (Q[c[0]] || 0) + P[k];
			}
			return Q;
		});
		S.v = 38;
		return S;
	}, // Build 70: a squad holds so many of a kind (Foot, Archers, Riders, Siege), not of one soldier; the cut pages kept nothing in the save (the row's page was never saved, a game opens on Jobs)
	38: (S) => {
		if (S.emg) {
			S.emg.snap = S.emg.snap || [];
			if (S.emg.kind === 'battle') S.emg.kind = 'hands';
		}
		S.v = 39;
		return S;
	}, // Build 70: Battle stations is cut; a game saved in it is in All hands (its soldiers' half), with no villager's work noted (it moved none)
	39: (S) => {
		const D = MID - 1000, // shape 39 was laid on the 2000 map (MID 1000): the old game is set down in the middle of the new one
			k = Math.round(D / FOG),
			n0 = 2000 / FOG,
			PAIRS = [
				['x', 'y'],
				['px', 'py'],
				['hx', 'hy'],
				['hax', 'hay'],
				['kx', 'ky'],
			],
			walk = (o) => {
				if (!o || typeof o !== 'object') return;
				if (Array.isArray(o)) return o.forEach(walk);
				for (const [a, b] of PAIRS) if (typeof o[a] === 'number' && typeof o[b] === 'number') (o[a] += D), (o[b] += D);
				for (const key in o) if (key !== 'fog' && key !== 'tread') walk(o[key]);
			},
			grid = (b64, w) => {
				const s = atob(b64),
					o = new Uint8Array(FOGN * FOGN * w);
				for (let j = 0; j < n0; j++)
					for (let i = 0; i < n0 * w; i++) o[((j + k) * FOGN + k) * w + i] = s.charCodeAt(j * n0 * w + i) || 0;
				return btoa(String.fromCharCode(...o));
			}; // the fog and the ruts, square for square
		for (const u of S.units || [])
			if (u.graze !== undefined && u.gx !== undefined) {
				u.grazeAt = { x: u.gx, y: u.gy };
				delete u.gx;
				delete u.gy;
			} // an animal's graze point had the name soldiers use for a place in the line: it has its own now, and moves with the map
		walk(S);
		for (const n of S.nodes || []) if (Array.isArray(n)) (n[1] += D), (n[2] += D); // a tree: [id, x, y, amt, max]
		for (const b of S.blds || []) (b.gx += D / NAVC), (b.gy += D / NAVC);
		for (const p of S.P || []) {
			if (p.keep) p.keep = p.keep.map((v) => v + D);
			p.ai = { ...p.ai, cool: {} };
			delete p.ai.wallPlan; // the wall plan is squares on the old map: it is drawn again round the moved keep
			if (p.wave) {
				const u = (S.units || []).find((u) => u.owner === p.id && u.state === 'attack');
				p.wave = { ...p.wave, to: u ? u.target : null, bid: u ? u.bid || null : null, d: 1e9, pt: S.t };
			}
		}
		if (S.fog) S.fog = grid(S.fog, 1);
		if (S.tread) S.tread = grid(S.tread, 2);
		S.v = 40;
		return S;
	}, // decision 5a: the map from 2000 to 2160; a wave is judged by its progress (D1)
	40: (S) => {
		for (const p of S.P) if (p.techs) p.techs = [...new Set(p.techs.map((id) => (id === 'printing' ? 'press' : id)))];
		for (const b of S.blds || [])
			if (b.q)
				b.q = b.q.filter((j) => j.tech !== 'printing' || (S.P[b.owner] && refund(S.P[b.owner], j), false)); // Printing waited on the press: the order is given back
		if (S.clim && 'next' in S.clim) {
			S.clim.ahead = S.clim.next == null ? [] : [S.clim.next];
			delete S.clim.next;
		}
		S.v = 41;
		return S;
	}, // Build 80: Printing is folded into Printing press (N12); the sky rolled ahead is a list, a minute for each forecast step (N10)
	41: (S) => {
		for (const u of S.units || [])
			if (u.routT !== undefined) {
				const p = (S.P || [])[u.owner];
				u.routAt = u.routT - MORALE.rout * (p && (p.techs || []).includes('engage') ? 0.5 : 1);
				delete u.routT;
			}
		S.v = 42;
		return S;
	}, // C6: a rout keeps when it began, not when it ends
	42: (S) => {
		if (S.nat && S.nat.regard) {
			const N = S.nat;
			S.gang = {
				nat: { regard: N.regard, gifts: N.gifts || N.regard.map(() => []), warBy: N.warBy || {}, hitT: N.hitT || {} },
			};
			for (const k of ['regard', 'gifts', 'warBy', 'hitT']) delete N[k];
		}
		delete S.gamesN;
		for (const p of S.P || []) {
			delete p.ration;
			delete p.rations;
		}
		S.v = 43;
		return S;
	}, // answer 1b: regard is kept per group (the Natives, outlaws, bandits, robbers); the Natives' moves from G.nat to G.gang.nat; the dead fields go (hunt A #9)
};
const evSave = () => {
	const V = G.ev || {},
		e = V.cur;
	return { ...V, cur: e ? { kind: e.kind, t0: e.t0, until: e.until, at: e.at, a: e.a, b: e.b, x: e.x, y: e.y } : null };
}; // no unit or node objects in the save
let staleSave = 0; // the version of a save we could not open, so the setup card can say so
const SKIP_U = new Set([
	'fleeFrom',
	'focus',
	'tgt',
	'bt',
	'esc',
	'blocker',
	'path',
	'so',
	'aggro',
	'node',
	'rep',
	'hunt',
	'lcOK',
	'lcT',
	'pv',
	'pk',
	'pfK',
	'pfV',
	'pfT',
	'pi',
	'partial',
	'drop',
	'dropR',
	'dropN',
	'dropT',
	'dropV',
	'dropAt',
	'lean',
	'sk',
	'sgx',
	'sgy',
	'lx',
	'ly',
	'gp',
	'gpT',
]); // lx/ly: where it stood last step (drawing only); gp/gpT: the group power of the tick
// the Resume card, and the setup card while a save waits behind it, must be answered: closing either would start a game that never saves.
// It holds the whole screen (A2): while it is up, a tap, drag or wheel anywhere but on the card itself goes no further (the top bar's
// counts, the map, the minimap, the row), so nothing can open another card over it and play on unsaved.
const cardLocked = () => !!(G && G.card && (G.card.type === 'resume' || (G.card.type === 'setup' && holdSave)));
for (const ev of ['pointerdown', 'pointermove', 'pointerup', 'click', 'wheel'])
	$('stage').addEventListener(
		ev,
		(e) => {
			if (cardLocked() && !e.target.closest('#card')) e.stopPropagation();
		},
		{ capture: true },
	);
// a deliberate new game starts clean: no leftover fight hold, save-failure clock, stale note or error count from the game before
function freshSlate() {
	fightHold = 0;
	saveFailT = undefined;
	staleSave = 0;
	seenErr.clear();
}
let holdSave = false; // while the Resume card waits, nothing may overwrite the save it offers
const inFight = () => G.units.some((u) => u.owner === 0 && u.tgt && u.tgt.hp > 0);
let fightHold = 0;
let saveFailT;
function saveGame(force) {
	if (!G || G.over || seenErr.size >= 2 || holdSave) return; // after a second error the last good save stands; while the Resume card waits, nothing overwrites it (force too)
	if (!force && inFight() && (fightHold = fightHold || G.t) && G.t - fightHold < 60) return;
	fightHold = 0; // the save stutters: not in the middle of a battle (at most a minute late)
	try {
		const units = G.units.map((u) => {
			const r = {};
			for (const k in u) if (!SKIP_U.has(k)) r[k] = u[k];
			r.nodeId = u.node ? u.node.id : null;
			r.repId = u.rep ? u.rep.id : null;
			r.huntId = u.hunt ? u.hunt.id : null;
			return r;
		});
		const blds = G.blds.map((b) => {
			const r = {};
			for (const k in b) if (k !== 'node') r[k] = b[k];
			if (b.node) {
				r.nodeId = b.node.id;
				r.res = isFinite(b.node.amt) ? b.node.amt : undefined;
			}
			return r;
		});
		const S = {
			v: SAVEV,
			at: Date.now(),
			t: G.t,
			tick: G.tick,
			speed: G.speed,
			seed: G.seed,
			rs: G.rs,
			nid: NID,
			sel: G.sel,
			rally0: G.rally0 || null,
			temper: G.temper,
			bnPlan: G.bnPlan,
			bnIntent: G.bnIntent,
			ms: G.ms || [],
			recruitSq: G.recruitSq,
			form: G.form,
			intel: G.intel,
			throne: G.throne || null,
			prisoners: G.prisoners || [],
			nat: G.nat || null,
			gang: G.gang || null,
			struck: G.struck || null,
			alertT: G.alertT,
			warnT: G.warnT, // the attack alarms' clocks (hunt B #7: a resumed game could sound the horn again at once)
			fantasy: G.fantasy,
			fogOn: G.fogOn,
			mode: G.mode,
			diff: G.diff,
			tension: G.tension,
			league: G.league,
			wayT: G.wayT,
			wayI: G.wayI,
			wonder: G.wonder,
			ords: G.ords || {},
			msn: G.msn,
			emg: G.emg,
			ordN: G.ordN || 0,
			land: G.land || null,
			warAt: G.warAt || {},
			hz: G.hz || {},
			ev: evSave(),
			fog: btoa(String.fromCharCode(...G.fog)),
			tread:
				G.tread && G.tread.some(Boolean) ? btoa(String.fromCharCode(...new Uint8Array(G.tread.buffer))) : undefined, // the ruts (Build 62)
			seenB: Object.keys(G.seenB).map(Number),
			horde: G.horde,
			flood: G.flood,
			clim: G.clim,
			truce: G.truce,
			sworn: G.sworn,
			post: G.post,
			scen: G.scen,
			enlight: G.enlight,
			stood: G.stood,
			gamesT: G.gamesT,
			chron: G.chron,
			chargeT: G.chargeT || {},
			wheelT: G.wheelT || 0,
			looseT: G.looseT || 0,
			sand: G.sand || null,
			mirage: G.mirage || null,
			mkt: G.mkt || null,
			reignT: G.reignT ?? null,
			free: !!G.free,
			bell: G.bell || null,
			wx: G.wx,
			wxT: G.wxT,
			harvest: G.harvest,
			plague: G.plague,
			seasonN: G.seasonN,
			cam: { x: cam.x, y: cam.y, z: cam.z },
			rel: G.rel,
			finds: G.finds,
			lakes: G.lakes,
			P: G.P.map((p) => {
				const { fxc, uc, ...q } = p;
				return { ...q, techs: [...p.techs] };
			}),
			nodes: G.nodes
				.filter((n) => n.kind !== 'farm')
				.map((n) => (n.kind === 'tree' ? [n.id, n.x, n.y, n.amt, n.max] : (({ open, wk, ...r }) => r)(n))),
			blds,
			units,
		}; // trees are most of the map: five numbers each
		const prev = localStorage.getItem(SAVEKEY);
		if (prev) localStorage.setItem(SAVEKEY + '.bak', prev); // the save before this one, kept: a save cut off mid-write still leaves a game (Build 63)
		localStorage.setItem(
			SAVEKEY,
			JSON.stringify(S, (k, v) => (typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 100) / 100 : v)),
		); // hundredths are plenty: a third of the size
	} catch (e) {
		if (G.t - (saveFailT ?? -999) > 60) {
			saveFailT = G.t;
			say('Save failed. Storage may be full.', 'warn', TOAST.mid);
		}
	} // a save that did not happen says so, once a minute (Build 42: it used to fail silently)
}
function readSave(key = SAVEKEY) {
	try {
		let S = JSON.parse(localStorage.getItem(key) || 'null');
		if (!S || !S.units || !S.P) return key === SAVEKEY ? readSave(SAVEKEY + '.bak') : null; // the last save failed: the one before it
		while (S.v < SAVEV && MIGRATE[S.v]) S = MIGRATE[S.v](S);
		if (S.v !== SAVEV) {
			localStorage.setItem(SAVEKEY + '.old' + S.v, JSON.stringify(S)); // one slot per shape: a second stale save never overwrites the first
			localStorage.removeItem(SAVEKEY);
			staleSave = S.v;
			return null;
		} // kept aside, never lost
		return S.P.length === 5 ? S : null;
	} catch (e) {
		if (key === SAVEKEY) keepAside('damaged'); // a save that will not open is kept, never written over (A5)
		return key === SAVEKEY ? readSave(SAVEKEY + '.bak') : null;
	}
}
function keepAside(why) {
	try {
		const raw = localStorage.getItem(SAVEKEY);
		if (raw) localStorage.setItem(SAVEKEY + '.lost', raw);
		localStorage.removeItem(SAVEKEY);
		staleSave = why;
	} catch (e) {}
}
// every old shape has a step to the next: a save from any build since the chain began opens (the gate checks this)
const migrateChain = () => {
	const ks = Object.keys(MIGRATE).map(Number);
	for (let v = Math.min(...ks); v < SAVEV; v++) if (!MIGRATE[v]) return `no step from save shape ${v}`;
	return '';
};
function clearSave() {
	try {
		localStorage.removeItem(SAVEKEY);
		localStorage.removeItem(SAVEKEY + '.bak'); // the backup goes too, or a finished game comes back from it
	} catch (e) {}
}
function loadGame(S) {
	NID = S.nid;
	G = blankGame(S.seed);
	resetScars();
	Object.assign(G, {
		t: S.t,
		tick: S.tick || 0,
		speed: S.speed || 1,
		rs: S.rs,
		sel: S.sel === undefined ? 'all' : S.sel,
		rally0: S.rally0,
		temper: S.temper,
		bnPlan: S.bnPlan || BN.map(() => ({})),
		bnIntent: S.bnIntent || BN.map(() => 0),
		ms: S.ms || [],
		recruitSq: S.recruitSq ?? null,
		form: S.form || BN.map(() => 0),
		qs: { from: 'all', n: {} },
		hud: { page: 'jobs' },
		msn: S.msn || [null, null, null, null],
		emg: S.emg || null,
		intel: S.intel || {},
		fantasy: !!S.fantasy,
		fogOn: S.fogOn ?? SET.fog,
		mode: S.mode || 'conquest',
		diff: S.diff || SET.diff,
		tension: S.tension || 'winner',
		league: S.league ?? null,
		wayT: S.wayT,
		wayI: S.wayI,
		wonder: S.wonder || null,
		mkt: S.mkt || null,
		reignT: S.reignT ?? null,
		free: !!S.free,
		bell: S.bell || null,
		wx: S.wx || 'clear',
		wxT: S.wxT || WX_EVERY,
		harvest: S.harvest || 1,
		plague: S.plague || null,
		seasonN: S.seasonN || 0,
		rel: S.rel,
		finds: S.finds || [],
	});
	G.lakes = S.lakes;
	G.P = S.P.map((p) => ({ ...p, techs: new Set(p.techs), fxc: null, uc: {} }));
	G.nodes = S.nodes.map((n) =>
		Array.isArray(n) ? { id: n[0], kind: 'tree', type: 'wood', x: n[1], y: n[2], amt: n[3], max: n[4] } : { ...n },
	);
	makeBg(); // after the trees: the forest floor is drawn from them
	const byNode = new Map(G.nodes.map((n) => [n.id, n]));
	for (const sb of S.blds) {
		if (!sb || !BLD[sb.kind] || !Number.isFinite(sb.x) || !Number.isFinite(sb.y)) continue; // a damaged building is left out, not the whole save (Build 42)
		const { nodeId, res, ...rest } = sb,
			b = { ...rest, q: sb.q || [] };
		G.blds.push(b);
		if (BLD[b.kind].crop) {
			const B = BLD[b.kind],
				r0 = 'reserve' in B ? B.reserve : Infinity;
			const mk = B.makes && B.makes[b.cropT || B.crop],
				nd = {
					id: nodeId || NID++,
					kind: 'farm',
					type: b.cropT || B.crop,
					rate: mk ? mk.rate : B.rate,
					x: b.x,
					y: b.y,
					amt: res ?? r0,
					max: r0 || Infinity,
					farm: b,
					worker: null,
				};
			b.node = nd;
			G.nodes.push(nd);
			byNode.set(nd.id, nd);
		}
	}
	const byB = new Map(G.blds.map((b) => [b.id, b]));
	for (const su of S.units) {
		if (!su || !UNIT[su.kind] || !Number.isFinite(su.x) || !Number.isFinite(su.y)) continue; // likewise a damaged unit
		const { nodeId, repId, huntId, ...u } = su;
		u.node = nodeId ? byNode.get(nodeId) || null : null;
		if (u.plot === undefined && u.node && u.node.farm) u.plot = u.node.farm.id; // a save from before D-089: a worker on a building is posted to it
		u.rep = repId ? byB.get(repId) || null : null;
		u._hunt = huntId;
		G.units.push(u);
	}
	const byU = new Map(G.units.map((u) => [u.id, u]));
	for (const u of G.units) {
		if (u._hunt) u.hunt = byU.get(u._hunt) || null;
		delete u._hunt;
	}
	G.ords = S.ords || {};
	G.ordN = S.ordN || 0;
	G.land = S.land || null;
	G.warAt = S.warAt || {};
	setPick([]);
	G.throne = S.throne || null;
	G.prisoners = S.prisoners || [];
	G.nat = S.nat || null;
	G.gang = S.gang || null;
	G.struck = S.struck || null;
	G.alertT = S.alertT ?? -99;
	G.warnT = S.warnT ?? -99;
	if (S.fog) {
		try {
			const s = atob(S.fog);
			for (let i = 0; i < s.length && i < G.fog.length; i++) G.fog[i] = s.charCodeAt(i);
		} catch (e) {}
	}
	if (S.tread) {
		try {
			const s = atob(S.tread),
				b = new Uint8Array(ruts().buffer);
			for (let i = 0; i < s.length && i < b.length; i++) b[i] = s.charCodeAt(i);
		} catch (e) {}
	}
	G.seenB = {};
	if (S.seenB) for (const id of S.seenB) G.seenB[id] = 1;
	else for (const b of G.blds) if (fogAt(b.x, b.y) > 0) G.seenB[b.id] = 1; // a save from before Build 51: what lay in explored ground counts as seen
	G.hz = S.hz || {};
	G.ev = S.ev || {};
	G.horde = S.horde ?? null;
	G.flood = S.flood || 0;
	G.clim = S.clim ? { ...blankClim(), ...S.clim } : blankClim();
	G.truce = S.truce ?? null;
	G.sworn = S.sworn || 0;
	G.post = S.post || [];
	G.scen = S.scen || null;
	G.enlight = !!S.enlight;
	G.stood = !!S.stood;
	G.gamesT = S.gamesT || 0;
	G.chron = S.chron || [];
	G.chargeT = S.chargeT || {};
	G.wheelT = S.wheelT || 0;
	G.looseT = S.looseT || 0;
	G.sand = S.sand || null;
	G.mirage = S.mirage || null;
	if (G.ev.cur) {
		const e = G.ev.cur;
		e.units = G.units.filter((u) => u.herd);
		if ((!EV[e.kind].tick && !KNOBS[e.kind]) || e.kind === 'wildfire') endEvent();
	} // an event with its own pieces on the map is dropped on load; the pieces finish on their own. An eclipse, a fog or a heat wave goes on.
	evmSet();
	for (const u of G.units) if (u.ord && !G.ords[u.ord]) u.ord = undefined; // orders on the march come back with the game; a stray number is cleared (Build 38 review)
	for (const b of G.blds) if (b.prog >= 1 && (!G.fogOn || friendly(0, b.owner) || G.seenB[b.id])) wearGround(b); // the ground's memory is not saved: the worn ground round buildings you know is laid again
	fxDirty();
	if (G.fogOn) fogTick(); // the same light after a load as at the start (B1)
	navRebuild();
	recount();
	scoreAll();
	if (S.cam) {
		cam.x = S.cam.x;
		cam.y = S.cam.y;
		cam.z = clamp(S.cam.z, minZ(), ZOOM_MAX);
		clampCam();
	}
	paceBtn();
	muteBtn();
	$('end').hidden = true;
	closeCard();
	cancelPlace();
	holdSave = false;
	setPause(false);
}
document.addEventListener('visibilitychange', () => {
	if (document.hidden) saveGame(true);
}); // leaving the app: saved whatever is going on
window.addEventListener('pagehide', () => saveGame(true));
