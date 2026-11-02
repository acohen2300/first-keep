# D-093 Focus: F means where you put them [2026-11-02 09:06]

- Date: 2026-11-02 08:09 to 08:10; yes yes 08:53 [2026-11-02 09:06]
- Status: locked [2026-11-02 09:06]
- Albert's words: "I have an idea about creating a 'focus' button on the villager card where if you tap it, it stays to do exactly what you say." "You can have an F icon like a z. Which means they are where you put them." "Yes yes" (08:53). [2026-11-02 09:06]
- The rule: Focus on the villager card (four things you do, two and two: Stop, Focus, Send home, Dismiss). A focused villager shows F over its head, drawn as the Z is. It works exactly the find or building it was put on: + and −, building orders and the nearest-builder rule never take it, and the game never steps it to a richer find. It still runs for shelter, then goes back to that very find. When its find is spent it waits there with Z and F. [2026-11-02 09:06]
- One change from what Claude first said: Focus is a stance, as Stand Ground is in Age of Empires II (from memory): your next order re-aims it to the new place, and only the Focus button turns it off (Claude had said a new order ends it). [2026-11-02 09:06]
- Code home: `33-verbs.js` vfocus; `30-cards.js` the villager card; `11-orders.js` setJob (u.fn, u.fpos), moveVil, autoBuilder; `12-sim-core.js` pickVil; `13-sim-civil.js` vilTick; `24-view-overlays.js` idleMark (one drawer for Z and F); `23-view-things.js`. Tests: `tests/moves.py` (the button, + and −, the spent bush); plants p15. [2026-11-02 09:06]
