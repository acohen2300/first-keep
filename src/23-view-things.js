// ═════ 23-view-things.js: buildings, smoke and fire, ripples and sparks, nodes, units, finds ═════
function drawBld(b, s) {
	if (BLD[b.kind].trap) {
		const z = cam.z,
			x = SX(b.x),
			y = SY(b.y),
			k = BLD[b.kind].trap,
			own = b.owner === 0 || friendly(0, b.owner);
		if (b.prog < 1) {
			ctx.strokeStyle = 'rgba(255,211,94,.7)';
			ctx.setLineDash([3, 3]);
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.ellipse(x, y, 6 * z, 3.6 * z, 0, 0, 7);
			ctx.stroke();
			ctx.setLineDash([]);
			return;
		}
		if (k === 'pit') {
			ctx.fillStyle = own ? 'rgba(60,50,30,.5)' : 'rgba(180,40,30,.55)';
			ctx.beginPath();
			ctx.ellipse(x, y, 6 * z, 3.6 * z, 0, 0, 7);
			ctx.fill();
		} else if (k === 'net') {
			ctx.strokeStyle = own ? 'rgba(120,100,60,.8)' : 'rgba(200,60,40,.8)';
			ctx.lineWidth = 1;
			for (let i = -6; i <= 6; i += 3) {
				ctx.beginPath();
				ctx.moveTo(x + i * z, y - 4 * z);
				ctx.lineTo(x + i * z, y + 4 * z);
				ctx.moveTo(x - 6 * z, y + i * z * 0.6);
				ctx.lineTo(x + 6 * z, y + i * z * 0.6);
				ctx.stroke();
			}
		} else {
			ctx.strokeStyle = own ? 'rgba(120,90,40,.9)' : 'rgba(200,60,40,.9)';
			ctx.lineWidth = 1.2;
			for (let i = -5; i <= 5; i += 2.5) {
				ctx.beginPath();
				ctx.moveTo(x + i * z, y + 2 * z);
				ctx.lineTo(x + i * z + 1.5 * z, y - 5 * z);
				ctx.stroke();
			}
		}
		return;
	}
	const z = cam.z,
		sx = SX(b.x),
		sy = SY(b.y),
		B = BLD[b.kind],
		c = bldSprite(b, s),
		k = z / s;
	if (!B.crop) {
		ctx.fillStyle = 'rgba(0,0,0,.25)';
		const w = B.fp * NAVC * z;
		ctx.beginPath();
		ctx.ellipse(sx + w * 0.12, sy + w * TILT * 0.18, w * 0.62, w * TILT * 0.5, 0, 0, 7);
		ctx.fill();
	}
	if (b.prog < 1) {
		// a building site: the outline staked out, the walls rising with the work
		const w = B.fp * NAVC * z,
			d = w * TILT;
		ctx.strokeStyle = '#d8c79c';
		ctx.lineWidth = 1.5;
		ctx.setLineDash([3, 3]);
		ctx.strokeRect(sx - w / 2, sy - d / 2, w, d);
		ctx.setLineDash([]);
		const top = c.ay * k,
			show = 0.15 + 0.85 * b.prog;
		ctx.save();
		ctx.beginPath();
		ctx.rect(sx - c.ax * k, sy + d / 2 - (top + d / 2) * show - 2, c.width * k, (top + d / 2) * show + c.height * k);
		ctx.clip();
		ctx.globalAlpha = 0.85;
		stamp(c, sx, sy, k);
		ctx.restore();
		ctx.globalAlpha = 1;
		ctx.strokeStyle = '#b8955a';
		ctx.lineWidth = Math.max(1, z * 0.8);
		for (const fx of [-0.45, 0.45]) {
			ctx.beginPath();
			ctx.moveTo(sx + w * fx, sy + d / 2);
			ctx.lineTo(sx + w * fx, sy + d / 2 - (top + d / 2) * show);
			ctx.stroke();
		}
		bar(sx, sy - c.ay * k - 4, Math.min(60 * z, w), b.prog, '#e6b947');
		if (b.owner === 0 && !G.units.some((u) => u.rep === b && u.job === 'repair'))
			idleMark(sx, sy - c.ay * k - 8, z * 1.2);
		return;
	}
	const fa = G.t - (b.doneT ?? -99);
	stamp(c, sx, sy, k * popC(fa / 0.6));
	if (fa < 8 && !lessMotion) {
		ctx.globalCompositeOperation = 'lighter';
		ctx.globalAlpha = 0.32 * (1 - fa / 8);
		stamp(c, sx, sy, k);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'source-over';
	} // fresh buildings glow, then cool
	if (b.node && b.node.farm === b && b.owner === 0) {
		// who works a field: a dot a place, filled when someone is there
		const n = b.node,
			slots = slotsOf(n),
			w = B.fp * NAVC * z,
			y = sy + (w * TILT) / 2 + 6 * z,
			r = Math.max(3, 3.4 * z),
			gap = r * 2.8;
		ctx.lineWidth = 1.2;
		for (let i = 0; i < slots; i++) {
			const x = sx + (i - (slots - 1) / 2) * gap;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 7);
			ctx.fillStyle = i < (n.wk || 0) ? '#f2e3b0' : 'rgba(18,23,21,.55)';
			ctx.fill();
			ctx.strokeStyle = 'rgba(18,23,21,.9)';
			ctx.stroke();
		}
	}
	if (b.owner === 0 && G.rdy && G.rdy.get(b.kind) && !b.q.some((j) => j.tech || j.age))
		researchBadge(
			sx - B.fp * NAVC * z * 0.3,
			sy - (B.h * 1.2 + 6) * z - 10 * Math.max(0.9, z * 0.6),
			Math.max(0.9, z * 0.6),
			G.rdy.get(b.kind),
		); // a parchment tab with a book and how many researches wait here
	if (b.kind === 'mill' && !lessMotion) {
		ctx.strokeStyle = '#efe6cf';
		ctx.lineWidth = 1.6 * z;
		const cx = sx,
			cy = sy - 26 * z,
			a = G.t;
		ctx.beginPath();
		for (let i = 0; i < 4; i++) {
			ctx.moveTo(cx, cy);
			ctx.lineTo(cx + Math.cos(a + i * 1.571) * 13 * z, cy + Math.sin(a + i * 1.571) * 13 * z);
		}
		ctx.stroke();
	}
	if (CHIMNEY[b.kind]) {
		const [dx, h] = CHIMNEY[b.kind];
		smoke(sx + dx * z, sy - h * z, b.id, z);
	}
	blaze(b, sx, sy, z);
	if (b.owner === 0 && B.crop && b.node && !(b.node.wk > 0)) idleMark(sx, sy, z * 1.2);
	const M = maxHpB(b.owner, b.kind);
	if (b.hp < M - 1) bar(sx, sy - c.ay * k - 4, Math.min(60 * z, B.fp * NAVC * z), b.hp / M, G.P[b.owner].color);
	if (G.wonder && G.wonder.id === b.id) {
		ctx.font = '700 ' + Math.max(12, 12 * z) + 'px ' + fontF();
		ctx.fillStyle = '#ffd35e';
		ctx.textAlign = 'center';
		ctx.fillText(clock(Math.max(0, G.wonder.end - G.t)), sx, sy - c.ay * k - 10);
		ctx.textAlign = 'left';
	}
}
const CHIMNEY = { house: [6.2, 26], smith: [9, 28], keep: [-20, 44], foundry: [9, 34] };
function smoke(x, y, seed, z) {
	if (lessMotion) return;
	for (let i = 0; i < 3; i++) {
		const ph = (G.t * 0.35 + i / 3 + seed * 0.37) % 1,
			r = (2 + ph * 5) * z;
		ctx.fillStyle = `rgba(215,215,210,${0.3 * (1 - ph)})`;
		ctx.beginPath();
		ctx.arc(x + ph * 7 * z, y - ph * 24 * z, r, 0, 7);
		ctx.fill();
	}
}
// fire when a building is badly hurt, dark smoke when sabotage has stalled it
function blaze(b, x, y, z) {
	if (lessMotion) return;
	const low = b.hp < maxHpB(b.owner, b.kind) * 0.5 || b.fire > 0,
		stalled = (b.stall || 0) > G.t,
		w = BLD[b.kind].fp * NAVC * z;
	if (!low && !stalled) return;
	const top = y - BLD[b.kind].h * 0.7 * z;
	if (low)
		for (let i = 0; i < 3; i++) {
			const ph = (G.t * 2.2 + i * 0.33 + b.id * 0.17) % 1,
				fx = x + (i - 1) * w * 0.25,
				r = (3.5 - ph * 2) * z + 1;
			ctx.fillStyle = `rgba(${ph < 0.5 ? '250,150,40' : '230,70,30'},${0.9 - ph * 0.6})`;
			ctx.beginPath();
			ctx.arc(fx, top - ph * 9 * z, r, 0, 7);
			ctx.fill();
		}
	for (let i = 0; i < 3; i++) {
		const ph = (G.t * 0.4 + i / 3 + b.id * 0.29) % 1;
		ctx.fillStyle = `rgba(60,58,56,${0.45 * (1 - ph)})`;
		ctx.beginPath();
		ctx.arc(x + ph * 6 * z, top - 6 * z - ph * 26 * z, (2 + ph * 5) * z, 0, 7);
		ctx.fill();
	}
}
const RIPS = [];
function ripple(x, y, col) {
	RIPS.push({ x, y, col, t: performance.now() });
}
// ── theatrics: one pop curve, three sizes of celebration. 1 a building is finished, 2 an upgrade rolls through an army, 3 a new age, a wonder or a victory.
const popC = (a) => (a >= 1 || a < 0 ? 1 : 1 + 0.16 * Math.sin(a * Math.PI) * (1 - a)); // swell and settle; a runs 0 to 1
function celebrate(size, x, y, hit) {
	if (G.t - (G.celT ?? -9) < 0.34 && size < 3) return;
	G.celT = G.t; // calm: never two in the same blink
	ripple(x, y, size === 1 ? '#ffd35e' : '#fff3c4');
	if (size === 2 && hit) {
		const L = G.units.filter(hit).sort((a, b) => a.x - b.x),
			step = Math.min(0.06, 1.2 / Math.max(1, L.length));
		L.forEach((u, i) => {
			u.glowT = G.t + i * step;
		});
	}
	if (size === 3) {
		G.whiteT = G.t;
		feel('crack');
	}
}
function ripDraw() {
	const now = performance.now(),
		z = cam.z;
	for (let i = RIPS.length - 1; i >= 0; i--) {
		const a = (now - RIPS[i].t) / 600;
		if (a >= 1) {
			RIPS.splice(i, 1);
			continue;
		}
		ctx.strokeStyle = RIPS[i].col;
		ctx.globalAlpha = 1 - a;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.ellipse(SX(RIPS[i].x), SY(RIPS[i].y), (6 + a * 18) * z, (6 + a * 18) * z * TILT, 0, 0, 7);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
}
function sparkDraw() {
	if (!SPARKS.length) return;
	const z = cam.z;
	SPARKS = SPARKS.filter((k) => {
		const a = G.t - k.t;
		return a >= 0 && a < 0.3;
	});
	for (const k of SPARKS) {
		const a = (G.t - k.t) / 0.3,
			x = SX(k.x),
			y = SY(k.y) - 6 * z;
		ctx.strokeStyle = `rgba(255,${(200 - a * 80) | 0},90,${1 - a})`;
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		for (let i = 0; i < 5; i++) {
			const an = i * 1.26 + k.t * 7;
			ctx.moveTo(x + Math.cos(an) * 2 * z, y + Math.sin(an) * 2 * z);
			ctx.lineTo(x + Math.cos(an) * (3 + a * 6) * z, y + Math.sin(an) * (3 + a * 6) * z);
		}
		ctx.stroke();
	}
}
// Three translucent casts (warm dusk, blue night, the weather) laid one over another come to one colour: computed once a frame, painted once.
const WX_TINT = { drought: [210, 160, 60, 0.1], rain: [20, 30, 50, 0.12], frost: [230, 240, 250, 0.14] };
const tintC = { k: '', s: '' };
function tintOf(dusk, nt) {
	let r = 0,
		g = 0,
		b = 0,
		a = 0;
	const lay = (cr, cg, cb, ca) => {
		if (ca <= 0) return;
		const na = a + ca - a * ca;
		r = (r * a * (1 - ca) + cr * ca) / na;
		g = (g * a * (1 - ca) + cg * ca) / na;
		b = (b * a * (1 - ca) + cb * ca) / na;
		a = na;
	};
	if (dusk > 0.02) lay(255, 140, 60, 0.13 * dusk);
	if (nt > 0) lay(10, 18, 48, 0.4 * nt * (1.15 - 0.3 * moonLight())); // darker toward the new moon
	const w = WX_TINT[G.wx];
	if (w) lay(w[0], w[1], w[2], w[3]);
	if (a <= 0.002) return '';
	const k = `${r | 0},${g | 0},${b | 0},${Math.round(a * 200)}`;
	if (tintC.k !== k) {
		tintC.k = k;
		tintC.s = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
	}
	return tintC.s;
}
const NV = { ref: null, len: 0, key: '', arr: [] };
function viewNodes(a, b, far) {
	// the nodes on screen, sorted back to front; rebuilt only when the view moves 40 units or a node comes or goes
	const q = (v) => Math.floor(v / 40),
		key = `${q(a.x)},${q(a.y)},${q(b.x)},${q(b.y)},${far}`;
	if (NV.ref !== G.nodes || NV.len !== G.nodes.length || NV.key !== key) {
		const x0 = q(a.x) * 40,
			y0 = q(a.y) * 40,
			x1 = (q(b.x) + 1) * 40,
			y1 = (q(b.y) + 1) * 40;
		NV.arr = G.nodes
			.filter((n) => n.kind !== 'farm' && !(far && n.kind === 'tree') && n.x > x0 && n.x < x1 && n.y > y0 && n.y < y1)
			.sort((p, r) => p.y - r.y);
		NV.ref = G.nodes;
		NV.len = G.nodes.length;
		NV.key = key;
	}
	return NV.arr;
}
function drawNode(n, s) {
	const z = cam.z,
		sx = SX(n.x),
		sy = SY(n.y);
	if (n.kind === 'fish') {
		if (lessMotion) return;
		const ph = (G.t * 0.5 + n.id * 0.13) % 1;
		ctx.strokeStyle = `rgba(225,242,255,${0.6 * (1 - ph)})`;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.ellipse(sx, sy, (3 + ph * 6) * z, (1.5 + ph * 3) * z * TILT, 0, 0, 7);
		ctx.stroke();
		return;
	}
	if (n.kind === 'meat') {
		ctx.fillStyle = '#8a3a2a';
		ctx.beginPath();
		ctx.ellipse(sx, sy, 5 * z, 2.6 * z, 0, 0, 7);
		ctx.fill();
		ctx.fillStyle = '#e8d8c0';
		ctx.fillRect(sx - 1 * z, sy - 3 * z, 2 * z, 3 * z);
		return;
	}
	const f = (0.6 + 0.4 * Math.min(1, n.amt / n.max)) * (n.kind === 'tree' ? 1.4 : 1),
		c = nodeSprite(n, s),
		k = (z / s) * f; // trees drawn as wide as the ground they block
	stamp(c, sx, sy, k);
}
const workOf = (u) =>
	u.job === 'repair'
		? 5
		: !u.node
			? 0
			: u.node.kind === 'fish'
				? 4
				: u.node.kind === 'bush' || u.node.kind === 'meat'
					? 1
					: u.node.kind === 'stone' || u.node.kind === 'gold' || u.node.kind === 'iron'
						? 2
						: u.node.kind === 'farm'
							? u.node.type === 'wood'
								? 0
								: 3
							: 0; // which work a villager is doing: chop, forage, mine, farm, fish, mend
function drawUnit(u, s) {
	// a woodcutter leans in to its tree while it chops: the tree's ground keeps it 20 away, so it is drawn up to 12 closer (drawing only; the game does not move it)
	{
		const n = u.node,
			on = u.kind === 'vil' && n && n.kind === 'tree' && u.work && G.t - u.work < 0.25;
		u.lean = clamp((u.lean || 0) + (on ? 0.08 : -0.08), 0, 1);
	}
	const ln = u.lean && u.node ? (Math.min(12, Math.max(0, dist(u, u.node) - 10)) * u.lean) / (dist(u, u.node) || 1) : 0,
		ux = u.node ? u.x + (u.node.x - u.x) * ln : u.x,
		uy = u.node ? u.y + (u.node.y - u.y) * ln : u.y;
	const z = cam.z,
		sx = SX(ux),
		sy = SY(uy) - (u.fly || 0) * z,
		U = UNIT[u.kind],
		col = G.P[u.owner].color,
		st = u.owner === WILD ? null : stats(u.owner, u.kind);
	const moving = G.t - (u.mvT || -9) < 0.15,
		working = u.work && G.t - u.work < 0.25;
	const fr =
		G.t - (u.hitT || -9) < 0.25
			? 3
			: moving
				? 1 + ((((G.t * 6) | 0) + u.id) % 2)
				: working
					? U.look === 'vil'
						? 10 + workOf(u) * 2 + ((((G.t * 2.5) | 0) + u.id) % 2)
						: 1 + ((((G.t * 6) | 0) + u.id) % 2)
					: 0;
	if (z < 0.3) {
		const big = (LOOKBOX[U.look] || [26])[0];
		ctx.fillStyle = u.owner === WILD ? '#c9b48a' : col;
		const r = Math.max(1.8, big * 0.07 * z * FIG);
		ctx.fillRect(sx - r, sy - r * 1.6, r * 2, r * 2);
		return;
	} // seen from far away a person is a dot of their colour
	const c = sprite(
			U.look,
			col,
			st ? st.tier : u.tier || 0,
			fr,
			s,
			st && U.tick === 'sol' && !hasTag(u.kind, 'siege') ? st.kit : 0,
		),
		k = (z * FIG) / s,
		big = (LOOKBOX[U.look] || [26])[0];
	ctx.fillStyle = 'rgba(0,0,0,.28)';
	ctx.beginPath();
	ctx.ellipse(sx, sy, big * 0.28 * z * FIG + 2, 2.4 * z + 1, 0, 0, 7);
	ctx.fill();
	if (u.owner === 0 && G.sel !== 'all' && u.bn === G.sel) {
		ctx.strokeStyle = '#ffd35e';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.ellipse(sx, sy, 7 * z + 2, 3.4 * z + 1, 0, 0, 7);
		ctx.stroke();
	}
	if (u.owner !== WILD) {
		ctx.fillStyle = col;
		ctx.beginPath();
		ctx.ellipse(sx, sy, 3.4 * z + 1, 1.6 * z + 0.6, 0, 0, 7);
		ctx.fill();
	}
	stamp(c, sx, sy, k * popC((G.t - (u.bornT ?? -9)) / 0.4), (u.fx || 1) < 0);
	{
		const ga = G.t - (u.glowT ?? -9);
		if (ga >= 0 && ga < 0.6) {
			ctx.globalCompositeOperation = 'lighter';
			ctx.globalAlpha = 0.7 * Math.sin((ga / 0.6) * Math.PI);
			stamp(c, sx, sy, k, (u.fx || 1) < 0);
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = 'source-over';
		}
	} // an upgrade rolling through the army
	if (G.t - (u.flashT || -9) < 0.12) {
		ctx.globalCompositeOperation = 'lighter';
		ctx.globalAlpha = 0.55;
		stamp(c, sx, sy, k, (u.fx || 1) < 0);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'source-over';
	}
	const top =
		sy - (U.look === 'stower' ? 32 : U.look === 'treb' ? 26 : U.look === 'elephant' ? 22 : big > 34 ? 18 : 13) * z;
	if (u.carry > 0) {
		ctx.fillStyle = (RESOURCES[u.carryType] || GOODS[u.carryType] || RESOURCES.food).col;
		ctx.beginPath();
		ctx.arc(sx - 3 * z * ((u.fx || 1) < 0 ? -1 : 1), sy - 7 * z, 2 * z + 0.5, 0, 7);
		ctx.fill();
	}
	if (u.zeal > G.t) {
		ctx.strokeStyle = 'rgba(244,206,90,.85)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.ellipse(sx, sy - 6 * z, 8 * z, 9 * z, 0, 0, 7);
		ctx.stroke();
	}
	if (u.hp < u.max - 0.5 && z > 0.45)
		bar(sx, top - 5, Math.max(12, 12 * z), u.hp / u.max, u.owner === WILD ? '#c9b48a' : col);
	if (isSoldier(u) && u.mor < 0.6 && z > 0.45 && u.state !== 'rout')
		bar(sx, top - 10, Math.max(12, 12 * z), u.mor, '#f2cf55'); // nerve, when it is low
	if (u.state === 'rout') {
		ctx.strokeStyle = '#2b2b2b';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(sx + 5 * z, sy - 6 * z);
		ctx.lineTo(sx + 5 * z, sy - 20 * z);
		ctx.stroke();
		ctx.fillStyle = '#f4f0e6';
		ctx.beginPath();
		ctx.moveTo(sx + 5 * z, sy - 20 * z);
		ctx.lineTo(sx + 13 * z, sy - 17 * z);
		ctx.lineTo(sx + 5 * z, sy - 14 * z);
		ctx.closePath();
		ctx.fill();
	} // a white flag: broken, running
	if (u.state === 'convert' && u.cvT > 0) {
		ctx.strokeStyle = 'rgba(244,206,90,.9)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(
			sx,
			sy - 6 * z,
			9 * z,
			-Math.PI / 2,
			-Math.PI / 2 + (6.28 * u.cvT) / (CONVERT.secs * fxv(u.owner, 'convert').m),
		);
		ctx.stroke();
	} // the conversion, filling
	if (u.owner === 0 && u.idle) idleMark(sx, top, z);
	if (u.sick > G.t) {
		ctx.fillStyle = u.plague ? '#7a3a8a' : '#7aa04a';
		ctx.beginPath();
		ctx.arc(sx - 5 * z, top - 2, 2 * z + 1, 0, 7);
		ctx.fill();
	}
	if (u.kind === 'caravan' && u.goods) {
		const k = Object.keys(u.goods).find((k) => u.goods[k] > 0);
		if (k) {
			ctx.fillStyle = GOODS[k].col;
			ctx.fillRect(sx - 4 * z, sy - 12 * z, 5 * z, 3 * z);
		}
	}
}
function drawFind(f) {
	const z = cam.z,
		x = SX(f.x),
		y = SY(f.y),
		F = FINDS[f.kind];
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(z, z);
	g = ctx;
	ctx.lineJoin = 'round';
	if (f.kind === 'chest') {
		E_(0, 1, 7, 2.4, 'rgba(0,0,0,.3)');
		P_(
			[
				[-5, 0],
				[5, 0],
				[5, -5],
				[-5, -5],
			],
			'#7a4e24',
			INK,
			0.5,
		);
		P_(
			[
				[-5, -5],
				[5, -5],
				[4, -8],
				[-4, -8],
			],
			'#8a5a2a',
			INK,
			0.5,
		);
		L_(-5, -3, 5, -3, '#c9a227', 0.8);
		E_(0, -4.4, 1, 1, '#f2cf55');
	} else if (f.kind === 'ruins') {
		for (const [dx, h] of [
			[-10, 14],
			[-4, 8],
			[3, 16],
			[9, 5],
		]) {
			P_(
				[
					[dx - 1.6, 0],
					[dx + 1.6, 0],
					[dx + 1.6, -h],
					[dx - 1.6, -h],
				],
				LG(dx - 2, 0, dx + 2, 0, ['#e0d8c4', '#a89e88']),
				INK,
				0.4,
			);
		}
		P_(
			[
				[-12, -14],
				[5, -16.5],
				[5, -18],
				[-12, -15.6],
			],
			'#d0c8b2',
			INK,
			0.4,
		);
		P_(
			[
				[-6, 1],
				[2, 1],
				[1, -2],
				[-5, -2],
			],
			'#b8b0a0',
			INK,
			0.4,
		);
	} else if (f.kind === 'cemetery') {
		for (let i = 0; i < 6; i++) {
			const dx = -12 + (i % 3) * 10,
				dy = -3 + Math.floor(i / 3) * 6;
			P_(
				[
					[dx - 1.8, dy],
					[dx + 1.8, dy],
					[dx + 1.8, dy - 4],
					[dx, dy - 5.4],
					[dx - 1.8, dy - 4],
				],
				'#9a9890',
				INK,
				0.4,
			);
		}
		L_(-16, 6, 16, 6, '#3a3028', 0.6);
		for (let x = -16; x <= 16; x += 4) L_(x, 6, x, 2, '#3a3028', 0.6);
	} else if (f.kind === 'camp') {
		for (const [dx, col] of [
			[-9, '#7a6a50'],
			[8, '#6a5a44'],
		])
			P_(
				[
					[dx - 6, 0],
					[dx + 6, 0],
					[dx, -9],
				],
				col,
				INK,
				0.5,
			);
		E_(0, 2, 3, 1.2, '#3a2a1a');
		if (!lessMotion) {
			const ph = (G.t * 3) % 1;
			E_(0, 0, 1.6, 2.4 + ph, 'rgba(250,150,40,.85)');
		}
		L_(14, 2, 14, -14, '#3a2a1a', 0.6);
		P_(
			[
				[14, -14],
				[20, -12.6],
				[14, -11],
			],
			'#2a2a2a',
		);
	} else if (f.kind === 'den') {
		P_(
			[
				[-12, 1],
				[-9, -8],
				[0, -12],
				[10, -7],
				[13, 1],
			],
			LG(0, -12, 0, 1, ['#8a8478', '#5a5650']),
			INK,
			0.5,
		);
		E_(0, -2, 4.4, 4, '#1a1612');
	} else if (f.kind === 'shrine') {
		// the shrine inside the Throne: three steps, four columns, a gold dome, the flame; the holder's colour on the dome's finial
		const oc = f.owner !== null ? G.P[f.owner].color : '#d8cdb4';
		for (let k = 0; k < 3; k++)
			P_(
				[
					[-10 + k * 2, 2 - k * 1.6],
					[10 - k * 2, 2 - k * 1.6],
					[10 - k * 2, 0.4 - k * 1.6],
					[-10 + k * 2, 0.4 - k * 1.6],
				],
				k % 2 ? '#c8bda0' : '#b8ac92',
				INK,
				0.35,
			);
		for (const cx of [-6, -2, 2, 6]) {
			L_(cx, -3, cx, -11, '#e8e0c8', 1.6);
			L_(cx, -3, cx, -11, 'rgba(90,70,40,.35)', 0.5);
		}
		P_(
			[
				[-8, -11],
				[8, -11],
				[8, -12.4],
				[-8, -12.4],
			],
			'#d8cdb4',
			INK,
			0.35,
		);
		E_(0, -12.4, 7, 4.2, LG(-7, 0, 7, 0, ['#f2d27a', '#c9a227', '#8a6a1a']), INK, 0.4);
		ctx.save();
		ctx.beginPath();
		ctx.rect(-8, -17, 16, 4.6);
		ctx.clip();
		E_(0, -12.4, 7, 4.2, LG(-7, 0, 7, 0, ['#f2d27a', '#c9a227', '#8a6a1a']), INK, 0.4);
		ctx.restore();
		L_(0, -16.6, 0, -19.5, '#8a6a1a', 0.8);
		E_(0, -20, 1.3, 1.3, oc, INK, 0.3);
		if (!lessMotion) E_(0, -6, 1.6, 2.4 + Math.sin(G.t * 6) * 0.5, 'rgba(255,190,70,.9)');
		if (f.cap) {
			const t = f.cap.t / F.capture;
			ctx.strokeStyle = G.P[f.cap.o].color;
			ctx.lineWidth = 1.4;
			ctx.beginPath();
			ctx.arc(0, -8, 12, -Math.PI / 2, -Math.PI / 2 + t * 6.28);
			ctx.stroke();
		}
	} else if (f.kind === 'stop') {
		if (!postAt(f)) {
			// a bazaar stall: striped awning on two poles, a table of goods with the wanted one in front, the holder's pennant
			const oc = f.owner !== null ? G.P[f.owner].color : '#d8c79c';
			L_(-9, 2, -9, -11, '#5a3a1c', 1);
			L_(9, 2, 9, -11, '#5a3a1c', 1);
			for (let k = 0; k < 6; k++)
				P_(
					[
						[-11 + k * 3.7, -11],
						[-7.3 + k * 3.7, -11],
						[-7.3 + k * 3.7 + 1, -14.5],
						[-11 + k * 3.7 + 1, -14.5],
					],
					k % 2 ? '#efe6d0' : oc,
					null,
				);
			P_(
				[
					[-11, -11],
					[11, -11],
					[12, -14.5],
					[-10, -14.5],
				],
				null,
				INK,
				0.4,
			);
			for (let k = 0; k < 6; k++)
				P_(
					[
						[-11 + k * 3.7, -11],
						[-9.2 + k * 3.7, -9.4],
						[-7.3 + k * 3.7, -11],
					],
					k % 2 ? '#efe6d0' : oc,
					INK,
					0.3,
				);
			P_(
				[
					[-8, 1],
					[8, 1],
					[8, -3],
					[-8, -3],
				],
				'#8a5d34',
				INK,
				0.4,
			);
			L_(-7, 1, -7, 3, '#5a3a1c', 0.8);
			L_(7, 1, 7, 3, '#5a3a1c', 0.8);
			{
				const ks = Object.keys(GOODS)
					.filter((k) => k !== f.want)
					.slice(0, 2);
				E_(-4.5, -4, 2.2, 1.4, GOODS[ks[0]].col, INK, 0.3);
				E_(4.5, -4, 2.2, 1.4, GOODS[ks[1] || ks[0]].col, INK, 0.3);
				E_(0, -2.2, 2.8, 1.8, GOODS[f.want].col, INK, 0.4);
			}
			L_(12, -11, 12, -20, '#5a3a1c', 0.8);
			P_(
				[
					[12, -20],
					[19, -18.6],
					[12, -17],
				],
				oc,
				INK,
				0.4,
			);
		}
	} else if (f.kind === 'vagabonds') {
		if (!f.done) {
			E_(0, 2, 3, 1.2, '#3a2a1a');
			if (!lessMotion) E_(0, 0, 1.4, 2.2, 'rgba(250,150,40,.85)');
			P_(
				[
					[-10, 3],
					[-4, 3],
					[-4, 1],
					[-10, 1],
				],
				'#6b4a3a',
			);
			P_(
				[
					[5, 4],
					[11, 4],
					[11, 2],
					[5, 2],
				],
				'#4a5a6a',
			);
		}
	}
	ctx.restore();
	g = null;
}
// what the finger holds: a ring on the ground under each, green for yours, red for a foe's, gold for the wild and the land
function drawPicks(z) {
	if (!G.pickE || !G.pickE.length) return;
	ctx.lineWidth = 2;
	ctx.setLineDash([]);
	for (const e of G.pickE) {
		if (e.hp !== undefined && e.hp <= 0) continue;
		if (e.amt !== undefined && e.amt <= 0 && !e.farm) continue;
		const own = e.owner,
			r = e.q ? halfOf(e) + 6 : e.kind && FINDS[e.kind] ? 18 : 9;
		ctx.strokeStyle = own === 0 ? '#5ad27a' : own === undefined || own === null || own === WILD ? '#ffd35e' : '#ff6a52';
		ctx.beginPath();
		ctx.ellipse(SX(e.x), SY(e.y), r * z + 3, r * z * TILT + 2, 0, 0, 7);
		ctx.stroke();
	}
}
const rnd2 = () => Math.random() * 2 - 1;
