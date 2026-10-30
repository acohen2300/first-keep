// ═════ 19-building-art.js: building art ═════
// ───────────────────────── Buildings: each drawn once per kind, colour and zoom, then stamped ─────────────────────────
// Local units = world units. Origin = the middle of the footprint on the ground. The ground is squashed by TILT; height is not.
// The view is turned a little: the back of each building sits SIDE × its depth to the right, so we see its front and its shaded east wall.
// Walls and gates stay square to the view: they join into lines, and a turned piece would give the line a sawtooth top.
// the tower's three looks: width, height of wall, wall colour, and what each adds (a timber hoarding; a sloped foot and gun ports); one table, read by the drawing
const TOWER_LOOK = [
	{ w: 8, h: 44, wall: '#a29d90', flag: 7 },
	{ w: 10, h: 52, wall: '#9a9486', flag: 9, hoard: true },
	{ w: 12, h: 38, wall: '#8e8a80', flag: 10, batter: true, guns: true },
];
const STONE = '#a29d90',
	PLASTER = '#e2d6bb',
	PLANK = '#8a6644',
	MUD = '#c49a64',
	THATCH = '#b8954a',
	TILE = '#a8543a',
	SLATE = '#5d6470';
// ── the light (Build 61, after the best of the genre: one warm sun from the upper left, cool shadow, not grey) ──
// lit(col, k): k > 0 warms a colour toward the sun, k < 0 cools it toward the shadow. ao(): the darkening where a wall meets the ground.
// rim(): the pale line of light along a top edge that lifts a shape off the ground. Hard outlines are gone: a faint warm-dark edge only.
const SUN = '#fff1c4',
	SHADOW = '#1f3a46';
const hexRGB = (h) => {
	const n = parseInt(h.slice(1), 16);
	return [n >> 16, (n >> 8) & 255, n & 255];
};
const mix = (a, b, t) => {
	const A = hexRGB(a),
		B = hexRGB(b);
	return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};
const lit = (col, k) => (col[0] !== '#' ? col : k >= 0 ? mix(col, SUN, k) : mix(col, SHADOW, -k));
const LINE = 'rgba(30,22,16,.35)';
const ao = (pts, y, h) => {
	g.save();
	g.beginPath();
	pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
	g.closePath();
	g.clip();
	const xs = pts.map((p) => p[0]);
	g.fillStyle = LG(0, y, 0, y - h, ['rgba(20,30,40,.42)', 'rgba(20,30,40,0)']);
	g.fillRect(Math.min(...xs) - 2, y - h, Math.max(...xs) - Math.min(...xs) + 4, h + 2);
	g.restore();
};
const rim = (x0, y0, x1, y1, a = 0.5) => L_(x0, y0, x1, y1, `rgba(255,245,210,${a})`, 0.45);
// the east wall and the top of a box whose front runs x0..x1 at yf, h tall and d deep (d already squashed): drawn before its front
function sides(x0, x1, yf, h, d, wall, top = true) {
	const k = d * SIDE;
	P_(
		[
			[x1, yf],
			[x1 + k, yf - d],
			[x1 + k, yf - d - h],
			[x1, yf - h],
		],
		LG(x1, 0, x1 + k, 0, [lit(wall, -0.45), lit(wall, -0.6)]),
		LINE,
		0.4,
	);
	if (top)
		P_(
			[
				[x0, yf - h],
				[x1, yf - h],
				[x1 + k, yf - d - h],
				[x0 + k, yf - d - h],
			],
			lit(wall, 0.12),
			LINE,
			0.4,
		);
	return k;
}
// Research shows on the building it belongs to: UP is 0 (none done), 1 (some) or 2 (half or more). 1 sets it on a stone footing; 2 adds corner stones and a gilded ridge.
let UP = 0;
const TECHAT = {};
for (const t of TECH) (TECHAT[t.at] = TECHAT[t.at] || []).push(t.id);
const upTier = (kind, p) => {
	const T = TECHAT[kind];
	if (!T) return 0;
	let n = 0;
	for (const id of T) if (p.techs.has(id)) n++;
	return !n ? 0 : n * 2 >= T.length ? 2 : 1;
};
// a block: footprint w × w, front wall of height h, a roof on top. Returns where the top is, the depth, and k, how far right the back sits
function block(w, h, wall, tex, roof, roofCol, roofH = w * 0.35, dd) {
	const d = (dd || w) * TILT,
		x0 = -w / 2,
		x1 = w / 2,
		yf = d / 2,
		yb = -d / 2,
		k = d * SIDE,
		m = k / 2,
		ry = -h - roofH,
		over = roof && roof !== 'flat' ? Math.min(2.6, w * 0.08) : 0, // the eaves overhang
		far = lit(roofCol || wall, -0.5);
	if (roof && roof !== 'flat')
		P_(
			roof === 'hip'
				? [
						[x0 - over * 0.5 + k, yb - h + 0.6],
						[x1 + over * 0.5 + k, yb - h + 0.6],
						[x1 - w * 0.25 + m, ry],
						[x0 + w * 0.25 + m, ry],
					]
				: [
						[x0 - over * 0.5 + k, yb - h + 0.6],
						[x1 + over * 0.5 + k, yb - h + 0.6],
						[x1 + over * 0.5 + m, ry],
						[x0 - over * 0.5 + m, ry],
					],
			far,
			LINE,
			0.4,
		); // the far slope, where it shows over the ridge
	sides(x0, x1, yf, h, d, wall, roof === 'flat' || !roof);
	P_(
		[
			[x0, yf],
			[x1, yf],
			[x1, yf - h],
			[x0, yf - h],
		],
		LG(x0, 0, x1, 0, [lit(wall, 0.18), wall, lit(wall, -0.12)]),
		LINE,
		0.45,
	); // front
	texture(tex, x0, yf - h, x1, yf, wall);
	ao(
		[
			[x0, yf],
			[x1, yf],
			[x1, yf - h],
			[x0, yf - h],
		],
		yf,
		h * 0.45,
	);
	ao(
		[
			[x1, yf],
			[x1 + k, yf - d],
			[x1 + k, yf - d - h],
			[x1, yf - h],
		],
		yf,
		h * 0.45,
	);
	if (roof === 'flat' || !roof) rim(x0, yf - h, x1, yf - h, 0.45);
	if (UP >= 1) {
		P_(
			[
				[x0, yf],
				[x1, yf],
				[x1, yf - 3],
				[x0, yf - 3],
			],
			STONE,
			LINE,
			0.4,
		);
		P_(
			[
				[x1, yf],
				[x1 + k, yf - d],
				[x1 + k, yf - d - 3],
				[x1, yf - 3],
			],
			lit(STONE, -0.45),
			LINE,
			0.4,
		);
	}
	if (UP >= 2)
		for (let y = yf - 6; y > yf - h + 2; y -= 6) {
			P_(
				[
					[x0, y],
					[x0 + 3.4, y],
					[x0 + 3.4, y - 3],
					[x0, y - 3],
				],
				lit(STONE, 0.15),
				LINE,
				0.3,
			);
			P_(
				[
					[x1 - 3.4, y],
					[x1, y],
					[x1, y - 3],
					[x1 - 3.4, y - 3],
				],
				lit(STONE, 0.15),
				LINE,
				0.3,
			);
		}
	const r = { top: yb - h, d, h, k };
	if (roof === 'flat' || !roof) return r;
	const sag = Math.min(1.4, w * 0.045),
		rc = roofCol || wall,
		near = LG(0, yf - h, 0, ry, [lit(rc, -0.15), lit(rc, 0.25)]);
	if (roof === 'gable') {
		// ridge runs left to right: the near slope, and the gable end on the east wall
		P_(
			[
				[x1, yf - h],
				[x1 + k, yb - h],
				[x1 + m, ry],
			],
			lit(wall, -0.5),
			LINE,
			0.4,
		);
		const e0 = [x0 - over, yf - h + 0.8],
			e1 = [x1 + over, yf - h + 0.8],
			r0 = [x0 - over * 0.5 + m, ry],
			r1 = [x1 + over * 0.5 + m, ry];
		g.beginPath();
		g.moveTo(e0[0], e0[1]);
		g.quadraticCurveTo((e0[0] + e1[0]) / 2, e0[1] + sag, e1[0], e1[1]);
		g.lineTo(r1[0], r1[1]);
		g.quadraticCurveTo((r0[0] + r1[0]) / 2, ry + sag * 0.4, r0[0], r0[1]);
		g.closePath();
		g.fillStyle = near;
		g.fill();
		g.strokeStyle = LINE;
		g.lineWidth = 0.45;
		g.stroke();
		roofGrain(rc, e0, e1, r0, r1, sag);
		L_(r0[0], r0[1], r1[0], r1[1], UP >= 2 ? '#e6c75a' : lit(rc, -0.4), UP >= 2 ? 1.6 : 0.9);
		rim(r0[0], r0[1], r1[0], r1[1], 0.5);
		return { ...r, top: ry };
	}
	if (roof === 'hip') {
		// the near slope, and the east hip in shade
		P_(
			[
				[x1 + over, yf - h + 0.8],
				[x1 + over * 0.5 + k, yb - h + 0.6],
				[x1 - w * 0.25 + m, ry],
			],
			lit(rc, -0.55),
			LINE,
			0.4,
		);
		const e0 = [x0 - over, yf - h + 0.8],
			e1 = [x1 + over, yf - h + 0.8],
			r0 = [x0 + w * 0.25 + m, ry],
			r1 = [x1 - w * 0.25 + m, ry];
		g.beginPath();
		g.moveTo(e0[0], e0[1]);
		g.quadraticCurveTo((e0[0] + e1[0]) / 2, e0[1] + sag, e1[0], e1[1]);
		g.lineTo(r1[0], r1[1]);
		g.lineTo(r0[0], r0[1]);
		g.closePath();
		g.fillStyle = near;
		g.fill();
		g.strokeStyle = LINE;
		g.lineWidth = 0.45;
		g.stroke();
		roofGrain(rc, e0, e1, r0, r1, sag);
		rim(r0[0], r0[1], r1[0], r1[1], 0.5);
		return { ...r, top: ry };
	}
	return r;
}
// the grain of a roof: thatch in layered scallops with loose strands, tile in curved rows, slate and the rest in straight courses
function roofGrain(rc, e0, e1, r0, r1, sag) {
	const thatch = rc === THATCH,
		rows = Math.max(3, Math.round(Math.abs(e0[1] - r0[1]) / (thatch ? 1.7 : 1.3)));
	g.lineWidth = 0.3;
	for (let i = 1; i < rows; i++) {
		const u = i / rows,
			xa = e0[0] + (r0[0] - e0[0]) * u,
			xb = e1[0] + (r1[0] - e1[0]) * u,
			y = e0[1] + (r0[1] - e0[1]) * u + sag * (1 - u) * 0.5;
		g.strokeStyle = thatch ? `rgba(90,60,20,${0.2 + 0.1 * u})` : 'rgba(40,20,10,.3)';
		g.beginPath();
		g.moveTo(xa, y);
		const n = Math.max(2, Math.round((xb - xa) / (thatch ? 2.4 : 1.9)));
		for (let j = 0; j < n; j++) {
			const sx = xa + ((xb - xa) * j) / n,
				ex = xa + ((xb - xa) * (j + 1)) / n;
			g.quadraticCurveTo((sx + ex) / 2, y + (thatch ? 0.9 : 0.5) * (1 - u * 0.4), ex, y);
		}
		g.stroke();
		if (!thatch) L_(xa, y - 0.25, xb, y - 0.25, 'rgba(255,220,180,.16)', 0.25);
	}
	if (thatch) {
		let r = 5;
		const R = () => (r = (r * 16807) % 2147483647) / 2147483647;
		for (let i = 0; i < 40; i++) {
			const t = R(),
				u = R(),
				x = e0[0] + (e1[0] - e0[0]) * t + (r0[0] - e0[0]) * u,
				y = e0[1] + (r0[1] - e0[1]) * u;
			L_(x, y, x + 0.2, y - 1.1 * (1 - u), R() > 0.5 ? 'rgba(255,240,180,.35)' : 'rgba(90,60,20,.3)', 0.22);
		}
	}
}
function texture(tex, x0, y0, x1, y1, wall) {
	g.save();
	g.beginPath();
	g.rect(x0, y0, x1 - x0, y1 - y0);
	g.clip();
	if (tex === 'stone') {
		g.strokeStyle = 'rgba(40,36,30,.35)';
		g.lineWidth = 0.35;
		for (let y = y1, r = 0; y > y0; y -= 2.6, r++) {
			g.beginPath();
			g.moveTo(x0, y);
			g.lineTo(x1, y);
			g.stroke();
			for (let x = x0 + (r % 2) * 2.2; x < x1; x += 4.4) {
				g.beginPath();
				g.moveTo(x, y);
				g.lineTo(x, y - 2.6);
				g.stroke();
			}
		}
	}
	if (tex === 'plank') {
		g.strokeStyle = 'rgba(40,24,10,.4)';
		g.lineWidth = 0.35;
		for (let x = x0; x < x1; x += 2.2) {
			g.beginPath();
			g.moveTo(x, y0);
			g.lineTo(x, y1);
			g.stroke();
		}
	}
	if (tex === 'timber') {
		g.strokeStyle = '#4a3420';
		g.lineWidth = 0.9;
		g.beginPath();
		g.moveTo(x0, y0 + 0.5);
		g.lineTo(x1, y0 + 0.5);
		g.moveTo(x0 + 0.5, y0);
		g.lineTo(x0 + 0.5, y1);
		g.moveTo(x1 - 0.5, y0);
		g.lineTo(x1 - 0.5, y1);
		g.moveTo(x0, (y0 + y1) / 2);
		g.lineTo(x1, (y0 + y1) / 2);
		g.moveTo(x0, y1);
		g.lineTo((x0 + x1) / 2, y0);
		g.stroke();
	}
	if (tex === 'mud') {
		g.fillStyle = 'rgba(90,60,30,.18)';
		for (let i = 0; i < 30; i++) g.fillRect(x0 + ((i * 7.3) % (x1 - x0)), y0 + ((i * 3.7) % (y1 - y0)), 1.2, 0.5);
	}
	g.restore();
}
const ridgeRoof = (x1, ye, ya, d, col) => {
	const k = d * SIDE;
	P_(
		[
			[-x1, ye],
			[-x1 + k, ye - d],
			[k, ya - d],
			[0, ya],
		],
		lit(col, 0.13),
		LINE,
		0.5,
	);
	P_(
		[
			[x1, ye],
			[x1 + k, ye - d],
			[k, ya - d],
			[0, ya],
		],
		lit(col, -0.32),
		LINE,
		0.5,
	);
}; // a roof whose ridge runs front to back: eaves at ye, apex at ya; the pediment is drawn after
const door = (x, yf, w, h, col = '#3a2614') => {
	P_(
		[
			[x - w / 2, yf],
			[x + w / 2, yf],
			[x + w / 2, yf - h + w / 2],
			[x, yf - h],
			[x - w / 2, yf - h + w / 2],
		],
		col,
		LINE,
		0.4,
	);
};
const win = (x, y, w = 2, h = 2.6, col = '#2a2014') => {
	P_(
		[
			[x - w / 2, y],
			[x + w / 2, y],
			[x + w / 2, y - h],
			[x - w / 2, y - h],
		],
		col,
		'#1a120a',
		0.3,
	);
};
let FLAGS = null; // while a building is drawn: where its flags fly, so they are drawn live over it and wave (Build 52)
const banner = (x, y, col, len = 9) => {
	L_(x, y, x, y - len - 4, '#3a2a1a', 0.7);
	if (FLAGS) {
		const m = g.getTransform(),
			p = m.transformPoint(new DOMPoint(x, y - len - 4));
		FLAGS.push([p.x, p.y, Math.hypot(m.a, m.b)]); // where on the picture, and how big, after any scaling the drawing did (a town is a keep drawn smaller)
		return;
	}
	P_(
		[
			[x, y - len - 4],
			[x + 6, y - len - 2.6],
			[x, y - len - 1],
		],
		col,
		LINE,
		0.3,
	);
};
const crenels = (x0, x1, y, col) => {
	for (let x = x0; x < x1 - 0.5; x += 3)
		P_(
			[
				[x, y],
				[x + 1.8, y],
				[x + 1.8, y - 2],
				[x, y - 2],
			],
			col,
			LINE,
			0.3,
		);
};
const column = (x, yb, yt, col = '#efe6d4') => {
	P_(
		[
			[x - 0.9, yb],
			[x + 0.9, yb],
			[x + 0.9, yt],
			[x - 0.9, yt],
		],
		LG(x - 1, 0, x + 1, 0, [lit(col, 0.08), lit(col, -0.40)]),
		LINE,
		0.3,
	);
	P_(
		[
			[x - 1.4, yt],
			[x + 1.4, yt],
			[x + 1.4, yt - 0.8],
			[x - 1.4, yt - 0.8],
		],
		col,
		LINE,
		0.3,
	);
};
const smallTree = (x, y, s = 1, col = '#3e8a3c') => {
	P_(
		[
			[x - 0.8 * s, y],
			[x + 0.8 * s, y],
			[x + 0.5 * s, y - 3.6 * s],
			[x - 0.5 * s, y - 3.6 * s],
		],
		LG(x - 0.8 * s, 0, x + 0.8 * s, 0, ['#7a5a3a', '#3a2412']),
		LINE,
		0.3,
	);
	for (const [dx, dy, r, kk] of [
		[0, -6, 3.6, -0.15],
		[-2.3, -4.9, 2.6, 0],
		[2.3, -5.3, 2.6, -0.25],
		[0, -8.2, 2.8, 0.12],
		[-1.3, -7.4, 2, 0.28],
	])
		E_(x + dx * s, y + dy * s, r * s, r * 0.86 * s, RG(x + dx * s - r * 0.4 * s, y + dy * s - r * 0.4 * s, 0, r * 1.1 * s, [lit(col, kk + 0.3), lit(col, kk - 0.35)]));
};
// ── the props the yards share (Build 61) ──
const stump = (x, y) => {
	E_(x, y - 1, 1.5, 1.1, LG(x - 1.5, 0, x + 1.5, 0, ['#a07a4a', '#5a3c22']), LINE, 0.3);
	E_(x, y - 2.1, 1.5, 0.6, '#c9a46a');
	E_(x, y - 2.1, 0.8, 0.32, 'rgba(120,80,30,.5)');
};
const grassTufts = (w, col, n) => {
	let r = 3;
	const R = () => (r = (r * 16807) % 2147483647) / 2147483647;
	for (let i = 0; i < n; i++) {
		const [x, y] = gpt(w, 0.05 + R() * 0.9, 0.05 + R() * 0.9);
		L_(x, y, x + 0.4, y - 1.3, col, 0.3);
		L_(x + 0.6, y, x + 1.1, y - 1, lit(col, -0.2), 0.3);
	}
};
const hay = (x, y, s = 1) => {
	E_(x + 0.5, y + 0.2, 2.8 * s, 1.1 * s, 'rgba(20,30,40,.3)');
	E_(x, y - 1.8 * s, 2.6 * s, 2.1 * s, RG(x - 0.8 * s, y - 2.6 * s, 0, 3 * s, ['#f0cf6e', '#b8882e']));
	for (let i = 0; i < 10; i++) L_(x - 2 + i * 0.45, y - 0.5 * s, x - 1.7 + i * 0.45, y - 3 * s - (i % 3) * 0.4, 'rgba(120,70,10,.35)', 0.22);
};
const barrel = (x, y) => {
	E_(x + 0.4, y + 0.2, 1.7, 0.75, 'rgba(20,30,40,.3)');
	P_(
		[
			[x - 1.5, y],
			[x + 1.5, y],
			[x + 1.8, y - 1.7],
			[x + 1.5, y - 3.4],
			[x - 1.5, y - 3.4],
			[x - 1.8, y - 1.7],
		],
		LG(x - 1.5, 0, x + 1.5, 0, ['#a67c48', '#6b4a2c', '#4a2e18']),
		LINE,
		0.3,
	);
	E_(x, y - 3.4, 1.5, 0.6, '#b08a52');
	for (const yy of [-1, -2.5]) L_(x - 1.75, y + yy, x + 1.75, y + yy, '#2a1c10', 0.35);
	rim(x - 1.4, y - 3.4, x + 1.4, y - 3.4, 0.4);
};
const crate = (x, y) => {
	E_(x + 0.5, y + 0.2, 2.2, 0.9, 'rgba(20,30,40,.3)');
	P_(
		[
			[x - 1.7, y],
			[x + 1.7, y],
			[x + 1.7, y - 2.6],
			[x - 1.7, y - 2.6],
		],
		LG(x - 1.7, 0, x + 1.7, 0, ['#b08a52', '#8a6a3a']),
	);
	P_(
		[
			[x + 1.7, y],
			[x + 2.6, y - 1.1],
			[x + 2.6, y - 3.7],
			[x + 1.7, y - 2.6],
		],
		'#5a3c22',
	);
	P_(
		[
			[x - 1.7, y - 2.6],
			[x + 1.7, y - 2.6],
			[x + 2.6, y - 3.7],
			[x - 0.8, y - 3.7],
		],
		'#c9a46a',
	);
	L_(x - 1.4, y - 2.3, x + 1.4, y - 0.3, 'rgba(30,22,16,.35)', 0.3);
	L_(x - 1.4, y - 0.3, x + 1.4, y - 2.3, 'rgba(30,22,16,.35)', 0.3);
};
const sack = (x, y, col = '#d2bb8e') => {
	E_(x + 0.3, y + 0.1, 1.6, 0.65, 'rgba(20,30,40,.3)');
	E_(x, y - 1.5, 1.55, 1.65, RG(x - 0.5, y - 2.2, 0, 2.2, [lit(col, 0.2), lit(col, -0.3)]));
	L_(x - 1, y - 2.8, x + 1, y - 2.8, '#6b4a2c', 0.45);
};
const lantern = (x, y) => {
	post(x, y, 7.5, '#3a2412', 0.3);
	P_(
		[
			[x - 0.9, y - 7.5],
			[x + 0.9, y - 7.5],
			[x + 0.7, y - 9.3],
			[x - 0.7, y - 9.3],
		],
		'#ffd27a',
	);
	E_(x, y - 8.3, 5.2, 4, RG(x, y - 8.3, 0, 5.2, ['rgba(255,196,90,.4)', 'rgba(255,196,90,0)']));
};
const sheep = (x, y) => {
	E_(x + 0.6, y + 0.5, 2.6, 1, 'rgba(20,30,40,.25)');
	for (const lx of [-1.5, -0.5, 0.8, 1.6]) L_(x + lx, y - 0.8, x + lx, y + 0.6, '#4a4540', 0.4);
	E_(x, y - 1.7, 2.7, 1.8, RG(x - 0.8, y - 2.4, 0, 3.2, ['#fffdf5', '#c9c2b2']));
	E_(x + 2.4, y - 2.6, 1.1, 1, '#3a3530');
	E_(x + 2.9, y - 2.9, 0.32, 0.55, '#3a3530');
};
const pony = (x, y, col = '#7a4e2a') => {
	E_(x + 0.8, y + 0.5, 3.8, 1.2, 'rgba(20,30,40,.28)');
	for (const lx of [-2.2, -1.1, 1.3, 2.4]) L_(x + lx, y - 1.4, x + lx, y + 0.7, lit(col, -0.4), 0.5);
	E_(x, y - 2.9, 3.5, 1.9, RG(x - 1, y - 3.8, 0, 4, [lit(col, 0.3), lit(col, -0.35)]));
	P_(
		[
			[x + 2.6, y - 4],
			[x + 3.4, y - 6.4],
			[x + 4.8, y - 6.8],
			[x + 5.2, y - 5.4],
			[x + 4.2, y - 4.6],
			[x + 3.4, y - 3],
		],
		lit(col, 0.05),
	);
	L_(x + 2.8, y - 4.6, x + 4, y - 6.6, lit(col, -0.5), 0.6);
	P_(
		[
			[x - 3.2, y - 3.6],
			[x - 4.6, y - 2.4],
			[x - 4, y - 0.6],
			[x - 3, y - 2.8],
		],
		lit(col, -0.45),
	);
};
// a lean-to roof on posts over a yard: the front edge sags a little, the slats show, the back edge catches the light
const leanto = (x0, x1, yf, h, dd, lift, col = THATCH, over = 2) => {
	const d = dd * TILT,
		k = d * SIDE;
	g.beginPath();
	g.moveTo(x0 - over, yf - h + 0.6);
	g.quadraticCurveTo((x0 + x1) / 2, yf - h + 1.6, x1 + over, yf - h + 0.6);
	g.lineTo(x1 + over + k, yf - d - h - lift);
	g.lineTo(x0 - over + k, yf - d - h - lift);
	g.closePath();
	g.fillStyle = LG(0, yf - h, 0, yf - d - h - lift, [lit(col, -0.1), lit(col, 0.22)]);
	g.fill();
	g.strokeStyle = LINE;
	g.lineWidth = 0.4;
	g.stroke();
	for (let i = 1; i < 6; i++) {
		const u = i / 6;
		g.beginPath();
		g.moveTo(x0 - over + k * u, yf - h + 0.6 - (d + lift) * u);
		g.quadraticCurveTo((x0 + x1) / 2 + k * u, yf - h + 1.4 - (d + lift) * u, x1 + over + k * u, yf - h + 0.6 - (d + lift) * u);
		g.strokeStyle = 'rgba(90,60,20,.28)';
		g.lineWidth = 0.3;
		g.stroke();
	}
	rim(x0 - over + k, yf - d - h - lift, x1 + over + k, yf - d - h - lift, 0.5);
};
// the art for each building kind. c = side colour, o = owner (for civ and research), w = width in world units
const ART = {
	keep(c, o, v) {
		// the Town Center: a timber-framed hall on a stone base, with a bell tower and the town's banner
		const r = block(50, 22, PLASTER, 'timber', 'gable', TILE, 12);
		const d = r.d;
		P_(
			[
				[-26, d / 2 + 1],
				[26, d / 2 + 1],
				[26, d / 2 - 4],
				[-26, d / 2 - 4],
			],
			STONE,
			LINE,
			0.5,
		);
		texture('stone', -26, d / 2 - 4, 26, d / 2 + 1, STONE);
		g.save();
		g.translate(15, d / 2 - 4);
		const tk = sides(-5, 5, 0, 40, 10 * TILT, STONE);
		P_(
			[
				[-5, 0],
				[5, 0],
				[5, -40],
				[-5, -40],
			],
			LG(-5, 0, 5, 0, [lit(STONE, -0.08), lit(STONE, -0.45)]),
			LINE,
			0.5,
		);
		texture('stone', -5, -40, 5, 0, STONE);
		P_(
			[
				[-4, -30],
				[4, -30],
				[4, -36],
				[-4, -36],
			],
			'#14100c',
		);
		E_(0, -32.6, 1.6, 1.9, '#c9a227');
		P_(
			[
				[-6.5, -40],
				[6.5 + tk, -40 - 10 * TILT],
				[tk / 2, -52],
			],
			lit(TILE, -0.60),
			LINE,
			0.5,
		);
		P_(
			[
				[-6.5, -40],
				[6.5, -40],
				[tk / 2, -52],
			],
			TILE,
			LINE,
			0.5,
		);
		g.restore();
		door(-6, d / 2 - 4, 8, 12, '#4a2e16');
		for (const x of [-18, 4]) win(x, d / 2 - 11, 2.4, 3.4);
		banner(-22, d / 2 - 22, c, 12);
		L_(-25, d / 2 - 1, 25, d / 2 - 1, c, 1.4);
		if (v >= 2) {
			const bx = -27,
				by = d / 2 - 1;
			P_(
				[
					[bx - 9, by - 1],
					[bx, by + 6],
					[bx + 9, by - 1],
					[bx + 9, by - 10],
					[bx, by - 4],
					[bx - 9, by - 10],
				],
				LG(bx - 9, 0, bx + 9, 0, [lit(STONE, 0.08), lit(STONE, -0.35)]),
				LINE,
				0.5,
			);
			P_(
				[
					[bx - 9, by - 10],
					[bx, by - 16],
					[bx + 9, by - 10],
					[bx, by - 4],
				],
				lit(STONE, 0.29),
				LINE,
				0.5,
			);
			L_(bx - 1, by - 10.5, bx + 7, by - 12.5, '#3a3a40', 2.2);
			E_(bx + 7.6, by - 12.7, 1.2, 1.2, '#1a1a1c');
		} // Gunpowder: an angled stone bastion with a gun on it
	},
	town(c, o, v) {
		g.save();
		g.scale(0.82, 0.82);
		ART.keep(c, o, v);
		g.restore();
	},
	castle(c, o) {
		const w = 50,
			d = w * TILT;
		block(w, 30, STONE, 'stone', 'flat');
		crenels(-25, 25, d / 2 - 30, STONE);
		for (const sx of [-1, 1]) {
			g.save();
			g.translate(sx * 20, d / 2 - 2);
			const tk = sides(-6, 6, 0, 42, 12 * TILT, STONE);
			P_(
				[
					[-6, 0],
					[6, 0],
					[6, -42],
					[-6, -42],
				],
				LG(-6, 0, 6, 0, [lit(STONE, -0.08), lit(STONE, -0.48)]),
				LINE,
				0.6,
			);
			texture('stone', -6, -42, 6, 0, STONE);
			crenels(-6, 6, -42, STONE);
			{
				P_(
					[
						[-7, -44],
						[7 + tk, -44 - 12 * TILT],
						[tk / 2, -56],
					],
					lit(SLATE, -0.60),
					LINE,
					0.5,
				);
				P_(
					[
						[-7, -44],
						[7, -44],
						[tk / 2, -56],
					],
					SLATE,
					LINE,
					0.5,
				);
			}
			win(0, -30, 1.6, 3.4, '#14100c');
			g.restore();
		}
		door(0, d / 2, 9, 14, '#4a2e16');
		L_(-4.5, d / 2 - 9, 4.5, d / 2 - 9, '#2a1a0a', 0.6);
		win(-9, d / 2 - 18, 1.6, 3.4);
		win(9, d / 2 - 18, 1.6, 3.4);
		banner(0, d / 2 - 32, c, 14);
		L_(-25, d / 2 - 1, 25, d / 2 - 1, c, 1.4);
	},
	house(c) {
		const r = block(20, 12, PLASTER, 'timber', 'gable', THATCH, 9);
		door(-4, r.d / 2, 4, 7);
		win(4.5, r.d / 2 - 4.6, 2, 2.4, true);
		L_(-10, r.d / 2 - 0.5, 10, r.d / 2 - 0.5, c, 1.2);
		const m = r.k / 2;
		P_(
			[
				[5 + m, -20],
				[7.4 + m, -20],
				[7.4 + m, -25],
				[5 + m, -25],
			],
			lit('#6a5a4a', -0.2),
			LINE,
			0.3,
		);
	},
	apartment(c) {
		const r = block(30, 34, '#cf9e6e', 'stone', 'hip', TILE, 8);
		for (let y = r.d / 2 - 6; y > r.d / 2 - 32; y -= 7)
			for (let x = -10; x <= 10; x += 6.6) win(x, y, 2.4, 3.4, '#3a2a1a');
		door(0, r.d / 2, 5, 6);
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	aqueduct(c) {
		const d = 30 * TILT;
		sides(-17, 17, d / 2, 28, 8 * TILT, STONE);
		P_(
			[
				[-17, d / 2],
				[17, d / 2],
				[17, d / 2 - 28],
				[-17, d / 2 - 28],
			],
			LG(-17, 0, 17, 0, [lit(STONE, -0.08), lit(STONE, -0.45)]),
			LINE,
			0.6,
		);
		texture('stone', -17, d / 2 - 28, 17, d / 2, STONE);
		for (let i = -1; i <= 1; i++) {
			g.beginPath();
			g.moveTo(i * 11 - 4, d / 2);
			g.lineTo(i * 11 - 4, d / 2 - 12);
			g.arc(i * 11, d / 2 - 12, 4, Math.PI, 0);
			g.lineTo(i * 11 + 4, d / 2);
			g.closePath();
			g.fillStyle = '#2a3020';
			g.fill();
		}
		for (let i = -2; i <= 2; i++) {
			g.beginPath();
			g.arc(i * 6.6, d / 2 - 21, 2, Math.PI, 0);
			g.fillStyle = '#2a3020';
			g.fill();
		}
		P_(
			[
				[-18, d / 2 - 28],
				[18, d / 2 - 28],
				[18, d / 2 - 31],
				[-18, d / 2 - 31],
			],
			'#7aa6c8',
			LINE,
			0.4,
		);
		L_(-17, d / 2 - 0.5, 17, d / 2 - 0.5, c, 1.2);
	},
	mill(c) {
		const r = block(30, 16, PLANK, 'plank', 'gable', THATCH, 9);
		door(0, r.d / 2, 5, 9);
		E_(-8, r.d / 2 - 3, 3, 2, '#d8c27a', LINE, 0.3);
		E_(9, r.d / 2 - 3, 3, 2, '#d8c27a', LINE, 0.3);
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	lumber(c) {
		const r = block(30, 12, PLANK, 'plank', 'gable', '#7a5634', 6, 20);
		for (let i = 0; i < 4; i++) E_(-11 + i * 3, r.d / 2 + 2 - (i % 2) * 2, 1.6, 1.6, '#c89a68', '#6b4a2c', 0.4);
		for (let i = 0; i < 3; i++) E_(-9.4 + i * 3, r.d / 2 - 1.2, 1.6, 1.6, '#c89a68', '#6b4a2c', 0.4);
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	mining(c) {
		const r = block(30, 12, STONE, 'stone', 'gable', SLATE, 6, 20);
		P_(
			[
				[6, r.d / 2],
				[14, r.d / 2],
				[13, r.d / 2 - 4],
				[7, r.d / 2 - 4],
			],
			'#5a3a1c',
			LINE,
			0.4,
		);
		E_(9, r.d / 2 - 4.6, 1.6, 1.2, '#f2cf55');
		E_(11.4, r.d / 2 - 4.6, 1.6, 1.2, '#b4bbc0');
		door(-6, r.d / 2, 6, 8, '#1a120a');
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	barracks(c) {
		// a drill yard with a long hut at the back (Build 61, Albert: open-air): a rack of spears, shields on the wall, a crate
		const w = 40,
			d = w * TILT,
			k = d * SIDE,
			hw = w * 0.44,
			hd = w * 0.26;
		field(w, '#ad9262', c, () => {
			g.save();
			g.translate(k * 0.72, d / 2 - d * 0.72 - (hd * TILT) / 2);
			const r = block(hw * 2, 7.5, PLASTER, 'timber', 'gable', '#8e3a2a', 5.2, hd);
			door(0, r.d / 2, 2.8, 4.8);
			win(-hw + 4.2, r.d / 2 - 3.4, 1.7, 2.1, true);
			win(hw - 4.2, r.d / 2 - 3.4, 1.7, 2.1, true);
			g.restore();
			banner(hw + k * 0.72 + 0.8, d / 2 - d * 0.72 - 6.5, c, 7);
			const [rx, ry] = gpt(w, 0.9, 0.3);
			P_(
				[
					[rx - 1.4, ry],
					[rx + 1.8, ry],
					[rx + 1.6, ry - 1.1],
					[rx - 1.6, ry - 1.1],
				],
				'#5a3a1e',
			);
			for (let i = 0; i < 6; i++) L_(rx - 0.8 + i * 0.35, ry - 0.5, rx - 1.4 + i * 0.55, ry - 7.5, '#d9c79a', 0.3);
			for (let i = 0; i < 3; i++) {
				const [sx, sy] = gpt(w, 0.5 + i * 0.12, 0.1);
				E_(sx, sy - 2, 1.4, 1.6, RG(sx - 0.4, sy - 2.6, 0, 1.8, [lit('#c0392b', 0.2), lit('#c0392b', -0.35)]), LINE, 0.3);
				E_(sx, sy - 2, 0.5, 0.5, '#e6b947');
			}
			crate(...gpt(w, 0.9, 0.08));
		}, true);
	},
	range(c) {
		// the butts on a green (Build 61, Albert: open-air): three targets at the back, a shooting line, hay behind
		const w = 40,
			d = w * TILT;
		field(w, '#8cb860', c, () => {
			grassTufts(w, '#5a8a3c', 60);
			const [h0, h1] = [gpt(w, 0.03, 0.97), gpt(w, 0.97, 0.97)];
			for (let i = 0; i < 7; i++) hay(h0[0] + ((h1[0] - h0[0]) * (i + 0.5)) / 7, h0[1] - 0.6, 0.85);
			for (let i = 0; i < 3; i++) {
				const [x, y] = gpt(w, 0.25 + i * 0.25, 0.84);
				E_(x + 0.6, y + 0.2, 3, 1.1, 'rgba(20,30,40,.28)');
				for (const dx of [-1.7, 1.7]) post(x + dx, y, 5, '#5a3a1e', 0.42);
				E_(x, y - 2.6, 2.8, 2.8, RG(x - 0.7, y - 3.3, 0, 3.4, ['#f3e6c0', '#c9ad66']));
				for (let rr = 0; rr < 6; rr++) E_(x, y - 2.6, 2.8 - rr * 0.42, 2.8 - rr * 0.42, null, 'rgba(120,90,40,.3)', 0.2);
				E_(x, y - 2.6, 1.6, 1.6, '#fff');
				E_(x, y - 2.6, 1, 1, '#d03a2a');
				E_(x, y - 2.6, 0.42, 0.42, '#fff');
				L_(x + 0.3, y - 2.5, x + 2.6, y - 1.2, '#9a7a4a', 0.3);
			}
			const [l0, l1] = [gpt(w, 0.05, 0.22), gpt(w, 0.95, 0.22)];
			L_(l0[0], l0[1], l1[0], l1[1], 'rgba(255,255,255,.75)', 0.5);
			const [rx, ry] = gpt(w, 0.92, 0.1);
			for (let i = 0; i < 5; i++) L_(rx - 0.6 + i * 0.3, ry, rx - 1.3 + i * 0.55, ry - 6.5, '#d9c79a', 0.3);
			banner(...gpt(w, 0.04, 0.96), c, 8);
		}, true);
	},
	stable(c) {
		// a paddock with the stalls at the back (Build 61, Albert: open-air): thatch over the stalls, a rail round the yard, hay and a trough
		const w = 40,
			d = w * TILT,
			k = d * SIDE,
			hw = w * 0.46,
			hd = w * 0.24;
		field(w, '#9fae6e', c, () => {
			grassTufts(w, '#5a8a3c', 40);
			g.save();
			g.translate(k * 0.74, d / 2 - d * 0.74 - (hd * TILT) / 2);
			const r = block(hw * 2, 6, PLANK, 'plank', 'gable', THATCH, 3.6, hd);
			for (let i = 0; i < 5; i++) {
				const x = -hw + 3 + (i * (hw * 2 - 6)) / 4.6;
				P_(
					[
						[x - 2.1, r.d / 2],
						[x + 2.1, r.d / 2],
						[x + 2.1, r.d / 2 - 3.9],
						[x, r.d / 2 - 5],
						[x - 2.1, r.d / 2 - 3.9],
					],
					'#2a2014',
				);
				if (i % 2) {
					E_(x, r.d / 2 - 2.7, 1.3, 1.05, '#7a4e2a');
					P_(
						[
							[x + 0.9, r.d / 2 - 3.5],
							[x + 2, r.d / 2 - 4.8],
							[x + 2.3, r.d / 2 - 3.7],
						],
						'#7a4e2a',
					);
				}
			}
			g.restore();
			for (let i = 0; i < 3; i++) {
				const [x, y] = gpt(w, 0.2 + i * 0.3, 0.3 + (i % 2) * 0.15);
				pony(x, y, ['#7a4e2a', '#3e2e22', '#c0a884'][i]);
			}
			hay(...gpt(w, 0.9, 0.5), 1);
			const [tx, ty] = gpt(w, 0.1, 0.5);
			E_(tx, ty, 2.8, 1.2, RG(tx, ty, 0, 2.8, ['#5fa0c4', '#2f5f80']));
		});
	},
	smith(c) {
		const r = block(30, 14, STONE, 'stone', 'gable', SLATE, 7);
		P_(
			[
				[7 + r.k / 2, -18],
				[11 + r.k / 2, -18],
				[11 + r.k / 2, -28],
				[7 + r.k / 2, -28],
			],
			'#5a5550',
			LINE,
			0.4,
		);
		P_(
			[
				[-4, r.d / 2],
				[6, r.d / 2],
				[6, r.d / 2 - 9],
				[-4, r.d / 2 - 9],
			],
			'#1a120a',
			LINE,
			0.4,
		);
		E_(1, r.d / 2 - 3, 3.4, 2.4, 'rgba(255,140,40,.85)');
		P_(
			[
				[-12, r.d / 2],
				[-6, r.d / 2],
				[-6.6, r.d / 2 - 2.6],
				[-13.4, r.d / 2 - 3.6],
				[-11, r.d / 2 - 2.6],
			],
			'#3a3a3a',
		);
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	market(c) {
		// an open square (Build 61): paving, a well with its roof, four stalls with awnings in the side's colours, crates and a lantern
		const w = 30,
			d = w * TILT,
			k = d * SIDE;
		field(w, '#cdb990', c, () => {
			let r = 9;
			const R = () => (r = (r * 16807) % 2147483647) / 2147483647;
			for (let i = 0; i < 70; i++) {
				const [x, y] = gpt(w, 0.03 + R() * 0.94, 0.03 + R() * 0.94);
				E_(x, y, 1.3 + R(), 0.6 + R() * 0.4, `rgba(${150 + ((R() * 40) | 0)},${125 + ((R() * 30) | 0)},${95 + ((R() * 30) | 0)},.6)`);
			}
			const wx = k * 0.5,
				wy = 0;
			g.save();
			g.translate(wx, wy);
			block(5.6, 2.4, '#8e8678', 'stone', 'flat', null, 0, 4.5);
			g.restore();
			E_(wx + 0.9, wy - 2.4 - 1.5 + 1.4, 2.4, 1, RG(wx, wy - 3, 0, 2.6, ['#5fa0c4', '#2f5f80']));
			for (const dx of [-2.4, 2.4]) post(wx + dx, wy - 2.2, 5.4, '#5a3a1e', 0.4);
			P_(
				[
					[wx - 3.4, wy - 7.4],
					[wx + 3.4, wy - 7.4],
					[wx + 2.2, wy - 9.4],
					[wx - 2.2, wy - 9.4],
				],
				LG(0, wy - 7.4, 0, wy - 9.4, [lit('#7a3326', -0.15), lit('#7a3326', 0.25)]),
				LINE,
				0.3,
			);
			const stalls = [
				[0.2, 0.78, '#c0392b'],
				[0.78, 0.78, '#2f6c8e'],
				[0.2, 0.22, c],
				[0.78, 0.22, '#3f7a34'],
			].sort((a, b) => b[1] - a[1]);
			for (const [t, u, col] of stalls) {
				const [x, y] = gpt(w, t, u);
				g.save();
				g.translate(x, y);
				block(8, 2.6, '#8a6a3a', 'plank', 'flat', null, 0, 4);
				g.restore();
				for (const [gx, gc] of [
					[-2.6, '#d9607a'],
					[-0.9, '#e6b947'],
					[0.9, '#86a83e'],
					[2.6, '#c9a46a'],
				]) {
					E_(x + gx, y - 2.6, 1, 0.55, lit(gc, -0.2));
					E_(x + gx, y - 3.2, 0.8, 0.5, lit(gc, 0.2));
				}
				for (const dx of [-3.6, 3.6]) post(x + dx, y - 2.6, 4.8, '#5a3a1e', 0.4);
				for (let sI = 0; sI < 4; sI++) {
					const sx = x - 4.6 + sI * 2.3;
					P_(
						[
							[sx, y - 7.2],
							[sx + 2.3, y - 7.2],
							[sx + 2.7, y - 8.8],
							[sx + 0.4, y - 8.8],
						],
						sI % 2 ? '#f4efe2' : lit(col, 0.05),
					);
					P_(
						[
							[sx, y - 7.2],
							[sx + 2.3, y - 7.2],
							[sx + 1.15, y - 6.2],
						],
						sI % 2 ? '#e4dccb' : lit(col, -0.2),
					);
				}
				rim(x - 4.6, y - 8.4, x + 4.6, y - 8.4, 0.4);
			}
			crate(...gpt(w, 0.5, 0.86));
			sack(...gpt(w, 0.58, 0.9));
			barrel(...gpt(w, 0.5, 0.1));
			lantern(...gpt(w, 0.96, 0.5));
		}, true);
	},
	school(c) {
		const r = block(30, 16, PLASTER, null, 'gable', SLATE, 8);
		door(0, r.d / 2, 5, 9);
		win(-8, r.d / 2 - 5);
		win(8, r.d / 2 - 5);
		P_(
			[
				[-1.4 + r.k / 2, -24],
				[1.4 + r.k / 2, -24],
				[1.4 + r.k / 2, -28],
				[-1.4 + r.k / 2, -28],
			],
			'#5a4a3a',
		);
		E_(r.k / 2, -26, 1, 1.2, '#e6c75a');
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	library(c, o) {
		const d = 40 * TILT,
			uni = G.P[o] && G.P[o].age >= 3;
		P_(
			[
				[-21, d / 2 + 1],
				[21, d / 2 + 1],
				[21, d / 2 - 2],
				[-21, d / 2 - 2],
			],
			'#d8cdb4',
			LINE,
			0.5,
		);
		block(40, 22, PLASTER, null, 'flat');
		for (let x = -16; x <= 16; x += 6.4) column(x, d / 2 - 2, d / 2 - 21);
		const k = d * SIDE;
		if (uni) {
			P_(
				[
					[20, d / 2 - 22],
					[20 + k, d / 2 - 22 - d],
					[14 + k / 2, d / 2 - 34 - d / 2],
				],
				lit(SLATE, -0.60),
				LINE,
				0.5,
			);
			P_(
				[
					[-20, d / 2 - 22],
					[20, d / 2 - 22],
					[14 + k / 2, d / 2 - 34 - d / 2],
					[-14 + k / 2, d / 2 - 34 - d / 2],
				],
				SLATE,
				LINE,
				0.6,
			);
			P_(
				[
					[-3, d / 2 - 34],
					[3, d / 2 - 34],
					[3, d / 2 - 44],
					[0, d / 2 - 48],
					[-3, d / 2 - 44],
				],
				STONE,
				LINE,
				0.5,
			);
		} else
			(ridgeRoof(21, d / 2 - 22, d / 2 - 31, d, '#efe6d4'),
				P_(
					[
						[-21, d / 2 - 22],
						[21, d / 2 - 22],
						[0, d / 2 - 31],
					],
					LG(0, -30, 0, -20, ['#efe6d4', '#c8bca2']),
					LINE,
					0.6,
				));
		L_(-20, d / 2 - 0.5, 20, d / 2 - 0.5, c, 1.2);
	},
	hospital(c) {
		const r = block(30, 16, '#efe8da', null, 'hip', TILE, 7);
		door(0, r.d / 2, 5, 9);
		P_(
			[
				[-9.6, r.d / 2 - 11],
				[-6.4, r.d / 2 - 11],
				[-6.4, r.d / 2 - 3],
				[-9.6, r.d / 2 - 3],
			],
			'#c23a30',
		);
		P_(
			[
				[-12, r.d / 2 - 8.6],
				[-4, r.d / 2 - 8.6],
				[-4, r.d / 2 - 5.4],
				[-12, r.d / 2 - 5.4],
			],
			'#c23a30',
		);
		win(8, r.d / 2 - 5);
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	baths(c) {
		// a low hall of pale stone, a shallow dome, steam from a vent, a pool in front
		const r = block(28, 14, '#e6dcc6', 'stone', 'flat', null, 0, 30);
		const d = r.d;
		E_(0, -14, 10, 4.5, LG(-10, 0, 10, 0, [lit(TILE, 0.16), lit(TILE, -0.45)]), LINE, 0.5);
		E_(0, -16.5, 6, 2.6, lit(TILE, 0.32), LINE, 0.4);
		E_(0, d / 2 + 2, 9, 3.2, '#4e93ad', LINE, 0.5);
		E_(-2, d / 2 + 1.4, 5, 1.6, 'rgba(230,245,255,.5)');
		column(-10, d / 2 - 1, d / 2 - 13);
		column(10, d / 2 - 1, d / 2 - 13);
		door(0, d / 2, 5, 9, '#2a2014');
		banner(13, d / 2 - 14, c, 7);
	},
	theatre(c) {
		// the stage and the seats as one (Build 61): rising half-rings at the back, the stage with its columned wall in front
		const w = 40,
			d = w * TILT,
			k = d * SIDE,
			cx = k * 0.5,
			cy = -d * 0.06;
		field(w, '#c2b69a', c, () => {}, true);
		for (let r = 0; r < 6; r++) {
			const rr = w * 0.46 - r * 3,
				h = 1.6 + r * 1.5,
				col = r % 2 ? '#e3d9c0' : '#d2c6aa';
			g.beginPath();
			g.ellipse(cx, cy, rr, rr * TILT, 0, Math.PI, 2 * Math.PI);
			g.lineTo(cx + rr, cy - h);
			g.ellipse(cx, cy - h, rr, rr * TILT, 0, 0, Math.PI, true);
			g.closePath();
			g.fillStyle = LG(cx - rr, 0, cx + rr, 0, [lit(col, -0.05), lit(col, -0.3), lit(col, -0.55)]);
			g.fill();
			g.beginPath();
			g.ellipse(cx, cy - h, rr, rr * TILT, 0, Math.PI, 2 * Math.PI);
			g.lineTo(cx - rr, cy - h);
			g.closePath();
			g.fillStyle = LG(0, cy - h - rr * TILT, 0, cy - h, [lit(col, 0.22), lit(col, -0.08)]);
			g.fill();
			g.strokeStyle = 'rgba(255,245,210,.55)';
			g.lineWidth = 0.35;
			g.stroke();
			for (let a = 0; a < 7; a++) {
				const t = Math.PI + (Math.PI * (a + 0.5)) / 7;
				L_(cx + rr * Math.cos(t), cy - h + rr * TILT * Math.sin(t), cx + (rr - 2.6) * Math.cos(t), cy - h + (rr - 2.6) * TILT * Math.sin(t), 'rgba(90,70,40,.3)', 0.25);
			}
		}
		const ir = w * 0.46 - 18;
		g.beginPath();
		g.ellipse(cx, cy - 9.1, ir, ir * TILT, 0, Math.PI, 2 * Math.PI);
		g.closePath();
		g.fillStyle = RG(cx, cy - 9.1, 0, ir, ['#d9cba0', '#b9ad84']);
		g.fill();
		E_(cx, cy + 1, ir + 1, (ir + 1) * TILT, RG(cx, cy + 1, 0, ir + 1, ['#d4c6a0', '#b8ab86']));
		const sx0 = -w * 0.3 + k * 0.1,
			sx1 = w * 0.3 + k * 0.1,
			sy = d * 0.3;
		g.save();
		g.translate((sx0 + sx1) / 2, sy - (4 * TILT) / 2);
		block(sx1 - sx0, 2.2, '#e0d6bd', 'stone', 'flat', null, 0, 4);
		g.restore();
		for (let i = 0; i < 6; i++) {
			const x = sx0 + 2 + (i * (sx1 - sx0 - 4)) / 5 + 1;
			P_(
				[
					[x - 0.7, sy - 2.2],
					[x + 0.7, sy - 2.2],
					[x + 0.7, sy - 10.8],
					[x - 0.7, sy - 10.8],
				],
				LG(x - 0.7, 0, x + 0.7, 0, ['#f8f2e0', '#e2d8c0', '#b3a68c']),
				LINE,
				0.25,
			);
			P_(
				[
					[x - 1.1, sy - 10.8],
					[x + 1.1, sy - 10.8],
					[x + 1.1, sy - 11.6],
					[x - 1.1, sy - 11.6],
				],
				'#ebe3cf',
			);
		}
		P_(
			[
				[sx0 - 0.6, sy - 11.6],
				[sx1 + 0.6, sy - 11.6],
				[sx1 + 0.6, sy - 13.2],
				[sx0 - 0.6, sy - 13.2],
			],
			LG(0, sy - 11.6, 0, sy - 13.2, ['#cfc3a6', '#f3ecd8']),
			LINE,
			0.3,
		);
		P_(
			[
				[sx0 - 1, sy - 13.2],
				[sx1 + 1, sy - 13.2],
				[k * 0.1, sy - 16.8],
			],
			LG(0, sy - 13.2, 0, sy - 16.8, ['#e4dbc4', '#faf5e6']),
			LINE,
			0.3,
		);
		rim(sx0 - 1, sy - 13.2, k * 0.1, sy - 16.8, 0.6);
		for (const [dx, col] of [
			[-7, c],
			[7, '#3b5fa6'],
		])
			banner(k * 0.1 + dx, sy - 2.2, col, 6);
		L_(-w / 2, d / 2 - 0.5, w / 2, d / 2 - 0.5, c, 1.2);
	},
	tavern(c) {
		// a timber house with a bright door, a lantern and a hanging sign
		const r = block(26, 16, '#6b4a2c', 'timber', 'gable', SLATE, 9);
		const d = r.d;
		door(-5, d / 2, 5, 9, '#2a1a0c');
		win(4, d / 2 - 6, 2.6, 2.6, '#e8b85a');
		win(9, d / 2 - 6, 2.6, 2.6, '#e8b85a');
		win(-10, d / 2 - 6, 2.6, 2.6, '#e8b85a');
		L_(9, d / 2 - 12, 9, d / 2 - 5, '#3a2a1a', 0.7);
		P_(
			[
				[9, d / 2 - 11],
				[14, d / 2 - 11],
				[14, d / 2 - 7],
				[9, d / 2 - 7],
			],
			'#8a5a2a',
			LINE,
			0.4,
		);
		E_(11.5, d / 2 - 9, 1.6, 1.6, '#e8c860');
		banner(-8, d / 2 - 14, c, 6);
	},
	temple(c) {
		const d = 40 * TILT;
		for (let i = 0; i < 3; i++)
			P_(
				[
					[-21 + i * 1.5, d / 2 - i * 1.6],
					[21 - i * 1.5, d / 2 - i * 1.6],
					[21 - i * 1.5, d / 2 - i * 1.6 - 1.6],
					[-21 + i * 1.5, d / 2 - i * 1.6 - 1.6],
				],
				'#d8cdb4',
				LINE,
				0.4,
			);
		sides(-16, 16, d / 2 - 5, 22, d, '#c9bfa6');
		P_(
			[
				[-16, d / 2 - 5],
				[16, d / 2 - 5],
				[16, d / 2 - 27],
				[-16, d / 2 - 27],
			],
			'#c9bfa6',
			LINE,
			0.4,
		);
		for (let x = -15; x <= 15; x += 5) column(x, d / 2 - 5, d / 2 - 27);
		ridgeRoof(19, d / 2 - 27, d / 2 - 38, d, '#c9a227');
		P_(
			[
				[-19, d / 2 - 27],
				[19, d / 2 - 27],
				[0, d / 2 - 38],
			],
			LG(0, -38, 0, -26, ['#f2d880', '#c9a227']),
			LINE,
			0.6,
		);
		E_(0, d / 2 - 31, 2, 2, c);
	},
	courthouse(c) {
		const d = 30 * TILT;
		block(30, 20, '#d8d0c0', 'stone', 'flat');
		for (let x = -12; x <= 12; x += 6) column(x, d / 2, d / 2 - 19);
		ridgeRoof(16, d / 2 - 20, d / 2 - 28, d, '#e8e0cc');
		P_(
			[
				[-16, d / 2 - 20],
				[16, d / 2 - 20],
				[0, d / 2 - 28],
			],
			'#e8e0cc',
			LINE,
			0.5,
		);
		L_(-3, d / 2 - 24, 3, d / 2 - 24, '#c9a227', 0.6);
		L_(0, d / 2 - 26, 0, d / 2 - 22, '#c9a227', 0.6);
		L_(-15, d / 2 - 0.5, 15, d / 2 - 0.5, c, 1.2);
	},
	siege(c) {
		const r = block(40, 18, PLANK, 'plank', 'gable', '#3a3634', 9);
		P_(
			[
				[-3, r.d / 2],
				[12, r.d / 2],
				[12, r.d / 2 - 12],
				[-3, r.d / 2 - 12],
			],
			'#2a1a0a',
			LINE,
			0.4,
		);
		wheel(4, r.d / 2 - 3, 3);
		L_(-16, r.d / 2, -10, -30, '#5a3a1c', 1);
		L_(-10, -30, 0, -26, '#5a3a1c', 0.8);
		L_(0, -26, 0, -20, '#9a8a6a', 0.4);
		banner(17, r.d / 2 - 18, c, 9);
		L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2);
	},
	dock(c) {
		// a pier out over the water (Build 61): planks on piles, the crane, a moored boat
		const w = 20,
			d = w * TILT,
			k = d * SIDE,
			L = d + 16,
			pw = w * 0.24,
			kk = (L / d) * k;
		E_(kk * 0.55, d / 2 - L * 0.55, w * 0.9, L * 0.5, RG(kk * 0.55, d / 2 - L * 0.55, 0, w * 0.9, ['rgba(60,130,175,.95)', 'rgba(60,130,175,.7)', 'rgba(60,130,175,0)'])); // the water it stands in
		for (const [x, y] of [
			[-pw + 1, d / 2 - 1],
			[pw - 1, d / 2 - 1],
			[-pw + 1 + kk * 0.5, d / 2 - 1 - L * 0.5],
			[pw - 1 + kk * 0.5, d / 2 - 1 - L * 0.5],
			[-pw + 1 + kk, d / 2 - 1 - L],
			[pw - 1 + kk, d / 2 - 1 - L],
		])
			post(x, y + 1.6, 3.2, '#4a3220', 0.55);
		P_(
			[
				[pw, d / 2],
				[pw + 1.6, d / 2 + 1.2],
				[pw + 1.6 + kk, d / 2 + 1.2 - L],
				[pw + kk, d / 2 - L],
			],
			lit('#7f8d88', -0.45),
			LINE,
			0.3,
		);
		P_(
			[
				[-pw, d / 2],
				[pw, d / 2],
				[pw + kk, d / 2 - L],
				[-pw + kk, d / 2 - L],
			],
			LG(0, d / 2, 0, d / 2 - L, [lit('#a4b3ad', 0.1), lit('#a4b3ad', -0.25)]), // weathered planks: silver-grey, as pier wood goes
			LINE,
			0.35,
		);
		for (let i = 1; i < 9; i++) L_(-pw + (kk * i) / 9, d / 2 - (L * i) / 9, pw + (kk * i) / 9, d / 2 - (L * i) / 9, 'rgba(60,40,20,.42)', 0.3);
		const cxp = pw - 1.6 + kk * 0.8,
			cyp = d / 2 - L * 0.8;
		post(cxp, cyp, 11, '#4a3220', 0.7);
		L_(cxp, cyp - 11, cxp + 6.5, cyp - 8.4, '#4a3220', 0.8);
		L_(cxp - 0.2, cyp - 8.2, cxp + 4.4, cyp - 9.3, '#4a3220', 0.5);
		L_(cxp + 6.5, cyp - 8.4, cxp + 6.5, cyp - 3.6, '#ddd', 0.25);
		crate(cxp + 6.5, cyp - 1.6);
		const bx = -pw - 7.5,
			by = d / 2 - L * 0.45;
		E_(bx + 0.5, by + 1.6, 6.5, 1.6, 'rgba(10,30,50,.3)');
		P_(
			[
				[bx - 6.5, by - 1.5],
				[bx + 6, by - 1.5],
				[bx + 7.2, by - 3.6],
				[bx + 5, by + 1.2],
				[bx - 4.5, by + 1.2],
			],
			LG(0, by - 3.6, 0, by + 1.2, [lit('#8a6a3a', 0.2), lit('#6b4a2c', -0.35)]),
			LINE,
			0.3,
		);
		L_(bx - 6, by - 1.5, bx + 6.8, by - 1.5, '#c9a46a', 0.5);
		post(bx + 0.5, by - 0.8, 7.5, '#4a3220', 0.3);
		P_(
			[
				[bx + 0.8, by - 8.1],
				[bx + 5.2, by - 6.4],
				[bx + 0.8, by - 2.4],
			],
			'#efe6cf',
			LINE,
			0.25,
		);
		banner(pw + 0.6, d / 2 - 1.8, c, 6);
	},
	tower(c, o, tier) {
		// three steps, one shape (Build 51): the watchtower; the great tower, taller, wider, with a hoarding of timber on its corbels; the gun tower, low and thick on a sloped foot, with gun ports
		const T = TOWER_LOOK[tier || 0],
			d = 20 * TILT,
			w = T.w,
			h = T.h,
			f = d / 2;
		if (T.batter) {
			const b = w + 5,
				dk = 16 * TILT,
				k = dk * SIDE;
			P_(
				[
					[b, f + 2],
					[b + k, f + 2 - dk],
					[w + k, f - 10 - dk],
					[w, f - 10],
				],
				lit(STONE, -0.60),
				LINE,
				0.5,
			); // its shaded east face
			P_(
				[
					[-b, f + 2],
					[b, f + 2],
					[w, f - 10],
					[-w, f - 10],
				],
				LG(-b, 0, b, 0, [lit(STONE, -0.16), lit(STONE, -0.60)]),
				LINE,
				0.6,
			);
			texture('stone', -b + 2, f - 10, b - 2, f + 2, STONE);
		} // the gun tower's sloped foot: cannon shot glances off
		sides(-w, w, f - (T.batter ? 10 : 0), h - (T.batter ? 10 : 0), 16 * TILT, T.wall);
		P_(
			[
				[-w, f - (T.batter ? 10 : 0)],
				[w, f - (T.batter ? 10 : 0)],
				[w, f - h],
				[-w, f - h],
			],
			LG(-w, 0, w, 0, [lit(T.wall, -0.08), lit(T.wall, -0.48)]),
			LINE,
			0.6,
		);
		texture('stone', -w, f - h, w, f - (T.batter ? 10 : 0), T.wall);
		if (T.hoard) {
			P_(
				[
					[-w - 3, f - h],
					[w + 3, f - h],
					[w + 3, f - h - 7],
					[-w - 3, f - h - 7],
				],
				LG(-w, 0, w, 0, [lit(PLANK, 0.08), lit(PLANK, -0.45)]),
				LINE,
				0.5,
			);
			for (let x = -w; x <= w; x += 4) L_(x, f - h, x, f - h - 7, lit(PLANK, -0.60), 0.6);
			P_(
				[
					[-w - 4, f - h - 7],
					[w + 4, f - h - 7],
					[0, f - h - 19],
				],
				LG(-w, 0, w, 0, [lit(SLATE, 0.16), lit(SLATE, -0.40)]),
				LINE,
				0.6,
			); // the timber hoarding round the top, under a slate cap
		} else {
			P_(
				[
					[-w - 1, f - h],
					[w + 1, f - h],
					[w + 1, f - h - 3],
					[-w - 1, f - h - 3],
				],
				T.wall,
				LINE,
				0.4,
			);
			crenels(-w - 1, w + 1, f - h - 3, T.wall);
		}
		if (T.guns)
			for (const x of [-w * 0.5, w * 0.5]) {
				P_(
					[
						[x - 2.6, f - h + 8],
						[x + 2.6, f - h + 8],
						[x + 2.6, f - h + 3],
						[x - 2.6, f - h + 3],
					],
					'#14100c',
					LINE,
					0.3,
				);
				L_(x, f - h + 5.5, x + 1.5, f - h + 7, '#2e2a26', 1.6);
			} // gun ports
		else for (let y = f - h + 14; y < f - 8; y += 14) win(0, y, 1.2, 4, '#14100c');
		banner(T.hoard ? 0 : w - 2, f - h - (T.hoard ? 19 : 3), c, T.flag); // on the cap's point, or the corner of the battlements
	},
	wall(c) {
		const d = 10 * TILT;
		P_(
			[
				[-5, d / 2],
				[5, d / 2],
				[5, d / 2 - 18],
				[-5, d / 2 - 18],
			],
			LG(-5, 0, 5, 0, [lit(STONE, -0.13), lit(STONE, -0.42)]),
			LINE,
			0.5,
		);
		texture('stone', -5, d / 2 - 18, 5, d / 2, STONE);
		P_(
			[
				[-5, d / 2 - 18],
				[5, d / 2 - 18],
				[5, -d / 2 - 18],
				[-5, -d / 2 - 18],
			],
			lit(STONE, 0.13),
			LINE,
			0.4,
		);
		P_(
			[
				[-5, d / 2 - 18],
				[-2, d / 2 - 18],
				[-2, d / 2 - 20.5],
				[-5, d / 2 - 20.5],
			],
			STONE,
			LINE,
			0.3,
		);
		P_(
			[
				[1, d / 2 - 18],
				[4, d / 2 - 18],
				[4, d / 2 - 20.5],
				[1, d / 2 - 20.5],
			],
			STONE,
			LINE,
			0.3,
		);
	},
	gate(c) {
		const d = 10 * TILT;
		P_(
			[
				[-5, d / 2],
				[5, d / 2],
				[5, d / 2 - 20],
				[-5, d / 2 - 20],
			],
			LG(-5, 0, 5, 0, ['#8a6a44', '#5a3a1c']),
			LINE,
			0.5,
		);
		L_(-5, d / 2 - 6, 5, d / 2 - 6, '#2a1a0a', 0.7);
		L_(-5, d / 2 - 14, 5, d / 2 - 14, '#2a1a0a', 0.7);
		P_(
			[
				[-2, d / 2 - 20],
				[2, d / 2 - 20],
				[2, d / 2 - 23],
				[-2, d / 2 - 23],
			],
			c,
		);
	},
	farm(c, o, v) {
		const w = 30,
			crop = { Spring: '#8fb84a', Summer: '#e0c266', Autumn: '#d9a93e', Winter: '#a39a86' }[season().name],
			dark = { Spring: '#5f8a2e', Summer: '#b8962e', Autumn: '#a67a22', Winter: '#7a7262' }[season().name];
		field(w, '#7a5e36', c, () => {
			for (let i = 0; i < 7; i++) {
				const t0 = (i + 0.08) / 7,
					t1 = (i + 0.92) / 7,
					a = gpt(w, 0.03, t0),
					b = gpt(w, 0.97, t0),
					c2 = gpt(w, 0.97, t1),
					d2 = gpt(w, 0.03, t1);
				P_([a, b, c2, d2], LG(0, a[1], 0, d2[1], [i % 2 ? crop : lit(crop, 0.12), dark]));
				for (let j = 0; j < 10; j++) {
					const [x, y] = gpt(w, 0.05 + j * 0.095, (i + 0.5) / 7);
					L_(x, y, x + 0.2, y - 1.5, 'rgba(255,240,170,.55)', 0.25);
					L_(x + 0.6, y, x + 1, y - 1.2, 'rgba(120,80,20,.4)', 0.22);
				}
			}
		});
		hay(w * 0.36, (w * TILT) * 0.46, 1);
	},
	pasture(c, o, n) {
		const w = 30;
		field(w, '#86ae5c', c, () => {
			grassTufts(w, '#5a8a3a', 40);
			const [px, py] = gpt(w, 0.72, 0.7);
			E_(px, py, 4.4, 1.8, RG(px - 1, py - 0.6, 0, 4.4, ['#5fa0c4', '#2f5f80']));
			E_(px - 1, py - 0.6, 1.4, 0.5, 'rgba(255,255,255,.35)');
			for (let i = 0; i < (n || 0); i++) {
				const [x, y] = gpt(w, 0.14 + (i % 4) * 0.24 + ((i >> 2) % 2) * 0.08, 0.2 + Math.floor(i / 4) * 0.28);
				sheep(x, y);
			}
		});
	},
	council(c) {
		const r = block(30, 18, STONE, 'stone', 'hip', '#7a2e2a', 9);
		door(0, r.d / 2, 6, 10, '#4a2e16');
		win(-9, r.d / 2 - 9, 2, 3.4);
		win(9, r.d / 2 - 9, 2, 3.4);
		for (const x of [-15, 15]) {
			L_(x - 3, r.d / 2 + 2, x + 3, r.d / 2 - 12, '#8a6a3a', 0.8);
			L_(x + 3, r.d / 2 + 2, x - 3, r.d / 2 - 12, '#8a6a3a', 0.8);
		}
		banner(-10, r.top + 2, c, 10);
		banner(10, r.top + 2, c, 10);
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	tpost(c) {
		const d = 20 * TILT;
		block(20, 14, STONE, 'stone', 'flat');
		P_(
			[
				[-12, d / 2 - 12],
				[12, d / 2 - 12],
				[9, d / 2 - 18],
				[-9, d / 2 - 18],
			],
			'#b2563a',
			LINE,
			0.4,
		);
		for (let i = 0; i < 5; i++)
			P_(
				[
					[-11 + i * 4.6, d / 2 - 12],
					[-9 + i * 4.6, d / 2 - 12],
					[-9 + i * 4.6, d / 2 - 10.6],
					[-11 + i * 4.6, d / 2 - 10.6],
				],
				i % 2 ? '#f0e6d0' : c,
			);
		door(0, d / 2, 5, 8);
		banner(8, d / 2 - 18, c, 10);
	},
	treefarm(c, o, v) {
		const w = 30,
			spent = v === 'spent';
		field(w, '#6a5636', c, () => {
			for (let j = 2; j >= 0; j--)
				for (let i = 0; i < 3; i++) {
					const [x, y] = gpt(w, (i + 0.5) / 3, (j + 0.5) / 3);
					E_(x, y, 3.4, 1.3, 'rgba(80,60,30,.45)');
					if (spent) stump(x, y);
					else smallTree(x, y, 1.05, j === 1 ? '#4a9a40' : '#3e8a3c');
				}
			const [lx, ly] = gpt(w, 0.07, 0.07);
			for (let i = 0; i < 3; i++)
				P_(
					[
						[lx + i * 0.4, ly - i * 1.2],
						[lx + 5.5 + i * 0.4, ly - i * 1.2],
						[lx + 5.5 + i * 0.4, ly - 1.1 - i * 1.2],
						[lx + i * 0.4, ly - 1.1 - i * 1.2],
					],
					LG(0, ly - i * 1.2, 0, ly - 1.1 - i * 1.2, ['#8a6a3a', '#c9a46a']),
				);
		});
	},
	throne(c, o) {
		g.save();
		g.scale(1.25, 1.25);
		ART.castle(c, o);
		g.restore();
		const d = 62 * TILT;
		P_(
			[
				[-8, d / 2 - 52],
				[8, d / 2 - 52],
				[8, d / 2 - 66],
				[0, d / 2 - 74],
				[-8, d / 2 - 66],
			],
			LG(0, -74, 0, -52, ['#f2d880', '#b8902a']),
			LINE,
			0.6,
		);
		E_(0, d / 2 - 60, 2.4, 2.4, '#8e1d14');
	}, // the old citadel: a castle and a half, crowned in gold
	workshop(c) {
		// an open yard under a shed roof (Build 61, Albert: open-air work): the loom, the dye rack, barrels, sacks; the weaver stands in it
		const w = 30,
			d = w * TILT,
			k = d * SIDE;
		field(w, '#b0945f', c, () => {
			const x0 = -w * 0.46 + k * 0.55,
				x1 = w * 0.46 + k * 0.55,
				yf = d / 2 - d * 0.55,
				hd = w * 0.42 * TILT;
			for (const px of [x0 + 1.2 + hd * SIDE, x1 - 1.2 + hd * SIDE]) post(px, yf - hd, 8.5, '#5a3a1e', 0.6);
			leanto(x0, x1, yf, 8, w * 0.42, 2.8, THATCH);
			for (const px of [x0 + 1.2, x1 - 1.2]) post(px, yf, 8, '#5a3a1e', 0.6);
			const lx = x0 + 6 + k * 0.15,
				ly = yf - d * 0.15;
			E_(lx, ly, 2.8, 1.9, RG(lx - 0.6, ly - 0.5, 0, 3, ['#c48a4a', '#7a4a22']));
			for (let i = 0; i < 6; i++) L_(lx - 1.8, ly - 1.4 + i * 0.5, lx + 1.8, ly - 1.4 + i * 0.5, 'rgba(255,240,200,.5)', 0.22);
			const rx = x0 + 15,
				ry = yf - 2;
			L_(rx - 1, ry - 4.6, rx + 8.5, ry - 4.6, '#5a3a1e', 0.45);
			for (const [dx, col] of [
				[0, '#8a4a7a'],
				[3, '#2f6c8e'],
				[6, '#c0392b'],
			])
				P_(
					[
						[rx + dx, ry - 4.6],
						[rx + dx + 2.6, ry - 4.6],
						[rx + dx + 1.6, ry - 0.6],
						[rx + dx + 0.2, ry - 1],
					],
					LG(rx + dx, 0, rx + dx + 2.6, 0, [lit(col, 0.2), lit(col, -0.3)]),
				);
			barrel(w * 0.22, d * 0.3);
			barrel(w * 0.33, d * 0.26);
			sack(-w * 0.05, d * 0.38);
		});
	},
	foundry(c) {
		// a bloomery under a shed (Build 61): the furnace glows, smoke rises, the anvil waits; the smelter works in the open
		const w = 30,
			d = w * TILT,
			k = d * SIDE;
		field(w, '#5e5650', c, () => {
			const x0 = -w * 0.46 + k * 0.55,
				x1 = w * 0.46 + k * 0.55,
				yf = d / 2 - d * 0.55,
				hd = w * 0.42 * TILT;
			for (const px of [x0 + 1.2 + hd * SIDE, x1 - 1.2 + hd * SIDE]) post(px, yf - hd, 9.5, '#3a3030', 0.65);
			leanto(x0, x1, yf, 9, w * 0.42, 2.8, '#4e4e5c');
			for (const px of [x0 + 1.2, x1 - 1.2]) post(px, yf, 9, '#3a3030', 0.65);
			const fx = k * 0.25,
				fy = d * 0.02;
			g.save();
			g.translate(fx, fy);
			block(7.2, 7.8, '#8a6a52', 'stone', 'flat', null, 0, 6.5);
			g.restore();
			E_(fx + 1.2, fy - 7.8 - 2.1, 2.1, 0.85, '#1a1414');
			P_(
				[
					[fx - 1.8, fy + 2.1],
					[fx + 1.8, fy + 2.1],
					[fx + 1.6, fy - 0.7],
					[fx, fy - 1.9],
					[fx - 1.6, fy - 0.7],
				],
				RG(fx, fy + 0.9, 0, 2.4, ['#fff7b0', '#ff8a2a', '#8a2a10']),
				LINE,
				0.3,
			);
			E_(fx, fy + 1.1, 7, 4.6, RG(fx, fy + 1.1, 0, 7, ['rgba(255,150,60,.42)', 'rgba(255,150,60,0)']));
			for (let i = 0; i < 5; i++) E_(fx + 1.2 + i * 1.3 + Math.sin(i * 1.7) * 0.8, fy - 11 - i * 3.2, 1.5 + i * 1.1, 1.1 + i * 0.8, `rgba(220,215,210,${0.4 - i * 0.07})`);
			const [ax, ay] = gpt(w, 0.78, 0.3);
			P_(
				[
					[ax - 1.9, ay],
					[ax + 1.9, ay],
					[ax + 1.9, ay - 1.6],
					[ax - 1.9, ay - 1.6],
				],
				'#4a3220',
			);
			P_(
				[
					[ax - 2.6, ay - 1.6],
					[ax + 2.8, ay - 1.6],
					[ax + 2.2, ay - 3],
					[ax - 1.8, ay - 3],
				],
				LG(ax - 2.6, 0, ax + 2.8, 0, ['#9a9aa2', '#4a4a52']),
				LINE,
				0.3,
			);
			for (let i = 0; i < 4; i++)
				P_(
					[
						[-w * 0.4 + i * 2.4, d * 0.4],
						[-w * 0.4 + 2 + i * 2.4, d * 0.4],
						[-w * 0.4 + 2.3 + i * 2.4, d * 0.4 - 1],
						[-w * 0.4 + 0.3 + i * 2.4, d * 0.4 - 1],
					],
					'#5a4a42',
				);
		});
	},
	quarry(c) {
		const w = 30,
			d = w * TILT;
		field(w, '#9a948a', c, () => {
			P_([gpt(w, 0.08, 0.45), gpt(w, 0.6, 0.45), gpt(w, 0.6, 0.92), gpt(w, 0.08, 0.92)], LG(0, d / 2 - d * 0.45, 0, d / 2 - d * 0.92, ['#4a4640', '#6a665e']));
			const [qx, qy] = gpt(w, 0.08, 0.45);
			P_(
				[
					[qx, qy],
					[qx + w * 0.52, qy],
					[qx + w * 0.52, qy - 3.4],
					[qx, qy - 3.4],
				],
				LG(qx, 0, qx + w * 0.52, 0, [lit('#c2bcb0', 0.1), lit('#c2bcb0', -0.25)]),
				LINE,
				0.35,
			);
			for (let i = 0; i < 7; i++) L_(qx + 1 + i * 2.2, qy - 0.3, qx + 1.6 + i * 2.2, qy - 3.1, 'rgba(40,36,30,.4)', 0.25);
			rim(qx, qy - 3.4, qx + w * 0.52, qy - 3.4, 0.5);
			for (let i = 0; i < 5; i++) {
				const [bx, by] = gpt(w, 0.68 + (i % 3) * 0.11, 0.2 + Math.floor(i / 3) * 0.2);
				P_(
					[
						[bx, by],
						[bx + 2.8, by],
						[bx + 3.3, by - 1],
						[bx + 0.5, by - 1],
					],
					'#e2dcd0',
				);
				P_(
					[
						[bx, by],
						[bx + 2.8, by],
						[bx + 2.8, by - 1.9],
						[bx, by - 1.9],
					],
					LG(bx, 0, bx + 2.8, 0, ['#d4cec2', '#a9a398']),
					LINE,
					0.25,
				);
				P_(
					[
						[bx + 2.8, by],
						[bx + 3.3, by - 1],
						[bx + 3.3, by - 2.9],
						[bx + 2.8, by - 1.9],
					],
					'#8a847a',
				);
			}
			const [cx, cy] = gpt(w, 0.3, 0.75);
			post(cx, cy, 13, '#5a3a1e', 0.65);
			L_(cx, cy - 13, cx + 7.5, cy - 10.6, '#5a3a1e', 0.9);
			L_(cx, cy - 10.5, cx + 5.4, cy - 11.1, '#5a3a1e', 0.55);
			L_(cx + 7.5, cy - 10.6, cx + 7.5, cy - 3.2, '#ddd', 0.25);
			P_(
				[
					[cx + 6.4, cy - 3.2],
					[cx + 8.6, cy - 3.2],
					[cx + 8.6, cy - 4.8],
					[cx + 6.4, cy - 4.8],
				],
				'#c2bcb0',
			);
		});
	},
	mint(c) {
		// a walled yard with a strongroom, the press and the coin bench, a guard at the gate (Build 61): the one shop that stays guarded
		const w = 30,
			d = w * TILT,
			k = d * SIDE,
			H = 7.5,
			WALL = '#aca494';
		field(w, '#c2b69a', c, () => {}, true);
		P_(
			[
				[-w / 2 + k, -d / 2],
				[w / 2 + k, -d / 2],
				[w / 2 + k, -d / 2 - H],
				[-w / 2 + k, -d / 2 - H],
			],
			LG(0, -d / 2, 0, -d / 2 - H, [lit(WALL, -0.2), lit(WALL, 0.05)]),
			LINE,
			0.4,
		);
		for (let i = 1; i < 4; i++) L_(-w / 2 + k + 0.3, -d / 2 - (i * H) / 4, w / 2 + k - 0.3, -d / 2 - (i * H) / 4, 'rgba(30,22,16,.25)', 0.22);
		P_(
			[
				[-w / 2, d / 2],
				[-w / 2 + k, -d / 2],
				[-w / 2 + k, -d / 2 - H],
				[-w / 2, d / 2 - H],
			],
			lit(WALL, -0.25),
			LINE,
			0.4,
		);
		g.save();
		g.translate(w * 0.2 + k * 0.55, d / 2 - d * 0.55 + 2);
		block(9.6, 8.5, '#b0a898', 'stone', 'hip', SLATE, 4.2, 9.5);
		door(-1.6, 9.5 * TILT / 2, 2.4, 4.4, '#2a2014');
		win(2.6, 9.5 * TILT / 2 - 3.6, 1.3, 2, true);
		g.restore();
		const [ax, ay] = gpt(w, 0.25, 0.5);
		E_(ax, ay, 2.8, 1.2, RG(ax, ay, 0, 2.8, ['#6a6a72', '#3a3a42']));
		P_(
			[
				[ax - 0.9, ay],
				[ax + 0.9, ay],
				[ax + 0.9, ay - 4.4],
				[ax - 0.9, ay - 4.4],
			],
			LG(ax - 0.9, 0, ax + 0.9, 0, ['#a0a0a8', '#4a4a52']),
			LINE,
			0.3,
		);
		E_(ax, ay - 4.4, 0.9, 0.38, '#b0b0b8');
		for (let i = 0; i < 6; i++) E_(ax + 3 + (i % 3) * 1.2, ay + 1.2 - Math.floor(i / 3) * 0.7, 0.55, 0.25, '#f2d27a');
		crate(-w * 0.3 + k * 0.3, d / 2 - d * 0.3);
		g.save();
		g.translate(0, d / 2 - (0.1 * TILT) / 2);
		block(w, 3.8, WALL, 'stone', 'flat', null, 0, 0.1);
		g.restore();
		P_(
			[
				[w / 2, d / 2],
				[w / 2 + k, -d / 2],
				[w / 2 + k, -d / 2 - H],
				[w / 2, d / 2 - H],
			],
			LG(w / 2, 0, w / 2 + k, 0, [lit(WALL, -0.45), lit(WALL, -0.6)]),
			LINE,
			0.4,
		);
		for (let i = 1; i < 3; i++) L_(w / 2 + 0.2, d / 2 - i * 2.4, w / 2 + k - 0.2, d / 2 - i * 2.4 - d, 'rgba(10,20,30,.25)', 0.25);
		rim(-w / 2 + k, -d / 2 - H, w / 2 + k, -d / 2 - H, 0.4);
		P_(
			[
				[-2.4, d / 2],
				[2.4, d / 2],
				[2.4, d / 2 - 2.8],
				[0, d / 2 - 4],
				[-2.4, d / 2 - 2.8],
			],
			'#2a2014',
		);
		banner(w / 2 + 0.5, d / 2 - 3.8, c, 7);
		L_(-w / 2, d / 2 - 0.5, w / 2, d / 2 - 0.5, c, 1.2);
	},
	wonder(c, o) {
		(WONDERART[G.P[o] && G.P[o].civ] || WONDERART.roman)(c);
	},
};
// the ground every plot shares (Build 61): the tilted parallelogram a building stands on, a worn margin, posts at the corners, a low rail;
// rows() draws what grows or lies on it. The side's colour runs along the front rail.
const plotPts = (w) => {
	const d = w * TILT,
		k = d * SIDE;
	return [
		[-w / 2, d / 2],
		[w / 2, d / 2],
		[w / 2 + k, -d / 2],
		[-w / 2 + k, -d / 2],
	];
};
const gpt = (w, t, u) => {
	const d = w * TILT,
		k = d * SIDE;
	return [-w / 2 + w * t + k * u, d / 2 - d * u];
};
const post = (x, y, h, col = '#5a3a1e', pw = 0.7) => {
	E_(x + 0.4, y + 0.15, pw * 1.6, pw * 0.7, 'rgba(20,30,40,.3)');
	P_(
		[
			[x - pw, y],
			[x + pw, y],
			[x + pw * 0.9, y - h],
			[x - pw * 0.9, y - h],
		],
		LG(x - pw, 0, x + pw, 0, [lit(col, 0.25), col, lit(col, -0.4)]),
		LINE,
		0.3,
	);
	E_(x, y - h, pw * 0.9, pw * 0.35, lit(col, 0.3));
};
const rail = (p0, p1, col = '#6b4a2c') => {
	L_(p0[0], p0[1] - 2.6, p1[0], p1[1] - 2.6, lit(col, -0.3), 0.7);
	L_(p0[0], p0[1] - 2.7, p1[0], p1[1] - 2.7, 'rgba(255,245,210,.35)', 0.25);
	L_(p0[0], p0[1] - 1.3, p1[0], p1[1] - 1.3, lit(col, -0.2), 0.55);
};
function field(w, soil, c, rows, open) {
	const C = plotPts(w),
		d = w * TILT,
		k = d * SIDE;
	E_(k * 0.5 + 1.5, 1, w * 0.66, d * 0.68, RG(k * 0.5, 0, 0, w * 0.66, ['rgba(60,40,20,.26)', 'rgba(60,40,20,0)']));
	P_(C, LG(-w / 2, d / 2, w / 2 + k, -d / 2, [lit(soil, 0.12), soil, lit(soil, -0.18)]), 'rgba(0,0,0,.28)', 0.35);
	rows();
	if (!open) {
		rail(C[3], C[2]);
		rail(C[0], C[3]);
		post(C[3][0], C[3][1], 3.8);
		post(C[2][0], C[2][1], 3.8);
		rail(C[1], C[2]);
		rail(C[0], C[1]);
		for (let i = 1; i < 3; i++) {
			const [x, y] = gpt(w, i / 3, 0);
			post(x, y, 2.8, '#5a3a1e', 0.5);
		}
		post(C[0][0], C[0][1], 3.8);
		post(C[1][0], C[1][1], 3.8);
	}
	L_(-w / 2, d / 2, w / 2, d / 2, c, 1);
}
const RG = (x, y, r0, r1, stops) => {
	const q = g.createRadialGradient(x, y, r0, x, y, r1);
	stops.forEach((c, i) => q.addColorStop(i / (stops.length - 1), c));
	return q;
};
const WONDERART = {
	roman(c) {
		E_(0, 0, 30, 30 * TILT, '#c8bca2', LINE, 0.6);
		for (let lv = 0; lv < 4; lv++) {
			const y0 = -lv * 10;
			g.save();
			g.beginPath();
			g.ellipse(0, y0, 30, 30 * TILT, 0, 0, Math.PI);
			g.lineTo(-30, y0 - 10);
			g.ellipse(0, y0 - 10, 30, 30 * TILT, 0, Math.PI, 0, true);
			g.closePath();
			g.fillStyle = LG(-30, 0, 30, 0, ['#e6dcc2', '#c4b694', '#9a8e76']);
			g.fill();
			g.strokeStyle = LINE;
			g.lineWidth = 0.5;
			g.stroke();
			g.restore();
			if (lv < 3)
				for (let a = 0.12; a < Math.PI; a += 0.2) {
					const x = Math.cos(a) * 30,
						y = Math.sin(a) * 30 * TILT + y0;
					g.beginPath();
					g.arc(x, y - 6, 1.5, Math.PI, 0);
					g.lineTo(x + 1.5, y - 2);
					g.lineTo(x - 1.5, y - 2);
					g.closePath();
					g.fillStyle = '#4a3e2e';
					g.fill();
				}
		}
		E_(0, -40, 30, 30 * TILT, '#d8cdb4', LINE, 0.5);
		E_(0, -40, 19, 19 * TILT, '#c8a878', LINE, 0.5);
		banner(-24, -40, c, 8);
		banner(24, -40, c, 8);
	},
	han(c) {
		const d = 60 * TILT;
		sides(-30, 30, d / 2, 8, d, '#b8a47a');
		P_(
			[
				[-30, d / 2],
				[30, d / 2],
				[30, d / 2 - 8],
				[-30, d / 2 - 8],
			],
			'#9a8058',
			LINE,
			0.5,
		);
		g.save();
		g.translate(0, d / 2 - 8);
		for (let x = -18; x <= 18; x += 6)
			P_(
				[
					[x - 1, 0],
					[x + 1, 0],
					[x + 1, -16],
					[x - 1, -16],
				],
				'#a8302a',
				LINE,
				0.3,
			);
		P_(
			[
				[-20, -16],
				[20, -16],
				[20, -18],
				[-20, -18],
			],
			'#3a2a20',
		);
		g.beginPath();
		g.moveTo(-30, -15);
		g.quadraticCurveTo(-20, -20, -14, -32);
		g.lineTo(14, -32);
		g.quadraticCurveTo(20, -20, 30, -15);
		g.closePath();
		g.fillStyle = LG(0, -32, 0, -15, ['#4a4a52', '#2f2f36']);
		g.fill();
		g.strokeStyle = LINE;
		g.lineWidth = 0.6;
		g.stroke();
		g.beginPath();
		g.moveTo(-20, -30);
		g.quadraticCurveTo(-12, -34, -8, -42);
		g.lineTo(8, -42);
		g.quadraticCurveTo(12, -34, 20, -30);
		g.closePath();
		g.fill();
		g.stroke();
		L_(-9, -42, 9, -42, '#c9a227', 1);
		g.restore();
		banner(-26, d / 2 - 8, c, 10);
	},
	persian(c) {
		const d = 60 * TILT;
		sides(-31, 31, d / 2, 6, d, '#bfae8a', false);
		P_(
			[
				[-31, d / 2],
				[31, d / 2],
				[31, d / 2 - 6],
				[-31, d / 2 - 6],
			],
			'#bfae8a',
			LINE,
			0.5,
		);
		for (let i = 0; i < 3; i++)
			P_(
				[
					[-8 + i * 2, d / 2 + 0.2 - i * 2],
					[8 - i * 2, d / 2 + 0.2 - i * 2],
					[8 - i * 2, d / 2 - 2 - i * 2],
					[-8 + i * 2, d / 2 - 2 - i * 2],
				],
				'#d8c8a2',
				LINE,
				0.3,
			);
		P_(
			[
				[-28, d / 2 - 6],
				[28, d / 2 - 6],
				[28 + d * SIDE, -d / 2 - 6],
				[-28 + d * SIDE, -d / 2 - 6],
			],
			'#a89470',
			LINE,
			0.4,
		);
		for (let row = 0; row < 3; row++)
			for (let x = -24; x <= 24; x += 8) {
				const yb = d / 2 - 6 - row * 6;
				column(x + (row % 2) * 4, yb, yb - 28, '#d8c8a2');
				P_(
					[
						[x + (row % 2) * 4 - 2.4, yb - 28],
						[x + (row % 2) * 4 + 2.4, yb - 28],
						[x + (row % 2) * 4 + 1.6, yb - 30.4],
						[x + (row % 2) * 4 - 1.6, yb - 30.4],
					],
					'#8a7a5a',
				);
			}
		P_(
			[
				[-30, d / 2 - 46],
				[30, d / 2 - 46],
				[30, d / 2 - 49],
				[-30, d / 2 - 49],
			],
			'#7a6448',
			LINE,
			0.4,
		);
		banner(26, d / 2 - 49, c, 10);
	},
	mongol(c) {
		const d = 60 * TILT;
		for (const [x, y] of [
			[-18, 6],
			[18, 4],
			[-6, -8],
			[10, -10],
		]) {
			E_(x, y, 9, 9 * TILT * 0.9, '#e8e0cc', LINE, 0.5);
			P_(
				[
					[x - 9, y],
					[x + 9, y],
					[x + 9, y - 7],
					[x - 9, y - 7],
				],
				LG(x - 9, 0, x + 9, 0, ['#f2ead8', '#c8bca2']),
				LINE,
				0.5,
			);
			P_(
				[
					[x - 9.4, y - 7],
					[x + 9.4, y - 7],
					[x, y - 13],
				],
				'#d8cdb4',
				LINE,
				0.5,
			);
			L_(x - 9, y - 4, x + 9, y - 4, c, 0.8);
			door(x + 2, y, 3, 5, '#a8302a');
		}
		L_(0, d / 2 - 2, 0, d / 2 - 30, '#c0c4c8', 1.2);
		for (let i = 0; i < 6; i++) {
			const a = -Math.PI / 2 + (i - 2.5) * 0.4;
			L_(0, d / 2 - 22, Math.cos(a) * 9, d / 2 - 22 + Math.sin(a) * 9, '#d8dce0', 0.7);
			E_(Math.cos(a) * 9, d / 2 - 22 + Math.sin(a) * 9, 1.4, 1.4, '#e8ecf0', '#8a9098', 0.3);
		}
		E_(0, d / 2 - 32, 2.4, 2.4, '#e8ecf0', '#8a9098', 0.4);
		banner(-26, 8, c, 12);
	},
	maurya(c) {
		const d = 60 * TILT;
		P_(
			[
				[-26, d / 2],
				[26, d / 2],
				[26, d / 2 - 6],
				[-26, d / 2 - 6],
			],
			'#c8b48a',
			LINE,
			0.5,
		);
		g.beginPath();
		g.moveTo(-22, d / 2 - 6);
		g.arc(0, d / 2 - 6, 22, Math.PI, 0);
		g.closePath();
		g.fillStyle = LG(-22, -30, 22, 0, ['#efe4cc', '#c8b892', '#9a8a6a']);
		g.fill();
		g.strokeStyle = LINE;
		g.lineWidth = 0.6;
		g.stroke();
		P_(
			[
				[-4, d / 2 - 28],
				[4, d / 2 - 28],
				[4, d / 2 - 31],
				[-4, d / 2 - 31],
			],
			'#a89470',
			LINE,
			0.4,
		);
		L_(0, d / 2 - 31, 0, d / 2 - 42, '#6b5a40', 0.8);
		for (let i = 0; i < 3; i++) E_(0, d / 2 - 35 - i * 3, 4 - i, 0.8, '#a89470', LINE, 0.3);
		for (const x of [-27, 23]) {
			P_(
				[
					[x, d / 2 + 2],
					[x + 1.6, d / 2 + 2],
					[x + 1.6, d / 2 - 16],
					[x, d / 2 - 16],
				],
				'#b8a47a',
				LINE,
				0.3,
			);
			P_(
				[
					[x + 2.4, d / 2 + 2],
					[x + 4, d / 2 + 2],
					[x + 4, d / 2 - 16],
					[x + 2.4, d / 2 - 16],
				],
				'#b8a47a',
				LINE,
				0.3,
			);
			for (let k = 0; k < 3; k++)
				P_(
					[
						[x - 1, d / 2 - 12 - k * 2.4],
						[x + 5, d / 2 - 12 - k * 2.4],
						[x + 5, d / 2 - 13.4 - k * 2.4],
						[x - 1, d / 2 - 13.4 - k * 2.4],
					],
					'#a8946a',
					LINE,
					0.3,
				);
		}
		banner(16, d / 2 - 22, c, 8);
	},
	mali(c) {
		const d = 60 * TILT;
		sides(-28, 28, d / 2, 18, d, '#d4a470', false);
		P_(
			[
				[-28, d / 2],
				[28, d / 2],
				[28, d / 2 - 18],
				[-28, d / 2 - 18],
			],
			LG(-28, 0, 28, 0, ['#d8a66c', '#c49060', '#9a6a40']),
			LINE,
			0.6,
		);
		texture('mud', -28, d / 2 - 18, 28, d / 2, MUD);
		P_(
			[
				[-28, d / 2 - 18],
				[28, d / 2 - 18],
				[28 + d * SIDE, -d / 2 - 18],
				[-28 + d * SIDE, -d / 2 - 18],
			],
			'#d4a470',
			LINE,
			0.4,
		);
		for (let x = -26; x <= 26; x += 6.5) {
			P_(
				[
					[x - 1.6, d / 2],
					[x + 1.6, d / 2],
					[x + 1.2, d / 2 - 22],
					[x - 1.2, d / 2 - 22],
				],
				'#c89460',
				LINE,
				0.3,
			);
			L_(x - 2.4, d / 2 - 12, x + 2.4, d / 2 - 12, '#6b4a2c', 0.5);
		}
		P_(
			[
				[8, -2],
				[20, -2],
				[17, -40],
				[11, -40],
			],
			LG(8, 0, 20, 0, ['#e0b078', '#a8784a']),
			LINE,
			0.6,
		);
		for (let y = -8; y > -40; y -= 6) L_(9, y, 19, y, '#6b4a2c', 0.6);
		P_(
			[
				[11, -40],
				[17, -40],
				[14, -46],
			],
			'#c89460',
			LINE,
			0.4,
		);
		door(-10, d / 2, 6, 9, '#4a2e16');
		banner(-24, d / 2 - 18, c, 9);
	},
};
// footprint box and how tall each kind may draw, for the cache canvas
const BLDTOP = {
	castle: 66,
	town: 52,
	keep: 62,
	tower: 84,
	wonder: 72,
	library: 56,
	temple: 50,
	theatre: 44,
	apartment: 46,
	aqueduct: 40,
	siege: 40,
};
const BSPR = new Map();
function bldSprite(b, s) {
	const o = b.owner,
		B = BLD[b.kind],
		col = G.P[o].color,
		w = B.fp * NAVC,
		var_ =
			b.kind === 'keep'
				? G.P[o].age >= 4
					? 2
					: 0
				: b.kind === 'town'
					? G.P[o].age >= 4
						? 2
						: 0
					: b.kind === 'library'
						? G.P[o].age >= 3
						: b.kind === 'wonder'
							? G.P[o].civ
							: b.kind === 'farm'
								? season().name + (b.node ? b.node.type : '')
								: b.kind === 'treefarm'
									? b.spent || (b.node && b.node.amt <= 0)
										? 'spent'
										: ''
									: b.kind === 'pasture'
										? b.sheep || 0
									: b.kind === 'tower'
										? btierOf(o, 'tower')
										: '';
	const up = upTier(b.kind, G.P[o]),
		key = b.kind + col + var_ + up + s;
	let c = BSPR.get(key);
	if (c) return c;
	const top = BLDTOP[b.kind] || 40,
		pad = 12,
		W = w + pad * 2 + 10 + 2 * w * TILT * SIDE,
		H = (w * TILT) / 2 + top + pad * 2;
	c = document.createElement('canvas');
	c.width = Math.ceil(W * s);
	c.height = Math.ceil(H * s);
	g = c.getContext('2d');
	g.scale(s, s);
	g.translate(W / 2, top + pad);
	g.lineJoin = 'round';
	g.lineCap = 'round';
	UP = up;
	FLAGS = [];
	try {
		(ART[b.kind] || ART.house)(col, o, var_);
	} catch (e) {
		fault(e);
	}
	UP = 0;
	c.ax = (W / 2) * s;
	c.ay = (top + pad) * s;
	c.flags = FLAGS.map(([px, py, k]) => [(px - c.ax) / s, (py - c.ay) / s, k / s]); // back to the building's own units
	FLAGS = null;
	g = null;
	trim(BSPR, 300);
	BSPR.set(key, c);
	return c;
}
// trees, bushes, rocks: a few variants each, cached the same way
const NSPR = new Map();
const NS_rng = (z) => () => (z = (z * 16807) % 2147483647) / 2147483647;
const NS_c = (hex, f) => {
	const n = parseInt(hex.slice(1), 16),
		k = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
	return `rgb(${k(n >> 16)},${k((n >> 8) & 255)},${k(n & 255)})`;
};
const NS_poly = (pts, fill, stroke, lw) => {
	g.beginPath();
	pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
	g.closePath();
	if (fill) {
		g.fillStyle = fill;
		g.fill();
	}
	if (stroke) {
		g.strokeStyle = stroke;
		g.lineWidth = lw;
		g.stroke();
	}
};
const NS_blob = (cx, cy, rx, ry, n, jit, r) =>
	Array.from({ length: n }, (_, i) => {
		const a = (i / n) * 6.283,
			k = 1 - jit + r() * jit * 2;
		return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
	});
const NS_INK = 'rgba(14,20,12,.34)';
// (Build 61: the shadow baked into every tree, bush and rock is gone; drawNode casts it from the sun, as a building or a person does)
const NODE_H = { tree: 22, bush: 8, stone: 7, gold: 7, iron: 7, fish: 0, meat: 2 }; // how tall each kind stands, for its shadow
function nodeSprite(n, s) {
	const sn = season().name,
		v = n.kind === 'tree' ? n.id % 6 : n.id % 3,
		key = n.kind + v + (n.kind === 'tree' ? sn : '') + s;
	let c = NSPR.get(key);
	if (c) return c;
	const W = 46,
		H = 58,
		r = NS_rng(11 + v * 7 + n.kind.length);
	c = document.createElement('canvas');
	c.width = Math.ceil(W * s);
	c.height = Math.ceil(H * s);
	g = c.getContext('2d');
	g.scale(s, s);
	g.translate(W / 2 - 6, H - 4);
	g.lineJoin = 'round';
	g.scale(
		n.kind === 'tree' ? 0.88 : n.kind === 'bush' ? 1.45 : 1.25,
		n.kind === 'tree' ? 0.88 : n.kind === 'bush' ? 1.45 : 1.25,
	);
	if (n.kind === 'tree') {
		const TC = ['#2f5a2a', '#3c6c32', '#2a5428', '#3a6a38', '#2f6048', '#4a7430'][v],
			col = sn === 'Autumn' && v === 0 ? '#9a6224' : sn === 'Autumn' && v === 2 ? '#7a6a24' : TC;
		NS_poly(
			[
				[-2.4, 0],
				[2.4, 0],
				[1.3, -8],
				[0.7, -14],
				[-0.7, -14],
				[-1.4, -8],
			],
			'#4d3823',
			NS_INK,
			0.3,
		);
		if (v === 3 || v === 4) {
			const T = v === 4 ? 6 : 5,
				dy = v === 4 ? 4.6 : 4.8,
				w0 = v === 4 ? 10 : 12.5;
			for (let i = 0; i < T; i++) {
				const y = -4 - i * dy,
					w = w0 - i * (w0 / T) * 0.86,
					pts = [[-w, y + 2.4]];
				for (let k = 1; k < 7; k++) pts.push([-w + (2 * w * k) / 7, y + 2.6 + (k % 2 ? 0.1 : 1.7) * (0.6 + r())]);
				pts.push([w, y + 2.4], [w * 0.4, y - 1.5], [0, y - 6], [-w * 0.4, y - 1.5]);
				NS_poly(pts, NS_c(col, 0.78 + i * 0.07), NS_INK, 0.35);
				NS_poly(
					[
						[0, y - 6],
						[w * 0.4, y - 1.5],
						[w * 0.1, y + 0.4],
						[-w * 0.15, y - 1],
					],
					NS_c(col, 1.32),
				);
			}
		} else {
			NS_poly(NS_blob(0, -16, 11, 8.8, 24, 0.15, r), NS_c(col, 0.68), NS_INK, 0.35);
			const L = [
				[-5, -13.5, 5.4, 4.3],
				[4.6, -14, 5.2, 4.1],
				[0, -20, 5.8, 4.5],
				[-5.4, -19, 3.8, 3.1],
				[5.6, -19.4, 4, 3.2],
			];
			L.forEach(([x, y, rx, ry], i) => {
				NS_poly(NS_blob(x, y, rx, ry, 13, 0.22, r), NS_c(col, 1 + i * 0.06), 'rgba(14,20,12,.3)', 0.25);
				NS_poly(NS_blob(x - rx * 0.25, y - ry * 0.35, rx * 0.5, ry * 0.4, 8, 0.2, r), NS_c(col, 1.45));
			});
		}
		if (sn === 'Winter') {
			NS_poly(NS_blob(-2, -22, 5, 1.6, 8, 0.2, r), '#e8eef0');
			NS_poly(NS_blob(3.4, -17.6, 3, 1.1, 8, 0.2, r), '#e8eef0');
		}
	} else if (n.kind === 'bush') {
		[
			[-4, -3.5, 4.8, 3.4, 0.8],
			[4, -3.5, 4.6, 3.2, 0.85],
			[0, -6, 5, 3.6, 1],
		].forEach(([x, y, rx, ry, f]) => {
			NS_poly(NS_blob(x, y, rx, ry, 10, 0.2, r), NS_c('#3f6b33', f), NS_INK, 0.3);
			NS_poly(NS_blob(x - rx * 0.25, y - ry * 0.35, rx * 0.5, ry * 0.4, 8, 0.2, r), NS_c('#3f6b33', f * 1.4));
		});
		for (const [a, b] of [
			[-3, -6],
			[3, -4],
			[0, -3],
			[-5, -3],
			[5, -6.5],
			[1, -8],
		]) {
			g.fillStyle = RESOURCES.food.col;
			g.beginPath();
			g.arc(a, b, 1.15, 0, 7);
			g.fill();
			g.fillStyle = 'rgba(255,255,255,.55)';
			g.beginPath();
			g.arc(a - 0.3, b - 0.4, 0.38, 0, 7);
			g.fill();
		}
	} else {
		const gold = n.kind === 'gold',
			iron = n.kind === 'iron',
			base = gold ? '#9a7a2a' : iron ? '#5a4a42' : '#7c8489',
			top = gold ? '#f2cf55' : iron ? '#8fa3b5' : '#b4bbc0',
			k = () => 0.92 + r() * 0.16,
			P = [
				[-10 * k(), 0],
				[-9 * k(), -5],
				[-5, -10 * k()],
				[0, -12 * k()],
				[5, -10.5 * k()],
				[9.5 * k(), -5],
				[10 * k(), -1],
				[4, 1],
			];
		NS_poly(P, NS_c(base, 0.8), 'rgba(14,16,18,.6)', 0.5);
		NS_poly([P[1], P[2], P[3], P[4], [3, -6.5], [-3, -5]], top, 'rgba(0,0,0,.25)', 0.3);
		NS_poly(
			[
				[-3, -5],
				[3, -6.5],
				[5.5, -2],
				[0, 0.6],
				[-6, -1],
			],
			NS_c(base, 1.05),
		);
		g.strokeStyle = 'rgba(10,12,14,.5)';
		g.lineWidth = 0.4;
		g.beginPath();
		g.moveTo(-2, -5);
		g.lineTo(-1, -1);
		g.moveTo(4, -6);
		g.lineTo(5, -9);
		g.stroke();
		if (gold || iron)
			for (const [x, y] of [
				[-1, -7],
				[3, -5],
				[-5, -4],
			]) {
				g.fillStyle = gold ? '#fff6c8' : '#d5e2ee';
				NS_poly([
					[x, y - 1.1],
					[x + 0.9, y],
					[x, y + 1.1],
					[x - 0.9, y],
				]);
				g.fill();
			}
	}
	c.ax = (W / 2 - 6) * s;
	c.ay = (H - 4) * s;
	g = null;
	trim(NSPR, 200);
	NSPR.set(key, c);
	return c;
}
