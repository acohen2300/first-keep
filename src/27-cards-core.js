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
// A card rises from the row in whole ranks (MENU-SPEC §1): its height is its content rounded up to the next rank, never more than its size
// allows (the style sheet's --capH). One observer sees every change of the content: a new page, a fold opened, the font arriving.
const cardIn = $('card').firstElementChild;
function cardRanks() {
	const s = getComputedStyle(document.documentElement),
		gap = parseFloat(s.getPropertyValue('--gap')),
		rank = parseFloat(s.getPropertyValue('--slot')) + gap;
	$('card').style.setProperty('--rk', Number($('card').dataset.fix) || Math.max(1, Math.ceil((cardIn.offsetHeight + gap) / rank))); // a building's card keeps its fixed height (fixOf)
}
new ResizeObserver(cardRanks).observe(cardIn);
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
const grid3 = (cells) => (cells.length ? acts(cells.join('') + empty().repeat((3 - (cells.length % 3)) % 3), 'c3') : '');
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
	const lock = cardLocked() ? ' class="dis"' : '', // a card that must be answered: close is dim (back too on Resume, which has nowhere to go back to)
		lockB = G.card && G.card.type === 'resume' ? lock : '';
	return (
		`<div class="tb fm"><button data-act="cardback"${lockB} aria-label="Back">${ICON.back}</button><h3 class="s3${look ? ` a${look.age}${look.work !== undefined ? ' work' : ' life'}` : ''}"${look ? ` style="${look.work !== undefined ? toGo(1 - look.work) : `--hp:${Math.round(look.hp * 100)}%;--hc:${grad(look.hp * 2 - 1)}`}"` : ''}>${t}</h3>` +
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
		sub + (withAt && st !== 'locked' ? ` · ${BLD[t.at].short || BLD[t.at].name}` : ''), // a locked step says what it lacks; its › goes to the building
		`a${t.age} ` + (st === 'ready' ? 'go' : st === 'short' ? 'dis short' : st === 'busy' ? 'dis' : 'dis lock'),
		st === 'short' ? fillOf(c) : st === 'ready' ? 1 : undefined,
	); // a${age}: the top edge wears the age's colour
}
const trainsAt = (kind) =>
	Object.keys(UNIT).filter(
		(k) => (UNIT[k].at === kind || (UNIT[k].also || []).includes(kind)) && !UNIT[k].civ && UNIT[k].cost,
	);
function keepAgeBtn() {
	// the next age, as one research button; the reason waits behind the book
	const p = G.P[0],
		A = nextAge(0);
	if (!A) return '';
	fold('why', 'Why this age?', `<p>${WHY['age' + (p.age + 1)]}</p>`);
	return btn(
		'age',
		`${A.name} age`,
		p.aging ? 'advancing' : !afford(p, A.cost) ? `short ${need(A.cost)}` : costText(A.cost),
		p.aging || !afford(p, A.cost) ? 'dis' : 'go',
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
