// ═════ 21-view-frame.js: the ground texture and the draw of one frame ═════
// the ground: one soft picture at half detail for the big shapes, a sharp grass texture over it when you are close
function makeBg() {
	const N = MAP * bgK;
	bg = document.createElement('canvas');
	bg.width = bg.height = N;
	const b = bg.getContext('2d');
	b.scale(bgK, bgK);
	const R = (a, z) => a + Math.random() * (z - a);
	b.fillStyle = '#4a6634';
	b.fillRect(0, 0, MAP, MAP);
	const blot = (n, cols, r0, r1) => {
		for (let i = 0; i < n; i++) {
			b.fillStyle = cols[i % cols.length];
			b.beginPath();
			b.ellipse(Math.random() * MAP, Math.random() * MAP, R(r0, r1), R(r0, r1) * 0.7, R(0, 3), 0, 7);
			b.fill();
		}
	};
	blot(1400, ['rgba(88,124,56,.22)', 'rgba(52,78,38,.22)', 'rgba(104,128,60,.16)'], 20, 90);
	blot(220, ['rgba(122,100,62,.16)', 'rgba(140,118,76,.12)'], 10, 34);
	for (let i = 0; i < 500; i++) {
		b.fillStyle = Math.random() < 0.5 ? 'rgba(230,220,120,.5)' : 'rgba(235,235,245,.45)';
		b.beginPath();
		b.arc(Math.random() * MAP, Math.random() * MAP, 2.4, 0, 7);
		b.fill();
	}
	for (const L of G.lakes) {
		const sand = b.createRadialGradient(L.x, L.y, L.r - 4, L.x, L.y, L.r + 26);
		sand.addColorStop(0, 'rgba(206,190,138,1)');
		sand.addColorStop(0.5, 'rgba(196,180,128,.85)');
		sand.addColorStop(1, 'rgba(196,180,128,0)');
		b.fillStyle = sand;
		b.beginPath();
		b.arc(L.x, L.y, L.r + 26, 0, 7);
		b.fill();
		const lg = b.createRadialGradient(L.x - L.r * 0.2, L.y - L.r * 0.2, 10, L.x, L.y, L.r + 2);
		lg.addColorStop(0, '#1b4466');
		lg.addColorStop(0.7, '#2a6488');
		lg.addColorStop(0.95, '#4e93ad');
		lg.addColorStop(1, '#79b2bf');
		b.fillStyle = lg;
		b.beginPath();
		b.arc(L.x, L.y, L.r + 2, 0, 7);
		b.fill();
	}
	{
		const L = LAKE0,
			R = THRONE.isle,
			W = THRONE.cause; // the Throne's island and its four causeways: stone over the water
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
			const len = L.r + 30;
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
	terrainMini = document.createElement('canvas');
	terrainMini.width = terrainMini.height = 172;
	terrainMini.getContext('2d').drawImage(bg, 0, 0, 172, 172);
	// a 64-unit square of grass blades, repeated
	const t = document.createElement('canvas');
	t.width = t.height = 128;
	const q = t.getContext('2d');
	q.lineCap = 'round';
	for (let i = 0; i < 260; i++) {
		const x = Math.random() * 128,
			y = Math.random() * 128;
		q.strokeStyle = Math.random() < 0.5 ? 'rgba(28,48,22,.42)' : 'rgba(140,170,90,.32)';
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
function draw() {
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	const z = cam.z,
		x0 = SX(0),
		y0 = SY(0),
		sn = season();
	{
		const a = toWorld(0, 0),
			b = toWorld(cw, ch);
		if (a.x < 0 || a.y < 0 || b.x > MAP || b.y > MAP) {
			ctx.fillStyle = '#0b0f0d';
			ctx.fillRect(0, 0, cw, ch);
		}
	} // beyond the map's edge: dark; the map itself is painted over in full
	ctx.imageSmoothingEnabled = true;
	const layer = (img) => {
		const a = toWorld(0, 0),
			b2 = toWorld(cw, ch),
			sx0 = clamp(a.x, 0, MAP),
			sy0 = clamp(a.y, 0, MAP),
			sx1 = clamp(b2.x, 0, MAP),
			sy1 = clamp(b2.y, 0, MAP);
		if (sx1 > sx0 && sy1 > sy0)
			ctx.drawImage(
				img,
				sx0 * bgK,
				sy0 * bgK,
				(sx1 - sx0) * bgK,
				(sy1 - sy0) * bgK,
				SX(sx0),
				SY(sy0),
				(sx1 - sx0) * z,
				(sy1 - sy0) * z * TILT,
			);
	};
	layer(bg);
	if (z > 1.1 && grassPat) {
		if (grassM.a !== z * 0.5 || grassM.e !== x0 || grassM.f !== y0) {
			grassM.a = z * 0.5;
			grassM.d = z * 0.5 * TILT;
			grassM.e = x0;
			grassM.f = y0;
			grassPat.setTransform(grassM);
		}
		ctx.globalAlpha = Math.min(1, (z - 1.1) * 1.5);
		ctx.fillStyle = grassPat;
		ctx.fillRect(Math.max(0, x0), Math.max(0, y0), Math.min(cw, MAP * z), Math.min(ch, MAP * z * TILT));
		ctx.globalAlpha = 1;
	}
	if (G.shake > G.t && !lessMotion) {
		const k = (G.shake - G.t) * 3;
		ctx.translate(rnd2() * k, rnd2() * k);
	} // a tremor: the whole view judders for a moment
	layer(scarCv);
	if (G.flood > G.t) {
		ctx.fillStyle = 'rgba(42,100,136,.55)';
		for (const L of G.lakes) {
			ctx.beginPath();
			ctx.ellipse(SX(L.x), SY(L.y), (L.r + EVENTS.flood.rise) * z, (L.r + EVENTS.flood.rise) * z * TILT, 0, 0, 7);
			ctx.fill();
		}
	} // the flood: water over the shore
	if (G.sand && G.sand.until > G.t) {
		const s = G.sand;
		ctx.fillStyle = 'rgba(200,180,120,.7)';
		ctx.beginPath();
		ctx.ellipse(SX(s.x), SY(s.y), s.r * z, s.r * z * TILT, 0, 0, 7);
		ctx.fill();
		ctx.strokeStyle = 'rgba(120,100,60,.5)';
		ctx.lineWidth = 1;
		for (let i = 1; i <= 3; i++) {
			ctx.beginPath();
			ctx.ellipse(SX(s.x), SY(s.y), (s.r * z * i) / 4, (s.r * z * TILT * i) / 4, 0, 0, 7);
			ctx.stroke();
		}
	} // quicksand: a pale patch with ripples
	if (!lessMotion) {
		ctx.strokeStyle = 'rgba(220,240,255,.28)';
		ctx.lineWidth = 1.2;
		for (const L of G.lakes) {
			if (Math.abs(L.x - cam.x) > cw / cam.z / 2 + L.r || Math.abs(L.y - cam.y) > ch / cam.z / TILT / 2 + L.r) continue;
			for (let i = 0; i < 18; i++) {
				const a = i * 2.4 + G.t * 0.05,
					r = L.r * (0.25 + 0.6 * ((i * 0.37 + G.t * 0.02) % 1));
				const lx = SX(L.x + Math.cos(a) * r),
					ly = SY(L.y + Math.sin(a) * r);
				ctx.beginPath();
				ctx.moveTo(lx - 6 * z, ly);
				ctx.quadraticCurveTo(lx, ly - 2 * z, lx + 6 * z, ly);
				ctx.stroke();
			}
		}
	}
	if (sn.tint) {
		ctx.fillStyle = sn.tint;
		ctx.fillRect(x0, y0, MAP * z, MAP * z * TILT);
	}
	if (G.wx === 'rain' && z > 1.2 && !lessMotion) {
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
					px = SX((gx + (h & 255) / 256) * C),
					py = SY((gy + ((h >> 16) & 255) / 256) * C);
				ctx.moveTo(px + r, py);
				ctx.ellipse(px, py, r, r * TILT, 0, 0, 7);
			}
		ctx.stroke();
	}
	drawGround(); // the weather's mark on the land, under everything standing
	drawPicks(z); // the pick rings lie on the ground, under the figure and the building (Albert, Build 40)
	// everything standing, back to front
	// what is on screen: margins in world units, wide enough for the widest building (its turned east wall) and the tallest (a wonder, standing just below the edge)
	const a0 = toWorld(0, 0),
		b0 = toWorld(cw, ch),
		mx = Math.max(80 / z, 44),
		wv = { x: a0.x - mx, y: a0.y - Math.max(120 / (z * TILT), 34) },
		wv2 = { x: b0.x + mx, y: b0.y + Math.max(160 / (z * TILT), 115) },
		inView = (e) => e.x > wv.x && e.x < wv2.x && e.y > wv.y && e.y < wv2.y;
	const list = [];
	for (const b of G.blds)
		if (inView(b) && trapShown(b) && known0(b)) list.push([BLD[b.kind].crop ? b.y - 60 : b.y + halfOf(b) * 0.4, 1, b]);
	const far = z < 0.55;
	if (far) layer(forestLayer()); // zoomed out, the forest is one picture; close in, each tree
	for (const f of G.finds) if (inView(f) && !(f.done && FINDS[f.kind].got)) list.push([f.y, 3, f]);
	for (const u of G.units) if (!u.inside && inView(u) && visibleTo0(u)) list.push([u.y, 2, u]);
	list.sort((a, b) => a[0] - b[0]);
	const N = viewNodes(wv, wv2, far),
		sB = quant(z * dpr),
		sU = quant(z * dpr * FIG);
	// the standing nodes (about 2,000 trees, bushes and rocks) are kept sorted until the view moves a step; the few moving things are merged in
	for (let i = 0, j = 0; i < N.length || j < list.length; ) {
		const take = j >= list.length || (i < N.length && N[i].y < list[j][0]),
			e = take ? N[i++] : list[j][2],
			t = take ? 0 : list[j++][1];
		try {
			t === 0 ? drawNode(e, sB) : t === 1 ? drawBld(e, sB) : t === 2 ? drawUnit(e, sU) : drawFind(e);
		} catch (er) {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = 'source-over';
			ctx.setLineDash([]);
			fault(er);
		} // one bad piece must never take the rest of the picture with it: the canvas is put back as it was
	}
	if (G.fire)
		for (const n of G.fire)
			if (inView(n)) {
				const x = SX(n.x),
					y = SY(n.y),
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
	if (SET.fog) {
		if (fogT < 0) fogTick();
		const a1 = toWorld(0, 0),
			b1 = toWorld(cw, ch),
			sx0 = clamp(a1.x, 0, MAP),
			sy0 = clamp(a1.y, 0, MAP),
			sx1 = clamp(b1.x, 0, MAP),
			sy1 = clamp(b1.y, 0, MAP);
		ctx.imageSmoothingEnabled = true;
		if (sx1 > sx0 && sy1 > sy0)
			ctx.drawImage(
				fogLayer(),
				sx0 / FOG,
				sy0 / FOG,
				(sx1 - sx0) / FOG,
				(sy1 - sy0) / FOG,
				SX(sx0),
				SY(sy0),
				(sx1 - sx0) * z,
				(sy1 - sy0) * z * TILT,
			);
	} // the fog, soft, over everything standing
	sparkDraw();
	ripDraw();
	drawEvents(z);
	if (G.ords) {
		// your groups on the march: a dashed line from the group to where it is going, a ring where it will stand
		ctx.save();
		ctx.strokeStyle = G.P[0].color;
		ctx.lineWidth = 1.5;
		ctx.globalAlpha = 0.7;
		ctx.setLineDash([6, 6]);
		ctx.lineDashOffset = -performance.now() / 60;
		for (const id in G.ords) {
			const O = G.ords[id];
			if (O.arrived || O.cx === undefined) continue;
			const ax = SX(O.cx),
				ay = SY(O.cy),
				bx = SX(O.x),
				by = SY(O.y);
			ctx.beginPath();
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
			ctx.stroke();
			ctx.beginPath();
			ctx.ellipse(bx, by, 10 * cam.z, 10 * cam.z * TILT, 0, 0, 7);
			ctx.stroke();
		}
		ctx.restore();
	}
	if (G.rally0) flagAt(SX(G.rally0.x), SY(G.rally0.y), G.P[0].color, z);
	ctx.strokeStyle = 'rgba(255,238,200,.85)';
	ctx.lineWidth = 1.2;
	for (const t of G.tracers) {
		// a short streak along the curve: the head and a point just behind it
		const p = 1 - t.life / t.dur,
			q = Math.max(0, p - 0.12),
			at = (f) => [
				SX(t.x1 + (t.x2 - t.x1) * f),
				SY(t.y1 + (t.y2 - t.y1) * f, t.h1 + (6 - t.h1) * f + 4 * t.arc * f * (1 - f)),
			];
		const [ax, ay] = at(q),
			[bx, by] = at(p);
		ctx.beginPath();
		ctx.moveTo(ax, ay);
		ctx.lineTo(bx, by);
		ctx.stroke();
	}
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
	if (nt > 0) {
		if (nt > 0.5)
			for (const b of G.blds)
				if (inView(b) && b.prog >= 1 && (b.kind === 'house' || b.kind === 'apartment' || b.kind === 'keep')) {
					ctx.fillStyle = 'rgba(255,200,110,.75)';
					ctx.fillRect(SX(b.x) + 3 * z, SY(b.y + halfOf(b) * 0.9, 6), 2 * z, 2 * z);
				}
	}
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
	if (G.whiteT !== undefined && G.t - G.whiteT < 0.9) {
		ctx.globalAlpha = 0.55 * (1 - (G.t - G.whiteT) / 0.9);
		ctx.fillStyle = '#fff6dc';
		ctx.fillRect(0, 0, cw, ch);
		ctx.globalAlpha = 1;
	} // a new age, a wonder, a victory
	drawSky();
	drawWeather();
	drawRadar(wv, wv2);
	{
		const seen = new Set();
		ctx.setLineDash([5, 5]);
		ctx.strokeStyle = 'rgba(192,138,88,.6)';
		ctx.lineWidth = 1.5; // boxes of trees being cut
		for (const u of G.units)
			if (u.owner === 0 && u.patch && !seen.has(u.patch.x0)) {
				seen.add(u.patch.x0);
				const r = u.patch;
				ctx.strokeRect(SX(r.x0), SY(r.y0), (r.x1 - r.x0) * z, (r.y1 - r.y0) * z * TILT);
			}
		if (G.press && performance.now() - G.press.t > 90) {
			const f = Math.min(1, (performance.now() - G.press.t) / HOLD_MS);
			ctx.strokeStyle = 'rgba(255,211,94,.85)';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(G.press.x, G.press.y, 26, -Math.PI / 2, -Math.PI / 2 + f * 6.2832);
			ctx.stroke();
		} // the ring fills: let go and it is a tap, hold and drag and it is a box
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
	drawGhost();
	{
		const now = performance.now();
		if (SET.mini && now - miniT > 150) {
			miniT = now;
			drawMini();
		}
	} // the map corner needs no more than seven looks a second
}
