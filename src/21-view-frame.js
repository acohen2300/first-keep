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
		const bank = L.river ? 14 : 26,
			sand = b.createRadialGradient(L.x, L.y, L.r - 4, L.x, L.y, L.r + bank);
		sand.addColorStop(0, 'rgba(206,190,138,1)');
		sand.addColorStop(0.5, 'rgba(196,180,128,.85)');
		sand.addColorStop(1, 'rgba(196,180,128,0)');
		b.fillStyle = sand;
		b.beginPath();
		b.arc(L.x, L.y, L.r + bank, 0, 7);
		b.fill();
	} // every shore first, then every water, so the pools of a river run together instead of reading as beads (Build 50)
	for (const L of G.lakes) {
		if (L.river) {
			b.fillStyle = '#2f6c8e';
			b.beginPath();
			b.arc(L.x, L.y, L.r + 2, 0, 7);
			b.fill();
			continue;
		} // a river is one even colour: shallow, running water
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
	followCam();
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
	} // a sinkhole or a falling star: the whole view judders for a moment
	layer(scarCv);
	drawFlood(z);
	drawSand(z);
	drawLakeRipples(z);
	if (sn.tint) {
		ctx.fillStyle = sn.tint;
		ctx.fillRect(x0, y0, MAP * z, MAP * z * TILT);
	}
	drawRainRings(z);
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
	drawFire(z, inView);
	drawFogLayer(z);
	sparkDraw();
	ripDraw();
	drawEvents(z);
	drawOrders(z);
	drawReticle();
	if (G.rally0) flagAt(SX(G.rally0.x), SY(G.rally0.y), G.P[0].color, z);
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
		if (SET.mini && now - miniT > 150) {
			miniT = now;
			drawMini();
		}
	} // the map corner needs no more than seven looks a second
}
