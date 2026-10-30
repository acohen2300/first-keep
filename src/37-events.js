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
const levelMul = () => 1 + levelOf(G.hz) / 10; // the score's multiplier for the level played
const evOn = (kind) => !!(G.ev.cur && G.ev.cur.kind === kind);
const edgeSpot = () => {
	const e = Math.floor(rng() * 4),
		t = rnd(300, MAP - 300);
	return e === 0
		? { x: t, y: 40 }
		: e === 1
			? { x: MAP - 40, y: t }
			: e === 2
				? { x: t, y: MAP - 40 }
				: { x: 40, y: t };
};
const across = (a) => ({ x: MAP - a.x, y: MAP - a.y }); // the far side of the map from a spot
const wildSpot = () => {
	for (let i = 0; i < 40; i++) {
		const s = { x: rnd(200, MAP - 200), y: rnd(200, MAP - 200) };
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
			if (lessMotion || !Number.isFinite(e.x)) return; // no place yet in the first second
			// a dark band of cloud walking east, rain under it
			const x = SX(e.x),
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
			e.a = { x: -EVENTS.storm.band, y: MID };
			e.b = { x: MAP + EVENTS.storm.band, y: MID };
			sfx('wind');
		},
		tick(e) {
			const c = crossing(e);
			e.x = c.x;
			if (e.s % 2 === 0) {
				const x = clamp(e.x + rnd(-EVENTS.storm.band, EVENTS.storm.band), 40, MAP - 40),
					y = rnd(80, MAP - 80),
					W = G.blds.filter(
						(b) => BLD[b.kind].wood && b.prog >= 1 && Math.abs(b.x - e.x) < EVENTS.storm.band && rng() < 0.3,
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
						say(`Water at the ${bldName(0, b.kind).toLowerCase()} (${coord(b.x, b.y)}).`, 'warn', 5, b);
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
				x1 = SX(e.at.x),
				y1 = SY(e.at.y),
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
			say(EV_TEXT.meteor[1], 'good', 7, e.at);
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
					if (m.kind === 'tree' && m.amt > 0 && !e.burn.includes(m) && !next.includes(m) && rng() < E.spread * fireMul())
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
			if (!lessMotion) {
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
				say(`A sinkhole under the ${bldName(0, b.kind).toLowerCase()} (${coord(b.x, b.y)}).`, 'warn', 6, b);
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
			say(`An army seen at ${coord(e.at.x, e.at.y)}.`, 'warn', 5, e.at);
		},
		end() {
			G.mirage = null;
			say('The army at that spot was a mirage.', '', 5);
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
			e.f = addFind('mercs', clamp(a.x, 120, MAP - 120), clamp(a.y, 120, MAP - 120));
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
		say(EV_TEXT[kind][1], E.harm ? 'warn' : E.gift ? 'good' : 'soft', 6, e.at || (e.units && e.units[0]) || null, null, EV_WHY[kind]); // only what can hurt you takes the line
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
		say(EV_TEXT[V.warned][0], 'soft', EV_WARN);
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
		say(EV_TEXT.horde[0], 'warn', 8);
	}
	if (H.said < 2 && left <= HORDE.warn / 2) {
		H.said = 2;
		say(EV_TEXT.horde[1], 'warn', 8);
	}
	if (left > 0) return;
	const sides = G.P.filter((p) => p.id !== WILD && p.alive && keepOf(p.id)),
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
	say(EV_TEXT.horde[2], 'warn', 10, from);
	sfx('horn');
	G.horde = 'done';
}
// ── The climate (Build 54): one tick a second. The air's temperature from the year and the hour; the sky's run as a chain, a new minute
// at a time; wetness closing on where the sky puts it; mud, snow and ice from those. `G.wx` stays the sky's name, which the rest reads.
const blankClim = () => ({ T: CLIMATE.mean, W: CLIMATE.eq.clear, snow: 0, ice: 0, mud: 0, wet: false, dry: 0 });
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
	if (wet) return `rain begins ${pct(P[0])} of dry minutes${wx === 'snow' ? '; below freezing it falls as snow' : wx === 'blizzard' ? '; a winter storm' : ''}`;
	if (wx === 'frost') return `clear and the air at ${Math.round(c.T)} °C: frost`;
	if (wx === 'drought') return `${c.dry} dry minutes in heat of ${Math.round(c.T)} °C`;
	return wasWet ? `the rain stopped: ${pct(1 - P[1])} each wet minute` : 'a dry minute: the chain stays dry';
}
const precip = (wx) => wx === 'rain' || wx === 'snow' || wx === 'blizzard';
function skyTurn() {
	// the next minute's sky from this one: the chain, then what falls from the air's temperature
	const c = G.clim,
		s = season().name,
		P = hz('drought') && s === 'Summer' ? CLIMATE.hazard.drought : hz('winter') && s === 'Winter' ? CLIMATE.hazard.winter : CLIMATE.chain[s],
		was = G.wx;
	c.wet = c.next ?? rng() < P[c.wet ? 1 : 0]; // the minute's sky was rolled a minute ahead, so weather signs can tell it
	c.next = rng() < P[c.wet ? 1 : 0];
	if (fxv(0, 'forecast').a && c.next !== c.wet) say(c.next ? 'Signs of rain within the minute.' : 'Signs of a clearing sky.', 'soft', 6);
	c.dry = c.wet ? 0 : c.dry + 1;
	G.wx = c.wet
		? c.T <= 0
			? hz('winter') && rng() < CLIMATE.blizzard
				? 'blizzard'
				: 'snow'
			: 'rain'
		: c.T < 0
			? 'frost'
			: c.dry >= CLIMATE.drought.dry && c.T > CLIMATE.drought.temp
				? 'drought'
				: 'clear';
	if (G.wx !== was && WEATHER[G.wx].text) say(WEATHER[G.wx].text, '', 6, null, null, wxWhy(G.wx, was, P, c));
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
	const eq = CLIMATE.eq[G.wx] ?? CLIMATE.eq.clear,
		tau = eq > c.W ? CLIMATE.tau.wet : CLIMATE.tau.dry;
	c.W = relax(c.W, eq, tau, dt); // M(t) = Me + (M0 − Me) e^(−t/τ), the timelag fuel-moisture model
	c.snow = clamp(c.snow + (precip(G.wx) && c.T <= 0 ? CLIMATE.snow.fall * (G.wx === 'blizzard' ? 2 : 1) : -CLIMATE.snow.melt * Math.max(0, c.T)) * dt, 0, 1);
	c.ice = clamp(c.ice + (c.T < 0 ? (c.W > CLIMATE.mud[0] * 0.5 ? CLIMATE.ice.freeze : 0) : -CLIMATE.ice.thaw * c.T) * dt, 0, 1);
	c.mud = c.T < 0 ? 0 : clamp((c.W - CLIMATE.mud[0]) / (CLIMATE.mud[1] - CLIMATE.mud[0]), 0, 1); // frozen ground is hard ground
}
// what the ground takes off a march for one side, at a place if given (mud pools by water): Pandolf's terrain factor over dirt, as 1 / η
const groundSpd = (o, keys, at) => {
	const c = G.clim,
		mud = c.mud * (at && NAV.shore[gcell(at.x, at.y)] ? CLIMATE.shore : 1);
	return 1 / (1 + CLIMATE.terrain.mud * Math.min(1, mud) * fxv(o, 'mud', keys).m + CLIMATE.terrain.snow * c.snow * (1 - fxv(o, 'snow', keys).a));
};
// fire against the ground's wetness: Rothermel's damping η = 1 − 2.59r + 5.11r² − 3.52r³, r = M/Mx ≤ 1, as a share of a clear day's
const rothermel = (r) => 1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r;
const fireMul = () => clamp(rothermel(Math.min(1, G.clim.W)) / rothermel(CLIMATE.eq.clear), 0, 2);
const wearMul = (o) =>
	G.wx === 'frost' || precip(G.wx) ? 1 - CLIMATE.wear * (1 - Math.min(1, fxv(o, 'wear').a)) : 1; // brittle in frost, rusted in rain
function newsTick() {
	if (G.t - (G.ev.newsT || 0) < NEWS_EVERY || G.t < 60) return;
	G.ev.newsT = G.t;
	const L = NEWS[Math.min(G.P[0].age, NEWS.length - 1)],
		i = (G.ev.newsI = (G.ev.newsI || 0) + 1) % L.length;
	say(L[i], 'news', 8);
}
// a herd crosses: bison trample what they run over; performers only pass; a dragon flies (it is drawn above everything and walks through walls)
function herdTick(u, dt, SP) {
	const U = UNIT[u.kind];
	if (U.look === 'dragon') {
		const d = hyp(u.px - u.x, u.py - u.y) || 1;
		u.x += ((u.px - u.x) / d) * U.spd * dt;
		u.y += ((u.py - u.y) / d) * U.spd * dt;
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
				v.x += (v.x - u.x) * 0.6;
				v.y += (v.y - u.y) * 0.6;
			}
		});
		const n = G.nodes.find((m) => m.kind === 'farm' && m.farm && m.type === 'food' && dist(m, u) < 20);
		if (n && n.farm.fert > FERT.floor) n.farm.fert = Math.max(FERT.floor, n.farm.fert - 0.02);
	}
}
// starvation (the hazard): work stops after a minute without food; after two, people leave
function starveTick(p) {
	if (!hz('starve') || !p.hungry) {
		p.hungryT = 0;
		return;
	}
	p.hungryT = (p.hungryT || 0) + 1;
	const o = p.id;
	if (p.hungryT === STARVE.stop && o === 0) say('Starving: work has stopped. Food, now.', 'warn', 8);
	if (p.hungryT >= STARVE.leave && (p.hungryT - STARVE.leave) % STARVE.every === 0) {
		const v = unitsOf(o, 'vil').sort((a, b) => a.carry - b.carry)[0],
			s = soldiersOf(o).filter((u) => u.state === 'home')[0];
		for (const u of [v, s])
			if (u) {
				u.hp = 0;
				u.gone = true;
			}
		if (o === 0 && (v || s))
			say(`Starving: ${v ? 'a villager left' : ''}${v && s ? ', ' : ''}${s ? 'a soldier deserted' : ''}.`, 'warn', 6);
	}
}
const starving = (o) => hz('starve') && (G.P[o].hungryT || 0) >= STARVE.stop; // nobody works
