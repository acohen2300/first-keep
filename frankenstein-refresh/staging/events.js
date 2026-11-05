// ═════ 37-events.js: the event scheduler and what each event does ═════
// ───────────────────────── The Challenge and the spectacle: one scheduler, one table of events, one set of knobs ─────────────────────────
// EVM: the knobs an event turns (every unit reads them: damage, speed, sight, gathering). A hazard is a switch in G.hz; a spectacle is a row of EVENTS.
// Random when, never random whether: the next event is picked when the last ends (an exponential wait, the Poisson process: nextIn in 08-core), announced EV_WARN seconds ahead, then run for its seconds.
const EVM = { dmg: 1, spd: 1, sight: 1, gather: 1 };
// the knobs follow the event now running and nothing else; set when one starts or ends, and on a new game or a load (Build 48: a game begun or loaded in an eclipse kept its dark)
const KNOBS = { eclipse: ['dmg', 'spd', 'sight'], heatwave: ['dmg', 'spd'] }; // fog caps sight by visibility instead (visCap, 08)
function evmSet() {
	EVM.dmg = EVM.spd = EVM.sight = EVM.gather = 1;
	const e = G && G.ev && G.ev.cur;
	if (e) for (const k of KNOBS[e.kind] || []) EVM[k] = EVENTS[e.kind][k];
}
const hz = (id) => !!(G.hz && G.hz[id]) && G.diff !== 'easy'; // Easy keeps the polite game whatever is switched on
const levelOf = (h) => HZK.reduce((s, k) => s + (h && h[k] ? HAZARDS[k].pts : 0), 0);
const levelMul = () => (G.diff === 'easy' ? 1 : 1 + levelOf(G.hz) / 10); // the score's multiplier for the level played; Easy has no hazards, so no bonus (B8)
const evOn = (kind) => !!(G.ev.cur && G.ev.cur.kind === kind);
const edgeSpot = () => {
	// a spot on one of the land's edges, in the world (preview 51)
	const e = Math.floor(rng() * 4),
		t = rnd(300, SQUARE - 300);
	return landAt(...(e === 0 ? [t, 40] : e === 1 ? [SQUARE - 40, t] : e === 2 ? [t, SQUARE - 40] : [40, t]));
};
const across = (a) => ({ x: 2 * MID - a.x, y: 2 * MID - a.y }); // the far side of the land from a spot (through the middle)
const wildSpot = () => {
	for (let i = 0; i < 40; i++) {
		const s = landAt(rnd(200, SQUARE - 200), rnd(200, SQUARE - 200));
		if (
			lakeGap(s.x, s.y) > 60 &&
			!G.P.some((p) => p.id !== WILD && p.alive && keepOf(p.id) && dist(keepOf(p.id), s) < 420)
		)
			return s;
	}
	return { x: MID, y: MID - 300 };
};
const canEv = (k) => {
	const E = EVENTS[k];
	return (
		!(E.fantasy && !G.fantasy) &&
		!(E.need && G.wx !== E.need) &&
		!(E.season && ![].concat(E.season).includes(season().name)) &&
		!(E.night && G.night < 0.5) &&
		!(k === 'quicksand' && G.wx !== 'rain') &&
		!(k === 'flood' && G.wx !== 'rain')
	);
};
function pickEvent() {
	const can = EVK.filter(canEv);
	let k = can[Math.floor(rng() * can.length)];
	if (k === G.ev.last && can.length > 1) k = can[(can.indexOf(k) + 1) % can.length];
	return k;
}
// the swarm, the herd and the cloud all cross the map the same way: from one edge to the far side, in E.secs
const crossing = (e) => {
	e.a = e.a || edgeSpot();
	e.b = e.b || across(e.a);
	const f = clamp((G.t - e.t0) / (e.until - e.t0), 0, 1);
	return { x: e.a.x + (e.b.x - e.a.x) * f, y: e.a.y + (e.b.y - e.a.y) * f, f };
};
const herdAt = (kind, n, a, b, spread) => {
	const out = [];
	for (let i = 0; i < n; i++) {
		const u = addUnit(WILD, kind, a.x + rnd(-spread, spread), a.y + rnd(-spread, spread));
		u.px = b.x + rnd(-spread, spread);
		u.py = b.y + rnd(-spread, spread);
		u.hx = u.x;
		u.hy = u.y;
		u.herd = true;
		u.tier = i;
		out.push(u);
	}
	return out;
}; // tier: which coat a performer wears
const EV = {
	eclipse: {
		draw(e, z, t) {
			const f = Math.sin(Math.PI * clamp((G.t - e.t0) / (e.until - e.t0), 0, 1)),
				x = cw * 0.5,
				y = ch * 0.28;
			ctx.globalAlpha = f;
			const gl = ctx.createRadialGradient(x, y, 26, x, y, 60);
			gl.addColorStop(0, 'rgba(255,250,230,.9)');
			gl.addColorStop(1, 'rgba(255,250,230,0)');
			ctx.fillStyle = gl;
			ctx.beginPath();
			ctx.arc(x, y, 60, 0, 7);
			ctx.fill();
			ctx.fillStyle = '#0b0f0d';
			ctx.beginPath();
			ctx.arc(x, y, 27, 0, 7);
			ctx.fill();
			ctx.globalAlpha = 1;
		}, // the corona at the top of the glass
		start(e) {
			sfx('hush');
		},
	},
	storm: {
		draw(e, z, t) {
			if (still() || !Number.isFinite(e.x)) return; // no place yet in the first second
			// a dark band of cloud walking east, rain under it
			const x = SX(e.x, e.y),
				w = EVENTS.storm.band * z;
			const gr = ctx.createLinearGradient(x - w, 0, x + w, 0);
			gr.addColorStop(0, 'rgba(20,24,34,0)');
			gr.addColorStop(0.5, 'rgba(14,18,28,.62)');
			gr.addColorStop(1, 'rgba(20,24,34,0)');
			ctx.fillStyle = gr;
			ctx.fillRect(x - w, 0, 2 * w, ch);
			ctx.fillStyle = 'rgba(40,46,60,.85)';
			for (let i = 0; i < 9; i++) {
				ctx.beginPath();
				ctx.ellipse(
					x + (i - 4) * w * 0.22 + Math.sin(t * 0.7 + i) * 8,
					30 + (i % 3) * 14,
					70 + (i % 2) * 30,
					26,
					0,
					0,
					7,
				);
				ctx.fill();
			} // the cloud itself along the top of the glass
		},
		start(e) {
			e.a = landAt(-EVENTS.storm.band, LMID);
			e.b = landAt(SQUARE + EVENTS.storm.band, LMID); // the storm crosses the land west to east (preview 51)
			sfx('wind');
		},
		tick(e) {
			const c = crossing(e);
			e.x = c.x;
			e.y = c.y;
			if (e.s % 2 === 0) {
				const sp = landAt(clamp(landXY(e.x, e.y).x + rnd(-EVENTS.storm.band, EVENTS.storm.band), 40, SQUARE - 40), rnd(80, SQUARE - 80)),
					x = sp.x,
					y = sp.y,
					W = G.blds.filter(
						(b) => BLD[b.kind].wood && b.prog >= 1 && Math.abs(landXY(b.x, b.y).x - landXY(e.x, e.y).x) < EVENTS.storm.band && rng() < 0.3, // the storm's band, across the land (preview 51)
					);
				const b = W.length && rng() < 0.25 ? W[Math.floor(rng() * W.length)] : null;
				strike(b ? b.x : x, b ? b.y : y, b);
			}
		},
	},
	stampede: {
		start(e) {
			e.a = edgeSpot();
			e.b = across(e.a);
			e.units = herdAt('bison', EVENTS.stampede.n, e.a, e.b, 40);
			sfx('hooves');
		},
		tick(e) {
			if (e.s % 3 === 0) sfx('hooves', e.units[0] && e.units[0].x, e.units[0] && e.units[0].y);
		},
		end(e) {
			for (const u of e.units)
				if (u.hp > 0 && dist(u, { x: u.px, y: u.py }) < 120) {
					u.hp = 0;
					u.gone = true;
				}
		},
	},
	flood: {
		start(e) {
			G.flood = e.until;
			G.navDirty = true;
		},
		tick(e) {
			for (const b of G.blds)
				if (
					b.prog >= 1 &&
					b.owner !== WILD &&
					fxv(b.owner, 'flood').a < 1 &&
					lakeGap(b.x, b.y) < EVENTS.flood.rise - halfOf(b)
				) {
					b.hp -= maxHpB(b.owner, b.kind) * EVENTS.flood.hit;
					if (b.owner === 0 && e.s % 10 === 1)
						news('land', `Water at the ${bldName(0, b.kind).toLowerCase()} (${coord(b.x, b.y)}).`, 'warn', TOAST.mid, b);
				}
		},
		end() {
			G.flood = 0;
			G.navDirty = true;
		},
	},
	meteor: {
		draw(e, z, t) {
			const f = clamp((G.t - e.t0) / (e.until - e.t0), 0, 1),
				x1 = SX(e.at.x, e.at.y),
				y1 = SY(e.at.y, 0, e.at.x),
				x0 = x1 - 420,
				y0 = y1 - 560,
				x = x0 + (x1 - x0) * f,
				y = y0 + (y1 - y0) * f;
			ctx.strokeStyle = 'rgba(255,240,200,.9)';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(x - (x1 - x0) * 0.12, y - (y1 - y0) * 0.12);
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.fillStyle = '#fff6dc';
			ctx.beginPath();
			ctx.arc(x, y, 4, 0, 7);
			ctx.fill();
		},
		start(e) {
			e.at = wildSpot();
			e.a = { x: e.at.x - 900, y: e.at.y - 700 };
		},
		end(e) {
			addFind('meteor', e.at.x, e.at.y);
			scarStrike(e.at.x, e.at.y);
			scarStrike(e.at.x + 6, e.at.y + 4);
			sfx('boom', e.at.x, e.at.y);
			G.whiteT = G.t;
			news('land', EV_TEXT.meteor[1], 'good', TOAST.long, e.at);
		},
	},
	wildfire: {
		start(e) {
			const far = G.nodes.filter(
				(n) =>
					n.kind === 'tree' &&
					n.amt > 0 &&
					!G.P.some((p) => p.id !== WILD && p.alive && keepOf(p.id) && dist(keepOf(p.id), n) < 300),
			);
			const t = far[Math.floor(rng() * far.length)];
			e.burn = t ? [t] : [];
			e.at = t ? { x: t.x, y: t.y } : null;
			G.fire = e.burn;
			sfx('crash', t && t.x, t && t.y);
		},
		tick(e) {
			if (precip(G.wx)) {
				e.until = G.t;
				return;
			}
			const E = EVENTS.wildfire,
				next = [];
			for (const n of e.burn) {
				n.amt -= n.max * E.burn;
				if (n.amt > 0) next.push(n);
				else {
					scarStrike(n.x, n.y);
				}
				nodesNear(n.x, n.y, E.r, (m) => {
					if (
						m.kind === 'tree' &&
						m.amt > 0 &&
						!e.burn.includes(m) &&
						!next.includes(m) &&
						rng() < E.spread * fireMul()
					)
						next.push(m);
				});
				bldsNear(n.x, n.y, 40, (b) => {
					if (BLD[b.kind].wood && b.prog >= 1) ignite(b, 'the wildfire');
				});
			}
			e.burn = next.slice(0, E.most);
			G.fire = e.burn;
			if (!e.burn.length) e.until = G.t;
		},
		end() {
			G.fire = null;
		},
	},
	fog: {
		draw(e, z, t) {
			const f = Math.min(1, (G.t - e.t0) / 4, (e.until - G.t) / 4);
			ctx.fillStyle = `rgba(214,220,222,${0.55 * f})`;
			ctx.fillRect(0, 0, cw, ch);
			if (!still()) {
				ctx.fillStyle = `rgba(230,234,236,${0.25 * f})`;
				for (let i = 0; i < 8; i++) {
					ctx.beginPath();
					ctx.ellipse(((i * 173 + t * 12) % (cw + 300)) - 150, (i * 97) % ch, 160, 50, 0, 0, 7);
					ctx.fill();
				}
			}
		},
	},
	sinkhole: {
		start(e) {
			const B = G.blds.filter((b) => b.prog >= 1 && !BLD[b.kind].wallish && b.kind !== 'keep');
			const b = B[Math.floor(rng() * B.length)];
			if (!b) return;
			b.hp -= maxHpB(b.owner, b.kind) * EVENTS.sinkhole.hit;
			scarStrike(b.x, b.y - 4);
			scarStrike(b.x + 5, b.y + 3);
			G.shake = G.t + 1;
			crackAt(b.x, b.y, 36);
			sfx('rumble', b.x, b.y);
			if (b.owner === 0)
				news('land', `A sinkhole under the ${bldName(0, b.kind).toLowerCase()} (${coord(b.x, b.y)}).`, 'warn', TOAST.mid, b);
		},
	},
	quicksand: {
		start(e) {
			e.at = wildSpot();
			G.sand = { x: e.at.x, y: e.at.y, r: EVENTS.quicksand.r, until: e.until };
		},
		end() {
			G.sand = null;
		},
	},
	heatwave: {},
	mirage: {
		start(e) {
			const k = keepOf(0);
			e.at = k ? towardMid(k, 500) : { x: MID, y: MID };
			G.mirage = { x: e.at.x, y: e.at.y, n: EVENTS.mirage.n, until: e.until };
			news('war', `An army seen at ${coord(e.at.x, e.at.y)}.`, 'warn', TOAST.mid, e.at);
		},
		end() {
			G.mirage = null;
			news('war', 'The army at that spot was a mirage.', '', TOAST.mid);
		},
	},
	circus: {
		start(e) {
			e.a = edgeSpot();
			e.b = across(e.a);
			e.units = herdAt('performer', EVENTS.circus.n, e.a, e.b, 14);
			sfx('jingle');
		},
		tick(e) {
			for (const p of e.units)
				if (p.hp > 0)
					unitsNear(p, EVENTS.circus.r, (v) => {
						if (v.kind === 'vil' && !v.inside) v.cheer = G.t + EVENTS.circus.cheer;
					});
		},
		end(e) {
			for (const u of e.units) {
				u.hp = 0;
				u.gone = true;
			}
		},
	},
	wagon: {
		start(e) {
			const a = edgeSpot(),
				b = across(a),
				w = addUnit(WILD, 'wagon', a.x, a.y);
			w.px = b.x;
			w.py = b.y;
			e.units = [w];
		},
	},
	mercs: {
		start(e) {
			const a = edgeSpot();
			e.f = addFind('mercs', a.x, a.y);
			e.f.until = e.until;
		},
		end(e) {
			if (e.f && !e.f.done) {
				e.f.done = true;
				for (const v of G.units)
					if (v.find === e.f.id) {
						v.hp = 0;
						v.gone = true;
					}
			}
		},
	},
	dragon: {
		start(e) {
			e.a = edgeSpot();
			e.b = across(e.a);
			e.units = herdAt('dragon', 1, e.a, e.b, 0);
			sfx('roar');
		},
		tick(e) {
			const d = e.units[0];
			if (!d || d.hp <= 0) return;
			nodesNear(d.x, d.y, UNIT.dragon.scorch, (n) => {
				if (n.kind === 'tree' && n.amt > 0 && rng() < 0.5) {
					n.amt = 0;
					scarStrike(n.x, n.y);
				}
			});
			unitsNear(d, UNIT.dragon.scorch, (v) => {
				if (v !== d && v.hp > 0) {
					v.hp -= 10;
					v.hurtT = G.t;
				}
			});
			bldsNear(d.x, d.y, 40, (b) => {
				if (BLD[b.kind].wood && b.prog >= 1) ignite(b, 'the dragon');
			});
		},
		end(e) {
			for (const u of e.units) {
				u.hp = 0;
				u.gone = true;
			}
		},
	},
	troll: {
		start(e) {
			const q = G.P.filter((p) => p.id !== WILD && p.alive && keepOf(p.id)),
				p = q[Math.floor(rng() * q.length)],
				k = keepOf(p.id),
				at = towardMid(k, 260);
			e.units = [wildAt('troll', at.x, at.y)];
			sfx('roar', at.x, at.y);
		},
		end(e) {
			for (const u of e.units)
				if (u.hp > 0) {
					u.hp = 0;
					u.gone = true;
				}
		},
	},
	aurora: {
		draw(e, z, t) {
			const f = Math.sin(Math.PI * clamp((G.t - e.t0) / (e.until - e.t0), 0, 1));
			for (let i = 0; i < 3; i++) {
				const gr = ctx.createLinearGradient(0, 0, 0, ch * 0.5);
				gr.addColorStop(0, `rgba(${i ? 120 : 60},${220 - i * 40},${140 + i * 40},${0.5 * f})`);
				gr.addColorStop(1, 'rgba(60,200,140,0)');
				ctx.fillStyle = gr;
				ctx.beginPath();
				ctx.moveTo(0, 0);
				for (let x = 0; x <= cw; x += 20) ctx.lineTo(x, ch * 0.18 + Math.sin(x / 60 + t * 0.6 + i) * 30 + i * 25);
				ctx.lineTo(cw, 0);
				ctx.closePath();
				ctx.fill();
			}
		},
	},
};
// The ground splits: a star of jagged cracks and a puff of dust at (x, y), r wide. Cosmetic: the damage is done by the sinkhole.
// The arms are worked out once from a seed; the view draws them for 45 s and the ground keeps a faint scar of them.
function crackAt(x, y, r) {
	let s = ((Math.floor(x) * 73856093) ^ (Math.floor(y) * 19349663) ^ G.tick) >>> 0 || 1; // the seed from the place and the tick: no Math.random in the simulation (Build 60)
	const rn = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296,
		n = 5 + Math.floor(rn() * 3),
		arms = [];
	for (let i = 0; i < n; i++) {
		let a = (i / n) * 6.2832 + rn() * 0.6,
			px = 0,
			py = 0;
		const len = r * (0.45 + rn() * 0.55),
			arm = [[0, 0]];
		for (let j = 1; j <= 6; j++) {
			a += (rn() - 0.5) * 0.9;
			px += (Math.cos(a) * len) / 6;
			py += (Math.sin(a) * len) / 6;
			arm.push([px, py]);
		}
		arms.push(arm);
	}
	const c = { x, y, r, t0: G.t, arms };
	(G.cracks = G.cracks || []).push(c);
	scarCrack(c);
}
function startEvent(kind) {
	const E = EVENTS[kind],
		e = { kind, t0: G.t, until: G.t + E.secs };
	G.ev.cur = e;
	G.ev.last = kind;
	G.ev.warned = null;
	if (EV[kind].start) EV[kind].start(e);
	evmSet();
	if (EV_TEXT[kind] && kind !== 'meteor' && kind !== 'mirage')
		news('land', 
			EV_TEXT[kind][1],
			E.harm ? 'warn' : E.gift ? 'good' : 'soft',
			TOAST.mid,
			e.at || (e.units && e.units[0]) || null,
			null,
			EV_WHY[kind],
		); // only what can hurt you takes the line
}
function endEvent() {
	const e = G.ev.cur;
	if (!e) return;
	if (EV[e.kind].end) EV[e.kind].end(e);
	G.ev.cur = null;
	evmSet();
	G.ev.next = G.t + EV_MIN + nextIn(EV_MEAN - EV_MIN);
}
function eventsTick() {
	// once a second
	if (G.cracks && G.cracks.length) G.cracks = G.cracks.filter((c) => G.t - c.t0 < 45); // a sinkhole's cracks fade in 45 s
	const V = G.ev;
	if (!V.next) V.next = G.t + EV_MIN + nextIn(EV_MEAN - EV_MIN);
	if (V.cur) {
		V.cur.s = (V.cur.s || 0) + 1; // seconds the event has run: a tick comes once a second
		if (EV[V.cur.kind].tick) EV[V.cur.kind].tick(V.cur);
		if (G.t >= V.cur.until) endEvent();
	} else if (!V.warned && G.t >= V.next - EV_WARN) {
		V.warned = pickEvent();
		news('land', EV_TEXT[V.warned][0], 'soft', EV_WARN);
	} // the warning is quiet: in the list, not on the line
	else if (V.warned && G.t >= V.next) {
		if (canEv(V.warned)) startEvent(V.warned);
		else {
			V.warned = null;
			V.next = G.t + 30;
		}
	}
	hordeTick();
	newsTick();
	postTick();
}
// The horde (the hazard): announced two seasons ahead, then one; from an edge or out of the wild, for the weakest side; its number grows with the age
function hordeTick() {
	if (!hz('horde') || G.horde === 'done') return;
	if (!G.horde) {
		G.horde = { at: HORDE.min + nextIn(HORDE.mean - HORDE.min), said: 0 };
		return;
	}
	const H = G.horde,
		left = H.at - G.t;
	if (H.said < 1 && left <= HORDE.warn) {
		H.said = 1;
		news('war', EV_TEXT.horde[0], 'warn', TOAST.long);
	}
	if (H.said < 2 && left <= HORDE.warn / 2) {
		H.said = 2;
		news('war', EV_TEXT.horde[1], 'warn', TOAST.long);
	}
	if (left > 0) return;
	const sides = G.P.filter((p) => p.id !== WILD && !calm4b(p.id) && p.alive && keepOf(p.id) && gangRel(p.id, 'out') === 'war'), // 4b: the horde starts nothing with a computer, nor with a side at peace with the outlaws
		weak = sides.sort((a, b) => estPower(WILD, a.id) - estPower(WILD, b.id))[0];
	if (!weak) {
		G.horde = 'done';
		return;
	}
	const from = rng() < 0.5 ? edgeSpot() : wildSpot(),
		age = Math.max(...sides.map((p) => p.age)),
		n = HORDE.n + HORDE.perAge * age,
		k = keepOf(weak.id),
		kinds = G.fantasy ? ['goblin', 'goblin', 'troll'] : ['bandit', 'robber', 'bandit'];
	for (let i = 0; i < n; i++) {
		const u = wildAt(kinds[i % 3], from.x + rnd(-40, 40), from.y + rnd(-40, 40));
		u.hx = k.x;
		u.hy = k.y;
		u.horde = true;
	}
	news('war', EV_TEXT.horde[2], 'warn', TOAST.long, from);
	sfx('horn');
	G.horde = 'done';
}
// ── The climate (Build 54): one tick a second. The air's temperature from the year and the hour; the sky's run as a chain, a new minute
// at a time; wetness closing on where the sky puts it; mud, snow and ice from those. `G.wx` stays the sky's name, which the rest reads.
const blankClim = () => ({ T: CLIMATE.mean, W: CLIMATE.eq.clear, snow: 0, ice: 0, fdd: 0, mud: 0, wet: false, dry: 0, ahead: [] });
const airTemp = (t = G.t) =>
	CLIMATE.mean +
	CLIMATE.year * Math.cos(2 * Math.PI * ((t % YEAR) / YEAR - CLIMATE.peakDay)) +
	CLIMATE.day * Math.cos(2 * Math.PI * ((t % DAY_LEN) / DAY_LEN - CLIMATE.peakHour)); // °C now: the year's swing and the day's
// why the sky turned, in the chain's own numbers: the list shows it under the line (Build 58)
function wxWhy(wx, was, P, c) {
	const pct = (x) => Math.round(x * 10) + ' in 10',
		wet = precip(wx),
		wasWet = precip(was);
	if (wet && wasWet) return `the wet spell holds: ${pct(P[1])} each minute`;
	if (wet)
		return `rain begins ${pct(P[0])} of dry minutes${wx === 'snow' ? '; below freezing it falls as snow' : wx === 'blizzard' ? '; a winter storm' : ''}`;
	if (wx === 'frost') return `clear and the air at ${Math.round(c.T)} °C: frost`;
	if (wx === 'drought') return `${c.dry} dry minutes in heat of ${Math.round(c.T)} °C`;
	return wasWet ? `the rain stopped: ${pct(1 - P[1])} each wet minute` : 'a dry minute: the chain stays dry';
}
const precip = (wx) => wx === 'rain' || wx === 'snow' || wx === 'blizzard';
function skyTurn() {
	// the next minute's sky from this one: the chain, then what falls from the air's temperature
	const c = G.clim,
		s = season().name,
		P =
			hz('drought') && s === 'Summer'
				? CLIMATE.hazard.drought
				: hz('winter') && s === 'Winter'
					? CLIMATE.hazard.winter
					: CLIMATE.chain[s],
		was = G.wx;
	// the sky is rolled ahead, a minute for each step of forecast (Weather signs) and never less than one, so they can tell it
	const lead = fxv(0, 'forecast').a,
		A = c.ahead;
	c.wet = A.length ? A.shift() : rng() < P[c.wet ? 1 : 0];
	while (A.length < Math.max(1, lead)) A.push(rng() < P[(A.length ? A[A.length - 1] : c.wet) ? 1 : 0]);
	if (lead && A[lead - 1] !== (lead > 1 ? A[lead - 2] : c.wet))
		news('land', `${A[lead - 1] ? 'Signs of rain' : 'Signs of a clearing sky'} in ${lead > 1 ? lead + ' minutes' : 'a minute'}.`, 'soft', TOAST.mid);
	c.dry = c.wet ? 0 : c.dry + 1;
	G.wx = c.wet
		? c.T <= CLIMATE.snowAt
			? hz('winter') && rng() < CLIMATE.blizzard
				? 'blizzard'
				: 'snow'
			: 'rain'
		: c.T < 0
			? 'frost'
			: c.dry >= CLIMATE.drought.dry && c.T > CLIMATE.drought.temp
				? 'drought'
				: 'clear';
	if (G.wx !== was && G.t > 1 && WEATHER[G.wx].text) news('land', WEATHER[G.wx].text, '', TOAST.mid, null, null, wxWhy(G.wx, was, P, c));
}
function climateTick(dt) {
	const c = G.clim;
	c.T = airTemp();
	G.wxT -= dt;
	if (G.wxT <= 0) {
		G.wxT = WX_EVERY;
		skyTurn();
		lightning();
	}
	groundTick(c, G.wx, dt);
	if (G.tick % 300 === 2) rutHeal(); // every 10 s the ruts dry back a little
}
// The ground's water, snow, ice and mud for one step, from the air's temperature c.T and the sky wx (pure in c, so the science test can drive it)
function groundTick(c, wx, dt) {
	const K = CLIMATE,
		eq = K.eq[wx] ?? K.eq.clear,
		tau = eq > c.W ? K.tau.wet : K.tau.dry,
		warm = Math.max(0, c.T);
	c.W = relax(c.W, eq, tau, dt); // M(t) = Me + (M0 − Me) e^(−t/τ), the timelag fuel-moisture model
	// snow: falls below snowAt; melts by the degree-day method, faster under rain; the melt water goes into the ground
	const falls = precip(wx) && c.T <= K.snowAt,
		meltS = Math.min(c.snow, K.snow.melt * warm * (precip(wx) && !falls ? 1 + K.snow.rain : 1) * dt);
	c.snow = clamp(c.snow + (falls ? K.snow.fall * (wx === 'blizzard' ? 2 : 1) * dt : -meltS), 0, 1);
	// ice: below freezing, wet ground freezes by Stefan's law (thickness ∝ √ of the freezing degree-seconds); above, it melts by the degree-day
	let meltI = 0;
	if (c.T < 0) {
		if (c.W > K.mud[0] * 0.5) {
			const before = c.ice;
			c.fdd += -c.T * dt;
			c.ice = Math.min(1, Math.sqrt(c.fdd / K.ice.fdd));
			c.W = Math.max(0, c.W - (c.ice - before) * K.ice.water); // the water that froze leaves the ground
		}
	} else {
		meltI = Math.min(c.ice, K.ice.melt * warm * dt);
		c.ice -= meltI;
		c.fdd = c.ice * c.ice * K.ice.fdd; // so the next freeze grows from the ice that is left
	}
	c.W = Math.min(1, c.W + meltS * K.snow.water + meltI * K.ice.water); // the melt wets the ground (conservation: nothing vanishes)
	c.mud = c.T < 0 ? 0 : clamp((c.W - K.mud[0]) / (K.mud[1] - K.mud[0]), 0, 1); // frozen ground is hard ground
}
// Traffic (Build 62): every unit-second on a square deepens its ruts. Ruts hold water, so mud is deeper where the feet go: rut depth grows as
// passes^0.4 (USFS trafficability studies, Build 62) toward `deep` at n0 unit-seconds, and heals with the timelag. Roads (the mud research) count here too.
const ruts = () => G.tread || (G.tread = new Uint16Array(FOGN * FOGN));
const rutsAt = (x, y) => ruts()[clamp((y / FOG) | 0, 0, FOGN - 1) * FOGN + clamp((x / FOG) | 0, 0, FOGN - 1)];
const rutsOn = (u) => {
	const T = ruts(),
		i = clamp((u.y / FOG) | 0, 0, FOGN - 1) * FOGN + clamp((u.x / FOG) | 0, 0, FOGN - 1);
	if (T[i] < 65535) T[i]++;
};
function rutHeal() {
	const T = ruts(),
		k = Math.exp(-10 / CLIMATE.rut.tau);
	for (let i = 0; i < T.length; i++) if (T[i]) T[i] = Math.floor(T[i] * k);
}
const rutOf = (x, y) => CLIMATE.rut.deep * Math.min(1, rutsAt(x, y) / CLIMATE.rut.n0) ** 0.4;
// mud at a place: the ground's mud, deeper by water (pooling) and by traffic (ruts)
const mudAt = (at) =>
	at ? G.clim.mud * (NAV.shore[gcell(at.x, at.y)] ? CLIMATE.shore : 1) * (1 + rutOf(at.x, at.y)) : G.clim.mud;
// what a step needs of the ground (Hanson et al. 1999), by what is stepping: an engine's haulers, a horse, a man (keys: unitKeys)
const groundNeed = (keys) =>
	CLIMATE.mu.need[keys && keys.includes('#siege') ? 'siege' : keys && keys.includes('#mounted') ? 'horse' : 'foot'];
// whether iron bites the ice for this contact (D-064): Horseshoes on hooves, Crampons on boots, each keyed to its own
const studded = (o, keys) => o !== WILD && fxv(o, 'studs', keys).a > 0;
// the ice's friction now: slickest just below freezing (the melt film), better in deep cold; iron studs give at least theirs
const iceMu = (studs) => {
	const M = CLIMATE.mu,
		ice = G.clim.T <= 0 ? M.ice0 + (M.iceCold - M.ice0) * Math.min(1, -G.clim.T / M.coldAt) : M.ice0 * 0.6;
	return studs ? Math.max(ice, M.studs) : ice;
};
// what the ground takes off a march for one side, at a place if given: Pandolf's terrain factor over dirt, as 1 / η, and the shorter stride on
// ice, by the share of the grip a step lacks there (none when what the ice offers meets the need: design, inside the measured μ)
const strideShare = (need, mu) => (need <= mu ? 0 : clamp((need - mu) / (need - iceMu(false)), 0, 1)); // no stride lost when the studs hold the need
const groundSpd = (o, keys, at) => {
	const c = G.clim,
		need = groundNeed(keys);
	return (
		(1 /
			(1 +
				CLIMATE.terrain.mud * Math.min(1, mudAt(at)) * fxv(o, 'mud', keys).m * (keys.includes('#wagon') ? CAMP.wheelMud : 1) + // a wagon's wheels sink deeper (CAMP)
				CLIMATE.terrain.snow * c.snow * (1 - fxv(o, 'snow', keys).a))) *
		(1 - CLIMATE.mu.stride * c.ice * (studded(o, keys) ? strideShare(need, iceMu(true)) : 1))
	);
};
// Traction: the friction the ground offers now, a blend by cover (ice over snow over mud over dry); studs change only the ice's part
const muOf = (at, studs) => {
	const c = G.clim,
		M = CLIMATE.mu,
		ground = Math.min(1, mudAt(at)) * M.mud + (1 - Math.min(1, mudAt(at))) * M.dry,
		snow = c.snow * M.snow + (1 - c.snow) * ground;
	return c.ice * iceMu(studs) + (1 - c.ice) * snow;
};
// the chance of a slip in a check: a logistic step on what the step needs less what the ground offers (Hanson et al. 1999), only where there is ice to slip on
const slipChance = (u, need, studs) =>
	G.clim.ice <= 0 ? 0 : G.clim.ice / (1 + Math.exp(-(need - muOf(u, studs)) / CLIMATE.mu.soft));
// fire against the ground's wetness: Rothermel's damping η = 1 − 2.59r + 5.11r² − 3.52r³, r = M/Mx ≤ 1, as a share of a clear day's
const rothermel = (r) => 1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r;
const fireMul = () => clamp(rothermel(Math.min(1, G.clim.W)) / rothermel(CLIMATE.eq.clear), 0, 2);
const wearMul = (o) => (G.wx === 'frost' || precip(G.wx) ? 1 - CLIMATE.wear * (1 - Math.min(1, fxv(o, 'wear').a)) : 1); // brittle in frost, rusted in rain
function newsTick() {
	if (G.t - (G.ev.newsT || 0) < NEWS_EVERY || G.t < 60) return;
	G.ev.newsT = G.t;
	const L = NEWS[Math.min(G.P[0].age, NEWS.length - 1)],
		i = (G.ev.newsI = (G.ev.newsI || 0) + 1) % L.length;
	news('chronicle', L[i], 'news', TOAST.long);
}
// a herd crosses: bison trample what they run over; performers only pass; a dragon flies (it is drawn above everything and walks through walls)
function herdTick(u, dt, SP) {
	const U = UNIT[u.kind];
	if (U.look === 'dragon') {
		const d = hyp(u.px - u.x, u.py - u.y) || 1;
		stepTo(u, u.x + ((u.px - u.x) / d) * U.spd * dt, u.y + ((u.py - u.y) / d) * U.spd * dt);
		u.fx = Math.sign(u.px - u.x) || u.fx;
		u.mvT = G.t;
		u.fly = 34;
		return;
	}
	if (moveTo(u, u.px, u.py, dt, 10, 1)) {
		u.hp = 0;
		u.gone = true;
		return;
	}
	if (U.trample && (G.tick + u.id) % 6 === 0) {
		unitsNear(u, 12, (v) => {
			if (v !== u && !v.herd && v.hp > 0 && dist(u, v) < 12) {
				v.hp -= U.trample;
				v.hurtT = G.t;
				v.flashT = G.t;
				stepTo(v, v.x + (v.x - u.x) * 0.6, v.y + (v.y - u.y) * 0.6);
			}
		});
		const n = G.nodes.find((m) => m.kind === 'farm' && m.farm && m.type === 'food' && dist(m, u) < 20);
		if (n && n.farm.fert > FERT.floor) n.farm.fert = Math.max(FERT.floor, n.farm.fert - 0.02);
	}
}
// hunger, once a second, for every side (Albert, Nov 1): the store empty is hunger (p.hungry); with no food in reach too it is a famine (famT),
// which weakens the work after STARVE.grace (hungerOf); under the Famine hazard people then leave, one every STARVE.every
function starveTick(p) {
	const o = p.id;
	p.famT = p.hungry && !foodInReach(o) ? (p.famT || 0) + 1 : 0;
	if (o === 0 && p.famT === 1) news('home', 'Famine: no food in reach. Two days to recover.', 'warn', TOAST.long);
	if (!hz('starve') || p.famT < STARVE.grace || (p.famT - STARVE.grace) % STARVE.every) return;
	const v = unitsOf(o, 'vil').sort((a, b) => a.carry - b.carry)[0],
		s = soldiersOf(o).filter((u) => u.state === 'home')[0];
	for (const u of [v, s])
		if (u) {
			u.hp = 0;
			u.gone = true;
		}
	if (o === 0 && (v || s)) news('home', `Starving: ${v ? 'a villager left' : ''}${v && s ? ', ' : ''}${s ? 'a soldier deserted' : ''}.`, 'warn', TOAST.mid);
}
// food a side can still reach: a bush, its own field, fish or meat with something left, or game, in its Town Center's region of the walking grid
function foodInReach(o) {
	const k = keepOf(o);
	if (!k) return false;
	const cm = regionAt(k, o);
	return (
		G.nodes.some((n) => n.type === 'food' && n.amt > 0 && (!n.farm || n.farm.owner === o) && (n.kind !== 'fish' || dockNear(o, n)) && reachFrom(n, cm, o)) || // a field only if it is your own
		G.units.some((u) => u.owner === WILD && u.hp > 0 && UNIT[u.kind].meat && regionAt(u, o) === cm)
	);
}
// ═════ 38-camps.js: war camps (Albert, Nov 3): the wagon, the strip and the square, the soldiers who raise them ═════
// An Outpost is a thin strip: four tents and a tower in one file, broadside to the way home (Hyginus §1: a century's tents in one line).
// A Camp is a square of CAMP.side squares: a palisade with a gate in the home side, a tower at each corner, the four tents inside along
// the walls, the yard in the middle for CAMP.hold soldiers (§1: eight men a tent; §4: the hospital away from the workshops, here across
// the yard). The pieces come off the wagon as sites; villagers and foot soldiers raise them (CAMP.build). Trees under the camp burn.
const CAMP_TENTS = ['medtent', 'traintent', 'messtent', 'depot'];
// the pieces of a camp of a kind at (x, y), facing fx, fy (toward home: the gate side): [{kind, x, y}]
function campLayout(kind, x, y, fx, fy) {
	const L = [],
		R = (ax, ay) => ({ x: x + (-fy * ax + fx * ay) * NAVC, y: y + (fx * ax + fy * ay) * NAVC }), // across, along (toward home)
		put = (k, ax, ay) => L.push({ kind: k, ...R(ax, ay) });
	if (kind === 'outpost') {
		[...CAMP_TENTS, 'camptower'].forEach((k, i) => put(k, (i - 2) * 3, 0)); // five 2 × 2 in a file, a square between each
		return L;
	}
	const h = CAMP.side / 2; // the palisade on the square's edge, the gate the two middle squares of the home side
	for (let i = -h; i < h; i++) {
		const g = i === -1 || i === 0; // the gate's two squares
		put(g ? 'gate' : 'palisade', i + 0.5, h - 0.5); // the home side (toward home)
		put('palisade', i + 0.5, -h + 0.5);
		if (i > -h && i < h - 1) {
			put('palisade', -h + 0.5, i + 0.5); // the two sides, the corners already laid
			put('palisade', h - 0.5, i + 0.5);
		}
	}
	for (const [sx, sy] of [
		[-1, -1],
		[1, -1],
		[-1, 1],
		[1, 1],
	])
		put('camptower', sx * (h - 2), sy * (h - 2)); // the corners, inside the stakes
	put('medtent', -(h - 2), 0); // the hospital on one side, the workshops' side across the yard (§4)
	put('traintent', h - 2, 0);
	put('messtent', 0, -(h - 2)); // the mess at the back
	put('depot', 0, h - 4); // the depot inside the gate
	return L;
}
// facing: from the spot toward the owner's Town Center (the gate side), else south
function campFacing(o, x, y) {
	const k = keepOf(o),
		dx = k ? k.x - x : 0,
		dy = k ? k.y - y : 1,
		d = hyp(dx, dy) || 1;
	return { x: dx / d, y: dy / d };
}
// the square of ground a camp takes: every piece's footprint plus a lane, as canPlace keeps for a building
function campCells(L) {
	const cells = new Set();
	for (const p of L) {
		const n = BLD[p.kind].fp,
			sp = snapPos(p.kind, p.x, p.y),
			m = BLD[p.kind].wallish ? 0 : 1;
		for (let j = -m; j < n + m; j++) for (let i = -m; i < n + m; i++) cells.add((sp.gy + j) * NC + (sp.gx + i));
	}
	return cells;
}
// why a camp cannot stand here, or null: off the map, on water, on a building or a find; trees are allowed (they burn)
function campWhy(o, kind, x, y) {
	const L = campLayout(kind, x, y, ...Object.values(campFacing(o, x, y)));
	for (const p of L) {
		const sp = snapPos(p.kind, p.x, p.y),
			n = BLD[p.kind].fp;
		if (sp.gx < 2 || sp.gy < 2 || sp.gx + n > NC - 2 || sp.gy + n > NC - 2) return 'Too near the edge of the map.';
	}
	const cells = campCells(L);
	for (const c of cells) {
		if (NAV.lake[c]) return 'A camp cannot stand in water.';
		if (NAV.occ[c]) return 'A building stands there.';
	}
	for (const n of G.nodes) if (n.kind !== 'tree' && n.amt > 0 && cells.has(Math.floor(n.y / NAVC) * NC + Math.floor(n.x / NAVC))) return 'A resource lies there.'; // stone, ore, berries under the square: the trees burn, the rest stays (p44)
	const cx = x,
		cy = y,
		reach = (kind === 'camp' ? CAMP.side / 2 + 1 : 9) * NAVC;
	for (const f of G.finds) if (!f.done && hyp(f.x - cx, f.y - cy) < reach + (FINDS[f.kind].r || 30)) return 'Too near a find.';
	return null;
}
// the wagon unpacks: the trees under the camp burn, the sites are laid, the wagon is gone
function campUnpack(u) {
	const o = u.owner,
		kind = UNIT[u.kind].camp,
		why = campWhy(o, kind, u.x, u.y);
	if (why) {
		if (o === 0) say(why + ' Send the wagon elsewhere.', 'warn', TOAST.mid);
		u.state = 'home';
		return false;
	}
	const f = campFacing(o, u.x, u.y),
		L = campLayout(kind, u.x, u.y, f.x, f.y),
		cells = campCells(L),
		burnt = [];
	for (const n of G.nodes)
		if (n.kind === 'tree' && n.amt > 0) {
			const cx = Math.floor(n.x / NAVC),
				cy = Math.floor(n.y / NAVC);
			let hit = false;
			for (let j = -CAMP.burn; j <= CAMP.burn && !hit; j++) for (let i = -CAMP.burn; i <= CAMP.burn && !hit; i++) if (cells.has((cy + j) * NC + cx + i)) hit = true;
			if (hit) burnt.push(n);
		}
	for (const n of burnt) n.amt = 0;
	if (burnt.length) G.nodes = G.nodes.filter((n) => !burnt.includes(n));
	// the abatis (Albert, Nov 3, field defences: yes): a Camp's felled trees outside the palisade are laid as its outer work, a wall of
	// branches on the forest side, for nothing; a tree inside the square is burned and gone
	const abatis = [];
	if (kind === 'camp') {
		const h = CAMP.side / 2,
			inSquare = (n) => Math.abs(-f.y * (n.x - u.x) + f.x * (n.y - u.y)) < h * NAVC && Math.abs(f.x * (n.x - u.x) + f.y * (n.y - u.y)) < h * NAVC;
		const homeSide = (n) => f.x * (n.x - u.x) + f.y * (n.y - u.y) > (h - 1) * NAVC; // the gate side (toward home): no abatis across it, the way in stays open (p44)
		for (const n of burnt) if (!inSquare(n) && !homeSide(n)) abatis.push(n);
	}
	const id = NID++;
	navOnce(() => {
		for (const p of L) {
			const b = mkBld(o, p.kind, p.x, p.y, 0);
			b.camp = id;
			b.campKind = kind;
			G.blds.push(b);
			G.navDirty = true;
		}
		for (const n of abatis) {
			const sp = snapPos('abatis', n.x, n.y);
			if (cells.has(sp.gy * NC + sp.gx) || NAV.occ[sp.gy * NC + sp.gx] || G.blds.some((b) => b.camp === id && b.gx === sp.gx && b.gy === sp.gy)) continue;
			const b = mkBld(o, 'abatis', n.x, n.y, 1);
			b.camp = id;
			b.campKind = kind;
			G.blds.push(b);
		}
		navRebuild();
	});
	u.hp = 0;
	u.gone = true;
	if (o === 0) {
		news('war', `${kind === 'camp' ? 'The camp' : 'The outpost'} is unpacked at ${coord(u.x, u.y)}: ${burnt.length ? burnt.length + ' trees felled' + (abatis.length ? ', an abatis laid' : '') + '; ' : ''}soldiers and villagers raise it.`, 'good', TOAST.mid, { x: u.x, y: u.y });
		sfx('thock', u.x, u.y);
	}
	return true;
}
// the wagon on the road: sent to a spot it drives there and unpacks; at home it waits by the Stable
function wagonTick(u, dt, SP) {
	if (u.state === 'goto') {
		if (moveTo(u, u.px, u.py, dt, 6, SP)) campUnpack(u);
		return;
	}
	const h = homeSpot(u, 90);
	if (h) moveTo(u, h.x, h.y, dt, 3, SP);
}
// how many camps of a kind a side may have out at once, wagons on the road and in the line counted: one, two from the age after
const campCap = (o, kind) => {
	const p = G.P[o];
	if (kind === 'camp' && (!p.techs.has('campwagons') || !bldsOf(o, CAMP.need).some((b) => standing(b, o)))) return 0; // a Store standing (the stores a camp draws on)
	const first = kind === 'camp' ? 2 : 1;
	return p.age < first ? 0 : p.age >= first + 1 ? 2 : 1;
};
const campsOut = (o, kind) => {
	const ids = new Set();
	for (const b of G.blds) if (b.owner === o && b.hp > 0 && b.campKind === kind && !BLD[b.kind].wallish) ids.add(b.camp); // a camp is its tents, not a last palisade tile (p44)
	let n = ids.size;
	for (const u of G.units) if (u.owner === o && u.hp > 0 && UNIT[u.kind].camp === kind) n++;
	for (const b of G.blds) if (b.owner === o && b.hp > 0) for (const j of b.q) if (j.kind && UNIT[j.kind].camp === kind) n++;
	return n;
};
const campWhyTrain = (o, kind) => {
	const cap = campCap(o, kind);
	if (!cap) return kind === 'camp' ? (G.P[o].age < 2 ? 'Camp wagons need the Classical age.' : !bldsOf(o, CAMP.need).some((b) => standing(b, o)) ? 'A camp draws on a Store: build one first.' : 'Research Camp wagons at the Stable first.') : 'Outpost wagons need the Bronze age.';
	if (campsOut(o, kind) >= cap) return cap === 1 ? `One ${kind} at a time; a second comes with the next age.` : `Two ${kind}s at a time.`;
	return null;
};
// a foot soldier (unmounted, no engine) standing idle near an unraised piece of its own side's camp lends a hand (CAMP.build of a villager)
const canRaise = (u) => isSoldier(u) && !UNIT[u.kind].tags.includes('mounted') && !UNIT[u.kind].tags.includes('siege') && !u.tgt && (u.state === 'home' || (u.state === 'goto' && hyp(u.px - u.x, u.py - u.y) < 60)) && !(u.chg > G.t) && !u.goingHome; // at home or arrived where it was sent
function campRaise(u, dt, SP) {
	const needs = (b) => b.prog < 1 || b.hp < maxHpB(b.owner, b.kind) * CAMP.mend; // unraised, or worn under CAMP.mend
	if (u.site && (!needs(u.site) || u.site.hp <= 0)) u.site = null;
	if (!u.site) {
		if ((G.tick + u.id) % 15 !== 0 || !canRaise(u)) return false;
		let best = null,
			bd = 160;
		const taken = new Map(); // who is already on each piece: the hands spread over the pieces (a crowd on one piece builds it little faster)
		for (const v of G.units) if (v.site && v.owner === u.owner && v !== u) taken.set(v.site, (taken.get(v.site) || 0) + 1);
		for (const b of G.blds)
			if (b.owner === u.owner && b.camp && needs(b) && b.hp > 0) {
				const d = dist(u, b) + 60 * (taken.get(b) || 0);
				if (d < bd + 60 * 3 && (best === null || d < bd)) {
					bd = d;
					best = b;
				}
			}
		u.site = best;
		u.siteK = u.state + u.px + ',' + u.py; // a new order (a new spot) takes it off the work
		if (!best) return false;
	}
	const b = u.site;
	if (!b || !needs(b) || b.hp <= 0 || u.tgt || u.state === 'rout' || u.chg > G.t || u.goingHome || u.siteK !== u.state + u.px + ',' + u.py) {
		u.site = null;
		return false;
	}
	if (rectGap(u.x, u.y, b) > 7 && !moveTo(u, b.x, b.y, dt, 8, SP)) return true; // as a villager raising a site (13-sim-civil repairTick)
	{
		const hands = CAMP.build * fxv(u.owner, 'campbuild').m;
		if (b.prog < 1) b.crew = (b.crew || 0) + hands;
		else b.hp = Math.min(maxHpB(b.owner, b.kind), b.hp + ((maxHpB(b.owner, b.kind) * 0.9 * hands) / BLD[b.kind].t) * dt); // mending at the raising rate
		u.work = G.t;
	}
	return true;
}
// a soldier by a medical tent that is badly hurt or sick walks home to the Hospital (none: it stays and is bound where it is)
function campSendHome(u) {
	if (u.owner === WILD || (G.tick + u.id) % 30 !== 0 || u.tgt || u.state === 'rout' || u.goingHome) return;
	if (!(u.hp < u.max * CAMP.sendHome || u.sick > G.t)) return;
	const tent = G.blds.find((b) => b.owner === u.owner && b.kind === 'medtent' && b.prog >= 1 && b.hp > 0 && dist(b, u) < BLD.medtent.hrng);
	if (!tent) return;
	const hosp = G.blds.find((b) => b.owner === u.owner && b.kind === 'hospital' && b.prog >= 1 && b.hp > 0);
	if (!hosp) return;
	u.state = 'goto';
	u.px = hosp.x + 30;
	u.py = hosp.y + 30;
	u.goingHome = true;
	u.drill = null;
	u.amb = null;
	u.focus = null;
	if (u.owner === 0) say(`${UNIT[u.kind].name} sent home to the Hospital.`, '', TOAST.short);
}

// ── step 2: supplies, the caravan's run, wear and mending, the camp as a pool for sickness
const depotsOf = (o) => G.blds.filter((b) => b.owner === o && b.kind === 'depot' && b.prog >= 1 && b.hp > 0);
const depotNear = (u) => depotsOf(u.owner).find((b) => dist(b, u) < CAMP.reach) || null; // the depot a unit eats from
// every second (36-economy upkeepTick): the soldiers in a camp's reach eat from its depot (eats(u): the food a unit eats a second); with it empty they are unsupplied
function campEat(o, eats) {
	const D = depotsOf(o);
	if (!D.length) return 0;
	let fed = 0;
	for (const u of G.units) {
		if (u.owner !== o || !isSoldier(u) || u.inside) continue;
		const d = D.find((b) => dist(b, u) < CAMP.reach);
		if (!d) {
			u.unfed = 0;
			continue;
		}
		const eat = eats(u);
		if ((d.supply || 0) >= eat) {
			d.supply -= eat;
			fed += eat;
			u.unfed = 0;
		} else {
			u.unfed = (u.unfed || 0) + 1;
			u.tired = Math.max(u.tired || 0, G.t + 2); // unsupplied: slow, and no mending (14-sim-troops)
			if (o === 0 && !(G.unfedT > G.t - 60)) {
				G.unfedT = G.t;
				news('war', 'The camp is out of food: a caravan brings it.', 'warn', TOAST.long, d);
			}
		}
	}
	return fed; // the food eaten here, off the town's bill
}
// a Market caravan with nothing to carry runs food to a depot under half (caravanTick): the food from the store and the carter's fee in gold
function supplyRun(u, dt, SP) {
	const o = u.owner,
		p = G.P[o];
	if (!u.sup) {
		if ((G.tick + u.id) % 30) return false;
		const home = nearest(G.blds, u, (b) => b.owner === o && b.kind === 'market' && b.prog >= 1 && b.hp > 0);
		if (!home) return false;
		const d = nearest(depotsOf(o), home, (b) => (b.supply || 0) < CAMP.supply / 2 && !G.units.some((v) => v.sup && v.sup.b === b.id && v.hp > 0));
		if (!d) return false;
		const fee = Math.ceil((CAMP.fee * dist(home, d)) / 100),
			food = Math.min(CAMP.load, Math.floor(p.res.f - CAMP.keep.f));
		if (food < 20 || p.res.g < fee + CAMP.keep.g) return false; // the treasury keeps its floor: a supply run never spends the next age (p44)
		u.sup = { b: d.id, h: home.id, leg: 'load', food, fee };
		return true;
	}
	const S = u.sup,
		d = byId(G.blds, S.b),
		h = byId(G.blds, S.h);
	if (!d || d.hp <= 0 || !h || h.hp <= 0) {
		u.sup = null;
		return false;
	}
	if (S.leg === 'load') {
		if (!moveTo(u, h.x, h.y, dt, halfOf(h) + 4, SP)) return true;
		const food = Math.min(S.food, Math.floor(p.res.f));
		if (food < 20 || p.res.g < S.fee) {
			u.sup = null;
			return false;
		}
		spend(p, 'f', food, 'camps');
		spend(p, 'g', S.fee, 'camps');
		S.food = food;
		S.leg = 'go';
		return true;
	}
	if (S.leg === 'go') {
		if (!moveTo(u, d.x, d.y, dt, halfOf(d) + 14, SP)) return true;
		d.supply = Math.min(CAMP.supply, (d.supply || 0) + S.food);
		if (o === 0) say(`Depot stocked: ${S.food} food, ${S.fee} gold for the road.`, 'good', TOAST.short);
		S.leg = 'back';
		return true;
	}
	if (!moveTo(u, h.x, h.y, dt, halfOf(h) + 4, SP)) return true;
	u.sup = null;
	return false;
}
// a minute of rain, snow or frost takes CAMP.wear of a camp piece's health (every minute; 36-economy econTick)
function campWearTick() {
	const wet = G.wx === 'rain' || G.wx === 'snow' || G.wx === 'frost' || G.wx === 'blizzard';
	if (!wet) return;
	for (const b of G.blds) if (b.camp && b.prog >= 1 && b.hp > 0) b.hp = Math.max(1, b.hp - CAMP.wear * maxHpB(b.owner, b.kind));
}
// ═════ 38-natives.js: the Natives and the Throne ═════
// ───────────────────────── The Natives: the fifth side's one brain, and the Throne ─────────────────────────
// Regard is what they think of each side (0..100). It is the one number behind peace, alliance, raids and the gate.
const throneB = () => G.blds.find((b) => b.kind === 'throne' && b.hp > 0) || null;
// where a side or a group is found: the Natives at the Throne; a misfit group at its nearest camp (or its horde) to at
const homeOf = (o, at) => (o === WILD ? throneB() : GANG[o] ? nearest(G.units, at || { x: MID, y: MID }, (v) => v.hp > 0 && gangOf(v) === o) : keepOf(o));
const natState = () => G.nat || (G.nat = { handT: {}, said: {} }); // what is the Natives' own: the handover, the raids, the garrison's regrowth
// Regard (answer 1b): each misfit group (GANG) keeps its own regard for each side, and its own stance with it (the Natives': G.rel).
const gangState = (g) =>
	(G.gang ??= {})[g] ||
	(G.gang[g] = {
		regard: G.P.map(() => REGARD.regard0),
		gifts: G.P.map(() => []),
		warBy: {},
		hitT: {},
		...(g === 'nat' ? {} : { rel: G.P.map(() => 'war') }),
	});
const regardOf = (o, g = 'nat') => gangState(g).regard[o];
function addRegard(o, g, d) {
	const N = gangState(g);
	N.regard[o] = clamp(N.regard[o] + d, 0, 100);
	gangSync(o, g);
}
// a side's stance with a group is set: the Natives through the fifth side's relations, the others in their own list
function gangSet(o, g, want) {
	if (g === 'nat') {
		G.rel[o][WILD] = G.rel[WILD][o] = want;
		G.navDirty = true; // the Natives' gates open to a friend
	} else gangState(g).rel[o] = want;
}
// peace and war follow regard; an alliance needs an emissary and ends the moment regard falls under the line
function gangSync(o, g) {
	if (o === WILD || !G.P[o].alive) return;
	const r = regardOf(o, g),
		rel = gangRel(o, g),
		N = gangState(g);
	if (rel === 'ally' && r < REGARD.allyAt - 10) {
		if (g === 'nat') makePeace(o, WILD);
		else gangSet(o, g, 'peace');
		if (o === 0) news('realm', `The ${GANG[g]} end the alliance: regard fell.`, 'warn', TOAST.mid);
	} else if (rel !== 'ally') {
		if (N.warBy[o] && r >= REGARD.allyAt) N.warBy[o] = false;
		const want = N.warBy[o] ? 'war' : r >= REGARD.peaceAt ? 'peace' : 'war';
		if (want !== rel) {
			gangSet(o, g, want);
			if (o === 0)
				news(
					'realm',
					want === 'peace'
						? `The ${GANG[g]} leave you be: regard above ${REGARD.peaceAt}.`
						: `The ${GANG[g]} turn on you: regard under ${REGARD.peaceAt}.`,
					want === 'peace' ? 'good' : 'warn',
					TOAST.mid,
				);
		}
	}
}
// gifts (bribes): the Danegeld rule, each buys less than the last within the window
const giftsRecent = (o, g) => gangState(g).gifts[o].filter((t) => G.t - t < REGARD.giftWindow).length;
const giftGain = (o, amt, g) => Math.max(1, Math.round(amt / 10 / (1 + REGARD.danegeld * giftsRecent(o, g))));
function giftWhy(o, amt, g) {
	if (g === 'nat' && !throneB()) return 'The Throne is taken.';
	if (G.P[o].res.g < amt) return `Not enough gold: ${amt}.`;
	return null;
}
function giveGift(o, amt, g) {
	if (giftWhy(o, amt, g)) return false;
	const gain = giftGain(o, amt, g);
	spend(G.P[o], 'g', amt, 'tribute');
	gangState(g).gifts[o].push(G.t);
	addRegard(o, g, gain);
	if (o === 0)
		news(
			'realm',
			`${GANG[g]}: ${amt} gold, regard +${gain}${giftsRecent(o, g) > 1 ? '. They expect more' : ''}.`,
			'good',
			TOAST.mid,
		);
	return true;
}
// an emissary to a group: the Natives' answer, copied for every misfit group (Albert, Nov 1; their own logic is v81's)
function judgeGang(g, from, envoy, ask) {
	if (ask !== 'ally') {
		reply(from, envoy, `The ${GANG[g]} answer only to regard, not to words.`);
		return;
	}
	if (regardOf(from, g) < REGARD.allyAt) {
		reply(from, envoy, `The ${GANG[g]} send your emissary back: regard ${Math.round(regardOf(from, g))} of ${REGARD.allyAt}.`);
		return;
	}
	if (g === 'nat') {
		makeAlly(WILD, from);
		reply(from, envoy, 'The Natives accept you. Their gate opens to you.');
	} else {
		gangSet(from, g, 'ally');
		reply(from, envoy, `The ${GANG[g]} accept you as a friend.`);
	}
}
// the citadel's garrison: warriors in the yard, bowmen on the walls; it grows back while the Natives hold the Throne
// Albert's rule: skilled, swift, light and many, with the ground on their side; not brawny, not advanced. Gunpowder is the game-changer: once a side has it, the garrison thins and guns tell
const gunAge = () => G.P.some((p) => p.id !== WILD && p.alive && p.age >= NATIVE.gunAge);
const garrisonMax = () =>
	Math.round(
		(NATIVE.garrison + NATIVE.perAge * Math.max(0, ...G.P.filter((p) => p.id !== WILD && p.alive).map((p) => p.age))) *
			(gunAge() ? NATIVE.gunMax : 1),
	);
function natSpawn(T, kind) {
	const u = addUnit(WILD, kind, T.x + rnd(-30, 30), T.y + 44 + rnd(-6, 6));
	u.hb = T.id;
	u.state = 'home';
	u.native = true;
	return u;
}
const throneHold = () => THRONE.hold * (MODES[G.mode].secs ? MODES[G.mode].secs / 3600 : 1);
// the Throne changes hands: broken down, or sworn over by allied Natives; the walls and towers go with it, the garrison does not
function takeThrone(o, sworn) {
	const T = G.blds.find((b) => b.kind === 'throne' && !b.gone);
	if (!T) return;
	const was = G.throne ? G.throne.owner : WILD;
	T.hp = sworn ? maxHpB(o, 'throne') : maxHpB(o, 'throne') / 3;
	T.mx = maxHpB(o, 'throne');
	T.owner = o;
	T.by = undefined;
	for (const b of G.blds)
		if (b.citadel && b.hp > 0) {
			b.owner = o;
			b.by = undefined;
		}
	for (const u of G.units)
		if (u.native && u.hp > 0) {
			if (sworn) {
				u.owner = o;
				u.native = false;
				u.state = 'home';
			} else {
				u.hp = 0;
				u.gone = true;
			}
		}
	G.throne = { owner: o, since: G.t };
	G.navDirty = true;
	qcDrop();
	news('realm', 
		o === 0
			? sworn
				? 'The Natives swear: the Throne is yours.'
				: 'The Throne is yours. Hold it.'
			: `${G.P[o].name} ${sworn ? 'were sworn' : 'took'} the Throne!`,
		o === 0 ? 'good' : 'warn',
		TOAST.long,
		T,
	);
	sfx(o === 0 ? 'win' : 'horn');
	if (was !== WILD && was !== o && G.P[was]) G.P[was].wave = null;
}
// Traps: hidden buildings (pits, nets, stakes) of any side. A foe who steps on one springs it; a scout within reach finds it for its side, who then step round it;
// allies walk free; a net takes a man, not an engine. The Natives keep four on each causeway and lay fresh ones while they hold the Throne.
const trapAt = (owner, kind, x, y) => {
	const b = mkBld(owner, kind, x, y, 1);
	b.seen = {};
	G.blds.push(b);
	return b;
};
function layTraps() {
	if (!throneB() || (G.throne && G.throne.owner !== WILD)) return;
	for (const [dx, dy] of [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	]) {
		const have = G.blds.filter(
			(b) =>
				BLD[b.kind].trap &&
				b.owner === WILD &&
				b.hp > 0 &&
				Math.sign(Math.round((b.x - MID) / 50)) === dx &&
				Math.sign(Math.round((b.y - MID) / 50)) === dy,
		).length;
		for (let i = have; i < NATIVE.traps; i++) {
			const d = THRONE.r + 20 + rnd(10, LAKE0.r - THRONE.r - 40),
				s = rnd(-THRONE.cause / 2 + 6, THRONE.cause / 2 - 6);
			trapAt(WILD, i % 2 ? 'net' : 'pit', MID + dx * d + dy * s, MID + dy * d + dx * s);
		}
	}
}
function trapsTick() {
	for (const b of G.blds) {
		if (!BLD[b.kind].trap || b.prog < 1 || b.hp <= 0) continue;
		const kind = BLD[b.kind].trap;
		unitsNear(b, NATIVE.scoutSees, (v) => {
			if (
				b.hp <= 0 ||
				v.hp <= 0 ||
				v.fly ||
				v.herd ||
				v.inside ||
				v.owner === b.owner ||
				friendly(v.owner, b.owner) ||
				(v.owner === WILD && !v.horde) ||
				(b.owner === WILD && calm4b(v.owner)) // 4b: the Natives' pits and nets start nothing with a computer
			)
				return;
			if (v.kind === 'scout' && !b.seen[v.owner]) {
				b.seen[v.owner] = 1;
				if (v.owner === 0)
					news('war', 
						`Your scout found ${kind === 'pit' ? 'a pit' : kind === 'net' ? 'a net' : kind === 'caltrops' ? 'caltrops' : 'stakes'} at ${coord(b.x, b.y)}.`,
						'good',
						TOAST.mid,
						b,
					);
				return;
			}
			if (b.seen[v.owner] || dist(v, b) > NATIVE.trapR) return;
			if (kind === 'caltrops') {
				// a square of caltrops takes CALTROPS.hits before it is trodden flat; horse worst, then foot; seen by the side once sprung
				if (G.t - (v.spikeT || -9) < CALTROPS.again) return;
				v.spikeT = G.t;
				const horse = hasTag(v.kind, 'mounted');
				v.hp -= v.max * (horse ? CALTROPS.horse : CALTROPS.foot);
				v.hurtT = G.t;
				v.flashT = G.t;
				if (horse) v.stuck = G.t + CALTROPS.stuck;
				b.hits = (b.hits || 0) + 1;
				b.seen[v.owner] = 1;
				if (b.hits >= CALTROPS.hits) {
					b.hp = 0;
					b.gone = true;
				}
				if (v.owner === 0) news('war', `Caltrops! Your ${UNIT[v.kind].name.toLowerCase()} is hurt${horse ? ' and lamed' : ''}.`, 'warn', TOAST.mid, b);
				else if (b.owner === 0 && (G.tick + b.id) % 90 === 0) news('war', `Your caltrops caught a ${UNIT[v.kind].name.toLowerCase()} of ${G.P[v.owner].name}.`, 'good', TOAST.mid, b);
				return;
			}
			b.hp = 0;
			b.gone = true;
			scarStrike(b.x, b.y);
			if (kind === 'pit') {
				v.hp -= v.max * NATIVE.pit;
				v.hurtT = G.t;
				v.stuck = G.t + NATIVE.stuck;
				if (v.owner === 0) news('war', `A pit! Your ${UNIT[v.kind].name.toLowerCase()} is hurt and stuck.`, 'warn', TOAST.mid, b);
				else if (b.owner === 0)
					news('war', `Your pit took a ${UNIT[v.kind].name.toLowerCase()} of ${G.P[v.owner].name}.`, 'good', TOAST.mid, b);
			} else if (kind === 'stakes') {
				v.hp -= v.max * (hasTag(v.kind, 'mounted') ? 0.45 : 0.25);
				v.hurtT = G.t;
				v.flashT = G.t;
				if (b.owner === 0)
					news('war', `Your stakes caught a ${UNIT[v.kind].name.toLowerCase()} of ${G.P[v.owner].name}.`, 'good', TOAST.mid, b);
			} else if ((isSoldier(v) && !hasTag(v.kind, 'siege')) || v.kind === 'vil') takePrisoner(b.owner, v);
		});
	}
}
// Outlaw raids: every few minutes the camp nearest the side they regard least sends robbers at one of its people, who come back after a spell
function natRaid() {
	// random and fair (Albert, Build 41): none before minute 10 (Easy: 16); then a random wait of 3 to 8 minutes (Hordes and gangs: half that); the band goes to a side at war with the Natives,
	// the less regarded more likely, never the one raided last when another is open; it grows with that side's age
	const N = natState(),
		from = NATIVE.raidFrom + (G.diff === 'easy' ? EASY_SAFE : 0),
		gap = () => rnd(NATIVE.raidGap[0], NATIVE.raidGap[1]) / (hz('horde') ? 2 : 1);
	if (!N.raidAt) N.raidAt = from + gap() / 2;
	if (G.t < N.raidAt) return;
	N.raidAt = G.t + gap();
	let sides = G.P.filter((p) => p.id !== WILD && !calm4b(p.id) && p.alive && keepOf(p.id) && gangRel(p.id, 'rob') === 'war'); // the raiders are robbers: their stance alone decides (Albert, Nov 1); 4b: never a computer
	if (sides.length > 1) sides = sides.filter((p) => p.id !== N.raidLast);
	if (!sides.length) return;
	const q = sides[roulette(sides.map((p) => 1 + (100 - regardOf(p.id, 'rob')) / 25))];
	N.raidLast = q.id;
	const k = keepOf(q.id),
		camps = G.finds
			.filter((f) => f.kind === 'camp' && !f.done && guardsLeft(f))
			.sort((a, b) => dist(a, k) - dist(b, k));
	if (!camps.length) return;
	const f = camps[0],
		R = G.units.filter((u) => u.find === f.id && u.hp > 0 && UNIT[u.kind].dmg).slice(0, NATIVE.raidN + q.age);
	if (!R.length) return;
	// the mark (N16a, Albert: chance weighted toward a load in transport, an army near puts them off, only what they can beat): of the side's
	// villagers and caravans the band beats with their guard by the square law (the canBeat form), each is drawn with p_i = w_i / Σw,
	// w_i = (1 + β·load_i / CARRY) / (1 + γ·guard_i), guard_i the armed strength within GROUP_R of it over the band's (roulette wheel, seeded dice)
	const band = R.reduce((s, u) => s + unitPower(u), 0),
		T = [],
		W = [];
	for (const v of G.units) {
		if (v.owner !== q.id || v.hp <= 0 || v.inside || (v.kind !== 'vil' && v.kind !== 'caravan')) continue;
		let guard = 0;
		unitsNear(v, GROUP_R, (s) => {
			if (s.owner === v.owner && isSoldier(s) && s.hp > 0 && !s.inside) guard += unitPower(s);
		});
		if (lanchester(band / Math.max(1e-6, unitPower(v) + guard)) <= 0.5) continue;
		const load = (v.carry || 0) + Object.values(v.goods || {}).reduce((a, b) => a + b, 0);
		T.push(v);
		W.push((1 + (NATIVE.raidLoad * load) / CARRY) / (1 + (NATIVE.raidGuard * guard) / band));
	}
	if (!T.length) return;
	const mark = T[roulette(W)];
	for (const u of R) {
		u.camp = { x: u.hx, y: u.hy };
		u.hx = mark.x;
		u.hy = mark.y;
		u.aggro = mark;
		u.horde = true;
		u.back = G.t + NATIVE.raidSecs;
	}
	if (q.id === 0)
		news('war', `Robbers ride for your ${(BLD[mark.kind] ? bldName(0, mark.kind) : UNIT[mark.kind].name).toLowerCase()} (${coord(mark.x, mark.y)}).`, 'warn', TOAST.long, mark);
}
function nativesTick(dt) {
	if (G.tick % 10 === 5) trapsTick();
	if (G.tick % (NATIVE.relay * 30) === 900) layTraps(); // fresh traps for the Natives, every relay
	for (const u of G.units)
		if (u.back && G.t > u.back) {
			u.back = 0;
			u.horde = false;
			if (u.camp) {
				u.hx = u.camp.x;
				u.hy = u.camp.y;
			}
		} // raiders go home
	if (!every(BEAT.natives)) return; // the rest on the slow beat
	const N = natState(),
		T = throneB(),
		held = G.throne && G.throne.owner !== WILD;
	for (const g in GANG) {
		const R = gangState(g);
		for (const p of G.P)
			if (p.id !== WILD && p.alive) {
				R.regard[p.id] += (((REGARD.regard0 - R.regard[p.id]) * REGARD.decay) / 100) * BEAT.natives[0];
				gangSync(p.id, g);
			}
	}
	for (const c in G.struck || {}) {
		for (const id in G.struck[c]) if (G.t - G.struck[c][id] >= NATIVE.struck) delete G.struck[c][id];
		if (!Object.keys(G.struck[c]).length) delete G.struck[c];
	} // 4b: a camp forgets who struck it after a minute
	if (
		T &&
		!held &&
		G.units.filter((u) => u.native && u.hp > 0).length < garrisonMax() &&
		G.t - (N.grewT || 0) > NATIVE.regrow * (gunAge() ? NATIVE.gunRegrow : 1)
	) {
		N.grewT = G.t;
		natSpawn(T, rng() < 0.4 ? 'nativebow' : 'native');
	}
	natRaid();
	prisonersTick();
	// the sworn handover: an ally with soldiers inside for a minute
	if (T && !held)
		for (const p of G.P)
			if (p.id !== WILD && p.alive && G.rel[p.id][WILD] === 'ally') {
				const n = G.units.filter((u) => u.owner === p.id && isSoldier(u) && dist(u, T) < THRONE.r).length;
				if (n >= NATIVE.handoverMen) {
					N.handT[p.id] = (N.handT[p.id] || 0) + BEAT.natives[0];
					if (p.id === 0 && N.handT[0] === BEAT.natives[0])
						news('realm', `Hold ${NATIVE.handoverMen} inside ${NATIVE.handover} s: they swear to you.`, 'good', TOAST.mid);
					if (N.handT[p.id] >= NATIVE.handover) takeThrone(p.id, true);
				} else N.handT[p.id] = 0;
			}
	// the holder's score and the clock
	if (held && G.P[G.throne.owner].alive)
		G.P[G.throne.owner].gathered += (THRONE.score * SCORE.wealth * BEAT.natives[0]) / 60; // THRONE.score a minute, as wealth, a beat's share
}
// ═════ 39-games.js: peace as a path (Build 57) ═════
// Albert, Oct 29: "Why is it just war?" and "I build to match life. They decide." One module for everything that rewards a board at peace:
// the board truce, the price of a truce, standing down, the Games on the Throne island, the hidden age that only a full truce opens,
// the three crowns and the chronicle that ends a match. Every number sits in PEACE; every date is in WHY.
const PEACE = {
	truce: { gold: 120, odds: 2 }, // tribute buys peace from a side that wants more war: gold × (1 + odds × their odds), rounded to 10 (Danegeld, 991)
	stand: { after: 90, keep: 0.5 }, // after 90 s of board truce a computer sends the soldiers above half its army cap home to the fields
	games: {
		every: 2 * YEAR, // the Olympiad: every second year (776 BC on, every four; the game's year is 12 minutes); held at the first board peace after it falls due
		events: [
			// each event asks one number of a side, the best it has in the field; the winner is rolled on the square of it (the square law, as battle)
			{ id: 'stadion', name: 'the footrace', of: (o) => bestOf(o, (s) => s.spd) },
			{ id: 'pale', name: 'the wrestling', of: (o) => bestOf(o, (s) => (s.rng <= 20 ? s.dmg * s.hp : 0)) },
			{ id: 'akon', name: 'the javelin', of: (o) => bestOf(o, (s) => (s.rng > 20 ? s.dmg * s.rng : 0)) },
			{ id: 'tethrippon', name: 'the chariot race', of: (o) => bestOf(o, (s) => (s.mounted ? s.spd * s.hp : 0)) },
		],
	},
	age: { truce: YEAR }, // the hidden age opens for every side once the whole board has kept the peace for one year
	crown: { bld: 8, laurel: 5, people: 1 }, // the Wellbeing crown: people × (1 − sick share), plus each place of care or recreation, plus each laurel
	chron: 80, // lines kept in the chronicle
};
const CARE = ['hospital', 'temple', 'baths', 'theatre', 'tavern']; // what counts as care for the Wellbeing crown
// the best a side has of some measure, over the soldier kinds it has alive (a side with no soldiers sends its villagers: 1)
function bestOf(o, f) {
	let best = 0;
	const seen = new Set();
	for (const u of G.units) {
		if (u.owner !== o || u.hp <= 0 || !isSoldier(u) || seen.has(u.kind)) continue;
		seen.add(u.kind);
		const s = stats(o, u.kind);
		best = Math.max(best, f({ ...s, mounted: (UNIT[u.kind].tags || []).includes('mounted') }) || 0);
	}
	return best || 1;
}
const livingSides = () => G.P.filter((p) => p.alive && p.id !== WILD);
// a board truce: no two living courts at war, and no notice running
function truceAll() {
	const L = livingSides();
	for (const a of L)
		for (const b of L)
			if (a.id < b.id && (atWar(a.id, b.id) || noticeLeft(a.id, b.id) || noticeLeft(b.id, a.id))) return false;
	return true;
}
const truceFor = () => (G.truce === null ? 0 : G.t - G.truce); // seconds the whole board has been at peace
const ageOpen = (n) => !AGES[n] || !AGES[n].hidden || G.enlight; // the hidden age, once opened, stays open for every side
const nextAge = (o) => (ageOpen(G.P[o].age + 1) ? AGES[G.P[o].age + 1] || null : null);
function chron(text) {
	(G.chron || (G.chron = [])).push({ t: Math.round(G.t), text });
	if (G.chron.length > PEACE.chron) G.chron.shift();
}
// once a second from the simulation: the truce clock, the hidden age, standing down, the Games
function peaceTick() {
	const was = G.truce;
	if (truceAll()) {
		if (G.truce === null) {
			G.truce = G.t;
			if (G.t > 30) {
				news('realm', 'The whole board is at peace.', 'soft', TOAST.mid);
				chron('The whole board at peace.');
			}
		}
	} else if (G.truce !== null) {
		G.truce = null;
		G.stood = false;
	}
	if (!G.enlight && truceFor() >= PEACE.age.truce) {
		G.enlight = true;
		news('realm', `A year of peace: the ${AGES[5].name} opens.`, 'good', TOAST.long);
		chron(`A year of peace opened the ${AGES[5].name}.`);
	}
	if (G.truce !== null && !G.stood && truceFor() >= PEACE.stand.after) {
		G.stood = true;
		for (const p of livingSides()) if (p.id !== 0) standDown(p.id, true);
	}
	if (G.truce !== null && G.t - (G.gamesT ?? 0) >= PEACE.games.every) {
		G.gamesT = G.t;
		holdGames();
	}
	if (was === null && G.truce !== null) fxDirty();
}
// soldiers above the keep share go home and take up the villager's tools; the room they held is freed (demobilisation, as every peace since Rome)
function standDown(o, quiet) {
	const p = G.P[o],
		k = keepOf(o),
		S = soldiersOf(o).filter((u) => u.state === 'home' && !u.inside),
		keep = o === 0 ? Math.ceil(soldiersOf(0).length * PEACE.stand.keep) : armyAim(p), // yours: half of what you have (Build 63: it was half the ceiling, 60, so nothing stood down); a computer's: the army it keeps at peace (N8)
		go = S.slice(keep);
	if (!k || !go.length) return 0;
	let n = 0;
	for (const u of go) {
		if (clsCount(o, 'civ') >= clsMax('civ', o)) break; // one for one, so housing never stops it; the worker limit does (Build 60: it checked the houses and not the limit)
		u.hp = 0;
		u.gone = true;
		addUnit(o, 'vil', u.x, u.y).job = o === 0 ? p.rally : null; // to your gathering job, as a new villager goes; a computer's think gives its own
		n++;
	}
	if (n) {
		if (o === 0) news('chronicle', `${n} soldiers stood down to work.`, 'good', TOAST.mid);
		else if (!quiet) news('chronicle', `${p.name} stood down ${n} soldiers.`, '', TOAST.mid);
		chron(`${o === 0 ? 'You' : p.name} stood down ${n} soldiers.`);
	}
	return n;
}
// the Games: held on the Throne island under the truce of the whole board, as the ekecheiria held Olympia; they wait for it (hunt A #1)
function holdGames() {
	const L = livingSides();
	if (L.length < 2) return;
	const won = [];
	for (const ev of PEACE.games.events) {
		const p = L[roulette(L.map((p) => ev.of(p.id) ** 2))];
		p.laurels = (p.laurels || 0) + 1;
		won.push(`${p.id === 0 ? 'you' : p.name} ${ev.name}`);
	}
	const mine = won.filter((w) => w.startsWith('you')).length;
	chron(`The Games at the Throne: ${won.join(', ')}.`);
	news('realm', 
		`The Games: ${mine ? mine + (mine === 1 ? ' laurel' : ' laurels') + ' for you' : 'no laurel for you'}.`,
		mine ? 'good' : 'soft',
		TOAST.long,
		{ x: MID, y: MID },
	);
	celebrate(3, MID, MID);
	if (mine) sfx('age');
}
// the three crowns and the overall (N6, best practice of the genre's flow scores: 0 A.D.'s economy and military scores, StarCraft II's
// resources killed). Wealth is all a side ever gathered, counted once (the stores were added on top); War is the cost value of the enemy
// people and buildings it destroyed, animals not counted (warCredit, 16-sim-fight); Wellbeing is its people in health (the share not sick),
// its places of care and its laurels
function crownsOf() {
	const L = G.P.filter((p) => p.id !== WILD),
		val = {
			wealth: (p) => Math.round(p.gathered),
			war: (p) => Math.round(p.war || 0),
			wellbeing: (p) => {
				if (!p.alive) return Math.round((p.laurels || 0) * PEACE.crown.laurel);
				const ppl = G.units.filter((u) => u.owner === p.id && UNIT[u.kind].cls === 'civ'),
					well = ppl.filter((u) => !(u.sick > G.t)).length; // people × (1 − sick share)
				return Math.round(
					well * PEACE.crown.people +
						G.blds.filter((b) => standing(b, p.id) && CARE.includes(b.kind)).length * PEACE.crown.bld +
						(p.laurels || 0) * PEACE.crown.laurel,
				);
			},
		},
		pts = Object.fromEntries(L.map((p) => [p.id, 0])),
		out = {};
	for (const c in val) {
		const R = L.map((p) => ({ id: p.id, v: val[c](p) })).sort((a, b) => b.v - a.v);
		R.forEach((r, i) => (pts[r.id] += r.v > 0 ? L.length - 1 - i : 0));
		out[c] = R;
	}
	scoreAll();
	out.overall = L.map((p) => ({ id: p.id, v: pts[p.id], tie: p.score.total })).sort(
		(a, b) => b.v - a.v || b.tie - a.tie,
	);
	return out;
}
const CROWN_NAME = { wealth: 'Wealth', war: 'War', wellbeing: 'Wellbeing' };
function crownsHTML() {
	const C = crownsOf(),
		nm = (id) => (id === 0 ? 'You' : G.P[id].name),
		unit = { wealth: '', war: '', wellbeing: '' };
	let h = '<div class="crowns">';
	for (const c of ['wealth', 'war', 'wellbeing']) {
		const r = C[c][0];
		h += `<p><b>${CROWN_NAME[c]}</b> ${r.v > 0 ? `${nm(r.id)} · ${fmt(r.v)}${unit[c]}` : 'no one'}</p>`;
	}
	h += `<p><b>Overall</b> ${nm(C.overall[0].id)}</p></div>`;
	// the chronicle, newest first, paged as the Mail: six lines a page, each one text line, a short page padded; no fold, so the card never
	// grows (hunt B #1, Albert's sighting: the fold pushed the buttons under the floating ones and off the screen)
	const L = (G.chron || []).slice().reverse(),
		[pg, rows, nav] = pager(
			L.map((c) => `<p class="chl"><small>${clock(c.t)}</small>${c.text}</p>`),
			G.chronP,
			'chronp',
			'<p class="chl"></p>',
			`${L.length} ${some(L.length, 'line')}`,
		);
	G.chronP = pg;
	return h + rows + nav;
}
// the last step of the hidden age ends the match for everyone: the crowns are pointed to, and play can carry on
function enlightenTick(o) {
	if (!AGES[5] || G.P[o].age < 5 || G.over || G.free) return;
	const last = TECH.filter((t) => t.age === 5 && !t.civ);
	if (!last.every((t) => G.P[o].techs.has(t.id))) return;
	chron(`${o === 0 ? 'You' : G.P[o].name} finished the ${AGES[5].name}.`);
	finish(
		true,
		`${o === 0 ? 'You' : G.P[o].name} finished the ${AGES[5].name}. Everyone wins; the crowns say who won what.`,
		true,
	);
}
// a personality chases its crown: the war chaser breaks truces, the wealth chaser trades, the wellbeing chaser builds care; under a board truce only the war chaser declares
function chaseCrown(p, put) {
	const per = PERS[p.pers],
		o = p.id,
		has = (kind) => bldsOf(o, kind).length;
	if (per.crown === 'wellbeing')
		for (const kind of CARE) if (p.age >= BLD[kind].age && !has(kind) && afford(p, BLD[kind].cost) && put(kind)) break;
	if (G.enlight && p.age === 4 && !p.aging) ageUp(o); // every court takes the hidden age when it opens
	if (p.age === 5) {
		// and runs its six steps: the match is a race to the last of them
		if (!has('library')) put('library');
		else for (const t of TECH) if (t.age === 5 && !t.civ && isNext(o, t) && research(o, t.id)) break;
	}
}
