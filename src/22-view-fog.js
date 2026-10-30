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
	ctx.font = '700 12px ' + fontF();
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
	fogImg = null,
	fogT = -1;
// the woods block sight (Build 61, Albert: lifelike lines of sight): a fog square holding three or more standing trees is a wall of canopy;
// you see the square itself, the edge of the wood, and nothing behind it on that line. Rebuilt when a tree falls or grows.
let WOODS = { v: -1, G: null, grid: null };
function woodsGrid() {
	if (WOODS.G === G && WOODS.v === G.treeV) return WOODS.grid;
	const grid = new Uint8Array(FOGN * FOGN),
		n = new Uint8Array(FOGN * FOGN);
	for (const t of G.nodes) if (t.kind === 'tree' && t.amt > 0) n[clamp((t.y / FOG) | 0, 0, FOGN - 1) * FOGN + clamp((t.x / FOG) | 0, 0, FOGN - 1)]++;
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
