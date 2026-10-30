// ═════ 32-frame.js: the frame: the bars, the preview and the mail, the page ═════
// ───────────────────────── The frame: the screen round the map, and its refresh ─────────────────────────
// Every icon is drawn once, here. The markup reads from this table, so a resource looks the same in the tally and under the jobs.
const SVG = (vb, body, cls = 'gl') => `<svg class="${cls}" viewBox="0 0 ${vb} ${vb}" aria-hidden="true">${body}</svg>`;
const ICON = {
	aim: SVG(
		20,
		'<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 1v4M10 15v4M1 10h4M15 10h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/>',
	),
	back: SVG(
		20,
		'<path d="M9 5l-5 5 5 5M4 10h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
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
	cycle: SVG(
		16,
		'<path d="M3 8a5 5 0 0 1 8.6-3.5M13 8a5 5 0 0 1-8.6 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M11.8 1.6v3.2H8.6M4.2 14.4v-3.2h3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
	),
	shield: SVG(
		16,
		'<path d="M8 1.5 L13.5 3.5 V8 Q13.5 12.5 8 14.5 Q2.5 12.5 2.5 8 V3.5 Z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
	),
	go: SVG(16, '<path d="M4 2.5 L13 8 L4 13.5 Z" fill="currentColor"/>'),
	cls: {
		foot: SVG(
			16,
			'<path d="M3 14 L12.5 3.5" stroke="#d9c79a" stroke-width="1.6" stroke-linecap="round"/><path d="M11 2 L14.5 1.5 L14 5 Z" fill="#e8eef2"/>',
		),
		arch: SVG(
			16,
			'<path d="M5 1.5 Q14 8 5 14.5" fill="none" stroke="#c9a46a" stroke-width="1.6"/><path d="M5 1.5 V14.5" stroke="#eee" stroke-width=".8"/><path d="M2 8 H12" stroke="#ddd" stroke-width="1.2"/><path d="M12 6.5 L14.5 8 L12 9.5Z" fill="#eee"/>',
		),
		horse: SVG(
			16,
			'<path d="M3 14 L4 9 Q4 6 7 6 L9 3 L10.5 4.5 L13.5 5 L13 7 L10.5 7 L10.5 10 L12 14" fill="none" stroke="#d9c79a" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
		),
		siege: SVG(
			16,
			'<rect x="2" y="7" width="11" height="3.5" rx="1" fill="#a07a4a"/><path d="M13 8.7 H15" stroke="#ccc" stroke-width="2"/><circle cx="4.5" cy="12.5" r="1.6" fill="#ddd"/><circle cx="10.5" cy="12.5" r="1.6" fill="#ddd"/><path d="M3 7 L7.5 3 L12 7" fill="none" stroke="#d9c79a" stroke-width="1.3"/>',
		),
	},
	head: SVG(
		20,
		'<circle cx="10" cy="6.2" r="3.2" fill="currentColor"/><path d="M3.8 16.5 C3.8 12.6 6.6 10.8 10 10.8 C13.4 10.8 16.2 12.6 16.2 16.5 Z" fill="currentColor"/>',
	),
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
	shop: SVG(
		20,
		'<path d="M3.5 7.5 H15.5 M12.5 4.5 L15.5 7.5 L12.5 10.5 M16.5 13 H4.5 M7.5 10 L4.5 13 L7.5 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
	),
	cult: SVG(
		20,
		'<path d="M3 8.2 L10 4 L17 8.2 Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M5.2 9.5 V15 M8.4 9.5 V15 M11.6 9.5 V15 M14.8 9.5 V15 M3 16.5 H17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
	),
	sword: SVG(
		16,
		'<path d="M13.5 2.5 L13.5 4.6 L6.6 11.5 L4.5 9.4 L11.4 2.5 Z" fill="currentColor"/><path d="M3.2 8.6 L7.4 12.8 M2.4 13.6 L5 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
	),
	close: SVG(
		20,
		'<path d="M5.5 5.5 L14.5 14.5 M14.5 5.5 L5.5 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
	),
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
	map: SVG(
		20,
		'<path d="M3 5.5 L7.5 4 L12.5 5.5 L17 4 V14.5 L12.5 16 L7.5 14.5 L3 16 Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M7.5 4 V14.5 M12.5 5.5 V16" stroke="currentColor" stroke-width="1.5"/>',
	),
	less: SVG(20, '<path d="M4.5 10 H15.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
	sound: SVG(
		16,
		'<path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path class="w" d="M11 5.5q2 2.5 0 5M12.8 3.8q3.4 4.2 0 8.4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/><path class="x" d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
	),
	list: SVG(
		16,
		'<path d="M3 4.5h10M3 8h10M3 11.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
	),
	up: SVG(
		16,
		'<path d="M3.5 10l4.5-4.5 4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
	),
	bell: SVG(
		16,
		'<path d="M8 2.2c-2.3 0-3.9 1.8-3.9 4.1v2.6L2.8 11h10.4l-1.3-2.1V6.3C11.9 4 10.3 2.2 8 2.2z" fill="currentColor"/><path d="M6.6 12.6a1.5 1.5 0 0 0 2.8 0" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
	),
	mail: SVG(
		20,
		'<rect x="2.5" y="4.5" width="15" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 5.5 L10 11 L17 5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
	),
	play: SVG(16, '<path d="M4.5 2.8 L13 8 L4.5 13.2 Z" fill="currentColor"/>'),
	pause: SVG(16, '<path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor"/>'),
	hush: SVG(
		16,
		'<path d="M8 2.2c-2.3 0-3.9 1.8-3.9 4.1v2.6L2.8 11h10.4l-1.3-2.1V6.3C11.9 4 10.3 2.2 8 2.2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.6 12.6a1.5 1.5 0 0 0 2.8 0" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M2.5 2.5l11 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
		'hi',
	), // silence this kind
};
ICON.tab = {
	train: ICON.hammer.replace('class="gl"', 'class="ti"'),
	research: ICON.book.replace('class="gl"', 'class="ti"'),
}; // a hammer for making things, a book for learning them, on a card's two tabs
ICON.book = ICON.book.replace('class="gl"', 'width="18" height="18"');
// One mold for every control: a cell is an icon spot and a word spot. The tally is a pill of cells; a tile is one cell in its own box.
const cell = (attrs, icon, word, cls = '') => `<button class="cell ${cls}" ${attrs}>${icon}${word}</button>`;
const wd = (t, id) => `<span class="wd"${id ? ` id="${id}"` : ''}>${t}</span>`;
// The top: the tally (five counts, mute, pause, the map), then the status pill under it, cell for cell. The bottom: People over the door, then one column per job.
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
		cell('id="mapT" data-act="map" aria-label="The small map"', ICON.map, '', 'one'); // one button for play, pause and speed (hold it); the freed cell is the map (Albert, Build 40)
	const st = (act, t, label, id) =>
		`<button class="cell st"${id ? ` id="${id}"` : ''} data-act="${act}" aria-label="${label}">${t}</button>`;
	$('jobs').innerHTML =
		`<div class="col join">${cell('id="tPeople" data-act="train:vil" aria-label="Train a villager"', ICON.people, wd('0/0', 'tPeopleN'))}${doorHTML()}</div>` + // one tap makes a villager; the door under it (Build 64: it took the hammer's place; Build is a page now)
		JOBS.map(
			(r) =>
				`<div class="col">${cell(`id="tj_${r}" data-act="job:${r}"`, `<span class="top">${ICON[r]}<span class="c" id="tn_${r}">0</span></span>`, wd(cap1(r)))}<div class="pm">${st('less:' + r, '−', 'One fewer on ' + r)}${st('move:' + r, '+', 'One more on ' + r)}</div></div>`,
		).join('');
	// the status pill: the state of the world, one cell under each column of the tally (Albert, Build 64: "age under Food, season under
	// Wood"); the cells never move, and a narrow tally shows the first ones (the age, the season, the clock, the people come first)
	const sc = (id, act, label) =>
		act
			? `<button class="cell" id="${id}" data-act="${act}" aria-label="${label}"><span class="gl"></span><span class="wd"></span></button>`
			: `<span class="cell" id="${id}" aria-label="${label}"><span class="gl"></span><span class="wd"></span></span>`;
	$('status').innerHTML = STATUS.map(([id, act, label]) => sc(id, act, label)).join('');
	$('emgB').innerHTML = ICON.def;
	$('homeB').innerHTML = ICON.home;
	$('pX').innerHTML = ICON.close;
}
const refresh = () => {
	cardSig = '';
	ui(true);
};
function muteBtn() {
	$('muteB').classList.toggle('off', !SND.on);
	$('muteB').classList.toggle('sel', !SND.on);
	$('muteB').setAttribute('aria-label', SND.on ? 'Mute' : 'Sound on');
}
function paceBtn() {
	const pb = $('pauseB');
	pb.innerHTML = (G.paused ? ICON.play : ICON.pause) + (G.speed > 1 ? `<span class="spd">×${G.speed}</span>` : '');
	pb.setAttribute('aria-label', G.paused ? 'Play' : 'Pause');
	pb.classList.toggle('sel', !!G.paused);
}
function setPause(v) {
	G.paused = v;
	paceBtn();
	if (!v && typeof spdPop === 'function') spdPop(false);
}
function applyMini() {
	mini.hidden = !SET.mini;
	$('mapT').classList.toggle('sel', !!SET.mini);
	$('stage').classList.toggle('mapOn', !!SET.mini);
}
// the end of a game: the sim says who won and why; the screen shows it
function showEnd(won, text, all) {
	$('endT').textContent = all ? 'Everyone wins' : won ? 'Victory' : 'Defeat';
	$('endP').textContent = text;
	$('endX').innerHTML = crownsHTML(); // the three crowns and the overall, then the chronicle
	$('endNext').hidden = $('endFree').hidden = !won;
	$('end').hidden = false;
	closeCard();
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
		{
			const c1 = document.querySelector('#orders .tr:not([hidden]) > .col'); // the first column of the row on show: the chip sits on it, its width
			if (c1) {
				const q = c1.getBoundingClientRect(),
					a = $('app').getBoundingClientRect();
				document.documentElement.style.setProperty('--c1x', (q.left - a.left).toFixed(1) + 'px');
				document.documentElement.style.setProperty('--c1w', q.width.toFixed(1) + 'px');
			}
		}
		vy = Math.round((h.bottom - t + (o.top - t)) / 2 - ch / 2);
		bandH = Math.max(100, o.top - h.bottom);
	}
	const W = Math.round(cw * dpr),
		H = Math.round(ch * dpr);
	if (cv.width !== W) cv.width = W;
	if (cv.height !== H) cv.height = H;
	cam.z = clamp(cam.z, minZ(), ZOOM_MAX);
	clampCam();
}

// who a unit not yours belongs to, in a few words: a rival and how you stand, the Natives, the horde, outlaws, the wild
function whoIs(u) {
	const nm = UNIT[u.kind].name;
	if (u.owner !== WILD) {
		const P = G.P[u.owner];
		return `${nm} · ${P.name}${P.civ ? ', ' + CIVS[P.civ].name : ''} · ${REL_WORD[G.rel[0][u.owner]].toLowerCase()}`;
	}
	if (u.native) return `${nm} · the Natives · ${REL_WORD[G.rel[0][WILD]].toLowerCase()}`;
	if (u.horde && !u.back) return `${nm} · the horde`;
	if (u.back || u.find !== undefined) return `${nm} · outlaws from a camp`;
	return `${nm} · ${UNIT[u.kind].tags && UNIT[u.kind].tags.includes('animal') ? 'a wild animal' : 'the wild'}`;
}
// ───────────────────────── Messages (Build 64, Albert) ─────────────────────────
// A line arrives as a preview, the way a phone shows a text, over the map, and fades after MSG.secs; every line is kept in the mail (the
// dashboard's last tile). Two kinds: a reply, from say, answers your own tap and is never hidden; news, from news, comes from the world by group,
// and a group can be hidden from the preview's ×: its lines then go quietly to the mail, unless urgent (red). A repeat in the same group
// within MSG.merge seconds is a count on the first (Raid ×3), not a new flash. The best of the genre do the same: one alert a place, a
// sound and a place to tap, the text short and gone, a list to read later.
const MSG = { secs: 4, merge: 30, keep: 30 };
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
const QUIET = new Set(['news', 'soft']); // quiet kinds never preview: they wait in the mail
const urgentCls = (cls) => !!cls && cls.startsWith('warn');
const ccOf = (cls) => (urgentCls(cls) ? '#ff6b5b' : cls === 'good' ? '#5fd08a' : cls === 'tip' ? '#4f9dff' : '#e9ecef'); // the colour code
const hiddenG = (g) => !!(SET.hideG && SET.hideG[g]);
const news = (grp, text, cls, secs, at, act, why) => say(text, cls, secs, at, act, why, grp);
// ───────────────────────── How news reaches you (Build 59; TELL in 06, the Post line of research)
// You know what you see, what your people hear, and what a messenger brings. A line with a place (at) out of your sight is heard if it is a
// fight near your people (vague: which way), else carried by a messenger at a runner's or a rider's pace, if your post reaches that far;
// a line with no place happens at your court, or in the sky, and is first hand.
const DIR8 = ['east', 'south-east', 'south', 'south-west', 'west', 'north-west', 'north', 'north-east'];
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
			const from = k || at,
				a = Math.round(Math.atan2(at.y - from.y, at.x - from.x) / (Math.PI / 4) + 8) % 8;
			return { now: true, text: `Sounds of fighting to the ${DIR8[a]}.` };
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
		pre = !QUIET.has(cls) && (urg || !hiddenG(grp)),
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
	if (!pre) G.mailN = (G.mailN || 0) + 1; // what came quietly: the count on the mail
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
		news('lesson', msFill(line), 'good', 7, null, `card:milestone,${id}`);
		sfx('coin');
		return; // one a tick: they never pile up
	}
}
function advise() {
	const p = G.P[0],
		k = keepOf(0);
	if (!k || G.over) return '';
	const V = unitsOf(0, 'vil'),
		on = (j) => V.filter((u) => u.job === j).length,
		S = soldiersOf(0);
	if (V.some((u) => u.noPath && G.t - (u.noPathT || -9) < 4) && !L('build:gate')) return 'Walled in: build a Gate.';
	if (
		(k.blocked || (popOf(0) >= capOf(0) && capOf(0) < POPMAX && !bldsOf(0, 'house').some((b) => b.prog < 1))) &&
		!L('build:house')
	)
		return p.age >= 2
			? 'You are full: Build → House, Apartment or Aqueduct.'
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
		const idle = V.filter((u) => u.idle).length;
		if (idle && G.t > 20 && !L('job')) return `${idle} villager${idle > 1 ? 's' : ''} idle (z). Tap + under a job.`;
	}
	if (bldsOf(0, 'farm').some((b) => b.prog >= 1 && b.node && !(b.node.wk > 0)) && !L('job:field'))
		return 'A field has no workers. Tap + under Food.';
	if (!bldsOf(0, 'barracks').length && G.t > 75 && !L('build:barracks'))
		return G.diff === 'easy'
			? 'Raiders come after minute 6 on Easy: Build → Barracks before then.'
			: 'Raiders often come around minute 3 or 4: Build → Barracks.';
	if (ready(0, 'barracks').length && S.length < 3 && G.t < 600 && !L('train:spear'))
		return 'Train spearmen at your Barracks.';
	if (on('wood') >= 3 && !bldsOf(0, 'lumber').length && !L('build:lumber')) return 'Wood is far: Build → Lumber camp.';
	if (
		G.nodes.filter((n) => n.kind === 'bush' && dist(n, k) < 300).length < 3 &&
		!bldsOf(0, 'farm').length &&
		!L('build:farm')
	)
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
	if (p.res.g < 50 && (p.res.w > 300 || p.res.s > 300 || p.res.f > 300) && !L('trade'))
		return ready(0, 'market').length
			? 'Gold is low: sell wood, food or stone at the Market.'
			: 'Gold is low: Build → Market, then sell what you have too much of.';
	if (G.blds.some((b) => b.owner === 0 && b.fire > 0 && !G.units.some((u) => u.rep === b && u.job === 'repair')))
		return '!Fire! Tap it, send a villager.';
	if (
		G.units.some((u) => u.owner === 0 && u.sick > G.t) &&
		!ready(0, 'hospital').length &&
		p.age >= 2 &&
		!L('build:hospital')
	)
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
// Controls appear when their age comes (Build 59, Albert: hide by age). One rule, read from the rules tables: a resource shows from the first
// age anything costs it (iron from the Bronze age); the Huddle shows with your first soldier; Emergency with the first enemy at your town or
// the Bronze age, whichever is first.
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
function showByAge() {
	const p = G.P[0],
		F = FIRST || (FIRST = firstAge());
	let n = 1;
	RES.forEach((r, i) => {
		const k = KEY[r],
			on = p.age >= F[k] || p.res[k] >= 1;
		$('r' + k).parentElement.hidden = !on;
		const col = $('jobs').children[i + 1];
		if (col) col.hidden = !on;
		if (on) n++;
	});
	$('jobs').style.setProperty('--n', n);
	$('hudB').hidden = !soldiersOf(0).length && !hasCmd() && !(G.msn || []).some(Boolean); // the page chip: once there is an army to send or squads to make
	$('emgB').hidden = p.age < 1 && !(G.warnT > 0);
}
function ui(force) {
	const now = performance.now();
	if (!force && now - uiAt < 150) return;
	uiAt = now;
	const p = G.P[0],
		R = p.res;
	document.body.classList.toggle('night', G.night > 0.5);
	showByAge();
	const VC = {};
	for (const k of ['f', 'w', 's', 'g', 'i']) {
		txt('r' + k, fmt(R[k]));
		const c = (VC[k] = grad(velOf(p, k))),
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
		const idleN = unitsOf(0, 'vil').filter(freeVil).length,
			sol = armyOf(0).length,
			rank = 1 + G.P.filter((q) => q.id && q.id !== WILD && q.score.total > p.score.total).length,
			sky = `${SEASON_ICON[season().name]}${WX_ICON[G.wx] || ''}${G.night > 0.5 ? (moonLight() < 0.25 ? '🌑' : '🌙') : ''}`,
			n = Math.min(STATUS.length, [...$('tally').children].filter((e) => !e.hidden).length),
			put = (id, gl, word, cls, i) => {
				const el = $(id),
					sig = gl + '|' + word + '|' + cls + '|' + (i < n);
				if (el.sig === sig) return;
				el.sig = sig;
				el.hidden = i >= n;
				el.className = 'cell' + (cls ? ' ' + cls : '');
				el.children[0].innerHTML = gl;
				el.children[1].textContent = word;
			};
		const S = [
			['', AGES[p.age].name, ''],
			[sky, '', ''],
			['', clk, ''],
			[ICON.head, `${popOf(0)}/${capOf(0)}`, popOf(0) >= capOf(0) && capOf(0) < POPMAX ? 'lit-r' : ''],
			['', `z ${idleN}`, idleN ? 'lit-r' : 'dim'],
			[ICON.book, String(ready), ready ? 'lit-b' : 'dim'],
			['', `★${fmt(p.score.total)} ${['1st', '2nd', '3rd', '4th', '5th'][rank - 1] || rank + 'th'}`, ''],
			[ICON.mil, String(sol), sol ? '' : 'dim'],
		]; // one line a cell: the strip stays thin (Albert: "It has to stay little")
		STATUS.forEach(([id], i) => put(id, S[i][0], S[i][1], S[i][2], i));
	} // the colour code on the pill: blue research you can start, red the people at the roof or idle hands; dim is nothing to see
	huddleUI();
	const V = unitsOf(0, 'vil');
	for (const r of JOBS) {
		let n = 0;
		for (const v of V) if (v.job === r) n++;
		txt('tn_' + r, String(n));
		{
			const el = $('tn_' + r),
				c = VC[KEY[r]] || '';
			if (el.style.color !== c) el.style.color = c;
		} // the job's number wears its store's colour: the row reads as one
		$('tj_' + r).classList.toggle('sel', p.rally === r);
	}
	const nq = queuedOf(0, 'vil'),
		room = Math.max(0, capOf(0) - popOf(0));
	txt('tPeopleN', nq ? `${V.length}+${nq}` : `${V.length}/${V.length + room}`); // have / can have now (one population: homes cap everyone); with villagers waiting, have + waiting
	$('tPeople').classList.toggle('dis', !!trainWhy(0, 'vil'));
	{
		const k = keepOf(0),
			away = !k || SX(k.x) < -20 || SX(k.x) > cw + 20 || SY(k.y) < -20 || SY(k.y) > ch + 20;
		if ($('homeB').hidden === away) $('homeB').hidden = !away;
	} // home shows only when your Town Center is off the screen
	$('stage').classList.toggle('busy', !!(G.card || G.place));
	if ($('buildT')) $('buildT').classList.toggle('sel', !!(G.card && G.card.type === 'menu')); // one look for on: the outline, as the default job wears it
	doorUI();
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
			const sol = armyOf(0).filter(isSoldier).length,
				war = foe.owner === WILD ? !foe.native || atWar(0, WILD) : atWar(0, foe.owner),
				row = `<button data-act="pattack:${foe.id}" class="${war && sol ? 'warn' : 'dis'}"><b>Attack</b><small>${!sol ? 'no soldiers' : war ? 'all soldiers' : 'not at war'}</small></button><button data-act="look:${foe.id}"><b>More</b></button>`;
			if (el.rowH !== row) {
				el.rowH = row;
				$('pickRow').innerHTML = row;
			}
		} // who is this? the bar says, and offers the fight (Albert, Build 41)
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
				? G.place.kind === 'wall'
					? 'Tap where the wall starts'
					: `Press where the ${B.name.toLowerCase()} goes · drag empty ground to look around`
				: G.place.why
					? G.place.why
					: G.place.kind === 'wall'
						? `${G.place.cells.length} pieces: tap a corner to add, drag a corner or the wall, or Build`
						: `${B.name}: tap Build, or drag it to move · drag empty ground to look`;
		txt('placeT', t);
		$('placeUndo').hidden = G.place.kind !== 'wall' || !G.place.pts.length;
		$('placeOk').classList.toggle('dis', !G.place.at || !!G.place.why);
	}
	preview();
	if (G.card) renderCard();
}
const linkOf = (m) => m && (m.act || (m.at ? `jump:${m.at.x},${m.at.y}` : ''));
// The preview (Build 64): the newest live line, or the question that hides its group; paused says so when nothing is live. A full card
// is a moment of reading: the preview steps aside, and the line waits in the mail.
function preview() {
	const el = $('pv'),
		M = G.mail || [],
		now = performance.now(),
		paused = G.paused && !(G.card && (G.card.type === 'resume' || G.card.type === 'setup')),
		live = M.find((m) => m.ru > now),
		big = !!G.card && $('card').classList.contains('full'),
		ask = G.pvAsk;
	let h = '',
		cc = '#e9ecef';
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
	el.classList.toggle('fade', !!live && !ask && live.ru - now < 400);
}
