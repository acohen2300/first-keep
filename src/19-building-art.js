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
		shade(wall, 0.58),
		INK,
		0.5,
	);
	if (top)
		P_(
			[
				[x0, yf - h],
				[x1, yf - h],
				[x1 + k, yf - d - h],
				[x0 + k, yf - d - h],
			],
			shade(wall, 1.05),
			INK,
			0.5,
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
		far = shade(roofCol || wall, 0.7);
	if (roof && roof !== 'flat')
		P_(
			roof === 'hip'
				? [
						[x0 + k, yb - h],
						[x1 + k, yb - h],
						[x1 - w * 0.25 + m, ry],
						[x0 + w * 0.25 + m, ry],
					]
				: [
						[x0 - 1 + k, yb - h],
						[x1 + 1 + k, yb - h],
						[x1 + 1 + m, ry],
						[x0 - 1 + m, ry],
					],
			far,
			INK,
			0.5,
		); // the far slope, where it shows over the ridge
	sides(x0, x1, yf, h, d, wall, roof === 'flat' || !roof);
	P_(
		[
			[x0, yf],
			[x1, yf],
			[x1, yf - h],
			[x0, yf - h],
		],
		LG(x0, 0, x1, 0, [shade(wall, 0.95), shade(wall, 0.82), shade(wall, 0.68)]),
		INK,
		0.6,
	); // front
	texture(tex, x0, yf - h, x1, yf, wall);
	if (UP >= 1) {
		P_(
			[
				[x0, yf],
				[x1, yf],
				[x1, yf - 3],
				[x0, yf - 3],
			],
			STONE,
			INK,
			0.4,
		);
		P_(
			[
				[x1, yf],
				[x1 + k, yf - d],
				[x1 + k, yf - d - 3],
				[x1, yf - 3],
			],
			shade(STONE, 0.6),
			INK,
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
				shade(STONE, 1.1),
				INK,
				0.3,
			);
			P_(
				[
					[x1 - 3.4, y],
					[x1, y],
					[x1, y - 3],
					[x1 - 3.4, y - 3],
				],
				shade(STONE, 1.1),
				INK,
				0.3,
			);
		}
	const r = { top: yb - h, d, h, k };
	if (roof === 'flat' || !roof) return r;
	const near = LG(0, ry, 0, yf - h, [shade(roofCol, 1.2), roofCol, shade(roofCol, 0.8)]);
	if (roof === 'gable') {
		// ridge runs left to right: the near slope, and the gable end on the east wall
		P_(
			[
				[x1, yf - h],
				[x1 + k, yb - h],
				[x1 + m, ry],
			],
			shade(wall, 0.66),
			INK,
			0.5,
		);
		P_(
			[
				[x0 - 1, yf - h + 1],
				[x1 + 1, yf - h + 1],
				[x1 + 1 + m, ry],
				[x0 - 1 + m, ry],
			],
			near,
			INK,
			0.6,
		);
		g.strokeStyle = 'rgba(0,0,0,.18)';
		g.lineWidth = 0.5;
		for (let t = 0.25; t < 1; t += 0.25) {
			const y = yf - h + 1 + (ry - (yf - h + 1)) * t;
			g.beginPath();
			g.moveTo(x0 - 1 + m * t, y);
			g.lineTo(x1 + 1 + m * t, y);
			g.stroke();
		}
		L_(x0 - 1 + m, ry, x1 + 1 + m, ry, UP >= 2 ? '#e6c75a' : shade(roofCol, 1.4), UP >= 2 ? 1.6 : 1);
		return { ...r, top: ry };
	}
	if (roof === 'hip') {
		// the near slope, and the east hip in shade
		P_(
			[
				[x1 + 1, yf - h + 1],
				[x1 + 1 + k, yb - h + 1],
				[x1 - w * 0.25 + m, ry],
			],
			shade(roofCol, 0.62),
			INK,
			0.5,
		);
		P_(
			[
				[x0 - 1, yf - h + 1],
				[x1 + 1, yf - h + 1],
				[x1 - w * 0.25 + m, ry],
				[x0 + w * 0.25 + m, ry],
			],
			near,
			INK,
			0.6,
		);
		return { ...r, top: ry };
	}
	return r;
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
		shade(col, 1.08),
		INK,
		0.5,
	);
	P_(
		[
			[x1, ye],
			[x1 + k, ye - d],
			[k, ya - d],
			[0, ya],
		],
		shade(col, 0.8),
		INK,
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
		INK,
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
		INK,
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
			INK,
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
		LG(x - 1, 0, x + 1, 0, [shade(col, 1.05), shade(col, 0.75)]),
		INK,
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
		INK,
		0.3,
	);
};
const smallTree = (x, y, s = 1, col = '#2f6a2f') => {
	L_(x, y, x, y - 3 * s, '#4c3a22', 0.8 * s);
	E_(
		x,
		y - 5 * s,
		3 * s,
		3.2 * s,
		LG(x - 3 * s, y - 8 * s, x + 3 * s, y - 2 * s, [shade(col, 1.25), col, shade(col, 0.75)]),
		INK,
		0.3,
	);
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
			INK,
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
			LG(-5, 0, 5, 0, [shade(STONE, 0.95), shade(STONE, 0.72)]),
			INK,
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
			shade(TILE, 0.6),
			INK,
			0.5,
		);
		P_(
			[
				[-6.5, -40],
				[6.5, -40],
				[tk / 2, -52],
			],
			TILE,
			INK,
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
				LG(bx - 9, 0, bx + 9, 0, [shade(STONE, 1.05), shade(STONE, 0.78)]),
				INK,
				0.5,
			);
			P_(
				[
					[bx - 9, by - 10],
					[bx, by - 16],
					[bx + 9, by - 10],
					[bx, by - 4],
				],
				shade(STONE, 1.18),
				INK,
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
				LG(-6, 0, 6, 0, [shade(STONE, 0.95), shade(STONE, 0.7)]),
				INK,
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
					shade(SLATE, 0.6),
					INK,
					0.5,
				);
				P_(
					[
						[-7, -44],
						[7, -44],
						[tk / 2, -56],
					],
					SLATE,
					INK,
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
		const r = block(20, 13, PLASTER, 'timber', 'gable', THATCH, 8);
		door(-4, r.d / 2, 4, 7);
		win(4, r.d / 2 - 5);
		L_(-10, r.d / 2 - 0.5, 10, r.d / 2 - 0.5, c, 1.2);
		const m = r.k / 2;
		P_(
			[
				[5 + m, -21],
				[7.4 + m, -21],
				[7.4 + m, -26],
				[5 + m, -26],
			],
			'#6a5a4a',
			INK,
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
			LG(-17, 0, 17, 0, [shade(STONE, 0.95), shade(STONE, 0.72)]),
			INK,
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
			INK,
			0.4,
		);
		L_(-17, d / 2 - 0.5, 17, d / 2 - 0.5, c, 1.2);
	},
	mill(c) {
		const r = block(30, 16, PLANK, 'plank', 'gable', THATCH, 9);
		door(0, r.d / 2, 5, 9);
		E_(-8, r.d / 2 - 3, 3, 2, '#d8c27a', INK, 0.3);
		E_(9, r.d / 2 - 3, 3, 2, '#d8c27a', INK, 0.3);
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
			INK,
			0.4,
		);
		E_(9, r.d / 2 - 4.6, 1.6, 1.2, '#f2cf55');
		E_(11.4, r.d / 2 - 4.6, 1.6, 1.2, '#b4bbc0');
		door(-6, r.d / 2, 6, 8, '#1a120a');
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	barracks(c) {
		const r = block(40, 18, PLANK, 'plank', 'gable', '#8a3a2a', 10);
		door(0, r.d / 2, 6, 11);
		for (const x of [-13, -9, 10, 14]) {
			L_(x, r.d / 2, x + 1.5, r.d / 2 - 11, '#8a6a3a', 0.6);
			P_(
				[
					[x + 1.5, r.d / 2 - 11],
					[x + 2, r.d / 2 - 13],
					[x + 1, r.d / 2 - 11],
				],
				'#ddd',
			);
		}
		banner(-18, r.d / 2 - 18, c, 10);
		L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2);
	},
	range(c) {
		const r = block(40, 16, PLANK, 'plank', 'gable', '#5d6e3e', 9);
		door(-8, r.d / 2, 6, 10);
		E_(12, r.d / 2 - 6, 4, 4, '#e8dcc0', INK, 0.4);
		E_(12, r.d / 2 - 6, 2.6, 2.6, '#c33');
		E_(12, r.d / 2 - 6, 1, 1, '#e8dcc0');
		L_(12, r.d / 2 - 2, 12, r.d / 2, '#5a3a1c', 0.8);
		banner(-18, r.d / 2 - 16, c, 9);
		L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2);
	},
	stable(c) {
		const r = block(40, 16, PLANK, 'plank', 'gable', THATCH, 10);
		for (let i = -2; i <= 2; i++) {
			P_(
				[
					[i * 7 - 2.4, r.d / 2],
					[i * 7 + 2.4, r.d / 2],
					[i * 7 + 2.4, r.d / 2 - 7],
					[i * 7 - 2.4, r.d / 2 - 7],
				],
				'#3a2614',
				INK,
				0.3,
			);
			E_(i * 7 + 0.6, r.d / 2 - 6.8, 1.2, 1.6, '#7a4e2c');
		}
		banner(-18, r.d / 2 - 16, c, 9);
		L_(-20, r.d / 2 - 0.5, 20, r.d / 2 - 0.5, c, 1.2);
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
			INK,
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
			INK,
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
		const d = 30 * TILT;
		P_(
			[
				[-15, d / 2],
				[15, d / 2],
				[15, -d / 2],
				[-15, -d / 2],
			],
			'#b59a72',
			INK,
			0.4,
		);
		for (const [x, y, col] of [
			[-8, -4, '#b2563a'],
			[8, -4, c],
			[-8, 6, c],
			[8, 6, '#c9a227'],
		]) {
			L_(x - 6, y, x - 6, y - 9, WOOD, 0.7);
			L_(x + 6, y, x + 6, y - 9, WOOD, 0.7);
			for (let i = 0; i < 6; i++)
				P_(
					[
						[x - 6.5 + i * 2.2, y - 9],
						[x - 4.3 + i * 2.2, y - 9],
						[x - 4.3 + i * 2.2, y - 12],
						[x - 6.5 + i * 2.2, y - 12],
					],
					i % 2 ? '#f0e6d0' : col,
					null,
				);
			P_(
				[
					[x - 6, y],
					[x + 6, y],
					[x + 6, y - 2.4],
					[x - 6, y - 2.4],
				],
				WOOD,
			);
			E_(x - 2.4, y - 3.2, 1.4, 1, '#e0708a');
			E_(x + 1, y - 3.2, 1.4, 1, '#f2cf55');
			E_(x + 3.6, y - 3.2, 1.2, 1, '#9acd5a');
		}
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
			INK,
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
				shade(SLATE, 0.6),
				INK,
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
				INK,
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
				INK,
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
					INK,
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
		E_(0, -14, 10, 4.5, LG(-10, 0, 10, 0, [shade(TILE, 1.1), shade(TILE, 0.72)]), INK, 0.5);
		E_(0, -16.5, 6, 2.6, shade(TILE, 1.2), INK, 0.4);
		E_(0, d / 2 + 2, 9, 3.2, '#4e93ad', INK, 0.5);
		E_(-2, d / 2 + 1.4, 5, 1.6, 'rgba(230,245,255,.5)');
		column(-10, d / 2 - 1, d / 2 - 13);
		column(10, d / 2 - 1, d / 2 - 13);
		door(0, d / 2, 5, 9, '#2a2014');
		banner(13, d / 2 - 14, c, 7);
	},
	theatre(c) {
		// a half-ring of stone seats open to the front, a stage wall at the back
		const d = 40 * TILT,
			k = d * SIDE;
		for (let i = 3; i >= 0; i--) {
			const rx = 20 - i * 3.6,
				ry = rx * TILT * 0.9,
				y = -2 - i * 2.2;
			P_(
				[
					[-rx, y],
					[rx, y],
					[rx, y - 2.2],
					[-rx, y - 2.2],
				],
				shade('#d9d0bc', 0.9 - i * 0.04),
				INK,
				0.3,
			);
			E_(0, y - 2.2, rx, ry, shade('#e6dcc6', 1 - i * 0.05), INK, 0.4);
		}
		E_(0, -4, 7, 7 * TILT, '#c9b98f', INK, 0.4);
		P_(
			[
				[-14, -22],
				[14, -22],
				[14 + k * 0.5, -22 - 8],
				[-14 + k * 0.5, -22 - 8],
			],
			shade('#d9d0bc', 0.8),
			INK,
			0.4,
		);
		P_(
			[
				[-14, -22],
				[14, -22],
				[14, -36],
				[-14, -36],
			],
			LG(-14, 0, 14, 0, [shade('#e6dcc6', 1.0), shade('#e6dcc6', 0.72)]),
			INK,
			0.5,
		);
		for (const x of [-9, 0, 9]) column(x, -22, -35, '#efe6d4');
		banner(16, -36, c, 8);
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
			INK,
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
				INK,
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
			INK,
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
			INK,
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
			INK,
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
			INK,
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
		const d = 20 * TILT;
		P_(
			[
				[-10, d / 2],
				[10, d / 2],
				[10, -d / 2],
				[-10, -d / 2],
			],
			LG(-10, 0, 10, 0, ['#a07c54', '#7a5a36']),
			INK,
			0.5,
		);
		for (let x = -8; x < 10; x += 4) L_(x, -d / 2, x, d / 2, 'rgba(40,24,10,.5)', 0.4);
		for (const [x, y] of [
			[-9, d / 2],
			[9, d / 2],
			[-9, -d / 2],
			[9, -d / 2],
		])
			P_(
				[
					[x - 1, y],
					[x + 1, y],
					[x + 1, y - 5],
					[x - 1, y - 5],
				],
				'#5a3a1c',
				INK,
				0.3,
			);
		banner(9, -d / 2 - 5, c, 6);
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
				shade(STONE, 0.5),
				INK,
				0.5,
			); // its shaded east face
			P_(
				[
					[-b, f + 2],
					[b, f + 2],
					[w, f - 10],
					[-w, f - 10],
				],
				LG(-b, 0, b, 0, [shade(STONE, 0.9), shade(STONE, 0.62)]),
				INK,
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
			LG(-w, 0, w, 0, [shade(T.wall, 0.95), shade(T.wall, 0.7)]),
			INK,
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
				LG(-w, 0, w, 0, [shade(PLANK, 1.05), shade(PLANK, 0.72)]),
				INK,
				0.5,
			);
			for (let x = -w; x <= w; x += 4) L_(x, f - h, x, f - h - 7, shade(PLANK, 0.6), 0.6);
			P_(
				[
					[-w - 4, f - h - 7],
					[w + 4, f - h - 7],
					[0, f - h - 19],
				],
				LG(-w, 0, w, 0, [shade(SLATE, 1.1), shade(SLATE, 0.75)]),
				INK,
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
				INK,
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
					INK,
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
			LG(-5, 0, 5, 0, [shade(STONE, 0.92), shade(STONE, 0.74)]),
			INK,
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
			shade(STONE, 1.08),
			INK,
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
			INK,
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
			INK,
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
			INK,
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
		field(30, '#6b5434', c, () => {
			const crop = { Spring: '#6f9a3a', Summer: '#86a83e', Autumn: '#cfa63e', Winter: '#8d8473' }[season().name];
			const d = 30 * TILT;
			for (let i = 0; i < 6; i++) {
				const y = -d / 2 + 1 + (i * (d - 2)) / 6;
				P_(
					[
						[-14, y + 0.6],
						[14, y + 0.6],
						[14, y + (d - 2) / 6 - 0.6],
						[-14, y + (d - 2) / 6 - 0.6],
					],
					crop,
				);
			}
		});
	},
	pasture(c, o, n) {
		field(30, '#86a050', c, () => {
			const d = 30 * TILT;
			for (let i = 0; i < (n || 0); i++) {
				const x = -11 + (i % 4) * 7 + ((i >> 2) % 2) * 2,
					y = -d / 2 + 3 + (Math.floor(i / 4) * (d - 5)) / 3;
				E_(x, y, 2.6, 1.7, '#ece5d3', '#8a8070', 0.3);
				E_(x + 2.2, y - 0.6, 0.9, 0.8, '#3a3430');
			}
		});
		for (let x = -15; x <= 15; x += 5) L_(x, (30 * TILT) / 2, x, (30 * TILT) / 2 - 3, '#7a5a34', 0.7);
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
			INK,
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
	treefarm(c) {
		field(30, '#5a4a30', c, () => {
			const d = 30 * TILT;
			for (let j = 0; j < 3; j++)
				for (let i = 0; i < 4; i++) smallTree(-11 + i * 7.3 + (j % 2) * 1.6, -d / 2 + 3 + (j * (d - 4)) / 2.4, 0.9);
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
			INK,
			0.6,
		);
		E_(0, d / 2 - 60, 2.4, 2.4, '#8e1d14');
	}, // the old citadel: a castle and a half, crowned in gold
	workshop(c) {
		const r = block(30, 14, PLASTER, 'timber', 'gable', THATCH, 8);
		door(-6, r.d / 2, 5, 8);
		P_(
			[
				[3, r.d / 2],
				[12, r.d / 2],
				[12, r.d / 2 - 8],
				[3, r.d / 2 - 8],
			],
			'#3a2614',
			INK,
			0.4,
		);
		for (let i = 0; i < 4; i++)
			L_(4 + i * 2.4, r.d / 2 - 7.6, 4 + i * 2.4, r.d / 2 - 0.6, ['#8fb0d8', '#c9a96a', '#b33a2e', '#ece5d3'][i], 0.8);
		E_(-12, r.d / 2 + 1.4, 2.4, 1.6, '#ece5d3', INK, 0.3);
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	},
	foundry(c) {
		const r = block(30, 16, STONE, 'stone', 'gable', SLATE, 7);
		P_(
			[
				[6 + r.k / 2, -20],
				[12 + r.k / 2, -20],
				[12 + r.k / 2, -34],
				[6 + r.k / 2, -34],
			],
			'#4a4540',
			INK,
			0.4,
		);
		E_(9 + r.k / 2, -35, 3, 1.6, 'rgba(255,120,30,.8)');
		P_(
			[
				[-6, r.d / 2],
				[6, r.d / 2],
				[6, r.d / 2 - 10],
				[-6, r.d / 2 - 10],
			],
			'#1a120a',
			INK,
			0.4,
		);
		E_(0, r.d / 2 - 3, 4, 2.6, 'rgba(255,160,40,.9)');
		for (let i = 0; i < 3; i++)
			P_(
				[
					[9 + i * 2.6, r.d / 2 + 2],
					[11 + i * 2.6, r.d / 2 + 2],
					[11 + i * 2.6, r.d / 2],
					[9 + i * 2.6, r.d / 2],
				],
				'#8fa3b5',
				INK,
				0.3,
			);
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	}, // a stone hall with a tall furnace stack and iron bars at the door
	quarry(c) {
		field(30, '#9a9088', c, () => {
			const d = 30 * TILT;
			for (let j = 0; j < 2; j++)
				for (let i = 0; i < 3; i++) {
					const x = -10 + i * 9 + j * 3,
						y = -d / 2 + 5 + j * 8;
					P_(
						[
							[x - 3, y + 2],
							[x + 3, y + 2],
							[x + 3, y - 2],
							[x - 3, y - 2],
						],
						LG(x - 3, 0, x + 3, 0, ['#c4c9cc', '#8a9094']),
						INK,
						0.4,
					);
				}
			P_(
				[
					[6, d / 2 - 3],
					[13, d / 2 - 3],
					[13, d / 2 - 9],
					[6, d / 2 - 9],
				],
				'#5a5550',
				INK,
				0.4,
			);
		});
	}, // cut blocks on grey ground
	mint(c) {
		const r = block(30, 18, STONE, 'stone', 'hip', SLATE, 8);
		door(0, r.d / 2, 5, 9, '#2a1a0a');
		for (const x of [-9, 9]) win(x, r.d / 2 - 8, 2, 3);
		for (let i = 0; i < 3; i++) E_(-10 + i * 4, r.d / 2 + 1.4, 1.5, 1.1, '#f2cf55', '#b8902a', 0.3);
		P_(
			[
				[7 + r.k / 2, -22],
				[10 + r.k / 2, -22],
				[10 + r.k / 2, -29],
				[7 + r.k / 2, -29],
			],
			'#5a5550',
			INK,
			0.4,
		);
		E_(8.5 + r.k / 2, -30, 2.4, 1.4, 'rgba(255,140,40,.7)');
		L_(-15, r.d / 2 - 0.5, 15, r.d / 2 - 0.5, c, 1.2);
	}, // a stone house with a furnace chimney and coins at the door
	wonder(c, o) {
		(WONDERART[G.P[o] && G.P[o].civ] || WONDERART.roman)(c);
	},
};
function field(w, soil, c, rows) {
	const d = w * TILT;
	P_(
		[
			[-w / 2, d / 2],
			[w / 2, d / 2],
			[w / 2, -d / 2],
			[-w / 2, -d / 2],
		],
		soil,
		INK,
		0.4,
	);
	rows();
	g.strokeStyle = '#7a5a34';
	g.lineWidth = 0.6;
	g.strokeRect(-w / 2, -d / 2, w, d);
	for (let x = -w / 2; x <= w / 2; x += 5) L_(x, d / 2, x, d / 2 - 2.4, '#6b4a2c', 0.5);
	L_(-w / 2, d / 2 - 1.6, w / 2, d / 2 - 1.6, '#8a6a44', 0.5);
	L_(-w / 2, d / 2, w / 2, d / 2, c, 1);
}
const WONDERART = {
	roman(c) {
		E_(0, 0, 30, 30 * TILT, '#c8bca2', INK, 0.6);
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
			g.strokeStyle = INK;
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
		E_(0, -40, 30, 30 * TILT, '#d8cdb4', INK, 0.5);
		E_(0, -40, 19, 19 * TILT, '#c8a878', INK, 0.5);
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
			INK,
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
				INK,
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
		g.strokeStyle = INK;
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
			INK,
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
				INK,
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
			INK,
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
			INK,
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
			E_(x, y, 9, 9 * TILT * 0.9, '#e8e0cc', INK, 0.5);
			P_(
				[
					[x - 9, y],
					[x + 9, y],
					[x + 9, y - 7],
					[x - 9, y - 7],
				],
				LG(x - 9, 0, x + 9, 0, ['#f2ead8', '#c8bca2']),
				INK,
				0.5,
			);
			P_(
				[
					[x - 9.4, y - 7],
					[x + 9.4, y - 7],
					[x, y - 13],
				],
				'#d8cdb4',
				INK,
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
			INK,
			0.5,
		);
		g.beginPath();
		g.moveTo(-22, d / 2 - 6);
		g.arc(0, d / 2 - 6, 22, Math.PI, 0);
		g.closePath();
		g.fillStyle = LG(-22, -30, 22, 0, ['#efe4cc', '#c8b892', '#9a8a6a']);
		g.fill();
		g.strokeStyle = INK;
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
			INK,
			0.4,
		);
		L_(0, d / 2 - 31, 0, d / 2 - 42, '#6b5a40', 0.8);
		for (let i = 0; i < 3; i++) E_(0, d / 2 - 35 - i * 3, 4 - i, 0.8, '#a89470', INK, 0.3);
		for (const x of [-27, 23]) {
			P_(
				[
					[x, d / 2 + 2],
					[x + 1.6, d / 2 + 2],
					[x + 1.6, d / 2 - 16],
					[x, d / 2 - 16],
				],
				'#b8a47a',
				INK,
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
				INK,
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
					INK,
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
			INK,
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
			INK,
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
				INK,
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
			INK,
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
			INK,
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
const NS_shadow = (len) => {
	g.fillStyle = 'rgba(0,0,0,.22)';
	g.beginPath();
	g.ellipse(len * 0.45, 1, len, 3, 0, 0, 7);
	g.fill();
};
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
		NS_shadow(13);
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
		NS_shadow(9);
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
		NS_shadow(12);
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
