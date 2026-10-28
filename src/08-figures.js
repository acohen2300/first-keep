// ═════ 08-figures.js ═════
// ───────────────────────── Figures: every unit drawn once per look, colour, pose and zoom, then stamped ─────────────────────────
// Local units: 1 = one world unit; feet at (0, 0), facing right, up is negative. A person stands about 21 tall.
let lessMotion = false; try { lessMotion = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = c => clamp(Math.round(c * k), 0, 255); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
const mix = (a, b, t) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), f = s => Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t); return '#' + ((1 << 24) + (f(16) << 16) + (f(8) << 8) + f(0)).toString(16).slice(1); };
let g = null;   // the context being drawn into
let KIT = 0;    // how much armour research the side being drawn has (0-3: leather, chain, plate); soldiers only
const P_ = (pts, f, s, w) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); if (f) { g.fillStyle = f; g.fill(); } if (s) { g.strokeStyle = s; g.lineWidth = w || 0.5; g.stroke(); } };
const E_ = (x, y, rx, ry, f, s, w, rot) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, 7); if (f) { g.fillStyle = f; g.fill(); } if (s) { g.strokeStyle = s; g.lineWidth = w || 0.5; g.stroke(); } };
const L_ = (x1, y1, x2, y2, c, w) => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); };
const LG = (x0, y0, x1, y1, stops) => { const q = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => q.addColorStop(i / (stops.length - 1), c)); return q; };
const INK = '#141210', SKIN = '#e0b48e', STEEL = '#aeb6be', BRONZE = '#c08a3a', WOOD = '#8a5d34', LEATHER = '#6b4a2c';
const steel = (x0, y0, x1, y1) => LG(x0, y0, x1, y1, ['#eef2f5', '#a9b2bb', '#66707a']);
const bronzeG = (x0, y0, x1, y1) => LG(x0, y0, x1, y1, ['#f0c477', '#c08a3a', '#7d5420']);

// ── a person, built from parts. o: { tunic, trim, body, head, helm, crest, shield, weapon, skin, legs, boots, cape, seated, beard }
function person(o, fr) {
  if (KIT) { o = { ...o };   // armour research shows: mail under the tunic, a steel helm, then plate, a plume and a cape
    if (KIT >= 2 && (!o.body || o.body === 'scale')) o.body = 'mail';
    if (KIT >= 2 && ['bare', 'hood', 'cap', 'straw'].includes(o.head)) o.head = 'kettle';
    if (KIT >= 3) { if (!o.body || o.body === 'mail' || o.body === 'scale') o.body = 'plate'; if (o.head === 'kettle') o.head = 'great'; if (o.head === 'great' && !o.crest) o.crest = o.trim || o.tunic; if (!o.cape) o.cape = shade(o.trim || o.tunic, 0.7); } }
  const tunic = o.tunic, trim = o.trim || tunic, sk = o.skin || SKIN, hip = o.seated ? -13 : -9, sh = hip - 7.5;
  const sw = fr === 1 ? 3 : fr === 2 ? -3 : 0, atk = fr === 3;
  // legs
  const leg = (x0, dx, c) => {
    if (o.seated) { P_([[x0 - 1.4, hip], [x0 + 1.4, hip], [x0 + 4.4, hip + 1.6], [x0 + 3, hip + 3]], c, INK, 0.4); P_([[x0 + 3, hip + 1.5], [x0 + 4.6, hip + 1.5], [x0 + 4.2, hip + 7], [x0 + 2.8, hip + 7]], c, INK, 0.4); E_(x0 + 3.9, hip + 7.4, 1.4, 0.8, o.boots || '#2c2118'); return; }
    P_([[x0 - 1.3, hip], [x0 + 1.3, hip], [x0 + dx * 0.6 + 1.1, hip + 5], [x0 + dx - 0.2 + 1, -0.6], [x0 + dx - 1.4, -0.6], [x0 + dx * 0.6 - 1.2, hip + 5]], c, INK, 0.4);
    P_([[x0 + dx - 1.6, -1.8], [x0 + dx + 1.4, -1.8], [x0 + dx + 2.8, 0], [x0 + dx - 1.6, 0]], o.boots || '#2c2118');
  };
  leg(-0.6, -sw, shade(o.legs || '#5a4a38', 0.75));
  // the far arm and what it holds
  const hand = atk ? [6.2, sh + 2.6] : [3.6, sh + 4];
  if (o.weapon && o.weapon !== 'none') { P_([[-0.4, sh + 0.4], [1.4, sh], [hand[0] + 0.8, hand[1] - 0.6], [hand[0] - 0.6, hand[1] + 0.8]], shade(tunic, 0.7), INK, 0.4); weapon(o.weapon, hand, atk, sh); E_(hand[0], hand[1], 0.9, 0.9, sk); }
  if (o.cape) P_([[-3.6, sh + 0.6], [-1, sh], [-2, hip + 3], [-5.2, hip + 4]], o.cape, INK, 0.4);
  leg(0.6, sw, o.legs || '#5a4a38');
  if (o.lean) { g.save(); g.translate(0, hip); g.rotate(o.lean); g.translate(0, -hip); }
  // body
  const bodyCol = o.body === 'mail' ? '#9aa2a8' : o.body === 'plate' ? steel(-4, 0, 4, 0) : o.body === 'scale' ? bronzeG(-4, 0, 4, 0) : LG(-4, 0, 4, 0, [shade(tunic, 1.15), tunic, shade(tunic, 0.72)]);
  const hem = o.body === 'robe' ? -0.6 : hip + 3.2;
  P_([[-3.4, hip], [3.4, hip], [3.9, hem], [-3.9, hem]], o.body === 'robe' ? LG(-4, 0, 4, 0, [shade(tunic, 1.1), tunic, shade(tunic, 0.7)]) : shade(tunic, 0.85), INK, 0.45);
  P_([[-3.4, hip + 0.4], [3.6, hip + 0.4], [4, sh + 0.8], [-3.6, sh + 0.8]], bodyCol, INK, 0.5);
  if (o.body === 'mail') { g.fillStyle = 'rgba(40,46,52,.55)'; for (let y = sh + 1.6; y < hip; y += 1.2) for (let x = -3; x < 3.5; x += 1.2) g.fillRect(x + ((y * 3) % 1.2), y, 0.45, 0.45); }
  if (o.body === 'scale') { g.strokeStyle = 'rgba(60,36,10,.6)'; g.lineWidth = 0.35; for (let y = sh + 1.6; y < hip; y += 1.3) for (let x = -3; x < 3.5; x += 1.4) { g.beginPath(); g.arc(x, y, 0.7, 0, Math.PI); g.stroke(); } }
  if (o.body === 'segm') { P_([[-3.4, hip + 0.4], [3.6, hip + 0.4], [4, sh + 0.8], [-3.6, sh + 0.8]], steel(-4, 0, 4, 0), INK, 0.5); for (let y = sh + 2; y < hip; y += 1.4) L_(-3.5, y, 3.8, y - 0.1, '#5d6670', 0.45); }
  if (o.body === 'plate' || o.body === 'segm' || o.body === 'mail' || o.body === 'scale') P_([[-3.2, hip - 2.6], [3.4, hip - 2.6], [3.6, hip + 2.2], [-3.4, hip + 2.2]], LG(0, hip - 3, 0, hip + 2, [shade(trim, 1.15), trim]), INK, 0.4);   // surcoat or kilt in the side's colour
  if (o.sash) L_(-3, sh + 1.2, 3.4, hip - 0.6, o.sash, 1.3);
  if (KIT) { E_(0.6, sh + 1.4, 2.5, 1.5, KIT >= 3 ? steel(-2, sh, 3, sh + 3) : KIT === 2 ? '#9aa2a8' : LEATHER, INK, 0.4); if (KIT >= 3) L_(-1.6, sh + 0.7, 2.8, sh + 0.9, 'rgba(255,255,255,.7)', 0.4); }   // shoulder guard
  L_(-3.5, hip - 0.4, 3.8, hip - 0.5, '#3b2a14', 1);   // belt
  if (o.cross) { P_([[-0.6, sh + 1.5], [0.6, sh + 1.5], [0.6, hip - 1.2], [-0.6, hip - 1.2]], o.cross); P_([[-2.5, sh + 3.4], [2.7, sh + 3.4], [2.7, sh + 4.5], [-2.5, sh + 4.5]], o.cross); }
  // head and headgear
  const hx = 0.5, hy = sh - 2.9;
  P_([[-0.6, sh + 0.6], [1.4, sh + 0.6], [1.2, sh - 1], [-0.4, sh - 1]], shade(sk, 0.85));
  E_(hx, hy, 2.6, 2.7, LG(hx - 2, hy - 2, hx + 2, hy + 2, [shade(sk, 1.08), sk, shade(sk, 0.82)]), shade(sk, 0.5), 0.4);
  if (o.beard) P_([[hx - 0.4, hy + 1], [hx + 2.4, hy + 0.8], [hx + 1.2, hy + 3.4], [hx - 0.6, hy + 2.6]], o.beard);
  E_(hx + 1.4, hy - 0.4, 0.42, 0.42, '#1a1a1a');
  helm(o.head, hx, hy, o);
  // the near arm: shield, or a hand at the side
  if (o.shield) shield(o.shield, o, sh, hip, atk);
  else if (o.weapon2) { P_([[0.2, sh + 0.6], [1.8, sh + 0.2], [3.4, sh + 4.6], [2.2, sh + 5]], shade(tunic, 0.95), INK, 0.4); weapon(o.weapon2, [3, sh + 4.8], atk, sh); E_(3, sh + 4.8, 0.9, 0.9, sk); }
  else { P_([[0.2, sh + 0.6], [1.8, sh + 0.2], [2.2, sh + 6.4], [0.8, sh + 6.6]], shade(tunic, 0.95), INK, 0.4); E_(1.6, sh + 6.9, 0.9, 0.9, sk); }
  if (o.lean) g.restore();
}
function helm(kind, x, y, o) {
  const c = o.helmCol || STEEL;
  switch (kind) {
    case 'hood': P_([[x - 3, y + 1.6], [x - 2.8, y - 2.4], [x, y - 3.4], [x + 2.6, y - 2], [x + 2.2, y - 0.6], [x - 1, y - 1], [x - 1.4, y + 2]], o.hoodCol || shade(o.tunic, 0.8), INK, 0.4); break;
    case 'cap': P_([[x - 2.8, y - 0.6], [x - 2.2, y - 2.8], [x + 0.2, y - 3.5], [x + 2.6, y - 2.2], [x + 3.2, y - 1.2]], o.capCol || shade(o.tunic, 0.8), INK, 0.4); break;
    case 'straw': E_(x, y - 1.6, 4.2, 0.9, '#d8c27a', '#7a6430', 0.4); P_([[x - 2, y - 1.8], [x - 1.4, y - 3.6], [x + 1.4, y - 3.6], [x + 2, y - 1.8]], '#cdb66c', '#7a6430', 0.4); break;
    case 'kettle': E_(x, y - 1.6, 4.6, 1.0, steel(x - 4, y - 2, x + 4, y - 1), '#2a3036', 0.4); P_([[x - 2.4, y - 1.8], [x - 1.6, y - 4], [x + 1.6, y - 4], [x + 2.4, y - 1.8]], steel(x - 2, y - 4, x + 2, y - 2), '#2a3036', 0.4); break;
    case 'conical': P_([[x - 3, y - 0.8], [x, y - 5.2], [x + 3, y - 0.8]], o.helmCol || '#3a2a20', INK, 0.4); E_(x, y - 0.8, 3.2, 0.7, shade(o.helmCol || '#3a2a20', 1.3)); break;
    case 'galea': P_([[x - 2.8, y + 0.6], [x - 2.8, y - 2], [x - 0.6, y - 3.4], [x + 2.2, y - 2.6], [x + 2.6, y - 1.2], [x - 0.6, y - 1.2], [x - 0.8, y + 1.6]], steel(x - 3, y - 3, x + 3, y), '#2a3036', 0.4); P_([[x + 0.2, y - 1.2], [x + 1.4, y - 1.2], [x + 1.2, y + 1.8], [x + 0.2, y + 1.6]], STEEL, '#2a3036', 0.3); P_([[x - 2.6, y - 2.6], [x - 1.4, y - 5.4], [x + 1.8, y - 5.2], [x + 2.2, y - 3]], o.crest || '#b33a2e', INK, 0.3); break;
    case 'corinth': P_([[x - 2.8, y + 2.2], [x - 2.9, y - 2.2], [x - 0.6, y - 3.5], [x + 2.4, y - 2.6], [x + 2.8, y + 0.2], [x + 2.2, y + 2.4], [x + 0.6, y + 2.4], [x + 0.6, y - 0.2], [x - 1, y - 0.2], [x - 1.2, y + 2.4]], bronzeG(x - 3, y - 3, x + 3, y + 2), '#4a3010', 0.4); P_([[x - 2.6, y - 2.8], [x - 3.6, y - 6], [x + 2.6, y - 6.2], [x + 2.2, y - 3.2]], o.crest || '#c33', INK, 0.3); break;
    case 'great': P_([[x - 2.8, y + 2.4], [x - 2.8, y - 2.8], [x - 0.6, y - 3.6], [x + 2.8, y - 2.8], [x + 2.8, y + 2.4]], steel(x - 3, 0, x + 3, 0), '#222a30', 0.45); g.fillStyle = '#0b0e10'; g.fillRect(x - 0.2, y - 0.9, 3, 0.7); g.fillRect(x + 0.6, y + 0.4, 2.2, 0.4); if (o.crest) { g.strokeStyle = o.crest; g.lineWidth = 1.1; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x - 1 + i * 0.6, y - 3.4); g.quadraticCurveTo(x - 4 + i * 0.6, y - 7 - i * 0.3, x - 6.5 + i * 0.9, y - 3.6 + i * 0.6); g.stroke(); } } break;
    case 'morion': E_(x, y - 1.6, 4.8, 1.0, steel(x - 4, y - 2, x + 4, y - 1), '#2a3036', 0.4); P_([[x - 2.4, y - 1.8], [x - 1.8, y - 4.2], [x + 1.8, y - 4.2], [x + 2.4, y - 1.8]], steel(x - 2, y - 4, x + 2, y - 2), '#2a3036', 0.4); P_([[x - 2, y - 4.1], [x, y - 5.6], [x + 2, y - 4.1]], shade(STEEL, 0.8), '#2a3036', 0.3); break;
    case 'tiara': P_([[x - 2.6, y - 1], [x - 2.2, y - 5.6], [x + 2, y - 5.6], [x + 2.6, y - 1]], o.helmCol || '#e8dcc0', INK, 0.4); L_(x - 2.4, y - 1.6, x + 2.4, y - 1.6, '#c9a227', 0.6); break;
    case 'fur': E_(x, y - 2, 3.2, 1.8, '#6b4a2c', INK, 0.4); P_([[x - 1.6, y - 3], [x, y - 6], [x + 1.6, y - 3]], o.helmCol || '#b33a2e', INK, 0.3); break;
    case 'turban': E_(x, y - 2.2, 3, 1.9, o.helmCol || '#efe4cc', INK, 0.4); L_(x - 2.6, y - 2.4, x + 2.6, y - 1.6, 'rgba(0,0,0,.2)', 0.4); break;
    case 'hanhat': P_([[x - 2.8, y - 1], [x - 2.4, y - 3.4], [x + 2.6, y - 3.4], [x + 3, y - 1]], '#2f2f36', INK, 0.4); P_([[x - 0.6, y - 3.4], [x - 0.2, y - 5.2], [x + 1.6, y - 5], [x + 1.4, y - 3.4]], '#2f2f36'); break;
    case 'skull': E_(x, y, 2.6, 2.7, '#e8e4d8', '#6b6658', 0.4); E_(x + 1.2, y - 0.2, 0.8, 0.9, '#1a1a1a'); E_(x - 0.4, y - 0.2, 0.7, 0.8, '#1a1a1a'); L_(x - 0.2, y + 1.6, x + 2.2, y + 1.6, '#3a3630', 0.4); break;
    case 'mask': P_([[x - 0.4, y - 0.2], [x + 2.8, y - 0.4], [x + 2.6, y + 2.4], [x - 0.2, y + 2.6]], '#2a2420'); helm('hood', x, y, { ...o, hoodCol: '#3a3028' }); break;
  }
}
function weapon(w, h, atk, sh) {
  const [x, y] = h;
  switch (w) {
    case 'spear': { const a = atk ? 0.12 : -0.28, L = 14, B = 6; const dx = Math.cos(a), dy = Math.sin(a); L_(x - dx * B, y - dy * B, x + dx * L, y + dy * L, '#8a6a3a', 0.8); P_([[x + dx * L, y + dy * L - 0.6], [x + dx * (L + 3), y + dy * (L + 3)], [x + dx * L, y + dy * L + 0.6]], '#dfe4e8', '#555', 0.3); break; }
    case 'pike': { const a = atk ? 0.05 : -0.42, L = 22, B = 8; const dx = Math.cos(a), dy = Math.sin(a); L_(x - dx * B, y - dy * B, x + dx * L, y + dy * L, '#8a6a3a', 0.8); P_([[x + dx * L, y + dy * L - 0.5], [x + dx * (L + 3), y + dy * (L + 3)], [x + dx * L, y + dy * L + 0.5]], '#dfe4e8', '#555', 0.3); break; }
    case 'sword': case 'gladius': { const len = w === 'gladius' ? 5 : 7, a = atk ? 0.1 : -1.1, dx = Math.cos(a), dy = Math.sin(a); L_(x, y, x + dx * len, y + dy * len, '#e6eaee', 1); L_(x - dy * 1.4, y + dx * 1.4, x + dy * 1.4, y - dx * 1.4, '#c9a227', 0.6); break; }
    case 'axe': { const a = atk ? 0.4 : -1.2, dx = Math.cos(a), dy = Math.sin(a); L_(x - dx, y - dy, x + dx * 6, y + dy * 6, '#7a5430', 0.7); P_([[x + dx * 5 - dy * 0.2, y + dy * 5 + dx * 0.2], [x + dx * 6.2 + dy * 2, y + dy * 6.2 - dx * 2], [x + dx * 4 + dy * 1.8, y + dy * 4 - dx * 1.8]], '#c4ccd2', '#555', 0.3); break; }
    case 'pick': { const a = atk ? 0.5 : -1.3, dx = Math.cos(a), dy = Math.sin(a); L_(x - dx, y - dy, x + dx * 6.5, y + dy * 6.5, '#7a5430', 0.7); P_([[x + dx * 6.5 - dy * 2.6, y + dy * 6.5 + dx * 2.6], [x + dx * 6.5 + dy * 2.6, y + dy * 6.5 - dx * 2.6], [x + dx * 7.2 + dy * 0.2, y + dy * 7.2 - dx * 0.2]], '#8c949b', INK, 0.4); break; }
    case 'hammer': { const a = atk ? 0.6 : -1.1, dx = Math.cos(a), dy = Math.sin(a); L_(x, y, x + dx * 5, y + dy * 5, '#7a5430', 0.8); P_([[x + dx * 5 - dy * 1.6, y + dy * 5 + dx * 1.6], [x + dx * 5 + dy * 1.6, y + dy * 5 - dx * 1.6], [x + dx * 6.4 + dy * 1.6, y + dy * 6.4 - dx * 1.6], [x + dx * 6.4 - dy * 1.6, y + dy * 6.4 + dx * 1.6]], '#6e747a', INK, 0.4); break; }
    case 'rod': { const a = atk ? -0.5 : -0.95, dx = Math.cos(a), dy = Math.sin(a); L_(x - dx, y - dy, x + dx * 12, y + dy * 12, '#8a6a3a', 0.5); L_(x + dx * 12, y + dy * 12, x + dx * 13 + 1, y + dy * 12 + 9, 'rgba(235,240,245,.8)', 0.25); break; }
    case 'club': { const a = atk ? 0.3 : -1.3, dx = Math.cos(a), dy = Math.sin(a); g.lineCap = 'round'; L_(x, y, x + dx * 7, y + dy * 7, '#6b4a2c', 1.6); E_(x + dx * 7, y + dy * 7, 1.4, 1.4, '#5a3c22'); break; }
    case 'bigclub': { const a = atk ? 0.3 : -1.3, dx = Math.cos(a), dy = Math.sin(a); g.lineCap = 'round'; L_(x, y, x + dx * 11, y + dy * 11, '#5a4030', 2.6); E_(x + dx * 11, y + dy * 11, 2.6, 2.6, '#4a3020'); break; }
    case 'dagger': L_(x, y, x + 3.4, y + (atk ? -0.2 : -2.4), '#dfe4e8', 0.8); break;
    case 'staff': L_(x, sh - 6, x + 0.3, 0, '#8a6a3a', 0.9); if (w === 'staff') E_(x, sh - 6.4, 1.1, 1.1, '#e6c75a'); break;
    case 'crook': L_(x, sh - 4, x + 0.3, 0, '#8a6a3a', 0.9); g.strokeStyle = '#8a6a3a'; g.lineWidth = 0.9; g.beginPath(); g.arc(x - 1.4, sh - 4, 1.4, 0, Math.PI, true); g.stroke(); break;
    case 'bow': case 'longbow': { const t = w === 'longbow' ? 9 : 6.8, bx = x + 1.2; g.strokeStyle = '#5a3a1c'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(bx - 1, y - t); g.quadraticCurveTo(bx + (atk ? 2.4 : 3.4), y, bx - 1, y + t); g.stroke(); L_(bx - 1, y - t, atk ? bx - 4.6 : bx - 1, y, '#efe6cf', 0.3); L_(atk ? bx - 4.6 : bx - 1, y, bx - 1, y + t, '#efe6cf', 0.3); if (atk) { L_(bx - 4.6, y, bx + 4, y, '#d9c79a', 0.5); P_([[bx + 4, y - 0.5], [bx + 5.4, y], [bx + 4, y + 0.5]], '#ccc'); } break; }
    case 'xbow': { L_(x - 3, y + 0.4, x + 6, y - 0.4, '#7a5430', 1.4); g.strokeStyle = '#3a3a3a'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(x + 5, y - 4); g.quadraticCurveTo(x + 6.6, y, x + 5, y + 4); g.stroke(); L_(x + 5, y - 4, atk ? x + 5 : x + 1.6, y, '#efe6cf', 0.3); L_(atk ? x + 5 : x + 1.6, y, x + 5, y + 4, '#efe6cf', 0.3); if (!atk) L_(x + 1.6, y - 0.2, x + 7, y - 0.4, '#d9c79a', 0.5); break; }
    case 'gun': { L_(x - 3.4, y + 0.8, x + 4, y, '#6b4a2c', 1.7); L_(x + 3, y - 0.2, x + 14, y - 1.2, '#2c2c32', 1.1); L_(x + 5.5, y - 0.4, x + 5.5, y + 1.6, '#c9a227', 0.5); if (atk) { E_(x + 15.4, y - 1.4, 2.2, 1.6, '#ffd35e'); E_(x + 18.4, y - 2.8, 2.8, 2.2, 'rgba(228,228,222,.8)'); } break; }
    case 'jav': { const a = atk ? -0.05 : -0.9, dx = Math.cos(a), dy = Math.sin(a); L_(x - dx * 3, y - dy * 3, x + dx * 9, y + dy * 9, '#9a7a4a', 0.6); P_([[x + dx * 9 - dy * 0.4, y + dy * 9 + dx * 0.4], [x + dx * 11, y + dy * 11], [x + dx * 9 + dy * 0.4, y + dy * 9 - dx * 0.4]], '#ccc'); break; }
    case 'lance': { const a = atk ? 0 : -0.16, dx = Math.cos(a), dy = Math.sin(a); L_(x - dx * 8, y - dy * 8, x + dx * 18, y + dy * 18, '#d9c79a', 1.1); P_([[x + dx * 18, y + dy * 18 - 0.6], [x + dx * 21, y + dy * 21], [x + dx * 18, y + dy * 18 + 0.6]], '#dfe4e8', '#555', 0.3); break; }
    case 'scroll': P_([[x - 0.6, y - 2.6], [x + 1.4, y - 2.6], [x + 1.4, y + 1.6], [x - 0.6, y + 1.6]], '#f2ead2', '#8a7a5a', 0.3); break;
    case 'bag': E_(x + 0.4, y + 2, 1.8, 1.5, '#7a5a3a', INK, 0.3); L_(x - 0.2, y + 0.8, x + 1, y + 0.8, '#c33', 0.6); break;
    case 'torch': L_(x, y, x + 1, y - 5, '#6b4a2c', 0.8); E_(x + 1.1, y - 6, 1, 1.5, '#f2a03a'); break;
  }
}
function shield(kind, o, sh, hip, atk) {
  const cx = 3.4 + (atk ? -0.6 : 0), cy = sh + 5.2, col = o.trim || o.tunic;
  if (kind === 'round') { E_(cx, cy, 3.6, 4.4, LG(cx - 3, cy - 4, cx + 3, cy + 4, [shade(col, 1.25), col, shade(col, 0.7)]), INK, 0.5); E_(cx, cy, 3.6, 4.4, null, BRONZE, 0.7); E_(cx + 0.3, cy, 0.9, 1.1, BRONZE); }
  else if (kind === 'aspis') { E_(cx, cy - 0.4, 4.4, 5.4, bronzeG(cx - 4, cy - 5, cx + 4, cy + 5), '#4a3010', 0.5); E_(cx, cy - 0.4, 3.4, 4.2, col); E_(cx + 0.4, cy - 0.6, 1.4, 1.6, shade(col, 0.6)); }
  else if (kind === 'kite') { P_([[cx - 3.2, cy - 5.6], [cx + 3.4, cy - 5.6], [cx + 3.4, cy - 1], [cx + 0.1, cy + 6.6], [cx - 3.2, cy - 1]], LG(cx - 3, 0, cx + 3, 0, [shade(col, 1.2), col, shade(col, 0.7)]), INK, 0.5); P_([[cx - 3.2, cy - 5.6], [cx + 3.4, cy - 5.6], [cx + 3.4, cy - 1], [cx + 0.1, cy + 6.6], [cx - 3.2, cy - 1]], null, '#d8c27a', 0.5); L_(cx, cy - 5.3, cx, cy + 5.8, '#f2e9c8', 0.9); L_(cx - 3, cy - 2.4, cx + 3.2, cy - 2.4, '#f2e9c8', 0.9); }
  else if (kind === 'scutum') { P_([[cx - 2.6, cy - 6.6], [cx + 3.2, cy - 6.6], [cx + 3.6, cy + 5.8], [cx - 2.6, cy + 5.8]], LG(cx - 3, 0, cx + 4, 0, [shade(col, 0.75), col, shade(col, 1.15)]), INK, 0.5); P_([[cx - 2.6, cy - 6.6], [cx + 3.2, cy - 6.6], [cx + 3.6, cy + 5.8], [cx - 2.6, cy + 5.8]], null, '#d8c27a', 0.6); E_(cx + 0.5, cy - 0.4, 1.2, 1.4, BRONZE); L_(cx - 2, cy - 4, cx + 3, cy + 3, 'rgba(242,207,85,.7)', 0.5); L_(cx - 2, cy + 3, cx + 3, cy - 4, 'rgba(242,207,85,.7)', 0.5); }
  else if (kind === 'wicker') { P_([[cx - 2.6, cy - 6], [cx + 3.2, cy - 6], [cx + 3.2, cy + 5], [cx - 2.6, cy + 5]], '#c9a96a', '#6b5230', 0.5); g.strokeStyle = 'rgba(90,64,30,.6)'; g.lineWidth = 0.35; for (let y = cy - 5.4; y < cy + 5; y += 1.2) { g.beginPath(); g.moveTo(cx - 2.4, y); g.lineTo(cx + 3, y); g.stroke(); } L_(cx - 2.6, cy - 6, cx + 3.2, cy - 6, col, 1); }
  P_([[0.2, sh + 0.6], [1.8, sh + 0.2], [cx + 0.6, cy - 0.6], [cx - 0.8, cy + 0.8]], shade(o.tunic, 0.95));
}
// ── a horse, side on. o: { coat, barding: 'cloth'|'scale'|'mail', cloth }
function horse(o, fr, dx = 0) {
  const c = o.coat || '#7a4e2c', cd = shade(c, 0.7), sw = fr === 1 ? 1 : fr === 2 ? -1 : 0;
  const leg = (x, a, col) => { g.save(); g.translate(x + dx, -7); g.rotate(a); P_([[-1.1, 0], [1.1, 0], [0.9, 4.2], [-0.9, 4.2]], col, INK, 0.35); P_([[-0.9, 4.2], [0.9, 4.2], [0.8, 6.6], [-0.8, 6.6]], col, INK, 0.35); P_([[-1, 6.6], [1, 6.6], [1.2, 7.4], [-1.2, 7.4]], '#1e1a16'); g.restore(); };
  leg(-6, -0.25 * sw, cd); leg(6.4, 0.25 * sw, cd);
  g.strokeStyle = shade(c, 0.45); g.lineWidth = 1.6; g.beginPath(); g.moveTo(dx - 9, -11); g.quadraticCurveTo(dx - 12.5, -8, dx - 11.5, -3.5); g.stroke();
  E_(dx, -10.6, 10, 4.3, LG(dx, -15, dx, -6, [shade(c, 1.2), c, shade(c, 0.75)]), INK, 0.45);
  P_([[dx + 6.5, -13], [dx + 10, -19], [dx + 12.4, -20.2], [dx + 13, -17.4], [dx + 9.2, -10]], LG(dx + 6, -20, dx + 13, -10, [shade(c, 1.15), c]), INK, 0.45);
  P_([[dx + 11.4, -20.6], [dx + 15.6, -18], [dx + 16.6, -15.8], [dx + 15.2, -15], [dx + 12.4, -16.6]], LG(dx + 11, -20, dx + 17, -15, [shade(c, 1.1), shade(c, 0.85)]), INK, 0.45);
  P_([[dx + 11.6, -20.4], [dx + 12.2, -22.6], [dx + 12.8, -20.4]], cd); E_(dx + 13.2, -18.6, 0.45, 0.45, '#0b0b0b');
  g.strokeStyle = shade(c, 0.4); g.lineWidth = 1.1; g.beginPath(); g.moveTo(dx + 7, -14.5); g.quadraticCurveTo(dx + 9, -19, dx + 11.6, -20.6); g.stroke();
  if (o.barding === 'cloth') { P_([[dx - 9.6, -12.4], [dx + 8.6, -13], [dx + 9.4, -7.6], [dx + 6, -5.2], [dx - 4, -5.4], [dx - 9.8, -7.2]], LG(0, -13, 0, -5, [shade(o.cloth, 1.2), o.cloth, shade(o.cloth, 0.7)]), INK, 0.45); for (let i = 0; i < 6; i++) P_([[dx - 8.4 + i * 3, -5.6], [dx - 7 + i * 3, -4.2], [dx - 5.6 + i * 3, -5.6]], '#e9d28a'); L_(dx - 9.4, -12.2, dx + 8.6, -12.8, '#e9d28a', 0.6); }
  if (o.barding === 'scale' || o.barding === 'mail') { P_([[dx - 9.6, -13], [dx + 9, -13.6], [dx + 9.6, -7.8], [dx - 9.8, -7.4]], o.barding === 'scale' ? bronzeG(0, -14, 0, -7) : '#9aa2a8', INK, 0.45); g.strokeStyle = 'rgba(40,30,20,.55)'; g.lineWidth = 0.3; for (let y = -12.6; y < -8; y += 1.1) for (let x = -9; x < 9; x += 1.3) { g.beginPath(); g.arc(dx + x, y, 0.6, 0, Math.PI); g.stroke(); } P_([[dx + 6.8, -13.4], [dx + 10.4, -19.4], [dx + 12.2, -20.4], [dx + 10.4, -13]], o.barding === 'scale' ? bronzeG(0, -20, 0, -13) : '#9aa2a8', INK, 0.4); }
  if (o.saddle !== false) P_([[dx - 3.6, -15], [dx + 2.4, -15.2], [dx + 3, -13.6], [dx - 4.2, -13.4]], '#3a2414', INK, 0.4);
  leg(-4.2, 0.25 * sw, c); leg(8.2, -0.25 * sw, c);
}
function quad(o, fr) {   // deer, boar, wolf, bear: one four-legged template
  const c = o.col, L = o.len, H = o.h, sw = fr === 1 ? 1 : fr === 2 ? -1 : 0, cd = shade(c, 0.7);
  const leg = (x, a, col) => { g.save(); g.translate(x, -o.legH); g.rotate(a); P_([[-o.legW, 0], [o.legW, 0], [o.legW * 0.8, o.legH], [-o.legW * 0.8, o.legH]], col, INK, 0.3); g.restore(); };
  leg(-L * 0.32, -0.3 * sw, cd); leg(L * 0.3, 0.3 * sw, cd);
  if (o.tail) L_(-L * 0.48, -o.legH - H * 0.6, -L * 0.6, -o.legH - H * 0.1, cd, o.tail);
  E_(0, -o.legH - H / 2, L / 2, H / 2, LG(0, -o.legH - H, 0, -o.legH, [shade(c, 1.2), c, shade(c, 0.75)]), INK, 0.4);
  if (o.hump) E_(-L * 0.05, -o.legH - H * 0.9, L * 0.3, H * 0.4, shade(c, 1.05));
  const hx = L / 2 + o.head * 0.4, hy = -o.legH - H * o.headY;
  P_([[L * 0.35, -o.legH - H * 0.9], [hx, hy - o.head * 0.7], [hx + o.head * 1.4, hy + o.head * 0.2], [hx + o.head * 1.2, hy + o.head * 0.8], [L * 0.38, -o.legH - H * 0.2]], c, INK, 0.4);
  E_(hx + o.head * 0.4, hy, o.head, o.head * 0.8, shade(c, 1.05), INK, 0.35);
  E_(hx + o.head * 0.6, hy - o.head * 0.25, 0.4, 0.4, o.eye || '#0b0b0b');
  P_([[hx - o.head * 0.4, hy - o.head * 0.6], [hx - o.head * 0.1, hy - o.head * 1.6], [hx + o.head * 0.3, hy - o.head * 0.6]], cd);
  if (o.antlers) { g.strokeStyle = '#d8c8a0'; g.lineWidth = 0.6; g.beginPath(); g.moveTo(hx, hy - o.head); g.lineTo(hx - 1.2, hy - o.head - 4); g.moveTo(hx - 0.7, hy - o.head - 2.4); g.lineTo(hx + 1.2, hy - o.head - 3.6); g.moveTo(hx - 1.1, hy - o.head - 3.6); g.lineTo(hx - 3, hy - o.head - 4.6); g.stroke(); }
  if (o.tusk) { g.strokeStyle = '#efe6cf'; g.lineWidth = 0.6; g.beginPath(); g.moveTo(hx + o.head * 1.2, hy + o.head * 0.4); g.quadraticCurveTo(hx + o.head * 1.8, hy, hx + o.head * 1.4, hy - o.head * 0.5); g.stroke(); }
  if (o.bristle) { g.strokeStyle = shade(c, 0.5); g.lineWidth = 0.4; for (let i = 0; i < 6; i++) L_(-L * 0.2 + i * L * 0.08, -o.legH - H, -L * 0.22 + i * L * 0.08, -o.legH - H - 1.2, shade(c, 0.5), 0.4); }
  leg(-L * 0.22, 0.3 * sw, c); leg(L * 0.38, -0.3 * sw, c);
}
function elephant(o, fr) {
  const c = '#8d8a86', sw = fr === 1 ? 1 : fr === 2 ? -1 : 0;
  const leg = (x, a, col) => { g.save(); g.translate(x, -9); g.rotate(a * 0.15); P_([[-2.4, 0], [2.4, 0], [2.2, 9], [-2.2, 9]], col, INK, 0.4); E_(0, 8.8, 2.3, 0.7, shade(col, 0.8)); g.restore(); };
  leg(-8, -sw, shade(c, 0.75)); leg(7, sw, shade(c, 0.75));
  L_(-13.4, -16, -15, -8, shade(c, 0.6), 0.8);
  E_(0, -16, 14, 8.6, LG(0, -25, 0, -7, ['#a8a5a1', c, '#66635f']), INK, 0.5);
  E_(13, -19, 6.4, 6.4, LG(8, -25, 18, -13, ['#a8a5a1', c]), INK, 0.5);
  E_(10.6, -18.6, 3.6, 5, shade(c, 0.85), INK, 0.4);
  g.strokeStyle = c; g.lineWidth = 2.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(17.6, -17); g.quadraticCurveTo(21, -10, 19 + (fr === 3 ? 3 : 0), -3); g.stroke(); g.lineWidth = 0.4; g.strokeStyle = INK; g.stroke();
  g.strokeStyle = '#f2ead8'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(16.6, -14.4); g.quadraticCurveTo(20, -13, 21.6, -15.6); g.stroke();
  E_(15, -21, 0.6, 0.6, '#0b0b0b');
  P_([[-10, -23.6], [9, -23.8], [10, -14], [-11, -14]], LG(0, -24, 0, -14, [shade(o.cloth, 1.2), o.cloth, shade(o.cloth, 0.7)]), INK, 0.45);
  for (let i = 0; i < 7; i++) E_(-9 + i * 3, -14, 0.9, 0.9, '#e9c45a');
  P_([[-7, -31], [6, -31], [6.4, -23.6], [-7.4, -23.6]], WOOD, INK, 0.45); P_([[-7.6, -31.6], [6.6, -31.6], [6.6, -30.2], [-7.6, -30.2]], o.cloth);
  L_(-7, -31, -7, -36, '#5a3a1c', 0.6); L_(6, -31, 6, -36, '#5a3a1c', 0.6); P_([[-8, -37], [7, -37], [6, -35.4], [-7, -35.4]], shade(o.cloth, 0.8), INK, 0.3);
  E_(-2, -33.6, 1.8, 1.9, SKIN); E_(3, -33.4, 1.8, 1.9, SKIN); helm('turban', 3, -33.4, { helmCol: '#efe4cc' });
  L_(4.4, -32.6, 13, -38, '#8a6a3a', 0.6);
  E_(9.6, -26.4, 1.6, 1.7, SKIN); helm('turban', 9.6, -26.4, { helmCol: o.cloth });
  leg(-5, sw, c); leg(10, -sw, c);
}
function wheel(x, y, r) { E_(x, y, r, r, null, '#3a2814', 1); g.strokeStyle = '#5a3a1c'; g.lineWidth = 0.5; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke(); } E_(x, y, 0.8, 0.8, '#3a2814'); }
function planks(x0, y0, x1, y1, col) { P_([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], LG(x0, 0, x1, 0, [shade(col, 1.15), col, shade(col, 0.75)]), INK, 0.5); g.strokeStyle = 'rgba(40,24,10,.45)'; g.lineWidth = 0.35; for (let y = y0 + 2; y < y1; y += 2.2) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); } }
// ── each look: how its figure is put together. c = side colour, t = tier.
const WORKTOOL = ['axe', 'none', 'pick', 'none', 'rod', 'hammer'];   // chop, forage, mine, farm, fish, mend
const LOOKS = {
  vil: (c, t, fr) => {   // fr 0-3 as everyone; 10 and up = at work: (fr - 10) >> 1 is the work, the low bit its two poses
    const wk = fr >= 10 ? (fr - 10) >> 1 : -1, ph = fr >= 10 ? (fr - 10) & 1 : 0;
    return person({ tunic: '#8a6a44', trim: c, sash: c, head: 'bare', weapon: wk < 0 ? 'axe' : WORKTOOL[wk], lean: wk === 1 || wk === 3 ? (ph ? 0.62 : 0.4) : 0, legs: '#5a4a38', beard: '#6b4a2c' }, wk < 0 ? fr : ph ? 3 : 0);
  },
  scout: (c, t, fr) => { horse({ coat: '#9a7046' }, fr); g.save(); g.translate(-0.6, -1); person({ tunic: c, head: 'cap', capCol: shade(c, 0.6), weapon: 'spear', seated: true, cape: shade(c, 0.6) }, fr); g.restore(); },
  envoy: (c, t, fr) => person({ tunic: '#eae2cc', trim: c, body: 'robe', head: 'bare', weapon: 'scroll', sash: c, legs: '#d8cdb2' }, fr),
  caravan: (c, t, fr) => { horse({ coat: '#8a7a6a', saddle: false }, fr, 9); L_(-2, -9, 6, -11, '#5a3a1c', 0.8); planks(-14, -13, -1, -6, WOOD); E_(-11, -16, 2.6, 2.4, '#c9a96a', INK, 0.3); E_(-6.5, -16.4, 2.6, 2.6, '#d8c27a', INK, 0.3); E_(-8.5, -18.6, 2.2, 2, c, INK, 0.3); wheel(-7.5, -4.6, 4.4); },
  spy: (c, t, fr) => person({ tunic: '#2a2a30', trim: c, body: 'robe', head: 'hood', hoodCol: '#1c1c22', weapon: 'dagger', cape: '#1c1c22', legs: '#22222a' }, fr),
  priest: (c, t, fr) => person({ tunic: '#efe6cf', trim: '#c9a227', body: 'robe', head: 'bare', weapon: 'staff', sash: c, legs: '#d8cdb2', beard: '#d8d0c0' }, fr),
  medic: (c, t, fr) => person({ tunic: '#e4dccb', trim: c, head: 'cap', capCol: '#e4dccb', weapon: 'bag', sash: '#c23a30', legs: '#6b5a48' }, fr),
  spear: (c, t, fr) => t === 0 ? person({ tunic: c, head: 'bare', shield: 'round', weapon: 'spear', legs: '#6b5a40', beard: '#4a3420' }, fr)
    : t === 1 ? person({ tunic: c, body: 'scale', head: 'corinth', crest: shade(c, 0.6), shield: 'aspis', weapon: 'spear', legs: '#b08a50', boots: BRONZE }, fr)
    : person({ tunic: c, body: 'mail', head: 'kettle', shield: null, weapon: 'pike', weapon2: null, legs: '#5a4a38' }, fr),
  sword: (c, t, fr) => t === 0 ? person({ tunic: c, body: 'scale', head: 'conical', helmCol: BRONZE, shield: 'round', weapon: 'sword', legs: '#6b5a40' }, fr)
    : person({ tunic: c, body: 'plate', head: 'great', shield: 'kite', weapon: 'sword', legs: '#7a8088', boots: '#555c63' }, fr),
  legion: (c, t, fr) => person({ tunic: '#b33a2e', trim: c, body: 'segm', head: 'galea', crest: '#b33a2e', shield: 'scutum', weapon: 'gladius', legs: '#a8653a', boots: LEATHER }, fr),
  immortal: (c, t, fr) => person({ tunic: c, body: 'robe', head: 'tiara', helmCol: '#efe4cc', shield: 'wicker', weapon: 'spear', legs: shade(c, 0.6), beard: '#2a1a10', sash: '#c9a227' }, fr),
  archer: (c, t, fr) => t === 0 ? person({ tunic: c, head: 'hood', weapon: 'bow', legs: '#5a4a38' }, fr) : person({ tunic: c, head: 'cap', capCol: '#2f5a2f', weapon: 'longbow', legs: '#4a5a38', sash: '#d8c27a' }, fr),
  jav: (c, t, fr) => person({ tunic: c, head: 'bare', shield: 'round', weapon: 'jav', legs: '#6b5a40', beard: '#6b4a2c' }, fr),
  crossbow: (c, t, fr) => person({ tunic: c, body: 'mail', head: 'kettle', weapon: 'xbow', legs: '#5a4a38' }, fr),
  arquebus: (c, t, fr) => person({ tunic: c, trim: c, body: 'mail', head: 'morion', weapon: 'gun', sash: '#e6d9b0', legs: '#7a3a2e', boots: LEATHER }, fr),
  bombard: (c, t, fr) => { const r = fr === 3 ? -2.5 : 0; planks(-13, -6, 13, -3, WOOD); g.save(); g.translate(r, 0); P_([[-11, -9], [11, -11.4], [13, -9.6], [13, -5.4], [11, -4.4], [-11, -6.2]], bronzeG(0, -11, 0, -4), '#4a3010', 0.6); for (const x of [-6, 0, 6]) L_(x, -10.4, x, -4.8, '#7d5420', 0.9); E_(13, -7.5, 1.2, 2, '#1a1612'); if (fr === 3) { E_(16.5, -8, 3, 2.4, '#ffd35e'); E_(21, -10, 4, 3, 'rgba(228,228,222,.7)'); } g.restore(); g.fillStyle = c; g.fillRect(-12, -6, 2.4, -7); P_([[-9.6, -13], [-5, -11.8], [-9.6, -10.6]], c); wheel(-7, -2.6, 3.3); wheel(7, -2.6, 3.3); },
  chariot: (c, t, fr) => t === 0 ? (() => { horse({ coat: '#a0703a', saddle: false }, fr, 9); L_(-2, -10, 7, -11, '#5a3a1c', 1); g.save(); g.translate(-7, -4); person({ tunic: c, head: 'conical', helmCol: BRONZE, weapon: 'bow' }, fr); g.restore(); planks(-12, -12, -2, -5, shade(c, 0.85)); wheel(-7, -4.6, 4.6); })()
    : (() => { horse({ coat: '#7a4e2c' }, fr); g.save(); g.translate(-0.6, -1); person({ tunic: c, head: 'conical', helmCol: STEEL, shield: 'round', weapon: 'spear', seated: true }, fr); g.restore(); })(),
  cata: (c, t, fr) => t === 0 ? (() => { horse({ coat: '#5a3a24', barding: 'scale' }, fr); g.save(); g.translate(-0.6, -1); person({ tunic: c, body: 'scale', head: 'conical', helmCol: STEEL, weapon: 'lance', seated: true, legs: '#9aa2a8' }, fr); g.restore(); })()
    : (() => { horse({ coat: '#5a3a24', barding: 'cloth', cloth: c }, fr); g.save(); g.translate(-0.6, -1); person({ tunic: c, body: 'plate', head: 'great', crest: c, shield: 'kite', weapon: 'lance', seated: true, legs: '#9aa2a8' }, fr); g.restore(); })(),
  malihorse: (c, t, fr) => { horse({ coat: '#efe6d4', barding: 'cloth', cloth: '#c9a227' }, fr); g.save(); g.translate(-0.6, -1); person({ tunic: c, body: 'robe', head: 'turban', helmCol: '#f2ead2', weapon: 'lance', seated: true, skin: '#7a4a2c' }, fr); g.restore(); },
  harcher: (c, t, fr) => { horse({ coat: '#b08a5a' }, fr); g.save(); g.translate(-0.6, -1); person({ tunic: c, head: 'fur', helmCol: shade(c, 0.6), weapon: 'bow', seated: true, legs: '#6b4a2c' }, fr); g.restore(); },
  elephant: (c, t, fr) => elephant({ cloth: c }, fr),
  ram: (c, t, fr) => { L_(-17 + (fr === 3 ? 4 : 0), -8, 15 + (fr === 3 ? 4 : 0), -8, '#6b4a2c', 3); P_([[15 + (fr === 3 ? 4 : 0), -10], [19 + (fr === 3 ? 4 : 0), -8], [15 + (fr === 3 ? 4 : 0), -6]], '#5d6670', INK, 0.4); P_([[-13, -6], [13, -6], [13, -12], [0, -19], [-13, -12]], LG(0, -19, 0, -6, ['#8a6a44', '#6b4a2c']), INK, 0.6); g.strokeStyle = 'rgba(30,20,10,.5)'; g.lineWidth = 0.4; for (let i = -11; i < 13; i += 3) { g.beginPath(); g.moveTo(i, -6); g.lineTo(i, -12 + Math.abs(i) * 0); g.stroke(); } P_([[-13, -12], [0, -19], [13, -12], [0, -14]], '#7a8a5a', INK, 0.4); g.fillStyle = c; g.fillRect(-1, -19, 2, -5); P_([[1, -24], [6, -22.6], [1, -21.2]], c); wheel(-9, -3.2, 3.2); wheel(0, -3.2, 3.2); wheel(9, -3.2, 3.2); },
  stower: (c, t, fr) => { planks(-8, -42, 8, -3, '#8a6a44'); for (let y = -38; y < -8; y += 9) P_([[2, y], [6, y], [6, y + 3], [2, y + 3]], '#1a120a'); E_(4, -36.2, 1.4, 1.5, SKIN); E_(4, -27.2, 1.4, 1.5, SKIN); P_([[-9, -42], [9, -42], [8, -45], [-8, -45]], '#6b4a2c', INK, 0.5); L_(-6, -45, -6, -54, '#3a2814', 0.6); P_([[-6, -54], [2, -52], [-6, -50]], c); wheel(-5, -3, 3.2); wheel(5, -3, 3.2); },
  catapult: (c, t, fr) => { planks(-11, -6, 11, -3, WOOD); P_([[-2, -6], [0, -14], [2, -6]], WOOD, INK, 0.5); const a = fr === 3 ? -1.2 : -0.35; g.save(); g.translate(0, -12); g.rotate(a); L_(-14, 0, 6, 0, '#6b4a2c', 1.6); E_(-14, 0, 2.6, 1.6, '#4a3020', INK, 0.4); if (fr !== 3) E_(-14, -1.6, 1.4, 1.4, '#8a8a8a'); g.restore(); L_(-8, -6, -11, -9, '#6b4a2c', 0.8); g.fillStyle = c; g.fillRect(8, -6, 3, -4); wheel(-7, -2.6, 2.8); wheel(7, -2.6, 2.8); },
  ballista: (c, t, fr) => { L_(-6, 0, 0, -9, WOOD, 1); L_(6, 0, 0, -9, WOOD, 1); L_(0, 0, 0, -9, WOOD, 1); planks(-8, -12, 9, -9, WOOD); g.strokeStyle = '#3a3a3a'; g.lineWidth = 1; g.beginPath(); g.moveTo(6, -18); g.quadraticCurveTo(9, -10.5, 6, -3); g.stroke(); L_(6, -18, fr === 3 ? 6 : -4, -10.5, '#efe6cf', 0.4); L_(fr === 3 ? 6 : -4, -10.5, 6, -3, '#efe6cf', 0.4); if (fr !== 3) L_(-4, -10.6, 12, -10.6, '#d9c79a', 0.8); g.fillStyle = c; g.fillRect(-8, -12, 3, 3); },
  treb: (c, t, fr) => { planks(-14, -5, 14, -2, WOOD); P_([[-6, -5], [0, -30], [6, -5]], null, WOOD, 1.6); L_(-3, -18, 3, -18, WOOD, 1); const a = fr === 3 ? -2.2 : -0.5; g.save(); g.translate(0, -29); g.rotate(a); L_(-22, 0, 8, 0, '#6b4a2c', 1.4); P_([[5, -1], [12, -1], [12, 6], [5, 6]], '#5a5048', INK, 0.5); L_(-22, 0, -22, 8, '#c9b48a', 0.4); E_(-22, 8.6, 1.2, 1.2, '#8a8a8a'); g.restore(); g.fillStyle = c; g.fillRect(-1, -32, 2, -5); P_([[1, -37], [6, -35.6], [1, -34.2]], c); wheel(-10, -2, 2.4); wheel(10, -2, 2.4); },
  deer: (c, t, fr) => quad({ col: '#a0703e', len: 13, h: 5.6, legH: 7.4, legW: 0.6, head: 2.2, headY: 1.8, antlers: true, tail: 0.8 }, fr),
  boar: (c, t, fr) => quad({ col: '#4a3a2e', len: 13, h: 7, legH: 3.4, legW: 1, head: 2.8, headY: 0.55, tusk: true, bristle: true, tail: 0.6 }, fr),
  wolf: (c, t, fr) => quad({ col: '#7a7570', len: 13, h: 5, legH: 5.2, legW: 0.7, head: 2.2, headY: 1.0, tail: 1.6 }, fr),
  direwolf: (c, t, fr) => quad({ col: '#3c3a40', len: 20, h: 8, legH: 7.5, legW: 1.1, head: 3.4, headY: 1.0, tail: 2.4, eye: '#e33' }, fr),
  bear: (c, t, fr) => quad({ col: '#4e3524', len: 17, h: 9, legH: 4.5, legW: 1.5, head: 3.2, headY: 0.8, hump: true, tail: 0 }, fr),
  bandit: (c, t, fr) => person({ tunic: '#5a5040', head: 'hood', hoodCol: '#4a3e2e', weapon: 'club', legs: '#3a3228', beard: '#3a2a1a' }, fr),
  robber: (c, t, fr) => person({ tunic: '#4a3a30', head: 'mask', weapon: 'sword', shield: 'round', trim: '#6b3a2a', legs: '#2e2620' }, fr),
  wayfarer: (c, t, fr) => person({ tunic: '#7a6a50', head: 'straw', weapon: 'crook', legs: '#5a4a38', beard: '#8a8070', cape: '#6b5a40' }, fr),
  vagabond: (c, t, fr) => person({ tunic: '#6a5e4e', head: 'bare', weapon: 'none', legs: '#4a4038', beard: '#4a3a2a', sash: '#8a3a2a' }, fr),
  goblin: (c, t, fr) => { g.save(); g.scale(0.75, 0.75); person({ tunic: '#5a4a30', head: 'bare', skin: '#7aa04a', weapon: 'dagger', shield: 'round', trim: '#6b5a30', legs: '#4a3a20' }, fr); g.restore(); },
  skeleton: (c, t, fr) => person({ tunic: '#d8d4c8', body: 'robe', head: 'skull', skin: '#e8e4d8', weapon: 'sword', shield: 'round', trim: '#6b6658', legs: '#cfcabb' }, fr),
  troll: (c, t, fr) => { g.save(); g.scale(1.6, 1.6); person({ tunic: '#5a6a4a', head: 'bare', skin: '#7a8a6a', weapon: 'bigclub', legs: '#4a5a3a', beard: '#3a4a2a' }, fr); g.restore(); },
};
// how big each look's sprite box is (local units): [width, height]
const LOOKBOX = { scout: [44, 34], caravan: [36, 30], chariot: [36, 34], cata: [58, 36], malihorse: [58, 36], harcher: [36, 36], elephant: [48, 44], ram: [42, 30], stower: [24, 58], catapult: [32, 26], ballista: [30, 24], treb: [48, 50], deer: [26, 22], boar: [24, 16], wolf: [24, 16], direwolf: [36, 24], bear: [30, 22], troll: [26, 46], spear: [52, 34], vil: [30, 30], legion: [30, 30], immortal: [44, 30], sword: [30, 30], jav: [34, 30], crossbow: [34, 30], arquebus: [40, 30], bombard: [44, 30] };
// ── the sprite cache: one canvas per look, colour, tier, pose and zoom step
const SPR = new Map();
function trim(M, max) { if (M.size > max) for (const [k, v] of M) { M.delete(k); if (v.getContext) v.width = v.height = 0;   // give the picture's memory back at once: iPhone drops pages that hold too much
    if (M.size <= max * 0.8) break; } }   // oldest first: a Map keeps insertion order
const SCALES = [1, 1.5, 2, 3, 4, 5, 6];
function sprite(look, col, tier, fr, s, kit = 0) {
  const key = look + col + tier + fr + s + (kit ? 'k' + kit : ''); let c = SPR.get(key); if (c) return c;
  const [bw, bh] = LOOKBOX[look] || [26, 30], pad = 3;
  c = document.createElement('canvas'); c.width = Math.ceil((bw + pad * 2) * s); c.height = Math.ceil((bh + pad * 2) * s);
  g = c.getContext('2d'); g.scale(s, s); g.translate(bw / 2 + pad, bh + pad - 1); g.lineJoin = 'round'; g.lineCap = 'round';
  KIT = kit; try { LOOKS[look](col, tier, fr); } catch (e) { fault(e); } KIT = 0;
  c.ax = (bw / 2 + pad) * s; c.ay = (bh + pad - 1) * s; g = null;
  trim(SPR, 600);
  SPR.set(key, c); return c;
}

