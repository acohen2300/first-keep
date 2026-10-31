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
					const sx = SX(gx * FOG + FOG / 2),
						sy = SY(gy * FOG + FOG / 2);
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
			x = SX(c.x),
			y = SY(c.y);
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
let FONTF = null;
const fontF = () => FONTF || (FONTF = getComputedStyle(document.body).fontFamily);
function idleMark(x, y, z) {
	ctx.font = '700 ' + Math.max(11, 9 * z) + 'px ' + fontF();
	ctx.fillStyle = '#ffd35e';
	ctx.strokeStyle = 'rgba(0,0,0,.7)';
	ctx.lineWidth = 2.5;
	ctx.strokeText('z', x + 4 * z, y);
	ctx.fillText('z', x + 4 * z, y);
}
function tag(text, x, y) {
	ctx.font = '600 13px ' + fontF();
	const w = ctx.measureText(text).width + 10;
	x = clamp(x, 4, cw - w - 4);
	ctx.fillStyle = 'rgba(18,23,21,.92)';
	ctx.fillRect(x, y - 13, w, 19);
	ctx.fillStyle = '#fff';
	ctx.fillText(text, x + 5, y + 1);
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
	if (!P.length) return tag('Sealed', SX(k.x) - 22, SY(k.y) - 40);
	ctx.strokeStyle = '#de5a44';
	ctx.lineWidth = 3;
	ctx.setLineDash([8, 6]);
	ctx.beginPath();
	P.forEach((q, i) => (i ? ctx.lineTo(SX(q.x), SY(q.y)) : ctx.moveTo(SX(q.x), SY(q.y))));
	ctx.stroke();
	ctx.setLineDash([]);
	const e = P[0];
	tag('Open: a foe walks in', SX(e.x) - 50, SY(e.y) - 10);
}
// alignment guides (Build 63): a thin line from the ghost to every own building whose centre or edge sits on the same line, as a PDF
// editor draws them while an element moves; the snap pull toward them is snapGhost's
function drawGuides(sp, h) {
	ctx.save();
	ctx.strokeStyle = 'rgba(120,220,255,.8)';
	ctx.lineWidth = 1;
	ctx.setLineDash([4, 4]);
	ctx.beginPath();
	for (const b of G.blds) {
		if (
			b.owner !== 0 ||
			b.hp <= 0 ||
			BLD[b.kind].wallish ||
			Math.abs(b.x - sp.x) >= GUIDE_R ||
			Math.abs(b.y - sp.y) >= GUIDE_R
		)
			continue;
		const bh = halfOf(b);
		for (const [gx, bx] of [
			[sp.x, b.x],
			[sp.x - h, b.x - bh],
			[sp.x + h, b.x + bh],
			[sp.x - h, b.x + bh],
			[sp.x + h, b.x - bh],
		])
			if (Math.abs(gx - bx) < 0.5) {
				const y0 = Math.min(sp.y - h, b.y - bh) - 12,
					y1 = Math.max(sp.y + h, b.y + bh) + 12;
				ctx.moveTo(SX(gx), SY(y0));
				ctx.lineTo(SX(gx), SY(y1));
			}
		for (const [gy, by] of [
			[sp.y, b.y],
			[sp.y - h, b.y - bh],
			[sp.y + h, b.y + bh],
			[sp.y - h, b.y + bh],
			[sp.y + h, b.y - bh],
		])
			if (Math.abs(gy - by) < 0.5) {
				const x0 = Math.min(sp.x - h, b.x - bh) - 12,
					x1 = Math.max(sp.x + h, b.x + bh) + 12;
				ctx.moveTo(SX(x0), SY(gy));
				ctx.lineTo(SX(x1), SY(gy));
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
	if (kind === 'wall') {
		const cells = pl.cells || [toCell(pl.at)];
		let bad = 0;
		for (const c of cells) {
			const ok = !canPlace(0, 'wall', c.gx * NAVC + 5, c.gy * NAVC + 5);
			if (!ok) bad++;
			ctx.fillStyle = ok ? 'rgba(120,220,120,.55)' : 'rgba(222,90,68,.65)';
			ctx.fillRect(SX(c.gx * NAVC), SY(c.gy * NAVC), NAVC * z, NAVC * z * TILT);
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
			`${cells.length} × ${B.cost.s} stone${bad ? ' · ' + bad + ' blocked' : ''}`,
			SX(last.gx * NAVC) + 12,
			SY(last.gy * NAVC) - 14,
		);
		return;
	}
	const sp = pl.at,
		n = B.fp * NAVC,
		why = canPlace(0, kind, sp.x, sp.y),
		ok = !why;
	pl.why = why;
	// the build grid shows while a ghost is held (Build 61, Albert: "other games lock buildings to grids better"): the squares the
	// footprint snaps to, four out from it on every side, with the ones already taken filled darker
	const g0x = Math.round(sp.x / NAVC) - B.fp / 2 - 4,
		g0y = Math.round(sp.y / NAVC) - B.fp / 2 - 4,
		gn = B.fp + 8;
	ctx.strokeStyle = 'rgba(255,255,255,.28)';
	ctx.lineWidth = 1;
	ctx.beginPath();
	for (let i = 0; i <= gn; i++) {
		ctx.moveTo(SX((g0x + i) * NAVC), SY(g0y * NAVC));
		ctx.lineTo(SX((g0x + i) * NAVC), SY((g0y + gn) * NAVC));
		ctx.moveTo(SX(g0x * NAVC), SY((g0y + i) * NAVC));
		ctx.lineTo(SX((g0x + gn) * NAVC), SY((g0y + i) * NAVC));
	}
	ctx.stroke();
	ctx.fillStyle = 'rgba(40,30,20,.22)';
	for (let i = 0; i < gn; i++)
		for (let j = 0; j < gn; j++) {
			const cx = (g0x + i) * NAVC + NAVC / 2,
				cy = (g0y + j) * NAVC + NAVC / 2;
			if (cx < 0 || cy < 0 || cx >= MAP || cy >= MAP) continue;
			const ci = Math.floor(cy / NAVC) * NC + Math.floor(cx / NAVC);
			if (!NAV.solid[ci] && !NAV.lake[ci]) continue;
			ctx.fillRect(SX((g0x + i) * NAVC), SY((g0y + j) * NAVC), NAVC * z, NAVC * z * TILT);
		}
	ctx.fillStyle = ok ? 'rgba(110,210,110,.35)' : 'rgba(222,90,68,.38)';
	ctx.fillRect(SX(sp.x - n / 2), SY(sp.y - n / 2), n * z, n * z * TILT);
	ctx.strokeStyle = ok ? '#7ee07e' : '#de5a44';
	ctx.lineWidth = 2;
	ctx.strokeRect(SX(sp.x - n / 2), SY(sp.y - n / 2), n * z, n * z * TILT);
	drawGuides(sp, n / 2);
	const s = quant(z * dpr),
		c = bldSprite({ kind, owner: 0 }, s);
	ctx.globalAlpha = 0.6;
	stamp(c, SX(sp.x), SY(sp.y), z / s);
	flagsOn(c, SX(sp.x), SY(sp.y), z, G.P[0].color, 0);
	ctx.globalAlpha = 1;
	tag(why || `${B.name} · ${costText(B.cost)}`, SX(sp.x - n / 2), SY(sp.y - n / 2) - 8 - (BLD[kind].h + 10) * z);
}
function miniIncoming(m, k) {
	const I = G.incoming;
	if (!I) return;
	const x = I.x * k,
		y = I.y * k,
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
function drawMini() {
	const m = mctx,
		k = 172 / MAP;
	m.clearRect(0, 0, 172, 172);
	m.drawImage(terrainMini, 0, 0);
	m.drawImage(forestLayer(), 0, 0, 172, 172);
	if (G.fogOn) {
		m.imageSmoothingEnabled = false;
		m.drawImage(fogLayer(), 0, 0, 172, 172);
	}
	for (const f of G.finds)
		if ((!f.done || FINDS[f.kind].capture) && known0(f)) {
			m.fillStyle = f.owner !== null && FINDS[f.kind].capture ? G.P[f.owner].color : '#f2cf55';
			m.fillRect(f.x * k - 1.5, f.y * k - 1.5, 3, 3);
		}
	for (const b of G.blds) {
		// Town Centers are stars, castles diamonds, the rest small squares
		if (!knownB(b)) continue;
		m.fillStyle = G.P[b.owner].color;
		const x = b.x * k,
			y = b.y * k;
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
			m.fillRect(u.x * k - 1, u.y * k - 1, 2, 2);
		}
	if (G.mirage && G.mirage.until > G.t) {
		m.fillStyle = '#de5a44';
		for (let i = 0; i < G.mirage.n; i++)
			m.fillRect((G.mirage.x + (i % 4) * 14 - 20) * k - 1, (G.mirage.y + Math.floor(i / 4) * 14 - 14) * k - 1, 2, 2);
	} // the mirage
	miniIncoming(m, k);
	const a = toWorld(0, 0),
		b = toWorld(cw, ch);
	m.strokeStyle = '#fff';
	m.lineWidth = 1.5;
	m.strokeRect(a.x * k, a.y * k, (b.x - a.x) * k, (b.y - a.y) * k);
}
// the flood: water over the shore
function drawFlood(z) {
	if (G.flood > G.t) {
		ctx.fillStyle = 'rgba(42,100,136,.55)';
		ctx.beginPath();
		for (const L of G.lakes) {
			const r = (L.r + EVENTS.flood.rise) * z;
			ctx.moveTo(SX(L.x) + r, SY(L.y));
			ctx.ellipse(SX(L.x), SY(L.y), r, r * TILT, 0, 0, 7);
		}
		ctx.fill(); // one shape, so a river's overlapping pools do not darken where they meet (Build 52)
	} // the flood: water over the shore
}
// quicksand: a pale patch with ripples
function drawSand(z) {
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
					px = SX((gx + (h & 255) / 256) * C),
					py = SY((gy + ((h >> 16) & 255) / 256) * C);
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
}
// the fog, soft, over everything standing
function drawFogLayer(z) {
	if (G.fogOn) {
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
}
// your groups on the march: a dashed line from the group to where it is going, a ring where it will stand
function drawOrders(z) {
	if (!G.ords || G.over) return; // the end screen is not drawn through (Albert, Oct 30: a ring's "156s" showed behind Victory)
	// your groups: a dashed line from the group to where it is going, a ring to tap, the time left beside it.
	// Once arrived the ring stays, faint, so the order can still be tapped (Build 42)
	ctx.save();
	ctx.strokeStyle = G.P[0].color;
	ctx.fillStyle = G.P[0].color;
	ctx.font = '700 11px system-ui, sans-serif';
	ctx.textAlign = 'center';
	for (const id in G.ords) {
		const O = G.ords[id];
		const bx = SX(O.x),
			by = SY(O.y),
			r = 14 * cam.z;
		ctx.setLineDash([6, 6]);
		ctx.lineWidth = 1.5;
		if (!O.arrived && O.cx !== undefined) {
			ctx.globalAlpha = 0.7;
			ctx.lineDashOffset = -performance.now() / 60;
			ctx.beginPath();
			ctx.moveTo(SX(O.cx), SY(O.cy));
			ctx.lineTo(bx, by);
			ctx.stroke();
		}
		ctx.globalAlpha = O.arrived ? 0.35 : 0.85;
		ctx.lineWidth = O.arrived ? 1.2 : 2;
		ctx.setLineDash(O.arrived ? [3, 5] : [6, 6]);
		ctx.beginPath();
		ctx.ellipse(bx, by, r, r * TILT, 0, 0, 7);
		ctx.stroke();
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
				SX(t.x1 + (t.x2 - t.x1) * f),
				SY(t.y1 + (t.y2 - t.y1) * f, t.h1 + (6 - t.h1) * f + 4 * t.arc * f * (1 - f)),
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
				ctx.fillRect(SX(b.x) + 3 * z, SY(b.y + halfOf(b) * 0.9, 6), 2 * z, 2 * z);
			}
	if (!SET.lights || (nt < 0.05 && G.wx !== 'rain' && !G.blds.some((b) => b.fire > 0))) return;
	for (const b of G.blds) {
		if (!inView(b) || !knownB(b)) continue;
		const B = BLD[b.kind];
		if (b.fire > 0 || b.hp < maxHpB(b.owner, b.kind) * 0.5) glow(SX(b.x), SY(b.y), 'blaze', z);
		else if (b.prog >= 1 && HEARTH.has(b.kind))
			glow(
				SX(b.x),
				SY(b.y) + halfOf(b) * TILT * 0.4,
				'hearth',
				z,
				1 +
					0.5 *
						(b.owner === WILD ? 0 : upTier(b.kind === 'keep' || b.kind === 'town' ? 'house' : b.kind, G.P[b.owner])),
			); // the Home line lights the hearth more
		else if (b.prog >= 1 && !B.wallish && !B.crop && b.owner !== WILD && fxv(b.owner, 'lamp', bldKeys(b.kind)).a > 0) {
			const x = SX(b.x) - halfOf(b) * z * 0.6,
				y = SY(b.y) + halfOf(b) * TILT * z * 0.5;
			glow(x, y, 'lantern', z);
			flame(x, y - 3 * z, 'lantern', z * 0.7, b.id);
		} // Lanterns: one at every door
	}
	for (const f of G.finds)
		if (f.kind === 'camp' && !f.done && inView(f) && known0(f)) glow(SX(f.x), SY(f.y), 'campfire', z);
	for (const u of G.units)
		if (u.kind === 'caravan' && u.hp > 0 && !u.inside && inView(u) && visibleTo0(u)) {
			const x = SX(u.x) + 5 * z,
				y = SY(u.y) - 9 * z;
			glow(SX(u.x), SY(u.y), 'lantern', z);
			flame(x, y, 'lantern', z * 0.8, u.id);
		}
	for (const s of STANDARDS) {
		glow(s.x, s.y, 'torch', z);
		flame(s.x, s.y - 30 * z, 'torch', z, s.o);
	}
}
const HEARTH = new Set(['house', 'apartment', 'keep', 'town']); // where a fire is always lit after dark
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
