import asyncio, sys, json, os, time
from playwright.async_api import async_playwright
V = sys.argv[1]; OUT = sys.argv[2]; SEED = '20261105'; PRE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pre.js')).read()
JS = r"""(async () => { const W = (ms) => new Promise((r) => setTimeout(r, ms)), S = MENU.S, q = (s) => [...document.querySelectorAll(s)], vis = (e) => !!e.offsetParent && e.getBoundingClientRect().width > 0;
  document.querySelector('[data-v="opt|len|0"]').click(); await W(150); document.querySelector('[data-v="start||"]').click(); await W(400); $rich(0);
  const h = FK.seatOf(0), near = (f) => { let b = null, bd = 1e9; for (const t of [...FK.things(), ...FK.units()]) if (f(t)) { const d = Math.hypot(t.vx - h.vx, t.vy - h.vy); if (d < bd) { bd = d; b = t; } } return b; };
  const T = {}, codes = [...new Set(Object.values(MENU.SCR.tabs).flat())], failed = [];
  for (const c of codes) { if (c === h.code) { T[c] = h; continue; } let t = null; try { t = $put(c, 0, 6, 60, true); } catch (e) {} if (!t) try { t = $ring(h, 7, 70, (i, j) => { const b = FK.build(c, i, j, FK.SIDES[0].col); if (b) { b.side = 0; b.done = 1; b.hp = b.hpMax = WAR.hpMax(b); return b; } }); } catch (e) {} if (t) T[c] = t; else failed.push(c); }
  let site = null; try { site = $ring(h, 6, 60, (i, j) => { if (!ECON.canPlace('BR1', i, j, 0)) return; const t = FK.build('BR1', i, j, FK.SIDES[0].col); if (t) { t.side = 0; t.done = 0.4; return t; } }); } catch (e) {}
  const sold = []; for (let n = 0; n < 3; n++) { const k = (h.j + h.n + 2) * FK.N + h.i + n; try { sold.push(FK.spawn('UM1', 0, k, FK.rng)); } catch (e) {} }
  window.$ev = []; FK.on('event', (n) => $ev.push(n));
  const name = (t) => (t ? (t.kind === 'bld' || t.kind === 'unit' ? ((FK.SH[t.code] || {}).name || t.code) + (t.side === 0 ? '' : t.side > 0 ? ' (foe)' : ' (wild)') + (t.done != null && t.done < 1 ? ' site' : '') : t.kind) : null);
  const hash = (s) => { s = (s || '').replace(/\d+/g, '#'); let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return x; };
  const txt = (id) => { const e = document.getElementById(id); return e && vis(e) ? e.innerText.replace(/\s+/g, ' ').trim() : ''; };
  const sig = () => { const o = {}; for (const k in S) { const v = S[k]; if (['last', 'tap', 'lastTop', 'bars', 'eta', 'snd', 'eat', 'line', 'mailT', 'firedT', 'aimT', 'doneT', 'dmT', 'game', 'sure', 'vc'].includes(k)) continue; if (v == null || typeof v !== 'object') o['S.' + k] = v ?? null; }
    o.subject = name(S.subject); o.ghost = S.ghost ? S.ghost.code : null; o.ice = !!S.ice; o.dm = !!S.dm; o.cof = name(S.cof); const P = FK.picked(); o.pick = P.length ? P.length + ' ' + name(P[0]) : null; o.ctl = JSON.stringify(S.ctl, (k, v) => (v && typeof v === 'object' && k ? '[o]' : v));
    for (const id of ['rank', 'base', 'panel', 'card', 'spd', 'qa']) { const e = document.getElementById(id); o['dom.' + id] = e && vis(e) ? hash(e.innerHTML) : null; }
    o.top = hash(q('.topbar').map((e) => e.innerHTML).join('')); o.cam = [Math.round(FK.cam.x / 8), Math.round(FK.cam.y / 8), Math.round(FK.cam.z * 10)].join(); o.paused = FK.paused(); o.speed = FK.K.speed ?? null;
    o.w = [FK.units().filter((u) => u.side === 0).length, FK.blds().filter((b) => b.side === 0).length, FK.blds().filter((b) => b.side === 0).reduce((a, b) => a + (b.q || []).length, 0), Object.values(FK.SIDES[0].store).reduce((a, b) => a + (typeof b === 'number' ? Math.round(b / 20) : 0), 0)].join(); return o; };
  const scr = () => { const pg = document.getElementById('panel'); if (pg && vis(pg)) return 'page ' + S.tab; if (S.tab === 'Start') return 'new game'; if (S.ice) return 'ice card'; if (S.war) return 'War'; const P = FK.picked(); if (P.length) return (WAR.armed(P[0]) ? 'army picked' : 'villager picked') + (S.tab ? ' + ' + S.tab : ''); if (S.subject) return 'card: ' + name(S.subject) + (S.tab ? ' (' + S.tab + ' lit)' : ''); if (S.ghost) return 'placing ' + name({ kind: 'bld', code: S.ghost.code, side: 0 }); return S.fold ? 'folded' : S.tab || 'rest'; };
  const rest = () => { clearTimeout(S.doneT); Object.assign(S, { subject: null, tab: null, war: false, ice: null, ghost: null, vpick: null, done: null, exit: null, fold: false, dm: null, arm: null, cs: null, ctab: null, tap: null, aim: null, tool: null, more: false, qa: null, sure: null, cof: null }); if (S.ctl) Object.assign(S.ctl, { page: null, act: null, spot: false, hide: false }); FK.select(null); FK.pause(false); FK.cam.x = h.vx; FK.cam.y = h.vy; FK.cam.follow = false; $rich(0); MENU.render(true); };
  const tapOn = (t, dx = 0, dy = 0) => { FK.cam.x = t.vx; FK.cam.y = t.vy; const [sx, sy] = FK.toScreen(t.vx, t.vy); S.tap = null; FK.tap(sx + dx, sy + dy); MENU.render(true); };
  const click = (v) => { const b = q('[data-v]').find((b) => vis(b) && b.dataset.v === v); if (b) b.click(); return !!b; };
  const vil = () => near((t) => t.kind === 'unit' && t.side === 0 && !WAR.armed(t) && !t.gone && !t.inside);
  const B = { rest: () => {}, Jobs: () => click('mtab|Jobs|'), Build: () => click('mtab|Build|'), 'placing a building': () => { click('mtab|Build|'); const b = q('#base [data-v^="pick|"]').find(vis); if (b) b.click(); }, folded: () => click('mfold||'),
    'villager picked': () => tapOn(vil()), 'villager picked + Jobs': () => { tapOn(vil()); click('mtab|Jobs|'); }, 'villager picked + Build': () => { tapOn(vil()); click('mtab|Build|'); },
    'army unit picked': () => tapOn(sold.find((u) => !u.gone)), War: () => click('war||'), 'page Stores': () => click('tab|Stores'), 'page Score': () => click('tab|Score'), 'page Mail': () => click('mail||'), 'pause card': () => click('pause||') };
  if (site) B['card: building site'] = () => tapOn(site);
  for (const c in T) B['card: ' + name(T[c])] = () => tapOn(T[c]);
  for (const k of ['bush', 'tree', 'gold', 'stone', 'iron', 'fish', 'cemetery', 'ruins', 'den', 'campfire', 'camp', 'treasure', 'drifters', 'stop']) { const t = near((t) => t.kind === k); if (t) B['card: ' + k] = () => tapOn(t); }
  for (const [n, f] of [['wild animal (prey)', (t) => t.kind === 'unit' && t.side < 0 && FK.has(t, 'Prey')], ['wild animal (fights)', (t) => t.kind === 'unit' && t.side < 0 && FK.has(t, 'Wander') && FK.has(t, 'Fight')], ['outlaws', (t) => t.kind === 'unit' && t.code === 'MH1'], ['foe villager', (t) => t.kind === 'unit' && t.side > 0 && !WAR.armed(t)], ['foe Town Center', (t) => t.kind === 'bld' && t.side > 0 && FK.has(t, 'Seat')]]) { const t = near(f); if (t) B['card: ' + n] = () => tapOn(t); }
  const bush = near((t) => t.kind === 'bush');
  const MAP = { 'map: empty ground': () => { const k = $ring(h, 4, 30, (i, j) => { const k = j * FK.N + i; return FK.free && FK.walkable(k) && !FK.things().some((t) => Math.hypot(t.vx - FK.toView(...FK.tileMid(k), FK.D.land)[0], t.vy - FK.toView(...FK.tileMid(k), FK.D.land)[1]) < 40) && k; }); const [vx, vy] = FK.toView(...FK.tileMid(k), FK.D.land); FK.cam.x = vx; FK.cam.y = vy; const [x, y] = FK.toScreen(vx, vy); S.tap = null; FK.tap(x, y); MENU.render(true); },
    'map: own Town Center': () => tapOn(h), 'map: own villager': () => tapOn(vil()), 'map: berry bush': () => tapOn(bush), 'map: own Mill': () => tapOn(T.BI1 || h) };
  window.$list = async (s) => { rest(); await B[s](); await W(60); const seen = new Set(), L = []; for (const b of q('[data-v]')) if (vis(b) && !seen.has(b.dataset.v)) { seen.add(b.dataset.v); const c = b.closest('[id]'); L.push([c ? c.id : 'top', b.dataset.v, (b.innerText || b.getAttribute('aria-label') || b.className || '').replace(/\s+/g, ' ').trim().slice(0, 28), b.disabled || b.classList.contains('off') || b.classList.contains('dis') ? 1 : 0]); } return { is: scr(), L: L.concat(Object.keys(MAP).map((m) => ['map', m, m, 0])), text: txt('rank') + ' || ' + txt('base').slice(0, 160) }; };
  window.$do = async (s, where, v) => { rest(); await B[s](); await W(40); const a = sig(), from = scr(), t0 = FK.K.t, body0 = new Set(document.body.innerText.split('\n').map((x) => x.trim())); $ev.length = 0; let hit = true; try { if (where === 'map') MAP[v](); else hit = click(v); } catch (e) { return { from, err: String(e).slice(0, 120) }; } await W(70);
    const b = sig(), ch = Object.keys(b).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k])), nw = document.body.innerText.split('\n').map((x) => x.trim()).filter((x) => x && !body0.has(x) && !/^\d[\d:,. ]*$/.test(x)).slice(0, 4).map((x) => x.slice(0, 70));
    const wa = a.w.split(',').map(Number), wb = b.w.split(',').map(Number); return { from, to: scr(), hit, ev: $ev.slice(), ch, nw, pick: b.pick, sub: b.subject, tab: b['S.tab'], reload: FK.K.t < t0 || S.tab === 'Start' || wb[1] < wa[1] || wb[0] < wa[0] - 0 }; };
  return { screens: Object.keys(B), failed, n: codes.length, site: !!site, sold: sold.length }; })()"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox']); rows = []; errs = []
        async def boot():
            pg = await b.new_page(viewport={'width': 390, 'height': 844}); pg.on('pageerror', lambda e: errs.append(str(e)[:200])); await pg.add_init_script(PRE)
            await pg.goto('file://' + os.path.join(V, 'index.html') + '#' + SEED); await pg.wait_for_timeout(1500); return pg, await pg.evaluate(JS)
        pg, info = await boot(); print({k: v for k, v in info.items() if k != 'screens'}, len(info['screens']), flush=True); t0 = time.time(); only = sys.argv[3].split(',') if len(sys.argv) > 3 else None
        for s in info['screens']:
            if only and s not in only: continue
            try: L = await pg.evaluate("$list(%s)" % json.dumps(s))
            except Exception as e: rows.append({'screen': s, 'err': str(e)[:200]}); print('LISTERR', s, str(e)[:150], flush=True); await pg.close(); pg, _ = await boot(); continue
            for where, v, label, off in L['L']:
                try: r = await pg.evaluate("$do(%s, %s, %s)" % (json.dumps(s), json.dumps(where), json.dumps(v)))
                except Exception as e: r = {'err': str(e)[:200], 'reload': True}
                r.update(screen=s, where=where, v=v, label=label, off=off, text=L['text']); rows.append(r)
                if r.get('reload'): await pg.close(); pg, _ = await boot()
            print(s, len(L['L']), round(time.time() - t0), flush=True); json.dump(rows, open(OUT, 'w'))
        print('ERRS', len(errs), errs[:5]); await b.close()
asyncio.run(main())
