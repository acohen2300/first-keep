# The runner: opens the game in a phone-sized browser, starts a match from a fixed seed, and steps it by hand.
# Everything that plays the game (check.py, the function map, the picture count) goes through here.
import asyncio, contextlib, functools, hashlib, http.server, json, pathlib, threading
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PHONE = dict(viewport={'width': 390, 'height': 844}, device_scale_factor=3, has_touch=True, is_mobile=True, service_workers='block')

# Counts every picture the game keeps in memory (each canvas it makes), before the game's own code runs.
WATCH = """
window.__cv = [];
const mk = document.createElement.bind(document);
document.createElement = function (t, ...a) { const e = mk(t, ...a); if (String(t).toLowerCase() === 'canvas') window.__cv.push(e); return e; };
if (window.OffscreenCanvas) { const O = window.OffscreenCanvas; window.OffscreenCanvas = function (w, h) { const c = new O(w, h); window.__cv.push(c); return c; }; window.OffscreenCanvas.prototype = O.prototype; }
"""
# Holds the game's clock still until release(): no step runs unless step() asks for it, so the same seed gives the same match.
HOLD = """
window.__hold = true; window.__q = null;
const raf = window.requestAnimationFrame.bind(window);
window.requestAnimationFrame = (f) => (window.__hold ? ((window.__q = f), 0) : raf(f));
window.__release = () => { window.__hold = false; if (window.__q) raf(window.__q); };
"""
PICTURES = "(() => { const a = window.__cv.filter((c) => c.width * c.height > 0); return { count: a.length, mb: Math.round(a.reduce((s, c) => s + c.width * c.height * 4, 0) / 1e6) }; })()"
STATE = "JSON.stringify(pack())"

@contextlib.contextmanager
def served(root=ROOT):
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Quiet, directory=str(root))
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    try: yield f'http://127.0.0.1:{s.server_address[1]}'
    finally: s.shutdown()

@contextlib.asynccontextmanager
async def game(seed=1, root=ROOT):
    """A page with a match begun from `seed` and held still: nothing moves until step() is called."""
    with served(root) as url:
        async with async_playwright() as p:
            b = await p.chromium.launch(channel='chrome', args=['--no-sandbox', '--enable-unsafe-swiftshader'])
            pg = await (await b.new_context(**PHONE)).new_page()
            pg.errors = []
            pg.on('pageerror', lambda e: pg.errors.append(str(e)[:300]))
            pg.on('console', lambda m: pg.errors.append(m.text[:300]) if m.type == 'error' and 'favicon' not in m.text and '404' not in m.text else None)
            await pg.add_init_script(WATCH + HOLD)
            await pg.goto(f'{url}/index.html')
            await pg.locator('button:has-text("Start")').first.tap()
            await pg.evaluate(f'fk.reset({int(seed)}); fk.pause(true);')
            try: yield pg
            finally: await b.close()

async def step(pg, seconds):
    """Runs the match `seconds` of game time, in the game's own fixed steps."""
    await pg.evaluate("(s) => { const DT = 1 / D.step.hz; for (let n = Math.round(s / DT); n > 0; n--) sim(DT); }", seconds)

async def release(pg):
    """Lets the game run and draw on its own clock, as it does on a phone."""
    await pg.evaluate('fk.pause(false); window.__release()')

async def fingerprint(pg):
    return hashlib.sha256((await pg.evaluate(STATE)).encode()).hexdigest()[:16]

async def pictures(pg):
    return await pg.evaluate(PICTURES)
