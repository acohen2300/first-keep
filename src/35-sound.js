// ═════ 35-sound.js: sound and haptics ═════
// ───────────────────────── Sound ─────────────────────────
// Made in the phone from tones and noise: no files, nothing downloaded. Quieter toward the edge of the screen; nothing from off screen.
const SND = {
	get on() {
		return SET.sound;
	},
	set on(v) {
		SET.sound = v;
	},
	get vol() {
		return SET.vol;
	},
	set vol(v) {
		SET.vol = v;
	},
};
function saveSnd() {
	saveSet();
	if (master) master.gain.value = SND.vol * 0.5;
}
let AC = null,
	master = null,
	NOISE = null,
	voices = 0,
	panV = 0;
const sfxLast = {};
// to the speakers; a sound from the left or right of the screen comes from that side
function sink(gn) {
	if (panV && AC.createStereoPanner) {
		const p = AC.createStereoPanner();
		p.pan.value = panV;
		gn.connect(p);
		p.connect(master);
	} else gn.connect(master);
}
function sndInit() {
	if (AC) {
		if (AC.state !== 'running') AC.resume().catch(() => {});
		return;
	} // iPhone leaves audio 'interrupted' after a call, a lock or another app: wake it on the next tap
	try {
		if (navigator.audioSession) navigator.audioSession.type = 'ambient';
	} catch (e) {} // iPhone: the mute switch silences the game
	try {
		const C = window.AudioContext || window.webkitAudioContext;
		if (!C) return;
		AC = new C();
		master = AC.createGain();
		master.gain.value = SND.vol * 0.5;
		{
			const L = AC.createDynamicsCompressor();
			L.threshold.value = -3;
			L.knee.value = 10;
			L.ratio.value = 4;
			L.attack.value = 0.005;
			L.release.value = 0.25;
			master.connect(L);
			L.connect(AC.destination);
		} // a limiter: a battle's many hits never clip a phone speaker
		NOISE = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
		const d = NOISE.getChannelData(0);
		for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
		if (AC.state !== 'running') AC.resume().catch(() => {});
	} catch (e) {
		AC = null;
	}
}
function tone(f, dur, type, vol, f2, at) {
	const t0 = AC.currentTime + (at || 0),
		o = AC.createOscillator(),
		gn = AC.createGain();
	o.type = type;
	o.frequency.setValueAtTime(f, t0);
	if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
	gn.gain.setValueAtTime(0.0001, t0);
	gn.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.01);
	gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
	o.connect(gn);
	sink(gn);
	o.start(t0);
	o.stop(t0 + dur + 0.03);
	voices++;
	o.onended = () => {
		voices--;
	};
}
function hiss(dur, vol, fq, q, fq2, at) {
	const t0 = AC.currentTime + (at || 0),
		s = AC.createBufferSource(),
		f = AC.createBiquadFilter(),
		gn = AC.createGain();
	s.buffer = NOISE;
	s.loop = true;
	f.type = 'bandpass';
	f.Q.value = q || 1;
	f.frequency.setValueAtTime(fq, t0);
	if (fq2) f.frequency.exponentialRampToValueAtTime(fq2, t0 + dur);
	gn.gain.setValueAtTime(0.0001, t0);
	gn.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.01);
	gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
	s.connect(f);
	f.connect(gn);
	sink(gn);
	s.start(t0);
	s.stop(t0 + dur + 0.03);
	voices++;
	s.onended = () => {
		voices--;
	};
}
// name: [least seconds between two, how to make it (v = loudness 0 to 1)]
// ── Materials (Build 56, after SoRen): what a struck thing is made of is told mostly by how long it rings (Klatzky, Pai & Krotkov 2000):
// each mode of a struck bar dies with a time constant of tau / f seconds, so wood is gone in a blink, stone is short and dull, metal rings on.
// The modes of a free bar sit at 1 : 2.756 : 5.404 (Rossing). One knock() makes every blow, chop, pick and clink from this table.
const MAT = {
	wood: {
		tau: 3.2,
		modes: [
			[1, 1],
			[2.756, 0.25],
		],
	},
	stone: {
		tau: 12,
		modes: [
			[1, 1],
			[2.756, 0.35],
			[5.404, 0.12],
		],
	},
	metal: {
		tau: 447,
		modes: [
			[1, 1],
			[2.756, 0.5],
			[5.404, 0.3],
		],
	},
};
function knock(mat, f, vol, at = 0, snap = 1) {
	const M = MAT[mat];
	if (snap) hiss(0.03, 0.2 * vol * snap, Math.min(6000, f * 6), 2, undefined, at); // the blow itself: a short burst of noise
	for (const [k, a] of M.modes) {
		const fk = f * k,
			dur = Math.min(1.2, (9.2 * M.tau) / fk); // to 80 dB down (e^−9.2)
		tone(fk, Math.max(0.04, dur), mat === 'metal' ? 'sine' : 'triangle', vol * a * 0.5, 0, at);
	}
}
const SFX = {
	tap: [0.03, (v) => tone(700, 0.05, 'triangle', 0.16 * v)],
	err: [
		0.2,
		(v) => {
			tone(180, 0.12, 'square', 0.1 * v);
			tone(140, 0.14, 'square', 0.1 * v, 0, 0.09);
		},
	],
	place: [
		0.1,
		(v) => {
			hiss(0.08, 0.3 * v, 500, 1);
			tone(120, 0.1, 'sine', 0.3 * v, 70);
		},
	],
	hammer: [
		0.25,
		(v) => {
			hiss(0.04, 0.3 * v, 2200, 3);
			tone(900, 0.05, 'square', 0.06 * v, 500);
		},
	],
	done: [
		0.2,
		(v) => {
			knock('wood', 220, 0.4 * v);
			knock('wood', 330, 0.3 * v, 0.12, 0.5);
		},
	], // a home or a field: two wooden knocks, warm
	doneWar: [
		0.2,
		(v) => {
			hiss(0.08, 0.35 * v, 180, 1, 90);
			tone(80, 0.25, 'sine', 0.35 * v, 55);
			tone(196, 0.5, 'sawtooth', 0.09 * v, 220, 0.2);
			tone(262, 0.6, 'sawtooth', 0.09 * v, 294, 0.45);
		},
	], // a place of war: a drum, then a horn
	ready: [
		0.34,
		(v) => {
			tone(440, 0.08, 'sine', 0.2 * v);
			tone(587, 0.14, 'sine', 0.2 * v, 0, 0.08);
		},
	], // a villager: a light chime
	readySol: [
		0.34,
		(v) => {
			tone(294, 0.12, 'sawtooth', 0.08 * v);
			tone(392, 0.12, 'sawtooth', 0.08 * v, 0, 0.11);
			tone(440, 0.3, 'sawtooth', 0.09 * v, 0, 0.22);
		},
	], // a soldier: a short brass call
	chop: [0.18, (v) => knock('wood', 220, 0.3 * v)], // an axe in a trunk
	mine: [0.18, (v) => knock('stone', 1400, 0.12 * v)], // a pick on rock
	pick: [0.3, (v) => tone(520, 0.05, 'sine', 0.07 * v, 700)],
	// a unit picked answers in its material (Build 58): a villager's tool creaks (wood), a blade clinks (metal), a bowstring twangs
	// (a plucked string: the fundamental and its harmonics, short), a rider's horse stamps twice (two dull thuds)
	pickWood: [0.15, (v) => knock('wood', 330, 0.18 * v, 0, 0.6)],
	pickMetal: [0.15, (v) => knock('metal', 1800, 0.08 * v, 0, 0.4)],
	pickTwang: [0.15, (v) => [1, 2, 3].forEach((k) => tone(180 * k, 0.18 / k, 'triangle', (0.12 * v) / k))],
	pickHoof: [0.15, (v) => [0, 0.11].forEach((at) => knock('wood', 90, 0.22 * v, at, 0.3))],
	hit: [
		0.07,
		(v) => {
			hiss(0.05, 0.28 * v, 900, 1);
			tone(160, 0.06, 'sawtooth', 0.12 * v, 90);
		},
	],
	shot: [
		0.12,
		(v) => {
			hiss(0.16, 0.5 * v, 900, 1, 200);
			tone(120, 0.16, 'sawtooth', 0.26 * v, 50);
		},
	],
	boom: [
		0.25,
		(v) => {
			hiss(0.55, 0.6 * v, 320, 0.8, 80);
			tone(62, 0.5, 'sawtooth', 0.36 * v, 30);
		},
	],
	arrow: [0.07, (v) => hiss(0.12, 0.2 * v, 3000, 2, 1200)],
	bhit: [
		0.1,
		(v) => {
			tone(90, 0.12, 'triangle', 0.3 * v, 60);
			hiss(0.08, 0.2 * v, 300, 1);
		},
	],
	crash: [
		0.3,
		(v) => {
			hiss(0.7, 0.45 * v, 400, 0.7, 100);
			tone(70, 0.5, 'sawtooth', 0.22 * v, 35);
		},
	],
	horn: [
		8,
		(v) => {
			tone(196, 0.35, 'sawtooth', 0.1 * v, 220);
			tone(220, 0.55, 'sawtooth', 0.1 * v, 262, 0.35);
			tone(98, 0.9, 'triangle', 0.2 * v);
		},
	],
	age: [
		1,
		(v) => {
			[523, 659, 784, 1047].forEach((f, i) => {
				panV = (i - 1.5) * 0.45;
				tone(f, 0.3, 'triangle', 0.22 * v, 0, i * 0.14);
			});
			panV = 0;
		},
	], // the chord spreads across the ears
	coin: [
		0.1,
		(v) => {
			knock('metal', 1319, 0.08 * v, 0, 0.3);
			knock('metal', 1760, 0.08 * v, 0.07, 0);
		},
	], // two coins: metal rings
	tribute: [
		3,
		(v) => {
			tone(523, 0.45, 'sine', 0.1 * v);
			tone(784, 0.6, 'sine', 0.08 * v, 0, 0.12);
		},
	], // gold that comes from anything but your own mint: a soft bell, lower and longer than the mint's coin
	win: [1, (v) => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.4, 'triangle', 0.22 * v, 0, i * 0.16))],
	lose: [1, (v) => [392, 349, 311, 262].forEach((f, i) => tone(f, 0.55, 'triangle', 0.22 * v, 0, i * 0.3))],
	bird: [
		1,
		(v) => {
			tone(2600, 0.07, 'sine', 0.04 * v, 3400);
			tone(3000, 0.08, 'sine', 0.04 * v, 3600, 0.12);
		},
	],
	cricket: [
		1,
		(v) => {
			for (let i = 0; i < 4; i++) tone(4300, 0.03, 'square', 0.012 * v, 0, i * 0.06);
		},
	],
	zeal: [
		2,
		(v) => {
			tone(262, 0.5, 'triangle', 0.18 * v, 523);
			tone(392, 0.5, 'sine', 0.12 * v, 784, 0.1);
			hiss(0.4, 0.1 * v, 2000, 1, 5000);
		},
	],
	wind: [4, (v) => hiss(2.4, 0.08 * v, 500, 0.6, 280)],
	hush: [
		5,
		(v) => {
			hiss(3, 0.06 * v, 300, 0.5, 120);
			tone(110, 2.5, 'sine', 0.08 * v, 55);
		},
	], // an eclipse: the wind drops and a low note holds
	hooves: [
		1,
		(v) => {
			for (let i = 0; i < 8; i++) {
				tone(70, 0.08, 'sine', 0.3 * v, 40, i * 0.11 + (i % 3) * 0.02);
				hiss(0.05, 0.18 * v, 400, 1, 200, i * 0.11);
			}
		},
	], // a stampede: a rolling drum of hooves
	rumble: [
		1.5,
		(v) => {
			tone(38, 1.6, 'sine', 0.4 * v, 28);
			hiss(1.4, 0.3 * v, 120, 0.6, 60);
		},
	], // the ground
	jingle: [2, (v) => [784, 988, 1175, 988, 1319].forEach((f, i) => tone(f, 0.12, 'triangle', 0.1 * v, 0, i * 0.1))], // a travelling show
	roar: [
		4,
		(v) => {
			tone(90, 0.9, 'sawtooth', 0.14 * v, 60);
			hiss(0.9, 0.3 * v, 500, 0.8, 150);
		},
	],
	thunder: [
		0.5,
		(v, at) => {
			hiss(0.12, 0.5 * v, 2500, 0.8, 600, at);
			hiss(2.2, 0.4 * v, 160, 0.5, 50, at + 0.05);
			tone(45, 1.8, 'sine', 0.25 * v, 30, at);
		},
	],
};
// which of the three volumes each sound belongs to (everything else is an effect)
const CHAN = {
	bird: 'amb',
	cricket: 'amb',
	wind: 'amb',
	thunder: 'amb',
	hush: 'amb',
	hooves: 'amb',
	rumble: 'amb',
	jingle: 'alert',
	roar: 'alert',
	horn: 'alert',
	age: 'alert',
	win: 'alert',
	lose: 'alert',
	done: 'alert',
	doneWar: 'alert',
	readySol: 'alert',
	ready: 'alert',
	zeal: 'alert',
	coin: 'alert',
	tribute: 'alert',
};
const chanVol = (name) => SET.mix[CHAN[name] || 'fx'];
// the voices are few (14): an alert always has one; ambience and effects give way when the air is full (Build 63: a bird could take the horn's voice)
const VOICES = { max: 14, keep: { alert: 0, fx: 2, amb: 5 } };
function sfx(name, x, y) {
	if (HAPTIC[name] && (x === undefined || onScreen(x, y))) feel(HAPTIC[name]);
	if (
		!SND.on ||
		!AC ||
		AC.state !== 'running' ||
		document.hidden ||
		voices > VOICES.max - VOICES.keep[CHAN[name] || 'fx']
	)
		return;
	const S = SFX[name];
	if (!S) return;
	const now = AC.currentTime;
	if (now - (sfxLast[name] ?? -9) < S[0]) return;
	let v = chanVol(name);
	if (!v) return;
	if (x !== undefined) {
		const h = hearing(hyp(x - cam.x, y - cam.y));
		if (h < SOUND.floor) return;
		v *= h;
	}
	panV = x === undefined ? 0 : clamp((x - cam.x) / (cw / 2 / cam.z), -1, 1) * 0.8;
	sfxLast[name] = now;
	S[1](v);
	panV = 0;
}
// how loud a sound at distance d (world units) reaches the ear over the screen's middle: ISO 9613-2 (SOUND), as a share of full
const hearing = (d) => {
	const d0 = (hyp(cw, ch) / 2 / cam.z) * SOUND.d0;
	return Math.min(1, d0 / Math.max(1, d)) * 10 ** ((-SOUND.alphaKm * d * SOUND.metre) / 1000 / 20);
};
let ambT = 0;
function ambience(dt) {
	ambT -= dt;
	if (ambT > 0 || !AC) return;
	ambT = 2.5 + Math.random() * 4;
	sfx(G.night > 0.5 ? 'cricket' : season().name === 'Winter' ? 'wind' : 'bird');
}

// Thunder comes after the flash by the real delay (SOUND.c over SOUND.metre), quieter by the same law as every sound; a strike is loud enough to carry the map
function thunder(x, y) {
	if (!SND.on || !AC || AC.state !== 'running' || document.hidden) return;
	const d = hyp(x - cam.x, y - cam.y),
		v = Math.max(SOUND.floor * 4, hearing(d / 4)) * chanVol('thunder');
	if (!v) return;
	panV = clamp((x - cam.x) / (cw / 2 / cam.z), -1, 1) * 0.6;
	SFX.thunder[1](v, (d * SOUND.metre) / SOUND.c);
	panV = 0;
}
// ── Touch you can feel: one table of felt events, three strengths, never more often than every 50 ms.
// In the native app the Haptics plugin fills APP (Apple's taptic engine); in a browser, vibrate where the phone allows it (iPhone Safari cannot).
const APP = { haptics: () => window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics };
const FEEL = { tick: ['LIGHT', 8], snap: ['MEDIUM', 15], thock: ['HEAVY', 25], crack: ['HEAVY', [30, 40, 20]] };
const HAPTIC = {
	pickWood: 'tick',
	pickMetal: 'tick',
	pickTwang: 'tick',
	pickHoof: 'tick',
	place: 'snap',
	done: 'thock',
	doneWar: 'thock',
	rumble: 'crack',
	hooves: 'thock',
	ready: 'tick',
	readySol: 'tick',
	horn: 'crack',
	crash: 'crack',
	thunder: 'crack',
	err: 'tick',
}; // which sound is also felt
let feltT = 0;
function feel(kind) {
	if (!SET.vibe || !FEEL[kind]) return;
	const now = performance.now();
	if (now - feltT < 50) return;
	feltT = now;
	try {
		const H = APP.haptics();
		if (H) H.impact({ style: FEEL[kind][0] }).catch(() => {});
		else if (navigator.vibrate) navigator.vibrate(FEEL[kind][1]);
	} catch (e) {}
}
const onScreen = (x, y) => Math.abs(x - cam.x) < cw / 2 / cam.z && Math.abs(y - cam.y) < ch / 2 / (cam.z * TILT);
