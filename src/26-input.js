// ═════ 26-input.js: the finger: tap, hold, box, pick ═════
// ───────────────────────── Touch: drag to look, pinch to zoom, tap to ask, press and slide to place ─────────────────────────
const ptrs = new Map();
let drag = null,
	pinch = null;
const HOLD_MS = 320,
	DBL_MS = 320;
let holdT = 0; // hold a finger: on one of yours, pick it and keep picking; on open ground, then drag: a box
const holdStop = () => {
	clearTimeout(holdT);
	G.press = null;
};
const lp = (e) => {
	const r = cv.getBoundingClientRect();
	return { x: e.clientX - r.left, y: e.clientY - r.top };
};
let EDGE = null; // where the finger is while it drags the ghost: near the screen edge the map scrolls
function edgeScroll(dt) {
	if (!EDGE || !G.place || !drag || drag.mode !== 'place') return;
	const m = 48,
		vx = EDGE.x < m ? -1 : EDGE.x > cw - m ? 1 : 0,
		vy = EDGE.y < m ? -1 : EDGE.y > ch - m ? 1 : 0;
	if (!vx && !vy) return;
	cam.x += (vx * 320 * dt) / cam.z;
	cam.y += (vy * 320 * dt) / (cam.z * TILT);
	clampCam();
	ghostAt(EDGE, drag.touch);
}
const LIFT = 64; // on a phone the building waits this far above your finger, so you can see it
// A wall is a list of corners: tap to add one, drag a corner to move it, drag the wall to slide all of it. `pl.cells` is every square of it.
const wallSnap = (prev, c) => {
	if (!prev) return c;
	const dx = c.gx - prev.gx,
		dy = c.gy - prev.gy;
	if (Math.abs(dy) * 3 < Math.abs(dx)) return { gx: c.gx, gy: prev.gy }; // nearly flat or upright: make it so
	if (Math.abs(dx) * 3 < Math.abs(dy)) return { gx: prev.gx, gy: c.gy };
	return c;
};
function wallSet(pl) {
	const P = pl.pts;
	pl.cells = P.length > 1 ? P.slice(1).flatMap((c, i) => wallLine(P[i], c).slice(i ? 1 : 0)) : P.slice();
	pl.at = P.length ? { x: P[P.length - 1].gx * NAVC + 5, y: P[P.length - 1].gy * NAVC + 5 } : null;
}
const wallXY = (c) => ({ x: SX(c.gx * NAVC + 5), y: SY(c.gy * NAVC + 5) });
function wallHit(pl, p) {
	const R = 24,
		P = pl.pts.map(wallXY);
	const i = P.findIndex((q) => hyp(q.x - p.x, q.y - p.y) < R);
	if (i >= 0) return { mode: 'wpt', i };
	for (let j = 1; j < P.length; j++) {
		const a = P[j - 1],
			b = P[j],
			l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2 || 1,
			t = clamp(((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2, 0, 1);
		if (hyp(p.x - (a.x + t * (b.x - a.x)), p.y - (a.y + t * (b.y - a.y))) < R) return { mode: 'wall' };
	}
	return null;
}
function ghostAt(p, touch) {
	const pl = G.place,
		w = toWorld(p.x, p.y - (touch ? LIFT : 0));
	pl.at = snapGhost(0, pl.kind, w.x, w.y, Math.max(14, 26 / cam.z));
}
function wallDrag(d, p) {
	const pl = G.place,
		c = toCell(toWorld(p.x, p.y));
	if (d.mode === 'wpt') pl.pts[d.i] = wallSnap(pl.pts[d.i - 1] || pl.pts[d.i + 1], c);
	else {
		const dx = c.gx - d.c0.gx,
			dy = c.gy - d.c0.gy;
		pl.pts = d.pts0.map((q) => ({ gx: clamp(q.gx + dx, 0, NC - 1), gy: clamp(q.gy + dy, 0, NC - 1) }));
	}
	wallSet(pl);
}
cv.addEventListener('pointerdown', (e) => {
	hideQuick();
	holdStop();
	try {
		cv.setPointerCapture(e.pointerId);
	} catch (err) {}
	const p = lp(e);
	ptrs.set(e.pointerId, p);
	if (ptrs.size >= 2) {
		drag = null;
		const [a, b] = [...ptrs.values()];
		pinch = { d: hyp(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
		return;
	}
	if (G.place && G.place.kind === 'wall') {
		const h = wallHit(G.place, p);
		drag = h
			? { ...h, p0: p, c0: toCell(toWorld(p.x, p.y)), pts0: G.place.pts.map((q) => ({ ...q })), touch: true }
			: { mode: 'pan', x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, touch: true }; // on a corner or the wall: move it; elsewhere: look around, and a tap adds a corner
		return;
	}
	if (G.place) {
		const touch = e.pointerType !== 'mouse',
			at = G.place.at,
			gx = at ? SX(at.x) : 0,
			gy = at ? SY(at.y) : 0,
			nearGhost =
				!at ||
				Math.min(hyp(p.x - gx, p.y - gy), hyp(p.x - gx, p.y - (touch ? LIFT : 0) - gy)) <
					Math.max(70, BLD[G.place.kind].fp * NAVC * cam.z * 0.7);
		if (nearGhost) {
			ghostAt(p, touch);
			drag = { mode: 'place', touch };
			EDGE = p;
			ui(true);
			return;
		}
		drag = { mode: 'pan', x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, touch }; // away from the ghost: drag looks around; a tap moves the ghost there
		return;
	}
	drag = { mode: 'pan', x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false };
	G.press = { x: p.x, y: p.y, t: performance.now() };
	holdT = setTimeout(() => {
		const d = drag;
		if (!(d && d.mode === 'pan' && !d.moved && G.press)) return;
		feel('snap');
		if (aimNear(G.press.x, G.press.y)) {
			G.hud.drag = true;
			drag = { mode: 'ret' };
			G.press = null;
			return;
		} // held on the crosshair: it is yours to drag
		const h = hitAt(G.press.x, G.press.y);
		if (h.t === 'unit' && h.e.owner === 0) {
			G.pickMore = true;
			pickToggle(h.e, true);
			drag = null;
			G.press = null;
			ui(true);
			return;
		} // held on one of yours: it is picked, and the next taps add more
		drag = { mode: 'box', x0: G.press.x, y0: G.press.y, x1: G.press.x, y1: G.press.y };
		G.box = drag;
		G.press = null;
	}, HOLD_MS);
});
cv.addEventListener('pointermove', (e) => {
	const p = lp(e);
	if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, p);
	if (pinch && ptrs.size >= 2) {
		const [a, b] = [...ptrs.values()],
			d = hyp(a.x - b.x, a.y - b.y) || 1,
			mx = (a.x + b.x) / 2,
			my = (a.y + b.y) / 2;
		if (G) G.follow = false; // a pinch is yours: the camera stops following
		camStop();
		zoomAt((cam.z * d) / pinch.d, mx, my);
		cam.x -= (mx - pinch.mx) / cam.z;
		cam.y -= (my - pinch.my) / (cam.z * TILT);
		clampCam();
		pinch.d = d;
		pinch.mx = mx;
		pinch.my = my;
		return;
	}
	if (drag && drag.mode === 'ret') {
		aimSpot(p.x, p.y);
		return;
	}
	if (drag && drag.mode === 'box') {
		drag.x1 = p.x;
		drag.y1 = p.y;
		return;
	}
	if (drag && (drag.mode === 'wpt' || drag.mode === 'wall')) {
		wallDrag(drag, p);
		return;
	}
	if (G.place && drag && drag.mode === 'place') {
		ghostAt(p, drag.touch);
		EDGE = p;
		return;
	}
	if (G.place && !drag && e.pointerType === 'mouse' && G.place.kind !== 'wall') {
		ghostAt(p, false);
		return;
	}
	if (!drag || drag.mode !== 'pan') return;
	const dx = e.clientX - drag.x,
		dy = e.clientY - drag.y;
	if (!drag.moved && hyp(dx, dy) > 8) {
		drag.moved = true;
		holdStop();
	}
	if (drag.moved) {
		if (G) G.follow = false; // a drag is yours too
		camStop();
		cam.x = drag.cx - dx / cam.z;
		cam.y = drag.cy - dy / (cam.z * TILT);
		clampCam();
	}
});
cv.addEventListener('pointerup', (e) => {
	ptrs.delete(e.pointerId);
	holdStop();
	if (pinch) {
		if (ptrs.size < 2) pinch = null;
		drag = null;
		return;
	}
	const d = drag;
	drag = null;
	if (!d) return;
	EDGE = null;
	if (d.mode === 'ret') {
		G.hud.drag = false;
		ui(true);
		return;
	}
	if (d.mode === 'box') {
		G.box = null;
		if (Math.abs(d.x1 - d.x0) < 12 && Math.abs(d.y1 - d.y0) < 12) {
			const q = lp(e);
			tapAt(q.x, q.y);
		} else boxPick(d);
		ui(true);
		return;
	} // held on open ground but never dragged: it was a tap
	if (d.mode === 'place' || d.mode === 'wpt' || d.mode === 'wall') {
		ui(true);
		return;
	} // it waits: drag again to adjust, or tap Build
	if (d.moved) return;
	const p = lp(e);
	if (G.place) {
		const pl = G.place;
		if (pl.kind === 'wall') {
			pl.pts.push(wallSnap(pl.pts[pl.pts.length - 1], toCell(toWorld(p.x, p.y)))); // a tap: the next corner, exactly where the finger is
			wallSet(pl);
		} else ghostAt(p, d.touch);
		ui(true);
		return;
	}
	tapAt(p.x, p.y);
});
cv.addEventListener('pointercancel', (e) => {
	EDGE = null;
	if (G.hud) G.hud.drag = false;
	holdStop();
	G.box = null;
	ptrs.delete(e.pointerId);
	if (ptrs.size < 2) pinch = null;
	drag = null;
});
cv.addEventListener(
	'wheel',
	(e) => {
		e.preventDefault();
		const p = lp(e);
		if (G) G.follow = false;
		zoomAt(cam.z * Math.exp(-e.deltaY * 0.0015), p.x, p.y);
	},
	{ passive: false },
);
['gesturestart', 'gesturechange', 'gestureend'].forEach((t) => document.addEventListener(t, (e) => e.preventDefault()));
mini.addEventListener('pointerdown', (e) => {
	e.stopPropagation();
	if (G) G.follow = false;
	const r = mini.getBoundingClientRect();
	camGo(((e.clientX - r.left) / r.width) * MAP, ((e.clientY - r.top) / r.height) * MAP);
});
// what is under the finger: a building (they have height), a find, a unit, a resource, else the ground
function hitAt(sx, sy) {
	const z = cam.z;
	let foot = null,
		roof = null,
		fy = -1e9,
		ry = -1e9;
	{
		let u = null,
			ud = Math.max(16, 9 * z);
		for (const v of G.units)
			if (!v.inside && visibleTo0(v)) {
				const d = hyp(SX(v.x) - sx, SY(v.y) - 6 * z - sy);
				if (d < ud) {
					ud = d;
					u = v;
				}
			}
		if (u) return { t: 'unit', e: u };
	} // a person is the smallest thing under the finger: it wins over the ground it stands on
	for (const b of G.blds) {
		// footprint: the ground it stands on; roof: the height drawn above it
		const B = BLD[b.kind],
			w = Math.max(B.fp * NAVC * z, 22),
			x = SX(b.x),
			gy = SY(b.y),
			d = B.fp * NAVC * z * TILT;
		if ((B.trap && !trapShown(b)) || !knownB(b)) continue;
		if (sx <= x - w / 2 - 4 || sx >= x + w / 2 + 4 || sy >= gy + d / 2 + 4) continue;
		if (sy > gy - d / 2 - 4) {
			if (gy > fy) {
				foot = b;
				fy = gy;
			}
		} else if (sy > gy - d / 2 - (B.h + 8) * z - 10 && gy > ry) {
			roof = b;
			ry = gy;
		}
	}
	if (foot) return { t: 'bld', e: foot };
	const near = (x, y, r) => hyp(SX(x) - sx, SY(y) - 6 * z - sy) < r;
	const f = G.finds.find((f) => !(f.done && FINDS[f.kind].got) && known0(f) && near(f.x, f.y, Math.max(22, 14 * z)));
	if (f) return { t: 'find', e: f };
	if (roof) return { t: 'bld', e: roof };
	let nd = null,
		nr = Math.max(16, 11 * z);
	for (const n of G.nodes)
		if (n.kind !== 'farm') {
			const d = hyp(SX(n.x) - sx, SY(n.y) - 6 * z - sy);
			if (d < nr) {
				nr = d;
				nd = n;
			}
		}
	if (nd) return { t: 'node', e: nd };
	return { t: 'ground', e: toWorld(sx, sy) };
}
const cardFor = (h) =>
	h.t === 'bld'
		? { type: 'bld', id: h.e.id }
		: h.t === 'find'
			? { type: 'find', id: h.e.id }
			: h.t === 'unit'
				? { type: 'unit', id: h.e.id }
				: { type: 'node', id: h.e.id };
// One rule for the finger (Albert, Build 40): a tap picks a unit, a double tap opens its card, a hold does more (picks and keeps picking; on open ground, a box). Buildings and places open on one tap.
// With one or more of yours picked, a tap on anything else is the obvious order, without a menu: attack, hunt, gather, build, mend, walk.
// The order goes at once (Build 40 reviews: a waiting order reads as lag); a second tap on the same thing within a blink opens its card, the order already given.
let lastTap = { key: '', t: 0 };
function tapAt(sx, sy) {
	hideQuick();
	if (G.over) return;
	if (RADAR && hyp(sx - RADAR.sx, sy - RADAR.sy) < 26) {
		G.follow = false;
		camGo(RADAR.x, RADAR.y);
		return;
	}
	if (G.hud.aim) return aimAt(sx, sy); // Aim: the next tap is the target
	const h = hitAt(sx, sy),
		key = h.t === 'ground' ? '' : h.t + h.e.id,
		now = performance.now(),
		dbl = key && key === lastTap.key && now - lastTap.t < DBL_MS;
	lastTap = { key, t: now };
	if (dbl) {
		setPick([]);
		openCard(cardFor(h));
		return;
	}
	if (h.t === 'unit' && h.e.owner === 0 && !h.e.inside) {
		pickToggle(h.e);
		return;
	}
	const mine = picked();
	if (mine.length) {
		order(mine, h);
		if (!mine.some(isSoldier)) setPick([]); // villagers given work are let go of; soldiers keep their orders coming (Build 61, Albert)
		refresh();
		return;
	}
	if (h.t === 'ground') {
		const O = ordAt(sx, sy);
		if (O) {
			ACT.ordpick(String(O.id));
			return;
		} // the ring of a group on the march: tap it to pick the group
		showQuick(sx, sy, h, hazardAt(h.e.x, h.e.y) ? 2 : 1);
		return;
	} // nothing picked: the quick action; on a hazard, straight at its second step
	if ((h.t === 'unit' || h.t === 'bld') && foeOf(h.e)) {
		showQuick(sx, sy, h, 2);
		return;
	} // an enemy: a red ring under it, and the quick action at its second step (MENU-SPEC §7)
	if (
		h.t === 'bld' &&
		h.e.owner === 0 &&
		h.e.node &&
		BLD[h.e.kind].reserve &&
		h.e.node.amt <= 0 &&
		!replantWhy(0, h.e)
	) {
		replant(0, h.e.id);
		sfx('place');
		return;
	} // a plot cut out: one tap replants it (Build 61, Albert); if it cannot be, the tap opens its card, which says why
	if (h.t !== 'unit') {
		setPick([]);
		openCard(cardFor(h));
		return;
	} // a building, a field, a find: nothing to pick, so one tap opens it (Albert, Build 40)
	setPick([{ t: h.t, id: h.e.id }]); // a unit not yours: a ring says what the finger found; a second tap opens its page
}
// the order ring under a finger (tap slop 26 px): the nearest group ring wins
function ordAt(sx, sy) {
	let best = null,
		bd = 26;
	for (const id in G.ords || {}) {
		const O = G.ords[id],
			d = hyp(SX(O.x) - sx, SY(O.y) - sy);
		if (O.n && d < bd) {
			bd = d;
			best = O;
		}
	}
	return best;
}
// what the finger holds
const picked = () =>
	G.pick
		.filter((k) => k.t === 'unit')
		.map((k) => G.units.find((u) => u.id === k.id))
		.filter((u) => u && u.owner === 0 && u.hp > 0 && !u.inside);
const pickObj = (k) =>
	(k.t === 'unit' ? G.units : k.t === 'bld' ? G.blds : k.t === 'find' ? G.finds : G.nodes).find((e) => e.id === k.id);
function setPick(list) {
	G.pick = list;
	G.pickSet = new Set(list.map((k) => k.t + k.id));
	G.pickE = list.map(pickObj).filter(Boolean);
	if (!list.length) G.pickMore = false;
	ui(true);
}
function pickToggle(u, hold) {
	const k = { t: 'unit', id: u.id },
		has = G.pickSet && G.pickSet.has('unit' + u.id);
	if (G.pickMore && !hold)
		setPick(
			has
				? G.pick.filter((x) => !(x.t === 'unit' && x.id === u.id))
				: [...picked().map((v) => ({ t: 'unit', id: v.id })), k],
		);
	else setPick([k]);
	sfx(pickSound(u));
}
// the sound a picked unit answers with: by what it is made of and how it moves (35-sound)
const pickSound = (u) => {
	const T = UNIT[u.kind].tags || [];
	return T.includes('mounted')
		? 'pickHoof'
		: T.includes('ranged')
			? 'pickTwang'
			: isSoldier(u)
				? 'pickMetal'
				: 'pickWood';
};
function order(S, h) {
	const sol = S.filter(isSoldier),
		vil = S.filter((u) => u.kind === 'vil'),
		e = h.e,
		go = (list, x, y) => {
			list.forEach((u) => {
				if (u.kind === 'vil') {
					setJob(u, null);
					u.post = { x, y };
				} else {
					u.state = 'goto';
					u.px = x;
					u.py = y;
					u.idleT = 0;
					u.focus = null;
				}
			});
		};
	if (h.t === 'unit' && e.owner !== 0) {
		if (e.owner !== WILD && !atWar(0, e.owner)) {
			say(`${REL_WORD[G.rel[0][e.owner]]}: set Hostile at your Town Center first.`, '', 4);
			return;
		}
		if (UNIT[e.kind].meat && vil.length)
			vil.forEach((v) => {
				setJob(v, 'food');
				v.hunt = e;
				v.post = null;
			});
		for (const pr of S)
			if (pr.kind === 'priest' && e.owner !== WILD && UNIT[e.kind].cls && !(pr.cvCd > G.t)) {
				pr.state = 'convert';
				pr.cv = e.id;
				pr.cvT = 0;
			} // a priest sent at a foe converts them
		sol.forEach((u) => {
			u.state = 'goto';
			u.px = e.x;
			u.py = e.y;
			u.idleT = 0;
			u.focus = e;
		});
		if (sol.length) march(sol, e, e.owner === WILD ? UNIT[e.kind].name : G.P[e.owner].name);
	} else if (h.t === 'bld' && e.owner !== 0) {
		if (!atWar(0, e.owner)) {
			say(`${REL_WORD[G.rel[0][e.owner]]}: set Hostile at your Town Center first.`, '', 4);
			return;
		}
		sol.forEach((u) => {
			u.state = 'attack';
			u.target = e.owner;
			u.bid = e.id;
			u.focus = null;
		});
		if (sol.length) march(sol, e, `the ${bldName(e.owner, e.kind)} of ${G.P[e.owner].name}`);
	} else if (h.t === 'bld') {
		if (e.prog < 1)
			vil.forEach((v) => {
				sendBuilder(v, e);
				v.post = null;
			});
		else if (e.hp < maxHpB(0, e.kind) - 0.5)
			vil.forEach((v) => {
				setJob(v, 'repair');
				v.rep = e;
				v.post = null;
			});
		else
			vil.forEach((v) => {
				if (!startWork(v, e)) go([v], e.x, e.y + halfOf(e) + 12);
			});
		go(sol, e.x, e.y + halfOf(e) + 16);
	} else if (h.t === 'node') {
		vil.forEach((v) => {
			if (v.job !== e.type || v.node !== e) setJob(v, e.type, e.kind === 'farm' ? e : null);
			if (e.kind !== 'farm') v.node = e;
			v.post = null;
		});
		go(sol, e.x, e.y + 14);
	} else if (h.t === 'find') {
		if (e.kind === 'shrine') {
			const pr = S.find((u) => u.kind === 'priest');
			if (pr) {
				pr.state = 'shrine';
				pr.fid = e.id;
			}
		}
		go(
			S.filter((u) => u.kind !== 'priest' || e.kind !== 'shrine'),
			e.x,
			e.y,
		);
		if (sol.length) march(sol, e, FINDS[e.kind].name);
	} else {
		go(S, e.x, e.y);
		if (sol.length) march(sol, e, coord(e.x, e.y));
	}
	ripple(e.x, e.y, '#ffd35e');
	G.pickMore = false;
}
function startPlace(kind) {
	const B = BLD[kind],
		p = G.P[0];
	if (B.age > p.age) {
		openCard({ type: 'info', kind });
		return;
	}
	if (G.place && G.place.kind === kind) {
		cancelPlace();
		return;
	}
	const why = capWhy(0, kind);
	if (why) {
		say(why + '.', '', 3);
		sfx('err');
		return;
	}
	closeCard();
	setPick([]);
	G.place = { kind, at: null, pts: [], cells: null };
	// start the ghost in the middle of the screen, snapped beside something of yours if it can be
	const w = G.buildAt && G.buildAt.x !== undefined ? G.buildAt : toWorld(cw / 2, ch / 2);
	G.buildAt = null;
	if (kind !== 'wall') G.place.at = snapGhost(0, kind, w.x, w.y, 200); // from the hammer on open ground: there; otherwise the middle of the screen
	$('place').hidden = false;
	ui(true);
}
// you tapped Build: build what the ghost shows; houses, fields and gates offer the next spot beside it
function cancelPlace() {
	if (G) G.place = null;
	$('place').hidden = true;
}

// The box: your people inside it are picked; a box of trees and nobody is a road to cut
function boxPick(d) {
	const a = toWorld(Math.min(d.x0, d.x1), Math.min(d.y0, d.y1)),
		b = toWorld(Math.max(d.x0, d.x1), Math.max(d.y0, d.y1)),
		r = { x0: a.x, y0: a.y, x1: b.x, y1: b.y };
	const mine = armyOf(0)
		.concat(unitsOf(0, 'vil'))
		.filter((u) => !u.inside && inBox(u, r));
	if (mine.length) {
		setPick(mine.map((u) => ({ t: 'unit', id: u.id })));
		return;
	}
	const trees = G.nodes.filter((n) => n.kind === 'tree' && n.amt > 0 && inBox(n, r)).length;
	if (!trees) {
		say('Nothing of yours in that box.', '', 3);
		return;
	}
	openCard({ type: 'box', r, trees });
}
