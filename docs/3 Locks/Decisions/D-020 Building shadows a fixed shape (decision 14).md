# D-020 Building shadows: a fixed shape (decision 14) [2026-11-01 07:45]

- Date: 2026-10-31 16:09 [2026-11-01 07:45]
- Status: locked; its scope replaced by D-021, then D-022 [2026-11-01 07:45]
- Albert's words: 'For round keep round. For static things we invented, like houses, the shape is fixed and a shadow is just a manipulation of a fixed object we know the measurements of.' [2026-11-01 07:45]
- The rule: Rule: round things (trees, bushes, people) keep the oval. Buildings get their own fixed shadow shape, made once per building kind from the table (footprint fp and height h in BLD) and then only moved and stretched to the sun each frame. No per-frame shadow maths for buildings. [2026-11-01 07:45]
- Its source: Source: Blinn 1988, Me and my (fake) shadow, IEEE Computer Graphics and Applications 8(3), from memory, not opened. [2026-11-01 07:45]
- Its code home: Code home: shadowPath and sunShadows, 23-view-things.js 214-252; BLD fp and h; the baked small ellipses (fence posts) and ao() in 19-building-art.js stay. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 1043-1050 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

14. Shadows under and behind (bug 6). DECIDED (Albert, Oct 31, 16:09), in his words: 'For round keep round. For static things we invented, like houses, the shape is fixed and a shadow is just a manipulation of a fixed object we know the measurements of.'
Rule: round things (trees, bushes, people) keep the oval. Buildings get their own fixed shadow shape, made once per building kind from the table (footprint fp and height h in BLD) and then only moved and stretched to the sun each frame. No per-frame shadow maths for buildings.
Equation: a planar projected shadow, a shear of the fixed outline onto the ground: ground point = (x - z cot(alpha) dx, y - z cot(alpha) dy), so a box's shadow is its footprint plus the footprint slid by L = h cot(alpha) away from the sun, capped at CAST.max heights as now. Source: Blinn 1988, Me and my (fake) shadow, IEEE Computer Graphics and Applications 8(3), from memory, not opened.
Keeps the speed: add each building's cached shape to the same single path with a transform (Path2D addPath), so the whole frame still has one fill (Build 62 measured the per-thing fills at 28% of a frame at normal zoom and 53% close in).
Start with the box from fp and h; towers, domes and spires can get their own profile later.
Check at build: the frame cost before and after at normal and close zoom; screenshots at several sun heights.
Code home: shadowPath and sunShadows, 23-view-things.js 214-252; BLD fp and h; the baked small ellipses (fence posts) and ao() in 19-building-art.js stay.
Build list: batch 3.
