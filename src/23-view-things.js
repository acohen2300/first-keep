// ═════ 23-view-things.js: buildings, smoke and fire, ripples and sparks, nodes, units, finds ═════
function drawBld(b, s) {
	if (BLD[b.kind].trap) {
		const z = cam.z,
			x = SX(b.x),
			y = SY(b.y),
			k = BLD[b.kind].trap,
			own = b.owner === 0 || friendly(0, b.owner);
		if (b.prog < 1) {
			ctx.strokeStyle = 'rgba(255,211,94,.7)';
			ctx.setLineDash([3, 3]);
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.ellipse(x, y, 6 * z, 3.6 * z, 0, 0, 7);
			ctx.stroke();
			ctx.setLineDash([]);
			return;
		}
		if (k === 'pit') {
			ctx.fillStyle = own ? 'rgba(60,50,30,.5)' : 'rgba(180,40,30,.55)';
			ctx.beginPath();
			ctx.ellipse(x, y, 6 * z, 3.6 * z, 0, 0, 7);
			ctx.fill();
		} else if (k === 'net') {
			ctx.strokeStyle = own ? 'rgba(120,100,60,.8)' : 'rgba(200,60,40,.8)';
			ctx.lineWidth = 1;
			for (let i = -6; i <= 6; i += 3) {
				ctx.beginPath();
				ctx.moveTo(x + i * z, y - 4 * z);
				ctx.lineTo(x + i * z, y + 4 * z);
				ctx.moveTo(x - 6 * z, y + i * z * 0.6);
				ctx.lineTo(x + 6 * z, y + i * z * 0.6);
				ctx.stroke();
			}
		} else {
			ctx.strokeStyle = own ? 'rgba(120,90,40,.9)' : 'rgba(200,60,40,.9)';
			ctx.lineWidth = 1.2;
			for (let i = -5; i <= 5; i += 2.5) {
				ctx.beginPath();
				ctx.moveTo(x + i * z, y + 2 * z);
				ctx.lineTo(x + i * z + 1.5 * z, y - 5 * z);
				ctx.stroke();
			}
		}
		return;
	}
	const z = cam.z,
		sx = SX(b.x),
		sy = SY(b.y),
		B = BLD[b.kind],
		c = bldSprite(b, s),
		k = z / s;
	if (b.prog < 1) {
		// a building site: the outline staked out, the walls rising with the work
		const w = B.fp * NAVC * z,
			d = w * TILT;
		ctx.strokeStyle = '#d8c79c';
		ctx.lineWidth = 1.5;
		ctx.setLineDash([3, 3]);
		ctx.strokeRect(sx - w / 2, sy - d / 2, w, d);
		ctx.setLineDash([]);
		const top = c.ay * k,
			show = 0.15 + 0.85 * b.prog;
		ctx.save();
		ctx.beginPath();
		ctx.rect(sx - c.ax * k, sy + d / 2 - (top + d / 2) * show - 2, c.width * k, (top + d / 2) * show + c.height * k);
		ctx.clip();
		ctx.globalAlpha = 0.85;
		stamp(c, sx, sy, k);
		ctx.restore();
		ctx.globalAlpha = 1;
		ctx.strokeStyle = '#b8955a';
		ctx.lineWidth = Math.max(1, z * 0.8);
		for (const fx of [-0.45, 0.45]) {
			ctx.beginPath();
			ctx.moveTo(sx + w * fx, sy + d / 2);
			ctx.lineTo(sx + w * fx, sy + d / 2 - (top + d / 2) * show);
			ctx.stroke();
		}
		bar(sx, sy - c.ay * k - 4, Math.min(60 * z, w), b.prog, '#e6b947');
		if (b.owner === 0 && !G.units.some((u) => u.rep === b && u.job === 'repair'))
			idleMark(sx, sy - c.ay * k - 8, z * 1.2);
		return;
	}
	const fa = G.t - (b.doneT ?? -99);
	stamp(c, sx, sy, k * popC(fa / 0.6));
	flagsOn(c, sx, sy, z, G.P[b.owner].color, b.id);
	if (PILE[b.kind] && friendly(0, b.owner)) pileAt(b, sx, sy, z);
	if (fa < 8 && !still()) {
		ctx.globalCompositeOperation = 'lighter';
		ctx.globalAlpha = 0.32 * (1 - fa / 8);
		stamp(c, sx, sy, k);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'source-over';
	} // fresh buildings glow, then cool
	if (b.node && b.node.farm === b && b.owner === 0) {
		// who works a field: a dot a place, filled when someone is there
		const n = b.node,
			slots = slotsOf(n),
			w = B.fp * NAVC * z,
			y = sy + (w * TILT) / 2 + 6 * z,
			r = Math.max(3, 3.4 * z),
			gap = r * 2.8;
		ctx.lineWidth = 1.2;
		for (let i = 0; i < slots; i++) {
			const x = sx + (i - (slots - 1) / 2) * gap;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 7);
			ctx.fillStyle = i < (n.wk || 0) ? '#f2e3b0' : 'rgba(18,23,21,.55)';
			ctx.fill();
			ctx.strokeStyle = 'rgba(18,23,21,.9)';
			ctx.stroke();
		}
	}
	if (b.owner === 0 && G.rdy && G.rdy.get(b.kind) && !b.q.some((j) => j.tech || j.age))
		researchBadge(
			sx - B.fp * NAVC * z * 0.3,
			sy - (B.h * 1.2 + 6) * z - 10 * Math.max(0.9, z * 0.6),
			Math.max(0.9, z * 0.6),
			G.rdy.get(b.kind),
		); // a parchment tab with a book and how many researches wait here
	if (b.kind === 'mill' && !still()) {
		ctx.strokeStyle = '#efe6cf';
		ctx.lineWidth = 1.6 * z;
		const cx = sx,
			cy = sy - 26 * z,
			a = G.t;
		ctx.beginPath();
		for (let i = 0; i < 4; i++) {
			ctx.moveTo(cx, cy);
			ctx.lineTo(cx + Math.cos(a + i * 1.571) * 13 * z, cy + Math.sin(a + i * 1.571) * 13 * z);
		}
		ctx.stroke();
	}
	if (CHIMNEY[b.kind] && (b.kind === 'house' || b.q.length || (b.node && G.t - (b.node.workT ?? -99) < 3))) {
		const [dx, h] = CHIMNEY[b.kind];
		smoke(sx + dx * z, sy - h * z, b.id, z);
	} // a hearth always; a forge, a foundry or a Town Center only while it works (Build 52: smoke shows who is busy)
	blaze(b, sx, sy, z);
	if (b.owner === 0 && B.crop && b.node && !(b.node.wk > 0)) idleMark(sx, sy, z * 1.2);
	const M = maxHpB(b.owner, b.kind);
	if (b.hp < M - 1) bar(sx, sy - c.ay * k - 4, Math.min(60 * z, B.fp * NAVC * z), b.hp / M, G.P[b.owner].color);
	if (G.wonder && G.wonder.id === b.id) {
		ctx.font = '700 ' + Math.max(12, 12 * z) + 'px ' + fontF();
		ctx.fillStyle = '#ffd35e';
		ctx.textAlign = 'center';
		ctx.fillText(clock(Math.max(0, G.wonder.end - G.t)), sx, sy - c.ay * k - 10);
		ctx.textAlign = 'left';
	}
}
const CHIMNEY = { house: [6.2, 26], smith: [9, 28], keep: [-20, 44], foundry: [9, 34] };
// ── Fire (Build 55): one element for every flame in the game. A row names a source: its power (how far its light reaches follows the
// inverse-square law: the glow fades to nothing at LIGHT.k × √power), its flame temperature (its colour: a black body, Tanner Helland's fit,
// the same function SoRen colours its stars with), its flame's size on the glass, and whether it is covered (a lantern keeps its light in
// rain; a torch and a campfire dim). Everything that burns, from a candle to a building ablaze, is drawn by flame() and lit by glow().
const FLAME = {
	candle: { p: 1, K: 1850, s: 0, covered: true },
	lantern: { p: 4, K: 2000, s: 1.4, covered: true },
	torch: { p: 9, K: 1900, s: 2.4 },
	hearth: { p: 16, K: 1900, s: 0, covered: true },
	campfire: { p: 36, K: 1900, s: 4 },
	blaze: { p: 100, K: 2200, s: 7 },
};
const LIGHT = { k: 12, wet: 0.4, a: 0.22 }; // reach in world units per √power; what rain leaves of an open flame; the glow's strength
// ── Shadows (Build 55, Albert: shadows match the light). A thing of height h casts a shadow away from the light, h·cot(altitude) long for
// the sun or the moon (capped at CAST.max heights: near the horizon it would run to the edge of the world), and h·d/(H − h) long from a flame
// at height H and distance d, which for the low fires here means long and fading with distance. The sky's shadow is the sun's by day and the
// moon's by night, as strong as the light is; a cloudy sky softens it. Worked out once a frame (SHADE), read by every unit and building.
const CAST = { sun: 0.3, moon: 0.07, max: 3, cloud: { rain: 0.25, snow: 0.3, blizzard: 0.1, drought: 1.1 } };
const SHADE = { x: 0, y: 0, len: 0, a: 0 }; // the shadow's direction on the glass (unit), its length per unit of height (world units), its darkness
function shadeFrame() {
	const s = sunVec(),
		m = moonVec(),
		nt = G.night,
		sunA = s.z > 0.02 ? CAST.sun * Math.min(1, s.z * 4) * (1 - nt) : 0,
		moonA = m.z > 0.02 ? CAST.moon * moonLight() * nt : 0,
		v = sunA >= moonA ? s : m,
		a = Math.max(sunA, moonA) * (CAST.cloud[G.wx] ?? 1) * (G.ev.cur && G.ev.cur.kind === 'storm' ? 0.1 : 1);
	if (a < 0.02 || v.z <= 0.02) {
		SHADE.a = 0;
		return;
	}
	const horiz = Math.hypot(v.e, v.n) || 1e-6;
	SHADE.x = -v.e / horiz; // away from the light: east is right on the glass, north is up
	SHADE.y = (v.n / horiz) * TILT;
	SHADE.len = Math.min(CAST.max, horiz / v.z); // cot(altitude), capped
	SHADE.a = a;
}
// the shadows of the trees, bushes and rocks you can see, cast from the sun like everything else (Build 61, Albert: only the trees you can see,
// not the deep woods). A tree with six or more standing neighbours on the forest lattice is deep: its shadow would lie under the canopy, so
// none is drawn; the fog's dark hides the rest. All of them go into one path, filled once.
let DEEP = { v: -1, G: null, set: null };
function deepTrees() {
	if (DEEP.G === G && DEEP.v === G.treeV) return DEEP.set;
	const cell = new Map(),
		k = (x, y) => `${Math.round(x / FOREST.step)},${Math.round(y / FOREST.step)}`;
	for (const n of G.nodes) if (n.kind === 'tree' && n.amt > 0) cell.set(k(n.x, n.y), (cell.get(k(n.x, n.y)) || 0) + 1);
	const deep = new Set();
	for (const n of G.nodes)
		if (n.kind === 'tree' && n.amt > 0) {
			const cx = Math.round(n.x / FOREST.step),
				cy = Math.round(n.y / FOREST.step);
			let m = 0;
			for (let dy = -1; dy <= 1; dy++)
				for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && cell.get(`${cx + dx},${cy + dy}`)) m++;
			if (m >= 6) deep.add(n.id);
		}
	DEEP = { v: G.treeV, G, set: deep };
	return deep;
}
// Every sun shadow on the ground is one path and one fill (Build 62: trees, buildings and people together; measured, the per-thing fills were
// the dearest pass of the frame, 28% at a normal zoom and 53% close in, headless). One path also means two shadows that overlap darken once, as real ones do.
// The shadow of a thing h tall with a footprint r wide at (sx, sy): an ellipse laid along the shadow, from the foot outward; a soft pool under it with no light.
function shadowPath(sx, sy, h, r, z) {
	ctx.moveTo(sx + r, sy);
	if (SHADE.a < 0.02) return ctx.ellipse(sx, sy, r, r * TILT, 0, 0, 7);
	const L = h * SHADE.len * z;
	ctx.ellipse(
		sx + SHADE.x * L * 0.5,
		sy + SHADE.y * L * 0.5,
		L * 0.5 + r,
		Math.max(r * 0.55, r * TILT),
		SHADE.ang,
		0,
		7,
	);
}
function sunShadows(N, list, z, far) {
	const lit = SHADE.a >= 0.02,
		deep = far ? null : deepTrees();
	SHADE.ang = lit ? Math.atan2(SHADE.y, SHADE.x) : 0;
	ctx.fillStyle = lit ? `rgba(0,0,0,${SHADE.a.toFixed(3)})` : 'rgba(0,0,0,.18)';
	ctx.beginPath();
	if (!far && DRAW.lvl < 1)
		for (const n of N) {
			const h = NODE_H[n.kind];
			if (!h || n.amt <= 0 || deep.has(n.id) || (G.fogOn && fogAt(n.x, n.y) === 0)) continue;
			const f = (0.6 + 0.4 * Math.min(1, n.amt / n.max)) * (n.kind === 'tree' ? 1.4 : 1);
			shadowPath(SX(n.x), SY(n.y), h * f, (n.kind === 'tree' ? 7 : 5) * f * z, z);
		}
	for (const [, t, e] of list) {
		if (t === 1) {
			const B = BLD[e.kind];
			if (!B.crop) shadowPath(SX(e.x), SY(e.y), B.h, B.fp * NAVC * 0.55 * z, z);
		} else if (t === 2) {
			const U = UNIT[e.kind],
				box = LOOKBOX[U.look] || [26, 30];
			shadowPath(SX(e.x), SY(e.y), box[1] * FIG, box[0] * 0.28 * z * FIG + 2, z);
		}
	}
	ctx.fill();
}
// a flame's shadow of a thing near it: away from the fire, long, fading as the light does (1/d²)
function flameShadow(sx, sy, h, r, z, fx, fy, kind) {
	const F = FLAME[kind],
		reach = LIGHT.k * Math.sqrt(F.p) * z,
		dx = sx - fx,
		dy = (sy - fy) / TILT,
		d = Math.hypot(dx, dy);
	if (d < 1 || d > reach) return;
	const a = LIGHT.a * 1.4 * G.night * (1 - (d / reach) ** 2) * flameLife(kind),
		L = Math.min(CAST.max * h * z, (h * z * d) / Math.max(1, F.s * z * 2)),
		ux = dx / d,
		uy = (dy / d) * TILT,
		ang = Math.atan2(uy, ux);
	if (a < 0.02) return;
	ctx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`;
	ctx.beginPath();
	ctx.ellipse(sx + ux * L * 0.5, sy + uy * L * 0.5, L * 0.5 + r, Math.max(r * 0.55, r * TILT), ang, 0, 7);
	ctx.fill();
}
const kelvinRGB = (K) => {
	// a black body's colour by temperature (Tanner Helland's fit to the CIE locus, 1000 to 40000 K)
	const t = K / 100,
		r = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -0.1332047592,
		g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -0.0755148492,
		b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
	return [r, g, b].map((v) => Math.round(clamp(v, 0, 255)));
};
const FLAME_RGB = Object.fromEntries(Object.keys(FLAME).map((k) => [k, kelvinRGB(FLAME[k].K)]));
const flameLife = (kind) => (FLAME[kind].covered || !precip(G.wx) ? 1 : LIGHT.wet); // what the weather leaves of a flame
// the flame itself: a teardrop that leans with the wind and flickers; its heart whiter than its edge
function flame(x, y, kind, z, seed) {
	const F = FLAME[kind];
	if (!F.s || still()) return;
	const t = performance.now() / 1000,
		s = F.s * z * flameLife(kind),
		fl = 0.85 + 0.15 * Math.sin(t * 11 + seed) * Math.sin(t * 7.3 + seed * 1.7),
		lean = wind * 0.6 * s,
		[r, g, b] = FLAME_RGB[kind];
	ctx.fillStyle = `rgba(${r},${g},${b},.9)`;
	ctx.beginPath();
	ctx.moveTo(x - s * 0.5, y);
	ctx.quadraticCurveTo(x - s * 0.55 + lean * 0.5, y - s * 1.2 * fl, x + lean, y - s * 2.4 * fl);
	ctx.quadraticCurveTo(x + s * 0.55 + lean * 0.5, y - s * 1.2 * fl, x + s * 0.5, y);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'rgba(255,245,210,.85)';
	ctx.beginPath();
	ctx.ellipse(x + lean * 0.3, y - s * 0.6 * fl, s * 0.28, s * 0.7 * fl, 0, 0, 7);
	ctx.fill();
}
// the light a flame throws on the ground: a disc that fades as the inverse square, drawn additively, only when there is dark to light
function glow(x, y, kind, z, more = 1) {
	const F = FLAME[kind],
		dark = Math.max(G.night, 0.3 * (G.wx === 'rain' ? 1 : 0)),
		life = flameLife(kind);
	if (!SET.lights || dark < 0.05 || life <= 0) return;
	const r = LIGHT.k * Math.sqrt(F.p * more) * z * life,
		[cr, cg, cb] = FLAME_RGB[kind],
		gr = ctx.createRadialGradient(x, y, 0, x, y, r);
	gr.addColorStop(0, `rgba(${cr},${cg},${cb},${(LIGHT.a * dark).toFixed(3)})`);
	gr.addColorStop(0.5, `rgba(${cr},${cg},${cb},${(LIGHT.a * dark * 0.25).toFixed(3)})`); // a quarter at half the reach: 1/r²
	gr.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
	ctx.globalCompositeOperation = 'lighter';
	ctx.fillStyle = gr;
	ctx.beginPath();
	ctx.ellipse(x, y, r, r * TILT, 0, 0, 7);
	ctx.fill();
	ctx.globalCompositeOperation = 'source-over';
}
// a building's flags fly with the wind: a cloth from the pole top, its tip lifting and falling, longer in a strong wind (Build 52; they were painted on)
function flagsOn(c, sx, sy, z, col, seed) {
	if (!c.flags || !c.flags.length) return;
	const t = still() ? 0 : performance.now() / 1000,
		wv = 0.85 + Math.min(0.6, Math.abs(wind) * 0.9);
	ctx.fillStyle = col;
	ctx.strokeStyle = 'rgba(16,12,8,.75)';
	ctx.lineWidth = Math.max(0.6, 0.3 * z);
	for (const [x, y, sc] of c.flags) {
		const q = z * sc,
			fx = sx + x * z,
			fy = sy + y * z,
			a = Math.sin(t * 5 + seed * 0.7 + x) * q,
			w = 6 * wv * q;
		ctx.beginPath();
		ctx.moveTo(fx, fy);
		ctx.quadraticCurveTo(fx + w * 0.5, fy + 0.4 * q + a * 0.8, fx + w, fy + 1.4 * q + a * 1.4);
		ctx.quadraticCurveTo(fx + w * 0.5, fy + 2.6 * q + a * 0.8, fx, fy + 3 * q);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}
// what a side has in store shows as a pile by the camp that takes it in: logs by the lumber camp, cut stone and gold by the mine, sacks by the mill (Build 52)
const PILE = {
	lumber: [['w', 'log', '#8a6644']],
	mining: [
		['s', 'block', '#a29d90'],
		['g', 'block', '#e0b83c'],
	],
	mill: [['f', 'sack', '#cdb27a']],
};
// the piles are drawn once per kind, counts and zoom into PSPR and stamped (Build 62: measured at 29% of a frame at a normal zoom as vector work)
const PSPR = new Map();
function pileAt(b, sx, sy, z) {
	if (b.prog < 1 || z < 0.45) return;
	const w = BLD[b.kind].fp * NAVC * z,
		R = G.P[b.owner].res,
		ns = PILE[b.kind].map(([r]) => clamp(Math.round(Math.log10((R[r] || 0) + 1) * 1.9), 0, 6)), // a pyramid of 3, 2 and 1: full at about 1500
		key = `${b.kind}:${ns.join('')}:${z.toFixed(2)}`;
	let c = PSPR.get(key);
	if (!c) {
		const W = w * 0.62 + 40 * z + 4,
			H = w * TILT * 0.42 + 14 * z + 4;
		c = document.createElement('canvas');
		c.width = Math.ceil(W * dpr);
		c.height = Math.ceil(H * dpr);
		const was = ctx;
		ctx = c.getContext('2d');
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		pileArt(b.kind, ns, 0, 0, w, z);
		ctx = was;
		PSPR.set(key, c);
		trim(PSPR, 60);
	}
	ctx.drawImage(c, sx, sy, c.width / dpr, c.height / dpr);
}
function pileArt(kind, ns, sx, sy, w, z) {
	PILE[kind].forEach(([r, shape, col], pi) => {
		const n = ns[pi];
		let x0 = sx + w * 0.62 + pi * 10 * z,
			y0 = sy + w * TILT * 0.42 - pi * 2 * z,
			i = 0;
		for (let row = 0; row < 3 && i < n; row++)
			for (let j = 0; j < 3 - row && i < n; j++, i++) {
				const x = x0 + (j + row * 0.5) * 4.4 * z,
					y = y0 - row * 2.8 * z;
				ctx.fillStyle = col;
				ctx.strokeStyle = 'rgba(16,12,8,.7)';
				ctx.lineWidth = Math.max(0.5, 0.3 * z);
				ctx.beginPath();
				if (shape === 'log') ctx.ellipse(x, y, 2.2 * z, 1.4 * z, 0, 0, 7);
				else if (shape === 'sack') ctx.ellipse(x, y - 0.4 * z, 1.9 * z, 1.7 * z, 0, 0, 7);
				else ctx.rect(x - 1.9 * z, y - 1.4 * z, 3.8 * z, 2.8 * z);
				ctx.fill();
				ctx.stroke();
				if (shape === 'log') {
					ctx.fillStyle = '#c9a476';
					ctx.beginPath();
					ctx.ellipse(x + 1.5 * z, y, 0.6 * z, 1.1 * z, 0, 0, 7);
					ctx.fill();
				} // the cut end
			}
	});
}
// a chimney's plume (Build 62): bent over by the wind, its height goes with the downwind distance to the two-thirds (Briggs 1969, Δh ∝ x^(2/3)),
// so it climbs fast and then leans; it widens about as the distance (Pasquill–Gifford, σ ∝ x^0.9). The wind is the weather's.
function smoke(x, y, seed, z) {
	if (still()) return;
	const lean = 4 + Math.abs(wind) * 9,
		side = wind < 0 ? -1 : 1;
	for (let i = 0; i < 3; i++) {
		const ph = (G.t * 0.35 + i / 3 + seed * 0.37) % 1,
			r = (2 + 5 * ph ** 0.9) * z;
		ctx.fillStyle = `rgba(215,215,210,${0.3 * (1 - ph)})`;
		ctx.beginPath();
		ctx.arc(x + side * ph * lean * z, y - 26 * ph ** (2 / 3) * z, r, 0, 7);
		ctx.fill();
	}
}
// fire when a building is badly hurt, dark smoke when sabotage has stalled it
function blaze(b, x, y, z) {
	if (still()) return;
	const low = b.hp < maxHpB(b.owner, b.kind) * 0.5 || b.fire > 0,
		stalled = (b.stall || 0) > G.t,
		w = BLD[b.kind].fp * NAVC * z;
	if (!low && !stalled) return;
	const top = y - BLD[b.kind].h * 0.7 * z;
	if (low) for (let i = 0; i < 3; i++) flame(x + (i - 1) * w * 0.25, top + 4 * z, 'blaze', z * 0.5, b.id + i * 7);
	for (let i = 0; i < 3; i++) {
		const ph = (G.t * 0.4 + i / 3 + b.id * 0.29) % 1;
		ctx.fillStyle = `rgba(60,58,56,${0.45 * (1 - ph)})`;
		ctx.beginPath();
		ctx.arc(x + ph * 6 * z, top - 6 * z - ph * 26 * z, (2 + ph * 5) * z, 0, 7);
		ctx.fill();
	}
}
const RIPS = [];
function ripple(x, y, col) {
	RIPS.push({ x, y, col, t: performance.now() });
}
// ── theatrics: one pop curve, three sizes of celebration. 1 a building is finished, 2 an upgrade rolls through an army, 3 a new age, a wonder or a victory.
const popC = (a) => (a >= 1 || a < 0 ? 1 : 1 + 0.16 * Math.sin(a * Math.PI) * (1 - a)); // swell and settle; a runs 0 to 1
function celebrate(size, x, y, hit) {
	if (G.t - (G.celT ?? -9) < 0.34 && size < 3) return;
	G.celT = G.t; // calm: never two in the same blink
	ripple(x, y, size === 1 ? '#ffd35e' : '#fff3c4');
	if (size === 2 && hit) {
		const L = G.units.filter(hit).sort((a, b) => a.x - b.x),
			step = Math.min(0.06, 1.2 / Math.max(1, L.length));
		L.forEach((u, i) => {
			u.glowT = G.t + i * step;
		});
	}
	if (size === 3) {
		G.whiteT = G.t;
		feel('crack');
	}
}
function ripDraw() {
	const now = performance.now(),
		z = cam.z;
	for (let i = RIPS.length - 1; i >= 0; i--) {
		const a = (now - RIPS[i].t) / 600;
		if (a >= 1) {
			RIPS.splice(i, 1);
			continue;
		}
		ctx.strokeStyle = RIPS[i].col;
		ctx.globalAlpha = 1 - a;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.ellipse(SX(RIPS[i].x), SY(RIPS[i].y), (6 + a * 18) * z, (6 + a * 18) * z * TILT, 0, 0, 7);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
}
function sparkDraw() {
	if (!SPARKS.length) return;
	const z = cam.z;
	SPARKS = SPARKS.filter((k) => {
		const a = G.t - k.t;
		return a >= 0 && a < 0.3;
	});
	for (const k of SPARKS) {
		const a = (G.t - k.t) / 0.3,
			x = SX(k.x),
			y = SY(k.y) - 6 * z;
		ctx.strokeStyle = `rgba(255,${(200 - a * 80) | 0},90,${1 - a})`;
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		for (let i = 0; i < 5; i++) {
			const an = i * 1.26 + k.t * 7;
			ctx.moveTo(x + Math.cos(an) * 2 * z, y + Math.sin(an) * 2 * z);
			ctx.lineTo(x + Math.cos(an) * (3 + a * 6) * z, y + Math.sin(an) * (3 + a * 6) * z);
		}
		ctx.stroke();
	}
}
// Three translucent casts (warm dusk, blue night, the weather) laid one over another come to one colour: computed once a frame, painted once.
const WX_TINT = {
	drought: [210, 160, 60, 0.1],
	rain: [20, 30, 50, 0.12],
	frost: [230, 240, 250, 0.14],
	snow: [230, 236, 246, 0.12],
};
const tintC = { k: '', s: '' };
function tintOf(dusk, nt) {
	let r = 0,
		g = 0,
		b = 0,
		a = 0;
	const lay = (cr, cg, cb, ca) => {
		if (ca <= 0) return;
		const na = a + ca - a * ca;
		r = (r * a * (1 - ca) + cr * ca) / na;
		g = (g * a * (1 - ca) + cg * ca) / na;
		b = (b * a * (1 - ca) + cb * ca) / na;
		a = na;
	};
	if (dusk > 0.02) lay(255, 140, 60, 0.13 * dusk);
	if (nt > 0) lay(10, 18, 48, 0.4 * nt * (1.15 - 0.3 * moonLight())); // darker toward the new moon
	const w = WX_TINT[G.wx];
	if (w) lay(w[0], w[1], w[2], w[3]);
	if (a <= 0.002) return '';
	const k = `${r | 0},${g | 0},${b | 0},${Math.round(a * 200)}`;
	if (tintC.k !== k) {
		tintC.k = k;
		tintC.s = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
	}
	return tintC.s;
}
const NV = { ref: null, len: 0, key: '', arr: [] };
function viewNodes(a, b, far) {
	// the nodes on screen, sorted back to front; rebuilt only when the view moves 40 units or a node comes or goes
	const q = (v) => Math.floor(v / 40),
		key = `${q(a.x)},${q(a.y)},${q(b.x)},${q(b.y)},${far}`;
	if (NV.ref !== G.nodes || NV.len !== G.nodes.length || NV.key !== key) {
		const x0 = q(a.x) * 40,
			y0 = q(a.y) * 40,
			x1 = (q(b.x) + 1) * 40,
			y1 = (q(b.y) + 1) * 40;
		NV.arr = G.nodes
			.filter((n) => n.kind !== 'farm' && !(far && n.kind === 'tree') && n.x > x0 && n.x < x1 && n.y > y0 && n.y < y1)
			.sort((p, r) => p.y - r.y);
		NV.ref = G.nodes;
		NV.len = G.nodes.length;
		NV.key = key;
	}
	return NV.arr;
}
function drawNode(n, s) {
	const z = cam.z,
		sx = SX(n.x),
		sy = SY(n.y);
	if (n.kind === 'fish') {
		if (still()) return;
		const ph = (G.t * 0.5 + n.id * 0.13) % 1;
		ctx.strokeStyle = `rgba(225,242,255,${0.6 * (1 - ph)})`;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.ellipse(sx, sy, (3 + ph * 6) * z, (1.5 + ph * 3) * z * TILT, 0, 0, 7);
		ctx.stroke();
		return;
	}
	if (n.kind === 'meat') {
		ctx.fillStyle = '#8a3a2a';
		ctx.beginPath();
		ctx.ellipse(sx, sy, 5 * z, 2.6 * z, 0, 0, 7);
		ctx.fill();
		ctx.fillStyle = '#e8d8c0';
		ctx.fillRect(sx - 1 * z, sy - 3 * z, 2 * z, 3 * z);
		return;
	}
	const f = (0.6 + 0.4 * Math.min(1, n.amt / n.max)) * (n.kind === 'tree' ? 1.4 : 1),
		c = nodeSprite(n, s),
		k = (z / s) * f; // trees drawn as wide as the ground they block
	stamp(c, sx, sy, k);
}
const workOf = (u) =>
	u.job === 'repair'
		? 5
		: !u.node
			? 0
			: u.node.kind === 'fish'
				? 4
				: u.node.kind === 'bush' || u.node.kind === 'meat'
					? 1
					: u.node.kind === 'stone' || u.node.kind === 'gold' || u.node.kind === 'iron'
						? 2
						: u.node.kind === 'farm'
							? u.node.type === 'wood'
								? 0
								: 3
							: 0; // which work a villager is doing: chop, forage, mine, farm, fish, mend
const STRIDE = 7; // ground covered by one step, in world units
// an army on the move carries its standard (Build 52): five or more soldiers of one side bound for one place (the grouping formUp makes) show a pole
// over their middle with the side's cloth, and round its foot a ring that is as full as the group's health
const STANDARDS = []; // the poles drawn this frame (screen x, y, side): the lights put a torch on each after dark
function drawStandards(z, inView) {
	STANDARDS.length = 0;
	if (z < 0.4) return;
	const grp = new Map();
	for (const u of G.units) {
		if (u.hp <= 0 || u.inside || !isSoldier(u) || hasTag(u.kind, 'siege')) continue;
		if (u.state !== 'goto' && u.state !== 'assist' && u.state !== 'attack') continue;
		if (u.px === undefined || !visibleTo0(u)) continue;
		const key = u.owner + 'g' + Math.round(u.px / 50) + ',' + Math.round(u.py / 50),
			g = grp.get(key) || (grp.set(key, { o: u.owner, n: 0, x: 0, y: 0, hp: 0, mx: 0 }), grp.get(key));
		g.n++;
		g.x += u.x;
		g.y += u.y;
		g.hp += u.hp;
		g.mx += u.max;
	}
	const t = still() ? 0 : performance.now() / 1000;
	for (const g of grp.values()) {
		if (g.n < 5) continue;
		const c = { x: g.x / g.n, y: g.y / g.n };
		if (!inView(c)) continue;
		const x = SX(c.x),
			y = SY(c.y),
			h = 30 * z,
			col = G.P[g.o].color,
			r = 6 * z + 2,
			f = clamp(g.hp / g.mx, 0, 1);
		STANDARDS.push({ x, y, o: g.o });
		ctx.lineWidth = Math.max(2, 2.4 * z);
		ctx.strokeStyle = 'rgba(16,12,8,.6)';
		ctx.beginPath();
		ctx.ellipse(x, y, r, r * TILT, 0, 0, 7);
		ctx.stroke();
		ctx.strokeStyle = col;
		ctx.beginPath();
		ctx.ellipse(x, y, r, r * TILT, 0, -Math.PI / 2, -Math.PI / 2 + f * 6.283);
		ctx.stroke(); // the ring: how much of the group's health is left
		ctx.strokeStyle = '#3a2a1a';
		ctx.lineWidth = Math.max(1, 1.1 * z);
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y - h);
		ctx.stroke();
		const a = Math.sin(t * 4 + g.o) * 1.4 * z,
			w = 10 * z;
		ctx.fillStyle = col;
		ctx.strokeStyle = 'rgba(16,12,8,.8)';
		ctx.lineWidth = Math.max(0.6, 0.35 * z);
		ctx.beginPath();
		ctx.moveTo(x, y - h);
		ctx.quadraticCurveTo(x + w * 0.5, y - h + a, x + w, y - h + 1 * z + a * 1.5);
		ctx.lineTo(x + w, y - h + 6 * z + a * 1.5);
		ctx.quadraticCurveTo(x + w * 0.5, y - h + 6 * z + a, x, y - h + 7 * z);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}
// the fallen (Build 52): a figure that dies where you can see it topples over in a third of a second and fades, instead of vanishing; kept for the picture only
const FALL = [];
function fallen(u) {
	const U = UNIT[u.kind];
	if (!U.look || hasTag(u.kind, 'siege') || !visibleTo0(u) || FALL.length > 80) return;
	const st = u.owner === WILD ? null : stats(u.owner, u.kind);
	FALL.push({
		x: u.x,
		y: u.y,
		look: U.look,
		col: G.P[u.owner].color,
		tier: st ? st.tier : u.tier || 0,
		kit: st && U.tick === 'sol' ? st.kit : 0,
		face: (u.fx || 1) < 0 ? -1 : 1,
		t: performance.now(),
	});
}
function drawFallen(f, s) {
	const a = (performance.now() - f.t) / 1000;
	if (a > 1.4) return;
	const z = cam.z,
		c = sprite(f.look, f.col, f.tier, 0, s, f.kit),
		k = (z * FIG) / s,
		r = (still() ? 1 : Math.min(1, a / 0.35)) * (Math.PI / 2) * -f.face; // falls back, away from the way it faced
	ctx.save();
	ctx.globalAlpha = a < 0.7 ? 1 : 1 - (a - 0.7) / 0.7;
	ctx.translate(SX(f.x), SY(f.y));
	ctx.rotate(r);
	if (f.face < 0) ctx.scale(-1, 1);
	ctx.drawImage(c, -c.ax * k, -c.ay * k, c.width * k, c.height * k);
	ctx.restore();
}
const LEAN = new WeakMap(); // the view's own memory of each woodcutter's lean: the drawing never writes the game's units (Build 60)
function drawUnit(u, s) {
	// a woodcutter leans in to its tree while it chops: the tree's ground keeps it 20 away, so it is drawn up to 12 closer (drawing only; the game does not move it)
	const n = u.node,
		on = u.kind === 'vil' && n && n.kind === 'tree' && u.work && G.t - u.work < 0.25,
		lean = clamp((LEAN.get(u) || 0) + (on ? 0.08 : -0.08), 0, 1);
	LEAN.set(u, lean);
	const ln = lean && u.node ? (Math.min(12, Math.max(0, dist(u, u.node) - 10)) * lean) / (dist(u, u.node) || 1) : 0,
		al = DRAW.alpha, // the frame falls between two steps (30 a second); the figure is drawn that fraction of the way (a jump of 30+ is a teleport, not a step)
		ix = u.lx !== undefined && Math.abs(u.x - u.lx) < 30 ? u.lx + (u.x - u.lx) * al : u.x,
		iy = u.ly !== undefined && Math.abs(u.y - u.ly) < 30 ? u.ly + (u.y - u.ly) * al : u.y,
		ux = u.node ? ix + (u.node.x - ix) * ln : ix,
		uy = u.node ? iy + (u.node.y - iy) * ln : iy;
	const z = cam.z,
		sx = SX(ux),
		sy = SY(uy) - (u.fly || 0) * z,
		U = UNIT[u.kind],
		col = G.P[u.owner].color,
		st = u.owner === WILD ? null : stats(u.owner, u.kind);
	const moving = G.t - (u.mvT || -9) < 0.15,
		working = u.work && G.t - u.work < 0.25,
		pace = (u.st ? u.st.walk : G.t * 30) / STRIDE; // steps follow the ground covered, not the clock (Build 52): feet no longer slide
	const fr =
		G.t - (u.hitT || -9) < 0.25
			? 3
			: moving
				? 1 + (((pace | 0) + u.id) % 2)
				: working
					? U.look === 'vil'
						? 10 + workOf(u) * 2 + ((((G.t * 2.5) | 0) + u.id) % 2)
						: 1 + ((((G.t * 6) | 0) + u.id) % 2)
					: 0;
	if (z < 0.3) {
		const big = (LOOKBOX[U.look] || [26])[0];
		ctx.fillStyle = u.owner === WILD ? '#c9b48a' : col;
		const r = Math.max(1.8, big * 0.07 * z * FIG);
		ctx.fillRect(sx - r, sy - r * 1.6, r * 2, r * 2);
		return;
	} // seen from far away a person is a dot of their colour
	const c = sprite(
			U.look,
			col,
			st ? st.tier : u.tier || 0,
			fr,
			s,
			st && U.tick === 'sol' && !hasTag(u.kind, 'siege') ? st.kit : 0,
		),
		k = (z * FIG) / s,
		big = (LOOKBOX[U.look] || [26])[0];
	for (const s of STANDARDS)
		flameShadow(sx, sy, (LOOKBOX[U.look] || [26, 30])[1] * FIG, big * 0.28 * z * FIG + 2, z, s.x, s.y, 'torch');
	if (u.owner === 0 && G.sel !== 'all' && u.bn === G.sel) {
		ctx.strokeStyle = '#ffd35e';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.ellipse(sx, sy, 7 * z + 2, 3.4 * z + 1, 0, 0, 7);
		ctx.stroke();
	}
	if (u.owner !== WILD) {
		ctx.fillStyle = col;
		ctx.beginPath();
		ctx.ellipse(sx, sy, 3.4 * z + 1, 1.6 * z + 0.6, 0, 0, 7);
		ctx.fill();
	}
	// the body in motion (Build 52): a rise and fall with each step; a lunge into the blow and back; a shooter's kick on the release
	const face = (u.fx || 1) < 0 ? -1 : 1,
		ha = G.t - (u.hitT ?? -9),
		near = (U.rng || 0) <= 20,
		bob = moving && !still() ? Math.abs(Math.sin(pace * Math.PI)) * 1.2 * z : 0,
		lunge =
			still() || ha > 0.3
				? 0
				: near
					? Math.sin((ha / 0.3) * Math.PI) * 2.6 * z
					: ha < 0.18
						? -1.3 * z * (1 - ha / 0.18)
						: 0,
		bx = sx + face * lunge,
		by = sy - bob;
	stamp(c, bx, by, k * popC((G.t - (u.bornT ?? -9)) / 0.4), face < 0);
	{
		const ga = G.t - (u.glowT ?? -9);
		if (ga >= 0 && ga < 0.6) {
			ctx.globalCompositeOperation = 'lighter';
			ctx.globalAlpha = 0.7 * Math.sin((ga / 0.6) * Math.PI);
			stamp(c, bx, by, k, face < 0);
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = 'source-over';
		}
	} // an upgrade rolling through the army
	if (G.t - (u.flashT || -9) < 0.12) {
		ctx.globalCompositeOperation = 'lighter';
		ctx.globalAlpha = 0.55;
		stamp(c, bx, by, k, face < 0);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'source-over';
	}
	const top =
		sy - (U.look === 'stower' ? 32 : U.look === 'treb' ? 26 : U.look === 'elephant' ? 22 : big > 34 ? 18 : 13) * z;
	if (u.carry > 0) {
		ctx.fillStyle = (RESOURCES[u.carryType] || GOODS[u.carryType] || RESOURCES.food).col;
		ctx.beginPath();
		ctx.arc(sx - 3 * z * ((u.fx || 1) < 0 ? -1 : 1), sy - 7 * z, 2 * z + 0.5, 0, 7);
		ctx.fill();
	}
	if (u.zeal > G.t) {
		ctx.strokeStyle = 'rgba(244,206,90,.85)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.ellipse(sx, sy - 6 * z, 8 * z, 9 * z, 0, 0, 7);
		ctx.stroke();
	}
	if (u.hp < u.max - 0.5 && z > 0.45)
		bar(sx, top - 5, Math.max(12, 12 * z), u.hp / u.max, u.owner === WILD ? '#c9b48a' : col);
	if (isSoldier(u) && u.mor < 0.6 && z > 0.45 && u.state !== 'rout')
		bar(sx, top - 10, Math.max(12, 12 * z), u.mor, '#f2cf55'); // nerve, when it is low
	if (u.state === 'rout') {
		ctx.fillStyle = '#d8432f';
		ctx.strokeStyle = 'rgba(0,0,0,.65)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.arc(sx + 7 * z, top - 2, 4.6 * z + 1.6, 0, 7);
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = Math.max(1.3, 1.5 * z);
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(sx + 7 * z, top - 2 - 2.4 * z);
		ctx.lineTo(sx + 7 * z, top - 2 + 0.6 * z);
		ctx.moveTo(sx + 7 * z, top - 2 + 2.3 * z);
		ctx.lineTo(sx + 7 * z, top - 2 + 2.4 * z);
		ctx.stroke();
		ctx.lineCap = 'butt';
	} // a red badge with a mark: its nerve broke and it is running (Build 42: it was a white flag, which reads as surrender)
	else if (u.owner === 0 && z > 0.55 && isSoldier(u) && armyStatus(u) === 'march') {
		const d = (u.fx || 1) < 0 ? -1 : 1;
		ctx.strokeStyle = '#ffd35e';
		ctx.lineWidth = Math.max(1.4, 1.6 * z);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.beginPath();
		ctx.moveTo(sx + d * (6 * z - 2), top + 1 * z - 3);
		ctx.lineTo(sx + d * (6 * z + 1), top + 1 * z);
		ctx.lineTo(sx + d * (6 * z - 2), top + 1 * z + 3);
		ctx.stroke();
		ctx.lineCap = 'butt';
	} // a small gold chevron beside the head: on the march (Build 42)
	if (u.state === 'convert' && u.cvT > 0) {
		ctx.strokeStyle = 'rgba(244,206,90,.9)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(
			sx,
			sy - 6 * z,
			9 * z,
			-Math.PI / 2,
			-Math.PI / 2 + (6.28 * u.cvT) / (CONVERT.secs * fxv(u.owner, 'convert').m),
		);
		ctx.stroke();
	} // the conversion, filling
	if (u.owner === 0 && u.idle) idleMark(sx, top, z);
	if (u.sick > G.t) {
		ctx.fillStyle = u.plague ? '#7a3a8a' : '#7aa04a';
		ctx.beginPath();
		ctx.arc(sx - 5 * z, top - 2, 2 * z + 1, 0, 7);
		ctx.fill();
	}
	if (u.kind === 'caravan' && u.goods) {
		const k = Object.keys(u.goods).find((k) => u.goods[k] > 0);
		if (k) {
			ctx.fillStyle = colOf(k);
			ctx.fillRect(sx - 4 * z, sy - 12 * z, 5 * z, 3 * z);
		}
	}
}
function drawFind(f) {
	const z = cam.z,
		x = SX(f.x),
		y = SY(f.y),
		F = FINDS[f.kind];
	if (f.kind === 'camp' && !f.done) flame(x, y + 1.5 * z, 'campfire', z, f.id); // the robbers' fire, before the tents (the glow comes with the lights)
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(z, z);
	g = ctx;
	ctx.lineJoin = 'round';
	if (f.kind === 'chest') {
		E_(0, 1, 7, 2.4, 'rgba(0,0,0,.3)');
		P_(
			[
				[-5, 0],
				[5, 0],
				[5, -5],
				[-5, -5],
			],
			'#7a4e24',
			INK,
			0.5,
		);
		P_(
			[
				[-5, -5],
				[5, -5],
				[4, -8],
				[-4, -8],
			],
			'#8a5a2a',
			INK,
			0.5,
		);
		L_(-5, -3, 5, -3, '#c9a227', 0.8);
		E_(0, -4.4, 1, 1, '#f2cf55');
	} else if (f.kind === 'ruins') {
		for (const [dx, h] of [
			[-10, 14],
			[-4, 8],
			[3, 16],
			[9, 5],
		]) {
			P_(
				[
					[dx - 1.6, 0],
					[dx + 1.6, 0],
					[dx + 1.6, -h],
					[dx - 1.6, -h],
				],
				LG(dx - 2, 0, dx + 2, 0, ['#e0d8c4', '#a89e88']),
				INK,
				0.4,
			);
		}
		P_(
			[
				[-12, -14],
				[5, -16.5],
				[5, -18],
				[-12, -15.6],
			],
			'#d0c8b2',
			INK,
			0.4,
		);
		P_(
			[
				[-6, 1],
				[2, 1],
				[1, -2],
				[-5, -2],
			],
			'#b8b0a0',
			INK,
			0.4,
		);
	} else if (f.kind === 'cemetery') {
		for (let i = 0; i < 6; i++) {
			const dx = -12 + (i % 3) * 10,
				dy = -3 + Math.floor(i / 3) * 6;
			P_(
				[
					[dx - 1.8, dy],
					[dx + 1.8, dy],
					[dx + 1.8, dy - 4],
					[dx, dy - 5.4],
					[dx - 1.8, dy - 4],
				],
				'#9a9890',
				INK,
				0.4,
			);
		}
		L_(-16, 6, 16, 6, '#3a3028', 0.6);
		for (let x = -16; x <= 16; x += 4) L_(x, 6, x, 2, '#3a3028', 0.6);
	} else if (f.kind === 'camp') {
		for (const [dx, col] of [
			[-9, '#7a6a50'],
			[8, '#6a5a44'],
		])
			P_(
				[
					[dx - 6, 0],
					[dx + 6, 0],
					[dx, -9],
				],
				col,
				INK,
				0.5,
			);
		E_(0, 2, 3, 1.2, '#3a2a1a');
		L_(14, 2, 14, -14, '#3a2a1a', 0.6);
		P_(
			[
				[14, -14],
				[20, -12.6],
				[14, -11],
			],
			'#2a2a2a',
		);
	} else if (f.kind === 'den') {
		P_(
			[
				[-12, 1],
				[-9, -8],
				[0, -12],
				[10, -7],
				[13, 1],
			],
			LG(0, -12, 0, 1, ['#8a8478', '#5a5650']),
			INK,
			0.5,
		);
		E_(0, -2, 4.4, 4, '#1a1612');
	} else if (f.kind === 'shrine') {
		// the shrine inside the Throne: three steps, four columns, a gold dome, the flame; the holder's colour on the dome's finial
		const oc = f.owner !== null ? G.P[f.owner].color : '#d8cdb4';
		for (let k = 0; k < 3; k++)
			P_(
				[
					[-10 + k * 2, 2 - k * 1.6],
					[10 - k * 2, 2 - k * 1.6],
					[10 - k * 2, 0.4 - k * 1.6],
					[-10 + k * 2, 0.4 - k * 1.6],
				],
				k % 2 ? '#c8bda0' : '#b8ac92',
				INK,
				0.35,
			);
		for (const cx of [-6, -2, 2, 6]) {
			L_(cx, -3, cx, -11, '#e8e0c8', 1.6);
			L_(cx, -3, cx, -11, 'rgba(90,70,40,.35)', 0.5);
		}
		P_(
			[
				[-8, -11],
				[8, -11],
				[8, -12.4],
				[-8, -12.4],
			],
			'#d8cdb4',
			INK,
			0.35,
		);
		E_(0, -12.4, 7, 4.2, LG(-7, 0, 7, 0, ['#f2d27a', '#c9a227', '#8a6a1a']), INK, 0.4);
		ctx.save();
		ctx.beginPath();
		ctx.rect(-8, -17, 16, 4.6);
		ctx.clip();
		E_(0, -12.4, 7, 4.2, LG(-7, 0, 7, 0, ['#f2d27a', '#c9a227', '#8a6a1a']), INK, 0.4);
		ctx.restore();
		L_(0, -16.6, 0, -19.5, '#8a6a1a', 0.8);
		E_(0, -20, 1.3, 1.3, oc, INK, 0.3);
		if (!still()) E_(0, -6, 1.6, 2.4 + Math.sin(G.t * 6) * 0.5, 'rgba(255,190,70,.9)');
		if (f.cap) {
			const t = f.cap.t / F.capture;
			ctx.strokeStyle = G.P[f.cap.o].color;
			ctx.lineWidth = 1.4;
			ctx.beginPath();
			ctx.arc(0, -8, 12, -Math.PI / 2, -Math.PI / 2 + t * 6.28);
			ctx.stroke();
		}
	} else if (f.kind === 'stop') {
		if (!postAt(f)) {
			// a bazaar stall: striped awning on two poles, a table of goods with the wanted one in front, the holder's pennant
			const oc = f.owner !== null ? G.P[f.owner].color : '#d8c79c';
			L_(-9, 2, -9, -11, '#5a3a1c', 1);
			L_(9, 2, 9, -11, '#5a3a1c', 1);
			for (let k = 0; k < 6; k++)
				P_(
					[
						[-11 + k * 3.7, -11],
						[-7.3 + k * 3.7, -11],
						[-7.3 + k * 3.7 + 1, -14.5],
						[-11 + k * 3.7 + 1, -14.5],
					],
					k % 2 ? '#efe6d0' : oc,
					null,
				);
			P_(
				[
					[-11, -11],
					[11, -11],
					[12, -14.5],
					[-10, -14.5],
				],
				null,
				INK,
				0.4,
			);
			for (let k = 0; k < 6; k++)
				P_(
					[
						[-11 + k * 3.7, -11],
						[-9.2 + k * 3.7, -9.4],
						[-7.3 + k * 3.7, -11],
					],
					k % 2 ? '#efe6d0' : oc,
					INK,
					0.3,
				);
			P_(
				[
					[-8, 1],
					[8, 1],
					[8, -3],
					[-8, -3],
				],
				'#8a5d34',
				INK,
				0.4,
			);
			L_(-7, 1, -7, 3, '#5a3a1c', 0.8);
			L_(7, 1, 7, 3, '#5a3a1c', 0.8);
			{
				const ks = Object.keys(GOODS)
					.filter((k) => k !== f.want)
					.slice(0, 2);
				E_(-4.5, -4, 2.2, 1.4, GOODS[ks[0]].col, INK, 0.3);
				E_(4.5, -4, 2.2, 1.4, GOODS[ks[1] || ks[0]].col, INK, 0.3);
				E_(0, -2.2, 2.8, 1.8, GOODS[f.want].col, INK, 0.4);
			}
			L_(12, -11, 12, -20, '#5a3a1c', 0.8);
			P_(
				[
					[12, -20],
					[19, -18.6],
					[12, -17],
				],
				oc,
				INK,
				0.4,
			);
		}
	} else if (f.kind === 'vagabonds') {
		// a drifters' camp: a stone ring round a small fire, two logs, two bedrolls laid at an angle and a lean-to
		if (!f.done) {
			E_(0, 4, 20, 7, 'rgba(0,0,0,.2)');
			P_(
				[
					[12, 5],
					[18, -9],
					[25, 5],
				],
				'#8a7650',
			); // the lean-to
			P_(
				[
					[16, 5],
					[18, -3],
					[22, 5],
				],
				'#4a3c26',
			);
			P_(
				[
					[-19, 7],
					[-9, 4],
					[-7, 7],
					[-17, 10],
				],
				'#6b4a3a',
			); // a bedroll and its pillow
			E_(-17, 6, 2.4, 1.6, '#c9b28a');
			P_(
				[
					[-12, 11],
					[-3, 8],
					[-1, 11],
					[-10, 14],
				],
				'#4a5a6a',
			);
			E_(-10, 10, 2.4, 1.6, '#c9b28a');
			E_(0, 3, 6, 2.6, '#3a2418');
			for (let i = 0; i < 8; i++)
				E_(Math.cos(i * 0.785) * 8, 3 + Math.sin(i * 0.785) * 3.2, 1.9, 1.3, i % 2 ? '#8a8a82' : '#a09e94');
			P_(
				[
					[-6, 4],
					[5, 1],
					[6, 3],
					[-5, 6],
				],
				'#6b4a2a',
			);
			P_(
				[
					[-5, 1],
					[6, 4],
					[5, 6],
					[-6, 3],
				],
				'#7d5a34',
			);
			const fl = still() ? 0 : Math.sin(performance.now() / 110 + f.id) * 1.2;
			P_(
				[
					[-3, 3],
					[0, -8 + fl],
					[3, 3],
				],
				'#ff9a2a',
			);
			P_(
				[
					[-1.4, 3],
					[0, -3.5 + fl * 0.5],
					[1.4, 3],
				],
				'#ffe27a',
			);
		}
	}
	ctx.restore();
	g = null;
}
// what the finger holds: a ring on the ground under each, green for yours, red for a foe's, gold for the wild and the land; and red under
// the enemy or the hazard the quick action is open on (Build 70; a hazard is a spot on the ground, ringed as wide as a find)
function drawPicks(z) {
	const red = G.qa && G.qa.red ? G.qa.h.e : null,
		E = red ? [...(G.pickE || []), red] : G.pickE;
	if (!E || !E.length) return;
	ctx.lineWidth = 2;
	ctx.setLineDash([]);
	for (const e of E) {
		if (e.hp !== undefined && e.hp <= 0) continue;
		if (e.amt !== undefined && e.amt <= 0 && !e.farm) continue;
		const own = e.owner,
			r = e.q ? halfOf(e) + 6 : !e.kind || FINDS[e.kind] ? 18 : 9;
		ctx.strokeStyle = e === red ? '#ff6a52' : own === 0 ? '#5ad27a' : own === undefined || own === null || own === WILD ? '#ffd35e' : '#ff6a52';
		ctx.beginPath();
		ctx.ellipse(SX(e.x), SY(e.y), r * z + 3, r * z * TILT + 2, 0, 0, 7);
		ctx.stroke();
	}
}
const rnd2 = () => Math.random() * 2 - 1;
