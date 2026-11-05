// ═════ 18-figures.js: people and beasts, drawn from data ═════
// ───────────────────────── Figures: every unit drawn once per look, colour, pose and zoom, then stamped ─────────────────────────
// Local units: 1 = one world unit; feet at (0, 0), facing right, up is negative. A person stands about 21 tall.
let lessMotion = false; // the person's own setting (Reduce motion): honoured everywhere, never set by the game
try {
	lessMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
} catch (e) {}
// One draw budget (Build 62): a phone that falls behind sheds in one order, and climbs back when it catches up. DRAW.lvl: 0 everything;
// 1 the trees' shadows and the rain's rings go (the two dearest cosmetic passes, measured); 2 the moving extras go (as Reduce motion);
// 3 half the pixels. still(): is motion off, by the person's setting or by load.
const DRAW = { lvl: 0, ema: 0, slow: 0, fast: 0, alpha: 1 };
const still = () => lessMotion || DRAW.lvl >= 2;
const shade = (hex, k) => {
	const n = parseInt(hex.slice(1), 16),
		f = (c) => clamp(Math.round(c * k), 0, 255);
	return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
let g = null; // the context being drawn into
let KIT = 0; // how much armour research the side being drawn has (0-3: leather, chain, plate); soldiers only
const P_ = (pts, f, s, w) => {
	g.beginPath();
	pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
	g.closePath();
	if (f) {
		g.fillStyle = f;
		g.fill();
	}
	if (s) {
		g.strokeStyle = s;
		g.lineWidth = w || 0.5;
		g.stroke();
	}
};
const E_ = (x, y, rx, ry, f, s, w, rot) => {
	g.beginPath();
	g.ellipse(x, y, rx, ry, rot || 0, 0, 7);
	if (f) {
		g.fillStyle = f;
		g.fill();
	}
	if (s) {
		g.strokeStyle = s;
		g.lineWidth = w || 0.5;
		g.stroke();
	}
};
const L_ = (x1, y1, x2, y2, c, w) => {
	g.strokeStyle = c;
	g.lineWidth = w;
	g.beginPath();
	g.moveTo(x1, y1);
	g.lineTo(x2, y2);
	g.stroke();
};
const LG = (x0, y0, x1, y1, stops) => {
	const q = g.createLinearGradient(x0, y0, x1, y1);
	stops.forEach((c, i) => q.addColorStop(i / (stops.length - 1), c));
	return q;
};
const INK = '#141210',
	SKIN = '#e0b48e',
	STEEL = '#aeb6be',
	BRONZE = '#c08a3a',
	WOOD = '#8a5d34',
	LEATHER = '#6b4a2c';
const steel = (x0, y0, x1, y1) => LG(x0, y0, x1, y1, ['#eef2f5', '#a9b2bb', '#66707a']);
const bronzeG = (x0, y0, x1, y1) => LG(x0, y0, x1, y1, ['#f0c477', '#c08a3a', '#7d5420']);

// ── a person, built from parts. o: { tunic, trim, body, head, helm, crest, shield, weapon, skin, legs, boots, cape, seated, beard }
function person(o, fr) {
	if (KIT) {
		o = { ...o }; // armour research shows: mail under the tunic, a steel helm, then plate, a plume and a cape
		if (KIT >= 2 && (!o.body || o.body === 'scale')) o.body = 'mail';
		if (KIT >= 2 && ['bare', 'hood', 'cap', 'straw'].includes(o.head)) o.head = 'kettle';
		if (KIT >= 3) {
			if (!o.body || o.body === 'mail' || o.body === 'scale') o.body = 'plate';
			if (o.head === 'kettle') o.head = 'great';
			if (o.head === 'great' && !o.crest) o.crest = o.trim || o.tunic;
			if (!o.cape) o.cape = shade(o.trim || o.tunic, 0.7);
		}
	}
	const tunic = o.tunic,
		trim = o.trim || tunic,
		sk = o.skin || SKIN,
		hip = o.seated ? -13 : -9,
		sh = hip - 7.5;
	const sw = fr === 1 ? 3 : fr === 2 ? -3 : 0,
		atk = fr === 3;
	// legs
	const leg = (x0, dx, c) => {
		if (o.seated) {
			P_(
				[
					[x0 - 1.4, hip],
					[x0 + 1.4, hip],
					[x0 + 4.4, hip + 1.6],
					[x0 + 3, hip + 3],
				],
				c,
				INK,
				0.4,
			);
			P_(
				[
					[x0 + 3, hip + 1.5],
					[x0 + 4.6, hip + 1.5],
					[x0 + 4.2, hip + 7],
					[x0 + 2.8, hip + 7],
				],
				c,
				INK,
				0.4,
			);
			E_(x0 + 3.9, hip + 7.4, 1.4, 0.8, o.boots || '#2c2118');
			return;
		}
		P_(
			[
				[x0 - 1.3, hip],
				[x0 + 1.3, hip],
				[x0 + dx * 0.6 + 1.1, hip + 5],
				[x0 + dx - 0.2 + 1, -0.6],
				[x0 + dx - 1.4, -0.6],
				[x0 + dx * 0.6 - 1.2, hip + 5],
			],
			c,
			INK,
			0.4,
		);
		P_(
			[
				[x0 + dx - 1.6, -1.8],
				[x0 + dx + 1.4, -1.8],
				[x0 + dx + 2.8, 0],
				[x0 + dx - 1.6, 0],
			],
			o.boots || '#2c2118',
		);
	};
	leg(-0.6, -sw, shade(o.legs || '#5a4a38', 0.75));
	// the far arm and what it holds
	const hand = atk ? [6.2, sh + 2.6] : [3.6, sh + 4];
	if (o.weapon && o.weapon !== 'none') {
		P_(
			[
				[-0.4, sh + 0.4],
				[1.4, sh],
				[hand[0] + 0.8, hand[1] - 0.6],
				[hand[0] - 0.6, hand[1] + 0.8],
			],
			shade(tunic, 0.7),
			INK,
			0.4,
		);
		weapon(o.weapon, hand, atk, sh);
		E_(hand[0], hand[1], 0.9, 0.9, sk);
	}
	if (o.cape)
		P_(
			[
				[-3.6, sh + 0.6],
				[-1, sh],
				[-2, hip + 3],
				[-5.2, hip + 4],
			],
			o.cape,
			INK,
			0.4,
		);
	leg(0.6, sw, o.legs || '#5a4a38');
	if (o.lean) {
		g.save();
		g.translate(0, hip);
		g.rotate(o.lean);
		g.translate(0, -hip);
	}
	// body
	const bodyCol =
		o.body === 'mail'
			? '#9aa2a8'
			: o.body === 'plate'
				? steel(-4, 0, 4, 0)
				: o.body === 'scale'
					? bronzeG(-4, 0, 4, 0)
					: LG(-4, 0, 4, 0, [shade(tunic, 1.15), tunic, shade(tunic, 0.72)]);
	const hem = o.body === 'robe' ? -0.6 : hip + 3.2;
	P_(
		[
			[-3.4, hip],
			[3.4, hip],
			[3.9, hem],
			[-3.9, hem],
		],
		o.body === 'robe' ? LG(-4, 0, 4, 0, [shade(tunic, 1.1), tunic, shade(tunic, 0.7)]) : shade(tunic, 0.85),
		INK,
		0.45,
	);
	P_(
		[
			[-3.4, hip + 0.4],
			[3.6, hip + 0.4],
			[4, sh + 0.8],
			[-3.6, sh + 0.8],
		],
		bodyCol,
		INK,
		0.5,
	);
	if (o.body === 'mail') {
		g.fillStyle = 'rgba(40,46,52,.55)';
		for (let y = sh + 1.6; y < hip; y += 1.2)
			for (let x = -3; x < 3.5; x += 1.2) g.fillRect(x + ((y * 3) % 1.2), y, 0.45, 0.45);
	}
	if (o.body === 'scale') {
		g.strokeStyle = 'rgba(60,36,10,.6)';
		g.lineWidth = 0.35;
		for (let y = sh + 1.6; y < hip; y += 1.3)
			for (let x = -3; x < 3.5; x += 1.4) {
				g.beginPath();
				g.arc(x, y, 0.7, 0, Math.PI);
				g.stroke();
			}
	}
	if (o.body === 'segm') {
		P_(
			[
				[-3.4, hip + 0.4],
				[3.6, hip + 0.4],
				[4, sh + 0.8],
				[-3.6, sh + 0.8],
			],
			steel(-4, 0, 4, 0),
			INK,
			0.5,
		);
		for (let y = sh + 2; y < hip; y += 1.4) L_(-3.5, y, 3.8, y - 0.1, '#5d6670', 0.45);
	}
	if (o.body === 'plate' || o.body === 'segm' || o.body === 'mail' || o.body === 'scale')
		P_(
			[
				[-3.2, hip - 2.6],
				[3.4, hip - 2.6],
				[3.6, hip + 2.2],
				[-3.4, hip + 2.2],
			],
			LG(0, hip - 3, 0, hip + 2, [shade(trim, 1.15), trim]),
			INK,
			0.4,
		); // surcoat or kilt in the side's colour
	if (o.sash) L_(-3, sh + 1.2, 3.4, hip - 0.6, o.sash, 1.3);
	if (KIT) {
		E_(0.6, sh + 1.4, 2.5, 1.5, KIT >= 3 ? steel(-2, sh, 3, sh + 3) : KIT === 2 ? '#9aa2a8' : LEATHER, INK, 0.4);
		if (KIT >= 3) L_(-1.6, sh + 0.7, 2.8, sh + 0.9, 'rgba(255,255,255,.7)', 0.4);
	} // shoulder guard
	L_(-3.5, hip - 0.4, 3.8, hip - 0.5, '#3b2a14', 1); // belt
	if (o.cross) {
		P_(
			[
				[-0.6, sh + 1.5],
				[0.6, sh + 1.5],
				[0.6, hip - 1.2],
				[-0.6, hip - 1.2],
			],
			o.cross,
		);
		P_(
			[
				[-2.5, sh + 3.4],
				[2.7, sh + 3.4],
				[2.7, sh + 4.5],
				[-2.5, sh + 4.5],
			],
			o.cross,
		);
	}
	// head and headgear
	const hx = 0.5,
		hy = sh - 2.9;
	P_(
		[
			[-0.6, sh + 0.6],
			[1.4, sh + 0.6],
			[1.2, sh - 1],
			[-0.4, sh - 1],
		],
		shade(sk, 0.85),
	);
	E_(hx, hy, 2.6, 2.7, LG(hx - 2, hy - 2, hx + 2, hy + 2, [shade(sk, 1.08), sk, shade(sk, 0.82)]), shade(sk, 0.5), 0.4);
	if (o.beard)
		P_(
			[
				[hx - 0.4, hy + 1],
				[hx + 2.4, hy + 0.8],
				[hx + 1.2, hy + 3.4],
				[hx - 0.6, hy + 2.6],
			],
			o.beard,
		);
	E_(hx + 1.4, hy - 0.4, 0.42, 0.42, '#1a1a1a');
	helm(o.head, hx, hy, o);
	// the near arm: shield, or a hand at the side
	if (o.shield) shield(o.shield, o, sh, hip, atk);
	else if (o.weapon2) {
		P_(
			[
				[0.2, sh + 0.6],
				[1.8, sh + 0.2],
				[3.4, sh + 4.6],
				[2.2, sh + 5],
			],
			shade(tunic, 0.95),
			INK,
			0.4,
		);
		weapon(o.weapon2, [3, sh + 4.8], atk, sh);
		E_(3, sh + 4.8, 0.9, 0.9, sk);
	} else {
		P_(
			[
				[0.2, sh + 0.6],
				[1.8, sh + 0.2],
				[2.2, sh + 6.4],
				[0.8, sh + 6.6],
			],
			shade(tunic, 0.95),
			INK,
			0.4,
		);
		E_(1.6, sh + 6.9, 0.9, 0.9, sk);
	}
	if (o.lean) g.restore();
}
function helm(kind, x, y, o) {
	switch (kind) {
		case 'hood':
			P_(
				[
					[x - 3, y + 1.6],
					[x - 2.8, y - 2.4],
					[x, y - 3.4],
					[x + 2.6, y - 2],
					[x + 2.2, y - 0.6],
					[x - 1, y - 1],
					[x - 1.4, y + 2],
				],
				o.hoodCol || shade(o.tunic, 0.8),
				INK,
				0.4,
			);
			break;
		case 'cap':
			P_(
				[
					[x - 2.8, y - 0.6],
					[x - 2.2, y - 2.8],
					[x + 0.2, y - 3.5],
					[x + 2.6, y - 2.2],
					[x + 3.2, y - 1.2],
				],
				o.capCol || shade(o.tunic, 0.8),
				INK,
				0.4,
			);
			break;
		case 'straw':
			E_(x, y - 1.6, 4.2, 0.9, '#d8c27a', '#7a6430', 0.4);
			P_(
				[
					[x - 2, y - 1.8],
					[x - 1.4, y - 3.6],
					[x + 1.4, y - 3.6],
					[x + 2, y - 1.8],
				],
				'#cdb66c',
				'#7a6430',
				0.4,
			);
			break;
		case 'kettle':
			E_(x, y - 1.6, 4.6, 1.0, steel(x - 4, y - 2, x + 4, y - 1), '#2a3036', 0.4);
			P_(
				[
					[x - 2.4, y - 1.8],
					[x - 1.6, y - 4],
					[x + 1.6, y - 4],
					[x + 2.4, y - 1.8],
				],
				steel(x - 2, y - 4, x + 2, y - 2),
				'#2a3036',
				0.4,
			);
			break;
		case 'conical':
			P_(
				[
					[x - 3, y - 0.8],
					[x, y - 5.2],
					[x + 3, y - 0.8],
				],
				o.helmCol || '#3a2a20',
				INK,
				0.4,
			);
			E_(x, y - 0.8, 3.2, 0.7, shade(o.helmCol || '#3a2a20', 1.3));
			break;
		case 'galea':
			P_(
				[
					[x - 2.8, y + 0.6],
					[x - 2.8, y - 2],
					[x - 0.6, y - 3.4],
					[x + 2.2, y - 2.6],
					[x + 2.6, y - 1.2],
					[x - 0.6, y - 1.2],
					[x - 0.8, y + 1.6],
				],
				steel(x - 3, y - 3, x + 3, y),
				'#2a3036',
				0.4,
			);
			P_(
				[
					[x + 0.2, y - 1.2],
					[x + 1.4, y - 1.2],
					[x + 1.2, y + 1.8],
					[x + 0.2, y + 1.6],
				],
				STEEL,
				'#2a3036',
				0.3,
			);
			P_(
				[
					[x - 2.6, y - 2.6],
					[x - 1.4, y - 5.4],
					[x + 1.8, y - 5.2],
					[x + 2.2, y - 3],
				],
				o.crest || '#b33a2e',
				INK,
				0.3,
			);
			break;
		case 'corinth':
			P_(
				[
					[x - 2.8, y + 2.2],
					[x - 2.9, y - 2.2],
					[x - 0.6, y - 3.5],
					[x + 2.4, y - 2.6],
					[x + 2.8, y + 0.2],
					[x + 2.2, y + 2.4],
					[x + 0.6, y + 2.4],
					[x + 0.6, y - 0.2],
					[x - 1, y - 0.2],
					[x - 1.2, y + 2.4],
				],
				bronzeG(x - 3, y - 3, x + 3, y + 2),
				'#4a3010',
				0.4,
			);
			P_(
				[
					[x - 2.6, y - 2.8],
					[x - 3.6, y - 6],
					[x + 2.6, y - 6.2],
					[x + 2.2, y - 3.2],
				],
				o.crest || '#c33',
				INK,
				0.3,
			);
			break;
		case 'great':
			P_(
				[
					[x - 2.8, y + 2.4],
					[x - 2.8, y - 2.8],
					[x - 0.6, y - 3.6],
					[x + 2.8, y - 2.8],
					[x + 2.8, y + 2.4],
				],
				steel(x - 3, 0, x + 3, 0),
				'#222a30',
				0.45,
			);
			g.fillStyle = '#0b0e10';
			g.fillRect(x - 0.2, y - 0.9, 3, 0.7);
			g.fillRect(x + 0.6, y + 0.4, 2.2, 0.4);
			if (o.crest) {
				g.strokeStyle = o.crest;
				g.lineWidth = 1.1;
				for (let i = 0; i < 4; i++) {
					g.beginPath();
					g.moveTo(x - 1 + i * 0.6, y - 3.4);
					g.quadraticCurveTo(x - 4 + i * 0.6, y - 7 - i * 0.3, x - 6.5 + i * 0.9, y - 3.6 + i * 0.6);
					g.stroke();
				}
			}
			break;
		case 'morion':
			E_(x, y - 1.6, 4.8, 1.0, steel(x - 4, y - 2, x + 4, y - 1), '#2a3036', 0.4);
			P_(
				[
					[x - 2.4, y - 1.8],
					[x - 1.8, y - 4.2],
					[x + 1.8, y - 4.2],
					[x + 2.4, y - 1.8],
				],
				steel(x - 2, y - 4, x + 2, y - 2),
				'#2a3036',
				0.4,
			);
			P_(
				[
					[x - 2, y - 4.1],
					[x, y - 5.6],
					[x + 2, y - 4.1],
				],
				shade(STEEL, 0.8),
				'#2a3036',
				0.3,
			);
			break;
		case 'tiara':
			P_(
				[
					[x - 2.6, y - 1],
					[x - 2.2, y - 5.6],
					[x + 2, y - 5.6],
					[x + 2.6, y - 1],
				],
				o.helmCol || '#e8dcc0',
				INK,
				0.4,
			);
			L_(x - 2.4, y - 1.6, x + 2.4, y - 1.6, '#c9a227', 0.6);
			break;
		case 'fur':
			E_(x, y - 2, 3.2, 1.8, '#6b4a2c', INK, 0.4);
			P_(
				[
					[x - 1.6, y - 3],
					[x, y - 6],
					[x + 1.6, y - 3],
				],
				o.helmCol || '#b33a2e',
				INK,
				0.3,
			);
			break;
		case 'turban':
			E_(x, y - 2.2, 3, 1.9, o.helmCol || '#efe4cc', INK, 0.4);
			L_(x - 2.6, y - 2.4, x + 2.6, y - 1.6, 'rgba(0,0,0,.2)', 0.4);
			break;
		case 'skull':
			E_(x, y, 2.6, 2.7, '#e8e4d8', '#6b6658', 0.4);
			E_(x + 1.2, y - 0.2, 0.8, 0.9, '#1a1a1a');
			E_(x - 0.4, y - 0.2, 0.7, 0.8, '#1a1a1a');
			L_(x - 0.2, y + 1.6, x + 2.2, y + 1.6, '#3a3630', 0.4);
			break;
		case 'mask':
			P_(
				[
					[x - 0.4, y - 0.2],
					[x + 2.8, y - 0.4],
					[x + 2.6, y + 2.4],
					[x - 0.2, y + 2.6],
				],
				'#2a2420',
			);
			helm('hood', x, y, { ...o, hoodCol: '#3a3028' });
			break;
	}
}
function weapon(w, h, atk, sh) {
	const [x, y] = h;
	switch (w) {
		case 'spear': {
			const a = atk ? 0.12 : -0.28,
				L = 14,
				B = 6;
			const dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x - dx * B, y - dy * B, x + dx * L, y + dy * L, '#8a6a3a', 0.8);
			P_(
				[
					[x + dx * L, y + dy * L - 0.6],
					[x + dx * (L + 3), y + dy * (L + 3)],
					[x + dx * L, y + dy * L + 0.6],
				],
				'#dfe4e8',
				'#555',
				0.3,
			);
			break;
		}
		case 'pike': {
			const a = atk ? 0.05 : -0.42,
				L = 22,
				B = 8;
			const dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x - dx * B, y - dy * B, x + dx * L, y + dy * L, '#8a6a3a', 0.8);
			P_(
				[
					[x + dx * L, y + dy * L - 0.5],
					[x + dx * (L + 3), y + dy * (L + 3)],
					[x + dx * L, y + dy * L + 0.5],
				],
				'#dfe4e8',
				'#555',
				0.3,
			);
			break;
		}
		case 'sword':
		case 'gladius': {
			const len = w === 'gladius' ? 5 : 7,
				a = atk ? 0.1 : -1.1,
				dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x, y, x + dx * len, y + dy * len, '#e6eaee', 1);
			L_(x - dy * 1.4, y + dx * 1.4, x + dy * 1.4, y - dx * 1.4, '#c9a227', 0.6);
			break;
		}
		case 'axe': {
			const a = atk ? 0.4 : -1.2,
				dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x - dx, y - dy, x + dx * 6, y + dy * 6, '#7a5430', 0.7);
			P_(
				[
					[x + dx * 5 - dy * 0.2, y + dy * 5 + dx * 0.2],
					[x + dx * 6.2 + dy * 2, y + dy * 6.2 - dx * 2],
					[x + dx * 4 + dy * 1.8, y + dy * 4 - dx * 1.8],
				],
				'#c4ccd2',
				'#555',
				0.3,
			);
			break;
		}
		case 'pick': {
			const a = atk ? 0.5 : -1.3,
				dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x - dx, y - dy, x + dx * 6.5, y + dy * 6.5, '#7a5430', 0.7);
			P_(
				[
					[x + dx * 6.5 - dy * 2.6, y + dy * 6.5 + dx * 2.6],
					[x + dx * 6.5 + dy * 2.6, y + dy * 6.5 - dx * 2.6],
					[x + dx * 7.2 + dy * 0.2, y + dy * 7.2 - dx * 0.2],
				],
				'#8c949b',
				INK,
				0.4,
			);
			break;
		}
		case 'hammer': {
			const a = atk ? 0.6 : -1.1,
				dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x, y, x + dx * 5, y + dy * 5, '#7a5430', 0.8);
			P_(
				[
					[x + dx * 5 - dy * 1.6, y + dy * 5 + dx * 1.6],
					[x + dx * 5 + dy * 1.6, y + dy * 5 - dx * 1.6],
					[x + dx * 6.4 + dy * 1.6, y + dy * 6.4 - dx * 1.6],
					[x + dx * 6.4 - dy * 1.6, y + dy * 6.4 + dx * 1.6],
				],
				'#6e747a',
				INK,
				0.4,
			);
			break;
		}
		case 'rod': {
			const a = atk ? -0.5 : -0.95,
				dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x - dx, y - dy, x + dx * 12, y + dy * 12, '#8a6a3a', 0.5);
			L_(x + dx * 12, y + dy * 12, x + dx * 13 + 1, y + dy * 12 + 9, 'rgba(235,240,245,.8)', 0.25);
			break;
		}
		case 'club': {
			const a = atk ? 0.3 : -1.3,
				dx = Math.cos(a),
				dy = Math.sin(a);
			g.lineCap = 'round';
			L_(x, y, x + dx * 7, y + dy * 7, '#6b4a2c', 1.6);
			E_(x + dx * 7, y + dy * 7, 1.4, 1.4, '#5a3c22');
			break;
		}
		case 'bigclub': {
			const a = atk ? 0.3 : -1.3,
				dx = Math.cos(a),
				dy = Math.sin(a);
			g.lineCap = 'round';
			L_(x, y, x + dx * 11, y + dy * 11, '#5a4030', 2.6);
			E_(x + dx * 11, y + dy * 11, 2.6, 2.6, '#4a3020');
			break;
		}
		case 'dagger':
			L_(x, y, x + 3.4, y + (atk ? -0.2 : -2.4), '#dfe4e8', 0.8);
			break;
		case 'staff':
			L_(x, sh - 6, x + 0.3, 0, '#8a6a3a', 0.9);
			if (w === 'staff') E_(x, sh - 6.4, 1.1, 1.1, '#e6c75a');
			break;
		case 'crook':
			L_(x, sh - 4, x + 0.3, 0, '#8a6a3a', 0.9);
			g.strokeStyle = '#8a6a3a';
			g.lineWidth = 0.9;
			g.beginPath();
			g.arc(x - 1.4, sh - 4, 1.4, 0, Math.PI, true);
			g.stroke();
			break;
		case 'bow':
		case 'longbow': {
			const t = w === 'longbow' ? 9 : 6.8,
				bx = x + 1.2;
			g.strokeStyle = '#5a3a1c';
			g.lineWidth = 0.9;
			g.beginPath();
			g.moveTo(bx - 1, y - t);
			g.quadraticCurveTo(bx + (atk ? 2.4 : 3.4), y, bx - 1, y + t);
			g.stroke();
			L_(bx - 1, y - t, atk ? bx - 4.6 : bx - 1, y, '#efe6cf', 0.3);
			L_(atk ? bx - 4.6 : bx - 1, y, bx - 1, y + t, '#efe6cf', 0.3);
			if (atk) {
				L_(bx - 4.6, y, bx + 4, y, '#d9c79a', 0.5);
				P_(
					[
						[bx + 4, y - 0.5],
						[bx + 5.4, y],
						[bx + 4, y + 0.5],
					],
					'#ccc',
				);
			}
			break;
		}
		case 'xbow': {
			L_(x - 3, y + 0.4, x + 6, y - 0.4, '#7a5430', 1.4);
			g.strokeStyle = '#3a3a3a';
			g.lineWidth = 0.8;
			g.beginPath();
			g.moveTo(x + 5, y - 4);
			g.quadraticCurveTo(x + 6.6, y, x + 5, y + 4);
			g.stroke();
			L_(x + 5, y - 4, atk ? x + 5 : x + 1.6, y, '#efe6cf', 0.3);
			L_(atk ? x + 5 : x + 1.6, y, x + 5, y + 4, '#efe6cf', 0.3);
			if (!atk) L_(x + 1.6, y - 0.2, x + 7, y - 0.4, '#d9c79a', 0.5);
			break;
		}
		case 'gun': {
			L_(x - 3.4, y + 0.8, x + 4, y, '#6b4a2c', 1.7);
			L_(x + 3, y - 0.2, x + 14, y - 1.2, '#2c2c32', 1.1);
			L_(x + 5.5, y - 0.4, x + 5.5, y + 1.6, '#c9a227', 0.5);
			if (atk) {
				E_(x + 15.4, y - 1.4, 2.2, 1.6, '#ffd35e');
				E_(x + 18.4, y - 2.8, 2.8, 2.2, 'rgba(228,228,222,.8)');
			}
			break;
		}
		case 'jav': {
			const a = atk ? -0.05 : -0.9,
				dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x - dx * 3, y - dy * 3, x + dx * 9, y + dy * 9, '#9a7a4a', 0.6);
			P_(
				[
					[x + dx * 9 - dy * 0.4, y + dy * 9 + dx * 0.4],
					[x + dx * 11, y + dy * 11],
					[x + dx * 9 + dy * 0.4, y + dy * 9 - dx * 0.4],
				],
				'#ccc',
			);
			break;
		}
		case 'lance': {
			const a = atk ? 0 : -0.16,
				dx = Math.cos(a),
				dy = Math.sin(a);
			L_(x - dx * 8, y - dy * 8, x + dx * 18, y + dy * 18, '#d9c79a', 1.1);
			P_(
				[
					[x + dx * 18, y + dy * 18 - 0.6],
					[x + dx * 21, y + dy * 21],
					[x + dx * 18, y + dy * 18 + 0.6],
				],
				'#dfe4e8',
				'#555',
				0.3,
			);
			break;
		}
		case 'scroll':
			P_(
				[
					[x - 0.6, y - 2.6],
					[x + 1.4, y - 2.6],
					[x + 1.4, y + 1.6],
					[x - 0.6, y + 1.6],
				],
				'#f2ead2',
				'#8a7a5a',
				0.3,
			);
			break;
		case 'bag':
			E_(x + 0.4, y + 2, 1.8, 1.5, '#7a5a3a', INK, 0.3);
			L_(x - 0.2, y + 0.8, x + 1, y + 0.8, '#c33', 0.6);
			break;
	}
}
function shield(kind, o, sh, hip, atk) {
	const cx = 3.4 + (atk ? -0.6 : 0),
		cy = sh + 5.2,
		col = o.trim || o.tunic;
	if (kind === 'round') {
		E_(cx, cy, 3.6, 4.4, LG(cx - 3, cy - 4, cx + 3, cy + 4, [shade(col, 1.25), col, shade(col, 0.7)]), INK, 0.5);
		E_(cx, cy, 3.6, 4.4, null, BRONZE, 0.7);
		E_(cx + 0.3, cy, 0.9, 1.1, BRONZE);
	} else if (kind === 'aspis') {
		E_(cx, cy - 0.4, 4.4, 5.4, bronzeG(cx - 4, cy - 5, cx + 4, cy + 5), '#4a3010', 0.5);
		E_(cx, cy - 0.4, 3.4, 4.2, col);
		E_(cx + 0.4, cy - 0.6, 1.4, 1.6, shade(col, 0.6));
	} else if (kind === 'kite') {
		P_(
			[
				[cx - 3.2, cy - 5.6],
				[cx + 3.4, cy - 5.6],
				[cx + 3.4, cy - 1],
				[cx + 0.1, cy + 6.6],
				[cx - 3.2, cy - 1],
			],
			LG(cx - 3, 0, cx + 3, 0, [shade(col, 1.2), col, shade(col, 0.7)]),
			INK,
			0.5,
		);
		P_(
			[
				[cx - 3.2, cy - 5.6],
				[cx + 3.4, cy - 5.6],
				[cx + 3.4, cy - 1],
				[cx + 0.1, cy + 6.6],
				[cx - 3.2, cy - 1],
			],
			null,
			'#d8c27a',
			0.5,
		);
		L_(cx, cy - 5.3, cx, cy + 5.8, '#f2e9c8', 0.9);
		L_(cx - 3, cy - 2.4, cx + 3.2, cy - 2.4, '#f2e9c8', 0.9);
	} else if (kind === 'scutum') {
		P_(
			[
				[cx - 2.6, cy - 6.6],
				[cx + 3.2, cy - 6.6],
				[cx + 3.6, cy + 5.8],
				[cx - 2.6, cy + 5.8],
			],
			LG(cx - 3, 0, cx + 4, 0, [shade(col, 0.75), col, shade(col, 1.15)]),
			INK,
			0.5,
		);
		P_(
			[
				[cx - 2.6, cy - 6.6],
				[cx + 3.2, cy - 6.6],
				[cx + 3.6, cy + 5.8],
				[cx - 2.6, cy + 5.8],
			],
			null,
			'#d8c27a',
			0.6,
		);
		E_(cx + 0.5, cy - 0.4, 1.2, 1.4, BRONZE);
		L_(cx - 2, cy - 4, cx + 3, cy + 3, 'rgba(242,207,85,.7)', 0.5);
		L_(cx - 2, cy + 3, cx + 3, cy - 4, 'rgba(242,207,85,.7)', 0.5);
	} else if (kind === 'wicker') {
		P_(
			[
				[cx - 2.6, cy - 6],
				[cx + 3.2, cy - 6],
				[cx + 3.2, cy + 5],
				[cx - 2.6, cy + 5],
			],
			'#c9a96a',
			'#6b5230',
			0.5,
		);
		g.strokeStyle = 'rgba(90,64,30,.6)';
		g.lineWidth = 0.35;
		for (let y = cy - 5.4; y < cy + 5; y += 1.2) {
			g.beginPath();
			g.moveTo(cx - 2.4, y);
			g.lineTo(cx + 3, y);
			g.stroke();
		}
		L_(cx - 2.6, cy - 6, cx + 3.2, cy - 6, col, 1);
	}
	P_(
		[
			[0.2, sh + 0.6],
			[1.8, sh + 0.2],
			[cx + 0.6, cy - 0.6],
			[cx - 0.8, cy + 0.8],
		],
		shade(o.tunic, 0.95),
	);
}
// ── a horse, side on. o: { coat, barding: 'cloth'|'scale'|'mail', cloth }
function horse(o, fr, dx = 0) {
	const c = o.coat || '#7a4e2c',
		cd = shade(c, 0.7),
		sw = fr === 1 ? 1 : fr === 2 ? -1 : 0;
	const leg = (x, a, col) => {
		g.save();
		g.translate(x + dx, -7);
		g.rotate(a);
		P_(
			[
				[-1.1, 0],
				[1.1, 0],
				[0.9, 4.2],
				[-0.9, 4.2],
			],
			col,
			INK,
			0.35,
		);
		P_(
			[
				[-0.9, 4.2],
				[0.9, 4.2],
				[0.8, 6.6],
				[-0.8, 6.6],
			],
			col,
			INK,
			0.35,
		);
		P_(
			[
				[-1, 6.6],
				[1, 6.6],
				[1.2, 7.4],
				[-1.2, 7.4],
			],
			'#1e1a16',
		);
		g.restore();
	};
	leg(-6, -0.25 * sw, cd);
	leg(6.4, 0.25 * sw, cd);
	g.strokeStyle = shade(c, 0.45);
	g.lineWidth = 1.6;
	g.beginPath();
	g.moveTo(dx - 9, -11);
	g.quadraticCurveTo(dx - 12.5, -8, dx - 11.5, -3.5);
	g.stroke();
	E_(dx, -10.6, 10, 4.3, LG(dx, -15, dx, -6, [shade(c, 1.2), c, shade(c, 0.75)]), INK, 0.45);
	P_(
		[
			[dx + 6.5, -13],
			[dx + 10, -19],
			[dx + 12.4, -20.2],
			[dx + 13, -17.4],
			[dx + 9.2, -10],
		],
		LG(dx + 6, -20, dx + 13, -10, [shade(c, 1.15), c]),
		INK,
		0.45,
	);
	P_(
		[
			[dx + 11.4, -20.6],
			[dx + 15.6, -18],
			[dx + 16.6, -15.8],
			[dx + 15.2, -15],
			[dx + 12.4, -16.6],
		],
		LG(dx + 11, -20, dx + 17, -15, [shade(c, 1.1), shade(c, 0.85)]),
		INK,
		0.45,
	);
	P_(
		[
			[dx + 11.6, -20.4],
			[dx + 12.2, -22.6],
			[dx + 12.8, -20.4],
		],
		cd,
	);
	E_(dx + 13.2, -18.6, 0.45, 0.45, '#0b0b0b');
	g.strokeStyle = shade(c, 0.4);
	g.lineWidth = 1.1;
	g.beginPath();
	g.moveTo(dx + 7, -14.5);
	g.quadraticCurveTo(dx + 9, -19, dx + 11.6, -20.6);
	g.stroke();
	if (o.barding === 'cloth') {
		P_(
			[
				[dx - 9.6, -12.4],
				[dx + 8.6, -13],
				[dx + 9.4, -7.6],
				[dx + 6, -5.2],
				[dx - 4, -5.4],
				[dx - 9.8, -7.2],
			],
			LG(0, -13, 0, -5, [shade(o.cloth, 1.2), o.cloth, shade(o.cloth, 0.7)]),
			INK,
			0.45,
		);
		for (let i = 0; i < 6; i++)
			P_(
				[
					[dx - 8.4 + i * 3, -5.6],
					[dx - 7 + i * 3, -4.2],
					[dx - 5.6 + i * 3, -5.6],
				],
				'#e9d28a',
			);
		L_(dx - 9.4, -12.2, dx + 8.6, -12.8, '#e9d28a', 0.6);
	}
	if (o.barding === 'scale' || o.barding === 'mail') {
		P_(
			[
				[dx - 9.6, -13],
				[dx + 9, -13.6],
				[dx + 9.6, -7.8],
				[dx - 9.8, -7.4],
			],
			o.barding === 'scale' ? bronzeG(0, -14, 0, -7) : '#9aa2a8',
			INK,
			0.45,
		);
		g.strokeStyle = 'rgba(40,30,20,.55)';
		g.lineWidth = 0.3;
		for (let y = -12.6; y < -8; y += 1.1)
			for (let x = -9; x < 9; x += 1.3) {
				g.beginPath();
				g.arc(dx + x, y, 0.6, 0, Math.PI);
				g.stroke();
			}
		P_(
			[
				[dx + 6.8, -13.4],
				[dx + 10.4, -19.4],
				[dx + 12.2, -20.4],
				[dx + 10.4, -13],
			],
			o.barding === 'scale' ? bronzeG(0, -20, 0, -13) : '#9aa2a8',
			INK,
			0.4,
		);
	}
	if (o.saddle !== false)
		P_(
			[
				[dx - 3.6, -15],
				[dx + 2.4, -15.2],
				[dx + 3, -13.6],
				[dx - 4.2, -13.4],
			],
			'#3a2414',
			INK,
			0.4,
		);
	leg(-4.2, 0.25 * sw, c);
	leg(8.2, -0.25 * sw, c);
}
function quad(o, fr) {
	// deer, boar, wolf, bear: one four-legged template
	const c = o.col,
		L = o.len,
		H = o.h,
		sw = fr === 1 ? 1 : fr === 2 ? -1 : 0,
		cd = shade(c, 0.7);
	const leg = (x, a, col) => {
		g.save();
		g.translate(x, -o.legH);
		g.rotate(a);
		P_(
			[
				[-o.legW, 0],
				[o.legW, 0],
				[o.legW * 0.8, o.legH],
				[-o.legW * 0.8, o.legH],
			],
			col,
			INK,
			0.3,
		);
		g.restore();
	};
	leg(-L * 0.32, -0.3 * sw, cd);
	leg(L * 0.3, 0.3 * sw, cd);
	if (o.tail) L_(-L * 0.48, -o.legH - H * 0.6, -L * 0.6, -o.legH - H * 0.1, cd, o.tail);
	E_(0, -o.legH - H / 2, L / 2, H / 2, LG(0, -o.legH - H, 0, -o.legH, [shade(c, 1.2), c, shade(c, 0.75)]), INK, 0.4);
	if (o.hump) E_(-L * 0.05, -o.legH - H * 0.9, L * 0.3, H * 0.4, shade(c, 1.05));
	const hx = L / 2 + o.head * (fr === 4 ? 1.2 : 0.4),
		hy = fr === 4 ? -o.head * 0.9 : -o.legH - H * o.headY; // frame 4: grazing, the muzzle at the grass (D-092)
	P_(
		[
			[L * 0.35, -o.legH - H * 0.9],
			[hx, hy - o.head * 0.7],
			[hx + o.head * 1.4, hy + o.head * 0.2],
			[hx + o.head * 1.2, hy + o.head * 0.8],
			[L * 0.38, -o.legH - H * 0.2],
		],
		c,
		INK,
		0.4,
	);
	E_(hx + o.head * 0.4, hy, o.head, o.head * 0.8, shade(c, 1.05), INK, 0.35);
	E_(hx + o.head * 0.6, hy - o.head * 0.25, 0.4, 0.4, o.eye || '#0b0b0b');
	P_(
		[
			[hx - o.head * 0.4, hy - o.head * 0.6],
			[hx - o.head * 0.1, hy - o.head * 1.6],
			[hx + o.head * 0.3, hy - o.head * 0.6],
		],
		cd,
	);
	if (o.antlers) {
		g.strokeStyle = '#d8c8a0';
		g.lineWidth = 0.6;
		g.beginPath();
		g.moveTo(hx, hy - o.head);
		g.lineTo(hx - 1.2, hy - o.head - 4);
		g.moveTo(hx - 0.7, hy - o.head - 2.4);
		g.lineTo(hx + 1.2, hy - o.head - 3.6);
		g.moveTo(hx - 1.1, hy - o.head - 3.6);
		g.lineTo(hx - 3, hy - o.head - 4.6);
		g.stroke();
	}
	if (o.tusk) {
		g.strokeStyle = '#efe6cf';
		g.lineWidth = 0.6;
		g.beginPath();
		g.moveTo(hx + o.head * 1.2, hy + o.head * 0.4);
		g.quadraticCurveTo(hx + o.head * 1.8, hy, hx + o.head * 1.4, hy - o.head * 0.5);
		g.stroke();
	}
	if (o.bristle) {
		g.strokeStyle = shade(c, 0.5);
		g.lineWidth = 0.4;
		for (let i = 0; i < 6; i++)
			L_(-L * 0.2 + i * L * 0.08, -o.legH - H, -L * 0.22 + i * L * 0.08, -o.legH - H - 1.2, shade(c, 0.5), 0.4);
	}
	leg(-L * 0.22, 0.3 * sw, c);
	leg(L * 0.38, -0.3 * sw, c);
}
function elephant(o, fr) {
	const c = '#8d8a86',
		sw = fr === 1 ? 1 : fr === 2 ? -1 : 0;
	const leg = (x, a, col) => {
		g.save();
		g.translate(x, -9);
		g.rotate(a * 0.15);
		P_(
			[
				[-2.4, 0],
				[2.4, 0],
				[2.2, 9],
				[-2.2, 9],
			],
			col,
			INK,
			0.4,
		);
		E_(0, 8.8, 2.3, 0.7, shade(col, 0.8));
		g.restore();
	};
	leg(-8, -sw, shade(c, 0.75));
	leg(7, sw, shade(c, 0.75));
	L_(-13.4, -16, -15, -8, shade(c, 0.6), 0.8);
	E_(0, -16, 14, 8.6, LG(0, -25, 0, -7, ['#a8a5a1', c, '#66635f']), INK, 0.5);
	E_(13, -19, 6.4, 6.4, LG(8, -25, 18, -13, ['#a8a5a1', c]), INK, 0.5);
	E_(10.6, -18.6, 3.6, 5, shade(c, 0.85), INK, 0.4);
	g.strokeStyle = c;
	g.lineWidth = 2.6;
	g.lineCap = 'round';
	g.beginPath();
	g.moveTo(17.6, -17);
	g.quadraticCurveTo(21, -10, 19 + (fr === 3 ? 3 : 0), -3);
	g.stroke();
	g.lineWidth = 0.4;
	g.strokeStyle = INK;
	g.stroke();
	g.strokeStyle = '#f2ead8';
	g.lineWidth = 1.2;
	g.beginPath();
	g.moveTo(16.6, -14.4);
	g.quadraticCurveTo(20, -13, 21.6, -15.6);
	g.stroke();
	E_(15, -21, 0.6, 0.6, '#0b0b0b');
	P_(
		[
			[-10, -23.6],
			[9, -23.8],
			[10, -14],
			[-11, -14],
		],
		LG(0, -24, 0, -14, [shade(o.cloth, 1.2), o.cloth, shade(o.cloth, 0.7)]),
		INK,
		0.45,
	);
	for (let i = 0; i < 7; i++) E_(-9 + i * 3, -14, 0.9, 0.9, '#e9c45a');
	P_(
		[
			[-7, -31],
			[6, -31],
			[6.4, -23.6],
			[-7.4, -23.6],
		],
		WOOD,
		INK,
		0.45,
	);
	P_(
		[
			[-7.6, -31.6],
			[6.6, -31.6],
			[6.6, -30.2],
			[-7.6, -30.2],
		],
		o.cloth,
	);
	L_(-7, -31, -7, -36, '#5a3a1c', 0.6);
	L_(6, -31, 6, -36, '#5a3a1c', 0.6);
	P_(
		[
			[-8, -37],
			[7, -37],
			[6, -35.4],
			[-7, -35.4],
		],
		shade(o.cloth, 0.8),
		INK,
		0.3,
	);
	E_(-2, -33.6, 1.8, 1.9, SKIN);
	E_(3, -33.4, 1.8, 1.9, SKIN);
	helm('turban', 3, -33.4, { helmCol: '#efe4cc' });
	L_(4.4, -32.6, 13, -38, '#8a6a3a', 0.6);
	E_(9.6, -26.4, 1.6, 1.7, SKIN);
	helm('turban', 9.6, -26.4, { helmCol: o.cloth });
	leg(-5, sw, c);
	leg(10, -sw, c);
}
function wheel(x, y, r) {
	E_(x, y, r, r, null, '#3a2814', 1);
	g.strokeStyle = '#5a3a1c';
	g.lineWidth = 0.5;
	for (let i = 0; i < 6; i++) {
		const a = (i * Math.PI) / 3;
		g.beginPath();
		g.moveTo(x, y);
		g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
		g.stroke();
	}
	E_(x, y, 0.8, 0.8, '#3a2814');
}
function planks(x0, y0, x1, y1, col) {
	P_(
		[
			[x0, y0],
			[x1, y0],
			[x1, y1],
			[x0, y1],
		],
		LG(x0, 0, x1, 0, [shade(col, 1.15), col, shade(col, 0.75)]),
		INK,
		0.5,
	);
	g.strokeStyle = 'rgba(40,24,10,.45)';
	g.lineWidth = 0.35;
	for (let y = y0 + 2; y < y1; y += 2.2) {
		g.beginPath();
		g.moveTo(x0, y);
		g.lineTo(x1, y);
		g.stroke();
	}
}
// ── each look: how its figure is put together. c = side colour, t = tier.
const WORKTOOL = ['axe', 'none', 'pick', 'none', 'rod', 'hammer']; // chop, forage, mine, farm, fish, mend
const LOOKS = {
	vil: (c, t, fr) => {
		// fr 0-3 as everyone; 10 and up = at work: (fr - 10) >> 1 is the work, the low bit its two poses
		const wk = fr >= 10 ? (fr - 10) >> 1 : -1,
			ph = fr >= 10 ? (fr - 10) & 1 : 0;
		return person(
			{
				tunic: '#8a6a44',
				trim: c,
				sash: c,
				head: 'bare',
				weapon: wk < 0 ? 'axe' : WORKTOOL[wk],
				lean: wk === 1 || wk === 3 ? (ph ? 0.62 : 0.4) : 0,
				legs: '#5a4a38',
				beard: '#6b4a2c',
			},
			wk < 0 ? fr : ph ? 3 : 0,
		);
	},
	scout: (c, t, fr) => {
		// a runner with a staff and cape until Horse breeding (tier 1) puts it on a horse
		if (!t) {
			person({ tunic: c, head: 'cap', capCol: shade(c, 0.6), weapon: 'staff', cape: shade(c, 0.6) }, fr);
			return;
		}
		horse({ coat: '#9a7046' }, fr);
		g.save();
		g.translate(-0.6, -1);
		person({ tunic: c, head: 'cap', capCol: shade(c, 0.6), weapon: 'spear', seated: true, cape: shade(c, 0.6) }, fr);
		g.restore();
	},
	envoy: (c, t, fr) =>
		person({ tunic: '#eae2cc', trim: c, body: 'robe', head: 'bare', weapon: 'scroll', sash: c, legs: '#d8cdb2' }, fr),
	caravan: (c, t, fr) => {
		horse({ coat: '#8a7a6a', saddle: false }, fr, 9);
		L_(-2, -9, 6, -11, '#5a3a1c', 0.8);
		planks(-14, -13, -1, -6, WOOD);
		E_(-11, -16, 2.6, 2.4, '#c9a96a', INK, 0.3);
		E_(-6.5, -16.4, 2.6, 2.6, '#d8c27a', INK, 0.3);
		E_(-8.5, -18.6, 2.2, 2, c, INK, 0.3);
		wheel(-7.5, -4.6, 4.4);
	},
	wagon: (c, t, fr) => {
		// the camp wagon: two horses in file, a long bed, a canvas tilt on hoops with the side's colour along its edge, two wheels
		horse({ coat: '#6a5a4a', saddle: false }, fr, 14);
		horse({ coat: '#8a7a6a', saddle: false }, fr, 4);
		L_(-6, -9, 2, -11, '#5a3a1c', 0.8);
		planks(-22, -13, -4, -6, WOOD);
		P_(
			[
				[-22, -13],
				[-4, -13],
				[-5, -22],
				[-13, -25],
				[-21, -22],
			],
			'#e4dcc6',
			INK,
			0.4,
		); // the tilt
		for (const x of [-18, -13, -8]) L_(x, -13, x, -22, '#d2c8ae', 0.6); // the hoops
		L_(-21, -22, -5, -22, c, 1.4); // the side's colour
		wheel(-17, -4.6, 4.6);
		wheel(-8, -4.6, 4.6);
	},
	spy: (c, t, fr) =>
		person(
			{
				tunic: '#2a2a30',
				trim: c,
				body: 'robe',
				head: 'hood',
				hoodCol: '#1c1c22',
				weapon: 'dagger',
				cape: '#1c1c22',
				legs: '#22222a',
			},
			fr,
		),
	priest: (c, t, fr) =>
		person(
			{
				tunic: '#efe6cf',
				trim: '#c9a227',
				body: 'robe',
				head: 'bare',
				weapon: 'staff',
				sash: c,
				legs: '#d8cdb2',
				beard: '#d8d0c0',
			},
			fr,
		),
	medic: (c, t, fr) =>
		person(
			{ tunic: '#e4dccb', trim: c, head: 'cap', capCol: '#e4dccb', weapon: 'bag', sash: '#c23a30', legs: '#6b5a48' },
			fr,
		),
	spear: (c, t, fr) =>
		t === 0
			? person({ tunic: c, head: 'bare', shield: 'round', weapon: 'spear', legs: '#6b5a40', beard: '#4a3420' }, fr)
			: t === 1
				? person(
						{
							tunic: c,
							body: 'scale',
							head: 'corinth',
							crest: shade(c, 0.6),
							shield: 'aspis',
							weapon: 'spear',
							legs: '#b08a50',
							boots: BRONZE,
						},
						fr,
					)
				: person(
						{ tunic: c, body: 'mail', head: 'kettle', shield: null, weapon: 'pike', weapon2: null, legs: '#5a4a38' },
						fr,
					),
	sword: (c, t, fr) =>
		t === 0
			? person(
					{
						tunic: c,
						body: 'scale',
						head: 'conical',
						helmCol: BRONZE,
						shield: 'round',
						weapon: 'sword',
						legs: '#6b5a40',
					},
					fr,
				)
			: person(
					{
						tunic: c,
						body: 'plate',
						head: 'great',
						shield: 'kite',
						weapon: 'sword',
						legs: '#7a8088',
						boots: '#555c63',
					},
					fr,
				),
	legion: (c, t, fr) =>
		person(
			{
				tunic: '#b33a2e',
				trim: c,
				body: 'segm',
				head: 'galea',
				crest: '#b33a2e',
				shield: 'scutum',
				weapon: 'gladius',
				legs: '#a8653a',
				boots: LEATHER,
			},
			fr,
		),
	immortal: (c, t, fr) =>
		person(
			{
				tunic: c,
				body: 'robe',
				head: 'tiara',
				helmCol: '#efe4cc',
				shield: 'wicker',
				weapon: 'spear',
				legs: shade(c, 0.6),
				beard: '#2a1a10',
				sash: '#c9a227',
			},
			fr,
		),
	archer: (c, t, fr) =>
		t === 0
			? person({ tunic: c, head: 'hood', weapon: 'bow', legs: '#5a4a38' }, fr)
			: person({ tunic: c, head: 'cap', capCol: '#2f5a2f', weapon: 'longbow', legs: '#4a5a38', sash: '#d8c27a' }, fr),
	jav: (c, t, fr) =>
		person({ tunic: c, head: 'bare', shield: 'round', weapon: 'jav', legs: '#6b5a40', beard: '#6b4a2c' }, fr),
	crossbow: (c, t, fr) => person({ tunic: c, body: 'mail', head: 'kettle', weapon: 'xbow', legs: '#5a4a38' }, fr),
	arquebus: (c, t, fr) =>
		person(
			{
				tunic: c,
				trim: c,
				body: 'mail',
				head: 'morion',
				weapon: 'gun',
				sash: '#e6d9b0',
				legs: '#7a3a2e',
				boots: LEATHER,
			},
			fr,
		),
	bombard: (c, t, fr) => {
		const r = fr === 3 ? -2.5 : 0;
		planks(-13, -6, 13, -3, WOOD);
		g.save();
		g.translate(r, 0);
		P_(
			[
				[-11, -9],
				[11, -11.4],
				[13, -9.6],
				[13, -5.4],
				[11, -4.4],
				[-11, -6.2],
			],
			bronzeG(0, -11, 0, -4),
			'#4a3010',
			0.6,
		);
		for (const x of [-6, 0, 6]) L_(x, -10.4, x, -4.8, '#7d5420', 0.9);
		E_(13, -7.5, 1.2, 2, '#1a1612');
		if (fr === 3) {
			E_(16.5, -8, 3, 2.4, '#ffd35e');
			E_(21, -10, 4, 3, 'rgba(228,228,222,.7)');
		}
		g.restore();
		g.fillStyle = c;
		g.fillRect(-12, -6, 2.4, -7);
		P_(
			[
				[-9.6, -13],
				[-5, -11.8],
				[-9.6, -10.6],
			],
			c,
		);
		wheel(-7, -2.6, 3.3);
		wheel(7, -2.6, 3.3);
	},
	chariot: (c, t, fr) =>
		t === 0
			? (() => {
					horse({ coat: '#a0703a', saddle: false }, fr, 9);
					L_(-2, -10, 7, -11, '#5a3a1c', 1);
					g.save();
					g.translate(-7, -4);
					person({ tunic: c, head: 'conical', helmCol: BRONZE, weapon: 'bow' }, fr);
					g.restore();
					planks(-12, -12, -2, -5, shade(c, 0.85));
					wheel(-7, -4.6, 4.6);
				})()
			: (() => {
					horse({ coat: '#7a4e2c' }, fr);
					g.save();
					g.translate(-0.6, -1);
					person({ tunic: c, head: 'conical', helmCol: STEEL, shield: 'round', weapon: 'spear', seated: true }, fr);
					g.restore();
				})(),
	cata: (c, t, fr) =>
		t === 0
			? (() => {
					horse({ coat: '#5a3a24', barding: 'scale' }, fr);
					g.save();
					g.translate(-0.6, -1);
					person(
						{
							tunic: c,
							body: 'scale',
							head: 'conical',
							helmCol: STEEL,
							weapon: 'lance',
							seated: true,
							legs: '#9aa2a8',
						},
						fr,
					);
					g.restore();
				})()
			: (() => {
					horse({ coat: '#5a3a24', barding: 'cloth', cloth: c }, fr);
					g.save();
					g.translate(-0.6, -1);
					person(
						{
							tunic: c,
							body: 'plate',
							head: 'great',
							crest: c,
							shield: 'kite',
							weapon: 'lance',
							seated: true,
							legs: '#9aa2a8',
						},
						fr,
					);
					g.restore();
				})(),
	malihorse: (c, t, fr) => {
		horse({ coat: '#efe6d4', barding: 'cloth', cloth: '#c9a227' }, fr);
		g.save();
		g.translate(-0.6, -1);
		person(
			{ tunic: c, body: 'robe', head: 'turban', helmCol: '#f2ead2', weapon: 'lance', seated: true, skin: '#7a4a2c' },
			fr,
		);
		g.restore();
	},
	harcher: (c, t, fr) => {
		horse({ coat: '#b08a5a' }, fr);
		g.save();
		g.translate(-0.6, -1);
		person({ tunic: c, head: 'fur', helmCol: shade(c, 0.6), weapon: 'bow', seated: true, legs: '#6b4a2c' }, fr);
		g.restore();
	},
	elephant: (c, t, fr) => elephant({ cloth: c }, fr),
	ram: (c, t, fr) => {
		L_(-17 + (fr === 3 ? 4 : 0), -8, 15 + (fr === 3 ? 4 : 0), -8, '#6b4a2c', 3);
		P_(
			[
				[15 + (fr === 3 ? 4 : 0), -10],
				[19 + (fr === 3 ? 4 : 0), -8],
				[15 + (fr === 3 ? 4 : 0), -6],
			],
			'#5d6670',
			INK,
			0.4,
		);
		P_(
			[
				[-13, -6],
				[13, -6],
				[13, -12],
				[0, -19],
				[-13, -12],
			],
			LG(0, -19, 0, -6, ['#8a6a44', '#6b4a2c']),
			INK,
			0.6,
		);
		g.strokeStyle = 'rgba(30,20,10,.5)';
		g.lineWidth = 0.4;
		for (let i = -11; i < 13; i += 3) {
			g.beginPath();
			g.moveTo(i, -6);
			g.lineTo(i, -12 + Math.abs(i) * 0);
			g.stroke();
		}
		P_(
			[
				[-13, -12],
				[0, -19],
				[13, -12],
				[0, -14],
			],
			'#7a8a5a',
			INK,
			0.4,
		);
		g.fillStyle = c;
		g.fillRect(-1, -19, 2, -5);
		P_(
			[
				[1, -24],
				[6, -22.6],
				[1, -21.2],
			],
			c,
		);
		wheel(-9, -3.2, 3.2);
		wheel(0, -3.2, 3.2);
		wheel(9, -3.2, 3.2);
	},
	stower: (c, t, fr) => {
		planks(-8, -42, 8, -3, '#8a6a44');
		for (let y = -38; y < -8; y += 9)
			P_(
				[
					[2, y],
					[6, y],
					[6, y + 3],
					[2, y + 3],
				],
				'#1a120a',
			);
		E_(4, -36.2, 1.4, 1.5, SKIN);
		E_(4, -27.2, 1.4, 1.5, SKIN);
		P_(
			[
				[-9, -42],
				[9, -42],
				[8, -45],
				[-8, -45],
			],
			'#6b4a2c',
			INK,
			0.5,
		);
		L_(-6, -45, -6, -54, '#3a2814', 0.6);
		P_(
			[
				[-6, -54],
				[2, -52],
				[-6, -50],
			],
			c,
		);
		wheel(-5, -3, 3.2);
		wheel(5, -3, 3.2);
	},
	catapult: (c, t, fr) => {
		planks(-11, -6, 11, -3, WOOD);
		P_(
			[
				[-2, -6],
				[0, -14],
				[2, -6],
			],
			WOOD,
			INK,
			0.5,
		);
		const a = fr === 3 ? -1.2 : -0.35;
		g.save();
		g.translate(0, -12);
		g.rotate(a);
		L_(-14, 0, 6, 0, '#6b4a2c', 1.6);
		E_(-14, 0, 2.6, 1.6, '#4a3020', INK, 0.4);
		if (fr !== 3) E_(-14, -1.6, 1.4, 1.4, '#8a8a8a');
		g.restore();
		L_(-8, -6, -11, -9, '#6b4a2c', 0.8);
		g.fillStyle = c;
		g.fillRect(8, -6, 3, -4);
		wheel(-7, -2.6, 2.8);
		wheel(7, -2.6, 2.8);
	},
	ballista: (c, t, fr) => {
		L_(-6, 0, 0, -9, WOOD, 1);
		L_(6, 0, 0, -9, WOOD, 1);
		L_(0, 0, 0, -9, WOOD, 1);
		planks(-8, -12, 9, -9, WOOD);
		g.strokeStyle = '#3a3a3a';
		g.lineWidth = 1;
		g.beginPath();
		g.moveTo(6, -18);
		g.quadraticCurveTo(9, -10.5, 6, -3);
		g.stroke();
		L_(6, -18, fr === 3 ? 6 : -4, -10.5, '#efe6cf', 0.4);
		L_(fr === 3 ? 6 : -4, -10.5, 6, -3, '#efe6cf', 0.4);
		if (fr !== 3) L_(-4, -10.6, 12, -10.6, '#d9c79a', 0.8);
		g.fillStyle = c;
		g.fillRect(-8, -12, 3, 3);
	},
	treb: (c, t, fr) => {
		planks(-14, -5, 14, -2, WOOD);
		P_(
			[
				[-6, -5],
				[0, -30],
				[6, -5],
			],
			null,
			WOOD,
			1.6,
		);
		L_(-3, -18, 3, -18, WOOD, 1);
		const a = fr === 3 ? -2.2 : -0.5;
		g.save();
		g.translate(0, -29);
		g.rotate(a);
		L_(-22, 0, 8, 0, '#6b4a2c', 1.4);
		P_(
			[
				[5, -1],
				[12, -1],
				[12, 6],
				[5, 6],
			],
			'#5a5048',
			INK,
			0.5,
		);
		L_(-22, 0, -22, 8, '#c9b48a', 0.4);
		E_(-22, 8.6, 1.2, 1.2, '#8a8a8a');
		g.restore();
		g.fillStyle = c;
		g.fillRect(-1, -32, 2, -5);
		P_(
			[
				[1, -37],
				[6, -35.6],
				[1, -34.2],
			],
			c,
		);
		wheel(-10, -2, 2.4);
		wheel(10, -2, 2.4);
	},
	deer: (c, t, fr) =>
		quad(
			{ col: '#a0703e', len: 13, h: 5.6, legH: 7.4, legW: 0.6, head: 2.2, headY: 1.8, antlers: true, tail: 0.8 },
			fr,
		),
	boar: (c, t, fr) =>
		quad(
			{
				col: '#4a3a2e',
				len: 13,
				h: 7,
				legH: 3.4,
				legW: 1,
				head: 2.8,
				headY: 0.55,
				tusk: true,
				bristle: true,
				tail: 0.6,
			},
			fr,
		),
	wolf: (c, t, fr) =>
		quad({ col: '#7a7570', len: 13, h: 5, legH: 5.2, legW: 0.7, head: 2.2, headY: 1.0, tail: 1.6 }, fr),
	direwolf: (c, t, fr) =>
		quad({ col: '#3c3a40', len: 20, h: 8, legH: 7.5, legW: 1.1, head: 3.4, headY: 1.0, tail: 2.4, eye: '#e33' }, fr),
	bear: (c, t, fr) =>
		quad({ col: '#4e3524', len: 17, h: 9, legH: 4.5, legW: 1.5, head: 3.2, headY: 0.8, hump: true, tail: 0 }, fr),
	bison: (c, t, fr) => {
		quad(
			{
				col: '#3e2a1c',
				len: 20,
				h: 10,
				legH: 6,
				legW: 1.4,
				head: 3.4,
				headY: 0.4,
				hump: true,
				bristle: true,
				tail: 0.8,
			},
			fr,
		);
		g.strokeStyle = '#e8dcc4';
		g.lineWidth = 0.7;
		g.beginPath();
		g.moveTo(14, -13);
		g.quadraticCurveTo(16, -17, 13, -17.5);
		g.stroke();
	}, // the hump, a shaggy mane and a short horn
	performer: (c, t, fr) => {
		person(
			{
				tunic: ['#c33a2e', '#2d6fb5', '#d9a62a', '#3d8a4a', '#8e3a9a'][t % 5],
				head: 'cap',
				weapon: 'none',
				legs: ['#d9a62a', '#c33a2e', '#2d6fb5', '#8e3a9a', '#3d8a4a'][t % 5],
				cape: '#f2d27a',
			},
			fr,
		);
		L_(-6, -14, -6, -26, '#5a3a1c', 0.6);
		P_(
			[
				[-6, -26],
				[1, -24],
				[-6, -22],
			],
			['#c33a2e', '#2d6fb5', '#d9a62a'][t % 3],
		);
	}, // bright coats and a pennant
	dragon: (c, t, fr) => {
		const f = fr === 1 ? 1 : fr === 2 ? -1 : 0;
		P_(
			[
				[-18, -4 + f * 6],
				[-4, -12],
				[6, -12],
				[-2, -2 + f * 4],
			],
			'#6a2a1a',
			INK,
			0.5,
		);
		P_(
			[
				[18, -4 + f * 6],
				[4, -12],
				[-6, -12],
				[2, -2 + f * 4],
			],
			'#6a2a1a',
			INK,
			0.5,
		);
		E_(0, -10, 10, 3.4, LG(0, -13, 0, -7, ['#b04a2a', '#6a2a1a']), INK, 0.5);
		L_(-10, -10, -22, -6, '#8a3a22', 2);
		P_(
			[
				[10, -10],
				[17, -13],
				[19, -9],
				[12, -7],
			],
			'#8a3a22',
			INK,
			0.5,
		);
		E_(17, -11, 0.6, 0.6, '#ffd35e');
	}, // seen from above: two wings, a long tail
	native: (c, t, fr) =>
		person(
			{
				tunic: '#8a6a48',
				head: 'bare',
				skin: '#b58a5a',
				shield: 'round',
				shieldCol: '#6b4a2c',
				weapon: 'spear',
				legs: '#5a4a38',
				sash: '#c9a227',
			},
			fr,
		), // the Throne's guard: hide and a gold sash
	nativebow: (c, t, fr) =>
		person({ tunic: '#7a5a3a', head: 'bare', skin: '#b58a5a', weapon: 'bow', legs: '#5a4a38', sash: '#c9a227' }, fr),
	bandit: (c, t, fr) =>
		person(
			{ tunic: '#5a5040', head: 'hood', hoodCol: '#4a3e2e', weapon: 'club', legs: '#3a3228', beard: '#3a2a1a' },
			fr,
		),
	robber: (c, t, fr) =>
		person({ tunic: '#4a3a30', head: 'mask', weapon: 'sword', shield: 'round', trim: '#6b3a2a', legs: '#2e2620' }, fr),
	wayfarer: (c, t, fr) =>
		person(
			{ tunic: '#7a6a50', head: 'straw', weapon: 'crook', legs: '#5a4a38', beard: '#8a8070', cape: '#6b5a40' },
			fr,
		),
	vagabond: (c, t, fr) =>
		person({ tunic: '#6a5e4e', head: 'bare', weapon: 'none', legs: '#4a4038', beard: '#4a3a2a', sash: '#8a3a2a' }, fr),
	goblin: (c, t, fr) => {
		g.save();
		g.scale(0.75, 0.75);
		person(
			{
				tunic: '#5a4a30',
				head: 'bare',
				skin: '#7aa04a',
				weapon: 'dagger',
				shield: 'round',
				trim: '#6b5a30',
				legs: '#4a3a20',
			},
			fr,
		);
		g.restore();
	},
	skeleton: (c, t, fr) =>
		person(
			{
				tunic: '#d8d4c8',
				body: 'robe',
				head: 'skull',
				skin: '#e8e4d8',
				weapon: 'sword',
				shield: 'round',
				trim: '#6b6658',
				legs: '#cfcabb',
			},
			fr,
		),
	troll: (c, t, fr) => {
		g.save();
		g.scale(1.6, 1.6);
		person(
			{ tunic: '#5a6a4a', head: 'bare', skin: '#7a8a6a', weapon: 'bigclub', legs: '#4a5a3a', beard: '#3a4a2a' },
			fr,
		);
		g.restore();
	},
};
// how big each look's sprite box is (local units): [width, height]
const LOOKBOX = {
	scout: [44, 34],
	caravan: [36, 30],
	wagon: [48, 32],
	chariot: [36, 34],
	cata: [58, 36],
	malihorse: [58, 36],
	harcher: [36, 36],
	elephant: [48, 44],
	ram: [42, 30],
	stower: [24, 58],
	catapult: [32, 26],
	ballista: [30, 24],
	treb: [48, 50],
	deer: [26, 22],
	boar: [24, 16],
	wolf: [24, 16],
	direwolf: [36, 24],
	bear: [30, 22],
	bison: [40, 26],
	dragon: [48, 24],
	troll: [26, 46],
	spear: [52, 34],
	vil: [30, 30],
	legion: [30, 30],
	immortal: [44, 30],
	sword: [30, 30],
	jav: [34, 30],
	crossbow: [34, 30],
	arquebus: [40, 30],
	bombard: [44, 30],
};
// ── the sprite cache: one canvas per look, colour, tier, pose and zoom step
const SPR = new Map();
function trim(M, max) {
	if (M.size > max)
		for (const [k, v] of M) {
			M.delete(k);
			if (v.getContext) v.width = v.height = 0; // give the picture's memory back at once: iPhone drops pages that hold too much
			if (M.size <= max * 0.8) break;
		}
} // oldest first: a Map keeps insertion order
const SCALES = [1, 1.5, 2, 3, 4, 5, 6];
// the elite rank (Build 40): a people's finest carry a gold pennant on a staff at the back, and a gold edge to the figure
const ELITE_LOOK = new Set(['legion', 'crossbow', 'immortal', 'harcher', 'elephant', 'malihorse']); // the looks the six peoples' finest wear; the common kinds that share a look never reach a tier
function elitePennant(c) {
	const x = 8,
		y0 = -4,
		y1 = -30;
	L_(x, y0, x, y1, '#5a3a1c', 0.9);
	P_(
		[
			[x, y1],
			[x + 8, y1 + 2.5],
			[x, y1 + 5],
		],
		'#e6b947',
		'#8a6a1a',
		0.4,
	);
	P_(
		[
			[x + 0.6, y1 + 1],
			[x + 5.5, y1 + 2.5],
			[x + 0.6, y1 + 4],
		],
		c,
		null,
	);
	E_(x, y1 - 0.8, 1.1, 1.1, '#f2d27a', '#8a6a1a', 0.3);
}
function sprite(look, col, tier, fr, s, kit = 0) {
	const key = look + col + tier + fr + s + (kit ? 'k' + kit : '');
	let c = SPR.get(key);
	if (c) return c;
	const [bw, bh] = LOOKBOX[look] || [26, 30],
		pad = 3;
	c = document.createElement('canvas');
	c.width = Math.ceil((bw + pad * 2) * s);
	c.height = Math.ceil((bh + pad * 2) * s);
	g = c.getContext('2d');
	g.scale(s, s);
	g.translate(bw / 2 + pad, bh + pad - 1);
	g.lineJoin = 'round';
	g.lineCap = 'round';
	KIT = kit;
	try {
		LOOKS[look](col, tier, fr);
		if (tier > 0 && ELITE_LOOK.has(look)) elitePennant(col);
	} catch (e) {
		fault(e);
	}
	KIT = 0;
	c.ax = (bw / 2 + pad) * s;
	c.ay = (bh + pad - 1) * s;
	g = null;
	trim(SPR, 600);
	SPR.set(key, c);
	return c;
}
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
		const R = NS_rng(5);
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
		LG(x - 1, 0, x + 1, 0, [lit(col, 0.08), lit(col, -0.4)]),
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
		E_(
			x + dx * s,
			y + dy * s,
			r * s,
			r * 0.86 * s,
			RG(x + dx * s - r * 0.4 * s, y + dy * s - r * 0.4 * s, 0, r * 1.1 * s, [lit(col, kk + 0.3), lit(col, kk - 0.35)]),
		);
};
// ── the props the yards share (Build 61) ──
const stump = (x, y) => {
	E_(x, y - 1, 1.5, 1.1, LG(x - 1.5, 0, x + 1.5, 0, ['#a07a4a', '#5a3c22']), LINE, 0.3);
	E_(x, y - 2.1, 1.5, 0.6, '#c9a46a');
	E_(x, y - 2.1, 0.8, 0.32, 'rgba(120,80,30,.5)');
};
const grassTufts = (w, col, n) => {
	const R = NS_rng(3);
	for (let i = 0; i < n; i++) {
		const [x, y] = gpt(w, 0.05 + R() * 0.9, 0.05 + R() * 0.9);
		L_(x, y, x + 0.4, y - 1.3, col, 0.3);
		L_(x + 0.6, y, x + 1.1, y - 1, lit(col, -0.2), 0.3);
	}
};
const hay = (x, y, s = 1) => {
	E_(x + 0.5, y + 0.2, 2.8 * s, 1.1 * s, 'rgba(20,30,40,.3)');
	E_(x, y - 1.8 * s, 2.6 * s, 2.1 * s, RG(x - 0.8 * s, y - 2.6 * s, 0, 3 * s, ['#f0cf6e', '#b8882e']));
	for (let i = 0; i < 10; i++)
		L_(x - 2 + i * 0.45, y - 0.5 * s, x - 1.7 + i * 0.45, y - 3 * s - (i % 3) * 0.4, 'rgba(120,70,10,.35)', 0.22);
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
		g.quadraticCurveTo(
			(x0 + x1) / 2 + k * u,
			yf - h + 1.4 - (d + lift) * u,
			x1 + over + k * u,
			yf - h + 0.6 - (d + lift) * u,
		);
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
			lit(TILE, -0.6),
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
					lit(SLATE, -0.6),
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
	// the camp's tents (CAMP): a ridge tent of canvas, pegged out, the side's colour on the flap; the mark on the ridge tells them apart
	tent(c, mark) {
		const CANVAS = { med: '#eeeae0', train: '#9fa9b4', mess: '#cdb98a', depot: '#a88a62' }[mark] || '#d9cfb4', // its own cloth: white, grey, tan, brown
			d = 20 * TILT,
			f = d / 2;
		P_(
			[
				[-11, f + 1],
				[11, f + 1],
				[11, f - 3],
				[-11, f - 3],
			],
			lit('#8a7a5a', -0.3),
			null,
			0,
		); // the trodden ground at the door
		P_(
			[
				[-10, f],
				[10, f],
				[0, f - 14],
			],
			lit(CANVAS, -0.08),
			LINE,
			0.5,
		); // the front gable
		P_(
			[
				[10, f],
				[10 + 7, f - 7],
				[7, f - 21],
				[0, f - 14],
			],
			lit(CANVAS, -0.5),
			LINE,
			0.5,
		); // the shaded east slope
		P_(
			[
				[-10, f],
				[-10 + 7, f - 7],
				[7, f - 21],
				[0, f - 14],
			],
			lit(CANVAS, 0.1),
			LINE,
			0.5,
		); // the sunlit west slope
		P_(
			[
				[-3, f],
				[3, f],
				[0, f - 6],
			],
			'#3a2a1a',
			null,
			0,
		); // the door flap, open
		L_(-3, f, -3, f - 6, c, 1.4); // the side's colour down the flap
		L_(0, f - 14, 7, f - 21, '#6a5a4a', 1); // the ridge pole
		if (mark === 'med') {
			L_(-6, f - 8, -2, f - 8, '#b23a3a', 1.6);
			L_(-4, f - 10, -4, f - 6, '#b23a3a', 1.6);
		} else if (mark === 'train') L_(-7, f - 9, -2, f - 6, '#55657a', 1.6);
		else if (mark === 'mess') E_(-4, f - 8, 2.4, 1.6, '#b8954a', LINE, 0.3);
		else if (mark === 'depot') {
			P_(
				[
					[-8, f - 6],
					[-3, f - 6],
					[-3, f - 10],
					[-8, f - 10],
				],
				'#8a6644',
				LINE,
				0.3,
			);
		}
	},
	medtent(c) {
		ART.tent(c, 'med');
	},
	traintent(c) {
		ART.tent(c, 'train');
	},
	messtent(c) {
		ART.tent(c, 'mess');
	},
	depot(c) {
		ART.tent(c, 'depot');
	},
	camptower(c) {
		// a timber tower: four posts, a platform with a rail, a ladder; the side's flag on top
		const d = 20 * TILT,
			f = d / 2;
		for (const [x, k] of [
			[-7, 0.05],
			[7, -0.4],
		]) {
			P_(
				[
					[x - 1.5, f],
					[x + 1.5, f],
					[x + 1.5, f - 30],
					[x - 1.5, f - 30],
				],
				lit(PLANK, k),
				LINE,
				0.4,
			);
		}
		L_(-7, f - 6, 7, f - 18, lit(PLANK, -0.5), 1); // the cross brace
		L_(7, f - 6, -7, f - 18, lit(PLANK, -0.5), 1);
		P_(
			[
				[-10, f - 30],
				[10, f - 30],
				[10, f - 34],
				[-10, f - 34],
			],
			lit(PLANK, 0.1),
			LINE,
			0.5,
		); // the platform
		P_(
			[
				[-10, f - 34],
				[10, f - 34],
				[10, f - 40],
				[-10, f - 40],
			],
			lit('#8a7a5a', -0.2),
			LINE,
			0.5,
		); // the parapet of wattle
		L_(-9, f - 40, -9, f - 46, lit(PLANK, -0.3), 1);
		L_(-9, f - 46, -2, f - 44, c, 2); // the flag
		L_(-9, f - 44, -2, f - 44, c, 2);
		L_(2, f, 2, f - 30, lit(PLANK, -0.6), 0.8); // the ladder
		for (let y = f - 4; y > f - 30; y -= 4) L_(0.5, y, 3.5, y, lit(PLANK, -0.6), 0.8);
	},
	abatis(c) {
		// a felled trunk laid across the square, its branches sharpened and pointing out
		const d = 10 * TILT,
			f = d / 2;
		P_(
			[
				[-6, f - 1],
				[6, f - 3],
				[6, f - 6],
				[-6, f - 4],
			],
			lit('#4a3018', -0.2),
			LINE,
			0.4,
		); // the trunk
		E_(-7, f - 2, 2.2, 1.3, lit('#5a3c22', -0.3), LINE, 0.3); // the stump where the tree stood
		for (const [x, y] of [
			[-4, f - 4],
			[-1, f - 5],
			[2, f - 5.5],
			[5, f - 6],
		]) {
			L_(x, y, x + 1.5, y - 5, lit('#4a3018', -0.1), 1.1);
			L_(x + 1.5, y - 5, x + 3, y - 3, lit('#4a3018', -0.1), 0.9);
			L_(x + 1.2, y - 4, x + 1.5, y - 5, '#e8dcc4', 0.9); // the sharpened point, pale
			L_(x + 2.5, y - 3.6, x + 3, y - 3, '#e8dcc4', 0.8);
		}
	},
	palisade(c) {
		// one square of stakes: four pointed posts of timber, lashed, the shaded side east
		const d = 10 * TILT,
			f = d / 2;
		for (let i = 0; i < 4; i++) {
			const x = -4.5 + i * 3;
			P_(
				[
					[x - 1.2, f],
					[x + 1.2, f],
					[x + 1.2, f - 13],
					[x, f - 16],
					[x - 1.2, f - 13],
				],
				lit(PLANK, i === 3 ? -0.45 : 0.05 - i * 0.08),
				LINE,
				0.4,
			);
		}
		L_(-5.5, f - 9, 5.5, f - 9, lit(PLANK, -0.5), 1.2); // the lashing rail
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
	hall(c, o, civ) {
		// the people's Hall: one body, a roof and a front by people: the Forum's colonnade, the Taixue's upturned eaves, the Court's columns
		// and tiled roof, the Ordu's great tent, the Mantriparishad's pillared hall, Sankore's mud-brick pylon
		if (civ === 'mongol') {
			const d = 30 * TILT,
				f = d / 2;
			E_(0, f, 15, 15 * TILT, lit('#e4d9c0', -0.1), LINE, 0.5);
			P_(
				[
					[-15, f - 10],
					[15, f - 10],
					[0, f - 30],
				],
				lit('#e4d9c0', 0.08),
				LINE,
				0.5,
			);
			P_(
				[
					[-15, f - 10],
					[15, f - 10],
					[15, f - 2],
					[-15, f - 2],
				],
				lit('#d8ccb0', -0.3),
				LINE,
				0.5,
			);
			door(0, f - 2, 5, 7);
			banner(0, f - 31, c, 9);
			return;
		}
		if (civ === 'mali') {
			const r = block(30, 24, MUD, 'mud', 'flat', MUD, 2);
			for (const x of [-10, 0, 10]) P_([[x - 3, r.d / 2 - 24], [x + 3, r.d / 2 - 24], [x + 2, r.d / 2 - 34], [x - 2, r.d / 2 - 34]], lit(MUD, 0.05), LINE, 0.4); // the pylons
			for (let y = r.d / 2 - 6; y > r.d / 2 - 22; y -= 5) for (const x of [-12, -6, 0, 6, 12]) L_(x, y, x + 2.5, y, lit(MUD, -0.5), 1); // the toron beams
			door(0, r.d / 2, 5, 9);
			banner(0, r.d / 2 - 35, c, 8);
			return;
		}
		const roof = civ === 'han' ? TILE : civ === 'persian' ? '#8a7a5a' : civ === 'maurya' ? '#b8954a' : TILE,
			r = block(30, 22, civ === 'roman' ? PLASTER : civ === 'han' ? '#c9654a' : STONE, civ === 'roman' ? 'stone' : 'plank', civ === 'han' ? 'hip' : 'gable', roof, civ === 'han' ? 6 : 9);
		for (const x of [-11, -5.5, 0, 5.5, 11]) P_([[x - 1.2, r.d / 2], [x + 1.2, r.d / 2], [x + 1.2, r.d / 2 - 16], [x - 1.2, r.d / 2 - 16]], lit(civ === 'roman' || civ === 'persian' ? PLASTER : PLANK, 0.1), LINE, 0.4); // the colonnade
		door(0, r.d / 2, 4, 8);
		L_(-14, r.d / 2 - 2, -14, r.d / 2 - 34, lit(PLANK, -0.4), 1.2); // the banner pole before the front
		P_([[-14, r.d / 2 - 34], [-5, r.d / 2 - 31], [-14, r.d / 2 - 27]], c, LINE, 0.4);
	},
	store(c) {
		// the storehouse: a long timber granary raised on stone staddles against damp and rats (the Roman horrea stood on pillars), a hip roof
		// of tile, one wide door, air slits under the eaves; the side's banner at the gable
		const d = 30 * TILT,
			f = d / 2;
		for (const x of [-11, -4, 4, 11]) P_([[x - 1.5, f + 1], [x + 1.5, f + 1], [x + 1.5, f - 3], [x - 1.5, f - 3]], lit(STONE, -0.2), LINE, 0.4); // the staddle stones
		const r = block(30, 20, PLANK, 'plank', 'hip', TILE, 7, 26);
		door(0, r.d / 2 - 3, 7, 8);
		for (const x of [-11, -7, 7, 11]) win(x, r.d / 2 - 14, 1.6, 1.2, '#2a2014'); // the air slits
		banner(0, r.d / 2 - 22, c, 8);
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
		field(
			w,
			'#ad9262',
			c,
			() => {
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
					E_(
						sx,
						sy - 2,
						1.4,
						1.6,
						RG(sx - 0.4, sy - 2.6, 0, 1.8, [lit('#c0392b', 0.2), lit('#c0392b', -0.35)]),
						LINE,
						0.3,
					);
					E_(sx, sy - 2, 0.5, 0.5, '#e6b947');
				}
				crate(...gpt(w, 0.9, 0.08));
			},
			true,
		);
	},
	range(c) {
		// the butts on a green (Build 61, Albert: open-air): three targets at the back, a shooting line, hay behind
		const w = 40;
		field(
			w,
			'#8cb860',
			c,
			() => {
				grassTufts(w, '#5a8a3c', 60);
				const [h0, h1] = [gpt(w, 0.03, 0.97), gpt(w, 0.97, 0.97)];
				for (let i = 0; i < 7; i++) hay(h0[0] + ((h1[0] - h0[0]) * (i + 0.5)) / 7, h0[1] - 0.6, 0.85);
				for (let i = 0; i < 3; i++) {
					const [x, y] = gpt(w, 0.25 + i * 0.25, 0.84);
					E_(x + 0.6, y + 0.2, 3, 1.1, 'rgba(20,30,40,.28)');
					for (const dx of [-1.7, 1.7]) post(x + dx, y, 5, '#5a3a1e', 0.42);
					E_(x, y - 2.6, 2.8, 2.8, RG(x - 0.7, y - 3.3, 0, 3.4, ['#f3e6c0', '#c9ad66']));
					for (let rr = 0; rr < 6; rr++)
						E_(x, y - 2.6, 2.8 - rr * 0.42, 2.8 - rr * 0.42, null, 'rgba(120,90,40,.3)', 0.2);
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
			},
			true,
		);
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
		field(
			w,
			'#cdb990',
			c,
			() => {
				const R = NS_rng(9);
				for (let i = 0; i < 70; i++) {
					const [x, y] = gpt(w, 0.03 + R() * 0.94, 0.03 + R() * 0.94);
					E_(
						x,
						y,
						1.3 + R(),
						0.6 + R() * 0.4,
						`rgba(${150 + ((R() * 40) | 0)},${125 + ((R() * 30) | 0)},${95 + ((R() * 30) | 0)},.6)`,
					);
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
			},
			true,
		);
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
				lit(SLATE, -0.6),
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
				L_(
					cx + rr * Math.cos(t),
					cy - h + rr * TILT * Math.sin(t),
					cx + (rr - 2.6) * Math.cos(t),
					cy - h + (rr - 2.6) * TILT * Math.sin(t),
					'rgba(90,70,40,.3)',
					0.25,
				);
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
		E_(
			kk * 0.55,
			d / 2 - L * 0.55,
			w * 0.9,
			L * 0.5,
			RG(kk * 0.55, d / 2 - L * 0.55, 0, w * 0.9, [
				'rgba(60,130,175,.95)',
				'rgba(60,130,175,.7)',
				'rgba(60,130,175,0)',
			]),
		); // the water it stands in
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
		for (let i = 1; i < 9; i++)
			L_(-pw + (kk * i) / 9, d / 2 - (L * i) / 9, pw + (kk * i) / 9, d / 2 - (L * i) / 9, 'rgba(60,40,20,.42)', 0.3);
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
				lit(STONE, -0.6),
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
				LG(-b, 0, b, 0, [lit(STONE, -0.16), lit(STONE, -0.6)]),
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
			for (let x = -w; x <= w; x += 4) L_(x, f - h, x, f - h - 7, lit(PLANK, -0.6), 0.6);
			P_(
				[
					[-w - 4, f - h - 7],
					[w + 4, f - h - 7],
					[0, f - h - 19],
				],
				LG(-w, 0, w, 0, [lit(SLATE, 0.16), lit(SLATE, -0.4)]),
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
			}
		// gun ports
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
		hay(w * 0.36, w * TILT * 0.46, 1);
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
			for (let i = 0; i < 6; i++)
				L_(lx - 1.8, ly - 1.4 + i * 0.5, lx + 1.8, ly - 1.4 + i * 0.5, 'rgba(255,240,200,.5)', 0.22);
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
			for (let i = 0; i < 5; i++)
				E_(
					fx + 1.2 + i * 1.3 + Math.sin(i * 1.7) * 0.8,
					fy - 11 - i * 3.2,
					1.5 + i * 1.1,
					1.1 + i * 0.8,
					`rgba(220,215,210,${0.4 - i * 0.07})`,
				);
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
			P_(
				[gpt(w, 0.08, 0.45), gpt(w, 0.6, 0.45), gpt(w, 0.6, 0.92), gpt(w, 0.08, 0.92)],
				LG(0, d / 2 - d * 0.45, 0, d / 2 - d * 0.92, ['#4a4640', '#6a665e']),
			);
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
			for (let i = 0; i < 7; i++)
				L_(qx + 1 + i * 2.2, qy - 0.3, qx + 1.6 + i * 2.2, qy - 3.1, 'rgba(40,36,30,.4)', 0.25);
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
		for (let i = 1; i < 4; i++)
			L_(-w / 2 + k + 0.3, -d / 2 - (i * H) / 4, w / 2 + k - 0.3, -d / 2 - (i * H) / 4, 'rgba(30,22,16,.25)', 0.22);
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
		door(-1.6, (9.5 * TILT) / 2, 2.4, 4.4, '#2a2014');
		win(2.6, (9.5 * TILT) / 2 - 3.6, 1.3, 2, true);
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
		for (let i = 1; i < 3; i++)
			L_(w / 2 + 0.2, d / 2 - i * 2.4, w / 2 + k - 0.2, d / 2 - i * 2.4 - d, 'rgba(10,20,30,.25)', 0.25);
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
											: b.kind === 'hall'
												? G.P[o].civ
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
