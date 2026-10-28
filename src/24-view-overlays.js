// ═════ 24-view-overlays.js: ground, event effects, bars, flags, ghost building, minimap ═════
// Spectacle on the glass: each event's picture, drawn over the world. Light, particles, a real shape; nothing that hides the game.
// the ground after the weather: mud darkens the land, snow whitens it, ice gives it a sheen
function drawGround() {
	const g = G.ground;
	if (!g || (g.mud < 0.02 && g.snow < 0.02 && g.ice < 0.02)) return;
	const w = cw,
		h = ch;
	if (g.mud >= 0.02) {
		ctx.fillStyle = `rgba(70,45,22,${0.22 * g.mud})`;
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = `rgba(50,32,14,${0.3 * g.mud})`;
		const z = cam.z,
			s = 90 * z;
		for (let i = 0; i < 60; i++) {
			const sx = SX((i * 173) % MAP),
				sy = SY((i * 311) % MAP);
			if (sx > -s && sx < w + s && sy > -s && sy < h + s) {
				ctx.beginPath();
				ctx.ellipse(sx, sy, s * (0.5 + (i % 3) * 0.25), s * 0.3, 0, 0, 6.3);
				ctx.fill();
			}
		}
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
function drawEvents(z) {
	const e = G.ev && G.ev.cur,
		t = performance.now() / 1000;
	if (e && e.kind === 'storm' && !lessMotion) {
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
	}
	if (e && e.kind === 'locusts') {
		const x = SX(e.x),
			y = SY(e.y);
		ctx.fillStyle = 'rgba(20,16,8,.28)';
		ctx.beginPath();
		ctx.ellipse(x, y, 70 * z, 40 * z, 0, 0, 7);
		ctx.fill();
		ctx.fillStyle = 'rgba(230,200,120,.9)';
		for (let i = 0; i < 70; i++) {
			const a = i * 2.4 + t * (1 + (i % 5) * 0.3),
				r = (20 + ((i * 37) % 60)) * z;
			ctx.fillRect(
				x + Math.cos(a) * r + Math.sin(t * 7 + i) * 3 * z,
				y + Math.sin(a) * r * TILT - 20 * z + Math.cos(t * 9 + i) * 3 * z,
				2.2 * z,
				1.4 * z,
			);
		}
	} // a dark cloud of specks
	if (e && e.kind === 'meteor') {
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
	}
	if (e && e.kind === 'eclipse') {
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
	} // the corona at the top of the glass
	if (e && e.kind === 'fog') {
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
	}
	if (e && e.kind === 'aurora') {
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
	}
	if (G.wx === 'blizzard' && !lessMotion) {
		ctx.fillStyle = 'rgba(245,248,252,.9)';
		for (let i = 0; i < 160; i++) {
			const y = ((i * 71.9 + t * 90) % (ch + 20)) - 10,
				x = ((i * 113.7 + t * 140 + Math.sin(t * 0.8 + i) * 14) % (cw + 40)) - 20;
			ctx.fillRect(x, y, 2 + (i % 3 === 0), 2 + (i % 3 === 0));
		}
		ctx.fillStyle = 'rgba(235,240,245,.35)';
		ctx.fillRect(0, 0, cw, ch);
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
function drawGhost() {
	const pl = G.place;
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
	ctx.fillStyle = ok ? 'rgba(110,210,110,.35)' : 'rgba(222,90,68,.38)';
	ctx.fillRect(SX(sp.x - n / 2), SY(sp.y - n / 2), n * z, n * z * TILT);
	ctx.strokeStyle = ok ? '#7ee07e' : '#de5a44';
	ctx.lineWidth = 2;
	ctx.strokeRect(SX(sp.x - n / 2), SY(sp.y - n / 2), n * z, n * z * TILT);
	const s = quant(z * dpr),
		c = bldSprite({ kind, owner: 0 }, s);
	ctx.globalAlpha = 0.6;
	stamp(c, SX(sp.x), SY(sp.y), z / s);
	ctx.globalAlpha = 1;
	tag(why || `${B.name} · ${costText(B.cost)}`, SX(sp.x - n / 2), SY(sp.y - n / 2) - 8 - (BLD[kind].h + 10) * z);
}
function drawMini() {
	const m = mctx,
		k = 172 / MAP;
	m.clearRect(0, 0, 172, 172);
	m.drawImage(terrainMini, 0, 0);
	m.drawImage(forestLayer(), 0, 0, 172, 172);
	if (SET.fog) {
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
		if (!known0(b)) continue;
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
		return;
	} // a whiteout: the small map shows nothing
	for (const u of G.units)
		if (u.owner !== WILD ? visibleTo0(u) : !UNIT[u.kind].flee && !UNIT[u.kind].passive && (!SET.fog || seen0(u))) {
			m.fillStyle = G.P[u.owner].color;
			m.fillRect(u.x * k - 1, u.y * k - 1, 2, 2);
		}
	if (G.mirage && G.mirage.until > G.t) {
		m.fillStyle = '#de5a44';
		for (let i = 0; i < G.mirage.n; i++)
			m.fillRect((G.mirage.x + (i % 4) * 14 - 20) * k - 1, (G.mirage.y + Math.floor(i / 4) * 14 - 14) * k - 1, 2, 2);
	} // the mirage
	const a = toWorld(0, 0),
		b = toWorld(cw, ch);
	m.strokeStyle = '#fff';
	m.lineWidth = 1.5;
	m.strokeRect(a.x * k, a.y * k, (b.x - a.x) * k, (b.y - a.y) * k);
}
