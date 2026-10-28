// ═════ 27-cards-core.js: the card engine (open, close, patch) and the pieces cards are made of ═════
// ───────────────────────── The cards: one engine, one table ─────────────────────────
// A card is a page of the book. CARDS[type] writes its page from the game's tables; the engine lays the new page over the old one
// node by node, so only the words and numbers that changed are touched and a button under a finger stays the same button.
function openCard(c) {
	hideStrip();
	G.card = c;
	G.infoOpen = false;
	G.confirm = null;
	cardSig = '';
	$('card').scrollTop = 0;
	if (
		SET.cardPause !== false &&
		!G.paused &&
		!G.over &&
		(READ_CARDS.has(c.type) ||
			(c.type === 'bld' && G.ktab === 'rel' && G.blds.some((b) => b.id === c.id && b.kind === 'keep')))
	) {
		setPause(true);
		G.cardPaused = true;
	}
	tick();
	renderCard();
} // a card pauses the game (Help: Pause on cards); closing it carries on
const READ_CARDS = new Set(['research', 'council', 'troops', 'guide', 'help', 'score', 'stores', 'sound']); // the cards you sit and read pause the game; a building, a unit or a field to glance at does not (Albert, Build 41)
function closeCard() {
	if (G) {
		G.card = null;
		if (G.cardPaused) {
			G.cardPaused = false;
			if (!G.over) setPause(false);
		}
		tick();
	}
	$('card').hidden = true;
} // the ticker steps aside or back at once, so the card gets its room on the first frame
let cardSig = '';
const sig = (x) =>
	x.nodeType === 3
		? '#'
		: x.nodeName + '|' + (x.getAttribute('data-act') || x.getAttribute('data-f') || x.getAttribute('class') || '');
function patchKids(a, b) {
	const B = [...b.childNodes];
	B.forEach((y, i) => {
		const x = a.childNodes[i],
			k = sig(y);
		let m = x && sig(x) === k ? x : null;
		if (!m)
			for (let j = i + 1; j < a.childNodes.length; j++)
				if (sig(a.childNodes[j]) === k) {
					m = a.childNodes[j];
					a.insertBefore(m, x);
					break;
				} // a line came or went above it: the same node moves up, it is not rebuilt
		if (!m) {
			a.insertBefore(y, x || null);
			return;
		}
		if (m.nodeType === 3) {
			if (m.nodeValue !== y.nodeValue) m.nodeValue = y.nodeValue;
		} else patch(m, y);
	});
	while (a.childNodes.length > B.length) a.lastChild.remove();
}
function patch(a, b) {
	const own = a.nodeName === 'DETAILS' && a.dataset.f === b.dataset.f; // a fold the player is opening or closing keeps its own state
	for (const { name, value } of [...b.attributes])
		if (!(own && name === 'open') && a.getAttribute(name) !== value) a.setAttribute(name, value);
	for (const { name } of [...a.attributes])
		if (!(own && name === 'open') && !b.hasAttribute(name)) a.removeAttribute(name);
	patchKids(a, b);
}
const tpl = document.createElement('div');
function patchHTML(el, html) {
	tpl.innerHTML = html;
	patchKids(el, tpl);
}
// ── the pieces every card is made of
const cap1 = (t) => (t && t.indexOf('<') < 0 ? t.replace(/(^|· )([a-z])/g, (m, a, c) => a + c.toUpperCase()) : t); // sentence case: a capital opens every label and every part after a dot
const btn = (act, title, sub, cls) =>
	`<button data-act="${act}" class="${cls || ''}"><b>${cap1(title)}</b>${sub ? `<small${sub.startsWith('short ') ? ' class="need"' : ''}>${cap1(sub)}</small>` : ''}</button>`; // a sub-line that says what is short reads in red
const FOLD = new Set(); // explanations live behind a small fold, closed unless you opened it; it stays as you left it while the card redraws
// the book entry of a research step: the date, what it changed, and its weight, which is its cost
const techBook = (t) =>
	`<p><b>${t.name}</b>${t.when ? ` · ${t.when}` : ''}${t.w ? ` · weight ${t.w} of 10` : ''}: ${t.desc}${WHY[t.id] ? ` ${WHY[t.id]}` : ''}${t.w ? ` Cost and time ×${(0.5 + 0.1 * t.w).toFixed(1)} for its age.` : ''}</p>`;
const twoTabs = (key, opts, cur) =>
	`<div class="acts tabs">${opts.map(([k, t, sub]) => btn(`${key}:${k}`, (ICON.tab[k] || '') + t, sub, cur === k ? 'on' : '')).join('')}</div>`; // two-sided cards, one mold: two tabs; the chosen one is lit
const INFO = new Set(['why', 'bmore', 'about', 'menu', 'bnabout']);
let infoBuf = []; // the explaining text of a card waits behind the book icon
const fold = (id, title, html) =>
	INFO.has(id)
		? (html && infoBuf.push(html), '')
		: html
			? `<details class="fold" data-f="${id}"${FOLD.has(id) ? ' open' : ''}><summary>${title}</summary>${html}</details>`
			: '';
const hpBar = (f, col) =>
	`<div class="hp"><i style="width:${Math.round(100 * clamp(f, 0, 1))}%;background:${col}"></i></div>`;
const sec = (t) => `<div class="sec">${t}</div>`;
const acts = (h, cls) => `<div class="acts${cls ? ' ' + cls : ''}">${h}</div>`;
const title = (t, who) => `<h3>${t}<span class="who">${who}</span></h3>`;
const unitLine = (o, k) => {
	const S = stats(o, k),
		U = UNIT[k];
	return `<p><b>${S.name}:</b> ${U.desc}${U.civ ? ` <i>${CIVS[U.civ].name} only.</i>` : ''}</p>`;
};
const VS_WORD = {
	mounted: 'anything on horseback',
	infantry: 'foot soldiers',
	civ: 'workers and caravans',
	heavy: 'armoured troops',
	archer: 'archers',
	elephant: 'elephants',
	siege: 'siege engines',
};
function beatsText(o, k) {
	const S = stats(o, k),
		out = Object.entries(S.vs || {}).map(
			([t, m]) => `${UNIT[t] ? plural(stats(o, civKind(o, t)).name.toLowerCase()) : VS_WORD[t] || t + 's'} ×${m}`,
		);
	if (UNIT[k].bld && UNIT[k].bld !== 1) out.push(`buildings ×${UNIT[k].bld}`);
	if (UNIT[k].bonly) out.push('buildings only');
	return out.join(', ');
}
function trainButtons(kinds) {
	const p = G.P[0];
	return kinds
		.map((k) => {
			const ck = civKind(0, k),
				U = UNIT[ck],
				why = trainWhy(0, k),
				n = queuedOf(0, k);
			const full = U.cls && clsCount(0, U.cls) >= clsMax(U.cls, 0);
			const cost = unitCost(0, ck),
				sub =
					U.age > p.age
						? `${AGES[U.age].name} age`
						: !ready(0, U.at).length
							? `needs a ${BLD[U.at].name.toLowerCase()}`
							: full
								? `short of room ${clsCount(0, U.cls)}/${clsMax(U.cls, 0)}`
								: !afford(p, cost)
									? `short ${need(cost)}`
									: costText(cost);
			return btn(`train:${k}`, stats(0, ck).name, sub + (n ? ` ×${n}` : ''), why ? 'dis' : '');
		})
		.join('');
}
// Research, in four looks you can tell without reading: ready (wax seal), short of something (red ink, what is missing), busy, locked (faded)
function techState(t) {
	if (G.P[0].techs.has(t.id)) return 'done';
	const why = researchWhy(0, t.id);
	return !why
		? 'ready'
		: why === 'Being researched.' || why === 'That line is full.'
			? 'busy'
			: why.startsWith('Not enough')
				? 'short'
				: 'locked';
}
function techBtn(t, withAt) {
	const st = techState(t);
	const sub =
		st === 'busy'
			? 'researching'
			: st === 'short'
				? `short ${need(t.cost)}`
				: st === 'locked'
					? researchWhy(0, t.id).replace(/\.$/, '')
					: costText(t.cost);
	return btn(
		`tech:${t.id}`,
		t.name,
		sub + (withAt ? ` · ${BLD[t.at].name}` : ''),
		`a${t.age} ` + (st === 'ready' ? 'go' : st === 'short' ? 'dis short' : st === 'busy' ? 'dis' : 'dis lock'),
	); // a${age}: the top edge wears the age's colour
}
const trainsAt = (kind) =>
	Object.keys(UNIT).filter(
		(k) => (UNIT[k].at === kind || (UNIT[k].also || []).includes(kind)) && !UNIT[k].civ && UNIT[k].cost,
	);
function keepAgeBtn() {
	// the next age, as one research button; the reason waits behind the book
	const p = G.P[0],
		A = AGES[p.age + 1];
	if (!A) return '';
	fold('why', 'Why this age?', `<p>${WHY['age' + (p.age + 1)]}</p>`);
	return btn(
		'age',
		`${A.name} age`,
		p.aging ? 'advancing' : costText(A.cost),
		p.aging || !afford(p, A.cost) ? 'dis' : 'go',
	);
}
// what one of yours is doing, in words read from its state; and what it has done in its life
function statusOf(u) {
	const nm = (b) => bldName(0, b.kind).toLowerCase();
	if (u.inside) return 'sheltering inside';
	if (u.state === 'school') return `learning at the School, ${Math.ceil(u.schoolT - G.t)} s`;
	if (u.kind === 'vil') {
		if (u.scared) return 'running for shelter';
		if (u.job === 'repair')
			return !u.rep
				? 'looking for work'
				: u.rep.fire > 0
					? `fighting the fire at the ${nm(u.rep)}`
					: u.rep.prog < 1
						? `raising the ${nm(u.rep)}, ${Math.round(u.rep.prog * 100)}%`
						: `mending the ${nm(u.rep)}`;
		if (u.hunt) return `hunting ${UNIT[u.hunt.kind].name.toLowerCase()}`;
		const full = u.carry > 0 && (u.carry >= carryOf(0) - 1e-6 || !u.node || u.node.amt <= 0 || u.carryType !== u.job);
		if (full) return `carrying ${Math.round(u.carry)} ${u.carryType} to the ${u.drop ? nm(u.drop) : 'drop-off'}`;
		if (!u.job) return u.post ? 'standing where you sent them' : 'idle';
		if (!u.node) return `looking for ${u.job}`;
		const n = u.node,
			at = u.work && G.t - u.work < 0.6,
			verb =
				n.kind === 'farm'
					? n.type === 'wood'
						? 'tending the coppice'
						: n.type === 'wool'
							? 'tending the flock'
							: BLD[n.farm.kind].from
								? `working the ${nm(n.farm)}`
								: 'working the field'
					: {
							tree: 'chopping',
							bush: 'picking berries',
							fish: 'fishing',
							stone: 'quarrying',
							gold: 'digging gold',
							iron: 'digging iron',
							meat: 'butchering',
						}[n.kind];
		return at
			? `${verb} · ${Math.round(u.carry)} of ${carryOf(0)} ${n.type} in hand`
			: `walking to the ${nodeName(n).toLowerCase()}`;
	}
	if (u.kind === 'caravan')
		return u.route
			? u.leg === 'go'
				? 'on the way to sell'
				: u.leg === 'back'
					? 'coming home'
					: 'loading'
			: u.dest
				? 'off to trade with your ally'
				: 'waiting at the Market';
	if (u.tgt && u.tgt.hp > 0)
		return `fighting ${u.tgt.q ? `their ${bldName(u.tgt.owner, u.tgt.kind).toLowerCase()}` : UNIT[u.tgt.kind].name.toLowerCase()}`;
	return u.state === 'attack'
		? `marching on the ${G.P[u.target] ? G.P[u.target].name : 'enemy'}`
		: u.state === 'goto'
			? u.idleT > 1
				? 'holding the spot'
				: 'marching'
			: u.state === 'escort'
				? 'guarding'
				: u.state === 'shrine'
					? 'holding the shrine'
					: u.state === 'assist'
						? 'helping an ally'
						: u.state === 'sab'
							? 'slipping toward a target'
							: u.levy !== undefined
								? `on levy from ${G.P[u.levy].name}`
								: 'at home';
}
function lifeText(u) {
	const S = u.st || {},
		parts = [`${clock(Math.max(0, G.t - (u.bornT || 0)))} old`];
	if (u.kind === 'vil')
		parts.push(
			`gathered ${fmt(S.got || 0)} in ${S.trips || 0} ${some(S.trips || 0, 'trip')}`,
			`raised ${S.built || 0} ${some(S.built || 0, 'building')}`,
		);
	else if (isSoldier(u)) parts.push(`${S.kills || 0} ${some(S.kills || 0, 'kill')}`);
	parts.push(`walked ${fmt(S.walk || 0)}`);
	return parts.join(' · ');
}
// the math of a find or a field: what a worker takes a minute (the table's rate after research, soil and season), how many are on it, how long it lasts
function yieldText(n, o) {
	const rate = (n.rate || RATE_OF[n.kind]) * gatherMul(o, n) * 60,
		wk = n.wk || 0,
		fin = isFinite(n.amt),
		carry = carryOf(o);
	return `<p>${wk ? `<i>${wk} at work:</i> ` : ''}each takes ${Math.round(rate)} ${n.type} a minute and carries ${carry} a trip${wk ? `; together about ${Math.round(rate * wk)} a minute` : ''}${fin && wk ? `; gone in about ${clock((n.amt / (rate * wk)) * 60)}` : ''}.${fin && n.max > 0 ? ` Taken so far: ${Math.round(n.max - n.amt)} of ${Math.round(n.max)}.` : ''}</p>`;
}
const goodsText = (g) =>
	GOODK.filter((k) => g[k] >= 1)
		.map((k) => `${Math.floor(g[k])} ${GOODS[k].name.toLowerCase()}`)
		.join(', ');
const ownTech = (t) => !t.civ || t.civ === G.P[0].civ; // research this people can do: the others' elite ranks stay out of sight
const need = (c) => {
	const p = G.P[0],
		miss = {};
	for (const r in c) if ((p.res[r] || 0) < c[r]) miss[r] = Math.ceil(c[r] - (p.res[r] || 0));
	return costText(miss);
}; // what a cost is short of now
const slotText = (n) => (n && n.wk > 0 ? `${n.wk} of ${slotsOf(n)}` : 'nobody yet');
const qName = (j) =>
	j.kind
		? stats(0, j.kind).name
		: j.muster
			? `muster ${j.bn !== undefined ? BN[j.bn] : ''}`
			: j.tech
				? TECHBY[j.tech].name
				: AGES[j.age].name + ' age';
// the side at war with you whose Town Center is nearest yours
function foeNearest() {
	const k = keepOf(0);
	let bd = 1e9,
		t = null;
	if (k)
		for (const q of G.P)
			if (q.alive && q.id !== WILD && atWar(0, q.id)) {
				const d = hyp(q.keep[0] - k.x, q.keep[1] - k.y);
				if (d < bd) {
					bd = d;
					t = q.id;
				}
			}
	return t;
}
// the odds the computers use (17-ai.js): the square law on strength, bent by who counters whom, against their army, towers and Town Center
function oddsText(S, t) {
	if (t === null || t === undefined || !S.length) return '';
	const r = (powerOf(S) / estPower(0, t)) * matchup(S, soldiersOf(t)),
		p = (r * r) / (1 + r * r);
	return `odds ${p > 0.65 ? 'strong' : p > 0.4 ? 'even' : 'weak'}`;
}
