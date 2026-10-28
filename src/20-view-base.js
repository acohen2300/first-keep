// ═════ 20-view-base.js: canvas, camera, scars on the ground, tracks, zoom ═════
// ───────────────────────── The view: a tilted table, seen from the south ─────────────────────────
const cv = $('cv'),
	ctx = cv.getContext('2d'),
	mini = $('mini'),
	mctx = mini.getContext('2d');
const cam = { x: 400, y: 1600, z: 0.9 };
const FIG = 0.55; // figures are drawn at 0.55 world units per figure unit: a person stands about 12 tall
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
const TRODE = new Uint16Array((MAP / 20) ** 2);
function resetScars() {
	scarCv = document.createElement('canvas');
	scarCv.width = scarCv.height = MAP * bgK;
	scarX = scarCv.getContext('2d');
	scarX.scale(bgK, bgK);
	TRODE.fill(0);
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
function tread(u) {
	// a villager's step: after enough of them on one patch the earth shows it
	const c = ((u.y / 20) | 0) * (MAP / 20) + ((u.x / 20) | 0);
	if (++TRODE[c] % 260 === 0 && TRODE[c] < 5000) {
		scarX.fillStyle = 'rgba(120,92,58,.07)';
		scarX.beginPath();
		scarX.ellipse(u.x, u.y, 5.5, 3, 0, 0, 7);
		scarX.fill();
	}
}
// a small parchment tab with a book in red ink, and a count when more than one thing waits
function researchBadge(x, y, s, n) {
	const w = (n > 1 ? 31 : 23) * s,
		h = 17 * s,
		q = lessMotion ? 0 : Math.sin(G.t * 4) * 0.8 * s,
		bx = x - (n > 1 ? 6.5 : 0) * s,
		by = y + q;
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
		ctx.font = `700 ${Math.round(11 * s)}px sans-serif`;
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
	const hw = cw / 2 / cam.z,
		half = (bandH || ch) / 2 / (cam.z * TILT);
	cam.x = clamp(cam.x, Math.min(hw, MID), Math.max(MAP - hw, MID));
	cam.y = clamp(cam.y, Math.min(half, MID), Math.max(MAP - half, MID));
} // the map's edges can come up to the bars, never under them (Albert, Build 40)
const SX = (x) => (x - cam.x) * cam.z + cw / 2;
const SY = (y, h) => (y - cam.y) * cam.z * TILT + ch / 2 + vy - (h || 0) * cam.z;
const toWorld = (sx, sy) => ({ x: (sx - cw / 2) / cam.z + cam.x, y: (sy - ch / 2 - vy) / (cam.z * TILT) + cam.y });
const minZ = () => Math.min(cw / MAP, ch / (MAP * TILT)) || 0.2;
function zoomAt(nz, sx, sy) {
	const w = toWorld(sx, sy);
	cam.z = clamp(nz, minZ(), ZOOM_MAX);
	cam.x = w.x - (sx - cw / 2) / cam.z;
	cam.y = w.y - (sy - ch / 2 - vy) / (cam.z * TILT);
	clampCam();
}
const quant = (v) => {
	for (const s of SCALES) if (s >= v) return s;
	return SCALES[SCALES.length - 1];
};
