// ═════ 32-frame.js: the frame: ticker, bars, the page ═════
// ───────────────────────── The frame: the screen round the map, and its refresh ─────────────────────────
// Every icon is drawn once, here. The markup reads from this table, so a resource looks the same in the tally and under the jobs.
const SVG = (vb, body, cls = 'gl') => `<svg class="${cls}" viewBox="0 0 ${vb} ${vb}" aria-hidden="true">${body}</svg>`;
const ICON = {
	aim: SVG(20, '<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 1v4M10 15v4M1 10h4M15 10h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/>'),
	back: SVG(20, '<path d="M9 5l-5 5 5 5M4 10h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
	stop: SVG(20, '<rect x="5" y="5" width="10" height="10" rx="1.5" fill="currentColor"/>'),
	ok: SVG(20, '<path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
	star: SVG(20, '<path d="M10 2.2l2.4 5 5.4.7-3.9 3.8.9 5.4L10 14.5l-4.8 2.6.9-5.4L2.2 7.9l5.4-.7z" fill="currentColor"/>'),
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
		foot: SVG(16, '<path d="M3 14 L12.5 3.5" stroke="#d9c79a" stroke-width="1.6" stroke-linecap="round"/><path d="M11 2 L14.5 1.5 L14 5 Z" fill="#e8eef2"/>'),
		arch: SVG(16, '<path d="M5 1.5 Q14 8 5 14.5" fill="none" stroke="#c9a46a" stroke-width="1.6"/><path d="M5 1.5 V14.5" stroke="#eee" stroke-width=".8"/><path d="M2 8 H12" stroke="#ddd" stroke-width="1.2"/><path d="M12 6.5 L14.5 8 L12 9.5Z" fill="#eee"/>'),
		horse: SVG(16, '<path d="M3 14 L4 9 Q4 6 7 6 L9 3 L10.5 4.5 L13.5 5 L13 7 L10.5 7 L10.5 10 L12 14" fill="none" stroke="#d9c79a" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>'),
		siege: SVG(16, '<rect x="2" y="7" width="11" height="3.5" rx="1" fill="#a07a4a"/><path d="M13 8.7 H15" stroke="#ccc" stroke-width="2"/><circle cx="4.5" cy="12.5" r="1.6" fill="#ddd"/><circle cx="10.5" cy="12.5" r="1.6" fill="#ddd"/><path d="M3 7 L7.5 3 L12 7" fill="none" stroke="#d9c79a" stroke-width="1.3"/>'),
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
// The top: the tally (five counts, mute, pause, speed), then the strip (age, season, clock; idle; score). The bottom: People, then one column per job; Build swaps the row for the categories.
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
		`<div class="col join">${cell('id="tPeople" data-act="train:vil" aria-label="Train a villager"', ICON.people, wd('0/0', 'tPeopleN'))}${st('buildrow', ICON.hammer, 'Build', 'buildT')}</div>` + // one tap makes a villager; Build under it (Albert, Build 41)
		JOBS.map(
			(r) =>
				`<div class="col">${cell(`id="tj_${r}" data-act="job:${r}"`, `<span class="top">${ICON[r]}<span class="c" id="tn_${r}">0</span></span>`, wd(cap1(r)))}<div class="pm">${st('less:' + r, '−', 'One fewer on ' + r)}${st('move:' + r, '+', 'One more on ' + r)}</div></div>`,
		).join('');
	$('emgB').innerHTML = ICON.def;
	$('tkList').innerHTML = ICON.list;
	$('tkMin').innerHTML = ICON.up;
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
// ───────────────────────── Messages and tips ─────────────────────────
// quiet kinds (news, the spectacle's 'coming' lines) never take the line: they wait in the list and count on the bell (Albert: too many alerts to keep up with)
const QUIET = new Set(['news', 'soft']);
// ───────────────────────── How news reaches you (Build 59; TELL in 06, the Post line of research)
// You know what you see, what your people hear, and what a messenger brings. A line with a place (at) out of your sight is heard if it is a
// fight near your people (vague: which way), else carried by a messenger at a runner's or a rider's pace, if your post reaches that far;
// a line with no place happens at your court, or in the sky, and is first hand.
const DIR8 = ['east', 'south-east', 'south', 'south-west', 'west', 'north-west', 'north', 'north-east'];
function tell(text, cls, at) {
	if (!at || at.told || !G.fogOn || fogAt(at.x, at.y) === 2) return { now: true };
	const lvl = fxv(0, 'news').a,
		mine = (r) => G.blds.some((b) => b.owner === 0 && b.hp > 0 && Math.abs(b.x - at.x) < r && Math.abs(b.y - at.y) < r && dist(b, at) < r),
		k = keepOf(0);
	if (cls === 'warn') {
		const r = TELL.hear * (G.P[0].age >= 4 ? TELL.gun : 1);
		if (G.units.some((u) => u.owner === 0 && u.hp > 0 && Math.abs(u.x - at.x) < r && Math.abs(u.y - at.y) < r && dist(u, at) < r) || mine(r)) {
			const from = k || at,
				a = Math.round((Math.atan2(at.y - from.y, at.x - from.x) / (Math.PI / 4) + 8)) % 8;
			return { now: true, text: `Sounds of fighting to the ${DIR8[a]}.` };
		}
	}
	const need = mine(TELL.near) ? 1 : mine(TELL.far) ? 2 : G.blds.some((b) => b.hp > 0 && b.owner !== 0 && G.rel[0][b.owner] === 'ally' && dist(b, at) < TELL.near) ? 3 : 4;
	if (lvl < need || !k) return null; // no messenger serves that far: the court never hears of it
	return { delay: wayLen(k, at, 0) / (lvl >= 2 ? TELL.ride : TELL.foot) }; // the messenger rides the road, not the crow's line (Build 60: measured 15% longer at the median, up to 40%)
}
function postTick() {
	// the messengers arrive (once a second, from eventsTick)
	if (!G.post || !G.post.length) return;
	const due = G.post.filter((m) => m.t <= G.t);
	if (!due.length) return;
	G.post = G.post.filter((m) => m.t > G.t);
	for (const m of due) say(m.text, m.cls, m.secs, m.at, m.act, m.why ? m.why + ' · by messenger' : 'by messenger');
}
function say(text, cls, secs, at, act, why) {
	if (!G) return;
	{
		const N = tell(text, cls, at);
		if (!N) return;
		if (N.delay > 1) {
			(G.post || (G.post = [])).push({ t: G.t + N.delay, text, cls, secs, at: { x: at.x, y: at.y, told: 1 }, act, why });
			return;
		}
		if (N.text) {
			text = N.text;
			at = null;
		}
	}
	if (SET.msgs === false && cls !== 'warn' && cls !== 'tip') return;
	if (hushed(text)) return;
	if (cls === 'news' && SET.news === false) return; // Messages off: warnings only; a silenced kind stays quiet
	const same = G.log.find((m) => m.text === text && m.until > G.t);
	if (same) {
		same.until = G.t + (secs || 4);
		return;
	} // the same line never shows twice at once
	const quiet = QUIET.has(cls);
	G.log.unshift({
		text,
		cls,
		act,
		why, // a line under the message in the list: why it happened (Build 58)
		quiet,
		until: quiet ? G.t : G.t + (secs || 4),
		at: at ? { x: Math.round(at.x), y: Math.round(at.y) } : null,
	});
	G.log = G.log.slice(0, 5);
	if (SET.tkMin || G.card || quiet) {
		G.tkN = (G.tkN || 0) + 1;
		if (cls === 'warn') G.tkW = true;
	}
} // hidden: the bell in the strip counts what came
// The next useful step, read from your situation. One line, shown for six seconds, then at most one more every 45; a warning (starts with !) stays until fixed. Tap × to hide one.
// Silence: the bell on any message or tip mutes its kind (numbers ignored) until Unmute all; a warning comes back after 2 minutes, in case the danger is new
const hushKey = (t) => t.replace(/[\d,.]+/g, '#');
function hushed(t) {
	const k = hushKey(t),
		w = G.hushW && G.hushW[k];
	return !!(SET.hush && SET.hush[k]) || (w !== undefined && G.t < w);
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
	for (const k of ['f', 'w', 's', 'g', 'i']) {
		txt('r' + k, fmt(R[k]));
		const el = $('r' + k),
			net = netOf(p, k),
			cls = net > 0.5 ? 'up' : net < -0.5 ? (R[k] < -net * 2 ? 'low' : 'down') : '';
		if (el.dataset.h !== cls) {
			el.dataset.h = cls;
			el.className = 'wd' + (cls ? ' ' + cls : '');
		}
	} // the word's colour is the net flow of the last minute: rising, steady, falling, falling with under two minutes left (Build 58)
	const rank = 1 + G.P.filter((q) => q.id && q.id !== WILD && q.score.total > p.score.total).length;
	txt('scoreN', `★${fmt(p.score.total)}`);
	txt('scoreR', ['1st', '2nd', '3rd', '4th', '5th'][rank - 1] || rank + 'th');
	if (G.t - (G.rdyT ?? -9) > 1 || G.t < G.rdyT) {
		G.rdyT = G.t;
		G.rdy = new Map();
		for (const t of TECH) if (ownTech(t) && techState(t) === 'ready') G.rdy.set(t.at, (G.rdy.get(t.at) || 0) + 1);
		{
			const A = nextAge(0);
			if (A && !p.aging && keepOf(0) && afford(p, A.cost)) G.rdy.set('keep', (G.rdy.get('keep') || 0) + 1);
		}
	} // building kind → how many researches you can start there now
	let tip = SET.tips ? advise() : '';
	const urgent = tip[0] === '!';
	if (urgent) tip = tip.slice(1);
	const T = G.tipS || (G.tipS = { text: '', at: -99, last: -99 });
	if (tip !== T.text && (urgent || (G.t > 20 && G.t - T.last > 45))) {
		T.text = tip;
		T.at = G.t;
		if (tip) T.last = G.t;
	}
	const showTip = tip && T.text === tip && (urgent || G.t - T.at < 6) && !hushed(tip) && !G.card && !G.place && !G.over;
	if (showTip && (urgent || T.said !== T.text)) {
		T.said = T.text;
		say(tip, urgent ? 'warn' : 'tip', urgent ? 3 : 6);
	} // a warning is said again while it holds (the same line only stays up), a tip once   // a tip is a message like any other, in the ticker
	{
		const lim = MODES[G.mode].secs,
			clk = G.wonder
				? `wonder ${clock(Math.max(0, G.wonder.end - G.t))}`
				: lim
					? `${clock(Math.max(0, lim - G.t))}`
					: clock(G.t);
		let ready = 0;
		for (const v of G.rdy.values()) ready += v; // research you can start now (the age counts: it is research too)
		const idleN = unitsOf(0, 'vil').filter(freeVil).length,
			t1 = `${AGES[p.age].name} · ${SEASON_ICON[season().name]}${WX_ICON[G.wx] || ''}${G.night > 0.5 ? (moonLight() < 0.25 ? '🌑' : '🌙') : ''} ${clk}`;
		txt('sAgeT', t1);
		if ($('sIdle').hidden === !!idleN) $('sIdle').hidden = !idleN;
		const sol = armyOf(0).length,
			stat = (id, icon, n, show) => {
				const el = $(id),
					h = show ? icon + n : '';
				if (el.statH !== h) {
					el.statH = h;
					el.innerHTML = h;
				}
				if (el.hidden === !!show) el.hidden = !show;
			}; // the People card in numbers (Albert, Build 41)
		stat('sIdle', '<b>idle</b> ', idleN, idleN > 0);
		stat(
			'sStats',
			'',
			[
				ready ? `<span>${ICON.book}${ready}</span>` : '',
				`<span>${ICON.head}${popOf(0)}</span>`,
				sol ? `<span>${ICON.mil}${sol}</span>` : '',
			].join(''),
			true,
		);
		$('sAge').classList.toggle('glow', ready > 0 && !G.card);
	} // gold when the next age or any research is ready: tap it for everything you can research
	huddleUI();
	const V = unitsOf(0, 'vil');
	for (const r of JOBS) {
		let n = 0;
		for (const v of V) if (v.job === r) n++;
		txt('tn_' + r, String(n));
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
	$('buildT').classList.toggle('sel', !!(G.card && G.card.type === 'menu')); // one look for on: the outline, as the default job wears it
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
	tick();
	if (G.card) renderCard();
}
// The ticker: the newest live message, or the last one faded; paused says so when nothing newer is live. Tap the line to see where it happened
// (or, with nowhere to show, open the list); the list holds the last five, each with its bell to silence that kind; the arrow hides it all.
const linkOf = (m) => m && (m.act || (m.at ? `jump:${m.at.x},${m.at.y}` : ''));
// The alert bar, in SoRen's pattern: a sign, the name in bold, one line in italics, a ring and the seconds. It takes the ticker line while an event is coming
// (EV_WARN seconds, with how long it lasts) or running (what it does); a warning from the game still wins. Tap it to see where. The horde joins for its last 45 s.
function alertNow() {
	const I = G.incoming;
	if (I && !G.over)
		return {
			name: 'Attack',
			line: `${I.n} coming`,
			now: true,
			secs: 0,
			left: I.eta,
			total: 60,
			at: { x: I.x, y: I.y },
			hot: true,
		};
	const V = G.ev;
	if (!V || G.over) return null;
	const e = V.cur,
		k = e ? e.kind : V.warned,
		E = k && EVENTS[k];
	if (E) {
		const A = { name: E.name, line: EV_LINE[k], now: !!e, secs: E.secs };
		if (e)
			return {
				...A,
				left: e.until - G.t,
				total: E.secs,
				at:
					e.at || (e.units && e.units[0]) || (e.x !== undefined ? { x: e.x, y: e.y === undefined ? MID : e.y } : null),
			};
		return { ...A, left: V.next - G.t, total: EV_WARN, at: null };
	}
	const H = G.horde;
	if (H && H !== 'done' && H.said && H.at - G.t <= 45)
		return { name: 'Horde', line: EV_LINE.horde, now: false, secs: 0, left: H.at - G.t, total: 45, at: null };
	return null;
}
const RING = 50.27; // the circumference of the countdown ring (radius 8)
function alertHTML(A) {
	const left = Math.max(0, A.left),
		t = left < 60 ? `${Math.ceil(left)}s` : clock(left),
		f = clamp(left / A.total, 0, 1),
		line = A.now ? A.line : A.secs > 5 ? `coming, lasts ${A.secs}s` : 'is coming';
	return `<span class="al"><svg class="tri" viewBox="0 0 16 16"><path d="M8 1.5 L15 14 H1 Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 6 V9.6 M8 11.6 V12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><b>${A.name}</b><i>${line}</i><span class="cd"><svg class="ring" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/><circle class="v" cx="10" cy="10" r="8" style="stroke-dashoffset:${(RING * (1 - f)).toFixed(1)}"/></svg>${t}</span></span>`;
}
function tick() {
	const hide = !!SET.tkMin || !!G.card,
		live = G.log.find((m) => m.until > G.t),
		paused = G.paused && !(G.card && (G.card.type === 'resume' || G.card.type === 'setup')); // a card open is a moment of reading: the ticker steps aside, the bell counts
	$('stage').classList.toggle('tk', !hide);
	$('ticker').hidden = hide;
	$('tkBell').hidden = !hide;
	{
		const n = G.tkN || 0,
			bs = n + (G.tkW ? 'w' : '');
		if (!hide && tick.list !== bs) {
			tick.list = bs;
			$('tkList').innerHTML = ICON.list + (n ? `<span class="n">${n}</span>` : '');
			$('tkList').classList.toggle('warn', !!G.tkW);
		}
	} // the list button counts what waits quietly
	if (hide) {
		const n = G.tkN || 0,
			bs = n + (G.tkW ? 'w' : '');
		if (tick.bell !== bs) {
			tick.bell = bs;
			$('tkBell').innerHTML = ICON.bell + (n ? `<span>${n}</span>` : '');
			$('tkBell').classList.toggle('warn', !!G.tkW);
		}
		$('tkPop').hidden = true;
		tick.sig = '';
		return;
	}
	if ((G.tkN || G.tkW) && G.tkOpen) {
		G.tkN = 0;
		G.tkW = false;
		tick.bell = tick.list = '';
	} // the list opened: what was counted has been seen
	const A = !paused && !(live && live.cls === 'warn') ? alertNow() : null, // a live warning, or paused, comes before the alert bar
		m =
			paused && !(live && live.cls === 'warn')
				? { text: 'Paused · ▶ to carry on', cls: '' }
				: live || G.log.find((x) => !x.quiet),
		el = $('tkT'); // paused says so, unless a warning is up; a quiet line never takes the line
	if (A) {
		const h = alertHTML(A);
		if (tick.h !== h) {
			tick.h = h;
			el.innerHTML = h;
		}
		el.dataset.act = A.hot ? 'card:emergency' : A.at ? `jump:${Math.round(A.at.x)},${Math.round(A.at.y)}` : 'tklist';
		$('ticker').className = 'tick alert ' + (A.now ? 'now' : 'soon') + (A.hot ? ' hot' : '');
	} else {
		tick.h = '';
		txt('tkT', m ? m.text : '');
		el.dataset.act = linkOf(live) || 'tklist';
		$('ticker').className = 'tick ' + (m && m === live ? live.cls || '' : m && !G.log.includes(m) ? '' : 'old');
	}
	const pop =
		G.tkOpen && G.log.length
			? G.log
					.map(
						(x) =>
							`<div class="row ${x.cls || ''}"><button class="t" data-act="${linkOf(x) || 'tklist'}">${x.text}${x.why ? `<small class="why">${x.why}</small>` : ''}</button><button class="h" data-act="hush:${encodeURIComponent(x.text)}" aria-label="Silence this kind of message">${ICON.hush}</button></div>`,
					)
					.join('') +
				`<div class="row end"><button class="t" data-act="tkclear">Clear all</button><button class="h" data-act="tklist" aria-label="Close the list">✕</button></div>`
			: '';
	if (pop !== tick.sig) {
		tick.sig = pop;
		$('tkPop').innerHTML = pop;
		$('tkPop').hidden = !pop;
	}
}
