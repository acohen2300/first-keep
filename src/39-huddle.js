// ═════ 39-huddle.js: the huddle: four missions you plan, fire, watch and call off, over the same bar the jobs use ═════
// The sword button swaps the job bar for the attack bar. Column 1: Ready over Aim, each with a light (red: not set, green: set).
// Columns 2-5: while drafting, how many Foot, Archers, Horse and Siege go (the idle ones); while viewing, the four missions (Alpha to Delta).
// Column 6: Fire over Abort. A mission is a march order (G.ords) with a slot (G.msn) that keeps its promise: when it should arrive, how the fight goes, how it ended.
const MSN = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
const CLS = [
	['foot', 'Foot', 'barracks', 'foot'],
	['arch', 'Arch', 'range', 'archers'],
	['horse', 'Horse', 'stable', 'riders'],
	['siege', 'Siege', 'siege', 'siege'],
];
const HUD = {
	near: 140, // a fight is what hostile soldiers within this reach of the group make
	lose: 0.4, // a tile flashes red below this chance, and stops above clear
	clear: 0.5,
	win: 0.75, // green above this: the extra soldiers can be spared
	keep: 0.65, // sparing never takes the chance below this
	smooth: 0.3, // the chance moves a third of the way each second: about three seconds to settle
	gap: 8, // reinforcements arriving within this many seconds of each other are one wave
	waves: 3,
};
const clsOf = (u) => CLS.findIndex((c) => c[2] === UNIT[u.kind].at);
const mUnits = (m) => G.units.filter((u) => u.owner === 0 && u.ord === m.ord && u.hp > 0);
const hostile = (v) =>
	v.owner !== 0 &&
	v.hp > 0 &&
	!v.inside &&
	atWar(0, v.owner) &&
	(isSoldier(v) || (v.owner === WILD && UNIT[v.kind].tick === 'wild'));
function foesNear(c) {
	const out = [];
	unitsNear(c, HUD.near, (v) => hostile(v) && out.push(v));
	return out;
}
const powerSum = (L) => L.reduce((s, u) => s + unitPower(u), 0);
// the chance to win: the engine every odds line uses (power against power, the matchup of arms), as r²/(1+r²)
function chance(S, foes) {
	const r = (powerSum(S) / Math.max(1, powerSum(foes))) * matchup(S, foes);
	return (r * r) / (1 + r * r);
}
const dpsOf = (L) => L.reduce((s, v) => s + dmgOf(v) / (UNIT[v.kind].cd || 1.5), 0);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const wxWord = () => (G.wx !== 'clear' && WEATHER[G.wx] ? WEATHER[G.wx].name : season().name);

// ── the draft: who goes, and where
const hudPool = () =>
	(G.hud.pre ? G.hud.pre.map((id) => G.units.find((u) => u.id === id)).filter((u) => u && u.hp > 0) : free()).filter(
		(u) => clsOf(u) >= 0,
	);
const hudHave = (pool, c) => pool.filter((u) => clsOf(u) === c).length;
const hudN = (pool, c) => Math.min(hudHave(pool, c), G.hud.n[c] ?? 1e9);
function hudPick() {
	const pool = hudPool(),
		to = G.hud.h && G.hud.h.e;
	return CLS.flatMap((_, c) => {
		const a = pool.filter((u) => clsOf(u) === c);
		if (to) a.sort((p, q) => dist(p, to) - dist(q, to));
		return a.slice(0, hudN(pool, c));
	});
}
const hudSlot = () => G.hud.slot ?? G.msn.findIndex((m) => !m);
// the time the draft would take to arrive, worked out again when the target, the numbers or (every few seconds) the weather change
function hudEta() {
	const H = G.hud,
		S = hudPick();
	if (!H.h || !S.length) return 0;
	const key = `${H.h.e.x | 0},${H.h.e.y | 0},${S.length},${G.wx},${(G.t / 3) | 0}`;
	if (H.etaKey !== key) {
		H.etaKey = key;
		H.eta = etaOf(S, H.h.e, routeK(centreOf(S), H.h.e));
	}
	return H.eta;
}
function aimAt(sx, sy) {
	const H = G.hud;
	let h = hitAt(sx, sy);
	if (h.t === 'unit' && h.e.owner === 0) h = { t: 'ground', e: { x: h.e.x, y: h.e.y } }; // your own: just the spot
	H.h = h;
	H.aim = false;
	H.etaKey = '';
	ripple(h.e.x, h.e.y, '#ffb23d');
	feel('tick');
}
function hudOpen(on) {
	const H = G.hud;
	H.on = on;
	H.aim = H.view = false;
	H.h = H.pre = H.slot = H.carry = H.sel = null;
	H.n = {};
	if (on) closeCard();
}
// Fire: the draft marches as one order and takes the slot
function hudFire() {
	const H = G.hud,
		slot = hudSlot(),
		S = hudPick();
	if (slot < 0 || G.msn[slot]) return say('All four missions are out.', '', 3);
	if (!H.h || !S.length) return;
	const before = G.ordN || 0;
	order(S, H.h);
	if ((G.ordN || 0) === before) return; // refused: the reason was said
	const O = G.ords[G.ordN];
	G.msn[slot] = {
		name: MSN[slot],
		ord: G.ordN,
		n0: S.length,
		what: H.h.t === 'unit' || (H.h.t === 'bld' && H.h.e.owner !== 0) ? 'Attack' : 'Go to',
		label: O.label,
		x: O.x,
		y: O.y,
		t: G.t,
		due: G.t + etaOf(S, O, O.k),
		st: 'go',
		odds: 0.5,
	};
	H.h = H.pre = H.slot = null;
	H.n = {};
	H.view = true;
	H.sel = slot;
	feel('thock');
}
// a mission leaves: the soldiers go home, the slot is free
function hudAbort(slot) {
	const m = G.msn[slot];
	if (!m) return;
	sendHome(mUnits(m));
	G.msn[slot] = null;
	if (G.hud.sel === slot) G.hud.sel = null;
	if (G.card && G.card.type === 'mission') closeCard();
	say(`${m.name} called home.`, '', 3);
}
function hudAbortAll() {
	G.msn.forEach((_, i) => hudAbort(i));
}
// the draft's Abort: clears the draft, or (viewing) the picked mission
function hudCancel() {
	const H = G.hud;
	if (H.view && H.sel !== null && G.msn[H.sel]) hudAbort(H.sel);
	else {
		H.h = H.pre = H.slot = null;
		H.n = {};
		H.aim = false;
	}
}

// ── each second: where a mission is, how it goes, what to say
function missionsTick() {
	G.msn.forEach((m, i) => {
		if (!m || m.end) return;
		const S = mUnits(m),
			O = G.ords && G.ords[m.ord];
		if (!S.length) {
			m.end = G.t;
			m.st = 'lost';
			m.flash = null;
			say(`${m.name} is lost.`, 'warn', 4);
			return;
		}
		const c = centreOf(S),
			foes = foesNear(c),
			walk = S.filter((u) => armyStatus(u) === 'march').length,
			fight = S.some((u) => armyStatus(u) === 'fight');
		m.eta = O && !O.arrived ? O.eta || 0 : 0;
		if (fight || (!walk && foes.length)) m.st = 'act';
		else if (!walk) {
			m.st = 'done';
			m.end = G.t;
			m.flash = null;
			m.late = Math.max(0, Math.round(G.t - m.due));
			return;
		} else m.st = 'go';
		if (m.st !== 'act') return;
		m.odds += (chance(S, foes) - m.odds) * HUD.smooth;
		if (m.odds < HUD.lose && m.flash !== 'lose') {
			m.flash = 'lose';
			say(`${m.name} is losing.`, 'warn', 4);
		} else if (m.flash === 'lose' && m.odds > HUD.clear) m.flash = null;
		m.spare = [];
		if (m.odds > HUD.win) {
			m.flash = 'win';
			let rest = S.slice();
			for (const u of S.slice().sort((p, q) => unitPower(p) - unitPower(q))) {
				const next = rest.filter((v) => v !== u);
				if (!next.length || chance(next, foes) < HUD.keep) break;
				rest = next;
				m.spare.push(u.id);
			}
		} else if (m.flash === 'win') m.flash = null;
	});
}
// who can still reach a fight in time, fastest first, and how many it takes to even it: waves by arrival
function reinforcePlan(m) {
	const S = mUnits(m);
	if (!S.length) return null;
	const c = centreOf(S),
		foes = foesNear(c);
	if (!foes.length) return null;
	const res = free().filter((u) => !S.includes(u)),
		k = res.length ? routeK(centreOf(res), c) : 1,
		survive = S.reduce((s, u) => s + u.hp, 0) / Math.max(1, dpsOf(foes)),
		mu = matchup(S, foes),
		foe = Math.max(1, powerSum(foes)),
		cand = res.map((u) => ({ u, t: (dist(u, c) * k) / Math.max(1, paceOf(u, sideSpd(0))) })).sort((p, q) => p.t - q.t),
		go = [];
	let pow = powerSum(S);
	const even = (pow / foe) * mu >= 1;
	for (const r of cand) {
		if (r.t > survive || (pow / foe) * mu >= 1) break; // too late for the rest, or the fight is even
		go.push(r);
		pow += unitPower(r.u);
	}
	const waves = [];
	for (const r of go) {
		const w = waves[waves.length - 1];
		if (w && (r.t - w.t < HUD.gap || waves.length === HUD.waves)) w.list.push(r);
		else waves.push({ t: r.t, list: [r] });
	}
	return { c, go: go.map((r) => r.u), waves, even, late: !go.length && !even && cand.length > 0 };
}
function waveLine(plan) {
	const word = (list) => {
		const k = new Set(list.map((r) => clsOf(r.u)));
		return k.size === 1 ? CLS[[...k][0]][3] : 'soldiers';
	};
	return plan.waves
		.map((w, i) => `${w.list.length} ${i ? 'more' : word(w.list)} ${i ? 'by' : 'in'} ${mmss(w.t)}`)
		.join(', ');
}
// units moved into a mission (a reinforcement, a spare soldier from another): they march to its middle and join its order
function hudJoin(S, m) {
	if (!S.length) return;
	const c = centreOf(mUnits(m)),
		before = G.ordN || 0;
	order(S, { t: 'ground', e: c });
	if ((G.ordN || 0) === before) return;
	const id = G.ordN;
	for (const u of S) u.ord = m.ord;
	delete G.ords[id];
}
function hudReinforce(slot) {
	const m = G.msn[slot],
		plan = m && reinforcePlan(m);
	if (!plan || !plan.go.length) return say('Too late: nobody can get there in time.', '', 3);
	hudJoin(plan.go, m);
	say(`${plan.go.length} reinforce ${m.name}.`, 'good', 3);
}
const spareOf = (m) => (m.spare || []).map((id) => G.units.find((u) => u.id === id)).filter((u) => u && u.hp > 0);
// spare soldiers go: to another mission (reinforce), an empty slot (a new draft of just them), or Ready (home)
function hudDrop(from, to) {
	const m = G.msn[from],
		S = m ? spareOf(m) : [];
	G.hud.carry = null;
	if (!S.length) return;
	if (to === 'home') {
		sendHome(S);
		say(`${S.length} home from ${m.name}.`, '', 3);
	} else if (G.msn[to] && to !== from) {
		hudJoin(S, G.msn[to]);
		say(`${S.length} from ${m.name} to ${G.msn[to].name}.`, 'good', 3);
	} else if (!G.msn[to]) {
		const H = G.hud;
		H.pre = S.map((u) => u.id);
		H.n = {};
		H.h = null;
		H.slot = to;
		H.view = false;
		H.aim = true;
		say(`Tap where ${MSN[to]} goes.`, '', 3);
	}
	m.spare = [];
	m.flash = null;
}
function hudTile(slot) {
	const m = G.msn[slot];
	if (G.hud.carry !== null && G.hud.carry !== undefined) return hudDrop(G.hud.carry, slot);
	if (m) openCard({ type: 'mission', slot });
	G.hud.sel = m ? slot : null;
}

// ── the bar
const odds2 = (p) => `hsl(${Math.round(Math.max(0, Math.min(1, p)) * 120)} 75% 58%)`;
function mStatus(m) {
	if (m.st === 'go') return [mmss(m.eta || 0), '#7db4ff'];
	if (m.st === 'act') return ['ACTIVE', odds2(m.odds)];
	if (m.st === 'lost') return ['LOST', '#ff6a5a'];
	return [m.late ? `LATE +${m.late}s` : '✓ DONE', m.late ? '#ffd35e' : '#5fd08a'];
}
function huddleHTML() {
	const H = G.hud,
		pool = hudPool(),
		st = (act, t, cls, extra = '') => `<button class="cell st w ${cls || ''}" data-act="${act}"${extra}>${t}</button>`,
		draft = !H.view,
		picked = hudPick().length,
		fire = picked && H.h && hudSlot() >= 0,
		col1 =
			`<button class="cell bar${picked ? ' on' : ''}${draft ? ' sel' : ''}" data-act="hready" aria-label="Ready"><span class="wd mid">Ready</span></button>` +
			`<button class="cell st w bar${H.h ? ' on' : ''}${H.aim ? ' sel' : ''}" data-act="haim" aria-label="Aim">Aim</button>`,
		mid = (draft ? CLS : MSN)
			.map((x, i) => {
				if (draft) {
					const have = hudHave(pool, i);
					return `<div class="col"><button class="cell${have ? '' : ' dis'}" data-act="hudc:${i}"><span class="top"><span class="c">${hudN(pool, i)}</span></span>${wd(x[1])}</button><div class="pm">${st(`hudn:${i},-`, '−')}${st(`hudn:${i},+`, '+')}</div></div>`;
				}
				const m = G.msn[i];
				if (!m)
					return `<div class="col"><button class="cell msn empty" data-slot="${i}" data-act="hslot:${i}"><span class="wd mid">${x}</span></button>${st(`hslot:${i}`, '', 'msn empty', ` data-slot="${i}"`)}</div>`;
				const [t, color] = mStatus(m),
					n = mUnits(m).length,
					fl = m.flash ? ' ' + m.flash : '';
				return `<div class="col"><button class="cell msn${fl}${H.sel === i ? ' sel' : ''}" data-slot="${i}" data-act="mcard:${i}" style="--mc:${color}"><span class="top"><span class="c">${n}</span></span>${wd(m.name)}</button><button class="cell st w msn${fl}" data-slot="${i}" data-act="mcard:${i}" style="color:${color}">${t}</button></div>`;
			})
			.join(''),
		col6 = `<div class="col"><button class="cell fire ${fire ? 'go' : 'dis'}" data-act="hfire" aria-label="Fire"><span class="wd mid">FIRE</span></button>${st('habort', 'Abort')}</div>`;
	return `<div class="col">${col1}</div>${mid}${col6}`;
}
function huddleUI() {
	const H = G.hud,
		el = $('huddle'),
		flip = el.hidden === H.on;
	if (flip) {
		el.hidden = !H.on;
		$('jobs').hidden = H.on;
		$('orders').classList.toggle('hud', H.on);
		$('hudB').classList.toggle('sel', H.on);
		$('hudB').innerHTML = H.on ? ICON.close : ICON.sword;
		$('hudB').setAttribute('aria-label', H.on ? 'Leave the huddle' : 'Huddle: plan an attack');
	}
	if (H.on) {
		const h = huddleHTML();
		if (el.sigH !== h) {
			el.sigH = h;
			el.innerHTML = h;
		}
	}
	if (flip) fit(); // the bar is whole again: the corner buttons sit on top of it
}
// the reticle: thin brackets round the target and a tag with the time it would take
function drawReticle() {
	const H = G.hud;
	if (!H.on || !H.h) return;
	const x = SX(H.h.e.x),
		y = SY(H.h.e.y),
		r = 16 * cam.z + 6,
		q = r * 0.45,
		eta = hudEta();
	ctx.save();
	ctx.strokeStyle = ctx.fillStyle = '#ffb23d';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	for (const [sx, sy] of [
		[-1, -1],
		[1, -1],
		[1, 1],
		[-1, 1],
	]) {
		ctx.moveTo(x + sx * r, y + sy * (r - q));
		ctx.lineTo(x + sx * r, y + sy * r);
		ctx.lineTo(x + sx * (r - q), y + sy * r);
	}
	ctx.stroke();
	ctx.font = '700 12px system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText(eta ? `${mmss(eta)} · ${coord(H.h.e.x, H.h.e.y)}` : coord(H.h.e.x, H.h.e.y), x, y - r - 5);
	ctx.restore();
}
// the details card for one mission: who, what, where, when, status, and what you can do
CARDS.mission = (c) => {
	const m = G.msn[c.slot];
	if (!m) return null;
	const S = mUnits(m),
		cls = CLS.map((k, i) => [k[1], S.filter((u) => clsOf(u) === i).length])
			.filter((r) => r[1])
			.map((r) => `${r[1]} ${r[0]}`)
			.join(', '),
		[word] = mStatus(m),
		plan = m.st === 'act' ? reinforcePlan(m) : null,
		spare = spareOf(m),
		slow = sideSpd(0),
		row = (k, v) => `<p><b>${k}</b> ${v}</p>`;
	return (
		title(m.name, m.st === 'act' ? `${Math.round(m.odds * 100)}%` : word) +
		row('Who', `${S.length} of ${m.n0}${cls ? ' · ' + cls : ''}`) +
		row('What', `${m.what} ${m.label}`) +
		`<p data-act="jump:${m.x},${m.y}"><b>Where</b> ${coord(m.x, m.y)} · tap to go</p>` +
		row('When', m.st === 'go' ? `Due in ${mmss(m.eta || 0)}` : m.late ? `${m.late} s late` : 'On time') +
		row('Status', m.st === 'act' ? `Active · ${Math.round(m.odds * 100)}% to win` : word) +
		(slow < 0.98
			? row(G.wx !== 'clear' ? 'Weather' : 'Season', `${wxWord()}, walking ×${slow.toFixed(2)}, included`)
			: '') +
		(m.st === 'act' || spare.length
			? acts(
					(m.st === 'act'
						? btn(
								`hudrein:${c.slot}`,
								plan && plan.go.length ? `Reinforce +${plan.go.length}` : 'Reinforce',
								plan && plan.go.length
									? waveLine(plan)
									: plan && plan.even
										? 'Already even'
										: plan && plan.late
											? 'Too late'
											: 'No reserve',
								plan && plan.go.length ? 'go' : 'dis',
							)
						: '') + (spare.length ? btn(`hspare:${c.slot}`, `Spare ${spare.length}`, 'then tap a tile', 'go') : ''),
				)
			: '') +
		acts(btn(`hdel:${c.slot}`, 'Abort', 'soldiers go home', 'warn') + btn('habortall', 'Abort all', '', 'warn'))
	);
};
// drag a green tile's spare soldiers: onto a mission, an empty slot, or Ready
function hudDrag(ev) {
	const t = ev.target.closest && ev.target.closest('#huddle [data-slot]'),
		m = t && G.msn[t.dataset.slot];
	if (!m || !m.spare || !m.spare.length) return;
	const from = Number(t.dataset.slot),
		x0 = ev.clientX,
		y0 = ev.clientY;
	let ghost = null;
	const move = (e) => {
			if (!ghost && Math.hypot(e.clientX - x0, e.clientY - y0) > 10) {
				ghost = document.createElement('div');
				ghost.className = 'hudGhost';
				ghost.textContent = `Spare ${m.spare.length}`;
				document.body.appendChild(ghost);
			}
			if (ghost) ghost.style.transform = `translate(${e.clientX - 40}px,${e.clientY - 60}px)`;
		},
		end = (e) => {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', end);
			window.removeEventListener('pointercancel', end);
			if (!ghost) return;
			ghost.remove();
			G.hud.dragged = performance.now();
			const d = document.elementFromPoint(e.clientX, e.clientY),
				slot = d && d.closest('[data-slot]'),
				ready = d && d.closest('[data-act="hready"]');
			if (ready) hudDrop(from, 'home');
			else if (slot) hudDrop(from, Number(slot.dataset.slot));
			refresh();
		};
	window.addEventListener('pointermove', move);
	window.addEventListener('pointerup', end);
	window.addEventListener('pointercancel', end);
}
document.addEventListener('pointerdown', hudDrag);
