// ═════ 20-view-base.js: canvas, camera, scars on the ground, tracks, zoom ═════
// ───────────────────────── The view: a tilted table, seen from the south ─────────────────────────
const cv = $('cv'),
	mini = $('mini'),
	mctx = mini.getContext('2d');
let ctx = cv.getContext('2d'); // the glass; swapped for a cache's context while a badge or a pile is drawn once (Build 62)
const cam = { x: MID, y: MID, z: 0.9 }; // set again by every new game and load
const FIG = 0.66; // figures are drawn at 0.66 world units per figure unit: a person stands about 14 tall (Build 59, Albert: from 0.55, after the mockup)
let cw = 0,
	ch = 0,
	dpr = 1,
	bg = null,
	bgK = 0.5,
	terrainMini = null,
	grassPat = null;
const grassM = new DOMMatrix();
// the ground remembers: where people fell, where buildings burned, where villagers walk a lot. A layer over the ground, cleared with each new game.
let scarCv = null,
	scarX = null;
function resetScars() {
	scarCv = document.createElement('canvas');
	scarCv.width = scarCv.height = MAP * bgK;
	scarX = scarCv.getContext('2d');
	scarX.scale(bgK, bgK);
}
// the ground round a building is worn bare by feet (Build 52): painted once into the ground's memory when it is finished, so it costs nothing a frame and stays when the building is gone
function wearGround(b) {
	const B = BLD[b.kind];
	if (!scarX || B.crop || B.wallish || B.trap) return;
	const w = B.fp * NAVC;
	scarX.fillStyle = 'rgba(118,96,64,.3)';
	scarX.beginPath();
	scarX.ellipse(b.x + w * 0.08, b.y + w * 0.12, w * 0.86, w * 0.72, 0, 0, 7);
	scarX.fill();
}
function scarFall(u) {
	const x = u.x,
		big = (LOOKBOX[UNIT[u.kind].look] || [26])[0] > 30;
	scarX.fillStyle = 'rgba(40,18,12,.22)';
	scarX.beginPath();
	scarX.ellipse(x, u.y, 4 + (big ? 3 : 0), 2.2, 0, 0, 7);
	scarX.fill();
	if (isSoldier(u)) {
		scarX.strokeStyle = 'rgba(60,45,30,.5)';
		scarX.lineWidth = 0.7;
		scarX.beginPath();
		scarX.moveTo(x - 4, u.y + 1);
		scarX.lineTo(x + 3, u.y - 1.5);
		scarX.stroke();
	}
}
function scarStrike(x, y) {
	if (scarX) {
		scarX.fillStyle = 'rgba(20,16,12,.35)';
		scarX.beginPath();
		scarX.ellipse(x, y, 6, 4, 0, 0, 7);
		scarX.fill();
	}
} // where lightning struck
function scarCrack(c) {
	if (!scarX) return;
	scarX.strokeStyle = 'rgba(22,15,10,.5)';
	scarX.lineWidth = 1.3;
	for (const arm of c.arms) {
		scarX.beginPath();
		arm.forEach(([x, y], i) => (i ? scarX.lineTo(c.x + x, c.y + y * 0.7) : scarX.moveTo(c.x, c.y)));
		scarX.stroke();
	}
} // where the ground split
function scarBurn(b) {
	const h = halfOf(b);
	scarX.fillStyle = 'rgba(25,20,18,.38)';
	scarX.beginPath();
	scarX.ellipse(b.x, b.y, h * 1.05, h * 0.8, 0, 0, 7);
	scarX.fill();
	scarX.fillStyle = 'rgba(95,90,84,.55)';
	for (let i = 0; i < 5; i++) {
		const a = i * 1.3 + b.id,
			r = h * 0.6 * (((i * 0.37) % 1) + 0.2);
		scarX.fillRect(b.x + Math.cos(a) * r - 1.5, b.y + Math.sin(a) * r * 0.7 - 1, 3, 2);
	}
}
// a small parchment tab with a book in red ink, and a count when more than one thing waits
// the badge is drawn once per count and zoom into BADGE and stamped (Build 62: measured at a tenth of a zoomed-out frame as vector work); the bob is in the stamp
// One home for art drawn once into a little canvas of its own (W × H on screen): the drawing goes to ctx, which is swapped for the sprite's
// and always given back, even if the art throws (hunt B #10: a throw left every later frame drawing off screen)
function drawOnce(W, H, art) {
	const c = document.createElement('canvas'),
		was = ctx;
	c.width = Math.ceil(W * dpr);
	c.height = Math.ceil(H * dpr);
	ctx = c.getContext('2d');
	try {
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		art();
	} finally {
		ctx = was;
	}
	return c;
}
const BADGE = new Map();
function researchBadge(x, y, s, n) {
	const key = `${Math.min(n, 9)}:${s.toFixed(2)}`,
		q = still() ? 0 : Math.sin(G.t * 4) * 0.8 * s;
	let c = BADGE.get(key);
	if (!c) {
		const w = (n > 1 ? 31 : 23) * s + 4,
			h = 17 * s + 4;
		c = drawOnce(w, h, () => badgeArt(w / 2, h / 2, s, n));
		c.ax = w / 2;
		c.ay = h / 2;
		BADGE.set(key, c);
		trim(BADGE, 40);
	}
	ctx.drawImage(c, x - c.ax, y + q - c.ay, c.width / dpr, c.height / dpr);
}
function badgeArt(x, by, s, n) {
	const w = (n > 1 ? 31 : 23) * s,
		h = 17 * s,
		bx = x - (n > 1 ? 6.5 : 0) * s;
	ctx.save();
	ctx.beginPath();
	if (ctx.roundRect) ctx.roundRect(x - w / 2, by - h / 2, w, h, h / 2);
	else ctx.rect(x - w / 2, by - h / 2, w, h);
	ctx.fillStyle = '#e6d6ad';
	ctx.fill();
	ctx.strokeStyle = '#8e1d14';
	ctx.lineWidth = Math.max(1.2, 1.3 * s);
	ctx.stroke();
	ctx.fillStyle = '#8e1d14';
	ctx.beginPath();
	ctx.moveTo(bx - 6 * s, by - 4 * s);
	ctx.lineTo(bx, by - 2.4 * s);
	ctx.lineTo(bx + 6 * s, by - 4 * s);
	ctx.lineTo(bx + 6 * s, by + 4 * s);
	ctx.lineTo(bx, by + 5.6 * s);
	ctx.lineTo(bx - 6 * s, by + 4 * s);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = '#e6d6ad';
	ctx.lineWidth = Math.max(1, s);
	ctx.beginPath();
	ctx.moveTo(bx, by - 2.4 * s);
	ctx.lineTo(bx, by + 5.6 * s);
	ctx.stroke();
	if (n > 1) {
		ctx.fillStyle = '#2a1c10';
		ctx.font = mapFont(s); // the count scales whole with its tab
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(String(n), x + 8 * s, by + 0.5 * s);
	}
	ctx.restore();
}
let vy = 0; // the map is full screen; the view centres on the band between the top pills and the bottom ones
/* fit() is in 32-frame.js: it reads the page's bars */
let bandH = 0; // the height of the clear band between the top bars and the jobs (fit sets it)
function clampCam() {
	// in the land's frame (preview 51), where the land is a square the screen sees upright: its edges may come up to the bars and RIM past them
	// (the sea and the cliffs fill what is left), never further (Albert, Build 40)
	const hw = cw / 2 / cam.z,
		half = (bandH || ch) / 2 / (cam.z * TILT),
		l = landXY(cam.x, cam.y),
		lx = clamp(l.x, Math.min(hw - RIM, LMID), Math.max(SQUARE - hw + RIM, LMID)),
		ly = clamp(l.y, Math.min(half - RIM, LMID), Math.max(SQUARE - half + RIM, LMID)),
		w = worldXY(lx, ly);
	cam.x = w.x;
	cam.y = w.y;
}
// The camera glides as a critically damped spring (ζ = 1, no overshoot; the standard smoothing of a value toward a target, one ω for every
// phone whatever its frame rate). camGo sets the target; the frame moves the camera. One home for every glide: Follow, Home, the small map,
// a card's "go there", an alert. A drag or a pinch is yours and stops it.
const spring = (x, v, target, w, dt) => {
	const e = Math.exp(-w * dt),
		dx = x - target,
		t = (v + w * dx) * dt;
	return [target + (dx + t) * e, (v - w * t) * e];
};
const CAM_W = 9; // ω: the glide is over in about 4/ω s, half a second
function camGo(x, y) {
	cam.tx = x;
	cam.ty = y;
	if (still()) {
		cam.x = x;
		cam.y = y;
		camStop();
		clampCam();
	}
}
function camStop() {
	cam.tx = cam.ty = undefined;
	cam.vx = cam.vy = 0;
}
// Follow (the pick bar): the target is the middle of what is picked, until you drag, pinch or tap the small map, or let go of them
function followCam(dt) {
	if (G.follow) {
		const P = picked();
		if (!P.length) G.follow = false;
		else {
			let x = 0,
				y = 0;
			for (const u of P) {
				x += u.x;
				y += u.y;
			}
			cam.tx = x / P.length;
			cam.ty = y / P.length;
		}
	}
	if (cam.tx === undefined) return;
	[cam.x, cam.vx] = spring(cam.x, cam.vx || 0, cam.tx, CAM_W, dt);
	[cam.y, cam.vy] = spring(cam.y, cam.vy || 0, cam.ty, CAM_W, dt);
	clampCam();
	if (!G.follow && Math.abs(cam.x - cam.tx) < 0.3 && Math.abs(cam.y - cam.ty) < 0.3) camStop();
}
// The turned view (preview 50; one angle since preview 54, VIEW.angle in 01): a world point goes to the screen by u = x·cos − y·sin across
// and v = x·sin + y·cos down (TC, TS), scaled by the zoom; v is squashed by TILT; a height h stands straight up, unsquashed. DX and DY turn
// a world offset into a screen offset. wmat is the same map as a canvas matrix, for anything drawn flat on the ground in world units (the
// ground's pictures, the fog, a footprint): set it, draw in world units, then flat puts the plain one back.
const SX = (x, y = 0) => ((x - cam.x) * TC - (y - cam.y) * TS) * cam.z + cw / 2;
const SY = (y, h, x = 0) => ((x - cam.x) * TS + (y - cam.y) * TC) * cam.z * TILT + ch / 2 + vy - (h || 0) * cam.z;
const DX = (dx, dy) => (dx * TC - dy * TS) * cam.z,
	DY = (dx, dy) => (dx * TS + dy * TC) * cam.z * TILT;
const toWorld = (sx, sy) => {
	const u = (sx - cw / 2) / cam.z,
		v = (sy - ch / 2 - vy) / (cam.z * TILT);
	return { x: cam.x + u * TC + v * TS, y: cam.y - u * TS + v * TC };
};
const dWorld = (sdx, sdy) => {
	const du = sdx / cam.z,
		dv = sdy / (cam.z * TILT);
	return { x: du * TC + dv * TS, y: -du * TS + dv * TC };
}; // a screen drag as a world move
const wmat = (c = ctx) => c.setTransform(dpr * cam.z * TC, dpr * cam.z * TS * TILT, -dpr * cam.z * TS, dpr * cam.z * TC * TILT, dpr * SX(0, 0), dpr * SY(0, 0, 0));
const flat = (c = ctx) => c.setTransform(dpr, 0, 0, dpr, 0, 0);
// the world box the screen sees: the four screen corners turned back; margin m in world units
function viewBox(m = 0) {
	const P = [toWorld(0, 0), toWorld(cw, 0), toWorld(0, ch), toWorld(cw, ch)];
	return { x0: Math.min(...P.map((p) => p.x)) - m, y0: Math.min(...P.map((p) => p.y)) - m, x1: Math.max(...P.map((p) => p.x)) + m, y1: Math.max(...P.map((p) => p.y)) + m };
}
// a world rectangle flat on the ground, filled (or stroked) under the turned matrix: a footprint, a cell, a wall's square
function wrect(x, y, w, h, stroke) {
	wmat();
	if (stroke) {
		ctx.lineWidth = 1 / cam.z;
		ctx.strokeRect(x, y, w, h);
	} else ctx.fillRect(x, y, w, h);
	flat();
}
const landMat = (c) => c.transform(TC, -TS, TS, TC, MID - LMID * (TC + TS), MID - LMID * (TC - TS)); // the land's frame on a canvas already in world units (preview 51): a land point turned −angle about the centre
const minZ = () => Math.min(cw / SQUARE, ch / (SQUARE * TILT)) || 0.2; // the land stands square on the screen: SQUARE wide, SQUARE × TILT tall at zoom 1
function zoomAt(nz, sx, sy) {
	const w = toWorld(sx, sy);
	cam.z = clamp(nz, minZ(), ZOOM_MAX);
	const d = dWorld(sx - cw / 2, sy - ch / 2 - vy);
	cam.x = w.x - d.x;
	cam.y = w.y - d.y;
	clampCam();
}
const quant = (v) => {
	for (const s of SCALES) if (s >= v) return s;
	return SCALES[SCALES.length - 1];
};
// ═════ 21-view-frame.js: the ground texture and the draw of one frame ═════
// the ground: one soft picture at half detail for the big shapes, a sharp grass texture over it when you are close
function makeBg() {
	const N = MAP * bgK;
	bg = document.createElement('canvas');
	bg.width = bg.height = N;
	const b = bg.getContext('2d');
	b.scale(bgK, bgK);
	const R = (a, z) => a + lookDice() * (z - a);
	b.save();
	landMat(b);
	b.beginPath();
	b.rect(0, 0, SQUARE, SQUARE);
	b.restore();
	b.save();
	b.clip(); // the land's square, turned: everything painted for the land stays on it (preview 51)
	b.fillStyle = '#4a6634';
	b.fillRect(0, 0, MAP, MAP);
	const blot = (n, cols, r0, r1) => {
		for (let i = 0; i < n; i++) {
			b.fillStyle = cols[i % cols.length];
			b.beginPath();
			b.ellipse(lookDice() * MAP, lookDice() * MAP, R(r0, r1), R(r0, r1) * 0.7, R(0, 3), 0, 7);
			b.fill();
		}
	};
	blot(1400, ['rgba(88,124,56,.22)', 'rgba(52,78,38,.22)', 'rgba(104,128,60,.16)'], 20, 90);
	b.fillStyle = 'rgba(30,42,22,.22)';
	for (const n of G.nodes)
		if (n.kind === 'tree') {
			b.beginPath();
			b.ellipse(n.x + 2, n.y + 3, TREE.floor[0], TREE.floor[1], 0, 0, 7);
			b.fill();
		} // the floor of a wood is darker, needles and leaf litter, and stays when the trees are cut (Build 52)
	blot(220, ['rgba(122,100,62,.16)', 'rgba(140,118,76,.12)'], 10, 34);
	for (let i = 0; i < 500; i++) {
		b.fillStyle = lookDice() < 0.5 ? 'rgba(230,220,120,.5)' : 'rgba(235,235,245,.45)';
		b.beginPath();
		b.arc(lookDice() * MAP, lookDice() * MAP, 2.4, 0, 7);
		b.fill();
	}
	// A river is drawn as one stream (Build 53): each unbroken run of pools is a smooth curve through their centres, stroked three times
	// (the outer bank, the inner bank, the water) with round ends, so it leaves its lake and reaches a ford as one body of water. The pools
	// themselves stay the walking grid's truth; the curve through their centres covers the same ground (a pool every 0.9 of its radius).
	const runs = riverRuns(); // each stretch of river (its pools between two fords), from the water layer
	const stream = (run, extra, col) => {
		b.strokeStyle = col;
		b.lineWidth = 2 * (run[0].r + extra);
		b.lineCap = b.lineJoin = 'round';
		b.beginPath();
		b.moveTo(run[0].x, run[0].y);
		for (let i = 1; i < run.length; i++) {
			const p = run[i - 1],
				q = run[i];
			if (i < run.length - 1) b.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
			else b.lineTo(q.x, q.y);
		}
		b.stroke();
	};
	for (const L of G.lakes) {
		if (L.river) continue;
		const sand = b.createRadialGradient(L.x, L.y, L.r - 4, L.x, L.y, L.r * (1 + WATER.amp) + 26);
		sand.addColorStop(0, 'rgba(206,190,138,1)');
		sand.addColorStop(0.5, 'rgba(196,180,128,.85)');
		sand.addColorStop(1, 'rgba(196,180,128,0)');
		b.fillStyle = sand;
		shorePath(b, L, 26);
		b.fill();
	} // every shore first, then every water
	for (const run of runs) {
		stream(run, 14, 'rgba(196,180,128,.55)');
		stream(run, 7, 'rgba(201,185,133,.9)');
	}
	// the water, lake and river alike (Build 61: the river was one flat blue and met the lake's shaded edge in a hard line): the shallows pale
	// at the bank, the deep dark in the middle; a river is drawn as three strokes, bank, shallow, channel, in the lake's own colours
	for (const run of runs) stream(run, 2, '#79b2bf');
	for (const run of runs) stream(run, -2, '#4e93ad');
	for (const run of runs) stream(run, -5, '#2a6488');
	for (const L of G.lakes) {
		if (L.river) continue;
		const lg = b.createRadialGradient(L.x - L.r * 0.2, L.y - L.r * 0.2, 10, L.x, L.y, L.r * (1 + WATER.amp * 0.6) + 2);
		lg.addColorStop(0, '#1b4466');
		lg.addColorStop(0.7, '#2a6488');
		lg.addColorStop(0.95, '#4e93ad');
		lg.addColorStop(1, '#79b2bf');
		b.fillStyle = lg;
		shorePath(b, L, 2);
		b.fill();
		b.strokeStyle = '#79b2bf';
		b.lineWidth = 3;
		b.stroke(); // the shallows follow the shore's bays, not the gradient's circle
	}
	for (const run of runs) {
		// where a river leaves its lake, the lake's shade covers the join
		const L = run[0];
		if (!L.river) continue;
		const src = G.lakes[L.src]; // the lake it leaves (makeRiver)
		if (!src || L.run) continue; // only the first stretch leaves the lake
		const lg = b.createRadialGradient(src.x, src.y, src.r - 6, src.x, src.y, src.r + 14);
		lg.addColorStop(0, '#2a6488');
		lg.addColorStop(1, 'rgba(42,100,136,0)');
		b.fillStyle = lg;
		b.beginPath();
		b.arc(src.x, src.y, src.r + 14, 0, 7);
		b.fill();
	}
	{
		b.save();
		landMat(b); // the island and the causeways lie on the land's middle lines (preview 51)
		const L = LAKE0,
			R = THRONE.isle,
			W = THRONE.cause; // the Throne's island and its four causeways: stone over the water, the shape the walking grid holds (onLand: isle, cause, causeTo), with a sand edge of 10 round the island and 4 each side of a causeway
		b.fillStyle = 'rgba(206,190,138,1)';
		b.beginPath();
		b.arc(L.x, L.y, R + 10, 0, 7);
		b.fill();
		for (const [dx, dy] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		]) {
			const len = THRONE.causeTo;
			b.fillStyle = '#9a917e';
			b.fillRect(
				L.x + (dx < 0 ? -len : dy ? -W / 2 - 4 : 0),
				L.y + (dy < 0 ? -len : dx ? -W / 2 - 4 : 0),
				dx ? len : W + 8,
				dy ? len : W + 8,
			);
		}
		const pv = b.createRadialGradient(L.x, L.y, 20, L.x, L.y, R);
		pv.addColorStop(0, '#b8ad98');
		pv.addColorStop(1, '#8f8775');
		b.fillStyle = pv;
		b.beginPath();
		b.arc(L.x, L.y, R, 0, 7);
		b.fill();
		b.strokeStyle = 'rgba(60,50,40,.25)';
		b.lineWidth = 1;
		for (let i = -R; i <= R; i += 12) {
			b.beginPath();
			b.moveTo(L.x - R, L.y + i);
			b.lineTo(L.x + R, L.y + i);
			b.stroke();
			b.beginPath();
			b.moveTo(L.x + i, L.y - R);
			b.lineTo(L.x + i, L.y + R);
			b.stroke();
		}
		b.restore();
	}
	// the old trade roads: a worn dirt track through each route's stops, bending round the great lake (drawn once, into the ground)
	b.lineCap = 'round';
	b.lineJoin = 'round';
	for (const r of ROUTES) {
		const [a, c, d, e] = r.map(([x, y]) => ({ x, y })),
			vert = a.x === c.x,
			bend = 2 * (LAKE0.r + 70),
			m1 = vert ? { x: MID - bend, y: MID } : { x: MID, y: MID - bend }; // a quadratic's middle sits halfway to its control point: twice the clearance
		const path = () => {
			b.beginPath();
			b.moveTo(a.x, a.y);
			b.lineTo(c.x, c.y);
			b.quadraticCurveTo(m1.x + (vert ? -40 : 0), m1.y + (vert ? 0 : -40), d.x, d.y);
			b.lineTo(e.x, e.y);
		};
		for (const [w, col] of [
			[14, 'rgba(120,96,58,.35)'],
			[8, 'rgba(150,124,78,.45)'],
			[3, 'rgba(96,74,44,.35)'],
		]) {
			b.strokeStyle = col;
			b.lineWidth = w;
			b.setLineDash(w === 3 ? [10, 14] : []);
			path();
			b.stroke();
		}
		b.setLineDash([]);
	}
	b.restore(); // the land's clip
	{
		// outside the land (preview 51): every walking square whose middle is off the land, painted by which edge it lies past: the sea beyond the
		// near edges (the land's south and east, the screen's bottom and right), the cliffs beyond the far; a strand of sand one square wide
		// along the shore. Square by square, so the edge is the sawtooth of the diagonal squares (Albert's picture)
		for (let gy = 0; gy < NC; gy++)
			for (let gx = 0; gx < NC; gx++) {
				const x = gx * NAVC,
					y = gy * NAVC,
					l = landXY(x + 5, y + 5);
				if (l.x >= 0 && l.y >= 0 && l.x <= SQUARE && l.y <= SQUARE) continue;
				const sea = l.x > SQUARE || l.y > SQUARE,
					near = sea && l.x < SQUARE + 12 && l.y < SQUARE + 12;
				if (!near) continue; // the sea and, past the far edges, the cliff face and its plateau are the frame's (drawRim); only the strand is painted here, one square wide, the sawtooth
				b.fillStyle = '#cdbb88';
				b.fillRect(x, y, NAVC, NAVC);
			}
	}
	terrainMini = document.createElement('canvas');
	terrainMini.width = terrainMini.height = 172;
	terrainMini.getContext('2d').drawImage(bg, 0, 0, 172, 172);
	// a 64-unit square of grass blades, repeated
	const t = document.createElement('canvas');
	t.width = t.height = 128;
	const q = t.getContext('2d');
	q.lineCap = 'round';
	for (let i = 0; i < 260; i++) {
		const x = lookDice() * 128,
			y = lookDice() * 128;
		q.strokeStyle = lookDice() < 0.5 ? 'rgba(28,48,22,.42)' : 'rgba(140,170,90,.32)';
		q.lineWidth = 1.4;
		q.beginPath();
		q.moveTo(x, y);
		q.lineTo(x + R(-2, 2), y - R(3, 7));
		q.stroke();
	}
	grassPat = ctx.createPattern(t, 'repeat');
}
let SPARKS = [],
	miniT = 0;
// The rim (preview 50, Albert: "I wanted water and cliffs and sky anyway"): the screen is a rectangle and the map a diamond, so when the view
// meets an edge the corners show what lies beyond. The near sides (south and east, the bottom of the screen) are the sea with a strand; the
// far sides (north and west, the top) are cliffs, and above the cliffs the sky. Drawn in world units under the turned matrix, RIM deep.
const RIMC = { sea: '#2f6684', deep: '#214a63', sand: '#cdbb88', cliff: '#4f463d', cliffLit: '#847566', top: '#5e6a4e', skyLo: '#b9cad6', skyHi: '#6b93b4' },
	CLIFF_H = 140; // the far edges rise this much above the map
function drawRim(z) {
	const VB = viewBox(),
		on = (x, y) => inLand(x, y);
	if (on(VB.x0, VB.y0) && on(VB.x1, VB.y0) && on(VB.x0, VB.y1) && on(VB.x1, VB.y1)) return; // the whole screen is on the land
	// a land point on the screen, h up; the land's edges: north and west at the top and left of the screen (the cliffs), south and east at the
	// bottom and right (the sea). The ground's picture already paints the sawtooth band beside each edge; this is what lies beyond the array
	const c = (lx, ly, h = 0) => {
			const w = worldXY(lx, ly);
			return [SX(w.x, w.y), SY(w.y, h, w.x)];
		},
		poly = (pts, fill) => {
			ctx.beginPath();
			pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
			ctx.closePath();
			ctx.fillStyle = fill;
			ctx.fill();
		},
		S = SQUARE,
		R = RIM,
		H = CLIFF_H;
	const g = ctx.createLinearGradient(0, 0, 0, ch);
	g.addColorStop(0, RIMC.skyHi);
	g.addColorStop(1, RIMC.skyLo);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, cw, ch);
	poly([c(-3 * R, S), c(S + 3 * R, S), c(S + 3 * R, S + 3 * R), c(-3 * R, S + 3 * R)], RIMC.sea); // the sea south, to the horizon
	poly([c(S, -R), c(S + 3 * R, -R), c(S + 3 * R, S + 3 * R), c(S, S + 3 * R)], RIMC.sea); // and east
	poly([c(-3 * R, S + 180), c(S + 3 * R, S + 180), c(S + 3 * R, S + 3 * R), c(-3 * R, S + 3 * R)], RIMC.deep); // deeper water farther out
	poly([c(S + 180, -R), c(S + 3 * R, -R), c(S + 3 * R, S + 3 * R), c(S + 180, S + 3 * R)], RIMC.deep);
	poly([c(-R, -R, H), c(S, -R, H), c(S, 0, H), c(0, 0, H), c(0, S, H), c(-R, S, H)], RIMC.top); // the plateau north and west, H up
	poly([c(0, 0, 0), c(S, 0, 0), c(S, 0, H), c(0, 0, H)], RIMC.cliffLit); // the north face, lit (it faces the sun)
	poly([c(0, 0, 0), c(0, S, 0), c(0, S, H), c(0, 0, H)], RIMC.cliff); // the west face, in shade
}
function draw() {
	followCam(Math.min(0.1, (performance.now() - (draw.last || performance.now())) / 1000));
	draw.last = performance.now();
	shadeFrame();
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	const z = cam.z,
		x0 = SX(0, 0),
		y0 = SY(0, 0, 0),
		sn = season();
	drawRim(z); // beyond the map's edge: the sea, the cliffs and the sky (preview 50); the map itself is painted over in full
	ctx.imageSmoothingEnabled = true;
	const VB = viewBox(),
		layer = (img) => {
			// the picture of the land, drawn in world units under the turned matrix: the canvas turns it (preview 50)
			const sx0 = clamp(VB.x0, 0, MAP),
				sy0 = clamp(VB.y0, 0, MAP),
				sx1 = clamp(VB.x1, 0, MAP),
				sy1 = clamp(VB.y1, 0, MAP);
			if (sx1 > sx0 && sy1 > sy0) {
				wmat();
				ctx.drawImage(img, sx0 * bgK, sy0 * bgK, (sx1 - sx0) * bgK, (sy1 - sy0) * bgK, sx0, sy0, sx1 - sx0, sy1 - sy0);
				flat();
			}
		};
	layer(bg);
	if (z > 1.1 && grassPat) {
		if (grassM.a !== 0.5) {
			grassM.a = 0.5;
			grassM.d = 0.5; // the tufts in world units: the matrix turns and squashes them with the ground
			grassPat.setTransform(grassM);
		}
		ctx.globalAlpha = Math.min(1, (z - 1.1) * 1.5);
		ctx.fillStyle = grassPat;
		wrect(0, 0, MAP, MAP);
		ctx.globalAlpha = 1;
	}
	if (G.shake > G.t && !still()) {
		const k = (G.shake - G.t) * 3;
		ctx.translate(rnd2() * k, rnd2() * k);
	} // a sinkhole or a falling star: the whole view judders for a moment
	if (G.jolt > G.t && !still()) ctx.translate(rnd2() * JUICE.jolt, rnd2() * JUICE.jolt); // a charge landing on screen: a jolt (the juice pass)
	layer(scarCv);
	drawFlood(z);
	drawSand(z);
	drawLakeRipples(z);
	if (sn.tint) {
		ctx.fillStyle = sn.tint;
		wrect(0, 0, MAP, MAP);
	}
	if (DRAW.lvl < 1) drawRainRings(z);
	drawGround(); // the weather's mark on the land, under everything standing
	drawPicks(z); // the pick rings lie on the ground, under the figure and the building (Albert, Build 40)
	// everything standing, back to front
	// what is on screen: margins in world units, wide enough for the widest building (its turned east wall) and the tallest (a wonder, standing just below the edge)
	const mx = Math.max(160 / z, 115),
		wv = { x: VB.x0 - mx, y: VB.y0 - mx },
		wv2 = { x: VB.x1 + mx, y: VB.y1 + mx },
		inView = (e) => e.x > wv.x && e.x < wv2.x && e.y > wv.y && e.y < wv2.y;
	const list = []; // back to front: by x + y, the screen's down axis in the turned view (preview 50)
	for (const b of G.blds)
		if (inView(b) && trapShown(b) && knownB(b)) list.push([b.x + b.y + (BLD[b.kind].crop ? -120 : halfOf(b) * 0.8), 1, b]);
	const far = z < 0.55;
	if (far) layer(forestLayer()); // zoomed out, the forest is one picture; close in, each tree
	for (const f of G.finds) if (inView(f) && !(f.done && FINDS[f.kind].got)) list.push([f.x + f.y, 3, f]);
	for (const u of G.units) if (!u.inside && inView(u) && visibleTo0(u)) list.push([u.x + u.y, 2, u]);
	{
		const now = performance.now();
		while (FALL.length && now - FALL[0].t > 1400) FALL.shift();
		for (const f of FALL) if (inView(f)) list.push([f.x + f.y, 4, f]);
	}
	list.sort((a, b) => a[0] - b[0]);
	const N = viewNodes(wv, wv2, far),
		sB = quant(z * dpr),
		sU = quant(z * dpr * FIG);
	sunShadows(N, list, z, far); // every sun shadow, one path, on the ground under everything standing (the trees' are the first shed under load)
	// the standing nodes (about 2,000 trees, bushes and rocks) are kept sorted until the view moves a step; the few moving things are merged in
	for (let i = 0, j = 0; i < N.length || j < list.length; ) {
		const take = j >= list.length || (i < N.length && N[i].x + N[i].y < list[j][0]),
			e = take ? N[i++] : list[j][2],
			t = take ? 0 : list[j++][1];
		try {
			t === 0
				? drawNode(e, sB)
				: t === 1
					? drawBld(e, sB)
					: t === 2
						? e.hid
							? ((ctx.globalAlpha = 0.55), drawUnit(e, sU), (ctx.globalAlpha = 1), leavesOver(e)) // in ambush: half seen under a few leaves, so you know where they lie
							: drawUnit(e, sU)
						: t === 4
							? drawFallen(e, sU)
							: drawFind(e);
		} catch (er) {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = 'source-over';
			ctx.setLineDash([]);
			fault(er);
		} // one bad piece must never take the rest of the picture with it: the canvas is put back as it was
	}
	drawFire(z, inView);
	drawStandards(z, inView);
	drawFogLayer(z);
	sparkDraw();
	ripDraw();
	drawEvents(z);
	drawOrders(z);
	drawReticle();
	if (G.rally0) flagAt(SX(G.rally0.x, G.rally0.y), SY(G.rally0.y, 0, G.rally0.x), G.P[0].color, z);
	drawTracers();
	drawLight(z, inView);
	drawHitGlow();
	drawFlash();
	drawSky();
	drawWeather();
	drawRadar(wv, wv2);
	drawTouch(z);
	drawGhost();
	{
		const now = performance.now();
		if (G.hud.page === 'war' && now - miniT > 150) {
			miniT = now;
			drawMini();
		}
	} // the map corner needs no more than seven looks a second
}
// ═════ 22-view-fog.js: the minimap and the fog of war ═════
// Enemy soldiers close to your Town Center but off screen: a red marker on the edge, pointing at them. Tap it to look. Only what your people
// see (Build 60: it showed armies in the fog, with their number; you cannot have alerts you cannot see or hear, Albert)
let RADAR = null;
function drawRadar(wv, wv2) {
	RADAR = null;
	const k = keepOf(0);
	if (!k || G.over) return;
	let near = null,
		nd = Infinity; // the nearest foe within 520 of your Town Center, or any army marching on you, however far
	for (const u of G.sol || []) {
		if (u.owner === 0 || u.owner === WILD || u.hp <= 0 || u.inside || !atWar(0, u.owner) || !visibleTo0(u)) continue;
		const d = dist(u, k);
		if (
			(d < 520 || (u.state === 'attack' && u.target === 0)) &&
			d < nd &&
			!(u.x > wv.x + 40 && u.x < wv2.x - 40 && u.y > wv.y + 40 && u.y < wv2.y - 40)
		) {
			nd = d;
			near = u;
		}
	}
	if (!near) return;
	let n = 0;
	for (const u of G.sol || []) if (u.owner === near.owner && u.hp > 0 && dist(u, near) < 150 && visibleTo0(u)) n++;
	const px = SX(near.x, near.y),
		py = SY(near.y, 0, near.x),
		dx = px - cw / 2,
		dy = py - ch / 2,
		m = 30,
		sc = Math.min(
			(dx < 0 ? cw / 2 - m : cw / 2 - 84) / (Math.abs(dx) || 1),
			(dy < 0 ? ch / 2 - m - (dx > 0 ? 80 : 0) : ch / 2 - m - 40) / (Math.abs(dy) || 1),
		),
		rx = cw / 2 + dx * sc,
		ry = ch / 2 + dy * sc,
		a = Math.atan2(dy, dx),
		pulse = still() ? 0 : Math.sin(G.t * 6) * 2;
	RADAR = { sx: rx, sy: ry, x: near.x, y: near.y };
	ctx.save();
	ctx.translate(rx, ry);
	ctx.fillStyle = 'rgba(190,40,30,.92)';
	ctx.strokeStyle = '#ffd9d0';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(0, 0, 15 + pulse, 0, 7);
	ctx.fill();
	ctx.stroke();
	ctx.rotate(a);
	ctx.fillStyle = '#ffd9d0';
	ctx.beginPath();
	ctx.moveTo(24 + pulse, 0);
	ctx.lineTo(16, -6);
	ctx.lineTo(16, 6);
	ctx.closePath();
	ctx.fill();
	ctx.rotate(-a);
	ctx.fillStyle = '#fff';
	ctx.font = mapFont(); // pinned to the screen
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(String(n), 0, 0);
	ctx.restore();
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
}
const hg = [];
// an enemy spy shows only when something of yours is close enough to see it
// Fog of war, yours alone (the computers play without it, as the doc says): what your people and towers see now is lit; what they saw stays, dim; the rest is dark.
const fogAt = (x, y) => G.fog[clamp((y / FOG) | 0, 0, FOGN - 1) * FOGN + clamp((x / FOG) | 0, 0, FOGN - 1)];
const seen0 = (e) => !G.fogOn || friendly(0, e.owner) || fogAt(e.x, e.y) === 2; // in your sight now, or yours
const known0 = (e) => !G.fogOn || friendly(0, e.owner) || fogAt(e.x, e.y) > 0; // ever seen: a find you found stays on the map
const knownB = (b) => !G.fogOn || friendly(0, b.owner) || fogAt(b.x, b.y) === 2 || !!G.seenB[b.id]; // a building shows where you see it now, or where you once saw it (Build 51: one put up in ground you had only explored showed without anyone seeing it)
const visibleTo0 = (u) => (u.kind !== 'spy' || friendly(0, u.owner) || u.exposed) && seen0(u);
let fogCv = null,
	fogImg = null;
// the woods block sight (Build 61, Albert: lifelike lines of sight): a fog square holding three or more standing trees is a wall of canopy;
// you see the square itself, the edge of the wood, and nothing behind it on that line. Rebuilt when a tree falls or grows.
let WOODS = { v: -1, G: null, grid: null };
function woodsGrid() {
	if (WOODS.G === G && WOODS.v === G.treeV) return WOODS.grid;
	const grid = new Uint8Array(FOGN * FOGN),
		n = new Uint8Array(FOGN * FOGN);
	for (const t of G.nodes)
		if (t.kind === 'tree' && t.amt > 0)
			n[clamp((t.y / FOG) | 0, 0, FOGN - 1) * FOGN + clamp((t.x / FOG) | 0, 0, FOGN - 1)]++;
	for (let i = 0; i < n.length; i++) grid[i] = n[i] >= 3 ? 1 : 0;
	WOODS = { v: G.treeV, G, grid };
	return grid;
}
// is the square (gx, gy) in open sight of the square (sx, sy)? a line on the grid (Bresenham); the first wood on the way is seen, the rest is not
function openLine(W, sx, sy, gx, gy) {
	let x = sx,
		y = sy;
	const dx = Math.abs(gx - sx),
		dy = -Math.abs(gy - sy),
		ix = sx < gx ? 1 : -1,
		iy = sy < gy ? 1 : -1;
	let err = dx + dy;
	for (;;) {
		if (x === gx && y === gy) return true;
		if ((x !== sx || y !== sy) && W[y * FOGN + x]) return false; // a wood between: the viewer's own square never blocks
		const e2 = 2 * err;
		if (e2 >= dy) {
			err += dy;
			x += ix;
		}
		if (e2 <= dx) {
			err += dx;
			y += iy;
		}
	}
}
function fogTick() {
	// every ten ticks: what is lit now
	const F = G.fog,
		W = woodsGrid();
	for (let i = 0; i < F.length; i++) if (F[i] === 2) F[i] = 1;
	const light = (x, y, r) => {
		const c = r / FOG + 0.5,
			cx = x / FOG,
			cy = y / FOG,
			sx = clamp(cx | 0, 0, FOGN - 1),
			sy = clamp(cy | 0, 0, FOGN - 1),
			x0 = clamp((cx - c) | 0, 0, FOGN - 1),
			x1 = clamp((cx + c) | 0, 0, FOGN - 1),
			y0 = clamp((cy - c) | 0, 0, FOGN - 1),
			y1 = clamp((cy + c) | 0, 0, FOGN - 1);
		for (let gy = y0; gy <= y1; gy++)
			for (let gx = x0; gx <= x1; gx++)
				if (hyp(gx + 0.5 - cx, gy + 0.5 - cy) <= c && openLine(W, sx, sy, gx, gy)) F[gy * FOGN + gx] = 2;
	};
	for (const u of G.units) if (u.hp > 0 && friendly(0, u.owner) && !u.inside) light(u.x, u.y, sightOf(u));
	for (const b of G.blds) if (b.hp > 0 && b.prog >= 1 && friendly(0, b.owner)) light(b.x, b.y, sightOf(b)); // from its height, after research, by day or night (Build 51: a flat 90 for most)
	for (const b of G.blds)
		if (b.hp > 0 && !friendly(0, b.owner) && !G.seenB[b.id] && fogAt(b.x, b.y) === 2) {
			G.seenB[b.id] = 1;
			if (b.prog >= 1) wearGround(b);
		} // what your people and towers have seen, remembered, and the ground round it
}
let fogOff = null;
function fogLayer() {
	// the fog as one small picture, drawn soft over the world
	if (!fogCv) {
		fogCv = document.createElement('canvas');
		fogCv.width = fogCv.height = FOGN;
		fogImg = fogCv.getContext('2d').createImageData(FOGN, FOGN);
	}
	const d = fogImg.data,
		F = G.fog;
	if (!fogOff || fogOff.length !== F.length) {
		// off the land (preview 51): the sea and the cliffs are never fogged
		fogOff = new Uint8Array(F.length);
		for (let i = 0; i < F.length; i++) fogOff[i] = inLand((i % FOGN) * 40 + 20, Math.floor(i / FOGN) * 40 + 20, -30) ? 0 : 1;
	}
	for (let i = 0; i < F.length; i++) {
		d[i * 4] = 8;
		d[i * 4 + 1] = 12;
		d[i * 4 + 2] = 10;
		d[i * 4 + 3] = fogOff[i] || F[i] === 2 ? 0 : F[i] === 1 ? 110 : 235;
	}
	fogCv.getContext('2d').putImageData(fogImg, 0, 0);
	return fogCv;
}
function stamp(c, sx, sy, k, flip) {
	if (flip) {
		ctx.save();
		ctx.translate(sx, sy);
		ctx.scale(-1, 1);
		ctx.drawImage(c, -c.ax * k, -c.ay * k, c.width * k, c.height * k);
		ctx.restore();
	} else ctx.drawImage(c, sx - c.ax * k, sy - c.ay * k, c.width * k, c.height * k);
}
const trapShown = (b) => !BLD[b.kind].trap || b.owner === 0 || friendly(0, b.owner) || (b.seen && b.seen[0]); // a hidden trap shows only to its side, its allies, and a side whose scout found it
// ═════ 23-view-things.js: buildings, smoke and fire, ripples and sparks, nodes, units, finds ═════
// The wall mold (preview 50, Albert: "this solves the wall heft problems"): a wall, a gate or a palisade is not a stamped picture but a box
// drawn in place on the turned ground: its top (a diamond, lit), its two near faces (south toward the screen's lower left, east toward the
// lower right, the east in shade), and merlons along the top of each open face. A face shared with a wallish neighbour is not drawn, so a
// run of walls reads as one wall; the sort by x + y lays them back to front. Three colours a kind, one shape for all.
const WALL_LOOK = {
	wall: { top: '#b5b0a3', s: '#a29d90', e: '#7d786d', merlon: true },
	gate: { top: '#9a7a52', s: '#8a6a44', e: '#5a3a1c', door: true },
	palisade: { top: '#9a7a52', s: '#8a6a44', e: '#5f4324', spike: true },
};
let WALL_KEYS = new Set(),
	wallKeysAt = -1;
const wkey = (x, y) => `${Math.round(x / NAVC)},${Math.round(y / NAVC)}`;
function wallKeys() {
	if (wallKeysAt === G.tick) return WALL_KEYS;
	wallKeysAt = G.tick;
	WALL_KEYS = new Set();
	for (const b of G.blds) if (b.hp > 0 && b.prog >= 1 && WALL_LOOK[b.kind]) WALL_KEYS.add(wkey(b.x, b.y));
	return WALL_KEYS;
}
function drawWallBox(b) {
	const L = WALL_LOOK[b.kind],
		K = wallKeys(),
		H = BLD[b.kind].h * Math.min(1, Math.max(0.15, b.prog)),
		x0 = b.x - 5,
		x1 = b.x + 5,
		y0 = b.y - 5,
		y1 = b.y + 5,
		c = (x, y, h = 0) => [SX(x, y), SY(y, h, x)],
		poly = (pts, fill) => {
			ctx.beginPath();
			pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
			ctx.closePath();
			ctx.fillStyle = fill;
			ctx.fill();
		},
		openS = !K.has(wkey(b.x, b.y + NAVC)), // nothing wallish south: that face shows
		openE = !K.has(wkey(b.x + NAVC, b.y)),
		z = cam.z;
	if (openS) poly([c(x0, y1), c(x1, y1), c(x1, y1, H), c(x0, y1, H)], L.s);
	if (openE) poly([c(x1, y0), c(x1, y1), c(x1, y1, H), c(x1, y0, H)], L.e);
	poly([c(x0, y0, H), c(x1, y0, H), c(x1, y1, H), c(x0, y1, H)], L.top);
	if (L.merlon && z > 0.7) {
		// merlons: two on each open face's top edge, and the walk's parapet line
		const m = 3;
		ctx.fillStyle = L.top;
		if (openS) for (const t of [0.15, 0.6]) poly([c(x0 + 10 * t, y1, H), c(x0 + 10 * t + 2.5, y1, H), c(x0 + 10 * t + 2.5, y1, H + m), c(x0 + 10 * t, y1, H + m)], L.s);
		if (openE) for (const t of [0.15, 0.6]) poly([c(x1, y0 + 10 * t, H), c(x1, y0 + 10 * t + 2.5, H), c(x1, y0 + 10 * t + 2.5, H + m), c(x1, y0 + 10 * t, H + m)], L.e);
	}
	if (L.door) {
		ctx.fillStyle = '#2a1a0a';
		if (openS) poly([c(b.x - 2.5, y1), c(b.x + 2.5, y1), c(b.x + 2.5, y1, H * 0.7), c(b.x - 2.5, y1, H * 0.7)], '#2a1a0a');
		if (openE) poly([c(x1, b.y - 2.5), c(x1, b.y + 2.5), c(x1, b.y + 2.5, H * 0.7), c(x1, b.y - 2.5, H * 0.7)], '#1e1208');
	}
	if (L.spike) {
		ctx.strokeStyle = '#3e2a14';
		ctx.lineWidth = Math.max(0.6, 0.5 * z);
		ctx.beginPath();
		for (const t of [0.2, 0.5, 0.8]) {
			const [ax, ay] = c(x0 + 10 * t, y1, H), [bx, by] = c(x0 + 10 * t, y1, H + 3);
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
		}
		ctx.stroke();
	}
	// the edge where the top meets the faces, faint, so the box reads
	ctx.strokeStyle = 'rgba(30,22,16,.35)';
	ctx.lineWidth = Math.max(0.5, 0.4 * z);
	ctx.beginPath();
	const [tx, ty] = c(x1, y1, H);
	if (openS) {
		const [ax, ay] = c(x0, y1, H);
		ctx.moveTo(ax, ay);
		ctx.lineTo(tx, ty);
	}
	if (openE) {
		const [ax, ay] = c(x1, y0, H);
		ctx.moveTo(ax, ay);
		ctx.lineTo(tx, ty);
	}
	ctx.stroke();
}
// The building mold (preview 53, Albert, Nov 4: "I just want to see the front of a building, the side, and the top. Do it in the cheapest
// way possible"): every standing building is the wall's box grown to its footprint and height: its two near faces (south lit, east in shade),
// a roof on top (a gable along the longer run, a flat top for towers and keeps, a canvas peak for tents), a door on the south face, windows
// on both, and the owner's pennant at the roof's end. One shape for every kind; BOX_LOOK says only the walls' and roof's stuff. The old
// pictures (ART, 19-building-art) stay behind the toggle SET.boxes (the Yard: "Old art") until Albert has seen the boxes and said which.
// Fields, pastures, traps and the rest that lie flat keep their pictures: a box is for a thing that stands.
const BOX_LOOK = {
	stone: { wall: STONE, roof: SLATE, form: 'gable' },
	plaster: { wall: PLASTER, roof: TILE, form: 'gable' },
	timber: { wall: PLANK, roof: THATCH, form: 'gable' },
	keep: { wall: STONE, roof: STONE, form: 'flat', merlon: true },
	tent: { wall: MUD, roof: PLASTER, form: 'peak' },
	of: {
		keep: 'keep', town: 'keep', castle: 'keep', tower: 'keep', throne: 'keep', camptower: 'keep', wonder: 'stone', hall: 'stone', council: 'stone',
		courthouse: 'stone', temple: 'stone', library: 'stone', baths: 'stone', hospital: 'stone', aqueduct: 'stone', mint: 'stone', foundry: 'stone', quarry: 'stone',
		mining: 'stone', smith: 'stone', house: 'plaster', apartment: 'plaster', school: 'plaster', theatre: 'plaster', tavern: 'plaster', market: 'plaster',
		barracks: 'timber', range: 'timber', stable: 'timber', lumber: 'timber', mill: 'timber', store: 'timber', workshop: 'timber', siege: 'timber', dock: 'timber',
		depot: 'timber', medtent: 'tent', traintent: 'tent', messtent: 'tent',
	},
};
const FLAT = { farm: 1, treefarm: 1, pasture: 1 }; // what lies on the ground: a plot, not a box (drawPlot)
const boxed = (b) => SET.boxes !== false && !!BOX_LOOK.of[b.kind] && !FLAT[b.kind];
const flat_ = (b) => SET.boxes !== false && !!FLAT[b.kind];
// The plot mold (preview 54, Albert: "if the land rotated, the buildings and pastures and EVERYTHING needs to rotate with it"): a field, an
// orchard or a pasture is drawn flat on the turned ground in world units (wmat), so it turns with the land: the soil, the rows along the
// plot (a field's crop by the season, an orchard's young trees, a pasture's grass and its sheep), a worn edge. A plot being made shows its
// soil alone, growing with the work.
function drawPlot(b) {
	const B = BLD[b.kind],
		half = (B.fp * NAVC) / 2,
		x0 = b.x - half,
		y0 = b.y - half,
		w = half * 2,
		sn = season().name,
		p = Math.min(1, Math.max(0.1, b.prog)),
		spent = b.spent || (b.node && b.node.amt <= 0),
		z = cam.z;
	wmat();
	ctx.fillStyle = b.kind === 'pasture' ? '#86ae5c' : '#7a5e36';
	ctx.fillRect(x0, y0, w, w);
	if (b.prog >= 1 && !spent) {
		if (b.kind === 'farm') {
			const crop = { Spring: '#8fb84a', Summer: '#e0c266', Autumn: '#d9a93e', Winter: '#a39a86' }[sn],
				dark = { Spring: '#5f8a2e', Summer: '#b8962e', Autumn: '#a67a22', Winter: '#7a7262' }[sn],
				rows = 7,
				rh = w / rows;
			for (let i = 0; i < rows; i++) {
				ctx.fillStyle = i % 2 ? crop : dark;
				ctx.fillRect(x0 + 1, y0 + i * rh + rh * 0.12, w - 2, rh * 0.76);
			}
		} else if (b.kind === 'treefarm') {
			ctx.fillStyle = '#3f6b2a';
			for (let j = 0; j < 3; j++)
				for (let i = 0; i < 3; i++) {
					ctx.beginPath();
					ctx.arc(x0 + ((i + 0.5) * w) / 3, y0 + ((j + 0.5) * w) / 3, w / 9, 0, 7);
					ctx.fill();
				}
		} else {
			ctx.fillStyle = '#5a8a3a';
			for (let i = 0; i < 14; i++) ctx.fillRect(x0 + ((i * 37) % w), y0 + ((i * 53) % w), 2, 3); // tufts
			ctx.fillStyle = '#f2efe6';
			for (let i = 0; i < (b.sheep || 0); i++) {
				ctx.beginPath();
				ctx.ellipse(x0 + 6 + ((i * 29) % (w - 12)), y0 + 6 + ((i * 17) % (w - 12)), 3.2, 2.2, 0, 0, 7);
				ctx.fill();
			}
		}
	}
	if (p < 1) {
		ctx.fillStyle = 'rgba(0,0,0,.18)';
		ctx.fillRect(x0, y0 + w * p, w, w * (1 - p)); // the part not yet dug
	}
	ctx.strokeStyle = 'rgba(60,45,25,.5)';
	ctx.lineWidth = 1 / z;
	ctx.strokeRect(x0, y0, w, w);
	flat();
}
function drawBldBox(b) {
	const L = BOX_LOOK[BOX_LOOK.of[b.kind]],
		B = BLD[b.kind],
		half = (B.fp * NAVC) / 2,
		up = Math.min(1, Math.max(0.15, b.prog)), // a site rises with the work, as a wall does
		H = B.h * 0.75 * up, // the walls; the roof takes the rest
		R = (B.h - B.h * 0.75) * up,
		x0 = b.x - half,
		x1 = b.x + half,
		y0 = b.y - half,
		y1 = b.y + half,
		z = cam.z,
		c = (x, y, h = 0) => [SX(x, y), SY(y, h, x)],
		poly = (pts, fill) => {
			ctx.beginPath();
			pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
			ctx.closePath();
			ctx.fillStyle = fill;
			ctx.fill();
		},
		S = lit(L.wall, 0.08),
		E = lit(L.wall, -0.35),
		T = lit(L.roof, 0.18),
		T2 = lit(L.roof, -0.25);
	poly([c(x0, y1), c(x1, y1), c(x1, y1, H), c(x0, y1, H)], S); // the south face, toward the screen's lower left
	poly([c(x1, y0), c(x1, y1), c(x1, y1, H), c(x1, y0, H)], E); // the east face, toward the lower right, in shade
	if (z > 0.7) {
		// the door, the windows: on the south face a door at the middle and a window each side; on the east a window a square
		const d = Math.min(6, half * 0.4),
			dk = lit(L.wall, -0.7);
		poly([c(b.x - d / 2, y1), c(b.x + d / 2, y1), c(b.x + d / 2, y1, Math.min(H * 0.6, 12)), c(b.x - d / 2, y1, Math.min(H * 0.6, 12))], dk);
		const wh = Math.min(5, H * 0.3),
			wy = H * 0.45;
		for (let x = x0 + 5; x < x1 - 4; x += 10)
			if (Math.abs(x + 2 - b.x) > d) poly([c(x, y1, wy), c(x + 4, y1, wy), c(x + 4, y1, wy + wh), c(x, y1, wy + wh)], dk);
		for (let y = y0 + 5; y < y1 - 4; y += 10) poly([c(x1, y, wy), c(x1, y + 4, wy), c(x1, y + 4, wy + wh), c(x1, y, wy + wh)], dk);
	}
	if (L.form === 'flat') {
		poly([c(x0, y0, H), c(x1, y0, H), c(x1, y1, H), c(x0, y1, H)], T);
		if (L.merlon && z > 0.7) {
			const m = 3;
			for (let x = x0 + 1.5; x < x1; x += 5) poly([c(x, y1, H), c(x + 2.5, y1, H), c(x + 2.5, y1, H + m), c(x, y1, H + m)], S);
			for (let y = y0 + 1.5; y < y1; y += 5) poly([c(x1, y, H), c(x1, y + 2.5, H), c(x1, y + 2.5, H + m), c(x1, y, H + m)], E);
		}
	} else if (L.form === 'peak') {
		// a tent: four slopes to one peak
		const [px, py] = c(b.x, b.y, H + R);
		poly([c(x0, y1, H), c(x1, y1, H), [px, py]], T);
		poly([c(x1, y0, H), c(x1, y1, H), [px, py]], T2);
		poly([c(x0, y0, H), c(x1, y0, H), [px, py]], lit(L.roof, 0.3));
		poly([c(x0, y0, H), c(x0, y1, H), [px, py]], lit(L.roof, 0.3));
	} else {
		// a gable: the ridge runs along x (the screen's down-right), the south slope lit, the gable end on the east face
		poly([c(x1, y0, H), c(x1, y1, H), c(x1, b.y, H + R)], E); // the gable end
		poly([c(x0, b.y, H + R), c(x1, b.y, H + R), c(x1, y1, H), c(x0, y1, H)], T); // the south slope
		poly([c(x0, y0, H), c(x1, y0, H), c(x1, b.y, H + R), c(x0, b.y, H + R)], T2); // the north slope, the far one, just showing over the ridge
	}
	// the owner's pennant at the roof's east end
	{
		const top = L.form === 'flat' ? H + (L.merlon ? 3 : 0) : H + R,
			[fx, fy] = c(x1 - 2, L.form === 'gable' ? b.y : y0 + 2, top),
			[tx, ty] = c(x1 - 2, L.form === 'gable' ? b.y : y0 + 2, top + 9);
		ctx.strokeStyle = '#3a2c1c';
		ctx.lineWidth = Math.max(0.6, 0.5 * z);
		ctx.beginPath();
		ctx.moveTo(fx, fy);
		ctx.lineTo(tx, ty);
		ctx.stroke();
		poly([[tx, ty], [tx + 5 * z, ty + 1.5 * z], [tx, ty + 3.5 * z]], G.P[b.owner].color);
	}
	// the edge where the top meets the faces, faint, so the box reads
	ctx.strokeStyle = LINE;
	ctx.lineWidth = Math.max(0.5, 0.4 * z);
	ctx.beginPath();
	const [ax, ay] = c(x0, y1, H), [bx, by] = c(x1, y1, H), [cx, cy] = c(x1, y0, H);
	ctx.moveTo(ax, ay);
	ctx.lineTo(bx, by);
	ctx.lineTo(cx, cy);
	ctx.stroke();
}
function drawBld(b, s) {
	if (WALL_LOOK[b.kind] && b.prog >= 1) {
		drawWallBox(b);
		flagsOn(bldSprite(b, s), SX(b.x, b.y), SY(b.y, 0, b.x), cam.z, G.P[b.owner].color, b.id);
		return;
	}
	if (BLD[b.kind].trap) {
		const z = cam.z,
			x = SX(b.x, b.y),
			y = SY(b.y, 0, b.x),
			k = BLD[b.kind].trap,
			own = b.owner === 0 || friendly(0, b.owner);
		if (b.prog < 1) {
			ctx.strokeStyle = 'rgba(255,211,94,.7)';
			ctx.setLineDash([3, 3]);
			ctx.lineWidth = 1;
			ring(x, y, 6 * z, 3.6 * z);
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
		} else if (k === 'caltrops') {
			// a scatter of four-spiked irons, one spike always up; the squares trodden flat lose them one by one
			const left = Math.max(1, CALTROPS.hits - (b.hits || 0)),
				gl = 0.5 + 0.5 * Math.sin(G.t * 3 + b.id); // the glint of iron
			ctx.lineCap = 'round';
			for (let i = 0; i < left + 1; i++) {
				const px = x + ((i * 7) % 11 - 5) * z * 0.9,
					py = y + ((i * 5) % 7 - 3) * z * 0.55;
				ctx.strokeStyle = own ? 'rgba(30,34,40,.95)' : 'rgba(170,40,30,.95)';
				ctx.lineWidth = Math.max(1, 1.3 * z);
				ctx.beginPath();
				ctx.moveTo(px, py);
				ctx.lineTo(px, py - 3.5 * z);
				ctx.moveTo(px - 2.2 * z, py + 1.2 * z);
				ctx.lineTo(px + 2.2 * z, py + 1.2 * z);
				ctx.moveTo(px, py);
				ctx.lineTo(px + 1.8 * z, py + 2.2 * z);
				ctx.stroke();
				if (i === 0 && own) {
					ctx.strokeStyle = `rgba(240,240,255,${0.3 + 0.6 * gl})`;
					ctx.lineWidth = Math.max(0.6, 0.6 * z);
					ctx.beginPath();
					ctx.moveTo(px, py - 1.5 * z);
					ctx.lineTo(px, py - 3.5 * z);
					ctx.stroke();
				}
			}
			ctx.lineCap = 'butt';
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
		sx = SX(b.x, b.y),
		sy = SY(b.y, 0, b.x),
		B = BLD[b.kind],
		c = bldSprite(b, s),
		k = z / s;
	if (flat_(b)) {
		drawPlot(b);
		if (b.prog < 1) {
			bar(sx, sy - DY(B.fp * NAVC / 2, B.fp * NAVC / 2) - 4, Math.min(60 * z, B.fp * NAVC * z), b.prog, '#e6b947');
			if (b.owner === 0 && !G.units.some((u) => u.rep === b && u.job === 'repair')) idleMark(sx, sy - 8 * z, z * 1.2);
			return;
		}
	} else if (boxed(b) && b.prog < 1) {
		// a site: the outline staked out, the box rising with the work
		ctx.strokeStyle = '#d8c79c';
		ctx.lineWidth = 1.5;
		ctx.setLineDash([3, 3]);
		wrect(b.x - (B.fp * NAVC) / 2, b.y - (B.fp * NAVC) / 2, B.fp * NAVC, B.fp * NAVC, true);
		ctx.setLineDash([]);
		ctx.globalAlpha = 0.85;
		drawBldBox(b);
		ctx.globalAlpha = 1;
		bar(sx, sy - (B.h * Math.max(0.15, b.prog) + 6) * z, Math.min(60 * z, B.fp * NAVC * z), b.prog, '#e6b947');
		if (b.owner === 0 && !G.units.some((u) => u.rep === b && u.job === 'repair')) idleMark(sx, sy - (B.h * Math.max(0.15, b.prog) + 10) * z, z * 1.2);
		return;
	}
	if (b.prog < 1) {
		// a building site: the outline staked out, the walls rising with the work
		const w = B.fp * NAVC * z,
			d = w * TILT;
		ctx.strokeStyle = '#d8c79c';
		ctx.lineWidth = 1.5;
		ctx.setLineDash([3, 3]);
		wrect(b.x - (B.fp * NAVC) / 2, b.y - (B.fp * NAVC) / 2, B.fp * NAVC, B.fp * NAVC, true); // the stakes round the footprint, on the turned ground (preview 50)
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
	if (boxed(b)) drawBldBox(b);
	else if (flat_(b)); // drawn above
	else {
		stamp(c, sx, sy, k * popC(fa / 0.6));
		flagsOn(c, sx, sy, z, G.P[b.owner].color, b.id);
	}
	if (PILE[b.kind] && friendly(0, b.owner)) pileAt(b, sx, sy, z);
	if (fa < 8 && !still() && !boxed(b) && !flat_(b)) {
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
			sy - (B.h * 1.2 + 6) * z - 10 * labelK(),
			labelK(),
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
	if (idlePost(b)) idleMark(sx, sy, z * 1.2, '+'); // an empty post: + (wants a worker), not the idle villager's z
	const M = maxHpB(b.owner, b.kind);
	if (b.hp < M - 1 && !(B.camp && b.hp >= M * CAMP.mend)) bar(sx, sy - c.ay * k - 4, Math.min(60 * z, B.fp * NAVC * z), b.hp / M, G.P[b.owner].color); // a camp piece weathers a little every minute: its bar shows only once it wants mending (CAMP.mend)
	if (G.wonder && G.wonder.id === b.id) {
		ctx.font = mapFont(labelK());
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
// not the deep woods: deepTrees, in the forest layer); the fog's dark hides the rest. All of them go into one path, filled once.
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
// A building's shadow is its own shape, not an oval (decision 14, Albert, Oct 31: we invented the shape, so the shadow is that fixed shape
// thrown away from the light). A box of footprint half-side w (BLD fp) and height h casts its footprint swept by L = h cot(altitude) along the
// light (a planar projection; Blinn 1988, from memory): a hexagon whose corners are the footprint's, each kept, moved by L, or both. The
// footprint's corners on the glass are the turned square's (DX, DY: a diamond since preview 50; preview 54: the shadow was still cast from an
// upright square, Albert's sighting). Which corners lead is fixed by the way the light falls, so the shape is made once for that (HEX) and
// every building only moves and stretches it by its w and L: no hull, no sorting, no arrays per building. One path and one fill a frame.
// (corners() reads the zoom, so the key carries it; the light's direction too, since a turned footprint's silhouette depends on more than its quadrant.)
const BOX = [
	[-1, -1],
	[1, -1],
	[1, 1],
	[-1, 1],
]; // the footprint's corners in the world, clockwise
const corners = () => BOX.map(([x, y]) => [DX(x, y) / cam.z, DY(x, y) / cam.z]); // on the glass, per unit of half-side and zoom
let HEX = { k: '', pts: null };
function hexOf(gx, gy) {
	// gx, gy: the light's direction on the glass (its sign was enough for an upright box; a turned footprint needs the direction itself)
	const k = gx.toFixed(3) + ',' + gy.toFixed(3) + ',' + cam.z.toFixed(2);
	if (HEX.k === k) return HEX.pts;
	// an edge of the footprint faces the sweep when its outward normal points along it; a corner is kept where a back edge meets it, moved where
	// a front edge does, both at the silhouette (one of each), in the order the walk round the polygon meets them
	const C = corners(),
		mx = C.reduce((m, c) => m + c[0], 0) / 4,
		my = C.reduce((m, c) => m + c[1], 0) / 4,
		front = C.map((c, i) => {
			const d = C[(i + 1) % 4],
				ex = d[0] - c[0],
				ey = d[1] - c[1],
				nx = ey,
				ny = -ex, // one normal; made outward by the middle
				out = (nx * (c[0] - mx) + ny * (c[1] - my)) > 0 ? [nx, ny] : [-nx, -ny];
			return Math.round((out[0] * gx + out[1] * gy) * 1e6) > 0;
		}),
		pts = [];
	C.forEach((c, i) => {
		const before = front[(i + 3) % 4],
			after = front[i];
		if (before && after) pts.push([c[0], c[1], 1]);
		else if (!before && !after) pts.push([c[0], c[1], 0]);
		else if (after) pts.push([c[0], c[1], 0], [c[0], c[1], 1]);
		else pts.push([c[0], c[1], 1], [c[0], c[1], 0]);
	});
	HEX = { k, pts };
	return pts;
}
function boxShadow(sx, sy, h, w, z) {
	const L = SHADE.a < 0.02 ? 0 : h * SHADE.len * z,
		vx = SHADE.x * L,
		vy = SHADE.y * L,
		H = hexOf(SHADE.x, SHADE.y);
	for (let i = 0; i < H.length; i++) {
		const [cx, cy, m] = H[i],
			x = sx + cx * w + m * vx,
			y = sy + cy * w + m * vy;
		if (i) ctx.lineTo(x, y);
		else ctx.moveTo(x, y);
	}
	ctx.closePath();
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
			const f = nodeScale(n);
			shadowPath(SX(n.x, n.y), SY(n.y, 0, n.x), h * f, (n.kind === 'tree' ? 7 : 5) * f * z, z);
		}
	for (const [, t, e] of list) {
		if (t === 1) {
			const B = BLD[e.kind];
			if (!B.crop) boxShadow(SX(e.x, e.y), SY(e.y, 0, e.x), B.h * Math.min(1, e.prog), B.fp * NAVC * 0.5 * z, z);
		} else if (t === 2) {
			const U = UNIT[e.kind],
				box = LOOKBOX[U.look] || [26, 30];
			shadowPath(SX(e.x, e.y), SY(e.y, 0, e.x), box[1] * FIG, box[0] * 0.28 * z * FIG + 2, z);
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
	store: [['f', 'sack', '#cdb27a']],
	depot: [['supply', 'sack', '#cdb27a']], // the camp's own stock (b.supply), not the town's
};
// the piles are drawn once per kind, counts and zoom into PSPR and stamped (Build 62: measured at 29% of a frame at a normal zoom as vector work)
const PSPR = new Map();
function pileAt(b, sx, sy, z) {
	if (b.prog < 1 || z < 0.45) return;
	const w = BLD[b.kind].fp * NAVC * z,
		R = G.P[b.owner].res,
		ns = PILE[b.kind].map(([r]) => clamp(Math.round(Math.log10((r === 'supply' ? b.supply || 0 : R[r] || 0) + 1) * 1.9), 0, 6)), // a pyramid of 3, 2 and 1: full at about 1500
		key = `${b.kind}:${ns.join('')}:${z.toFixed(2)}`;
	let c = PSPR.get(key);
	if (!c) {
		const W = w * 0.62 + 40 * z + 4,
			H = w * TILT * 0.42 + 14 * z + 4;
		c = drawOnce(W, H, () => pileArt(b.kind, ns, 0, 0, w, z));
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
		ring(SX(RIPS[i].x, RIPS[i].y), SY(RIPS[i].y, 0, RIPS[i].x), (6 + a * 18) * z, (6 + a * 18) * z * TILT);
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
			x = SX(k.x, k.y),
			y = SY(k.y, 0, k.x) - 6 * z;
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
			.sort((p, r) => p.x + p.y - (r.x + r.y)); // back to front in the turned view (preview 50)
		NV.ref = G.nodes;
		NV.len = G.nodes.length;
		NV.key = key;
	}
	return NV.arr;
}
function drawNode(n, s) {
	const z = cam.z,
		sx = SX(n.x, n.y),
		sy = SY(n.y, 0, n.x);
	if (n.kind === 'fish') {
		if (still()) return;
		const ph = (G.t * 0.5 + n.id * 0.13) % 1;
		ctx.strokeStyle = `rgba(225,242,255,${0.6 * (1 - ph)})`;
		ctx.lineWidth = 1;
		ring(sx, sy, (3 + ph * 6) * z, (1.5 + ph * 3) * z * TILT);
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
	const f = nodeScale(n),
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
		const x = SX(c.x, c.y),
			y = SY(c.y, 0, c.x),
			h = 30 * z,
			col = G.P[g.o].color,
			r = 6 * z + 2,
			f = clamp(g.hp / g.mx, 0, 1);
		STANDARDS.push({ x, y, o: g.o });
		ctx.lineWidth = Math.max(2, 2.4 * z);
		ctx.strokeStyle = 'rgba(16,12,8,.6)';
		ring(x, y, r, r * TILT);
		ctx.strokeStyle = col;
		ring(x, y, r, r * TILT, -Math.PI / 2, -Math.PI / 2 + f * 6.283); // the ring: how much of the group's health is left
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
	ctx.translate(SX(f.x, f.y), SY(f.y, 0, f.x));
	ctx.rotate(r);
	if (f.face < 0) ctx.scale(-1, 1);
	ctx.drawImage(c, -c.ax * k, -c.ay * k, c.width * k, c.height * k);
	ctx.restore();
}
const LEAN = new WeakMap(); // the view's own memory of each woodcutter's lean: the drawing never writes the game's units (Build 60)
const PACED = new WeakMap(); // the view's memory of each unit's walk: when it last grew. A figure whose walk grew in the last 0.15 s is stepping
// the leaves over a soldier in ambush (the visual pass, Nov 3): three leaf blobs in the wood's greens, swaying a little
function leavesOver(u) {
	const z = cam.z,
		x = SX(u.x, u.y),
		y = SY(u.y, 0, u.x) - 8 * z,
		t = G.t * 0.8 + u.id;
	for (let i = 0; i < 3; i++) {
		const a = t + i * 2.1,
			px = x + (i - 1) * 4.5 * z + Math.sin(a) * z,
			py = y + (i % 2) * 3 * z + Math.cos(a) * 0.6 * z;
		ctx.fillStyle = i === 1 ? 'rgba(78,122,58,.9)' : 'rgba(96,142,66,.9)';
		ctx.beginPath();
		ctx.ellipse(px, py, 3.6 * z, 2.2 * z, 0.5 + i * 0.9, 0, 7);
		ctx.fill();
	}
}
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
		sx = SX(ux, uy),
		sy = SY(uy, 0, ux) - (u.fly || 0) * z,
		U = UNIT[u.kind],
		col = G.P[u.owner].color,
		st = u.owner === WILD ? null : stats(u.owner, u.kind);
	const w = u.st ? u.st.walk : 0;
	let pw = PACED.get(u);
	if (!pw) PACED.set(u, (pw = { w, t: -9 }));
	else if (pw.w !== w) {
		pw.w = w;
		pw.t = G.t;
	}
	const moving = G.t - pw.t < 0.15, // any real change of place moves its legs (stepTo, Build 80 preview 9): nothing glides
		working = u.work && G.t - u.work < 0.25,
		pace = w / STRIDE; // steps follow the ground covered, not the clock (Build 52): feet no longer slide
	const fr =
		G.t - (u.hitT || -9) < 0.25
			? 3
			: moving
				? 1 + (((pace | 0) + u.id) % 2)
				: u.grazeAt && !u.run && U.flee
					? 4 // a grazer at rest: head down at the grass (D-092)
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
		ring(sx, sy, 7 * z + 2, 3.4 * z + 1);
	}
	if (u.owner !== WILD) {
		ctx.fillStyle = col;
		ctx.beginPath();
		ctx.ellipse(sx, sy, 3.4 * z + 1, 1.6 * z + 0.6, 0, 0, 7);
		ctx.fill();
	}
	if (u.staked && z > 0.55) {
		// the archer's stake (STAKES): two sharpened stakes leaning out in front of the shooter, the way it faces
		const f = (u.fx || 1) < 0 ? -1 : 1;
		ctx.lineCap = 'round';
		for (const o of [-4, 0, 4]) {
			const x0 = sx + f * 5 * z + o * z * 0.7,
				y0 = sy + 1.5 * z + Math.abs(o) * 0.2 * z,
				x1 = sx + f * 10 * z + o * z * 0.7,
				y1 = sy - 5 * z;
			ctx.strokeStyle = 'rgba(20,14,8,.35)';
			ctx.lineWidth = Math.max(1.4, 1.8 * z);
			ctx.beginPath();
			ctx.moveTo(x0, y0 + 1);
			ctx.lineTo(x1, y1 + 1);
			ctx.stroke(); // the shadow
			ctx.strokeStyle = '#a07a4c';
			ctx.lineWidth = Math.max(1, 1.4 * z);
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
			ctx.stroke();
			ctx.strokeStyle = '#e8dcc4';
			ctx.lineWidth = Math.max(0.8, 1 * z);
			ctx.beginPath();
			ctx.moveTo(x1 - f * 2 * z, y1 + 1.4 * z);
			ctx.lineTo(x1, y1);
			ctx.stroke(); // the pale point
		}
		ctx.lineCap = 'butt';
	}
	// the body in motion (Build 52): a rise and fall with each step; a lunge into the blow and back; a shooter's kick on the release
	const face = (u.fx || 1) < 0 ? -1 : 1,
		ha = G.t - (u.hitT ?? -9),
		hu = G.t - (u.hurtT ?? -9),
		near = (U.rng || 0) <= 20,
		low = isSoldier(u) && u.hp < u.max * JUICE.stagger && !still(), // the juice pass: a soldier badly hurt sways on its feet
		bob = (moving && !still() ? Math.abs(Math.sin(pace * Math.PI)) * 1.2 * z : 0) + (low ? Math.sin(G.t * 4 + u.id) * 0.8 * z : 0),
		recoil = still() || hu > JUICE.recoilS ? 0 : -JUICE.recoil * z * (1 - hu / JUICE.recoilS), // a blow landed: it gives a little, then stands
		lunge =
			still() || ha > 0.3
				? 0
				: near
					? Math.sin((ha / 0.3) * Math.PI) * 2.6 * z
					: ha < 0.18
						? -1.3 * z * (1 - ha / 0.18)
						: 0,
		bx = sx + face * (lunge + recoil),
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
		ring(sx, sy - 6 * z, 8 * z, 9 * z);
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
	if (u.owner === 0 && (u.kind === 'vil' ? freeVil(u) : u.idle)) idleMark(sx, top, z); // a villager by freeVil, the one home; a cart by its own flag
	if (u.owner === 0 && u.focus) idleMark(sx, top, z, 'F', -6); // focused (D-093): it stays where you put it
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
		x = SX(f.x, f.y),
		y = SY(f.y, 0, f.x),
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
// what the finger holds: a ring on the ground under each, green for yours, red for a foe's, gold for the wild and the land
function drawPicks(z) {
	const E = G.pickE;
	if (!E || !E.length) return;
	ctx.lineWidth = 2;
	ctx.setLineDash([]);
	for (const e of E) {
		if (e.hp !== undefined && e.hp <= 0) continue;
		if (e.amt !== undefined && e.amt <= 0 && !e.farm) continue;
		const own = e.owner,
			r = e.q ? halfOf(e) + 6 : !e.kind || FINDS[e.kind] ? 18 : 9;
		ctx.strokeStyle = own === 0 ? '#5ad27a' : own === undefined || own === null || own === WILD ? '#ffd35e' : '#ff6a52';
		ring(SX(e.x, e.y), SY(e.y, 0, e.x), r * z + 3, r * z * TILT + 2);
	}
}
const rnd2 = () => lookDice() * 2 - 1;
// ═════ 24-view-overlays.js: ground, event effects, bars, flags, ghost building, minimap ═════
// Spectacle on the glass: each event's picture, drawn over the world. Light, particles, a real shape; nothing that hides the game.
// the ground after the weather: mud darkens the land, snow whitens it, ice gives it a sheen
function drawGround() {
	const g = G.clim;
	if (!g) return;
	const w = cw,
		h = ch;
	// the trodden squares: worn bare by feet when dry, pooling darker in mud; the picture reads the same map the feet write (Build 62: one home for traffic)
	{
		const T = ruts(),
			z = cam.z,
			x0 = Math.max(0, ((cam.x - w / 2 / z) / FOG) | 0),
			y0 = Math.max(0, ((cam.y - h / 2 / z) / FOG) | 0),
			x1 = Math.min(FOGN - 1, ((cam.x + w / 2 / z) / FOG) | 0),
			y1 = Math.min(FOGN - 1, ((cam.y + h / 2 / z) / FOG) | 0);
		// four depths, four paths: one fill each, however many squares (measured: one fill a square was a tenth of a zoomed-out frame)
		for (let q = 1; q <= 4; q++) {
			ctx.fillStyle = g.mud >= 0.02 ? `rgba(50,32,14,${(0.3 * g.mud * q) / 4})` : `rgba(120,92,58,${(0.12 * q) / 4})`;
			ctx.beginPath();
			for (let gy = y0; gy <= y1; gy++)
				for (let gx = x0; gx <= x1; gx++) {
					const r = T[gy * FOGN + gx];
					if (!r || Math.min(4, Math.ceil(4 * Math.min(1, r / CLIMATE.rut.n0) ** 0.4)) !== q) continue;
					const sx = SX(gx * FOG + FOG / 2, gy * FOG + FOG / 2),
						sy = SY(gy * FOG + FOG / 2, 0, gx * FOG + FOG / 2);
					ctx.moveTo(sx + FOG * 0.6 * z, sy);
					ctx.ellipse(sx, sy, FOG * 0.6 * z, FOG * 0.6 * z * TILT, 0, 0, 6.3);
				}
			ctx.fill();
		}
	}
	if (g.mud < 0.02 && g.snow < 0.02 && g.ice < 0.02) return;
	if (g.mud >= 0.02) {
		ctx.fillStyle = `rgba(70,45,22,${0.22 * g.mud})`;
		ctx.fillRect(0, 0, w, h);
	}
	if (g.snow >= 0.02) {
		ctx.fillStyle = `rgba(235,240,245,${0.55 * g.snow})`;
		ctx.fillRect(0, 0, w, h);
	}
	if (g.ice >= 0.02) {
		ctx.fillStyle = `rgba(190,215,240,${0.25 * g.ice})`;
		ctx.fillRect(0, 0, w, h);
	}
}
// the cracks of a sinkhole: dark jagged arms with a pale edge, and a puff of dust that rises and thins over four seconds; gone after forty-five
function drawCracks(z) {
	if (!G.cracks || !G.cracks.length) return;
	for (const c of G.cracks) {
		if (G.t - c.t0 >= 45) continue; // the events tick clears them; the drawing only reads
		const age = G.t - c.t0,
			fade = age < 30 ? 1 : (45 - age) / 15,
			x = SX(c.x, c.y),
			y = SY(c.y, 0, c.x);
		if (x < -200 || x > cw + 200 || y < -200 || y > ch + 200) continue;
		ctx.lineJoin = 'round';
		for (const [col, w] of [
			[`rgba(236,222,190,${0.35 * fade})`, 4.2],
			[`rgba(18,12,8,${0.9 * fade})`, 2.4],
		]) {
			ctx.strokeStyle = col;
			ctx.lineWidth = w * Math.max(0.6, z);
			ctx.beginPath();
			for (const arm of c.arms)
				arm.forEach(([ax, ay], i) => {
					const k = Math.min(1, age / 0.6); // the crack opens in the first half second
					i ? ctx.lineTo(x + ax * z * k, y + ay * z * TILT * k) : ctx.moveTo(x, y);
				});
			ctx.stroke();
		}
		if (age < 4 && !still())
			for (let i = 0; i < 9; i++) {
				const a = i * 2.4,
					d = (6 + age * 14 + (i % 3) * 5) * z;
				ctx.fillStyle = `rgba(150,128,98,${0.5 * (1 - age / 4)})`;
				ctx.beginPath();
				ctx.ellipse(
					x + Math.cos(a) * d,
					y + Math.sin(a) * d * TILT - age * 9 * z,
					(5 + age * 4) * z,
					(3.5 + age * 2.5) * z,
					0,
					0,
					7,
				);
				ctx.fill();
			}
	}
}
function drawEvents(z) {
	const e = G.ev && G.ev.cur,
		t = performance.now() / 1000;
	drawCracks(z);
	if (e && EV[e.kind].draw) EV[e.kind].draw(e, z, t); // each event draws itself: its block in 37-events
	if ((G.wx === 'blizzard' || G.wx === 'snow') && !still()) {
		ctx.fillStyle = 'rgba(245,248,252,.9)';
		for (let i = 0; i < (G.wx === 'blizzard' ? 160 : 60); i++) {
			const y = ((i * 71.9 + t * 90) % (ch + 20)) - 10,
				x = ((i * 113.7 + t * 140 + Math.sin(t * 0.8 + i) * 14) % (cw + 40)) - 20;
			ctx.fillRect(x, y, 2 + (i % 3 === 0), 2 + (i % 3 === 0));
		}
		if (G.wx === 'blizzard') {
			ctx.fillStyle = 'rgba(235,240,245,.35)';
			ctx.fillRect(0, 0, cw, ch);
		}
	}
}
function bar(x, y, w, f, col) {
	ctx.fillStyle = 'rgba(0,0,0,.65)';
	ctx.fillRect(x - w / 2, y, w, 4);
	ctx.fillStyle = col;
	ctx.fillRect(x - w / 2, y, w * clamp(f, 0, 1), 4);
}
function flagAt(x, y, col, z) {
	ctx.strokeStyle = '#2b2b2b';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x, y - 16 * z);
	ctx.stroke();
	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.moveTo(x, y - 16 * z);
	ctx.lineTo(x + 10 * z, y - 13 * z);
	ctx.lineTo(x, y - 10 * z);
	ctx.closePath();
	ctx.fill();
}
let FONTF = null,
	FONTW = null;
const fontF = () => FONTF || (FONTF = getComputedStyle(document.body).fontFamily);
// every word on the map, one home (v80, Albert): the game's one font at its one weight, read from the page (the style sheet's --weight). A
// label on the map scales whole with its pill and its icon ("If you can zoom it, it needs to scale"): LABEL.px at the starting zoom, larger
// zoomed in, smaller zoomed out to LABEL.floor. k: the label's scale, labelK() on the map; what is pinned to the screen (the edge arrows,
// the crosshair's reference) takes 1
const labelK = () => Math.max(LABEL.floor / LABEL.px, cam.z / ZOOM_START);
const mapFont = (k = 1) => `${FONTW || (FONTW = getComputedStyle(document.body).fontWeight)} ${Math.round(LABEL.px * k)}px ${fontF()}`;
// a ring on the ground (a selection, a ripple, a group's health, a placing mark): the one drawer (Nov 2, O3); the caller sets its colour and line
function ring(x, y, rx, ry, a0 = 0, a1 = 7) {
	ctx.beginPath();
	ctx.ellipse(x, y, rx, ry, 0, a0, a1);
	ctx.stroke();
}
function idleMark(x, y, z, ch = 'z', dx = 4) {
	ctx.font = mapFont(labelK());
	ctx.fillStyle = '#ffd35e';
	ctx.strokeStyle = 'rgba(0,0,0,.7)';
	ctx.lineWidth = 2.5;
	ctx.strokeText(ch, x + dx * z, y);
	ctx.fillText(ch, x + dx * z, y);
}
function tag(text, x, y) {
	const k = labelK();
	ctx.font = mapFont(k);
	const w = ctx.measureText(text).width + 10 * k;
	x = clamp(x, 4, cw - w - 4);
	ctx.fillStyle = 'rgba(18,23,21,.92)';
	ctx.fillRect(x, y - 13 * k, w, 19 * k);
	ctx.fillStyle = '#fff';
	ctx.fillText(text, x + 5 * k, y + k);
}
// the building you are placing: its footprint green where it fits and red where it does not, and the reason
// the seal check while a wall or gate is being placed: a red line where a foe could walk in, or "Sealed" over the keep
function drawSeal(pl) {
	if (!pl.seal || G.t - pl.sealT > SEAL.every || pl.sealN !== (pl.cells || []).length) {
		const extra = pl.at
			? (pl.cells || [toCell(pl.at)]).filter((c) => !canPlace(0, pl.kind, c.gx * NAVC + 5, c.gy * NAVC + 5))
			: [];
		pl.seal = sealPath(extra);
		pl.sealT = G.t;
		pl.sealN = (pl.cells || []).length;
	}
	const P = pl.seal,
		k = keepOf(0);
	if (!P || !k) return;
	if (!P.length) return tag('Sealed', SX(k.x, k.y) - 22, SY(k.y, 0, k.x) - 40);
	ctx.strokeStyle = '#de5a44';
	ctx.lineWidth = 3;
	ctx.setLineDash([8, 6]);
	ctx.beginPath();
	P.forEach((q, i) => (i ? ctx.lineTo(SX(q.x, q.y), SY(q.y, 0, q.x)) : ctx.moveTo(SX(q.x, q.y), SY(q.y, 0, q.x))));
	ctx.stroke();
	ctx.setLineDash([]);
	const e = P[0];
	tag('Open: a foe walks in', SX(e.x, e.y) - 50, SY(e.y, 0, e.x) - 10);
}
// alignment guides (Build 63): a thin line from the ghost to every own building whose centre sits on the same line of the screen, upright or
// level, as a PDF editor draws them while an element moves; the snap pull toward them is snapGhost's. On the screen's lines only since
// preview 54 (Albert: the world's axes read as diagonals once the view turned, "out of alignment"); a centre on one land x is one world x − y,
// on one land y one world x + y (the land is turned −angle in the world: 01)
function drawGuides(sp, h) {
	ctx.save();
	ctx.strokeStyle = 'rgba(120,220,255,.8)';
	ctx.lineWidth = 1;
	ctx.setLineDash([4, 4]);
	ctx.beginPath();
	for (const b of G.blds) {
		if (b.owner !== 0 || b.hp <= 0 || BLD[b.kind].wallish || Math.abs(b.x - sp.x) >= GUIDE_R || Math.abs(b.y - sp.y) >= GUIDE_R) continue;
		const bh = halfOf(b),
			ls = sp,
			lb = b; // the world's squares, turned with the map (Nov 4), as snapGhost pulls
		for (const [same, ax] of [
			[Math.abs(ls.x - lb.x) < GUIDE_ON, 'y'],
			[Math.abs(ls.y - lb.y) < GUIDE_ON, 'x'],
		])
			if (same) {
				// the line through both, in the land's frame, a little past each
				const lo = Math.min(ls[ax], lb[ax]) - 12 - h - bh,
					hi = Math.max(ls[ax], lb[ax]) + 12 + h + bh,
					p0 = { x: ax === 'x' ? lo : ls.x, y: ax === 'y' ? lo : ls.y },
					p1 = { x: ax === 'x' ? hi : ls.x, y: ax === 'y' ? hi : ls.y };
				ctx.moveTo(SX(p0.x, p0.y), SY(p0.y, 0, p0.x));
				ctx.lineTo(SX(p1.x, p1.y), SY(p1.y, 0, p1.x));
			}
	}
	ctx.stroke();
	ctx.restore();
}
function drawGhost() {
	const pl = G.place;
	if (pl && BLD[pl.kind].wallish) drawSeal(pl);
	if (!pl || !pl.at) return;
	const z = cam.z,
		kind = pl.kind,
		B = BLD[kind];
	if (lineKind(kind)) {
		const cells = pl.cells || [toCell(pl.at)];
		let bad = 0;
		for (const c of cells) {
			const ok = !canPlace(0, kind, c.gx * NAVC + 5, c.gy * NAVC + 5); // the line's own kind: a trap keeps no lane (p44)
			if (!ok) bad++;
			ctx.fillStyle = ok ? 'rgba(120,220,120,.55)' : 'rgba(222,90,68,.65)';
			wrect(c.gx * NAVC, c.gy * NAVC, NAVC, NAVC);
		}
		pl.pts.forEach((c, i) => {
			const q = wallXY(c); // the corners: round handles, the first ringed green
			ctx.fillStyle = '#fff';
			ctx.strokeStyle = i ? '#222' : '#7ee07e';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(q.x, q.y, 9, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		});
		const last = cells[cells.length - 1];
		pl.why = bad === cells.length ? 'blocked' : null;
		tag(
			`${cells.length} × ${costText(B.cost)}${bad ? ' · ' + bad + ' blocked' : ''}`,
			SX(last.gx * NAVC, last.gy * NAVC) + 12,
			SY(last.gy * NAVC, 0, last.gx * NAVC) - 14,
		);
		return;
	}
	const sp = pl.at,
		n = B.fp * NAVC,
		why = canPlace(0, kind, sp.x, sp.y),
		ok = !why;
	pl.why = why;
	drawGuides(sp, n / 2);
	const ghost = { kind, owner: 0, x: sp.x, y: sp.y, prog: 1, id: 0 };
	ctx.globalAlpha = 0.6;
	if (boxed(ghost)) {
		// the box itself, washed green where it fits and red where not (preview 54: the ghost turns with the ground as the buildings do)
		drawBldBox(ghost);
		ctx.globalAlpha = 0.35;
		ctx.fillStyle = ok ? '#4ade80' : '#ef4444';
		const half = n / 2,
			c = (x, y, h = 0) => [SX(x, y), SY(y, h, x)],
			H = B.h; // the box's whole outline: the roof's top edge and the two near faces
		ctx.beginPath();
		for (const [x, y] of [c(sp.x - half, sp.y - half, H), c(sp.x + half, sp.y - half, H), c(sp.x + half, sp.y - half, 0), c(sp.x + half, sp.y + half, 0), c(sp.x - half, sp.y + half, 0), c(sp.x - half, sp.y + half, H)]) ctx.lineTo(x, y);
		ctx.closePath();
		ctx.fill();
	} else {
		const s = quant(z * dpr),
			c = bldSprite(ghost, s);
		stamp(ghostTint(c, ok), SX(sp.x, sp.y), SY(sp.y, 0, sp.x), z / s);
		flagsOn(c, SX(sp.x, sp.y), SY(sp.y, 0, sp.x), z, G.P[0].color, 0);
	}
	ctx.globalAlpha = 1;
	tag(why || `${B.name} · ${costText(B.cost)}`, SX(sp.x, sp.y) - 40, SY(sp.y, 0, sp.x) - DY(n / 2, n / 2) - 8 - (BLD[kind].h + 10) * z);
}
// The ghost's own art tinted green where it fits and red where it does not (Albert, Nov 1): no grid, no footprint box; the reason is in its label.
// One tinted copy of each sprite for each answer, kept with the sprite.
const GHOST_TINT = { ok: 'rgba(126,224,126,.55)', no: 'rgba(222,90,68,.6)' },
	ghostTints = new WeakMap();
function ghostTint(c, ok) {
	const T = ghostTints.get(c) || {},
		k = ok ? 'ok' : 'no';
	if (!T[k]) {
		const t = document.createElement('canvas');
		t.width = c.width;
		t.height = c.height;
		t.ax = c.ax;
		t.ay = c.ay;
		const g = t.getContext('2d');
		g.drawImage(c, 0, 0);
		g.globalCompositeOperation = 'source-atop';
		g.fillStyle = GHOST_TINT[k];
		g.fillRect(0, 0, t.width, t.height);
		T[k] = t;
		ghostTints.set(c, T);
	}
	return T[k];
}
function miniIncoming(m, k) {
	const I = G.incoming;
	if (!I) return;
	const li = landXY(I.x, I.y),
		x = li.x * MINI_K,
		y = li.y * MINI_K,
		on = Math.floor(performance.now() / 350) % 2 === 0;
	m.strokeStyle = '#ff3b2f';
	m.lineWidth = 2;
	m.beginPath();
	m.arc(x, y, on ? 9 : 6, 0, Math.PI * 2);
	m.stroke();
	m.fillStyle = on ? '#ff3b2f' : '#ffd0c8';
	m.beginPath();
	m.arc(x, y, 4, 0, Math.PI * 2);
	m.fill();
} // an attack on its way: a red dot that flashes on the small map; tap the map and you are there
// the small map, turned with the view (preview 50): the diamond fills its square; MINI_M maps world units to it; marks are drawn in the
// turned frame (a mark's own shape is turned too; it is 3 px, nobody minds)
const MINI_K = 172 / SQUARE, // the land's square fills the small map (preview 51)
	miniMat = (m) => m.setTransform(MINI_K * TC, MINI_K * TS, -MINI_K * TS, MINI_K * TC, MINI_K * (LMID - MID * (TC - TS)), MINI_K * (LMID - MID * (TC + TS))), // world units to the small map, through the land's frame
	miniWorld = (px, py) => worldXY(px / MINI_K, py / MINI_K); // a point of the small map, in the world
function drawMini() {
	const m = mctx,
		k = 1;
	m.setTransform(1, 0, 0, 1, 0, 0);
	m.clearRect(0, 0, 172, 172);
	miniMat(m);
	m.drawImage(terrainMini, 0, 0, 172, 172, 0, 0, MAP, MAP);
	m.drawImage(forestLayer(), 0, 0, MAP, MAP);
	if (G.fogOn) {
		m.imageSmoothingEnabled = false;
		m.drawImage(fogLayer(), 0, 0, MAP, MAP);
	}
	m.imageSmoothingEnabled = true;
	m.setTransform(1, 0, 0, 1, 0, 0);
	m.save();
	m.beginPath();
	m.rect(0, 0, 172, 172);
	m.clip();
	const W = (x, y) => {
		const l = landXY(x, y);
		return [l.x * MINI_K, l.y * MINI_K];
	}; // a world point on the small map
	const P = (e) => W(e.x, e.y);
	for (const f of G.finds)
		if ((!f.done || FINDS[f.kind].capture) && known0(f)) {
			m.fillStyle = f.owner !== null && FINDS[f.kind].capture ? G.P[f.owner].color : '#f2cf55';
			{ const [fx, fy] = P(f); m.fillRect(fx - 1.5, fy - 1.5, 3, 3); }
		}
	for (const b of G.blds) {
		// Town Centers are stars, castles diamonds, the rest small squares
		if (!knownB(b)) continue;
		m.fillStyle = G.P[b.owner].color;
		const [x, y] = P(b);
		if (b.kind === 'keep' || b.kind === 'town') {
			m.beginPath();
			for (let i = 0; i < 10; i++) {
				const r = i % 2 ? 3 : 7.5,
					a = -Math.PI / 2 + (i * Math.PI) / 5;
				m.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
			}
			m.closePath();
			m.fill();
			m.strokeStyle = 'rgba(0,0,0,.6)';
			m.lineWidth = 1;
			m.stroke();
		} else if (b.kind === 'castle') {
			m.beginPath();
			m.moveTo(x, y - 5.5);
			m.lineTo(x + 5.5, y);
			m.lineTo(x, y + 5.5);
			m.lineTo(x - 5.5, y);
			m.closePath();
			m.fill();
			m.strokeStyle = 'rgba(0,0,0,.6)';
			m.lineWidth = 1;
			m.stroke();
		} else if (!BLD[b.kind].trap) {
			const s = BLD[b.kind].wallish ? 2 : BLD[b.kind].fp >= 5 ? 5 : 3.5;
			m.fillRect(x - s / 2, y - s / 2, s, s);
		}
	}
	if (G.wx === 'blizzard') {
		m.fillStyle = 'rgba(235,240,245,.92)';
		m.fillRect(0, 0, 172, 172);
	} // a whiteout: the land is lost in white; what your people still see, and where you are looking, show on it (Build 60: it went blank)
	for (const u of G.units)
		if (u.owner !== WILD ? visibleTo0(u) : !UNIT[u.kind].flee && !UNIT[u.kind].passive && (!G.fogOn || seen0(u))) {
			m.fillStyle = G.P[u.owner].color;
			{ const [ux, uy] = P(u); m.fillRect(ux - 1, uy - 1, 2, 2); }
		}
	if (G.mirage && G.mirage.until > G.t) {
		m.fillStyle = '#de5a44';
		for (let i = 0; i < G.mirage.n; i++)
			{ const [mx, my] = W(G.mirage.x + (i % 4) * 14 - 20, G.mirage.y + Math.floor(i / 4) * 14 - 14); m.fillRect(mx - 1, my - 1, 2, 2); }
	} // the mirage
	miniIncoming(m, k);
	m.restore();
	{
		// what the screen shows: the four screen corners, in the world, as a box on the small map
		const Q = [toWorld(0, 0), toWorld(cw, 0), toWorld(cw, ch), toWorld(0, ch)].map((p) => W(p.x, p.y));
		m.strokeStyle = '#fff';
		m.lineWidth = 1.5;
		m.beginPath();
		Q.forEach(([x, y], i) => (i ? m.lineTo(x, y) : m.moveTo(x, y)));
		m.closePath();
		m.stroke();
	}
}
// the flood: water over the shore
function drawFlood(z) {
	if (!inFlood()) return;
	ctx.fillStyle = 'rgba(42,100,136,.55)';
	wmat();
	ctx.beginPath();
	for (const L of G.lakes) shoreWalk(L, floodRise(), 48, (x, y, r, a) => ctx[a ? 'lineTo' : 'moveTo'](x, y)); // the flood follows each lake's own shore, risen (the one shore: 10-world-water)
	flat();
	ctx.fill(); // one shape, so a river's overlapping pools do not darken where they meet (Build 52)
}
// quicksand: a pale patch with ripples
function drawSand(z) {
	if (G.sand && G.sand.until > G.t) {
		const s = G.sand;
		ctx.fillStyle = 'rgba(200,180,120,.7)';
		ctx.beginPath();
		ctx.ellipse(SX(s.x, s.y), SY(s.y, 0, s.x), s.r * z, s.r * z * TILT, 0, 0, 7);
		ctx.fill();
		ctx.strokeStyle = 'rgba(120,100,60,.5)';
		ctx.lineWidth = 1;
		for (let i = 1; i <= 3; i++) {
			ring(SX(s.x, s.y), SY(s.y, 0, s.x), (s.r * z * i) / 4, (s.r * z * TILT * i) / 4);
		}
	} // quicksand: a pale patch with ripples
}
// small ripples drift on the lakes
function drawLakeRipples(z) {
	if (!still()) {
		ctx.strokeStyle = 'rgba(220,240,255,.28)';
		ctx.lineWidth = 1.2;
		for (const L of G.lakes) {
			if (Math.abs(L.x - cam.x) > cw / cam.z / 2 + L.r || Math.abs(L.y - cam.y) > ch / cam.z / TILT / 2 + L.r) continue;
			for (let i = 0; i < (L.river ? 2 : 18); i++) {
				const a = i * 2.4 + G.t * 0.05,
					r = lakeRAt(L, a) * (0.25 + 0.6 * ((i * 0.37 + G.t * 0.02) % 1)); // within the drawn shore (p44)
				const lx = SX(L.x + Math.cos(a) * r, L.y + Math.sin(a) * r),
					ly = SY(L.y + Math.sin(a) * r, 0, L.x + Math.cos(a) * r);
				ctx.beginPath();
				ctx.moveTo(lx - 6 * z, ly);
				ctx.quadraticCurveTo(lx, ly - 2 * z, lx + 6 * z, ly);
				ctx.stroke();
			}
		}
	}
}
// rain rings sit on the ground, fixed to the world, under buildings and people
function drawRainRings(z) {
	if (G.wx === 'rain' && z > 1.2 && !still()) {
		// rain rings sit on the ground, fixed to the world, under buildings and people
		const t = performance.now() / 1000,
			C = 120,
			a0 = toWorld(0, 0),
			b0 = toWorld(cw, ch);
		ctx.strokeStyle = 'rgba(215,230,245,.30)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (let gy = Math.floor(a0.y / C); gy <= Math.floor(b0.y / C); gy++)
			for (let gx = Math.floor(a0.x / C); gx <= Math.floor(b0.x / C); gx++) {
				const h = ((gx * 73856093) ^ (gy * 19349663)) >>> 0;
				if (h % 3) continue;
				const ph = (t * 1.6 + ((h >> 8) & 255) / 256) % 1,
					r = Math.min(10, (1 + ph * 4) * z),
					px = SX((gx + (h & 255) / 256) * C, (gy + ((h >> 16) & 255) / 256) * C),
					py = SY((gy + ((h >> 16) & 255) / 256) * C, 0, (gx + (h & 255) / 256) * C);
				ctx.moveTo(px + r, py);
				ctx.ellipse(px, py, r, r * TILT, 0, 0, 7);
			}
		ctx.stroke();
	}
}
// the wildfire
function drawFire(z, inView) {
	if (G.fire)
		for (const n of G.fire)
			if (inView(n)) {
				const x = SX(n.x, n.y),
					y = SY(n.y, 0, n.x),
					ph = (G.t * 5 + n.id) % 1;
				ctx.fillStyle = 'rgba(250,150,40,.85)';
				ctx.beginPath();
				ctx.ellipse(x, y - 8 * z, (3 + ph * 2) * z, (6 + ph * 4) * z, 0, 0, 7);
				ctx.fill();
				ctx.fillStyle = 'rgba(255,230,120,.9)';
				ctx.beginPath();
				ctx.ellipse(x, y - 7 * z, 1.5 * z, 3 * z, 0, 0, 7);
				ctx.fill();
				smoke(x, y - 14 * z, n.id, z);
			} // the wildfire
}
// the fog, soft, over everything standing
function drawFogLayer(z) {
	if (G.fogOn) {
		const VB = viewBox(),
			sx0 = clamp(VB.x0, 0, MAP),
			sy0 = clamp(VB.y0, 0, MAP),
			sx1 = clamp(VB.x1, 0, MAP),
			sy1 = clamp(VB.y1, 0, MAP);
		ctx.imageSmoothingEnabled = true;
		if (sx1 > sx0 && sy1 > sy0) {
			wmat();
			ctx.drawImage(fogLayer(), sx0 / FOG, sy0 / FOG, (sx1 - sx0) / FOG, (sy1 - sy0) / FOG, sx0, sy0, sx1 - sx0, sy1 - sy0);
			flat();
		}
	} // the fog, soft, over everything standing
}
// your groups on the march: a dashed line from the group to where it is going, a ring where it will stand
function drawOrders(z) {
	if (!G.ords || G.over) return; // the end screen is not drawn through (Albert, Oct 30: a ring's "156s" showed behind Victory)
	// your groups: a dashed line from the group to where it is going, a ring to tap, the time left beside it.
	// Once arrived the ring stays, faint, so the order can still be tapped (Build 42)
	ctx.save();
	ctx.strokeStyle = G.P[0].color;
	ctx.fillStyle = G.P[0].color;
	ctx.font = mapFont(labelK());
	ctx.textAlign = 'center';
	for (const id in G.ords) {
		const O = G.ords[id];
		const bx = SX(O.x, O.y),
			by = SY(O.y, 0, O.x),
			r = 14 * cam.z;
		ctx.setLineDash([6, 6]);
		ctx.lineWidth = 1.5;
		if (!O.arrived && O.cx !== undefined) {
			ctx.globalAlpha = 0.7;
			ctx.lineDashOffset = -performance.now() / 60;
			ctx.beginPath();
			ctx.moveTo(SX(O.cx, O.cy), SY(O.cy, 0, O.cx));
			ctx.lineTo(bx, by);
			ctx.stroke();
		}
		ctx.globalAlpha = O.arrived ? 0.35 : 0.85;
		ctx.lineWidth = O.arrived ? 1.2 : 2;
		ctx.setLineDash(O.arrived ? [3, 5] : [6, 6]);
		ring(bx, by, r, r * TILT);
		if (!O.arrived && O.eta > 0) {
			ctx.globalAlpha = 0.95;
			ctx.fillText(Math.ceil(O.eta) + 's', bx, by - r * TILT - 4);
		}
	}
	ctx.restore();
}
// arrows and shots: a short streak along the curve
function drawTracers() {
	ctx.lineWidth = 1.2;
	for (const t of G.tracers) {
		ctx.strokeStyle = t.fire ? `rgba(${FLAME_RGB.torch},.95)` : 'rgba(255,238,200,.85)';
		// a short streak along the curve: the head and a point just behind it
		const p = 1 - t.life / t.dur,
			q = Math.max(0, p - 0.12),
			at = (f) => [
				SX(t.x1 + (t.x2 - t.x1) * f, t.y1 + (t.y2 - t.y1) * f),
				SY(t.y1 + (t.y2 - t.y1) * f, t.h1 + (6 - t.h1) * f + 4 * t.arc * f * (1 - f), t.x1 + (t.x2 - t.x1) * f),
			];
		const [ax, ay] = at(q),
			[bx, by] = at(p);
		ctx.beginPath();
		ctx.moveTo(ax, ay);
		ctx.lineTo(bx, by);
		ctx.stroke();
		if (t.fire) glow(bx, by, 'candle', cam.z * 1.5); // a burning arrow lights its own way
	}
}
// the light: warm at dusk and dawn, blue at night, darker toward the edges; lit windows
function drawLight(z, inView) {
	// the light: warm at dusk and dawn, blue at night, darker toward the edges
	const nt = G.night,
		dusk = 4 * nt * (1 - nt);
	{
		const t = tintOf(dusk, nt);
		if (t) {
			ctx.fillStyle = t;
			ctx.fillRect(0, 0, cw, ch);
		}
	} // dusk, night and the weather's cast, blended into one fill
	// the lights (Build 55): every flame in view throws its glow on the ground, from one table (FLAME in 23-view-things). Hearths in homes and
	// the Town Center; the robbers' campfires; a lantern on every caravan; a torch on every standard; a building ablaze. Lights off keeps the windows.
	const tnow = performance.now() / 1000;
	if (nt > 0.5)
		for (const b of G.blds)
			if (inView(b) && b.prog >= 1 && HEARTH.has(b.kind) && knownB(b)) {
				const fire = b.owner !== WILD && G.P[b.owner].techs.has('chimney'), // a fireplace flickers from inside
					a = fire ? 0.6 + 0.3 * Math.sin(tnow * 9 + b.id) * Math.sin(tnow * 5.3 + b.id * 0.7) : 0.75;
				ctx.fillStyle = `rgba(255,${fire ? 185 : 200},${fire ? 90 : 110},${a.toFixed(2)})`;
				ctx.fillRect(SX(b.x, b.y) + 3 * z, SY(b.y, 6, b.x) + DY(halfOf(b) * 0.9, halfOf(b) * 0.9) / 2, 2 * z, 2 * z);
			}
	if (!SET.lights || (nt < 0.05 && G.wx !== 'rain' && !G.blds.some((b) => b.fire > 0))) return;
	for (const b of G.blds) {
		if (!inView(b) || !knownB(b)) continue;
		const B = BLD[b.kind];
		if (b.fire > 0 || b.hp < maxHpB(b.owner, b.kind) * 0.5) glow(SX(b.x, b.y), SY(b.y, 0, b.x), 'blaze', z);
		else if (b.prog >= 1 && HEARTH.has(b.kind))
			glow(
				SX(b.x, b.y),
				SY(b.y, 0, b.x) + halfOf(b) * TILT * 0.4,
				'hearth',
				z,
				1 +
					0.5 *
						(b.owner === WILD ? 0 : upTier(b.kind === 'keep' || b.kind === 'town' ? 'house' : b.kind, G.P[b.owner])),
			); // the Home line lights the hearth more
		else if (b.prog >= 1 && !B.wallish && !B.crop && b.owner !== WILD && fxv(b.owner, 'lamp', bldKeys(b.kind)).a > 0) {
			const x = SX(b.x, b.y) - halfOf(b) * z * 0.6,
				y = SY(b.y, 0, b.x) + halfOf(b) * TILT * z * 0.5;
			glow(x, y, 'lantern', z);
			flame(x, y - 3 * z, 'lantern', z * 0.7, b.id);
		} // Lanterns: one at every door
	}
	for (const f of G.finds)
		if (f.kind === 'camp' && !f.done && inView(f) && known0(f)) glow(SX(f.x, f.y), SY(f.y, 0, f.x), 'campfire', z);
	for (const u of G.units)
		if (u.kind === 'caravan' && u.hp > 0 && !u.inside && inView(u) && visibleTo0(u)) {
			const x = SX(u.x, u.y) + 5 * z,
				y = SY(u.y, 0, u.x) - 9 * z;
			glow(SX(u.x, u.y), SY(u.y, 0, u.x), 'lantern', z);
			flame(x, y, 'lantern', z * 0.8, u.id);
		}
	for (const s of STANDARDS) {
		glow(s.x, s.y, 'torch', z);
		flame(s.x, s.y - 30 * z, 'torch', z, s.o);
	}
}
const HEARTH = new Set(['house', 'apartment', 'keep', 'town', 'messtent', 'hall']); // where a fire is always lit after dark (the mess tent's cooking fire, the Hall's lamps: Nov 3)
// something of yours was hit: a red glow round the edge, fading over a second and a half
function drawHitGlow() {
	if (G.hitT !== undefined && G.t - G.hitT < 1.6) {
		// something of yours was hit: a red glow round the edge, fading over a second and a half
		const wild = !!G.hitWild,
			H = wild ? 1 : 0; // red for a rival, orange for bandits and animals
		if (!hg[H] || hg[H].w !== cw || hg[H].h !== ch) {
			const q = ctx.createRadialGradient(
					cw / 2,
					ch / 2,
					Math.min(cw, ch) * 0.3,
					cw / 2,
					ch / 2,
					Math.max(cw, ch) * 0.72,
				),
				c = wild ? '240,150,30' : '210,40,30';
			q.addColorStop(0, `rgba(${c},0)`);
			q.addColorStop(1, `rgba(${c},.55)`);
			q.w = cw;
			q.h = ch;
			hg[H] = q;
		}
		ctx.globalAlpha = 1 - (G.t - G.hitT) / 1.6;
		ctx.fillStyle = hg[H];
		ctx.fillRect(0, 0, cw, ch);
		ctx.globalAlpha = 1;
	}
}
// a new age, a wonder, a victory: a pale flash
function drawFlash() {
	if (G.whiteT !== undefined && G.t - G.whiteT < 0.9) {
		ctx.globalAlpha = 0.55 * (1 - (G.t - G.whiteT) / 0.9);
		ctx.fillStyle = '#fff6dc';
		ctx.fillRect(0, 0, cw, ch);
		ctx.globalAlpha = 1;
	} // a new age, a wonder, a victory
}
// boxes of trees being cut, the hold ring, the selection box
function drawTouch(z) {
	const seen = new Set();
	ctx.setLineDash([5, 5]);
	ctx.strokeStyle = 'rgba(192,138,88,.6)';
	ctx.lineWidth = 1.5; // boxes of trees being cut
	for (const u of G.units)
		if (u.owner === 0 && u.patch && !seen.has(u.patch.x0)) {
			seen.add(u.patch.x0);
			const r = u.patch;
			wrect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0, true);
		}
	if (G.press && performance.now() - G.press.t > PRESS_SHOW) {
		const f = Math.min(1, (performance.now() - G.press.t - PRESS_SHOW) / (HOLD_MS - PRESS_SHOW));
		ctx.strokeStyle = 'rgba(255,211,94,.85)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(G.press.x, G.press.y, 26, -Math.PI / 2, -Math.PI / 2 + f * 6.2832);
		ctx.stroke();
	} // the ring fills only once the finger is plainly holding (Albert, Nov 3: it flashed on every tap): at full the box begins
	if (G.chokeLine) {
		const L = G.chokeLine,
			n = Math.max(1, Math.round(hyp(L.b.x - L.a.x, L.b.y - L.a.y) / GRID.gap));
		ctx.strokeStyle = '#ffd35e';
		ctx.lineWidth = 3;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(SX(L.a.x, L.a.y), SY(L.a.y, 0, L.a.x));
		ctx.lineTo(SX(L.b.x, L.b.y), SY(L.b.y, 0, L.b.x));
		ctx.stroke();
		ctx.font = mapFont();
		ctx.textAlign = 'center';
		ctx.fillStyle = '#ffd35e';
		ctx.fillText(`${n} across`, SX((L.a.x + L.b.x) / 2, (L.a.y + L.b.y) / 2), SY((L.a.y + L.b.y) / 2, 0, (L.a.x + L.b.x) / 2) - 12);
	} // the choke being drawn: the gap and how many files it holds
	if (G.box) {
		const b = G.box;
		ctx.fillStyle = 'rgba(255,211,94,.12)';
		ctx.fillRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0));
		ctx.strokeStyle = '#ffd35e';
		ctx.lineWidth = 2;
		ctx.strokeRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0));
	}
	ctx.setLineDash([]);
}
// ═════ 25-view-weather.js: rain, wind, lightning, sky, forest ═════
// ── Weather on the glass, after SoRen's model: rain is a pool of drops whose size sets its speed and weight (Marshall-Palmer sizes,
// Atlas's fall speeds); a storm doubles the drops and leans them with the wind. Lightning is SoRen's three-stroke bolt (glow, mid, core) with forks;
// the sky lights from inside and decays in a tenth of a second; far strikes are sheet flashes with no bolt; thunder comes by distance (35-sound).
// Safety as SoRen's: one flash at a time, never two inside a third of a second. The sky band along the top of the glass is the horizon: it
// takes the colour of the hour and the weather, and the storm's cloud walks across it.
const RAINP = { n: 240, lambda: 4.1 * 5 ** -0.21, dMin: 0.5, dMax: 4 },
	fallV = (D) => 9.65 - 10.3 * Math.exp(-0.6 * D);
const RAIN = Array.from({ length: RAINP.n }, (_, i) => {
	const D = Math.min(RAINP.dMax, RAINP.dMin - Math.log(1 - ((i * 0.618) % 1 || 0.5)) / RAINP.lambda),
		d = clamp(0.4 + (0.6 * (D - RAINP.dMin)) / 2.5, 0.4, 1);
	return { x: (i * 97.3) % 1000, y: (i * 53.7) % 1000, d, v: (9.6 * fallV(D)) / fallV(2) };
});
let wxT = 0,
	wind = 0,
	flashA = 0,
	flashT = -9,
	sheetT = -9;
const FLASH_GAP = 0.34;
const flashOK = (now) => now - flashT >= FLASH_GAP;
function drawWeather() {
	const z = cam.z,
		now = performance.now() / 1000,
		dt = Math.min(0.05, now - (wxT || now)),
		wx = G.wx,
		e = G.ev.cur;
	wxT = now;
	const stormy = e && e.kind === 'storm',
		raining = wx === 'rain' || stormy;
	wind += ((stormy ? 0.8 : raining ? 0.3 : 0.1) * Math.sin(now * 0.07) - wind) * dt * 0.3; // the wind wanders; a storm leans it hard
	if (raining && !still()) {
		const n = stormy ? RAINP.n : wx === 'rain' ? 150 : 0,
			slant = wind * 0.35,
			fall = 420 * dt;
		ctx.lineCap = 'round';
		for (let i = 0; i < n; i++) {
			const m = RAIN[i];
			m.y += m.v * fall;
			m.x += wind * 60 * dt;
			if (m.y > ch + 12) {
				m.y = -12;
				m.x = lookDice() * cw;
			}
			if (m.x < -24) m.x = cw + 12;
			else if (m.x > cw + 24) m.x = -12;
			const len = 8 + 12 * m.d;
			ctx.strokeStyle = `rgba(205,232,250,${(0.2 + 0.4 * m.d).toFixed(2)})`;
			ctx.lineWidth = 0.8 + 0.8 * m.d;
			ctx.beginPath();
			ctx.moveTo(m.x, m.y);
			ctx.lineTo(m.x - slant * len, m.y + len);
			ctx.stroke();
		}
	}
	if (wx === 'frost' || wx === 'blizzard') {
		if (!still()) {
			const n = wx === 'blizzard' ? 160 : 80,
				sp = wx === 'blizzard' ? 90 : 34;
			ctx.fillStyle = 'rgba(245,248,252,.85)';
			for (let i = 0; i < n; i++) {
				const y = ((i * 71.9 + now * sp) % (ch + 20)) - 10,
					x = (i * 113.7 + Math.sin(now * 0.8 + i) * 14 + wind * now * 40) % cw;
				ctx.fillRect(x < 0 ? x + cw : x, y, 2 + (i % 3 === 0), 2 + (i % 3 === 0));
			}
		}
	}
	// the storm's own lightning: far sheet flashes while it walks, a close bolt now and then (the strikes on buildings come from 36-economy)
	if (stormy && !still() && !G.paused && now - sheetT > 2.5 + 6 * lookDice() && flashOK(now)) {
		// not while paused: a bolt ages on the game clock, so one made in a pause never faded and they piled up, each with its thunder (Build 60)
		sheetT = now;
		const close = lookDice();
		if (close > 0.75) {
			const bx = cam.x + ((lookDice() - 0.5) * cw) / z,
				by = cam.y + ((lookDice() - 0.5) * ch) / z;
			(G.bolts = G.bolts || []).push({ x: bx, y: by, t: G.t, seed: lookDice() });
			thunder(bx, by);
		} else {
			flashA = Math.max(flashA, 0.25 + 0.3 * close);
			flashT = now;
		}
	}
	if (G.bolts && G.bolts.length) {
		G.bolts = G.bolts.filter((b) => G.t - b.t < 0.7);
		for (const b of G.bolts) {
			const age = G.t - b.t;
			if (!b.lit && flashOK(now)) {
				b.lit = true;
				flashA = Math.max(flashA, 0.6 + 0.4 * (1 - Math.min(1, dist(b, cam) / 900)));
				flashT = now;
			}
			if (age > 0.45) continue;
			const rr = NS_rng((b.seed * 1e6) | 1); // the same jagged path every frame
			const x1 = SX(b.x, b.y),
				y1 = SY(b.y, 0, b.x),
				paths = [],
				main = [];
			let x = x1 + (rr() - 0.5) * 80,
				y = Math.min(0, y1 - 300);
			main.push([x, y]);
			while (y < y1) {
				y += 9 + rr() * 15;
				x += (rr() - 0.5) * 34;
				main.push([x, y]);
			}
			main[main.length - 1] = [x1, y1];
			paths.push(main);
			for (let f = 0, nf = 1 + ((rr() * 3) | 0); f < nf; f++) {
				const fk = main[1 + Math.floor(rr() * (main.length - 3))],
					dir = rr() < 0.5 ? -1 : 1,
					br = [fk];
				for (let k = 1, kn = 3 + ((rr() * 3) | 0); k <= kn; k++)
					br.push([fk[0] + dir * k * (7 + rr() * 9), fk[1] + k * (8 + rr() * 9)]);
				paths.push(br);
			}
			const a = clamp(1 - age / 0.45, 0, 1),
				w = 12;
			ctx.save();
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.globalCompositeOperation = 'lighter';
			for (const [lw, col] of [
				[w, `rgba(170,200,255,${(0.18 * a).toFixed(2)})`],
				[w * 0.38, `rgba(210,228,255,${(0.45 * a).toFixed(2)})`],
				[w * 0.16, `rgba(255,255,255,${a.toFixed(2)})`],
			]) {
				ctx.strokeStyle = col;
				paths.forEach((path, i) => {
					ctx.lineWidth = i ? lw * 0.55 : lw;
					ctx.beginPath();
					path.forEach(([px, py], j) => (j ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
					ctx.stroke();
				});
			}
			ctx.restore();
		}
	}
	if (flashA > 0.005) {
		ctx.fillStyle = `rgba(190,210,255,${Math.min(0.75, flashA).toFixed(3)})`;
		ctx.fillRect(0, 0, cw, ch);
		flashA *= Math.exp(-dt / 0.09);
	} else flashA = 0; // the sky lights from inside, once, and is gone in a tenth of a second
}
// the horizon: a band of sky along the top of the glass, coloured by the hour and the weather; clouds cross it with the wind, the storm's front walks it
const SKY = {
	day: [120, 170, 225],
	dusk: [235, 150, 80],
	night: [16, 22, 48],
	rain: [120, 130, 145],
	storm: [50, 56, 70],
	blizzard: [205, 210, 220],
	drought: [220, 190, 130],
	frost: [185, 205, 230],
};
function drawSky() {
	const nt = G.night,
		dusk = 4 * nt * (1 - nt),
		wx = G.wx,
		e = G.ev.cur,
		stormy = e && e.kind === 'storm',
		h = Math.round(Math.min(ch * 0.16, 110));
	const mix = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f)),
		base = mix(mix(SKY.day, SKY.dusk, dusk), SKY.night, nt),
		cast = stormy ? SKY.storm : SKY[wx],
		col = cast ? mix(base, cast, wx === 'rain' ? 0.7 : 0.55) : base;
	const top = (parseFloat(getComputedStyle($('stage')).getPropertyValue('--hb')) || 86) + 2; // the fade begins under the top bars
	const gr = ctx.createLinearGradient(0, top, 0, top + h);
	gr.addColorStop(0, `rgba(${col},.6)`);
	gr.addColorStop(1, `rgba(${col},0)`);
	ctx.fillStyle = `rgba(${col},.6)`;
	ctx.fillRect(0, 0, cw, top); // the sky runs to the top of the screen, under the bars (Albert, Nov 2)
	ctx.fillStyle = gr;
	ctx.fillRect(0, top, cw, h);
	if (still()) return;
	const now = performance.now() / 1000,
		cloudy = stormy
			? 1
			: wx === 'rain'
				? 0.8
				: wx === 'blizzard'
					? 0.9
					: wx === 'clear' || wx === 'drought'
						? 0.25
						: 0.5,
		dark = stormy ? 0.75 : wx === 'rain' ? 0.5 : 0.2;
	const c = mix(mix([245, 248, 252], [60, 66, 80], dark), SKY.night, nt * 0.8);
	ctx.fillStyle = `rgba(${c},${0.5 * cloudy})`;
	for (let i = 0; i < 7; i++) {
		const sp = 6 + (i % 3) * 3,
			x = ((i * 173 + now * sp * (0.4 + wind)) % (cw + 240)) - 120,
			y = 8 + (i % 3) * 9,
			rw = 60 + (i % 4) * 22;
		ctx.beginPath();
		ctx.ellipse(x, top + y, rw, 10 + (i % 2) * 5, 0, 0, 7);
		ctx.ellipse(x + rw * 0.5, top + y - 4, rw * 0.55, 9, 0, 0, 7);
		ctx.fill();
	}
}
// the whole forest as one picture, for far views and the small map; redrawn when trees fall, at most once a second
let forestCv = null,
	forestV = -1,
	forestT = 0,
	forestG = null;
function forestLayer() {
	const now = performance.now();
	if (forestCv && forestG === G && (forestV === G.treeV || now - forestT < 1000)) return forestCv;
	if (!forestCv) {
		forestCv = document.createElement('canvas');
		forestCv.width = forestCv.height = MAP * bgK;
	}
	const f = forestCv.getContext('2d');
	f.setTransform(bgK, 0, 0, bgK, 0, 0);
	f.clearRect(0, 0, MAP, MAP);
	for (const [col, r] of [
		['#1c3a1c', TREE.crown[0]],
		['#2b5427', TREE.crown[1]],
	]) {
		f.fillStyle = col;
		f.beginPath();
		for (const n of G.nodes)
			if (n.kind === 'tree' && n.amt > 0) {
				f.moveTo(n.x + r, n.y);
				f.arc(n.x, n.y, r, 0, 7);
			}
		f.fill();
	}
	forestV = G.treeV;
	forestT = now;
	forestG = G;
	return forestCv;
}
