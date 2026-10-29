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
  // the sun (the sunrise equation): daylight at 45° N is half the day at the equinox, about 15.4 of 24 hours at midsummer (June 21, day 172) and 8.6 at midwinter (day 355)
  const light = (N) => { let up = 0; for (let k = 0; k < 2400; k++) if (F.sunAltAt(N, k / 2400) > 0) up++; return 24 * up / 2400; };
  near('daylight equinox', light(80), 12, 0.15); near('daylight midsummer', light(172), 15.4, 0.15); near('daylight midwinter', light(355), 8.6, 0.15);
  // the moon: new to new in SYNODIC days; lit fraction 0 at new, 1 at full (Meeus 48.1)
  near('moon new', F.moonPhase(0), 0, 1e-9); near('moon full', F.moonPhase(29.53 * DAY / 2), 0.5, 1e-6);
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
