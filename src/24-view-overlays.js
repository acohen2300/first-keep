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
			ls = landXY(sp.x, sp.y),
			lb = landXY(b.x, b.y);
		for (const [same, ax] of [
			[Math.abs(ls.x - lb.x) < GUIDE_ON, 'y'],
			[Math.abs(ls.y - lb.y) < GUIDE_ON, 'x'],
		])
			if (same) {
				// the line through both, in the land's frame, a little past each
				const lo = Math.min(ls[ax], lb[ax]) - 12 - h - bh,
					hi = Math.max(ls[ax], lb[ax]) + 12 + h + bh,
					p0 = landAt(ax === 'x' ? lo : ls.x, ax === 'y' ? lo : ls.y),
					p1 = landAt(ax === 'x' ? hi : ls.x, ax === 'y' ? hi : ls.y);
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
