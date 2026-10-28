// ═════ 18-sound.js ═════
// ───────────────────────── Sound ─────────────────────────
// Made in the phone from tones and noise: no files, nothing downloaded. Quieter toward the edge of the screen; nothing from off screen.
const SND = { get on() { return SET.sound; }, set on(v) { SET.sound = v; }, get vol() { return SET.vol; }, set vol(v) { SET.vol = v; } };
function saveSnd() { saveSet(); if (master) master.gain.value = SND.vol * 0.5; }
let AC = null, master = null, NOISE = null, voices = 0, panV = 0; const sfxLast = {};
// to the speakers; a sound from the left or right of the screen comes from that side
function sink(gn) { if (panV && AC.createStereoPanner) { const p = AC.createStereoPanner(); p.pan.value = panV; gn.connect(p); p.connect(master); } else gn.connect(master); }
function sndInit() {
  if (AC) { if (AC.state !== 'running') AC.resume().catch(() => {}); return; }   // iPhone leaves audio 'interrupted' after a call, a lock or another app: wake it on the next tap
  try { if (navigator.audioSession) navigator.audioSession.type = 'ambient'; } catch (e) {}   // iPhone: the mute switch silences the game
  try {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    AC = new C(); master = AC.createGain(); master.gain.value = SND.vol * 0.5;
    { const L = AC.createDynamicsCompressor(); L.threshold.value = -3; L.knee.value = 10; L.ratio.value = 4; L.attack.value = 0.005; L.release.value = 0.25; master.connect(L); L.connect(AC.destination); }   // a limiter: a battle's many hits never clip a phone speaker
    NOISE = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = NOISE.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (AC.state !== 'running') AC.resume().catch(() => {});
  } catch (e) { AC = null; }
}
function tone(f, dur, type, vol, f2, at) {
  const t0 = AC.currentTime + (at || 0), o = AC.createOscillator(), gn = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  gn.gain.setValueAtTime(0.0001, t0); gn.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.01); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(gn); sink(gn); o.start(t0); o.stop(t0 + dur + 0.03); voices++; o.onended = () => { voices--; };
}
function hiss(dur, vol, fq, q, fq2, at) {
  const t0 = AC.currentTime + (at || 0), s = AC.createBufferSource(), f = AC.createBiquadFilter(), gn = AC.createGain();
  s.buffer = NOISE; s.loop = true; f.type = 'bandpass'; f.Q.value = q || 1; f.frequency.setValueAtTime(fq, t0); if (fq2) f.frequency.exponentialRampToValueAtTime(fq2, t0 + dur);
  gn.gain.setValueAtTime(0.0001, t0); gn.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.01); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f); f.connect(gn); sink(gn); s.start(t0); s.stop(t0 + dur + 0.03); voices++; s.onended = () => { voices--; };
}
// name: [least seconds between two, how to make it (v = loudness 0 to 1)]
const SFX = {
  tap:    [0.03, v => tone(700, 0.05, 'triangle', 0.16 * v)],
  err:    [0.2, v => { tone(180, 0.12, 'square', 0.1 * v); tone(140, 0.14, 'square', 0.1 * v, 0, 0.09); }],
  place:  [0.1, v => { hiss(0.08, 0.3 * v, 500, 1); tone(120, 0.1, 'sine', 0.3 * v, 70); }],
  hammer: [0.25, v => { hiss(0.04, 0.3 * v, 2200, 3); tone(900, 0.05, 'square', 0.06 * v, 500); }],
  done:   [0.2, v => { hiss(0.06, 0.25 * v, 900, 2); tone(220, 0.12, 'triangle', 0.22 * v, 160); tone(330, 0.3, 'triangle', 0.18 * v, 0, 0.12); }],   // a home or a field: a wooden knock, warm
  doneWar:[0.2, v => { hiss(0.08, 0.35 * v, 180, 1, 90); tone(80, 0.25, 'sine', 0.35 * v, 55); tone(196, 0.5, 'sawtooth', 0.09 * v, 220, 0.2); tone(262, 0.6, 'sawtooth', 0.09 * v, 294, 0.45); }],   // a place of war: a drum, then a horn
  ready:  [0.34, v => { tone(440, 0.08, 'sine', 0.2 * v); tone(587, 0.14, 'sine', 0.2 * v, 0, 0.08); }],   // a villager: a light chime
  readySol:[0.34, v => { tone(294, 0.12, 'sawtooth', 0.08 * v); tone(392, 0.12, 'sawtooth', 0.08 * v, 0, 0.11); tone(440, 0.3, 'sawtooth', 0.09 * v, 0, 0.22); }],   // a soldier: a short brass call
  chop:   [0.18, v => { hiss(0.05, 0.22 * v, 1800, 2); tone(220, 0.06, 'triangle', 0.14 * v, 120); }],
  mine:   [0.18, v => { tone(1400, 0.05, 'square', 0.05 * v, 900); hiss(0.04, 0.2 * v, 4000, 2); }],
  pick:   [0.3, v => tone(520, 0.05, 'sine', 0.07 * v, 700)],
  hit:    [0.07, v => { hiss(0.05, 0.28 * v, 900, 1); tone(160, 0.06, 'sawtooth', 0.12 * v, 90); }],
  shot:   [0.12, v => { hiss(0.16, 0.5 * v, 900, 1, 200); tone(120, 0.16, 'sawtooth', 0.26 * v, 50); }],
  boom:   [0.25, v => { hiss(0.55, 0.6 * v, 320, 0.8, 80); tone(62, 0.5, 'sawtooth', 0.36 * v, 30); }],
  arrow:  [0.07, v => hiss(0.12, 0.2 * v, 3000, 2, 1200)],
  bhit:   [0.1, v => { tone(90, 0.12, 'triangle', 0.3 * v, 60); hiss(0.08, 0.2 * v, 300, 1); }],
  crash:  [0.3, v => { hiss(0.7, 0.45 * v, 400, 0.7, 100); tone(70, 0.5, 'sawtooth', 0.22 * v, 35); }],
  horn:   [8, v => { tone(196, 0.35, 'sawtooth', 0.1 * v, 220); tone(220, 0.55, 'sawtooth', 0.1 * v, 262, 0.35); tone(98, 0.9, 'triangle', 0.2 * v); }],
  age:    [1, v => { [523, 659, 784, 1047].forEach((f, i) => { panV = (i - 1.5) * 0.45; tone(f, 0.3, 'triangle', 0.22 * v, 0, i * 0.14); }); panV = 0; }],   // the chord spreads across the ears
  coin:   [0.1, v => { tone(1319, 0.07, 'square', 0.08 * v); tone(1760, 0.2, 'square', 0.08 * v, 0, 0.07); }],
  win:    [1, v => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.4, 'triangle', 0.22 * v, 0, i * 0.16))],
  lose:   [1, v => [392, 349, 311, 262].forEach((f, i) => tone(f, 0.55, 'triangle', 0.22 * v, 0, i * 0.3))],
  bird:   [1, v => { tone(2600, 0.07, 'sine', 0.04 * v, 3400); tone(3000, 0.08, 'sine', 0.04 * v, 3600, 0.12); }],
  cricket:[1, v => { for (let i = 0; i < 4; i++) tone(4300, 0.03, 'square', 0.012 * v, 0, i * 0.06); }],
  zeal:   [2, v => { tone(262, 0.5, 'triangle', 0.18 * v, 523); tone(392, 0.5, 'sine', 0.12 * v, 784, 0.1); hiss(0.4, 0.1 * v, 2000, 1, 5000); }],
  wind:   [4, v => hiss(2.4, 0.08 * v, 500, 0.6, 280)],
  thunder:[0.5, (v, at) => { hiss(0.12, 0.5 * v, 2500, 0.8, 600, at); hiss(2.2, 0.4 * v, 160, 0.5, 50, at + 0.05); tone(45, 1.8, 'sine', 0.25 * v, 30, at); }],
};
// which of the three volumes each sound belongs to (everything else is an effect)
const CHAN = { bird: 'amb', cricket: 'amb', wind: 'amb', thunder: 'amb', horn: 'alert', age: 'alert', win: 'alert', lose: 'alert', done: 'alert', doneWar: 'alert', readySol: 'alert', ready: 'alert', zeal: 'alert', coin: 'alert' };
const chanVol = name => SET.mix[CHAN[name] || 'fx'];
function sfx(name, x, y) {
  if (HAPTIC[name] && (x === undefined || onScreen(x, y))) feel(HAPTIC[name]);
  if (!SND.on || !AC || AC.state !== 'running' || document.hidden || voices > 14) return;
  const S = SFX[name]; if (!S) return;
  const now = AC.currentTime; if (now - (sfxLast[name] ?? -9) < S[0]) return;
  let v = chanVol(name); if (!v) return;
  if (x !== undefined) { const R = hyp(cw, ch) / 2 / cam.z, d = hyp(x - cam.x, y - cam.y); if (d > R * 1.1) return; v *= clamp(1.1 - d / (R * 1.1), 0.15, 1); }
  panV = x === undefined ? 0 : clamp((x - cam.x) / (cw / 2 / cam.z), -1, 1) * 0.8;
  sfxLast[name] = now; S[1](v); panV = 0;
}
let ambT = 0;
function ambience(dt) { ambT -= dt; if (ambT > 0 || !AC) return; ambT = 2.5 + Math.random() * 4; sfx(G.night > 0.5 ? 'cricket' : season().name === 'Winter' ? 'wind' : 'bird'); }


// Thunder comes after the flash by the real delay: sound covers about 340 m a second (a world unit is about 0.14 m), so it is quieter and later the farther away.
function thunder(x, y) {
  if (!SND.on || !AC || AC.state !== 'running' || document.hidden) return;
  const d = hyp(x - cam.x, y - cam.y), v = clamp(1.1 - d / 1400, 0.12, 1) * chanVol('thunder'); if (!v) return; panV = clamp((x - cam.x) / (cw / 2 / cam.z), -1, 1) * 0.6; SFX.thunder[1](v, d * 0.14 / 340); panV = 0;
}
// ── Touch you can feel: one table of felt events, three strengths, never more often than every 50 ms.
// In the native app the Haptics plugin fills NATIVE (Apple's taptic engine); in a browser, vibrate where the phone allows it (iPhone Safari cannot).
const NATIVE = { haptics: () => window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics };
const FEEL = { tick: ['LIGHT', 8], snap: ['MEDIUM', 15], thock: ['HEAVY', 25], crack: ['HEAVY', [30, 40, 20]] };
const HAPTIC = { place: 'snap', done: 'thock', doneWar: 'thock', ready: 'tick', readySol: 'tick', horn: 'crack', crash: 'crack', thunder: 'crack', err: 'tick' };   // which sound is also felt
let feltT = 0;
function feel(kind) {
  if (!SET.vibe || !FEEL[kind]) return; const now = performance.now(); if (now - feltT < 50) return; feltT = now;
  try { const H = NATIVE.haptics(); if (H) H.impact({ style: FEEL[kind][0] }).catch(() => {}); else if (navigator.vibrate) navigator.vibrate(FEEL[kind][1]); } catch (e) {}
}
const onScreen = (x, y) => Math.abs(x - cam.x) < cw / 2 / cam.z && Math.abs(y - cam.y) < ch / 2 / (cam.z * TILT);
