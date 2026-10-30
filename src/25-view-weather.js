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
				m.x = Math.random() * cw;
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
	if (stormy && !still() && !G.paused && now - sheetT > 2.5 + 6 * Math.random() && flashOK(now)) {
		// not while paused: a bolt ages on the game clock, so one made in a pause never faded and they piled up, each with its thunder (Build 60)
		sheetT = now;
		const close = Math.random();
		if (close > 0.75) {
			const bx = cam.x + ((Math.random() - 0.5) * cw) / z,
				by = cam.y + ((Math.random() - 0.5) * ch) / z;
			(G.bolts = G.bolts || []).push({ x: bx, y: by, t: G.t, seed: Math.random() });
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
				flashA = Math.max(flashA, 0.6 + 0.4 * (1 - Math.min(1, hyp(b.x - cam.x, b.y - cam.y) / 900)));
				flashT = now;
			}
			if (age > 0.45) continue;
			let r = (b.seed * 1e6) | 1;
			const rr = () => (r = (r * 16807) % 2147483647) / 2147483647; // the same jagged path every frame
			const x1 = SX(b.x),
				y1 = SY(b.y),
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
	const top = (parseFloat(getComputedStyle($('stage')).getPropertyValue('--hb')) || 86) + 2; // the sky begins under the top bars
	const gr = ctx.createLinearGradient(0, top, 0, top + h);
	gr.addColorStop(0, `rgba(${col},.6)`);
	gr.addColorStop(1, `rgba(${col},0)`);
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
		['#1c3a1c', 15],
		['#2b5427', 11],
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
