'use strict';
// First Keep v100 · sound.js (beside the stack): one player for every recipe in books/sound.js (H). Lives alone; hears the world only through FK's 'event' hook.
// The ear is the camera, at a height (QAX); a struck thing rings by its material (QAY); snow lowers the air's top and rain masks the quiet (QBX). No sound is typed here.
window.SOUND = (() => {
const { HB, D, SH, KIND, cam } = FK;
let AC = null, master = null, air = null, NOISE = null, voices = 0, on = true, ambT = 0;
const mix = Object.fromEntries(Object.keys(HB.mix.names).map((c) => [c, [...HB.mix.steps]])); // each channel's volume steps, the one in use first (HX10)
const last = {}, chan = (n) => (HB.chan.amb.includes(n) ? 'amb' : HB.chan.alert.includes(n) ? 'alert' : 'fx');
function wake() { // a phone opens its audio only on a touch
  if (AC) { if (AC.state !== 'running') AC.resume().catch(() => {}); return; }
  try { if (navigator.audioSession) navigator.audioSession.type = HB.session; } catch (e) {} // the Ring/Silent switch silences the game; the player's music plays on (HX8)
  try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  const lim = AC.createDynamicsCompressor(); for (const [k, v] of Object.entries(HB.limiter)) lim[k].value = v; lim.connect(AC.destination); // a battle's many blows never clip a phone speaker
  air = AC.createBiquadFilter(); air.type = 'lowpass'; air.frequency.value = HB.muffle.open; air.connect(lim);
  master = AC.createGain(); master.gain.value = 0.5; master.connect(air);
  NOISE = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = NOISE.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}
addEventListener('pointerdown', wake, { passive: true });
function out(gn, pan) { if (pan && AC.createStereoPanner) { const p = AC.createStereoPanner(); p.pan.value = pan; gn.connect(p); p.connect(master); } else gn.connect(master); }
function env(gn, t0, vol, dur) { gn.gain.setValueAtTime(0.0001, t0); gn.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.01); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); }
function tone(at, pan, f, dur, wave, vol, f2, start = 0, p2 = 0) { const t0 = at + start, o = AC.createOscillator(), gn = AC.createGain(); o.type = wave; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur); env(gn, t0, vol, dur); o.connect(gn); out(gn, p2 || pan); o.start(t0); o.stop(t0 + dur + 0.03); voices++; o.onended = () => voices--; }
function hiss(at, pan, dur, vol, fq, q, f2, start = 0) { const t0 = at + start, s = AC.createBufferSource(), f = AC.createBiquadFilter(), gn = AC.createGain(); s.buffer = NOISE; s.loop = true; f.type = 'bandpass'; f.Q.value = q || 1; f.frequency.setValueAtTime(fq, t0); if (f2) f.frequency.exponentialRampToValueAtTime(f2, t0 + dur); env(gn, t0, vol, dur); s.connect(f); f.connect(gn); out(gn, pan); s.start(t0); s.stop(t0 + dur + 0.03); voices++; s.onended = () => voices--; }
function knock(at, pan, mat, f, vol, start = 0, snap = 1) { const M = HB[mat]; if (snap) hiss(at, pan, 0.03, 0.2 * vol * snap, Math.min(6000, f * 6), 2, 0, start); // QAY: each mode dies with time constant tau ÷ Hz, to 80 dB down
  for (const [k, a] of M.modes) tone(at, pan, f * k, Math.max(0.04, Math.min(1.2, (9.2 * M.tau) / (f * k))), mat === 'metal' ? 'sine' : 'triangle', vol * a * 0.5, 0, start); }
const PART = { tone, hiss, knock };
// QAX: the ear sits over the screen's middle at the height a lens of HX1's field of view needs to see the screen; a sound d along the ground is √(d² + h²) away,
// full within the closest zoom's height, then falling as 1 ÷ distance (the inverse-square law in amplitude), less the air's loss
const camH = (z) => FK.size()[0] / z / 2 / Math.tan((HB.ear.fov * Math.PI) / 360) / D.upm; // metres
function hearing(w, name) { const dx = w.vx - cam.x, dy = (w.vy - cam.y) / Math.sin(FK.A.rise * Math.PI / 180), d = Math.hypot(dx, dy) / D.upm, s = Math.hypot(d, camH(cam.z)), d0 = HB.reach[name] ? HB.ear.floor * HB.reach[name] : camH(FK.zmax()); // QBY: a sound with a reach is full within floor × reach
  return { v: Math.min(1, d0 / Math.max(0.1, s)) * 10 ** ((-HB.ear.alphaKm * s) / 1000 / 20), s, pan: Math.max(-1, Math.min(1, dx / (FK.size()[0] / 2 / cam.z))) * 0.8 }; }
function play(name, where, delay = 0) {
  const r = HB[name]; if (!on || !AC || AC.state !== 'running' || document.hidden || !r) return;
  const c = chan(name); if (c !== 'alert' && voices > HB.voices.max - HB.voices.keep[c]) return; // the air is full: an alert never waits
  if (AC.currentTime - (last[name] ?? -9) < r[0]) return;
  let v = 1, pan = 0;
  if (where && where.vx != null) { const h = hearing(where, name); v = h.v; pan = h.pan; if (name === 'thunder') delay += h.s / HB.ear.c; } // thunder comes after its flash by the distance ÷ the speed of sound
  v -= HB.muffle.rainMask * FK.K.rain * (1 - v); if (v < HB.ear.floor) return; // QBX: rain drowns the far and quiet first
  const [[vol]] = mix[c]; v *= vol; if (!v) return; // the player's volume for this channel
  last[name] = AC.currentTime; const at = AC.currentTime + delay;
  for (const [kind, ...a] of r.slice(1)) { if (kind === 'tone') a[3] *= v; else if (kind === 'hiss') a[1] *= v; else a[2] *= v; PART[kind](at, pan, ...a); }
}
FK.on('event', (name, t, u) => {
  const s = name === 'work' ? t && t.kind !== 'bld' && SH[KIND[t.kind].code].sound : name === 'pick' ? t && SH[t.code].voice : HB.on[name];
  if (s) play(s, t || u);
  const ms = HB.haptic[name]; if (ms && navigator.vibrate && on) try { navigator.vibrate(ms); } catch (e) {}
});
// ambience as events: a bird from a tree in view by day, a cricket in the dark, never in winter; when one sings is a Poisson process (HX4)
FK.on('tick', (dt) => { if (!AC || (ambT -= dt) > 0) return; ambT = 1;
  const share = Math.min(1, FK.K.snow / 5); air.frequency.setTargetAtTime(HB.muffle.open * (HB.muffle.snow / HB.muffle.open) ** share, AC.currentTime, 2); // QBX: the air's top falls with snow cover, on a log scale
  if (FK.season() === 3) return; const [cw, ch] = FK.size(), z = cam.z, day = FK.K.alt > 0;
  if (day) { const T = []; for (const t of FK.things()) if (t.kind === 'tree' && Math.abs(t.vx - cam.x) < cw / 2 / z && Math.abs(t.vy - cam.y) < ch / 2 / z && T.push(t) >= HB.amb.singers) break;
    if (T.length && Math.random() < 1 - Math.exp(-HB.amb.bird * T.length)) play('bird', T[Math.floor(Math.random() * T.length)]); }
  else if (Math.random() < 1 - Math.exp(-HB.amb.cricket * HB.amb.singers)) play('cricket', { vx: cam.x + (Math.random() - 0.5) * cw / z, vy: cam.y + (Math.random() - 0.5) * ch / z });
});
return { play, toggle: () => { on = !on; wake(); return on; }, on: () => on, mix: (c) => { const [[, word]] = mix[c]; return word; }, step: (c) => { const [s, ...rest] = mix[c]; mix[c] = [...rest, s]; } };
})();
