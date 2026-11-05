// ═════ 27-cards-core.js: the card engine (open, close, patch) and the pieces cards are made of ═════
// ───────────────────────── The cards: one engine, one table ─────────────────────────
// A card is a page of the book. CARDS[type] writes its page from the game's tables; the engine lays the new page over the old one
// node by node, so only the words and numbers that changed are touched and a button under a finger stays the same button.
// Back (MENU-SPEC §4): a card opened by a tap inside another card remembers the card it came from (c.from); back returns to it, and on
// the first card it closes. The chain lives on the card itself, so closing it, or a new game, clears it. Another kind of card is another
// page; the same kind is the same page turning (a tab, a guide page), which keeps where it came from.
let cardTap = false; // the tap being handled was inside a card (the click handler, 33-verbs)
function openCard(c, back) {
	if (!back) c.from = cardTap && G.card ? (G.card.type === c.type ? G.card.from : G.card) : null;
	hideQuick();
	G.techTip = null;
	G.qs = { from: 'all', n: {} }; // the Attack-with counts start fresh on every card
	G.relPick = {}; // and what was picked on Relations and not sent
	G.card = c;
	G.infoOpen = false;
	G.confirm = null;
	cardSig = '';
	cardPK = null;
	$('card').scrollTop = 0;
	renderCard();
	preview();
} // a card pauses the game (Help: Pause on cards); closing it carries on
const READ_CARDS = { research: 'Research', troops: 'the Army', guide: 'the Guide', help: 'Help', score: 'Score', stores: 'Stores', sound: 'Sound' }; // the cards you sit and read pause the game (named for the Rules page); a building, a unit or a field to glance at does not (Albert, Build 41). The War Council is a building card that pauses (Build 48: 'council' here never matched a card)
// whether the card on show pauses the game, decided each time what it shows changes (a card opened, back, a tab turned), never once at
// open (E7: Relations paused when opened on its tab, not when the tab was turned; a building after Research stayed paused). Between
// changes the player's own pause and play stand
let cardPK = null;
function cardPause(c) {
	const k = `${c.type}:${c.id ?? ''}:${c.type === 'bld' ? G.ktab : ''}`;
	if (k === cardPK) return;
	cardPK = k;
	const want =
		SET.cardPause !== false &&
		!G.over &&
		(c.type in READ_CARDS ||
			(c.type === 'bld' &&
				G.blds.some((b) => b.id === c.id && b.owner === 0 && (b.kind === 'council' || (b.kind === 'keep' && (G.ktab === 'rel' || G.ktab === 'mis'))))));
	if (want && !G.paused) {
		setPause(true);
		G.cardPaused = true;
	} else if (!want && G.cardPaused && !G.over) {
		G.cardPaused = false;
		setPause(false);
	}
}
function closeCard() {
	cardPK = null;
	if (G) {
		G.techTip = null;
		G.card = null;
		if (G.cardPaused) {
			G.cardPaused = false;
			if (!G.over) setPause(false);
		}
	}
	$('card').hidden = true;
	if (G) preview();
} // the preview steps back at once
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
	if (a.nodeName === 'INPUT' && a.type === 'range' && a.value !== b.getAttribute('value')) a.value = b.getAttribute('value'); // a slider shows what the game holds, once moved too
	patchKids(a, b);
}
const tpl = document.createElement('div');
function patchHTML(el, html) {
	tpl.innerHTML = html;
	patchKids(el, tpl);
}
// A card rises from the row (MENU-SPEC §1): as tall as what it holds, its last rank always one gap above the row, never more than its size
// allows (the style sheet's --capH; Albert, Nov 2: bottom-anchored, no rank of padding)
const cardIn = $('card').firstElementChild;
// ── the pieces every card is made of. The slot is a button; the Formation lays them (MENU-SPEC §2, §3); the states are classes (§9):
// go ready (blue ring), on chosen (gold ring), warn danger (red ring, breathing), work in progress (the green ring that recedes, --p the
// share still to go: toGo), dis locked (dim), main the card's one main action (the gold fill). A cell's span is a class too: h (a half slot), s1 to s6
// (whole slots), and r2 for a pillar.
const cap1 = (t) => (t && t.indexOf('<') < 0 ? t.replace(/(^|· )([a-z])/g, (m, a, c) => a + c.toUpperCase()) : t); // sentence case: a capital opens every label and every part after a dot
const btn = (act, title, sub, cls, fr) =>
	`<button data-act="${act}" class="${cls || ''}"><b>${cap1(title)}</b>${sub ? `<small${fr === undefined ? '' : ` class="${fr < 1 ? 'need' : 'can'}" style="--gc:${costCol(fr)}"`}>${cap1(sub)}</small>` : ''}</button>`; // a cost line on the one gradient (fr: what you have of it, 0 to 1): red at nothing, white near, light green when you can pay
// the Formation, the one helper that lays cells: twelve half slots across, ranks 44 tall, 6 between. cls says how many cells a rank holds
// (c1 one, c2 two (the default), c3 three, c4 four, c6 six; c5 lays five singles and leaves the sixth place); a cell's span class overrides it
const acts = (h, cls = 'c2') => `<div class="fm ${cls}">${h}</div>`;
// a list collapses (MENU-SPEC §3): its things three a rank, as even as they go, so no rank has a hole: two are two triples, four two and two,
// five three and two. Things you do are double-wide; a list of one is the whole rank. per: at most two a rank, for words that need three slots
// Train and Research on a building card (MENU-SPEC §8, Albert Nov 2, T1): every button double-wide, three a rank; a short rank is filled with
// empty places (faint outlines), so the rank keeps its shape and nothing moves when a button comes or goes
const grid3 = (cells) => {
	const n = cells.reduce((s, c) => s + (/class="[^"]*\bs4\b/.test(c) ? 2 : 1), 0); // a double-wide cell (s4) takes two of the three places (preview 48: a four-resource cost)
	return n ? acts(cells.join('') + empty().repeat((3 - (n % 3)) % 3), 'c3') : '';
};
const list = (cells, per = 3) => {
	let h = '',
		i = 0;
	for (let r = 0, k = Math.ceil(cells.length / per); r < k; r++) {
		const m = Math.ceil((cells.length - i) / (k - r));
		h += acts(cells.slice(i, (i += m)).join(''), 'c' + m);
	}
	return h;
};
// the info cell: no frame; the value in Cream 1, its label in Cream 2 under it, both at 12. cls: its span, left for a sentence, line for a
// line of a card (inset, on one line); act: where a tap on it goes (what is coming: tap to look)
const info = (value, label, cls = '', act) =>
	`<div class="info ${cls}"${act ? ` data-act="${act}"` : ''}><b>${value}</b>${label ? `<small>${label}</small>` : ''}</div>`;
// a fixed place with nothing in it: a faint plain outline (never dashed)
const empty = (cls = '') => `<div class="empty ${cls}"></div>`;
// One pager (N13, the Mail; hunt B #1, the Chronicle): rows MSG.page to a page, a short page padded with pad so nothing moves, and Previous ·
// mid · Next under them, sending verb:-1 and verb:1. Returns [the page shown, its rows, the pager's rank].
function pager(rows, at, verb, pad, count, mid = empty()) {
	const pages = Math.max(1, Math.ceil(rows.length / MSG.page)),
		pg = clamp(at || 0, 0, pages - 1),
		show = rows.slice(pg * MSG.page, (pg + 1) * MSG.page);
	while (show.length < MSG.page) show.push(pad);
	return [
		pg,
		show.join(''),
		acts(
			btn(`${verb}:-1`, 'Previous', `page ${pg + 1} of ${pages}`, pg ? '' : 'dis') +
				mid +
				btn(`${verb}:1`, 'Next', count, pg < pages - 1 ? '' : 'dis'),
			'c3',
		),
	];
}
// ── the controls (v80, the control sheet, Albert Oct 31), each built once and whole slots wide (span: s1 to s6), corners 6. Only the pieces
// a card uses are built: the bar (choice), the selector, the slider with its switch.
// choice: one shape (a bar) holding one set's choices (a box is one decision), each [act, words or an icon, chosen, cls, label]; a chosen part wears the
// gold ring inside the shape. one: a selector, a single choice, its gold ring sliding 0.4 s to rest over it
const choice = (opts, span, one, cls = '') =>
	`<div class="bar${one ? ' sel' : ''}${cls ? ' ' + cls : ''} ${span}" style="--n:${opts.length}${one ? `;--i:${Math.max(0, opts.findIndex((o) => o[2]))}` : ''}">${opts
		.map(
			([act, w, on, cls, label]) =>
				`<button data-act="${act}" class="${on ? 'on' : ''}${cls ? ' ' + cls : ''}"${label ? ` aria-label="${label}"` : ''}>${w.indexOf('<') < 0 ? `<b>${cap1(w)}</b>` : w}</button>`,
		)
		.join('')}</div>`;
// a setting's name, quiet at 12, in the slots its control leaves on the left (Setup, MENU-SPEC §8)
const lab = (name, span) => `<div class="info left line quiet ${span}"><b>${name}</b></div>`;
// the slider with its switch: the word, the value and the switch over the track, gold to the knob. The switch (tog, a verb) turns it on or
// off and off keeps the value; the track (inp, a verb given ",value") snaps to step. dis: locked, quiet, and the track does not move.
// Its key (data-f) holds it when on or dis changes, so the patch keeps the node and the drag under the finger (a class change rebuilt it)
const slt = (tog, inp, word, val, v, max, step, on, dis, span = 's2') =>
	`<div class="slt ${span}${on && !dis ? ' on' : ''}${dis ? ' dis' : ''}" data-f="slt-${inp}"><button class="hr" data-act="${tog}"><b>${word}</b><small>${val}</small><i class="sw"></i></button>` +
	`<input class="hr" type="range" data-in="${inp}" min="0" max="${max}" step="${step}" value="${v}" style="--v:${Math.round((100 * v) / max)}%" aria-label="${word}"${dis ? ' disabled' : ''}></div>`;
const FOLD = new Set(); // explanations live behind a small fold, closed unless you opened it; it stays as you left it while the card redraws
// the book entry of a research step: the date, what it changed, and its weight (how much it changed the world, not its cost: N11)
const techBook = (t) =>
	`<p><b>${t.name}</b>${t.when ? ` · ${t.when}` : ''}${t.w ? ` · weight ${t.w} of 10` : ''}: ${t.desc}${techWhy(t.id) ? ` ${techWhy(t.id)}` : ''}</p>`;
// tabs are a file folder (MENU-SPEC §1): one rank of tabs; the open one joins one Gold 1 outline round its whole page, the outline down
// the middle of the 6 gap. opts: [key, name, sub]; page: the page under the tabs
const folder = (key, opts, cur, page, cls = 'c2') =>
	`<div class="fo">${acts(opts.map(([k, t, sub]) => btn(`${key}:${k}`, t, sub, cur === k ? 'on' : '')).join(''), cls)}<div class="pg">${page}</div></div>`;
const INFO = new Set(['why', 'bmore', 'about', 'menu']);
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
// a rank of six slots in a card, on the row's mold (pic): an icon over its word. Each [act, icon, word, cls], or null for an empty place
const rowHTML = (slots) => acts(slots.map((s) => (s ? pic(s[0], s[1], s[2], s[3]) : empty())).join(''), 'c6');
// a card's name and subtitle: kept here and laid by renderCard as the title bar, which knows the book and the way back
let cardHead = ['', ''];
const title = (name, sub, look) => ((cardHead = [name, sub || '', look]), ''); // look: a building's title box, its age on the top edge and its health a bar on the bottom (Nov 2)
// The title bar (MENU-SPEC §4), one rank on every card: back · the name, slots 2 to 4 · the book · ×; the subtitle on the line under it.
// A name too long for slots 2 to 4 shows its short one (TITLE_SHORT), its full name going to the subtitle. The book is dim on a card
// without one, so nothing moves.
function titleBar([name, sub, look], book, bookOn) {
	const t = TITLE_SHORT[name] || name,
		s = t === name ? sub : [sub, name].filter(Boolean).join(' · ');
	const lock = cardLocked() ? ' class="dis"' : '', // a card that must be answered: close is dim
		from = !!(G.card && G.card.from); // back only on a card with a parent (Albert, Nov 3: cards open from the controller, so most have nowhere to go back to); the name widens into its slot
	return (
		`<div class="tb fm">${from ? `<button data-act="cardback" aria-label="Back">${ICON.back}</button>` : ''}<h3 class="${from ? 's3' : 's4'}${look ? ` a${look.age}${look.work !== undefined ? ' work' : ' life'}` : ''}"${look ? ` style="${look.work !== undefined ? toGo(1 - look.work) : `--hp:${Math.round(look.hp * 100)}%;--hc:${grad(look.hp * 2 - 1)}`}"` : ''}>${t}</h3>` +
		`<button data-act="info" class="${book ? (bookOn ? 'on' : '') : 'dis'}" aria-label="About this">${ICON.book}</button>` +
		`<button data-act="close"${lock} aria-label="Close">${ICON.close}</button></div>${s ? `<div class="sub">${s}</div>` : ''}`
	);
}
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
	return kinds.map((k) => {
		const ck = civKind(0, k),
			U = UNIT[ck],
			why = trainWhy(0, k),
			n = queuedOf(0, k);
		const full = U.cls && clsCount(0, U.cls) >= clsMax(U.cls, 0);
		const cost = unitCost(0, ck),
			told =
				U.age > p.age
					? `${AGES[U.age].name} age`
					: !ready(0, U.at).length
						? `no ${BLD[U.at].name.toLowerCase()}` // the building it needs, short enough for its slot (E8: "needs a siege workshop" grew the rank)
						: full
							? `short of room ${clsCount(0, U.cls)}/${clsMax(U.cls, 0)}`
							: !afford(p, cost)
								? `short ${need(cost)}`
								: costText(cost),
			sub = why && told === costText(cost) ? (p.hungry ? 'hungry' : 'line full') : told; // refused for a reason none of the above says (hunger, a full line): the reason, never the cost as if payable (E6), in a double slot's few words (T1)
		return btn(
			`train:${k}`,
			TITLE_SHORT[stats(0, ck).name] || stats(0, ck).name, // a name too long for its slot shows its short one
			sub + (n ? ` ×${n}` : ''),
			why ? 'dis' : '',
			sub.startsWith('short ') && !full ? fillOf(cost) : sub === costText(cost) ? 1 : undefined,
		);
	}); // the cells, for a list
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
// why a step is locked, in a slot's few words: its age (as the Build menu says it), the step it needs (by its short name), or the building
const lockedWhy = (t) => {
	const nd = needsOf(t).find((n) => !G.P[0].techs.has(n));
	return t.age > G.P[0].age
		? `${AGES[t.age].name} age`
		: nd
			? `needs ${TECHBY[nd].short || TECHBY[nd].name}`
			: researchWhy(0, t.id).replace(/\.$/, '').replace(/^Needs an? /, 'no '); // a building it needs: no lumber camp
};
function techBtn(t, withAt) {
	const st = techState(t),
		c = techCost(0, t);
	const sub =
		st === 'busy'
			? researchWhy(0, t.id) === 'Being researched.'
				? 'researching'
				: 'line full'
			: st === 'short'
				? `short ${need(c)}`
				: st === 'locked'
					? lockedWhy(t)
					: costText(c);
	return btn(
		`tech:${t.id}`,
		TITLE_SHORT[t.short] || t.short || t.name, // its short name on a double-wide slot (an elite rank's, the soldier's short one)
		sub, // a locked step says what it lacks; its › goes to the building (the building's word left the line at 14 px, preview 48; withAt is kept for the call)
		`a${t.age} ` + (st === 'ready' ? 'go' : st === 'short' ? 'dis short' : st === 'busy' ? 'dis' : 'dis lock'),
		st === 'short' ? fillOf(c) : st === 'ready' ? 1 : undefined,
	); // a${age}: the top edge wears the age's colour
}
const trainsAt = (kind) =>
	Object.keys(UNIT).filter(
		(k) => (UNIT[k].at === kind || (UNIT[k].also || []).includes(kind)) && !UNIT[k].civ && UNIT[k].cost,
	);
function keepAgeBtn(cls = '') {
	// the next age, as one research button; the reason waits behind the book
	const p = G.P[0],
		A = nextAge(0);
	if (!A) return '';
	fold('why', 'Why this age?', `<p>${WHY['age' + (p.age + 1)]}</p>`);
	return btn(
		'age',
		`${A.name} age`,
		p.aging ? 'advancing' : !afford(p, A.cost) ? `short ${need(A.cost)}` : costText(A.cost),
		(p.aging || !afford(p, A.cost) ? 'dis' : 'go') + (cls ? ' ' + cls : ''),
		p.aging ? undefined : afford(p, A.cost) ? 1 : fillOf(A.cost),
	);
}
// what one of yours is doing, in words read from its state; and what it has done in its life
function statusOf(u) {
	const nm = (b) => bldName(0, b.kind).toLowerCase();
	if (u.inside)
		return u.shop && u.node
			? `at work in the ${nm(u.node.farm)}`
			: u.state === 'garrison'
				? 'DEFENDING inside'
				: 'sheltering inside';
	if (u.state === 'garrison') return 'DEFENDING: going in';
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
							: n.type === 'stone'
								? 'quarrying'
								: n.farm.kind === 'farm'
									? 'working the field'
									: `working the ${nm(n.farm)}` // a shop's own name (Build 60: it read a field key no building has, so every shop and the quarry said field)
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
			: `walking to the ${n.farm ? nm(n.farm) : nodeName(n).toLowerCase()}`; // a plot or a shop by its building's name (a workshop's worker said field)
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
	{
		const st = armyStatus(u),
			O = u.ord && G.ords && G.ords[u.ord],
			eta = O && !O.arrived && O.eta ? `, ${O.eta} s` : '';
		if (st === 'rout') return 'routed: running from the fight';
		if (st === 'rally') return 'walking to its place';
		if (st === 'march')
			return u.state === 'attack'
				? `marching on the ${G.P[u.target] ? G.P[u.target].name : 'enemy'}${eta}`
				: `marching${eta}`;
		if (st === 'hold') return u.state === 'goto' ? 'holding the spot' : 'holding at home';
	} // Rallying, Marching, Holding, Routed: one word each (Build 42); Fighting is above
	return u.state === 'escort'
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
	return (
		`<p>${wk ? `<i>${wk} of ${n.kind === 'farm' ? slotsOf(n) : findCap(n)} at work:</i> ` : ''}each takes ${Math.round(rate)} ${n.type} a minute and carries ${carry} a trip${wk ? `; together about ${Math.round(rate * wk)} a minute` : ''}${fin && wk ? `; gone in about ${clock((n.amt / (rate * wk)) * 60)}` : ''}.${fin && n.max > 0 ? ` Taken so far: ${Math.round(n.max - n.amt)} of ${Math.round(n.max)}.` : ''}</p>` +
		bonusText(n, o)
	);
}
// what lifts or lowers a find's take, named (Build 63, Albert: "show if something is getting a bonus"): the research and buildings whose
// effect reaches it, the season and the sky, and how far its drop-off stands (the walk is the other half of the rate)
function bonusText(n, o) {
	if (n.kind === 'fish' && n.type !== 'food') return '';
	const c = fxList(o),
		named = [];
	for (const [stat, keys] of [
		['gather', nodeKey(n)],
		[n.kind === 'farm' ? 'crop' : null, [n.type]],
		[n.farm && BLD[n.farm.kind].makes ? 'make' : null, [n.type]],
	]) // the keys gatherMul asks each stat with
		if (stat)
			for (const f of c[stat] || []) if (fxFits(f, keys) && f.m && f.m !== 1) named.push(`${f.name || fxName(f)} ×${f.m}`);
	if (n.kind === 'farm' && SCALE.kinds.includes(n.farm.kind) && fxv(o, 'scale').a) {
		const k = Math.min(SCALE.cap, Math.max(0, bldsOf(o, n.farm.kind).filter((b) => standing(b, o)).length - 1));
		if (k) named.push(`Learning by doing ×${(1 + SCALE.per * k).toFixed(2)}`); // the Store's line, as gatherMul counts it (p44)
	}
	if (n.kind === 'farm' && n.type === 'food') {
		if (season().farm !== 1) named.push(`${season().name} ×${season().farm}`);
		if ((G.harvest || 1) !== 1) named.push(`harvest ×${G.harvest}`);
		if (WEATHER[G.wx].crop) named.push(`${WEATHER[G.wx].name.toLowerCase()} ×${WEATHER[G.wx].crop}`);
	}
	const dr = n.kind === 'fish' ? null : dropFor(o, n.type || 'food', n) || keepOf(o),
		d = dr ? Math.round(dist(dr, n)) : 0,
		near = d <= 60;
	return `<p class="dim"><i>Bonus:</i> ${named.length ? named.join(' · ') : 'none yet'}. <i>Drop-off:</i> ${dr ? `${bldName(o, dr.kind)} ${d} away${near ? '' : ' · far: a camp nearer pays more'}` : 'none'}.</p>`;
}
// the name of the research or building an effect came from (the effects carry no name of their own)
function fxName(f) {
	const t = TECH.find((x) => (x.fx || []).includes(f));
	if (t) return t.name;
	const b = Object.keys(BLD).find((k) => (BLD[k].fx || []).includes(f));
	if (b) return BLD[b].name;
	const cv = Object.keys(CIVS).find((k) => (CIVS[k].fx || []).includes(f));
	return cv ? CIVS[cv].name : 'a bonus';
}
const goodsText = (g) =>
	[...GOODK, 'f', 'w', 's', 'i']
		.filter((k) => g[k] >= 1) // goods, and a cart's raw load
		.map((k) => `${Math.floor(g[k])} ${nameOf(k)}`)
		.join(', ');
const ownTech = (t) => !t.civ || t.civ === G.P[0].civ; // research this people can do: the others' elite ranks stay out of sight
const fillOf = (c) => Math.min(1, ...Object.keys(c || {}).map((r) => (G.P[0].res[r] || 0) / (c[r] || 1)));
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
				? TECHBY[j.tech].short || TECHBY[j.tech].name
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
// what you know of a side's strength: all of it with no fog, or a spy's report still fresh; else only the soldiers and towers you see
function knownPower(t) {
	const I = G.intel[t],
		all = !G.fogOn || (I && G.t - I.t < TELL.spy);
	if (all) return { pow: estPower(0, t), foes: soldiersOf(t), seen: false };
	const foes = soldiersOf(t).filter(visibleTo0);
	if (!foes.length) return null;
	return { pow: powerFrom(foes, bldsOf(t, 'tower').filter(knownB).length), foes, seen: true };
}
function oddsText(S, t) {
	if (t === null || t === undefined || !S.length) return '';
	const K = knownPower(t);
	if (!K) return 'odds unknown';
	const p = lanchester((powerOf(S) / K.pow) * matchup(S, K.foes));
	return `odds ${p > 0.65 ? 'strong' : p > 0.4 ? 'even' : 'weak'}${K.seen ? ', seen' : ''}`;
}
// ═════ 29-card-pages.js: what a building adds to its card: market, council, workshop and the rest ═════
// ───────────────────────── What a building's page says, by kind ─────────────────────────
// A building's card (MENU-SPEC §8): an info rank (what it holds or does, health, age), its line, its techs, Help · Repair · Raze. What a kind
// adds is one entry here, never a branch in the page: fact, the first cell of the info rank ([value, label]); book, its explaining text,
// behind the book icon; page, the slots it adds. Every number on the face is a value in a cell; every sentence goes to the book.
const BLD_PAGE = {
	castle: (b) => {
		const n = G.units.filter((u) => u.owner === 0 && isSoldier(u) && u.hp < u.max && dist(u, b) < GARRISON.r).length;
		return { fact: [`${n} mending`, `heals ${GARRISON.heal * fxv(0, 'garrison').m} a second`] };
	},
	school: () => ({
		fact: [
			`${schooling(0)} of ${TEACH.seats * ready(0, 'school').length} seats`,
			fxv(0, 'teach').a < 1 ? 'research Veterans first' : 'tap a soldier, then Teach',
		],
		book: '<p>Research Veterans at the Barracks to send soldiers here; then tap a soldier and Teach.</p>',
	}),
	farm: (b) => ({
		fact: [
			b.node && b.node.wk > 0 ? `${slotText(b.node)} at work` : 'Nobody at work',
			`${season().name} ×${season().farm} · soil ${Math.round((b.fert ?? 1) * 100)}%`,
		],
		book:
			`<p>This season: ${season().name}, ×${season().farm}${G.harvest !== 1 ? ` · the harvest this year ×${G.harvest}` : ''}${WEATHER[G.wx].crop ? ` · ${WEATHER[G.wx].name.toLowerCase()} ×${WEATHER[G.wx].crop}` : ''}. Tap Send a villager${b.node && b.node.type === 'food' ? ', or + under Food' : ''}.</p>` +
			(b.node ? yieldText(b.node, 0) : ''),
	}),
	treefarm: (b) => ({
		fact: [
			`${Math.round(b.node ? b.node.amt : 0)} wood left`,
			b.node && b.node.wk > 0 ? `${slotText(b.node)} tending` : 'nobody tending',
		],
		book: '<p>Tended by the villagers you send, or + under Wood. When its wood is gone the plot is cut out: replant it at half the cost.</p>',
	}),
	pasture: (b) => ({
		fact: [
			`${b.sheep || 0} sheep`,
			`${b.node && b.node.wk > 0 ? `${Math.round((b.sheep || 0) * BLD.pasture.milk * 60 * gatherMul(0, b.node))} food a minute` : 'nobody tends them'} · ${Math.floor(b.node ? b.node.amt : 0)} wool`,
		],
		book: `<p>Milk and meat while tended; wool to bring in${ready(0, 'workshop').length ? '' : ', which waits for a Workshop'}. Shorn each spring, when lambs come too.</p>`,
	}),
	throne: () => {
		const T = G.throne;
		return {
			fact: T
				? [
						`${clock(Math.max(0, throneHold() - (G.t - T.since)))} to ${T.owner === 0 ? 'win' : 'their win'}`,
						`${T.owner === 0 ? 'yours' : G.P[T.owner].name} since ${clock(T.since)}`,
					]
				: ['The Natives hold it', 'regard opens its gate'],
			book: `<p>Regard opens its gate; siege breaks it. Who holds it takes a tithe of ${THRONE.tithe * 100}% of the gathering of everyone else, and ${THRONE.score} score a minute.</p>`,
		};
	},
	tpost: (b) => {
		const f = byId(G.finds, b.sid);
		return f ? { fact: [`Holds ${coord(f.x, f.y)}`, 'tap the stop for prices'] } : {};
	},
	council: () =>
		hasCmd()
			? {
					page: list(
						BN.map((n, j) => btn(`wsq:${j}`, n, `${armyOf(0).filter((u) => u.kind !== 'spy' && u.bn === j).length} in it`)),
					), // each opens its card, where it is built (39-huddle); three are one rank
					book: `<p>New soldiers fill each squad up to what you set on its card; the rest are the reserve. Send them from the War page with Go.</p><p><b>Shape:</b> ${FORM.map((F) => `${F.name}: ${F.note}`).join('. ')}.</p>`,
				}
			: {
					fact: ['No squads yet', G.P[0].techs.has('engage') ? 'next: Battalions' : 'first: Engagement'],
					book: `<p>${G.P[0].techs.has('engage') ? 'Temper is open: set it in the Army card. Next: Battalions, three squads.' : 'Research Engagement first: shooters step back. Then Battalions, Formations and Muster.'}</p>`,
				},
	market: (b) => marketPage(b),
	mint: () =>
		G.P[0].debased
			? { fact: ['Coin debased', `Market prices ×${MINT.price}`] }
			: {
					page: acts(
						btn(
							'debase',
							'Debase the coin',
							`+${MINT.debase} gold now · Market prices ×${MINT.price} for good`,
							'warn',
						),
						'c1',
					),
				},
};
// the first cell of a building's info rank: going up, burning, a wonder's clock, or what its kind says; else the room it gives
function factOf(b, X, crew) {
	const B = BLD[b.kind];
	if (b.prog < 1) return [`Building ${Math.round(b.prog * 100)}%`, '']; // who works it, Send a villager says
	if (b.owner === 0 && b.fire > 0) return ['On fire', `${crew.length} with buckets`];
	if (G.wonder && G.wonder.id === b.id)
		return [`${clock(Math.max(0, G.wonder.end - G.t))} to ${b.owner === 0 ? 'win' : 'their win'}`, 'the wonder stands'];
	return X.fact || (B.room ? [`Room for ${B.room}`, ''] : null);
}
// A building's line (MENU-SPEC §3, §8): a fixed capacity, one single a place, the first working (its green ring what is left of it, red when
// it cannot go on: no room, or sabotage). Tap a filled one and its order is cancelled, its cost back; an empty place is a faint outline.
// Six singles a rank: past six the last reads +n (a tap cancels the last order); short of six, the place a research would add reads +n, locked.
function slotsHTML(b) {
	const n = qMax(0),
		q = b.q,
		cells = [],
		stop = b.blocked ? 'needs room' : b.stall > G.t ? `sabotage ${Math.ceil(b.stall - G.t)} s` : '';
	let t = 0;
	for (let i = 0; i < Math.min(n, 6); i++) {
		const j = q[i];
		if (i === 5 && q.length > 6) {
			cells.push(
				`<button class="slot" data-act="qcancel:${b.id},${q.length - 1}" aria-label="Cancel the last order"><b>+${q.length - 5}</b><small>more</small></button>`,
			);
			break;
		}
		if (!j) {
			cells.push(empty());
			continue;
		}
		t += i ? j.total : j.left;
		cells.push(
			`<button class="slot${i ? '' : stop ? ' warn' : ' work'}" data-act="qcancel:${b.id},${i}"${i ? '' : ` style="${toGo(j.left / j.total)}"`} aria-label="Cancel ${qName(j)}"><b>${qName(j)}</b><small>${i || !stop ? clock(t) : stop}</small></button>`,
		);
	}
	const more = n < 6 && TECH.find((t) => (t.fx || []).some((f) => f.s === 'queue') && !G.P[0].techs.has(t.id)); // the next places, locked: a tap says how to open them
	if (more)
		cells.push(
			`<button class="slot dis" data-act="qlock:${more.id}" aria-label="More places: ${more.name}"><b>+${more.fx.find((f) => f.s === 'queue').a}</b><small>${more.short || more.name}</small></button>`, // the research that opens them, by name ("+2 Guilds", cold review of v70)
		);
	return acts(cells.join(''), 'c6 queue'); // the queue's steel box (Q1)
}
// Relations, at the Town Center (v80, Albert Oct 31: "we are locking into the final"; picture Relations Final; decision 3: a ✓ for each
// row): one rank a side. The name, its stance under it in the stance's colour; the gift, a slider with its switch (a bribe is a step for
// anyone not a friend, so a friend's gift is locked; the misfit groups take one, the computers none); the stance, three icons in two slots;
// the row's ✓. What is picked waits on the card (G.relPick) until that row's ✓ sends it: the picked icon wears the gold ring, the stance
// held now stays in the name's colour, and the ✓ turns blue. The last rank says what the last ✓ touched will do, and the board
// Two pages (answers 1 and 1b, Albert Nov 1; picture Relations Misfits): Relations, the computers, a stance only (no gifts to rivals); Misfits,
// the Natives (WILD) and the outlaws, bandits and robbers (by their GANG key), each a bribe and a stance
const relSides = () => G.P.filter((q) => q.id !== 0 && q.id !== WILD && q.alive).map((q) => q.id);
const MISFITS = [WILD, 'out', 'ban', 'rob'];
const relKey = (a) => (GANG[a] ? a : Number(a)); // a row's key from a verb: a group's key, or a side's number
// a side whose stance is not yours to pick here: your vassal (their own page) or your overlord
const relLord = (q) => !gangKey(q) && ((G.P[q].lord === 0 && !G.P[q].rebel) || (G.P[0].lord === q && !G.P[0].rebel));
const relName = (q) => (gangKey(q) ? GANG[gangKey(q)] : G.P[q].name);
// a stance this row cannot take, so its icon is dim and a tap on it picks nothing: your vassal or overlord (their own page). Every misfit
// group can be pushed to friend, as the Natives (Albert, Nov 1), so none of theirs is dim
const stanceOff = (q) => relLord(q);
const relOf = (q) => (gangKey(q) ? gangRel(0, gangKey(q)) : G.rel[0][q]); // the stance held now
const giftLock = (q) => (!gangKey(q) ? 'No gifts to rivals.' : relOf(q) === 'ally' ? 'A gift to a friend is locked.' : null);
// what the row's ✓ would send: [gift or 0, stance or null], and why it cannot, or null
function relDraft(q) {
	const d = (G.relPick || {})[q] || {},
		rel = relOf(q),
		gift = d.on && d.gift > 0 && !giftLock(q) ? d.gift : 0,
		want = d.want && d.want !== rel ? d.want : null;
	return [gift, want, (gift && giftWhy(0, gift, gangKey(q))) || (want && relWhy(0, q, want)) || null];
}
const relPickOf = (q) => {
	G.relPick = G.relPick || {};
	G.relPick.last = q;
	return G.relPick[q] || (G.relPick[q] = {});
};
function relRow(q) {
	const g = gangKey(q),
		rel = relOf(q),
		d = (G.relPick || {})[q] || {},
		lord = relLord(q),
		lock = giftLock(q),
		[gift, want, why] = relDraft(q),
		nl = g ? 0 : noticeLeft(0, q) || noticeLeft(q, 0),
		war = !lord && nl, // under notice: the stance it is becoming, and when
		word = lord ? (G.P[q].lord === 0 ? 'vassal' : 'overlord') : war ? `${REL_WORD.war.toLowerCase()} in ${nl} s` : REL_WORD[rel],
		sw = (k) => `<span class="stance-${k}">${REL_WORD[k]}</span>`,
		// a stance picked and not yet sent: the change, each word in its stance's colour (Albert, Nov 1); once sent, the new stance alone
		// (a Misfits row's name is one slot: the change takes two lines there, "Foe →" over "Neutral", so it fits at 375)
		line =
			want && !lord && !war
				? g
					? `<small class="chg">${sw(rel)}→</small><small class="chg">${sw(want)}</small>` // no space before the arrow: "Neutral→" fits the one slot at 14 px (preview 48)
					: `<small class="chg">${sw(rel)} → ${sw(want)}</small>`
				: `<small class="${lord ? '' : 'stance-' + (war ? 'war' : rel)}">${word}</small>`;
	return acts(
		`<div class="info left line ${g ? 's1' : 's3'}"><b>${relName(q)}</b>${line}</div>` +
			(g
				? slt(`relon:${q}`, `relgift:${q}`, 'Bribe', lock ? '—' : `${d.gift || 0}g`, lock ? 0 : d.gift || 0, REGARD.giftMax, REGARD.giftStep, d.on, !!lock)
				: '') +
			choice(
				Object.keys(REL_WORD).map((k) => [
					`relwant:${q},${k}`,
					ICON[k],
					(d.want || rel) === k,
					`stance-${k}${stanceOff(q, k) ? ' dis' : ''}`,
					REL_WORD[k],
				]),
				's2',
				true,
				'thin', // three icons in two slots: under 44 each (EXCEPTIONS #13)
			) +
			sym(`relok:${q}`, ICON.ok, gift || want ? (why ? 'dis' : 'go') : 'dis', `Send to the ${relName(q)}`),
		'c6',
	);
}
// what the last ✓ touched will do, in a line; and the board: at peace or not, the Games, the Natives' regard
function relStatus(mis) {
	const q = (G.relPick || {}).last,
		tf = truceFor(),
		next = Math.max(0, PEACE.games.every - (G.t - (G.gamesT ?? 0))),
		board = mis
			? `regard ${MISFITS.map((k) => Math.round(regardOf(0, gangKey(k)))).join(' · ')}, peace at ${REGARD.peaceAt}` // the rows' order
			: `${G.truce === null ? 'not at peace' : `at peace ${clock(tf)}`} · ${next > 0 ? `Games in ${clock(next)}` : 'Games at the next peace'}`;
	let line = mis ? 'Pick a bribe or a stance, then its ✓' : 'Pick a stance, then its ✓';
	if (q !== undefined && (mis ? MISFITS.includes(q) : !gangKey(q))) {
		const [gift, want, why] = relDraft(q);
		if (why) line = `${relName(q)}: ${why.replace(/\.$/, '')}`;
		else if (gift || want)
			line = `${relName(q)}: ${[gift ? `send ${gift}g` : '', want ? REL_WORD[want].toLowerCase() : ''].filter(Boolean).join(' · ')}`; // the stance in its one word (REL_WORD)
	}
	return acts(info(line, board, 'left line'), 'c1');
}
function relHTML(mis) {
	const spare = Math.max(
			0,
			soldiersOf(0).filter((u) => u.state === 'home' && !u.inside).length - Math.ceil(soldiersOf(0).length * PEACE.stand.keep),
		),
		P = (G.prisoners || []).filter((x) => x.o === 0),
		H = (G.prisoners || []).filter((x) => x.by === 0);
	fold(
		'about',
		'About',
		`<p><b>The sides:</b> ${relSides()
			.map((q) => `${G.P[q].name}, ${G.P[q].civ ? CIVS[G.P[q].civ].name : 'no people'}${G.P[q].ally !== null && G.P[q].ally !== undefined && G.P[q].ally !== 0 ? `, with ${G.P[G.P[q].ally].name}` : ''}`)
			.join('; ')}.</p>` +
			`<p><b>Misfits:</b> the Natives, the outlaws (the horde), the bandits and the robbers each keep their own regard for you. A bribe raises it, each buying less than the last for ${REGARD.giftWindow / 60} minutes; blows on them lower it. At ${REGARD.peaceAt} they leave you be; under it they are foes. At ${REGARD.allyAt} an emissary can make any of them a friend; a bribe to a friend is locked. Animals are foes to all. No gifts to rivals.</p>` +
			`<p><b>Stance:</b> neutral keeps both swords sheathed; a foe after ${NOTICE} s of notice (a misfit group at once, for ${REGARD.warCost} regard); a friend needs their yes, carried by an emissary.</p>` +
			`<p><b>The board:</b> ${G.enlight ? `the ${AGES[5].name} is open.` : `a year of peace opens the ${AGES[5].name}${G.truce === null ? '' : ` (${clock(Math.max(0, PEACE.age.truce - truceFor()))} to go)`}.`} Laurels: ${G.P[0].laurels || 0}.</p>` +
			(H.length
				? `<p><b>You hold ${H.length}:</b> ${H.map((x) => `a ${UNIT[x.kind].name.toLowerCase()} of ${G.P[x.o].name}`).join(', ')}. Unransomed in ${PRISON.secs / 60} minutes, they serve you.</p>`
				: ''),
	);
	return (
		(mis ? MISFITS : relSides()).map(relRow).join('') +
		relStatus(mis) +
		list([
			...P.map((x, i) =>
				btn(
					`ransom:${i}`,
					`Ransom ${UNIT[x.kind].name.toLowerCase()}`,
					`${x.ransom}g · ${x.by === WILD ? 'Natives' : G.P[x.by].name} · ${clock(Math.max(0, x.t + PRISON.secs - G.t))}`,
					G.P[0].res.g >= x.ransom ? 'warn' : 'dis',
				),
			),
			spare ? btn('stand', 'Stand down', `${spare} spare soldiers to the fields`, 'warn') : '',
		].filter(Boolean))
	);
}
// a workshop turns what is in store into goods: the same page for every one of them. The making is a slot of its own, its green ring the
// share of the next one still to go; what it makes is a picker, the chosen one gold. The count made and the store are the fact
function workshopPage(b) {
	const p = G.P[0],
		B = BLD[b.kind],
		cur = b.cropT || B.crop,
		mk = B.makes[cur],
		[k, r] = Object.entries(mk.from)[0],
		low = (a) => (GOODS[a] ? GOODS[a].name.toLowerCase() : LONG[a]),
		nm = (t) => (GOODS[t] ? GOODS[t].name : (RESOURCES[t] || RESOURCES[LONG[t]]).name),
		keys = Object.keys(B.makes),
		w = G.units.find((u) => u.owner === 0 && u.node === b.node),
		made = b.made || 0,
		fr = made % 1; // the next one, part made
	return {
		fact: [
			`${Math.floor(made)} made`,
			`${Math.floor(k in p.res ? p.res[k] : p.goods[k] || 0)} ${low(k)} in store`,
		],
		book: `<p>${r} ${low(k)} make one ${nm(cur).toLowerCase()}; ${Math.round(mk.rate * 60 * fxv(0, 'make', [cur]).m)} a minute when worked.</p>`,
		page: list([
			`<button class="${w ? 'work' : 'dis'}" disabled style="${toGo(1 - fr)}"><b>${nm(cur)}</b><small>${!w ? 'nobody yet' : w.wait ? `waiting for ${low(k)}` : w.inside ? 'making' : 'walking in'}</small></button>`,
			...(keys.length > 1
				? keys.map((t) =>
						btn(
							`make:${b.id},${t}`,
							nm(t),
							`${Object.entries(B.makes[t].from)
								.map(([a, q]) => q + ' ' + low(a))
								.join(', ')} make 1`,
							t === cur ? 'on' : '',
						),
					)
				: []),
		]),
	};
}
// the Market (MENU-SPEC §8, picture Market Card; v80 keeps v70's layout, no new drawing): on the shared building page (E11: it had skipped
// it, so a burning Market had no Send help and no health); its fact the caravans; the goods one selector with what you have, the picked
// one gold; its price, one Sell and one Buy for it; ventures from their age
function marketPage(b) {
	const p = G.P[0],
		V = p.ventures || [],
		k = MKT_SELL.includes(G.mktK) ? G.mktK : MKT_SELL[0],
		nm = (g) => (GOODS[g] ? GOODS[g].name : RESOURCES[LONG[g]].name),
		cv = unitsOf(0, 'caravan').length,
		buy = MKT_BUY.includes(k);
	return {
		fact: [`${cv} ${some(cv, 'caravan')}`, V.length ? `${V.length} ${some(V.length, 'venture')} out` : 'tap a good, then Sell or Buy'],
		book: `<p>Sell or buy a lot at a time: 100 of a resource, 10 of a good. Prices rise and fall with what everyone buys and sells.</p><p>Two lanes. One: a caravan with a route takes goods from here to a trade stop and sells them. Two: a caravan with no route runs to an ally's Market or Town Center and earns distance² ÷ ${TRADE_DIV}, at most ${TRADE_CAP} gold. ${allyMarket(0, b) ? 'An ally to trade with.' : 'No ally yet.'}</p><p>${p.age < VENTURE.age ? `From the ${AGES[VENTURE.age].name} age: put gold into a merchant venture.` : `A venture comes back in a year with ${Math.round((VENTURE.back - 1) * 100)}% more; about 1 in ${Math.round(1 / VENTURE.lost)} is lost.`}${V.length ? ' Out: ' + V.map((v) => `${v.amt}g (${clock(Math.max(0, v.due - G.t))})`).join(', ') + '.' : ''}</p>`,
		page:
			acts(choice(MKT_SELL.map((g) => [`mpick:${g}`, `<b>${nm(g)}</b><small>${fmt(Math.floor(haveOf(p, g)))}</small>`, g === k]), 's6', true), 'c1') +
			acts(
				info(`×${mkt(k, 0).toFixed(2)}`, 'price') +
					btn(`trade:sell:${k}`, 'Sell', `${LOT(k)} for +${sellPrice(0, k)}g`, haveOf(p, k) < LOT(k) ? 'dis' : '') +
					btn(`trade:buy:${k}`, 'Buy', buy ? `${LOT(k)} for ${buyPrice(0, k)}g` : 'not sold here', !buy || p.res.g < buyPrice(0, k) ? 'dis' : ''),
				'c3',
			) +
			(p.age >= VENTURE.age
				? list(
						VENTURE.sizes.map((a) =>
							btn(`venture:${a}`, `Venture ${a}g`, `back ×${VENTURE.back} in a year`, p.res.g < a || V.length >= VENTURE.max ? 'dis' : ''),
						),
					)
				: ''),
	};
}
function keepMoreHTML() {
	// the Town Center's More: your people, goods and the whole research tree
	const p = G.P[0],
		C = CIVS[p.civ];
	let h = acts(btn('dismiss', 'Dismiss villager', 'frees a place'), 'c1');
	h += `<p><i>${C.name}.</i> ${C.bonus} Unique soldier: ${UNIT[C.uu].name}. Wonder: ${C.wonder}.</p>`;
	h += `<p><i>Food:</i> your people eat ${Math.round(p.eats || 0)} a minute${p.hungry ? ' · <b>none left: work and fighting −25%, no training</b>' : ''}. ${
		vassalsOf(0).length
			? `<i>Vassals:</i> ${vassalsOf(0)
					.map((q) => `${q.name} (${q.rebel ? 'in revolt' : `unrest ${Math.round(q.unrest)}%`})`)
					.join(', ')}.`
			: ''
	}</p>`;
	h += `<p><i>Goods:</i> ${goodsText(p.goods) || 'none yet'}. <i>Wanted by others here:</i> ${G.P.filter(
		(q) => q.id && q.id !== WILD && q.alive,
	)
		.map((q) => `${q.name} ${q.wants.map((k) => GOODS[k].name.toLowerCase()).join(' and ')}`)
		.join('; ')}.</p>`;
	const done = TECH.filter((t) => p.techs.has(t.id)),
		going = [],
		open = TECH.filter((t) => ownTech(t) && !p.techs.has(t.id) && !researchWhy(0, t.id));
	for (const b of G.blds)
		if (b.owner === 0)
			b.q.forEach((j, i) => {
				if (j.tech) going.push(`${TECHBY[j.tech].name}${i === 0 ? ` (${Math.ceil(j.left)} s)` : ' (waiting)'}`);
			});
	h += `<p><b>Research: ${done.length} of ${TECH.filter(ownTech).length} done.</b>${going.length ? ` <i>Under way:</i> ${going.join(' · ')}.` : ''}${open.length ? ` <i>Ready now:</i> ${open.map((t) => `${t.name} (${BLD[t.at].name})`).join(' · ')}.` : ''}</p>`;
	h += AGES.map((A, i) => {
		const T = TECH.filter((t) => ownTech(t) && t.age === i);
		return T.length
			? `<p><b>${A.name}:</b> ${T.map((t) => (p.techs.has(t.id) ? `<span class="done">✓ ${t.name}</span>` : `<span class="dim">${t.name}</span>`)).join(' · ')}</p>`
			: '';
	}).join('');
	return h;
}
function vassalHTML(P) {
	const L = loyaltyParts(P);
	let h = `<p><b>Your vassal.</b> ${P.rebel ? `<b>In revolt</b> since ${clock(G.t - P.rebel.t0)}: kill three quarters of their force to crush it, or they are free in ${clock(Math.max(0, VASSAL.freeAfter - (G.t - P.rebel.t0)))}.` : `Unrest ${Math.round(P.unrest)}% · loyalty ${Math.round(P.loyal)}% · paid ${Math.round(P.paid || 0)} in the last 10 s.`}</p>`;
	if (P.rebel) return h;
	h +=
		sec('Tax · a share of what they gather') +
		acts(
			Object.keys(TAX)
				.map((t) =>
					btn(
						`tax:${P.id},${t}`,
						t[0].toUpperCase() + t.slice(1),
						`${Math.round(TAX[t].take * 100)}%`,
						P.tax === t ? 'on' : '',
					),
				)
				.join(''),
			'c3',
		);
	fold(
		'about',
		'Loyalty',
		`<p><i>Loyalty heads for</i> 20 + ${L.invest} (your buildings near them) + ${L.garrison} (your soldiers there) + ${L.protect} (enemies you killed near them) − ${L.hate} (the tax) = <b>${Math.round(L.target)}</b>. Unrest moves by ${TAX[P.tax].push} − loyalty/25 every 10 s.${P.loyal >= VASSAL.shareAt ? ` You get ${VASSAL.share * 100}% of their trade profit.` : ` At ${VASSAL.shareAt} loyalty you get ${VASSAL.share * 100}% of their trade profit;`} ${P.loyal >= VASSAL.giftAt ? 'They send gifts.' : `at ${VASSAL.giftAt} they send gifts.`}</p><p>A demand costs more loyalty each time within two minutes. Forced tribute needs ${DEMAND.tributeMen} of your soldiers at their town. A levied soldier who dies costs ${DEMAND.levyLoyal} loyalty.</p>`,
	);
	// a lord's hand: demand, force, call up, cut loose
	const dc = demandCost(P);
	h +=
		sec(`Demand now · loyalty −${dc}`) +
		acts(
			['f', 'w', 's', 'g', 'i']
				.map((r) =>
					btn(
						`demand:${P.id},${r}`,
						RESOURCES[LONG[r]].name,
						`${Math.min(DEMAND.amt, Math.floor(P.res[r]))}/${Math.floor(P.res[r])}`, // what you would take of what they hold, on one line: the rank keeps its 44 (v80; EXCEPTIONS #12 gone)
						P.res[r] > 0 ? '' : 'dis',
					),
				)
				.join(''),
			'c5',
		);
	const tw = tributeWhy(0, P.id),
		lv = levyOf(0, P.id).length,
		half = levyRoom(0, P.id);
	h += acts(
		btn(
			`tribute:${P.id}`,
			'Force tribute',
			P.forced > G.t
				? `double tax: ${Math.ceil(P.forced - G.t)} s`
				: tw
					? tw.replace(/\.$/, '')
					: `double tax ${DEMAND.tribute / 60} min · unrest +${DEMAND.tributeUnrest}`,
			P.forced > G.t ? 'on' : tw ? 'dis' : 'warn',
		) +
			btn(
				`breakties:${P.id}`,
				G.confirm === 'bt' + P.id ? 'Tap again' : 'Break ties',
				G.confirm === 'bt' + P.id ? 'war, and the others grow wary' : 'cut them loose',
				'warn',
			),
	);
	h +=
		sec(`Call up their soldiers · ${lv} with you`) +
		list([
			...[4, 8].map((n) =>
				btn(
					`levy:${P.id},${n}`,
					`+${n}`,
					levyWhy(0, P.id, n) ? levyWhy(0, P.id, n).replace(/\.$/, '') : 'march to you',
					levyWhy(0, P.id, n) ? 'dis' : '',
				),
			),
			btn(`levy:${P.id},0`, 'Half', `${half}`, levyWhy(0, P.id, half) ? 'dis' : ''),
			btn(`release:${P.id}`, 'Release', lv ? `${lv} go home` : 'none', lv ? '' : 'dis'),
		]);
	return h;
}
function stopHTML(f) {
	const p = G.P[0],
		from = homeBiz(0, f) || keepOf(0),
		pt = postAt(f),
		mine = f.owner === 0,
		held = stopsHeld(mine ? 0 : f.owner, f.route);
	let h = `<p>Route ${f.route === 0 ? 'west–east' : 'north–south'}. ${f.owner === null ? (pt ? 'A post is going up.' : 'Nobody holds it.') : mine ? `Yours: ${Math.round(POST.cut[held] * 100)}% of the sales of everyone else here (you hold ${held} of this route's 4${held === 4 ? `, so it pays ${Math.round(POST.all * 60)} gold a minute` : ''}).` : `Held by ${G.P[f.owner].name}: they take ${Math.round(POST.cut[held] * 100)}% of your sales here.`} Wants <b>${GOODS[f.want].name.toLowerCase()}</b> (×${POST.want}).</p>`;
	h += `<p><i>Paid here, per good from your ${homeBiz(0, f) ? 'Market' : 'Town Center'}:</i> ${WARES.filter(
		(k) => k !== 'spice',
	)
		.map((k) => `${GOODS[k].name} ${Math.round(priceAt(0, k, f, from))}g`)
		.join(' · ')}. Spice costs ${GOODS.spice.buy}g here.</p>`;
	if (!pt && !guardsLeft(f))
		h += acts(
			btn(
				`tpost:${f.id}`,
				'Build a Trade post',
				p.age < 1 ? 'Bronze age' : costText(BLD.tpost.cost),
				p.age < 1 || !afford(p, BLD.tpost.cost) ? 'dis' : 'go',
			),
			'c1',
		);
	if (mine) {
		const sl = f.sell || {};
		h +=
			guardRow('f', f.id) +
			acts(
				btn(`want:${f.id}`, `Wanted: ${GOODS[f.want].name.toLowerCase()}`, 'yours: tap to change what it buys dear'),
				'c1',
			) +
			sec('Your caravans sell here') +
			acts(
				WARES.filter((k) => k !== 'spice')
					.map((k) =>
						btn(
							`sellat:${f.id},${k}`,
							GOODS[k].name,
							(f.sell ? sl[k] : 1) ? `${Math.floor(p.goods[k] || 0)} in store` : 'kept home',
							(f.sell ? sl[k] : 1) ? 'on' : '',
						),
					)
					.join(''),
				'c3',
			);
	}
	h += acts(
		btn(
			`routeto:${f.id}`,
			'Send a caravan here',
			homeBiz(0, f)
				? `${unitsOf(0, 'caravan').filter((c) => c.route && c.route.to === f.id).length} on this route`
				: 'needs a Market',
			homeBiz(0, f) && unitsOf(0, 'caravan').length ? 'go' : 'dis',
		),
		'c1',
	);
	return h;
}
function caravanHTML(u) {
	const r = u.route,
		t = targetOf(r),
		h0 = homeBiz(0, u),
		d = !r && u.dest ? byId(G.blds, u.dest) : null;
	let h = `<p>${r && t ? `Lane one: to the trade stop at ${coord(t.x, t.y)}${r.rep ? ', again and again' : ''}. ${u.leg === 'go' ? 'Carrying ' + (goodsText(u.goods || {}) || 'nothing') : u.leg === 'back' ? 'Coming home' + (u.goods && u.goods.spice ? ' with ' + u.goods.spice + ' spice' : '') : 'Loading'}.` : d && d.owner !== 0 ? `Lane two: to the ${bldName(d.owner, d.kind).toLowerCase()} of ${G.P[d.owner].name}, ${u.cargo} gold on arrival.` : allyMarket(0, u) ? 'Lane two: on its way to trade with your ally.' : 'No route, and no ally to trade with: it waits at your Market.'}</p>`;
	h += guardRow('c', u.id);
	if (!h0) return h + '<p>Build a Market (Trade) to send goods to the trade stops.</p>';
	const T = tradeTargets(0)
		.map((t) => [t, estPay(0, t, h0)])
		.sort((a, b) => b[1] - a[1])
		.slice(0, 4);
	h +=
		sec('Send it to') +
		acts(
			T.map(([t, v]) =>
				btn(
					`route:${u.id},s,${t.id}`,
					`Trade stop ${coord(t.x, t.y)}`,
					`about ${v}g a load · ${Math.round(dist(h0, t))} away`,
					r && t === targetOf(r) ? 'on' : '',
				),
			).join('') || '<p>No stop open: clear one of its guards first.</p>',
			'c1',
		);
	if (r)
		h += acts(
			btn(`rrep:${u.id}`, 'Repeat', r.rep ? 'on' : 'off', r.rep ? 'on' : '') +
				btn(`rsp:${u.id}`, 'Buy spice', r.spice ? 'on' : 'off', r.spice ? 'on' : '') +
				btn(`rclr:${u.id}`, 'No route', 'trade with an ally'),
		);
	return h;
}
function researchHTML() {
	// everything you can research, across every building: ready first, then short, then locked
	const p = G.P[0],
		by = { ready: [], short: [], busy: [], locked: [] },
		ageA = nextAge(0);
	for (const t of TECH) {
		if (!ownTech(t) || !isNext(0, t)) continue;
		const s = techState(t);
		if (s !== 'done') by[s].push(t);
	}
	const grid = (L) =>
		acts(L.map((t) => `<div class="trow">${techBtn(t, true)}<button class="goto" data-act="techgo:${t.id}" aria-label="Go to the ${BLD[t.at].name}">›</button></div>`).join('')), // › takes you to the building (Albert: a purist goes there; the row itself stays the shortcut)
		ageR = ageA && !p.aging && afford(p, ageA.cost) && keepOf(0);
	let h = title('Research', `${by.ready.length + (ageR ? 1 : 0)} ready now`);
	if (ageR) h += sec('Next age') + acts(keepAgeBtn(), 'c1');
	if (by.ready.length) h += sec('Ready') + grid(by.ready);
	if (!by.ready.length && !ageR) h += `<p>Nothing to start right now.</p>`;
	if (by.busy.length) h += sec('Under way') + grid(by.busy);
	if (by.short.length) h += sec('Short of something') + grid(by.short);
	if (by.locked.length) h += fold('lockedR', `Locked · ${by.locked.length}`, grid(by.locked));
	return h;
}
// Setup (v80, Albert Oct 31, pictures Setup Stacked with Names, Setup Stacked): each setting its own rank, its name quiet in the slots on the
// left, its choices right-justified as one selector, a slot a choice. Fog and Daily are two-choice settings like the rest (Off | On), so
// each says its word once, in its name. What each choice does is in the book
const setRow = (name, opts, cur) => acts(lab(name, 's' + (6 - opts.length)) + choice(opts.map(([act, w, v]) => [act, w, v === cur]), 's' + opts.length, true), 'c6');
const offOn = (key, on) => [[`${key}:0`, 'Off', false], [`${key}:1`, 'On', true]].map(([a, w, v]) => [a, w, v === on]);
const SET_WHY = {
	diff: {
		easy: 'Easy: the computers build and raid slowly.',
		normal: 'Normal: the computers play a fair game.',
		hard: 'Hard: the computers plan well and raid early.',
	},
	fantasy: {
		0: 'Real: wolves, boar and bandits; nothing that is not history.',
		1: 'Fantasy: trolls guard the finds, which pay half again.',
	},
	fog: { 1: 'Fog on: you see what your people see.', 0: 'Fog off: the whole map, as the computers see it.' },
	tension: {
		winner: 'Winner takes all: war until one stands.',
		diplomacy: 'Dynamic diplomacy: truces, tribute, allies and vassals.',
	},
};
const settingsWhy = () =>
	`<p>${[SET_WHY.diff[SET.diff], SET_WHY.fantasy[SET.fantasy ? 1 : 0], SET_WHY.fog[SET.fog !== false ? 1 : 0], SET_WHY.tension[SET.tension]].filter(Boolean).join(' ')}</p>`;
// two two-choice settings share a rank (Nov 3, Albert: the start page on one screen): name, its pair, name, its pair
const pairRow = (a, b) => acts(lab(a[0], 's1') + choice(a[1].map(([act, w, v]) => [act, w, v === a[2]]), 's2', true) + lab(b[0], 's1') + choice(b[1].map(([act, w, v]) => [act, w, v === b[2]]), 's2', true), 'c6');
const settingsHTML = (daily) =>
	setRow('Difficulty', DIFK.map((k) => [`diff:${k}`, k, k]), SET.diff) +
	setRow('Length', Object.entries(MODES).map(([k, m]) => [`mode:${k}`, m.name.replace('minutes', 'min'), k]), SET.mode) +
	setRow('Scenario', Object.keys(SCENARIOS).map((k) => [`scen:${k}`, SCEN_TEXT[k][0].replace('The ', ''), k]), SET.scen || 'open') +
	pairRow(['World', [['fantasy:0', 'Real', false], ['fantasy:1', 'Fantasy', true]], !!SET.fantasy], ['Fog', offOn('fog', SET.fog !== false), true]) +
	(daily
		? pairRow(['Tension', [['tension:winner', 'Winner', 'winner'], ['tension:diplomacy', 'Diplomacy', 'diplomacy']], SET.tension], ['Daily', offOn('daily', !!SET.daily), true])
		: setRow('Tension', [['tension:winner', 'Winner', 'winner'], ['tension:diplomacy', 'Diplomacy', 'diplomacy']], SET.tension));
// ═════ 30-cards.js: the CARDS table, one entry per card type, and renderCard ═════
// ───────────────────────── The cards, one entry each ─────────────────────────
// Each takes the card's description (G.card) and returns its page, or null when what it showed is gone.
const CARDS = {
	bld(c) {
		const b = byId(G.blds, c.id);
		if (!b) return null;
		const p = G.P[0],
			B = BLD[b.kind],
			mine = b.owner === 0,
			P = G.P[b.owner],
			done = b.prog >= 1,
			kp = b.kind === 'keep',
			rel = kp && (G.ktab === 'rel' || G.ktab === 'mis'),
			M = maxHpB(b.owner, b.kind),
			hurt = done && b.hp < M - 1,
			crew = unitsOf(0, 'vil').filter((u) => u.rep === b && u.job === 'repair'),
			X =
				(mine || b.kind === 'throne') && done
					? BLD_PAGE[b.kind]
						? BLD_PAGE[b.kind](b)
						: B.makes
							? workshopPage(b)
							: {}
					: {};
		const f = G.wonder && G.wonder.id === b.id ? factOf(b, X, crew) : X.fact; // what only this kind says (a castle mending, a field's crop) keeps the line; room goes to the book
		let h = title(
				bldName(b.owner, b.kind),
				[
					mine ? '' : P.name, // your own building: no "yours" line (S1, Albert Nov 2); another side's says whose
					mine ? '' : P.lord === 0 ? (P.rebel ? 'in revolt' : 'your vassal') : REL_WORD[G.rel[0][b.owner]].toLowerCase(),
					f && f.filter(Boolean).join(' '),
				]
					.filter(Boolean)
					.join(' · '),
				{ age: B.age || 0, hp: clamp(b.hp / M, 0, 1), work: done ? undefined : b.prog }, // the title box says the rest: its age on the top edge, its health a bar, its building the green ring (Albert, Nov 2)
			),
			end = '', // the last rank: Help, Repair, Raze
			book = `<p>Health ${Math.round(b.hp)}/${Math.round(M)} · ${AGES[B.age || 0].name} age${B.room ? ` · room for ${B.room}` : ''}.</p>` + (X.book || ''); // the book: health, age and room first (they left the card, Nov 2), then what its kind explains, then what was researched here, then what it is and why
		const more = () =>
			fold(
				'bmore',
				'More',
				book +
					(b.kind === 'wonder' && P.civ ? `<p><i>${CIVS[P.civ].wonder}:</i> ${WHY['wonder:' + P.civ]}</p>` : '') +
					`<p>${B.desc}</p>` +
					(WHY[b.kind] ? `<p><i>Why:</i> ${WHY[b.kind]}</p>` : ''),
			);
		if (mine && kp) {
			if (hurt) end = btn(`repair:${b.id}`, 'Repair', costText(repairCost(0, b)), 'go');
		} else if (mine) {
			const back = refundOf(b),
				menders = crew.filter((u) => !u.inside).length;
			// Repair and Raze share the last rank, both always there so nothing jumps (Albert, Build 63): Repair dim while the building is whole
			// the last rank (S2, Albert Nov 2): Help · Repair · Raze, each one slot wide, on every building card; Send help always there
			// on what can burn, so a fire moves nothing (hunt B #6)
			end =
				(done && B.wood
					? btn(`douse:${b.id}`, 'Help', b.fire > 0 ? 'two more' : 'no fire', b.fire > 0 ? 'warn' : 'dis') // Help: "Send help" is wider than one slot at 375 pt (the gate)
					: '') +
				btn(
					`repair:${b.id}`,
					'Repair',
					hurt ? (menders ? `${menders} mending` : costText(repairCost(0, b))) : 'whole',
					hurt ? 'go' : 'dis',
				) +
				(b.prog < 0.15
					? btn(`takedown:${b.id}`, 'Cancel', 'all back')
					: G.confirm === b.id
						? btn(`takedown:${b.id}`, 'Sure?', costText(back), 'warn') // the second tap, as Dismiss asks on the villager card
						: btn(`takedown:${b.id}`, 'Raze', costText(back))); // last on the card: the one you rarely want; one slot: Raze, its refund under it (Albert, Nov 2: "A")
		}
		if (mine) {
			const tr = done && !rel ? trainsAt(b.kind) : [],
				techs = done && !rel ? TECH.filter((t) => ownTech(t) && t.at === b.kind && isNext(0, t)) : [], // one step a line: the next
				did = TECH.filter((t) => t.at === b.kind && p.techs.has(t.id));
			// things you do here now, double-wide, a list: help with a fire, replant, send a builder, send a worker or one out
			h += list(
				[
					done && B.reserve && b.node && b.node.amt <= 0
						? btn(
								`replant:${b.id}`,
								'Replant',
								replantWhy(0, b)
									? replantWhy(0, b).replace(/\.$/, '')
									: `${costText(scaled(B.cost, 0.5))} · half the cost`,
								replantWhy(0, b) ? 'dis' : 'go',
							)
						: '',
					done && B.drop && cutOut(0, B.drop).length
						? btn(`replantall:${b.id}`, 'Replant all', `${cutOut(0, B.drop).length} cut out`, 'go')
						: '',
					!done
						? btn(
								`sendbld:${b.id}`,
								'Send a villager',
								crew.length ? `${crew.length} building` : 'nobody yet',
								crew.length ? '' : 'go',
							)
						: '',
					B.crop && done && b.node
						? btn(`sendvil:${b.node.id}`, 'Send a villager', slotText(b.node), b.node.wk > 0 ? '' : 'go')
						: '',
					B.crop && done && b.node
						? btn(
								`sendout:${b.node.id}`,
								'Send out',
								b.node.wk > 0 ? 'one goes home' : 'nobody on it',
								b.node.wk > 0 ? '' : 'dis',
							)
						: '',
				].filter(Boolean),
			);
			// the page (MENU-SPEC §8): what it trains, double-wide, add only; its line directly under; its techs, three a rank (the Town Center's
			// next age first and All tech last); what its kind adds. No labels
			const page =
				(tr.length || b.q.length ? slotsHTML(b) : '') + // the queue first, in its steel box (Q1, Albert Nov 2): what is training over what you can train
				grid3(trainButtons(tr)) +
				(kp && !rel ? acts(keepAgeBtn('s4') + btn('card:research', 'All tech', '›'), 'c3') : '') + // the next age double-wide (its four costs, preview 48), All tech beside it
				grid3(techs.map((t) => techBtn(t))) +
				(X.page || '');
			if (kp)
				h += folder(
					'ktab',
					[
						['town', 'Town'],
						['rel', 'Relations'],
						['mis', 'Misfits'],
					], // the tabs say their name only (pictures Relations Final, Relations Misfits); the stances are friend, neutral, foe (REL_WORD)
					rel ? G.ktab : 'town',
					rel ? relHTML(G.ktab === 'mis') : page + list(end ? [end] : []),
					'c3',
				);
			else h += page;
			if (done) {
				const T = kp && turtlePlan(0);
				book +=
					(did.length ? `<p><i>Researched here:</i> ${did.map((t) => t.name).join(' · ')}.</p>` : '') +
					(tr.length && !kp && b.kind !== 'town' ? tr.map((k) => unitLine(0, civKind(0, k))).join('') : '') +
					techs.map(techBook).join('') +
					(T && T.rows.length
						? `<p><i>To ${T.age.name} by the fields:</i> ${T.rows.map((x) => `${Math.round(x.need)} ${x.r}${isFinite(x.vm) ? ` (${x.vm.toFixed(1)} villager-min)` : ' (none known)'}`).join(', ')}. With ${T.villagers} villagers about ${isFinite(T.time) ? clock(T.time * 60) : '—'}: ${T.split
								.filter((s) => s.n)
								.map((s) => `${s.n} on ${cap1(s.r)}`)
								.join(', ')}.</p>`
						: '') +
					(kp ? keepMoreHTML() : '');
			}
		}
		if (!mine && b.kind === 'keep' && P.lord === 0) h += vassalHTML(P);
		else if (!mine && b.kind === 'keep' && G.rel[0][b.owner] === 'ally') {
			const why = overlordWhy(0, b.owner);
			h += acts(
				btn(
					`overlord:${b.owner}`,
					'Offer overlordship',
					why ? why.replace(/\.$/, '') : 'they become your vassal at a light tax',
					why ? 'dis' : 'go',
				),
				'c1',
			);
		} else if (!mine && atWar(0, b.owner)) {
			const I = G.intel[b.owner],
				spies = unitsOf(0, 'spy').length;
			if (I)
				h += `<p><b>Report of a spy</b> (${clock(G.t - I.t)} ago): ${costText(I.res)} in store · ${AGES[I.age].name} age · ${I.techs} researched · ${
					Object.entries(I.army)
						.map(([k, n]) => n + ' ' + stats(b.owner, k).name.toLowerCase())
						.join(', ') || 'no army'
				}.</p>`;
			if (b.kind === 'keep') {
				const why = surrenderWhy(0, b.owner);
				h += acts(
					btn(
						`surrender:${b.owner}`,
						'Demand surrender',
						why ? why.replace(/\.$/, '') : 'they become your vassal and pay tax',
						why ? 'dis' : 'go',
					),
					'c1',
				);
			}
			h +=
				acts(
					btn(
						`sab:${b.id}`,
						'Sabotage',
						!B.sab
							? 'too well guarded'
							: !spies
								? 'needs a spy: Build → Courthouse'
								: guarded(b)
									? 'defended: the spy would be shot'
									: 'a spy goes and is used up',
						B.sab && spies ? 'warn' : 'dis',
					),
					'c1',
				) + qsHTML(`qatk:${b.id}`, 'Attack with', b);
		}
		return h + (kp || !end ? '' : acts(end, 'c6')) + more();
	},
	find(c) {
		const f = byId(G.finds, c.id);
		if (!f) return null;
		const F = FINDS[f.kind],
			gl = G.units.filter((v) => v.find === f.id && v.owner === WILD && v.hp > 0 && v.kind !== 'vagabond'),
			at = `${Math.round(f.x)},${Math.round(f.y)}`;
		let h = title(F.name, coord(f.x, f.y) + (f.done && !F.capture ? ' · taken' : '')) + `<p>${F.desc}</p>`;
		if (gl.length) h += `<p>Guarded by ${gl.length} ${some(gl.length, UNIT[gl[0].kind].name.toLowerCase())}.</p>`;
		if (F.got && !f.done)
			h += `<p>Inside: ${costText(Object.fromEntries(Object.entries(F.got).map(([k, v]) => [k, Math.round(v * (G.fantasy ? 1.5 : 1))])))}${F.tech ? ' and a free research' : ''}.</p>`;
		if (F.capture) {
			h += `<p>${f.owner === null ? 'Nobody holds it.' : f.owner === 0 ? 'Yours: it pays you.' : `Held by ${G.P[f.owner].name}.`}</p>`;
			if (f.owner !== 0) {
				const pr = unitsOf(0, 'priest').length;
				h += acts(
					btn(
						`shrine:${f.id}`,
						'Send a priest',
						pr ? 'it stands there and takes it' : 'needs a priest: Build → Temple',
						pr ? 'go' : 'dis',
					),
					'c1',
				);
			}
		}
		if (F.hire && !f.done) {
			const why = hireWhy(0, f);
			h += acts(
				btn(
					`hire:${f.id}`,
					`Hire ${F.hire.n} vagabonds`,
					why ? why.replace(/\.$/, '') : costText(F.hire.cost),
					why ? 'dis' : 'go',
				),
				'c1',
			);
		}
		h +=
			qsHTML(`qgo:${at}`, 'Send', f) +
			(unitsOf(0, 'scout').length
				? acts(btn(`scoutgo:${at}`, 'Send the scout', 'fast, but it does not fight'), 'c1')
				: '');
		if (F.stop) h += stopHTML(f);
		return h + fold('why', 'Why?', `<p>${WHY[f.kind]}</p>`); // one row of peoples, their soldier in the line under it: the whole card on one page (Albert)
	},
	unit(c) {
		const u = byId(G.units, c.id);
		if (!u) return null;
		const U = UNIT[u.kind],
			o = u.owner,
			S = o === WILD ? U : stats(o, u.kind),
			P = G.P[o],
			mine = o === 0 && u.kind === 'vil';
		if (mine) {
			// the villager's card (MENU-SPEC §8, picture Easy Cards): what they are doing, then health, age and speed, as info cells; Stop · Send
			// home · Dismiss; the job picker, the job ribbon reskinned (Build: whatever is placed next, this one raises it). The rest is in the book
			const [now, more] = statusOf(u).split(' · '),
				sick = u.sick > G.t,
				sure = G.confirm === 'v' + u.id;
			return (
				title(S.name, 'yours') +
				acts(
					info(cap1(now), more || '', 'left line s3') +
						info(`${Math.round(u.hp)}/${Math.round(u.max)}`, sick ? (u.plague ? 'plague' : 'sick') : 'health') +
						info(clock(G.t - (u.bornT || 0)), 'age') +
						info(Math.round(S.spd), 'speed'),
					'c6',
				) +
				list([
					btn(`vstop:${u.id}`, 'Stop', '', u.job || u.post ? '' : 'dis'),
					btn(`vfocus:${u.id}`, 'Focus', u.focus ? 'stays where put' : '', u.focus ? 'on' : ''),
					btn(`vhome:${u.id}`, 'Send home'),
					btn(`vgo:${u.id}`, sure ? 'Sure?' : 'Dismiss', sure ? 'tap again' : '', sure ? 'warn' : ''),
				]) +
				rowHTML(
					JOBS.map((j) => [`vjob:${u.id},${j}`, ICON[j], cap1(j), u.job === j ? 'on' : '']).concat([
						[`pbuild:${u.id}`, ICON.hammer, 'Build', u.job === 'repair' ? 'on' : ''],
					]),
				) +
				fold(
					'about',
					'About',
					`<p><i>Life:</i> ${lifeText(u)}. Hits ${Math.round(S.dmg * 10) / 10}, reach ${Math.round(S.rng)}.</p>` +
						(sick
							? `<p><b>${u.plague ? 'Plague' : 'Sick'}:</b> works and fights at half strength. A Hospital or a medic nearby cures it.</p>`
							: '') +
						`<p>${U.desc}</p>` +
						(WHY[u.kind] ? `<p><i>Why:</i> ${WHY[u.kind]}</p>` : ''),
				)
			);
		}
		let h =
			title(
				S.name,
				o === 0
					? 'yours' + (u.bn !== undefined ? ' · ' + BN[u.bn] : '')
					: o === WILD
						? 'the wild'
						: P.name + (P.civ ? ' · ' + CIVS[P.civ].name : ''),
			) + hpBar(u.hp / u.max, P.color); // the wild in the Natives' own colour (COLORS, Nov 2)
		h += `<p>Health ${Math.round(u.hp)}/${Math.round(u.max)}${U.dmg ? ` · hits ${Math.round(S.dmg * 10) / 10} · reach ${Math.round(S.rng)}` : ''} · speed ${Math.round(S.spd)}${o !== WILD && isSoldier(u) ? ` · takes ${Math.round(S.armor * 100)}% damage` : ''}.</p>`;
		if (o === 0) h += `<p><i>Now:</i> ${statusOf(u)}.</p><p><i>Life:</i> ${lifeText(u)}.</p>`;
		if (o === WILD && U.meat && U.tick === 'wild') {
			const who = unitsOf(0, 'vil').filter((v) => v.hunt === u).length;
			h += acts(btn(`hunt:${u.id}`, 'Send a hunter', who ? `${who} hunting` : 'nobody yet', 'go'), 'c1');
		}
		if (o === 0 && u.kind === 'caravan') h += caravanHTML(u);
		if (o === 0 && isSoldier(u) && teachTo(u)) {
			const why = teachWhy(0, u);
			h += acts(
				u.state === 'school'
					? btn(
							`teach:${u.id}`,
							`Learning: ${stats(0, teachTo(u)).name}`,
							`${Math.ceil(u.schoolT - G.t)} s left`,
							'dis',
						)
					: btn(
							`teach:${u.id}`,
							`Teach: ${stats(0, teachTo(u)).name}`,
							why
								? why.replace(/\.$/, '')
								: `${costText(teachCost(0, u))} · ${Math.round(teachSecs(0, u))} s at the School`,
							why ? 'dis' : 'go',
						),
				'c1',
			);
		} // a soldier learns a newer kind
		if (u.sick > G.t)
			h += `<p><b>${u.plague ? 'Plague' : 'Sick'}:</b> works and fights at half strength. A Hospital or a medic nearby cures it.</p>`;
		const bt = o !== WILD && beatsText(o, u.kind);
		if (bt) h += `<p><i>Strong against:</i> ${bt}.</p>`;
		if (o !== 0 && atWar(0, o)) h += qsHTML(`qfoe:${u.id}`, 'Attack with', u);
		return h + fold('about', 'About', `<p>${U.desc}</p>` + (WHY[u.kind] ? `<p><i>Why:</i> ${WHY[u.kind]}</p>` : ''));
	},
	info(c) {
		const B = BLD[c.kind];
		return (
			title(bldName(0, c.kind), `${AGES[B.age].name} age · ${costText(B.cost)}`) +
			`<p>${B.desc}</p><p>Unlocks in the ${AGES[B.age].name} age. Advance at your Town Center.</p>`
		);
	},
	box(c) {
		const left = G.nodes.filter((n) => n.kind === 'tree' && n.amt > 0 && inBox(n, c.r)).length;
		if (!left) return null;
		return (
			title('Trees', `${left} in the box`) +
			sec('Cut these trees') +
			acts(
				[1, 3, 5].map((n) => btn(`boxcut:${n}`, `Send ${n}`, n === 1 ? 'villager' : 'villagers', 'go')).join(''),
				'c3',
			) +
			`<p>They cut from the edge inward, then go back to their work. Cut a way through to open a road.</p>`
		);
	},
	stores() {
		// one rank a resource (MENU-SPEC §8, picture States and Text): its name, what you have, what came in and went out over the last minute,
		// who is on it, and ›, which opens the book on its why. No header rank: each number carries its own label
		const p = G.P[0],
			V = unitsOf(0, 'vil'),
			el = (G.tick % 1800) / 30,
			full = p.rate && Object.keys(p.rate).length,
			pace = (o) => Object.fromEntries(Object.entries(o || {}).map(([k, v]) => [k, (v * 60) / Math.max(10, el)])), // the last full minute; before there is one, the pace so far
			rt = full ? p.rate : pace(p.flow),
			ot = full ? p.orate || {} : pace(p.spent1),
			K = G.storesK,
			line = (o) =>
				Object.entries(o || {})
					.filter(([, v]) => v >= 0.5)
					.sort((a, b) => b[1] - a[1])
					.map(([w, v]) => `${LEDGER_WORD[w] || w} ${fmt(v)}`)
					.join(' · ') || 'nothing yet';
		let h = title('Stores', 'the last minute');
		for (const r of RES) {
			const k = KEY[r],
				i = Math.round(rt[k] || 0),
				o = Math.round(ot[k] || 0);
			h += acts(
				info(RESOURCES[r].name, '', 'left line') +
					info(`<span style="color:${grad(velOf(p, k))}">${fmt(p.res[k])}</span>`, 'have') +
					info(i ? '+' + i : 0, 'in', i ? 'gain' : '') +
					info(o ? '−' + o : 0, 'out', o ? 'loss' : '') +
					info(V.filter((u) => u.job === r).length, 'on it') +
					btn(`storesk:${k}`, '›', '', K === k && G.infoOpen ? 'on' : ''),
				'c6',
			);
		}
		if (K) {
			// the why of one resource (Albert, Build 63), both ways. By reason: where the minute's in and out came from and went. By who: the
			// villagers on it, and the buildings that make it or take it (shops, the mint, the foundry)
			const r = RES.find((x) => KEY[x] === K),
				own = (f) =>
					G.blds.filter((b) => standing(b, 0) && BLD[b.kind].makes && f(BLD[b.kind].makes)),
				makers = own((m) => K in m),
				takers = own((m) => Object.values(m).some((x) => x.from && K in x.from)),
				who = (L) => L.map((b) => `<span data-act="open:bld,${b.id}">${bldName(0, b.kind)}</span>`).join(', ');
			fold(
				'about',
				'About',
				`<p><b>${RESOURCES[r].name}, the last minute.</b> <i>In:</i> ${line((p.rateBy || {})[K] || (p.flowBy || {})[K])}. <i>Out:</i> ${line((p.orateBy || {})[K] || (p.spentBy || {})[K])}.</p>` +
					`<p><i>Who:</i> ${V.filter((u) => u.job === r).length} villagers on it${makers.length ? `; made at ${who(makers)}` : ''}${takers.length ? `; taken by ${who(takers)}` : ''}.</p>`,
			);
		}
		const L = p.ledger || { in: {}, out: {} }; // the ledger: every resource that ever came in or went out, by where it came from and went (earn and spend, 08-core)
		return (
			h +
			fold(
				'about',
				'About',
				`<p><i>Goods:</i> ${GOODK.map((k) => `${GOODS[k].name} ${Math.floor(p.goods[k] || 0)}${rt[k] ? ` (+${Math.round(rt[k])})` : ''}`).join(' · ')}. Goods wait at your Market for caravans; wool for a Workshop.</p>` +
					`<p>In and Out: the last minute. What you have is green while it gains, deeper the faster; white while it holds; red as it loses, reddest with under two minutes left${p.hungry ? ' · <b>they are hungry</b>' : ''}.</p>` +
					`<p><b>Ledger, the whole game.</b> <i>In:</i> ${line(L.in)}. <i>Out:</i> ${line(L.out)}.</p><p>Trade is caravans, routes held and the cut of other caravans at your stops; the Market is sales and buys; tax is what vassals send; tribute is gifts and peace bought.</p>`,
			)
		);
	},
	fault: () =>
		title('Something went wrong', 'your last save is kept') +
		`<p>Restart to carry on from the last save. Carry on and nothing more is saved.</p>` +
		acts(btn('reload', 'Restart', 'from the last save', 'go') + btn('close', 'Carry on', 'not saved')),
	resume: (c) =>
		title('Welcome back', 'saved on this phone') +
		`<p>Your game from ${clock(c.t)}: ${CIVS[c.civ] ? CIVS[c.civ].name + ', ' : ''}${AGES[c.age].name} age. Resume it, or start a new one.</p>` +
		acts(btn('resume', 'Resume', clock(c.t), 'go') + btn('card:setup', 'New game', '')),
	setup() {
		// the annoying part before the fun part (Albert): each setting its own rank, then your people and their soldier, the day's challenge,
		// the hazards, and Start at the foot (v80, picture Setup Stacked with Names). The whys wait behind the book
		const C = CIVS[SET.civ],
			H = SET.daily ? TODAY_HZ : SET.hz || {},
			lv = levelOf(H), // none ticked: the hazards are drawn by lot when the game starts (Build 70)
			short = (k) => cap1(UNIT[CIVS[k].uu].name.replace(new RegExp('^' + CIVS[k].name + ' ', 'i'), ''));
		fold(
			'about',
			'About',
			settingsWhy() +
				`<p><b>${short(SET.civ)}:</b> ${UNIT[C.uu].name}, in place of the ${UNIT[UNIT[C.uu].replaces].name.toLowerCase()}. Wonder: ${C.wonder}. ${WHY['bonus:' + SET.civ]}</p><p>The other three sides take three of the other peoples at random. Every people has the same rules; only the unique soldier, the bonus and the wonder differ.</p>` +
				HZK.map((k) => `<p><b>${HAZARDS[k].name}:</b> ${HAZARDS[k].desc}</p>`).join('') +
				`<p><b>Daily challenge:</b> the same map and the same hazards for everyone, all day. Tick a hazard yourself and it becomes your own game again.</p><p><b>None ticked:</b> each hazard is drawn by lot, even odds, for every side alike; the first message says the level.</p><p class="copy">© Albert Labs, all rights reserved</p>`,
		);
		return (
			title('A new game', '') +
			settingsHTML(true) +
			acts(choice(CIVK.map((k) => [`civ:${k}`, CIVS[k].name, SET.civ === k]), 's6', true), 'c1') +
			acts(info(short(SET.civ), C.bonus, 'left line'), 'c1') +
			acts(choice(HZK.map((k) => [`hz:${k}`, `<b>${HAZARDS[k].short || HAZARDS[k].name}</b><small>${HAZARDS[k].pts}</small>`, !!H[k]]), 's6'), 'c1') +
			(staleSave
				? acts(info(`Your last game ${staleSave === 'damaged' ? 'could not be read' : `came from an older version (${staleSave})`}`, 'kept aside, not deleted', 'left line'), 'c1')
				: '') +
			acts(
				btn(
					SET.daily ? 'today' : 'fresh',
					'Start',
					`${C.name} · ${SET.daily ? `daily challenge, level ${levelOf(TODAY_HZ)}` : MODES[SET.mode].name.replace('minutes', 'min')} · ${lv ? `level ${lv} · score ×${(1 + lv / 10).toFixed(1)}` : 'hazards at random'}`,
					'main',
				),
				'c1',
			)
		);
	},
	node(c) {
		const n = byId(G.nodes, c.id);
		if (!n) return null;
		const who = unitsOf(0, 'vil').filter((u) => u.node === n).length,
			dr = dropFor(0, n.type, n),
			far = dr ? Math.round(dist(dr, n)) : null,
			dropName = RESOURCES[n.type].drop;
		return (
			title(nodeName(n), `${coord(n.x, n.y)} · ${Math.round(n.amt)} ${n.type} left`) +
			(n.max > 0 && isFinite(n.max) ? hpBar(Math.min(1, n.amt / n.max), RESOURCES[n.type].col) : '') +
			acts(btn(`sendvil:${n.id}`, 'Send a villager here', who ? `${who} working` : 'nobody there yet', 'go'), 'c1') +
			yieldText(n, 0) +
			`<p>${far === null ? `No drop-off for ${n.type} yet: build a ${dropName}.` : far > 110 ? `Nearest drop-off is ${far} away: build a ${dropName} closer.` : `Nearest drop-off: ${far} away.`}</p>` +
			fold(
				'about',
				'About',
				`<p>The nearest idle villager goes; if none is idle, one from the job you hold the most of.</p>`,
			)
		);
	},
	troops() {
		// the Army card (Albert, Build 41): from the sword under Build
		const p = G.P[0],
			S = armyOf(0),
			by = {};
		for (const u of S) {
			const nm = stats(0, u.kind).name;
			by[nm] = (by[nm] || 0) + 1;
		}
		let h =
			title('Army', `${S.length} soldiers`) +
			`<p>${
				Object.entries(by)
					.map(([n, k]) => `${k} ${some(k, n.toLowerCase())}`)
					.join(' · ') || 'Nobody yet: train soldiers below.'
			}</p>`;
		// the live lines go under every button, so their coming and going moves nothing under the finger (hunt B #6)
		let live = '';
		{
			// who is doing what, soldier by soldier (Build 42)
			const c = { hold: 0, rally: 0, march: 0, fight: 0, rout: 0 },
				W = { hold: 'holding', rally: 'rallying', march: 'marching', fight: 'fighting', rout: 'routed' };
			for (const u of S) if (c[armyStatus(u)] !== undefined) c[armyStatus(u)]++;
			const line = Object.keys(c)
				.filter((k) => c[k])
				.map((k) => `<b>${c[k]}</b> ${W[k]}`)
				.join(' · ');
			if (line) live += `<p>${line}</p>`;
		}
		const ords = Object.values(G.ords || {}).filter((O) => O.n),
			inc = G.incoming;
		if (inc)
			live +=
				sec('Coming at you') +
				`<p data-act="jump:${Math.round(inc.x)},${Math.round(inc.y)}"><b>${inc.n}</b> ${inc.what} · ${inc.eta} s away</p>`;
		if (ords.length)
			live +=
				sec('Out on orders') +
				ords
					.map(
						(O) =>
							`<p data-act="ordpick:${O.id}"><b>${O.n}</b> ${O.fight ? 'fighting near' : O.arrived ? 'at' : 'marching to'} ${O.label}${!O.arrived && O.eta ? ` · ${O.eta} s` : ''}</p>`,
					)
					.join(''); // tap a line: that group is picked, and the camera goes to it
		h += acts(btn('emgpage', 'Alarm', 'gather · garrison · shelter', G.emg ? 'warn' : ''), 'c1');
		if (S.length && hasCmd())
			h +=
				sec('Orders go to') +
				list(
					[['all', 'All', S.length]]
						.concat(BN.map((n, i) => [i, n, S.filter((u) => u.bn === i).length]))
						.map(([k, n, cnt]) => btn(`sel:${k}`, n, `${cnt}`, G.sel === k ? 'on' : '')),
				);
		if (S.length) {
			h +=
				sec(`Orders for the ${selName()}`) +
				acts(
					btn('recall', 'Recall home', '') +
						btn(
							'attack:near',
							'Attack nearest',
							oddsText(orderSet(), foeNearest()),
							orderSet().length ? 'warn' : 'dis',
						),
				);
			{
				const bn = G.sel === 'all' ? undefined : G.sel,
					cw = chargeWhy(0, orderSet(), bn),
					S = orderSet(),
					nerve = S.length ? Math.round((100 * S.reduce((a, u) => a + (u.mor ?? 1), 0)) / S.length) : 0;
				h +=
					acts(
						btn(
							'charge',
							'Charge',
							cw ? cw.replace(/\.$/, '') : `${CHARGE.secs} s of fury, then tired`,
							cw ? 'dis' : 'warn',
						) + btn('fallback', 'Fall back', `withdraw ${FALLBACK.back}, fewer losses`),
					) +
					`<p><i>Nerve:</i> ${nerve}%${nerve < 40 ? ' · <b>close to breaking</b>' : ''}.</p>` +
					fold(
						'about',
						'Nerve',
						'<p>Blows from the side and behind drain nerve; rest, a wall, a tower or a priest restore it. Under 20% a soldier runs.</p>',
					);
			}
			h += list(dialBtns(G.sel));
			if (ready(0, 'temple').length) {
				const why = zealWhy(0, orderSet());
				h += acts(
					btn(
						'zeal',
						'Zeal',
						why ? why.replace(/\.$/, '') : `${costText(zealCost(0))} · ${ZEAL.secs} s of harder blows`,
						why ? 'dis' : 'go',
					),
					'c1',
				);
			}
		}
		const kinds = ARMYK.filter((k) => !UNIT[k].civ && UNIT[civKind(0, k)].age <= p.age + 1);
		h += fold('armytrain', 'Train soldiers', list(trainButtons(kinds)));
		return (
			h +
			fold(
				'about',
				'About orders',
				`<p>Tap open ground, then the sword: All or the idle ones go there, or + aims a mission there. A squad is built on its card (tap it on the War page); War sends squads with a time and odds; a gold ring marks the one picked here.</p><p><b>Temper:</b> ${TEMPER.map((s) => `${s.name}: ${s.note}`).join('. ')}.</p><p><b>Shape:</b> ${FORM.map((F) => `${F.name}: ${F.note}`).join('. ')}. On the march an army goes in column.</p>`,
			) +
			live
		);
	},
	menu(c) {
		// the Build menu (MENU-SPEC §8, picture Build Menu): six tabs, a folder; the buildings double-wide, three a rank, words only: the name,
		// how many of how many, the cost. Blue: it fits where you tapped; dim: a later age, or all built. The page holds the height of the
		// biggest tab, so the tabs never move under the finger
		const p = G.P[0],
			M = MENUS.find((m) => m.id === c.id);
		G.lastMenu = c.id;
		const item = (k) => {
			const B = BLD[k],
				lock = B.age > p.age,
				cp = capFor(0, k),
				n = bldsOf(0, k).length,
				full = !lock && n >= cp,
				fits = G.buildAt && G.buildAt.hint === k,
				can = afford(p, B.cost);
			return btn(
				`build:${k}`,
				(B.short || bldName(0, k)) + (!lock && cp < 99 ? ` ${n}/${cp}` : ''), // the count beside the name (preview 48: the cost line is full at 14 px)
				lock
					? `${AGES[B.age].name} age`
					: (full ? 'all built' : can ? costText(B.cost) : `short ${need(B.cost)}`) +
							(fits ? ' · fits here' : ''),
				(lock || full ? 'dis' : fits ? 'go' : '') + (Object.keys(B.cost).length >= 4 ? ' s4' : ''), // four costs: double-wide (the Colosseum; preview 48)
				lock || full ? undefined : can ? 1 : fillOf(B.cost),
			);
		};
		return (
			title('Build', G.buildAt && G.buildAt.x !== undefined ? 'here' : '') +
			folder(
				'menu',
				MENUS.map((m) => {
					const open = m.items.filter((k) => BLD[k].age <= p.age); // every building the age allows at its limit: the tab says so with a check (Build 61)
					return [m.id, m.name, open.length && open.every((k) => bldsOf(0, k).length >= capFor(0, k)) ? '✓' : ''];
				}),
				c.id,
				`<div class="hold" style="--n:${Math.ceil(Math.max(...MENUS.map((m) => m.items.length)) / 3)}">${grid3(M.items.map(item))}</div>`, // T2: double-wide, three a rank, a short rank filled
				'c6',
			) +
			fold('menu', 'What each one does', M.items.map((k) => `<p><b>${bldName(0, k)}:</b> ${BLD[k].desc}</p>`).join(''))
		);
	},
	research: () => researchHTML(),
	// the mail (Build 64): every line kept, newest first, by group; a group can hide its previews here or from the preview's ×. Six lines a
	// page, Previous and Next: the 30 kept are five pages, nothing scrolls (N13, Albert Oct 31: "a page system, nothing more")
	mail() {
		const M = G.mail || [],
			g = G.mailG,
			all = M.filter((m) => !g || m.grp === g);
		let h = title('Mail', g ? GROUPS[g] : `${M.length} kept`);
		h += acts(
			[
				btn('mailg:', 'All', '', g ? '' : 'on'),
				...MAIL_FILTERS.map((k) => btn(`mailg:${k}`, GROUPS[k], hiddenG(k) ? 'hidden' : '', g === k ? 'on' : '')),
			].join(''),
			'c6',
		); // the six filters, one rank, always the same six in the same places
		// six places a page, always: a short page keeps its height with empty places, so the card never shrinks and Next stays under the finger;
		// a group's preview switch sits between Previous and Next (it had a rank of its own: 11 ranks, and the pager fell below the card)
		const [pg, rows, nav] = pager(
			all.length
				? all.map(
						(m) =>
							`<button class="mr" data-act="${linkOf(m) || 'mailp:0'}" style="--cc:${ccOf(m.cls)}"><b>${m.text}${m.n > 1 ? ` ×${m.n}` : ''}</b><small>${GROUPS[m.grp]} · ${clock(m.t)}${m.why ? ' · ' + m.why : ''}</small></button>`,
					)
				: [info('Nothing here yet', 'each message is kept here as it comes', 'left line')],
			G.mailP,
			'mailp',
			empty(),
			all.length ? `${all.length} ${some(all.length, 'line')}` : '',
			g && g !== 'reply'
				? btn(
						`mailtog:${g}`,
						hiddenG(g) ? 'Show previews' : 'Hide previews',
						hiddenG(g) ? 'red still shows' : 'a preview, then here',
					)
				: empty(),
		);
		G.mailP = pg;
		return h + acts(rows, 'c1') + nav;
	},
	milestone(c) {
		const id = c.page,
			T = id && MS_TEXT[id],
			M = G.ms || [];
		let h = title('Milestones', `${M.length} of ${Object.keys(MS_TEXT).length}`);
		if (T) {
			const [line, why, fix, act] = T;
			h += `<p><b>${msFill(line)}</b></p><p>${msFill(why)}</p>` + acts(btn(act, fix, '', 'go'), 'c1');
		}
		h += M.length
			? list(M.filter((m) => MS_TEXT[m.id]).map((m) => btn(`card:milestone,${m.id}`, MS_TEXT[m.id][0].split(':')[0].replace(/\.$/, ''), clock(m.t), m.id === id ? 'on' : '')), 2) // a slot each, two a rank (E8: chips were 22 tall taps); a milestone cut from the text is left out (N9)
			: '<p class="dim">None yet. Each first (a house, a field, a soldier, a squad, an age) and each hard moment (mud, snow, ice, hunger, fire, a rout) is one, with its why and its fix.</p>';
		return h;
	},
	score() {
		scoreAll();
		const rows = G.P.filter((q) => q.id !== WILD),
			cats = [
				['people', 'People'],
				['army', 'Army'],
				['tech', 'Tech'],
				['bld', 'Buildings'],
				['wealth', 'Wealth'],
				['total', 'Score'],
			];
		return (
			title(
				'Score',
				(MODES[G.mode].secs ? `${clock(Math.max(0, MODES[G.mode].secs - G.t))} to the bell` : 'conquest') +
					(levelOf(G.hz) ? ` · level ${levelOf(G.hz)} ×${levelMul().toFixed(1)}` : ''),
			) +
			`<table><tr><th></th>${rows.map((q) => `<th style="border-bottom:3px solid ${q.color}">${q.id === 0 ? 'You' : `<button class="lnk" data-act="seek:${q.id}">${q.name}</button>`}</th>`).join('')}</tr>${cats.map(([k, n]) => `<tr><td>${n}</td>${rows.map((q) => `<td>${q.alive || k === 'total' ? fmt(q.score[k]) : '–'}</td>`).join('')}</tr>`).join('')}</table>` +
			`<p>People and Army: what you hold, cost ÷ ${SCORE.unit}. Tech: research and ages paid ÷ ${SCORE.tech}. Buildings: standing, cost ÷ ${SCORE.bld}. Wealth: everything gathered, traded, found and plundered ÷ ${SCORE.wealth}. ${G.wonder ? `A wonder stands: ${clock(Math.max(0, G.wonder.end - G.t))} left.` : ''}</p>` +
			acts(btn('card:milestone', 'Milestones', `${(G.ms || []).length} of ${Object.keys(MS_TEXT).length}`) + btn('help', 'How to play', 'guide, rules, settings')) // Milestones' door (D-080, Nov 2)
		);
	},
	guide(c) {
		const pg = c.page || 'bld',
			key = `${pg}|${G.P[0].age}|${G.P[0].techs.size}|${G.gq || ''}`; // what the page reads; the Guide pauses the game, so it changes only by a tap
		if (GUIDE_PG.key === key) return GUIDE_PG.h; // hunt B #8: it was rebuilt seven times a second
		GUIDE_PG.key = key;
		return (GUIDE_PG.h =
			title('Guide', 'what leads to what, and why') +
			list(
				[
					['bld', 'Buildings'],
					['unit', 'Units'],
					['tech', 'Research'],
					['age', 'Ages'],
					['civ', 'Peoples'],
					['rule', 'Rules'],
					['hist', 'History'],
				]
					.map(([k, n]) => btn(`guide:${k}`, n, '', pg === k ? 'on' : '')),
			) +
			(pg === 'hist'
				? `<p><b>History · beta.</b> ${HIST_NOTE}</p><input id="gq" class="q" type="search" placeholder="Search: a thing, a place, a date" value="${(G.gq || '').replace(/"/g, '')}" oninput="window.__fkq(this.value)"><div class="row"><button class="lnk" data-act="copyhist">Copy the whole timeline</button></div><div id="gres">${histHTML(G.gq)}</div><p>${HIST_ASK}</p>`
				: guideHTML(pg)));
	},
	sound() {
		const row = (k, name, v) => acts(btn(`vol:${k},-`, '−', '') + info(name, `${Math.round(v * 100)}%`) + btn(`vol:${k},+`, '+', ''), 'c3');
		return (
			title('Sound', '') +
			acts(
				btn('sound', 'Sound', SND.on ? 'on' : 'off', SND.on ? 'on' : '') +
					btn('vibe', 'Vibration', SET.vibe ? 'on' : 'off', SET.vibe ? 'on' : ''),
			) +
			row('all', 'All', SND.vol) +
			row('fx', 'Effects', SET.mix.fx) +
			row('amb', 'Ambience', SET.mix.amb) +
			row('alert', 'Alerts', SET.mix.alert) +
			`<p>Effects: work and battle. Ambience: birds, wind, crickets, thunder. Alerts: horn, ready, done, a new age. The silent switch of your phone mutes the game.</p><p class="dim">${SONG}</p>`
		);
	},
	taps() {
		// what you tap, kept on this phone (33-verbs: tapCount)
		const L = Object.entries(TAPS).sort((a, b) => b[1][0] + b[1][1] - (a[1][0] + a[1][1]));
		return (
			title('Tap counts', 'on this phone only') +
			(L.length
				? `<table><tr><th>Button</th><th>Used</th><th>Greyed</th></tr>${L.map(([k, [n, d]]) => `<tr><td>${k}</td><td>${n}</td><td>${d || ''}</td></tr>`).join('')}</table>`
				: '<p>No taps counted yet.</p>') +
			`<p>Nothing here leaves the phone. Greyed: tapped while the button could not act.</p>`
		);
	},
	help() {
		return (
			title('How to play', `v${BUILD} · ${BUILD_NAME}`) +
			acts(
				btn('guide:bld', 'Guide', 'what leads to what, and why', 'go') +
					btn('guide:rule', 'Rules', 'what triggers what'),
			) +
			`<p><b>Grow:</b> train villagers at the Town Center; + and − under each job move one on or off. Houses give room.</p>
      <p><b>Build:</b> the hammer under People opens every building; it wears a green ring while one goes up. A building waits above your finger: drag it, then tap Build. The cycle button above People turns the row: Jobs, War, Train.</p>
      <p><b>Messages</b> arrive at the top and fade; tap one to see where. × on a group of news asks to hide that group: it then goes quietly to the mail, and red still shows. Numbers wear one colour scale: green gaining, white steady, red losing.</p>
      <p><b>The finger:</b> tap a building or a place and its page opens; tap one of your people to pick them, twice for their page; hold to pick more, or hold and drag on open ground to box a group. With yours picked, tap a target: they attack, hunt, gather, build, mend or walk there. Tap open ground with nobody picked: the sword and ✕ at your finger; the sword sends every soldier there. Pause shows the speeds under the button.</p>
      <p><b>Army:</b> tap open ground with nothing picked, then the sword: All or the idle ones go there; tap an enemy and the same answers come at once. The War page holds your squads (tap one for what it is made of) and the Train page what is being trained.</p>
      <p><b>Forest:</b> trees are a wall until cut. Hold, then drag a box over trees to cut a road.</p>
      <p><b>Trade:</b> caravans sell goods at the four trade stops, or trade with an ally. A Trade post holds a stop.</p>
      <p><b>The world:</b> seasons, weather, harvests and sickness change what pays. Guarded finds wait in every corner.</p>
      <p><b>Win</b> by conquest, a wonder held ${WONDER_HOLD / 60} minutes, or the top score at the bell. Score is top right. The Guide and Rules above hold every number.</p>` +
			settingsHTML() +
			list([
				btn('tips', 'Tips', SET.tips ? 'on' : 'off', SET.tips ? 'on' : ''),
				btn('msgs', 'Messages', SET.msgs !== false ? 'on' : 'off', SET.msgs !== false ? 'on' : ''),
				btn('news', 'World news', SET.news !== false ? 'on' : 'off', SET.news !== false ? 'on' : ''),
				btn('lights', 'Lights', SET.lights !== false ? 'on' : 'off', SET.lights !== false ? 'on' : ''),
				btn('cardpause', 'Pause on cards', SET.cardPause !== false ? 'on' : 'off', SET.cardPause !== false ? 'on' : ''),
				btn('soundpage', 'Sound', SND.on ? Math.round(SND.vol * 100) + '%' : 'off'),
				btn('card:taps', 'Tap counts', 'this phone only'),
			]) +
			(SET.hideG && Object.keys(SET.hideG).length
				? acts(btn('mailall', 'Show every group again', Object.keys(SET.hideG).map((g) => GROUPS[g]).join(', ') + ' hidden'), 'c1')
				: '') +
			acts(
				btn(
					'newgame',
					G.confirm === 'new' ? 'Tap again' : 'New game',
					G.confirm === 'new' ? 'this one is lost' : 'pick your people',
					G.confirm === 'new' ? 'warn' : '',
				),
				'c1',
			) +
			`<p>The game saves itself every ${SAVE_EVERY} seconds on this phone. World, game length and people take effect in the next game.</p>`
		);
	},
};
const GUIDE_PG = { key: '', h: '' }; // the Guide's page, built once a page (CARDS.guide)
const FULL = new Set(['setup', 'resume', 'help', 'guide', 'score', 'research', 'menu', 'troops']); // the cards that take the whole height; the Army card with Battalions needs 11 ranks (E8)
// three sizes, one mold each (Albert, Build 63), counted in ranks in the style sheet: lg every rank that fits above the row (the Build
// card, the Guide, Help, Setup); md a thing's card, 10 at most; sm a short one, 8 at most
const SIZE_OF = (c) =>
	FULL.has(c.type) || (c.type === 'bld' && (byId(G.blds, c.id) || {}).kind === 'market')
		? 'lg'
		: c.type === 'squad'
			? 'sm'
			: 'md'; // one home for a card's size: the Market is a building card the height of a full one
function renderCard() {
	const c = G.card;
	if (!c || !CARDS[c.type]) return;
	cardPause(c);
	infoBuf = [];
	cardHead = ['', ''];
	let h = CARDS[c.type](c);
	if (h === null) {
		closeCard();
		return;
	}
	const book = infoBuf.join(''),
		bookOn = !!book && G.infoOpen,
		tip = G.techTip && TECHBY[G.techTip];
	h =
		titleBar(cardHead, !!book, bookOn) +
		(bookOn ? `<div class="infoP">${book}</div>` : '') +
		(tip ? `<div class="infoP">${techBook(tip)}<p>Cost ${costText(tip.cost)} · ${tip.t} s to research.</p></div>` : '') +
		h;
	if (h !== cardSig) {
		cardSig = h;
		patchHTML(cardIn, h);
	}
	const size = SIZE_OF(c);
	for (const s of ['lg', 'md', 'sm']) $('card').classList.toggle(s, size === s);
	$('card').hidden = false;
}
$('card').addEventListener(
	'toggle',
	(e) => {
		const id = e.target.dataset && e.target.dataset.f;
		if (id) {
			if (e.target.open) FOLD.add(id);
			else FOLD.delete(id);
		}
	},
	true,
);
// ═════ 31-guide.js: the Guide, written from the tables ═════
function guideModel() {
	const unitsAt = (k) =>
			Object.values(UNIT)
				.filter((U) => U.at === k && !U.civ && U.cost)
				.map((U) => U.name),
		techsAt = (k) => TECH.filter((t) => t.at === k).map((t) => t.name);
	const menuOf = {};
	MENUS.forEach((m) =>
		m.items.forEach((i) => {
			menuOf[i] = m.name;
		}),
	);
	const buildings = Object.entries(BLD).map(([id, B]) => ({
		id,
		name: B.name + (B.name3 ? ` (${B.name3} in the Medieval age)` : ''),
		menu:
			id === 'keep'
				? 'you start with it'
				: menuOf[id] ||
					(id === 'tpost'
						? 'on a trade stop'
						: B.trap
							? 'laid by the Natives' // a trap in no menu (a Walls trap has its menu above)
							: 'the Natives build it'),
		age: AGES[B.age || 0].name,
		cost: costText(B.cost) || 'free',
		secs: B.t ? B.t + ' s' : '',
		squares: B.fp + '×' + B.fp,
		trains: unitsAt(id),
		research: techsAt(id),
		what: B.desc,
		why: WHY[id],
	}));
	const tierNames = (id) => TECH.filter((t) => t.tier && t.tier.unit === id).map((t) => `${t.tier.name} (${t.name})`);
	const units = Object.entries(UNIT)
		.filter(([, U]) => U.cost)
		.map(([id, U]) => ({
			id,
			name: U.name,
			at: U.at ? BLD[U.at].name : 'the Town Center',
			age: AGES[U.age || 0].name,
			cost: costText(U.cost),
			secs: U.t + ' s',
			hp: U.hp,
			dmg: U.dmg || 0,
			rng: U.rng || 0,
			spd: U.spd,
			civ: U.civ ? CIVS[U.civ].name : '',
			replaces: U.replaces ? UNIT[U.replaces].name : '',
			beats: Object.entries(U.vs || {})
				.map(([k, m]) => (UNIT[k] ? UNIT[k].name : k) + ' ×' + m)
				.concat(U.bld && U.bld !== 1 ? ['buildings ×' + U.bld] : [])
				.concat(U.bonly ? ['buildings only'] : []),
			tiers: tierNames(id),
			what: U.desc,
			why: WHY[id],
		}));
	const techs = TECH.map((t) => ({
		id: t.id,
		name: t.name,
		at: BLD[t.at].name,
		age: AGES[t.age].name,
		line: t.line,
		when: t.when || '',
		w: t.w || 0,
		need: needsOf(t)
			.map((n) => TECHBY[n].name)
			.join(', '),
		cost: costText(t.cost),
		secs: t.t + ' s',
		what: t.desc,
		why: techWhy(t.id),
	}));
	const ages = AGES.map((A, i) => ({
		id: 'age' + i,
		name: A.name,
		cost: i ? costText(A.cost) : 'where you start',
		secs: i ? A.t + ' s' : '',
		opens: {
			buildings: Object.entries(BLD)
				.filter(([k, B]) => k !== 'keep' && (B.age || 0) === i)
				.map(([, B]) => B.name),
			units: Object.values(UNIT)
				.filter((U) => U.cost && !U.civ && (U.age || 0) === i)
				.map((U) => U.name),
			research: TECH.filter((t) => t.age === i).map((t) => t.name),
		},
		why: WHY['age' + i],
	}));
	const civs = CIVK.map((k) => ({
		id: k,
		name: CIVS[k].name,
		unit: UNIT[CIVS[k].uu].name,
		replaces: UNIT[UNIT[CIVS[k].uu].replaces].name,
		bonus: CIVS[k].bonus,
		wonder: CIVS[k].wonder,
		why: WHY['bonus:' + k],
		wwhy: WHY['wonder:' + k],
		uwhy: WHY[CIVS[k].uu],
	}));
	const finds = Object.entries(FINDS).map(([id, F]) => ({ id, name: F.name, what: F.desc, why: WHY[id] }));
	const rules = TRIGGERS().map(([when, then, why]) => ({ when, then, why }));
	return { buildings, units, techs, ages, civs, finds, rules };
}
function guideHTML(pg) {
	const g2 = guideModel(),
		E = (t, m, lines) =>
			`<div class="g"><b>${t}</b><small>${m}</small>${lines
				.filter(Boolean)
				.map((l) => `<p>${l}</p>`)
				.join('')}</div>`;
	if (pg === 'bld')
		return g2.buildings
			.map((b) =>
				E(b.name, `${b.menu} · ${b.age} age · ${b.cost}${b.secs ? ' · ' + b.secs : ''}`, [
					b.what,
					(b.trains.length ? `<i>Trains:</i> ${b.trains.join(', ')}. ` : '') +
						(b.research.length ? `<i>Researches:</i> ${b.research.join(', ')}.` : ''),
					b.why && `<i>Why:</i> ${b.why}`,
				]),
			)
			.join('');
	if (pg === 'unit')
		return g2.units
			.map((u) =>
				E(
					u.name,
					`${u.civ ? u.civ + ' only, in place of the ' + u.replaces + ' · ' : ''}${u.at} · ${u.age} age · ${u.cost} · ${u.secs}`,
					[
						u.what,
						`<i>Health</i> ${u.hp}${u.dmg ? ` · <i>hits</i> ${u.dmg} · <i>reach</i> ${u.rng}` : ''} · <i>speed</i> ${u.spd}`,
						u.beats.length ? `<i>Strong against:</i> ${u.beats.join(', ')}` : '',
						u.tiers.length ? `<i>Becomes:</i> ${u.tiers.join(', then ')}` : '',
						u.why && `<i>Why:</i> ${u.why}`,
					],
				),
			)
			.join('');
	if (pg === 'tech')
		return g2.techs
			.map((t) =>
				E(
					t.name,
					`${t.at} · ${t.line} · ${t.age} age${t.when ? ' · ' + t.when : ''}${t.w ? ' · weight ' + t.w : ''} · ${t.cost} · ${t.secs}${t.need ? ' · needs ' + t.need : ''}`,
					[t.what, t.why && `<i>Why:</i> ${t.why}`],
				),
			)
			.join('');
	if (pg === 'age')
		return g2.ages
			.map((a) =>
				E(a.name + ' age', `${a.cost}${a.secs ? ' · ' + a.secs : ''}`, [
					`<i>Opens:</i> ${[a.opens.buildings.join(', '), a.opens.units.join(', '), a.opens.research.join(', ')].filter(Boolean).join(' · ')}`,
					`<i>Why:</i> ${a.why}`,
				]),
			)
			.join('');
	if (pg === 'civ')
		return (
			g2.civs
				.map((c) =>
					E(c.name, `${c.unit} (in place of the ${c.replaces}) · ${c.wonder}`, [
						c.bonus,
						`<i>Why:</i> ${c.why}`,
						`<i>${c.unit}:</i> ${c.uwhy}`,
						`<i>${c.wonder}:</i> ${c.wwhy}`,
					]),
				)
				.join('') + g2.finds.map((f) => E(f.name, 'in the wild', [f.what, f.why && `<i>Why:</i> ${f.why}`])).join('')
		);
	return g2.rules.map((r) => E(r.when, '', [r.then, `<i>Why:</i> ${r.why}`])).join('');
}
// ── History (beta): the dated things of the game in order, searchable, each with a trail to the real source. For people with homework.
const HIST_NOTE =
	'Dates are the first clear evidence; scholars argue many of them. The game compresses ages and sizes effects for play. Check before you cite.';
const HIST_ASK = 'Spotted a wrong date or a better story? Tell us: github.com/acohen2300/first-keep/issues';
const yearOf = (w) => {
	if (!w) return 9e9;
	const s = String(w);
	const m = s.match(/([\d,]+)\s*BC/);
	if (m) return -parseInt(m[1].replace(/,/g, ''));
	const n = s.match(/(\d+)/);
	if (n) return parseInt(n[1]);
	return { 'Stone age': -8000, 'Bronze age': -2500, Roman: 100, Medieval: 1100 }[s] || 9e9;
};
function histRows() {
	const g2 = guideModel();
	return g2.techs
		.filter((t) => t.when)
		.map((t) => ({ ...t, y: yearOf(t.when) }))
		.sort((a, b) => a.y - b.y);
}
const histText = (t) => `${t.name} · ${t.when} · ${t.line}, ${t.at}. ${t.what} ${t.why || ''}`;
function histHTML(q) {
	const words = (q || '').toLowerCase().split(/\s+/).filter(Boolean),
		rows = histRows().filter(
			(t) =>
				!words.length || words.every((w) => histText(t).toLowerCase().includes(w) || t.age.toLowerCase().includes(w)),
		);
	if (!rows.length) return '<p>Nothing by that name. Try a date, a place or a thing.</p>';
	const look = (t) =>
		`<a class="look" href="https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(t.name)}" target="_blank" rel="noopener">Look it up</a>`;
	return rows
		.map(
			(t) =>
				`<div class="g"><b>${t.name}</b><small>${t.when} · ${t.line}, ${t.at} · ${t.age} age</small><p>${t.what} ${t.why || ''}</p><p class="row">${look(t)} <button class="lnk" data-act="copy:${t.id}">Copy</button></p></div>`,
		)
		.join('');
}
function guideMd() {
	const g2 = guideModel(),
		L = [],
		cell = (s) => String(s || '-').replace(/\|/g, '/');
	L.push(
		`# First Keep (build ${BUILD}): what triggers what, what begets what, and why`,
		'',
		'Written by the game from its own rule tables: its numbers are the game.',
		'',
	);
	L.push('## Ages', '', '| Age | Costs | Opens | Why |', '|---|---|---|---|');
	for (const a of g2.ages)
		L.push(
			`| ${a.name} | ${a.cost}${a.secs ? ', ' + a.secs : ''} | ${cell([a.opens.buildings.join(', '), a.opens.units.join(', '), a.opens.research.join(', ')].filter(Boolean).join('; '))} | ${cell(a.why)} |`,
		);
	L.push('', '## Peoples', '', '| People | Unique soldier | Bonus | Wonder | Why |', '|---|---|---|---|---|');
	for (const c of g2.civs)
		L.push(
			`| ${c.name} | ${c.unit} (for the ${c.replaces}) | ${c.bonus} | ${c.wonder} | ${cell(c.why + ' ' + c.uwhy + ' ' + c.wwhy)} |`,
		);
	L.push(
		'',
		'## Buildings',
		'',
		'| Building | Menu | Age | Costs | Trains / researches | What it does | Why |',
		'|---|---|---|---|---|---|---|',
	);
	for (const b of g2.buildings)
		L.push(
			`| ${b.name} | ${cell(b.menu)} | ${b.age} | ${b.cost}${b.secs ? ', ' + b.secs : ''} | ${cell([b.trains.length ? 'trains ' + b.trains.join(', ') : '', b.research.length ? 'researches ' + b.research.join(', ') : ''].filter(Boolean).join('; '))} | ${cell(b.what)} | ${cell(b.why)} |`,
		);
	L.push(
		'',
		'## Units',
		'',
		'| Unit | From | Age | Costs | Health | Strong against | Becomes | Why |',
		'|---|---|---|---|---|---|---|---|',
	);
	for (const u of g2.units)
		L.push(
			`| ${u.name}${u.civ ? ' (' + u.civ + ')' : ''} | ${u.at} | ${u.age} | ${u.cost}, ${u.secs} | ${u.hp} | ${cell(u.beats.join(', '))} | ${cell(u.tiers.join(', '))} | ${cell(u.why)} |`,
		);
	L.push(
		'',
		'## Research',
		'',
		'| Research | At | Age | Needs | Costs | Effect | Why |',
		'|---|---|---|---|---|---|---|',
	);
	for (const t of g2.techs)
		L.push(
			`| ${t.name} | ${t.at} | ${t.age} | ${cell(t.need)} | ${t.cost}, ${t.secs} | ${cell(t.what)} | ${cell(t.why)} |`,
		);
	L.push('', '## The wild', '', '| Find | What | Why |', '|---|---|---|');
	for (const f of g2.finds) L.push(`| ${f.name} | ${cell(f.what)} | ${cell(f.why)} |`);
	L.push('', '## Rules: what triggers what', '', '| When | Then | Why |', '|---|---|---|');
	for (const r of g2.rules) L.push(`| ${cell(r.when)} | ${cell(r.then)} | ${cell(r.why)} |`);
	return L.join('\n');
}
// ═════ 32-frame.js: the frame: the bars, the preview and the mail, the page ═════
// ───────────────────────── The frame: the screen round the map, and its refresh ─────────────────────────
// Every icon is drawn once, here. The markup reads from this table, so a resource looks the same in the tally and under the jobs.
const SVG = (vb, body, cls = 'gl') => `<svg class="${cls}" viewBox="0 0 ${vb} ${vb}" aria-hidden="true">${body}</svg>`;
const ICON = {
	aim: SVG(
		20,
		'<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 1v4M10 15v4M1 10h4M15 10h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/>',
	),
	next: SVG(
		20,
		'<path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
	), // the next page (the Build menu)
	back: SVG(
		20,
		'<path d="M9 5l-5 5 5 5M4 10h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
	),
	gear: SVG(
		20,
		'<circle cx="10" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 1.8v2.4M10 15.8v2.4M1.8 10h2.4M15.8 10h2.4M4.2 4.2l1.7 1.7M14.1 14.1l1.7 1.7M15.8 4.2l-1.7 1.7M5.9 14.1l-1.7 1.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
	),
	stop: SVG(20, '<rect x="5" y="5" width="10" height="10" rx="1.5" fill="currentColor"/>'),
	ok: SVG(
		20,
		'<path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
	),
	star: SVG(
		20,
		'<path d="M10 2.2l2.4 5 5.4.7-3.9 3.8.9 5.4L10 14.5l-4.8 2.6.9-5.4L2.2 7.9l5.4-.7z" fill="currentColor"/>',
	),
	food: SVG(
		16,
		'<path d="M8 4.5 L10.5 1.5" stroke="#6aa04f" stroke-width="1.6" stroke-linecap="round"/><circle cx="5.2" cy="10" r="3.3" fill="#d9607a"/><circle cx="10.8" cy="10" r="3.3" fill="#d9607a"/><circle cx="8" cy="6.4" r="3.3" fill="#ec8ea3"/>',
	),
	wood: SVG(
		16,
		'<rect x="1" y="5" width="13" height="7" rx="3.5" fill="#a8743f"/><circle cx="11.6" cy="8.5" r="2.7" fill="#e3b98a"/><circle cx="11.6" cy="8.5" r="1.1" fill="#a8743f"/>',
	),
	stone: SVG(
		16,
		'<path d="M1.5 12.5 L3.5 5 L8.5 2.5 L14.5 6.5 L13.5 13.5 Z" fill="#b4bbc0" stroke="#6b7378"/><path d="M3.5 5 L8.5 7 L14.5 6.5 M8.5 7 L8 13.5" stroke="#868e93" fill="none"/>',
	),
	gold: SVG(
		16,
		'<circle cx="8" cy="8" r="6.5" fill="#f2cf55"/><circle cx="8" cy="8" r="4" fill="none" stroke="#b8902a" stroke-width="1.3"/>',
	),
	iron: SVG(
		16,
		'<path d="M2 11 L5 5 L11 5 L14 11 Z" fill="#8fa3b5"/><path d="M5 5 L11 5 L9.5 8 L6.5 8 Z" fill="#c9d4de"/>',
	),
	people: SVG(
		20,
		'<path d="M1.6 9.2h5.2M4.2 6.6v5.2" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><circle cx="12.4" cy="6.2" r="3.2" fill="currentColor"/><path d="M6.4 16.5 C6.4 12.6 9.1 10.8 12.4 10.8 C15.7 10.8 18.4 12.6 18.4 16.5 Z" fill="currentColor"/>',
	), // a plus and a head: the tile makes a villager (Build 61, Albert: muscle memory went to the hammer)
	squad: SVG(
		22,
		'<circle cx="5" cy="6" r="2.4" fill="currentColor"/><circle cx="11" cy="5.2" r="2.7" fill="currentColor"/><circle cx="17" cy="6" r="2.4" fill="currentColor"/><path d="M1.2 15.5c0-3 1.7-4.6 3.8-4.6s3.8 1.6 3.8 4.6ZM6.8 15.5c0-3.5 1.9-5.3 4.2-5.3s4.2 1.8 4.2 5.3ZM13.2 15.5c0-3 1.7-4.6 3.8-4.6s3.8 1.6 3.8 4.6Z" fill="currentColor"/>',
	),
	shield: SVG(
		16,
		'<path d="M8 1.5 L13.5 3.5 V8 Q13.5 12.5 8 14.5 Q2.5 12.5 2.5 8 V3.5 Z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
	),
	cls: {
		// the four kinds of soldier: Cream 1 like every icon but the five resources (MENU-SPEC §6; Build 70: their own pigments went)
		foot: SVG(
			16,
			'<path d="M3 14 L12.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M11 2 L14.5 1.5 L14 5 Z" fill="currentColor"/>',
		),
		arch: SVG(
			16,
			'<path d="M5 1.5 Q14 8 5 14.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 1.5 V14.5" stroke="currentColor" stroke-width=".8"/><path d="M2 8 H12" stroke="currentColor" stroke-width="1.2"/><path d="M12 6.5 L14.5 8 L12 9.5Z" fill="currentColor"/>',
		),
		horse: SVG(
			16,
			'<path d="M3 14 L4 9 Q4 6 7 6 L9 3 L10.5 4.5 L13.5 5 L13 7 L10.5 7 L10.5 10 L12 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
		),
		siege: SVG(
			16,
			'<rect x="2" y="7" width="11" height="3.5" rx="1" fill="currentColor"/><path d="M13 8.7 H15" stroke="currentColor" stroke-width="2"/><circle cx="4.5" cy="12.5" r="1.6" fill="currentColor"/><circle cx="10.5" cy="12.5" r="1.6" fill="currentColor"/><path d="M3 7 L7.5 3 L12 7" fill="none" stroke="currentColor" stroke-width="1.3"/>',
		),
	},
	head: SVG(
		20,
		'<circle cx="10" cy="6.2" r="3.2" fill="currentColor"/><path d="M3.8 16.5 C3.8 12.6 6.6 10.8 10 10.8 C13.4 10.8 16.2 12.6 16.2 16.5 Z" fill="currentColor"/>',
	),
	idle: SVG(
		20,
		'<circle cx="8" cy="7.2" r="3.2" fill="currentColor"/><path d="M1.8 17.5 C1.8 13.6 4.6 11.8 8 11.8 C11.4 11.8 14.2 13.6 14.2 17.5 Z" fill="currentColor"/><path d="M13 2.5h4.5L13 8h4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
	), // a head and a z, the strip's idle mark: the quick action's idle ones (Build 70)
	home: SVG(
		20,
		'<path d="M3.5 10 L10 4 L16.5 10" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round"/><path d="M5.5 9 V16 H14.5 V9" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M8.6 16 V12 H11.4 V16" fill="currentColor"/>',
	),
	mil: SVG(
		20,
		'<path d="M10 3 L16 5.4 V10 C16 13.4 13.4 15.8 10 17 C6.6 15.8 4 13.4 4 10 V5.4 Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M10 3 V17" stroke="currentColor" stroke-width="1.4"/>',
	),
	def: SVG(
		20,
		'<path d="M4 17 V6 H6.5 V8.2 H8.6 V6 H11.4 V8.2 H13.5 V6 H16 V17 Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M8.6 17 V13 H11.4 V17" fill="currentColor"/>',
	),
	swordup: SVG(
		20,
		'<path d="M10 1.5 L12 5 L12 12.5 L8 12.5 L8 5 Z" fill="currentColor"/><path d="M5 13.2 H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 13.5 V18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="10" cy="18.4" r="1.1" fill="currentColor"/>',
	), // one sword, point up: the War tile (Nov 3: the crossed swords read as an X)
	sword: SVG(
		16,
		'<path d="M13.5 2.5 L13.5 4.6 L6.6 11.5 L4.5 9.4 L11.4 2.5 Z" fill="currentColor"/><path d="M3.2 8.6 L7.4 12.8 M2.4 13.6 L5 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
	),
	close: SVG(
		20,
		'<path d="M5.5 5.5 L14.5 14.5 M14.5 5.5 L5.5 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
	),
	minus: SVG(20, '<path d="M4.5 10 H15.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
	plus: SVG(20, '<path d="M4.5 10 H15.5 M10 4.5 V15.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'), // − and + drawn as the symbols they are, at 24 like ✓ and ✕ (MENU-SPEC §6)
	hammer: SVG(
		16,
		'<path d="M3 13 L9 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 3.5 L10 2 L13.5 5.5 L12 8.5 Z" fill="currentColor"/>',
	),
	book: SVG(
		16,
		'<path d="M2 3.5 Q5.2 2.4 8 4 Q10.8 2.4 14 3.5 V12.5 Q10.8 11.4 8 13 Q5.2 11.4 2 12.5 Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 4 V13" stroke="currentColor" stroke-width="1.2"/>',
	),
	follow: SVG(
		16,
		'<circle cx="8" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 1.5 V4 M8 12 V14.5 M1.5 8 H4 M12 8 H14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
	),
	sound: SVG(
		16,
		'<path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path class="w" d="M11 5.5q2 2.5 0 5M12.8 3.8q3.4 4.2 0 8.4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/><path class="x" d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
	),
	list: SVG(
		16,
		'<path d="M3 4.5h10M3 8h10M3 11.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
	),
	mail: SVG(
		20,
		'<rect x="2.5" y="4.5" width="15" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 5.5 L10 11 L17 5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
	),
	play: SVG(16, '<path d="M4.5 2.8 L13 8 L4.5 13.2 Z" fill="currentColor"/>'),
	// the three stances (v80, Relations final), keyed as REL_WORD: a sword, the scales, a handshake; from Lucide (ISC licence, src/fonts/ISC-lucide.txt), line only
	war: SVG(
		24,
		'<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></g>',
	),
	peace: SVG(
		24,
		'<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></g>',
	),
	ally: SVG(
		24,
		'<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></g>',
	),
	pause: SVG(16, '<path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor"/>'),
};
ICON.book = ICON.book.replace('class="gl"', 'width="18" height="18"');
// One mold for every control: a cell is an icon spot and a word spot. The tally is a pill of cells; a slot of the row or of a card is one
// cell in its own box (MENU-SPEC §6): a picture icon at 18 with its number beside it and its word at 12 under it (pic), or a symbol alone
// at 24: ✓ ✕ − + (sym). Its state is a class, drawn as a ring (shell-head's states).
const cell = (attrs, icon, word, cls = '') => `<button class="cell ${cls}" ${attrs}>${icon}${word}</button>`;
const wd = (t, id) => `<span class="wd"${id ? ` id="${id}"` : ''}>${t}</span>`;
const topOf = (icon, n) =>
	`<span class="top">${icon}${n === undefined || n === null ? '' : `<span class="c">${n}</span>`}</span>`;
const pic = (act, icon, word, cls = '', n, attrs = '') => cell(`data-act="${act}"${attrs}`, topOf(icon, n), wd(word), cls);
const sym = (act, icon, cls = '', label = '') => cell(`data-act="${act}" aria-label="${label}"`, icon, '', 'sym ' + cls);
const toGo = (f) => `--p:${Math.round(clamp(f, 0, 1) * 100)}%`; // the working ring: the share still to go, 1 when the work starts (MENU-SPEC §9)
// The top: the tally (five counts, mute, pause, the map), then the status pill under it, cell for cell. The bottom: the row (39-huddle).
const AGE_SHORT = ['Stone', 'Bronze', 'Classical', 'Medieval', 'Powder', 'Peace']; // the age in the strip: its name where it fits the 45 pt cell (measured: Medieval 42), short for the two that do not (Gunpowder 55, Enlightenment 70)
const STATUS = [
	['stAge', '', 'The age'],
	['stSea', '', 'The season and the sky'],
	['stClk', '', 'The clock'],
	['stPeo', 'card:troops', 'Everyone you have, of the room your homes give'],
	['stIdl', 'idlego', 'Idle villagers: show one'],
	['stRes', 'card:research', 'Research you can start now'],
	['scoreP', 'card:score', 'Score and rank'],
	['stArm', '', 'Soldiers'],
];
const STATUS_CUT = ['stSea']; // the strip has a cell for each of the tally's (Iron hidden in the Stone age: 7): the cells it lets go first, the sky first (it is on the map itself); the soldiers stay

function buildPanel() {
	$('tally').innerHTML =
		[
			['f', 'Food'],
			['w', 'Wood'],
			['s', 'Stone'],
			['g', 'Gold'],
			['i', 'Iron'],
		]
			.map(([r, n]) =>
				cell(`data-act="card:stores" aria-label="${n}: open the stores"`, ICON[n.toLowerCase()], wd('0', 'r' + r)),
			)
			.join('') +
		cell('id="muteB" data-act="sound" aria-label="Mute"', ICON.sound, '', 'one') +
		cell('id="pauseB" data-act="pause" aria-label="Pause"', ICON.pause, '', 'one') +
		cell('id="mailB" data-act="mail" aria-label="The mail"', `<span class="top">${ICON.mail}<span class="c" id="mailN">0</span></span>`, '', 'one'); // one button for play, pause and speed (hold it); the last cell the mail, with what is unread beside it (Albert, Nov 2: the Mail's door, D-080; it was the small map, now in the battle station)
	// the status pill: the state of the world, one cell under each column of the tally (Albert, Build 64: "age under Food, season under
	// Wood"); the cells never move, and a narrow tally shows the first ones (the age, the season, the clock, the people come first)
	const sc = (id, act, label) =>
		act
			? `<button class="cell" id="${id}" data-act="${act}" aria-label="${label}"><span class="gl"></span><span class="wd"></span></button>`
			: `<span class="cell" id="${id}" aria-label="${label}"><span class="gl"></span><span class="wd"></span></span>`;
	$('status').innerHTML = STATUS.map(([id, act, label]) => sc(id, act, label)).join('');
	$('homeB').innerHTML = ICON.home;
	$('yardB').innerHTML = topOf(ICON.gear) + wd(ROW_WORD.yard); // the Yard (preview 47): the controls of 37 to 44 that have no slot on 33's screens yet
	$('yardB').hidden = !YARD_ON;
	$('emgB').innerHTML = topOf(ICON.def) + wd(ROW_WORD.emg); // War, red on steel, on the rank above the row: the battle station; ✕ while it is up (rowUI)
	mini.hidden = false; // the small map draws in the station's middle; on the stage between, the style sheet keeps it out of sight // a slot with its word under its icon, on the cycle button's rank (cold review of v70)
	$('pX').innerHTML = ICON.close;
}
const refresh = () => {
	cardSig = '';
	ui(true);
};
function muteBtn() {
	$('muteB').classList.toggle('off', !SND.on);
	$('muteB').classList.toggle('on', !SND.on);
	$('muteB').setAttribute('aria-label', SND.on ? 'Mute' : 'Sound on');
}
function paceBtn() {
	const pb = $('pauseB');
	pb.innerHTML = (G.paused ? ICON.play : ICON.pause) + (G.speed > 1 ? `<span class="spd">×${G.speed}</span>` : '');
	pb.setAttribute('aria-label', G.paused ? 'Play' : 'Pause');
	pb.classList.toggle('on', !!G.paused);
}
function setPause(v) {
	G.paused = v;
	paceBtn();
	if (!v && typeof spdPop === 'function') spdPop(false);
}
// the end of a game: the sim says who won and why; the screen shows it
function showEnd(won, text, all) {
	$('endT').textContent = all ? 'Everyone wins' : won ? 'Victory' : 'Defeat';
	$('endP').textContent = text;
	G.chronP = 0;
	$('endX').innerHTML = crownsHTML(); // the three crowns and the overall, then the chronicle, its newest page
	$('endNext').hidden = $('endFree').hidden = !won;
	$('endLog').hidden = !YARD_ON; // the match log (preview 49): preview only
	$('endLog').innerHTML = '<b>Copy match log</b><small>paste it to Claude</small>';
	$('end').hidden = false;
	closeCard();
	hideQuick(); // the next game starts with nothing of this one open
}
// The page's own measures: how tall the orders are (the map's bottom edge) and where the map's middle sits between the bars
function fit() {
	const r = cv.getBoundingClientRect();
	dpr = DRAW.lvl >= 3 ? 1 : Math.min(2, window.devicePixelRatio || 1);
	cw = r.width;
	ch = r.height;
	{
		const h = $('hud').getBoundingClientRect(),
			o = $('orders').getBoundingClientRect(),
			t = r.top;
		document.documentElement.style.setProperty('--ob', Math.round(r.bottom - o.top) + 'px');
		vy =Math.round((h.bottom - t + (o.top - t)) / 2 - ch / 2);
		bandH = Math.max(100, o.top - h.bottom);
	}
	const W = Math.round(cw * dpr),
		H = Math.round(ch * dpr);
	if (cv.width !== W) cv.width = W;
	if (cv.height !== H) cv.height = H;
	cam.z = clamp(cam.z, minZ(), ZOOM_MAX);
	clampCam();
}

// who a unit not yours belongs to, in a few words: a rival and how you stand, a misfit group and how you stand (answer 1b), the wild
function whoIs(u) {
	const nm = UNIT[u.kind].name;
	if (u.owner !== WILD) {
		const P = G.P[u.owner];
		return `${nm} · ${P.name}${P.civ ? ', ' + CIVS[P.civ].name : ''} · ${REL_WORD[G.rel[0][u.owner]].toLowerCase()}`;
	}
	if (u.native) return `${nm} · the Natives · ${REL_WORD[G.rel[0][WILD]].toLowerCase()}`;
	const g = gangOf(u);
	if (g !== 'nat' && g !== 'beast') return `${nm} · the ${GANG[g]} · ${REL_WORD[gangRel(0, g)].toLowerCase()}`;
	return `${nm} · ${g === 'beast' ? 'a wild animal' : 'the wild'}`;
}
// ───────────────────────── Messages (Build 64, Albert) ─────────────────────────
// A line arrives as a preview, the way a phone shows a text, over the map, and fades after MSG.secs; every line is kept in the mail (the
// dashboard's last tile). Two kinds: a reply, from say, answers your own tap and is never hidden; news, from news, comes from the world by group,
// and a group can be hidden from the preview's ×: its lines then go quietly to the mail, unless urgent (red). A repeat in the same group
// within MSG.merge seconds is a count on the first (Raid ×3), not a new flash. The best of the genre do the same: one alert a place, a
// sound and a place to tap, the text short and gone, a list to read later.
const MSG = { secs: 4, merge: 30, keep: 30, page: 6 }; // the mail keeps 30 lines, six a page (N13)
const GROUPS = {
	war: 'War',
	home: 'Home',
	land: 'Land',
	trade: 'Trade',
	realm: 'Realm',
	chronicle: 'Chronicle',
	lesson: 'Lessons',
	advice: 'Advice',
	reply: 'Replies',
};
const MAIL_FILTERS = ['war', 'home', 'land', 'trade', 'realm']; // the Mail card's filters after All (MENU-SPEC §8: six, one rank); the other groups show under All
const QUIET = new Set(['news', 'soft']); // quiet kinds never preview: they wait in the mail
const urgentCls = (cls) => !!cls && cls.startsWith('warn');
const ccOf = (cls) => codeOf(urgentCls(cls) ? 'r' : cls === 'good' ? 'g' : cls === 'tip' ? 'b' : 'w'); // the colour code, from its one home
const hiddenG = (g) => !!(SET.hideG && SET.hideG[g]);
const news = (grp, text, cls, secs, at, act, why) => say(text, cls, secs, at, act, why, grp);
// ───────────────────────── How news reaches you (Build 59; TELL in 06, the Post line of research)
// You know what you see, what your people hear, and what a messenger brings. A line with a place (at) out of your sight is heard if it is a
// fight near your people (vague: which way), else carried by a messenger at a runner's or a rider's pace, if your post reaches that far;
// a line with no place happens at your court, or in the sky, and is first hand.
const DIR8 = ['east', 'south-east', 'south', 'south-west', 'west', 'north-west', 'north', 'north-east'],
	dirOf = (from, to) => DIR8[Math.round(Math.atan2(to.y - from.y, to.x - from.x) / (Math.PI / 4) + 8) % 8]; // which way a place lies, of eight
function tell(text, cls, at) {
	if (!at || at.told || !G.fogOn || fogAt(at.x, at.y) === 2) return { now: true };
	const lvl = fxv(0, 'news').a,
		mine = (r) =>
			G.blds.some(
				(b) => b.owner === 0 && b.hp > 0 && Math.abs(b.x - at.x) < r && Math.abs(b.y - at.y) < r && dist(b, at) < r,
			),
		k = keepOf(0);
	if (cls === 'warn') {
		const r = TELL.hear * (G.P[0].age >= 4 ? TELL.gun : 1);
		if (
			G.units.some(
				(u) => u.owner === 0 && u.hp > 0 && Math.abs(u.x - at.x) < r && Math.abs(u.y - at.y) < r && dist(u, at) < r,
			) ||
			mine(r)
		) {
			return { now: true, text: `Sounds of fighting to the ${dirOf(k || at, at)}.` };
		}
	}
	const need = mine(TELL.near)
		? 1
		: mine(TELL.far)
			? 2
			: G.blds.some((b) => b.hp > 0 && b.owner !== 0 && G.rel[0][b.owner] === 'ally' && dist(b, at) < TELL.near)
				? 3
				: 4;
	if (lvl < need || !k) return null; // no messenger serves that far: the court never hears of it
	return { delay: wayLen(k, at, 0) / (lvl >= 2 ? TELL.ride : TELL.foot) }; // the messenger rides the road, not the crow's line (Build 60: measured 15% longer at the median, up to 40%)
}
function postTick() {
	// the messengers arrive (once a second, from eventsTick)
	if (!G.post || !G.post.length) return;
	const due = G.post.filter((m) => m.t <= G.t);
	if (!due.length) return;
	G.post = G.post.filter((m) => m.t > G.t);
	for (const m of due) say(m.text, m.cls, m.secs, m.at, m.act, m.why ? m.why + ' · by messenger' : 'by messenger', m.grp);
}
function say(text, cls, secs, at, act, why, grp = 'reply') {
	if (!G) return;
	{
		const N = tell(text, cls, at);
		if (!N) return;
		if (N.delay > 1) {
			(G.post || (G.post = [])).push({ t: G.t + N.delay, text, cls, secs, at: { x: at.x, y: at.y, told: 1 }, act, why, grp });
			return;
		}
		if (N.text) {
			text = N.text;
			at = null;
		}
	}
	const urg = urgentCls(cls);
	if (SET.msgs === false && !urg && cls !== 'tip' && grp !== 'reply') return;
	if (cls === 'news' && SET.news === false) return; // Messages off: warnings and replies only; a silenced kind stays quiet
	const M = G.mail || (G.mail = []),
		key = hushKey(text),
		now = performance.now(),
		show = Math.max(secs || 0, MSG.secs) * 1000,
		reading = !!G.card && $('card').classList.contains('lg'), // a full card: the line waits in the mail, counted, and red shows when it closes
		pre = !QUIET.has(cls) && (urg || (!hiddenG(grp) && !reading)),
		pt = at ? { x: Math.round(at.x), y: Math.round(at.y) } : null,
		same = M.find((m) => m.grp === grp && m.key === key && G.t - m.t < MSG.merge);
	if (same) {
		same.n++;
		same.t = G.t;
		same.text = text;
		if (pt) same.at = pt;
		if (pre && same.ru > now - 500) same.ru = now + show; // still showing: it stays a little longer, with its count
		return;
	} // a repeat is a count on the first, not a new flash
	M.unshift({ text, cls, grp, key, act, why, n: 1, t: G.t, ru: pre ? now + show : 0, at: pt });
	if (M.length > MSG.keep) M.length = MSG.keep;
	if (!pre || reading) G.mailN = (G.mailN || 0) + 1; // what came quietly or unseen: the count on the mail
}
const hushKey = (t) => t.replace(/[\d,.]+/g, '#'); // a line's kind: its words, the numbers aside (Raid 3 and Raid 5 are one kind)
// the milestones' tests (words in MS_TEXT): each is a moment; the first time it is true it fires, once a game. {pct} and {spd} are filled.
const MS_TEST = {
	house: () => bldsOf(0, 'house').some((b) => b.prog >= 1),
	field: () => bldsOf(0, 'farm').some((b) => b.prog >= 1),
	drop: () => G.blds.some((b) => b.owner === 0 && b.prog >= 1 && ['mill', 'lumber', 'mining'].includes(b.kind)),
	soldier: () => soldiersOf(0).length > 0,
	squad: () => hasCmd() && G.bnPlan.some((P) => Object.values(P).some(Boolean)),
	age: () => G.P[0].age >= 1,
	mud: () => G.clim.mud > 0.5 && soldiersOf(0).some((u) => armyStatus(u) === 'march') && !G.P[0].techs.has('roads'),
	snow: () => G.clim.snow > 0.5 && !G.P[0].techs.has('snowclear'),
	ice: () => G.clim.ice > 0.3 && G.t - (G.slipT || -99) < 20,
	hungry: () => !!G.P[0].hungry,
	fire: () => G.blds.some((b) => b.owner === 0 && b.fire > 0),
	rout: () => soldiersOf(0).some((u) => u.state === 'rout'),
	trade: () => unitsOf(0, 'caravan').length > 0,
	winter: () => season().name === 'Winter',
};
function msFill(t) {
	const spd = groundSpd(0, ['foot']);
	return t.replace('{pct}', String(Math.round((1 - spd) * 100))).replace('{spd}', spd.toFixed(2));
}
function milestoneTick() {
	if (G.over || !keepOf(0)) return;
	const M = G.ms || (G.ms = []);
	for (const id in MS_TEST) {
		if (M.some((m) => m.id === id)) continue;
		let on = false;
		try {
			on = MS_TEST[id]();
		} catch (e) {}
		if (!on) continue;
		M.push({ id, t: Math.round(G.t) });
		const [line] = MS_TEXT[id];
		news('lesson', msFill(line), 'good', TOAST.long, null, `card:milestone,${id}`);
		sfx('coin');
		return; // one a tick: they never pile up
	}
}
// What the town needs (Build 65: one table, where the tips, the Build page and the Stores domain each had their own copy; Build 70: the tips
// read it alone). Each test is the reason; the tips add their words.
const goldTight = (p) => p.res.g < 50 && (p.res.w > 300 || p.res.s > 300 || p.res.f > 300); // gold short while another store is full
const NEEDS = {
	house: () => popOf(0) >= capOf(0) - 1 && capOf(0) < POPMAX && !G.blds.some((b) => b.owner === 0 && b.kind === 'house' && b.prog < 1),
	barracks: () => !bldsOf(0, 'barracks').length && G.t > 75,
	lumber: () => unitsOf(0, 'vil').filter((u) => u.job === 'wood').length >= 3 && !bldsOf(0, 'lumber').length,
	farm: () => {
		const k = keepOf(0);
		return !!k && G.nodes.filter((n) => n.kind === 'bush' && dist(n, k) < 300).length < 3 && !bldsOf(0, 'farm').length;
	},
	market: () => goldTight(G.P[0]) && !bldsOf(0, 'market').length,
	hospital: () => G.units.some((u) => u.owner === 0 && u.sick > G.t) && !bldsOf(0, 'hospital').length && G.P[0].age >= 2,
};
function advise() {
	const p = G.P[0],
		k = keepOf(0);
	if (!k || G.over) return '';
	const V = unitsOf(0, 'vil'),
		on = (j) => V.filter((u) => u.job === j).length,
		S = soldiersOf(0);
	if (V.some((u) => u.noPath && G.t - (u.noPathT || -9) < 4) && !L('build:gate')) return 'Walled in: build a Gate.';
	if ((k.blocked || (NEEDS.house() && popOf(0) >= capOf(0))) && !L('build:house'))
		return p.age >= 2
			? 'You are full: Build → House or Apartment.'
			: `You are full: Build → House (${costText(BLD.house.cost)}).`;
	if (V.length < 6 && !k.q.length && afford(p, UNIT.vil.cost) && !L('train:vil'))
		return 'More villagers, more of everything.';
	if (V.length >= 3 && (on('wood') === 0 || (p.res.w < 80 && on('wood') < 2)) && !L('job:wood'))
		return 'Wood is low. Tap + under Wood.';
	if (
		G.blds.some((b) => b.owner === 0 && b.hp > 0 && b.prog < 1 && !V.some((v) => v.rep === b && v.job === 'repair')) &&
		!L('sendbld')
	)
		return 'Nobody is building: tap the site.';
	{
		const idle = V.filter(freeVil).length;
		if (idle && G.t > 20 && !L('job')) return `${idle} villager${idle > 1 ? 's' : ''} idle (z). Tap + under a job.`;
	}
	if (bldsOf(0, 'farm').some((b) => b.prog >= 1 && b.node && !(b.node.wk > 0)) && !L('job:field'))
		return 'A field has no workers. Tap + under Food.';
	if (NEEDS.barracks() && !L('build:barracks'))
		return G.diff === 'easy'
			? 'Raiders come after minute 6 on Easy: Build → Barracks before then.'
			: 'Raiders often come around minute 3 or 4: Build → Barracks.';
	if (ready(0, 'barracks').length && S.length < 3 && G.t < 600 && !L('train:spear'))
		return 'Train spearmen at your Barracks.';
	if (NEEDS.lumber() && !L('build:lumber')) return 'Wood is far: Build → Lumber camp.';
	if (NEEDS.farm() && !L('build:farm'))
		return 'Berries running low: build a Farm.';
	if (p.age === 0 && !p.aging && V.length >= 10 && !L('age')) return 'Ready: Bronze age, at the Town Center.';
	if (S.length >= 8 && G.finds.some((f) => !f.done && FINDS[f.kind].got && dist(f, k) < 600) && !L('goto'))
		return 'Treasure nearby: tap it, send troops.';
	if (
		p.age >= 1 &&
		G.P.some((q) => q.id && q.id !== WILD && q.alive && G.rel[0][q.id] === 'peace' && q.ally === null) &&
		G.P[0].ally === null &&
		!p.envoyOut &&
		!L('envoy')
	)
		return 'A neutral side could be your ally: Relations.';
	if (p.hungry) return '!Hungry. Put villagers on Food.';
	{
		const inF = (p.rate && p.rate.f) || 0,
			out = p.eats || 0;
		if (!p.hungry && G.t > 120 && inF < out && p.res.f < out * 3)
			return `Food −${Math.round(out - inF)} a minute. Add farmers.`;
	} // the stores' own arithmetic: what comes in against what is eaten
	if (vassalsOf(0).some((q) => q.unrest > 70 && !q.rebel)) return '!A vassal is restless: cut tax.';
	if (goldTight(p) && !L('trade'))
		return ready(0, 'market').length
			? 'Gold is low: sell wood, food or stone at the Market.'
			: 'Gold is low: Build → Market, then sell what you have too much of.';
	if (G.blds.some((b) => b.owner === 0 && b.fire > 0 && !G.units.some((u) => u.rep === b && u.job === 'repair')))
		return '!Fire! Tap it, send a villager.';
	if (NEEDS.hospital() && !L('build:hospital'))
		return 'Sickness: a Hospital cures it.';
	if (on('gold') === 0 && p.age >= 1 && !L('job:gold')) return 'Put villagers on Gold: it buys riders.';
	return '';
}
const SEASON_ICON = { Spring: '🌱', Summer: '☀️', Autumn: '🍂', Winter: '❄️' },
	WX_ICON = { rain: '🌧', drought: '🔥', frost: '🧊', snow: '❄️', blizzard: '🌨' };
let uiAt = 0;
const txt = (id, s) => {
	const el = $(id);
	if (el.textContent !== s) el.textContent = s;
}; // a word is written only when it changed: the page is not touched seven times a second for nothing
// Controls appear when their age comes (Build 59, Albert: hide by age). One rule, read from the rules tables: a resource opens from the first
// age anything costs it (iron from the Bronze age), or once you hold some. Until then its count waits off the tally and its job in the row is
// locked (Build 70: the row keeps its six slots, MENU-SPEC §6).
let FIRST = null;
function firstAge() {
	const F = Object.fromEntries(RES.map((r) => [KEY[r], 9])),
		see = (c, a) => {
			for (const k in c || {}) if (k in F) F[k] = Math.min(F[k], a || 0);
		};
	for (const k in UNIT) if (!UNIT[k].civ) see(UNIT[k].cost, UNIT[k].age);
	for (const k in BLD) see(BLD[k].cost, BLD[k].age);
	for (const t of TECH) if (!t.civ) see(t.cost, t.age);
	AGES.forEach((A, i) => see(A.cost, i - 1));
	return F;
}
const resAge = (k) => (FIRST || (FIRST = firstAge()))[k],
	resOn = (k) => G.P[0].age >= resAge(k) || G.P[0].res[k] >= 1;
function ui(force) {
	const now = performance.now();
	if (!force && now - uiAt < 150) return;
	uiAt = now;
	const p = G.P[0],
		R = p.res;
	document.body.classList.toggle('night', G.night > 0.5);
	for (const r of RES) $('r' + KEY[r]).parentElement.hidden = !resOn(KEY[r]);
	for (const k of ['f', 'w', 's', 'g', 'i']) {
		txt('r' + k, fmt(R[k]));
		const c = grad(velOf(p, k)),
			el = $('r' + k);
		if (el.style.color !== c) el.style.color = c;
	} // the count's colour is its velocity on the one gradient (Build 64): deep green gaining fast, white steady, red losing badly
	if (G.t - (G.rdyT ?? -9) > 1 || G.t < G.rdyT) {
		G.rdyT = G.t;
		G.rdy = new Map();
		for (const t of TECH) if (ownTech(t) && techState(t) === 'ready') G.rdy.set(t.at, (G.rdy.get(t.at) || 0) + 1);
		{
			const A = nextAge(0);
			if (A && !p.aging && keepOf(0) && afford(p, A.cost)) G.rdy.set('keep', (G.rdy.get('keep') || 0) + 1);
		}
	} // building kind → how many researches you can start there now
	if (G.tick % 90 === 7) milestoneTick();
	let tip = SET.tips ? advise() : '';
	const urgent = tip[0] === '!';
	if (urgent) tip = tip.slice(1);
	const T = G.tipS || (G.tipS = { text: '', at: -99, last: -99 });
	if (tip !== T.text && (urgent || (G.t > 20 && G.t - T.last > 45))) {
		T.text = tip;
		T.at = G.t;
		if (tip) T.last = G.t;
	}
	const showTip = tip && T.text === tip && (urgent || G.t - T.at < 6) && !G.card && !G.place && !G.over;
	if (showTip && (urgent || T.said !== T.text)) {
		T.said = T.text;
		news('advice', tip, urgent ? 'warn' : 'tip', urgent ? 3 : 6);
	} // a warning is said again while it holds (a repeat is a count, not a flash), a tip once: a tip is a message like any other
	{
		const lim = MODES[G.mode].secs,
			clk = G.wonder ? clock(Math.max(0, G.wonder.end - G.t)) : lim ? clock(Math.max(0, lim - G.t)) : clock(G.t);
		let ready = 0;
		for (const v of G.rdy.values()) ready += v; // research you can start now (the age counts: it is research too)
		const idleN = unitsOf(0, 'vil').filter(freeVil).length, // idle people only (Albert, Nov 4: an empty building is not an idle villager; it shows its own +)
			sol = armyOf(0).length,
			rank = 1 + G.P.filter((q) => q.id && q.id !== WILD && q.score.total > p.score.total).length,
			sky = `${SEASON_ICON[season().name]}${WX_ICON[G.wx] || ''}${G.night > 0.5 ? (moonLight() < 0.25 ? '🌑' : '🌙') : ''}`,
			n = Math.min(STATUS.length, [...$('tally').children].filter((e) => !e.hidden).length),
			cut = new Set(STATUS_CUT.slice(0, STATUS.length - n)),
			put = (id, gl, word, cls) => {
				const el = $(id),
					off = cut.has(id),
					sig = gl + '|' + word + '|' + cls + '|' + off;
				if (el.sig === sig) return;
				el.sig = sig;
				el.hidden = off;
				el.className = 'cell' + (cls ? ' ' + cls : '');
				el.children[0].innerHTML = gl;
				el.children[1].textContent = word;
			};
		const S = [
			['', AGE_SHORT[p.age] || AGES[p.age].name, ''],
			[sky, '', ''],
			['', clk, ''],
			['', `${popOf(0)}/${capOf(0)}`, popOf(0) >= capOf(0) && capOf(0) < POPMAX ? 'warn' : ''], // the number alone: 180/180 fits the 45 pt cell
			['', `z ${idleN}`, idleN ? 'warn' : 'dis'],
			[ICON.book, String(ready), ready ? 'go' : 'dis'],
			['', `★ ${['1st', '2nd', '3rd', '4th', '5th'][rank - 1] || rank + 'th'}`, ''], // the rank; the score itself is on the score card
			[ICON.mil, String(sol), sol ? '' : 'dis'],
		]; // one line a cell: the strip stays thin (Albert: "It has to stay little")
		STATUS.forEach(([id], i) => put(id, S[i][0], S[i][1], S[i][2]));
		txt('mailN', (G.mailN || 0) > 99 ? '99+' : String(G.mailN || 0)); // the unread, a badge on the envelope at the top (Albert, Nov 2); 99+ past 99
		$('mailB').classList.toggle('dis', !(G.mailN || 0));
	} // the colour code on the pill: blue research you can start, red the people at the roof or idle hands; dim is nothing to see
	rowUI();
	{
		const k = keepOf(0),
			away = !k || SX(k.x, k.y) < -20 || SX(k.x, k.y) > cw + 20 || SY(k.y, 0, k.x) < -20 || SY(k.y, 0, k.x) > ch + 20;
		if ($('homeB').hidden === away) $('homeB').hidden = !away;
	} // home shows only when your Town Center is off the screen
	$('stage').classList.toggle('busy', !!(G.card || G.place));
	if ($('place').hidden === !!G.place) $('place').hidden = !G.place; // the place bar follows G.place, the one home (hunt B #5: a new game left it up)
	{
		const P = picked(),
			n = P.length,
			one =
				!n && G.pickE && G.pickE.length === 1 && G.pickE[0].hp > 0 && UNIT[G.pickE[0].kind] && G.pickE[0].owner !== 0
					? G.pickE[0]
					: null,
			prey = one && one.owner === WILD && UNIT[one.kind].meat ? one : null,
			foe = one && !prey ? one : null,
			show = (n > 0 || !!one) && !G.card && !G.place,
			el = $('pickbar');
		if (el.hidden === show) el.hidden = !show;
		$('stage').classList.toggle('picking', show); // the action bar (Albert, Build 41)
		if (show && prey) {
			txt('pickT', UNIT[prey.kind].name);
			const hunters = unitsOf(0, 'vil').filter((v) => v.hunt === prey).length,
				row = `<button data-act="hunt:${prey.id}" class="go"><b>Hunt</b><small>${hunters ? hunters + ' on it' : 'nearest villager'}</small></button><button data-act="hunt3:${prey.id}"><b>Hunt ×3</b></button>`;
			if (el.rowH !== row) {
				el.rowH = row;
				$('pickRow').innerHTML = row;
			}
		} // a deer, a boar: hunt it from the bar
		else if (show && foe) {
			txt('pickT', whoIs(foe));
			const row = `<button data-act="look:${foe.id}"><b>More</b></button>`;
			if (el.rowH !== row) {
				el.rowH = row;
				$('pickRow').innerHTML = row;
			}
		} // who is this? the bar says (Albert, Build 41); an enemy opens the quick action instead, whose All is the fight (Build 70)
		else if (show) {
			txt('pickT', `${n} picked${G.pickMore ? ' · tap to add' : ''}`); // ＋ More is gone (Build 61): drag a box, or hold one and tap more
			const sol = P.some(isSoldier),
				vil = P.some((u) => u.kind === 'vil'),
				ic = (act, icon, label) => `<button data-act="${act}" aria-label="${label}">${icon}</button>`,
				tx = (act, t) => `<button data-act="${act}"><b>${t}</b></button>`;
			const tch = sol && fxv(0, 'teach').a >= 1 && P.some((u) => isSoldier(u) && teachTo(u) && u.state !== 'school');
			const away = sol && P.some((u) => isSoldier(u) && u.state !== 'home'), // Recall: whoever is out on an order, or standing where you sent them
				follow = `<button data-act="pfollow" class="${G.follow ? 'on' : ''}" aria-label="Follow: the camera goes with them">${ICON.follow}</button>`;
			const row = sol
				? tx('pcharge', 'Charge') +
					tx('pfall', 'Fall back') +
					tx('phold', 'Hold') +
					(away ? tx('precall', 'Recall') : '') +
					(tch ? tx('pteach', 'Teach') : '') +
					(vil ? ic('pvil', ICON.head, 'Keep only the villagers') : '') +
					follow
				: vil
					? JOBS.map((j) => ic(`pjob:${j}`, ICON[j], `All to ${j}`)).join('') +
						ic('pbuild', ICON.hammer, 'Build: they raise it') +
						follow
					: '';
			if (el.rowH !== row) {
				el.rowH = row;
				$('pickRow').innerHTML = row;
			}
		}
	}
	if (G.place) {
		const B = BLD[G.place.kind],
			t = !G.place.at
				? lineKind(G.place.kind)
					? `Tap where the ${G.place.kind === 'wall' ? 'wall' : 'line'} starts`
					: `Press where the ${B.name.toLowerCase()} goes · drag empty ground to look around`
				: G.place.why
					? G.place.why
					: lineKind(G.place.kind)
						? `${G.place.cells.length} pieces: tap a corner to add, drag a corner or the line, or Build`
						: `${B.name}: tap Build, or drag it to move · drag empty ground to look`;
		txt('placeT', t);
		$('placeUndo').hidden = !lineKind(G.place.kind) || !G.place.pts.length;
		$('placeOk').classList.toggle('dis', !G.place.at || !!G.place.why);
	}
	preview();
	if (G.card) renderCard();
}
const linkOf = (m) => m && (m.act || (m.at ? `jump:${m.at.x},${m.at.y}` : ''));
// The preview (Build 64): the newest live line, or the question that hides its group; paused says so when nothing is live. A full card
// is a moment of reading: the preview steps aside, and the line waits in the mail.
// the line on show: red first, then the newest (Build 65); the preview draws it and × closes it, one choice for both
const shownMsg = (now = performance.now()) => (G.mail || []).find((m) => m.ru > now && urgentCls(m.cls)) || (G.mail || []).find((m) => m.ru > now);
function preview() {
	const el = $('pv'),
		now = performance.now(),
		paused = G.paused && !(G.card && (G.card.type === 'resume' || G.card.type === 'setup')),
		live = shownMsg(now),
		big = !!G.card && $('card').classList.contains('lg'),
		ask = G.pvAsk;
	let h = '',
		cc = codeOf('w');
	if (!big && !G.over) {
		if (ask)
			h = `<div class="t"><small>${GROUPS[ask]}</small><span>Hide ${GROUPS[ask]} messages?</span></div><div class="ask"><button class="yes" data-act="pvhide:${ask}">Hide</button><button data-act="pvkeep">Keep</button></div>`;
		else if (live) {
			cc = ccOf(live.cls);
			h = `<button class="t" data-act="${linkOf(live) || 'pvx'}"><small>${GROUPS[live.grp]}${live.n > 1 ? ' ×' + live.n : ''}</small><span>${live.text}</span></button><button class="x" data-act="pvx" aria-label="Close">${ICON.close}</button>`;
		} else if (paused) h = `<button class="t" data-act="pause"><small>Paused</small><span>Tap to carry on</span></button>`;
	}
	if (h !== preview.h) {
		preview.h = h;
		el.innerHTML = h;
		el.hidden = !h;
	}
	if (el.style.getPropertyValue('--cc') !== cc) el.style.setProperty('--cc', cc);
	el.classList.toggle('fade', !!live && !ask && live.ru - now < timeOf('sweep')); // the fade starts one sweep before the end
}
// ═════ 33-verbs.js: every button verb ═════
// ───────────────────────── What every button does: one table ─────────────────────────
// every button's verb, in one table
const ACT = {
	pause() {
		setPause(!G.paused);
		spdPop(G.paused && !G.card);
	}, // paused: the speeds drop down under the button
	spd(a) {
		G.speed = clamp(Number(a), 1, 3);
		spdPop(false);
		if (G.paused) setPause(false);
		paceBtn();
	}, // from the speed drop-down under the play button
	again() {
		$('end').hidden = true;
		openCard({ type: 'setup' });
	},
	free() {
		G.over = null;
		G.free = true;
		$('end').hidden = true;
		setPause(false);
		say('Free play: no clock, no victory.', '', TOAST.mid);
	},
	next() {
		const p = G.P[0],
			keep = { age: p.age, techs: [...p.techs] };
		$('end').hidden = true;
		freshSlate();
		newGame(undefined, keep);
		setPause(false);
		say('New land. Your age and research stay.', 'good', TOAST.long);
		saveGame(true);
	},
	close() {
		if (cardLocked()) return;
		if (G.card && (G.card.type === 'resume' || G.card.type === 'setup') && G.paused) {
			setPause(false);
		}
		closeCard();
		if (G.over) $('end').hidden = false;
	}, // backing out of New game brings the end screen back
	cardback() {
		if (G.card && G.card.type === 'resume') return;
		if (G.card && G.card.from) openCard(G.card.from, true);
		else ACT.close();
	}, // the title bar's back (MENU-SPEC §4): to the card this one was opened from; on the first card it closes
	cancel() {
		cancelPlace();
	},
	placeok() {
		commitPlace();
	},
	wundo() {
		const pl = G.place;
		if (pl && pl.pts) {
			pl.pts.pop();
			wallSet(pl);
			ui(true);
		}
	},
	help() {
		openCard({ type: 'help' });
	},
	reload() {
		location.reload();
	},
	vibe() {
		SET.vibe = !SET.vibe;
		saveSet();
		feel('snap');
		refresh();
	},
	copylog() {
		copyLog();
	}, // the match log to the clipboard (preview 49; 39-huddle): in ACT, so it works on the end screen, where play verbs stop
	menu(a) {
		const keep = G.card && G.card.type === 'menu';
		openCard({ type: 'menu', id: a });
		if (keep) $('card').scrollTop = 0;
	},
	buildrow() {
		G.buildBy = null;
		if (G.card && G.card.type === 'menu') {
			G.buildAt = null;
			closeCard();
			return;
		}
		const sel = G.card && G.card.type === 'bld' && G.blds.find((b) => b.id === G.card.id && b.owner === 0),
			w = sel || toWorld(cw / 2, ch / 2 + vy),
			hint = suggestAt(w.x, w.y),
			M = hint && MENUS.find((m) => m.items.includes(hint));
		G.buildAt = hint ? { hint } : null;
		openCard({ type: 'menu', id: M ? M.id : G.lastMenu || MENUS[0].id });
	}, // Build opens on what fits the middle of the view   // Build opens the Build card on the menu last used; again, it closes
	idlego() {
		const u = unitsOf(0, 'vil').find(freeVil);
		if (!u) return;
		camGo(u.x, u.y);
		closeCard();
	},
	seek(a) {
		const o = Number(a),
			k = keepOf(o) || G.blds.find((b) => b.owner === o);
		if (!k) {
			say('Nothing of theirs stands.', '', TOAST.short);
			return;
		}
		camGo(k.x, k.y);
		if (k.kind === 'keep') openCard({ type: 'bld', id: k.id });
		else closeCard();
	},
	guide(a) {
		openCard({ type: 'guide', page: a });
	},
	copy(id) {
		const t = histRows().find((x) => x.id === id);
		if (t) clip(histText(t));
	},
	copyhist() {
		clip(`First Keep history (build ${BUILD}). ${HIST_NOTE}\n\n` + histRows().map(histText).join('\n'));
	},
	info() {
		G.infoOpen = !G.infoOpen;
		cardSig = '';
		renderCard();
	},
	home() {
		const k = keepOf(0);
		if (k) camGo(k.x, k.y);
	},
	resume() {
		const S = readSave();
		let ok = false;
		if (S)
			try {
				loadGame(S);
				ok = true;
			} catch (e) {
				keepAside('damaged'); // it would not load: kept aside, and a new game offered (A5)
				newGame();
				openCard({ type: 'setup' });
			}
		if (!ok && !S) {
			closeCard();
			setPause(false);
		}
		refresh();
	},
	fresh() {
		clearSave();
		holdSave = false;
		freshSlate();
		newGame();
		closeCard();
		setPause(false);
		saveGame(true);
		refresh();
	},
	newgame() {
		if (G.confirm === 'new') {
			openCard({ type: 'setup' });
			return;
		}
		G.confirm = 'new';
		refresh();
	},
	civ(a) {
		SET.civ = a;
		saveSet();
		refresh();
	},
	tension(a) {
		SET.tension = a;
		saveSet();
		refresh();
	},
	diff(a) {
		SET.diff = a;
		SET.tension = a === 'easy' ? 'winner' : 'diplomacy'; // the difficulty sets the tension; the toggle below can change it
		saveSet(); // the game under way keeps the difficulty it began with; the new one applies from the next game (B8)
		refresh();
	},
	mode(a) {
		SET.mode = a;
		saveSet();
		refresh();
	},
	scen(a) {
		SET.scen = SCENARIOS[a] ? a : 'open';
		saveSet();
		refresh();
	},
	fantasy(a) {
		SET.fantasy = a === '1';
		saveSet();
		refresh();
	},
	daily(a) {
		SET.daily = a === '1';
		saveSet();
		refresh();
	}, // the challenge of the day: its map and its hazards
	hz(a) {
		if (SET.daily) {
			SET.daily = false;
			SET.hz = { ...TODAY_HZ };
		} else SET.hz = { ...SET.hz };
		SET.hz[a] = SET.hz[a] ? 0 : 1;
		saveSet();
		refresh();
	}, // a hazard on or off; the points add up to the level
	today() {
		clearSave();
		holdSave = false;
		freshSlate();
		newGame(todaySeed(), undefined, true);
		closeCard();
		setPause(false);
		saveGame(true);
		refresh();
		say(`Challenge of the day: level ${levelOf(G.hz)}.`, 'good', TOAST.long);
	},
	tips() {
		SET.tips = !SET.tips;
		saveSet();
		refresh();
	},
	msgs() {
		SET.msgs = SET.msgs === false;
		saveSet();
		refresh();
	},
	news() {
		SET.news = SET.news === false;
		saveSet();
		refresh();
	},
	fog(a) {
		SET.fog = a === '1'; // for the next game; a game keeps the fog it started with
		saveSet();
		refresh();
	},
	lights() {
		SET.lights = SET.lights === false;
		saveSet();
		refresh();
	},
	boxes() {
		SET.boxes = SET.boxes === false;
		saveSet();
		refresh();
	}, // the building mold or the old pictures (preview 53, the Yard; BOX_LOOK in 23)
	cardpause() {
		SET.cardPause = SET.cardPause === false;
		saveSet();
		refresh();
	},
	qlock(id) {
		const t = TECHBY[id];
		say(`Research ${t.name} at the ${BLD[t.at].name} for more slots.`, '', TOAST.mid);
	},
	page(a) {
		hudPage(a);
		feel('tick');
	}, // a page of the row by name (a milestone's button)
	pvx() {
		const m = shownMsg();
		if (!m) return;
		m.ru = 0;
		if (m.grp !== 'reply' && !urgentCls(m.cls) && !hiddenG(m.grp)) G.pvAsk = m.grp; // × on news asks once: hide this group?
		ui(true);
	},
	pvhide(g) {
		(SET.hideG = SET.hideG || {})[g] = 1;
		saveSet();
		G.pvAsk = null;
		say(`${GROUPS[g]} now goes quietly to the mail.`, '', TOAST.short);
	}, // the group goes to the mail without a preview; red still comes through
	pvkeep() {
		G.pvAsk = null;
		ui(true);
	},
	mail() {
		G.mailN = 0;
		G.mailP = 0;
		openCard({ type: 'mail' });
	},
	mailg(g) {
		G.mailG = g && G.mailG !== g ? g : null;
		G.mailP = 0;
		refresh();
	},
	chronp(a) {
		G.chronP = (G.chronP || 0) + Number(a);
		$('endX').innerHTML = crownsHTML();
	}, // the chronicle's pages on the end card
	mailp(a) {
		G.mailP = (G.mailP || 0) + Number(a); // the card holds it inside its pages
		refresh();
	}, // the mail's pages (N13, Albert Oct 31): Previous and Next
	mailtog(g) {
		const H = (SET.hideG = SET.hideG || {});
		if (H[g]) delete H[g];
		else H[g] = 1;
		saveSet();
		refresh();
	},
	mailall() {
		SET.hideG = {};
		saveSet();
		refresh();
	},
	sound() {
		SND.on = !SND.on;
		saveSnd();
		sndInit();
		sfx('tap');
		muteBtn();
		refresh();
	},
	soundpage() {
		openCard({ type: 'sound' });
	},
	// one step rule for every volume: tenths, 0 to 100%
	vol(a) {
		const [k, d] = a.split(','),
			step = (v) => clamp(Math.round((v + (d === '+' ? 0.1 : -0.1)) * 10) / 10, 0, 1);
		if (k === 'all') SND.vol = step(SND.vol);
		else SET.mix[k] = step(SET.mix[k]);
		saveSnd();
		sndInit();
		sfx(k === 'amb' ? 'bird' : k === 'alert' ? 'ready' : 'tap');
		refresh();
	},
	ordpick(a) {
		const id = Number(a),
			O = G.ords && G.ords[id],
			S = G.units.filter((u) => u.owner === 0 && u.ord === id && u.hp > 0 && !u.inside);
		if (!S.length) return;
		closeCard();
		setPick(S.map((u) => ({ t: 'unit', id: u.id })));
		if (O && O.cx !== undefined) camGo(O.cx, O.cy);
	}, // a group on the march: picked, and the camera goes to it (the Army card line, the ring on the map)
	pfollow() {
		G.follow = !G.follow;
		ui(true);
	}, // the camera follows what is picked, until you drag, pinch or tap the small map
	techgo(id) {
		ACT.bldgo(TECHBY[id].at);
	}, // the research card's ›: to the building where it is learned, its card open
	bldgo(kind) {
		const k = keepOf(0),
			B = G.blds.filter((b) => b.owner === 0 && b.kind === kind && b.prog >= 1 && b.hp > 0).sort((a, b) => (k ? dist(a, k) - dist(b, k) : 0))[0];
		if (!B) return say(`Build a ${BLD[kind].name} first.`, '', TOAST.short);
		camGo(B.x, B.y);
		openCard({ type: 'bld', id: B.id });
	}, // to your nearest finished building of a kind, its card open: a kind of soldier on the Train page or a squad's card goes to where it is trained
	jump(a) {
		const [x, y] = a.split(',').map(Number);
		closeCard(); // the map behind a paused card is not where you look (as idlego and seek)
		camGo(x, y);
	},
	card(a) {
		const [type, page] = a.split(',');
		openCard(page ? { type, page } : { type });
	},
	storesk(a) {
		G.storesK = G.storesK === a && G.infoOpen ? null : a;
		G.infoOpen = !!G.storesK;
		refresh();
	}, // the Stores card: › opens the book on a resource's why; again, it closes
	open(a) {
		const [type, id] = a.split(',');
		openCard({ type, id: Number(id) });
	},
};
// a job is locked until its age (32-frame, resOn): a tap on it says when it opens
const shut = (r) => !resOn(KEY[r]) && (say(`${RESOURCES[r].name} opens in the ${AGES[resAge(KEY[r])].name} age.`, '', TOAST.short), true);
// orders that change the game: refused once it is over
const PLAY = {
	job(a) {
		if (shut(a)) return;
		G.P[0].rally = G.P[0].rally === a ? null : a; // tap the lit tile again and no job is the default: new villagers wait at the Town Center (Build 61)
		if (G.P[0].rally)
			unitsOf(0, 'vil').forEach((u) => {
				if (!u.job) u.job = a;
			});
	},
	move(a) {
		if (shut(a)) return;
		if (!unitsOf(0, 'vil').some(freeVil)) {
			say('Nobody is idle. Use − on another job.', '', TOAST.short);
			return;
		}
		moveVil(0, a);
	},
	less(a) {
		moveVil(0, a, true);
	},
	ktab(a) {
		G.ktab = a;
	},
	// Relations (v80): what is picked on a row waits there until its ✓; the slider snaps, its switch turns the gift on or off and keeps the amount
	relwant(a) {
		const [q, w] = a.split(','),
			n = relKey(q);
		if (stanceOff(n, w)) return say(relWhy(0, n, w) || 'Not now.', '', TOAST.short); // a dim icon takes no pick
		const d = relPickOf(n);
		d.want = w;
	},
	relgift(a) {
		const [k, x] = a.split(','),
			q = relKey(k),
			v = Number(x),
			d = relPickOf(q);
		if (giftLock(q)) return say(giftLock(q), '', TOAST.short);
		d.gift = v;
		d.on = v > 0;
	},
	relon(a) {
		const q = relKey(a),
			d = relPickOf(q);
		if (giftLock(q) || relLord(q)) return say(giftLock(q) || relWhy(0, q, 'peace') || 'Not now.', '', TOAST.short);
		d.on = !d.on;
		if (d.on && !d.gift) d.gift = REGARD.giftStep;
	},
	mpick(a) {
		G.mktK = a;
	}, // the Market: the good that Sell and Buy act on
	sel(a) {
		G.sel = a === 'all' ? 'all' : Number(a);
	},
	emg(a) {
		emgStart(a);
		ACT.home();
	}, // the page stays, so Stop is under the same thumb
	emgstop() {
		emgStop();
	},
	emgpage() {
		hudPage(G.hud.page === 'war' ? 'jobs' : 'war');
		feel('tick');
	}, // the red button: the battle station, with the Alarm's orders on its left; again, Jobs
	tq(a) {
		const [t, d] = a.split(','),
			k = kindOf(Number(t));
		if (!k) return say(`Build a ${BLD[CLS[t][2]].name} first.`, '', TOAST.short);
		if (d === '+') {
			const why = trainWhy(0, k);
			if (why) say(why, '', TOAST.short);
			else train(0, k);
		} else if (!unTrain(0, k)) say('Nothing of that kind is waiting.', '', TOAST.short);
	}, // the Train page: one more or one fewer of a kind, at the building with the shortest line
	tok() {
		setRally();
	},
	intent(a) {
		const [i, k] = a.split(',').map(Number);
		G.bnIntent[i] = k;
		feel('tick');
	}, // a squad's intent: one of three, chosen
	direct(a) {
		direct(Number(a), false);
	}, // the War Director: a kind's move, every soldier of it at once
	directh(a) {
		direct(Number(a), true);
	}, // held: the kind's second move
	wmid(a) {
		const H = G.hud;
		H.mid = H.mid === a ? SMID.map : a;
		feel('tick');
	}, // Train or Squad turns the station's middle to its four; again, back to the small map
	ytool(a) {
		closeCard();
		PLAY[a]();
	}, // the Yard: a tool armed, the card out of the way of the map
	choketool() {
		const H = G.hud;
		H.aim = H.aim === 'choke' ? H.page === 'war' : 'choke';
		G.chokeLine = null;
		if (H.aim === 'choke') say('Drag across the gap: they hold it.', 'tip', TOAST.short);
	}, // the choke tool (28-army-quick; the Yard)
	ambushtool() {
		const H = G.hud;
		H.aim = H.aim === 'ambush' ? H.page === 'war' : 'ambush';
		H.aimT = performance.now();
		if (H.aim === 'ambush') say('Tap the cover where they hide.', 'tip', TOAST.short);
	}, // the ambush tool (the Yard)
	kidle() {
		const S = idleSoldiers();
		if (!S.length) return say('No soldier stands idle.', '', TOAST.short);
		setPick(S.map((u) => ({ t: 'unit', id: u.id })));
	}, // every soldier standing at home, picked (the Yard)
	sqpk(a) {
		const [i, t, d] = a.split(',');
		sqPlan(Number(i), CLS[t][0], d === '+' ? 1 : -1);
	}, // a squad card's − and + under a kind
	sqcancel() {
		const c = G.card;
		G.bnPlan[c.i] = { ...c.was.plan };
		G.bnIntent[c.i] = c.was.intent;
		rebattalion();
		ACT.cardback();
	}, // Cancel: the squad as the card found it, and back
	sqsave() {
		ACT.cardback();
	}, // Save ✓: the changes stand (they took at once), and back
	whome() {
		hudHome();
	}, // hold Attack: everyone home, every mission off
	wsq(a) {
		const i = Number(a);
		if (!hasCmd()) return say('Squads come with Battalions.', '', TOAST.short);
		if (!G.hud.aim || !G.hud.h) return say('Tap Aim, then the map, then the squad.', '', TOAST.short); // no march on a crosshair that is not up (p44)
		hudFire(i);
	}, // a squad on the station: tap, and it marches on the crosshair
	sqcard(a) {
		const i = Number(a);
		if (!hasCmd() && !sqOut(i)) return say('Squads come with Battalions.', '', TOAST.short);
		openCard({ type: 'squad', i });
	}, // hold a squad: its card, built at home, watched on its mission; an empty squad opens as a new one
	qsword() {
		quickGo();
	}, // the sword: every soldier to the spot (28-army-quick)
	qclose() {
		hideQuick();
	},
	sqsetup() {
		if (!hasCmd()) return say('Squads come with Battalions.', '', TOAST.short);
		openCard({ type: 'sqsetup' });
	}, // Set Up (Albert, Nov 2): the three squads in one rank, each opening its card where it is built
	wfire() {
		hudGo();
	},
	hdel(a) {
		hudAbort(Number(a));
	}, // Abort on a squad's card: they come home
	hudrein(a) {
		hudReinforce(Number(a));
	},
	qsfrom(a) {
		G.qs.from = a === 'all' ? 'all' : Number(a);
	},
	qsn(a) {
		const [k, d] = a.split(','),
			have = qsPool().filter((u) => u.kind === k).length,
			cur = Math.min(have, G.qs.n[k] ?? have);
		G.qs.n[k] = clamp(cur + (d === '+' ? 1 : -1), 0, have);
	},
	qgo(a) {
		const [x, y] = a.split(',').map(Number),
			e = { x, y };
		order(qsPick(e), { t: 'ground', e });
		closeCard();
	},
	qatk(a) {
		const e = G.blds.find((x) => x.id === Number(a) && x.hp > 0);
		if (e) order(qsPick(e), { t: 'bld', e });
		closeCard();
	},
	qfoe(a) {
		const e = G.units.find((x) => x.id === Number(a) && x.hp > 0);
		if (e) order(qsPick(e), { t: 'unit', e });
		closeCard();
	},
	muster(a) {
		const i = Number(a);
		if (muster(0, musterGap(i), i)) sfx('place');
		else sfx('err');
	},
	shape(a) {
		cycle('form', a, FORM.length);
	},
	temper(a) {
		cycle('temper', a, TEMPER.length);
	},
	sendvil(a) {
		sendVil(0, Number(a));
	},
	sendout(a) {
		sendOut(0, Number(a));
	},
	vstop(a) {
		const u = unitsOf(0, 'vil').find((x) => x.id === Number(a));
		if (u) stopVil(u, null);
	},
	vfocus(a) {
		const u = unitsOf(0, 'vil').find((x) => x.id === Number(a));
		if (!u) return;
		u.focus = !u.focus;
		if (u.focus && u.node) {
			u.fn = u.node.id;
			u.fpos = { x: u.node.x, y: u.node.y };
		}
		say(u.focus ? 'Focus: it stays where you put it.' : 'Focus off.', '', TOAST.short);
	}, // Focus (D-093): a stance, as Stand Ground is; your next order re-aims it, only this turns it off
	vhome(a) {
		const u = unitsOf(0, 'vil').find((x) => x.id === Number(a)),
			k = keepOf(0);
		if (u) {
			stopVil(u, null);
			if (k) postTo([u], { x: k.x, y: k.y + halfOf(k) + 8 });
		}
		closeCard();
	}, // the worker card: Home, to the Town Center and idle
	replant(a) {
		const b = G.blds.find((x) => x.id === Number(a) && x.owner === 0);
		if (!b) return;
		const why = replantWhy(0, b);
		if (why) say(why, '', TOAST.short);
		else replant(0, b.id);
	},
	replantall(a) {
		const b = G.blds.find((x) => x.id === Number(a) && x.owner === 0);
		if (b) replantAll(0, b);
	},
	boxcut(a) {
		if (G.card && G.card.type === 'box') boxCut(G.card.r, Number(a));
		closeCard();
	},
	unpick() {
		setPick([]);
	},
	look(id) {
		const e = byId(G.units, Number(id));
		if (e) {
			setPick([]);
			openCard({ type: 'unit', id: e.id });
		}
	},
	pjob(j) {
		for (const u of picked())
			if (u.kind === 'vil') {
				setJob(u, j);
				u.pj = null;
				u.post = null;
				u.idleT = 0;
			}
		say(`To ${j}.`, '', TOAST.short);
		setPick([]);
	},
	pbuild(a) {
		G.buildBy = a
			? [Number(a)]
			: picked()
					.filter((u) => u.kind === 'vil')
					.map((u) => u.id);
		if (!a) setPick([]);
		openCard({ type: 'menu', id: G.lastMenu || MENUS[0].id });
	}, // whatever you place next, the picked villagers raise it (or the villager whose card asked: its job picker's Build)
	phold() {
		for (const u of picked())
			if (isSoldier(u)) {
				u.state = 'goto';
				u.px = u.x;
				u.py = u.y;
				u.focus = null;
				u.tgt = null;
				u.idleT = 2; // stopped at once: Holding, and free for the next send
				u.ord = undefined; // and off the old order
			}
		say('Holding here.', '', TOAST.short);
	},
	precall() {
		sendHome(picked().filter(isSoldier));
		say('Called home.', '', TOAST.short);
	},
	pvil() {
		setPick(
			picked()
				.filter((u) => u.kind === 'vil')
				.map((u) => ({ t: 'unit', id: u.id })),
		);
	},
	pcharge() {
		const S = picked();
		if (!charge(0, S)) say(chargeWhy(0, S) || 'Not now.', '', TOAST.short);
	},
	pfall() {
		fallBack(0, picked());
	},
	pteach() {
		const S = picked().filter((u) => isSoldier(u) && teachTo(u));
		let n = 0,
			why = null;
		for (const u of S) {
			if (teach(0, u)) n++;
			else why = why || teachWhy(0, u);
		}
		say(n ? `${n} to the School.` : why || 'Nobody here can be taught.', n ? 'good' : '', TOAST.short);
	},
	teach(id) {
		const u = G.units.find((x) => x.id === +id);
		if (u && !teach(0, u)) say(teachWhy(0, u) || 'Not now.', '', TOAST.short);
	},
	charge() {
		const S = orderSet(),
			bn = G.sel === 'all' ? undefined : G.sel;
		if (!charge(0, S, bn)) say(chargeWhy(0, S, bn) || 'Not now.', '', TOAST.short);
	},
	fallback() {
		fallBack(0, orderSet(), G.sel === 'all' ? undefined : G.sel);
		closeCard();
	},
	// relations and a lord's hand: one verb each, the reason on the card when it cannot be done. Relations (v80): the row's ✓ sends what
	// was picked on it, the gift then the stance
	relok(a) {
		const q = relKey(a),
			[gift, want, why] = relDraft(q);
		if (why || !(gift || want)) return say(why || 'Pick a gift or a stance first.', '', TOAST.short);
		if (gift) giveGift(0, gift, gangKey(q));
		if (want) setRel(0, q, want);
		delete G.relPick[q];
	},
	breakties(a) {
		if (G.confirm !== 'bt' + a) {
			G.confirm = 'bt' + a;
			return;
		}
		G.confirm = null;
		breakTies(0, Number(a));
	},
	demand(a) {
		const [q, r] = a.split(',');
		if (!demand(0, Number(q), r)) say(demandWhy(0, Number(q), r) || 'Not now.', '', TOAST.short);
	},
	tribute(a) {
		if (!forceTribute(0, Number(a))) say(tributeWhy(0, Number(a)) || 'Not now.', '', TOAST.short);
	},
	levy(a) {
		const [q, n] = a.split(',').map(Number);
		if (!levy(0, q, n === 0 ? levyRoom(0, q) : n)) say(levyWhy(0, q, n || 1) || 'Not now.', '', TOAST.short);
	},
	release(a) {
		releaseAll(0, Number(a));
	},
	qcancel(a) {
		const [b, i] = a.split(',').map(Number),
			B = byId(G.blds, b);
		if (B && cancelOrder(0, B, i)) sfx('err');
	},
	sellat(a) {
		const [f, k] = a.split(','),
			F = byId(G.finds, Number(f));
		if (F && F.owner === 0) {
			F.sell = F.sell || Object.fromEntries(WARES.map((w) => [w, 1]));
			F.sell[k] = F.sell[k] ? 0 : 1;
		}
	},
	debase() {
		if (!debase(0)) say('Needs a finished Mint, once a game.', '', TOAST.short);
	},
	surrender(a) {
		demandSurrender(0, Number(a));
		closeCard();
	},
	overlord(a) {
		if (!offerOverlord(0, Number(a))) say(overlordWhy(0, Number(a)) || 'Not now.', '', TOAST.short);
	},
	tax(a) {
		const [q, t] = a.split(','),
			P = G.P[Number(q)];
		if (P && P.lord === 0 && TAX[t]) {
			P.tax = t;
			say(`Tax on ${P.name}: ${t}.`, '', TOAST.short);
		}
	},
	venture(a) {
		if (!venture(0, Number(a))) say('Needs Medieval age, gold; 3 at most.', '', TOAST.mid);
	},
	douse(a) {
		const b = G.blds.find((x) => x.id === Number(a) && x.owner === 0);
		let n = 0;
		if (b && b.fire > 0)
			for (let i = 0; i < 2; i++) {
				const v = pickVil(0, b, null, b, true); // from the building's card: an idle villager only (D-089)
				if (v) {
					if (v.job !== 'repair') v.pj = v.job;
					setJob(v, 'repair');
					v.rep = b;
					v.fireman = true;
					n++;
				}
			}
		G.mail = (G.mail || []).filter((m) => m.act !== 'douse:' + a);
		if (n) say(`${n} more run to the fire.`, '', TOAST.short);
		else if (b && b.fire > 0) say('No villager is free.', '', TOAST.short);
	},
	tpost(a) {
		const f = byId(G.finds, Number(a));
		if (!f) return;
		const why = canPlace(0, 'tpost', f.x, f.y);
		if (why) {
			say(why + '.', '', TOAST.short);
			return;
		}
		if (!afford(G.P[0], BLD.tpost.cost)) {
			say(`Not enough: ${costText(BLD.tpost.cost)}.`, '', TOAST.short);
			return;
		}
		if (G.P[0].age < BLD.tpost.age) {
			say('Trade posts need the Bronze age.', '', TOAST.short);
			return;
		}
		build(0, 'tpost', f.x, f.y);
		say('A villager sets out to build the trade post.', '', TOAST.mid);
	},
	want(a) {
		const f = byId(G.finds, Number(a));
		if (f && f.owner === 0) {
			f.want = WARES[(WARES.indexOf(f.want) + 1) % WARES.length];
		}
	},
	route(a) {
		const [cid, s, id] = a.split(','),
			c = G.units.find((u) => u.id === Number(cid) && u.owner === 0),
			t = s === 's' ? byId(G.finds, Number(id)) : byId(G.blds, Number(id));
		if (c && t) {
			if (!homeBiz(0, c)) {
				say('Build a Market first.', '', TOAST.mid);
				return;
			}
			setRoute(c, t, true, s === 's');
			say('The caravan runs the route on repeat.', '', TOAST.short);
		}
	},
	make(a) {
		const [b, t] = a.split(','),
			B = G.blds.find((x) => x.id === Number(b) && x.owner === 0);
		if (B) setMake(B, t);
	},
	routeto(a) {
		const f = byId(G.finds, Number(a));
		if (!f || !homeBiz(0, f)) {
			say('Build a Market first.', '', TOAST.mid);
			return;
		}
		const c = unitsOf(0, 'caravan').sort((p, q) => !!p.route - !!q.route || dist(p, f) - dist(q, f))[0];
		if (!c) {
			say('No caravan: train one at the Market.', '', TOAST.short);
			return;
		}
		setRoute(c, f, true, true);
		say('A caravan takes the route, on repeat.', '', TOAST.short);
	},
	rrep(a) {
		const c = byId(G.units, Number(a));
		if (c && c.route) c.route.rep = !c.route.rep;
	},
	rsp(a) {
		const c = byId(G.units, Number(a));
		if (c && c.route) c.route.spice = !c.route.spice;
	},
	rclr(a) {
		const c = byId(G.units, Number(a));
		if (c) {
			c.route = null;
			c.dest = null;
		}
	},
	sendbld(a) {
		sendBuild(0, Number(a));
	},
	hunt3(a) {
		for (let i = 0; i < 3; i++) sendHunt(0, Number(a));
	},
	hunt(a) {
		sendHunt(0, Number(a));
	},
	repair(a) {
		sendRepair(0, Number(a));
	},
	takedown(a) {
		const id = Number(a),
			b = G.blds.find((x) => x.id === id && x.owner === 0);
		if (b && b.kind !== 'keep') {
			if (BLD[b.kind].wallish || b.prog < 0.15 || G.confirm === id) {
				demolish(0, id);
				G.confirm = null;
				closeCard();
			} else G.confirm = id;
		}
	},
	train(a) {
		if (!train(0, a)) say(trainWhy(0, a) || 'Not now.', '', TOAST.short);
	},
	tech(a) {
		if (!research(0, a)) say(researchWhy(0, a) || 'Not now.', '', TOAST.short);
	},
	age() {
		ageUp(0);
	},
	build(a) {
		startPlace(a);
	},
	scoutgo(a) {
		const [x, y] = a.split(',').map(Number),
			s = unitsOf(0, 'scout')[0];
		if (s) {
			s.state = 'goto';
			s.px = x;
			s.py = y;
			say('The scout rides out.', '', TOAST.short);
		}
		closeCard();
	},
	recall() {
		sendHome(orderSet());
		closeCard();
	},
	attack(a) {
		const target = a === 'near' ? foeNearest() : Number(a);
		if (target !== null) {
			orderSet().forEach((u) => {
				u.state = 'attack';
				u.target = target;
				u.bid = null;
			});
			say(`Marching on the ${G.P[target].name}.`, '', TOAST.short);
		}
		closeCard();
	},
	ransom(a) {
		if (!payRansom(0, Number(a))) say('Not enough gold.', '', TOAST.short);
	},
	stand() {
		if (!standDown(0)) say('No spare soldiers at home to stand down.', '', TOAST.short);
	},
	vjob(a) {
		const [id, j] = a.split(','),
			u = byId(G.units, Number(id));
		if (u && u.owner === 0) {
			setJob(u, u.job === j ? null : j);
			u.pj = null;
			u.idleT = 0;
		}
	},
	vgo(a) {
		const u = byId(G.units, Number(a));
		if (!u) return;
		if (G.confirm !== 'v' + u.id) {
			G.confirm = 'v' + u.id;
			return;
		}
		G.confirm = null;
		setJob(u, null);
		u.hp = 0;
		u.gone = true;
		say('A villager was sent home.', '', TOAST.short);
		closeCard();
	},
	dismiss() {
		const v = unitsOf(0, 'vil').sort((a, b) => a.carry - b.carry)[0];
		if (v) {
			setJob(v, null);
			v.hp = 0;
			v.gone = true;
			say('A villager was sent home.', '', TOAST.short);
		}
	},
	sab(a) {
		const b = byId(G.blds, Number(a)),
			sp =
				b &&
				unitsOf(0, 'spy')
					.filter((u) => u.state !== 'sab')
					.sort((x, y) => dist(x, b) - dist(y, b))[0];
		if (!b || !BLD[b.kind].sab || !sp) {
			say(!sp ? 'You have no free spy.' : 'That cannot be sabotaged.', '', TOAST.short);
			return;
		}
		sp.state = 'sab';
		sp.tid = b.id;
		say('A spy slips away to sabotage it.', '', TOAST.mid);
		closeCard();
	},
	shrine(a) {
		const f = byId(G.finds, Number(a)),
			pr = f && unitsOf(0, 'priest').sort((p, q) => dist(p, f) - dist(q, f))[0];
		if (!pr) {
			say('You have no priest: Build → Temple.', '', TOAST.short);
			return;
		}
		pr.state = 'shrine';
		pr.fid = f.id;
		say('A priest walks to the shrine.', '', TOAST.short);
		closeCard();
	},
	hire(a) {
		const f = byId(G.finds, Number(a));
		if (f && !hire(0, f)) say(hireWhy(0, f), '', TOAST.short);
	},
	guard(a) {
		const [t, i] = a.split(','),
			id = Number(i),
			at = t === 'f' ? byId(G.finds, id) : byId(G.units, id);
		if (!at) return;
		const room = POST.guard - guardsOf(t, id).length,
			S = sendable()
				.sort((p, q) => dist(p, at) - dist(q, at))
				.slice(0, Math.max(0, Math.min(4, room)));
		S.forEach((u) => {
			u.state = 'escort';
			u.esc = null;
			u.focus = null;
			if (t === 'f') {
				u.escF = id;
				u.escId = undefined;
			} else {
				u.escId = id;
				u.escF = undefined;
			}
		});
		if (S.length) ripple(at.x, at.y, '#ffd35e');
	},
	unguard(a) {
		const [t, i] = a.split(',');
		guardsOf(t, Number(i)).forEach((u) => {
			u.state = 'home';
			u.esc = null;
			u.escId = u.escF = undefined;
		});
	},
	trade(a) {
		const [dir, k] = a.split(':');
		if (!marketTrade(0, k, dir)) say(dir === 'sell' ? 'Not enough to sell.' : 'Not enough gold.', '', TOAST.short);
	},
	zeal() {
		if (!zeal(0, orderSet())) say(zealWhy(0, orderSet()) || 'Not now.', '', TOAST.short);
	},
};
function act(a) {
	const [verb, arg] = a.split(/:(.*)/s);
	if (ACT[verb]) {
		ACT[verb](arg);
		return;
	}
	if (G.over || !PLAY[verb]) return;
	PLAY[verb](arg);
	learnAct(verb, arg);
	refresh();
}
// Hints retire once learned: each counts the times you did what it teaches, kept on this phone; at 3 it is not shown again. Warnings (hunger, fire, plague, unrest) always show.
const L = (k) => ((SET.learned || {})[k] || 0) >= 3;
function learn(k) {
	SET.learned = SET.learned || {};
	if ((SET.learned[k] || 0) >= 3) return;
	SET.learned[k] = (SET.learned[k] || 0) + 1;
	saveSet();
}
function learnAct(verb, arg) {
	if (verb === 'train') learn('train:' + arg);
	else if (verb === 'move' || verb === 'job') {
		learn('job');
		learn('job:' + arg);
	} else if (verb === 'sendvil') {
		learn('job');
		const n = byId(G.nodes, Number(arg));
		if (n) learn('job:' + (n.kind === 'farm' && n.type === 'food' ? 'field' : n.type));
	} else if (['sendbld', 'age', 'trade'].includes(verb)) learn(verb);
}
let lpT = 0,
	lpDone = false,
	lpAt = null;
const lpStop = (e) => {
	if (e && e.type === 'pointermove' && lpAt && hyp(e.clientX - lpAt.x, e.clientY - lpAt.y) < 8) return; // a thumb rolls a little while it holds (an audit, Nov 2)
	clearTimeout(lpT);
};
document.addEventListener('pointerdown', (e) => {
	lpStop();
	lpDone = false;
	lpAt = { x: e.clientX, y: e.clientY };
	const el = e.target.closest('[data-act^="tech:"], [data-hold]');
	if (el)
		lpT = setTimeout(() => {
			lpDone = true;
			feel('snap');
			if (el.dataset.hold) return act(el.dataset.hold); // a button's second verb, held (the station: one fewer, a squad's card, everyone home)
			G.techTip = el.dataset.act.slice(5);
			renderCard();
		}, el.dataset.hold ? HOLD_MS : 450);
}); // hold a research step: what it does, the number, the date, the weight and why, the cost
for (const ev of ['pointerup', 'pointercancel', 'pointermove'])
	document.addEventListener(ev, lpStop, { passive: true });
// Tap counts (Build 59, from the Google audit): how often each button is used, and tapped while it could not act. Kept on this phone only,
// never sent anywhere; read on the Tap counts card (Help). A button nobody uses, or one tapped greyed out again and again, is a design question.
let TAPS = {};
try {
	TAPS = JSON.parse(localStorage.getItem(keyOf('taps')) || '{}');
} catch (e) {}
function tapCount(act, dis) {
	const k = String(act).split(':')[0],
		t = TAPS[k] || (TAPS[k] = [0, 0]);
	t[dis ? 1 : 0]++;
	try {
		localStorage.setItem(keyOf('taps'), JSON.stringify(TAPS)); // every tap (Build 60: one in ten were kept, so a reload lost most of them)
	} catch (e) {}
}
document.addEventListener('click', (e) => {
	const el = e.target.closest('[data-act]');
	if (!el) return;
	e.stopPropagation();
	if (lpDone) {
		lpDone = false;
		return;
	}
	if (G.techTip) {
		G.techTip = null;
		renderCard();
	}
	sndInit();
	sfx('tap');
	if (el.closest('#orders.pg-war')) {
		el.classList.add('hit');
		setTimeout(() => el.classList.remove('hit'), timeOf('quick'));
	} // the station: a tap flashes red and snaps off (Albert, Nov 2)
	const off = el.closest('.dis, .lock'); // the button, or the control it is part of (the slider's switch inside a locked slider)
	tapCount(el.dataset.act, !!off);
	cardTap = !!el.closest('#card'); // what it opens remembers this card (back)
	try {
		act(el.dataset.act);
	} finally {
		cardTap = false;
		if (off) {
			off.classList.add('nope');
			setTimeout(() => off.classList.remove('nope'), 450);
		} // a tap it cannot do glows red a moment (after the verb, so the card's redraw does not wipe it)
	}
});
// a slider (data-in) sends its verb with its value as it moves, and the card shows it at once
document.addEventListener('input', (e) => {
	const el = e.target.closest('[data-in]');
	if (!el) return;
	act(`${el.dataset.in},${el.value}`); // a PLAY verb: act() refreshes once
});
for (const ev of ['pointerup', 'touchend']) document.addEventListener(ev, sndInit, { passive: true }); // Safari unlocks audio on the finger lifting, not landing
// ═════ 39-huddle.js: the row below the map and its three pages, the War HUD's missions, the squad card ═════
// The row (MENU-SPEC §6, Albert's drawings of Oct 30 and 31): one Formation two ranks tall, the same six columns on every page, turned by one
// button that sits on its own rank above slot 1 and says the page's name: Jobs → War → Train. Slot 1 is two whole slots with the 6 gap
// between; slots 2 to 5 (to 6 on Jobs) are the page's things, each with − and + under it or, on War, its time and pace; slot 6 is ✓ over ✕.
// Building is a job: the hammer under People is the one way to the Build menu. War is the HUD: the target over Home, the three squads, Go over
// Abort; a squad is built on its card. Every slot is a picture icon with its number and its word, or a symbol alone (pic, sym in 32-frame);
// its state is a ring (the states in the style sheet). The Huddle's sequence (ready, aim, fire, abort) lives on in the War page's missions.
const HUD = {
	near: 140, // a fight is what hostile soldiers within this reach of the group make
	lose: 0.4, // a mission below this chance says it is losing, once until it climbs above clear
	clear: 0.5,
	smooth: 0.3, // the chance moves a third of the way each second: about three seconds to settle
	gap: 8, // reinforcements arriving within this many seconds of each other are one wave
	waves: 3,
};
const mUnits = (m) => G.units.filter((u) => u.owner === 0 && u.ord === m.ord && u.hp > 0);
const sqUnits = (i) => armyOf(0).filter((u) => u.bn === i && u.kind !== 'spy');
const sqOut = (i) => G.msn[i] && !G.msn[i].end; // the squad is out on a mission
const hostile = (v) =>
	v.owner !== 0 &&
	v.hp > 0 &&
	!v.inside &&
	isFoe(0, v) &&
	(isSoldier(v) || (v.owner === WILD && UNIT[v.kind].tick === 'wild'));
function foesNear(c) {
	const out = [];
	unitsNear(c, HUD.near, (v) => hostile(v) && visibleTo0(v) && out.push(v)); // the foes your people see (Build 60)
	return out;
}
const powerSum = (L) => L.reduce((s, u) => s + unitPower(u), 0);
// the chance to win: the engine every odds line uses (power against power, the matchup of arms), as r²/(1+r²)
function chance(S, foes) {
	const r = (powerSum(S) / Math.max(1, powerSum(foes))) * matchup(S, foes);
	return lanchester(r);
}
const dpsOf = (L) => L.reduce((s, v) => s + dmgOf(v) / (UNIT[v.kind].cd || 1.5), 0);
const wxWord = () => (G.wx !== 'clear' && WEATHER[G.wx] ? WEATHER[G.wx].name : season().name);
// a squad's pace in a word, from its slowest member (an elephant makes it slow, horse alone fast): what the squad card says (Albert, Build 63)
function paceWord(S) {
	if (!S.length) return '';
	const v = Math.min(...S.map((u) => paceOf(u, 1)));
	return ROW_WORD.pace[v < 14 ? 0 : v < 22 ? 1 : 2];
}
// ── the pages
function hudPage(page) {
	const H = G.hud;
	H.page = page;
	H.aim = page === 'war'; // the station puts the crosshair up: a tap on the map moves it
	if (H.aim) {
		H.aimT = performance.now();
		if (!H.h) H.h = { t: 'ground', e: { x: cam.x, y: cam.y } };
		closeCard();
	}
}
// the kind a class trains from the Train page, and fills a muster with: the first its building trains in this age (a people's own unit in its place)
const kindOf = (t) =>
	ARMYK.filter((k) => !UNIT[k].civ && UNIT[k].cost && k !== 'spy')
		.map((k) => civKind(0, k))
		.find((k) => UNIT[k].at === CLS[t][2] && UNIT[k].age <= G.P[0].age);
function sqPlan(i, c, d) {
	// a squad holds BNSIZE at most, every kind together; the step is 1 under ten, 5 above. c: the kind's id in CLS (foot, arch, horse, siege)
	const P = G.bnPlan[i],
		cur = P[c] || 0,
		st = d > 0 ? (cur < 10 ? 1 : 5) : cur <= 10 ? 1 : 5,
		others = Object.entries(P).reduce((n, [q, v]) => n + (q === c ? 0 : v), 0);
	P[c] = clamp(cur + d * st, 0, Math.max(cur, BNSIZE - others));
	if (!P[c]) delete P[c];
	rebattalion();
}
// ── aiming: the crosshair, moved by a tap on the map while the War or Train page is open
function aimSpot(sx, sy) {
	const H = G.hud;
	let h = hitAt(sx, sy);
	const foe = (h.t === 'unit' || h.t === 'bld') && h.e.owner !== 0;
	if (!(h.t === 'ground' || h.t === 'find' || foe)) h = { t: 'ground', e: { x: h.e.x, y: h.e.y } };
	H.h = h;
	H.moved = true;
}
const aimNear = (sx, sy) => {
	const H = G.hud;
	return H.aim && H.h && hyp(sx - SX(H.h.e.x, H.h.e.y), sy - SY(H.h.e.y, 0, H.h.e.x)) < 56;
};
function aimAt(sx, sy) {
	const H = G.hud;
	aimSpot(sx, sy);
	if (H.aim === 'ambush') {
		H.aim = H.page === 'war'; // the station's crosshair stays up
		return ambushAt(H.h); // the ambush tool (the Yard): the tap is the cover
	}
	ripple(H.h.e.x, H.h.e.y, aimColor());
	feel('tick');
}
// the crosshair's colour says what is under it (Albert, Build 63): green yours, blue an ally, white nothing (nature), red an enemy or a hazard
function aimColor(h = G.hud.h) {
	if (!h) return codeOf('w');
	if (h.t === 'unit' || h.t === 'bld') {
		const o = h.e.owner;
		if (o === 0) return codeOf('g');
		if (isFoe(0, h.e)) return codeOf('r');
		if (friendly(0, o)) return codeOf('b');
		return codeOf('w');
	}
	const near = nearU(h.e, 60, (v) => v.owner !== 0 && v.hp > 0 && hostile(v) && visibleTo0(v));
	if (near || hazardAt(h.e.x, h.e.y)) return codeOf('r');
	return codeOf('w');
}
const hazardAt = (x, y) =>
	(G.sand && hyp(x - G.sand.x, y - G.sand.y) < G.sand.r) ||
	G.blds.some((b) => b.fire > 0 && dist(b, { x, y }) < 60) ||
	(G.cracks || []).some((c) => hyp(x - c.x, y - c.y) < 40);
// who a squad sends: its idle members; with no squads yet, every idle soldier
const sqFree = (i) => (i === null || i === undefined ? free() : free().filter((u) => u.bn === i));
// a squad's time to the crosshair (null: every idle soldier), kept for each squad until the target, the squad, the sky or three seconds change
function hudEta(i = null) {
	const H = G.hud,
		S = sqFree(i);
	if (!H.h || !S.length) return 0;
	const key = `${H.h.e.x | 0},${H.h.e.y | 0},${S.length},${G.wx},${(G.t / 3) | 0}`,
		E = (H.eta = H.eta || {}),
		e = (E[i] = E[i] || {});
	if (e.key !== key) {
		e.key = key;
		e.v = etaOf(S, H.h.e, routeK(centreOf(S), H.h.e));
	}
	return e.v;
}
// Go: a squad marches on the crosshair as one order and takes its slot (with no squads yet, every idle soldier takes the first free slot)
function hudFire(i) {
	const H = G.hud,
		S = sqFree(i),
		slot = i ?? G.msn.findIndex((m) => !m || m.end);
	if (!H.h) H.h = { t: 'ground', e: { x: cam.x, y: cam.y } };
	if (slot < 0) return say('Every slot is out.', '', TOAST.short);
	if (!S.length) return say(i === null || i === undefined ? freeWhy() : `${BN[i]}: nobody idle in it.`, '', TOAST.short);
	if (sqOut(slot)) hudAbort(slot, true);
	orderCost(0, S); // a squad sent: its meals, and tired after (ORDER); before the ETA, which counts the tired pace (p44)
	const before = G.ordN || 0;
	order(S, H.h);
	if ((G.ordN || 0) === before) return; // refused: the reason was said
	const O = G.ords[G.ordN],
		kinds = {};
	for (const u of S) kinds[u.kind] = (kinds[u.kind] || 0) + 1;
	G.msn[slot] = {
		name: i === null || i === undefined ? ROW_WORD.army : BN[i],
		sq: i ?? null,
		ord: G.ordN,
		n0: S.length,
		kinds,
		what: H.h.t === 'unit' || (H.h.t === 'bld' && H.h.e.owner !== 0) ? 'Attack' : 'Go to',
		intent: i !== null && i !== undefined ? G.bnIntent[i] || 0 : 0,
		label: O.label,
		x: O.x,
		y: O.y,
		t: G.t,
		due: G.t + etaOf(S, O, O.k),
		st: 'go',
		odds: 0.5,
	};
	H.firedT = performance.now();
	feel('thock');
}
// Go (✓ on War): every squad at home and ready (its blue ring) marches on the crosshair, each its own mission; with none ready, or before
// Battalions, every idle soldier goes as one
function hudGo() {
	const ready = hasCmd() ? BN.map((_, i) => i).filter((i) => !sqOut(i) && sqFree(i).length) : [];
	if (ready.length) ready.forEach((i) => hudFire(i));
	else hudFire(null);
}
// a mission leaves: the soldiers go home, the slot is free
function hudAbort(slot, quiet) {
	const m = G.msn[slot];
	if (!m) return;
	sendHome(mUnits(m));
	G.msn[slot] = null;
	if (G.card && G.card.type === 'squad' && G.card.i === slot) refresh();
	if (!quiet) say(`${m.name} called home.`, '', TOAST.short);
}
function hudAbortAll() {
	G.msn.forEach((_, i) => hudAbort(i));
}
// Home: everyone back, every mission off
function hudHome() {
	hudAbortAll();
	sendHome(sendable());
	say('Everyone home.', '', TOAST.short);
}
// Orders (the Train page): where new soldiers go when they are made, and which squad they join; ✓ on the crosshair sets it
function setRally() {
	const H = G.hud;
	if (!H.h) return;
	G.rally0 = { x: Math.round(H.h.e.x), y: Math.round(H.h.e.y) };
	say('New soldiers will go there.', 'good', TOAST.short);
	feel('thock');
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
			say(`${m.name} is lost.`, 'warn', TOAST.mid);
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
			say(`${m.name} is losing.`, 'warn', TOAST.mid);
		} else if (m.flash === 'lose' && m.odds > HUD.clear) m.flash = null;
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
		const k = new Set(list.map((r) => clsOf(r.u.kind)));
		return k.size === 1 ? CLS[[...k][0]][3] : 'soldiers';
	};
	return plan.waves
		.map((w, i) => `${w.list.length} ${i ? 'more' : word(w.list)} ${i ? 'by' : 'in'} ${clock(w.t)}`)
		.join(', ');
}
// units moved into a mission (a reinforcement): they march to its middle and join its order
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
	if (!plan || !plan.go.length) return say('Too late: nobody can get there in time.', '', TOAST.short);
	hudJoin(plan.go, m);
	say(`${plan.go.length} reinforce ${m.name}.`, 'good', TOAST.short);
}
// ── the row: three pages on one mold. Rank one is the page's six things, rank two what each is under it; grid order lays them
// Jobs: People over the hammer; each job with its count (in its store's colour) and − + under it. People rings blue while people stand idle;
// the hammer wears the working ring while a building goes up (the first site still going up: what is left of it); a job opens with its age.
function jobsPage() {
	const p = G.P[0],
		V = unitsOf(0, 'vil'),
		site = G.blds.find((b) => b.owner === 0 && b.hp > 0 && b.prog < 1);
	let top = pic('train:vil', ICON.people, ROW_WORD.people, V.some(freeVil) ? 'go' : trainWhy(0, 'vil') ? 'dis' : '', null, ' aria-label="People: train a villager"'),
		low = pic('buildrow', ICON.hammer, ROW_WORD.build, site ? 'work' : '', null, ` aria-label="The Build menu"${site ? ` style="${toGo(1 - site.prog)}"` : ''}`);
	for (const r of JOBS) {
		const k = KEY[r],
			on = resOn(k), // a job not open yet is locked, with no count (32-frame, resOn)
			n = V.filter((v) => v.job === r).length;
		top += on ? pic(`job:${r}`, ICON[r], RESOURCES[r].name, p.rally === r ? 'on' : '', n, ` style="--nc:${grad(velOf(p, k))}"`) : pic(`job:${r}`, ICON[r], RESOURCES[r].name, 'dis');
		low += sym(`less:${r}`, ICON.minus, on ? 'h' : 'h dis', `One fewer on ${r}`) + sym(`move:${r}`, ICON.plus, on ? 'h' : 'h dis', `One more on ${r}`);
	}
	return top + low;
}
// The battle station (Albert, Nov 2, his drawings: "the controller"; the War Director, 28-army-quick): one page in place of War and Train, the row's 6 x 2 as three 2 x 2
// blocks. Left, the Alarm's four orders (40-emergency). Middle, one joined block that changes: the small map (tap: the camera goes there;
// a drag sweeps it), or the three squads and Set Up (tap: send it to the crosshair; hold: its card), or the four kinds to train (tap:
// one more; hold: one fewer), or the Director's four (tap: the kind's move; hold: its second). Right: Train (hold: new soldiers go to the
// crosshair), Squad and Direct turn the middle, Attack sends every
// ready squad there (hold: everyone home). The villagers' block brown (vb), the war block steel tinted red (wb), no state rings (EXCEPTIONS: a battle station is all live); a tap flashes red and
// snaps off (the click handler, 33-verbs). The crosshair is up while it is open: a tap on the map moves it.
const SMID = { map: 'map', squad: 'squad', train: 'train', direct: 'direct' }; // what the station's middle shows
function stationPage() {
	const H = G.hud,
		mid = H.mid || SMID.map,
		V = unitsOf(0, 'vil').length,
		on = (kind) => (G.emg && G.emg.kind === kind ? '●' : null),
		W = ROW_WORD.emgW;
	let h =
		pic('emgstop', ICON.stop, W[0][0], 'vb' + (G.emg ? '' : ' dis')) +
		pic('emg:square', ICON.home, W[1][0], 'vb', on('square')) +
		`<div class="midb${mid === SMID.map ? ' map' : ''}">` +
		(mid === SMID.squad
			? BN.map((nm, i) => {
					const m = sqOut(i) ? G.msn[i] : null,
						S = m ? mUnits(m) : hasCmd() ? sqUnits(i) : [];
					return pic(`wsq:${i}`, ICON.squad, m ? m.name : nm, hasCmd() || m ? '' : 'dis', S.length, ` data-hold="sqcard:${i}"`);
				}).join('') + pic('sqsetup', ICON.gear, ROW_WORD.setup, hasCmd() ? '' : 'dis')
			: mid === SMID.direct
				? CLS.map((c, t) => {
						const n = ofKind(t).length,
							w = directWait(t),
							[tap, hold] = DIRECT_OF[t];
						return pic(`direct:${t}`, ICON.cls[c[0]], w ? `${w} s` : tap[1], n && !w ? '' : 'dis', n || null, ` data-hold="directh:${t}" aria-label="${c[1]}: ${tap[1]}; hold: ${hold[1]}"`);
					}).join('')
				: mid === SMID.train
				? CLS.map((c, t) => {
						const k = kindOf(t),
							at = k ? readyAt(0, UNIT[k]) : [],
							n = at.reduce((s, b) => s + b.q.filter((j) => j.kind === k).length, 0);
						return pic(`tq:${t},+`, ICON.cls[c[0]], c[1], at.length ? '' : 'dis', at.length ? n : null, ` data-hold="tq:${t},-"`);
					}).join('')
				: '') +
		'</div>' +
		pic('wmid:train', ICON.mil, ROW_WORD.train, 'wb', null, ' data-hold="tok"') +
		pic('wmid:squad', ICON.squad, ROW_WORD.squad, 'wb') +
		pic('emg:hands', ICON.sword, W[2][0], 'vb', on('hands')) +
		pic('emg:shelter', ICON.shield, W[3][0], 'vb' + (V ? '' : ' dis'), on('shelter')) +
		pic('wmid:direct', ICON.aim, ROW_WORD.direct, 'wb') +
		pic('wfire', ICON.sword, ROW_WORD.attack, 'wb' + (H.h && free().length ? '' : ' dis'), null, ' data-hold="whome"');
	return h;
}
const idleSoldiers = () => sendable().filter((u) => u.state === 'home');
const ROWS = { jobs: jobsPage, war: stationPage };
// the row on show, patched in place (a button under a finger stays the same button); the cycle button above slot 1 wears the page's name
// and its tint
function rowUI() {
	const page = G.hud.page,
		el = $('row'),
		h = ROWS[page](),
		chip = $('emgB');
	if (el.sigH !== h) {
		el.sigH = h;
		patchHTML(el, h);
	}
	chip.classList.toggle('warn', !!G.incoming); // the red War button breathes while something is coming
	const mb = el.querySelector('.midb.map');
	if (mb && mini.parentNode !== mb) mb.appendChild(mini); // the small map's one home is the station's middle (Albert, Nov 2); it waits on the stage, hidden, between
	else if (!mb && mini.parentNode !== $('stage')) $('stage').appendChild(mini);
	if (chip.pg !== page) {
		chip.pg = page;
		$('orders').className = 'pg-' + page;
		chip.innerHTML = page === 'war' ? ICON.close : topOf(ICON.def) + wd(ROW_WORD.emg); // War, the one button that turns the row; while the station is up it reads ✕ (Albert, Nov 2)
		chip.classList.toggle('sym', page === 'war');
		chip.setAttribute('aria-label', page === 'war' ? 'Close the battle station' : 'War: the battle station');
		fit(); // the row is drawn anew: the map's bottom edge is measured again
	}
}
// the reticle (mock 24): brackets, three turning chevrons, a scan line, a sonar ring and short scope lines; its colour says what is under it; green once fired
function drawReticle() {
	const H = G.hud;
	if (!H.aim || !H.h) return;
	const x = SX(H.h.e.x, H.h.e.y),
		y = SY(H.h.e.y, 0, H.h.e.x),
		L = performance.now() - (H.firedT || -1e9) < timeOf('settle') ? 1 : 0,
		R = Math.max(30, 16 * cam.z + 6) * (L ? 0.8 : 1),
		t = still() ? 0 : (performance.now() - (H.aimT || 0)) / 1000,
		eta = hudEta(),
		line = (a, b, c, d) => (ctx.moveTo(x + a, y + b), ctx.lineTo(x + c, y + d));
	ctx.save();
	ctx.strokeStyle = ctx.fillStyle = L ? codeOf('g') : aimColor(H.h);
	ctx.lineWidth = 1.5;
	if (H.drag) {
		ctx.globalAlpha = 0.14;
		ctx.beginPath();
		ctx.arc(x, y, R + 12, 0, 7);
		ctx.fill();
		ctx.globalAlpha = 1;
	}
	ctx.beginPath();
	const q = R * 0.4;
	for (const [a, b] of [
		[-1, -1],
		[1, -1],
		[1, 1],
		[-1, 1],
	]) {
		line(a * R, b * (R - q), a * R, b * R);
		line(a * R, b * R, a * (R - q), b * R);
	}
	ctx.stroke();
	if (!L) {
		const p = (t * 0.5) % 1,
			ph = t * 1.2;
		ctx.globalAlpha = Math.pow(1 - p, 1.4) * 0.8;
		ctx.beginPath();
		ctx.arc(x, y, 4 + p * R * 1.3, 0, 7);
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.beginPath();
		for (let i = 0; i < 3; i++) {
			const a = ph + (i * 2 * Math.PI) / 3,
				c = Math.cos(a),
				s = Math.sin(a),
				rot = (u, v) => [u * c - v * s, u * s + v * c],
				p0 = rot(R * 0.62, -5),
				p1 = rot(R * 0.62 + 7, 0),
				p2 = rot(R * 0.62, 5);
			line(p0[0], p0[1], p1[0], p1[1]);
			line(p2[0], p2[1], p1[0], p1[1]);
		}
		const sy = Math.sin(t * 3) * (R - 4);
		line(-R + 3, sy, R - 3, sy);
		ctx.stroke();
	}
	const g = 8;
	ctx.beginPath();
	line(-R - 14, 0, -g, 0);
	line(g, 0, R + 14, 0);
	line(0, -R - 14, 0, -g);
	line(0, g, 0, R + 14);
	ctx.stroke();
	ctx.font = mapFont(); // pinned to the screen
	ctx.textAlign = 'center';
	ctx.fillText(eta ? `${clock(eta)} · ${coord(H.h.e.x, H.h.e.y)}` : coord(H.h.e.x, H.h.e.y), x, y - R - 20); // above the scope line's end (it ran through the words, Nov 3)
	ctx.restore();
}
// ── the squad card (MENU-SPEC §8, picture Mission Flow): the squad builder while it is home, the live view while it is out (Build 61, one card, two states)
// Commander's intent (Build 63): what the squad is for, in the words the doctrine uses. The card shows it; the soldiers read it in solTick.
// three intents (the doctrine's words): Engage fights what it meets, soldiers before buildings; No pursuit walks to the spot and fights only
// what comes within reach; Buildings first takes the nearest building and leaves the soldiers to the rest
const INTENT = [
	{ name: 'Engage', note: "fight what's met" },
	{ name: 'No pursuit', note: 'fight what blocks' },
	{ name: 'Buildings first', note: 'then the soldiers' },
]; // each note one line under its name, so the rank keeps its 44 (MENU-SPEC §1)
// the three intents, one chosen (its gold ring); it can change on the way
const intentsHTML = (i) =>
	acts(INTENT.map((t, k) => btn(`intent:${i},${k}`, t.name, t.note, (G.bnIntent[i] || 0) === k ? 'on' : '')).join(''), 'c3');
// At home: the four kinds, each with how many the squad holds and − + under it (soldiers at home step in by themselves); the intents; Muster
// once researched; then Cancel, back to what it held when the card opened, and Save ✓, the card's one gold fill. A kind goes to its building.
function squadHomeHTML(c) {
	const i = c.i,
		P = G.bnPlan[i],
		n = Object.values(P).reduce((s, v) => s + v, 0),
		H = G.hud,
		eta = H.h && sqFree(i).length ? hudEta(i) : 0;
	title(BN[i], `${sqUnits(i).length} at home${eta ? ` · ${clock(eta)} to ${coord(H.h.e.x, H.h.e.y)}` : ''}`);
	fold('about', 'About squads', '<p>Soldiers at home fill what a squad holds by themselves; the rest are the reserve. Send it from the War page with Go.</p>');
	let h =
		acts(CLS.map((k, t) => pic(`bldgo:${k[2]}`, ICON.cls[k[0]], k[1], '', P[k[0]] || 0)).join(''), 'c4') +
		acts(
			CLS.map(
				(k, t) =>
					`<div class="duo">${sym(`sqpk:${i},${t},-`, ICON.minus, P[k[0]] ? 'h' : 'h dis', `One fewer ${k[3]}`)}${sym(`sqpk:${i},${t},+`, ICON.plus, n < BNSIZE ? 'h' : 'h dis', `One more ${k[3]}`)}</div>`, // − and + share the tile's width above them
			).join(''),
			'c4',
		) +
		intentsHTML(i);
	if (G.P[0].techs.has('muster')) {
		const miss = musterGap(i),
			why = musterWhy(0, miss),
			mc = musterCost(0, miss);
		h += acts(btn(`muster:${i}`, `Train new: +${musterN(miss)}`, why ? why.replace(/\.$/, '') : `${costText(mc.cost)} · ${mc.t} s`, why ? 'dis' : 'go'), 'c1');
	}
	return h + acts('<i></i>' + btn('sqcancel', 'Cancel') + btn('sqsave', 'Save', '', 'main'), 'c3');
}
// Out: how it stands, what it lost, send more from the idle reserve, its shape and intent, where it is, Abort
function squadOutHTML(i, m) {
	const S = mUnits(m),
		plan = m.st === 'act' ? reinforcePlan(m) : null,
		slow = sideSpd(0),
		hp =
			S.reduce((s, u) => s + u.hp, 0) /
			Math.max(
				1,
				S.reduce((s, u) => s + u.max, 0),
			),
		rows = Object.entries(m.kinds || {})
			.map(([k, n0]) => {
				const alive = S.filter((u) => u.kind === k).length;
				return `<tr><td>${stats(0, k).name}</td><td>${alive} / ${n0}</td><td class="${n0 - alive ? 'low' : ''}">${n0 - alive ? n0 - alive + ' fell' : '—'}</td></tr>`;
			})
			.join('');
	title(m.name, m.st === 'act' ? `fighting · ${Math.round(m.odds * 100)}% to win` : `${clock(m.eta || 0)} to arrive`);
	return (
		hpBar(hp, hp > 0.5 ? codeOf('g') : hp > 0.25 ? 'var(--gold-1)' : codeOf('r')) +
		`<p><i>Health ${Math.round(hp * 100)}%</i> · ${S.length} of ${m.n0} standing · ${m.what.toLowerCase()} ${m.label}${m.st === 'go' ? `, ${clock(m.eta || 0)} to arrive` : ''} · ${paceWord(S)}</p>` +
		`<table style="width:100%;border-collapse:collapse"><tr><th>Kind</th><th>Alive</th><th>Lost</th></tr>${rows}</table>` +
		(slow < 0.98
			? `<p class="dim">${G.wx !== 'clear' ? 'Weather' : 'Season'}: ${wxWord()}, walking ×${slow.toFixed(2)}.</p>`
			: '') +
		acts(
			btn(
				`hudrein:${i}`,
				plan && plan.go.length ? `Send more +${plan.go.length}` : 'Send more',
				plan && plan.go.length
					? waveLine(plan)
					: plan && plan.even
						? 'already even'
						: plan && plan.late
							? 'too late'
							: 'no reserve',
				plan && plan.go.length ? 'go' : 'dis',
			) + btn(`shape:${i}`, 'Formation', FORM[dialOf('form', i)].name, G.P[0].techs.has('formations') ? '' : 'dis'),
		) +
		intentsHTML(i) +
		`<p data-act="jump:${m.x},${m.y}" class="dim"><b>Where</b> ${coord(m.x, m.y)} · tap to go</p>` +
		acts(btn(`hdel:${i}`, 'Abort', 'they come home', 'warn'), 'c1')
	);
}
CARDS.squad = (c) => {
	c.was = c.was || { plan: { ...G.bnPlan[c.i] }, intent: G.bnIntent[c.i] || 0 }; // what Cancel goes back to: the squad as the card found it
	return sqOut(c.i) ? squadOutHTML(c.i, G.msn[c.i]) : squadHomeHTML(c);
};
// The Yard (Albert, Nov 3, preview 47 "Restore and Fix"): the staging ground. Preview 33's screens stay as they are; the controls of 37 to 44
// that lived on the controller (34 to 36, cut) wait here until each has a home. Preview only (YARD_ON). Empty it, then delete it.
const YARD_LIST = [
	['ytool:choketool', 'Choke', 'drag across a gap'],
	['ytool:ambushtool', 'Ambush', 'tap the cover'],
	['ytool:kidle', 'Idle soldiers', 'pick them'],
	['copylog', 'Match log', 'copy for Claude'],
	['boxes', 'Buildings', 'boxes or old pictures'],
];
CARDS.yard = () => {
	title(ROW_WORD.yard, 'controls waiting for a home');
	return list(YARD_LIST.map(([a, w, sub]) => btn(a, w, sub))) + `<p>Preview only. Each of these needs a place on the screen; this card goes when they have one.</p>`;
};
// Set Up (Albert, Nov 2): the Squad page's fourth tile. The three squads in one rank, each with what it is set to hold; a tap opens that squad's card, where it is built.
CARDS.sqsetup = () => {
	title('Set Up', 'build your squads');
	return (
		list(
			BN.map((n, i) => {
				const P = G.bnPlan[i],
					held = CLS.filter((c) => P[c[0]]).map((c) => `${P[c[0]]} ${c[3]}`).join(' · ');
				return btn(`sqcard:${i}`, n, held || 'empty');
			}),
		) + `<p>New soldiers fill each squad up to what you set on its card; the rest are the reserve.</p>`
	);
};

// ── The match log (Albert, Nov 3, 22:34: "If I play a game can you analyze it?"; preview 49, preview only, YARD_ON). Once a second it counts
// your Town Center idle (nothing training) and your soldiers and villagers lost; once a minute a row for every side: age, villagers (idle),
// soldiers, what each store holds, and what was gathered that minute by resource. At the end, Copy log puts it all on the clipboard, with
// the realm and war lines of the mail and the milestones, for Claude to read.
function matchLog() {
	const L = G.mlog || (G.mlog = { v: 1, rows: [], idle: 0, lost: { vil: 0, sol: 0 }, seen: null, got: null });
	const k = keepOf(0);
	if (k && k.prog >= 1 && !k.q.length) L.idle++;
	const vil = unitsOf(0, 'vil').length,
		sol = soldiersOf(0).length;
	if (L.seen) {
		if (vil < L.seen.vil) L.lost.vil += L.seen.vil - vil;
		if (sol < L.seen.sol) L.lost.sol += L.seen.sol - sol;
	}
	L.seen = { vil, sol };
	// L (Albert, Nov 4): a line when a find runs dry (not trees: a forest has thousands), with who worked it last
	const dry = L.dry || (L.dry = []),
		gone = new Set(dry.map((d) => d.id)); // rebuilt each time: a Set does not survive a save
	for (const n of G.nodes)
		if (n.amt <= 0 && !n.farm && n.kind !== 'tree' && !gone.has(n.id)) {
			gone.add(n.id);
			dry.push({ id: n.id, t: Math.round(G.t), kind: n.kind, at: coord(n.x, n.y) });
		}
	if (Math.floor(G.t) % 60 > 1 && L.rows.length) return;
	const m = Math.round(G.t / 60);
	if (L.rows.length && L.rows[L.rows.length - 1].m === m) return;
	const got = G.P.slice(0, 4).map((p) => ({ ...(p.gotBy || {}), all: Math.round(p.gathered || 0) }));
	L.rows.push({
		m,
		tcIdle: L.idle,
		jobs: unitsOf(0, 'vil').reduce((a, u) => ((a[freeVil(u) ? 'idle' : u.job || 'none'] = (a[freeVil(u) ? 'idle' : u.job || 'none'] || 0) + 1), a), {}), // your villagers by job (L)
		lost: { ...L.lost },
		// a side a line, short so a long game stays small: [age, villagers, idle, soldiers, food, wood, stone, gold, iron, gathered this minute], or 0 once it fell
		s: G.P.slice(0, 4).map((p, i) =>
			p.alive
				? [p.age, unitsOf(i, 'vil').length, unitsOf(i, 'vil').filter(freeVil).length, soldiersOf(i).length, ...['f', 'w', 's', 'g', 'i'].map((r) => Math.round(p.res[r] || 0)), got[i].all - ((L.got && L.got[i]) || 0)]
				: 0,
		),
	});
	L.got = got.map((g) => g.all);
	L.idle = 0;
	L.lost = { vil: 0, sol: 0 };
}
function matchLogText() {
	const L = G.mlog || { rows: [] },
		mail = (G.mail || []).filter((x) => x.grp === 'war' || x.grp === 'realm' || x.grp === 'home').map((x) => `${clock(x.t)} ${x.text}${x.n > 1 ? ' ×' + x.n : ''}`);
	return JSON.stringify({ build: BUILD, seed: G.seed, sides: G.P.slice(0, 4).map((p) => p.name), cols: 'age vil idle sol f w s g i got', tcIdle: 'seconds your Town Center trained nothing, that minute', lost: 'your villagers and soldiers lost, that minute', civ: G.P[0].civ, diff: G.diff, end: clock(G.t), over: G.over || null, jobs: 'your villagers by job, that minute', dry: (L.dry || []).map(({ t, kind, at }) => `${clock(t)} ${kind} ran dry at ${at}`), rows: L.rows, ms: G.ms || [], mail });
}
function copyLog() {
	const t = matchLogText(),
		done = () => {
			say('Match log copied: paste it to Claude.', 'good', TOAST.short);
			const e = $('endLog');
			if (e && !e.hidden) e.innerHTML = '<b>Copied</b><small>paste it to Claude</small>'; // the end screen covers the toast: the button says so itself
		};
	try {
		navigator.clipboard.writeText(t).then(done, () => fallbackCopy(t, done));
	} catch (e) {
		fallbackCopy(t, done);
	}
}
function fallbackCopy(t, done) {
	const a = document.createElement('textarea');
	a.value = t;
	a.setAttribute('readonly', '');
	a.style.cssText = 'position:fixed;left:-9999px;top:0';
	document.body.appendChild(a);
	a.select();
	a.setSelectionRange(0, t.length);
	try {
		document.execCommand('copy');
		done();
	} catch (e) {
		say('Could not copy the log.', '', TOAST.short);
	}
	a.remove();
}
// ═════ 40-emergency.js: Emergency: Stop, Town square, All hands, Shelter ═════
// Four orders (MENU-SPEC §8, picture Easy Cards). At the first of them the game notes the picture Stop goes back to: every villager's work
// and spot, and the squads' tempers. Town square: everyone, villagers and soldiers, gathers round the Town Center, each on its own side of
// it. All hands: villagers and soldiers fight from the buildings: one ranking for everyone, the buildings that shelter, the sturdiest first
// (current hit points, then room), each filled to its room with the nearest; soldiers first, shooters before them, and the soldiers left
// over hold a line toward the danger. Shelter: the villagers alone, the same way. Villagers left over wait behind the Town Center. Stop:
// every villager back to its work; soldiers stay where the order put them (a garrison adds arrows, DEFENDING) until you send them.
const EMERGENCY = [
	['square', 'Gather', 'everyone to the Town Center'],
	['hands', 'Garrison', 'villagers and soldiers fight'],
	['shelter', 'Shelter', 'villagers inside'],
];
const EMG = { line: 110, row: 12, perRow: 12, behind: 60, square: 20 }; // square: the villagers stand this far out from the Town Center's walls, the soldiers three times as far
const shelterRank = () =>
	G.blds
		.filter((b) => standing(b, 0) && BLD[b.kind].shelter)
		.sort((a, b) => b.hp - a.hp || shelterOf(0, b.kind) - shelterOf(0, a.kind));
const roomIn = (b) =>
	shelterOf(b.owner, b.kind) -
	G.units.filter((u) => u.hid === b.id || (u.state === 'garrison' && u.gar === b.id)).length; // in, or on the way in (Build 60: a second Shelter counted only those in, and over-filled)
// the soldiers an emergency moves: every one but the guards (they keep to what they guard) and the routed (they run for home)
const troops = () => armyFree(0, 'unarmed', 'escort', 'rout', 'school'); // a student keeps its lesson (C10)
// a soldier off its order, to stand at a spot and fight what comes
const stand = (u, x, y) =>
	Object.assign(u, {
		ord: undefined,
		focus: null,
		tgt: null,
		fid: null,
		state: 'goto',
		px: clamp(x, 20, MAP - 20),
		py: clamp(y, 20, MAP - 20),
		idleT: 0,
	});
// the way the danger lies from the Town Center: the attack coming, else the nearest threat, else across the map
function threatDir(k) {
	const t = G.incoming || nearest(G.threats, k, (v) => isFoe(0, v), 700) || { x: MID, y: MID },
		d = dist(t, k) || 1;
	return { x: (t.x - k.x) / d, y: (t.y - k.y) / d };
}
// fill the ranked buildings with the nearest of these units (shooters first when asked); what is left over is returned
function fillRank(units, pick) {
	let rest = units.slice();
	for (const b of shelterRank()) {
		const take = rest
			.sort((p, q) => (pick.first ? pick.first(p) - pick.first(q) : 0) || dist(p, b) - dist(q, b))
			.slice(0, Math.max(0, roomIn(b)));
		take.forEach((u) => pick.into(u, b));
		rest = rest.filter((u) => !take.includes(u));
	}
	return rest;
}
// once, at the first order: the picture Stop goes back to, every villager's work and every squad's temper; a villager born since is noted at the next
function emgSnap(kind) {
	if (!G.emg) G.emg = { kind, snap: [], temper: G.temper.slice() };
	G.emg.kind = kind;
	for (const u of unitsOf(0, 'vil'))
		if (!G.emg.snap.some((n) => n.id === u.id))
			G.emg.snap.push({ id: u.id, job: u.job, nid: u.node ? u.node.id : null, post: u.post });
}
// a villager let go by the emergency: not frightened, out of the building it went into
function release(u) {
	u.emg = false;
	u.scared = false;
	u.safe = null;
	if (u.inside) stepOut(u, byId(G.blds, u.hid));
	u.hid = 0;
}
function villagersIn() {
	const V = unitsOf(0, 'vil').filter((u) => !(u.inside && u.shop) && !u.hid), // those at work indoors are indoors already; those sent in stay sent
		k = keepOf(0);
	const left = fillRank(V, {
		into: (u, b) => {
			u.emg = true;
			u.scared = true;
			u.safe = null;
			u.hid = b.id;
		},
	});
	if (!k) return;
	const d = threatDir(k);
	left.forEach((u, i) => {
		u.emg = true;
		u.scared = true;
		u.hid = 0;
		u.safe = {
			x: clamp(k.x - d.x * EMG.behind + (i % 6) * 10 - 25, 20, MAP - 20),
			y: clamp(k.y - d.y * EMG.behind + Math.floor(i / 6) * 10, 20, MAP - 20),
		};
	});
}
function soldiersIn() {
	hudAbortAll();
	const k = keepOf(0),
		S = troops();
	if (!k || !S.length) return;
	for (const u of S) {
		u.ord = undefined;
		u.focus = u.tgt = null;
		u.fid = null;
	}
	const left = fillRank(S, {
		first: (u) => (UNIT[u.kind].rng > 20 ? 0 : 1),
		into: (u, b) => {
			u.state = 'garrison';
			u.gar = b.id;
		},
	});
	const d = threatDir(k),
		cx = k.x + d.x * EMG.line,
		cy = k.y + d.y * EMG.line;
	G.temper = Array(BNS + 1).fill(T_HOLD); // hold: they fight what comes within reach and keep the line
	left.forEach((u, i) => {
		const row = Math.floor(i / EMG.perRow),
			col = (i % EMG.perRow) - (Math.min(left.length, EMG.perRow) - 1) / 2;
		stand(u, cx - d.x * row * EMG.row - d.y * col * EMG.row, cy - d.y * row * EMG.row + d.x * col * EMG.row);
	});
}
// Town square: everyone round the Town Center, each on its own side: the villagers just out from its walls, the soldiers beyond them; every
// mission comes home. A villager inside a shelter comes out to it
function townSquare() {
	const k = keepOf(0);
	if (!k) return;
	hudAbortAll();
	const at = (u, r) => {
		const d = dist(u, k) || 1;
		return {
			x: clamp(k.x + ((u.x - k.x) / d) * r + u.ox * 0.5, 20, MAP - 20),
			y: clamp(k.y + ((u.y - k.y) / d) * r + u.oy * 0.5, 20, MAP - 20),
		};
	};
	for (const u of unitsOf(0, 'vil')) {
		const pl = u.plot;
		release(u);
		stopVil(u, at(u, halfOf(k) + EMG.square));
		u.plot = pl; // posted (D-089): it keeps its building through the Emergency and goes back to it on Stop
	}
	for (const u of troops()) {
		const p = at(u, halfOf(k) + EMG.square * 3);
		stand(u, p.x, p.y);
	}
}
function emgStart(kind) {
	emgSnap(kind);
	if (kind === 'square') townSquare();
	if (kind === 'hands') soldiersIn(); // soldiers first: the strongest places are theirs
	if (kind === 'shelter' || kind === 'hands') villagersIn();
	say(`${EMERGENCY.find((e) => e[0] === kind)[1]}.`, 'warn', TOAST.mid);
	feel('crack');
}
// Stop: every villager back to what it was doing; soldiers stay where the order put them
function emgStop() {
	if (!G.emg) return;
	for (const n of G.emg.snap) {
		const u = G.units.find((v) => v.id === n.id && v.hp > 0),
			node = n.nid && G.nodes.find((x) => x.id === n.nid && x.amt > 0);
		if (!u) continue;
		release(u);
		setJob(u, n.job, node && node.farm ? node : null);
		if (node && !node.farm) u.node = node;
		u.post = n.post;
	}
	G.temper = G.emg.temper;
	G.emg = null;
	say('Back to work.', 'good', TOAST.short);
}
