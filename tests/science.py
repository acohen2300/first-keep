# The science check: every equation in the game against a value worked out by hand or taken from its source (SCIENCE.md), so none can drift.
# Run by the gate:  python3 tests/science.py        (needs first-keep.html built)
import asyncio, os, sys, math
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHECKS = """() => { const F = window.__fk, out = [], near = (name, got, want, tol) => { if (Math.abs(got - want) > tol) out.push(`${name}: got ${got}, want ${want}`); };
  F.newGame(1); const C = F.CLIMATE, Y = F.G.t;
  // Rothermel (1972): η(0) = 1, η(1) = 0 (the fire goes out at the moisture of extinction), η(0.5) = 0.5425
  near('rothermel 0', F.rothermel(0), 1, 1e-9); near('rothermel 1', F.rothermel(1), 0, 1e-9); near('rothermel 0.5', F.rothermel(0.5), 1 - 2.59 * 0.5 + 5.11 * 0.25 - 3.52 * 0.125, 1e-9);
  // the air: its mean over a year is the climate's mean; hottest at mid-Summer, coldest at mid-Winter
  const YEAR = 4 * 180, DAY = 120; let sum = 0, n = 0; for (let t = 0; t < YEAR; t += 1) { sum += F.airTemp(t); n++; } near('air mean', sum / n, C.mean, 0.05);
  let hi = -1e9, lo = 1e9; for (let t = 0; t < YEAR; t += 0.25) { const v = F.airTemp(t); hi = Math.max(hi, v); lo = Math.min(lo, v); }
  near('air swing', hi - lo, 2 * (C.year + C.day), 1); // a 6-day year: the day's peak never lands exactly on the year's near('air periodic', F.airTemp(37) - F.airTemp(37 + YEAR), 0, 1e-9);
  if (F.airTemp(C.peakDay * YEAR) < F.airTemp((C.peakDay + 0.5) * YEAR)) out.push('air: mid-Summer colder than mid-Winter');
  // the chain's long run: the share of wet minutes is P01 / (1 - P11 + P01) (the stationary state of a two-state chain)
  for (const s of ['Spring', 'Summer']) { const [p01, p11] = C.chain[s]; near('chain ' + s, p01 / (1 - p11 + p01), s === 'Spring' ? 0.5 : 0.2307692, 1e-6); }
  // walking: Pandolf's factor as 1/η: full mud over dirt is swamp (1.8), full soft snow 1.6; nothing is free
  F.G.clim.mud = 1; F.G.clim.snow = 0; near('mud factor', 1 / F.groundSpd(0, ['foot']), 1 + C.terrain.mud, 1e-6);
  F.G.clim.mud = 0; F.G.clim.snow = 1; near('snow factor', 1 / F.groundSpd(0, ['foot']), 1 + C.terrain.snow, 1e-6);
  F.G.clim.snow = 0; near('dry factor', F.groundSpd(0, ['foot']), 1, 1e-9);
  // fire: a clear day is 1; soaked ground is 0; a drought is above 1
  F.G.clim.W = C.eq.clear; near('fire clear', F.fireMul(), 1, 1e-9); F.G.clim.W = 1; near('fire soaked', F.fireMul(), 0, 1e-9); F.G.clim.W = C.eq.drought; if (F.fireMul() <= 1) out.push('fire drought: not above a clear day');
  // fire between buildings (Build 61): the t² design fire is a quarter grown at half its time, full after it; the view factor is a quarter at one `near` of gap
  near('fire half grown', F.fireHeat(F.FIRE.grow / 2, 0), 0.25, 1e-9); near('fire full', F.fireHeat(F.FIRE.grow * 3, 0), 1, 1e-9); near('fire one near', F.fireHeat(F.FIRE.grow, F.FIRE.near), 0.25, 1e-9); near('fire three near', F.fireHeat(F.FIRE.grow, 3 * F.FIRE.near), 1 / 16, 1e-9);
  // sight in fog (Koschmieder's cap): nothing sees past the fog's visibility, and a clear day leaves sight alone
  { const G = F.G, u = F.G.units.find((x) => x.owner === 0); const clear = F.sightClear(u), was = G.ev.cur; G.ev.cur = { kind: 'fog' }; if (!(F.sightOf(u) <= 70 && F.sightOf(u) <= clear)) out.push('fog cap: sight ' + F.sightOf(u) + ' past 70'); G.ev.cur = was; near('clear sight', F.sightOf(u), clear, 1e-9); }
  // one home for the first-order lag (Build 62): 63.2% of the gap closes in one tau, 95% in three; and for logistic growth: empty room grows by r, a full room by nothing
  near('relax one tau', F.relax(0, 1, 10, 10), 1 - Math.exp(-1), 1e-9); near('relax three tau', F.relax(0, 1, 10, 30), 1 - Math.exp(-3), 1e-9); near('relax holds', F.relax(0.4, 0.4, 10, 99), 0.4, 1e-9);
  near('logistic small', F.logistic(1, 0.6, 12) - 1, 0.6 * (1 - 1 / 12), 1e-9); near('logistic full', F.logistic(12, 0.6, 12), 12, 1e-9);
  // the break point (Dupuy): a group of ten with breakAt 0.3 breaks a fresh soldier after three losses beside it
  near('break point', 3 * (1 / (F.MORALE.breakAt * 10)), 1, 1e-9);
  // the ground (Build 62). Stefan: ice thickness goes with the square root of the freezing degree-seconds, so twice the cold-time gives √2 the ice.
  { const K = F.CLIMATE, c = { T: -5, W: 1, snow: 0, ice: 0, fdd: 0, mud: 0 }; for (let i = 0; i < 20; i++) F.groundTick(c, 'frost', 1); const h1 = c.ice; for (let i = 0; i < 20; i++) F.groundTick(c, 'frost', 1); near('stefan sqrt', c.ice / h1, Math.SQRT2, 1e-6); if (!(c.mud === 0)) out.push('frozen ground is not hard'); }
  // the degree-day method: melt goes with the degrees above zero; and nothing vanishes: the water that melts out of snow is in the ground
  { const K = F.CLIMATE, m = (T) => { const c = { T, W: 0.5, snow: 1, ice: 0, fdd: 0, mud: 0 }; F.groundTick(c, 'clear', 1); return 1 - c.snow; }; near('melt per degree', m(10) / m(5), 2, 1e-6); if (!(m(-3) === 0)) out.push('snow melts below freezing');
    const c = { T: 10, W: 0, snow: 0.5, ice: 0, fdd: 0, mud: 0 }; F.groundTick(c, 'clear', 1); const w = F.relax(0, K.eq.clear, K.tau.wet, 1); near('melt wets the ground', c.W - w, (0.5 - c.snow) * K.snow.water, 1e-9); }
  // snow at the wet-bulb threshold: rain at 2 °C, snow at 1 (Jennings et al. 2018)
  { const a = { T: 2, W: 0.5, snow: 0, ice: 0, fdd: 0, mud: 0 }, b = { T: 1, W: 0.5, snow: 0, ice: 0, fdd: 0, mud: 0 }; F.groundTick(a, 'snow', 1); F.groundTick(b, 'snow', 1); if (!(a.snow === 0 && b.snow > 0)) out.push('rain-snow threshold: ' + a.snow + ' ' + b.snow); }
  // traction: dry ground offers more grip than mud, mud more than snow, snow more than ice; ice is slickest just below freezing and grips better in deep cold
  { const G = F.G, c = G.clim, was = { ...c }; Object.assign(c, { T: -1, W: 0.2, snow: 0, ice: 0, mud: 0 }); const dry = F.muOf(null); Object.assign(c, { snow: 1 }); const snow = F.muOf(null); Object.assign(c, { snow: 0, ice: 1 }); const ice1 = F.muOf(null); c.T = -20; const ice20 = F.muOf(null);
    if (!(dry > snow && snow > ice1 && ice20 > ice1)) out.push('traction order: ' + [dry, snow, ice1, ice20].map((v) => v.toFixed(2)).join(' '));
    c.T = -1; near('slip on ice, a walker', F.slipChance({ x: 100, y: 100 }, F.CLIMATE.mu.need.foot), 1 / (1 + Math.exp(-(F.CLIMATE.mu.need.foot - ice1) / F.CLIMATE.mu.soft)), 1e-9); Object.assign(c, was); }
  // ruts: depth grows as passes^0.4 toward full at n0 (USFS trafficability)
  { const T = F.ruts(), i = 5 * 50 + 5; const was = T[i]; T[i] = F.CLIMATE.rut.n0 / 4; near('rut quarter', F.rutOf(5 * 40 + 1, 5 * 40 + 1), F.CLIMATE.rut.deep * 0.25 ** 0.4, 1e-9); T[i] = was; }
  // sound (ISO 9613-2): full within d0, then the inverse-square law: twice the distance is half the amplitude (−6 dB), less the air's small take
  // the ear at a height (Build 64): at the closest zoom a sound under the camera is full; zoom out twice as far, half the amplitude (−6 dB); along the ground, twice the slant distance is half
  { const z0 = F.cam.z, H = (z) => F.camH(z), air = (s) => 10 ** ((-F.SOUND.alphaKm * s * F.SOUND.metre) / 1000 / 20);
    F.cam.z = F.ZOOM_MAX; near('hearing under the camera', F.hearing(0), air(H(F.ZOOM_MAX)), 1e-6);
    F.cam.z = F.ZOOM_MAX / 2; near('zoom out twice, half as loud', F.hearing(0), 0.5 * air(H(F.ZOOM_MAX / 2)), 1e-6);
    const h = H(F.cam.z), a = F.hearing(Math.sqrt((4 * h) ** 2 - h * h)), b = F.hearing(Math.sqrt((8 * h) ** 2 - h * h)); near('inverse square on the slant', a / b, 2 * air(4 * h) / air(8 * h), 1e-6); F.cam.z = z0; }
  // a crew on a site: output ∝ n^0.7 (Thomas & Smith 1990: per-worker productivity falls about n^−0.3 with overmanning); two builders 1.6×, four 2.6×
  near('crew of two', 2 ** F.BUILDER_POW, 1.62, 0.02); near('crew of four', 4 ** F.BUILDER_POW, 2.64, 0.02);
  // the sun (the sunrise equation): daylight at 45° N is half the day at the equinox, about 15.4 of 24 hours at midsummer (June 21, day 172) and 8.6 at midwinter (day 355)
  const light = (N) => { let up = 0; for (let k = 0; k < 2400; k++) if (F.sunAltAt(N, k / 2400) > 0) up++; return 24 * up / 2400; };
  near('daylight equinox', light(80), 12, 0.15); near('daylight midsummer', light(172), 15.4, 0.15); near('daylight midwinter', light(355), 8.6, 0.15);
  // the moon: new to new in SYNODIC days; lit fraction 0 at new, 1 at full (Meeus 48.1)
  near('moon new', F.moonPhase(0), 0, 1e-9); near('moon full', F.moonPhase(29.53 * DAY / 2), 0.5, 1e-6);
  // random events are a Poisson process: the exponential wait has mean = mean and standard deviation = mean; the chance over a step is 1 − e^(−rate·dt)
  { let s = 0, s2 = 0; const N = 20000, m = 120; for (let i = 0; i < N; i++) { const t = F.nextIn(m); s += t; s2 += t * t; } const mu = s / N, sd = Math.sqrt(s2 / N - mu * mu); near('exponential mean', mu, m, 3); near('exponential sd', sd, m, 4); }
  { let k = 0; const N = 20000; for (let i = 0; i < N; i++) if (F.hazard(0.05, 1)) k++; near('hazard 0.05', k / N, 1 - Math.exp(-0.05), 0.006); }
  // the power law of lake sizes (Downing et al. 2006: N(area > a) ∝ a^−c, so N(radius > r) ∝ r^−2c), cut to WATER.r: the ends are the bounds, and the
  // share of lakes wider than twice the smallest is (2^−2c − f) / (1 − f), f = (r0/r1)^2c (16% at c 1.06 and 50 to 160)
  { const W = F.WATER, e = 2 * W.c, f = (W.r[0] / W.r[1]) ** e, N = 20000; near('lake smallest', F.lakeSize(0), W.r[0], 1e-9); near('lake largest', F.lakeSize(1), W.r[1], 1e-6);
    let k = 0; for (let i = 0; i < N; i++) if (F.lakeSize((i + 0.5) / N) > 2 * W.r[0]) k++; near('lakes past twice the smallest', k / N, (2 ** -e - f) / (1 - f), 1e-3); }
  // the SIR chain: with R0 = 2 the final size solves z = 1 − e^(−R0 z): 0.7968 (Kermack & McKendrick)
  { const R0 = F.HEALTH.R0; let z = 0.5; for (let i = 0; i < 100; i++) z = 1 - Math.exp(-R0 * z); if (R0 === 2) near('SIR final size', z, 0.7968, 1e-3); }
  // Lanchester's square law as odds: even strength is a coin toss; twice the strength wins 4 in 5
  near('lanchester even', F.lanchester(1), 0.5, 1e-9); near('lanchester double', F.lanchester(2), 0.8, 1e-9);
  // the square law by the group (Build 63): one sword cannot take an elephant; twelve together can, since aimed strength goes as the square
  { F.newGame(3); const G = F.G, k = F.keepOf(0), e = F.addUnit(1, 'elephant', k.x + 120, k.y), one = F.addUnit(0, 'sword', k.x, k.y); G.rel[0][1] = G.rel[1][0] = 'war';
    if (F.canBeat(one, e)) out.push('one sword thinks it beats the elephant'); for (let i = 0; i < 11; i++) F.addUnit(0, 'sword', k.x + (i % 4) * 8, k.y + 10 + Math.floor(i / 4) * 8); G.tick++; if (!F.canBeat(one, e)) out.push('twelve swords will not take the elephant'); }
  // the forager's rate (Charnov 1976): standing on a find beside its drop-off, the rate is the gathering rate itself; a find twice as far
  // from the drop-off pays less; a new field takes the worker earning least on food
  { F.SET.scen = 'open'; F.newGame(4); const G = F.G, k = F.keepOf(0), u = G.units.find((x) => x.owner === 0 && x.kind === 'vil');
    const n = { kind: 'bush', type: 'food', amt: 1e6, x: u.x, y: u.y }, g = F.RATE_OF.bush * F.gatherMul(0, n);
    near('forage at the door', F.forage(u, n, [{ x: u.x, y: u.y }]), g, 1e-6);
    const n2 = { ...n, x: u.x + 300 }; if (!(F.forage(u, n2, [{ x: u.x, y: u.y }]) < F.forage(u, { ...n, x: u.x + 150 }, [{ x: u.x, y: u.y }]))) out.push('forage: farther did not pay less'); }
  // the market on the constant-elasticity curve: 100 food sold to a normal market of 1000 makes the stock 1.1 and the price 1.1^(−1/0.5) = 0.826
  { F.G.mkt.f = 1; F.mktHit('f', 100, -1); near('elastic price', F.mkt('f'), Math.pow(1.1, -1 / F.PRICE.eps.f), 1e-9); near('elastic value', F.mkt('f'), 0.8264, 1e-3); }
  // spoilage on first-order decay: a year of seasons at 5% a year keeps 95%
  { let q = 1000; const k = -Math.log(1 - F.SPOIL.year) / 4; for (let i = 0; i < 4; i++) q *= Math.exp(-k); near('spoil a year', q, 950, 1e-6); }
  return out; }"""
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('file://' + os.path.join(ROOT, 'first-keep.html')); await pg.wait_for_timeout(400)
        bad = await pg.evaluate(CHECKS); await br.close()
    bad += errs
    print(('PASS ' if not bad else 'FAIL ') + 'the equations hold against their sources', '' if not bad else bad)
    sys.exit(1 if bad else 0)
asyncio.run(main())
