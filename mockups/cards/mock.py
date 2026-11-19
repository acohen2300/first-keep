# All menu cards in the card's mold (Drafts 7 and 8; Albert, Nov 19 15:51: "mock all menu cards"). Pages and tiles are the real game's (harvest.json, menus.json, read from v100 at the last age); item cards are Claude's proposal.
import asyncio, json, re, sys
from playwright.async_api import async_playwright
V = '/home/claude/first-keep/frankenstein-refresh/v100'; OUT = '/home/claude/first-keep/mockups/cards/'
H = json.load(open(OUT + 'harvest.json')); M = json.load(open(OUT + 'menus.json')); PANEL = open(OUT + 'panel.js').read()
COST = re.compile(r'^\d+[fwgsi]')
def tile(c):
    p = c.split('/'); n = p[0].rstrip('>'); s = p[-1] if len(p) > 1 and (COST.match(p[-1]) or len(p) == 2) else ''
    return {'n': n, 's': s}
ACTS = ['Repair', 'Demolish', 'Exit']
def building(name, v):
    pages = [('Relations' if p == 'Talk' else p) for p in v['pages'] if p != '-']
    if not pages: return [{'title': name, 'crumb': name, 'pages': [], 'acts': ACTS, 'tiles': []}]
    return [{'title': name, 'crumb': name, 'pages': pages, 'page': ('Relations' if p == 'Talk' else p), 'acts': ACTS, 'tiles': [tile(c) for c in cs][:6], 'more': max(0, len(cs) - 6)} for p, cs in v['pages'].items()]
GROUP = {}
for g, cells in M['Build'].items():
    for c in cells: GROUP[c.split('/')[0]] = g
def group(name): return next((g for k, g in GROUP.items() if name == k or name.startswith(k) or k.startswith(name.split()[0])), None)
sheets = {g: [] for g in ['Town', 'Work', 'Army', 'Keep', 'Tech', 'Other', 'Plain']}
for name, v in H['b'].items():
    ps = building(name, v); sheets['Plain' if not ps[0]['pages'] else (group(name) or 'Other')] += ps
I = {'sword': '<path d="M5 19l3-1 10-10V5h-3L5 15z"/>', 'aim': '<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>', 'shield': '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M12 3v18"/>', 'flag': '<path d="M6 21V4h11l-3 4 3 4H6"/>', 'back': '<path d="M20 12H5M11 6l-6 6 6 6"/>'}
war = lambda last, cls: {'title': 'War Command', 'war': 1, 'pick': [['All', 9], ['Foot', 4], ['Bow', 3], ['Cav', 2], ['Siege', 0], ['Idle', 1], ['Squad', 2]], 'pm': 1, 'acts': ['Exit'], 'tiles': [{'war': 1, 'n': n, 'i': I[i]} for n, i in [('Attack', 'sword'), ('Move', 'aim'), ('Defend', 'shield'), ('Hold', 'flag'), ('Retreat', 'back')]] + [{'war': 1, 'n': last, 'c': cls}]}
jobs = {'title': 'Jobs', 'way': 'Jobs', 'pick': [['Villagers', '6|10'], ['Idle', 0]], 'picked': -1, 'pm': 1, 'acts': ['Exit'], 'tiles': [{'n': 'Villager', 's': '50f'}] + [{'n': n, 's': c, 'c': 'ton' if n == 'Food' else ''} for n, c in [('Food', 5), ('Wood', 1), ('Gold', 0), ('Stone', 0), ('Iron', 0)]]}
builds = [{'title': 'Build', 'way': 'Build', 'pick': [[x, None] for x in M['Build']], 'picked': i, 'acts': ['Exit'], 'tiles': [tile(c) for c in cs]} for i, (g, cs) in enumerate(M['Build'].items())]
sheets['Menus'] = [jobs] + builds + [war('Garrison villagers', ''), war('Back to work', 'tgr')]
item = lambda n, left, unit, on: {'title': n, 'crumb': n, 'pages': [], 'hint': 'Add a villager', 'pm': 1, 'acts': ['Exit'], 'tiles': [], 'info': [f'{left} {unit} left', f'{on} of 4 working']}
sheets['Items'] = [item('Berries', 240, 'food', 2), item('Tree', 310, 'wood', 1), item('Gold', 800, 'gold', 0), item('Stone', 600, 'stone', 0), item('Iron', 600, 'iron', 0), item('Fish', 500, 'food', 0)]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files']); report = {}
        for name, specs in sheets.items():
            cols = 2 if name == 'Plain' else 1
            pg = await b.new_page(viewport={'width': 390 * cols + (cols - 1) * 6, 'height': 300}, device_scale_factor=2)
            await pg.goto('file://' + V + '/index.html#1'); await pg.wait_for_timeout(1200)
            await pg.evaluate("() => { document.body.innerHTML = ''; document.body.style.cssText = 'margin:0;background:#3d7a36;display:flex;flex-wrap:wrap;gap:6px;overflow:auto;height:auto;position:static'; document.documentElement.style.cssText = 'overflow:auto;height:auto'; }")
            await pg.add_script_tag(content=PANEL); over = []
            for sp in specs:
                r = await pg.evaluate("(sp) => fkPanel(sp, false)", sp)
                if r['over'] or r['title'] or sp.get('more'): over.append([sp['title'], sp.get('page', ''), r['over'], r['title'], sp.get('more', 0)])
            await pg.screenshot(path=f'{OUT}sheet-{name}.png', full_page=True); report[name] = {'panels': len(specs), 'overflow': over}; await pg.close()
        print(json.dumps(report, indent=0)); await b.close()
asyncio.run(main())
