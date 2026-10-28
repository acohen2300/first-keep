// ═════ 20-boot.js ═════
// ───────────────────────── The loop and the start ─────────────────────────
let last = performance.now(), acc = 0, lastSave = 0, inputT = 0;
const CATCHUP = 6;
// The safety net: an error costs a frame, never the game, and each kind is logged once. A second kind in one session saves the game, pauses it and offers a restart.
const seenErr = new Set();
function fault(e) {
  const m = String(e && e.stack || e); if (seenErr.has(m)) return; seenErr.add(m);
  try { console.error(m); if (seenErr.size >= 2 && G && !G.over) { saveGame(true); setPause(true); openCard({ type: 'fault' }); } } catch (x) {}
}
window.addEventListener('error', e => fault(e.error || e.message));
window.addEventListener('unhandledrejection', e => fault(e.reason));
// Load: a phone that keeps falling behind (over 12 ms of work a frame for two seconds) first drops the moving extras, then draws at half its pixels.
const LOW = { ema: 0, slow: 0, n: 0 };
function shed(work) {
  LOW.ema += (work - LOW.ema) * 0.05;
  if (LOW.ema <= 12 || LOW.n >= 2) { LOW.slow = 0; return; }
  if (++LOW.slow > 120) { LOW.n++; LOW.slow = 0; LOW.ema = 0; if (LOW.n === 1) lessMotion = true; else fit(); }
}
// One frame. When nothing moves (paused, over, hidden, no touch for a second) it waits: 15 frames a second instead of 60.
function frame(now) {
  const run = !G.over && !G.paused && !document.hidden, idle = !run && now - inputT > 1000, d = Math.min(0.1, (now - last) / 1000), t0 = performance.now(); last = now;
  try {
    if (run) { acc += d * G.speed; let n = 0; while (acc >= DT && n < CATCHUP) { step(DT); acc -= DT; n++; } if (n >= CATCHUP) acc = 0; ambience(d); }
    if (now - lastSave > SAVE_EVERY * 1000) { lastSave = now; if (run) saveGame(); }
    edgeScroll(d); draw(); ui();
    if (run) shed(performance.now() - t0);
  } catch (e) { fault(e); }
  if (idle) setTimeout(() => requestAnimationFrame(frame), 66); else requestAnimationFrame(frame);
}
for (const ev of ['pointerdown', 'pointermove', 'wheel']) document.addEventListener(ev, () => { inputT = performance.now(); }, { passive: true, capture: true });
window.addEventListener('resize', fit);
{ const first = !SET.mapSeen; SET.mapSeen = true; if (first) SET.mini = true; else if (SET.mini === undefined) SET.mini = false; saveSet(); }   // the first look shows the map; after that it stays shut until opened
applyMini(); buildPanel(); fit(); newGame(); scoreAll(); ui(true);
{ const sv = readSave(); if (sv && sv.t > 20) { holdSave = true; setPause(true); openCard({ type: 'resume', t: sv.t, age: sv.P[0].age, civ: sv.P[0].civ }); } else { setPause(true); openCard({ type: 'setup' }); } lastSave = performance.now(); }
requestAnimationFrame(frame);
window.__fk = { say, showStrip, capFor, armyRoom, capOf, atCap, capWhy, techState, get G() { return G; }, get cam() { return cam; }, set G(v) { G = v; }, SET, NAV, BLD, UNIT, TECH, TECHBY, CIVS, FINDS, MENUS, AGES, PERS, step, act, train, trainWhy, build, research, researchWhy, ageUp, addUnit, wildAt, addFind, declareWar, keepOf, stats, fxv, sendEnvoy, canPlace, snapGhost, findSpot, think, astar, navRebuild, moveTo, wallLine, toCell, commitPlace, startPlace, zoomAt, guideModel, guideMd, coord, minZ, tapAt, openCard, renderCard, demolish, sendRepair, saveGame, readSave, loadGame, sendVil, setJob, moveVil, orderSet, clsCount, nearestNode, collide, newGame, scoreAll, hurt, sabotage, hire, zeal, zealWhy, learnTech, plunder, fall, sfx, SND, sprite, bldSprite, LOOKS, draw, fit, ui, civKind, marketTrade, findsTick, rehealth, setPause, GOODS, WEATHER, ignite, outbreak, setRoute, postAt, stopsAll, priceAt, estPay, tradeTargets, sickRisk, seasonTurn, upkeepTick, healthTick, guardedCart, dmgOf, rngOf, TICK, route, standOff, built, loyaltyParts, surrenderWhy, vassalsOf, makeVassal, rebel, mkt, hitAt, setPick, picked, order, setRel, relWhy, noticeLeft, demand, forceTribute, levy, releaseAll, breakTies, cancelOrder, qMax, debase, SFX, statusOf, lifeText, SX, SY, mkBld, qcDrop, startEvent, endEvent, EVENTS, EV, HAZARDS, throneB, takeThrone, regardOf, natRegard, giveGift, natState, layTraps, throneHold, payRansom, onLand, lakeGap, hz, levelOf, levelMul, EVM, moonLight, eventsTick, hordeTick, starveTick, todaySeed, get holdSave() { return holdSave; }, get caches() { return { SPR, BSPR, NSPR }; } };

})();
