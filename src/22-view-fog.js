// ═════ 22-view-fog.js: the minimap and the fog of war ═════
// Enemy soldiers close to your Town Center but off screen: a red marker on the edge, pointing at them. Tap it to look.
let RADAR = null;
function drawRadar(wv, wv2) {
	RADAR = null;
	const k = keepOf(0);
	if (!k || G.over) return;
	let near = null,
		nd = Infinity; // the nearest foe within 520 of your Town Center, or any army marching on you, however far
	for (const u of G.sol || []) {
		if (u.owner === 0 || u.owner === WILD || u.hp <= 0 || u.inside || !atWar(0, u.owner)) continue;
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
	for (const u of G.sol || []) if (u.owner === near.owner && u.hp > 0 && dist(u, near) < 150) n++;
	const px = SX(near.x),
		py = SY(near.y),
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
		pulse = lessMotion ? 0 : Math.sin(G.t * 6) * 2;
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
	ctx.font = '700 13px ' + fontF();
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
const seen0 = (e) => !SET.fog || friendly(0, e.owner) || fogAt(e.x, e.y) === 2; // in your sight now, or yours
const known0 = (e) => !SET.fog || friendly(0, e.owner) || fogAt(e.x, e.y) > 0; // ever seen: a building you found stays on the map
const visibleTo0 = (u) => (u.kind !== 'spy' || friendly(0, u.owner) || u.exposed) && seen0(u);
let fogCv = null,
	fogImg = null,
	fogT = -1;
function fogTick() {
	// every ten ticks: what is lit now
	const F = G.fog;
	for (let i = 0; i < F.length; i++) if (F[i] === 2) F[i] = 1;
	const light = (x, y, r) => {
		const c = r / FOG + 0.5,
			cx = x / FOG,
			cy = y / FOG,
			x0 = clamp((cx - c) | 0, 0, FOGN - 1),
			x1 = clamp((cx + c) | 0, 0, FOGN - 1),
			y0 = clamp((cy - c) | 0, 0, FOGN - 1),
			y1 = clamp((cy + c) | 0, 0, FOGN - 1);
		for (let gy = y0; gy <= y1; gy++)
			for (let gx = x0; gx <= x1; gx++) if (hyp(gx + 0.5 - cx, gy + 0.5 - cy) <= c) F[gy * FOGN + gx] = 2;
	};
	for (const u of G.units) if (u.hp > 0 && friendly(0, u.owner) && !u.inside) light(u.x, u.y, sightOf(u));
	for (const b of G.blds) if (b.hp > 0 && b.prog >= 1 && friendly(0, b.owner)) light(b.x, b.y, BLD[b.kind].sight || 90);
	fogT = G.tick;
}
function fogLayer() {
	// the fog as one small picture, drawn soft over the world
	if (!fogCv) {
		fogCv = document.createElement('canvas');
		fogCv.width = fogCv.height = FOGN;
		fogImg = fogCv.getContext('2d').createImageData(FOGN, FOGN);
	}
	const d = fogImg.data,
		F = G.fog;
	for (let i = 0; i < F.length; i++) {
		d[i * 4] = 8;
		d[i * 4 + 1] = 12;
		d[i * 4 + 2] = 10;
		d[i * 4 + 3] = F[i] === 2 ? 0 : F[i] === 1 ? 110 : 235;
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
